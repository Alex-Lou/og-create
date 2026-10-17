// L'écran de démarrage (splash.js) : écrit le fond, l'affiche (le Grimoire, les maîtres) et Brume dans
// public/img/splash/, immobiles : ce qui bouge, index.html l'anime en CSS (public/splash.css) ; et son orage (l'autre
// visage de l'île et des maîtres : splash_survie.js ; les nuages et les éclairs : splash_orage.js)
const fs = require('fs');
const path = require('path');
const { fond, affiche, brume, demon, fixe } = require('./splash');
const { fondSurvie, afficheSurvie } = require('./splash_survie');
const { nuages, eclairs } = require('./splash_orage');

const OUT = path.join(__dirname, '..', '..', 'public', 'img', 'splash');
fs.mkdirSync(OUT, { recursive: true });
// (et l'orage : l'île et les maîtres sous leur autre visage, Brume en démon de feu, le banc de nuages ; les éclairs vont
// dans index.html)
const IMAGES = [['fond', fixe(fond())], ['affiche', affiche()], ['brume', brume()], ['tempete', fondSurvie()], ['guerriers', afficheSurvie()], ['demon', demon()], ['nuages', nuages()]];
for (const [nom, svg] of IMAGES) fs.writeFileSync(path.join(OUT, `${nom}.svg`), svg);
// Leur adresse dans index.html porte l'empreinte de leur contenu (?v=…) : le service worker garde les images de /img/ et
// le navigateur la feuille de style ; une nouvelle empreinte est une nouvelle adresse, l'ancienne image ne revient pas
const ROOT = path.join(__dirname, '..', '..');
const empreinte = file => require('crypto').createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
const INDEX = path.join(ROOT, 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');
for (const [nom] of IMAGES) html = html.replace(new RegExp(`/img/splash/${nom}\\.svg(\\?v=[0-9a-f]+)?"`, 'g'), `/img/splash/${nom}.svg?v=${empreinte(path.join(OUT, `${nom}.svg`))}"`);
html = html.replace(/(<!-- les éclairs[^>]*-->)[\s\S]*?(<!-- \/les éclairs -->)/, (m, a, b) => `${a}${eclairs()}${b}`);
html = html.replace(/\/splash\.css(\?v=[0-9a-f]+)?"/g, `/splash.css?v=${empreinte(path.join(ROOT, 'public', 'splash.css'))}"`);
fs.writeFileSync(INDEX, html);
console.log(`splash : ${IMAGES.map(([nom]) => nom).join(', ')} dans ${path.relative(process.cwd(), OUT)}, éclairs et empreintes dans index.html`);
