#!/usr/bin/env node
// AI-OS convention validator. Zero dependencies, Node >= 18.
// Enforces: frontmatter shape, ID uniqueness, cross-reference integrity,
// version consistency (DECISION-004), internal path existence, decision-log
// format, staleness warnings, Godot boot-string parity.
// Exit 0 = green, exit 1 = violations found.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file} — ${msg}`);
const warn = (file, msg) => warnings.push(`${file} — ${msg}`);

// ---------- collect files ----------
const SKIP_DIRS = new Set([".git", ".godot", "node_modules"]);
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out);
    } else out.push(full);
  }
  return out;
}
const files = walk(ROOT).map((f) => relative(ROOT, f).split(sep).join("/"));
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

// Frontmatter convention applies to repo docs, not tool config (.claude/.github
// use their own frontmatter schemas).
const mdFiles = files.filter((f) => f.endsWith(".md"));
const docMd = mdFiles.filter(
  (f) => !f.startsWith(".claude/") && !f.startsWith(".github/")
);
const yamlFiles = files.filter(
  (f) => (f.endsWith(".yaml") || f.endsWith(".yml")) && !f.startsWith(".github/")
);

// ---------- 1. frontmatter presence + shape ----------
const REQUIRED_KEYS = ["id", "title", "version", "status", "owner", "depends_on", "last_updated"];
const STATUSES = new Set(["Stable", "Living document", "Draft"]);
const TODAY = "2026-08-02" <= new Date().toISOString().slice(0, 10)
  ? new Date().toISOString().slice(0, 10)
  : "2099-01-01"; // date sanity ceiling

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

const frontmatters = new Map(); // file -> fm
for (const f of docMd) {
  const fm = parseFrontmatter(read(f));
  if (!fm) { err(f, "missing frontmatter block"); continue; }
  frontmatters.set(f, fm);
  for (const k of REQUIRED_KEYS) if (!(k in fm)) err(f, `frontmatter missing key '${k}'`);
  if (fm.version && !/^\d+\.\d+\.\d+$/.test(fm.version)) err(f, `version '${fm.version}' is not semver`);
  if (fm.status && !STATUSES.has(fm.status)) err(f, `status '${fm.status}' not in {${[...STATUSES].join(", ")}}`);
  if (fm.last_updated) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.last_updated)) err(f, `last_updated '${fm.last_updated}' not YYYY-MM-DD`);
    else if (fm.last_updated > TODAY) err(f, `last_updated '${fm.last_updated}' is in the future`);
  }
}

