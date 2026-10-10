// Les scènes du tutoriel (HISTOIRE.md, § 9), image par image : le dessin (scene : une scène de la bibliothèque,
// game/sceneArt.js ; art : un dessin de PrologueArt.vue), alone (le joueur n'est pas encore à l'écran : on voit par ses
// yeux), avatar (une autre vue ou pose que celle de la scène : il grelotte quand il a peur ou froid), still (la scène
// reste sur sa première image), qui parle (null : personne ; thought : une pensée du joueur, qui ne parle jamais), le texte, un geste suggéré
// (hint), des choix qui font tous avancer (choices), et une image qui avance seule (auto, en ms).
// L'ordre : seul sur la plage de Brumelune, on se relève, on se découvre (la carte d'embarquement : l'avatar et le nom, entre
// « naufrage » et « arrivee »), puis Brume et le Grimoire. Brume accompagne la construction du premier camp et la
// première nuit. Aster arrive seulement au matin et ouvre son propre tutoriel.
// Le joueur grelotte, de face (de peur ou de froid)
const SHIVER = { vue: 'face', pose: 'grelotter' };

export const SCENES = {
  // Étape 1 : la tempête, le noir, la plage de Brumelune. Le joueur se relève seul et trouve sa carte d'embarquement
  naufrage: [
    { scene: '01_pont', alone: true, caption: 'L’Hirondelle, troisième nuit de croisière.', auto: 4200 },
    { scene: '01_pont', alone: true, who: 'Le haut-parleur', text: 'Mesdames et messieurs, le commandant vous prie de regagner… krrr… vos cabines…' },
    { scene: '01_vague', auto: 2600 },
    { scene: '01_noir', auto: 3000 },
    { scene: '01_greve', alone: true, thought: true, text: 'Du sable dans la bouche. La mer. Rien d’autre.', hint: 'Toucher pour te relever' },
    { scene: '01_gilet', alone: true, thought: true, text: 'Ohé ? … Quelqu’un ?' },
    { scene: '01_gilet', alone: true, thought: true, text: 'Seule la mer répond. Dans ma poche, un carton trempé : ma carte d’embarquement.', hint: 'Toucher la carte' }
  ],
  // On se voit enfin. Brume et le joueur se rencontrent sans détour, puis elle confie le livre qu'elle garde.
  arrivee: [
    { scene: '02_lueur', thought: true, text: 'Une lumière, là-bas ! Une lanterne… On me cherche !' },
    { scene: '02_approche', avatar: SHIVER, thought: true, text: 'Ce n’est pas une lanterne. Les marins disent que les feux follets égarent les voyageurs.' },
    { scene: '02_rocher', avatar: SHIVER, who: 'Brume', text: 'Tu me vois. … Tu me vois vraiment ?' },
    { scene: '02_yeux', who: 'Brume', text: 'Brume. C’est ainsi qu’ils m’appelaient, ceux d’avant.' },
    { scene: '02_village', who: 'Brume', text: 'Là, il y avait un village. Des rires, le soir. De la soupe.' },
    { scene: '02_village', who: 'Brume', text: 'Puis ils ont cessé de fabriquer, et la brume a tout pris.' },
    { scene: '02_epave', who: 'Brume', text: 'Ton bateau… Pardon. La brume est épaisse, ces temps-ci.' },
    { scene: '02_proche', who: 'Brume', text: 'Reste près de moi. Je ne suis pas bien chaude, mais je brille.' },
    { scene: '03_livre', who: 'Brume', text: 'Je le garde depuis toujours. Je n’ai jamais su le lire. Eux savaient.' },
    { scene: '03_livre', who: 'Brume', text: 'Il ne s’est jamais ouvert pour moi. Jamais. … Toi, peut-être ?', hint: 'Toucher le livre' }
  ],
  // Étape 3, après la première page : le vent se lève pour de vrai et chasse la brume de la plage de Brumelune
  souffle: [
    { scene: '03_vent', who: 'Brume', text: '… Qu’est-ce que tu as fait naître ?' },
    { scene: '03_vent', who: 'Brume', text: 'Ils faisaient ça, ceux d’avant. Ils fabriquaient, et l’île répondait.' },
    { scene: '03_vent', who: 'Brume', text: 'Tout ce que tu feras naître reviendra. Les arbres, les bêtes… tout ce que la brume a pris.' }
  ],
  // Le feu est réellement bâti avant cette scène : elle ferme la première journée, puis annonce quelqu'un au matin.
  nuit: [
    { scene: '05_feu', still: true, who: 'Brume', text: 'Je n’ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n’ai pas froid.' },
    { scene: '05_feu', thought: true, text: 'Le feu tient. Pour cette nuit, cette plage suffira.' },
    { scene: '05_feu', who: 'Brume', text: 'Dors. Je surveille la brume.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Tu as vu ? Là-bas… Quelqu’un a vu ton feu. Demain, nous ne serons plus seuls.' }
  ],
  // Aster atteint le camp au matin et ouvre son tutoriel par la Récolte. L'identifiant « recolte » reste stable pour
  // les sauvegardes déjà créées.
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
    { scene: '09_rivet', who: 'Rivet', text: 'Je monte un établi près du feu : avec lui, tout devient possible. Ou presque.' },
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
  nom: 'Signe le Grimoire : ton île sera gardée, et tu la retrouveras sur n’importe quel appareil.',
  greve: 'Le Vent a chassé la brume du rivage ! Viens voir la plage de Brumelune : ta première page mérite sa récompense.',
  // Sur l'île : l'arrivée (Brume seule, la première page à écrire)
  ile: 'Voici Brumelune, notre île. La brume a tout endormi… Pour la réveiller, fabrique : le Grimoire garde les recettes. La première t’attend !',
  claim: 'Je brille ! Touche-moi : ce que tu as fait mérite quelque chose.',
  // La première nuit, seul : explorer à son rythme, puis dormir près du feu
  dormir: 'La nuit est à nous. Explore tant que tu veux ; quand tu voudras dormir, viens près de moi : je veillerai.',
  // Le jour d'Aster (choix de l'auteur, 10 oct.) : Brume la voit dans les vagues ; Aster, arrivée, montre son coin ; le
  // soir, la deuxième nuit
  aube: 'Le jour ! Et là, dans les vagues… quelqu’un. Vite !',
  coin: { who: 'ponton', mood: 'fier', text: 'Ici. Face à la mer, je plante mon camp. Un ponton, un jour, et la mer nous rendra ce qu’elle garde.' },
  // Le soir d'Aster, avant la nuit : sa longue-vue montre l'îlot au large (look : la caméra y va, WorldView coach.js),
  // puis Brume ramène au chantier du Ponton
  vue: { who: 'ponton', mood: 'fier', text: 'Ma longue-vue a tenu bon. Regarde, là-bas, sous la brume : d’autres terres.', look: 'ilot' },
  mener: { text: 'Un ponton d’abord. La mer nous y mènera.', look: 'site:ponton' },
  soir: 'Deux, ce soir, autour du feu. Dors : je veille.',
  // Brume reste seule avec le joueur jusqu'à la première nuit.
  epaves: 'La mer a rendu six choses : du bois flotté, des coquillages, des galets. Ramasse tout : ce sera notre premier camp.',
  chaine: 'Plus la chaîne est longue, plus l’île te donne. Elle aime ça, je crois.',
  // (le joueur passe au Grimoire de lui-même, invité par sa bulle : jamais de saut d'onglet automatique)
  cendres: { text: 'Il nous faut un feu pour la nuit. Le Brasier du Grimoire, le bois et les galets ramassés : de quoi bâtir un feu qui tiendra.', action: { label: 'Ouvrir le Grimoire', mode: 'infinite' } },
  flambe: 'Il flambe ! Avec lui, la nuit peut venir.',
  bulle: { who: 'foyer', mood: 'malicieux', text: 'Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.' },
  soupe: { who: 'foyer', mood: 'content', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  caquets: { who: 'foyer', mood: 'surpris', text: 'Tu entends ? Des caquets, sous les rochers… Mes poules de la cuisine du bord ! Elles ont tenu bon !' },
  ponte: { who: 'foyer', mood: 'adore', text: 'Paprika, Brioche, Madame… Nourries, elles pondront. Des œufs, ma brindille : des omelettes !' },
  puzzle: { who: 'atelier', mood: 'determine', text: 'Chaque pièce a sa place. Tourne, essaie. Clic !' },
  or: { who: 'atelier', mood: 'pensif', text: 'Le vent veut éteindre le feu. Pose-la là où l’île brille d’or : elle le protégera.' },
  souci: { who: 'foyer', mood: 'triste', text: 'Mon Ondin… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ?' },
  source: { who: 'foyer', mood: 'surpris', text: 'De l’eau douce, il nous faudrait… Là-bas, au nord-ouest, une région brille encore dans la brume. Fais-la naître, et elle sera à nous.' },
  baguette: { who: 'puits', mood: 'triste', text: 'Avant, ma baguette tirait vers l’eau. Là, plus rien. Comme si on avait éteint la lumière, dedans.' },
  ruban: 'La mer lui a pris son savoir. Le livre, lui, s’en souvient.',
  chut: { who: 'puits', mood: 'emerveille', text: 'Chut… l’eau arrive.' },
  produit: { who: 'foyer', mood: 'emu', text: 'Ça, mon caneton, c’est de l’eau.' },
  glisse: { who: 'puits', mood: 'triste', text: 'L’eau, je la porte jusqu’au feu… mais l’herbe mouillée, ça glisse ! Mes seaux se renversent. Il me faudrait un chemin.' },
  pierres: 'Un chemin, ça se trace : du Puits jusqu’au sentier du Feu. Les premières pierres sont offertes.',
  sentier: { who: 'puits', mood: 'content', text: 'Un vrai chemin ! Mes seaux arrivent pleins. Les autres, tu les traceras où tu veux.' }
};
