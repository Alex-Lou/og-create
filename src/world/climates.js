// Micro-climats de la très grande île (lot 9) : chaque quartier des terres nouvelles a son climat (le cœur est
// tempéré). Là où regarde la caméra, le climat prend le dessus sur le temps de l'île : sa lumière (sa teinte, et des
// dégradés : le froid qui tombe des cimes, la brume basse des landes et du marais, la chaleur qui monte des dunes, les
// rais filtrés de la jungle, le rougeoiement du volcan) et ce qui flotte dans l'air (flocons, rafales, spores, sable,
// gouttes, cendres et braises), en deux couches attachées au monde : tout près, par-dessus tout, ce qui fait le climat ;
// au loin, derrière ce qui se tient debout et pris par la lumière de l'heure, de quoi donner de la profondeur. Le
// passage d'un climat à l'autre se fond (mix).
import { hash } from './scene';
import { CLIMATE_TEXT } from '@/texts/world/climates';

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


/* ---------- La lumière et l'air des climats (à l'écran, attachés au monde) ---------- */

const wrap = (v, m) => ((v % m) + m) % m;

// Où se tient une particule à l'écran : sa place de base (bx, by, en pixels), décalée par la caméra (o : son centre, en
// pixels du monde à l'échelle de l'écran) selon sa couche (par : 1 suit le sol ; moins, elle est au loin ; plus, tout
// près), enroulée sur l'écran élargi d'une marge
export function placeOf(bx, by, o, par, w, h, marge = 40) {
  return { x: wrap(bx - o.x * par, w + 2 * marge) - marge, y: wrap(by - o.y * par, h + 2 * marge) - marge };
}

// Les averses de la jungle : elles passent (un peu moins de la moitié du temps), montent et retombent en douceur ; 0 à 1
export function averseJungle(t) {
  const v = Math.sin(t * 0.045) * 0.6 + Math.sin(t * 0.017 + 1.3) * 0.4;
  return Math.min(1, Math.max(0, (v - 0.1) / 0.35));
}

