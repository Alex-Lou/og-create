// Les tenues de saison de la troupe (brief § 6.4) : par maître, une tenue d'hiver à son style (l'écharpe, le bonnet ou
// les cache-oreilles, le châle, la pèlerine ou l'étole, les moufles, les bottes fourrées pour qui va pieds nus).
// enHiver(maître) rend le maître habillé pour l'hiver, à passer à troupe.frame comme le maître lui-même.
// Les coiffes passent par le crochet c.coiffe du maître (aster.js, rivet.js) : il range ce qui dépasserait (mèches,
// crayons) et pose la coiffe à sa place dans la tête. Le châle, la pèlerine et l'étole passent par-dessus les bras
// (troupe.frame, overArms) ; l'écharpe au cou, sous les bras.
const { OUT, P, E, L, clip, r2 } = require('./troupe');
const { DESSINS } = require('../personnages/avatar_accessoires');
const { tone } = require('../personnages/avatar_choix');

// Grosse écharpe tricotée, rayée, au cou (y : le haut du cou) ; un pan qui tombe devant (sauf de dos : il tombe dans le dos)
function echarpe(uid, view, y, [col, raie]) {
  const band = `M15.2,${y - 0.4} Q24,${y + 4.6} 32.8,${y - 0.4} L33.6,${y + 3.2} Q24,${y + 9} 14.4,${y + 3.2} Z`;
  const rayures = (id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map(i => `<rect x="${8 + i * 6}" y="${y - 10}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${y + 5})"/>`).join(''));
  const maille = d => clip(`${uid}m${view}`, d, [17, 20.5, 24, 27.5, 31].map(x => L([x, y - 1], [x - 0.8, y + 10], tone(col, 0.85), 0.5)).join(''));
  let s = '';
  if (view === 'ne') {
    const pan = `M28,${y + 3.4} L31.2,${y + 2.8} L32.6,${y + 13} L29.2,${y + 13.4} Z`;
    s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, 'none');
    return s + P(pan, col) + clip(`${uid}p${view}`, pan, [y + 6, y + 9.4].map(yy => `<rect x="27" y="${r2(yy)}" width="7" height="1.5" fill="${raie}"/>`).join('')) + P(pan, 'none')
      + [0.7, 1.6, 2.5].map(d => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join('');
  }
  const ex = view === 'se' ? 24.6 : 27.4;
  const pan = `M${ex},${y + 3.6} L${r2(ex + 3)},${y + 3.2} L${r2(ex + 3.6)},${y + 13.4} L${r2(ex + 0.2)},${y + 13.8} Z`;
  s += P(pan, col) + clip(`${uid}p${view}`, pan, [y + 6.2, y + 9.6].map(yy => `<rect x="${ex - 1}" y="${r2(yy)}" width="7" height="1.5" fill="${raie}"/>`).join('')) + P(pan, 'none')
    + [0.7, 1.6, 2.5].map(d => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join('');
  s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, 'none');
  // le nœud : un bourrelet sous le menton
  return s + E(view === 'se' ? 22.4 : 24.6, y + 4, 2.4, 1.7, tone(col, 0.9), 0.9);
}
// Bonnet tricoté ajusté : il coiffe le crâne jusqu'au-dessus des oreilles ; son revers est une bande courbe qui suit le
// front (au-dessus des sourcils) ; côtes de tricot, pompon (assez bas pour rester dans le cadre au rebond de la marche).
// Les mèches du dessus se rangent dessous (crochet c.coiffe du maître) ; la frange dépasse sous le revers
function bonnet(uid, view, [col, revers]) {
  const k = view === 'se' ? -0.8 : 0, X = x => r2(x + k);
  const dome = `M${X(10.4)},15.6 Q${X(9.8)},3.8 ${X(24)},3.6 Q${X(38.2)},3.8 ${X(37.6)},15.6 Z`;
  const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${X(38)},12.8 L${X(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
  const cotes = [-11, -6.6, -2.2, 2.2, 6.6, 11].map(d => `<path d="M${X(24 + d * 0.55)},4.2 Q${X(24 + d * 1.05)},8 ${X(24 + d * 1.1)},15.4" fill="none" stroke="${tone(col, 0.8)}" stroke-width="0.6"/>`).join('');
  const mailles = [-12, -8, -4, 0, 4, 8, 12].map(d => L([24 + d + k, 13.6 + (Math.abs(d) < 6 ? 1 : 0.4) - Math.abs(d) * 0.05], [24 + d * 1.01 + k, 16.4 + (Math.abs(d) < 6 ? 1.1 : 0.4) - Math.abs(d) * 0.05], tone(revers, 0.84), 0.5)).join('');
  return P(dome, col) + clip(`${uid}bn${view}`, dome, cotes + `<rect x="${X(27.6)}" y="2" width="12" height="15" fill="${tone(col, 0.86)}" opacity="0.7"/>`) + P(dome, 'none')
    + P(rim, revers) + clip(`${uid}rv${view}`, rim, mailles) + P(rim, 'none')
    + E(X(24), 3.6, 2.6, 2.3, revers) + E(X(23.3), 2.9, 0.9, 0.7, '#FFFFFF', 0);
}
// Cache-oreilles : l'arceau posé sur les cheveux (sous la sangle des loupes de Rivet), puis les pompons de fourrure sur
// les oreilles (crochet c.coiffe du maître, en deux temps : 'arceau', 'oreilles')
function cacheOreilles(uid, view, [col, arceau], part) {
  if (part === 'arceau') {
    const d = view === 'se' ? 'M13.4,20.4 Q12.6,8.6 24.2,8.2 Q36.2,8.6 35.8,20.4' : 'M12.6,20.4 Q12,7.6 24,7.4 Q36,7.6 35.4,20.4';
    return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${arceau}" stroke-width="1.2" stroke-linecap="round"/>`;
  }
  const muffs = view === 'se' ? [[35.4, 22.6]] : view === 'ne' ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
  return muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P(`M${r2(x - 1.7)},${r2(y + 1.3)} Q${x},${r2(y + 2.6)} ${r2(x + 1.7)},${r2(y + 1.3)}`, 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`)
    + E(x - 0.7, y - 1.2, 0.9, 0.8, '#FFFFFF', 0)).join('');
}
// Châle tricoté, drapé sur les épaules et le haut des bras (par-dessus les bras), ses deux pans croisés et noués sur la
// poitrine, des franges ; de dos, une grande pointe frangée (y : le haut du cou ; e : demi-largeur aux épaules)
function chale(uid, view, y, e, [col, frange]) {
  const S = tone(col, 0.82), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6;
  const tricot = () => [0, 1, 2, 3, 4, 5].map(i => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join('') + [0, 1, 2, 3, 4, 5].map(i => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join('');
  if (view === 'ne') {
    const d = `M${L0},${y + 5.4} Q${24 - e - 1},${y + 0.4} 24,${y - 0.2} Q${24 + e + 1},${y + 0.4} ${R0},${y + 5.4} Q${R0 + 0.2},${y + 8.4} ${R0 - 1.2},${y + 9.6} L24,${y + 17.6} L${L0 + 1.2},${y + 9.6} Q${L0 - 0.2},${y + 8.4} ${L0},${y + 5.4} Z`;
    return P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="25.6" y="${y - 2}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P(d, 'none')
      + [-1.6, -0.5, 0.6, 1.7].map(dx => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join('');
  }
  const o = view === 'se' ? 22 : 24;
  const d = `M${o - 5.6},${y + 0.6} L${o},${y + 8.6} L${o + 5.6},${y + 0.6} Q${R0 - 2.4},${y + 1.4} ${R0},${y + 4.6} Q${R0 + 0.6},${y + 7.6} ${R0 - 0.2},${y + 10} Q${o + 6},${y + 11.4} ${o + 1.6},${y + 10.2} L${o},${y + 11.6} L${o - 1.6},${y + 10.2} Q${o - 6},${y + 11.4} ${L0 + 0.2},${y + 10} Q${L0 - 0.6},${y + 7.6} ${L0},${y + 4.6} Q${L0 + 2.4},${y + 1.4} ${o - 5.6},${y + 0.6} Z`;
  let s = P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${o + 3.4}" y="${y - 2}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P(d, 'none');
  // le nœud et les deux pans qui pendent, frangés
  const pan = (dx, sg) => `M${o + dx},${y + 10.4} L${o + dx + sg * 2.4},${y + 10.6} L${o + dx + sg * 2.8},${y + 15} L${o + dx + sg * 0.4},${y + 15.2} Z`;
  s += P(pan(0.2, 1), S) + P(pan(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
  return s + [0.6, 1.5, 2.4].map(t => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join('');
}
// Pèlerine de laine : une courte cape sur les épaules et le haut des bras (par-dessus les bras), un bord en feston de
// laine, un petit capuchon rabattu dans le dos (sous la barbe de Galet, devant)
function pelerine(uid, view, y, e, [col, bord]) {
  const S = tone(col, 0.8), L0 = 24 - e - 3.8, R0 = 24 + e + 3.8, B = y + 10.6;
  const d = `M${24 - e - 0.4},${y + 0.8} Q24,${y - 1.4} ${24 + e + 0.4},${y + 0.8} Q${R0 - 0.6},${y + 3} ${R0},${B} Q24,${B + 3.4} ${L0},${B} Q${L0 + 0.6},${y + 3} ${24 - e - 0.4},${y + 0.8} Z`;
  let s = P(d, col) + clip(`${uid}pl${view}`, d, `<rect x="${view === 'se' ? 25.4 : 27.2}" y="${y - 2}" width="18" height="18" fill="${S}"/>`
    + `<path d="M0,${B - 1.2} Q24,${B + 2.2} 48,${B - 1.2} L48,${B + 6} L0,${B + 6} Z" fill="${bord}"/>`
    + [-10, -6, -2, 2, 6, 10].map(x => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join('')) + P(d, 'none');
  if (view === 'ne') s += P(`M17.6,${y + 1.4} Q24,${y + 8.6} 30.4,${y + 1.4} Q30,${y + 6.8} 24,${y + 8.2} Q18,${y + 6.8} 17.6,${y + 1.4} Z`, S, 0.8);
  return s;
}
// Étole de fourrure : une large pèlerine de fourrure sur les épaules et le haut des bras (par-dessus les bras), au bord
// festonné, des touffes ; de dos, plus longue, elle dépasse sous les cheveux
function etole(uid, view, y, e, [col]) {
  const S = tone(col, 0.84), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6, B = y + (view === 'ne' ? 9.4 : 7.6), n = 6;
  const festons = (x0, x1, yb) => { let d = ''; const l = (x1 - x0) / n; for (let i = n - 1; i >= 0; i--) d += ` Q${r2(x0 + l * (i + 0.5))},${r2(yb + 1.6)} ${r2(x0 + l * i)},${r2(yb)}`; return d; };
  const d = `M${r2(24 - e - 0.4)},${r2(y + 0.6)} Q24,${r2(y - 1.8)} ${r2(24 + e + 0.4)},${r2(y + 0.6)} Q${r2(R0 - 0.6)},${r2(y + 2)} ${r2(R0)},${r2(B)}${festons(L0, R0, B)} Q${r2(L0 + 0.6)},${r2(y + 2)} ${r2(24 - e - 0.4)},${r2(y + 0.6)} Z`;
  const touffes = [-9, -5, -1, 3, 7, 10].map((dx, i) => `<path d="M${r2(24 + dx - 1)},${r2(y + 3 + (i % 2) * 2)} q1,1.2 2,0" fill="none" stroke="${S}" stroke-width="0.6" stroke-linecap="round"/>`).join('');
  return P(d, col, 0.9) + clip(`${uid}et${view}`, d, touffes + `<rect x="${view === 'se' ? 25.6 : 27.4}" y="${r2(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P(d, 'none', 0.9);
}

// Les tenues d'hiver, par maître : la coiffe [dessin, couleurs], le cou (écharpe), les épaules (châle, pèlerine ou étole),
// les moufles [laine, revers], les bottes fourrées [cuir, fourrure] (pour qui va pieds nus) ; sansFoulard : l'écharpe
// remplace le foulard du maître. Ondin garde son bonnet de nuit,
// Galet son bonnet troué, Mélisse son chapeau de paille et ses sabots, Aster son ciré.
const HIVER = {
  aster: { tete: ['bonnet', ['#3E5A8C', '#F1E6CC']], cou: ['#C8463A', '#F1E6CC'], sansFoulard: true, moufles: ['#3E5A8C', '#F1E6CC'] },
  rivet: { tete: ['cacheOreilles', ['#C8463A', '#C8463A']], cou: ['#E8A23A', '#F1E6CC'], moufles: ['#C8463A', '#F1E6CC'] },
  cannelle: { epaules: ['chale', ['#7A3E5E', '#F1E6CC']], moufles: ['#C8463A', '#F1E6CC'] },
  ondin: { cou: ['#F2C04B', '#3E78C8'], moufles: ['#F2C04B', '#3E78C8'], bottes: ['#5E3A22', '#F1E6CC'] },
  sylve: { epaules: ['etole', ['#E8DCC4']], moufles: ['#6E7A44', '#E8DCC4'], bottes: ['#8A6A44', '#E8DCC4'] },
  galet: { epaules: ['pelerine', ['#6E5A8A', '#E8DCC4']], moufles: ['#C8463A', '#F1E6CC'] },
  melisse: { cou: ['#E3C27A', '#5A4A8A'], moufles: ['#5A4A8A', '#E3C27A'] }
};
const COIFFES = { bonnet, cacheOreilles };
const EPAULES = { chale, pelerine, etole };
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const botteFourree = DESSINS.bottesFourrees.pieds;

// Le maître habillé pour l'hiver. y : le haut du cou (sous les épaules) ; e : la demi-largeur aux épaules
function enHiver(m) {
  const t = HIVER[slug(m.name)];
  const y = m.shoulders[0][1] - 3.2, e = (m.shoulders[1][0] - m.shoulders[0][0]) / 2;
  const c = { ...m, uid: `${m.uid}hv` };
  // les moufles : la main de leur couleur ; le revers tricoté au poignet, sur une manche à revers
  if (t.moufles) { c.hand = t.moufles[0]; if (!m.sleeves && m.cuff !== undefined) c.cuff = t.moufles[1]; }
  if (t.bottes) c.foot = (cc, x, yy, dir, tilt) => botteFourree(cc, {}, t.bottes, [x, yy, dir, tilt]);
  if (t.tete) c.coiffe = (cc, ctx, part) => COIFFES[t.tete[0]](cc.uid, ctx.view, t.tete[1], part);
  const neck0 = m.neck, over0 = m.overArms;
  if (t.cou) c.neck = function (cc, ctx) { return (neck0 && !t.sansFoulard ? neck0.call(this, cc, ctx) : '') + echarpe(cc.uid, ctx.view, y, t.cou); };
  if (t.epaules) c.overArms = function (cc, ctx) { return (over0 ? over0.call(this, cc, ctx) : '') + EPAULES[t.epaules[0]](cc.uid, ctx.view, y, e, t.epaules[1]); };
  return c;
}

module.exports = { enHiver, HIVER };
