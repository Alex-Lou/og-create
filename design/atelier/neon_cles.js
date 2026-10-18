// Les images clés du papier néon pour 01_pont (choix de l'auteur, 17 oct. : du noir en fond, de la profondeur, un
// voyage dans la scène ; des tracés de lumière qui dessinent les formes puis se transforment ; des couleurs qui montent
// en dégradés au lieu d'être jetées d'un coup ; ses références donnent la couleur et la profondeur, rien à recopier).
// Une seule lumière, au fond (le cœur vert acide et cyan) : elle éclaire le bord de chaque couche de papier ; le
// lointain est pâle et bleuté, le proche sombre, saturé, cerné. Trois images, avant d'animer :
//   tunnel : le voyage, à travers des anneaux de nuages de nuit, vers le cœur de lumière ;
//   trace : L'Hirondelle dessinée par un trait de lumière, qui se remplit de papier, sur la mer de nuit ;
//   racines : l'orage ; des tracés montent de l'abîme et s'épaississent en racines qui frappent le navire.
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, avecStyle } = require('./gravure');
const { navire, G, D_ } = require('./theatre_pont');
const { neon, NEON } = require('./neon_pont');

const NOIR = '#03020A', CYAN = '#5CF2E6', ACIDE = '#D4FF7A', MAGENTA = '#FF4FB0', ENCRE = '#0A0418';
const plein = peinture => `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${peinture}"/>`;
const chemin = (pts, ferme) => `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}${ferme ? ' Z' : ''}`;
// un trait de lumière : un halo large et pâle, un trait vif, un cœur presque blanc
const lumineux = (d, c, w = 1.6, halo = 0.14) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w * 6)}" stroke-opacity="${halo}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w * 2.4)}" stroke-opacity="${f(halo * 2.2)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${f(w * 0.35)}" stroke-opacity="0.85" stroke-linecap="round" stroke-linejoin="round"/>`;
const etoiles = (n, seed, y0 = 0, y1 = 400) => Array.from({ length: n }, (_, i) => { const x = hash(i, seed) * 440 - 20, y = y0 + hash(i, seed + 1) * (y1 - y0), r = 0.4 + 1.3 * hash(i, seed + 2) ** 3; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${hash(i, seed + 3) < 0.75 ? '#E8F4FF' : ACIDE}" opacity="${f(0.35 + 0.65 * hash(i, seed + 4))}"/>`; }).join('');
const melange = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - k) + parseInt(b.slice(1 + i, 3 + i), 16) * k).toString(16).padStart(2, '0')).join('');
// des rayons de lumière depuis un point : de fins coins pâles qui s'effacent en s'éloignant
const rayons = (A, [x, y], n, R, c, op, seed) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + hash(i, seed) * 0.3, w = 0.025 + 0.05 * hash(i, seed + 1); return `<path d="M${x},${y} L${f(x + R * Math.cos(a - w))},${f(y + R * Math.sin(a - w))} L${f(x + R * Math.cos(a + w))},${f(y + R * Math.sin(a + w))} Z" fill="${A.rad([[0, c, op * (0.5 + 0.5 * hash(i, seed + 2))], [1, c, 0]], x, y, R)}"/>`; }).join('');

