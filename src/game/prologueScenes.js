// Les scènes du tutoriel (HISTOIRE.md, § 9), image par image : art (le dessin de PrologueArt.vue), qui parle (null :
// personne ; thought : une pensée du joueur, qu'on ne voit jamais, D11), le texte, un geste suggéré (hint), des choix
// qui font tous avancer (choices), et une image qui avance seule (auto, en ms).
export const SCENES = {
  // Étape 1 : la tempête, la Grève, Brume, le Grimoire
  arrivee: [
    { art: 'storm', caption: 'L’Hirondelle, dans la tempête.', auto: 7000 },
    { art: 'beach', thought: true, text: 'Froid… Où sont les autres ?', hint: 'Toucher pour te relever' },
    { art: 'wisp', thought: true, text: 'Un feu follet… Les marins disent qu’ils égarent les voyageurs.', choices: ['Reculer', 'Attendre'] },
    { art: 'rock', who: 'Brume', text: 'Ah ! Tu… tu me vois ? Personne ne m’a vue depuis si longtemps.' },
    { art: 'fire', who: 'Brume', text: 'Voilà, il fait moins froid. Je suis Brume.' },
    { art: 'book', who: 'Brume', text: 'Je le garde depuis toujours. Personne n’a su le lire. Toi, tu le peux.' },
    { art: 'book', who: 'Brume', text: 'Ce qu’on y écrit renaît sur l’île. C’est le secret de tout.', hint: 'Toucher le livre' }
  ],
  // Étape 2 : le premier sceau brisé, puis Aster dans les vagues
  aster: [
    { art: 'seal', who: 'Brume', text: 'Le Grimoire te fait confiance. Le sceau de Saturne attend son gardien.' },
    { art: 'aster', who: 'Aster', text: 'Toi aussi, tu étais sur l’Hirondelle ? Comment tu t’appelles ?' }
  ]
};

// Répliques de Brume pendant le jeu (la file du guide : chacune n'est dite qu'une fois)
export const LINES = {
  vent: 'Il ne reste que quatre Souffles. Mets deux fois l’Air ici.',
  pluie: 'Lis l’énigme, puis devine.',
  seul: 'À toi, sans moi.',
  nom: 'Écris-le dans le Grimoire : l’île saura qui la rebâtit.',
  greve: 'Aster t’attend sur la Grève, ton île : la mer y a rendu des caisses.'
};
