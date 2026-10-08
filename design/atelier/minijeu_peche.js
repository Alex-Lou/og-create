// Mini-jeux — la Pêche (le Ponton) : trois couloirs d'eau, l'hameçon au milieu. Le jeu dessine sur un canvas : tout ce
// qui bouge est en suites d'images (pas de SMIL), en boucle (les prises qui nagent, le bouchon qui flotte, les vagues,
// les bulles) ou une fois (le bouchon qui plonge, l'éclaboussure, les ronds). Les prises sont de profil, tournées vers
// la droite : le jeu retourne l'image pour l'autre sens. Les fichiers déclarent × 4.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${x},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${y} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${x},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${y} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${x},${f(y - r)} Z" fill="${fill}"/>`;

// ——— les poissons (cadre 40 × 24, tournés vers la droite) ———
const POISSONS = {
  gardon: { dos: '#6E8EB0', corps: '#B8CCE0', ventre: '#F2F6FA', nageoire: '#E8604A', nom: 'gardon' },
  truite: { dos: '#6E8A52', corps: '#A8BE7A', ventre: '#F4EED8', nageoire: '#9AAE6A', raie: '#F0909A', nom: 'truite' },
  dore: { dos: '#E2A030', corps: '#FFD25A', ventre: '#FFF4C0', nageoire: '#F28A3A', nom: 'doré' }
};
// un poisson qui nage : k de 0 à 3 (la queue bat, le corps ondule, la nageoire rame) ; ferre : il se tord
function poisson(sorte, k, id) {
  const c = POISSONS[sorte], a = Math.sin(k / 4 * 2 * Math.PI), bend = a * 1.2;
  const corps = `M33,12 Q32,4.6 22,4.4 Q12,4.6 8.6,${f(10 + bend * 0.3)} Q8,12 8.6,${f(14 + bend * 0.3)} Q12,19.6 22,19.6 Q32,19.4 33,12 Z`;
  const g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.dos}"/><stop offset=".5" stop-color="${c.corps}"/><stop offset="1" stop-color="${c.ventre}"/></linearGradient><clipPath id="${id}c"><path d="${corps}"/></clipPath></defs>`;
  let s = g;
  // la queue (elle bat) et la nageoire du dos
  s += `<g transform="rotate(${f(a * 16)} 9 12)">${P('M9.6,12 Q5,7 1.6,5.2 Q3.4,12 1.6,18.8 Q5,17 9.6,12 Z', c.nageoire, 0.9)}<path d="M4.6,9 L8,11.4 M4.6,15 L8,12.6" stroke="${OUT}" stroke-width="0.4" opacity=".5"/></g>`;
  s += P(`M17,5.4 Q21,${f(0.8 + a * 0.4)} 26,4.8 Z`, c.nageoire, 0.8);
  s += P(corps, `url(#${id})`, 1);
  // écailles, raie, taches
  s += `<g clip-path="url(#${id}c)">` + [14, 18, 22, 26].map(x => `<path d="M${x},7 q2,3 0,6 q2,3 0,6" fill="none" stroke="${WHITE}" stroke-width="0.5" opacity=".45"/>`).join('')
    + (c.raie ? `<path d="M9,12.4 Q20,10 33,11.4" fill="none" stroke="${c.raie}" stroke-width="2.4" opacity=".75"/>` + [[15, 8], [20, 7.2], [25, 8.4], [18, 15.4], [24, 15.8]].map(([x, y]) => E(x, y, 0.6, 0.6, '#4E6A3A')).join('') : '')
    + `<path d="M10,8 Q20,5.6 30,7.4" fill="none" stroke="${WHITE}" stroke-width="1" opacity=".55"/></g>`;
  // la nageoire du ventre (elle rame), la branchie, l'œil chibi, la joue, la bouche
  s += `<g transform="rotate(${f(-a * 22)} 24 16.4)">${P('M24,16.4 Q22,20.6 19,20.2 Q21,18 22,16.2 Z', c.nageoire, 0.7)}</g>`;
  s += `<path d="M27.6,8.6 Q25.6,12 27.6,15.4" fill="none" stroke="${c.dos}" stroke-width="0.8"/>`;
  s += E(29.6, 10.4, 2, 2.3, '#2A2420') + E(30.2, 9.5, 0.8, 0.8, WHITE) + E(29.1, 11.4, 0.35, 0.35, WHITE) + E(28.8, 14.2, 1.3, 0.7, '#F29E9A').replace('/>', ' opacity=".7"/>');
  s += `<path d="M32.4,13.2 Q33.3,13.7 32.6,14.4" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/>`;
  if (sorte === 'dore') s += etoile(f(14 + k * 3), 6, k % 2 ? 1.6 : 2.2) + etoile(35.5, f(5 + k % 2), k % 2 ? 1.3 : 0.7);
  return s;
}
// la vieille botte, qui dérive (elle tangue, une bulle s'échappe, l'algue ondule)
function botte(k) {
  const a = Math.sin(k / 4 * 2 * Math.PI);
  let s = `<g transform="rotate(${f(a * 6)} 20 13)">`;
  s += P('M12,3.4 L22,3.4 L22.6,13 Q30,13.4 33.4,16.4 Q34.4,19.6 31,20.2 L11.4,20.2 Q10,20 10.4,17.6 L12,3.4 Z', '#8A5A3A', 1);
  s += P('M10.6,18 L33.6,18.4 Q34,20.4 31,20.6 L11.2,20.6 Q10.2,20.4 10.6,18 Z', '#5A3A24', 0.8);
  s += P('M11.6,3 L22.4,3 L22.4,5 L11.6,5 Z', '#6E4A30', 0.8);
  s += `<path d="M14,8 L20,8 M14,10.6 L20,10.6 M14.4,13 L20.4,13" stroke="#E8D8B8" stroke-width="0.7" stroke-linecap="round"/>`;
  s += `<path d="M24,14.4 Q28,14.6 30.6,16.4" fill="none" stroke="#B07A50" stroke-width="0.9" stroke-linecap="round"/>`;
  s += `<path d="M14,3 Q${f(12 + a * 2)},${-1} ${f(15 + a * 2)},-3.4" fill="none" stroke="#5E9A3C" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `</g>` + `<circle cx="${f(17 + k)}" cy="${f(2 - k * 0.6)}" r="${f(0.9 + k * 0.15)}" fill="none" stroke="#DDF2FF" stroke-width="0.6" opacity="${f(1 - k * 0.22)}"/>`;
  return s;
}
// le poisson ferré (cadre 24 × 40, tête en bas, au bout de la ligne) : il se tord, 2 images
function ferre(sorte, k, id) {
  if (sorte === 'botte') return `<path d="M12,0 L12,8" stroke="#E8E4DC" stroke-width="0.6"/><g transform="translate(12 8) rotate(${k ? 9 : -9}) scale(0.7) translate(-17 -3.4)">${botte(0)}</g>` + [0, 1, 2].map(i => `<circle cx="${f(9 + i * 3 + k)}" cy="${f(28 + i * 3 + k * 2)}" r="0.8" fill="#BFE6FF"/>`).join('');
  return `<path d="M12,0 L12,5.4" stroke="#E8E4DC" stroke-width="0.6"/><g transform="translate(12 22) rotate(${k ? 98 : 82}) translate(-21 -12)">${poisson(sorte, k ? 1 : 3, id)}</g>`
    + `<path d="M${k ? 3 : 21},12 l${k ? -2 : 2},-1.4 M${k ? 3.4 : 20.6},16 l${k ? -2.4 : 2.4},0" stroke="${WHITE}" stroke-width="0.9" stroke-linecap="round" opacity=".85"/>`;
}

// ——— le bouchon (cadre 16 × 24) : il flotte (2 images), il plonge quand ça mord (3 images) ———
function bouchon(etat, k) {
  const dy = etat === 'flotte' ? [0, 1][k] : [2, 6, 3][k], tilt = etat === 'flotte' ? [-4, 4][k] : [0, 12, -8][k];
  let s = '';
  if (etat === 'touche') s += [0, 1].map(i => E(8, 17.4, 4 + k * 2.2 + i * 2.6, 1.2 + k * 0.5 + i * 0.6, 'none').replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="0.7" opacity="${f(0.9 - k * 0.2 - i * 0.3)}"`)).join('');
  s += `<g transform="translate(0 ${dy}) rotate(${tilt} 8 14)"><path d="M8,1 L8,7" stroke="${OUT}" stroke-width="1.2" stroke-linecap="round"/><path d="M8,1 L8,7" stroke="#F2C04B" stroke-width="0.5" stroke-linecap="round"/>`
    + P('M8,6.4 Q12.6,10 12.4,13.6 L3.6,13.6 Q3.4,10 8,6.4 Z', '#E8504A', 0.9) + P('M3.6,13.6 L12.4,13.6 Q12.4,18.4 8,19.4 Q3.6,18.4 3.6,13.6 Z', '#FFFFFF', 0.9) + E(6.4, 10.4, 1, 1.4, WHITE).replace('/>', ' opacity=".7"/>') + `</g>`;
  s += E(8, 17.4 + (etat === 'touche' && k === 1 ? 1 : 0), 5.4, 1.1, '#5A9AC8').replace('/>', ' opacity=".35"/>');
  return s;
}
// l'hameçon (cadre 8 × 12)
const hamecon = () => `<path d="M4,0 L4,7.4 Q4,10.6 6.4,10 Q7.6,9.4 7,7.6" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M4,0 L4,7.4 Q4,10.6 6.4,10 Q7.6,9.4 7,7.6" fill="none" stroke="#C8D0D8" stroke-width="0.7" stroke-linecap="round"/><path d="M7,7.6 L6.2,6.8" stroke="#C8D0D8" stroke-width="0.7"/>`;

