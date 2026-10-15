// La lumière de nuit des scènes (constat de l'audit ambiance du 15 oct. : un personnage n'existe jamais hors de sa
// lumière). Le passage commun eclairer() de splash_anya.js, généralisé aux scènes de nuit : sans redessiner aucune
// forme, aucun visage ni aucune couleur de base, on pose sur le dessin du jeu, découpé à sa silhouette :
//   1. le ton de nuit (une ombre bleutée, un peu désaturée, pas un simple assombrissement) ;
//   2. la lumière clé de chaque source chaude (feu, torche), du côté de la source, plus forte près d'elle ;
//   3. un liseré chaud sur le bord tourné vers le feu, et un liseré froid de contre-jour du côté de la lune ou de Brume
//      (sa teinte bleu-blanc) : la silhouette, claire, un peu décalée, derrière le dessin ;
// et, pour le feu lui-même, une lumière en dégradé radial (cœur clair et chaud, chute douce, aucun bord net), sa flaque
// au sol et ses reflets sur le sable. Aucun filtre SVG : des dégradés et des calques.
const r2 = n => Math.round(n * 100) / 100;
const arrets = stops => stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${r2(a)}"/>`).join('');
const rayonne = (id, cx, cy, r, stops) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}">${arrets(stops)}</radialGradient>`;
const clamp = v => Math.min(1, Math.max(0, v));

// Les réglages (choix de l'auteur : la planche de la veillée) : nuit (le ton de nuit), chaud (la lumière du feu),
// contre (le liseré froid)
const REGLAGES = {
  studio: { nuit: 0.42, chaud: 0.62, contre: 0.75 },
  doux: { nuit: 0.26, chaud: 0.42, contre: 0.35 },
  drame: { nuit: 0.62, chaud: 0.9, contre: 1 }
};
let reglage = REGLAGES.studio;
const regler = nom => { reglage = REGLAGES[nom] || REGLAGES.studio; };
const LISERES = false; // (les liserés de bord : retirés, voir eclairerNuit)

// La silhouette d'un dessin, pleine (de la couleur courante : définie une fois, réutilisée en <use> par le masque et
// les liserés), sans ses formes transparentes (ombres au sol, lueurs) ni ses identifiants
const silhouetteDe = corps => corps.replace(/<(path|circle|ellipse|rect|polygon|polyline|line)\b[^>]*(opacity|rgba)[^>]*\/>/g, '')
  .replace(/<defs>[\s\S]*?<\/defs>/g, '')
  .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"').replace(/ id="[^"]*"/g, '');

