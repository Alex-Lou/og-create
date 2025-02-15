<template>
  <div id="crafting-board" ref="craftingBoard">
    <WaveAnimation />
    <div class="animation-container">
      <template v-if="isFireworkActive">
        <FireworkAnimation />
        <FireworkAnimation :delay="0.4" :offsetX="50" />
        <FireworkAnimation :delay="0.9" :offsetX="250" />
        <FireworkAnimation :delay="0.8" :offsetX="-200" />
        <FireworkAnimation :delay="0.9" :offsetX="-100" />
        <FireworkAnimation :delay="1.0" :offsetX="-300" />
      </template>
    </div>
    <div id="crafting" @dragover.prevent @drop="handleDrop">
      <div class="title-container">
  <CreationZoneTitle />
  <CraftButton @click="craftItem" />
</div>
      <div id="selection">
        <ul id="selected-resources">
          <li
            v-for="(resource, index) in selected"
            :key="index"
            @click="removeResource(index)"
            draggable="true"
            @dragstart="dragStart($event, resource, index)"
            @dragend="dragEnd($event, index)"
            @dragover.prevent
            @drop.stop="handleDropOnSelectedElement($event, resource, index)"
            :style="{ position: resourcePositions[index] ? 'absolute' : 'static', top: resourcePositions[index]?.top + 'px', left: resourcePositions[index]?.left + 'px' }"
            class="draggable-resource"
          >
            {{ elementEmojis[resource] || '' }} {{ resource }}
          </li>
        </ul>
      </div>
      <div id="crafted-result">
        <p id="crafted-item" ref="craftedItemDisplay"></p>
      </div>
      <div
        v-for="(element, elementIndex) in craftedElements"
        :key="'crafted-' + elementIndex"
        :style="{ top: element.position.top + 'px', left: element.position.left + 'px' }"
        draggable="true"
        @dragstart="dragStartCraftedElement($event, elementIndex)"
        @dragend="dragEndCraftedElement($event, elementIndex)"
        @click="removeCraftedElement(elementIndex)"
        @dragover.prevent
        @drop.stop="handleDropOnCraftedElement(element.name, $event, elementIndex)"
        class="crafted-element"
      >
        <p>{{ elementEmojis[element.name] || '' }} {{ element.name }}</p>
      </div>
    </div>
    <CleanButton @click="resetCraftingBoard" />
    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import WaveAnimation from './WaveAnimation.vue';
import FireworkAnimation from './FireWorkAnimation.vue';
import CraftButton from './CraftButton.vue';
import CleanButton from './CleanButton.vue';
import CreationZoneTitle from './CreationZoneTitle.vue';

