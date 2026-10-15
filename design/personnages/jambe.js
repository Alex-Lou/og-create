// La jambe : la règle canonique du bas du corps (choix de l'auteur, 15 oct. : « les jambes, la largeur et l'angle des
// hanches, les positions »), comme manche.js pour le bras. Branchée sur l'avatar (et son naufragé) par c.jambe
// (troupe.leg lui passe la main) ; les maîtres s'y brancheront un par un, chacun montré avant.
//
// La règle :
// 1. La jambe naît de la hanche : le haut de la cuisse est aussi large que la moitié du bassin (la demi-largeur des
//    hanches, c.k.hw), les deux cuisses se touchent à l'entrejambe ; le buste ne pose plus sur deux bâtons.
// 2. Elle s'affine en courbe jusqu'à la cheville : le bord extérieur bombe (la cuisse, le mollet), le bord intérieur
//    file droit ; la cheville garde la largeur du kit (les chaussures n'y changent rien).
// 3. Elle pivote depuis la hanche : le haut de la cuisse ne bouge pas, le pied va et vient (la marche), la jambe prend
//    l'angle qu'il faut.
// 4. Ce qui la couvre la suit (le short, le bermuda) : même bords, et l'ourlet est une coupe du cylindre, un arc bombé
//    vers le pied (la règle des bords de manche.js).
//
// jambe(c, x, y, dir, tilt) : la cheville en (x, y), comme troupe.leg ; le pied (c.foot, ou la chaussure du kit) par-dessus.
const { OUT, W, r2, shoe, clip } = require('./troupe');

const pt = q => `${r2(q[0])},${r2(q[1])}`;
// Les repères d'une jambe : le haut de la cuisse (son milieu, sa demi-largeur), la cheville (son milieu, sa demi-largeur)
function reperes(c, x, y) {
  const g = x < 24 ? -1 : 1; // la jambe de gauche ou de droite, à l'écran
  const hw = c.k.hw, bas = c.legW / 2;
  // (la cuisse : la moitié du bassin moins l'entrejambe, sans dépasser le double de la cheville)
  const haut = Math.max(bas + 0.6, Math.min((hw - 0.7) / 2, bas * 2.05));
  return { g, top: [24 + g * (0.35 + haut), c.hip - 0.4], haut, cheville: [x, y + 1.2], bas };
}
// Le bord extérieur et le bord intérieur d'une jambe, à t (0 : le haut de la cuisse, 1 : la cheville)
function bords(r, t) {
  const { g, top, haut, cheville, bas } = r;
  const lerp = (a, b) => a + (b - a) * t;
  const cx = lerp(top[0], cheville[0]), cy = lerp(top[1], cheville[1]);
  // le bord extérieur bombe (la cuisse en haut, un rien de mollet), l'intérieur file droit
  const h = lerp(haut, bas), bombe = Math.sin(Math.PI * Math.min(1, t * 1.25)) * 0.55;
  return { dehors: [cx + g * (h + bombe), cy], dedans: [cx - g * h, cy], milieu: [cx, cy], h };
}
// La forme d'une jambe de t0 à t1 (un arc bombé vers le pied au bas, si ourlet) : un chemin fermé
function forme(r, t0, t1, ourlet = 0) {
  const n = 8, D = [], I = [];
  for (let i = 0; i <= n; i++) { const b = bords(r, t0 + (t1 - t0) * i / n); D.push(b.dehors); I.push(b.dedans); }
  const fin = bords(r, t1);
  const bas = ourlet ? ` Q${pt([fin.milieu[0], fin.milieu[1] + ourlet])} ${pt(I[n])}` : ` L${pt(I[n])}`;
  return `M${pt(D[0])} ${D.slice(1).map(p => `L${pt(p)}`).join(' ')}${bas} ${I.slice(0, -1).reverse().map(p => `L${pt(p)}`).join(' ')} Z`;
}

// L'angle du pied (degrés) : celui de la jambe, compté depuis la pose de repos (la cheville en c.legX, au sol). Le pied
// tourne autour de la cheville (troupe.pivotPied) : il reste emboîté au bout de la jambe quand elle pivote, au lieu de
// se lever de la pointe à son propre angle (la marche du kit)
function anglePied(c, r, x, y) {
  const [lx, rx] = c.legX[c.view || 'front'], x0 = r.g < 0 ? lx : rx, deg = Math.atan2(x - r.top[0], y + 1.2 - r.top[1]) * 180 / Math.PI;
  const deg0 = Math.atan2(x0 - r.top[0], c.ground + 1.2 - r.top[1]) * 180 / Math.PI;
  return r2(Math.max(-20, Math.min(20, -(deg - deg0))));
}

