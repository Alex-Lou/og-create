// Gisements des trouvailles de climat (lot 9d) : six dessins, chacun prêt (plein, animé) ou ramassé (il repousse) —
// cristaux de glace, moutons à tondre (tondus : ils broutent), roseaux, croûte de sel, arbre à fruits, éclats
// d'obsidienne. Repère et calques : ceux des créations d'île (craftSprites.js), case u, v ∈ [-0,5 ; 0,5].
import { boulder, sprite, EDGE } from './iso';
import { WOOD_DARK } from './palette';
import { tools, ln, poly, ell, dot, wave, star, OUT, f2 } from './shopSprites';
import { depositArtLayer } from './decorArt';

const TAU = Math.PI * 2;
const ICE = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };
const OBSIDIAN = { top: '#4A4258', left: '#2C2A34', right: '#1C1A22' };

// Étincelle qui scintille une fois par boucle (k : décalage)
function twinkle(x, y, r, fr, n, k) {
  const o = Math.max(0, Math.sin((fr / n) * TAU + k));
  return o > 0.1 ? star(x, y, r * (0.55 + 0.45 * o), '#FFFFFF', o) : '';
}
// Aiguille de cristal (en pixels) : deux facettes, un reflet ; colors = { left, right }
function spire(x, y, h, w, colors, lean = 0) {
  return poly([[x - w, y], [x, y + w * 0.45], [x + lean, y - h]], colors.left, EDGE) + poly([[x, y + w * 0.45], [x + w, y], [x + lean, y - h]], colors.right, EDGE)
    + ln([x - w * 0.45 + lean * 0.2, y - h * 0.15], [x - w * 0.15 + lean * 0.7, y - h * 0.75], 'rgba(255,255,255,.75)', 0.8);
}
// Mouton vu de trois quarts (en pixels) : laineux ou tondu ; head : tête levée (0) ou qui broute (1)
function sheep(x, y, woolly, head = 0, flip = false) {
  const s = flip ? -1 : 1;
  const body = woolly ? '#F7F2E6' : '#E8D9CC';
  const bump = woolly ? [-5, -1, 3].map(dx => dot(x + s * dx, y - 9, 3.6, body)).join('') : '';
  const hx = x + s * 8, hy = y - 8 + head * 4;
  return ell(x, y + 0.5, 8, 2.2, 'rgba(40,55,20,.22)')
    + [-4, -1.5, 2, 4.5].map(dx => ln([x + s * dx, y - 3], [x + s * dx, y], '#4A3E36', 1.2)).join('')
    + ell(x, y - 6, woolly ? 8 : 6.4, woolly ? 5 : 3.8, body, ` stroke="${OUT}" stroke-width="0.5"`) + bump
    + ell(hx, hy, 2.6, 2, '#3D342E') + ell(hx - s * 1.6, hy - 1.6, 1.4, 0.8, '#3D342E') + dot(hx + s * 0.8, hy - 0.6, 0.45, '#F4ECDC');
}
// Massette (en pixels) : tige qui plie de sway, épi brun en haut
function cattail(x, y, h, sway, head = true) {
  const tx = x + sway, ty = y - h;
  return `<path d="M${f2(x)},${f2(y)} q${f2(sway * 0.3)},${f2(-h * 0.5)} ${f2(sway)},${f2(-h)}" stroke="#5F8F3C" stroke-width="1.3" fill="none"/>`
    + (head ? ell(tx, ty + 2.5, 1.6, 3.6, '#8A5A2E', ` stroke="#4A2E14" stroke-width="0.5"`) : '');
}

// Cristaux de glace : une touffe d'aiguilles bleues qui scintillent ; ramassés, des moignons
const glace = {
  ready: {
    frame: [-30, -46, 60, 56], n: 8, fps: 3,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      return T.shadow(0, 0, 0.3, 0.14) + ell(x, y + 1, 18, 7, 'rgba(255,255,255,.7)')
        + spire(x - 9, y - 1, 20, 5, ICE, -2) + spire(x + 8, y, 24, 5.5, ICE, 2) + spire(x - 1, y + 3, 34, 6.5, ICE) + spire(x + 3, y + 6, 16, 4.5, ICE, 1)
        + twinkle(x - 1, y - 30, 3, fr, n, 0) + twinkle(x + 9, y - 20, 2.4, fr, n, 2.2) + twinkle(x - 9, y - 16, 2.2, fr, n, 4.1);
    }
  },
  spent: {
    frame: [-24, -16, 48, 26],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 14, 5, 'rgba(255,255,255,.6)') + spire(x - 6, y, 5, 4, ICE) + spire(x + 5, y + 1, 6, 4, ICE) + spire(x, y + 3, 4, 3.5, ICE);
    }
  }
};

