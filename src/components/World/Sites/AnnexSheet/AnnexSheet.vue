<template>
  <GModal :eyebrow="`${KIND_LABEL[annex.kind]} · ${site.name}`" :title="annex.name" :width="380" align="center" @close="$emit('close')">
    <div class="annex-sheet">
      <span class="annex-sheet__art"><img :src="art" alt="" /></span>
      <p class="annex-sheet__effect">{{ annex.effect }}</p>
      <p class="annex-sheet__text">
        <template v-if="annex.max > 1">Exemplaire {{ variant + 1 }} sur {{ annex.max }}. </template>
        Elle travaille pour {{ site.name }} depuis sa pose. Tu peux la déplacer gratuitement sur une autre case libre autour
        du bâtiment.
      </p>
    </div>
    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="$emit('site')">Bâtiment</button>
      <button type="button" class="g-btn" :disabled="busy" @click="$emit('move')">Déplacer</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { spriteUrl } from '@/world/spriteCache';
import { annexThumb } from '@/world/annexSprites';
import { KIND_LABEL } from '@/world/annexes';

// Fiche d'une annexe posée (appui long sur elle) : ce qu'elle fait, pour quel bâtiment ; la déplacer, ou ouvrir le bâtiment
export default {
  name: 'AnnexSheet',
  components: { GModal },
  props: {
    // Annexe du catalogue du bâtiment (site.annexes), son bâtiment, son n° d'exemplaire
    annex: { type: Object, required: true },
    site: { type: Object, required: true },
    variant: { type: Number, default: 0 },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'move', 'site'],
  data() {
    return { KIND_LABEL };
  },
  computed: {
    art() {
      return spriteUrl(`annex-thumb-${this.annex.id}-${this.variant}`, () => annexThumb(this.annex.id, this.variant));
    }
  }
};
</script>

<style scoped src="./AnnexSheet.css"></style>
