// Lot M — les égarés (HISTOIRE § 6.15) : les petites créatures que la brume laisse sortir la nuit. Petits fantômes,
// petits zombies tout mous, et une bête de brume par climat (une bête du climat, faite de brume gris-bleu, les yeux qui
// luisent). Grognons plus que méchants, toujours choupis : ni coup, ni mal. Repoussés, ils boudent et retournent dans
// la brume, ou se changent en lucioles.
// Vues de la troupe et des bêtes orientées (lot H) : « avant » (il vient vers le bas à droite) et « dos » (il s'éloigne
// vers le haut à droite) ; le miroir donne les deux autres directions. Ancre (0, 0) au sol sous l'égaré.
// Poses : marche1, marche2, repos ; bouderie1, bouderie2 (on l'a touché : il recule, boude) ; fuite1, fuite2 (devant
// Anya) ; luciole1 à luciole4 (une lumière le change en luciole) ; brume1 à brume3 (il retourne dans la brume).
const { OUT, P, E, L, clip, r2 } = require('./troupe');
const Bt = require('./betes');
const { quad3, bird3 } = require('./betes3');
const { hsl, hex } = require('../personnages/avatar_choix');

// La famille de la brume : un trait bleu nuit (au lieu du brun de l'île), des gris-bleu
const BRUME = { clair: '#F2F5FB', corps: '#DDE5F1', ombre: '#B8C5DB', creux: '#93A3C1', trait: '#3B4763', oeil: '#2E3550', joue: '#F2B6C4', lueur: '#FFE58A' };
const SOL = 'rgba(60,75,110,.2)';
const POSES = {
  avant: ['marche1', 'marche2', 'repos', 'bouderie1', 'bouderie2', 'fuite1', 'fuite2', 'luciole1', 'luciole2', 'luciole3', 'luciole4', 'brume1', 'brume2', 'brume3'],
  dos: ['marche1', 'marche2', 'repos', 'fuite1', 'fuite2']
};
const contour = s => s.split(OUT).join(BRUME.trait);

