// Brume, l'esprit de la brume (quêtes de l'île) : un feu follet, une petite flamme bleutée qui vacille, avec deux
// yeux et rien d'autre ; dorée, avec une pastille « ! », quand la récompense attend. Il flotte près de l'objectif de la
// quête active, et change avec les actes (huit stades : STAGES). Unités du monde, en fonction du temps : rien à garder,
// rien à nettoyer. Le même feu follet en SVG (fiches, Livre) : components/Guide/BrumeWisp/BrumeWisp.vue, mêmes couleurs.

// Hauteur de vol au-dessus du sol (unités du monde) et rayon de toucher
export const BRUME_ALT = 46;
export const BRUME_REACH = 24;

// Couleurs du feu follet : cœur, flamme, bord, halo ; au repos (bleuté) et récompense prête (doré)
export const WISP = {
  calm: { core: '#FFFFFF', flame: '#BFF0FF', edge: '#5CC8F0', halo: '120,210,255' },
  ready: { core: '#FFFDF2', flame: '#FFE7A3', edge: '#F2B23B', halo: '255,200,90' },
  eye: '#1D3557'
};

// Les huit stades de Brume (HISTOIRE.md, § 13 : game/opus.js) : sa couleur à chaque acte. 0 pâle et tremblante, 1 bleu
// clair, 2 turquoise, 3 argentée et étoilée, 4 la feuille, 5 ambrée, 6 les runes, 7 dorée ; pâlie (acte VI, après la
// rune) ; l'éclat du Phénix
export const STAGES = [
  { core: '#FFFFFF', flame: '#E4EEF3', edge: '#A9C4D2', halo: '190,215,230' },
  WISP.calm,
  { core: '#FFFFFF', flame: '#B8F4EA', edge: '#2EC4AE', halo: '90,220,200' },
  { core: '#FFFFFF', flame: '#E6EEFF', edge: '#8FA8EE', halo: '200,212,255' },
  { core: '#FFFFFF', flame: '#E2F6E0', edge: '#72C29A', halo: '170,230,190' },
  { core: '#FFFDF2', flame: '#FFE3AE', edge: '#E8A04A', halo: '255,195,120' },
  { core: '#FFFDF2', flame: '#FFE9BE', edge: '#D88E4A', halo: '250,200,140' },
  { core: '#FFFDF2', flame: '#FFEFA6', edge: '#F2B23B', halo: '255,210,110' }
];
const PALE = { core: '#F4F7F9', flame: '#DCE4EA', edge: '#AEBCC6', halo: '200,210,220' };
const PHENIX = { core: '#FFFFFF', flame: '#FFF0C8', edge: '#FF8A3C', halo: '255,170,90' };
export const toneOf = (look = {}) => (look.burst ? PHENIX : look.pale ? PALE : STAGES[look.stage ?? 1] || WISP.calm);

