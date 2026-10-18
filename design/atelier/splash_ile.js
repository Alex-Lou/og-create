// L'île de l'écran de démarrage (splash.js), dessinée pour lui : la terre des naufragés, vivante, de nuit, sous la lueur
// d'Anya. Les cabanes de planches et leurs toits rapiécés, une tente de voile, le feu de camp au milieu ; les champs
// et le blé, le poulailler et ses poules, des moutons et une chèvre ; des arbres, des buissons fleuris, le linge qui
// sèche ; la plage, la barque échouée, l'écume. Repère : (0, 0) au centre de l'herbe ; l'île fait 580 de large, de
// y = -60 (le fond) à y = 130 (la plage devant). Contours teintés, lumière froide d'en haut, chaude des fenêtres et du feu.
const { degrade, rayonne, forme, trait, balance } = require('./splash_anya').outils;
const { vernis } = require('./vernis');
const { f, rnd, vaVient, palpite } = require('./scenes7').outils;

const fs = require('fs');
const path = require('path');

const SPL = '0.45 0 0.55 1';
const BIB = path.join(__dirname, '..', 'bibliotheque', 'svg');
// Un dessin de la bibliothèque posé sur l'île : son ancrage (0, 0, le sol) en (x, y), à l'échelle k ; ses identifiants
// préfixés (deux dessins ne partagent jamais un identifiant) ; verni (vernis.js : contour, volume, reflets de lune ;
// o : ses lumières, ses étincelles…), la lune derrière Anya, au centre
const lire = rel => fs.readFileSync(path.join(BIB, rel), 'utf8');
// (sansSol : sans sa grande ombre au sol, l'ovale transparent de son emprise ; sans : d'autres formes à retirer)
function poser(rel, prefixe, x, y, k, o = {}) {
  let src = lire(rel);
  if (o.teinte) src = o.teinte(src);
  if (o.sansSol) src = src.replace(/<ellipse [^>]*fill="rgba\(40,55,20,[^"]*"\/>/, '');
  if (o.sans) src = src.replace(o.sans, '');
  const box = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const corps = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`);
  const verni = vernis(corps, `${prefixe}v`, box, { cote: x < 0 ? 1 : -1, trapu: 0.04, ...o });
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${o.ravage === undefined ? verni : ravage(verni, prefixe, box, o.ravage)}</g>`;
}
// Une construction après dix ans d'apocalypse (choix de l'auteur, 18 oct. : « fissures, à moitié défoncés, armés et
// barbelés, en feu ») : un coin arraché (la brèche, ses bords qui rougeoient, les gravats au pied), la suie qui monte du
// sol, des fissures, des planches clouées en travers, des barbelés le long de la base. Fissures, suie et planches
// restent dans la silhouette (le masque du vernis, vernis.js) ; n : le tirage de ses dégâts
function ravage(verni, prefixe, [bx, by, bw, bh], n) {
  const g = rnd(n * 97 + 13), id = `${prefixe}r`, gauche = n % 2 === 0;
  const zone = `maskUnits="userSpaceOnUse" x="${f(bx - bw)}" y="${f(by - bh)}" width="${f(3 * bw)}" height="${f(3 * bh)}"`;
  // (le dessin tient au milieu de son cadre : son pied en y = 0, son toit vers le haut du cadre)
  const haut = by + bh * 0.08, pied = 0, H = pied - haut;
  // la brèche : une morsure dans le haut, d'un côté du faîte, aux bords déchiquetés
  const x0 = (gauche ? -1 : 1) * bw * (0.04 + g() * 0.08), sx = gauche ? -1 : 1, pr = bw * (0.16 + g() * 0.08), ht = H * (0.3 + g() * 0.12);
  const breche = [[x0 - sx * pr * 0.2, by - 4], [x0 + sx * pr * 1.6, by - 4]];
  for (let i = 1; i <= 6; i++) breche.push([x0 + sx * pr * (1.4 - i / 5) + (g() - 0.5) * bw * 0.04, haut + ht * Math.sin((i / 7) * Math.PI) * (0.8 + g() * 0.4)]);
  breche.push([x0 - sx * pr * 0.2, haut]);
  const bord = breche.slice(1, -1).map(([px, py]) => `${f(px)},${f(py)}`).join(' L');
  const pts = breche.map(([px, py]) => `${f(px)},${f(py)}`).join(' ');
  // les fissures : des zigzags qui partent de la brèche et du bas
  let fissures = '';
  for (let i = 0; i < 4; i++) {
    let px = (g() - 0.5) * bw * 0.5, py = i < 2 ? haut + H * (0.3 + g() * 0.15) : pied - H * (0.05 + g() * 0.1);
    let d = `M${f(px)},${f(py)}`;
    for (let j = 0; j < 5; j++) { px += (g() - 0.5) * bw * 0.08; py += (i < 2 ? 1 : -1) * H * (0.04 + g() * 0.05); d += ` L${f(px)},${f(py)}`; }
    fissures += `<path d="${d}" fill="none" stroke="#0A0418" stroke-width="${f(bw * 0.012 + 0.8)}" stroke-linejoin="round" opacity=".85"/>`;
  }
  // les planches clouées en travers, au milieu de la façade
  const planches = [0, 1].map(i => { const cx = (i - 0.5) * bw * 0.2 + (g() - 0.5) * bw * 0.04, cy = pied - H * (0.3 + (g() - 0.5) * 0.1), a = (i ? -1 : 1) * (12 + g() * 14), l = bw * 0.17, e = bw * 0.03;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a)})"><rect x="${f(-l / 2)}" y="${f(-e / 2)}" width="${f(l)}" height="${f(e)}" fill="#7A5A40" stroke="#1A0E0A" stroke-width="${f(e * 0.18)}"/><circle cx="${f(-l * 0.4)}" cy="0" r="${f(e * 0.16)}" fill="#C8C0B8"/><circle cx="${f(l * 0.4)}" cy="0" r="${f(e * 0.16)}" fill="#C8C0B8"/></g>`; }).join('');
  // les barbelés : un rouleau de fil en accordéon (concertina) le long de la base, des boucles fines qui se chevauchent,
  // penchées, leurs lames ; le métal gris bleuté, un reflet de lune sur le haut des boucles
  const yb = pied - H * 0.05, r0 = H * 0.07 + 1.5, w0 = Math.max(0.5, r0 * 0.05);
  let fil = '';
  for (let xx = -bw * 0.26, i = 0; xx < bw * 0.26; xx += r0 * 0.42, i++) {
    fil += `<ellipse cx="${f(xx)}" cy="${f(yb)}" rx="${f(r0 * 0.5)}" ry="${f(r0)}" transform="rotate(-18 ${f(xx)} ${f(yb)})" fill="none" stroke="#5A6272" stroke-width="${f(w0)}"/>`
      + `<path d="M${f(xx - r0 * 0.45)},${f(yb - r0 * 0.55)} Q${f(xx)},${f(yb - r0 * 1.05)} ${f(xx + r0 * 0.3)},${f(yb - r0 * 0.75)}" fill="none" stroke="#C8D4E8" stroke-width="${f(w0 * 0.6)}" opacity=".7"/>`;
    if (i % 2 === 0) { const lx = xx + r0 * 0.3, ly = yb - r0 * 0.85, e = r0 * 0.14; fil += `<path d="M${f(lx - e)},${f(ly - e)} L${f(lx + e)},${f(ly + e)} M${f(lx + e)},${f(ly - e)} L${f(lx - e)},${f(ly + e)}" stroke="#8A94A6" stroke-width="${f(w0 * 0.8)}"/>`; }
  }
  // les gravats au pied de la brèche
  const gravats = [0, 1, 2, 3, 4].map(i => { const gx = x0 + sx * (g() * pr * 1.4), gy = pied + 2 + g() * 4, t = bw * (0.02 + g() * 0.025);
    return `<path d="M${f(gx - t)},${f(gy)} L${f(gx - t * 0.4)},${f(gy - t * 0.9)} L${f(gx + t * 0.7)},${f(gy - t * 0.6)} L${f(gx + t)},${f(gy)} Z" fill="${i % 2 ? '#6A6474' : '#4A4454'}" stroke="#140A1A" stroke-width="${f(t * 0.15)}"/>`; }).join('');
  return `<defs><mask id="${id}M" ${zone}><rect x="${f(bx - bw)}" y="${f(by - bh)}" width="${f(3 * bw)}" height="${f(3 * bh)}" fill="#FFFFFF"/><polygon points="${pts}" fill="#000000"/></mask>`
    + `<linearGradient id="${id}S" gradientUnits="userSpaceOnUse" x1="0" y1="${f(haut)}" x2="0" y2="${f(pied)}"><stop offset="0" stop-color="#140A1A" stop-opacity=".25"/><stop offset=".6" stop-color="#140A1A" stop-opacity=".1"/><stop offset="1" stop-color="#0A0410" stop-opacity=".7"/></linearGradient></defs>`
    + `<g mask="url(#${id}M)">${verni}<g mask="url(#${prefixe}vS)"><rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="url(#${id}S)"/>${fissures}${planches}`
    + `<path d="M${bord}" fill="none" stroke="#0A0418" stroke-width="${f(bw * 0.02 + 1)}"/><path d="M${bord}" fill="none" stroke="#FF6A2E" stroke-width="${f(bw * 0.008 + 0.5)}" opacity=".8">${palpite('opacity', '0.4;0.9;0.4', 1.8, n * 0.2)}</path></g></g>`
    + gravats + fil;
}
// La nuit des constructions (choix de l'auteur, 18 oct. : « pas du tout dans le ton, trop simplistes, trop ressortants ») :
// leurs couleurs plus sombres et moins vives, glissées vers l'indigo de la nuit, le trait brun devenu encre indigo ; seules
// les lumières chaudes (fenêtres, lanternes, feux) gardent leur éclat
const hexHsl = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l]; const sa = d / (1 - Math.abs(2 * l - 1)), h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, sa, l]; };
const hslHex = (h, sa, l) => { const c = (1 - Math.abs(2 * l - 1)) * sa, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); };
function deNuit(hex) {
  const [h, sa, l] = hexHsl(hex);
  // (une lumière chaude : on la garde, un peu plus vive)
  if (l > 0.68 && sa > 0.45 && h >= 25 && h <= 60) return hslHex(h, Math.min(1, sa + 0.1), Math.min(0.9, l + 0.04));
  if (l < 0.2) return hslHex(258, 0.5, Math.max(0.05, l * 0.8));
  // (vers l'indigo, d'autant plus que la couleur est terne)
  const vers = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;
  return hslHex((vers(h, 255, 0.28 * (1 - sa * 0.5)) + 360) % 360, sa * 0.62, l * 0.58 + 0.03);
}
const enNuit = svg => svg.replace(/#[0-9A-Fa-f]{6}\b/g, deNuit).replace(/#3C2819/gi, '#0A0418');
// Une construction à son dernier palier (batiments.json : son dessin, ses lumières de nuit), posée et vernie ; ses
// lumières allumées (la case (u, v), la hauteur z : à l'écran, comme le jeu, iso.js, à l'échelle de la bibliothèque)
const BATIMENTS = JSON.parse(lire('batiments/batiments.json')).paliers;
function batiment(nom, prefixe, x, y, k, eclats, sans, ravages) {
  const cle = Object.keys(BATIMENTS).filter(c => c.startsWith(`${nom}_palier`)).sort().pop();
  const P = BATIMENTS[cle];
  const lumieres = (P.lumieres || []).map(l => [40 * (l.u - l.v), 20 * (l.u + l.v) - l.z, l.rayon * 0.8, 20 * (l.u + l.v)]);
  return poser(`batiments/${P.fichiers[0]}`, prefixe, x, y, k, { sol: P.cadre[2] * 0.16, lumieres, eclats, sansSol: true, sans, ravage: ravages, teinte: enNuit, contour: '#0A0418' });
}
// Les dessins qui reviennent (une même plante à dix places) : définis une fois (<symbol>), réutilisés (<use>) ; une plante
// est vernie d'un seul côté (une seule définition). L'image reste légère
// (choix de l'auteur, 18 oct. : l'écran de démarrage est la première image chargée)
function bibliotheque() {
  const defs = new Map();
  const garde = (cle, dessin) => { if (!defs.has(cle)) defs.set(cle, { id: `ilS${defs.size}`, dessin }); return defs.get(cle); };
  return {
    poser: (rel, x, y, k) => {
      const d = garde(rel, id => poser(rel, `${id}p`, 0, 0, 1, { cote: 1 }));
      return `<use href="#${d.id}" transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"/>`;
    },
    defs: () => `<defs>${[...defs.values()].map(({ id, dessin }) => `<symbol id="${id}" overflow="visible">${dessin(id)}</symbol>`).join('')}</defs>`
  };
}
const ovale = (cx, cy, rx, ry, fill, stroke = 'none', w = 0, extra = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${stroke !== 'none' ? ` stroke="${stroke}" stroke-width="${w}"` : ''}${extra}/>`;
const ombre = (x, y, rx) => ovale(x, y, rx, rx * 0.28, 'url(#ilOmbre)');

// ═══ la végétation ═══
// Un arbre rond : le tronc, quatre boules de feuillage (claires en haut à gauche), des reflets ; il se balance
function arbre(x, y, k, begin, teinte = 0) {
  const g = teinte ? 'url(#ilFeuillage2)' : 'url(#ilFeuillage)';
  return ombre(x, y, 22 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><g>${balance(-1.6, 1.6, 0, 0, 5.6, begin)}`
    + forme('M-4,0 Q-5,-14 -3,-24 L3,-24 Q5,-14 4,0 Z', 'url(#ilTronc)', '#4A3020', 1.6) + trait('M-1,-18 L-8,-28 M1,-20 L7,-30', '#5E3E28', 2.4)
    + [[-12, -34, 14], [12, -36, 14], [0, -48, 16], [-4, -30, 12]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${g}" stroke="#24563A" stroke-width="1.6"/>`).join('')
    + [[-8, -52, 4, 2.6], [-17, -40, 3, 2], [8, -42, 3, 2]].map(([cx, cy, rx, ry]) => ovale(cx, cy, rx, ry, '#E6FFB8', 'none', 0, ' opacity=".5"')).join('')
    + '</g></g>';
}
// Un sapin : trois étages de branches, plus clairs vers le haut
function sapin(x, y, k, begin) {
  return ombre(x, y, 14 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><g>${balance(-1.2, 1.2, 0, 0, 6.2, begin)}`
    + forme('M-3,0 L-3,-10 L3,-10 L3,0 Z', 'url(#ilTronc)', '#4A3020', 1.4)
    + [[0, -8, 18, 20], [0, -22, 14, 18], [0, -34, 10, 16]].map(([cx, cy, w, h]) => forme(`M${cx - w},${cy} Q${cx},${cy + 4} ${cx + w},${cy} L${cx},${cy - h} Z`, 'url(#ilSapin)', '#1E4A34', 1.6)).join('')
    + trait('M-6,-40 L-1,-48', '#CFF0B0', 2, ' opacity=".5"') + '</g></g>';
}
// Un buisson fleuri : trois bosses et des fleurs qui luisent un peu
function buisson(x, y, k, couleur, begin) {
  const g = rnd(Math.round(x * 7 + y));
  return ombre(x, y, 16 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + [[-8, -6, 9], [8, -6, 9], [0, -11, 10]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ilBuisson)" stroke="#24563A" stroke-width="1.4"/>`).join('')
    + [0, 1, 2, 3, 4].map(() => `<circle cx="${f(-12 + g() * 24)}" cy="${f(-16 + g() * 12)}" r="1.8" fill="${couleur}" stroke="#7A4A5A" stroke-width=".5">${palpite('opacity', '0.7;1;0.7', 2.6, begin + g() * 2)}</circle>`).join('') + '</g>';
}
// Des touffes d'herbe semées sur l'île (dans l'ovale de l'herbe), de trois verts
function herbes(n, seed, couleurs = ['#156A50', '#2A9A68', '#0A5446']) {
  const g = rnd(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = g() * Math.PI * 2, r = Math.sqrt(g()), x = Math.cos(a) * r * 250, y = 16 + Math.sin(a) * r * 64;
    const c = couleurs[i % 3];
    s += trait(`M${f(x - 3)},${f(y)} L${f(x - 4)},${f(y - 5)} M${f(x)},${f(y)} L${f(x)},${f(y - 7)} M${f(x + 3)},${f(y)} L${f(x + 4.5)},${f(y - 5)}`, c, 1.3);
  }
  return s;
}
// Du blé doré : des tiges qui ondulent au vent, par vagues
function ble(x0, y0, w, h, rangs) {
  let s = '';
  for (let r = 0; r < rangs; r++) {
    const y = y0 + r * (h / rangs), n = Math.round(w / 6);
    s += `<g><animateTransform attributeName="transform" type="skewX" values="-4;5;-4" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL};${SPL}" dur="3.6s" begin="${f(-r * 0.4)}s" repeatCount="indefinite"/>`;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 6 + (r % 2) * 3;
      s += trait(`M${f(x)},${f(y)} L${f(x + 1)},${f(y - 14)}`, '#B88A30', 1.2) + ovale(x + 1.2, y - 16, 1.8, 4, 'url(#ilEpi)', '#9A6E22', 0.6);
    }
    s += '</g>';
  }
  return s;
}
// Un champ labouré : des sillons en perspective, de jeunes pousses sur chaque rang
function champ(x, y) {
  let s = forme(`M${x},${y} L${x + 96},${y - 6} L${x + 112},${y + 40} L${x + 8},${y + 48} Z`, 'url(#ilTerre)', '#5A3A26', 2);
  for (let i = 0; i < 5; i++) {
    const t = (i + 0.5) / 5, ya = y - 6 * (1 - t) + 48 * t - 2, xa = x + 8 * t, xb = x + 96 + 16 * t;
    s += trait(`M${f(xa + 3)},${f(ya)} L${f(xb - 3)},${f(ya - 6 + t * 0)}`, '#4A2E1E', 2.2, ' opacity=".55"');
    for (let j = 0; j < 8; j++) {
      const px = xa + 8 + j * ((xb - xa - 16) / 7), py = ya - 1 - (j / 7) * 6;
      s += trait(`M${f(px)},${f(py)} Q${f(px - 3)},${f(py - 4)} ${f(px - 4)},${f(py - 6)} M${f(px)},${f(py)} Q${f(px + 3)},${f(py - 4)} ${f(px + 4)},${f(py - 6)}`, '#7CCB5E', 1.6);
    }
  }
  return s;
}
// Une clôture de piquets et deux traverses, de (x0, y0) à (x1, y1)
function cloture(x0, y0, x1, y1, n) {
  let s = trait(`M${x0},${y0 - 7} L${x1},${y1 - 7} M${x0},${y0 - 13} L${x1},${y1 - 13}`, '#5A3A26', 3.4) + trait(`M${x0},${y0 - 7} L${x1},${y1 - 7} M${x0},${y0 - 13} L${x1},${y1 - 13}`, '#B08458', 2);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
    s += forme(`M${f(x - 2)},${f(y)} L${f(x - 2)},${f(y - 16)} L${f(x)},${f(y - 18)} L${f(x + 2)},${f(y - 16)} L${f(x + 2)},${f(y)} Z`, '#B08458', '#5A3A26', 1.2);
  }
  return s;
}

