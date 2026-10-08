<template>
  <!-- La carte d'embarquement de la bibliothèque (design/bibliotheque/svg/perso : neuve, tamponnée, trempée), 320 × 210 :
       la photo du joueur dans son tirage penché (zone « photo »), à mi-corps comme sur la carte du prologue (00_carte),
       en tenue de croisière ; son nom à la main sur la ligne « Nom » (zone « nom ») -->
  <div class="bcard" role="img" :aria-label="name ? `Ta carte d’embarquement, au nom de ${name}` : 'Ta carte d’embarquement'">
    <svg class="bcard__art" viewBox="0 0 320 210" aria-hidden="true">
      <defs>
        <clipPath :id="clipId"><rect :x="PHOTO.x" :y="PHOTO.y" :width="PHOTO.w" :height="PHOTO.h" /></clipPath>
      </defs>
      <image :href="CARDS[kind]" width="320" height="210" />
      <g v-if="frames.length" :transform="`rotate(${PHOTO.angle} ${PHOTO.x + PHOTO.w / 2} ${PHOTO.y + PHOTO.h / 2})`" :clip-path="`url(#${clipId})`">
        <image :href="frames[0]" :x="body.x" :y="body.y" :width="body.w" :height="body.h" />
      </g>
      <text
        v-if="name" class="bcard__name" :x="NAME.x + 2" :y="NAME.y + NAME.h - 1"
        :textLength="name.length > 14 ? NAME.w - 4 : null" lengthAdjust="spacingAndGlyphs"
      >{{ name }}</text>
    </svg>
  </div>
</template>

<script>
import PIECES from '../../../../design/bibliotheque/svg/perso/perso.json';
import neuve from '../../../../design/bibliotheque/svg/perso/carte_embarquement.svg?url';
import tampon from '../../../../design/bibliotheque/svg/perso/carte_embarquement_tampon.svg?url';
import trempee from '../../../../design/bibliotheque/svg/perso/carte_embarquement_trempee.svg?url';
import { sceneOf, avatarFrames, avatarBox } from '@/game/sceneArt';

const CARDS = { neuve, tampon, trempee };
// Les zones de la carte (perso.json : les trois cartes ont les mêmes) : le tirage (x, y, largeur, hauteur, angle) et
// la ligne du nom
const zones = PIECES.pieces.carte_embarquement.zones;
const PHOTO = { x: zones.photo[0], y: zones.photo[1], w: zones.photo[2], h: zones.photo[3], angle: zones.photo[4] };
const NAME = { x: zones.nom[0], y: zones.nom[1], w: zones.nom[2], h: zones.nom[3] };
// Le cadrage de la photo : celui de la carte du prologue (scène 00_carte : l'avatar et sa photo), mis à l'échelle du
// tirage
const SPOT = sceneOf('00_carte').avatar;
const BODY = (() => {
  const box = avatarBox(SPOT);
  const [cx, cy, cw] = SPOT.cadre;
  const k = PHOTO.w / cw;
  return { x: PHOTO.x + (box.x - cx) * k, y: PHOTO.y + (box.y - cy) * k, w: box.w * k, h: box.h * k };
})();

let uid = 0;

export default {
  name: 'BoardingCard',
  props: {
    // L'avatar du joueur : l'un des exemples, ou ses choix (game/avatarKit.js)
    look: { type: [String, Object], default: '' },
    // Le nom écrit sur la ligne « Nom »
    name: { type: String, default: '' },
    // La carte : 'neuve', 'tampon' (« EMBARQUÉ ») ou 'trempee' (sortie de la poche, au réveil sur la Grève)
    kind: { type: String, default: 'trempee', validator: v => ['neuve', 'tampon', 'trempee'].includes(v) }
  },
  data() {
    return { CARDS, PHOTO, NAME, body: BODY, clipId: `bcard-photo-${++uid}` };
  },
  computed: {
    // La photo : prise à bord, en tenue de croisière, de face (la première image : une photo ne bouge pas)
    frames() {
      return avatarFrames(this.look, { vue: SPOT.vue, pose: SPOT.pose, naufrage: false });
    }
  }
};
</script>

<style scoped>
.bcard { --bcard-ink: #2e4e8c; position: relative; width: 100%; aspect-ratio: 320 / 210; }
.bcard__art { display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 10px 18px rgba(0, 0, 0, .45)); }
.bcard__name { font-family: var(--font-fell); font-style: italic; font-size: 13px; fill: var(--bcard-ink); }
</style>
