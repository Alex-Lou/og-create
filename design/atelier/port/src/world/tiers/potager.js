// Potager, paliers III à VII : Verger, Ferme, Moulin, Domaine, Jardin de la Licorne.
// Places laissées libres pour la boutique : pelle et arrosoir dans les planches de devant, poulailler au coin droit
// (derrière), poules à l'avant, ruche au coin gauche (× 1.5 dès le palier IV).
import { BUILDING_BOX, ROOF_RED, roundTree, roofOf, roofTextureOf, soilBed, furrow, leafPair } from '../palette.js';
import { gardenFence } from '../sprites.js';
import { sprite, shadow, HIVER, snowPan, snowCap } from '../iso.js';
import {
  big, bigShadow, P, box, face, gable, cylinder, f2, ln, dot, ell, OUT, STONE, WOOD, WOOD_DARK, GOLD, PLASTER,
  shuttered, chimney, flowerBed, pavedPath
} from './kit.js';

const FRUIT = { light: '#B3E386', mid: '#7EC45B', dark: '#4F8F3A' };
const BARN = { top: '#E08A70', left: '#C85F46', right: '#A04634' };
const WHEAT = '#E9C55A';

// Pommier : houppier rond et pommes rouges
function appleTree(u, v, s) {
  const [x, y] = P(u, v, 0);
  return roundTree(u, v, s, FRUIT) + [[-6, -26], [5, -30], [-2, -38], [8, -22], [-9, -33], [3, -42]].map(([dx, dy]) => dot(x + dx * s, y + dy * s, 1.6 * s, '#E2463A') + dot(x + dx * s - 0.5, y + dy * s - 0.6, 0.5 * s, '#FFB0A0')).join('');
}
// Planche cultivée de [u0, u1] × [v0, v1] : terre, sillons le long de u, plants (kind : légumes, blé, fleurs)
function bed(u0, v0, u1, v1, kind = 'veg', rows = 3) {
  let out = soilBed(u0, v0, u1, v1, 3);
  const dv = (v1 - v0) / rows;
  for (let r = 0; r < rows; r++) {
    const v = v0 + dv * (r + 0.5);
    out += furrow(u0 + 0.04, u1 - 0.04, v, dv * 0.18, 3.1);
    for (let u = u0 + 0.1; u < u1 - 0.05; u += 0.16) {
      const [x, y] = P(u, v, 3);
      if (kind === 'wheat') out += [-2, 0, 2].map(dx => ln([x + dx, y], [x + dx * 1.4, y - 9], '#D9AE45', 0.9) + ell(x + dx * 1.5, y - 10, 1, 2.2, WHEAT)).join('');
      else if (kind === 'flowers') out += ln([x, y], [x, y - 3], '#6DB04F', 0.8) + `<circle cx="${f2(x)}" cy="${f2(y - 4)}" r="2.2" fill="${['#F7A8C8', '#FFD45E', '#A98ADB', '#FFFFFF'][((Math.round((u + v) * 13) % 4) + 4) % 4]}" stroke="${OUT}" stroke-width="0.5"/>` + dot(x, y - 4, 0.7, '#FFE07A');
      else out += leafPair(x, y, 3.2, 1.9, 2.6, '#86CB5E', '#6DB04F') + `<circle cx="${f2(x)}" cy="${f2(y - 4.6)}" r="1.8" fill="${(Math.round(u * 10) % 2) ? '#E2463A' : '#F08A3A'}" stroke="${OUT}" stroke-width="0.5"/>`;
    }
  }
  return out;
}
// Botte de foin ronde (couchée le long de u)
function hayBale(u, v) {
  return box(u - 0.12, v - 0.09, u + 0.12, v + 0.09, 0, 9, { top: '#F3DE97', left: '#E2C66E', right: '#F1D88A' })
    + ell(...P(u + 0.12, v, 4.5), 2.4, 3.6, 'none', ' stroke="#C4A24E" stroke-width="0.6"');
}
// Grange rouge à toit en mansarde (gambrel), le long de u
function barn(u0, v0, u1, v1, h, skin) {
  const roof = roofOf(skin, { front: '#7C7F89', back: '#5E616B' });
  const vm = (v0 + v1) / 2;
  const q = (v1 - v0) * 0.28;
  const brk = h + 12;
  return box(u0, v0, u1, v1, 0, h, BARN)
    + face([[u1, v0, h], [u1, v0 + q * 0.4, brk], [u1, vm, brk + 12], [u1, v1 - q * 0.4, brk], [u1, v1, h]], BARN.right, ` stroke="${OUT}" stroke-width="0.7"`)
    // Grande porte en croix blanche et lucarne de grenier sur le pignon
    + face([[u1, vm - 0.18, 0], [u1, vm + 0.18, 0], [u1, vm + 0.18, h - 3], [u1, vm - 0.18, h - 3]], '#7E3324', ' stroke="#FFFFFF" stroke-width="1.2"')
    + ln(P(u1, vm - 0.18, 0), P(u1, vm + 0.18, h - 3), '#FFFFFF', 1) + ln(P(u1, vm + 0.18, 0), P(u1, vm - 0.18, h - 3), '#FFFFFF', 1)
    + face([[u1, vm - 0.07, h + 6], [u1, vm + 0.07, h + 6], [u1, vm + 0.07, h + 12], [u1, vm - 0.07, h + 12]], '#3A2A1E', ' stroke="#FFFFFF" stroke-width="0.8"')
    + [0.25, 0.5, 0.75].map(k => ln(P(u0 + (u1 - u0) * k, v1, 1), P(u0 + (u1 - u0) * k, v1, h - 1), 'rgba(255,255,255,.55)', 0.9)).join('')
    // Toit en mansarde : brisis (pente forte) puis terrasson
    + face([[u0 - 0.05, v0 - 0.05, h], [u1 + 0.05, v0 - 0.05, h], [u1 + 0.05, v0 + q * 0.4, brk], [u0 - 0.05, v0 + q * 0.4, brk]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`)
    + face([[u0 - 0.05, v0 + q * 0.4, brk], [u1 + 0.05, v0 + q * 0.4, brk], [u1 + 0.05, vm, brk + 12], [u0 - 0.05, vm, brk + 12]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`)
    + (HIVER ? snowPan(P(u0 - 0.05, vm, brk + 12), P(u1 + 0.05, vm, brk + 12), P(u1 + 0.05, v0 + q * 0.4, brk), P(u0 - 0.05, v0 + q * 0.4, brk), 0.95) : '')
    + face([[u0 - 0.05, vm, brk + 12], [u1 + 0.05, vm, brk + 12], [u1 + 0.05, v1 - q * 0.4, brk], [u0 - 0.05, v1 - q * 0.4, brk]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`)
    + (HIVER ? snowPan(P(u0 - 0.05, vm, brk + 12), P(u1 + 0.05, vm, brk + 12), P(u1 + 0.05, v1 - q * 0.4, brk), P(u0 - 0.05, v1 - q * 0.4, brk), 0.95) : '')
    + face([[u0 - 0.05, v1 - q * 0.4, brk], [u1 + 0.05, v1 - q * 0.4, brk], [u1 + 0.05, v1 + 0.05, h], [u0 - 0.05, v1 + 0.05, h]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`)
    + (HIVER ? snowPan(P(u0 - 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 + 0.05, h), P(u0 - 0.05, v1 + 0.05, h), 0.7, true) : '')
    + ln(P(u0 - 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 - q * 0.4, brk), 'rgba(255,255,255,.25)', 0.8);
}
// Clôture du skin le long du fond d'une grande emprise (le motif de 2 × 2 répété, décalé)
function backFence(skin, k = 1.5) {
  return `<g transform="scale(${k})">${gardenFence(skin || undefined)}</g>`;
}

/* ---------- Palier III : Verger ---------- */
function orchard(skin) {
  return sprite(
    shadow(0, 0, 1.15, 0.14)
    + (skin ? gardenFence(skin) : '')
    + appleTree(-0.62, -0.58, 0.95) + appleTree(-0.18, -0.7, 0.85)
    + appleTree(0.15, -0.3, 0.8)
    // Échelle contre le pommier et panier de pommes
    + ln(P(-0.42, -0.42, 0), P(-0.55, -0.55, 30), WOOD.right, 1.2) + ln(P(-0.36, -0.46, 0), P(-0.49, -0.59, 30), WOOD.right, 1.2)
    + [6, 12, 18, 24].map(z => ln(P(-0.42 - z / 230, -0.42 - z / 230, z), P(-0.36 - z / 230, -0.46 - z / 230, z), WOOD.right, 0.8)).join('')
    + box(-0.32, -0.22, -0.16, -0.08, 0, 6, { top: '#B98552', left: '#A06F3C', right: '#8B5631' })
    + [[-0.27, -0.17], [-0.22, -0.13], [-0.24, -0.18]].map(([u, v]) => dot(...P(u, v, 7.5), 1.8, '#E2463A')).join('')
    + bed(-0.85, 0.05, 0.85, 0.85, 'veg', 3),
    BUILDING_BOX
  );
}

/* ---------- Palier IV : Ferme ---------- */
function farm(skin) {
  return big(
    bigShadow(84, 40)
    + (skin ? backFence(skin) : '')
    + barn(-1.35, -1.35, -0.25, -0.45, 26, skin)
    + appleTree(0.2, -1.1, 1.05) + appleTree(0.65, -0.55, 0.9)
    + hayBale(0.0, -0.25) + hayBale(-0.1, -0.05) + hayBale(0.12, -0.05)
    + bed(-1.3, 0.05, 0.05, 1.35, 'veg', 4) + bed(0.2, 0.05, 1.3, 1.35, 'wheat', 4)
    + pavedPath([0.12, -0.3], [0.12, 1.45], 0.14)
  );
}

/* ---------- Palier V : Moulin ---------- */
const MILL = { u: -0.8, v: -0.8, h: 62 };
function windmill(skin) {
  const roof = roofOf(skin, { front: '#8E6A4A', back: '#6F5038' });
  const { u, v, h } = MILL;
  const [cx, cy] = P(u, v, h);
  return big(
    bigShadow(86, 40)
    + (skin ? backFence(skin) : '')
    // Tour de pierre conique, porte, fenêtres, chapeau de bois
    + `<defs><linearGradient id="wm-tower" x1="0" x2="1"><stop offset="0" stop-color="${STONE.top}"/><stop offset="1" stop-color="${STONE.right}"/></linearGradient></defs>`
    + `<path d="M${f2(P(u, v, 0)[0] - 20)},${f2(P(u, v, 0)[1])} L${f2(cx - 13)},${f2(cy)} L${f2(cx + 13)},${f2(cy)} L${f2(P(u, v, 0)[0] + 20)},${f2(P(u, v, 0)[1])} A20,10 0 0 1 ${f2(P(u, v, 0)[0] - 20)},${f2(P(u, v, 0)[1])} Z" fill="url(#wm-tower)" stroke="${OUT}" stroke-width="0.8"/>`
    + [14, 28, 42].map(z => { const [x, y] = P(u, v, z); const w = 20 - (z / h) * 7; return `<path d="M${f2(x - w)},${f2(y)} A${f2(w)},${f2(w / 2)} 0 0 0 ${f2(x + w)},${f2(y)}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.7"/>`; }).join('')
    + `<path d="M${f2(P(u, v + 0.22, 0)[0] - 4)},${f2(P(u, v + 0.22, 0)[1] - 4)} v-12 a4,4 0 0 1 8,0 v12 Z" fill="#4A2E1A"/>`
    + `<rect x="${f2(P(u, v + 0.18, 34)[0] - 2.5)}" y="${f2(P(u, v + 0.18, 34)[1] - 3)}" width="5" height="6" rx="2" fill="#FFE6A3" stroke="#FFFFFF" stroke-width="0.6"/>`
    + `<path d="M${f2(cx - 16)},${f2(cy + 1)} Q${f2(cx)},${f2(cy - 22)} ${f2(cx + 16)},${f2(cy + 1)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.8"/>`
    + `<path d="M${f2(cx)},${f2(cy - 10)} Q${f2(cx + 8)},${f2(cy - 6)} ${f2(cx + 16)},${f2(cy + 1)} L${f2(cx)},${f2(cy + 1)} Z" fill="${roof.back}"/>`
    + (HIVER ? snowCap('wm-neige', `M${f2(cx - 16)},${f2(cy + 1)} Q${f2(cx)},${f2(cy - 22)} ${f2(cx + 16)},${f2(cy + 1)} Z`, cx, cy - 11, 15, 6) : '')
    // Blés dorés, sacs de farine, charrette
    + bed(-0.25, -1.3, 1.3, -0.15, 'wheat', 4) + bed(-1.3, 0.1, 1.3, 1.35, 'wheat', 5)
    + [[-0.35, -0.35], [-0.22, -0.3], [-0.3, -0.22]].map(([a, b], k) => `<path d="M${f2(P(a, b, 0)[0] - 4)},${f2(P(a, b, 0)[1])} q-1,-8 4,-9 q5,1 4,9 Z" fill="${k % 2 ? '#F7F1E1' : '#EFE6D0'}" stroke="rgba(120,100,70,.4)" stroke-width="0.6"/>`).join('')
  );
}
// Ailes du moulin qui tournent (8 images), face à l'avant gauche
const millSails = f => sprite((() => {
  const { u, v, h } = MILL;
  const [hx, hy] = P(u + 0.05, v + 0.28, h - 4);
  const turn = (f / 8) * (Math.PI / 2);
  let out = '';
  for (let k = 0; k < 4; k++) {
    const a = turn + (k * Math.PI) / 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // Plan des ailes ≈ face gauche (vers +v) : en projection, x suit −0.894, y +0.447 le long de l'aile horizontale
    const tip = [hx + ca * 34 * -0.85, hy + ca * 34 * 0.42 - sa * 34];
    const side = [-sa * 0.85 * 7, sa * 0.42 * 7 + ca * 7];
    const mid = [hx + ca * 8 * -0.85, hy + ca * 8 * 0.42 - sa * 8];
    out += `<polygon points="${[mid, tip, [tip[0] + side[0], tip[1] + side[1]], [mid[0] + side[0], mid[1] + side[1]]].map(p => p.map(f2).join(',')).join(' ')}" fill="rgba(250,244,230,.92)" stroke="#8B5631" stroke-width="0.8"/>`;
    out += ln([hx, hy], tip, WOOD_DARK.right, 1.6);
    for (let t = 0.35; t < 1; t += 0.2) out += ln([hx + (tip[0] - hx) * t, hy + (tip[1] - hy) * t], [hx + (tip[0] - hx) * t + side[0], hy + (tip[1] - hy) * t + side[1]], '#B98552', 0.5);
  }
  return out + dot(hx, hy, 2.6, WOOD_DARK.right);
})(), { x: -110, y: -150, w: 110, h: 110 });

/* ---------- Palier VI : Domaine ---------- */
function estate(skin) {
  const roof = roofOf(skin, ROOF_RED);
  const u0 = -1.38, u1 = -0.45, v0 = -1.38, v1 = -0.55;
  const [sx, sy] = P(0.15, -1.15, 64);
  return big(
    bigShadow(88, 42)
    + (skin ? backFence(skin) : '')
    // Ferme de maître : murs crème, volets verts, toit rouge, cheminée
    + box(u0, v0, u1, v1, 0, 32, PLASTER)
    + shuttered(-1.25, -1.08, v1, 8, 18, '#5E9A62') + shuttered(-0.8, -0.63, v1, 8, 18, '#5E9A62') + shuttered(-1.05, -0.88, v1, 22, 30, '#5E9A62')
    + face([[-0.98, v1, 0], [-0.86, v1, 0], [-0.86, v1, 14], [-0.98, v1, 14]], '#8C4B32')
    + chimney(-1.2, -1.2, 36, 66)
    + gable(u0, v0, u1, v1, 32, 22, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.08)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, 32, 22, 0.08)
    // Silo à coupole et grange
    + cylinder(0.15, -1.15, 0, 64, 0.22, { top: '#D7DDE3', left: '#C2CAD2', right: '#8E99A4' }, 'es-silo')
    + [12, 26, 40, 54].map(z => { const [x, y] = P(0.15, -1.15, z); return `<path d="M${f2(x - 14)},${f2(y)} A14,7 0 0 0 ${f2(x + 14)},${f2(y)}" fill="none" stroke="#7C8894" stroke-width="0.7"/>`; }).join('')
    + `<path d="M${f2(sx - 14)},${f2(sy)} Q${f2(sx)},${f2(sy - 20)} ${f2(sx + 14)},${f2(sy)} Z" fill="#B13A31" stroke="${OUT}" stroke-width="0.8"/>`
    + (HIVER ? snowCap('es-neige', `M${f2(sx - 14)},${f2(sy)} Q${f2(sx)},${f2(sy - 20)} ${f2(sx + 14)},${f2(sy)} Z`, sx, sy - 10, 13, 5.5) : '')
    + barn(0.45, -1.35, 1.35, -0.55, 24, skin)
    + bed(-1.3, 0.05, -0.05, 1.35, 'veg', 4) + bed(0.15, 0.05, 1.3, 1.35, 'wheat', 4)
    + hayBale(-0.2, -0.3) + hayBale(0.05, -0.3)
    + tractor(0.62, -0.22)
  );
}
// Tracteur rouge (vu de côté, avancé vers l'avant droit)
function tractor(u, v) {
  const [x, y] = P(u, v, 0);
  return ell(x + 2, y + 1, 16, 4, 'rgba(40,55,20,.25)')
    + box(u - 0.16, v - 0.08, u + 0.14, v + 0.08, 6, 14, { top: '#F08A6E', left: '#E2463A', right: '#B13A31' })
    + box(u - 0.16, v - 0.08, u - 0.02, v + 0.08, 14, 24, { top: 'rgba(220,240,250,.7)', left: 'rgba(190,220,235,.6)', right: 'rgba(150,190,210,.6)' }, ' stroke="#B13A31" stroke-width="1"')
    + `<rect x="${f2(P(u + 0.1, v - 0.02, 16)[0] - 1)}" y="${f2(P(u + 0.1, v - 0.02, 16)[1] - 6)}" width="2" height="7" fill="#3D3A36"/>`
    + `<circle cx="${f2(P(u - 0.1, v + 0.09, 8)[0])}" cy="${f2(P(u - 0.1, v + 0.09, 8)[1])}" r="7.5" fill="#2A2724"/><circle cx="${f2(P(u - 0.1, v + 0.09, 8)[0])}" cy="${f2(P(u - 0.1, v + 0.09, 8)[1])}" r="3.4" fill="${GOLD.left}"/>`
    + `<circle cx="${f2(P(u + 0.1, v + 0.09, 4)[0])}" cy="${f2(P(u + 0.1, v + 0.09, 4)[1])}" r="4.2" fill="#2A2724"/><circle cx="${f2(P(u + 0.1, v + 0.09, 4)[0])}" cy="${f2(P(u + 0.1, v + 0.09, 4)[1])}" r="1.8" fill="${GOLD.left}"/>`;
}

/* ---------- Palier VII : Jardin de la Licorne ---------- */
const UNICORN = [0.45, 0.45];
function unicornGarden(skin) {
  const [ax, ay] = P(-0.35, 0.35, 0);
  const flower = (u, v, s, c) => {
    const [x, y] = P(u, v, 0);
    return ln([x, y], [x + 2, y - 30 * s], '#5DAA45', 2 * s) + `<ellipse cx="${f2(x - 5 * s)}" cy="${f2(y - 12 * s)}" rx="${f2(5 * s)}" ry="${f2(2 * s)}" fill="#6DB04F" transform="rotate(-25 ${f2(x - 5 * s)} ${f2(y - 12 * s)})"/>`
      + [0, 1, 2, 3, 4, 5].map(k => { const a = (k / 6) * Math.PI * 2; return ell(x + 2 + Math.cos(a) * 6 * s, y - 32 * s + Math.sin(a) * 4 * s, 4.6 * s, 3 * s, c); }).join('') + dot(x + 2, y - 32 * s, 3.4 * s, '#FFE07A');
  };
  return big(
    bigShadow(88, 42)
    + (skin ? backFence(skin) : '')
    + bed(-1.3, -1.3, 1.3, -0.4, 'flowers', 4)
    + appleTree(-1.05, -0.95, 1.2).replace(/#E2463A/g, GOLD.left)
    + flower(0.95, -0.75, 1.4, '#F7A8C8') + flower(1.15, -0.2, 1.1, '#A98ADB') + flower(-1.15, 0.0, 1.2, '#FFD45E')
    // Arche d'arc-en-ciel en treillage fleuri au-dessus de l'allée
    + ['#E2574C', '#F2994A', '#F2C04B', '#6DB04F', '#5C83C2', '#A98ADB'].map((c, k) => `<path d="M${f2(ax - 22 + k * 2)},${f2(ay)} A${f2(22 - k * 2)},${f2(30 - k * 2)} 0 0 1 ${f2(ax + 22 - k * 2)},${f2(ay)}" fill="none" stroke="${c}" stroke-width="2.2"/>`).join('')
    + pavedPath([-0.35, -0.3], [-0.35, 1.45], 0.24)
    + bed(0.0, 0.85, 1.3, 1.35, 'flowers', 2)
    + flowerBed(-0.95, 0.85, 0.2, ['#F7A8C8', '#FFFFFF', '#A98ADB'])
  );
}
// Licorne qui broute : la tête se baisse et se relève, la queue arc-en-ciel ondule (6 images)
const unicorn = f => sprite((() => {
  const [x, y] = P(...UNICORN, 0);
  const graze = f >= 2 && f <= 4 ? 1 : 0;
  const tail = [0, 1.5, 2.5, 1.5, 0, -1][f];
  const hx = x - 15 - graze * 2;
  const hy = y - 24 + graze * 9;
  return ell(x, y + 1, 16, 3.6, 'rgba(40,55,20,.25)')
    + [[-9, 0], [-5, 0.8], [6, 0], [10, 0.8]].map(([dx, dy]) => ln([x + dx, y - 12], [x + dx, y + dy], '#F1EEF6', 2.4) + `<rect x="${f2(x + dx - 1.4)}" y="${f2(y + dy - 1)}" width="2.8" height="1.8" fill="${GOLD.left}"/>`).join('')
    + ['#E2574C', '#F2C04B', '#5C83C2', '#A98ADB'].map((c, k) => `<path d="M${f2(x + 13)},${f2(y - 17)} q${f2(7 + tail)},${f2(4 + k * 1.5)} ${f2(4 + tail)},${f2(13 + k)}" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join('')
    + ell(x, y - 16, 15, 7.5, '#FFFFFF', ' stroke="rgba(150,140,170,.5)" stroke-width="0.7"') + ell(x + 2, y - 12, 11, 2.6, '#EEEAF6')
    + `<path d="M${f2(x - 10)},${f2(y - 20)} L${f2(hx + 3)},${f2(hy - 1)} L${f2(hx + 5)},${f2(hy + 5)} L${f2(x - 8)},${f2(y - 12)} Z" fill="#FFFFFF"/>`
    + ['#E2574C', '#F2C04B', '#5C83C2', '#A98ADB'].map((c, k) => `<path d="M${f2(x - 10 + k * 1.2)},${f2(y - 22 + k * 0.6)} q${f2(-4)},${f2(-2)} ${f2(hx + 6 - x + 10 - k)},${f2(hy - y + 20 + k * 0.4)}" stroke="${c}" stroke-width="1.6" fill="none"/>`).join('')
    + `<ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="6" ry="4" fill="#FFFFFF" stroke="rgba(150,140,170,.5)" stroke-width="0.7" transform="rotate(${graze ? 35 : 15} ${f2(hx)} ${f2(hy)})"/>`
    + `<path d="M${f2(hx + 1)},${f2(hy - 3)} L${f2(hx - 2 - graze * 4)},${f2(hy - 13 + graze * 3)} L${f2(hx + 3)},${f2(hy - 4)} Z" fill="${GOLD.left}" stroke="${GOLD.right}" stroke-width="0.5"/>`
    + dot(hx - 1, hy - 1, 0.9, '#2A2420') + `<path d="M${f2(hx + 3)},${f2(hy - 4)} l2,-3 l1,3 Z" fill="#FFFFFF"/>`;
})(), { x: -50, y: -80, w: 90, h: 70 });
const sparkles = f => sprite((() => {
  let out = '';
  for (let k = 0; k < 9; k++) {
    const t = ((f / 6) + k / 9) % 1;
    const [x, y] = P(-1.2 + (k * 0.31) % 2.4, -1.0 + (k * 0.53) % 2.2, 10 + t * 50);
    out += `<path d="M${f2(x)},${f2(y - 3)} L${f2(x + 0.8)},${f2(y)} L${f2(x)},${f2(y + 3)} L${f2(x - 0.8)},${f2(y)} Z" fill="${k % 2 ? '#FFF2B0' : '#FFFFFF'}" opacity="${f2(1 - t)}"/>`;
  }
  return out;
})(), { x: -110, y: -130, w: 220, h: 170 });

export const POTAGER_TIERS = [
  { make: orchard },
  { make: farm },
  { make: windmill, anims: [{ key: 'sails', n: 8, fps: 6, frame: millSails, tint: true }] },
  { make: estate, smoke: [[-1.2, -1.2, 69]], lights: [[-1.16, -0.55, 13, 14], [-0.71, -0.55, 13, 14]] },
  { make: unicornGarden, anims: [{ key: 'unicorn', n: 6, fps: 3, frame: unicorn }, { key: 'sparkles', n: 6, fps: 5, frame: sparkles }], lights: [[-1.05, -0.95, 30, 22]] }
];
