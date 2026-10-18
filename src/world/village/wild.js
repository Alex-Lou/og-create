// Le village (world/village.js) : les bêtes sauvages. Celles qui vivent de leur coin et de leurs conditions (bois, eau,
// climats, Bestiaire : wildLife.js), les abeilles du Potager, le chat et le chien du Foyer, les carpes koï ; où vivent
// celles d'ici, et comment toutes sursautent quand on les touche.
import { hash, smooth, beast } from './beast';
import { WILD_LIFE_SPECIES } from './wildLife';

// Une bête sauvage touchée : son sursaut dure 2,4 s ; elle trottine de 0,35 case (sur chaque axe) et revient
const STARTLE = 2.4;
const STARTLE_TROT = 0.35;
// Celles qui se tiennent en l'air (branche, vol) : touchées, elles ne trottinent pas
const ALOFT = new Set(['squirrel', 'bird', 'owl', 'butterfly', 'bee', 'firefly']);
const WILD = new Set([...WILD_LIFE_SPECIES, 'bee', 'otter']);
export const isWild = species => WILD.has(species);

// Où vivent les bêtes d'ici, tirées des coins des zones à soi (wildLife.js : homesOf) : lisières, eau douce et ses
// berges (les loutres d'Anya, les koï, les abeilles sans Potager)
export function habitatsOf(homes) {
  const all = kind => [...homes.values()].flatMap(home => home[kind]);
  return { edge: all('lisiere'), water: all('eau'), banks: all('berges') };
}

// Ce qui pose une bête sauvage à l'instant du dessin (f : t, h, day, islandDay, tapped, out) : { wild, along, put }
export function wildPainter(f) {
  const { t, h, day, islandDay, tapped, out } = f;
  // Sa case, tirée pour toute sa sortie : elle n'en change que hors de la vue (tirée à chaque heure de l'île, elle
  // disparaissait d'un coup pour reparaître ailleurs). turn : bête du jour, à minuit de l'île, quand elle dort ; de la
  // nuit, à midi ; toujours là, chaque jour (réel)
  const outing = { jour: islandDay, nuit: islandDay + (h >= 12 ? 1 : 0), toujours: day };
  const spot = (list, salt, turn) => list[Math.floor(hash(outing[turn] * 31, salt) * list.length)];
  // Touchée, elle sursaute (un bond sur place), trottine un peu du côté où elle regarde, se retourne et revient à sa
  // place ; perchée ou en vol (ALOFT), elle sursaute et se retourne sans quitter sa branche. Elle ne disparaît jamais
  // et reste dans sa case (moins d'une demi-case de chaque côté)
  const startled = (base, s, aloft) => {
    const jump = s < 0.15 ? Math.sin((s / 0.15) * Math.PI) * 5 : 0;
    const turned = s >= 0.6 || (aloft && s >= 0.15);
    const flip = turned ? !base.flip : base.flip;
    if (aloft) return { ...base, z: (base.z || 0) + jump, flip, frame: jump ? 1 : base.frame === 'rest' ? 0 : base.frame, look: null };
    const away = s < 0.15 ? 0 : s < 0.5 ? smooth((s - 0.15) / 0.35) : s < 0.6 ? 1 : 1 - smooth((s - 0.6) / 0.4);
    const d = away * STARTLE_TROT * (base.flip ? -1 : 1);
    const trotting = (s > 0.15 && s < 0.5) || s > 0.6;
    return { ...base, x: base.x + d, y: base.y - d, z: jump, flip, frame: trotting ? Math.floor(t * 8) % 2 : jump ? 1 : 0, look: null };
  };
  // Une bête qui va et vient le long d'une rangée de cases (x) : de trois quarts avant à l'aller (x croissant, vers le
  // bas de l'écran), de dos au retour (flip) ; ses images 0 et 1, ses pas
  const along = (flip, frame) => ({ view: flip ? 'dos' : 'avant', pose: 'marche', n: frame + 1 });
  // Une bête à sa place de cette image (base : { x, y, z, flip, frame, look, variant }), son sursaut compris
  const put = (id, species, base) => {
    const s = tapped(id, STARTLE);
    const b = s === null ? base : startled(base, s, ALOFT.has(species));
    out.push(beast(id, species, b.variant || '', b.x, b.y, b.z || 0, b.flip, b.frame, b.look));
  };
  const wild = (id, species, cells, when, turn, place) => {
    if (!cells.length || !when) return;
    put(id, species, place(spot(cells, species.length * 7, turn)));
  };
  return { wild, along, put };
}

// Les abeilles du Potager, le chat et le chien du Foyer
export function drawWild(f, { wild, along }, { habitats, bestiary, doors, home }) {
  const { t, rain, dayTime, night } = f;
  const { edge } = habitats;
  if (bestiary.has('Abeille')) {
    const hive = doors.potager ? [doors.potager] : edge;
    [0, 1].forEach(k => wild(`best:bee:${k}`, 'bee', hive, dayTime && rain < 0.4, 'jour', c => {
      const a = t * 1.8 + k * 3;
      return { x: c.x + Math.cos(a) * 0.5, y: c.y + Math.sin(a * 1.2) * 0.4, z: 7 + Math.sin(t * 4 + k) * 1.5, frame: Math.floor(t * 14 + k) % 2, flip: Math.sin(a) > 0 };
    }));
  }
  // Le Chat et le Chien écrits : ils vivent autour de la porte du Foyer (leur pelage tiré pour l'île) ; le jour, ils
  // vont et viennent et s'assoient un moment ; la nuit, ils dorment roulés en boule
  if (home) {
    [['Chat', 'cat', ['', 'noir', 'gris', 'blanc'], 0.6], ['Chien', 'dog', ['', 'brun', 'noir', 'roux'], 0.9]].forEach(([name, species, coats, reach], k) => {
      if (!bestiary.has(name)) return;
      const variant = coats[Math.floor(hash(k + 3, 71) * coats.length)];
      wild(`best:${species}`, species, [home], true, 'toujours', c => {
        const at = { x: c.x + 0.4 + k * 1.1, y: c.y + 0.5 + k * 0.55, variant };
        const breath = Math.floor(t * 0.8 + k) % 2 + 1;
        if (night) return { ...at, frame: 'rest', flip: false, look: { view: 'avant', pose: 'dodo', n: breath } };
        if ((t + k * 7) % 20 < 8) return { ...at, frame: 0, flip: k === 1, look: { view: 'avant', pose: 'assis', n: breath } };
        const a = (t + k * 7) * 0.3;
        const flip = Math.cos(a) < 0;
        const frame = Math.floor(t * 4) % 2;
        return { ...at, x: at.x + Math.sin(a) * reach, frame, flip, look: along(flip, frame) };
      });
    });
  }
}

// Carpes koï : trois qui tournent dans l'eau douce des quartiers à soi (après le tutoriel), toujours dans le même étang
// (tiré chaque jour, il changeait sous les yeux du joueur)
export function drawKoi(f, water, calm) {
  const { t, out } = f;
  if (water.length >= 3 && !calm) {
    const pond = water[Math.floor(hash(41, 41) * water.length)];
    ['#F08A3A', '#FFFFFF', '#F2C04B'].forEach((color, k) => {
      const a = t * (0.35 + k * 0.08) + k * 2.1;
      out.push(beast(`koi:${k}`, 'koi', color, pond.x + Math.cos(a) * 0.32, pond.y + Math.sin(a) * 0.26, -6, Math.sin(a) > 0, Math.floor(t * 3 + k) % 2));
    });
  }
}
