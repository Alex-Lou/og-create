<template>
  <GModal
    v-if="isVisible"
    :width="1180"
    :dismissible="false"
    :label="isBossChallenge ? 'Défi du gardien' : `Défi : ${region.name || 'région'}`"
  >
    <header class="xc-head">
      <div class="xc-head__title">
        <span class="g-mono" :class="{ 'xc-danger': isBossChallenge }">{{ isBossChallenge ? 'Défi du gardien' : 'Défi de la région' }}</span>
        <h2 class="g-title">{{ region.name || 'Région inconnue' }}</h2>
        <p v-if="challenge.requiredElements && challenge.requiredElements.length" class="g-italic xc-goal">
          Objectif : créer
          <template v-for="(element, idx) in challenge.requiredElements" :key="element">
            {{ idx > 0 ? ' et ' : '' }}<b class="xc-goal__el" :class="{ 'is-done': craftedElements.includes(element) }">{{ element }}</b>
          </template>
        </p>
      </div>
      <div class="xc-head__tools">
        <button
          v-if="challenge.unlockHint"
          type="button"
          class="g-btn g-btn--ghost g-btn--small xc-tool"
          :aria-expanded="showHint ? 'true' : 'false'"
          @click="toggleHint"
        >
          {{ showHint ? 'Masquer l\'indice' : 'Afficher l\'indice' }}
        </button>
        <button type="button" class="g-btn g-btn--ghost g-btn--small xc-tool" @click="resetCrafting">Tout vider</button>
        <button type="button" class="g-btn g-btn--ghost g-btn--small xc-tool" @click="closeModal">Abandonner</button>
      </div>
    </header>

    <p v-if="showHint" class="g-italic xc-hint">{{ challenge.unlockHint }}</p>
    <hr class="g-rule" />

    <div class="xc-grid">
      <!-- Éléments : ceux du défi, puis ceux créés en chemin -->
      <section class="xc-elements" aria-label="Éléments">
        <span class="g-mono">Éléments disponibles</span>
        <div class="xc-plates">
          <button
            v-for="element in availableElements"
            :key="element"
            type="button"
            class="xc-plate"
            draggable="true"
            :aria-label="`Poser ${element} dans l'Athanor`"
            @dragstart="startDrag($event, element)"
            @click="selectElement(element)"
          >
            <img v-if="hasGif(element)" :src="getElementGif(element)" class="xc-plate__gif" alt="" />
            <span v-else class="xc-plate__ink g-ink" aria-hidden="true">{{ elementEmojis[element] || '🔮' }}</span>
            <span class="xc-plate__name">{{ element }}</span>
          </button>
        </div>

        <span class="g-mono xc-elements__sub">Créés pendant le défi</span>
        <div v-if="craftedElements.length" class="xc-plates">
          <button
            v-for="(element, index) in craftedElements"
            :key="index"
            type="button"
            class="xc-plate xc-plate--new"
            :class="{ 'xc-plate--target': isTargetElement(element) }"
            draggable="true"
            :aria-label="`Poser ${element} dans l'Athanor`"
            @dragstart="startDragCrafted($event, element)"
            @click="selectCraftedElement(element)"
          >
            <img v-if="hasGif(element)" :src="getElementGif(element)" class="xc-plate__gif" alt="" />
            <span v-else class="xc-plate__ink g-ink--glow" aria-hidden="true">{{ elementEmojis[element] || '🔮' }}</span>
            <span class="xc-plate__name">{{ element }}</span>
          </button>
        </div>
        <p v-else class="g-italic xc-empty">Rien encore : chaque création réussie s'inscrit ici.</p>
      </section>

      <!-- Athanor : 2 à 4 emplacements, on y dépose ou on y glisse les éléments -->
      <section
        class="xc-athanor g-panel"
        aria-label="Athanor"
        @dragenter.prevent
        @dragover.prevent
        @drop="handleDrop"
      >
        <div
          v-if="challenge.background"
          class="xc-athanor__bg"
          :style="{ backgroundImage: `url(${require(`@/assets/explorer-background/${challenge.background}`)})` }"
          aria-hidden="true"
        ></div>
        <span class="g-display xc-athanor__title">Athanor</span>
        <div class="xc-circle">
          <svg class="xc-circle__art" viewBox="0 0 340 340" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-linecap="round">
              <circle cx="170" cy="170" r="162" stroke-opacity=".35" />
              <circle cx="170" cy="170" r="166" stroke-opacity=".35" stroke-width="6" stroke-dasharray="1 20.73" stroke-linecap="butt" />
              <circle cx="170" cy="170" r="122" stroke-opacity=".5" stroke-dasharray="2 6" />
              <polygon points="170,47.6 292.4,170 170,292.4 47.6,170" stroke-opacity=".45" />
              <circle cx="170" cy="170" r="51" stroke-opacity=".6" />
              <circle cx="170" cy="170" r="45" stroke-opacity=".25" />
            </g>
            <circle cx="170" cy="170" r="3" class="xc-circle__heart" />
          </svg>

          <template v-for="(slot, index) in ['I', 'II', 'III', 'IV']" :key="slot">
            <button
              v-if="index < selectedElements.length"
              type="button"
              class="xc-slot"
              :class="[`xc-slot--${index}`, { 'shake-animation': isShaking && index < selectedElements.length }]"
              draggable="true"
              :aria-label="`Retirer ${selectedElements[index]}`"
              @dragstart="startDragSelected($event, selectedElements[index], index)"
              @click="removeSelectedElement(index)"
            >
              <img v-if="hasGif(selectedElements[index])" :src="getElementGif(selectedElements[index])" class="xc-slot__gif" alt="" />
              <span v-else class="xc-slot__ink g-ink" aria-hidden="true">{{ elementEmojis[selectedElements[index]] || '🔮' }}</span>
              <small class="xc-slot__name">{{ selectedElements[index] }}</small>
            </button>
            <span v-else class="xc-slot xc-slot--empty" :class="`xc-slot--${index}`" aria-hidden="true">
              <span class="g-mono">{{ slot }}</span>
            </span>
          </template>

          <div class="xc-circle__core" aria-live="polite">
            <span v-if="selectedElements.length" class="g-italic xc-circle__recipe">{{ selectedElements.join(' + ') }}</span>
            <span v-if="isShaking" class="g-mono xc-danger">rien ne se passe</span>
            <span v-else-if="selectedElements.length >= 2" class="g-mono g-gold">prêt</span>
            <span v-else class="g-mono">2 à 4 éléments</span>
          </div>
        </div>
        <button
          type="button"
          class="g-btn xc-athanor__go"
          :disabled="selectedElements.length < 2"
          @click="craftElements"
        >
          Transmuer
        </button>
      </section>

      <!-- Gardien et vitalité, ou objectif à valider -->
      <section class="xc-side" :aria-label="isBossChallenge ? 'Combat' : 'Objectif'">
        <template v-if="isBossChallenge">
          <BossFight
            :boss="challenge"
            :craftedElements="craftedElements"
            ref="bossFight"
            @boss-defeated="handleBossDefeated"
            @boss-counter-attack="handleBossCounterAttack"
          />
          <div class="xc-life">
            <div class="xc-life__row">
              <span class="g-mono">Ta vitalité</span>
              <span class="g-mono xc-life__value">{{ Math.ceil(playerHealth) }} / {{ challenge.maxHealth }}</span>
            </div>
            <div
              class="g-bar xc-life__bar"
              role="meter"
              aria-label="Ta vitalité"
              :aria-valuenow="Math.ceil(playerHealth)"
              aria-valuemin="0"
              :aria-valuemax="challenge.maxHealth"
            >
              <span
                ref="playerHealthFill"
                :class="['player-health-fill', `is-${getHealthColor(playerHealth)}`]"
                :style="{ width: `${(playerHealth / challenge.maxHealth) * 100}%` }"
              ></span>
            </div>
          </div>
          <p class="g-italic xc-side__rule">Une transmutation ratée te coûte 10 de vitalité. Chaque création frappe le gardien.</p>
        </template>

        <template v-else>
          <span class="g-mono">Objectif</span>
          <ul class="xc-goals">
            <li
              v-for="element in (challenge.requiredElements || [])"
              :key="element"
              :class="{ 'is-done': craftedElements.includes(element) }"
            >
              <svg width="22" height="22" viewBox="0 0 34 34" aria-hidden="true">
                <circle cx="17" cy="17" r="15" />
                <path v-if="craftedElements.includes(element)" d="M11 17l4 4 8-9" />
              </svg>
              <span class="xc-goals__name">{{ element }}</span>
              <span class="g-mono">{{ craftedElements.includes(element) ? 'créé' : 'à créer' }}</span>
            </li>
          </ul>
          <p v-if="challenge.alreadyCompleted" class="g-italic xc-side__rule">
            Région déjà explorée : ce défi ne rapporte rien cette fois.
          </p>
          <button
            type="button"
            class="g-btn xc-side__go"
            :disabled="!isChallengeSolved"
            @click="completeChallenge"
          >
            Valider le défi
          </button>
        </template>
      </section>
    </div>
  </GModal>
