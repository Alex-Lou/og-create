// Le camp des naufragés dessiné dans la bibliothèque (design/bibliotheque/svg/decor/camp, camp.json) : l'épave de
// l'Hirondelle, les coins des maîtres (débris, abri, cabanon), la tente et le hamac des voyageurs, les objets. Le
// serveur dit quoi poser et où (state.camp : { art, x, y, w, h }) ; chaque dessin est au cadre du jeu × 1,25, ancré au
// centre de son emprise au sol (2 × 2 ou 1 case). La cage aux poules d’Agathe et l'œuf (camp/poules, poules.json) :
// coincée sous les rochers (elle remue), puis ouverte ; l'œuf au sol, près de la poule qui l'a pondu.
import CAMP from '../../design/bibliotheque/svg/decor/camp/camp.json';
import POULES from '../../design/bibliotheque/svg/decor/camp/poules/poules.json';
import PREPONTON_THUMB from '../../design/bibliotheque/svg/decor/camp/coins/aster/aster_preponton_1.svg?url';
import { librarySprite, frameAt, textsOf } from './library';
import { NAMES, LIBRARY_NAMES } from './faces';
import { CAMP_LINES } from '@/texts/world/camp';

const FILES = textsOf(import.meta.glob('/design/bibliotheque/svg/decor/camp/**/*.svg', { query: '?url', import: 'default', eager: true }));
const ROOT = '/design/bibliotheque/svg/decor/camp/';
const SCALE = 1.25;
// La taille d'un dessin du camp sur l'île (son cadre grandit autour de l'ancre, net : le SVG est redessiné à cette
// taille) : la cuisine d’Agathe tient son rang face au feu de camp (choix de l'auteur, 16 oct.)
const ART_SCALE = { cannelle_debris: 1.3, cannelle_abri: 1.3, cannelle_cabanon: 1.3 };
// (aussi pour sa zone de toucher : world/view/gestures.js)
export const campScale = art => ART_SCALE[art] || 1;
const scaleOf = campScale;
const boxOf = ([x, y, w, h], k = 1) => ({ x: (x / SCALE) * k, y: (y / SCALE) * k, w: (w / SCALE) * k, h: (h / SCALE) * k });
// Le foyer d'un dessin du camp, qui brûle comme le feu de camp (sa lumière la nuit, ses braises) : le cœur de sa flamme,
// mesuré sur le dessin (px du jeu depuis l'ancre, à la taille 1), et le rayon de sa lumière. La cuisine d’Agathe : le feu
// sous la marmite des débris, celui de son abri, les braises sous la marmite de son cabanon
const HEARTHS = { cannelle_debris: [3, -9.5, 36], cannelle_abri: [34, -6.5, 36], cannelle_cabanon: [27, 8, 36] };

// Les dessins du camp, la cage comprise (cage_coincee, cage_ouverte : le nom que le serveur envoie)
const OBJETS = {
  ...CAMP.objets,
  ...Object.fromEntries(Object.entries(POULES.poules).map(([id, e]) => [id, { ...e, ms: e.ms_par_image, fichiers: e.fichiers.map(f => `poules/${f}`) }]))
};

const makes = new Map();
// Le calque d'un dessin du camp à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function campLayer(art, t = 0) {
  const entry = OBJETS[art];
  if (!entry) return null;
  const f = frameAt({ fichiers: entry.fichiers, ms_par_image: entry.ms || 1000 }, t);
  const path = ROOT + entry.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(entry.cadre, scaleOf(art))));
  return { key: `camp-${art}-${f}`, make: makes.get(path) };
}
// Le dessin du camp qu'un bâtiment porte à la place du sien (state.sites : look ; choix de l'auteur, 16 oct. : au palier I
// d'une île à la plage, le Ponton est le pré-ponton que Lorena bricole seule avant que Nathan ne l'aide) : { art, thumb }
// (thumb : sa vignette, pour la fiche du bâtiment), ou null
const SITE_LOOKS = { preponton: { art: 'aster_preponton', thumb: PREPONTON_THUMB } };
export const siteLook = look => SITE_LOOKS[look] || null;
// Le foyer d'un élément du camp, à sa taille sur l'île : { x, y } (le cœur de la flamme, depuis l'ancre), r (le rayon
// de sa lumière) ; null s'il n'a pas de feu
export function campHearth(art) {
  const hearth = HEARTHS[art];
  if (!hearth) return null;
  const k = scaleOf(art);
  return { x: hearth[0] * k, y: hearth[1] * k, r: hearth[2] * k };
}

