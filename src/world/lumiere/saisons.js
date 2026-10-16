// Les saisons dans l'air (choix de l'auteur, 16 oct. : l'automne d'abord). La saison est celle du calendrier, celle des
// arbres (world/plants.js : SEASON). L'automne : un tapis de feuilles rousses au pied des feuillus ; à chaque rafale qui
// passe sur la terre, une poignée de feuilles qui tournoie et file avec le vent (world/lumiere/vent.js : gustAt) ; et
// certains matins, une brume basse qui traîne autour du lever du soleil et se lève dans la matinée (elle passe par les
// bancs de brume du temps : scene.js, drawWeatherMonde ; la météo elle-même, que le serveur refait, n'en sait rien).
// Le printemps : un tapis de pétales roses et blancs sous les arbres fleuris, les mêmes tourbillons, en pétales, et la
// rosée des matins clairs, de petits éclats bleutés dans l'herbe qui sèchent dans la matinée. L'été : aux heures chaudes
// des jours clairs, l'air tremble au ras du sable et des chemins (la chaleur des dunes : climates.js, drawChaleur) ; ses
// soirs ont plus d'éclats dorés (ambiance.js, motesOf) et ses nuits plus de pluies d'étoiles (filantes.js, pluieOf).
// L'hiver (choix de l'auteur, 16 oct.) : la pluie tombe en neige (celle des cimes : climates.js, drawFlocons) ; les nuits
// claires, l'herbe se givre, pâlit et scintille, puis le givre fond dans la matinée. Pour les essais : ?saison=hiver.
// Tout est posé dans le monde et se déduit du temps.
import { hash } from '../scene';
import { tuilesOf, TUILE } from '../tuiles';
import { drawFlocons, drawChaleur } from '../climates';
import { lisse, clamp } from '../maths';
import { texture, rond } from '../textures';
import { selonQualite, qualiteFx } from '../perf';
import { gustAt, leafTones, herbMask, casesVues } from './vent';
import { worldOf, TW, TH, pathDraws } from '../terrain';
import { snowPathSprite } from '../pathArt';
import { drawSprite } from '../spriteCache';
import { wetKinds } from './mouille';
import { solArt } from './solArt';

// Ce qui est tombé au pied des arbres, par saison : des feuilles rousses (plus sombres et plus brunes que celles qui
// volent) en automne, des pétales roses et blancs au printemps ; rien les autres saisons
const TOMBEES = {
  automne: [...leafTones('automne'), '#B4532E', '#C98A3A'],
  printemps: [...leafTones('printemps'), '#F2A9C0', '#F6B8CB']
};
// La saison a-t-elle son tapis au pied des arbres, et ses tourbillons aux rafales ?
export const aTapis = saison => Boolean(TOMBEES[saison]);
export const aTourbillons = aTapis;

/* ---------- Le tapis de feuilles (ou de pétales) ---------- */

