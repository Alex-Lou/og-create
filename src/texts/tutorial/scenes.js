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
    { scene: '01_pont', alone: true, caption: 'L’Hirondelle, troisième jour de croisière.', auto: 6720 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Attention, mesdames et messieurs, ici votre capitaine. Nous venons de percuter un élément inconnu : la coque est perforée.', auto: 8320 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Il nous reste assez de canots de sauvetage pour tout le monde. Je vous demande de vous organiser dans le calme.', auto: 8320 },
    { scene: '01_pont', alone: true, who: 'Le capitaine', text: 'Nous rencontrons des difficultés à manœ… — krrr — Aaah ! Mais que sont ces choses ?! — krrrr… shhh…', auto: 7360 },
    // (la lame, puis sous la surface, les racines : rien ne s'explique ; le noir. La même scène que le pont, d'une
    // traite : choix de l'auteur, 18 oct.)
    { scene: '01_pont', alone: true, auto: 4160 },
    { scene: '01_pont', alone: true, auto: 4800 },
    { scene: '01_pont', alone: true, auto: 4800 },
    { scene: '01_paupieres', alone: true, thought: true, text: 'Du sable plein la bouche… Oh non. Où suis-je ?', hint: 'Toucher pour ouvrir les yeux' },
    { scene: '01_greve', alone: true, thought: true, text: 'Des valises, des morceaux de coque… Oh mon… Qu’est-ce que je vais pouvoir faire ?' },
    { scene: '01_carte', alone: true, thought: true, text: 'Ah, il y a quelque chose, là-bas.' },
    { scene: '01_carte', alone: true, thought: true, text: 'C’est ma carte d’embarquement… Super…' },
    { scene: '01_carte', alone: true, thought: true, text: 'Je ne vois pas ce que je vais pouvoir en faire. Bon. Regardons quand même…', hint: 'Toucher la carte' }
  ],
  // On se voit enfin, face à la mer. La lueur, Brume (vexée, outrée), puis le livre qu'elle garde. Le joueur parle
  // (who : 'joueur', sous son nom) ; seul, il pense
  arrivee: [
    // (la carte remplie : « Embarqué », le tampon, et le vent l'emporte ; l'image avance seule, après son animation)
    { scene: '00_tampon', alone: true, auto: 3600 },
    { scene: '02_plage', thought: true, text: 'Bon. Maintenant que je me rappelle ma tête et mon nom, on va pouvoir voir où nous sommes.' },
    { scene: '02_plage', thought: true, text: 'Hm… Je crois que c’est bel et bien une île déserte.' },
    { scene: '02_plage', thought: true, text: 'Si seulement j’étais arrivé|arrivée ici sans naufrage, j’aurais peut-être aimé.' },
    { scene: '02_plage', thought: true, text: 'Je ne vois personne. Pourtant, j’aurais juré voir des silhouettes nager vers le rivage…' },
    { scene: '02_plage', thought: true, text: 'Tant pis. D’abord, avançons.', gesture: { label: 'Avancer', x: 50, y: 66 } },
    { scene: '02_lueur', avatar: SHIVER, who: 'joueur', text: 'Aaah ! Mais c’est quoi, ça ?!' },
    { scene: '02_lueur', avatar: SHIVER, who: 'joueur', text: 'Une étoile ? … C’est magique ? Ça veut me tuer ?' },
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
    { scene: '03_vent', who: 'Brume', text: 'Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir… et on dirait que… c’est toi.', gesture: { label: 'Tourner la page', x: 72, y: 64 } }
  ],
  // « Quel jour ? » : elle regarde le ciel sans rien dire (après la page de garde, ou après « souffle »)
  jour: [
    { scene: '03_trouee', who: 'joueur', text: 'Il y a déjà eu des gens, ici ?' },
    { scene: '03_trouee', who: 'Brume', text: 'Ceux d’avant savaient beaucoup. On s’apprenait tout, eux et moi… Mais depuis ce jour, je ne me rappelle plus rien.' },
    { scene: '03_trouee', who: 'joueur', text: 'Quel jour ?' },
    { scene: '03_ciel', auto: 2200 },
    { scene: '03_trouee', who: 'Brume', text: 'Peu importe. Ce livre a d’autres choses pour toi. Mais il faudra être patient|patiente : il est très gros…' },
    { scene: '03_trouee', who: 'Brume', text: '… et ses pages ont l’air d’avoir oublié, elles aussi, ce qu’elles contenaient.', gesture: { label: 'Lever les yeux', x: 50, y: 20 } }
  ],
  // La nuit qui vient : le besoin naît du joueur ; Brume le mène au vieux cercle de pierres, puis la page du Brasier
  cercle: [
    { scene: '03_nuit', who: 'joueur', text: 'Oh non… Je sens que la nuit va être froide. Je n’ai ni abri, ni nourriture, ni de quoi me réchauffer.' },
    { scene: '03_nuit', who: 'Brume', text: 'Non, non, ne t’en fais pas. Je ne réchauffe pas beaucoup, mais je brille. Je resterai près de toi jusqu’au matin.' },
    { scene: '03_nuit', who: 'joueur', text: 'Bon… D’accord, Brume. On suit ton plan. Je n’ai pas d’autre choix, de toute façon, mais je vais quand même mourir de froid !' },
    { scene: '03_nuit', who: 'Brume', text: 'Ah… C’est vrai ! Viens, par là.', gesture: { label: 'Suivre Brume', x: 64, y: 44 } },
    { scene: '05_cercle', who: 'Brume', text: 'Autrefois, il y avait ici un cercle de flammes, et ceux d’avant tout autour.' },
    { scene: '05_cercle', who: 'Brume', text: 'Ils parlaient, dansaient, chantaient, riaient. Ils discutaient sérieusement, aussi. Et parfois, plus tristement.' },
    { scene: '05_cercle', who: 'Brume', text: 'C’était un vrai lieu de vie. Je m’en souviens si peu, et tellement à la fois… C’est étrange.' },
    { scene: '05_cercle', who: 'Brume', text: 'Pas grave ! Regarde : c’est ici que dansaient les flammes orange. Tu pourrais peut-être les refaire ?' }
  ],
  // Le Brasier écrit, avant la plage : l'épave promise pour le matin ; le doute de Brume, sa brume qu'elle ne retient plus
  epave: [
    { scene: '05_promesse', who: 'joueur', text: 'Attends. Je pense que mon bateau va s’échouer sur la plage : je pourrai sans doute récupérer mes affaires.' },
    { scene: '05_promesse', who: 'joueur', text: 'Tu es Brume, non ? Tu ne pourrais pas, justement, faire s’en aller la brume ?' },
    { scene: '05_promesse', who: 'Brume', text: 'Oui… Pardon pour ça. Il y a longtemps que j’ai oublié comment la retenir.' },
    { scene: '05_promesse', who: 'Brume', text: 'J’ai perdu la mémoire. Et le reste avec. Avant, j’étais plus grande. Bien plus forte aussi.' },
    { scene: '05_promesse', who: 'joueur', text: 'Euh… D’accord. Écoute, ce n’est pas grave. Déjà, installons-nous.' }
  ],
  // Le feu est réellement bâti avant cette scène : elle ferme la première journée ; quelqu'un regarde le feu (Agathe)
  nuit: [
    { scene: '05_feu', still: true, who: 'Brume', text: 'Je n’ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n’ai pas froid.' },
    { scene: '05_feu', thought: true, text: 'Le feu tient. Pour cette nuit, cette plage suffira.' },
    { scene: '05_feu', who: 'Brume', text: 'Brumelune. C’est ainsi qu’ils appelaient l’île, ceux d’avant. Je n’avais plus dit ce nom depuis longtemps.' },
    // (le premier indice de l'étoile tombée, le Voile : HISTOIRE.md, § 7.2 ; ce qu'on voit, une légende)
    { scene: '05_feu', caption: 'Une étoile file. Brume détourne les yeux.' },
    { scene: '06_silhouette', who: 'Brume', text: 'Là-bas, sur les rochers. Quelqu’un regarde ton feu.' },
    { scene: '06_silhouette', who: 'Brume', text: 'On lui fera une place demain, si le cœur lui en dit. En attendant, dors : je veille sur nous.' }
  ],
  // Lorena atteint le camp au matin et ouvre son tutoriel par la Récolte. L'identifiant « recolte » reste stable pour
  // les sauvegardes déjà créées.
  recolte: [
    // (soulagée, choix de l'auteur, 12 oct. : rassurée et reconnaissante, pas un grand sourire ; puis décidée)
    // (l'épave venue jusqu'aux rochers dans la nuit : la promesse de la veille se tient, à moitié)
    { scene: '10_epave', thought: true, text: 'L’épave est venue jusqu’aux rochers, cette nuit… Elle aurait pu nous rentrer dedans, j’ai rien entendu…' },
    { scene: '10_epave', thought: true, text: 'Mes affaires sont quelque part là-dedans… ou au fond.' },
    { scene: '10_aster', who: 'Lorena', mood: 'soulage', text: 'Ho, du feu ! Toi aussi, tu étais sur le navire ? Alors donne-moi la main. La mer ne m’a pas lâchée de la nuit.' },
    { scene: '10_aster', who: 'Lorena', mood: 'soulage', text: 'Lorena, navigatrice. Officier de quart, pour être exacte. J’ai nagé vers ton feu toute la nuit.' },
    // (sa réplique, en deux bulles : elle ne tient pas dans une seule)
    { scene: '10_aster', who: 'Lorena', mood: 'soulage', text: 'J’ai failli me faire attraper par deux requins, et j’ai cru voir un tentacule immense… Bref !' },
    { scene: '10_aster', who: 'joueur', text: 'Un requin ? Un tentacule géant ? Mais tu es certaine de ne pas avoir halluciné ?' },
    { scene: '10_aster', who: 'Lorena', mood: 'pensif', text: 'J’aurais préféré, crois-moi.' },
    { scene: '10_aster', who: 'Lorena', mood: 'content', text: 'En tout cas ! La mer rend ce qu’elle a pris. Un ponton, une ligne, et je te montre ce qu’on va pouvoir en faire.' },
    { scene: '10_aster', who: 'joueur', text: 'On ? Parce que… tu t’installes avec nous ?' },
    { scene: '10_aster', who: 'Lorena', mood: 'determine', text: 'Pourquoi ? Tu y vois un inconvénient ? Et ton animal domestique, il a quelque chose contre moi ?' },
    { scene: '10_aster', who: 'Brume', text: 'Je ne suis PAS un animal ! Et encore moins domestique ! Je suis Brume !' },
    { scene: '10_aster', who: 'Lorena', mood: 'surpris', text: 'Oh, mais ça parle ! Ça, par exemple ! Je n’avais encore jamais vu ça !' },
    { scene: '10_aster', who: 'joueur', text: 'Ah, parce que survivre aux requins et voir un tentacule géant, ça va, mais la flammèche qui parle, c’est la goutte d’eau, c’est ça ?' },
    { scene: '10_aster', who: 'Lorena', mood: 'gene', text: 'Je… Je n’avais juste jamais… parlé à une entité… magique !' },
    { scene: '10_aster', who: 'Lorena', mood: 'determine', text: 'Quoi qu’il en soit ! On va devoir trouver un moyen de survivre. Cette île est étrange, croyez-en mon expérience.' },
    { scene: '10_aster', who: 'Lorena', mood: 'determine', text: 'Construisons-nous un véritable abri de naufragés.' },
    { scene: '10_aster', who: 'Brume', text: 'Elle a raison. Ici, la nuit comme le jour, ce n’est pas toujours très calme… Il arrive des choses…' },
    { scene: '10_aster', who: 'joueur', text: 'Euuh… Brume ? Ça va ? On devrait savoir quelque chose ?' },
    { scene: '10_aster', who: 'Brume', text: 'Oubliez ça. Je vous aiderai à bien tout comprendre.' }
  ],
  // Agathe regarde le feu depuis la première nuit (la silhouette, scène « nuit ») sans oser venir : elle a peur des feux
  // follets ; son souvenir revient devant lui (son petit-neveu, elle en parle plus tard, sur l'île : LINES.souci)
  cannelle: [
    { scene: '07_cannelle', who: 'Agathe', text: 'Deux nuits que je regarde ton feu depuis les rochers. Je n’osais pas approcher… à cause de lui.' },
    { scene: '07_cannelle', who: 'joueur', text: 'Lui ? … Tu parles de Brume ?' },
    // (méfiante : le folklore des marais, la peur de toute une vie ; puis radoucie)
    { scene: '07_cannelle', who: 'Agathe', mood: 'effraye', text: 'Un feu follet ! Ma mère disait qu’ils mènent les gens dans les marais, et qu’on ne les revoit jamais.' },
    // (vexée)
    { scene: '07_cannelle', who: 'Brume', text: 'Je ne mène personne dans les marais ! Je ne sais même pas où ils sont, moi.' },
    { scene: '07_cannelle', who: 'Brume', text: 'Et d’abord, je suis une ELLE ! Arrêtez de me prendre pour un IL ! Je suis gentille, moi !' },
    { scene: '07_cannelle', who: 'Agathe', mood: 'gene', text: 'Je… d’accord. J’ignorais que tu parlais. Et que fais-tu ici, au juste ?' },
    { scene: '07_cannelle', who: 'Brume', text: 'Je suis la gardienne de l’île et du Grimoire. Il est maintenant entre les mains de celui|celle qui devait le recevoir.' },
    { scene: '07_cannelle', who: 'Brume', text: 'Grâce à lui, vous pourrez redonner vie à l’île.' },
    { scene: '07_cannelle', who: 'Agathe', mood: 'surpris', text: 'Tu dis qu’on peut tout fabriquer avec ce livre ?' },
    { scene: '07_cannelle', who: 'Brume', text: 'Absolument tout !' },
    { scene: '07_cannelle', who: 'Agathe', mood: 'emerveille', text: 'Mais ma parole ! C’est magnifique ! Je vais pouvoir cuisiner les saveurs du monde, et même en inventer de nouvelles !' },
    { scene: '07_cannelle', who: 'Brume', text: 'Attention ! Vous pouvez tout fabriquer… à condition d’avoir ce qu’il faut pour le faire.' },
    { scene: '07_cannelle', who: 'Brume', text: 'Les ingrédients ne sont pas toujours faciles à trouver, ni à atteindre. Il faudra traverser des endroits où même moi, j’ai peur d’aller.' },
    { scene: '07_cannelle', who: 'Agathe', mood: 'effraye', text: 'C’est vrai… Je les ai vues. Et cette nuit, ces… choses, au bord de la brume. Je n’ai pas fermé l’œil.' },
    { scene: '07_cannelle', who: 'joueur', text: 'Bienvenue au club. Ici, personne ne dort beaucoup.' },
    { scene: '07_cannelle', who: 'Agathe', text: 'Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine.' },
    // (son souvenir revient devant le feu : son petit-neveu, elle en parle plus tard, sur l'île : LINES.souci)
    { scene: '07_souvenir', who: 'Agathe', text: 'Les marmites, la cheffe à bord… Agathe ! Je m’appelle Agathe. Adoratrice des saveurs en tous genres, et pas des pires.' },
    { scene: '07_souvenir', who: 'joueur', text: 'Une cheffe ? Tu tombes à pic.' },
    { scene: '07_souvenir', who: 'Lorena', mood: 'content', text: 'Depuis deux jours, on vit de baies et de racines !' },
    { scene: '07_souvenir', who: 'Agathe', mood: 'degoute', text: 'Des racines ?! Ma pauvre brindille… Plus jamais ça tant que je serai là.' },
    { scene: '07_souvenir', who: 'Agathe', mood: 'determine', text: 'Ensemble, nous serons plus forts. Mais avec l’estomac bien rempli, encore plus !' },
    { scene: '07_souvenir', who: 'Agathe', mood: 'emu', text: '… Ton feu follet a l’air plus perdu que nous, finalement.' },
    { scene: '07_souvenir', who: 'Brume', text: 'Elle. Je suis une ELLE. … Mais merci de le comprendre.' }
  ],
  // Nathan sous une voile échouée : l'homme qui répare tout n'ose plus rien construire de grand
  rivet: [
    { scene: '09_rivet', who: 'Nathan', mood: 'etourdi', text: 'Une soupe. Je dois halluciner… Ça y est, je vais mourir sur une île déserte.' },
    { scene: '09_rivet', who: 'Nathan', mood: 'etourdi', text: 'Soit j’ai pris un coup sur la tête, soit… Non. J’ai pris un coup sur la tête.' },
    { scene: '09_rivet', who: 'joueur', text: 'Ça dépend. Tu vois aussi une petite flamme qui flotte et qui parle ?' },
    { scene: '09_rivet', who: 'Nathan', mood: 'surpris', text: '… Oui. Bon. Alors c’est un gros coup.' },
    { scene: '09_rivet', who: 'Brume', text: 'Je ne suis pas une hallucination ! Et encore moins un coup sur la tête !' },
    { scene: '09_rivet', who: 'Nathan', mood: 'pensif', text: 'Une flamme sans mèche, sans huile, sans rien… Ça défie toutes les lois que je connais.' },
    { scene: '09_rivet', who: 'Brume', text: 'Je ne défie personne, moi. Je suis polie.' },
    { scene: '09_rivet', who: 'Agathe', mood: 'malicieux', text: 'Laisse-la tranquille et viens manger, toi. Tu es tout gris.' },
    // (sa réplique, en deux bulles : elle ne tient pas dans une seule)
    { scene: '09_rivet', who: 'Nathan', mood: 'gene', text: 'C’est la brume. Trois nuits dessous, sous une voile échouée. Elle m’en a fait voir de toutes les couleurs.' },
    { scene: '09_rivet', who: 'Nathan', mood: 'gene', text: 'J’ai cru que j’allais y passer à plus d’une reprise !' },
    { scene: '09_rivet', who: 'Lorena', mood: 'malicieux', text: 'Et il a un nom, le rescapé ?' },
    { scene: '09_rivet', who: 'Nathan', mood: 'gene', text: 'Veuillez m’excuser ! Nathan. Horloger. Je répare ce qui se répare. … Et attends… ton feu tousse : le vent entre par là, et par là.' },
    { scene: '09_rivet', who: 'Lorena', mood: 'malicieux', text: 'Deux minutes qu’il est là, et il critique déjà le camp.' },
    { scene: '09_rivet', who: 'Nathan', text: 'Une porte de cabine sur deux caisses, près du feu. Ce n’est pas un atelier. Mais c’est un début.' },
    { scene: '09_rivet', who: 'joueur', text: 'Et tu pourrais nous construire quoi, avec ça ?' },
    // (l'homme qui répare tout n'ose plus rien construire de grand)
    { scene: '09_rivet', who: 'Nathan', mood: 'gene', text: 'Commençons petit : une lanterne. Le petit, je sais encore faire.' },
    { scene: '09_rivet', who: 'Brume', text: 'Et le grand ?' },
    { scene: '09_rivet', who: 'Nathan', mood: 'triste', text: '… Une autre fois.' },
    { scene: '09_rivet', who: 'Agathe', mood: 'fache', text: 'Hé ! Tu viens à peine d’arriver, et tu n’as encore rien mangé !' },
    { scene: '09_rivet', who: 'Nathan', mood: 'gene', text: 'Oh oui ! J’arrive, un instant !' }
  ],
  // Léo réveillé à La Source, Agathe qui accourt (sa baguette, il en parle ensuite, sur l'île : LINES.baguette)
  ondin: [
    { scene: '11_ondin', who: 'Brume', text: 'Chut. Celui-là, ma brume l’a gardé longtemps. Mais attendez… Ne serait-ce pas… ?' },
    { scene: '11_reveil', who: 'Léo', text: 'J’ai dormi combien de temps ? L’eau a un goût horrible, ici.' },
    { scene: '11_reveil', who: 'Léo', mood: 'endormi', text: 'T’es une fée ? Moi, je suis Léo.' },
    { scene: '11_reveil', who: 'Brume', text: '… Une fée. Oui. Ça, ça me plaît.' },
    { scene: '11_reveil', who: 'Agathe', mood: 'emu', text: 'Mon caneton… Mon caneton !' },
    { scene: '11_reveil', who: 'Léo', text: 'Tatie ? … Tu sens la soupe. Alors c’est vrai, je rêve plus… On est bien perdus sur une île, alors ?' },
    { scene: '11_reveil', who: 'Agathe', mood: 'emu', text: 'Tu t’es réveillé… Tu t’es réveillé ! Je le savais, que tu savais nager.' },
    { scene: '11_reveil', who: 'Léo', mood: 'surpris', text: 'Nager ? Je n’ai jamais su nager, Tatie… Je me suis réveillé sur une planche.' },
    { scene: '11_reveil', who: 'Léo', text: 'Et ensuite, je me suis pris un coup sur la tête, et je me suis réveillé ici.' },
    { scene: '11_reveil', who: 'joueur', text: 'Encore un qui a eu une chance inouïe…' },
    { scene: '11_reveil', who: 'Nathan', mood: 'gene', text: '… Bon. Quelqu’un a un mouchoir ? C’est pour… Agathe.' }
  ],
  // Fin du tutoriel : l'étape « Le Campement » ; Agathe a recousu tes habits, Brume compte
  campement: [
    { scene: '12_habits', who: 'Agathe', text: 'Tiens. On ne reconstruit pas une île en guenilles.' },
    { scene: '12_habits', who: 'joueur', text: 'Tu as recousu mes habits ? Quand ça ?' },
    { scene: '12_habits', who: 'Agathe', mood: 'malicieux', text: 'Pendant que tu dormais. Moi, je ne dors pas beaucoup, ici. Personne, d’ailleurs. Pas avec ces… choses qui rôdent la nuit…' },
    { scene: '12_veillee', who: 'Brume', text: 'Rassurez-vous : nous avons déjà de quoi nous défendre, même si vous ne le voyez pas encore.' },
    { scene: '12_veillee', who: 'joueur', text: 'C’est vrai que les ressources sont partout. Encore faut-il savoir les utiliser à notre avantage.' },
    { scene: '12_veillee', who: 'Lorena', text: 'Le feu, l’eau, des lumières… Il manque un toit digne de ce nom. Et la mer ne rendra pas du bois éternellement.' },
    { scene: '12_veillee', who: 'Lorena', mood: 'determine', text: 'Il faudra vite trouver un autre moyen d’avoir du bois, et de s’en servir.' }
  ],
  // Le conseil de la première veillée (l'arc du Phare, choix de l'auteur, 15 oct. : ecriture/lots/08_charnieres.md § 1,
  // validé) : un geste, la bûche remise au feu ; partir, les survivants, la tour vue par Léo. Puis la caméra vole
  // jusqu'au phare (WorldView, phare.js : flyToLighthouse), et le conseil reprend (conseil-suite) : le phare éteint, ce
  // que Brume se rappelle, la décision. La pluie (choix de l'auteur, 16 oct.) : le ciel s'assombrit, Lorena la voit
  // venir (sa réplique validée le 16 oct.), les premières gouttes tombent avec Agathe, elle s'installe avec Léo ;
  // l'orage pendant le vol, la pluie au retour (meteo : { nuages, pluie }, de 0 à 1 : SceneArt). Sa veillée (16 oct.) :
  // dessinée à part, sous l'orage qui vient (outils/scenes/conseil.cjs) ; ses nuages sont dans l'image, le voile reste
  // léger
  conseil: [
    { scene: 'conseil_veillee', meteo: { nuages: 0.1, pluie: 0 }, gesture: { label: 'Remettre une bûche dans le feu', x: 50, y: 64 } },
    // (sa réplique validée, en deux bulles : elle ne tient pas dans une seule)
    { scene: 'conseil_veillee', meteo: { nuages: 0.16, pluie: 0 }, who: 'Lorena', text: 'Bon. On mange, et on tâche de ne pas finir trempés : ces nuages-là arrivent droit sur nous.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.2, pluie: 0 }, who: 'Lorena', text: 'Et après… on trouve un moyen de quitter cette île.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.22, pluie: 0 }, who: 'Nathan', mood: 'pensif', text: 'Quitter l’île… avec quoi ? Une porte de cabine et deux caisses ?' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.24, pluie: 0.3 }, who: 'Agathe', text: 'Et s’il y en a d’autres, de l’Hirondelle ? Le capitaine l’a dit : des canots pour tout le monde…' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.27, pluie: 0.6 }, who: 'joueur', text: 'Oui, il l’a dit… Juste avant qu’on soit tous engloutis par je ne sais quoi, d’ailleurs.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, who: 'Léo', text: 'Là-bas, sur l’îlot. Une tour.' }
  ],
  'conseil-suite': [
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, who: 'Lorena', text: 'Un phare. Éteint. S’il brillait, un navire nous verrait.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, who: 'Brume', text: 'Avant, il y avait des lumières partout. Je m’en souviens… un peu.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, who: 'joueur', text: 'Et depuis ?' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, who: 'Brume', text: '… Il n’y a plus que la brume. Ma brume.' },
    { scene: 'conseil_veillee', meteo: { nuages: 0.3, pluie: 1 }, thought: true, text: 'Alors on y va. Un pas après l’autre.' }
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
    { scene: 'p_lentille', alone: true, who: 'Nathan', text: 'Fendue. Je pourrais la réparer… (Il se tait.) Je pourrais.' },
    { scene: 'p_lentille', alone: true, who: 'Brume', text: 'Feu follet. … Elle avait écrit ce que je suis, avant même que j’existe.' }
  ],
  // Le navire des parents de Léo (acte VII, après la veillée VII ; lot 08 § 6, validé) : guidés par le Phare de
  // Brume, ils venaient le chercher, et restent ; la Carte des mers, le navire de l'île, une autre lumière au nord
  navire: [
    { scene: 'n_voile', alone: true },
    { scene: 'n_voile', alone: true, who: 'Léo', text: 'Chut… Ma baguette ne tremble plus vers l’ouest. … C’est eux.' },
    { scene: 'n_ponton', who: 'La mère de Léo', text: 'On venait te chercher. Et on arrive chez toi, on dirait.' },
    { scene: 'n_ponton', who: 'La mère de Léo', text: 'Votre île n’est sur aucune carte. Il y en a d’autres, dans la brume. Je vais les dessiner.' },
    { scene: 'n_ponton', who: 'Le père de Léo', text: 'Le navire reste au Ponton. Il connaît une route ; il apprendra les autres.' },
    { scene: 'n_ponton', who: 'Le père de Léo', text: 'En venant, on a vu une autre lumière, au nord, dans une autre brume. Trois éclats, puis rien.' },
    { scene: 'n_ponton', who: 'Lorena', text: 'Trois éclats, puis rien… Mon frère faisait ça.' },
    { scene: 'n_nord', alone: true }
  ]
};

