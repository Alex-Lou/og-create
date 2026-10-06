// Les plans d'entrée du tutoriel (bible, § 9 et § 14) : chaque naufragé tel qu'on le rencontre, 2 images, cadre
// 80 × 64 (le sol en bas, au centre : 40, 62). Fond transparent : on les pose sur la plage, la scène ou une carte.
//   Aster : dans les vagues, elle tire une caisse au bout d'une corde (T2) ;
//   Cannelle : derrière l'épave, elle grelotte, la louche serrée contre elle (T3) ;
//   Rivet : sous une voile échouée, il trie ses vis par taille (T4) ;
//   Ondin : il ronfle à La Source, le bocal vide renversé (T5).
const { OUT, P, E, L, limb, clip, arm, frame, drop, r2 } = require('./troupe');
const { cord, CANVAS } = require('./naufrage');
const { seated, POSES, tin, screw, crate } = require('./dormeurs');

const SEA = { deep: '#5EAFCF', mid: '#8FD0E4', foam: '#F4FBFF', line: '#3F86A6' };
const wave = (y, amp, len, off, x0 = -4, x1 = 84) => {
  let d = `M${x0},${y}`;
  for (let x = x0; x < x1; x += len) d += ` Q${r2(x + len / 4 + off)},${r2(y - amp)} ${r2(x + len / 2)},${y} Q${r2(x + len * 0.75 + off)},${r2(y + amp)} ${r2(x + len)},${y}`;
  return d;
};
const at = (dx, body, dy = 0) => `<g transform="translate(${dx} ${dy})">${body}</g>`;

// ---- Aster dans les vagues ----
function asterScene(nau, n) {
  // geste : les deux mains sur la corde, côté droit ; la corde file vers la caisse qui flotte derrière elle
  const pull = {
    ...nau,
    pose: () => {
      const rope = cord(`M27.6,43.8 L33.8,42.4 Q40.6,${n ? 46.4 : 45.6} 47.6,${n ? 46.6 : 46}`, 0.9, '#B08850');
      return {
        expr: 'content', eyeMode: 'squeeze', open: true,
        left: rope + arm(nau, [16, 34], [28.4, 43.6], [19.4, 42.4]),
        right: arm(nau, [32, 34], [33.6, 42.4], [35.8, 38])
      };
    }
  };
  const bob = n ? -0.6 : 0;
  const sea = (body, tag) => `<clipPath id="asea${tag}${n}"><ellipse cx="40" cy="60" rx="39.4" ry="15.4"/></clipPath><g clip-path="url(#asea${tag}${n})">${body}</g>`;
  let s = '';
  // la mer derrière : une bande sombre, puis la caisse qui flotte
  s += sea(P(`${wave(47.6, 0.8, 16, n ? 3 : 0)} L84,64 L-4,64 Z`, SEA.deep, 0) + `<path d="${wave(47.6, 0.8, 16, n ? 3 : 0)}" fill="none" stroke="${SEA.line}" stroke-width="0.7"/>`, 'b');
  s += `<g transform="rotate(${n ? -4 : -8} 62 50) translate(0 ${n ? 0.8 : 0})">${crate(55, 41.6, 15, 12, `asc${n}`)}${E(56.4, 45.4, 0.9, 0.9, '#5E5650', 0.6)}</g>`;
  s += at(8, frame(pull, 'se', 'action', 0), bob);
  // gouttes qui tombent de son ciré
  s += drop(n ? 17.6 : 18.2, n ? 49.4 : 47.6, 0.8, '#A9DCFF') + drop(n ? 30.6 : 30, n ? 47 : 48.8, 0.7, '#A9DCFF');
  // la mer devant : l'eau jusqu'aux genoux, une crête d'écume, des éclaboussures autour des jambes
  const front = `${wave(51.6, 1.1, 14, n ? -3.5 : 0)} L84,64 L-4,64 Z`;
  s += sea(P(front, SEA.mid, 0) + clip(`asw${n}`, front, `<path d="${wave(57, 0.8, 12, n ? 2 : -2)}" fill="none" stroke="#B9E4F0" stroke-width="1.2"/>`
    + `<rect x="-4" y="61" width="88" height="4" fill="${SEA.deep}" opacity="0.35"/>`)
    + `<path d="${wave(51.6, 1.1, 14, n ? -3.5 : 0)}" fill="none" stroke="${SEA.foam}" stroke-width="1.6" stroke-linecap="round"/>`, 'f');
  for (const [x, y, k] of [[25.4, 50.4, 1], [37.2, 50.6, -1], [54.6, 49.8, 1]]) {
    const r = n ? 1.6 : 1.1;
    s += `<path d="M${r2(x - r * 1.6 * k)},${y} Q${r2(x - r * 0.8 * k)},${r2(y - r * 1.4)} ${x},${r2(y - r * 0.4)}" fill="none" stroke="${SEA.foam}" stroke-width="0.9" stroke-linecap="round"/>`;
  }
  return s;
}

