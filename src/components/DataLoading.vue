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

    const discoveredElements = ref([]);

    const loadAchievements = async () => {
      try {
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

        achievements.value = data.map((achievement) => {
          let requiredImage;
          try {
            // Tenter de charger l'image .png correspondant au name exact
            requiredImage = require(`@/assets/success/${achievement.name}.png`);
          } catch (e) {

            console.warn("Impossible de require l'image pour le succès :", achievement.name, e);
            requiredImage = achievement.image || null;
          }

          return {
            ...achievement,
            image: requiredImage,
            unlocked: false
          };
        });

        emit('achievements-loaded', achievements.value);
      } catch (err) {
        error.value = "Erreur lors du chargement des succès";
        console.error("Erreur lors du chargement des succès :", err);
      }
    };


    const loadGameData = async () => {
      try {
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


    function checkAchievements() {
      achievements.value.forEach((achievement) => {
        if (!achievement.unlocked) {
          let expression = achievement.condition;


          expression = expression.replace(/this\.discoveredElements/g, 'discoveredElements');

          const conditionFn = new Function('discoveredElements', `return ${expression}`);

          if (conditionFn(discoveredElements.value)) {
            achievement.unlocked = true;
            emit('achievement-unlocked', achievement);
            console.log(`Succès débloqué: ${achievement.name}`);
          }
        }
      });
    }


    function handleCraft(newElement) {
      if (!discoveredElements.value.includes(newElement)) {
        discoveredElements.value.push(newElement);
      }
      checkAchievements();
    }

    onMounted(async () => {
      await Promise.all([loadGameData(), loadAchievements()]);
    });

    return {
      error,
      achievements,
      discoveredElements,
      handleCraft
    };
  }
};
</script>
