// Le Kraken : la clé du dernier palier du Ponton, la légende du large. Il vient rarement (choix de l'auteur, 15 oct.) :
// la nuit, une nuit sur deux environ, presque à coup sûr les nuits d'orage, à un moment tiré au sort sur l'horloge du
// jeu (le même pour tous), quelque part au large : l'océan est vaste, on le croise par hasard, et Lorena (ou Brume) ne
// le sent que si l'on est près de lui. Son passage est un trajet : il arrive, décrit un arc (le dos qui affleure, un
// sillage d'écume), surgit d'un coup (ses bras se dressent, l'œil s'ouvre, l'eau éclate en anneau, l'écran tremble si
// on le voit), puis replonge et repart. Pour
// tous, le présage (deux bras qui jaillissent) ; une fois le Kraken écrit au Grimoire, le spectacle (cinq bras, l'écume en
// spirale, l'œil deux fois ; la nuit, des lueurs le long des bras). Et dans l'orage, à la lueur d'un éclair sur trois
// environ, on entrevoit un de ses bras au large, qui replonge aussitôt. Il n'attaque jamais : il passe. Le Géant des
// profondeurs s'écarte quand il vient. Tout se déduit du temps.
import { TH, TW, SEA_Z, worldOf } from '../terrain';
import { hash } from '../scene';
import { nearestOpen } from '../sea';
import { along, ease } from '../flight';
import { coupOf, cycleOf as coupDuCycle } from '../lumiere/eclairs';
import { repere, poser } from './geant';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

export const KRAKEN_FOR = 80; // durée d'un passage (s)
// Un passage imposé, pour le voir (essais : ?kraken, avec ?heure=nuit) : il commence 4 s après l'arrivée sur l'île
export const KRAKEN_FORCE = typeof location !== 'undefined' && new URLSearchParams(location.search).has('kraken');
// La nuit d'un cycle de l'horloge du jeu (world/gameClock.js) : de la 70e à la 90e minute ; il vient une nuit sur deux
// environ, presque toujours les nuits d'orage
const NUIT = [70.5, 89.7];
const CHANCE = 0.45, CHANCE_ORAGE = 0.9;
export function krakenNuit(cycle, orage = false) {
  const vient = hash(cycle, 31) < (orage ? CHANCE_ORAGE : CHANCE);
  const debut = (NUIT[0] + hash(cycle, 37) * (NUIT[1] - NUIT[0] - KRAKEN_FOR / 60)) * 60000;
  return { vient, debut };
}

// Les temps d'un passage (fractions) : l'approche (le large, puis l'arc le long de la côte), le surgissement (il
// s'arrête et se dresse), le départ (il replonge et repart au large)
const SURGIT = 0.4, REPART = 0.7;
// L'œil ; les bras : [début, durée, hauteur (monde), angle, rayon (cases)]
const OEIL = { presage: [[0.47, 0.08]], ecrit: [[0.45, 0.07], [0.6, 0.06]] };
const BRAS = {
  presage: [[0.415, 0.24, 72, 0.9, 1.3], [0.44, 0.2, 56, 3.7, 1.2]],
  ecrit: [0, 1, 2, 3, 4].map(i => [0.41 + i * 0.025, 0.27, 110 + 60 * hash(i, 5), 0.5 + i * 1.257 + 0.3 * hash(i, 7), 1.5 + 0.6 * hash(i, 9)])
};

