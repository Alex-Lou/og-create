// Range la bibliothèque : un seul nom pour chaque sorte de dessin, et un catalogue unique,
// dans l'ordre du parcours du joueur (HISTOIRE.md, version 6).
//
// Les générateurs écrivent dans lib/ avec leurs propres noms ; build_bundle.js passe par ici pour
// publier ../bibliotheque/svg/ avec les noms rangés, réécrire les index de chaque lot, puis écrire
// catalogue.json et la page index.html.
//
// La règle des noms, pour les personnages et les bêtes : <sujet>_<vue>_<pose>[_<variante>]_<n>.svg
//   - sujet : sans « _ » (les mots se lient par « - ») : aster, aster-naufrage, poule-rousse, visiteur-03 ;
//   - vue : face, avant (trois quarts avant, vient vers le bas à droite), dos (trois quarts dos,
//     s'éloigne vers le haut à droite), profil (tourné vers la droite) ; le miroir donne l'autre côté ;
//   - n : le numéro d'image, à partir de 1 ; un dessin fixe n'a pas de numéro.
// Les autres rubriques (décor, bâtiments, météo, coffres, plantes) gardent leurs noms : <sujet>_<état>_<n>.
const fs = require('fs');
const path = require('path');

const hyph = s => s.replace(/_/g, '-');
const SANS_SENS = new Set(['hibou', 'meduse', 'papillon_bleu', 'papillon_jaune', 'papillon_lune']);

// --- 1. Les noms -------------------------------------------------------------------------------

// Chemin d'un SVG dans lib/ (posix, sans « ./ ») -> chemin rangé dans la bibliothèque
function renommer(rel) {
  const parts = rel.split('/');
  const base = parts.pop().replace(/\.svg$/, '');
  const [top, a, b] = parts;
  const out = (dirs, name) => [...dirs, name + '.svg'].join('/');

  if (top === 'animaux') {
    const sujet = b;
    const rest = base.slice(sujet.length + 1);
    if (!base.startsWith(sujet + '_')) throw new Error('bête inattendue : ' + rel);
    const S = hyph(sujet);
    const m = rest.match(/^(?:(avant|dos)_)?([a-z]+?)(\d+)?$/);
    if (!m) throw new Error('bête inattendue : ' + rel);
    const [, vue, pose, n] = m;
    if (pose === 'image' && a === 'familiers') return out([top, a, S], n ? `${S}_${n}` : S);
    const v = vue || (SANS_SENS.has(sujet) || a === 'familiers' && sujet.startsWith('bocal') ? 'face' : 'profil');
    const p = pose === 'image' ? 'nage' : pose;
    return out([top, a, S], [S, v, p, n].filter(Boolean).join('_'));
  }

  // Les égarés (lot M) : egares/<sujet>/<sujet>_<vue>_<pose><n> -> <sujet>_<vue>_<pose>_<n>
  if (top === 'egares') {
    const m = base.match(/^([a-z-]+)_(avant|dos)_([a-z]+?)(\d+)?$/);
    if (!m || m[1] !== a) throw new Error('égaré inattendu : ' + rel);
    return out([top, a], [m[1], m[2], m[3], m[4]].filter(Boolean).join('_'));
  }

  if (top === 'vivants' && a === 'cerf') {
    const m = base.match(/^cerf_([a-z]+)(?:_(\d+))?$/);
    return out([top, 'cerf-blanc'], ['cerf-blanc', 'profil', m[1], m[2]].filter(Boolean).join('_'));
  }

  if (top === 'personnages') {
    if (a === 'naufrages') {
      if (base.startsWith(b + '_naufrage_')) return out([top, a, b], `${b}-naufrage_${base.slice(b.length + 10)}`);
      throw new Error('naufragé inattendu : ' + rel);
    }
  }
  return rel;
}

// Le kit du grand format (design/personnages/troupe.js, Anya, le Passeur) dessine son trois quarts avant tourné vers
// le bas à gauche ; le petit format, les bêtes et le jeu (vue « se ») le tournent vers le bas à droite. La bibliothèque
// publie donc ces vues-là en miroir : « avant » veut dire « vers le bas à droite » partout.
const MIROIR_KIT = /^(personnages\/maitres\/[a-z]+|personnages\/naufrages\/[a-z]+|personnages\/avatar\/avatar-\d+(?:-naufrage)?|personnages\/visiteurs\/visiteur-\d+|personnages\/epilogue\/arrivant-\d+|vivants\/(anya|passeur))\/[a-z0-9-]+_avant_/;
function miroir(svg) {
  const m = svg.match(/^(<svg[^>]*viewBox="([^"]+)"[^>]*>)([\s\S]*)(<\/svg>\s*)$/);
  if (!m) throw new Error('SVG inattendu pour le miroir');
  const [x, , w] = m[2].trim().split(/[\s,]+/).map(Number);
  return `${m[1]}<g transform="translate(${2 * x + w} 0) scale(-1 1)">${m[3]}</g>${m[4]}`;
}