export default {
  name: 'CraftSystem',
  components: {
    WaveAnimation,
    FireworkAnimation,
    CraftButton,
    CleanButton,
    CreationZoneTitle,
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
      resourcePositions: [],
      lastCraftedPosition: null,
      isDraggingSelected: false,
      isDraggingCrafted: false,
    };
  },
  methods: {
    selectResource(resource) {
      if (this.selected.length < 4 && resource && this.elementEmojis[resource]) {
        this.selected.push(resource.trim());
        this.resourcePositions.push(null);
      } else {
        this.$emit('show-alert', 'You can only select up to 4 elements for crafting!');
      }
    },
    resetCraftingBoard() {
      this.resetSelection();
      this.alertShown = false;
      this.craftingInProgress = false;
      this.craftedElements = [];
      this.resourcePositions = [];
      this.lastCraftedPosition = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      this.$emit('board-reset');
    },
    resetSelection() {
      this.selected = [];
    },
    removeResource(index) {
      this.selected.splice(index, 1);
      this.resourcePositions.splice(index, 1);
    },
    removeCraftedElement(index) {
      this.craftedElements.splice(index, 1);
      this.lastCraftedPosition = null;
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
        
        let newPosition = { top: 300, left: 230 };
        
        if (this.lastCraftedPosition && !this.lastCraftedPosition.moved) {
          newPosition = {
            top: this.lastCraftedPosition.top,
            left: this.lastCraftedPosition.left + 200
          };
          
          if (newPosition.left > 800) {
            newPosition = {
              top: this.lastCraftedPosition.top + 100,
              left: 230
            };
          }
        }

        this.craftedElements.push({
          name: craftedItem,
          position: newPosition,
          moved: false,
        });

        this.lastCraftedPosition = newPosition;
        this.selected = [];
        this.resourcePositions = [];
        this.alertShown = false;
        this.craftingInProgress = false;
      }, 1);
    },
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.craftItem();
      }
      if (event.key === 'r') {
        this.resetCraftingBoard();
      }
      // Ajout de la touche 'c' pour nettoyer
      if (event.key === 'c') {
        this.resetCraftingBoard();
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
      if (element && this.elementEmojis[element]) {
        // Si c'est un élément qui était déjà dans la liste
        if (this.selected.includes(element)) {
          const index = this.selected.indexOf(element);
          this.selected.splice(index, 1);
          this.resourcePositions.splice(index, 1);
          this.selectResource(element);
        }
        // Si c'est un nouvel élément (crafté ou de l'inventaire)
        else if (!this.selected.includes(element)) {
          this.selectResource(element);
          if (this.draggingElementIndex !== null) {
            this.removeCraftedElement(this.draggingElementIndex);
          }
        }
      }
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
    },
    handleDropOnSelectedElement(event, targetResource, targetIndex) {
      event.preventDefault();
      const draggedResource = event.dataTransfer.getData('text/plain');
      
      // Vérifie si l'élément draggé vient des éléments craftés
      const isFromCraftedElements = this.craftedElements.some(el => el.name === draggedResource);
      
      // Si l'élément vient des craftedElements, on ignore le drop
      if (isFromCraftedElements) {
        return;
      }
      
      // Si on ne drop pas le même élément sur lui-même
      if (this.draggingElementIndex !== targetIndex) {
        const elements = [draggedResource, targetResource].sort();
        const combination = elements.join('+');
        
        const result = this.craftingRecipes[combination];
        
        if (result) {
          this.removeResource(Math.max(this.draggingElementIndex, targetIndex));
          this.removeResource(Math.min(this.draggingElementIndex, targetIndex));
          
          setTimeout(() => {
            this.$emit('craft-success', result);
            
            let newPosition = { 
              top: this.resourcePositions[targetIndex]?.top || 300,
              left: this.resourcePositions[targetIndex]?.left || 230
            };
            
            this.craftedElements.push({
              name: result,
              position: newPosition,
              moved: false,
            });
          }, 1);
        }
      }
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
    },
    handleDropOnCraftedElement(targetElement, event, targetIndex) {
      event.preventDefault();
      const draggedElement = event.dataTransfer.getData('text/plain');
      
      // Vérifie si l'élément draggé vient de la liste selected
      const isFromSelected = this.selected.includes(draggedElement);
      
      // Si l'élément vient de selected, on ignore le drop
      if (isFromSelected) {
        return;
      }
      
      // Logique existante pour la fusion des éléments craftés
      const elements = [draggedElement, targetElement].sort();
      const combination = elements.join('+');
      
      const result = this.craftingRecipes[combination];
      
      if (result) {
        // Supprimer l'élément source
        if (this.draggingElementIndex !== null) {
          this.craftedElements.splice(this.draggingElementIndex, 1);
        }
        
        // Supprimer l'élément cible
        this.craftedElements.splice(targetIndex, 1);
        
        // Créer le nouvel élément
        const dropPosition = {
          top: event.offsetY,
          left: event.offsetX,
        };
        
        this.craftedElements.push({
          name: result,
          position: dropPosition,
          moved: true,
        });
        
        this.$emit('craft-success', result);
      }
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
    },
    dragStart(event, resource, index) {
      event.dataTransfer.setData('text/plain', resource);
      this.draggingElementIndex = index;
      this.isDraggingSelected = true;
    },
    dragStartCraftedElement(event, index) {
      event.dataTransfer.setData('text/plain', this.craftedElements[index].name);
      this.draggingElementIndex = index;
      this.isDraggingCrafted = true;
    },
    dragEnd(event, index) {
      const selectionZone = document.getElementById('selected-resources');
      const selectionRect = selectionZone.getBoundingClientRect();
      const margin = 50;

      if (
        event.clientX >= selectionRect.left - margin &&
        event.clientX <= selectionRect.right + margin &&
        event.clientY >= selectionRect.top - margin &&
        event.clientY <= selectionRect.bottom + margin
      ) {
        this.resourcePositions[index] = null;
      } else {
        const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
        const x = event.clientX - craftingBoardRect.left;
        const y = event.clientY - craftingBoardRect.top;
        
        this.resourcePositions[index] = {
          top: Math.max(0, Math.min(600, y)),
          left: Math.max(0, Math.min(800, x)),
        };
      }
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
    },
    dragEndCraftedElement(event, index) {
      if (this.craftedElements[index]) {
        const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
        const x = event.clientX - craftingBoardRect.left;
        const y = event.clientY - craftingBoardRect.top;

        this.craftedElements[index].position = {
          top: Math.max(0, Math.min(600, y)),
          left: Math.max(0, Math.min(800, x)),
        };
        this.craftedElements[index].moved = true;
      }
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
    },
    dragOver(event) {
      const target = event.target.closest('.crafted-element');
      if (target && this.isDraggingSelected) {
        target.classList.add('no-drop');
      }
    },
    dragLeave(event) {
      const target = event.target.closest('.crafted-element');
      if (target) {
        target.classList.remove('no-drop');
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }
};
</script>

<style scoped>
@import '@/assets/CraftSystemStyle.css';
</style>  