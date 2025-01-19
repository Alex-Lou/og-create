<template>
    <div class="voltage-button">
      <button @click="$emit('click')">
        <slot></slot>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VoltageAnimation',
  };
  </script>
  
  <style scoped>
  @import "@/assets/VoltageAnimationStyle.css";

  </style>
  