// ——— le tunnel de nuages ———
// un anneau de nuages en papier : un trou bordé de bouffées rondes qui bombent vers le centre ; ce qu'on en voit est la
// bande entre son trou et celui de l'anneau d'après (plus près) : elle s'allume au bord du trou, dans la lumière du
// cœur, puis plonge vite dans le violet, dans la nuit ; l'ombre que l'anneau d'après, plus près, porte sur elle
const bordAnneau = ([cx, cy], r, i) => { const n = 8 + (i % 4) * 2, ph = i * 0.9; return courbe(t => { const a = t * Math.PI * 2 + ph, q = (t * n) % 1, b = Math.sin(Math.PI * q) ** 1.5; const rr = r * (1 - 0.12 * b * (0.8 + 0.4 * hash(Math.floor(t * n), i + 7))); return [cx + rr * Math.cos(a), cy + rr * Math.sin(a) * 0.8]; }, n * 22); };
function anneau(A, C, r, rSuivant, i, n, ombre) {
  const k = i / (n - 1), bord = bordAnneau(C, r, i), R = rSuivant * 1.15 + 20;
  const lit = k < 0.3 ? melange('#F4FFD0', '#7AF0D0', k / 0.3) : k < 0.65 ? melange('#7AF0D0', '#9A6AF0', (k - 0.3) / 0.35) : melange('#9A6AF0', '#E05AB8', (k - 0.65) / 0.35);
  const corps = melange('#2E1670', '#1E0848', k), nuit = melange('#0A0420', '#040210', k);
  const pos = v => f(Math.min(0.98, v / R));
  const d = `M${G - 80},${G - 80} H${D_ + 80} V${D_ + 80} H${G - 80} Z ` + chemin(bord, true);
  let s = ombre ? `<path d="${chemin(bord, true)}" fill="none" stroke="#000" stroke-width="${f(8 + 10 * k)}" stroke-opacity="0.45" stroke-linejoin="round" transform="translate(0 ${f(2 + 3 * k)})"/>` : '';
  // (le dégradé, aplati comme l'anneau)
  const id = `ktA${i}`, stops = [[pos(r * 0.97), lit], [pos(r + (rSuivant - r) * 0.05), melange(lit, corps, 0.6)], [pos(r + (rSuivant - r) * 0.18), corps], [pos(r + (rSuivant - r) * 0.5), nuit], [1, nuit]].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  s += `<defs><radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(C[0])}" cy="${f(C[1])}" r="${f(R)}" gradientTransform="translate(${f(C[0])} ${f(C[1])}) scale(1 0.8) translate(${f(-C[0])} ${f(-C[1])})">${stops}</radialGradient></defs>`;
  s += `<path d="${d}" fill-rule="evenodd" fill="url(#${id})"/>`;
  s += `<path d="${chemin(bord, true)}" fill="none" stroke="${ENCRE}" stroke-width="${f(1.4 + k * 1.6)}" stroke-linejoin="round"/>`;
  s += lumineux(chemin(bord, true), lit, 0.5 + k * 0.5, 0.05 + (1 - k) * 0.07);
  return s;
}
function tunnel() {
  const A = atelier('kt'), C = [214, 190], N = 12;
  let s = plein(NOIR);
  s += `<circle cx="${C[0]}" cy="${C[1]}" r="160" fill="${A.rad([[0, '#FFFFFF', 1], [0.08, '#F6FFD8', 1], [0.2, ACIDE, 0.8], [0.4, '#3EE8B0', 0.4], [1, '#2A3A9A', 0]], C[0], C[1], 160)}"/>`;
  s += rayons(A, C, 30, 90, '#FFFFF0', 0.5, 5) + etoiles(30, 11);
  // (du plus loin au plus près ; les anneaux tournent un peu : le tunnel s'enroule ; leurs rayons s'écartent vite)
  const R = Array.from({ length: N + 1 }, (_, i) => 16 + 420 * (i / N) ** 2.1);
  const centre = i => [C[0] + Math.sin(i * 0.8) * 22 * (i / N), C[1] + Math.cos(i * 1.1) * 14 * (i / N)];
  for (let i = 0; i < N; i++) {
    s += anneau(A, centre(i), R[i], R[i + 1], i, N, i > 0);
    if (i === 1) s += `<path d="M${C[0] - 22},${C[1] + 4} q11,-2 22,0 t22,0" fill="none" stroke="${CYAN}" stroke-width="1.1" stroke-linecap="round"/>`;
  }
  // (des escarbilles de lumière qui filent vers nous)
  s += Array.from({ length: 16 }, (_, i) => { const a = hash(i, 61) * Math.PI * 2, r0 = 30 + 120 * hash(i, 62), l = 5 + 22 * (r0 / 280); const x = C[0] + r0 * Math.cos(a), y = C[1] + r0 * Math.sin(a) * 0.8; return lumineux(`M${f(x)},${f(y)} l${f(Math.cos(a) * l)},${f(Math.sin(a) * l * 0.8)}`, hash(i, 63) < 0.5 ? ACIDE : CYAN, 0.4 + r0 / 400, 0.1); }).join('');
  s += plein(A.rad([[0, '#000', 0], [0.75, '#000', 0.1], [1, '#000', 0.6]], 200, 200, 300));
  return A.out(s);
}

