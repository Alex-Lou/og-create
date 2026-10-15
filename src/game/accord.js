// Le joueur dans les répliques (choix de l'auteur, 14 oct. : ecriture/ton.md, décisions 1 et 20). Une réplique qui
// l'accorde écrit les deux formes, masculin puis féminin, chacune d'un mot (« arrivé|arrivée », « un|une ») : le jeu
// garde celle du genre de son avatar (femme ou homme ; pas encore connu, la première). Son nom s'affiche quand il parle
// dans une scène. App les tient à jour (story.js : setPlayer).
import { reactive } from 'vue';
import { isCustom } from './avatarKit';

// { genre ('femme', 'homme' ou null), name (ou null), look (l'avatar : ses choix, ou l'un des exemples) }
export const player = reactive({ genre: null, name: null, look: null });

export function setPlayer({ look, name }) {
  player.name = name || null;
  if (player.look === look) return;
  player.look = look || null;
  player.genre = isCustom(look) ? look.genre || null : null;
}

// Le genre d'un exemple de la bibliothèque est dans le catalogue de l'éditeur (game/avatarCatalog.js, chargé à la
// demande : il ne part pas au démarrage) : lu la première fois qu'une réplique à deux formes s'affiche. Rend la promesse
let reading = null;
export function readGenre() {
  const look = player.look;
  if (!look || isCustom(look) || player.genre) return Promise.resolve(player.genre);
  if (!reading) reading = import('./avatarCatalog').then(({ CATALOG }) => CATALOG.exemples);
  return reading.then(examples => {
    if (player.look === look) player.genre = (examples[look] && examples[look].choix.genre) || null;
    return player.genre;
  });
}

// Une réplique accordée au joueur : chaque « masculin|féminin » devient la forme de son genre
const PAIR = /([\p{L}’'-]+)\|([\p{L}’'-]+)/gu;
export function accord(text, genre = player.genre) {
  if (typeof text !== 'string' || !text.includes('|')) return text;
  if (genre === player.genre && !genre) readGenre();
  return text.replace(PAIR, (pair, male, female) => (genre === 'femme' ? female : male));
}
