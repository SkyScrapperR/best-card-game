// AetherForge: Arcane Duel - Canvas Renderer
// Renders the battle table, modular cards, elemental icons, and HUD with high visual clarity.

import { SUITS } from './config.js';

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export function drawShape(ctx, shape, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();

  if (shape === 'diamond') {
    // Solar Flame Diamond
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
  } else if (shape === 'teardrop') {
    // Abyssal Tide Wave / Drop
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size, y, x + size * 0.8, y + size, x, y + size);
    ctx.bezierCurveTo(x - size * 0.8, y + size, x - size, y, x, y - size);
    ctx.closePath();
  } else if (shape === 'leaf') {
    // Verdant Gale Leaf Blade
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x + size * 1.2, y, x, y + size);
    ctx.quadraticCurveTo(x - size * 1.2, y, x, y - size);
    ctx.closePath();
  } else if (shape === 'star') {
    // Astral Void 6-point Star
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const innerAngle = angle + Math.PI / 6;
      const rOuter = size;
      const rInner = size * 0.5;
      if (i === 0) ctx.moveTo(x + Math.cos(angle) * rOuter, y + Math.sin(angle) * rOuter);
      else ctx.lineTo(x + Math.cos(angle) * rOuter, y + Math.sin(angle) * rOuter);
      ctx.lineTo(x + Math.cos(innerAngle) * rInner, y + Math.sin(innerAngle) * rInner);
    }
    ctx.closePath();
  } else {
    // Circle fallback
    ctx.arc(x, y, size, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawCard(ctx, card, x, y, width, height, isSelected = false, isHovered = false) {
  const suit = SUITS[card.suit];

  ctx.save();
  // Card base shadow
  ctx.shadowColor = isSelected ? '#ffea00' : isHovered ? suit.color : 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = isSelected ? 24 : isHovered ? 16 : 8;

  // Outer Frame
  ctx.fillStyle = '#16192b';
  ctx.strokeStyle = isSelected ? '#ffea00' : suit.color;
  ctx.lineWidth = isSelected ? 4 : 2.5;

  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 10);
  ctx.fill();
  ctx.stroke();

  // Reset shadow for inner elements
  ctx.shadowBlur = 0;

  // Header band
  ctx.fillStyle = suit.color;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 4, width - 8, 28, [6, 6, 0, 0]);
  ctx.fill();

  // Mana Cost Gem (Top-Left)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + 18, y + 18, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${card.cost}`, x + 18, y + 18);

  // Card Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.name, x + width / 2 + 6, y + 18);

  // Central Art Box
  ctx.fillStyle = '#0a0d18';
  ctx.fillRect(x + 8, y + 36, width - 16, height * 0.45);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.strokeRect(x + 8, y + 36, width - 16, height * 0.45);

  // Prominent Suit Icon & Shape in Center
  drawShape(ctx, suit.shape, x + width / 2, y + 36 + height * 0.22, 22, suit.color);

  // Suit Name & Counter Hint
  ctx.fillStyle = suit.color;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${suit.name} (${suit.symbol})`, x + width / 2, y + 36 + height * 0.45 - 8);

  // Ability description
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  const descY = y + height * 0.72;
  ctx.fillText(card.desc, x + width / 2, descY, width - 16);

  // Attack & Health Badges at Bottom
  // ATK Badge (Sword / Red)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(x + 8, y + height - 26, 32, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`⚔ ${card.atk}`, x + 24, y + height - 16);

  // HP Badge (Shield / Green)
  const currentHp = card.currentHp ?? card.hp;
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.roundRect(x + width - 40, y + height - 26, 32, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`♥ ${currentHp}`, x + width - 24, y + height - 16);

  ctx.restore();
}

export function renderTable(ctx, state, selectedHandIndex = null, hoveredLane = null) {
  // 1. Table Background: Deep Arcane Indigo with subtle rune grid
  ctx.fillStyle = '#080a14';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Arcane Circle in Table Center
  ctx.save();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 140, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Opponent Sentinel Banner (Top)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(40, 20, CANVAS_WIDTH - 80, 70);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(40, 20, CANVAS_WIDTH - 80, 70);

  // Opponent Portrait & Name
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🤖 ${state.opponent.name}`, 60, 52);

  // Opponent HP Bar
  const oppHpPct = Math.max(0, state.opponent.hp / state.opponent.maxHp);
  ctx.fillStyle = '#374151';
  ctx.fillRect(260, 38, 200, 18);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(260, 38, 200 * oppHpPct, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${state.opponent.hp} / ${state.opponent.maxHp} HP`, 360, 51);

  // Opponent Mana Crystals
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Aether: ${state.opponent.mana}/${state.opponent.maxMana} 💎`, 480, 52);

  // Telegraphed Intent (Core Tactical Feature)
  if (state.opponent.intent) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(700, 28, 480, 54);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(700, 28, 480, 54);

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`👁 TELEGRAPHED INTENT:`, 715, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText(state.opponent.intent.text, 715, 68);
  }
  ctx.restore();

  // 3. Middle: 3 Tactical Lanes (Sun, Tide, Void)
  const laneWidth = 220;
  const laneHeight = 310;
  const startX = 230;
  const laneSpacing = 280;
  const laneY = 120;

  state.lanes.forEach((lane, i) => {
    const lx = startX + i * laneSpacing;
    const suit = SUITS[lane.bonusSuit];
    const isTargeted = hoveredLane === i;

    ctx.save();
    ctx.fillStyle = isTargeted ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.5)';
    ctx.strokeStyle = isTargeted ? '#818cf8' : suit.color;
    ctx.lineWidth = isTargeted ? 3 : 1.5;
    ctx.beginPath();
    ctx.roundRect(lx, laneY, laneWidth, laneHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Lane Header & Affinity
    ctx.fillStyle = suit.color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${lane.name} (+1 ${suit.symbol})`, lx + laneWidth / 2, laneY + 24);

    // Opponent Card Slot (Top half of lane)
    if (lane.opponentCard) {
      drawCard(ctx, lane.opponentCard, lx + 25, laneY + 36, 170, 120);
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(lx + 25, laneY + 36, 170, 120);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Empty Opponent Slot', lx + laneWidth / 2, laneY + 100);
    }

    // Divider Line (Clash Center)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(lx + 10, laneY + 165);
    ctx.lineTo(lx + laneWidth - 10, laneY + 165);
    ctx.stroke();

    // Player Card Slot (Bottom half of lane)
    if (lane.playerCard) {
      drawCard(ctx, lane.playerCard, lx + 25, laneY + 175, 170, 120);
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(lx + 25, laneY + 175, 170, 120);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Deploy Card Here', lx + laneWidth / 2, laneY + 240);
    }
    ctx.restore();
  });

  // 4. Combat Event Log (Right Column)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(CANVAS_WIDTH - 210, 120, 180, laneHeight);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(CANVAS_WIDTH - 210, 120, 180, laneHeight);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚔ DUEL CHRONICLE', CANVAS_WIDTH - 120, 140);

  ctx.textAlign = 'left';
  ctx.font = '10px sans-serif';
  const recentLogs = state.combatLog.slice(-6);
  recentLogs.forEach((log, idx) => {
    ctx.fillStyle = idx === recentLogs.length - 1 ? '#38bdf8' : '#cbd5e1';
    ctx.fillText(`• ${log}`, CANVAS_WIDTH - 200, 165 + idx * 22, 160);
  });
  ctx.restore();

  // 5. Player Hero HUD & Hand (Bottom)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(40, CANVAS_HEIGHT - 245, CANVAS_WIDTH - 80, 50);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(40, CANVAS_HEIGHT - 245, CANVAS_WIDTH - 80, 50);

  // Player Name & HP
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🧙 ${state.player.name}`, 60, CANVAS_HEIGHT - 215);

  const playerHpPct = Math.max(0, state.player.hp / state.player.maxHp);
  ctx.fillStyle = '#374151';
  ctx.fillRect(240, CANVAS_HEIGHT - 228, 200, 18);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(240, CANVAS_HEIGHT - 228, 200 * playerHpPct, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${state.player.hp} / ${state.player.maxHp} HP`, 340, CANVAS_HEIGHT - 215);

  // Player Mana
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Aether Mana: ${state.player.mana}/${state.player.maxMana} 💎`, 460, CANVAS_HEIGHT - 215);

  // End Turn Button
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH - 210, CANVAS_HEIGHT - 238, 150, 36, 8);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('END TURN (Space)', CANVAS_WIDTH - 135, CANVAS_HEIGHT - 215);
  ctx.restore();

  // 6. Player Hand (Fan of Cards at Bottom)
  const handCardWidth = 150;
  const handCardHeight = 175;
  const totalHandWidth = state.player.hand.length * (handCardWidth + 15);
  const handStartX = (CANVAS_WIDTH - totalHandWidth) / 2;

  state.player.hand.forEach((card, idx) => {
    const cx = handStartX + idx * (handCardWidth + 15);
    const cy = CANVAS_HEIGHT - 185;
    const isSelected = selectedHandIndex === idx;
    drawCard(ctx, card, cx, cy, handCardWidth, handCardHeight, isSelected);
  });
}

