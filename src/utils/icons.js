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
  // Panier d'osier plein (« Tout ramasser » : la production des bâtiments)
  basket: svg('<path d="M15 31a17 17 0 0 1 34 0" fill="none" stroke="#7a4e24" stroke-width="4" stroke-linecap="round"/>'
    + '<circle cx="24" cy="28" r="7.5" fill="#e2483a" stroke="#8a1e16" stroke-width="2.6"/>'
    + '<path d="M37 30c-1-7 3-11 9-11 0 6-3 10-9 11z" fill="#8ad45a" stroke="#2e6a1e" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M8 33h48l-5 20a4 4 0 0 1-4 3H17a4 4 0 0 1-4-3z" fill="#c8893e" stroke="#6a4a22" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M11 42h42M13 49h38M23 35v20M32 35v21M41 35v20" stroke="#8a5a2a" stroke-width="2.2"/>'
    + '<rect x="5" y="29" width="54" height="7" rx="3.5" fill="#dba25a" stroke="#6a4a22" stroke-width="3"/>'),
  // Besoins des habitants : travailler (marteau), se distraire (fleur) ; leur humeur (heureux, content, triste)
  tools: svg('<path d="M13 55L39 25" stroke="#5a3a1c" stroke-width="10" stroke-linecap="round"/>'
    + '<path d="M13 55L39 25" stroke="#c8893e" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M55.5 25.3L48.3 33.7 28.5 16.7 35.7 8.3z" fill="#9a9a94" stroke="#45453f" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M33 12.5l17 14.6" stroke="#dcdcd5" stroke-width="2.6" stroke-linecap="round"/>'),
  flower: svg('<path d="M32 58V32" stroke="#2e6a1e" stroke-width="4" stroke-linecap="round"/>'
    + '<path d="M32 49c-8-1-13-6-14-12 8 0 13 5 14 12z" fill="#6cc04a" stroke="#2e6a1e" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<g fill="#f58fb4" stroke="#a3285a" stroke-width="2.6"><circle cx="32" cy="13" r="8"/><circle cx="42.5" cy="20.6" r="8"/>'
    + '<circle cx="38.5" cy="32.9" r="8"/><circle cx="25.5" cy="32.9" r="8"/><circle cx="21.5" cy="20.6" r="8"/></g>'
    + '<circle cx="32" cy="24" r="6.5" fill="#ffd34d" stroke="#b07a10" stroke-width="2.6"/>'),
  smile: svg('<circle cx="32" cy="32" r="25" fill="#ffd34d" stroke="#b07a10" stroke-width="3"/>'
    + '<circle cx="18" cy="37" r="4" fill="#f5998a"/><circle cx="46" cy="37" r="4" fill="#f5998a"/>'
    + '<path d="M20 27q4-5 8 0M36 27q4-5 8 0" fill="none" stroke="#5a3a10" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M21 37q11 12 22 0" fill="none" stroke="#5a3a10" stroke-width="3.6" stroke-linecap="round"/>'),
  calm: svg('<circle cx="32" cy="32" r="25" fill="#f6dc8a" stroke="#a07a20" stroke-width="3"/>'
    + '<circle cx="24" cy="27" r="3.4" fill="#5a3a10"/><circle cx="40" cy="27" r="3.4" fill="#5a3a10"/>'
    + '<path d="M23 41h18" stroke="#5a3a10" stroke-width="3.6" stroke-linecap="round"/>'),
  frown: svg('<circle cx="32" cy="32" r="25" fill="#c9d6ea" stroke="#4a5a7a" stroke-width="3"/>'
    + '<path d="M18 25l8-3M46 25l-8-3" stroke="#2e3a52" stroke-width="3.2" stroke-linecap="round"/>'
    + '<circle cx="24" cy="31" r="3.2" fill="#2e3a52"/><circle cx="40" cy="31" r="3.2" fill="#2e3a52"/>'
    + '<path d="M22 46q10-9 20 0" fill="none" stroke="#2e3a52" stroke-width="3.6" stroke-linecap="round"/>'
    + '<path d="M44 35c-2 4-3 6-1 8s5 0 4-3z" fill="#7ac0f0" stroke="#2e6a9e" stroke-width="1.6"/>'),
  // Trouvailles de climat (lot 9d)
  glace: svg('<path d="M32 5l20 12v30L32 59 12 47V17z" fill="#bfe7f7" stroke="#2e6a9e" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M12 17l20 12 20-12M32 29v30" fill="none" stroke="#2e6a9e" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<path d="M32 29l20-12v30L32 59z" fill="#8ccbe8"/><path d="M12 17l20-12 20 12-20 12z" fill="#e9f8ff"/>'
    + '<path d="M18 24v16M24 21l6 4" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>'),
  laine: svg('<circle cx="31" cy="34" r="22" fill="#f4ecdc" stroke="#7a6a52" stroke-width="3"/>'
    + '<path d="M13 26c10 2 26 14 30 26M11 36c12 0 26 8 30 18M18 16c8 6 20 22 22 36M30 12c6 8 14 22 14 32" fill="none" stroke="#c9b894" stroke-width="2.6" stroke-linecap="round"/>'
    + '<path d="M50 44c4 4 6 8 8 14" fill="none" stroke="#7a6a52" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M18 24a16 16 0 0 1 8-6" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>'),
  roseau: svg('<path d="M22 58C22 40 20 26 16 10M32 58V8M42 58c0-18 2-32 6-48" fill="none" stroke="#5f8f3c" stroke-width="3.5" stroke-linecap="round"/>'
    + '<rect x="12" y="10" width="7" height="16" rx="3.5" fill="#8a5a2e" stroke="#4a2e14" stroke-width="2.4" transform="rotate(-12 15 18)"/>'
    + '<rect x="28.5" y="7" width="7" height="17" rx="3.5" fill="#8a5a2e" stroke="#4a2e14" stroke-width="2.4"/>'
    + '<rect x="45" y="10" width="7" height="16" rx="3.5" fill="#8a5a2e" stroke="#4a2e14" stroke-width="2.4" transform="rotate(12 48 18)"/>'
    + '<path d="M17 44c10 4 20 4 30 0" fill="none" stroke="#c9a24a" stroke-width="5" stroke-linecap="round"/>'),
  sel: svg('<path d="M6 50c4-10 14-14 26-14s22 4 26 14z" fill="#f6f1ec" stroke="#8a7a6a" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M18 38l6-12 8 6-4 10zM30 30l8-14 9 9-6 10zM40 40l6-9 7 7-4 6z" fill="#ffffff" stroke="#8a7a6a" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<path d="M38 18l6 6" stroke="#f4c6d0" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path d="M10 50h44" stroke="#d8cfc4" stroke-width="2.4"/>'),
  fruits: svg('<path d="M24 8c2 6 6 9 8 12 2-3 6-6 8-12-4 1-6 3-8 6-2-3-4-5-8-6z" fill="#5ab04a" stroke="#2e6a24" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<ellipse cx="32" cy="40" rx="15" ry="19" fill="#f2b23c" stroke="#8a5a14" stroke-width="3"/>'
    + '<path d="M21 30l22 20M21 42l16 14M27 23l18 17M43 30L21 50M43 42L29 55M37 23L19 40" stroke="#c8822a" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M24 31c1-4 3-6 6-7" fill="none" stroke="#ffe39a" stroke-width="3" stroke-linecap="round"/>'),
  obsidienne: svg('<path d="M22 6l24 10 10 22-14 20-24-4L8 34z" fill="#2c2a34" stroke="#0e0d12" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M22 6l6 22 28 10M28 28L18 54M28 28L8 34" fill="none" stroke="#0e0d12" stroke-width="2.2" stroke-linejoin="round"/>'
    + '<path d="M22 6l24 10 10 22-28-10z" fill="#4a4258"/><path d="M8 34l20-6-10 26z" fill="#1c1a22"/>'
    + '<path d="M26 12l14 6M32 22l12 10" stroke="#b9a6e8" stroke-width="2.6" stroke-linecap="round"/>')
};

