// Lorena (anciennement Hermine ; fichiers du jeu : aster), refonte d'étude : le même personnage, le même cadre 48 × 64, le même trait et le même kit
// (troupe.js), poussé plus loin. Yeux à iris et paupière, sourcils plus bas, bouche qui ne sourit plus au repos ; le
// naufrage sur elle (sparadrap, sourcil fendu, sel, ciré déchiré, corde) ; une gamme d'expressions à elle ; ses tenues,
// palettes et états (lorena_tenues.js).
// Vue de face seulement pour l'étude. Ne remplace rien : aster.js reste la source du jeu.
const { P, E, L, clip, dechirure, drop, zee, shoe, r2, OUT } = require('../troupe');
// les couleurs d'aster.js que Lorena repeint (capuche, foulard)
const AST = { coat: '#F2C04B', coatS: '#CC9A2F', scarf: '#C8463A', scarfS: '#9A2F28' };
// c.miroir : la direction sera retournée par le jeu (vers la gauche) ; ses marques passent de l'autre côté avant, pour
// retomber du bon côté de son corps (le bandage à son poignet droit ; le sparadrap sur sa joue gauche, la queue de
// cheval et la longue-vue à sa gauche)
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);
const recolor = (s, map) => s.replace(/#[0-9A-Fa-f]{6}\b/g, m => map[m.toUpperCase()] || m);
const aster = require('../aster');
const { capucheRabattue, reperes } = require('../avatar_accessoires');
const { fabriquerBras } = require('./lorena_bras');
const { jambe } = require('./membres');

const C = {
  skin: '#F2C9A0', skinS: '#D9A47E', lid: '#EDBF97', under: '#C98D7A',
  hair: '#A8442F', hairS: '#7E2D22', hairH: '#E07F5A', rim: '#9FE3DA',
  coat: '#EBB943', coatS: '#C08B2C', coatH: '#FFE49A', salt: '#FFF8E8',
  scarf: '#C8463A', scarfS: '#9A2F28',
  brass: '#C9A24A', brassS: '#8E6E2C', brassH: '#F0D58A',
  iris: '#3F7A74', irisL: '#8CC9BC', eye: '#241B18', brow: '#5A1F18',
  cheek: '#EE9C8E', freckle: '#B9714F', mouth: '#7A3B30',
  cloth: '#E6D4AE', clothS: '#B8A27A', rope: '#B48F5A', ropeS: '#7C5E36', patch: '#8D7A5A', patch2: '#5E7FA0',
  shirt: '#F1E9D6', shirtS: '#D3C6A8', stripe: '#2F4F7A', mud: '#6B5138'
};

// Les expressions de Lorena. Pour les deux yeux (eye) et les deux sourcils (brow), puis, si besoin, pour l'œil ou le
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
function eye(id, x, y, k, e) {
  const rx = (e.wide ? 2.1 : 1.95) * (e.rk || 1), ry = e.wide ? 2.8 : 2.6;
  const under = E(x, y + ry + 0.25, 1.9, 0.75, C.under, 0).replace('/>', ` opacity="${r2(0.3 * e.under)}"/>`);
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
  let inner = E(x, y, rx, ry, e.small ? '#FFFFFF' : C.eye, 0)
    + E(ix, iy + 0.55, irx, iry, C.iris, e.small ? 0.5 : 0)
    + (e.small ? '' : P(`M${r2(ix - 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 2.5)} ${r2(ix + 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 1.7)} ${r2(ix - 1.2)},${r2(iy + 1)} Z`, C.irisL, 0))
    + E(ix, iy + 0.35, pr, pr * 1.1, C.eye, 0)
    + E(ix - k * 0.55 * (e.small ? 0.6 : 1), Math.max(iy - 0.85, top + 0.7), e.small ? 0.36 : 0.72, e.small ? 0.36 : 0.72, '#FFFFFF', 0)
    + (e.small ? '' : E(ix + k * 0.45, iy + 1.15, 0.28, 0.28, '#FFFFFF', 0));
  if (e.sparkle) inner += P(`M${r2(ix + k * 0.5)},${r2(iy - 0.2)} l0.25,0.6 l0.6,0.25 l-0.6,0.25 l-0.25,0.6 l-0.25,-0.6 l-0.6,-0.25 l0.6,-0.25 Z`, '#FFFFFF', 0);
  if (e.wet) inner += P(`M${r2(x - rx)},${r2(y + 1.2)} Q${x},${r2(y + 1.9)} ${r2(x + rx)},${r2(y + 1.2)} L${r2(x + rx)},${r2(y + ry + 0.5)} L${r2(x - rx)},${r2(y + ry + 0.5)} Z`, '#CDEFF0', 0).replace('/>', ' opacity=".55"/>');
  if (e.lid > 0 || e.tilt) inner += P(`${lidLine} L${r2(xin)},${r2(y - ry - 2)} L${r2(xout)},${r2(y - ry - 2)} Z`, C.lid, 0);
  if (e.low) inner += P(`M${r2(x - rx - 0.5)},${r2(bot + 0.2)} Q${x},${r2(bot - 0.8)} ${r2(x + rx + 0.5)},${r2(bot + 0.2)} L${r2(x + rx + 0.5)},${r2(y + ry + 1)} L${r2(x - rx - 0.5)},${r2(y + ry + 1)} Z`, C.lid, 0);
  let s = under;
  s += clip(id, `M${r2(x - rx)},${y} a${rx},${ry} 0 1,0 ${r2(2 * rx)},0 a${rx},${ry} 0 1,0 ${r2(-2 * rx)},0 Z`, inner);
  if (e.small) s += E(x, y, rx, ry, 'none', 0.7);
  s += P(lidLine, 'none', 0.95);
  s += P(`M${r2(xout + k * 0.1)},${r2(tout + 1.55)} l${r2(-k * 0.7)},${r2(-0.6)}`, 'none', 0.65);
  if (e.low) s += P(`M${r2(x - rx * 0.7)},${r2(bot + 0.05)} Q${x},${r2(bot - 0.6)} ${r2(x + rx * 0.7)},${r2(bot + 0.05)}`, 'none', 0.45);
  return s;
}

// Sourcil : un trait plein qui s'affine vers l'extérieur ; le gauche est fendu (une petite coupure)
function brow(x, y, k, b, split, sc = 1) {
  const [bi, bo, arch] = b, hw = 2.4 * sc;
  const xi = x + k * hw, xo = x - k * hw, yi = y + bi, yo = y + bo, mx = x, my = (yi + yo) / 2 + arch;
  let s = P(`M${r2(xi)},${r2(yi - 0.5)} Q${r2(mx)},${r2(my - 0.55)} ${r2(xo)},${r2(yo)} Q${r2(mx)},${r2(my + 0.35)} ${r2(xi)},${r2(yi + 0.55)} Z`, C.brow, 0);
  if (split) s += L([x - k * 0.35, (yi + yo) / 2 - 1], [x - k * 0.05, (yi + yo) / 2 + 1], C.skin, 0.55) + L([x - k * 0.5, (yi + yo) / 2 - 1.9], [x - k * 0.3, (yi + yo) / 2 - 1], '#B5473A', 0.4);
  return s;
}

function mouth(kind, mx, my, id) {
  const line = d => P(d, 'none', 0.85);
  const lip = L([mx - 0.5, my + 1.4], [mx + 0.5, my + 1.4], C.skinS, 0.45);
  // une bouche ouverte : le contour sombre, la langue découpée dedans
  const open = (d, tongue = true, teeth = false) => P(d, C.mouth, 0.85) + clip(id, d, (tongue ? E(mx, my + 2.1, 1.3, 0.85, '#D9786C', 0) : '') + (teeth ? `<rect x="${r2(mx - 2.5)}" y="${r2(my - 0.6)}" width="5" height="1.05" fill="#FFFFFF"/>` : ''));
  switch (kind) {
    case 'firm': return line(`M${r2(mx - 1.5)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.2)}`) + line(`M${r2(mx + 1.4)},${r2(my + 0.2)} l0.35,0.45`);
    case 'wave': return P(`M${r2(mx - 1.4)},${r2(my + 0.6)} Q${r2(mx - 0.7)},${r2(my + 0.05)} ${mx},${r2(my + 0.45)} Q${r2(mx + 0.7)},${r2(my + 0.85)} ${r2(mx + 1.4)},${r2(my + 0.35)}`, 'none', 0.75);
    case 'half': return line(`M${r2(mx - 1.4)},${r2(my + 0.15)} Q${r2(mx + 0.2)},${r2(my + 1)} ${r2(mx + 1.6)},${r2(my - 0.45)}`) + line(`M${r2(mx + 1.6)},${r2(my - 0.45)} l0.2,-0.3`);
    case 'smirk': return line(`M${r2(mx - 1.2)},${r2(my + 0.45)} Q${r2(mx + 0.4)},${r2(my + 0.6)} ${r2(mx + 1.7)},${r2(my - 0.5)}`) + lip;
    case 'side': return line(`M${r2(mx - 0.4)},${r2(my + 0.5)} Q${r2(mx + 0.6)},${r2(my + 0.3)} ${r2(mx + 1.7)},${r2(my + 0.1)}`) + L([mx + 0.2, my + 1.4], [mx + 1, my + 1.3], C.skinS, 0.45);
    case 'bite': return line(`M${r2(mx - 1.4)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.3)}`) + P(`M${r2(mx - 0.7)},${r2(my + 0.3)} L${r2(mx - 0.6)},${r2(my + 1)} L${r2(mx + 0.1)},${r2(my + 1)} L${r2(mx + 0.2)},${r2(my + 0.3)} Z`, '#FFFFFF', 0.45);
    case 'soft': return line(`M${r2(mx - 1.3)},${r2(my + 0.15)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.15)}`);
    case 'laugh': return open(`M${r2(mx - 2)},${r2(my - 0.2)} Q${mx},${r2(my - 0.6)} ${r2(mx + 2)},${r2(my - 0.2)} Q${r2(mx + 1.6)},${r2(my + 3.4)} ${mx},${r2(my + 3.4)} Q${r2(mx - 1.6)},${r2(my + 3.4)} ${r2(mx - 2)},${r2(my - 0.2)} Z`, true, true);
    case 'wow': return open(`M${r2(mx - 1.2)},${r2(my + 0.1)} Q${mx},${r2(my - 0.3)} ${r2(mx + 1.2)},${r2(my + 0.1)} Q${r2(mx + 1)},${r2(my + 2)} ${mx},${r2(my + 2)} Q${r2(mx - 1)},${r2(my + 2)} ${r2(mx - 1.2)},${r2(my + 0.1)} Z`);
    case 'shout': return open(`M${r2(mx - 1.9)},${r2(my - 0.3)} L${r2(mx + 1.9)},${r2(my - 0.5)} Q${r2(mx + 1.8)},${r2(my + 3.6)} ${mx},${r2(my + 3.6)} Q${r2(mx - 1.8)},${r2(my + 3.6)} ${r2(mx - 1.9)},${r2(my - 0.3)} Z`, true, true);
    case 'fear': return open(`M${r2(mx - 1.6)},${r2(my + 0.6)} Q${r2(mx - 0.8)},${r2(my - 0.1)} ${mx},${r2(my + 0.4)} Q${r2(mx + 0.8)},${r2(my - 0.1)} ${r2(mx + 1.6)},${r2(my + 0.6)} L${r2(mx + 1.2)},${r2(my + 1.9)} Q${mx},${r2(my + 1.5)} ${r2(mx - 1.2)},${r2(my + 1.9)} Z`, false, true);
    case 'sob': return open(`M${r2(mx - 1.5)},${r2(my + 1.6)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.5)},${r2(my + 1.6)} Q${mx},${r2(my + 2.4)} ${r2(mx - 1.5)},${r2(my + 1.6)} Z`, false);
    case 'pout': return P(`M${r2(mx - 1)},${r2(my + 0.5)} Q${mx},${r2(my - 0.2)} ${r2(mx + 1)},${r2(my + 0.5)} Q${mx},${r2(my + 1.2)} ${r2(mx - 1)},${r2(my + 0.5)} Z`, '#C9665B', 0.75);
    case 'chatter': return P(`M${r2(mx - 1.7)},${r2(my + 0.1)} L${r2(mx + 1.7)},${r2(my + 0.1)} L${r2(mx + 1.5)},${r2(my + 1.4)} L${r2(mx - 1.5)},${r2(my + 1.4)} Z`, '#FFFFFF', 0.8) + P(`M${r2(mx - 1.4)},${r2(my + 0.75)} l0.7,-0.35 l0.7,0.35 l0.7,-0.35 l0.7,0.35`, 'none', 0.4).replace(`stroke="${OUT}"`, 'stroke="#9A8A84"');
    case 'sleep': return E(mx + 0.2, my + 0.7, 0.55, 0.65, C.mouth, 0.75);
    case 'down': return line(`M${r2(mx - 1.4)},${r2(my + 0.9)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.4)},${r2(my + 0.9)}`);
    case 'teeth': return P(`M${r2(mx - 1.7)},${r2(my + 0.2)} L${r2(mx + 1.7)},${r2(my + 0.05)} L${r2(mx + 1.4)},${r2(my + 1.3)} L${r2(mx - 1.4)},${r2(my + 1.4)} Z`, '#FFFFFF', 0.8) + L([mx - 1.4, my + 0.75], [mx + 1.4, my + 0.7], '#C9B8B0', 0.35);
    case 'o': return E(mx, my + 0.7, 0.85, 1.05, C.mouth, 0.85);
    case 'open': return P(`M${r2(mx - 1.1)},${r2(my + 0.3)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.1)},${r2(my + 0.3)} Q${mx},${r2(my + 1.4)} ${r2(mx - 1.1)},${r2(my + 0.3)} Z`, C.mouth, 0.8);
    case 'press': return line(`M${r2(mx - 1.5)},${r2(my + 0.6)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.5)},${r2(my + 0.6)}`) + L([mx - 0.6, my + 1.5], [mx + 0.6, my + 1.5], C.skinS, 0.45);
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

// Les marques du naufrage sur elle, réglées par l'état (lorena_tenues.js) : ourlet (torn : déchiré, mended : recousu,
// clean : net) ; sel, poussière et boue (0 → 1) ; la pièce de toile à l'épaule ; la corde en bandoulière ; le sparadrap ;
// le poignet bandé ; trempée (gouttes qui tombent)
const MARKS = { hem: 'torn', salt: 1, dirt: 0, patch: true, rope: true, plaster: true, wrist: true, wet: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
const pal = c => ({ ...C, ...(c.pal || {}) });

// Fil de couture (point avant), la couleur du fil, le point de croix des réparations
const THREAD = '#EFE3C4';
const seam = (d, w = 0.45) => `<path d="${d}" fill="none" stroke="${THREAD}" stroke-width="${w}" stroke-dasharray=".9 .7" stroke-linecap="round"/>`;
// Une ligne qui suit l'ourlet (la courbe de x0 à x1, contrôle au milieu en yc), remontée de off, ondulée de amp :
// l'auréole de sel laissée par l'eau, qui suit toujours le bas du vêtement
function suitOurlet(x0, x1, y0, yc, off, amp = 0) {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, u = 1 - t, x = x0 + (x1 - x0) * t;
    const y = u * u * y0 + 2 * u * t * yc + t * t * y0 - off + Math.sin(t * Math.PI * 7) * amp;
    pts.push(`${r2(x)},${r2(y)}`);
  }
  return 'M' + pts.join(' L');
}

// La longue-vue à la hanche (sa hanche gauche : à droite de l'écran de face, à gauche de dos), le laiton un peu cabossé
const spyglass = (K, [x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-1.5" y="-4.5" width="3" height="9" rx="0.8" fill="${K.brass}" stroke="${OUT}" stroke-width="0.9"/><rect x="-1.1" y="-3.9" width="0.8" height="7.8" rx="0.4" fill="${K.brassH}"/><rect x="-1.95" y="-4.9" width="3.9" height="2.1" rx="0.6" fill="${K.brassS}" stroke="${OUT}" stroke-width="0.8"/><path d="M0.6,1.4 l0.5,0.9" stroke="${K.brassS}" stroke-width="0.5"/></g>`;
const ropeBand = (K, d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.rope}" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.ropeS}" stroke-width="1.7" stroke-dasharray=".5 1.1"/>`;
// La pièce de toile cousue sur son épaule droite : bord surpiqué au fil clair
const patch = (K, [x, y]) => {
  const d = `M${x},${y} L${r2(x + 3.4)},${r2(y - 0.2)} L${r2(x + 3.6)},${r2(y + 3.2)} L${r2(x + 0.2)},${r2(y + 3.4)} Z`;
  return `<g transform="rotate(-8 ${r2(x + 1.8)} ${r2(y + 1.6)})">${P(d, K.patch, 0.6)}${seam(`M${r2(x + 0.6)},${r2(y + 0.5)} L${r2(x + 2.9)},${r2(y + 0.35)} L${r2(x + 3.05)},${r2(y + 2.65)} L${r2(x + 0.75)},${r2(y + 2.8)} Z`, 0.4)}</g>`;
};
// Les plis du tissu : deux plis qui tombent des aisselles vers l'ourlet, toujours aux mêmes places
const plis = hemY => `<path d="M17.8,38.2 Q16.9,${r2((38.2 + hemY) / 2)} 17.4,${r2(hemY - 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".32" stroke-linecap="round"/>`
  + `<path d="M30.2,38.4 Q31.1,${r2((38.4 + hemY) / 2)} 30.6,${r2(hemY - 0.4)}" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".32" stroke-linecap="round"/>`;

// Ce qui change avec la vue : o, le milieu du devant (de trois quarts, il glisse vers la gauche) ; l'ombre ; la pièce de
// toile (son épaule droite) ; la corde (de son épaule droite à sa hanche gauche) ; la longue-vue (sa hanche gauche)
const TORSE = {
  front: { o: 24, shade: 27.5, patch: [16, 34], rope: 'M16.6,32.6 Q22.6,36.6 30.4,41.6', glass: [30, 45.6, -12], poches: [[15.4, 19.4], [28.6, 32.6]] },
  se: { o: 21.5, shade: 26, patch: [15.2, 34], rope: 'M15.8,32.8 Q21.2,36.6 28.8,41.6', glass: [29.4, 45.2, -14], poches: [[14.8, 18.4], [26.8, 29.8]] },
  ne: { o: 24, shade: 27.5, patch: [27.6, 39.4], rope: 'M31.4,32.6 Q25.4,36.6 17.6,41.6', glass: [17.4, 45.4, 12], poches: [] }
};

// Le haut du corps selon la tenue (c.tenue) : cire (le ciré fermé), ouvert (le ciré ouvert sur la marinière), vareuse
// (la veste de quart en laine, croisée, boutons de laiton), chemise (chemise de lin, gilet de toile, ceinture de filin)
function torse(c, ctx, K, M) {
  const t = c.tenue || 'cire', u = c.uid, view = ctx.view, V = TORSE[view] || TORSE.front, o = V.o, dx = o - 24;
  const dos = view === 'ne';
  const court = t === 'vareuse' || t === 'chemise';
  // en marchant, le bas du vêtement balance à peine avec le pas (ctx.sway) : un ciré lourd ne se déhanche pas (choix de
  // l'auteur, 15 oct. : plus ample, il faisait dandiner les hanches)
  const sw = r2((ctx.sway || 0) * 0.3);
  const x0 = court ? 14 : 13, x1 = court ? 34 : 35, hy = court ? 45.4 : 47.5, hc = court ? 48 : 51;
  const torn = dechirure([x1, hy], [24 + sw, hc], [x0, hy], court ? 5 : 3);
  const OUTLINE = `M15.5,32.5 Q24,29.8 32.5,32.5 L${x1},${hy} ` + (M.hem === 'torn' ? torn.d : `Q${r2(24 + sw)},${hc} ${x0},${hy}`) + ' Z';
  const ourlet = off => suitOurlet(x0, x1, hy, hc, off);
  // ce que le tissu porte, toujours dans le même ordre : ombre du côté de la brume, reflet, plis, sel, poussière, reprises
  const shade = `<rect x="${V.shade}" y="30" width="12" height="24" fill="${K.coatS}"/><path d="${ourlet(1.6)} L${x1},54 L${x0},54 Z" fill="${K.coatS}"/>`;
  const shine = `<rect x="14.6" y="34" width="1.4" height="${r2(hy - 38)}" rx="0.7" fill="${K.coatH}"/><rect x="${r2(x1 - 0.2)}" y="33" width="1.2" height="16" fill="${K.rim}" opacity=".7"/>`;
  const salt = M.salt ? `<path d="${suitOurlet(x0, x1, hy, hc, 2.3, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r2(0.75 * M.salt)}"/><path d="${suitOurlet(x0, x1, hy, hc, 4.6, 0.3)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r2(0.4 * M.salt)}"/>` : '';
  const dust = M.dirt ? `<path d="${suitOurlet(x0, x1, hy, hc, 2.6, 0.18)} L${x1},54 L${x0},54 Z" fill="${K.mud}" opacity="${r2(0.3 * M.dirt)}"/>` : '';
  const mended = M.hem === 'mended' ? seam(ourlet(1)) : '';
  const fabric = shade + shine + plis(hy) + salt + dust + mended;
  let s = '';
  if (t === 'chemise' && !dos) {
    // chemise de lin, col ouvert ; gilet de toile ouvert (ses bords extérieurs suivent le corps, l'ouverture suit le
    // milieu du devant), deux boutons de laiton ; ceinture de filin
    const SH = `M16,32.5 Q24,30 32,32.5 L${x1 - 1},${hy + 0.2} Q24,${hc - 0.4} ${x0 + 1},${hy + 0.2} Z`;
    s += P(SH, K.shirt) + clip(`${u}sh`, SH, `<rect x="${r2(o + 1.6)}" y="30" width="1.6" height="18" fill="${K.shirtS}" opacity=".7"/>` + salt + dust) + P(SH, 'none');
    s += P(`M${o},33.6 L${o},44.4`, 'none', 0.55) + P(`M${r2(o - 2.4)},32.2 L${r2(o - 1.2)},35 L${o},33.4 Z`, K.shirt, 0.6) + P(`M${r2(o + 2.4)},32.2 L${r2(o + 1.2)},35 L${o},33.4 Z`, K.shirtS, 0.6);
    const VL = `M16,32.6 Q${r2(o - 5)},31.6 ${r2(o - 2.8)},32.4 L${r2(o - 1.8)},${hy + 0.4} Q${r2((15.2 + o - 1.8) / 2)},${hy + 1} 15.2,${hy} Z`;
    const VR = `M32,32.6 Q${r2(o + 5)},31.6 ${r2(o + 2.8)},32.4 L${r2(o + 1.8)},${hy + 0.4} Q${r2((32.8 + o + 1.8) / 2)},${hy + 1} 32.8,${hy} Z`;
    s += P(VL, K.coat) + clip(`${u}gl`, VL, `<rect x="16.2" y="34" width="1.2" height="8" rx="0.6" fill="${K.coatH}"/><rect x="${V.shade}" y="30" width="12" height="18" fill="${K.coatS}"/>` + plis(hy) + salt + dust + mended) + P(VL, 'none');
    s += P(VR, K.coat) + clip(`${u}gr`, VR, `<rect x="${r2(o)}" y="30" width="12" height="18" fill="${K.coatS}"/>` + plis(hy) + salt + dust + mended) + P(VR, 'none');
    s += seam(`M${r2(o - 3)},33 L${r2(o - 2.1)},${hy - 0.4}`, 0.35) + seam(`M${r2(o + 3)},33 L${r2(o + 2.1)},${hy - 0.4}`, 0.35);
    for (const y of [37.2, 40.6]) s += E(o - 2.3, y, 0.55, 0.55, K.brass, 0.45);
  } else if (t === 'chemise') {
    // de dos : le dos du gilet, d'une pièce, sa sangle et sa boucle au creux des reins
    const DV = `M15.6,32.8 Q24,31 32.4,32.8 L32.8,${hy} Q24,${hy + 1} 15.2,${hy} Z`;
    s += P(DV, K.coat) + clip(`${u}gd`, DV, fabric) + P(DV, 'none');
    s += seam(`M24,33.6 L24,${hy - 0.6}`, 0.35) + P('M19.6,40.4 L28.4,40.4 L28.4,41.6 L19.6,41.6 Z', K.coatS, 0.5) + P('M23.1,40.1 L24.9,40.1 L24.9,41.9 L23.1,41.9 Z', 'none', 0.45).replace('fill="none"', `fill="${K.brass}"`);
  } else {
    s += P(OUTLINE, K.coat) + clip(`${u}c`, OUTLINE, fabric) + P(OUTLINE, 'none');
    if (M.hem === 'torn') for (const [x, y] of torn.tips) s += P(`M${r2(x)},${r2(y - 0.2)} q0.45,0.8 -0.1,1.7`, 'none', 0.45);
    if (dos) {
      if (t === 'vareuse') {
        // la vareuse de dos : la fente du bas, la martingale boutonnée
        s += P(`M24,41.6 L24,${r2(hy + 1.6)}`, 'none', 0.7) + P('M18.4,40.6 L29.6,40.6 L29.6,42.2 L18.4,42.2 Z', K.coatS, 0.55);
        for (const x of [19.6, 28.4]) s += E(x, 41.4, 0.55, 0.55, K.brass, 0.4);
      } else {
        // le ciré de dos : la couture d'empiècement, la couture du milieu, la capuche posée pliée sur les épaules
        s += `<path d="M15.8,36.2 Q24,37.8 32.2,36.2" fill="none" stroke="${OUT}" stroke-width="0.5" opacity=".45"/>` + P(`M24,37.4 L24,${r2(hy + 1.6)}`, 'none', 0.7);
        s += capucheRabattue(u, 'ne', reperes(c), K.coat, K.coatS);
      }
    } else if (t === 'ouvert') {
      // le ciré ouvert : la marinière entre les deux pans, rayures qui suivent le buste, l'ombre du pan droit sur elle
      const MA = `M${r2(o - 3)},32.2 Q${o},31.4 ${r2(o + 3)},32.2 L${r2(o + 3.4)},${hy + 1.6} Q${o},${hy + 2.4} ${r2(o - 3.4)},${hy + 1.6} Z`;
      const raies = [34.4, 36.8, 39.2, 41.6, 44, 46.4].map(y => `<path d="M${r2(o - 5)},${y} Q${o},${r2(y + 0.9)} ${r2(o + 5)},${y}" fill="none" stroke="${K.stripe}" stroke-width="1.1"/>`).join('');
      s += P(MA, K.shirt) + clip(`${u}ma`, MA, raies + `<path d="M${r2(o + 1.8)},31 L${r2(o + 3.4)},31 L${r2(o + 3.6)},${hy + 3} L${r2(o + 1.4)},${hy + 3} Z" fill="${OUT}" opacity=".16"/>` + salt) + P(MA, 'none');
      // les revers : le dessous du ciré, plus sombre, rabattu de chaque côté du col
      s += `<g transform="translate(${dx} 0)">${P('M21,32.2 Q18.4,34.6 18.8,38.6 L21.8,36 Z', K.coatS, 0.7)}${P('M27,32.2 Q29.6,34.6 29.2,38.6 L26.2,36 Z', K.coatS, 0.7)}</g>`;
    } else if (t === 'vareuse') {
      // la veste de quart croisée : col et revers en V, deux rangs de boutons de laiton, poches à rabat
      s += `<g transform="translate(${dx} 0)">${P('M20.2,32 L23.6,38.4 L22.4,38.6 L18.8,34.6 Z', K.coatS, 0.7)}${P('M27.8,32 L24.4,38.4 L25.6,38.6 L29.2,34.6 Z', K.coatS, 0.7)}${P(`M24,38.4 L24,${r2(hy + 1.6)}`, 'none', 0.7)}</g>`;
      for (const y of [39.8, 42.8]) for (const x of [22 + dx, 26.6 + dx]) s += E(x, y, 0.62, 0.62, K.brass, 0.45) + E(x - 0.2, y - 0.2, 0.2, 0.2, K.brassH, 0);
      for (const [a, b] of V.poches) s += P(`M${a},41.6 L${b},41.4 L${b + 0.1},42.9 L${a + 0.2},43.1 Z`, K.coatS, 0.55);
    } else {
      // le ciré fermé : la patte de boutonnage, trois boutons de bois en olive
      const sl = view === 'se' ? -0.6 : 0;
      s += P(`M${o},33.2 L${r2(o + sl)},${r2(hy + 1.9)}`, 'none', 0.9);
      for (const y of [37, 41, 45]) s += `<rect x="${r2(o + 0.8 + sl * (y - 33) / 15)}" y="${y - 0.45}" width="2" height="0.9" rx="0.45" fill="${K.rope}" stroke="${OUT}" stroke-width="0.5"/>`;
    }
    // la pièce du bas, sur le pan gauche de l'écran (le pan droit porte la longue-vue) ; de dos, à droite
    if (M.hem === 'mended') {
      // (à l'écart de la marinière du ciré ouvert)
      const px = dos ? 27.2 : view === 'se' ? 14.2 : 16.4;
      s += reflet(o, P(`M${px},${r2(hy - 4.4)} L${r2(px + 3.6)},${r2(hy - 4.6)} L${r2(px + 3.8)},${r2(hy - 1.4)} L${r2(px + 0.2)},${r2(hy - 1.2)} Z`, K.patch2, 0.55) + seam(`M${r2(px + 0.55)},${r2(hy - 3.9)} L${r2(px + 3.1)},${r2(hy - 4.05)} L${r2(px + 3.25)},${r2(hy - 1.85)} L${r2(px + 0.7)},${r2(hy - 1.7)} Z`, 0.38), !!c.miroir);
    }
  }
  if (t === 'chemise') s += `<path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${OUT}" stroke-width="2.3"/><path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${K.rope}" stroke-width="1.3"/><path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${K.ropeS}" stroke-width="1.3" stroke-dasharray=".5 1"/>`;
  const mir = !!c.miroir;
  if (M.patch) s += reflet(o, patch(K, V.patch), mir);
  // la longue-vue reste à la hanche, sauf quand elle la porte à l'œil (l'action d'aster.js) ou qu'elle a les mains prises
  if ((ctx.pose !== 'action' || c.geste) && !c.sansLongueVue) s += reflet(o, spyglass(K, V.glass), mir);
  if (M.rope) s += reflet(o, ropeBand(K, V.rope), mir);
  // trempée : des gouttes tombent du bas du vêtement, en continu
  if (M.wet) {
    s += [[16.4, 0], [22.6, 0.55], [31.2, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 2)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 2)};${r2(hy + 9)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('');
  }
  return s;
}

// La chaussure, avec la boue de l'état : le bas du pantalon taché (dans son contour), des éclaboussures sur le cuir
function pied(c, x, y, dir, tilt) {
  const M = marks(c), K = pal(c);
  let s = '';
  // la boue remonte en éclaboussures sur le bas du pantalon, plus haut d'un côté
  const a = r2(x - c.legW / 2 + 0.55), b = r2(x + c.legW / 2 - 0.55);
  if (M.dirt) s += `<path d="M${a},${r2(y + 0.6)} L${a},${r2(y - 1.4)} Q${r2(x - 1.2)},${r2(y - 2.8)} ${r2(x - 0.2)},${r2(y - 1.6)} Q${r2(x + 0.8)},${r2(y - 0.6)} ${b},${r2(y - 2.2)} L${b},${r2(y + 0.6)} Z" fill="${K.mud}" opacity="${r2(0.5 * M.dirt)}"/>` + E(x - 0.9, y - 3.5, 0.32, 0.32, K.mud, 0).replace('/>', ` opacity="${r2(0.55 * M.dirt)}"/>`);
  s += shoe(c, x, y, dir, tilt);
  if (M.dirt) s += `<path d="M${r2(x - 2.8)},${r2(y + 3.2)} Q${r2(x - 1)},${r2(y + 2.2)} ${r2(x + 0.6)},${r2(y + 3.6)} Q${r2(x - 1)},${r2(y + 4.6)} ${r2(x - 2.8)},${r2(y + 3.2)} Z" fill="${K.mud}" opacity="${r2(0.8 * M.dirt)}"/>`
    + E(x + 1.6, y + 1.4, 0.42, 0.42, K.mud, 0).replace('/>', ` opacity="${r2(0.8 * M.dirt)}"/>`) + E(x + 2.3, y + 2.4, 0.26, 0.26, K.mud, 0).replace('/>', ` opacity="${r2(0.8 * M.dirt)}"/>`);
  return s;
}

const lorena = {
  ...aster,
  name: 'Lorena', uid: 'lo',
  sleeve: C.coat,
  teintes: [C.hair, C.coat, C.scarf, C.brass, C.rope],

  foot: pied,
  // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  // ses manches, dans toutes les vues et tous les gestes (lorena_bras.js)
  bras: fabriquerBras({ pal, marks }),

  // la capuche rabattue du ciré (rien pour la vareuse ni la chemise), aux couleurs de la palette
  backItems(c, ctx) {
    const K = pal(c), t = c.tenue || 'cire';
    if (ctx.view === 'ne' || t === 'vareuse' || t === 'chemise') return '';
    return recolor(aster.backItems(c, ctx), { [AST.coat]: K.coat, [AST.coatS]: K.coatS });
  },

  // le foulard, à la couleur de l'état (l'eau le fonce)
  neck(c, ctx) {
    const K = pal(c);
    return recolor(aster.neck(c, ctx), { [AST.scarf]: K.scarf, [AST.scarfS]: K.scarfS });
  },

  body(c, ctx) {
    return torse(c, ctx, pal(c), marks(c));
  },

  head(c, ctx) {
    if (ctx.view === 'ne') return teteDeDos(c, ctx);
    const V = VUES[ctx.view] || VUES.front, X = V.X;
    const name = ALIAS[ctx.expr] || ctx.expr;
    // au repos, une image sur quatre, elle cligne des yeux
    const ex = ctx.eyeMode === 'wink' ? EXPR.visee : ctx.blink && name === 'veille' ? EXPR.cligne : EXPR[name] || EXPR.veille;
    const C = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`;
    let s = '';
    // queue de cheval : deux mèches au vent, nouée d'un bout de foulard ; les épis du dessus au vent
    const mir = !!c.miroir;
    s += queue(C, mir) + epis(C, mir);
    // cheveux de derrière, ombrés, liseré de brume à droite ; de trois quarts, l'oreille lointaine
    s += P(V.back, C.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24" width="32" height="9" fill="${C.hairS}"/><path d="M35.4,10 Q38.6,18 36.4,30 L40,30 L40,10 Z" fill="${C.rim}" opacity=".85" transform="translate(${V.hdx} 0)"/>`) + P(V.back, 'none');
    if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, C.skin) + P(`M${r2(V.ear[0] + 0.1)},${r2(V.ear[1] - 1)} Q${r2(V.ear[0] + 0.8)},${V.ear[1]} ${r2(V.ear[0] + 0.1)},${r2(V.ear[1] + 1)}`, 'none', 0.5);
    // le visage : un menton à peine marqué ; ombre sous la frange, contre-jour et ombre du côté droit, joues, rousseur
    const fr = [[17.6, 24.9], [18.8, 25.6], [16.6, 25.4], [29.4, 25.6], [28.4, 25]];
    s += P(V.face, C.skin);
    s += clip(`${id}f`, V.face, `<path d="${V.bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + `<g transform="translate(${V.dx} 0)"><path d="M33.4,14 Q36.6,22 32.4,31.6 L37,31.6 L37,14 Z" fill="${C.rim}" opacity=".55"/><path d="M31.8,13 Q35,21 31.2,31 L33.6,31 Q37,21 33.6,13 Z" fill="${C.skinS}" opacity=".45"/></g>`
      + E(X(16.8), 26.6, 1.8, 1, C.cheek, 0).replace('/>', ' opacity=".55"/>') + E(X(31.2), 26.6, 1.8 * V.rk[1], 1, C.cheek, 0).replace('/>', ' opacity=".55"/>')
      + fr.map(([x, y]) => E(X(x), y, 0.36, 0.36, C.freckle, 0)).join(''));
    s += P(V.face, 'none');
    // le sparadrap de toile sur sa pommette gauche (à droite de l'écran de face)
    // (en miroir, sur l'autre joue : de trois quarts, la joue proche, à sa largeur)
    const joue = mir ? [X(16.8), V.rk[0]] : [X(31.2), V.rk[1]];
    if (M.plaster) s += `<g transform="translate(${r2(joue[0])} 27.2) scale(${mir ? -joue[1] : joue[1]} 1) translate(-31.2 -27.2)"><g transform="rotate(-24 31.2 27.2)">${P('M29.2,26.4 L33.2,26.4 Q33.6,26.4 33.6,26.8 L33.6,27.6 Q33.6,28 33.2,28 L29.2,28 Q28.8,28 28.8,27.6 L28.8,26.8 Q28.8,26.4 29.2,26.4 Z', C.cloth, 0.5)}${P('M30.5,26.4 L31.9,26.4 L31.9,28 L30.5,28 Z', C.clothS, 0)}</g></g>`;
    // le nez : une ombre ; la bouche
    s += `<g transform="translate(${V.nose} 0)">${P('M24.3,24.9 Q25,25.6 24.5,26 Q24.1,25.9 24,25.6 Z', C.skinS, 0)}</g>`;
    s += mouth(ex.mouth, V.mouth, 27.6, `${id}m`);
    // la frange : mèches inégales poussées par le vent, reflet en arc, ombre au bas, du sel
    s += P(V.bangs, C.hair);
    s += clip(`${id}b`, V.bangs, `<g transform="translate(${V.dx * 0.7} 0)"><path d="M15,12.4 Q24,8.4 33,12.4 L31.7,13 L30.4,12 L29,13 L27.4,11.8 L25.8,12.8 L24,11.6 L22.4,12.8 L20.8,11.8 L19.2,13 L17.8,12 L16.4,13 Z" fill="${C.hairH}" opacity=".85"/></g>`
      + `<path d="M11,17 Q24,13.6 37,17 L37,20 L11,20 Z" fill="${C.hairS}" opacity=".45"/>`);
    s += P(V.bangs, 'none');
    if (M.salt) s += E(X(18.6), 10.8, 0.35, 0.35, C.salt, 0) + E(X(28.8), 10.4, 0.3, 0.3, C.salt, 0) + E(X(31.4), 13.2, 0.28, 0.28, C.salt, 0);
    // une trace de terre sur sa joue droite, sous les taches de rousseur
    if (M.dirt) s += reflet(X(24), `<ellipse cx="${X(18.2)}" cy="28.3" rx="1.3" ry="0.6" fill="${C.mud}" opacity="${r2(0.5 * M.dirt)}" transform="rotate(-14 ${X(18.2)} 28.3)"/><ellipse cx="${X(19.7)}" cy="28.9" rx="0.4" ry="0.3" fill="${C.mud}" opacity="${r2(0.45 * M.dirt)}"/>`, mir);
    if (M.wet) s += gouttesQueue(mir);
    // sourcils par-dessus la frange, puis les yeux
    s += brow(X(19.4), 18.6, 1, ex.browL || ex.brow, !mir, V.rk[0]) + brow(X(28.6), 18.6, -1, ex.browR || ex.brow, mir, V.rk[1]);
    s += eye(`${id}e0`, X(19.4), 22.7, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }) + eye(`${id}e1`, X(28.6), 22.7, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] });
    s += extras(ex.extras, ctx.n % 2, X);
    return s;
  }
};

// La queue de cheval : deux mèches au vent et le nœud de foulard ; de dos, la même, de l'autre côté de la tête
const QUEUE = [
  ['M33.6,11.4 Q40.6,9.2 44.2,13 Q41.6,13 41,15.6 Q38.6,14 36,16.8 Q35.6,13.4 33.6,11.4 Z', 'M33.6,11.4 Q40.4,10.2 43.4,15.4 Q40.8,14.6 40.2,17.2 Q38,15.2 36,16.8 Q35.6,13.4 33.6,11.4 Z', 'hair', 1, '0s'],
  ['M34.4,14.4 Q38.8,15.4 40.4,19.6 Q38.2,18 35.8,18.4 Z', 'M34.4,14.4 Q38.4,16.4 39.2,21 Q37.4,18.8 35.8,18.4 Z', 'hairS', 0.9, '-.4s']
];
const miroir = d => d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (m, x, y) => `${r2(48 - +x)},${y}`);
function queue(C, dos = false) {
  const f = dos ? miroir : d => d;
  return QUEUE.map(([a, b, col, w, begin]) => wind(f(a), f(b), C[col], w, '1.7s', begin)).join('') + E(dos ? 13.4 : 34.6, 13.4, 1.4, 1.3, C.scarf, 0.9);
}
// Les épis du dessus de la tête, au vent ; en miroir, de l'autre côté
const epis = (C, mir) => { const f = mir ? miroir : d => d; return wind(f('M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z'), f('M23.4,7.8 Q27.8,2.4 34.8,5 Q30.2,5.4 27.8,8.8 Z'), C.hair, 1, '1.7s', '-.2s') + P(f('M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z'), C.hair); };
// trempée : deux gouttes tombent du bout de la queue de cheval, en continu
const gouttesQueue = dos => [[41.4, 16, 0], [39.8, 20, 0.8]].map(([x0, y, d]) => { const x = dos ? r2(48 - x0) : x0; return `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 7}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`; }).join('');

// La tête de dos : la masse des cheveux, la nuque, la queue de cheval à gauche de l'écran, le reflet en arc, le contre-jour
function teteDeDos(c, ctx) {
  const C = pal(c), M = marks(c), id = `${c.uid}ne${ctx.expr}`;
  const back = 'M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z';
  const mir = !!c.miroir;
  let s = epis(C, mir) + E(mir ? 35.4 : 12.6, 23, 1.6, 2.2, C.skin);
  s += P(back, C.hair) + clip(`${id}h`, back, `<rect x="8" y="4" width="34" height="32" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C.hair}"/>`
    + `<path d="M15,12.6 Q24,8.6 33,12.6 L31.7,13.2 L30.4,12.2 L29,13.2 L27.4,12 L25.8,13 L24,11.8 L22.4,13 L20.8,12 L19.2,13.2 L17.8,12.2 L16.4,13.2 Z" fill="${C.hairH}" opacity=".85"/>`
    + `<path d="M35.6,10 Q38.8,20 35.8,32 L40,32 L40,10 Z" fill="${C.rim}" opacity=".85"/>`) + P(back, 'none');
  // les mèches de la nuque, qui tombent en pointes
  s += P('M17,11 Q24,7.6 31,11', 'none', 0.8) + P('M19.6,12.6 Q18.8,20 20.4,27.6', 'none', 0.6) + P('M24.4,11.8 Q25.2,19.4 24.2,28.4', 'none', 0.6) + P('M28.8,12.8 Q30,20 28.6,27.4', 'none', 0.5);
  if (M.salt) s += E(18.8, 10.6, 0.35, 0.35, C.salt, 0) + E(27.6, 9.8, 0.3, 0.3, C.salt, 0) + E(31.2, 14, 0.28, 0.28, C.salt, 0);
  s += queue(C, !mir);
  if (M.wet) s += gouttesQueue(!mir);
  const ex = EXPR[ALIAS[ctx.expr] || ctx.expr] || EXPR.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

// La géométrie du visage selon la vue : de face ; de trois quarts avant (tournée vers la gauche de l'écran : les traits
// glissent vers la gauche, l'œil et la joue lointains se resserrent, l'oreille lointaine paraît)
const VUES = {
  front: {
    X: x => x, dx: 0, hdx: 0, rk: [1, 1], nose: 0, mouth: 24, ear: null,
    face: 'M12.4,21.6 C12.4,15 17.6,11.2 24,11.2 C30.4,11.2 35.6,15 35.6,21.6 C35.6,27 31.8,31 27,32 Q24,32.7 21,32 C16.2,31 12.4,27 12.4,21.6 Z',
    back: 'M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z',
    bangs: 'M12,18.8 Q12.6,8 24,7.8 Q35.4,8 36,18.4 L34.3,15.4 L33.4,19.8 L30.6,14.2 L28.8,18.9 L25.8,13.6 L24.3,19.4 L21.7,14 L19.6,18.5 L17.3,14.6 L15.4,19.7 L14.1,16.4 Z'
  },
  se: {
    X: x => r2(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), dx: -1.8, hdx: 0.4, rk: [0.95, 0.82], nose: -4, mouth: 20.9, ear: [35, 23.2],
    face: 'M11.4,21.6 C11.4,15 16.4,11.2 22.6,11.2 C28.8,11.2 33.8,15 33.8,21.6 C33.8,27.2 30,31.2 25.2,32.1 Q21.6,32.8 18.8,31.6 C14.4,30 11.4,26.4 11.4,21.6 Z',
    back: 'M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z',
    bangs: 'M11.6,19.2 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L33.2,15 L32,18.8 L29.2,13.8 L27.4,18.4 L24.6,13.4 L22.6,19.2 L20.2,13.8 L18.2,18.4 L16,14.4 L14.2,19.6 L12.9,16.6 Z'
  }
};

module.exports = { lorena, EXPR, C, MARKS };
