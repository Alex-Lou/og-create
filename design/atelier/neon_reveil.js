// Le réveil en néon (choix de l'auteur, 18 oct. : « pourquoi tu n'as pas retouché toute la scène… le réveil ? toujours
// vieux papier sépia ? ») : 01_paupieres, 01_greve, 01_carte et 00_tampon (la même carte) dans la matière du naufrage
// (neon_naufrage.js) : le couchant magenta et corail du tout début, ses étoiles, ses nuages éclairés par en dessous ; la
// mer aux crêtes de lumière, le chemin de lumière sous le soleil ; le sable violet profond, la dentelle d'écume cyan ;
// ce que la mer a rendu, la carte et le tampon, dans la palette vive. Les pièces, la caméra et les temps restent ceux
// des scènes gravées (gravure_plage.js) ; seule leur matière change.
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure } = require('./gravure');
const GP = require('./gravure_plage');
const N = require('./neon_naufrage');
const { neon } = require('./neon_pont');
const { G, D_ } = require('./theatre_pont');
const { HORIZON, RIVAGE, SOLEIL } = GP;
const { lumineux, enNeon, enCouleurs, plein, chemin, ENCRE, CYAN, ACIDE, MAGENTA } = N;

// ——— le décor du couchant, en néon ———
const ciel = p => { const A = atelier(`${p}E`); return N.ciel(p, HORIZON, SOLEIL) + A.out(N.etoiles(60, 41, G, 120)); };
const soleil = p => N.soleil(p, SOLEIL);
// (les bancs de nuages : des strates éclairées par en dessous, magenta puis corail)
const NUAGES = [[0, 60, '#FFB8D8'], [1, 134, '#FF8A70']];
// la mer : quatre rangées, du large (pâles, roses de couchant) au bord (sarcelles, crêtes cyan) ; le chemin de lumière
const RANGEES = [[HORIZON + 4, 3, 30, ['#4A7AB8', '#2A4A7A', '#14284A'], '#FFB8D8'], [HORIZON + 16, 4, 40, ['#2A7A9A', '#14405A', '#0A2238'], '#FFD0E0'], [HORIZON + 32, 6, 52, ['#1A6A7A', '#0A3A4A', '#06202A'], '#B8FFF0'], [HORIZON + 50, 8, 66, ['#0E5A6A', '#082E3A', '#04161E'], CYAN]];
function mer(p, lumiere = true) {
  let s = RANGEES.map((r, i) => N.vague(`${p}r`, 10 + i, r)).join('');
  const A = atelier(`${p}O`);
  if (lumiere) for (let i = 0; i < 16; i++) { const t = i / 16, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 6 + 30 * t + 8 * hash(i, 3), x = SOLEIL[0] + (hash(i, 5) - 0.5) * (14 + 60 * t); s += lumineux(`M${f(x - w / 2)},${f(y)} L${f(x + w / 2)},${f(y - 0.6)}`, i % 3 ? '#FFB060' : MAGENTA, 0.8 + t * 1.2, 0.12); }
  return A.out(s);
}
// la plage : le sable mouillé violet, qui boit le couchant ; la dentelle d'écume de lumière ; le sable sec indigo,
// hachuré ; coquillages, étoiles de mer, algues, galets, aux couleurs vives
function plage(p) {
  const A = atelier(`${p}P`);
  let s = gravure(A, [...courbe(t => [G + (D_ - G) * t, RIVAGE - 4 + 5 * Math.sin(t * 9)], 30), [D_, D_], [G, D_]], A.lin([[0, '#4A1A7A'], [1, '#1E0A40']], 0, RIVAGE - 4, 0, RIVAGE + 40), { seed: 70, amp: 0.4, angle: 6, pas: 3, ombre: 0.3, tailles: 0, portee: 0, trait: 1.4, lumiere: [0, -1] });
  s += `<ellipse cx="${SOLEIL[0]}" cy="${RIVAGE + 10}" rx="56" ry="12" fill="${A.rad([[0, '#FF8AC0', 0.7], [0.5, MAGENTA, 0.3], [1, MAGENTA, 0]], SOLEIL[0], RIVAGE + 10, 56)}"/>`;
  const dentelle = courbe(t => [G + (D_ - G) * t, RIVAGE + 3 + 4 * Math.sin(t * 13) + 1.6 * Math.sin(t * 47)], 60);
  s += lumineux(chemin(dentelle), '#E8FFFA', 1.2, 0.16) + lumineux(chemin(dentelle.map(([x, y], k) => [x, y + 5 + 2 * Math.sin(k)])), CYAN, 0.6, 0.1);
  const sec = [...courbe(t => [G + (D_ - G) * t, RIVAGE + 22 + 8 * Math.sin(t * 5 + 1) + 3 * Math.sin(t * 17)], 34), [D_, D_], [G, D_]];
  s += gravure(A, sec, A.lin([[0, '#3A1868'], [0.5, '#24104A'], [1, '#100626']], 0, RIVAGE + 20, 0, D_), { seed: 72, amp: 0.6, angle: 14, pas: 3.2, ombre: 0.35, tailles: 2, tailleP: 5, portee: 0.4, dy: 4, lumiere: [-0.2, -1] });
  s += lumineux(chemin(sec.slice(0, -2)), '#C870F0', 0.5, 0.08);
  for (let i = 0; i < 40; i++) s += `<circle cx="${f(G + hash(i, 81) * (D_ - G))}" cy="${f(RIVAGE + 30 + hash(i, 83) * 180)}" r="${f(0.6 + hash(i, 85))}" fill="${i % 5 ? '#9A7AF0' : ACIDE}" opacity="0.6"/>`;
  // (la mer laisse des points de lumière le long du bord)
  for (let i = 0; i < 14; i++) { const x = G + hash(i, 91) * (D_ - G), y = RIVAGE + 6 + hash(i, 92) * 12; s += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="${A.rad([[0, CYAN, 0.5], [1, CYAN, 0]], x, y, 4)}"/><circle cx="${f(x)}" cy="${f(y)}" r="0.9" fill="#E8FFFA"/>`; }
  const coquillage = (x, y, r, c) => gravure(A, courbe(t => [x + r * Math.cos(Math.PI + t * Math.PI), y - r * 1.2 * Math.sin(t * Math.PI)], 10), c, { seed: x, amp: 0.15, tailles: 0, noir: false, trait: 1, portee: 0.3, dx: 1, dy: 1 }) + `<path d="M${x},${y} L${x},${f(y - r)} M${f(x - r * 0.5)},${y} L${f(x - r * 0.2)},${f(y - r * 0.9)} M${f(x + r * 0.5)},${y} L${f(x + r * 0.2)},${f(y - r * 0.9)}" stroke="${ENCRE}" stroke-width="0.6"/>`;
  const etoile = (x, y, r, a, c) => gravure(A, Array.from({ length: 10 }, (_, k) => { const an = a + (k / 10) * Math.PI * 2, rr = k % 2 ? r * 0.42 : r; return [x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.7]; }), c, { seed: x + 7, amp: 0.2, tailles: 0, trait: 1.1, portee: 0.35, dx: 1, dy: 1, pas: 2 });
  s += coquillage(150, 342, 5, '#FFD0EC') + coquillage(262, 368, 4, '#FF9AD0') + coquillage(60, 362, 4.4, '#FFD0EC') + etoile(232, 340, 10, 0.3, '#FF6A4A') + etoile(96, 384, 7, 1.1, MAGENTA);
  for (const [x, y, k] of [[22, 322, 1.1], [304, 306, 0.8], [190, 380, 0.9]]) { const d = `M${x},${y} q${f(6 * k)},${f(-4 * k)} ${f(14 * k)},${f(-1 * k)} t${f(12 * k)},${f(-2 * k)} t${f(10 * k)},${f(2 * k)}`; s += `<path d="${d}" fill="none" stroke="${ENCRE}" stroke-width="${f(3.4 * k)}" stroke-linecap="round"/>` + lumineux(d, '#3AE8B0', 0.9 * k, 0.1); }
  for (const [x, y, rx, ry, i] of [[70, 346, 9, 5, 0], [330, 360, 12, 6, 1], [300, 322, 6, 3.4, 2], [380, 396, 10, 5, 3]]) s += gravure(A, courbe(t => [x + rx * Math.cos(t * Math.PI * 2), y + ry * Math.sin(t * Math.PI * 2)], 14), '#4A3A8A', { seed: 90 + i, amp: 0.3, tailles: 0, trait: 1.2, portee: 0.4, dx: 1, dy: 2, pas: 2 });
  return A.out(s);
}
// ce qui vit au couchant : le chemin de lumière qui scintille, une mouette de lumière, des étoiles qui clignent
function vivant() {
  let s = '';
  for (let i = 0; i < 9; i++) { const t = i / 9, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 8 + 26 * t, x = SOLEIL[0] + (hash(i, 15) - 0.5) * (16 + 60 * t), d = 1 + hash(i, 17) * 1.4; s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1.4 + 1.4 * t)}" fill="#FFF0F8" opacity="0"><animate attributeName="opacity" values="0;0.95;0" dur="${f(d)}s" begin="${f(-hash(i, 19) * d)}s" repeatCount="indefinite"/></rect>`; }
  s += `<g><animateMotion path="M-30,110 Q120,70 240,96 T460,60" dur="16s" repeatCount="indefinite"/><path d="M-8,0 Q-4,-4 0,0 Q4,-4 8,0" fill="none" stroke="${CYAN}" stroke-width="3.4" stroke-opacity="0.25" stroke-linecap="round"/><path d="M-8,0 Q-4,-4 0,0 Q4,-4 8,0" fill="none" stroke="#E8FFFA" stroke-width="1.4" stroke-linecap="round"><animateTransform attributeName="transform" type="scale" values="1 1;1 -0.5;1 1" dur="0.6s" repeatCount="indefinite"/></path></g>`;
  for (const [x, y, d, beg, c] of [[60, 50, 2.2, 0, ACIDE], [170, 30, 2.8, 1, '#FFFFFF'], [330, 64, 2.4, 0.6, '#FFB8E8'], [380, 130, 3, 1.8, CYAN], [110, 118, 2.6, 1.2, '#FFFFFF']]) s += `<path d="M${x - 4},${y} L${x + 4},${y} M${x},${y - 4} L${x},${y + 4}" stroke="${c}" stroke-width="1.2" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="${d}s" begin="${-beg}s" repeatCount="indefinite"/></path>`;
  return s;
}
// le premier plan, tout près (peint flou) : un galet sombre, une touffe d'algues sarcelle
const premier = p => enNeon(() => enCouleurs(GP.premier(p)));
// le bord du regard : la nuit violette (on vient de rouvrir les yeux)
const regard = p => { const A = atelier(`${p}R`); return A.out(plein(A.rad([[0, '#000', 0], [0.66, '#14062A', 0.22], [1, '#05010F', 0.72]], 200, 210, 300))); };

