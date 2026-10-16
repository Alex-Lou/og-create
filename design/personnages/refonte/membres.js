// Les membres de la troupe refondue (Lorena, Agathe, Nathan, Robby) : des os de longueur fixe, comme dans un squelette 2D
// (Spine, la cinématique inverse de Unity 2D, les squelettes de Paper2D). Un bras va de l'épaule à la main, une jambe de
// la hanche à la cheville ; chacun a deux os (bras et avant-bras, cuisse et tibia) dont la longueur ne change jamais :
// - le coude ou le genou se calcule (cinématique inverse à deux os), il plie toujours du bon côté ;
// - une main ou un pied qu'on pousse trop loin s'arrête au bout du membre tendu (le membre ne s'étire jamais) ;
// - un membre ramené plus près se plie, sans jamais rétrécir.
// (Choix de l'auteur, 15 oct. : les bras du kit s'allongeaient d'une pose à l'autre, les jambes étaient des barres raides
// qui s'allongeaient et rétrécissaient en marchant.)
const { OUT, W, r2, shoe, frame } = require('../troupe');

// Deux os depuis a vers la cible t (longueurs l1, l2) ; s : de quel côté plie l'articulation (+1 : vers la normale
// (-uy, ux) de a → t, -1 : de l'autre côté). Rend l'articulation (milieu) et le bout réellement atteint.
function ik(a, t, l1, l2, s) {
  const dx = t[0] - a[0], dy = t[1] - a[1], d = Math.hypot(dx, dy) || 1e-6;
  const dd = Math.min(l1 + l2 - 1e-4, Math.max(Math.abs(l1 - l2) + 1e-4, d));
  const ux = dx / d, uy = dy / d;
  const x = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  return { milieu: [a[0] + ux * x - uy * h * s, a[1] + uy * x + ux * h * s], bout: [a[0] + ux * dd, a[1] + uy * dd], plie: h > 0.2, tendu: d >= l1 + l2 - 1e-3 };
}
// de quel côté de a → t se trouve p (+1 : du côté de la normale (-uy, ux))
const cote = (a, t, p) => (((t[0] - a[0]) * (p[1] - a[1]) - (t[1] - a[1]) * (p[0] - a[0])) >= 0 ? 1 : -1);

// Le bras : sa longueur est celle du bras au repos (de l'épaule à la main) ; le coude plie du côté que la pose indique
// (son coude), sinon vers le dehors. Rend { coude, main, decalage } : decalage, de combien la main a été ramenée (ce que
// la main tient suit)
const DROIT = 0.88;
function bras2os(c, a, b, coude) {
  const g = a[0] < 24, repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1];
  // (c.brasL : la longueur des bras, fixée une fois pour toutes, avecOs ; sinon celle du bras au repos)
  const L = c.brasL ? c.brasL[g ? 0 : 1] : Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
  const s = coude ? cote(a, b, coude) : (cote(a, b, [a[0] + (g ? -10 : 10), a[1] + 2]));
  // un bras presque tendu reste droit : le coude ne plie que si la main vient vraiment près de l'épaule (sinon, une
  // cassure de rien au coude, un bras désarticulé ; choix de l'auteur, 15 oct.)
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (d >= L * DROIT) {
    const m = d > L ? [a[0] + (b[0] - a[0]) / d * L, a[1] + (b[1] - a[1]) / d * L] : b;
    return { coude: null, main: m, decalage: [m[0] - b[0], m[1] - b[1]] };
  }
  const r = ik(a, b, L * 0.5, L * 0.5, s);
  return { coude: r.plie ? r.milieu : null, main: r.bout, decalage: [r.bout[0] - b[0], r.bout[1] - b[1]] };
}

