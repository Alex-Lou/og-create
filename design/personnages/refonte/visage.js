// Le visage de la troupe refondue : yeux à iris et paupière, sourcils, bouches, signes autour du visage, et la gamme des
// expressions. Une seule source pour chaque PNJ refondu (Agathe…), réglée par sa palette K :
//   K.eyeRx, K.eyeRy (taille de l'œil) ; K.eye, K.iris, K.irisL (l'œil) ; K.lid, K.skin, K.skinS, K.under (paupières,
//   cernes) ; K.brow, K.browW (sourcils, leur épaisseur) ; K.mouth (bouche).
// (Lorena garde pour l'instant sa propre copie de ces fonctions, dans lorena_refonte.js : même dessin.)
const { P, E, L, clip, drop, zee, r2, OUT } = require('../troupe');

// Les expressions de la troupe refondue (Lorena, Agathe…). Pour les deux yeux (eye) et les deux sourcils (brow), puis, si besoin, pour l'œil ou le
// sourcil de gauche (L, à gauche de l'écran) ou de droite (R) seulement :
//   brow [bout intérieur, bout extérieur, cambrure] ; lid : paupière du haut (0 → 1) ; tilt : inclinaison de la paupière
//   (+ : coin intérieur plus bas, l'air dur ; - : coin extérieur plus bas, l'inquiétude) ; low : paupière du bas qui remonte
//   (le sourire des yeux) ; look [x, y] : le regard ; mode : open, joy (arc des yeux rieurs), closed (fermé doux), squeeze
//   (> <), shut (serré de douleur) ; wide : grands ouverts ; small : petites pupilles (la peur) ; sparkle : étoile au reflet ;
//   wet : l'œil qui brille ; under : cernes (0 → 1)
// mouth : la bouche ; extras : les signes autour (blush, hatch, sweat, tears, stream, zz, cold, vein, steam)
const BASE = { brow: [0.15, 0.05, -0.4], lid: 0.13, tilt: 0.05, low: 0, look: [0, 0.1], under: 0.6, mouth: 'flat', extras: [] };
const X = o => ({ ...BASE, ...o });
const EXPR = {
  // le caractère
  veille: X({}),
  decidee: X({ brow: [0.95, -0.3, -0.05], lid: 0.16, tilt: 0.4, low: 0.1, look: [0, 0], under: 0.45, mouth: 'firm' }),
  mefiante: X({ brow: [0.9, -0.2, 0], browR: [-0.6, -1.1, -0.7], lid: 0.32, tilt: 0.3, low: 0.12, look: [-0.55, 0.1], mouth: 'side' }),
  pensive: X({ brow: [-0.4, 0.1, -0.3], browL: [-0.9, -0.4, -0.5], lid: 0.2, look: [-0.5, -0.5], mouth: 'side' }),
  ironique: X({ brow: [0.2, 0, -0.3], browL: [-1, -1.3, -0.7], lid: 0.28, tilt: 0.1, low: 0.1, look: [0.35, 0], mouth: 'smirk' }),
  concentree: X({ brow: [1.1, 0, -0.1], lid: 0.22, tilt: 0.35, low: 0.08, look: [0, 0.25], mouth: 'bite' }),
  // la joie
  sourire: X({ brow: [-0.3, -0.15, -0.6], lid: 0.08, tilt: 0, low: 0.27, look: [0, 0], under: 0.4, mouth: 'half' }),
  rire: X({ brow: [-0.7, -0.5, -0.8], mode: 'joy', under: 0.3, mouth: 'laugh', extras: ['blush'] }),
  tendresse: X({ brow: [-0.6, 0, -0.5], mode: 'closed', under: 0.3, mouth: 'soft', extras: ['blush'] }),
  soulagee: X({ brow: [-1, 0.3, -0.4], mode: 'closed', under: 0.6, mouth: 'soft', extras: ['sweat'] }),
  emerveillee: X({ brow: [-1.3, -1, -0.9], lid: 0, wide: true, sparkle: true, look: [0, -0.3], under: 0.3, mouth: 'wow', extras: ['blush'] }),
  // la peine
  inquiete: X({ brow: [-1.15, 0.4, 0.05], lid: 0.08, tilt: -0.35, look: [0, 0.4], under: 0.7, mouth: 'wave' }),
  triste: X({ brow: [-1.3, 0.6, 0.1], lid: 0.25, tilt: -0.4, look: [0, 0.7], under: 0.8, mouth: 'down', wet: true, extras: ['tears'] }),
  sanglot: X({ brow: [-1.5, 0.7, 0.2], mode: 'squeeze', under: 0.8, mouth: 'sob', extras: ['stream', 'blush'] }),
  coupable: X({ brow: [-1.2, 0.55, 0.15], lid: 0.32, tilt: -0.3, look: [0.3, 0.6], under: 0.8, mouth: 'press', wet: true }),
  genee: X({ brow: [-0.9, 0.3, -0.2], lid: 0.2, tilt: -0.2, look: [-0.6, 0.4], mouth: 'wave', extras: ['hatch', 'sweat'] }),
  // la peur, la colère
  surprise: X({ brow: [-1.4, -1.1, -0.9], lid: 0, look: [0, -0.1], under: 0.35, mouth: 'o', wide: true }),
  peur: X({ brow: [-1.6, -0.2, -0.3], lid: 0, wide: true, small: true, look: [0, 0], mouth: 'fear', extras: ['sweat'] }),
  colere: X({ brow: [1.4, -0.65, 0.15], lid: 0.27, tilt: 0.75, low: 0.12, look: [0, -0.1], under: 0.5, mouth: 'teeth', extras: ['vein'] }),
  cri: X({ brow: [1.5, -0.8, 0.2], lid: 0.12, tilt: 0.7, low: 0.1, look: [0, 0], mouth: 'shout' }),
  boude: X({ brow: [1, 0.1, 0], lid: 0.3, tilt: 0.3, look: [0.6, 0.2], mouth: 'pout', extras: ['blush'] }),
  // le corps
  epuisee: X({ brow: [-0.5, 0.35, -0.15], lid: 0.45, tilt: -0.1, low: 0.04, look: [0, 0.35], under: 1, mouth: 'open' }),
  endormie: X({ brow: [0.2, 0.3, -0.3], mode: 'closed', under: 0.8, mouth: 'sleep', extras: ['zz'] }),
  froid: X({ brow: [-1, 0.2, -0.1], lid: 0.2, tilt: -0.15, low: 0.1, look: [0, 0.2], under: 0.7, mouth: 'chatter', extras: ['cold'] }),
  douleur: X({ brow: [1.2, -0.2, 0], browR: [-0.6, 0.3, 0], eyeL: { mode: 'shut' }, lid: 0.35, tilt: -0.2, low: 0.15, look: [0, 0.2], mouth: 'teeth', extras: ['sweat'] }),
  clin: X({ brow: [-0.2, -0.1, -0.5], eyeR: { mode: 'joy' }, low: 0.2, look: [0, 0], under: 0.4, mouth: 'smirk' }),
  cligne: X({ mode: 'closed' }),
  // l'œil à la longue-vue (l'action d'aster.js : ctx.eyeMode « wink ») : l'œil lointain fermé, plissé, le sourcil qui descend
  visee: X({ brow: [0.7, -0.1, -0.2], browR: [1, 0.4, 0], eyeR: { mode: 'shut' }, lid: 0.2, low: 0.1, mouth: 'firm' })
};
// Les noms du kit (le salut demande « content », le repos « neutre ») vers les siens
const ALIAS = { neutre: 'veille', content: 'sourire', surpris: 'surprise', fache: 'colere', gene: 'genee', endormi: 'endormie' };

