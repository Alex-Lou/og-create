<template>
  <!-- La même scène-signature accueille le joueur au démarrage et pendant la préparation des dessins de l'île. -->
  <div class="island-loader" :data-stage="stage">
    <div class="island-loader__card">
      <div class="island-loader__brand">
        <svg class="island-loader__logo" viewBox="0 0 760 170" role="img" aria-label="Brumelune">
          <defs>
            <path id="island-loader-logo-arc" d="M76 142 Q380 -2 684 142" />
            <linearGradient id="island-loader-logo-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe7"/><stop offset=".48" stop-color="#f5dc98"/><stop offset="1" stop-color="#c8974e"/></linearGradient>
          </defs>
          <text class="island-loader__logo-title"><textPath href="#island-loader-logo-arc" startOffset="50%" text-anchor="middle">BRUMELUNE</textPath></text>
          <path class="island-loader__logo-flourish" d="M205 150q77 17 151 5m199-5q-77 17-151 5" />
          <circle cx="380" cy="157" r="4" fill="#f4d88d"/><circle cx="380" cy="157" r="9" fill="none" stroke="#f4d88d" stroke-opacity=".38"/>
          <text class="island-loader__logo-kicker" x="380" y="169" text-anchor="middle">L’ÎLE AUX SEPT SOUFFLES</text>
        </svg>
      </div>
      <div class="island-loader__scene">
        <img class="island-loader__art" src="/img/brumelune-splash.svg" alt="L’île de Brumelune, ses reliefs et son phare dans la brume" />
        <div class="island-loader__cast" aria-hidden="true">
          <span class="island-loader__anya"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/vivants/anya/anya_face_benediction_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/vivants/anya/anya_face_benediction_2.svg" alt=""/></span>
          <figure class="island-loader__character island-loader__character--aster"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/aster/aster_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/aster/aster_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--galet"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/galet/galet_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/galet/galet_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--sylve"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/sylve/sylve_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/sylve/sylve_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--cannelle"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/cannelle/cannelle_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/cannelle/cannelle_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--ondin"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/ondin/ondin_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/ondin/ondin_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--melisse"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/melisse/melisse_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/melisse/melisse_face_repos_2.svg" alt=""/></figure>
          <figure class="island-loader__character island-loader__character--rivet"><img class="island-loader__frame island-loader__frame--one" src="/design/bibliotheque/svg/personnages/maitres/rivet/rivet_face_repos_1.svg" alt=""/><img class="island-loader__frame island-loader__frame--two" src="/design/bibliotheque/svg/personnages/maitres/rivet/rivet_face_repos_2.svg" alt=""/></figure>
          <span class="island-loader__brume"><BrumeWisp class="island-loader__wisp" :size="112" :stage="stage" /><img class="island-loader__wisp-smile" src="/design/bibliotheque/svg/vivants/brume/brume_expr_rire_1.svg" alt=""/></span>
          <span class="island-loader__grimoire"><img src="/design/bibliotheque/svg/interface/hd/grimoire_icone.svg" alt=""/></span>
        </div>
      </div>
      <p id="island-loader-title" class="island-loader__status">{{ currentLabel }}</p>
      <div class="island-loader__bar" role="progressbar" aria-labelledby="island-loader-title" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent">
        <span :style="{ width: `${percent}%` }"></span>
      </div>
      <p class="island-loader__percent" aria-hidden="true">{{ percent }} %</p>
    </div>
    <ul class="island-loader__steps">
      <li v-for="step in steps" :key="step.id" :class="['island-loader__step', { 'is-done': step.done }]">
        <span class="island-loader__label">{{ step.label }}</span>
        <span v-if="step.count" class="island-loader__count">{{ step.count[0] }}/{{ step.count[1] }}</span>
        <span v-else class="island-loader__mark" aria-hidden="true">{{ step.done ? '✓' : '…' }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';
import { islandSteps, islandShare } from '@/game/loading';

export default {
  name: 'IslandLoader',
  components: { BrumeWisp },
  props: {
    // Ce que l'île a déjà prêt (WorldView : loading ; game/loading.js)
    progress: { type: Object, default: () => ({}) },
    // Stade de Brume (sa couleur)
    stage: { type: Number, default: null }
  },
  computed: {
    steps() {
      return islandSteps(this.progress);
    },
    percent() {
      return Math.round(islandShare(this.progress) * 100);
    },
    currentLabel() {
      const current = this.steps.find(step => !step.done);
      return current ? `${current.label}…` : 'L’île est prête.';
    }
  }
};
</script>

<style scoped src="./IslandLoader.css"></style>
