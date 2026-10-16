<template>
  <GModal sheet :eyebrow="`${KIND_LABEL[annex.kind]} · ${site.name}`" :title="annex.name" :width="380" align="center" @close="$emit('close')">
    <div class="annex-sheet">
      <span class="annex-sheet__art"><img :src="art" alt="" :class="{ 'is-flipped': flip }" /></span>
      <p class="annex-sheet__effect">{{ annex.effect }}</p>
      <p class="annex-sheet__text">
        <template v-if="annex.max > 1">{{ T.copy(rank + 1, annex.max) }}</template>
        {{ T.works(site.name) }}
      </p>
      <PoseChoice
        :id="annex.id"
        :looks="annex.looks || 1"
        :look="look"
        :flip="flip"
        :busy="busy"
        @look="n => $emit('pose', { look: n })"
        @turn="$emit('pose', { flip: !flip })"
      />
    </div>
    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="$emit('site')">Bâtiment</button>
      <button type="button" class="g-btn" :disabled="busy" @click="$emit('move')">Déplacer</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import PoseChoice from '../PoseChoice/PoseChoice.vue';
import { annexPicture } from '@/world/annexSprites';
import { KIND_LABEL } from '@/world/annexes';
import { ANNEX_SHEET as T } from '@/texts/world/screens/sites';

// Fiche d'une annexe posée (appui long sur elle) : ce qu'elle fait, pour quel bâtiment ; la pivoter, changer sa couleur
// (pose : { flip } ou { look }), la déplacer, ou ouvrir le bâtiment
export default {
  name: 'AnnexSheet',
  components: { GModal, PoseChoice },
  props: {
    // Annexe du catalogue du bâtiment (site.annexes), son bâtiment, son n° d'exemplaire, sa couleur dessinée, en miroir
    annex: { type: Object, required: true },
    site: { type: Object, required: true },
    rank: { type: Number, default: 0 },
    look: { type: Number, default: 0 },
    flip: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'move', 'site', 'pose'],
  data() {
    return { T, KIND_LABEL };
  },
  computed: {
    art() {
      return annexPicture(this.annex.id, this.look);
    }
  }
};
</script>

<style scoped src="./AnnexSheet.css"></style>
