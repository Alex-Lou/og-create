// Qui parle, dans une bulle (choix de l'auteur, 11 oct.) : chacun sa couleur (le bord, son nom, une nuance du fond) et
// un petit motif dans le coin de sa bulle ; et trois familles. Un ami connu parle avec sa couleur, son portrait à
// gauche. Un inconnu (pas encore présenté) parle en gris, en silhouette, sous le nom « ??? ». Un hostile parle dans
// une bulle sombre, au bord irrégulier, son portrait à droite, face au joueur. Les bulles de l'île (BrumeGuide) et
// celles des scènes (PrologueScene) lisent la même table.

// Les motifs : un tracé dans un carré de 24
const MOTIFS = {
  brume: 'M5 15.5c-1.6 0-2.5-1.2-2.5-2.5s1.1-2.5 2.6-2.5c.4-2.6 2.6-4.5 5.2-4.5 2.2 0 4 1.3 4.8 3.2.4-.1.8-.2 1.3-.2 2.4 0 4.1 1.8 4.1 3.9 0 1.5-1.1 2.6-2.5 2.6z',
  rose: 'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z',
  cuillere: 'M16.2 2.6c2.4.2 3.8 2.3 3.1 4.6-.6 2-2.5 3.4-4.4 3.2L8.1 17.2a1.7 1.7 0 0 1-2.4-2.4l6.8-6.8c-.2-2 1.4-4 3.7-5.4z',
  engrenage: 'M11 2h2l.5 2.6 2.2.9 2.2-1.5 1.4 1.4-1.5 2.2.9 2.2L22 11v2l-2.6.5-.9 2.2 1.5 2.2-1.4 1.4-2.2-1.5-2.2.9L13 22h-2l-.5-2.6-2.2-.9-2.2 1.5-1.4-1.4 1.5-2.2-.9-2.2L2 13v-2l2.6-.5.9-2.2L4 6.1l1.4-1.4 2.2 1.5 2.2-.9zm1 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
  goutte: 'M12 2.5c3 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.8 6-11z',
  feuille: 'M4.5 19.5C4.5 11 10.5 5 20 4c-1 9.5-7 15.5-15.5 15.5zm0 0L12 12',
  galet: 'M3.5 14c0-4 4-7.2 9-7.2s8 3 8 6.2-3.2 6.2-8.5 6.2-8.5-1.2-8.5-5.2z',
  fleur: 'M12 8.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8zM12 2a3 3 0 0 1 0 6 3 3 0 0 1 0-6zm0 14a3 3 0 0 1 0 6 3 3 0 0 1 0-6zM2 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0zm14 0a3 3 0 0 1 6 0 3 3 0 0 1-6 0z',
  epines: 'M12 2l2 6 6-2-3 6 5 3-6 1 1 6-5-4-5 4 1-6-6-1 5-3-3-6 6 2z'
};

// Chaque personnage : sa couleur (bord, nom, motif) et la nuance de son fond, prises de son dessin
export const SPEAKERS = {
  Brume: { color: '#3E9BC4', tint: '#EEF6FB', motif: MOTIFS.brume },
  Lorena: { color: '#B8862B', tint: '#FBF3E2', motif: MOTIFS.rose },
  Agathe: { color: '#C0642A', tint: '#FBEDE3', motif: MOTIFS.cuillere },
  Jovin: { color: '#2F7F7A', tint: '#E7F3F1', motif: MOTIFS.engrenage },
  Pierrot: { color: '#3F6FB5', tint: '#EAF0FA', motif: MOTIFS.goutte },
  Freya: { color: '#4F8A3A', tint: '#EDF5E8', motif: MOTIFS.feuille },
  Saturnin: { color: '#6B6F78', tint: '#F0F1F3', motif: MOTIFS.galet },
  Flore: { color: '#A0559A', tint: '#F7ECF6', motif: MOTIFS.fleur }
};
// Un inconnu, un hostile
const STRANGER = { color: '#7A7671', tint: '#ECEAE7', motif: null };
const HOSTILE = { color: '#B07CD8', tint: '#2A2233', motif: MOTIFS.epines };

// Qui parle : { family ('ami', 'inconnu', 'hostile'), name (ce que la bulle affiche), color, tint, motif (un tracé, ou
// null) }. who : le nom affiché (« Lorena », « Brume »…) ; stranger : pas encore présenté ; hostile : il veut du mal.
// Un nom hors de la table (le haut-parleur du paquebot) parle sans couleur ni motif
export function speakerOf(who, { stranger = false, hostile = false } = {}) {
  if (hostile) return { family: 'hostile', name: who || '???', ...HOSTILE };
  if (stranger) return { family: 'inconnu', name: '???', ...STRANGER };
  const known = SPEAKERS[who];
  return { family: 'ami', name: who, ...(known || { color: null, tint: null, motif: null }) };
}

// Le Grimoire quand il parle (sa réplique du Vent, texts/tutorial/scenes.js) : sa couverture en petit, dans la bulle
export const BOOK_FACE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="10" y="5" width="28" height="38" rx="3" fill="#6B2228" stroke="#2A0E0E" stroke-width="2"/><rect x="13" y="8" width="22" height="32" rx="2" fill="none" stroke="#D6AA5A" stroke-width="1.2"/><circle cx="24" cy="24" r="7" fill="none" stroke="#D6AA5A" stroke-width="1.2"/><circle cx="24" cy="24" r="2.6" fill="#C2475A" stroke="#7A5A1E"/></svg>')}`;
