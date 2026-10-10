// L'écran de démarrage (splash.js) : écrit le fond et l'affiche (Brume, le Grimoire, les maîtres) dans
// public/img/splash/, chacun aussi en version immobile (-fixe, pour qui demande moins de mouvement)
const fs = require('fs');
const path = require('path');
const { fond, affiche, fixe } = require('./splash');

const OUT = path.join(__dirname, '..', '..', 'public', 'img', 'splash');
fs.mkdirSync(OUT, { recursive: true });
for (const [nom, svg] of [['fond', fond()], ['affiche', affiche()]]) {
  fs.writeFileSync(path.join(OUT, `${nom}.svg`), svg);
  fs.writeFileSync(path.join(OUT, `${nom}-fixe.svg`), fixe(svg));
}
console.log(`splash : fond et affiche dans ${path.relative(process.cwd(), OUT)}`);
