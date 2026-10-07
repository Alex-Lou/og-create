// Lot M (suite des égarés, egares.js) : ce que la nuit et le tutoriel montrent encore (HISTOIRE § 6.15, § 9, § 6.14).
// - le bâtiment embrumé : la brume grise posée au pied du bâtiment et qui monte le long de ses flancs, par emprise
//   (1 × 1, 2 × 2, 3 × 3 cases ; le jeu grise le bâtiment dessous avec un filtre), le petit nuage gris à poser au-dessus
//   (comme une bulle), la guérison (réparation ou passage d'Anya), l'icône « Réparer » ;
// - le tutoriel : la cage aux poules de la cuisine du navire (coincée sous les rochers, puis ouverte), l'œuf, le crabe
//   de la Grève (étape 8) ;
// - les signes d'Anya qui erre : des fleurs qui s'ouvrent, des lucioles rassemblées.
// Échelle du jeu × 1,25 (case de 80 × 40), ancre (0, 0) au centre de la case (au centre de l'emprise pour la brume).
const { OUT, P, E, L, clip, r2 } = require('./troupe');
const Bt = require('./betes');

// ---- petits morceaux ----
const halo = (x, y, r, rgb = '255,240,170', a = 0.5) => [1, 0.7, 0.45].map((k, i) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * k)}" fill="rgba(${rgb},${r2(a * (0.35 + i * 0.3))})"/>`).join('');
const etincelle = (x, y, s = 1, fill = '#FFF6C8', line = '#E8C860') => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="${fill}" stroke="${line}" stroke-width="${r2(0.35 * s)}"/>`;
const ombre = (rx, ry, x = 0, y = 0) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="rgba(40,55,20,.18)"/>`;
// un trait de couleur (tige, patte, corde) : sans remplissage, bouts ronds
const trait = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// tirage stable (même dessin à chaque génération)
const graine = s => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

// ---- le bâtiment embrumé ----
const BRUME = { clair: '#E4E9F1', corps: '#CCD4E1', dessous: '#AEB8CA', trait: 'rgba(59,71,99,.45)' };
// une bouffée de brume : un rond pâle, plus sombre dessous
const bouffee = (x, y, r, a = 0.92) => `<g opacity="${a}"><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${BRUME.corps}" stroke="${BRUME.trait}" stroke-width="1.1"/>`
  + `<path d="M${r2(x - r * 0.86)},${r2(y + r * 0.2)} Q${r2(x)},${r2(y + r * 1.1)} ${r2(x + r * 0.86)},${r2(y + r * 0.2)} Q${r2(x)},${r2(y + r * 0.62)} ${r2(x - r * 0.86)},${r2(y + r * 0.2)} Z" fill="${BRUME.dessous}"/>`
  + `<circle cx="${r2(x - r * 0.32)}" cy="${r2(y - r * 0.34)}" r="${r2(r * 0.28)}" fill="${BRUME.clair}"/></g>`;
