// Lot I — les coffres de l'île pour la fenêtre d'ouverture du jeu (ChestReveal, cadre 120 × 100), vus de trois quarts :
// un coffre par rareté (commun, rare, épique, légendaire). Bois veiné, ferrures martelées à volutes, clous en fleur,
// serrure à la couleur de la rareté (fer ; argent et saphir ; or et améthyste ; or, turquoise et rubis), la vie de la mer
// (mousse, algue, étoile de mer, coquillage). Ouvert : le couvercle doublé de velours capitonné, un trésor qui remplit la
// bouche sans dépasser le rebord, plus de pierres et de bijoux à chaque rareté. Les scintillements sont animés dans le
// SVG (SMIL : 12 phases de 100 ms en boucle) ; sans animation (canvas), on voit une phase fixe.
const OUT = '#3C2819';
const f = n => Math.round(n * 100) / 100;
const st = (w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
// géométrie : face avant (X0..X1, YT..YB), profondeur (DX, DY), couvercle (hauteur LH0 de sa face, bombé LH)
const X0 = 21, X1 = 87, YT = 55, YB = 83, DX = 13, DY = -7, LH0 = 9, LH = 15;
const CX = (X0 + X1) / 2;
// les quatre raretés : le bois, le fer (ou le laiton), le velours, l'or, la lueur, et ce que le trésor a en plus
const PALETTES = {
  commun: { bois: { clair: '#E8BC82', corps: '#CF9A60', ombre: '#A87444', fonce: '#7E5430', veine: 'rgba(100,60,28,.42)', arete: 'rgba(255,236,200,.75)' },
    fer: { clair: '#D6DCE2', corps: '#A2A9B2', ombre: '#727A84', fonce: '#4E555E' }, laiton: { clair: '#FBE7A8', corps: '#E2B44E', ombre: '#B0822E' },
    velours: { clair: '#86B46A', corps: '#5E8E4A', ombre: '#3E6A32' }, or: { clair: '#FFF2B8', corps: '#F2C94C', ombre: '#C8962A' },
    lueur: ['#E6F4B8', '#B8DC7A'], gemmes: ['#5EC28A', '#7AD0E8', '#E87A8A', '#5EC28A', '#B884F2', '#F2C04B', '#7AD0E8', '#E87A8A'], plus: '' },
  rare: { bois: { clair: '#C08A5E', corps: '#9A6440', ombre: '#7A4C2E', fonce: '#563220', veine: 'rgba(60,30,12,.45)', arete: 'rgba(255,226,190,.6)' },
    fer: { clair: '#C8DAF2', corps: '#6E96D0', ombre: '#4A6EA8', fonce: '#304E80' }, laiton: { clair: '#E8F0FA', corps: '#C8D4E2', ombre: '#8E9CB0' },
    velours: { clair: '#5E86C8', corps: '#2E4E8A', ombre: '#1E3466' }, or: { clair: '#FFF2B8', corps: '#F2C94C', ombre: '#C8962A' },
    lueur: ['#DCEBFF', '#7AA8F0'], gemmes: ['#4C8FE8', '#7AD0E8', '#4C8FE8', '#E8F0FA', '#7AD0E8', '#4C8FE8', '#B8E0F8', '#4C8FE8'], plus: 'rare' },
  epique: { bois: { clair: '#A6729E', corps: '#7E4E78', ombre: '#5E3858', fonce: '#42243E', veine: 'rgba(40,14,36,.45)', arete: 'rgba(255,220,250,.55)' },
    fer: { clair: '#FBE7A8', corps: '#E2B54A', ombre: '#B88A2A', fonce: '#8A621A' }, laiton: { clair: '#FFF4C8', corps: '#F2C94C', ombre: '#B88A2A' },
    velours: { clair: '#9A6ED8', corps: '#6A3E9E', ombre: '#48266E' }, or: { clair: '#FFF2B8', corps: '#F2C94C', ombre: '#C8962A' },
    lueur: ['#F2E4FF', '#B884F2'], gemmes: ['#B884F2', '#E87AC8', '#B884F2', '#7AD0E8', '#F2C04B', '#B884F2', '#E87AC8', '#B884F2'], plus: 'epique' },
  legendaire: { bois: { clair: '#FBDC7A', corps: '#F2C64E', ombre: '#D2A232', fonce: '#A87A1E', veine: 'rgba(140,90,20,.4)', arete: 'rgba(255,250,220,.8)' },
    fer: { clair: '#E88A6E', corps: '#C2543A', ombre: '#963C28', fonce: '#6E2818' }, laiton: { clair: '#FFF4C8', corps: '#F2C94C', ombre: '#B88A2A' },
    velours: { clair: '#E2665A', corps: '#C8463A', ombre: '#8E2A22' }, or: { clair: '#FFF6C8', corps: '#F7D25A', ombre: '#C8962A' },
    lueur: ['#FFF8D8', '#F2C04B'], gemmes: ['#4FC8C0', '#E87A8A', '#4FC8C0', '#B884F2', '#7AD0E8', '#4FC8C0', '#F2C04B', '#E87A8A'], plus: 'legendaire' }
};
// la serrure de chaque rareté : fer, argent et saphir, or et améthyste (bord émaillé), or et turquoise (deux rubis)
const SERRURES = {
  commun: { clair: '#E8ECF0', corps: '#A2A9B2', ombre: '#727A84', fonce: '#4E555E', bord: '#727A84', gemme: null },
  rare: { clair: '#FFFFFF', corps: '#D2DCE8', ombre: '#8E9CB0', fonce: '#4A5C78', bord: '#4C8FE8', gemme: '#4C8FE8' },
  epique: { clair: '#FFF8DC', corps: '#F2C94C', ombre: '#B88A2A', fonce: '#7A5414', bord: '#8A52C8', gemme: '#B884F2' },
  legendaire: { clair: '#FFFBE6', corps: '#FFD75E', ombre: '#C8962A', fonce: '#8A5A10', bord: '#C2543A', gemme: '#4FC8C0', rubis: '#E8506A' }
};
let C = PALETTES.commun, SE = SERRURES.commun, R = 'commun';
const defs = () => `<defs>
<linearGradient id="kbF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bois.clair}"/><stop offset=".45" stop-color="${C.bois.corps}"/><stop offset="1" stop-color="${C.bois.ombre}"/></linearGradient>
<linearGradient id="kbS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bois.ombre}"/><stop offset="1" stop-color="${C.bois.fonce}"/></linearGradient>
<radialGradient id="kbT" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#F6D4A0"/><stop offset=".55" stop-color="${C.bois.clair}"/><stop offset="1" stop-color="${C.bois.corps}"/></radialGradient>
<linearGradient id="kfe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.fer.clair}"/><stop offset=".35" stop-color="${C.fer.corps}"/><stop offset="1" stop-color="${C.fer.ombre}"/></linearGradient>
<linearGradient id="kfh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.fer.clair}"/><stop offset=".4" stop-color="${C.fer.corps}"/><stop offset="1" stop-color="${C.fer.ombre}"/></linearGradient>
<radialGradient id="kpl" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#E8ECF0"/><stop offset=".5" stop-color="${C.fer.corps}"/><stop offset="1" stop-color="${C.fer.ombre}"/></radialGradient>
<radialGradient id="klu" cx=".5" cy="1" r="1"><stop offset="0" stop-color="#FFFBE6" stop-opacity="1"/><stop offset=".4" stop-color="${C.lueur[0]}" stop-opacity=".8"/><stop offset="1" stop-color="${C.lueur[1]}" stop-opacity="0"/></radialGradient>
<radialGradient id="kse" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="${SE.clair}"/><stop offset=".5" stop-color="${SE.corps}"/><stop offset="1" stop-color="${SE.ombre}"/></radialGradient>
<radialGradient id="kvl" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="${C.velours.clair}"/><stop offset="1" stop-color="${C.velours.ombre}"/></radialGradient>
</defs>`;
const rivet = (x, y, r = 1.1) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#kpl)"${st(0.5)}/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.38)}" r="${f(r * 0.32)}" fill="#FFFFFF"/>`;
// un clou à tête de fleur : quatre pétales de fer autour d'un bouton de laiton
const clouFleur = (x, y) => [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2 + Math.PI / 4; return `<circle cx="${f(x + 1.2 * Math.cos(a))}" cy="${f(y + 1.2 * Math.sin(a))}" r="0.9" fill="${C.fer.corps}" stroke="${OUT}" stroke-width="0.4"/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="0.8" fill="${C.laiton.corps}" stroke="${OUT}" stroke-width="0.4"/>`;
// une veine de bois qui ondule, et ses petites rayures
const veine = (x0, x1, y, a) => { let d = `M${x0},${y}`; for (let x = x0; x < x1 - 6; x += 7) d += ` q1.75,${a} 3.5,0 t3.5,0`; return `<path d="${d}" fill="none" stroke="${C.bois.veine}" stroke-width="0.5"/>`; };
// une volute de fer (au bout d'une ferrure)
const volute = (x, y, s) => `<path d="M${x},${y} q${f(3 * s)},0 ${f(3.6 * s)},${f(-2.6)} q${f(0.4 * s)},-2.2 ${f(-1.6 * s)},-2 q${f(-1.4 * s)},0.4 ${f(-0.6 * s)},1.6" fill="none" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x},${y} q${f(3 * s)},0 ${f(3.6 * s)},${f(-2.6)} q${f(0.4 * s)},-2.2 ${f(-1.6 * s)},-2 q${f(-1.4 * s)},0.4 ${f(-0.6 * s)},1.6" fill="none" stroke="${C.fer.corps}" stroke-width="1" stroke-linecap="round"/>`;
// l'hirondelle (gravée, ou en papier)
const hirondelle = (x, y, s, col) => `<path d="M10,0 C8,-1.7 5,-2 2.6,-1.1 L-7,-9.4 C-5.4,-5.4 -3.4,-2.4 -1.2,-0.7 L-12,-1.4 L-4.6,0.9 L-12,4.6 L-2.4,2.2 L-7.4,8.6 C-3.4,4.8 -0.6,2.6 2,2 C5,2.4 8,1.6 10,0 Z" fill="${col}" transform="translate(${x} ${y}) scale(${s})"/>`;
// l'écu de la serrure (sert aussi à découper le reflet qui passe)
const PLAQUE = `M${CX - 8.4},${YT - 0.4} L${CX + 8.4},${YT - 0.4} L${CX + 8.4},${YT + 11} Q${CX + 8.4},${YT + 16.6} ${CX},${YT + 20.6} Q${CX - 8.4},${YT + 16.6} ${CX - 8.4},${YT + 11} Z`;
// les bijoux : cinq tailles de pierre (vues d'en haut, un peu enfoncées), toutes avec leur éclat
const cabochon = (x, y, r, c) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.85)}" fill="${c}"${st(0.45)}/><ellipse cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" rx="${f(r * 0.38)}" ry="${f(r * 0.26)}" fill="#FFFFFF" opacity=".85"/>`;
const PIERRES = {
  losange: (x, y, k, c) => `<path d="M${f(x - 2 * k)},${f(y)} L${f(x)},${f(y - 2 * k)} L${f(x + 2 * k)},${f(y)} L${f(x)},${f(y + 0.9 * k)} Z" fill="${c}"${st(0.5)}/><path d="M${f(x - 0.7 * k)},${f(y - 0.6 * k)} L${f(x)},${f(y - 1.3 * k)}" stroke="#FFFFFF" stroke-width="0.6"/>`,
  rond: (x, y, k, c) => cabochon(x, y - 0.4 * k, 1.5 * k, c),
  carre: (x, y, k, c) => `<path d="M${f(x - 1.9 * k)},${f(y - 0.4 * k)} L${f(x - 1.3 * k)},${f(y - 1.6 * k)} L${f(x + 1.3 * k)},${f(y - 1.6 * k)} L${f(x + 1.9 * k)},${f(y - 0.4 * k)} L${f(x + 1.3 * k)},${f(y + 0.7 * k)} L${f(x - 1.3 * k)},${f(y + 0.7 * k)} Z" fill="${c}"${st(0.5)}/><rect x="${f(x - 0.9 * k)}" y="${f(y - 1 * k)}" width="${f(1.8 * k)}" height="${f(1.1 * k)}" fill="#FFFFFF" opacity=".35"/><path d="M${f(x - 1)},${f(y - 1.2 * k)} L${f(x - 0.2)},${f(y - 1.2 * k)}" stroke="#FFFFFF" stroke-width="0.5"/>`,
  goutte: (x, y, k, c) => `<path d="M${f(x)},${f(y - 2.4 * k)} Q${f(x + 1.9 * k)},${f(y - 0.2 * k)} ${f(x)},${f(y + 0.8 * k)} Q${f(x - 1.9 * k)},${f(y - 0.2 * k)} ${f(x)},${f(y - 2.4 * k)} Z" fill="${c}"${st(0.5)}/><ellipse cx="${f(x - 0.5 * k)}" cy="${f(y - 0.6 * k)}" rx="${f(0.4 * k)}" ry="${f(0.6 * k)}" fill="#FFFFFF" opacity=".8"/>`,
  brillant: (x, y, k, c) => { let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; d += `${i ? 'L' : 'M'}${f(x + 2.2 * k * Math.cos(a))},${f(y - 0.6 * k + 1.5 * k * Math.sin(a))}`; } return `<path d="${d} Z" fill="${c}"${st(0.5)}/><path d="M${f(x - 1 * k)},${f(y - 0.6 * k)} L${f(x)},${f(y - 1.3 * k)} L${f(x + 1 * k)},${f(y - 0.6 * k)} L${f(x)},${f(y + 0.1 * k)} Z" fill="#FFFFFF" opacity=".45"/><circle cx="${f(x - 0.9 * k)}" cy="${f(y - 1.1 * k)}" r="${f(0.35 * k)}" fill="#FFFFFF"/>`; }
};

// ——— le sable, les pieds, l'ombre ———
function sol() {
  return `<ellipse cx="${CX + 6}" cy="${YB + 3.4}" rx="50" ry="6" fill="rgba(40,30,20,.22)"/>`
    + `<path d="M${X0 - 8},${YB + 4} Q${X0 - 2},${YB - 1.6} ${X0 + 8},${YB + 1} Q${CX},${YB + 3.6} ${X1 + 4},${YB + 1.6} Q${X1 + DX + 4},${YB + DY + 2} ${X1 + DX + 10},${YB + 2.6} Q${CX + 10},${YB + 8} ${X0 - 8},${YB + 4} Z" fill="#F0D9A2"${st(0.8)}/>`
    + [[X0 + 2, YB + 3.4], [CX - 6, YB + 4.6], [X1 + 2, YB + 3.4], [X1 + DX + 3, YB + 1.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.5" fill="#C8A86A"/>`).join('');
}
const pied = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.4" fill="${C.bois.fonce}"${st(0.8)}/><ellipse cx="${x - 0.8}" cy="${y - 0.8}" rx="1.1" ry="0.6" fill="${C.bois.clair}" opacity=".6"/>`;

