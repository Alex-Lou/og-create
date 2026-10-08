// Les portraits HD des personnages, pour les dialogues : le buste de face, cadré sur le visage (38 × 38, affiché en 96 px,
// déclaré HD fois plus grand), au trait affiné ; le visage (sourcils, yeux, bouche, petits signes) est redessiné ici,
// plus fin que sur l'île, en 21 expressions, et animé en SMIL (clignement, larmes, cœurs, étoiles, Zzz…) ; sans
// animation (canvas), on voit une image fixe. Les bulles d'émotion (!, ?, …, note, ampoule, orage) se posent par-dessus.
// Marche pour tout personnage dessiné par frame() (troupe.js) : les maîtres, l'avatar du joueur quel que soit son choix.
const T = require('./troupe');
let G = null; // la géométrie du visage (troupe.js, l'expression « vide »)
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 0.7) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const thin = (s, k) => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${f(w * k)}"`);

// ——— les yeux ———
let IR = 'pi', SKIN = '#F2C9A0'; // id du dégradé de l'iris
const lash = (x, y, rx, ry, k) => P(`M${f(x - rx - 0.25)},${f(y - ry * 0.3)} Q${f(x)},${f(y - ry - 0.8)} ${f(x + rx + 0.25)},${f(y - ry * 0.3)}`, 'none', 0.8)
  + P(`M${f(x - k * (rx + 0.15))},${f(y - ry * 0.45)} L${f(x - k * (rx + 0.95))},${f(y - ry * 0.85)}`, 'none', 0.6);
const shine = (x, y, rx, ry) => E(x + 0.45, y - ry * 0.4, 0.68, 0.74, WHITE) + E(x - 0.5, y + ry * 0.45, 0.3, 0.3, WHITE)
  + P(`M${f(x - rx * 0.62)},${f(y + ry * 0.5)} Q${f(x)},${f(y + ry * 0.95)} ${f(x + rx * 0.62)},${f(y + ry * 0.5)}`, 'none', 0) .replace('fill="none"', `fill="none" stroke="#B88468" stroke-width="0.45" opacity=".85"`);
