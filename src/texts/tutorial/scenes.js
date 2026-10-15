// Les scènes du tutoriel (HISTOIRE.md, § 9), image par image : le dessin (scene : une scène de la bibliothèque,
// game/sceneArt.js ; art : un dessin de PrologueArt.vue), alone (le joueur n'est pas encore à l'écran : on voit par ses
// yeux), avatar (une autre vue ou pose que celle de la scène : il grelotte quand il a peur ou froid), still (la scène
// reste sur sa première image), qui parle (null : personne ; 'joueur' : le joueur, sous son nom ; thought : sa pensée,
// quand il est seul), le texte (« arrivé|arrivée » : les deux formes, game/accord.js), un geste suggéré (hint), un geste
// ciblé (gesture : { label, x, y }, là où toucher sur l'image, en % de l'écran ; seul lui fait avancer), des choix qui
// font tous avancer (choices), une légende (caption), et une image qui avance seule (auto, en ms).
// L'ordre (choix de l'auteur, 14 oct. : ecriture/lots/01_ouverture.md) : le naufrage, la carte d'embarquement (l'avatar
// et le nom), l'arrivée, la page du Vent, le souffle, la page de garde, « Quel jour ? », le cercle de flammes, la page du
// Brasier, l'épave, la plage, la première nuit. Lorena arrive au matin et ouvre son propre tutoriel.

import { BOOK_FACE } from '@/game/speakers';

// Le joueur grelotte, de face (de peur ou de froid)
const SHIVER = { vue: 'face', pose: 'grelotter' };