// ——— le corps ———
function corps(ouvert) {
  let o = pied(X1 + DX - 2, YB + DY + 1.4);
  // le flanc : planches sombres, ferrure, poignée de corde, étiquette de l'Hirondelle
  const S = `M${X1},${YT} L${X1 + DX},${YT + DY} L${X1 + DX},${YB + DY} L${X1},${YB} Z`;
  o += `<path d="${S}" fill="url(#kbS)"${st(1.1)}/>`;
  o += `<path d="M${X1 + 0.6},${YT + 9.4} L${X1 + DX - 0.6},${YT + 9.4 + DY} M${X1 + 0.6},${YT + 18.8} L${X1 + DX - 0.6},${YT + 18.8 + DY}" stroke="rgba(50,28,12,.5)" stroke-width="0.7"/>`;
  o += `<path d="M${X1},${YT + 13} L${X1 + DX},${YT + 13 + DY} L${X1 + DX},${YT + 18.6 + DY} L${X1},${YT + 18.6} Z" fill="${C.fer.ombre}"${st(0.8)}/>`;
  o += `<g transform="translate(${X1 + 5} ${YB + DY / 2 - 3}) skewY(-28)"><rect x="-3.6" y="-2.6" width="7.4" height="5.2" rx="0.6" fill="#F4EBD2"${st(0.5)}/>${hirondelle(0.6, 0, 0.26, '#3E6A9E')}</g>`;
  o += `<path d="M${X1 + 4},${YT + 4} q2.6,-0.6 3,2.2 q0.6,3.6 -1.4,4.6 q-2.6,0.8 -2.8,-2.4" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M${X1 + 4},${YT + 4} q2.6,-0.6 3,2.2 q0.6,3.6 -1.4,4.6 q-2.6,0.8 -2.8,-2.4" fill="none" stroke="#D8B87A" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="1 0.6"/>`;
  // la face : deux larges planches, leur dégradé, leurs veines, leurs arêtes usées, un nœud, des rayures
  const F = `M${X0},${YT} L${X1},${YT} L${X1},${YB} L${X0},${YB} Z`;
  o += `<path d="${F}" fill="url(#kbF)"/>`;
  const mid = YT + (YB - YT) / 2;
  o += veine(X0 + 2, X1 - 2, YT + 4, 0.7) + veine(X0 + 6, X1 - 6, YT + 9.6, -0.6) + veine(X0 + 2, X1 - 2, mid + 4.4, 0.6) + veine(X0 + 8, X1 - 4, mid + 10, -0.7);
  o += `<path d="M${X0 + 1},${f(mid)} L${X1 - 1},${f(mid)}" stroke="rgba(50,28,12,.55)" stroke-width="0.8"/><path d="M${X0 + 1},${f(mid + 0.9)} L${X1 - 1},${f(mid + 0.9)}" stroke="${C.bois.arete}" stroke-width="0.6"/>`;
  o += `<ellipse cx="${X0 + 25}" cy="${mid + 7}" rx="2" ry="1.3" fill="${C.bois.fonce}"/><ellipse cx="${X0 + 25}" cy="${mid + 7}" rx="3.6" ry="2.4" fill="none" stroke="${C.bois.veine}" stroke-width="0.5"/>`;
  o += `<path d="M${X1 - 22},${YT + 6} l4,1.2 M${X1 - 20},${YT + 8} l3,0.8" stroke="rgba(255,236,200,.6)" stroke-width="0.5" stroke-linecap="round"/>`;
  o += `<path d="${F}" fill="none"${st(1.2)}/>` + `<path d="M${X0 + 0.7},${YB - 0.7} L${X0 + 0.7},${YT + 0.7} L${X1 - 0.7},${YT + 0.7}" fill="none" stroke="${C.bois.arete}" stroke-width="0.8"/>`;
  o += `<rect x="${X0 + 0.6}" y="${YT + 0.6}" width="${X1 - X0 - 1.2}" height="${ouvert ? 1.2 : 3}" fill="rgba(50,28,12,.25)"/>`;
  // les ferrures : deux montants martelés, une ceinture, des volutes aux bouts, des clous en fleur
  for (const x of [X0 + 6, X1 - 13]) {
    o += `<rect x="${x}" y="${YT}" width="7" height="${YB - YT}" fill="url(#kfe)"${st(0.9)}/>`;
    for (const y of [YT + 5, YT + 12, YB - 5]) o += `<circle cx="${x + 2.4}" cy="${y + 2}" r="0.7" fill="rgba(255,255,255,.35)"/><circle cx="${x + 4.8}" cy="${y - 1}" r="0.6" fill="rgba(0,0,0,.18)"/>`;
    o += rivet(x + 3.5, YT + 3, 1.1) + rivet(x + 3.5, YB - 3, 1.1);
  }
  o += `<rect x="${X0}" y="${YT + 12}" width="${X1 - X0}" height="6" fill="url(#kfh)"${st(0.9)}/>`;
  o += volute(X0 + 1.6, YT + 15, 1) + volute(X1 - 1.6, YT + 15, -1);
  for (const x of [X0 + 18, X1 - 18]) o += clouFleur(x, YT + 15);
  // les coins de métal, en bas, et les pieds de devant
  o += `<path d="M${X0},${YB - 7} L${X0},${YB} L${X0 + 7},${YB} Q${X0 + 3.4},${YB - 2.6} ${X0},${YB - 7} Z" fill="${C.fer.ombre}"${st(0.8)}/><path d="M${X1},${YB - 7} L${X1},${YB} L${X1 - 7},${YB} Q${X1 - 3.4},${YB - 2.6} ${X1},${YB - 7} Z" fill="${C.fer.ombre}"${st(0.8)}/>`;
  o += pied(X0 + 4, YB + 1.6) + pied(X1 - 4, YB + 1.6);
  // la plaque de serrure : un écu de fer, l'hirondelle gravée, le trou de la clé ; le moraillon (fermé seulement)
  o += `<path d="${PLAQUE}" fill="url(#kse)"${st(1.1)}/>`;
  o += `<path d="M${CX - 6},${YT + 1.8} L${CX + 6},${YT + 1.8} L${CX + 6},${YT + 10.6} Q${CX + 6},${YT + 14.6} ${CX},${YT + 17.6} Q${CX - 6},${YT + 14.6} ${CX - 6},${YT + 10.6} Z" fill="none" stroke="${SE.bord}" stroke-width="${SE.gemme ? 1 : 0.7}"/>`;
  o += `<g opacity=".7">${hirondelle(CX + 0.6, YT + 14.2, 0.32, SE.fonce)}</g>`;
  if (SE.rubis) for (const dx of [-4.4, 4.4]) o += `<circle cx="${CX + dx}" cy="${YT + 4}" r="0.95" fill="${SE.rubis}"${st(0.4)}/><circle cx="${CX + dx - 0.3}" cy="${YT + 3.7}" r="0.3" fill="#FFFFFF"/>`;
  if (ouvert && SE.gemme) o += cabochon(CX, YT + 3, 1.3, SE.gemme);
  o += `<circle cx="${CX}" cy="${YT + 7}" r="1.7" fill="${OUT}"/><path d="M${CX - 1},${YT + 8} L${CX + 1},${YT + 8} L${CX + 0.6},${YT + 11.4} L${CX - 0.6},${YT + 11.4} Z" fill="${OUT}"/>`;
  // la vie de la mer : mousse aux coins, une algue qui pend de la ceinture, une étoile de mer accrochée
  o += `<path d="M${X0 + 0.4},${YB - 1} q1.6,-3.4 3.4,-1.4 q1.4,-2.6 3.4,0 q1,-1.4 2.2,0.6 L${X0 + 9.6},${YB} L${X0 + 0.4},${YB} Z" fill="#7DA850"${st(0.6)}/>`;
  o += `<path d="M${X1 - 26},${YT + 18} q-1.4,4 0.6,7.4 q1.4,2.6 -0.6,5.6" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="M${X1 - 26},${YT + 18} q-1.4,4 0.6,7.4 q1.4,2.6 -0.6,5.6" fill="none" stroke="#5E9A3C" stroke-width="1" stroke-linecap="round"/>`;
  o += `<g transform="translate(${X0 + 12} ${YB - 6.4}) rotate(-18)">${(() => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? 1.6 : 4.2; d += `${i ? 'L' : 'M'}${f(k * Math.cos(a))},${f(k * Math.sin(a))}`; } return `<path d="${d} Z" fill="#F49A4A"${st(0.6)}/><circle cx="0" cy="0" r="0.7" fill="#FFD3A8"/>`; })()}</g>`;
  if (C.plus === 'legendaire') { const g = (x, d) => `<path d="${d}" transform="translate(${x} ${YT + 24})" fill="none" stroke="#4FC8C0" stroke-width="0.9" stroke-linecap="round"/>`; o += g(X0 + 18, 'M0,-2 L0,2 M0,-0.6 L1.6,-2') + g(X0 + 30, 'M-1.4,0 a1.4,1.4 0 1 1 1.4,1.4') + g(X1 - 30, 'M-1.6,1.6 L0,-1.6 L1.6,1.6') + g(X1 - 18, 'M0,-2 L0,2 M-1.4,0 L1.4,0'); }
  return o;
}

