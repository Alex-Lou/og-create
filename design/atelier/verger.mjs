// Le verger par étapes (les chantiers du verger) : un arbre fruitier sur une case, du trou qu'on creuse au grand arbre
// chargé de fruits mûrs. Le trou (le tas de terre, la bêche), la plantation (le scion attaché à son tuteur, la cuvette,
// l'arrosoir qui goutte), le jeune arbre, la floraison (des pétales qui tombent, une abeille), les fruits verts, les
// fruits mûrs (quelques-uns tombés au pied). Cinq arbres : pommier, poirier, cerisier, prunier, abricotier. Chaque étape
// tourne en 3 images. Le trait, le feuillage et le grand arbre sont ceux d'arbres.js ; le cadre est celui d'un décor
// d'une case (PROP, ancre au centre de la case), comme les arbres de la bibliothèque.
import T from './troupe.js';
import A from './arbres.js';
import D from './deco.js';

const { OUT, E, r2 } = T;
export const CADRE = D.PROP;
export const ARBRES = ['pommier', 'poirier', 'cerisier', 'prunier', 'abricotier'];
export const ETAPES = ['trou', 'plantation', 'jeune', 'floraison', 'fruits_verts', 'mur'];
export const IMAGES = 3;

const BOIS = { left: '#9C6A43', right: '#74492C', clair: '#B98458' };
const TERRE = { trou: '#4E3020', bord: '#7A4E30', tas: '#8B5A34', clair: '#B07E54' };
const ln = (a, b, color, w = 1) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
const tk = (a, b, color, w) => ln(a, b, OUT, w + 1.6) + ln(a, b, color, w);
const rond = (x, y, r, fill, w = 0.8) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}" stroke="${OUT}" stroke-width="${w}"/>`;
const wave = (f, amp = 1, phase = 0) => Math.sin((f / IMAGES) * Math.PI * 2 + phase) * amp;

/* ---------- les espèces : fleurs, fruits ---------- */
const ESPECES = {
  pommier: { fleurs: ['#FFFFFF', '#F7B6C8'], fruit: 'pomme', couleur: '#E2574C', ombre: '#B83A35' },
  poirier: { fleurs: ['#FFFFFF', '#FFFFFF'], fruit: 'poire', couleur: '#D2D45A', ombre: '#9AA83A' },
  cerisier: { fleurs: ['#F7B6C8', '#FFFFFF'], fruit: 'cerise', couleur: '#B8203A', ombre: '#7E1428' },
  prunier: { fleurs: ['#FFFFFF', '#F4ECF8'], fruit: 'prune', couleur: '#7A4A9A', ombre: '#523070' },
  abricotier: { fleurs: ['#FFFFFF', '#F9D2DA'], fruit: 'abricot', couleur: '#F2A03A', ombre: '#D0702E' }
};
const VERT = { couleur: '#9CCB5A', ombre: '#6F9A3E' };
// Un fruit au point (x, y), taille s, couleurs { couleur, ombre }
function fruit(sorte, x, y, s, c) {
  const reflet = (dx, dy, r) => `<ellipse cx="${r2(x + dx * s)}" cy="${r2(y + dy * s)}" rx="${r2(r * s)}" ry="${r2(r * 1.25 * s)}" fill="#FFFFFF" opacity="0.8"/>`;
  const queue = (dy = -2) => `<path d="M${r2(x)},${r2(y + dy * s)} q${r2(0.2 * s)},${r2(-1.2 * s)} ${r2(0.9 * s)},${r2(-1.7 * s)}" stroke="${OUT}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
  if (sorte === 'cerise') {
    return `<path d="M${r2(x - 1.6 * s)},${r2(y)} Q${r2(x - 0.6 * s)},${r2(y - 3.6 * s)} ${r2(x + 0.4 * s)},${r2(y - 4.4 * s)} Q${r2(x + 0.6 * s)},${r2(y - 2.6 * s)} ${r2(x + 1.6 * s)},${r2(y + 0.4 * s)}" stroke="${OUT}" stroke-width="0.7" fill="none" stroke-linecap="round"/>`
      + rond(x - 1.6 * s, y + 0.6 * s, 1.5 * s, c.couleur, 0.7) + rond(x + 1.6 * s, y + 1 * s, 1.5 * s, c.couleur, 0.7)
      + reflet(-2.1, 0.1, 0.4) + reflet(1.1, 0.5, 0.4);
  }
  if (sorte === 'poire') {
    const d = `M${r2(x)},${r2(y - 2.8 * s)} Q${r2(x + 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.2 * s)},${r2(y - 0.6 * s)} Q${r2(x + 2.6 * s)},${r2(y + 0.6 * s)} ${r2(x + 2 * s)},${r2(y + 2 * s)} Q${r2(x)},${r2(y + 3.2 * s)} ${r2(x - 2 * s)},${r2(y + 2 * s)} Q${r2(x - 2.6 * s)},${r2(y + 0.6 * s)} ${r2(x - 1.2 * s)},${r2(y - 0.6 * s)} Q${r2(x - 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x)},${r2(y - 2.8 * s)} Z`;
    return `<path d="${d}" fill="${c.couleur}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>` + E(x + 0.9 * s, y + 1.4 * s, 1.1 * s, 0.9 * s, c.ombre, 0) + reflet(-0.8, 0.4, 0.4) + queue(-2.6);
  }
  const rx = sorte === 'prune' ? 2.1 : 2.5, ry = sorte === 'prune' ? 2.6 : 2.4;
  return `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rx * s)}" ry="${r2(ry * s)}" fill="${c.couleur}" stroke="${OUT}" stroke-width="0.8"/>`
    + E(x + 0.8 * s, y + 0.9 * s, rx * 0.6 * s, ry * 0.55 * s, c.ombre, 0)
    + (sorte === 'pomme' ? '' : `<path d="M${r2(x - 0.3 * s)},${r2(y - ry * s * 0.9)} Q${r2(x - 1 * s)},${r2(y)} ${r2(x - 0.2 * s)},${r2(y + ry * s * 0.85)}" stroke="${c.ombre}" stroke-width="0.6" fill="none"/>`)
    + reflet(-0.9, -0.5, sorte === 'prune' ? 0.35 : 0.45) + queue(-ry + 0.3);
}
// les fruits dans le houppier (sur les touffes de devant, deux sur celle du fond) ; ceux tombés au pied
const FRUITS = [[-26, -49], [-15, -58], [-31, -57], [-7, -46], [3, -66], [13, -50], [23, -45], [27, -55], [-3, -76], [14, -73]];
const TOMBES = [[12, 5], [-17, 6]];
const FLEURS = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];

