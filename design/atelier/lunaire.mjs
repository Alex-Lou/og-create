// Le jardin lunaire de Mélisse par étapes (les chantiers des Jardins) : « Chaque chose en sa lune. » Ses plantes poussent
// au rythme de la lune (HISTOIRE.md, Mélisse) : on sème à la nouvelle lune, les pousses sortent au croissant, la plante
// grandit au premier quartier, ses boutons gonflent à la lune gibbeuse et elle fleurit, lumineuse, à la pleine lune, quand
// Lunette, son papillon de nuit, vient la voir. Un carré rond bordé de pierres pâles, sur une case ; au fond, la pierre de
// lune montre la phase. Quatre plantes : la mélisse (l'herbe qui porte son nom), la lunaire (ses disques d'argent), la
// fleur de lune (elle grimpe et s'ouvre la nuit), l'herbe des Anciens (la graine étrange de cette île). Chaque étape
// tourne en 3 images. Géométrie et lumière de world/iso.js, le cadre des cultures ; dessins en pixels du jeu
// (preview_lunaire.mjs les agrandit × 1,25).
import { P, EDGE } from './port/src/world/iso.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
const chemin = (d, stroke, w, fill = 'none') => `<path d="${d}" stroke="${stroke}" stroke-width="${f2(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const wave = (f, amp = 1, phase = 0) => Math.sin((f / IMAGES) * Math.PI * 2 + phase) * amp;
const bord = (w = 0.35) => ` stroke="${OUT}" stroke-width="${w}"`;

export const CADRE = [-34, -30, 68, 48]; // le cadre des cultures, en pixels du jeu
export const PLANTES = ['melisse', 'lunaire', 'fleur_de_lune', 'herbe_des_anciens'];
export const ETAPES = ['nouvelle_lune', 'croissant', 'quartier', 'gibbeuse', 'pleine_lune'];
export const IMAGES = 3;

/* ---------- le carré rond, ses pierres, la pierre de lune ---------- */
const R = 0.4; // le rayon du carré, en cases
const anneau = r => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return P(Math.cos(a) * r, Math.sin(a) * r, 0); });
const pts = list => list.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
// les pierres de bordure : celles du fond avant les plantes, celles de devant après
const PIERRES = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2);
const pierre = a => { const [x, y] = P(Math.cos(a) * (R + 0.04), Math.sin(a) * (R + 0.04), 0); return ell(x, y - 0.6, 2.4, 1.4, '#DAD5C8', bord(0.45)) + ell(x - 0.6, y - 1.1, 1.1, 0.5, '#F2EFE6'); };
const pierres = devant => PIERRES.filter(a => (Math.cos(a) + Math.sin(a) > 0) === devant).map(pierre).join('');
function carre() {
  return `<polygon points="${pts(anneau(R + 0.06))}" fill="#8FC060"${EDGE}/>` + `<polygon points="${pts(anneau(R))}" fill="#5E3E2E" stroke="#4A2F22" stroke-width="0.6"/>`
    + `<polygon points="${pts(anneau(R * 0.7))}" fill="#6A4634"/>` + pierres(false);
}
// la pierre de lune, au fond à droite : une pierre dressée, la lune gravée qui montre sa phase (0 nouvelle … 4 pleine)
function pierreDeLune(phase, f) {
  const [x, y] = P(0.44, -0.46, 0);
  let out = `<path d="M${f2(x - 3.4)},${f2(y)} L${f2(x - 3)},${f2(y - 9)} Q${f2(x)},${f2(y - 12)} ${f2(x + 3)},${f2(y - 9)} L${f2(x + 3.4)},${f2(y)} Z" fill="#B9B4AC"${EDGE}/>`
    + `<path d="M${f2(x + 1.2)},${f2(y)} L${f2(x + 1.4)},${f2(y - 10.6)} Q${f2(x + 2.6)},${f2(y - 10)} ${f2(x + 3)},${f2(y - 9)} L${f2(x + 3.4)},${f2(y)} Z" fill="#9A958C"/>`;
  const cx = x, cy = y - 6.4, r = 2.1;
  out += dot(cx, cy, r + 0.3, '#5A5650') + dot(cx, cy, r, '#3E3A44');
  if (phase > 0) {
    // la partie éclairée : croissant, moitié, gibbeuse, pleine (la pleine lune luit)
    const k = [0, 0.55, 0, -0.55, -1][phase];
    out += `<path d="M${f2(cx)},${f2(cy - r)} A${r},${r} 0 0,1 ${f2(cx)},${f2(cy + r)} A${f2(Math.abs(k) * r)},${r} 0 0,${k > 0 ? 0 : 1} ${f2(cx)},${f2(cy - r)} Z" fill="#F4F0D8"/>`;
    if (phase === 4) out += dot(cx, cy, r + 1.6 + wave(f, 0.4), 'rgba(244,240,200,.25)');
  }
  return out;
}

/* ---------- les plantes ---------- */
// les places : le cœur et six autour
const PLACES = [[0, 0], ...[0, 1, 2, 3, 4, 5].map(i => { const a = (i / 6) * Math.PI * 2 + 0.3; return [Math.cos(a) * 0.22, Math.sin(a) * 0.22]; })].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
const VERT = { fonce: '#3F7A2E', moyen: '#5FA04A', clair: '#8FCB6A', tendre: '#B8E07A' };
const feuille = (x, y, rx, ry, fill, rot = 0) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${bord()}${rot ? ` transform="rotate(${f2(rot)} ${f2(x)} ${f2(y)})"` : ''}/>`;
const lueur = (x, y, r, col, a) => dot(x, y, r, `rgba(${col},${f2(a)})`);
const etoile = (x, y, r, o = 1) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x)},${f2(y)} ${f2(x + r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + r)} Q${f2(x)},${f2(y)} ${f2(x - r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - r)} Z" fill="#FFFBE0" opacity="${f2(o)}"/>`;
const tige = (x, y, h, s, col = VERT.moyen) => ln([x, y], [x + s * 0.3, y - h], col, 0.7);

