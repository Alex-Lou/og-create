// src/utils/achievementChecker.js
// Utilitaire pour vérifier les conditions de déblocage des achievements côté client
// Utilisé à la fois directement et comme fallback par achievementsService

/**
 * Vérifie les conditions de déblocage des succès
 * @param {Array} achievements - La liste des succès
 * @param {Array} discoveredElements - Les éléments découverts par le joueur
 * @returns {Object} - Résultat contenant les achievements mis à jour et les nouveaux débloqués
 */
export function checkAchievements(achievements, discoveredElements) {
  if (!Array.isArray(achievements) || !Array.isArray(discoveredElements)) {
    console.error('Données invalides pour la vérification des succès', { 
      achievements: Array.isArray(achievements), 
      discoveredElements: Array.isArray(discoveredElements) 
    });
    return { achievements: achievements || [], newlyUnlocked: [] };
  }

  // Créer une copie pour éviter de modifier l'original
  const updatedAchievements = JSON.parse(JSON.stringify(achievements));
  
  // Créer un contexte d'évaluation pour exécuter les conditions
  const context = {
    discoveredElements: discoveredElements
  };

  let newlyUnlocked = [];

  // Vérifier chaque succès
  updatedAchievements.forEach(achievement => {
    if (achievement.unlocked === true) return; // Ignorer les succès déjà débloqués
    
    try {
      // Évaluer la condition en utilisant le contexte
      const conditionCode = achievement.condition;
      
      // Vérifier si la condition utilise includes ou length
      if (conditionCode.includes('.includes(')) {
        // Extraire le nom de l'élément entre guillemets
        const match = conditionCode.match(/includes\(['"]([^'"]+)['"]\)/);
        if (match && match[1]) {
          const elementName = match[1];
          achievement.unlocked = discoveredElements.includes(elementName);
        }
      } else if (conditionCode.includes('.length >=')) {
        // Extraire le nombre après >=
        const match = conditionCode.match(/length\s*>=\s*(\d+)/);
        if (match && match[1]) {
          const requiredCount = parseInt(match[1]);
          achievement.unlocked = discoveredElements.length >= requiredCount;
        }
      } else {
        // Pour les conditions plus complexes, utiliser Function pour évaluer
        const evaluateCondition = new Function('this', `return ${conditionCode};`);
        achievement.unlocked = evaluateCondition.call(context);
      }
      
      // Si le succès vient d'être débloqué, l'ajouter à la liste
      if (achievement.unlocked === true) {
        achievement.unlockedAt = new Date().toISOString();
        newlyUnlocked.push({...achievement});
      }
    } catch (error) {
      console.error(`Erreur lors de l'évaluation de la condition pour ${achievement.name}:`, error);
    }
  });

  return {
    achievements: updatedAchievements,
    newlyUnlocked: newlyUnlocked
  };
}

/**
 * Vérifie si un nouvel élément déclenche un succès
 * @param {Array} achievements - La liste des succès 
 * @param {Array} discoveredElements - Les éléments découverts
 * @param {String} newElement - Le nouvel élément découvert
 * @returns {Object|null} - Le succès débloqué ou null
 */
export function checkNewElementAchievement(achievements, discoveredElements, newElement) {
  if (!Array.isArray(achievements) || !Array.isArray(discoveredElements) || !newElement) {
    console.error('Données invalides pour la vérification des succès', { 
      achievements: Array.isArray(achievements), 
      discoveredElements: Array.isArray(discoveredElements),
      newElement: Boolean(newElement)
    });
    return null;
  }
  
  // Vérifier les succès liés à un élément spécifique
  const specificAchievement = achievements.find(achievement => {
    // S'assurer que le succès n'est pas déjà débloqué
    if (achievement.unlocked === true) return false;
    
    // Vérifier si la condition concerne cet élément spécifique
    const condition = achievement.condition || '';
    const match = condition.match(/includes\(['"]([^'"]+)['"]\)/);
    
    return match && match[1] === newElement;
  });
  
  if (specificAchievement && specificAchievement.unlocked !== true) {
    // Créer une copie pour éviter de modifier l'original
    const result = {...specificAchievement};
    result.unlocked = true;
    result.unlockedAt = new Date().toISOString();
    return result;
  }
  
  // Vérifier si le nouvel élément fait franchir un palier
  const countBeforeAdd = discoveredElements.length - 1; // on compte sans le nouvel élément
  
  const countAchievement = achievements.find(achievement => {
    // S'assurer que le succès n'est pas déjà débloqué
    if (achievement.unlocked === true) return false;
    
    // Vérifier si la condition est basée sur le nombre d'éléments
    const condition = achievement.condition || '';
    const match = condition.match(/length\s*>=\s*(\d+)/);
    
    if (!match) return false;
    
    const threshold = parseInt(match[1]);
    return countBeforeAdd < threshold && discoveredElements.length >= threshold;
  });
  
  if (countAchievement && countAchievement.unlocked !== true) {
    // Créer une copie pour éviter de modifier l'original
    const result = {...countAchievement};
    result.unlocked = true;
    result.unlockedAt = new Date().toISOString();
    return result;
  }
  
  return null;
}