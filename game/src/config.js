// AetherForge: Arcane Duel - Constants and Card Database

export const SUITS = {
  SOLAR: {
    id: 'SOLAR',
    name: 'Solar Flame',
    color: '#ff4438',
    glow: 'rgba(255, 68, 56, 0.4)',
    symbol: '☀️',
    shape: 'diamond', // visually drawn as glowing diamond/sunburst
    counter: 'VOID',  // deals 1.5x to Void
  },
  TIDE: {
    id: 'TIDE',
    name: 'Abyssal Tide',
    color: '#00a8e8',
    glow: 'rgba(0, 168, 232, 0.4)',
    symbol: '💧',
    shape: 'teardrop', // visually drawn as fluid drop/wave
    counter: 'SOLAR', // deals 1.5x to Solar
  },
  GALE: {
    id: 'GALE',
    name: 'Verdant Gale',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    symbol: '🍃',
    shape: 'leaf',     // visually drawn as blade/leaf
    counter: 'TIDE',  // deals 1.5x to Tide
  },
  VOID: {
    id: 'VOID',
    name: 'Astral Void',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    symbol: '★',
    shape: 'star',     // visually drawn as 6-pointed star
    counter: 'GALE',  // deals 1.5x to Gale
  },
};

// 24 Unique Cards across the 4 suits with distinct cost, attack, health, and ability
export const CARD_CATALOG = [
  // SOLAR SUIT (High damage, burn, direct surge)
  { id: 'sol_1', name: 'Ignite Spark', suit: 'SOLAR', cost: 1, atk: 2, hp: 2, desc: 'Quick spark attack.' },
  { id: 'sol_2', name: 'Pyroclast Golem', suit: 'SOLAR', cost: 2, atk: 3, hp: 3, desc: 'Sturdy flaming brute.' },
  { id: 'sol_3', name: 'Solar Lance', suit: 'SOLAR', cost: 3, atk: 5, hp: 2, desc: 'Surge: +2 ATK if Solar lane.' },
  { id: 'sol_4', name: 'Cinder Phoenix', suit: 'SOLAR', cost: 4, atk: 4, hp: 5, desc: 'Rebirth: Shields hero for 3.' },
  { id: 'sol_5', name: 'Sunburst Ray', suit: 'SOLAR', cost: 2, atk: 4, hp: 1, desc: 'Piercing direct burn.' },
  { id: 'sol_6', name: 'Nova Colossus', suit: 'SOLAR', cost: 5, atk: 7, hp: 6, desc: 'Devastating solar core.' },

  // TIDE SUIT (Shields, healing, tempo)
  { id: 'tide_1', name: 'Tide Strider', suit: 'TIDE', cost: 1, atk: 1, hp: 3, desc: 'Draws a card on play.' },
  { id: 'tide_2', name: 'Coral Ward', suit: 'TIDE', cost: 2, atk: 2, hp: 5, desc: 'Aegis: Absorbs 2 damage.' },
  { id: 'tide_3', name: 'Abyssal Siren', suit: 'TIDE', cost: 3, atk: 3, hp: 4, desc: 'Siphons: Heals hero 2 HP.' },
  { id: 'tide_4', name: 'Tidal Wave', suit: 'TIDE', cost: 4, atk: 5, hp: 4, desc: 'Pushes enemy back 2 DMG.' },
  { id: 'tide_5', name: 'Frost Warden', suit: 'TIDE', cost: 2, atk: 2, hp: 4, desc: 'Freezes enemy lane.' },
  { id: 'tide_6', name: 'Leviathan Maw', suit: 'TIDE', cost: 5, atk: 6, hp: 8, desc: 'Immense deep sea juggernaut.' },

  // GALE SUIT (Swiftness, combo chains, evasion)
  { id: 'gale_1', name: 'Zephyr Sprite', suit: 'GALE', cost: 1, atk: 2, hp: 1, desc: 'Swift: Attacks immediately.' },
  { id: 'gale_2', name: 'Wind Dancer', suit: 'GALE', cost: 2, atk: 3, hp: 2, desc: 'Flank: +1 ATK per other unit.' },
  { id: 'gale_3', name: 'Tempest Raptor', suit: 'GALE', cost: 3, atk: 4, hp: 3, desc: 'Twin strike across lanes.' },
  { id: 'gale_4', name: 'Gale Valkyrie', suit: 'GALE', cost: 4, atk: 5, hp: 4, desc: 'Chain: Grants allies +1 ATK.' },
  { id: 'gale_5', name: 'Breeze Shifter', suit: 'GALE', cost: 2, atk: 2, hp: 3, desc: 'Swaps lanes to dodge.' },
  { id: 'gale_6', name: 'Cyclone Lord', suit: 'GALE', cost: 5, atk: 6, hp: 5, desc: 'Whirlwind cleanses debuffs.' },

  // VOID SUIT (Siphon, piercing, control)
  { id: 'void_1', name: 'Warp Imp', suit: 'VOID', cost: 1, atk: 2, hp: 1, desc: 'Disrupts 1 opponent mana.' },
  { id: 'void_2', name: 'Shadow Stalker', suit: 'VOID', cost: 2, atk: 3, hp: 2, desc: 'Stealth: Cannot be targeted.' },
  { id: 'void_3', name: 'Void Reaver', suit: 'VOID', cost: 3, atk: 4, hp: 3, desc: 'Bypasses enemy armor.' },
  { id: 'void_4', name: 'Astral Weaver', suit: 'VOID', cost: 4, atk: 4, hp: 4, desc: 'Duplicates lowest ally spell.' },
  { id: 'void_5', name: 'Null Sphere', suit: 'VOID', cost: 2, atk: 1, hp: 6, desc: 'Reflects 2 damage back.' },
  { id: 'void_6', name: 'Cosmic Devourer', suit: 'VOID', cost: 5, atk: 7, hp: 5, desc: 'Consumes enemy essence.' },
];
