// AetherForge: Arcane Duel - Program Entrypoint (Node 22 / Node 24)
// Hands in the static game, screenshots, and builds the dossier for the judge.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

// Copy game static assets and scripts to output
const gameSource = join(rootDir, 'game');
const gameTarget = join(outputDir, 'game');
cpSync(gameSource, gameTarget, { recursive: true });

// Copy real gameplay screenshots
const screenSource = join(rootDir, 'screenshots');
const screenTarget = join(outputDir, 'screenshots');
mkdirSync(screenTarget, { recursive: true });
if (existsSync(screenSource)) {
  cpSync(screenSource, screenTarget, { recursive: true });
}

// Generate dossier.json matching makefun grader constraints
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('Successfully generated /output with game files, screenshots, and dossier.json');
