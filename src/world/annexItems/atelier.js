// Les annexes de l'Atelier : charbonnière, hangar, fourneau (annexSprites.js les réunit).
import { boulder } from '../iso';
import { WOOD, WOOD_DARK, STONE, BRICK, GLASS, SLATE_ROOF, planksLeft } from '../palette';
import { tools, ln, poly, ell, dot, IRON, DARK_IRON, OUT, f2 } from '../spriteKit';
import { TAU, COAL, post, puff } from './kit';

// Monticule de charbon en morceaux : dôme sombre, puis des gaillettes à facettes, des plus hautes aux plus basses
function coalPile(x, y) {
  let lumps = '';
  for (let k = 0; k < 26; k++) {
    const a = ((k * 137.5) % 360) * (Math.PI / 180);
    const r = Math.sqrt((k + 0.5) / 26);
    const lx = x + Math.cos(a) * r * 15;
    const ly = y - 3 + Math.sin(a) * r * 6 - (1 - r) * 9;
    const s = 2.2 + ((k * 7) % 5) * 0.35;
    lumps += poly([[lx - s, ly], [lx - s * 0.3, ly - s * 0.8], [lx + s, ly - s * 0.3], [lx + s * 0.4, ly + s * 0.6]], k % 3 ? COAL.left : COAL.right, ` stroke="${OUT}" stroke-width="0.3"`)
      + poly([[lx - s * 0.6, ly - s * 0.2], [lx - s * 0.2, ly - s * 0.75], [lx + s * 0.6, ly - s * 0.35]], COAL.top);
  }
  return `<path d="M${f2(x - 18)},${f2(y)} C${f2(x - 16)},${f2(y - 14)} ${f2(x + 16)},${f2(y - 14)} ${f2(x + 18)},${f2(y)} A18,7 0 0 1 ${f2(x - 18)},${f2(y)} Z" fill="${COAL.right}"/>` + lumps;
}

// Tas de charbon : monticule noir aux éclats bleutés, pelle plantée, sac de jute ; des braises rougeoient à sa base
const charbon = {
  light: () => [0, 0.1, 3, 12, '255,110,50'],
  layers: [{
    frame: [-32, -42, 64, 58],
    n: 6,
    fps: 4,
    draw: (T, f) => {
      const [x, y] = T.p(0, 0, 0);
      const glints = [[-6, -8], [3, -12], [8, -5], [-10, -3], [1, -6]].map(([a, b], k) => dot(x + a, y + b, 0.6, k % 2 ? '#C6D4EA' : '#FFFFFF')).join('');
      const embers = [[-12, 2], [6, 4], [12, 0], [-4, 5]].map(([a, b], k) => ((f + k) % 3 === 0 ? dot(x + a, y + b, 1, '#FF8A3A') : '')).join('');
      return T.shadow(0, 0, 0.38, 0.22)
        + coalPile(x, y)
        + glints + embers
        + ln(T.p(-0.2, 0.06, 0), T.p(-0.14, 0.02, 20), WOOD.right, 1.6)
        + poly([T.p(-0.23, 0.08, 1), T.p(-0.17, 0.08, 1), T.p(-0.19, 0.06, 7), T.p(-0.25, 0.06, 7)], IRON.left, ` stroke="${OUT}" stroke-width="0.5"`)
        + (() => {
          const [sx, sy] = T.p(0.32, 0.12, 0);
          return ell(sx + 1, sy + 0.4, 6, 1.8, 'rgba(40,55,20,.22)')
            + `<path d="M${f2(sx - 5.4)},${f2(sy)} C${f2(sx - 6.6)},${f2(sy - 6)} ${f2(sx - 4.4)},${f2(sy - 10)} ${f2(sx - 2.2)},${f2(sy - 11.4)} L${f2(sx + 2.4)},${f2(sy - 11.4)} C${f2(sx + 4.6)},${f2(sy - 10)} ${f2(sx + 6.6)},${f2(sy - 6)} ${f2(sx + 5.4)},${f2(sy)} Z" fill="#C9A46A" stroke="#8A6A3A" stroke-width="0.5"/>`
            + `<path d="M${f2(sx - 2.4)},${f2(sy - 11.4)} q2.4,-2.6 4.8,0" fill="${COAL.top}" stroke="#8A6A3A" stroke-width="0.4"/>`
            + ln([sx - 2.6, sy - 10.6], [sx + 2.6, sy - 10.6], '#7A5A2A', 1)
            + ln([sx - 3, sy - 6], [sx - 1.6, sy - 2], 'rgba(138,106,58,.6)', 0.5) + ln([sx + 2.4, sy - 7], [sx + 3, sy - 3], 'rgba(138,106,58,.6)', 0.5);
        })();
    }
  }]
};

