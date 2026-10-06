// Sprites des îlots (lot 5e), même géométrie et même lumière que le reste : nid de la colonie de mouettes, ponton de
// la barque, barque volante du passeur (sa voile se gonfle : 2 images).
import { P, box, disc, sprite } from './iso.js';
import { WOOD, WOOD_DARK, PROP_BOX, BUILDING_BOX } from './palette.js';
import { WISP } from './brume.js';

const f2 = n => Math.round(n * 100) / 100;

// Nid : couronne de brins de paille, trois œufs pâles mouchetés (posé au centre de sa case)
function nest() {
  const [x, y] = P(0, 0, 0);
  let straw = '';
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2;
    const r = 9 + (k % 3);
    straw += `<path d="M${f2(x + Math.cos(a) * r)},${f2(y + Math.sin(a) * r * 0.5)} q${f2(Math.cos(a + 1.4) * 5)},${f2(Math.sin(a + 1.4) * 2)} ${f2(Math.cos(a + 2) * 7)},${f2(Math.sin(a + 2) * 3)}" stroke="${k % 2 ? '#C9A45A' : '#E2C27A'}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  const egg = (dx, dy, c) => `<ellipse cx="${f2(x + dx)}" cy="${f2(y + dy)}" rx="2.6" ry="3.4" fill="${c}" stroke="rgba(90,90,80,.35)" stroke-width="0.5"/><circle cx="${f2(x + dx + 0.8)}" cy="${f2(y + dy - 0.6)}" r="0.5" fill="#8C8270"/>`;
  return sprite(
    `<ellipse cx="${f2(x + 1)}" cy="${f2(y + 1.5)}" rx="12" ry="5.6" fill="rgba(40,55,20,.18)"/>`
    + `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="10.5" ry="5" fill="#B08A48"/>` + `<ellipse cx="${f2(x)}" cy="${f2(y - 0.6)}" rx="7" ry="3.2" fill="#7A5A30"/>`
    + egg(-2.6, -2.6, '#EEF3F2') + egg(2.4, -2.2, '#DCEBEE') + egg(0, -0.8, '#F4F1E6')
    + straw,
    PROP_BOX
  );
}

// Ponton d'amarrage au ras de l'eau : pilotis, plancher, bitte et cordage
function landing() {
  const deck = box(-0.42, -0.2, 0.42, 0.2, 2, 5, { top: '#C99A62', left: WOOD.left, right: WOOD.right });
  let posts = '';
  for (const [u, v] of [[-0.38, 0.18], [0.38, 0.18], [0.38, -0.18]]) posts += box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, -10, 2, WOOD_DARK);
  let planks = '';
  for (let k = -3; k <= 3; k++) {
    const [ax, ay] = P(k * 0.12, -0.2, 5);
    const [bx, by] = P(k * 0.12, 0.2, 5);
    planks += `<line x1="${f2(ax)}" y1="${f2(ay)}" x2="${f2(bx)}" y2="${f2(by)}" stroke="rgba(90,55,25,.4)" stroke-width="0.8"/>`;
  }
  const [cx, cy] = P(0.3, 0.05, 5);
  return sprite(
    disc(0, 0.05, -1, 0.5, 'rgba(255,255,255,.35)') + posts + deck + planks
    + box(0.26, 0.01, 0.34, 0.09, 5, 11, WOOD_DARK)
    + `<path d="M${f2(cx)},${f2(cy - 4)} q-6,4 -14,2" stroke="#D9C08A" stroke-width="1.2" fill="none"/>`,
    BUILDING_BOX
  );
}

// Barque volante : coque de bois, mât et voile (gonflée selon l'image), lanterne de poupe, et la lueur bleutée de
// la brume qui la porte. Tournée vers la droite (retournée à l'écran pour aller à gauche)
function ferry(frame) {
  const belly = frame ? 6 : 3;
  const glow = WISP.calm;
  return sprite(
    `<ellipse cx="0" cy="6" rx="22" ry="5" fill="rgba(${glow.halo},.28)"/>`
    + `<path d="M-22,-6 L22,-6 Q19,5 9,6 L-12,6 Q-20,4 -22,-6 Z" fill="${WOOD.left}" stroke="#3C2819" stroke-width="0.8"/>`
    + `<path d="M-22,-6 L22,-6 L19,-2 L-20,-2 Z" fill="${WOOD.top}"/>`
    + `<path d="M-14,-1 h26" stroke="${WOOD_DARK.right}" stroke-width="0.8"/>`
    + `<path d="M-1,-6 L-1,-46" stroke="${WOOD_DARK.right}" stroke-width="2"/>`
    + `<path d="M0,-44 Q${16 + belly},-30 0,-12 Z" fill="#FFFDF8" stroke="rgba(60,40,25,.5)" stroke-width="0.8"/>`
    + `<circle cx="${f2(5 + belly / 3)}" cy="-28" r="3.2" fill="${glow.edge}" opacity=".85"/>`
    + `<path d="M-2,-40 Q-12,-26 -2,-14 Z" fill="#F2E4C0"/>`
    + `<path d="M-19,-6 L-19,-16" stroke="#3D3A36" stroke-width="1.2"/><rect x="-22" y="-22" width="6" height="7" fill="#FFE08A" stroke="#3D3A36" stroke-width="0.8"/>`,
    { x: -32, y: -56, w: 64, h: 68 }
  );
}

export const ISLET_SPRITES = { landing, ferry: [0, 1].map(f => () => ferry(f)) };
export const ISLET_NATURE = { nest };
