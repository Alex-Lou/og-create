// La lumière de la nuit sur le personnage de l'éditeur (la plage : PlageScene), posée dans son image même : le bleu de
// la nuit (multiply : l'encre des contours reste sombre), la lune froide de la gauche (soft-light), la lanterne chaude
// d'en bas à droite (overlay : elle chauffe les couleurs sans blanchir l'encre), qui vacille avec sa flamme (le même
// rythme que sa lueur : PlageScene.css, pls-flamme). Les trois lumières ne touchent que le personnage : elles sont
// dans un groupe découpé à sa silhouette (un masque alpha), avec lui dedans (le mélange se fait sur lui).
// (Des calques CSS en mix-blend-mode par-dessus l'<img> se mélangeaient mal : Chrome les compose à part.)
// (le bleu de la nuit est uni : un dégradé haut-bas recopiait les valeurs du décor derrière lui, mer sombre, sable clair,
// et le personnage semblait transparent ; la lune et la lanterne ne prennent que son bord)
const DEFS = '<linearGradient id="lnN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4BCE4"/><stop offset="1" stop-color="#B4BCE4"/></linearGradient>'
  + '<linearGradient id="lnL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D2DEFF" stop-opacity=".8"/><stop offset=".22" stop-color="#D2DEFF" stop-opacity="0"/></linearGradient>'
  + '<radialGradient id="lnC" cx=".92" cy=".94" r=".55"><stop offset="0" stop-color="#FFB060"/><stop offset=".55" stop-color="#FFA050" stop-opacity=".35"/><stop offset="1" stop-color="#FFA050" stop-opacity="0"/></radialGradient>';
const FLAMME = '<animate attributeName="opacity" values="1;.8;.95;.76;1;.86;.94" keyTimes="0;.14;.22;.47;.53;.71;.86" calcMode="discrete" dur="2.3s" repeatCount="indefinite"/>';
const PREFIX = 'data:image/svg+xml;charset=utf-8,';

// Les images éclairées, gardées par image (le tour, le clignement, les choix reviennent souvent) ; au plus LIMIT
const LIMIT = 48;
const cache = new Map();

// L'image (une URL data: d'un SVG du kit, game/avatarKit.js) éclairée par la nuit ; telle quelle si elle ne se lit pas
export function eclairer(url) {
  if (!url || !url.startsWith(PREFIX)) return url;
  if (cache.has(url)) return cache.get(url);
  const svg = decodeURIComponent(url.slice(PREFIX.length));
  const m = svg.match(/^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/);
  if (!m) return url;
  const box = (m[1].match(/viewBox="([^"]+)"/) || [])[1] || '0 0 48 64';
  const [x, y, w, h] = box.split(/\s+/).map(Number);
  const rect = (fill, blend, extra = '', inner = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${fill})" style="mix-blend-mode:${blend}"${extra}>${inner}</rect>`;
  const out = `<svg${m[1]}><defs><g id="lnF">${m[2]}</g>${DEFS}`
    + `<mask id="lnM" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}" style="mask-type:alpha"><use href="#lnF"/></mask></defs>`
    + `<g mask="url(#lnM)"><use href="#lnF"/>${rect('lnN', 'multiply', ' opacity=".62"')}${rect('lnL', 'soft-light')}${rect('lnC', 'overlay', '', FLAMME)}</g></svg>`;
  const lit = PREFIX + encodeURIComponent(out);
  if (cache.size >= LIMIT) cache.delete(cache.keys().next().value);
  cache.set(url, lit);
  return lit;
}