export const SCENES = {
  // Le naufrage (choix de l'auteur, 14 oct. : ecriture/lots/01_ouverture.md, sur l'ouverture qu'il a écrite) :
  // l'annonce du capitaine coupée net, la vague, les racines sous l'eau, le noir ; le réveil vu par ses yeux, la plage,
  // les débris, la carte d'embarquement aperçue sur le sable
  naufrage: [
    { scene: '01_pont', alone: true, caption: 'L’Hirondelle, troisième nuit de croisière.', auto: 4200 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Attention, mesdames et messieurs, ici votre capitaine. Nous venons de percuter un élément inconnu : la coque est perforée.', auto: 5200 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Il nous reste assez de canots de sauvetage pour tout le monde. Je vous demande de vous organiser dans le calme.', auto: 5200 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Nous rencontrons des difficultés à manœ… — krrr — Aaah ! — krrrr… shhh…', auto: 3600 },
    { scene: '01_vague', auto: 2600 },
    // (sous la surface, les racines : rien ne s'explique)
    { scene: '01_racines', auto: 3000 },
    { scene: '01_noir', auto: 3000 },
    { scene: '01_paupieres', alone: true, thought: true, text: 'Du sable plein la bouche… Oh non. Où suis-je ?', hint: 'Toucher pour ouvrir les yeux' },
    { scene: '01_greve', alone: true, thought: true, text: 'Des valises, des morceaux de coque… Oh mon… Qu’est-ce que je vais pouvoir faire ?' },
    { scene: '01_carte', alone: true, thought: true, text: 'Ah, il y a quelque chose, là-bas.' },
    { scene: '01_carte', alone: true, thought: true, text: 'C’est ma carte d’embarquement… Super…' },
    { scene: '01_carte', alone: true, thought: true, text: 'Je ne vois pas ce que je vais pouvoir en faire. Bon. Regardons quand même…', hint: 'Toucher la carte' }
  ],
  // On se voit enfin, face à la mer. La lueur, Brume (vexée, outrée), puis le livre qu'elle garde. Le joueur parle
  // (who : 'joueur', sous son nom) ; seul, il pense
  arrivee: [
    { scene: '02_plage', thought: true, text: 'Bon. Maintenant que je me rappelle ma tête et mon nom, on va pouvoir voir où nous sommes.' },
    { scene: '02_plage', thought: true, text: 'Hm… Je crois que c’est bel et bien une île déserte.' },
    { scene: '02_plage', thought: true, text: 'Si seulement j’étais arrivé|arrivée ici sans naufrage, j’aurais peut-être aimé.' },
    { scene: '02_plage', thought: true, text: 'Je ne vois personne. Pourtant, j’aurais juré voir des silhouettes nager vers le rivage…' },
    { scene: '02_plage', thought: true, text: 'Tant pis. D’abord, avançons.', gesture: { label: 'Avancer', x: 50, y: 66 } },
    { scene: '02_lueur', avatar: SHIVER, who: 'joueur', text: 'Aaah ! Mais c’est quoi, ça ?!' },
    { scene: '02_lueur', avatar: SHIVER, who: 'joueur', text: 'Une étoile ? … C’est magique ?' },
    // (elle s'immobilise une seconde : Brume ne relève pas « étoile »)
    { scene: '02_approche', avatar: SHIVER, auto: 1400 },
    { scene: '02_rocher', avatar: SHIVER, who: 'Brume', text: 'Tu… Tu peux me voir ? Et me parler ?!' },
    { scene: '02_rocher', avatar: SHIVER, who: 'joueur', text: 'Quoi ? Tu es vivant ?' },
    { scene: '02_rocher', who: 'Brume', text: 'VivantE ! Je suis une fille, et je m’appelle Brume.' },
    { scene: '02_rocher', who: 'Brume', text: 'Cela faisait des lunes que je n’avais vu personne sur cette île.', gesture: { label: 'T’approcher', x: 56, y: 46 } },
    { scene: '02_rocher', who: 'joueur', text: 'Je ne comprends plus rien… Mais peu importe ! Qu’est-ce que tu es ?' },
    { scene: '02_rocher', who: 'joueur', text: 'C’est toi qui nous as fait naufrager ?' },
    { scene: '02_rocher', who: 'Brume', text: 'Je suis Brume… Et non ! Comment peux-tu penser ça de moi ? Je suis gentille !' },
    { scene: '02_rocher', who: 'Brume', text: 'Avant, j’étais autre chose. Maintenant, je ne suis plus remplie que de souvenirs flous… et de ce que je ressens.' },
    { scene: '03_livre', who: 'Brume', text: 'Attends, regarde ! Tu pourras peut-être faire comme ceux d’avant.' },
    { scene: '03_livre', who: 'Brume', text: 'Regarde. Peut-être que toi, tu comprendras.', hint: 'Toucher le livre' }
  ],
  // Après la page du Vent : il ouvre une trouée dans la brume (la plage proche ; l'épave reste au large). Le livre
  // change de mains ; on tourne la page (la page de garde, ou la suite)
  souffle: [
    { scene: '03_vent', auto: 2600 },
    { scene: '03_vent', who: 'Brume', text: 'Oh ! Mais toi aussi, tu sais commander aux éléments ?!' },
    { scene: '03_vent', who: 'joueur', text: 'Je… J’ignore ce qui s’est passé. C’est moi qui ai fait ça ?' },
    { scene: '03_vent', who: 'Brume', text: 'Oui ! Tu es comme eux ! Tu peux créer, donner vie à ce qui dort dans ce livre.' },
    { scene: '03_vent', who: 'Brume', text: 'Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir… et on dirait que c’est toi.', gesture: { label: 'Tourner la page', x: 72, y: 64 } }
  ],
  // « Quel jour ? » : elle regarde le ciel sans rien dire (après la page de garde, ou après « souffle »)
  jour: [
    { scene: '03_vent', who: 'joueur', text: 'Il y a déjà eu des gens, ici ?' },
    { scene: '03_vent', who: 'Brume', text: 'Ceux d’avant savaient beaucoup. On s’apprenait tout, eux et moi… Mais depuis ce jour, je ne me rappelle plus rien.' },
    { scene: '03_vent', who: 'joueur', text: 'Quel jour ?' },
    { scene: '03_ciel', auto: 2200 },
    { scene: '03_vent', who: 'Brume', text: 'Peu importe. Ce livre a d’autres choses pour toi. Mais il faudra être patient|patiente : il est très gros…' },
    { scene: '03_vent', who: 'Brume', text: '… et ses pages ont l’air d’avoir oublié, elles aussi, ce qu’elles contenaient.', gesture: { label: 'Lever les yeux', x: 50, y: 20 } }
  ],
  // La nuit qui vient : le besoin naît du joueur ; Brume le mène au vieux cercle de pierres, puis la page du Brasier
  cercle: [
    { scene: '03_vent', who: 'joueur', text: 'Oh non… Je sens que la nuit va être froide. Je n’ai ni abri, ni nourriture, ni de quoi me réchauffer.' },
    { scene: '03_vent', who: 'Brume', text: 'Non, non, ne t’en fais pas. Je ne réchauffe pas beaucoup, mais je brille. Je resterai près de toi jusqu’au matin.' },
    { scene: '03_vent', who: 'joueur', text: 'Bon… D’accord, Brume. On suit ton plan. Je n’ai pas d’autre choix, de toute façon.' },
    { scene: '03_vent', who: 'Brume', text: 'C’est vrai ! Viens, par là.', gesture: { label: 'Suivre Brume', x: 64, y: 44 } },
    { scene: '05_cercle', who: 'Brume', text: 'Autrefois, il y avait ici un cercle de flammes, et ceux d’avant tout autour.' },
    { scene: '05_cercle', who: 'Brume', text: 'Ils parlaient, dansaient, chantaient, riaient. Ils discutaient sérieusement, aussi. Et parfois, plus tristement.' },
    { scene: '05_cercle', who: 'Brume', text: 'C’était un vrai lieu de vie. Je m’en souviens si peu, et tellement à la fois… C’est étrange.' },
    { scene: '05_cercle', who: 'Brume', text: 'Pas grave ! Regarde : c’est ici que dansaient les flammes orange. Tu pourrais peut-être les refaire ?' }
  ],
  // Le Brasier écrit, avant la plage : l'épave promise pour le matin ; le doute de Brume, sa brume qu'elle ne retient plus
  epave: [
    { scene: '05_cercle', who: 'joueur', text: 'Attends. Je pense que mon bateau va s’échouer sur la plage : je pourrai sans doute récupérer mes affaires.' },
    { scene: '05_cercle', who: 'joueur', text: 'Tu es Brume, non ? Tu ne pourrais pas, justement, faire s’en aller la brume ?' },
    { scene: '05_cercle', who: 'Brume', text: 'Oui… Pardon pour ça. Il y a longtemps que j’ai oublié comment la retenir.' },
    { scene: '05_cercle', who: 'Brume', text: 'J’ai perdu la mémoire. Et le reste avec. Avant, j’étais plus grande. Bien plus.' },
    { scene: '05_cercle', who: 'joueur', text: 'Euh… D’accord. Écoute, ce n’est pas grave. Déjà, installons-nous.' }
  ],
  // Le feu est réellement bâti avant cette scène : elle ferme la première journée ; quelqu'un regarde le feu (Agathe)
  nuit: [
    { scene: '05_feu', still: true, who: 'Brume', text: 'Je n’ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n’ai pas froid.' },
    { scene: '05_feu', thought: true, text: 'Le feu tient. Pour cette nuit, cette plage suffira.' },
    { scene: '05_feu', who: 'Brume', text: 'Brumelune. C’est ainsi qu’ils appelaient l’île, ceux d’avant. Je n’avais plus dit ce nom depuis longtemps.' },
    // (le premier indice de l'étoile tombée, le Voile : HISTOIRE.md, § 7.2 ; ce qu'on voit, une légende)
    { scene: '05_feu', caption: 'Une étoile file. Brume détourne les yeux.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Là-bas, sur les rochers. Quelqu’un regarde ton feu.' },
    { scene: '06_silhouette', who: 'Brume', text: 'On lui fera une place, demain. Dors : je surveille la brume.' }
  ],
  // Lorena atteint le camp au matin et ouvre son tutoriel par la Récolte. L'identifiant « recolte » reste stable pour
  // les sauvegardes déjà créées.
  recolte: [
    // (soulagée, choix de l'auteur, 12 oct. : rassurée et reconnaissante, pas un grand sourire ; puis décidée)
    // (l'épave venue jusqu'aux rochers dans la nuit : la promesse de la veille se tient, à moitié)
    { scene: '10_epave', thought: true, text: 'L’épave est venue jusqu’aux rochers, cette nuit. Mes affaires sont quelque part là-dedans… ou au fond.' },
    { scene: '10_aster', who: 'Lorena', mood: 'soulage', text: 'Ho, du feu ! Tu étais sur l’Hirondelle ? Alors donne-moi la main. La mer ne m’a pas lâchée de la nuit.' },
    { scene: '10_aster', who: 'Lorena', mood: 'soulage', text: 'Lorena, navigatrice. Officier de quart, pour être exacte. J’ai nagé vers ton feu toute la nuit.' },
    { scene: '10_aster', who: 'Lorena', mood: 'determine', text: 'La mer rend ce qu’elle a pris. Un ponton, une ligne, et je te montre ce qu’elle garde encore.' }
  ],
  // Agathe regarde le feu depuis la première nuit (la silhouette, scène « nuit ») sans oser venir : elle a peur des feux
  // follets ; son souvenir revient devant lui (son petit-neveu, elle en parle plus tard, sur l'île : LINES.souci)
  cannelle: [
    { scene: '07_cannelle', who: 'Agathe', text: 'Deux nuits que je regarde ton feu depuis les rochers. Je n’osais pas… à cause de lui.' },
    { scene: '07_cannelle', who: 'Agathe', text: 'Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine.' },
    { scene: '07_souvenir', who: 'Agathe', text: 'Les marmites, la cuisine du bord… Agathe ! Je m’appelle Agathe. Cuisinière, et pas des pires.' },
    // (méfiante : le folklore des marais, la peur de toute une vie ; puis radoucie)
    { scene: '07_souvenir', who: 'Agathe', mood: 'effraye', text: 'Un feu follet… Ma mère disait qu’ils mènent les gens dans les marais, et qu’on ne les revoit jamais.' },
    { scene: '07_souvenir', who: 'Agathe', mood: 'emu', text: '… Celui-là a l’air plus perdu que nous.' },
    { scene: '07_souvenir', who: 'Brume', text: 'Elle.' }
  ],
  // Jovin sous une voile échouée : l'homme qui répare tout n'ose plus rien construire de grand
  rivet: [
    { scene: '09_rivet', who: 'Jovin', text: 'Une soupe. Je sens une soupe. Sur une île déserte.' },
    { scene: '09_rivet', who: 'Jovin', text: 'Soit j’ai pris un coup sur la tête, soit… Non. J’ai pris un coup sur la tête.' },
    { scene: '09_rivet', who: 'Jovin', text: 'Jovin. Horloger. Je répare ce qui se répare. Ton feu tousse : le vent entre par là, et par là.' },
    { scene: '09_rivet', who: 'Jovin', text: 'Une porte de cabine sur deux caisses, près du feu. Ce n’est pas un atelier. C’est un début.' },
    { scene: '09_rivet', who: 'Jovin', text: 'Commençons petit : une lanterne. Le petit, je sais encore faire.' }
  ],
  // Pierrot réveillé à La Source, Agathe qui accourt (sa baguette, il en parle ensuite, sur l'île : LINES.baguette)
  ondin: [
    { scene: '11_ondin', who: 'Brume', text: 'Chut. Celui-là, la brume l’a gardé longtemps.' },
    { scene: '11_reveil', who: 'Pierrot', text: 'J’ai dormi combien de temps ? L’eau a un goût de nuage.' },
    { scene: '11_reveil', who: 'Agathe', mood: 'emu', text: 'Mon caneton.' },
    { scene: '11_reveil', who: 'Pierrot', text: 'Tatie ? … Tu sens la soupe. Alors c’est vrai.' }
  ],
  // Fin du tutoriel : l'étape « Le Campement » ; Agathe a recousu tes habits, Brume compte
  campement: [
    { scene: '12_habits', who: 'Agathe', text: 'Tiens. On ne reconstruit pas une île en guenilles.' },
    { scene: '12_veillee', who: 'Brume', text: 'Un, deux, trois, quatre, cinq…' },
    { scene: '12_veillee', who: 'Brume', text: 'Je n’avais jamais compté plus loin qu’un.' },
    { scene: '12_veillee', who: 'Brume', text: 'Le feu, l’eau, des lumières… Il manque un toit. Et la mer ne rendra pas du bois éternellement.' }
  ],
  // Le conseil de la première veillée (l'arc du Phare, choix de l'auteur, 15 oct. : ecriture/lots/08_charnieres.md § 1,
  // validé) : un geste, la bûche remise au feu ; partir, les survivants, la tour vue par Pierrot. Puis la caméra vole
  // jusqu'au phare (WorldView, phare.js : flyToLighthouse), et le conseil reprend (conseil-suite) : le phare éteint, ce
  // que Brume se rappelle, la décision
  conseil: [
    { scene: '12_veillee', gesture: { label: 'Remettre une bûche dans le feu', x: 50, y: 62 } },
    { scene: '12_veillee', who: 'Lorena', text: 'Bon. On mange, on dort au sec. Et après, on trouve un moyen de quitter cette île.' },
    { scene: '12_veillee', who: 'Agathe', text: 'Et s’il y en a d’autres, de l’Hirondelle ? Le capitaine l’a dit : des canots pour tout le monde.' },
    { scene: '12_veillee', who: 'Pierrot', text: 'Chut… Là-bas, sur l’îlot. Une tour. Elle dort, elle aussi.' }
  ],
  'conseil-suite': [
    { scene: '12_veillee', who: 'Lorena', text: 'Un phare. Éteint. S’il brillait, un navire nous verrait.' },
    { scene: '12_veillee', who: 'Brume', text: 'Avant, il y avait des lumières partout. Je m’en souviens… un peu. Depuis, il n’y a plus que la brume.' },
    { scene: '12_veillee', thought: true, text: 'Alors on y va. Un pas après l’autre.' }
  ],
  // La traversée manquée (acte IV, au Bateau écrit ; lot 08 § 3, validé) : Lorena prend la mer vers l'îlot, la brume
  // la ramène doucement ; au retour, une voile. Rien ne se perd
  traversee: [
    { scene: 't_depart', alone: true },
    { scene: 't_depart', alone: true, who: 'Lorena', text: 'Cap sur l’îlot. Cette fois, c’est moi qui tiens la barre.' },
    { scene: 't_brume', alone: true },
    { scene: 't_brume', alone: true, who: 'Lorena', text: 'Le courant tourne. … Il nous ramène. Doucement, comme on raccompagne quelqu’un à sa porte.' },
    { scene: 't_retour', who: 'Brume', text: 'Ma brume ne te laisse pas passer. Pardon… Je ne la retiens plus.' },
    { scene: 't_retour', who: 'Lorena', text: 'Pas encore, c’est tout.' },
    { scene: 't_voile', who: 'Lorena', text: 'Une voile. … Ceux-là ne se sont pas brisés. Ils ont vu nos lanternes.' }
  ],
  // L'intérieur du phare (acte VI, la clé trouvée ; lot 08 § 5, validé) : la porte cède ; le journal d'Héliane, la
  // lentille fendue ; Brume, qui sait qu'elle était l'île, parle peu
  phare: [
    { scene: 'p_porte', alone: true },
    { scene: 'p_journal', alone: true, who: 'Le journal d’Héliane', text: '« Le feu s’est éteint la nuit où le ciel est tombé. Une brume froide l’a soufflé. Aucun feu ordinaire n’y tient plus. — H. »' },
    { scene: 'p_journal', alone: true, who: 'Le journal d’Héliane', text: '« Il faudrait un feu qui ne craigne pas la brume. Un feu vivant. J’en ai noté la recette, au cas où : Feu follet. »' },
    { scene: 'p_lentille', alone: true, who: 'Jovin', text: 'Fendue. Je pourrais la réparer… (Il se tait.) Je pourrais.' },
    { scene: 'p_lentille', alone: true, who: 'Brume', text: 'Feu follet. … Elle avait écrit ce que je suis, avant même que j’existe.' }
  ],
  // Le navire des parents de Pierrot (acte VII, après la veillée VII ; lot 08 § 6, validé) : guidés par le Phare de
  // Brume, ils venaient le chercher, et restent ; la Carte des mers, le navire de l'île, une autre lumière au nord
  navire: [
    { scene: 'n_voile', alone: true },
    { scene: 'n_voile', alone: true, who: 'Pierrot', text: 'Chut… Ma baguette ne tremble plus vers l’ouest. … C’est eux.' },
    { scene: 'n_ponton', who: 'La mère de Pierrot', text: 'On venait te chercher. Et on arrive chez toi, on dirait.' },
    { scene: 'n_ponton', who: 'La mère de Pierrot', text: 'Votre île n’est sur aucune carte. Il y en a d’autres, dans la brume. Je vais les dessiner.' },
    { scene: 'n_ponton', who: 'Le père de Pierrot', text: 'Le navire reste au Ponton. Il connaît une route ; il apprendra les autres.' },
    { scene: 'n_ponton', who: 'Le père de Pierrot', text: 'En venant, on a vu une autre lumière, au nord, dans une autre brume. Trois éclats, puis rien.' },
    { scene: 'n_ponton', who: 'Lorena', text: 'Trois éclats, puis rien… Mon frère faisait ça.' },
    { scene: 'n_nord', alone: true }
  ]
};

// Le Grimoire, quand on lit ce qui est écrit sur sa page (un petit livre de cuir et sa gemme, pour la bulle)

// Répliques pendant le jeu (la file du guide : chacune n'est dite qu'une fois). who : le bâtiment de qui parle (son
// portrait, avec son expression : mood, faces.bubbleFace) ; ou name et face : un autre que la troupe ; sans rien, Brume
export const LINES = {
  vent: { name: 'Le Grimoire', face: BOOK_FACE, text: '« Mêle l’Air à l’Air, et nomme ce qui naît. »' },
  nom: 'Ce livre est à toi, maintenant. Mets ton nom sur la première page.',
  greve: 'Le vent a ouvert la plage. Viens voir.',
  // (le Brasier écrit dans la même visite)
  'greve-feu': 'Viens. Il reste un peu de jour, et du bois sur la plage.',
  // Sur l'île : l'arrivée (Brume seule, la première page à écrire)
  ile: 'Elle dort, sous la brume. Ton livre saura peut-être la réveiller.',
  claim: 'Je brille plus fort, tu as vu ? Touche-moi : j’ai quelque chose pour toi.',
  // La première nuit, seul : explorer à son rythme, puis dormir près du feu
  dormir: 'Va voir la plage, si tu veux. Quand tu auras sommeil, reviens près du feu : je veille.',
  // Le jour de Lorena (choix de l'auteur, 11 oct.) : sa scène au réveil (elle sort de l'eau sur notre plage), sa caisse,
  // sa longue-vue qui choisit son camp (look : la caméra y va, WorldView coach.js), sa Récolte, son Ponton, le chemin
  // entre son camp et le nôtre, ses quatre piquets ; le soir, autour du feu, la deuxième nuit
  caisse: { who: 'ponton', mood: 'surpris', text: 'Ma caisse ! Elle a nagé moins vite que moi. Aide-moi à l’ouvrir.' },
  tresors: { who: 'ponton', mood: 'emu', text: 'Ma longue-vue… intacte. Et mon filet ! Le reste, on le gagnera.' },
  rend: 'La mer rend ce qu’elle a pris. C’est toi qui l’as dit.',
  installe: { who: 'ponton', mood: 'fier', text: 'Là, face à la mer : c’est là que je m’installe.', look: 'site:ponton' },
  rivage: { who: 'ponton', mood: 'determine', text: 'Viens au rivage. La marée laisse des choses, et elle les reprend vite.' },
  // (les deux formes, chacune d'un mot : game/accord.js)
  'bois-ponton': { who: 'ponton', mood: 'malicieux', text: 'Pas mal, pour un|une naufragé|naufragée. Pour mon ponton, il en faudra bien plus.' },
  'ponton-bois': { who: 'ponton', mood: 'determine', text: 'Un ponton, et la mer devient un chemin.' },
  'ponton-tient': { who: 'ponton', mood: 'rire', text: 'Il tient. Ma grand-mère aurait tapé du talon dessus, pour voir.' },
  // (le Ponton n'a pas de fanal au palier I : la réplique de remplacement, choix de l'auteur, 14 oct.)
  'ponton-promesse': 'Un ponton. La mer a un chemin pour revenir, maintenant.',
  'chemin-camps': { who: 'ponton', mood: 'pensif', text: 'Deux camps, un seul feu. Un chemin, et plus personne ne se mouille les pieds.' },
  'chemin-pieds': 'Un chemin. Les pieds le retrouvent, même dans la brume.',
  voisins: { who: 'ponton', mood: 'content', text: 'Voilà. Deux pas, et on est voisins.' },
  'joli-camp': { who: 'ponton', mood: 'malicieux', text: 'Naufragés, d’accord. Mais rien n’interdit d’avoir un joli camp.' },
  // Les clôtures : Brume vous apprend, à Lorena et à toi, à quoi elles servent (choix de l'auteur, 11 oct.) ; la nuit de la
  // veillée (game/prologue.js : VEILLEE ; choix de l'auteur, 12 oct.), le feu baisse (demo : eteint), les égarés butent
  // dessus sous vos yeux (egare : demos.js, strayDemo), puis le feu repart (rallume)
  'egares-nuit': 'Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils cherchent ce qui brille… sans savoir pourquoi.',
  'egares-nord': { text: 'Ils viennent de partout. Une clôture tout autour du feu… et ils s’arrêtent, je crois.', look: 'barrage' },
  cachons: { text: 'Chut… Cachons-nous. Ne bouge plus.', look: 'site:foyer', demo: 'eteint' },
  'egare-la': { text: 'Chut… Là, au bord de la brume. Un égaré.', look: 'barrage', demo: 'egare' },
  visiteurs: { text: 'Celui-là marche les yeux fermés. Il ne regarde même pas le feu.', look: 'barrage' },
  // (le Dormeur, endormi contre l'enclos : choix de l'auteur, 15 oct., ecriture/lots/03_egares.md)
  'dormeur-pique': { text: 'Il s’est endormi contre les piquets. … Comme s’il n’attendait que ça.', look: 'barrage' },
  'cloture-voyez': { text: 'Le feu repart. Ils rentrent dans la brume, sans un bruit. Ils reviendront.', look: 'site:foyer', demo: 'rallume' },
  'aster-dormir': { who: 'ponton', mood: 'content', text: 'Je dormirai mieux, ce soir.' },
  'cloture-deux': 'Une clôture, ça décore. Bien placée, ça protège aussi. Tout autour du feu, alors.',
  'chez-nous': 'Ça ressemble à un chez-nous.',
  cuisiner: { who: 'ponton', mood: 'gene', text: 'On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner.' },
  manger: 'Moi, je ne mange pas. Ça n’aide pas, je sais.',
  debrouiller: { who: 'ponton', mood: 'pensif', text: 'Demain, on se débrouillera. Ou quelqu’un viendra, qui sait faire.' },
  soir: 'Deux, ce soir, autour du feu. Dors : je veille.',
  // Brume reste seule avec le joueur jusqu'à la première nuit.
  epaves: 'Du bois flotté. Et là, les pierres du vieux cercle. Rassemble tout : on va le rallumer.',
  chaine: 'L’île donne plus à ceux qui vont loin. Elle aime ça, je crois.',
  // Le Brasier déjà écrit : le feu se bâtit tout de suite
  'feu-pret': 'Tout y est. Là, au milieu des pierres.',
  // (un ancien parcours, le Brasier pas encore écrit : le joueur passe au Grimoire de lui-même, invité par sa bulle)
  cendres: { text: 'Il faudra des flammes pour la nuit. Ton livre sait peut-être leur donner vie.', action: { label: 'Ouvrir le Grimoire', mode: 'infinite' } },
  flambe: 'Les flammes orange… comme avant. Maintenant, la nuit peut venir.',
  // Le jour d’Agathe (choix de l'auteur, 11 oct. : spec v2, sans la ponte offerte, qui viendra avec le coq). On va
  // vers elle (« ! ») ; ses coquillages, sa soupe (la leçon des bulles) ; un fil d'histoire ; la longue-vue de Lorena voit
  // la cage dériver (look : la caméra la suit, WorldView coach.js) ; les poules échappées, attrapées, nourries ; leur
  // poulailler (la leçon des annexes) ; le soir à trois, la troisième nuit
  'faim-aster': { who: 'ponton', mood: 'surpris', text: 'Une cuisinière ! Brume, dis-moi que je ne rêve pas.' },
  'faim-cannelle': { who: 'foyer', mood: 'malicieux', text: 'Ton ventre, je l’entends depuis les rochers. Assieds-toi. Un ventre vide ne bâtit rien.' },
  'faim-bulle': 'Elle a raison. Et elle aussi a faim : regarde-la.',
  bulle: { who: 'foyer', mood: 'malicieux', text: 'Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.' },
  soupe: { who: 'foyer', mood: 'content', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  'bulles-reviennent': 'Ça revient, tu sais. On a toujours un peu faim, ou froid, ou envie de parler.',
  'brume-avale': { who: 'foyer', mood: 'pensif', text: 'Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d’autres naufragés ?' },
  'brume-retient': 'Peut-être. Je ne la retiens plus très bien. Ce qui y entre, je ne le vois pas toujours ressortir.',
  'caquets-eau': { who: 'ponton', mood: 'surpris', text: 'Chut. Des caquets… sur l’eau ! Prends ma longue-vue.' },
  'mes-filles': { who: 'foyer', mood: 'emu', text: 'Mes filles ! Caramel, Flocon, Réglisse… Elles ont tenu bon.', look: 'cage' },
  doucement: { who: 'foyer', mood: 'surpris', text: 'Doucement. Elles ont vu la mer de trop près, elles aussi.' },
  'tout-le-monde': { who: 'foyer', mood: 'adore', text: 'Caramel, Flocon, Réglisse… Tout le monde est là.' },
  'deux-vivres': { who: 'foyer', mood: 'triste', text: 'Elles ont faim. Une nuit en mer dans une cage, ça creuse.' },
  'recolte-nourrit': { who: 'foyer', mood: 'malicieux', text: 'La marée nourrit aussi. Demande à Lorena.' },
  'un-toit': { who: 'foyer', mood: 'determine', text: 'Il leur faut un toit. Un petit poulailler, là, dans l’herbe, près de ma cuisine.' },
  'un-coq': { who: 'foyer', mood: 'pensif', text: 'Un toit, du grain… Il ne leur manque qu’un coq, à mes filles. Un jour.' },
  village: 'Un toit pour les poules, un feu pour nous. Ça devient un village, tu sais.',
  // L'abri d’Agathe, puis son enclos (choix de l'auteur, 13 oct. ; textes validés)
  marmite: { who: 'foyer', mood: 'fatigue', text: 'Mes filles ont un toit. Moi, je dors sur une marmite renversée… mais je ne me plains pas.' },
  'se-plaint': 'Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine.',
  'toit-a-moi': { who: 'foyer', mood: 'content', text: 'Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe.' },
  cuisines: 'Les égarés cherchent ce qui brille, et une cuisine brille toute la nuit. Un enclos autour de la sienne.',
  casseroles: { who: 'foyer', mood: 'malicieux', text: 'Et pas de piquet dans mes casseroles, hein.' },
  'en-ville': { who: 'foyer', mood: 'rire', text: 'Une cuisine avec une clôture. On se croirait en ville !' },
  'a-table': { who: 'foyer', mood: 'rire', text: 'À table ! Ce soir, on mange chaud.' },
  'trois-feu': { who: 'ponton', mood: 'emu', text: 'Trois autour du feu. Hier encore, on était deux.' },
  chaise: { who: 'foyer', mood: 'triste', text: 'Il manque une chaise… celle de mon Pierrot. Mangez, avant que ça refroidisse.' },
  'soir-trois': 'Trois, ce soir. Dors : je veille.',
  puzzle: { who: 'atelier', mood: 'determine', text: 'Chaque pièce a sa place. Tourne, essaie. Elle te dira quand c’est la bonne.' },
  // Ses trois torches, une par côté d'où venaient les égarés (choix de l'auteur, 13 oct. ; textes validés)
  'torches-idee': { who: 'atelier', mood: 'determine', text: 'Hier soir, ils sont venus de trois côtés. Trois torches, une par côté. Ce n’est pas du génie, c’est de l’arithmétique.' },
  'torches-tiennent': { who: 'atelier', mood: 'fier', text: 'Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient.' },
  // Le soir à quatre, la quatrième nuit (choix de l'auteur, 13 oct. ; textes validés) ; puis LINES.souci, Agathe
  'quatre-feu': { who: 'atelier', mood: 'rire', text: 'Quatre autour d’un feu. Il nous faudra une plus grande marmite. Ou un plus petit Jovin.' },
  'soir-quatre': 'Quatre, ce soir. Dors : je veille.',
  or: { who: 'atelier', mood: 'pensif', text: 'Une clôture leur barre la route. Une lumière… je ne sais pas encore ce qu’elle leur fait. On verra cette nuit.' },
  souci: { who: 'foyer', mood: 'triste', text: 'Mon Pierrot… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ?' },
  // Le matin de Pierrot (choix de l'auteur, 14 oct. ; textes validés) : la longue-vue de Lorena voit une planche sur la vague ;
  // touchée, elle s'échoue un peu plus loin que le Ponton (look : la caméra la suit, WorldView coach.js)
  'planche-vue': { who: 'ponton', mood: 'surpris', text: 'Ohé ! Là, sur la vague… une planche. Et quelqu’un dessus.' },
  'planche-dort': { who: 'ponton', mood: 'emu', text: 'Un enfant… Il dort. La vague l’a posé sur le sable, tout doucement.', look: 'planche' },
  baguette: { who: 'puits', mood: 'triste', text: 'Avant, ma baguette tirait vers l’eau. Là, plus rien. Comme si on avait éteint la lumière, dedans.' },
  ruban: 'La brume lui a pris son savoir. Le livre, lui, s’en souvient.',
  chut: { who: 'puits', mood: 'emerveille', text: 'Chut… l’eau arrive.' },
  produit: { who: 'foyer', mood: 'emu', text: 'Ça, mon caneton, c’est de l’eau.' },
  glisse: { who: 'puits', mood: 'pensif', text: 'L’eau arrive jusqu’au feu à moitié. L’autre moitié reste dans l’herbe. Elle aime bien l’herbe.' },
  pierres: 'Un chemin, du Puits jusqu’au feu. L’eau arrivera entière, et l’herbe s’en remettra.',
  sentier: { who: 'puits', mood: 'content', text: 'Un vrai chemin. Mes seaux arrivent pleins, maintenant. L’herbe va s’ennuyer.' },
  // La Pluie écrite (choix de l'auteur, 12 oct. : la clé du Puits ; 14 oct. : textes validés) : elle tombe sur l'île tant
  // que ces répliques se lisent (demo : WorldView, demos.js et sky.js), la baguette de Pierrot frémit
  'pluie-brume': { text: 'Ta Pluie tombe sur l’île. Regarde Pierrot.', demo: 'averse', look: 'habitant:puits' },
  'pluie-ondin': { who: 'puits', mood: 'emerveille', text: 'Elle a frémi. Là. … Elle n’avait plus bougé depuis que j’ai rêvé de la mer.', demo: 'averse' },
  // L'Athanor grandit (App : slotCount) : un emplacement de plus, puis quatre, juste avant la Vie
  'athanor-trois': 'L’Athanor s’élargit. Une place de plus. Ceux d’avant y mêlaient trois souffles, parfois… je l’avais oublié.',
  'athanor-quatre': 'Quatre places, maintenant. Air, Eau, Feu, Terre… Il ne manquait que quelqu’un pour les tenir ensemble.',
  // La première bouteille, le tutoriel fini (choix de l'auteur, 12 oct. ; WorldView chests.js : bottleAshore) : Lorena la
  // voit, explique le courant ; Brume, qui se croit coupable, parle de « sa » brume (HISTOIRE.md, § 7.2). Puis, la
  // bouteille ouverte : le « H. » trouble Brume ; le premier mot d'Héliane (« Allume les lumières ») rappelle à Lorena le
  // phare de sa grand-mère
  'bouteille-ecume': { who: 'ponton', mood: 'surpris', text: 'Là, dans l’écume ! Une bouteille. La mer rend ce qu’elle a pris.', look: 'bouteille' },
  'bouteille-courant': { who: 'ponton', mood: 'pensif', text: 'Le courant tourne quatre fois par jour. À chaque fois, il laisse quelque chose sur nos plages. Guette-les.' },
  'bouteille-brume': 'Ma brume avale les navires… Ce qu’elle ne sait pas garder, la mer le recrache. Du verre, des caisses. Des mots, parfois.',
  'bouteille-h': '« H. »… Ce H, je l’ai sur le bout de la flamme.',
  'bouteille-phare': { who: 'ponton', mood: 'emu', text: '« Allume les lumières. » Ma grand-mère gardait un phare : elle disait pareil.' }
};
