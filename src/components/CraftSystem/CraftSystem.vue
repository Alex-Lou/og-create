<template>
  <div id="crafting-board" ref="craftingBoard">
    <div class="smoke-container-crafting">
      <div class="smoke-crafting smoke1-crafting"></div>
      <div class="smoke-crafting smoke2-crafting"></div>
      <div class="smoke-crafting smoke-top-crafting"></div>
    </div>
    <div class="star-field-crafting">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
    <div class="shooting-star"></div>
    <div class="shooting-star-red"></div>

    <div class="animation-container">
      <component 
        v-if="isFireworkActive && FireworkComponent"
        :is="FireworkComponent" 
      />
      <component 
        v-if="isFireworkActive && FireworkComponent" 
        :is="FireworkComponent" 
        :delay="0.4" 
        :offsetX="50" 
      />
      <component 
        v-if="isFireworkActive && FireworkComponent" 
        :is="FireworkComponent" 
        :delay="0.9" 
        :offsetX="250" 
      />
      <component 
        v-if="isFireworkActive && FireworkComponent" 
        :is="FireworkComponent" 
        :delay="0.8" 
        :offsetX="-200" 
      />
      <component 
        v-if="isFireworkActive && FireworkComponent" 
        :is="FireworkComponent" 
        :delay="0.9" 
        :offsetX="-100" 
      />
      <component 
        v-if="isFireworkActive && FireworkComponent" 
        :is="FireworkComponent" 
        :delay="1.0" 
        :offsetX="-300" 
      />
    </div>
    <div id="crafting" @dragover.prevent @drop="handleDrop">
      <div class="title-container">
        <CreationZoneTitle />
        <div :class="{'shake-animation': isButtonShaking}">
          <CraftButton ref="craftButton" @click="craftItem" />
        </div>
      </div>
      <div id="selection">
        <ul id="selected-resources" @drop.prevent="handleDropOnSelection">
          <li
            v-for="(resource, index) in selected"
            :key="index"
            @click="removeResource(index)"
            draggable="true"
            @dragstart="dragStart($event, resource, index)"
            @dragend="dragEnd($event, index)"
            @dragover.prevent
            @drop.stop="handleDropOnSelectedElement($event, resource, index)"
            :class="['draggable-resource', { 'shake-animation': isShaking }]"
            :style="{ position: resourcePositions[index] ? 'absolute' : 'static', top: resourcePositions[index]?.top + 'px', left: resourcePositions[index]?.left + 'px' }"
          >
            {{ elementEmojis[resource] || '' }} {{ resource }}
            <span class="element-star">✧</span>
            <div class="element-corner element-corner-tl"></div>
            <div class="element-corner element-corner-tr"></div>
            <div class="element-corner element-corner-bl"></div>
            <div class="element-corner element-corner-br"></div>
          </li>
        </ul>
      </div>
      <div id="crafted-result">
        <p id="crafted-item" ref="craftedItemDisplay"></p>
      </div>
      <div
        v-for="(element, elementIndex) in craftedElements"
        :key="'crafted-' + elementIndex"
        :style="{ position: 'absolute', top: element.position.top + 'px', left: element.position.left + 'px' }"
        draggable="true"
        @dragstart="dragStartCraftedElement($event, elementIndex)"
        @dragend="dragEndCraftedElement($event, elementIndex)"
        @click="removeCraftedElement(elementIndex)"
        @dragover.prevent="debouncedDragOver"
        @dragleave="dragLeave"
        @drop.stop="handleDropOnCraftedElement(element.name, $event, elementIndex)"
        class="crafted-element"
        :data-index="elementIndex"
      >
        <p>{{ elementEmojis[element.name] || '' }} {{ element.name }}</p>
        <span class="element-star">✧</span>
        <div class="element-corner element-corner-tl"></div>
        <div class="element-corner element-corner-tr"></div>
        <div class="element-corner element-corner-bl"></div>
        <div class="element-corner element-corner-br"></div>
      </div>
    </div>
    <CleanButton @click="resetCraftingBoard" />
    <footer v-once>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import CraftButton from './CraftButton.vue';
import CleanButton from './CleanButton.vue';
import CreationZoneTitle from './CreationZoneTitle.vue';
import '@/assets/ComponentsStyle/CraftStyle/CraftSystemStyle.css';
import { findRecipe } from '@/utils/recipes';

