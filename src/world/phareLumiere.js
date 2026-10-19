// L'ombre et le reflet du phare des Anciens, selon le soleil, la lune et la lumière (choix de l'auteur, 15 oct. :
// « ombre et reflets dans l'océan, selon la position du soleil et la lumière »). Des fonctions pures du temps et de la
// lumière de l'île (lumiere/ombres.js : shadowLight ; lumiere/heureDoree.js : goldenOf ; l'éclat sur la mer de
// rivage.js : glitterOf, que l'appelant donne) :
// rien n'est gardé d'une image à l'autre, sauf le reflet teinté, caché par image et par teinte (quelques toiles).
// À brancher par la session ambiance (draw/loop.js), le phare posé sur l'Îlot aux Mouettes :
//   - l'ombre, au sol, avec celles des bâtiments : drawPhareOmbre(ctx, x, y, shadowLight(phase, date, orage)) ;
//   - le reflet, sur la mer, avant la terre (qui le cache où elle passe) : drawPhareReflet(ctx, img, x, y,
//     refletDuPhare(phase, glitterOf(phase, date), orage, wetnessAt(…)), t) ; img : l'image du calque
//     decor/ruines/phare_des_anciens_reflet_<n> ; t : le temps (s).
// (x, y) : l'ancre du phare dans le monde (le centre de l'îlot, au sol), en unités du monde.
import { shadowTint } from './lumiere/ombres';
import { goldenOf } from './lumiere/heureDoree';
import { clamp } from './maths';

// Le profil du phare (design/atelier/phare.mjs), en unités du monde : [hauteur, rayon] du pied au sommet du dôme
const Z0 = 34, Z1 = 330, R0 = 46, R1 = 28, ZL0 = Z1 + 12, ZL1 = ZL0 + 52, RD = R1 + 2;
const rAt = z => R1 + (R0 - R1) * Math.pow((Z1 - z) / (Z1 - Z0), 1.7);
export const PROFIL = [
  ...Array.from({ length: 13 }, (_, k) => { const z = Z0 + (Z1 - Z0) * (k / 12); return [z, rAt(z)]; }),
  [Z1 + 0.1, R1 + 13], [Z1 + 5, R1 + 13], [Z1 + 5.1, R1 + 0.5], [ZL0, R1 + 0.5], [ZL1, R1 - 1.5],
  ...Array.from({ length: 6 }, (_, k) => { const t = (k + 1) / 6; return [ZL1 + 30 * t, RD * Math.sqrt(Math.max(0, 1 - t * t))]; })
];
// (le socle de rochers : une ombre basse, large et ronde)
const SOCLE = [[0, 58], [Z0, 50]];
// (la loi de l'île : drawShadows porte une hauteur h le long de (dx, dy) × h ; elle prend 0,62 de la hauteur d'un
// bâtiment ; le phare est une tour fine, on garde toute sa hauteur)

// L'ombre portée du phare : un polygone (points du monde), la silhouette du profil projetée au sol le long de la
// lumière ; k : l'allongement (la pénombre : 0,8, 1, 1,22, comme drawShadows). null sans lumière
export function phareOmbre(light, x = 0, y = 0, k = 1) {
  if (!light || light.a <= 0.005) return null;
  const dx = light.dx * k, dy = light.dy * k, l = Math.hypot(dx, dy);
  if (l < 1e-4) return null;
  // la normale au sens de l'ombre, et le point d'une ellipse iso (rx = r, ry = r / 2) le plus loin dans ce sens
  const nx = -dy / l, ny = dx / l;
  const appui = (r, sx, sy) => { const rx = r, ry = r / 2, q = Math.hypot(rx * sx, ry * sy) || 1; return [(rx * rx * sx) / q, (ry * ry * sy) / q]; };
  const gauche = [], droite = [];
  for (const [z, r] of [...SOCLE, ...PROFIL]) {
    const cx = x + dx * z, cy = y + dy * z, [ax, ay] = appui(r, nx, ny);
    gauche.push([cx + ax, cy + ay]);
    droite.push([cx - ax, cy - ay]);
  }
  // le bout : le haut du dôme, arrondi dans le sens de l'ombre
  const [z, r] = PROFIL[PROFIL.length - 2], [bx, by] = appui(r, dx / l, dy / l);
  return [...gauche, [x + dx * z + bx, y + dy * z + by], ...droite.reverse()];
}

