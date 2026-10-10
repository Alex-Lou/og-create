// Le catalogue de l'éditeur d'avatar (avatar.json : noms, nuanciers, accessoires, ce qui est gratuit), à part de
// game/avatarKit.js : il n'est lu que par l'éditeur (PrologueAvatar, AvatarMaker), chargé à la demande, et ne pèse
// donc rien au démarrage.
import CATALOG from '../../design/bibliotheque/svg/personnages/avatar/avatar.json';
import { isCustom } from './avatarKit';

export { CATALOG };

// Les choix complets d'un exemple de la bibliothèque, sans ce qui se gagne (le point de départ de l'éditeur pour un
// joueur qui avait choisi un exemple : on ne compose qu'avec ce qui est libre)
export function freeChoicesOf(look) {
  const base = isCustom(look) ? look : (CATALOG.exemples[look] || {}).choix || CATALOG.defaut;
  const free = Object.fromEntries(Object.entries(base.accessoires || {})
    .filter(([, a]) => a && (CATALOG.accessoires[a.id] || {}).source === 'gratuit' && !CATALOG.accessoires[a.id].saison));
  const dyes = CATALOG.teintures;
  const out = { ...CATALOG.defaut, ...base, accessoires: free };
  for (const key of ['cheveux', 'couleurMeches', 'couleurHaut', 'couleurBas', 'chaussures']) {
    if (dyes[out[key]]) out[key] = CATALOG.defaut[key];
  }
  for (const a of Object.values(free)) a.couleurs = (a.couleurs || []).map((key, i) => (dyes[key] ? CATALOG.accessoires[a.id].defaut[i] : key));
  return out;
}
