// La paroi du Filon, dessinée sur la scène (game/stage) : les blocs de la bibliothèque précuits (dureté, fissures), les
// trous ouverts avec leur pierre et leurs signes, et les coups (la pioche et ses étincelles, le bloc qui éclate, la
// pierre qui apparaît, ses éclats), avec leurs mots (game/veinFx.js). Le composant garde la partie et le doigt (les
// boutons des blocs, par-dessus) ; la scène ne fait que montrer.
import { createStage } from '@/game/stage/stage';
import { createSpriteCache } from '@/game/stage/sprites';
import { clamp01, outBack } from '@/game/stage/ease';
import { gamePiece, gameFrame, gameSuiteMs } from '@/game/minigameArt';
import { VEIN } from '@/game/minigames';
import { GEM_FX, STONE } from '@/game/veinFx';

// La marge autour de la paroi, où éclats et mots débordent ; l'écart de la paroi à ses blocs, et entre deux blocs (px,
// comme le CSS de la paroi)
export const MARGIN = 20;
const PAD = 6;
const GAP = 3;
const HARD = ['', 'tendre', 'dur', 'tres-dur'];
const SHAKE_MS = 160; // un bloc frappé tremble
const POP_MS = 420; // une pierre qui sort de son trou

// model() : { hard, left, broken, gems, reach (Set des blocs à portée), glint(i) } — lu à chaque image
export function createVeinScene(canvas, { model, reduced }) {
  const stage = createStage(canvas, draw, { reduced });
  const sprites = createSpriteCache(stage.dpr, () => {
    dirty = true;
    stage.wake();
  });
  // Les effets en cours sur un bloc : { i, suite, at, wide } ; les blocs qui tremblent : i → depuis ; les pierres qui
  // sortent : i → depuis
  let effects = [];
  const shaking = new Map();
  const popping = new Map();
  // La paroi au repos, précuite dans un calque, refaite quand un bloc change
  const layer = document.createElement('canvas');
  let dirty = true;

  const cell = () => (stage.w - MARGIN * 2 - PAD * 2 - GAP * (VEIN.cols - 1)) / VEIN.cols;
  const rect = i => {
    const c = cell();
    const x = i % VEIN.cols, y = Math.floor(i / VEIN.cols);
    return [MARGIN + PAD + x * (c + GAP), MARGIN + PAD + y * (c + GAP), c];
  };
  const art = (url, size) => (url ? sprites.get(url, size, size) : null);

  // Le dessin d'un bloc fermé, selon sa dureté et les coups déjà portés
  function blockUrl(hard, left) {
    const crack = (hard - left) / hard;
    const name = hard === 3 ? (crack >= 0.6 ? 'fissure-2' : crack > 0 ? 'fissure-1' : 'neuf') : hard === 2 && crack > 0 ? 'fissure-1' : 'neuf';
    return gamePiece('filon', `bloc-${HARD[hard]}_${name}`);
  }

  /* ---------- Dessin ---------- */
  function draw(ctx) {
    const m = model();
    const now = stage.t;
    if (dirty || layer.width !== canvas.width || layer.height !== canvas.height) bakeLayer(m);
    ctx.drawImage(layer, 0, 0, stage.w, stage.h);
    // ce qui bouge par-dessus : les blocs qui tremblent, les pierres qui sortent, les effets
    for (const [i, since] of shaking) {
      const k = (now - since) / SHAKE_MS;
      if (k >= 1) {
        shaking.delete(i);
        dirty = true;
        continue;
      }
      const [x, y, c] = rect(i);
      const dx = reduced ? 0 : Math.sin(k * Math.PI * 6) * c * 0.05 * (1 - k);
      // (le calque laisse sa place vide : le bloc s'y dessine en tremblant)
      drawCell(ctx, m, i, x + dx, y, c);
    }
    for (const [i, since] of popping) {
      const k = (now - since) / POP_MS;
      if (k >= 1) {
        popping.delete(i);
        dirty = true;
        continue;
      }
      const [x, y, c] = rect(i);
      drawHole(ctx, x, y, c);
      drawGem(ctx, m.gems[i], x, y, c, reduced ? 1 : outBack(clamp01(k), 2.6));
      // la lueur qui pulse autour d'elle
      const g = ctx.createRadialGradient(x + c / 2, y + c / 2, 0, x + c / 2, y + c / 2, c * 0.8);
      g.addColorStop(0, `rgba(255, 240, 200, ${0.6 * (1 - k)})`);
      g.addColorStop(1, 'rgba(255, 240, 200, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - c / 2, y - c / 2, c * 2, c * 2);
    }
    effects = effects.filter(e => now < e.at + gameSuiteMs('filon', e.suite));
    for (const e of effects) {
      const [x, y, c] = rect(e.i);
      const s = e.wide ? c * 1.5 : c;
      const img = art(gameFrame('filon', e.suite, now - e.at), s);
      if (img) ctx.drawImage(img, x + c / 2 - s / 2, y + c / 2 - s / 2, s, s);
    }
    return shaking.size > 0 || popping.size > 0 || effects.length > 0;
  }

  // La paroi au repos : chaque bloc fermé (à portée : un liseré doré), chaque trou ouvert avec sa pierre et ses signes
  function bakeLayer(m) {
    layer.width = canvas.width;
    layer.height = canvas.height;
    const lc = layer.getContext('2d');
    lc.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    for (let i = 0; i < m.hard.length; i++) {
      if (shaking.has(i) || popping.has(i)) continue;
      const [x, y, c] = rect(i);
      drawCell(lc, m, i, x, y, c);
    }
    dirty = false;
  }

  function drawCell(ctx, m, i, x, y, c) {
    if (m.broken[i]) {
      drawHole(ctx, x, y, c);
      if (m.gems[i]) drawGem(ctx, m.gems[i], x, y, c, 1);
      const glint = m.glint(i);
      if (glint) {
        const sign = art(gamePiece('filon', `signe-${Math.min(3, glint)}`), c * 0.42);
        if (sign) ctx.drawImage(sign, x + c * 0.58, y + c * 0.58, c * 0.42, c * 0.42);
        if (glint > 3) {
          ctx.font = `900 ${Math.round(c * 0.22)}px ${stage.fonts.ui}`;
          ctx.textAlign = 'right';
          ctx.fillStyle = '#FFE07A';
          ctx.fillText(`×${glint}`, x + c - 3, y + c * 0.5);
        }
      }
      return;
    }
    const img = art(blockUrl(m.hard[i], m.left[i]), c);
    if (img) ctx.drawImage(img, x, y, c, c);
    else {
      ctx.fillStyle = STONE[m.hard[i]][0];
      ctx.fillRect(x, y, c, c);
    }
    if (!m.reach.has(i)) {
      // hors d'atteinte : plus sombre
      ctx.fillStyle = 'rgba(20, 14, 10, .3)';
      ctx.fillRect(x, y, c, c);
    } else {
      ctx.strokeStyle = 'rgba(242, 192, 75, .85)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, c - 2, c - 2);
    }
  }

  function drawHole(ctx, x, y, c) {
    const img = art(gamePiece('filon', 'trou'), c);
    if (img) ctx.drawImage(img, x, y, c, c);
    else {
      ctx.fillStyle = '#1A1714';
      ctx.fillRect(x, y, c, c);
    }
  }

  function drawGem(ctx, gem, x, y, c, scale) {
    const size = c * 0.78 * scale;
    const img = art(gamePiece('filon', gem), c * 0.78);
    if (img) ctx.drawImage(img, x + c / 2 - size / 2, y + c / 2 - size / 2, size, size);
  }

  /* ---------- Ce que le jeu demande ---------- */
  return {
    stage,
    // L'état de la paroi a changé (un coup, une nouvelle partie) : le calque se refait
    refresh() {
      dirty = true;
      stage.wake();
    },
    // Un coup de pioche sur le bloc i : hard (sa dureté), broke (il cède), gem (la pierre derrière), words : { hit, burst }
    // (les mots à dire), tier (le palier des pierres d'affilée, game/stage/tiers.js), glint (les éclats autour)
    strike(i, { hard, broke, gem, words, tier }) {
      const [x, y, c] = rect(i);
      const cx = x + c / 2, cy = y + c / 2;
      const now = stage.t;
      shaking.set(i, now);
      effects.push({ i, suite: 'pioche', at: now, wide: false });
      if (hard >= 2) effects.push({ i, suite: `etincelles-${HARD[hard]}`, at: now, wide: false });
      stage.particles.burst(cx, cy, { n: broke ? 12 : 5, shape: 'chip', colors: STONE[hard], speed: [c * 1.2, c * (broke ? 4 : 2.6)], angle: -Math.PI / 2, spread: Math.PI * 1.4, size: [c * 0.04, c * (broke ? 0.1 : 0.07)], gravity: c * 12, life: [350, 650] });
      if (words.hit) stage.texts.add({ text: words.hit, x: cx + c * 0.5, y: cy - c * 0.5, size: Math.round(c * 0.36), fill: ['#FFFFFF', '#B9AE9C'], life: 560, rise: c * 0.3, tilt: (Math.random() - 0.5) * 0.3 });
      if (broke) {
        effects.push({ i, suite: `eclatement-${HARD[hard]}`, at: now, wide: true });
        stage.particles.burst(cx, cy, { n: 4, shape: 'circle', colors: ['rgba(200, 186, 160, .7)'], speed: [c * 0.3, c * 0.9], size: [c * 0.08, c * 0.14], size1: 2, gravity: -c * 0.5, life: [400, 700] });
        stage.shake(hard === 3 ? 4 : 2);
        if (words.burst) stage.texts.add({ text: words.burst, x: cx, y: cy - c * 0.2, size: Math.round(c * (hard === 3 ? 0.5 : 0.42)), fill: ['#FFF3C4', '#C98A4A'], look: 'word', tilt: (Math.random() - 0.5) * 0.3, delay: 60, life: 800, rise: c * 0.4 });
      }
      if (broke && gem) {
        const fx = GEM_FX[gem];
        popping.set(i, now + 80);
        effects.push({ i, suite: `apparition-${gem}`, at: now + 80, wide: true });
        effects.push({ i, suite: `eclats-${gem}`, at: now + 300, wide: true });
        stage.particles.burst(cx, cy, { n: gem === 'diamant' ? 14 : 8, shape: 'star', colors: fx.colors, speed: [c * 1.5, c * 3.5], size: [c * 0.07, c * 0.14], gravity: c * 2, life: [600, 1000] });
        if (words.gem) stage.texts.add({ text: words.gem, x: cx, y: cy - c * 0.7, size: Math.round(c * (gem === 'diamant' ? 0.6 : 0.5)), fill: fx.fill, look: 'word', tilt: (Math.random() - 0.5) * 0.25, delay: 220, life: 1000, rise: c * 0.5 });
        if (gem === 'diamant') {
          stage.flash('rgba(230, 248, 255, 1)', 280);
          stage.shake(6);
        }
        if (tier && tier.label) {
          stage.texts.add({ text: tier.label, x: stage.w / 2, y: stage.h * 0.18, size: Math.round(c * (0.55 + tier.rank * 0.06)), fill: tier.fill, font: 'display', look: 'label', rays: tier.rank >= 3, delay: 380, life: 1400, rise: c * 0.3 });
          stage.particles.burst(stage.w / 2, stage.h * 0.18, { n: 6 + tier.rank * 3, shape: 'star', colors: ['#FFF6D6', tier.fill[1], '#F2B33D'], speed: [c * 2, c * 4.5], size: [c * 0.07, c * 0.14], gravity: c * 3, life: [600, 1000] });
          stage.shake(tier.shake);
          if (tier.flash) stage.flash(tier.flash, 280);
        }
      } else if (broke && words.empty) {
        stage.texts.add({ text: words.empty, x: cx, y: cy - c * 0.6, size: Math.round(c * 0.34), fill: ['#FFFFFF', '#A39887'], delay: 200, life: 700, rise: c * 0.3 });
      }
      dirty = true;
      stage.wake();
    },
    // Un coup hors d'atteinte : le bloc tremble, sans plus
    refuse(i) {
      shaking.set(i, stage.t);
      dirty = true;
      stage.wake();
    },
    destroy() {
      stage.destroy();
    }
  };
}
