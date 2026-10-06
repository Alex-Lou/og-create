// Teintes de la boutique (skins) : une teinte recolore tout le dessin d'un bâtiment, à tous les paliers, sans le
// redessiner. Chaque couleur du SVG est rangée par famille de teinte (chauds, feuillages, bleus, violets), puis
// transformée en TSL : la teinte et la saturation changent, la lumière relative (dessus, faces, ombres) reste.
// Les couleurs presque grises bougent d'autant moins qu'elles sont grises ; les lueurs (vitres, flammes, or clair)
// gardent leur couleur, pour que les fenêtres luisent toujours la nuit.

// Une règle : h = teinte visée (degrés), k = part de l'écart à la teinte d'origine gardée (0 : toutes à h),
// s = facteur de saturation, l = facteur de lumière, lift = part de blanc ajoutée (0 à 1), tone = saturation des gris
export const TINTS = {
  craie: { name: 'Craie', all: { s: 0.5, lift: 0.45 } },
  sepia: { name: 'Sépia', all: { h: 32, k: 0.15, s: 0.55, lift: 0.05, tone: 0.25 } },
  corail: { name: 'Corail', warm: { h: 8, k: 0.5, s: 1.05, lift: 0.08 }, violet: { h: 8, k: 0.5, s: 1.05, lift: 0.08 }, leaf: { h: 160, k: 0.4, s: 0.8 } },
  ocean: { name: 'Océan', warm: { h: 206, k: 0.5, s: 0.8 }, violet: { h: 206, k: 0.5, s: 0.8 }, leaf: { h: 165, k: 0.4, s: 0.9 } },
  emeraude: { name: 'Émeraude', warm: { h: 150, k: 0.5, s: 0.75 }, violet: { h: 150, k: 0.5, s: 0.75 }, leaf: { h: 140, k: 0.4, s: 1.05, l: 0.9 } },
  lavande: { name: 'Lavande', warm: { h: 268, k: 0.5, s: 0.6, lift: 0.15 }, violet: { h: 268, k: 0.5, s: 0.6, lift: 0.15 }, leaf: { h: 120, k: 0.4, s: 0.55 } },
  flamboyant: { name: 'Flamboyant', warm: { h: 356, k: 0.35, s: 1.05, l: 0.92 }, violet: { h: 356, k: 0.35, s: 1.05, l: 0.92 }, leaf: { h: 26, k: 0.25, s: 1.1 } },
  sakura: { name: 'Sakura', warm: { h: 342, k: 0.25, s: 0.85, lift: 0.12 }, violet: { h: 342, k: 0.25, s: 0.85, lift: 0.12 }, leaf: { h: 335, k: 0.2, s: 0.75, lift: 0.22 } },
  frimas: { name: 'Frimas', all: { h: 205, k: 0.1, s: 0.35, lift: 0.38, tone: 0.3 } },
  cristal: { name: 'Cristal', warm: { h: 272, k: 0.2, s: 0.9, lift: 0.12 }, violet: { h: 272, k: 0.2, s: 0.9, lift: 0.12 }, leaf: { h: 186, k: 0.2, s: 0.9, lift: 0.12 }, cool: { h: 196, k: 0.5, s: 1.1, lift: 0.1 } },
  'nuit-etoilee': { name: 'Nuit étoilée', all: { h: 232, k: 0.12, s: 0.7, l: 0.55, tone: 0.3 } },
  'or-royal': { name: 'Or royal', warm: { h: 44, k: 0.3, s: 1.1, lift: 0.04 }, violet: { h: 44, k: 0.3, s: 1.05, lift: 0.04 }, leaf: { h: 150, k: 0.3, s: 0.8, l: 0.75 } }
};
export const TINT_IDS = Object.keys(TINTS);
// Teinte propre à chaque pièce rare (rareSprites.js), sous l'identifiant de la pièce ; elle ne se vend pas seule
export const RARE_TINTS = {
  papillons: { all: { s: 0.7, lift: 0.22 } },
  tournesols: { warm: { h: 46, k: 0.4, s: 1.1, lift: 0.04 }, leaf: { h: 85, k: 0.4, s: 1 } },
  'filon-or': { all: { h: 220, k: 0.1, s: 0.35, l: 0.72, tone: 0.06 } },
  'coeur-lave': { all: { h: 12, k: 0.1, s: 0.45, l: 0.55, tone: 0.14 } },
  fees: { warm: { h: 285, k: 0.5, s: 0.55 }, violet: { h: 285, k: 0.5, s: 0.55 }, leaf: { h: 258, k: 0.35, s: 0.55, lift: 0.1 } },
  petales: { leaf: { h: 345, k: 0.2, s: 0.55, lift: 0.38 }, violet: { h: 340, k: 0.2, s: 0.6, lift: 0.3 } },
  'arc-en-ciel': { all: { s: 0.6, lift: 0.3 } },
  nenuphars: { warm: { h: 165, k: 0.5, s: 0.55, lift: 0.05 }, violet: { h: 165, k: 0.5, s: 0.55, lift: 0.05 }, leaf: { h: 150, k: 0.5, s: 0.9 } },
  pavois: { warm: { h: 212, k: 0.4, s: 0.85 }, violet: { h: 212, k: 0.4, s: 0.85 }, all: { lift: 0.08 } },
  mouettes: { all: { h: 200, k: 0.2, s: 0.45, lift: 0.28, tone: 0.12 } },
  etincelles: { warm: { h: 26, k: 0.4, s: 0.95, l: 0.82 }, violet: { h: 26, k: 0.4, s: 0.95, l: 0.82 }, all: { s: 0.9, l: 0.85 } },
  engrenages: { warm: { h: 44, k: 0.35, s: 0.95, lift: 0.02 }, violet: { h: 44, k: 0.35, s: 0.95, lift: 0.02 } },
  lampions: { warm: { h: 18, k: 0.6, s: 1.15, l: 0.9 }, violet: { h: 340, k: 0.5, s: 1 }, all: { l: 0.92 } },
  lierre: { warm: { h: 70, k: 0.4, s: 0.45, l: 0.85 }, violet: { h: 90, k: 0.4, s: 0.4 }, leaf: { h: 105, k: 0.4, s: 0.9, l: 0.85 } }
};

