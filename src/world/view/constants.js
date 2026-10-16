// Constantes de l'île partagées par WorldView.vue et ses modules (src/world/view). Extrait de WorldView.vue (lot
// santé), sans changement ; celles du dessin que lisent plusieurs sujets de draw/ viennent de draw.js.
import { NATURE } from '@/world/sprites';
import { NATURE2 } from '@/world/nature';
import { ISLET_NATURE } from '@/world/isletSprites';

const TW = 64; // largeur d'une case à l'échelle 1 (unités du monde)
const TH = TW / 2;
// Gisements des trouvailles : un peu plus grands que leur case, pour se voir dans le décor
const DEPOSIT_SCALE = 1.25;

// Ce qui vit à la surface de la mer (posé au niveau de l'eau, jamais caché par la terre : eau libre)
const SEA_KINDS = new Set(['fish', 'dolphin', 'whale', 'fluke', 'spout', 'vboat']);
// Enseigne d'un bâtiment : pied sur le bord avant gauche de son emprise, à tant de cases du coin vers le joueur (le nom
// du bâtiment, sous ce coin, reste dégagé), un peu en retrait du bord ; dessinée un peu plus grande que nature
const NAME_SIGN_ALONG = 1.6;
const NAME_SIGN_INSET = 0.25;
const NAME_SIGN_SCALE = 1.2;
// Tous les décors naturels (planches 1 et 2), et ce qui pousse où, avec sa fréquence cumulée
const ALL_NATURE = { ...NATURE, ...NATURE2, ...ISLET_NATURE };

export { TW, TH, DEPOSIT_SCALE, SEA_KINDS, NAME_SIGN_ALONG, NAME_SIGN_INSET, NAME_SIGN_SCALE, ALL_NATURE };
// Sous le doigt (glisser, élan), au plus une image par écran à 60 Hz : un écran à 120 Hz en demandait deux fois plus
// (draw/loop.js : drawSoon ; camera.js : lancerElan)
export const FRAME_DOIGT_MS = 15;
// De près seulement (zoom dès NEAR_SCALE), le décor fixe se dessine à chaque image et plie au vent ; plus loin, il est
// cuit dans les carrés du sol (sauf près de ce qui se tient debout : il doit pouvoir passer devant ; draw/loop.js)
export const NEAR_SCALE = 0.9;
// Pendant que la caméra du conseil glisse vers le phare ou en revient, le sol se peint au plus à cette échelle (pixels
// par unité du monde) : des carrés moins nombreux, préparés d'avance (WorldView, phare.js : prepareLighthouse) ; à
// l'arrêt sur la tour, il reprend toute sa finesse
export const PAN_SCALE = 1;