// ——— l'eau : l'éclaboussure (cadre 32 × 24, 4 images), les ronds (32 × 12, 3 images), les bulles (12 × 20, 3 images) ———
function eclabousse(k) {
  const t = (k + 1) / 4;
  let s = E(16, 21, 6 + t * 8, 1.6 + t * 1.2, 'none').replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="${f(1.4 - t)}" opacity="${f(1 - t * 0.7)}"`);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * (0.12 + 0.76 * i / 6), d = 3 + t * 11, h = Math.sin(t * Math.PI) * 9;
    const x = 16 + Math.cos(a) * d, y = 20 + Math.sin(a) * h * (i % 2 ? 0.7 : 1);
    s += P(`M${f(x)},${f(y - 2)} Q${f(x + 1.4)},${f(y + 0.2)} ${f(x)},${f(y + 1.2)} Q${f(x - 1.4)},${f(y + 0.2)} ${f(x)},${f(y - 2)} Z`, '#BFE6FF', 0.6).replace('/>', ` opacity="${f(1 - t * 0.6)}"/>`);
  }
  if (k < 2) s += P(`M10,20 Q12,${f(12 - k * 3)} 16,${f(10 - k * 4)} Q20,${f(12 - k * 3)} 22,20 Z`, '#DDF2FF', 0.7).replace('/>', ' opacity=".9"/>');
  return s;
}
const ronds = k => [0, 1].map(i => E(16, 6, 4 + k * 4 + i * 4, 1.4 + k * 1.2 + i * 1.1, 'none').replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="0.8" opacity="${f(0.9 - k * 0.25 - i * 0.3)}"`)).join('');
const bulles = k => [[4, 16, 1.4, 0], [8, 12, 1, 0.33], [5, 8, 0.8, 0.66]].map(([x, y, r, o]) => { const u = (k / 3 + o) % 1; return `<circle cx="${f(x + Math.sin(u * 6.3))}" cy="${f(y - u * 10 + 2)}" r="${r}" fill="#DDF2FF" fill-opacity=".35" stroke="#DDF2FF" stroke-width="0.6" opacity="${f(1 - u * 0.6)}"/><circle cx="${f(x + Math.sin(u * 6.3) - r * 0.35)}" cy="${f(y - u * 10 + 2 - r * 0.35)}" r="${f(r * 0.3)}" fill="${WHITE}"/>`; }).join('');

