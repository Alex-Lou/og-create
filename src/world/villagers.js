// Habitants de l'île (et visiteurs) : petits personnages à grosse tête, dessinés en SVG sous trois angles — de face
// (quand on leur parle), de trois quarts en avançant vers le joueur (se), de trois quarts en s'éloignant (ne) ; le
// miroir donne les deux autres directions de marche. Quatre silhouettes (enfant, mince, costaud, ancien), sept
// coiffures, barbe, moustache, lunettes ; la tenue et l'outil de leur métier. La troupe de la bible (HISTOIRE.md § 8.2 et
// § 14) ajoute ses pièces : foulard, châle, cape de feuilles, bottes, pieds nus, loupes, barbe de lichen, taches de
// rousseur, peintures, brindilles, cuillère dans le chignon, mèche rebelle, crayon, et un petit sceau doré brodé.
// Poses : marche (4 images : jambes, bras opposés, petit rebond), repos (2 images, clignement), travail (2 images,
// l'outil va et vient), salut de la main (2 images). Le soir une lanterne, sous la pluie un parapluie.
// Ancrage aux pieds, cadre serré (images gardées à 4×). Repère de la tête : centre (0, 0), rayon 6,6, mis à l'échelle.
import { sprite } from './iso';

const f2 = n => Math.round(n * 100) / 100;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const ln = (a, b, color, w = 1, extra = '') => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"${extra}/>`;
const OUT = ' stroke="rgba(60,40,25,.35)" stroke-width="0.5"';
const shade = (hex, k) => `#${[1, 3, 5].map(i => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k)).toString(16).padStart(2, '0')).join('')}`;
export const VILLAGER_BOX = { x: -19, y: -50, w: 38, h: 53 };
export const VIEWS = ['front', 'se', 'ne'];

// Couleurs possibles : peau, cheveux
export const SKINS = ['#F6D3B3', '#E9B98F', '#C98B5E', '#8D5A3B', '#F2C9A0', '#6B4430'];
export const HAIRS = ['#3A2A1E', '#7A4E2C', '#C9873E', '#E8C46A', '#B94E3A', '#2E2E3A', '#D9D4CC', '#8A8F98'];
export const STYLES = ['short', 'long', 'bun', 'curly', 'ponytail', 'bald', 'braids'];
// Silhouettes : rayon de tête, hauteur et largeur du buste, longueur des jambes et des bras, épaisseur des membres,
// dos voûté (décalage de la tête vers l'avant)
export const BUILDS = {
  child: { head: 6.1, torso: 6.6, width: 8.2, legs: 4.8, arm: 5.4, limb: 2.2, stoop: 0 },
  slim: { head: 6.3, torso: 9, width: 9, legs: 7, arm: 7.2, limb: 2.4, stoop: 0 },
  broad: { head: 6.5, torso: 9.4, width: 11.6, legs: 6.6, arm: 7.4, limb: 2.9, stoop: 0 },
  elder: { head: 6.3, torso: 8.4, width: 9.8, legs: 6, arm: 6.8, limb: 2.4, stoop: 1.4 }
};
// Une tenue par membre de la troupe (haut, bas, chapeau, outil, coiffure, silhouette, poils, tablier, pièces de la
// bible) ; skin et hair, quand ils y sont, l'emportent sur ceux tirés au hasard (village.js)
export const ROLES = {
  // Mélisse : chapeau de paille fleuri, châle de nuit brodé de lunes, sabots, boîte à graines
  potager: { label: 'Jardinière des lunes', top: '#7EC45B', bottom: '#6B4A2E', hat: 'flowerStraw', tool: 'tin', style: 'long', build: 'slim', shawl: '#2E3A6B', shoes: '#A0703F', seal: true },
  // Galet : tout petit, peau de granit, barbe de lichen, bonnet de laine troué, maillet
  carriere: { label: 'Tailleur de runes', top: '#7E8A6E', bottom: '#4F5660', hat: 'wool', tool: 'mallet', style: 'short', build: 'elder', shape: { head: 6.1, torso: 6.4, legs: 4, width: 10 }, beard: 'lichen', skin: '#CDBFAE', hair: '#A3A893', seal: true },
  // Sylve : cape de feuilles, brindilles et plume, traits verts sur les joues, pieds nus, fagot de bois mort
  bosquet: { label: 'Gardienne des bois', top: '#6E9A4A', bottom: '#6B4A2E', hat: null, tool: 'fagot', style: 'long', build: 'slim', cape: '#4E7A36', twigs: true, paint: true, barefoot: true, seal: true },
  // Ondin : dix ans, ciré bleu, bonnet de nuit, pieds nus, baguette de sourcier
  puits: { label: 'Petit sourcier', top: '#3E78C8', bottom: '#5E616B', hat: 'nightcap', tool: 'dowsing', style: 'curly', build: 'child', barefoot: true, seal: true },
  // Aster : ciré jaune, foulard rouge, longue-vue, taches de rousseur, bottes trop grandes
  ponton: { label: 'Navigatrice', top: '#F2C04B', bottom: '#2F5684', hat: null, tool: 'spyglass', style: 'ponytail', build: 'slim', neckerchief: '#D9443A', freckles: true, boots: true, shoes: '#2F3A4A', seal: true },
  // Rivet : lunettes à loupes, mèche grise rebelle, crayon sur l'oreille, tablier de cuir à poches
  atelier: { label: 'Horloger-artificier', top: '#9C6A44', bottom: '#3D3A36', hat: null, tool: 'windkey', style: 'short', build: 'slim', apron: '#7A4E2C', pockets: true, loupes: true, lock: true, pencil: true, hair: '#C4C0B8', seal: true },
  // Cannelle : grande et ronde, chignon piqué d'une cuillère, tablier taché, joues rouges, louche de cuivre
  foyer: { label: 'Cuisinière-guérisseuse', top: '#FFFFFF', bottom: '#B9503B', hat: null, tool: 'ladle', style: 'bun', build: 'broad', apron: '#F4EEDC', stains: true, spoon: true, blush: true, seal: true }
};

