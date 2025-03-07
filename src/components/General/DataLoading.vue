<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'DataLoading',
  props: {
    isTimerMode: {
      type: Boolean,
      default: false
    },
    existingData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['data-loaded', 'achievements-loaded', 'achievement-unlocked', 'force-reload'],

  setup(props, { emit }) {
    const error = ref(null);
    const achievements = ref([]);
    const discoveredElements = ref([]);

    const loadAchievements = async () => {
      try {
        console.time('Chargement des achievements');
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

        const processedAchievements = data.map((achievement) => {
          console.log(`Traitement de l'achievement: ${achievement.name}`);
          
          let requiredImage;
          try {
            requiredImage = require(`@/assets/success/${achievement.name}.png`);
          } catch (e) {
            requiredImage = achievement.image || null;
          }

          return {
            ...achievement,
            image: requiredImage,
            unlocked: false
          };
        });

        console.timeEnd('Chargement des achievements');
        
        emit('achievements-loaded', processedAchievements);
        return processedAchievements;
      } catch (err) {
        console.error("Erreur de chargement des achievements:", err);
        error.value = "Erreur lors du chargement des succès";
        throw err;
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
          "/data/phénomènes_naturels.json",
          "/data/magie.json"  // Ajout du fichier magie
        ];

        const elementEmojis = {};
        const categories = {};
        const craftingRecipes = {};

        // Conserver les catégories existantes si présentes
        if (props.existingData.categories) {
          Object.assign(categories, props.existingData.categories);
        }

        for (const file of jsonFiles) {
          try {
            const response = await fetch(file);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Traitement des données animaux
            if (data.animaux) {
              Object.entries(data.animaux).forEach(([category, categoryData]) => {
                categories[category] = categories[category] || [];
                Object.entries(categoryData).forEach(([name, emoji]) => {
                  elementEmojis[name.trim()] = emoji;
                  if (!categories[category].includes(name.trim())) {
                    categories[category].push(name.trim());
                  }
                });
              });
            }

            // Traitement des données humains
            if (data.humains) {
              Object.entries(data.humains).forEach(([category, categoryData]) => {
                categories[category] = categories[category] || [];
                Object.entries(categoryData).forEach(([name, emoji]) => {
                  elementEmojis[name.trim()] = emoji;
                  if (!categories[category].includes(name.trim())) {
                    categories[category].push(name.trim());
                  }
                });
              });
            }

            // Traitement des données elements
            Object.entries(data.elements || {}).forEach(([category, elements]) => {
              categories[category] = categories[category] || [];
              Object.entries(elements).forEach(([name, emoji]) => {
                elementEmojis[name.trim()] = emoji;
                if (!categories[category].includes(name.trim())) {
                  categories[category].push(name.trim());
                }
              });
            });

            // Traitement des règles avec support de l'ordre original et trié
            if (data.rules) {
              Object.entries(data.rules).forEach(([key, value]) => {
                // Conserver la méthode actuelle pour compatibilité (éléments triés)
                craftingRecipes[key.split("+").sort().join("+")] = value;
                
                // Ajouter une nouvelle clé qui préserve l'ordre original
                craftingRecipes[key] = value;
                
                // Debug pour vérifier le chargement des recettes
                console.log(`Chargement recette: 
                  Clé originale: ${key}
                  Clé triée: ${key.split("+").sort().join("+")}
                  Valeur: ${value}`);
              });
            }
          } catch (err) {
            console.warn(`Erreur lors du chargement du fichier ${file}:`, err);
          }
        }

        const loadedData = {
          elementEmojis,
          categories,
          craftingRecipes
        };

        emit('data-loaded', loadedData);
        return loadedData;
      } catch (err) {
        error.value = "Erreur lors du chargement des données depuis plusieurs fichiers";
        throw err;
      }
    };

    // Nouvelle méthode pour rechargement forcé
    const loadAllData = async () => {
      try {
        // Charger à la fois les données de jeu et les achievements
        const [gameData, loadedAchievements] = await Promise.all([
          loadGameData(), 
          loadAchievements()
        ]);

        // Données complètes à recharger
        const fullLoadedData = {
          ...gameData,
          achievements: loadedAchievements,
          // Conserver les données existantes
          ...props.existingData
        };

        // Émettre un événement de rechargement forcé
        emit('force-reload', fullLoadedData);

        return fullLoadedData;
      } catch (err) {
        console.error('Erreur lors du rechargement forcé:', err);
        error.value = "Erreur lors du rechargement complet des données";
        throw err;
      }
    };

    function checkAchievements() {
      if (props.isTimerMode) return;
      
      achievements.value.forEach((achievement) => {
        if (!achievement.unlocked) {
          let expression = achievement.condition;
          expression = expression.replace(/this\.discoveredElements/g, 'discoveredElements');
          const conditionFn = new Function('discoveredElements', `return ${expression}`);

          if (conditionFn(discoveredElements.value)) {
            achievement.unlocked = true;
            emit('achievement-unlocked', achievement);
          }
        }
      });
    }

    function handleCraft(newElement) {
      if (props.isTimerMode) {
        emit('craft-success', newElement);
        return;
      }

      if (!discoveredElements.value.includes(newElement)) {
        discoveredElements.value.push(newElement);
        checkAchievements();
      }
    }

    onMounted(async () => {
      await Promise.all([loadGameData(), loadAchievements()]);
    });

    return {
      error,
      achievements,
      discoveredElements,
      handleCraft,
      loadAllData
    };
  }
};
</script>