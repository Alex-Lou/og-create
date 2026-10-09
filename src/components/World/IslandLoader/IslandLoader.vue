<template>
  <!-- La même scène-signature accueille le joueur au démarrage (#splash, index.html) et pendant la préparation des
       dessins de l'île : le titre, la scène et la troupe reprennent les classes .splash__* d'index.html (une seule mise
       en page : les deux écrans s'enchaînent sans saut). Seuls l'état et les étapes de l'île sont propres à cet écran. -->
  <div class="island-loader" :data-stage="stage">
    <div class="splash__card">
      <div class="splash__brand">
        <svg class="splash__logo" viewBox="0 0 760 186" role="img" aria-label="Brumelune">
          <defs>
            <path id="island-loader-logo-arc" d="M76 142 Q380 -2 684 142" />
            <linearGradient id="island-loader-logo-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe7"/><stop offset=".48" stop-color="#f5dc98"/><stop offset="1" stop-color="#c8974e"/></linearGradient>
          </defs>
          <text class="splash__logo-title island-loader__logo-title"><textPath href="#island-loader-logo-arc" startOffset="50%" text-anchor="middle">BRUMELUNE</textPath></text>
          <path class="splash__logo-flourish" d="M205 150q77 17 151 5m199-5q-77 17-151 5" />
          <circle cx="380" cy="152" r="4" fill="#f4d88d"/><circle cx="380" cy="152" r="9" fill="none" stroke="#f4d88d" stroke-opacity=".38"/>
          <text class="splash__logo-kicker" x="380" y="180" text-anchor="middle">L’ÎLE AUX SEPT SOUFFLES</text>
        </svg>
      </div>
      <div class="splash__scene">
        <img class="splash__art" src="/img/brumelune-splash.svg" alt="L’île de Brumelune, ses reliefs et son phare dans la brume" />
        <div class="splash__cast" aria-hidden="true">
          <span class="splash__anya"><img class="splash__character-frame--one" :src="art('vivants/anya/anya_face_benediction_1')" alt=""/><img class="splash__character-frame--two" :src="art('vivants/anya/anya_face_benediction_2')" alt=""/></span>
          <figure v-for="name in CAST" :key="name" :class="['splash__character', `splash__character--${name}`]">
            <img class="splash__character-frame--one" :src="art(`personnages/maitres/${name}/${name}_face_repos_1`)" alt=""/>
            <img class="splash__character-frame--two" :src="art(`personnages/maitres/${name}/${name}_face_repos_2`)" alt=""/>
          </figure>
          <!-- Brume à son stade (sa couleur), ses quatre images en boucle comme au démarrage -->
          <span class="splash__wisp"><img v-for="src in wispFrames" :key="src" :src="src" alt=""/><img class="splash__wisp-smile" :src="art('vivants/brume/brume_expr_rire_1')" alt=""/></span>
          <span class="splash__grimoire"><img :src="art('interface/hd/grimoire_icone')" alt=""/></span>
        </div>
      </div>
      <p id="island-loader-title" class="island-loader__status">{{ currentLabel }}</p>
      <div class="island-loader__bar" role="progressbar" aria-labelledby="island-loader-title" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent">
        <span :style="{ width: `${percent}%` }"></span>
      </div>
      <p class="island-loader__percent" aria-hidden="true">{{ percent }} %</p>
      <ul class="island-loader__steps">
        <li v-for="step in steps" :key="step.id" :class="['island-loader__step', { 'is-done': step.done }]">
          <span class="island-loader__label">{{ step.label }}</span>
          <span v-if="step.count" class="island-loader__count">{{ step.count[0] }}/{{ step.count[1] }}</span>
          <span v-else class="island-loader__mark" aria-hidden="true">{{ step.done ? '✓' : '…' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { brumeArtUrls } from '@/world/brumeArt';
import { islandSteps, islandShare } from '@/game/loading';

// La troupe, dans l'ordre d'index.html (leurs places : classes .splash__character--<nom>)
const CAST = ['aster', 'galet', 'sylve', 'cannelle', 'ondin', 'melisse', 'rivet'];
// Les dessins de la bibliothèque passent par Vite (?url) : une adresse /design/... écrite telle quelle n'existe pas dans
// le build publié (dist n'a pas de dossier design/)
const ROOT = '/design/bibliotheque/svg/';
const ART = import.meta.glob([
  '/design/bibliotheque/svg/vivants/anya/anya_face_benediction_[12].svg',
  '/design/bibliotheque/svg/personnages/maitres/*/*_face_repos_[12].svg',
  '/design/bibliotheque/svg/vivants/brume/brume_expr_rire_1.svg',
  '/design/bibliotheque/svg/interface/hd/grimoire_icone.svg'
], { query: '?url', import: 'default', eager: true });
const art = name => ART[`${ROOT}${name}.svg`] || '';

export default {
  name: 'IslandLoader',
  props: {
    // Ce que l'île a déjà prêt (WorldView : loading ; game/loading.js)
    progress: { type: Object, default: () => ({}) },
    // Stade de Brume (sa couleur)
    stage: { type: Number, default: null }
  },
  data() {
    return { CAST };
  },
  methods: {
    art
  },
  computed: {
    // Les quatre images de Brume à son stade (world/brumeArt.js), comme BrumeWisp
    wispFrames() {
      return brumeArtUrls({ stage: this.stage ?? 1 }, false) || brumeArtUrls({ stage: 1 }, false) || [];
    },
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
