// Poses « endormi » des maîtres (bible, § 6.7 et § 14), au même format que la troupe (48 × 64, pieds en bas au centre),
// pour le look du naufragé comme pour le look du maître. On réutilise les pièces de chaque personnage (corps, cou,
// tête, objets) : le buste descend (il est assis, les jambes tendues vers nous, on voit la plante des pieds), la tête
// penche, les yeux sont fermés et les « z » montent (2 images).
//   Ondin : assis contre un rocher, le bocal vide renversé, une bulle au nez (il ronfle à La Source) ;
//   Sylve : roulée en boule sous sa cape de feuilles (cadre couché 64 × 48) ;
//   Galet : assis dans la fissure, le maillet à la main ;
//   Mélisse : assise, la boîte en fer sur les genoux, endormie dessus sous son grand chapeau ;
//   Aster : adossée à une caisse repêchée, la longue-vue sur les genoux ;
//   Cannelle : la louche serrée contre elle ;
//   Rivet : sa boîte de vis sur les genoux, des vis tombées par terre.
const { OUT, P, E, L, limb, clip, arm, zee, r2 } = require('./troupe');

// ---- accessoires ----
// Gros rocher arrondi (granit), ombré à droite
function boulder(x, y, w, h, uid) {
  const d = `M${x},${r2(y + h)} Q${r2(x - w * 0.04)},${r2(y + h * 0.35)} ${r2(x + w * 0.3)},${r2(y + h * 0.08)} Q${r2(x + w * 0.55)},${r2(y - h * 0.06)} ${r2(x + w * 0.8)},${r2(y + h * 0.12)} Q${r2(x + w * 1.04)},${r2(y + h * 0.4)} ${r2(x + w)},${r2(y + h)} Z`;
  return P(d, '#B4AEA2') + clip(`${uid}rk`, d, `<rect x="${r2(x + w * 0.62)}" y="${y - 2}" width="${w}" height="${h + 4}" fill="#958F84"/>`
    + `<ellipse cx="${r2(x + w * 0.32)}" cy="${r2(y + h * 0.22)}" rx="${r2(w * 0.16)}" ry="${r2(h * 0.07)}" fill="#CDC8BE"/>`
    + `<path d="M${r2(x + w * 0.15)},${r2(y + h * 0.55)} q3,-1.4 6,0.4" fill="none" stroke="#958F84" stroke-width="0.6"/>`
    + E(x + w * 0.8, y + h * 0.3, 1.6, 1, '#9DAE7C', 0)) + P(d, 'none');
}
// La Fissure de La Colline : deux masses de granit et, entre elles, une fente sombre où luit la pierre ; Galet est assis dedans
function cleft(uid) {
  const gap = 'M12.6,62 L13.6,30 L16.4,16 L19.8,6.4 L23.4,2.6 L26.6,7.6 L30.4,16.4 L34.6,30 L36,62 Z';
  const left = 'M1.4,62 L2.4,38 Q3,28.6 6.4,22.6 L10.6,12.4 L15.4,3.4 Q17.8,1.6 19.4,4.6 L21.4,9.6 L17.4,18.6 L15.8,34 L17.4,62 Z';
  const right = 'M31,62 L32.4,44 L31.4,30 L28.4,18.4 Q29.2,11.8 32.6,12.6 L37.4,17.6 Q43.4,23.4 44.8,33.4 L46.6,62 Z';
  const rock = (d, id, shade) => P(d, '#ABA59A') + clip(id, d, shade + '<path d="M0,40 q4,-1.2 8,0.4 M34,50 q3.4,-1 7,0.4 M4,52 q3,-0.8 6,0.4" fill="none" stroke="#8E897F" stroke-width="0.6"/>'
    + E(9, 29, 2.2, 1.1, '#9DAE7C', 0)) + P(d, 'none');
  return P(gap, '#46423C') + clip(`${uid}gp`, gap, '<path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="5" stroke-linecap="round" opacity="0.18"/>'
      + '<path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="0.8" stroke-linecap="round" opacity="0.75"/>') + P(gap, 'none')
    + rock(left, `${uid}cl`, '<rect x="13" y="0" width="12" height="64" fill="#8E897F"/><path d="M6.4,26 L12.6,12 L14.4,13 L8.4,27 Z" fill="#C2BDB2"/>')
    + rock(right, `${uid}cr`, '<rect x="38" y="10" width="12" height="54" fill="#8E897F"/><path d="M29.6,16 L33,13.8 L34.6,15.4 L31.2,17.6 Z" fill="#C2BDB2"/>');
}
// Caisse repêchée (planches, deux traverses), vue de face
function crate(x, y, w, h, uid) {
  const d = `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
  return P(d, '#B8875A') + clip(`${uid}cr`, d, `<rect x="${r2(x + w * 0.68)}" y="${y}" width="${w}" height="${h}" fill="#94683F"/>`
    + [0.33, 0.66].map(k => `<line x1="${x}" y1="${r2(y + h * k)}" x2="${x + w}" y2="${r2(y + h * k)}" stroke="${OUT}" stroke-width="0.6"/>`).join('')
    + `<rect x="${x}" y="${y}" width="${w}" height="1.6" fill="#D2A578"/>`) + P(d, 'none')
    + L([x + 1.4, y + 1.4], [x + w - 1.4, y + h - 1.4], OUT, 0.7) + E(x + 2.2, y + h * 0.5, 0.4, 0.4, '#5E5650', 0) + E(x + w - 2.2, y + h * 0.5, 0.4, 0.4, '#5E5650', 0);
}
// Bocal (vide, couché ou debout)
function jar(x, y, rot = 0) {
  const d = `M${r2(x - 1.6)},${r2(y - 1.6)} L${r2(x + 1.6)},${r2(y - 1.6)} Q${r2(x + 2.1)},${r2(y - 1.2)} ${r2(x + 2)},${y} L${r2(x + 1.9)},${r2(y + 1.9)} Q${x},${r2(y + 2.6)} ${r2(x - 1.9)},${r2(y + 1.9)} L${r2(x - 2)},${y} Q${r2(x - 2.1)},${r2(y - 1.2)} ${r2(x - 1.6)},${r2(y - 1.6)} Z`;
  return `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="#D6ECF2" fill-opacity="0.75" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<path d="M${r2(x - 1.1)},${r2(y - 0.6)} L${r2(x - 1.1)},${r2(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/>`
    + `<rect x="${r2(x - 1.3)}" y="${r2(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.7"/></g>`;
}
// Baguette de noisetier fourchue posée de a (pied) à b (fourche)
function rod(a, b) {
  const j = [a[0] + (b[0] - a[0]) * 0.72, a[1] + (b[1] - a[1]) * 0.72];
  return limb(a, j, 1.2, '#A8743F') + limb(j, b, 1.1, '#A8743F') + limb(j, [b[0] + 2.6, b[1] + 1.2], 1.1, '#A8743F')
    + `<g transform="rotate(-30 ${r2(b[0] + 2.6)} ${r2(b[1] + 1.2)})">${E(b[0] + 3.6, b[1] + 1.2, 1.3, 0.65, '#7BB661', 0.6)}</g>`;
}
// Maillet de tailleur : manche de a (main) vers b (tête)
function mallet(a, b) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90;
  return limb(a, b, 1.2, '#A8743F') + `<g transform="rotate(${r2(ang)} ${r2(b[0])} ${r2(b[1])})"><rect x="${r2(b[0] - 2.4)}" y="${r2(b[1] - 0.6)}" width="4.8" height="2.8" rx="0.9" fill="#A8743F" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${r2(b[0] + 0.9)}" y="${r2(b[1] - 0.2)}" width="1.1" height="2" rx="0.4" fill="#7E5530"/></g>`;
}
// Longue-vue repliée, posée en travers
function spyglass(x, y, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-1.5" y="-4.5" width="3" height="9" rx="0.8" fill="#C9A24A" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="-1.1" y="-3.9" width="0.8" height="7.8" rx="0.4" fill="#F0D58A"/><rect x="-1.95" y="-4.9" width="3.9" height="2.1" rx="0.6" fill="#8E6E2C" stroke="${OUT}" stroke-width="0.8"/></g>`;
}
// Boîte de vis en fer-blanc et vis éparses
const tin = (x, y) => `<rect x="${r2(x - 4)}" y="${r2(y - 2)}" width="8" height="4" rx="0.8" fill="#B8C0C8" stroke="${OUT}" stroke-width="0.9"/>`
  + `<rect x="${r2(x - 3.2)}" y="${r2(y - 1.4)}" width="6.4" height="1.6" rx="0.5" fill="#6E7680"/>`
  + [[-2.2, -0.9], [-0.6, -1], [1, -0.8], [2.4, -1]].map(([dx, dy]) => E(x + dx, y + dy, 0.55, 0.45, '#D9C27A', 0.4)).join('');
