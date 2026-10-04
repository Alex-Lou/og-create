// Ponton, paliers III à VII : Chantier naval, Grand port, Criée, Port à vapeur, Port du Kraken.
// Même anse et même appontement à z = 10 qu'aux paliers I-II (× 1.5 dès le palier IV) : la canne au bout de la
// jetée en L, le filet sur l'appontement, le casier et le crabe sur le sable, la barque derrière l'appontement.
import { BLUE_ROOF, BUILDING_BOX } from '../palette';
import { sprite } from '../iso';
import {
  big, P, box, face, gable, cylinder, disc, f2, ln, dot, ell, OUT, STONE, WOOD, WOOD_DARK, IRON, GOLD,
  courseRight
} from './kit';

const WATER_LIGHT = '#6FC0E4';
const WATER = '#5AAED7';
const DECK = { top: '#E0A96C', left: '#BF8049', right: '#965C30' };

// Anse et appontement, à l'échelle k (1 : 2 × 2 cases, 1.5 : 3 × 3) ; under : ce qui flotte derrière l'appontement
function harbor(k, under = '') {
  let posts = '';
  for (const u of [-0.75, -0.25, 0.25, 0.75]) {
    posts += box(u * k - 0.04, 0.12 * k, u * k + 0.04, 0.2 * k, -4, 7, WOOD_DARK) + box(u * k - 0.04, -0.2 * k, u * k + 0.04, -0.12 * k, -4, 7, WOOD_DARK);
  }
  let planks = '';
  for (let u = -0.85 * k + 0.13; u < 0.9 * k; u += 0.13) planks += ln(P(u, -0.25 * k, 10), P(u, 0.25 * k, 10), 'rgba(90,55,25,.35)', 0.8);
  return disc(0, 0.05 * k, 0, 0.92 * k, WATER_LIGHT) + disc(0, 0.05 * k, 0, 0.78 * k, WATER)
    + [0.3, 0.55].map(r => disc(-0.2 * k, 0.4 * k, 0.1, r * 0.4 * k, 'none', ' stroke="rgba(255,255,255,.35)" stroke-width="0.8"')).join('')
    + under
    + posts
    + box(-0.85 * k, -0.25 * k, 0.9 * k, 0.25 * k, 7, 10, DECK) + planks
    + box(0.45 * k, 0.25 * k, 0.75 * k, 0.75 * k, 7, 10, DECK)
    + box(0.71 * k, 0.71 * k, 0.75 * k, 0.75 * k, -4, 7, WOOD_DARK) + box(0.45 * k, 0.71 * k, 0.49 * k, 0.75 * k, -4, 7, WOOD_DARK);
}
// Rouleaux de cordage et bitte d'amarrage
function bollard(u, v) {
  return cylinder(u, v, 10, 16, 0.04, { top: '#5A636C', left: '#5A636C', right: '#41484F' }, `bl-${Math.round((u + 2) * 100)}`) + cylinder(u, v, 16, 17.5, 0.055, IRON, `bt-${Math.round((u + 2) * 100)}`);
}
function ropeCoil(u, v) {
  const [x, y] = P(u, v, 10);
  return [5, 3.6, 2.2].map(r => ell(x, y - 1, r, r / 2, 'none', ' stroke="#C9A16A" stroke-width="1.4"')).join('');
}