const DESSINS = {
  // la mélisse : un buisson de feuilles ovales dentelées, de petites fleurs blanches ; des reflets d'argent sous la lune
  melisse: {
    graine: (x, y) => dot(x - 0.5, y - 0.2, 0.35, '#2E2018') + dot(x + 0.6, y - 0.1, 0.35, '#2E2018'),
    pousse: (x, y, s) => tige(x, y, 1.6, s) + feuille(x - 0.9 + s * 0.3, y - 1.8, 0.9, 0.7, VERT.clair) + feuille(x + 0.9 + s * 0.3, y - 1.9, 0.9, 0.7, VERT.tendre),
    croissance: (x, y, s) => [[-1.6, -1.6, -30], [1.6, -1.8, 30], [-0.9, -3.2, -20], [1, -3.4, 20], [0, -4.4, 0]].map(([a, b, r], i) => feuille(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? VERT.clair : VERT.moyen, r)).join(''),
    bouton: (x, y, s) => DESSINS.melisse.croissance(x, y, s) + [[-1, -4.6], [1.2, -5], [0.1, -5.8]].map(([a, b]) => dot(x + a + s * 0.3, y + b, 0.45, '#E8F2D8')).join(''),
    fleur: (x, y, s, f, k) => DESSINS.melisse.croissance(x, y, s) + [[-1, -4.6], [1.2, -5], [0.1, -5.8], [-1.8, -3.2]].map(([a, b]) => dot(x + a + s * 0.3, y + b, 0.65, '#FFFFFF') + dot(x + a + s * 0.3, y + b, 0.25, '#F2D88A')).join('')
      + etoile(x + 1.8, y - 3.4 - (k % 2), 0.9, [1, 0.3, 0.6][(f + k) % 3])
  },
  // la lunaire : des feuilles en cœur, des fleurs mauves ; à la pleine lune, ses disques d'argent translucides
  lunaire: {
    graine: (x, y) => ell(x - 0.6, y - 0.2, 0.8, 0.5, '#7A5A3A', bord(0.3)) + ell(x + 0.8, y - 0.1, 0.8, 0.5, '#7A5A3A', bord(0.3)),
    pousse: (x, y, s) => tige(x, y, 2, s) + feuille(x - 1 + s * 0.3, y - 2.2, 1.1, 0.9, VERT.moyen, -20) + feuille(x + 1 + s * 0.3, y - 2.3, 1.1, 0.9, VERT.clair, 20),
    croissance: (x, y, s) => tige(x, y, 6, s) + [[-1.4, -2, -25], [1.4, -3, 25], [-1.2, -4.6, -20], [1.2, -5.6, 20]].map(([a, b, r], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1.1, i % 2 ? VERT.clair : VERT.moyen, r)).join(''),
    bouton: (x, y, s) => DESSINS.lunaire.croissance(x, y, s) + [[0, -7], [-0.8, -6.4], [0.9, -6.6]].map(([a, b]) => dot(x + a + s * 0.3, y + b, 0.6, '#B98AD8')).join(''),
    fleur: (x, y, s, f, k) => DESSINS.lunaire.croissance(x, y, s) + [[0, -7.4], [-1.4, -6.2], [1.5, -6.6]].map(([a, b], i) => lueur(x + a + s * 0.3, y + b, 2.1 + wave(f, 0.3, k + i), '235,238,255', 0.25)
      + `<ellipse cx="${f2(x + a + s * 0.3)}" cy="${f2(y + b)}" rx="1.5" ry="1.5" fill="rgba(240,242,255,.78)" stroke="#9AA0B8" stroke-width="0.4"/>` + dot(x + a + s * 0.3 - 0.4, y + b - 0.3, 0.3, '#C8CCE0')).join('')
  },
  // la fleur de lune : une liane qui grimpe à son petit arceau, des boutons en spirale ; elle s'ouvre, grande et blanche, la nuit
  fleur_de_lune: {
    graine: (x, y) => dot(x, y - 0.4, 0.8, '#3A2A22'),
    pousse: (x, y, s) => tige(x, y, 2, s, '#6FA84A') + feuille(x - 1.1 + s * 0.3, y - 2.2, 1.2, 0.7, VERT.clair, -35) + feuille(x + 1.1 + s * 0.3, y - 2.3, 1.2, 0.7, VERT.moyen, 35),
    croissance: (x, y, s) => chemin(`M${f2(x - 2)},${f2(y)} Q${f2(x - 2.4)},${f2(y - 8)} ${f2(x)},${f2(y - 8.4)} Q${f2(x + 2.4)},${f2(y - 8)} ${f2(x + 2)},${f2(y)}`, '#A9794A', 0.9)
      + chemin(`M${f2(x)},${f2(y)} q-2,-2 -1.6,-4 q0.6,-2.6 2.2,-3.6`, '#5E9A3E', 0.6)
      + [[-1.6, -2.6], [-1.2, -5], [1, -7.2]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1.1, i % 2 ? VERT.clair : VERT.moyen, a * 12)).join(''),
    bouton: (x, y, s) => DESSINS.fleur_de_lune.croissance(x, y, s) + [[1.6, -5.4], [-2, -7.4]].map(([a, b]) => chemin(`M${f2(x + a + s * 0.3)},${f2(y + b + 1.6)} q0.8,-1 0,-2.2 q-0.6,-0.6 0.2,-1`, '#F4F0E0', 1.4)).join(''),
    fleur: (x, y, s, f, k) => DESSINS.fleur_de_lune.croissance(x, y, s) + [[1.8, -5.6], [-2, -7.6]].map(([a, b], i) => {
      const cx = x + a + s * 0.3, cy = y + b, o = 1.7 + wave(f, 0.15, k + i);
      return lueur(cx, cy, o + 1.4, '255,252,230', 0.3) + dot(cx, cy, o, '#FFFFFF') + `<circle cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(o)}" fill="none" stroke="#C8C4B0" stroke-width="0.4"/>`
        + [0, 72, 144, 216, 288].map(t => ln([cx, cy], [cx + Math.cos(t * Math.PI / 180) * o * 0.8, cy + Math.sin(t * Math.PI / 180) * o * 0.8], '#E8E2C8', 0.3)).join('') + dot(cx, cy, 0.45, '#F2E8A0');
    }).join('')
  },
  // l'herbe des Anciens : la graine étrange de cette île ; des crosses qui se déroulent, des runes qui luisent, des
  // clochettes bleues lumineuses à la pleine lune
  herbe_des_anciens: {
    graine: (x, y, f, k) => lueur(x, y - 0.4, 1.4, '120,200,255', [0.2, 0.4, 0.3][(f + k) % 3]) + dot(x, y - 0.4, 0.6, '#7FD0F0'),
    pousse: (x, y, s) => chemin(`M${f2(x)},${f2(y)} q${f2(s * 0.3)},-2 0.6,-2.6 a0.8,0.8 0 1,0 -0.8,-0.6`, '#4FA8A0', 0.8),
    croissance: (x, y, s) => [-1.2, 0, 1.2].map((o, i) => chemin(`M${f2(x + o * 0.4)},${f2(y)} q${f2(o + s * 0.3)},-3 ${f2(o * 0.8)},-${f2(4.6 + (i === 1 ? 1 : 0))} a0.9,0.9 0 1,0 -0.9,-0.6`, i === 1 ? '#5CB8B0' : '#3E8E86', 0.9)).join('')
      + ln([x - 0.3, y - 1.6], [x + 0.3, y - 2.4], '#9FE8F4', 0.4),
    bouton: (x, y, s) => DESSINS.herbe_des_anciens.croissance(x, y, s) + [[-1.4, -5], [1.4, -5.2]].map(([a, b]) => ell(x + a + s * 0.3, y + b, 0.7, 0.9, '#5A88C8', bord(0.3))).join(''),
    fleur: (x, y, s, f, k) => DESSINS.herbe_des_anciens.croissance(x, y, s) + [[-1.4, -5], [1.4, -5.2], [0, -6.6]].map(([a, b], i) => {
      const cx = x + a + s * 0.3, cy = y + b;
      return lueur(cx, cy + 0.4, 2 + wave(f, 0.3, k + i), '120,200,255', 0.3) + `<path d="M${f2(cx - 1.1)},${f2(cy + 0.8)} Q${f2(cx - 1)},${f2(cy - 1.2)} ${f2(cx)},${f2(cy - 1.2)} Q${f2(cx + 1)},${f2(cy - 1.2)} ${f2(cx + 1.1)},${f2(cy + 0.8)} Z" fill="#8FD8F4"${bord(0.35)}/>`
        + dot(cx, cy + 0.9, 0.3, '#E8FAFF');
    }).join('') + dot(x + wave(f, 2, k), y - 8 - ((f + k) % 3), 0.35, '#CFF4FF')
  }
};