export default {
  name: 'CraftSystem',
  components: {
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
      isShaking: false,
      isButtonShaking: false,
      lastCraftedItem: null,
      observer: null,
      debouncedDragOver: null,
      FireworkComponent: null,
    };
  },
  created() {
    this.debouncedDragOver = this.debounce(this.dragOver, 50);
  },
  methods: {
    debounce(fn, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    getResourceTransform(index) {
      if (!this.resourcePositions[index]) return '';
      return `translate(${this.resourcePositions[index].left}px, ${this.resourcePositions[index].top}px)`;
    },
    getCraftedElementTransform(position) {
      if (!position) return '';
      return `translate(${position.left}px, ${position.top}px)`;
    },
    selectResource(resource) {
      if (this.selected.length < 4 && resource) {
        this.selected.push(resource.trim());
        this.resourcePositions.push(null);
      } else {
        this.shakeButton();
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
      this.isShaking = false;
      this.isButtonShaking = false;
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
      if (this.observer) {
        const elements = document.querySelectorAll('.crafted-element');
        if (index < elements.length) {
          this.observer.unobserve(elements[index]);
        }
      }
      
      this.craftedElements.splice(index, 1);
      this.lastCraftedPosition = null;
    },
    shakeButton() {
      this.isButtonShaking = true;
      setTimeout(() => {
        this.isButtonShaking = false;
      }, 500);
    },
    craftItem() {
      if (this.craftingInProgress) return;
      this.craftingInProgress = true;
      
      if (this.selected.length < 2) {
        this.shakeButton();
        this.craftingInProgress = false;
        return;
      }
      
      const craftedItem = findRecipe(this.craftingRecipes, this.selected);
      
      if (!craftedItem) {
        this.$emit('show-alert', 'Rien ne se passe… Essayez une autre combinaison.');
        const selectedElements = document.querySelectorAll('#selected-resources li');
        selectedElements.forEach(el => {
          el.classList.add('shake-animation');
          setTimeout(() => {
            el.classList.remove('shake-animation');
          }, 500);
        });
        this.craftingInProgress = false;
        return;
      }
      
      const category = this.getCraftedItemCategory(craftedItem);
      if (category && !this.discoveredCategories.has(category)) {
        this.discoveredCategories.add(category);
        this.$emit('category-discovered', category);
      }
      
      this.lastCraftedItem = craftedItem;
      
      this.$nextTick(() => {
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
        
        const newElement = {
          name: craftedItem,
          position: newPosition,
          moved: false,
        };
        
        this.craftedElements.push(newElement);
        this.lastCraftedPosition = newPosition;
        
        this.$nextTick(() => {
          if (this.observer) {
            const elements = document.querySelectorAll('.crafted-element');
            if (elements.length > 0) {
              const newElementNode = elements[elements.length - 1];
              if (newElementNode) {
                this.observer.observe(newElementNode);
              }
            }
          }
        });
        
        this.selected = [];
        this.resourcePositions = [];
        this.alertShown = false;
        this.craftingInProgress = false;
      });
    },
    handleKeyPress(event) {
      // Pas de raccourci pendant la saisie, sur un bouton focus, ou avec modificateur
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target.closest?.('input, textarea, select, button, [contenteditable="true"]')) return;
      if (event.key === 'Enter') {
        this.craftItem();
      }
      if (event.key === 'r' || event.key === 'c') {
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
      
      if (this.isDraggingCrafted) {
        const index = this.draggingElementIndex;
        if (index !== null && this.craftedElements[index]) {
          const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
          
          const offsetX = this.craftedElements[index].dragOffset?.x || 0;
          const offsetY = this.craftedElements[index].dragOffset?.y || 0;
          
          const x = event.clientX - craftingBoardRect.left - offsetX;
          const y = event.clientY - craftingBoardRect.top - offsetY;
          
          this.craftedElements[index].position = {
            top: Math.max(0, Math.min(600, y)),
            left: Math.max(0, Math.min(800, x)),
          };
          this.craftedElements[index].moved = true;
        }
      } 
      else if (element && this.elementEmojis[element]) {
        if (this.selected.includes(element)) {
          const index = this.selected.indexOf(element);
          this.selected.splice(index, 1);
          this.resourcePositions.splice(index, 1);
          this.selectResource(element);
        } else if (!this.selected.includes(element)) {
          this.selectResource(element);
          if (this.draggingElementIndex !== null && this.isDraggingCrafted) {
            this.removeCraftedElement(this.draggingElementIndex);
          }
        }
      }
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      
      document.body.classList.remove('dragging-in-progress');
    },
    handleDropOnSelectedElement(event, targetResource, targetIndex) {
      event.preventDefault();
      const draggedResource = event.dataTransfer.getData('text/plain');
      const isFromCraftedElements = this.craftedElements.some(el => el.name === draggedResource);
      
      if (isFromCraftedElements) {
        return;
      }
      
      if (this.draggingElementIndex !== targetIndex) {
        const result = findRecipe(this.craftingRecipes, [draggedResource, targetResource]);
        
        if (result) {
          this.removeResource(Math.max(this.draggingElementIndex, targetIndex));
          this.removeResource(Math.min(this.draggingElementIndex, targetIndex));
          this.lastCraftedItem = result;
          
          this.$nextTick(() => {
            this.$emit('craft-success', result);
            
            let newPosition = {
              top: this.resourcePositions[targetIndex]?.top || 300,
              left: this.resourcePositions[targetIndex]?.left || 230
            };
            
            const newElement = {
              name: result,
              position: newPosition,
              moved: false,
            };
            
            this.craftedElements.push(newElement);
            
            this.$nextTick(() => {
              if (this.observer) {
                const elements = document.querySelectorAll('.crafted-element');
                if (elements.length > 0) {
                  const newElementNode = elements[elements.length - 1];
                  if (newElementNode) {
                    this.observer.observe(newElementNode);
                  }
                }
              }
            });
          });
        } else {
          this.isShaking = true;
          setTimeout(() => {
            this.isShaking = false;
          }, 400);
        }
      }
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      
      document.body.classList.remove('dragging-in-progress');
    },
    handleDropOnCraftedElement(targetElement, event, targetIndex) {
      event.preventDefault();
      const draggedElement = event.dataTransfer.getData('text/plain');
      const isFromSelected = this.selected.includes(draggedElement);
      
      if (isFromSelected) {
        return;
      }
      
      const result = findRecipe(this.craftingRecipes, [draggedElement, targetElement]);
      
      if (result) {
        if (this.draggingElementIndex !== null) {
          this.craftedElements.splice(this.draggingElementIndex, 1);
        }
        
        this.craftedElements.splice(targetIndex, 1);
        
        const dropPosition = {
          top: event.offsetY,
          left: event.offsetX,
        };
        
        const newElement = {
          name: result,
          position: dropPosition,
          moved: true,
        };
        
        this.craftedElements.push(newElement);
        this.lastCraftedItem = result;
        
        this.$emit('craft-success', result);
        
        this.$nextTick(() => {
          if (this.observer) {
            const elements = document.querySelectorAll('.crafted-element');
            if (elements.length > 0) {
              const newElementNode = elements[elements.length - 1];
              if (newElementNode) {
                this.observer.observe(newElementNode);
              }
            }
          }
        });
      } else {
        this.isShaking = true;
        setTimeout(() => {
          this.isShaking = false;
        }, 400);
      }
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      
      document.body.classList.remove('dragging-in-progress');
    },
    dragStart(event, resource, index) {
      document.body.classList.add('dragging-in-progress');
      
      const element = event.target;
      
      const rect = element.getBoundingClientRect();
      const ghostElement = element.cloneNode(true);
      
      ghostElement.style.opacity = '0.6';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '0';
      ghostElement.style.left = '0';
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.pointerEvents = 'none';
      
      document.body.appendChild(ghostElement);
      
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      event.dataTransfer.setDragImage(ghostElement, offsetX, offsetY);
      
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
      
      if (!this.resourcePositions[index]) {
        this.resourcePositions[index] = {};
      }
      this.resourcePositions[index].dragOffset = {
        x: offsetX,
        y: offsetY
      };
      
      element.classList.add('dragging');
      
      event.dataTransfer.setData('text/plain', resource);
      event.dataTransfer.effectAllowed = 'move';
      
      this.draggingElementIndex = index;
      this.isDraggingSelected = true;
    },
    dragStartCraftedElement(event, index) {
      document.body.classList.add('dragging-in-progress');
      
      const element = event.target;
      
      const rect = element.getBoundingClientRect();
      const ghostElement = element.cloneNode(true);
      
      ghostElement.style.opacity = '0.6';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '0';
      ghostElement.style.left = '0';
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.pointerEvents = 'none';
      
      document.body.appendChild(ghostElement);
      
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      event.dataTransfer.setDragImage(ghostElement, offsetX, offsetY);
      
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
      
      this.craftedElements[index] = {
        ...this.craftedElements[index],
        dragOffset: {
          x: offsetX,
          y: offsetY
        }
      };
      
      event.dataTransfer.setData('text/plain', this.craftedElements[index].name);
      event.dataTransfer.effectAllowed = 'move';
      
      element.classList.add('dragging');
      
      this.draggingElementIndex = index;
      this.isDraggingCrafted = true;
    },
    dragEnd(event, index) {
      const draggedElement = event.target;
      if (draggedElement && draggedElement.classList.contains('dragging')) {
        draggedElement.classList.remove('dragging');
      }
      
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
        
        const offsetX = this.resourcePositions[index]?.dragOffset?.x || 0;
        const offsetY = this.resourcePositions[index]?.dragOffset?.y || 0;
        
        const x = event.clientX - craftingBoardRect.left - offsetX;
        const y = event.clientY - craftingBoardRect.top - offsetY;
        
        this.resourcePositions[index] = {
          top: Math.max(0, Math.min(600, y)),
          left: Math.max(0, Math.min(800, x)),
          dragOffset: {
            x: offsetX,
            y: offsetY
          }
        };
      }
      
      this.applyDropAnimation(index, true);
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      
      document.body.classList.remove('dragging-in-progress');
    },
    dragEndCraftedElement(event, index) {
      const draggedElement = event.target;
      if (draggedElement && draggedElement.classList.contains('dragging')) {
        draggedElement.classList.remove('dragging');
      }
      
      if (this.craftedElements[index]) {
        const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
        
        const offsetX = this.craftedElements[index].dragOffset?.x || 0;
        const offsetY = this.craftedElements[index].dragOffset?.y || 0;
        
        const x = event.clientX - craftingBoardRect.left - offsetX;
        const y = event.clientY - craftingBoardRect.top - offsetY;
        
        const selectionZone = document.getElementById('selected-resources');
        const selectionRect = selectionZone?.getBoundingClientRect();
        const margin = 50;
        
        const isInSelectionZone = selectionRect && 
          event.clientX >= selectionRect.left - margin &&
          event.clientX <= selectionRect.right + margin &&
          event.clientY >= selectionRect.top - margin &&
          event.clientY <= selectionRect.bottom + margin;
        
        if (!isInSelectionZone) {
          this.craftedElements[index].position = {
            top: Math.max(0, Math.min(600, y)),
            left: Math.max(0, Math.min(800, x)),
          };
          this.craftedElements[index].moved = true;
        }
        
        const newElement = { ...this.craftedElements[index] };
        delete newElement.dragOffset;
        this.craftedElements[index] = newElement;
      }
      
      this.applyDropAnimation(index);
      
      this.draggingElementIndex = null;
      this.isDraggingSelected = false;
      this.isDraggingCrafted = false;
      
      document.body.classList.remove('dragging-in-progress');
    },
    handleDropOnSelection(event) {
      if (this.isDraggingCrafted) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },
    applyDropAnimation(index, isSelectedElement = false) {
      this.$nextTick(() => {
        let element;
        
        if (isSelectedElement) {
          const selectedElements = document.querySelectorAll('#selected-resources li');
          if (index < selectedElements.length) {
            element = selectedElements[index];
          }
        } else {
          const craftedElements = document.querySelectorAll('.crafted-element');
          if (index < craftedElements.length) {
            element = craftedElements[index];
          }
        }
        
        if (element) {
          element.classList.add('drop-animation');
          
          setTimeout(() => {
            element.classList.remove('drop-animation');
          }, 300);
        }
      });
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
    },
    setupIntersectionObserver() {
      if ('IntersectionObserver' in window) {
        const options = {
          root: this.$refs.craftingBoard,
          rootMargin: '100px',
          threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const index = entry.target.getAttribute('data-index');
            if (index) {
              if (entry.isIntersecting) {
                entry.target.classList.remove('paused-animations');
              } else {
                entry.target.classList.add('paused-animations');
              }
            }
          });
        }, options);
        
        this.$nextTick(() => {
          document.querySelectorAll('.crafted-element').forEach((el, idx) => {
            el.setAttribute('data-index', idx);
            this.observer.observe(el);
          });
        });
      }
    },
    async loadFireworkComponent() {
      try {
        const module = await import('./FireWorkAnimation.vue');
        this.FireworkComponent = module.default;
      } catch (error) {
        console.error("Failed to load FireworkAnimation component:", error);
      }
    }
  },
  async mounted() {
    // Charger le composant FireworkAnimation
    await this.loadFireworkComponent();
    
    window.addEventListener('keydown', this.handleKeyPress);
    
    const style = document.createElement('style');
    style.innerHTML = `
      .dragging-in-progress .smoke-crafting,
      .dragging-in-progress .star,
      .dragging-in-progress .shooting-star,
      .dragging-in-progress .shooting-star-red,
      .paused-animations {
        animation-play-state: paused !important;
      }
      
      .crafted-element, #selected-resources li {
        will-change: opacity;
        contain: style paint;
      }
    `;
    document.head.appendChild(style);
    
    this.setupIntersectionObserver();

  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
};
</script>