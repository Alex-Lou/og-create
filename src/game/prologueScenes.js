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
  ],
  // Étape 2, sur l'île : la première Récolte
  recolte: [
    { art: 'aster', who: 'Aster', text: 'La mer rend ce qu’elle a pris. Ramasse ce qui se ressemble, vite, avant la marée !' }
  ],
  // Étape 3 : Cannelle grelotte derrière l'épave, puis se redresse devant le feu
  cannelle: [
    { art: 'cannelle', who: 'Cannelle', text: 'Un feu follet ! … Oh. Il est mignon.' },
    { art: 'cannelle', who: 'Cannelle', text: 'Où est mon Ondin ? Mon petit-neveu !' },
    { art: 'cannelle-feu', who: 'Cannelle', text: 'Du feu… Je me souviens ! Cuisinière du bord, et fière de l’être !' }
  ],
  // Étape 4 : Rivet sous une voile échouée
  rivet: [
    { art: 'rivet', who: 'Rivet', text: 'Montre-moi tes mains. Hum. On va arranger ça.' },
    { art: 'rivet', who: 'Rivet', text: 'Un établi, et tout devient possible. Attends… Non. Si ! Commençons simple.' }
  ],
  // Étape 5 : Ondin réveillé à La Source
  ondin: [
    { art: 'ondin', who: 'Ondin', text: 'J’ai dormi combien de temps ? L’eau a un goût de nuage.' },
    { art: 'ondin', who: 'Cannelle', text: 'Mon caneton !' },
    { art: 'ondin', who: 'Ondin', text: 'Ma baguette ne trouve plus rien…' }
  ],
  // Fin du tutoriel : l'étape « Le Campement »
  campement: [
    { art: 'campement', who: 'Brume', text: 'Le feu, l’eau… Il manque un toit. Et le bois flotté s’épuise déjà.' }
  ]
};

// Répliques de Brume pendant le jeu (la file du guide : chacune n'est dite qu'une fois)
export const LINES = {
  vent: 'Il ne reste que quatre Souffles. Mets deux fois l’Air ici.',
  pluie: 'Lis l’énigme, puis devine.',
  seul: 'À toi, sans moi.',
  nom: 'Écris-le dans le Grimoire : l’île saura qui la rebâtit.',
  greve: 'Aster t’attend sur la Grève, ton île : la mer y a rendu des caisses.',
  // Sur l'île (who : le bâtiment de qui parle ; sans lui, Brume)
  claim: 'Quand je brille, touche-moi : ce que tu as accompli t’attend.',
  chaine: { who: 'ponton', text: 'Longue chaîne, mer généreuse. Par tous les alizés !' },
  bulle: 'Sa bulle dit ce qui lui manque. Comblé, on travaille mieux.',
  soupe: { who: 'foyer', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  puzzle: { who: 'atelier', text: 'Chaque pièce a sa place. Tourne, essaie. Clic !' },
  or: { who: 'atelier', text: 'Le vent veut éteindre le feu. Pose-la là où l’île brille d’or : elle le protégera.' },
  source: 'J’entends de l’eau… et quelqu’un qui ronfle.',
  ruban: 'Le Grimoire s’en souvient pour lui. Suis le ruban.',
  chut: { who: 'puits', text: 'Chut… l’eau arrive.' },
  produit: 'Ce qu’un bâtiment produit t’attend. Et il rend la Récolte plus généreuse.'
};
