<template>
    <div id="crafted-popup" ref="craftedPopup" :class="{ show: craftedElement.name }">
      <div class="popup-content">
        <img v-if="craftedElement.image" :src="craftedElement.image" :alt="craftedElement.name" />
        <p>{{ craftedElement.name }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CraftPopup',
    props: {
      craftedElement: {
        type: Object,
        required: true,
        default: () => ({
          name: '',
          image: null
        })
      },
    },
    watch: {
      'craftedElement.name'(newValue) {
        if (newValue) {
          this.showPopup();
        }
      }
    },
    methods: {
      showPopup() {
        const popup = this.$refs.craftedPopup;
        popup.classList.add("show");
        setTimeout(() => {
          popup.classList.remove("show");
          this.$emit('reset-crafted-element');
        }, 2500);
      }
    }
  }
  </script>