// Un dessin du jeu éclairé de nuit. corps : son dessin, dans son repère ; id : un préfixe propre à ce dessin ; box :
// [x, y, w, h], son cadre (dans son repère) ; lumieres : { chauds: [{ x, y, portee, force }], froid: { x, y, couleur } }
// en coordonnées de son repère ; force : de 0 à 1
function eclairerNuit(corps, id, [x, y, w, h], lumieres, force = 1) {
  const R = reglage;
  // (lumieres.silhouette : l'identifiant d'une silhouette déjà posée, la même, à réutiliser : une autre image du même
  // personnage, qui ne change que par les yeux)
  const sid = lumieres.silhouette || `${id}S`;
  const cx = x + w / 2, cy = y + h / 2;
  let defs = (lumieres.silhouette ? '' : `<g id="${id}S">${silhouetteDe(corps)}</g>`) + `<mask id="${id}M" maskUnits="userSpaceOnUse" x="${r2(x - w)}" y="${r2(y - h)}" width="${r2(3 * w)}" height="${r2(3 * h)}"><use href="#${sid}" color="#FFFFFF"/></mask>`;
  // (mult : en mode de fusion « multiply » (CSS, pas un filtre) : la couleur multiplie le dessin au lieu de s'y mêler,
  // comme une vraie lumière : le trait reste sombre, les couleurs gardent leur éclat)
  // (anim : une animation posée sur le calque lui-même : un groupe à l'opacité animée isolerait la fusion, qui ne verrait
  // plus le dessin dessous et peindrait sa couleur à plat)
  const aplat = (peinture, op = 1, mult = false, anim = '') => `<rect x="${r2(x - 2)}" y="${r2(y - 2)}" width="${r2(w + 4)}" height="${r2(h + 4)}" fill="${peinture}"${op < 1 ? ` opacity="${r2(op)}"` : ''}${mult ? ' style="mix-blend-mode:multiply"' : ''} mask="url(#${id}M)"${anim ? `>${anim}</rect>` : '/>'}`;
  // un liseré de lumière, à l'intérieur du dessin (choix de l'auteur, 15 oct. : jamais de contour qui déborde) : le bord
  // de la silhouette tourné vers la lumière (la silhouette, moins elle-même reculée de l'épaisseur du liseré), d'une couleur
  let liseres = '', dessus = '';
  const lisere = (k, couleur, ux, uy, op) => {
    if (!LISERES) return;
    defs += `<mask id="${id}R${k}" maskUnits="userSpaceOnUse" x="${r2(x - w)}" y="${r2(y - h)}" width="${r2(3 * w)}" height="${r2(3 * h)}"><use href="#${sid}" color="#FFFFFF"/><use href="#${sid}" color="#000000" transform="translate(${r2(-ux * ep)} ${r2(-uy * ep)})"/></mask>`;
    liseres += `<rect x="${r2(x - 2)}" y="${r2(y - 2)}" width="${r2(w + 4)}" height="${r2(h + 4)}" fill="${couleur}" opacity="${r2(op)}" mask="url(#${id}R${k})"/>`;
  };
  const ep = Math.max(w, h) * 0.02; // l'épaisseur des liserés
  // le contre-jour froid, du côté de la lune ou de Brume
  const froid = lumieres.froid;
  if (froid) {
    const dx = froid.x - cx, dy = froid.y - cy, l = Math.hypot(dx, dy) || 1;
    lisere('f', froid.couleur || '#CFE4FF', dx / l, dy / l, 0.55 * R.contre * force);
  }
  // les sources chaudes : le liseré du côté du feu
  const chauds = (lumieres.chauds || []).map((c, i) => {
    const dx = c.x - cx, dy = c.y - cy, d = Math.hypot(dx, dy) || 1;
    const k = clamp(1 - d / c.portee) ** 0.8 * (c.force ?? 1);
    return { ...c, dx, dy, d, k, i };
  }).filter(c => c.k > 0.02);
  for (const c of chauds) lisere(`c${c.i}`, '#FFC27A', c.dx / c.d, c.dy / c.d, 0.75 * Math.min(1, c.k * 1.6) * force);
  // le ton de nuit, en modelé : léger sur la face tournée vers la source chaude la plus forte, profond de l'autre côté
  // (un bleu de nuit, et un voile gris-bleu qui désature un peu)
  const cle = chauds.slice().sort((a, b) => b.k - a.k)[0];
  if (cle) {
    const ux = cle.dx / cle.d, uy = cle.dy / cle.d, L = Math.max(w, h) * 0.6;
    defs += `<linearGradient id="${id}N" gradientUnits="userSpaceOnUse" x1="${r2(cx + ux * L)}" y1="${r2(cy + uy * L)}" x2="${r2(cx - ux * L)}" y2="${r2(cy - uy * L)}">${arrets([[0, '#8A96D0', 0.15 * force], [0.5, '#8A96D0', R.nuit * 1.1 * force], [1, '#6E7CC0', R.nuit * 1.7 * force]])}</linearGradient>`;
    // (rien du côté du feu, un peu d'ombre de l'autre ; plus de voile gris : posé sur tout le personnage, le bleu de nuit
    // et le gris le ternissaient, comme vu à travers une vitre sale ; choix de l'auteur, 15 oct.)
    dessus += aplat(`url(#${id}N)`, 1, true);
  } else dessus += aplat('#8A96D0', R.nuit * force, true);
  // la lumière clé : chaude, du côté de la source, plus forte près d'elle
  // (lumieres.vacille : une animation SMIL de l'opacité, la même pour toute la scène, que la lumière du feu suit)
  let cles = '';
  for (const c of chauds) {
    // (un orangé franc et peu opaque, jamais une couleur claire : une couleur claire posée à plat éclaircit le trait sombre
    // du dessin, qui se lit alors comme un contour pâle ; choix de l'auteur, 15 oct.)
    defs += rayonne(`${id}C${c.i}`, c.x, c.y, c.portee, [[0, '#FFB060', R.chaud * 0.75 * force * (c.force ?? 1)], [0.5, '#FFB060', R.chaud * 0.4 * force * (c.force ?? 1)], [1, '#FFB060', 0]]);
    cles += aplat(`url(#${id}C${c.i})`, 1, true, lumieres.vacille || '');
  }
  dessus += cles;
  // (le froid n'est plus peint sur le personnage : une lumière claire posée à plat pâlit son trait)
  // (les liserés ne sont plus posés : choix de l'auteur, 15 oct. : « pourquoi un contour blanc autour de chacun ? » ; le
  // modelé et la lumière douce de chaque source suffisent)
  return `<defs>${defs}</defs>` + corps + dessus;
}

