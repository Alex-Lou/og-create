<template>
  <GModal :eyebrow="`${visitor.role} · de passage`" :title="visitor.name" :width="400" align="center" @close="$emit('close')">
    <div class="guest">
      <div class="guest__top">
        <span class="guest__portrait"><img :src="portrait" alt="" /></span>
        <div class="guest__about">
          <p class="guest__story">{{ storyOf(visitor) }}</p>
          <span class="guest__leaves">Son bateau repart {{ leavesText(visitor.leavesIn) }}</span>
        </div>
      </div>

      <p class="guest__say" aria-live="polite">« {{ said || askLine(visitor) }} »</p>

      <section :class="['guest__request', { 'is-done': visitor.satisfied }]" aria-label="Sa demande">
        <h3 class="guest__title">Sa demande</h3>
        <div class="guest__ask">
          <span class="guest__glyph" aria-hidden="true"><ElementGlyph :glyph="glyph" /></span>
          <span class="guest__ask-text">{{ requestText(visitor.request) }}</span>
        </div>
        <span v-if="visitor.request.kind === 'recolter'" class="guest__meter" aria-hidden="true"><span :style="{ width: `${progress * 100}%` }"></span></span>
        <p class="guest__reward">Récompense : {{ visitor.request.reward }} <ElementGlyph glyph="ui:coin" /></p>
        <template v-if="!visitor.satisfied">
          <button v-if="visitor.request.kind === 'recolter' && !ready" type="button" class="g-btn guest__btn" :disabled="busy || !charges" @click="$emit('harvest')">
            {{ charges ? 'Lancer une Récolte' : 'Plus de Récolte en réserve' }}
          </button>
          <button v-else type="button" class="g-btn guest__btn" :disabled="busy || !ready" @click="$emit('satisfy')">
            <template v-if="visitor.request.kind === 'livrer'">Livrer {{ visitor.request.amount }} <ElementGlyph :glyph="glyph" /></template>
            <template v-else>C’est fait !</template>
          </button>
        </template>
        <p v-else class="guest__done">Demande comblée : merci !</p>
      </section>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { GLYPH } from '@/game/resources';
import { storyOf, requestText, askLine, readyOf, leavesText } from '@/world/visitors';

// Fiche d'un visiteur arrivé en bateau : qui il est, quand il repart, sa demande (livrer des ressources ou faire des
// Récoltes pendant son séjour) et sa récompense. Le serveur vérifie et verse ; l'île envoie et met à jour.
export default {
  name: 'VisitorSheet',
  components: { GModal, ElementGlyph },
  props: {
    // Vue du serveur : { id, seed, name, site, role, request, leavesIn, satisfied }
    visitor: { type: Object, required: true },
    stock: { type: Object, required: true },
    // Parties de Récolte en réserve
    charges: { type: Number, default: 0 },
    portrait: { type: String, default: '' },
    said: { type: String, default: '' },
    busy: { type: Boolean, default: false }
  },
  emits: ['satisfy', 'harvest', 'close'],
  computed: {
    glyph() {
      return this.visitor.request.kind === 'livrer' ? GLYPH[this.visitor.request.resource] : 'ui:spark';
    },
    ready() {
      return readyOf(this.visitor, this.stock);
    },
    progress() {
      const { have = 0, count = 1 } = this.visitor.request;
      return Math.min(1, have / count);
    }
  },
  methods: { storyOf, requestText, askLine, leavesText }
};
</script>

<style scoped>
.guest { display: grid; gap: 12px; font-family: var(--font-ui); text-align: left; }
.guest__top { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
.guest__portrait { position: relative; display: block; width: 96px; height: 110px; border-radius: 18px; background: radial-gradient(circle at 50% 75%, #D8EEFA, var(--vellum-200) 74%); }
.guest__portrait img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
.guest__about { display: grid; gap: 6px; }
.guest__story { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.35; color: var(--ink-700); }
.guest__leaves { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.guest__say {
  margin: 0; padding: 10px 14px; border-radius: 16px; background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1); font-family: var(--font-display); font-style: italic; font-size: 15px; line-height: 1.4;
}
.guest__request { display: grid; gap: 8px; padding: 12px 14px; border-radius: 16px; background: linear-gradient(135deg, #FFF4D6, var(--vellum-100)); box-shadow: inset 0 0 0 2px var(--gold-300); }
.guest__request.is-done { background: #EAF6E2; box-shadow: inset 0 0 0 1px rgba(78, 138, 58, .35); }
.guest__title { margin: 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.guest__ask { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
.guest__glyph { font-size: 30px; line-height: 1; }
.guest__ask-text { font-size: 15px; font-weight: 900; color: var(--ink-900); }
.guest__meter { height: 8px; border-radius: 999px; background: rgba(74, 52, 38, .14); overflow: hidden; }
.guest__meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #F2C04B, #E09A2E); transition: width .5s ease; }
.guest__reward { margin: 0; font-size: 13px; font-weight: 800; color: var(--ink-700); }
.guest__btn { width: 100%; display: inline-flex; justify-content: center; align-items: center; gap: 6px; }
.guest__done { margin: 0; font-size: 14px; font-weight: 900; color: #4E8A3A; }
</style>
