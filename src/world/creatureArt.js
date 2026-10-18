// Le portrait d'une créature du Bestiaire (le livre, sa fiche ; world/creatures.js) : une bête de la bibliothèque
// (beastArt.js), un égaré (nightArt.js), le Géant ou le Kraken (faune : leur silhouette sous la mer), le cerf blanc
// (anyaArt.js), Brume en Phénix (brumeArt.js) ; une adresse d'image, BLANK tant qu'elle arrive, null s'il n'a pas de
// dessin
import { beastPortraitUrl } from './beastArt';
import { strayPortraitUrl } from './nightArt';
import { portraitGeant, portraitKraken } from './faune';
import { cerfPortraitUrl } from './anyaArt';
import { phenixPortraitUrl } from './brumeArt';

const LEGENDS = { geant: portraitGeant, kraken: portraitKraken, 'cerf-blanc': cerfPortraitUrl, phenix: phenixPortraitUrl };

export function creaturePortraitUrl(creature) {
  if (creature.species === 'stray') return strayPortraitUrl(creature.variant);
  if (creature.species === 'legend') return LEGENDS[creature.id] ? LEGENDS[creature.id]() : null;
  return beastPortraitUrl(creature.species, creature.variant);
}
