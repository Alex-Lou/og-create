<template>
  <ol class="world__steps">
    <li v-for="(step, i) in site.levels" :key="step.name" :class="['world__step', `is-${stepState(site, i)}`]">
      <span class="world__step-mark" aria-hidden="true">{{ stepState(site, i) === 'done' ? '✓' : i + 1 }}</span>
      <div class="world__step-body">
        <span class="world__step-name">{{ step.name }}</span>
        <span class="world__step-effect">{{ step.effect }}</span>
        <ul v-if="stepState(site, i) !== 'done'" class="world__needs">
          <li v-if="step.chapter" :class="['world__need', step.chapterOpen ? 'is-ok' : 'is-missing']">
            <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:book" /></span>
            <span>Chapitre <strong>{{ step.chapter }}</strong> du Grimoire</span>
            <em>{{ step.chapterOpen ? 'ouvert' : 'encore scellé' }}</em>
          </li>
          <li v-if="step.plan" :class="['world__need', step.planOwned ? 'is-ok' : 'is-missing']">
            <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="step.planEmoji || 'ui:plan'" /></span>
            <span>Plan : <strong>{{ step.plan }}</strong></span>
            <em>{{ step.planOwned ? 'trouvé' : 'à découvrir dans le Grimoire' }}</em>
          </li>
          <li v-for="(n, r) in step.cost" :key="r" :class="['world__need', stock[r] >= n ? 'is-ok' : 'is-missing']">
            <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="GLYPH[r]" /></span>
            <span><strong>{{ stock[r] }}</strong> / {{ n }} {{ LABEL[r] }}</span>
          </li>
          <li v-if="step.coins" :class="['world__need', coinsOk(step.coins) ? 'is-ok' : 'is-missing']">
            <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:coin" /></span>
            <span><strong>{{ step.coins }}</strong> écus</span>
            <em v-if="!coinsOk(step.coins)">il en manque {{ step.coins - coins }}</em>
          </li>
        </ul>
        <div v-if="stepState(site, i) === 'next'" class="world__sheet-actions">
          <button type="button" class="world__btn" :disabled="!canBuild(site) || busy" @click="$emit('build')">
            {{ site.level ? `Faire évoluer : ${step.name}` : `Bâtir : ${step.name}` }}
          </button>
          <button v-if="!affordable(site) && charges" type="button" class="world__btn world__btn--quiet" :disabled="busy" @click="$emit('harvest')">
            Jouer une Récolte
          </button>
        </div>
      </div>
    </li>
  </ol>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { GLYPH, LABEL } from '@/game/resources';
import { stepState, levelAffordable, coinsEnough, levelReady } from '@/world/levels';
// Onglet « Évolution » de la fiche d'un bâtiment : tous ses paliers, ce que demande le suivant (chapitre, plan,
// ressources, écus), et le bouton qui le bâtit. La construction reste à l'île, qui la reçoit en événement. Ses styles
// sont ceux de l'île (WorldView, classes world__)
export default {
  name: 'SiteSteps',
  components: { ElementGlyph },
  props: {
    site: { type: Object, required: true },
    // Réserves de l'île, et parties de Récolte en réserve
    stock: { type: Object, required: true },
    charges: { type: Number, default: 0 },
    // Solde connu, ou null (le serveur tranchera)
    coins: { type: Number, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['build', 'harvest'],
  data() {
    return { GLYPH, LABEL };
  },
  methods: {
    stepState,
    affordable(site) {
      return levelAffordable(site, this.stock);
    },
    coinsOk(price) {
      return coinsEnough(price, this.coins);
    },
    canBuild(site) {
      return levelReady(site, this.stock, this.coins);
    }
  }
};
</script>

<style scoped src="./SiteSteps.css"></style>