/* ---------- Lunette, le papillon de nuit de Mélisse ---------- */
function lunette(f) {
  const [x0, y0] = P(-0.18, 0.1, 13), x = x0 + [0, 3, 1.5][f], y = y0 + [0, -1.6, 0.8][f], o = [1, 0.45, 0.75][f];
  return lueur(x, y, 4, '210,240,200', 0.18)
    + [-1, 1].map(s => `<path d="M${f2(x)},${f2(y)} Q${f2(x + s * 3.6 * o)},${f2(y - 3)} ${f2(x + s * 3 * o)},${f2(y + 0.4)} Q${f2(x + s * 2 * o)},${f2(y + 2.4)} ${f2(x + s * 1.2 * o)},${f2(y + 4.2)} Q${f2(x + s * 0.6)},${f2(y + 1.6)} ${f2(x)},${f2(y)} Z" fill="#CFEAB8"${bord(0.4)}/>`
      + dot(x + s * 2.2 * o, y - 0.6, 0.45, '#E8C86A')).join('')
    + ln([x, y - 1], [x, y + 1.6], OUT, 0.8) + chemin(`M${f2(x - 0.3)},${f2(y - 1)} q-0.8,-1.2 -1.4,-1.4 M${f2(x + 0.3)},${f2(y - 1)} q0.8,-1.2 1.4,-1.4`, OUT, 0.35);
}

