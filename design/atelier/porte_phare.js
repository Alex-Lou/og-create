// La porte du phare des Anciens, vue de près (ecriture/arc_phare.md, acte III : « des Hauteurs, avec l'Étoile : la porte
// est fermée par une serrure en forme de pierre » ; choix de l'auteur, 15 oct. : une scène plein écran, le soir,
// l'Étoile l'éclaire ; la serrure, entre le creux de pierre gravé et la main de pierre, « aussi stylée que lisible que
// jolie » ; et « du niveau des cinématiques en papier découpé »). En animation continue (SMIL), dans le carré 400 × 400
// des scènes ; sur un téléphone en hauteur, le jeu n'en montre que la bande x ≈ 108 à 292 : la porte y tient.
// Une cinématique de papier découpé, façon conte :
//   - la composition en biais : l'Étoile, grande, en haut à gauche, sur le ciel ; la tour à droite, sombre, presque en
//     ombre chinoise ; son faisceau tombe en diagonale sur la porte, des poussières de lumière y flottent : tout le
//     reste est dans l'ombre, la main de pierre luit dans la lumière ;
//   - des plans de papier, chacun son ombre de découpe : les nuages en rubans aux bouts enroulés, la mer en festons
//     qui s'enroulent, la tour, le seuil et les rochers, la brume et les algues du premier plan ;
//   - la caméra s'avance lentement vers la serrure puis recule ; les plans glissent en parallaxe ; les vagues se
//     brisent en gerbes de papier ; une mouette passe ; un grain de papier.
// La serrure : une main de pierre ouverte, sculptée dans la porte ; dans sa paume, un creux en forme de galet gravé de
// la spirale des menhirs : il manque une pierre (la clé d'Héliane, sous une pierre, acte VI). Pas de filtre : des
// dégradés. Aucun texte dessiné.
const { Defs, vaVient, boucle, defile, hash, f, W } = require('./ouverture');
const { ombrePapier, plan, grain } = require('./papier');

const OUT = '#1E1A22';
const LUEUR = '#C8F4EE';

// une spirale qui s'enroule (le bout d'un nuage, la crête d'une vague) : depuis (x, y), de rayon r, dans le sens d
const spirale = (x, y, r, d = 1, tours = 1.6) => {
  let s = `M${f(x)},${f(y)}`;
  const n = Math.round(tours * 8);
  for (let k = 1; k <= n; k++) {
    const a = (k / 8) * Math.PI * 2 * d - Math.PI / 2, rr = r * (1 - k / (n + 2));
    s += ` L${f(x + Math.cos(a) * rr)},${f(y + r + Math.sin(a) * rr)}`;
  }
  return s;
};
// un ruban de nuage découpé : un long corps arrondi, un bout enroulé en spirale ; c : [haut, bas, filet clair]
function nuage(D, x, y, l, h, d, c) {
  const corps = `M${f(x)},${f(y + h)} Q${f(x + l * 0.1)},${f(y)} ${f(x + l * 0.35)},${f(y + h * 0.15)} Q${f(x + l * 0.55)},${f(y - h * 0.5)} ${f(x + l * 0.8)},${f(y + h * 0.1)} Q${f(x + l)},${f(y + h * 0.2)} ${f(x + l)},${f(y + h)} Z`;
  return `<path d="${corps}" fill="${D.lin([[0, c[0]], [1, c[1]]], 0, y - h * 0.5, 0, y + h)}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/>`
    + `<path d="M${f(x + l * 0.12)},${f(y + h * 0.4)} Q${f(x + l * 0.35)},${f(y + h * 0.05)} ${f(x + l * 0.62)},${f(y - h * 0.12)}" fill="none" stroke="${c[2]}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`
    + `<path d="${spirale(d > 0 ? x + l - h * 0.55 : x + h * 0.55, y + h * 0.05, h * 0.55, d, 1.8)}" fill="none" stroke="${c[2]}" stroke-width="1.8" stroke-linecap="round"/>`;
}
// une rangée de vagues en festons, chaque crête enroulée ; y : la ligne, a : la hauteur, w : le pas, c : [corps, crête]
function vagues(x0, x1, y, a, w, c) {
  let corps = `M${f(x0)},${f(y + a * 2)}`, cretes = '';
  for (let x = x0; x < x1; x += w) {
    corps += ` L${f(x)},${f(y)} Q${f(x + w * 0.45)},${f(y - a)} ${f(x + w * 0.8)},${f(y - a * 0.3)} Q${f(x + w * 0.9)},${f(y)} ${f(x + w)},${f(y)}`;
    cretes += `<path d="${spirale(x + w * 0.62, y - a * 0.95, a * 0.36, 1, 1.2)}" fill="none" stroke="${c[1]}" stroke-width="1.3" stroke-linecap="round"/>`;
  }
  corps += ` L${f(x1)},${f(y + a * 2)} Z`;
  return `<path d="${corps}" fill="${c[0]}" stroke="${OUT}" stroke-width="1.3" stroke-linejoin="round"/>` + cretes;
}

