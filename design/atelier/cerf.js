// Le grand cerf blanc d'Anya : de profil, tourné vers la droite (le miroir donne la gauche), comme les bêtes du jeu.
// Bois dorés qui luisent, fleurs dans les andouillers. Repère 80 × 80, sabots au sol en y = 77.
// Images : marche 1 et 2, repos (couché), et un clignement.
const { OUT, P, E, L, r2 } = require('./troupe');

const C = { coat: '#F7F4EC', coatS: '#D9D4C6', belly: '#FFFFFF', antler: '#F2C94C', antlerS: '#C99A2E', hoof: '#8A7A6A', nose: '#5A4A44', eye: '#2A2420', petal: '#F7C6D9', glow: '255,225,140' };

const limbL = (a, b, w, fill) => `<path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${OUT}" stroke-width="${w + 2.2}" stroke-linecap="round"/><path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
const tine = (d, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${C.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const flower = (x, y, r) => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.75, r * 0.75, C.petal, 0.4)).join('') + E(x, y, r * 0.5, r * 0.5, '#FFE7A3', 0.3);

// Tête de profil (museau à droite) ; hx, hy : centre du crâne
function head(hx, hy, blink) {
  return `<g transform="translate(${hx} ${hy}) scale(1.16) translate(${-hx} ${-hy})">${headInner(hx, hy, blink)}</g>`;
}
function headInner(hx, hy, blink) {
  let s = '';
  // bois dorés et lueur
  const ant = `M${hx - 1},${hy - 5} Q${hx - 4},${hy - 14} ${hx - 2},${hy - 22} M${hx - 3},${hy - 12} Q${hx - 9},${hy - 14} ${hx - 11},${hy - 19} M${hx - 2.4},${hy - 17.6} Q${hx + 2},${hy - 20} ${hx + 3},${hy - 24}`
    + ` M${hx + 2},${hy - 5} Q${hx + 4},${hy - 12} ${hx + 8},${hy - 17} M${hx + 4.4},${hy - 10.4} Q${hx + 9},${hy - 10} ${hx + 11},${hy - 13}`;
  s += `<path d="${ant}" fill="none" stroke="rgb(${C.glow})" stroke-width="5" stroke-linecap="round" opacity="0.35"/>` + tine(ant, 1.6);
  s += flower(hx - 11, hy - 19, 1.1) + flower(hx + 3, hy - 24, 1) + flower(hx + 11, hy - 13, 0.9);
  // oreille, crâne, museau
  s += `<g transform="rotate(-35 ${hx - 4} ${hy - 3})">${P(`M${hx - 4},${hy - 3} Q${hx - 9},${hy - 6} ${hx - 12},${hy - 3} Q${hx - 9},${hy} ${hx - 4},${hy - 1} Z`, C.coat)}${E(hx - 8.4, hy - 3, 2, 0.8, '#F2C6C0', 0)}</g>`;
  s += E(hx, hy, 7.4, 6.4, C.coat) + E(hx + 6.4, hy + 3, 4.2, 3.3, C.coat) + E(hx + 9.6, hy + 2.2, 1.2, 1, C.nose, 0.6);
  s += E(hx - 1, hy + 2.6, 2.2, 1.2, '#F6C2C2', 0);
  s += blink ? P(`M${hx + 0.4},${hy - 0.8} Q${hx + 1.8},${hy + 0.6} ${hx + 3.2},${hy - 0.8}`, 'none', 0.9)
    : E(hx + 1.8, hy - 0.8, 1.3, 1.7, C.eye, 0) + E(hx + 2.3, hy - 1.6, 0.5, 0.5, '#FFFFFF', 0) + L([hx + 3.2, hy - 2.4], [hx + 4.2, hy - 3.2], OUT, 0.5);
  return s;
}

// pose : 'marche' (n = 0 | 1), 'repos' (couché), blink : yeux fermés
function cerfFrame(pose, n = 0, blink = false) {
  let s = `<defs><radialGradient id="cg${pose}${n}${blink ? 1 : 0}"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="0.4"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="40" cy="44" rx="40" ry="36" fill="url(#cg${pose}${n}${blink ? 1 : 0})"/>`;
  if (pose === 'repos') {
    // couché : pattes repliées, tête haute
    s += E(40, 70, 19, 9.4, C.coat) + `<path d="M24,72 Q40,80 56,72" fill="none" stroke="${C.coatS}" stroke-width="2"/>` + E(40, 70, 19, 9.4, 'none');
    s += E(27, 76, 4.4, 2, C.coat, 1) + E(52, 76.2, 4.4, 2, C.coat, 1) + E(22, 66.6, 2.6, 2.2, C.belly, 0.8);
    s += P('M50,66 Q54,52 58,44 L64,46 Q60,58 57,68 Z', C.coat) + head(60, 40, blink);
    return s;
  }
  const step = n ? 1 : -1;
  const by = n ? -0.6 : 0;
  // pattes : la paire éloignée plus sombre, derrière
  s += limbL([27, 58 + by], [27 - step * 3, 76], 3, C.coatS) + limbL([49, 58 + by], [49 + step * 3, 76], 3, C.coatS);
  s += E(27 - step * 3, 76.6, 2, 1.2, C.hoof, 0.8) + E(49 + step * 3, 76.6, 2, 1.2, C.hoof, 0.8);
  // corps, ventre, queue, taches argentées
  s += P(`M18,${50 + by} Q20,${41 + by} 36,${40 + by} Q50,${40 + by} 54,${48 + by} Q55,${60 + by} 44,${61 + by} L26,${61 + by} Q17,${59 + by} 18,${50 + by} Z`, C.coat);
  s += P(`M24,${58 + by} Q36,${62 + by} 48,${58 + by}`, 'none', 0).replace('stroke="none"', `stroke="${C.belly}" stroke-width="2.4" stroke-linecap="round"`);
  s += E(30, 46 + by, 1.6, 1.1, C.coatS, 0) + E(36, 44.4 + by, 1.3, 0.9, C.coatS, 0) + E(40.6, 47 + by, 1.4, 1, C.coatS, 0);
  s += P(`M19,${46 + by} Q14,${44 + by} 15.6,${49 + by} Q18,${49 + by} 19.4,${48.6 + by} Z`, C.belly, 0.9);
  // pattes proches, devant
  s += limbL([31, 58 + by], [31 + step * 3, 76], 3.2, C.coat) + limbL([46, 58 + by], [46 - step * 3, 76], 3.2, C.coat);
  s += E(31 + step * 3, 76.6, 2.1, 1.3, C.hoof, 0.8) + E(46 - step * 3, 76.6, 2.1, 1.3, C.hoof, 0.8);
  // cou et tête
  s += P(`M46,${46 + by} Q50,${36 + by} 54,${28 + by} L61,${31 + by} Q57,${42 + by} 54,${52 + by} Z`, C.coat) + head(58, 24 + by, blink);
  return s;
}

const svgC = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${92 * scale}" viewBox="0 -12 80 92">${body}</svg>`;
module.exports = { cerfFrame, svgC };