// La jambe : de la hanche (le haut de la jambe du kit, à l'aplomb de sa place au repos) à la cheville ; la cuisse et le
// tibia de même longueur, celle de la jambe au repos. Le genou plie vers l'avant : de trois quarts avant, vers la gauche
// de l'écran ; de dos, vers la droite ; de face, vers nous (la jambe se raccourcit, droite). Le pantalon : le tube cerné,
// l'ombre du côté droit, le pli du genou. Puis le pied (c.foot : la chaussure, le pied nu, la boue), qui reçoit le genou.
// Le cycle de marche (c.marcheN : l'image, 0 à 7), en poses clés comme un squelette 2D (Spine, Unity 2D Animation) et
// selon le cycle classique en 8 images (The Animator's Survival Kit ; les marches de sprites, Slynyrd, Finalbossblues) :
// contact (les deux pieds au sol, bras et jambes au bout de leur balancement, le corps au plus bas), appui (le genou
// d'appui plie à peine pour amortir), passage (la jambe d'appui tendue à la verticale, l'autre passe genou plié, le corps
// au plus haut), lever (la jambe qui passe s'allonge devant) ; puis les mêmes de l'autre pied. (Choix de l'auteur, 15 oct. :
// le premier cycle, à jambes « molles », pliait trop les genoux.)
// Pour une jambe : l'angle de la jambe (degrés, + vers l'avant) et de combien le pied se lève (px), image par image ; la
// jambe d'en face a 4 images de décalage. Les jambes de chibi sont trop courtes pour montrer un genou plié : comme dans
// les marches de sprites de trois quarts, la jambe reste droite, et celle qui passe se raccourcit, le pied levé (on lit
// le genou qui vient vers nous). (Choix de l'auteur, 15 oct. : pliées en deux os, elles paraissaient tordues.)
const CUISSE = [16, 9, 0, -8, -16, -11, 1, 12];
const LEVE = [0, 0, 0, 0, 0, 1.2, 1.9, 0.8];
// le bras (degrés, + vers l'avant), opposé à la jambe de son côté : au bout de sa course au contact
const BRAS = [-14, -10, 0, 10, 14, 10, 0, -10];
// La direction « devant » à l'écran (la marche de trois quarts suit la diagonale du regard : vers le bas à gauche, ou vers
// le haut à droite de dos), et de combien un pas en avant descend à l'écran (la profondeur)
const DEVANT = { se: [-0.62, 0.42], ne: [0.62, -0.42], front: [0, 0.3] };
// la jambe gauche de l'écran a quelle image du cycle (le kit la dessine devant l'autre à l'image 0 : de trois quarts, elle
// doit alors être la jambe qui avance, la plus proche de nous ; de dos, celle qui recule)
const phaseJambe = (c, gauche, view) => (c.marcheN + (gauche === (view !== 'ne') ? 0 : 4)) % 8;
// Les deux os d'une jambe en marche, depuis la hanche ; rend le genou et la cheville, et la hauteur de la jambe
function osJambe(c, hanche, i, view) {
  const L = c.ground - c.hip, F = DEVANT[view] || DEVANT.front;
  const a = CUISSE[i] * Math.PI / 180;
  // dans le plan de la marche : u vers l'avant, v vers le bas ; puis à l'écran : u suit la direction « devant »
  const au = L * Math.sin(a), av = L * Math.cos(a) - LEVE[i];
  const P = (u, v) => [hanche[0] + u * F[0], hanche[1] + v + u * F[1]];
  const ch = P(au, av), g = [(hanche[0] + ch[0]) / 2, (hanche[1] + ch[1]) / 2];
  return { genou: g, cheville: ch, plie: false, haut: av + LEVE[i] + au * F[1] };
}
// de combien le corps descend à cette image : le pied le plus bas touche le sol (le corps au plus bas au contact)
function descente(c, view) {
  const L = c.ground - c.hip;
  return L - Math.max(...[true, false].map(g => osJambe(c, [0, 0], phaseJambe(c, g, view), view).haut));
}
// Le bras en marche (lorena_bras.js) : depuis l'épaule, pendu comme au repos, balancé d'avant en arrière dans le plan de
// la marche ; il reste droit (comme les jambes : le bras d'un chibi est trop court pour montrer un coude qui plie, le
// coude cassé faisait un bras désarticulé). La main ne passe jamais sur le buste : de dos ou de trois quarts, le bras
// qui part vers le buste passe derrière lui ; il ne fait que remonter (il s'éloigne ou vient vers nous : on le voit
// en raccourci), au flanc. (Choix de l'auteur, 15 oct. : de dos, la main traversait le dos, un bras « de devant ».)
// Rend la main ; pas de coude.
function brasMarche(c, a) {
  const view = c.view || 'front', g = a[0] < 24, F = DEVANT[view] || DEVANT.front;
  const repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1], La = Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
  // la jambe de son côté a l'image i : le bras est à l'opposé (4 images de décalage)
  const i = (phaseJambe(c, g, view) + 4) % 8, al = BRAS[i] * Math.PI / 180;
  // l'écart du bras au corps, gardé : la direction du bras au repos (ox, oy)
  const ox = (repos[0] - ep[0]) / La, oy = Math.sqrt(Math.max(0, 1 - ox * ox));
  // le bras tourne à l'épaule : ce qui reste dans le plan de l'écran (cos), et ce qui part en profondeur, vu en
  // raccourci le long de la direction « devant » (sin)
  const u = La * Math.sin(al), dx = u * F[0], k = La * Math.cos(al);
  // (vers le buste : vers la droite de l'écran pour le bras de gauche)
  const versBuste = g ? dx > 0 : dx < 0;
  let hx = ox * k + (versBuste ? 0 : dx), hy = oy * k + u * F[1];
  // le bras garde sa longueur : en raccourci il paraît plus court, jamais plus long (choix de l'auteur, 15 oct. : en
  // marche, il s'allongeait jusqu'à 13 %)
  const d = Math.hypot(hx, hy);
  if (d > La) { hx *= La / d; hy *= La / d; }
  return { coude: null, main: [a[0] + hx, a[1] + hy] };
}