// Moutons à tondre : deux moutons laineux qui broutent ; tondus, ils attendent que leur laine repousse
const laine = {
  ready: {
    frame: [-30, -26, 60, 34], n: 8, fps: 2,
    draw: (T, fr) => {
      const [x, y] = T.p(0, 0, 0);
      return sheep(x - 8, y - 2, true, fr % 4 < 2 ? 1 : 0) + sheep(x + 9, y + 4, true, fr % 4 >= 2 ? 1 : 0, true);
    }
  },
  spent: {
    frame: [-30, -24, 60, 32],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return sheep(x - 8, y - 2, false, 1) + sheep(x + 9, y + 4, false, 0, true);
    }
  }
};

// Roseaux : une touffe de massettes qui ondulent ; coupés, des tiges courtes
const roseau = {
  ready: {
    frame: [-24, -44, 48, 52], n: 8, fps: 3,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      let out = ell(x, y + 1, 14, 4.5, 'rgba(60,90,50,.3)');
      [[-9, 26], [-5, 32], [-1, 36], [3, 30], [7, 34], [11, 24], [-12, 20]].forEach(([dx, h], k) => {
        out += cattail(x + dx, y + (k % 2) * 2, h, wave(fr, n, 2.2, k * 0.8));
      });
      return out + [-7, 0, 6].map(dx => ln([x + dx, y + 2], [x + dx * 1.5, y - 8], '#7FA45A', 1.2)).join('');
    }
  },
  spent: {
    frame: [-20, -14, 40, 22],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 12, 4, 'rgba(60,90,50,.3)') + [-8, -4, 0, 4, 8].map((dx, k) => cattail(x + dx, y + (k % 2) * 2, 5 + (k % 3), 0, false)).join('');
    }
  }
};

// Croûte de sel : des plaques blanches et des cristaux qui accrochent le soleil ; ramassée, une croûte grise
const sel = {
  ready: {
    frame: [-30, -26, 60, 36], n: 8, fps: 3,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cube = (cx, cy, s) => poly([[cx - s, cy], [cx, cy + s * 0.5], [cx, cy - s * 0.9], [cx - s, cy - s * 1.4]], '#F4EEE8', EDGE)
        + poly([[cx, cy + s * 0.5], [cx + s, cy], [cx + s, cy - s * 1.4], [cx, cy - s * 0.9]], '#DCD2C8', EDGE)
        + poly([[cx - s, cy - s * 1.4], [cx, cy - s * 0.9], [cx + s, cy - s * 1.4], [cx, cy - s * 1.9]], '#FFFFFF', EDGE);
      return ell(x, y + 1, 22, 9, '#FFFFFF', ` stroke="#E8DCCF" stroke-width="0.8"`) + ell(x + 6, y - 1, 9, 3.5, 'rgba(244,198,208,.5)')
        + cube(x - 8, y + 1, 4) + cube(x + 6, y + 3, 5) + cube(x - 1, y - 3, 3.5) + cube(x + 12, y - 2, 3)
        + twinkle(x + 6, y - 7, 2.8, fr, n, 0.5) + twinkle(x - 8, y - 5, 2.2, fr, n, 3);
    }
  },
  spent: {
    frame: [-26, -10, 52, 20],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 20, 8, '#E6DED4', ` stroke="#D2C6B8" stroke-width="0.8"`) + `<path d="M${x - 12},${y} l6,2 l5,-3 l7,2" stroke="#CFC3B4" stroke-width="0.8" fill="none"/>`;
    }
  }
};

