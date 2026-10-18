// L'écran de démarrage (splash.js) : écrit le fond, l'affiche (le Grimoire, les maîtres) et Brume dans
// public/img/splash/, immobiles : ce qui bouge, index.html l'anime en CSS (public/splash.css) ; et son orage (l'autre
// visage de l'île et des maîtres : splash_survie.js ; les nuages, les éclairs, l'aura : splash_orage.js ; sa chronologie,
// les keyframes de public/splash.css : splash_orage_temps.js)
const fs = require('fs');
const path = require('path');
const { chronologieOrage } = require('./splash_orage_temps');
const N = require('./neon_splash');

const OUT = path.join(__dirname, '..', '..', 'public', 'img', 'splash');
fs.mkdirSync(OUT, { recursive: true });
// (et l'orage : l'île et les maîtres sous leur autre visage, Brume en démon de feu et son aura, le banc de nuages ; les
// éclairs vont dans index.html)
// (en papier néon, choix de l'auteur, 18 oct. : neon_splash.js, les mêmes dessins dans la palette des cinématiques)
const IMAGES = [['fond', N.fondNeon()], ['affiche', N.afficheNeon()], ['brume', N.brumeNeon()], ['tempete', N.tempeteNeon()], ['guerriers', N.guerriersNeon()], ['demon', N.demonNeon()], ['aura', N.auraNeon()], ['souffle', N.souffleNeon()], ['nuages', N.nuagesNeon()]];
for (const [nom, svg] of IMAGES) fs.writeFileSync(path.join(OUT, `${nom}.svg`), svg);
// Leur adresse dans index.html porte l'empreinte de leur contenu (?v=…) : le service worker garde les images de /img/ et
// le navigateur la feuille de style ; une nouvelle empreinte est une nouvelle adresse, l'ancienne image ne revient pas
const ROOT = path.join(__dirname, '..', '..');
const empreinte = file => require('crypto').createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
const INDEX = path.join(ROOT, 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');
for (const [nom] of IMAGES) html = html.replace(new RegExp(`/img/splash/${nom}\\.svg(\\?v=[0-9a-f]+)?"`, 'g'), `/img/splash/${nom}.svg?v=${empreinte(path.join(OUT, `${nom}.svg`))}"`);
html = html.replace(/(<!-- les éclairs[^>]*-->)[\s\S]*?(<!-- \/les éclairs -->)/, (m, a, b) => `${a}${N.eclairsNeon()}${b}`);
// la chronologie de l'orage, dans la feuille de style (avant son empreinte)
const CSS = path.join(ROOT, 'public', 'splash.css');
fs.writeFileSync(CSS, chronologieOrage(fs.readFileSync(CSS, 'utf8')));
html = html.replace(/\/splash\.css(\?v=[0-9a-f]+)?"/g, `/splash.css?v=${empreinte(path.join(ROOT, 'public', 'splash.css'))}"`);
fs.writeFileSync(INDEX, html);
console.log(`splash : ${IMAGES.map(([nom]) => nom).join(', ')} dans ${path.relative(process.cwd(), OUT)}, éclairs et empreintes dans index.html`);
