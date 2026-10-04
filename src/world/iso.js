// Géométrie isométrique des sprites de l'île, en SVG. Une seule projection et une seule lumière pour tout dessin :
// les volumes restent justes et cohérents d'un sprite à l'autre.
//
// Repère : (u, v) en cases sur le sol, z en pixels vers le haut. Une case fait TW × TH à l'écran (losange 2:1),
// comme dans WorldView. L'origine (0, 0, 0) est le point d'ancrage du sprite (centre de son emprise au sol).
// Lumière en haut à gauche : dessus clair, face gauche (côté +v) moyenne, face droite (côté +u) sombre.

export const TW = 64;
export const TH = 32;

// Point du repère → écran
export function P(u, v, z = 0) {
  return [((u - v) * TW) / 2, ((u + v) * TH) / 2 - z];
}

const fmt = n => (Math.round(n * 100) / 100).toString();
const pts = list => list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(' ');

// Polygone à partir de points du repère
export function face(points, fill, extra = '') {
  return `<polygon points="${pts(points.map(p => P(...p)))}" fill="${fill}"${extra}/>`;
}

// Liseré discret sur les arêtes : donne du relief sans contour épais
export const EDGE = ' stroke="rgba(60,40,25,.28)" stroke-width="0.8" stroke-linejoin="round"';

// Boîte droite de [u0, u1] × [v0, v1] × [z0, z1] ; colors = { top, left, right }
export function box(u0, v0, u1, v1, z0, z1, colors, edge = EDGE) {
  return [
    face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], colors.left, edge),
    face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], colors.right, edge),
    face([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], colors.top, edge)
  ].join('');
}

// Toit à deux pans au-dessus de [u0, u1] × [v0, v1] posé à z, faîtage le long de u, de hauteur h ; débord o (cases).
// colors = { front, back, gable } ; le pignon visible est celui de la face droite (côté +u).
export function gable(u0, v0, u1, v1, z, h, colors, o = 0.08, edge = EDGE) {
  const vm = (v0 + v1) / 2;
  const a = u0 - o;
  const b = u1 + o;
  return [
    face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], colors.back, edge),
    face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], colors.gable, edge),
    face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], colors.front, edge),
    // Planche de rive le long du pignon
    `<polyline points="${pts([P(b, v0 - o, z), P(b, vm, z + h), P(b, v1 + o, z)])}" fill="none" stroke="rgba(60,40,25,.45)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
  ].join('');
}

// Toit à quatre pans en pointe (pyramide) au-dessus de [u0, u1] × [v0, v1]
export function pyramid(u0, v0, u1, v1, z, h, colors, o = 0.06, edge = EDGE) {
  const a = [u0 - o, v0 - o, z];
  const b = [u1 + o, v0 - o, z];
  const c = [u1 + o, v1 + o, z];
  const d = [u0 - o, v1 + o, z];
  const top = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
  return [
    face([a, b, top], colors.back, edge),
    face([d, a, top], colors.back, edge),
    face([b, c, top], colors.right, edge),
    face([c, d, top], colors.left, edge)
  ].join('');
}

// Ellipse au sol (cercle de rayon r cases, centré en (u, v), à la hauteur z)
export function disc(u, v, z, r, fill, extra = '') {
  const [x, y] = P(u, v, z);
  return `<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(r * TW * Math.SQRT1_2)}" ry="${fmt(r * TH * Math.SQRT1_2)}" fill="${fill}"${extra}/>`;
}

