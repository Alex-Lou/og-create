// Les bêtes de brume (HISTOIRE.md § 6.15), au niveau des égarés du Voile (egares_voile.js) : une bête du climat d'où
// vient la nuit, que le Voile a effacée. Mystérieuses, jamais mignonnes : une silhouette élancée qu'on reconnaît en
// ombre chinoise, une petite tête, deux lueurs pâles pour les yeux. Le corps est en brume (bleus-gris translucides, trait
// bleu nuit #3B4763, les pattes qui se perdent en volutes), un contre-jour de lune bleu-argent sur le dos. Une seule tache
// de pelage garde sa couleur d'avant, nette et saturée, au trait brun #3C2819 : c'est elle qui s'allume et s'envole en
// luciole.
// Vues des bêtes orientées : « avant » (elle vient vers le bas à droite), « dos » (elle s'éloigne vers le haut à
// droite) ; le miroir donne les deux autres directions. On voit son flanc droit, la lune derrière elle, en haut à gauche.
// Ancre (0, 0) au sol, sous la bête.
const V = require('./egares_voile');
const { Dessin, path, line, ell, hash, effile, sol, volutes, lueur, chaud, brumeDe, contreJour, poseOf, finir, tf, halo, etincelle, TRAIT, BRUN } = V;
const r2 = n => Math.round(n * 100) / 100;