// L'ombre au sol, en trois passes de plus en plus longues et légères (la pénombre), teinte et force de l'île
export function drawPhareOmbre(ctx, x, y, light) {
  if (!light || light.a <= 0.005) return;
  const tint = shadowTint(light.golden || 0);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  for (const [k, w] of [[0.8, 0.5], [1, 0.32], [1.22, 0.18]]) {
    const poly = phareOmbre(light, x, y, k);
    if (!poly) continue;
    ctx.fillStyle = `rgba(${tint},${(light.a * w * 2.2).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
// Les couleurs du ciel que la mer renvoie
const JOUR = [118, 168, 208], COUCHANT = [255, 168, 112], LUNE = [150, 170, 232], NUIT = [40, 52, 92], ORAGE = [96, 108, 128];

// Le reflet du phare selon le ciel : { alpha (sa force), tint 'r,g,b' et tintA (la couleur du ciel posée dessus),
// eclat { cote (-1 : à gauche, 1 : à droite), force, color } (la lumière du soleil ou de la lune sur l'eau, du côté
// d'où elle vient) }. glitter : l'éclat du soleil ou de la lune sur la mer (rivage.js, glitterOf) ; orage : eclairAt ;
// wet : le mouillé de l'île (averse.js, wetnessAt), 0 à 1 : la pluie brise le reflet
export function refletDuPhare(phase, glitter, orage = null, wet = 0) {
  const { sun, weather, night } = phase;
  const pluie = Math.max(weather.rain || 0, wet * 0.6);
  const calme = (1 - 0.75 * pluie) * (1 - 0.35 * (weather.cover || 0));
  const golden = goldenOf(phase).k;
  let alpha, tint;
  if (sun.up > 0.02) {
    alpha = 0.78 * calme;
    tint = mix(mix(JOUR, ORAGE, weather.cover || 0), COUCHANT, golden);
  } else {
    const lune = night > 0.5 ? 0.35 + 0.65 * Math.min(1, (night - 0.5) * 2) : 0.3;
    alpha = 0.55 * calme * lune;
    tint = mix(NUIT, LUNE, clamp(lune - 0.2));
  }
  // l'éclair : le reflet s'éclaire d'un coup, froid
  if (orage && orage.flash > 0.08) { alpha = Math.min(0.95, alpha + 0.5 * orage.flash); tint = mix(tint, [226, 234, 255], Math.min(1, orage.flash)); }
  const g = glitter || { strength: 0, at: 0.5, color: '' };
  const cote = orage && orage.flash > 0.08 ? (orage.x < 0.5 ? -1 : 1) : g.at < 0.5 ? -1 : 1;
  return {
    alpha: +alpha.toFixed(3), tint: tint.join(','), tintA: +(0.18 + 0.32 * golden + 0.2 * night).toFixed(3),
    eclat: { cote, force: +(g.strength * calme).toFixed(3), color: g.color || '255,250,235' }
  };
}

// Le reflet teinté, caché par image et par teinte arrondie (une toile par couple : le ciel change lentement)
const toiles = new Map();
function teinte(img, tint, tintA) {
  const cle = `${img.src || ''}|${tint}|${Math.round(tintA * 20)}`;
  let c = toiles.get(cle);
  if (c) return c;
  if (toiles.size > 24) toiles.clear();
  c = document.createElement('canvas');
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = `rgba(${tint},${tintA})`;
  g.fillRect(0, 0, c.width, c.height);
  toiles.set(cle, c);
  return c;
}

// Le reflet sur la mer : le calque teinté du ciel, à sa force, à l'ancre du phare ; puis la lumière du soleil ou de la
// lune qui frise l'eau autour de lui, du côté d'où elle vient : de petits éclats couchés qui scintillent chacun à son
// rythme (t : le temps, en secondes), comme ceux de la mer (rivage.js). cadre : le cadre du calque (ruines.json, × 1,25
// de la bibliothèque) ; on le ramène au monde
export const CADRE_REFLET = [-137.5, 25, 275, 500];
const hash = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
export function eclatsDuReflet(r, t) {
  const out = [];
  if (!r || r.eclat.force < 0.04) return out;
  for (let i = 0; i < 26; i++) {
    const hx = hash(i, 1), hy = hash(i, 2);
    const x = r.eclat.cote * (8 + 70 * hx) - r.eclat.cote * 20, y = 46 + 300 * hy * hy;
    const tw = Math.sin(t * (2.2 + 3 * hash(i, 3)) + 40 * hash(i, 4));
    if (tw < 0.25) continue;
    const a = r.eclat.force * (tw - 0.25) * (1 - 0.7 * hy) * (1 - 0.6 * hx);
    out.push({ x, y, len: 4 + 9 * hash(i, 5) * (1 - 0.5 * hy), a: Math.min(0.9, a) });
  }
  return out;
}
export function drawPhareReflet(ctx, img, x, y, r, t = 0, cadre = CADRE_REFLET) {
  if (!img || !r || r.alpha < 0.02) return;
  const [cx, cy, cw, ch] = cadre.map(v => v / 1.25);
  ctx.save();
  ctx.globalAlpha = r.alpha;
  ctx.drawImage(teinte(img, r.tint, r.tintA), x + cx, y + cy, cw, ch);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.6;
  for (const e of eclatsDuReflet(r, t)) {
    ctx.strokeStyle = `rgba(${r.eclat.color},${e.a.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(x + e.x - e.len / 2, y + e.y);
    ctx.lineTo(x + e.x + e.len / 2, y + e.y);
    ctx.stroke();
  }
  ctx.restore();
}