const iris = (x, y, rx, ry) => E(x, y, rx, ry, `url(#${IR})`);
const EYE = {
  open: (x, y, rx, ry, k, o = {}) => iris(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + shine(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + lash(x, y, rx, ry, k),
  blink: (x, y, rx, ry, k) => P(`M${f(x - rx - 0.25)},${f(y + 0.3)} Q${f(x)},${f(y + 1.7)} ${f(x + rx + 0.25)},${f(y + 0.3)}`, 'none', 0.8) + P(`M${f(x - k * (rx + 0.2))},${f(y + 0.3)} L${f(x - k * (rx + 0.9))},${f(y - 0.2)}`, 'none', 0.6),
  joy: (x, y, rx) => P(`M${f(x - rx - 0.3)},${f(y + 1)} Q${f(x)},${f(y - 1.5)} ${f(x + rx + 0.3)},${f(y + 1)}`, 'none', 0.85),
  big: (x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + iris(x + (o.dx || 0), y + 0.2, rx * 0.6, ry * 0.55) + E(x + (o.dx || 0) + 0.3, y - 0.4, 0.32, 0.34, WHITE),
  tiny: (x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + E(x + (o.dx || 0), y + 0.3, 0.42, 0.52, OUT),
  squeeze: (x, y, rx, ry, k) => P(`M${f(x - k * 1.4)},${f(y - 1.5)} L${f(x + k * 1.2)},${y} L${f(x - k * 1.4)},${f(y + 1.5)}`, 'none', 0.85),
  lid: (x, y, rx, ry, k, o) => {
    // paupière inclinée : tO coin extérieur, tI coin intérieur (positif : plus bas)
    const top = y - 0.6, yl = f(top + (k > 0 ? o.tO : o.tI)), yr = f(top + (k > 0 ? o.tI : o.tO));
    const d = `M${f(x - rx)},${yl} L${f(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${f(x - rx)},${yl} Z`;
    return `<path d="${d}" fill="url(#${IR})"/>` + E(x + 0.45, y + 0.7, 0.42, 0.42, WHITE) + (o.glint ? E(x - 0.4, y + 0.2, 0.28, 0.28, WHITE) : '')
      + P(`M${f(x - rx - 0.45)},${f(yl - (yr - yl) * 0.12)} L${f(x + rx + 0.45)},${f(yr + (yr - yl) * 0.12)}`, 'none', 0.85);
  },
  sleepy: (x, y, rx, ry, k, o = {}) => {
    const top = y + 0.3;
    return `<path d="M${f(x - rx)},${f(top)} Q${x},${f(top - 0.9)} ${f(x + rx)},${f(top)} A${rx} ${f(ry * 0.85)} 0 0 1 ${f(x - rx)},${f(top)} Z" fill="url(#${IR})"/>` + E(x + 0.4, top + 0.9, 0.34, 0.34, WHITE)
      + P(`M${f(x - rx - 0.5)},${f(top + 0.3)} Q${x},${f(top - 1.1)} ${f(x + rx + 0.5)},${f(top + 0.3)}`, 'none', 0.85)
      + (o.cerne ? P(`M${f(x - rx * 0.8)},${f(y + ry + 0.5)} Q${x},${f(y + ry + 1.3)} ${f(x + rx * 0.8)},${f(y + ry + 0.5)}`, 'none', 0).replace('fill="none"', 'fill="none" stroke="#A47C9C" stroke-width="0.55" opacity=".8"') : '');
  },
  star: (x, y, rx, ry, k, o = {}) => { const r = ry * 1.05 * (o.s || 1); let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; d += `${i ? 'L' : 'M'}${f(x + q * Math.cos(a))},${f(y + q * Math.sin(a))}`; } return P(d + ' Z', '#FFD54A', 0.6) + E(x - r * 0.25, y - r * 0.3, r * 0.18, r * 0.14, WHITE); },
  heart: (x, y, rx, ry, k, o = {}) => { const s = 1.15 * (o.s || 1); return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${P('M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z', '#F0607A', 0.55)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`; },
  spiral: (x, y, rx, ry, k, o = {}) => { let d = ''; for (let i = 0; i <= 28; i++) { const a = i * 0.42 + (o.rot || 0), r = 0.1 + i * 0.065; d += `${i ? 'L' : 'M'}${f(x + r * Math.cos(a))},${f(y + r * 1.2 * Math.sin(a))}`; } return E(x, y, rx + 0.3, ry + 0.15, WHITE, 0.6) + P(d, 'none', 0.55); },
  line: (x, y, rx, ry, k) => P(`M${f(x - rx - 0.2)},${f(y + 0.2 - k * 0.3)} L${f(x + rx + 0.2)},${f(y + 0.2 + k * 0.3)}`, 'none', 0.85)
};

// ——— les sourcils : décalage du bout intérieur, du bout extérieur, cambrure ———
const BROW = {
  neutre: [0, 0.1, -0.6], content: [-0.3, -0.2, -0.7], rire: [-0.6, -0.4, -0.8], surpris: [-1.4, -1.1, -1], triste: [-1.1, 0.6, 0],
  fache: [1.1, -0.6, 0], gene: [-0.7, 0.3, -0.2], endormi: [0.4, 0.4, -0.3],
  emu: [-1, 0.2, -0.5], effraye: [-1.7, -0.4, -1.1], boude: [1, -0.1, 0.1], determine: [1.2, -0.9, 0.2],
  emerveille: [-1.3, -1, -1], adore: [-0.9, -0.6, -0.9], etourdi: [-0.4, 0.5, -0.3], crocodile: [-1.4, 0.9, 0.2],
  pensif: [-0.5, -0.9, -0.7], malicieux: [0.5, -1, -0.5], fier: [-0.3, -0.7, -0.9], fatigue: [0.1, 0.7, -0.1], degoute: [0.9, -0.3, 0.3]
};
function sourcils(e) {
  const g = G, cx = (g.eyes[0][0] + g.eyes[1][0]) / 2, [bi, bo, arch] = BROW[e];
  return g.eyes.map(([x, y, rx], i) => {
    const k = cx > x ? 1 : -1, hw = rx + 0.5, by = y + g.browY;
    // pensif et malicieux : un seul sourcil levé
    const up = (e === 'pensif' || e === 'malicieux') && i === 1 ? -0.9 : 0;
    return `<path d="M${f(x - k * hw)},${f(by + bo + up)} Q${f(x)},${f(by + (bi + bo) / 2 + arch + up)} ${f(x + k * hw)},${f(by + bi + up)}" fill="none" stroke="${g.brow}" stroke-width="${f(g.browW * 0.85)}" stroke-linecap="round"/>`;
  }).join('');
}

// ——— les yeux de chaque expression (y : ouverts ; null : ceux du dessus), et ceux du clignement ———
const YEUX = {
  neutre: ['open'], content: ['open'], rire: ['joy'], surpris: ['big'], triste: ['lid', { tO: 0.9, tI: -0.3 }], fache: ['lid', { tO: -0.3, tI: 1 }],
  gene: ['squeeze'], endormi: ['blink'], emu: ['joy'], effraye: ['tiny'], boude: ['lid', { tO: 0.2, tI: 0.8 }], determine: ['lid', { tO: -0.4, tI: 0.7, glint: true }],
  emerveille: ['star'], adore: ['heart'], etourdi: ['spiral'], crocodile: ['squeeze'], pensif: ['open', { dx: -0.5, dy: -0.55 }],
  malicieux: [['open'], ['joy']], fier: ['joy'], fatigue: ['sleepy', { cerne: true }], degoute: [['line'], ['sleepy']]
};
const CLIGNE = ['neutre', 'content', 'pensif', 'boude', 'determine', 'triste', 'fache', 'malicieux', 'surpris', 'fatigue'];
function yeux(e, t, ferme) {
  const g = G, cx = (g.eyes[0][0] + g.eyes[1][0]) / 2;
  return g.eyes.map(([x, y, rx], i) => {
    const k = cx > x ? 1 : -1;
    let [m, o] = Array.isArray(YEUX[e][0]) ? YEUX[e][i] : YEUX[e];
    o = { ...(o || {}) };
    if (ferme && m !== 'joy') m = 'blink';
    if (e === 'emerveille') o.s = 0.9 + 0.2 * Math.abs(Math.sin(2 * Math.PI * t + i));
    if (e === 'adore') o.s = 1 + 0.12 * Math.max(0, Math.sin(4 * Math.PI * t));
    if (e === 'etourdi') o.rot = (i ? -1 : 1) * 2 * Math.PI * t;
    if (e === 'effraye') o.dx = 0.25 * Math.sin(8 * Math.PI * t + i);
    return EYE[m](x, y, rx, g.ry, k, o);
  }).join('');
}

// ——— les bouches ———
let MC = 0; // compteur des découpes de bouche
function ouverte(mx, my, hw, depth, dents) {
  const g = G, d = `M${f(mx - hw)},${f(my - 0.2)} Q${f(mx)},${f(my + depth)} ${f(mx + hw)},${f(my - 0.2)} Z`, id = `${IR}m${MC++}`;
  return P(d, g.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + depth * 0.5, hw * 0.6, depth * 0.3, g.tongue)}${dents ? `<rect x="${f(mx - hw)}" y="${f(my - 0.4)}" width="${f(2 * hw)}" height="0.75" fill="${WHITE}"/>` : ''}</g>` + P(d, 'none', 0.75);
}
function bouche(e, t) {
  const g = G, [mx, my] = g.mouth, w = g.mw, line = (d, wd = 0.75) => P(d, 'none', wd);
  switch (e) {
    case 'neutre': return line(g.neutral(mx, my));
    case 'content': return line(`M${f(mx - w)},${my} Q${mx},${f(my + w * 0.95)} ${f(mx + w)},${my}`) + line(`M${f(mx - w - 0.3)},${f(my - 0.2)} L${f(mx - w + 0.1)},${f(my + 0.2)}`, 0.5);
    case 'rire': return ouverte(mx, my, w + 0.5, w * 1.5 + 1.3 - 0.4 * Math.abs(Math.sin(4 * Math.PI * t)), true);
    case 'surpris': return E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.75) + E(mx, my + 1.4, 0.5, 0.4, g.tongue);
    case 'triste': return line(`M${f(mx - 1.4)},${f(my + 1.1)} Q${mx},${f(my - 0.1)} ${f(mx + 1.4)},${f(my + 1.1)}`);
    case 'fache': return P(`M${f(mx - 1.7)},${f(my + 1.3)} Q${mx},${f(my - 0.4)} ${f(mx + 1.7)},${f(my + 1.3)} Q${mx},${f(my + 0.7)} ${f(mx - 1.7)},${f(my + 1.3)} Z`, g.mouthC, 0.75);
    case 'gene': case 'etourdi': { const a = e === 'etourdi' ? 0.3 * Math.sin(2 * Math.PI * t) : 0; return line(`M${f(mx - 1.9)},${f(my + 0.6 + a)} Q${f(mx - 1.25)},${f(my - 0.1)} ${f(mx - 0.6)},${f(my + 0.6)} Q${mx},${f(my + 1.3 - a)} ${f(mx + 0.6)},${f(my + 0.6)} Q${f(mx + 1.25)},${f(my - 0.1)} ${f(mx + 1.9)},${f(my + 0.6 - a)}`, 0.65); }
    case 'endormi': return E(mx, my + 0.7, 0.6, 0.75 + 0.15 * Math.sin(2 * Math.PI * t), g.mouthC, 0.65);
    case 'emu': return ouverte(mx, my, w + 0.2, w * 1.1 + 1, false) + line(`M${f(mx - w - 0.6)},${f(my - 0.4)} L${f(mx - w - 0.1)},${f(my + 0.1)}`, 0.5);
    case 'effraye': { let d = ''; for (let i = 0; i <= 16; i++) { const a = i / 16 * 2 * Math.PI, r = 1 + 0.12 * Math.sin(a * 5 + 8 * Math.PI * t); d += `${i ? 'L' : 'M'}${f(mx + 1.25 * r * Math.cos(a))},${f(my + 1.3 + 1.5 * r * Math.sin(a))}`; } return P(d + ' Z', g.mouthC, 0.7) + E(mx, my + 2, 0.7, 0.5, g.tongue); }
    case 'boude': return P(`M${f(mx - 0.2)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my - 0.1)} ${f(mx + 1.1)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my + 1.4)} ${f(mx - 0.2)},${f(my + 0.7)} Z`, g.mouthC, 0.65);
    case 'determine': return P(`M${f(mx - w - 0.2)},${f(my)} Q${mx},${f(my + 0.5)} ${f(mx + w + 0.2)},${f(my - 0.3)} Q${f(mx + 0.2)},${f(my + 2.2)} ${f(mx - w - 0.2)},${f(my)} Z`, WHITE, 0.7) + line(`M${f(mx - w)},${f(my + 0.35)} Q${mx},${f(my + 0.9)} ${f(mx + w)},${f(my + 0.1)}`, 0.4);
    case 'emerveille': return ouverte(mx, my, w + 0.7, w * 1.6 + 1.5, true);
    case 'adore': return line(`M${f(mx - 1.6)},${f(my + 0.2)} Q${f(mx - 0.8)},${f(my + 1.3)} ${mx},${f(my + 0.3)} Q${f(mx + 0.8)},${f(my + 1.3)} ${f(mx + 1.6)},${f(my + 0.2)}`, 0.7);
    case 'crocodile': { const s = 0.3 * Math.sin(8 * Math.PI * t), d = `M${f(mx - 2.3)},${f(my + 0.1)} L${f(mx + 2.3)},${f(my + 0.1)} Q${f(mx + 1.9)},${f(my + 3.9 + s)} ${mx},${f(my + 4 + s)} Q${f(mx - 1.9)},${f(my + 3.9 + s)} ${f(mx - 2.3)},${f(my + 0.1)} Z`, id = `${IR}m${MC++}`; return P(d, G.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + 3.4, 1.4, 1, G.tongue)}<rect x="${f(mx - 2.3)}" y="${f(my - 0.2)}" width="4.6" height="0.8" fill="${WHITE}"/></g>` + P(d, 'none', 0.75); }
    case 'pensif': return line(`M${f(mx - 0.4)},${f(my + 0.7)} Q${f(mx + 0.4)},${f(my + 0.5)} ${f(mx + 1.1)},${f(my + 0.2)}`, 0.7);
    case 'malicieux': return line(`M${f(mx - 1.4)},${f(my + 0.4)} Q${f(mx + 0.2)},${f(my + 1.3)} ${f(mx + 1.7)},${f(my - 0.4)}`) + P(`M${f(mx - 0.3)},${f(my + 0.85)} Q${f(mx + 0.25)},${f(my + 2.5 + 0.2 * Math.sin(2 * Math.PI * t))} ${f(mx + 0.9)},${f(my + 0.6)} Z`, G.tongue, 0.55);
    case 'fier': return line(`M${f(mx - w - 0.4)},${f(my - 0.2)} Q${mx},${f(my + 1.8)} ${f(mx + w + 0.4)},${f(my - 0.2)}`, 0.75) + line(`M${f(mx + w + 0.2)},${f(my - 0.6)} L${f(mx + w + 0.6)},${f(my + 0.1)}`, 0.5);
    case 'fatigue': return E(mx, my + 0.8, 0.85, 0.45 + 0.25 * Math.max(0, Math.sin(2 * Math.PI * t)), g.mouthC, 0.6);
    case 'degoute': return line(`M${f(mx - 1.8)},${f(my + 1.1)} Q${f(mx - 0.9)},${f(my + 0.1)} ${mx},${f(my + 0.8)} Q${f(mx + 0.9)},${f(my + 1.5)} ${f(mx + 1.8)},${f(my + 0.5)}`, 0.7) + P(`M${f(mx + 0.1)},${f(my + 0.9)} Q${f(mx + 0.6)},${f(my + 2.2)} ${f(mx + 1.1)},${f(my + 1.1)} Z`, G.tongue, 0.5);
  }
  return '';
}

// ——— les petits signes, animés (t de 0 à 1) ———
const drop = (x, y, r, fill = '#A9DCFF', o = 1) => `<g opacity="${f(o)}">${P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y + r)} Q${f(x - r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, fill, 0.55)}${E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE)}</g>`;
const eclat = (x, y, r, o = 1) => r < 0.1 ? '' : `<path d="M${x},${f(y - r)} Q${f(x + r * 0.18)},${f(y - r * 0.18)} ${f(x + r)},${y} Q${f(x + r * 0.18)},${f(y + r * 0.18)} ${x},${f(y + r)} Q${f(x - r * 0.18)},${f(y + r * 0.18)} ${f(x - r)},${y} Q${f(x - r * 0.18)},${f(y - r * 0.18)} ${x},${f(y - r)} Z" fill="#FFF3B0" stroke="${OUT}" stroke-width="0.4" opacity="${f(o)}"/>`;
const coeur = (x, y, s, o) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" opacity="${f(o)}">${P('M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z', '#F0607A', 0.6)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`;
const zee = (x, y, z, o) => { const d = `M${f(x)},${f(y)} L${f(x + z)},${f(y)} L${f(x)},${f(y + z)} L${f(x + z)},${f(y + z)}`; return `<g opacity="${f(o)}"><path d="${d}" fill="none" stroke="${OUT}" stroke-width="${f(z * 0.45 + 0.7)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${f(z * 0.45)}" stroke-linejoin="round" stroke-linecap="round"/></g>`; };
const rougeur = (k = 1) => G.cheeks.map(([x, rx]) => E(x, G.cheekY, rx * 1.35 * k, 1.5 * k, '#F08A8A') .replace('/>', ' opacity=".55"/>') + [-0.5, 0, 0.5].map(d => `<line x1="${f(x + d * rx * 1.2 - 0.35)}" y1="${f(G.cheekY + 0.55)}" x2="${f(x + d * rx * 1.2 + 0.35)}" y2="${f(G.cheekY - 0.55)}" stroke="#D9605A" stroke-width="0.4" stroke-linecap="round"/>`).join('')).join('');
const traits = (x0, x1, y0, y1, col, n = 5) => { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * i / (n - 1); s += `<line x1="${f(x)}" y1="${y0}" x2="${f(x)}" y2="${y1 - (i % 2) * 1.2}" stroke="${col}" stroke-width="0.55" stroke-linecap="round" opacity=".75"/>`; } return s; };
function signes(e, t) {
  const g = G, [ex0, ey0] = g.eyes[0], [ex1] = g.eyes[1], cx = (ex0 + ex1) / 2, ry = g.ry, [tx, ty] = g.temple, [ax, ay] = g.anger, [zx, zy] = g.zz;
  const fr = x => x - Math.floor(x);
  switch (e) {
    case 'rire': return drop(ex0 - 2, ey0 + 0.6, 0.55) + drop(ex1 + 2, ey0 + 0.6, 0.55);
    case 'surpris': { const k = 0.6 + 0.4 * Math.abs(Math.sin(2 * Math.PI * t)); return [[-1, ex0 - 4.2], [1, ex1 + 4.2]].map(([s, x]) => [0, 1, 2].map(i => `<line x1="${f(x)}" y1="${f(ey0 - 4 + i * 2.2)}" x2="${f(x + s * 1.6 * k)}" y2="${f(ey0 - 4.6 + i * 2.2)}" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/>`).join('')).join(''); }
    case 'triste': { const u = fr(t); return drop(ex0 + 1.2, ey0 + ry + 1.2 + u * 3.6, 0.95, '#A9DCFF', 1 - u * 0.6); }
    case 'fache': { const s = 1 + 0.25 * Math.abs(Math.sin(2 * Math.PI * t)), a = 0.5 * s, b = 1.7 * s; const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${f(ax + i * a)},${f(ay + j * b)} Q${f(ax + i * a)},${f(ay + j * a)} ${f(ax + i * b)},${f(ay + j * a)}`).join(' '); return `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="0.9" stroke-linecap="round"/>`; }
    case 'gene': return rougeur() + drop(tx, ty + fr(t) * 2.4, 1.8);
    case 'endormi': return [0, 1, 2].map(i => { const u = fr(t + i / 3); return zee(zx - 1 + u * 3, zy + 4.5 - u * 5, 1.3 + u * 1.3, Math.sin(Math.PI * u)); }).join('');
    case 'emu': return g.eyes.map(([x, y]) => E(x, y + ry * 0.2, 1.9, 0.5, '#A9DCFF').replace('/>', ' opacity=".8"/>')).join('') + [0, 1].map(i => { const u = fr(t + i / 2), x = i ? ex1 + 1.6 : ex0 - 1.6; return drop(x, ey0 + 1.4 + u * 4, 0.8, '#A9DCFF', 1 - u * 0.7); }).join('') + rougeur(0.8);
    case 'effraye': return traits(ex0 - 2, ex1 + 2, 15.6, 19.4, '#6E86C8', 7) + drop(tx + 0.4, ty + 1 + fr(t) * 2, 1.5) + drop(ax - 3, ay + 7 + fr(t + 0.5) * 2, 1.2);
    case 'boude': { const u = fr(t); return E(g.cheeks[1][0] - 0.4, g.cheekY - 0.2, 2.6, 1.8, '#F08A8A').replace('/>', ' opacity=".7"/>') + E(g.cheeks[1][0] - 1, g.cheekY - 0.8, 0.7, 0.4, WHITE).replace('/>', ' opacity=".7"/>') + `<g opacity="${f(1 - u)}" transform="translate(${f(ax - 1 + u * 2)} ${f(ay + 2 - u * 2)}) scale(${f(0.6 + u * 0.6)})">${P('M-2,0.6 a1.2,1.2 0 0 1 0.6,-2 a1.5,1.5 0 0 1 2.8,0 a1.2,1.2 0 0 1 0.6,2 Z', '#F4F2EA', 0.5)}</g>`; }
    case 'determine': { const k = Math.abs(Math.sin(2 * Math.PI * t)); return eclat(ex1 + 2.6, ey0 - 2.6, 1.6 * k) + `<g opacity=".9">${traits(ax - 4, ax + 1, ay + 1, ay + 4, '#F2994A', 3)}</g>`; }
    case 'emerveille': return [[ex0 - 5, ey0 - 7, 0], [ex1 + 5, ey0 - 8, 0.33], [cx, ey0 - 14, 0.66], [ex1 + 6.5, ey0 + 1, 0.5]].map(([x, y, o]) => eclat(x, y, 1.8 * Math.abs(Math.sin(2 * Math.PI * (t + o))))).join('') + rougeur(0.7);
    case 'adore': return [0, 1, 2].map(i => { const u = fr(t + i / 3), x = [ex0 - 5, ex1 + 5, ex1 + 3][i]; return coeur(x + Math.sin(u * 6.3) * 0.6, ey0 - 2 - u * 9, 0.55 + u * 0.25, Math.sin(Math.PI * u)); }).join('') + rougeur(0.9);
    case 'etourdi': return [0, 1, 2].map(i => { const a = 2 * Math.PI * (t + i / 3); return eclat(f(cx + 10 * Math.cos(a)), f(ey0 - 17 + 2.2 * Math.sin(a)), 1.3); }).join('');
    case 'crocodile': return g.eyes.map(([x, y], i) => { const s = i ? 1 : -1, x0 = x, y0 = y + 0.6, d = `M${f(x0 - 1.3)},${f(y0)} Q${f(x0 + s * 0.6 - 1)},${f(y0 + 5)} ${f(x0 + s * 1.6 - 1.4)},${f(y0 + 10)} L${f(x0 + s * 1.6 + 1.6)},${f(y0 + 10)} Q${f(x0 + s * 0.6 + 1.2)},${f(y0 + 5)} ${f(x0 + 1.3)},${f(y0)} Z`; return P(d, '#B8E4FF', 0.55) + `<path d="M${f(x0 + s * 0.2)},${f(y0 + 1)} Q${f(x0 + s * 0.7)},${f(y0 + 5)} ${f(x0 + s * 1.5)},${f(y0 + 9.4)}" fill="none" stroke="${WHITE}" stroke-width="0.45" stroke-linecap="round" stroke-dasharray="1.4 2.2" stroke-dashoffset="${f(-t * 7.2)}" opacity=".9"/>`; }).join('') + [0, 1].map(i => { const u = fr(t + i / 2); return drop(i ? ex1 + 6 + u * 1.5 : ex0 - 6 - u * 1.5, ey0 + 4 + u * 3, 0.7, '#A9DCFF', 1 - u); }).join('');
    case 'pensif': { const [mx, my] = g.mouth, hx = mx + 2.8, hy = my + 4.4; return E(hx, hy, 2.2, 1.9, SKIN, 0.7) + `<path d="M${f(hx - 1.6)},${f(hy - 0.4)} Q${f(hx - 0.6)},${f(hy - 1.5)} ${f(hx + 0.6)},${f(hy - 1.3)}" fill="none" stroke="${OUT}" stroke-width="0.55" stroke-linecap="round"/>` + `<path d="M${f(hx - 1.2)},${f(hy + 0.4)} L${f(hx + 0.6)},${f(hy + 0.1)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`; }
    case 'malicieux': return eclat(ex1 + 2.8, ey0 - 2.4, 1.4 * Math.abs(Math.sin(2 * Math.PI * t)));
    case 'fier': return eclat(ex1 + 6, ey0 - 7, 1.9 * Math.abs(Math.sin(2 * Math.PI * t))) + eclat(ex1 + 8, ey0 - 3, 1.1 * Math.abs(Math.sin(2 * Math.PI * (t + 0.4))));
    case 'fatigue': { const a = 0.5 * Math.sin(2 * Math.PI * t); return [-3, 0, 3].map((dx, i) => `<path d="M${f(cx + dx + a)},${f(ey0 - 20.8 + i % 2)} q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4" fill="none" stroke="#7A7A9A" stroke-width="0.6" stroke-linecap="round" opacity=".8"/>`).join('') + drop(tx, ty + 1, 1.2); }
    case 'degoute': return traits(ex0 - 1.6, ex1 + 1.6, 15.8, 19, '#7AA858', 6) + E(G.mouth[0], G.mouth[1] + 4, 0, 0, 'none');
  }
  return '';
}

// ——— les bulles d'émotion (calques à poser au-dessus du portrait, en haut à droite) ———
let BX = 37.5, BY = 10.5;
const contour = (d, fill, w = 0.7) => `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${f(w + 1.6)}" stroke-linejoin="round" stroke-linecap="round"/>` + P(d, fill, w);
const BULLES = {
  exclamation: t => { const s = 1 + 0.18 * Math.max(0, Math.sin(2 * Math.PI * t)); return `<g transform="translate(${BX} ${BY}) scale(${f(s)})">${contour('M-1.2,-5 L1.2,-5 L0.7,1 L-0.7,1 Z', '#E8504A')}${contour('M0,2.2 a1,1 0 1 1 0.01,0 Z', '#E8504A')}</g>`; },
  question: t => `<g transform="translate(${BX} ${BY}) rotate(${f(12 * Math.sin(2 * Math.PI * t))})">${contour('M-2.2,-2.6 Q-2.2,-5.4 0.2,-5.4 Q2.6,-5.4 2.6,-3 Q2.6,-1.4 1,-0.6 Q0.4,-0.3 0.4,0.8 L-0.8,0.8 Q-0.9,-1 0.4,-1.8 Q1.2,-2.3 1.2,-3 Q1.2,-4 0.2,-4 Q-0.8,-4 -0.8,-2.6 Z', '#4C8FE8')}${contour('M-0.2,2.2 a0.95,0.95 0 1 1 0.01,0 Z', '#4C8FE8')}</g>`,
  points: t => `<g transform="translate(${BX - 5.4} ${BY})">${contour('M-3,-4.6 Q-3,-7.4 0,-7.4 L6,-7.4 Q9,-7.4 9,-4.6 Q9,-1.8 6,-1.8 L1.6,-1.8 L-0.6,0.6 L-0.2,-1.9 Q-3,-2.2 -3,-4.6 Z', '#FFFFFF', 0.6)}${[0, 1, 2].map(i => E(-0.2 + i * 3, -4.6, 0.75, 0.75, OUT).replace('/>', ` opacity="${f(t * 3 > i ? 1 : 0.15)}"/>`)).join('')}</g>`,
  note: t => `<g transform="translate(${BX} ${f(BY - 1.2 * Math.abs(Math.sin(2 * Math.PI * t)))}) rotate(${f(-10 + 20 * Math.sin(2 * Math.PI * t))})">${contour('M-1.6,1.6 a1.6,1.2 -20 1 1 0.01,0 Z M-0.1,1.2 L-0.1,-5 Q2.4,-4 2.6,-2.2 Q1.8,-3 0.9,-3.2 L0.9,1.2', '#9A6ED8', 0.6)}</g>`,
  ampoule: t => { const o = 0.35 + 0.45 * (Math.sin(2 * Math.PI * t * 2) > -0.3 ? 1 : 0.2); return `<g transform="translate(${BX} ${BY})"><circle cx="0" cy="-2.4" r="5" fill="#FFF3B0" opacity="${f(o * 0.6)}"/>${contour('M0,-6.4 Q3.2,-6.4 3.2,-3.2 Q3.2,-1.6 1.6,-0.4 L1.4,1 L-1.4,1 L-1.6,-0.4 Q-3.2,-1.6 -3.2,-3.2 Q-3.2,-6.4 0,-6.4 Z', '#FFD54A')}${P('M-1.3,1.6 L1.3,1.6 L1,2.8 L-1,2.8 Z', '#B8B0A0', 0.55)}${E(-1, -4.2, 0.6, 0.9, WHITE)}${[[-5.4, -3.2, -7.2, -3.2], [5.4, -3.2, 7.2, -3.2], [-3.8, -7.4, -5, -8.6], [3.8, -7.4, 5, -8.6], [0, -8, 0, -9.8]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#F2B230" stroke-width="0.7" stroke-linecap="round" opacity="${f(o + 0.2)}"/>`).join('')}</g>`; },
  orage: t => { const flash = Math.floor(t * 8) % 4 === 1; return `<g transform="translate(${f(BX - 1 + 0.4 * Math.sin(2 * Math.PI * t))} ${BY})">${contour('M-4,-1 Q-6,-1 -6,-3 Q-6,-5 -4,-5 Q-3.6,-7.6 -1,-7.6 Q1,-7.6 1.6,-6 Q2.4,-6.8 3.6,-6.4 Q5.4,-5.8 5,-4 Q6.6,-3.6 6.2,-2 Q5.8,-1 4.6,-1 Z', '#8A8EA8', 0.6)}${P('M0.4,-1 L-1.2,2.2 L0.4,2.2 L-0.6,5.2 L2,1.2 L0.4,1.2 L1.6,-1 Z', flash ? '#FFF6A0' : '#F2C94C', 0.5)}</g>`; }
};

// ——— une image : le buste fixe, les sourcils et la bouche, les yeux qui clignent, les signes en 8 phases ———
const PH = 8, MS = 125, CYCLE = 3000;
const phases = (fn) => { let o = ''; for (let i = 0; i < PH; i++) o += `<g opacity="${i ? 0 : 1}"><animate attributeName="opacity" values="1;0" keyTimes="0;${f(1 / PH)}" calcMode="discrete" dur="${PH * MS}ms" begin="${-(PH - i) * MS}ms" repeatCount="indefinite"/>${fn(i / PH)}</g>`; return o; };
// le clignement : les yeux ouverts, sauf 140 ms toutes les 3 s
const cligne = (ouverts, fermes) => `<g>${'<animate attributeName="opacity" values="1;0;1" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>'}${ouverts}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${fermes}</g>`;
// le buste qui bouge un peu : rire (secoué), effrayé (tremble), étourdi (oscille), crocodile (sanglote)
const BOUGE = { rire: ['0 0;0 -0.5;0 0', '0.5s'], effraye: ['-0.25 0;0.25 0;-0.25 0', '0.18s'], etourdi: ['-0.5 0;0.5 0;-0.5 0', '1.4s'], crocodile: ['0 0;0 0.5;0 0', '0.35s'], emerveille: ['0 0;0 -0.35;0 0', '1s'] };
const MOUVANTS = ['emerveille', 'adore', 'etourdi', 'effraye'];

function dessin(c, e, uid, fixe) {
  G = null; MC = 0; IR = `${uid}i`; SKIN = c.skin || '#F2C9A0';
  const base = thin(T.frame({ ...c, uid }, 'front', 'repos', 0, 'vide'), 0.6);
  G = T.visageVide();
  recadrer();
  const defs = `<defs><linearGradient id="${IR}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1814"/><stop offset=".55" stop-color="#2E2420"/><stop offset="1" stop-color="${G.eyeColor || '#7A4C38'}"/></linearGradient></defs>`;
  let visage = sourcils(e) + bouche(e, 0);
  // yeux : animés en phases quand ils bougent (étoiles, cœurs, spirales, tremblement), sinon fixes avec clignement
  let y;
  if (fixe) y = yeux(e, 0, false);
  else if (MOUVANTS.includes(e)) y = phases(t => yeux(e, t, false));
  else if (CLIGNE.includes(e)) y = cligne(yeux(e, 0, false), yeux(e, 0, true));
  else y = yeux(e, 0, false);
  // bouche animée pour quelques expressions
  if (!fixe && ['rire', 'etourdi', 'endormi', 'effraye', 'crocodile', 'malicieux', 'fatigue'].includes(e)) visage = sourcils(e) + phases(t => bouche(e, t));
  const s = fixe ? signes(e, 0.2) : phases(t => signes(e, t));
  const b = BOUGE[e] && !fixe ? `<animateTransform attributeName="transform" type="translate" values="${BOUGE[e][0]}" dur="${BOUGE[e][1]}" repeatCount="indefinite"/>` : '';
  return `${defs}<g>${b}${base}${visage}${y}${s}</g>`;
}
// le cadre du portrait : 38 × 38, calé sur les yeux (comme Aster : yeux à 22,6 sous le haut du cadre)
let VB = [5, 0, 38, 38];
function recadrer() { const cx = (G.eyes[0][0] + G.eyes[1][0]) / 2, ey = G.eyes[0][1]; VB = [f(cx - 19), f(ey - 22.6), 38, 38]; BX = VB[0] + 32.5; BY = VB[1] + 10.5; }
const EXPRESSIONS_PORTRAIT = Object.keys(YEUX);
// leurs noms, pour les listes et les outils
const NOMS_EXPRESSIONS = { neutre: 'Neutre', content: 'Content', rire: 'Rire', surpris: 'Surpris', triste: 'Triste', fache: 'Fâché', gene: 'Gêné', endormi: 'Endormi', emu: 'Ému aux larmes', effraye: 'Effrayé', boude: 'Boudeur', determine: 'Déterminé', emerveille: 'Émerveillé (yeux en étoiles)', adore: 'Adore (yeux en cœurs)', etourdi: 'Étourdi (yeux en spirale)', crocodile: 'Gros chagrin', pensif: 'Pensif', malicieux: 'Malicieux', fier: 'Fier', fatigue: 'Fatigué', degoute: 'Dégoûté' };
const NOMS_BULLES = { exclamation: 'Exclamation (!)', question: 'Question (?)', points: 'Points de suspension (…)', note: 'Note de musique', ampoule: 'Ampoule (une idée)', orage: 'Nuage d\'orage' };
const BULLES_PORTRAIT = Object.keys(BULLES);
const HD = 4, TAILLE = 96; // affiché en 96 × 96 px, déclaré × 4
const svgOf = (cadre, corps, hd) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TAILLE * hd}" height="${TAILLE * hd}" viewBox="${cadre.join(' ')}">${corps}</svg>`;
// Le portrait d'un personnage (celui de frame() : un maître, l'avatar rendu par avatar(choix)) dans une expression ;
// fixe : sans animation ; rend { svg, cadre, corps }
function portrait(c, expr = 'neutre', { fixe = false, hd = HD, uid } = {}) {
  if (!YEUX[expr]) throw new Error(`expression inconnue : ${expr} (${EXPRESSIONS_PORTRAIT.join(', ')})`);
  const corps = dessin(c, expr, uid || `${c.uid || 'p'}${expr}`, fixe), cadre = VB.slice();
  return { svg: svgOf(cadre, corps, hd), cadre, corps };
}
// Une bulle d'émotion, dans un cadre 38 × 38 à poser par-dessus n'importe quel portrait, à la même taille
function bulle(cle, { fixe = false, hd = HD } = {}) {
  if (!BULLES[cle]) throw new Error(`bulle inconnue : ${cle} (${BULLES_PORTRAIT.join(', ')})`);
  BX = 32.5; BY = 10.5;
  const corps = fixe ? BULLES[cle](0.3) : phases(BULLES[cle]), cadre = [0, 0, 38, 38];
  return { svg: svgOf(cadre, corps, hd), cadre, corps };
}
module.exports = { portrait, bulle, EXPRESSIONS_PORTRAIT, BULLES_PORTRAIT, NOMS_EXPRESSIONS, NOMS_BULLES, HD_PORTRAIT: HD, TAILLE_PORTRAIT: TAILLE };