// ---------- 2. ID registry + uniqueness ----------
const defined = new Map(); // id -> file
function define(id, file) {
  if (defined.has(id) && defined.get(id) !== file) err(file, `duplicate ID '${id}' (also defined in ${defined.get(id)})`);
  else defined.set(id, file);
}
for (const [f, fm] of frontmatters) if (fm.id) define(fm.id, f);
for (const f of yamlFiles) {
  const m = read(f).match(/^#\s*id:\s*(\S+)/m);
  if (m) define(m[1], f);
  else err(f, "missing '# id:' header comment");
}
// heading/bold-defined IDs
for (const f of docMd) {
  const text = read(f);
  for (const m of text.matchAll(/^###\s+(DECISION-\d+):/gm)) define(m[1], f);
  for (const m of text.matchAll(/^##\s+(EVAL-\d+):/gm)) define(m[1], f);
  for (const m of text.matchAll(/^\*\*(PRINCIPLE-\d+)\s/gm)) define(m[1], f);
}

// ---------- 3. cross-reference integrity ----------
const CITE_RE = /\b((?:[A-Z][A-Z0-9]*-)+\d{3})\b/g;
for (const f of [...docMd, ...yamlFiles, ".claude/skills/log-decision/SKILL.md", ".claude/rules/templates.md"]) {
  if (!files.includes(f)) continue;
  for (const m of read(f).matchAll(CITE_RE)) {
    const id = m[1];
    if (!defined.has(id)) err(f, `cites undefined ID '${id}'`);
  }
}
// depends_on entries resolve
for (const [f, fm] of frontmatters) {
  if (!fm.depends_on) continue;
  const ids = fm.depends_on.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
  for (const id of ids) if (!defined.has(id)) err(f, `depends_on references undefined ID '${id}'`);
}

// ---------- 4. version consistency (DECISION-004) ----------
const changelog = read("CHANGELOG.md");
const versions = [...changelog.matchAll(/^##\s+\[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
if (versions.length === 0) err("CHANGELOG.md", "no version entries found");
const repoVersion = versions[0];
const known = new Set(versions);
const cmp = (a, b) => {
  const A = a.split(".").map(Number), B = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (A[i] !== B[i]) return A[i] - B[i];
  return 0;
};
for (const [f, fm] of frontmatters) {
  if (!fm.version) continue;
  if (cmp(fm.version, repoVersion) > 0) err(f, `version ${fm.version} exceeds repo version ${repoVersion}`);
  if (!known.has(fm.version)) err(f, `version ${fm.version} has no CHANGELOG entry`);
}
if (/^version:/m.test(read("configs/os-config.yaml")))
  err("configs/os-config.yaml", "contains a 'version:' key — repo version lives in CHANGELOG.md only (DECISION-004)");

// ---------- 5. internal path existence ----------
const CHECK_PREFIXES = ["configs/", "profiles/", "docs/", "reference/", "templates/", "prompts/", "scripts/", ".github/"];
const ROOT_DOCS = /^(README|MISSION|PRINCIPLES|DECISION_FRAMEWORK|SYSTEM|CLAUDE|ROADMAP|CHANGELOG|PHASES)\.md$/;
for (const f of docMd) {
  if (f === "CHANGELOG.md") continue; // append-only history — may name since-removed files
  const fileDir = f.includes("/") ? f.slice(0, f.lastIndexOf("/")) : "";
  for (const m of read(f).matchAll(/`([^`\n]+)`/g)) {
    const p = m[1];
    if (p.includes("<") || p.includes("*") || p.startsWith("~")) continue;
    const checkable = ROOT_DOCS.test(p) || CHECK_PREFIXES.some((pre) => p.startsWith(pre));
    if (!checkable || !/\.\w+$/.test(p)) continue;
    // a path may be repo-relative or relative to the doc's own folder (template READMEs)
    if (!existsSync(join(ROOT, p)) && !existsSync(join(ROOT, fileDir, p)))
      err(f, `references non-existent path '${p}'`);
  }
}

// ---------- 6. decision-log format + contiguous numbering ----------
{
  const log = read("reference/decisions-log.md");
  const blocks = log.split(/^### /m).slice(1);
  const nums = [];
  for (const b of blocks) {
    const head = b.split("\n")[0];
    const m = head.match(/^DECISION-(\d+):/);
    if (!m) { err("reference/decisions-log.md", `malformed heading '### ${head}'`); continue; }
    nums.push(Number(m[1]));
    for (const req of ["Options considered", "Chose", "Why", "Reversible", "Date"])
      if (!b.includes(req)) err("reference/decisions-log.md", `DECISION-${m[1]} missing '${req}'`);
  }
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++)
    if (sorted[i] !== i + 1) { err("reference/decisions-log.md", `DECISION numbering not contiguous (found ${sorted.join(",")})`); break; }
}

// ---------- 7. staleness (non-fatal) ----------
const STALE_DAYS = 180;
for (const [f, fm] of frontmatters) {
  if (fm.status === "Living document" && /^\d{4}-\d{2}-\d{2}$/.test(fm.last_updated ?? "")) {
    const age = (Date.now() - Date.parse(fm.last_updated)) / 86400000;
    if (age > STALE_DAYS) warn(f, `Living document untouched for ${Math.round(age)} days — review it`);
  }
}

// ---------- 8. Godot boot-string parity ----------
{
  const gd = read("templates/game-godot-starter/scripts/main.gd");
  const readme = read("templates/game-godot-starter/README.md");
  const m = gd.match(/print\("([^"]+)"\)/);
  if (!m) err("templates/game-godot-starter/scripts/main.gd", "no print() boot string found");
  else if (!readme.includes(m[1]))
    err("templates/game-godot-starter/README.md", `boot string '${m[1]}' from main.gd not quoted verbatim`);
}

// ---------- report ----------
for (const w of warnings) console.log(`WARN  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  console.error(`\n${errors.length} violation(s). Repo version: ${repoVersion}`);
  process.exit(1);
}
console.log(`OK — ${docMd.length} docs, ${defined.size} IDs, repo version ${repoVersion}, 0 violations.`);
