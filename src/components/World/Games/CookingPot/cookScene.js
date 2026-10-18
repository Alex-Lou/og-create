// Le coin cuisine d’Agathe, dessiné sur la scène (game/stage), comme le plateau de la Récolte : les pièces de la
// bibliothèque (design/bibliotheque/svg/minijeux/cuisine, précuites à leur taille), l'eau puis la soupe qui montent dans
// la marmite, les filets qui coulent du seau et de la louche, les ingrédients qui flottent et tournent avec le remous,
// la traînée de lumière du doigt qui touille. Le feu, sa lueur, la vapeur et les bulles vivent en CSS (CookingPot.css). Le composant garde le jeu
// (game/cooking.js) et le doigt ; la scène ne fait que montrer ce que lui dit view (non réactif, lu à chaque image).
// Tout se place en unités de la largeur de l'aire de jeu (game/cooking.js : x de 0 à 100, y de 0 à 125).
import { createStage } from '@/game/stage/stage';
import { createSpriteCache } from '@/game/stage/sprites';
import { clamp01, outCubic, lerp } from '@/game/stage/ease';
import { LINE } from '@/game/cooking';
import POT_SVG from '/design/bibliotheque/svg/minijeux/cuisine/marmite.svg?raw';
import LADLE_SVG from '/design/bibliotheque/svg/minijeux/cuisine/louche.svg?raw';
import BOWL_SVG from '/design/bibliotheque/svg/minijeux/cuisine/bol.svg?raw';
import BUCKET_SVG from '/design/bibliotheque/svg/minijeux/cuisine/seau.svg?raw';
import WEED_SVG from '/design/bibliotheque/svg/minijeux/cuisine/algues.svg?raw';
import PLANK_SVG from '/design/bibliotheque/svg/minijeux/cuisine/planche.svg?raw';
import SWIRL_SVG from '/design/bibliotheque/svg/minijeux/cuisine/remous.svg?raw';
import SHELLS_SVG from '/design/bibliotheque/svg/plantes/coquillages_nacres_etoile.svg?raw';

// Où se pose chaque pièce (unités ; x, y : le coin haut gauche, w : la largeur ; la hauteur suit son dessin)
export const LAYOUT = {
  pot: { x: 31, y: 38, w: 54 }, // marmite.svg, 120 × 100
  plank: { x: 3, y: 106, w: 94 }, // planche.svg, 352 × 66
  bowl: { x: 80, y: 103, w: 26 }, // bol.svg, 80 × 50 (x, y : son centre)
  ladle: { w: 15 }, // louche.svg, 60 × 100
  bucket: { w: 21 }, // seau.svg, 60 × 60
  shells: { w: 21 }, // coquillages, recadrés à 52 × 28
  weed: { w: 17 } // algues.svg, 60 × 60
};
// Les pièces de la planche, à leur place (leur centre)
export const REST = { seau: { x: 20, y: 101 }, coquillages: { x: 50, y: 108 }, algues: { x: 78, y: 102 } };
// La louche au repos dans la marmite : le centre de son creux
export const LADLE_REST = { x: 64, y: 55 };
const POT_K = LAYOUT.pot.w / 120;
// La bouche de la marmite (son dedans : marmite.svg, l'ellipse 60, 35, 41 × 9,5)
const MOUTH = { x: LAYOUT.pot.x + 60 * POT_K, y: LAYOUT.pot.y + 35 * POT_K, rx: 41 * POT_K, ry: 9.5 * POT_K };
// Le bol : son dedans (bol.svg, l'ellipse 40, 18,8, 28 × 6), par rapport à son centre
const BOWL_K = LAYOUT.bowl.w / 80;
const BOWL_IN = { dx: 0, dy: (18.8 - 25) * BOWL_K, rx: 28 * BOWL_K, ry: 6 * BOWL_K };
// La louche : son creux et son bec par rapport au centre du dessin (louche.svg : creux en 22, 76 ; bec en 5, 76)
const LADLE_K = LAYOUT.ladle.w / 60;
const LADLE_CUP = { dx: (22 - 30) * LADLE_K, dy: (76 - 50) * LADLE_K, rx: 14.6 * LADLE_K, ry: 3.8 * LADLE_K };
const LADLE_LIP = -17 * LADLE_K;
// Le seau : les deux coins de son bord par rapport à son centre (seau.svg : 12, 19 et 48, 19)
const BUCKET_K = LAYOUT.bucket.w / 60;
const BUCKET_LIP = { dx: 18 * BUCKET_K, dy: -11 * BUCKET_K };
const TRAIL_MS = 420; // la traînée du doigt s'efface en tant de ms
const GOLD = '#F2C25A';