// les dessins néon des pièces du décor, par identifiant (les autres pièces : leur dessin passé dans la palette vive)
const DECOR = {
  ciel: p => ciel(p), soleil: p => soleil(p), mer: p => enNeon(() => mer(p)), 'mer-soir': p => enNeon(() => mer(`${p}s`, false)), plage: p => enNeon(() => plage(p)),
  nuage0: p => N.strate(p, 0, NUAGES[0][1], NUAGES[0][2]), nuage1: p => N.strate(p, 1, NUAGES[1][1], NUAGES[1][2]),
  flou: p => ciel(p) + enNeon(() => mer(p) + plage(p)), premier: p => premier(p), regard: p => regard(p), teinte: p => N.vignette(p)
};
// ce que la mer a rendu reste en place d'une image à l'autre (choix de l'auteur, 18 oct. : les objets ne doivent ni
// surgir ni disparaître) : l'épave, la carte au loin, le premier plan, dans les trois images de la plage, à la même place
const OBJETS = () => { const g = GP.greve01().plans, c = GP.carte01().plans; return { epave: g.find(q => q.id === 'epave'), tache: c.find(q => q.id === 'tache'), premier: g.find(q => q.id === 'premier') }; };
function memesObjets(plans) {
  const O = OBJETS(), a = id => plans.some(q => q.id === id), apres = (id, q) => plans.splice(plans.findIndex(k => k.id === id) + 1, 0, q);
  if (!a('epave')) apres('plage', O.epave);
  if (!a('tache')) apres('epave', O.tache);
  if (!a('premier')) plans.splice(plans.findIndex(q => q.id === 'sable-pres' || q.id === 'regard'), 0, O.premier);
}
// une couleur, dans un dessin, passée dans la palette vive (pas les références url(#…) ni href="#…")
const recolore = svg => svg.replace(/(?<!url\()(?<!href=")#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, c => neon(c));
// une couleur ravivée sans changer de teinte (celle de l'avatar, game/acteur.js : neonCouleur) : pour les personnages et les
// scènes de jour, dont les peaux et les habits ne doivent pas changer de couleur ; plus saturée, les sombres vers l'indigo
const hexHsl = hex => { const n = hex.length === 4 ? [1, 2, 3].map(i => parseInt(hex[i] + hex[i], 16) / 255) : [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255), [r, g, b] = n, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; if (!d) return [0, 0, l]; const sa = d / (1 - Math.abs(2 * l - 1)), h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, sa, l]; };
const hslHex = (h, sa, l) => { const c = (1 - Math.abs(2 * l - 1)) * sa, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); };
function ravive(hex) {
  const [h, sa, l] = hexHsl(hex);
  if (l < 0.16) return hslHex(258, 0.55, Math.max(0.06, l));
  if (sa < 0.06) return hslHex(255, 0.18, l);
  return hslHex(h, Math.min(1, sa + 0.25, sa * 1.4 + 0.08), l);
}
const ravivee = svg => svg.replace(/(?<!url\()(?<!href=")#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, c => ravive(c));
// la lumière de l'avatar dans une scène néon (game/acteur.js : gravee, son rendu néon) : un voile violet léger
// (les lumières des scènes : l'ambiance où plonge le côté ombre, la couleur de la source sur le côté éclairé, le liseré)
const LUMIERES = {
  couchant: { ambiance: '#2A0A5A', eclat: '#FF7AB0', lisere: '#FFA8D0', force: 1.1 },
  nuit: { ambiance: '#140A48', eclat: '#7AB8FF', lisere: '#7AF8EE', force: 1.3 },
  matin: { ambiance: '#3A1A6A', eclat: '#FFC8D8', lisere: '#FFD8E8' },
  feu: { ambiance: '#1A0A40', eclat: '#FF9A40', lisere: '#FFB070', force: 1.15 },
  jour: { ambiance: '#3A2A7A', eclat: '#FFE8F4', lisere: '#B8FFF4', force: 0.7 }
};
const PERSONNAGES = new Set(['lorena']);
// une scène gravée, passée au néon : ses pièces, sa caméra, ses temps ; le décor du couchant redessiné (decor : faux pour
// une scène qui a son propre ciel), le reste recoloré ; l'avatar rendu en néon
function enNeonScene(scene, p, propres = {}, plage = false, decor = true, lumiere = 'couchant') {
  const sc = scene();
  if (plage) memesObjets(sc.plans);
  if (sc.partition.lumiere || sc.plans.some(q => q.id === 'avatar')) sc.partition.lumiere = { cote: (sc.partition.lumiere || {}).cote || 1, ...LUMIERES[lumiere], neon: true };
  for (const pl of sc.plans) {
    const d = pl.dessin, a = propres[pl.id] || (decor || pl.id === 'teinte' ? DECOR[pl.id] : null);
    if (pl.id === 'anime') { if (d && !propres.anime) pl.dessin = () => recolore(d()); continue; }
    if (!d) continue;
    // (les personnages gardent leurs couleurs, ravivées : Lorena et ses images)
    const perso = PERSONNAGES.has(pl.id) || PERSONNAGES.has(pl.imageDe);
    pl.dessin = a ? () => a(p) : perso ? () => enNeon(() => ravivee(d())) : () => enNeon(() => recolore(d()));
    // (les cadres du décor néon : ses nuages, des strates plus larges ; son soleil, ses anneaux et ses rayons)
    if (!decor) continue;
    if (/^nuage\d$/.test(pl.id)) pl.cadre = [G - 100, NUAGES[+pl.id.slice(-1)][1] - 24, D_ - G + 200, 34];
    if (pl.id === 'soleil') pl.cadre = [SOLEIL[0] - 200, SOLEIL[1] - 200, 400, 400];
  }
  const anime = sc.plans.find(q => q.id === 'anime');
  if (anime && propres.anime) anime.dessin = propres.anime;
  return sc;
}

// ——— les gros plans de la carte : le sable violet, l'eau qui lèche le bord ———
// le sable mouillé de près : ses rides éclairées d'un fil de lumière, ses grains ; empreinte : la trace humide de la carte
function sablePres(p, empreinte = false) {
  const A = atelier(`${p}Z`);
  let s = gravure(A, [[G, G], [D_, G], [D_, D_], [G, D_]], A.lin([[0, '#3A1868'], [1, '#14062E']], 0, G, 140, D_), { seed: 320, amp: 0, angle: 10, pas: 3.6, ombre: 0.4, tailles: 0, portee: 0, trait: 0, lumiere: [-0.5, -0.85] });
  for (let i = 0; i < 10; i++) { const y = G + 10 + i * 48, ride = courbe(t => [G + (D_ - G) * t, y + 7 * Math.sin(t * 8 + i) + 4 * Math.sin(t * 21)], 40); s += gravure(A, [...ride, ...ride.slice().reverse().map(([x, yy]) => [x, yy + 12])], i % 2 ? '#4A2080' : '#3E1A70', { seed: 321 + i, amp: 0.4, angle: 6, pas: 2.6, ombre: 0.4, tailles: 0, trait: 1.2, portee: 0.3, dy: 2, lumiere: [0, -1] }) + lumineux(chemin(ride), i % 3 ? '#9A6AF0' : MAGENTA, 0.4, 0.06); }
  for (let i = 0; i < 30; i++) s += `<circle cx="${f(G + hash(i, 81) * (D_ - G))}" cy="${f(G + hash(i, 83) * (D_ - G))}" r="${f(0.8 + 1.4 * hash(i, 85))}" fill="${hash(i, 87) < 0.5 ? '#FFD0EC' : '#7A5AE0'}" stroke="${ENCRE}" stroke-width="0.5"/>`;
  s += gravure(A, courbe(t => [60 + 12 * Math.cos(Math.PI + t * Math.PI), 340 - 14 * Math.sin(t * Math.PI)], 10), '#FFD0EC', { seed: 340, amp: 0.2, tailles: 0, noir: false, trait: 1.2, portee: 0.4 }) + `<path d="M330,350 q16,-10 34,-2 t30,-4" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round"/>` + lumineux('M330,350 q16,-10 34,-2 t30,-4', '#3AE8B0', 1.6, 0.1);
  if (empreinte) s += `<g transform="translate(200 206) rotate(-14) translate(-130 -84)"><path d="M0,0 L260,0 L260,140 L246,150 L252,158 L240,168 L0,168 Z" fill="#0A0420" opacity="0.5"/></g>`;
  return A.out(s);
}
// l'eau qui vient lécher le haut du gros plan : sarcelle sombre, sa dentelle d'écume de lumière
function ecumeBord(p) {
  const A = atelier(`${p}U`), bord = courbe(t => [G + (D_ - G) * t, 34 + 10 * Math.sin(t * 7 + 1) + 5 * Math.sin(t * 19)], 60);
  return A.out(gravure(A, [[G, G - 60], [D_, G - 60], ...bord.slice().reverse()], A.lin([[0, '#04202A'], [1, '#0E6A7A']], 0, G - 60, 0, 40), { seed: 350, amp: 0.4, angle: 4, pas: 3, tailles: 0, trait: 1.4, portee: 0.4, dy: 3, lumiere: [0, -1] }) + lumineux(chemin(bord), '#E8FFFA', 1.3, 0.16) + lumineux(chemin(bord.map(([x, y], k) => [x, y - 6 - 3 * Math.abs(Math.sin(k * 0.9))])), CYAN, 0.7, 0.1));
}
// la tache au loin (la carte) qui scintille
const TACHE = [128, 296];
const vivantTache = () => `<circle cx="${TACHE[0] + 4}" cy="${TACHE[1] - 2}" r="2.4" fill="${ACIDE}"><animate attributeName="opacity" values="0.2;1;0.4;0.2" dur="1.6s" repeatCount="indefinite"/><animate attributeName="r" values="1.4;3.4;1.8;1.4" dur="1.6s" repeatCount="indefinite"/></circle><path d="M${TACHE[0] + 4},${TACHE[1] - 9} v14 M${TACHE[0] - 3},${TACHE[1] - 2} h14" stroke="#FFFFFF" stroke-width="1" opacity="0"><animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.5;0.6;1" dur="3.2s" repeatCount="indefinite"/></path>`;
// le vent du large : des traits de lumière qui filent, des grains roses
function vent() {
  let s = '';
  for (let i = 0; i < 6; i++) { const y = 40 + i * 62, d = 1.4 + hash(i, 2); s += `<path d="M-60,${y} q60,-16 120,0 t120,-4" fill="none" stroke="#B8FFF4" stroke-width="2" stroke-linecap="round" opacity="0.7"><animateTransform attributeName="transform" type="translate" from="-80 20" to="480 -60" dur="${f(d)}s" begin="${f(-hash(i, 3) * d)}s" repeatCount="indefinite"/></path>`; }
  let grains = '';
  for (let i = 0; i < 40; i++) grains += `<circle cx="${f(hash(i, 5) * 400)}" cy="${f(hash(i, 6) * 400)}" r="${f(0.8 + hash(i, 7))}"/>`;
  return s + `<g fill="#FFD0EC" stroke="${ENCRE}" stroke-width="0.4"><animateTransform attributeName="transform" type="translate" from="-400 30" to="0 0" dur="1.2s" repeatCount="indefinite"/>${grains}<g transform="translate(400 -30)">${grains}</g></g>`;
}

const paupieres01 = () => enNeonScene(GP.paupieres01, 'np', { anime: () => vivant() }, true);
const greve01 = () => enNeonScene(GP.greve01, 'ng', { anime: () => vivant() }, true);
// (la carte : le chemin de lumière et la mouette continuent, la carte au loin se met à scintiller)
const carte01 = () => enNeonScene(GP.carte01, 'nc', { anime: () => vivant() + vivantTache(), 'sable-pres': p => enNeon(() => sablePres(p)), ecume: p => enNeon(() => ecumeBord(p)) }, true);
const tampon00 = () => enNeonScene(GP.tampon00, 'nt', { anime: () => vent(), 'sable-pres': p => enNeon(() => sablePres(p, true)) });

module.exports = { paupieres01, greve01, carte01, tampon00, enNeonScene, recolore, ravivee, LUMIERES };
