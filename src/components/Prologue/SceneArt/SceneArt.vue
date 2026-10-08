<template>
  <!-- Une scène du tutoriel dessinée par la bibliothèque (game/sceneArt.js) : le carré entier, aussi grand que l'écran le
       permet au-dessus de la bulle (sur un téléphone en hauteur, le recadrer couperait l'avatar ou celui qui parle).
       Au-dessus et au-dessous, ses bords se prolongent jusqu'à ceux de l'écran (le ciel en haut, le sol en bas) ; sur
       un écran large, son fond flouté remplit les côtés. Le fond, l'avatar, puis le devant ; leurs images en boucle.
       Une seule racine : la scène l'anime en fondu -->
  <div class="sa" aria-hidden="true">
    <template v-if="data">
      <img class="sa__backdrop" :src="data.back[0]" alt="" />
      <div class="sa__stage">
        <div class="sa__square">
          <svg class="sa__edge sa__edge--top" viewBox="0 0 400 1.5" preserveAspectRatio="none"><image :href="data.back[0]" width="400" height="400" /></svg>
          <svg class="sa__edge sa__edge--bottom" viewBox="0 398.5 400 1.5" preserveAspectRatio="none"><image :href="data.back[0]" width="400" height="400" /></svg>
          <svg class="sa__art" viewBox="0 0 400 400">
            <defs v-if="body && body.clip">
              <clipPath :id="clipId"><rect v-bind="body.clip" rx="4" /></clipPath>
            </defs>
            <image v-for="(href, k) in data.back" :key="`b${k}`" :href="href" width="400" height="400" :visibility="shown(k, data.back)" />
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
    return { NAME_LINE, frame: 0, clipId: `sa-photo-${++uid}` };
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
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    // Toutes les images sont posées dès le départ (rien ne clignote au premier tour) : seule celle du moment se voit
    shown(k, list) {
      return k === this.frame % list.length ? 'visible' : 'hidden';
    }
  }
};
</script>

<style scoped src="./SceneArt.css"></style>
