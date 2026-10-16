// Le camp des naufragés (world/campArt.js) : ce que dit chaque élément du camp quand on le touche (son nom vient de la
// bibliothèque de dessins). Clés : le nom du dessin que le serveur envoie (state.camp : art).

// Ce que dit un élément du camp quand on le touche : { title, text }
export const CAMP_LINES = {
  hirondelle: 'Ce qu’il reste de l’Hirondelle.',
  hirondelle_poupe: 'La poupe de l’Hirondelle, arrachée par la tempête et rejetée par la mer.',
  palmier: 'Un palmier, les pieds dans le sable.',
  etoile_de_mer: 'Une étoile de mer, échouée par la marée.',
  cannelle_debris: 'La cuisine de l’épave : Agathe y fait chauffer sa marmite.',
  cannelle_abri: 'L’abri d’Agathe, à côté de sa cuisine.',
  cannelle_cabanon: 'Le cabanon d’Agathe : sa cuisine a un toit, une cheminée, et sa louche pour enseigne.',
  aster: 'Le coin de Lorena, en attendant son Ponton.',
  rivet: 'Le coin de Nathan, en attendant son Atelier.',
  tente: 'La tente des voyageurs.',
  hamac: 'Le hamac des voyageurs, entre deux poteaux.',
  sos: 'Un grand SOS de galets, pour qui passerait au large.',
  caisses: 'Des caisses repêchées dans les vagues.',
  filet: 'Un filet de pêche qui sèche au vent.',
  rondins: 'Des rondins pour le feu.',
  cage_ouverte: 'La cage des poules d’Agathe, grande ouverte.'
};