const screw = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">${L([x, y], [x + 2.2, y], OUT, 1.3)}${L([x, y], [x + 2.2, y], '#B8C0C8', 0.6)}${E(x, y, 0.75, 0.75, '#D9C27A', 0.5)}</g>`;
// Bulle au nez (il ronfle) : petite puis grosse
const snore = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#CFEFFF" fill-opacity="0.7" stroke="${OUT}" stroke-width="0.6"/>`
  + `<path d="M${r2(x - r * 0.5)},${r2(y - r * 0.2)} Q${r2(x - r * 0.4)},${r2(y - r * 0.6)} ${r2(x)},${r2(y - r * 0.65)}" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round"/>`;

// Plante des pieds tournée vers nous (assis, jambes tendues) ; bas de jambe court au-dessus
function soles(c, xs, y, stub = true) {
  let s = '';
  for (const [i, x] of xs.entries()) {
    // de face, le pied droit du personnage est à gauche de l'écran ; c.bareSide : un seul pied nu
    const bare = !!c.foot && (!c.bareSide || (c.bareSide === 'right') === (i === 0));
    if (stub && c.leg !== c.skin) s += `<rect x="${r2(x - c.legW / 2)}" y="${r2(y - 6)}" width="${c.legW}" height="4.6" rx="1.4" fill="${c.leg}" stroke="${OUT}" stroke-width="1.1"/>`;
    else if (stub) s += `<rect x="${r2(x - c.legW / 2 + 0.3)}" y="${r2(y - 5.4)}" width="${r2(c.legW - 0.6)}" height="4" rx="1.4" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/>`;
    if (bare) {
      s += E(x, y, 2.5, 3, c.skin) + E(x + 0.5, y + 1.3, 1.5, 1.1, c.skinS || c.skin, 0);
      for (const [dx, dy, r] of [[-1.6, -2.6, 0.62], [-0.5, -3, 0.66], [0.6, -3, 0.62], [1.6, -2.6, 0.55]]) s += E(x + dx, y + dy, r, r, c.skin, 0.55);
    } else {
      s += E(x, y, 2.6, 3.1, c.shoeS) + E(x, y - 0.9, 1.7, 1.4, c.shoe, 0) + L([x - 1.6, y + 1.3], [x + 1.6, y + 1.3], c.shoe, 0.6);
    }
  }
  return s;
}