// Hangar : abri ouvert sous un toit d'ardoise, outils pendus au mur, établi, caisses et roue de charrette
const hangar = {
  light: () => [0.02, 0.18, 21, 15],
  layers: [{
    frame: [-38, -66, 76, 84],
    draw: T => {
      const crate = (du, dv, z, s) => T.box(du - s, dv - s, du + s, dv + s, z, z + s * 64, WOOD)
        + ln(T.p(du - s, dv + s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7) + ln(T.p(du + s, dv - s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7);
      const [wx, wy] = T.p(-0.2, -0.24, 16);
      return T.shadow(0, 0, 0.42, 0.2)
        + T.box(-0.34, -0.28, 0.34, -0.23, 0, 26, WOOD) + planksLeft(T.u - 0.34, T.u + 0.34, T.v - 0.23, 0, 26, 4.6)
        // Outils au mur : scie, marteau, corde
        + poly([[wx - 6, wy], [wx + 4, wy - 2], [wx + 4, wy + 2]], '#C9D0D8', ` stroke="${IRON.right}" stroke-width="0.5"`)
        + ln([wx + 9, wy - 3], [wx + 9, wy + 5], WOOD.right, 1.2) + poly([[wx + 7, wy - 4], [wx + 11, wy - 4], [wx + 11, wy - 2], [wx + 7, wy - 2]], IRON.right)
        + `<circle cx="${f2(wx + 18)}" cy="${f2(wy + 1)}" r="3.2" fill="none" stroke="#B08850" stroke-width="1.4"/>`
        + T.box(-0.3, -0.22, 0.3, -0.08, 9, 11, WOOD) + post(T, -0.28, -0.1, 0, 9, WOOD_DARK, 0.015) + post(T, 0.28, -0.1, 0, 9, WOOD_DARK, 0.015)
        + [[-0.32, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.32, 0.26]].map(([a, b]) => post(T, a, b, 0, 26, WOOD_DARK, 0.025)).join('')
        + T.gable(-0.34, -0.28, 0.34, 0.28, 26, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD.right }, 0.06)
        + ln(T.p(0.02, 0.18, 26), T.p(0.02, 0.18, 23), '#3D3A36', 0.5) + T.box(0, 0.16, 0.04, 0.2, 19, 23, { top: '#5A606A', left: GLASS, right: '#E9C878' })
        + crate(0.28, 0.36, 0, 0.07) + crate(0.16, 0.38, 0, 0.06) + crate(0.26, 0.34, 9, 0.055)
        + (() => { const T2 = tools(T.u - 0.38, T.v + 0.24, 'roue'); return wheelOf(T2); })();
    }
  }]
};

// Roue de charrette appuyée contre un poteau (vue dans le plan (v, z))
function wheelOf(T) {
  const [cx, cy] = T.p(0, 0, 8);
  let out = `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="5.6" ry="8.4" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.8" transform="rotate(-18 ${f2(cx)} ${f2(cy)})"/>`;
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU;
    out += ln([cx, cy], [cx + Math.cos(a) * 5, cy + Math.sin(a) * 7.6], WOOD.right, 0.8);
  }
  return out + dot(cx, cy, 1.4, DARK_IRON.right);
}

// Haut fourneau : tour de briques qui s'affine, gueule où rougeoie la fonte, soufflet de cuir ; fumée et étincelles
// montent du gueulard, la lueur orange éclaire la nuit
const fourneau = {
  light: () => [-0.02, 0.3, 12, 24, '255,130,50', true],
  layers: [{
    frame: [-36, -122, 72, 140],
    n: 8,
    fps: 5,
    draw: (T, f, n) => {
      const tiers = [[0.27, 10, 24], [0.23, 24, 38], [0.2, 38, 52], [0.17, 52, 64]];
      let tower = '';
      for (const [r, z0, z1] of tiers) {
        tower += T.box(-r, -r, r, r, z0, z1, BRICK);
        for (let z = z0 + 3.5; z < z1; z += 3.5) tower += ln(T.p(-r, r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5) + ln(T.p(r, -r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5);
      }
      const [mx, my] = T.p(-0.02, 0.27, 10);
      const pulse = [0.85, 1, 0.92, 1.08, 0.9, 1, 0.95, 1.05][f];
      const [gx, gy] = T.p(0, 0, 66);
      const smoke = [0, 1, 2].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(gx - 3 + p * 8, gy - 4 - p * 30, 3 + p * 5, 0.65 * (1 - p));
      }).join('');
      const sparks = [0, 1, 2, 3].map(k => {
        const p = ((f * 1.3 + k * 2) % n) / n;
        return dot(gx + Math.sin(k * 2.3 + p * 3) * 6, gy - 2 - p * 22, 0.9, p < 0.7 ? '#FFC24A' : '#FF7A3A');
      }).join('');
      return T.shadow(0, 0, 0.42, 0.22)
        + T.box(-0.32, -0.32, 0.32, 0.32, 0, 10, STONE)
        + tower
        + T.box(-0.19, -0.19, 0.19, 0.19, 64, 67, STONE)
        + `<path d="M${f2(mx - 6.4)},${f2(my)} L${f2(mx - 6.4)},${f2(my - 8)} A6.4,6 0 0 1 ${f2(mx + 6.4)},${f2(my - 8)} L${f2(mx + 6.4)},${f2(my)} Z" fill="#2A140C"/>`
        + ell(mx, my - 4, 5 * pulse, 3.6 * pulse, '#F2862A') + ell(mx, my - 3.4, 3.2 * pulse, 2 * pulse, '#FFD24E')
        // Soufflet de cuir et sa tuyère
        + T.box(0.3, -0.06, 0.42, 0.1, 3, 5, WOOD)
        + poly([T.p(0.3, -0.04, 6), T.p(0.42, -0.04, 9 + (f % 2) * 2), T.p(0.42, 0.08, 9 + (f % 2) * 2), T.p(0.3, 0.08, 6)], '#7A4A2A', ` stroke="${OUT}" stroke-width="0.5"`)
        + ln(T.p(0.3, 0.02, 7), T.p(0.27, 0.02, 14), IRON.right, 1.6)
        // Tas de minerai devant
        + boulder(T.u + 0.2, T.v + 0.36, 0.1, 0.08, 5, { top: '#B07A62', left: '#8A5A46', right: '#643E30' }, 5, 0.4, 0.5)
        + smoke + sparks;
    }
  }]
};

export { charbon, hangar, fourneau };