// Le trajet d'un passage, en cases (choix de l'auteur, 15 oct. : l'océan est vaste, il ne colle pas l'île ; on le
// croise par hasard) : un point du large où il surgit, tiré au sort pour la nuit (le même pour tous : la carte et
// l'horloge le sont), l'entrée et la sortie encore plus au large, et deux points d'arc. open : l'eau libre de l'île
// (sea.js), cycle : le n° de la nuit. null s'il n'y a pas d'eau libre
const LOIN = 18, ARC = 6, LARGE = 6;
export function krakenRoute(open, cycle) {
  const large = open.filter(o => o.d >= LARGE);
  const choix = large.length ? large : open;
  if (!choix.length) return null;
  const S = choix[Math.floor(hash(cycle, 47) * choix.length)];
  const a = hash(cycle, 41) * Math.PI * 2, b = a + Math.PI - 0.6 + 1.2 * hash(cycle, 43);
  const loin = ang => nearestOpen(choix, S.x + Math.cos(ang) * LOIN, S.y + Math.sin(ang) * LOIN, 0) || S;
  const E = loin(a), X = loin(b);
  const arc = (P, sens) => {
    const mx = (P.x + S.x) / 2, my = (P.y + S.y) / 2, l = Math.hypot(P.x - S.x, P.y - S.y) || 1;
    return nearestOpen(choix, mx - ((P.y - S.y) / l) * ARC * sens, my + ((P.x - S.x) / l) * ARC * sens, 0) || { x: mx, y: my };
  };
  return { pts: [E, arc(E, 1), S, arc(X, -1), X].map(p => ({ x: p.x, y: p.y })) };
}

// Où il en est de son trajet (0 à 1 : l'entrée, 0,5 : le point où il surgit, 1 : la sortie) à la fraction k du passage
const parcours = k => (k < SURGIT ? 0.5 * ease(k / SURGIT) : k < REPART ? 0.5 : 0.5 + 0.5 * ease((k - REPART) / (1 - REPART)));
const SILLAGE = 9, PAS = 0.006;

// Le Kraken à l'instant τ de son passage (route : krakenRoute ; ecrit : le joueur l'a écrit au Grimoire) : { x, y (son
// centre, en cases), dx, dy (sa direction), vis, haut (0 au fond, 1 près de la surface), dos (0 à 1 : le dos qui
// affleure en nageant), oeil (0 à 1), bras [{ x, y, e, h, cote, phase }], vague (0 à 1 : l'anneau d'eau quand il
// surgit, 0 sinon), secousse (0 à 1), sillage [{ x, y, a }] (où il est passé, le plus récent d'abord), ecrit, k }
export function krakenAt(route, τ, ecrit = false) {
  const k = τ / KRAKEN_FOR;
  const p = parcours(k);
  const { x, y } = along(route.pts, p);
  // (sa direction : la tangente du trajet ; arrêté, celle du point où il surgit)
  const q0 = along(route.pts, Math.max(0, p - 0.01)), q1 = along(route.pts, Math.min(1, p + 0.01));
  const l = Math.hypot(q1.x - q0.x, q1.y - q0.y) || 1;
  const dx = (q1.x - q0.x) / l, dy = (q1.y - q0.y) / l;
  const vis = smooth(k / 0.1) * smooth((1 - k) / 0.12);
  // (il remonte en approchant, jaillit d'un coup quand il surgit, puis redescend en repartant)
  const haut = k < SURGIT ? 0.3 + 0.35 * smooth(k / SURGIT) : k < REPART ? 0.65 + 0.35 * smooth((k - SURGIT) / 0.03) * smooth((REPART - k) / 0.08) : 0.65 - 0.4 * smooth((k - REPART) / 0.15);
  const nage = k < SURGIT || k > REPART;
  const dos = nage ? smooth((haut - 0.45) / 0.2) * vis : 0;
  let oeil = 0;
  for (const [a, d] of OEIL[ecrit ? 'ecrit' : 'presage']) {
    const u = (k - a) / d;
    // (il s'ouvre, reste, cligne, puis se ferme)
    if (u > 0 && u < 1) oeil = Math.max(oeil, smooth(u / 0.25) * smooth((1 - u) / 0.25) * (Math.abs(u - 0.55) < 0.04 ? 0.15 : 1));
  }
  const bras = BRAS[ecrit ? 'ecrit' : 'presage'].map(([a, d, h, angle, r], i) => {
    const u = (k - a) / d;
    // (il jaillit vite, puis se retire plus lentement)
    const e = u > 0 && u < 1 ? smooth(u / 0.12) * smooth((1 - u) / 0.3) : 0;
    // (il s'enroule vers l'extérieur, du côté où il sort à l'écran : deux bras voisins ne se croisent pas)
    const ecran = Math.cos(angle) - Math.sin(angle);
    return { x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r, e, h, cote: ecran < 0 ? -1 : 1, phase: i * 1.7 + 0.4 };
  });
  const v = (k - SURGIT) / 0.16;
  const vague = v > 0 && v < 1 ? v : 0;
  const secousse = Math.max(0, 1 - Math.abs(k - (SURGIT + 0.015)) / 0.03) * (ecrit ? 1 : 0.6);
  const sillage = [];
  if (nage) {
    for (let i = 1; i <= SILLAGE; i++) {
      const kb = k - i * PAS * (KRAKEN_FOR / 80);
      if (kb < 0 || (kb > SURGIT && kb < REPART)) break;
      sillage.push({ ...along(route.pts, parcours(kb)), a: (1 - i / (SILLAGE + 1)) * dos });
    }
  }
  return { x, y, dx, dy, vis, haut, dos, oeil: oeil * vis, bras, vague, secousse: secousse * vis, sillage, ecrit, k };
}

