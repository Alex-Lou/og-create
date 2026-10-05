// Habitants de l'île (et visiteurs) : petits personnages à grosse tête, dessinés en SVG sous trois angles — de face
// (quand on leur parle), de trois quarts en avançant vers le joueur (se), de trois quarts en s'éloignant (ne) ; le
// miroir donne les deux autres directions de marche. Quatre silhouettes (enfant, mince, costaud, ancien), sept
// coiffures, barbe, moustache, lunettes ; la tenue et l'outil de leur métier.
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
// Une tenue par métier (haut, bas, chapeau, outil, coiffure, silhouette, poils, tablier)
export const ROLES = {
  potager: { label: 'Jardinière des lunes', top: '#7EC45B', bottom: '#6B4A2E', hat: 'straw', tool: 'can', style: 'long', build: 'slim' },
  carriere: { label: 'Tailleur de runes', top: '#8E99A4', bottom: '#4F5660', hat: 'helmet', tool: 'pick', style: 'short', build: 'broad', beard: 'full' },
  bosquet: { label: 'Gardienne des bois', top: '#C9473A', bottom: '#4F5A72', hat: 'beanie', tool: 'axe', style: 'braids', build: 'slim' },
  puits: { label: 'Petit sourcier', top: '#6FA3D9', bottom: '#5E616B', hat: 'scarf', tool: 'bucket', style: 'curly', build: 'slim', glasses: true },
  ponton: { label: 'Navigatrice', top: '#F2C04B', bottom: '#2F5684', hat: 'bucket', tool: 'rod', style: 'ponytail', build: 'slim' },
  atelier: { label: 'Horloger-artificier', top: '#9C6A44', bottom: '#3D3A36', hat: null, tool: 'hammer', style: 'short', build: 'broad', beard: 'mustache', apron: '#5E3A22' },
  foyer: { label: 'Cuisinière-guérisseuse', top: '#FFFFFF', bottom: '#B9503B', hat: 'toque', tool: 'ladle', style: 'bun', build: 'elder', apron: '#F4EEDC', glasses: true }
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
    else if (view === 'se') out += `<path d="M-6.9,0 Q-8.4,7.4 -4.8,10 Q-3.6,6 -4,1.4 Z" fill="${color}"/><path d="M5.8,-1.6 Q6.8,3.6 5.4,6.6 Q4.6,3 4.6,-1 Z" fill="${color}"/>`;
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
    else if (view === 'se') out += braid(-5.8, 2, 4) + braid(5, 3, 3);
    else out += braid(-3.4, 3.8, 4) + braid(3.4, 3.8, 4);
  }
  return out;
}
// Visage selon la vue : yeux (fermés au clignement), joues, bouche, nez de profil. De trois quarts, les traits glissent
// vers le côté où l'on regarde et l'autre joue s'ombre ; de dos, rien (l'oreille vient par-dessus les cheveux : earOf)
function faceOf(view, skin, blink) {
  const eye = (x, rx) => (blink ? ln([x - 0.9, 0.6], [x + 0.9, 0.6], '#2A2420', 0.75) : ell(x, 0.6, rx, 1.15, '#2A2420') + `<circle cx="${f2(x + 0.3)}" cy="0.2" r=".32" fill="#FFFFFF"/>`);
  if (view === 'ne') return '';
  if (view === 'se') {
    return `<path d="M-2.6,-6.1 Q-7.4,-3 -6,3.6 Q-4.2,6.6 -1.4,6.5 Q-5,3 -2.6,-6.1 Z" fill="rgba(0,0,0,.06)"/>`
      + eye(1.1, 0.8) + eye(4.5, 0.55)
      + `<circle cx="-0.6" cy="2.8" r="1.1" fill="rgba(240,120,120,.35)"/><circle cx="5.3" cy="2.5" r=".7" fill="rgba(240,120,120,.3)"/>`
      + `<path d="M6.3,0.6 Q8.1,1.6 6.5,2.8" fill="${skin}" stroke="rgba(60,40,25,.45)" stroke-width=".45"/>`
      + `<path d="M2.4,3.5 Q3.5,4.2 4.6,3.3" fill="none" stroke="#7A4030" stroke-width=".5" stroke-linecap="round"/>`;
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
// Barbe, moustache, lunettes
function extrasOf(look, view) {
  if (view === 'ne') return '';
  const dx = view === 'se' ? 2.6 : 0;
  let out = '';
  if (look.beard === 'full') {
    out += view === 'se'
      ? `<path d="M-2.4,2 Q-2.4,7 2.8,7.8 Q7.2,5.8 6.4,1.2 Q5,4.4 2.6,4.4 Q0,4.6 -2.4,2 Z" fill="${look.hair}"${OUT}/>`
      : `<path d="M-5.2,1.6 Q-5.6,6.6 0,8 Q5.6,6.6 5.2,1.6 Q3.4,4.6 0,4.6 Q-3.4,4.6 -5.2,1.6 Z" fill="${look.hair}"${OUT}/>`;
  }
  if (look.beard === 'full' || look.beard === 'mustache') {
    out += `<path d="M${f2(-2.6 + dx)},2.9 Q${f2(dx)},1.8 ${f2(2.6 + dx)},2.9 Q${f2(dx)},3.7 ${f2(-2.6 + dx)},2.9 Z" fill="${shade(look.hair, 0.85)}"/>`;
  }
  if (look.glasses) {
    const lens = (x, rx) => ell(x, 0.6, rx, 1.6, 'rgba(220,240,255,.25)', ' stroke="#3D3A36" stroke-width=".55"');
    out += view === 'se'
      ? lens(1.1, 1.6) + lens(4.5, 1.1) + ln([2.7, 0.4], [3.4, 0.4], '#3D3A36', 0.5) + ln([-0.5, 0.3], [-2.4, 0.7], '#3D3A36', 0.5)
      : lens(-2.3, 1.6) + lens(2.3, 1.6) + ln([-0.7, 0.4], [0.7, 0.4], '#3D3A36', 0.5);
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
    case 'hood': return `<path d="M-7.8,3.4 Q-8.6,-10 0,-10.6 Q8.6,-10 7.8,3.4 Q5.6,-4.6 0,-4.8 Q-5.6,-4.6 -7.8,3.4 Z" fill="#6A5A8C"${OUT}/>`;
    default: return '';
  }
}

/* ---------- Outils et accessoires (tenus par la main de devant ; ancrage de la main en (6,5 ; −8,5)) ---------- */
function toolOf(kind, up) {
  const a = up ? -1 : 0;
  switch (kind) {
    case 'can': return `<g transform="rotate(${up ? -30 : 0} 7 -9)">` + `<path d="M5,-11 L10,-11 L10,-6 L5,-6 Z" fill="#7FA6B8"${OUT}/>` + ln([10, -10], [13.5, -12.6], '#7FA6B8', 1.2) + `<path d="M6,-12 Q7.5,-14.4 9,-12" fill="none" stroke="#5E7F90" stroke-width=".9"/></g>` + (up ? [0, 1, 2].map(k => `<circle cx="${14 + k * 0.6}" cy="${-11 + k * 2}" r=".6" fill="#86C6E6"/>`).join('') : '');
    case 'pick': return `<g transform="rotate(${up ? -55 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -21], '#8B5631', 1.3) + `<path d="M1.4,-20.4 Q6.5,-24 11.6,-20.4 Q6.5,-22 1.4,-20.4 Z" fill="#8E99A4" stroke="#5A636C" stroke-width=".6"/></g>`;
    case 'axe': return `<g transform="rotate(${up ? -60 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -20], '#A9703F', 1.3) + `<path d="M6.5,-20 L10.6,-21.4 Q11.6,-18 10.6,-15.6 L6.5,-17 Z" fill="#B4BEC8" stroke="#68737E" stroke-width=".6"/></g>`;
    case 'bucket': return `<path d="M3.8,${-6 + a} L9.4,${-6 + a} L8.6,${-0.8 + a} L4.6,${-0.8 + a} Z" fill="#B98552"${OUT}/>` + `<path d="M4,${-6 + a} Q6.6,${-10.6 + a} 9.2,${-6 + a}" fill="none" stroke="#5E3A22" stroke-width=".7"/>` + ell(6.6, -5.9 + a, 2.6, 0.7, '#86C6E6');
    case 'rod': return up
      ? ln([6.5, -9], [15, -34], '#8B5631', 0.9) + `<path d="M15,-34 Q18,-24 16,-12" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`
      : ln([6.5, -9], [12, -30], '#8B5631', 0.9) + `<path d="M12,-30 Q14,-20 13,-14" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`;
    case 'hammer': return `<g transform="rotate(${up ? -70 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -17], '#8B5631', 1.3) + `<rect x="3.4" y="-19.6" width="6.2" height="3" rx=".6" fill="#68737E"/></g>`;
    case 'ladle': return `<g transform="rotate(${up ? -35 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [8.5, -17], '#B4BEC8', 1) + ell(9, -17.6, 1.8, 1.2, '#B4BEC8') + `</g>`;
    case 'staff': return ln([6.5, -8.5], [7.4, 4], '#8B5631', 1.2) + ln([6.5, -8.5], [6, -12], '#8B5631', 1.2);
    case 'book': return `<g transform="rotate(${up ? -14 : 0} 6.5 -8.5)"><rect x="4.4" y="-12" width="5" height="6.4" rx=".6" fill="#7A3E8C"${OUT}/><rect x="5" y="-11.4" width="3.8" height="5.2" fill="#F4EEDC"/></g>`;
    case 'basket': return `<path d="M3.6,-7.6 L9.6,-7.6 L8.8,-3.4 L4.4,-3.4 Z" fill="#C8893E"${OUT}/>` + `<path d="M4,-7.6 Q6.6,-12 9.2,-7.6" fill="none" stroke="#7A5230" stroke-width=".8"/>` + `<circle cx="5.6" cy="-8.2" r="1.2" fill="#E2483A"/><circle cx="7.6" cy="-8.4" r="1.1" fill="#8FCB6A"/>`;
    default: return '';
  }
}
const at = (x, y, body) => `<g transform="translate(${f2(x)} ${f2(y)})">${body}</g>`;

/* ---------- Le personnage ---------- */
// look : { skin, hair, style, top, bottom, hat, tool, apron, build, beard, glasses, shoes, pack } ;
// view : front | se | ne (back : ancien nom de ne) ; pose : walk | idle | work | wave ; frame : 0 à 3 (marche) ou 0 à 1
export function villagerSprite(look, { pose = 'idle', view, back = false, frame = 0, lantern = false, umbrella = false } = {}) {
  const v = view || (back ? 'ne' : 'front');
  const S = BUILDS[look.build] || BUILDS.slim;
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
  const shoes = look.shoes || '#4A3426';
  const dark = shade(look.bottom, 0.78);
  // Pieds : vers la droite (se, ne) ; de face, côte à côte
  const foot = (x, y, color) => ell(x + (v === 'front' ? 0 : 1), y - 0.5, v === 'front' ? 1.8 : 2.3, 1.05, color);
  const leg = (hx, fx, fy, color) => ln([hx, hipY + 0.6], [fx, fy - 0.9], color, S.limb) + foot(fx, fy, shoes);
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
  if (v !== 'ne') {
    const cx = v === 'se' ? w * 0.14 : 0;
    torso += `<path d="M${f2(cx - 1.8)},${f2(topY + 0.3)} L${f2(cx)},${f2(topY + 2)} L${f2(cx + 1.8)},${f2(topY + 0.3)}" fill="none" stroke="${shade(look.top, 0.75)}" stroke-width=".6" stroke-linecap="round"/>`;
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
  const head = neck + `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="${f2(S.head)}" fill="${look.skin}"${OUT}/>`
    + headPart(hx, hy, k, faceOf(v, look.skin, blink) + hairOf(look.style || 'short', look.hair, v) + earOf(v, look.skin) + extrasOf(look, v) + hatOf(look.hat, v));
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
    ? legs + backArm + torso + head + frontArm + held + lamp
    : legs + backArm + lamp + torso + frontArm + head + held;
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
