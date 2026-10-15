// Le phare des Anciens, sur l'Îlot aux Mouettes (ecriture/arc_phare.md, choix de l'auteur du 15 oct. : le premier
// objectif du jeu devient « rallumer le phare » ; on le découvre à la première veillée, de nuit, de loin, quand la
// caméra glisse du feu jusqu'à lui). Pour l'île (iso du jeu, trait de la troupe #3C2819, lumière en haut à gauche) :
// une tour haute, élancée, d'une pierre sombre bleu-gris (sombre sur la mer, sa silhouette se lit de loin), sur un
// socle de rochers mouillés ; une porte cintrée et sa serrure en forme de pierre ; des meurtrières qui montent en
// spirale, où nichent les mouettes (les oiseaux des gardiens) ; la galerie et sa rambarde cassée ; la lanterne et son
// dôme de cuivre vert-de-gris. L'échelle (choix de l'auteur : « un phare, pas une cabane en feuilles ») : environ huit
// fois la hutte du Foyer, plus de deux fois le plus haut des bâtiments.
// Deux états : 'eteint' (jusqu'à l'acte VII : la lentille des Anciens est là, froide, un éclat de lune dessus) ;
// 'vide' (après l'acte VI : Jovin a emporté la lentille ; la lanterne est vide, deux vitres brisées, on voit au travers).
// 4 images en boucle : les mouettes battent des ailes, tournent la tête ; l'écume va et vient au pied des rochers.
// Pas de filtre : les volumes sont des dégradés ; la brume est celle de l'île (le voile du jeu), pas dessinée ici.
import { P, boulder, shadow, EDGE, TW, TH } from './port/src/world/iso.js';
import { OUT, f2, kelp } from './camp.mjs';

// la pierre de la tour (basalte bleu-gris des Anciens), les rochers secs et mouillés, le cuivre du dôme, le verre
const PIERRE = { clair: '#A2ACBA', haut: '#838E9E', milieu: '#5B6474', ombre: '#3B4250', fond: '#323845', renvoi: '#424A5A' };
const ROC = { top: '#A39E92', left: '#88837A', right: '#67635B' };
const ROC_MOUILLE = { top: '#77736B', left: '#5E5B55', right: '#45433F' };
const CUIVRE = { clair: '#9CCAB6', milieu: '#6E9E8C', ombre: '#3F6A5E', trait: '#2C4C44' };
const BOIS = { clair: '#6E5A48', ombre: '#4A3A2E' };
const FER = '#2B2F36';
const BLANC = '#FBF8F0';

// la tour : le pied du fût (au-dessus du socle), le haut (sous la galerie), leurs rayons ; le fût s'évase doucement
// vers le pied, comme les vieilles tours de mer
const Z0 = 34, Z1 = 330, R0 = 46, R1 = 28;
const rAt = z => R1 + (R0 - R1) * Math.pow((Z1 - z) / (Z1 - Z0), 1.7);
// un point de la face visible du fût : th de 0 (bord droit) à PI (bord gauche) en passant par PI / 2 (face à nous)
const surf = (th, z, dr = 0) => { const r = rAt(z) + dr; return [Math.cos(th) * r, -z + Math.sin(th) * r / 2]; };
const pt = ([x, y]) => `${f2(x)},${f2(y)}`;
const lin = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0, units = '') => `<linearGradient id="${id}"${units ? ` gradientUnits="${units}"` : ''} x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx, cy, r) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(r)}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// une mouette posée (x, y : ses pattes) ; tete : 1 regarde à droite, -1 à gauche ; s : échelle
const mouettePosee = (x, y, tete = 1, s = 1) => `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(tete * s)} ${f2(s)})">`
  + `<path d="M-0.6,0 L-0.6,1.8 M0.8,0 L0.8,1.8" stroke="#E8963A" stroke-width="0.6" stroke-linecap="round"/>`
  + `<path d="M-4.2,-0.6 Q-4.4,-3.6 -0.6,-4.2 Q2.6,-4.6 3.6,-2.2 L2,0.2 Q-1.4,1 -4.2,-0.6 Z" fill="${BLANC}" stroke="${OUT}" stroke-width="0.45"/>`
  + `<path d="M-4.6,-1.4 Q-1.6,-3 1.4,-1.6 L-0.8,0 Q-3,0 -4.6,-1.4 Z" fill="#A9B3BA" stroke="${OUT}" stroke-width="0.35"/><path d="M-4.6,-1.4 L-6,-0.6 L-4.2,-0.4 Z" fill="#3A3F46"/>`
  + `<circle cx="2.4" cy="-4.4" r="2" fill="${BLANC}" stroke="${OUT}" stroke-width="0.45"/><circle cx="3" cy="-4.8" r="0.5" fill="${OUT}"/>`
  + `<path d="M4.2,-4.4 L6.2,-3.9 L4.2,-3.4 Z" fill="#F2B23C" stroke="${OUT}" stroke-width="0.25"/><circle cx="5.4" cy="-3.9" r="0.3" fill="#D8443A"/></g>`;
