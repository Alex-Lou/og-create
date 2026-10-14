// Le plateau de la Récolte, dessiné sur la scène (game/stage) : les tuiles précuites de la bibliothèque, qui respirent ;
// la chaîne en cours (une corde de lumière, son compteur) ; la cueillette (les tuiles éclatent une à une, leurs éclats,
// l'onomatopée, le palier du coup) ; la chute des colonnes, qui rebondissent. Le composant garde le jeu (game/harvest)
// et le doigt ; la scène ne fait que montrer.
import { createStage } from '@/game/stage/stage';
import { bakeSprites } from '@/game/stage/sprites';
import { clamp01, outBack, outBounce, inCubic, lerp } from '@/game/stage/ease';
import { KIND_FX, tierOf } from '@/game/harvestFx';
import { SIZE } from '@/game/harvest';
import { tileArt, chainArt, PICK_FRAMES } from '@/game/harvestArt';

// La marge autour du plateau, où éclats et mots peuvent déborder (px)
export const MARGIN = 28;
const POP_STEP = 35; // d'une tuile cueillie à la suivante, le long de la chaîne (ms)
const POP_MS = 230; // une tuile qui éclate
const FALL_MS = 340; // une colonne qui tombe
const FALL_STEP = 28; // d'une colonne à la suivante
const SQUASH_MS = 170; // l'écrasement d'une tuile qui atterrit
const PICK_MS = 150; // une tuile qui se gonfle, prise dans la chaîne
const BORN_MS = 260; // la lune qui naît sur la dernière case d'une longue chaîne
const TILE = 0.94; // une tuile, en part de sa case
const GLINT_MS = 600; // un reflet qui balaie une tuile
const GLINT_EVERY = 3500;
const INK = '#3C2819';
const GOLD = '#F2B33D';

