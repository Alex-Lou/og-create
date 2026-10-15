// La phrase de l'Athanor quand un mélange rate (utils/failLine.js) : une image selon les familles mélangées, puis un
// indice. L'indice ne dit que ce que le joueur voit déjà dans la fiche d'un élément (« N mélanges inconnus »), jamais un
// ingrédient ni un résultat.
export const FAIL_LINES = {
  // Images par paire de grands thèmes (clé triée) ; « x+x » pour un seul thème. Les thèmes : brut (éléments
  // fondamentaux), matiere (matériaux, chimie, physique), nature (phénomènes, formations, cosmos), vivant (vie et
  // créatures, flore, biologie, corps et esprit), humain (créations humaines, histoire, technologie), mythe (légendes)
  images: {
    'brut+brut': ['Les éléments se repoussent, encore trop bruts.', 'Ça bouillonne… puis plus rien.'],
    'brut+matiere': ['La matière résiste.', 'Un peu de fumée, aucune transformation.'],
    'brut+nature': ['La nature reste indifférente.', 'Le vent emporte le mélange.'],
    'brut+vivant': ['La vie se recroqueville, intacte.', 'Ça frétille… mais rien ne naît.'],
    'brut+humain': ['L’outil reste un outil.', 'L’atelier reste silencieux.'],
    'brut+mythe': ['La magie refuse ce mélange.', 'Une étincelle, puis le silence des légendes.'],
    'matiere+matiere': ['Les matières ne se mêlent pas.', 'Rien ne fond, rien ne prend.'],
    'matiere+nature': ['La roche ne bronche pas.', 'Le mélange retombe en poussière.'],
    'matiere+vivant': ['La vie contourne l’obstacle.', 'Rien ne pousse là-dessus.'],
    'humain+matiere': ['L’établi reste froid.', 'Il manque un savoir-faire.'],
    'matiere+mythe': ['Le métal ne se laisse pas enchanter.', 'L’alchimie n’opère pas… pas encore.'],
    'nature+nature': ['Le ciel et la terre s’ignorent.', 'L’orage gronde au loin, sans suite.'],
    'nature+vivant': ['La créature s’enfuit devant l’orage.', 'La nature suit son cours, sans rien créer.'],
    'humain+nature': ['La nature garde son mystère.', 'Le paysage ne se laisse pas apprivoiser.'],
    'mythe+nature': ['Les légendes se taisent sous ce ciel.', 'La brume se lève, puis se dissipe.'],
    'vivant+vivant': ['Ils se regardent… et chacun repart de son côté.', 'Aucune étincelle entre eux.'],
    'humain+vivant': ['Personne ne sait quoi en faire.', 'La bête refuse d’être domptée.'],
    'mythe+vivant': ['La créature ne croit pas aux légendes.', 'Le conte s’arrête avant la fin.'],
    'humain+humain': ['Deux idées qui ne s’entendent pas.', 'L’invention attendra.'],
    'humain+mythe': ['La science reste sceptique.', 'Le sortilège échoue sur la machine.'],
    'mythe+mythe': ['Deux légendes, et aucune ne cède.', 'Trop de magie, et plus rien ne prend.']
  },
  // Sans thème connu
  generic: ['Rien ne se passe. Pas avec ceux-là.', 'L’Athanor reste muet.', 'Le mélange fume, mais rien ne naît.'],
  // L'indice : tout est exploré ; l'ingrédient qui cache le plus de mélanges inconnus (au-delà de 9, sans le chiffre)
  explored: 'Ces éléments ont livré tous leurs secrets.',
  many: name => `Mais ${name} cache encore bien des mélanges.`,
  few: (name, n) => `Mais ${name} cache encore ${n} mélange${n > 1 ? 's' : ''}.`
};