// Le Grimoire, quand on lit ce qui est écrit sur sa page (un petit livre de cuir et sa gemme, pour la bulle)

// Répliques pendant le jeu (la file du guide : chacune n'est dite qu'une fois). who : le bâtiment de qui parle (son
// portrait, avec son expression : mood, faces.bubbleFace), ou 'joueur' (sous son nom, son avatar) ; ou name et face : un
// autre que la troupe ; sans rien, Brume
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
  caisse: { who: 'ponton', mood: 'surpris', text: 'Mes affaires ! Je n’arrive pas à y croire ! Aidez-moi à l’attraper !' },
  tresors: { who: 'ponton', mood: 'emu', text: 'Ma longue-vue, mon compas… intacts. Et mon filet ! Tant pis pour le reste, on se débrouillera avec ce qu’on a déjà là !' },
  rend: 'La mer rend ce qu’elle a pris. C’est toi qui l’as dit.',
  installe: { who: 'ponton', mood: 'fier', text: 'Là, face à la mer : c’est là que je m’installe !', look: 'site:ponton' },
  rivage: { who: 'ponton', mood: 'determine', text: 'Viens au rivage. La marée laisse souvent des choses, mais elle les reprend vite aussi.' },
  // (les deux formes, chacune d'un mot : game/accord.js)
  'bois-ponton': { who: 'ponton', mood: 'malicieux', text: 'Pas mal, pour un|une naufragé|naufragée. Pour mon ponton, il en faudra bien plus.' },
  'ponton-bois': { who: 'ponton', mood: 'determine', text: 'Un ponton, et la mer devient un chemin.' },
  'ponton-tient': { who: 'ponton', mood: 'rire', text: 'Il tient. C’est déjà ça… Ma grand-mère aurait tapé du talon dessus, pour voir.' },
  // (le Ponton n'a pas de fanal au palier I : la réplique de remplacement, choix de l'auteur, 14 oct.)
  'ponton-promesse': 'Un ponton ? J’ignorais ce que c’était, mais ça n’a pas l’air d’être bien grand.',
  'ponton-moyens': { who: 'ponton', mood: 'fache', text: 'Hé ! Je fais avec les moyens du bord, d’accord ?' },
  'chemin-camps': { who: 'ponton', mood: 'pensif', text: 'Avec deux camps, on sera d’abord moins serrés, mais on pourra aussi commencer à former une communauté de survivants.' },
  'chemin-pieds': 'Un chemin. Ça commence à ressembler à un petit village… Comme avant.',
  voisins: { who: 'ponton', mood: 'content', text: 'Voilà. Deux pas, et on est voisins.' },
  'joli-camp': { who: 'ponton', mood: 'malicieux', text: 'Naufragés, d’accord. Mais rien n’interdit d’avoir un joli camp.' },
  // Les clôtures : Brume vous apprend, à Lorena et à toi, à quoi elles servent (choix de l'auteur, 11 oct.) ; la nuit de la
  // veillée (game/prologue.js : VEILLEE ; choix de l'auteur, 12 oct.), le feu baisse (demo : eteint), les égarés butent
  // dessus sous vos yeux (egare : demos.js, strayDemo), puis le feu repart (rallume)
  'egares-nuit': 'Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils cherchent ce qui brille sans savoir pourquoi… et attaquent parfois ce qui bouge.',
  'egares-nord': { text: 'Ils viennent de partout. Une clôture tout autour du feu… et ils s’arrêtent, je crois.', look: 'barrage' },
  cachons: { text: 'Chut… Cachons-nous. Ne bougez plus.', look: 'site:foyer', demo: 'eteint' },
  'egare-la': { text: 'Chut… Là, au bord de la brume. Des égarés.', look: 'barrage', demo: 'egare' },
  visiteurs: { text: 'Celui-là marche les yeux fermés. Il ne regarde même pas le feu.', look: 'barrage' },
  // (le Dormeur, endormi contre l'enclos : choix de l'auteur, 15 oct., ecriture/lots/03_egares.md)
  'dormeur-pique': { text: 'Il s’est endormi contre les piquets. … Comme s’il n’attendait que ça… Étrange…', look: 'barrage' },
  'cloture-voyez': { text: 'Le feu repart. Ils rentrent dans la brume, sans un bruit, mais ils reviendront.', look: 'site:foyer', demo: 'rallume' },
  'aster-dormir': { who: 'ponton', mood: 'effraye', text: 'Je ne suis pas certaine de pouvoir fermer l’œil de la nuit, maintenant.' },
  'cloture-deux': 'Une clôture, ça décore. Bien placée, ça protège aussi. Tout autour du feu, alors.',
  'chez-nous': 'Ça ressemble à un chez-nous.',
  cuisiner: { who: 'ponton', mood: 'gene', text: 'On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner.' },
  manger: 'Moi, je ne mange pas. Ça n’aide pas, je sais.',
  debrouiller: { who: 'ponton', mood: 'pensif', text: 'Demain, on se débrouillera mieux. Ce soir, quelques baies et racines feront malheureusement l’affaire. J’espère ne pas être malade !' },
  soir: 'Deux de plus qu’il y a deux jours… Je ne me sens enfin plus seule. Dormez, je veille sur vous.',
  // Brume reste seule avec le joueur jusqu'à la première nuit.
  epaves: 'Du bois flotté. Et là, les pierres du vieux cercle. Rassemble tout : on va le rallumer.',
  chaine: 'L’île est du genre généreuse. Si tu t’appliques à récolter ou à produire, elle te le rendra.',
  // Le Brasier déjà écrit : le feu se bâtit tout de suite
  'feu-pret': 'Tout y est. Là, au milieu des pierres.',
  // (un ancien parcours, le Brasier pas encore écrit : le joueur passe au Grimoire de lui-même, invité par sa bulle)
  cendres: { text: 'Il faudra des flammes pour la nuit. Ton livre sait peut-être leur donner vie.', action: { label: 'Ouvrir le Grimoire', mode: 'infinite' } },
  flambe: 'Les flammes orange… comme avant. Maintenant, la nuit peut venir.',
  // Le jour d’Agathe (choix de l'auteur, 11 oct. : spec v2, sans la ponte offerte, qui viendra avec le coq). On va
  // vers elle (« ! ») ; ses coquillages, sa soupe (la leçon des bulles) ; un fil d'histoire ; la longue-vue de Lorena voit
  // la cage dériver (look : la caméra la suit, WorldView coach.js) ; les poules échappées, attrapées, nourries ; leur
  // poulailler (la leçon des annexes) ; le soir à trois, la troisième nuit
  'faim-aster': { who: 'ponton', mood: 'surpris', text: 'Brume, dis-moi que je ne rêve pas…' },
  'faim-cannelle': { who: 'foyer', mood: 'malicieux', text: 'Ton ventre, je l’entends depuis les rochers. Assieds-toi. Un ventre vide ne bâtit rien.' },
  'faim-bulle': 'Elle a raison. Et regarde au-dessus d’elle : elle meurt d’envie de cuisiner.',
  bulle: { who: 'foyer', mood: 'malicieux', text: 'Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.' },
  soupe: { who: 'foyer', mood: 'content', text: 'Une soupe… Une cuillère pour le corps, une pour l’âme.' },
  'soupe-aster': { who: 'ponton', mood: 'emu', text: 'Chaude, salée comme il faut… parfaite. Agathe, tu viens de me sauver la vie.' },
  'bulles-reviennent': 'Ça reviendra, tu sais. On a toujours un peu faim, ou froid… ou envie de parler. Ça, je connais.',
  'brume-avale': { who: 'foyer', mood: 'pensif', text: 'Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d’autres naufragés ?' },
  'brume-retient': 'Peut-être. Je ne la retiens plus très bien. Je ne sais même plus comment la rappeler… Elle ne m’écoute pas, et j’ai tout oublié.',
  'caquets-eau': { who: 'ponton', mood: 'surpris', text: 'Chut ! Des caquets… dans l’eau ? Prends ma longue-vue, vite.' },
  'mes-filles': { who: 'foyer', mood: 'emu', text: 'Mes filles ! Caramel, Flocon, Réglisse… Elles ont tenu bon !', look: 'cage' },
  'fine-bouche': { who: 'ponton', mood: 'malicieux', text: 'Des poules en cage, au milieu des requins… Faut croire qu’ils ont fait la fine bouche.' },
  // (le joueur parle sur l'île : choix de l'auteur, 18 oct.)
  miracles: { who: 'joueur', text: 'Entre toi qui les as tous esquivés, Agathe qui est arrivée je ne sais comment, et les poules qui ont une chance divine…' },
  'miracles-suite': { who: 'joueur', text: '… les miracles ont l’air courants, par ici.' },
  doucement: { who: 'foyer', mood: 'surpris', text: 'Doucement ! Elles ont vu la mer de trop près, elles aussi.' },
  'tout-le-monde': { who: 'foyer', mood: 'adore', text: 'Caramel, Flocon, Réglisse… Tout le monde est là.' },
  'deux-vivres': { who: 'foyer', mood: 'triste', text: 'Elles ont faim. Une nuit en mer dans une cage, ça creuse.' },
  'recolte-nourrit': { who: 'foyer', mood: 'malicieux', text: 'La marée nourrit aussi. Pas vrai ?' },
  'un-toit': { who: 'foyer', mood: 'determine', text: 'Il leur faut un toit. Un petit poulailler, là, dans l’herbe, près de ma cuisine.' },
  'un-coq': { who: 'foyer', mood: 'pensif', text: 'Un toit, du grain… Il ne leur manque qu’un coq, à mes filles. Un jour.' },
  village: 'Un toit pour les poules, un feu pour nous… Ceux d’avant aussi avaient des… poules, c’est ça ? Je crois.',
  // La cage vide, le poulailler posé : Lorena propose de la démonter (choix de l'auteur, 15 oct. ; texte validé)
  'cage-bois': { who: 'ponton', mood: 'malicieux', text: 'Tes poules ont un vrai toit, maintenant. Cette vieille cage ? Démonte-la : du bois de navire, ça ne se jette pas.' },
  'cage-agathe': { who: 'foyer', mood: 'malicieux', text: 'Prends-la. Mais si tu en fais un ponton, mes filles auront leur place dessus.' },
  // L'abri d’Agathe, puis son enclos (choix de l'auteur, 13 oct. ; textes validés)
  marmite: { who: 'foyer', mood: 'fatigue', text: 'Mes filles ont un toit. Moi, je dors comme je peux, mais ça fera l’affaire pour ce soir.' },
  'se-plaint': 'Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine.',
  entends: { who: 'foyer', mood: 'boude', text: 'Je t’entends, feu follet.' },
  'toit-a-moi': { who: 'foyer', mood: 'content', text: 'Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe.' },
  cuisines: 'Les égarés cherchent ce qui brille, et une cuisine brille toute la nuit. Il lui faut un enclos, à elle aussi.',
  casseroles: { who: 'foyer', mood: 'malicieux', text: 'Et pas de piquet dans mes casseroles, hein.' },
  'en-ville': { who: 'foyer', mood: 'rire', text: 'Une cuisine avec une clôture. C’est tellement pittoresque.' },
  'a-table': { who: 'foyer', mood: 'rire', text: 'À table ! Ce soir, on mange chaud.' },
  'trois-feu': { who: 'ponton', mood: 'emu', text: 'Trois autour du feu. Hier encore, on dînait de racines.' },
  chaise: { who: 'foyer', mood: 'triste', text: 'Il manque une chaise… celle de mon Léo. Mangez, avant que ça refroidisse.' },
  'soir-trois': 'Trois de plus qu’il y a trois jours… et une chaise vide. Dormez, je veille sur vous.',
  puzzle: { who: 'atelier', mood: 'determine', text: 'Chaque pièce a sa place. Tourne, essaie. Elle te dira quand c’est la bonne.' },
  // Ses trois torches, une par côté d'où venaient les égarés (choix de l'auteur, 13 oct. ; textes validés)
  'torches-idee': { who: 'atelier', mood: 'determine', text: 'Cette nuit, depuis la brume, je les ai vus venir de trois côtés. Trois torches, une par côté. Pas du génie : de l’arithmétique.' },
  'torches-tiennent': { who: 'atelier', mood: 'fier', text: 'Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient.' },
  ingenieur: { who: 'ponton', mood: 'rire', text: 'Il doute même de ce qu’il voit. Un vrai ingénieur.' },
  // Le soir à quatre, la quatrième nuit (choix de l'auteur, 13 oct. ; textes validés) ; puis LINES.souci, Agathe
  'quatre-feu': { who: 'atelier', mood: 'rire', text: 'Quatre autour d’un feu. Il nous faudra une plus grande marmite. Ou un plus petit Nathan.' },
  'marmite-agathe': { who: 'foyer', mood: 'malicieux', text: 'La marmite, je m’en charge. Toi, mange.' },
  'soir-quatre': 'Encore un nouveau visage… Quatre. Quatre personnes, après une éternité de solitude. Dormez, mes nouveaux amis : je veille sur vous.',
  or: { who: 'atelier', mood: 'pensif', text: 'Une clôture leur barre la route. Une lumière… je ne sais pas encore ce qu’elle leur fait. On le saura cette nuit.' },
  // (son coin, son abri ; Lorena et Agathe curieuses : choix de l'auteur, 18 oct., textes validés)
  'coin-rivet': { who: 'atelier', mood: 'determine', text: 'D’abord, un coin à moi. Un établi sans toit, c’est une flaque avec des outils.' },
  'curieux-aster': { who: 'ponton', mood: 'rire', text: 'Il trace déjà des plans dans le sable. Allons voir ce qu’il fabrique.' },
  'curieux-agathe': { who: 'foyer', mood: 'malicieux', text: 'Un homme qui mesure tout deux fois… Je veux voir ça.' },
  'abri-rivet-fait': { who: 'atelier', mood: 'fier', text: 'Un toit, un établi, une vue sur le feu. Je pourrais presque rester.' },
  // (le lampadaire attendra l'électricité : des torches à l'ancienne ; choix de l'auteur, 18 oct., textes validés)
  'lampadaire-reve': { who: 'atelier', mood: 'pensif', text: 'Ici, il faudrait un lampadaire. Avec de l’électricité.' },
  'lampadaire-brume': 'L’électricité… Ce savoir dort sûrement quelque part dans le Grimoire. Il viendra plus tard.',
  'lampadaire-ancienne': { who: 'atelier', mood: 'determine', text: 'Alors à l’ancienne, en attendant : des torches.' },
  // (ses torches plantées : en déplacer une, la pivoter ; ranger, Nathan le dit : choix de l'auteur, 18 oct., textes validés)
  'deplace-idee': { who: 'atelier', mood: 'pensif', text: 'Hmm. Un pas de côté, et elle éclairerait mieux le chemin. Essaie, tu verras.' },
  'pivote-idee': { who: 'atelier', mood: 'determine', text: 'Elle se tourne aussi. Comme les pièces du casse-tête.' },
  'ranger-astuce': { who: 'atelier', mood: 'rire', text: 'Et si un jour elle te gêne, range-la : elle t’attend à l’établi, sans rien te coûter.' },
  // Son premier outil, la Canne à pêche du Ponton (choix de l'auteur, 18 oct. ; textes validés)
  'outil-idee': { who: 'atelier', mood: 'determine', text: 'Le Ponton pêche à mains nues ? Inacceptable. Sa boutique a une canne : quatre-vingts écus, et il produira un cinquième de plus.' },
  'outil-fait': { who: 'ponton', mood: 'rire', text: 'Une vraie canne ! Je pêchais avec une ficelle et beaucoup d’espoir.' },
  // La nuit des lumières (choix de l'auteur, 18 oct. ; textes validés) : Brume touchée pour dormir, les égarés vont vers
  // les torches et s'arrêtent à leur bord, le téméraire s'y brûle (lumieres : demos.js, lightDemo) ; le Dormeur s'endort
  // contre l'enclos ; les flammes, il faudra les nourrir
  'lumieres-regarde': { text: 'Regarde, Nathan. Ta réponse arrive.', look: 'site:foyer', demo: 'lumieres' },
  'lumieres-bord': { text: 'La plupart s’arrêtent au bord de la lumière, et rebroussent chemin.', look: 'site:foyer' },
  'lumieres-brule': { text: 'Celui-là a osé. La flamme l’a mordu : il s’est dissipé.', look: 'site:foyer' },
  'lumieres-nathan': { who: 'atelier', mood: 'fier', text: 'Ils ont peur du feu ! Je l’avais dit. Enfin… je ne l’avais pas dit. Mais je l’avais pensé.' },
  'lumieres-dormeur': { text: 'Celui aux yeux fermés ne voit rien. Lui, seule la clôture l’arrête.', look: 'site:foyer' },
  'lumieres-nourrir': 'Tant qu’elles brûlent. Une flamme qu’on ne nourrit pas s’éteint… et eux reviennent.',
  souci: { who: 'foyer', mood: 'triste', text: 'Mon Léo… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Sait-il nager, au moins ? S’est-il seulement réveillé ?!' },
  courants: { who: 'ponton', mood: 'pensif', text: 'Les courants d’ici ramènent tout sur nos plages. Tout, Agathe. Nous finirons bien par le retrouver.' },
  'courants-suite': { who: 'ponton', mood: 'determine', text: 'S’il est comme toi, il a dû s’en sortir, pour sûr !' },
  // Le matin de Léo (choix de l'auteur, 14 oct. ; textes validés) : la longue-vue de Lorena voit une planche sur la vague ;
  // touchée, elle s'échoue un peu plus loin que le Ponton (look : la caméra la suit, WorldView coach.js)
  'planche-vue': { who: 'ponton', mood: 'surpris', text: 'Ohé ! Là, sur la vague… une planche. Et… quelqu’un dessus ?' },
  'planche-dort': { who: 'ponton', mood: 'emu', text: 'Un enfant… Il dort. La vague l’a posé sur le sable, tout doucement. Décidément, on trouve de tout sur cette plage…', look: 'planche' },
  respire: { who: 'joueur', text: 'Il respire ? … Il respire.' },
  baguette: { who: 'puits', mood: 'triste', text: 'Avant, ma baguette tirait vers l’eau. Ici, rien ne semble fonctionner normalement. Ni les baguettes, ni mes sens.' },
  ruban: 'Si Léo savait beaucoup de choses, ma brume lui en a peut-être pris une partie. On devra les retrouver dans le Grimoire.',
  'grimoire-vole': { who: 'ponton', mood: 'pensif', text: 'Cette histoire de brume et de Grimoire est des plus étranges. L’un fabrique tout, l’autre vole des connaissances.' },
  'pas-expres': { who: 'puits', mood: 'pensif', text: 'C’est pas grave. Tu l’as pas fait exprès… hein ?' },
  'expres-brume': 'Non… Il n’y a plus rien que je fasse exprès, depuis que j’ai tout oublié.',
  chut: { who: 'puits', mood: 'emerveille', text: 'Oui… Voilà ! Ça y est ! Je pense pouvoir sentir la source, et même peut-être l’atteindre avec… des outils…' },
  relier: { who: 'atelier', mood: 'fier', text: 'Attends ! Avec quelques ressources et mes instruments, on va pouvoir relier cette source à notre hameau…' },
  'relier-abri': { who: 'atelier', mood: 'fier', text: '… et même t’en faire un abri bien confortable !' },
  communaute: { who: 'foyer', mood: 'emu', text: 'Nous ressemblons de plus en plus à une communauté de naufragés.' },
  produit: { who: 'puits', mood: 'rire', text: 'Voilà ! L’eau arrive ! C’est génial. Même quand on dormira, elle viendra se stocker dans ce réservoir souterrain !' },
  'merci-puits': 'Merci, Nathan ! Merci, Léo !',
  'trois-fois-rien': { who: 'atelier', mood: 'gene', text: '… C’est trois fois rien !' },
  glisse: { who: 'puits', mood: 'pensif', text: 'C’est très bien. Par contre, je suis pieds nus, et la terre n’est pas toujours très tendre. Il faudra des chemins entre nos abris.' },
  'pieds-agathe': { who: 'foyer', mood: 'malicieux', text: 'Et mes pieds aussi apprécieront le confort d’un chemin !' },
  pierres: 'Un chemin, un puits, de l’eau pour tous… Ça recommence. C’est comme avant.',
  sentier: { who: 'puits', mood: 'content', text: 'Un vrai chemin. Mes seaux arrivent pleins, sans que j’aie à me ruiner les pieds !' },
  // La Pluie écrite (choix de l'auteur, 12 oct. : la clé du Puits ; 14 oct. : textes validés) : elle tombe sur l'île tant
  // que ces répliques se lisent (demo : WorldView, demos.js et sky.js), la baguette de Léo frémit
  'pluie-brume': { text: 'La Pluie tombe sur l’île. Regarde Léo.', demo: 'averse', look: 'habitant:puits' },
  'pluie-ondin': { who: 'puits', mood: 'emerveille', text: 'Je comprends mieux… Ce Grimoire a un vrai pouvoir. Mais ça ne me rend quand même pas mes sens de sourcier.', demo: 'averse' },
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
