// L'avatar composé du joueur (HISTOIRE.md § 6.17) : ses choix (un objet, gardé par le serveur), dessinés par le
// générateur de la bibliothèque (design/bibliotheque/generateur/avatar.mjs), chargé à la demande (il pèse ~200 Ko).
// Le catalogue des choix (noms, nuanciers, accessoires, ce qui est gratuit : avatar.json) est dans avatarCatalog.js,
// lu seulement par l'éditeur (chargé à la demande) : ce module-ci part au démarrage (les scènes), sans ses 260 Ko.
// Un avatar est soit l'un des douze exemples de la bibliothèque (« avatar-03 », game/sceneArt.js), soit ses choix.
import { reactive } from 'vue';

const state = reactive({ kit: null, failed: false });
let loading = null;

// Un avatar composé (ses choix), et non l'un des exemples
export const isCustom = look => Boolean(look) && typeof look === 'object' && !Array.isArray(look);

// Le générateur, chargé une fois ; rend le module (ou null s'il n'a pas pu l'être)
export function loadKit() {
  if (!loading) {
    loading = import('../../design/bibliotheque/generateur/avatar.mjs')
      .then(kit => (state.kit = kit))
      .catch(() => {
        state.failed = true;
        return null;
      });
  }
  return loading;
}

// Le générateur s'il est là (réactif : un calcul qui le lit se refait quand il arrive), sinon null (il se charge)
export function kitNow() {
  if (!state.kit && !state.failed) loadKit();
  return state.kit;
}
export const kitFailed = () => state.failed;

// Les poses de face : celle du kit, son nombre d'images, son geste
const FACE = { repos: ['repos', 2], salut: ['salut', 2], grelotter: ['action', 2, 'grelotter'], lire: ['action', 2, 'lire'] };

const toUrl = svg => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
// Le trois quarts avant du kit regarde en bas à gauche ; la bibliothèque et le jeu le tournent en bas à droite
const mirrored = body => `<g transform="translate(48 0) scale(-1 1)">${body}</g>`;

const cache = new Map();
function memo(key, make) {
  if (!cache.has(key)) {
    if (cache.size > 120) cache.clear();
    cache.set(key, make());
  }
  return cache.get(key);
}

// Le personnage du kit pour ces choix (naufragé ou en tenue de croisière) ; null si un choix est inconnu
function characterOf(kit, choices, naufrage) {
  try {
    return naufrage ? kit.avatarNaufrage(choices, { uid: 'avn' }) : kit.avatar(choices, { uid: 'av' });
  } catch (error) {
    return null;
  }
}

// Les images de l'avatar composé pour une scène (mêmes vues et poses que les exemples, game/sceneArt.js) : des URL
// data:, dans l'ordre ; [] tant que le générateur se charge, ou si un choix est inconnu
export function customFrames(choices, { vue = 'face', pose = 'repos', naufrage = true } = {}) {
  const kit = kitNow();
  if (!kit) return [];
  return memo(`${JSON.stringify(choices)}|${vue}|${pose}|${naufrage}`, () => {
    const c = characterOf(kit, choices, naufrage);
    if (!c) return [];
    if (vue === 'face' || pose === 'salut') {
      const [kitPose, n, geste] = FACE[pose] || FACE.repos;
      const who = geste ? { ...c, geste } : c;
      return Array.from({ length: n }, (_, i) => toUrl(kit.svg(kit.frame(who, 'front', kitPose, i))));
    }
    const view = vue === 'avant' ? 'se' : 'ne';
    const body = kit.frame(c, view, 'marche', 1);
    return [toUrl(kit.svg(view === 'se' ? mirrored(body) : body))];
  });
}

// Le tour sur soi-même de l'aperçu (la carte d'embarquement) : de face, trois quarts avant, dos, puis l'autre côté
export const TURN = [
  { view: 'front', flip: false }, { view: 'se', flip: true }, { view: 'ne', flip: false },
  { view: 'ne', flip: true }, { view: 'se', flip: false }
];
// Une image du tour (step : TURN) : de face, au repos (n : 0, ou 1 pour le clignement) ; sinon, les pieds joints
export function turnFrame(choices, step, n = 0, naufrage = false) {
  const kit = kitNow();
  if (!kit) return null;
  return memo(`${JSON.stringify(choices)}|turn|${step.view}|${step.flip}|${n}|${naufrage}`, () => {
    const c = characterOf(kit, choices, naufrage);
    if (!c) return null;
    const body = step.view === 'front' ? kit.frame(c, 'front', 'repos', n) : kit.frame(c, step.view, 'marche', 1);
    return toUrl(kit.svg(step.flip ? mirrored(body) : body));
  });
}
