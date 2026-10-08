// Les réserves des bâtiments (les récoltes) : ce que chaque bâtiment a produit, posé sur une case à côté de lui, vide, à
// moitié ou plein ; le jeu le montre selon ce qui attend d'être ramassé. D'après le métier de chaque maître : la marmite et
// les miches du foyer (Cannelle), la caisse de poissons du ponton (Aster), la caisse de rouages et de pièces de l'atelier
// (Rivet), les seaux d'eau du puits (Ondin), la pile de bûches du bosquet (Sylve), le tas de pierres taillées de la
// carrière (Galet), les paniers de légumes du potager (Mélisse). Plein, la réserve brille (2 images). Géométrie et lumière
// de world/iso.js, le cadre des cultures ; dessins en pixels du jeu (preview_reserves.mjs les agrandit × 1,25).
import { P, box, EDGE } from './port/src/world/iso.js';
import { WOOD, WOOD_DARK, STONE } from './port/src/world/palette.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
const bord = (w = 0.45) => ` stroke="${OUT}" stroke-width="${w}"`;
const etoile = (x, y, r) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x)},${f2(y)} ${f2(x + r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + r)} Q${f2(x)},${f2(y)} ${f2(x - r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - r)} Z" fill="#FFFBE0"/>`;

export const CADRE = [-34, -30, 68, 48]; // le cadre des cultures, en pixels du jeu
export const BATIMENTS = ['foyer', 'ponton', 'atelier', 'puits', 'bosquet', 'carriere', 'potager'];
export const ETATS = ['vide', 'moitie', 'plein'];
export const IMAGES = { vide: 1, moitie: 1, plein: 2 };

const ombre = (rx = 16) => { const [x, y] = P(0, 0, 0); return ell(x + 1, y + 1, rx, rx * 0.45, 'rgba(40,55,20,0.2)'); };
// une caisse de bois ouverte, de demi-côté a, haute de h (le dedans se voit)
function caisse(u, v, a, h) {
  return box(u - a, v - a * 0.8, u + a, v + a * 0.8, 0, h, WOOD) + [0.3, 0.65].map(t => ln(P(u - a, v + a * 0.8, h * t), P(u + a, v + a * 0.8, h * t), WOOD_DARK.right, 0.5)).join('');
}
const dedans = (u, v, a, h) => { const c = [[u - a, v - a * 0.8], [u + a, v - a * 0.8], [u + a, v + a * 0.8], [u - a, v + a * 0.8]].map(([a1, b1]) => P(a1, b1, h)); return `<polygon points="${c.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="#4A2E1A"${EDGE}/>`; };
// ce qui dépasse d'une caisse : n objets posés sur le dedans
const tas = (u, v, a, h, n, objet) => { let o = ''; const pos = [[-0.5, -0.4], [0.5, -0.3], [0, 0.1], [-0.5, 0.45], [0.5, 0.5], [0, -0.6], [-0.1, 0.2], [0.3, 0.05], [-0.3, -0.05]]; for (let i = 0; i < n; i++) { const [du, dv] = pos[i]; const [x, y] = P(u + du * a, v + dv * a * 0.8, h + (i > 4 ? 2.4 : 0.6)); o += objet(x, y, i); } return o; };