// une écharpe de brume posée en travers du bâtiment (une bande qui ondule, plus claire au milieu)
const echarpe = (x, y, w, f, a = 0.6) => {
  const o = [0, 1.2, -1.2][f];
  const d = `M${r2(x - w)},${r2(y + 3)} Q${r2(x - w / 2)},${r2(y - 3 + o)} ${r2(x)},${r2(y + 1)} Q${r2(x + w / 2)},${r2(y + 5 - o)} ${r2(x + w)},${r2(y - 1)}`;
  return `<g opacity="${a}">${trait(d, BRUME.dessous, 9)}${trait(d, BRUME.corps, 6.5)}${trait(d, BRUME.clair, 2.2)}</g>`;
};
// n : cases de côté ; f : image (0 à 2, la brume ondule) ; k : 1 = épaisse, puis elle se dissipe (guérison)
function brumeAuPied(n, f, k = 1) {
  const a = 40 * n, b = 20 * n, rnd = graine(7 + n * 31);
  let back = '', front = '';
  // derrière (les deux bords du fond, plus pâles) puis devant (les deux bords de face), assis sur le sol
  const tour = [[-a, 0, 0, -b], [0, -b, a, 0], [a, 0, 0, b], [0, b, -a, 0]];
  tour.forEach(([x0, y0, x1, y1], e) => {
    const nb = 1 + n * 2;
    for (let i = 0; i <= nb; i++) {
      const t = (i + 0.3 + rnd() * 0.4) / (nb + 1), j = rnd();
      const x = x0 + (x1 - x0) * t + Math.sin((f + i) * 2.1) * 1.6, y = y0 + (y1 - y0) * t;
      const r = (e < 2 ? 5 + n * 1.6 : 6.5 + n * 2.2) * (0.75 + j * 0.6) * (0.55 + 0.45 * k);
      const s = bouffee(x, y - r * 0.45 - Math.cos((f + i) * 1.7) * 0.8, r, (e < 2 ? 0.6 : 0.9) * k);
      if (e < 2) back += s; else front += s;
    }
  });
  return { back, front };
}
function embrume(n, f) {
  const a = 40 * n, h = 34 + 40 * n;
  const { back, front } = brumeAuPied(n, f);
  // un voile pâle sur l'emprise, deux écharpes de brume en travers du bâtiment
  const voile = `<path d="M${-a},0 L0,${-20 * n} L${a},0 L0,${20 * n} Z" fill="rgba(200,208,222,.35)"/>`;
  return voile + back + echarpe(-a * 0.05, -h * 0.62, a * 0.55, f, 0.5) + echarpe(a * 0.05, -h * 0.32, a * 0.75, (f + 1) % 3, 0.6) + front;
}
// guérison : la brume se dissipe, des étincelles dorées montent (f : 0 à 2)
function guerison(n, f) {
  const a = 40 * n, h = 34 + 40 * n, k = [0.65, 0.35, 0][f];
  const { back, front } = brumeAuPied(n, f, k || 0.01);
  let s = k ? back + front : '';
  const rnd = graine(91 + n);
  const nb = 4 + 3 * n;
  for (let i = 0; i < nb; i++) {
    const x = (rnd() * 2 - 1) * a * 0.8, y0 = -rnd() * h * 0.5;
    s += etincelle(x, y0 - f * 12 - rnd() * 8, 1.6 + rnd() * 1.4);
  }
  return s + (f === 2 ? halo(0, -h * 0.4, a * 0.6, '255,240,170', 0.25) : '');
}
// le petit nuage gris à poser au-dessus du bâtiment embrumé (comme une bulle de production) ; ancre : son pied
function nuage(f) {
  const dy = [0, -1.5, -0.5][f];
  const d = `M-15,${r2(-6 + dy)} Q-17,${r2(-15 + dy)} -9,${r2(-16 + dy)} Q-7,${r2(-24 + dy)} 1,${r2(-22 + dy)} Q7,${r2(-28 + dy)} 12,${r2(-20 + dy)} Q19,${r2(-18 + dy)} 16,${r2(-9 + dy)} Q16,${r2(-4 + dy)} 9,${r2(-4 + dy)} L-10,${r2(-4 + dy)} Q-16,${r2(-3 + dy)} -15,${r2(-6 + dy)} Z`;
  // quelques gouttes de brume qui tombent, une petite moue (il boude lui aussi)
  const gouttes = [[-7, 0], [1, 2], [8, -1]].map(([x, y], i) => E(x + (f === i ? 0 : 0.4), y + dy + (f + i) % 3 * 0.8, 1, 1.4, BRUME.dessous, 0.7)).join('');
  return gouttes + P(d, BRUME.corps, 1.2).replace(OUT, '#4A5470') + clip(`nuage${f}`, d, `<rect x="-18" y="${r2(-11 + dy)}" width="36" height="9" fill="${BRUME.dessous}"/>`) + P(d, 'none', 1.2).replace(OUT, '#4A5470')
    + L([-8, -17 + dy], [-4, -19.5 + dy], BRUME.clair, 1.6)
    + E(-2.5, -12 + dy, 1, 1.3, '#4A5470', 0) + E(4.5, -12.4 + dy, 1, 1.3, '#4A5470', 0)
    + P(`M-0.6,${r2(-8.6 + dy)} Q1,${r2(-9.8 + dy)} 2.6,${r2(-8.6 + dy)}`, 'none', 0.8).replace(OUT, '#4A5470');
}
// l'icône « Réparer » (32 × 32) : un marteau sur une bouffée de brume, une étincelle
function reparerIcone() {
  return bouffee(12, 21, 8, 1) + `<g transform="rotate(-40 18 14)">`
    + `<rect x="16.6" y="9" width="3" height="18" rx="1.2" fill="#B07A48" stroke="${OUT}" stroke-width="1.2"/>`
    + `<rect x="11" y="5" width="14" height="6.4" rx="1.4" fill="#9AA4B4" stroke="${OUT}" stroke-width="1.2"/>`
    + `<rect x="12.4" y="6" width="5" height="1.6" rx="0.6" fill="#D6DCE6"/></g>` + etincelle(25.5, 22, 2.2);
}