/* ---------- Palier III : Chantier naval ---------- */
// Coque en construction sur son ber (membrures apparentes), échafaudage, piles de planches
function shipyard() {
  const ribs = [];
  for (let k = 0; k < 6; k++) {
    const u = -0.8 + k * 0.1;
    const w = 0.13 * Math.sin(((k + 0.5) / 6) * Math.PI) + 0.04;
    const h = 10 + 12 * Math.sin(((k + 0.5) / 6) * Math.PI);
    const [a, b, c] = [P(u, -w, 10 + h), P(u, 0, 13), P(u, w, 10 + h)];
    ribs.push(`<path d="M${f2(a[0])},${f2(a[1])} Q${f2(b[0] - 1)},${f2(b[1] + 4)} ${f2(c[0])},${f2(c[1])}" stroke="${WOOD.right}" stroke-width="1.8" fill="none"/>`);
  }
  return sprite(
    harbor(1)
    + box(-0.86, -0.06, -0.24, 0.06, 10, 13, WOOD_DARK)
    + ribs.slice(0, 3).join('')
    + ln(P(-0.85, 0, 13), P(-0.27, 0, 14), WOOD_DARK.right, 2.6)
    + face([[-0.84, 0.03, 13], [-0.3, 0.03, 13], [-0.4, 0.12, 22], [-0.75, 0.12, 22]], WOOD.left, ` stroke="${OUT}" stroke-width="0.6"`)
    + ribs.slice(3).join('')
    + ln(P(-0.27, 0, 14), P(-0.16, 0, 30), WOOD_DARK.right, 2)
    // Échafaudage et petite grue à bras
    + [[-0.88, -0.2], [-0.2, -0.2]].map(([u, v]) => box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 10, 40, WOOD_DARK)).join('')
    + box(-0.9, -0.22, -0.18, -0.18, 34, 36, WOOD)
    + ln(P(-0.2, -0.2, 40), P(0.05, 0.05, 44), WOOD.right, 1.8) + ln(P(0.05, 0.05, 44), P(0.05, 0.05, 28), '#3D3A36', 0.6)
    + box(0.0, 0.0, 0.1, 0.1, 24, 28, { top: '#F1D3A1', left: '#D9B07A', right: '#B98552' })
    + [0, 1, 2].map(k => box(0.15, -0.2, 0.42, -0.08, 10 + k * 2.2, 12 + k * 2.2, { top: '#F1D3A1', left: '#D9B07A', right: '#B98552' })).join('')
    + ropeCoil(0.25, 0.12) + bollard(0.82, 0.18)
    + box(0.8, 0.12, 0.84, 0.16, 10, 34, WOOD_DARK) + box(0.76, 0.08, 0.88, 0.2, 34, 41, { top: '#3D3A36', left: '#FFE08A', right: '#E9BF4E' }),
    BUILDING_BOX
  );
}

