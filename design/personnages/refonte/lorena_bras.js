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
const { poserBras, anneau, ligneBras, pointLigne, sousLigne, longueurLigne } = require('./membres');

const pt = q => `${r2(q[0])},${r2(q[1])}`;
const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
// un mélange de deux couleurs (t : la part de la seconde)
const mix = (x, y, t) => '#' + [16, 8, 0].map(k => Math.round(((parseInt(x.slice(1), 16) >> k) & 255) * (1 - t) + ((parseInt(y.slice(1), 16) >> k) & 255) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
const forme = (pts, fill, w = 0.6) => `<path d="M${pts.map(pt).join(' L')} Z" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`;

// pal(c), marks(c) : les couleurs et les marques de Lorena (lorena_refonte.js)
function fabriquerBras({ pal, marks }) {
  return function bras(c, a, b, elbow, main, partie = 'tout') {
    ({ b, elbow, main } = poserBras(c, a, b, elbow, main));
    const K = pal(c), M = marks(c), t = c.tenue || 'cire';
    // la ligne du bras (membres.js : souple, le coude arrondi) ; le haut de la manche s'enfonce sous l'épaule, comme
    // dans le kit. Tout ce qui est sur la manche suit la ligne, là où il est : sa direction u, sa normale n (tournée
    // vers la gauche de l'écran, vers la lumière)
    const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
    const pts = sousLigne(ligne, tot - 1.1, 0), len = tot - 1.1;
    const ici = k => { const { p, u: [ux, uy] } = pointLigne(pts, k); let nx = -uy, ny = ux; if (nx > 0) { nx = -nx; ny = -ny; } return { p, ux, uy, nx, ny }; };
    const off = (k, o, dk = 0) => { const { p, ux, uy, nx, ny } = ici(k); return [p[0] + nx * o + ux * dk, p[1] + ny * o + uy * dk]; };
    const chemin = list => 'M' + list.map(pt).join(' L');
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
    const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : len; // l'avant-bras (bras plié), sinon tout le bras
    const coupe = arrachee ? Math.min(4.4, avb * 0.5) : retroussee ? Math.min(5.8, avb * 0.55) : 0;
    const bande = arrachee ? c.bandage && ((c.bandage === 'right') === droit) : retroussee && M.wrist && droit;
    const dManche = chemin(sousLigne(pts, len, coupe));
    // un trait qui suit le bras, de k0 à k1 du poignet, décalé de o (vers la lumière)
    const long = (k0, k1, o) => chemin(sousLigne(pts, k0, k1).map((q, i, l) => { const k = k0 + (k1 - k0) * i / Math.max(1, l.length - 1), { nx, ny } = ici(k); return [q[0] + nx * o, q[1] + ny * o]; }));
    let s = '';
    if (partie !== 'devant') {
      s += trait(dManche, OUT, w + W * 2) + trait(dManche, tissu, w);
      // reflet (côté lumière) ou liseré de brume (côté ombre), le long du haut de la manche
      const haut = elbow ? len - avb : len - (Math.max(coupe, 2) + 1.5), kA = len - haut * 0.18, kB = len - haut * 0.7;
      s += ombre ? trait(long(kA, kB, -w * 0.32), K.rim, 0.6, ' opacity=".75"')
        : trait(long(kA, kB, w * 0.22), chemise ? '#FFFFFF' : K.coatH, 0.85, ' opacity=".8"');
      // le pli : au coude, un petit arc dans le creux ; bras droit, un trait à mi-bras
      if (elbow) {
        const k = avb;
        s += trait(`M${pt(off(k, w * 0.15))} Q${pt(off(k, 0, 0.9))} ${pt(off(k, -w * 0.3))}`, OUT, 0.42, ' opacity=".35"');
      } else if (!coupe) {
        // bras droit : un pli court, en biais, du côté du corps (là où le tissu se tasse)
        const side = gauche ? -1 : 1;
        s += trait(`M${pt(off(len * 0.5, side * -w * 0.42))} L${pt(off(len * 0.5, side * -w * 0.08, 0.8))}`, OUT, 0.4, ' opacity=".3"');
      }
      // le poignet de la tenue
      if (!coupe) {
        // le poignet : une bande d'un ton plus sombre que la manche, coupée net, sa couture au-dessus ; un anneau autour
        // du bras (membres.js), qui suit la ligne du bras
        const poignet = mix(tissu, OUT, 0.22), r = anneau(pts, 3.6, 1.6, w / 2), [bx, by] = r.bombe;
        s += `<path d="${r.d}" fill="${poignet}"/>` + trait(r.bord(3.6), OUT, 0.45);
        if (t === 'cire' || t === 'ouvert') {
          // la patte de serrage du ciré, sur le dessus du poignet
          const P4 = (dk, o) => { const q = off(2.8, o, dk); return [q[0] + bx * 0.85, q[1] + by * 0.85]; };
          s += forme([P4(-0.55, w * 0.55), P4(0.55, w * 0.55), P4(0.55, -w * 0.15), P4(-0.55, -w * 0.15)], c.sleeve, 0.45);
        } else {
          // un bouton : laiton sur la vareuse, nacre sur la chemise
          const m = off(2.7, w * 0.18);
          s += E(m[0] + bx * 0.9, m[1] + by * 0.9, 0.42, 0.42, t === 'vareuse' ? K.brass : '#F7F2E6', 0.35);
        }
      }
    }
    if (partie === 'derriere') return s;
    if (coupe) {
      const h = w / 2 + 0.5;
      // l'avant-bras nu, le long du bras
      const fd = chemin(sousLigne(pts, coupe, 0));
      s += trait(fd, OUT, fw + W * 2) + trait(fd, c.skin, fw);
      // le bandage : deux tours de toile en biais autour de l'avant-bras (des anneaux qui suivent le bras, pas plus
      // larges que lui), et un bout qui pend, collé au bras
      if (bande) {
        const hh = fw / 2 + 0.25;
        for (const k of [2.6, 3.7]) {
          const P2 = (dk, o) => off(k + dk, o), bom = hh * 0.3 * ici(k).uy, { ux, uy } = ici(k);
          const A1 = P2(0.45 + 0.35, hh), A2 = P2(0.45 - 0.35, -hh), B2 = P2(-0.45 - 0.35, -hh), B1 = P2(-0.45 + 0.35, hh);
          const ctl = (p, q) => [(p[0] + q[0]) / 2 + ux * bom * 2, (p[1] + q[1]) / 2 + uy * bom * 2];
          s += `<path d="M${pt(A1)} Q${pt(ctl(A1, A2))} ${pt(A2)} L${pt(B2)} Q${pt(ctl(B1, B2))} ${pt(B1)} Z" fill="${K.cloth}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>`;
        }
        const q = off(3.1, -hh), sx = ici(3.1).nx > 0 ? 1 : -1; // (du côté du bout : -n)
        s += forme([q, [q[0] - sx * 0.5, q[1] + 1.6], [q[0] - sx * 1.05, q[1] + 0.9]], K.cloth, 0.4);
      }
      // le bout de la manche, par-dessus l'avant-bras : retroussé (un bourrelet) ou arraché (un bord déchiré)
      if (retroussee) {
        // le bourrelet de la manche roulée : une bande à peine plus large que la manche, son pli au milieu ; à plat
        // (à mi-bras, un anneau bombé ferait une articulation)
        const hw = w / 2 + 0.45, r = anneau(pts, coupe + 0.75, coupe - 0.55, hw, 0);
        s += `<path d="${r.d}" fill="${tissu}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`
          + trait(anneau(pts, coupe + 0.1, coupe + 0.1, hw * 0.8, 0).bord(coupe + 0.1), mix(tissu, OUT, 0.35), 0.45);
      } else {
        // le bord arraché : trois dents inégales qui pendent vers le poignet
        const dents = [1, 0.6, 0.2, -0.2, -0.6, -1].map((v, i) => off(coupe, v * h, [0.3, 1.1, 0.4, 0.8, 0.2, 0.6][i]));
        s += forme([off(coupe, h, -0.8), ...dents, off(coupe, -h, -0.8)], tissu, 0.55);
      }
    }
    return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin));
  };
}

module.exports = { fabriquerBras, poserBras };
