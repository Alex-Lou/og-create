// Les coffres de l'île (world/chest.js ; le Carnet d'explorateur : ExplorerLog.vue) : les mots d'Héliane, la dernière
// alchimiste des Anciens, glissés dans les bouteilles à la mer.

// Mots d'Héliane, la dernière alchimiste des Anciens, glissés dans les bouteilles (un par bouteille, toujours le même
// pour une bouteille). Elle signe « H. » : son prénom ne se découvre que plus tard (HISTOIRE.md, § 6.13).
export const SIGN = ' — H.';
export const NOTES = [
  'Si tu lis ceci, l’île t’a choisi. Prends soin des poules : elles savent tout.',
  'J’ai caché des choses dans la brume. Pas toutes : il fallait bien te laisser des surprises.',
  'Le vent tourne toujours à l’heure du thé. Je n’ai jamais su pourquoi.',
  'Écoute la brume, le matin. Avant, elle chantait dans les roseaux. Elle chantera peut-être encore.',
  'La mer donne à ceux qui ramassent vite. Elle n’aime pas qu’on hésite. Moi, j’hésite toujours.',
  'J’ai planté le premier pommier de travers. Il a poussé droit quand même.',
  'Les dauphins reviennent quand on chante faux. J’ai essayé.',
  'Un jour, la baleine m’a saluée. Je crois. Ou elle éternuait.',
  'Garde un œil sur les plages : la mer rend toujours ce qu’on lui confie.',
  'Le Grimoire n’aime pas qu’on le brusque. Mélange doucement.',
  'J’ai laissé la clé du phare sous une pierre. Laquelle ? Bonne question.',
  'Une lumière, c’est peu. Deux, c’est un chemin. Trois, c’est un village.'
];
// Les mots d'histoire (HISTOIRE.md, § 6.13 et § 10) : un par acte, dans la première bouteille ouverte pendant l'acte
// (le serveur le dit : chest.story). Signés « H. », puis « Héliane » à partir de l'acte V, où l'on découvre son prénom
export const HELIANE = {
  I: 'Si tu lis ceci, l’île t’a choisi. Allume les lumières : toutes. — H.',
  II: 'Le Grimoire n’aime pas qu’on le brusque. Mélange doucement. — H.',
  III: 'Nous aussi, nous étions des naufragés. L’île nous a gardés longtemps. — H.',
  IV: 'Prends soin des poules : elles savent tout. Et des dauphins : ils savent le reste. — H.',
  V: 'Une table, une soupe, un nom : c’est comme ça que tout commence. — Héliane.',
  VI: 'Nous avons cessé d’écrire, et la brume nous a effacés. Ne cessez jamais. — Héliane.',
  VII: 'Brume n’est pas une malédiction. C’est ce qui reste d’une île quand on l’oublie. Écrivez-la, et elle ne sera plus jamais seule. Et si un jour la Dame s’éveille, dites-lui que nous l’aimions. En partant, j’ai laissé ma lanterne allumée au bord du marais. Une brume est venue s’y abriter. Ce qui est tombé dort encore. Gardez vos lumières allumées. — Héliane.'
};
