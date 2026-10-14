// Les égarés du Voile (HISTOIRE.md § 6.15, § 7.2 ; demande de l'auteur du 14 oct., version 2) : chacun est un
// morceau que le Voile a effacé et qui cherche ce qu'il était. Mystérieux et poétiques, beaux et un peu inquiétants,
// jamais mignons : petits mais pas des bébés (deux têtes et demie, à l'échelle d'un habitant ; l'Esprit un tiers plus
// grand), des silhouettes qu'on reconnaît en ombre chinoise, des doigts longs, un visage épuré (deux lueurs pâles, ou
// des yeux clos), l'expression dans la posture.
// La règle des cinq : le corps est en brume (bleus-gris translucides, trait bleu nuit #3B4763, le bas qui s'effiloche
// en volutes), un contre-jour de lune bleu-argent sur les bords, des ombres profondes ; un seul détail garde ses
// couleurs chaudes d'avant, net et saturé, au trait brun #3C2819 : le souvenir, qui pose sur l'égaré le seul reflet
// chaud de la silhouette.
// Chaque dessin porte ses propres identifiants (préfixe pref). Ancre (0, 0) au sol, sous l'égaré ; vue « avant » : il
// vient vers le bas à droite ; la lune est derrière lui, en haut à gauche.
const r2 = n => Math.round(n * 100) / 100;
const TRAIT = '#3B4763';
const BRUN = '#3C2819';
const LUNE = '#E6EEFF';

// Un dessin : ses dégradés, découpes et masques, nommés d'après son préfixe
function Dessin(pref) {
  let n = 0;
  const defs = [];
  const id = () => `${pref}${n++}`;
  const stops = list => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('');
  return {
    lin(list, x1, y1, x2, y2) {
      const i = id();
      defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}">${stops(list)}</linearGradient>`);
      return `url(#${i})`;
    },
    rad(list, cx, cy, r, fx = cx, fy = cy) {
      const i = id();
      defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fx="${r2(fx)}" fy="${r2(fy)}">${stops(list)}</radialGradient>`);
      return `url(#${i})`;
    },
    // découpe : « inner » seulement à l'intérieur de d
    clip(d, inner) {
      const i = id();
      defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`);
      return `<g clip-path="url(#${i})">${inner}</g>`;
    },
    // fondu vers le bas : plein au-dessus de y0, effacé sous y1 (le bas qui s'effiloche)
    fondu(y0, y1, inner, x = -40, w = 80) {
      const g = this.lin([[0, '#FFFFFF'], [1, '#FFFFFF', 0]], 0, y0, 0, y1);
      const i = id();
      defs.push(`<mask id="${i}" maskUnits="userSpaceOnUse" x="${x}" y="-120" width="${w}" height="140"><rect x="${x}" y="-120" width="${w}" height="140" fill="${g}"/></mask>`);
      return `<g mask="url(#${i})">${inner}</g>`;
    },
    def(xml) { defs.push(xml); },
    id,
    out(body) { return `<defs>${defs.join('')}</defs>${body}`; }
  };
}

// Petits morceaux de dessin
const path = (d, fill, stroke = 'none', w = 0, extra = '') => `<path d="${d}" fill="${fill}"${stroke !== 'none' ? ` stroke="${stroke}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"` : ''}${extra}/>`;
const line = (d, color, w, a = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` stroke-opacity="${r2(a)}"` : ''}/>`;
const ell = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}"${extra}/>`;
// Hasard fixe
const hash = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

// Un trait effilé le long d'une courbe de Bézier (a, c1, c2, b) : large de w0 au départ, de w1 au bout (racines,
// brindilles, doigts, mèches)
function effile(a, c1, c2, b, w0, w1) {
  const pt = t => {
    const u = 1 - t;
    return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
  };
  const N = 12, left = [], right = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = pt(t), q = pt(Math.min(1, t + 0.01)), o = pt(Math.max(0, t - 0.01));
    const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
    left.push([p[0] - (dy / l) * w, p[1] + (dx / l) * w]);
    right.push([p[0] + (dy / l) * w, p[1] - (dx / l) * w]);
  }
  const pts = [...left, ...right.reverse()];
  return 'M' + pts.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' L') + ' Z';
}

// L'ombre au sol, une flaque de brume
function sol(D, rx) {
  return ell(0, 0.4, rx, rx * 0.22, D.rad([[0, '#141A2C', 0.4], [0.7, '#1C2438', 0.16], [1, '#1C2438', 0]], 0, 0.4, rx));
}
// Les volutes du bas qui s'effilochent (phase : 0 à 1, elles tournent lentement)
function volutes(list, phase = 0) {
  return list.map(([x, y, s, flip], i) => {
    const k = flip ? -s : s, w = 0.45 + 0.2 * Math.sin((phase + i * 0.3) * Math.PI * 2);
    return line(`M${r2(x)},${r2(y)} q${r2(2.2 * k)},${r2(-1.8 * s)} ${r2(4 * k)},${r2(-0.4 * s)} q${r2(1.1 * k)},${r2(1.1 * s)} ${r2(-0.5 * k)},${r2(1.7 * s)} q${r2(-1 * k)},${r2(0.2 * s)} ${r2(-1 * k)},${r2(-0.7 * s)}`, '#B7C4DA', w * s, 0.45);
  }).join('');
}
// Une lueur pâle (œil) : un point et son halo
function lueur(D, x, y, r = 0.8, couleur = '#E4EEFF') {
  return ell(x, y, r * 3, r * 2.4, D.rad([[0, couleur, 0.4], [1, couleur, 0]], x, y, r * 3)) + ell(x, y, r, r * 0.7, couleur);
}
// Le reflet chaud du souvenir sur l'égaré
const chaud = (D, x, y, r, a = 0.34) => ell(x, y, r, r, D.rad([[0, '#FFC27A', a], [0.5, '#FFB067', a * 0.3], [1, '#FFB067', 0]], x, y, r));
// La brume du corps : claire au dos (la lune est derrière, en haut à gauche), profonde devant et en bas
const brumeDe = (D, x0, y0, x1, y1, clair = '#C8D3E6', mi = '#8D9EBF', fond = '#4F5F82') => D.lin([[0, clair], [0.45, mi], [1, fond]], x0, y0, x1, y1);
// Le contre-jour de lune : un liseré argenté sur un bord
const contreJour = (d, a = 1) => line(d, LUNE, 2.4, 0.16 * a) + line(d, LUNE, 0.75, 0.8 * a);
// Un corps de brume : sa forme pleine, fondue vers le bas, son trait bleu nuit (plus fin dans l'ombre du bas)
function corps(D, d, fill, top, bottom, inner = '') {
  return D.fondu(bottom - 9, bottom + 0.5, `<g opacity="0.93">${path(d, fill, TRAIT, 0.85)}${D.clip(d, inner)}</g>`);
}


// ---- Les poses ----
// marche1, marche2, repos ; bouderie1, bouderie2 (repoussé : il se détourne, avec dignité) ; fuite1, fuite2 ;
// luciole1 à luciole4 (le souvenir s'allume et s'envole : 1, il s'apaise, le souvenir luit ; 2, le corps pâlit ; 3, il
// ne reste que le souvenir, devenu lumière ; 4, elle s'élève) ; brume1 à brume3 (il retourne au Voile) ; et des poses à
// lui : dort1, dort2 (le Dormeur), terre1 à terre3 (la Racine)
const POSES = {
  avant: ['marche1', 'marche2', 'repos', 'bouderie1', 'bouderie2', 'fuite1', 'fuite2', 'luciole1', 'luciole2', 'luciole3', 'luciole4', 'brume1', 'brume2', 'brume3'],
  dos: ['marche1', 'marche2', 'repos', 'fuite1', 'fuite2']
};
const poseOf = pose => ({ kind: pose.replace(/\d$/, ''), n: +(pose.match(/\d$/) || [0])[0] });

// L'aura froide de la brume derrière l'égaré, et quelques poussières de lumière qui flottent autour
function aura(D, cx, cy, rx, ry, a = 1) {
  return ell(cx, cy, rx, ry, D.rad([[0, '#A9BEE4', 0.2 * a], [0.6, '#8FA6D0', 0.08 * a], [1, '#8FA6D0', 0]], cx, cy, Math.max(rx, ry)));
}
function poussieres(D, list, a = 1) {
  return list.map(([x, y, r]) => ell(x, y, r * 2.4, r * 2.4, D.rad([[0, '#DCE7FF', 0.55 * a], [1, '#DCE7FF', 0]], x, y, r * 2.4)) + ell(x, y, r * 0.5, r * 0.5, '#F2F6FF', ` opacity="${r2(0.8 * a)}"`)).join('');
}
// Une étincelle de lumière chaude (quatre branches)
const etincelle = (x, y, s = 1, a = 1) => path(`M${r2(x)},${r2(y - 1.8 * s)} L${r2(x + 0.35 * s)},${r2(y - 0.35 * s)} L${r2(x + 1.8 * s)},${r2(y)} L${r2(x + 0.35 * s)},${r2(y + 0.35 * s)} L${r2(x)},${r2(y + 1.8 * s)} L${r2(x - 0.35 * s)},${r2(y + 0.35 * s)} L${r2(x - 1.8 * s)},${r2(y)} L${r2(x - 0.35 * s)},${r2(y - 0.35 * s)} Z`, '#FFF4CF', 'none', 0, a < 1 ? ` opacity="${r2(a)}"` : '');
// Une lumière chaude ronde (le souvenir devenu lumière)
const halo = (D, x, y, r, a = 1) => ell(x, y, r, r, D.rad([[0, '#FFF1C4', 0.85 * a], [0.25, '#FFD88A', 0.55 * a], [0.6, '#FFB65C', 0.18 * a], [1, '#FFB65C', 0]], x, y, r));
// Des volutes qui montent (il retourne au Voile)
function montee(D, n, x0, y0, w) {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const x = x0 + (hash(i, 31) - 0.5) * w, y = y0 - n * 6 - hash(i, 33) * 14 - i * 1.5, k = 0.7 + hash(i, 35) * 0.6;
    s += line(`M${r2(x)},${r2(y)} q${r2(2 * k)},${r2(-2.4 * k)} ${r2(0.6 * k)},${r2(-4.6 * k)} q${r2(-1.2 * k)},${r2(-1.6 * k)} ${r2(0.4 * k)},${r2(-3 * k)}`, '#C3CFE3', 0.8 * k, r2((0.6 - n * 0.12) * (1 - i * 0.08)));
  }
  return s;
}

