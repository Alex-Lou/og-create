<template>
  <!-- Les coquillages : le dessin de la bibliothèque, petit au bas d'un grand cadre ; on n'en garde que le bas -->
  <span v-if="kind === 'coquillages'" class="art art--crop" aria-hidden="true"><img :src="SHELLS" alt="" draggable="false" /></span>
  <!-- Les algues : trois brins ondulés -->
  <svg v-else-if="kind === 'algues'" class="art" viewBox="0 0 60 60" aria-hidden="true">
    <ellipse cx="30" cy="54" rx="20" ry="4" fill="rgba(80, 50, 20, .2)" />
    <g v-for="s in WEED" :key="s.d" fill="none" stroke-linecap="round">
      <path :d="s.d" stroke="#3C2819" stroke-width="7.4" />
      <path :d="s.d" :stroke="s.c" stroke-width="4.4" />
    </g>
  </svg>
  <!-- L'eau de mer : un seau de bois -->
  <svg v-else-if="kind === 'eau'" class="art" viewBox="0 0 60 60" aria-hidden="true">
    <ellipse cx="30" cy="55" rx="19" ry="3.6" fill="rgba(80, 50, 20, .2)" />
    <path d="M12 19 Q30 -4 48 19" fill="none" stroke="#3C2819" stroke-width="2.2" stroke-linecap="round" />
    <path d="M12 19 L17 52 Q30 57 43 52 L48 19 Z" fill="#B07A45" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M14 31 Q30 35 46 31 M16 44 Q30 48 44 44" fill="none" stroke="#6B4322" stroke-width="2.4" />
    <ellipse cx="30" cy="19" rx="18" ry="5" fill="#6FA7BB" stroke="#3C2819" stroke-width="1.8" />
    <ellipse cx="25" cy="18" rx="6" ry="1.4" fill="rgba(255, 255, 255, .45)" />
  </svg>
  <!-- La louche de cuivre ; pleine, elle porte la soupe -->
  <svg v-else-if="kind === 'louche'" :class="['art', { 'is-full': full }]" viewBox="0 0 60 100" aria-hidden="true">
    <line x1="46" y1="6" x2="25" y2="72" stroke="#3C2819" stroke-width="7.5" stroke-linecap="round" />
    <line x1="46" y1="6" x2="25" y2="72" stroke="#C27C45" stroke-width="4" stroke-linecap="round" />
    <path d="M5 76 Q7 95 22 95 Q37 95 39 76 Z" fill="#C27C45" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
    <ellipse class="art__ladle" cx="22" cy="76" rx="17" ry="5" stroke="#3C2819" stroke-width="1.8" />
  </svg>
  <!-- Le bol de bois ; plein, il porte la soupe -->
  <svg v-else-if="kind === 'bol'" :class="['art', { 'is-full': full }]" viewBox="0 0 80 50" aria-hidden="true">
    <ellipse cx="40" cy="45" rx="30" ry="4.5" fill="rgba(80, 50, 20, .2)" />
    <path d="M8 18 Q10 43 40 43 Q70 43 72 18 Z" fill="#C4874F" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M16 28 Q22 37 34 39" fill="none" stroke="rgba(255, 255, 255, .25)" stroke-width="3" stroke-linecap="round" />
    <ellipse cx="40" cy="18" rx="32" ry="8" fill="#8A5A2E" stroke="#3C2819" stroke-width="1.8" />
    <ellipse class="art__bowl" cx="40" cy="19" rx="27" ry="5.4" />
  </svg>
</template>

<script>
// Les pièces de la marmite de Marcelle (choix de l'auteur, 13 oct. : B4) : les ingrédients de la planche, la louche et le
// bol. Les coquillages viennent de la bibliothèque ; le reste est dessiné ici en attendant le sien (demande transmise par
// l'auteur). kind : 'coquillages', 'algues', 'eau', 'louche' ou 'bol' ; full : la louche ou le bol porte la soupe
// (sa teinte : --cook-soup, CookingPot.css)
const SHELLS = Object.values(import.meta.glob('/design/bibliotheque/svg/plantes/coquillages_nacres.svg', { query: '?url', import: 'default', eager: true }))[0];
const WEED = [
  { d: 'M22 52 Q14 40 22 30 Q30 20 22 9', c: '#5E9A4A' },
  { d: 'M32 53 Q40 42 32 31 Q25 22 33 12', c: '#7DB55C' },
  { d: 'M40 52 Q47 44 42 36', c: '#4E8A44' }
];

export default {
  name: 'CookingArt',
  props: {
    kind: { type: String, required: true },
    full: { type: Boolean, default: false }
  },
  data() {
    return { SHELLS, WEED };
  }
};
</script>

<style scoped src="./CookingArt.css"></style>
