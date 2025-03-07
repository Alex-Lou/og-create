<template>
    <div class="category">
      <div class="category-header">
        <span class="category-title">{{ category.name }}</span>
        <div class="progress">
          <div class="progress-value" :style="{ width: category.progress + '%' }"></div>
          <div class="progress-bar-fill" :style="{ width: category.progress + '%' }">
            <template v-for="n in Math.floor(category.progress / 10)" :key="`particle-group-${n}`">
              <div :class="`particle particle-${n * 10}`"></div>
            </template>
          </div>
        </div>
      </div>
      <div class="category-content">
        <div
          v-for="element in category.elements"
          :key="element"
          class="inventory-item"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @dragend="endDrag"
          @click="$emit('select-element', element)"
        >
          {{ elementEmojis[element] || '' }} {{ element }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import '@/assets/ComponentsStyle/InventoryStyle/InventoryCategoryStyle.css'
  export default {
    name: 'InventoryCategory',
    props: {
      category: {
        type: Object,
        required: true
      },
      elementEmojis: {
        type: Object,
        required: true
      }
    },
    emits: ['select-element'],
    methods: {
      startDrag(event, element) {
        if (element) {
          event.dataTransfer.setData('text/plain', element);
        }
      },
      endDrag(event) {
        event.dataTransfer.clearData();
      }
    }
  }
  </script>