// Un personnage du jeu posé dans une scène (le même repère que scenes6.js : poser), éclairé de nuit. Les sources sont
// données dans la scène (le carré 400 × 400) et ramenées dans son repère
// les sources d'une scène (le carré 400 × 400) ramenées dans le repère d'un personnage posé en (x, y), à l'échelle s,
// en miroir si m = -1 ; et ce repère
function lumieresLocales(lumieres, x, y, s, m) {
  const ox = x - 24 * s * m, oy = y - 62 * s;
  const loc = p => p && { ...p, x: (p.x - ox) / (s * m), y: (p.y - oy) / s, portee: p.portee && p.portee / s };
  return { l: { chauds: (lumieres.chauds || []).map(loc), froid: loc(lumieres.froid), vacille: lumieres.vacille, silhouette: lumieres.silhouette }, repere: `translate(${r2(ox)} ${r2(oy)}) scale(${r2(s * m)} ${r2(s)})` };
}
function poserEclaire(body, x, y, s, m, id, lumieres, force = 1) {
  const { l, repere } = lumieresLocales(lumieres, x, y, s, m);
  return `<g transform="${repere}">${eclairerNuit(body, id, [-4, -6, 56, 74], l, force)}</g>`;
}

// La lumière d'un feu de camp : un grand dégradé radial (cœur clair et chaud, chute douce, aucun bord net), sa flaque
// sur le sable (aplatie), et quelques reflets chauds sur le sable proche ; n : l'image (la lumière respire)
function lumiereFeu(id, x, y, s, n = 0, sol = true) {
  const R = reglage;
  const k = [1, 1.04, 0.97, 1.02][n % 4];
  const r = 150 * s * k;
  let defs = rayonne(`${id}A`, x, y - 16 * s, r, [[0, '#FFE6A8', 0.5 * R.chaud / 0.62], [0.18, '#FFC070', 0.32 * R.chaud / 0.62], [0.45, '#FF9A50', 0.12 * R.chaud / 0.62], [1, '#FF8A40', 0]]);
  let s0 = `<circle cx="${r2(x)}" cy="${r2(y - 16 * s)}" r="${r2(r)}" fill="url(#${id}A)"/>`;
  if (sol) {
    defs += `<radialGradient id="${id}S"><stop offset="0" stop-color="#FFC27A" stop-opacity="${r2(0.55 * R.chaud / 0.62)}"/><stop offset="0.5" stop-color="#FF9A50" stop-opacity="${r2(0.22 * R.chaud / 0.62)}"/><stop offset="1" stop-color="#FF8A40" stop-opacity="0"/></radialGradient>`;
    s0 += `<ellipse cx="${r2(x)}" cy="${r2(y + 4 * s)}" rx="${r2(95 * s * k)}" ry="${r2(30 * s * k)}" fill="url(#${id}S)"/>`;
    // des reflets chauds sur le sable proche : de petits éclats qui palpitent d'une image à l'autre
    const pts = [[-38, 10], [30, 14], [-60, 4], [52, 6], [-14, 22], [18, -4], [70, 18], [-80, 16]];
    s0 += pts.map(([dx, dy], i) => `<ellipse cx="${r2(x + dx * s)}" cy="${r2(y + dy * s)}" rx="${r2(2.2 * s)}" ry="${r2(0.8 * s)}" fill="#FFD9A0" opacity="${r2((0.35 + 0.3 * (((n + i) % 3) / 2)) * clamp(1 - Math.hypot(dx, dy) / 95))}"/>`).join('');
  }
  return `<defs>${defs}</defs>` + s0;
}

module.exports = { eclairerNuit, poserEclaire, lumieresLocales, silhouetteDe, lumiereFeu, regler, REGLAGES };
