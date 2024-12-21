<template>
    <div
      class="resizer"
      @mousedown="startResizing"
    ></div>
  </template>
  
  <script>

import '@/assets/GameSizerStyle.css';

export default {
  name: 'GameSizer',
  data() {
    return {
      isResizing: false,
      startX: 0,
      initialInventoryWidth: 0,
    };
  },
  mounted() {
    // Définit les proportions initiales des flexbox
    const mainContentWidth = this.$parent.$refs.mainContent.offsetWidth;
    const initialInventoryWidth = mainContentWidth * 0.4; // 30% pour l'inventaire
    const initialCraftingWidth = mainContentWidth * 0.7; // 70% pour le crafting

    this.$parent.$refs.inventory.style.flex = initialInventoryWidth / mainContentWidth;
    this.$parent.$refs.craftingBoard.style.flex = initialCraftingWidth / mainContentWidth;
  },
  methods: {
    startResizing(event) {
      this.isResizing = true;
      this.startX = event.clientX;
      this.initialInventoryWidth = this.$parent.$refs.inventory.offsetWidth;

      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResizing);
    },
    resize(event) {
      if (!this.isResizing) return;

      const deltaX = event.clientX - this.startX;
      const newInventoryWidth = this.initialInventoryWidth + deltaX;
      const mainContentWidth = this.$parent.$refs.mainContent.offsetWidth;

      const minInventoryWidth = 100; // Minimum width of the inventory
      const maxInventoryWidth = mainContentWidth - 200; // Minimum width of the crafting board

      if (newInventoryWidth >= minInventoryWidth && newInventoryWidth <= maxInventoryWidth) {
        const inventoryFlex = newInventoryWidth / mainContentWidth;
        const craftingFlex = 1 - inventoryFlex;

        this.$parent.$refs.inventory.style.flex = inventoryFlex;
        this.$parent.$refs.craftingBoard.style.flex = craftingFlex;
      }
    },
    stopResizing() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResizing);
    },
  },
};

  </script>
  