// Ce qui s'ajoute à chaque stade, autour de la flamme (r : son rayon, k : échelle) : étoiles (3+), feuille (4+), cœur
// ambré (5+), runes (6+), couronne (7), rayons du soleil du phare
function adornments(ctx, x, y, r, k, t, look) {
  const stage = look.stage ?? 1;
  if (look.sun) {
    ctx.strokeStyle = 'rgba(255,214,110,.85)';
    ctx.lineWidth = 1.2 * k;
    for (let i = 0; i < 8; i++) {
      const a = t * 0.4 + (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r * 1.7, y - r * 0.5 + Math.sin(a) * r * 1.7);
      ctx.lineTo(x + Math.cos(a) * r * 2.3, y - r * 0.5 + Math.sin(a) * r * 2.3);
      ctx.stroke();
    }
  }
  if (stage >= 3) {
    // Trois étoiles qui tournent autour d'elle
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    for (let i = 0; i < 3; i++) {
      const a = t * 0.8 + i * 2.1;
      const sx = x + Math.cos(a) * r * 1.9, sy = y - r * 0.6 + Math.sin(a) * r * 0.7;
      const s = (1.5 + 0.4 * Math.sin(t * 3 + i)) * k;
      ctx.beginPath();
      ctx.moveTo(sx, sy - s * 1.6);
      ctx.lineTo(sx + s * 0.45, sy - s * 0.45);
      ctx.lineTo(sx + s * 1.6, sy);
      ctx.lineTo(sx + s * 0.45, sy + s * 0.45);
      ctx.lineTo(sx, sy + s * 1.6);
      ctx.lineTo(sx - s * 0.45, sy + s * 0.45);
      ctx.lineTo(sx - s * 1.6, sy);
      ctx.lineTo(sx - s * 0.45, sy - s * 0.45);
      ctx.closePath();
      ctx.fill();
    }
  }
  if (stage >= 4) {
    // Une feuille qui danse dans la flamme
    ctx.save();
    ctx.translate(x + Math.sin(t * 1.3) * r * 0.25, y - r * 0.95);
    ctx.rotate(Math.sin(t * 1.7) * 0.5 - 0.4);
    ctx.fillStyle = '#5FAE5A';
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.1 * k, 2.2 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (stage >= 5) {
    // Un cœur ambré qui bat
    const b = (1.5 + 0.25 * Math.max(0, Math.sin(t * 4))) * k;
    const hx = x, hy = y + r * 0.45;
    ctx.fillStyle = '#F2A23B';
    ctx.beginPath();
    ctx.moveTo(hx, hy + b);
    ctx.bezierCurveTo(hx - b * 1.6, hy - b * 0.2, hx - b * 0.7, hy - b * 1.4, hx, hy - b * 0.5);
    ctx.bezierCurveTo(hx + b * 0.7, hy - b * 1.4, hx + b * 1.6, hy - b * 0.2, hx, hy + b);
    ctx.fill();
  }
  if (stage >= 6) {
    // Trois runes des Anciens qui tournent plus loin
    ctx.strokeStyle = look.pale ? 'rgba(170,180,190,.8)' : 'rgba(232,196,106,.9)';
    ctx.lineWidth = 0.8 * k;
    for (let i = 0; i < 3; i++) {
      const a = -t * 0.5 + i * 2.1;
      const rx = x + Math.cos(a) * r * 2.4, ry = y - r * 0.4 + Math.sin(a) * r;
      const h = 2.2 * k;
      ctx.beginPath();
      ctx.moveTo(rx, ry - h);
      ctx.lineTo(rx, ry + h);
      ctx.moveTo(rx, ry - h * 0.6);
      ctx.lineTo(rx + h * 0.7, ry - h * 0.1);
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + h * 0.7, ry + h * 0.5);
      ctx.stroke();
    }
  }
  if (stage >= 7 && !look.sun) {
    // Une couronne dorée au-dessus de la pointe
    const cy = y - r * 2.5, w = 3.2 * k;
    ctx.fillStyle = '#F2C04B';
    ctx.strokeStyle = 'rgba(122,90,30,.6)';
    ctx.lineWidth = 0.5 * k;
    ctx.beginPath();
    ctx.moveTo(x - w, cy + w * 0.5);
    ctx.lineTo(x - w, cy - w * 0.3);
    ctx.lineTo(x - w * 0.5, cy + w * 0.1);
    ctx.lineTo(x, cy - w * 0.6);
    ctx.lineTo(x + w * 0.5, cy + w * 0.1);
    ctx.lineTo(x + w, cy - w * 0.3);
    ctx.lineTo(x + w, cy + w * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

// L'humeur de Brume sur l'île (choix de l'auteur, 8 oct. : animée, mignonne, selon ce qu'elle vit). ready : la
// récompense attend ; short : il manque de quoi payer la quête ; night : la nuit ; sinceClaim, sinceQuest : secondes
// depuis la dernière récompense, depuis la quête nouvelle ; t : le temps. 'pret' et 'neutre' sont ses dessins de base,
// les autres un calque d'expression de la bibliothèque (brumeArt.js)
export const LAUGH_S = 1.8;
export const SURPRISE_S = 2.2;
export function moodOf({ ready = false, short = false, night = false, sinceClaim = Infinity, sinceQuest = Infinity, t = 0 }) {
  if (sinceClaim < LAUGH_S) return 'rire';
  if (ready) return 'pret';
  if (sinceQuest < SURPRISE_S) return 'surpris';
  if (short) return 'gene';
  if (night) return 'endormi';
  // Au repos : un sourire par moments
  return t % 7 < 1.4 ? 'content' : 'neutre';
}

// Le mouvement de l'humeur, en plus du flottement : { dx, dy } (unités du monde) et { sx, sy } (échelles) ; since : secondes
// depuis ce qui l'a mise dans cet état (la récompense, la quête nouvelle)
export function motionOf(mood, t, since = 0) {
  if (mood === 'rire') {
    // Deux bonds de joie, qui s'amortissent, la flamme qui s'écrase et s'étire
    const p = Math.min(1, since / 1.2);
    const hop = Math.abs(Math.sin(p * Math.PI * 2)) * 9 * (1 - p * 0.5);
    const squash = 0.1 * Math.sin(p * Math.PI * 4);
    return { dx: 0, dy: -hop, sx: 1 + squash, sy: 1 - squash };
  }
  if (mood === 'pret') {
    // Elle sautille sur place : la récompense attend
    const b = Math.abs(Math.sin(t * 2.4));
    return { dx: 0, dy: -b * 4, sx: 1 + b * 0.04, sy: 1 - b * 0.04 };
  }
  if (mood === 'surpris') {
    // Un sursaut, étirée vers le haut
    const p = Math.min(1, since / 0.5);
    const s = Math.sin(p * Math.PI);
    return { dx: 0, dy: -s * 7, sx: 1 - 0.06 * s, sy: 1 + 0.12 * s };
  }
  // Gênée : elle frémit un peu, plus bas ; endormie : elle descend et respire lentement
  if (mood === 'gene') return { dx: Math.sin(t * 9) * 0.8, dy: 1.5, sx: 1, sy: 1 };
  if (mood === 'endormi') return { dx: 0, dy: 3 + Math.sin(t * 0.9) * 1.5, sx: 1.02, sy: 0.98 };
  return { dx: 0, dy: 0, sx: 1, sy: 1 };
}

// Le glissé vers une nouvelle place (une quête nouvelle) au lieu d'un saut : un pas de dt secondes depuis from vers to,
// qui ralentit en approchant (environ une seconde) ; elle reste d'abord sur place le temps du sursaut (GLIDE_WAIT_S)
export const GLIDE_WAIT_S = 1;
export function glideStep(from, to, dt) {
  const k = 1 - Math.exp(-Math.max(0, dt) * 3);
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
}

// Flottement autour du point d'ancrage : petit va-et-vient, bornes ±6 en x, ±4 en y
export function floatOf(t) {
  return { dx: Math.sin(t * 0.7) * 6, dy: Math.sin(t * 1.6) * 4 };
}

// Contour de la flamme : une goutte ronde en bas, une pointe qui vacille en haut (r : rayon du bas)
function flame(ctx, x, y, r, t, k) {
  const sway = Math.sin(t * 5.3) * r * 0.32 + Math.sin(t * 8.1) * r * 0.1;
  const top = r * (2.05 + 0.18 * Math.sin(t * 6.7)) * k;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x + r * 1.3, y + r, x + r * 1.15, y - r * 0.45, x + sway, y - top);
  ctx.bezierCurveTo(x - r * 1.15, y - r * 0.45, x - r * 1.3, y + r, x, y + r);
  ctx.closePath();
}

// Brume en (x, y) (centre du bas de la flamme) ; ready : récompense à réclamer ; scale : échelle de la caméra (taille
// minimale à l'écran quand on voit toute l'île) ; ground : le point au sol sous lui (son ombre) ; look : son stade
// (game/opus.js : brumeLook)
export function drawBrume(ctx, x0, y, ground, t, ready, scale, look = {}) {
  const k = Math.max(1, 0.6 / scale);
  const tone = ready ? WISP.ready : toneOf(look);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  // Au stade 0, elle tremble ; le soleil du phare n'est plus qu'une petite flamme
  const x = x0 + (look.stage === 0 ? Math.sin(t * 23) * 0.6 * k : 0);
  const r = (look.sun ? 6.5 : 8) * k;
  ctx.fillStyle = 'rgba(30,40,60,.12)';
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, 7 * k, 2.6 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  // Halo (plus large dans l'éclat du Phénix)
  const reach = (ready ? 30 + pulse * 6 : look.burst ? 34 + pulse * 6 : 26) * k;
  const halo = ctx.createRadialGradient(x, y - r * 0.4, 0, x, y - r * 0.4, reach);
  halo.addColorStop(0, `rgba(${tone.halo},${(ready ? 0.5 + 0.2 * pulse : 0.4).toFixed(3)})`);
  halo.addColorStop(1, `rgba(${tone.halo},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(x - reach, y - r * 0.4 - reach, reach * 2, reach * 2);
  // Étincelles qui montent et s'éteignent
  for (let i = 0; i < 3; i++) {
    const p = (t * 0.6 + i / 3) % 1;
    ctx.fillStyle = `rgba(${tone.halo},${(0.9 * (1 - p)).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x + Math.sin(t * 2 + i * 2.1) * r * 0.9, y - r * (1.2 + p * 2.4), (1.4 - p * 0.8) * k, 0, Math.PI * 2);
    ctx.fill();
  }
  // Flamme : bord coloré, puis le cœur clair
  const body = ctx.createRadialGradient(x, y + r * 0.2, r * 0.2, x, y - r * 0.3, r * 2.2);
  body.addColorStop(0, tone.core);
  body.addColorStop(0.45, tone.flame);
  body.addColorStop(1, tone.edge);
  ctx.fillStyle = body;
  flame(ctx, x, y, r, t, 1);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  flame(ctx, x, y + r * 0.25, r * 0.55, t + 0.4, 0.9);
  ctx.fill();
  adornments(ctx, x, y, r, k, t, look);
  // Deux yeux, et rien d'autre (un clignement toutes les 4 s)
  const blink = t % 4 < 0.12 ? 0.2 : 1;
  ctx.fillStyle = WISP.eye;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 2.9 * k, y - r * 0.1, 1.25 * k, 1.75 * k * blink, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!ready) return;
  // Pastille « ! » : la récompense attend
  const bx = x + r * 1.2, by = y - r * 2.1 - pulse * 2 * k;
  ctx.fillStyle = '#F2C04B';
  ctx.beginPath();
  ctx.arc(bx, by, 5.4 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4A3426';
  ctx.font = `900 ${(7.6 * k).toFixed(1)}px Nunito, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', bx, by + 0.4 * k);
  ctx.textBaseline = 'alphabetic';
}
