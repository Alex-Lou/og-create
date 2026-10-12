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

// Le voile de l'heure dorée, à l'écran : chaud du côté du soleil, mauve de l'autre (en lumière douce)
export function drawGolden(ctx, w, h, phase) {
  const { k, side } = goldenOf(phase);
  if (k < 0.03) return;
  const g = ctx.createLinearGradient(side > 0 ? w : 0, 0, side > 0 ? 0 : w, h * 0.35);
  g.addColorStop(0, `rgba(255, 186, 112, ${(0.42 * k).toFixed(3)})`);
  g.addColorStop(0.45, 'rgba(255, 214, 170, 0)');
  g.addColorStop(1, `rgba(128, 92, 168, ${(0.34 * k).toFixed(3)})`);
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// Le liseré doré de l'heure : { side, alpha }, ou null
export function rimOf(phase) {
  const { k, side } = goldenOf(phase);
  return k < 0.05 ? null : { side, alpha: 0.55 * k };
}

// Le liseré d'une image (un sprite rendu) : ses bords tournés vers le soleil, en or, en demi-résolution. Fait une fois
// par image et par côté, gardé tant que l'image vit (WeakMap : il part avec elle) ; clearRims() vide tout quand
// l'heure dorée finit
const GOLD = '#FFE1A0';
let rims = new WeakMap();
export function rimImage(img, side) {
  let pair = rims.get(img);
  if (!pair) rims.set(img, (pair = {}));
  if (pair[side]) return pair[side];
  const w = Math.max(1, Math.ceil(img.width / 2)), h = Math.max(1, Math.ceil(img.height / 2));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0, w, h);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = GOLD;
  g.fillRect(0, 0, w, h);
  // (ôte la silhouette décalée vers l'ombre : il reste la bande du bord éclairé, et un peu le haut)
  const o = Math.max(1, Math.min(w, h) * 0.014);
  g.globalCompositeOperation = 'destination-out';
  g.drawImage(img, -side * o, o * 0.7, w, h);
  pair[side] = c;
  return c;
}
export function clearRims() {
  rims = new WeakMap();
}