// ═══ les constructions des naufragés ═══
// Une fenêtre éclairée : la lueur chaude qui respire autour, le carreau, sa croisée
const fenetre = (x, y, w, h, begin) => ovale(x + w / 2, y + h / 2, w * 2.2, h * 2, 'url(#ilLueurChaude)', 'none', 0, '') .replace('/>', `>${palpite('opacity', '0.6;1;0.6', 2.4, begin)}</ellipse>`)
  + `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="1.4" fill="url(#ilVitre)" stroke="#4A2E1E" stroke-width="1.6"/>`
  + trait(`M${f(x + w / 2)},${f(y)} L${f(x + w / 2)},${f(y + h)} M${f(x)},${f(y + h / 2)} L${f(x + w)},${f(y + h / 2)}`, '#4A2E1E', 1.2);
// De la fumée qui monte d'une cheminée : des bouffées qui grossissent et s'effacent
const fumee = (x, y, dur = 5.6) => [0, 1, 2].map(i => `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="url(#ilFumee)" opacity="0">`
  + `<animateTransform attributeName="transform" type="translate" values="0 0;6 -26;16 -56" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.3 0 0.6 1;0.3 0 0.6 1" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/>`
  + `<animate attributeName="r" values="3;7;12" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/>`
  + `<animate attributeName="opacity" values="0;0.7;0" keyTimes="0;0.25;1" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/></circle>`).join('');