// ---- la cage aux poules de la cuisine du navire (étape 8) ----
const POULES = [['#D9773A', '#B85E2C'], ['#F6F1E6', '#D8D0C0'], ['#3A3436', '#262224']];
// boîte vue de trois quarts (cases du jeu) : demi-largeur w, demi-profondeur w / 2, hauteur h
function cage(etat, f = 0) {
  const ouverte = etat === 'ouverte';
  const jx = ouverte ? 0 : [0, 0.8][f];
  const w = 22, d = 11, h = 24;
  const bois = '#B98A55', boisS = '#94693E', boisH = '#D2A672', corde = '#D8C08A';
  const g = s => `<g transform="translate(${jx} 0)">${s}</g>`;
  const L0 = `M${-w},0 L0,${d} L0,${d - h} L${-w},${-h} Z`, R0 = `M0,${d} L${w},0 L${w},${-h} L0,${d - h} Z`, T0 = `M${-w},${-h} L0,${d - h} L${w},${-h} L0,${-d - h} Z`;
  let s = ombre(30, 11, 2, 2);
  // le fond de la cage (on voit dedans par les barreaux) et les poules
  s += P(`M${-w},${-h} L0,${-d - h} L${w},${-h} L${w},0 L0,${d} L${-w},0 Z`, '#5A4632', 0);
  if (!ouverte) {
    // trois têtes de poules derrière les barreaux, qui s'agitent
    s += clip(`cg${etat}${f}`, `${L0} ${R0}`, POULES.map(([c, cs], i) => {
      const x = -13 + i * 12, y = -8 - (i === 1 ? 3 : 0) - (f && i !== 1 ? 1.2 : 0);
      return E(x, y + 6, 6.4, 5, cs, 0.9) + E(x + 1, y, 4, 3.8, c, 0.9) + P(`M${x},${y - 3.6} Q${x + 1},${y - 6.4} ${x + 2.2},${y - 3.8} Q${x + 3.2},${y - 5.4} ${x + 3.8},${y - 3.2} Z`, '#D8443A', 0.7)
        + E(x + 2.4, y - 0.6, 0.6, 0.7, '#2A2420', 0) + P(`M${x + 4.6},${y + 0.2} L${x + 6.4},${y + 0.9} L${x + 4.6},${y + 1.6} Z`, '#F2B640', 0.6);
    }).join(''));
  }
  // les faces : montants, barreaux (devant à gauche et à droite), le dessus en lattes
  const barres = (x0, y0, x1, y1, nb) => Array.from({ length: nb }, (_, i) => { const t = (i + 1) / (nb + 1); const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; return L([x, y - 1], [x, y - h + 1], OUT, 2.6) + L([x, y - 1], [x, y - h + 1], boisH, 1.2); }).join('');
  const cadre = (pts) => P(`M${pts.map(p => p.join(',')).join(' L')} Z`, 'none', 1.2);
  s += barres(-w, 0, 0, d, 4);
  if (!ouverte) s += barres(0, d, w, 0, 4);
  // les traverses du haut et du bas
  s += [[[-w, 0], [0, d]], [[0, d], [w, 0]]].map(([a, b2]) => L([a[0], a[1] - 1.4], [b2[0], b2[1] - 1.4], OUT, 4) + L([a[0], a[1] - 1.4], [b2[0], b2[1] - 1.4], bois, 2.4) + L([a[0], a[1] - h + 1.4], [b2[0], b2[1] - h + 1.4], OUT, 4) + L([a[0], a[1] - h + 1.4], [b2[0], b2[1] - h + 1.4], bois, 2.4)).join('');
  s += P(T0, bois, 1.2) + [0.25, 0.5, 0.75].map(t => L([-w + w * t, -h + d * t], [w * t, -h - d + d * t], boisS, 0.8)).join('') + L([-w + 3, -h], [-4, -h - d + 2], boisH, 1);
  s += cadre([[-w, 0], [0, d], [w, 0], [w, -h], [0, -d - h], [-w, -h]]) + L([0, d], [0, d - h], OUT, 1.2);
  // la porte de la face droite : fermée par un loquet ; ouverte, rabattue au sol
  if (ouverte) {
    s += P(`M0,${d} L${w},0 L${w + 8},8 L8,${d + 8} Z`, boisS, 1.1) + [0.25, 0.5, 0.75].map(t => L([w * t, d - d * t], [8 + w * t, d + 8 - d * t], OUT, 0.8)).join('');
    s += P(`M8,${d - 12} q3,-3 6,0 q-3,1 -6,0 Z`, '#F6F1E6', 0.6) + P(`M-6,${d + 6} q3,-2.6 6,0 q-3,0.8 -6,0 Z`, '#D9773A', 0.6);
  } else {
    s += `<rect x="${w * 0.5 - 1.6}" y="${d * 0.5 - h * 0.55}" width="3.2" height="4" rx="0.8" fill="#8E8A80" stroke="${OUT}" stroke-width="0.8"/>`;
  }
  // la poignée de corde, et (coincée) les rochers et une algue
  s += P(`M-6,${-h - d + 1} q6,-7 12,0`, 'none', 2.6) + trait(`M-6,${-h - d + 1} q6,-7 12,0`, corde, 1.2);
  s = g(s);
  const rocher = (x, y, rx, ry) => P(`M${x - rx},${y} Q${x - rx},${y - ry * 1.4} ${x},${y - ry * 1.5} Q${x + rx},${y - ry * 1.3} ${x + rx},${y} Q${x},${y + ry * 0.5} ${x - rx},${y} Z`, '#9A958C', 1.2) + P(`M${x + rx * 0.2},${y - ry * 1.3} Q${x + rx * 0.9},${y - ry * 1.1} ${x + rx},${y} Q${x + rx * 0.5},${y + ry * 0.2} ${x + rx * 0.3},${y + ry * 0.1} Z`, '#7E7A72', 0) + L([x - rx * 0.6, y - ry * 0.8], [x - rx * 0.2, y - ry * 1.2], '#BDB8AE', 1.2);
  s = rocher(-30, 4, 13, 10) + s + rocher(26, 8, 11, 8) + rocher(-14, 14, 9, 6);
  s += trait('M-34,-4 q-4,6 1,10 q3,3 -1,8', '#4E7A3A', 2);
  if (!ouverte && f) s += P('M30,-26 q3,-3 6,0 q-3,1 -6,0 Z', '#F6F1E6', 0.6) + P('M-32,-22 q2.6,-2.6 5.2,0 q-2.6,0.8 -5.2,0 Z', '#D9773A', 0.6);
  return s;
}

