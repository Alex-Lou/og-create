// Brume en très grand, au premier plan de l'écran de démarrage (splash.js) : son dessin du jeu (brume.js, stade s1 :
// la flamme bleue, son cœur clair, ses yeux, ses joues), même forme, mêmes couleurs, avec un rendu fait pour être vu
// de près : une flamme vitrée qui ondule (sa pointe se balance, deux langues de feu s'en échappent), une lumière
// intérieure qui respire, des reflets de verre, des particules qui montent dedans ; elle cligne doucement des yeux.
// Repère : celui de son dessin (40 × 48 ; la flamme va de y = 13,5, la pointe, à y = 41, la base).
const { degrade, rayonne } = require('./splash_anya').outils;
const { f, rnd, palpite } = require('./scenes7').outils;

const SPL = '0.45 0 0.55 1';
// La flamme du jeu, et deux variantes où sa pointe penche (même suite de commandes : elles se fondent l'une dans l'autre)
const flamme = (dx, r = 1) => `M20,41 C${f(20 + 11.7 * r)},41 ${f(20 + 10.35 * r)},27.95 ${f(20 + dx)},${f(41 - 27.45 * r)} C${f(20 - 10.35 * r)},27.95 ${f(20 - 11.7 * r)},41 20,41 Z`;
const ondule = (r, dur, begin = 0) => `<animate attributeName="d" values="${flamme(0, r)};${flamme(1.6, r)};${flamme(-1.4, r)};${flamme(0, r)}" keyTimes="0;0.33;0.7;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL}" dur="${dur}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;

function brumeHeroine() {
  const defs = '<defs>'
    + rayonne('bgFlamme', 20, 34, 18, [[0, '#B8F2FF'], [0.45, '#6ED4F6'], [0.8, '#3AA6E2'], [1, '#2A80C8']], 18, 38)
    + rayonne('bgMilieu', 20, 34, 12, [[0, '#F2FDFF'], [0.6, '#C8F3FF'], [1, '#A6E8FF']])
    + rayonne('bgCoeur', 20, 36, 7.5, [[0, '#FFFFFF'], [0.7, '#FFFFFF', 0.95], [1, '#FFFFFF', 0.6]])
    + rayonne('bgHalo', 20, 30, 16, [[0, '#9FE6FF', 0.6], [0.5, '#6CCBF0', 0.2], [1, '#6CCBF0', 0]])
    + rayonne('bgOeil', 0, 0, 1, [[0, '#3A5E9A'], [0.6, '#1D3557'], [1, '#14243C']], 0.4, 0.75).replace('gradientUnits="userSpaceOnUse" ', '')
    + rayonne('bgJoue', 0.5, 0.5, 0.5, [[0, '#FF9EB0', 0.85], [1, '#FF9EB0', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
    + degrade('bgReflet', 12, 18, 16, 32, [[0, '#FFFFFF', 0.85], [1, '#FFFFFF', 0]])
    + `<clipPath id="bgDedans"><path d="${flamme(0, 0.9)}"/></clipPath>`
    + '</defs>';
  let s = defs;
  // le halo qui respire autour d'elle
  s += `<ellipse cx="20" cy="30" rx="15" ry="17" fill="url(#bgHalo)">${palpite('rx', '14;16;14', 2.8)}${palpite('ry', '16;18;16', 2.8)}</ellipse>`;
  // deux langues de feu qui s'échappent de ses flancs et montent en s'effaçant
  s += [[-1, 0], [1, 1.3]].map(([k, b]) => `<path d="M${20 + k * 7},26 Q${20 + k * 10},21 ${20 + k * 8},16 Q${20 + k * 6},21 ${20 + k * 5},26 Z" fill="#7FDCFA" opacity="0">`
    + `<animate attributeName="opacity" values="0;0.8;0" dur="2.6s" begin="${-b}s" repeatCount="indefinite"/>`
    + `<animateTransform attributeName="transform" type="translate" values="0 2;${k * 1.5} -4" dur="2.6s" begin="${-b}s" repeatCount="indefinite"/></path>`).join('');
  // la flamme, son milieu clair, son cœur blanc qui respire : chacune ondule à son rythme
  s += `<path d="${flamme(0)}" fill="url(#bgFlamme)" stroke="#23647F" stroke-width="0.9" stroke-linejoin="round">${ondule(1, 3.2)}</path>`;
  s += `<path d="${flamme(0, 0.79)}" transform="translate(0 -0.5)" fill="url(#bgMilieu)">${ondule(0.79, 2.6, 0.4)}</path>`;
  s += `<ellipse cx="20" cy="35" rx="5.8" ry="5.2" fill="url(#bgCoeur)">${palpite('rx', '5.4;6.4;5.4', 2.2)}${palpite('ry', '4.8;5.6;4.8', 2.2)}</ellipse>`;
  // des particules de lumière qui montent dans la flamme
  s += '<g clip-path="url(#bgDedans)">' + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${f(15 + i * 2)}" cy="40" r="${f(0.35 + (i % 3) * 0.15)}" fill="#FFFFFF" opacity="0">`
    + `<animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 1 : -1} -12;${i % 2 ? -0.5 : 0.8} -24" dur="${f(3 + i * 0.35)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/>`
    + `<animate attributeName="opacity" values="0;0.9;0" dur="${f(3 + i * 0.35)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/></circle>`).join('') + '</g>';
  // les reflets de verre : une longue courbe à gauche, une goutte en haut, un liseré à droite
  s += '<path d="M14.6,22 Q11.4,28 12,35" fill="none" stroke="url(#bgReflet)" stroke-width="1.3" stroke-linecap="round"/>'
    + '<ellipse cx="17.6" cy="19.6" rx=".55" ry=".9" fill="#FFFFFF" opacity=".85" transform="rotate(25 17.6 19.6)"/>'
    + '<path d="M27.4,28 Q29.4,33 28,38" fill="none" stroke="#E6FBFF" stroke-width=".6" stroke-linecap="round" opacity=".7"/>';
  // les joues, les yeux (le regard du jeu, en plus profond et plus brillant) qui clignent doucement
  s += '<ellipse cx="14.6" cy="34.4" rx="2" ry="1.2" fill="url(#bgJoue)"/><ellipse cx="25.4" cy="34.4" rx="2" ry="1.2" fill="url(#bgJoue)"/>';
  const oeil = x => `<ellipse cx="${x}" cy="31.55" rx="1.42" ry="1.98" fill="url(#bgOeil)"/><ellipse cx="${f(x + 0.55)}" cy="30.5" rx=".66" ry=".66" fill="#FFFFFF"/>`
    + `<ellipse cx="${f(x - 0.5)}" cy="32.6" rx=".32" ry=".32" fill="#FFFFFF"/><ellipse cx="${f(x - 0.2)}" cy="32.9" rx=".9" ry=".35" fill="#7FB8FF" opacity=".45"/>`;
  s += `<g transform="translate(0 31.55)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1;1 1" keyTimes="0;0.92;0.95;0.98;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL};${SPL}" dur="5.5s" repeatCount="indefinite"/>`
    + `<g transform="translate(0 -31.55)">${oeil(16.8)}${oeil(23.2)}</g></g></g>`;
  return s;
}

