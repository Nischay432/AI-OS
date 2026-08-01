---
id: TPL-GAME-001
title: Game Starter — Godot 4
version: 0.5.0
status: Stable
owner: Nischay
depends_on: [REF-DECISIONS-001]
last_updated: 2026-08-02
---

# Game Starter — Godot 4

Backed by DECISION-003 (see `reference/decisions-log.md`).

This is a real, boot-able Godot 4 project — not just a guide. Open the folder in Godot 4, hit Run, and a window opens showing a label confirming the scaffold works. That's the entire point of this file set: prove the pipeline before any real game logic exists.

## Contents
- `project.godot` — project config, GL Compatibility renderer (broadest hardware/export support, matches the "everywhere" goal in `profiles/platforms.yaml`)
- `scenes/main.tscn` — root scene, a `Node2D` with one `Label`
- `scripts/main.gd` — GDScript attached to the root, just logs a boot confirmation
- `assets/sprites/`, `assets/audio/` — empty, for the first real project's art/audio

## Setup
1. Install Godot 4 (free): https://godotengine.org/download
2. Open Godot -> Import -> select this folder's `project.godot`
3. Press Run (F5) — the window shows the label "AI-OS game starter — boots and runs." and the console prints "AI-OS game starter running."

Note: `project.godot` pins `config/features` to the Godot version that last opened it (currently "4.3"). A newer Godot 4.x will offer to upgrade the tag on first open — accept it; that's expected, not drift.

## Conventions for the first real project
- One `.tscn` per screen/level/major entity, mirrored by a `.gd` script of the same name where logic is needed
- Keep autoloads (global singletons) minimal - same "one source of truth" rule as the rest of AI-OS
- GDScript by default (per DECISION-003); switch to C# only if a specific project needs it

## Graduation trigger
The first time a real game mechanic gets built on top of this (movement, a game loop, a UI system) — the project stops being "the starter" and becomes "project X, forked from the starter"; log what was learned. Keep the clean starter as-is in this folder for the next project.
