<template>
  <!-- Une scène du tutoriel dessinée par la bibliothèque (game/sceneArt.js) : le carré entier, aussi grand que l'écran le
       permet au-dessus de la bulle (sur un téléphone en hauteur, le recadrer couperait l'avatar ou celui qui parle).
       Au-dessus et au-dessous, ses bords se prolongent jusqu'à ceux de l'écran (le ciel en haut, le sol en bas) ; sur
       un écran large, son fond flouté remplit les côtés. Le fond, ce qui bouge dessus (s'il est à part), l'avatar,
       puis le devant ; leurs images en boucle.
       Le fond flouté et les bords sont une image fixe du fond, peinte une fois (paintStill) : ses animations ne se
       jouent que dans le carré (copiées trois fois, dont deux floutées, elles figeaient le téléphone).
       Une seule racine : la scène l'anime en fondu -->
  <div class="sa" aria-hidden="true">
    <template v-if="data">
      <canvas ref="backdrop" class="sa__backdrop" :width="STILL_PX" :height="STILL_PX" />
      <div class="sa__stage">
        <div class="sa__square">
          <canvas ref="top" class="sa__edge sa__edge--top" :width="ART" height="1" />
          <canvas ref="bottom" class="sa__edge sa__edge--bottom" :width="ART" height="1" />
          <svg :class="['sa__art', { 'sa__art--breathing': data.still }]" viewBox="0 0 400 400">
            <defs v-if="body && body.clip">
              <clipPath :id="clipId"><rect v-bind="body.clip" rx="4" /></clipPath>
            </defs>
            <image v-for="(href, k) in data.back" :key="`b${k}`" :href="href" width="400" height="400" :visibility="shown(k, data.back)" />
            <image v-for="(href, k) in data.live" :key="`l${k}`" :href="href" width="400" height="400" :visibility="shown(k, data.live)" />
            <g v-if="body" :clip-path="body.clip ? `url(#${clipId})` : null">
              <g :transform="body.mirror">
                <image v-for="(href, k) in body.frames" :key="`a${k}`" :href="href" :x="body.x" :y="body.y" :width="body.w" :height="body.h" :visibility="shown(k, body.frames)" />
              </g>
            </g>
            <image v-for="(href, k) in data.front" :key="`f${k}`" :href="href" width="400" height="400" :visibility="shown(k, data.front)" />
            <text v-if="name" class="sa__name" :x="NAME_LINE.x" :y="NAME_LINE.y" :textLength="name.length > 12 ? NAME_LINE.w : null" lengthAdjust="spacingAndGlyphs">{{ name }}</text>
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { sceneOf, avatarFrames, avatarBox, NAME_LINE } from '@/game/sceneArt';
import { reducedMotion } from '@/utils/fx';

let uid = 0;
// Le carré de la scène (unités de ses SVG) ; la bande de ses bords prolongée jusqu'à ceux de l'écran ; la taille de
// l'image fixe du fond flouté (floutée de 36 px, plus fine ne se verrait pas)
const ART = 400;
const EDGE = 1.5;
const STILL_PX = 64;

export default {
  name: 'SceneArt',
  props: {
    // La scène de la bibliothèque (scenes.json : 01_greve, 02_rocher…)
    scene: { type: String, required: true },
    // L'avatar du joueur : l'un des exemples (game/sceneArt.js, LOOKS), ou ses choix (game/avatarKit.js)
    look: { type: [String, Object], default: '' },
    // Le joueur n'est pas encore à l'écran : on voit par ses yeux
    alone: { type: Boolean, default: false },
    // Une autre vue ou pose que celle de la scène ({ vue, pose } : grelotter de face, quand il a peur)
    pose: { type: Object, default: null },
    // La scène reste sur sa première image (le feu pas encore pris)
    still: { type: Boolean, default: false },
    // Le nom écrit sur la ligne « Nom » de la carte d'embarquement
    name: { type: String, default: '' }
  },
  data() {
    return { NAME_LINE, ART, STILL_PX, frame: 0, clipId: `sa-photo-${++uid}` };
  },
  computed: {
    data() {
      return sceneOf(this.scene);
    },
    body() {
      if (!this.data || !this.data.avatar || this.alone) return null;
      const spot = { ...this.data.avatar, ...this.pose };
      return { ...avatarBox(spot), frames: avatarFrames(this.look, spot) };
    }
  },
  mounted() {
    // Les images tournent en boucle ; avec le mouvement réduit, la première reste
    if (this.data && this.data.frames > 1 && !this.still && !reducedMotion()) this.timer = setInterval(() => this.frame++, this.data.ms);
    this.paintStill();
  },
  beforeUnmount() {
    clearInterval(this.timer);
    if (this.stillImg) this.stillImg.onload = null;
  },
  methods: {
    // Le fond flouté et les deux bords : la première image du fond, lue une fois et peinte dans leurs canvas (une
    // image qui n'a pas pu être lue les laisse vides : la nuit de la scène se voit derrière)
    paintStill() {
      if (!this.data) return;
      const img = new Image();
      this.stillImg = img;
      img.onload = () => {
        this.stillImg = null;
        const { backdrop, top, bottom } = this.$refs;
        if (!backdrop || !top || !bottom) return;
        const w = img.naturalWidth || ART;
        const h = img.naturalHeight || ART;
        const band = (h * EDGE) / ART;
        backdrop.getContext('2d').drawImage(img, 0, 0, STILL_PX, STILL_PX);
        top.getContext('2d').drawImage(img, 0, 0, w, band, 0, 0, ART, 1);
        bottom.getContext('2d').drawImage(img, 0, h - band, w, band, 0, 0, ART, 1);
      };
      img.src = this.data.back[0];
    },
    // Toutes les images sont posées dès le départ (rien ne clignote au premier tour) : seule celle du moment se voit
    shown(k, list) {
      return k === this.frame % list.length ? 'visible' : 'hidden';
    }
  }
};
</script>

<style scoped src="./SceneArt.css"></style>
