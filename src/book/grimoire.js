// Le grimoire : dessins partagés par les pages peintes (Path2D) et la reliure (SVG).
// - sigles des sept planètes, les sept métaux de l'alchimie : un par chapitre ;
// - ornements dorés des pages (coins, losange) ;
// - pièces fixes de la reliure en images SVG (cuir, coins et fermoir en laiton, lanière, couverture) : chaque image
//   est isolée (ses dégradés ne se mélangent pas à ceux de la page) et rastérisée une fois par le navigateur.

// Sigles (viewBox 24 × 24, à tracer en traits) : I Mercure, II Saturne, III Lune, IV Vénus, V Mars, VI Jupiter, VII Soleil
export const SIGILS = {
  I: { name: 'Mercure', d: 'M8 2.5a4 4 0 0 0 8 0M16 9.5a4 4 0 1 1-8 0a4 4 0 1 1 8 0M12 13.5v8M8.8 18h6.4' },
  II: { name: 'Saturne', d: 'M9 2.5v12M5.8 5.6h6.4M9 11.5c1.6-2.8 6.6-2.6 6.6 1.6c0 2.6-3 3.6-3 6.2c0 1.2.8 2.2 2.2 2.2' },
  III: { name: 'Lune', d: 'M15.5 3.2a8.8 8.8 0 1 0 0 17.6a7.2 7.2 0 1 1 0-17.6z' },
  IV: { name: 'Vénus', d: 'M17 8.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M12 13.5v8.5M8.5 18.2h7' },
  V: { name: 'Mars', d: 'M14.5 14.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M13.2 10.8L20 4M14.6 4H20v5.4' },
  VI: { name: 'Jupiter', d: 'M5.5 7c1.4-2.6 5.6-3 6.6-.4c1 2.6-2 6.4-6.4 10.4h13.6M16 11.5v10' },
  VII: { name: 'Soleil', d: 'M20 12a8 8 0 1 1-16 0a8 8 0 1 1 16 0M13.7 12a1.7 1.7 0 1 1-3.4 0a1.7 1.7 0 1 1 3.4 0' }
};
export const CHAPTER_IDS = Object.keys(SIGILS);

// Ornements des pages (en u) : fleuron de coin (le coin du cadre en 0,0, vers l'intérieur de la page) et losange
export const ORNAMENTS = {
  corner: 'M0 5.4C0 2.4 2.4 0 5.4 0M1.6 1.6C3 .6 4.6 1 5.2 2.2C4 2.8 2.6 3 1.6 1.6zM1.6 1.6C.6 3 1 4.6 2.2 5.2C2.8 4 3 2.6 1.6 1.6z',
  diamond: 'M-2.2 0L0-1.3L2.2 0L0 1.3z'
};

export const GOLD = { light: '#F6DE9A', base: '#C9A24A', dark: '#7A5A1E', edge: '#5A3F12' };
// Teinte du cuir et de la soie du signet hors chapitre (sommaire)
export const LEATHER = { base: '#5C1F25', deep: '#34100F', garnet: '#8E2B3A' };

const uri = svg => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
const brass = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${GOLD.light}"/><stop offset=".45" stop-color="${GOLD.base}"/><stop offset="1" stop-color="${GOLD.dark}"/></linearGradient>`;

// Grain du cuir, en motif répétable : pores sombres et plis clairs
export const LEATHER_GRAIN = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
<filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .08  0 0 0 0 .03  0 0 0 0 .02  0 0 0 1.1 -.42"/></filter>
<filter id="c" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".028" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .86  0 0 0 0 .7  0 0 0 .5 -.2"/></filter>
<rect width="180" height="180" filter="url(#p)"/><rect width="180" height="180" filter="url(#c)"/></svg>`);

// Coin en laiton ciselé (coin haut-gauche ; les autres par rotation)
export const BRASS_CORNER = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs>${brass('b')}</defs>
<path d="M1 1H36Q33 7 26 9.5Q17 12 12.5 16.5Q9 24 7 30Q5 35 1 37Z" fill="url(#b)" stroke="${GOLD.edge}" stroke-width="1"/>
<path d="M4.5 4.5H27Q20 7.5 15 10.5Q9 15 6.5 22.5Q5.5 26.5 4.5 28" fill="none" stroke="rgba(255,240,200,.6)" stroke-width="1"/>
<path d="M10 6.5q4 1 5.5 4M6.5 10q1 4 4 5.5" fill="none" stroke="${GOLD.edge}" stroke-width=".8" opacity=".6"/>
<circle cx="8.5" cy="8.5" r="2.6" fill="#6B4A16"/><circle cx="7.8" cy="7.8" r="1.1" fill="#FBE7B0"/></svg>`);