// ---- l'œuf : posé au sol, et son icône ----
const OEUF = 'M0,0.6 C-5.2,0.6 -5.6,-6.4 -3.4,-9.4 C-1.8,-11.8 1.8,-11.8 3.4,-9.4 C5.6,-6.4 5.2,0.6 0,0.6 Z';
const oeufCorps = (id, w) => P(OEUF, '#F8EEDA', 0) + clip(id, OEUF, '<ellipse cx="3.6" cy="-3" rx="4.2" ry="7" fill="#E6D4B2"/><ellipse cx="0" cy="1.4" rx="6" ry="2.4" fill="#E6D4B2"/>')
  + P(OEUF, 'none', w) + E(-1.9, -7.4, 0.9, 1.6, '#FFFFFF', 0) + E(2.2, -4.6, 0.35, 0.35, '#CDB894', 0) + E(-0.8, -3.2, 0.3, 0.3, '#CDB894', 0);
const oeuf = () => ombre(6, 2.2, 1, 1) + oeufCorps('oeuf', 1.1);
const oeufIcone = () => `<g transform="translate(16 27.5) scale(2.1)">${oeufCorps('oeufi', 0.62)}</g>` + etincelle(24.5, 8.5, 2);

// ---- le crabe de la Grève (étape 8) : de face, il marche de côté (vers la droite ; le miroir pour la gauche) ----
// poses comme les bêtes de profil : marche1, marche2, repos, clignement, joie (pinces en l'air, un cœur)
function crabe(pose) {
  const walk = pose === 'marche1' || pose === 'marche2', n = pose === 'marche2' ? 1 : 0;
  const joie = pose === 'joie';
  const C = '#E8734A', CS = '#C85A36', CH = '#F6A27E', V = '#F6C7A0';
  const y = -5.4 - (walk && n ? 0.5 : 0);
  let s = ombre(8, 1.8, 0, 0.2);
  // les pattes : trois de chaque côté, qui se lèvent en alternance quand il marche
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const lift = walk && (i + n + (side > 0 ? 1 : 0)) % 2 ? -1.2 : 0;
    const x0 = side * (3 + i * 1.2), x1 = side * (6.4 + i * 1.4), x2 = side * (7.6 + i * 1.5);
    s += P(`M${r2(x0)},${r2(y + 1)} L${r2(x1)},${r2(y - 0.6 + lift)} L${r2(x2)},${r2(0 + lift * 0.4)}`, 'none', 2.4) + trait(`M${r2(x0)},${r2(y + 1)} L${r2(x1)},${r2(y - 0.6 + lift)} L${r2(x2)},${r2(0 + lift * 0.4)}`, CS, 1);
  }
  // les pinces (levées quand il est content, un peu ouvertes en marchant)
  const pince = side => {
    const up = joie ? -6 : walk ? -1.2 * (n ? 1 : -1) * side * 0.5 : 0;
    const bx = side * 8.6, by = y - 3.4 + up;
    return P(`M${r2(side * 4.4)},${r2(y - 1)} Q${r2(side * 6.6)},${r2(y - 2.4 + up / 2)} ${r2(bx)},${r2(by + 1.4)}`, 'none', 2.6) + trait(`M${r2(side * 4.4)},${r2(y - 1)} Q${r2(side * 6.6)},${r2(y - 2.4 + up / 2)} ${r2(bx)},${r2(by + 1.4)}`, C, 1.2)
      + E(bx, by, 2.6, 2.2, C, 1) + P(`M${r2(bx + side * 0.6)},${r2(by - 2)} L${r2(bx + side * 2.4)},${r2(by - 3.6)} L${r2(bx + side * 1.8)},${r2(by - 0.8)} Z`, C, 0.9) + L([bx - side * 0.8, by - 0.8], [bx - side * 0.2, by - 1.6], CH, 0.8);
  };
  s += pince(-1) + pince(1);
  // la carapace, ronde et large ; le ventre clair dessous
  const shell = `M-6.4,${r2(y + 1.6)} Q-7,${r2(y - 4.2)} 0,${r2(y - 4.6)} Q7,${r2(y - 4.2)} 6.4,${r2(y + 1.6)} Q0,${r2(y + 3.6)} -6.4,${r2(y + 1.6)} Z`;
  s += P(shell, C) + clip(`crabe${pose}`, shell, `<path d="M-8,${r2(y + 0.6)} Q0,${r2(y + 2.8)} 8,${r2(y + 0.6)} L8,${r2(y + 4)} L-8,${r2(y + 4)} Z" fill="${V}"/><ellipse cx="4" cy="${r2(y - 1)}" rx="3" ry="4" fill="${CS}" opacity="0.6"/>`) + P(shell, 'none')
    + L([-4.4, y - 2.6], [-2, y - 3.6], CH, 1);
  // les yeux sur leurs tiges
  const eyeMode = pose === 'clignement' ? 'blink' : joie ? 'joy' : 'open';
  for (const side of [-1, 1]) {
    const ex = side * 1.9, ey = y - 7.4;
    s += L([side * 1.4, y - 4], [ex, ey + 1.2], OUT, 1.6) + L([side * 1.4, y - 4], [ex, ey + 1.2], CS, 0.6) + E(ex, ey, 1.5, 1.6, '#FFFFFF', 0.8) + Bt.eye(ex + 0.1, ey + 0.1, 0.95, eyeMode);
  }
  s += joie ? P(`M-1.4,${r2(y - 0.4)} Q0,${r2(y + 1)} 1.4,${r2(y - 0.4)}`, 'none', 0.7) + Bt.heartIcon(0, y - 12.6, 1.3) : P(`M-1,${r2(y)} Q0,${r2(y + 0.6)} 1,${r2(y)}`, 'none', 0.6);
  return s;
}