// La jambe entière (la peau ou le pantalon : c.leg), son ombre du côté droit, puis le pied. tilt : le talon levé du
// kit (troupe.frame, le pied qui quitte le sol en marche, en degrés autour de sa pointe).
// - Pied levé : on garde le geste du kit (la pointe reste où elle est, le talon monte), et la jambe va jusqu'à la
//   cheville là où le pied levé l'emmène : tout ce qui suit la jambe (la tige, le short, le revers) la suit aussi, le
//   pied reste emboîté au bout de la jambe (avant : la jambe s'arrêtait à l'ancienne cheville, le pied s'en décollait).
// - Pied posé : il prend l'angle de la jambe, autour de la cheville (anglePied), et reste posé au sol (auSol).
function jambe(c, x, y, dir, tilt = 0) {
  let X = x, Y = y, rot;
  if (tilt) {
    // la cheville (0,6 sous le haut du pied) tourne autour de la pointe (troupe : le pivot du kit), du même angle
    const a = tilt * Math.PI / 180, px = x - (dir < 0 ? 3 : -3), py = y + 4.5, ax = x - px, ay = y + 0.6 - py;
    X = r2(px + ax * Math.cos(a) - ay * Math.sin(a));
    Y = r2(py + ax * Math.sin(a) + ay * Math.cos(a) - 0.6);
    rot = tilt;
  }
  const r = reperes(c, X, Y);
  if (!tilt) rot = anglePied(c, r, X, Y);
  const d = forme(r, 0, 1);
  // l'ombre : une bande le long du bord droit de l'écran (la lumière vient d'en haut à gauche)
  const droit = r.g > 0 ? 'dehors' : 'dedans', k = r.g > 0 ? -1 : 1;
  const bandeOmbre = [0, 0.5, 1].map(t => bords(r, t)[droit]);
  const ombre = `<path d="M${bandeOmbre.map(pt).join(' L')}" fill="none" stroke="${c.legS}" stroke-width="2.2" stroke-linecap="round" transform="translate(${r2(k * 0.9)} 0)"/>`;
  const id = `${c.uid}jb${Math.round(x * 10)}${Math.round(y * 10)}`;
  const pied = c.foot ? c.foot(c, X, Y, dir, rot) : shoe(c, X, Y, dir, rot);
  return `<path d="${d}" fill="${c.leg}"/>` + clip(id, d, ombre) + `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + (tilt ? pied : auSol(rot, dir, pied));
}
// Le pied posé, tourné à l'angle de la jambe, reste au sol : on le relève d'autant que le coin le plus bas de sa
// semelle descend en tournant autour de la cheville (la semelle la plus épaisse, le sabot, est à 5,5 sous la cheville
// et dépasse de 3,4 de chaque côté, plus la pointe de trois quarts)
function auSol(tilt, dir, pied) {
  if (!tilt) return pied;
  const a = tilt * Math.PI / 180, dy = 4.9, pointe = dir < 0 ? 1.4 : 0;
  const drop = Math.max(...[-(3.4 + pointe), 3.4].map(dx => dx * Math.sin(a) + dy * Math.cos(a) - dy));
  return drop > 0.01 ? `<g transform="translate(0 ${r2(-drop)})">${pied}</g>` : pied;
}

// La jambe d'un short (ou d'un bermuda) par-dessus la jambe nue : les mêmes bords, un rien plus large (le tissu),
// jusqu'à c.shortLen sous la hanche, l'ourlet en arc ; effiloché (le naufragé) : le bord en dents le long de l'arc.
// (y : la cheville ; par défaut, le sol)
function jambeCourte(c, x, frayed = false, y) {
  if (y == null) y = c.ground;
  const r0 = reperes(c, x, y), r = { ...r0, haut: r0.haut + 0.45, bas: r0.bas + 0.45 };
  const t1 = Math.min(0.92, (c.shortLen + 0.4) / (r.cheville[1] - r.top[1]));
  const ourlet = 1.1;
  const d = forme(r, 0, t1, ourlet);
  const fin = bords(r, t1), droit = r.g > 0 ? 'dehors' : 'dedans', k = r.g > 0 ? -1 : 1;
  const ombre = `<path d="M${[0, t1 / 2, t1].map(t => pt(bords(r, t)[droit])).join(' L')}" fill="none" stroke="${c.basS}" stroke-width="2" stroke-linecap="round" transform="translate(${r2(k * 0.8)} 0)"/>`;
  const id = `${c.uid}jc${Math.round(x * 10)}${frayed ? 'f' : ''}`;
  let s = `<path d="${d}" fill="${c.bas}"/>` + clip(id, d, ombre) + `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`;
  // la couture de l'ourlet, ou les dents du bord effiloché, le long de l'arc
  const a = fin.dehors, b = fin.dedans, m = [fin.milieu[0], fin.milieu[1] + ourlet];
  const surArc = (t, dy) => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * m[0] + t * t * b[0], u * u * a[1] + 2 * u * t * m[1] + t * t * b[1] + dy]; };
  if (frayed) s += `<path d="M${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => pt(surArc(t, i % 2 ? 1 : 0))).join(' L')}" fill="none" stroke="${OUT}" stroke-width=".8" stroke-linejoin="round"/>`;
  else s += `<path d="M${pt(surArc(0.08, -1.1))} Q${pt([m[0], m[1] - 1.1])} ${pt(surArc(0.92, -1.1))}" fill="none" stroke="${c.basS}" stroke-width=".6"/>`;
  return s;
}

// Le bas de pantalon retroussé (le naufragé) : le mollet nu sous le revers, puis le pied, puis le revers roulé, un
// boudin de tissu le long d'un arc bombé vers le pied, de la largeur de la jambe à cette hauteur (la règle des bords)
function jambeRetroussee(c, x, y, cuff, pied) {
  const r = reperes(c, x, y), long = r.cheville[1] - r.top[1];
  // (le revers à 4 au-dessus de la cheville, moins sur une jambe courte : il ne s'empile pas sous la taille)
  const haut = Math.min(4, long * 0.3), t0 = Math.max(0, 1 - (haut + 0.6) / long), tr = Math.max(0, 1 - haut / long);
  const ep = haut < 3.6 ? 1.45 : 1.8;
  const mollet = forme(r, t0, 1);
  const id = `${c.uid}jr${Math.round(x * 10)}${Math.round(y * 10)}`;
  let s = `<path d="${mollet}" fill="${c.skin}"/>` + clip(id, mollet, `<path d="M${[t0, 1].map(t => pt(bords(r, t)[r.g > 0 ? 'dehors' : 'dedans'])).join(' L')}" fill="none" stroke="${c.skinS || c.skin}" stroke-width="1.6" transform="translate(${r.g > 0 ? -0.7 : 0.7} 0)"/>`)
    + `<path d="${mollet}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`;
  s += pied;
  const b = bords(r, tr), m = [b.milieu[0], b.milieu[1] + 0.9];
  const arc = `M${pt([b.dehors[0] + r.g * 0.2, b.dehors[1]])} Q${pt(m)} ${pt([b.dedans[0] - r.g * 0.2, b.dedans[1]])}`;
  s += `<path d="${arc}" fill="none" stroke="${OUT}" stroke-width="${r2(ep + W * 2)}" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${cuff}" stroke-width="${ep}" stroke-linecap="round"/>`
    + `<path d="M${pt([b.dehors[0] - r.g * 0.6, b.dehors[1] - 0.3])} Q${pt([m[0], m[1] - 0.3])} ${pt([b.dedans[0] + r.g * 0.6, b.dedans[1] - 0.3])}" fill="none" stroke="#FFFFFF" stroke-width=".45" opacity=".4"/>`;
  return s;
}