// Un dessin de la bibliothèque en adresse d'image (le texte du SVG, éventuellement retouché)
const urlOf = svg => URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
// La marmite sans son bouillon (la scène le dessine, à son niveau) ; son bord avant à part, posé par-dessus le liquide
function potParts() {
  const cut = POT_SVG.indexOf('<ellipse cx="60" cy="36" rx="40" ry="8.6" class="bouillon"');
  const lip = POT_SVG.indexOf('<ellipse cx="60" cy="35.4" rx="40" ry="8.6" fill="none"');
  const steam = POT_SVG.indexOf('<g class="vapeur">');
  const head = POT_SVG.slice(0, POT_SVG.indexOf('>') + 1);
  return { body: `${POT_SVG.slice(0, cut)}</svg>`, lip: `${head}${POT_SVG.slice(lip, steam)}</svg>` };
}
// La louche et le bol : vides (leur bouillon ôté), ou la louche pleine (de la teinte du bouillon)
const withSoup = (svg, color) => svg.replace(/fill="var\(--cook-soup, [^)]*\)"/, `fill="${color}"`);
const dryOf = svg => svg.replace(/<ellipse[^>]*class="bouillon"[^>]*\/>/, '');
// Les coquillages : petits au bas d'un grand cadre (plantes/), recadrés sur eux
const shellsOf = svg => svg.replace(/width="100" height="140" viewBox="-50 -115 100 140"/, 'width="208" height="112" viewBox="-26 -16 52 28"');

