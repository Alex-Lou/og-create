// Les premières créations de l'établi : clôture, portes, massif (craftSprites.js les réunit ; repère et calques : voir
// son en-tête).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, SOIL } from '../palette';
import { ln, poly, ell, dot, wave, IRON, DARK_IRON, OUT, f2 } from '../spriteKit';
import { LEAF, FLOWERS, post, rail, flower, leaves } from './kit';

// Clôture : quatre piquets pointus et deux lisses en travers de la case, une touffe d'herbe au pied
const cloture = {
  layers: [{
    frame: [-34, -36, 68, 52],
    draw: T => {
      const us = [-0.4, -0.14, 0.12, 0.38];
      const v = 0.04;
      let out = T.shadow(0, 0.04, 0.36, 0.14);
      out += rail(T, [-0.42, v], [0.4, v], 6) + rail(T, [-0.42, v], [0.4, v], 12);
      for (const u of us) {
        out += post(T, u, v, 0, 16, WOOD);
        const [x, y] = T.p(u, v, 16);
        out += poly([[x - 2.2, y + 1.2], [x + 2.2, y + 1.2], [x, y - 3.4]], WOOD.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      const [gx, gy] = T.p(0.2, 0.3, 0);
      return out + [-2, 0, 2].map(dx => ln([gx + dx, gy], [gx + dx * 1.6, gy - 5], LEAF, 1)).join('');
    }
  }]
};

// Porte d'enclos (choix de l'auteur, 15 oct. ; en attendant le dessin de la bibliothèque) : deux poteaux coiffés, un
// battant de planches tenu par deux lisses et une écharpe en biais ; verrouillée, un cadenas de fer sur le battant
function gate(T, locked) {
  const v = 0.04;
  let out = T.shadow(0, 0.04, 0.4, 0.14);
  for (const u of [-0.42, 0.4]) {
    out += post(T, u, v, 0, 21, WOOD_DARK, 0.034);
    const [x, y] = T.p(u, v, 21);
    out += ell(x, y, 2.6, 1.3, WOOD.top, ` stroke="${OUT}" stroke-width="0.4"`);
  }
  for (const u of [-0.3, -0.16, -0.02, 0.12, 0.26]) out += post(T, u, v, 1.5, 15, WOOD, 0.018);
  out += rail(T, [-0.38, v], [0.36, v], 4, 2.6) + rail(T, [-0.38, v], [0.36, v], 13, 2.6);
  out += ln(T.p(-0.34, v, 4.6), T.p(0.32, v, 12.4), WOOD_DARK.right, 2.2);
  if (locked) {
    const [x, y] = T.p(0.2, v + 0.02, 8.5);
    out += `<path d="M${f2(x - 1.6)},${f2(y - 1.4)} q0,-3.2 1.6,-3.2 q1.6,0 1.6,3.2" fill="none" stroke="${DARK_IRON.right}" stroke-width="1"/>`;
    out += poly([[x - 2.4, y - 1.4], [x + 2.4, y - 1.4], [x + 2.4, y + 2.4], [x - 2.4, y + 2.4]], IRON.left, ` stroke="${OUT}" stroke-width="0.5"`);
    out += dot(x, y + 0.5, 0.6, DARK_IRON.right);
  }
  return out;
}

const porte = { layers: [{ frame: [-36, -40, 72, 56], draw: T => gate(T, false) }] };

const porteVerrou = { layers: [{ frame: [-36, -40, 72, 56], draw: T => gate(T, true) }] };

// Massif de fleurs : bordure de pierres, terre sombre, fleurs de toutes couleurs qui ondulent
const massif = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.4, 0.12) + T.box(-0.38, -0.34, 0.38, 0.34, 0, 4, STONE) + T.face([[-0.34, -0.3, 4.2], [0.34, -0.3, 4.2], [0.34, 0.3, 4.2], [-0.34, 0.3, 4.2]], SOIL.top, EDGE);
      let k = 0;
      for (const dv of [-0.2, 0, 0.2]) {
        for (const du of [-0.22, -0.07, 0.08, 0.23]) {
          const [x, y] = T.p(du + (k % 2) * 0.03, dv, 4.4);
          out += leaves(x, y - 1.5, 2.4) + flower(x, y - 2, 6 + (k % 3), FLOWERS[k % FLOWERS.length], wave(f, n, 1.2, k * 1.3));
          k++;
        }
      }
      return out;
    }
  }]
};

export { cloture, porte, porteVerrou, massif };