// Liste des fichiers d'un dossier (posix, relatifs)
function lister(root, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...lister(root, r));
    else out.push(r);
  }
  return out;
}

// Réécrit un index de lot : chaque chemin de SVG suit son nouveau nom (même base que l'index),
// et chaque clé qui portait un ancien nom de groupe ou de sujet prend le nouveau.
function reecrireIndex(json, jsonDir, carte, groupes) {
  const ancres = [];
  for (let d = jsonDir; ; d = path.posix.dirname(d)) { ancres.push(d === '.' ? '' : d); if (d === '.' || d === '') break; }
  const chemin = s => {
    for (const anc of ancres) {
      const full = anc ? anc + '/' + s : s;
      if (carte.has(full)) {
        const neuf = carte.get(full);
        return anc ? path.posix.relative(anc, neuf) : neuf;
      }
    }
    throw new Error(`chemin introuvable dans ${jsonDir} : ${s}`);
  };
  const walk = v => {
    if (typeof v === 'string') return /\.svg$/.test(v) ? chemin(v) : v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      const o = {};
      for (const [k, x] of Object.entries(v)) o[groupes.get(k) || k] = walk(x);
      return o;
    }
    return v;
  };
  return walk(json);
}

// --- 2. Le parcours ----------------------------------------------------------------------------

const CHAPITRES = [
  ['tuto-1', 'Tutoriel, partie 1 — « Seul »', 'Étapes 0 à 6 : la nuit du naufrage. Le joueur, Brume, le Grimoire, ramasser, le feu, l\'heure, le premier égaré.'],
  ['tuto-2', 'Tutoriel, partie 2 — « La troupe »', 'Étapes 7 à 9 : l\'aube et le matin. Cannelle et ses poules, Rivet, l\'établi, la Clôture.'],
  ['tuto-3', 'Tutoriel, partie 3 — « L\'île »', 'Étapes 10 à 12 : Aster, la carte, La Source, Ondin, le Puits qui grandit, la boutique, la première nuit de garde, le Campement.'],
  ['acte-1', 'Acte I — Les Premiers Souffles', 'Le bois manque. Sylve, le Bosquet, la Vie, la première lanterne.'],
  ['acte-2', 'Acte II — La Matière', 'La pierre avant l\'orage. Galet, la Carrière, l\'Abri.'],
  ['acte-3', 'Acte III — Ciel et Terre', 'La nourriture. Mélisse, le Potager et la ferme, la forge de Rivet, les ruines des Anciens.'],
  ['acte-4', 'Acte IV — Le Vivant', 'La mer. Aster reprend la barre, le Ponton, les voyageurs, le Bestiaire, les climats.'],
  ['acte-5', 'Acte V — Le Foyer', 'La place. Les maisons, les enseignes, la Cabane, la Maison de l\'alchimiste.'],
  ['acte-6', 'Acte VI — Les Âges', 'La mémoire. La Tour d\'étude, l\'Îlot aux Mouettes, le phare éteint, la Mine de cristal, le Phénix.'],
  ['acte-7', 'Acte VII — Les Légendes', 'La lumière. Le Passeur, l\'Île des Légendes, le Phare de Brume.'],
  ['revelation', 'La Révélation d\'Anya', 'Quand le cœur de l\'île est libéré : Anya, le cerf blanc, le Cercle fleuri, ses créatures.'],
  ['epilogue', 'L\'épilogue', 'Un navire voit la lumière du Phare : les nouveaux venus sont accueillis.'],
  ['evolutions', 'Les bâtiments grandissent', 'Paliers II à VII quand leur chapitre s\'ouvre, annexes, créations de l\'établi, objets de la boutique, teintes, pièces rares.'],
  ['partout', 'Partout, tout le temps', 'Météo, ciel et moments du jour, plantes et rochers, bêtes déjà là pour tous.']
];

