<template>
  <div id="crafting-board" ref="craftingBoard">
      <WaveAnimation />
      <div class="animation-container">
          <template v-if="isFireworkActive">
              <FireworkAnimation />
              <FireworkAnimation :delay="0.4" :offsetX="50" />
              <FireworkAnimation :delay="0.8" :offsetX="-200" />
          </template>
      </div>
      <div id="crafting" @dragover.prevent @drop="handleDrop">
          <div class="title-container">
              <h2 class="animated-text">Creation Zone</h2>
              <VoltageAnimation @click="craftItem">Craft</VoltageAnimation>
          </div>
          <div id="selection">
              <ul id="selected-resources">
                  <li v-for="(resource, index) in selected"
                      :key="index"
                      @click="removeResource(index)"
                      draggable="true"
                      @dragstart="dragStart(resource)">
                      {{ elementEmojis[resource] || '' }} {{ resource }}
                  </li>
              </ul>
          </div>
          <div id="crafted-result">
              <p id="crafted-item" ref="craftedItemDisplay"></p>
          </div>
          <div v-for="(element, elementIndex) in craftedElements"
               :key="'crafted-' + elementIndex"
               :style="{ top: element.position.top + 'px', left: element.position.left + 'px' }"
               draggable="true"
               @dragstart="dragStartCraftedElement(elementIndex)"
               @dragend="dragEndCraftedElement(elementIndex)"
               @click="removeCraftedElement(elementIndex)"
               @dragover.prevent
               @drop.stop="handleDropOnCraftedElement(element.name, $event, elementIndex)"
               class="crafted-element">
              <p>{{ elementEmojis[element.name] || '' }} {{ element.name }}</p>
          </div>
      </div>
      <button class="reset-crafting-button" style="--content: 'Clean';" @click="resetCraftingBoard">
          Clean
      </button>
      <footer>
          <p>Created with ❤️ by CybWolf.</p>
      </footer>
  </div>
  </template>
  
  <script>
  import WaveAnimation from './WaveAnimation.vue';
  import FireworkAnimation from './FireWorkAnimation.vue';
  import VoltageAnimation from './VoltageAnimation.vue';
  
  export default {
      name: 'CraftSystem',
      components: {
          WaveAnimation,
          FireworkAnimation,
          VoltageAnimation,
      },
      props: {
          elementEmojis: {
              type: Object,
              required: true,
          },
          craftingRecipes: {
              type: Object,
              required: true,
          },
          isDarkMode: {
              type: Boolean,
              required: true,
          },
          isFireworkActive: {
              type: Boolean,
              required: true,
          },
      },
      data() {
          return {
              selected: [],
              discoveredCategories: new Set(),
              alertShown: false,
              craftingInProgress: false,
              craftedElements: [],
              draggingElementIndex: null,
          };
      },
      methods: {
          selectResource(resource) {
              if (this.selected.length < 4 && resource && this.elementEmojis[resource]) {
                  this.selected.push(resource.trim());
              } else {
                  this.$emit('show-alert', 'You can only select up to 4 elements for crafting!');
              }
          },
          resetCraftingBoard() {
              this.resetSelection();
              this.alertShown = false;
              this.craftingInProgress = false;
              this.craftedElements = [];
          },
          resetSelection() {
              this.selected = [];
          },
          removeResource(index) {
              this.selected.splice(index, 1);
          },
          removeCraftedElement(index) {
              this.craftedElements.splice(index, 1);
          },
          craftItem() {
              if (this.craftingInProgress) return;
              
              this.craftingInProgress = true;
              
              if (this.selected.length < 2) {
                  if (!this.alertShown) {
                      this.$emit('show-alert', 'Select at least 2 elements to craft!');
                      this.alertShown = true;
                  }
                  this.craftingInProgress = false;
                  return;
              }
  
              const sortedSelected = this.selected.sort().join('+');
              const craftedItem = this.craftingRecipes[sortedSelected];
  
              if (!craftedItem) {
                  this.$emit('show-alert', 'Invalid combination.');
                  this.craftingInProgress = false;
                  return;
              }
  
              const category = this.getCraftedItemCategory(craftedItem);
              if (category && !this.discoveredCategories.has(category)) {
                  this.discoveredCategories.add(category);
              }
  
              setTimeout(() => {
                  this.$emit('craft-success', craftedItem);
                  this.craftedElements.push({
                      name: craftedItem,
                      position: { top: 200, left: 50 }
                  });
                  this.selected = [];
                  this.alertShown = false;
                  this.craftingInProgress = false;
              }, 1);
          },
          handleKeyPress(event) {
              if (event.key === 'Enter') {
                  this.craftItem();
              }
          },
          getCraftedItemCategory(item) {
              for (const key in this.craftingRecipes) {
                  if (this.craftingRecipes[key] === item) {
                      return key.split('+')[0];
                  }
              }
              return null;
          },
          handleDrop(event) {
              const element = event.dataTransfer.getData('text/plain');
              if (element && this.elementEmojis[element] && !this.selected.includes(element)) {
                  this.selectResource(element);
              }
          },
          handleDropOnCraftedElement(targetElementName, event, targetIndex) {
              event.preventDefault();
              
              // Ne pas réagir si on dépose l'élément sur lui-même
              if (targetIndex === this.draggingElementIndex) return;
              
              // Si on dépose un élément créé sur un autre élément créé
              if (this.draggingElementIndex !== null) {
                  const draggedElement = this.craftedElements[this.draggingElementIndex];
                  if (draggedElement) {
                      // Simuler le craft avec les deux éléments
                      this.selected = [draggedElement.name, targetElementName];
                      this.craftItem();
                  }
              } else {
                  // Comportement existant pour les éléments de la liste de sélection
                  const element = event.dataTransfer.getData('text/plain');
                  if (element && this.elementEmojis[element]) {
                      this.selected = [element, targetElementName];
                      this.craftItem();
                  }
              }
          },
          dragStart(resource) {
              event.dataTransfer.setData('text/plain', resource);
              this.draggingElementIndex = null;
          },
          dragStartCraftedElement(index) {
              this.draggingElementIndex = index;
              event.dataTransfer.effectAllowed = 'move';
          },
          dragEndCraftedElement(index) {
              if (this.draggingElementIndex === index) {  // Seulement si c'est un déplacement
                  const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
                  const x = event.clientX - craftingBoardRect.left;
                  const y = event.clientY - craftingBoardRect.top;
                  
                  this.craftedElements[index].position = {
                      top: Math.max(0, Math.min(400, y)),
                      left: Math.max(0, Math.min(300, x))
                  };
              }
              this.draggingElementIndex = null;
          }
      },
      mounted() {
          window.addEventListener('keydown', this.handleKeyPress);
      },
      beforeUnmount() {
          window.removeEventListener('keydown', this.handleKeyPress);
      },
  };
  </script>
  
  <style scoped>
  @import "@/assets/CraftSystemStyle.css";
  
  .crafted-element {
      position: absolute;
      background: #4b5ebe;
      color: #fff;
      padding: 8px 10px;
      border-radius: 5px;
      font-size: 0.9rem;
      transition: transform 0.2s ease;
      cursor: pointer;
      z-index: 1;
  }
  
  .crafted-element:hover {
      transform: scale(1.05);
  }
  </style>