/* ---------- le sol, les outils, les petites bêtes ---------- */
const ombre = (rx = 27) => E(3, 1.5, rx, rx * 0.44, 'rgba(40,55,20,0.22)', 0);
const touffeHerbe = (x, y) => A.herbe(x, y, '#86B852', 0.8);
function beche(x, y) {
  return `<polygon points="${r2(x - 2.4)},${r2(y - 5)} ${r2(x + 2.4)},${r2(y - 5.4)} ${r2(x + 2)},${r2(y + 0.6)} ${r2(x - 2)},${r2(y + 1)}" fill="#A9AFB8" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + tk([x + 0.1, y - 5.2], [x + 1.6, y - 20], BOIS.left, 1.4) + tk([x - 1, y - 20.2], [x + 4, y - 20.8], BOIS.clair, 1.3);
}
function arrosoir(x, y, f) {
  const gouttes = [0, 1, 2].map(i => { const t = ((f + i) % IMAGES) / IMAGES; return E(x - 13 - t * 2, y - 9 + t * 8, 0.6, 0.9, '#7FC4EA', 0); }).join('');
  return `<path d="M${r2(x - 4)},${r2(y - 7)} L${r2(x + 4)},${r2(y - 7)} L${r2(x + 3.4)},${r2(y)} L${r2(x - 3.4)},${r2(y)} Z" fill="#6E9FC0" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + tk([x - 3.6, y - 4], [x - 11, y - 10], '#6E9FC0', 1.1) + E(x - 11.6, y - 10.4, 1.4, 0.9, '#5A88A8', 0.6)
    + `<path d="M${r2(x - 2)},${r2(y - 7)} Q${r2(x)},${r2(y - 12)} ${r2(x + 2.6)},${r2(y - 7)}" stroke="${OUT}" stroke-width="1.6" fill="none"/>`
    + `<path d="M${r2(x - 2)},${r2(y - 7)} Q${r2(x)},${r2(y - 12)} ${r2(x + 2.6)},${r2(y - 7)}" stroke="#6E9FC0" stroke-width="0.7" fill="none"/>` + gouttes;
}
function abeille(x, y, f) {
  const dx = [0, 4, 1.6][f], dy = [0, -2, 1.4][f];
  return E(x + dx - 0.6, y + dy - 2, 1.4, 0.9, 'rgba(255,255,255,0.85)', 0.5) + E(x + dx + 0.8, y + dy - 2.2, 1.2, 0.8, 'rgba(255,255,255,0.85)', 0.5)
    + E(x + dx, y + dy, 2, 1.4, '#F2C04B', 0.6) + ln([x + dx - 0.4, y + dy - 1.3], [x + dx - 0.4, y + dy + 1.3], OUT, 0.6) + ln([x + dx + 0.8, y + dy - 1.2], [x + dx + 0.8, y + dy + 1.2], OUT, 0.6);
}
const petale = (x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT}" stroke-width="0.5" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
// le tuteur et son lien
const tuteur = (h, x = 4) => tk([x, 4], [x + 0.6, -h], BOIS.clair, 1.2);
const lien = (y, x0, x1) => tk([x0, y], [x1, y - 0.4], '#E8D8A8', 0.8);
// le jeune arbre : une tige fine, trois petites touffes
function jeune(id, s = 1) {
  const c = A.VERTS.doux.devant;
  const tige = `<path d="M-1.2,2 Q-1,-14 -0.4,-${r2(30 * s)} L1.2,-${r2(30 * s)} Q1.4,-14 1.6,2 Z" fill="${BOIS.left}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`;
  return tige + A.feuillage(id, [[-6, -32, 6.5], [6, -34, 7], [0, -42, 6.5]].map(([x, y, r]) => [x * s, y * s, r * s]), c, [[-4, -30], [4, -36, 0.8]], 1);
}