const MAITRES = {
  // naufragé, maître (souvenir retrouvé), d'après HISTOIRE.md v6 (§ 8 à 10)
  cannelle: ['tuto-2', 'tuto-2'], rivet: ['tuto-2', 'acte-3'], aster: ['tuto-3', 'acte-4'], ondin: ['tuto-3', 'tuto-3'],
  sylve: ['acte-1', 'acte-1'], galet: ['acte-2', 'acte-2'], melisse: ['acte-3', 'acte-3']
};
const STADES = { s0: 'tuto-1', pret: 'tuto-1', s1: 'acte-1', s2: 'acte-2', s3: 'acte-3', s4: 'acte-4', s5: 'acte-5', s6: 'acte-6', s6pale: 'acte-6', s6phenix: 'acte-6', s7: 'acte-7', s7soleil: 'acte-7' };
const PALIERS_DU_RECIT = { foyer: { 1: 'tuto-1', 2: 'acte-2', 3: 'acte-5', 4: 'acte-5', 5: 'acte-6', 6: 'acte-6', 7: 'acte-7' }, puits: { 1: 'tuto-3', 2: 'tuto-3' }, bosquet: { 1: 'acte-1' }, carriere: { 1: 'acte-2', 6: 'acte-6' }, potager: { 1: 'acte-3', 2: 'acte-4' }, atelier: { 1: 'acte-3' }, ponton: { 1: 'acte-4' } };
const PLANTES_GREVE = new Set(['bois_flotte', 'coquillages', 'rocher', 'rochers', 'rondin']);
const PLANTES_ACTE1 = new Set(['arbre', 'arbre_automne', 'bouleau', 'pommier', 'sapin', 'buisson', 'souche', 'lanterne', 'lanterne_allumee']);

// Le moment du parcours où un dessin sert d'abord (id de groupe rangé -> id de chapitre)
function moment(id, meta) {
  const p = id.split('/');
  const [top, a, b] = p;
  const nom = p[p.length - 1];
  if (top === 'personnages') {
    if (a === 'epilogue') return 'epilogue';
    if (a === 'avatar') return 'tuto-1';
    if (a === 'visiteurs') return 'acte-4';
    const m = MAITRES[b];
    if (!m) return 'partout';
    return a === 'naufrages' ? m[0] : m[1];
  }
  if (top === 'vivants') {
    if (a === 'brume') { const s = nom.split('_')[1]; return STADES[s] || 'tuto-1'; }
    if (a === 'passeur') return 'acte-7';
    return 'revelation';
  }
  if (top === 'animaux') {
    if (b.startsWith('poule')) return 'tuto-2';
    if (a === 'ferme') return b === 'chat' || b === 'chien' ? 'evolutions' : 'acte-3';
    if (a === 'familiers') return { tictac: 'tuto-2', 'bocal-vide': 'tuto-3', 'bocal-bulle': 'acte-1', mousse: 'acte-1' }[b] || 'partout';
    if (a === 'bois') return b === 'loutre' ? 'revelation' : 'partout';
    if (a === 'climat' || a === 'bestiaire') return 'acte-4';
    if (b === 'mouette' || b === 'crabe') return 'tuto-2';
    return 'partout';
  }
  if (top === 'batiments') {
    if (a === 'paliers') { const n = +(nom.match(/palier(\d)/) || [])[1]; return (PALIERS_DU_RECIT[b] || {})[n] || 'evolutions'; }
    if (a === 'chantier') return 'tuto-3';
    return 'evolutions';
  }
  if (top === 'coffres') return { commun: 'tuto-3', rare: 'tuto-3', epique: 'acte-3', legendaire: 'acte-5' }[a];
  // le petit fantôme dès l'étape 6, la première nuit de garde à l'étape 12 (tempéré), les bêtes des climats à l'acte IV
  if (top === 'egares') return a === 'fantome' ? 'tuto-1' : a === 'zombie' || a === 'lapin-de-brume' ? 'tuto-3' : 'acte-4';
  if (top === 'decor') {
    if (a === 'camp') {
      if (b === 'voyageurs') return 'acte-5';
      if (b === 'poules') return 'tuto-2';
      if (b === 'coins') return { aster: 'tuto-3', rivet: 'tuto-2', cannelle: 'tuto-2', ondin: 'tuto-3', sylve: 'acte-1', galet: 'acte-2', melisse: 'acte-3' }[p[3]];
      if (/torche|caisses|tonneau/.test(nom)) return 'tuto-3';
      return 'tuto-1';
    }
    if (a === 'creations') { const c = nom.split('_')[0]; return c === 'cloture' ? 'tuto-2' : c === 'lanterne' ? 'acte-1' : /\((cimes|landes|marais|dunes|jungle|volcan)\)/.test(meta.nom || '') ? 'acte-4' : 'evolutions'; }
    if (a === 'lieux') return nom.startsWith('menhirs_fleuri') ? 'revelation' : 'acte-3';
    if (a === 'embrume') return 'tuto-3';
    if (a === 'signes') return 'revelation';
    if (a === 'ruines') return /cle_du_phare|phare_eteint/.test(nom) ? 'acte-6' : 'acte-3';
    if (a === 'gisements') return 'acte-4';
    if (a === 'enseignes') return 'acte-5';
    if (a === 'annexes') return b === 'maison' ? 'acte-5' : 'evolutions';
    if (a === 'ilots') {
      if (/panneau_quartier/.test(nom)) return 'tuto-3';
      if (/bouteille|epave_radeau/.test(nom)) return 'acte-1';
      if (/epave_bateau/.test(nom)) return 'acte-2';
      if (/epave_barque/.test(nom)) return 'acte-3';
      if (/pont_/.test(nom)) return 'acte-6';
      if (/barque_volante/.test(nom)) return 'acte-7';
      return 'acte-4';
    }
  }
  // les variantes de l'arbre et du pommier refaits (arbres.js) se rangent avec eux
  if (top === 'plantes') { const n = nom.replace(/_\d+$/, '').replace(/^arbre(_petit)?(_profond)?(_fleuri)?$/, 'arbre').replace(/^pommier(_petit)?(_profond)?(_fleurs)?(_tombees)?$/, 'pommier'); return PLANTES_GREVE.has(n) ? 'tuto-1' : PLANTES_ACTE1.has(n) ? 'acte-1' : 'partout'; }
  // les scènes du tutoriel (lot J2) : scenes/tutoriel/<étape>_<nom>/…, la partie suit le numéro de l'étape
  if (top === 'scenes') { const n = parseInt(b, 10); return n <= 6 ? 'tuto-1' : n <= 9 ? 'tuto-2' : 'tuto-3'; }
  return 'partout';
}

