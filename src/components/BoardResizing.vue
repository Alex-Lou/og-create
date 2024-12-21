<template>
    <div
      class="resizer"
      @mousedown="onMouseDown"
      :style="{ cursor: 'col-resize' }"
    ></div>
  </template>
  
  <script>
  export default {
    props: {
      initialInventoryWidth: Number,
    },
    methods: {
      onMouseDown(event) {
        const startX = event.clientX;
        const startWidth = this.initialInventoryWidth;
  
        const onMouseMove = (moveEvent) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          this.$emit("resizeUpdate", newWidth);
        };
  
        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          this.$emit("resizeEnd");
        };
  
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
  
        this.$emit("resizeStart");
      },
    },
  };
  </script>
  
  <style scoped>
  .resizer {
    width: 10px;
    background-color: #ccc;
    height: 100%;
    cursor: col-resize;
    z-index: 10;
  }
  </style>
  