// ——— le décor : le couloir d'eau (64 × 20, se répète en largeur, 3 images de vagues), le ponton (64 × 16), le seau ———
function couloir(k) {
  let s = `<defs><linearGradient id="pe${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC4E8"/><stop offset="1" stop-color="#4C94C8"/></linearGradient></defs><rect x="0" y="0" width="64" height="20" fill="url(#pe${k})"/>`;
  for (const [y, a, o] of [[4, 1, 0], [10, 0.8, 0.5], [16, 1, 0.25]]) {
    const dx = ((k / 3 + o) % 1) * 16;
    let d = '';
    for (let x = -16; x < 80; x += 16) d += `M${f(x + dx)},${y} q4,-${a} 8,0 `;
    s += `<path d="${d}" fill="none" stroke="#D8F0FF" stroke-width="0.8" stroke-linecap="round" opacity=".7"/>`;
  }
  return s + `<rect x="0" y="0" width="64" height="1.4" fill="#2E6E9E" opacity=".35"/><rect x="0" y="18.6" width="64" height="1.4" fill="#2E6E9E" opacity=".45"/>`;
}
function ponton() {
  let s = '';
  for (let i = 0; i < 4; i++) { const x = i * 16; s += `<rect x="${x}" y="2" width="16" height="11" fill="${i % 2 ? '#C69460' : '#B98552'}"/><path d="M${x + 2},6 q6,-1 12,0 M${x + 3},10 q5,1 10,0" fill="none" stroke="#8A5A32" stroke-width="0.5" opacity=".7"/>` + E(x + 2.4, 4.4, 0.6, 0.6, '#5A3A24') + E(x + 13.6, 4.4, 0.6, 0.6, '#5A3A24'); }
  return s + `<path d="M0,2 L64,2 M0,13 L64,13 M16,2 L16,13 M32,2 L32,13 M48,2 L48,13" stroke="${OUT}" stroke-width="0.9"/><rect x="0" y="13" width="64" height="3" fill="#7A5230"/><path d="M0,2.8 L64,2.8" stroke="#E2B880" stroke-width="0.7" opacity=".7"/>`;
}
function seau(plein) {
  // le seau : corps, cerclages, l'eau (ou le fond), puis les prises qui sortent de l'eau, puis l'anse
  let s = P('M3.4,9 L20.6,9 L18.6,22 Q12,23.4 5.4,22 Z', '#A8B4C0', 1) + `<path d="M4.6,13 L19.4,13 M5.2,18 L18.8,18" stroke="#7C8C99" stroke-width="0.8"/>` + `<path d="M6,10.4 L7,20" stroke="${WHITE}" stroke-width="1" opacity=".5" stroke-linecap="round"/>`;
  s += E(12, 9, 8.6, 2, plein ? '#5A9AC8' : '#4E5C68', 1);
  if (plein) {
    // deux prises tête en haut, le bas caché sous la surface (découpé au niveau de l'eau), un rond d'eau à leur base
    const prise = (x, y, rot, miroir, sorte, id) => `<g transform="translate(${x} ${y}) scale(${miroir ? -0.4 : 0.4} 0.4) rotate(${rot}) translate(-21 -12)">${poisson(sorte, 1, id)}</g>`;
    s += `<clipPath id="sqc"><rect x="3.4" y="-2" width="17.2" height="11.4"/></clipPath><g clip-path="url(#sqc)">${prise(9.4, 6.4, -64, false, 'truite', 'sq1')}${prise(14.8, 6, -66, true, 'dore', 'sq2')}</g>`;
    s += E(9.4, 9.3, 1.7, 0.45, 'none').replace('fill="none"', 'fill="none" stroke="#DDF2FF" stroke-width="0.4"') + E(14.8, 9.3, 1.7, 0.45, 'none').replace('fill="none"', 'fill="none" stroke="#DDF2FF" stroke-width="0.4"');
  }
  return s + `<path d="M3.6,9 Q12,-1 20.4,9" fill="none" stroke="${OUT}" stroke-width="1.4"/><path d="M3.6,9 Q12,-1 20.4,9" fill="none" stroke="#C8D0D8" stroke-width="0.6"/>`;
}

