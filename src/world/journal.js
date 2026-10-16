// Le journal de l'île (choix de l'auteur, 16 oct. : un onglet du Carnet, tenu par Brume, les sept derniers jours) :
// ce que la troupe a vécu chaque jour de l'île. Rien n'est gardé : tout se déduit de la troupe, de son agenda
// (village/agenda.js : rituels, repas, visites) et du ciel de chaque heure (sky.js), comme l'île elle-même ; un jour
// passé se réécrit à l'identique, sur tous les appareils. Aujourd'hui s'écrit au fil des heures.
import { visitOf } from './village/agenda';
import { hash } from './village/beast';
import { MEETINGS } from '@/texts/village';
import { JOURNAL } from '@/texts/world/journal';

export const JOURNAL_DAYS = 7;
// Au plus tant de lignes par jour, et tant de visites parmi elles
const MAX_LINES = 4;
const MAX_VISITS = 2;
// Les maîtresses de la troupe (l'accord d'une visite : « passée »)
const ELLES = new Set(['ponton', 'foyer', 'bosquet', 'potager']);

// Ce qui se dit d'un temps : pluie, orage, brume (ciel couvert ou brume du matin), clair
const rainy = w => w.rain > 0.5;
const stormy = w => w.storm > 0.5;
const hazy = w => w.mist > 0.4 || w.cover > 0.6;

// Les lignes d'un jour (day) jusqu'à l'heure upto (24 : le jour entier). masters : la troupe éveillée ({ role, k,
// name } : les maîtres du village, leur rang k comme dans le village) ; skyOf(day, h) : le ciel de l'île ({ rise, set,
// weather }). Les rendez-vous de la journée, dans l'ordre des heures ; au plus MAX_LINES, l'aube, les visites et le
// repas d'abord
export function dayLines(masters, day, upto, skyOf) {
  const has = role => masters.some(m => m.role === role);
  const sun = skyOf(day, 12);
  const moments = [];
  const add = (at, rank, text) => { if (at <= upto) moments.push({ at, rank, text }); };
  if (has('ponton')) {
    const w = skyOf(day, sun.rise).weather;
    add(sun.rise + 0.5, 0, JOURNAL.aube[rainy(w) ? 'pluie' : hazy(w) ? 'brume' : 'clair']);
  }
  if (has('carriere')) add(6.5, 3 + hash(day, 1), JOURNAL.carriere);
  if (has('puits')) add(9, 3 + hash(day, 2), JOURNAL.eau);
  if (has('foyer') && masters.length > 1) {
    const w = skyOf(day, 12.5).weather;
    add(12.9, 2, JOURNAL.repas[stormy(w) ? 'orage' : rainy(w) ? 'pluie' : 'clair']);
  }
  // (les visites du jour, celles qui ont une rencontre à rapporter : sa première bulle, dans un sens ou dans l'autre)
  const visits = masters.map(m => ({ m, v: visitOf(m, day, masters.filter(o => o !== m).map(o => o.role)) })).filter(({ v }) => v);
  for (const { m, v } of visits.sort((a, b) => a.v.from - b.v.from).slice(0, MAX_VISITS)) {
    const host = masters.find(o => o.role === v.who);
    const lines = MEETINGS[`${m.role}>${v.who}`] || MEETINGS[`${v.who}>${m.role}`];
    if (host && lines) add(v.to, 1, JOURNAL.visite(m.name, host.name, ELLES.has(m.role), lines[0]));
  }
  if (has('bosquet')) add(sun.set + 0.2, 3 + hash(day, 3), JOURNAL.oree[rainy(skyOf(day, sun.set).weather) ? 'pluie' : 'clair']);
  if (has('atelier')) add(23, 3 + hash(day, 4), JOURNAL.veille[stormy(skyOf(day, 22.5).weather) ? 'orage' : 'calme']);
  if (has('potager')) {
    const w = skyOf(day, 23).weather;
    add(23.7, 3 + hash(day, 5), JOURNAL.lune[rainy(w) || w.cover > 0.6 ? 'nuages' : 'claire']);
  }
  return moments.sort((a, b) => a.rank - b.rank).slice(0, MAX_LINES).sort((a, b) => a.at - b.at).map(m => m.text);
}

// Le journal : les JOURNAL_DAYS derniers jours de l'île, le plus récent d'abord : [{ day, title, lines }]. today et
// hour : le jour et l'heure de l'île ; un jour sans rien de notable a sa ligne tranquille, aujourd'hui sa première
export function journalOf({ masters, today, hour, skyOf, days = JOURNAL_DAYS }) {
  if (!masters.length) return [];
  return Array.from({ length: days }, (_, n) => {
    const day = today - n;
    const lines = dayLines(masters, day, n ? 24 : hour, skyOf);
    return { day, title: JOURNAL.jour(n), lines: lines.length ? lines : [n ? JOURNAL.calme : JOURNAL.debut] };
  });
}
