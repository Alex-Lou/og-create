<template>
  <img v-if="src" class="glyph" :src="src" alt="" draggable="false" />
  <template v-else>{{ glyph }}</template>
</template>

<script>
import { glyphSrc } from '@/utils/glyph';

// Affiche l'emoji d'un élément, ou son dessin quand aucun emoji ne lui convient
export default {
  name: 'ElementGlyph',
  props: {
    glyph: { type: String, default: '' }
  },
  computed: {
    src() {
      return glyphSrc(this.glyph);
    }
  }
};
</script>

<style scoped src="./ElementGlyph.css"></style>