// Son autre visage, pour l'orage (choix de l'auteur, 17 oct. : un démon de feu, qu'on ne voit qu'un instant, à travers
// un éclair ; « visible mais grossièrement dessiné, mais en fait hyper propre et détaillé ») : de loin, une crinière de
// feu sauvage, en pointes déchirées qui montent, deux griffes de flamme ; de près, tout est tenu : un trait rouge fin,
// des mèches dessinées dans chaque pointe, le grain doré de la flamme, un cœur plus chaud. La même flamme au milieu,
// dorée, des marques rouges sur les joues ; les yeux en amande, blancs de chaleur, cerclés de rouge, la pupille en fente ;
// les sourcils froncés ; un sourire à crocs. Immobile (comme tout l'écran : preview_splash.js). Même repère que Brume ;
// la crinière déborde son cadre de 40 × 48 (l'image de Brume a de la place autour : x de -8 à 48, y de -8 à 57).
const ROUGE = '#B8221A', SOMBRE = '#4A0A08';
// La cape de feu qui l'enveloppe : une goutte plus large qu'elle, plus haute, au bord déchiré de petites pointes
const capeR = a => { const s = Math.sin(a); return [13.6 * (s < 0 ? 1 - 0.18 * -s : 1), 14.2 * (s < 0 ? 1 + 0.32 * -s : 0.92)]; };
function cape(g) {
  const n = 46, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, [rx, ry] = capeR(a), k = i % 2 ? 1.05 + g() * 0.14 : 0.9 + g() * 0.04;
    pts.push([20 + rx * k * Math.cos(a), 30 + ry * k * Math.sin(a)]);
  }
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i <= n; i++) {
    const [x, y] = pts[i % n], [px, py] = pts[i - 1];
    d += i % 2 ? ` Q${f(px + (x - px) * 0.6)},${f(py + (y - py) * 0.2)} ${f(x)},${f(y - 0.5)}` : ` Q${f(px + (x - px) * 0.4)},${f(py + (y - py) * 0.8)} ${f(x)},${f(y)}`;
  }
  return d + ' Z';
}
// Une mèche de feu, posée au bord de la cape (angle a) : elle part vers l'extérieur et se recourbe vers le haut, en
// s'effilant ; ses mèches à elle : deux traits fins de la base vers la pointe
function meche(a, l, w, monte, tord) {
  const [rx, ry] = capeR(a), bx = 20 + rx * 0.76 * Math.cos(a), by = 30 + ry * 0.76 * Math.sin(a);
  const ox = Math.cos(a), oy = Math.sin(a), dx = ox * (1 - monte), dy = oy * (1 - monte) - monte, n = Math.hypot(dx, dy);
  const tx = bx + (dx / n) * l + tord, ty = by + (dy / n) * l;
  const px = -oy, py = ox;
  const cx = bx + ox * l * 0.5, cy = by + oy * l * 0.5 - l * 0.2 * monte;
  const d = `M${f(bx - px * w)},${f(by - py * w)} Q${f(cx - px * w * 0.5)},${f(cy - py * w * 0.5)} ${f(tx)},${f(ty)} Q${f(cx + px * w * 0.7)},${f(cy + py * w * 0.7)} ${f(bx + px * w)},${f(by + py * w)} Z`;
  const traits = [-0.4, 0.35].map(k => `M${f(bx + px * w * k)},${f(by + py * w * k)} Q${f(cx + px * w * k * 0.5)},${f(cy + py * w * k * 0.5)} ${f(bx + (tx - bx) * 0.72)},${f(by + (ty - by) * 0.72)}`).join(' ');
  return [d, traits];
}
function meches(liste, fill, trait, w, couleurTraits) {
  const m = liste.map(o => meche(...o));
  return `<g fill="${fill}" stroke="${trait}" stroke-width="${w}" stroke-linejoin="round">${m.map(([d]) => `<path d="${d}"/>`).join('')}</g>`
    + `<path d="${m.map(([, t]) => t).join(' ')}" fill="none" stroke="${couleurTraits}" stroke-width=".26" stroke-linecap="round" opacity=".8"/>`;
}
// Une griffe : trois doigts de feu crochus qui sortent du bas de la cape (k : -1 à gauche, 1 à droite)
const griffe = k => [[0, 4.6], [0.55, 5.4], [1.1, 4.4]].map(([dy, l]) => {
  const bx = 20 + k * 11.6, by = 37.6 + dy * 1.6, tx = bx + k * l, ty = by + 2.6 - dy * 0.3;
  return `<path d="M${f(bx)},${f(by - 0.9)} Q${f(bx + k * l * 0.8)},${f(by - 0.9)} ${f(tx)},${f(ty)} Q${f(bx + k * l * 0.45)},${f(by + 0.4)} ${f(bx)},${f(by + 0.8)} Z" fill="url(#bdOr)" stroke="${ROUGE}" stroke-width=".4" stroke-linejoin="round"/>`;
}).join('');
function brumeDemon() {
  const g = rnd(23);
  const defs = '<defs>'
    + rayonne('bdHalo', 20, 24, 30, [[0, '#FF9A2E', 0.6], [0.5, '#F2621E', 0.26], [1, '#E2341E', 0]])
    + rayonne('bdFond', 20, 22, 26, [[0, '#FFC24A'], [0.55, '#F2822A'], [1, '#D2401C']])
    + rayonne('bdOr', 20, 28, 20, [[0, '#FFF6C8'], [0.4, '#FFE58A'], [0.8, '#FFC650'], [1, '#F6A836']])
    + rayonne('bdCorps', 20, 33, 14, [[0, '#FFFDF0'], [0.4, '#FFF2B4'], [0.8, '#FFD866'], [1, '#FFBE48']], 18, 36)
    + rayonne('bdOeil', 0, 0, 1, [[0, '#FFFFFF'], [0.5, '#FFF6C8'], [1, '#FFC84A']]).replace('gradientUnits="userSpaceOnUse" ', '')
    + `<clipPath id="bdDedans"><path d="${flamme(0)}"/></clipPath><clipPath id="bdCape"><path d="${cape(rnd(5))}"/></clipPath>`
    + '</defs>';
  let s = defs + '<ellipse cx="20" cy="24" rx="28" ry="31" fill="url(#bdHalo)"/>';
  // derrière : les grandes mèches orangées qui montent (deux, plus hautes, comme des oreilles de bête), puis les dorées
  const loin = [[-1.57, 21, 2.4, 0.15, -1], [-2.2, 22, 2.6, 0.3, -3.2], [-0.94, 22, 2.6, 0.3, 3.2], [-1.85, 17, 2, 0.2, -1.6], [-1.29, 17, 2, 0.2, 1.4],
    [-2.6, 15, 2.4, 0.55, -2], [-0.54, 15, 2.4, 0.55, 2], [-2.95, 12, 2.2, 0.7, -1.2], [-0.19, 12, 2.2, 0.7, 1.2], [2.8, 9, 2, 0.8, -0.6], [0.34, 9, 2, 0.8, 0.6]];
  const pres = [[-1.7, 13, 1.8, 0.1, -0.8], [-1.42, 14, 1.8, 0.1, 0.7], [-2.05, 12, 1.7, 0.3, -1.4], [-1.09, 12, 1.7, 0.3, 1.4], [-2.4, 11, 1.8, 0.45, -1.4],
    [-0.74, 11, 1.8, 0.45, 1.4], [-2.75, 9, 1.7, 0.6, -0.8], [-0.39, 9, 1.7, 0.6, 0.8], [3.1, 7.5, 1.6, 0.75, -0.4], [0.04, 7.5, 1.6, 0.75, 0.4], [2.6, 6, 1.5, 0.85, 0], [0.54, 6, 1.5, 0.85, 0]];
  s += meches(loin, 'url(#bdFond)', SOMBRE, 0.5, '#8E1A10');
  s += meches(pres, 'url(#bdOr)', ROUGE, 0.42, '#D8401E');
  // la cape, au bord déchiré ; son grain : des points serrés, clairs et brûlés, comme la flamme vue de près
  const dCape = cape(rnd(5));
  s += griffe(-1) + griffe(1);
  s += `<path d="${dCape}" fill="url(#bdOr)" stroke="${ROUGE}" stroke-width=".5" stroke-linejoin="round"/><g clip-path="url(#bdCape)">`;
  for (let i = 0; i < 260; i++) {
    const x = 5 + g() * 30, y = 11 + g() * 34;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.1 + g() * 0.2)}" fill="${i % 4 ? '#FFFBE6' : '#E8742A'}" opacity="${f(0.3 + g() * 0.5)}"/>`;
  }
  s += '<path d="M8,40 Q6.4,30 11,20 M32,40 Q33.6,30 29,20 M10.4,42 Q9.4,34 13,26 M29.6,42 Q30.6,34 27,26" fill="none" stroke="#E8642A" stroke-width=".26" stroke-linecap="round" opacity=".7"/></g>';
  // la flamme : dorée, le cœur presque blanc, ses mèches dessinées dedans
  s += `<path d="${flamme(0)}" fill="url(#bdCorps)" stroke="${ROUGE}" stroke-width=".8" stroke-linejoin="round"/>`;
  s += '<g clip-path="url(#bdDedans)" fill="none" stroke="#E8642A" stroke-width=".24" stroke-linecap="round" opacity=".65">'
    + '<path d="M12.6,40 Q12.4,31 17.6,22 M27.4,40 Q27.6,31 22.4,22 M15,40.4 Q15.4,33 18.8,26.6 M25,40.4 Q24.6,33 21.2,26.6 M20,15.6 L20,20.4"/></g>';
  // les marques rouges sur les joues : trois traits de chaque côté
  s += [-1, 1].map(k => [0, 1, 2].map(i => `<path d="M${f(20 + k * 4.4)},${f(34.2 + i * 1.1)} L${f(20 + k * 7.6)},${f(33.7 + i * 1.5)}" stroke="${ROUGE}" stroke-width="${f(0.55 - i * 0.08)}" stroke-linecap="round"/>`).join('')).join('');
  // les sourcils froncés, les yeux de braise en amande (un liseré rouge, la pupille en fente, une étincelle)
  s += `<path d="M12.4,28.4 Q15.6,28.8 18.6,30.6 L18.3,31.5 Q15.4,30.2 12.3,29.7 Z M27.6,28.4 Q24.4,28.8 21.4,30.6 L21.7,31.5 Q24.6,30.2 27.7,29.7 Z" fill="${SOMBRE}"/>`;
  s += [[16.1, -1], [23.9, 1]].map(([x, k]) => {
    const oeil = `M${f(x - 2.5)},${f(32.5 + k * 0.35)} Q${f(x - 0.2 * k)},${f(30.3)} ${f(x + 2.5)},${f(32.5 - k * 0.35)} Q${f(x + 0.2 * k)},${f(33.9)} ${f(x - 2.5)},${f(32.5 + k * 0.35)} Z`;
    return `<path d="${oeil}" fill="url(#bdOeil)" stroke="${ROUGE}" stroke-width=".55" stroke-linejoin="round"/>`
      + `<ellipse cx="${f(x)}" cy="32.2" rx=".38" ry="1.1" fill="${SOMBRE}"/><circle cx="${f(x - 0.9)}" cy="31.6" r=".28" fill="#FFFFFF"/>`;
  }).join('');
  // le sourire à crocs
  s += `<path d="M15.6,36.2 Q20,40.6 24.4,36.2 Q20,38.3 15.6,36.2 Z" fill="#5A0A08" stroke="${ROUGE}" stroke-width=".45" stroke-linejoin="round"/>`
    + [[17, 36.9, 1.1], [18.7, 37.5, 1.5], [21.3, 37.5, 1.5], [23, 36.9, 1.1]].map(([x, y, h]) => `<path d="M${f(x - 0.55)},${f(y - 0.25)} L${f(x)},${f(y + h)} L${f(x + 0.55)},${f(y - 0.25)} Z" fill="#FFFBF0"/>`).join('');
  // des étincelles qui montent autour
  s += [[3, 14, 0.4], [37, 12, 0.36], [8, 2, 0.32], [32, 0, 0.32], [24, -6, 0.36], [-2, 26, 0.3], [42, 24, 0.3], [13, -4, 0.26], [40, 4, 0.26], [0, 6, 0.26]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${f(r * 2.4)}" fill="#FF9A2E" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6D0"/>`).join('');
  return s;
}

module.exports = { brumeHeroine, brumeDemon };
