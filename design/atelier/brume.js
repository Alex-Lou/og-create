// Brume, l'esprit de la brume : un feu follet, deux yeux et rien d'autre (fidèle à src/world/brume.js), au trait de la
// troupe. Repère 40 × 48 : le bas rond de la flamme est centré en (20, 32), l'ombre au sol est dessinée par le jeu.
// Huit stades (HISTOIRE.md § 13) et leurs variantes ; flottement en 4 images ; expressions par les yeux seulement.
const { P, E, L, eyes, drop, zee, r2 } = require('./troupe');

const NAVY = '#1D3557';
// Couleurs par stade : cœur, flamme, bord, trait, halo (r,g,b)
const STAGES = {
  s0: { label: 'Stade 0 · pâle et tremblante', core: '#FFFFFF', flame: '#EEF5F7', edge: '#B8CDD6', line: '#6E8792', halo: '200,220,230', r: 8, tremble: true },
  s1: { label: 'Stade 1 · bleu clair', core: '#FFFFFF', flame: '#BFF0FF', edge: '#5CC8F0', line: '#23647F', halo: '120,210,255' },
  s2: { label: 'Stade 2 · turquoise', core: '#FFFFFF', flame: '#B4F5E6', edge: '#2EC4B6', line: '#16685F', halo: '90,220,200' },
  s3: { label: 'Stade 3 · étoiles', core: '#FFFFFF', flame: '#E6F1FF', edge: '#93B6E6', line: '#40618F', halo: '190,210,255', orbit: 'star' },
  s4: { label: 'Stade 4 · feuille', core: '#FFFFFF', flame: '#E2F6E8', edge: '#7FCB9A', line: '#2F7048', halo: '170,230,190', inner: 'leaf' },
  s5: { label: 'Stade 5 · cœur ambré', core: '#FFFDF2', flame: '#FFE7A3', edge: '#F2B23B', line: '#8A5A12', halo: '255,200,90', inner: 'heart' },
  s6: { label: 'Stade 6 · runes', core: '#FFF8F0', flame: '#FFD6B0', edge: '#E8845A', line: '#8A3A1E', halo: '255,170,120', orbit: 'rune' },
  s6pale: { label: 'Stade 6 · pâlie', core: '#F4F4F4', flame: '#DCDDE0', edge: '#A6A8AE', line: '#5E6066', halo: '190,190,195', orbit: 'rune', dim: true, r: 8.4 },
  s6phenix: { label: 'Stade 6 · Phénix', core: '#FFFBEA', flame: '#FFCF6E', edge: '#F0622E', line: '#8A2410', halo: '255,150,70', wings: true },
  s7: { label: 'Stade 7 · couronne dorée', core: '#FFFDF2', flame: '#FFE08A', edge: '#F2A33B', line: '#8A5212', halo: '255,205,110', crown: true },
  s7soleil: { label: 'Stade 7 · soleil du phare', core: '#FFFFF4', flame: '#FFEB99', edge: '#FFB734', line: '#9A5A0A', halo: '255,215,120', sun: true },
  pret: { label: 'Récompense prête (« ! »)', core: '#FFFDF2', flame: '#FFE7A3', edge: '#F2B23B', line: '#8A5A12', halo: '255,200,90', badge: true }
};

// Contour de la flamme (même courbe que le jeu) : goutte ronde en bas, pointe qui vacille
function flamePath(x, y, r, sway, k = 1) {
  const top = r * 2.05 * k;
  return `M${r2(x)},${r2(y + r)} C${r2(x + r * 1.3)},${r2(y + r)} ${r2(x + r * 1.15)},${r2(y - r * 0.45)} ${r2(x + sway)},${r2(y - top)} `
    + `C${r2(x - r * 1.15)},${r2(y - r * 0.45)} ${r2(x - r * 1.3)},${r2(y + r)} ${r2(x)},${r2(y + r)} Z`;
}
const star4 = (x, y, s, fill) => P(`M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.22)},${r2(y - s * 0.22)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.22)},${r2(y + s * 0.22)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.22)},${r2(y + s * 0.22)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.22)},${r2(y - s * 0.22)} ${r2(x)},${r2(y - s)} Z`, fill, 0.6);
// Trois runes simples (traits)
const RUNES = ['M-1,-1.6 L-1,1.6 M-1,-1.6 L1,-0.4 L-1,0.6 L1,1.6', 'M0,-1.6 L0,1.6 M-1.2,-1.4 L0,-0.2 L1.2,-1.4', 'M-1.2,1.6 L0,-1.6 L1.2,1.6 M-0.7,0.2 L0.7,0.2'];
const rune = (x, y, i, color) => `<path d="${RUNES[i % 3]}" transform="translate(${r2(x)} ${r2(y)})" fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>`;
// Petite feuille, petit cœur, couronne
const leaf = (x, y, rot) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${P('M0,-3.6 Q2.4,0 0,3.6 Q-2.4,0 0,-3.6 Z', '#4FB062', 0.7)}${L([0, -2.6], [0, 2.6], '#2F7A3F', 0.5)}</g>`;
const heart = (x, y, s) => P(`M${r2(x)},${r2(y + s * 1.1)} C${r2(x - s * 1.8)},${r2(y - s * 0.1)} ${r2(x - s * 0.9)},${r2(y - s * 1.4)} ${r2(x)},${r2(y - s * 0.5)} C${r2(x + s * 0.9)},${r2(y - s * 1.4)} ${r2(x + s * 1.8)},${r2(y - s * 0.1)} ${r2(x)},${r2(y + s * 1.1)} Z`, '#F29A3B', 0.7);
const crown = (x, y, rot) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">`
  + P('M-4,1.4 L-4.4,-2.2 L-2,-0.4 L0,-3 L2,-0.4 L4.4,-2.2 L4,1.4 Z', '#F6C744', 0.8) + E(0, -3, 0.7, 0.7, '#E8584A', 0.5) + E(-4.4, -2.2, 0.5, 0.5, '#FFFFFF', 0.4) + E(4.4, -2.2, 0.5, 0.5, '#FFFFFF', 0.4) + '</g>';