// ---- petits morceaux communs ----
// Halo de lumière (cercles de plus en plus pâles, sans dégradé : rien à renommer d'un SVG à l'autre)
const halo = (x, y, r, rgb = '255,240,170', a = 0.5) => [1, 0.7, 0.45].map((k, i) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * k)}" fill="rgba(${rgb},${r2(a * (0.35 + i * 0.3))})"/>`).join('');
// Volute de brume (un petit tourbillon)
const volute = (x, y, s = 1, flip = false) => {
  const k = flip ? -s : s;
  return `<path d="M${r2(x)},${r2(y)} q${r2(1.8 * k)},${r2(-1.6 * s)} ${r2(3.4 * k)},${r2(-0.5 * s)} q${r2(0.9 * k)},${r2(0.9 * s)} ${r2(-0.3 * k)},${r2(1.4 * s)} q${r2(-0.9 * k)},${r2(0.2 * s)} ${r2(-0.9 * k)},${r2(-0.6 * s)}" fill="none" stroke="${BRUME.ombre}" stroke-width="${r2(0.9 * s)}" stroke-linecap="round"/>`;
};
// Ombre au sol : une flaque de brume
const flaque = (rx, ry = 1.5) => `<ellipse cx="0" cy="0.2" rx="${r2(rx)}" ry="${r2(ry)}" fill="${SOL}"/>`;
// Étincelle (quatre branches)
const etincelle = (x, y, s = 1) => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="0.35"/>`;
// Petit nuage de bouderie (« hmpf »)
const hmpf = (x, y, s = 1) => [[0, 0, 1.3], [1.5, -0.6, 1], [2.6, 0.2, 0.75]].map(([dx, dy, r]) => E(x + dx * s, y + dy * s, r * s, r * s, BRUME.clair, 0.6)).join('');
// Goutte de peur
const goutte = (x, y) => P(`M${x},${r2(y - 1.6)} Q${r2(x + 1.1)},${r2(y - 0.2)} ${x},${r2(y + 0.5)} Q${r2(x - 1.1)},${r2(y - 0.2)} ${x},${r2(y - 1.6)} Z`, '#BFE3F6', 0.6);
// Sourcils froncés au-dessus de deux yeux (le bout intérieur plus bas)
const froncer = (eyes, w = 0.75) => {
  const mid = (eyes[0][0] + eyes[eyes.length - 1][0]) / 2;
  return eyes.map(([x, y, rx, ry]) => {
    const inner = x < mid ? 1 : -1;
    return L([x - inner * rx * 1.3, y - ry * 1.75], [x + inner * rx * 1.05, y - ry * 1.25], BRUME.trait, w);
  }).join('');
};
// Yeux selon l'humeur : ouverts, fermés de bouderie (> <), apaisés (^ ^), grands de peur
function yeux(eyes, mode, color = BRUME.oeil) {
  return eyes.map(([x, y, rx, ry], i) => {
    if (mode === 'boude') {
      const d = i === 0 ? 1 : -1;
      return P(`M${r2(x - d * rx)},${r2(y - ry * 0.8)} L${r2(x + d * rx * 0.8)},${r2(y)} L${r2(x - d * rx)},${r2(y + ry * 0.8)}`, 'none', 0.8);
    }
    if (mode === 'apaise') return P(`M${r2(x - rx)},${r2(y + ry * 0.2)} Q${x},${r2(y - ry * 0.9)} ${r2(x + rx)},${r2(y + ry * 0.2)}`, 'none', 0.8);
    if (mode === 'peur') return E(x, y, rx * 1.3, ry * 1.2, '#FFFFFF', 0.7) + E(x + rx * 0.2, y + ry * 0.1, rx * 0.45, ry * 0.45, color, 0);
    return E(x, y, rx, ry, color, 0) + E(x + rx * 0.3, y - ry * 0.4, rx * 0.36, rx * 0.36, '#FFFFFF', 0);
  }).join('');
}
const pose2 = pose => ({
  marche: pose === 'marche1' || pose === 'marche2', n: pose === 'marche2' || pose === 'fuite2' || pose === 'bouderie2' ? 1 : 0,
  boude: pose.startsWith('bouderie'), fuit: pose.startsWith('fuite'), luciole: pose.startsWith('luciole') ? +pose.slice(7) : 0,
  brume: pose.startsWith('brume') ? +pose.slice(5) : 0
});

// La fin commune : une lumière change l'égaré en luciole (1 : il s'apaise et luit ; 2 : il rapetisse ; 3 : une boule de
// lumière ; 4 : la luciole s'envole), ou il retourne dans la brume (1 à 3 : il pâlit et s'effiloche en volutes)
function finir(body, p, cy) {
  if (p.luciole === 1) return halo(0, cy, 13, '255,240,170', 0.45) + body;
  if (p.luciole === 2) return halo(0, cy, 11, '255,240,170', 0.6) + `<g transform="translate(0 ${r2(cy * 0.35)}) scale(0.65)">${body}</g>` + etincelle(-6, cy - 5, 0.8) + etincelle(6.4, cy + 2, 0.7);
  if (p.luciole === 3) return halo(0, cy - 2, 8, '255,240,170', 0.7) + E(0, cy - 2, 2.6, 2.6, '#FFF3A0', 0.7) + etincelle(-4.4, cy - 6, 0.9) + etincelle(4.6, cy + 1, 0.7) + etincelle(3.4, cy - 8, 0.5) + volute(-6, -2, 0.8) + volute(4, -1, 0.7, true);
  if (p.luciole === 4) return `<g transform="translate(0 ${r2(cy - 6)}) scale(1.4)">${Bt.firefly('vol1')}</g>` + etincelle(-3.6, cy - 1, 0.6) + volute(-3, -1.4, 0.6);
  if (p.brume) {
    const a = [0, 0.7, 0.4, 0][p.brume];
    const w = [0, 1, 1.2, 1.4][p.brume];
    return (a ? `<g opacity="${a}">${body}</g>` : '') + volute(-7, cy + 4, w) + volute(3, cy + 7, w * 0.9, true) + volute(-2, cy - 3 - p.brume * 2, w * 0.8) + (p.brume > 1 ? volute(5, cy - 6 - p.brume, w * 0.7, true) : '');
  }
  return body;
}

// ---- le petit fantôme : un drap tout rond qui flotte, les sourcils froncés ----
function fantome(view, pose) {
  const avant = view === 'avant', p = pose2(pose);
  const dy = (p.marche || p.fuit ? [0, -1][p.n] : 0) - (pose === 'repos' ? 0.4 : 0);
  // penché en arrière quand il boude, en avant quand il fuit
  const lean = p.boude ? (p.n ? -14 : -9) : p.fuit ? 10 : 0;
  const top = -20.4 + dy, hem = -4.2 + dy, w = p.fuit ? 6 : 6.5;
  const ph = (p.n + (p.fuit ? 1 : 0)) % 2;
  let d = `M${-w},${r2(-9 + dy)} Q${r2(-w - 0.4)},${r2(top)} 0,${r2(top - 0.2)} Q${r2(w + 0.4)},${r2(top)} ${w},${r2(-9 + dy)} L${r2(w + 0.2)},${r2(hem)}`;
  for (let i = 0; i < 5; i++) {
    const x0 = w + 0.2 - i * (2 * w + 0.4) / 5, x1 = x0 - (2 * w + 0.4) / 5;
    d += ` Q${r2((x0 + x1) / 2)},${r2(hem + ((i + ph) % 2 ? 1.9 : 1.1))} ${r2(x1)},${r2(hem)}`;
  }
  d += ' Z';
  // la traîne : derrière lui, à l'opposé de sa route (en haut à gauche s'il vient vers nous, en bas à gauche s'il s'éloigne)
  const flick = p.n ? 1 : 0;
  const far = p.fuit ? 1.6 : 0;
  const tail = avant
    ? `M${r2(-w + 1)},${r2(hem - 0.8)} Q${r2(-w - 2.6 - far)},${r2(hem + 0.2)} ${r2(-w - 4 - far)},${r2(hem - 2.4 + flick)} Q${r2(-w - 4.8 - far)},${r2(hem - 4.8 + flick)} ${r2(-w - 2.8 - far)},${r2(hem - 4.6 + flick)} Q${r2(-w - 3.2 - far)},${r2(hem - 3.2 + flick)} ${r2(-w - 1.4)},${r2(hem - 3.8)} L${r2(-w + 0.6)},${r2(hem - 5)} Z`
    : `M${r2(-w + 1)},${r2(hem - 3.4)} Q${r2(-w - 2.6 - far)},${r2(hem - 3.2)} ${r2(-w - 4 - far)},${r2(hem - 0.6 - flick)} Q${r2(-w - 4.4 - far)},${r2(hem + 1.8 - flick)} ${r2(-w - 2.4 - far)},${r2(hem + 1.4 - flick)} Q${r2(-w - 2.8 - far)},${r2(hem - 0.2 - flick)} ${r2(-w - 1)},${r2(hem + 0.2)} L${r2(-w + 1.4)},${r2(hem + 0.4)} Z`;
  // les petits bras : deux bosses, levés quand il a peur, croisés devant quand il boude (de face)
  const armY = p.fuit ? -13 + dy : -9.6 + dy;
  const arms = p.boude
    ? E(-w - 0.2, -7.4 + dy, 1.5, 1, BRUME.corps, 0.9) + E(w + 0.3, -7.6 + dy, 1.3, 0.9, BRUME.corps, 0.9)
    : E(-w - 0.4, armY, 1.7, 1.1, BRUME.corps, 0.9).replace('<ellipse', `<ellipse transform="rotate(${p.fuit ? -40 : 30} ${r2(-w - 0.4)} ${r2(armY)})"`)
      + E(w + 0.5, armY - 0.4, 1.5, 1, BRUME.corps, 0.9).replace('<ellipse', `<ellipse transform="rotate(${p.fuit ? 40 : -30} ${r2(w + 0.5)} ${r2(armY - 0.4)})"`);
  let b = P(tail, BRUME.corps, 0.9) + arms + P(d, BRUME.corps)
    + clip(`fa${view}${pose}`, d, `<ellipse cx="${r2(w - 0.4)}" cy="${r2(-8 + dy)}" rx="5.2" ry="13" fill="${BRUME.ombre}"/><path d="M-9,${r2(hem - 0.6)} Q0,${r2(hem - 2.6)} 9,${r2(hem - 0.6)} L9,${r2(hem + 3)} L-9,${r2(hem + 3)} Z" fill="${BRUME.ombre}" opacity="0.6"/>`)
    + P(d, 'none') + L([-4.2, -15.4 + dy], [-2.2, -18.2 + dy], BRUME.clair, 1.3);
  if (avant) {
    // le visage, tourné vers le bas à droite : l'œil proche à gauche, un peu plus grand
    const eyes = [[0.9, -12.6 + dy, 0.95, 1.25], [4.3, -12.8 + dy, 0.82, 1.12]];
    const mode = p.boude ? 'boude' : p.fuit ? 'peur' : p.luciole ? 'apaise' : 'ouvert';
    b += E(-0.9, -10.4 + dy, p.boude ? 1.6 : 1.2, p.boude ? 1 : 0.7, BRUME.joue, 0) + E(5.5, -10.6 + dy, p.boude ? 1.2 : 0.9, p.boude ? 0.8 : 0.6, BRUME.joue, 0);
    b += yeux(eyes, mode);
    if (mode === 'ouvert') b += froncer(eyes);
    b += p.fuit ? E(2.7, -9.6 + dy, 0.7, 0.9, BRUME.oeil, 0)
      : p.boude ? P(`M2,${r2(-9.9 + dy)} Q2.7,${r2(-9.3 + dy)} 3.4,${r2(-9.9 + dy)}`, 'none', 0.7)
      : p.luciole ? P(`M1.8,${r2(-10 + dy)} Q2.7,${r2(-9.2 + dy)} 3.6,${r2(-10 + dy)}`, 'none', 0.7)
        : P(`M1.8,${r2(-9.5 + dy)} Q2.7,${r2(-10.2 + dy)} 3.6,${r2(-9.5 + dy)}`, 'none', 0.7);
    // il boude : les bras croisés devant, un petit nuage
    if (p.boude) b += hmpf(-6.6, -18.4 + dy - p.n * 1.4, 0.9 + p.n * 0.2);
    if (p.fuit) b += goutte(6.8, -16.4 + dy);
  } else {
    // de dos : un pli du drap
    b += P(`M-1.6,${r2(-17 + dy)} Q-3,${r2(-12 + dy)} -2,${r2(-7 + dy)}`, 'none', 0.5);
    if (p.fuit) b += goutte(6.4, -17.6 + dy);
  }
  if (lean) b = `<g transform="rotate(${lean} 0 ${r2(hem)})">${b}</g>`;
  return contour(flaque(p.fuit ? 4.2 : 4.6, 1.3) + finir(b, p, -12));
}

// ---- le petit zombie tout mou : une bouille ronde, les paupières lourdes, les bras tendus tout mous ----
const ZO = { peau: '#BCD2A4', peauS: '#9BB585', tunique: '#A9A6C6', tuniqueS: '#8C88AE', piece: '#E2D3A6', joue: '#EAA9B6' };
const bras = (a, c1, b, col) => `<path d="M${r2(a[0])},${r2(a[1])} Q${r2(c1[0])},${r2(c1[1])} ${r2(b[0])},${r2(b[1])}" fill="none" stroke="${OUT}" stroke-width="4.4" stroke-linecap="round"/><path d="M${r2(a[0])},${r2(a[1])} Q${r2(c1[0])},${r2(c1[1])} ${r2(b[0])},${r2(b[1])}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>`;
function zombie(view, pose) {
  const avant = view === 'avant', p = pose2(pose);
  // il se dandine en marchant (le corps penche d'un côté puis de l'autre)
  const tilt = p.marche ? [-5, 5][p.n] : p.fuit ? [-7, 7][p.n] : 0;
  const lean = p.boude ? (p.n ? -12 : -8) : p.fuit ? 6 : 0;
  const lift = p.marche || p.fuit ? [[0, -1.2], [-1.2, 0]][p.n] : [0, 0];
  const sq = pose === 'repos' ? 0.4 : 0;
  let b = flaque(5.4, 1.6);
  // les jambes courtes et les pieds ronds
  const legs = avant ? [[-1.8, -0.6 + lift[0]], [2.6, -1.4 + lift[1]]] : [[-2.2, -1.4 + lift[0]], [2.2, -0.6 + lift[1]]];
  const far = avant ? 1 : 0;
  const leg = ([x, y]) => bras([x * 0.7, -4.4], [x * 0.8, (y - 4.4) / 2], [x, y - 0.6], ZO.peau) + E(x + (avant ? 0.6 : 0.2), y, 1.6, 1.1, ZO.peau, 0.9);
  b += leg(legs[far]);
  let g = '';
  // les bras tendus (vers le bas à droite de face, vers le haut à droite de dos), mous : ils pendent un peu
  const up = p.fuit ? -4.6 : 0, droop = pose === 'repos' ? 1.2 : 0;
  const farArm = avant ? bras([2.8, -10.6], [5.4, -10.8 + up], [7, -9.6 + up + droop], ZO.peau) + E(7.3, -9.3 + up + droop, 1.5, 1.4, ZO.peau, 0.9)
    : bras([3.6, -10.6], [5.4, -11.8 + up], [6.4, -12.8 + up], ZO.peau) + E(6.6, -13 + up, 1.4, 1.3, ZO.peau, 0.9);
  if (!p.boude) g += farArm;
  // la tunique, effilochée au bas, une pièce cousue
  const tun = `M-4.6,-4.2 Q-5.8,-9.6 -3.4,-11.4 Q0,-12.8 3.6,-11.2 Q5.8,-9.6 4.6,-4.2 L3.6,-3.2 L2.6,-4.2 L1.4,-3 L0.2,-4.1 L-1,-3 L-2.2,-4.1 L-3.4,-3.1 Z`;
  g += P(tun, ZO.tunique) + clip(`zt${view}${pose}`, tun, `<rect x="${avant ? 1.6 : 1.2}" y="-14" width="8" height="12" fill="${ZO.tuniqueS}"/>`) + P(tun, 'none');
  const px = avant ? -2.6 : 0.4;
  g += `<rect x="${px}" y="-8.4" width="2.6" height="2.4" rx="0.3" fill="${ZO.piece}" stroke="${OUT}" stroke-width="0.6"/>`
    + [0.5, 1.3, 2.1].map(k => L([px + k, -8.9], [px + k, -8], OUT, 0.35)).join('');
  // la tête, ronde et grosse
  const hx = avant ? 1.2 : 0, hy = -16.6 + sq;
  const head = `M${r2(hx - 5.8)},${r2(hy)} a5.8,5.2 0 1,0 11.6,0 a5.8,5.2 0 1,0 -11.6,0 Z`;
  g += P(head, ZO.peau) + clip(`zh${view}${pose}`, head, `<ellipse cx="${r2(hx + 4.6)}" cy="${r2(hy + 1)}" rx="4" ry="7" fill="${ZO.peauS}"/>`) + P(head, 'none')
    + L([hx - 3.8, hy - 2.4], [hx - 1.8, hy - 4.2], '#DCE9C8', 1.2);
  // l'épi sur le dessus, et (de face) une petite couture au front
  g += P(`M${r2(hx - 0.6)},${r2(hy - 5)} q0.6,-2.2 2.4,-1.6 q-1.4,0.2 -1.2,1.4`, 'none', 0.8);
  if (avant) {
    g += L([hx - 4, hy - 2.2], [hx - 1.8, hy - 1.4], OUT, 0.5) + [-3.4, -2.6].map(x => L([hx + x, hy - 2.6], [hx + x + 0.3, hy - 1.2], OUT, 0.4)).join('');
    const eyes = [[hx - 0.8, hy + 0.4, 0.95, 1.2], [hx + 2.8, hy + 0.2, 0.82, 1.08]];
    const mode = p.boude ? 'boude' : p.fuit ? 'peur' : p.luciole ? 'apaise' : 'lourd';
    g += E(hx - 2.6, hy + 2.6, p.boude ? 1.5 : 1.1, p.boude ? 0.9 : 0.65, ZO.joue, 0) + E(hx + 4.2, hy + 2.4, p.boude ? 1.1 : 0.85, 0.6, ZO.joue, 0);
    if (mode === 'lourd') {
      // paupières lourdes (penchées vers le milieu : l'air grognon)
      g += yeux(eyes, 'ouvert') + eyes.map(([x, y, rx, ry], i) => {
        const inner = i === 0 ? 1 : -1;
        const a = [x - inner * rx * 1.25, y - ry * 0.55], c = [x + inner * rx * 1.15, y - ry * 0.05];
        return P(`M${r2(a[0])},${r2(a[1])} L${r2(c[0])},${r2(c[1])} L${r2(c[0])},${r2(y - ry * 1.4)} L${r2(a[0])},${r2(y - ry * 1.4)} Z`, ZO.peau, 0) + L(a, c, OUT, 0.75);
      }).join('');
    } else g += yeux(eyes, mode);
    // la bouche : un trait qui tremble, une petite dent
    g += p.fuit ? E(hx + 1, hy + 3.4, 0.7, 0.9, BRUME.oeil, 0)
      : `<rect x="${r2(hx + 0.7)}" y="${r2(hy + 3.2)}" width="0.7" height="0.8" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.3"/>`
        + P(`M${r2(hx - 0.4)},${r2(hy + 3.3)} Q${r2(hx + 0.4)},${r2(hy + 3.8)} ${r2(hx + 1.2)},${r2(hy + 3.2)} Q${r2(hx + 1.8)},${r2(hy + 2.8)} ${r2(hx + 2.4)},${r2(hy + 3.3)}`, 'none', 0.7);
    if (p.fuit) g += goutte(hx + 6.4, hy - 3);
  } else if (p.fuit) g += goutte(hx + 6, hy - 3.4);
  // le bras proche : tendu devant le corps (de face), ou levé (peur), ou ballant (il boude)
  const near = avant ? (p.boude ? bras([-3, -10], [-5, -7.4], [-4.6, -5], ZO.peau) + E(-4.6, -4.8, 1.5, 1.4, ZO.peau, 0.9)
    : bras([-2.6, -9.8], [0.4, -8.6 + up], [3, -7.4 + up + droop], ZO.peau) + E(3.4, -7.1 + up + droop, 1.6, 1.5, ZO.peau, 0.9))
    : bras([-3.6, -10.6], [-4.6, -12 + up], [-4.4, -13.2 + up], ZO.peau) + E(-4.4, -13.4 + up, 1.4, 1.3, ZO.peau, 0.9);
  // de dos, le bras proche passe derrière la tête (il est devant lui, loin de nous)
  g = avant ? g + near : near + g;
  if (p.boude && avant) g += hmpf(hx - 8.4, hy - 6 - p.n * 1.4, 0.9 + p.n * 0.2);
  if (tilt || lean) g = `<g transform="rotate(${tilt + lean} 0 -1)">${g}</g>`;
  b += leg(legs[1 - far]) + g;
  return contour(finir(b, p, -11));
}