// À la lueur d'un éclair (lumiere/eclairs.js : un coup de foudre sur trois environ, pas les éclairs de chaleur), on
// entrevoit un de ses bras au large : il jaillit avec le flash et replonge aussitôt. t : le temps de l'orage (s) ;
// { coup (le n° du coup), x (0 à 1 : le côté du flash à l'écran), e (0 à 1 : hors de l'eau), h, phase }, ou null
const APERCU_FOR = 2.2;
export function apercuAt(t, storm) {
  if (storm < 0.5) return null;
  const coup = coupDuCycle(t), c = coupOf(coup);
  if (c.lointain || hash(coup, 61) > 0.35) return null;
  const u = (t - c.start) / APERCU_FOR;
  if (u < 0 || u >= 1) return null;
  return { coup, x: c.x, e: smooth(u / 0.08) * smooth((1 - u) / 0.55), h: 70 + 40 * hash(coup, 63), phase: hash(coup, 65) * 6 };
}

// Son ombre, composée sur un petit calque (demi-résolution, dans son repère : le manteau vers l'arrière, huit bras qui
// rayonnent de la tête et ondulent), d'un seul ton, aux bords adoucis
const LW = 960, LH = 960;
let calque = null;
function ombre(t, ton) {
  if (!calque) { calque = document.createElement('canvas'); calque.width = LW / 2; calque.height = LH / 2; }
  const g = calque.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, calque.width, calque.height);
  g.setTransform(0.5, 0, 0, 0.5, LW / 4, LH / 4);
  g.fillStyle = ton;
  g.strokeStyle = ton;
  g.shadowColor = ton;
  g.shadowBlur = 12;
  g.lineCap = 'round';
  // les bras, épais à la tête, fins au bout, qui ondulent
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI * 2 + 0.2 * Math.sin(t * 0.5 + i);
    const len = 300 + 90 * hash(i, 3);
    let px = 0, py = 0, a = a0;
    for (let j = 0; j < 14; j++) {
      const s = j / 14;
      a += 0.12 * Math.sin(t * 1.1 + i * 2 + s * 5);
      const nx = px + Math.cos(a) * (len / 14), ny = py + Math.sin(a) * (len / 14);
      g.lineWidth = 46 * (1 - s) + 6;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(nx, ny);
      g.stroke();
      px = nx;
      py = ny;
    }
  }
  // la tête et le manteau, vers l'arrière (−x)
  g.beginPath();
  g.ellipse(-150, 0, 210, 108, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(0, 0, 90, 90, 0, 0, Math.PI * 2);
  g.fill();
  return calque;
}