// Cadre commun : buste descendu de dy, tête penchée (tilt, autour du cou), bras et accessoires propres à chacun
function seated(c, n, o) {
  const id = `${c.uid}dort${n}`;
  const cc = { ...c, uid: id };
  const ctx = { view: 'front', pose: 'repos', n, ph: 0, id, walk: false, expr: o.expr || 'endormi', eyeMode: null, open: false, blink: false };
  const dy = o.dy;
  const sh = c.shoulders.map(([x, y]) => [x, y + dy]);
  let s = o.back ? o.back(cc, sh) : '';
  s += `<g transform="translate(0 ${dy})">${c.backItems && !o.noBackItems ? c.backItems(cc, ctx) : ''}${c.body(cc, ctx)}${c.neck ? c.neck(cc, ctx) : ''}</g>`;
  s += o.legs ? o.legs(cc) : soles(cc, o.feet, o.footY);
  s += o.lap ? o.lap(cc, sh) : '';
  s += o.arms(cc, sh);
  s += c.overArms ? `<g transform="translate(0 ${dy})">${c.overArms(cc, ctx)}</g>` : '';
  const head = c.head(cc, ctx, {}) + (c.overHead ? c.overHead(cc, ctx) : '') + (o.face ? o.face(cc, n) : '');
  s += `<g transform="translate(${o.hx || 0} ${r2(dy + (o.hy || 0))}) rotate(${o.tilt} 24 ${o.pivot || 31})">${head}</g>`;
  s += o.front ? o.front(cc, sh) : '';
  return s;
}

