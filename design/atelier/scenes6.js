// Lot J2 — les scènes plein écran du tutoriel v6 (HISTOIRE.md § 9), dans le carré 400 × 400 du jeu (PrologueArt,
// recadré au centre : le sujet reste au milieu). Chaque scène : un fond (derrière l'avatar) et parfois un devant (ce qui
// passe devant lui), en petites boucles de 2 à 4 images (flammes, vagues, brume, pluie, Brume qui flotte).
// L'avatar n'est pas dessiné : sa place est notée et le jeu y pose l'avatar du joueur, tiré du générateur
// (design/personnages/avatar.js, design/atelier/avatar_naufrage.js) :
//   avatar : { x, y : ses pieds ; echelle ; vue : 'face' | 'avant' (trois quarts avant, regarde à droite) | 'dos'
//   (trois quarts dos, regarde vers le haut à droite) ; miroir : true s'il regarde à gauche ; pose : repos, marche,
//   salut, grelotter (de face) ; naufrage : sa tenue naufragée ou non ; cadre : [x, y, l, h] s'il est découpé dedans }.
// Le nom du joueur et les répliques ne sont pas dessinés : le jeu les écrit.
const { OUT, P, E, L, r2, frame } = require('./troupe');
const { brumeFrame } = require('./brume');
const { sleepFrame } = require('./dormeurs');
const { CAST } = require('./naufrages');
const { ZEDS } = require('./gestes');

const W = 400;
// les quatre fondateurs, en tenue (base) et en naufragés (nau)
const T = Object.fromEntries(CAST.filter(({ base }) => ['Cannelle', 'Rivet', 'Aster', 'Ondin'].includes(base.name)).map(({ base, nau }) => [base.name, { base, nau }]));

// ---- les palettes : la nuit, l'aube, le jour ----
const NUIT = { ciel: '#16213F', cielBas: '#2C3D63', mer: '#1E3552', merH: '#2E4E72', ecume: '#8FA9C4', sable: '#5E5B57', roche: '#3E4352', rocheH: '#545B6E', brume: '220,230,242' };
const AUBE = { ciel: '#5B6A9A', cielBas: '#F2B8A0', mer: '#4E6E96', merH: '#6E8EB4', ecume: '#E8D8D0', sable: '#B8A48A', roche: '#6E6A72', rocheH: '#8A8690', brume: '245,230,226' };
const JOUR = { ciel: '#7EB6E0', cielBas: '#CDE6F2', mer: '#3E8EB8', merH: '#5EAAD0', ecume: '#F4FAFC', sable: '#E8D3A6', roche: '#8E8A84', rocheH: '#ABA79F', brume: '255,255,255' };
const TEMPETE = { ciel: '#0E1530', cielBas: '#24345A' };

// ---- petits morceaux ----
const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const grad = (id, haut, bas) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs>`;
const ciel = (id, c, y1 = W) => grad(id, c.ciel, c.cielBas) + `<rect x="0" y="0" width="${W}" height="${y1}" fill="url(#${id})"/>`;
const etoiles = (pts, f) => pts.map(([x, y], i) => { const r = 1.5 + ((f + i) % 2) * 0.6; return E(x, y, r, r, '#F6EFDC', 0); }).join('');
// une nappe de brume : de longues ellipses pâles qui dérivent (f : image)
const nappe = (y, a, f, k = 1, c = NUIT) => [[-40, 0, 230], [170, 8, 260], [380, -4, 210]].map(([x, dy, rx]) => `<ellipse cx="${r2(x + f * 9 * k)}" cy="${r2(y + dy)}" rx="${rx}" ry="${r2(26 * k)}" fill="rgba(${c.brume},${a})"/>`).join('');
// la mer : une bande, des lignes d'écume qui avancent (f)
function mer(y0, y1, f, c = NUIT) {
  let s = `<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="${c.mer}"/>`;
  for (let i = 0; i < 4; i++) {
    const y = y0 + (y1 - y0) * (0.2 + i * 0.22), off = (f * 14 + i * 37) % 80;
    s += trait(Array.from({ length: 7 }, (_, k) => `M${r2(k * 80 - off)},${r2(y)} q20,-${3 + i} 40,0`).join(' '), i % 2 ? c.merH : c.ecume, r2(1.6 + i * 0.4), `opacity="${r2(0.55 + i * 0.1)}"`);
  }
  return s;
}
// le sable : une grève en pente douce, des galets
const sable = (y, c = NUIT) => P(`M0,${y} Q${W * 0.3},${y - 14} ${W * 0.55},${y - 6} Q${W * 0.8},${y + 2} ${W},${y - 10} L${W},${W} L0,${W} Z`, c.sable, 2)
  + [[60, y + 40, 9], [300, y + 30, 7], [350, y + 70, 11], [120, y + 90, 6]].map(([x, yy, r]) => E(x, yy, r, r * 0.6, c.roche, 1.6) + E(x - r * 0.3, yy - r * 0.2, r * 0.35, r * 0.2, c.rocheH, 0)).join('');
// un rocher massif (pied gauche en x, y ; largeur w ; hauteur h)
const rocher = (x, y, w, h, c = NUIT) => P(`M${x},${y} Q${r2(x - w * 0.06)},${r2(y - h * 0.7)} ${r2(x + w * 0.3)},${r2(y - h)} Q${r2(x + w * 0.6)},${r2(y - h * 1.12)} ${r2(x + w * 0.86)},${r2(y - h * 0.8)} Q${r2(x + w * 1.04)},${r2(y - h * 0.4)} ${r2(x + w)},${y} Z`, c.roche, 2.4)
  + P(`M${r2(x + w * 0.58)},${r2(y - h * 1.04)} Q${r2(x + w * 0.9)},${r2(y - h * 0.8)} ${r2(x + w)},${y} L${r2(x + w * 0.66)},${y} Q${r2(x + w * 0.74)},${r2(y - h * 0.5)} ${r2(x + w * 0.58)},${r2(y - h * 1.04)} Z`, 'rgba(0,0,0,.18)', 0)
  + L([x + w * 0.2, y - h * 0.8], [x + w * 0.4, y - h * 0.96], c.rocheH, 3);
// la pluie en biais (f décale)
const pluie = (f, a = 0.35) => Array.from({ length: 46 }, (_, i) => { const x = (i * 53 + f * 21) % 440 - 20, y = (i * 97 + f * 37) % 420 - 20; return `<path d="M${x},${y} l-14,22" stroke="rgba(190,210,235,${a})" stroke-width="1.4" stroke-linecap="round"/>`; }).join('');
// un personnage de la troupe posé dans la scène : pieds en (x, y), échelle s, miroir m (−1)
const poser = (body, x, y, s, m = 1) => `<g transform="translate(${r2(x - 24 * s * m)} ${r2(y - 62 * s)}) scale(${r2(s * m)} ${r2(s)})">${body}</g>`;
// Brume au stade 0 (pâle, tremblante) : le bas de sa flamme en (x, y), échelle s
const brume = (x, y, s, n, expr = 'neutre') => `<g transform="translate(${r2(x - 20 * s)} ${r2(y - 32 * s)}) scale(${r2(s)})">${brumeFrame('s0', n % 4, expr)}</g>`;
// une lueur ronde (feu, Brume, lucioles)
const lueur = (x, y, r, rgb, a) => [1, 0.7, 0.45].map((k, i) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * k)}" fill="rgba(${rgb},${r2(a * (0.25 + i * 0.25))})"/>`).join('');
const etincelle = (x, y, s) => `<path d="M${r2(x)},${r2(y - 4 * s)} L${r2(x + s)},${r2(y - s)} L${r2(x + 4 * s)},${r2(y)} L${r2(x + s)},${r2(y + s)} L${r2(x)},${r2(y + 4 * s)} L${r2(x - s)},${r2(y + s)} L${r2(x - 4 * s)},${r2(y)} L${r2(x - s)},${r2(y - s)} Z" fill="#FFF3B0" stroke="#E8B84A" stroke-width="${r2(0.6 * s)}" stroke-linejoin="round"/>`;
const texte = (x, y, t, size, col, extra = '', ancre = 'middle') => `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="${col}" text-anchor="${ancre}" ${extra}>${t}</text>`;
const lucioles = (pts, f) => pts.map(([x, y], i) => { const yy = y + ((f + i) % 2) * 3; return lueur(x, yy, 8, '255,236,150', 0.5) + E(x, yy, 1.8, 1.8, '#FFF3A0', 0); }).join('');

