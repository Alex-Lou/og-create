// Les poses du grand format et les personnages qui les portent (une seule source pour preview_quotidien.mjs,
// preview_naufrages.js et le générateur des personnages, generateur_personnages.mjs) : les poses du quotidien, les
// couvertures, les humeurs en marche des maîtres, les visiteurs et les nouveaux venus de l'épilogue, tirés du générateur
// de l'avatar.
const { frame } = require('./troupe');
const A = require('../personnages/avatar.js');
const G = require('./gestes.js');
const { assis } = require('./assis.js');

const STD = [0, 0, 48, 64];
const VUE = { front: 'face', se: 'avant', ne: 'dos' };
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Les poses d'un personnage : [nom de fichier sans le numéro, vue du kit, cadre, images]
function poses(c, { travail = false, lanterne = false, couche = true, valise = null, couverture, parapluie = '#D9443A' } = {}) {
  const out = [];
  const tenir = valise ? G.avecValise(c, valise) : c;
  for (const v of ['front', 'se', 'ne']) {
    out.push([`${VUE[v]}_marche`, v, STD, [0, 1, 2, 3].map(n => frame(tenir, v, 'marche', n))]);
    out.push([`${VUE[v]}_repos`, v, STD, [0, 1].map(n => frame(tenir, v, 'repos', n))]);
    out.push([`${VUE[v]}_salut`, v, STD, [0, 1].map(n => frame(c, v, 'salut', n))]);
    if (travail) out.push([`${VUE[v]}_travail`, v, STD, [0, 1].map(n => frame(c, v, 'action', n))]);
    out.push([`${VUE[v]}_assis`, v, STD, [0, 1].map(n => assis(c, v, n))]);
    out.push([`${VUE[v]}_mains-tendues`, v, STD, [0, 1].map(n => frame(G.avecMainsTendues(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-mains-tendues`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.tendre))]);
    out.push([`${VUE[v]}_applaudir`, v, STD, [0, 1].map(n => frame(G.avecApplaudir(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-applaudir`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.applaudir))]);
    out.push([`${VUE[v]}_pecher`, v, STD, [0, 1].map(n => frame(G.avecPecher(c), v, 'action', n))]);
    out.push([`${VUE[v]}_piocher`, v, STD, [0, 1].map(n => frame(G.avecPiocher(c), v, 'action', n))]);
    out.push([`${VUE[v]}_cueillir`, v, STD, [0, 1].map(n => frame(G.avecCueillir(c), v, 'action', n))]);
    out.push([`${VUE[v]}_arroser`, v, STD, [0, 1].map(n => frame(G.avecArroser(c), v, 'action', n))]);
    out.push([`${VUE[v]}_becher`, v, STD, [0, 1].map(n => frame(G.avecBecher(c), v, 'action', n))]);
    out.push([`${VUE[v]}_porter`, v, STD, [0, 1].map(n => frame(G.avecPorter(c), v, 'action', n))]);
    out.push([`${VUE[v]}_reparer`, v, STD, [0, 1].map(n => frame(G.avecReparer(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-reparer`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.reparer))]);
    out.push([`${VUE[v]}_repousser`, v, STD, [0, 1].map(n => frame(G.avecRepousser(c), v, 'action', n))]);
    out.push([`${VUE[v]}_ecrire`, v, STD, [0, 1].map(n => frame(G.avecEcrire(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-ecrire`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.ecrire))]);
  }
  if (lanterne) {
    const l = G.avecLanterne(c), u = G.avecParapluie(c, parapluie);
    for (const v of ['se', 'ne']) {
      out.push([`${VUE[v]}_lanterne`, v, STD, [0, 1, 2, 3].map(n => frame(l, v, 'marche', n))]);
      out.push([`${VUE[v]}_parapluie`, v, G.CADRE_PARAPLUIE, [0, 1, 2, 3].map(n => frame(u, v, 'marche', n))]);
    }
  }
  if (couche) out.push(['couche', 'front', G.CADRE_COUCHE, [0, 1].map(n => G.couche(c, n, couverture))]);
  return out;
}

// Les couvertures des maîtres (couchés), celle des naufragés (une voile)
const COUVERTURES = {
  aster: { fond: '#2F5684', motif: '#F2C04B' }, cannelle: { fond: '#B9503B', motif: '#F4EEDC' }, rivet: { fond: '#7A4E2C', motif: '#C4A06A' },
  ondin: { fond: '#3E78C8', motif: '#EAF2FA' }, sylve: { fond: '#4E7A36', motif: '#9DBE6A' }, galet: { fond: '#6E7466', motif: '#B6B39E' }, melisse: { fond: '#5A4A8A', motif: '#E3C27A' }
};
const VOILE = { fond: '#D9CFB8', motif: '#B3A588' };

// Expressions en marche (trois quarts avant), propres au caractère de chacun (bible § 8)
const MOODS = {
  Aster: ['content', 'surpris', 'triste'], // sûre d'elle, le large, et sa culpabilité
  Cannelle: ['rire', 'triste', 'fache'], // la bonne humeur, l'inquiétude pour Ondin, elle gronde
  Rivet: ['content', 'surpris', 'fache'], // absorbé, « Si ! Si ! », la pièce qui résiste
  Ondin: ['endormi', 'surpris', 'content'], // il dort debout, réveillé d'un coup, rêveur
  Sylve: ['fache', 'gene', 'content'], // sur ses gardes, farouche, un sourire rare
  Galet: ['fache', 'triste', 'content'], // « Hm. », la mémoire des Anciens, un sourire dans la barbe
  'Mélisse': ['content', 'rire', 'triste'] // tranquille, les lunes, le chagrin caché
};

// Les visiteurs (générateur de l'avatar) : 12, chacun ses choix, sa couverture et son parapluie
const PARAPLUIES = ['#D9443A', '#3E78C8', '#F2C04B', '#7EC45B', '#C46AA8', '#2E3E66'];
const COUV = [{ fond: '#C98F5A', motif: '#E8C07A' }, { fond: '#6E8FC4', motif: '#DDE7F4' }, { fond: '#8BAE6A', motif: '#E2EDC9' }, { fond: '#B86A7A', motif: '#F2D2D8' }];
const sansMain = o => { const acc = { ...o.accessoires }; delete acc.main; return { ...o, accessoires: acc }; };
const VISITEURS = Array.from({ length: 12 }, (_, j) => {
  const i = j + 1, choix = sansMain(A.auHasard(1000 + i * 7, { gratuit: false }));
  return { i, cle: `visiteur-${String(i).padStart(2, '0')}`, choix, uid: `v${i}`, opts: { lanterne: true, couverture: COUV[i % COUV.length], parapluie: PARAPLUIES[i % PARAPLUIES.length] } };
});

// Les nouveaux venus de l'épilogue : habits de voyage, bagage sur le dos, chapeau, valise à la main ; pas couchés
const VOYAGE = [
  { haut: 'veste', bas: 'pantalon', tete: 'paille', dos: 'sacDos' }, { haut: 'chemise', bas: 'jupe', tete: 'beret', dos: 'besace' },
  { haut: 'pull', bas: 'pantalon', tete: 'bonnet', dos: 'sacDos' }, { haut: 'veste', bas: 'robe', tete: 'paille', dos: 'besace' },
  { haut: 'sweat', bas: 'pantalon', tete: 'casquette', dos: 'sacDos' }, { haut: 'chemise', bas: 'pantalon', tete: 'beret', dos: 'besace' },
  { haut: 'veste', bas: 'jupe', tete: 'bonnet', dos: 'sacDos' }, { haut: 'mariniere', bas: 'pantalon', tete: 'casquette', dos: 'besace' }
];
const VALISES = ['#9A5A34', '#3E5A8C', '#7A3A3A', '#5E7A4A'];
const ARRIVANTS = VOYAGE.map((t, j) => {
  const i = j + 1, base = sansMain(A.auHasard(5000 + i * 11, { gratuit: false }));
  const choix = A.verifier({ ...base, haut: t.haut, bas: t.bas, accessoires: { ...base.accessoires, tete: { id: t.tete }, dos: { id: t.dos } } });
  return { i, cle: `arrivant-${String(i).padStart(2, '0')}`, choix, uid: `e${i}`, opts: { couche: false, valise: VALISES[j % VALISES.length] } };
});

module.exports = { STD, VUE, slug, poses, COUVERTURES, VOILE, MOODS, VISITEURS, ARRIVANTS };