// Assemble un égaré : ses couches (b le corps derrière, sv le souvenir, f le corps devant) posées selon la pose (t :
// transform ; pale : le corps qui pâlit ; le souvenir aussi dans la brume), l'aura et les poussières, la lumière du
// souvenir (o.glow : [x, y] dans son repère), sa lumière seule (o.lumiere(k) : luciole 3 et 4), ce qu'il laisse en
// retournant au Voile (o.voile(n))
function finir(D, P, c, o) {
  const { kind, n } = P;
  const [ax, ay, arx, ary] = o.aura;
  let s = sol(D, o.sol || 12);
  if (kind === 'luciole' && n >= 3) {
    s += aura(D, ax, ay, arx, ary, 0.5) + o.lumiere(n) + poussieres(D, [[ax - 8, ay - 10, 0.9], [ax + 9, ay - 16, 0.7], [ax - 3, ay - 24, 0.6]], n === 3 ? 0.9 : 0.5);
    return D.out(s);
  }
  const pale = kind === 'luciole' && n === 2 ? 0.36 : kind === 'brume' ? [1, 0.68, 0.34, 0][n] : 1;
  const svA = kind === 'brume' ? pale : 1;
  s += aura(D, ax, ay, arx, ary, kind === 'brume' ? 1 - n * 0.25 : 1);
  let g = '';
  if (pale > 0) g += pale < 1 ? `<g opacity="${r2(pale)}">${c.b}</g>` : c.b;
  if (svA > 0) {
    if (kind === 'luciole') g += halo(D, o.glow[0], o.glow[1], n === 1 ? 16 : 20, n === 1 ? 0.75 : 1);
    g += svA < 1 ? `<g opacity="${r2(svA)}">${c.sv}</g>` : c.sv;
  }
  if (pale > 0 && c.f) g += pale < 1 ? `<g opacity="${r2(pale)}">${c.f}</g>` : c.f;
  if (kind === 'luciole') g += etincelle(o.glow[0] - 5, o.glow[1] - 4, 0.7, 0.9) + etincelle(o.glow[0] + 5, o.glow[1] + 2, 0.55, 0.8) + (n === 2 ? etincelle(o.glow[0] + 1, o.glow[1] - 8, 0.6, 0.85) : '');
  s += `<g transform="${o.t}">${g}</g>`;
  if (kind === 'brume') s += montee(D, n, ax, ay + ary * 0.4, arx * 1.4) + o.voile(n);
  s += poussieres(D, o.motes || [[ax - arx * 0.8, ay - ary * 0.3, 0.7], [ax + arx * 0.75, ay - ary * 0.55, 0.55], [ax - arx * 0.3, ay - ary * 0.95, 0.5]], kind === 'brume' ? 1 - n * 0.3 : 0.85);
  return D.out(s);
}
const tf = (bob = 0, lean = 0, flip = false) => `translate(0 ${r2(bob)}) rotate(${r2(lean)} 0 0)${flip ? ' scale(-1 1)' : ''}`;

// ---- 1. Le Sans-Nom : un suaire de brume comme du lin mouillé, le capuchon tombant ; sous le capuchon, l'ombre et deux
// lueurs ; une main longue et fine tient contre lui l'étiquette de bagage de l'Hirondelle, dont l'encre a coulé. Attiré
// par la lumière : au repos, il lève l'étiquette vers elle, comme pour la lire. Repoussé, il ramène le suaire sur lui et
// se détourne ; il retourne au Voile en lettres de brume illisibles ----
const SN_CORPS = 'M-2,-56 C4,-57 9.5,-52 11.5,-46.5 C12.3,-44 11.6,-42 10.2,-40.6 C12.6,-38 13.6,-33.5 13.2,-28 C12.8,-21 12.6,-15 13.4,-9 C11.8,-6.6 10,-4.6 8.2,-5.8 C7,-3 4.8,-1.8 3.2,-3.8 C1.8,-1.4 -0.6,-0.6 -2.2,-3 C-4,-1 -7,-1.2 -8,-4 C-10.5,-2 -14.5,-2.6 -16.5,-4.4 C-13.5,-5.4 -12.5,-7.5 -12.4,-10 C-12.6,-18 -12.2,-28 -11,-36 C-10,-45 -7.5,-53 -2,-56 Z';
const snMain = lift => ({ hx: r2(13.5 + 4.5 * lift), hy: r2(-33 - 11 * lift) });
function snEtiquette(D, tx, ty, rot, lumiere = 0) {
  const carton = lumiere ? D.lin([[0, '#FFF8E2'], [0.5, '#FFE3A0'], [1, '#FFC069']], -3, -4.8, 3, 4.6) : D.lin([[0, '#F8ECCE'], [0.6, '#EAD5A6'], [1, '#CDB07A']], -3, -4.8, 3, 4.6);
  return `<g transform="translate(${r2(tx)} ${r2(ty)}) rotate(${r2(rot)})">`
    + path('M-3,-3.4 L-1.6,-4.8 L1.6,-4.8 L3,-3.4 L3,4.6 L-3,4.6 Z', carton, BRUN, 0.65)
    + line('M-2.6,-3.3 L-1.5,-4.4 L1.5,-4.4 L2.6,-3.3', '#FFFFFF', 0.4, 0.6)
    + (lumiere ? '' : path('M-2.2,-1.4 C-1.4,0.4 -2,2.2 -1,4 L-0.2,4 C-1,2.2 -0.4,0.6 -1,-1.4 Z', '#33476E', 'none', 0, ' opacity="0.45"') + line('M0.5,-1.6 C1.4,0.2 0.7,1.8 1.6,3.8', '#2B3A5A', 0.45, 0.45) + line('M-1.6,-2.1 C-0.4,-2.4 0.8,-1.9 1.8,-2.2', '#2B3A5A', 0.42, 0.4))
    + ell(0, -3.2, 0.95, 0.95, '#C9A050', ` stroke="${BRUN}" stroke-width="0.4"`) + ell(-0.25, -3.45, 0.3, 0.3, '#FFF0B8') + ell(0, -3.2, 0.36, 0.36, '#4A3218')
    + '</g>';
}
function sansNom(pref, view, pose) {
  const D = Dessin(pref);
  const P = poseOf(pose);
  const dos = view === 'dos';
  const prm = {
    repos: [0, -4, 1, 0], marche1: [-0.8, 3, 0.35, 0.2], marche2: [0.3, 4, 0.3, 0.7], bouderie1: [0, -9, 0, 0.3], bouderie2: [0.2, -5, 0, 0.5],
    fuite1: [-1, 12, 0, 0.1], fuite2: [0.4, 15, 0, 0.6], luciole1: [-0.5, -1, 0.6, 0.3], luciole2: [-1, -1, 0.6, 0.4], brume1: [0, -2, 0.4, 0.3], brume2: [-1, -2, 0.4, 0.5], brume3: [-2, -2, 0.4, 0.7]
  }[pose] || [0, -4, 1, 0];
  const [bob, lean, lift, phase] = prm;
  const c = { b: '', sv: '', f: '' };
  c.b += corps(D, SN_CORPS, brumeDe(D, -10, -54, 12, -12), -56, 0,
    ell(dos ? -2 : 10, -20, 10, 24, D.rad([[0, '#121829', 0.55], [1, '#121829', 0]], dos ? -2 : 10, -20, 13))
    + ell(-4, -50, 7, 5, D.rad([[0, '#E2EAF7', 0.35], [1, '#E2EAF7', 0]], -4, -50, 7))
    + [[-6.5, -44, -8, -6, 0.5], [-2.5, -40, -3.5, -3, 0.45], [2, -38, 1.5, -4, 0.4], [6.5, -35, 7.5, -6, 0.35], [10, -33, 11, -9, 0.3]].map(([x0, y0, x1, y1, a], i) =>
      line(`M${x0},${y0} C${r2(x0 - 1.2)},${r2(y0 + 12)} ${r2(x1 + 1.2)},${r2(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r2(x0 + 0.7)},${y0} C${r2(x0 - 0.5)},${r2(y0 + 12)} ${r2(x1 + 1.9)},${r2(y1 - 12)} ${r2(x1 + 0.7)},${y1}`, LUNE, 0.45, a * (i < 2 ? 0.7 : 0.35))).join('')
    + (dos ? line('M3,-55 C5,-48 6,-40 5.5,-30', TRAIT, 0.6, 0.55) + line('M3.7,-55 C5.7,-48 6.7,-40 6.2,-30', LUNE, 0.45, 0.35) : line('M-1,-53 C3,-49.5 4.6,-45 4,-40.6', TRAIT, 0.5, 0.45)));
  c.b += contreJour('M-2,-56 C-7.5,-53 -10,-45 -11,-36 C-12.2,-28 -12.6,-18 -12.4,-10');
  if (dos) {
    // de dos : le capuchon, et la ficelle rouge de l'étiquette qui dépasse du suaire
    c.sv += line('M12.8,-30 C14.6,-27 14.2,-23 15,-20', '#C23A2C', 0.5) + chaud(D, 13, -26, 7, 0.22);
  } else {
    const creux = 'M10.4,-40.8 C6.4,-41 3.6,-43.2 3.6,-47 C3.8,-50.2 6.8,-51.8 9.6,-50.2 C11.2,-47 11.4,-43.4 10.4,-40.8 Z';
    c.b += path(creux, D.rad([[0, '#070A14'], [0.65, '#141A2C'], [1, '#2A3450']], 7.4, -45.4, 5.2), TRAIT, 0.6);
    c.b += P.kind === 'bouderie' && P.n === 2 ? '' : lueur(D, 6.3, -46.4, 0.62) + lueur(D, 8.8, -45.8, 0.58);
    // la manche drapée, la main longue, l'étiquette (levée vers la lumière, ou serrée contre lui)
    const { hx, hy } = snMain(lift);
    c.b += path(`M9.6,-37.2 C12.4,-38.6 ${r2(hx - 3.6)},${r2(hy + 3.4)} ${r2(hx - 1)},${r2(hy - 0.4)} L${r2(hx + 1)},${r2(hy + 1.6)} C${r2(hx - 0.4)},${r2(hy + 5)} ${r2(hx - 2)},${r2(hy + 7.6)} ${r2(hx - 3)},${r2(hy + 11)} C${r2(hx - 4.6)},${r2(hy + 8.6)} 13,-31 11.2,-30 Z`, brumeDe(D, 9, -46, 17, -26), TRAIT, 0.8)
      + line(`M10.4,-36.6 C12.6,-37.4 ${r2(hx - 3.4)},${r2(hy + 3.6)} ${r2(hx - 1.4)},${r2(hy + 1)}`, LUNE, 0.55, 0.45);
    const tx = hx + 2.6, ty = hy - 6;
    c.sv += chaud(D, tx, ty + 2, 16, 0.38) + line('M10.6,-47 C11.5,-44.4 11,-42 10.2,-40.6', '#FFC27A', 0.7, 0.55 * lift);
    c.sv += snEtiquette(D, tx, ty, -16 + 22 * (1 - lift));
    c.sv += line(`M${r2(tx)},${r2(ty - 3.2)} C${r2(tx - 3)},${r2(ty - 0.6)} ${r2(hx - 1.4)},${r2(hy - 2.6)} ${r2(hx)},${r2(hy - 0.4)}`, '#C23A2C', 0.5);
    for (const [dx, dy, len] of [[-0.6, 0, 5.6], [0.3, 0.6, 5.2], [1, 1, 4]]) c.f += path(effile([hx + dx, hy + dy], [hx + dx + 1.2, hy + dy - 1.6], [hx + dx + 2, hy + dy - len * 0.6], [hx + dx + 1.8 + dx, hy + dy - len], 1.1, 0.35), '#CBD6E8', TRAIT, 0.45);
    // repoussé : il ramène le suaire sur lui (un pan qui couvre la main)
    if (P.kind === 'bouderie') c.f += path(`M2,-40 C8,-38 ${r2(hx + 1)},${r2(hy + 2)} ${r2(hx + 2)},${r2(hy + 7)} C${r2(hx)},${r2(hy + 12)} 8,-22 3,-20 Z`, brumeDe(D, 2, -40, 18, -20, '#C8D3E6', '#93A3C2', '#5E6F92'), TRAIT, 0.75) + line(`M3,-39.2 C8,-37 ${r2(hx)},${r2(hy + 2.4)} ${r2(hx + 1.4)},${r2(hy + 6.4)}`, LUNE, 0.45, 0.45);
  }
  c.b += volutes([[-15, -3.4, 1.1], [3, -1.5, 0.9, true], [-5, 0.5, 0.8], [9, -3.5, 0.7, true]], phase);
  const { hx, hy } = snMain(lift);
  return finir(D, P, c, {
    t: tf(bob, lean, P.kind === 'bouderie' && P.n === 2), aura: [0, -30, 18, 30], sol: 12, glow: [hx + 2.6, hy - 5],
    lumiere: k => {
      const { hx: x0, hy: y0 } = snMain(0.6);
      const x = x0 + 2.6, y = y0 - 6 - (k === 4 ? 18 : 0);
      return halo(D, x, y, k === 4 ? 14 : 18) + `<g opacity="${k === 4 ? 0.85 : 1}">${snEtiquette(D, x, y, k === 4 ? 8 : -10, 1)}</g>`
        + (k === 4 ? [[0, 6, 0.8], [-1.2, 11, 0.6], [0.8, 15, 0.45]].map(([dx, dy, a]) => etincelle(x + dx, y + dy, 0.6, a)).join('') : etincelle(x - 6, y - 5, 0.8) + etincelle(x + 6, y + 3, 0.6));
    },
    // les lettres de brume illisibles qui se dispersent
    voile: n => [[-6, -44], [3, -50], [-2, -36], [6, -40], [-9, -30], [1, -26], [8, -32], [-4, -52]].map(([x, y], i) => {
      const dx = x * (0.4 + n * 0.35), dy = y - n * 5 - hash(i, 41) * 4, k = 0.8 + hash(i, 43) * 0.5;
      const glyphe = [`M0,0 q1,-1.6 2,0 t2,0`, `M0,0 l0.8,-2 l0.8,2 m-1.3,-0.8 l1,0`, `M0,-1 c1,-1 2,1 1,1.6 c-0.8,0.4 -1.6,-0.6 -0.6,-1.2`, `M0,0 l1.6,-1.8 m-1.8,0 l2,2`][i % 4];
      return `<g transform="translate(${r2(dx)} ${r2(dy)}) scale(${r2(k)})">` + line(glyphe, '#DCE5F4', 0.5, r2(0.75 - n * 0.18)) + '</g>';
    }).join('')
  });
}

