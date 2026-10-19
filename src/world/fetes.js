// Les fêtes de l'île : ce qui se célèbre sur l'île même, posé dans le monde et attaché à ce qu'on a touché (la fête
// suit la caméra, comme le décor). Quatre niveaux, du plus discret au plus ample :
// - Pétille, un petit geste (ramasser, nourrir, déplacer) : quelques étoiles qui scintillent, et ce qu'on gagne
//   (« +3 » et son icône) qui monte et s'efface ;
// - Éclat, un achat ou une trouvaille : une lueur, une gerbe d'étincelles, une onde au sol, et ce qu'on gagne ou son
//   nom ; l'Éclat d'une pose (une annexe, une création, un bâtiment posé ou déplacé : 'pose') suit l'objet qui tombe
//   à sa place (poseShape) : un cercle d'or marque où il va tomber, puis à l'impact la poussière roule, des éclats de
//   bois et de pierre rebondissent, l'écran tremble à peine ;
// - Fête, un bâtiment construit ou qui gagne un palier ; la Fête d'une découverte (un quartier acheté, un lieu
//   découvert : 'decouverte'), sans élévation et plus vive ;
// - Grand moment, le palier IV.
// Une Fête de bâtiment suit son élévation (RAISE_MS, view/draw/sites.js : drawSite) :
//   1. la lumière se rassemble au pied pendant que l'ancien état tremble dans la poussière ;
//   2. une lueur monte avec le bâtiment ;
//   3. au rebond (BURST_MS), l'éclat : un flash au sommet, une couronne d'étincelles, une onde au sol ;
//   4. des lucioles montent, et un mot doré s'élève au-dessus du bâtiment avec son nom et son palier.
// Le Grand moment en plus ample : la caméra s'y pose, l'île autour s'assombrit (un projecteur), une colonne de lumière,
// une pluie d'étoiles, et un ralenti d'un instant au sommet de l'éclat. Un toucher rend la main (le projecteur s'efface).
// Une découverte (un quartier, un lieu) a son propre geste (choix de l'auteur, 13 oct.) : la brume est aspirée vers le
// point (FIND_BURST_MS), puis elle s'ouvre en couronne et recule, l'écran tremble, l'anneau magique, les confettis et
// le mot à l'impact ; un lieu découvert tombe à sa place à cet instant (view/draw/sites.js : drawLandmark).
// Le chef d'orchestre (enqueue, tick) range les Fêtes : une seule Fête ou un seul Grand moment à la fois, les autres
// attendent leur tour ; Pétille et Éclat passent tout de suite (au plus MAX_SMALL à la fois). Tout se déduit du temps
// écoulé et d'une graine (rien à garder d'une image à l'autre). Mouvement réduit : le mot et ce qu'on gagne, immobiles.
import { lueur, etoile, anneau, fumee } from '@/utils/vfx';
import { roman } from '@/utils/roman';
import { hash } from './scene';
import { clamp, entre as smooth } from './maths';
import { TINT, font } from './charte';
import { FETE_WORDS as WORDS } from '@/texts/world/fetes';

// L'élévation d'un bâtiment (ms), et le moment de son rebond : l'éclat
export const RAISE_MS = 2400;
export const BURST_MS = RAISE_MS * 0.85;
// Durée de chaque niveau (ms)
export const DURATION = { fete: 4600, grand: 5600, decouverte: 3400 };
// L'éclat d'une découverte (ms) : l'anticipation est courte, il n'y a pas de bâtiment à élever
export const FIND_BURST_MS = 600;
// Le moment de l'éclat d'une fête, selon son niveau
export const burstOf = kind => (kind === 'decouverte' ? FIND_BURST_MS : BURST_MS);
// Le palier qui a son Grand moment
export const GRAND_LEVEL = 4;

const out = k => 1 - (1 - k) ** 3;

// Teintes, en canaux
const OR = '255,214,120', CLAIR = '255,248,226', MENTHE = '206,252,222', LAVANDE = '214,196,255';
// La lumière chaude de l'éclat d'un bâtiment, la poussière (son clair, son ombre)
const BRAISE = '255,190,96', POUSSIERE = '238,226,204', POUSSIERE_OMBRE = '190,166,128';
// La brume d'une découverte (son clair, son ombre)
const BRUME = '242,240,250', BRUME_OMBRE = '218,214,232';

/* ---------- Le chef d'orchestre ---------- */
// L'orchestre : { playing, waiting } ; une fête : { id, kind ('fete' | 'grand' | 'decouverte'), site, from, level, x, y, top, name,
// start } (x, y : le pied du bâtiment dans le monde ; top : sa hauteur)
export const orchestra = () => ({ playing: [], waiting: [] });
// Au plus MAX_WAITING fêtes attendent leur tour (dix paliers d'affilée feraient sinon une minute de fêtes)
export const MAX_WAITING = 3;
// Une fête de plus : elle commence tout de suite si rien d'autre ne joue, sinon elle attend son tour (celle qui
// attendait pour le même bâtiment lui laisse sa place ; la file pleine, la plus ancienne Fête s'efface, jamais un Grand
// moment) ; rend celles qui commencent maintenant
export function enqueue(o, fete, now) {
  if (o.playing.length || o.waiting.length) {
    if (fete.site) o.waiting = o.waiting.filter(f => f.site !== fete.site);
    o.waiting.push(fete);
    while (o.waiting.length > MAX_WAITING) {
      const i = o.waiting.findIndex(f => f.kind !== 'grand');
      o.waiting.splice(i < 0 ? 0 : i, 1);
    }
    return [];
  }
  const started = { ...fete, start: now };
  o.playing.push(started);
  return [started];
}
// À chaque image : les fêtes finies s'en vont, la suivante commence ; rend celles qui commencent maintenant (rien n'est
// recréé tant que rien ne finit)
const NONE = Object.freeze([]);
function anyOver(list, now, length) {
  for (let i = 0; i < list.length; i++) if (now - list[i].start >= length[list[i].kind]) return true;
  return false;
}
export function tick(o, now) {
  if (anyOver(o.playing, now, DURATION)) o.playing = o.playing.filter(f => now - f.start < DURATION[f.kind]);
  if (o.playing.length || !o.waiting.length) return NONE;
  const next = { ...o.waiting.shift(), start: now };
  o.playing.push(next);
  return [next];
}
// La fête d'un bâtiment qui gagne un palier : Grand moment au palier IV, Fête sinon
export const kindOf = level => (level === GRAND_LEVEL ? 'grand' : 'fete');
// Le mot de la fête (le même pour un bâtiment et un palier donnés), et la ligne en dessous
// (une Fête sans bâtiment donne sa ligne : line)
export function wordsOf(fete) {
  const list = (fete.kind === 'decouverte' && WORDS[fete.id.split(':')[0]]) || WORDS[fete.kind] || WORDS.fete;
  const seed = fete.line ? fete.id.length * 3.7 : fete.site.length * 7.1;
  const word = list[Math.floor(hash(seed, (fete.level || 1) * 3.3) * list.length)];
  return { word, line: fete.line || `${fete.name} · palier ${roman(fete.level)}`, note: fete.note || '' };
}