// Où on le touche (il entre au Bestiaire), tant qu'on le voit bien : sa tête (dans le monde), ou null
export function toucherKraken(kr) {
  if (kr.vis < 0.3) return null;
  const c = worldOf(kr.x, kr.y, SEA_Z);
  return { x: c.x, y: c.y, r: 120 };
}
// Son portrait (le Bestiaire) : son ombre vue de dessus, huit bras qui rayonnent, d'un violet de grand fond, en adresse
// d'image (tirée une fois)
let portrait = null;
export function portraitKraken() {
  if (!portrait) portrait = ombre(0, '#3B2A4A').toDataURL();
  return portrait;
}

// Sous la mer (dans le monde, avec la mer : la terre le cache) : son ombre, l'eau qui s'assombrit, les bulles, l'œil à
// fleur d'eau, l'écume qui tourne au-dessus de lui et les remous au pied des bras. night : la nuit (0 à 1)
export function drawKraken(ctx, kr, t, night) {
  if (!kr || kr.vis < 0.01) return;
  const r = repere(kr);
  ctx.save();
  poser(ctx, r);
  // (pâle et lointaine pour le présage, plus sombre pour le spectacle)
  ctx.globalAlpha = (kr.ecrit ? 0.12 + 0.26 * kr.haut : 0.1 + 0.22 * kr.haut) * kr.vis;
  ctx.drawImage(ombre(t, night > 0.5 ? 'rgb(8,6,22)' : 'rgb(20,22,52)'), -LW / 2, -LH / 2, LW, LH);
  ctx.globalAlpha = 1;
  // les bulles qui montent de lui et crèvent en surface, par grappes
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 26; i++) {
    const u = (t / (1.8 + hash(i, 71)) + hash(i, 73)) % 1;
    const grappe = Math.floor(hash(i, 74) * 5);
    const ax = Math.cos(grappe * 1.9) * 160 + (hash(i, 75) - 0.5) * 70, ay = Math.sin(grappe * 1.9) * 130 + (hash(i, 77) - 0.5) * 70;
    const a = kr.vis * (0.3 + 0.7 * kr.haut) * (u < 0.8 ? u / 0.8 : 1 - (u - 0.8) / 0.2);
    if (a < 0.03) continue;
    const rr = u < 0.8 ? 3 + 3 * hash(i, 79) : 3 + 16 * (u - 0.8) / 0.2;
    ctx.strokeStyle = `rgba(235,245,255,${(0.6 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(ax, ay, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  // l'écume qui tourne en spirale au-dessus de lui (le spectacle) : des traînées d'écume inégales, qui s'étirent
  if (kr.ecrit) {
    const tour = smooth((kr.k - 0.15) / 0.15) * smooth((0.85 - kr.k) / 0.15) * kr.vis;
    if (tour > 0.02) {
      ctx.lineCap = 'round';
      for (let i = 0; i < 34; i++) {
        const j0 = hash(i, 51) * 70, long = 3 + 6 * hash(i, 53);
        const a0 = j0 * 0.16 + t * 0.6;
        ctx.strokeStyle = `rgba(255,255,255,${(tour * (0.18 + 0.4 * hash(i, 55))).toFixed(3)})`;
        ctx.lineWidth = 2 + 4 * hash(i, 57);
        ctx.beginPath();
        for (let j = 0; j <= long; j++) {
          const aa = a0 + j * 0.16, rr = 30 + (j0 + j) * 3.2 + 6 * Math.sin(t * 0.8 + i);
          if (j) ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); else ctx.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
        }
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  // le sillage : l'écume qu'il laisse derrière lui en nageant, qui s'élargit et s'efface
  ctx.lineWidth = 1.6;
  kr.sillage.forEach((p, i) => {
    const c = worldOf(p.x, p.y, SEA_Z), w = 16 + i * 5;
    ctx.strokeStyle = `rgba(255,255,255,${(0.5 * p.a * kr.vis).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, w, w * (TH / TW), 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  // le dos qui affleure en nageant : une échine sombre et mouillée, l'eau qui s'ouvre autour
  if (kr.dos > 0.03) {
    const c = worldOf(kr.x - kr.dx * 0.6, kr.y - kr.dy * 0.6, SEA_Z);
    const ang = Math.atan2(((kr.dx + kr.dy) * TH) / 2, ((kr.dx - kr.dy) * TW) / 2);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(ang);
    ctx.globalAlpha = kr.dos;
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath();
    ctx.ellipse(0, 3, 46, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    const peau = ctx.createLinearGradient(0, -12, 0, 6);
    peau.addColorStop(0, '#5A3E68');
    peau.addColorStop(1, '#1C1226');
    ctx.fillStyle = peau;
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 9 + 3 * Math.sin(t * 1.3), 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(214,232,248,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(-4, -1, 26, 6, 0, Math.PI * 1.15, Math.PI * 1.7);
    ctx.stroke();
    ctx.restore();
  }
  // l'anneau d'eau quand il surgit : deux vagues qui s'ouvrent, et des gerbes d'eau
  if (kr.vague > 0) {
    const c = worldOf(kr.x, kr.y, SEA_Z);
    for (const lag of [0, 0.18]) {
      const v = kr.vague - lag;
      if (v <= 0) continue;
      const r = 30 + 230 * v;
      ctx.strokeStyle = `rgba(255,255,255,${(0.75 * (1 - v)).toFixed(3)})`;
      ctx.lineWidth = 3 * (1 - v) + 1;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, r, r * (TH / TW), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(236,246,255,0.85)';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + hash(i, 81), v = kr.vague;
      const rr = (40 + 80 * hash(i, 83)) * v, haut = 70 * hash(i, 85) * Math.sin(Math.min(1, v * 1.6) * Math.PI);
      if (haut < 1) continue;
      ctx.globalAlpha = 1 - v;
      ctx.beginPath();
      ctx.ellipse(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr * (TH / TW) - haut, 2.4, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // l'œil, à fleur d'eau (devant sa tête) : une amande d'ambre, la pupille fendue, des ronds autour
  if (kr.oeil > 0.02) {
    const e = worldOf(kr.x + kr.dx * 0.5, kr.y + kr.dy * 0.5, SEA_Z);
    drawOeil(ctx, e.x, e.y, kr.oeil, t);
  }
  // les remous au pied des bras
  for (const b of kr.bras) {
    if (b.e < 0.02) continue;
    const c = worldOf(b.x, b.y, SEA_Z), w = largeur(b.h);
    for (const lag of [0, 0.33, 0.66]) {
      const q = (t * 0.8 + lag + b.phase) % 1;
      ctx.strokeStyle = `rgba(255,255,255,${(0.55 * (1 - q) * b.e).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, w * (1 + q * 2.4), w * (1 + q * 2.4) * (TH / TW), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,255,255,${(0.5 * b.e).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, w * 1.2, w * 1.2 * (TH / TW), 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOeil(ctx, x, y, o, t) {
  const w = 24, h = 11 * o;
  ctx.save();
  // le remous autour
  ctx.strokeStyle = `rgba(255,255,255,${(0.45 * o).toFixed(3)})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(x, y, w * 1.5, w * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  // l'amande
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x, y - h * 1.6, x + w, y);
  ctx.quadraticCurveTo(x, y + h * 1.6, x - w, y);
  ctx.closePath();
  const iris = ctx.createRadialGradient(x, y, 0, x, y, w);
  iris.addColorStop(0, '#FFE69A');
  iris.addColorStop(0.45, '#E8A030');
  iris.addColorStop(1, '#7A3C10');
  ctx.fillStyle = iris;
  ctx.fill();
  ctx.strokeStyle = 'rgba(20,10,24,0.9)';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  // la pupille fendue, qui se resserre
  ctx.fillStyle = '#120A16';
  ctx.beginPath();
  ctx.ellipse(x + Math.sin(t * 0.7) * 2, y, 2.4 + 1.2 * Math.sin(t * 1.3), h * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
  // le reflet
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(x - w * 0.35, y - h * 0.45, 2.6, 1.4 * o, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const largeur = h => 5 + 15 * (h / 120);

// Ses bras, du plus lointain au plus proche (celui de devant passe devant celui de derrière)
export const brasDuFond = kr => [...kr.bras].sort((a, b) => a.x + a.y - (b.x + b.y));

// Un bras hors de l'eau : son épine (points dans le monde), de la surface à la pointe ; il se dresse, ondule, s'enroule
// au bout (cote : de quel côté)
function epine(b, t) {
  const c = worldOf(b.x, b.y, SEA_Z);
  const L = b.h * b.e, N = 22, pts = [{ x: c.x, y: c.y, a: -Math.PI / 2 }];
  let a = -Math.PI / 2 + b.cote * 0.18 + 0.12 * Math.sin(t * 0.7 + b.phase);
  for (let j = 1; j <= N; j++) {
    const s = j / N;
    a += b.cote * (0.05 + 0.5 * s ** 3 * (0.4 + 0.6 * b.e)) + 0.06 * Math.sin(t * 1.6 + b.phase - s * 4);
    const p = pts[j - 1];
    pts.push({ x: p.x + Math.cos(a) * (L / N), y: p.y + Math.sin(a) * (L / N), a });
  }
  return pts;
}

// Les bras hors de l'eau (dans le monde, après le sol et ce qui s'y tient : en eau libre, rien ne se dresse devant eux ;
// la carte de lumière passe ensuite) : un corps violet sombre, le ventre plus clair, les ventouses, un reflet mouillé, et
// l'eau qui ruisselle et retombe en gouttes
export function drawBras(ctx, kr, t) {
  if (!kr || kr.vis < 0.01) return;
  for (const b of brasDuFond(kr)) {
    if (b.e < 0.03) continue;
    const pts = epine(b, t), W = largeur(b.h);
    const n = p => ({ x: -Math.sin(p.a), y: Math.cos(p.a) });
    const bord = (sens, k) => pts.map((p, j) => { const w = W * (1 - 0.88 * (j / (pts.length - 1))) * k; const q = n(p); return { x: p.x + q.x * w * sens, y: p.y + q.y * w * sens }; });
    const g = pts[0], h = pts[pts.length - 1];
    const corps = ctx.createLinearGradient(g.x, g.y, h.x, h.y);
    corps.addColorStop(0, '#22182E');
    corps.addColorStop(0.6, '#4A3358');
    corps.addColorStop(1, '#6E4C70');
    ctx.save();
    ctx.globalAlpha = Math.min(1, b.e * 1.4) * kr.vis;
    const forme = [...bord(1, 0.5), ...bord(-1, 0.5).reverse()];
    ctx.beginPath();
    forme.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = corps;
    ctx.fill();
    ctx.strokeStyle = '#140C1C';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // le ventre, plus clair, du côté où il s'enroule
    const ventre = [...bord(b.cote, 0.48), ...bord(b.cote, 0.12).reverse()];
    ctx.beginPath();
    ventre.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = 'rgba(176,128,150,0.75)';
    ctx.fill();
    // les ventouses
    ctx.fillStyle = '#EBD0DA';
    ctx.strokeStyle = 'rgba(40,20,40,0.7)';
    ctx.lineWidth = 0.6;
    for (let j = 2; j < pts.length - 3; j += 2) {
      const p = pts[j], q = n(p), w = W * (1 - 0.88 * (j / (pts.length - 1)));
      ctx.beginPath();
      ctx.ellipse(p.x + q.x * w * 0.3 * b.cote, p.y + q.y * w * 0.3 * b.cote, Math.max(0.6, w * 0.16), Math.max(0.5, w * 0.12), p.a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // le reflet mouillé, du côté de la lumière
    ctx.strokeStyle = 'rgba(214,232,248,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    bord(-b.cote, 0.36).forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
    // l'eau qui ruisselle : des gouttes qui se détachent et tombent dans la mer
    ctx.fillStyle = 'rgba(232,244,255,0.85)';
    for (let i = 0; i < 9; i++) {
      const u = (t / (0.9 + 0.5 * hash(i, b.phase * 10)) + hash(i, 13)) % 1;
      const j = 2 + Math.floor(hash(i, 17 + Math.floor(t)) * (pts.length - 4));
      const p = pts[j];
      const y = p.y + u * u * (g.y - p.y + 4);
      if (y > g.y + 2) continue;
      ctx.globalAlpha = (1 - u * 0.6) * b.e * kr.vis;
      ctx.beginPath();
      ctx.ellipse(p.x + (hash(i, 19) - 0.5) * 3, y, 1, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// La nuit (après la carte de lumière, qui les éteindrait ; en 'lighter') : l'œil qui luit, et des lueurs qui courent le
// long des bras, de la surface à la pointe
export function drawLueursKraken(ctx, kr, t, night) {
  if (!kr || kr.vis < 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if (kr.oeil > 0.02) {
    const e = worldOf(kr.x + kr.dx * 0.5, kr.y + kr.dy * 0.5, SEA_Z);
    const a = kr.oeil * (0.35 + 0.65 * night);
    const lum = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 60);
    lum.addColorStop(0, `rgba(255,190,90,${(0.55 * a).toFixed(3)})`);
    lum.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = lum;
    ctx.fillRect(e.x - 60, e.y - 60, 120, 120);
  }
  if (night > 0.2) {
    for (const b of kr.bras) {
      if (b.e < 0.05) continue;
      const pts = epine(b, t), W = largeur(b.h);
      for (let j = 3; j < pts.length; j++) {
        const s = j / (pts.length - 1);
        const a = (0.5 + 0.5 * Math.sin(t * 3 - s * 9 + b.phase)) ** 2 * night * b.e * kr.vis;
        if (a < 0.04) continue;
        // (sur le flanc, de petites lueurs qui courent, pas une nappe)
        const p = pts[j], q = { x: -Math.sin(p.a), y: Math.cos(p.a) }, w = W * (1 - 0.88 * s);
        const x = p.x - q.x * w * 0.25 * b.cote, y = p.y - q.y * w * 0.25 * b.cote, rr = 1.5 + w * 0.22;
        const lum = ctx.createRadialGradient(x, y, 0, x, y, rr * 2);
        lum.addColorStop(0, `rgba(150,250,232,${(0.6 * a).toFixed(3)})`);
        lum.addColorStop(1, 'rgba(150,250,232,0)');
        ctx.fillStyle = lum;
        ctx.fillRect(x - rr * 2, y - rr * 2, rr * 4, rr * 4);
      }
    }
  }
  ctx.restore();
}

// Le bras entrevu dans l'éclair (apercuAt), dressé à la case at ({ x, y }, en eau libre) : le même bras, seul, et le
// remous à son pied ; la carte de lumière le noie dans la nuit, le flash le révèle
export function drawApercu(ctx, ap, at, t) {
  if (!ap || !at || ap.e < 0.02) return;
  const b = { x: at.x, y: at.y, e: ap.e, h: ap.h, cote: ap.x < 0.5 ? 1 : -1, phase: ap.phase };
  const c = worldOf(at.x, at.y, SEA_Z), w = largeur(b.h);
  ctx.strokeStyle = `rgba(255,255,255,${(0.5 * ap.e).toFixed(3)})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, w * 2.2, w * 2.2 * (TH / TW), 0, 0, Math.PI * 2);
  ctx.stroke();
  drawBras(ctx, { vis: 1, bras: [b] }, t);
}
