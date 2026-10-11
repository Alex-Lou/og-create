// Boîte à outils « trait fin » des morceaux de bâtiments (styles manoir, colombage, épuré) : trait fin, matières
// dessinées (pierres, tuiles, bois), ombres douces. Identifiants de dégradés et de découpes tirés de leur contenu
// (stables d'une génération à l'autre).
import { P, mixHex } from './iso.js';
export { P, mixHex };
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
export const INK = '#3C2819';
export const f2 = n => Math.round(n * 100) / 100;
export const xy = ([x, y]) => `${f2(x)},${f2(y)}`;
export const pts = l => l.map(p => xy(P(...p))).join(' ');
export const rnd = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
// Dégradé en ligne : renvoie [defs, url]
export function grad(c0, c1, vertical = false, a = 1) {
  const id = `fg${hash(`${c0}|${c1}|${vertical}|${a}`)}`;
  return [`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${c0}" stop-opacity="${a}"/><stop offset="1" stop-color="${c1}" stop-opacity="${a}"/></linearGradient></defs>`, `url(#${id})`];
}
export const poly = (l, fill, w = 1, extra = '') => `<polygon points="${pts(l)}" fill="${fill}"${w ? ` stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"` : ''}${extra}/>`;
export const polyG = (l, c0, c1, vertical = false, w = 1) => { const [d, u] = grad(c0, c1, vertical); return d + poly(l, u, w); };
export const line = (a, b, w = 0.7, c = INK, extra = '') => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${extra}/>`; };
export const seg = (a, b, w = 0.7, c = INK, extra = '') => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
// Boîte : dessus, face avant (v = v1), face droite (u = u1), chacune en léger dégradé
export function boite(u0, v0, u1, v1, z0, z1, c, w = 0.9) {
  return poly([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], c.left, w)
    + poly([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], c.right, w)
    + poly([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], c.top, w);
}
// Appareil de pierre de taille sur une face : plan 'v' (v = f, le long de u) ou 'u' (u = f, le long de v)
export function appareil(plan, f, a0, a1, z0, z1, c, { rang = 3.8, long = [0.11, 0.2], seed = 1, joint = null } = {}) {
  const at = (a, z) => (plan === 'v' ? [a, f, z] : [f, a, z]);
  let out = poly([at(a0, z0), at(a1, z0), at(a1, z1), at(a0, z1)], joint || mixHex(c, '#6B5A45', 0.45), 0);
  let k = seed * 101;
  for (let z = z0, r = 0; z < z1 - 0.3; z += rang, r++) {
    const zt = Math.min(z1, z + rang);
    let a = a0 - (r % 2 ? long[0] * 0.5 : 0);
    while (a < a1) {
      const L = long[0] + rnd(k++) * (long[1] - long[0]);
      const s0 = Math.max(a0, a) + 0.007, s1 = Math.min(a1, a + L) - 0.007;
      if (s1 > s0 + 0.01) {
        const tone = mixHex(c, rnd(k) > 0.5 ? '#FFFFFF' : '#5A4A38', rnd(k + 7) * 0.14);
        out += poly([at(s0, z + 0.35), at(s1, z + 0.35), at(s1, zt - 0.35), at(s0, zt - 0.35)], tone, 0)
          + line(at(s0 + 0.004, zt - 0.6), at(s1 - 0.004, zt - 0.6), 0.6, 'rgba(255,255,255,.45)')
          + line(at(s0, z + 0.45), at(s1, z + 0.45), 0.6, 'rgba(60,40,20,.25)');
      }
      a += L; k++;
    }
  }
  return out;
}
// Ombre portée sous l'avant-toit sur une face (bande dégradée sous z)
export function ombreToit(plan, f, a0, a1, z, h = 6, a = 0.38) {
  const at = (s, zz) => (plan === 'v' ? [s, f, zz] : [f, s, zz]);
  const [d, u] = grad(`rgba(40,25,15,${a})`, 'rgba(40,25,15,0)', true);
  return d + `<polygon points="${pts([at(a0, z), at(a1, z), at(a1, z - h), at(a0, z - h)])}" fill="${u}"/>`;
}
// Toit à deux pans, faîtage le long de u (pignon visible sur la face +u) : pan avant couvert d'ardoises ou de tuiles,
// pignon, rives, faîtière. opts : { u0, v0, u1, v1, zr, hr, o, couleur, kind ('ardoise' | 'tuile'), pignon (svg du pignon) }
export function toit({ u0, v0, u1, v1, zr, hr, o, couleur, kind = 'ardoise', seed = 3, entre = '' }) {
  const vm = (v0 + v1) / 2, Z = zr + hr;
  const ve = v1 + o;
  // le pan avant : du faîtage (t = 0) à l'égout (t = 1)
  const zAt = t => Z - hr * t;
  const vAt = t => vm + (ve - vm) * t;
  let out = '';
  // pan arrière (silhouette derrière le faîtage)
  out += poly([[u0 - o, v0 - o, zr], [u1 + o, v0 - o, zr], [u1 + o, vm, Z], [u0 - o, vm, Z]], mixHex(couleur, '#1E1830', 0.35), 1) + entre;
  // fond du pan avant
  out += poly([[u0 - o, vm, Z], [u1 + o, vm, Z], [u1 + o, ve, zr], [u0 - o, ve, zr]], mixHex(couleur, '#1E1830', 0.25), 1);
  // rangs de tuiles ou d'ardoises, du bas vers le haut (chaque rang recouvre le haut du rang d'en dessous)
  const n = Math.round(hr / (kind === 'tuile' ? 4.6 : 4.2));
  const ds = kind === 'tuile' ? 0.1 : 0.085;
  let k = seed * 37;
  for (let r = n - 1; r >= 0; r--) {
    const t0 = r / n, t1 = Math.min(1, (r + 1.25) / n);
    const off = r % 2 ? ds / 2 : 0;
    for (let s = u0 - o - off; s < u1 + o - 0.005; s += ds) {
      const s0 = Math.max(u0 - o, s), s1 = Math.min(u1 + o, s + ds);
      if (s1 - s0 < 0.01) continue;
      const tone = mixHex(couleur, rnd(k) > 0.5 ? '#FFFFFF' : '#1E1830', rnd(k + 3) * 0.16); k++;
      const A = P(s0, vAt(t0), zAt(t0)), B = P(s1, vAt(t0), zAt(t0)), C = P(s1, vAt(t1), zAt(t1)), D = P(s0, vAt(t1), zAt(t1));
      const bulge = kind === 'tuile' ? 2.4 : 1.1;
      out += `<path d="M${xy(A)} L${xy(B)} L${xy(C)} Q${f2((C[0] + D[0]) / 2)},${f2((C[1] + D[1]) / 2 + bulge)} ${xy(D)} Z" fill="${tone}" stroke="${mixHex(couleur, '#140F20', 0.55)}" stroke-width="0.45"/>`
        + seg([D[0] + 0.6, D[1] - 0.8], [C[0] - 0.6, C[1] - 0.8], 0.5, 'rgba(255,255,255,.28)');
    }
  }
  // reflet doux en haut du pan, ombre en bas
  { const [d, u] = grad('rgba(255,255,255,.18)', 'rgba(20,10,30,.18)', true); out += d + `<polygon points="${pts([[u0 - o, vm, Z], [u1 + o, vm, Z], [u1 + o, ve, zr], [u0 - o, ve, zr]])}" fill="${u}"/>`; }
  out += poly([[u0 - o, vm, Z], [u1 + o, vm, Z], [u1 + o, ve, zr], [u0 - o, ve, zr]], 'none', 1.1);
  return out;
}
// Rive (planche de bord) le long du pignon visible et de l'égout, faîtière arrondie
export function rives({ u0, v0, u1, v1, zr, hr, o, bois = '#5E4330', faitiere = '#6A6478' }) {
  const vm = (v0 + v1) / 2, Z = zr + hr;
  const rive = [P(u1 + o, v0 - o, zr - 0.5), P(u1 + o, vm, Z + 0.8), P(u1 + o, v1 + o, zr - 0.5)].map(xy).join(' ');
  const eg = [P(u0 - o, v1 + o, zr), P(u1 + o, v1 + o, zr)];
  const fa = [P(u0 - o - 0.02, vm, Z + 0.6), P(u1 + o + 0.02, vm, Z + 0.6)];
  return `<polyline points="${rive}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<polyline points="${rive}" fill="none" stroke="${bois}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<polyline points="${rive}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="0.7" stroke-linejoin="round" transform="translate(-0.6,-0.8)"/>`
    + seg(eg[0], eg[1], 3.4, INK) + seg(eg[0], eg[1], 1.8, bois)
    + seg(fa[0], fa[1], 4.2, INK) + seg(fa[0], fa[1], 2.6, faitiere) + seg([fa[0][0], fa[0][1] - 0.7], [fa[1][0], fa[1][1] - 0.7], 0.7, 'rgba(255,255,255,.35)');
}
// Fenêtre sur la face avant (v = vf) : encadrement (pierre ou bois), tableau sombre, vitre en dégradé, meneau et traverse,
// reflet, appui. style : { cadre, vitre, petitsBois: 'croix' | 'losanges' | 'grille', volets: couleur | null, appui: couleur }
export function fenetreF(ua, ub, vf, z0, z1, s) {
  const e = s.epaisCadre ?? 0.025, ez = s.epaisCadreZ ?? 1.2;
  let out = '';
  if (s.volets) {
    const w = (ub - ua) * 0.5;
    [[ua - w - 0.015, ua - 0.015], [ub + 0.015, ub + w + 0.015]].forEach(([a, b]) => {
      out += polyG([[a, vf + 0.004, z0], [b, vf + 0.004, z0], [b, vf + 0.004, z1], [a, vf + 0.004, z1]], mixHex(s.volets, '#FFFFFF', 0.12), mixHex(s.volets, '#000000', 0.12), false, 0.8);
      for (let z = z0 + (z1 - z0) / 3; z < z1 - 0.5; z += (z1 - z0) / 3) out += line([a + 0.008, vf + 0.005, z], [b - 0.008, vf + 0.005, z], 0.5, 'rgba(0,0,0,.3)');
      out += line([a + 0.012, vf + 0.006, z0 + 1], [a + 0.012, vf + 0.006, z1 - 1], 0.5, 'rgba(255,255,255,.35)');
    });
  }
  out += poly([[ua - e, vf + 0.003, z0 - ez], [ub + e, vf + 0.003, z0 - ez], [ub + e, vf + 0.003, z1 + ez], [ua - e, vf + 0.003, z1 + ez]], s.cadre, 0.9)
    + poly([[ua, vf + 0.004, z0], [ub, vf + 0.004, z0], [ub, vf + 0.004, z1], [ua, vf + 0.004, z1]], '#2E2236', 0.6);
  const [d, g] = grad(mixHex(s.vitre, '#FFFFFF', 0.35), mixHex(s.vitre, '#5B4E7A', 0.25), true);
  out += d + poly([[ua + 0.014, vf + 0.005, z0 + 0.6], [ub, vf + 0.005, z0 + 0.6], [ub, vf + 0.005, z1 - 0.8], [ua + 0.014, vf + 0.005, z1 - 0.8]], g, 0);
  const um = (ua + ub) / 2, zm = z0 + (z1 - z0) * 0.6;
  if (s.petitsBois === 'losanges') {
    for (let t = -1; t <= 2; t += 0.34) {
      out += line([ua + (ub - ua) * t, vf + 0.006, z0], [ua + (ub - ua) * (t + 0.7), vf + 0.006, z1], 0.4, 'rgba(60,50,40,.65)')
        + line([ua + (ub - ua) * (t + 0.7), vf + 0.006, z0], [ua + (ub - ua) * t, vf + 0.006, z1], 0.4, 'rgba(60,50,40,.65)');
    }
    out += poly([[ua - e, vf + 0.007, z0 - ez], [ub + e, vf + 0.007, z0 - ez], [ub + e, vf + 0.007, z1 + ez], [ua - e, vf + 0.007, z1 + ez], [ua - e, vf + 0.007, z0 - ez], [ua, vf + 0.007, z0], [ua, vf + 0.007, z1], [ub, vf + 0.007, z1], [ub, vf + 0.007, z0], [ua, vf + 0.007, z0]], s.cadre, 0, ' fill-rule="evenodd"');
  } else {
    out += line([um, vf + 0.006, z0], [um, vf + 0.006, z1], 1.3, s.bois || '#F4EEE4') + line([ua, vf + 0.006, zm], [ub, vf + 0.006, zm], 1.1, s.bois || '#F4EEE4');
    if (s.petitsBois === 'grille') [0.25, 0.75].forEach(k => { out += line([ua + (ub - ua) * k, vf + 0.006, z0], [ua + (ub - ua) * k, vf + 0.006, z1], 0.6, s.bois || '#F4EEE4'); });
  }
  // reflet en diagonale
  out += `<polygon points="${pts([[ua + (ub - ua) * 0.15, vf + 0.006, z1 - 1], [ua + (ub - ua) * 0.38, vf + 0.006, z1 - 1], [ua + (ub - ua) * 0.08, vf + 0.006, z0 + (z1 - z0) * 0.35], [ua + 0.015, vf + 0.006, z0 + (z1 - z0) * 0.5]])}" fill="rgba(255,255,255,.35)"/>`;
  // appui saillant
  out += boite(ua - e - 0.01, vf, ub + e + 0.01, vf + 0.045, z0 - ez - 1.4, z0 - ez, s.appui || { top: '#E9E0CD', left: '#D3C6AA', right: '#B3A486' }, 0.7);
  return out;
}
// Fenêtre sur la face droite (u = uf)
export function fenetreD(uf, va, vb, z0, z1, s) {
  const e = s.epaisCadre ?? 0.025, ez = s.epaisCadreZ ?? 1.2;
  let out = poly([[uf + 0.003, va - e, z0 - ez], [uf + 0.003, vb + e, z0 - ez], [uf + 0.003, vb + e, z1 + ez], [uf + 0.003, va - e, z1 + ez]], mixHex(s.cadre, '#000000', 0.15), 0.9)
    + poly([[uf + 0.004, va, z0], [uf + 0.004, vb, z0], [uf + 0.004, vb, z1], [uf + 0.004, va, z1]], '#2A1F30', 0.6);
  const [d, g] = grad(mixHex(s.vitre, '#FFFFFF', 0.15), mixHex(s.vitre, '#4A3E66', 0.4), true);
  out += d + poly([[uf + 0.005, va, z0 + 0.6], [uf + 0.005, vb - 0.014, z0 + 0.6], [uf + 0.005, vb - 0.014, z1 - 0.8], [uf + 0.005, va, z1 - 0.8]], g, 0)
    + line([uf + 0.006, (va + vb) / 2, z0], [uf + 0.006, (va + vb) / 2, z1], 1.1, mixHex(s.bois || '#F4EEE4', '#000', 0.15))
    + line([uf + 0.006, va, z0 + (z1 - z0) * 0.6], [uf + 0.006, vb, z0 + (z1 - z0) * 0.6], 1, mixHex(s.bois || '#F4EEE4', '#000', 0.15));
  return out;
}
// Herbes fines (touffe) : quelques brins courbes
export function touffe(u, v, k = 1, c = '#5E9446', seed = 1) {
  const [x, y] = P(u, v, 0);
  let out = '';
  for (let i = 0; i < 7; i++) {
    const a = (rnd(seed * 13 + i) - 0.5) * 1.4, h = (5 + rnd(seed * 7 + i) * 5) * k;
    out += `<path d="M${f2(x + (i - 3) * 0.8 * k)},${f2(y)} q${f2(a * 3 * k)},${f2(-h * 0.6)} ${f2(a * 6 * k)},${f2(-h)}" stroke="${mixHex(c, i % 2 ? '#FFFFFF' : '#1E3A18', 0.15)}" stroke-width="${f2(0.9 * k)}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}
// Lavande : brins et épis violets
export function lavande(u, v, k = 1, seed = 1) {
  const [x, y] = P(u, v, 0);
  let out = `<ellipse cx="${f2(x)}" cy="${f2(y - 2 * k)}" rx="${f2(6 * k)}" ry="${f2(3 * k)}" fill="#7E9A68" stroke="${INK}" stroke-width="0.6"/>`;
  for (let i = 0; i < 9; i++) {
    const dx = (i - 4) * 1.3 * k, h = (8 + rnd(seed * 5 + i) * 4) * k, lean = dx * 0.35;
    out += seg([x + dx * 0.6, y - 3 * k], [x + dx + lean, y - h], 0.6 * k, '#6E8A5A')
      + `<ellipse cx="${f2(x + dx + lean)}" cy="${f2(y - h - 1.2 * k)}" rx="${f2(0.9 * k)}" ry="${f2(2 * k)}" fill="${i % 2 ? '#9C82DE' : '#8A6CCF'}" transform="rotate(${f2(lean * 3)} ${f2(x + dx + lean)} ${f2(y - h)})"/>`;
  }
  return out;
}

// Contenu découpé par un polygone (uvz)
export function clip(l, content) { const id = `fc${hash(pts(l))}`; return `<defs><clipPath id="${id}"><polygon points="${pts(l)}"/></clipPath></defs><g clip-path="url(#${id})">${content}</g>`; }
