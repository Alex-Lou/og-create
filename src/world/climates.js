// Micro-climats de la très grande île (lot 9) : chaque quartier des terres nouvelles a son climat (le cœur est
// tempéré). Là où regarde la caméra, le climat teinte la lumière (sans forme, comme l'étalonnage de l'heure) ; et sur
// son terrain seulement, dans le monde, il remplit l'air : neige des cimes, rafales et pétales des landes, nappes et
// spores du marais, chaleur et sable des dunes, averses, pollen et rais de lumière de la jungle, cendre et braises du
// volcan. Chaque particule a sa place au sol, son altitude et sa taille dans le monde (elle grossit au zoom, la neige
// tombe jusqu'au sol) ; à la lisière d'un quartier, son climat s'arrête. Le passage d'une teinte à l'autre se fond (mix).
import { hash } from './scene';
import { tuilesOf, TUILE } from './tuiles';
import { selonQualite } from './perf';

export { tuilesOf, TUILE };
import { CLIMATE_TEXT } from '@/texts/world/climates';
import { frac } from './maths';
import { rond, texture } from './textures';

export const CLIMATE_NAMES = {
  tempere: 'Tempéré', cimes: 'Les Cimes', landes: 'Les Landes', marais: 'Le Marais', dunes: 'Les Dunes', jungle: 'La Jungle', volcan: 'Le Volcan'
};
// Ce que dit le climat d'un quartier découvert (fiche du quartier)
export { CLIMATE_TEXT };
// Climat d'une case (quartiers de l'île vus par le joueur ; un quartier inconnu n'en dit rien), ou null
export function climateAt(M, zones, x, y) {
  const zone = zones[M.zone(Math.round(x), Math.round(y))];
  return zone && zone.known !== false ? zone.climate || null : null;
}

// Mélange qui suit le climat visé : chaque climat monte vers 1 s'il est visé, descend vers 0 sinon (rate : part du
// chemin faite par seconde ; dt en secondes). Renvoie un nouveau mélange, sans les climats éteints
export function mixToward(mix, target, dt, rate = 1.5) {
  const k = Math.min(1, dt * rate);
  const out = {};
  for (const id of new Set([...Object.keys(mix), ...(target && target !== 'tempere' ? [target] : [])])) {
    const goal = id === target ? 1 : 0;
    const w = (mix[id] || 0) + (goal - (mix[id] || 0)) * k;
    if (w > 0.01) out[id] = w;
  }
  return out;
}


/* ---------- La lumière des climats (une teinte, sans forme) ---------- */