// Un œil : ovale sombre, iris d'eau en bas, deux reflets ; paupière du haut à la couleur de la peau et trait de cils,
// petite pointe au coin extérieur ; paupière du bas qui remonte ; cerne. k : +1 si l'œil est à gauche du nez
function eye(id, x, y, k, e, K) {
  const rx = (e.wide ? K.eyeRx + 0.15 : K.eyeRx) * (e.rk || 1), ry = e.wide ? K.eyeRy + 0.2 : K.eyeRy;
  const under = E(x, y + ry + 0.25, 1.9, 0.75, K.under, 0).replace('/>', ` opacity="${r2(0.3 * e.under)}"/>`);
  const flick = (yy, w = 0.6) => P(`M${r2(x - k * rx)},${r2(yy)} l${r2(-k * 0.7)},-0.5`, 'none', w);
  if (e.mode === 'closed') return under + P(`M${r2(x - rx)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + rx)},${r2(y + 0.4)}`, 'none', 1) + flick(y + 0.4);
  if (e.mode === 'joy') return under + P(`M${r2(x - rx)},${r2(y + 1)} Q${x},${r2(y - 1.5)} ${r2(x + rx)},${r2(y + 1)}`, 'none', 1.1) + flick(y + 1);
  if (e.mode === 'squeeze') return P(`M${r2(x - k * 1.5)},${r2(y - 1.4)} L${r2(x + k * 1.2)},${r2(y + 0.1)} L${r2(x - k * 1.5)},${r2(y + 1.5)}`, 'none', 1.1);
  if (e.mode === 'shut') return P(`M${r2(x - rx)},${r2(y + 0.3)} Q${x},${r2(y - 0.3)} ${r2(x + rx)},${r2(y + 0.5)}`, 'none', 1.1)
    + P(`M${r2(x - k * 0.6)},${r2(y - 1.6)} l${r2(k * 0.9)},0.7 M${r2(x - k * 0.2)},${r2(y + 1.8)} l${r2(k * 0.9)},-0.5`, 'none', 0.5);
  const [lx, ly] = e.look;
  const top = y - ry + e.lid * 2 * ry; // hauteur de la paupière au milieu
  const tin = top + (e.tilt || 0), tout = top - (e.tilt || 0) * 0.6; // coin intérieur, coin extérieur
  const xin = x + k * (rx + 0.25), xout = x - k * (rx + 0.35);
  const lidLine = `M${r2(xout)},${r2(tout + 1.6)} Q${x},${r2(Math.min(tin, tout) - 1.2)} ${r2(xin)},${r2(tin + 1.6)}`;
  const bot = y + ry - (e.low || 0) * 2 * ry;
  const ix = x + lx, iy = y + ly;
  const [irx, iry, pr] = e.small ? [0.95, 1.2, 0.38] : [1.45, 1.8, 0.66];
  let inner = E(x, y, rx, ry, e.small ? '#FFFFFF' : K.eye, 0)
    + E(ix, iy + 0.55, irx, iry, K.iris, e.small ? 0.5 : 0)
    + (e.small ? '' : P(`M${r2(ix - 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 2.5)} ${r2(ix + 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 1.7)} ${r2(ix - 1.2)},${r2(iy + 1)} Z`, K.irisL, 0))
    + E(ix, iy + 0.35, pr, pr * 1.1, K.eye, 0)
    + E(ix - k * 0.55 * (e.small ? 0.6 : 1), Math.max(iy - 0.85, top + 0.7), e.small ? 0.36 : 0.72, e.small ? 0.36 : 0.72, '#FFFFFF', 0)
    + (e.small ? '' : E(ix + k * 0.45, iy + 1.15, 0.28, 0.28, '#FFFFFF', 0));
  if (e.sparkle) inner += P(`M${r2(ix + k * 0.5)},${r2(iy - 0.2)} l0.25,0.6 l0.6,0.25 l-0.6,0.25 l-0.25,0.6 l-0.25,-0.6 l-0.6,-0.25 l0.6,-0.25 Z`, '#FFFFFF', 0);
  if (e.wet) inner += P(`M${r2(x - rx)},${r2(y + 1.2)} Q${x},${r2(y + 1.9)} ${r2(x + rx)},${r2(y + 1.2)} L${r2(x + rx)},${r2(y + ry + 0.5)} L${r2(x - rx)},${r2(y + ry + 0.5)} Z`, '#CDEFF0', 0).replace('/>', ' opacity=".55"/>');
  if (e.lid > 0 || e.tilt) inner += P(`${lidLine} L${r2(xin)},${r2(y - ry - 2)} L${r2(xout)},${r2(y - ry - 2)} Z`, K.lid, 0);
  if (e.low) inner += P(`M${r2(x - rx - 0.5)},${r2(bot + 0.2)} Q${x},${r2(bot - 0.8)} ${r2(x + rx + 0.5)},${r2(bot + 0.2)} L${r2(x + rx + 0.5)},${r2(y + ry + 1)} L${r2(x - rx - 0.5)},${r2(y + ry + 1)} Z`, K.lid, 0);
  let s = under;
  s += clip(id, `M${r2(x - rx)},${y} a${rx},${ry} 0 1,0 ${r2(2 * rx)},0 a${rx},${ry} 0 1,0 ${r2(-2 * rx)},0 Z`, inner);
  if (e.small) s += E(x, y, rx, ry, 'none', 0.7);
  s += P(lidLine, 'none', 0.95);
  s += P(`M${r2(xout + k * 0.1)},${r2(tout + 1.55)} l${r2(-k * 0.7)},${r2(-0.6)}`, 'none', 0.65);
  if (e.low) s += P(`M${r2(x - rx * 0.7)},${r2(bot + 0.05)} Q${x},${r2(bot - 0.6)} ${r2(x + rx * 0.7)},${r2(bot + 0.05)}`, 'none', 0.45);
  return s;
}