// ——— le couvercle fermé ———
function couvercle() {
  const y0 = YT, yT = y0 - LH0;
  const arcY = x => { const t = (x - X0) / (X1 - X0); return yT - 2 * t * (1 - t) * LH; };
  let o = '';
  const D = `M${X0},${yT} Q${CX},${yT - LH} ${X1},${yT} L${X1 + DX},${yT + DY} Q${CX + DX},${yT - LH + DY} ${X0 + DX},${yT + DY} Z`;
  o += `<path d="${D}" fill="url(#kbT)"${st(1.1)}/>`;
  for (const k of [1 / 3, 2 / 3]) o += `<path d="M${f(X0 + DX * k)},${f(yT + DY * k)} Q${f(CX + DX * k)},${f(yT - LH + DY * k)} ${f(X1 + DX * k)},${f(yT + DY * k)}" fill="none" stroke="rgba(100,60,28,.45)" stroke-width="0.7"/>`;
  o += `<path d="M${X0 + 12},${f(arcY(X0 + 12) + DY * 0.5 - 0.6)} Q${CX - 2},${f(arcY(CX) + DY * 0.5 - 1)} ${CX + 14},${f(arcY(CX + 14) + DY * 0.5 - 0.6)}" fill="none" stroke="rgba(255,250,236,.8)" stroke-width="1.6" stroke-linecap="round"/>`;
  // le flanc du couvercle, la face cintrée
  o += `<path d="M${X1},${y0} L${X1},${yT} L${X1 + DX},${yT + DY} L${X1 + DX},${YT + DY} Z" fill="url(#kbS)"${st(1.1)}/>`;
  o += `<path d="M${X0},${y0} L${X0},${yT} Q${CX},${yT - LH} ${X1},${yT} L${X1},${y0} Z" fill="url(#kbF)"${st(1.1)}/>`;
  o += `<path d="M${X0 + 0.8},${yT + 0.6} Q${CX},${yT - LH + 1.6} ${X1 - 0.8},${yT + 0.6}" fill="none" stroke="${C.bois.arete}" stroke-width="0.9"/>` + veine(X0 + 4, X1 - 4, y0 - 3.6, 0.6);
  // le coquillage cloué au milieu du couvercle
  o += `<path d="M${CX - 4.6},${f(arcY(CX) + 6.6)} Q${CX - 5.4},${f(arcY(CX) + 1.6)} ${CX},${f(arcY(CX) + 1)} Q${CX + 5.4},${f(arcY(CX) + 1.6)} ${CX + 4.6},${f(arcY(CX) + 6.6)} Z" fill="#F7C6B8"${st(0.7)}/>` + [-2.6, -0.9, 0.9, 2.6].map(dx => `<path d="M${CX + dx},${f(arcY(CX) + 6.2)} L${CX + dx * 0.3},${f(arcY(CX) + 1.8)}" stroke="#D8907E" stroke-width="0.5"/>`).join('');
  // les ferrures du couvercle, le rebord, le moraillon
  for (const x of [X0 + 6, X1 - 13]) {
    const a1 = arcY(x), a2 = arcY(x + 7);
    o += `<path d="M${x},${y0} L${x},${f(a1)} L${x + 7},${f(a2)} L${x + 7},${y0} Z" fill="url(#kfe)"${st(0.9)}/>`;
    o += `<path d="M${x},${f(a1)} L${x + DX},${f(a1 + DY)} L${x + 7 + DX},${f(a2 + DY)} L${x + 7},${f(a2)} Z" fill="${C.fer.ombre}"${st(0.9)}/>` + rivet(x + 3.5, y0 - 3.6, 1);
  }
  o += `<rect x="${X0}" y="${y0 - 2.6}" width="${X1 - X0}" height="2.8" fill="url(#kfh)"${st(0.8)}/><path d="M${X1},${y0 - 2.6} L${X1 + DX},${y0 - 2.6 + DY} L${X1 + DX},${y0 + 0.2 + DY} L${X1},${y0 + 0.2} Z" fill="${C.fer.fonce}"${st(0.7)}/>`;
  o += `<path d="M${CX - 3.8},${y0 - 7} L${CX + 3.8},${y0 - 7} L${CX + 3.8},${y0 + 2.6} Q${CX},${y0 + 4.6} ${CX - 3.8},${y0 + 2.6} Z" fill="url(#kse)"${st(0.9)}/>` + (SE.gemme ? cabochon(CX, y0 - 3.4, 1.5, SE.gemme) : rivet(CX, y0 - 4.4, 0.9));
  return o;
}