// marcher() : l'image n de la marche ; le corps descend de ce que la pose des jambes demande (et non du rebond du kit,
// qu'on annule)
function marcher(c, v, n, e) {
  const cc = { ...c, marcheN: n, view: v };
  const s = frame({ ...c, marcheN: n }, v, 'marche', n, e);
  const reprise = r2((1 - Math.abs(Math.cos(n / 8 * Math.PI * 2))) + descente(cc, v));
  return reprise ? `<g transform="translate(0 ${reprise})">${s}</g>` : s;
}

function jambe(c, x, y, dir, tilt) {
  const view = c.view || 'front', [lx, rx] = c.legX[view], base = x < 24 ? lx : rx;
  const avant = view === 'se' ? -1 : view === 'ne' ? 1 : 0;
  const L = c.ground - c.hip;
  const hanche = [base, c.hip];
  // en marche, la jambe suit ses poses clés (le kit ne donne que la place au repos) ; un personnage qui dessine ses
  // jambes selon la règle de jambe.js (c.jambe) les dessine jusqu'à la cheville que les poses clés donnent
  if (c.marcheN != null) {
    const os = osJambe(c, hanche, phaseJambe(c, x < 24, view), view);
    return c.jambe ? c.jambe(c, r2(os.cheville[0]), r2(os.cheville[1]), dir, 0) : dessinJambe(c, hanche, os, dir, 0, avant);
  }
  if (c.jambe) return c.jambe(c, x, y, dir, tilt);
  tilt = tilt ? r2(tilt * 0.25) : 0;
  // (assis, le tibia part du genou, avancé loin de sa place debout : il descend droit, comme dans le kit)
  if (Math.abs(x - base) > 2.5) hanche[0] = x;
  // la cheville réelle : le talon levé (tilt), la chaussure du kit tourne autour de sa pointe ; le dessus de la
  // chaussure (la cheville) bouge avec elle, le tibia doit y arriver (sinon la chaussure se décroche du tibia)
  const pivot = [x - (dir < 0 ? 3 : -3), y + 4.5], t = (tilt || 0) * Math.PI / 180;
  const cheville = tilt ? [pivot[0] + (x - pivot[0]) * Math.cos(t) - (y - pivot[1]) * Math.sin(t), pivot[1] + (x - pivot[0]) * Math.sin(t) + (y - pivot[1]) * Math.cos(t)] : [x, y];
  // (de face, le genou vient vers nous : on ne le voit pas sur le côté, la jambe se raccourcit)
  const s = avant ? cote(hanche, cheville, [hanche[0] + avant * 10, (hanche[1] + cheville[1]) / 2]) : 1;
  const r = avant ? ik(hanche, cheville, L * 0.5, L * 0.5, s) : { bout: [cheville[0], Math.min(cheville[1], c.ground)], milieu: [(base + cheville[0]) / 2, (c.hip + Math.min(cheville[1], c.ground)) / 2], plie: false };
  // (la chaussure suit le bout du tibia : si la jambe n'atteint pas la cheville voulue, elle remonte d'autant)
  return dessinJambe(c, hanche, { genou: r.milieu, cheville: r.bout, plie: r.plie, pied: [x + (r.bout[0] - cheville[0]), y + (r.bout[1] - cheville[1])] }, dir, tilt, avant);
}
// Le dessin d'une jambe : la hanche, le genou, la cheville ; le pantalon cerné, l'ombre, le pli du genou ; puis le pied
function dessinJambe(c, hanche, os, dir, tilt, avant) {
  const k = os.genou, [fx, fy] = os.cheville, [px, py] = os.pied || os.cheville;
  const plie = os.plie != null ? os.plie : Math.abs((k[0] - hanche[0]) * (fy - hanche[1]) - (k[1] - hanche[1]) * (fx - hanche[0])) > 1.2;
  const w = c.legW, pt = p => `${r2(p[0])},${r2(p[1])}`;
  // le tube descend un peu dans la chaussure, comme la jambe du kit
  const len = Math.hypot(fx - k[0], fy - k[1]) || 1, bas = [fx + (fx - k[0]) / len * 1.2, fy + (fy - k[1]) / len * 1.2];
  const d = `M${pt(hanche)} L${pt(k)} L${pt(bas)}`;
  // l'ombre : le long du bord droit de chaque os
  const bord = (p, q, o) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = (q[1] - p[1]) / l, ny = -(q[0] - p[0]) / l, sx = nx < 0 ? -1 : 1; return [[p[0] + nx * o * sx, p[1] + ny * o * sx], [q[0] + nx * o * sx, q[1] + ny * o * sx]]; };
  const o = w / 2 - 0.85, [h1, k1] = bord(hanche, k, o), [k2, b2] = bord(k, [fx, fy], o);
  let out = `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + W * 2)}" stroke-linejoin="round"/>`
    + `<path d="${d}" fill="none" stroke="${c.leg}" stroke-width="${r2(w)}" stroke-linejoin="round"/>`
    + `<path d="M${pt([h1[0], h1[1] + 0.6])} L${pt(k1)} L${pt(k2)} L${pt(b2)}" fill="none" stroke="${c.legS}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/>`;
  // le pli du genou, quand la jambe plie
  if (plie) {
    const n = [k[0] - avant * 0.2, k[1]];
    out += `<path d="M${r2(n[0] - avant * 0.9)},${r2(n[1] - 0.5)} Q${r2(n[0] + avant * 0.4)},${r2(n[1])} ${r2(n[0] - avant * 0.9)},${r2(n[1] + 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".35"/>`;
  }
  // (le pied reçoit aussi la jambe elle-même, c.jambeSeg : ce qui se porte sur la jambe, un short, la tige d'une botte,
  // la suit ; son angle, en degrés, comme SVG les compte)
  const angle = r2(-Math.atan2(fx - hanche[0], fy - hanche[1]) * 180 / Math.PI);
  const cs = c.foot ? { ...c, jambeSeg: { hanche, cheville: [fx, fy], angle } } : c;
  return out + (c.foot ? c.foot(cs, px, py, dir, tilt, k) : shoe(c, px, py, dir, tilt));
}