// ---- les décors communs ----
// Le feu de camp : un cercle de galets, du bois flotté, des flammes qui dansent ; force : 0 une étincelle, 1 petit, 2 grand
function feu(x, y, s, f, force = 2) {
  const k = [0.25, 0.55, 1][force];
  const fl = (dx, h, w, col, ph) => { const sway = [0, 2, -2, 1][(f + ph) % 4]; return P(`M${r2(x + dx * s - w * s)},${r2(y)} Q${r2(x + dx * s - w * s * 0.8)},${r2(y - h * s * 0.6)} ${r2(x + dx * s + sway * s)},${r2(y - h * s)} Q${r2(x + dx * s + w * s * 0.8)},${r2(y - h * s * 0.6)} ${r2(x + dx * s + w * s)},${r2(y)} Z`, col, 0); };
  let s0 = force ? lueur(x, y - 14 * s, 70 * s * k, '255,190,90', 0.5) : '';
  s0 += [-16, -8, 0, 8, 16].map((dx, i) => E(x + dx * s, y + (i % 2 ? 2 : 3) * s, 4.6 * s, 3 * s, '#8A857C', 1.4)).join('')
    + L([x - 13 * s, y + 1 * s], [x + 12 * s, y - 3 * s], OUT, 7 * s) + L([x - 13 * s, y + 1 * s], [x + 12 * s, y - 3 * s], '#9A6E44', 4.6 * s)
    + L([x - 11 * s, y - 3 * s], [x + 13 * s, y + 1 * s], OUT, 7 * s) + L([x - 11 * s, y - 3 * s], [x + 13 * s, y + 1 * s], '#B07E50', 4.6 * s);
  if (!force) return s0 + etincelle(x + [0, 3, -2, 1][f % 4] * s, y - 6 * s, 1.4 * s);
  return s0 + fl(-5, 26 * k, 7 * k, '#E8562E', 0) + fl(4, 30 * k, 7 * k, '#F28A2E', 1) + fl(0, 22 * k, 5 * k, '#FFD15A', 2) + fl(-1, 12 * k, 3 * k, '#FFF3B0', 3);
}
// L'épave de l'Hirondelle au loin : un petit navire de croisière blanc, couché sur le flanc, une cheminée rayée
const epave = (x, y, s, a = 1) => `<g transform="translate(${x} ${y}) rotate(-14) scale(${s})" opacity="${a}">`
  + P('M-60,0 L56,0 L66,-14 L-66,-14 Z', '#E8E4DA', 2) + P('M-58,0 L54,0 L60,8 L-50,8 Z', '#B8483A', 2)
  + P('M-40,-14 L34,-14 L30,-30 L-36,-30 Z', '#F4F0E6', 2) + `<rect x="6" y="-48" width="14" height="18" fill="#F2C04B" stroke="${OUT}" stroke-width="2"/><rect x="6" y="-44" width="14" height="4" fill="#3E5A8C"/>`
  + [-50, -36, -22, -8, 6, 20, 34, 48].map(px => E(px, -7, 3, 3, '#5E7A9E', 1.2)).join('')
  + [-28, -16, -4, 8, 20].map(px => `<rect x="${px - 3}" y="-25" width="6" height="6" fill="#5E7A9E" stroke="${OUT}" stroke-width="1"/>`).join('') + '</g>';