// ---- les bêtes de brume : une bête du climat, faite de brume (le dessin des bêtes orientées, recoloré) ----
// Chaque couleur de la bête devient un gris-bleu de même clarté, plus pâle ; les yeux luisent, les sourcils froncent
const brumeDe = c => { const [, s, l] = hsl(c); return hex([222, 0.14 + s * 0.1, 0.6 + l * 0.36]); };
const BETES = {
  tempere: { nom: 'Lapin de brume (tempéré)', spec: () => Bt.Q.rabbit(), oiseau: false, k: 1.1 },
  cimes: { nom: 'Bouquetin de brume (les Cimes)', spec: () => Bt.Q.ibex(), oiseau: false, k: 0.72 },
  landes: { nom: 'Poney de brume (les Landes)', spec: () => Bt.Q.pony(), oiseau: false, k: 0.62 },
  marais: { nom: 'Grenouille de brume (le Marais)', spec: () => Bt.Q.frog(), oiseau: false, k: 1.15 },
  dunes: { nom: 'Fennec de brume (les Dunes)', spec: () => Bt.Q.fennec(), oiseau: false, k: 1.1 },
  jungle: { nom: 'Caméléon de brume (la Jungle)', spec: () => Bt.Q.chameleon(), oiseau: false, k: 1.1 },
  volcan: { nom: 'Salamandre de brume (le Volcan)', spec: () => Bt.Q.salamander(), oiseau: false, k: 1.1 }
};
const POSE_BETE = { marche1: 'marche1', marche2: 'marche2', repos: 'repos', bouderie1: 'clignement', bouderie2: 'clignement', fuite1: 'marche1', fuite2: 'marche2' };
function bete(climat, view, pose) {
  const B = BETES[climat], p = pose2(pose);
  const c = B.spec();
  let s = (B.oiseau ? bird3 : quad3)(c, view, POSE_BETE[pose] || 'repos');
  // l'ombre au sol devient une flaque de brume
  s = s.replace(/fill="rgba\(40,55,20,\.18\)"/g, `fill="${SOL}"`);
  // les yeux : relevés avant la recoloration (ils luisent), puis les sourcils froncés
  const eyes = [];
  s = s.replace(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="#2A2420" stroke="none"\/>/g, (m, x, y, rx, ry) => {
    eyes.push([+x, +y, +rx, +ry]);
    return `<ellipse cx="${x}" cy="${y}" rx="${r2(+rx * 1.05)}" ry="${ry}" fill="@LUEUR@" stroke="${BRUME.trait}" stroke-width="0.45"/>`;
  });
  s = s.split(OUT).join('@TRAIT@').replace(/#[0-9A-Fa-f]{6}\b/g, m => brumeDe(m)).split('@TRAIT@').join(BRUME.trait).split('@LUEUR@').join(BRUME.lueur);
  eyes.sort((a, b) => a[0] - b[0]);
  if (eyes.length && !p.boude && !p.luciole) s += froncer(eyes, 0.6);
  // les pattes qui se perdent dans la brume, une volute derrière
  const extra = volute(-9, -3, 0.9) + (p.marche && p.n ? volute(-12, -6, 0.7) : '');
  const pieds = `<ellipse cx="0" cy="-0.5" rx="7.4" ry="1.7" fill="rgba(226,233,246,.7)"/>` + volute(-6, -1.4, 0.7) + volute(3.6, -0.9, 0.6, true);
  let body = `<g transform="scale(${B.k})">${extra + s + pieds}</g>`;
  const top = -14 * B.k;
  if (p.boude) body = `<g transform="rotate(${p.n ? -12 : -8} 0 0)">${body}</g>` + hmpf(-10, top - 3 - p.n * 1.4, 0.9 + p.n * 0.2);
  if (p.fuit) body = `<g transform="rotate(6 0 0)">${body}</g>` + goutte(9, top - 1);
  return contour(finir(body, p, top / 2));
}

module.exports = { fantome, zombie, bete, BETES, POSES, BRUME };
