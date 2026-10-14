// Le carré de la Cueillette, dessiné sur la scène (game/stage) : les buissons de la bibliothèque précuits (au repos, dans
// un calque ; secoués après une cueillette), ce qui y mûrit (qui pousse, mûr, trop mûr qui tremble, les guêpes qui
// bourdonnent, le cèpe qui luit), les cueillettes (le jus qui gicle, la piqûre) et les baies perdues qui tombent, avec
// leurs mots (game/pickFx.js). Le composant garde la partie et le doigt (les boutons des buissons, par-dessus).
import { createStage } from '@/game/stage/stage';
import { createSpriteCache } from '@/game/stage/sprites';
import { gamePiece, gameFrame, gameSuiteMs } from '@/game/minigameArt';
import { PICKING, ripeAt } from '@/game/minigames';
import { BERRY_FX } from '@/game/pickFx';

// La marge autour du carré (éclats et mots y débordent) ; l'écart du carré à ses buissons, et entre deux buissons (px,
// comme le CSS du carré)
export const MARGIN = 20;
const PAD = 10;
const GAP = 6;
const LATE_MS = 450; // trop mûr : bientôt tombé
const FRUIT = 0.53; // un fruit, en part de son buisson

// model() : { now (ms de partie), events, picked (Set des cueillis), playing } — lu à chaque image
// onLost(e) : une baie tombée sans être cueillie
export function createPickScene(canvas, { model, reduced, onLost }) {
  const stage = createStage(canvas, draw, { reduced });
  const sprites = createSpriteCache(stage.dpr, () => {
    dirty = true;
    stage.wake();
  });
  // Les effets en cours ({ cell, suite, at (ms de partie) }) ; les buissons secoués : cellule → depuis
  let effects = [];
  const shaken = new Map();
  // Le carré au repos (les buissons), précuit dans un calque
  const layer = document.createElement('canvas');
  let dirty = true;
  // Le dernier instant dessiné : les baies dont la vie s'est finie depuis sont tombées
  let last = 0;

  const size = () => (stage.w - MARGIN * 2 - PAD * 2 - GAP * (PICKING.cols - 1)) / PICKING.cols;
  const rect = cell => {
    const s = size();
    const x = cell % PICKING.cols, y = Math.floor(cell / PICKING.cols);
    return [MARGIN + PAD + x * (s + GAP), MARGIN + PAD + y * (s + GAP), s];
  };
  const art = (url, w) => (url ? sprites.get(url, w, w) : null);

  function draw(ctx) {
    const m = model();
    const t = m.now;
    if (dirty || layer.width !== canvas.width || layer.height !== canvas.height) bakeLayer();
    ctx.drawImage(layer, 0, 0, stage.w, stage.h);
    // les baies tombées depuis la dernière image
    if (t > last) {
      for (const e of m.events) {
        if (e.until > last && e.until <= t && !m.picked.has(e.id) && e.kind !== 'guepes') {
          effects.push({ cell: e.cell, suite: `tombe-${e.kind}`, at: e.until });
          onLost(e);
        }
      }
      last = t;
    }
    for (const [cell, since] of shaken) {
      const k = t - since;
      if (k >= gameSuiteMs('cueillette', 'buisson-secoue')) {
        shaken.delete(cell);
        dirty = true;
        continue;
      }
      const [x, y, s] = rect(cell);
      const img = art(gameFrame('cueillette', 'buisson-secoue', k), s);
      if (img) ctx.drawImage(img, x, y, s, s);
    }
    for (let cell = 0; cell < PICKING.cols * PICKING.rows; cell++) {
      const e = ripeAt(m.events, m.picked, t, cell);
      if (e) drawFruit(ctx, e, cell, t);
    }
    effects = effects.filter(f => t < f.at + gameSuiteMs('cueillette', f.suite));
    for (const f of effects) {
      const [x, y, s] = rect(f.cell);
      const w = s * FRUIT;
      const img = art(gameFrame('cueillette', f.suite, t - f.at), w);
      if (img) ctx.drawImage(img, x + s / 2 - w / 2, y + s * 0.53 - w / 2, w, w);
    }
    return m.playing || effects.length > 0 || shaken.size > 0;
  }

  const center = cell => {
    const [x, y, s] = rect(cell);
    return [x + s / 2, y + s * 0.5];
  };

  // Les buissons au repos (ceux qui ne sont pas secoués)
  function bakeLayer() {
    layer.width = canvas.width;
    layer.height = canvas.height;
    const lc = layer.getContext('2d');
    lc.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    for (let cell = 0; cell < PICKING.cols * PICKING.rows; cell++) {
      if (shaken.has(cell)) continue;
      const [x, y, s] = rect(cell);
      const img = art(gamePiece('cueillette', 'buisson'), s);
      if (img) lc.drawImage(img, x, y, s, s);
      else {
        lc.fillStyle = '#5FA548';
        lc.beginPath();
        lc.arc(x + s / 2, y + s / 2, s * 0.42, 0, Math.PI * 2);
        lc.fill();
      }
    }
    dirty = false;
  }

  // Ce qui mûrit sur un buisson : il pousse, puis mûr ; trop mûr, il tremble ; les guêpes bourdonnent ; le cèpe luit
  function drawFruit(ctx, e, cell, t) {
    const [x, y, s] = rect(cell);
    const w = s * FRUIT;
    const cx = x + s / 2, cy = y + s * 0.53;
    let url, angle = 0, dx = 0, dy = 0;
    if (e.kind === 'guepes') {
      url = gamePiece('cueillette', 'guepes');
      if (!reduced) {
        dx = Math.sin(t / 30 + cell) * s * 0.02;
        dy = Math.cos(t / 37 + cell) * s * 0.02;
      }
    } else {
      const since = t - e.at;
      const late = e.until - t < LATE_MS;
      url = since < gameSuiteMs('cueillette', `murit-${e.kind}`) ? gameFrame('cueillette', `murit-${e.kind}`, since) : gamePiece('cueillette', `${e.kind}_${late ? 'trop-mur' : 'mur'}`);
      if (late && !reduced) angle = Math.sin(t / 35) * 0.1;
      if (e.kind === 'cepe') {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
        g.addColorStop(0, `rgba(255, 220, 110, ${0.55 + Math.sin(t / 160) * 0.15})`);
        g.addColorStop(1, 'rgba(255, 220, 110, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - w, cy - w, w * 2, w * 2);
      }
    }
    const img = art(url, w);
    if (!img) return;
    ctx.save();
    ctx.translate(cx + dx, cy + dy);
    ctx.rotate(angle);
    ctx.drawImage(img, -w / 2, -w / 2, w, w);
    ctx.restore();
  }

  /* ---------- Ce que le jeu demande ---------- */
  return {
    stage,
    center,
    // Une cueillette sur un buisson : ce qu'il portait (kind), au temps t de la partie ; word : son mot ; tier : le palier
    // atteint (game/stage/tiers.js), ou null
    pick(cell, { kind, t, word, tier }) {
      const [cx, cy] = center(cell);
      const s = size();
      const fx = BERRY_FX[kind];
      shaken.set(cell, t);
      effects.push({ cell, suite: kind === 'guepes' ? 'piqure' : `cueilli-${kind}`, at: t });
      dirty = true;
      if (kind === 'guepes') {
        stage.shake(6);
        stage.flash('rgba(226, 87, 74, 1)', 220);
      } else {
        stage.particles.burst(cx, cy, { n: kind === 'cepe' ? 12 : 8, shape: 'drop', colors: fx.colors, speed: [s * 1.2, s * 3], spread: Math.PI * 2, size: [s * 0.04, s * 0.08], gravity: s * 8, life: [350, 650] });
        stage.particles.burst(cx, cy, { n: 3, shape: 'leaf', colors: ['#7DB46E', '#5FA548'], speed: [s * 0.8, s * 1.8], size: [s * 0.04, s * 0.07], gravity: s * 4, life: [500, 800] });
        if (kind === 'cepe') stage.particles.burst(cx, cy, { n: 8, shape: 'star', colors: ['#FFF3C4', '#F2B33D'], speed: [s * 1, s * 2.5], size: [s * 0.06, s * 0.12], gravity: s * 2, life: [600, 900] });
      }
      stage.texts.add({ text: word, x: cx, y: cy - s * 0.55, size: Math.round(s * (kind === 'cepe' ? 0.36 : 0.3)), fill: fx.fill, look: kind === 'guepes' || kind === 'cepe' ? 'word' : 'gain', tilt: (Math.random() - 0.5) * 0.3, life: 750, rise: s * 0.3 });
      if (tier && tier.label) {
        stage.texts.add({ text: tier.label, x: stage.w / 2, y: stage.h * 0.2, size: Math.round(s * (0.38 + tier.rank * 0.04)), fill: tier.fill, font: 'display', look: 'label', rays: tier.rank >= 3, delay: 120, life: 1400, rise: s * 0.2 });
        stage.particles.burst(stage.w / 2, stage.h * 0.2, { n: 6 + tier.rank * 3, shape: 'star', colors: ['#FFF6D6', tier.fill[1], '#F2B33D'], speed: [s * 1.5, s * 3.5], size: [s * 0.05, s * 0.1], gravity: s * 2, life: [600, 1000] });
        stage.shake(tier.shake);
        if (tier.flash) stage.flash(tier.flash, 280);
      }
      stage.wake();
    },
    // Une baie perdue : son mot, petit, là où elle tombe
    lost(cell, word) {
      const [cx, cy] = center(cell);
      const s = size();
      stage.texts.add({ text: word, x: cx, y: cy + s * 0.1, size: Math.round(s * 0.24), fill: ['#FFFFFF', '#8FA97A'], life: 650, rise: s * 0.2 });
    },
    wake() {
      stage.wake();
    },
    destroy() {
      stage.destroy();
    }
  };
}
