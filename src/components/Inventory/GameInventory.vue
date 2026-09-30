<template>
  <div id="inventory" class="inventory-container">
    <!-- Structure du cadre ornemental -->
    <div class="inventory-frame">
      <!-- Coins ornementaux -->
      <div class="frame-corner corner-tl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tl">✧</div>
      </div>
      <div class="frame-corner corner-tr">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tr">✧</div>
      </div>
      <div class="frame-corner corner-bl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-bl">✧</div>
      </div>
      <div class="frame-corner corner-br">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-br">✧</div>
      </div>
      
      <!-- Ligne de séparation pour le titre -->
      <div class="title-separator"></div>
    </div>
    
    <!-- Effets visuels d'arrière-plan -->
    <div class="smoke-container">
      <div class="smoke smoke1"></div>
      <div class="smoke smoke2"></div>
      <div class="smoke smoke-top"></div>
    </div>

    <div class="star-field">
      <div v-for="n in 15" :key="`star-${n}`" class="star"></div>
    </div>

    <h2>Inventory</h2>
    
    <!-- Catégories d'éléments -->
    <div 
      v-for="category in filteredCategories" 
      :key="category.name"
      class="category"
      :class="{ 'timer-category': isTimerMode }"
    >
      <div class="category-header" @click="toggleCategory(category.name)">
        <span class="category-title">{{ category.name }}</span>
        <div class="progress">
          <div class="progress-value" :style="{ width: category.progress + '%' }"></div>
          <div class="progress-bar-fill" :style="{ width: category.progress + '%' }">
            <template v-for="n in Math.min(4, Math.floor(category.progress / 10))" :key="`particle-group-${n}`">
              <div :class="`particle particle-${n * 10}`"></div>
            </template>
          </div>
        </div>
      </div>
      <div 
        class="category-content"
        :style="{ 
          maxHeight: collapsed[category.name] ? '0' : '1000px',
          overflow: 'auto',
          transition: 'max-height 0.5s ease-in-out'
        }"
      >
        <div 
          v-if="category.elements.length === 0" 
          class="empty-category"
        >
          Aucun élément disponible
        </div>
        <div
          v-for="element in category.elements"
          :key="`element-${element}`"
          class="inventory-item"
          role="button"
          tabindex="0"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @click="selectElement(element)"
          @keydown.enter.prevent="selectElement(element)"
        >
          {{ getElementEmoji(element) }} {{ element }}
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import '@/assets/ComponentsStyle/InventoryStyle/GameInventoryStyle.css';
import { BASE_CATEGORY } from '@/utils/gameConstants';

// Inventaire : affiche les éléments découverts par catégorie (aucun état métier ici)
export default {
  name: 'GameInventory',
  props: {
    categories: { type: Object, required: true },
    discoveredCategories: { type: Array, required: true },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isTimerMode: { type: Boolean, default: false }
  },
  emits: ['selectResource'],
  data() {
    return {
      // Catégories repliées par l'utilisateur (dépliées par défaut)
      collapsed: {}
    };
  },
  computed: {
    filteredCategories() {
      // En Timer, l'inventaire de la question (éléments de départ + créations) forme une seule catégorie
      if (this.isTimerMode) {
        return [{ name: 'Éléments du défi', progress: 100, elements: this.discoveredElements }];
      }
      // Une catégorie s'affiche dès qu'un de ses éléments est découvert
      // (déduit des éléments : une liste de catégories sauvegardée incomplète ne cache plus rien)
      const discovered = new Set(this.discoveredElements);
      return Object.entries(this.categories)
        .map(([name, elements]) => {
          const found = elements.filter(element => discovered.has(element));
          return {
            key: name,
            name: name.replace(/_/g, ' '),
            progress: elements.length ? (found.length / elements.length) * 100 : 0,
            elements: found
          };
        })
        .filter(category => category.key === BASE_CATEGORY || category.elements.length > 0);
    }
  },
  methods: {
    toggleCategory(name) {
      this.collapsed = { ...this.collapsed, [name]: !this.collapsed[name] };
    },
    getElementEmoji(element) {
      return this.elementEmojis[element] || '❓';
    },
    startDrag(event, element) {
      event.dataTransfer.setData('text/plain', element);
    },
    selectElement(element) {
      this.$emit('selectResource', element);
    }
  }
};
</script>