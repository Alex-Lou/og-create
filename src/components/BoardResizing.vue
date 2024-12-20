<template>
    <div id="resizer" @mousedown="startResizing"></div>
  </template>
  
  <script>
  export default {
    props: {
      initialInventoryWidth: {
        type: Number,
        required: true,
      },
      mainContentWidth: {
        type: Number,
        required: true,
      },
    },
    emits: ["resizeStart", "resizeUpdate", "resizeEnd"],
    data() {
      return {
        isResizing: false,
        startX: 0,
      };
    },
    methods: {
      startResizing(event) {
        this.isResizing = true;
        this.startX = event.clientX;
  
        this.$emit("resizeStart");
  
        document.addEventListener("mousemove", this.resize);
        document.addEventListener("mouseup", this.stopResizing);
      },
      resize(event) {
        if (!this.isResizing) return;
  
        const deltaX = event.clientX - this.startX;
        const newInventoryWidth = this.initialInventoryWidth + deltaX;
  
        const minInventoryWidth = 100;
        const maxInventoryWidth = this.mainContentWidth - 200;
  
        if (newInventoryWidth >= minInventoryWidth && newInventoryWidth <= maxInventoryWidth) {
          this.$emit("resizeUpdate", newInventoryWidth);
        }
      },
      stopResizing() {
        this.isResizing = false;
  
        this.$emit("resizeEnd");
  
        document.removeEventListener("mousemove", this.resize);
        document.removeEventListener("mouseup", this.stopResizing);
      },
    },
  };
  </script>
  