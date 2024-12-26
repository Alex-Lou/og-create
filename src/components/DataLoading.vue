<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'DataLoading',
  emits: ['data-loaded', 'achievements-loaded', 'achievement-unlocked'],

  setup(props, { emit }) {
    const error = ref(null);
    const achievements = ref([]);
    const discoveredElements = ref(0);

    const loadAchievements = async () => {
      try {
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

        achievements.value = data.map((achievement) => ({
          ...achievement,
          image: require(`@/assets/success/${achievement.name}.png`),
          unlocked: false,
          order: achievement.name === "Apprenti Dieu" ? 1 : 2
        }));

        emit('achievements-loaded', achievements.value);
      } catch (err) {
        error.value = "Erreur lors du chargement des succès";
        console.error("Erreur lors du chargement des succès :", err);
      }
    };

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

    const checkNextAchievement = () => {
      const sortedAchievements = [...achievements.value]
        .sort((a, b) => a.order - b.order)
        .filter(a => !a.unlocked);

      if (sortedAchievements.length > 0) {
        const nextAchievement = sortedAchievements[0];
        
        if (
          (nextAchievement.name === "Apprenti Dieu" && discoveredElements.value >= 1) ||
          (nextAchievement.name === "Maître Créateur" && discoveredElements.value >= 2 && 
           achievements.value.find(a => a.name === "Apprenti Dieu")?.unlocked)
        ) {
          nextAchievement.unlocked = true;
          emit('achievement-unlocked', nextAchievement);
          console.log(`Succès débloqué: ${nextAchievement.name}`);
        }
      }
    };

    const handleCraft = () => {
      discoveredElements.value++;
      checkNextAchievement();
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