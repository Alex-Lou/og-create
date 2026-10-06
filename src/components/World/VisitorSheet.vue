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

      <!-- Comblé, il peut rester s'il y a une maison libre (annexes du Foyer) -->
      <section v-if="visitor.satisfied" class="guest__stay" aria-label="Rester sur l’île">
        <template v-if="houses.total > houses.used">
          <p class="guest__stay-text">Une maison est libre : {{ visitor.name }} pourrait s’installer et travailler à « {{ workName }} ».</p>
          <button type="button" class="g-btn guest__btn" :disabled="busy" @click="$emit('settle')">Lui proposer de rester</button>
        </template>
        <p v-else class="guest__stay-text">Pour que {{ visitor.name }} reste, pose une Maison près du Foyer (onglet Annexes du Foyer).</p>
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
    // Parties de Récolte en réserve ; maisons du Foyer ({ total, used }) ; nom du bâtiment où il travaillerait
    charges: { type: Number, default: 0 },
    houses: { type: Object, default: () => ({ total: 0, used: 0 }) },
    workName: { type: String, default: '' },
    portrait: { type: String, default: '' },
    said: { type: String, default: '' },
    busy: { type: Boolean, default: false }
  },
  emits: ['satisfy', 'harvest', 'settle', 'close'],
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
/* Ses jetons (couleurs des visiteurs partagées : tokens/island.css) */
.guest {
  --guest-portrait: radial-gradient(circle at 50% 75%, #d8eefa, var(--vellum-200) 74%);
  --guest-done-ring: rgba(78, 138, 58, .35);  /* demande remplie */
  --guest-meter-to: #e09a2e;
}
.guest { display: grid; gap: 12px; font-family: var(--font-ui); text-align: left; }
.guest__top { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
.guest__portrait { position: relative; display: block; width: 96px; height: 110px; border-radius: var(--r-board); background: var(--guest-portrait); }
.guest__portrait img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
.guest__about { display: grid; gap: 6px; }
.guest__story { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.35; color: var(--ink-700); }
.guest__leaves { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.guest__say {
  margin: 0; padding: 10px 14px; border-radius: var(--r-md); background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1); font-family: var(--font-display); font-style: italic; font-size: 15px; line-height: 1.4;
}
.guest__request { display: grid; gap: 8px; padding: 12px 14px; border-radius: var(--r-md); background: linear-gradient(135deg, var(--gold-100), var(--vellum-100)); box-shadow: inset 0 0 0 2px var(--gold-300); }
.guest__request.is-done { background: var(--island-happy); box-shadow: inset 0 0 0 1px var(--guest-done-ring); }
.guest__title { margin: 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.guest__ask { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
.guest__glyph { font-size: 30px; line-height: 1; }
.guest__ask-text { font-size: 15px; font-weight: 900; color: var(--ink-900); }
.guest__meter { height: 8px; border-radius: var(--r-pill); background: rgba(var(--shade-rgb), .14); overflow: hidden; }
.guest__meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--oc-gold-bright), var(--guest-meter-to)); transition: width .5s ease; }
.guest__reward { margin: 0; font-size: 13px; font-weight: 800; color: var(--ink-700); }
.guest__btn { width: 100%; display: inline-flex; justify-content: center; align-items: center; gap: 6px; }
.guest__done { margin: 0; font-size: 14px; font-weight: 900; color: var(--oc-success); }
.guest__stay { display: grid; gap: 8px; padding: 12px 14px; border-radius: var(--r-md); background: var(--island-visitor-bg); box-shadow: inset 0 0 0 1px var(--island-visitor-ring); }
.guest__stay-text { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.4; color: var(--ink-700); }
</style>