// Le tapis d'un arbre (une de trois variantes par saison) : des feuilles éparses dans une ellipse posée au sol, plus
// denses près du tronc, dessinées une fois. 72 × 32 unités du monde, centré sur le pied de l'arbre
export const TAPIS = { w: 72, h: 32 };
export const tapisImg = (saison, v) => texture(`tapis-${saison}:${v}`, TAPIS.w * 2, TAPIS.h * 2, g => {
  const tons = TOMBEES[saison];
  g.scale(2, 2);
  for (let i = 0; i < 38; i++) {
    const a = hash(v * 31 + i, 3) * Math.PI * 2, d = Math.sqrt(hash(v * 31 + i, 4)) * 0.92;
    const x = TAPIS.w / 2 + Math.cos(a) * d * (TAPIS.w / 2 - 3), y = TAPIS.h / 2 + Math.sin(a) * d * (TAPIS.h / 2 - 2);
    g.globalAlpha = 0.55 + 0.4 * hash(v * 31 + i, 5);
    g.fillStyle = tons[Math.floor(hash(v * 31 + i, 6) * tons.length)];
    g.beginPath();
    g.ellipse(x, y, 2.6, 1.2, hash(v * 31 + i, 7) * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
});
// La variante d'un arbre (sa case)
export const tapisDe = (x, y) => Math.floor(hash(x * 3.1 + 7, y * 1.7 + 11) * 3);

// Le tapis sous un arbre (wx, wy : son pied dans le monde ; x, y : sa case), juste avant l'arbre
export function drawTapis(ctx, saison, wx, wy, x, y) {
  ctx.drawImage(tapisImg(saison, tapisDe(x, y)), wx - TAPIS.w / 2, wy - TAPIS.h / 2 + 3, TAPIS.w, TAPIS.h);
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
// Les feuilles (ou les pétales) des tourbillons, dans la transformation du monde, aux couleurs de la saison
export function drawTourbillons(ctx, feuilles, saison) {
  const tons = leafTones(saison);
  if (!feuilles.length || !tons) return;
  ctx.save();
  for (const f of feuilles) {
    ctx.globalAlpha = f.a;
    ctx.fillStyle = f.tone < 0.5 ? tons[0] : tons[1];
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

/* ---------- L'hiver ---------- */

// La neige à la place de la pluie : les flocons des cimes, partout (sur la terre et sur la mer), autant que la pluie
// ressentie (force : 0 à 1 ; loop.js, rainFelt) ; plus nombreux de près (dens : la qualité et le zoom, comme la pluie)
export function drawNeige(ctx, view, t, force, dens = 1) {
  if (force <= 0.02) return;
  for (const T of tuilesOf(view, 150)) drawFlocons(ctx, T, t, () => true, Math.min(1, 0.5 + force), 90 * force * dens);
}

// La force du givre (0 à 1) : en hiver, par ciel assez clair et sans pluie, il prend pendant la nuit, culmine à l'aube et
// fond dans la matinée (rien l'après-midi ni le soir)
export function givreOf(phase, saison) {
  if (saison !== 'hiver') return 0;
  const { hour, rise, night, weather } = phase;
  const fond = 1 - lisse((hour - (rise + 0.8)) / 1.8);
  const tot = hour < rise + 3 ? fond : 0;
  const nuit = Math.max(night, tot);
  return nuit * (1 - Math.min(1, weather.rain * 4)) * (1 - 0.7 * weather.cover);
}

// La neige au sol (0 à 1) : l'hiver, ce qu'il reste de la dernière chute (le mouillé : averse.js, wetnessAt ; elle tient
// pendant la neige et fond en une heure environ) ; rien hors de l'hiver
export const neigeAuSol = (wet, saison) => (saison === 'hiver' ? clamp(wet) : 0);

// Une case sous une couche de neige n : 2 couverte, 1 en plaques qui fondent, 0 rien. Chaque case a son seuil (la neige
// fond case après case) ; un chemin est couvert dès que ses voisines peuvent l'être (sa neige, damée, y tient jusque-là :
// une trace dans la neige, chemins.json : neige), puis garde des plaques. kind : wetKinds (0 eau, 1 herbe, 2 terre ou
// sable, 3 chemin, 4 chemin pavé, déblayé)
export function neigeDeCase(n, x, y, kind) {
  if (!kind) return 0;
  const seuil = hash(x * 1.3 + 5, y * 2.1 + 3) * 0.3;
  if (n > 0.35 + (kind >= 3 ? 0 : seuil)) return 2;
  return n > 0.08 + seuil ? 1 : 0;
}

// La neige au sol, dans le monde, sur le sol (sous ce qui s'y tient) ; n : neigeAuSol ; shown(x, y) : de 0 (sous la
// brume) à 1. pres : de près, chaque case prend son dessin de la bibliothèque (meteo/sol : neige_sol a, b, c couverte,
// neige_fondante a, b, c en plaques ; un chemin couvert, sa trace damée : pathArt.js, snowPathSprite), sous le décor,
// dessiné à part, sur un fond de neige d'un seul tenant (les cases couvertes ne laissent voir aucune couture) ; de loin,
// le décor est cuit dans le sol : un voile blanc qui le laisse voir (les arbres y paraissent enneigés)
const NEIGE = ['neige_sol_a', 'neige_sol_b', 'neige_sol_c'];
const NEIGE_FOND = '#EEF4FA';
const FONTE = ['neige_fondante_a', 'neige_fondante_b', 'neige_fondante_c'];
export function drawNeigeSol(ctx, M, view, n, shown, pres) {
  if (n < 0.08) return;
  const kinds = wetKinds(M), N = M.n;
  const { x0, x1, y0, y1 } = casesVues(view, N);
  const voiles = [new Path2D(), new Path2D()];
  const cases = [];
  ctx.save();
  const base = ctx.globalAlpha;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const kind = kinds[y * N + x];
      const etat = neigeDeCase(n, x, y, kind);
      if (!etat) continue;
      const a = shown(x, y);
      if (a < 0.05) continue;
      const c = worldOf(x, y, M.surface(x, y));
      if (pres) cases.push({ x, y, c, etat, a, chemin: kind >= 3 });
      if ((!pres || etat === 2) && a > 0.5) {
        const p = voiles[etat - 1];
        p.moveTo(c.x, c.y - TH * 0.505);
        p.lineTo(c.x + TW * 0.505, c.y);
        p.lineTo(c.x, c.y + TH * 0.505);
        p.lineTo(c.x - TW * 0.505, c.y);
        p.closePath();
      }
    }
  }
  if (pres) {
    // (le fond des cases couvertes, d'un seul tenant, du blanc des dessins : leurs bords ne se voient plus)
    ctx.fillStyle = NEIGE_FOND;
    ctx.fill(voiles[1]);
    for (const { x, y, c, etat, a, chemin } of cases) {
      ctx.globalAlpha = base * a;
      if (chemin && etat === 2) {
        const { clip, draws } = pathDraws(M, x, y);
        ctx.save();
        if (clip) {
          ctx.beginPath();
          ctx.moveTo(c.x, c.y - TH / 2); ctx.lineTo(c.x + TW / 2, c.y); ctx.lineTo(c.x, c.y + TH / 2); ctx.lineTo(c.x - TW / 2, c.y);
          ctx.closePath();
          ctx.clip();
        }
        for (const d of draws) { const sp = snowPathSprite(d.file); if (sp) drawSprite(ctx, sp.key, sp.make, c.x + d.dx, c.y + d.dy); }
        ctx.restore();
        continue;
      }
      const v = Math.floor(hash(x * 2.7 + 1, y * 1.9 + 7) * 6);
      const art = solArt(etat === 2 ? NEIGE[v % 3] : FONTE[v % 3]);
      if (art) drawSprite(ctx, art.key, art.make, c.x, c.y);
    }
  } else {
    ctx.globalAlpha = base;
    ctx.fillStyle = 'rgba(242,247,252,0.4)';
    ctx.fill(voiles[0]);
    ctx.fillStyle = 'rgba(242,247,252,0.85)';
    ctx.fill(voiles[1]);
  }
  ctx.restore();
}

// L'hiver, l'eau dormante des mares est prise en glace (meteo/sol : glace a, b, c ; glace_neige là où la neige tombée
// couvrirait la terre). cells : l'eau douce (eauDouce.js : freshOf), seules les mares gèlent ; n : neigeAuSol ;
// shown(x, y) : 0 sous la brume épaisse (l'eau y reste telle quelle)
const GLACE = ['glace_a', 'glace_b', 'glace_c'];
export function drawGlace(ctx, cells, view, n, shown) {
  for (const c of cells) {
    if (!c.mare || !shown(c.x, c.y)) continue;
    const p = worldOf(c.x, c.y, c.z);
    if (p.x < view.x - TW || p.x > view.x + view.w + TW || p.y < view.y - TW || p.y > view.y + view.h + TW) continue;
    const art = solArt(neigeDeCase(n, c.x, c.y, 1) === 2 ? 'glace_neige' : GLACE[Math.floor(hash(c.x * 3.3 + 2, c.y * 1.1 + 5) * 3) % 3]);
    if (art) drawSprite(ctx, art.key, art.make, p.x, p.y);
  }
}

// La force de la rosée (0 à 1) : au printemps, les matins sans pluie, elle perle à l'aube et sèche dans la matinée ;
// moins sous un ciel couvert
export function roseeOf(phase, saison) {
  if (saison !== 'printemps') return 0;
  const { hour, rise, weather } = phase;
  const matin = lisse((hour - (rise - 0.6)) / 0.6) * (1 - lisse((hour - (rise + 1.2)) / 1.4));
  return matin * (1 - Math.min(1, weather.rain * 4)) * (1 - 0.6 * weather.cover);
}

// Une tache de givre : pâle, bleutée, au bord fondu (les taches se chevauchent : aucun trait de case ne se voit)
const tacheGivre = () => rond('givre', 64, [[0, 'rgba(234,243,255,1)'], [0.55, 'rgba(234,243,255,0.75)'], [1, 'rgba(234,243,255,0)']]);

// Le givre sur l'herbe de la vue, au sol (avant ce qui s'y tient) : l'herbe pâlit (une tache douce sur une case sur deux,
// en quinconce, assez large pour couvrir ses voisines), et sur une case sur trois environ un éclat s'allume et s'éteint à
// son rythme. M : l'île ; shown(x, y) : 0 à 1, ce qui se voit de la case (le Voile : loop.js, lightGate) ; k : givreOf.
// opts : { voile (la force de la pâleur ; 0 : aucune), teinte (des éclats), part (des cases qui ont un éclat), scintille
// (plus petit : chaque éclat reste allumé plus longtemps) }
export function drawGivre(ctx, M, view, t, k, shown, { voile = 0.3, teinte = '255,255,255', part: partPleine = 0.35, scintille = 6 } = {}) {
  if (k <= 0.02) return;
  const mask = herbMask(M), n = M.n;
  const { x0, x1, y0, y1 } = casesVues(view, n);
  const img = tacheGivre(), eclats = new Path2D();
  const part = partPleine * qualiteFx();
  ctx.save();
  ctx.globalAlpha = voile * k;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * n + x] || shown(x, y) < 0.5) continue;
      const c = worldOf(x, y, M.surface(x, y));
      if (voile > 0 && (x + y) % 2 === 0) ctx.drawImage(img, c.x - TW * 1.05, c.y - TH * 1.05, TW * 2.1, TH * 2.1);
      if (hash(x, y * 3.7) > part) continue;
      const eclat = Math.max(0, Math.sin(t * (1.5 + hash(x, y)) + hash(y, x) * 6)) ** scintille;
      if (eclat < 0.05) continue;
      const ex = c.x + (hash(x + 1, y) - 0.5) * TW * 0.6, ey = c.y + (hash(x, y + 1) - 0.5) * TH * 0.6, r = 1.6 + 1.8 * eclat;
      eclats.moveTo(ex - r, ey); eclats.lineTo(ex + r, ey);
      eclats.moveTo(ex, ey - r * 0.6); eclats.lineTo(ex, ey + r * 0.6);
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = `rgba(${teinte},${(0.9 * k).toFixed(3)})`;
  ctx.lineWidth = 1;
  ctx.stroke(eclats);
  ctx.restore();
}
// La rosée : les éclats du givre, bleutés et plus nombreux, sans pâlir l'herbe (k : roseeOf)
export const drawRosee = (ctx, M, view, t, k, shown) => drawGivre(ctx, M, view, t, k, shown, { voile: 0, teinte: '214,236,255', part: 0.8, scintille: 3 });

/* ---------- L'été ---------- */

// La force de la chaleur (0 à 1) : en été, aux heures où le soleil est haut, par ciel clair et sans pluie
export function chaleurOf(phase, saison) {
  if (saison !== 'ete') return 0;
  const { sun, weather } = phase;
  return lisse((sun.up - 0.55) / 0.3) * (1 - weather.cover) ** 2 * (1 - Math.min(1, weather.rain * 4));
}

// L'air qui tremble sur le sable et les chemins de la vue (surSable(x, y) : ce point du monde en est), au sol
export function drawChaleurEte(ctx, view, t, k, surSable) {
  if (k <= 0.02) return;
  ctx.save();
  for (const T of tuilesOf(view, 0)) drawChaleur(ctx, T, t, surSable, 0.3 * k, selonQualite(12));
  ctx.restore();
}
