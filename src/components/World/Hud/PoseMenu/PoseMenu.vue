<template>
  <!-- Une pose en attente de confirmation, au-dessus de la case choisie (un bâtiment déplacé, une création, une annexe) :
       son nom, ce qu'on règle encore (couleur, sens : la fente), puis la poser ici ou choisir une autre case. Styles :
       island-ui.css (world__menu) -->
  <div class="world__menu world__menu--pose" :style="place" role="dialog" :aria-label="label">
    <span class="world__menu-name"><slot name="name">{{ name }}</slot></span>
    <slot />
    <span class="world__menu-row">
      <button type="button" class="world__menu-btn" :data-coach="coach" :disabled="busy" @click="$emit('confirm')">{{ confirm }}</button>
      <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="$emit('other')">Autre case</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PoseMenu',
  props: {
    name: { type: String, required: true },
    // Le nom du dialogue pour les lecteurs d'écran (« Poser … », « Déplacer … »)
    label: { type: String, required: true },
    // Sa place à l'écran, au-dessus de la case ({ left, top })
    place: { type: Object, default: null },
    confirm: { type: String, default: 'Poser ici' },
    // Repère du coach sur le bouton de pose (le tutoriel y pose la main), ou null
    coach: { type: String, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['confirm', 'other']
};
</script>