/* ---------- Le chantier vivant : l'élévation d'un bâtiment (choix de l'auteur, 13 oct.) ---------- */
// 1. Anticipation (jusqu'à RAISE_MS × 0,35) : un échafaudage de bois se monte autour de l'ancien bâtiment, qui tremble
//    et se tasse un peu ; des coups de marteau en étincelles ; la poussière roule en volutes.
// 2. Élévation (jusqu'à BURST_MS) : le nouveau bâtiment monte derrière un rideau de poussière (la coupe au ras du sol
//    ne se voit pas), étiré par l'élan, dépasse un peu et redescend.
// 3. Impact (BURST_MS) : il s'écrase et rebondit (SETTLE_MS), une onde de poussière file au sol, des éclats de bois et
//    de pierre volent et rebondissent, l'échafaudage tombe, l'écran tremble un instant (shakeOf).
// Tout se déduit du temps écoulé depuis le début (ms) et d'une graine.
export const SETTLE_MS = 560;
// La fin de l'élévation (le bâtiment est à sa place, immobile)
export const RAISE_END = BURST_MS + SETTLE_MS;
const ANTICIPATION_MS = RAISE_MS * 0.35;
// (sortie avec dépassement : 0 → 1, monte un peu au-delà vers les trois quarts, puis revient)
const backOut = (r, k = 1.5) => 1 + (k + 1) * (r - 1) ** 3 + k * (r - 1) ** 2;

// La forme du bâtiment à l'instant ms : { old (l'ancien état est montré), shake (px, de côté), lift (0 : posé ; 1 : tout
// sous terre ; négatif : au-dessus), sx, sy (son étirement, depuis son pied) }
export function raiseShape(ms) {
  if (ms < ANTICIPATION_MS) {
    const q = clamp(ms / ANTICIPATION_MS);
    const crouch = smooth(0.4, 1, q);
    return { old: true, shake: Math.sin(ms / 28) * 1.6 * (1 - q), lift: 0, sx: 1 + 0.035 * crouch, sy: 1 - 0.06 * crouch };
  }
  if (ms < BURST_MS) {
    const r = (ms - ANTICIPATION_MS) / (BURST_MS - ANTICIPATION_MS);
    const stretch = 0.08 * (1 - r) * smooth(0, 0.15, r);
    return { old: false, shake: 0, lift: 1 - backOut(r), sx: 1 - stretch * 0.6, sy: 1 + stretch };
  }
  const u = ms - BURST_MS;
  const spring = u < SETTLE_MS ? Math.exp(-u / 140) * Math.cos((u / 1000) * Math.PI * 2 * 3.4) : 0;
  return { old: false, shake: 0, lift: 0, sx: 1 + 0.065 * spring, sy: 1 - 0.09 * spring };
}
// La part de son ombre à l'instant ms (1 : celle du nouveau palier) ; was : celle de l'ancien état, rapportée au nouveau
export function shadowOf(ms, was = 0.35) {
  if (ms < ANTICIPATION_MS) return was;
  if (ms >= BURST_MS) return 1;
  const shape = raiseShape(ms);
  return Math.max(was * (1 - smooth(ANTICIPATION_MS, ANTICIPATION_MS + 300, ms)), clamp(1 - shape.lift, 0.15, 1.1));
}

// L'échafaudage autour d'une emprise (x, y : son centre au sol ; hw, hh : ses demi-diagonales ; top : la hauteur du
// bâtiment) : ses quatre perches (gauche, fond, droite, devant), plus hautes que lui, à trois étages de planches (le
// dernier, le plancher du haut)
export const scaffoldHeight = top => clamp(top * 1.12, 54, 180);
function scaffoldOf(x, y, hw, hh, top) {
  const H = scaffoldHeight(top);
  const L = [x - hw, y], B = [x, y - hh], R = [x + hw, y], F = [x, y + hh];
  return { H, L, B, R, F, levels: [0.34 * H, 0.67 * H, H] };
}
const BOIS = '#C9965E', BOIS_CLAIR = '#E8C08A', ENCRE = '#3C2819';
// Une pièce de bois de a à b (au trait de la troupe : contour d'encre, le bois, un reflet)
function beam(ctx, a, b, w) {
  ctx.lineCap = 'round';
  for (const [color, width, dy] of [[ENCRE, w + 1.8, 0], [BOIS, w, 0], [BOIS_CLAIR, w * 0.32, -w * 0.22]]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1] + dy);
    ctx.lineTo(b[0], b[1] + dy);
    ctx.stroke();
  }
}
// L'échafaudage à l'instant ms : layer 'back' (derrière le bâtiment : les perches de gauche, du fond, de droite et
// les planches du fond) ou 'front' (devant : la perche de devant, ses planches, une écharpe en travers). Il se monte
// pièce à pièce, tient pendant l'élévation, et tombe à l'impact (les pièces de devant glissent et basculent)
export function drawScaffold(ctx, x, y, hw, hh, top, ms, layer) {
  if (ms > BURST_MS + 520) return;
  const { H, L, B, R, F, levels } = scaffoldOf(x, y, hw, hh, top);
  const fall = clamp((ms - BURST_MS) / 520);
  const up = (a, h) => [a[0], a[1] - h];
  // (une pièce paraît à t, en grandissant pendant 240 ms)
  const grow = t => out(clamp((ms - t) / 240));
  ctx.save();
  ctx.globalAlpha *= 1 - fall * fall;
  if (layer === 'front' && fall > 0) {
    ctx.translate(0, 34 * fall * fall);
    ctx.translate(x, y + hh);
    ctx.rotate(0.22 * fall);
    ctx.translate(-x, -(y + hh));
  }
  const poles = layer === 'back' ? [[B, 60], [L, 150], [R, 240]] : [[F, 330]];
  for (const [p, t] of poles) {
    const k = grow(t);
    if (k > 0) beam(ctx, p, up(p, (H + 8) * k), 2.6);
  }
  const edges = layer === 'back' ? [[L, B], [B, R]] : [[L, F], [F, R]];
  // (une pièce de a, à la hauteur ha, vers b, à la hauteur hb, posée à t)
  const piece = (a, ha, b, hb, t, w) => {
    const k = grow(t);
    if (k <= 0) return;
    const a2 = up(a, ha), b2 = up(b, hb);
    beam(ctx, a2, [a2[0] + (b2[0] - a2[0]) * k, a2[1] + (b2[1] - a2[1]) * k], w);
  };
  // les écharpes en croix entre le sol et le premier étage, puis les planches de chaque étage
  edges.forEach(([a, b], e) => {
    piece(a, 0, b, levels[0], 380 + e * 60, 1.5);
    piece(b, 0, a, levels[0], 440 + e * 60, 1.5);
  });
  levels.forEach((h, j) => edges.forEach(([a, b], e) => piece(a, h, b, h, 480 + j * 130 + e * 60, j === 2 ? 2.4 : 2)));
  ctx.restore();
}

