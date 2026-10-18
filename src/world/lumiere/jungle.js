// L'air de la jungle du départ (choix de l'auteur, 18 oct. : « une ambiance de ouf tant de jour que de nuit ») : des
// insectes de décor, propres à la jungle, distincts des bêtes du Bestiaire (qui ne viennent qu'écrites dans le
// Grimoire) ; on ne les touche pas. Le jour, des papillons morpho bleus, des libellules et du pollen doré dans les
// rais de soleil ; la nuit, des lucioles néon (vert acide, cyan, magenta), des spores qui montent, et la mousse du sol
// qui luit par taches. Comme la petite vie de l'air (petiteVie.js) : posé dans le monde, tout se déduit du temps et de
// la case, chaque dessin est fait une fois. Seulement sur les cases de la jungle (M.jungle) qu'on voit (shown).
import { hash } from '../scene';
import { worldOf } from '../terrain';
import { entre } from '../maths';
import { rond } from '../textures';
import { herbMask, casesVues } from './vent';

// Le jour, la nuit : la part de chacun (0 à 1), la pluie éteint presque tout
const jourDe = phase => (1 - entre(0.2, 0.55, phase.night)) * (1 - 0.8 * entre(0.05, 0.4, phase.weather.rain));
const nuitDe = phase => entre(0.25, 0.7, phase.night) * (1 - 0.6 * entre(0.05, 0.4, phase.weather.rain));

// Les cases de la jungle sous la vue, avec leur centre : [{ x, y, c }]
function casesJungle(M, view, shown) {
  if (!M.jungle) return [];
  const mask = herbMask(M), n = M.n, out = [];
  const { x0, x1, y0, y1 } = casesVues(view, n);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * n + x] || !M.jungle(x, y) || shown(x, y) < 0.5) continue;
      out.push({ x, y, c: worldOf(x, y, M.surface(x, y)) });
    }
  }
  return out;
}

/* ---------- La nuit : mousse qui luit, lucioles, spores (en lumière qui s'ajoute) ---------- */

const NEON = ['212,255,122', '92,242,230', '255,106,208'];
const lueur = tone => rond(`jungle:${tone}`, 32, [[0, 'rgba(255,255,240,1)'], [0.15, `rgba(${tone},.95)`], [0.4, `rgba(${tone},.28)`], [1, `rgba(${tone},0)`]]);
const tache = tone => rond(`mousse:${tone}`, 64, [[0, `rgba(${tone},.5)`], [0.5, `rgba(${tone},.16)`], [1, `rgba(${tone},0)`]]);

// À dessiner en « lighter », dans la transformation du monde
export function drawJungleNuit(ctx, M, view, t, phase, shown, s = 1) {
  const k = nuitDe(phase);
  if (k < 0.02) return;
  const cases = casesJungle(M, view, shown);
  for (const { x, y, c } of cases) {
    // la mousse : une tache sur trois cases, qui respire lentement
    if (hash(x, y * 1.3) < 0.3) {
      const tone = NEON[Math.floor(hash(y, x * 2.1) * 2)];
      ctx.globalAlpha = k * (0.8 + 0.2 * Math.sin(t * 0.6 + hash(x, y) * 6));
      const ox = (hash(x + 3, y) - 0.5) * 20, oy = (hash(x, y + 3) - 0.5) * 8;
      ctx.drawImage(tache(tone), c.x + ox - 40, c.y + oy - 17, 80, 34);
    }
    // les lucioles : une case sur trois, qui tourne autour de son buisson et clignote
    if (hash(x * 1.7, y) < 0.34) {
      const ph = hash(x, y + 9) * 6.28, f = 0.35 + hash(x + 9, y) * 0.4;
      const fx = c.x + Math.sin(t * f + ph) * 16 + Math.sin(t * f * 2.3 + ph) * 5;
      const fy = c.y - 14 - Math.sin(t * f * 1.4 + ph * 2) * 10;
      const blink = Math.max(0, Math.sin(t * (1.2 + hash(y, x) * 1.3) + ph)) ** 2;
      if (blink > 0.03) {
        const r = (8 + 5 * blink) * Math.max(0.7, s);
        ctx.globalAlpha = k * blink;
        ctx.drawImage(lueur(NEON[Math.floor(hash(x + 5, y + 5) * 3)]), fx - r, fy - r, r * 2, r * 2);
      }
    }
    // les spores : elles montent doucement et s'éteignent
    if (hash(x, y * 2.9) < 0.12) {
      const life = 6 + hash(y, x) * 4, age = (t / life + hash(x, y + 1)) % 1;
      ctx.globalAlpha = k * 0.7 * entre(0, 0.15, age) * (1 - entre(0.6, 1, age));
      ctx.drawImage(lueur(NEON[1]), c.x + (hash(x + 1, y) - 0.5) * 24 + Math.sin(age * 9) * 3 - 3, c.y - 6 - age * 46 - 3, 6, 6);
    }
  }
  ctx.globalAlpha = 1;
}

