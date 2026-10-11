<template>
  <!-- Ce que fait le doigt dans un mode de l'île (déplacer un bâtiment, poser une création ou une annexe), et de quoi en
       sortir. Styles : island-ui.css (world__banner) -->
  <p class="world__banner" role="status">
    {{ text }}
    <button type="button" class="world__link" @click="$emit('cancel')">Annuler</button>
  </p>
</template>

<script>
export default {
  name: 'CancelBanner',
  props: {
    text: { type: String, required: true }
  },
  emits: ['cancel']
};
</script>
