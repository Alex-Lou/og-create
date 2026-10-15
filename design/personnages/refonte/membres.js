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
function bras2os(c, a, b, coude) {
  const g = a[0] < 24, repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1];
  const L = Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
  const s = coude ? cote(a, b, coude) : (cote(a, b, [a[0] + (g ? -10 : 10), a[1] + 2]));
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
// le bras (degrés, + vers l'avant), opposé à la jambe de son côté : au bout de sa course au contact ; et la flexion du
// coude, qui se plie un peu quand le bras passe devant (il traîne en revenant)
const BRAS = [-14, -10, 0, 10, 14, 10, 0, -10];
const COUDE = [0, 0, 4, 10, 14, 10, 4, 0];
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
// la marche ; rend la main et le coude
function brasMarche(c, a) {
  const view = c.view || 'front', g = a[0] < 24, F = DEVANT[view] || DEVANT.front;
  const repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1], La = Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
  // la jambe de son côté a l'image i : le bras est à l'opposé (4 images de décalage)
  const i = (phaseJambe(c, g, view) + 4) % 8, al = BRAS[i] * Math.PI / 180, be = (BRAS[i] + COUDE[i]) * Math.PI / 180;
  const ox = (repos[0] - ep[0]) / La; // l'écart du bras au corps, gardé
  const P = (u, v, l) => [a[0] + ox * l + u * F[0], a[1] + v + u * F[1]];
  const h = La * 0.5;
  const coude = P(h * Math.sin(al), h * Math.cos(al), h), main = P(h * Math.sin(al) + h * Math.sin(be), h * Math.cos(al) + h * Math.cos(be), La);
  return { coude: COUDE[i] > 2 ? coude : null, main };
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
  // en marche, le pied suit le cycle ci-dessus (le kit ne donne que la place au repos) ; la jambe a un rien de mou, pour
  // que la jambe d'appui plie au contact et se tende au passage
  const L = c.ground - c.hip;
  const hanche = [base, c.hip];
  // en marche, la jambe suit ses poses clés (le kit ne donne que la place au repos)
  if (c.marcheN != null) return dessinJambe(c, hanche, osJambe(c, hanche, phaseJambe(c, x < 24, view), view), dir, 0, avant);
  tilt = tilt ? r2(tilt * 0.25) : 0;
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
  return out + (c.foot ? c.foot(c, px, py, dir, tilt, k) : shoe(c, px, py, dir, tilt));
}

module.exports = { ik, cote, bras2os, jambe, marcher, brasMarche };
