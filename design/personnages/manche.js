// La manche : la règle canonique (choix de l'auteur, 15 oct. : « il faut vraiment en faire une règle canonique en
// code, cette histoire de manche me tue »). Une seule fonction dessine le bras habillé, pour toutes les tenues, tous les
// corps, toutes les vues et toutes les poses. Branchée sur l'avatar (et son naufragé) par c.bras (troupe.arm lui passe
// la main) ; les maîtres et les habitants s'y brancheront un par un, chacun montré avant.
//
// La règle :
// 1. Une manche est une surface de tissu, pleine, jamais un trait épais posé sur le corps.
// 2. Elle naît de l'épaule : son haut est l'arrondi de l'épaule (une calotte), à fleur de la ligne du buste, qui la
//    prolonge ; côté buste, la couture est un fil de l'ombre du tissu, pas un trait d'encre.
// 3. Elle tombe le long du bras, un peu plus large que lui (l'aisance du tissu) ; une manche courte s'évase un peu.
// 4. Tout bord est une coupe du cylindre du bras : un arc bombé vers la main, jamais une ligne droite ni un anneau
//    (l'ourlet, le poignet, le revers roulé, la déchirure).
// 5. Le bras nu sort de la manche, dessous ; le bord de la manche pose son ombre sur la peau.
// 6. La lumière est celle du kit (en haut à gauche) : un reflet le long du bord éclairé, un pli d'ombre de l'autre côté.
// 7. Au coude plié, la manche suit le bras (un seul contour) et fait un pli dans le creux.
// 8. Le bras garde toujours sa longueur (choix de l'auteur, 15 oct. : « pas toujours même longueur ») : celle du bras
//    au repos (c.longBras), de l'épaule au coude puis du coude à la main, à parts égales. Une main plus proche plie le
//    coude (du côté du coude demandé, sinon vers le dehors et le bas) ; une main trop loin est ramenée au bout du bras
//    tendu : il ne s'étire jamais, il ne raccourcit jamais.
//
// bras(c, a, b, elbow, main, partie) : l'épaule a, la main b, le coude facultatif ; main : un autre dessin que le poing ;
// partie : 'tout', 'derriere' (le bras sans la main) ou 'devant' (la main seule, et le bandage). Les longueurs se règlent
// sur c : c.sleeves (undefined : longue ; 'court' ; 'roll' : retroussée ; 'torn' : arrachée), c.sleeveCut (où s'arrête
// une manche retroussée ou arrachée, depuis le poignet), c.cuff (la couleur du poignet ou du revers), c.sleeve (le
// tissu), c.brasNu (un bras nu), c.armW (l'épaisseur du bras), c.bandage.
const { OUT, W, E, L, r2 } = require('./troupe');

const pt = q => `${r2(q[0])},${r2(q[1])}`;
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
const unit = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
// un mélange vers le noir ou le blanc (k < 1 : plus sombre), en gardant la teinte à peu près
const ton = (hex, k) => '#' + [16, 8, 0].map(s => { const v = (parseInt(hex.slice(1), 16) >> s) & 255; return Math.round(k < 1 ? v * k : v + (255 - v) * (k - 1)).toString(16).padStart(2, '0'); }).join('').toUpperCase();

