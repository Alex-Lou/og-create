<template>
  <div class="scene" role="dialog" aria-modal="true" :aria-label="title">
    <div class="scene__card">
      <header class="scene__head">
        <div>
          <span class="scene__eyebrow">{{ eyebrow }}</span>
          <span class="scene__title">{{ title }}</span>
        </div>
        <button v-if="later" type="button" class="scene__later" @click="$emit('later')">{{ later }}</button>
      </header>

      <!-- L'aire de jeu de la scène -->
      <slot />

      <p v-if="rule" class="scene__rule">{{ rule }}</p>

      <!-- Le personnage ouvre la scène, puis la ferme : sa bulle et le bouton qui lance (ou clôt) -->
      <div v-if="say" class="scene__talk">
        <div class="scene__bubble">
          <img v-if="face" :class="['scene__face', { 'is-bust': face.bust }]" :src="face.face" alt="" />
          <p><strong>{{ speaker }}</strong>{{ say }}</p>
        </div>
        <button v-if="action" type="button" class="scene__btn" @click="$emit('act')">{{ action }}</button>
      </div>
      <p class="scene__sr" aria-live="polite">{{ live }}</p>
    </div>
  </div>
</template>

<script>
// L'habit des scènes à part de l'île (la chasse aux poules, la marmite de Cannelle ; choix de l'auteur, 13 oct. : un seul
// habit, partagé) : plein écran, la carte, son en-tête (eyebrow : où on en est ; « Plus tard » si later), l'aire de jeu
// (le contenu), la consigne (rule), puis la bulle du personnage (speaker, face : { face, bust }, say) et son bouton
// (action). live : ce que lit un lecteur d'écran. Émet later et act ; ne sait rien du jeu
export default {
  name: 'SceneCard',
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    later: { type: String, default: '' },
    rule: { type: String, default: '' },
    speaker: { type: String, default: '' },
    face: { type: Object, default: null },
    say: { type: String, default: '' },
    action: { type: String, default: '' },
    live: { type: String, default: '' }
  },
  emits: ['later', 'act']
};
</script>

<style scoped src="./SceneCard.css"></style>
