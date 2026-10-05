// Icônes de l'interface, dessinées comme les éléments (64 × 64, aplats cernés) : elles remplacent les emojis du jeu
// (ressources, écus, chapitre, plan, carte, cadenas…). On les désigne par « ui:<nom> » partout où un glyphe s'affiche
// (ElementGlyph en HTML, glyph() du Livre sur un canvas).
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`;

export const ICONS = {
  // Ressources de l'île
  stone: svg('<path d="M5 46l8-21 18-11 19 6 10 17-5 14-20 6-23-4z" fill="#8f8f8a" stroke="#45453f" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M13 25l18-11 19 6-18 11z" fill="#c4c4bd"/><path d="M32 31l18-11 10 17-5 14-20 6z" fill="#74746e"/>'
    + '<path d="M13 25l19 6 18-11M32 31l-3 26" fill="none" stroke="#45453f" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M18 25l9-6" stroke="#ecece6" stroke-width="2.6" stroke-linecap="round"/>'),
  wood: svg('<rect x="6" y="21" width="42" height="24" rx="5" fill="#a8703c" stroke="#5a3a1c" stroke-width="3"/>'
    + '<path d="M12 29h18M16 37h20" stroke="#7a4e26" stroke-width="2.5" stroke-linecap="round"/>'
    + '<ellipse cx="48" cy="33" rx="10" ry="12" fill="#e8c088" stroke="#5a3a1c" stroke-width="3"/>'
    + '<ellipse cx="48" cy="33" rx="5.5" ry="7" fill="none" stroke="#b9854a" stroke-width="2"/><circle cx="48" cy="33" r="1.8" fill="#b9854a"/>'),
  water: svg('<path d="M32 6C24 20 14 30 14 41a18 18 0 0 0 36 0C50 30 40 20 32 6z" fill="#4aa8e8" stroke="#1e5f94" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M22 40a10 10 0 0 0 7 10" fill="none" stroke="#c6eaff" stroke-width="3.5" stroke-linecap="round"/>'),
  food: svg('<path d="M32 19c-6-4-18-3-20 9-2 12 6 27 14 29 3 1 4-1 6-1s3 2 6 1c8-2 16-17 14-29-2-12-14-13-20-9z" fill="#e2483a" stroke="#8a1e16" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M32 19c0-5 1-9 4-12" fill="none" stroke="#5a3a1c" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M35 13c4-5 11-5 14-2-3 4-9 5-14 2z" fill="#5ab04a" stroke="#2e6a24" stroke-width="2.2" stroke-linejoin="round"/>'
    + '<path d="M19 31c0-4 3-7 6-7" fill="none" stroke="#ffb8ad" stroke-width="3" stroke-linecap="round"/>'),
  fish: svg('<path d="M46 32l12-10v20z" fill="#4f9fd2" stroke="#1e4e74" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M6 32c8-12 28-14 40 0-12 14-32 12-40 0z" fill="#5aaee0" stroke="#1e4e74" stroke-width="3" stroke-linejoin="round"/>'
    + '<circle cx="16" cy="30" r="2.6" fill="#1e2a34"/><path d="M25 25c3 4 3 10 0 14" fill="none" stroke="#1e4e74" stroke-width="2.2" stroke-linecap="round"/>'
    + '<path d="M12 37c7 3 16 3 23 0" fill="none" stroke="#c6eaff" stroke-width="2.5" stroke-linecap="round"/>'),
  // Écus, chapitre du Livre, plan, carte
  coin: svg('<circle cx="32" cy="32" r="25" fill="#f2c04b" stroke="#8a6214" stroke-width="3"/>'
    + '<circle cx="32" cy="32" r="18" fill="none" stroke="#c8922a" stroke-width="2.5"/>'
    + '<path d="M32 21l3.4 7.2 7.8.9-5.8 5.3 1.6 7.8L32 38.3l-7 3.9 1.6-7.8-5.8-5.3 7.8-.9z" fill="#c8922a"/>'
    + '<path d="M18 25a16 16 0 0 1 9-8" fill="none" stroke="#fff1c2" stroke-width="3" stroke-linecap="round"/>'),
  book: svg('<path d="M5 15c9-3 19-2 27 4v34c-8-6-18-7-27-4z" fill="#f6eedd" stroke="#5a3a1c" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M59 15c-9-3-19-2-27 4v34c8-6 18-7 27-4z" fill="#f6eedd" stroke="#5a3a1c" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M11 25c5-1 11-1 15 2M11 33c5-1 11-1 15 2M38 27c4-3 10-3 15-2M38 35c4-3 10-3 15-2" fill="none" stroke="#b9a07a" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path d="M5 49v5c9-3 19-2 27 4 8-6 18-7 27-4v-5" fill="none" stroke="#8a2e24" stroke-width="3" stroke-linejoin="round"/>'),
  plan: svg('<path d="M16 12h30a6 6 0 0 1 6 6v34H22a6 6 0 0 1-6-6z" fill="#f3e2b8" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M16 12a6 6 0 0 0-6 6v4h12v-4a6 6 0 0 0-6-6z" fill="#dcbc80" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M52 52a6 6 0 0 1-6 6H28a6 6 0 0 0 6-6z" fill="#dcbc80" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M26 22h18M26 30h18M26 38h12" stroke="#a88a5a" stroke-width="2.6" stroke-linecap="round"/>'),
  map: svg('<path d="M6 14l16-6 20 6 16-6v42l-16 6-20-6-16 6z" fill="#ecdcab" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M22 8v42l20 6V14z" fill="#e0cc94"/><path d="M22 8v42M42 14v42" stroke="#6a4a22" stroke-width="2.5"/>'
    + '<path d="M12 22c3-3 6-2 7 1-2 3-5 4-7 2z" fill="#7cb85a"/>'
    + '<path d="M11 42c6-6 11 1 17-4s9-11 16-7" fill="none" stroke="#c8322a" stroke-width="2.6" stroke-dasharray="3.5 3" stroke-linecap="round"/>'
    + '<path d="M47 22l5 5m0-5l-5 5" stroke="#c8322a" stroke-width="3" stroke-linecap="round"/>'),
  // Étincelle (glyphe par défaut), cadenas, élément inconnu, pousse (pages fertiles)
  spark: svg('<path d="M27 6c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18z" fill="#ffd34d" stroke="#b07a10" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M48 35c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z" fill="#ffe89a" stroke="#b07a10" stroke-width="2.3" stroke-linejoin="round"/>'
    + '<path d="M15 44c.8 4 2 5.2 6 6-4 .8-5.2 2-6 6-.8-4-2-5.2-6-6 4-.8 5.2-2 6-6z" fill="#ffe89a" stroke="#b07a10" stroke-width="2" stroke-linejoin="round"/>'),
  lock: svg('<path d="M20 29v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#6e6a64" stroke-width="5.5" stroke-linecap="round"/>'
    + '<rect x="11" y="28" width="42" height="29" rx="5" fill="#e9b949" stroke="#7a5414" stroke-width="3"/>'
    + '<circle cx="32" cy="40" r="4.2" fill="#5a3a10"/><path d="M32 42v7" stroke="#5a3a10" stroke-width="3.6" stroke-linecap="round"/>'
    + '<path d="M16 33v9" stroke="#fff1c2" stroke-width="2.6" stroke-linecap="round"/>'),
  unknown: svg('<circle cx="32" cy="32" r="26" fill="#efe3c6" stroke="#8a6a3a" stroke-width="3" stroke-dasharray="5 4"/>'
    + '<path d="M24 25a8 8 0 1 1 11 7.4c-2 .9-3 2.4-3 4.6v2" fill="none" stroke="#6a4a22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="32" cy="47.5" r="3.3" fill="#6a4a22"/>'),
  sprout: svg('<path d="M10 56c5-5 39-5 44 0z" fill="#8a5a2e" stroke="#5a3a1c" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M32 54V32" stroke="#3e7a2a" stroke-width="4" stroke-linecap="round"/>'
    + '<path d="M32 38C30 26 20 20 8 22c0 12 10 18 24 16z" fill="#6cc04a" stroke="#2e6a1e" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M32 31c2-12 12-18 24-16 0 12-10 18-24 16z" fill="#8ad45a" stroke="#2e6a1e" stroke-width="3" stroke-linejoin="round"/>'),
  // Panier d'osier plein (« Tout récolter »)
  basket: svg('<path d="M15 31a17 17 0 0 1 34 0" fill="none" stroke="#7a4e24" stroke-width="4" stroke-linecap="round"/>'
    + '<circle cx="24" cy="28" r="7.5" fill="#e2483a" stroke="#8a1e16" stroke-width="2.6"/>'
    + '<path d="M37 30c-1-7 3-11 9-11 0 6-3 10-9 11z" fill="#8ad45a" stroke="#2e6a1e" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M8 33h48l-5 20a4 4 0 0 1-4 3H17a4 4 0 0 1-4-3z" fill="#c8893e" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M11 42h42M13 49h38M23 35v20M32 35v21M41 35v20" stroke="#8a5a2a" stroke-width="2.2"/>'
    + '<rect x="5" y="29" width="54" height="7" rx="3.5" fill="#dba25a" stroke="#6a4a22" stroke-width="3"/>')
};

// Adresse d'une icône (data: URL), calculée une fois ; null si l'icône n'existe pas. Taille explicite : un canvas
// dessinerait sinon le SVG en 300 × 150, déformé (en HTML, le CSS la ramène à la taille du texte)
const urls = new Map();
export function iconSrc(name) {
  if (!Object.prototype.hasOwnProperty.call(ICONS, name)) return null;
  if (!urls.has(name)) urls.set(name, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ICONS[name].replace('<svg', '<svg width="256" height="256"'))}`);
  return urls.get(name);
}
