<template>
  <canvas ref="canvas" class="name-sign-art" :style="{ width: `${width}px`, height: `${height}px` }" role="img" :aria-label="label ? `${label} : ${name}` : name"></canvas>
</template>

<script>
import { imageOf } from '@/world/spriteCache';
import { nameSignLayers, paintName } from '@/world/nameSigns';

// Partie du dessin montrée (pixels du monde, depuis le pied de l'enseigne)
const CROP = [-31, -54, 62, 58];

// Aperçu d'une enseigne et du nom écrit dessus : le même dessin et la même écriture que sur l'île (canvas net à la
// densité de l'écran ; redessiné quand les images ou les polices arrivent)
export default {
  name: 'NameSignArt',
  props: {
    signStyle: { type: String, required: true },
    name: { type: String, required: true },
    width: { type: Number, default: 96 },
    label: { type: String, default: '' }
  },
  computed: {
    height() {
      return Math.round((this.width * CROP[3]) / CROP[2]);
    }
  },
  watch: {
    signStyle: 'paint',
    name: 'paint',
    width: 'paint'
  },
  mounted() {
    this.paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.paint());
  },
  beforeUnmount() {
    clearTimeout(this.retry);
  },
  methods: {
    paint() {
      clearTimeout(this.retry);
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(this.width * dpr);
      canvas.height = Math.round(this.height * dpr);
      const ctx = canvas.getContext('2d');
      const s = (this.width * dpr) / CROP[2];
      ctx.setTransform(s, 0, 0, s, -CROP[0] * s, -CROP[1] * s);
      let ready = true;
      for (const layer of nameSignLayers(this.signStyle, 0)) {
        const entry = imageOf(layer.key, layer.make);
        if (entry.img) ctx.drawImage(entry.img, entry.box.x, entry.box.y, entry.box.w, entry.box.h);
        else ready = false;
      }
      // Une image encore en chargement (peut-être demandée d'abord par l'île) : on réessaie un peu plus tard
      // (au plus une soixantaine d'essais, ~5 s : une image qui ne vient pas n'est pas attendue sans fin)
      if (ready) {
        paintName(ctx, this.signStyle, this.name, 0);
        this.tries = 0;
      } else if ((this.tries = (this.tries || 0) + 1) < 60) this.retry = setTimeout(() => this.paint(), 80);
    }
  }
};
</script>

<style scoped src="./NameSignArt.css"></style>