// Sourcil : un trait plein qui s'affine vers l'extérieur ; le gauche est fendu (une petite coupure)
function brow(x, y, k, b, split, sc, K) {
  sc = sc || 1;
  const [bi, bo, arch] = b, hw = 2.4 * sc;
  const xi = x + k * hw, xo = x - k * hw, yi = y + bi, yo = y + bo, mx = x, my = (yi + yo) / 2 + arch;
  const t = K.browW || 1; // l'épaisseur du sourcil (plus fin avec l'âge)
  let s = P(`M${r2(xi)},${r2(yi - 0.5 * t)} Q${r2(mx)},${r2(my - 0.55 * t)} ${r2(xo)},${r2(yo)} Q${r2(mx)},${r2(my + 0.35 * t)} ${r2(xi)},${r2(yi + 0.55 * t)} Z`, K.brow, 0);
  if (split) s += L([x - k * 0.35, (yi + yo) / 2 - 1], [x - k * 0.05, (yi + yo) / 2 + 1], K.skin, 0.55) + L([x - k * 0.5, (yi + yo) / 2 - 1.9], [x - k * 0.3, (yi + yo) / 2 - 1], '#B5473A', 0.4);
  return s;
}

function mouth(kind, mx, my, id, K) {
  const line = d => P(d, 'none', 0.85);
  const lip = L([mx - 0.5, my + 1.4], [mx + 0.5, my + 1.4], K.skinS, 0.45);
  // une bouche ouverte : le contour sombre, la langue découpée dedans
  const open = (d, tongue = true, teeth = false) => P(d, K.mouth, 0.85) + clip(id, d, (tongue ? E(mx, my + 2.1, 1.3, 0.85, '#D9786C', 0) : '') + (teeth ? `<rect x="${r2(mx - 2.5)}" y="${r2(my - 0.6)}" width="5" height="1.05" fill="#FFFFFF"/>` : ''));
  switch (kind) {
    case 'firm': return line(`M${r2(mx - 1.5)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.2)}`) + line(`M${r2(mx + 1.4)},${r2(my + 0.2)} l0.35,0.45`);
    case 'wave': return P(`M${r2(mx - 1.4)},${r2(my + 0.6)} Q${r2(mx - 0.7)},${r2(my + 0.05)} ${mx},${r2(my + 0.45)} Q${r2(mx + 0.7)},${r2(my + 0.85)} ${r2(mx + 1.4)},${r2(my + 0.35)}`, 'none', 0.75);
    case 'half': return line(`M${r2(mx - 1.4)},${r2(my + 0.15)} Q${r2(mx + 0.2)},${r2(my + 1)} ${r2(mx + 1.6)},${r2(my - 0.45)}`) + line(`M${r2(mx + 1.6)},${r2(my - 0.45)} l0.2,-0.3`);
    case 'smirk': return line(`M${r2(mx - 1.2)},${r2(my + 0.45)} Q${r2(mx + 0.4)},${r2(my + 0.6)} ${r2(mx + 1.7)},${r2(my - 0.5)}`) + lip;
    case 'side': return line(`M${r2(mx - 0.4)},${r2(my + 0.5)} Q${r2(mx + 0.6)},${r2(my + 0.3)} ${r2(mx + 1.7)},${r2(my + 0.1)}`) + L([mx + 0.2, my + 1.4], [mx + 1, my + 1.3], K.skinS, 0.45);
    case 'bite': return line(`M${r2(mx - 1.4)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.3)}`) + P(`M${r2(mx - 0.7)},${r2(my + 0.3)} L${r2(mx - 0.6)},${r2(my + 1)} L${r2(mx + 0.1)},${r2(my + 1)} L${r2(mx + 0.2)},${r2(my + 0.3)} Z`, '#FFFFFF', 0.45);
    case 'soft': return line(`M${r2(mx - 1.3)},${r2(my + 0.15)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.15)}`);
    case 'laugh': return open(`M${r2(mx - 2)},${r2(my - 0.2)} Q${mx},${r2(my - 0.6)} ${r2(mx + 2)},${r2(my - 0.2)} Q${r2(mx + 1.6)},${r2(my + 3.4)} ${mx},${r2(my + 3.4)} Q${r2(mx - 1.6)},${r2(my + 3.4)} ${r2(mx - 2)},${r2(my - 0.2)} Z`, true, true);
    case 'wow': return open(`M${r2(mx - 1.2)},${r2(my + 0.1)} Q${mx},${r2(my - 0.3)} ${r2(mx + 1.2)},${r2(my + 0.1)} Q${r2(mx + 1)},${r2(my + 2)} ${mx},${r2(my + 2)} Q${r2(mx - 1)},${r2(my + 2)} ${r2(mx - 1.2)},${r2(my + 0.1)} Z`);
    case 'shout': return open(`M${r2(mx - 1.9)},${r2(my - 0.3)} L${r2(mx + 1.9)},${r2(my - 0.5)} Q${r2(mx + 1.8)},${r2(my + 3.6)} ${mx},${r2(my + 3.6)} Q${r2(mx - 1.8)},${r2(my + 3.6)} ${r2(mx - 1.9)},${r2(my - 0.3)} Z`, true, true);
    case 'fear': return open(`M${r2(mx - 1.6)},${r2(my + 0.6)} Q${r2(mx - 0.8)},${r2(my - 0.1)} ${mx},${r2(my + 0.4)} Q${r2(mx + 0.8)},${r2(my - 0.1)} ${r2(mx + 1.6)},${r2(my + 0.6)} L${r2(mx + 1.2)},${r2(my + 1.9)} Q${mx},${r2(my + 1.5)} ${r2(mx - 1.2)},${r2(my + 1.9)} Z`, false, true);
    case 'sob': return open(`M${r2(mx - 1.5)},${r2(my + 1.6)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.5)},${r2(my + 1.6)} Q${mx},${r2(my + 2.4)} ${r2(mx - 1.5)},${r2(my + 1.6)} Z`, false);
    case 'pout': return P(`M${r2(mx - 1)},${r2(my + 0.5)} Q${mx},${r2(my - 0.2)} ${r2(mx + 1)},${r2(my + 0.5)} Q${mx},${r2(my + 1.2)} ${r2(mx - 1)},${r2(my + 0.5)} Z`, '#C9665B', 0.75);
    case 'chatter': return P(`M${r2(mx - 1.7)},${r2(my + 0.1)} L${r2(mx + 1.7)},${r2(my + 0.1)} L${r2(mx + 1.5)},${r2(my + 1.4)} L${r2(mx - 1.5)},${r2(my + 1.4)} Z`, '#FFFFFF', 0.8) + P(`M${r2(mx - 1.4)},${r2(my + 0.75)} l0.7,-0.35 l0.7,0.35 l0.7,-0.35 l0.7,0.35`, 'none', 0.4).replace(`stroke="${OUT}"`, 'stroke="#9A8A84"');
    case 'sleep': return E(mx + 0.2, my + 0.7, 0.55, 0.65, K.mouth, 0.75);
    case 'down': return line(`M${r2(mx - 1.4)},${r2(my + 0.9)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.4)},${r2(my + 0.9)}`);
    case 'teeth': return P(`M${r2(mx - 1.7)},${r2(my + 0.2)} L${r2(mx + 1.7)},${r2(my + 0.05)} L${r2(mx + 1.4)},${r2(my + 1.3)} L${r2(mx - 1.4)},${r2(my + 1.4)} Z`, '#FFFFFF', 0.8) + L([mx - 1.4, my + 0.75], [mx + 1.4, my + 0.7], '#C9B8B0', 0.35);
    case 'o': return E(mx, my + 0.7, 0.85, 1.05, K.mouth, 0.85);
    case 'open': return P(`M${r2(mx - 1.1)},${r2(my + 0.3)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.1)},${r2(my + 0.3)} Q${mx},${r2(my + 1.4)} ${r2(mx - 1.1)},${r2(my + 0.3)} Z`, K.mouth, 0.8);
    case 'press': return line(`M${r2(mx - 1.5)},${r2(my + 0.6)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.5)},${r2(my + 0.6)}`) + L([mx - 0.6, my + 1.5], [mx + 0.6, my + 1.5], K.skinS, 0.45);
    default: return line(`M${r2(mx - 1.4)},${r2(my + 0.35)} Q${r2(mx + 0.1)},${r2(my + 0.1)} ${r2(mx + 1.4)},${r2(my + 0.4)}`) + lip;
  }
}