// Fermoir (la gâche, sur la tranche du plat de droite) : plaque de laiton rivetée, la gemme posée dessus à part
export const CLASP_PLATE = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="64" viewBox="0 0 30 64"><defs>${brass('b')}</defs>
<path d="M2 6Q2 2 6 2H22Q29 2 29 10V54Q29 62 22 62H6Q2 62 2 58Z" fill="url(#b)" stroke="${GOLD.edge}" stroke-width="1"/>
<path d="M5 9Q5 5 9 5H21Q26 5 26 11V53Q26 59 21 59H9Q5 59 5 55Z" fill="none" stroke="rgba(255,240,200,.55)" stroke-width=".9"/>
<path d="M9 14q6-4 12 0M9 50q6 4 12 0" fill="none" stroke="${GOLD.edge}" stroke-width=".9" opacity=".7"/>
<circle cx="8" cy="9" r="1.6" fill="#6B4A16"/><circle cx="8" cy="55" r="1.6" fill="#6B4A16"/></svg>`);

// Lanière du fermoir, ouverte (cuir et embout de laiton) ; pointe vers la droite
export const CLASP_STRAP = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="26" viewBox="0 0 64 26"><defs>${brass('b')}
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A2A31"/><stop offset="1" stop-color="#3A1215"/></linearGradient></defs>
<path d="M0 5H40V21H0Z" fill="url(#s)"/><path d="M2 7.5H38M2 18.5H38" stroke="rgba(214,170,90,.55)" stroke-width=".8" stroke-dasharray="2 1.6"/>
<path d="M38 3H56Q63 3 63 13Q63 23 56 23H38Z" fill="url(#b)" stroke="${GOLD.edge}" stroke-width="1"/>
<circle cx="45" cy="13" r="2.2" fill="#6B4A16"/><circle cx="44.4" cy="12.4" r=".9" fill="#FBE7B0"/></svg>`);

// Plat de la couverture fermée : cadre doré à double filet, fleurons, médaillon (cercle, carré, triangle, cercle :
// la quadrature du cercle) et les sept sigles autour ; le titre, la gemme et les sigles qui s'allument sont posés
// par-dessus en HTML (police du jeu, animations)
export function coverArt() {
  const ring = CHAPTER_IDS.map((id, k) => {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
    const x = 100 + Math.cos(a) * 58, y = 131 + Math.sin(a) * 58;
    return `<g transform="translate(${(x - 7).toFixed(1)} ${(y - 7).toFixed(1)}) scale(.58)"><path d="${SIGILS[id].d}" fill="none" stroke="${GOLD.dark}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }).join('');
  const fleuron = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(2.1)"><path d="${ORNAMENTS.corner}" fill="${GOLD.base}" stroke="${GOLD.edge}" stroke-width=".25"/></g>`;
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="262" viewBox="0 0 200 262" preserveAspectRatio="none">
<defs>${brass('b')}<radialGradient id="l" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="#7A2A31"/><stop offset=".6" stop-color="${LEATHER.base}"/><stop offset="1" stop-color="${LEATHER.deep}"/></radialGradient></defs>
<rect width="200" height="262" rx="9" fill="url(#l)"/>
<rect x="9" y="9" width="182" height="244" rx="5" fill="none" stroke="${GOLD.base}" stroke-width="1.6" opacity=".8"/>
<rect x="14" y="14" width="172" height="234" rx="3" fill="none" stroke="${GOLD.base}" stroke-width=".7" opacity=".7"/>
${fleuron(17, 17, 0)}${fleuron(183, 17, 90)}${fleuron(183, 245, 180)}${fleuron(17, 245, 270)}
<circle cx="100" cy="131" r="70" fill="none" stroke="${GOLD.base}" stroke-width="1.4" opacity=".75"/>
<circle cx="100" cy="131" r="46" fill="rgba(0,0,0,.18)" stroke="url(#b)" stroke-width="2.4"/>
<rect x="67.5" y="98.5" width="65" height="65" fill="none" stroke="${GOLD.base}" stroke-width="1.3" opacity=".85" transform="rotate(45 100 131)"/>
<path d="M100 93L133 150H67Z" fill="none" stroke="${GOLD.base}" stroke-width="1.3" opacity=".85"/>
<circle cx="100" cy="131" r="20" fill="none" stroke="${GOLD.base}" stroke-width="1.1" opacity=".8"/>
${ring}
<path d="M40 222q60 -12 120 0" fill="none" stroke="${GOLD.base}" stroke-width=".9" opacity=".6"/>
<path d="M40 40q60 12 120 0" fill="none" stroke="${GOLD.base}" stroke-width=".9" opacity=".6"/></svg>`);
}