/* ---------- Grand port (paliers IV à VII) ---------- */
const LIGHTHOUSE = { u: -1.12, v: -1.12, h: 92 };
function lighthouse(top = '#FFE08A') {
  const { u, v, h } = LIGHTHOUSE;
  const stripes = [0, 1, 2, 3].map(k => {
    const z0 = 8 + k * 20;
    const [x0, y0] = P(u, v, z0);
    const [x1, y1] = P(u, v, z0 + 10);
    const r0 = 0.3 - (z0 / h) * 0.1;
    const r1 = 0.3 - ((z0 + 10) / h) * 0.1;
    return `<path d="M${f2(x0 - r0 * 45.25)},${f2(y0)} A${f2(r0 * 45.25)},${f2(r0 * 22.6)} 0 0 0 ${f2(x0 + r0 * 45.25)},${f2(y0)} L${f2(x1 + r1 * 45.25)},${f2(y1)} A${f2(r1 * 45.25)},${f2(r1 * 22.6)} 0 0 1 ${f2(x1 - r1 * 45.25)},${f2(y1)} Z" fill="#E2463A" opacity=".92"/>`;
  }).join('');
  const [bx, by] = P(u, v, 0);
  const [tx, ty] = P(u, v, h);
  return box(u - 0.36, v - 0.36, u + 0.36, v + 0.36, 0, 8, STONE) + courseRight(u + 0.36, v - 0.36, v + 0.36, 0, 8, 2)
    + `<defs><linearGradient id="lh-g" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9C3B6"/></linearGradient></defs>`
    + `<path d="M${f2(bx - 13.6)},${f2(by - 8)} L${f2(tx - 9)},${f2(ty)} L${f2(tx + 9)},${f2(ty)} L${f2(bx + 13.6)},${f2(by - 8)} A13.6,6.8 0 0 1 ${f2(bx - 13.6)},${f2(by - 8)} Z" fill="url(#lh-g)" stroke="${OUT}" stroke-width="0.8"/>`
    + stripes
    + cylinder(u, v, h, h + 3, 0.28, { top: '#3D3A36', left: '#55504A', right: '#3D3A36' }, 'lh-gal')
    + `<rect x="${f2(tx - 6)}" y="${f2(ty - 15)}" width="12" height="12" fill="${top}" stroke="#3D3A36" stroke-width="1.2"/>`
    + ln([tx - 2, ty - 15], [tx - 2, ty - 3], '#3D3A36', 0.8) + ln([tx + 2, ty - 15], [tx + 2, ty - 3], '#3D3A36', 0.8)
    + `<path d="M${f2(tx - 8)},${f2(ty - 15)} L${f2(tx)},${f2(ty - 24)} L${f2(tx + 8)},${f2(ty - 15)} Z" fill="#E2463A" stroke="${OUT}" stroke-width="0.7"/>` + dot(tx, ty - 25, 1.6, GOLD.left);
}
// Faisceau du phare qui tourne (8 images) : un cône de lumière pâle qui balaie la mer
const beam = color => f => sprite((() => {
  const { u, v, h } = LIGHTHOUSE;
  const [tx, ty] = P(u, v, h);
  const a = (f / 8) * Math.PI * 2;
  const len = 70;
  const dx = Math.cos(a) * len;
  const dy = Math.sin(a) * len * 0.45;
  const spread = 10;
  return `<path d="M${f2(tx)},${f2(ty - 9)} L${f2(tx + dx - Math.sin(a) * spread)},${f2(ty - 9 + dy + Math.cos(a) * spread * 0.45)} L${f2(tx + dx + Math.sin(a) * spread)},${f2(ty - 9 + dy - Math.cos(a) * spread * 0.45)} Z" fill="${color}" opacity="${f2(0.16 + 0.1 * Math.max(0, Math.cos(a - 0.8)))}"/>`;
})(), { x: -150, y: -175, w: 170, h: 110 });
// Caisse posée sur l'appontement
const deckCrate = (u, v, s = 0.08) => box(u - s, v - s, u + s, v + s, 10, 10 + s * 100, { top: '#E0B47A', left: '#C99359', right: '#A06F3C' });
function port(extra = '', lamp = '#FFE08A', under = '') {
  return big(
    harbor(1.5, lighthouse(lamp) + under)
    + bollard(0.3, 0.33) + bollard(-0.6, 0.33) + ropeCoil(0.0, -0.2) + ropeCoil(-0.95, 0.15)
    + deckCrate(-0.4, -0.22) + deckCrate(-0.28, -0.26, 0.06)
    + extra
    + box(1.22, 0.2, 1.26, 0.24, 10, 38, WOOD_DARK) + box(1.18, 0.16, 1.3, 0.28, 38, 45, { top: '#3D3A36', left: '#FFE08A', right: '#E9BF4E' })
  );
}

/* ---------- Palier IV : Grand port ---------- */
const grandPort = () => port();