// ——— ouvert : le couvercle rabattu (doublé de velours), la bouche, le trésor, la lumière ———
function couvercleOuvert() {
  const hx0 = X0 + DX, hx1 = X1 + DX, hy = YT + DY, up = 32, back = 7, cxm = (hx0 + hx1) / 2;
  const IN = `M${hx0},${hy} L${hx0 - back},${hy - up} Q${cxm - back},${hy - up - 10} ${hx1 - back},${hy - up} L${hx1},${hy} Z`;
  let o = `<path d="${IN}" fill="${C.bois.fonce}"${st(1.1)}/>`;
  // la doublure de velours, capitonnée, bordée d'un galon doré, éclairée par le dessous
  const V = `M${hx0 + 3},${hy - 2} L${hx0 - back + 3.6},${hy - up + 3} Q${cxm - back},${hy - up - 6} ${hx1 - back - 3.6},${hy - up + 3} L${hx1 - 3},${hy - 2} Z`;
  o += `<path d="${V}" fill="url(#kvl)"${st(0.8)}/>`;
  for (const k of [0.25, 0.5, 0.75]) o += `<path d="M${f(hx0 + (hx1 - hx0) * k)},${hy - 2.4} L${f(hx0 + (hx1 - hx0) * k - back)},${f(hy - up + 3 - 4 * Math.sin(Math.PI * k))}" stroke="${C.velours.ombre}" stroke-width="0.5"/>`;
  for (const [k, t] of [[0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.375, 0.25], [0.625, 0.25], [0.375, 0.75], [0.625, 0.75]]) { const x = hx0 + (hx1 - hx0) * k - back * t, y = hy - 2 - (up - 4) * t; o += `<circle cx="${f(x)}" cy="${f(y)}" r="0.7" fill="${C.velours.clair}" stroke="${C.velours.ombre}" stroke-width="0.3"/>`; }
  o += `<path d="${V}" fill="none" stroke="${C.laiton.corps}" stroke-width="0.9"/>`;
  o += `<path d="${V}" fill="url(#klu)" opacity=".55"/>`;
  // le dessus bombé, vu par la tranche, et le flanc
  o += `<path d="M${hx0 - back},${hy - up} Q${cxm - back},${hy - up - 10} ${hx1 - back},${hy - up} L${hx1 - back + 3},${hy - up - 3} Q${cxm - back + 3},${hy - up - 13} ${hx0 - back + 3},${hy - up - 3} Z" fill="url(#kbT)"${st(1)}/>`;
  o += `<path d="M${hx1},${hy} L${hx1 - back},${hy - up} L${hx1 - back + 3},${hy - up - 3} L${hx1 + 3},${hy - 2} Z" fill="url(#kbS)"${st(1)}/>`;
  return o;
}
// les places des pierres sur le tas (les 8 premières : le coffre commun), et combien chaque rareté en a
const GEMMES = [[34, YT - 1.6, 0.9], [46, YT - 3.4, 0.85], [57, YT - 4.6, 0.85], [68, YT - 3.2, 0.85], [80, YT - 2.4, 0.8], [52, YT - 0.8, 0.75], [74, YT - 6, 0.75], [40, YT - 5.4, 0.7],
  [62, YT - 1.2, 0.8], [90, YT - 5, 0.75], [95, YT - 6.6, 0.7], [44, YT - 0.6, 0.75], [64, YT - 8, 0.7], [50, YT - 7.2, 0.7],
  [85, YT - 6.4, 0.7], [37, YT - 3.4, 0.7], [56, YT - 9, 0.65], [78, YT - 8, 0.65], [70, YT - 0.6, 0.8], [28, YT - 0.4, 0.7], [60, YT - 6, 0.7], [88, YT - 1.6, 0.75]];
