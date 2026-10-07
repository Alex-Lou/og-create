// Pose « assis » (la veillée, HISTOIRE.md § 10) pour n'importe quel personnage de la troupe (maîtres, naufragés,
// avatar, visiteurs, nouveaux venus) : assis sur un siège bas (rondin, souche, pierre) ; face, trois quarts avant
// (« se ») et trois quarts dos (« ne ») ; 2 images (la 2e : clignement).
// Le siège n'est pas dessiné : le décor de la veillée le pose sous le personnage. Tout le monde s'assoit à la même
// hauteur (un seul rondin pour toute la troupe) : le buste descend jusqu'à ce que le bas du corps touche SEAT, le dessus
// du siège (y = 53,6 du repère 48 × 64, 8,4 au-dessus du bas des pieds) ; les tibias tombent jusqu'au sol, les pieds
// restent au même endroit qu'en repos (pieds en (24, 62)).
//   - de face : les cuisses viennent vers nous (cachées par le buste), les mains se posent sur elles, l'une près de l'autre ;
//   - de trois quarts avant : les cuisses avancent vers le regard (bas-gauche), les genoux dépassent du buste, les mains dessus ;
//   - de dos : les jambes passent devant le siège (on ne les voit pas), les mains se posent sur le siège.
// geste : facultatif, un geste de design/atelier/gestes.js (mains tendues vers le feu…) fait assis : il place les bras
// (et ce qu'il passe derrière le buste ou par-dessus) à partir des épaules descendues ; plus de clignement.
const { arm, leg, limb, r2 } = require('./troupe');

const KNEE = 53; // le haut des tibias, à hauteur d'assise
const SEAT = 53.6; // le dessus du siège
const dyOf = c => r2(KNEE - c.hip);

function assis(c, view, n, expr, geste) {
  const id = `${c.uid}${view}assis${geste ? geste.name : ''}${n}`;
  const cc = { ...c, uid: id, view };
  const ctx = { view, pose: 'repos', n, ph: 0, id, walk: false, expr: expr || 'neutre', eyeMode: null, open: false, blink: !geste && n === 1 };
  const dy = dyOf(c);
  ctx.seatDy = dy; // de combien le corps descend (naufrage.js y tient les lambeaux dans le cadre)
  const knee = KNEE;
  const dir = view === 'se' ? -1 : view === 'ne' ? 1 : 0;
  const up = s => (s ? `<g transform="translate(0 ${dy})">${s}</g>` : '');
  const [lx, rx] = c.legX[view];
  const shin = { ...cc, hip: knee };
  const sh = c.shoulders.map(([x, y]) => [x, y + dy]);
  let legs = '', hands;
  if (view === 'front') {
    legs = [lx, rx].map(x => leg(shin, x, c.ground, dir, 0)).join('');
    hands = [[24 - 2.8, knee - 1.4], [24 + 2.8, knee - 1.4]];
  } else if (view === 'se') {
    // les genoux avancent de FWD vers la gauche ; la cuisse éloignée (à droite) d'abord, la proche ensuite
    const FWD = 3.6;
    for (const x of [rx, lx]) legs += limb([x + 0.6, knee - 0.4], [x - FWD, knee], c.legW - 0.2, c.leg) + leg(shin, x - FWD, c.ground, dir, 0);
    hands = [[lx - FWD + 0.2, knee - 1.6], [rx - FWD + 0.4, knee - 1.8]];
  } else {
    hands = [[c.hands[0][0] - 0.6, c.hands[0][1] + dy - 1.2], [c.hands[1][0] + 0.6, c.hands[1][1] + dy - 1.2]];
  }
  const act = geste ? geste.call({ ...cc, shoulders: sh }, ctx) : null;
  if (act) { ctx.expr = expr || act.expr || 'neutre'; ctx.eyeMode = expr ? null : act.eyeMode || null; ctx.open = !expr && !!act.open; }
  const armL = act && act.left != null ? act.left : arm(cc, sh[0], hands[0]);
  const armR = act && act.right != null ? act.right : arm(cc, sh[1], hands[1]);
  let s = up(c.backItems ? c.backItems(cc, ctx) : '');
  s += act && act.under ? act.under : '';
  s += legs;
  s += up(c.body(cc, ctx));
  if (view !== 'front') s += armR;
  s += up(c.neck ? c.neck(cc, ctx) : '');
  s += view === 'front' ? armL + armR : armL;
  s += up(c.overArms ? c.overArms(cc, ctx) : '');
  s += up(c.head(cc, ctx, act || {}));
  s += up(c.overHead ? c.overHead(cc, ctx) : '');
  s += act && act.over ? act.over : '';
  return s;
}

module.exports = { assis, dyOf, SEAT };