const clamp = n => Math.max(0, Math.min(1, n));
const toHsl = hex => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const c = max - min;
  if (!c) return [0, 0, l, 0];
  const s = c / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / c + 6) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
  return [h * 60, s, l, c];
};
const toHex = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${[r, g, b].map(n => Math.round((n + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
};

// Famille d'une teinte (degrés) et son centre, pour garder les nuances autour de la teinte visée
const FAMILIES = [['warm', 320, 425, 22], ['leaf', 65, 170, 110], ['cool', 170, 255, 210], ['violet', 255, 320, 285]];
const familyOf = h => FAMILIES.find(([, a, b]) => (h >= a && h < b) || (h + 360 >= a && h + 360 < b));
const isGlow = (h, l, c) => l > 0.72 && c > 0.28 && h >= 35 && h <= 62;

// Règle appliquée à une couleur [h, s, l] ; center : centre de sa famille ; grey : 1 pour un gris, 0 pour une couleur franche
function applyRule(rule, [h, s, l], center, grey) {
  const off = ((h - center + 540) % 360) - 180;
  const nh = rule.h === undefined ? h : (rule.h + off * (rule.k ?? 0) + 360) % 360;
  // Les gris prennent un peu de la teinte visée (tone) au lieu de rester neutres
  const ns = Math.max(clamp(s * (rule.s ?? 1)), (rule.tone || 0) * grey);
  const nl = clamp(l * (rule.l ?? 1));
  return [nh, ns, nl + (1 - nl) * (rule.lift || 0)];
}

function recolor(tint, hex) {
  const [h, s, l, c] = toHsl(hex);
  if (isGlow(h, l, c)) return hex;
  const family = familyOf(h);
  const center = family ? family[3] : 0;
  const grey = 1 - clamp((c - 0.05) / 0.15);
  let hsl = [h, s, l];
  // Règle de la famille : elle s'efface sur les gris (une teinte n'a pas de sens sur un gris)
  const rule = family && tint[family[0]];
  if (rule && grey < 1) {
    const [nh, ns, nl] = applyRule(rule, hsl, center, grey);
    const w = 1 - grey;
    hsl = [nh, s + (ns - s) * w, l + (nl - l) * w];
  }
  // Règle commune (all) : toutes les couleurs, gris compris
  if (tint.all) hsl = applyRule(tint.all, hsl, center, grey);
  return toHex(...hsl);
}

// SVG recoloré par une teinte (les couleurs déjà vues sont gardées : un même dessin revient souvent)
const memo = new Map();
export function tintSvg(svg, tintId) {
  const tint = TINTS[tintId] || RARE_TINTS[tintId];
  if (!tint) return svg;
  if (!memo.has(tintId)) memo.set(tintId, new Map());
  const seen = memo.get(tintId);
  return svg.replace(/#[0-9A-Fa-f]{6}\b/g, m => {
    const key = m.toUpperCase();
    if (key === '#3C2819') return m; // le trait de la troupe garde sa couleur, quelle que soit la teinte
    if (!seen.has(key)) seen.set(key, recolor(tint, key));
    return seen.get(key);
  });
}

// Teinte portée par un skin de bâtiment : celle d'une teinte vendue (« sakura-foyer » : sakura), celle d'une pièce
// rare (son identifiant), ou null
export function tintOf(skin) {
  if (!skin) return null;
  if (RARE_TINTS[skin]) return skin;
  return TINT_IDS.find(t => skin.startsWith(`${t}-`)) || null;
}