export function createHarvestScene(canvas, { kinds, reduced }) {
  // Les tuiles affichées (par identifiant) et celles qui éclatent
  const tiles = new Map();
  let popping = [];
  // La chaîne en cours : ses cases, et l'instant où chacune a été prise
  let path = [];
  const pickedAt = new Map();
  let sprites = {};
  // Un reflet qui passe sur une tuile au hasard, de temps en temps (la seule chose qui bouge sur un plateau au repos)
  let glint = { id: null, at: -Infinity };
  // Le plateau au repos, précuit dans un calque : les creux et les tuiles qui ne bougent pas. Chaque image ne redessine
  // que ce qui bouge par-dessus (tuiles prises ou qui tombent, la chaîne, les éclats) ; le calque se refait quand une
  // tuile entre ou sort du repos
  const layer = document.createElement('canvas');
  let layerDirty = true;
  let liveCount = 0;

  const stage = createStage(canvas, draw, { reduced });
  // Les minuteries de la scène (secousse d'un coup, poussière d'une chute), arrêtées à son départ
  const timers = new Set();
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  const cell = () => (stage.w - MARGIN * 2) / SIZE;
  const center = (x, y) => [MARGIN + (x + 0.5) * cell(), MARGIN + (y + 0.5) * cell()];

  // Les dessins de la bibliothèque, précuits chacun à la taille exacte où il se montre (un dessin réduit à chaque image
  // coûte) : la tuile au repos et choisie, ses images de cueillette, l'éclat d'une chaîne
  async function bake() {
    const tile = {}, pick = {}, flare = {};
    for (const kind of kinds) {
      tile[`tuile-${kind}`] = tileArt(kind);
      tile[`choisie-${kind}`] = tileArt(kind, 'choisie');
      for (let n = 1; n <= PICK_FRAMES; n++) pick[`cueillie-${kind}-${n}`] = tileArt(kind, 'cueillie', n);
    }
    for (let n = 1; n <= PICK_FRAMES; n++) flare[`chaine-${n}`] = chainArt(n);
    const c = Math.max(24, cell());
    const baked = await Promise.all([bakeSprites(tile, c * TILE, stage.dpr), bakeSprites(pick, c, stage.dpr), bakeSprites(flare, c * 1.5, stage.dpr)]);
    sprites = Object.assign({}, ...baked);
    layerDirty = true;
    stage.wake();
  }
  // Toutes les trois secondes et demie, un reflet balaie une tuile au repos
  const shine = () => {
    const ids = [...tiles.values()].filter(t => resting(t, stage.t)).map(t => t.id);
    if (ids.length) glint = { id: ids[Math.floor(Math.random() * ids.length)], at: stage.t };
    stage.wake();
    later(shine, GLINT_EVERY);
  };
  if (!reduced) later(shine, GLINT_EVERY);

  /* ---------- Dessin ---------- */
  // Rend vrai tant que quelque chose bouge : une chute, une tuile prise, une cueillette, un reflet
  function draw(ctx) {
    const c = cell();
    const now = stage.t;
    // (une tuile entrée au repos ou sortie du repos depuis l'image d'avant : le calque se refait)
    const live = [...tiles.values()].filter(t => !resting(t, now));
    if (live.length !== liveCount) layerDirty = true;
    liveCount = live.length;
    if (layerDirty || layer.width !== canvas.width || layer.height !== canvas.height) bakeLayer(c, now);
    ctx.drawImage(layer, 0, 0, stage.w, stage.h);
    const glinting = now - glint.at < GLINT_MS;
    if (glinting && tiles.has(glint.id) && resting(tiles.get(glint.id), now)) {
      const t = tiles.get(glint.id);
      const [cx, cy] = center(t.x, t.y);
      ctx.save();
      ctx.translate(cx, cy);
      drawGlint(ctx, c * TILE, (now - glint.at) / GLINT_MS);
      ctx.restore();
    }
    let busy = path.length > 0 || popping.length > 0 || glinting;
    for (const tile of live) busy = drawTile(ctx, tile, c, now) || busy;
    drawPath(ctx, c, now);
    for (const ghost of popping) drawPop(ctx, ghost, c, now);
    popping = popping.filter(g => now < g.at + POP_MS + 380);
    return busy;
  }

  // Une tuile au repos : ni prise, ni en train de tomber ou de s'écraser
  function resting(tile, now) {
    return !pickedAt.has(tile.y * SIZE + tile.x) && (!tile.fallAt || now >= tile.fallAt + FALL_MS + SQUASH_MS) && (!tile.bornAt || now >= tile.bornAt + BORN_MS);
  }

  // Le calque du plateau au repos : les creux, et les tuiles au repos
  function bakeLayer(c, now) {
    layer.width = canvas.width;
    layer.height = canvas.height;
    const lc = layer.getContext('2d');
    lc.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    drawSlots(lc, c);
    for (const tile of tiles.values()) if (resting(tile, now)) drawTile(lc, tile, c, now);
    layerDirty = false;
  }

  // Les creux du plateau, sous les tuiles
  function drawSlots(ctx, c) {
    ctx.fillStyle = 'rgba(120, 85, 50, .12)';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        roundRect(ctx, MARGIN + x * c + c * 0.08, MARGIN + y * c + c * 0.1, c * 0.84, c * 0.84, c * 0.16);
        ctx.fill();
      }
    }
  }

  // Une tuile : sa chute (avec rebond), son écrasement à l'atterrissage, prise ou non. Rend vrai si elle bouge encore
  function drawTile(ctx, tile, c, now) {
    const k = clamp01((now - tile.fallAt) / FALL_MS);
    const y = tile.fallAt ? lerp(tile.from, tile.y, outBounce(k)) : tile.y;
    let moving = Boolean(tile.fallAt) && now < tile.fallAt + FALL_MS + SQUASH_MS;
    // la lune qui naît : cachée tant que la tuile d'avant éclate, puis elle grandit en rebondissant
    const born = tile.bornAt ? (now - tile.bornAt) / BORN_MS : 1;
    if (born < 1) moving = true;
    if (born < 0) return moving;
    if (y < -0.9) return moving;
    const [cx, cy] = center(tile.x, y);
    const key = tile.y * SIZE + tile.x;
    const picked = pickedAt.has(key);
    let sx = 1, sy = 1;
    // l'écrasement : la tuile s'aplatit en touchant le fond, puis se remet
    const landed = tile.fallAt ? now - (tile.fallAt + FALL_MS) : Infinity;
    if (landed >= 0 && landed < SQUASH_MS && !reduced) {
      const s = Math.sin((landed / SQUASH_MS) * Math.PI) * 0.12;
      sx += s;
      sy -= s;
    }
    if (born < 1) {
      const b = outBack(born, 2.6);
      sx *= b;
      sy *= b;
    }
    if (picked) {
      const p = reduced ? 1 : outBack(clamp01((now - pickedAt.get(key)) / PICK_MS), 3);
      sx += 0.12 * p;
      sy += 0.12 * p;
      // le halo d'or sous la tuile prise, qui pulse
      const pulse = 0.75 + Math.sin(now / 140) * 0.25;
      const g = ctx.createRadialGradient(cx, cy, c * 0.2, cx, cy, c * 0.72);
      g.addColorStop(0, `rgba(255, 214, 110, ${0.55 * pulse})`);
      g.addColorStop(1, 'rgba(255, 214, 110, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - c, cy - c, c * 2, c * 2);
    }
    const art = sprites[`${picked ? 'choisie' : 'tuile'}-${tile.kind}`];
    const size = c * TILE;
    if (sx === 1 && sy === 1) {
      // (au repos : le dessin précuit, sans transformation)
      if (art) ctx.drawImage(art, cx - size / 2, cy - size / 2, size, size);
      else fallback(ctx, tile.kind, cx, cy, size);
      return moving;
    }
    ctx.save();
    ctx.translate(cx, cy + c * 0.46);
    ctx.scale(sx, sy);
    ctx.translate(0, -c * 0.46);
    if (art) ctx.drawImage(art, -size / 2, -size / 2, size, size);
    else fallback(ctx, tile.kind, 0, 0, size);
    ctx.restore();
    return moving;
  }

  // Une tuile sans son dessin (pas encore lu) : un carré arrondi de sa couleur
  function fallback(ctx, kind, cx, cy, size) {
    ctx.fillStyle = (KIND_FX[kind] || KIND_FX.stone).colors[1];
    roundRect(ctx, cx - size / 2, cy - size / 2, size, size, size * 0.18);
    ctx.fill();
  }

  // Un reflet de lumière qui balaie la tuile en biais
  function drawGlint(ctx, size, k) {
    if (k < 0 || k > 1) return;
    ctx.save();
    roundRect(ctx, -size / 2, -size / 2, size, size, size * 0.18);
    ctx.clip();
    const x = lerp(-size, size, k);
    const g = ctx.createLinearGradient(x - size * 0.3, 0, x + size * 0.3, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.rotate(-0.5);
    ctx.fillRect(-size, -size, size * 2, size * 2);
    ctx.restore();
  }

  // La chaîne en cours : une corde de lumière d'une tuile à l'autre, des étincelles qui y courent, et son compteur
  function drawPath(ctx, c, now) {
    if (!path.length) return;
    const points = path.map(([x, y]) => center(x, y));
    const tier = tierOf(path.length);
    const tint = tier.fill ? tier.fill[1] : GOLD;
    if (points.length > 1) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      stroke(ctx, points, 'rgba(255, 206, 96, .35)', c * 0.3);
      stroke(ctx, points, tint, c * 0.13);
      stroke(ctx, points, '#FFF6D6', c * 0.05);
      // les étincelles : trois par segment, qui filent vers la dernière tuile
      if (!reduced) {
        ctx.fillStyle = '#FFFFFF';
        for (let i = 1; i < points.length; i++) {
          for (let j = 0; j < 3; j++) {
            const k = ((now / 420) + j / 3) % 1;
            const [ax, ay] = points[i - 1], [bx, by] = points[i];
            ctx.beginPath();
            ctx.arc(lerp(ax, bx, k), lerp(ay, by, k), c * 0.045, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    // le compteur, au-dessus de la dernière tuile : il prend la couleur du palier atteint
    const [lx, ly] = points[points.length - 1];
    const bx = lx + c * 0.38, by = ly - c * 0.42;
    const r = c * 0.24 * (1 + (reduced ? 0 : Math.max(0, 1 - (now - (pickedAt.get(path[path.length - 1][1] * SIZE + path[path.length - 1][0]) || 0)) / 180) * 0.35));
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fillStyle = tint;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = `900 ${Math.round(r * 1.15)}px ${stage.fonts.ui}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(path.length), bx, by + r * 0.06);
  }

  // Une tuile cueillie : elle gonfle, puis éclate en tournant ; ses images de cueillette, l'éclat d'une belle chaîne
  function drawPop(ctx, ghost, c, now) {
    const k = (now - ghost.at) / POP_MS;
    if (k < 0) {
      // (pas encore son tour : elle attend, prise)
      const art = sprites[`choisie-${ghost.kind}`];
      const [cx, cy] = center(ghost.x, ghost.y);
      if (art) ctx.drawImage(art, cx - c * 0.53, cy - c * 0.53, c * 1.06, c * 1.06);
      return;
    }
    const [cx, cy] = center(ghost.x, ghost.y);
    if (!ghost.burst) {
      ghost.burst = true;
      ghost.onBurst(cx, cy);
    }
    if (k <= 1) {
      const scale = k < 0.35 ? lerp(1.06, 1.28, k / 0.35) : lerp(1.28, 0, inCubic((k - 0.35) / 0.65));
      const frame = Math.min(PICK_FRAMES, 1 + Math.floor(k * PICK_FRAMES));
      const art = sprites[`cueillie-${ghost.kind}-${frame}`] || sprites[`tuile-${ghost.kind}`];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(reduced ? 0 : k * ghost.spin);
      ctx.scale(scale, scale);
      if (art) ctx.drawImage(art, -c * 0.5, -c * 0.5, c, c);
      ctx.restore();
    }
    // l'éclat de la bibliothèque, sur les chaînes d'au moins « Superbe »
    if (ghost.flare) {
      const f = 1 + Math.floor(((now - ghost.at) / 95));
      const art = f <= PICK_FRAMES ? sprites[`chaine-${f}`] : null;
      if (art) ctx.drawImage(art, cx - c * 0.75, cy - c * 0.75, c * 1.5, c * 1.5);
    }
  }

  /* ---------- Ce que le jeu demande ---------- */
  return {
    stage,
    bake,
    // Les tuiles du plateau, sans animation : [{ id, kind, x, y }]
    set(list) {
      tiles.clear();
      for (const t of list) tiles.set(t.id, { ...t, from: t.y, fallAt: 0 });
      layerDirty = true;
      stage.wake();
    },
    // La chaîne en cours (ses cases, dans l'ordre)
    setPath(next) {
      const keys = new Set(next.map(([x, y]) => y * SIZE + x));
      for (const key of [...pickedAt.keys()]) if (!keys.has(key)) pickedAt.delete(key);
      for (const key of keys) if (!pickedAt.has(key)) pickedAt.set(key, stage.t);
      path = next;
      layerDirty = true;
      stage.wake();
    },
    // Cueillette d'une chaîne : les tuiles éclatent une à une, puis le coup dit son mot (word : l'onomatopée ; amount :
    // le gain ; streak : la série de belles chaînes ; moon : la case [x, y] où naît une lune, règles 2, ou null). Chaque
    // tuile éclate en sa sorte (une lune prise dans la chaîne reste une lune). Rend sa durée (ms)
    pop({ path: cells, kind, word, amount, streak, moon = null }) {
      const tier = tierOf(cells.length);
      const step = reduced ? 0 : Math.min(POP_STEP, 320 / cells.length);
      const start = stage.t;
      const ids = new Set(cells.map(([x, y]) => y * SIZE + x));
      const kindAt = new Map();
      let moonTile = null;
      for (const t of [...tiles.values()]) {
        if (!ids.has(t.y * SIZE + t.x)) continue;
        kindAt.set(t.y * SIZE + t.x, t.kind);
        tiles.delete(t.id);
        if (moon && t.x === moon[0] && t.y === moon[1]) moonTile = t;
      }
      pickedAt.clear();
      path = [];
      cells.forEach(([x, y], i) => {
        const own = kindAt.get(y * SIZE + x) || kind;
        const fx = KIND_FX[own] || KIND_FX.stone;
        popping.push({
          x, y, kind: own, at: start + i * step, spin: (Math.random() - 0.5) * 3, flare: tier.rank >= 2,
          onBurst(cx, cy) {
            const c = cell();
            stage.particles.burst(cx, cy, { n: tier.bits, shape: fx.shape, colors: fx.colors, speed: [c * 1.6, c * 4.2], size: [c * 0.06, c * 0.12], gravity: c * 14, life: [380, 720] });
            stage.particles.burst(cx, cy, { n: 1, shape: 'ring', colors: ['rgba(255, 236, 170, .9)'], speed: [0, 0], size: [c * 0.3, c * 0.3], size1: 2.2, gravity: 0, life: [300, 300], fade: 0 });
            if (tier.rank >= 2) stage.particles.burst(cx, cy, { n: 3, shape: 'star', colors: ['#FFF3C4', GOLD], speed: [c * 1, c * 2.4], size: [c * 0.08, c * 0.14], gravity: c * 4, life: [500, 800] });
          }
        });
      });
      const end = cells.length * step + POP_MS * 0.4;
      // la lune naît où la chaîne finit, quand sa dernière tuile se dissipe : elle garde la case (et son identifiant,
      // celui que le jeu lui garde), d'où elle tombera avec les autres
      let bornEnd = 0;
      if (moonTile) {
        const bornAt = reduced ? 0 : start + cells.length * step + POP_MS * 0.35;
        tiles.set(moonTile.id, { ...moonTile, kind: 'lune', from: moonTile.y, fallAt: 0, bornAt });
        if (!reduced) {
          bornEnd = bornAt - start + BORN_MS;
          later(() => {
            const c = cell();
            const [mx, my] = center(moonTile.x, moonTile.y);
            stage.particles.burst(mx, my, { n: 1, shape: 'ring', colors: ['rgba(255, 226, 140, .95)'], speed: [0, 0], size: [c * 0.35, c * 0.35], size1: 2.6, gravity: 0, life: [420, 420], fade: 0 });
            stage.particles.burst(mx, my, { n: 9, shape: 'star', colors: KIND_FX.lune.colors, speed: [c * 1.2, c * 3.2], spread: Math.PI * 2, size: [c * 0.07, c * 0.13], gravity: c * 2, life: [600, 1000] });
          }, bornAt - start);
        }
      }
      layerDirty = true;
      stage.wake();
      // le mot du coup, sur la dernière tuile ; le palier et le gain, au-dessus du plateau
      const fx = KIND_FX[kind] || KIND_FX.stone;
      const [lx, ly] = center(...cells[cells.length - 1]);
      const c = cell();
      stage.texts.add({ text: word, x: lx, y: ly - c * 0.4, size: Math.round(c * (0.46 + tier.rank * 0.06)), fill: fx.fill, look: 'word', tilt: (Math.random() - 0.5) * 0.3, delay: end * 0.4, life: 1000, rise: c * 0.5 });
      const top = MARGIN + c * 1.1;
      if (tier.label) stage.texts.add({ text: tier.label, x: stage.w / 2, y: top, size: Math.round(c * (0.52 + tier.rank * 0.07)), fill: tier.fill, font: 'display', look: 'label', rays: tier.rank >= 3, delay: end, life: 1500, rise: c * 0.3 });
      stage.texts.add({ text: `+${amount}`, x: stage.w / 2, y: top + c * (tier.label ? 1.05 : 0), size: Math.round(c * 0.42), fill: ['#FFF6D6', GOLD], delay: end + 140, life: 1200, rise: c * 0.6 });
      if (streak >= 2) stage.texts.add({ text: `Série ×${streak} !`, x: stage.w / 2, y: top + c * 1.75, size: Math.round(c * 0.34), fill: ['#FFE0F0', '#E8604C'], look: 'word', delay: end + 220, life: 1300, rise: c * 0.3, tilt: -0.06 });
      later(() => {
        // une gerbe d'étoiles autour du palier
        if (tier.label) stage.particles.burst(stage.w / 2, top, { n: 6 + tier.rank * 3, shape: 'star', colors: ['#FFF6D6', tier.fill[1], GOLD], speed: [c * 1.5, c * 4], spread: Math.PI * 2, size: [c * 0.07, c * 0.14], gravity: c * 3, life: [600, 1000] });
        stage.shake(tier.shake);
        if (tier.flash) stage.flash(tier.flash, 280);
        if (tier.freeze) stage.freeze(tier.freeze);
      }, end);
      return Math.max(end + POP_MS * 0.6, bornEnd);
    },
    // Les colonnes tombent : chaque tuile de la liste ([{ id, kind, x, y }]) descend de là où elle était, les nouvelles
    // (fresh, avec drops : la hauteur de chute par colonne) arrivent du haut ; shuffled : plus aucune chaîne possible, le
    // plateau a été rebattu. Rend la durée (ms)
    fall(list, fresh, drops, shuffled = false) {
      if (shuffled) stage.texts.add({ text: 'Tout se mélange !', x: stage.w / 2, y: stage.h / 2, size: Math.round(cell() * 0.44), fill: ['#F3E2FF', '#A86BE8'], font: 'display', look: 'label', rays: true, life: 1400 });
      const before = new Map([...tiles.values()].map(t => [t.id, t.y]));
      tiles.clear();
      const start = stage.t;
      for (const t of list) {
        const from = fresh.has(t.id) ? t.y - (drops[t.x] || SIZE) : before.get(t.id) ?? t.y;
        const moves = from !== t.y && !reduced;
        tiles.set(t.id, { ...t, from, fallAt: moves ? start + t.x * FALL_STEP : 0 });
      }
      layerDirty = true;
      stage.wake();
      // un peu de poussière où les tuiles atterrissent
      if (!reduced) {
        later(() => {
          const c = cell();
          for (let x = 0; x < SIZE; x++) {
            if (!drops[x]) continue;
            const [cx, cy] = center(x, SIZE - 1);
            stage.particles.burst(cx, cy + c * 0.45, { n: 3, shape: 'circle', colors: ['rgba(214, 190, 150, .8)'], speed: [c * 0.4, c * 1], angle: -Math.PI / 2, spread: Math.PI, size: [c * 0.05, c * 0.09], size1: 1.6, gravity: -c, life: [300, 500] });
          }
        }, FALL_MS * 0.8);
      }
      return reduced ? 0 : FALL_MS + SIZE * FALL_STEP;
    },
    // La case sous le doigt (seul le cœur d'une case compte), ou null
    cellAt(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const c = cell();
      const fx = (clientX - rect.left - MARGIN) / c, fy = (clientY - rect.top - MARGIN) / c;
      const x = Math.floor(fx), y = Math.floor(fy);
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return null;
      return Math.hypot(fx - x - 0.5, fy - y - 0.5) < 0.44 ? [x, y] : null;
    },
    destroy() {
      timers.forEach(clearTimeout);
      stage.destroy();
    }
  };
}

function stroke(ctx, points, color, width) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