// Une cabane de naufragés, de trois quarts : murs de planches, toit de chaume rapiécé d'un morceau de voile, cheminée
// de pierres qui fume, fenêtre éclairée, porte et sa lanterne ; (x, y) le milieu du bas de la façade
function cabane(x, y, k, begin, variante = 0) {
  const W = 50, H = 30, P = 20;
  let s = ombre(x + 8 * k, y, 46 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`;
  // le côté (plus sombre), la façade de planches
  s += forme(`M${W / 2},0 L${W / 2 + P},-10 L${W / 2 + P},${-H - 10} L${W / 2},${-H} Z`, 'url(#ilPlanchesOmbre)', '#3E2618', 1.8);
  s += forme(`M${-W / 2},0 L${W / 2},0 L${W / 2},${-H} L${-W / 2},${-H} Z`, 'url(#ilPlanches)', '#3E2618', 1.8);
  for (let i = 1; i < 6; i++) s += trait(`M${-W / 2 + i * W / 6},-1 L${-W / 2 + i * W / 6 + (i % 2 ? 0.6 : -0.4)},${-H + 1}`, '#5A3A26', 1, ' opacity=".6"');
  s += trait(`M${-W / 2 + 4},${-H + 9} l6,-1 M${W / 2 - 12},-8 l7,1`, '#E8C89A', 1, ' opacity=".5"');
  // la porte et sa lanterne, la fenêtre
  s += forme(`M${-W / 2 + 7},0 L${-W / 2 + 7},-20 Q${-W / 2 + 13},-25 ${-W / 2 + 19},-20 L${-W / 2 + 19},0 Z`, '#5A3624', '#2E1A10', 1.6) + `<circle cx="${-W / 2 + 17}" cy="-10" r="1.1" fill="#E8C060"/>`;
  s += `<g transform="translate(${-W / 2 + 23} -22)">${ovale(0, 3, 9, 9, 'url(#ilLueurChaude)').replace('/>', `>${palpite('opacity', '0.5;1;0.5', 1.8, begin)}</ellipse>`)}`
    + trait('M0,-3 L0,0', '#3E2618', 1) + `<rect x="-2.4" y="0" width="4.8" height="6" rx="1" fill="#FFE59A" stroke="#5A3A26" stroke-width="1"/></g>`;
  s += fenetre(W / 2 - 18, -H + 9, 12, 10, begin);
  // le toit de chaume : la pente avant, le pignon, le côté ; ses brins, sa pièce de voile cousue
  const toitAvant = `M${-W / 2 - 6},${-H + 2} L${W / 2 + 4},${-H + 2} L${W / 2 + 6 - 2},${-H - 22} L${-W / 2 + 4},${-H - 22} Z`;
  s += forme(`M${W / 2 + 4},${-H + 2} L${W / 2 + P + 4},${-H - 8} L${W / 2 + P - 2},${-H - 30} L${W / 2 + 4},${-H - 22} Z`, 'url(#ilChaumeOmbre)', '#6A4A1E', 1.8);
  s += forme(toitAvant, 'url(#ilChaume)', '#6A4A1E', 1.8);
  for (let i = 0; i < 9; i++) s += trait(`M${f(-W / 2 - 3 + i * 6.6)},${-H + 1} L${f(-W / 2 + 5 + i * 6)},${-H - 20}`, '#A8803A', 1, ' opacity=".7"');
  s += trait(`M${-W / 2 - 6},${-H + 2} L${W / 2 + 4},${-H + 2}`, '#E8CC88', 1.6, ' opacity=".6"');
  if (variante !== 1) s += `<g transform="translate(${variante ? -6 : 6} ${-H - 13}) rotate(-6)"><rect x="-9" y="-6" width="18" height="12" fill="#DCD4C2" stroke="#8A7E6A" stroke-width="1.2"/>`
    + trait('M-8,-6 L-8,6 M8,-6 L8,6', '#8A7E6A', 0.8, ' stroke-dasharray="1.6 1.6"') + '</g>';
  // la cheminée de pierres et sa fumée
  s += forme(`M${W / 2 - 10},${-H - 18} L${W / 2 - 10},${-H - 34} L${W / 2 - 2},${-H - 34} L${W / 2 - 2},${-H - 22} Z`, 'url(#ilPierre)', '#3A3440', 1.6)
    + trait(`M${W / 2 - 10},${-H - 26} L${W / 2 - 2},${-H - 26}`, '#3A3440', 0.8, ' opacity=".6"') + fumee(W / 2 - 6, -H - 36);
  return s + '</g>';
}
// Une tente de voile rayée, tendue sur un mât et ses cordes ; l'entrée éclairée de l'intérieur
function tente(x, y, k, begin) {
  return ombre(x, y, 38 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + trait('M-34,0 L-18,-30 M34,0 L18,-30', '#6A5A48', 1, ' opacity=".7"')
    + forme('M-30,0 L0,-42 L30,0 Z', 'url(#ilVoile)', '#7A6A54', 2)
    + [-16, -6, 6, 16].map(dx => trait(`M0,-42 L${dx * 1.8},0`, '#C8463A', 2.6, ' opacity=".55"')).join('')
    + forme('M-8,0 L0,-24 L8,0 Z', 'url(#ilLueurTente)', '#7A6A54', 1.4).replace('/>', `>${palpite('opacity', '0.8;1;0.8', 2.2, begin)}</path>`)
    + trait('M0,-42 L0,-50', '#5A3A26', 2) + `<path d="M0,-50 L9,-47 L0,-44 Z" fill="#E8584A" stroke="#7A2A22" stroke-width=".8">${'<animateTransform attributeName="transform" type="skewY" values="-8;8;-8" dur="1.8s" repeatCount="indefinite"/>'}</path>`
    + '</g>';
}
// Le feu de camp : les bûches croisées, trois flammes qui dansent, sa lueur, des étincelles qui s'envolent
function feu(x, y) {
  const flamme = (h, w, c, d, b) => `<path d="M0,0 Q${-w},${-h * 0.4} 0,${-h} Q${w},${-h * 0.4} 0,0 Z" fill="${c}">`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.15;1.05 0.9;1 1" keyTimes="0;0.33;0.66;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL}" dur="${d}s" begin="${f(-b)}s" repeatCount="indefinite"/></path>`;
  return ovale(x, y - 8, 70, 40, 'url(#ilLueurFeu)').replace('/>', `>${palpite('opacity', '0.7;1;0.7', 1.4)}</ellipse>`)
    + `<g transform="translate(${x} ${y})">` + [[-9, 0, 9, -3], [9, 0, -9, -3]].map(([a, b, c, d]) => trait(`M${a},${b} L${c},${d}`, '#3E2618', 6) + trait(`M${a},${b} L${c},${d}`, '#8A5A36', 3.6)).join('')
    + [[-11, 1], [11, 1], [-6, 4], [6, 4], [0, 5]].map(([cx, cy]) => ovale(cx, cy, 3, 2, '#7A7480', '#3A3440', 1)).join('')
    + `<g transform="translate(0 -2)">${flamme(20, 9, '#F28A2E', 0.9, 0)}${flamme(15, 6.5, '#FFC94A', 0.7, 0.3)}${flamme(9, 3.6, '#FFF4C0', 0.6, 0.1)}</g>`
    + [0, 1, 2, 3].map(i => `<circle cx="${(i - 1.5) * 3}" cy="-14" r="1.2" fill="#FFD27A" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 5 : -5} -24;${i % 2 ? -2 : 3} -46" dur="${f(1.8 + i * 0.3)}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${f(1.8 + i * 0.3)}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/></circle>`).join('')
    + '</g>';
}
// ═══ l'île après dix ans d'apocalypse (choix de l'auteur, 18 oct. : l'orage montre la même île, devenue un champ de
// bataille : barricades, revenants, attaques) ═══
// Un pieu de la palissade : un rondin taillé en pointe, sa ligature ; (x, y) son pied, h sa hauteur
const pieu = (x, y, h, n) => forme(`M${f(x - 2.6)},${f(y)} L${f(x - 2.4)},${f(y - h + 5)} L${f(x)},${f(y - h)} L${f(x + 2.4)},${f(y - h + 5)} L${f(x + 2.6)},${f(y)} Z`, n % 3 ? 'url(#ilPieu)' : 'url(#ilPieuSombre)', '#140A10', 1)
  + trait(`M${f(x - 2.6)},${f(y - h * 0.42)} L${f(x + 2.6)},${f(y - h * 0.46)}`, '#6A5A4A', 1.1);
// Des flammes qui dansent (un pieu, un toit qui brûle) : trois langues, leur lueur, de la fumée
function flammes(x, y, k, b) {
  const flamme = (h, w, c, d, o) => `<path d="M0,0 Q${-w},${-h * 0.4} 0,${-h} Q${w},${-h * 0.4} 0,0 Z" fill="${c}">`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;0.85 1.2;1.05 0.9;1 1" keyTimes="0;0.33;0.66;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL}" dur="${d}s" begin="${f(-o - b)}s" repeatCount="indefinite"/></path>`;
  return ovale(x, y - 6 * k, 26 * k, 18 * k, 'url(#ilLueurFeu)').replace('/>', `>${palpite('opacity', '0.6;1;0.6', 1.2, b)}</ellipse>`)
    + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${flamme(18, 7, '#FF5A2E', 0.8, 0)}${flamme(13, 5, '#FFA040', 0.65, 0.2)}${flamme(7, 2.6, '#FFF0B0', 0.5, 0.1)}</g>`
    + fumee(x, y - 18 * k, 4.4);
}
// Une flèche enflammée, tirée du village vers un revenant : sa traînée de feu, sa pointe, une braise au bout
const fleche = (x0, y0, x1, y1, b) => {
  const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - 40, d = `M${f(x0)},${f(y0)} Q${f(cx)},${f(cy)} ${f(x1)},${f(y1)}`;
  return `<path d="${d}" fill="none" stroke="#FF6A2E" stroke-width="5" stroke-linecap="round" opacity=".22"/><path d="${d}" fill="none" stroke="#FFA040" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="26 220" opacity=".95"><animate attributeName="stroke-dashoffset" values="246;0" dur="1.6s" begin="${f(-b)}s" repeatCount="indefinite"/></path>`
    + `<path d="${d}" fill="none" stroke="#FFF0B0" stroke-width="0.9" stroke-linecap="round" stroke-dasharray="10 236"><animate attributeName="stroke-dashoffset" values="246;0" dur="1.6s" begin="${f(-b)}s" repeatCount="indefinite"/></path>`
    + `<circle cx="${f(x1)}" cy="${f(y1)}" r="4" fill="#FFD27A">${palpite('opacity', '0.2;1;0.2', 1.6, b)}</circle>`;
};
// Le poulailler : une petite cabane sur pattes, sa rampe, son toit de planches
function poulailler(x, y, k) {
  return ombre(x, y, 26 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + trait('M-14,0 L-14,-8 M14,0 L14,-8', '#4A2E1E', 3)
    + forme('M-18,-8 L18,-8 L18,-26 L-18,-26 Z', 'url(#ilPlanches)', '#3E2618', 1.6)
    + forme('M-22,-24 L0,-38 L22,-24 Z', '#A0523A', '#5A2A1E', 1.6) + trait('M-14,-28 L14,-28 M-8,-32 L8,-32', '#7A3A28', 1, ' opacity=".7"')
    + forme('M-6,-8 L-6,-18 Q0,-22 6,-18 L6,-8 Z', '#2E1A10') + trait('M-4,-8 L-12,2', '#B08458', 3) + trait('M-10,-2 l2,-1 M-7,-5 l2,-1', '#5A3A26', 1)
    + '</g>';
}
// Une poule qui picore : le corps rond, la queue, la crête, le bec ; la tête plonge vers le sol, de temps en temps
function poule(x, y, k, sens, begin, robe = '#FFF8EC') {
  const tete = `<g><animateTransform attributeName="transform" type="rotate" values="0 4 -10;0 4 -10;38 4 -10;0 4 -10;0 4 -10;34 4 -10;0 4 -10" keyTimes="0;0.4;0.48;0.56;0.7;0.76;1" calcMode="spline" keySplines="${Array(6).fill(SPL).join(';')}" dur="3.2s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + `<circle cx="7" cy="-14" r="4.2" fill="${robe}" stroke="#8A7A64" stroke-width="1.1"/>`
    + forme('M5,-18 Q6,-22 8,-19 Q9,-22 10,-18 Z', '#E8443A', '#9A2A22', 0.7) + forme('M10.6,-14.4 L14,-13.2 L10.6,-12.2 Z', '#F2B640', '#A0701A', 0.6)
    + `<circle cx="8.4" cy="-14.8" r=".9" fill="#2E1A10"/>` + forme('M9,-11 Q9.8,-8.6 8.6,-8.4 Q8,-9.6 8.6,-11 Z', '#E8443A') + '</g>';
  return ombre(x, y, 9 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-1,-2 L-2,0 M2,-2 L3,0', '#E8A030', 1.4)
    + forme('M-8,-8 Q-12,-16 -9,-20 Q-5,-14 -3,-12 Z', '#C8B89A', '#8A7A64', 1) + ovale(0, -7, 8, 6, robe, '#8A7A64', 1.2) + trait('M-4,-8 Q0,-5 4,-8', '#C8B89A', 1)
    + tete + '</g>';
}
// Un mouton : une toison de bulles crème, la tête et les pattes sombres ; il broute
function mouton(x, y, k, sens, begin) {
  return ombre(x, y, 16 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-7,-4 L-7,0 M-2,-4 L-2,0 M5,-4 L5,0 M9,-4 L9,0', '#3A3038', 2.4)
    + [[-8, -10, 6], [-2, -13, 7], [5, -12, 6.5], [9, -8, 5], [-4, -7, 6], [3, -7, 6]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ilLaine)" stroke="#9A8E80" stroke-width="1.1"/>`).join('')
    + ovale(-3, -15, 4, 2, '#FFFFFF', 'none', 0, ' opacity=".7"')
    + `<g><animateTransform attributeName="transform" type="rotate" values="0 12 -10;24 12 -10;24 12 -10;0 12 -10;0 12 -10" keyTimes="0;0.2;0.6;0.75;1" calcMode="spline" keySplines="${Array(4).fill(SPL).join(';')}" dur="5s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + ovale(16, -10, 4.4, 3.6, '#3A3038', '#1E1A20', 1) + ovale(13.4, -12.6, 2, 1.2, '#3A3038', '#1E1A20', 0.8) + `<circle cx="17.4" cy="-10.8" r=".8" fill="#FFFFFF"/>` + '</g></g>';
}
// Une chèvre : pelage brun et blanc, cornes courbes, barbiche ; elle relève la tête de temps en temps
function chevre(x, y, k, sens, begin) {
  return ombre(x, y, 14 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-7,-6 L-7,0 M-3,-6 L-3,0 M5,-6 L5,0 M8,-6 L8,0', '#5A3A26', 2.2)
    + forme('M-11,-8 Q-12,-16 -4,-17 L8,-17 Q13,-16 12,-8 Q8,-4 0,-4 Q-8,-4 -11,-8 Z', 'url(#ilChevre)', '#4A2E1E', 1.3)
    + forme('M-2,-17 Q4,-12 10,-16 L8,-17 Z', '#FFF6E8', 'none', 0, ' opacity=".8"') + trait('M-11,-12 L-15,-16', '#4A2E1E', 1.6)
    + `<g><animateTransform attributeName="transform" type="rotate" values="0 10 -16;0 10 -16;-18 10 -16;-18 10 -16;0 10 -16" keyTimes="0;0.4;0.5;0.8;1" calcMode="spline" keySplines="${Array(4).fill(SPL).join(';')}" dur="6s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + forme('M10,-16 Q16,-24 20,-19 Q22,-14 17,-12 Q12,-12 10,-16 Z', 'url(#ilChevre)', '#4A2E1E', 1.2)
    + trait('M14,-22 Q12,-29 7,-29 M16,-22 Q16,-29 11,-31', '#C8B48A', 1.8) + trait('M18,-12 L18,-8', '#FFF6E8', 1.6)
    + `<circle cx="17" cy="-18" r=".8" fill="#1E1A10"/>` + '</g></g>';
}
// Un fil à linge entre deux perches : trois linges qui battent au vent
function linge(x0, y0, x1, y1) {
  const mx = (x0 + x1) / 2, my = Math.max(y0, y1) - 14;
  const draps = [['#F2E6D0', 0.25], ['#7EB0E0', 0.5], ['#E8A0A8', 0.75]].map(([c, t], i) => {
    const x = x0 + (x1 - x0) * t, y = (1 - t) * (1 - t) * (y0 - 26) + 2 * t * (1 - t) * my + t * t * (y1 - 26);
    return `<g transform="translate(${f(x)} ${f(y)})"><g><animateTransform attributeName="transform" type="skewX" values="-10;8;-10" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL};${SPL}" dur="${f(2.2 + i * 0.3)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/>`
      + forme('M-6,0 L6,0 L7,14 Q0,16 -7,14 Z', c, '#6A5A54', 1.1) + trait('M-4,4 L4,4', '#FFFFFF', 1, ' opacity=".4"') + '</g></g>';
  }).join('');
  return trait(`M${x0},${y0} L${x0},${y0 - 28} M${x1},${y1} L${x1},${y1 - 28}`, '#5A3A26', 2.6) + trait(`M${x0},${y0 - 26} Q${mx},${my} ${x1},${y1 - 26}`, '#D8CCB0', 1) + draps;
}
// La barque échouée sur le sable, sa rame
function barque(x, y, k) {
  return ombre(x, y + 2, 34 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k}) rotate(-8)">`
    + forme('M-30,-8 Q-28,4 -14,6 L18,6 Q30,4 34,-10 Z', 'url(#ilCoque)', '#3E2618', 1.8)
    + forme('M-30,-8 L34,-10 Q2,-4 -30,-8 Z', '#3E2618') + trait('M-26,-2 L30,-4 M-20,3 L24,2', '#5A3A26', 1, ' opacity=".6"')
    + trait('M-6,-12 L22,4', '#B08458', 2.4) + forme('M20,2 l8,6 l-2,2 l-8,-5 Z', '#B08458', '#5A3A26', 1) + '</g>';
}

// Les dégradés de l'île
const defs = () => '<defs>'
  // (la mousse de la jungle, émeraude et sarcelle, le sable mauve sous la lune, la falaise violette : choix de l'auteur,
  // 18 oct. : l'île était trop claire pour le papier néon)
  + rayonne('ilHerbe', -40, -30, 300, [[0, '#26905E'], [0.45, '#156A50'], [0.85, '#0A4840'], [1, '#063430']])
  + rayonne('ilHerbeMorte', -40, -30, 300, [[0, '#4A4658'], [0.45, '#302C42'], [0.85, '#1E1A2E'], [1, '#141020']])
  + degrade('ilPieu', -3, 0, 3, 0, [[0, '#8A6A50'], [1, '#4A3426']])
  + degrade('ilPieuSombre', -3, 0, 3, 0, [[0, '#5A4A40'], [1, '#2E2420']])
  + degrade('ilFalaise', 0, 20, 0, 130, [[0, '#6A4A8A'], [0.4, '#3E2A62'], [1, '#1A1034']])
  + degrade('ilSable', 0, 40, 0, 154, [[0, '#C8A2B8'], [1, '#7A4A7E']])
  + degrade('ilChemin', 0, -10, 0, 120, [[0, '#B89A9A'], [1, '#8A6A7A']])
  + rayonne('ilOmbre', 0.5, 0.5, 0.5, [[0, '#14243A', 0.45], [1, '#14243A', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilFeuillage', -8, -56, 36, [[0, '#A8DC7A'], [0.6, '#5FA25A'], [1, '#2F6A46']])
  + rayonne('ilFeuillage2', -8, -56, 36, [[0, '#C8E08A'], [0.6, '#86AE52'], [1, '#4A6E3A']])
  + rayonne('ilBuisson', -4, -18, 22, [[0, '#9CD47A'], [1, '#3E7E4E']])
  + degrade('ilSapin', 0, -50, 0, 0, [[0, '#6AB07A'], [1, '#235A42']])
  + degrade('ilTronc', -4, 0, 4, 0, [[0, '#8A6244'], [1, '#5A3A26']])
  + degrade('ilPlanches', 0, -30, 0, 0, [[0, '#C49466'], [1, '#8A5E3C']])
  + degrade('ilPlanchesOmbre', 0, -40, 0, 0, [[0, '#8A6448'], [1, '#5A3E2C']])
  + degrade('ilChaume', 0, -52, 0, -28, [[0, '#F2D48A'], [1, '#B48A44']])
  + degrade('ilChaumeOmbre', 0, -60, 0, -28, [[0, '#C8A460'], [1, '#8A6430']])
  + degrade('ilPierre', 0, -64, 0, -48, [[0, '#A8A2AE'], [1, '#6A6474']])
  + degrade('ilVitre', 0, -22, 0, -10, [[0, '#FFF2B8'], [1, '#FFB84A']])
  + degrade('ilVoile', 0, -42, 0, 0, [[0, '#FFF8EA'], [1, '#D8C8A8']])
  + degrade('ilLueurTente', 0, -24, 0, 0, [[0, '#FFE69A'], [1, '#F2A040']])
  + degrade('ilTerre', 0, -10, 0, 50, [[0, '#9A6A44'], [1, '#6A4430']])
  + degrade('ilEpi', 0, -20, 0, -12, [[0, '#FFE69A'], [1, '#D8A440']])
  + degrade('ilCoque', 0, -10, 0, 6, [[0, '#A87650'], [1, '#6A4430']])
  + degrade('ilChevre', 0, -24, 0, -4, [[0, '#C8946A'], [1, '#8A5A3A']])
  + rayonne('ilLaine', -2, -14, 14, [[0, '#FFFDF6'], [1, '#E2D6C2']])
  + rayonne('ilLueurChaude', 0.5, 0.5, 0.5, [[0, '#FFD27A', 0.6], [1, '#FFB04A', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilLueurFeu', 0.5, 0.5, 0.5, [[0, '#FFC060', 0.55], [0.5, '#FF9A40', 0.18], [1, '#FF9A40', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilFumee', 0.5, 0.5, 0.5, [[0, '#DCE4EE', 0.8], [1, '#DCE4EE', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + '</defs>';

// (survie : la même île après dix ans d'apocalypse, l'écran de l'orage, splash_survie.js)
function ileVivante({ survie = false } = {}) {
  let s = defs();
  // l'écume qui respire autour, la plage, la falaise et ses strates, sa mousse ; l'herbe et sa lumière
  s += ovale(0, 132, 320, 40, '#E8F6FF', 'none', 0, ' opacity=".35"').replace('/>', `>${palpite('rx', '312;328;312', 4.6)}</ellipse>`);
  s += forme('M-300,44 Q-312,140 0,154 Q312,140 300,44 Z', 'url(#ilSable)', '#4A2A5A', 2.4);
  s += forme('M-274,22 Q-282,74 -232,94 Q-120,124 0,124 Q120,124 232,94 Q282,74 274,22 Z', 'url(#ilFalaise)', '#120A24', 2.6);
  s += trait('M-262,52 Q-140,84 0,86 Q140,84 262,52 M-240,74 Q-120,104 0,106 Q120,104 240,74', '#2A1A48', 1.4, ' opacity=".55"');
  s += trait('M-180,76 L-172,98 M-60,92 L-56,112 M70,92 L66,112 M190,74 L182,96', '#140A2A', 1.4, ' opacity=".5"');
  s += ovale(0, 16, 274, 76, survie ? 'url(#ilHerbeMorte)' : 'url(#ilHerbe)', survie ? '#0E0A1A' : '#06302C', 2.6);
  s += [-230, -170, -96, -20, 60, 140, 210].map((x, i) => forme(`M${x - 10},${f(16 + 76 * Math.sqrt(1 - (x / 274) ** 2) - 3)} q4,${10 + (i % 3) * 5} 10,${8 + (i % 2) * 6} q4,${-6 - (i % 3) * 4} 8,-12 Z`, survie ? '#2A2640' : '#0E5A4A', survie ? '#0E0A1A' : '#06302C', 1.2)).join('');
  // (le liseré de lune sur le bord du fond : cyan, le néon de la nuit ; après l'apocalypse, la lueur des incendies)
  s += trait('M-240,-14 Q-120,-56 0,-58 Q120,-56 240,-14', survie ? '#FF6A4A' : '#5CF2E6', 2.4, ' opacity=".5"');
  s += herbes(150, 5, survie ? ['#3A3650', '#4A4660', '#2A2640'] : undefined);
  // le chemin de la plage au feu, et vers les cabanes
  s += forme('M-10,92 Q-22,70 -6,54 Q8,42 -2,30 L10,30 Q18,44 6,56 Q-6,72 8,92 Z', 'url(#ilChemin)', '#5A3A5A', 1.4);
  s += trait('M2,30 Q-40,12 -96,4 M4,30 Q60,14 112,4', '#9A7A8A', 7, ' opacity=".8"');
  // tout ce qui est posé sur l'île : les sept constructions du jeu à leur dernier palier (choix de l'auteur, 16 oct. :
  // l'aperçu de ce qu'on atteint), les hautes au fond, sur les côtés (le centre reste dégagé sous les mains d'Anya, la
  // Fontaine au milieu) ; devant, le Potager ; le Ponton s'avance sur la mer, au bord de la plage ; les vergers, les cultures, les bêtes. Tout à la
  // même échelle (K : celle du jeu entre eux), du fond vers l'avant (triés sur y) ; les bêtes respirent d'un rien
  const K = 0.55;
  // (le Ponton s'avance sur la mer : sans le bassin d'eau claire où le jeu le pose, ses ovales autour de son ancrage)
  const BASSIN = /<ellipse cx="-2\.4" [^>]*\/>/g;
  const CONSTRUCTIONS = [['atelier', -212, -12, 8], ['carriere', -110, -36, 4], ['puits', 0, -44, 12], ['bosquet', 108, -36, 8],
    ['foyer', 206, -12, 5], ['potager', -128, 52, 10], ['ponton', 246, 126, 4, BASSIN]].filter(([nom]) => !(survie && nom === 'potager'));
  // La flore et la faune du jeu, composées en masses et non semées (choix de l'auteur, 18 oct. : « des items random mal
  // harmonisés ») : au fond, une lisière de jungle continue qui cadre le village, comme le cocon du jeu ; sur les côtés,
  // ses massifs qui descendent, leurs fleurs en lisière ; devant, une palmeraie de part et d'autre du chemin, les roseaux
  // près de l'épave. Chaque bête à sa place : le toucan et le hibou dans la lisière, le cerf et le renard à l'orée, les
  // lapins près des cultures, le héron dans les roseaux, le crabe et la tortue sur le sable
  // (un peu plus grandes que le jeu entre elles : elles doivent se lire de loin, sur l'écran de démarrage)
  const P = 'plantes/', A = 'animaux/', FA = K * 1.6 * 1.4, KP = K * 1.35, B = bibliotheque();
  const g = rnd(23);
  // le bord de l'herbe à l'angle a (degrés : 0 à droite, 270 au fond), rentré de r
  const bord = (a, r = 0) => { const t = (a * Math.PI) / 180; return [(274 - r) * Math.cos(t), 16 + (76 - r * 0.28) * Math.sin(t)]; };
  // (après l'apocalypse, la jungle est morte : arbres morts, souches, rondins, et les champignons qui luisent)
  const GRANDS = survie ? ['arbre_mort', 'arbre_mort_brun', 'arbre_mort_champignons', 'arbre_mort_petit_brun'] : ['ravenala', 'bananier_emeraude', 'fougere', 'bananier'];
  const MOYENS = survie ? ['souche_grise', 'rondin_gris_champignons'] : ['monstera', 'alocasia'];
  const FLEURS = survie ? ['champignons', 'souche_petite_champignons', 'champignons_bruns', 'rondin_petit_champignons'] : ['heliconia', 'croton', 'bromelia', 'orchidees'];
  const JUNGLE = [];
  // (la lisière du fond : un grand tous les 10°, un moyen devant lui, de 196° à 344°)
  for (let a = 196, i = 0; a <= 344; a += 10, i++) {
    const [x, y] = bord(a, 6), [xm, ym] = bord(a + 5, 26);
    JUNGLE.push([`${P}${GRANDS[i % GRANDS.length]}.svg`, x, y - 4, KP * (0.95 + g() * 0.2)]);
    if (i % 2 === 0) JUNGLE.push([`${P}${MOYENS[(i / 2) % MOYENS.length]}.svg`, xm, ym, KP * 0.9]);
  }
  // (les massifs des côtés : de 150° à 192° à gauche, de -12° à 30° à droite ; les fleurs en lisière, plus à l'intérieur)
  for (const [a0, a1] of [[150, 192], [-12, 30]]) {
    for (let a = a0, i = 0; a <= a1; a += 7, i++) {
      const [x, y] = bord(a, 10), [xf, yf] = bord(a, 40);
      JUNGLE.push([`${P}${i % 2 ? MOYENS[i % MOYENS.length] : GRANDS[(i + 2) % GRANDS.length]}.svg`, x, y, KP * (0.85 + g() * 0.2)]);
      JUNGLE.push([`${P}${FLEURS[(i + (a0 > 0 ? 0 : 3)) % FLEURS.length]}.svg`, xf, yf, KP * 0.95]);
    }
  }
  const POSES = survie ? [
    ...JUNGLE,
    // (le potager n'est plus qu'une ruine ; sur la plage, des souches, du bois mort, la brume qui ronge)
    ['decor/ruines/ruine_maison_1.svg', -128, 56, K * 0.6], ['decor/ruines/colonne_brisee_1.svg', 96, 58, K * 0.8],
    [`${P}rondin_gris.svg`, -64, 122, KP], [`${P}souche_grise.svg`, 70, 124, KP], [`${P}arbre_mort_petit.svg`, 104, 138, KP * 0.9],
    ['decor/camp/epave/hirondelle_petite_1.svg', -206, 124, K]
  ] : [
    ...JUNGLE,
    // (une culture et ses champignons au pied de la lisière, devant)
    ['decor/cultures/ble/culture_ble_croissance_3.svg', 52, 44, K], ['decor/cultures/choux/culture_choux_croissance_3.svg', 96, 58, K],
    // (la palmeraie devant, de part et d'autre du chemin ; les roseaux près de l'épave ; l'épave)
    [`${P}palmier_cocos.svg`, -64, 120, KP], [`${P}palmier_petit_cocos.svg`, -100, 136, KP * 0.9], [`${P}palmier_petit_cocos.svg`, -36, 140, KP * 0.85],
    [`${P}palmier_cocos.svg`, 70, 122, KP], [`${P}palmier_petit_cocos.svg`, 104, 138, KP * 0.9], [`${P}palmier_petit_cocos.svg`, 40, 142, KP * 0.85],
    [`${P}roseaux_rive.svg`, -262, 96, KP], [`${P}roseaux_petits_rive.svg`, -240, 112, KP],
    ['decor/camp/epave/hirondelle_petite_1.svg', -206, 124, K],
    // (les bêtes, chacune à sa place)
    [`${A}climat/toucan/toucan_avant_joie.svg`, -152, -30, FA, 1], [`${A}bois/cerf/cerf_avant_joie.svg`, 186, 34, FA, 1], [`${A}bois/renard/renard_avant_joie.svg`, -196, 50, FA, 1],
    [`${A}bois/lapin/lapin_avant_joie.svg`, 30, 60, FA, 1], [`${A}bois/lapin/lapin_avant_repos.svg`, 120, 70, FA * 0.9, 1], [`${A}bois/herisson/herisson_avant_joie.svg`, -88, 74, FA, 1],
    [`${A}climat/cameleon/cameleon_avant_joie.svg`, 150, 40, FA * 0.9, 1], [`${A}climat/grenouille/grenouille_avant_joie.svg`, -226, 84, FA, 1],
    [`${A}eau/heron/heron_avant_joie.svg`, -278, 112, FA, 1], [`${A}mer/crabe/crabe_profil_joie.svg`, -150, 146, FA, 1], [`${A}climat/tortue/tortue_avant_joie.svg`, 150, 144, FA, 1],
    [`${A}ferme/poule-rousse/poule-rousse_avant_repos.svg`, -46, 62, FA, 1], [`${A}ferme/mouton/mouton_avant_repos.svg`, 18, 76, FA, 1], [`${A}ferme/chat/chat_avant_assis_1.svg`, -4, 92, FA, 1]
  ];
  // ce qui vole et ce qui nage : les papillons et le hibou au-dessus de l'île, les mouettes plus haut, les dauphins et
  // la baleine dans la mer, devant
  const AIRS = survie ? [[`${A}climat/corbeau/corbeau_avant_joie.svg`, -196, -112, FA], [`${A}climat/corbeau/corbeau_avant_joie.svg`, 150, -122, FA * 0.9],
    [`${A}climat/corbeau/corbeau_avant_joie.svg`, 46, -136, FA * 0.8], ['egares/fantome/fantome_avant_brume_1.svg', -148, -70, K * 1.6], ['egares/fantome/fantome_avant_brume_2.svg', 186, -64, K * 1.4]] : [[`${A}bestiaire/papillon-bleu/papillon-bleu_face_vol_1.svg`, 76, -96, FA], [`${A}bestiaire/papillon-lune/papillon-lune_face_vol_1.svg`, -100, -88, FA],
    [`${A}bestiaire/hibou/hibou_face_joie.svg`, -74, -86, FA], [`${A}mer/mouette-vol/mouette-vol_profil_plane.svg`, 232, -116, FA], [`${A}mer/mouette-vol/mouette-vol_profil_plane.svg`, -262, -104, FA * 0.8],
    [`${A}mer/dauphin/dauphin_profil_nage_2.svg`, 312, 168, FA], [`${A}mer/dauphin/dauphin_profil_nage_1.svg`, 366, 182, FA * 0.8], [`${A}mer/baleine-dos/baleine-dos_profil_nage_1.svg`, -360, 168, FA]];
  // L'assaut (après l'apocalypse) : une palissade de pieux en U, des côtés jusque devant, sa porte sur le chemin de la
  // plage, gardée par deux braseros ; des torches le long des pieux, trois pieux en feu ; les revenants qui montent de la
  // plage et sortent des bords (zombies, noyé de l'Hirondelle, racine errante, esprit sylvestre, bêtes de brume) ; la
  // brume qui ronge le sable ; les flèches enflammées tirées du village
  const ASSAUT = [];
  if (survie) {
    const E = 'egares/', KE = K * 1.6;
    for (let a = -24, n = 0; a <= 204; a += 3.4, n++) {
      if (a > 80 && a < 100) continue;
      const [x, y] = bord(a, 30), h = 15 + (n % 3) * 2;
      ASSAUT.push({ y, dessin: () => pieu(x, y, h, n) + ([7, 20, 31, 44, 52].includes(n) ? flammes(x, y - h + 2, 1.1, n * 0.13) : '') });
      if (n % 9 === 4) ASSAUT.push({ y: y + 0.5, dessin: () => poser('decor/defenses/torche_allumee_1.svg', `it${n}`, x, y - 2, KP * 0.7) });
    }
    // (deux toits qui brûlent : l'Atelier et le Bosquet ; leur fumée monte dans l'orage)
    for (const [x, y, k] of [[-214, -58, 1.8], [-196, -50, 1.3], [104, -78, 1.6]]) ASSAUT.push({ y: y + 80, dessin: () => flammes(x, y, k, x * 0.01) });
    for (const [x, y] of [[-24, 80], [24, 80]]) ASSAUT.push({ y, dessin: () => poser('decor/creations/brasero_2.svg', `ibr${x}`, x, y, KP * 0.8) });
    for (const [rel, x, y, k] of [['decor/embrume/embrume_2x2_1.svg', -250, 118, K * 0.45], ['decor/embrume/embrume_2x2_2.svg', 238, 60, K * 0.4], ['decor/embrume/embrume_nuage_1.svg', 150, 142, K * 1.4]]) ASSAUT.push({ y: y - 30, dessin: () => poser(rel, `iem${x}`, x, y, k) });
    for (const [qui, x, y, k] of [['zombie/zombie_avant_marche_1', -120, 134, KE], ['zombie/zombie_avant_brume_2', 44, 142, KE], ['noye-de-l-hirondelle/noye-de-l-hirondelle_avant_brume_1', -244, 134, KE],
      ['racine-errante/racine-errante_avant_brume_1', 284, 62, KE], ['esprit-sylvestre/esprit-sylvestre_avant_brume_1', -290, 60, KE], ['lapin-de-brume/lapin-de-brume_avant_brume_1', 156, 136, KE],
      ['poney-de-brume/poney-de-brume_avant_brume_1', -40, 150, KE * 0.9]]) ASSAUT.push({ y, vit: 1, dessin: () => poser(`${E}${qui}.svg`, `ie${x}`, x, y, k) });
  }
  // (après l'apocalypse, chaque construction porte ses dégâts, un tirage par construction ; ses lumières sont moins nombreuses)
  const items = [...ASSAUT.map((a, i) => ({ ...a, i: i + 200 })), ...CONSTRUCTIONS.map(([nom, x, y, e, sans], i) => ({ y, i, dessin: () => batiment(nom, `ib${i}`, x, y, K, survie ? Math.round(e / 3) : e, sans, survie ? i + 1 : undefined) })),
    ...POSES.map(([rel, x, y, k, vit], i) => ({ y, i: i + 10, vit, dessin: () => (rel.startsWith(P) ? B.poser(rel, x, y, k) : poser(rel, `il${i}`, x, y, k)) }))];
  s += items.sort((a, b) => a.y - b.y || a.i - b.i).map(({ dessin, vit, i }) => {
    const d = dessin();
    return vit ? `<g>${vaVient('translate', '0 0', '0 -1.2', 2.4 + (i % 3) * 0.4, i * 0.3)}${d}</g>` : d;
  }).join('');
  // (les flèches enflammées : du village vers les revenants)
  if (survie) s += [[-60, 30, -120, 96], [80, 20, 44, 104], [0, 12, -244, 98], [140, 0, 284, 26], [-150, 10, -290, 24], [30, 4, 156, 112], [-20, 20, -40, 116], [180, 10, 284, 30]].map(([x0, y0, x1, y1], i) => fleche(x0, y0, x1, y1, i * 0.37)).join('');
  // (les définitions des dessins réutilisés, avant tout le reste)
  s = B.defs() + s;
  s += AIRS.map(([rel, x, y, k], i) => `<g>${vaVient('translate', '0 0', `0 ${i % 2 ? -3 : -2}`, 2.2 + (i % 3) * 0.5, i * 0.4)}${poser(rel, `ia${i}`, x, y, k)}</g>`).join('');
  return s;
}

module.exports = { ileVivante };