// Les ruines du village : un pan de mur effondré, un puits sec, une porte sans maison
function ruines() {
  const pierre = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#7C7A82" stroke="${OUT}" stroke-width="1.6"/>`;
  let s = '';
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4 - (i % 3); j++) s += pierre(36 + i * 22 + (j % 2) * 8, 226 - j * 14, 20, 13);
  s += P('M256,240 L256,176 Q281,150 306,176 L306,240 L298,240 L298,180 Q281,162 264,180 L264,240 Z', '#7C7A82', 2) + P('M264,240 L264,180 Q281,162 298,180 L298,240 Z', '#232029', 1.4);
  s += `<rect x="150" y="218" width="52" height="24" fill="#7C7A82" stroke="${OUT}" stroke-width="2"/>` + E(176, 242, 26, 8, '#7C7A82', 2) + E(176, 218, 26, 8, '#232029', 2)
    + [[156, 218, 156, 186], [196, 218, 196, 186], [152, 186, 200, 186]].map(([a, b, c, d]) => L([a, b], [c, d], OUT, 4.4) + L([a, b], [c, d], '#8A6A48', 2.2)).join('');
  return s;
}
// Le Grimoire fermé de sept sceaux (cuir brun, coins de laiton) ; centre en (x, y)
function grimoire(x, y, s, r = -6) {
  const sc = ['#E8584A', '#F2C04B', '#7EC45B', '#5EA8E8', '#B07EE0', '#F28A2E', '#E8E4DA'];
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + lueur(0, -2, 34, '255,220,150', 0.3)
    + `<rect x="-26" y="-18" width="52" height="36" rx="3" fill="#6B3E24" stroke="${OUT}" stroke-width="2.2"/><rect x="-22" y="-14" width="44" height="28" rx="2" fill="none" stroke="#C8A052" stroke-width="1.4"/>`
    + [[-26, -18], [26, -18], [-26, 18], [26, 18]].map(([cx, cy]) => E(cx, cy, 3.4, 3.4, '#C8A052', 1.2)).join('')
    + sc.map((col, i) => E(-18 + i * 6, 0, 2.6, 2.6, col, 1)).join('') + '</g>';
}
// La carte d'embarquement de l'Hirondelle : en-tête, cadre de la photo (l'avatar s'y pose), ligne du nom
const CADRE_PHOTO = [92, 150, 96, 116];
function carte(tampon = false) {
  const [px, py, pw, ph] = CADRE_PHOTO;
  let s = `<rect x="70" y="96" width="260" height="196" rx="10" fill="#F6EFDC" stroke="${OUT}" stroke-width="3"/>`
    + `<path d="M70,134 L70,106 Q70,96 80,96 L320,96 Q330,96 330,106 L330,134 Z" fill="#2E4E8C" stroke="${OUT}" stroke-width="3"/>`
    + texte(214, 122, 'L’HIRONDELLE', 19, '#F6EFDC', 'font-weight="bold" letter-spacing="3"')
    + P('M90,116 q8,-8 18,-2 q6,-6 14,-2 q-8,2 -12,8 q-8,-4 -20,-4 Z', '#F6EFDC', 0)
    + `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="4" fill="#DCE6F0" stroke="${OUT}" stroke-width="2.4"/>`
    + texte(258, 168, 'Carte d’embarquement', 13, '#2E4E8C', 'font-style="italic"')
    + texte(206, 202, 'Nom', 11, '#6B5A48', '', 'start') + L([206, 222], [314, 222], '#8A7A64', 1.6)
    + texte(206, 248, 'Cabine', 11, '#6B5A48', '', 'start') + texte(300, 248, '7', 13, '#2E4E8C')
    + L([206, 256], [314, 256], '#8A7A64', 1.2);
  if (tampon) s += `<g transform="rotate(-14 250 266)" opacity="0.88"><rect x="198" y="249" width="104" height="32" rx="6" fill="none" stroke="#C8463A" stroke-width="3.4"/>${texte(250, 272, 'EMBARQUÉ', 16, '#C8463A', 'font-weight="bold" letter-spacing="1.5"')}</g>`;
  return s;
}
const ETOILES = [[40, 40], [120, 70], [340, 50], [370, 120], [30, 320], [360, 340], [200, 30], [60, 200]];
// des débris de l'Hirondelle : une planche, la chaise longue rayée retournée
const planche = (x, y, w, r) => `<g transform="rotate(${r} ${x + w / 2} ${y})"><rect x="${x}" y="${y}" width="${w}" height="9" rx="2" fill="#8A6A48" stroke="${OUT}" stroke-width="1.8"/></g>`;
const chaiseLongue = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M-38,0 L38,0 L30,-16 L-30,-16 Z', '#E8E2D4', 2)}${[-24, -8, 8, 24].map(cx => `<rect x="${cx - 4}" y="-15" width="8" height="15" fill="#3E78C8" opacity="0.8"/>`).join('')}${L([-30, -2], [-40, 18], OUT, 3)}${L([30, -2], [40, 18], OUT, 3)}</g>`;
// la Grève de nuit, la mer au fond, la brume (la base des scènes de l'étape 2)
const greveNuit = (id, f, horizon = 250) => ciel(id, NUIT, horizon) + mer(horizon - 54, horizon, f) + nappe(horizon - 40, 0.2, f) + sable(horizon);

// ---- les scènes ----
// Chaque scène : titre, étapes de HISTOIRE.md § 9, images, ms (par image), fond(f), devant(f) facultatif, avatar
const SCENES = {};
const S = (id, o) => { SCENES[id] = o; };