/* ---------- Le jour : papillons morpho, libellules, pollen ---------- */

const pollen = () => rond('jungle:pollen', 16, [[0, 'rgba(255,250,200,.95)'], [0.35, 'rgba(240,255,140,.5)'], [1, 'rgba(240,255,140,0)']]);

// Un papillon morpho : deux paires d'ailes d'un bleu électrique, bordées de nuit, qui battent (ouv : 0 fermées, 1
// ouvertes), le corps sombre
function morpho(ctx, x, y, ouv, dir) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side * (0.15 + 0.85 * ouv), 1);
    ctx.fillStyle = '#0A1A3A';
    ctx.beginPath(); ctx.ellipse(3.2, -2, 3.6, 2.8, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2.6, 1.6, 2.6, 2, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E8BFF';
    ctx.beginPath(); ctx.ellipse(3, -2, 2.8, 2.1, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7FE8FF';
    ctx.beginPath(); ctx.ellipse(2.4, -2.4, 1.4, 1, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2470E0';
    ctx.beginPath(); ctx.ellipse(2.4, 1.5, 1.9, 1.4, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#10142A';
  ctx.fillRect(-0.5, -3, 1, 6);
  ctx.restore();
}
// Une libellule : un long corps sarcelle, quatre ailes de verre qui vibrent
function libellule(ctx, x, y, a, vib) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.fillStyle = `rgba(220,255,250,${0.35 + 0.25 * vib})`;
  for (const [dx, sy] of [[-1, -1], [-1, 1], [1.4, -1], [1.4, 1]]) { ctx.beginPath(); ctx.ellipse(dx, sy * 3, 1.2, 3.4, sy * 0.25, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#0F8C8A';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(5, 0); ctx.stroke();
  ctx.fillStyle = '#5CF2E6';
  ctx.beginPath(); ctx.arc(5.4, 0, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// Dans la transformation du monde
export function drawJungleJour(ctx, M, view, t, phase, shown) {
  const k = jourDe(phase);
  if (k < 0.02) return;
  const cases = casesJungle(M, view, shown);
  for (const { x, y, c } of cases) {
    // le pollen doré qui flotte dans les rais de soleil
    if (hash(x * 2.3, y) < 0.18) {
      const life = 7 + hash(x, y + 4) * 5, age = (t / life + hash(y + 4, x)) % 1;
      ctx.globalAlpha = k * 0.8 * Math.sin(age * Math.PI);
      ctx.drawImage(pollen(), c.x + (hash(x + 2, y) - 0.5) * 26 + Math.sin(t * 0.8 + x) * 6 - 4, c.y - 10 - age * 22 - 4, 8, 8);
    }
    // un papillon morpho par vingtaine de cases, qui vole en huit autour de sa case
    if (hash(x, y * 4.1) < 0.05) {
      const ph = hash(x + 7, y) * 6.28, f = 0.45 + hash(x, y + 7) * 0.25;
      const vx = Math.cos(t * f + ph), bx = c.x + Math.sin(t * f + ph) * 22, by = c.y - 22 + Math.sin(t * f * 2 + ph) * 8 + Math.sin(t * 7 + ph) * 1.5;
      ctx.globalAlpha = k;
      morpho(ctx, bx, by, Math.abs(Math.sin(t * 11 + ph)), vx >= 0 ? 1 : -1);
    }
    // une libellule par trentaine de cases : elle file, s'arrête, repart
    if (hash(x * 3.3, y + 2) < 0.035) {
      const ph = hash(y + 2, x) * 6.28, seg = Math.floor(t / 2.2 + ph), u = (t / 2.2 + ph) % 1;
      const a0 = hash(seg, x + y) * 6.28, a1 = hash(seg + 1, x + y) * 6.28;
      const p = (a, r) => [c.x + Math.cos(a) * r, c.y - 18 + Math.sin(a) * r * 0.5];
      const [x0, y0] = p(a0, 26), [x1, y1] = p(a1, 26), m = entre(0.55, 0.85, u);
      ctx.globalAlpha = k;
      libellule(ctx, x0 + (x1 - x0) * m, y0 + (y1 - y0) * m, Math.atan2(y1 - y0, x1 - x0), Math.abs(Math.sin(t * 40 + ph)));
    }
  }
  ctx.globalAlpha = 1;
}

/* ---------- L'arbre du voyageur et l'alocasia : leurs effets, de jour et de nuit ---------- */
// (choix de l'auteur, 18 oct. : deux variétés de plus, « avec leur lot d'effets jour et nuit ». Les places sont celles
// de leurs dessins (design/atelier/jungle.js : ravenala, alocasia), ramenées au cadre du jeu (× 0,8))
const K = 0.8;
// l'éventail de l'arbre du voyageur : sa base, le rayon jusqu'au bout des feuilles, ses graines
const FAN = { y: -44 * K, r: 38 * K, seeds: -42 * K };
// le bout des feuilles de l'alocasia : [x, y] de chaque attache et sa taille (alocasia, fleche)
const ALOCASIA = [[-15, -30, 1], [14, -32, 1], [0, -40, 1.05], [-21, -18, 0.9], [20, -19, 0.9], [-3, -24, 0.95]].map(([x, y, s]) => {
  const a = (Math.atan2(y - 8, x) - Math.PI / 2) * 0.55, z = s * 1.05 * 14.6;
  return [(x - Math.sin(a) * z) * K, (y + 1 + Math.cos(a) * z) * K];
});
const tailleDe = prop => (prop.key.includes('_petit') ? 0.74 : 1);
const goutte = () => rond('jungle:goutte', 24, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(232,255,250,.9)'], [0.5, 'rgba(92,242,230,.3)'], [1, 'rgba(92,242,230,0)']]);
const graine = () => rond('jungle:graine', 40, [[0, 'rgba(220,240,255,1)'], [0.2, 'rgba(92,168,255,.8)'], [0.55, 'rgba(46,107,255,.22)'], [1, 'rgba(46,107,255,0)']]);

// Le jour (transformation du monde) : le reflet qui glisse sur l'éventail ; la rosée qui scintille sur l'alocasia,
// plus vive le matin. props : les plantes vues ; alphaOf(prop) : 0 sous la brume, 1 à découvert
export function drawEffetsJour(ctx, props, t, phase, alphaOf) {
  const k = jourDe(phase);
  if (k < 0.02) return;
  const matin = entre(phase.rise - 0.6, phase.rise, phase.hour) * (1 - entre(phase.rise + 1.2, phase.rise + 2.6, phase.hour));
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineCap = 'round';
  for (const prop of props) {
    const a0 = alphaOf(prop) * k;
    if (a0 < 0.02) continue;
    const z = tailleDe(prop), ph = hash(prop.x * 3.1, prop.y * 1.7) * 6.28;
    const stars = [];
    if (prop.kind === 'ravenala') {
      // (un reflet par éventail, qui passe d'une feuille à l'autre, de gauche à droite, puis s'efface)
      const u = (t / 5 + ph) % 1, ang = Math.PI * (1.05 + 0.9 * u);
      stars.push([prop.wx + Math.cos(ang) * FAN.r * z, prop.wy + FAN.y * z + Math.sin(ang) * FAN.r * z, Math.sin(u * Math.PI)]);
    } else if (prop.kind === 'alocasia') {
      // (la rosée : chaque goutte scintille à son tour)
      ALOCASIA.forEach(([x, y], i) => {
        const f = Math.max(0, Math.sin(t * (1.3 + i * 0.17) + ph + i * 2)) ** 6;
        stars.push([prop.wx + x * z, prop.wy + y * z, f * (0.35 + 0.65 * matin)]);
      });
    }
    for (const [x, y, f] of stars) {
      if (f < 0.05) continue;
      const r = 1.5 + 2.5 * f;
      ctx.globalAlpha = a0 * f;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r * 0.7); ctx.lineTo(x, y + r * 0.7); ctx.stroke();
    }
  }
  ctx.restore();
}

// La nuit (en « lighter », transformation du monde) : les graines bleues de l'arbre du voyageur qui pulsent ; la goutte
// de lumière qui se détache du bout d'une feuille d'alocasia et tombe en s'éteignant
export function drawEffetsNuit(ctx, props, t, phase, alphaOf) {
  const k = nuitDe(phase);
  if (k < 0.02) return;
  for (const prop of props) {
    const a0 = alphaOf(prop) * k;
    if (a0 < 0.02) continue;
    const z = tailleDe(prop), ph = hash(prop.x * 1.3, prop.y * 2.9) * 6.28;
    if (prop.kind === 'ravenala') {
      const r = (6 + 2 * Math.sin(t * 1.1 + ph)) * z;
      ctx.globalAlpha = a0 * (0.32 + 0.18 * Math.sin(t * 1.1 + ph));
      ctx.drawImage(graine(), prop.wx - r, prop.wy + FAN.seeds * z - r, r * 2, r * 2);
    } else if (prop.kind === 'alocasia') {
      // (une goutte toutes les quatre secondes environ, d'une feuille tirée au sort à chaque fois)
      const life = 3.5 + hash(prop.y, prop.x) * 2, clock = t / life + ph, round = Math.floor(clock), u = clock - round;
      const [x, y] = ALOCASIA[Math.floor(hash(round, prop.x + prop.y) * ALOCASIA.length)];
      const fall = entre(0.35, 1, u) * 12, a = entre(0, 0.2, u) * (1 - entre(0.75, 1, u));
      if (a < 0.02) continue;
      ctx.globalAlpha = a0 * a;
      ctx.drawImage(goutte(), prop.wx + x * z - 5, prop.wy + y * z + fall - 5, 10, 10);
    }
  }
  ctx.globalAlpha = 1;
}