// Un point doux (flocon, spore, braise) : une petite image par teinte, dessinée une fois
const points = new Map();
function point(tone) {
  let c = points.get(tone);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${tone},1)`);
  grad.addColorStop(0.35, `rgba(${tone},.7)`);
  grad.addColorStop(1, `rgba(${tone},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  points.set(tone, c);
  return c;
}
function dots(ctx, tone, list) {
  const img = point(tone);
  for (const d of list) {
    ctx.globalAlpha = d.a;
    ctx.drawImage(img, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
  }
  ctx.globalAlpha = 1;
}

// Ce qui flotte, couche par couche : (ctx, w, h, t, a : le poids du climat, o : la caméra, nuit : 0 à 1). Tout près, ce
// qui fait le climat (flocons, rafales, brume, ondes de chaleur, averse, cendres et braises), un peu plus vif que la
// caméra ; au loin, de quoi donner de la profondeur (derrière ce qui se tient debout, plus lent qu'elle)
const AIR = {
  // Les cimes : des flocons, et quelques gros flocons flous tout près ; de fins flocons au loin
  cimes: {
    loin(ctx, w, h, t, a, o) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.6 * a).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 0; k < 60; k++) {
        const p = placeOf(hash(k, 1) * w + Math.sin(t * 0.8 + k) * 10, hash(k, 2) * h + t * (0.04 + hash(k, 3) * 0.04) * h, o, 0.7, w, h);
        const r = 0.7 + hash(k, 4) * 0.9;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    },
    pres(ctx, w, h, t, a, o) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.85 * a).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 0; k < 110; k++) {
        const p = placeOf(hash(k, 11) * w + Math.sin(t * 0.8 + k) * 14, hash(k, 12) * h + t * (0.06 + hash(k, 13) * 0.06) * h, o, 1.1, w, h);
        const r = 1 + hash(k, 14) * 1.8;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
      const list = [];
      for (let k = 0; k < 18; k++) {
        const p = placeOf(hash(k, 31) * w + Math.sin(t * 0.6 + k) * 22, hash(k, 32) * h + t * (0.14 + hash(k, 33) * 0.08) * h, o, 1.45, w, h);
        list.push({ ...p, r: 2.6 + hash(k, 34) * 2.4, a: 0.5 * a });
      }
      dots(ctx, '255,255,255', list);
    }
  },
  // Les landes : des rafales, et des pétales de bruyère qui filent ; quelques rafales pâles au loin
  landes: {
    loin(ctx, w, h, t, a, o) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.2 * a).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const p = placeOf(hash(k, 46) * w * 1.3 + t * (0.25 + hash(k, 47) * 0.2) * w, hash(k, 45) * h, o, 0.7, w, h, 120);
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + 30, p.y - 4 * Math.sin(t * 2 + k), p.x + 60, p.y);
      }
      ctx.stroke();
    },
    pres(ctx, w, h, t, a, o, nuit) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.45 * a).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k < 18; k++) {
        const p = placeOf(hash(k, 6) * w * 1.3 + t * (0.35 + hash(k, 7) * 0.3) * w, hash(k, 5) * h, o, 1.15, w, h, 120);
        const len = 40 + hash(k, 8) * 60;
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + len * 0.5, p.y - 6 * Math.sin(t * 2 + k), p.x + len, p.y);
      }
      ctx.stroke();
      ctx.fillStyle = `rgba(176, 122, 196, ${(0.7 * a * (1 - 0.4 * nuit)).toFixed(3)})`;
      for (let k = 0; k < 12; k++) {
        const p = placeOf(hash(k, 41) * w + t * (0.5 + hash(k, 42) * 0.3) * w, hash(k, 43) * h + Math.sin(t * 2.3 + k) * 14, o, 1.35, w, h);
        ctx.fillRect(p.x, p.y, 3.2, 1.4 + Math.abs(Math.sin(t * 5 + k * 1.7)) * 1.6);
      }
    }
  },
  // Le marais : des nappes de brume qui traînent, et des spores qui montent (elles luisent la nuit) ; au loin, des
  // nappes plus basses
  marais: {
    loin(ctx, w, h, t, a, o) {
      for (let k = 0; k < 3; k++) {
        const p = placeOf(hash(k, 66) * w + t * (3 + k), h * (0.55 + k * 0.15), o, 0.6, w, h, w * 0.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w * 0.35);
        g.addColorStop(0, `rgba(236, 242, 236, ${(0.2 * a).toFixed(3)})`);
        g.addColorStop(1, 'rgba(236, 242, 236, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(p.x - w * 0.35, p.y - w * 0.35, w * 0.7, w * 0.7);
      }
    },
    pres(ctx, w, h, t, a, o, nuit) {
      for (let k = 0; k < 5; k++) {
        const p = placeOf(hash(k, 63) * w + t * (5 + k * 1.5), h * (0.15 + k * 0.18) + Math.sin(t * 0.09 + k) * 14, o, 0.95, w, h, w * 0.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w * 0.4);
        g.addColorStop(0, `rgba(236, 242, 236, ${(0.34 * a).toFixed(3)})`);
        g.addColorStop(1, 'rgba(236, 242, 236, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(p.x - w * 0.4, p.y - w * 0.4, w * 0.8, w * 0.8);
      }
      const list = [];
      for (let k = 0; k < 26; k++) {
        const p = placeOf(hash(k, 51) * w + Math.sin(t * 0.7 + k) * 16, hash(k, 52) * h - t * (0.03 + hash(k, 53) * 0.03) * h, o, 1.3, w, h);
        list.push({ ...p, r: 1.6 + hash(k, 54) * 1.6, a: a * (0.35 + 0.5 * nuit) * (0.6 + 0.4 * Math.sin(t * 2 + k)) });
      }
      ctx.globalCompositeOperation = 'lighter';
      dots(ctx, '214,240,160', list);
      ctx.globalCompositeOperation = 'source-over';
    }
  },
  // Les dunes : les ondes de chaleur, et des grains de sable qui filent (rien au loin : la chaleur est partout)
  dunes: {
    loin() {},
    pres(ctx, w, h, t, a, o, nuit) {
      ctx.strokeStyle = `rgba(255, 244, 220, ${(0.28 * a).toFixed(3)})`;
      ctx.lineWidth = 2;
      for (let k = 0; k < 7; k++) {
        const y = wrap(h - t * 12 - k * (h / 7) - o.y * 0.5, h);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin((x + o.x * 0.5) * 0.03 + t * 2 + k) * 3);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(236, 206, 150, ${(0.6 * a * (1 - 0.4 * nuit)).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k < 40; k++) {
        const p = placeOf(hash(k, 71) * w + t * (0.9 + hash(k, 72) * 0.6) * w, hash(k, 73) * h + Math.sin(t * 3 + k) * 4, o, 1.35, w, h);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 5 + hash(k, 74) * 6, p.y + 0.6);
      }
      ctx.stroke();
    }
  },
  // La jungle : des averses qui passent (la pluie, de grosses gouttes tout près), le pollen doré entre deux ; au loin, la
  // pluie plus fine
  jungle: {
    loin(ctx, w, h, t, a, o) {
      const pluie = averseJungle(t);
      if (pluie < 0.02) return;
      ctx.strokeStyle = `rgba(190, 215, 225, ${(0.3 * a * pluie).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < Math.round(120 * pluie); k++) {
        const p = placeOf(hash(k, 15) * w, hash(k, 16) * h + t * (1.1 + hash(k, 17) * 0.4) * h, o, 0.75, w, h);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 1.5, p.y - 10);
      }
      ctx.stroke();
    },
    pres(ctx, w, h, t, a, o, nuit) {
      const pluie = averseJungle(t);
      if (pluie > 0.02) {
        ctx.strokeStyle = `rgba(190, 215, 225, ${(0.55 * a * pluie).toFixed(3)})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let k = 0; k < Math.round(260 * pluie); k++) {
          const p = placeOf(hash(k, 11) * (w + 40), hash(k, 12) * h + t * (1.4 + hash(k, 13) * 0.6) * h, o, 1.1, w, h);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y - 14 - hash(k, 14) * 8);
        }
        ctx.stroke();
      }
      const list = [];
      for (let k = 0; k < 18; k++) {
        const p = placeOf(hash(k, 91) * w + Math.sin(t * 0.5 + k) * 20, hash(k, 92) * h + Math.cos(t * 0.4 + k) * 16, o, 1.3, w, h);
        list.push({ ...p, r: 1.5 + hash(k, 93) * 1.2, a: 0.6 * a * (1 - 0.6 * nuit) * (1 - pluie) });
      }
      dots(ctx, '255,226,140', list);
    }
  },
  // Le volcan : la cendre qui tombe et les braises qui montent (elles brillent, la nuit plus encore) ; au loin, la cendre
  volcan: {
    loin(ctx, w, h, t, a, o) {
      ctx.fillStyle = `rgba(90, 84, 80, ${(0.4 * a).toFixed(3)})`;
      for (let k = 0; k < 40; k++) {
        const p = placeOf(hash(k, 24) * w + Math.sin(t * 0.6 + k) * 12, hash(k, 25) * h + t * (0.03 + hash(k, 26) * 0.03) * h, o, 0.7, w, h);
        ctx.fillRect(p.x, p.y, 1.8, 1.2);
      }
    },
    pres(ctx, w, h, t, a, o, nuit) {
      for (let k = 0; k < 70; k++) {
        const ember = k % 9 === 0;
        const speed = ember ? -0.08 - hash(k, 23) * 0.05 : 0.04 + hash(k, 23) * 0.04;
        const p = placeOf(hash(k, 21) * w + Math.sin(t * 0.6 + k) * 18, hash(k, 22) * h + t * speed * h, o, 1.1, w, h);
        ctx.fillStyle = ember ? `rgba(255, 150, 70, ${(0.9 * a * (0.6 + 0.4 * Math.sin(t * 6 + k))).toFixed(3)})` : `rgba(90, 84, 80, ${(0.6 * a).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, ember ? 2 : 2.4, ember ? 2 : 1.6);
      }
      const list = [];
      for (let k = 0; k < 18; k++) {
        const p = placeOf(hash(k, 101) * w + Math.sin(t * 0.9 + k) * 14, hash(k, 102) * h - t * (0.08 + hash(k, 103) * 0.06) * h, o, 1.35, w, h);
        list.push({ ...p, r: 1.8 + hash(k, 104) * 1.4, a: a * (0.55 + 0.4 * nuit) * (0.6 + 0.4 * Math.sin(t * 6 + k)) });
      }
      ctx.globalCompositeOperation = 'lighter';
      dots(ctx, '255,140,60', list);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
};

// La teinte de chaque climat, sur toute la scène (son identité : elle reste), sous ses dégradés
const TINTS = {
  cimes: 'rgba(200, 222, 255, .16)',
  landes: 'rgba(170, 160, 190, .12)',
  marais: 'rgba(150, 175, 140, .16)',
  dunes: 'rgba(255, 210, 140, .15)',
  jungle: 'rgba(90, 160, 110, .14)',
  volcan: 'rgba(120, 60, 50, .2)'
};

// Un dégradé vertical de l'écran : de (y0, couleur, alpha) à (y1, couleur, alpha), en fractions de la hauteur
function band(ctx, w, h, y0, y1, color, a0, a1) {
  const g = ctx.createLinearGradient(0, h * y0, 0, h * y1);
  g.addColorStop(0, `rgba(${color},${a0.toFixed(3)})`);
  g.addColorStop(1, `rgba(${color},${a1.toFixed(3)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.min(h * y0, h * y1), w, Math.abs(h * (y1 - y0)));
}
// La lumière de chaque climat, par-dessus sa teinte (a : son poids, nuit : 0 à 1)
const LUMIERE = {
  cimes: (ctx, w, h, t, a) => band(ctx, w, h, 0, 0.6, '214,232,255', 0.22 * a, 0),
  landes: (ctx, w, h, t, a) => band(ctx, w, h, 0.45, 1, '176,166,198', 0, 0.2 * a),
  marais: (ctx, w, h, t, a) => {
    ctx.fillStyle = `rgba(228,236,228,${(0.22 * a).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
    band(ctx, w, h, 0.35, 1, '170,192,160', 0, 0.26 * a);
  },
  dunes: (ctx, w, h, t, a) => { band(ctx, w, h, 0.3, 1, '255,204,140', 0, 0.22 * a); band(ctx, w, h, 0, 0.35, '255,246,220', 0.08 * a, 0); },
  jungle: (ctx, w, h, t, a, nuit) => {
    const pluie = averseJungle(t);
    if (pluie > 0.02) {
      ctx.fillStyle = `rgba(120,170,140,${(0.1 * a * pluie).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
    }
    // des rais de lumière qui tombent à travers la canopée, et se balancent (moins sous l'averse, rien la nuit)
    const k = 0.08 * a * (1 - nuit) * (1 - 0.7 * pluie);
    if (k < 0.005) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const x = w * (0.2 + 0.3 * i) + Math.sin(t * 0.2 + i * 2) * w * 0.04;
      const g = ctx.createLinearGradient(0, 0, 0, h * 0.85);
      g.addColorStop(0, `rgba(255,240,170,${k.toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,240,170,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + w * 0.08, 0);
      ctx.lineTo(x + w * 0.2, h * 0.85);
      ctx.lineTo(x + w * 0.06, h * 0.85);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
  volcan: (ctx, w, h, t, a, nuit) => { band(ctx, w, h, 0.4, 1, '255,90,40', 0, (0.16 + 0.16 * nuit) * a); band(ctx, w, h, 0, 0.4, '50,24,24', 0.12 * a, 0); }
};

// Le(s) climat(s) visé(s) par la caméra, à l'écran (w, h). couche : 'loin' (ce qui flotte au loin, dessiné avant ce qui
// se tient debout : il passe derrière, la lumière de l'heure le prend) ou 'pres' (la lumière du climat et ce qui flotte
// tout près, par-dessus tout). o : le centre de la caméra en pixels ({ x: cam.x × s, y: cam.y × s }) ; nuit : 0 à 1 ;
// reduced : mouvement réduit (la lumière seule)
export function drawClimate(ctx, w, h, t, mix, reduced = false, couche = 'pres', o = { x: 0, y: 0 }, nuit = 0) {
  const entries = Object.entries(mix).filter(([id]) => AIR[id]);
  if (!entries.length) return;
  ctx.save();
  for (const [id, weight] of entries) {
    if (couche === 'pres') {
      ctx.globalAlpha = weight;
      ctx.fillStyle = TINTS[id];
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      LUMIERE[id](ctx, w, h, t, weight, nuit);
    }
    if (!reduced) AIR[id][couche](ctx, w, h, t, weight, o, nuit);
  }
  ctx.restore();
}