// La géométrie réelle du bras : le coude calculé, la main ramenée au bout du bras si la pose la pousse trop loin (ce
// qu'elle tient en main suit) ; en marche (c.marcheN), le bras suit ses poses clés ; en courant (c.course), les bras se
// plient au coude et pompent : la main monte devant, le coude recule
function poserBras(c, a, b, elbow, main) {
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

// avecOs(personnage) : n'importe quel personnage du kit (l'avatar, un visiteur…) prend ces membres-ci : ses bras à deux
// os (dessinés ensuite par le kit, avec ses manches : troupe.arm), ses jambes droites et la marche en poses clés
// (marcher). Le kit, lui, ne change pas : les personnages qui ne passent pas par ici restent dessinés comme avant.
// La ligne du bras, de l'épaule a à la main b : une ligne souple, en points rapprochés, jamais un bâton ni une cassure.
// Un bras relâché (sans coude plié) se courbe à peine, le coude un peu vers le dehors (comme un bras qui pend, détendu) ;
// un coude plié s'arrondit (un congé), au lieu de faire un angle. Ce qui est sur le bras (la manche, son reflet, le
// poignet, le bandage, un brassard) suit cette ligne. (Choix de l'auteur, 15 oct. : le bras droit faisait un pantin, le
// coude anguleux une articulation de marionnette ; et ce qui était posé dessus, des barres.)
const BOMBE = 0.7;
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
function ligneBras(a, coude, b) {
  const pts = [a];
  const quad = (p, q, r, n) => { for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; pts.push([u * u * p[0] + 2 * u * t * q[0] + t * t * r[0], u * u * p[1] + 2 * u * t * q[1] + t * t * r[1]]); } };
  const vers = (p, q, k) => { const d = dist(p, q) || 1; return [p[0] + (q[0] - p[0]) / d * k, p[1] + (q[1] - p[1]) / d * k]; };
  if (coude) {
    const rr = Math.min(2.4, 0.42 * Math.min(dist(a, coude), dist(coude, b)));
    const p1 = vers(coude, a, rr), p2 = vers(coude, b, rr);
    pts.push(p1); quad(p1, coude, p2, 5); pts.push(b);
  } else {
    const d = dist(a, b) || 1, nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d, sg = nx * (a[0] - 24) >= 0 ? 1 : -1;
    const bow = Math.min(BOMBE, d * 0.07);
    quad(a, [(a[0] + b[0]) / 2 + nx * sg * bow * 2, (a[1] + b[1]) / 2 + ny * sg * bow * 2], b, 8);
  }
  return pts.map(q => [r2(q[0]), r2(q[1])]);
}
const longueurLigne = pts => pts.slice(1).reduce((t, q, i) => t + dist(pts[i], q), 0);
// le point de la ligne à k de son bout (la main), en suivant la ligne ; u : la direction de la ligne là (vers la main)
function pointLigne(pts, k) {
  let reste = Math.max(0, k);
  for (let i = pts.length - 1; i > 0; i--) {
    const q = pts[i], p = pts[i - 1], d = dist(p, q) || 1e-6;
    if (reste <= d || i === 1) { const t = Math.min(1, reste / d); return { p: [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t], u: [(q[0] - p[0]) / d, (q[1] - p[1]) / d] }; }
    reste -= d;
  }
  return { p: pts[0], u: [0, 1] };
}
// la partie de la ligne entre k0 et k1 du bout (k0 > k1), de l'épaule vers la main
function sousLigne(pts, k0, k1) {
  const out = [pointLigne(pts, k0).p];
  let acc = 0;
  for (let i = pts.length - 1; i > 0; i--) { acc += dist(pts[i - 1], pts[i]); if (acc > k1 && acc < k0) out.splice(1, 0, pts[i - 1]); }
  out.push(pointLigne(pts, k1).p);
  return out;
}