function portePhare() {
  const D = Defs('pp');
  let C = '', N = '', M = '', T = '', B = '', R = '', X = '', A = '';
  // ——— le ciel : l'indigo de la nuit qui tombe, une bande rose au ras de la mer, des étoiles ———
  C += `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#0C1030'], [0.35, '#1E2858'], [0.55, '#3E4C86'], [0.66, '#9A86B0'], [0.7, '#C49AB0']], 0, 0, 0, 290)}"/>`;
  for (let i = 0; i < 34; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * 200, r = 0.4 + hash(i, 3) * 0.9;
    C += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#F4F0E0" opacity="${f(0.35 + 0.5 * hash(i, 4))}">${i % 3 ? '' : boucle('opacity', [0.2, 0.95, 0.4], 1.8 + hash(i, 5) * 3, hash(i, 6) * 3)}</circle>`;
  }
  // ——— l'Étoile : grande, rayonnante, ses rayons tournent lentement et respirent ———
  const [ex, ey] = [138, 96]; // (dans la bande du téléphone, et sous le haut que la tablette coupe)
  C += `<circle cx="${ex}" cy="${ey}" r="130" fill="${D.rad([[0, '#EAF4FF', 0.6], [0.25, '#A8C4F0', 0.25], [1, '#A8C4F0', 0]], ex, ey, 130)}">${boucle('opacity', [0.7, 1, 0.8], 3)}</circle>`;
  let rayons = '';
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2, l = k % 2 ? 46 : 78;
    rayons += `<path d="M${f(Math.cos(a - 0.08) * 8)},${f(Math.sin(a - 0.08) * 8)} L${f(Math.cos(a) * l)},${f(Math.sin(a) * l)} L${f(Math.cos(a + 0.08) * 8)},${f(Math.sin(a + 0.08) * 8)} Z" fill="#F4F8FF" opacity="${k % 2 ? 0.35 : 0.55}"/>`;
  }
  C += `<g transform="translate(${ex} ${ey})"><g>${vaVient('rotate', '-8', '8', 12)}${rayons}</g><g>${vaVient('scale', '0.85', '1.12', 3)}<path d="M0,-30 L4,-4 L30,0 L4,4 L0,30 L-4,4 L-30,0 L-4,-4 Z" fill="#FFFDF4" stroke="#C8D8F8" stroke-width="0.8"/><circle r="7" fill="#FFFFFF"/></g></g>`;
  // ——— les nuages de papier, en rubans aux bouts enroulés ———
  // (dans le ciel qu'on voit, à gauche de la tour)
  N += nuage(D, -40, 150, 150, 24, 1, ['#3A4680', '#232C5A', '#8E9CD0']) + nuage(D, 20, 196, 120, 18, -1, ['#46528C', '#2A3466', '#9AA8D8']) + nuage(D, 96, 22, 70, 12, 1, ['#525E98', '#323C70', '#AAB6E4']);
  // ——— la mer en festons, à gauche de la tour, sous l'horizon ———
  M += `<rect y="262" width="${W}" height="${W - 262}" fill="${D.lin([[0, '#26346A'], [1, '#0C1430']], 0, 262, 0, W)}"/>`;
  M += `<g>${defile('-24 0', '0 0', 3.2)}${vagues(-40, 440, 268, 6, 24, ['#2C3C76', '#8A9AD0'])}</g>`;
  M += `<g>${defile('0 0', '-30 0', 2.8)}${vagues(-40, 460, 286, 8, 30, ['#22305E', '#7A8AC4'])}</g>`;
  M += `<g>${defile('-36 0', '0 0', 2.4)}${vagues(-40, 470, 308, 10, 36, ['#1A2650', '#6E80BC'])}</g>`;
  // ——— la tour, à droite, presque en ombre chinoise ; la porte, la main de pierre ———
  const tx0 = 142, yb = 342;
  const fut = `M${tx0 + 18},-20 L430,-20 L430,${yb} L${tx0 - 2},${yb} Q${tx0 - 8},200 ${tx0 + 18},-20 Z`;
  T += `<path d="${fut}" fill="${D.lin([[0, '#2E3646'], [0.35, '#232A38'], [1, '#141820']], tx0, 0, 430, 0)}" stroke="${OUT}" stroke-width="1.8"/>`;
  const cf = D.clip(fut);
  let p = '';
  for (let k = 0; k < 19; k++) {
    const y = -10 + k * 19, b = (y - 220) * 0.04;
    p += `<path d="M${tx0 - 10},${f(y)} Q280,${f(y + b * 6)} 440,${f(y - b * 3)}" fill="none" stroke="#0C0F15" stroke-opacity="0.6" stroke-width="1.2"/>`;
    for (let j = 0; j < 7; j++) {
      const x = tx0 + 8 + j * 44 + (k % 2 ? 22 : 0) + 6 * hash(k, j);
      p += `<path d="M${f(x)},${f(y + b * 2)} L${f(x)},${f(y + 19 + b * 2)}" stroke="#0C0F15" stroke-opacity="0.5" stroke-width="1"/>`;
    }
  }
  // l'arête de la tour, du côté de l'Étoile : un fil de lumière froide (la pierre prend le ciel)
  p += `<path d="M${tx0 + 18},-20 Q${tx0 - 8},200 ${tx0 - 2},${yb}" fill="none" stroke="#8EA4D8" stroke-width="5" opacity="0.28"/>`;
  T += `<g clip-path="${cf}">${p}</g>`;
  // la porte cintrée, ses voussoirs, la clé de voûte et sa rune (la tour et l'œil ouvert)
  const cx = 222, pyb = yb, pyc = 214, rp = 50;
  for (let k = 0; k <= 10; k++) {
    const a0 = Math.PI * (1 - k / 11) + 0.02, a1 = Math.PI * (1 - (k + 1) / 11) - 0.02, r1 = rp + 3, r2 = rp + 20;
    const q = (r, a) => `${f(cx + Math.cos(a) * r)},${f(pyc - Math.sin(a) * r)}`;
    const cle = k === 5;
    T += `<path d="M${q(r1, a0)} L${q(r2 + (cle ? 6 : 0), a0)} A${r2},${r2} 0 0 1 ${q(r2 + (cle ? 6 : 0), a1)} L${q(r1, a1)} A${r1},${r1} 0 0 0 ${q(r1, a0)} Z" fill="${cle ? '#4E5A70' : k % 2 ? '#3A4456' : '#424D60'}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/>`;
  }
  for (let k = 0; k < 6; k++) {
    const y = pyc + k * ((pyb - pyc) / 6);
    for (const x of [cx - rp - 20, cx + rp + 3]) T += `<rect x="${x}" y="${f(y + 1)}" width="17" height="${f((pyb - pyc) / 6 - 2)}" rx="1.5" fill="${(k + (x > cx ? 1 : 0)) % 2 ? '#3A4456' : '#424D60'}" stroke="${OUT}" stroke-width="1.2"/>`;
  }
  const rune = `M${cx - 9},${pyc - rp - 10} L${cx - 9},${pyc - rp - 20} L${cx - 6},${pyc - rp - 23} L${cx - 3},${pyc - rp - 20} L${cx - 3},${pyc - rp - 10} M${cx + 2},${pyc - rp - 16} Q${cx + 6.5},${pyc - rp - 21} ${cx + 11},${pyc - rp - 16} Q${cx + 6.5},${pyc - rp - 11} ${cx + 2},${pyc - rp - 16} Z`;
  T += `<path d="${rune}" fill="none" stroke="${LUEUR}" stroke-width="1.2" stroke-linejoin="round">${boucle('opacity', [0.3, 1, 0.45], 3)}</path>`;
  const vantail = `M${cx - rp},${pyb} L${cx - rp},${pyc} A${rp},${rp} 0 0 1 ${cx + rp},${pyc} L${cx + rp},${pyb} Z`;
  T += `<path d="${vantail}" fill="${D.lin([[0, '#3A4644'], [0.5, '#2C3634'], [1, '#1C2422']], cx - rp, 0, cx + rp, 0)}" stroke="${OUT}" stroke-width="1.6"/>`;
  let bois = '';
  for (let k = 1; k < 7; k++) { const x = cx - rp + k * (2 * rp / 7); bois += `<path d="M${f(x)},${pyb} L${f(x)},${pyc - rp}" stroke="#0E1412" stroke-width="${k === 3 || k === 4 ? 1.6 : 1}"/>`; }
  T += `<g clip-path="${D.clip(vantail)}">${bois}</g>`;
  for (const y of [pyc + 6, pyb - 28]) T += `<rect x="${cx - rp + 2}" y="${y - 4}" width="${2 * rp - 4}" height="8" rx="2" fill="#20242A" stroke="${OUT}" stroke-width="1.1"/>` + [0, 1, 2, 3, 4, 5].map(k => `<circle cx="${f(cx - rp + 10 + k * ((2 * rp - 20) / 5))}" cy="${y}" r="1.5" fill="#5A606A"/>`).join('');
  // la main de pierre et le creux du galet, la spirale gravée qui luit
  const mx = cx, my = 268, g = D.lin([[0, '#E4DED0'], [0.55, '#BDB5A4'], [1, '#8A8272']], mx - 26, my - 40, mx + 26, my + 30);
  T += `<path d="M${mx - 32},${my + 36} L${mx - 32},${my - 34} Q${mx},${my - 54} ${mx + 32},${my - 34} L${mx + 32},${my + 36} Z" fill="${D.lin([[0, '#7A7466'], [1, '#4E493E']], mx - 32, 0, mx + 32, 0)}" stroke="${OUT}" stroke-width="1.4"/>`;
  const doigt = (x, y0, h, w, rot) => `<g transform="rotate(${rot} ${f(x)} ${f(y0)})"><path d="M${f(x - w)},${f(y0)} L${f(x - w)},${f(y0 - h + w)} Q${f(x - w)},${f(y0 - h - w * 0.4)} ${f(x)},${f(y0 - h - w * 0.4)} Q${f(x + w)},${f(y0 - h - w * 0.4)} ${f(x + w)},${f(y0 - h + w)} L${f(x + w)},${f(y0)} Z" fill="${g}" stroke="${OUT}" stroke-width="1.3" stroke-linejoin="round"/><path d="M${f(x - w * 0.6)},${f(y0 - h * 0.45)} q${f(w * 0.6)},1.4 ${f(w * 1.2)},0" fill="none" stroke="#7A7262" stroke-width="0.8"/></g>`;
  T += doigt(mx - 15, my - 8, 26, 5, -10) + doigt(mx - 5, my - 12, 33, 5.2, -3) + doigt(mx + 6, my - 12, 31, 5.2, 3) + doigt(mx + 16, my - 8, 24, 4.8, 10);
  T += `<path d="M${mx - 20},${my + 2} Q${mx - 34},${my - 6} ${mx - 36},${my - 20} Q${mx - 35},${my - 26} ${mx - 29},${my - 22} Q${mx - 26},${my - 10} ${mx - 16},${my - 6} Z" fill="${g}" stroke="${OUT}" stroke-width="1.3" stroke-linejoin="round"/>`;
  T += `<path d="M${mx - 21},${my - 10} Q${mx - 23},${my + 22} ${mx - 10},${my + 30} L${mx + 10},${my + 30} Q${mx + 23},${my + 22} ${mx + 21},${my - 10} Q${mx},${my - 16} ${mx - 21},${my - 10} Z" fill="${g}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/>`;
  T += `<ellipse cx="${mx}" cy="${my + 6}" rx="12.5" ry="10" fill="${D.rad([[0, '#2E2B24'], [0.7, '#4A463C'], [1, '#7A7464']], mx - 3, my + 2, 13)}" stroke="${OUT}" stroke-width="1.2"/>`;
  const sp = `M${mx},${my + 6} m-1.6,0 a1.6,1.6 0 1 1 1.6,1.6 a3,3 0 1 1 -3,-3 a4.8,4.8 0 1 1 4.8,4.8 a6.6,5.6 0 1 1 -6.6,-6.6`;
  T += `<path d="${sp}" fill="none" stroke="${LUEUR}" stroke-width="1.2" stroke-linecap="round">${boucle('opacity', [0.4, 1, 0.55], 3)}</path>`;
  T += `<ellipse cx="${mx}" cy="${my + 6}" rx="22" ry="18" fill="${D.rad([[0, LUEUR, 0.45], [1, LUEUR, 0]], mx, my + 6, 22)}">${boucle('opacity', [0.3, 1, 0.45], 3)}</ellipse>`;
  // ——— le faisceau de l'Étoile : en diagonale sur la porte, des poussières de lumière qui flottent dedans ———
  B += `<path d="M${ex + 10},${ey - 6} L${ex + 16},${ey + 10} L278,350 L168,350 Z" fill="${D.lin([[0, '#EAF4FF', 0.42], [0.55, '#C8DCFF', 0.2], [1, '#C8DCFF', 0.1]], ex, ey, 222, 330)}">${boucle('opacity', [0.65, 1, 0.75], 3)}</path>`;
  // la lumière sur la porte et la main : une flaque froide
  B += `<ellipse cx="${cx}" cy="270" rx="78" ry="96" fill="${D.rad([[0, '#D8E8FF', 0.28], [1, '#D8E8FF', 0]], cx, 270, 96)}">${boucle('opacity', [0.7, 1, 0.8], 3)}</ellipse>`;
  for (let i = 0; i < 22; i++) {
    const t = hash(i, 51), x = ex + 20 + (222 - ex) * t + (hash(i, 52) - 0.5) * 50 * t, y = ey + 20 + (300 - ey) * t, d = 5 + hash(i, 53) * 5;
    B += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + hash(i, 54) * 1.1)}" fill="#F4FAFF"><animateTransform attributeName="transform" type="translate" values="0 0;${f(hash(i, 55) * 14 - 7)} -24" dur="${f(d)}s" begin="${f(-hash(i, 56) * d)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.9;0" dur="${f(d)}s" begin="${f(-hash(i, 56) * d)}s" repeatCount="indefinite"/></circle>`;
  }
  // ——— le seuil, les rochers de papier, la mouette posée ———
  R += `<path d="M150,${yb + 2} L300,${yb + 2} L312,${yb + 16} L138,${yb + 16} Z" fill="#3A4252" stroke="${OUT}" stroke-width="1.4"/><path d="M126,${yb + 16} L324,${yb + 16} L338,${yb + 34} L112,${yb + 34} Z" fill="#2C3240" stroke="${OUT}" stroke-width="1.4"/>`;
  R += `<path d="M152,${yb + 4} L298,${yb + 4}" stroke="#C8D8F0" stroke-opacity="0.45" stroke-width="1.4"/><path d="M130,${yb + 18} L322,${yb + 18}" stroke="#C8D8F0" stroke-opacity="0.3" stroke-width="1.4"/>`;
  const roc = (pts, c1, c2) => `<path d="M${pts.map(q => q.join(',')).join(' L')} Z" fill="${D.lin([[0, c1], [1, c2]], 0, Math.min(...pts.map(q => q[1])), 0, Math.max(...pts.map(q => q[1])))}" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>`;
  R += roc([[-10, 336], [26, 300], [62, 296], [96, 322], [120, 360], [128, 410], [-10, 410]], '#4A4650', '#1A181E');
  R += `<path d="M30,302 L58,300 L88,320" fill="none" stroke="#A8B4D8" stroke-width="1.6" opacity="0.5"/>`;
  R += roc([[330, 410], [338, 372], [372, 356], [410, 366], [410, 410]], '#3A3640', '#141218');
  const mouette = tete => `<path d="M-0.6,0 L-0.6,2.4 M1,0 L1,2.4" stroke="#E8963A" stroke-width="0.8"/><path d="M-6,-1 Q-6.2,-5.4 -1,-6.2 Q3.6,-6.8 5.2,-3.2 L3,0.4 Q-2,1.4 -6,-1 Z" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.7"/><path d="M-6.6,-2 Q-2.4,-4.4 2,-2.4 L-1.2,0 Q-4.4,0 -6.6,-2 Z" fill="#8E98A8" stroke="${OUT}" stroke-width="0.6"/><g transform="scale(${tete} 1)"><circle cx="3.4" cy="-6.4" r="2.9" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.7"/><circle cx="4.4" cy="-7" r="0.7" fill="${OUT}"/><path d="M6,-6.4 L9,-5.7 L6,-5 Z" fill="#F2B23C" stroke="${OUT}" stroke-width="0.4"/></g>`;
  R += `<g transform="translate(60 297) scale(1.6)"><g>${mouette(1)}<animate attributeName="opacity" values="1;0;1" keyTimes="0;0.5;1" calcMode="discrete" dur="4.4s" repeatCount="indefinite"/></g><g opacity="0">${mouette(-1)}<animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" calcMode="discrete" dur="4.4s" repeatCount="indefinite"/></g></g>`;
  // ——— les gerbes de papier : les vagues se brisent sur les rochers et retombent ———
  for (const [x, y, d, b, k] of [[110, 336, 2.6, 0, 0.9], [24, 316, 3.1, 1.1, 0.8], [356, 364, 2.9, 0.5, 0.85]]) {
    // une couronne de gouttes de papier pointues qui jaillit, et une crête qui s'enroule
    const goutte = (a, l, w) => { const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux; return `<path d="M${f(x - nx * w)},${f(y - ny * w)} Q${f(x + ux * l * 0.6 - nx * w)},${f(y + uy * l * 0.6 - ny * w)} ${f(x + ux * l)},${f(y + uy * l)} Q${f(x + ux * l * 0.6 + nx * w)},${f(y + uy * l * 0.6 + ny * w)} ${f(x + nx * w)},${f(y + ny * w)} Z" fill="#E8F0FA" stroke="${OUT}" stroke-width="1"/>`; };
    const gerbe = [[-0.9, 16, 2.6], [-0.45, 24, 3.2], [0, 30, 3.6], [0.45, 23, 3.2], [0.9, 15, 2.6]].map(([a, l, w]) => goutte(a, l * k, w * k)).join('')
      + `<ellipse cx="${x}" cy="${f(y + 2)}" rx="${f(16 * k)}" ry="${f(4 * k)}" fill="#E8F0FA" stroke="${OUT}" stroke-width="1"/>`
      + `<path d="${spirale(x + 8 * k, y - 34 * k, 4 * k, -1, 1.2)}" fill="none" stroke="#E8F0FA" stroke-width="1.6" stroke-linecap="round"/>`;
    X += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.55;1" dur="${d}s" begin="${-b}s" repeatCount="indefinite"/><g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="scale" values="0.2;1.1;0.9" keyTimes="0;0.35;1" calcMode="spline" keySplines="0.2 0.8 0.3 1;0.45 0 0.55 1" dur="${d}s" begin="${-b}s" repeatCount="indefinite"/><g transform="translate(${-x} ${-y})">${gerbe}</g></g></g></g>`;
  }
  // ——— le premier plan : la brume qui défile en rubans, des algues sombres qui se balancent ———
  A += `<g opacity="0.75">${defile('80 0', '-80 0', 9)}${nuage(D, 40, 372, 180, 20, -1, ['#8E9CC8', '#5E6C9C', '#D8E0F4'])}${nuage(D, 300, 384, 160, 18, 1, ['#8E9CC8', '#5E6C9C', '#D8E0F4'])}</g>`;
  for (const [x, d] of [[18, 1], [44, 1], [384, -1]]) A += `<g>${vaVient('rotate', `${-6 * d} ${x} 410`, `${6 * d} ${x} 410`, 3 + x * 0.004, x * 0.02)}<path d="M${x},410 q${10 * d},-30 ${2 * d},-62 q${-6 * d},-16 ${4 * d},-30" fill="none" stroke="#0E1A16" stroke-width="7" stroke-linecap="round"/><path d="M${x + 3 * d},392 q${8 * d},-20 ${4 * d},-40" fill="none" stroke="#2E4A3A" stroke-width="1.6" stroke-linecap="round"/></g>`;
  // une mouette qui passe devant l'Étoile
  const vol = `<g><animateMotion path="M-30,150 Q100,90 240,120 T460,80" dur="13s" repeatCount="indefinite"/><g>${vaVient('scale', '1 1', '1 -0.5', 0.45)}<path d="M-11,0 Q-5,-6 0,-0.6 Q5,-6 11,0" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="M-11,0 Q-5,-6 0,-0.6 Q5,-6 11,0" fill="none" stroke="#F4F2EA" stroke-width="1.3" stroke-linecap="round"/></g></g>`;
  // ——— la cinématique : les plans de papier, chacun son ombre de découpe, en parallaxe ; la caméra s'avance vers la
  // serrure puis recule ; le grain du papier ———
  const cam = (corps, a, z) => plan(corps, a, z, 14);
  let s = cam(C, -5, 1.06) + cam(ombrePapier(N, 3, 4, 0.55), -9, 1.1) + cam(ombrePapier(M, 2.4, 3.4, 0.5), -6, 1.08) + vol
    + ombrePapier(T, 4, 5, 0.6) + B + cam(ombrePapier(R, 3.4, 4.4, 0.6) + X, 8, 1.06) + cam(A, 16, 1.12);
  s = `<g transform="translate(${mx} ${my})"><g>${vaVient('scale', '1', '1.16', 14)}<g transform="translate(${-mx} ${-my})">${s}</g></g></g>`;
  const V = `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#000', 0], [0.65, '#06081A', 0.12], [1, '#06081A', 0.62]], 200, 240, 300)}"/>`;
  return D.out(s + grain('pp') + V);
}

module.exports = { portePhare };