// Étape 0a-0b — la carte d'embarquement ; la photo de l'avatar s'y compose, le nom s'écrit sous la photo
S('00_carte', {
  titre: 'La carte d’embarquement de l’Hirondelle', etapes: ['0a', '0b'], images: 2, ms: 900,
  fond: f => ciel('c0', NUIT) + etoiles(ETOILES, f) + carte(false),
  // la photo : l'avatar de face, découpé au buste dans le cadre de la photo
  avatar: { x: 140, y: 340, echelle: 2.7, vue: 'face', pose: 'repos', naufrage: false, cadre: CADRE_PHOTO }
});
// Étape 0c — le tampon « Embarqué », puis le vent du large emporte la carte (la photo est déjà dans la carte : le jeu
// la garde de la scène précédente)
S('00_tampon', {
  titre: 'Embarqué : le vent emporte la carte', etapes: ['0c'], images: 3, ms: 500,
  fond: f => {
    const [dx, dy, k] = [[0, 0, 1], [40, -30, 0.8], [130, -110, 0.45]][f];
    return ciel('c1', NUIT) + etoiles(ETOILES, f)
      + (f ? trait('M20,260 q60,-30 120,-10 q60,20 120,-20 M60,320 q70,-24 140,-4', 'rgba(220,230,242,.45)', 3) : '')
      + `<g transform="translate(${200 + dx} ${200 + dy}) rotate(${f * 18}) scale(${k}) translate(-200 -200)">${carte(true)}</g>`;
  },
  avatar: null
});
// Étape 1a — le pont de l'Hirondelle, la nuit, dans la tempête ; l'avatar agrippé au bastingage
S('01_pont', {
  titre: 'Le pont de l’Hirondelle dans la tempête', etapes: ['1a'], images: 3, ms: 160,
  fond: f => {
    let s = ciel('pc', TEMPETE, 260);
    // la mer démontée, une grosse vague au loin
    s += mer(200, 300, f) + P(`M0,${230 - f * 3} Q90,${170 - f * 6} 170,${210 - f * 2} Q240,240 320,${200 - f * 4} Q370,180 400,210 L400,300 L0,300 Z`, '#203A5C', 2) + trait(`M80,${195 - f * 4} q30,-10 60,8 M250,${210 - f * 3} q30,-12 60,4`, '#9FB6CF', 3);
    // le pont de bois, le mât et les guirlandes qui battent
    s += P('M0,300 L400,300 L400,400 L0,400 Z', '#6B4E36', 2) + [318, 342, 370].map(y => L([0, y], [400, y], '#5A3F2A', 2)).join('');
    s += `<rect x="330" y="20" width="12" height="285" fill="#C9B79A" stroke="${OUT}" stroke-width="2"/>`;
    const guirlande = (x0, y0, x1, y1, ph) => {
      const cy = (y0 + y1) / 2 + 40 + [0, 10, -6][(f + ph) % 3];
      let g = P(`M${x0},${y0} Q${(x0 + x1) / 2},${cy} ${x1},${y1}`, 'none', 1.6);
      for (let k = 1; k < 8; k++) {
        const t = k / 8, x = (1 - t) ** 2 * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t * t * y1;
        g += lueur(x, y + 6, 9, '255,220,140', 0.25) + E(x, y + 6, 3.4, 4.4, ['#FFD15A', '#F27A5A', '#7EC4E8', '#9BE07A'][k % 4], 1.2);
      }
      return g;
    };
    s += guirlande(-10, 60, 336, 40, 0) + guirlande(-10, 130, 336, 110, 1);
    // le bastingage blanc, une bouée
    s += [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${i * 50 + 4}" y="250" width="7" height="58" fill="#EDE6D8" stroke="${OUT}" stroke-width="1.6"/>`).join('')
      + `<rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>`
      + E(84, 268, 22, 22, '#E8562E', 2.4) + E(84, 268, 11, 11, '#6B4E36', 2) + [0, 90, 180, 270].map(a => `<rect x="80" y="246" width="8" height="10" fill="#F4EEDF" transform="rotate(${a + 45} 84 268)"/>`).join('');
    return s + pluie(f, 0.4);
  },
  devant: f => pluie(f + 1, 0.25),
  avatar: { x: 232, y: 352, echelle: 3.4, vue: 'face', pose: 'grelotter', naufrage: false }
});
// Étape 1b — une vague énorme couvre l'écran
S('01_vague', {
  titre: 'La vague', etapes: ['1b'], images: 3, ms: 260,
  fond: f => {
    const h = [130, 250, 440][f];
    let s = ciel('vg', TEMPETE) + `<rect x="0" y="250" width="400" height="150" fill="#6B4E36"/><rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>`;
    s += P(`M-20,420 L-20,${400 - h} Q120,${360 - h * 1.25} 260,${380 - h * 1.1} Q330,${388 - h * 1.15} 360,${410 - h} Q330,${420 - h * 0.9} 300,${426 - h * 0.86} L420,${430 - h * 0.7} L420,420 Z`, '#1E3A60', 3)
      + trait(`M10,${410 - h * 0.95} Q130,${370 - h * 1.15} 250,${392 - h * 1.05}`, '#9FB6CF', 4) + trait(`M260,${380 - h * 1.1} q60,-4 96,28`, '#E8F0F8', 5);
    return s + pluie(f, 0.35);
  },
  avatar: null
});
// Étape 1b — le noir ; la mer, très loin
S('01_noir', {
  titre: 'Le noir ; la mer, très loin', etapes: ['1b'], images: 2, ms: 1200,
  fond: f => `<rect x="0" y="0" width="400" height="400" fill="#05080F"/>` + trait(`M60,${300 + f} q35,-3 70,0 t70,0 t70,0 t70,0`, 'rgba(120,150,190,.35)', 2) + trait(`M120,${312 - f} q30,-2 60,0 t60,0 t60,0`, 'rgba(120,150,190,.2)', 1.6),
  avatar: null
});
// Étape 1c — la Grève, la nuit, dans la brume ; des débris, une chaise longue retournée ; l'avatar se redresse, grelotte
S('01_greve', {
  titre: 'La Grève, la nuit, dans la brume', etapes: ['1c'], images: 3, ms: 400,
  fond: f => ciel('gc', NUIT, 240) + lueur(300, 70, 60, '220,230,245', 0.25) + E(300, 70, 16, 16, '#DCE4EF', 0)
    + mer(190, 250, f) + nappe(200, 0.18, f) + sable(250) + planche(40, 296, 96, -8) + planche(300, 326, 70, 12) + chaiseLongue(300, 286, 168) + nappe(300, 0.14, f, 1.2),
  devant: f => nappe(370, 0.16, -f, 1.4),
  avatar: { x: 200, y: 344, echelle: 3.6, vue: 'face', pose: 'grelotter', naufrage: true }
});
// Étape 1d — un gilet de sauvetage s'échoue à ses pieds, « L'HIRONDELLE » au pochoir ; seule la mer répond
S('01_gilet', {
  titre: 'Le gilet de sauvetage de l’Hirondelle', etapes: ['1d'], images: 3, ms: 420,
  fond: f => {
    let s = ciel('gl', NUIT, 150) + mer(130, 214, f) + P('M0,214 Q200,200 400,210 L400,400 L0,400 Z', NUIT.sable, 2);
    // la vague qui monte et redescend sur le sable, le gilet qu'elle dépose
    s += P(`M0,${214 + f * 8} Q100,${206 + f * 9} 200,${218 + f * 6} Q300,${230 + f * 4} 400,${212 + f * 7} L400,208 Q200,198 0,212 Z`, 'rgba(220,232,245,.5)', 0);
    s += `<g transform="translate(${272 - f * 4} ${318 - f * 6}) rotate(${-12 + f * 3}) scale(0.9)">`
      + P('M-60,-36 Q-62,-48 -40,-50 L-14,-50 Q-8,-30 0,-30 Q8,-30 14,-50 L40,-50 Q62,-48 60,-36 L56,34 Q56,46 40,46 L-40,46 Q-56,46 -56,34 Z', '#F28A2E', 3)
      + L([0, -30], [0, 46], '#C86A1E', 2) + `<rect x="-56" y="-4" width="112" height="9" fill="#E8E4DA" stroke="${OUT}" stroke-width="1.6"/>`
      + texte(0, 28, 'L’HIRONDELLE', 10.5, '#3C2819', 'font-weight="bold" letter-spacing="0.6" opacity="0.75"') + '</g>';
    return s + nappe(170, 0.16, f);
  },
  avatar: { x: 128, y: 372, echelle: 3.6, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 2a — une lueur pâle erre dans la brume, s'arrête, repart
S('02_lueur', {
  titre: 'Une lueur erre dans la brume', etapes: ['2a'], images: 4, ms: 600,
  fond: f => {
    const [bx, by] = [[300, 196], [262, 180], [292, 168], [330, 186]][f];
    return greveNuit('lu', f, 240) + lueur(bx, by - 10, 40, '200,225,240', 0.4) + brume(bx, by, 1.2, f) + nappe(232, 0.2, -f, 1.3);
  },
  devant: f => nappe(370, 0.14, f, 1.4),
  avatar: { x: 120, y: 384, echelle: 3.4, vue: 'dos', pose: 'repos', naufrage: true }
});
// Étape 2b — elle approche d'un coup : une flamme, deux grands yeux ; l'avatar recule d'un pas
S('02_approche', {
  titre: 'Brume approche d’un coup', etapes: ['2b'], images: 2, ms: 300,
  fond: f => greveNuit('ap', f, 260) + lueur(270, 200, 110, '200,225,240', 0.4) + brume(270, 300, 3.8, f, 'surpris'),
  devant: f => nappe(384, 0.14, f, 1.4),
  avatar: { x: 108, y: 376, echelle: 3.6, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 2c — Brume sursaute aussi, file derrière un rocher et passe la tête
S('02_rocher', {
  titre: 'Brume se cache derrière un rocher', etapes: ['2c'], images: 2, ms: 500,
  fond: f => greveNuit('ro', f) + lueur(290, 186, 60, '200,225,240', 0.4) + brume(290, 200 - f * 4, 2.4, f, 'gene') + rocher(216, 300, 160, 86),
  avatar: { x: 116, y: 366, echelle: 3.4, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 2d — elle sort, tourne autour de l'avatar, bien trop près, et l'examine (elle passe devant lui à la 4e image)
const TOUR = [[300, 250, 0], [214, 152, 0], [100, 262, 0], [222, 330, 1]];
S('02_examine', {
  titre: 'Brume tourne autour de l’avatar', etapes: ['2d'], images: 4, ms: 260,
  fond: f => greveNuit('ex', f) + (TOUR[f][2] ? '' : lueur(TOUR[f][0], TOUR[f][1] - 26, 50, '200,225,240', 0.4) + brume(TOUR[f][0], TOUR[f][1], 2.2, f, 'surpris')),
  devant: f => (TOUR[f][2] ? lueur(TOUR[f][0], TOUR[f][1] - 26, 50, '200,225,240', 0.4) + brume(TOUR[f][0], TOUR[f][1], 2.4, f, 'surpris') : ''),
  avatar: { x: 200, y: 364, echelle: 3.6, vue: 'face', pose: 'grelotter', naufrage: true }
});
// Étape 2e — elle se pose à hauteur de ses yeux (l'avatar de dos, de trois quarts, au premier plan)
S('02_yeux', {
  titre: 'Brume, à hauteur des yeux', etapes: ['2e'], images: 4, ms: 220,
  fond: f => ciel('by', { ciel: '#141C36', cielBas: '#2E3C5C' }) + nappe(260, 0.2, f) + nappe(340, 0.16, -f) + lueur(250, 170, 150, '200,220,235', 0.35),
  devant: f => brume(250, 192, 5.4, f),
  avatar: { x: 120, y: 470, echelle: 6.4, vue: 'dos', pose: 'repos', naufrage: true }
});
// Étape 2f — sa lueur s'avive et perce la brume : des murs effondrés, un puits sec, une porte sans maison
S('02_village', {
  titre: 'Là, il y avait un village', etapes: ['2f'], images: 3, ms: 420,
  fond: f => ciel('vi', NUIT, 260) + sable(250) + lueur(200, 210, 170 + f * 8, '210,230,240', 0.3) + ruines() + nappe(236, 0.26 - f * 0.06, f) + nappe(300, 0.18 - f * 0.04, -f, 1.2) + brume(226, 150, 2.2, f),
  avatar: { x: 336, y: 396, echelle: 3.2, vue: 'dos', miroir: true, pose: 'repos', naufrage: true }
});
// Étape 2g — elle se tourne vers la mer ; l'épave est à peine visible
S('02_epave', {
  titre: 'L’épave, à peine visible', etapes: ['2g'], images: 3, ms: 500,
  fond: f => ciel('ep', NUIT, 220) + mer(170, 260, f) + epave(270, 192, 0.9, 0.5) + nappe(186, 0.32, f) + nappe(214, 0.24, -f) + sable(260) + brume(176, 232, 2, f, 'triste'),
  avatar: { x: 110, y: 384, echelle: 3.4, vue: 'dos', pose: 'repos', naufrage: true }
});
// Étape 2h — elle revient près de l'avatar, toute petite
S('02_proche', {
  titre: 'Brume, toute petite, tout près', etapes: ['2h'], images: 4, ms: 260,
  fond: f => greveNuit('pr', f) + lueur(258, 252, 46, '200,225,240', 0.45),
  devant: f => brume(258, 272, 1.3, f, 'content'),
  avatar: { x: 200, y: 376, echelle: 3.8, vue: 'face', pose: 'repos', naufrage: true }
});
// Étape 3a — Brume file vers un creux de rocher et en tire, à grand-peine, un livre lourd fermé de sept sceaux
S('03_livre', {
  titre: 'Le livre aux sept sceaux', etapes: ['3a'], images: 3, ms: 360,
  fond: f => greveNuit('li', f) + rocher(214, 330, 180, 140) + E(318, 262, 32, 20, '#1A1E2B', 2)
    + grimoire(316 - f * 16, 264 + f * 6, 0.9 + f * 0.08, -6 + f * 5) + brume(268 - f * 12, 266, 2.2, f, f ? 'gene' : 'neutre'),
  avatar: { x: 108, y: 384, echelle: 3.4, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 3e — un vent se lève pour de vrai et chasse la brume : la Grève, l'épave, le bois flotté, les rochers
S('03_vent', {
  titre: 'Le vent chasse la brume', etapes: ['3e'], images: 3, ms: 420,
  fond: f => {
    const a = [0.5, 0.28, 0.08][f];
    let s = ciel('ve', NUIT, 220) + lueur(80, 60, 40, '220,230,245', 0.25) + E(80, 60, 12, 12, '#DCE4EF', 0) + mer(170, 240, f) + epave(300, 186, 0.8, 0.4 + f * 0.25) + sable(240)
      + planche(40, 282, 80, -10) + planche(290, 304, 60, 8) + rocher(4, 276, 76, 44) + rocher(330, 262, 70, 34);
    s += nappe(200, a, f * 2) + nappe(260, a, f * 3, 1.3) + nappe(330, a * 0.8, f * 4, 1.2);
    return s + [0, 1, 2].map(i => trait(`M${-40 + f * 60 + i * 30},${110 + i * 60} q60,-16 120,0 q30,8 60,-6`, 'rgba(230,240,250,.55)', 3)).join('');
  },
  avatar: { x: 200, y: 364, echelle: 3, vue: 'dos', pose: 'repos', naufrage: true }
});
// Étape 5d — Brume souffle, le feu prend, la brume recule d'un cercle ; l'avatar tend les mains vers les flammes
S('05_feu', {
  titre: 'Le feu prend', etapes: ['5d'], images: 4, ms: 300,
  fond: f => ciel('fe', NUIT, 240) + mer(180, 240, f) + epave(330, 204, 0.6, 0.6) + sable(240)
    + nappe(234, 0.28 - f * 0.06, f) + nappe(304, 0.24 - f * 0.06, -f, 1.2)
    + feu(222, 334, 1.8, f, [0, 1, 2, 2][f]) + brume(270 - f * 4, 300, 1.8, f, f > 1 ? 'content' : 'neutre'),
  avatar: { x: 118, y: 368, echelle: 3.3, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 6h — la nuit autour du feu ; au loin, sur les rochers, une silhouette regarde la lueur
S('06_silhouette', {
  titre: 'Une silhouette sur les rochers', etapes: ['6h'], images: 3, ms: 300,
  fond: f => ciel('si', NUIT, 230) + etoiles(ETOILES.slice(0, 6), f) + mer(170, 230, f) + nappe(200, 0.2, f) + sable(230) + rocher(270, 236, 120, 70)
    + P('M330,164 L331,140 Q332,132 340,131 Q348,132 349,140 L350,164 L345,164 L344,150 L336,150 L335,164 Z', '#0C101C', 0) + E(340, 124, 5.6, 6.2, '#0C101C', 0)
    + trait('M331,162 L332,140 Q333,133 339,132 M335.2,121 Q336,119 338,118.4', 'rgba(255,190,120,.6)', 1.2)
    + feu(176, 336, 1.6, f) + brume(226, 300, 1.5, f, 'surpris'),
  avatar: { x: 96, y: 388, echelle: 3, vue: 'dos', pose: 'repos', naufrage: true }
});
// Étape 7a — l'aube ; Cannelle (naufragée, la couverture de pont sur les épaules) sort de la brume
S('07_cannelle', {
  titre: 'Cannelle sort de la brume', etapes: ['7a'], images: 4, ms: 260,
  fond: f => ciel('ca', AUBE, 230) + lueur(330, 214, 90, '255,210,170', 0.4) + mer(180, 230, f, AUBE) + sable(230, AUBE) + feu(150, 336, 1.2, f, 1)
    + poser(frame(T.Cannelle.nau, 'se', 'marche', f), 296, 326, 2.8) + nappe(276, 0.34 - f * 0.05, f, 1.2, AUBE),
  avatar: { x: 92, y: 392, echelle: 3, vue: 'avant', pose: 'salut', naufrage: true }
});
// Étape 7b — elle tend les mains vers le feu ; un éclat doré : son souvenir revient, et sa tenue de cuisinière
S('07_souvenir', {
  titre: 'Le souvenir de Cannelle revient', etapes: ['7b'], images: 4, ms: 300,
  fond: f => ciel('so', AUBE, 230) + mer(180, 230, f, AUBE) + sable(230, AUBE) + feu(156, 336, 1.2, f, 2)
    + lueur(272, 260, 60 + f * 20, '255,220,120', 0.25 + f * 0.1)
    + poser(frame(f < 2 ? T.Cannelle.nau : T.Cannelle.base, 'se', 'repos', f % 2, f === 3 ? 'content' : 'neutre'), 272, 334, 2.8)
    + [[232, 196], [312, 206], [244, 290], [306, 282]].slice(0, f + 1).map(([x, y]) => etincelle(x, y, 2.4)).join(''),
  avatar: { x: 84, y: 394, echelle: 3, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 9b — sous une voile tendue sur un aviron, Rivet (naufragé) trie ses vis par taille, sur une valise ouverte
S('09_rivet', {
  titre: 'Rivet sous sa voile', etapes: ['9b'], images: 2, ms: 700,
  fond: f => {
    let s = ciel('ri', JOUR, 220) + mer(160, 220, f, JOUR) + sable(220, JOUR);
    // l'aviron planté, la voile tendue qui claque, son ombre
    s += P('M150,330 L300,330 L292,346 L160,346 Z', 'rgba(60,50,30,.16)', 0) + L([300, 336], [272, 150], OUT, 7) + L([300, 336], [272, 150], '#C9A26E', 4.4)
      + P(`M272,152 Q${206 + f * 5},${176 - f * 3} 142,${250 + f * 3} L156,336 L300,336 Z`, '#F0E6D0', 2.4) + trait('M186,206 L244,300', '#D8CCB0', 2) + L([142, 250 + f * 3], [120, 340], '#B8A888', 1.4);
    // Rivet assis, la valise ouverte et ses vis rangées par taille
    s += poser(frame(T.Rivet.nau, 'front', 'action', f), 222, 338, 2.4);
    s += P('M176,374 L268,374 L262,348 L182,348 Z', '#7A4E2C', 2) + P('M182,348 L262,348 L256,330 L188,330 Z', '#5A3A24', 2)
      + [[194, 2.2], [210, 2.6], [228, 3], [246, 3.4]].map(([x, r], i) => E(x, 362, r, r * 0.6, '#B8BCC4', 0.8) + E(x, 366 - (i % 2), r * 0.8, r * 0.5, '#9AA0A8', 0.8)).join('');
    return s;
  },
  avatar: { x: 76, y: 388, echelle: 3, vue: 'avant', pose: 'repos', naufrage: true }
});
// Étape 10b — dans les vagues jusqu'à la taille, Aster (naufragée) tire une caisse au bout d'une corde ; l'avatar, sur
// le sable, au premier plan
S('10_aster', {
  titre: 'Aster tire une caisse des vagues', etapes: ['10b'], images: 3, ms: 360,
  fond: f => {
    let s = ciel('as', JOUR, 190) + mer(150, 300, f, JOUR) + poser(frame(T.Aster.nau, 'se', 'marche', f), 262, 332, 2.6);
    s += trait(`M166,${262 + f} Q206,${252 - f * 2} 236,262`, '#D8C08A', 2.6)
      + `<g transform="translate(${144 + f * 4} ${264 + [0, 3, 0][f]}) rotate(${[-6, 4, -2][f]})"><rect x="-24" y="-20" width="48" height="34" fill="#9A6E44" stroke="${OUT}" stroke-width="2.2"/>${[-8, 4].map(y => L([-24, y], [24, y], '#7A5434', 2)).join('')}</g>`;
    // l'eau jusqu'à la taille, l'écume, puis le sable au premier plan
    s += `<rect x="0" y="${276 + f * 2}" width="400" height="60" fill="${JOUR.mer}" opacity="0.92"/>` + trait(`M0,${278 + f * 2} q25,-6 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0`, JOUR.ecume, 3);
    return s + P('M0,326 Q200,312 400,322 L400,400 L0,400 Z', JOUR.sable, 2) + P(`M0,${328 - f * 2} Q200,${314 - f * 3} 400,${324 - f * 2} L400,322 Q200,312 0,326 Z`, 'rgba(255,255,255,.6)', 0);
  },
  avatar: { x: 76, y: 396, echelle: 3, vue: 'avant', pose: 'salut', naufrage: true }
});
// Étape 11a — à La Source, tout juste libérée : un enfant endormi contre un rocher, des « z », un bocal vide
const source = f => ciel('sr', JOUR, 200) + P('M0,200 L400,200 L400,400 L0,400 Z', '#8EC46A', 2) + [[40, 222], [92, 208], [352, 216]].map(([x, y]) => E(x, y, 24, 13, '#5E9A42', 1.6)).join('')
  + E(264, 306, 112, 34, '#4E9AC8', 2.4) + E(244, 298, 60, 14, '#7EC4E8', 0) + trait(`M${194 + f * 6},306 q20,-4 40,0`, '#EAF6FC', 2) + nappe(214, 0.2, f, 0.8, JOUR);
S('11_ondin', {
  titre: 'Un enfant endormi à La Source', etapes: ['11a'], images: 2, ms: 900,
  fond: f => source(f) + poser(sleepFrame(T.Ondin.nau, f), 150, 368, 3.2),
  avatar: { x: 334, y: 394, echelle: 3, vue: 'avant', miroir: true, pose: 'repos', naufrage: true }
});
// Étape 11b — Ondin s'étire, les yeux lourds : réveillé, il n'a plus ses « z »
S('11_reveil', {
  titre: 'Ondin s’étire', etapes: ['11b'], images: 2, ms: 600,
  fond: f => source(f) + poser(frame(T.Ondin.nau, 'front', 'salut', f, 'endormi').replace(ZEDS, ''), 160, 364, 3),
  avatar: { x: 334, y: 394, echelle: 3, vue: 'avant', miroir: true, pose: 'repos', naufrage: true }
});
// Étape 12k — la nuit, autour du feu : l'avatar (habits recousus), Cannelle, Rivet, Aster, Ondin ; Brume au-dessus ;
// les poules endormies, la torche, des lucioles au bord de la brume
const veilleeFond = f => ciel('vc', { ciel: '#0F1630', cielBas: '#2A3758' }, 250) + mer(170, 215, f) + nappe(205, 0.16, f) + sable(215)
  + lucioles([[40, 190], [80, 176], [350, 186], [372, 200], [20, 210]], f)
  + L([352, 330], [352, 250], OUT, 6) + L([352, 330], [352, 250], '#8A6A48', 3.6) + lueur(352, 240, 26, '255,190,90', 0.5)
  + P(`M346,250 Q${348 + [0, 2, -2, 1][f % 4]},226 352,${222 - (f % 2) * 2} Q358,236 358,250 Z`, '#F28A2E', 1);
// une poule endormie, la tête rentrée dans les plumes (m : −1 regarde à gauche)
const pouleEndormie = (x, y, s, [c, cs], m = 1) => `<g transform="translate(${x} ${y}) scale(${r2(s * m)} ${s})">`
  + E(0, 1, 11, 3, 'rgba(0,0,0,.18)', 0) + P('M-9,-2 Q-14,-8 -12,-12 Q-8,-9 -6,-6 Z', cs, 1) + E(0, -5, 9.6, 7, c, 1.2) + P('M-5,-6 Q0,-9 5,-5', 'none', 0.9)
  + E(6.4, -10, 4.4, 4, c, 1.1) + P('M4.4,-13.6 Q5.4,-16.6 6.8,-14 Q8,-16 8.8,-13.4 Z', '#D8443A', 0.7) + P('M10.4,-10 L12.4,-9.2 L10.4,-8.4 Z', '#F2B640', 0.6)
  + P('M6.8,-10.6 Q7.8,-9.8 8.8,-10.6', 'none', 0.7) + '</g>';
S('12_veillee', {
  titre: 'La première veillée : cinq visages et Brume', etapes: ['12k'], images: 4, ms: 180,
  // en cercle autour du feu : Rivet et Aster derrière (de face), Cannelle et Ondin à droite, tournés vers le feu ;
  // Brume au-dessus ; l'avatar au premier plan à gauche, de dos
  fond: f => veilleeFond(f) + pouleEndormie(40, 262, 1.2, ['#C8743A', '#A85A2A']) + pouleEndormie(66, 256, 1.1, ['#F4EEDF', '#D8CFBE'], -1)
    + poser(frame(T.Rivet.base, 'front', 'repos', f % 2), 140, 282, 2.3) + poser(frame(T.Aster.base, 'front', 'repos', (f + 1) % 2), 262, 282, 2.3)
    + feu(200, 318, 1.7, f) + brume(200, 150, 2.6, f)
    + poser(frame(T.Cannelle.base, 'se', 'repos', f % 2), 338, 330, 2.5) + poser(frame(T.Ondin.base, 'se', 'repos', (f + 1) % 2), 282, 372, 2.6),
  avatar: { x: 104, y: 404, echelle: 2.9, vue: 'dos', pose: 'repos', naufrage: false }
});
// Étape 12l — la même scène ; Cannelle tend à l'avatar ses habits recousus (le jeu passe ensuite l'avatar en tenue)
// la pile d'habits pliés, tendue par la main de Cannelle côté avatar (repère du personnage)
const habits = ([x, y]) => P(`M${r2(x - 6.6)},${r2(y + 7.6)} L${r2(x + 6.6)},${r2(y + 7.6)} L${r2(x + 6)},${r2(y + 3.6)} L${r2(x - 6)},${r2(y + 3.6)} Z`, '#E8C07A', 0.9)
  + P(`M${r2(x - 6)},${r2(y + 3.6)} L${r2(x + 6)},${r2(y + 3.6)} L${r2(x + 5)},${r2(y)} L${r2(x - 5)},${r2(y)} Z`, '#6E8EB4', 0.9) + trait(`M${r2(x - 3)},${r2(y + 5.6)} l1,0.7 l1,-0.7 l1,0.7 l1,-0.7`, '#B8483A', 0.5);
S('12_habits', {
  titre: 'Les habits recousus', etapes: ['12l'], images: 2, ms: 600,
  fond: f => veilleeFond(f) + feu(126, 320, 1.5, f) + brume(162, 186, 2.2, f, 'content') + poser(frame(T.Cannelle.base, 'se', 'repos', f, 'content') + habits([13.6, 47.4]), 284, 356, 3),
  avatar: { x: 150, y: 398, echelle: 3, vue: 'avant', pose: 'repos', naufrage: true }
});

module.exports = { SCENES, W, CADRE_PHOTO };
