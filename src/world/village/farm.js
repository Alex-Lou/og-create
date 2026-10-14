// Le village (world/village.js) : la ferme. Les poules de Cannelle autour de leur cage ou de leur poulailler (au
// tutoriel, celles qui se sont échappées), et les bêtes du Potager selon son palier.
import { eggLayer } from '../campArt';
import { viewOf, stepAt } from '../beastArt';
import { hash, clamp, beast } from './beast';

// Les poules de Cannelle (serveur : services/beasts.js) : leur robe dans la bibliothèque
const HEN_LOOKS = {
  'poule-rousse': 'rousse', 'poule-blanche': 'blanche', 'poule-noire': 'noire',
  'poulette-muscade': 'rousse', 'poulette-praline': 'blanche', 'poulette-noisette': 'grise'
};
// Le poulailler (les poules, le coq, les poussins) : de nuit, ils dorment debout, sans pose de repos
const ROOST = new Set(['hen', 'rooster', 'chick']);

// Les bêtes de la ferme et leur pré : [{ id, species, variant, k, seg, field, beast, egg }]
export function farmOf({ grid, M, built, coop, bestiary }) {
  // Ferme : les poules au camp, autour de leur cage ; les autres bêtes autour du Potager, selon son palier
  const potager = built.find(s => s.id === 'potager');
  const penAround = (x0, y0, x1, y1, grounds) => {
    const cells = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (grid.walk(x, y) && grounds.includes(M.ground(x, y))) cells.push({ x, y });
    return cells;
  };
  const pen = potager ? penAround(potager.x - 3, potager.y - 3, potager.x + potager.w + 3, potager.y + potager.h + 3, 'gm') : [];
  // (la plage de Brumelune : du sable aussi)
  const coopPen = coop ? penAround(coop.x - 3, coop.y - 3, coop.x + 4, coop.y + 4, 'gms') : [];
  const farm = [];
  // seg : durée d'un tour (secondes) : marche vers une case de son pré (field), puis broute ou picore ; beast : son nom
  // au serveur (bêtes de ferme, bible § 6.16 : on la nourrit, elle remplit sa bulle) ; egg : sa bulle attend (un œuf au sol)
  const add = (species, variant, seg, field, beast = null, egg = false) => farm.push({ id: `farm:${species}:${farm.length}`, species, variant, k: farm.length, seg, field, beast, egg });
  if (coopPen.length >= 3) coop.hens.forEach((hen, i) => add(hen.species || 'hen', HEN_LOOKS[hen.id] || '', 8 + i, coopPen, hen.id, hen.ready > 0));
  if (potager && pen.length >= 3) {
    if (potager.level >= 3) add('cow', '', 16, pen, 'vache');
    if (potager.level >= 4) {
      add('sheep', '', 13, pen, 'mouton');
      add('sheep', '', 14, pen, 'brebis');
    }
    if (potager.level >= 5) add('pig', '', 12, pen, 'cochon');
    if (potager.level >= 6) add('goat', '', 11, pen, 'chevre');
  }
  // Le Bestiaire : un élément de la ferme écrit ajoute une variante aux bêtes déjà là (les poules, au camp)
  const kinds = new Set(farm.map(a => a.species));
  bestiary.farm.filter(([species]) => kinds.has(species)).forEach(([species, variant], i) => add(species, variant, 10 + i, species === 'hen' ? coopPen : pen));
  return farm;
}

// La ferme à l'instant du dessin (f : t, phase, rain, tapped, out) ; loose : les poules échappées du tutoriel
export function drawFarm(f, farm, loose) {
  const { t, phase, rain, tapped, out } = f;
  for (const a of farm) {
    const rest = a.field[Math.floor(hash(a.k, 31) * a.field.length)];
    const target = i => a.field[Math.floor(hash(a.k * 13 + i, 37) * a.field.length)];
    // Son œuf, au sol à sa place de repos, tant que sa bulle attend
    if (a.egg) {
      const egg = eggLayer();
      if (egg) out.push({ id: `egg:${a.beast}`, kind: 'egg', species: 'egg', x: rest.x + 0.3, y: rest.y + 0.25, z: 0, flip: false, frame: 0, sprite: [egg.key, egg.make] });
    }
    let x = rest.x;
    let y = rest.y;
    let frame = 0;
    let flip = hash(a.k, 2) < 0.5;
    let look = null;
    let moving = false;
    const free = loose && a.beast ? loose.get(a.beast) : null;
    if (free) {
      // (échappée : à sa place, elle picore ; touchée une première fois, elle bondit jusqu'à l'autre)
      const k = free.at === null ? 1 : clamp((t - free.at) / free.span);
      x = free.from.x + (free.to.x - free.from.x) * k;
      y = free.from.y + (free.to.y - free.from.y) * k;
      const hopping = k < 1;
      flip = (free.to.x - free.from.x) - (free.to.y - free.from.y) < 0;
      frame = hopping ? 0 : Math.floor(t * 1.6 + a.k) % 3 === 0 ? 1 : 0;
      look = { view: hopping ? viewOf(free.to.x - free.from.x, free.to.y - free.from.y) : 'profil', pose: 'marche', n: hopping ? stepAt(t, a.k) : frame + 1 };
      // (elle détale en trois petits bonds, les pattes au pas, au lieu de glisser)
      out.push({ ...beast(a.id, a.species, a.variant, x, y, hopping ? Math.abs(Math.sin(k * Math.PI * 3)) * 6 : 0, flip, frame, look), beast: a.beast });
      continue;
    }
    if (phase.night > 0.6) frame = ROOST.has(a.species) ? 0 : 'rest';
    else if (rain <= 0.5) {
      const seg = (t + a.k * 3.7) / a.seg;
      const i = Math.floor(seg);
      const k = seg - i;
      const [from, to] = [target(i - 1), target(i)];
      const move = clamp(k / 0.4);
      moving = move < 1;
      x = from.x + (to.x - from.x) * move;
      y = from.y + (to.y - from.y) * move;
      flip = (to.x - from.x) - (to.y - from.y) < 0;
      // En marche : image 0 ; arrêtée : elle broute ou picore de temps en temps (image 1)
      frame = move < 1 ? 0 : Math.floor(t * 1.2 + a.k) % 3 === 0 ? 1 : 0;
      // Dessin de la bibliothèque : de trois quarts selon sa direction, ses pas à sa cadence ; arrêtée, dans la même vue
      look = { view: viewOf(to.x - from.x, to.y - from.y), pose: 'marche', n: move < 1 ? stepAt(t, a.k) : frame + 1 };
    }
    const hop = tapped(a.id, 0.6);
    // Touchée, elle bondit de joie (un cœur), sauf endormie ; en marche, elle saute sans quitter son pas (sa pose de joie
    // la ferait glisser, figée)
    const glad = hop !== null && frame !== 'rest' && !moving ? { view: look ? look.view : 'profil', pose: 'joie' } : look;
    out.push({ ...beast(a.id, a.species, a.variant, x, y, hop === null ? 0 : Math.sin(hop * Math.PI) * 5, flip, frame, glad), ...(a.beast ? { beast: a.beast } : {}) });
    // Les poussins suivent la poule rousse (tournés comme elle)
    if (a.beast === 'poule-rousse') {
      [[-0.32, 0.18], [-0.22, 0.4]].forEach(([dx, dy], c) => {
        const step = phase.night > 0.6 ? 0 : Math.floor(t * 2 + c) % 2;
        out.push(beast(`farm:chick:${c}`, 'chick', '', x + dx, y + dy, 0, flip, step, look && { view: look.view, pose: 'marche', n: step + 1 }));
      });
    }
  }
}
