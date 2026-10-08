<template>
  <GModal eyebrow="Brume" :title="mode === 'intro' ? 'Les nuits de l’île' : 'La nuit dernière'" :width="380" align="center" @close="$emit('close')">
    <div class="night-sheet">
      <BrumeWisp :size="54" :stage="stage" />
      <p v-for="(line, i) in shown" :key="i" class="night-sheet__line">«&nbsp;{{ line }}&nbsp;»</p>
    </div>
    <template #actions>
      <button type="button" class="g-btn" @click="$emit('close')">{{ mode === 'intro' ? 'Je veillerai' : 'Merci, Brume' }}</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';

// Ce que Brume présente des nuits, à la fin du prologue (HISTOIRE.md § 6.15)
const INTRO = [
  'La nuit, de petites créatures perdues sortent de la brume. Grognonnes plus que méchantes : elles embrument ce qu’elles touchent.',
  'Tes lumières les changent en lucioles, tes clôtures les arrêtent, et d’un toucher tu en repousses une.',
  'Rien n’est jamais perdu : un bâtiment embrumé se répare. La première nuit vient demain.'
];

// Brume parle des nuits (WorldView/nights.js) : leur présentation (intro), ou le bilan de la nuit dernière (recap :
// lines). Fermer, c'est « Je veillerai » ou « Merci »
export default {
  name: 'NightSheet',
  components: { GModal, BrumeWisp },
  props: {
    mode: { type: String, default: 'intro' },
    lines: { type: Array, default: () => [] },
    // Le stade de Brume (game/opus.js : brumeLook)
    stage: { type: Number, default: null }
  },
  emits: ['close'],
  computed: {
    shown() {
      return this.mode === 'intro' ? INTRO : this.lines;
    }
  }
};
</script>

<style scoped src="./NightSheet.css"></style>