// ---- 2. Le Dormeur : voûté, d'argile grise et humide, la tête basse dans le capuchon d'une robe ancienne de scribe,
// les yeux clos, un bras à demi levé en somnambule ; la bordure de runes presque effacée ; des fêlures pâles là où des
// mots ont été arrachés ; contre sa poitrine, une tablette d'argile cuite, vide, et un stylet de roseau. La lumière ne
// lui fait rien ; une clôture l'arrête et l'endort (dort1, dort2 : endormi debout, le front sur la tablette ; un mot à
// demi formé luit puis s'éteint). Luciole : un signe s'écrit enfin sur la tablette, s'allume et s'élève ----
const DO_CORPS = 'M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4 C-11.6,-2 -9.8,-4.2 -8.2,-1.6 C-6.2,-3.4 -4.2,-0.6 -2.2,-2.6 C-0.2,-0.4 2.4,-2.8 4.4,-0.8 C6.4,-3 8.4,-1.2 10.4,-3.4 C11,-11 11.6,-19 10,-27 C9,-32 7,-35.5 5,-37.5 Z';
const RUNES = ['M0,-0.7 l0,1.4 m-0.6,-0.7 l1.2,0', 'M-0.5,-0.7 l1,0.7 l-1,0.7', 'M-0.6,0.6 l0.6,-1.3 l0.6,1.3', 'M0,-0.7 a0.6,0.6 0 1,0 0.1,0'];
// La tablette d'argile cuite ; signe : 0 vide, sinon la lueur du signe qui s'écrit
function doTablette(D, x, y, rot, signe = 0, lumiere = false) {
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`
    + path('M-4.6,-5.6 Q-4.8,-6.4 -3.8,-6.4 L3.8,-6.4 Q4.8,-6.4 4.6,-5.6 L4.4,5.4 Q4.4,6.2 3.6,6.2 L-3.6,6.2 Q-4.4,6.2 -4.4,5.4 Z', lumiere ? D.lin([[0, '#FFF2C8'], [0.5, '#FFD27E'], [1, '#F2A04A']], -4, -6, 4, 6) : D.lin([[0, '#E6A862'], [0.55, '#C47E3C'], [1, '#8E521F']], -4, -6, 4, 6), BRUN, 0.7)
    + path('M-3.4,-5 L3.4,-5 L3.3,4.6 L-3.3,4.6 Z', 'none', '#7A4418', 0.42, ' stroke-opacity="0.5"')
    + line('M-3.8,-5.9 L3.6,-5.9', '#FAD49A', 0.5, 0.75)
    + (lumiere ? '' : ell(-2.6, 3.4, 0.5, 0.3, '#9A5A26', ' opacity="0.5"') + ell(1.8, -2, 0.4, 0.25, '#9A5A26', ' opacity="0.4"'))
    + (signe ? ell(0, 0, 4, 4, D.rad([[0, '#FFF0B0', 0.7 * signe], [1, '#FFD27A', 0]], 0, 0, 4)) + line('M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6', '#FFF6D0', 0.7, r2(Math.min(1, signe * 1.2))) + line('M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6', '#9A4E14', 0.3, r2(signe * 0.6)) : '')
    + '</g>';
}
function dormeur(pref, view, pose) {
  const D = Dessin(pref);
  const P = poseOf(pose);
  const dos = view === 'dos';
  const dort = P.kind === 'dort';
  const prm = {
    repos: [0, 0, 1, 0], marche1: [-0.6, 3, 1, 0.2], marche2: [0.2, 5, 0.85, 0.7], bouderie1: [0, -6, 0.3, 0.3], bouderie2: [0.3, -3, 0.2, 0.5],
    fuite1: [-0.8, 11, 0.6, 0.1], fuite2: [0.3, 13, 0.5, 0.6], luciole1: [0, 0, 0.4, 0.3], luciole2: [-0.6, 0, 0.4, 0.4], brume1: [0, 0, 0.6, 0.3], brume2: [0.4, 0, 0.6, 0.5], brume3: [0.8, 0, 0.6, 0.7],
    dort1: [0, 9, 0, 0.2], dort2: [0.5, 9.5, 0, 0.5]
  }[pose] || [0, 0, 1, 0];
  const [bob, lean, reach, phase] = prm;
  const c = { b: '', sv: '', f: '' };
  c.b += corps(D, DO_CORPS, brumeDe(D, -12, -46, 10, -10, '#C1CBDD', '#8796B5', '#4D5C7D'), -46, 0,
    ell(dos ? -3 : 8, -16, 10, 22, D.rad([[0, '#10172A', 0.55], [1, '#10172A', 0]], dos ? -3 : 8, -16, 13))
    + ell(-8, -40, 7, 6, D.rad([[0, '#E0E8F5', 0.3], [1, '#E0E8F5', 0]], -8, -40, 7))
    + line('M-13.3,-9 C-6,-7 3,-7.2 10.6,-9.2', '#D9E2F0', 0.45, 0.35) + line('M-13.4,-6.4 C-6,-4.4 3,-4.7 10.5,-6.6', '#D9E2F0', 0.45, 0.28)
    + [[-11, -7.8], [-7.4, -6.9], [-3, -6.5], [1.2, -6.6], [5.6, -7.2], [8.6, -7.8]].map(([x, yy], i) => line(RUNES[i % 4].replace('M', `M${r2(x)},${r2(yy)} m`), '#D9E2F0', 0.4, [0.4, 0.3, 0.1, 0.35, 0.05, 0.3][i])).join('')
    + [[-9, -38, -10.5, -6, 0.45], [-4.5, -40, -5.5, -3, 0.4], [1, -38, 0.6, -3, 0.35], [6, -32, 6.8, -5, 0.3]].map(([x0, y0, x1, y1, a]) => line(`M${x0},${y0} C${r2(x0 - 1.5)},${r2(y0 + 12)} ${r2(x1 + 1)},${r2(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r2(x0 + 0.7)},${y0} C${r2(x0 - 0.8)},${r2(y0 + 12)} ${r2(x1 + 1.7)},${r2(y1 - 12)} ${r2(x1 + 0.7)},${y1}`, LUNE, 0.4, a * 0.6)).join('')
    + (dos ? line('M2,-45 C1,-36 0.6,-24 1,-8', TRAIT, 0.6, 0.5) + line('M2.6,-45 C1.6,-36 1.2,-24 1.6,-8', LUNE, 0.45, 0.35) : ''));
  c.b += contreJour('M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4');
  // le bras levé en avant, en somnambule (reach) : la main pend, poignet mou, doigts longs
  if (!dort) {
    const bx = r2(11 + 5.5 * reach), by = r2(-31 - 4.6 * reach);
    c.b += path(`M5,-36.5 C8.5,-38.6 ${r2(bx - 3)},${r2(by - 2.6)} ${bx},${r2(by - 1.6)} L${r2(bx + 0.3)},${r2(by + 1.6)} C${r2(bx - 3)},${r2(by + 2.4)} 9,-32 7.4,-30 Z`, brumeDe(D, 5, -40, 16, -30, '#C1CBDD', '#8F9DBB', '#5B6A8B'), TRAIT, 0.8);
    c.b += line(`M5.6,-36.6 C8.6,-38 ${r2(bx - 3)},${r2(by - 2.2)} ${r2(bx - 0.4)},${r2(by - 1.3)}`, LUNE, 0.5, 0.45);
    for (const [dx, len, k] of [[0, 5.4, 0], [0.7, 6.2, 1], [1.4, 5, 2]]) c.b += path(effile([bx + dx * 0.5, by - 0.6 + dx * 0.5], [bx + 1.4 + dx * 0.4, by + 0.8], [bx + 1.8 + dx * 0.3, by + len * 0.5], [bx + 1 + dx * 0.6 - k * 0.2, by + len], 1.15, 0.3), '#B4C0D6', TRAIT, 0.45);
  }
  // la tête basse dans le capuchon : un visage d'argile, l'œil clos sous une paupière lourde, des fêlures
  const hood = 'M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4 C12.4,-49.6 13.8,-45 12.6,-40.6 C11.8,-37.6 9.6,-36 7.6,-35.8 C6.8,-39.4 4,-41.6 0.4,-41.8 C-1.2,-41.8 -2.6,-42.6 -3.4,-44 Z';
  let tete = path(hood, brumeDe(D, -3, -53, 12, -36, '#C4CEE0', '#8E9CBA', '#55648A'), TRAIT, 0.85) + contreJour('M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4', 0.9);
  if (!dos) {
    const visage = 'M7.2,-36.4 C6.4,-39.6 6.8,-43.6 9,-45.6 C11.2,-45.4 12.6,-42.6 12.2,-39.8 C11.8,-37.6 9.8,-36.2 7.2,-36.4 Z';
    tete += path(visage, D.rad([[0, '#A9B4C9'], [0.7, '#7C88A2'], [1, '#56627E']], 10.8, -41.4, 5.6), TRAIT, 0.6)
      + D.clip(visage, ell(9.8, -44.4, 4.6, 2.2, D.rad([[0, '#0F1526', 0.55], [1, '#0F1526', 0]], 9.8, -44.4, 4.6)))
      + line('M9.2,-42.2 C9.9,-41.8 10.8,-41.8 11.6,-42.4', TRAIT, 0.65) + line('M9.5,-41.75 l-0.15,0.55 m0.85,-0.4 l-0.05,0.55 m0.85,-0.55 l0.05,0.5', TRAIT, 0.3, 0.7)
      + line('M7.6,-38 C8.6,-37.6 9.8,-37.6 10.8,-38.2', '#5A6683', 0.35, 0.5)
      + line('M10.6,-45.2 l-0.6,1.4 l0.8,0.8 l-0.4,1', '#EEF3FF', 0.35, 0.8);
  } else tete += line('M2,-52 C4,-49 4.6,-44 4,-40', TRAIT, 0.55, 0.5);
  tete += line('M2,-50.6 l1.2,1.6 l-0.5,1.3 l1,1.1', '#EEF3FF', 0.4, 0.75) + line('M-1,-37 l1,1.4 l-0.6,1.2', '#EEF3FF', 0.35, 0.6);
  // endormi : la tête tombe en avant, le front sur la tablette qu'il tient haut
  c.b += dort ? `<g transform="rotate(16 4 -40) translate(1 2)">${tete}</g>` : tete;
  if (!dos) {
    const signe = dort ? (P.n === 1 ? 0.8 : 0.15) : P.kind === 'luciole' ? 1 : 0;
    const [tx, ty, tr] = dort ? [6.4, -33.4, -24] : [3.4, -27.4, -14];
    c.sv += chaud(D, tx, ty, 14, 0.34) + line('M10.6,-38.4 C11.6,-37.4 12.2,-36.4 12.4,-35', '#FFC27A', 0.55, 0.5);
    c.sv += doTablette(D, tx, ty, tr, signe);
    if (!dort) c.sv += line('M-1.6,-35.4 L8.4,-20.6', BRUN, 1.4) + line('M-1.6,-35.4 L8.4,-20.6', '#D9B26A', 0.75) + line('M-1.2,-35 L1.1,-31.6', '#F6DFA4', 0.35);
    // l'avant-bras qui serre la tablette (les deux bras, endormi), les doigts longs sur son bord
    const bras = dort ? [['M-3.6,-31.6 C0,-27.6 4,-26 9.8,-26.4 L10,-23.6 C4,-23 -1,-25.4 -5,-28.4 Z', 9.8, -26.2]] : [['M-3.6,-30.6 C-0.6,-25.8 3.8,-23.2 8.2,-23.8 L8.6,-21 C3.8,-20.2 -1.4,-22.8 -5,-27.4 Z', 8.2, -23.4]];
    for (const [d, fx, fy] of bras) {
      c.f += path(d, brumeDe(D, -4, -38, 12, -20, '#C1CBDD', '#8F9DBB', '#5B6A8B'), TRAIT, 0.8);
      for (const [dx, dy] of [[0, 0], [0.4, 1.3]]) c.f += path(effile([fx + dx, fy + dy], [fx + 1.4 + dx, fy - 1 + dy], [fx + 2 + dx, fy - 2.2 + dy], [fx + 1.6 + dx, fy - 4 + dy], 1.1, 0.35), '#B4C0D6', TRAIT, 0.45);
    }
  }
  c.b += volutes([[-12.5, -2.4, 1.1], [2, -0.6, 0.9, true], [7.5, -1.8, 0.8]], phase);
  return finir(D, P, c, {
    t: tf(bob, lean, P.kind === 'bouderie' && P.n === 2), aura: [-1, -26, 18, 26], sol: 13, glow: [3.4, -27.4],
    lumiere: k => {
      const y = -30 - (k === 4 ? 18 : 0);
      return halo(D, 1, y, k === 4 ? 13 : 17)
        + `<g transform="translate(1 ${y}) scale(${k === 4 ? 1.2 : 1.6})">` + line('M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6', '#FFF6D0', 0.9) + '</g>'
        + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(1 + dx, y + dy, 0.6, a)).join('') : etincelle(-5, y - 5, 0.8) + etincelle(6, y + 3, 0.6) + `<g opacity="0.35">${doTablette(D, 1, -22, -8)}</g>`);
    },
    // l'argile qui s'effrite en écailles de brume
    voile: n => [[-8, -30], [-3, -42], [5, -34], [9, -24], [-11, -18], [2, -14]].map(([x, y], i) => {
      const dy = y - n * 6 - hash(i, 51) * 3, dx = x * (1 + n * 0.25);
      return path(`M${r2(dx)},${r2(dy)} l1.2,-0.6 l0.6,1 l-1.2,0.7 Z`, '#9FAEC8', TRAIT, 0.3, ` opacity="${r2(0.8 - n * 0.22)}"`);
    }).join('')
  });
}

// ---- 3. Le Noyé de l'Hirondelle : un marin de brume, long et voûté, dans un ciré lourd d'eau, le chapeau de pluie
// rabattu ; sous le bord, des mèches et des algues, deux yeux pâles et creux ; l'eau ruisselle sans fin de ses manches
// et laisse une traînée de sel ; à la taille, la bouée rouge et blanche de l'Hirondelle (« L'HIRONDE… », la fin
// effacée). Il sort de la mer : au repos, il regarde le large ; brume se lit dans les deux sens (il se fond en eau, puis
// en vapeur). Luciole : la bouée devient un anneau de lumière, qui s'élève comme une fusée de détresse lente ----
const NO_CORPS = 'M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12 C-8.6,-11 -6.6,-12.2 -5,-11 L4.6,-11 C6.4,-12.2 8.4,-11 9.8,-12.2 C10.4,-18 10.8,-26 9.8,-32 C9,-38 6.8,-41.8 3.4,-43 Z';
function noBouee(D, cx, cy, rx, ry, lumiere = false) {
  const arc = (a0, a1, rr = 1, sweep = 1) => `M${r2(cx + Math.cos(a0) * rx * rr)},${r2(cy + Math.sin(a0) * ry * rr)} A${r2(rx * rr)},${r2(ry * rr)} 0 0 ${sweep} ${r2(cx + Math.cos(a1) * rx * rr)},${r2(cy + Math.sin(a1) * ry * rr)}`;
  let s = '';
  if (lumiere) {
    s += ell(cx, cy, rx, ry, 'none', ` stroke="#FFD888" stroke-width="5" stroke-opacity="0.35"`) + ell(cx, cy, rx, ry, 'none', ` stroke="#FFF2C6" stroke-width="2.2"`);
    return s;
  }
  for (let i = 0; i < 6; i++) {
    const a0 = (i / 6) * Math.PI, a1 = ((i + 1) / 6) * Math.PI;
    s += line(arc(a0, a1), BRUN, 3.4) + line(arc(a0, a1), i % 2 ? '#F2EDE2' : '#CF3A2E', 2.5);
  }
  s += line(arc(0.15, Math.PI - 0.15, 1.08), '#FFFFFF', 0.5, 0.6) + line(arc(0.08, Math.PI - 0.08, 0.9), '#5A1A12', 0.4, 0.35);
  const id = D.id();
  D.def(`<path id="${id}" d="${arc(Math.PI * 0.83, Math.PI * 0.2, 1, 0)}"/>`);
  s += `<text font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="1.45" letter-spacing="0.15" fill="#22304E" opacity="0.85"><textPath href="#${id}">L’HIRONDE</textPath></text>`;
  return s;
}
function noye(pref, view, pose) {
  const D = Dessin(pref);
  const P = poseOf(pose);
  const dos = view === 'dos';
  const prm = {
    repos: [0, -3, 1, 0, 0], marche1: [-0.6, 3, 0, 0.2, 1], marche2: [0.2, 4, 0, 0.7, 2], bouderie1: [0, -7, 0, 0.3, 0], bouderie2: [0.3, -4, 0, 0.5, 0],
    fuite1: [-0.8, 11, 0, 0.1, 1], fuite2: [0.3, 13, 0, 0.6, 2], luciole1: [0, -1, 0, 0.3, 0], luciole2: [-0.6, -1, 0, 0.4, 0], brume1: [0.8, 0, 0, 0.3, 0], brume2: [2, 0, 0, 0.5, 0], brume3: [3, 0, 0, 0.7, 0]
  }[pose] || [0, -3, 0, 0, 0];
  const [bob, lean, look, phase, step] = prm;
  const c = { b: '', sv: '', f: '' };
  // la traînée de sel derrière lui
  c.b += [[-14, 0.6], [-11.5, 1.1], [-9, 0.4], [-16.6, 1], [-12.8, -0.2], [-18.4, 0.5]].map(([x, yy], i) => ell(x, yy, 0.5 + 0.25 * (i % 2), 0.28, '#EEF2F8', ` opacity="${r2(0.6 - i * 0.07)}"`)).join('');
  // les jambes et les bottes de marin, qui se perdent dans la brume (le pas : step 1 ou 2)
  const jambe = (x, k) => {
    const lift = step && ((step === 1) === (k === 0)) ? 1.6 : 0, fw = step ? (k === 0 ? (step === 1 ? 1.2 : -1) : (step === 1 ? -1 : 1.2)) : 0;
    return path(`M${r2(x - 2.2)},-12 L${r2(x + 2.2)},-12 L${r2(x + 2.4 + fw)},${r2(-3 - lift)} C${r2(x + 3.6 + fw)},${r2(-2.4 - lift)} ${r2(x + 3.8 + fw)},${r2(-0.6 - lift)} ${r2(x + 2.4 + fw)},${r2(-0.4 - lift)} L${r2(x - 2.2 + fw)},${r2(-0.4 - lift)} Z`, D.lin([[0, '#7F90B0'], [1, '#4C5B7C']], 0, -12, 0, 0), TRAIT, 0.75);
  };
  c.b += D.fondu(-6, 0.5, jambe(-4.6, 0) + jambe(3.2, 1));
  // le ciré : ajusté, les épaules tombantes, le col relevé ; il s'arrête aux genoux
  c.b += corps(D, NO_CORPS, brumeDe(D, -10, -43, 10, -10, '#C6D2E5', '#8598BA', '#47587C'), -43, -9,
    ell(dos ? -2 : 7, -24, 9, 16, D.rad([[0, '#0F1628', 0.55], [1, '#0F1628', 0]], dos ? -2 : 7, -24, 11))
    + line('M-7.6,-38 C-8.8,-31 -8.8,-22 -8,-13', LUNE, 1.1, 0.5) + line('M-6.9,-36 C-7.9,-30 -7.9,-24 -7.3,-18', '#FFFFFF', 0.45, 0.65)
    + line('M-2.6,-40 C-3,-32 -3,-22 -2.8,-12', LUNE, 0.55, 0.3)
    + (dos ? line('M0.4,-42 C0.6,-32 0.6,-22 0.4,-12', TRAIT, 0.6, 0.45) : line('M3,-40 C3.5,-32 3.6,-22 3.3,-12', TRAIT, 0.6, 0.45) + line('M3.7,-39 C4.2,-32 4.3,-24 4,-15', LUNE, 0.42, 0.3) + [-35, -29.5, -24].map(v => ell(2.4, v, 0.45, 0.45, '#56668A')).join(''))
    + line('M7,-37 C8,-30 8.4,-22 8.6,-13', TRAIT, 0.5, 0.35));
  c.b += contreJour('M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12');
  c.b += path('M-5.4,-43.6 C-6.2,-46.4 -3.6,-47.8 -0.8,-46.8 L0.8,-43.4 Z', brumeDe(D, -6, -48, 1, -43), TRAIT, 0.7) + path('M6.2,-43.4 C7,-46.2 4.6,-47.6 2,-46.6 L1.4,-43.2 Z', brumeDe(D, 1, -48, 7, -43, '#AEBCD4', '#7D8FB2', '#4C5C80'), TRAIT, 0.7);
  // la manche qui pend et ruisselle sans fin, la main aux doigts longs
  c.b += path('M5.8,-39.6 C9.2,-37 10.8,-31.4 10.6,-25.6 L7.6,-25 C7.8,-30 6.8,-33.6 4.8,-35.6 Z', brumeDe(D, 5, -40, 11, -24, '#C6D2E5', '#8598BA', '#55678C'), TRAIT, 0.8);
  for (const [dx, len] of [[0, 4.4], [0.9, 5], [1.8, 3.8]]) c.b += path(effile([8 + dx * 0.9, -25.2], [8.4 + dx, -23.6], [8.6 + dx * 0.9, -22.6 + len * 0.3], [8.2 + dx * 0.9, -25.2 + len], 1.05, 0.28), '#B6C4DA', TRAIT, 0.42);
  for (const [x, yy, k] of [[9.2, -18.6, 1], [10, -14.6, 0.8], [9, -10.8, 0.65], [9.8, -7, 0.5], [9.2, -3.6, 0.45]]) c.b += path(`M${x},${r2(yy - 1.5 * k)} Q${r2(x + 0.9 * k)},${r2(yy - 0.2 * k)} ${x},${r2(yy + 0.5 * k)} Q${r2(x - 0.9 * k)},${r2(yy - 0.2 * k)} ${x},${r2(yy - 1.5 * k)} Z`, '#D2E4F5', TRAIT, 0.3, ' opacity="0.75"');
  // la bouée à la taille et son reflet chaud
  c.sv += chaud(D, 0.6, -20.6, 12, 0.3) + (dos ? noBouee(D, -0.2, -20.6, 9.4, 3.2).replace(/<text[\s\S]*<\/text>/, '') : noBouee(D, -0.2, -20.6, 9.4, 3.2));
  // la tête : un visage maigre dans l'ombre du chapeau ; au repos, il regarde le large (la tête tournée)
  const tx = r2(1 - 2.4 * look);
  let t = '';
  if (!dos) {
    t += path('M-3.2,-47.6 C-3.6,-43.6 -2.4,-40.4 0.8,-39.4 C3.8,-40.2 5,-43.6 4.6,-47.6 Z', D.lin([[0, '#1B2236'], [0.45, '#6E7C9A'], [1, '#A3B0C8']], 0, -48, 0, -39.4), TRAIT, 0.65);
    if (look < 0.5) t += ell(-0.9, -44.2, 1.5, 1.1, D.rad([[0, '#05080F', 0.85], [1, '#05080F', 0]], -0.9, -44.2, 1.5)) + ell(2.5, -44, 1.4, 1.05, D.rad([[0, '#05080F', 0.85], [1, '#05080F', 0]], 2.5, -44, 1.4)) + lueur(D, -0.8, -44.1, 0.22, '#C8DBF5') + lueur(D, 2.5, -43.9, 0.2, '#C8DBF5');
    else t += ell(-2.4, -44.2, 1.2, 0.9, D.rad([[0, '#05080F', 0.8], [1, '#05080F', 0]], -2.4, -44.2, 1.2)) + lueur(D, -2.5, -44.1, 0.28, '#DCEBFF');
  }
  for (const [x, len, sw, cc] of [[-3.8, 8, -0.8, '#2E4450'], [-2.2, 6, 0.6, '#3C5660'], [4.4, 7, 0.9, '#2E4450'], [5.4, 9, 0.4, '#4B6B5E']]) t += path(effile([x, -47.6], [x + sw, -45], [x - sw, -43], [x + sw * 0.6, -47.6 + len], 1.1, 0.25), cc, 'none', 0, ' opacity="0.9"');
  t += path('M-8.4,-46.6 C-5,-50 6.4,-50.4 10.4,-46 C9,-44.6 6.8,-45.4 5.2,-46.8 L-3.8,-47 C-5.6,-45.6 -7.4,-45.4 -8.4,-46.6 Z', D.lin([[0, '#B6C3DA'], [1, '#62759A']], 0, -50, 0, -45), TRAIT, 0.8);
  t += path('M-4.2,-47.2 C-4.2,-53 4.8,-53.8 5.2,-47 Z', D.lin([[0, '#CAD5E8'], [1, '#7F92B4']], 0, -53.6, 0, -47), TRAIT, 0.8);
  t += line('M-3.4,-50 C-2,-52.6 2,-53 3.8,-51.4', LUNE, 0.65, 0.75) + line('M-7.6,-46.8 C-3,-49.4 5,-49.6 9.4,-46.4', LUNE, 0.45, 0.55);
  t += path('M9.8,-46 Q10.4,-44.8 9.9,-44.2 Q9.3,-44.8 9.8,-46 Z', '#D2E4F5', 'none', 0, ' opacity="0.8"');
  c.f += `<g transform="translate(${tx} 0)">${t}</g>`;
  c.b += volutes([[-10.5, -2.4, 1.1], [3, -0.6, 0.9, true], [8, -2, 0.8]], phase);
  return finir(D, P, c, {
    t: tf(bob, lean, P.kind === 'bouderie' && P.n === 2), aura: [0, -26, 17, 28], sol: 11, glow: [-0.2, -20.6],
    lumiere: k => {
      const y = -24 - (k === 4 ? 22 : 0), s = k === 4 ? 0.7 : 1;
      return halo(D, 0, y, k === 4 ? 13 : 18) + noBouee(D, 0, y, 9 * s, 3.2 * s, true)
        + (k === 4 ? [[0, 5, 0.9], [0.6, 9, 0.7], [-0.4, 13, 0.5], [0.3, 17, 0.35]].map(([dx, dy, a]) => etincelle(dx, y + dy, 0.55, a)).join('') : etincelle(-9, y - 4, 0.8) + etincelle(9, y + 2, 0.6));
    },
    // il se fond en eau (une flaque qui s'étale), puis en vapeur
    voile: n => {
      let s = ell(0, 0.2, 6 + n * 4, 1.4 + n * 0.6, D.rad([[0, '#BFD6EE', 0.55], [1, '#BFD6EE', 0]], 0, 0.2, 6 + n * 4));
      s += [[-6, -4], [5, -6], [-2, -9], [3, -2]].map(([x, y], i) => path(`M${x},${r2(y - n * 2 - 1.5)} Q${x + 0.8},${r2(y - n * 2)} ${x},${r2(y - n * 2 + 0.6)} Q${x - 0.8},${r2(y - n * 2)} ${x},${r2(y - n * 2 - 1.5)} Z`, '#D2E4F5', TRAIT, 0.3, ` opacity="${r2(n < 3 ? 0.8 : 0.3)}"`)).join('');
      return s;
    }
  });
}

// ---- 4. La Racine errante : un nœud de racines qui marche sur ses radicelles, en araignée lente ; au-dessus, le vide
// de son tronc ; écorce bleu-gris, mousse argentée, champignons pâles qui luisent ; deux reflets au fond d'un creux ;
// sur elle, un seul bourgeon vivant, vert tendre, et une baie rouge. Elle passe sous les clôtures (terre1 à terre3 : elle
// s'enfonce en soulevant la terre jusqu'à ce qu'il ne reste que le bourgeon). Luciole : le bourgeon éclot en une fleur
// de lumière ----
const RA_NOEUD = 'M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25 C2.2,-28.4 6.6,-27.4 7.4,-23.8 C11,-23.6 12.8,-19.6 11,-16.4 C12.4,-12.6 8.4,-10 4.2,-11.4 C2,-9.2 -3.6,-9.4 -5.4,-11.4 C-9.2,-10.6 -13.2,-12.4 -11.6,-15.4 Z';
function raBourgeon(D) {
  return chaud(D, 0.5, -28, 12, 0.4)
    + `<g transform="translate(0 2)">` + path(effile([0, -27.6], [0.3, -29.6], [0.7, -31], [0.4, -32.8], 1.3, 0.8), '#6FA24A', BRUN, 0.4)
    + path('M0.4,-32.4 C-1.6,-33.6 -1.4,-36.6 0.6,-37.4 C2.4,-36.4 2.4,-33.6 0.4,-32.4 Z', D.lin([[0, '#C2F290'], [1, '#5FA43C']], -1, -37, 2, -33), BRUN, 0.55)
    + line('M0.5,-33 C0.3,-34.4 0.5,-35.8 0.7,-36.8', '#E4FFC8', 0.3, 0.7)
    + path('M0.6,-32.6 C2.6,-33 4.4,-31.8 4.6,-30.6 C3,-30.2 1.6,-31 0.6,-32.6 Z', D.lin([[0, '#A6E07F'], [1, '#4E8C32']], 1, -33, 4.6, -30.6), BRUN, 0.45)
    + ell(-1.9, -29.7, 1.45, 1.45, D.rad([[0, '#FF8576'], [0.6, '#D8312A'], [1, '#961C18']], -2.3, -30.1, 1.7), ` stroke="${BRUN}" stroke-width="0.45"`) + ell(-2.3, -30.2, 0.42, 0.3, '#FFFFFF', ' opacity="0.85"')
    + line('M-1.6,-28.3 L-0.3,-27.9', BRUN, 0.4) + '</g>';
}
function racine(pref, view, pose) {
  const D = Dessin(pref);
  const P = poseOf(pose);
  const dos = view === 'dos';
  const terre = P.kind === 'terre' ? P.n : 0;
  const prm = {
    repos: [0, 0, 0, 0], marche1: [-0.5, 1, 1, 0.2], marche2: [0, 2, -1, 0.7], bouderie1: [0, 0, -4, 0.3], bouderie2: [0.2, 0, -2, 0.5],
    fuite1: [-0.6, 1, 6, 0.1], fuite2: [0, 2, 7, 0.6], luciole1: [0, 0, 0, 0.3], luciole2: [-0.4, 0, 0, 0.4], brume1: [0.6, 0, 0, 0.3], brume2: [1.2, 0, 0, 0.5], brume3: [1.8, 0, 0, 0.7]
  }[pose] || [0, 0, 0, 0];
  const [bob, step, lean, phase] = prm;
  const c = { b: '', sv: '', f: '' };
  // le vide, là où devrait être son tronc
  c.b += D.fondu(-55, -20, path('M-5.5,-21 C-6.2,-34 -5.2,-46 -3.6,-56 L4,-56 C5.4,-46 6.4,-34 5.6,-21 Z', D.lin([[0, '#AFC0DA', 0], [0.5, '#AFC0DA', 0.12], [1, '#AFC0DA', 0.22]], 0, -56, 0, -21)));
  c.b += line('M-5.5,-23 C-6.2,-34 -5.2,-46 -3.6,-55', LUNE, 0.45, 0.2) + line('M5.6,-23 C6.4,-34 5.4,-46 4,-55', LUNE, 0.45, 0.12);
  // les radicelles : noueuses, effilées, asymétriques ; genoux hauts, en araignée lente (step : les pattes qui se lèvent)
  const pattes = [[-17, -1.4, -8, -16, 0], [16, -0.6, 8, -15.6, 1], [-11.5, 0.6, -5.4, -13.6, 1], [11, 1, 5.2, -13.2, 0], [-5, 1.6, -2.4, -12, 0], [4.6, 1.8, 2.6, -11.8, 1]];
  pattes.forEach(([x, yy, ax, ay, ph], i) => {
    const up = step && (i + ph + (step > 1 ? 1 : 0)) % 2 === 0 ? 2.4 : 0, fw = up ? 1.6 * Math.sign(x) * 0.4 + 1.2 : 0;
    const bx = x + fw, by = yy - up, dir = x > 0 ? 1 : -1;
    c.b += path(effile([ax, ay], [ax + dir * 5.5, ay - 9 + hash(i, 1) * 2], [bx - dir * (1 + hash(i, 2) * 1.5), by - 13], [bx, by], i < 2 ? 3.2 : 3.7, 0.3), i < 2 ? '#6E7FA0' : '#8796B4', TRAIT, 0.7);
    const kx = ax + (bx - ax) * 0.55, ky = ay - 7.4 + hash(i, 3);
    c.b += ell(kx, ky, 1.1, 0.8, i < 2 ? '#7486A6' : '#93A2BF', ` stroke="${TRAIT}" stroke-width="0.4"`);
    c.b += line(`M${r2(ax)},${r2(ay - 0.8)} C${r2(ax + dir * 4)},${r2(ay - 8.6)} ${r2(kx - dir * 1)},${r2(ky - 1.4)} ${r2(kx + dir * 0.6)},${r2(ky - 0.9)}`, LUNE, 0.4, i % 2 ? 0.25 : 0.45);
  });
  c.b += path(RA_NOEUD, D.lin([[0, '#B8C5DA'], [0.45, '#8494B2'], [1, '#4C5B7C']], -10, -28, 9, -10), TRAIT, 0.85);
  c.b += D.clip(RA_NOEUD, [[-9, -24, -7, -12], [-4.4, -27.4, -2.6, -11], [1.6, -27.6, 2.6, -11.6], [6.2, -25, 7.4, -13]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r2(x0 + 1.8)},${r2((y0 + y1) / 2)} ${r2(x1 - 1.6)},${r2((y0 + y1) / 2 + 2)} ${x1},${y1}`, TRAIT, 0.55, 0.5) + line(`M${r2(x0 - 0.6)},${y0} C${r2(x0 + 1.2)},${r2((y0 + y1) / 2)} ${r2(x1 - 2.2)},${r2((y0 + y1) / 2 + 2)} ${r2(x1 - 0.6)},${y1}`, LUNE, 0.35, 0.3)).join('')
    + ell(dos ? -4 : 6, -13, 8, 7, D.rad([[0, '#0E1426', 0.55], [1, '#0E1426', 0]], dos ? -4 : 6, -13, 8)));
  c.b += contreJour('M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25');
  for (let i = 0; i < 11; i++) c.b += ell(-7.6 + i * 1.35 + hash(i, 1) * 0.6, -23.6 - Math.sin(i / 10 * Math.PI) * 2 + hash(i, 2) * 0.7, 0.8 + hash(i, 4) * 0.3, 0.55, i % 3 ? '#D2DCEA' : '#E8EEF7', ' opacity="0.9"');
  if (!dos) {
    c.b += path('M-1.8,-17 C-2,-19.6 2,-20.6 3.6,-18.6 C4.4,-16.6 2.4,-15 0.6,-15.2 C-0.8,-15.4 -1.8,-16 -1.8,-17 Z', D.rad([[0, '#05080F'], [1, '#1E2740']], 0.8, -17.6, 3.4), TRAIT, 0.6);
    if (!(P.kind === 'bouderie' && P.n === 2)) c.b += lueur(D, 0, -17.6, 0.36, '#D8E6FF') + lueur(D, 2, -17.4, 0.34, '#D8E6FF');
  }
  for (const [x, yy, k] of [[-10.4, -14.4, 1], [-11.6, -12, 0.7], [9.2, -11.8, 0.85]]) {
    c.b += ell(x, yy, 3.6 * k, 3.2 * k, D.rad([[0, '#BFF3FF', 0.42], [1, '#BFF3FF', 0]], x, yy, 3.6 * k));
    c.b += line(`M${x},${yy} l0,${r2(1.6 * k)}`, '#DDE6F2', 0.65 * k) + path(`M${r2(x - 1.6 * k)},${r2(yy + 0.2)} Q${x},${r2(yy - 1.9 * k)} ${r2(x + 1.6 * k)},${r2(yy + 0.2)} Z`, '#EAF6FB', TRAIT, 0.4) + ell(x - 0.4 * k, yy - 0.7 * k, 0.5 * k, 0.25 * k, '#FFFFFF', ' opacity="0.8"');
  }
  c.sv += raBourgeon(D);
  c.b += volutes([[-15.5, -1.2, 0.8], [14.5, -0.4, 0.8, true], [-3, 1.8, 0.7], [6, 1.4, 0.6, true]], phase);
  const fleur = (k, y) => {
    let s = halo(D, 0.5, y, k === 4 ? 12 : 16);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      s += `<g transform="translate(0.5 ${r2(y)}) rotate(${r2((a * 180) / Math.PI + 90)})">` + path('M0,0 C-1.6,-1.6 -1.4,-4.2 0,-4.8 C1.4,-4.2 1.6,-1.6 0,0 Z', '#FFF3CC', '#F2B860', 0.35, ' opacity="0.95"') + '</g>';
    }
    return s + ell(0.5, y, 1.1, 1.1, '#FFD27A');
  };
  if (terre) {
    // elle s'enfonce : le corps glisse sous le sol, la terre se soulève devant elle ; il ne reste que le bourgeon
    const down = [0, 8, 18, 30][terre];
    const motte = `M-15,1 C-11,${r2(-2 - terre)} -6,${r2(-3.4 - terre * 1.2)} 0,${r2(-3.6 - terre * 1.2)} C6,${r2(-3.4 - terre * 1.2)} 11,${r2(-2 - terre)} 15,1 Z`;
    let s = sol(D, 14) + aura(D, 0, -16 + down * 0.6, 16, 14, 1 - terre * 0.25);
    const vu = D.clip('M-30,-80 L30,-80 L30,0.6 L-30,0.6 Z', `<g transform="translate(0 ${down})">${c.b}${c.sv}</g>`);
    s += vu;
    if (terre === 3) s += `<g transform="translate(0 21)">${raBourgeon(D)}</g>`;
    s += path(motte, D.lin([[0, '#6E6A6E'], [1, '#3E3B42']], 0, -6, 0, 1), TRAIT, 0.7);
    s += [[-10, -1.6], [-5, -3], [2, -3.6], [7, -2.6], [12, -1]].map(([x, y], i) => ell(x, y - terre * 0.6, 1 + hash(i, 61) * 0.6, 0.7, '#5A5660', ` stroke="${TRAIT}" stroke-width="0.35"`)).join('');
    s += [[-8, -6], [6, -7], [-2, -9]].map(([x, y], i) => ell(x + (hash(i, 63) - 0.5) * 3, y - terre * 1.5, 0.7, 0.5, '#6A6670', ` opacity="${r2(0.9 - terre * 0.2)}"`)).join('');
    s += line(`M-14,0 C-10,${r2(-2.2 - terre)} -5,${r2(-3.4 - terre * 1.2)} 0,${r2(-3.6 - terre * 1.2)}`, LUNE, 0.45, 0.35);
    return D.out(s);
  }
  return finir(D, P, c, {
    t: tf(bob, lean, P.kind === 'bouderie' && P.n === 2), aura: [0, -18, 19, 20], sol: 15, glow: [0, -29], motes: [[-14, -22, 0.6], [13, -26, 0.5], [-4, -40, 0.55]],
    lumiere: k => {
      const y = -24 - (k === 4 ? 20 : 0);
      return (k === 3 ? `<g opacity="0.3">${raBourgeon(D)}</g>` : '') + fleur(k, y) + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.5 + dx, y + dy, 0.55, a)).join('') : etincelle(-6, y - 4, 0.8) + etincelle(7, y + 2, 0.6));
    },
    // la mousse qui tombe en flocons de brume
    voile: n => [[-8, -24], [-3, -27], [3, -27], [8, -24], [-12, -14], [11, -12]].map(([x, y], i) => ell(x * (1 + n * 0.2), y - n * 5 - hash(i, 71) * 3, 0.8, 0.55, '#D2DCEA', ` opacity="${r2(0.85 - n * 0.22)}"`)).join('')
  });
}

