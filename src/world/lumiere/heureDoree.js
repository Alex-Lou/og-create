// L'heure dorée : quand le soleil est bas et le ciel clair, la lumière vient de son côté, chaude, et s'efface en mauve
// vers l'autre bord ; les ombres, longues, se teintent de mauve ; un liseré doré se pose sur les bords des toits et des
// arbres tournés vers le soleil. Doux, jamais éblouissant ; rien sous un ciel couvert ni sous la pluie.

const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// Force de l'heure dorée (0 à 1) : elle monte vite au lever, culmine soleil bas, s'éteint avant la matinée ; le
// couchant de même. Le côté du soleil : 1 le matin (il est à droite), -1 le soir
export function goldenOf(phase) {
  const { sun, weather } = phase;
  if (sun.up <= 0.01) return { k: 0, side: 1 };
  const k = smooth(0.01, 0.07, sun.up) * (1 - smooth(0.12, 0.38, sun.up)) * Math.pow(1 - weather.cover, 1.5) * (1 - weather.rain);
  return { k, side: sun.progress < 0.5 ? 1 : -1 };
}

// La lumière de l'heure dorée, posée sur l'île : chaude du côté du soleil, mauve de l'autre (en lumière douce), d'un
// bord de l'île à l'autre (bounds : son rectangle dans le monde) ; elle reste à sa place quand on glisse. Dans la
// transformation du monde ; view : le rectangle du monde à l'écran
export function drawGolden(ctx, view, phase, bounds) {
  const { k, side } = goldenOf(phase);
  if (k < 0.03) return;
  const x0 = side > 0 ? bounds.x + bounds.w : bounds.x, x1 = side > 0 ? bounds.x : bounds.x + bounds.w;
  const g = ctx.createLinearGradient(x0, bounds.y, x1, bounds.y + bounds.h * 0.35);
  g.addColorStop(0, `rgba(255, 186, 112, ${(0.42 * k).toFixed(3)})`);
  g.addColorStop(0.45, 'rgba(255, 214, 170, 0)');
  g.addColorStop(1, `rgba(128, 92, 168, ${(0.34 * k).toFixed(3)})`);
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = g;
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.restore();
}

// Le liseré doré de l'heure : { side, alpha }, ou null
export function rimOf(phase) {
  const { k, side } = goldenOf(phase);
  return k < 0.05 ? null : { side, alpha: 0.55 * k };
}

// Le liseré d'une image (un sprite rendu) : ses bords tournés vers la lumière (en or le soir, en blanc sous l'éclair :
// eclairs.js), en demi-résolution. Fait une fois par image, côté et couleur, gardé tant que l'image vit (WeakMap : il
// part avec elle) ; clearRims() vide tout quand l'heure dorée et l'orage sont passés
const GOLD = '#FFE1A0';
let rims = new WeakMap();
// Au plus tant de liserés neufs par image (chacun relit les pixels de son dessin) : au premier éclair, tout ce qui est
// à l'écran en demandait un d'un coup, et l'image saccadait ; les autres viennent aux images suivantes (null d'ici là)
const NEUFS_PAR_IMAGE = 6;
let neufs = 0;
export const imageSuivanteRims = () => { neufs = 0; };
export function rimImage(img, side, color = GOLD) {
  let pair = rims.get(img);
  if (!pair) rims.set(img, (pair = {}));
  const key = side + color;
  if (pair[key]) return pair[key];
  if (neufs >= NEUFS_PAR_IMAGE) return null;
  neufs++;
  const w = Math.max(1, Math.ceil(img.width / 2)), h = Math.max(1, Math.ceil(img.height / 2));
  const m = solidOf(img, w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.drawImage(m, 0, 0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0, 0, w, h);
  // (ôte la silhouette décalée vers l'ombre : il reste la bande du bord éclairé, et un peu le haut)
  const o = Math.max(1, Math.min(w, h) * 0.014);
  g.globalCompositeOperation = 'destination-out';
  g.drawImage(m, -side * o, o * 0.7);
  m.width = m.height = 0;
  pair[key] = c;
  return c;
}
// La silhouette pleine d'une image, en w × h : une ombre douce (à demi transparente) n'a pas de bord éclairé, elle
// disparaît ; le bord adouci du dessin le reste
function solidOf(img, w, h) {
  const m = document.createElement('canvas');
  m.width = w;
  m.height = h;
  const g = m.getContext('2d');
  g.drawImage(img, 0, 0, w, h);
  const px = g.getImageData(0, 0, w, h);
  for (let i = 3; i < px.data.length; i += 4) px.data[i] = Math.min(255, Math.max(0, (px.data[i] - 110) * 2));
  g.putImageData(px, 0, 0);
  return m;
}
export function clearRims() {
  rims = new WeakMap();
}