// ---- les signes d'Anya ----
// des fleurs qui s'ouvrent sur son passage (f : 0 boutons, 1 et 2 elles s'ouvrent, 3 ouvertes, une lueur dorée)
function fleurs(f) {
  const tiges = [[-9, 2, -15, '#F4E9C8'], [0, -2, -20, '#FFFFFF'], [9, 3, -14, '#F8D9E0'], [-2, 7, -11, '#F4E9C8']];
  let s = ombre(16, 5, 0, 2);
  // la touffe d'herbe
  s += P('M-14,4 Q-12,-4 -9,3 Q-8,-6 -4,3 Q-2,-5 1,3 Q3,-6 6,3 Q8,-4 11,4 Q14,-2 15,5 Q0,9 -14,4 Z', '#6FA84E', 1.1) + trait('M-8,4 Q-4,-1 0,4 Q4,0 8,5', '#5A8E3E', 1);
  const ouv = [0, 0.4, 0.75, 1][f];
  for (const [x, y, top, col] of tiges) {
    const hx = x + (top + 18) * 0.15, hy = y + top;
    s += P(`M${x},${y} Q${r2(x + 1.4)},${r2(y + top / 2)} ${r2(hx)},${r2(hy)}`, 'none', 2.4) + trait(`M${x},${y} Q${r2(x + 1.4)},${r2(y + top / 2)} ${r2(hx)},${r2(hy)}`, '#5E9A42', 1.1);
    if (!ouv) { s += E(hx, hy - 1.6, 1.8, 2.8, '#8DC46A', 0.9) + trait(`M${r2(hx - 0.6)},${r2(hy - 3.8)} Q${hx},${r2(hy - 5)} ${r2(hx + 0.6)},${r2(hy - 3.8)}`, col, 1.2); continue; }
    // cinq pétales qui s'écartent du cœur, un cœur doré
    const r = 1.6 + 2.6 * ouv;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      const px = hx + Math.cos(a) * r * 0.75, py = hy + Math.sin(a) * r * 0.55;
      s += `<ellipse cx="${r2(px)}" cy="${r2(py)}" rx="${r2(r * 0.55)}" ry="${r2(r * 0.4 + 0.4)}" fill="${col}" stroke="${OUT}" stroke-width="0.8" transform="rotate(${r2(a * 180 / Math.PI + 90)} ${r2(px)} ${r2(py)})"/>`;
    }
    s += E(hx, hy, 1.2 + ouv * 0.4, 1 + ouv * 0.3, '#F2C640', 0.7);
  }
  if (f === 3) s = halo(0, -10, 20, '255,232,150', 0.3) + s + etincelle(-13, -22, 1.4) + etincelle(12, -25, 1.2) + etincelle(3, -30, 1);
  return s;
}
// des lucioles rassemblées, qui tournent doucement ensemble au-dessus du sol (f : 0 à 3)
function lucioles(f) {
  const nb = 9, rnd = graine(1234);
  const pts = Array.from({ length: nb }, (_, i) => ({ a: (i / nb) * Math.PI * 2 + rnd() * 0.5, rx: 8 + rnd() * 9, ry: 3 + rnd() * 4, h: 18 + rnd() * 14, s: 0.9 + rnd() * 0.5 }));
  let s = `<ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(255,236,150,.18)"/>` + halo(0, -26, 22, '255,236,150', 0.22);
  for (const p of pts) {
    const a = p.a + f * Math.PI / 8;
    const x = Math.cos(a) * p.rx, y = -p.h + Math.sin(a) * p.ry;
    const on = (Math.round(p.a * 10) + f) % 4 !== 0;
    s += halo(x, y, on ? 5 * p.s : 3.4 * p.s, '255,236,150', on ? 0.5 : 0.3) + E(x, y, 1.3 * p.s, 1.1 * p.s, on ? '#FFF3A0' : '#E8D880', 0);
  }
  return s;
}