// ---- 5. L'Esprit sylvestre revenant : haut et solennel, un corps de feuilles mortes bleuies par la brume, en traîne ;
// un masque d'écorce pâle, sans bouche, percé de deux yeux à la lueur vert pâle ; des bois de cerf en brindilles, une
// fleur fanée accrochée ; au creux de sa poitrine, une graine d'ambre qui bat lentement comme un cœur. Repoussé, il
// s'incline, puis détourne son masque ; il s'efface et revient (brume se lit dans les deux sens : il s'effeuille, puis se
// recompose). Luciole : le masque se détache, et la graine d'ambre s'élève ----
const ES_CORPS = 'M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3 C-7,-1.2 -4,-2.8 -1,-0.8 C2,-2.8 5,-1 8,-3 C9.6,-13 10.8,-26 10.2,-38 C9.8,-48 7.6,-56 2.6,-58 Z';
const feuille = (k, fill, extra = '') => path(`M0,${r2(-k * 1.45)} C${r2(k * 1.05)},${r2(-k * 0.5)} ${r2(k * 0.85)},${r2(k * 0.9)} 0,${r2(k * 1.5)} C${r2(-k * 0.85)},${r2(k * 0.9)} ${r2(-k * 1.05)},${r2(-k * 0.5)} 0,${r2(-k * 1.45)} Z`, fill, TRAIT, 0.4, extra)
  + line(`M0,${r2(-k * 1.25)} L0,${r2(k * 1.3)}`, TRAIT, 0.3, 0.55) + line(`M0,${r2(-k * 0.2)} l${r2(k * 0.5)},${r2(-k * 0.4)} M0,${r2(k * 0.5)} l${r2(-k * 0.5)},${r2(-k * 0.4)}`, TRAIT, 0.25, 0.45);
