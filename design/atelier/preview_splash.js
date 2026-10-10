// L'écran de démarrage (splash.js) : écrit le fond, l'affiche (le Grimoire, les maîtres) et Brume dans
// public/img/splash/, immobiles : ce qui bouge, index.html l'anime en CSS (public/splash.css)
const fs = require('fs');
const path = require('path');
const { fond, affiche, brume, fixe } = require('./splash');

const OUT = path.join(__dirname, '..', '..', 'public', 'img', 'splash');
fs.mkdirSync(OUT, { recursive: true });
for (const [nom, svg] of [['fond', fixe(fond())], ['affiche', affiche()], ['brume', brume()]]) fs.writeFileSync(path.join(OUT, `${nom}.svg`), svg);
console.log(`splash : fond et affiche dans ${path.relative(process.cwd(), OUT)}`);
