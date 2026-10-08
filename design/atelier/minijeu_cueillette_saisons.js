// Mini-jeux — la Cueillette, nouvelle version (design/conception/minijeux_grille.md, § 5) : la jauge de panier et son
// « double », le papillon doré et sa magie, les buissons de saison, la pie (elle arrive, vole un fruit, fuit), le nid qui
// grossit et le buisson perdu. Mêmes règles que la Cueillette : buisson 60 × 60, boucles en SMIL, coups en suites
// d'images, fichiers × 4.
const CU = require('./minijeu_cueillette');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;

// ——— la jauge de panier (96 × 20) : trois crans qui se remplissent ; pleine, elle brille (SMIL) ———
function jauge(n, anim = true) {
  let s = P('M4,4 L92,4 Q95,4 95,7 L95,15 Q95,18 92,18 L4,18 Q1,18 1,15 L1,7 Q1,4 4,4 Z', '#C8925A', 1.1);
  for (let x = 6; x < 92; x += 5) s += `<path d="M${x},5 L${x + 2},17" stroke="#9A6A3A" stroke-width="0.6" opacity=".6"/>`;
  for (let i = 0; i < 3; i++) {
    const x = 5 + i * 29.4, plein = i < n;
    s += P(`M${x + 2},7 L${f(x + 26)},7 Q${f(x + 27.4)},7 ${f(x + 27.4)},8.4 L${f(x + 27.4)},13.6 Q${f(x + 27.4)},15 ${f(x + 26)},15 L${x + 2},15 Q${x + 0.6},15 ${x + 0.6},13.6 L${x + 0.6},8.4 Q${x + 0.6},7 ${x + 2},7 Z`, plein ? (n === 3 ? '#FFD24A' : '#F2A0B0') : '#7A5232', 0.7);
    if (plein) s += `<path d="M${x + 3},8.6 L${f(x + 14)},8.6" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".6"/>`;
  }
  if (n === 3) s += `<rect x="1" y="4" width="94" height="14" rx="3" fill="none" stroke="#FFF2B8" stroke-width="2">${anim ? '<animate attributeName="stroke-opacity" values="1;.2;1" dur="0.6s" repeatCount="indefinite"/>' : ''}</rect>` + etoile(92, 4, 3) + etoile(4, 18, 2.2);
  return s;
}
// le « double » (32 × 32, SMIL : il bat) : une rosette dorée et deux paniers l'un sur l'autre ; le jeu dessine le temps
function double(anim = true) {
  let s = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += E(16 + Math.cos(a) * 11, 16 + Math.sin(a) * 11, 3.4, 3.4, i % 2 ? '#FFD24A' : '#F2B83A', 0.7); }
  s += E(16, 16, 11, 11, '#FFE07A', 1);
  s += `<g transform="translate(4.8 10.6) scale(0.36)">${CU.panier(2)}</g><g transform="translate(15.7 10.6) scale(0.36)">${CU.panier(2)}</g>`;
  return `<g>${anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="0.5s" repeatCount="indefinite" additive="sum"/>' : ''}${s}</g>`.replace('<g>', '<g transform-origin="16 16">') + etoile(27, 5, 2.4) + etoile(5, 27, 1.8);
}
// ——— le papillon doré (32 × 32, SMIL : il bat des ailes) ———
function papillon(anim = true, ouvert = 1) {
  const aile = (sx) => `<g transform="scale(${sx} 1)">${P('M0,-1 Q6,-12 12,-8 Q14,-3 6,1 Z', '#FFD24A', 0.8)}${P('M0,1 Q8,2 9,8 Q6,11 1,4 Z', '#F2A83A', 0.8)}${E(7, -6, 1.6, 1.4, '#FFF6C8')}${E(5, 5, 1, 0.9, '#FFF6C8')}</g>`;
  const ailes = anim ? `<g><animateTransform attributeName="transform" type="scale" values="1 1;0.25 1;1 1" dur="0.36s" repeatCount="indefinite"/>${aile(1)}${aile(-1)}</g>` : `<g transform="scale(${ouvert} 1)">${aile(1)}${aile(-1)}</g>`;
  return `<g transform="translate(16 17)">${ailes}${P('M-1.2,-5 Q0,-6.4 1.2,-5 L1,6 Q0,7.4 -1,6 Z', '#5A3A24', 0.6)}<path d="M-0.6,-5.4 Q-2.4,-9 -4,-9.6 M0.6,-5.4 Q2.4,-9 4,-9.6" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/>${E(-4, -9.6, 0.7, 0.7, OUT)}${E(4, -9.6, 0.7, 0.7, OUT)}</g>` + etoile(27, 7, 1.8) + etoile(6, 26, 1.4);
}
// la magie du papillon (60 × 60, 4 images, centrée sur le buisson) : un anneau d'étoiles s'ouvre vers les voisins
function magie(k) {
  const t = (k + 1) / 4;
  let s = `<circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="none" stroke="#FFE07A" stroke-width="${f(2.6 * (1 - t * 0.6))}" opacity="${f(1 - t * 0.6)}"/>`;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + k * 0.2, d = 6 + t * 17; s += etoile(30 + Math.cos(a) * d, 34 + Math.sin(a) * d * 0.8, f(2.8 * (1 - t * 0.4)), i % 2 ? '#FFE07A' : '#FFFBE8'); }
  return s;
}
// ——— la pie (48 × 32) : elle arrive en volant (3 images), posée elle tient le fruit, elle fuit (3 images) ———
function pie(pose, ailes = 0, fruitK = null, effraye = false) {
  // ailes : 0 repliées, 1 levées, 2 basses
  let s = '';
  s += P('M8,18 L-1,14 L0,17.4 L-1,21 Z', '#2A2A3A', 0.8) + `<path d="M0,16.6 L7,18" stroke="#5A7AC8" stroke-width="0.8"/>`; // la queue
  s += P('M6,18 Q8,10 18,9.6 Q28,10 30,16 Q29,24 18,25 Q9,25 6,18 Z', '#2A2A3A', 1); // le corps
  s += P('M14,20 Q18,15.6 26,17 Q27,22 18,24 Q14,23.6 14,20 Z', WHITE, 0); // le ventre blanc
  s += P('M26,8 Q31,4 36,7.6 Q38,12 34,15 Q29,16 26.4,13 Z', '#2A2A3A', 1); // la tête
  s += E(32.6, 9.6, 1.8, 2, WHITE) + E(33, 9.8, 1.1, 1.3, OUT) + E(33.4, 9.2, 0.45, 0.45, WHITE);
  s += effraye ? `<path d="M30.6,6.4 L33.6,7.2" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>` : '';
  s += P('M36,10 L42,11.4 L36,13 Z', '#3A3A3A', 0.8); // le bec
  if (fruitK) s += `<g transform="translate(37 7) scale(0.32)">${CU.fruit(fruitK)}</g>`;
  if (pose) s += `<path d="M16,25 L15,29 M20,25 L21,29 M13.4,29 L16.6,29 M19.4,29 L22.6,29" stroke="${OUT}" stroke-width="0.9" stroke-linecap="round"/>`;
  const aile = [P('M12,14 Q20,10.4 26,14 Q22,20 12,18 Z', '#3A3A50', 0.8) + `<path d="M15,16 L24,15" stroke="#5A7AC8" stroke-width="0.8"/>`,
    P('M14,13 Q16,0 26,-0.4 Q25,8 22,13 Z', '#3A3A50', 0.8) + P('M16,10 Q19,4 24,2', 'none', 0).replace('fill="none"', 'fill="none" stroke="#5A7AC8" stroke-width="0.8"') + P('M17,4 Q19,0.6 22,0.4 L21,3 Z', WHITE, 0),
    P('M13,16 Q16,28 24,30 Q25,22 22,16 Z', '#3A3A50', 0.8) + `<path d="M16,20 L21,27" stroke="#5A7AC8" stroke-width="0.8"/>`][ailes];
  s += aile;
  return s;
}
function plumes(k) {
  const t = (k + 1) / 3;
  return [[-1, -1], [1, -0.6], [-0.4, 1], [0.8, 0.8]].map(([dx, dy], i) => `<g transform="translate(${f(18 + dx * t * 14)} ${f(16 + dy * t * 10 + t * 3)}) rotate(${f(i * 80 + t * 90)})" opacity="${f(1 - t * 0.6)}">${P('M0,-3 Q1.6,0 0,3 Q-1.6,0 0,-3 Z', i % 2 ? WHITE : '#2A2A3A', 0.5)}</g>`).join('');
}
// ——— le nid qui grossit : 3 tailles (par-dessus le buisson, 60 × 60) ; au 3ᵉ, le buisson est perdu (il grisaille) ———
function nidTaille(n, fige = false) {
  const sc = [0.7, 1, 1.35][n];
  const g = `<g transform="translate(30 22) scale(${sc}) translate(-16 -16)">${CU.guepes(fige)}</g>`;
  return g;
}
const perdu = () => `<g opacity=".55">${CU.buisson(0, true).replace(/#4E8F3A|#5FA548|#68B04F/g, '#7A8A6A').replace(/#7EC25A/g, '#9AA888')}</g>`;
// ——— les buissons de saison : les couleurs du buisson changent ; printemps fleuri, automne roux ———
const SAISONS = {
  printemps: { couleurs: ['#6AB04A', '#7EC25A', '#8ED06A', '#A8E07A'], fleur: '#FFB8D0' },
  ete: { couleurs: ['#3E7F2A', '#4E9538', '#5AA544', '#6EB850'], fleur: '#FFF8F0' },
  automne: { couleurs: ['#B8602A', '#D07A34', '#E09A44', '#E8B860'], fleur: null }
};
function buissonSaison(k) {
  const c = SAISONS[k];
  let s = CU.buisson(0, !c.fleur).replace(/#4E8F3A/g, c.couleurs[0]).replace(/#5FA548/g, c.couleurs[1]).replace(/#68B04F/g, c.couleurs[2]).replace(/#7EC25A/g, c.couleurs[3]);
  if (k === 'printemps') s += [[12, 30], [22, 22], [36, 18], [46, 30], [26, 40], [40, 44], [16, 44], [30, 30]].map(([x, y]) => [0, 1, 2, 3, 4].map(i => { const t = i * Math.PI * 0.4; return E(x + Math.cos(t) * 1.6, y + Math.sin(t) * 1.6, 1.3, 1.3, c.fleur, 0.3); }).join('') + E(x, y, 0.8, 0.8, '#F2C04B')).join('');
  if (k === 'ete') s += [[20, 24], [40, 26]].map(([x, y]) => E(x, y, 3, 1.6, WHITE).replace('/>', ' opacity=".18"/>')).join('');
  if (k === 'automne') s += [[8, 50, 30], [50, 52, -20], [44, 8, 60]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,3 Q-2.6,-1 0,-4.4 Q2.6,-1 0,3 Z', '#E8843A', 0.6)}</g>`).join('');
  return s;
}


// ——— les pièces (dans le dossier de la Cueillette) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const B = [0, 0, 60, 60], F = [0, 0, 32, 32], PIE = [-4, -4, 52, 40];
const balance = s => `<g><animateTransform attributeName="transform" type="rotate" values="-1.2 30 50;1.2 30 50;-1.2 30 50" dur="3.2s" repeatCount="indefinite"/>${s}</g>`;
for (let n = 0; n <= 3; n++) piece(`jauge_${n}`, `La jauge de panier, ${n} cran${n > 1 ? 's' : ''}${n === 3 ? ' (pleine, elle brille en boucle)' : ''}`, [0, 0, 96, 22], () => jauge(n));
piece('double', 'Le « double » (il bat, en boucle ; le jeu dessine le temps)', F, () => double());
piece('papillon', 'Le papillon doré (il bat des ailes, en boucle)', F, () => papillon());
for (let k = 0; k < 4; k++) piece(`magie_${k + 1}`, 'La magie du papillon (vers les buissons voisins)', B, () => magie(k), 'magie', 90);
const SAISON = { printemps: 'de printemps, fleuri', ete: 'd\'été', automne: 'd\'automne, roux' };
for (const k of Object.keys(SAISONS)) piece(`buisson-${k}`, `Le buisson ${SAISON[k]} (il se balance, en boucle)`, B, () => balance(buissonSaison(k)));
for (const [i, a] of [1, 2, 0].entries()) piece(`pie-arrive_${i + 1}`, 'La pie qui arrive en volant', PIE, () => pie(0, a), 'pie-arrive', 110, true);
for (const k of Object.keys(CU.FRUITS)) piece(`pie-vole-${k}`, `La pie posée, qui a volé ${k === 'cepe' ? 'le cèpe' : `la ${{ mure: 'mûre', fraise: 'fraise', myrtille: 'myrtille' }[k]}`}`, PIE, () => pie(1, 0, k));
for (const [i, a] of [1, 2, 1].entries()) piece(`pie-fuit_${i + 1}`, 'La pie qui fuit (elle perd des plumes)', PIE, () => `<g transform="scale(-1 1) translate(-44 0)">${pie(0, a, null, true)}</g>` + (i ? plumes(i - 1) : ''), 'pie-fuit', 100);
for (let n = 0; n < 3; n++) piece(`nid_${n + 1}`, `Le nid de guêpes, taille ${n + 1} (par-dessus le buisson ; les guêpes tournent, en boucle)`, B, () => nidTaille(n));
piece('buisson-perdu', 'Le buisson perdu (5 secondes, sous le nid de taille 3)', B, perdu);

const LISEZ_MOI = 'Nouvelle version (design/conception/minijeux_grille.md) : la jauge de panier (96 × 22) en 4 états ; le « double » et le papillon doré (32 × 32) ; la magie du papillon, les buissons de saison, le nid (par-dessus le buisson) et le buisson perdu ont le cadre d\'un buisson (60 × 60). La pie a un cadre de 52 × 40 (de −4 à 48 en x, de −4 à 36 en y) : elle arrive en boucle, se pose avec le fruit volé, puis fuit une fois (retournée, vers la gauche).';
module.exports = { PIECES, LISEZ_MOI, SAISONS, jauge, double, papillon, magie, pie, plumes, nidTaille, perdu, buissonSaison };
