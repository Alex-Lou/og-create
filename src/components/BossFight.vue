<template>
    <div class="boss-container">
      <!-- Overlay du boss avec la barre de vie -->
      <div class="boss-overlay" :class="{ 'shake-boss': isShaking }">
        <!-- Barre de vie du boss -->
        <div class="boss-health-container">
          <div class="boss-health-bar">
            <div class="boss-health-fill" :style="{ width: `${(bossHealth / bossMaxHealth) * 100}%` }"></div>
          </div>
          <div class="boss-health-text">{{ Math.ceil(bossHealth) }} / {{ bossMaxHealth }}</div>
        </div>
        <img :src="bossImagePath" alt="Boss" class="boss-image"/>
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
        isShaking: false
      };
    },
    computed: {
      bossImagePath() {
        // On suppose que l'image du boss se trouve dans le dossier explorer-boss
        return require(`@/assets/explorer-boss/${this.boss.bossImage}`);
      }
    },
    watch: {
      // Surveiller les nouveaux éléments créés pour appliquer des dégâts
      craftedElements: {
        handler(newElements, oldElements) {
          if (newElements.length > oldElements.length) {
            // Un nouvel élément a été ajouté
            const newElement = newElements[newElements.length - 1];
            this.checkDamage(newElement);
          }
        },
        deep: true
      }
    },
    mounted() {
      // Initialisation de la santé du boss
      if (this.boss.maxHealth) {
        this.bossMaxHealth = this.boss.maxHealth;
        this.bossHealth = this.boss.maxHealth;
      }
    },
    methods: {
      // Vérifier si un élément créé fait des dégâts au boss
      checkDamage(element) {
        if (this.boss.damagePerElement && this.boss.damagePerElement[element]) {
          // Appliquer les dégâts au boss
          const damage = this.boss.damagePerElement[element];
          this.bossHealth = Math.max(0, this.bossHealth - damage);
          console.log(`${element} a infligé ${damage} dégâts au boss! Santé restante: ${this.bossHealth}`);
          
          // Faire trembler le boss
          this.isShaking = true;
          setTimeout(() => {
            this.isShaking = false;
          }, 500);
          
          // Vérifier si le boss est vaincu
          if (this.bossHealth <= 0) {
            console.log("Le boss a été vaincu!");
            // Émettre un événement que le boss est vaincu
            this.$emit('boss-defeated');
          }
        }
      },
      // Méthode publique pour appliquer des dégâts
      applyDamage(element) {
        this.checkDamage(element);
      },
      // Méthode pour réinitialiser la santé du boss
      resetBossHealth() {
        this.bossHealth = this.bossMaxHealth;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Overlay pour afficher le boss devant le background */
  .boss-overlay {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    max-height: 80%;
    max-width: 90%;
    z-index: 5;
  }
  
  .boss-image {
    width: 100%;
    height: auto;
    margin-top: -30px;
  }
  
  .boss-health-container {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    z-index: 6;
  }
  
  .boss-health-bar {
    width: 100%;
    height: 20px;
    background-color: #333;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #000;
  }
  
  .boss-health-fill {
    height: 100%;
    background: linear-gradient(to right, #ff0000, #ff6b6b);
    transition: width 0.5s ease-out;
  }
  
  .boss-health-text {
    color: #fff;
    text-align: center;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    margin-top: 5px;
    font-family: 'BenjaminFranklin', sans-serif;
    letter-spacing: 2px;
  }
  
  .shake-boss {
    animation: shake-animation 0.5s cubic-bezier(.36, .07, .19, .97) both;
  }
  
  @keyframes shake-animation {
    0%, 100% { transform: translateX(-50%); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-52%, 2px); }
    20%, 40%, 60%, 80% { transform: translate(-48%, -2px); }
  }
  </style>