// ---- 5. L'éclat du souvenir retrouvé (HISTOIRE.md § 14) : un éclat doré part du Grimoire vers le naufragé ; à
// l'arrivée, une gerbe de lumière l'enveloppe (le jeu le change en maître sous l'éclair) ; son sceau s'allume au-dessus
// de sa tête ; il se lève, outil en main (la pose « action » du maître). Ancre (0, 0) : le centre de l'éclat, les pieds
// du naufragé, le centre du sceau.
const OR = { clair: '#FFF6C8', vif: '#F6D25A', base: '#E8B23A', ambre: '#E8A93A', trait: '#9A6A1A' };
// étoile à n branches (rayons r1 et r2), tournée de rot degrés
function etoileD(x, y, r1, r2_, n, rot) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) { const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2_ : r1; pts.push(`${r2(x + Math.cos(a) * r)},${r2(y + Math.sin(a) * r)}`); }
  return `M${pts.join(' L')} Z`;
}
// L'éclat qui voyage du Grimoire au naufragé : une étoile dorée à quatre branches qui tourne et pulse, une plus petite
// croisée dessus, un cœur blanc, trois étincelles en orbite (4 images en boucle ; le jeu le fait glisser)
function eclat(f) {
  const k = [1, 1.12, 1, 0.9][f % 4], rot = f * 11.25;
  let s = halo(0, 0, 11 * k, '255,226,130', 0.42);
  s += P(etoileD(0, 0, 8 * k, 2.3 * k, 4, rot - 90), OR.vif, 0.9).replace(`stroke="${OUT}"`, `stroke="${OR.trait}"`);
  s += P(etoileD(0, 0, 4.8 * k, 1.6 * k, 4, rot - 45), OR.clair, 0);
  s += E(0, 0, 1.9 * k, 1.9 * k, '#FFFFFF', 0);
  for (let i = 0; i < 3; i++) { const a = f * Math.PI / 4 + i * Math.PI * 2 / 3; s += etincelle(Math.cos(a) * 9, Math.sin(a) * 5.4, 0.75); }
  return s;
}
// La gerbe d'arrivée, posée sur le naufragé (pieds en (0, 0), un naufragé fait ~60 de haut) : 5 images, une fois.
// 0 : l'éclat frappe la poitrine ; 1-2 : une colonne de lumière monte, un anneau s'étale au sol ; 3-4 : elle s'éteint en
// étincelles qui montent
function arrivee(f) {
  let s = '';
  const col = (w, a, top) => `<path d="M${-w},0 L${-w},${top + w} Q${-w},${top} 0,${top} Q${w},${top} ${w},${top + w} L${w},0 Z" fill="rgba(255,230,140,${a})"/>`;
  if (f === 0) {
    s += halo(0, -30, 24, '255,226,130', 0.5);
    s += P(etoileD(0, -30, 15, 3.4, 4, -90), OR.vif, 0.9).replace(`stroke="${OUT}"`, `stroke="${OR.trait}"`) + P(etoileD(0, -30, 9, 2.4, 4, -45), OR.clair, 0) + E(0, -30, 3.2, 3.2, '#FFFFFF', 0);
  }
  if (f === 1 || f === 2) {
    const big = f === 2;
    s += `<ellipse cx="0" cy="0" rx="${big ? 22 : 15}" ry="${big ? 6.8 : 4.8}" fill="none" stroke="${OR.vif}" stroke-width="${big ? 1.2 : 1.8}" opacity="${big ? 0.55 : 0.9}"/>`;
    s += col(big ? 13 : 10, big ? 0.32 : 0.26, -66) + col(big ? 7 : 5, big ? 0.38 : 0.3, -62);
    s += halo(0, -30, big ? 20 : 16, '255,236,160', big ? 0.32 : 0.42);
  }
  if (f === 3) s += col(11, 0.14, -66) + col(5, 0.16, -60);
  // étincelles qui montent le long de la colonne
  const SP = [[-9, -14], [8, -22], [-6, -36], [10, -44], [-11, -52], [4, -60], [-2, -68], [12, -64]];
  const from = [0, 0, 2, 4, 5][f], to = [3, 5, 7, 8, 8][f];
  SP.slice(from, to).forEach(([x, y], i) => { s += etincelle(x, y - f * 2, [1.3, 1.1, 0.9][i % 3] * (f === 4 ? 0.7 : 1)); });
  return s;
}
// Les sept sceaux du Grimoire (sigles de src/book/grimoire.js, viewBox 24 × 24 ; un par chapitre, chacun a son maître)
const SCEAUX = [
  ['mercure', 'Mercure ☿ (Aster)', 'M8 2.5a4 4 0 0 0 8 0M16 9.5a4 4 0 1 1-8 0a4 4 0 1 1 8 0M12 13.5v8M8.8 18h6.4'],
  ['saturne', 'Saturne ♄ (Galet)', 'M9 2.5v12M5.8 5.6h6.4M9 11.5c1.6-2.8 6.6-2.6 6.6 1.6c0 2.6-3 3.6-3 6.2c0 1.2.8 2.2 2.2 2.2'],
  ['lune', 'Lune ☾ (Ondin)', 'M15.5 3.2a8.8 8.8 0 1 0 0 17.6a7.2 7.2 0 1 1 0-17.6z'],
  ['venus', 'Vénus ♀ (Sylve et Mélisse)', 'M17 8.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M12 13.5v8.5M8.5 18.2h7'],
  ['mars', 'Mars ♂ (Cannelle)', 'M14.5 14.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M13.2 10.8L20 4M14.6 4H20v5.4'],
  ['jupiter', 'Jupiter ♃ (Rivet)', 'M5.5 7c1.4-2.6 5.6-3 6.6-.4c1 2.6-2 6.4-6.4 10.4h13.6M16 11.5v10'],
  ['soleil', 'Soleil ☉ (Brume)', 'M20 12a8 8 0 1 1-16 0a8 8 0 1 1 16 0M13.7 12a1.7 1.7 0 1 1-3.4 0a1.7 1.7 0 1 1 3.4 0']
];
// Un sceau : médaillon rond (éteint : bronze terni ; allumé : ambre, le sigle luit, un halo qui respire en 2 images)
function sceau(i, allume, f = 0) {
  const d = SCEAUX[i][2], k = 0.6;
  const sig = (color, w, extra = '') => `<path d="${d}" transform="translate(${-12 * k} ${-12 * k}) scale(${k})" fill="none" stroke="${color}" stroke-width="${r2(w / k)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  let s = '';
  if (allume) {
    s += halo(0, 0, f ? 15 : 13, '255,220,120', f ? 0.48 : 0.4);
    s += E(0, 0, 9.6, 9.6, OR.ambre) + E(-0.8, -0.9, 7.4, 7.4, OR.vif, 0) + `<circle cx="0" cy="0" r="7.8" fill="none" stroke="${OR.trait}" stroke-width="0.6"/>`;
    s += sig('rgb(255,248,210)', 3.4, ' opacity="0.6"') + sig('#FFFBEA', 1.5);
    s += f ? etincelle(8.6, -8.4, 1) + etincelle(-9.4, 6.4, 0.7) : etincelle(-8.2, -8.8, 0.8);
  } else {
    s += E(0, 0, 9.6, 9.6, '#B2A282') + E(-0.8, -0.9, 7.4, 7.4, '#C6B898', 0) + `<circle cx="0" cy="0" r="7.8" fill="none" stroke="#8E7E60" stroke-width="0.6"/>`;
    s += sig('#7A6A4E', 1.5);
  }
  return s;
}

module.exports = { embrume, guerison, nuage, reparerIcone, cage, oeuf, oeufIcone, crabe, fleurs, lucioles, eclat, arrivee, SCEAUX, sceau };