/* ---------- les étapes ---------- */
// Une étape d'une plante, image n (0 à 2) : la phase de la lune donne l'étape
export function etape(plante, quoi, n) {
  const d = DESSINS[plante];
  if (!d) throw new Error(`plante inconnue : ${plante} (${PLANTES.join(', ')})`);
  const phase = ETAPES.indexOf(quoi);
  if (phase < 0) throw new Error(`étape inconnue : ${quoi} (${ETAPES.join(', ')})`);
  const f = n % IMAGES;
  let out = carre() + pierreDeLune(phase, f);
  PLACES.forEach(([du, dv], k) => {
    const [x, y] = P(du, dv, 0), s = wave(f, phase < 2 ? 0.6 : 1, k * 0.9);
    out += [() => d.graine(x, y, f, k), () => d.pousse(x, y, s), () => d.croissance(x, y, s), () => d.bouton(x, y, s), () => d.fleur(x, y, s, f, k)][phase]();
  });
  out += pierres(true);
  // la rosée qui brille sous la lune gibbeuse ; Lunette vient à la pleine lune
  if (phase === 3) out += [[-0.3, 0.3], [0.32, 0.12], [0, -0.3]].map(([du, dv], i) => { const [x, y] = P(du, dv, 0); return etoile(x, y - 3, 0.7, [0.9, 0.3, 0.6][(f + i) % 3]); }).join('');
  if (phase === 4) out += lunette(f);
  return out;
}
