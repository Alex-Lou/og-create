// Le spectacle de « Tout ouvrir » (choix de l'auteur, 14 oct. : refaire la fenêtre, ses animations et ses effets) : ce
// que fait chaque coffre en s'ouvrant, selon sa rareté (les mots sont les paliers féeriques des mini-jeux, de Joli ! à
// Féerique !), et le rythme de la rafale. Rien ici ne change ce que donnent les coffres (le serveur les a déjà ouverts).
import { TIER_WORDS } from '@/texts/game/onomatopees';

// Par rareté : le mot (word) et ses couleurs (fill : [clair, couleur]), les étincelles (sparks, n), la secousse (shake,
// px), l'éclair (flash, ou null), la vibration
export const CHEST_FX = {
  commun: { word: TIER_WORDS.joli, fill: ['#F4FBE6', '#7FA552'], sparks: ['#FFFFFF', '#D6EBB4', '#9DBB6E'], n: 10, shake: 0, flash: null, buzz: 8 },
  rare: { word: TIER_WORDS.superbe, fill: ['#E6F1FF', '#3F7FD8'], sparks: ['#FFFFFF', '#B4D2FF', '#4C8FE8'], n: 16, shake: 0, flash: null, buzz: 10 },
  epique: { word: TIER_WORDS.magique, fill: ['#F6ECFF', '#9A5CE0'], sparks: ['#FFFFFF', '#DEC2FF', '#A86BE8', '#FFE08A'], n: 22, shake: 2, flash: null, buzz: [10, 30, 12] },
  legendaire: { word: TIER_WORDS.feerique, fill: ['#FFF6D6', '#E39A2E'], sparks: ['#FFFFFF', '#FFE08A', '#F2C04B', '#FFB070'], n: 32, shake: 4, flash: 'rgba(255, 240, 200, 1)', buzz: [12, 40, 18, 40, 24] }
};
// Les pièces d'or d'un lot d'écus
export const COINS = ['#FFE58A', '#F2C04B', '#D99A2B'];

export const fxOf = rarity => CHEST_FX[rarity] || CHEST_FX.commun;

// La rafale : les cartes arrivent (DEAL_MS), puis un coffre s'ouvre tous les stepOf(n) ms — la rafale entière tient en
// moins de 3 s, même avec beaucoup de coffres, et chacun a le temps de briller quand ils sont peu nombreux
export const DEAL_MS = 450;
export const stepOf = n => Math.round(Math.min(650, Math.max(240, 2600 / Math.max(n, 1))));
export const startOf = (i, n) => DEAL_MS + i * stepOf(n);

// La gerbe d'un coffre qui s'ouvre, sur une scène (game/stage) : un anneau, des étincelles de sa rareté (des pièces d'or
// pour un lot d'écus), son mot ; l'épique fait trembler la scène, le légendaire aussi et l'éclaire. (x, y) : le cœur du
// coffre ; top : où se dit son mot ; scale : 1 dans la rafale de « Tout ouvrir », plus grand pour un coffre seul
export function chestBurst(stage, { x, y, top, rarity, coins = false, scale = 1 }) {
  const fx = fxOf(rarity);
  const big = rarity === 'legendaire';
  const k = (big ? 1.4 : rarity === 'epique' ? 1.2 : 1) * scale;
  stage.particles.burst(x, y, { n: 1, shape: 'ring', colors: [fx.sparks[1]], speed: [0, 0], size: [16 * scale, 16 * scale], size1: 3.2 * k, gravity: 0, spin: 0, life: [520, 520], fade: 1 });
  stage.particles.burst(x, y, { n: Math.round(fx.n * scale), shape: 'star', colors: fx.sparks, speed: [90 * k, 220 * k], angle: -Math.PI / 2, spread: Math.PI * 1.6, size: [3 * scale, 6.5 * scale], gravity: 160, life: [650, 1100] });
  if (coins) stage.particles.burst(x, y, { n: Math.round(10 * scale), shape: 'circle', colors: COINS, speed: [110 * scale, 240 * scale], angle: -Math.PI / 2, spread: Math.PI * 0.9, size: [3 * scale, 4.5 * scale], gravity: 520, life: [600, 900] });
  stage.texts.add({ text: fx.word, x, y: top, size: Math.round((big ? 26 : 20) * scale), fill: fx.fill, font: big ? 'display' : 'ui', look: big ? 'label' : 'word', rays: big, tilt: (Math.random() - 0.5) * 0.25, life: 1100 + (scale > 1 ? 300 : 0), rise: 16 });
  if (fx.shake) stage.shake(fx.shake);
  if (fx.flash) stage.flash(fx.flash, 260);
  stage.wake();
}