// Une ligne brisée (les points de l'épaule à la main) coupée à la longueur len depuis son début
function couper(pts, len) {
  const out = [pts[0]];
  let reste = len;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (reste <= l) { out.push(add(a, unit(a, b), reste)); return out; }
    out.push(b); reste -= l;
  }
  return out;
}
const longueur = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
// Les deux bords d'un tube le long d'une ligne brisée, d'une demi-largeur h0 au début à h1 à la fin. Au coude, le
// dehors tourne en arc (un coude est rond) et le creux se pince en un point (le pli), sans jamais s'envoler en pointe ;
// G : le bord à gauche de la marche (la normale (-uy, ux)), D : l'autre
function bords(pts, h0, h1) {
  const tot = longueur(pts) || 1, G = [], D = [];
  let fait = 0;
  pts.forEach((p, i) => {
    if (i) fait += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const h = h0 + (h1 - h0) * fait / tot;
    const u0 = i ? unit(pts[i - 1], p) : unit(p, pts[1]), u1 = i < pts.length - 1 ? unit(p, pts[i + 1]) : u0;
    const n0 = [-u0[1], u0[0]], n1 = [-u1[1], u1[0]];
    const cross = u0[0] * u1[1] - u0[1] * u1[0], dot = u0[0] * u1[0] + u0[1] * u1[1];
    if (Math.abs(cross) < 0.05 && dot > 0) { // tout droit
      const m = unit([0, 0], [n0[0] + n1[0], n0[1] + n1[1]]);
      G.push(add(p, m, h)); D.push(add(p, m, -h));
      return;
    }
    // le creux : le croisement des deux bords intérieurs, pas plus loin que 1,4 h du coude
    const k = cross > 0 ? 1 : -1; // le bras tourne vers G (k = 1) ou vers D
    const mi = unit([0, 0], [n0[0] + n1[0], n0[1] + n1[1]]), cosHalf = Math.max(0.2, Math.sqrt((1 + dot) / 2));
    const creux = add(p, mi, k * Math.min(h / cosHalf, h * 1.4));
    // le dehors : un arc de n0 à n1, du côté opposé au virage
    const a0 = Math.atan2(-k * n0[1], -k * n0[0]), a1 = Math.atan2(-k * n1[1], -k * n1[0]);
    let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const arcPts = Array.from({ length: 6 }, (_, j) => { const t = a0 + da * j / 5; return [p[0] + Math.cos(t) * h, p[1] + Math.sin(t) * h]; });
    if (k > 0) { G.push(creux); D.push(...arcPts); } else { D.push(creux); G.push(...arcPts); }
  });
  return { G, D };
}
// L'intersection de deux droites (p + t·d, q + s·e) ; null si elles sont parallèles
function croise(p, d, q, e) {
  const det = d[0] * e[1] - d[1] * e[0];
  if (Math.abs(det) < 1e-6) return null;
  const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / det;
  return add(p, d, t);
}
// La racine d'un bras levé : le bras pousse de l'épaule. Le dessus du bras prolonge la ligne d'épaule du buste (la même
// courbe que troupe : de (24 ∓ sw, 32,6) à (24 ± sw, 32,6) par (24, 30)), en une courbe qui la quitte en douceur ; le
// dessous part de l'aisselle, sur le flanc du buste, et remonte en arrondi dans le bras ; la racine couvre le coin du
// buste. a : le point d'épaule (24 ± (sw − 0,5), 34 + dy) ; G, D : les bords du tube.
function racineLevee(a, sgn, manche, G, D, ht) {
  const sw = Math.abs(a[0] - 24) + 0.5, dy = a[1] - 34;
  const epaule = x => { const t = (x - 24 + sw) / (2 * sw); return (1 - t) ** 2 * 32.6 + 2 * t * (1 - t) * 30 + t * t * 32.6 + dy; };
  const u0 = unit(manche[0], manche[1]), n0 = [-u0[1], u0[0]];
  const haut = n0[1] < 0 ? G : D, bas = haut === G ? D : G; // le bord du dessus (vers la tête), celui du dessous
  const long0 = Math.hypot(manche[1][0] - manche[0][0], manche[1][1] - manche[0][1]);
  const surBord = (bord, k) => add(bord[0], u0, Math.min(k, long0 - 0.4));
  // le dessus : de la ligne d'épaule (un peu avant son coin) au bord du dessus, par le croisement des deux tangentes
  const xT = 24 + sgn * (sw - 3), T = [xT, epaule(xT)], pente = (epaule(xT + sgn * 0.5) - T[1]) / 0.5;
  const Ua = surBord(haut, 2.4);
  const Cu = croise(T, [sgn, pente * sgn], Ua, u0) || add(T, [sgn, 0], 1.5);
  // le dessous : de l'aisselle (sur le flanc, sous le coin) au bord du dessous, par le croisement du flanc et du bord
  const A = [24 + sgn * (sw + 0.15), 36.8 + dy], La = surBord(bas, 3);
  let Cl = croise(A, [sgn * 0.12, -1], La, u0);
  if (!Cl || Math.hypot(Cl[0] - A[0], Cl[1] - A[1]) > 4) Cl = [(A[0] + La[0]) / 2, (A[1] + La[1]) / 2];
  const suite = list => list.slice(1).map(q => `L${pt(q)}`).join(' ');
  return {
    forme: (fin, u, bombe) => `M${pt(T)} Q${pt(Cu)} ${pt(Ua)} ${suite(haut)} Q${pt(add(fin, u, bombe))} ${pt(bas[bas.length - 1])} ${bas.slice(1, -1).reverse().map(q => `L${pt(q)}`).join(' ')} L${pt(La)} Q${pt(Cl)} ${pt(A)} L${pt(a)} Z`,
    dessus: `M${pt(T)} Q${pt(Cu)} ${pt(Ua)} ${suite(haut)}`,
    dessous: `M${pt(bas[bas.length - 1])} ${bas.slice(1, -1).reverse().map(q => `L${pt(q)}`).join(' ')} L${pt(La)} Q${pt(Cl)} ${pt(A)}`,
    emmanchure: `M${pt(T)} Q${pt(add(add(a, u0, 1.1), [sgn, 0], 0.4))} ${pt(A)}`
  };
}

// La longueur constante (règle 8) : [coude, main] pour un bras de longueur L, de l'épaule a vers la main b
function plier(a, b, elbow, L, sgn) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), u = unit(a, b);
  if (d >= L - 0.05) return [null, add(a, u, L)]; // tendu (une main trop loin vient au bout du bras)
  const m = add(a, u, d / 2), n = [-u[1], u[0]], h = Math.sqrt((L / 2) ** 2 - (d / 2) ** 2);
  // le côté du coude : celui du coude demandé ; sinon vers le dehors du corps et vers le bas
  const k = elbow ? Math.sign((elbow[0] - m[0]) * n[0] + (elbow[1] - m[1]) * n[1]) || 1 : Math.sign(n[0] * sgn + n[1] * 0.5) || 1;
  return [add(m, n, h * k), b];
}
function bras(c, a, b, elbow, main, partie = 'tout') {
  const sgn = a[0] < 24 ? -1 : 1; // le côté du corps (à l'écran)
  // (une icône, sans main, garde son dessin)
  if (c.longBras && main !== '') [elbow, b] = plier(a, b, elbow, c.longBras, sgn);
  const w = c.armW, ht = w / 2 + 0.75; // la demi-largeur de la manche à l'épaule (le bras et l'aisance du tissu)
  // un bras nu (le débardeur, c.brasNu ; ou une manche de la couleur de la peau) : la même règle, en peau, sans bord
  // (le naufragé du débardeur n'a pas de manche à retrousser)
  const nu = !!c.brasNu || c.sleeve === c.skin;
  // la calotte : son centre un rien vers le cou, assez haut pour que son arrondi passe juste au-dessus du coin du buste
  // (la ligne d'épaule est 1,4 au-dessus du point d'épaule, son coin 0,5 plus loin) : l'épaule devient ronde ; le bras
  // part de là
  const dx = ht * 0.5;
  // un bras levé (le salut, un geste au-dessus de l'épaule) : pas de calotte (tournée à l'opposé du bras, elle
  // rentrerait dans l'aisselle) ; le bras pousse de l'épaule (voir racineLevee) ; il part du point d'épaule
  // (levé : vers le haut, ou à l'horizontale vers le dehors ; un bras qui passe devant le corps garde sa calotte)
  const ul = unit(a, elbow || b), leve = ul[1] < -0.2 || (ul[1] < 0.45 && ul[0] * sgn > 0.2);
  const s0 = leve ? a : [a[0] - sgn * (dx - 0.5), a[1] - 1.4 - 0.3 + Math.sqrt(ht * ht - dx * dx)];
  const brut = elbow ? [s0, elbow, b] : [s0, b];
  const tot = longueur(brut);
  // où s'arrête la manche, depuis l'épaule : longue, au poignet ; courte, au-dessus du
  // coude ; retroussée ou arrachée, à c.sleeveCut du poignet
  // (sans main, une icône : la manche va jusqu'au bout, et son ouverture se voit)
  const sansMain = main === '';
  const genre = nu ? 'nu' : c.sleeves || 'longue';
  // (la longue s'arrête assez haut pour que son poignet se voie au-dessus du poing, qui a un rayon de 2,1)
  const finManche = genre === 'nu' ? tot - 1.2 : genre === 'longue' ? tot - (sansMain ? 0.4 : 2.3) : genre === 'court' ? Math.min(tot * 0.42, 7.2) : tot - Math.min(c.sleeveCut || 5, tot * 0.62);
  const manche = couper(brut, finManche);
  const hh = genre === 'court' ? ht + 0.35 : genre === 'longue' ? w / 2 + (sansMain ? 0.85 : 0.4) : genre === 'nu' ? w / 2 - 0.1 : w / 2 + 0.45;
  const { G, D } = bords(manche, ht, hh);
  const fin = manche[manche.length - 1], u = unit(manche[manche.length - 2], fin);
  const bombe = hh * 0.5; // le bord : une coupe du cylindre, bombée vers la main
  const nrm = [-u[1], u[0]];
  // un arc de bord, k plus haut vers l'épaule, de demi-largeur w0 : [un bout, le contrôle, l'autre bout]
  const arc = (k = 0, w0 = hh) => [add(add(fin, nrm, w0), u, -k), add(fin, u, bombe - k), add(add(fin, nrm, -w0), u, -k)];
  const arcD = (k, w0) => { const [p, q, e] = arc(k, w0); return `M${pt(p)} Q${pt(q)} ${pt(e)}`; };
  // la forme : un bord, l'ourlet, l'autre bord, la calotte (un demi-rond derrière le départ) ; levé, la racine
  const lev = leve ? racineLevee(a, sgn, manche, G, D, ht) : null;
  const forme = lev ? lev.forme(fin, u, bombe)
    : `M${pt(G[0])} ${G.slice(1).map(p => `L${pt(p)}`).join(' ')} Q${pt(add(fin, u, bombe))} ${pt(D[D.length - 1])} ${D.slice(0, -1).reverse().map(p => `L${pt(p)}`).join(' ')} A${r2(ht)} ${r2(ht)} 0 0 0 ${pt(G[0])} Z`;
  // quel bord est dehors (la silhouette) : celui qui s'éloigne du milieu du corps
  const gDehors = (G[0][0] - s0[0]) * sgn > 0;
  const Dh = gDehors ? G : D, Dd = gDehors ? D : G; // dehors, dedans
  const ligne = list => 'M' + list.map(pt).join(' L');
  // le sommet de la calotte (à l'opposé du bras), pour couper son contour en deux : dehors à l'encre, dedans en couture
  const u0 = unit(brut[0], brut[1]), sommet = add(s0, u0, -ht);
  const tissu = nu ? c.skin : c.sleeve, ombre = ton(tissu, 0.8);
  let s = '';
  const derriere = partie !== 'devant', devant = partie !== 'derriere';
  // l'avant-bras nu, sous la manche (il part de l'intérieur de la manche)
  const avantBras = genre !== 'longue' && genre !== 'nu';
  const fw = w * 0.8;
  if (derriere && avantBras) {
    const fd = ligne([add(fin, u, -1.6), b]);
    s += trait(fd, OUT, fw + W * 2) + trait(fd, c.skin, fw);
  }
  if (derriere) {
    s += `<path d="${forme}" fill="${tissu}"/>`;
    // le reflet (le bord éclairé, à gauche de l'écran) et le pli d'ombre (à droite), dans la manche
    // (des bords plus étroits, du même côté : à 0,75 du bord pour le reflet, à 0,9 pour l'ombre ; sans le bout)
    const gaucheG = G[0][0] < D[0][0];
    const dedansDe = (cote, k) => { const e = bords(manche, ht - k, hh - k); return (cote === 'gauche') === gaucheG ? e.G : e.D; };
    if (!nu && manche.length >= 2) {
      s += trait(ligne(dedansDe('gauche', 0.75).slice(0, -1)), '#FFFFFF', 0.6, ' opacity=".32"');
      s += trait(ligne(dedansDe('droite', 0.9).slice(0, -1)), ombre, 0.9, ' opacity=".55"');
    }
    // le pli au coude, dans le creux (bras plié)
    if (elbow && finManche > Math.hypot(elbow[0] - s0[0], elbow[1] - s0[1]) + 1) {
      // (une courbe douce, parallèle au creux : du bras à l'avant-bras, du côté du pli)
      const ue = unit(s0, elbow), uf = unit(elbow, b), dedans = unit([0, 0], [uf[0] - ue[0], uf[1] - ue[1]]);
      s += trait(`M${pt(add(add(elbow, ue, -1.4), dedans, w * 0.22))} Q${pt(add(elbow, dedans, w * 0.42))} ${pt(add(add(elbow, uf, 1.4), dedans, w * 0.22))}`, ombre, 0.55, ' opacity=".85"');
    }
    // les contours : dehors (la silhouette, de la calotte au bord) à l'encre ; la moitié de la calotte côté buste en
    // couture ; dedans (contre le buste) à l'encre, sous l'aisselle
    const arcDehors = `M${pt(sommet)} A${r2(ht)} ${r2(ht)} 0 0 ${gDehors ? 0 : 1} ${pt(Dh[0])}`;
    const arcDedans = `M${pt(sommet)} A${r2(ht)} ${r2(ht)} 0 0 ${gDehors ? 1 : 0} ${pt(Dd[0])}`;
    if (lev) {
      // le dessus (la ligne d'épaule qui file dans le bras) et le dessous (le flanc qui remonte de l'aisselle) à
      // l'encre ; l'emmanchure, de l'épaule à l'aisselle, bombée vers le bras, en couture
      s += trait(lev.dessus, OUT, W) + trait(lev.dessous, OUT, W);
      s += trait(lev.emmanchure, ombre, 0.55, ' opacity=".85"');
    } else {
      s += trait(arcDehors + ' ' + ligne(Dh).replace('M', 'L'), OUT, W);
      s += trait(arcDedans, ombre, 0.5, ' opacity=".8"');
    }
    // (le bord du dedans, le bras devant le flanc, part du bas de la couture de la calotte)
    if (!lev) s += trait(ligne([add(Dd[0], u0, 0.6), ...Dd.slice(1)]), OUT, W);
    // le bord (l'arc bombé vers la main), puis ce qu'il porte
    if (genre === 'torn') {
      // arrachée : le bord en dents, toujours le long de l'arc
      const dents = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8, x = -hh + 2 * hh * t, y = bombe * (1 - (2 * t - 1) ** 2) + (i % 2 ? 1.1 : -0.2) * (i && i < 8 ? 1 : 0);
        dents.push(add(add(fin, nrm, -x), u, y));
      }
      s += `<path d="M${dents.map(pt).join(' L')} L${pt(add(add(fin, nrm, hh), u, -1.5))} L${pt(add(add(fin, nrm, -hh), u, -1.5))} Z" fill="${tissu}"/>`;
      s += trait(ligne(dents), OUT, 0.85);
    } else if (!nu) {
      if (genre === 'longue' && c.cuff) {
        // le poignet : une bande entre deux arcs, de sa couleur
        const [a0, q0, e0] = arc(sansMain ? 2.4 : 1.7), [a1, q1, e1] = arc(0);
        s += `<path d="M${pt(a0)} Q${pt(q0)} ${pt(e0)} L${pt(e1)} Q${pt(q1)} ${pt(a1)} Z" fill="${c.cuff}" stroke="${OUT}" stroke-width="${r2(W * 0.7)}" stroke-linejoin="round"/>`;
      } else if (genre === 'court') {
        // l'ourlet : une couture qui suit le bord ; un liseré de sa couleur (la robe, bordée de blanc)
        if (c.cuff) s += trait(arcD(0.5), c.cuff, 1);
        s += trait(arcD(1.25, hh - 0.45), ombre, 0.45, ' opacity=".8"');
      }
      s += trait(arcD(0), OUT, W);
      // sans main : l'ouverture de la manche, vue un peu d'en haut (le bord de devant, le bord du fond), la doublure
      // dans l'ombre
      if (sansMain && genre === 'longue') {
        const [a1, q1, e1] = arc(0);
        s += `<path d="M${pt(a1)} Q${pt(q1)} ${pt(e1)} Q${pt(add(fin, u, bombe * 0.15))} ${pt(a1)} Z" fill="${ton(c.cuff || tissu, 0.55)}" stroke="${OUT}" stroke-width="${r2(W * 0.6)}" stroke-linejoin="round"/>`;
      }
    }
    // l'ombre du bord sur la peau qui en sort
    if (avantBras) s += trait(`M${pt(add(add(fin, nrm, fw / 2), u, bombe * 0.6 + 0.2))} Q${pt(add(fin, u, bombe + 1.1))} ${pt(add(add(fin, nrm, -fw / 2), u, bombe * 0.6 + 0.2))}`, 'rgba(0,0,0,.22)', 0.6);
    // le revers roulé (retroussée) : un bourrelet de tissu, une bande bombée entre deux arcs, plus large que la manche,
    // ses deux bouts arrondis, un reflet dessus
    if (genre === 'roll') {
      // le revers roulé (retroussée) : un boudin de tissu roulé sur lui-même, qui suit l'arc du bord (ses bouts ronds),
      // dans la largeur de la manche, un reflet dessus
      const hb = 1.25, mi = arcD(hb * 0.5, hh - 0.3);
      s += trait(mi, OUT, hb + W * 2) + trait(mi, c.cuff || tissu, hb);
      s += trait(arcD(hb * 0.75, hh - 0.9), '#FFFFFF', 0.45, ' opacity=".45"');
    }
  }
  if (!devant) return s;
  // le bandage (le naufragé) : sur l'avant-bras de ce côté du personnage (de dos, l'autre)
  if (c.bandage && avantBras) {
    const screenLeft = a[0] < 24, charLeft = c.view === 'ne' ? screenLeft : !screenLeft;
    if ((c.bandage === 'left') === charLeft) {
      const ub = unit(fin, b), at = k => add(b, ub, -k), nb = [-ub[1], ub[0]], wb = fw + 0.7;
      s += trait(ligne([at(2.2), at(4.4)]), OUT, wb + W * 2) + trait(ligne([at(2.2), at(4.4)]), '#F4EEDF', wb);
      for (const k of [2.9, 3.7]) { const p = at(k); s += L(add(p, nb, wb * 0.48), add(add(p, nb, -wb * 0.48), ub, 0.5), '#C9BFA8', 0.45); }
      const t = at(4), e = add(add(t, nb, 2.2), ub, -0.4);
      s += L(t, e, OUT, 1.5) + L(t, e, '#F4EEDF', 0.7);
    }
  }
  return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ''));
}

module.exports = { bras, REGLE: 'manche' };