// Un anneau autour du bras (un poignet, un brassard, un revers) : de k0 à k1 du poignet b, vers f (le coude, ou
// l'épaule) ; demi-largeur half. Le bras est un cylindre vu d'en haut : le bord d'un anneau est un arc, bombé vers le bas
// de l'écran (autant que le bras est vertical), jamais une barre droite posée en travers ; à mi-bras (un brassard, une
// manche retroussée), plat (courbe 0) : bombé à hauteur du coude, il ferait une articulation. (Choix de l'auteur, 15 oct.)
// Rend { d, bord(k) } : le contour de l'anneau, et l'arc de son bord à k du poignet (sa couture).
function anneau(ligne, k0, k1, half, courbe = 0.3) {
  const pt = q => `${r2(q[0])},${r2(q[1])}`;
  const arc = (k, sens) => {
    const { p: m, u: [ux, uy] } = pointLigne(ligne, k), nx = -uy, ny = ux, bombe = half * courbe * uy; // (le long du bras, vers le bas de l'écran)
    return { p: [m[0] + nx * half * sens, m[1] + ny * half * sens], q: [m[0] - nx * half * sens, m[1] - ny * half * sens], c: [m[0] + ux * bombe * 2, m[1] + uy * bombe * 2], bombe: [ux * bombe, uy * bombe] };
  };
  const A = arc(k0, 1), B = arc(k1, -1);
  return {
    d: `M${pt(A.p)} Q${pt(A.c)} ${pt(A.q)} L${pt(B.p)} Q${pt(B.c)} ${pt(B.q)} Z`,
    bord: k => { const e = arc(k, 1); return `M${pt(e.p)} Q${pt(e.c)} ${pt(e.q)}`; },
    bombe: arc((k0 + k1) / 2, 1).bombe
  };
}
function brasDuKit(c, a, b, elbow, main, partie = 'tout') {
  const g = poserBras(c, a, b, elbow, main), T = require('../troupe');
  // le bras du kit, sur la ligne souple (troupe.arm prend ses points) ; la manche coupée du kit (c.sleeves, c.bandage)
  // mesure l'avant-bras sur son dernier segment : la ligne n'y garde que ses points du haut du bras
  const ligne = ligneBras(a, g.elbow, g.b);
  let milieu = ligne.slice(1, -1);
  if (c.sleeves || c.bandage) milieu = milieu.filter(q => dist(q, g.b) > 6.5);
  const coude = milieu.length ? milieu : undefined;
  if (!c.cuff || c.sleeves || c.bandage) return T.arm({ ...c, bras: null }, a, g.b, coude, g.main, partie);
  // le poignet de la manche (c.cuff) : un anneau, entre la manche et la main
  let s = '';
  if (partie !== 'devant') {
    const r = anneau(ligne, 2.5, 0.9, c.armW / 2 + 0.1);
    s += T.arm({ ...c, bras: null, cuff: null }, a, g.b, coude, g.main, 'derriere') + `<path d="${r.d}" fill="${OUT}" stroke="${OUT}" stroke-width="${r2(W * 2)}" stroke-linejoin="round"/><path d="${r.d}" fill="${c.cuff}"/>`;
  }
  if (partie === 'derriere') return s;
  return s + (g.main != null ? g.main : T.poing(c, g.b));
}
// (la longueur des bras est fixée ici, au repos : assis, ou dans un geste qui déplace les épaules, elle ne change pas ;
// ce que la main droite tient en marchant, c.hold, suit la main réelle)
function avecOs(c) {
  const brasL = [0, 1].map(i => Math.hypot(c.hands[i][0] - c.shoulders[i][0], c.hands[i][1] - c.shoulders[i][1]));
  // (le dessin propre du personnage, s'il en a un, l'avatar : la manche et la jambe canoniques, manche.js et jambe.js ;
  // ces membres-ci n'en règlent alors que le mouvement : la longueur du bras, le coude, la cheville en marche)
  const dessin = c.bras;
  const bras = dessin ? (cc, a, b, elbow, main, partie) => { const g = poserBras(cc, a, b, elbow, main); return dessin(cc, a, g.b, g.elbow || undefined, g.main, partie); } : brasDuKit;
  const o = { ...c, bras, jambeOs: jambe, os: true, brasL };
  if (c.hold) {
    const hold = (cc, h, ctx) => c.hold(cc, poserBras(cc, cc.shoulders[1], h).b, ctx);
    Object.assign(hold, c.hold);
    o.hold = hold;
  }
  return o;
}

module.exports = { ik, cote, bras2os, jambe, marcher, brasMarche, poserBras, avecOs, anneau, ligneBras, pointLigne, sousLigne, longueurLigne };