// Les signes autour du visage. n : l'image (0 ou 1), pour que la goutte et les Zzz bougent un peu d'une image à l'autre
function extras(list, n, X = v => v, dos = false) {
  let s = '';
  for (const x of list) {
    if (dos && x !== 'zz' && x !== 'sweat' && x !== 'vein') continue; // de dos, rien sur le visage
    if (x === 'blush') s += E(X(16.8), 26.4, 2.3, 1.2, '#EE7F78', 0).replace('/>', ' opacity=".5"/>') + E(X(31.2), 26.4, 2.3 * (X(31.2) - X(24)) / 7.2, 1.2, '#EE7F78', 0).replace('/>', ' opacity=".35"/>');
    if (x === 'hatch') for (const cx of [X(16.8), X(31.2)]) for (const d of [-1, 0, 1]) s += L([cx + d * 1.1 - 0.4, 27.1], [cx + d * 1.1 + 0.4, 25.9], '#D9605A', 0.45);
    if (x === 'sweat') s += drop(dos ? 34.8 : X(13.2), 13.6 + n * 0.8, 1.7, '#A9DCFF');
    if (x === 'tears') s += drop(X(17.2), 27.1 + n * 0.9, 0.9, '#A9DCFF', 0.5);
    if (x === 'stream') s += `<g transform="translate(${r2(X(18.1) - 18.1)} 0)">${P('M17.6,24.4 Q16.8,28 17.6,31.4 L18.6,31.2 Q18,28 18.6,24.6 Z', '#A9DCFF', 0.5)}</g><g transform="translate(${r2(X(29.9) - 29.9)} 0)">${P('M29.4,24.6 Q30,28 29.4,31.2 L30.4,31.4 Q31.2,28 30.4,24.4 Z', '#A9DCFF', 0.5)}</g>`;
    // (un peu plus bas que le kit : au repos, la respiration monte la tête, et le Zzz ne doit jamais sortir du cadre)
    if (x === 'zz') s += n ? zee(37, 5.8, 2) + zee(39.4, 2.6, 2.4) : zee(36.4, 6.6, 1.8) + zee(39, 3.4, 2.2);
    if (x === 'cold') s += E(X(24.4), 25.6, 1.2, 0.8, '#9CC8E8', 0).replace('/>', ' opacity=".7"/>') + E(X(16.8), 26.4, 2.2, 1.1, '#9CC8E8', 0).replace('/>', ' opacity=".55"/>') + E(X(31.2), 26.4, 2.2 * (X(31.2) - X(24)) / 7.2, 1.1, '#9CC8E8', 0).replace('/>', ' opacity=".55"/>')
      + P('M9.6,17.6 q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4 M7.8,18.6 q-0.6,0.9 0,1.8 M38.4,17.6 q0.8,1.2 0,2.4 q-0.8,1.2 0,2.4 M40.2,18.6 q0.6,0.9 0,1.8', 'none', 0.6);
    if (x === 'vein') {
      const a = n ? 0.6 : 0.5, b = n ? 2 : 1.7, cx = 39.6, cy = 7.4;
      const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r2(cx + i * a)},${r2(cy + j * b)} Q${r2(cx + i * a)},${r2(cy + j * a)} ${r2(cx + i * b)},${r2(cy + j * a)}`).join(' ');
      s += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
    }
  }
  return s;
}

// Ce qui bouge au vent, en continu : deux images d'un même chemin, en aller-retour adouci
const wind = (a, b, fill, w, dur = '1.7s', begin = '0s') => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">`
  + `<animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>`;

// L'âge : la patte-d'oie au coin de l'œil et la poche sous l'œil, en traits fins (k : +1 si l'œil est à gauche du nez)
function rides(x, y, k, K, sc = 1) {
  // deux petits plis courbes qui partent du coin de l'œil, vers la tempe ; une poche fine sous l'œil
  const o = x - k * (K.eyeRx * sc + 0.6);
  return `<path d="M${r2(o)},${r2(y - 0.6)} q${r2(-k * 0.7)},-0.1 ${r2(-k * 1)},-0.6 M${r2(o)},${r2(y + 0.3)} q${r2(-k * 0.7)},0.1 ${r2(-k * 1)},0.5" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".8"/>`
    + `<path d="M${r2(x - K.eyeRx * 0.7 * sc)},${r2(y + K.eyeRy + 0.85)} Q${x},${r2(y + K.eyeRy + 1.45)} ${r2(x + K.eyeRx * 0.7 * sc)},${r2(y + K.eyeRy + 0.85)}" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".7"/>`;
}

module.exports = { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides };
