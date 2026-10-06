// Enseignes au nom du joueur (lot 4d) : dès le palier V, une enseigne se tient au pied de chaque bâtiment, côté avant.
// Six styles (services/signs.js du serveur, mêmes identifiants). Dessin plat, face à l'écran pour que le nom se lise ;
// repère en pixels du monde, ancré au pied de l'enseigne. Comme les annexes : des calques (dessin fixe ou n images à fps
// images/s). Le nom n'est pas dans le dessin : paintName l'écrit au canvas dans le cadre de texte du style, avec les
// polices du jeu (Fraunces, Nunito), au-dessus de l'image, et suit le balancement de l'enseigne en fer forgé.
import { sprite } from './iso.js';
import { ln, dot, ell, poly, f2, OUT } from './shopSprites.js';
import { cleanName } from '../utils/names.js';

const TAU = Math.PI * 2;
const FRAME = [-32, -56, 64, 62];
const FRAUNCES = 'Fraunces, Georgia, serif';
const NUNITO = 'Nunito, system-ui, sans-serif';
const WOOD = { light: '#D39A5E', mid: '#B07A45', dark: '#7E5230', deep: '#5E3B22' };
const IRON = '#3B3C42';

/* ---------- Petits outils (pixels) ---------- */
const rr = (x, y, w, h, r, fill, extra = '') => `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" rx="${f2(r)}" fill="${fill}"${extra}/>`;
const stroke = (color, width = 0.8) => ` stroke="${color}" stroke-width="${width}" stroke-linejoin="round"`;
// Ombre portée au sol
const shadow = (x, rx, ry = 4) => ell(x, 0.6, rx, ry, 'rgba(40,55,20,.22)');
// Piquet de bois planté, de y0 (sol) à y1 (haut), pointu si sharp
function stake(x, y0, y1, w = 3.2, sharp = false, colors = WOOD) {
  const h = w / 2;
  return poly([[x - h, y0], [x - h, y1], ...(sharp ? [[x, y1 - 2.4]] : []), [x + h, y1], [x + h, y0]], colors.mid, stroke(OUT, 0.6))
    + ln([x + h * 0.35, y0], [x + h * 0.35, y1 + 0.5], colors.dark, h * 0.7);
}
// Touffe d'herbe au pied d'un piquet
const tuft = (x, y) => ln([x, y], [x - 2.2, y - 3.6], '#5E9E44', 1.1) + ln([x + 0.6, y], [x + 0.8, y - 4.4], '#7DBF55', 1.1) + ln([x + 1.2, y], [x + 3, y - 3.2], '#5E9E44', 1.1);
// Fleur à cinq pétales
function flower(x, y, r, color) {
  let out = '';
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * TAU - Math.PI / 2;
    out += dot(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, r * 0.62, color);
  }
  return out + dot(x, y, r * 0.48, '#F6C443');
}
// Feuille en amande, inclinée de a (radians)
const leaf = (x, y, a, color) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="2.6" ry="1.2" fill="${color}" transform="rotate(${f2((a * 180) / Math.PI)} ${f2(x)} ${f2(y)})"/>`;
// Papillon, ailes ouvertes ou repliées
function butterfly(x, y, open, color) {
  const w = open ? 2.4 : 0.9;
  return `<ellipse cx="${f2(x - w * 0.62)}" cy="${f2(y)}" rx="${f2(w)}" ry="1.9" fill="${color}" opacity=".95"/>`
    + `<ellipse cx="${f2(x + w * 0.62)}" cy="${f2(y)}" rx="${f2(w)}" ry="1.9" fill="${color}" opacity=".95"/>`
    + ln([x, y - 1.6], [x, y + 1.6], '#3A2A20', 0.7);
}

/* ---------- Les six styles ---------- */
// Planche de bois : deux piquets, deux planches clouées, peinture brune
function bois() {
  return shadow(0, 19)
    + stake(-15, 1, -33, 3.2, true) + stake(15, 1, -33, 3.2, true)
    + rr(-20, -29.6, 42, 17, 2, WOOD.deep)
    + rr(-21, -31, 42, 17, 2, WOOD.light, stroke(OUT, 0.8))
    + ln([-20.4, -22.5], [20.4, -22.5], WOOD.dark, 0.9)
    + ln([-19, -29.7], [19, -29.7], 'rgba(255,255,255,.28)', 0.8) + ln([-19, -21.4], [19, -21.4], 'rgba(255,255,255,.2)', 0.7)
    + ln([-14, -26], [-6, -26.3], 'rgba(126,82,48,.35)', 0.5) + ln([7, -17.4], [16, -17.1], 'rgba(126,82,48,.35)', 0.5)
    + [[-18.6, -28.6], [18.6, -28.6], [-18.6, -16.4], [18.6, -16.4]].map(([x, y]) => dot(x, y, 0.85, '#4E3626')).join('')
    + tuft(-18, 1) + tuft(13.5, 1.4);
}
// Ardoise : chevalet de bois, ardoise noire, doodle à la craie, une craie sur la tablette
function ardoise() {
  const chalk = 'rgba(244,241,232,.85)';
  return shadow(0, 21)
    + ln([-12, -37], [-17, 1], WOOD.deep, 2.4) + ln([12, -37], [17, 1], WOOD.deep, 2.4)
    + poly([[-15.5, -38], [15.5, -38], [20, -6], [-20, -6]], WOOD.mid, stroke(OUT, 0.8))
    + poly([[-13.2, -35.6], [13.2, -35.6], [17.2, -8.6], [-17.2, -8.6]], '#2F3533', stroke('#1E2221', 0.5))
    + ln([-12.6, -34.4], [12, -34.4], 'rgba(255,255,255,.08)', 1.2)
    + rr(-21, -7, 42, 2.6, 1, WOOD.dark, stroke(OUT, 0.5))
    + ln([-19.5, -4.4], [-20.5, 1], WOOD.mid, 2.2) + ln([19.5, -4.4], [20.5, 1], WOOD.mid, 2.2)
    // Doodle : vague soulignée, une étoile, trois points
    + `<path d="M-10,-20.5 q2.5,-2 5,0 t5,0 t5,0 t5,0" fill="none" stroke="${chalk}" stroke-width="0.8" stroke-linecap="round"/>`
    + `<path d="M0,-17.2 l0.9,1.9 2,.2 -1.5,1.3 .5,2 -1.9,-1 -1.9,1 .5,-2 -1.5,-1.3 2,-.2z" fill="${chalk}"/>`
    + dot(-7, -14, 0.6, chalk) + dot(7, -14, 0.6, chalk) + dot(-9.5, -12, 0.5, chalk)
    + rr(5, -8.3, 5, 1.4, 0.6, '#F7F4EC') + ln([-14, -9.6], [-6, -9.4], 'rgba(244,241,232,.25)', 0.6);
}
// Fer forgé, partie fixe : poteau, potence à volute, pied scellé
function ferPost() {
  return shadow(-20, 6, 2.6) + shadow(0, 13, 2.8)
    + ell(-20, 0.2, 4.2, 1.6, '#55565C', stroke(OUT, 0.5))
    + rr(-21.3, -47, 2.6, 47.5, 0.8, IRON) + ln([-19.6, -46], [-19.6, 0], 'rgba(255,255,255,.18)', 0.6)
    + dot(-20, -48.6, 2.1, IRON) + dot(-20.6, -49.2, 0.7, 'rgba(255,255,255,.35)')
    + rr(-20, -44.4, 40, 2.2, 1, IRON) + dot(20.4, -43.3, 1.5, IRON)
    + `<path d="M-19.6,-33 C-12,-33.5 -8,-37 -6.5,-42.4" fill="none" stroke="${IRON}" stroke-width="1.4" stroke-linecap="round"/>`
    + `<circle cx="-12.4" cy="-37.6" r="2.3" fill="none" stroke="${IRON}" stroke-width="1.1"/>`
    + dot(-11.2, -38.2, 0.7, IRON);
}
// Fer forgé, partie qui se balance : chaînes et panneau, tournés de angle autour du crochet (0, -43)
const FER_PIVOT = [0, -43];
const ferAngle = (f, n) => 0.06 * Math.sin((f / n) * TAU);
function ferBoard(f, n) {
  const deg = (ferAngle(f, n) * 180) / Math.PI;
  const chain = x => `<line x1="${x}" y1="-42.8" x2="${x}" y2="-35.2" stroke="${IRON}" stroke-width="1.2" stroke-dasharray="1.5 0.9"/>`;
  return `<g transform="rotate(${f2(deg)} ${FER_PIVOT[0]} ${FER_PIVOT[1]})">`
    + chain(-12) + chain(12)
    + rr(-16.2, -34, 34, 16, 2.5, '#3E2716')
    + rr(-17, -35, 34, 16, 2.5, '#5B3B24', stroke('#D9A441', 1.3))
    + rr(-15.2, -33.2, 30.4, 12.4, 1.6, 'none', stroke('rgba(255,222,150,.28)', 0.6))
    + dot(-12, -34.6, 1.1, '#D9A441') + dot(12, -34.6, 1.1, '#D9A441')
    + '</g>';
}
// Laiton : muret de pierre, plaque dorée rivetée
function laiton() {
  const stone = '#BDB5A8';
  return '<defs><linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#FBE29A"/><stop offset=".45" stop-color="#E2B04B"/><stop offset="1" stop-color="#B57F24"/></linearGradient></defs>'
    + shadow(0, 25, 4.5)
    + rr(-23, -5, 46, 5.6, 1.4, '#A39B8E', stroke(OUT, 0.6))
    + rr(-21, -31, 42, 27, 2, stone, stroke(OUT, 0.7))
    + ln([-21, -17.5], [-18.2, -17.5], 'rgba(90,80,70,.35)', 0.6) + ln([18.2, -12], [21, -12], 'rgba(90,80,70,.35)', 0.6)
    + ln([-8, -4.6], [-8, -10.6], 'rgba(90,80,70,.3)', 0.6) + ln([9, -4.6], [9, -10.6], 'rgba(90,80,70,.3)', 0.6)
    + rr(-24, -34.4, 48, 4.6, 1.6, '#D3CCC0', stroke(OUT, 0.7)) + ln([-22, -33.2], [22, -33.2], 'rgba(255,255,255,.5)', 0.7)
    + rr(-18, -28, 36, 16, 1.6, 'url(#brass)', stroke('#8A6418', 0.9))
    + rr(-16.4, -26.4, 32.8, 12.8, 1, 'none', stroke('rgba(255,248,220,.65)', 0.6))
    + [[-16.2, -26.2], [16.2, -26.2], [-16.2, -13.8], [16.2, -13.8]].map(([x, y]) => dot(x, y, 0.95, '#FFF1C2') + dot(x + 0.2, y + 0.25, 0.45, '#A9781F')).join('')
    + dot(-20, -2.4, 1.6, '#7FA65A') + dot(-17.4, -1.6, 1.1, '#9BC46E') + dot(19.6, -2, 1.3, '#7FA65A');
}
// Laiton : reflet qui traverse la plaque de temps en temps (6 images sur 16)
function laitonGlint(f) {
  if (f > 5) return '';
  const x = -26 + f * 10;
  return '<defs><clipPath id="plaque"><rect x="-18" y="-28" width="36" height="16" rx="1.6"/></clipPath></defs>'
    + `<g clip-path="url(#plaque)"><polygon points="${f2(x)},-28 ${f2(x + 5)},-28 ${f2(x - 1)},-12 ${f2(x - 6)},-12" fill="rgba(255,255,240,.55)"/>`
    + `<polygon points="${f2(x + 7)},-28 ${f2(x + 8.4)},-28 ${f2(x + 2.4)},-12 ${f2(x + 1)},-12" fill="rgba(255,255,240,.4)"/></g>`;
}
// Fleurie : piquets blancs, panneau crème, guirlande de feuilles et de fleurs, bouquets au pied
const PETALS = ['#F7A8C8', '#FFFFFF', '#FFD166', '#C9A7EB'];
function fleurie() {
  let garland = '';
  for (let k = 0; k <= 12; k++) {
    const x = -24 + k * 4;
    const y = -30.4 - 1.8 * Math.sin((Math.PI * (x + 24)) / 48);
    garland += leaf(x, y + 0.6, k % 2 ? 0.5 : -0.5, k % 2 ? '#6FAE4E' : '#8FCB6A');
  }
  for (let k = 0; k <= 6; k++) {
    const x = -22 + k * 7.3;
    garland += flower(x, -31.4 - 1.8 * Math.sin((Math.PI * (x + 24)) / 48), 1.9, PETALS[k % PETALS.length]);
  }
  const bunch = (x, y) => leaf(x - 2, y - 1, -0.8, '#6FAE4E') + leaf(x + 2.2, y - 1.2, 0.8, '#8FCB6A') + flower(x - 1.6, y - 3.6, 1.6, '#F7A8C8') + flower(x + 1.8, y - 2.8, 1.4, '#FFFFFF');
  return shadow(0, 20)
    + stake(-17, 1, -28, 3, false, { mid: '#F3EBDD', dark: '#D6CBB8' }) + stake(17, 1, -28, 3, false, { mid: '#F3EBDD', dark: '#D6CBB8' })
    + rr(-20.2, -28, 42, 17, 3, '#D9C9A8')
    + rr(-21, -29.2, 42, 17, 3, '#FFF4DC', stroke('#7FA866', 1.2))
    + rr(-19, -27.2, 38, 13, 2, 'none', ` stroke="rgba(127,168,102,.55)" stroke-width="0.6" stroke-dasharray="1.6 1.2"`)
    + garland + bunch(-17, 1.4) + bunch(16.6, 1.6);
}
// Fleurie : deux papillons qui tournent autour du panneau
function fleurieButterflies(f, n) {
  const a = (f / n) * TAU;
  return butterfly(-24 + 3 * Math.cos(a), -38 + 2.2 * Math.sin(2 * a), f % 2 === 0, '#F59AC0')
    + butterfly(22 + 2.6 * Math.cos(a + 2.2), -35.5 + 2 * Math.sin(2 * a + 1), f % 2 === 1, '#9CC8F2');
}
// Lanterne, partie fixe : portique, fronton, panneau bleu nuit à liseré d'or, étoiles
function lanterne() {
  return shadow(0, 24)
    + stake(-19, 1, -42, 3.2, false, { mid: WOOD.dark, dark: WOOD.deep }) + stake(19, 1, -42, 3.2, false, { mid: WOOD.dark, dark: WOOD.deep })
    + poly([[-27, -43.6], [0, -50.4], [27, -43.6]], '#8A5536', stroke(OUT, 0.7))
    + rr(-27, -44.6, 54, 3.6, 1.2, WOOD.mid, stroke(OUT, 0.6)) + ln([-25, -43.6], [25, -43.6], 'rgba(255,255,255,.25)', 0.6)
    + rr(-16.2, -35.2, 34, 17, 2, '#1E2B4A')
    + rr(-17, -36.4, 34, 17, 2, '#2F3F68', stroke('#E2B546', 1.3))
    + dot(-14, -33.4, 0.55, '#F4E3A8') + dot(13.6, -33, 0.45, '#F4E3A8') + dot(-13.4, -22.6, 0.4, '#F4E3A8') + dot(14, -22.2, 0.55, '#F4E3A8')
    + ln([-24, -41], [-24, -38.6], IRON, 0.8) + ln([24, -41], [24, -38.6], IRON, 0.8);
}
// Lanterne : les deux lanternes, flamme qui vacille
function lanterneFlames(f, n) {
  const k = 0.5 + 0.5 * Math.sin((f / n) * TAU);
  const one = (x, phase) => {
    const kk = phase ? 1 - k : k;
    return poly([[x - 3.6, -38.6], [x + 3.6, -38.6], [x + 2.4, -40.6], [x - 2.4, -40.6]], IRON)
      + rr(x - 3.2, -38.6, 6.4, 8.4, 1, `rgba(255,${f2(205 + 25 * kk)},${f2(120 + 30 * kk)},.92)`, stroke(IRON, 0.8))
      + ell(x, -33.8, 1.3 + 0.3 * kk, 2.4 + 0.7 * kk, '#FFF4C8')
      + ln([x, -38.6], [x, -30.2], 'rgba(59,60,66,.6)', 0.6)
      + poly([[x - 3, -30.2], [x + 3, -30.2], [x + 1.4, -28.8], [x - 1.4, -28.8]], IRON);
  };
  return one(-24, false) + one(24, true);
}

// text : cadre du nom (centre x, y ; largeur et hauteur max), taille et graisse de police, couleur, reflet (gravure)
// light : lumières de nuit [dx, dy, rayon, feu] en pixels depuis le pied ; swing : balancement (pivot et angle)
export const NAME_SIGNS = {
  bois: {
    layers: [{ frame: FRAME, draw: bois }],
    text: { x: 0, y: -22.5, w: 34, h: 12, size: 9.5, weight: 800, family: FRAUNCES, color: '#4A2C16' }
  },
  ardoise: {
    layers: [{ frame: FRAME, draw: ardoise }],
    text: { x: 0, y: -27.6, w: 26, h: 10, size: 8.6, weight: 800, family: NUNITO, color: '#F4F1E8' }
  },
  fer: {
    layers: [{ frame: FRAME, draw: ferPost }, { frame: FRAME, n: 8, fps: 5, draw: (f, n) => ferBoard(f, n) }],
    text: { x: 0, y: -27, w: 28, h: 11, size: 9, weight: 700, family: FRAUNCES, color: '#F3DC9C' },
    swing: { pivot: FER_PIVOT, layer: 1, angle: ferAngle }
  },
  laiton: {
    layers: [{ frame: FRAME, draw: laiton }, { frame: FRAME, n: 16, fps: 10, draw: f => laitonGlint(f) }],
    text: { x: 0, y: -19.8, w: 31, h: 10, size: 9, weight: 800, family: FRAUNCES, color: '#5A3A10', light: 'rgba(255,246,206,.9)' }
  },
  fleurie: {
    layers: [{ frame: FRAME, draw: fleurie }, { frame: FRAME, n: 6, fps: 6, draw: (f, n) => fleurieButterflies(f, n) }],
    text: { x: 0, y: -20.6, w: 34, h: 10, size: 9, weight: 700, family: FRAUNCES, color: '#3F6B35' }
  },
  lanterne: {
    layers: [{ frame: FRAME, draw: lanterne }, { frame: FRAME, n: 6, fps: 8, draw: (f, n) => lanterneFlames(f, n) }],
    text: { x: 0, y: -27.9, w: 28, h: 11, size: 9, weight: 700, family: FRAUNCES, color: '#F4D27A' },
    light: [[-24, -34, 18, true], [24, -34, 18, true]]
  }
};
export const NAME_SIGN_STYLES = Object.keys(NAME_SIGNS);
const styleOf = style => NAME_SIGNS[style] || NAME_SIGNS.bois;

// Image de chaque calque à l'instant t : [{ key, make }] (même image pour tous les noms : le nom s'écrit par-dessus)
export function nameSignLayers(style, t = 0) {
  const look = styleOf(style);
  return look.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    return { key: `name-sign-${style}-${k}-${f}`, make: () => sprite(layer.draw(f, layer.n || 1), { x, y, w, h }) };
  });
}

// Angle du panneau à l'instant t (fer forgé : même image que le calque qui se balance), et son pivot ; null sinon
export function nameSignSwing(style, t = 0) {
  const { swing, layers } = styleOf(style);
  if (!swing) return null;
  const layer = layers[swing.layer];
  return { pivot: swing.pivot, angle: swing.angle(Math.floor(t * layer.fps) % layer.n, layer.n) };
}

// Lumières de nuit [dx, dy, rayon, feu], ou []
export const nameSignLight = style => styleOf(style).light || [];

// Taille de police pour que le nom tienne dans le cadre (mesure : largeur du texte à la taille donnée) ; au-delà du
// plus petit corps lisible, le texte se resserre (scale < 1)
export function fitName(look, measure) {
  const { size, w } = look.text;
  const full = measure(size);
  if (full <= w) return { size, scale: 1 };
  const fitted = Math.max(6, (size * w) / full);
  const width = measure(fitted);
  return { size: fitted, scale: width > w ? w / width : 1 };
}

// Écrit le nom sur l'enseigne, au canvas (origine : le pied de l'enseigne, à l'échelle du monde) ; t : pour le
// balancement du fer forgé
export function paintName(ctx, style, raw, t = 0) {
  const look = styleOf(style);
  const { x, y, weight, family, color, light } = look.text;
  // Espaces élargis (demi-cadratin) : les mots restent séparés même quand le nom se resserre
  const name = raw.replace(/ /g, '\u2002');
  const font = size => `${weight} ${f2(size)}px ${family}`;
  const fit = fitName(look, size => {
    ctx.font = font(size);
    return ctx.measureText(name).width;
  });
  ctx.save();
  const swing = nameSignSwing(style, t);
  if (swing) {
    ctx.translate(swing.pivot[0], swing.pivot[1]);
    ctx.rotate(swing.angle);
    ctx.translate(-swing.pivot[0], -swing.pivot[1]);
  }
  ctx.translate(x, y);
  if (fit.scale < 1) ctx.scale(fit.scale, 1);
  ctx.font = font(fit.size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (light) {
    ctx.fillStyle = light;
    ctx.fillText(name, 0, 0.7);
  }
  ctx.fillStyle = color;
  ctx.fillText(name, 0, 0);
  ctx.restore();
}

// Cadre commun des calques (vignette d'une fiche)
export const NAME_SIGN_FRAME = FRAME;

// Nom d'enseigne saisi, nettoyé comme le fait le serveur (règles communes des noms, 14 caractères au plus), ou null
export const cleanSignName = raw => cleanName(raw, 14);