/* ---------- les étapes ---------- */
// Une étape d'un arbre, image n (0 à 2)
export function etape(arbre, quoi, n) {
  const e = ESPECES[arbre];
  if (!e) throw new Error(`arbre inconnu : ${arbre} (${ARBRES.join(', ')})`);
  if (!ETAPES.includes(quoi)) throw new Error(`étape inconnue : ${quoi} (${ETAPES.join(', ')})`);
  const f = n % IMAGES, id = `vg${arbre.slice(0, 3)}${quoi.slice(0, 3)}${f}`;
  if (quoi === 'trou') {
    // le trou creusé dans l'herbe, le tas de terre à côté, la bêche plantée dedans ; une motte qui roule
    const r = wave(f, 1.2);
    return ombre(20) + touffeHerbe(-16, 4) + touffeHerbe(15, 6)
      + E(0, 2, 11, 5, TERRE.bord, 0.9) + E(0, 2.6, 8.4, 3.6, TERRE.trou, 0)
      + E(-15, -0.6, 8, 4.4, TERRE.tas, 0.9) + E(-16, -2.2, 4.6, 2.2, TERRE.clair, 0) + E(-11 + r, 0.6, 1.6, 1, TERRE.tas, 0.6)
      + beche(10, 1.6);
  }
  if (quoi === 'plantation') {
    // le scion planté au milieu de sa cuvette, attaché au tuteur ; l'arrosoir verse
    const s = wave(f, 0.6);
    return ombre(14) + touffeHerbe(-17, 4)
      + E(0, 2, 10, 4.4, TERRE.bord, 0.9) + E(0, 2.2, 7.6, 3.2, TERRE.tas, 0) + E(-2, 1.4, 3, 1, 'rgba(90,140,180,0.45)', 0)
      + tuteur(26) + `<path d="M-0.6,2 Q-0.4,-10 ${r2(s * 0.4)},-22" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      + `<path d="M-0.6,2 Q-0.4,-10 ${r2(s * 0.4)},-22" stroke="${BOIS.left}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
      + [[-3, -16, -30], [3, -19, 30], [-2, -22, -20], [2.4, -24, 25]].map(([x, y, a], i) => `<ellipse cx="${r2(x + s * 0.4)}" cy="${y}" rx="2" ry="1.1" fill="${i % 2 ? '#A5D466' : '#68A64B'}" stroke="${OUT}" stroke-width="0.6" transform="rotate(${a} ${r2(x + s * 0.4)} ${y})"/>`).join('')
      + lien(-12, -0.4, 4.4) + arrosoir(23, 3, f);
  }
  if (quoi === 'jeune') return ombre(16) + tuteur(34) + jeune(id) + lien(-20, 0, 4.6) + touffeHerbe(-14, 4) + A.fleurette(12, 4, '#FFFFFF');
  if (quoi === 'floraison') {
    // l'arbre encore petit, couvert de fleurs ; des pétales tombent, une abeille butine
    const k = 0.76;
    const chute = [[-20, -30], [8, -20], [22, -36], [-8, -12]].map(([x, y], i) => petale(x * k + wave(f, 2, i), y + ((f * 6 + i * 9) % 18), (f * 50 + i * 70) % 360, e.fleurs[i % 2])).join('');
    return A.arbre({ vert: 'tendre', petit: true }) + FLEURS.map(([x, y], i) => A.fleurette(x * k, y * k, i % 3 ? e.fleurs[0] : e.fleurs[1])).join('') + chute + abeille(14, -52, f);
  }
  if (quoi === 'fruits_verts') {
    const k = 0.76, s = 0.85 * Math.max(k, 0.85);
    return A.arbre({ vert: 'doux', petit: true }) + FRUITS.map(([x, y]) => fruit(e.fruit, x * k, y * k + wave(f, 0.3, x), s, VERT)).join('');
  }
  // mûr : le grand arbre chargé, deux fruits tombés au pied, une abeille autour
  const s = 1.12;
  return A.arbre({ vert: 'doux' }) + FRUITS.map(([x, y]) => fruit(e.fruit, x, y + wave(f, 0.4, x), s, e)).join('')
    + TOMBES.map(([x, y]) => fruit(e.fruit, x, y, 1.05, e)).join('') + abeille(-12, 0, f);
}
