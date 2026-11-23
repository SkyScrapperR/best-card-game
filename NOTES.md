# NOTES: Make the Best Card Game

## Bounty Overview
- **Competition**: `best-card-game-20261122-1826`
- **Title**: Make the best card game
- **URL**: https://make.fun/bounty/best-card-game-20261122-1826
- **Pot**: $50.00 USDC on Solana (Escrowed)
- **Top 10 Rewards**: 1st $12, 2nd $8, 3rd $6, 4th $5, 5th $4, 6th-10th $3 each. Top 10 hosted on `makefun.gg`.

## Deadlines & Schedule
- **Opens At**: 2026-11-22 18:26:00 UTC (2026-11-23 02:26:00 WITA)
- **Closes At (Deadline)**: **2026-11-23 06:26:00 UTC**
- **Deadline in WITA (UTC+8)**: **2026-11-23 14:26:00 WITA**
- **Current Local Time**: ~11:39 WITA (03:39 UTC) — **~2 hours 47 minutes remaining!**

## Quotas & Limits
- **Submissions**: Max 10 per UTC day, 20 total.
- **Attempts**: Up to 50 submissions per day.
- **Active Entry**: Your final entry is the most recent valid submission before deadline.

## What to Build
A complete, original, tactical 1v1 desktop browser card game that runs locally with zero network requests:
- **Runtime**: Static HTML5/JS/CSS under `game/` running on desktop Chrome, keyboard & mouse controls.
- **Deliverables**:
  1. `main.ts` (Node 22 entrypoint) at root copying `game/` and `screenshots/` to `/output` and building `dossier.json`.
  2. `vendor/makefun-game.ts` (unchanged from kit).
  3. `game/index.html` (entry point < 1 MiB) + modular source scripts. Total `game/` < 993 files, < 48 MiB.
  4. `screenshots/` (3 or 4 PNG/JPEG images, long side <= 1280px, short side >= 480px, <= 256 KiB each). Real renders of the game!
     - Screenshot 1 (Cover): Title screen with game mode / start prompt.
     - Screenshot 2: Active gameplay table (player's hand, opponent's hand, battlefield/lanes, life/mana totals, readable values & distinct suit shapes/colors).
     - Screenshot 3: Combat / card clash / special effect / reaction in action.
     - Screenshot 4: Victory / Defeat screen with scores and restart option.
  5. `LICENSE`: OSI-approved (MIT).
  6. `.makefun/owner.json`: `{"wallet": "HwWLNEaJojq8rxeWWFutGK5QH4NqETXo7k4Bsoz4YSeu"}`.
  7. AI transcript bundle (`transcripts.tar.gz`).

## How It Is Judged
Sealed scorer verifies `/output` constraints, then AI judge (`z-ai/glm-5.3-flash` on OpenRouter, high reasoning effort, max 17,200 tokens) evaluates pairwise matches on a contact sheet (cover on top, others below) + source code outline.

### 5 Criteria (Ranked in Priority Order):
1. **Completeness & Playability** (Highest Priority): Complete card game shown in screenshots: title screen, table with player hand and opponent hand, cards with readable values and suits/costs, visible score/life totals, win and loss screens.
2. **Fun & Depth**: Decision-making in every hand, card combinations, readable AI opponent counter-strategies.
3. **Feel & Polish**: Card movement (slide, flip, snap into place), weight in dealing, flourish on victory.
4. **Look & Originality**: Legible cards at thumbnail size, mood-setting table, suits/costs distinct by both **color AND shape** (never text alone). Fully original art, theme, lore, names.
5. **Structure**: Clean modular source code with well-named files and functions (highlighted in the outline).

## The Tie-Break Rules
1. Bradley-Terry model calculates win rate against the field.
2. Playoff contenders rank above non-playoff entries.
3. Contenders rank above cut entries.
4. Head-to-head match wins break ties between equal rates.
5. **EARLIEST RECEIPT**: First submitted entry wins exact ties!
   -> **Critical Strategy**: Ship a verified, working safety entry as early as possible to lock in early receipt timestamp.

## Game Design Concept: "AetherForge: Arcane Duel"
- **Theme**: Elemental Alchemical Artificers dueling at an ancient arcane table.
- **Mechanics**:
  - 4 Elemental Suits: **Solar Fire** (Ruby Sun/Diamond ☀️), **Abyssal Tide** (Sapphire Wave/Teardrop 💧), **Verdant Gale** (Emerald Leaf/Triangle 🍃), **Astral Void** (Amethyst Star/Pentagon ⭐).
  - Both Color + Shape for instant thumbnail legibility.
  - Life: 20 HP each. Mana/Aether pool expanding each turn.
  - Lanes / Field: Tactical 3-lane combat or dynamic clash system.
  - Reactive combos: Elemental resonance (e.g., Fire + Tide = Steam burst, Gale + Fire = Inferno wave).
  - Clear AI opponent with visible intent/telegraphing for deep counter-play.

## Submission Ledger
| # | Commit SHA | Title | Time (WITA) | Status | Rank / Notes |
|---|------------|-------|-------------|--------|--------------|
| - | Pending | - | - | Initializing | - |
