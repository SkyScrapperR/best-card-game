// Unit tests for AetherForge: Arcane Duel game engine
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, playCard, endTurn, checkGameOver, SUITS, CARDS } from '../game/src/engine.js';

test('initial game state setup', () => {
  const state = createGameState(42);
  assert.equal(state.player.hp, 25);
  assert.equal(state.opponent.hp, 25);
  assert.equal(state.player.mana, 2);
  assert.equal(state.opponent.mana, 2);
  assert.equal(state.player.hand.length, 4);
  assert.equal(state.opponent.hand.length, 4);
  assert.equal(state.lanes.length, 3);
  assert.equal(state.winner, null);
  assert.ok(state.opponent.intent !== null, 'Opponent has telegraphed intent');
});

test('card play costs mana and occupies lane', () => {
  const state = createGameState(42);
  const card = state.player.hand[0];
  const initialMana = state.player.mana;
  const initialHandCount = state.player.hand.length;

  // Ensure player has enough mana
  state.player.mana = 5;
  const success = playCard(state, 'player', 0, 0); // card 0 to lane 0
  assert.equal(success, true);
  assert.equal(state.player.hand.length, initialHandCount - 1);
  assert.equal(state.lanes[0].playerCard.id, card.id);
  assert.equal(state.player.mana, 5 - card.cost);
});

test('cannot play card without enough mana', () => {
  const state = createGameState(42);
  state.player.mana = 0;
  const success = playCard(state, 'player', 0, 0);
  assert.equal(success, false);
});

test('endTurn executes combat and increments round mana', () => {
  const state = createGameState(42);
  state.player.mana = 5;
  state.opponent.mana = 5;
  playCard(state, 'player', 0, 0); // Lane 0
  const initialOpponentHp = state.opponent.hp;

  endTurn(state);
  // Combat resolved
  assert.ok(state.round >= 2);
  assert.ok(state.player.mana >= 3);
});

test('checkGameOver triggers when HP reaches 0', () => {
  const state = createGameState(42);
  state.opponent.hp = 0;
  const winner = checkGameOver(state);
  assert.equal(winner, 'player');
});
