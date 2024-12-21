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
  
      const loadAchievements = async () => {
        try {
          const response = await fetch("/data/achievements.json");
          const data = await response.json();
          
          const achievements = data.map((achievement) => ({
            ...achievement,
            image: require(`@/assets/success/${achievement.name}.png`),
            condition: new Function("return " + achievement.condition),
            unlocked: false
          }));
  
          emit('achievements-loaded', achievements);
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
  
          // Traitement des éléments et catégories
          Object.entries(data.elements).forEach(([category, elements]) => {
            categories[category] = [];
            Object.entries(elements).forEach(([name, emoji]) => {
              elementEmojis[name.trim()] = emoji;
              categories[category].push(name.trim());
            });
          });
  
          // Traitement des recettes
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
  
      onMounted(async () => {
        await Promise.all([loadGameData(), loadAchievements()]);
      });
  
      return {
        error
      };
    }
  }
  </script>