const POSES = {
  Ondin: {
    dy: 5.6, tilt: 13, hy: 0.6, feet: [19.4, 28.6], footY: 59.4,
    back: cc => boulder(9, 24, 37, 38, cc.uid) + rod([39.6, 61], [43.2, 40.6]),
    arms: (cc, [l, r]) => arm(cc, l, [21.4, 53.8], [13.2, 50.6]) + arm(cc, r, [26.6, 53.8], [35, 50.6]),
    face: (cc, n) => snore(27.6, 27.6 + 4.4, n ? 2.3 : 1.1),
    front: () => jar(8.6, 60.2, 78)
  },
  Galet: {
    dy: 6.4, tilt: -6, hy: 1.4, feet: [20.4, 27.6], footY: 59.6,
    back: cc => cleft(cc.uid),
    arms: (cc, [l, r]) => arm(cc, l, [21.6, 54.4], [13.4, 51.6]) + mallet([36.6, 56.6], [39.8, 61]) + arm(cc, r, [36.6, 56.4], [36.4, 50.4]),
    front: () => ''
  },
  Aster: {
    dy: 9, tilt: -11, hy: 0.4, feet: [19.6, 28.4], footY: 59.6,
    back: cc => crate(7, 30, 34, 24, cc.uid),
    lap: () => spyglass(24, 53.4, 78),
    arms: (cc, [l, r]) => arm(cc, l, [20.2, 53.6], [13.4, 50.4]) + arm(cc, r, [27.8, 53.6], [34.6, 50.4])
  },
  Cannelle: {
    dy: 5.2, tilt: 10, hy: 0.4, feet: [19.6, 28.4], footY: 60, noBackItems: true,
    lap: cc => limb([15.6, 55.6], [32.6, 43.6], 1.5, '#C27C45') + `<g transform="rotate(-30 33.6 42.4)">${E(33.6, 42.4, 3.3, 2.6, '#C27C45')}${E(33.6, 41.9, 2.3, 1.4, '#8F5530', 0)}${E(32.4, 43.3, 0.8, 0.45, '#EAA46C', 0)}</g>`,
    arms: (cc, [l, r]) => arm(cc, l, [26.4, 50.6], [12.6, 49.4]) + arm(cc, r, [30.4, 46.2], [36.4, 50.4])
  },
  Rivet: {
    dy: 8.6, tilt: -14, hy: 1.2, feet: [19.6, 28.4], footY: 59.6,
    lap: () => tin(24, 54.2),
    arms: (cc, [l, r]) => arm(cc, l, [19.8, 54.4], [13.4, 50.6]) + arm(cc, r, [28.2, 54.4], [34.6, 50.6]),
    front: () => screw(8.6, 60.4, -20) + screw(37.6, 61.2, 30) + screw(41.4, 59.2, 70)
  },
  Mélisse: {
    dy: 6.2, tilt: 6, hy: 8.4, pivot: 34, feet: [19.6, 28.4], footY: 60.4,
    lap: () => '',
    arms: (cc, [l, r]) => {
      // la boîte sur les genoux, les bras croisés dessus
      const box = `<rect x="16.4" y="46.4" width="15.2" height="8.4" rx="1" fill="#6E7480" stroke="${OUT}" stroke-width="1"/><rect x="27.2" y="47" width="3.6" height="7.4" fill="#545A65"/>`
        + `<rect x="15.8" y="44.8" width="16.4" height="2.6" rx="0.6" fill="#9AA2AD" stroke="${OUT}" stroke-width="0.9"/>`
        + [[17.6, 48.6], [30.4, 48.6], [17.6, 53], [30.4, 53]].map(([x, y]) => E(x, y, 0.45, 0.45, '#9AA2AD', 0)).join('')
        + `<rect x="23" y="47.6" width="2" height="2" rx="0.4" fill="#F2C94C" stroke="${OUT}" stroke-width="0.6"/>`;
      return box + arm(cc, l, [28.4, 45.2], [12.8, 46]) + arm(cc, r, [19.6, 45.4], [35.2, 46.2]);
    }
  }
};

