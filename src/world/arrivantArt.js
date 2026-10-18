// Les habitants venus d'ailleurs sur l'île (les arrivants accueillis, et les visiteurs installés d'avant) : dessinés à la
// volée par le générateur de l'avatar (game/avatarKit.js ; generateur/avatar.mjs : quotidien), d'après leurs choix (look)
// ou, sans choix, l'allure que leur graine tire (assorti), dans les poses des maîtres (masterArt.js : poseOf). Chaque image
// se calcule une fois, quand l'île la montre (≈ 2 ms), puis le cache des sprites la garde. Tant que le générateur n'est
// pas chargé (il se charge à la demande : loadKit), rien ne se dessine : jamais l'ancien générateur.
import { kitNow } from '@/game/avatarKit';
import { poseOf, VISITOR_WORK } from './masterArt';

// Les poses que l'île leur demande : marche, repos, salut et les gestes des métiers dans les trois vues ; la lanterne et le
// parapluie de trois quarts ; couché
const GESTURES = ['marche', 'repos', 'salut', 'arroser', 'becher', 'semer', 'recolter', 'scier', 'tailler', 'pecher', 'piocher'];
const NAMES = [...['face', 'avant', 'dos'].flatMap(v => GESTURES.map(g => `${v}_${g}`)), 'avant_lanterne', 'dos_lanterne', 'avant_parapluie', 'dos_parapluie', 'couche'];
const SCALE = 1.25;
const FEET = [24, 62];
// Les arrivants préparés, gardés (il y en a quatre au plus sur une île ; le plus ancien part au-delà)
const MAX = 8;
const cast = new Map();

// Une empreinte courte de ses choix : la clé de ses images change avec eux
function tagOf(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}
// La flamme de sa lanterne, de trois quarts avant, debout (l'image 2), mesurée sur son dessin : le centre du verre
// (#FFE7A0), en unités du jeu depuis les pieds ; ou null
function flameOf(svg) {
  const glass = svg.match(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*fill="#FFE7A0"/);
  if (!glass) return null;
  const lift = Number((svg.match(/<g transform="translate\(0 (-?[\d.]+)\)">/) || [0, 0])[1]);
  const x = 48 - (Number(glass[1]) + Number(glass[3]) / 2);
  const y = Number(glass[2]) + Number(glass[4]) / 2 + lift;
  return [Math.round(((x - FEET[0]) / SCALE) * 10) / 10, Math.round(((y - FEET[1]) / SCALE) * 10) / 10];
}

// Un arrivant préparé : ses fichiers (les noms de ses images, comme ceux d'un personnage de la bibliothèque), sa source
// (poseOf, artOf : ses images, rendues tout de suite), sa lanterne. who : { seed, look }
function castOf(kit, who) {
  const choices = who.look || kit.assorti(who.seed, { gratuit: true });
  const tag = tagOf(JSON.stringify(choices));
  if (cast.has(tag)) return cast.get(tag);
  const q = kit.quotidien(choices, `a${tag}`);
  const files = {};
  for (const name of NAMES) {
    const k = q.images(name);
    if (k) files[name] = Array.from({ length: k }, (_, i) => `${name}#${i + 1}`);
  }
  const image = file => { const [name, n] = file.split('#'); return q.image(name, Number(n)); };
  let flame;
  const entry = {
    files,
    source: { now: true, has: file => Boolean(files[file.split('#')[0]]), key: file => `arr-${tag}-${file}`, text: image },
    flame: () => (flame === undefined ? (flame = files.avant_lanterne ? flameOf(image('avant_lanterne#2')) : null) : flame),
    image
  };
  if (cast.size >= MAX) cast.delete(cast.keys().next().value);
  cast.set(tag, entry);
  return entry;
}

// Son dessin pour l'île, selon sa pose (les options de masterSprite) : { key, make, view, lantern } ; site : le bâtiment
// de son métier (à sa porte, le geste du bâtiment : VISITOR_WORK). null tant que le générateur n'est pas là
export function arrivantSprite(who, site, { pose = 'idle', view = 'se', frame = 0, lantern = false, umbrella = false, chore = null } = {}) {
  const kit = kitNow();
  if (!kit || !who || pose === 'tired') return null;
  const one = castOf(kit, who);
  return poseOf(one.files, { pose, view, frame, lantern, umbrella, chore, work: VISITOR_WORK[site] || 'repos', flame: lantern ? one.flame() : null }, one.source);
}

// Son portrait (de face, au repos), en adresse d'image ; '' tant que le générateur n'est pas là
export function arrivantPortrait(who) {
  const kit = kitNow();
  if (!kit || !who) return '';
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(castOf(kit, who).image('face_repos#1'))}`;
}