// La tige d'une botte ou d'une bottine : le bas de la jambe sur `haut` au-dessus de la cheville, un rien plus large
// qu'elle (marge : l'épaisseur du cuir ou du caoutchouc), qui en suit l'angle et les bords (la jambe pivote, la tige
// avec elle) ; son ouverture est un arc bombé vers le pied (la règle des bords). Rend { d : la forme, ouverture : l'arc
// du haut, droit : le bord à droite de l'écran (pour l'ombre), dans : un bord plus étroit à gauche (pour le reflet) }
function tigeJambe(c, x, y, haut, marge = 0.7) {
  const r0 = reperes(c, x, y), r = { ...r0, haut: r0.haut + marge, bas: r0.bas + marge };
  const long = r.cheville[1] - r.top[1], t0 = Math.max(0.05, 1 - (haut + 1.2) / long);
  const b = bords(r, t0), m = [b.milieu[0], b.milieu[1] + 0.7];
  const n = 6, D = [], I = [];
  for (let i = 0; i <= n; i++) { const e = bords(r, t0 + (1 - t0) * i / n); D.push(e.dehors); I.push(e.dedans); }
  const d = `M${pt(D[0])} ${D.slice(1).map(q => `L${pt(q)}`).join(' ')} L${pt(I[n])} ${I.slice(0, -1).reverse().map(q => `L${pt(q)}`).join(' ')} Q${pt(m)} ${pt(D[0])} Z`;
  // (le bord à droite de l'écran : le dehors de la jambe droite, le dedans de la gauche ; l'autre est à gauche)
  const droite = r.g > 0 ? D : I, gauche = r.g > 0 ? I : D;
  return {
    d,
    ouverture: `M${pt(D[0])} Q${pt(m)} ${pt(I[0])}`,
    droit: 'M' + droite.map(pt).join(' L'),
    gauche: 'M' + gauche.slice(1, -1).map(q => pt([q[0] + 0.9, q[1]])).join(' L')
  };
}

module.exports = { jambe, jambeCourte, jambeRetroussee, tigeJambe, reperes };