/* ---------- Tête : cheveux, visage, poils, chapeau (repère de la tête) ---------- */
// Chemin ou cercles dans le repère de la tête (centre 0,0 ; rayon 6,6), placés en (hx, hy) à l'échelle k
function headPart(hx, hy, k, body) {
  return `<g transform="translate(${f2(hx)} ${f2(hy)}) scale(${f2(k)})">${body}</g>`;
}
const circles = (pts, r, color) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join('');
// Masse de cheveux sur le crâne, selon la vue
const SKULL = {
  front: 'M-6.9,0.6 Q-7.3,-7.8 0,-7.6 Q7.3,-7.8 6.9,0.6 Q5.6,-4 1.2,-3.8 Q-2.4,-5 -6.9,0.6 Z',
  se: 'M-6.9,2.4 Q-7.8,-7.6 0.8,-7.8 Q7,-7.6 6.9,-2.4 Q5.8,-4.8 3.6,-4.1 Q1.6,-4.9 -0.4,-3.5 Q-1.2,0.2 -2.4,2.2 Q-4.8,3 -6.9,2.4 Z',
  ne: 'M-6.9,0.4 Q-7.4,-8.2 0,-8 Q7.2,-8.2 6.9,0.2 Q6.6,4 2,5 Q-6.2,4.6 -6.9,0.4 Z'
};
function hairOf(style, color, view) {
  const dark = shade(color, 0.82);
  if (style === 'bald') {
    if (view === 'front') return `<path d="M-6.8,-1 Q-7.4,2.4 -5.8,3.6 L-5.6,0 Z M6.8,-1 Q7.4,2.4 5.8,3.6 L5.6,0 Z" fill="${color}"/>`;
    if (view === 'se') return `<path d="M-6.8,-1.6 Q-7.2,3.4 -4,5 Q-5,1.6 -4.6,-1.2 Z" fill="${color}"/>`;
    return `<path d="M-6.9,0 Q-6.4,4.6 0,5.4 Q6.4,4.6 6.9,0 Q3.6,2.6 0,2.6 Q-3.6,2.6 -6.9,0 Z" fill="${color}"/>`;
  }
  let out = `<path d="${SKULL[view]}" fill="${color}"${OUT}/>`;
  if (view === 'se') out += `<path d="M-6.9,1.2 Q-6.6,4.6 -3.4,5.6 Q-4.6,2.4 -4.1,-0.4 Z" fill="${dark}"/>`;
  if (style === 'long') {
    if (view === 'front') out += `<path d="M-6.9,-0.4 Q-8,6.6 -6,9 L-4.6,7.6 Q-5.8,3.6 -5.4,-0.4 Z M6.9,-0.4 Q8,6.6 6,9 L4.6,7.6 Q5.8,3.6 5.4,-0.4 Z" fill="${color}"/>`;
    else if (view === 'se') out += `<path d="M-6.9,0 Q-8.4,7.4 -4.8,10 Q-3.6,6 -4,1.4 Z" fill="${color}"/>`;
    else out += `<path d="M-6.9,0 Q-7.8,8.8 0,10.4 Q7.6,8.8 6.9,0 Z" fill="${color}"${OUT}/>`;
  } else if (style === 'bun') {
    const at = { front: [0, -8.8], se: [-3.4, -7.4], ne: [-0.6, -6.6] }[view];
    out += `<circle cx="${at[0]}" cy="${at[1]}" r="2.8" fill="${color}"${OUT}/>`;
  } else if (style === 'curly') {
    out += circles({
      front: [[-6, -3.4], [-3, -7], [1, -7.8], [4.6, -6], [6.4, -2.4]],
      se: [[-6.6, -0.6], [-5.6, -4.6], [-2.6, -7.4], [1.4, -7.8], [4.6, -6]],
      ne: [[-6.4, -2], [-4.4, -6], [0, -7.8], [4.4, -6], [6.4, -2], [-5, 2.6], [5, 2.6], [0, 4]]
    }[view], 2.3, color);
  } else if (style === 'ponytail') {
    if (view === 'se') out += `<path d="M-5.6,-3.4 Q-11,-1.4 -9.6,5.4 Q-7.6,2.2 -5,0.4 Z" fill="${color}"${OUT}/>`;
    else if (view === 'ne') out += `<path d="M-1.4,1 Q-2.4,7.4 0.6,10 Q2.4,6.2 1.8,1 Z" fill="${color}"${OUT}/>`;
    else out += ell(0, -7.2, 2.2, 1.4, dark);
  } else if (style === 'braids') {
    const braid = (x, y, len) => Array.from({ length: len }, (_, i) => `<circle cx="${x}" cy="${f2(y + i * 2.2)}" r="${f2(1.6 - i * 0.12)}" fill="${color}"${OUT}/>`).join('');
    if (view === 'front') out += braid(-6.2, 1.6, 4) + braid(6.2, 1.6, 4);
    else if (view === 'se') out += braid(-5.8, 2, 4);
    else out += braid(-3.4, 3.8, 4) + braid(3.4, 3.8, 4);
  }
  return out;
}
// Ce qui pend derrière la tête de trois quarts, du côté de l'œil du fond (dessiné avant la tête : seul ce qui dépasse
// du contour se voit) : la mèche des cheveux longs, la tresse du fond
function hairBackOf(style, color, view) {
  if (view !== 'se') return '';
  if (style === 'long') return `<path d="M4.6,-4.6 Q9.2,0.4 7.4,9.6 Q6.2,6.4 5.4,2 Z" fill="${color}"${OUT}/>`;
  if (style === 'braids') return [0, 1, 2].map(i => `<circle cx="${f2(6.9 + i * 0.1)}" cy="${f2(3.4 + i * 2.2)}" r="${f2(1.5 - i * 0.12)}" fill="${color}"${OUT}/>`).join('');
  return '';
}
// Visage selon la vue : yeux (fermés au clignement), joues, bouche, nez de profil. De trois quarts, les traits glissent
// vers le côté où l'on regarde et l'autre joue s'ombre ; de dos, rien (l'oreille vient par-dessus les cheveux : earOf)
// Les deux yeux de trois quarts (x dans le repère de la tête) : partout les mêmes (lunettes, loupes, joues)
const SE_EYES = [0.5, 3.9];
function faceOf(view, skin, blink) {
  const eye = (x, rx) => (blink ? ln([x - 0.9, 0.6], [x + 0.9, 0.6], '#2A2420', 0.75) : ell(x, 0.6, rx, 1.15, '#2A2420') + `<circle cx="${f2(x + 0.3)}" cy="0.2" r=".32" fill="#FFFFFF"/>`);
  if (view === 'ne') return '';
  // De trois quarts (vers la droite) : l'œil de devant, puis celui du fond, un peu plus étroit et toujours dégagé du
  // contour (rien ne passe devant lui : cheveux, verres, outils), le nez sur le contour, la bouche entre les deux
  if (view === 'se') {
    return `<path d="M-2.6,-6.1 Q-7.4,-3 -6,3.6 Q-4.2,6.6 -1.4,6.5 Q-5,3 -2.6,-6.1 Z" fill="rgba(0,0,0,.05)"/>`
      + eye(SE_EYES[0], 0.82) + eye(SE_EYES[1], 0.66)
      + `<circle cx="-1.3" cy="2.9" r="1.05" fill="rgba(240,120,120,.35)"/><circle cx="5" cy="3" r=".62" fill="rgba(240,120,120,.3)"/>`
      + `<path d="M6.35,0.7 Q7.9,1.6 6.45,2.6" fill="${skin}" stroke="rgba(60,40,25,.45)" stroke-width=".45"/>`
      + `<path d="M1.6,3.7 Q2.8,4.4 4,3.6" fill="none" stroke="#7A4030" stroke-width=".5" stroke-linecap="round"/>`;
  }
  return eye(-2.3, 0.8) + eye(2.3, 0.8)
    + `<circle cx="-3.8" cy="2.4" r="1.1" fill="rgba(240,120,120,.35)"/><circle cx="3.8" cy="2.4" r="1.1" fill="rgba(240,120,120,.35)"/>`
    + `<path d="M-1,3 Q0,3.8 1,3" fill="none" stroke="#7A4030" stroke-width=".5" stroke-linecap="round"/>`;
}
// Oreille (et bout de joue de dos), par-dessus les cheveux
function earOf(view, skin) {
  if (view === 'ne') return `<path d="M5.2,-1.8 Q7.2,0.8 5.6,4 Q4.6,1.2 5.2,-1.8 Z" fill="${skin}"/>` + ell(5.9, 0.8, 1.1, 1.7, skin, OUT);
  if (view === 'se') return ell(-3.1, 1, 1.15, 1.7, skin, OUT) + `<path d="M-3.4,0.1 Q-2.6,1 -3.3,1.9" fill="none" stroke="rgba(120,70,50,.45)" stroke-width=".4"/>`;
  return '';
}
// Barbe, moustache, lunettes ; marques du visage (rousseur, joues rouges, peintures) ; loupes ; barbe de lichen qui
// descend jusqu'à la ceinture (length : de la bouche à la ceinture, dans le repère de la tête)
function extrasOf(look, view, length = 12) {
  if (view === 'ne') return '';
  let out = '';
  const cheeks = view === 'se' ? [[-1.3, 2.9, 1], [5, 3, 0.6]] : [[-3.8, 2.4, 1], [3.8, 2.4, 1]];
  if (look.blush) out += cheeks.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${f2(1.5 * r)}" fill="rgba(226,84,84,.5)"/>`).join('');
  if (look.freckles) out += cheeks.map(([x, y, r]) => [[-0.7, -0.3], [0.2, 0.3], [0.8, -0.4]].map(([a, b]) => `<circle cx="${f2(x + a * r)}" cy="${f2(y + b)}" r=".28" fill="#B0643A"/>`).join('')).join('');
  if (look.paint) out += cheeks.map(([x, y, r]) => ln([x - 0.9 * r, y - 0.5], [x + 0.9 * r, y - 0.9], '#4E9A3A', 0.5) + ln([x - 0.9 * r, y + 0.4], [x + 0.9 * r, y], '#4E9A3A', 0.5)).join('');
  if (look.beard === 'lichen') {
    const L = f2(length);
    const tuft = (x, y) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="1.3" fill="${shade(look.hair, 0.86)}"/>`;
    out += view === 'se'
      ? `<path d="M-2.2,2 Q-3,${f2(length * 0.6)} 1.6,${L} Q6.2,${f2(length * 0.62)} 6.4,1.4 Q4.8,4.4 2.4,4.2 Q0,4.4 -2.2,2 Z" fill="${look.hair}"${OUT}/>` + tuft(1.2, length * 0.55) + tuft(3.4, length * 0.8)
      : `<path d="M-5.2,1.6 Q-6,${f2(length * 0.55)} -2.6,${f2(length * 0.9)} Q-1.2,${L} 0,${f2(length * 0.92)} Q1.2,${L} 2.6,${f2(length * 0.9)} Q6,${f2(length * 0.55)} 5.2,1.6 Q3.4,4.6 0,4.6 Q-3.4,4.6 -5.2,1.6 Z" fill="${look.hair}"${OUT}/>`
        + tuft(-2.2, length * 0.5) + tuft(1.8, length * 0.66) + tuft(-0.6, length * 0.82);
  }
  if (look.beard === 'full') {
    out += view === 'se'
      ? `<path d="M-2.4,2 Q-2.4,7 2.8,7.8 Q7.2,5.8 6.4,1.2 Q5,4.4 2.6,4.4 Q0,4.6 -2.4,2 Z" fill="${look.hair}"${OUT}/>`
      : `<path d="M-5.2,1.6 Q-5.6,6.6 0,8 Q5.6,6.6 5.2,1.6 Q3.4,4.6 0,4.6 Q-3.4,4.6 -5.2,1.6 Z" fill="${look.hair}"${OUT}/>`;
  }
  if (look.beard === 'full' || look.beard === 'mustache') {
    out += view === 'se'
      ? `<path d="M0.4,3.3 Q2.7,2.4 4.9,3.3 Q2.7,4.1 0.4,3.3 Z" fill="${shade(look.hair, 0.85)}"/>`
      : `<path d="M-2.6,2.9 Q0,1.8 2.6,2.9 Q0,3.7 -2.6,2.9 Z" fill="${shade(look.hair, 0.85)}"/>`;
  }
  if (look.glasses) {
    // Des verres fins, sans teinte : l'œil reste net au travers ; de trois quarts, celui du fond se rétrécit
    const lens = (x, rx) => ell(x, 0.6, rx, 1.55, 'none', ' stroke="#3D3A36" stroke-width=".45"');
    const [a, b] = SE_EYES;
    out += view === 'se'
      ? lens(a, 1.55) + lens(b, 1.05) + ln([a + 1.55, 0.3], [b - 1.05, 0.3], '#3D3A36', 0.45) + ln([a - 1.55, 0.3], [-2.6, 0.6], '#3D3A36', 0.45)
      : lens(-2.3, 1.55) + lens(2.3, 1.55) + ln([-0.75, 0.3], [0.75, 0.3], '#3D3A36', 0.45);
  }
  if (look.loupes) {
    // Lunettes d'horloger : deux verres cerclés de laiton, et une loupe épaisse devant l'œil droit (celui de devant de
    // trois quarts) qui le grossit : on le voit, plus grand, au travers. L'autre œil reste dégagé
    const ring = (x, rx, ry, w = 0.55) => ell(x, 0.6, rx, ry, 'none', ` stroke="#B08A3A" stroke-width="${w}"`);
    const loupe = x => ell(x, 0.6, 2.05, 2.05, '#FFF6E6', ' stroke="#8A6A2A" stroke-width=".7"')
      + ell(x, 0.6, 1.2, 1.7, '#2A2420') + `<circle cx="${f2(x + 0.45)}" cy="0" r=".5" fill="#FFFFFF"/>`
      + ell(x, 0.6, 2.05, 2.05, 'rgba(200,230,255,.18)') + `<path d="M${f2(x - 1.2)},-0.6 Q${f2(x - 0.6)},-1.2 ${f2(x + 0.2)},-1.3" fill="none" stroke="rgba(255,255,255,.7)" stroke-width=".35" stroke-linecap="round"/>`;
    const [a, b] = SE_EYES;
    out += view === 'se'
      ? ring(b, 1.05, 1.55) + ln([a + 2.05, 0.3], [b - 1.05, 0.3], '#B08A3A', 0.45) + ln([a - 2.05, 0.3], [-2.6, 0.6], '#B08A3A', 0.45) + loupe(a)
      : ring(2.3, 1.55, 1.55) + ln([-0.25, 0.3], [0.75, 0.3], '#B08A3A', 0.45) + loupe(-2.3);
  }
  return out;
}
// Ce que la coiffure porte (repère de la tête, après les cheveux, sous le chapeau) : cuillère piquée dans le chignon,
// brindilles et plume, mèche rebelle, crayon sur l'oreille
function hairBitsOf(look, view) {
  let out = '';
  if (look.spoon) {
    const [x, y] = { front: [0, -8.8], se: [-3.4, -7.4], ne: [-0.6, -6.6] }[view];
    out += ln([x - 3, y + 1.6], [x + 3, y - 2.2], '#B4BEC8', 0.7) + ell(x + 3.4, y - 2.5, 1, 0.65, '#B4BEC8', ' transform="rotate(-30 ' + f2(x + 3.4) + ' ' + f2(y - 2.5) + ')"');
  }
  if (look.twigs) {
    const twig = (x, y, a) => ln([x, y], [x + Math.cos(a) * 1.8, y + Math.sin(a) * 1.8], '#7A5230', 0.45) + ln([x + Math.cos(a) * 0.9, y + Math.sin(a) * 0.9], [x + Math.cos(a - 0.8) * 1.6, y + Math.sin(a - 0.8) * 1.6], '#7A5230', 0.35);
    const spots = view === 'ne' ? [[-3.6, -4.6, -2.6], [2.4, -5.6, -0.6], [-0.6, -1.6, 0.4]] : [[-4.6, -5, -2.8], [2.6, -6.4, -0.4], [5.6, -5.2, -0.3]];
    out += spots.map(([x, y, a]) => twig(x, y, a)).join('');
    // La plume, couchée au-dessus de l'oreille
    const [px, py, rot] = view === 'se' ? [-4.6, -2.6, -70] : view === 'ne' ? [5.2, -2.8, 60] : [-5.4, -2.4, -60];
    out += `<g transform="rotate(${rot} ${px} ${py})"><path d="M${px},${py} Q${f2(px - 1.6)},${f2(py - 2.6)} ${px},${f2(py - 5.2)} Q${f2(px + 1.6)},${f2(py - 2.6)} ${px},${py} Z" fill="#F4EEDC" stroke="#8C6A46" stroke-width=".3"/>`
      + ln([px, py + 0.6], [px, py - 4.6], '#8C6A46', 0.3) + `<path d="M${f2(px - 0.9)},${f2(py - 3.4)} L${f2(px + 0.9)},${f2(py - 3.4)}" stroke="#C9473A" stroke-width=".5"/></g>`;
  }
  if (look.lock) {
    const [x, y] = view === 'se' ? [1.6, -7.2] : view === 'ne' ? [0.4, -7.6] : [0.8, -7.2];
    out += `<path d="M${f2(x - 0.6)},${f2(y + 0.4)} Q${f2(x - 0.4)},${f2(y - 3)} ${f2(x + 1.8)},${f2(y - 3.2)} Q${f2(x + 3)},${f2(y - 2.4)} ${f2(x + 2)},${f2(y - 1.4)}" fill="none" stroke="${shade(look.hair, 0.8)}" stroke-width=".9" stroke-linecap="round"/>`;
  }
  if (look.pencil && view !== 'ne') {
    const [x, y] = view === 'se' ? [-3.4, -1.6] : [6.4, -1.4];
    out += `<g transform="rotate(${view === 'se' ? -30 : 30} ${x} ${y})"><rect x="${f2(x - 0.5)}" y="${f2(y - 2.6)}" width="1" height="5.2" fill="#F2C04B" stroke="rgba(60,40,25,.4)" stroke-width=".25"/><path d="M${f2(x - 0.5)},${f2(y + 2.6)} L${x},${f2(y + 3.6)} L${f2(x + 0.5)},${f2(y + 2.6)} Z" fill="#E8C9A0"/></g>`;
  }
  return out;
}
// Couvre-chefs (repère de la tête)
function hatOf(kind, view) {
  const back = view === 'ne';
  const dx = view === 'se' ? 0.5 : 0;
  switch (kind) {
    case 'straw': return ell(dx, -4.6, 10, 2.6, '#E8C46A', OUT) + `<path d="M${-5.6 + dx},-4.8 Q${-5.4 + dx},-10 ${dx},-10.2 Q${5.4 + dx},-10 ${5.6 + dx},-4.8 Z" fill="#F2D27E"${OUT}/>` + `<rect x="${-5.6 + dx}" y="-6" width="11.2" height="1.4" fill="#C9473A"/>`;
    case 'helmet': return `<path d="M-7.2,-2.4 Q-7,-9.8 0,-10 Q7,-9.8 7.2,-2.4 Z" fill="#F2C04B"${OUT}/>` + ell(dx, -2.4, 8, 1.4, '#D9A52E') + (back ? '' : `<circle cx="${view === 'se' ? 3.4 : 0}" cy="-6.4" r="1.6" fill="#FFF4C0" stroke="#8E6A2A" stroke-width=".5"/>`);
    case 'beanie': return `<path d="M-7,-2 Q-7,-9.6 0,-9.8 Q7,-9.6 7,-2 Z" fill="#4F5A72"${OUT}/>` + `<rect x="-7.2" y="-3.4" width="14.4" height="2.2" rx="1" fill="#3E4760"/>` + `<circle cx="${view === 'se' ? -1 : 0}" cy="-10.2" r="1.8" fill="#E8DCC4"/>`;
    case 'scarf': return `<path d="M-7.2,-0.4 Q-7.6,-9 0,-9.2 Q7.6,-9 7.2,-0.4 Q4,-3.4 0,-3.4 Q-4,-3.4 -7.2,-0.4 Z" fill="#E2574C"${OUT}/>` + (view !== 'front' ? `<path d="M-5.4,2.6 L-8,7.6 L-4,5.8 Z" fill="#E2574C"/>` : '') + `<circle cx="-3" cy="-5.8" r=".7" fill="#FFF4E0"/><circle cx="2.4" cy="-7" r=".7" fill="#FFF4E0"/>`;
    case 'bucket': return `<path d="M-6.4,-3.4 L-5.4,-8.8 Q0,-10 5.4,-8.8 L6.4,-3.4 Z" fill="#6E7F3E"${OUT}/>` + ell(dx, -3.4, 8.6, 1.8, '#5A6A32');
    case 'toque': return `<rect x="-5" y="-8" width="10" height="4.6" fill="#FFFFFF"${OUT}/>` + [-3.4, 0, 3.4].map(x => `<circle cx="${x}" cy="-9.4" r="2.8" fill="#FFFFFF"${OUT}/>`).join('');
    case 'cap': return `<path d="M-6.8,-2.6 Q-6.8,-9.2 0,-9.4 Q6.8,-9.2 6.8,-2.6 Z" fill="#3E78C8"${OUT}/>`
      + (view === 'front' ? ell(0, -2.6, 6, 1.6, '#2F5E9E') : view === 'se' ? `<path d="M3,-3.6 Q10,-4.2 10.6,-2.2 Q6,-1.8 3,-2.4 Z" fill="#2F5E9E"/>` : '');
    case 'nightcap': {
      // Bonnet de nuit rayé : un dôme, et sa pointe qui retombe sur le côté (de dos, de l'autre côté), pompon au bout
      const m = back ? -1 : 1;
      return `<path d="M${f2(-1 * m)},-9.6 Q${f2(7 * m)},-13.4 ${f2(9.4 * m)},-5.4 Q${f2(6.2 * m)},-9.6 ${f2(3.4 * m)},-8.4 Z" fill="#5E92C8"${OUT}/>`
        + `<path d="M-7,-2.6 Q-7.4,-10.6 0,-10.4 Q7.4,-10.6 7,-2.6 Z" fill="#6FA3D9"${OUT}/>`
        + `<path d="M-3.4,-10 Q-3.2,-6 -3.4,-2.8 M2.4,-10.1 Q2.8,-6.4 2.6,-2.8" fill="none" stroke="#F4EEDC" stroke-width=".9"/>`
        + `<rect x="-7.3" y="-3.6" width="14.6" height="2" rx="1" fill="#F4EEDC"/>` + `<circle cx="${f2(9.4 * m)}" cy="-5.4" r="1.6" fill="#F4EEDC"${OUT}/>`;
    }
    case 'wool': return `<path d="M-7,-2 Q-7.2,-10.2 0,-10.4 Q7.2,-10.2 7,-2 Z" fill="#9C5A3C"${OUT}/>` + `<rect x="-7.2" y="-3.6" width="14.4" height="2.4" rx="1" fill="#80482E"/>`
      + [-4.6, -2.3, 0, 2.3, 4.6].map(x => ln([x, -3.4], [x, -1.4], '#6A3A24', 0.35)).join('')
      // Le trou dans la laine : on voit les cheveux
      + ell(back ? -2.4 : 2.6, -7.4, 1.3, 0.9, shade('#A3A893', 0.8), ' stroke="#6A3A24" stroke-width=".35"');
    case 'flowerStraw': return hatOf('straw', view)
      + [[-5.6, '#E8879C'], [-3.8, '#B48AE0'], [3.8, '#F2C04B'], [5.6, '#E8879C']].map(([x, c]) => `<circle cx="${f2(x + dx)}" cy="-5.4" r=".95" fill="${c}"/><circle cx="${f2(x + dx)}" cy="-5.4" r=".35" fill="#FFF4E0"/>`).join('');
    case 'hood': return `<path d="M-7.8,3.4 Q-8.6,-10 0,-10.6 Q8.6,-10 7.8,3.4 Q5.6,-4.6 0,-4.8 Q-5.6,-4.6 -7.8,3.4 Z" fill="#6A5A8C"${OUT}/>`;
    default: return '';
  }
}

/* ---------- Outils et accessoires (tenus par la main de devant ; ancrage de la main en (6,5 ; −8,5)) ---------- */
// Au repos, un outil long penche vers l'extérieur ; au travail, il va vers l'avant : jamais devant le visage
function toolOf(kind, up) {
  const a = up ? -1 : 0;
  switch (kind) {
    case 'can': return `<g transform="rotate(${up ? -30 : 0} 7 -9)">` + `<path d="M5,-11 L10,-11 L10,-6 L5,-6 Z" fill="#7FA6B8"${OUT}/>` + ln([10, -10], [13.5, -12.6], '#7FA6B8', 1.2) + `<path d="M6,-12 Q7.5,-14.4 9,-12" fill="none" stroke="#5E7F90" stroke-width=".9"/></g>` + (up ? [0, 1, 2].map(k => `<circle cx="${14 + k * 0.6}" cy="${-11 + k * 2}" r=".6" fill="#86C6E6"/>`).join('') : '');
    case 'pick': return `<g transform="rotate(${up ? 50 : 18} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -21], '#8B5631', 1.3) + `<path d="M1.4,-20.4 Q6.5,-24 11.6,-20.4 Q6.5,-22 1.4,-20.4 Z" fill="#8E99A4" stroke="#5A636C" stroke-width=".6"/></g>`;
    case 'axe': return `<g transform="rotate(${up ? 50 : 18} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -20], '#A9703F', 1.3) + `<path d="M6.5,-20 L10.6,-21.4 Q11.6,-18 10.6,-15.6 L6.5,-17 Z" fill="#B4BEC8" stroke="#68737E" stroke-width=".6"/></g>`;
    case 'bucket': return `<path d="M3.8,${-6 + a} L9.4,${-6 + a} L8.6,${-0.8 + a} L4.6,${-0.8 + a} Z" fill="#B98552"${OUT}/>` + `<path d="M4,${-6 + a} Q6.6,${-10.6 + a} 9.2,${-6 + a}" fill="none" stroke="#5E3A22" stroke-width=".7"/>` + ell(6.6, -5.9 + a, 2.6, 0.7, '#86C6E6');
    case 'rod': return up
      ? ln([6.5, -9], [15, -34], '#8B5631', 0.9) + `<path d="M15,-34 Q18,-24 16,-12" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`
      : ln([6.5, -9], [12, -30], '#8B5631', 0.9) + `<path d="M12,-30 Q14,-20 13,-14" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`;
    case 'hammer': return `<g transform="rotate(${up ? 55 : 20} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -17], '#8B5631', 1.3) + `<rect x="3.4" y="-19.6" width="6.2" height="3" rx=".6" fill="#68737E"/></g>`;
    case 'ladle': return `<g transform="rotate(${up ? 42 : 20} 6.5 -8.5)">` + ln([6.5, -8.5], [8.8, -18.4], '#C87533', 1.1) + ell(9.4, -19.2, 2.4, 1.6, '#C87533', ' stroke="#8A4A1E" stroke-width=".5"') + ell(9.4, -19.6, 1.6, 0.7, '#E09A5A') + `</g>`;
    case 'spyglass': return `<g transform="rotate(${up ? 14 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [10.4, -13.6], '#C9A043', 1.6) + ln([10.2, -13.4], [13.4, -17.6], '#D9B85A', 2.1)
      + ln([12.9, -16.9], [13.9, -18.3], '#8A6A2A', 2.3) + ln([8.3, -10.9], [8.9, -11.7], '#8A6A2A', 1.8) + `</g>`;
    case 'dowsing': {
      // Baguette de noisetier fourchue : les deux branches dans la main, la pointe en avant ; au travail, elle plonge
      const tip = up ? [14.6, -4.4] : [15, -11.4];
      return ln([6.5, -8.5], [10.6, -9.6], '#9A6A3A', 0.8) + ln([6.5, -7.4], [10.6, -9.6], '#8A5A2E', 0.8) + ln([10.6, -9.6], tip, '#9A6A3A', 0.9)
        + (up ? `<circle cx="${tip[0]}" cy="${tip[1] + 1.2}" r=".5" fill="#86C6E6"/>` : '');
    }
    case 'fagot': return `<g transform="rotate(${up ? -12 : 0} 6.5 -8.5)">` + [[-0.9, '#8B5631'], [0, '#A9703F'], [0.9, '#7A4A28']].map(([d, c]) => ln([2.6, -6.6 + d], [12.6, -10.4 + d], c, 0.9)).join('')
      + ln([7.2, -10.2], [7.8, -6.8], '#C8A86A', 0.7) + ln([11.6, -10.6], [13.4, -12.6], '#8B5631', 0.5) + `<circle cx="13.6" cy="-12.8" r=".7" fill="#7EC45B"/></g>`;
    case 'mallet': return `<g transform="rotate(${up ? 55 : 22} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -15.6], '#8B5631', 1.2) + `<rect x="3.6" y="-18.6" width="5.8" height="3.4" rx="1.4" fill="#A9703F"${OUT}/></g>`;
    case 'windkey': return `<g transform="rotate(${up ? 40 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [10.4, -12.4], '#C9A043', 0.9)
      + ell(6.2, -8.2, 1.9, 1, '#D9B85A', ' stroke="#8A6A2A" stroke-width=".35" transform="rotate(45 6.2 -8.2)"') + `<rect x="9.8" y="-13.4" width="1.6" height="1.6" fill="#8A6A2A" transform="rotate(45 10.6 -12.6)"/></g>`;
    case 'tin': return `<rect x="3.6" y="${-8.6 + a * 2}" width="6.2" height="4.4" rx=".6" fill="#8E99A4"${OUT}/>` + `<rect x="3.4" y="${-9.4 + a * 2}" width="6.6" height="1.3" rx=".4" fill="#6E7884"/>`
      + `<circle cx="6.7" cy="${-6.4 + a * 2}" r=".8" fill="#E8C46A"/>` + (up ? [0, 1, 2].map(k => `<circle cx="${f2(10.6 + k * 0.5)}" cy="${f2(-8 + k * 1.8)}" r=".4" fill="#6B4A2E"/>`).join('') : '');
    case 'staff': return ln([6.5, -8.5], [7.4, 4], '#8B5631', 1.2) + ln([6.5, -8.5], [6, -12], '#8B5631', 1.2);
    case 'book': return `<g transform="rotate(${up ? -14 : 0} 6.5 -8.5)"><rect x="4.4" y="-12" width="5" height="6.4" rx=".6" fill="#7A3E8C"${OUT}/><rect x="5" y="-11.4" width="3.8" height="5.2" fill="#F4EEDC"/></g>`;
    case 'basket': return `<path d="M3.6,-7.6 L9.6,-7.6 L8.8,-3.4 L4.4,-3.4 Z" fill="#C8893E"${OUT}/>` + `<path d="M4,-7.6 Q6.6,-12 9.2,-7.6" fill="none" stroke="#7A5230" stroke-width=".8"/>` + `<circle cx="5.6" cy="-8.2" r="1.2" fill="#E2483A"/><circle cx="7.6" cy="-8.4" r="1.1" fill="#8FCB6A"/>`;
    default: return '';
  }
}
const at = (x, y, body) => `<g transform="translate(${f2(x)} ${f2(y)})">${body}</g>`;

/* ---------- Le personnage ---------- */
// look : { skin, hair, style, top, bottom, hat, tool, apron, build, shape, beard, glasses, shoes, pack, et les pièces de
// la troupe : neckerchief, shawl, cape, boots, barefoot, freckles, blush, paint, loupes, twigs, spoon, lock, pencil,
// stains, pockets, seal } ; shape : mesures qui remplacent celles de la silhouette (Galet, tout petit) ;
// view : front | se | ne (back : ancien nom de ne) ; pose : walk | idle | work | wave ; frame : 0 à 3 (marche) ou 0 à 1
export function villagerSprite(look, { pose = 'idle', view, back = false, frame = 0, lantern = false, umbrella = false } = {}) {
  const v = view || (back ? 'ne' : 'front');
  const S = { ...(BUILDS[look.build] || BUILDS.slim), ...(look.shape || {}) };
  const k = S.head / 6.6;
  const hipY = -S.legs;
  const topY = hipY - S.torso;
  // De trois quarts, le buste paraît plus étroit
  const w = S.width * (v === 'front' ? 1 : 0.9);
  const walking = pose === 'walk';
  const f = walking ? frame % 4 : frame % 2;
  // Marche : appui (0, 2), passage (1, 3) ; le pied de devant avance, l'autre recule ; le corps monte au passage
  const swing = walking ? [2.2, 0, -2.2, 0][f] : 0;
  const lift = walking ? [0, 0.9, 0, 0.9][f] : 0;
  const bob = walking && f % 2 ? -0.7 : 0;
  const lean = v === 'ne' ? -1 : 1;
  const shoes = look.barefoot ? shade(look.skin, 0.94) : look.shoes || '#4A3426';
  const dark = shade(look.bottom, 0.78);
  // Pieds : vers la droite (se, ne) ; de face, côte à côte
  // Bottes trop grandes : le pied s'allonge et une tige monte sur le mollet
  const big = look.boots ? 1.3 : 1;
  const foot = (x, y, color) => ell(x + (v === 'front' ? 0 : 1) * big, y - 0.5, (v === 'front' ? 1.8 : 2.3) * big, 1.05 * big, color);
  const boot = (fx, fy) => (look.boots ? ln([fx, fy - 0.9], [fx, fy - 3.2], shoes, S.limb + 0.7) : '');
  const leg = (hx, fx, fy, color) => ln([hx, hipY + 0.6], [fx, fy - 0.9], color, S.limb) + boot(fx, fy) + foot(fx, fy, shoes);
  let legs;
  if (v === 'front') {
    legs = leg(-1.9, -2 - swing * 0.2, 0, look.bottom) + leg(1.9, 2 + swing * 0.2, 0, dark);
  } else {
    // Jambe de derrière (plus sombre) puis jambe de devant ; « devant » = vers la droite
    const dir = v === 'ne' ? -0.3 : 0.3;
    const backX = -swing;
    const frontX = swing;
    legs = leg(-0.9, -0.9 + backX, backX * dir - (f === 1 ? lift : 0), dark) + leg(1.1, 1.1 + frontX, frontX * dir - (f === 3 ? lift : 0), look.bottom);
  }
  // Bras : épaule, main ; celui de devant tient l'outil (à droite), celui de derrière la lanterne
  const sleeve = shade(look.top, 0.88);
  const shoulderY = topY + 1.6;
  // Bras : un trait sombre un peu plus large sous la manche fait le contour (un même trait ne porte qu'un stroke)
  const arm = (sx, hx, hy) => ln([sx, shoulderY], [hx, hy], 'rgba(60,40,25,.35)', S.limb + 0.7) + ln([sx, shoulderY], [hx, hy], sleeve, S.limb + 0.2)
    + `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="${f2(S.limb * 0.55)}" fill="${look.skin}"/>`;
  const working = pose === 'work' && f === 1;
  const waving = pose === 'wave';
  const armSwing = walking ? -swing * 0.9 : 0;
  const frontHand = waving
    ? [w / 2 + 2.4, shoulderY - 5.6 - (f ? 1.2 : 0)]
    : [w / 2 + 1.2 + armSwing * 0.5, shoulderY + S.arm - 0.4 - (working ? 1.4 : 0)];
  const backHand = [-w / 2 - 0.6 - armSwing * 0.5, shoulderY + S.arm - 0.4];
  const backArm = v === 'front' ? arm(-w / 2 + 0.6, backHand[0], backHand[1]) : arm(-w / 2 + 1.6, backHand[0] + 1.2, backHand[1]);
  const frontArm = arm(w / 2 - (v === 'front' ? 0.6 : 1.4), frontHand[0], frontHand[1]);
  // Buste : trapèze arrondi ; de trois quarts, le flanc caché s'assombrit ; tablier et col sur le devant
  const tw = w * 0.86;
  const chest = `<path d="M${f2(-w / 2)},${f2(hipY + 0.4)} Q${f2(-tw / 2 - 0.4)},${f2(topY + 0.6)} 0,${f2(topY)} Q${f2(tw / 2 + 0.4)},${f2(topY + 0.6)} ${f2(w / 2)},${f2(hipY + 0.4)} Q0,${f2(hipY + 1.6)} ${f2(-w / 2)},${f2(hipY + 0.4)} Z" fill="${look.top}"${OUT}/>`;
  let torso = chest;
  if (v !== 'front') {
    const side = v === 'se' ? -1 : 1;
    torso += `<path d="M${f2(side * w / 2)},${f2(hipY + 0.4)} Q${f2(side * (tw / 2 + 0.4))},${f2(topY + 0.6)} ${f2(side * w * 0.16)},${f2(topY + 0.2)} Q${f2(side * w * 0.22)},${f2(hipY - 2)} ${f2(side * w * 0.2)},${f2(hipY + 1)} Z" fill="rgba(0,0,0,.09)"/>`;
  }
  if (look.apron && v !== 'ne') {
    const ax = v === 'se' ? w * 0.14 : 0;
    torso += `<path d="M${f2(ax - w * 0.32)},${f2(topY + 3)} L${f2(ax + w * 0.32)},${f2(topY + 3)} L${f2(ax + w * 0.38)},${f2(hipY + 0.9)} Q${f2(ax)},${f2(hipY + 1.7)} ${f2(ax - w * 0.38)},${f2(hipY + 0.9)} Z" fill="${look.apron}" stroke="rgba(60,40,25,.25)" stroke-width=".4"/>`;
  } else if (look.apron) {
    torso += `<path d="M-1.6,${f2(hipY - 1.6)} L0,${f2(hipY - 0.6)} L1.6,${f2(hipY - 1.6)} L1.2,${f2(hipY + 0.4)} L0,${f2(hipY - 0.4)} L-1.2,${f2(hipY + 0.4)} Z" fill="${look.apron}"/>`;
  }
  if (look.apron && v !== 'ne' && (look.stains || look.pockets)) {
    const ax = v === 'se' ? w * 0.14 : 0;
    const midY = (topY + 3 + hipY) / 2;
    if (look.stains) torso += [[-0.18, -0.6, '#D9A07A'], [0.16, 0.8, '#C9473A'], [-0.05, 2.2, '#B98552']].map(([x, y, c]) => `<circle cx="${f2(ax + x * w)}" cy="${f2(midY + y)}" r=".55" fill="${c}" opacity=".7"/>`).join('');
    if (look.pockets) torso += [-0.2, 0.2].map(x => `<rect x="${f2(ax + x * w - 1.2)}" y="${f2(midY)}" width="2.4" height="2" rx=".3" fill="none" stroke="${shade(look.apron, 0.7)}" stroke-width=".4"/>`).join('')
      + ln([ax - 0.2 * w - 0.3, midY - 1.2], [ax - 0.2 * w - 0.3, midY + 0.2], '#3D3A36', 0.4);
  }
  if (v !== 'ne') {
    const cx = v === 'se' ? w * 0.14 : 0;
    torso += `<path d="M${f2(cx - 1.8)},${f2(topY + 0.3)} L${f2(cx)},${f2(topY + 2)} L${f2(cx + 1.8)},${f2(topY + 0.3)}" fill="none" stroke="${shade(look.top, 0.75)}" stroke-width=".6" stroke-linecap="round"/>`;
  }
  if (look.neckerchief) {
    const cx = v === 'se' ? w * 0.14 : 0;
    torso += v === 'ne'
      ? `<path d="M-2.4,${f2(topY + 0.2)} L2.4,${f2(topY + 0.2)} L0,${f2(topY + 2.6)} Z" fill="${look.neckerchief}"${OUT}/>`
      : `<path d="M${f2(cx - 3)},${f2(topY - 0.2)} Q${f2(cx)},${f2(topY + 1.2)} ${f2(cx + 3)},${f2(topY - 0.2)} L${f2(cx + 0.6)},${f2(topY + 3.6)} L${f2(cx - 0.6)},${f2(topY + 3.6)} Z" fill="${look.neckerchief}"${OUT}/>`;
  }
  if (look.shawl) {
    // Châle couleur nuit sur les épaules, pointe dans le dos, petites lunes brodées
    const moon = (x, y) => `<path d="M${f2(x)},${f2(y - 1)} A1,1 0 1 0 ${f2(x)},${f2(y + 1)} A.7,.7 0 1 1 ${f2(x)},${f2(y - 1)} Z" fill="#F2D27E"/>`;
    torso += v === 'ne'
      ? `<path d="M${f2(-w / 2 - 0.4)},${f2(topY + 1)} Q0,${f2(topY - 1)} ${f2(w / 2 + 0.4)},${f2(topY + 1)} L0,${f2(topY + S.torso * 0.8)} Z" fill="${look.shawl}"${OUT}/>` + moon(-1.4, topY + 3) + moon(1.6, topY + 4.4) + moon(0, topY + 6.6)
      : `<path d="M${f2(-w / 2 - 0.4)},${f2(topY + 1)} Q0,${f2(topY - 1)} ${f2(w / 2 + 0.4)},${f2(topY + 1)} L${f2(w / 2)},${f2(topY + 3.6)} Q${f2(w * 0.2)},${f2(topY + 2.6)} 0,${f2(topY + 4.4)} Q${f2(-w * 0.2)},${f2(topY + 2.6)} ${f2(-w / 2)},${f2(topY + 3.6)} Z" fill="${look.shawl}"${OUT}/>`
        + moon(-w * 0.3, topY + 2) + moon(w * 0.3, topY + 2);
  }
  // Le petit sceau doré du chapitre, brodé sur la poitrine (par-dessus le châle)
  if (look.seal && v !== 'ne') {
    const sx = (v === 'se' ? w * 0.14 : 0) - w * 0.22;
    torso += `<circle cx="${f2(sx)}" cy="${f2(topY + 3.2)}" r="1.05" fill="#E8C35A" stroke="#9A7420" stroke-width=".35"/><circle cx="${f2(sx)}" cy="${f2(topY + 3.2)}" r=".35" fill="#9A7420"/>`;
  }
  // Cape de feuilles cousues : derrière le corps, des épaules aux genoux, bord en feuilles
  let cape = '';
  if (look.cape) {
    const cw = w / 2 + 1.6;
    const low = hipY + S.legs * 0.55;
    const leaves = Array.from({ length: 5 }, (_, i) => {
      const x = -cw + (i + 0.5) * (2 * cw / 5);
      return ell(x, low, 1.6, 1.1, i % 2 ? shade(look.cape, 1.18) : look.cape, OUT);
    }).join('');
    const back = `<path d="M${f2(-cw + 1)},${f2(topY + 0.6)} Q0,${f2(topY - 0.8)} ${f2(cw - 1)},${f2(topY + 0.6)} L${f2(cw)},${f2(low)} L${f2(-cw)},${f2(low)} Z" fill="${look.cape}"${OUT}/>`;
    const veins = [-0.45, 0, 0.45].map(x => ln([x * cw, topY + 3], [x * cw * 1.1, low - 1], shade(look.cape, 0.8), 0.35)).join('');
    cape = back + leaves + (v === 'ne' ? veins : '');
  }
  // Sac à dos (visiteurs) : dans le dos, visible de trois quarts arrière
  if (look.pack && v === 'ne') torso += `<rect x="${f2(-w * 0.34)}" y="${f2(topY + 1.6)}" width="${f2(w * 0.68)}" height="${f2(S.torso * 0.7)}" rx="1.6" fill="${look.pack}"${OUT}/>`;
  if (look.pack && v === 'se') torso += `<rect x="${f2(-w / 2 - 2.2)}" y="${f2(topY + 1.8)}" width="2.6" height="${f2(S.torso * 0.62)}" rx="1" fill="${look.pack}"${OUT}/>`;
  // Tête : un peu en avant pour l'ancien (dos voûté) et dans le sens de la marche
  const hx = (v === 'front' ? 0 : 0.9) + S.stoop * (v === 'front' ? 0 : lean);
  const hy = topY - S.head * 0.78 + S.stoop * 0.4;
  const blink = pose === 'idle' && f === 1;
  // De dos, la nuque entre les cheveux et le col
  const neck = v === 'ne' ? `<rect x="${f2(hx - 1.6)}" y="${f2(hy + S.head * 0.55)}" width="3.2" height="${f2(topY - hy - S.head * 0.4)}" rx="1" fill="${shade(look.skin, 0.92)}"/>` : '';
  const head = neck + headPart(hx, hy, k, hairBackOf(look.style || 'short', look.hair, v)) + `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="${f2(S.head)}" fill="${look.skin}"${OUT}/>`
    + headPart(hx, hy, k, faceOf(v, look.skin, blink) + hairOf(look.style || 'short', look.hair, v) + hairBitsOf(look, v) + earOf(v, look.skin) + extrasOf(look, v, (hipY - 0.6 - hy) / k) + hatOf(look.hat, v));
  // Outil dans la main de devant (pas avec le parapluie) ; lanterne dans l'autre ; parapluie au-dessus
  const held = umbrella || waving ? '' : at(frontHand[0] - 6.5, frontHand[1] + 8.5, toolOf(look.tool, working));
  const lamp = lantern
    ? at(backHand[0] + 6.4, backHand[1] + 8, ln([-6.4, -8], [-6.4, -4.6], '#3D3A36', 0.5) + `<path d="M-8.4,-4.6 L-4.4,-4.6 L-4.8,-0.6 L-8,-0.6 Z" fill="#FFE08A" stroke="#3D3A36" stroke-width=".6"/>` + `<circle cx="-6.4" cy="-2.6" r="2.6" fill="rgba(255,224,138,.35)"/>`)
    : '';
  const brolly = umbrella
    ? ln(frontHand, [frontHand[0] + 1.4, hy - S.head - 9], '#4A3426', 0.8)
      + at(frontHand[0] + 1.4, hy - S.head - 9, `<path d="M-12.6,1 Q0,-12 12.6,1 Q9.4,-1 6.2,1 Q3,-1 -0.2,1 Q-3.4,-1 -6.6,1 Q-9.6,-1 -12.6,1 Z" fill="#E2574C" stroke="rgba(60,30,20,.4)" stroke-width=".6"/>`)
    : '';
  // Ordre de dessin : de dos, les bras passent devant la tête ; sinon la tête recouvre le haut des bras
  const shadow = ell(0.4, 0, 6.8, 2.2, 'rgba(40,55,20,.22)');
  const body = v === 'ne'
    ? legs + backArm + torso + cape + head + frontArm + held + lamp
    : cape + legs + backArm + lamp + torso + frontArm + head + held;
  return sprite(`${shadow}<g transform="translate(0 ${bob})">${body}</g>${brolly}`, VILLAGER_BOX);
}

/* ---------- Visiteurs : une allure tirée au hasard (graine) ---------- */
const pick = (list, x) => list[Math.floor(x * list.length) % list.length];
// Allure d'un personnage tiré d'une graine (visiteurs, enfants de l'île) ; over : ce qu'on impose (tenue, outil…)
export function personOf(seed, over = {}) {
  let s = seed >>> 0;
  const r = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const build = pick(['slim', 'slim', 'broad', 'elder', 'child'], r());
  const style = pick(STYLES, r());
  return {
    label: 'Visiteur', build, style, skin: pick(SKINS, r()), hair: build === 'elder' ? pick(['#D9D4CC', '#8A8F98'], r()) : pick(HAIRS.slice(0, 6), r()),
    top: pick(['#7EC45B', '#C9473A', '#6FA3D9', '#F2C04B', '#9C6A44', '#B48AE0', '#E8879C', '#4FA39A'], r()),
    bottom: pick(['#6B4A2E', '#4F5A72', '#5E616B', '#2F5684', '#3D3A36', '#7A5A8C'], r()),
    hat: pick([null, null, 'cap', 'straw', 'beanie', 'hood', 'bucket'], r()), tool: null,
    beard: build !== 'child' && r() < 0.25 ? pick(['full', 'mustache'], r()) : null, glasses: r() < 0.2,
    pack: r() < 0.5 ? pick(['#8C6A46', '#5E7F3E', '#3E5A8C'], r()) : null,
    ...over
  };
}