</template>

<script>
import BossFight from '@/components/Explorer/BossFight.vue';
import GModal from '@/components/ui/GModal.vue';
import { findRecipe } from '@/utils/recipes';

export default {
  name: 'ExplorerCraftModal',
  components: {
    BossFight,
    GModal
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
  emits: ['close', 'show-alert', 'craft-success', 'target-element-created', 'challenge-completed', 'player-defeated'],
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
      
      const healthBar = this.$refs.playerHealthFill;
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
          
          const healthBar = this.$refs.playerHealthFill;
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
<style scoped>
/* ---------- En-tête du défi ---------- */
.xc-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px 24px;
  flex-wrap: wrap;
}
.xc-head__title { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.xc-head__tools { display: flex; flex-wrap: wrap; gap: 10px; }
.xc-tool { min-height: 44px; }
.xc-goal { margin: 0; font-size: 17px; }
.xc-goal__el { font-weight: 400; color: var(--oc-gold); }
.xc-goal__el.is-done { color: var(--oc-verdigris); }
.xc-hint {
  margin: 0;
  padding: 12px 16px;
  font-size: 17px;
  color: var(--oc-text);
  box-shadow: inset 1px 0 0 var(--oc-accent-line);
  background: var(--oc-gold-soft);
}
.xc-danger { color: var(--oc-danger); }

/* ---------- Trois colonnes : éléments, Athanor, gardien ---------- */
.xc-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px) minmax(0, 300px);
  gap: 32px;
  align-items: start;
}