// Les calques d'un élément du camp à l'instant t (camp.json : calques ; la grande Hirondelle, choix de l'auteur, 15 oct.) :
// la coque, puis la végétation qui la gagne (stade 1 à 3), la neige l'hiver, la pluie, la lanterne de Lorena, et ce qui
// bouge par-dessus. look : { stade, hiver, mouille, lanterne }. [{ key, make }] ; [] si la bibliothèque ne l'a pas
export function campLayers(art, t = 0, look = {}) {
  const base = campLayer(art, t);
  if (!base) return [];
  const c = OBJETS[art].calques;
  if (!c) return [base];
  const stade = Math.min(look.stade || 0, (c.envahie || []).length);
  const names = [stade && c.envahie[stade - 1], look.hiver && c.neige, look.mouille && c.mouillee, look.lanterne && c.lanterne, c.vie];
  return [base, ...names.filter(Boolean).map(name => campLayer(name, t)).filter(Boolean)];
}
// L'élément a-t-il des calques (le jeu lui cherche alors son état : saison, pluie, végétation) ?
export const hasLayers = art => Boolean(OBJETS[art] && OBJETS[art].calques);
// Ses lumières, ses perchoirs (au jeu : u, v en cases, z et rayon en pixels du monde) et son ombre ({ hw, hh } en
// cases, h en pixels) ; lanterne : la lumière ne s'allume qu'une fois la lanterne posée
const unscale = v => v / SCALE;
export const campLights = art => ((OBJETS[art] && OBJETS[art].lumieres) || []).map(l => ({ u: l.u, v: l.v, z: unscale(l.z), r: unscale(l.rayon), lanterne: Boolean(l.lanterne) }));
export const campPerches = art => ((OBJETS[art] && OBJETS[art].perchoirs) || []).map(p => ({ u: p.u, v: p.v, z: unscale(p.z) }));
export const campShadow = art => (OBJETS[art] && OBJETS[art].ombre) || null;
// Les cases autour d'un élément où rien de naturel ne pousse (la tranchée de la grande Hirondelle) : [dx, dy] depuis
// le coin de son emprise
export const campClear = art => (OBJETS[art] && OBJETS[art].degage) || [];
// Son reflet sur la mer (le calque à part, posé sous la terre ; teint du ciel par drawPhareReflet) : { img, cadre }, en
// image chargée une fois ; null s'il n'en a pas, ou tant qu'il se charge. onReady : redessiner une fois prêt
const reflets = new Map();
export function campReflet(art, onReady = null) {
  const name = OBJETS[art] && OBJETS[art].reflet;
  const entry = name && OBJETS[name];
  if (!entry) return null;
  const path = ROOT + entry.fichiers[0];
  let r = reflets.get(path);
  if (!r) {
    r = { img: null, cadre: entry.cadre };
    reflets.set(path, r);
    if (FILES[path]) {
      FILES[path]().then(svg => {
        const img = new Image();
        img.onload = () => { r.img = img; if (onReady) onReady(); };
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      });
    }
  }
  return r.img ? r : null;
}

// Son nom (« Épave de l'Hirondelle », « Lorena · abri »…), pour la bulle au toucher ; la bibliothèque y garde les
// prénoms d'avant (faces.js : LIBRARY_NAMES), le jeu dit les nouveaux
const RENAMED = Object.fromEntries(Object.entries(LIBRARY_NAMES).map(([id, old]) => [old, NAMES[id]]));
export const campName = art => ((OBJETS[art] && OBJETS[art].nom) || '').split(' ').map(word => RENAMED[word] || word).join(' ');
// Ce que dit un élément du camp quand on le touche : { title, text }
export const campInfo = art => ({ title: campName(art), text: CAMP_LINES[art] || CAMP_LINES[art.split('_')[0]] || '' });
// L'œuf posé au sol (ancre au centre de sa case)
export const eggLayer = () => campLayer('oeuf');