// ——— la mer de nuit ———
// des couches de vagues en papier, du large (pâles, dans la lumière de l'horizon) au premier plan (noires, saturées) :
// chaque crête faite de houles inégales, enroulées en volute à leur pointe, son liseré de lumière
function vague(A, y, h, l, i, couleurs, lumiere) {
  const pts = [];
  for (let x = G - l; x < D_ + l; x += l) {
    const w = l * (0.8 + 0.4 * hash(Math.round(x), i)), hh = h * (0.7 + 0.6 * hash(Math.round(x), i + 3));
    for (let j = 0; j <= 14; j++) { const t = j / 14; pts.push([x + w * t, y - hh * Math.sin(Math.PI * t) ** 1.4 + (t > 0.62 ? (t - 0.62) * hh * 0.9 : 0)]); }
  }
  const crete = pts.filter(([x]) => x > G - 40 && x < D_ + 40);
  let s = gravure(A, [...crete, [D_ + 40, D_ + 40], [G - 40, D_ + 40]], A.lin([[0, couleurs[0]], [0.4, couleurs[1]], [1, couleurs[2]]], 0, y - h, 0, y + 70), { seed: 1200 + i, amp: 0.2, angle: 6, pas: 3, ombre: 0.35, tailles: 1, tailleP: 4, trait: 1.4 + i * 0.3, portee: 0.55, dy: 5, lumiere: [0, -1] });
  s += lumineux(chemin(crete), lumiere, 0.5 + i * 0.25, 0.08);
  return s;
}
function mer(A, dans = '', horizon = 206) {
  let s = '';
  const couches = [[horizon + 4, 4, 34, ['#3E9AA8', '#1E5A6A', '#0E2E3A'], '#C8FFF0'], [horizon + 18, 6, 46, ['#1E6A78', '#0E3A48', '#082230'], '#9AF8E8'], [horizon + 38, 9, 62, ['#0E4A58', '#082A36', '#041822'], CYAN], [horizon + 66, 13, 84, ['#08323E', '#041C26', '#020E14'], CYAN], [horizon + 104, 18, 110, ['#06222C', '#03121A', '#01080C'], '#3EC8E8'], [horizon + 152, 24, 140, ['#041820', '#020A10', NOIR], '#2AA8D8']];
  couches.forEach(([y, h, l, c, lum], i) => { s += vague(A, y, h, l, i, c, lum); if (i === 2) s += dans; });
  return s;
}

// ——— le navire, en papier néon (doux : ses grandes surfaces sombres, ses lumières vives) ———
const douce = hex => { const c = neon(hex), n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, l = (Math.max(r, g, b) + Math.min(r, g, b)) / 510; if (g > 200 && r > 150 && b < 150) return c; const m = l > 0.72 ? 0.8 : 0.55; return '#' + [r, g, b].map(v => Math.round(v * m + 12 * (1 - m)).toString(16).padStart(2, '0')).join(''); };
const navireNeon = (p, lisere = CYAN) => avecStyle({ ...NEON, lisere }, () => navire(p)).replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, c => douce(c));
// le même, en traits de lumière seulement : ses cernes deviennent des tracés, le reste s'efface
const navireTrace = p => {
  const cernes = [];
  navire(p).replace(/<path d="([^"]+)" fill="none" stroke="#0D0905" stroke-width="[\d.]+" stroke-linejoin="round"\/>/g, (m, d) => cernes.push(d));
  return cernes.map(d => lumineux(d, CYAN, 0.9, 0.1)).join('');
};

