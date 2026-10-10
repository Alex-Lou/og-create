// L'écran de démarrage (splash.js) : écrit le fond, l'affiche (le Grimoire, les maîtres) et Brume dans
// public/img/splash/, immobiles : ce qui bouge, index.html l'anime en CSS (public/splash.css)
const fs = require('fs');
const path = require('path');
const { fond, affiche, brume, fixe } = require('./splash');

const OUT = path.join(__dirname, '..', '..', 'public', 'img', 'splash');
fs.mkdirSync(OUT, { recursive: true });
for (const [nom, svg] of [['fond', fixe(fond())], ['affiche', affiche()], ['brume', brume()]]) fs.writeFileSync(path.join(OUT, `${nom}.svg`), svg);
// Leur adresse dans index.html porte l'empreinte de leur contenu (?v=…) : le service worker garde les images de /img/ et
// le navigateur la feuille de style ; une nouvelle empreinte est une nouvelle adresse, l'ancienne image ne revient pas
const ROOT = path.join(__dirname, '..', '..');
const empreinte = file => require('crypto').createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
const INDEX = path.join(ROOT, 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');
for (const nom of ['fond', 'affiche', 'brume']) html = html.replace(new RegExp(`/img/splash/${nom}\\.svg(\\?v=[0-9a-f]+)?"`, 'g'), `/img/splash/${nom}.svg?v=${empreinte(path.join(OUT, `${nom}.svg`))}"`);
html = html.replace(/\/splash\.css(\?v=[0-9a-f]+)?"/g, `/splash.css?v=${empreinte(path.join(ROOT, 'public', 'splash.css'))}"`);
fs.writeFileSync(INDEX, html);
console.log(`splash : fond et affiche dans ${path.relative(process.cwd(), OUT)}, empreintes dans index.html`);
