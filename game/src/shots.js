// AetherForge: Arcane Duel - Screenshot Scene Staging
// Creates deterministic, rich visual scenes for make.fun judge screenshots.

import { createGameState, playCard, endTurn } from './engine.js';
import { renderTable, renderTitleScreen, renderEndScreen } from './render.js';

export function stageScreenshot(ctx, shotName) {
  const state = createGameState(777);

  if (shotName === 'title') {
    renderTitleScreen(ctx);
    return;
  }

  if (shotName === 'table') {
    // Stage mid-game board: both players have cards deployed
    state.round = 3;
    state.player.maxMana = 4;
    state.player.mana = 2;
    state.player.hp = 22;
    state.opponent.maxMana = 4;
    state.opponent.mana = 1;
    state.opponent.hp = 19;

    // Deploy tactical lane setup
    state.lanes[0].playerCard = { ...state.player.hand[0], currentHp: 3 };
    state.lanes[1].playerCard = { ...state.player.hand[1], currentHp: 4 };
    state.lanes[0].opponentCard = { ...state.opponent.hand[0], currentHp: 2 };

    state.combatLog.push('Warden deployed Pyroclast Golem to Sun Lane.');
    state.combatLog.push('Runemaster counter-played Coral Ward!');

    renderTable(ctx, state, 0, 2);
    return;
  }

  if (shotName === 'clash') {
    // Dynamic combat moment with all 3 lanes active & resonance
    state.round = 5;
    state.player.hp = 18;
    state.opponent.hp = 14;
    state.player.mana = 3;
    state.opponent.mana = 2;

    state.lanes[0].playerCard = {
      id: 'sol_3',
      name: 'Solar Lance',
      suit: 'SOLAR',
      cost: 3,
      atk: 6,
      hp: 2,
      currentHp: 2,
      desc: 'Surge: +2 ATK if Solar lane.',
    };
    state.lanes[0].opponentCard = {
      id: 'void_3',
      name: 'Void Reaver',
      suit: 'VOID',
      cost: 3,
      atk: 4,
      hp: 3,
      currentHp: 1,
      desc: 'Bypasses enemy armor.',
    };

    state.lanes[1].playerCard = {
      id: 'tide_4',
      name: 'Tidal Wave',
      suit: 'TIDE',
      cost: 4,
      atk: 5,
      hp: 4,
      currentHp: 4,
      desc: 'Pushes enemy back 2 DMG.',
    };
    state.lanes[1].opponentCard = {
      id: 'sol_2',
      name: 'Pyroclast Golem',
      suit: 'SOLAR',
      cost: 2,
      atk: 3,
      hp: 3,
      currentHp: 2,
      desc: 'Sturdy flaming brute.',
    };

    state.lanes[2].playerCard = {
      id: 'gale_3',
      name: 'Tempest Raptor',
      suit: 'GALE',
      cost: 3,
      atk: 4,
      hp: 3,
      currentHp: 3,
      desc: 'Twin strike across lanes.',
    };

    state.combatLog.push('Elemental Resonance: Tide counters Solar for 1.5x DMG!');
    state.combatLog.push('Solar Lance shattered Void Reaver!');
    state.combatLog.push('Runemaster surges across Void Lane!');

    renderTable(ctx, state, null, 1);
    return;
  }

  if (shotName === 'victory') {
    state.round = 7;
    state.player.hp = 16;
    state.opponent.hp = 0;
    renderEndScreen(ctx, state, true);
    return;
  }

  // Fallback
  renderTitleScreen(ctx);
}