function trace() {
  const A = atelier('kr'), H = 206, L = [214, 200];
  let s = plein(A.lin([[0, NOIR], [0.55, '#080522'], [0.85, '#14205A'], [1, '#1E6A7A']], 0, G, 0, H + 4));
  // (la lumière, derrière le navire, sur l'horizon : celle du bout du tunnel)
  s += plein(A.rad([[0, '#FFFFFF', 0.9], [0.06, ACIDE, 0.7], [0.2, '#3EE8B0', 0.32], [0.5, '#2A4AAA', 0.1], [1, '#2A4AAA', 0]], L[0], L[1], 280));
  s += rayons(A, L, 22, 300, '#E8FFD0', 0.12, 9) + etoiles(80, 41, 0, H - 20);
  // (de longues strates de nuages, au loin, éclairées par en dessous)
  for (const [y, op] of [[150, 0.5], [176, 0.35]]) { const bord = courbe(t => [G + (D_ - G) * t, y + 4 * Math.sin(t * 11) + 2 * Math.sin(t * 27)], 60); s += `<path d="${chemin([[G, y - 14], [D_, y - 14], ...bord.slice().reverse()], true)}" fill="${A.lin([[0, '#0A0626', 0], [1, '#2A1A6A', op]], 0, y - 14, 0, y)}"/>` + lumineux(chemin(bord), '#9AF0D8', 0.4, 0.06); }
  // (le navire : à gauche, déjà de papier ; à droite, encore un tracé ; entre les deux, la lumière qui le remplit)
  const front = 222;
  const papier = A.masque(A.lin([[0, '#FFF'], [0.86, '#FFF'], [1, '#000']], 40, 0, front + 16, 0), [G, G, D_ - G, D_ - G]);
  const traits = A.masque(A.lin([[0, '#000'], [0.6, '#000'], [1, '#FFF']], front - 50, 0, front + 24, 0), [G, G, D_ - G, D_ - G]);
  const etincelles = Array.from({ length: 16 }, (_, i) => { const y = 120 + hash(i, 71) * 150, x = front + (hash(i, 72) - 0.5) * 14; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + 1.6 * hash(i, 73))}" fill="${hash(i, 74) < 0.5 ? ACIDE : '#FFFFFF'}" opacity="${f(0.5 + 0.5 * hash(i, 75))}"/>`; }).join('');
  const bateau = `<g mask="${papier}">${navireNeon('krn', '#B8FFE8')}</g><g mask="${traits}">${navireTrace('krt')}</g>` + lumineux(`M${front + 3},116 Q${front - 2},190 ${front - 5},272`, ACIDE, 0.9, 0.18) + etincelles;
  s += mer(A, bateau, H);
  s += plein(A.rad([[0, '#000', 0], [0.7, '#000', 0.15], [1, '#000', 0.7]], 200, 210, 320));
  return A.out(s);
}

