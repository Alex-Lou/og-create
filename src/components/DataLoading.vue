<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'DataLoading',
  emits: ['data-loaded', 'achievements-loaded'],

  setup(props, { emit }) {
    const error = ref(null);
    const achievements = ref([]);
    const discoveredElements = ref(0); // Compteur des éléments découverts

    // Charger les succès
    const loadAchievements = async () => {
      try {
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

        achievements.value = data.map((achievement) => ({
          ...achievement,
          image: require(`@/assets/success/${achievement.name}.png`),
          condition: new Function("return " + achievement.condition),
          unlocked: false
        }));

        emit('achievements-loaded', achievements.value);
      } catch (err) {
        error.value = "Erreur lors du chargement des succès";
        console.error("Erreur lors du chargement des succès :", err);
      }
    };

    // Charger les données du jeu
    const loadGameData = async () => {
      try {
        const response = await fetch("/data/elements_data.json");
        const data = await response.json();

        const elementEmojis = {};
        const categories = {};
        const craftingRecipes = {};

        Object.entries(data.elements).forEach(([category, elements]) => {
          categories[category] = [];
          Object.entries(elements).forEach(([name, emoji]) => {
            elementEmojis[name.trim()] = emoji;
            categories[category].push(name.trim());
          });
        });

        Object.entries(data.rules).forEach(([key, value]) => {
          craftingRecipes[key.split("+").sort().join("+")] = value;
        });

        emit('data-loaded', {
          elementEmojis,
          categories,
          craftingRecipes
        });
      } catch (err) {
        error.value = "Erreur lors du chargement des données";
        console.error("Erreur lors du chargement des données JSON :", err);
      }
    };

    // Fonction pour réévaluer les succès à chaque création
    const evaluateAchievements = () => {
      achievements.value.forEach((achievement) => {
        if (!achievement.unlocked) {
          const conditionMet = achievement.condition();

          // On s'assure que le premier succès est validé avant de valider le second
          if (achievement.name === "Apprenti Dieu" && discoveredElements.value >= 1 && conditionMet) {
            achievement.unlocked = true;
            console.log(`Succès débloqué: ${achievement.name}`);
          } else if (achievement.name === "Maître Créateur" && discoveredElements.value >= 2 && conditionMet) {
            // Validation du deuxième succès, mais seulement si le premier est déjà validé
            if (achievements.value[0].unlocked) {
              achievement.unlocked = true;
              console.log(`Succès débloqué: ${achievement.name}`);
            }
          }
        }
      });
    };

    // Logique de gestion de craft (création d'un élément)
    const handleCraft = () => {
      discoveredElements.value++; // Incrémenter le nombre d'éléments découverts
      evaluateAchievements(); // Réévaluer les succès après chaque création
    };

    onMounted(async () => {
      await Promise.all([loadGameData(), loadAchievements()]);
    });

    return {
      error,
      achievements,
      handleCraft,
      discoveredElements
    };
  }
};
</script>
