// Les onglets pendant le tutoriel (App, story.js) : ce que dit Brume quand l'un s'ouvre, et ce que dit le coach quand la
// suite est sur un autre onglet

// Un onglet s'ouvre pendant le tutoriel : Brume le dit (la barre fait briller l'onglet)
export const TAB_OPENED = {
  world: 'Le vent a chassé la brume de la plage de Brumelune. Touche « Île », en bas : pour cette nuit, on reste près du rivage.',
  // (Brume ne lit pas l'interface : l'onglet qui s'allume suffit)
  sceau: 'Ton nom est écrit au Grimoire. Ton sceau t’attend, avec tout ce que tu accompliras.',
  timer: 'Les Défis s’ouvrent : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux.'
};

// Le plan d'un chantier écrit dans l'Athanor : Brume renvoie sur l'île (App, story.js)
export const PLAN_WRITTEN = {
  text: plan => `Tu as fait naître « ${plan} » dans l’Athanor ! Retourne sur l’île : le chantier peut se bâtir.`,
  action: 'Aller sur l’île'
};

// Ce que dit le coach quand la suite est sur un autre onglet
export const TAB_CALLS = {
  world: 'La suite t’attend sur l’île : touche « Île ».',
  infinite: 'La suite se mélange dans l’Athanor du Grimoire : touche « Grimoire ».'
};