// Les « z » que la tête dessine d'elle-même (expression), à retirer quand la tête est couchée (voir troupe.expression)
function stripZ(str, [x, y], n) {
  const zz = n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
  return str.replace(zz, '');
}
// Sylve, roulée en boule sous sa cape de feuilles (cadre couché 64 × 48, ancre au sol au centre : 32, 46)
function sylveCurled(c, n) {
  const id = `${c.uid}dort${n}`;
  const cc = { ...c, uid: id };
  const ctx = { view: 'se', pose: 'repos', n, ph: 0, id, walk: false, expr: 'endormi', eyeMode: null, open: false, blink: false };
  // naufragée, sa cape est perdue : elle dort roulée dans sa tunique, quelques feuilles flétries sur elle
  const leaf = c.nauMound ? [c.nauMound.fill, c.nauMound.shade, c.nauMound.hi] : ['#5E9E4A', '#467A37', '#86C06A'];
  // la boule : la cape couvre tout le corps, festonnée, avec des rangées de feuilles
  const mound = 'M20,46 Q16.6,33.4 29,27.8 Q41,22.6 51.4,29.2 Q60,35 57.6,46 Q55.8,47.6 53.8,46.2 Q52.2,48 50.2,46.4 Q48.4,48 46.4,46.4 Q44.4,48 42.4,46.4 Q40.4,48 38.4,46.4 Q36.4,48 34.4,46.4 Q32.4,48 30.4,46.4 Q28.4,48 26.4,46.4 Q24.2,48 22.2,46.2 Q20.6,47.4 20,46 Z';
  const rows = [33, 38, 43].map(y => `<path d="M14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y} Q40,${y + 2} 42,${y} Q44,${y + 2} 46,${y} Q48,${y + 2} 50,${y} Q52,${y + 2} 54,${y} Q56,${y + 2} 58,${y} Q60,${y + 2} 62,${y}" fill="none" stroke="${leaf[1]}" stroke-width="0.7"/>`).join('');
  let s = `<ellipse cx="38.6" cy="46.2" rx="20.6" ry="2.2" fill="#3C2819" opacity="0.12"/>`;
  s += P(mound, leaf[0]) + clip(`${id}m`, mound, `<rect x="41" y="20" width="24" height="30" fill="${leaf[1]}"/>${c.nauMound ? '' : rows}<ellipse cx="33" cy="30.8" rx="8" ry="2" fill="${leaf[2]}"/>`) + P(mound, 'none');
  if (c.nauMound) {
    // la bande de voile en ceinture, et trois feuilles flétries posées sur elle
    s += `<path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"/><path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="#E6DCC3" stroke-width="2" stroke-linecap="round"/>`;
    for (const [x, y, r] of [[30, 27.4, -60], [44.6, 26.6, 50], [50.4, 30.4, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,0 Q1.4,1.9 0,3.8 Q-1.4,1.9 0,0 Z', c.nauMound.leaf, 0.7)}</g>`;
  }
  // pieds nus qui dépassent au bout de la boule (plante vers nous)
  for (const [x, y, rot] of [[57.6, 42.6, -20], [59.8, 44.8, -8]]) {
    s += `<g transform="rotate(${rot} ${x} ${y})">${E(x, y, 1.9, 2.4, c.skin)}${E(x + 0.4, y + 1, 1.1, 0.9, c.skinS || c.skin, 0)}`
      + [[-1.2, -2, 0.5], [-0.3, -2.4, 0.52], [0.6, -2.3, 0.48], [1.3, -1.9, 0.42]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r, c.skin, 0.5)).join('') + '</g>';
  }
  const head = stripZ(c.head(cc, ctx, {}), [3.6, 11.4], n) + (c.overHead ? c.overHead(cc, ctx) : '');
  s += `<g transform="translate(1.8 12.6) rotate(-24 24 31) scale(0.92)">${head}</g>`;
  // les « z » montent au-dessus de la tête
  s += n ? zee(30.6, 9, 2) + zee(33.4, 5.2, 2.6) : zee(30, 10, 1.8) + zee(32.6, 6.6, 2.4);
  return `<g transform="translate(0 -1.2)">${s}</g>`;
}

function sleepFrame(c, n) {
  const key = c.name;
  if (key === 'Sylve') return sylveCurled(c, n);
  return seated(c, n, POSES[key]);
}
const isCurled = c => c.name === 'Sylve';

module.exports = { sleepFrame, isCurled, POSES, stripZ, boulder, cleft, crate, jar, rod, mallet, spyglass, tin, screw, snore, soles, seated };