// Les icônes de l'interface dessinées par la bibliothèque (design/bibliotheque/svg/interface, interface.json) : des
// fichiers, lus à la demande (32 × 32, au trait de la troupe). Elles remplacent les dessins ci-dessus, qui restent pour
// le cas où un fichier manquerait. On les désigne par leur nom (« ui:coffre », « ui:zoom_plus »…) ; les noms d'avant
// mènent à la leur (ALIASES).
const LIBRARY = Object.fromEntries(Object.entries(import.meta.glob('/design/bibliotheque/svg/interface/*_icone.svg', { query: '?url', import: 'default', eager: true }))
  .map(([path, url]) => [path.split('/').pop().replace(/_icone\.svg$/, ''), url]));
const ALIASES = {
  stone: 'pierre', wood: 'bois', water: 'eau', food: 'nourriture', fish: 'poisson', coin: 'ecu', book: 'chapitre', map: 'carte',
  spark: 'etincelle', lock: 'verrou', unknown: 'inconnu', sprout: 'pousse', basket: 'ramasser', tools: 'outils', flower: 'fleur',
  smile: 'humeur_joie', calm: 'humeur_calme', frown: 'humeur_bouderie'
};
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
// Le fichier de la bibliothèque pour ce nom (ou son ancien nom), ou null
export function libraryIcon(name) {
  const key = own(ALIASES, name) ? ALIASES[name] : name;
  return own(LIBRARY, key) ? LIBRARY[key] : null;
}

// Adresse d'une icône : son fichier dans la bibliothèque, sinon son dessin ci-dessus (data: URL), calculée une fois ;
// null si l'icône n'existe pas. Taille explicite pour un dessin d'ici : un canvas dessinerait sinon le SVG en
// 300 × 150, déformé (en HTML, le CSS la ramène à la taille du texte ; le Livre agrandit aussi ceux de la bibliothèque)
const urls = new Map();
export function iconSrc(name) {
  if (typeof name !== 'string') return null;
  const file = libraryIcon(name);
  if (file) return file;
  if (!own(ICONS, name)) return null;
  if (!urls.has(name)) urls.set(name, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ICONS[name].replace('<svg', '<svg width="256" height="256"'))}`);
  return urls.get(name);
}