// --- 3. Ce qui reste à revoir (audit du 6 octobre et HISTOIRE.md v6) -------------------------------

const A_REVOIR = [
  [/^vivants\/brume\/brume_expr_fache$/, 'Brume ne gronde jamais (§ 8) : expression à retirer.'],
  [/^vivants\/brume\/brume_s[1-7]/, 'Les ornements des stades doivent s\'additionner (§ 13) ; le stade 6 doit être ambré, le soleil du stade 7 une petite flamme dorée à rayons.'],
  [/^vivants\/brume\/brume_expr_/, 'Les expressions doivent être les yeux seuls, à poser sur n\'importe quel stade (aujourd\'hui le corps du stade 1).'],
  [/^vivants\/anya\/anya_expr_(fache|gene|rire|endormi)$/, 'Anya est calme et n\'élève jamais la voix (§ 8) : expression à retirer.'],
  [/^vivants\/anya\//, 'Manteau à passer en or et vert (§ 14), avec les veines lumineuses ; il change avec les saisons.'],
  [/^vivants\/passeur\//, 'Le Passeur est grand (§ 8) : cadre plus haut à prévoir.'],
  [/^vivants\/cerf-blanc\//, 'Le cerf blanc n\'a que le profil ; il lui faut le trois quarts avant et dos, comme Anya.'],
  [/^personnages\/naufrages\/galet\/galet-naufrage_face_rune$/, 'Un naufragé a oublié son don (§ 6.2) : la rune qui chante revient au maître.'],
  [/^personnages\/naufrages\/sylve\/sylve-naufrage_face_chant$/, 'Un naufragé a oublié son don (§ 6.2) : le chant aux graines revient au maître.'],
  [/^decor\/camp\/epave\/hirondelle$/, 'L\'Hirondelle est un petit navire de croisière (v6) : épave à redessiner.'],
  [/^decor\/camp\/epave\/feu_debris$/, 'Le feu de camp est le Foyer au palier I, bâti par le joueur (§ 9, étape 5) : ce feu fait double emploi.'],
  [/^decor\/camp\/coins\/(ondin|sylve|galet|melisse)\//, 'Seuls Aster et Rivet vivent au camp : ce coin va près du bâtiment de son maître (Ondin à La Source, Sylve à La Lisière, Galet à La Colline, Mélisse aux Jardins).'],
  [/^decor\/camp\/coins\/[a-z]+\/[a-z]+_cabanon$/, 'Pas de cabanon avant l\'Abri (fin de l\'acte II).'],
  [/^decor\/camp\/objets\/sos$/, 'À retirer quand les voyageurs arrivent (acte IV).'],
  [/^decor\/ruines\/cle_du_phare$/, 'La clé est cachée sous une pierre du Cercle de menhirs (§ 10, acte VI) : elle ne doit pas se voir.'],
  [/^animaux\/bois\/loutre\//, 'Créature d\'Anya : seulement après la Révélation (§ 6.14).']
];
const statut = id => { for (const [rx, note] of A_REVOIR) if (rx.test(id)) return { statut: 'a-revoir', note }; return { statut: 'ok' }; };

const MANQUANTS = [
  ['tuto-2', 'L\'établi de Rivet au camp (une porte de cabine sur deux caisses).'],
  ['acte-1', 'L\'éclat du souvenir retrouvé (le sceau s\'allume, le maître se lève outil en main).'],
  ['acte-4', 'L\'amie de Tic-Tac (quand on écrit Abeille).'],
  ['revelation', 'Le bol de soupe « pour la Dame », au bord du Foyer, le soir.']
];

// --- 4. Le catalogue ---------------------------------------------------------------------------

const NOMS = { aster: 'Aster', cannelle: 'Cannelle', rivet: 'Rivet', ondin: 'Ondin', sylve: 'Sylve', galet: 'Galet', melisse: 'Mélisse', brume: 'Brume', anya: 'Anya', passeur: 'le Passeur', 'cerf-blanc': 'le cerf blanc' };
const VUES = { face: 'de face', avant: 'trois quarts avant', dos: 'trois quarts dos', profil: 'de profil' };
const REGARDE = { face: 'face', avant: 'bas-droite', dos: 'haut-droite', profil: 'droite' };
const FEM = new Set(['aster', 'cannelle', 'sylve', 'melisse']);
const STADE_TITRE = { s0: 'stade 0 (pâle, au tutoriel)', s1: 'stade 1', s2: 'stade 2', s3: 'stade 3', s4: 'stade 4', s5: 'stade 5', s6: 'stade 6', s6pale: 'stade 6, pâlie (acte VI)', s6phenix: 'stade 6, Phénix', s7: 'stade 7', s7soleil: 'stade 7, soleil du Phare', pret: 'qui brille : une tâche est faite' };

// Les mots des noms de fichiers, avec leurs accents
const MOTS = {
  chevre: 'chèvre', tachete: 'tacheté', meduse: 'méduse', mesange: 'mésange', cameleon: 'caméléon', heron: 'héron', ecureuil: 'écureuil',
  herisson: 'hérisson', koi: 'koï', allumee: 'allumée', flotte: 'flotté', bruyere: 'bruyère', nenuphars: 'nénuphars', fees: 'fées',
  petales: 'pétales', etincelles: 'étincelles', coeur: 'cœur', arrivee: 'arrivée', fache: 'fâché', gene: 'gêné', longuevue: 'longue-vue',
  benediction: 'bénédiction', eveil: 'éveil', pret: 'prêt', ramasse: 'ramassé', sirene: 'sirène', poule: 'poule', etabli: 'établi',
  epouvantail: 'épouvantail', geode: 'géode', naiade: 'naïade', pelican: 'pélican', seau: 'seau', ferme: 'fermé', icone: 'icône',
  rayons: 'rayons', ouvert: 'ouvert', couche: 'couché', parapluie: 'parapluie', ouverture: 'ouverture', reveil: 'réveil', degout: 'dégoût', etonne: 'étonné', apres: 'après'
};
const mot = w => MOTS[w] || w;
const humain = s => s.split(/[-_ ]+/).filter(Boolean).map(mot).join(' ').replace(/^./, c => c.toUpperCase());
// Les sujets qui méritent mieux que leur nom de fichier (familiers, bêtes de la mer, plantes du décor)
const SUJETS = {
  tictac: 'Tic-Tac, l\'abeille mécanique de Rivet', mousse: 'Mousse, le renardeau de Sylve', 'bocal-vide': 'Bocal d\'Ondin, vide',
  'bocal-bulle': 'Bocal d\'Ondin, Bulle revenu', macareux: 'Macareux (Bosco, le familier d\'Aster)', grenouille: 'Grenouille (Bouillon, le familier de Cannelle)',
  tortue: 'Tortue (Basalte, le familier de Galet)', 'papillon-lune': 'Papillon de nuit (Lunette, le familier de Mélisse)',
  'baleine-dos': 'Baleine, le dos', 'baleine-queue': 'Baleine, la queue', 'poisson-dorade': 'Dorade', 'poisson-sardine': 'Sardine',
  'koi-or': 'Koï doré', 'koi-blanc': 'Koï blanc', 'koi-orange': 'Koï orange',
  crabe: 'Crabe de la Grève', fantome: 'Petit fantôme (égaré)', zombie: 'Petit zombie tout mou (égaré)', 'lapin-de-brume': 'Lapin de brume (égaré, tempéré)',
  'bouquetin-de-brume': 'Bouquetin de brume (égaré, les Cimes)', 'poney-de-brume': 'Poney de brume (égaré, les Landes)',
  'grenouille-de-brume': 'Grenouille de brume (égaré, le Marais)', 'fennec-de-brume': 'Fennec de brume (égaré, les Dunes)',
  'cameleon-de-brume': 'Caméléon de brume (égaré, la Jungle)', 'salamandre-de-brume': 'Salamandre de brume (égaré, le Volcan)'
};
const PLANTES = {
  bois_flotte: 'Bois flotté', arbre_automne: 'Arbre d\'automne', arbre_mort: 'Arbre mort', sapin_neige: 'Sapin enneigé',
  champignons_nuit: 'Champignons, la nuit', rochers_moussus: 'Rochers moussus', lanterne: 'Lanterne sur pied, éteinte',
  lanterne_allumee: 'Lanterne sur pied, allumée', banc: 'Banc de bois (décor)', aiguille: 'Aiguille de roche',
  nid: 'Nid d\'oiseau', nenuphars: 'Nénuphars', bruyere: 'Bruyère',
  arbre: 'Arbre (grand, vert doux)', arbre_fleuri: 'Arbre (grand, vert doux, pied fleuri)', arbre_profond: 'Arbre (grand, vert profond)',
  arbre_profond_fleuri: 'Arbre (grand, vert profond, pied fleuri)', arbre_petit: 'Arbre (petit, vert doux)', arbre_petit_fleuri: 'Arbre (petit, vert doux, pied fleuri)',
  arbre_petit_profond: 'Arbre (petit, vert profond)', arbre_petit_profond_fleuri: 'Arbre (petit, vert profond, pied fleuri)'
};
// les 16 pommiers refaits (arbres.js) : pommier[_petit][_profond][_fleurs][_tombees]
for (const petit of ['', '_petit']) for (const vert of ['', '_profond']) for (const fleurs of ['', '_fleurs']) for (const tombees of ['', '_tombees']) {
  PLANTES[`pommier${petit}${vert}${fleurs}${tombees}`] = `Pommier (${[petit ? 'petit' : 'grand', `vert ${vert ? 'profond' : 'doux'}`, fleurs ? 'en fleurs' : 'en pommes', tombees && (fleurs ? 'pétales tombés' : 'pommes tombées')].filter(Boolean).join(', ')})`;
}
// les 16 touffes d'herbe refaites (herbes.js) : touffe[_motte][_petite][_profond][_fleurie]
for (const motte of ['', '_motte']) for (const petite of ['', '_petite']) for (const vert of ['', '_profond']) for (const fleurie of ['', '_fleurie']) {
  PLANTES[`touffe${motte}${petite}${vert}${fleurie}`] = `Touffe d'herbe (${[motte && 'avec motte', petite ? 'petite' : 'grande', `vert ${vert ? 'profond' : 'doux'}`, fleurie && 'fleurie'].filter(Boolean).join(', ')})`;
}
const PIECES = { 'arc-en-ciel': 'Arc-en-ciel', 'coeur-lave': 'Cœur de lave', 'filon-or': 'Filon d\'or' };
const ROMAIN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const ETAT_COFFRE = { ferme: 'fermé', ouverture: 'ouverture', ouvert: 'ouvert', rayons: 'rayons (calque)', icone: 'icône' };

function titreSujet(sujet) {
  const av = sujet.match(/^avatar-(\d+)(-naufrage)?$/);
  if (av) return `Avatar, exemple ${+av[1]}${av[2] ? ' (naufragé)' : ''}`;
  const vi = sujet.match(/^visiteur-(\d+)$/);
  if (vi) return `Visiteur ${+vi[1]}`;
  const ar = sujet.match(/^arrivant-(\d+)$/);
  if (ar) return `Nouveau venu ${+ar[1]} (épilogue)`;
  const m = sujet.match(/^([a-z]+)-naufrage$/);
  if (m) return `${NOMS[m[1]]} naufragé${FEM.has(m[1]) ? 'e' : ''}`;
  if (NOMS[sujet]) return NOMS[sujet][0].toUpperCase() + NOMS[sujet].slice(1);
  return SUJETS[sujet] || humain(sujet);
}

// Titre d'un dessin du décor, des bâtiments, de la météo, des coffres ou des plantes
function titreObjet(id, meta) {
  const p = id.split('/');
  const nom = p[p.length - 1];
  if (p[0] === 'coffres') return `Coffre ${(meta.nom || p[1]).toLowerCase()}, ${ETAT_COFFRE[nom.split('_')[2]] || nom}`;
  if (p[0] === 'plantes') return PLANTES[nom] || humain(nom);
  let t = meta.nom ? meta.nom[0].toUpperCase() + meta.nom.slice(1) : humain(nom);
  const plus = [];
  let m;
  if (!/palier/i.test(t)) {
    if ((m = nom.match(/des_palier(\d)/))) plus.push(`dès le palier ${ROMAIN[m[1]]}`);
    else if ((m = nom.match(/palier(\d)/))) plus.push(`palier ${ROMAIN[m[1]]}`);
  }
  if ((m = nom.match(/calque(\d)/))) plus.push(`calque ${m[1]}`);
  if (p[1] === 'moments') plus.push(nom.startsWith('mer_') ? 'la mer' : 'teinte de l\'écran');
  if (p[1] === 'pieces_rares') t = `Pièce rare « ${PIECES[p[2]] || humain(p[2])} »`;
  return plus.length ? `${t}, ${plus.join(', ')}` : t;
}

// Vitesse par défaut, quand l'index du lot ne la donne pas (vitesses des pages animées de l'atelier)
function vitesse(id, pose, images) {
  if (images < 2) return undefined;
  const [top, a] = id.split('/');
  if (top === 'animaux') return pose === 'vol' ? 120 : pose === 'nage' && /mer|familiers/.test(a) ? 420 : 260;
  if (top === 'egares') return { marche: 240, fuite: 160, bouderie: [500, 700], luciole: [300, 200, 200, 1000], brume: [220, 220, 900] }[pose];
  if (top === 'vivants') {
    if (a === 'brume') return /expr/.test(id) ? 600 : 220;
    if (a === 'cerf-blanc') return pose === 'repos' ? [1800, 180] : 300;
    if (pose === 'marche') return a === 'anya' ? 260 : 200;
    return pose === 'repos' ? (a === 'anya' ? 1200 : [900, 160]) : [700, 900];
  }
  if (top === 'personnages') {
    if (/^(marche|lanterne|parapluie)$/.test(pose)) return 170;
    if (pose === 'repos') return [900, 160];
    if (pose === 'salut') return 260;
    if (pose === 'dort' || pose === 'couche') return 900;
    if (pose === 'expr') return 800;
    if (pose === 'grelotter') return 140; // un frisson
    if (pose === 'lire') return [1400, 900];
    if (pose === 'ramasser') return [500, 800];
    return [700, 1100];
  }
  return undefined;
}

// Ce que les index des lots savent d'un fichier : nom, cadre, vitesse, autres détails
function collecterMeta(index, base, out) {
  const walk = (v, ctx) => {
    if (Array.isArray(v)) { v.forEach(x => walk(x, ctx)); return; }
    if (typeof v === 'string') { if (/\.svg$/.test(v)) out.set(path.posix.join(base, v), ctx); return; }
    if (!v || typeof v !== 'object') return;
    const c = { ...ctx };
    for (const k of ['nom', 'batiment', 'cadre', 'ms_par_image', 'ips', 'ms', 'etape']) if (v[k] !== undefined && typeof v[k] !== 'object' || (k === 'cadre' || k === 'ms_par_image') && Array.isArray(v[k])) c[k] = v[k];
    for (const [k, x] of Object.entries(v)) if (!['_lisez_moi', 'nom', 'cadre'].includes(k)) walk(x, c);
  };
  walk(index, {});
}

function viewBox(file) {
  const m = fs.readFileSync(file, 'utf8').match(/viewBox="([^"]+)"/);
  return m ? m[1].trim().split(/[\s,]+/).map(Number) : null;
}

function construire(svgRoot, metas) {
  const fichiers = lister(svgRoot).filter(f => f.endsWith('.svg'));
  const groupes = new Map();
  for (const f of fichiers) {
    const id = f.replace(/\.svg$/, '').replace(/_\d+$/, '');
    if (!groupes.has(id)) groupes.set(id, []);
    groupes.get(id).push(f);
  }
  const entrees = [];
  for (const [id, fs0] of groupes) {
    const files = fs0.sort((x, y) => (+(x.match(/_(\d+)\.svg$/) || [0, 0])[1]) - (+(y.match(/_(\d+)\.svg$/) || [0, 0])[1]));
    const meta = metas.get(files[0]) || {};
    const [top] = id.split('/');
    const nom = id.split('/').pop();
    const e = { id, rubrique: top };
    const perso = top === 'personnages' || top === 'animaux' || top === 'vivants' || top === 'egares';
    if (perso) {
      const tok = nom.split('_');
      e.sujet = tok[0];
      if (VUES[tok[1]]) { e.vue = tok[1]; e.pose = tok[2]; if (tok.length > 3) e.variante = tok.slice(3).join('_'); }
      else if (tok[1] === 'expr') { e.pose = 'expr'; e.variante = tok.slice(2).join('_'); }
      else if (tok[1]) { e.pose = tok[1]; if (tok.length > 2) e.variante = tok.slice(2).join('_'); }
      const t = [titreSujet(e.sujet)];
      if (e.vue) t.push(VUES[e.vue]);
      if (e.pose) t.push(e.pose === 'expr' ? 'expression' : mot(e.pose));
      if (e.variante) t.push(humain(e.variante).toLowerCase());
      e.titre = t.join(', ');
      if (e.vue) { e.regarde = REGARDE[e.vue]; if (e.vue !== 'face') e.miroir = true; }
      if (e.sujet === 'brume' && STADE_TITRE[e.pose]) e.titre = `Brume, ${STADE_TITRE[e.pose]}`;
    } else {
      e.titre = titreObjet(id, meta);
      if (meta.batiment) e.batiment = meta.batiment;
    }
    e.images = files.length;
    e.fichiers = files.map(f => 'svg/' + f);
    const vb = viewBox(path.join(svgRoot, files[0]));
    if (vb) e.cadre = vb;
    const ms = meta.ms_par_image || meta.ms || (meta.ips ? Math.round(1000 / meta.ips) : undefined) || vitesse(id, e.pose, files.length);
    if (files.length > 1 && ms) e.ms_par_image = ms;
    e.parcours = moment(id, meta);
    Object.assign(e, statut(id));
    entrees.push(e);
  }
  // Deux groupes du même objet (états d'un coffre, d'un gisement) : on précise l'état
  const vus = new Map();
  for (const e of entrees) vus.set(e.titre, (vus.get(e.titre) || 0) + 1);
  const RUB = { plantes: 'plante', creations: 'création', objets: 'objet de boutique', pieces_rares: 'pièce rare', annexes: 'annexe', lieux: 'lieu remarquable', enseignes: 'enseigne', camp: 'camp', ilots: 'mer et îlots', lumieres: 'lumière', icones: 'icône' };
  for (const e of entrees) if (vus.get(e.titre) > 1) { const p = e.id.split('/'); e.titre += ` (${RUB[p[1]] || RUB[p[0]] || humain(p[p.length - 1]).toLowerCase()})`; }
  vus.clear();
  for (const e of entrees) vus.set(e.titre, (vus.get(e.titre) || 0) + 1);
  for (const e of entrees) if (vus.get(e.titre) > 1) e.titre += ` — ${e.id.split('/').pop().replace(/_/g, ' ')}`;
  const ordre = new Map(CHAPITRES.map(([c], i) => [c, i]));
  entrees.sort((x, y) => ordre.get(x.parcours) - ordre.get(y.parcours) || x.id.localeCompare(y.id));
  return entrees;
}

module.exports = { renommer, lister, reecrireIndex, collecterMeta, construire, MIROIR_KIT, miroir, CHAPITRES, MANQUANTS };
