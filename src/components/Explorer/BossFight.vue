<template>
  <div class="boss-fight">
    <figure class="boss-fight__figure" :class="{ 'is-hit': isBossShaking }">
      <img :src="bossImagePath" :alt="boss.name ? `Le gardien ${boss.name}` : 'Le gardien'" class="boss-fight__image" />
    </figure>
    <div class="boss-fight__gauge">
      <div class="boss-fight__row">
        <span class="g-mono">{{ boss.name || 'Le gardien' }}</span>
        <span class="g-mono boss-fight__value">{{ Math.ceil(bossHealth) }} / {{ bossMaxHealth }}</span>
      </div>
      <div
        class="g-bar boss-fight__bar"
        role="meter"
        aria-label="Vie du gardien"
        :aria-valuenow="Math.ceil(bossHealth)"
        aria-valuemin="0"
        :aria-valuemax="bossMaxHealth"
      >
        <span :style="{ width: `${bossMaxHealth ? (bossHealth / bossMaxHealth) * 100 : 0}%` }"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BossFight',
  props: {
    boss: {
      type: Object,
      required: true
    },
    craftedElements: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      bossHealth: 0,
      bossMaxHealth: 0,
      isBossShaking: false
    };
  },
  computed: {
    bossImagePath() {
      return require(`@/assets/explorer-boss/${this.boss.bossImage}`);
    }
  },
  mounted() {
    if (this.boss.maxHealth) {
      this.bossMaxHealth = this.boss.maxHealth;
      this.bossHealth = this.boss.maxHealth;
    }
  },
  methods: {
    applyDamage(element, damage = 0) {
      console.log(`Élément ${element} inflige ${damage} dégâts au boss`);
      
      this.bossHealth = Math.max(0, this.bossHealth - damage);
      
      if (damage > 0) {
        this.isBossShaking = true;
        setTimeout(() => {
          this.isBossShaking = false;
        }, 500);
      }
      
      if (this.bossHealth <= 0) {
        this.$emit('boss-defeated');
      }
    },

    applyDamageWithCounterAttack(element, damage) {
      // Récupérer les règles de combat du boss
      const bossCombatRules = this.boss.bossCombatRules;
      const counterAttackRules = bossCombatRules.bossCounterAttack;
      
      // Appliquer les dégâts au boss
      this.bossHealth = Math.max(0, this.bossHealth - damage);
      
      if (damage > 0) {
        this.isBossShaking = true;
        setTimeout(() => {
          this.isBossShaking = false;
        }, 500);
      }
      
      // Préparer la contre-attaque
      let counterDamage = counterAttackRules.baseDamage;
      
      // Déterminer le type d'élément
      const elementType = this.determineElementType(element, counterAttackRules);
      
      // Ajuster les dégâts en fonction du type d'élément
      counterDamage *= counterAttackRules.damageMultipliers[elementType];
      
      // Infliger les dégâts au joueur
      this.$emit('boss-counter-attack', Math.round(counterDamage));
      
      if (this.bossHealth <= 0) {
        this.$emit('boss-defeated');
      }
    },

    determineElementType(element, counterAttackRules) {
      if (counterAttackRules.elementTypes.weakElements.includes(element)) {
        return 'weakElement';
      }
      if (counterAttackRules.elementTypes.strongElements.includes(element)) {
        return 'strongElement';
      }
      return 'neutralElement';
    },

    resetBossHealth() {
      this.bossHealth = this.bossMaxHealth;
    }
  }
};
</script>

<style scoped>
.boss-fight {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.boss-fight__figure {
  margin: 0;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(217, 118, 94, 0.4);
  background: repeating-linear-gradient(135deg, rgba(217, 118, 94, 0.05) 0 2px, transparent 2px 10px);
}
.boss-fight__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
/* Le gardien encaisse : secousse brève */
.boss-fight__figure.is-hit { animation: boss-hit 0.5s var(--oc-ease-out); }
@keyframes boss-hit {
  0%, 100% { transform: none; }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(2px); }
}
.boss-fight__gauge { display: flex; flex-direction: column; gap: 8px; }
.boss-fight__row { display: flex; justify-content: space-between; gap: 12px; }
.boss-fight__value { color: var(--oc-danger); }
.boss-fight__bar { height: 6px; }
.boss-fight__bar > span { background: var(--oc-danger); }

@media (max-width: 859px) {
  .boss-fight__figure { height: 160px; }
}
</style>