// ---- petits morceaux ----
// Un point tourné de a degrés autour de (cx, cy)
const tourne = ([x, y], cx, cy, a) => {
  const k = (a * Math.PI) / 180, c = Math.cos(k), s = Math.sin(k);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
// La brume d'une patte du côté loin : plus sombre, plus effacée
const LOIN = '#617398';
// Une tache de pelage irrégulière (huit bosses douces), sa couleur d'avant en dégradé, quelques poils plus clairs ; en
// lumière (lum), elle devient une flamme pâle
const LUMIERE = ['#FFFBEA', '#FFE7A8', '#FFC46E'];
function tache(D, cx, cy, rx, ry, seed, cols, rot = 0, lum = false) {
  const c = lum ? LUMIERE : cols, n = 8, pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, k = 1 + 0.16 * Math.sin(seed * 3.1 + i * 2.3) + 0.07 * Math.cos(seed + i * 4.1);
    pts.push(tourne([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k], cx, cy, rot));
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).map(r2).join(',')}`;
  for (let i = 0; i < n; i++) d += ` Q${pts[i].map(r2).join(',')} ${mid(pts[i], pts[(i + 1) % n]).map(r2).join(',')}`;
  const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], cx - rx, cy - ry, cx + rx * 0.6, cy + ry);
  let poils = '';
  for (let i = 0; i < 4; i++) {
    const x = cx + (hash(seed, i) - 0.5) * rx * 1.1, y = cy + (hash(seed, i + 9) - 0.6) * ry * 0.9;
    poils += line(`M${r2(x)},${r2(y)} q${r2(rx * 0.25)},${r2(-ry * 0.12)} ${r2(rx * 0.45)},${r2(ry * 0.05)}`, lum ? '#FFFFFF' : c[0], 0.35, 0.7);
  }
  return path(d, fill, lum ? '#E8B860' : BRUN, 0.5) + poils;
}
// Une patte effilée de la hanche (ou de l'épaule) au sol ; arr : patte arrière (le jarret plie vers l'arrière)
function patte(D, [x, y], sw, w0, w1, arr, fill, pied = 0) {
  const fx = x + sw, h = -y;
  const c1 = arr ? [x + 1.8 + sw * 0.15, y + h * 0.35] : [x + sw * 0.3, y + h * 0.5];
  const c2 = arr ? [fx - 2.2, -h * 0.42] : [fx - 0.6, -h * 0.22];
  return path(effile([x, y], c1, c2, [fx, 0], w0, w1), fill, TRAIT, 0.6) + (pied ? path(effile([fx - 0.4, -0.3], [fx + pied * 0.3, -0.5], [fx + pied * 0.7, -0.4], [fx + pied, -0.15], w1 * 1.2, w1 * 0.6), fill, TRAIT, 0.5) : '');
}
// Une patte écartée (caméléon, salamandre) : le coude dehors, la main posée
function patteBasse(D, [x, y], sw, dir, w, fill) {
  const ex = x + dir * 1.6 + sw * 0.5, fx = x + sw;
  return path(effile([x, y], [ex, y - 1.2], [ex + dir * 0.4, -0.8], [fx + dir * 0.6, 0], w, w * 0.55), fill, TRAIT, 0.55) + line(`M${r2(fx - 0.6 + dir * 0.6)},-0.1 l${r2(dir * 1.2)},-0.25 M${r2(fx + dir * 0.6)},-0.1 l${r2(dir * 1)},0.2`, TRAIT, 0.45, 0.8);
}
// Les yeux : deux lueurs pâles (l'œil loin plus petit), ou clos (un trait pâle), ou rien (vue de dos)
function yeux(D, mode, pres, loin) {
  if (mode === 'aucun') return '';
  if (mode === 'clos') return [pres, loin].filter(Boolean).map(([x, y, r], i) => line(`M${r2(x - r * 1.1)},${r2(y)} q${r2(r * 1.1)},${r2(r * 0.7)} ${r2(r * 2.2)},0`, '#C9D6EE', i ? 0.35 : 0.45, 0.85)).join('');
  return lueur(D, pres[0], pres[1], pres[2]) + (loin ? lueur(D, loin[0], loin[1], loin[2]) : '');
}
// Un corps de brume, avec ses ombres et quelques fils de brume à l'intérieur (la matière)
function masse(D, d, box, ombre = [], extra = '') {
  const [x0, y0, x1, y1] = box;
  const fill = brumeDe(D, x0, y0, x1, y1);
  let inner = ombre.map(([cx, cy, rx, ry]) => ell(cx, cy, rx, ry, D.rad([[0, '#2E3B5C', 0.45], [1, '#2E3B5C', 0]], cx, cy, Math.max(rx, ry)))).join('');
  const w = x1 - x0, h = y1 - y0;
  for (let i = 0; i < 6; i++) {
    const x = x0 + w * (0.1 + 0.15 * i + 0.05 * hash(i, x0)), y = y0 + h * (0.25 + 0.45 * hash(i, y0 + 3));
    inner += line(`M${r2(x)},${r2(y)} q${r2(w * 0.07)},${r2(-h * 0.08)} ${r2(w * 0.14)},${r2(h * 0.02)}`, '#DCE5F5', 0.3, 0.2);
  }
  // la brume plus dense et plus froide en bas, comme une eau trouble
  inner += ell((x0 + x1) / 2, y1, w * 0.6, h * 0.45, D.rad([[0, '#3A4970', 0.35], [1, '#3A4970', 0]], (x0 + x1) / 2, y1, w * 0.6));
  return `<g opacity="0.94">${path(d, fill, TRAIT, 0.75) + D.clip(d, inner + extra)}</g>`;
}

// ---- les poses ----
// marche (pas diagonal), fuite (galop : allongée, puis ramassée ; les oreilles couchées), repos (la tête levée vers la
// lumière), bouderie (1 : la tête basse, les yeux clos ; 2 : elle se détourne), luciole, brume
function etat(view, pose) {
  const P = poseOf(pose), { kind, n } = P, dos = view === 'dos';
  const a = kind === 'marche' || kind === 'fuite' ? (n === 1 ? 1 : -1) : 0;
  const tete = { marche: 0, fuite: 8, repos: -12, bouderie: 20, luciole: -14, brume: -6 }[kind];
  const yeuxMode = dos || (kind === 'bouderie' && n === 2) ? 'aucun' : kind === 'bouderie' || (kind === 'luciole' && n === 1) ? 'clos' : 'ouverts';
  return {
    P, kind, n, dos, a, tete: tete + (dos ? -6 : 0), yeux: yeuxMode, couchees: kind === 'fuite' || kind === 'bouderie',
    bob: kind === 'marche' ? (n === 2 ? -0.5 : 0) : kind === 'fuite' ? (n === 1 ? -0.9 : 0.3) : kind === 'bouderie' ? 0.5 : 0,
    lean: (dos ? -4 : 0) + (kind === 'fuite' ? 4 : 0) + (kind === 'bouderie' && n === 1 ? 2 : 0),
    flip: kind === 'bouderie' && n === 2, phase: (n || 0) * 0.37
  };
}
// Les écarts des pattes : [près devant, loin devant, près derrière, loin derrière]
function ecarts(E, pas) {
  if (E.kind === 'fuite') return E.n === 1 ? [pas * 1.6, pas * 1.1, -pas * 1.6, -pas * 1.1] : [-pas * 0.6, -pas * 0.3, pas * 0.7, pas * 0.4];
  return [E.a * pas, -E.a * pas, -E.a * pas, E.a * pas];
}

// ---- une bête : S, sa fiche ----
// S.corps (le tronc, d), S.boite (son cadre, pour la brume), S.ombres, S.dosLigne (le contre-jour), S.pattes ({ r, arr,
// pres, w }), S.pas, S.basse (pattes écartées), S.cou ([x, y] : le pivot de la tête), S.couD (le cou, d), S.tete(D, E)
// (dans le repère du pivot), S.queue(D, E), S.tache(D, lum) et S.glow (la tache et sa lueur ; S.tacheTete : sur la tête),
// S.clipTache (false : la tache déborde du tronc), S.rot (la tête qui tourne moins), S.devant(D, E) (devant le tronc), S.fondu
// ([y0, y1] : les pattes qui se perdent), S.volutes, S.aura, S.sol
function bete(S) {
  return (pref, view, pose) => {
    const D = Dessin(pref), E = etat(view, pose);
    const [pf, lf, pa, la] = ecarts(E, S.pas);
    const sw = { pres: { av: pf, ar: pa }, loin: { av: lf, ar: la } };
    const jambe = (p, fill) => {
      const s = sw[p.pres ? 'pres' : 'loin'][p.arr ? 'ar' : 'av'];
      return S.basse ? patteBasse(D, p.r, s, p.arr ? -1 : 1, p.w[0], fill) : patte(D, p.r, s, p.w[0], p.w[1], p.arr, fill, p.pied);
    };
    const fillPres = brumeDe(D, -10, -16, 6, 0);
    const loin = S.pattes.filter(p => !p.pres).map(p => jambe(p, LOIN)).join('');
    const pres = S.pattes.filter(p => p.pres).map(p => jambe(p, fillPres)).join('');
    const [cx, cy] = S.cou;
    const rot = r2(E.tete * (S.rot ?? 1));
    const teteT = `translate(${cx} ${cy}) rotate(${rot})`;
    const glow = S.tacheTete ? tourne([cx + S.glow[0], cy + S.glow[1]], cx, cy, rot) : S.glow;
    const tacheDe = lum => (S.tacheTete ? `<g transform="${teteT}">${S.tache(D, lum)}</g>` : S.clipTache === false ? S.tache(D, lum) : D.clip(S.corps, S.tache(D, lum)));
    // derrière : les pattes du côté loin, la queue, le tronc, le cou ; le souvenir ; devant : les pattes du côté près, la tête
    const b = D.fondu(S.fondu[0], S.fondu[1], `<g opacity="0.88">${loin}</g>` + S.queue(D, E) + (S.couD ? masse(D, S.couD, S.boite) : '') + masse(D, S.corps, S.boite, S.ombres) + contreJour(S.dosLigne, 0.75) + volutes(S.volutes, E.phase), -40, 80);
    const sv = chaud(D, glow[0], glow[1], S.chaud || 6, 0.3) + tacheDe(false);
    const f = D.fondu(S.fondu[0], S.fondu[1], pres + (S.devant ? S.devant(D, E) : ''), -40, 80) + `<g transform="${teteT}">${S.tete(D, E)}</g>`;
    const [ax, ay, arx, ary] = S.aura;
    return finir(D, E.P, { b, sv, f }, {
      t: S.saut && E.kind === 'fuite' ? tf(E.n === 1 ? -2.6 : 0, E.n === 1 ? -16 : 3, E.flip) : tf(E.bob, E.lean, E.flip), aura: S.aura, sol: S.sol, glow, halo: [S.aura[2] * 0.75, S.aura[2] * 0.95], montee: false,
      lumiere: k => {
        const up = k === 4 ? -16 : 0, s = k === 4 ? 0.75 : 1;
        return halo(D, glow[0], glow[1] + up, k === 4 ? 10 : 13) + `<g transform="translate(${r2(glow[0])} ${r2(glow[1] + up)}) scale(${s}) translate(${r2(-glow[0])} ${r2(-glow[1])})">${tacheDe(true)}</g>` +
          (k === 4 ? line(`M${r2(glow[0])},${r2(glow[1] - 3)} q-1.5,7 0.8,${r2(14)}`, '#FFE7A8', 0.6, 0.35) : '') + etincelle(glow[0] - 5, glow[1] + up - 3, 0.6) + etincelle(glow[0] + 4.5, glow[1] + up + 2.5, 0.45);
      },
      // elle retourne au Voile : des touffes de brume qui se détachent et montent
      voile: n => {
        let s = '';
        for (let i = 0; i < 6; i++) {
          const x = ax + (hash(i, 61) - 0.5) * arx * 1.6 - n * 1.5, y = ay + (hash(i, 63) - 0.3) * ary - n * 4 - i * 0.8, k = 0.6 + hash(i, 65) * 0.5;
          s += path(effile([x, y], [x + 1.2 * k, y - 1 * k], [x + 2.4 * k, y - 0.4 * k], [x + 3.4 * k, y - 1.4 * k], 1.1 * k, 0.15), '#C3CFE3', 'none', 0, ` opacity="${r2(0.75 - n * 0.18)}"`);
        }
        return s;
      },
      motes: [[ax - arx * 0.9, ay - ary * 0.4, 0.5], [ax + arx * 0.8, ay - ary * 0.7, 0.4], [ax - arx * 0.2, ay - ary * 1.1, 0.35]]
    });
  };
}

// ---- 1. Le lièvre de brume (tempéré) : un lièvre élancé, la croupe haute, les longues pattes arrière, les oreilles
// larges aux pointes sombres ; la tache rousse du poitrail ----
const lapin = bete({
  corps: 'M4.6,-11.2 C1,-13 -5,-13.4 -8.6,-11 C-11,-9.4 -11.2,-6.2 -9.6,-4.4 C-8.6,-3.4 -6.8,-3.2 -5.8,-3.8 C-3.5,-4.8 0,-5 2.6,-5.2 C3.6,-5.4 5.6,-5.6 7.4,-6.6 C7.6,-7.2 7.6,-7.8 7.4,-8.2 C7.4,-9.4 6.4,-10.4 4.6,-11.2 Z',
  boite: [-11, -13.4, 7.6, -3.4], ombres: [[-1, -4.6, 7, 1.8], [-8, -5, 3, 2.6]], dosLigne: 'M-10.2,-8 C-9.6,-11.6 -5,-13.2 0,-12.6',
  pattes: [
    { r: [-8.4, -4.8], arr: true, pres: false, w: [2.2, 0.8], pied: 2.2 }, { r: [4.6, -5.8], arr: false, pres: false, w: [1.4, 0.6] },
    { r: [-7.8, -4.4], arr: true, pres: true, w: [2.6, 0.9], pied: 2.6 }, { r: [5.4, -5.6], arr: false, pres: true, w: [1.6, 0.7] }
  ],
  pas: 2.4, cou: [5.4, -10.8],
  tete: (D, E) => {
    const ar = E.couchees ? 42 : 0;
    const oreille = (dx, dy, fill, pointe) => {
      const t = p => tourne([p[0] + dx, p[1] + dy], 1.2 + dx, -3.2 + dy, -ar).map(r2).join(',');
      const d = `M${t([0.2, -2.8])} C${t([-1.8, -6])} ${t([-3.8, -10])} ${t([-3.4, -13.8])} C${t([-1.4, -11.8])} ${t([1.4, -7.2])} ${t([2.2, -3.6])} Z`;
      const bout = `M${t([-2.6, -11.2])} C${t([-3.4, -12.2])} ${t([-3.5, -13])} ${t([-3.4, -13.8])} C${t([-2.6, -13.1])} ${t([-1.8, -12.2])} ${t([-1.3, -11.4])} Z`;
      return path(d, fill, TRAIT, 0.6) + (pointe ? path(bout, '#2B3654', 'none', 0, ' opacity="0.75"') + line(`M${t([0.6, -3.6])} C${t([-1, -6.4])} ${t([-2, -9])} ${t([-2.4, -11])}`, '#3A4970', 0.5, 0.5) : '');
    };
    const d = 'M-1.4,-0.6 C-1,-3.4 2.6,-4.6 5,-3.4 C6.6,-2.6 7.4,-1.2 7,-0.2 C6.4,0.8 4.6,1.4 2.6,1.4 C0.6,1.4 -1.6,0.8 -1.4,-0.6 Z';
    return oreille(1.5, -0.3, LOIN, false) + masse(D, d, [-1.5, -4.6, 7.4, 1.4], [[2.6, 1.2, 4, 1.2]]) + ell(6.9, -0.7, 0.4, 0.32, '#2E3B5C', ' opacity="0.7"') +
      (E.dos ? '' : line('M6.6,-0.1 q-0.4,0.9 -1.4,1', '#2E3B5C', 0.35, 0.5)) + yeux(D, E.yeux, [3.3, -2.3, 0.62], [5.2, -2.9, 0.38]) +
      oreille(0, 0, brumeDe(D, -4, -14, 2, -3), true) + contreJour('M-1,-1.8 C0,-3.8 2.6,-4.4 4.4,-3.8', 0.7);
  },
  queue: (D, E) => masse(D, 'M-9.8,-9.6 c-1.8,-0.4 -2.8,0.8 -2.2,2 c0.6,1 1.8,1 2.5,0.2 Z', [-12.2, -10, -9.4, -7]),
  tache: (D, lum) => tache(D, 5, -8.4, 2.2, 2.4, 3, ['#F2A868', '#C8682E', '#8A401C'], 10, lum), glow: [5, -8.4], chaud: 7,
  fondu: [-3.6, 0.6], volutes: [[-10, -1.2, 0.8, false], [2.4, -0.8, 0.7, true], [-3, -0.4, 0.6, false]], aura: [-1, -10, 13, 11], sol: 11
});

// ---- 2. Le bouquetin de brume (les Cimes) : haut sur pattes, le garrot puissant, les cornes annelées en arc, la
// barbiche ; la selle châtaigne du dos ----
const BQ = 'M5,-16.2 C1,-16.6 -4,-16 -8,-15.6 C-10.2,-15.4 -11.2,-13.4 -10.6,-11.6 C-10.2,-10.2 -9.6,-9.4 -8.4,-9 C-5,-8.8 -1,-8.6 2.8,-9 C4.6,-9.2 6.6,-9.8 7.4,-11 C8,-12.2 7.8,-13.6 7.2,-14.4 C6.6,-15.4 6,-16 5,-16.2 Z';
const bouquetin = bete({
  corps: BQ,
  boite: [-11, -16.6, 8, -8.6], ombres: [[-1, -8.6, 8, 1.8], [6.2, -10, 2.2, 2], [-9.4, -10.4, 2, 2]], dosLigne: 'M-10.6,-12.4 C-10,-15.4 -6,-16 -1,-16.3',
  couD: 'M3.6,-15.8 C5,-18.4 7.6,-20.6 9.6,-21.6 C11.2,-20.6 11.6,-19 11,-17.6 C10,-15.6 9,-13.8 7.8,-12.4 Z',
  pattes: [
    { r: [-8.6, -10], arr: true, pres: false, w: [2.4, 0.8] }, { r: [5, -10], arr: false, pres: false, w: [1.9, 0.8] },
    { r: [-8.2, -9.6], arr: true, pres: true, w: [2.8, 0.9] }, { r: [5.8, -9.8], arr: false, pres: true, w: [2.2, 0.9] }
  ],
  pas: 2.2, cou: [10.4, -21],
  tete: (D, E) => {
    const ar = E.couchees ? 14 : 0;
    const corne = (dx, w, fill) => {
      const a = [-0.4 + dx, -1.4], c1 = tourne([-0.2 + dx, -7.8], a[0], a[1], ar), c2 = tourne([-5.8 + dx, -10.6], a[0], a[1], ar), b = tourne([-9, -6 + dx * 0.2], a[0], a[1], ar);
      let s = path(effile(a, c1, c2, b, w, 0.45), fill, TRAIT, 0.6);
      for (let i = 1; i < 8; i++) {
        const t = i / 8, u = 1 - t;
        const p = [0, 1].map(j => u * u * u * a[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * b[j]);
        s += line(`M${r2(p[0] - 0.55 * (1 - t * 0.6))},${r2(p[1] - 0.3)} l${r2(1.1 * (1 - t * 0.6))},0.6`, TRAIT, 0.32, 0.6);
      }
      return s;
    };
    const d = 'M-1.6,-1.6 C-0.2,-2.8 2.2,-2.2 3.2,-0.4 C4,1.2 4.6,3 4,4 C3.4,4.8 2,4.4 1.2,3.4 C0.2,2.2 -1.6,1 -2,-0.2 C-2.2,-0.8 -2,-1.3 -1.6,-1.6 Z';
    return corne(1.3, 1.6, LOIN) + masse(D, d, [-2.2, -2.8, 4.6, 4.6], [[2.4, 3.2, 2, 1.6]]) +
      ell(3.7, 3.4, 0.35, 0.28, '#2E3B5C', ' opacity="0.7"') + yeux(D, E.yeux, [0.9, -0.1, 0.5], [2.3, -0.7, 0.3]) +
      path(effile([-1.2, -0.6], [-2.6, -1.3], [-3.7, -0.5], [-4.5, 0.3], 1.3, 0.3), brumeDe(D, -4, -1, 0, 1), TRAIT, 0.5) +
      corne(0, 2, brumeDe(D, -8, -10, 0, -1)) + contreJour('M-1.4,-1.6 C-0.2,-2.6 1.6,-2.4 2.6,-1.2', 0.7);
  },
  queue: (D, E) => masse(D, 'M-10.2,-14.6 c-1.4,-0.8 -2.3,0 -1.8,1.1 c0.3,0.8 1.2,0.9 1.9,0.3 Z', [-12, -15.4, -9.6, -12.8]),
  tacheTete: true, clipTache: false,
  // la barbiche châtaigne, longue, en mèches
  tache: (D, lum) => {
    const c = lum ? LUMIERE : ['#E8A86A', '#A8622E', '#5E3216'];
    const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], 1, 3, 3, 9);
    return path('M2.2,3.2 C3.4,3.4 4,4 3.8,5 C3.6,6.4 2.8,7.8 1.4,9 C1.6,8 1.4,7.4 1,7.2 C0.8,7.8 0.4,8.2 -0.2,8.4 C0.4,7.2 0.6,6 0.8,5 C1,4 1.4,3.3 2.2,3.2 Z', fill, lum ? '#E8B860' : BRUN, 0.45) +
      line('M2.4,4.2 q0,2.2 -0.8,4 M1.4,4.6 q-0.1,1.6 -0.6,3', lum ? '#FFFFFF' : c[0], 0.3, 0.75);
  },
  glow: [2, 6], chaud: 7,
  fondu: [-4, 0.6], volutes: [[-9.4, -1.4, 0.8, false], [3, -0.8, 0.8, true], [-2.4, -0.4, 0.6, false]], aura: [0, -13, 14, 13], sol: 12
});

// ---- 3. Le poney de brume (les Landes) : trapu, l'encolure épaisse, la tête longue et lourde, la queue qui traîne ;
// la crinière alezane ----
const poney = bete({
  corps: 'M4.6,-15.4 C1,-15.6 -4,-15 -8,-15.4 C-10.8,-15.6 -12.2,-13.4 -11.8,-11.4 C-11.4,-9.6 -10.4,-8.6 -9,-8.4 C-5,-7.6 0,-7.6 3.4,-8.2 C5.4,-8.4 7.4,-9.4 8,-11 C8.4,-12.4 8,-13.8 7.4,-14.4 C6.6,-15.2 5.6,-15.6 4.6,-15.4 Z',
  boite: [-12, -15.8, 8.4, -7.6], ombres: [[-1.6, -7.8, 8.6, 2.2], [-10, -9.4, 2.6, 2.4], [6.4, -9.6, 2.4, 2]], dosLigne: 'M-11.6,-12.6 C-11,-15.4 -7,-15.6 -2,-15.2',
  couD: 'M3,-15 C4.2,-18.6 7,-21.4 10,-22.4 C12,-21.2 12.6,-19 12,-17 C11.2,-14.8 10.2,-12.6 8.2,-10.6 Z',
  pattes: [
    { r: [-9.4, -9.2], arr: true, pres: false, w: [3, 1.4] }, { r: [5.2, -9.4], arr: false, pres: false, w: [2.6, 1.3] },
    { r: [-9, -8.8], arr: true, pres: true, w: [3.6, 1.6] }, { r: [6, -9.2], arr: false, pres: true, w: [3, 1.5] }
  ],
  pas: 2.2, cou: [11, -21.6],
  tete: (D, E) => {
    const ar = E.couchees ? 30 : 0;
    const oreille = (x, fill) => { const t = tourne([x - 0.8, -5], x, -1.8, -ar); return path(effile([x, -1.6], [x - 0.2, -2.8], [t[0] + 0.2, t[1] + 1], t, 1.5, 0.3), fill, TRAIT, 0.5); };
    const d = 'M-2.6,-1.6 C-0.8,-3.2 2.4,-2.6 4,-0.2 C5.2,1.6 6.2,3.8 5.6,5 C4.8,6.2 2.8,6 1.6,5 C0,3.6 -2.6,1.6 -3,0 C-3.2,-0.6 -3,-1.2 -2.6,-1.6 Z';
    // le toupet alezan entre les oreilles (avec la crinière : le même souvenir)
    return oreille(0.6, LOIN) + masse(D, d, [-3, -3, 6, 6], [[3.6, 4.6, 2.4, 1.6]]) + ell(4.6, 4.6, 0.45, 0.35, '#2E3B5C', ' opacity="0.6"') +
      yeux(D, E.yeux, [0.9, 0.3, 0.55], [2.1, -0.4, 0.32]) + oreille(-0.8, brumeDe(D, -2, -5, 1, -1)) + contreJour('M-2.4,-1.8 C-0.6,-3 2,-2.4 3.2,-0.8', 0.7);
  },
  queue: (D, E) => {
    const s = E.kind === 'fuite' ? -3 : E.a * 0.8;
    return path(effile([-11.4, -13.4], [-14 + s * 0.3, -12], [-14.4 + s, -7], [-13 + s, -2.2], 3.2, 0.5), brumeDe(D, -15, -13, -11, -2), TRAIT, 0.6) +
      line(`M-12.4,-11.8 q-1.4,3 -0.8,${r2(7.4)}`, '#DCE5F5', 0.35, 0.35) + line(`M-13,-10.6 q-0.8,3 -0.2,${r2(6)}`, '#3A4970', 0.35, 0.4);
  },
  clipTache: false,
  // la crinière : une masse qui suit l'encolure, ses mèches qui tombent sur le côté, et le toupet
  tache: (D, lum) => {
    const c = lum ? LUMIERE : ['#EEA866', '#B8642C', '#76381A'];
    const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], 4, -23, 8, -13);
    const d = 'M11.6,-23.2 C8.6,-23 5.6,-21 3.8,-17.8 C3,-16.4 2.2,-15.4 1.2,-14.6 C2.6,-14.2 3.6,-14.6 4.2,-15.2 C4.4,-14 5,-13.2 5.8,-12.6 C5.8,-14 6.1,-15.2 6.6,-16.2 C7,-15 7.6,-14.4 8.4,-14 C8.1,-15.6 8.3,-17 8.9,-18.1 C9.3,-17.1 9.9,-16.6 10.6,-16.4 C10.2,-17.8 10.4,-19.3 11.2,-20.4 C11.8,-21.3 12,-22.4 11.6,-23.2 Z';
    let s = path(d, fill, lum ? '#E8B860' : BRUN, 0.5);
    for (const [x, y, dx, dy] of [[9.6, -21.4, -1.6, 4], [7.6, -20.2, -1.2, 4.6], [5.8, -18.4, -0.8, 4.4], [4.2, -16.6, -0.6, 2.8]]) s += line(`M${x},${y} q${r2(dx * 0.2)},${r2(dy * 0.5)} ${dx},${dy}`, lum ? '#FFFFFF' : c[0], 0.35, 0.7);
    // le toupet, qui tombe sur le front
    s += path('M11.4,-23 C13.2,-23.6 14.4,-22.4 14.4,-20.6 C13.8,-21.4 13,-21.6 12.4,-21.4 C12.8,-20.6 12.8,-19.6 12.4,-19 C11.8,-20.2 11.2,-21.6 11.4,-23 Z', fill, lum ? '#E8B860' : BRUN, 0.45);
    return s;
  },
  glow: [7, -18.6], chaud: 8,
  fondu: [-4, 0.6], volutes: [[-10, -1.4, 0.9, false], [3, -0.8, 0.8, true], [-3, -0.4, 0.7, false]], aura: [0, -12, 15, 13], sol: 12.5
});

// ---- 4. La grenouille de brume (le Marais) : accroupie, la croupe haute, la tête plate et large, la bouche fendue,
// deux lueurs sur les bosses des yeux, les cuisses repliées et les longs doigts ; la tache vert-or du dos ----
const GR = 'M-6.6,-2.4 C-7.2,-4.8 -5.6,-7 -3,-7.4 C-0.6,-7.8 2.2,-7.6 4.2,-7.2 C6.4,-6.8 8.4,-5.6 9,-4 C9.4,-2.8 8.6,-1.8 7,-1.6 C3,-1.2 -2,-1.2 -5,-1.4 C-6,-1.6 -6.4,-1.9 -6.6,-2.4 Z';
const grenouille = bete({
  corps: GR,
  boite: [-7.2, -7.8, 9.4, -1.2], ombres: [[1, -1.2, 7.6, 1.6]], dosLigne: 'M-6.8,-4 C-6.2,-6.6 -3.4,-7.4 0.6,-7.6',
  pattes: [
    { r: [5.6, -2.8], arr: false, pres: false, w: [1.1, 0.5] }, { r: [6.4, -2.6], arr: false, pres: true, w: [1.3, 0.6] }
  ],
  pas: 0.7, cou: [4.6, -7], rot: 0.15, saut: true,
  tete: (D, E) => {
    const bosse = (x, y, r, fill) => ell(x, y, r, r * 0.8, fill, ` stroke="${TRAIT}" stroke-width="0.5"`);
    return bosse(1.4, -1.1, 1.1, LOIN) + bosse(-0.2, -0.7, 1.35, brumeDe(D, -1.6, -2, 1.4, 0.4)) + yeux(D, E.yeux, [-0.1, -0.9, 0.6], [1.5, -1.3, 0.4]) +
      (E.dos ? '' : line('M3.6,3.4 C2.4,3 0.6,2.6 -1,2.4', '#2E3B5C', 0.45, 0.6) + ell(3.4, 1.6, 0.25, 0.2, '#2E3B5C', ' opacity="0.6"'));
  },
  // la cuisse repliée sur le flanc, le pied posé devant (au saut : la patte qui se détend)
  queue: (D, E) => {
    const saut = E.kind === 'fuite' && E.n === 1, k = E.kind === 'fuite' ? 0 : E.a * 0.5;
    if (saut) return path(effile([-5.6, -3.2], [-8.4, -3.8], [-10.4, -2.6], [-12.4, -1.2], 2.4, 0.7), LOIN, TRAIT, 0.5);
    return path(effile([-5.8, -2.6], [-8.6 + k, -3.6], [-9 + k, -0.8], [-6.4 + k, -0.5], 2.2, 0.9), LOIN, TRAIT, 0.5);
  },
  tache: (D, lum) => tache(D, -1.6, -6.8, 3, 1.3, 11, ['#E4F07A', '#86B83C', '#3E7A26'], 2, lum), glow: [-1.6, -6.6], chaud: 6,
  devant: (D, E) => grenouilleDevant(D, E),
  fondu: [-1.2, 0.8], volutes: [[-7.4, -0.6, 0.6, false], [4.6, -0.4, 0.5, true]], aura: [0, -5, 11, 7], sol: 9.5
});
// la cuisse près, devant le tronc, et le pied aux longs doigts
const grenouilleDevant = (D, E) => {
  const saut = E.kind === 'fuite' && E.n === 1, k = E.kind === 'fuite' ? 0 : E.a * 0.5;
  const fill = brumeDe(D, -14, -7, 2, 0);
  const doigts = (x, y, dir) => line(`M${r2(x)},${r2(y)} l${r2(dir * 1.3)},-0.45 M${r2(x)},${r2(y)} l${r2(dir * 1.4)},0.15 M${r2(x)},${r2(y)} l${r2(dir * 1)},0.6`, TRAIT, 0.4, 0.8);
  // la main devant, aux doigts ouverts
  const main = doigts(6.6 + k * 0.4, -0.1, 1);
  if (saut) return path(effile([-5, -3.2], [-8, -3.4], [-10.4, -2.2], [-12.8, -1.2], 2.6, 0.9), fill, TRAIT, 0.5) + path(effile([-12.6, -1.3], [-13.6, -1], [-14.4, -0.8], [-15.2, -0.6], 1, 0.5), fill, TRAIT, 0.4) + doigts(-15.2, -0.6, -1);
  // la cuisse repliée (une goutte couchée, pointe devant), le tibia qui revient, le long pied posé devant
  return path(effile([0.2, -2], [-1.2, -1.6], [-2.4, -1.1], [-3.6, -0.8], 1.4, 1), fill, TRAIT, 0.45) +
    masse(D, 'M-6.4,-2.8 C-6.8,-5.2 -4.4,-6.2 -2,-5.2 C0,-4.4 1.2,-2.8 0.4,-2 C-0.6,-1.2 -3.2,-1.2 -5.2,-1.4 C-5.9,-1.6 -6.3,-2.1 -6.4,-2.8 Z', [-7, -6, 1, -1.2], [[-3, -1.6, 3, 1.2]]) +
    path(effile([-3.6, -0.8], [-1, -0.7], [1.2, -0.5], [3 + k, -0.3], 1.1, 0.5), fill, TRAIT, 0.45) + doigts(3 + k, -0.3, 1) + main;
};

// ---- 5. Le fennec de brume (les Dunes) : fin et nerveux, les oreilles immenses, la queue en panache au bout sombre ;
// une oreille couleur de sable ----
const fennec = bete({
  corps: 'M3.4,-9.8 C0,-10.4 -3.6,-10.2 -6,-9.6 C-7.6,-9.2 -8,-7.6 -7.4,-6.4 C-7,-5.6 -6.2,-5.2 -5.4,-5.2 C-3,-5.2 0,-5 2.2,-5.2 C3.6,-5.4 5.2,-6.2 5.6,-7.4 C5.9,-8.4 5.2,-9.4 3.4,-9.8 Z',
  boite: [-8, -10.4, 6, -5], ombres: [[-1, -5, 6, 1.4], [-6.6, -6, 1.6, 1.6]], dosLigne: 'M-7.6,-7.6 C-7,-9.8 -3,-10.4 1,-10.1',
  pattes: [
    { r: [-6.4, -6], arr: true, pres: false, w: [1.8, 0.55] }, { r: [3.6, -6], arr: false, pres: false, w: [1.2, 0.55] },
    { r: [-6, -5.6], arr: true, pres: true, w: [2.1, 0.6] }, { r: [4.2, -5.8], arr: false, pres: true, w: [1.4, 0.6] }
  ],
  pas: 2, cou: [4.6, -9.4],
  tete: (D, E) => {
    const d = 'M-1.6,-0.6 C-0.6,-3 2.4,-3.2 3.6,-1.6 C4.6,-0.6 6.4,0 6.9,0.6 C6,1.4 3.4,1.6 1.6,1.6 C0,1.6 -1.8,0.8 -1.6,-0.6 Z';
    const ar = E.couchees ? 40 : 0;
    const t = tourne([1.6, -10.4], 1.8, -2.6, -ar);
    const oreille = path(`M0.6,-2.4 C${r2(t[0] - 1.6)},${r2(t[1] + 3)} ${r2(t[0] - 0.6)},${r2(t[1] + 0.6)} ${r2(t[0])},${r2(t[1])} C${r2(t[0] + 1.2)},${r2(t[1] + 2.4)} 3.8,-4.6 3,-2.4 Z`, LOIN, TRAIT, 0.55);
    return oreille + masse(D, d, [-2, -3.4, 7, 1.8], [[3, 1.4, 3, 1]]) + ell(6.8, 0.5, 0.45, 0.35, '#2E3B5C', ' opacity="0.7"') +
      (E.dos ? '' : line('M6.6,0.9 q-1.6,0.6 -3.2,0.3', '#2E3B5C', 0.3, 0.5)) + yeux(D, E.yeux, [2.4, -1.2, 0.55], [3.9, -1.6, 0.33]) + contreJour('M-1.2,-1.4 C0,-2.8 2,-3 3.2,-2', 0.7);
  },
  queue: (D, E) => {
    const s = E.kind === 'fuite' ? -2.4 : E.a * 0.6;
    return masse(D, `M-6.8,-8.4 C-9.2,-9 -11.8,-7.8 ${r2(-12.8 + s)},${r2(-4.8 + s * 0.3)} C${r2(-13 + s)},${r2(-3 + s * 0.3)} -11.8,-2.8 -10.8,-3.8 C-9.6,-5 -8.2,-6 -6.8,-6.2 Z`, [-13.2, -9, -6.4, -2.8], [[-10, -3.4, 3, 1.4]]) +
      ell(-12.3 + s, -3.6 + s * 0.3, 1, 0.9, '#2B3654', ' opacity="0.6"');
  },
  tacheTete: true, clipTache: false,
  // l'oreille près, de la couleur du sable, l'intérieur rosé
  tache: (D, lum) => {
    const fill = lum ? D.lin([[0, LUMIERE[0]], [0.5, LUMIERE[1]], [1, LUMIERE[2]]], -2, -11, 1, -2) : D.lin([[0, '#F8E2B0'], [0.55, '#E2B26A'], [1, '#B07434']], -2, -11, 1, -2);
    const d = 'M-1.2,-2.2 C-3.4,-5.4 -3.6,-8.6 -2.6,-11.2 C-0.6,-9.6 1.4,-6.6 1.6,-2.8 Z';
    return path(d, fill, lum ? '#E8B860' : BRUN, 0.55) + path('M-0.8,-3.2 C-2.2,-5.6 -2.4,-7.8 -2.1,-9.4 C-0.9,-8 0.4,-6 0.6,-3.4 Z', lum ? '#FFFFFF' : '#E3A096', 'none', 0, ' opacity="0.65"') +
      line('M-1.4,-4 q-0.6,-1.6 -0.6,-3.4 M-0.4,-4 q-0.3,-1.2 -0.4,-2.6', lum ? '#FFFFFF' : '#FBEBCB', 0.3, 0.8);
  },
  glow: [-0.9, -6.2], chaud: 6,
  fondu: [-3, 0.6], volutes: [[-7, -1, 0.7, false], [2.4, -0.6, 0.6, true]], aura: [-1, -8, 11, 10], sol: 9
});

// ---- 6. Le caméléon de brume (la Jungle) : le casque, la crête du dos, l'œil en tourelle, la queue roulée en spirale,
// les pattes en pince ; la bande émeraude du flanc ----
const CA = 'M-6,-6 C-6,-10 -2,-12.2 2,-11.6 C5,-11.2 7,-9.6 7.4,-7.6 C7.6,-6 6.6,-5 5,-4.6 C2,-4 -2.5,-4 -4.6,-4.4 C-5.6,-4.7 -6,-5.2 -6,-6 Z';
const cameleon = bete({
  corps: CA,
  boite: [-6.4, -12.2, 7.6, -4], ombres: [[0, -4, 6.4, 1.6]], dosLigne: 'M-5.8,-8 C-4.6,-11.2 -1,-12.2 2.4,-11.6',
  basse: true,
  pattes: [
    { r: [-3.6, -4.8], arr: true, pres: false, w: [1.3] }, { r: [4.2, -5], arr: false, pres: false, w: [1.2] },
    { r: [-3, -4.6], arr: true, pres: true, w: [1.6] }, { r: [4.8, -4.8], arr: false, pres: true, w: [1.5] }
  ],
  pas: 1.2, cou: [6.6, -8.2], rot: 0.5,
  tete: (D, E) => {
    const d = 'M-1.2,-2.4 C0,-5.8 3.4,-5.6 5,-2.6 C5.9,-1.1 5.8,0.8 4.3,1.4 C2.5,2.1 0.1,1.7 -1,0.6 C-1.6,-0.4 -1.6,-1.4 -1.2,-2.4 Z';
    const oeil = E.yeux === 'aucun' ? '' : ell(2.4, -0.7, 1.5, 1.4, brumeDe(D, 1, -2, 4, 1), ` stroke="${TRAIT}" stroke-width="0.5"`) + line('M1.2,-0.4 a1.3,1.2 0 0 1 2.4,-0.6', '#3A4970', 0.3, 0.6) + yeux(D, E.yeux, [2.8, -0.8, 0.55]);
    return masse(D, d, [-1.6, -5.6, 6, 2], [[3, 1.4, 3, 1]]) + line('M0,-3.6 C1.2,-5.2 3,-5 3.9,-3.6', TRAIT, 0.4, 0.55) + oeil + line('M3.4,1 q1,0.2 1.8,-0.2', '#2E3B5C', 0.4, 0.6);
  },
  queue: (D, E) => {
    const k = E.kind === 'fuite' ? 1.2 : 1 + E.a * 0.06;
    const spire = `M${r2(-10.6 * k)},-1.6 C${r2(-10.2 * k)},0 ${r2(-8 * k)},-0.2 ${r2(-8 * k)},-1.6 C${r2(-8 * k)},-2.8 ${r2(-9.6 * k)},-2.8 ${r2(-9.4 * k)},-1.8`;
    // la crête du dos : de petites dents
    let crete = '';
    for (let i = 0; i < 7; i++) { const x = -4.6 + i * 1.3, y = -9.4 - Math.sin(((i + 0.5) / 7) * Math.PI) * 2.6; crete += `M${r2(x)},${r2(y + 0.6)} l0.6,-0.9 l0.6,0.9`; }
    return path(crete, '#8D9EBF', TRAIT, 0.4) + path(effile([-5.6, -6.4], [-9, -6], [-11 * k, -4], [-10.6 * k, -1.6], 2.4, 1.3), brumeDe(D, -11, -7, -5, -1), TRAIT, 0.6) + line(spire, TRAIT, 1.3) + line(spire, '#8D9EBF', 0.6);
  },
  tache: (D, lum) => tache(D, 0.2, -8.2, 5.4, 0.95, 17, ['#A6F2BC', '#2FAE74', '#0E6A55'], -9, lum),
  glow: [0.4, -8.2], chaud: 6,
  fondu: [-2.2, 0.6], volutes: [[-6, -0.6, 0.6, false], [3, -0.5, 0.6, true]], aura: [-1, -7, 11, 8], sol: 9.5
});

// ---- 7. La salamandre de brume (le Volcan) : longue et basse, la tête large et plate, la queue qui ondule, les
// pattes écartées aux doigts ouverts ; la tache orange-feu du dos ----
const SA = 'M-14.6,-2.2 C-12,-2.6 -10,-4.2 -6.6,-4.8 C-2.6,-5.6 2,-6 6,-5.8 C8.8,-5.7 11.6,-5 12.6,-3.8 C13,-3 12.2,-2.2 10.6,-2.1 C7,-1.9 2,-2.1 -2,-2.1 C-6,-2.1 -9,-1.6 -12,-1.7 C-13.2,-1.8 -14.2,-1.9 -14.6,-2.2 Z';
const salamandre = bete({
  corps: SA,
  boite: [-14.6, -6, 12.8, -1.6], ombres: [[0, -1.8, 9, 1]], dosLigne: 'M-9,-4.3 C-5,-5.4 -1,-5.8 4,-5.9',
  basse: true,
  pattes: [
    { r: [-3.4, -2.6], arr: true, pres: false, w: [1.2] }, { r: [6, -2.8], arr: false, pres: false, w: [1.2] },
    { r: [-2.8, -2.4], arr: true, pres: true, w: [1.5] }, { r: [6.6, -2.6], arr: false, pres: true, w: [1.4] }
  ],
  pas: 1.4, cou: [10.6, -4.4], rot: 0.25,
  tete: (D, E) => yeux(D, E.yeux, [-0.2, -0.6, 0.55], [1, -1, 0.34]) + (E.dos ? '' : line('M2,1.6 C0.6,1.4 -0.6,1.2 -1.6,1.4', '#2E3B5C', 0.35, 0.55)),
  queue: (D, E) => '',
  tache: (D, lum) => tache(D, 2.4, -5.4, 2.8, 1.1, 23, ['#FFD070', '#F07A28', '#A43812'], -2, lum), glow: [2.4, -5], chaud: 6,
  fondu: [-1.4, 0.8], volutes: [[-11, -0.6, 0.6, false], [2, -0.4, 0.5, true]], aura: [-1, -4, 14, 5], sol: 12.5
});

// [climat, nom, dessin(pref, vue, pose)] : une bête par climat (le cœur, tempéré : le lièvre)
const BETES_BRUME = [
  ['tempere', 'Lapin de brume (tempéré)', lapin],
  ['cimes', 'Bouquetin de brume (les Cimes)', bouquetin],
  ['landes', 'Poney de brume (les Landes)', poney],
  ['marais', 'Grenouille de brume (le Marais)', grenouille],
  ['dunes', 'Fennec de brume (les Dunes)', fennec],
  ['jungle', 'Caméléon de brume (la Jungle)', cameleon],
  ['volcan', 'Salamandre de brume (le Volcan)', salamandre]
];

module.exports = { BETES_BRUME };
