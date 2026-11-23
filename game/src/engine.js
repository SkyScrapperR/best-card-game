// AetherForge: Arcane Duel - Core Deterministic Engine
import { SUITS, CARD_CATALOG } from './config.js';

export { SUITS, CARD_CATALOG as CARDS };

// Simple seeded pseudo-random generator
export function createRng(seed = 12345) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function shuffleDeck(cards, rng) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function createGameState(seed = 1) {
  const rng = createRng(seed);
  const playerDeck = shuffleDeck(CARD_CATALOG, rng);
  const opponentDeck = shuffleDeck(CARD_CATALOG, rng);

  const state = {
    seed,
    round: 1,
    turn: 'player', // 'player' | 'opponent'
    phase: 'PLAY',  // 'TITLE' | 'PLAY' | 'COMBAT' | 'WIN' | 'LOSS'
    winner: null,
    combatLog: ['Duel commences! Forge your runes!'],
    lanes: [
      { id: 0, name: 'Sun Lane', playerCard: null, opponentCard: null, bonusSuit: 'SOLAR' },
      { id: 1, name: 'Tide Lane', playerCard: null, opponentCard: null, bonusSuit: 'TIDE' },
      { id: 2, name: 'Void Lane', playerCard: null, opponentCard: null, bonusSuit: 'VOID' },
    ],
    player: {
      name: 'Runemaster',
      hp: 25,
      maxHp: 25,
      mana: 2,
      maxMana: 2,
      shield: 0,
      hand: [],
      deck: playerDeck,
      graveyard: [],
    },
    opponent: {
      name: 'Clockwork Warden',
      hp: 25,
      maxHp: 25,
      mana: 2,
      maxMana: 2,
      shield: 0,
      hand: [],
      deck: opponentDeck,
      graveyard: [],
      intent: null, // telegraphed next move
    },
  };

  // Draw initial 4 cards for each player
  for (let i = 0; i < 4; i++) {
    drawCard(state, 'player');
    drawCard(state, 'opponent');
  }

  // Generate initial opponent telegraph
  planOpponentTurn(state);

  return state;
}

export function drawCard(state, entityName) {
  const entity = state[entityName];
  if (entity.deck.length === 0 && entity.graveyard.length > 0) {
    entity.deck = shuffleDeck(entity.graveyard, createRng(state.seed + state.round));
    entity.graveyard = [];
  }
  if (entity.deck.length > 0 && entity.hand.length < 6) {
    const card = entity.deck.pop();
    entity.hand.push({ ...card, currentHp: card.hp });
    return card;
  }
  return null;
}

export function playCard(state, entityName, handIndex, laneIndex) {
  const entity = state[entityName];
  if (handIndex < 0 || handIndex >= entity.hand.length) return false;
  if (laneIndex < 0 || laneIndex >= state.lanes.length) return false;

  const card = entity.hand[handIndex];
  if (entity.mana < card.cost) return false;

  const lane = state.lanes[laneIndex];
  const cardProp = entityName === 'player' ? 'playerCard' : 'opponentCard';
  if (lane[cardProp] !== null) return false; // Lane already occupied

  // Spend mana and place card
  entity.mana -= card.cost;
  entity.hand.splice(handIndex, 1);
  lane[cardProp] = card;

  // Lane affinity bonus
  if (lane.bonusSuit === card.suit) {
    card.atk += 1;
    state.combatLog.push(`${entity.name}'s ${card.name} resonates with ${lane.name} (+1 ATK)!`);
  } else {
    state.combatLog.push(`${entity.name} deployed ${card.name} to ${lane.name}.`);
  }

  return true;
}

export function planOpponentTurn(state) {
  const ai = state.opponent;
  if (ai.hand.length === 0) {
    ai.intent = { type: 'PASS', text: 'Conserving Aether energy' };
    return;
  }

  // Find affordable cards
  const affordable = ai.hand
    .map((c, idx) => ({ card: c, handIndex: idx }))
    .filter((entry) => entry.card.cost <= ai.mana);

  // Find empty lanes for opponent
  const emptyLanes = state.lanes
    .map((l, idx) => ({ lane: l, laneIndex: idx }))
    .filter((entry) => entry.lane.opponentCard === null);

  if (affordable.length > 0 && emptyLanes.length > 0) {
    // Prefer countering player's card if present
    let chosenCard = affordable[0];
    let chosenLane = emptyLanes[0];

    for (const laneEntry of emptyLanes) {
      if (laneEntry.lane.playerCard) {
        const pCard = laneEntry.lane.playerCard;
        const counter = affordable.find((a) => SUITS[a.card.suit].counter === pCard.suit);
        if (counter) {
          chosenCard = counter;
          chosenLane = laneEntry;
          break;
        }
      }
    }

    ai.intent = {
      type: 'PLAY',
      handIndex: chosenCard.handIndex,
      laneIndex: chosenLane.laneIndex,
      cardName: chosenCard.card.name,
      suit: chosenCard.card.suit,
      cost: chosenCard.card.cost,
      laneName: chosenLane.lane.name,
      text: `Telegraph: Deploying ${chosenCard.card.name} (${chosenCard.card.suit}) in ${chosenLane.lane.name}`,
    };
  } else {
    ai.intent = { type: 'PASS', text: 'Warden is gathering mana' };
  }
}