// La scène. view : ce que montre la scène (le composant le tient à jour) ; frame(dt) : le composant avance son jeu à
// chaque image (dt en ms), et rend vrai si quelque chose bouge ; soup : la teinte du bouillon prêt (la louche pleine)
export function createCookScene(canvas, { view, frame, soup, reduced }) {
  const pot = potParts();
  const urls = {
    pot: urlOf(pot.body), lip: urlOf(pot.lip), plank: urlOf(PLANK_SVG), swirl: urlOf(SWIRL_SVG),
    bowl: urlOf(dryOf(BOWL_SVG)), ladle: urlOf(dryOf(LADLE_SVG)), ladleFull: urlOf(withSoup(LADLE_SVG, soup)),
    seau: urlOf(BUCKET_SVG), algues: urlOf(WEED_SVG), coquillages: urlOf(shellsOf(SHELLS_SVG))
  };
  const stage = createStage(canvas, draw, { reduced });
  let scaled = stage.dpr;
  const cache = createSpriteCache(scaled, () => stage.wake());
  const u = () => stage.w / 100;

  // Un dessin de la bibliothèque, centré en (x, y), large de w unités, tourné de a (rad) autour de (ox, oy) : son
  // décalage depuis le centre, en unités
  function sprite(ctx, url, x, y, w, { a = 0, ox = 0, oy = 0, alpha = 1 } = {}) {
    const r = cache.ratio(url);
    if (!r) return;
    const k = u();
    const img = cache.get(url, w * k, w * r * k);
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate((x + ox) * k, (y + oy) * k);
    if (a) ctx.rotate(a);
    ctx.drawImage(img, (-ox - w / 2) * k, (-oy - (w * r) / 2) * k, w * k, w * r * k);
    ctx.restore();
  }
  // Un dessin posé par son coin haut gauche (le décor fixe)
  function placed(ctx, url, { x, y, w }) {
    const r = cache.ratio(url);
    if (r) sprite(ctx, url, x + w / 2, y + (w * r) / 2, w);
  }

  // La surface d'un liquide dans un creux (une ellipse rx × ry en cx, cy) : à son niveau (de 0 à 1), plus étroite et
  // un peu plus bas quand il en manque, toujours dedans (rien à découper : le dessin reste bon marché) ; { x, y, rx, ry }
  const surfaceOf = (cx, cy, rx, ry, level) => {
    const s = 0.55 + 0.42 * level;
    return { x: cx, y: cy + (1 - level) * 0.38 * ry, rx: rx * s, ry: ry * s };
  };
  const potSurface = level => surfaceOf(MOUTH.x, MOUTH.y + 0.4, MOUTH.rx * 0.97, MOUTH.ry * 0.92, level);
  const bowlSurface = fill => surfaceOf(LAYOUT.bowl.x + BOWL_IN.dx, LAYOUT.bowl.y + BOWL_IN.dy + 0.2, BOWL_IN.rx * 0.96, BOWL_IN.ry * 0.9, fill);
  // Le liquide d'un creux : sa surface (sa teinte, un reflet plus clair vers le feu, une ligne de lumière) ; chaude, un
  // liseré qui luit
  function liquid(ctx, surf, color, hot) {
    const k = u();
    const tone = tonesOf(color);
    ctx.save();
    ctx.fillStyle = tone.deep;
    ctx.beginPath();
    ctx.ellipse(surf.x * k, surf.y * k, surf.rx * k, surf.ry * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse((surf.x - surf.rx * 0.06) * k, (surf.y - surf.ry * 0.08) * k, surf.rx * 0.9 * k, surf.ry * 0.8 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tone.light;
    ctx.beginPath();
    ctx.ellipse((surf.x - surf.rx * 0.22) * k, (surf.y - surf.ry * 0.25) * k, surf.rx * 0.45 * k, surf.ry * 0.38 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    // (le reflet de la lueur du feu)
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.35 * k;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(surf.x * k, surf.y * k, surf.rx * 0.62 * k, surf.ry * 0.5 * k, 0, Math.PI * 1.12, Math.PI * 1.55);
    ctx.stroke();
    if (hot) {
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = tone.glow;
      ctx.lineWidth = 0.7 * k;
      ctx.beginPath();
      ctx.ellipse(surf.x * k, surf.y * k, surf.rx * 0.97 * k, surf.ry * 0.94 * k, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Un filet qui coule de from à to (unités) : une courbe de chute, son halo, son reflet
  function stream(ctx, from, to, color, width) {
    const k = u();
    const cx = from.x + (to.x - from.x) * 0.2;
    const cy = from.y + (to.y - from.y) * 0.05;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x * k, from.y * k);
    ctx.quadraticCurveTo(cx * k, cy * k, to.x * k, to.y * k);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = width * 2.8 * k;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = width * k;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = width * 0.3 * k;
    ctx.stroke();
    ctx.restore();
  }

  // La traînée de lumière du doigt qui touille (comme la chaîne de la Récolte) : ses derniers points, qui s'effacent
  function trail(ctx, points, now) {
    const live = points.filter(p => now - p.t < TRAIL_MS);
    if (live.length < 2) return;
    const k = u();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 1; i < live.length; i++) {
      const a = live[i - 1];
      const b = live[i];
      const fade = 1 - (now - b.t) / TRAIL_MS;
      ctx.strokeStyle = `rgba(242, 194, 90, ${(0.22 * fade).toFixed(3)})`;
      ctx.lineWidth = 4.2 * k * fade;
      ctx.beginPath();
      ctx.moveTo(a.x * k, a.y * k);
      ctx.lineTo(b.x * k, b.y * k);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 246, 214, ${(0.85 * fade).toFixed(3)})`;
      ctx.lineWidth = 1.1 * k * fade;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Le décor qui ne bouge pas pendant un geste, précuit dans un calque (comme le plateau de la Récolte) : la marmite,
  // la louche au repos (sous le bouillon), la planche et ce qui y attend, le bol. Il se refait quand l'un d'eux change
  const layer = document.createElement('canvas');
  let layerKey = '';
  function bakeLayer(st, key, pieces, ladle, bowl) {
    layer.width = st.canvas.width;
    layer.height = st.canvas.height;
    const lc = layer.getContext('2d');
    lc.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    placed(lc, urls.pot, LAYOUT.pot);
    if (ladle && ladle.rest) drawLadle(lc, ladle);
    placed(lc, urls.plank, LAYOUT.plank);
    for (const piece of pieces) if (!piece.moving) drawPiece(lc, piece);
    if (bowl) sprite(lc, urls.bowl, LAYOUT.bowl.x, LAYOUT.bowl.y, LAYOUT.bowl.w);
    // (un dessin pas encore lu : le calque se refera quand il le sera)
    layerKey = loaded() ? key : '';
  }
  const loaded = () => [urls.pot, urls.plank, urls.bowl, urls.ladle, urls.ladleFull, urls.seau, urls.algues, urls.coquillages].every(url => cache.ratio(url));

  // Chaque image : le calque, puis ce qui vit pendant un geste (le liquide, ce qui y flotte, le remous, le trait doré,
  // le bord de la marmite, le bol qui se remplit, ce que tient le doigt, ce qui tombe, les filets, la traînée). Rien ne
  // bouge : la scène s'endort ; le feu, la vapeur et les bulles vivent en CSS (CookingPot.css), sans la réveiller
  function draw(ctx, st, dt) {
    const t = st.t;
    const now = performance.now();
    const k = u();
    // (une autre densité d'écran : les dessins se recuisent)
    if (st.dpr !== scaled) {
      scaled = st.dpr;
      cache.rescale(scaled);
      layerKey = '';
    }
    const moving = frame(dt);
    const v = view;
    const level = v.level();
    const color = v.soup();
    const pieces = v.pieces();
    const ladle = v.ladle();
    const bowl = v.bowl();
    const key = `${st.canvas.width}x${st.canvas.height}|${pieces.filter(p => !p.moving).map(p => p.id).join()}|${ladle ? `${ladle.rest}${ladle.full}` : '-'}|${bowl ? 1 : 0}`;
    if (key !== layerKey) bakeLayer(st, key, pieces, ladle, bowl);
    ctx.drawImage(layer, 0, 0, st.w, st.h);

    // Le liquide, ce qui y flotte, le remous, le trait doré ; puis le bord avant de la marmite
    if (level > 0.01) {
      const surf = potSurface(level);
      liquid(ctx, surf, color, v.hot());
      if (v.swirl()) {
        ctx.save();
        ctx.translate(surf.x * k, surf.y * k);
        ctx.scale(1, surf.ry / surf.rx);
        ctx.rotate(v.angle());
        ctx.translate(-surf.x * k, -surf.y * k);
        sprite(ctx, urls.swirl, surf.x, surf.y, surf.rx * 1.7, { alpha: 0.42 });
        ctx.restore();
      }
      // (ce qui flotte tourne avec le remous, et seulement avec lui : rien ne saute quand la scène se réveille)
      for (const f of v.floating()) {
        const a = f.a + v.angle() * 0.9;
        sprite(ctx, urls[f.id], surf.x + Math.cos(a) * surf.rx * 0.5, surf.y + Math.sin(a) * surf.ry * 0.45 - 0.6, f.id === 'algues' ? 7 : 8, { a: Math.sin(a) * 0.2 });
      }
    }
    if (v.line()) lineRing(ctx, level, t);
    placed(ctx, urls.lip, LAYOUT.pot);
    if (bowl && bowl.fill > 0.01) liquid(ctx, bowlSurface(bowl.fill), color, bowl.fill > 0.99);

    // Ce qui revient à sa place, ce que tient le doigt (le seau, un ingrédient, la louche), ce qui tombe, les filets
    for (const piece of pieces) if (piece.moving) drawPiece(ctx, piece);
    for (const fall of v.falling()) drawFall(ctx, fall, now);
    const held = v.held();
    if (held) drawPiece(ctx, held);
    if (ladle && !ladle.rest) drawLadle(ctx, ladle);
    const pour = v.pour();
    if (pour) stream(ctx, pour.from, pour.to, pour.color, pour.width);
    trail(ctx, v.trail(), now);
    return moving;
  }

  // Une pièce de la planche (au repos, ou tenue : { id, x, y, tilt }) ; le seau penché verse par son bord
  function drawPiece(ctx, p) {
    const w = LAYOUT[p.id === 'seau' ? 'bucket' : p.id === 'coquillages' ? 'shells' : 'weed'].w;
    sprite(ctx, urls[p.id], p.x, p.y, w, { a: p.tilt || 0 });
  }
  // Un ingrédient qui tombe dans la marmite (de from à la surface, en arc), puis plonge
  function drawFall(ctx, f, now) {
    const a = clamp01((now - f.at) / f.ms);
    const x = lerp(f.from.x, MOUTH.x + f.dx, a);
    const y = lerp(f.from.y, MOUTH.y, outCubic(a)) - Math.sin(a * Math.PI) * 10;
    const w = LAYOUT[f.id === 'coquillages' ? 'shells' : 'weed'].w * (1 - 0.55 * a);
    sprite(ctx, urls[f.id], x, y, w, { a: a * 1.4 });
  }
  // La louche ({ x, y : le centre de son creux ; tilt ; full }), dessinée par le centre de son dessin
  function drawLadle(ctx, l) {
    sprite(ctx, l.full ? urls.ladleFull : urls.ladle, l.x - LADLE_CUP.dx, l.y - LADLE_CUP.dy, LAYOUT.ladle.w, { a: l.tilt || 0, ox: LADLE_CUP.dx, oy: LADLE_CUP.dy });
  }
  // Le trait doré dans la marmite (au temps de verser) : il s'allume, et bat, quand l'eau l'atteint
  function lineRing(ctx, level, t) {
    const k = u();
    const s = potSurface((LINE.min + LINE.max) / 2);
    const on = level >= LINE.min && level <= LINE.max;
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.beginPath();
    ctx.ellipse(s.x * k, s.y * k, s.rx * k, s.ry * k, 0, 0, Math.PI * 2);
    if (on) {
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2.4 * k;
      ctx.stroke();
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t / 120);
      ctx.lineWidth = 0.9 * k;
    } else {
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 0.55 * k;
      ctx.setLineDash([1.6 * k, 1.4 * k]);
    }
    ctx.stroke();
    ctx.restore();
  }

  return {
    stage,
    // Les points de l'aire de jeu (unités) sur la scène (px), pour les éclats et les mots
    px: p => ({ x: p.x * u(), y: p.y * u() }),
    // La bouche de la marmite, et la surface du liquide à ce niveau (unités)
    mouth: () => ({ ...MOUTH }),
    surface: level => potSurface(level),
    // Le bord du seau qui verse (b : son centre, tilt : son penché), le bec de la louche (l : son creux), la surface du bol
    bucketLip: (b, tilt) => {
      const dx = Math.sign(tilt || -1) * BUCKET_LIP.dx;
      const c = Math.cos(tilt);
      const s = Math.sin(tilt);
      return { x: b.x + dx * c - BUCKET_LIP.dy * s, y: b.y + dx * s + BUCKET_LIP.dy * c };
    },
    ladleLip: (l, tilt) => ({ x: l.x + LADLE_LIP * Math.cos(tilt), y: l.y + LADLE_LIP * Math.sin(tilt) }),
    bowlSurface,
    destroy() {
      stage.destroy();
      Object.values(urls).forEach(url => URL.revokeObjectURL(url));
    }
  };
}

// Les tons d'une teinte de liquide ('#RRGGBB'), calculés une fois : son fond, son reflet, son liseré chaud
const TONES = new Map();
function tonesOf(color) {
  if (!TONES.has(color)) TONES.set(color, { deep: shade(color, -0.22), light: shade(color, 0.3), glow: shade(color, 0.55) });
  return TONES.get(color);
}
// Une teinte éclaircie (amount > 0) ou assombrie (< 0) : '#RRGGBB'
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const ch = s => {
    const c = (n >> s) & 255;
    return Math.round(amount > 0 ? c + (255 - c) * amount : c * (1 + amount));
  };
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}