export function renderTitleScreen(ctx) {
  ctx.fillStyle = '#050711';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Title Glow
  ctx.save();
  ctx.textAlign = 'center';

  // Floating Suit Glyph Emblems
  drawShape(ctx, 'diamond', CANVAS_WIDTH / 2 - 200, 180, 35, SUITS.SOLAR.color);
  drawShape(ctx, 'teardrop', CANVAS_WIDTH / 2 - 70, 180, 35, SUITS.TIDE.color);
  drawShape(ctx, 'leaf', CANVAS_WIDTH / 2 + 70, 180, 35, SUITS.GALE.color);
  drawShape(ctx, 'star', CANVAS_WIDTH / 2 + 200, 180, 35, SUITS.VOID.color);

  // Main Title
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 56px sans-serif';
  ctx.fillText('AETHERFORGE', CANVAS_WIDTH / 2, 280);

  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('ARCANE DUEL OF THE FOUR SUITS', CANVAS_WIDTH / 2, 330);
  ctx.shadowBlur = 0;

  // Features Overview Banner
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 320, 370, 640, 150, 12);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px sans-serif';
  ctx.fillText('◆ Tactical 3-Lane Combat with Telegraphed AI Rival Intent', CANVAS_WIDTH / 2, 405);
  ctx.fillText('◆ 4 Elemental Counter Pairs: Solar > Void > Gale > Tide > Solar', CANVAS_WIDTH / 2, 435);
  ctx.fillText('◆ Complete Art, Procedural Soundscapes, and High-Contrast Glyphs', CANVAS_WIDTH / 2, 465);
  ctx.fillText('◆ Controls: Keys [1-6] Select Cards, Click Lane to Deploy, [Space] End Turn', CANVAS_WIDTH / 2, 495);

  // Play Button / Start Prompt
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 160, 560, 320, 54, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('CLICK TO ENTER DUEL', CANVAS_WIDTH / 2, 595);
  ctx.restore();
}

