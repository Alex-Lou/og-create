// Les scènes du tutoriel (HISTOIRE.md, § 9), image par image : le dessin (scene : une scène de la bibliothèque,
// game/sceneArt.js ; art : un dessin de PrologueArt.vue), alone (le joueur n'est pas encore à l'écran : on voit par ses
// yeux), avatar (une autre vue ou pose que celle de la scène : il grelotte quand il a peur ou froid), still (la scène
// reste sur sa première image), qui parle (null : personne ; thought : une pensée du joueur, qui ne parle jamais), le texte, un geste suggéré
// (hint), des choix qui font tous avancer (choices), et une image qui avance seule (auto, en ms).
// L'ordre : seul sur la Grève, on se relève, on se découvre (la carte d'embarquement : l'avatar et le nom, entre
// « naufrage » et « arrivee »), Brume, le Grimoire ; puis la troupe dans l'ordre des quêtes du serveur, un personnage
// à la fois : Cannelle, Rivet, Ondin, et Aster à la fin du tutoriel (choix de l'auteur, 8 oct.).
// Le joueur grelotte, de face (de peur ou de froid)
const SHIVER = { vue: 'face', pose: 'grelotter' };

export const SCENES = {
  // Étape 1 : la tempête, le noir, la Grève. Le joueur se relève seul et trouve sa carte d'embarquement
  naufrage: [
    { scene: '01_pont', alone: true, caption: 'L’Hirondelle, troisième nuit de croisière.', auto: 4200 },
    { scene: '01_pont', alone: true, who: 'Le haut-parleur', text: 'Mesdames et messieurs, le commandant vous prie de regagner… krrr… vos cabines…' },
    { scene: '01_vague', auto: 2600 },
    { scene: '01_noir', auto: 3000 },
    { scene: '01_greve', alone: true, thought: true, text: 'Du sable dans la bouche. La mer. Rien d’autre.', hint: 'Toucher pour te relever' },
    { scene: '01_gilet', alone: true, thought: true, text: 'Ohé ? … Quelqu’un ? … Seule la mer répond. Dans ma poche, un carton trempé : ma carte d’embarquement.', hint: 'Toucher la carte' }
  ],
  // Étapes 2 et 3 : on se voit enfin, Brume a aussi peur que nous, la Grève d'avant, l'épave, puis le livre qu'elle garde
  // (8 oct., choix de l'auteur : 7 images, Brume en 5 bulles ; le nom de l'île reviendra plus tard, au feu)
  arrivee: [
    { scene: '02_lueur', thought: true, text: 'Une lumière, là-bas ! Une lanterne… On me cherche !' },
    { scene: '02_approche', avatar: SHIVER, thought: true, text: 'Ce n’est pas une lanterne. Les marins disent que les feux follets égarent les voyageurs.', choices: ['Reculer', 'Ne pas bouger'] },
    { scene: '02_rocher', avatar: SHIVER, who: 'Brume', text: 'Tu me vois. … Tu me vois vraiment ?' },
    { scene: '02_examine', who: 'Brume', text: 'Tu trembles. Vous tremblez tous comme ça ? J’ai oublié comment vous étiez faits.' },
    { scene: '02_village', who: 'Brume', text: 'Brume. C’est ainsi qu’ils m’appelaient, ceux d’avant. Il y avait un village, là. De la soupe, le soir.' },
    { scene: '02_epave', who: 'Brume', text: 'Puis ils ont cessé d’écrire, et la brume a tout pris. Ton bateau aussi… Pardon.' },
    { scene: '03_livre', who: 'Brume', text: 'Ce livre, je le garde depuis toujours. Il ne s’est jamais ouvert pour moi. … Toi, peut-être ?', hint: 'Toucher le livre' }
  ],
  // Étape 3, après la première page : le vent se lève pour de vrai et chasse la brume de la Grève
  souffle: [
    { scene: '03_vent', who: 'Brume', text: '… Qu’est-ce que tu as écrit ?' },
    { scene: '03_vent', who: 'Brume', text: 'Ils faisaient ça, ceux d’avant. Ils écrivaient, et l’île répondait.' },
    { scene: '03_vent', who: 'Brume', text: 'Tout ce que tu écriras reviendra. Les arbres, les bêtes… tout ce que la brume a pris.' }
  ],
  // Étapes 5 et 6, après la 3e page : un sceau se brise ; le feu, qui se voit de loin ; quelqu'un sur les rochers
  sceau: [
    { scene: '03_livre', who: 'Brume', text: 'Un sceau s’est brisé… Celui-là attend son gardien. Quelqu’un, quelque part.' },
    { scene: '02_proche', avatar: SHIVER, who: 'Brume', text: 'Tu grelottes. Ceux d’avant faisaient un cercle de galets, et le bois flotté au milieu.', hint: 'Toucher pour rassembler le bois' },
    { scene: '05_feu', still: true, who: 'Brume', text: 'Moi, je ne brûle rien. Je n’ai jamais rien réchauffé. … Je souffle quand même ?' },
    { scene: '05_feu', thought: true, text: 'Ça prend. Enfin.' },
    { scene: '05_feu', who: 'Brume', text: 'On le verra de loin, ton feu.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Tu as vu ? Là-bas, sur les rochers. Quelqu’un.' }
  ],
  // Aster débarque à la fin du tutoriel (après le premier chemin) : elle tire une caisse des vagues ; son arc, le
  // Ponton (l'identifiant « recolte » reste : des appareils l'ont déjà vue)
  recolte: [
    { scene: '10_aster', who: 'Aster', text: 'Ho, toi ! Tu étais sur l’Hirondelle ? Alors tire, elle pèse un âne mort !' },
    { scene: '10_aster', who: 'Aster', text: 'Aster, navigatrice. Officier de quart, pour être exacte. J’ai nagé vers ton feu toute la nuit.' },
    { scene: '10_aster', who: 'Aster', text: 'La mer rend ce qu’elle a pris. Un ponton, une ligne, et je te montre ce qu’elle garde encore !' }
  ],
  // Cannelle a regardé le feu toute la nuit ; son souvenir revient devant lui (son petit-neveu, elle en parle plus
  // tard, sur l'île : LINES.souci)
  cannelle: [
    { scene: '07_cannelle', who: 'Cannelle', text: 'Un feu ! J’ai cru que je rêvais. Toute la nuit, je l’ai regardé depuis les rochers.' },
    { scene: '07_cannelle', who: 'Cannelle', text: 'Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine.' },
    { scene: '07_souvenir', who: 'Cannelle', text: 'Les marmites, la cuisine du bord… Cannelle ! Je m’appelle Cannelle. Cuisinière, et pas des pires.' },
    { scene: '07_souvenir', who: 'Cannelle', text: 'Un feu follet ! … Oh. Il a des yeux de chiot, celui-là.' },
    { scene: '07_souvenir', who: 'Brume', text: 'Elle.' }
  ],
  // Rivet sous une voile échouée : l'homme qui répare tout n'ose plus rien construire de grand
  rivet: [
    { scene: '09_rivet', who: 'Rivet', text: 'Une soupe. Je sens une soupe. Sur une île déserte.' },
    { scene: '09_rivet', who: 'Rivet', text: 'Soit j’ai pris un coup sur la tête, soit… Non. J’ai pris un coup sur la tête.' },
    { scene: '09_rivet', who: 'Rivet', text: 'Rivet. Horloger. Je répare ce qui se répare. Ton feu tousse : le vent entre par là, et par là.' },
    { scene: '09_rivet', who: 'Rivet', text: 'Un établi, et tout devient possible. Attends… Non. Si !' },
    { scene: '09_rivet', who: 'Rivet', text: 'Commençons petit : une clôture. Le petit, je sais encore faire.' }
  ],
  // Ondin réveillé à La Source, Cannelle qui accourt (sa baguette, il en parle ensuite, sur l'île : LINES.baguette)
  ondin: [
    { scene: '11_ondin', who: 'Brume', text: 'Chut. Celui-là, la brume l’a bercé longtemps.' },
    { scene: '11_reveil', who: 'Ondin', text: 'J’ai dormi combien de temps ? L’eau a un goût de nuage.' },
    { scene: '11_reveil', who: 'Cannelle', text: 'Mon caneton ! Mon caneton !' },
    { scene: '11_reveil', who: 'Ondin', text: 'Tatie ? … C’est toi, Tatie ?' }
  ],
  // Fin du tutoriel : l'étape « Le Campement » ; Cannelle a recousu tes habits, Brume compte
  campement: [
    { scene: '12_habits', who: 'Cannelle', text: 'Tiens. On ne reconstruit pas une île en guenilles.' },
    { scene: '12_veillee', who: 'Brume', text: 'Un, deux, trois, quatre, cinq…' },
    { scene: '12_veillee', who: 'Brume', text: 'Je n’avais jamais compté plus loin qu’un.' },
    { scene: '12_veillee', who: 'Brume', text: 'Le feu, l’eau… Il manque un toit. Et le bois flotté s’épuise déjà.' }
  ]
};