// une mouette en vol (x, y : son corps) ; a : l'aile de 1 (levée) à -1 (baissée) ; s : échelle ; sens : 1 ou -1
function mouetteVol(x, y, a, s = 1, sens = 1) {
  const h = -3.6 * a;
  const aile = d => `M${f2(-0.4 * d)},0 Q${f2(-3 * d)},${f2(h - 1.2)} ${f2(-7 * d)},${f2(h)} Q${f2(-4 * d)},${f2(h * 0.4 + 1)} ${f2(-0.4 * d)},1.2 Z`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(sens * s)} ${f2(s)})">`
    + `<path d="${aile(1)}" fill="#D9DEE2" stroke="${OUT}" stroke-width="0.45"/>`
    + `<ellipse cx="0.6" cy="0.6" rx="3.2" ry="1.4" fill="${BLANC}" stroke="${OUT}" stroke-width="0.45"/><circle cx="3.4" cy="0.1" r="1.1" fill="${BLANC}" stroke="${OUT}" stroke-width="0.4"/><path d="M4.4,0 L5.8,0.4 L4.4,0.7 Z" fill="#F2B23C"/>`
    + `<path d="${aile(-1)}" fill="${BLANC}" stroke="${OUT}" stroke-width="0.45"/><path d="M${f2(4.2)},${f2(h * 0.95)} L${f2(6.8)},${f2(h)}" stroke="#3A3F46" stroke-width="0.7" stroke-linecap="round"/></g>`;
}

// l'écume au pied des rochers : des paquets blancs là où la mer bat (au pied de chaque rocher, pas un anneau), qui
// enflent et retombent d'une image à l'autre (n), et de fines traînées ; devant : ceux de devant (après les rochers) ou
// ceux de derrière (avant eux)
const BATTUES = [[-0.95, -0.7, 0.42], [0.7, -0.95, 0.4], [1.05, -0.2, 0.32], [-1.3, 0.1, 0.5], [1.32, 0.42, 0.42], [-0.8, 0.95, 0.38], [0.35, 1.25, 0.34], [1.15, 0.7, 0.3], [-0.2, 1.32, 0.4], [0.9, 1.15, 0.3]];
function ecume(n, devant) {
  let s = '';
  BATTUES.forEach(([u, v, r], i) => {
    if ((u + v > 0.2) !== devant) return;
    for (let k = 0; k < 4; k++) {
      const a = Math.PI * (0.15 + 0.7 * (k / 3)) + hash(i, k) * 0.4, vague = 0.5 + 0.5 * Math.sin(n * (Math.PI / 2) + i * 1.7 + k);
      const [x, y] = P(u + Math.cos(a) * r * 1.05, v + Math.sin(a) * r * 1.05, 0);
      s += `<ellipse cx="${f2(x)}" cy="${f2(y + 1)}" rx="${f2(4 + 4 * hash(i, k + 5) + 2 * vague)}" ry="${f2(1.2 + 1.2 * vague)}" fill="#F4FAFB" opacity="${f2(0.5 + 0.45 * vague)}"/>`;
      if (k % 2) s += `<circle cx="${f2(x + 5 * hash(i, k + 9) - 2.5)}" cy="${f2(y + 3.4)}" r="${f2(0.7 + 0.9 * vague)}" fill="#FFFFFF" opacity="${f2(0.4 + 0.4 * vague)}"/>`;
    }
    const [x, y] = P(u, v + r * 1.3, 0);
    s += `<path d="M${f2(x - 9)},${f2(y + 2)} q${f2(9)},${f2(2.6 + n % 2)} ${f2(18)},0" fill="none" stroke="#EAF4F6" stroke-opacity="0.45" stroke-width="0.8" stroke-linecap="round"/>`;
  });
  return s;
}