const DESSINS = {
  // le foyer : la marmite sur son trépied et le panier de miches
  foyer: n => {
    const [mx, my] = P(-0.12, -0.05, 0);
    let o = ombre() + [[-5, 0], [5, 0], [0, 3]].map(([dx, dy]) => ln([mx + dx * 0.6, my + dy * 0.4 - 7], [mx + dx, my + dy], '#3B3C42', 1.1)).join('')
      + `<path d="M${f2(mx - 6)},${f2(my - 8)} Q${f2(mx - 6)},${f2(my - 1)} ${f2(mx)},${f2(my - 1)} Q${f2(mx + 6)},${f2(my - 1)} ${f2(mx + 6)},${f2(my - 8)} Z" fill="#3E3E46"${bord()}/>` + ell(mx, my - 8, 6, 1.8, n ? '#E8A04A' : '#2A2A30', bord());
    if (n === 2) o += ell(mx, my - 8.2, 4.6, 1.2, '#F2C46A') + [0, 1].map(i => dot(mx - 2 + i * 3.4, my - 8.4, 0.7, '#E8803A')).join('');
    const [px, py] = P(0.24, 0.16, 0);
    o += ell(px, py - 2, 6, 2.4, '#B8864E', bord()) + `<path d="M${f2(px - 6)},${f2(py - 2)} L${f2(px - 5)},${f2(py + 1)} Q${f2(px)},${f2(py + 2.6)} ${f2(px + 5)},${f2(py + 1)} L${f2(px + 6)},${f2(py - 2)} Z" fill="#A8743E"${bord()}/>`;
    const miches = [[-2.6, -3], [1.8, -3.2], [-0.4, -4.6], [3.6, -2.2], [-3.8, -1.8]].slice(0, [0, 2, 5][n]);
    return o + miches.map(([dx, dy]) => ell(px + dx, py + dy, 2.2, 1.4, '#D89A4E', bord(0.4)) + ln([px + dx - 1, py + dy - 0.4], [px + dx + 1, py + dy - 0.6], '#F2C88A', 0.5)).join('');
  },
  // le ponton : la caisse de poissons et la nasse
  ponton: n => ombre() + caisse(0, 0, 0.2, 7) + dedans(0, 0, 0.2, 7) + tas(0, 0, 0.2, 7, [0, 4, 9][n], (x, y, i) => {
    const c = ['#8FB8D8', '#E8A06A', '#B8C8D0'][i % 3];
    return `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x)},${f2(y - 1.6)} ${f2(x + 2.2)},${f2(y)} Q${f2(x)},${f2(y + 1.6)} ${f2(x - 3)},${f2(y)} Z M${f2(x + 2)},${f2(y)} l1.4,-1 l0,2 Z" fill="${c}"${bord(0.4)}/>` + dot(x - 1.8, y - 0.2, 0.3, OUT);
  }),
  // l'atelier : la caisse de rouages et de petites pièces de laiton
  atelier: n => ombre() + caisse(0, 0, 0.2, 6) + dedans(0, 0, 0.2, 6) + tas(0, 0, 0.2, 6, [0, 4, 9][n], (x, y, i) => i % 2
    ? `<circle cx="${f2(x)}" cy="${f2(y - 1)}" r="2" fill="#D8A84A"${bord(0.4)}/>` + dot(x, y - 1, 0.7, '#8A6A2A') + [0, 60, 120, 180, 240, 300].map(a => dot(x + Math.cos(a * Math.PI / 180) * 2.2, y - 1 + Math.sin(a * Math.PI / 180) * 2.2, 0.5, '#D8A84A')).join('')
    : ell(x, y - 0.6, 1.6, 0.8, '#A9AFB8', bord(0.4)) + dot(x, y - 0.7, 0.4, '#5A5E66')),
  // le puits : les seaux d'eau, vides, un plein, tous pleins
  puits: n => ombre() + [[-0.18, -0.08], [0.16, -0.12], [0.02, 0.16]].map(([u, v], i) => {
    const [x, y] = P(u, v, 0), plein = i < [0, 1, 3][n];
    return `<path d="M${f2(x - 3.6)},${f2(y - 7)} L${f2(x - 2.8)},${f2(y)} L${f2(x + 2.8)},${f2(y)} L${f2(x + 3.6)},${f2(y - 7)} Z" fill="${WOOD.left}"${bord()}/>` + ln([x - 3.2, y - 3.6], [x + 3.2, y - 3.6], '#3B3C42', 0.7)
      + ell(x, y - 7, 3.6, 1.2, plein ? '#7FC4EA' : '#4A2E1A', bord()) + (plein ? ell(x - 1, y - 7.2, 1.2, 0.4, '#C8ECFA') : '') + `<path d="M${f2(x - 3.4)},${f2(y - 7)} Q${f2(x)},${f2(y - 12)} ${f2(x + 3.4)},${f2(y - 7)}" stroke="#3B3C42" stroke-width="0.6" fill="none"/>`;
  }).join(''),
  // le bosquet : la pile de bûches calées par deux piquets
  bosquet: n => {
    const [x, y] = P(0, 0, 0);
    const rangs = [[], [[-4, 0], [0, 0], [4, 0]], [[-6, 0], [-2, 0], [2, 0], [6, 0], [-4, -3.6], [0, -3.6], [4, -3.6], [-2, -7.2], [2, -7.2]]][n];
    return ombre() + [-8.4, 8.4].map(dx => ln([x + dx, y + 1], [x + dx, y - 10], WOOD_DARK.left, 1.4)).join('')
      + rangs.map(([dx, dy]) => ell(x + dx, y + dy - 1.8, 2, 1.8, '#C89A6A', bord()) + ell(x + dx, y + dy - 1.8, 1.1, 1, 'none', ' stroke="#9A6A42" stroke-width="0.4"') + dot(x + dx, y + dy - 1.8, 0.3, '#8A5A32')).join('')
      + (n ? '' : ell(x, y - 0.4, 6, 1.2, '#8A6A46', ' opacity="0.6"') + [-3, 2].map(dx => dot(x + dx, y - 0.6, 0.6, '#C89A6A')).join(''));
  },
  // la carrière : le tas de pierres taillées sur une palette
  carriere: n => {
    let o = ombre() + box(-0.22, -0.18, 0.22, 0.18, 0, 1.6, WOOD);
    const blocs = [[], [[-0.1, 0], [0.1, 0]], [[-0.12, -0.08], [0.1, -0.08], [-0.12, 0.08], [0.1, 0.08], [-0.01, 0, 1]]][n];
    for (const [u, v, haut] of blocs) o += box(u - 0.08, v - 0.06, u + 0.08, v + 0.06, haut ? 6.4 : 1.6, haut ? 11.2 : 6.4, STONE);
    return o;
  },
  // le potager : les paniers de légumes (carottes, choux, citrouille)
  potager: n => {
    let o = ombre();
    [[-0.16, -0.06], [0.16, 0.08]].forEach(([u, v], i) => {
      const [x, y] = P(u, v, 0);
      o += ell(x, y - 3.4, 5, 1.8, '#7A5232', bord()) + `<path d="M${f2(x - 5)},${f2(y - 3.4)} L${f2(x - 4)},${f2(y)} Q${f2(x)},${f2(y + 1.4)} ${f2(x + 4)},${f2(y)} L${f2(x + 5)},${f2(y - 3.4)} Z" fill="#B8864E"${bord()}/>`;
      if (n > i) o += i === 0
        ? [[-2.2, -4.4], [0, -5], [2.2, -4.2]].map(([dx, dy]) => `<path d="M${f2(x + dx - 0.8)},${f2(y + dy)} L${f2(x + dx + 0.9)},${f2(y + dy - 0.4)} L${f2(x + dx + 2)},${f2(y + dy + 1.4)} Z" fill="#F08A3A"${bord(0.35)}/>` + ln([x + dx - 0.6, y + dy - 0.2], [x + dx - 1.6, y + dy - 2], '#5FA04A', 0.8)).join('')
        : dot(x - 1.6, y - 4.6, 2, '#9CC4B0') + `<circle cx="${f2(x + 1.8)}" cy="${f2(y - 4.4)}" r="2.2" fill="#E8862E"${bord(0.4)}/>`;
    });
    return o;
  }
};

// La réserve d'un bâtiment dans un état, image n (plein : 2 images, elle brille)
export function reserve(batiment, etat, n) {
  const d = DESSINS[batiment];
  if (!d) throw new Error(`bâtiment inconnu : ${batiment} (${BATIMENTS.join(', ')})`);
  const k = ETATS.indexOf(etat);
  if (k < 0) throw new Error(`état inconnu : ${etat} (${ETATS.join(', ')})`);
  let o = d(k);
  if (k === 2) o += (n % 2 ? etoile(9, -16, 2.2) + etoile(-11, -10, 1.6) : etoile(-6, -18, 2.4) + etoile(12, -8, 1.6));
  return o;
}