// Le Grimoire, quand on lit ce qui est écrit sur sa page (un petit livre de cuir et sa gemme, pour la bulle)
const BOOK_FACE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="10" y="5" width="28" height="38" rx="3" fill="#6B2228" stroke="#2A0E0E" stroke-width="2"/><rect x="13" y="8" width="22" height="32" rx="2" fill="none" stroke="#D6AA5A" stroke-width="1.2"/><circle cx="24" cy="24" r="7" fill="none" stroke="#D6AA5A" stroke-width="1.2"/><circle cx="24" cy="24" r="2.6" fill="#C2475A" stroke="#7A5A1E"/></svg>')}`;

// Répliques pendant le jeu (la file du guide : chacune n'est dite qu'une fois). who : le bâtiment de qui parle (son
// portrait, avec son expression : mood, faces.bubbleFace) ; ou name et face : un autre que la troupe ; sans rien, Brume
export const LINES = {
  vent: { name: 'Le Grimoire', face: BOOK_FACE, text: '« Mêle l’Air à l’Air, et nomme ce qui naît. »' },
  pluie: 'Cette page a perdu son nom. Il ne reste qu’une devinette… Tu la lis, toi ?',
  seul: 'Encore une. Je ne dis rien : je regarde.',
  nom: 'Signe. Le livre se souviendra de toi, même si tu pars. … Tu ne pars pas, hein ?',
  greve: 'Le jour se lève sur Brumelune… La mer a rendu des choses, au rivage. Viens voir !',
  // Sur l'île
  claim: 'Je brille ! Touche-moi : ce que tu as fait mérite quelque chose.',
  // (Brume seule au début du tutoriel : Aster débarque à sa fin)
  epaves: 'La mer a rendu des choses, cette nuit : du bois flotté, des coquillages, des galets. Ramasse-les : on en fera quelque chose.',
  chaine: 'Une longue chaîne… et l’île t’en donne plus. Elle aime ça, je crois.',
  cendres: 'Ton feu de cette nuit n’est plus que cendres. Un vrai feu de camp, et on le verra du large.',
  flambe: 'Il flambe… Il chauffe ? Je crois que je le sens. Un peu.',
  bulle: { who: 'foyer', mood: 'malicieux', text: 'Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.' },
  soupe: { who: 'foyer', mood: 'content', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  caquets: { who: 'foyer', mood: 'surpris', text: 'Tu entends ? Des caquets, sous les rochers… Mes poules de la cuisine du bord ! Elles ont tenu bon !' },
  ponte: { who: 'foyer', mood: 'adore', text: 'Paprika, Brioche, Madame… Nourries, elles pondront. Des œufs, ma brindille : des omelettes !' },
  puzzle: { who: 'atelier', mood: 'determine', text: 'Chaque pièce a sa place. Tourne, essaie. Clic !' },
  or: { who: 'atelier', mood: 'pensif', text: 'Le vent veut éteindre le feu. Pose-la là où l’île brille d’or : elle le protégera.' },
  souci: { who: 'foyer', mood: 'triste', text: 'Mon Ondin… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ?' },
  source: { who: 'foyer', mood: 'surpris', text: 'De l’eau douce, il nous faudrait… Là-bas, au nord-ouest, ça brille dans la brume. Et ça ronfle ! Une source qui ronfle ?' },
  baguette: { who: 'puits', mood: 'triste', text: 'Avant, ma baguette tirait vers l’eau. Là, plus rien. Comme si on avait éteint la lumière, dedans.' },
  ruban: 'La mer lui a pris son savoir. Le livre, lui, s’en souvient.',
  chut: { who: 'puits', mood: 'emerveille', text: 'Chut… l’eau arrive.' },
  produit: { who: 'foyer', mood: 'emu', text: 'Ça, mon caneton, c’est de l’eau.' },
  glisse: { who: 'puits', mood: 'triste', text: 'L’eau, je la porte jusqu’au feu… mais l’herbe mouillée, ça glisse ! Mes seaux se renversent. Il me faudrait un chemin.' },
  pierres: 'L’île n’a qu’un sentier. Les autres, c’est toi qui les traces : du Puits jusqu’au Feu, pour commencer.',
  sentier: { who: 'puits', mood: 'content', text: 'Un vrai chemin ! Mes seaux arrivent pleins. Les autres, tu les traceras où tu veux.' }
};