export function renderEndScreen(ctx, state, isVictory = true) {
  // Backdrop
  ctx.fillStyle = isVictory ? 'rgba(5, 20, 15, 0.95)' : 'rgba(25, 5, 10, 0.95)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.textAlign = 'center';

  // Banner Glow
  ctx.shadowColor = isVictory ? '#10b981' : '#ef4444';
  ctx.shadowBlur = 40;
  ctx.fillStyle = isVictory ? '#34d399' : '#f87171';
  ctx.font = '900 64px sans-serif';
  ctx.fillText(isVictory ? 'VICTORY ACHIEVED' : 'DEFEAT', CANVAS_WIDTH / 2, 230);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText(
    isVictory
      ? 'The Clockwork Warden’s Aether Core has been overwhelmed!'
      : 'Your runic wards collapsed under the Warden’s onslaught.',
    CANVAS_WIDTH / 2,
    290,
  );

  // Match Summary Card
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 220, 330, 440, 180, 12);
  ctx.fill();
  ctx.strokeStyle = isVictory ? '#10b981' : '#ef4444';
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Total Rounds Survived: ${state.round}`, CANVAS_WIDTH / 2, 380);
  ctx.fillText(`Player Final Life: ${state.player.hp} / ${state.player.maxHp}`, CANVAS_WIDTH / 2, 420);
  ctx.fillText(`Opponent Final Life: ${state.opponent.hp} / ${state.opponent.maxHp}`, CANVAS_WIDTH / 2, 460);

  // Restart Button
  ctx.fillStyle = isVictory ? '#3b82f6' : '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 140, 550, 280, 50, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('PLAY AGAIN', CANVAS_WIDTH / 2, 582);
  ctx.restore();
}
