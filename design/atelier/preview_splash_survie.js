// L'écran de démarrage « survie » (splash_survie.js), une proposition à part : écrit son fond et son affiche dans
// design/atelier/survie/, et une page d'aperçu de l'écran entier (le balisage et la feuille de style de l'écran du jeu :
// index.html, public/splash.css ; Brume, la même). Rien dans public/ ni dans index.html : le jeu garde son écran.
const fs = require('fs');
const path = require('path');
const { fondSurvie, afficheSurvie } = require('./splash_survie');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'survie');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'fond.svg'), fondSurvie());
fs.writeFileSync(path.join(OUT, 'affiche.svg'), afficheSurvie());

// la page : l'écran du jeu, ses images remplacées ; le chargement presque fini (les étapes cochées)
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const ecran = index.match(/<div id="splash"[\s\S]*?\n {4}<\/div>\n/)[0]
  .replace(/src="\/img\/splash\/fond\.svg[^"]*"/, 'src="fond.svg"').replace(/src="\/img\/splash\/affiche\.svg[^"]*"/, 'src="affiche.svg"')
  .replace(/src="\/img\/splash\/brume\.svg[^"]*"/, 'src="../../../public/img/splash/brume.svg"')
  .replace(/alt="L’île de Brumelune[^"]*"/, 'alt="L’île assiégée par les égarés et un kraken, Anya devant la lune"')
  .replace(/alt="Le Grimoire ouvert[^"]*"/, 'alt="Le Grimoire ouvert, les sept maîtres armés, prêts à défendre l’île"')
  .replace('L’île se souvient de tout ce que tu fais naître.', 'La nuit tombe. L’île tient bon.')
  .replace(/<li data-step="(code|fonts)">/g, '<li data-step="$1" class="is-done">');
const page = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brumelune — l'écran « survie » (proposition)</title>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..600&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../../public/splash.css" />
    <style>.splash__bar span { width: 78%; }</style>
  </head>
  <body>
${ecran}  </body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'apercu.html'), page);
console.log(`splash survie : fond, affiche et apercu.html dans ${path.relative(process.cwd(), OUT)}`);