.xc-elements { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.xc-elements__sub { margin-top: 8px; }
.xc-empty { margin: 0; font-size: 15px; color: var(--oc-text-faint); }
.xc-plates {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 10px;
}
.xc-plate {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 96px;
  padding: 12px 6px 10px;
  border: 0;
  cursor: grab;
  color: var(--oc-text);
  background: linear-gradient(180deg, rgba(233, 223, 200, 0.045), rgba(233, 223, 200, 0.015));
  box-shadow: inset 0 0 0 1px var(--oc-line);
  clip-path: polygon(var(--oc-bevel) 0, 100% 0, 100% calc(100% - var(--oc-bevel)), calc(100% - var(--oc-bevel)) 100%, 0 100%, 0 var(--oc-bevel));
  transition: background var(--oc-fast), box-shadow var(--oc-fast);
}
.xc-plate:hover { background: var(--oc-surface-hover); box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.xc-plate:active { cursor: grabbing; }
.xc-plate__ink { font-size: 30px; line-height: 1; }
.xc-plate__gif { width: 36px; height: 36px; object-fit: contain; }
.xc-plate__name { font-size: 14px; line-height: 1.2; overflow-wrap: anywhere; }
.xc-plate--new { box-shadow: inset 0 0 0 1px rgba(224, 182, 84, 0.5); }
.xc-plate--target { box-shadow: inset 0 0 0 1px var(--oc-accent-line), var(--oc-shadow-accent); }
.xc-plate--target .xc-plate__name { color: var(--oc-gold); }

/* ---------- Athanor ---------- */
.xc-athanor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 22px;
  overflow: hidden;
}
.xc-athanor__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.16;
  filter: grayscale(1) sepia(0.4);
  pointer-events: none;
}
.xc-athanor__title { position: relative; align-self: flex-start; font-size: 22px; }
.xc-athanor__go { position: relative; }
.xc-circle {
  position: relative;
  width: min(320px, 100%);
  aspect-ratio: 1;
  color: var(--oc-text);
}
.xc-circle__art { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.xc-circle__heart { fill: var(--oc-gold); }
.xc-circle__core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 34%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}
.xc-circle__recipe { font-size: 14px; line-height: 1.2; overflow-wrap: anywhere; }
.xc-circle__core .g-mono { font-size: 8px; }

