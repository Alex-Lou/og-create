// La bibliothèque de dessins (design/bibliotheque) dans le build et dans les tests : ses fichiers restent des fichiers,
// jamais intégrés en base64 au code (ils l'alourdissaient de plusieurs centaines de Ko au démarrage), lus à la demande
// (src/world/library.js : textsOf) et gardés par le service worker (public/sw.js : img/). Sous vitest, la même règle
// donne leurs adresses du serveur de développement, que les tests lisent sur le disque (tests/setup/library.js)
import { dirname, relative, resolve, sep } from 'node:path';

export const libraryInline = file => (file.includes('/design/bibliotheque/') ? false : undefined);

// En développement et sous vitest, chaque dessin d'un import.meta.glob ?url immédiat restait un module à charger, rien
// que pour donner son adresse (des milliers à l'ouverture de l'île : la suite des tests passait de 23 à 40 s) ; cette
// adresse est son chemin depuis la racine du projet (jamais intégré, ci-dessus) : elle s'écrit à sa place. Le build les
// écrit déjà ainsi
const GLOB_URL = /import \{ default as (__vite_glob_\w+) \} from "([^"?]*\/design\/bibliotheque\/[^"?]+)\?url";/g;
export function libraryUrls() {
  let root = '';
  return {
    name: 'bibliotheque-adresses',
    apply: 'serve',
    enforce: 'post',
    configResolved(config) {
      root = config.root;
    },
    // (le code du jeu seulement : c'est lui qui lit la bibliothèque)
    transform(code, id) {
      if (!id.startsWith(`${root}/src/`) || !code.includes('__vite_glob_') || !code.includes('/design/bibliotheque/')) return null;
      const from = dirname(id.split('?')[0]);
      const pathOf = spec => `/${relative(root, spec.startsWith('/') ? root + spec : resolve(from, spec)).split(sep).join('/')}`;
      return { code: code.replace(GLOB_URL, (_, name, spec) => `const ${name} = ${JSON.stringify(pathOf(spec))};`), map: null };
    }
  };
}