// La poussière du chantier à l'instant ms (sur le monde, avant la lumière de l'heure : elle s'assombrit la nuit) :
// les volutes autour de l'emprise, le rideau devant le pied pendant l'élévation, l'onde au sol à l'impact, et les
// éclats de bois et de pierre qui volent et rebondissent. amp : l'ampleur (Grand moment)
const bouffee = (ctx, px, py, r, a, clair = POUSSIERE, ombre = POUSSIERE_OMBRE) => {
  if (a <= 0.01 || r <= 0) return;
  ctx.globalAlpha = a * 0.7;
  ctx.drawImage(fumee(ombre), px - r, py - r * 0.75, r * 2, r * 2);
  ctx.globalAlpha = a;
  ctx.drawImage(fumee(clair), px - r * 0.9, py - r * 1.05, r * 1.8, r * 1.8);
};
export function drawBuildDust(ctx, x, y, hw, hh, ms, seed, amp = 1) {
  ctx.save();
  // les volutes qui roulent autour (jusqu'au rideau)
  const env = smooth(0, 220, ms) * (1 - smooth(1900, 2150, ms));
  if (env > 0) {
    for (let i = 0; i < 10; i++) {
      const p = ((ms + hash(i, seed + 20) * 900) % 900) / 900;
      const a = (i / 10) * Math.PI * 2 + hash(i, seed + 21);
      const d = 1.02 + 0.18 * p;
      bouffee(ctx, x + Math.cos(a) * hw * d, y + Math.sin(a) * hh * d - 18 * p, (8 + 12 * p) * amp, Math.sin(p * Math.PI) * 0.55 * env);
    }
  }
  // le rideau devant le pied : il cache la coupe au ras du sol pendant que le bâtiment monte
  const curtain = smooth(760, 900, ms) * (1 - smooth(1980, 2240, ms));
  if (curtain > 0) {
    for (let i = 0; i < 14; i++) {
      const u = i / 13;
      const px = x - hw + 2 * hw * u, py = y + hh * (1 - Math.abs(2 * u - 1)) + 2;
      const churn = Math.sin(ms / 140 + i * 1.7) * 3;
      bouffee(ctx, px + churn, py - 4, (13 + 7 * hash(i, seed + 22)) * amp, 0.8 * curtain);
    }
  }
  // l'onde de poussière qui file au sol à l'impact
  const k = (ms - BURST_MS) / 850;
  if (k >= 0 && k < 1) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + hash(i, seed + 23) * 0.3;
      const rr = (1 + 1.5 * out(k)) * (1 + 0.15 * hash(i, seed + 24));
      bouffee(ctx, x + Math.cos(a) * hw * rr, y + Math.sin(a) * hh * rr, (10 + 18 * out(k)) * amp, 0.75 * (1 - k) ** 1.2);
    }
  }
  // les éclats : de bois et de pierre, deux bonds, puis ils s'effacent
  drawChips(ctx, x, y, hw * 0.7, hh * 0.7, (ms - BURST_MS) / 1000, Math.round(12 * amp), seed, amp);
  ctx.restore();
}
// Des éclats de bois et de pierre lancés depuis le bord d'une ellipse au sol (x, y ; rx, ry), t s après l'impact : ils
// volent, rebondissent deux fois et s'effacent (au trait de la troupe). n : combien ; amp : la force du jet ; lift : sa
// hauteur
function drawChips(ctx, x, y, rx, ry, t, n, seed, amp = 1, lift = 1) {
  if (t < 0 || t >= 1.05) return;
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + hash(i, seed + 25) * 0.5;
    const v = (60 + 70 * hash(i, seed + 26)) * amp, up0 = (150 + 110 * hash(i, seed + 27)) * lift, g = 620;
    const t1 = (2 * up0) / g, up1 = up0 * 0.32, t2 = t1 + (2 * up1) / g;
    const tt = Math.min(t, t2);
    const h = tt < t1 ? up0 * tt - (g * tt * tt) / 2 : up1 * (tt - t1) - (g * (tt - t1) ** 2) / 2;
    const travel = v * (tt < t1 ? tt : t1 + (tt - t1) * 0.4);
    const px = x + Math.cos(a) * (rx + travel), py = y + Math.sin(a) * (ry + travel * 0.5) - h;
    const z = 1.6 + 1.8 * hash(i, seed + 28);
    ctx.globalAlpha = 1 - smooth(0.75, 1.05, t);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(tt * (6 + 8 * hash(i, seed + 29)) * (i % 2 ? 1 : -1));
    ctx.fillStyle = i % 3 ? BOIS : '#B7AFA2';
    ctx.strokeStyle = ENCRE;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    // (un copeau de bois, un éclat de pierre en triangle)
    if (i % 3) ctx.rect(-z * 1.2, -z * 0.45, z * 2.4, z * 0.9);
    else {
      ctx.moveTo(-z, z * 0.7);
      ctx.lineTo(z * 1.1, z * 0.5);
      ctx.lineTo(z * 0.1, -z);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
// La brume d'une découverte à l'instant now (sur le monde, avant la lumière de l'heure) : aspirée en tournant vers le
// point jusqu'à l'éclat, elle s'ouvre alors en couronne et recule
export function drawFindMist(ctx, fete, now) {
  const ms = now - fete.start;
  if (ms < 0 || ms > FIND_BURST_MS + 1100) return;
  const { x, y } = fete;
  const seed = fete.id.length * 13;
  ctx.save();
  if (ms < FIND_BURST_MS) {
    for (let i = 0; i < 12; i++) {
      const k = clamp((ms - hash(i, seed) * 180) / (FIND_BURST_MS - 180));
      if (k <= 0) continue;
      // (elle accélère en s'approchant, comme aspirée)
      const a = hash(i, seed + 1) * Math.PI * 2 + k * 1.8;
      const r = (100 + 50 * hash(i, seed + 2)) * (1 - k * k);
      bouffee(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.5 - 6, 9 + 11 * (1 - k), 0.8 * smooth(0, 0.25, k) * (1 - smooth(0.85, 1, k)), BRUME, BRUME_OMBRE);
    }
  }
  const k = (ms - FIND_BURST_MS) / 1100;
  if (k >= 0 && k < 1) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + hash(i, seed + 3) * 0.3;
      // (elle part d'un anneau, pas d'un disque : le centre se dégage tout de suite)
      const r = 34 + 140 * out(k) * (1 + 0.15 * hash(i, seed + 4));
      bouffee(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.5 - 8 * k, 12 + 20 * out(k), 0.7 * smooth(0, 0.08, k) * (1 - k) ** 1.3, BRUME, BRUME_OMBRE);
    }
  }
  ctx.restore();
}

