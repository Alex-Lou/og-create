// La porte du phare des Anciens, vue de près (ecriture/arc_phare.md, acte III : « des Hauteurs, avec l'Étoile : la porte
// est fermée par une serrure en forme de pierre » ; choix de l'auteur, 15 oct. : une scène plein écran, le soir,
// l'Étoile l'éclaire ; la serrure, entre le creux de pierre gravé et la main de pierre, « aussi stylée que lisible que
// jolie » ; et une cinématique du genre des grands contes en papier découpé : « des 2D coupés et collés, animés,
// magnifiques », en gardant notre ton doux). En animation continue (SMIL), dans le carré 400 × 400 des scènes ; sur un
// téléphone en hauteur, le jeu n'en montre que la bande x ≈ 108 à 292 : la porte et l'Étoile y tiennent.
// Le genre :
//   - des pièces de papier coupées aux ciseaux : leurs bords sont irréguliers (rugueux()), l'épaisseur du papier se voit
//     du côté de la lumière (un fil plus clair de la même teinte), chaque pièce a son ombre de découpe sur la pièce
//     d'en dessous ; chaque matière a son papier (le lavis du ciel, la pierre marbrée, la mer à l'encre, le rocher
//     granuleux, le bois veiné) ; l'encre est franche ;
//   - des marionnettes : les nuages basculent, leurs volutes se dessinent et se défont ; les rangées de vagues se
//     balancent comme des feuilles de théâtre ; la mouette vole, ailes articulées ; les rayons de l'Étoile s'allongent
//     l'un après l'autre ; la main de pierre s'illumine doigt par doigt, puis la spirale se trace dans sa paume ;
//   - la caméra s'avance vers la serrure en s'inclinant un peu, les plans glissent en profondeur.
// La serrure : une main de pierre ouverte, sculptée dans la porte ; dans sa paume, un creux en forme de galet gravé de
// la spirale des menhirs : il manque une pierre (la clé d'Héliane, sous une pierre, acte VI). Pas de filtre : des
// dégradés et des motifs. Aucun texte dessiné.
const { Defs, vaVient, boucle, defile, hash, f, W } = require('./ouverture');
const { ombrePapier, plan, grain } = require('./papier');

const OUT = '#1E1A22';
const LUEUR = '#C8F4EE';