const BIJOUX = {
  commun: { n: 8, formes: ['losange', 'rond'], k: 0.95 },
  rare: { n: 12, formes: ['losange', 'rond', 'goutte'], k: 1 },
  epique: { n: 16, formes: ['losange', 'carre', 'rond', 'goutte'], k: 1.05 },
  legendaire: { n: 22, formes: ['brillant', 'losange', 'carre', 'goutte', 'rond'], k: 1.08 }
};
// une bague posée sur le tas (anneau vu de biais, sa pierre)
const bague = (x, y, metal, pierre) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="none" stroke="${OUT}" stroke-width="1.6"/><ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="none" stroke="${metal}" stroke-width="0.8"/>` + cabochon(x, y - 1.6, 1.2, pierre);
// une coupe d'or (épique, légendaire)
const coupe = (x, y, c) => `<path d="M${x - 3.6},${y - 7} L${x + 3.6},${y - 7} Q${x + 3.6},${y - 2.6} ${x + 0.8},${y - 2} L${x + 0.8},${y - 0.6} L${x + 2.4},${y} L${x - 2.4},${y} L${x - 0.8},${y - 0.6} L${x - 0.8},${y - 2} Q${x - 3.6},${y - 2.6} ${x - 3.6},${y - 7} Z" fill="${c.corps}"${st(0.6)}/><ellipse cx="${x}" cy="${y - 7}" rx="3.6" ry="0.9" fill="${c.ombre}"${st(0.5)}/><path d="M${x - 2.4},${y - 6} Q${x - 2.2},${y - 3.6} ${x - 0.6},${y - 2.8}" fill="none" stroke="${c.clair}" stroke-width="0.7"/>`;
// un sceptre appuyé contre le couvercle (légendaire)
const sceptre = () => `<g transform="rotate(24 ${X1 + 2} ${YT + DY})"><rect x="${X1 + 1.2}" y="${YT + DY - 24}" width="1.8" height="22" rx="0.9" fill="${C.or.corps}"${st(0.5)}/><circle cx="${X1 + 2.1}" cy="${YT + DY - 25.6}" r="2.6" fill="#E8506A"${st(0.6)}/><circle cx="${X1 + 1.3}" cy="${YT + DY - 26.4}" r="0.8" fill="#FFFFFF"/><path d="M${X1 - 0.6},${YT + DY - 22.6} L${X1 + 4.8},${YT + DY - 22.6}" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M${X1 - 0.6},${YT + DY - 22.6} L${X1 + 4.8},${YT + DY - 22.6}" stroke="${C.or.corps}" stroke-width="0.9" stroke-linecap="round"/></g>`;
// ce que chaque rareté a en plus dans son trésor
function plus() {
  if (C.plus === 'rare') return `<g transform="translate(${CX - 14} ${YT - 4})"><circle cx="0" cy="0" r="3.4" fill="#C8D4E2"${st(0.6)}/><circle cx="0" cy="0" r="2.4" fill="#FBF3DE"/><path d="M0,-1.8 L0.6,0 L0,1.8 L-0.6,0 Z" fill="#D8443A"/></g>`
    + `<circle cx="${CX + 16}" cy="${YT - 3.4}" r="1.6" fill="#FBF6EE"${st(0.5)}/><circle cx="${CX + 15.5}" cy="${YT - 3.9}" r="0.5" fill="#FFFFFF"/>`
    + bague(48, YT - 6.6, '#D2DCE8', '#4C8FE8');
  if (C.plus === 'epique') return `<g transform="translate(${CX - 15} ${YT - 4}) rotate(-12)"><path d="M-2.6,-4 L2.6,-4 L2.6,-1 Q5,1 5,4 Q5,8 0,8 Q-5,8 -5,4 Q-5,1 -2.6,-1 Z" fill="#E87AC8" fill-opacity=".9"${st(0.6)}/><rect x="-1.8" y="-6.6" width="3.6" height="2.8" rx="0.6" fill="#B08A5A"${st(0.5)}/><circle cx="-1.6" cy="3" r="1" fill="#FFFFFF" opacity=".7"/><circle cx="0" cy="3" r="6" fill="#F2E4FF" opacity=".25"/></g>`
    + `<g transform="translate(${CX + 16} ${YT - 3})"><path d="M-3,0 Q0,-4 3,0" fill="none" stroke="${C.laiton.corps}" stroke-width="0.9"/><circle cx="0" cy="1.2" r="2.2" fill="#B884F2"${st(0.6)}/><circle cx="-0.6" cy="0.6" r="0.6" fill="#FFFFFF"/></g>`
    + coupe(77, YT - 4, C.or) + bague(48, YT - 6.6, C.or.corps, '#B884F2') + bague(93, YT - 2.6, C.or.corps, '#E87AC8');
  if (C.plus === 'legendaire') return `<g transform="translate(${CX - 14} ${YT - 3})"><path d="M-6,0 L-6,-5 L-3,-2.6 L0,-7 L3,-2.6 L6,-5 L6,0 Z" fill="${C.or.corps}"${st(0.7)}/><rect x="-6" y="-0.6" width="12" height="2.4" fill="${C.or.ombre}"${st(0.6)}/><circle cx="0" cy="0.6" r="0.9" fill="#E87A8A"/><circle cx="-3.6" cy="0.6" r="0.7" fill="#4FC8C0"/><circle cx="3.6" cy="0.6" r="0.7" fill="#4FC8C0"/></g>`
    + `<g transform="translate(${CX + 16} ${YT - 3.6})"><path d="M0,-3.6 L3,0 L0,3 L-3,0 Z" fill="#4FC8C0"${st(0.7)}/><path d="M-1,-1.4 L0,-2.4" stroke="#FFFFFF" stroke-width="0.7"/><circle cx="0" cy="0" r="6" fill="#B8F0EA" opacity=".3"/></g>`
    + coupe(77, YT - 4, C.or) + bague(48, YT - 6.6, C.or.corps, '#E8506A') + bague(93, YT - 2.6, C.or.corps, '#4FC8C0');
  return '';
}
function tresor() {
  // la bouche : le velours du fond, la lumière qui monte (au-dessus de la bouche seulement)
  const B = `M${X0},${YT} L${X1},${YT} L${X1 + DX},${YT + DY} L${X0 + DX},${YT + DY} Z`;
  let o = `<path d="${B}" fill="${C.velours.ombre}"${st(1.1)}/>`;
  o += `<clipPath id="kcl"><path d="M0,0 L120,0 L120,${YT + DY} L${X1 + DX},${YT + DY} L${X1},${YT} L0,${YT} Z"/></clipPath><g clip-path="url(#kcl)"><ellipse cx="${CX + DX / 2}" cy="${YT - 8}" rx="28" ry="22" fill="url(#klu)"/></g>`;
  // ce qui est appuyé contre le couvercle, derrière le trésor : la bouteille à message, la carte roulée
  o += `<g transform="rotate(-18 ${X0 + 24} ${YT + DY})"><rect x="${X0 + 20.6}" y="${YT + DY - 17}" width="6.4" height="14" rx="2.8" fill="#9ED6C8" fill-opacity=".9"${st(0.6)}/><rect x="${X0 + 22}" y="${YT + DY - 20.6}" width="3.6" height="4.4" rx="1" fill="#9ED6C8"${st(0.6)}/><rect x="${X0 + 22.2}" y="${YT + DY - 22.6}" width="3.2" height="2.4" rx="0.8" fill="#B08A5A"${st(0.5)}/><rect x="${X0 + 21.8}" y="${YT + DY - 14.6}" width="4" height="8" rx="1" fill="#F4EBD2"${st(0.4)}/><path d="M${X0 + 21.8},${YT + DY - 15} L${X0 + 21.8},${YT + DY - 5}" stroke="#FFFFFF" stroke-width="0.8" opacity=".8"/></g>`;
  o += `<g transform="rotate(-62 ${X1 + 4} ${YT + DY + 1})"><rect x="${X1 - 4}" y="${YT + DY - 1.2}" width="17" height="4.6" rx="2.3" fill="#F1E2BC"${st(0.6)}/><path d="M${X1 + 4},${YT + DY - 1.2} L${X1 + 4},${YT + DY + 3.4}" stroke="#C9483A" stroke-width="0.9"/></g>`;
  if (R === 'legendaire') o += sceptre();
  // le trésor : une masse d'or qui remplit toute la bouche, un dôme léger vers le fond ; les écus serrés dessus, sans un
  // vide, découpés à sa forme ; l'ombre au fond et sur les bords, des éclats
  const T = `M${X0 + 0.6},${YT} L${X1 - 0.6},${YT} L${X1 + DX - 1},${YT + DY + 0.6} Q${CX + DX / 2 + 8},${YT + DY - 5.4} ${CX + DX / 2},${YT + DY - 5} Q${X0 + DX + 4},${YT + DY - 4.4} ${X0 + DX - 1},${YT + DY + 0.6} Z`;
  let ecus = `<defs><g id="kec"><ellipse rx="2.3" ry="1.1" fill="${C.or.corps}" stroke="${C.or.ombre}" stroke-width="0.4"/><ellipse cx="-0.6" cy="-0.3" rx="0.9" ry="0.32" fill="${C.or.clair}"/></g></defs><rect x="0" y="0" width="120" height="100" fill="${C.or.ombre}"/>`;
  for (let r = 0, y = YT + DY - 6; y < YT + 2; r++, y += 1.35) for (let x = X0 - 2 + (r % 2) * 1.6; x < X1 + DX + 2; x += 3.2) {
    const h = (Math.sin(x * 12.9898 + r * 78.233) * 43758.5453) % 1, k = 0.9 + Math.abs(h) * 0.25;
    ecus += `<use href="#kec" transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"/>`;
  }
  ecus += `<path d="M${X0 + DX - 1},${YT + DY + 0.6} Q${CX + DX / 2},${YT + DY - 6} ${X1 + DX - 1},${YT + DY + 0.6} L${X1 + DX},${YT + DY + 3} L${X0 + DX},${YT + DY + 3} Z" fill="rgba(120,80,20,.28)"/>`;
  ecus += `<path d="M${X1 - 2},${YT} L${X1 + DX},${YT + DY} L${X1 + DX},${YT + 2} Z" fill="rgba(120,80,20,.25)"/>`;
  o += `<clipPath id="ktr"><path d="${T}"/></clipPath><g clip-path="url(#ktr)">${ecus}</g><path d="${T}" fill="none" stroke="${OUT}" stroke-width="0.7"/>`;
  // les gemmes, enfoncées dans les écus (on n'en voit que le dessus)
  // plus le coffre vaut, plus il y a de pierres, et de tailles différentes
  const { n, formes, k: kr } = BIJOUX[R];
  GEMMES.slice(0, n).map((g, i) => [...g, i]).sort((a, b) => a[1] - b[1]).forEach(([x, y, k, i]) => { o += PIERRES[formes[i % formes.length]](x, y, k * kr, C.gemmes[i % C.gemmes.length]); });
  o += plus();
  // le coquillage et la plume, plantés dans le tas ; la petite bourse couchée sur le côté
  o += `<path d="M${CX + 3},${YT - 2.6} Q${CX + 2.4},${YT - 7.6} ${CX + 6.6},${YT - 8} Q${CX + 10.8},${YT - 7.6} ${CX + 10.2},${YT - 2.6} Z" fill="#F7C6B8"${st(0.6)}/>` + [4.6, 6.6, 8.6].map(dx => `<path d="M${CX + dx},${YT - 3} L${CX + 6.6},${YT - 7.2}" stroke="#D8907E" stroke-width="0.5"/>`).join('');
  o += `<path d="M${X0 + 9},${YT - 1.4} Q${X0 + 5.6},${YT - 13} ${X0 + 12.4},${YT - 19} Q${X0 + 13.6},${YT - 10} ${X0 + 9},${YT - 1.4} Z" fill="#F4F2EA"${st(0.6)}/><path d="M${X0 + 9},${YT - 1.4} Q${X0 + 10},${YT - 10} ${X0 + 12.4},${YT - 18}" fill="none" stroke="#B8B0A0" stroke-width="0.5"/>`;
  o += `<path d="M${X1 - 6},${YT - 0.6} Q${X1 - 7.4},${YT - 6.6} ${X1 - 2},${YT - 7.4} Q${X1 + 3},${YT - 6.6} ${X1 + 2},${YT - 0.6} Z" fill="#B07A4A"${st(0.6)}/><path d="M${X1 - 6},${YT - 5.4} Q${X1 - 2},${YT - 3.6} ${X1 + 1.6},${YT - 5.4}" fill="none" stroke="#E2B44E" stroke-width="0.9"/>`;
  // le rebord de bois de la bouche, par-dessus : le trésor est bien dedans
  o += `<path d="M${X0},${YT} L${X1},${YT} L${X1 + DX},${YT + DY}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${X0 + 0.6},${YT} L${X1},${YT} L${X1 + DX - 0.6},${YT + DY + 0.4}" fill="none" stroke="${C.bois.clair}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // ce qui déborde sur le rebord : trois écus, le collier de perles qui pend sur la face
  const ecu = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.2" fill="${C.or.corps}"${st(0.45)} transform="rotate(${a} ${x} ${y})"/><ellipse cx="${x - 0.7}" cy="${y - 0.3}" rx="0.9" ry="0.35" fill="${C.or.clair}" transform="rotate(${a} ${x} ${y})"/>`;
  o += ecu(X0 + 13, YT - 0.4, -14) + ecu(X0 + 16.4, YT + 0.2, 10) + ecu(X1 - 4, YT - 0.2, 18);
  let perles = '';
  for (let i = 0; i <= 11; i++) { const t = i / 11, x = CX + 8 + t * 20, y = YT - 0.6 + Math.sin(t * Math.PI) * 7.4; perles += `<circle cx="${f(x)}" cy="${f(y)}" r="1.15" fill="#FBF6EE" stroke="${OUT}" stroke-width="0.4"/><circle cx="${f(x - 0.35)}" cy="${f(y - 0.35)}" r="0.35" fill="#FFFFFF"/>`; }
  o += perles + `<path d="M${CX + 18},${YT + 6.8} L${CX + 20},${YT + 9.2} L${CX + 18},${YT + 11.6} L${CX + 16},${YT + 9.2} Z" fill="${C.gemmes[0]}"${st(0.5)}/>`;
  if (R === 'epique' || R === 'legendaire') {
    let ch = '';
    for (let i = 0; i <= 14; i++) { const t = i / 14, x = X0 + 14 + t * 13, y = YT - 0.4 + Math.sin(t * Math.PI) * 5.6; ch += `<circle cx="${f(x)}" cy="${f(y)}" r="0.65" fill="${C.or.corps}" stroke="${C.or.ombre}" stroke-width="0.3"/>`; }
    o += ch + PIERRES.goutte(X0 + 20.5, YT + 8.2, 0.9, R === 'epique' ? '#B884F2' : '#E8506A');
  }
  // des écus tombés dans le sable
  for (const [x, y] of [[X0 - 2, YB + 3.2], [X0 + 4, YB + 4.6], [CX - 10, YB + 4.4], [X1 + 6, YB + 2.4]]) o += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.2" fill="${C.or.corps}"${st(0.45)}/><ellipse cx="${x - 0.7}" cy="${y - 0.3}" rx="0.9" ry="0.35" fill="${C.or.clair}"/>`;
  return o;
}
// ——— les scintillements : une image par phase p (0 ≤ p < 1), la boucle se referme ———
const pulse = (p, off) => { const v = Math.sin(2 * Math.PI * (p + off)); return v > 0 ? v * v : 0; };
const frac = x => x - Math.floor(x);
// une étoile à quatre branches fines, son cœur blanc, son halo de la couleur de la rareté
const scint = (x, y, s, k, rot = 0) => k < 0.06 ? '' : `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s * k)})" opacity="${f(0.4 + 0.6 * k)}"><circle r="1.5" fill="${C.lueur[0]}" opacity=".45"/><path d="M0,-2.6 L0.32,-0.32 L2.6,0 L0.32,0.32 L0,2.6 L-0.32,0.32 L-2.6,0 L-0.32,-0.32 Z" fill="#FFFFFF"/><circle r="0.5" fill="#FFFFFF"/></g>`;
const etincelle = (x, y, s) => `<path d="M${x},${y - s} L${f(x + s * 0.28)},${f(y - s * 0.28)} L${x + s},${y} L${f(x + s * 0.28)},${f(y + s * 0.28)} L${x},${y + s} L${f(x - s * 0.28)},${f(y + s * 0.28)} L${x - s},${y} L${f(x - s * 0.28)},${f(y - s * 0.28)} Z" fill="#FFFBEA" stroke="${OUT}" stroke-width="0.4"/>`;
// la grande étincelle cernée (comme avant), qui grandit et rapetisse
const grande = (x, y, s, k) => k < 0.06 ? '' : `<g transform="translate(${x} ${y}) scale(${f(k)})">${etincelle(0, 0, s)}</g>`;
// combien d'éclats, de grandes étincelles et de grains de lumière selon la rareté
const ECLATS = { commun: [6, 2, 6], rare: [9, 3, 8], epique: [12, 3, 11], legendaire: [16, 4, 14] };
function scintille(p) {
  const [ne, ng, nm] = ECLATS[R];
  let o = '';
  // la lueur qui respire au-dessus de la bouche
  o += `<g clip-path="url(#kcl)"><ellipse cx="${CX + DX / 2}" cy="${YT - 10}" rx="30" ry="24" fill="url(#klu)" opacity="${f(0.18 + 0.22 * pulse(p, 0.1))}"/></g>`;
  // les grains de lumière qui montent du trésor et s'éteignent
  for (let i = 0; i < nm; i++) {
    const t = frac(p + i * 0.618), x = X0 + 10 + frac(i * 0.381) * (X1 - X0 + DX - 14), y = YT - 4 - t * 30 - frac(i * 0.27) * 4;
    const a = Math.sin(Math.PI * t), r = 0.5 + frac(i * 0.53) * 0.6;
    o += `<circle cx="${f(x + Math.sin(t * 6.3 + i) * 1.6)}" cy="${f(y)}" r="${f(r * 2.6)}" fill="${C.lueur[1]}" opacity="${f(0.3 * a)}"/><circle cx="${f(x + Math.sin(t * 6.3 + i) * 1.6)}" cy="${f(y)}" r="${f(r)}" fill="#FFFDE8" opacity="${f(0.95 * a)}"/>`;
  }
  // les éclats sur les pierres et les écus, chacun à son tour
  const { n } = BIJOUX[R];
  for (let i = 0; i < ne; i++) {
    const g = GEMMES[(i * 5) % n], k = pulse(p, i / ne + (i % 3) * 0.13);
    o += scint(g[0] + 0.6, g[1] - 1.8, 1.05 + 0.3 * (i % 3), k, 45 * p);
  }
  // les grandes étincelles, autour
  [[34, 34, 3], [88, 26, 2.6], [62, 10, 2.4], [96, 40, 2]].slice(0, ng).forEach(([x, y, s], i) => { o += grande(x, y, s, pulse(p, 0.5 + i * 0.29)); });
  return o;
}
// fermé : un reflet passe sur la serrure, sa pierre brille ; le légendaire luit déjà par ses runes
function reflet(p) {
  const x = CX - 22 + p * 56;
  let o = `<g clip-path="url(#kpq)"><path d="M${f(x)},${YT - 2} l5,0 l-9,24 l-5,0 Z" fill="#FFFFFF" opacity=".55"/><path d="M${f(x + 7)},${YT - 2} l1.6,0 l-9,24 l-1.6,0 Z" fill="#FFFFFF" opacity=".4"/></g>`;
  if (SE.gemme) o += scint(CX + 0.5, YT - 4.8, 0.9, pulse(p, 0.62));
  if (R === 'legendaire') for (const [i, x] of [X0 + 18, X0 + 30, X1 - 30, X1 - 18].entries()) o += `<circle cx="${x}" cy="${YT + 24}" r="3" fill="#7AE8E0" opacity="${f(0.35 * pulse(p, i * 0.25))}"/>`;
  if (R !== 'commun') o += scint(X0 + 9.5, YT - LH0 - 2, 0.8, pulse(p, 0.2)) + scint(X1 + DX - 2, YT + DY - LH0 - 1, 0.7, pulse(p, 0.75));
  return o;
}