// La secousse de l'écran (px) à l'impact d'une fête de bâtiment ou d'une découverte, ou d'une pose (sparks : les
// petits gestes, à peine : 1,6 px), la plus forte en cours : { x, y }
const SHAKE = { fete: 2.6, grand: 5, decouverte: 2.2 };
export function shakeOf(fetes, now, sparks = NONE) {
  let x = 0, y = 0, best = 0;
  const hit = (b, a0) => {
    if (b < 0 || b > 320) return;
    const a = a0 * Math.exp(-b / 90);
    if (a <= best) return;
    best = a;
    x = a * Math.sin(b * 0.11);
    y = a * Math.cos(b * 0.13) * 0.6;
  };
  for (const f of fetes) if (f.site || f.kind === 'decouverte') hit(now - f.start - burstOf(f.kind), SHAKE[f.kind]);
  for (const s of sparks) if (s.shake) hit(now - s.start - POSE_IMPACT_MS, 1.6);
  return { x, y };
}

/* ---------- Le dessin (dans le monde, caméra appliquée) ---------- */
// Le ralenti du Grand moment : le temps de l'éclat s'étire au sommet (0,35 × pendant 400 ms), puis reprend
function burstAge(ms, grand) {
  if (!grand || ms <= 0) return ms;
  return ms < 400 ? ms * 0.35 : 140 + (ms - 400);
}

