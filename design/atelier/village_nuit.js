// Le nouveau village, la nuit (choix de l'auteur, 15 oct. : la veillée et les habits recousus ne se passent plus sur la
// plage, mais au village qu'on vient de fonder). Les dessins du jeu, tels quels, au trait de la troupe : le Foyer au
// palier I (le feu de camp), le Puits agrandi (palier II, étape 12c), les coins des naufragés tels qu'ils sont à la fin
// du tutoriel (l'abri de Cannelle, les débris d'Aster, de Rivet et d'Ondin), la torche de la boutique (étape 12e). Le
// sol : l'herbe du début de jeu, sous la nuit ; le ciel en haut, Brume au-dessus du feu. Les personnages sont posés et
// éclairés par la scène (scenes6.js, eclairage.js) ; ici, le décor, sa nuit et la lumière du feu.
const { CAMP } = require('./camp.mjs');
const { lookAt } = require('./port/src/world/looks.js');
const { lumiereFeu } = require('./eclairage');

const W = 400;
const r2 = n => Math.round(n * 100) / 100;
const K = 1.25; // (l'échelle de la bibliothèque)
const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
// Un dessin du jeu posé dans la scène : son ancre (le centre de son emprise au sol) en (x, y), à l'échelle s ; ses
// identifiants prennent un suffixe (deux dessins du camp numérotent leurs découpes de la même façon)
let pose = 0;
const propre = body => { const t = `_d${pose++}`; return body.replace(/ id="([^"]+)"/g, ` id="$1${t}"`).replace(/url\(#([^)]+)\)/g, `url(#$1${t})`).replace(/href="#([^"]+)"/g, `href="#$1${t}"`); };
const poserDessin = (body, x, y, s) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s * K)})">${propre(body)}</g>`;
const batiment = (site, lv, n = 0) => {
  const look = lookAt(site, lv);
  return inner(look.make(undefined).svg) + look.anims.map(a => inner(a.frame(n % a.n).svg || a.frame(n % a.n))).join('');
};
const coin = (key, n = 0) => CAMP[key].draw(n % CAMP[key].n);

// La nuit posée sur le décor : un voile bleu profond, plus léger près du feu (sa lumière le perce)
function nuitSur(id, feu) {
  return `<defs><radialGradient id="${id}N" gradientUnits="userSpaceOnUse" cx="${feu[0]}" cy="${feu[1]}" r="260">`
    + '<stop offset="0" stop-color="#14204A" stop-opacity="0.12"/><stop offset="0.35" stop-color="#14204A" stop-opacity="0.38"/>'
    + '<stop offset="1" stop-color="#0C1434" stop-opacity="0.62"/></radialGradient></defs>'
    + `<rect width="${W}" height="${W}" fill="url(#${id}N)"/>`;
}

// Le décor du village la nuit, image n ; feu : [x, y] (le centre du Foyer) ; o.coins : quels coins montrer
function villageNuit(id, n, feu = [200, 318], o = {}) {
  pose = 0;
  let s = '';
  // le ciel, au-dessus des arbres du bord : un bleu de nuit, des étoiles, la lueur de Brume
  s += `<defs><linearGradient id="${id}C" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1230"/><stop offset="1" stop-color="#26355E"/></linearGradient>`
    + `<linearGradient id="${id}H" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E8A4C"/><stop offset="1" stop-color="#3F6E3A"/></linearGradient></defs>`;
  s += `<rect width="${W}" height="140" fill="url(#${id}C)"/>`;
  for (let i = 0; i < 26; i++) {
    const x = (i * 97.3) % 400, y = 8 + ((i * 53.7) % 100), r = 0.6 + ((i * 7) % 5) * 0.22;
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="#F6EFDC" opacity="${r2(0.45 + ((i + n) % 3) * 0.2)}"/>`;
  }
  // la lisière : des arbres sombres au fond, puis l'herbe du début de jeu
  s += `<path d="M0,140 Q30,96 62,124 Q90,92 124,122 Q160,100 196,126 Q232,98 266,124 Q300,94 334,122 Q366,100 400,128 L400,160 L0,160 Z" fill="#1E3A2E"/>`;
  s += `<rect y="132" width="${W}" height="${W - 132}" fill="url(#${id}H)"/>`;
  s += `<path d="M0,134 Q100,128 200,136 T400,132" fill="none" stroke="#2A4A34" stroke-width="3" opacity="0.6"/>`;
  // des touffes d'herbe et quelques fleurs rares
  for (let i = 0; i < 40; i++) {
    const x = (i * 61.7) % 400, y = 150 + ((i * 37.3) % 245);
    s += `<path d="M${r2(x)},${r2(y)} q-2,-6 -1,-9 M${r2(x)},${r2(y)} q1,-7 3,-9 M${r2(x)},${r2(y)} q3,-4 6,-5" fill="none" stroke="#4E7E3E" stroke-width="1.2" stroke-linecap="round"/>`;
  }
  // le chemin de terre qui mène au feu
  s += `<path d="M200,400 Q186,360 196,330 Q206,300 196,260 Q186,220 205,190" fill="none" stroke="#B89A6A" stroke-width="22" stroke-linecap="round" opacity="0.55"/>`;
  // les coins des naufragés, au fond, et le Puits agrandi
  const coins = o.coins || [['rivet_debris', 64, 214, 0.78], ['aster_debris', 338, 210, 0.78], ['ondin_debris', 132, 178, 0.62], ['cannelle_abri', 368, 312, 0.82]];
  for (const [key, x, y, k] of coins) s += poserDessin(coin(key, n), x, y, k);
  s += poserDessin(batiment('puits', 2, n), o.puits ? o.puits[0] : 238, o.puits ? o.puits[1] : 184, 0.72);
  // le Foyer au palier I : le feu de camp, au milieu
  s += poserDessin(batiment('foyer', 1, n), feu[0], feu[1], 0.95);
  return s;
}

// La lumière du feu par-dessus la nuit du décor (sa flaque, ses reflets), puis la nuit elle-même : à poser après le
// décor et avant les personnages
const lumiereVillage = (id, n, feu = [200, 318]) => nuitSur(id, feu) + lumiereFeu(`${id}F`, feu[0], feu[1] - 6, 1.5, n);

module.exports = { villageNuit, lumiereVillage, poserDessin, batiment, coin };