// Une image de Brume. stage : clé de STAGES ; n : 0..3 ; expr : expression (yeux et signes seulement)
function brumeFrame(stageKey, n, expr = 'neutre') {
  const st = STAGES[stageKey];
  const r = st.r || 9;
  const ph = (n % 4) / 4; // phase du cycle
  const sway = Math.sin(ph * Math.PI * 2) * r * 0.32;
  const jit = st.tremble ? [[0, 0], [0.5, -0.2], [-0.4, 0.2], [0.3, 0.3]][n % 4] : [0, 0];
  const bob = [0, -0.6, -1, -0.6][n % 4];
  const x = 20 + jit[0], y = 32 + bob + jit[1];
  let back = '', front = '';
  // halo doux
  const id = `bh${stageKey}${n}`;
  back += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${st.halo})" stop-opacity="${st.dim ? 0.25 : 0.55}"/><stop offset="1" stop-color="rgb(${st.halo})" stop-opacity="0"/></radialGradient></defs>`
    + `<circle cx="${x}" cy="${r2(y - r * 0.5)}" r="${st.sun ? 20 : 17}" fill="url(#${id})"/>`;
  // ailes de flamme (Phénix) ; rayons (soleil)
  if (st.wings) {
    const flap = [0, -1.6, -2.4, -1.6][n % 4];
    for (const m of [-1, 1]) back += `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P(`M3,-2 Q12,${r2(-12 + flap)} 18,${r2(-8 + flap)} Q14,-6 16,${r2(-3 + flap * 0.4)} Q11,-3 13,1 Q8,-1 5,3 Z`, st.edge, 1) + P(`M4,-1.4 Q11,${r2(-9 + flap)} 15,${r2(-7 + flap)} Q11,-4 12,-1 Q8,-1.6 5,1.6 Z`, st.flame, 0) + '</g>';
    back += P(`M${r2(x - 2)},${r2(y + r - 1)} Q${r2(x - 4)},${r2(y + r + 4.6)} ${r2(x - 1)},${r2(y + r + 6.2)} Q${x},${r2(y + r + 3.2)} ${r2(x + 1)},${r2(y + r + 6.2)} Q${r2(x + 4)},${r2(y + r + 4.6)} ${r2(x + 2)},${r2(y + r - 1)} Z`, st.edge, 1);
  }
  if (st.sun) {
    const rot = n * 11.25;
    for (let i = 0; i < 12; i++) {
      const a = ((i * 30 + rot) * Math.PI) / 180, rr = i % 2 ? 13.5 : 15.5;
      back += P(`M${r2(x + Math.cos(a - 0.12) * 10)},${r2(y - 4 + Math.sin(a - 0.12) * 10)} L${r2(x + Math.cos(a) * rr)},${r2(y - 4 + Math.sin(a) * rr)} L${r2(x + Math.cos(a + 0.12) * 10)},${r2(y - 4 + Math.sin(a + 0.12) * 10)} Z`, st.edge, 0.8);
    }
  }
  // orbite (étoiles, runes) : la moitié arrière passe derrière la flamme
  if (st.orbit) {
    for (let i = 0; i < 3; i++) {
      const a = (ph + i / 3) * Math.PI * 2;
      const ox = x + Math.cos(a) * 14, oy = y - 6 + Math.sin(a) * 4.4;
      const g = st.orbit === 'star' ? star4(ox, oy, 2.5, '#FFF6C8') : `<g opacity="${st.dim ? 0.45 : 1}">${E(ox, oy, 2.1, 2.1, `rgb(${st.halo})`, 0).replace('fill=', 'fill-opacity="0.35" fill=')}${rune(ox, oy, i, st.line)}</g>`;
      if (Math.sin(a) < 0) back += g; else front += g;
    }
  }
  // flamme : bord, flamme, cœur clair (aplats), contour du stade
  let body;
  if (st.sun) {
    body = E(x, y - 4, 10, 10, st.edge, 1.1).replace(/stroke="[^"]+"/, `stroke="${st.line}"`) + E(x, y - 4, 8, 8, st.flame, 0) + E(x - 1, y - 2, 5, 5, st.core, 0);
  } else {
    const outer = flamePath(x, y, r, sway);
    body = P(outer, st.edge, 1.1).replace(/stroke="[^"]+"/, `stroke="${st.line}"`)
      + P(flamePath(x, y + r * 0.12, r * 0.8, sway * 0.8, 0.95), st.flame, 0)
      + P(flamePath(x, y + r * 0.38, r * 0.5, sway * 0.6, 0.85), st.core, 0);
  }
  // ce qui vit dans la flamme
  const cy = st.sun ? y - 9 : y - r * 0.95;
  if (st.inner === 'leaf') body += leaf(x + sway * 0.3, cy, [-18, 0, 18, 0][n % 4]);
  if (st.inner === 'heart') body += heart(x + sway * 0.25, cy, 2.1 + (n % 2) * 0.2);
  if (st.crown) body += crown(x + sway * 0.4, y - r * 1.2, sway * 1.6);
  // étincelles qui montent
  let sparks = '';
  for (let i = 0; i < 3; i++) {
    const p = (ph + i / 3) % 1;
    sparks += E(x + Math.sin((ph + i) * 4.2) * r * 0.9, y - r * (1.3 + p * 1.8), 0.9 - p * 0.5, 0.9 - p * 0.5, `rgb(${st.halo})`, 0).replace('fill=', `fill-opacity="${r2(0.95 - p * 0.7)}" fill=`);
  }
  // yeux (bleu nuit) et signes : deux yeux, rien d'autre
  const ey = st.sun ? y - 4 : y - r * 0.05;
  const list = [[x - 3.2, ey, 1.35], [x + 3.2, ey, 1.35]];
  const mode = { neutre: n === 3 ? 'blink' : 'open', content: 'open', rire: 'joy', surpris: 'big', triste: 'sad', fache: 'angry', gene: 'squeeze', endormi: 'blink' }[expr];
  let face = eyes(list, mode, 1.9, NAVY).replace(/stroke="#3C2819"/g, `stroke="${NAVY}"`);
  if (['content', 'rire', 'gene'].includes(expr)) face = E(x - 5.4, ey + 2.6, 1.4, 0.8, '#F7A8B0', 0) + E(x + 5.4, ey + 2.6, 1.4, 0.8, '#F7A8B0', 0) + face;
  if (expr === 'gene') face += drop(x + r + 2.6, y - r * 0.9 + (n % 2) * 0.8, 1.4, '#A9DCFF');
  if (expr === 'triste') face += drop(x - 4.2, ey + 3 + (n % 2) * 1.2, 0.9, '#A9DCFF');
  if (expr === 'fache') {
    const ax = x + 9.6, ay = y - r * 1.7, a = 0.5, b = n % 2 ? 2 : 1.7;
    const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r2(ax + i * a)},${r2(ay + j * b)} Q${r2(ax + i * a)},${r2(ay + j * a)} ${r2(ax + i * b)},${r2(ay + j * a)}`).join(' ');
    face += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
  }
  if (expr === 'endormi') face += n % 2 ? zee(x + 7, y - r * 2, 2) + zee(x + 10, y - r * 2.5, 2.6) : zee(x + 6.4, y - r * 1.8, 1.8) + zee(x + 9.2, y - r * 2.3, 2.4);
  // pastille « ! » : la récompense attend
  let badge = '';
  if (st.badge) {
    const bx = x + r * 1.15, by = y - r * 2 - (n % 2) * 0.8;
    badge = E(bx, by, 3.2, 3.2, '#E8584A', 1).replace(/stroke="[^"]+"/, 'stroke="#7A2418"') + `<path d="M${r2(bx)},${r2(by - 1.8)} L${r2(bx)},${r2(by + 0.5)}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>` + E(bx, by + 1.6, 0.6, 0.6, '#FFFFFF', 0);
  }
  return back + body + front + sparks + face + badge;
}

const svgB = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${40 * scale}" height="${48 * scale}" viewBox="0 0 40 48">${body}</svg>`;
module.exports = { STAGES, brumeFrame, svgB };