// ——— les pièces : { id (le fichier), nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const NOMS = { gardon: 'Le gardon', truite: 'La truite', dore: 'Le doré', botte: 'La vieille botte' };
for (const s of ['gardon', 'truite', 'dore']) for (let k = 0; k < 4; k++) piece(`nage-${s}_${k + 1}`, `${NOMS[s]} qui nage`, [0, 0, 40, 24], () => poisson(s, k, `pn${s}${k}`), `nage-${s}`, 120, true);
for (let k = 0; k < 4; k++) piece(`nage-botte_${k + 1}`, 'La vieille botte qui dérive', [0, 0, 40, 24], () => botte(k), 'nage-botte', 160, true);
for (const s of ['gardon', 'truite', 'dore', 'botte']) for (let k = 0; k < 2; k++) piece(`ferre-${s}_${k + 1}`, `${NOMS[s]} ferré${s === 'truite' || s === 'botte' ? 'e' : ''} au bout de la ligne`, [0, 0, 24, 40], () => ferre(s, k, `pf${s}${k}`), `ferre-${s}`, 140, true);
for (let k = 0; k < 2; k++) piece(`bouchon-flotte_${k + 1}`, 'Le bouchon qui flotte', [0, 0, 16, 24], () => bouchon('flotte', k), 'bouchon-flotte', 400, true);
for (let k = 0; k < 3; k++) piece(`bouchon-touche_${k + 1}`, 'Le bouchon qui plonge (ça mord)', [0, 0, 16, 24], () => bouchon('touche', k), 'bouchon-touche', 120);
piece('hamecon', 'L\'hameçon', [0, 0, 8, 12], hamecon);
for (let k = 0; k < 4; k++) piece(`eclaboussure_${k + 1}`, 'L\'éclaboussure', [0, 0, 32, 24], () => eclabousse(k), 'eclaboussure', 90);
for (let k = 0; k < 3; k++) piece(`ronds_${k + 1}`, 'Les ronds dans l\'eau', [0, 0, 32, 12], () => ronds(k), 'ronds', 160);
for (let k = 0; k < 3; k++) piece(`bulles_${k + 1}`, 'Les bulles', [0, 0, 12, 20], () => bulles(k), 'bulles', 200, true);
for (let k = 0; k < 3; k++) piece(`couloir_${k + 1}`, 'Le couloir d\'eau (se répète en largeur)', [0, 0, 64, 20], () => couloir(k), 'couloir', 220, true);
piece('ponton', 'Les planches du ponton (se répètent en largeur)', [0, 0, 64, 16], ponton);
piece('seau_vide', 'Le seau, vide', [0, 0, 24, 24], () => seau(false));
piece('seau_plein', 'Le seau, plein', [0, 0, 24, 24], () => seau(true));

const TITRE = 'La Pêche (le Ponton)', FOND = '#4C94C8';
const LISEZ_MOI = 'La Pêche : le jeu dessine sur un canvas, tout ce qui bouge est en suites d\'images (boucle : vrai, à répéter ; sinon une fois). Les prises nagent vers la droite (retourner l\'image pour l\'autre sens) ; ferrées, elles pendent tête en bas, la ligne en haut au milieu. Le couloir d\'eau et le ponton se répètent en largeur.';
module.exports = { POISSONS, PIECES, TITRE, FOND, LISEZ_MOI, poisson, botte, ferre, bouchon, hamecon, eclabousse, ronds, bulles, couloir, ponton, seau };
