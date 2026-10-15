// Lorena (anciennement Hermine ; fichiers du jeu : aster) : ses bras, dessinés par elle (troupe.arm passe la main à c.bras).
// Une manche est une pièce du vêtement, comme le buste :
// - la lumière vient d'en haut à gauche de l'écran : le bras de gauche a son reflet, celui de droite passe à l'ombre du
//   vêtement (la même ombre que le côté droit du buste) avec le liseré de brume au bord ;
// - un pli au coude (bras plié) ou à mi-bras (bras droit) ;
// - le poignet de la tenue : bord-côte et patte du ciré, poignet boutonné de la vareuse, revers de la chemise ;
// - le poignet bandé (l'état : marks.wrist) : la manche de ce bras est retroussée, le bandage est sur la peau ;
// - la naufragée (c.sleeves 'torn') : la manche arrachée sous le coude, au bord déchiré, l'avant-bras nu ; son bandage
//   (c.bandage) sur l'avant-bras de ce côté.
// Le bandage est sur son bras droit : de face et de trois quarts, à gauche de l'écran ; de dos, à droite.
const { OUT, W, E, r2 } = require('../troupe');
const { bras2os, brasMarche } = require('./membres');

const pt = q => `${r2(q[0])},${r2(q[1])}`;
const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
// un mélange de deux couleurs (t : la part de la seconde)
const mix = (x, y, t) => '#' + [16, 8, 0].map(k => Math.round(((parseInt(x.slice(1), 16) >> k) & 255) * (1 - t) + ((parseInt(y.slice(1), 16) >> k) & 255) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
const forme = (pts, fill, w = 0.6) => `<path d="M${pts.map(pt).join(' L')} Z" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`;

// La géométrie réelle du bras (membres.js : deux os de longueur fixe) : le coude calculé, la main ramenée au bout du bras
// si la pose la pousse trop loin (ce qu'elle tient suit) ; en courant (c.course), les bras de la marche se plient au
// coude et pompent : la main monte devant, le coude recule
function poserBras(c, a, b, elbow, main) {
  // en marche (c.marcheN), le bras suit ses poses clés, à l'opposé de la jambe de son côté (membres.js)
  if (c.marcheN != null && !c.course && !elbow && main == null) {
    const m = brasMarche(c, a);
    return { b: [r2(m.main[0]), r2(m.main[1])], elbow: m.coude ? [r2(m.coude[0]), r2(m.coude[1])] : null, main };
  }
  if (c.course && !elbow && main == null) {
    const g = a[0] < 24, rest = c.hands[g ? 0 : 1], dx = b[0] - rest[0], dy = b[1] - rest[1];
    elbow = [r2(a[0] + (g ? -1.6 : 1.6) - dx * 0.5), r2(a[1] + 5.2 - dy * 0.35)];
    b = [r2(rest[0] + dx * 1.6 + (g ? 2.4 : -2.4)), r2(a[1] + 7 + dy * 1.4)];
  }
  const r = bras2os(c, a, b, elbow);
  const [dx, dy] = r.decalage;
  if (main != null && (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02)) main = `<g transform="translate(${r2(dx)} ${r2(dy)})">${main}</g>`;
  return { b: [r2(r.main[0]), r2(r.main[1])], elbow: r.coude ? [r2(r.coude[0]), r2(r.coude[1])] : null, main };
}

// pal(c), marks(c) : les couleurs et les marques de Lorena (lorena_refonte.js)
function fabriquerBras({ pal, marks }) {
  return function bras(c, a, b, elbow, main, partie = 'tout') {
    ({ b, elbow, main } = poserBras(c, a, b, elbow, main));
    const K = pal(c), M = marks(c), t = c.tenue || 'cire';
    // le haut de la manche s'enfonce sous l'épaule, comme dans le kit
    const raw = elbow ? [a, elbow, b] : [a, b];
    const [p0, p1] = raw, l0 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
    const pts = [[p0[0] + (p1[0] - p0[0]) / l0 * 1.1, p0[1] + (p1[1] - p0[1]) / l0 * 1.1], ...raw.slice(1)];
    const f = pts[pts.length - 2], len = Math.hypot(b[0] - f[0], b[1] - f[1]) || 1;
    const ux = (b[0] - f[0]) / len, uy = (b[1] - f[1]) / len;
    let nx = -uy, ny = ux;
    if (nx > 0) { nx = -nx; ny = -ny; } // la normale qui pointe vers la gauche de l'écran (vers la lumière)
    const at = k => [b[0] - ux * k, b[1] - uy * k]; // à k du poignet, vers l'épaule
    const off = (q, k) => [q[0] + nx * k, q[1] + ny * k];
    const view = c.view || 'front', gauche = a[0] < 24;
    // son bras droit ; en miroir (c.miroir), l'image sera retournée : son bras droit est l'autre
    const droit = (view === 'ne' ? !gauche : gauche) !== !!c.miroir;
    const ombre = !gauche;
    const w = c.armW, fw = w * 0.8;
    const chemise = t === 'chemise';
    const tissu = ombre ? (chemise ? K.shirtS : K.coatS) : c.sleeve;
    // la manche s'arrête : arrachée (naufragée), retroussée (le poignet bandé), ou jusqu'au poignet
    const arrachee = c.sleeves === 'torn', retroussee = !arrachee && (c.sleeves === 'roll' || (M.wrist && droit));
    // (assez haut pour que l'avant-bras se voie entre la manche et la main ; l'arrachée sous la voile de la naufragée)
    const coupe = arrachee ? Math.min(4.4, len * 0.5) : retroussee ? Math.min(5.8, len * 0.55) : 0;
    const bande = arrachee ? c.bandage && ((c.bandage === 'right') === droit) : retroussee && M.wrist && droit;
    const dManche = 'M' + [...pts.slice(0, -1), coupe ? at(coupe) : b].map(pt).join(' L');
    let s = '';
    if (partie !== 'devant') {
      s += trait(dManche, OUT, w + W * 2) + trait(dManche, tissu, w);
      // reflet (côté lumière) ou liseré de brume (côté ombre), le long du haut de la manche
      const q0 = pts[0], q1 = pts.length > 2 ? pts[1] : at(Math.max(coupe, 2) + 1.5);
      const A = [q0[0] + (q1[0] - q0[0]) * 0.18, q0[1] + (q1[1] - q0[1]) * 0.18], B = [q0[0] + (q1[0] - q0[0]) * 0.7, q0[1] + (q1[1] - q0[1]) * 0.7];
      s += ombre ? trait(`M${pt(off(A, -w * 0.32))} L${pt(off(B, -w * 0.32))}`, K.rim, 0.6, ' opacity=".75"')
        : trait(`M${pt(off(A, w * 0.22))} L${pt(off(B, w * 0.22))}`, chemise ? '#FFFFFF' : K.coatH, 0.85, ' opacity=".8"');
      // le pli : au coude, un petit arc dans le creux ; bras droit, un trait à mi-bras
      if (elbow) {
        const e = pts[1];
        s += trait(`M${pt(off(e, w * 0.15))} Q${pt([e[0] + ux * 0.9, e[1] + uy * 0.9])} ${pt(off(e, -w * 0.3))}`, OUT, 0.42, ' opacity=".35"');
      } else if (!coupe) {
        // bras droit : un pli court, en biais, du côté du corps (là où le tissu se tasse)
        const m = at(len * 0.5), side = gauche ? -1 : 1;
        s += trait(`M${pt(off(m, side * -w * 0.42))} L${pt(off([m[0] + ux * 0.8, m[1] + uy * 0.8], side * -w * 0.08))}`, OUT, 0.4, ' opacity=".3"');
      }
      // le poignet de la tenue
      if (!coupe) {
        // le poignet : une bande d'un ton plus sombre que la manche, coupée net, sa couture au-dessus
        const c0 = at(3.6), c1 = at(1.6), poignet = mix(tissu, OUT, 0.22);
        s += `<path d="M${pt(c0)} L${pt(c1)}" fill="none" stroke="${poignet}" stroke-width="${r2(w)}" stroke-linecap="butt"/>`
          + trait(`M${pt(off(c0, w / 2))} L${pt(off(c0, -w / 2))}`, OUT, 0.45);
        if (t === 'cire' || t === 'ouvert') {
          // la patte de serrage du ciré, sur le dessus du poignet
          const m = at(2.8);
          s += forme([off([m[0] - ux * 0.55, m[1] - uy * 0.55], w * 0.55), off([m[0] + ux * 0.55, m[1] + uy * 0.55], w * 0.55), off([m[0] + ux * 0.55, m[1] + uy * 0.55], -w * 0.15), off([m[0] - ux * 0.55, m[1] - uy * 0.55], -w * 0.15)], c.sleeve, 0.45);
        } else {
          // un bouton : laiton sur la vareuse, nacre sur la chemise
          const m = off(at(2.7), w * 0.18);
          s += E(m[0], m[1], 0.42, 0.42, t === 'vareuse' ? K.brass : '#F7F2E6', 0.35);
        }
      }
    }
    if (partie === 'derriere') return s;
    if (coupe) {
      const cut = at(coupe), h = w / 2 + 0.5;
      // l'avant-bras nu
      const fd = `M${pt(cut)} L${pt(b)}`;
      s += trait(fd, OUT, fw + W * 2) + trait(fd, c.skin, fw);
      // le bandage : deux tours de toile en biais, un bout qui pend
      if (bande) {
        for (const k of [2.6, 3.7]) {
          const m = at(k), d = 0.45;
          s += forme([off([m[0] - ux * d - uy * 0.35, m[1] - uy * d], fw * 0.62), off([m[0] + ux * d - uy * 0.35, m[1] + uy * d], fw * 0.62), off([m[0] + ux * d + uy * 0.35, m[1] + uy * d], -fw * 0.62), off([m[0] - ux * d + uy * 0.35, m[1] - uy * d], -fw * 0.62)], K.cloth, 0.45);
        }
        const q = off(at(3.1), -fw * 0.62);
        s += forme([q, [q[0] - nx * 1.4 + ux * 0.4, q[1] - ny * 1.4 + uy * 0.4], [q[0] - nx * 1.1 + ux * 1.1, q[1] - ny * 1.1 + uy * 1.1]], K.cloth, 0.4);
      }
      // le bout de la manche, par-dessus l'avant-bras : retroussé (un bourrelet) ou arraché (un bord déchiré)
      if (retroussee) {
        // le bourrelet de la manche roulée : une bande à peine plus large que la manche, son pli au milieu
        const r0 = at(coupe + 0.75), r1 = at(coupe - 0.55), hw = w / 2 + 0.45;
        s += forme([off(r0, hw), off(r1, hw * 0.92), off(r1, -hw * 0.92), off(r0, -hw)], tissu, 0.7)
          + trait(`M${pt(off(at(coupe + 0.1), hw * 0.8))} L${pt(off(at(coupe + 0.1), -hw * 0.8))}`, mix(tissu, OUT, 0.35), 0.45);
      } else {
        // le bord arraché : trois dents inégales qui pendent vers le poignet
        const base = [cut[0] - ux * 0.8, cut[1] - uy * 0.8];
        const dents = [1, 0.6, 0.2, -0.2, -0.6, -1].map((v, i) => off([cut[0] + ux * [0.3, 1.1, 0.4, 0.8, 0.2, 0.6][i], cut[1] + uy * [0.3, 1.1, 0.4, 0.8, 0.2, 0.6][i]], v * h));
        s += forme([off(base, h), ...dents, off(base, -h)], tissu, 0.55);
      }
    }
    return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin));
  };
}

module.exports = { fabriquerBras, poserBras };