// ——— les racines tracées ———
// une racine : une bande qui suit une courbe, épaisse à sa base, effilée ; ses anneaux d'écorce, ses épines, ses veines
// de lumière ; au bout, ce qui n'est encore qu'un tracé (elle se dessine en sortant de l'abîme)
function racine(A, p0, c1, c2, p3, w0, couleurs, seed, dessinee = 0.78) {
  const bz = t => { const u = 1 - t; return [0, 1].map(j => u * u * u * p0[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p3[j]); };
  const at = t => { const [x, y] = bz(t), [x2, y2] = bz(Math.min(1, t + 0.01)), [x1, y1] = bz(Math.max(0, t - 0.01)), n = Math.hypot(x2 - x1, y2 - y1) || 1; return [x, y, -(y2 - y1) / n, (x2 - x1) / n]; };
  const larg = t => (w0 / 2) * (1 - (t / dessinee) * 0.9) ** 0.8 + 1;
  const T = courbe(t => t * dessinee, 44);
  const g = T.map(t => { const [x, y, nx, ny] = at(t), w = larg(t); return [x + nx * w, y + ny * w]; }), d = T.map(t => { const [x, y, nx, ny] = at(t), w = larg(t); return [x - nx * w, y - ny * w]; });
  let s = gravure(A, [...g, ...d.slice().reverse()], A.lin([[0, couleurs[0]], [1, couleurs[1]]], ...p0, ...p3), { seed, amp: 0.6, angle: 50, pas: 2.4, ombre: 0.35, tailles: 2, tailleP: 4, trait: 2.6, portee: 0.6, dx: 5, dy: 6 });
  // (les anneaux d'écorce : des arcs sombres en travers)
  for (let k = 1; k < 12; k++) { const t = (k / 12) * dessinee * 0.95, [x, y, nx, ny] = at(t), w = larg(t); s += `<path d="M${f(x + nx * w)},${f(y + ny * w)} Q${f(x - ny * w * 0.4)},${f(y + nx * w * 0.4)} ${f(x - nx * w)},${f(y - ny * w)}" fill="none" stroke="${ENCRE}" stroke-width="${f(1 + w / 18)}" opacity="0.7"/>`; }
  // (les épines)
  for (let k = 1; k < 9; k++) { const t = (k / 9) * dessinee, [x, y, nx, ny] = at(t), w = larg(t), c = k % 2 ? 1 : -1, l = 6 + w * 0.35; s += `<path d="M${f(x + c * nx * w - ny * 4)},${f(y + c * ny * w + nx * 4)} L${f(x + c * nx * (w + l) + ny * l * 0.4)},${f(y + c * ny * (w + l) - nx * l * 0.4)} L${f(x + c * nx * w + ny * 4)},${f(y + c * ny * w - nx * 4)} Z" fill="${couleurs[1]}" stroke="${ENCRE}" stroke-width="1.4" stroke-linejoin="round"/>`; }
  // (la veine de lumière, au milieu, et ses ramures)
  s += lumineux(chemin(courbe(t => t * dessinee * 0.97, 34).map(t => at(t).slice(0, 2))), couleurs[2], 1.1, 0.14);
  for (let k = 1; k < 7; k++) { const t = (k / 7) * dessinee * 0.9, [x, y, nx, ny] = at(t), w = larg(t) * 0.7, c = k % 2 ? 1 : -1; s += lumineux(`M${f(x)},${f(y)} q${f(c * nx * w * 0.6 + ny * w * 0.4)},${f(c * ny * w * 0.6 - nx * w * 0.4)} ${f(c * nx * w)},${f(c * ny * w)}`, couleurs[2], 0.6, 0.1); }
  // (le bout : encore un tracé, qui s'avance)
  s += lumineux(chemin(courbe(t => dessinee + t * (1 - dessinee), 16).map(t => at(t).slice(0, 2))), couleurs[2], 1.3, 0.22);
  const [bx, by] = bz(1);
  s += `<circle cx="${f(bx)}" cy="${f(by)}" r="3" fill="#FFFFFF"/><circle cx="${f(bx)}" cy="${f(by)}" r="9" fill="${couleurs[2]}" opacity="0.3"/>`;
  return s;
}
// la gerbe d'écume de lumière, au pied d'une racine qui sort de l'eau
const gerbe = ([x, y], c) => Array.from({ length: 9 }, (_, k) => { const a = Math.PI + (k / 8) * Math.PI, l = 14 + 10 * hash(k, Math.round(x)); return lumineux(`M${f(x + Math.cos(a) * 10)},${f(y + Math.sin(a) * 4)} q${f(Math.cos(a) * l * 0.5)},${f(-l * 0.9)} ${f(Math.cos(a) * l)},${f(-l * 0.5)}`, c, 0.7, 0.1); }).join('') + lumineux(`M${f(x - 30)},${f(y + 2)} q30,-8 60,0`, c, 0.9, 0.14);
function racines() {
  const A = atelier('kc'), H = 214;
  let s = plein(A.lin([[0, NOIR], [0.5, '#0E0428'], [1, '#2A0A44']], 0, G, 0, H));
  s += plein(A.rad([[0, MAGENTA, 0.3], [0.5, '#7A1A6E', 0.1], [1, '#7A1A6E', 0]], 80, 90, 230)) + plein(A.rad([[0, ACIDE, 0.22], [1, ACIDE, 0]], 330, 70, 160));
  [[60, 16, '#24104E', MAGENTA], [104, 20, '#1A0A3E', '#C870F0'], [150, 14, '#120830', MAGENTA]].forEach(([y, a, c, lum], i) => { const bord = courbe(t => [G + (D_ - G) * t, y + a * Math.sin(t * (9 + i * 3) + i) + a * 0.4 * Math.sin(t * 31)], 90); s += gravure(A, [[G, G], [D_, G], ...bord.slice().reverse()], A.lin([[0, NOIR], [1, c]], 0, G, 0, y + a), { seed: 1300 + i, amp: 0.4, angle: 20, pas: 3.2, tailles: 1, trait: 1.8, portee: 0.5, lumiere: [0, 1] }) + lumineux(chemin(bord), lum, 0.6, 0.08); });
  s += lumineux('M332,30 L316,74 L330,78 L306,128', ACIDE, 1.6, 0.25);
  s += Array.from({ length: 70 }, (_, i) => { const x = hash(i, 51) * 460 - 30, y = hash(i, 52) * 420 - 20; return `<path d="M${f(x)},${f(y)} l-5,20" stroke="${CYAN}" stroke-width="0.7" stroke-linecap="round" opacity="${f(0.15 + 0.35 * hash(i, 53))}"/>`; }).join('');
  // (le navire, frappé, gîté ; la moitié de ses hublots éteints)
  const eteints = [1, 2, 5, 7, 8].map(k => `<circle cx="${122 + k * 17}" cy="193" r="4.2" fill="#140A22" stroke="${ENCRE}" stroke-width="1.2"/>`).join('');
  const derriere = racine(A, [330, 300], [360, 240], [330, 170], [262, 118], 64, ['#24042C', '#6A1660', MAGENTA], 1410, 0.74);
  const bateau = derriere + gerbe([330, 302], MAGENTA) + `<g transform="rotate(12 205 250)">${navireNeon('kcn', '#FF9AD8')}${eteints}</g>`;
  const devant = racine(A, [70, 360], [40, 280], [90, 190], [176, 150], 86, ['#14042C', '#4A1474', ACIDE], 1400, 0.82);
  const traces = [['M150,420 C160,380 120,350 150,316 C166,298 156,278 138,272', '#9AF0FF'], ['M262,430 C270,392 236,362 262,330', MAGENTA], ['M30,420 C24,390 50,372 40,340', ACIDE]].map(([d, c]) => lumineux(d, c, 1, 0.18)).join('');
  s += mer(A, bateau, H) + devant + gerbe([70, 360], ACIDE) + traces;
  s += plein(A.rad([[0, '#000', 0], [0.7, '#000', 0.18], [1, '#000', 0.72]], 200, 220, 320));
  return A.out(s);
}

// (toutes en papier néon : sans taches de vieux papier, le modelé dans la nuit, des hachures légères)
const NUIT = { papier: false, modele: '#06020F', reflet: '#C8FFF4', hachures: 0.35, lisere: null };
const enNeon = dessin => () => avecStyle(NUIT, dessin);
module.exports = { tunnel: enNeon(tunnel), trace: enNeon(trace), racines: enNeon(racines) };
