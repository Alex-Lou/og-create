<template>
  <div class="explorer-craft-modal" v-if="isVisible">
    <div class="modal-content">
      <!-- Zone supérieure avec l'objectif du défi -->
      <div class="challenge-info">
        <div class="npc-image-container">
          <!-- Placeholder pour l'image du NPC si vous n'avez pas les assets -->
          <div class="npc-placeholder">🧙‍♂️</div>
        </div>
        <div class="challenge-objective">
          <h2>{{ region.name }} - Défi</h2>
          <p>
            Objectif: Créer 
            <span v-for="(element, idx) in challenge.requiredElements" :key="element" class="target-element">
              {{ idx > 0 ? ' et ' : '' }}{{ element }}
            </span>
          </p>
          <div class="hint-container" v-if="showHint">
            <p class="hint-text">{{ challenge.unlockHint }}</p>
          </div>
          <button @click="toggleHint" class="hint-button">
            {{ showHint ? 'Masquer l\'indice' : 'Afficher l\'indice' }}
          </button>
        </div>
        <div class="close-button" @click="closeModal">
          <span>&times;</span>
        </div>
      </div>

      <!-- Zone principale de craft -->
      <div class="craft-area">
        <!-- Zone de sélection des éléments -->
        <div class="elements-selection">
          <h3>Éléments disponibles</h3>
          <div class="elements-grid">
            <div 
              v-for="element in availableElements" 
              :key="element"
              class="element-card"
              draggable="true"
              @dragstart="startDrag($event, element)"
              @click="selectElement(element)"
            >
              <div class="element-icon">
                <span>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
        </div>

        <!-- Zone de craft avec l'image de fond -->
        <div class="crafting-workspace" @dragover.prevent @drop="handleDrop">
          <h3>Zone de fusion</h3>
          <div class="selected-elements">
            <div 
              v-for="(element, index) in selectedElements" 
              :key="index"
              class="selected-element"
              draggable="true"
              @dragstart="startDragSelected($event, element, index)"
              @click="removeSelectedElement(index)"
              :class="{ 'shake-animation': isShaking && index < selectedElements.length }"
            >
              <div class="element-icon">
                <span>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
          <button @click="craftElements" class="craft-button" :disabled="selectedElements.length < 2">
            Fusionner
          </button>
        </div>

        <!-- Zone des éléments créés -->
        <div class="crafted-elements">
          <h3>Éléments créés</h3>
          <div class="crafted-grid">
            <div 
              v-for="(element, index) in craftedElements" 
              :key="index"
              class="crafted-element"
              draggable="true"
              @dragstart="startDragCrafted($event, element)"
              @click="selectCraftedElement(element)"
            >
              <div class="element-icon">
                <span>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
              <div class="glow-effect" v-if="isTargetElement(element)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone inférieure avec les actions -->
      <div class="action-buttons">
        <button @click="resetCrafting" class="reset-button">
          Tout nettoyer
        </button>
        <button 
          @click="completeChallenge" 
          class="complete-button"
          :disabled="!isChallengeSolved"
        >
          Valider le défi
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExplorerCraftModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    region: {
      type: Object,
      required: true
    },
    challenge: {
      type: Object,
      required: true
    },
    craftingRecipes: {
      type: Object,
      required: true
    },
    elementEmojis: {
      type: Object,
      required: true
    },
    discoveredElements: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showHint: false,
      selectedElements: [],
      craftedElements: [],
      draggingIndex: null,
      isShaking: false,
      // Pour suivre les éléments déjà affichés
      hasBeenDisplayed: {}
    };
  },
  computed: {
    availableElements() {
      // Donne accès aux éléments de base + ceux déjà découverts appropriés pour ce défi
      const baseElements = ['Eau', 'Feu', 'Terre', 'Air'];
      return [...new Set([...baseElements, ...this.discoveredElements.filter(e => 
        !this.challenge.requiredElements.includes(e)
      )])];
    },
    isChallengeSolved() {
      // Vérifie si tous les éléments requis ont été créés
      return this.challenge.requiredElements.every(element => 
        this.craftedElements.includes(element)
      );
    }
  },
  methods: {
    toggleHint() {
      this.showHint = !this.showHint;
    },
    closeModal() {
      this.$emit('close');
    },
    selectElement(element) {
      if (this.selectedElements.length < 4) {
        this.selectedElements.push(element);
      } else {
        this.$emit('show-alert', 'Vous ne pouvez sélectionner que 4 éléments maximum !');
      }
    },
    removeSelectedElement(index) {
      this.selectedElements.splice(index, 1);
    },
    startDrag(event, element) {
      event.dataTransfer.setData('text/plain', element);
    },
    startDragSelected(event, element, index) {
      event.dataTransfer.setData('text/plain', element);
      this.draggingIndex = index;
    },
    startDragCrafted(event, element) {
      event.dataTransfer.setData('text/plain', element);
    },
    handleDrop(event) {
      const element = event.dataTransfer.getData('text/plain');
      if (element) {
        if (!this.selectedElements.includes(element) && this.selectedElements.length < 4) {
          this.selectedElements.push(element);
        }
      }
    },
    craftElements() {
      if (this.selectedElements.length < 2) {
        this.$emit('show-alert', 'Sélectionnez au moins 2 éléments pour la fusion!');
        return;
      }
  
      const sortedSelected = [...this.selectedElements].sort().join('+');
      const craftedItem = this.craftingRecipes[sortedSelected];
  
      if (!craftedItem) {
        // Animation d'échec
        this.isShaking = true;
        setTimeout(() => {
          this.isShaking = false;
        }, 500);
        return;
      }
  
      if (!this.craftedElements.includes(craftedItem)) {
        this.craftedElements.push(craftedItem);
      }
  
      this.$emit('craft-success', craftedItem);
  
      if (this.isTargetElement(craftedItem)) {
        this.$emit('target-element-created', craftedItem);
      }
  
      this.selectedElements = [];
    },
    selectCraftedElement(element) {
      if (this.selectedElements.length < 4) {
        this.selectedElements.push(element);
      } else {
        this.$emit('show-alert', 'Vous ne pouvez sélectionner que 4 éléments maximum !');
      }
    },
    resetCrafting() {
      this.selectedElements = [];
      this.craftedElements = [];
    },
    completeChallenge() {
      if (this.isChallengeSolved) {
        this.$emit('challenge-completed', { region: this.region });
      }
    },
    isTargetElement(element) {
      return this.challenge.requiredElements.includes(element);
    }
  }
};
</script>