// Cylindre vertical (puits, tonneau, tronc) : flanc dégradé gauche → droite, dessus clair
export function cylinder(u, v, z0, z1, r, colors, id, edge = EDGE) {
  const [x0, y0] = P(u, v, z0);
  const [, y1] = P(u, v, z1);
  const rx = r * TW * Math.SQRT1_2;
  const ry = r * TH * Math.SQRT1_2;
  const side = `M${fmt(x0 - rx)},${fmt(y1)} L${fmt(x0 - rx)},${fmt(y0)} A${fmt(rx)},${fmt(ry)} 0 0 0 ${fmt(x0 + rx)},${fmt(y0)} L${fmt(x0 + rx)},${fmt(y1)} Z`;
  return `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs>`
    + `<path d="${side}" fill="url(#${id})"${edge}/>`
    + `<ellipse cx="${fmt(x0)}" cy="${fmt(y1)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${colors.top}"${edge}/>`;
}

// Rocher à facettes : une base irrégulière de 8 sommets autour de (u, v) (rayons ru × rv en cases), une épaule à mi-
// hauteur à peine plus étroite, un sommet plus petit et reculé à la hauteur h (px). Seules les facettes tournées vers
// le joueur sont tracées, teintées selon leur orientation (côté +v : couleur gauche, côté +u : couleur droite), plus
// claires en haut, puis le dessus. seed : la forme ; jag de 0 à 1 : l'irrégularité ; peak de 0 à 1 : la largeur du
// sommet (petit : une aiguille)
export function boulder(u, v, ru, rv, h, colors, seed = 0, jag = 0.25, peak = 0.6, edge = EDGE) {
  const n = 8;
  const rnd = k => { const x = Math.sin(seed * 91.7 + k * 47.3) * 43758.5453; return x - Math.floor(x); };
  const ring = (scale, back, z) => Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 + rnd(k) * 0.45;
    const r = (1 - jag * rnd(k + 10)) * scale;
    return [u + Math.cos(a) * ru * r - ru * back, v + Math.sin(a) * rv * r - rv * back, z * (0.85 + 0.3 * rnd(k + 20 + z))];
  });
  const rings = [ring(1, 0, 0), ring(0.5 + peak * 0.45, 0.04, h * 0.55), ring(peak, 0.1, h)];
  let out = '';
  for (let level = 0; level < 2; level++) {
    const lo = rings[level], hi = rings[level + 1];
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n;
      const nu = (lo[k][0] + lo[j][0]) / 2 - u, nv = (lo[k][1] + lo[j][1]) / 2 - v;
      if (nu + nv <= 0) continue;
      const w = Math.min(1, Math.max(0, 0.5 + (0.7 * (nu - nv)) / Math.hypot(nu, nv)));
      const side = mixHex(colors.left, colors.right, w);
      out += face([lo[k], lo[j], hi[j], hi[k]], level ? mixHex(side, colors.top, 0.35) : side, edge);
    }
  }
  return out + face(rings[2], colors.top, edge);
}

// Mélange de deux couleurs #RRGGBB (k de 0 à 1)
export function mixHex(a, b, k) {
  const ca = parseInt(a.slice(1), 16), cb = parseInt(b.slice(1), 16);
  const ch = s => Math.round(((ca >> s) & 255) * (1 - k) + ((cb >> s) & 255) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

// Ombre portée douce au sol, vers le bas à droite (opposée à la lumière)
export function shadow(u, v, r, opacity = 0.22) {
  return disc(u + 0.12, v + 0.02, 0, r, `rgba(40,55,20,${opacity})`);
}

// Boule de feuillage, non projetée (vue de face) : base sombre, masse, éclat en haut à gauche
export function foliage(x, y, r, colors) {
  return `<circle cx="${fmt(x + r * 0.08)}" cy="${fmt(y + r * 0.1)}" r="${fmt(r)}" fill="${colors.dark}"/>`
    + `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r * 0.94)}" fill="${colors.mid}"/>`
    + `<circle cx="${fmt(x - r * 0.3)}" cy="${fmt(y - r * 0.32)}" r="${fmt(r * 0.45)}" fill="${colors.light}"/>`;
}

// Assemble un sprite : contenu SVG et cadre (en pixels écran, relatif à l'ancrage)
export function sprite(body, box) {
  const { x, y, w, h } = box;
  return {
    box,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">${body}</svg>`
  };
}
