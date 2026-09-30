<template>
  <div class="explorer-craft-modal" v-if="isVisible">
    <div class="modal-content">
      <!-- Cadre décoratif interne -->
      <div class="customize-modal-frame">
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
      </div>

      <div class="challenge-info">
        <div class="npc-image-container">
          <div class="npc-placeholder">🧙‍♂️</div>
        </div>
        <div class="challenge-objective">
          <h2>{{ region.name }} - Défi</h2>
          <p>
            Objectif: Créer 
            <span
              v-for="(element, idx) in challenge.requiredElements"
              :key="element"
              class="target-element"
            >
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

      <div class="craft-area">
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
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element" />
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
        </div>

        <div
          class="crafting-workspace"
          :style="{ backgroundImage: challenge.background ? `url(${require(`@/assets/explorer-background/${challenge.background}`)})` : '' }"
          @dragenter.prevent
          @dragover.prevent
          @drop="handleDrop"
        >
          <h3>Zone de fusion</h3>

          <BossFight
            v-if="isBossChallenge"
            :boss="challenge"
            :craftedElements="craftedElements"
            ref="bossFight"
            @boss-defeated="handleBossDefeated"
            @boss-counter-attack="handleBossCounterAttack"
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
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element" />
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
            </div>
          </div>
          <button
            @click="craftElements"
            class="craft-button-explorer"
            :disabled="selectedElements.length < 2"
          >
            Fusionner
          </button>
        </div>

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
                <div v-if="hasGif(element)" class="gif-container">
                  <img :src="getElementGif(element)" class="element-gif" alt="element" />
                </div>
                <span v-else>{{ elementEmojis[element] || '🔮' }}</span>
              </div>
              <div class="element-name">{{ element }}</div>
              <div class="glow-effect" v-if="isTargetElement(element)"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="resetCrafting" class="reset-button">
          Tout nettoyer
        </button>

        <div v-if="isBossChallenge" class="player-health-section">
          <div class="player-health-bar">
            <div
              class="player-health-fill"
              :style="{
                width: `${(playerHealth / challenge.maxHealth) * 100}%`,
                backgroundColor: getHealthColor(playerHealth)
              }"
            >
              <span class="player-health-text">
                {{ Math.ceil(playerHealth) }} / {{ challenge.maxHealth }}
              </span>
            </div>
          </div>
        </div>

        <button
          v-if="!isBossChallenge"
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
import BossFight from '@/components/Explorer/BossFight.vue';
import '@/assets/ComponentsStyle/ExplorerStyle/ExplorerCraftStyle.css';
import { findRecipe } from '@/utils/recipes';

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
      isGameOver: false,
      playerHealth: 0
    };
  },
  computed: {
    availableElements() {
      if (this.challenge && this.challenge.availableElements && this.challenge.availableElements.length > 0) {
        return this.challenge.availableElements;
      }
      
      const baseElements = ['Eau', 'Feu', 'Terre', 'Air'];
      return [...new Set([...baseElements, ...this.discoveredElements.filter(e => 
        !this.challenge.requiredElements?.includes(e)
      )])];
    },
    isChallengeSolved() {
      return this.challenge.requiredElements && this.challenge.requiredElements.every(element => 
        this.craftedElements.includes(element)
      );
    },
    isBossChallenge() {
      return this.challenge && this.challenge.bossImage && this.challenge.maxHealth;
    }
  },
  mounted() {
    this.debugRecipes();
    this.initPlayerHealth();
  },
  methods: {
    getHealthColor(health) {
      const percentage = (health / this.challenge.maxHealth) * 100;
      if (percentage > 66) return 'green';
      if (percentage > 33) return 'orange';
      return 'red';
    },

    initPlayerHealth() {
      if (this.isBossChallenge && this.challenge.maxHealth) {
        this.playerHealth = this.challenge.maxHealth;
      }
    },

    handleBossCounterAttack(damage) {
      this.playerHealth = Math.max(0, this.playerHealth - damage);
      
      const healthBar = this.$el.querySelector('.player-health-fill');
      if (healthBar) {
        healthBar.classList.add('shake-animation');
        setTimeout(() => {
          healthBar.classList.remove('shake-animation');
        }, 500);
      }
      
      if (this.playerHealth <= 0) {
        this.handlePlayerDefeated();
      }
    },

    debugRecipes() {
      console.log("=== DEBUG RECETTES ===");
      console.log("Éléments disponibles:", this.availableElements);
      console.log("Éléments requis:", this.challenge.requiredElements);
      console.log("Éléments de dégâts:", this.challenge.damagePerElement);
      
      console.log("Toutes les recettes disponibles:", this.craftingRecipes);
      
      if (this.challenge.requiredElements) {
        this.challenge.requiredElements.forEach(element => {
          console.log(`Recherche de recettes pour créer: ${element}`);
          
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
      }
      
      console.log("=== FIN DEBUG ===");
    },
    
    hasGif(element) {
      return this.challenge.elementsWithGifs && 
             this.challenge.elementsWithGifs.includes(element);
    },
    
    getElementGif(element) {
      try {
        const fileName = element.toLowerCase();
        return require(`@/assets/gifs/${fileName}.gif`);
      } catch (error) {
        console.warn(`Gif non trouvé pour l'élément: ${element}`);
        return '';
      }
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
      if (this.isGameOver) return;

      if (this.selectedElements.length < 2) {
        this.$emit('show-alert', 'Sélectionnez au moins 2 éléments pour la fusion!');
        return;
      }

      const craftedItem = findRecipe(this.craftingRecipes, this.selectedElements);

      if (!craftedItem) {
        // Combinaison impossible
        console.log("Échec: recette non trouvée pour", this.selectedElements);
        
        if (this.isBossChallenge) {
          this.playerHealth = Math.max(0, this.playerHealth - 10);
          
          const healthBar = this.$el.querySelector('.player-health-fill');
          if (healthBar) {
            healthBar.classList.add('shake-animation');
            setTimeout(() => {
              healthBar.classList.remove('shake-animation');
            }, 500);
          }
          
          if (this.playerHealth <= 0) {
            this.handlePlayerDefeated();
          }
        }
        
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

      // Gestion des dégâts du boss
      if (this.isBossChallenge && this.$refs.bossFight) {
        const bossCombatRules = this.challenge.bossCombatRules;
        
        // Vérifier si l'élément inflige des dégâts spécifiques
        if (this.challenge.damagePerElement && this.challenge.damagePerElement[craftedItem]) {
          const bossDamage = this.challenge.damagePerElement[craftedItem];
          this.$refs.bossFight.applyDamage(craftedItem, bossDamage);
        } else if (bossCombatRules) {
          // Calculer les dégâts pour les autres éléments
          let elementDamage = bossCombatRules.defaultElementDamage || 3;
          
          // Vérifier s'il existe des dégâts spécifiques pour cet élément
          if (bossCombatRules.baseElementDamage && bossCombatRules.baseElementDamage[craftedItem]) {
            elementDamage = bossCombatRules.baseElementDamage[craftedItem];
          }

          // Appliquer les dégâts et déclencher la contre-attaque
          this.$refs.bossFight.applyDamageWithCounterAttack(craftedItem, elementDamage);
        } else {
          // Fallback si les règles de combat ne sont pas définies
          this.$refs.bossFight.applyDamage(craftedItem, 3);
        }
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
      if (!this.isGameOver) {
        // Réinitialiser uniquement les éléments sélectionnés et créés
        this.selectedElements = [];
        this.craftedElements = [];
      }
    },
        
    completeChallenge() {
      if (this.isChallengeSolved) {
        this.$emit('challenge-completed', { region: this.region });
      }
    },
    
    isTargetElement(element) {
      return this.challenge.requiredElements && this.challenge.requiredElements.includes(element);
    },

    checkBossVictory() {
      if (this.$refs.bossFight && this.$refs.bossFight.bossHealth <= 0) {
        console.log("BOSS VAINCU! Émission de l'événement");
        setTimeout(() => {
          this.$emit('challenge-completed', { 
            region: { 
              id: this.challenge.trigger_after_region,
              name: `Boss: ${this.challenge.name}`
            }, 
            isBoss: true
          });
        }, 500);
      }
    },

        
    handleBossDefeated() {
      this.isGameOver = true;
      this.$emit('challenge-completed', { 
        region: { 
          id: this.challenge.trigger_after_region,
          name: `Boss: ${this.challenge.name}`
        },
        isBoss: true
      });
    },

    
    handlePlayerDefeated() {
      this.isGameOver = true;
      this.$emit('player-defeated', { region: this.region });
    }
  }
};
</script>