// Le projecteur du Grand moment : l'île s'assombrit autour du bâtiment ; calm : le moment où un toucher l'a apaisé
export function spotlightOf(fete, now, calm = null) {
  if (!fete || fete.kind !== 'grand') return 0;
  const ms = now - fete.start;
  const k = smooth(0, 900, ms) * (1 - smooth(DURATION.grand - 800, DURATION.grand, ms));
  return calm && calm > fete.start ? k * (1 - smooth(calm, calm + 400, now)) : k;
}
export function drawSpotlight(ctx, fete, view, k) {
  if (k < 0.01) return;
  const cx = fete.x, cy = fete.y - fete.top * 0.5;
  const g = ctx.createRadialGradient(cx, cy, 90, cx, cy, 420);
  g.addColorStop(0, 'rgba(14,16,36,0)');
  g.addColorStop(1, `rgba(14,16,36,${(0.38 * k).toFixed(3)})`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.restore();
}

// La lumière d'une fête à l'instant now (après la lumière de l'heure : elle brille)
export function drawFete(ctx, fete, now) {
  const ms = now - fete.start;
  const grand = fete.kind === 'grand';
  const amp = grand ? 1.45 : 1;
  const { x, y, top } = fete;
  const crown = y - top;
  const seed = (fete.site || fete.id).length * 13 + (fete.level || 1);
  const burst = burstOf(fete.kind);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // 1. la lumière se rassemble au pied (des grains qui convergent en spirale ; plus vite pour une découverte)
  const gather = fete.site ? 1100 : burst;
  if (ms < gather) {
    const n = grand ? 22 : 14;
    for (let i = 0; i < n; i++) {
      const k = clamp((ms - hash(i, seed) * gather * 0.27) / (gather * 0.73));
      if (k <= 0 || k >= 1) continue;
      const a = hash(i, seed + 1) * Math.PI * 2 + k * 2.2;
      const r = (70 + 40 * hash(i, seed + 2)) * amp * (1 - out(k));
      ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9;
      const s = 6 + 4 * hash(i, seed + 3);
      ctx.drawImage(lueur(i % 3 ? OR : CLAIR), x + Math.cos(a) * r - s / 2, y + Math.sin(a) * r * 0.5 - s / 2, s, s);
    }
  }
  // 2. une lueur au pied, qui monte avec le bâtiment ; sans bâtiment, elle enfle au point jusqu'à l'éclat
  if (!fete.site && ms < burst + 200) {
    const k = smooth(0, burst, ms) * (1 - smooth(burst, burst + 200, ms));
    const r = 16 + 18 * k;
    ctx.globalAlpha = 0.5 * k;
    ctx.drawImage(lueur(OR), x - r, y - r * 0.7, r * 2, r * 1.4);
  } else if (fete.site && ms < BURST_MS + 300) {
    const k = smooth(300, 1000, ms) * (1 - smooth(BURST_MS, BURST_MS + 300, ms));
    const rise = smooth(RAISE_MS * 0.35, BURST_MS, ms);
    const r = 46 * amp;
    ctx.globalAlpha = 0.55 * k;
    ctx.drawImage(lueur(OR), x - r, y - top * rise - r * 0.6, r * 2, r * 1.2);
  }
  // colonne de lumière du Grand moment
  if (grand && ms > BURST_MS - 300 && ms < BURST_MS + 2200) {
    const k = smooth(BURST_MS - 300, BURST_MS, ms) * (1 - smooth(BURST_MS + 1200, BURST_MS + 2200, ms));
    // (assez légère pour qu'on voie le bâtiment à travers)
    const h = top + 260, w = 54;
    const g = ctx.createLinearGradient(0, y, 0, y - h);
    g.addColorStop(0, `rgba(${CLAIR},${(0.22 * k).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(${OR},${(0.14 * k).toFixed(3)})`);
    g.addColorStop(1, `rgba(${OR},0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y - h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // les coups de marteau sur l'échafaudage (un bâtiment qui s'élève) : une étincelle et ses éclats
  if (fete.site && fete.hw && ms < BURST_MS) {
    const H = scaffoldHeight(top);
    for (let i = 0; i < 9; i++) {
      const k = (ms - (150 + hash(i, seed + 30) * 1700)) / 180;
      if (k < 0 || k >= 1) continue;
      const u = hash(i, seed + 31), side = i % 2 ? 1 : -1;
      const px = x + side * fete.hw * (1 - u), py = y + fete.hh * u - H * [0.34, 0.67, 1][i % 3];
      const z = 10 * (1 - k * 0.6);
      ctx.globalAlpha = 1 - k;
      ctx.drawImage(etoile(BRAISE), px - z / 2, py - z / 2, z, z);
      ctx.strokeStyle = `rgba(${BRAISE},${(0.9 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const a = -Math.PI / 2 + (j - 1.5) * 0.7 + hash(i * 4 + j, seed + 32) * 0.3;
        ctx.moveTo(px + Math.cos(a) * 3, py + Math.sin(a) * 3);
        ctx.lineTo(px + Math.cos(a) * (3 + 9 * out(k)), py + Math.sin(a) * (3 + 9 * out(k)) + 6 * k * k);
      }
      ctx.stroke();
    }
  }
  // 3. l'éclat : un flash chaud au sommet, une couronne d'étincelles, un anneau d'or au sol (sans bâtiment : l'anneau
  // magique des fêtes)
  const b = burstAge(ms - burst, grand);
  if (b >= 0 && b < 1400) {
    if (b < 420) {
      // (une découverte : un éclair plus petit, posé au sol, jamais une tache blanche)
      const r = (40 + 56 * out(b / 420)) * amp * (fete.site ? 1 : 0.55);
      ctx.globalAlpha = 0.55 * (1 - b / 420);
      ctx.drawImage(lueur(BRAISE), x - r, crown - r, r * 2, r * 2);
      if (b < 260) {
        ctx.globalAlpha = 0.6 * (1 - b / 260);
        ctx.drawImage(lueur(CLAIR), x - r * 0.45, crown - r * 0.45, r * 0.9, r * 0.9);
      }
    }
    if (b < 800) {
      const k = b / 800;
      if (fete.site) {
        ctx.globalAlpha = 0.6 * (1 - k);
        ctx.lineWidth = 2.2 * (1 - k) + 0.5;
        ctx.strokeStyle = `rgb(${OR})`;
        ctx.beginPath();
        ctx.ellipse(x, y, (34 + 130 * out(k)) * amp, (17 + 65 * out(k)) * amp, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else anneau(ctx, x, y, (30 + 120 * out(k)) * amp, (15 + 60 * out(k)) * amp, 0.45 * (1 - k) ** 1.5, 2 * (1 - k) + 0.4, grand ? 10 : 8, now / 1000);
    }
    const n = grand ? 30 : 18;
    for (let i = 0; i < n; i++) {
      const life = 800 + hash(i, seed + 4) * 500;
      if (b > life) continue;
      const k = b / life;
      const a = (i / n) * Math.PI * 2 + hash(i, seed + 5) * 0.4;
      const v = (70 + 80 * hash(i, seed + 6)) * amp;
      const px = x + Math.cos(a) * v * out(k);
      const py = crown + Math.sin(a) * v * 0.6 * out(k) + 60 * k * k;
      const s = (5 + 7 * hash(i, seed + 7)) * (1 - k * 0.6);
      ctx.globalAlpha = 1 - k;
      ctx.drawImage(i % 4 ? lueur(i % 2 ? OR : CLAIR) : etoile(OR), px - s / 2, py - s / 2, s, s);
    }
  }
  // pluie d'étoiles du Grand moment
  if (grand && b >= 0 && b < 2600) {
    for (let i = 0; i < 28; i++) {
      const delay = hash(i, seed + 8) * 1200;
      const k = (b - delay) / 1400;
      if (k <= 0 || k >= 1) continue;
      const px = x + (hash(i, seed + 9) - 0.5) * 300;
      const py = crown - 160 + k * (200 + 80 * hash(i, seed + 10));
      const s = 7 + 6 * hash(i, seed + 11);
      ctx.globalAlpha = Math.sin(k * Math.PI) * (0.6 + 0.4 * Math.sin(now / 90 + i));
      ctx.drawImage(etoile(i % 2 ? OR : LAVANDE), px - s / 2, py - s / 2, s, s);
    }
  }
  // les confettis : du papier qui tourne, se retourne et danse en tombant (peint, pas lumineux)
  if (b >= 0 && b < 2800) drawConfetti(ctx, x, crown, b, grand, seed);
  // 4. des lucioles montent autour du bâtiment
  if (b >= 0) {
    const n = grand ? 16 : 10;
    for (let i = 0; i < n; i++) {
      const k = (b - hash(i, seed + 12) * 600) / 2200;
      if (k <= 0 || k >= 1) continue;
      const px = x + (hash(i, seed + 13) - 0.5) * 140 * amp + Math.sin(k * 6 + i) * 8;
      const py = y - 10 - k * (top + 70);
      const s = 5 + 4 * hash(i, seed + 14);
      ctx.globalAlpha = Math.sin(k * Math.PI) * 0.85;
      ctx.drawImage(lueur(i % 3 ? MENTHE : OR), px - s / 2, py - s / 2, s, s);
    }
  }
  ctx.restore();
}

// Les confettis d'une fête, b ms après l'éclat, lancés du sommet (x, crown) : une gerbe vers le haut, freinée par l'air,
// qui retombe en dansant ; chacun tourne et se retourne (sa face sombre quand il montre son dos)
const CONFETTIS = ['#F2C04B', '#E8735A', '#5FB8A6', '#6FA8DC', '#B79CE0', '#FFF1CC'];
const CONFETTIS_DOS = ['#C8902A', '#B9503B', '#3F8F80', '#4C83B8', '#8D73B8', '#E2CDA2'];
function drawConfetti(ctx, x, crown, b, grand, seed) {
  const n = grand ? 56 : 34, t = b / 1000, c = 2.4, g = 560;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < n; i++) {
    const life = 2 + 0.8 * hash(i, seed + 40);
    if (t > life) continue;
    const a = -Math.PI / 2 + (hash(i, seed + 41) - 0.5) * 1.9;
    const v = (240 + 220 * hash(i, seed + 42)) * (grand ? 1.25 : 1);
    const decay = (1 - Math.exp(-c * t)) / c;
    const px = x + (hash(i, seed + 47) - 0.5) * 16 + Math.cos(a) * v * decay + Math.sin(t * (5 + 3 * hash(i, seed + 43)) + i) * 9 * Math.min(1, t * 2);
    const py = crown - 10 + (Math.sin(a) * v + g / c) * decay - (g / c) * t;
    const flip = Math.cos(t * (9 + 7 * hash(i, seed + 44)) + i);
    const w = 5.5 + 2 * hash(i, seed + 45), h = w * 0.55;
    ctx.globalAlpha = 1 - smooth(life - 0.5, life, t);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(t * (4 + 5 * hash(i, seed + 46)) * (i % 2 ? 1 : -1) + i);
    ctx.scale(1, Math.max(0.12, Math.abs(flip)));
    ctx.fillStyle = (flip > 0 ? CONFETTIS : CONFETTIS_DOS)[i % CONFETTIS.length];
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.restore();
}

// Le mot de la fête au-dessus du bâtiment (après les noms et les bulles : rien ne le cache) : il entre en rebondissant,
// puis un ruban d'or se déroule sous lui, avec le nom et le palier (comme les rubans des bulles). still : mouvement
// réduit (le mot et son ruban, immobiles, tout le temps de la fête). k : 1 / le zoom (ils gardent leur taille à l'écran
// vu de loin) ; zoom : celui de la caméra (de près, ils grandissent avec l'île : un mot long se resserre d'autant)
const RUBAN = '#C8902A', RUBAN_CLAIR = '#E9B44C', RUBAN_ENCRE = '#FFF8E8';
// La largeur la plus grande du mot (px à l'écran)
const WORD_MAX = 280;
export function drawFeteWords(ctx, fete, now, k = 1, still = false, zoom = 1) {
  // (ce qu'un px du dessin vaut à l'écran)
  const screen = k * zoom;
  const ms = still ? DURATION[fete.kind] - 600 : now - fete.start;
  const from = burstOf(fete.kind) + 60, end = DURATION[fete.kind];
  if (!still && (ms < from || ms > end)) return;
  const u = ms - from;
  const shown = still ? 1 : smooth(0, 140, u) * (1 - smooth(end - 500, end, ms));
  // (un ressort : il jaillit, dépasse, se pose)
  const pop = still ? 1 : 1 - Math.exp(-u / 110) * Math.cos((u / 1000) * Math.PI * 2 * 2.6);
  const tilt = still ? 0 : Math.exp(-u / 220) * Math.sin(u / 60) * 0.06;
  const rise = still ? 0 : 18 * out(clamp(u / (end - from)));
  const unroll = still ? 1 : out(clamp((u - 160) / 360));
  const { word, line, note } = wordsOf(fete);
  const grand = fete.kind === 'grand';
  const x = fete.x, y = fete.y - fete.top - 40 * k - rise * k;
  ctx.save();
  ctx.globalAlpha = shown;
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  // le ruban, qui se déroule depuis son milieu
  ctx.font = font(800, grand ? 13 : 12);
  const half = (ctx.measureText(line).width + 34) / 2, rh = grand ? 21 : 19, ry = grand ? 26 : 23;
  if (unroll > 0) {
    const w = half * unroll, n = 8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-w - n, ry - rh / 2);
    ctx.lineTo(w + n, ry - rh / 2);
    ctx.lineTo(w, ry);
    ctx.lineTo(w + n, ry + rh / 2);
    ctx.lineTo(-w - n, ry + rh / 2);
    ctx.lineTo(-w, ry);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, ry - rh / 2, 0, ry + rh / 2);
    g.addColorStop(0, RUBAN_CLAIR);
    g.addColorStop(1, RUBAN);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = TINT.ink;
    ctx.stroke();
    ctx.clip();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(60,40,25,.55)';
    ctx.strokeText(line, 0, ry + 0.5);
    ctx.fillStyle = RUBAN_ENCRE;
    ctx.fillText(line, 0, ry + 0.5);
    ctx.restore();
  }
  // ce que la découverte change (note), à l'encre sous le ruban, une fois déroulé ; un texte long se resserre
  if (note && unroll > 0.6) {
    ctx.save();
    ctx.globalAlpha *= smooth(0.6, 1, unroll);
    ctx.font = font(800, 12);
    const fit = Math.min(1, WORD_MAX / (ctx.measureText(note).width * screen));
    ctx.translate(0, ry + rh / 2 + 12);
    ctx.scale(fit, fit);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,248,232,.92)';
    ctx.strokeText(note, 0, 0);
    ctx.fillStyle = TINT.ink;
    ctx.fillText(note, 0, 0);
    ctx.restore();
  }
  // le mot
  ctx.save();
  ctx.rotate(tilt);
  ctx.font = font(900, grand ? 28 : 24);
  // (un mot long se resserre : il tient sur un téléphone)
  const fit = Math.min(1, WORD_MAX / (ctx.measureText(word).width * screen));
  ctx.scale(pop * fit, pop * fit);
  ctx.lineWidth = 6;
  ctx.strokeStyle = TINT.ink;
  ctx.strokeText(word, 0, 0);
  const g = ctx.createLinearGradient(0, -13, 0, 13);
  g.addColorStop(0, TINT.gold100);
  g.addColorStop(1, TINT.gold400);
  ctx.fillStyle = g;
  ctx.fillText(word, 0, 0);
  ctx.restore();
  ctx.restore();
}

/* ---------- La pose : un objet qui tombe à sa place (choix de l'auteur, 13 oct.) ---------- */
// Une annexe, une création, un bâtiment posé ou déplacé, un article acheté, un lieu découvert : il apparaît un peu
// au-dessus de sa place, tombe en s'étirant, s'écrase à l'impact (POSE_IMPACT_MS), rebondit d'un petit saut et se pose
// sur un ressort. Sa forme se déduit du temps écoulé depuis la pose (ms).
export const POSE_IMPACT_MS = 170;
export const POSE_MS = 640;
// D'où il tombe (px du monde)
const POSE_DROP = 26;
// La forme de l'objet à l'instant ms : { lift (px au-dessus de sa place), sx, sy (son étirement, depuis son pied),
// alpha } ; null une fois posé. Avant la pose (ms < 0 : un lieu qui attend l'éclat de sa découverte), invisible
export function poseShape(ms) {
  if (ms >= POSE_MS) return null;
  if (ms < 0) return { lift: POSE_DROP, sx: 1, sy: 1, alpha: 0 };
  if (ms < POSE_IMPACT_MS) {
    const k = ms / POSE_IMPACT_MS;
    return { lift: POSE_DROP * (1 - k * k), sx: 1 - 0.06 * k, sy: 1 + 0.1 * k, alpha: smooth(0, 70, ms) };
  }
  // (l'écrasement puis le ressort ; le petit saut part pendant qu'il se détend)
  const u = ms - POSE_IMPACT_MS;
  const spring = Math.exp(-u / 120) * Math.cos((u / 1000) * Math.PI * 2 * 3);
  const hop = u > 40 && u < 220 ? 5 * Math.sin((Math.PI * (u - 40)) / 180) : 0;
  return { lift: hop, sx: 1 + 0.16 * spring, sy: 1 - 0.2 * spring, alpha: 1 };
}
// Applique la forme d'une pose à la toile, l'origine au pied de l'objet
export function applyPose(ctx, pose) {
  ctx.translate(0, -pose.lift);
  ctx.scale(pose.sx, pose.sy);
  ctx.globalAlpha *= pose.alpha;
}

/* ---------- Pétille et Éclat : les petits gestes ---------- */
// Leur durée (ms), et combien à la fois (au-delà, les plus anciennes s'en vont)
export const SMALL_MS = { petille: 1400, eclat: 1900, pose: 1600 };
// Une pose ne fait trembler l'écran qu'une fois par POSE_CALM ms (plusieurs poses d'affilée ne fatiguent pas)
const POSE_CALM = 1200;
export const MAX_SMALL = 12;
// Un petit geste de plus : { kind, x, y (le point touché dans le monde), top (au-dessus duquel monte ce qu'on gagne),
// hw, hh (une pose : les demi-diagonales de ce qui est posé), gains : [{ glyph, text }], start, seed, shake (une pose :
// l'écran tremble) } ; rend la liste à jour (sans celles qui ont fini)
export function addSmall(list, spark, now) {
  const live = list.filter(s => now - s.start < SMALL_MS[s.kind]);
  const shake = spark.kind === 'pose' && !live.some(s => s.shake && now - s.start < POSE_CALM);
  live.push({ top: 0, gains: [], ...spark, start: now, seed: Math.floor(now) % 997, shake });
  return live.slice(-MAX_SMALL);
}
// (la même liste tant qu'aucun ne finit : rien n'est recréé à chaque image)
export const smallNow = (list, now) => (anyOver(list, now, SMALL_MS) ? list.filter(s => now - s.start < SMALL_MS[s.kind]) : list);
// Ce qu'on gagne, à montrer : { stock (ressource → nombre), coins, glyphOf (ressource → icône) } → [{ glyph, text }]
export function gainsOf({ stock = {}, coins = 0, glyphOf = () => 'ui:spark' }) {
  const out = Object.entries(stock).filter(([, n]) => n > 0).map(([r, n]) => ({ glyph: glyphOf(r), text: `+${n}` }));
  if (coins > 0) out.push({ glyph: 'ui:coin', text: `+${coins}` });
  return out;
}

// La lumière d'un petit geste (après la lumière de l'heure) ; une pose : le cercle d'or qui se resserre où l'objet va
// tomber, puis l'éclat à l'impact
export function drawSmall(ctx, s, now) {
  // (une image datée d'avant le geste le montre à son tout début)
  const ms = Math.max(0, now - s.start);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if (s.kind === 'pose') {
    if (ms < POSE_IMPACT_MS) {
      const k = ms / POSE_IMPACT_MS;
      const rx = s.hw || POSE_RX, ry = s.hh || POSE_RY;
      // (il s'éteint juste avant l'impact : il ne passe pas devant l'objet posé)
      anneau(ctx, s.x, s.y, rx * (1.5 - 0.6 * k), ry * (1.5 - 0.6 * k), 0.7 * smooth(0, 0.3, k) * (1 - smooth(0.7, 1, k)), 1.6 + k, 6, now / 1000);
    } else drawEclat(ctx, s, ms - POSE_IMPACT_MS, now, false);
  } else if (s.kind === 'eclat') drawEclat(ctx, s, ms, now, true);
  else {
    for (let i = 0; i < 7; i++) {
      const k = (ms - hash(i, s.seed) * 300) / 700;
      if (k <= 0 || k >= 1) continue;
      const a = hash(i, s.seed + 1) * Math.PI * 2;
      const r = 8 + 16 * hash(i, s.seed + 2);
      const px = s.x + Math.cos(a) * r, py = s.y - 8 - Math.sin(a) * r * 0.6 - k * 14;
      const z = (5 + 4 * hash(i, s.seed + 3)) * Math.sin(k * Math.PI);
      ctx.globalAlpha = Math.sin(k * Math.PI);
      ctx.drawImage(etoile(i % 3 ? OR : MENTHE), px - z / 2, py - z / 2, z, z);
    }
  }
  ctx.restore();
}
// L'éclat, ms après son début : une lueur (flash ; pas pour une pose, sa poussière fait l'impact), une onde au sol,
// une gerbe d'étincelles
function drawEclat(ctx, s, ms, now, flash) {
  if (flash && ms < 420) {
    const r = 18 + 34 * out(ms / 420);
    ctx.globalAlpha = 0.6 * (1 - ms / 420);
    ctx.drawImage(lueur(CLAIR), s.x - r, s.y - s.top * 0.5 - r, r * 2, r * 2);
  }
  if (ms < 700) {
    const k = ms / 700;
    anneau(ctx, s.x, s.y, 14 + 60 * out(k), 7 + 30 * out(k), 0.65 * (1 - k), 2.4 * (1 - k) + 0.4, 5, now / 1000);
  }
  for (let i = 0; i < 12; i++) {
    const life = 650 + hash(i, s.seed) * 400;
    if (ms > life) continue;
    const k = ms / life;
    const a = (i / 12) * Math.PI * 2 + hash(i, s.seed + 1) * 0.5;
    const v = 34 + 34 * hash(i, s.seed + 2);
    const px = s.x + Math.cos(a) * v * out(k);
    const py = s.y - s.top * 0.5 + Math.sin(a) * v * 0.55 * out(k) + 30 * k * k;
    const z = (4 + 5 * hash(i, s.seed + 3)) * (1 - k * 0.5);
    ctx.globalAlpha = 1 - k;
    ctx.drawImage(i % 3 ? lueur(i % 2 ? OR : CLAIR) : etoile(OR), px - z / 2, py - z / 2, z, z);
  }
}
// Ce qu'une pose laisse au sol (sur le monde, avant la lumière de l'heure : la nuit l'assombrit) : l'ombre qui grandit
// sous l'objet qui tombe, puis à l'impact la poussière qui roule et les éclats qui rebondissent
const POSE_RX = 30, POSE_RY = 15;
export function drawPoseGround(ctx, s, now) {
  if (s.kind !== 'pose') return;
  const ms = now - s.start;
  if (ms < 0 || ms > SMALL_MS.pose) return;
  const rx = s.hw || POSE_RX, ry = s.hh || POSE_RY;
  ctx.save();
  // l'ombre de contact : elle se resserre et fonce à mesure que l'objet approche
  const shade = ms < POSE_IMPACT_MS ? smooth(0, POSE_IMPACT_MS, ms) : 1 - smooth(POSE_IMPACT_MS, POSE_IMPACT_MS + 260, ms);
  if (shade > 0.01) {
    ctx.globalAlpha = 0.22 * shade;
    ctx.fillStyle = ENCRE;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, rx * (0.95 - 0.25 * shade), ry * (0.95 - 0.25 * shade), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const u = ms - POSE_IMPACT_MS;
  // la poussière, chassée du pied
  const k = u / 700;
  if (k >= 0 && k < 1) {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + hash(i, s.seed + 5) * 0.4;
      const rr = 0.8 + 0.7 * out(k) * (1 + 0.2 * hash(i, s.seed + 6));
      bouffee(ctx, s.x + Math.cos(a) * rx * rr, s.y + Math.sin(a) * ry * rr - 5 * k, 6 + 10 * out(k), 0.7 * (1 - k) ** 1.3);
    }
  }
  drawChips(ctx, s.x, s.y, rx * 0.6, ry * 0.6, u / 1000, 6, s.seed, 0.55, 0.65);
  ctx.restore();
}

// Ce qu'on gagne, qui monte au-dessus du geste et s'efface (après les bulles : rien ne le cache) ; icon(ctx, glyph, x, y,
// taille, opacité) dessine l'icône ; k : 1 / le zoom ; still : mouvement réduit (immobile)
export function drawGains(ctx, s, now, icon, k = 1, still = false) {
  if (!s.gains.length) return;
  // (une pose : ce qu'on gagne monte à l'impact)
  const late = s.kind === 'pose' ? POSE_IMPACT_MS : 0;
  const ms = Math.max(0, now - s.start - late), end = SMALL_MS[s.kind] - late;
  const shown = still ? 1 : smooth(60, 220, ms) * (1 - smooth(end - 450, end, ms));
  if (shown <= 0.01) return;
  const rise = still ? 0 : 26 * out(clamp(ms / end));
  ctx.save();
  ctx.globalAlpha = shown;
  ctx.translate(s.x, s.y - s.top - 14 * k - rise * k);
  ctx.scale(k, k);
  ctx.font = font(900, 15);
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  // (les gains côte à côte, centrés : l'icône, puis son nombre)
  const widths = s.gains.map(g => (g.glyph ? 18 : 0) + ctx.measureText(g.text).width);
  let x = -(widths.reduce((a, b) => a + b, 0) + 8 * (widths.length - 1)) / 2;
  s.gains.forEach((g, i) => {
    if (g.glyph) icon(ctx, g.glyph, x + 7, 0, 15, shown);
    ctx.textAlign = 'left';
    ctx.lineWidth = 4;
    ctx.strokeStyle = TINT.ink;
    ctx.strokeText(g.text, x + (g.glyph ? 16 : 0), 0.5);
    ctx.fillStyle = TINT.gold100;
    ctx.fillText(g.text, x + (g.glyph ? 16 : 0), 0.5);
    x += widths[i] + 8;
  });
  ctx.restore();
}