// Arbre à fruits : un petit manguier chargé de fruits dorés ; cueilli, il garde ses feuilles
function fruitTree(T, fr, n, fruits) {
  const [x, y] = T.p(0, 0, 0);
  const sway = fruits ? wave(fr, n, 1.2) : 0;
  let out = T.shadow(0, 0, 0.3, 0.18) + `<path d="M${x - 2},${y} Q${x - 3},${y - 12} ${x},${y - 22} L${x + 3},${y - 22} Q${x + 2},${y - 10} ${x + 3},${y} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.5"/>`;
  for (const [dx, dy, r, c] of [[-9, -26, 9, '#2F7A3A'], [9, -27, 9, '#2F7A3A'], [0, -34, 11, '#3E8A48'], [-4, -28, 8, '#5FAE5A'], [5, -31, 6, '#8FD06E']]) {
    out += dot(x + dx + sway, y + dy, r, c);
  }
  if (fruits) {
    for (const [dx, dy] of [[-8, -22], [7, -24], [-2, -28], [10, -31], [-10, -30], [2, -20]]) {
      out += ell(x + dx + sway, y + dy, 2.2, 2.8, '#F2B23C', ` stroke="#8A5A14" stroke-width="0.5"`) + dot(x + dx + sway - 0.6, y + dy - 1, 0.7, '#FFE39A');
    }
  }
  return out;
}
const fruits = {
  ready: { frame: [-24, -50, 48, 58], n: 8, fps: 2, draw: (T, fr, n) => fruitTree(T, fr, n, true) },
  spent: { frame: [-24, -50, 48, 58], draw: T => fruitTree(T, 0, 1, false) }
};

// Éclats d'obsidienne : des lames noires au reflet violet, qui luisent de braises ; ramassés, des cailloux sombres
const obsidienne = {
  ready: {
    frame: [-28, -38, 56, 48], n: 8, fps: 3,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      const glint = 0.4 + 0.6 * Math.max(0, Math.sin((fr / n) * TAU));
      return T.shadow(0, 0, 0.28, 0.2) + ell(x, y + 1, 15, 5, 'rgba(255,120,50,.25)')
        + spire(x - 8, y, 16, 5, OBSIDIAN, -3) + spire(x + 7, y + 1, 20, 5.5, OBSIDIAN, 2) + spire(x, y + 4, 26, 6, OBSIDIAN) + boulder(0.18, 0.12, 0.08, 0.06, 5, OBSIDIAN, 3, 0.3, 0.4)
        + ln([x - 1, y - 18], [x + 1.5, y - 6], `rgba(185,166,232,${f2(glint)})`, 1.2) + ln([x + 7, y - 14], [x + 8, y - 6], `rgba(185,166,232,${f2(glint * 0.7)})`, 1)
        + twinkle(x, y - 24, 2.4, fr, n, 1.5);
    }
  },
  spent: {
    frame: [-22, -12, 44, 20],
    draw: () => boulder(-0.1, 0, 0.07, 0.05, 4, OBSIDIAN, 1, 0.3, 0.4) + boulder(0.12, 0.06, 0.06, 0.05, 3, OBSIDIAN, 2, 0.3, 0.4) + boulder(0, 0.14, 0.05, 0.04, 3, OBSIDIAN, 4, 0.3, 0.4)
  }
};