// ——— les ciseaux ———
// Un contour coupé aux ciseaux : les côtés du polygone (points [x, y]) découpés en petits pas, chacun un peu de travers
// (amp : l'écart, seed : la main) ; fermé
function rugueux(pts, amp = 1.4, seed = 1, pas = 7) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length], l = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(l / pas));
    const nx = -(by - ay) / (l || 1), ny = (bx - ax) / (l || 1);
    for (let k = 0; k < n; k++) {
      const t = k / n, e = (hash(seed * 31 + i, k) - 0.5) * 2 * amp;
      out.push([ax + (bx - ax) * t + nx * e, ay + (by - ay) * t + ny * e]);
    }
  }
  return `M${out.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')} Z`;
}
// une courbe échantillonnée : fn(t) → [x, y], t de 0 à 1
const courbe = (fn, n = 24) => Array.from({ length: n + 1 }, (_, k) => fn(k / n));
// une pièce de papier : son contour coupé, sa couleur, l'encre, l'épaisseur du papier sur le bord éclairé (le haut :
// les bordN premiers points), son papier (un motif posé dessus, découpé à la pièce)
function piece(D, pts, fill, o = {}) {
  const d = rugueux(pts, o.amp ?? 1.4, o.seed ?? 1);
  let s = `<path d="${d}" fill="${fill}" stroke="${OUT}" stroke-width="${o.encre ?? 1.5}" stroke-linejoin="round"/>`;
  if (o.texture) s += `<path d="${d}" fill="url(#${o.texture})" opacity="${o.textureA ?? 1}"/>`;
  if (o.bord) {
    const haut = pts.slice(0, o.bordN ?? Math.ceil(pts.length / 2));
    s += `<path d="M${haut.map(([x, y]) => `${f(x)},${f(y + 1.2)}`).join(' L')}" fill="none" stroke="${o.bord}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;
  }
  return s;
}

// ——— les papiers : un motif par matière ———
function papiers(pref) {
  const tache = (x, y, r, c, a) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.6)}" fill="${c}" opacity="${f(a)}"/>`;
  const fibres = (n, c, a, k) => Array.from({ length: n }, (_, i) => { const x = hash(i, k) * 80, y = hash(i, k + 1) * 80, an = hash(i, k + 2) * Math.PI, l = 2 + 5 * hash(i, k + 3); return `<path d="M${f(x)},${f(y)} l${f(Math.cos(an) * l)},${f(Math.sin(an) * l)}" stroke="${c}" stroke-width="0.5" opacity="${f(a)}"/>`; }).join('');
  const motif = (id, corps, t = 80) => `<pattern id="${pref}${id}" patternUnits="userSpaceOnUse" width="${t}" height="${t}">${corps}</pattern>`;
  return `<defs>`
    // (le lavis du ciel sur un grand carreau, très léger : la répétition ne se voit pas)
    + motif('ciel', Array.from({ length: 14 }, (_, i) => tache(hash(i, 1) * 200, hash(i, 2) * 200, 10 + 30 * hash(i, 3), i % 2 ? '#FFFFFF' : '#0A0E28', 0.025)).join('') + Array.from({ length: 70 }, (_, i) => { const x = hash(i, 4) * 200, y = hash(i, 5) * 200, an = hash(i, 6) * Math.PI, l = 2 + 5 * hash(i, 7); return `<path d="M${f(x)},${f(y)} l${f(Math.cos(an) * l)},${f(Math.sin(an) * l)}" stroke="#C8D0F0" stroke-width="0.5" opacity="0.1"/>`; }).join(''), 200)
    + motif('pierre', Array.from({ length: 14 }, (_, i) => tache(hash(i, 11) * 80, hash(i, 12) * 80, 4 + 9 * hash(i, 13), i % 3 ? '#0A0C12' : '#A8B4C8', i % 3 ? 0.14 : 0.08)).join('') + Array.from({ length: 22 }, (_, i) => `<circle cx="${f(hash(i, 14) * 80)}" cy="${f(hash(i, 15) * 80)}" r="0.6" fill="#05070C" opacity="0.4"/>`).join(''))
    + motif('mer', Array.from({ length: 16 }, (_, i) => `<path d="M${f(hash(i, 21) * 80)},${f(hash(i, 22) * 80)} q8,-1 ${f(10 + 16 * hash(i, 23))},0" stroke="${i % 3 ? '#0A1430' : '#9AAAE0'}" stroke-width="${f(0.8 + hash(i, 24))}" fill="none" opacity="${i % 3 ? 0.3 : 0.18}" stroke-linecap="round"/>`).join(''))
    + motif('roc', Array.from({ length: 40 }, (_, i) => `<circle cx="${f(hash(i, 31) * 80)}" cy="${f(hash(i, 32) * 80)}" r="${f(0.4 + hash(i, 33))}" fill="${i % 4 ? '#06050A' : '#B8B4C8'}" opacity="${i % 4 ? 0.35 : 0.2}"/>`).join('') + fibres(12, '#B8B4C8', 0.15, 34))
    + motif('bois', Array.from({ length: 10 }, (_, i) => `<path d="M${f(hash(i, 41) * 80)},0 q${f(2 - 4 * hash(i, 42))},40 0,80" stroke="#05080A" stroke-width="0.7" fill="none" opacity="0.35"/>`).join(''))
    + `</defs>`;
}

// une spirale qui s'enroule (une volute de nuage, une crête de vague) : un chemin de (x, y), de rayon r, dans le sens d
const spirale = (x, y, r, d = 1, tours = 1.6) => {
  let s = `M${f(x)},${f(y)}`;
  const n = Math.round(tours * 10);
  for (let k = 1; k <= n; k++) {
    const a = (k / 10) * Math.PI * 2 * d - Math.PI / 2, rr = r * (1 - k / (n + 2));
    s += ` L${f(x + Math.cos(a) * rr)},${f(y + r + Math.sin(a) * rr)}`;
  }
  return s;
};
// une volute qui se dessine, se tient, puis se défait (dur, début), en trait clair
const volute = (d, couleur, dur, beg, w = 1.8) => `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="120" stroke-dashoffset="120"><animate attributeName="stroke-dashoffset" values="120;0;0;120" keyTimes="0;0.35;0.7;1" calcMode="spline" keySplines="0.4 0 0.2 1;0 0 1 1;0.6 0 0.8 1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;

function portePhare() {
  const D = Defs('pp');
  const P = n => `pp${n}`;
  let C = '', N = '', M = '', T = '', S = '', B = '', R = '', X = '', A = '';
  // ——— le ciel : l'indigo du soir en lavis, une bande rose au ras de la mer, des étoiles ———
  C += `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#0C1030'], [0.35, '#1E2858'], [0.55, '#3E4C86'], [0.66, '#9A86B0'], [0.7, '#C49AB0']], 0, 0, 0, 290)}"/><rect width="${W}" height="${W}" fill="url(#${P('ciel')})"/>`;
  for (let i = 0; i < 34; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * 200, r = 0.4 + hash(i, 3) * 0.9;
    C += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#F4F0E0" opacity="${f(0.35 + 0.5 * hash(i, 4))}">${i % 3 ? '' : boucle('opacity', [0.2, 0.95, 0.4], 1.8 + hash(i, 5) * 3, hash(i, 6) * 3)}</circle>`;
  }
  // ——— l'Étoile : ses rayons de papier s'allongent l'un après l'autre, le cœur respire ———
  const [ex, ey] = [128, 96]; // (dans la bande du téléphone, et sous le haut que la tablette coupe)
  C += `<circle cx="${ex}" cy="${ey}" r="130" fill="${D.rad([[0, '#EAF4FF', 0.6], [0.25, '#A8C4F0', 0.25], [1, '#A8C4F0', 0]], ex, ey, 130)}">${boucle('opacity', [0.7, 1, 0.8], 3)}</circle>`;
  let rayons = '';
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 360, l = k % 2 ? 44 : 74;
    rayons += `<g transform="rotate(${f(a)})"><g><animateTransform attributeName="transform" type="scale" values="0.55 1;1 1;0.55 1" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" dur="3s" begin="${f(-k * 0.25)}s" repeatCount="indefinite"/><path d="M8,-2.2 L${l},0 L8,2.2 Z" fill="#F4F8FF" opacity="${k % 2 ? 0.4 : 0.6}"/></g></g>`;
  }
  C += `<g transform="translate(${ex} ${ey})"><g>${vaVient('rotate', '-6', '6', 12)}${rayons}</g><g>${vaVient('scale', '0.85', '1.12', 3)}<path d="${rugueux([[0, -30], [4, -4], [30, 0], [4, 4], [0, 30], [-4, 4], [-30, 0], [-4, -4]], 0.6, 7, 5)}" fill="#FFFDF4" stroke="#C8D8F8" stroke-width="0.8"/><circle r="7" fill="#FFFFFF"/></g></g>`;
  // ——— les nuages de papier : des marionnettes qui basculent, leurs volutes se dessinent et se défont ———
  const nuage = (x, y, l, h, d, c, i) => {
    const pts = [...courbe(t => [x + l * t, y + h - h * (0.55 + 0.45 * Math.sin(Math.PI * t)) * (0.8 + 0.25 * Math.sin(t * 11 + i))], 18), [x + l, y + h], [x, y + h]];
    const pivot = `${f(x + l / 2)} ${f(y + h)}`;
    return `<g>${vaVient('rotate', `-2.4 ${pivot}`, `2.4 ${pivot}`, 6 + i, i)}${defile('-8 0', '8 0', 11 + i * 2, i)}`
      + piece(D, pts, D.lin([[0, c[0]], [1, c[1]]], 0, y, 0, y + h), { seed: 10 + i, amp: 1.2, bord: c[2], bordN: 19, texture: P('ciel') })
      + volute(spirale(d > 0 ? x + l - h * 0.5 : x + h * 0.5, y + h * 0.15, h * 0.42, d, 1.8), c[2], 7 + i, i * 2) + `</g>`;
  };
  N += nuage(-30, 140, 150, 30, 1, ['#3A4680', '#232C5A', '#9AA8DC'], 0) + nuage(24, 192, 118, 22, -1, ['#46528C', '#2A3466', '#A8B6E4'], 1) + nuage(70, 16, 80, 16, 1, ['#525E98', '#323C70', '#B4C0EC'], 2);
  // ——— la mer : des rangées de vagues de papier qui se balancent comme des feuilles de théâtre, leurs crêtes s'enroulent ———
  M += `<rect y="262" width="${W}" height="${W - 262}" fill="${D.lin([[0, '#26346A'], [1, '#0C1430']], 0, 262, 0, W)}"/><rect y="262" width="${W}" height="${W - 262}" fill="url(#${P('mer')})"/>`;
  const rangee = (y, a, w, c, i) => {
    const pts = [...courbe(t => { const x = -40 + 480 * t, ph = (x / w) * Math.PI * 2; return [x, y - a * Math.max(0, Math.sin(ph)) * 1.1 + a * 0.3 * Math.cos(ph * 0.5)]; }, 60), [440, y + 40], [-40, y + 40]];
    let cretes = '';
    for (let x = -40 + w * 0.25, k = 0; x < 440; x += w, k++) cretes += volute(spirale(x + w * 0.1, y - a * 1.15, a * 0.4, 1, 1.2), c[1], 3 + i * 0.5, k * 0.4 + i, 1.3);
    return `<g>${vaVient('rotate', `-1.2 200 ${y + 40}`, `1.2 200 ${y + 40}`, 3.6 + i * 0.6, i)}${defile(`${-w / 2} 0`, `${w / 2} 0`, 5 + i, i)}` + piece(D, pts, c[0], { seed: 20 + i, amp: 1, bord: c[1], bordN: 61, texture: P('mer') }) + cretes + `</g>`;
  };
  M += rangee(270, 6, 26, ['#2C3C76', '#8A9AD0'], 0) + rangee(290, 8, 32, ['#22305E', '#7A8AC4'], 1) + rangee(314, 10, 38, ['#1A2650', '#6E80BC'], 2);
  // la lumière naturelle sur la mer : le rose de l'horizon qui s'y reflète, et le chemin de l'Étoile, une colonne
  // d'éclats couchés qui scintillent sous elle (plus larges en approchant), sa lumière sur les crêtes proches
  M += `<rect y="262" width="${W}" height="22" fill="${D.lin([[0, '#D8A8C0', 0.35], [1, '#D8A8C0', 0]], 0, 262, 0, 284)}"/>`;
  for (let i = 0; i < 40; i++) {
    const t = hash(i, 61), y = 268 + 120 * t * t, l = 3 + 12 * t * hash(i, 62), x = 128 + (hash(i, 63) - 0.5) * (10 + 70 * t), d = 1.2 + 1.8 * hash(i, 64);
    M += `<path d="M${f(x - l / 2)},${f(y)} L${f(x + l / 2)},${f(y)}" stroke="#F0F6FF" stroke-width="${f(0.8 + 1.2 * t)}" stroke-linecap="round" opacity="0">${boucle('opacity', [0, 0.85 * (1 - 0.5 * t), 0.1], d, hash(i, 65) * d)}</path>`;
  }
  M += `<ellipse cx="128" cy="300" rx="70" ry="44" fill="${D.rad([[0, '#C8DCFF', 0.22], [1, '#C8DCFF', 0]], 128, 300, 70)}">${boucle('opacity', [0.7, 1, 0.8], 3)}</ellipse>`;
  // ——— la tour, à droite, presque en ombre chinoise : son bord coupé aux ciseaux, sa pierre marbrée ———
  const tx0 = 142, yb = 342;
  const bordTour = courbe(t => [tx0 + 40 - 42 * t + 4 * Math.sin(Math.PI * t), -20 + (yb + 20) * t], 30); // (l'arête fuit vers le haut, la tour vue d'en bas : l'Étoile reste sur le ciel)
  const fut = [...bordTour, [430, yb], [430, -20]];
  T += piece(D, fut, D.lin([[0, '#2E3646'], [0.35, '#232A38'], [1, '#141820']], tx0, 0, 430, 0), { seed: 30, amp: 1.6, encre: 2, texture: P('pierre') });
  const cf = D.clip(rugueux(fut, 1.6, 30));
  let p = '';
  // les assises, tracées à la main
  for (let k = 0; k < 19; k++) {
    const y = -10 + k * 19, b = (y - 220) * 0.04;
    const ligne = courbe(t => [tx0 - 10 + 450 * t, y + b * 6 * Math.sin(Math.PI * t) + (hash(k, Math.round(t * 20)) - 0.5) * 1.2], 20);
    p += `<path d="M${ligne.map(([x, yy]) => `${f(x)},${f(yy)}`).join(' L')}" fill="none" stroke="#0A0C12" stroke-opacity="0.65" stroke-width="1.3"/>`;
    for (let j = 0; j < 7; j++) {
      const x = tx0 + 8 + j * 44 + (k % 2 ? 22 : 0) + 6 * hash(k, j);
      p += `<path d="M${f(x)},${f(y + b * 2)} L${f(x + 0.8)},${f(y + 19 + b * 2)}" stroke="#0A0C12" stroke-opacity="0.55" stroke-width="1.1"/>`;
    }
  }
  p += `<path d="M${bordTour.map(([x, y]) => `${f(x + 3)},${f(y)}`).join(' L')}" fill="none" stroke="#8EA4D8" stroke-width="5" opacity="0.3"/>`;
  T += `<g clip-path="${cf}">${p}</g>`;
  // la porte cintrée : les voussoirs, des pièces coupées une à une ; la clé de voûte et sa rune
  const cx = 222, pyb = yb, pyc = 214, rp = 50;
  for (let k = 0; k <= 10; k++) {
    const a0 = Math.PI * (1 - k / 11) + 0.025, a1 = Math.PI * (1 - (k + 1) / 11) - 0.025, r1 = rp + 3, r2 = rp + 20 + (k === 5 ? 6 : 0);
    const q = (r, a) => [cx + Math.cos(a) * r, pyc - Math.sin(a) * r];
    T += piece(D, [q(r1, a0), q(r2, a0), q(r2, (a0 + a1) / 2), q(r2, a1), q(r1, a1), q(r1, (a0 + a1) / 2)], k === 5 ? '#4E5A70' : k % 2 ? '#3A4456' : '#424D60', { seed: 40 + k, amp: 0.8, bord: '#6E7C96', bordN: 4, texture: P('pierre') });
  }
  for (let k = 0; k < 6; k++) {
    const y = pyc + k * ((pyb - pyc) / 6), h = (pyb - pyc) / 6 - 2;
    for (const x of [cx - rp - 20, cx + rp + 3]) T += piece(D, [[x, y + 1], [x + 17, y + 1], [x + 17, y + 1 + h], [x, y + 1 + h]], (k + (x > cx ? 1 : 0)) % 2 ? '#3A4456' : '#424D60', { seed: 60 + k + x, amp: 0.7, bord: '#6E7C96', bordN: 2, texture: P('pierre') });
  }
  const rune = `M${cx - 9},${pyc - rp - 10} L${cx - 9},${pyc - rp - 20} L${cx - 6},${pyc - rp - 23} L${cx - 3},${pyc - rp - 20} L${cx - 3},${pyc - rp - 10} M${cx + 2},${pyc - rp - 16} Q${cx + 6.5},${pyc - rp - 21} ${cx + 11},${pyc - rp - 16} Q${cx + 6.5},${pyc - rp - 11} ${cx + 2},${pyc - rp - 16} Z`;
  T += `<path d="${rune}" fill="none" stroke="${LUEUR}" stroke-width="1.3" stroke-linejoin="round">${boucle('opacity', [0.3, 1, 0.45], 3)}</path>`;
  // les vantaux : du bois veiné, coupé, cloué de ferrures
  const arc = courbe(t => [cx - rp + 2 * rp * t, pyc - Math.sin(Math.PI * t) * rp], 16);
  const vantail = [[cx - rp, pyb], ...arc, [cx + rp, pyb]];
  T += piece(D, vantail, D.lin([[0, '#3A4644'], [0.5, '#2C3634'], [1, '#1C2422']], cx - rp, 0, cx + rp, 0), { seed: 80, amp: 0.9, encre: 1.8, texture: P('bois') });
  let bois = '';
  for (let k = 1; k < 7; k++) { const x = cx - rp + k * (2 * rp / 7); bois += `<path d="M${f(x)},${pyb} L${f(x + 0.6)},${pyc - rp}" stroke="#0A0E0C" stroke-width="${k === 3 || k === 4 ? 1.8 : 1.1}"/>`; }
  T += `<g clip-path="${D.clip(rugueux(vantail, 0.9, 80))}">${bois}</g>`;
  for (const y of [pyc + 6, pyb - 28]) T += piece(D, [[cx - rp + 2, y - 4], [cx + rp - 2, y - 4], [cx + rp - 2, y + 4], [cx - rp + 2, y + 4]], '#20242A', { seed: y, amp: 0.6, encre: 1.2 }) + [0, 1, 2, 3, 4, 5].map(k => { const x = cx - rp + 10 + k * ((2 * rp - 20) / 5); return `<circle cx="${f(x)}" cy="${y}" r="1.5" fill="#5A606A"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.5)}" r="0.9" fill="#F4F8FF" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;${f(0.1 + k * 0.08)};${f(0.14 + k * 0.08)};${f(0.22 + k * 0.08)};1" dur="4s" begin="${f(-(y % 3))}s" repeatCount="indefinite"/></circle>`; }).join('');
  // ——— la main de pierre : elle s'illumine doigt par doigt, puis la spirale se trace dans sa paume ———
  const mx = cx, my = 268, g = D.lin([[0, '#E4DED0'], [0.55, '#BDB5A4'], [1, '#8A8272']], mx - 26, my - 40, mx + 26, my + 30);
  T += piece(D, [[mx - 32, my + 36], [mx - 32, my - 34], [mx - 16, my - 46], [mx, my - 50], [mx + 16, my - 46], [mx + 32, my - 34], [mx + 32, my + 36]], D.lin([[0, '#7A7466'], [1, '#4E493E']], mx - 32, 0, mx + 32, 0), { seed: 90, amp: 0.8, texture: P('pierre'), textureA: 0.6 });
  const CYCLE = 6;
  const lueurDoigt = (path, k) => `<path d="${path}" fill="${LUEUR}" opacity="0"><animate attributeName="opacity" values="0;0;0.55;0.25;0" keyTimes="0;${f(0.05 + k * 0.07)};${f(0.12 + k * 0.07)};0.75;1" dur="${CYCLE}s" repeatCount="indefinite"/></path>`;
  const doigt = (x, y0, h, w, rot, k) => {
    const d = `M${f(x - w)},${f(y0)} L${f(x - w)},${f(y0 - h + w)} Q${f(x - w)},${f(y0 - h - w * 0.4)} ${f(x)},${f(y0 - h - w * 0.4)} Q${f(x + w)},${f(y0 - h - w * 0.4)} ${f(x + w)},${f(y0 - h + w)} L${f(x + w)},${f(y0)} Z`;
    return `<g transform="rotate(${rot} ${f(x)} ${f(y0)})"><path d="${d}" fill="${g}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/><path d="M${f(x - w * 0.6)},${f(y0 - h * 0.45)} q${f(w * 0.6)},1.4 ${f(w * 1.2)},0" fill="none" stroke="#7A7262" stroke-width="0.8"/>${lueurDoigt(d, k)}</g>`;
  };
  T += doigt(mx - 15, my - 8, 26, 5, -10, 0) + doigt(mx - 5, my - 12, 33, 5.2, -3, 1) + doigt(mx + 6, my - 12, 31, 5.2, 3, 2) + doigt(mx + 16, my - 8, 24, 4.8, 10, 3);
  const pouce = `M${mx - 20},${my + 2} Q${mx - 34},${my - 6} ${mx - 36},${my - 20} Q${mx - 35},${my - 26} ${mx - 29},${my - 22} Q${mx - 26},${my - 10} ${mx - 16},${my - 6} Z`;
  T += `<path d="${pouce}" fill="${g}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/>${lueurDoigt(pouce, 4)}`;
  T += `<path d="M${mx - 21},${my - 10} Q${mx - 23},${my + 22} ${mx - 10},${my + 30} L${mx + 10},${my + 30} Q${mx + 23},${my + 22} ${mx + 21},${my - 10} Q${mx},${my - 16} ${mx - 21},${my - 10} Z" fill="${g}" stroke="${OUT}" stroke-width="1.5" stroke-linejoin="round"/>`;
  T += `<ellipse cx="${mx}" cy="${my + 6}" rx="12.5" ry="10" fill="${D.rad([[0, '#2E2B24'], [0.7, '#4A463C'], [1, '#7A7464']], mx - 3, my + 2, 13)}" stroke="${OUT}" stroke-width="1.2"/>`;
  const sp = `M${mx},${my + 6} m-1.6,0 a1.6,1.6 0 1 1 1.6,1.6 a3,3 0 1 1 -3,-3 a4.8,4.8 0 1 1 4.8,4.8 a6.6,5.6 0 1 1 -6.6,-6.6`;
  T += `<path d="${sp}" fill="none" stroke="#141210" stroke-width="1.6" stroke-linecap="round"/><path d="${sp}" fill="none" stroke="${LUEUR}" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="90"><animate attributeName="stroke-dashoffset" values="90;90;0;0;90" keyTimes="0;0.4;0.62;0.88;1" calcMode="spline" keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.6 0 0.8 1" dur="${CYCLE}s" repeatCount="indefinite"/></path>`;
  T += `<ellipse cx="${mx}" cy="${my + 6}" rx="24" ry="20" fill="${D.rad([[0, LUEUR, 0.5], [1, LUEUR, 0]], mx, my + 6, 24)}" opacity="0"><animate attributeName="opacity" values="0;0;1;0.6;0" keyTimes="0;0.5;0.66;0.85;1" dur="${CYCLE}s" repeatCount="indefinite"/></ellipse>`;
  // ——— le faisceau de l'Étoile, des poussières de lumière qui y flottent ———
  B += `<path d="M${ex + 10},${ey - 6} L${ex + 16},${ey + 10} L278,350 L168,350 Z" fill="${D.lin([[0, '#EAF4FF', 0.42], [0.55, '#C8DCFF', 0.2], [1, '#C8DCFF', 0.1]], ex, ey, 222, 330)}">${boucle('opacity', [0.65, 1, 0.75], 3)}</path>`;
  B += `<ellipse cx="${cx}" cy="270" rx="78" ry="96" fill="${D.rad([[0, '#D8E8FF', 0.28], [1, '#D8E8FF', 0]], cx, 270, 96)}">${boucle('opacity', [0.7, 1, 0.8], 3)}</ellipse>`;
  // des rais plus vifs dans le faisceau, qui glissent et ondulent lentement (la brume traversée par la lumière)
  for (const [k, w, d] of [[0.25, 5, 7], [0.55, 3, 9], [0.8, 4, 8]]) {
    const x1 = 168 + (278 - 168) * k;
    B += `<path d="M${ex + 12},${ey + 2} L${f(x1 - w)},350 L${f(x1 + w)},350 Z" fill="#F4F8FF" opacity="0.1"><animateTransform attributeName="transform" type="rotate" values="-2 ${ex} ${ey};2 ${ex} ${ey};-2 ${ex} ${ey}" dur="${d}s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>${boucle('opacity', [0.04, 0.16, 0.07], d * 0.7, k * 3)}</path>`;
  }
  // la lumière renvoyée par le seuil mouillé sur le bas de la porte et des piédroits
  B += `<ellipse cx="${cx}" cy="${yb - 4}" rx="70" ry="16" fill="${D.rad([[0, '#C8DCFF', 0.3], [1, '#C8DCFF', 0]], cx, yb - 4, 70)}">${boucle('opacity', [0.6, 1, 0.7], 3)}</ellipse>`;
  for (let i = 0; i < 24; i++) {
    const t = hash(i, 51), x = ex + 20 + (222 - ex) * t + (hash(i, 52) - 0.5) * 40 * t, y = ey + 20 + (300 - ey) * t, d = 5 + hash(i, 53) * 5;
    B += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + hash(i, 54) * 1.1)}" fill="#F4FAFF"><animateTransform attributeName="transform" type="translate" values="0 0;${f(hash(i, 55) * 14 - 7)} -24" dur="${f(d)}s" begin="${f(-hash(i, 56) * d)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.9;0" dur="${f(d)}s" begin="${f(-hash(i, 56) * d)}s" repeatCount="indefinite"/></circle>`;
  }
  // ——— le seuil et les rochers : des pièces de papier granuleux, leur épaisseur côté lumière ———
  // l'escalier, attaché à la tour (son plan ne glisse pas : il part bien du seuil) : le seuil de pierre sous la porte,
  // la première marche en partant du phare, puis trois marches de plus en plus larges jusqu'à l'eau
  S += piece(D, [[146, yb - 4], [298, yb - 4], [304, yb + 4], [140, yb + 4]], '#4A5466', { seed: 99, amp: 0.6, bord: '#AAB8DC', bordN: 2, texture: P('roc') });
  S += piece(D, [[140, yb + 4], [304, yb + 4], [312, yb + 14], [132, yb + 14]], '#3A4252', { seed: 100, amp: 0.7, bord: '#9AAAD0', bordN: 2, texture: P('roc') });
  S += piece(D, [[126, yb + 14], [320, yb + 14], [330, yb + 25], [116, yb + 25]], '#2C3240', { seed: 101, amp: 0.7, bord: '#8A9AC4', bordN: 2, texture: P('roc') });
  S += piece(D, [[110, yb + 25], [338, yb + 25], [352, yb + 38], [96, yb + 38]], '#222834', { seed: 104, amp: 0.9, bord: '#7A8AB4', bordN: 2, texture: P('roc') });
  // les marches mouillées luisent : des filets de lumière qui frémissent, et l'Étoile reflétée dans une flaque
  for (const [y, x0, x1, b] of [[yb - 2, 152, 292, 0.3], [yb + 6, 146, 298, 0], [yb + 16, 132, 314, 0.7], [yb + 27, 116, 332, 1.3]]) {
    S += `<path d="M${x0},${y} L${x1},${y}" stroke="#E4EEFF" stroke-width="1.2" stroke-linecap="round" opacity="0.3">${boucle('opacity', [0.15, 0.55, 0.25], 2.4, b)}</path>`;
  }
  S += `<ellipse cx="196" cy="${yb + 32}" rx="20" ry="3.4" fill="#3A4664" stroke="${OUT}" stroke-width="0.8"/><ellipse cx="190" cy="${yb + 31}" rx="9" ry="1.4" fill="${D.rad([[0, '#F4F8FF', 0.9], [1, '#F4F8FF', 0]], 190, yb + 31, 9)}">${boucle('opacity', [0.5, 1, 0.6], 3)}</ellipse>`;
  R += piece(D, [[-10, 336], [26, 300], [62, 296], [96, 322], [120, 360], [128, 410], [-10, 410]], D.lin([[0, '#4A4650'], [1, '#1A181E']], 0, 296, 0, 410), { seed: 102, amp: 2, bord: '#A8B4D8', bordN: 4, texture: P('roc') });
  R += piece(D, [[330, 410], [338, 372], [372, 356], [410, 366], [410, 410]], D.lin([[0, '#3A3640'], [1, '#141218']], 0, 356, 0, 410), { seed: 103, amp: 2, bord: '#8E9ABC', bordN: 4, texture: P('roc') });
  const mouette = tete => `<path d="M-0.6,0 L-0.6,2.4 M1,0 L1,2.4" stroke="#E8963A" stroke-width="0.8"/><path d="M-6,-1 Q-6.2,-5.4 -1,-6.2 Q3.6,-6.8 5.2,-3.2 L3,0.4 Q-2,1.4 -6,-1 Z" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.8"/><path d="M-6.6,-2 Q-2.4,-4.4 2,-2.4 L-1.2,0 Q-4.4,0 -6.6,-2 Z" fill="#8E98A8" stroke="${OUT}" stroke-width="0.6"/><g transform="scale(${tete} 1)"><circle cx="3.4" cy="-6.4" r="2.9" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.8"/><circle cx="4.4" cy="-7" r="0.7" fill="${OUT}"/><path d="M6,-6.4 L9,-5.7 L6,-5 Z" fill="#F2B23C" stroke="${OUT}" stroke-width="0.4"/></g>`;
  R += `<g transform="translate(60 297) scale(1.6)"><g>${vaVient('rotate', '-3 0 0', '3 0 0', 2.2)}<g>${mouette(1)}<animate attributeName="opacity" values="1;0;1" keyTimes="0;0.5;1" calcMode="discrete" dur="4.4s" repeatCount="indefinite"/></g><g opacity="0">${mouette(-1)}<animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" calcMode="discrete" dur="4.4s" repeatCount="indefinite"/></g></g></g>`;
  // ——— les gerbes : des couronnes de gouttes de papier qui jaillissent, une crête qui s'enroule ———
  for (const [x, y, d, b, k] of [[110, 336, 2.6, 0, 0.9], [24, 316, 3.1, 1.1, 0.8], [356, 364, 2.9, 0.5, 0.85]]) {
    const goutte = (a, l, w, i) => { const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux; return piece(D, [[x - nx * w, y - ny * w], [x + ux * l * 0.6 - nx * w * 0.8, y + uy * l * 0.6 - ny * w * 0.8], [x + ux * l, y + uy * l], [x + ux * l * 0.6 + nx * w * 0.8, y + uy * l * 0.6 + ny * w * 0.8], [x + nx * w, y + ny * w]], '#E8F0FA', { seed: x + i, amp: 0.5, encre: 1.1 }); };
    const gerbe = [[-0.9, 16, 2.6], [-0.45, 24, 3.2], [0, 30, 3.6], [0.45, 23, 3.2], [0.9, 15, 2.6]].map(([a, l, w], i) => goutte(a, l * k, w * k, i)).join('')
      + `<ellipse cx="${x}" cy="${f(y + 2)}" rx="${f(16 * k)}" ry="${f(4 * k)}" fill="#E8F0FA" stroke="${OUT}" stroke-width="1.1"/>`
      + `<path d="${spirale(x + 8 * k, y - 34 * k, 4 * k, -1, 1.2)}" fill="none" stroke="#E8F0FA" stroke-width="1.6" stroke-linecap="round"/>`;
    X += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.55;1" dur="${d}s" begin="${-b}s" repeatCount="indefinite"/><g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="scale" values="0.2;1.1;0.9" keyTimes="0;0.35;1" calcMode="spline" keySplines="0.2 0.8 0.3 1;0.45 0 0.55 1" dur="${d}s" begin="${-b}s" repeatCount="indefinite"/><g transform="translate(${-x} ${-y})">${gerbe}</g></g></g></g>`;
  }
  // ——— le premier plan : des rubans de brume de papier qui défilent, des algues sombres qui se balancent ———
  const ruban = (x, y, l, h, i) => piece(D, [...courbe(t => [x + l * t, y - h * Math.sin(Math.PI * t) * (0.7 + 0.3 * Math.sin(t * 9 + i))], 16), ...courbe(t => [x + l * (1 - t), y + h * 0.35 * Math.sin(Math.PI * t)], 10)], '#8E9CC8', { seed: 110 + i, amp: 1, bord: '#D8E0F4', bordN: 17, encre: 1.2 }) + volute(spirale(x + (i % 2 ? 6 : l - 18), y - h * 0.6, h * 0.5, i % 2 ? -1 : 1, 1.6), '#D8E0F4', 6 + i, i);
  A += `<g opacity="0.8">${defile('40 0', '-40 0', 10)}${ruban(-60, 392, 150, 16, 0)}${ruban(330, 396, 140, 14, 1)}</g>`;
  for (const [x, d] of [[18, 1], [44, 1], [384, -1]]) A += `<g>${vaVient('rotate', `${-6 * d} ${x} 410`, `${6 * d} ${x} 410`, 3 + x * 0.004, x * 0.02)}<path d="M${x},410 q${10 * d},-30 ${2 * d},-62 q${-6 * d},-16 ${4 * d},-30" fill="none" stroke="#0E1A16" stroke-width="7" stroke-linecap="round"/><path d="M${x + 3 * d},392 q${8 * d},-20 ${4 * d},-40" fill="none" stroke="#2E4A3A" stroke-width="1.6" stroke-linecap="round"/></g>`;
  // ——— une mouette qui passe devant l'Étoile : une marionnette, ses ailes articulées à l'épaule et au poignet ———
  const aile = s => `<g>${vaVient('rotate', `${-28 * s} 0 0`, `${18 * s} 0 0`, 0.5)}<path d="M0,0 L${7 * s},-2 L${7 * s},1 Z" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><g transform="translate(${7 * s} -0.5)"><g>${vaVient('rotate', `${-22 * s} 0 0`, `${16 * s} 0 0`, 0.5, 0.08)}<path d="M0,-1.5 L${8 * s},-0.5 L0,1.5 Z" fill="#E4E8EE" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/></g></g></g>`;
  const vol = `<g><animateMotion path="M-30,150 Q100,90 240,120 T460,80" dur="13s" repeatCount="indefinite"/><g transform="scale(1.3)">${aile(-1)}${aile(1)}<ellipse cx="0" cy="0.6" rx="4" ry="1.8" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.9"/><circle cx="3.6" cy="-0.4" r="1.3" fill="#F4F2EA" stroke="${OUT}" stroke-width="0.8"/></g></g>`;
  // ——— la cinématique : les plans de papier, chacun son ombre de découpe, en parallaxe ; la caméra s'avance vers la
  // serrure en s'inclinant un peu, puis recule ; le grain du papier ———
  const cam = (corps, a, z) => plan(corps, a, z, 14);
  let s = cam(C, -5, 1.06) + cam(ombrePapier(N, 3.4, 4.4, 0.6), -10, 1.1) + cam(ombrePapier(M, 2.6, 3.6, 0.55), -6, 1.08) + vol
    + ombrePapier(T, 4.4, 5.4, 0.62) + ombrePapier(S, 2.6, 3.4, 0.55) + B + cam(ombrePapier(R, 3.6, 4.6, 0.62) + X, 9, 1.06) + cam(A, 18, 1.12);
  s = `<g transform="translate(${mx} ${my})"><g>${vaVient('scale', '1', '1.1', 14)}${vaVient('rotate', '-1.2', '1.2', 14)}<g transform="translate(${-mx} ${-my})">${s}</g></g></g>`;
  const V = `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#000', 0], [0.65, '#06081A', 0.12], [1, '#06081A', 0.62]], 200, 240, 300)}"/>`;
  return papiers('pp') + D.out(s + grain('pp') + V);
}

module.exports = { portePhare };
