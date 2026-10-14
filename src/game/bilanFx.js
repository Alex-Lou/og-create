// Le spectacle du bilan d'un niveau (choix de l'auteur, 14 oct. : le bilan en fête) : chaque étoile gagnée claque dans
// une gerbe d'or, la dernière dit son mot (les paliers féeriques des mini-jeux : Joli ! pour une étoile, Superbe ! pour
// deux, Clair de lune ! pour les trois), trois étoiles font pleuvoir l'or. Les écus des étoiles nouvelles tintent, une
// saison qui s'ouvre scintille. Rien ici ne change le bilan : le serveur l'a compté.
import { TIERS } from './stage/tiers';

// Une étoile claque toutes les STAR_MS ; elle frappe à la 2e image de sa suite (ses images durent 140 ms)
export const STAR_MS = 450;
export const IMPACT_MS = 140;
export const clapAt = k => (k - 1) * STAR_MS + IMPACT_MS;
// Le palier dit par la dernière étoile, selon le compte (rien sans étoile)
const TIER_OF = { 1: TIERS[1], 2: TIERS[2], 3: TIERS[5] };
export const tierOfStars = stars => TIER_OF[Math.min(3, stars)] || null;

const GOLD = ['#FFFFFF', '#FFE08A', '#F2C04B', '#E9A23B'];
const COINS = ['#FFE58A', '#F2C04B', '#D99A2B'];

// La gerbe d'une étoile qui claque, en (x, y) ; la dernière (last) dit son mot en `at` ({ x, y } : au-dessus du
// coffret) — word : son palier, ou rien
export function starBurst(stage, { x, y, k, last = false, word = null, at = { x, y } }) {
  const big = k >= 3;
  stage.particles.burst(x, y, { n: 1, shape: 'ring', colors: ['#FFE08A'], speed: [0, 0], size: [12, 12], size1: big ? 3.6 : 2.8, gravity: 0, spin: 0, life: [460, 460], fade: 1 });
  stage.particles.burst(x, y, { n: 8 + k * 4, shape: 'star', colors: GOLD, speed: [70 + k * 20, 170 + k * 30], spread: Math.PI * 2, size: [2.5, 5.5], gravity: 140, life: [550, 950] });
  if (last && word) {
    const crown = word === TIERS[5];
    stage.texts.add({ text: word.label, x: at.x, y: at.y, size: crown ? 26 : 22, fill: word.fill, font: 'display', look: 'label', rays: crown, life: 1500, rise: 14 });
    if (crown) stage.flash(word.flash, 260);
  }
  stage.shake(big ? 3 : 1);
  stage.wake();
}

// Trois étoiles : une pluie d'or sur toute la largeur, qui tombe du haut
export function goldRain(stage) {
  for (let i = 0; i < 7; i++) {
    const x = (stage.w * (i + 0.5)) / 7;
    stage.particles.burst(x, -6, { n: 4, shape: i % 2 ? 'star' : 'circle', colors: i % 2 ? GOLD : COINS, speed: [30, 90], angle: Math.PI / 2, spread: 0.8, size: [2.5, 4.5], gravity: 260, life: [1100, 1600] });
  }
  stage.wake();
}

// Les écus des étoiles nouvelles : des pièces qui sautent de leur ligne ; une saison qui s'ouvre : des étincelles
export function coinsPop(stage, { x, y }) {
  stage.particles.burst(x, y, { n: 10, shape: 'circle', colors: COINS, speed: [90, 190], angle: -Math.PI / 2, spread: Math.PI * 0.8, size: [2.5, 4], gravity: 480, life: [600, 900] });
  stage.wake();
}
export function seasonSparkle(stage, { x, y, w }) {
  for (const dx of [-0.42, 0, 0.42]) stage.particles.burst(x + dx * w, y, { n: 4, shape: 'star', colors: GOLD, speed: [40, 110], spread: Math.PI * 2, size: [2, 4], gravity: 40, life: [700, 1100] });
  stage.wake();
}
