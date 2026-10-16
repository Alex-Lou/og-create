// Les saisons dans l'air (choix de l'auteur, 16 oct. : l'automne d'abord). La saison est celle du calendrier, celle des
// arbres (world/plants.js : SEASON). L'automne : un tapis de feuilles rousses au pied des feuillus ; à chaque rafale qui
// passe sur la terre, une poignée de feuilles qui tournoie et file avec le vent (world/lumiere/vent.js : gustAt) ; et
// certains matins, une brume basse qui traîne autour du lever du soleil et se lève dans la matinée (elle passe par les
// bancs de brume du temps : scene.js, drawWeatherMonde ; la météo elle-même, que le serveur refait, n'en sait rien).
// Tout est posé dans le monde et se déduit du temps.
import { hash } from '../scene';
import { tuilesOf, TUILE } from '../tuiles';
import { lisse } from '../maths';
import { texture } from '../textures';
import { selonQualite } from '../perf';
import { gustAt, leafTones } from './vent';

const AUTOMNE = leafTones('automne');
// Des feuilles déjà tombées : plus sombres et plus brunes que celles qui volent
const TOMBEES = [...AUTOMNE, '#B4532E', '#C98A3A'];

/* ---------- Le tapis de feuilles ---------- */

// Le tapis d'un arbre (une de trois variantes) : des feuilles éparses dans une ellipse posée au sol, plus denses près du
// tronc, dessinées une fois. 72 × 32 unités du monde, centré sur le pied de l'arbre
export const TAPIS = { w: 72, h: 32 };
export const tapisImg = v => texture(`tapis-automne:${v}`, TAPIS.w * 2, TAPIS.h * 2, g => {
  g.scale(2, 2);
  for (let i = 0; i < 38; i++) {
    const a = hash(v * 31 + i, 3) * Math.PI * 2, d = Math.sqrt(hash(v * 31 + i, 4)) * 0.92;
    const x = TAPIS.w / 2 + Math.cos(a) * d * (TAPIS.w / 2 - 3), y = TAPIS.h / 2 + Math.sin(a) * d * (TAPIS.h / 2 - 2);
    g.globalAlpha = 0.55 + 0.4 * hash(v * 31 + i, 5);
    g.fillStyle = TOMBEES[Math.floor(hash(v * 31 + i, 6) * TOMBEES.length)];
    g.beginPath();
    g.ellipse(x, y, 2.6, 1.2, hash(v * 31 + i, 7) * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
});
// La variante d'un arbre (sa case)
export const tapisDe = (x, y) => Math.floor(hash(x * 3.1 + 7, y * 1.7 + 11) * 3);

// Le tapis sous un arbre (wx, wy : son pied dans le monde), juste avant l'arbre
export function drawTapis(ctx, wx, wy, x, y) {
  ctx.drawImage(tapisImg(tapisDe(x, y)), wx - TAPIS.w / 2, wy - TAPIS.h / 2 + 3, TAPIS.w, TAPIS.h);
}

/* ---------- Les tourbillons de feuilles ---------- */

// Un tourbillon par carreau du monde au plus, qui naît au passage d'une rafale assez forte et vit ce temps (s)
const CYCLE = 9;
const VIE = 3.2;
const FEUILLES = 7;

// Les feuilles des tourbillons de la vue à l'instant t : [{ x, y, a, rot, tone }] en unités du monde. Chaque carreau a
// son tourbillon, qui part d'un point de la terre (surTerre(x, y)) quand la rafale qui y passe est forte, tourne en
// montant un peu et file vers la droite avec le vent, puis retombe et s'efface. force : 0 à 1 (la pluie, la nuit, le
// zoom l'atténuent : loop.js)
export function tourbillonsOf(view, t, force, surTerre) {
  const out = [];
  if (force <= 0.02) return out;
  const n = selonQualite(FEUILLES);
  for (const T of tuilesOf(view, 60)) {
    const cycle = Math.floor(t / CYCLE + hash(T.n, 91));
    const debut = (cycle - hash(T.n, 91)) * CYCLE + hash(T.n + cycle, 92) * (CYCLE - VIE);
    const age = (t - debut) / VIE;
    if (age < 0 || age >= 1) continue;
    const x0 = T.X + hash(T.n + cycle, 93) * TUILE, y0 = T.Y + hash(T.n + cycle, 94) * TUILE;
    // (la rafale se lit en cases : la case sous ce point du monde, relief mis à part)
    const pousse = gustAt((x0 / 32 + y0 / 16) / 2, (y0 / 16 - x0 / 32) / 2, debut);
    if (pousse < 0.45 || !surTerre(x0, y0)) continue;
    const course = 70 * (0.6 + pousse) * age;
    const haut = 36 * Math.sin(age * Math.PI);
    const a = force * Math.min(1, age * 5) * (1 - lisse((age - 0.75) / 0.25));
    // (une colonne qui s'évase vers le haut : chaque feuille a sa hauteur dans la spirale, et tourne autour de l'axe ;
    // vu d'en haut, le cercle s'écrase)
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n;
      const ph = age * 10 + i * 2.4;
      const r = (5 + 13 * u) * (0.8 + 0.4 * hash(T.n + i, 95));
      const z = haut * (0.2 + 0.8 * u) + 4 * Math.sin(age * 7 + i);
      out.push({ x: x0 + course + Math.cos(ph) * r, y: y0 - z + Math.sin(ph) * r * 0.35, a, rot: ph * 1.3, tone: hash(T.n + i, 96) });
    }
  }
  return out;
}
// Les feuilles des tourbillons, dans la transformation du monde
export function drawTourbillons(ctx, feuilles) {
  if (!feuilles.length) return;
  ctx.save();
  for (const f of feuilles) {
    ctx.globalAlpha = f.a;
    ctx.fillStyle = f.tone < 0.5 ? AUTOMNE[0] : AUTOMNE[1];
    ctx.beginPath();
    ctx.ellipse(f.x, f.y, 3.2, 1.6, f.rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- La brume des matins d'automne ---------- */

// Sa force (0 à 1), qui s'ajoute à la brume du temps pour ses bancs seulement : six matins d'automne sur dix, elle
// monte avant le lever du soleil, tient l'heure qui suit et se lève dans la matinée ; ni sous la pluie, moins sous un
// ciel couvert
export function brumeAutomne(phase, date, saison) {
  if (saison !== 'automne') return 0;
  const jour = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 864e5);
  if (hash(jour, 97) > 0.6) return 0;
  const { hour, rise, weather } = phase;
  const matin = lisse((hour - (rise - 0.7)) / 0.7) * (1 - lisse((hour - (rise + 1.6)) / 1.1));
  return 0.8 * matin * (1 - Math.min(1, weather.rain * 3)) * (1 - 0.5 * weather.cover);
}

// La force des tourbillons à cette heure : pleine le jour, faible la nuit, rien sous la pluie, rien vu de loin
export function tourbillonForce(phase, s) {
  return (1 - 0.7 * phase.night) * (1 - Math.min(1, phase.weather.rain * 4)) * lisse((s - 0.5) / 0.2);
}
