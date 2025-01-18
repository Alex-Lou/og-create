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
    // Liste des fichiers JSON à charger
    const jsonFiles = [
      "/data/animaux.json",
      "/data/biologie.json",
      "/data/créations_humaines.json",
      "/data/elements_data.json",
      "/data/formations_naturelles.json",
      "/data/geologie.json",
      "/data/materiaux_elementaires.json",
      "/data/phénomènes_naturels.json"
    ];

    const elementEmojis = {};
    const categories = {};
    const craftingRecipes = {};

    for (const file of jsonFiles) {
      try {
        console.log(`Tentative de chargement : ${file}`);
        const response = await fetch(file);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Traitement des éléments et catégories
        Object.entries(data.elements || {}).forEach(([category, elements]) => {
          categories[category] = categories[category] || [];
          Object.entries(elements).forEach(([name, emoji]) => {
            elementEmojis[name.trim()] = emoji;
            categories[category].push(name.trim());
          });
        });

        // Traitement des règles
        if (data.rules) {
          Object.entries(data.rules).forEach(([key, value]) => {
            craftingRecipes[key.split("+").sort().join("+")] = value;
          });
        }

        console.log(`Fichier chargé avec succès : ${file}`);
      } catch (err) {
        console.error(`Erreur lors du traitement du fichier ${file} :`, err);
      }
    }

    // Émettre les données combinées
    emit('data-loaded', {
      elementEmojis,
      categories,
      craftingRecipes
    });
  } catch (err) {
    error.value = "Erreur lors du chargement des données depuis plusieurs fichiers";
    console.error("Erreur globale :", err);
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