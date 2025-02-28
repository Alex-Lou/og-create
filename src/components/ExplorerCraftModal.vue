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
                <!-- Afficher les GIFs personnalisés pour les éléments définis dans elementsWithGifs -->
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element"/>
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
        </div>

        <div class="crafting-workspace"
          :style="{ backgroundImage: `url(${require(`@/assets/explorer-background/${challenge.background}`)})` }"
          @dragover.prevent @drop="handleDrop">
          <h3>Zone de fusion</h3>
          
          <!-- Composant BossFight - uniquement affiché si c'est un défi de boss -->
          <BossFight 
            v-if="isBossChallenge" 
            :boss="challenge" 
            :craftedElements="craftedElements"
            ref="bossFight"
            @boss-defeated="handleBossDefeated"
          />

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
                <!-- Afficher les GIFs personnalisés pour les éléments définis dans elementsWithGifs -->
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element"/>
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
          <button @click="craftElements" class="craft-button-explorer" :disabled="selectedElements.length < 2">
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
              class="crafted-element-explorer"
              draggable="true"
              @dragstart="startDragCrafted($event, element)"
              @click="selectCraftedElement(element)"
            >
              <div class="element-icon">
                <!-- Afficher les GIFs personnalisés pour les éléments définis dans elementsWithGifs -->
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element"/>
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
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
import BossFight from '@/components/BossFight.vue';
import '@/assets/ExplorerCraftStyle.css';

export default {
  name: 'ExplorerCraftModal',
  components: {
    BossFight
  },
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
      hasBeenDisplayed: {}
    };
  },
  computed: {
    availableElements() {
      // Si le challenge spécifie des éléments disponibles, utiliser ceux-là
      if (this.challenge.availableElements && this.challenge.availableElements.length > 0) {
        return this.challenge.availableElements;
      }
      
      // Sinon, utiliser la logique précédente
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
    },
    isBossChallenge() {
      // Vérifier s'il s'agit d'un défi de boss
      return this.challenge.bossImage && this.challenge.maxHealth;
    }
  },
  mounted() {
    // Activer le débogage des recettes
    this.debugRecipes();
  },
  methods: {
    // Méthode de débogage des recettes
    debugRecipes() {
      console.log("=== DEBUG RECETTES ===");
      console.log("Éléments disponibles:", this.availableElements);
      console.log("Éléments requis:", this.challenge.requiredElements);
      console.log("Éléments de dégâts:", this.challenge.damagePerElement);
      
      // Afficher toutes les recettes disponibles
      console.log("Toutes les recettes disponibles:", this.craftingRecipes);
      
      // Tester si on peut créer les éléments requis
      this.challenge.requiredElements.forEach(element => {
        console.log(`Recherche de recettes pour créer: ${element}`);
        
        // Chercher toutes les recettes qui produisent cet élément
        const recipes = Object.entries(this.craftingRecipes)
          .filter(([, result]) => result === element)
          .map(([ingredients]) => ingredients);
        
        if (recipes.length > 0) {
          console.log(`Recettes trouvées pour ${element}:`, recipes);
          recipes.forEach(recipe => {
            const recipeIngredients = recipe.split('+');
            const availableIngredients = recipeIngredients.every(ing => 
              this.availableElements.includes(ing) || this.craftedElements.includes(ing)
            );
            console.log(`La recette ${recipe} est ${availableIngredients ? 'possible' : 'impossible'} avec les éléments disponibles`);
          });
        } else {
          console.log(`Aucune recette trouvée pour créer ${element}`);
        }
      });
      
      console.log("=== FIN DEBUG ===");
    },
    
    // Vérifier si un élément a un GIF personnalisé
    hasGif(element) {
      return this.challenge.elementsWithGifs && 
             this.challenge.elementsWithGifs.includes(element);
    },
    
    // Obtenir le chemin du GIF pour un élément
    getElementGif(element) {
      // Convertir le nom de l'élément en minuscules pour correspondre au nom du fichier
      const fileName = element.toLowerCase();
      return require(`@/assets/gifs/${fileName}.gif`);
    },
    
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

      // Générer toutes les combinaisons possibles
      const generateCombinations = (elements) => {
        const combinations = [];
        
        // Générer toutes les permutations
        const permute = (arr, m = []) => {
          if (arr.length === 0) {
            combinations.push(m.join('+'));
          } else {
            for (let i = 0; i < arr.length; i++) {
              let curr = arr.slice();
              let next = curr.splice(i, 1);
              permute(curr.slice(), m.concat(next));
            }
          }
        };
        
        permute(elements);
        return combinations;
      };

      // Générer toutes les permutations possibles
      const permutations = generateCombinations(this.selectedElements);
      
      // Rechercher une correspondance dans les recettes
      let craftedItem = null;
      for (const permutation of permutations) {
        if (this.craftingRecipes[permutation]) {
          craftedItem = this.craftingRecipes[permutation];
          break;
        }
      }

      if (!craftedItem) {
        console.log("Échec: recette non trouvée pour", this.selectedElements);
        
        // Animation d'échec
        this.isShaking = true;
        setTimeout(() => {
          this.isShaking = false;
        }, 500);
        return;
      }

      console.log("Fusion réussie! Élément créé:", craftedItem);
      
      if (!this.craftedElements.includes(craftedItem)) {
        this.craftedElements.push(craftedItem);
      }

      this.$emit('craft-success', craftedItem);

      // Gestion du combat de boss si applicable
      if (this.isBossChallenge && this.$refs.bossFight) {
        this.$refs.bossFight.applyDamage(craftedItem);
      }

      if (this.isTargetElement(craftedItem)) {
        console.log(`Élément cible ${craftedItem} créé!`);
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
      
      // Réinitialiser aussi la santé du boss si c'est un défi de boss
      if (this.isBossChallenge && this.$refs.bossFight) {
        this.$refs.bossFight.resetBossHealth();
      }
    },
    completeChallenge() {
      if (this.isChallengeSolved) {
        this.$emit('challenge-completed', { region: this.region });
      }
    },
    isTargetElement(element) {
      return this.challenge.requiredElements.includes(element);
    },
    handleBossDefeated() {
      console.log("Le boss a été vaincu dans ExplorerCraftModal!");
      this.$emit('boss-defeated');
    }
  }
};
</script>