<style scoped>
.explorer-craft-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2c3e50;
  width: 90%;
  max-width: 1200px;
  height: 90%;
  max-height: 800px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 2px solid #3498db;
}

.challenge-info {
  display: flex;
  background-color: #34495e;
  padding: 20px;
  border-bottom: 2px solid #3498db;
  position: relative;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.npc-image-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  border: 2px solid #f39c12;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3e50;
}

.npc-placeholder {
  font-size: 40px;
}

.challenge-objective {
  flex: 1;
}

.challenge-objective h2 {
  margin: 0 0 10px 0;
  color: #ecf0f1;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.challenge-objective p {
  margin: 0;
  color: #bdc3c7;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.target-element {
  font-weight: bold;
  color: #f39c12;
}

.hint-container {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(243, 156, 18, 0.2);
  border-radius: 5px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.hint-text {
  color: #f39c12;
  font-style: italic;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.hint-button {
  background-color: transparent;
  color: #3498db;
  border: none;
  cursor: pointer;
  padding: 5px 0;
  margin-top: 5px;
  font-size: 14px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #ecf0f1;
  font-size: 24px;
  cursor: pointer;
}

.craft-area {
  display: flex;
  flex: 1;
  overflow: hidden;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.elements-selection,
.crafting-workspace,
.crafted-elements {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.elements-selection {
  background-color: #2c3e50;
  border-right: 1px solid #3498db;
}

/* Zone de fusion avec le background gif */
.crafting-workspace {
  background-image: url('@/assets/explorer-background/forrest-bg.gif');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  /* On conserve l'espacement existant */
  padding: 15px;
}

.crafted-elements {
  background-color: #2c3e50;
  border-left: 1px solid #3498db;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #ecf0f1;
  text-align: center;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.elements-grid,
.crafted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  overflow-y: auto;
  padding: 10px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.element-card,
.selected-element,
.crafted-element {
  background-color: #34495e;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.element-card:hover,
.selected-element:hover,
.crafted-element:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.element-icon {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 30px;
}

.element-name {
  color: #ecf0f1;
  text-align: center;
  font-size: 14px;
  margin-top: -15px;
}

.selected-elements {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 230px;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 10px;
  padding: 15px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
}

.selected-element {
  width: 100px;
  position: relative;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
  height: 70px;
}


.reset-button,
.complete-button {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

.craft-button {
  background-color: #3498db;
  color: white;
  align-self: center;
  border-radius: 5px;
  font-weight: bold;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  cursor: pointer;
  margin-top: 75px;
  transition: background-color 0.3s ease;
  padding: 4px 10px;
  border: none;
}

.craft-button:hover {
  background-color: #2980b9;
}

.craft-button:disabled {
  background-color: #0952577b;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #34495e;
  border-top: 2px solid #3498db;
}

.reset-button {
  background-color: #e74c3c;
  color: white;
}

.reset-button:hover {
  background-color: #c0392b;
}

.complete-button {
  background-color: #2ecc71;
  color: white;
}

.complete-button:hover {
  background-color: #27ae60;
}

.complete-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  box-shadow: 0 0 15px #f39c12, 0 0 25px #f39c12;
  opacity: 0.7;
  animation: glow 1.5s infinite alternate;
  pointer-events: none;
}

@keyframes glow {
  from { opacity: 0.5; }
  to { opacity: 0.8; }
}
</style>
