// La charte des textes et des bulles dessinés sur l'île (noms des lieux, bulles, « ! ») : les teintes des jetons CSS
// (src/styles/tokens/colors.css ; tests/world/charte.test.js vérifie qu'elles n'en dérivent pas), une police, une ombre
// douce. La nuit, ils deviennent de petites lanternes : un ton plus chaud et une lueur dorée autour, toujours lisibles
// sans trancher sur l'île assombrie. Le placement d'un nom qui ne cache personne, le rebond d'une bulle qui apparaît.
import { mixHex } from './iso';

// Teintes (jeton CSS en regard)
export const TINT = {
  ink: '#4a3427', // --walnut-700 : le texte posé sur le vélin
  vellum: '#fbf5e8', // --vellum-100 : les pastilles des noms
  paper: '#fffcf5', // --vellum-50 : les bulles
  gold100: '#fff4d6', // --gold-100 : la bulle d'un visiteur ; le ton des lanternes
  gold400: '#efc163', // --gold-400 : la pastille d'une récompense
  gold500: '#e0a93a', // --gold-500 : le cerne d'une bulle de visiteur
  amber100: '#fff4e5', // --amber-100 : la bulle d'un besoin, d'un « ! »
  amber500: '#f0a84a', // --amber-500 : son cerne
  amber700: '#b5651d', // --amber-700 : le « ! »
  rim: '#e8d8b8' // --vellum-300 : le cerne d'une bulle de production
};
// Les mêmes, en canaux, à toute transparence
export const RGB = {
  vellum: '251, 245, 232', // --vellum-100
  shade: '74, 52, 38', // --shade-rgb : la pastille d'un lieu encore à bâtir
  dusk: '52, 36, 26', // --ink-900-rgb : l'ombre douce
  glow: '239, 193, 99' // --gold-400-rgb : la lueur des lanternes
};

// Police des textes de l'île (celle de l'interface : --font-ui)
export const font = (weight, px) => `${weight} ${px}px Nunito, system-ui, sans-serif`;

// Le ton d'un fond clair à la nuit (0 à 1) : il se réchauffe vers l'or pâle
export const warm = (hex, night) => mixHex(hex, TINT.gold100, night * 0.7);

// Ombre douce sous une bulle (taille k), qui devient une lueur dorée la nuit : à poser avant de remplir, dans un
// save()/restore()
export function softShadow(ctx, k, night) {
  const day = 1 - night;
  ctx.shadowColor = night > 0.02
    ? `rgba(${mixRgb(RGB.dusk, RGB.glow, night)}, ${(0.3 + 0.25 * night).toFixed(3)})`
    : `rgba(${RGB.dusk}, .3)`;
  ctx.shadowBlur = (6 + 6 * night) * k;
  ctx.shadowOffsetY = 2 * day * k;
}
function mixRgb(a, b, k) {
  const [pa, pb] = [a, b].map(s => s.split(',').map(Number));
  return pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(', ');
}

// Rebond d'une bulle qui apparaît (POP_MS) : son échelle à l'instant now ; seen : la Map des bulles vues (clé →
// { at : apparition, last : dernière image }), tenue par l'appelant. Absente un moment (GONE_MS), elle rebondit de
// nouveau en revenant
export const POP_MS = 380;
const GONE_MS = 300;
export function popScale(seen, key, now) {
  let s = seen.get(key);
  if (!s || now - s.last > GONE_MS) seen.set(key, (s = { at: now, last: now }));
  s.last = now;
  const k = Math.min(1, (now - s.at) / POP_MS);
  if (k >= 1) return 1;
  const back = 1.6;
  return 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
}

// Où poser un nom (rectangle centré en x, y, de w × h) pour ne couvrir aucun obstacle ({ x0, y0, x1, y1 }) : son
// décalage vertical (0 : à sa place ; vers le bas d'abord, puis vers le haut), ou null si aucune place proche n'est libre
const SHIFTS = [0, 1.2, 2.4, -1.2, -2.4];
export function labelShift(x, y, w, h, obstacles) {
  for (const s of SHIFTS) {
    const top = y + s * h - h / 2, bottom = top + h;
    if (!obstacles.some(o => o.x1 > x - w / 2 && o.x0 < x + w / 2 && o.y1 > top && o.y0 < bottom)) return s * h;
  }
  return null;
}
