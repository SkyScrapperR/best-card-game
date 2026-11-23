// AetherForge: Arcane Duel - Main Interactive Entrypoint
import { createGameState, playCard, endTurn } from './engine.js';
import { renderTable, renderTitleScreen, renderEndScreen, CANVAS_WIDTH, CANVAS_HEIGHT } from './render.js';
import { stageScreenshot } from './shots.js';
import { sound } from './audio.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Read URL parameters for deterministic makefun screenshots
const urlParams = new URLSearchParams(window.location.search);
const shot = urlParams.get('shot');

if (shot) {
  // Directly render static screenshot frame
  stageScreenshot(ctx, shot);
} else {
  // Live Playable Game Loop
  let state = createGameState(Date.now());
  let screen = 'TITLE'; // 'TITLE' | 'PLAY' | 'OVER'
  let selectedHandIndex = null;
  let hoveredLane = null;

  function render() {
    if (screen === 'TITLE') {
      renderTitleScreen(ctx);
    } else if (screen === 'PLAY') {
      renderTable(ctx, state, selectedHandIndex, hoveredLane);
    } else if (screen === 'OVER') {
      renderEndScreen(ctx, state, state.winner === 'player');
    }
  }

  function handleInteraction(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (screen === 'TITLE') {
      screen = 'PLAY';
      sound.playCard();
      render();
      return;
    }

    if (screen === 'OVER') {
      state = createGameState(Date.now());
      screen = 'PLAY';
      selectedHandIndex = null;
      sound.playCard();
      render();
      return;
    }

    // 1. Check End Turn Button Click (CANVAS_WIDTH - 210, CANVAS_HEIGHT - 238, 150, 36)
    if (x >= CANVAS_WIDTH - 210 && x <= CANVAS_WIDTH - 60 && y >= CANVAS_HEIGHT - 238 && y <= CANVAS_HEIGHT - 202) {
      sound.playClash();
      endTurn(state);
      if (state.winner) {
        screen = 'OVER';
        if (state.winner === 'player') sound.playVictory();
      }
      selectedHandIndex = null;
      render();
      return;
    }

    // 2. Check Player Hand Click
    const handCardWidth = 150;
    const handCardHeight = 175;
    const totalHandWidth = state.player.hand.length * (handCardWidth + 15);
    const handStartX = (CANVAS_WIDTH - totalHandWidth) / 2;
    const handY = CANVAS_HEIGHT - 185;

    let clickedHand = false;
    state.player.hand.forEach((card, idx) => {
      const cx = handStartX + idx * (handCardWidth + 15);
      if (x >= cx && x <= cx + handCardWidth && y >= handY && y <= handY + handCardHeight) {
        selectedHandIndex = selectedHandIndex === idx ? null : idx;
        clickedHand = true;
        sound.playCard();
      }
    });

    if (clickedHand) {
      render();
      return;
    }

    // 3. Check Lane Click for Deployment
    const laneWidth = 220;
    const laneHeight = 310;
    const startX = 230;
    const laneSpacing = 280;
    const laneY = 120;

    state.lanes.forEach((lane, idx) => {
      const lx = startX + idx * laneSpacing;
      if (x >= lx && x <= lx + laneWidth && y >= laneY && y <= laneY + laneHeight) {
        if (selectedHandIndex !== null) {
          const success = playCard(state, 'player', selectedHandIndex, idx);
          if (success) {
            sound.playResonance();
            selectedHandIndex = null;
          }
        }
      }
    });

    render();
  }

  canvas.addEventListener('click', (e) => {
    handleInteraction(e.clientX, e.clientY);
  });

  window.addEventListener('keydown', (e) => {
    if (screen === 'TITLE') {
      screen = 'PLAY';
      sound.playCard();
      render();
      return;
    }

    if (e.code === 'Space' || e.code === 'Enter') {
      if (screen === 'PLAY') {
        sound.playClash();
        endTurn(state);
        if (state.winner) {
          screen = 'OVER';
          if (state.winner === 'player') sound.playVictory();
        }
        selectedHandIndex = null;
        render();
      } else if (screen === 'OVER') {
        state = createGameState(Date.now());
        screen = 'PLAY';
        selectedHandIndex = null;
        sound.playCard();
        render();
      }
      return;
    }

    // Number keys 1-6 for card selection
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= state.player.hand.length) {
      selectedHandIndex = num - 1;
      sound.playCard();
      render();
    }
  });

  render();
}