// ——— les images ———
// Les quatre raretés pour le jeu : leur nom et la couleur de leur lueur (world/chest.js)
export const RARITIES = {
  commun: { label: 'Commun', glow: '#9DBB6E' },
  rare: { label: 'Rare', glow: '#4C8FE8' },
  epique: { label: 'Épique', glow: '#A86BE8' },
  legendaire: { label: 'Légendaire', glow: '#F2C04B' }
};
const PH = 12, MS = 100; // l'animation : 12 phases de 100 ms, en boucle
const KPQ = `<defs><clipPath id="kpq"><path d="${PLAQUE}"/></clipPath></defs>`;
function use(key) { C = PALETTES[key]; SE = SERRURES[key]; R = key; }
// les noms des dégradés et des découpes portent la rareté (cfrare_kbF…) : deux coffres dans une même page ne se mêlent pas
const ids = (key, s) => s.replace(/(id="|url\(#|href="#)k/g, `$1cf${key}_`);
// un calque animé : ses phases empilées, chacune visible 100 ms à son tour (SMIL, tourne dans un <img>) ; sans
// animation, on voit la phase « fixe »
function anime(calque, fixe) {
  let o = '';
  for (let i = 0; i < PH; i++) o += `<g opacity="${i === fixe ? 1 : 0}"><animate attributeName="opacity" values="1;0" keyTimes="0;${f(1 / PH)}" calcMode="discrete" dur="${PH * MS}ms" begin="${-(PH - i) * MS}ms" repeatCount="indefinite"/>${calque(i / PH)}</g>`;
  return o;
}
const coffreFerme = () => defs() + sol() + corps(false) + couvercle();
const coffreOuvert = () => defs() + sol() + couvercleOuvert() + corps(true) + tresor();

// Fermé (2 images, la même animation : le reflet passe sur la serrure, sa pierre brille ; sans animation, l'image 1 et
// l'image 2 montrent deux moments)
export function closed(key, n = 0) { use(key); return ids(key, coffreFerme() + KPQ + anime(reflet, n ? PH / 2 : 0)); }
// L'ouverture (4 images fixes, une fois) : il tremble à gauche, à droite, le couvercle s'entrouvre et la lumière fuit,
// il s'ouvre grand
export function opening(key, n) {
  use(key);
  if (n === 0 || n === 1) {
    const s = n ? 1 : -1, xl = n ? X1 + DX + 6 : X0 - 8;
    return ids(key, defs() + sol() + `<g transform="translate(${1.6 * s} 0) rotate(${2.5 * s} ${CX} ${YB})">${corps(false) + couvercle()}</g>`
      + `<path d="M${xl},${YT - 8} l${4 * s},-2.4 M${xl + s},${YT} l${5 * s},0 M${xl},${YT + 8} l${4 * s},2.4" stroke="${OUT}" stroke-width="1.1" stroke-linecap="round"/>`);
  }
  if (n === 2) {
    // la fente : le couvercle se soulève d'un bloc, la lumière de la rareté passe dessous et fuit des deux côtés
    let o = defs() + sol() + corps(false);
    o += `<path d="M${X0 + 0.6},${YT} L${X1},${YT} L${X1 + DX - 0.6},${YT + DY} L${X0 + DX},${YT + DY} Z" fill="#FFFBEA"/>`;
    o += `<g transform="translate(0 -5)">${couvercle()}</g>`;
    const rais = (x, y, angles, L) => angles.map((a, i) => { const r = a * Math.PI / 180, s = 0.1; return `<path d="M${x},${y} L${f(x + Math.cos(r - s) * L[i])},${f(y + Math.sin(r - s) * L[i])} L${f(x + Math.cos(r + s) * L[i])},${f(y + Math.sin(r + s) * L[i])} Z" fill="${C.lueur[0]}" opacity="${i % 2 ? 0.5 : 0.7}"/>`; }).join('');
    o += `<ellipse cx="${CX}" cy="${YT - 2.4}" rx="${(X1 - X0) / 2 + 4}" ry="3" fill="${C.lueur[0]}" opacity=".55"/>`;
    o += rais(X0 + 1, YT - 2.4, [200, 182, 162], [16, 20, 14]) + rais(X1 + DX - 1, YT + DY - 2.4, [-18, 0, 20], [14, 20, 16]);
    o += `<path d="M${X0 + 2},${YT - 2.4} L${X1 - 2},${YT - 2.4}" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>`;
    o += grande(X0 - 6, YT - 12, 2.6, 1) + grande(X1 + DX + 6, YT - 16, 2.2, 1);
    return ids(key, o);
  }
  return ids(key, coffreOuvert() + scintille(0.2));
}
// Ouvert (2 images, la même animation : les éclats sur les pierres, les grains de lumière qui montent, les grandes
// étincelles, la lueur qui respire ; sans animation, deux moments)
export function open(key, n) { use(key); return ids(key, coffreOuvert() + anime(scintille, n ? PH / 2 : 0)); }
// Calque de lumière à poser derrière le coffre ouvert (facultatif : le jeu a ses rayons en CSS) ; 2 images, les rayons
// tournent un peu
export function glow(key, n) {
  use(key);
  const cx = CX + DX / 2, cy = YT + DY / 2, k = n ? 0.92 : 1, ph = n ? 0.08 : 0;
  let o = `<defs><radialGradient id="kha"><stop offset="0" stop-color="${RARITIES[key].glow}" stop-opacity="${f(0.55 * k)}"/><stop offset="1" stop-color="${RARITIES[key].glow}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy - 8}" rx="${f(50 * k)}" ry="${f(38 * k)}" fill="url(#kha)"/>`;
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * (0.15 + 0.7 * (i / 8)) + ph, L = (i % 2 ? 36 : 44) * k, s = 0.07;
    o += `<path d="M${cx},${cy} L${f(cx + Math.cos(a - s) * L)},${f(cy + Math.sin(a - s) * L)} L${f(cx + Math.cos(a + s) * L)},${f(cy + Math.sin(a + s) * L)} Z" fill="${i % 2 ? C.lueur[0] : RARITIES[key].glow}" opacity="${f(0.5 * k)}"/>`;
  }
  return ids(key, o);
}
// Petite icône (cadre 32 × 32) : le coffre fermé, réduit
export function icon(key) { use(key); return ids(key, `<g transform="translate(-3.5 -3.8) scale(0.33)">${coffreFerme()}</g>`); }