export function executeOpponentTurn(state) {
  if (state.opponent.intent && state.opponent.intent.type === 'PLAY') {
    const { handIndex, laneIndex } = state.opponent.intent;
    if (handIndex < state.opponent.hand.length && state.lanes[laneIndex].opponentCard === null) {
      playCard(state, 'opponent', handIndex, laneIndex);
    }
  }
}

export function resolveCombat(state) {
  state.combatLog.push(`--- Round ${state.round} Clash ---`);

  for (const lane of state.lanes) {
    const pCard = lane.playerCard;
    const oCard = lane.opponentCard;

    if (pCard && oCard) {
      // Direct clash
      let pDamage = pCard.atk;
      let oDamage = oCard.atk;

      // Suit advantage multipliers
      if (SUITS[pCard.suit].counter === oCard.suit) {
        pDamage = Math.floor(pDamage * 1.5);
        state.combatLog.push(`Resonance! ${pCard.name} counters ${oCard.name} for ${pDamage} DMG!`);
      } else if (SUITS[oCard.suit].counter === pCard.suit) {
        oDamage = Math.floor(oDamage * 1.5);
        state.combatLog.push(`Counter! ${oCard.name} counters ${pCard.name} for ${oDamage} DMG!`);
      }

      pCard.currentHp -= oDamage;
      oCard.currentHp -= pDamage;

      if (pCard.currentHp <= 0) {
        state.combatLog.push(`${pCard.name} shattered in ${lane.name}!`);
        state.player.graveyard.push(pCard);
        lane.playerCard = null;
      }
      if (oCard.currentHp <= 0) {
        state.combatLog.push(`${oCard.name} shattered in ${lane.name}!`);
        state.opponent.graveyard.push(oCard);
        lane.opponentCard = null;
      }
    } else if (pCard && !oCard) {
      // Direct hit on opponent hero
      state.opponent.hp = Math.max(0, state.opponent.hp - pCard.atk);
      state.combatLog.push(`${pCard.name} breached ${lane.name} and dealt ${pCard.atk} DMG to Warden!`);
    } else if (!pCard && oCard) {
      // Direct hit on player hero
      state.player.hp = Math.max(0, state.player.hp - oCard.atk);
      state.combatLog.push(`${oCard.name} stormed ${lane.name} and dealt ${oCard.atk} DMG to Runemaster!`);
    }
  }

  checkGameOver(state);
}

export function endTurn(state) {
  // 1. AI plays according to telegraphed intent
  executeOpponentTurn(state);

  // 2. Resolve lane clashes & damage
  resolveCombat(state);

  if (state.winner) return state;

  // 3. Advance round & increment mana
  state.round += 1;
  const nextMaxMana = Math.min(10, state.round + 1);
  state.player.maxMana = nextMaxMana;
  state.player.mana = nextMaxMana;
  state.opponent.maxMana = nextMaxMana;
  state.opponent.mana = nextMaxMana;

  // Draw new cards
  drawCard(state, 'player');
  drawCard(state, 'opponent');

  // Plan opponent next move for telegraphing
  planOpponentTurn(state);

  return state;
}

export function checkGameOver(state) {
  if (state.opponent.hp <= 0 && state.player.hp <= 0) {
    state.winner = 'draw';
    state.phase = 'LOSS';
  } else if (state.opponent.hp <= 0) {
    state.winner = 'player';
    state.phase = 'WIN';
    state.combatLog.push('VICTORY! The Clockwork Warden collapses!');
  } else if (state.player.hp <= 0) {
    state.winner = 'opponent';
    state.phase = 'LOSS';
    state.combatLog.push('DEFEAT! Your aether barrier has collapsed!');
  }
  return state.winner;
}