// Ce que la mer rend sur la Grève (v6, étape 4) : du bois flotté, des coquillages, des galets, posés sur le sable
// mouillé ; prêts, un liseré d'écume va et vient et un reflet scintille ; ramassés, la trace humide qu'ils laissent
const WET = 'rgba(120,96,60,.22)';
// Liseré d'écume qui va et vient (en pixels, k : décalage)
const foam = (x, y, fr, n, k = 0) => {
  const d = wave(fr, n, 2, k);
  return `<path d="M${f2(x - 16 + d)},${f2(y + 5)} q8,-3 16,0 t16,0" stroke="rgba(255,255,255,.75)" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
};
// Bûche de bois flotté, blanchie par le sel (en pixels) : du coin a au coin b, épaisseur w
const log = (a, b, w) => ln(a, b, '#6E5A44', w + 1.6) + ln(a, b, '#C9B79C', w) + ln([a[0] + 1, a[1] - w * 0.2], [b[0] - 1, b[1] - w * 0.2], '#E6D9C2', w * 0.35)
  + dot(a[0] + (b[0] - a[0]) * 0.6, a[1] + (b[1] - a[1]) * 0.6, w * 0.22, '#8A7458');
// Coquille Saint-Jacques (en pixels), la pointe en bas ; r : taille, color : teinte
function scallop(x, y, r, color) {
  const tips = [-1, -0.5, 0, 0.5, 1].map(k => [x + k * r, y - r * 0.55 - (1 - k * k) * r * 0.45]);
  return `<path d="M${f2(x)},${f2(y + r * 0.35)} L${f2(x - r)},${f2(y - r * 0.5)} Q${f2(x)},${f2(y - r * 1.45)} ${f2(x + r)},${f2(y - r * 0.5)} Z" fill="${color}" stroke="${OUT}" stroke-width="0.6"/>`
    + tips.map(t => ln([x, y + r * 0.3], t, 'rgba(120,70,60,.35)', 0.6)).join('')
    + poly([[x - r * 0.28, y + r * 0.42], [x + r * 0.28, y + r * 0.42], [x, y + r * 0.1]], color, ` stroke="${OUT}" stroke-width="0.5"`);
}
// Galet poli (en pixels) : un ovale, son ventre plus clair et un reflet
const pebble = (x, y, rx, ry, color, light) => ell(x, y + ry * 0.25, rx, ry, color, ` stroke="${OUT}" stroke-width="0.6"`)
  + ell(x - rx * 0.15, y - ry * 0.1, rx * 0.7, ry * 0.55, light) + dot(x - rx * 0.4, y - ry * 0.35, Math.max(0.7, ry * 0.18), 'rgba(255,255,255,.8)');

const bois = {
  ready: {
    frame: [-30, -24, 60, 34], n: 8, fps: 2,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 2, 20, 6, WET) + foam(x, y, fr, n)
        + log([x - 15, y + 1], [x + 12, y - 5], 4.6) + log([x - 6, y - 7], [x + 14, y + 2], 3.6)
        + ln([x + 12, y - 5], [x + 16, y - 9], '#8A7458', 1.1) + ell(x - 13, y + 3, 4, 1.4, 'rgba(80,120,60,.7)')
        + twinkle(x + 4, y - 10, 2.4, fr, n, 1);
    }
  },
  spent: {
    frame: [-24, -10, 48, 18],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 16, 5, WET) + ln([x - 6, y + 1], [x + 3, y - 1], '#A8957A', 1.4);
    }
  }
};
const coquillage = {
  ready: {
    frame: [-28, -24, 56, 32], n: 8, fps: 2,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 2, 18, 6, WET) + foam(x, y, fr, n, 1.5)
        + scallop(x - 8, y + 1, 6, '#F6D7C8') + scallop(x + 7, y - 1, 7, '#F3B9A4') + scallop(x, y + 5, 5, '#FFF1E2')
        + `<path d="M${x + 13},${y + 4} q3,-4 0,-6 q-3,1 -2,3" stroke="#B08A6A" stroke-width="1.6" fill="#E9D3B8" stroke-linecap="round"/>`
        + twinkle(x + 7, y - 9, 2.4, fr, n, 3);
    }
  },
  spent: {
    frame: [-22, -10, 44, 18],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 14, 4.5, WET) + poly([[x - 2, y + 1], [x + 3, y - 1], [x + 4, y + 2]], '#F1D9CB', ` stroke="${OUT}" stroke-width="0.5"`);
    }
  }
};
const galet = {
  ready: {
    frame: [-28, -22, 56, 30], n: 8, fps: 2,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 2, 19, 6, WET) + foam(x, y, fr, n, 3)
        + pebble(x - 8, y, 7, 4.6, '#8E99A3', '#B4BEC6') + pebble(x + 6, y - 2, 6, 4, '#A39484', '#C7B9A9')
        + pebble(x + 1, y + 4, 5, 3.2, '#7C8790', '#A3ADB5') + pebble(x + 12, y + 3, 3.4, 2.4, '#B2A493', '#D6CABB')
        + twinkle(x - 9, y - 6, 2.2, fr, n, 4.5);
    }
  },
  spent: {
    frame: [-22, -10, 44, 18],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x, y + 1, 15, 4.5, WET) + pebble(x + 4, y, 2.4, 1.6, '#8E99A3', '#B4BEC6');
    }
  }
};

export const DEPOSIT_SPRITES = { glace, laine, roseau, sel, fruits, obsidienne };
// (la bibliothèque n'a pas encore leurs dessins)
export const PICKUP_SPRITES = { bois, coquillage, galet };

// Calque d'un gisement prêt à peindre à l'instant t (secondes) : clé d'image et dessin. Le dessin de la bibliothèque
// d'abord (decorArt.js), sinon celui-ci
export function depositLayer(find, ready, t = 0) {
  const art = depositArtLayer(find, ready, t);
  if (art) return art;
  const kind = DEPOSIT_SPRITES[find] || PICKUP_SPRITES[find];
  if (!kind) return null;
  const layer = ready ? kind.ready : kind.spent;
  const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
  const [x, y, w, h] = layer.frame;
  const name = `deposit-${find}-${ready ? 'r' : 's'}`;
  return { key: `${name}-${f}`, make: () => sprite(layer.draw(tools(0, 0, name), f, layer.n || 1), { x, y, w, h }) };
}
