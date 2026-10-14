// Les scènes du tutoriel (HISTOIRE.md, § 9), image par image : le dessin (scene : une scène de la bibliothèque,
// game/sceneArt.js ; art : un dessin de PrologueArt.vue), alone (le joueur n'est pas encore à l'écran : on voit par ses
// yeux), avatar (une autre vue ou pose que celle de la scène : il grelotte quand il a peur ou froid), still (la scène
// reste sur sa première image), qui parle (null : personne ; thought : une pensée du joueur, qui ne parle jamais), le texte, un geste suggéré
// (hint), des choix qui font tous avancer (choices), et une image qui avance seule (auto, en ms).
// L'ordre : seul sur la plage de Brumelune, on se relève, on se découvre (la carte d'embarquement : l'avatar et le nom, entre
// « naufrage » et « arrivee »), puis Brume et le Grimoire. Brume accompagne la construction du premier camp et la
// première nuit. Aster arrive seulement au matin et ouvre son propre tutoriel.

import { BOOK_FACE } from '@/game/speakers';

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
    { scene: '02_village', who: 'Brume', text: 'Puis le ciel a brûlé, une nuit. Après… ils ont oublié, et la brume a tout pris.' },
    { scene: '02_epave', who: 'Brume', text: 'Ton bateau… Pardon. Je crois que c’est ma faute. Je ne sais pas pourquoi.' },
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
    // (le premier indice de l'étoile tombée, le Voile : HISTOIRE.md, § 7.2)
    { scene: '05_feu', thought: true, text: 'Une étoile file. Brume détourne les yeux.' },
    { scene: '05_feu', who: 'Brume', text: 'Dors. Je surveille la brume.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Là-bas, quelqu’un… n’ose pas venir. La nuit fait peur, quand on est seul.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Je veille sur nous deux ; demain, on lui fera une place près du feu.' }
  ],
  // Aster atteint le camp au matin et ouvre son tutoriel par la Récolte. L'identifiant « recolte » reste stable pour
  // les sauvegardes déjà créées.
  recolte: [
    // (soulagée, choix de l'auteur, 12 oct. : rassurée et reconnaissante, pas un grand sourire ; puis décidée)
    { scene: '10_aster', who: 'Aster', mood: 'soulage', text: 'Ho, toi ! Tu étais sur l’Hirondelle ? Alors donne-moi la main : la mer m’a lessivée !' },
    { scene: '10_aster', who: 'Aster', mood: 'soulage', text: 'Aster, navigatrice. Officier de quart, pour être exacte. J’ai nagé vers ton feu toute la nuit.' },
    { scene: '10_aster', who: 'Aster', mood: 'determine', text: 'La mer rend ce qu’elle a pris. Un ponton, une ligne, et je te montre ce qu’elle garde encore !' }
  ],
  // Cannelle regarde le feu depuis la première nuit (la silhouette, scène « nuit ») sans oser venir : elle a peur des feux
  // follets ; son souvenir revient devant lui (son petit-neveu, elle en parle plus tard, sur l'île : LINES.souci)
  cannelle: [
    { scene: '07_cannelle', who: 'Cannelle', text: 'Trois nuits que je regarde ton feu depuis les rochers. Je n’osais pas… à cause de lui.' },
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
    { scene: '09_rivet', who: 'Rivet', text: 'Commençons petit : une lanterne. Le petit, je sais encore faire.' }
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

// Répliques pendant le jeu (la file du guide : chacune n'est dite qu'une fois). who : le bâtiment de qui parle (son
// portrait, avec son expression : mood, faces.bubbleFace) ; ou name et face : un autre que la troupe ; sans rien, Brume
export const LINES = {
  vent: { name: 'Le Grimoire', face: BOOK_FACE, text: '« Mêle l’Air à l’Air, et nomme ce qui naît. »' },
  nom: 'Signe le Grimoire : ton île sera gardée, et tu la retrouveras sur n’importe quel appareil.',
  greve: 'Le Vent a chassé la brume du rivage ! Viens voir la plage de Brumelune : ta première page mérite sa récompense.',
  // (le Brasier écrit dans la même visite)
  'greve-feu': 'Le Vent et le Brasier sont écrits ! Viens sur la plage avant la nuit : tes pages méritent leur récompense, et le feu nous attend.',
  // Sur l'île : l'arrivée (Brume seule, la première page à écrire)
  ile: 'Voici Brumelune, notre île. La brume a tout endormi… Pour la réveiller, fabrique : le Grimoire garde les recettes. La première t’attend !',
  claim: 'Je brille ! Touche-moi : ce que tu as fait mérite quelque chose.',
  // La première nuit, seul : explorer à son rythme, puis dormir près du feu
  dormir: 'La nuit est à nous. Explore tant que tu veux ; quand tu voudras dormir, viens près de moi : je veillerai.',
  // Le jour d'Aster (choix de l'auteur, 11 oct.) : sa scène au réveil (elle sort de l'eau sur notre plage), sa caisse,
  // sa longue-vue qui choisit son camp (look : la caméra y va, WorldView coach.js), sa Récolte, son Ponton, le chemin
  // entre son camp et le nôtre, ses quatre piquets ; le soir, autour du feu, la deuxième nuit
  caisse: { who: 'ponton', mood: 'surpris', text: 'Ma caisse ! Elle a nagé moins vite que moi. Aide-moi à l’ouvrir.' },
  tresors: { who: 'ponton', mood: 'emu', text: 'Ma longue-vue… intacte. Et mon filet ! Le reste, on le gagnera.' },
  rend: 'La mer rend ce qu’elle a pris. C’est toi qui l’as dit.',
  installe: { who: 'ponton', mood: 'fier', text: 'Là, face à la mer : c’est là que je m’installe.', look: 'site:ponton' },
  rivage: { who: 'ponton', mood: 'determine', text: 'Viens au rivage. Relie ce qui se ressemble, vite, avant la marée.' },
  'bois-ponton': { who: 'ponton', mood: 'malicieux', text: 'Pas mal, pour un naufragé. Il nous faut vingt-cinq bois pour mon ponton.' },
  'ponton-bois': { who: 'ponton', mood: 'determine', text: 'Un ponton, et la mer devient un chemin.' },
  'ponton-tient': { who: 'ponton', mood: 'rire', text: 'Il tient ! Mon premier ponton à moi.' },
  'ponton-promesse': 'Il brille dans la brume… comme une promesse.',
  'chemin-camps': { who: 'ponton', mood: 'pensif', text: 'Deux camps, un seul feu. Un chemin, et plus personne ne se mouille les pieds.' },
  'chemin-pieds': 'Un chemin ! Les pieds le retrouvent, même dans la brume.',
  voisins: { who: 'ponton', mood: 'content', text: 'Voilà. Deux pas, et on est voisins.' },
  'joli-camp': { who: 'ponton', mood: 'malicieux', text: 'Naufragés, d’accord. Mais rien n’interdit d’avoir un joli camp.' },
  // Les clôtures : Brume vous apprend, à Aster et à toi, à quoi elles servent (choix de l'auteur, 11 oct.) ; la nuit de la
  // veillée (game/prologue.js : VEILLEE ; choix de l'auteur, 12 oct.), le feu baisse (demo : eteint), les égarés butent
  // dessus sous vos yeux (egare : folk.js, strayDemo), puis le feu repart (rallume)
  'egares-nuit': 'Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils ne sont pas méchants : ils cherchent ce qui brille, et marchent tout droit.',
  'egares-nord': { text: 'Ils viennent de la brume, de partout. Un enclos autour du feu, et ils font demi-tour.', look: 'barrage' },
  cachons: { text: 'Chut… Cachons-nous. Ne bouge plus.', look: 'site:foyer', demo: 'eteint' },
  'egare-la': { text: 'Chut… Là, au bord de la brume. Un égaré.', look: 'barrage', demo: 'egare' },
  visiteurs: { text: 'Ils viennent parfois, quand le feu baisse. Des égarés… Mieux vaut ne pas trop s’en approcher.', look: 'barrage' },
  'cloture-voyez': { text: 'Vous voyez ? Une clôture ne fait de mal à personne. Elle dit seulement : pas par ici.', look: 'site:foyer', demo: 'rallume' },
  'aster-dormir': { who: 'ponton', mood: 'content', text: 'Je dormirai mieux, ce soir.' },
  'cloture-deux': 'Une clôture, ça décore… ou ça protège. Bien placée, les deux à la fois. Plante-la tout autour du feu.',
  'chez-nous': 'Ça ressemble à un chez-nous.',
  cuisiner: { who: 'ponton', mood: 'gene', text: 'On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner.' },
  manger: 'Moi, je ne mange pas. Ça n’aide pas, je sais.',
  debrouiller: { who: 'ponton', mood: 'pensif', text: 'Demain, on se débrouillera. Ou quelqu’un viendra, qui sait faire.' },
  soir: 'Deux, ce soir, autour du feu. Dors : je veille.',
  // Brume reste seule avec le joueur jusqu'à la première nuit.
  epaves: 'La mer a rendu deux bois flottés et un galet. Ramasse tout : ce sera notre premier feu.',
  chaine: 'Plus la chaîne est longue, plus l’île te donne. Elle aime ça, je crois.',
  // Le Brasier dans la même visite du Grimoire que le Vent (choix de l'auteur, 11 oct.) : la brume levée vient de Brume,
  // qui ne sait plus la retenir ; puis le feu pour la nuit
  'brasier-brume': 'La brume s’est levée du rivage… C’est la mienne, tu sais. Je la laisse filer depuis si longtemps que j’ai oublié comment la retenir.',
  'brasier-nuit': 'La nuit tombe : il nous faudra un feu. Le Brasier dort dans ce livre, lui aussi.',
  // Le Brasier déjà écrit : le feu se bâtit tout de suite
  'feu-pret': 'Le Brasier est écrit, le bois et le galet ramassés : bâtissons le feu, là, avant la nuit.',
  // (un ancien parcours, le Brasier pas encore écrit : le joueur passe au Grimoire de lui-même, invité par sa bulle)
  cendres: { text: 'Il nous faut un feu pour la nuit. Le Brasier du Grimoire, le bois et les galets ramassés : de quoi bâtir un feu qui tiendra.', action: { label: 'Ouvrir le Grimoire', mode: 'infinite' } },
  flambe: 'Il flambe ! Avec lui, la nuit peut venir.',
  // Le jour de Cannelle (choix de l'auteur, 11 oct. : spec v2, sans la ponte offerte, qui viendra avec le coq). On va
  // vers elle (« ! ») ; ses coquillages, sa soupe (la leçon des bulles) ; un fil d'histoire ; la longue-vue d'Aster voit
  // la cage dériver (look : la caméra la suit, WorldView coach.js) ; les poules échappées, attrapées, nourries ; leur
  // poulailler (la leçon des annexes) ; le soir à trois, la troisième nuit
  'faim-aster': { who: 'ponton', mood: 'surpris', text: 'Une cuisinière ! Brume, dis-moi que je ne rêve pas.' },
  'faim-cannelle': { who: 'foyer', mood: 'malicieux', text: 'Moi, c’est ton ventre qui me fait rêver, ma brindille. On l’entend crier famine jusqu’aux rochers.' },
  'faim-bulle': 'Elle a raison. Regarde au-dessus d’elle : quand quelqu’un a besoin de toi, une bulle te le dit.',
  bulle: { who: 'foyer', mood: 'malicieux', text: 'Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.' },
  soupe: { who: 'foyer', mood: 'content', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  'bulles-reviennent': 'Les bulles reviennent, tu sais. On a toujours un peu faim, ou froid, ou envie de parler.',
  'brume-avale': { who: 'foyer', mood: 'pensif', text: 'Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d’autres naufragés ?' },
  'brume-retient': 'Peut-être. Je ne la retiens plus très bien. Ce qui y entre, je ne le vois pas toujours ressortir.',
  'caquets-eau': { who: 'ponton', mood: 'surpris', text: 'Chut ! Des caquets… sur l’eau ! Prends ma longue-vue.' },
  'mes-filles': { who: 'foyer', mood: 'emu', text: 'Mes filles ! Paprika, Brioche, Madame ! Elles ont tenu bon !', look: 'cage' },
  doucement: { who: 'foyer', mood: 'surpris', text: 'Doucement, mes jolies ! Attrape-les, ma brindille, elles ont eu peur.' },
  'tout-le-monde': { who: 'foyer', mood: 'adore', text: 'Paprika, Brioche, Madame… Tout le monde est là.' },
  'deux-vivres': { who: 'foyer', mood: 'triste', text: 'Elles ont faim, les pauvres. Deux vivres chacune.' },
  'recolte-nourrit': { who: 'foyer', mood: 'malicieux', text: 'La Récolte nourrit aussi, ma brindille.' },
  'un-toit': { who: 'foyer', mood: 'determine', text: 'Il leur faut un toit. Un petit poulailler, là, dans l’herbe, près de ma cuisine.' },
  'un-coq': { who: 'foyer', mood: 'pensif', text: 'Un toit, du grain… Il ne leur manque qu’un coq, à mes filles. Un jour.' },
  village: 'Un toit pour les poules, un feu pour nous. Ça devient un village, tu sais.',
  // L'abri de Cannelle, puis son enclos (choix de l'auteur, 13 oct. ; textes validés)
  marmite: { who: 'foyer', mood: 'fatigue', text: 'Mes filles ont un toit. Moi, je dors sur une marmite renversée… mais je ne me plains pas.' },
  'se-plaint': 'Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine.',
  'toit-a-moi': { who: 'foyer', mood: 'content', text: 'Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe.' },
  cuisines: 'Les égarés aiment les cuisines. Un enclos autour de la sienne, et elle dormira tranquille.',
  casseroles: { who: 'foyer', mood: 'malicieux', text: 'Et pas de piquet dans mes casseroles, hein.' },
  'en-ville': { who: 'foyer', mood: 'rire', text: 'Une cuisine avec une clôture. On se croirait en ville !' },
  'a-table': { who: 'foyer', mood: 'rire', text: 'À table ! Ce soir, on mange chaud.' },
  'trois-feu': { who: 'ponton', mood: 'emu', text: 'Trois autour du feu. Hier encore, on était deux.' },
  chaise: { who: 'foyer', mood: 'triste', text: 'Il manque une chaise… celle de mon Ondin. Mangez, avant que ça refroidisse.' },
  'soir-trois': 'Trois, ce soir. Dors : je veille.',
  puzzle: { who: 'atelier', mood: 'determine', text: 'Chaque pièce a sa place. Tourne, essaie. Clic !' },
  // Ses trois torches, une par côté d'où venaient les égarés (choix de l'auteur, 13 oct. ; textes validés)
  'torches-idee': { who: 'atelier', mood: 'determine', text: 'Hier soir, ils sont venus de trois côtés. Trois torches, une par côté. Clic, clic, clic.' },
  'torches-tiennent': { who: 'atelier', mood: 'fier', text: 'Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient.' },
  // Le soir à quatre, la quatrième nuit (choix de l'auteur, 13 oct. ; textes validés) ; puis LINES.souci, Cannelle
  'quatre-feu': { who: 'atelier', mood: 'rire', text: 'Quatre autour d’un feu. Tac. Il nous faudra une plus grande marmite.' },
  'soir-quatre': 'Quatre, ce soir. Dors : je veille.',
  or: { who: 'atelier', mood: 'pensif', text: 'Ta clôture dit « pas par ici ». Une lanterne dit « viens, petite luciole ». Pose-la là où l’île brille d’or.' },
  souci: { who: 'foyer', mood: 'triste', text: 'Mon Ondin… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ?' },
  // Le matin d'Ondin (choix de l'auteur, 14 oct. ; textes validés) : la longue-vue d'Aster voit une planche sur la vague ;
  // touchée, elle s'échoue un peu plus loin que le Ponton (look : la caméra la suit, WorldView coach.js)
  'planche-vue': { who: 'ponton', mood: 'surpris', text: 'Ohé ! Là, sur la vague… une planche ! Et quelqu’un dessus !' },
  'planche-dort': { who: 'ponton', mood: 'emu', text: 'Un enfant… Il dort ! La vague l’a posé tout doucement sur le sable.', look: 'planche' },
  source: { who: 'foyer', mood: 'surpris', text: 'De l’eau douce, il nous faudrait… Là-bas, au nord-ouest, une région brille encore dans la brume. Fais-la naître, et elle sera à nous.' },
  baguette: { who: 'puits', mood: 'triste', text: 'Avant, ma baguette tirait vers l’eau. Là, plus rien. Comme si on avait éteint la lumière, dedans.' },
  ruban: 'La brume lui a pris son savoir. Le livre, lui, s’en souvient.',
  chut: { who: 'puits', mood: 'emerveille', text: 'Chut… l’eau arrive.' },
  produit: { who: 'foyer', mood: 'emu', text: 'Ça, mon caneton, c’est de l’eau.' },
  glisse: { who: 'puits', mood: 'triste', text: 'L’eau, je la porte jusqu’au feu… mais l’herbe mouillée, ça glisse ! Mes seaux se renversent. Il me faudrait un chemin.' },
  pierres: 'Un chemin, ça se trace : du Puits jusqu’au sentier du Feu. Les premières pierres sont offertes.',
  sentier: { who: 'puits', mood: 'content', text: 'Un vrai chemin ! Mes seaux arrivent pleins. Les autres, tu les traceras où tu veux.' },
  // La Pluie écrite (choix de l'auteur, 12 oct. : la clé du Puits ; 14 oct. : textes validés) : elle tombe sur l'île tant
  // que ces répliques se lisent (demo : WorldView, folk.js et sky.js), la baguette d'Ondin frémit
  'pluie-brume': { text: 'Ta Pluie tombe sur l’île. Regarde Ondin.', demo: 'averse', look: 'habitant:puits' },
  'pluie-ondin': { who: 'puits', mood: 'emerveille', text: 'Elle a frémi. Là. … Elle n’avait plus bougé depuis que j’ai rêvé de la mer.', demo: 'averse' },
  // L'Athanor grandit (App : slotCount) : un emplacement de plus, puis quatre, juste avant la Vie
  'athanor-trois': 'L’Athanor s’élargit. Une place de plus. Ceux d’avant y mêlaient trois souffles, parfois… je l’avais oublié.',
  'athanor-quatre': 'Quatre places, maintenant. Air, Eau, Feu, Terre… Il ne manquait que quelqu’un pour les tenir ensemble.',
  // La première bouteille, le tutoriel fini (choix de l'auteur, 12 oct. ; WorldView chests.js : bottleAshore) : Aster la
  // voit, explique le courant ; Brume, qui se croit coupable, parle de « sa » brume (HISTOIRE.md, § 7.2). Puis, la
  // bouteille ouverte : le « H. » trouble Brume ; le premier mot d'Héliane (« Allume les lumières ») rappelle à Aster le
  // phare de sa grand-mère
  'bouteille-ecume': { who: 'ponton', mood: 'surpris', text: 'Là, dans l’écume ! Une bouteille. La mer rend ce qu’elle a pris.', look: 'bouteille' },
  'bouteille-courant': { who: 'ponton', mood: 'pensif', text: 'Le courant tourne quatre fois par jour. À chaque fois, il laisse quelque chose sur nos plages. Guette-les.' },
  'bouteille-brume': 'Ma brume avale les navires… Ce qu’elle ne sait pas garder, la mer le recrache. Du verre, des caisses. Des mots, parfois.',
  'bouteille-h': '« H. »… Ce H, je l’ai sur le bout de la flamme.',
  'bouteille-phare': { who: 'ponton', mood: 'emu', text: '« Allume les lumières. » Ma grand-mère gardait un phare : elle disait pareil.' }
};
