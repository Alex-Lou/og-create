// Les annexes de la Carrière : filon, dépôt, taille (annexSprites.js les réunit).
import { boulder, EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, GLASS } from '../palette';
import { ln, poly, dot, star, bird, IRON, OUT, f2 } from '../spriteKit';
import { patch, post, puff } from './kit';

// Filon : un rocher veiné de minerai (quartz, cuivre ou cristaux bleus selon l'exemplaire), une pioche, des éclats
const VEINS = [
  { rock: { top: '#DAD7CF', left: '#ADA99F', right: '#86827A' }, vein: '#FFFFFF', ore: '#F4F1E8' },
  { rock: { top: '#D9C3A8', left: '#B49678', right: '#8C6F55' }, vein: '#E8873A', ore: '#F2A35A' },
  { rock: { top: '#BAC1CD', left: '#8F98A7', right: '#6B7383' }, vein: '#7FC7F0', ore: '#B6E6FF' }
];

const filon = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 4,
    draw: (T, f, n, variant) => {
      const look = VEINS[variant % 3];
      const [x, y] = T.p(-0.04, -0.02, 0);
      // Veines et pépites sur la face avant du gros rocher (dans sa silhouette)
      const veins = [[[-12, -5], [-7, -9], [-2, -7], [2, -11]], [[-6, -2], [-1, -5], [5, -3]], [[4, -8], [9, -6]]]
        .map(pts => `<polyline points="${pts.map(([a, b]) => `${f2(x + a)},${f2(y + b)}`).join(' ')}" fill="none" stroke="${look.vein}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`).join('');
      const nuggets = [[-7, -9], [3, -4], [-11, -4], [2, -11], [8, -7]].map(([a, b], k) => poly([[x + a, y + b - 1.7], [x + a + 1.7, y + b], [x + a, y + b + 1.5], [x + a - 1.6, y + b]], k % 2 ? look.ore : look.vein, ` stroke="${OUT}" stroke-width="0.3"`)).join('');
      const glints = [[-7, -9], [3, -4], [2, -11], [-11, -4], [8, -7], [-2, -7]];
      const [gx, gy] = glints[f % glints.length];
      return T.shadow(0.02, 0, 0.4, 0.22)
        + boulder(T.u - 0.04, T.v - 0.02, 0.32, 0.28, 17, look.rock, 3 + variant, 0.22, 0.78)
        + veins + nuggets
        + boulder(T.u - 0.06, T.v + 0.32, 0.1, 0.09, 5, look.rock, 7 + variant, 0.25, 0.85)
        // Pioche appuyée sur le flanc droit, éclats au sol
        + ln(T.p(0.4, 0.04, 0), T.p(0.3, -0.06, 15), WOOD.right, 1.8) + ln(T.p(0.4, 0.04, 0.6), T.p(0.3, -0.06, 15.6), WOOD.top, 0.6)
        + `<path d="M${f2(T.p(0.24, -0.04, 13)[0])},${f2(T.p(0.24, -0.04, 13)[1])} Q${f2(T.p(0.3, -0.06, 18)[0])},${f2(T.p(0.3, -0.06, 18)[1] - 2)} ${f2(T.p(0.38, -0.1, 13)[0])},${f2(T.p(0.38, -0.1, 13)[1])}" stroke="${IRON.right}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + T.pebble(-0.36, 0.26, 0.55, look.rock) + T.pebble(-0.18, 0.38, 0.42, look.rock) + T.pebble(0.06, 0.4, 0.35, look.rock)
        + star(x + gx, y + gy, 2.6 + (f % 2), '#FFFFFF', 0.95);
    }
  }]
};

// Dépôt de pierres : blocs taillés rangés en pyramide sur leur palette, traîneau chargé à côté, ardoise des comptes ;
// un moineau sautille sur le bloc du haut
const depot = {
  layers: [{
    frame: [-34, -50, 68, 68],
    n: 6,
    fps: 2,
    draw: (T, f) => {
      const block = (du, dv, z) => ({ d: du + dv + z * 0.001, svg: T.box(du - 0.1, dv - 0.09, du + 0.1, dv + 0.09, z, z + 6.5, STONE) + ln(T.p(du - 0.1, dv + 0.09, z + 3.2), T.p(du + 0.1, dv + 0.09, z + 3.2), 'rgba(120,110,95,.35)', 0.5) });
      const stack = [
        block(-0.11, -0.1, 3), block(0.11, -0.1, 3), block(-0.11, 0.1, 3), block(0.11, 0.1, 3),
        block(0, -0.1, 9.5), block(0, 0.1, 9.5), block(0, 0, 16)
      ].sort((a, b) => a.d - b.d || 0).map(b => b.svg).join('');
      const [bx, by] = T.p(0, 0, 22.5);
      const hop = f === 2 ? 1.6 : 0;
      return T.shadow(0, 0, 0.4, 0.2)
        // Ardoise des comptes, derrière
        + post(T, -0.32, -0.3, 0, 14, WOOD, 0.016) + post(T, -0.18, -0.36, 0, 14, WOOD, 0.016)
        + T.face([[-0.33, -0.31, 8], [-0.17, -0.37, 8], [-0.17, -0.37, 15], [-0.33, -0.31, 15]], '#3D4148', EDGE)
        + [9.6, 11.2, 12.8].map(z => ln(T.p(-0.31, -0.32, z), T.p(-0.22, -0.355, z), 'rgba(255,255,255,.7)', 0.4)).join('')
        + T.box(-0.3, -0.26, 0.3, 0.26, 0, 3, WOOD_DARK)
        + [-0.18, 0, 0.18].map(du => ln(T.p(du, 0.26, 3), T.p(du, -0.26, 3), WOOD.top, 0.8)).join('')
        + stack
        + bird(bx + 1, by - hop, { body: '#8B6A4A', breast: '#D8C2A0', wing: '#6E5236', peck: f === 4 ? 1 : 0 })
        // Traîneau chargé de deux blocs, devant à droite
        + T.box(0.26, 0.2, 0.44, 0.4, 0, 2, WOOD)
        + ln(T.p(0.44, 0.2, 1), T.p(0.48, 0.22, 3), WOOD.right, 1.2) + ln(T.p(0.44, 0.4, 1), T.p(0.48, 0.42, 3), WOOD.right, 1.2)
        + T.box(0.28, 0.22, 0.36, 0.3, 2, 7, STONE) + T.box(0.33, 0.3, 0.42, 0.38, 2, 6, STONE);
    }
  }]
};

// Taille de pierre : établi et maillet, un buste à moitié sorti de son bloc, poussière de taille ; lanterne la nuit
const taille = {
  light: () => [-0.33, -0.3, 25, 14],
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const [bx, by] = T.p(0.18, -0.1, 9);
      const dust = [0, 1, 2].map(k => {
        const p = ((f + k * 2) % n) / n;
        return puff(bx + 6 + k * 2 + p * 4, by - 10 - p * 8, 1.4 + p * 2.4, 0.55 * (1 - p));
      }).join('');
      return patch(T, 0.44, '#E6D8BC', '')
        + T.shadow(0, 0, 0.34, 0.18)
        + post(T, -0.33, -0.3, 0, 24) + ln(T.p(-0.33, -0.3, 24), T.p(-0.33, -0.22, 24), WOOD_DARK.right, 1.2)
        + T.box(-0.37, -0.25, -0.29, -0.19, 17, 23, { top: '#5A606A', left: GLASS, right: '#E9C878' })
        + T.box(-0.34, -0.36, -0.12, -0.18, 0, 7, STONE) + T.box(-0.3, -0.33, -0.18, -0.21, 7, 12, STONE)
        // Établi, maillet et ciseau
        + [[-0.3, 0.04], [0, 0.04], [-0.3, 0.22], [0, 0.22]].map(([a, b]) => post(T, a, b, 0, 10, WOOD_DARK, 0.018)).join('')
        + T.box(-0.32, 0.02, 0.02, 0.24, 10, 12.5, WOOD)
        + ln(T.p(-0.2, 0.12, 13), T.p(-0.08, 0.16, 13), WOOD.right, 1.6) + T.box(-0.24, 0.09, -0.18, 0.15, 12.5, 16, WOOD_DARK)
        + ln(T.p(-0.1, 0.06, 13), T.p(-0.02, 0.1, 13), IRON.right, 1)
        // Buste sur son socle : encore pris dans le bloc en bas, épaules et tête déjà taillées
        + T.box(0.08, -0.2, 0.28, 0, 0, 9, STONE)
        + T.box(0.11, -0.17, 0.25, -0.03, 9, 15, { top: '#EDE7DB', left: '#D6CEBF', right: '#B7AE9D' })
        + `<path d="M${f2(bx - 7)},${f2(by - 6)} C${f2(bx - 7)},${f2(by - 12)} ${f2(bx - 3)},${f2(by - 13)} ${f2(bx)},${f2(by - 13)} C${f2(bx + 3)},${f2(by - 13)} ${f2(bx + 7)},${f2(by - 12)} ${f2(bx + 7)},${f2(by - 6)} Z" fill="#F2EEE6" stroke="${OUT}" stroke-width="0.5"/>`
        + `<rect x="${f2(bx - 1.6)}" y="${f2(by - 16)}" width="3.2" height="4" fill="#E9E3D8"/>`
        + `<ellipse cx="${f2(bx)}" cy="${f2(by - 19.4)}" rx="3.4" ry="4.4" fill="#F7F4EE" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(bx - 3.4)},${f2(by - 20.4)} q3.4,-5.6 6.8,0 q-1.2,-2 -3.4,-2.2 q-2.2,0.2 -3.4,2.2 Z" fill="#DCD5C8"/>`
        + `<path d="M${f2(bx + 0.6)},${f2(by - 19.6)} l1.2,2 l-1.2,0.3" stroke="#B9B0A0" stroke-width="0.5" fill="none"/>`
        + dot(bx - 1.2, by - 19.8, 0.35, '#9B927F') + dot(bx + 1.6, by - 19.8, 0.35, '#9B927F')
        + ln([bx - 6, by - 7.4], [bx - 4, by - 9.6], 'rgba(155,146,127,.5)', 0.5) + ln([bx + 4.4, by - 9.6], [bx + 6, by - 7.6], 'rgba(155,146,127,.5)', 0.5)
        + dust
        + T.pebble(0.32, 0.18, 0.35, STONE) + T.pebble(0.2, 0.3, 0.3, STONE);
    }
  }]
};

export { filon, depot, taille };