// ---- Cannelle derrière l'épave ----
function hull(uid) {
  // un morceau de coque échoué : bordages courbes, bord cassé, membrures qui dépassent, algues et bernacles
  const d = 'M4,62 Q2.4,52 9,47 L15,48.6 L18.6,45.4 L24.4,47.8 L29,44.6 L35.8,47.2 L41,44.4 L47.4,46.8 L52.6,44.6 L57,47.6 Q62.6,53.6 60.4,62 Z';
  const ribs = [[11, 48.4, 9.4, 36.6], [21.4, 47, 20.4, 37.4]].map(([a, b, x, y]) => limb([a, b], [x, y], 2.2, '#8A5A30')).join('');
  return ribs + P(d, '#A8743F') + clip(`${uid}h`, d, '<rect x="0" y="56" width="64" height="8" fill="#7E5530"/><rect x="44" y="40" width="20" height="24" fill="#8F6034"/>'
    + [50.6, 54, 57.6].map(y => `<path d="M0,${y} Q32,${y - 2.6} 64,${y}" fill="none" stroke="${OUT}" stroke-width="0.6"/>`).join('')
    + [[9, 53], [12, 59], [40, 55], [48, 59.6], [27, 59]].map(([x, y]) => E(x, y, 0.6, 0.5, '#D9D2C2', 0.4)).join('')
    + `<path d="M14,48 Q12.6,52 14.4,55 Q15.4,57.4 14.2,60" fill="none" stroke="#5C8A45" stroke-width="1.4" stroke-linecap="round"/>`) + P(d, 'none')
    + [[18, 52.4], [33.4, 51.4], [51, 51.6]].map(([x, y]) => E(x, y, 0.55, 0.55, '#5E5650', 0)).join('');
}
function cannelleScene(nau, n) {
  const ladle = (a, b) => limb(a, b, 1.5, '#C27C45') + `<g transform="rotate(-35 ${b[0]} ${b[1]})">${E(b[0], b[1], 3.3, 2.6, '#C27C45')}${E(b[0], b[1] - 0.5, 2.3, 1.4, '#8F5530', 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, '#EAA46C', 0)}</g>`;
  // emmitouflée dans sa couverture, elle serre la louche contre elle : les mains sortent de la couverture, la louche
  // debout contre sa poitrine, le cuilleron sous le menton
  const hug = {
    ...nau,
    pose: () => ({
      expr: 'triste',
      left: arm(nau, [15, 35], [22.6, 42.4], [13.2, 43.6]),
      right: arm(nau, [33, 35], [26, 41], [35.6, 43.4]),
      over: limb([25.2, 50.8], [24.2, 37.4], 1.5, '#C27C45') + L([25, 49], [24.3, 39], '#EAA46C', 0.5)
        + `<g transform="rotate(-8 24 35.4)">${E(24, 35.4, 3.3, 2.5, '#C27C45')}${E(24, 34.9, 2.3, 1.35, '#8F5530', 0)}${E(22.8, 36.2, 0.8, 0.45, '#EAA46C', 0)}</g>`
        + E(22.8, 43, 2.1, 2.1, nau.skin) + E(25.8, 41.2, 2.1, 2.1, nau.skin)
    })
  };
  const jit = n ? 0.7 : -0.7;
  // traits de froid de part et d'autre
  const shiver = (x, y, k) => [0, 2.2].map(d => `<path d="M${x + k * d},${y} l${k * 0.8},1.1 l${-k * 0.8},1.1 l${k * 0.8},1.1" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return at(22 + jit, frame(hug, 'front', 'action', n)) + hull(`cah${n}`)
    + shiver(n ? 31.6 : 32.6, 30, -1) + shiver(n ? 64 : 63, 31.4, 1) + shiver(n ? 33.2 : 32.4, 40.4, -1);
}

// ---- Rivet sous la voile échouée ----
function sail(uid) {
  // une voile jetée sur un aviron : une tente en A, l'intérieur dans l'ombre,
  // le pan gauche tombe jusqu'au sol, le pan droit est relevé et noué
  const inside = 'M40,7.6 L12.6,62.4 L67.4,62.4 Z';
  const left = 'M40,7.6 L3.6,62.4 L17.4,62.4 L24.4,40 Z';
  const right = 'M40,7.6 L76.4,62.4 L69.6,62.4 Q61,48 58.6,36.4 Z';
  let s = limb([31.6, 4.8], [48.6, 10.6], 1.6, '#A8743F') + E(49.6, 11, 1.6, 1.1, '#A8743F', 0.8);
  s += P(inside, '#8C7D5E') + clip(`${uid}i`, inside, `<rect x="0" y="44" width="80" height="20" fill="#3C2819" opacity="0.18"/>`) + P(inside, 'none');
  s += P(left, CANVAS.cloth) + clip(`${uid}l`, left, `<path d="M38,12 L9,62" stroke="${CANVAS.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`
    + `<path d="M11.4,48.4 L15.6,48.4 L12.8,54" fill="none" stroke="#C8463A" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`) + P(left, 'none');
  s += P(right, CANVAS.shade) + clip(`${uid}r`, right, `<path d="M41,11 L72,62" stroke="${CANVAS.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(right, 'none');
  // le pan droit roulé et noué, un accroc sur le pan gauche
  s += P('M57.4,35 Q60.8,33.6 62.4,36.6 Q61.4,39.4 58.6,38.6 Z', CANVAS.cloth, 0.9) + cord('M60.2,36.4 L61.6,41', 0.6, '#B08850');
  s += `<path d="M7.6,56 L10.4,57.4 L9.4,59 L12,59.8" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  // les coins des pans tenus au sol par des galets
  s += E(5.4, 61.6, 2.4, 1.5, '#B4AEA2', 0.8) + E(74.6, 61.6, 2.4, 1.5, '#B4AEA2', 0.8);
  return s;
}
function rivetScene(nau, n) {
  const o = {
    ...POSES.Rivet, expr: 'neutre', tilt: 6, hy: 0.6,
    lap: () => tin(24, 54.2),
    arms: (cc, [l, r]) => arm(cc, l, [20.6, 53.6], [13.4, 50.6])
      + (n ? arm(cc, r, [32.4, 47.4], [36.4, 52.6]) + screw(32.8, 46, -60) : arm(cc, r, [27.4, 53.4], [34.6, 50.6])),
    front: () => ''
  };
  // trois tas de vis, de la plus grosse à la plus petite
  const piles = [[-3.6, 61.4, 4, 1.15], [45.4, 61.2, 3, 0.95], [50.8, 61.6, 3, 0.75]].map(([x, y, k, sc]) => Array.from({ length: k }, (_, i) =>
    `<g transform="translate(${r2(x + (i % 2) * 1.6)} ${r2(y - Math.floor(i / 2) * 1.2)}) scale(${sc})">${screw(0, 0, [10, -24, 40, -6][i])}</g>`).join('')).join('');
  return sail(`ris${n}`) + at(16, seated(nau, n, o) + piles);
}

// ---- Ondin à La Source ----
function sourcePool(n) {
  const d = 'M3.6,58 Q4.6,52.6 17.4,52.2 Q30.6,52.4 31.4,57.6 Q30.4,62.4 17,62.6 Q4,62.4 3.6,58 Z';
  let s = P(d, '#7CC3DA') + clip(`osp${n}`, d, `<ellipse cx="17" cy="55.6" rx="12" ry="2.4" fill="#A9DCEB"/>`
    + `<ellipse cx="${n ? 15 : 19}" cy="57.6" rx="${n ? 5 : 3}" ry="${n ? 1.3 : 0.8}" fill="none" stroke="#E6F7FC" stroke-width="0.6"/>`
    + `<ellipse cx="${n ? 15 : 19}" cy="57.6" rx="${n ? 8 : 6}" ry="${n ? 2.1 : 1.6}" fill="none" stroke="#E6F7FC" stroke-width="0.5" opacity="0.6"/>`) + P(d, 'none');
  // pierres autour de la source
  for (const [x, y, rx, ry] of [[4.2, 55.6, 2.6, 1.8], [9.4, 52.6, 2.2, 1.5], [27.6, 53.4, 2.4, 1.6], [31.2, 58.6, 2, 1.6], [6.8, 61.6, 2.4, 1.5], [23.4, 62.6, 2.6, 1.4]]) s += E(x, y, rx, ry, '#B4AEA2', 0.8) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.4, ry * 0.3, '#CDC8BE', 0);
  return s;
}
function ondinScene(nau, n, sleepFrame) {
  return at(0, sourcePool(n), -1.4) + at(30, sleepFrame(nau, n));
}

module.exports = { asterScene, cannelleScene, rivetScene, ondinScene };