/* ---------- Palier V : Criée ---------- */
// Halle de la criée sur l'appontement : piliers, toit rayé, étals de poissons, balance
function fishMarket() {
  const u0 = -1.2, u1 = -0.3, v0 = -0.34, v1 = 0.34;
  const stalls = [-1.05, -0.75, -0.45].map(u => box(u - 0.1, 0.12, u + 0.1, 0.26, 10, 18, { top: '#E0B47A', left: '#C99359', right: '#A06F3C' })
    + [-0.05, 0, 0.05].map(du => { const [x, y] = P(u + du, 0.19, 18.5); return `<path d="M${f2(x - 3)},${f2(y)} q3,-2 6,0 q-3,2 -6,0 Z M${f2(x + 3)},${f2(y)} l1.6,-1.2 l0,2.4 Z" fill="${du ? '#B8CCD8' : '#F08A6E'}"/>`; }).join('')).join('');
  const roof = { front: '#FFFFFF', back: '#DDE6EE', gable: '#C9D2DA' };
  let stripes = '';
  for (let k = 0; k < 5; k++) {
    const a = u0 - 0.06 + k * ((u1 - u0 + 0.12) / 5);
    const b = a + (u1 - u0 + 0.12) / 10;
    stripes += face([[a, 0, 44], [b, 0, 44], [b, v1 + 0.06, 32], [a, v1 + 0.06, 32]], BLUE_ROOF.front);
  }
  return [[u0, v0], [u1, v0]].map(([u, v]) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 10, 32, WOOD_DARK)).join('')
    + stalls
    + [[u0, v1], [u1, v1]].map(([u, v]) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 10, 32, WOOD_DARK)).join('')
    + gable(u0, v0, u1, v1, 32, 12, roof, 0.06) + stripes
    + deckCrate(-0.15, 0.1, 0.07);
}
const market = () => port(fishMarket());

/* ---------- Palier VI : Port à vapeur ---------- */
// Vapeur amarré dans l'anse arrière : coque noire et rouge, superstructure blanche, cheminée qui fume
function steamer() {
  const u0 = -0.72, u1 = 0.42, v = -0.92;
  const hull = [P(u0, v, 4), P(u1 + 0.15, v, 4), P(u1, v + 0.2, 4), P(u0 + 0.05, v + 0.2, 4)];
  const side = [P(u0 + 0.05, v + 0.2, 4), P(u1, v + 0.2, 4), P(u1 + 0.15, v, 4), P(u1 + 0.12, v, -2), P(u1 - 0.02, v + 0.18, -3), P(u0 + 0.08, v + 0.18, -3)];
  return `<polygon points="${side.map(p => p.map(f2).join(',')).join(' ')}" fill="#2E2A26"/>`
    + `<polygon points="${hull.map(p => p.map(f2).join(',')).join(' ')}" fill="#C9935E" stroke="${OUT}" stroke-width="0.7"/>`
    + ln(P(u0 + 0.06, v + 0.2, 1), P(u1, v + 0.2, 1), '#B13A31', 2)
    + box(u0 + 0.2, v + 0.02, u1 - 0.2, v + 0.18, 4, 16, { top: '#FFFFFF', left: '#F1EEE8', right: '#CFC8BA' })
    + [0, 1, 2, 3].map(k => dot(...P(u0 + 0.28 + k * 0.17, v + 0.18, 10), 1.6, '#FFE6A3')).join('')
    + cylinder(u0 + 0.62, v + 0.1, 16, 38, 0.07, { top: '#2E2A26', left: '#E2463A', right: '#B13A31' }, 'st-funnel')
    + ln(P(u0 + 0.62, v + 0.1, 30), P(u0 + 0.62, v + 0.1, 32), '#2E2A26', 6)
    + ln(P(u0 + 0.12, v + 0.1, 4), P(u0 + 0.12, v + 0.1, 34), WOOD_DARK.right, 1.2) + ln(P(u0 + 0.12, v + 0.1, 34), P(u1 + 0.1, v + 0.1, 8), '#3D3A36', 0.5);
}
const steamPort = () => port(fishMarket(), '#FFE08A', steamer());