// Le phare : etat 'eteint' ou 'vide' ; n : l'image (0 à 3)
export function phare(etat = 'eteint', n = 0) {
  const id = p => `ph${etat[0]}${n}${p}`;
  const aile = [1, 0, -1, 0][n % 4], aile2 = [-1, 0, 1, 0][n % 4];
  let defs = '', o = '';
  o += shadow(0.1, 0.05, 1.5, 0.2);
  // ——— derrière : l'écume du fond, les rochers du fond, une mouette qui plane derrière la tour ———
  o += ecume(n, false);
  o += boulder(-0.95, -0.7, 0.42, 0.36, 18, ROC_MOUILLE, 21, 0.32, 0.5) + boulder(0.7, -0.95, 0.4, 0.34, 22, ROC_MOUILLE, 23, 0.3, 0.45) + boulder(1.05, -0.2, 0.32, 0.3, 14, ROC_MOUILLE, 27, 0.32, 0.5) + boulder(-1.3, 0.1, 0.5, 0.42, 16, ROC_MOUILLE, 31, 0.3, 0.5);
  o += mouetteVol(46, -Z1 - 62 + aile2 * 1.5, aile2, 0.85, -1);
  // ——— le socle : un gros rocher, mouillé au pied (les algues), sec au-dessus ———
  o += boulder(0, 0.05, 1.45, 1.35, Z0 - 6, ROC_MOUILLE, 2, 0.18, 0.84);
  o += boulder(-0.05, 0, 1.22, 1.14, Z0, ROC, 5, 0.14, 0.9);
  for (const [u, v, rot] of [[-1.05, 0.55, -18], [-0.3, 1.1, 8], [0.6, 0.9, -6], [1.15, 0.2, 14]]) o += kelp(u, v, rot);
  // ——— le fût ———
  const N = 14, cote = s => Array.from({ length: N + 1 }, (_, k) => { const z = Z0 + (Z1 - Z0) * (k / N); return [s * rAt(z), -z]; });
  const gauche = cote(-1), droite = cote(1).reverse();
  const fut = `M${pt(gauche[0])} ${gauche.slice(1).map(p => `L${pt(p)}`).join(' ')} L${pt(droite[0])} ${droite.slice(1).map(p => `L${pt(p)}`).join(' ')} A${R0},${R0 / 2} 0 0 1 ${pt(gauche[0])} Z`;
  defs += lin(id('f'), [[0, PIERRE.clair], [0.16, PIERRE.haut], [0.5, PIERRE.milieu], [0.8, PIERRE.ombre], [0.93, PIERRE.fond], [1, PIERRE.renvoi]]);
  defs += lin(id('p'), [[0, '#1C222C', 0.5], [1, '#1C222C', 0]], 0, -Z0, 0, -Z0 - 80, 'userSpaceOnUse');
  defs += lin(id('h'), [[0, '#1C222C', 0.4], [1, '#1C222C', 0]], 0, -Z1, 0, -Z1 + 26, 'userSpaceOnUse');
  defs += `<clipPath id="${id('c')}"><path d="${fut}"/></clipPath>`;
  o += `<path d="${fut}" fill="url(#${id('f')})"/>`;
  let dedans = '';
  // les assises et leurs joints décalés ; quelques pierres plus claires ou plus sombres (la pierre vieillie)
  for (let z = Z0 + 13, k = 0; z < Z1; z += 13, k++) {
    const a = surf(Math.PI, z), b = surf(0, z), r = rAt(z);
    dedans += `<path d="M${pt(a)} A${f2(r)},${f2(r / 2)} 0 0 0 ${pt(b)}" fill="none" stroke="#1E232C" stroke-opacity="0.38" stroke-width="0.8"/>`;
    dedans += `<path d="M${pt(surf(Math.PI, z + 1.1))} A${f2(rAt(z + 1.1))},${f2(rAt(z + 1.1) / 2)} 0 0 0 ${pt(surf(Math.PI * 0.55, z + 1.1))}" fill="none" stroke="#B4BDC8" stroke-opacity="0.22" stroke-width="0.6"/>`;
    for (const t of k % 2 ? [0.18, 0.42, 0.66, 0.88] : [0.3, 0.54, 0.78]) {
      const th = Math.PI * (1 - t);
      dedans += `<path d="M${pt(surf(th, z))} L${pt(surf(th, z - 13))}" stroke="#1E232C" stroke-opacity="0.32" stroke-width="0.7"/>`;
    }
    for (let j = 0; j < 3; j++) {
      const t0 = hash(k, j) * 0.8, th0 = Math.PI * (1 - t0), th1 = th0 - 0.32, clair = hash(k, j + 7) > 0.5;
      dedans += `<path d="M${pt(surf(th0, z - 12.4))} L${pt(surf(th0, z - 0.6))} L${pt(surf(th1, z - 0.6))} L${pt(surf(th1, z - 12.4))} Z" fill="${clair ? '#C3CCD6' : '#1A1F28'}" opacity="${clair ? 0.12 : 0.14}"/>`;
    }
  }
  // l'ombre au pied (l'embrun, la mousse sombre) et sous la galerie
  dedans += `<rect x="${-R0 - 2}" y="${-Z0 - 80}" width="${2 * R0 + 4}" height="${84 + R0}" fill="url(#${id('p')})"/><rect x="${-R0}" y="${-Z1 - 2}" width="${2 * R0}" height="30" fill="url(#${id('h')})"/>`;
  // des lichens dorés et de la mousse, côté lumière, en bas ; des coulures sombres côté ombre
  for (let j = 0; j < 9; j++) {
    const [x, y] = surf(Math.PI * (0.62 + 0.3 * hash(j, 11)), Z0 + 6 + 60 * hash(j, 12));
    dedans += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(2 + 3 * hash(j, 13))}" ry="${f2(1.2 + 1.6 * hash(j, 14))}" fill="${j % 3 ? '#7E9A4E' : '#C8B04E'}" opacity="0.55"/>`;
  }
  for (let j = 0; j < 5; j++) {
    const th = Math.PI * (0.12 + 0.3 * hash(j, 17)), z0 = Z1 - 10 - 120 * hash(j, 18), l = 26 + 40 * hash(j, 19);
    const [x, y] = surf(th, z0);
    dedans += `<path d="M${f2(x)},${f2(y)} q${f2(-0.8)},${f2(l * 0.5)} ${f2(0.4)},${f2(l)}" fill="none" stroke="#20262F" stroke-opacity="0.3" stroke-width="${f2(1.4 + hash(j, 20))}" stroke-linecap="round"/>`;
  }
  // la fissure, côté ombre
  dedans += `<path d="M${pt(surf(0.42, 268))} L${pt(surf(0.5, 254))} L${pt(surf(0.38, 240))} L${pt(surf(0.47, 222))} L${pt(surf(0.36, 206))} L${pt(surf(0.44, 190))}" fill="none" stroke="#151920" stroke-width="1.1" stroke-linejoin="round"/>`;
  o += `<g clip-path="url(#${id('c')})">${dedans}</g>`;
  o += `<path d="${fut}" fill="none"${EDGE.replace('0.72', '1.1')}/>`;
  // deux bandeaux sculptés (une moulure qui fait le tour, ses runes : la tour et l'œil ouvert, vues de face)
  for (const zb of [Z0 + 92, Z0 + 212]) {
    const r = rAt(zb) + 2.4, h = 6;
    defs += lin(id(`b${zb}`), [[0, '#A9B2BE'], [0.45, '#7A8494'], [0.85, '#454C5A'], [1, '#505868']]);
    o += `<path d="M${f2(-r)},${f2(-zb - h)} L${f2(-r)},${f2(-zb)} A${f2(r)},${f2(r / 2)} 0 0 0 ${f2(r)},${f2(-zb)} L${f2(r)},${f2(-zb - h)} A${f2(r)},${f2(r / 2)} 0 0 1 ${f2(-r)},${f2(-zb - h)} Z" fill="url(#${id(`b${zb}`)})"${EDGE}/>`;
    o += `<path d="M${f2(-r)},${f2(-zb - h)} A${f2(r)},${f2(r / 2)} 0 0 0 ${f2(r * 0.2)},${f2(-zb - h + r / 2 * 0.98)}" fill="none" stroke="#D2D9E2" stroke-opacity="0.55" stroke-width="0.7"/>`;
    const yc = -zb - h / 2 + r / 2;
    o += `<path d="M-6,${f2(yc + 2)} L-6,${f2(yc - 2.2)} L-4.6,${f2(yc - 3.2)} L-3.2,${f2(yc - 2.2)} L-3.2,${f2(yc + 2)} M3.2,${f2(yc)} Q5.4,${f2(yc - 2.4)} 7.6,${f2(yc)} Q5.4,${f2(yc + 2.4)} 3.2,${f2(yc)} Z" fill="none" stroke="#262B33" stroke-width="0.8" stroke-linejoin="round"/><circle cx="5.4" cy="${f2(yc)}" r="0.8" fill="#262B33"/>`;
  }
  // les meurtrières, qui montent en spirale avec l'escalier ; deux nids, leurs mouettes, les traînées blanches
  const fenetres = [[Z0 + 58, 1.95, false], [Z0 + 132, 1.22, true], [Z0 + 178, 2.08, false], [Z0 + 250, 1.36, true]];
  fenetres.forEach(([z, th, nid], i) => {
    const [x, y] = surf(th, z), w = 3.2 * Math.max(0.45, Math.sin(th)), h = 12;
    o += `<path d="M${f2(x - w)},${f2(y + 1)} L${f2(x - w)},${f2(y - h + w)} Q${f2(x)},${f2(y - h - w * 0.6)} ${f2(x + w)},${f2(y - h + w)} L${f2(x + w)},${f2(y + 1)} Z" fill="#151A22"${EDGE}/>`;
    o += `<path d="M${f2(x - w - 1.2)},${f2(y + 1)} L${f2(x + w + 1.2)},${f2(y + 1)} L${f2(x + w + 0.6)},${f2(y + 2.6)} L${f2(x - w - 0.6)},${f2(y + 2.6)} Z" fill="#9AA4B2"${EDGE}/>`;
    if (nid) {
      o += `<path d="M${f2(x - w - 2)},${f2(y + 0.6)} q${f2(w + 2)},${f2(-3)} ${f2(2 * w + 4)},0" fill="none" stroke="#8A6E48" stroke-width="1.4" stroke-linecap="round"/><path d="M${f2(x - w - 1)},${f2(y - 0.4)} l2,-1.6 M${f2(x + w)},${f2(y - 0.2)} l1.6,-1.8" stroke="#A88A5C" stroke-width="0.7" stroke-linecap="round"/>`;
      o += mouettePosee(x + 0.4, y - 0.6, (n + i) % 4 < 2 ? 1 : -1, 0.62);
      o += `<path d="M${f2(x - 1)},${f2(y + 3)} q-1.4,9 0.6,16 q1,6 -0.6,12" fill="none" stroke="#F6F4EC" stroke-opacity="0.85" stroke-width="1.5" stroke-linecap="round"/><path d="M${f2(x + 2)},${f2(y + 3)} q1,6 -0.2,11" fill="none" stroke="#F6F4EC" stroke-opacity="0.7" stroke-width="1" stroke-linecap="round"/>`;
    }
  });
  // ——— la porte cintrée, son encadrement de pierres, la serrure en forme de pierre ———
  {
    const yb = -Z0 + R0 / 2 - 0.5, w = 10, h = 30, yt = yb - h;
    defs += lin(id('d'), [[0, BOIS.clair], [1, BOIS.ombre]]);
    for (let k = 0; k <= 8; k++) {
      const a = Math.PI * (1 - k / 8), r1 = w + 1.2, r2 = w + 6;
      const p = (r, aa) => [Math.cos(aa) * r, yt + w - Math.sin(aa) * r];
      const a0 = a + Math.PI / 18, a1 = a - Math.PI / 18;
      if (k > 0 && k < 8) o += `<path d="M${pt(p(r1, a0))} L${pt(p(r2, a0))} L${pt(p(r2, a1))} L${pt(p(r1, a1))} Z" fill="${k % 2 ? '#9AA3B0' : '#848E9C'}"${EDGE}/>`;
    }
    o += `<path d="M${-w - 6},${f2(yb)} L${-w - 6},${f2(yt + w)} L${-w - 1.2},${f2(yt + w)} L${-w - 1.2},${f2(yb)} Z M${w + 1.2},${f2(yb)} L${w + 1.2},${f2(yt + w)} L${w + 6},${f2(yt + w)} L${w + 6},${f2(yb)} Z" fill="#7C8695"${EDGE}/>`;
    o += `<path d="M${-w},${f2(yb)} L${-w},${f2(yt + w)} A${w},${w} 0 0 1 ${w},${f2(yt + w)} L${w},${f2(yb)} Z" fill="url(#${id('d')})"${EDGE}/>`;
    for (const x of [-5, 0, 5]) o += `<path d="M${x},${f2(yb)} L${x},${f2(yt + w - Math.sqrt(Math.max(0, w * w - x * x)) + 1)}" stroke="#3A2C22" stroke-width="0.6"/>`;
    for (const yy of [yt + 12, yb - 7]) o += `<path d="M${-w + 0.6},${f2(yy)} L${w - 0.6},${f2(yy)}" stroke="${FER}" stroke-width="1.6"/><circle cx="${-w + 2.6}" cy="${f2(yy)}" r="0.7" fill="#6E747C"/><circle cx="${w - 2.6}" cy="${f2(yy)}" r="0.7" fill="#6E747C"/>`;
    // la serrure : une pierre ronde enchâssée, sa spirale gravée (la forme de la clé d'Héliane)
    defs += rad(id('s'), [[0, '#C9C3B4'], [1, '#7C766A']], 3.4, yt + 15.6, 5);
    o += `<circle cx="4.2" cy="${f2(yt + 17)}" r="3.8" fill="url(#${id('s')})"${EDGE}/><path d="M4.2,${f2(yt + 17)} m-1,0 a1,1 0 1 1 1,1 a1.8,1.8 0 1 1 -1.8,-1.8" fill="none" stroke="#4A453C" stroke-width="0.6" stroke-linecap="round"/>`;
  }
  // ——— la galerie : les consoles, la dalle, la rambarde de derrière ———
  const RG = R1 + 13, yG = -Z1;
  for (let k = 0; k < 9; k++) {
    const th = Math.PI * (0.06 + 0.88 * (k / 8)), x = Math.cos(th) * (R1 + 1), y = yG + Math.sin(th) * (R1 + 1) / 2, x2 = Math.cos(th) * (RG - 2), y2 = yG + Math.sin(th) * (RG - 2) / 2;
    o += `<path d="M${f2(x)},${f2(y + 10)} L${f2(x)},${f2(y + 1)} L${f2(x2)},${f2(y2 + 1)} Q${f2((x + x2) / 2)},${f2((y + y2) / 2 + 3)} ${f2(x)},${f2(y + 10)} Z" fill="${th > Math.PI / 2 ? '#6A7383' : '#454C5A'}"${EDGE}/>`;
  }
  defs += lin(id('g'), [[0, '#9AA3B0'], [0.5, '#6E7787'], [1, '#434A58']]);
  o += `<path d="M${-RG},${yG} L${-RG},${yG + 5} A${RG},${RG / 2} 0 0 0 ${RG},${yG + 5} L${RG},${yG} Z" fill="url(#${id('g')})"${EDGE}/>`;
  o += `<ellipse cx="0" cy="${yG}" rx="${RG}" ry="${RG / 2}" fill="#8892A0"${EDGE}/><ellipse cx="0" cy="${f2(yG - 0.6)}" rx="${RG - 4}" ry="${f2((RG - 4) / 2)}" fill="#7A8392"/>`;
  const RR = RG - 2, HR = 11, yR = yG - HR;
  const poteau = (th, casse = false) => { const x = Math.cos(th) * RR, y = yG + Math.sin(th) * RR / 2; return `<path d="M${f2(x)},${f2(y)} L${f2(x + (casse ? 2.6 : 0))},${f2(y - (casse ? 6 : HR))}" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="M${f2(x)},${f2(y)} L${f2(x + (casse ? 2.6 : 0))},${f2(y - (casse ? 6 : HR))}" stroke="#4E555E" stroke-width="0.9" stroke-linecap="round"/>`; };
  const rail = (sweep, a0, a1) => { const p = a => [Math.cos(a) * RR, yR + Math.sin(a) * RR / 2]; const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0; const d = `M${pt(p(a0))} A${RR},${RR / 2} 0 ${large} ${sweep} ${pt(p(a1))}`; return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.1"/><path d="${d}" fill="none" stroke="#5A626C" stroke-width="0.9"/>`; };
  for (let k = 0; k <= 8; k++) o += poteau(Math.PI + Math.PI * (k / 8));
  o += rail(1, Math.PI, 2 * Math.PI);
  // ——— la lanterne : le soubassement, le verre du fond, la lentille (ou rien), les montants, le verre de devant ———
  const RL = R1 - 1.5, zL0 = Z1 + 12, zL1 = zL0 + 52, yL0 = -zL0, yL1 = -zL1;
  defs += lin(id('l'), [[0, '#8E98A6'], [0.5, '#626B7B'], [1, '#3C4350']]);
  o += `<path d="M${-RL - 2},${yG} L${-RL - 2},${f2(yL0)} A${RL + 2},${(RL + 2) / 2} 0 0 0 ${RL + 2},${f2(yL0)} L${RL + 2},${yG} A${RL + 2},${(RL + 2) / 2} 0 0 1 ${-RL - 2},${yG} Z" fill="url(#${id('l')})"${EDGE}/>`;
  o += `<ellipse cx="0" cy="${f2(yL0)}" rx="${RL + 2}" ry="${f2((RL + 2) / 2)}" fill="#6E7787"${EDGE}/>`;
  // l'intérieur : le fond sombre du verre de derrière (éteint) ; vide, le verre de derrière est clair : on voit au travers
  const cage = `M${-RL},${f2(yL1)} L${-RL},${f2(yL0)} A${RL},${RL / 2} 0 0 0 ${RL},${f2(yL0)} L${RL},${f2(yL1)} A${RL},${RL / 2} 0 0 0 ${-RL},${f2(yL1)} Z`;
  if (etat === 'eteint') {
    defs += lin(id('v'), [[0, '#2E4550'], [1, '#18242C']], 0, 0, 0, 1);
    o += `<path d="${cage}" fill="url(#${id('v')})"/>`;
  } else o += `<path d="${cage}" fill="#6E8C98" opacity="0.18"/>`;
  // les montants de derrière (vus à travers le verre)
  for (let k = 1; k < 6; k++) { const a = Math.PI + Math.PI * (k / 6), x = Math.cos(a) * RL; o += `<path d="M${f2(x)},${f2(yL0 + Math.sin(a) * RL / 2)} L${f2(x)},${f2(yL1 + Math.sin(a) * RL / 2)}" stroke="${FER}" stroke-opacity="0.7" stroke-width="0.9"/>`; }
  // le socle de la lentille (laiton), puis la lentille des Anciens : un œuf de verre à prismes, froid, un éclat de lune
  const yc = (yL0 + yL1) / 2 + 2;
  o += `<path d="M-5,${f2(yL0 + 2)} L-3.6,${f2(yL0 - 5)} L3.6,${f2(yL0 - 5)} L5,${f2(yL0 + 2)} Z" fill="#8A7650"${EDGE}/><ellipse cx="0" cy="${f2(yL0 - 5)}" rx="4.6" ry="1.6" fill="#A8925E"${EDGE}/>`;
  if (etat === 'eteint') {
    defs += rad(id('e'), [[0, '#DDEBE6'], [0.45, '#A9C2BC'], [1, '#5E7A76']], -3, yc - 6, 16);
    o += `<ellipse cx="0" cy="${f2(yc)}" rx="10.5" ry="16" fill="url(#${id('e')})"${EDGE}/>`;
    for (let k = -3; k <= 3; k++) { if (!k) continue; const yy = yc + k * 4.2, rx = 10.5 * Math.sqrt(1 - Math.pow((k * 4.2) / 16, 2)); o += `<path d="M${f2(-rx)},${f2(yy)} Q0,${f2(yy + 1.8)} ${f2(rx)},${f2(yy)}" fill="none" stroke="#4E6864" stroke-width="0.6"/><path d="M${f2(-rx * 0.9)},${f2(yy - 0.7)} Q${f2(-rx * 0.3)},${f2(yy + 0.3)} ${f2(-rx * 0.05)},${f2(yy - 0.2)}" fill="none" stroke="#F2FAF8" stroke-opacity="0.55" stroke-width="0.5"/>`; }
    o += `<ellipse cx="0" cy="${f2(yc)}" rx="4" ry="4.6" fill="none" stroke="#4E6864" stroke-width="0.6"/><ellipse cx="-0.6" cy="${f2(yc - 0.6)}" rx="1.8" ry="2.2" fill="#E8F4F2" opacity="0.8"/>`;
    // l'éclat de lune, en haut à gauche
    o += `<path d="M-5,${f2(yc - 10.5)} l0.7,-2.6 l0.7,2.6 l2.6,0.7 l-2.6,0.7 l-0.7,2.6 l-0.7,-2.6 l-2.6,-0.7 Z" fill="#FFFFFF"/>`;
  } else {
    // les pinces vides, tordues, où tenait la lentille
    o += `<path d="M-3,${f2(yL0 - 5)} q-2,-6 -0.6,-10 M3,${f2(yL0 - 5)} q2.4,-5 0.8,-9" fill="none" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M-3,${f2(yL0 - 5)} q-2,-6 -0.6,-10 M3,${f2(yL0 - 5)} q2.4,-5 0.8,-9" fill="none" stroke="#A8925E" stroke-width="0.8" stroke-linecap="round"/>`;
  }
  // le verre de devant, en losanges (les montants en hélice) ; vide : deux vitres brisées (le jour passe au travers)
  const avant = a => [Math.cos(a) * RL, Math.sin(a) * RL / 2];
  const vitres = [[0.02, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 0.98]];
  vitres.forEach(([t0, t1], k) => {
    const a0 = Math.PI * (1 - t0), a1 = Math.PI * (1 - t1), [x0, d0] = avant(a0), [x1, d1] = avant(a1);
    const vitre = `M${f2(x0)},${f2(yL1 + d0)} L${f2(x0)},${f2(yL0 + d0)} L${f2(x1)},${f2(yL0 + d1)} L${f2(x1)},${f2(yL1 + d1)} Z`;
    if (etat === 'vide' && (k === 1 || k === 3)) {
      // brisée : il reste des éclats sur le bord
      o += `<path d="M${f2(x0)},${f2(yL0 + d0)} L${f2(x0)},${f2(yL0 + d0 - 14)} L${f2(x0 + (x1 - x0) * 0.3)},${f2(yL0 + d0 - 6)} L${f2(x0 + (x1 - x0) * 0.6)},${f2(yL0 + (d0 + d1) / 2 - 9)} L${f2(x1)},${f2(yL0 + d1 - 4)} L${f2(x1)},${f2(yL0 + d1)} Z" fill="#9CC0CC" opacity="0.5"/>`;
    } else {
      defs += lin(id(`r${k}`), [[0, '#B8D6DE', etat === 'eteint' ? 0.32 : 0.45], [0.55, '#7FA4B0', 0.12], [1, '#5E8490', 0.22]], 0, 0, 1, 1);
      o += `<path d="${vitre}" fill="url(#${id(`r${k}`)})"/>`;
    }
  });
  // un reflet de ciel, en biais, sur le verre de gauche
  o += `<path d="M${f2(-RL + 2.4)},${f2(yL1 + 6)} L${f2(-RL + 6.4)},${f2(yL1 + 3)} L${f2(-RL + 4.6)},${f2(yL0 - 4)} L${f2(-RL + 1.6)},${f2(yL0 - 2)} Z" fill="#FFFFFF" opacity="0.28"/>`;
  // les montants de devant et les croisillons en hélice
  for (let k = 0; k <= 6; k++) { const a = Math.PI * (1 - k / 6), [x, d] = avant(a); o += `<path d="M${f2(x)},${f2(yL0 + d)} L${f2(x)},${f2(yL1 + d)}" stroke="${OUT}" stroke-width="2"/><path d="M${f2(x)},${f2(yL0 + d)} L${f2(x)},${f2(yL1 + d)}" stroke="#4A515A" stroke-width="0.8"/>`; }
  for (let k = 0; k < 5; k++) {
    const a0 = Math.PI * (1 - k / 5), a1 = Math.PI * (1 - (k + 1) / 5), [x0, d0] = avant(a0), [x1, d1] = avant(a1);
    o += `<path d="M${f2(x0)},${f2(yL0 + d0 - 2)} L${f2(x1)},${f2(yL1 + d1 + 2)}" stroke="${FER}" stroke-width="0.8" opacity="0.85"/>`;
  }
  o += `<path d="M${-RL},${f2(yL1)} A${RL},${RL / 2} 0 0 0 ${RL},${f2(yL1)}" fill="none" stroke="${OUT}" stroke-width="2.2"/><path d="M${-RL},${f2(yL1)} A${RL},${RL / 2} 0 0 0 ${RL},${f2(yL1)}" fill="none" stroke="#5A626C" stroke-width="1"/>`;
  o += `<path d="M${-RL},${f2(yL0)} A${RL},${RL / 2} 0 0 0 ${RL},${f2(yL0)}" fill="none" stroke="${OUT}" stroke-width="1.6"/>`;
  // ——— le dôme de cuivre vert-de-gris, ses côtes, sa boule d'aération, la girouette en mouette ———
  const RD = RL + 3.5, yD = yL1, hD = 30;
  defs += rad(id('k'), [[0, CUIVRE.clair], [0.55, CUIVRE.milieu], [1, CUIVRE.ombre]], -RD * 0.4, yD - hD * 0.8, RD * 1.8);
  o += `<path d="M${-RD},${f2(yD)} Q${-RD},${f2(yD - hD * 0.75)} 0,${f2(yD - hD)} Q${RD},${f2(yD - hD * 0.75)} ${RD},${f2(yD)} A${RD},${f2(RD / 2.2)} 0 0 1 ${-RD},${f2(yD)} Z" fill="url(#${id('k')})"${EDGE}/>`;
  for (const t of [0.2, 0.4, 0.6, 0.8]) { const x = (t - 0.5) * 2 * RD, yb = yD + Math.sqrt(1 - Math.pow(x / RD, 2)) * RD / 2.2; o += `<path d="M0,${f2(yD - hD)} Q${f2(x * 0.9)},${f2(yD - hD * 0.62)} ${f2(x)},${f2(yb)}" fill="none" stroke="${CUIVRE.trait}" stroke-width="0.7" opacity="0.8"/>`; }
  o += `<path d="M${-RD + 0.6},${f2(yD - 1)} A${RD},${f2(RD / 2.2)} 0 0 0 ${RD - 0.6},${f2(yD - 1)}" fill="none" stroke="${CUIVRE.clair}" stroke-opacity="0.6" stroke-width="0.8"/>`;
  for (const [x, l] of [[-6, 9], [3, 12], [9, 7]]) o += `<path d="M${x},${f2(yD + 2)} q0.4,${f2(l * 0.5)} -0.2,${l}" fill="none" stroke="#7FB8A2" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>`;
  o += `<ellipse cx="0" cy="${f2(yD + 0.4)}" rx="${RD}" ry="${f2(RD / 2.2)}" fill="none" stroke="${OUT}" stroke-width="1.2"/>`;
  defs += rad(id('o'), [[0, CUIVRE.clair], [1, CUIVRE.ombre]], -1.6, yD - hD - 6, 6);
  o += `<circle cx="0" cy="${f2(yD - hD - 4)}" r="4.4" fill="url(#${id('o')})"${EDGE}/>`;
  o += `<path d="M0,${f2(yD - hD - 8)} L0,${f2(yD - hD - 22)}" stroke="${OUT}" stroke-width="1.8"/><path d="M0,${f2(yD - hD - 8)} L0,${f2(yD - hD - 22)}" stroke="#55606A" stroke-width="0.8"/>`;
  // la girouette : une mouette de cuivre, un peu de travers
  o += `<g transform="translate(0 ${f2(yD - hD - 20)}) rotate(-8)"><path d="M-8,0 Q-4,-3.4 0,-1 Q4,-3.4 8,0 Q4,-1.4 0,1 Q-4,-1.4 -8,0 Z" fill="${CUIVRE.milieu}" stroke="${OUT}" stroke-width="0.6"/></g>`;
  // ——— devant : la rambarde de devant (cassée à droite), une mouette posée dessus ———
  for (let k = 0; k <= 8; k++) { if (k === 2) continue; o += poteau(Math.PI * (k / 8), k === 1); }
  o += rail(0, Math.PI, Math.PI * 0.32);
  o += mouettePosee(Math.cos(Math.PI * 0.72) * RR, yR + Math.sin(Math.PI * 0.72) * RR / 2 - 0.8, n % 4 < 2 ? -1 : 1, 0.8);
  // ——— devant : les rochers du premier plan, l'écume de devant, une mouette sur un rocher ———
  o += boulder(-0.8, 0.95, 0.38, 0.3, 12, ROC_MOUILLE, 9, 0.3, 0.5) + boulder(0.35, 1.25, 0.34, 0.26, 9, ROC_MOUILLE, 11, 0.32, 0.45) + boulder(1.15, 0.7, 0.3, 0.28, 11, ROC_MOUILLE, 13, 0.3, 0.5) + boulder(1.32, 0.42, 0.42, 0.34, 15, ROC_MOUILLE, 33, 0.3, 0.5) + boulder(-0.2, 1.32, 0.4, 0.3, 8, ROC_MOUILLE, 35, 0.34, 0.45);
  { const [x, y] = P(-0.8, 0.95, 12); o += mouettePosee(x + 1, y - 2, (n % 4 === 1 || n % 4 === 2) ? 1 : -1, 0.9); }
  o += ecume(n, true);
  // ——— les mouettes qui planent autour de la lanterne (elles battent des ailes, à contretemps) ———
  o += mouetteVol(-58, -Z1 - 30 + aile * 1.6, aile, 1, 1) + mouetteVol(-34, -Z1 - 92 + aile2 * 1.2, aile2, 0.8, 1) + mouetteVol(62, -Z1 + 18 - aile * 1.4, -aile, 0.9, -1);
  return `<defs>${defs}</defs>` + o;
}

export const ETATS = ['eteint', 'vide'];