const ES_FEUILLES = (() => {
  const out = [];
  for (let i = 0; out.length < 34 && i < 400; i++) {
    const fx = -10 + hash(i, 3) * 20, fy = -56 + hash(i, 5) * 54;
    if (Math.abs(fx) > 9.6 - (fy < -48 ? 3 : 0)) continue;
    if (out.some(([x, yy]) => Math.hypot(x - fx, yy - fy) < 3.6)) continue;
    out.push([fx, fy, -50 + hash(i, 7) * 100, 2.1 + hash(i, 9) * 1.3]);
  }
  return out.sort((a, b) => a[1] - b[1]);
})();
const esMasque = (D, a = 1) => {
  const m = 'M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z';
  return path(m, D.lin([[0, '#E6EAF0'], [0.55, '#C3CAD7'], [1, '#949DB1']], -4, -66, 5, -51), TRAIT, 0.85, a < 1 ? ` opacity="${r2(a)}"` : '')
    + D.clip(m, [[-3, -63, -2.4, -54], [2.6, -64, 3.2, -53.5], [-0.2, -65.4, 0.4, -61], [0.6, -55, 0.2, -51.4]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r2(x0 + 0.8)},${r2((y0 + y1) / 2)} ${r2(x1 - 0.6)},${r2((y0 + y1) / 2 + 1)} ${x1},${y1}`, '#7E879B', 0.4, 0.6)).join('') + ell(4.6, -57, 4, 8, D.rad([[0, '#2A3247', 0.35], [1, '#2A3247', 0]], 4.6, -57, 6)))
    + line('M-5,-63.6 C-5.4,-58 -4,-53 0.2,-50.6', LUNE, 0.6, 0.6 * a);
};
function esGraine(D, pouls, y = -38) {
  return chaud(D, 0.3, y, 10 + 6 * pouls, 0.26 + 0.2 * pouls)
    + ell(0.3, y, 2 + 0.3 * pouls, 2.5 + 0.3 * pouls, D.rad([[0, '#FFE9AE'], [0.45, '#F4A33C'], [1, '#A85A16']], -0.2, y - 0.8, 2.9), ` stroke="${BRUN}" stroke-width="0.5"`)
    + ell(-0.4, y - 1, 0.55, 0.8, '#FFF6D8', ' opacity="0.85"');
}
function esprit(pref, view, pose) {
  const D = Dessin(pref);
  const P = poseOf(pose);
  const dos = view === 'dos';
  const prm = {
    repos: [0, 0, 0, 0.6, 0], marche1: [-0.7, 2, 0, 0.3, 0.2], marche2: [0.2, 3, 0, 0.9, 0.7], bouderie1: [0, -3, 1, 0.4, 0.3], bouderie2: [0.2, -4, 0.6, 0.3, 0.5],
    fuite1: [-1, 9, 0, 0.9, 0.1], fuite2: [0.3, 11, 0, 1, 0.6], luciole1: [0, 0, 0.3, 1, 0.3], luciole2: [-0.6, 0, 0.3, 1, 0.4], brume1: [0, 0, 0, 0.5, 0.3], brume2: [0, 0, 0, 0.4, 0.5], brume3: [0, 0, 0, 0.3, 0.7]
  }[pose] || [0, 0, 0, 0.6, 0];
  const [bob, lean, bow, pouls, phase] = prm;
  const c = { b: '', sv: '', f: '' };
  // la traîne de feuilles, derrière, qui s'efface en s'éparpillant (elle ondoie en marchant)
  const sway = P.kind === 'marche' || P.kind === 'fuite' ? (P.n === 1 ? 1.4 : -1) : 0;
  c.b += D.fondu(-14, 0, path(`M-5,-24 C-11,-16 ${r2(-17 + sway)},-8 ${r2(-24 + sway * 1.6)},-2.4 C-17,-0.8 -10,-1.2 -4,-2.2 Z`, D.lin([[0, '#7D8EAF', 0.75], [1, '#7D8EAF', 0.05]], -4, 0, -24, 0), 'none'));
  for (let i = 0; i < 9; i++) {
    const x = -8 - i * 1.9 - hash(i, 11) * 1.5 + sway * (i / 9), yy = -2.2 - hash(i, 13) * 3 - Math.max(0, 6 - i) * 0.6, k = 1.6 + hash(i, 15) * 0.8;
    c.b += `<g transform="translate(${r2(x)} ${r2(yy)}) rotate(${r2(hash(i, 17) * 180)})" opacity="${r2(0.75 - i * 0.07)}">` + feuille(k, ['#8C9DBE', '#7486A8', '#A3B2CC'][i % 3]) + '</g>';
  }
  c.b += corps(D, ES_CORPS, brumeDe(D, -10, -58, 10, -10, '#BBC8DE', '#8394B5', '#48587C'), -58, 0,
    ES_FEUILLES.map(([fx, fy, a, k], i) => `<g transform="translate(${r2(fx)} ${r2(fy)}) rotate(${r2(a + (dos ? 30 : 0))})">` + feuille(k, ['#A1B0CC', '#8B9CBD', '#B4C1D8', '#7A8BAD', '#95A5C4'][i % 5])
      + line(`M${r2(-k * 0.6)},${r2(-k * 0.6)} C${r2(-k * 0.3)},${r2(-k * 1.1)} 0,${r2(-k * 1.3)} 0,${r2(-k * 1.3)}`, LUNE, 0.3, 0.45) + '</g>').join('')
    + ell(dos ? -2 : 7, -24, 9, 26, D.rad([[0, '#0E1528', 0.55], [1, '#0E1528', 0]], dos ? -2 : 7, -24, 12)));
  c.b += contreJour('M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3');
  for (const [x0, y0, flip] of [[-8.6, -47, -1], [8.4, -47, 1]]) {
    const x1 = x0 + flip * 3.4 + (P.kind === 'fuite' ? -flip * 2 : 0), y1 = y0 + 19;
    c.b += path(effile([x0, y0], [x0 + flip * 2.8, y0 + 6], [x1 - flip * 0.4, y1 - 7], [x1, y1], 1.9, 0.9), '#7B8BAA', TRAIT, 0.55);
    for (const [dx, dy] of [[-1.2, 4.6], [0.3, 5.6], [1.6, 4.2]]) c.b += path(effile([x1, y1], [x1 + flip * dx * 0.3, y1 + dy * 0.4], [x1 + flip * dx * 0.8, y1 + dy * 0.7], [x1 + flip * dx, y1 + dy], 0.8, 0.15), '#7B8BAA', TRAIT, 0.35);
  }
  // la graine d'ambre (au travers des feuilles, de dos)
  if (dos) c.sv += chaud(D, 0.3, -38, 8 + 4 * pouls, 0.16 + 0.12 * pouls);
  else c.sv += ell(0.3, -38, 3.6, 3.4, D.rad([[0, '#120A06', 0.8], [1, '#26304A', 0.15]], 0.3, -38, 3.6)) + esGraine(D, pouls);
  // la tête : les bois en brindilles, la fleur fanée, le masque (bow : il s'incline ; bouderie2 : il détourne le masque)
  let t = '';
  const bois = k => {
    const tige = effile([1 + 2.4 * k, -63], [1 + 5 * k, -68], [1 + 6.4 * k, -73], [1 + 10.4 * k, -77.4], 1.6, 0.35);
    const branches = [effile([1 + 5 * k, -68.4], [1 + 6.6 * k, -69.4], [1 + 8.6 * k, -71], [1 + 10 * k, -73.4], 1, 0.25), effile([1 + 7 * k, -73.6], [1 + 6.8 * k, -75.4], [1 + 7.2 * k, -77], [1 + 7.6 * k, -79], 0.9, 0.2), effile([1 + 3.6 * k, -66], [1 + 2.8 * k, -68], [1 + 2.8 * k, -70], [1 + 3 * k, -71.4], 0.9, 0.2)];
    return [tige, ...branches].map(d => path(d, '#8696B3', TRAIT, 0.45)).join('') + line(`M${r2(1 + 2.4 * k)},-63.4 C${r2(1 + 5 * k)},-68.4 ${r2(1 + 6.4 * k)},-73.4 ${r2(1 + 10 * k)},-77.2`, LUNE, 0.35, k < 0 ? 0.6 : 0.3);
  };
  t += bois(-1) + bois(1);
  t += line('M7.4,-72.6 q0.5,2 -0.1,3.6', '#5C6680', 0.4);
  t += [[-0.8, 0, 0.9], [0.8, 0.2, 0.85], [0, 1, 0.95], [-0.3, -0.8, 0.8], [0.9, 0.9, 0.7]].map(([dx, dy, k]) => ell(7.2 + dx, -68.6 + dy, 0.95 * k, 0.6 * k, '#AE9FB6', ` stroke="${TRAIT}" stroke-width="0.25" opacity="0.85"`)).join('') + ell(7.2, -68.5, 0.45, 0.45, '#8C7F6C');
  const detourne = P.kind === 'bouderie' && P.n === 2;
  if (dos || detourne) {
    // l'arrière de la tête : des feuilles, pas de masque
    t += path('M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z', brumeDe(D, -5, -66, 6, -50, '#AEBBD3', '#7F90B1', '#4E5E82'), TRAIT, 0.8)
      + [[-2, -61, 30], [2.4, -59, -40], [0, -55, 10]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) rotate(${a})">` + feuille(2, ['#94A4C2', '#8798B9', '#A5B3CD'][i]) + '</g>').join('');
    if (detourne) t += `<g transform="translate(9 -2) rotate(28 0 -57)">${esMasque(D, 0.85)}</g>`;
  } else {
    t += esMasque(D);
    t += path('M-3,-60.4 C-2.6,-61.6 -0.8,-61.6 -0.6,-60 C-0.8,-58.4 -2.6,-58.4 -3,-60.4 Z', '#0C111E') + path('M1.9,-60.2 C2.3,-61.4 4,-61.4 4.2,-59.8 C4,-58.2 2.3,-58.2 1.9,-60.2 Z', '#0C111E');
    t += lueur(D, -1.8, -59.7, 0.5, '#CFF7DA') + lueur(D, 3.05, -59.5, 0.48, '#CFF7DA');
    t += ell(0.4, -52.6, 6, 4, D.rad([[0, '#FFC27A', 0.22 + 0.16 * pouls], [1, '#FFC27A', 0]], 0.4, -51, 6));
  }
  c.f += `<g transform="rotate(${r2(bow * 14)} 0 -52)">${t}</g>`;
  c.b += volutes([[-8.5, -2, 1.1], [2, -0.4, 0.9, true], [7, -2, 0.9]], phase);
  return finir(D, P, c, {
    t: tf(bob, lean), aura: [-2, -36, 18, 40], sol: 14, glow: [0.3, -38], motes: [[-15, -40, 0.7], [13, -50, 0.55], [-6, -72, 0.5]],
    lumiere: k => {
      const y = -38 - (k === 4 ? 22 : 0);
      return (k === 3 ? `<g transform="translate(-8 14) rotate(-24 0 -57)">${esMasque(D, 0.55)}</g>` : '') + halo(D, 0.3, y, k === 4 ? 13 : 18) + esGraine(D, 1, y)
        + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.3 + dx, y + dy, 0.55, a)).join('') : etincelle(-6, y - 5, 0.8) + etincelle(7, y + 3, 0.6));
    },
    // il s'effeuille : les feuilles s'envolent et se dispersent
    voile: n => ES_FEUILLES.filter((_, i) => i % 3 === 0).map(([fx, fy, a, k], i) => {
      const dx = fx * (1 + n * 0.5) + (hash(i, 81) - 0.5) * n * 6, dy = fy - n * 4 - hash(i, 83) * n * 3;
      return `<g transform="translate(${r2(dx)} ${r2(dy)}) rotate(${r2(a + n * 60)})" opacity="${r2(0.85 - n * 0.2)}">` + feuille(k * 0.9, ['#A1B0CC', '#8B9CBD', '#B4C1D8'][i % 3]) + '</g>';
    }).join('')
  });
}

// Les cinq, leurs dossiers et leurs poses en plus (vue avant)
const EGARES_VOILE = [
  ['fantome', 'Le Sans-Nom', sansNom, []],
  ['zombie', 'Le Dormeur', dormeur, ['dort1', 'dort2']],
  ['noye-de-l-hirondelle', "Le Noyé de l'Hirondelle", noye, [], 'noye'],
  ['racine-errante', 'La Racine errante', racine, ['terre1', 'terre2', 'terre3'], 'racine'],
  ['esprit-sylvestre', "L'Esprit sylvestre revenant", esprit, [], 'esprit']
];

module.exports = { POSES, EGARES_VOILE, sansNom, dormeur, noye, racine, esprit, effile, TRAIT, BRUN, LUNE };