/* ---------- Palier VII : Port du Kraken ---------- */
const krakenPort = () => port(fishMarket() + chest(0.95, -0.12), '#9CFFB0');
function chest(u, v) {
  const [x, y] = P(u, v, 18);
  return box(u - 0.1, v - 0.07, u + 0.1, v + 0.07, 10, 18, { top: '#A8743F', left: '#8B5631', right: '#6A3F22' })
    + face([[u - 0.1, v - 0.07, 18], [u + 0.1, v - 0.07, 18], [u + 0.1, v + 0.07, 21], [u - 0.1, v + 0.07, 21]], '#C9935E', ` stroke="${OUT}" stroke-width="0.6"`)
    + ln(P(u - 0.1, v + 0.07, 14), P(u + 0.1, v + 0.07, 14), GOLD.right, 1.2) + dot(x - 6, y + 4, 1.2, GOLD.left)
    + [[-4, -3], [0, -4], [4, -3]].map(([dx, dy]) => dot(x + dx, y + dy, 1.6, GOLD.left)).join('');
}
// Tentacules du Kraken qui sortent de l'eau et ondulent (6 images), un œil qui brille entre deux
const KRAKEN = [[-0.9, 0.7, 1.0], [-0.35, 1.05, 0.8], [0.3, -0.95, 0.9], [0.95, -0.55, 0.7]];
const tentacles = f => sprite((() => {
  let out = '';
  KRAKEN.forEach(([u, v, s], k) => {
    const [x, y] = P(u, v, 0);
    const w = Math.sin((f / 6) * Math.PI * 2 + k * 1.7) * 6 * s;
    const h = 34 * s;
    out += ell(x, y + 1, 8 * s, 3 * s, 'rgba(255,255,255,.55)')
      + `<path d="M${f2(x - 5 * s)},${f2(y)} C${f2(x - 6 * s + w)},${f2(y - h * 0.4)} ${f2(x + w * 1.6)},${f2(y - h * 0.7)} ${f2(x + w * 1.2 + 6 * s)},${f2(y - h)} C${f2(x + w * 1.4 + 2 * s)},${f2(y - h * 0.65)} ${f2(x + 4 * s + w * 0.6)},${f2(y - h * 0.35)} ${f2(x + 5 * s)},${f2(y)} Z" fill="#8E5BB8" stroke="#5E3A82" stroke-width="0.8"/>`
      + [0.25, 0.45, 0.65].map(t => dot(x + w * t * 1.3 + (1 - t) * 1, y - h * t, 1.4 * s, '#D6B8F0')).join('');
  });
  const [ex, ey] = P(-0.6, 0.95, 0);
  return out + `<ellipse cx="${f2(ex)}" cy="${f2(ey - 3)}" rx="6" ry="${f2(f === 3 ? 0.6 : 3)}" fill="#F2C04B" stroke="#5E3A82" stroke-width="1"/>` + (f === 3 ? '' : `<ellipse cx="${f2(ex)}" cy="${f2(ey - 3)}" rx="1.4" ry="2.6" fill="#1E1A17"/>`);
})(), { x: -110, y: -60, w: 220, h: 120 });

export const PONTON_TIERS = [
  { make: shipyard, boat: [0.05, 0.5], lights: [[0.82, 0.14, 37, 16]] },
  { make: grandPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 101, 26], [1.24, 0.22, 41, 16]], anims: [{ key: 'beam', n: 8, fps: 4, frame: beam('#FFF6C8') }] },
  { make: market, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 101, 26], [1.24, 0.22, 41, 16], [-0.75, 0.2, 30, 18]], anims: [{ key: 'beam', n: 8, fps: 4, frame: beam('#FFF6C8') }] },
  { make: steamPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 101, 26], [1.24, 0.22, 41, 16], [-0.25, -0.74, 10, 18]], smoke: [[-0.1, -0.82, 40]], anims: [{ key: 'beam', n: 8, fps: 4, frame: beam('#FFF6C8') }] },
  { make: krakenPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 101, 30], [1.24, 0.22, 41, 16], [0.95, -0.12, 22, 16], [-0.6, 0.95, 4, 16]], anims: [{ key: 'beam', n: 8, fps: 4, frame: beam('#B8FFC8') }, { key: 'kraken', n: 6, fps: 5, frame: tentacles }] }
];