const TINTS = {
  cimes: 'rgba(200, 222, 255, .16)',
  landes: 'rgba(170, 160, 190, .12)',
  marais: 'rgba(150, 175, 140, .16)',
  dunes: 'rgba(255, 210, 140, .15)',
  jungle: 'rgba(90, 160, 110, .14)',
  volcan: 'rgba(120, 60, 50, .2)'
};
// La teinte du (des) climat(s) visé(s) par la caméra, sur toute la scène (à l'écran : un étalonnage, pas un effet)
export function drawClimate(ctx, w, h, mix) {
  const entries = Object.entries(mix).filter(([id]) => TINTS[id]);
  if (!entries.length) return;
  ctx.save();
  for (const [id, weight] of entries) {
    ctx.globalAlpha = weight;
    ctx.fillStyle = TINTS[id];
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

/* ---------- L'air des climats, dans le monde ---------- */

// Les averses de la jungle : elles passent (un peu moins de la moitié du temps), montent et retombent en douceur ; 0 à 1
export function averseJungle(t) {
  const v = Math.sin(t * 0.045) * 0.6 + Math.sin(t * 0.017 + 1.3) * 0.4;
  return Math.min(1, Math.max(0, (v - 0.1) / 0.35));
}

const wrap = (v, m) => ((v % m) + m) % m;
// (le monde est découpé en carreaux : world/tuiles.js)

// Un point doux (flocon, spore, braise, pollen) : une petite image par teinte, dessinée une fois
const point = tone => rond(`point:${tone}`, 32, [[0, `rgba(${tone},1)`], [0.35, `rgba(${tone},.7)`], [1, `rgba(${tone},0)`]]);
// Une nappe de brume posée au sol (plate, en perspective), dessinée une fois
const nappeImg = () => texture('nappe-du-marais', 128, 64, g => {
  g.scale(1, 0.5);
  g.drawImage(rond('nappe-ronde', 128, [[0, 'rgba(236,242,236,1)'], [0.5, 'rgba(236,242,236,.5)'], [1, 'rgba(236,242,236,0)']]), 0, 0);
});

// Le dégradé d'un rai de la canopée (de 220 au-dessus du sol jusqu'au sol), fait une fois par contexte de dessin
const rais = new WeakMap();
function degradeRai(ctx) {
  let g = rais.get(ctx);
  if (!g) {
    g = ctx.createLinearGradient(0, -220, 0, 0);
    g.addColorStop(0, 'rgba(255,240,170,1)');
    g.addColorStop(1, 'rgba(255,240,170,0)');
    rais.set(ctx, g);
  }
  return g;
}

// Ce que porte chaque climat, passe par passe : 'sol' (au ras du sol, derrière ce qui se tient debout), 'air' (ce qui
// flotte, pris par la lumière de l'heure) et 'lueurs' (ce qui brille de soi-même, après elle). Chaque fonction reçoit
// un carreau, le temps, ici(x, y) : vrai si ce point du sol est de ce climat, nuit (0 à 1) et a (la force : le zoom)
const AIR = {
  cimes: {
    air(ctx, T, t, ici, nuit, a) {
      ctx.fillStyle = `rgba(255,255,255,${(0.9 * a).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 0, nb = selonQualite(60); k < nb; k++) {
        const x0 = T.X + hash(T.n + k, 1) * TUILE, y0 = T.Y + hash(T.n + k, 2) * TUILE;
        if (!ici(x0, y0)) continue;
        const ph = frac(t / (5 + hash(T.n + k, 3) * 4) + hash(T.n + k, 4));
        const z = 150 * (1 - ph);
        const x = x0 + Math.sin(t * 0.9 + k) * 6 + ph * 18;
        const r = 1.1 + hash(T.n + k, 5) * 1.4;
        ctx.moveTo(x + r, y0 - z);
        ctx.arc(x, y0 - z, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  },
  landes: {
    air(ctx, T, t, ici, nuit, a) {
      ctx.strokeStyle = `rgba(255,255,255,${(0.45 * a).toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const x = T.X + wrap(hash(T.n + k, 6) * TUILE + t * (70 + 40 * hash(T.n + k, 7)), TUILE), y0 = T.Y + hash(T.n + k, 8) * TUILE;
        if (!ici(x, y0)) continue;
        const y = y0 - 25 - hash(T.n + k, 9) * 40, len = 34 + hash(T.n + k, 10) * 30;
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + len * 0.5, y - 5 * Math.sin(t * 2 + k), x + len, y);
      }
      ctx.stroke();
      ctx.fillStyle = `rgba(176,122,196,${(0.75 * a).toFixed(3)})`;
      for (let k = 0, nb = selonQualite(12); k < nb; k++) {
        const x = T.X + wrap(hash(T.n + k, 11) * TUILE + t * (50 + 30 * hash(T.n + k, 12)), TUILE), y0 = T.Y + hash(T.n + k, 13) * TUILE;
        if (!ici(x, y0)) continue;
        const z = 10 + 30 * hash(T.n + k, 14) + Math.sin(t * 2 + k) * 6;
        ctx.fillRect(x, y0 - z, 2.6, 1.2 + Math.abs(Math.sin(t * 5 + k * 1.7)) * 1.4);
      }
    }
  },
  marais: {
    sol(ctx, T, t, ici, nuit, a) {
      const img = nappeImg();
      for (let k = 0; k < 2; k++) {
        const x = T.X + wrap(hash(T.n + k, 15) * TUILE + t * 4, TUILE), y = T.Y + hash(T.n + k, 16) * TUILE;
        if (!ici(x, y)) continue;
        const r = 90 + hash(T.n + k, 17) * 50;
        ctx.globalAlpha = 0.3 * a;
        ctx.drawImage(img, x - r, y - r * 0.5, r * 2, r);
      }
      ctx.globalAlpha = 1;
    },
    air(ctx, T, t, ici, nuit, a) { sporesOf(ctx, T, t, ici, a * 0.5 * (1 - nuit)); },
    lueurs(ctx, T, t, ici, nuit, a) { if (nuit > 0.05) sporesOf(ctx, T, t, ici, a * 0.8 * nuit, true); }
  },
  dunes: {
    sol(ctx, T, t, ici, nuit, a) {
      ctx.strokeStyle = `rgba(255,244,220,${(0.24 * a * (1 - nuit)).toFixed(3)})`;
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 3; k++) {
        const x0 = T.X + hash(T.n + k, 18) * TUILE, y0 = T.Y + hash(T.n + k, 19) * TUILE;
        if (!ici(x0, y0)) continue;
        const ph = frac(t / 4 + hash(T.n + k, 20));
        const y = y0 - 3 - 10 * ph;
        ctx.beginPath();
        for (let x = -30; x <= 30; x += 6) ctx.lineTo(x0 + x, y + Math.sin(x * 0.2 + t * 3 + k) * 1.5);
        ctx.stroke();
      }
    },
    air(ctx, T, t, ici, nuit, a) {
      ctx.strokeStyle = `rgba(236,206,150,${(0.65 * a).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0, nb = selonQualite(26); k < nb; k++) {
        const x = T.X + wrap(hash(T.n + k, 21) * TUILE + t * (160 + 80 * hash(T.n + k, 22)), TUILE), y0 = T.Y + hash(T.n + k, 23) * TUILE;
        if (!ici(x, y0)) continue;
        const y = y0 - 2 - 10 * hash(T.n + k, 24) - Math.abs(Math.sin(t * 3 + k)) * 3;
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5 + hash(T.n + k, 25) * 4, y + 0.5);
      }
      ctx.stroke();
    }
  },
  jungle: {
    air(ctx, T, t, ici, nuit, a) {
      const pluie = averseJungle(t);
      if (pluie > 0.02) {
        ctx.strokeStyle = `rgba(200,222,232,${(0.55 * a * pluie).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0, nb = selonQualite(40 * pluie); k < nb; k++) {
          const x0 = T.X + hash(T.n + k, 26) * TUILE, y0 = T.Y + hash(T.n + k, 27) * TUILE;
          if (!ici(x0, y0)) continue;
          const ph = frac(t / 0.7 + hash(T.n + k, 28));
          const z = 180 * (1 - ph);
          ctx.moveTo(x0 + z * 0.08, y0 - z);
          ctx.lineTo(x0 + z * 0.08 - 1.5, y0 - z - 14);
        }
        ctx.stroke();
      }
      // des rais de lumière qui tombent de la canopée jusqu'au sol (le jour, moins sous l'averse)
      const rai = 0.1 * a * (1 - nuit) * (1 - 0.7 * pluie);
      if (rai > 0.005) {
        ctx.globalCompositeOperation = 'lighter';
        const x0 = T.X + hash(T.n, 29) * TUILE, y0 = T.Y + hash(T.n, 30) * TUILE;
        if (ici(x0, y0)) {
          const sway = Math.sin(t * 0.2 + T.n) * 6;
          // (un seul dégradé, fait une fois et posé au pied du rai : degradeRai)
          ctx.save();
          ctx.translate(0, y0);
          ctx.globalAlpha = rai;
          ctx.fillStyle = degradeRai(ctx);
          ctx.beginPath();
          ctx.moveTo(x0 + 50 + sway, -220);
          ctx.lineTo(x0 + 70 + sway, -220);
          ctx.lineTo(x0 + 24, 0);
          ctx.lineTo(x0 - 16, 0);
          ctx.fill();
          ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      const img = point('255,226,140');
      for (let k = 0, nb = selonQualite(8); k < nb; k++) {
        const x0 = T.X + hash(T.n + k, 31) * TUILE + Math.sin(t * 0.5 + k) * 14, y0 = T.Y + hash(T.n + k, 32) * TUILE;
        if (!ici(x0, y0)) continue;
        const z = 15 + 30 * hash(T.n + k, 33) + Math.cos(t * 0.4 + k) * 8;
        const r = 1.4 + hash(T.n + k, 34);
        ctx.globalAlpha = 0.65 * a * (1 - 0.6 * nuit) * (1 - pluie);
        ctx.drawImage(img, x0 - r, y0 - z - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    }
  },
  volcan: {
    air(ctx, T, t, ici, nuit, a) {
      ctx.fillStyle = `rgba(80,74,70,${(0.7 * a).toFixed(3)})`;
      for (let k = 0, nb = selonQualite(34); k < nb; k++) {
        const x0 = T.X + hash(T.n + k, 35) * TUILE, y0 = T.Y + hash(T.n + k, 36) * TUILE;
        if (!ici(x0, y0)) continue;
        const ph = frac(t / (9 + hash(T.n + k, 37) * 5) + hash(T.n + k, 38));
        const z = 140 * (1 - ph);
        ctx.fillRect(x0 + Math.sin(t * 0.6 + k) * 10, y0 - z, 2.6, 1.8);
      }
    },
    lueurs(ctx, T, t, ici, nuit, a) {
      const img = point('255,140,60');
      for (let k = 0, nb = selonQualite(8); k < nb; k++) {
        const x0 = T.X + hash(T.n + k, 39) * TUILE, y0 = T.Y + hash(T.n + k, 40) * TUILE;
        if (!ici(x0, y0)) continue;
        const ph = frac(t / (4 + hash(T.n + k, 41) * 3) + hash(T.n + k, 42));
        const z = 90 * ph;
        const r = 1.6 + hash(T.n + k, 43) * 1.2;
        ctx.globalAlpha = a * (0.55 + 0.4 * nuit) * (1 - ph) * (0.6 + 0.4 * Math.sin(t * 6 + k));
        ctx.drawImage(img, x0 + Math.sin(t * 0.9 + k) * 8 - r, y0 - z - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    }
  }
};
// Les spores du marais : elles montent doucement ; la nuit, elles luisent (glow : en lumière qui s'ajoute)
function sporesOf(ctx, T, t, ici, a, glow = false) {
  if (a < 0.01) return;
  const img = point(glow ? '214,240,160' : '226,236,200');
  for (let k = 0, nb = selonQualite(12); k < nb; k++) {
    const x0 = T.X + hash(T.n + k, 44) * TUILE + Math.sin(t * 0.7 + k) * 10, y0 = T.Y + hash(T.n + k, 45) * TUILE;
    if (!ici(x0, y0)) continue;
    const ph = frac(t / (6 + hash(T.n + k, 46) * 4) + hash(T.n + k, 47));
    const r = 1.4 + hash(T.n + k, 48) * 1.2;
    ctx.globalAlpha = a * Math.sin(ph * Math.PI);
    ctx.drawImage(img, x0 - r, y0 - 60 * ph - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

// Une passe de l'air des climats, dans la transformation du monde : passe 'sol', 'air' ou 'lueurs' ; view : le rectangle
// du monde à l'écran ; climatOf(x, y) : le climat du sol en ce point du monde (ou null) ; s : l'échelle de l'écran (vue
// de très loin, rien : ce ne serait que du bruit)
export function drawClimatMonde(ctx, passe, view, t, climatOf, nuit = 0, s = 1) {
  const a = Math.min(1, (s - 0.45) / 0.15);
  if (a <= 0) return;
  ctx.save();
  if (passe === 'lueurs') ctx.globalCompositeOperation = 'lighter';
  for (const { T, ids } of carreauxDe(view, climatOf)) {
    for (const id of ids) if (AIR[id][passe]) AIR[id][passe](ctx, T, t, (x, y) => climatOf(x, y) === id, nuit, a);
  }
  ctx.restore();
}
// Les carreaux de la vue et les climats présents dans chacun (son centre et ses coins suffisent à les trouver) : lus une
// fois par image pour les trois passes (la vue est refaite à chaque image)
let carreaux = null;
function carreauxDe(view, climatOf) {
  if (carreaux && carreaux.view === view) return carreaux.list;
  const list = [];
  for (const T of tuilesOf(view)) {
    const ids = new Set();
    for (const [u, v] of [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1]]) {
      const id = climatOf(T.X + u * TUILE, T.Y + v * TUILE);
      if (id && AIR[id]) ids.add(id);
    }
    if (ids.size) list.push({ T, ids });
  }
  carreaux = { view, list };
  return list;
}
// Un quartier connu de l'île porte-t-il l'air d'un climat ? (sinon, rien à chercher : le début d'une partie)
export const climatsPresents = zones => zones.some(z => z.known !== false && AIR[z.climate]);