/* Emplacements aux quatre points cardinaux */
.xc-slot {
  appearance: none;
  position: absolute;
  width: 25%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  color: var(--oc-text);
  background: var(--oc-surface-strong);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
}
.xc-slot--0 { left: 50%; top: 14%; }
.xc-slot--1 { left: 86%; top: 50%; }
.xc-slot--2 { left: 50%; top: 86%; }
.xc-slot--3 { left: 14%; top: 50%; }
button.xc-slot:hover { box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
.xc-slot--empty {
  cursor: default;
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--oc-line);
}
.xc-slot--empty .g-mono { font-size: 9px; }
.xc-slot__ink { font-size: 26px; line-height: 1; }
.xc-slot__gif { width: 30px; height: 30px; object-fit: contain; }
.xc-slot__name {
  max-width: 90%;
  font-size: 12px;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Gardien, vitalité, objectif ---------- */
.xc-side { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.xc-side__rule { margin: 0; font-size: 16px; color: var(--oc-text-faint); }
.xc-side__go { align-self: flex-start; }
.xc-life { display: flex; flex-direction: column; gap: 8px; }
.xc-life__row { display: flex; justify-content: space-between; gap: 12px; }
.xc-life__value { color: var(--oc-text); }
.xc-life__bar { height: 6px; }
/* La vitalité passe de l'encre à l'or, puis au vermillon */
.xc-life__bar > .is-green { background: var(--oc-text); }
.xc-life__bar > .is-orange { background: var(--oc-gold); }
.xc-life__bar > .is-red { background: var(--oc-danger); }

.xc-goals { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.xc-goals li { display: flex; align-items: center; gap: 12px; color: var(--oc-gold); }
.xc-goals li.is-done { color: var(--oc-verdigris); }
.xc-goals svg { flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
.xc-goals__name { flex: 1; font-size: 17px; color: var(--oc-text-strong); }
.xc-goals li .g-mono { color: inherit; }

/* Combinaison ratée, coup reçu */
.shake-animation { animation: xc-shake 0.5s var(--oc-ease-out); }
@keyframes xc-shake {
  0%, 100% { translate: 0; }
  20% { translate: -5px 0; }
  40% { translate: 4px 0; }
  60% { translate: -3px 0; }
  80% { translate: 2px 0; }
}

@media (max-width: 1180px) {
  .xc-grid { grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); }
  .xc-side { grid-column: 1 / -1; }
}

@media (max-width: 859px) {
  .xc-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .xc-side { order: -1; grid-column: auto; }
  .xc-head__tools { width: 100%; }
  .xc-tool { flex: 1; padding: 0 10px; }
  .xc-plates { grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); }
  .xc-plate { min-height: 84px; }
  .xc-athanor { padding: 18px 12px; }
  .xc-athanor__go,
  .xc-side__go { align-self: stretch; }
}
</style>
