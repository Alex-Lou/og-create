<template>
  <div class="boss-fight-container">
    <div class="boss-container">
      <div class="boss-overlay" :class="{ 'shake-boss': isBossShaking }">
        <div class="boss-health-container">
          <div class="boss-health-bar">
            <div 
              class="boss-health-fill" 
              :style="{ width: `${(bossHealth / bossMaxHealth) * 100}%` }"
            ></div>
          </div>
          <div class="boss-health-text">{{ Math.ceil(bossHealth) }} / {{ bossMaxHealth }}</div>
        </div>
        <img :src="bossImagePath" alt="Boss" class="boss-image"/>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/ComponentsStyle/ExplorerStyle/BossFightStyle.css';
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