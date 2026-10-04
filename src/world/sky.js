// Ciel de l'île : lever et coucher du soleil selon la date, météo du jour, et la lumière qui en découle minute par
// minute (teinte de toute la scène, couleurs de la mer, ton des nuages, force des lumières, position du soleil).
// Tout se déduit de la date : pas d'état, même ciel pour une même date et une même heure.

// Latitude de la France : levers et couchers proches de ceux du joueur (le jeu est en français)
const LAT = 46.5;
const DAY_MS = 86400000;
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = k => k * k * (3 - 2 * k);
const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* ---------- Couleurs ---------- */
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const hex = c => `#${c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')}`;
export const mix = (a, b, k) => {
  const [x, y] = [rgb(a), rgb(b)];
  return hex(x.map((v, i) => v + (y[i] - v) * k));
};
// Même couleur, désaturée et assombrie (ciel couvert)
const grey = (color, dark) => {
  const c = rgb(color);
  const l = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) * dark;
  return hex(c.map(v => v * 0.25 + l * 0.75));
};
const luma = color => {
  const c = rgb(color);
  return (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255;
};

/* ---------- Soleil ---------- */
// Lever, coucher et midi solaire (heures locales décimales) d'une date ; heure d'été du navigateur prise en compte
export function sunTimes(date) {
  const n = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / DAY_MS);
  const decl = (23.44 * Math.sin((2 * Math.PI * (284 + n)) / 365) * Math.PI) / 180;
  const half = (Math.acos(clamp(-Math.tan((LAT * Math.PI) / 180) * Math.tan(decl), -1, 1)) * 180) / Math.PI / 15;
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  const noon = 12.8 + (date.getTimezoneOffset() < Math.max(jan, jul) ? 1 : 0);
  return { rise: noon - half, set: noon + half, noon };
}

/* ---------- Météo de l'île ---------- */
// Temps possibles : couverture nuageuse, pluie, orage, brume (la brume ne tient que le matin)
export const WEATHERS = {
  clair: { label: 'Ciel clair', cover: 0, rain: 0, storm: 0, mist: 0 },
  voile: { label: 'Ciel voilé', cover: 0.72, rain: 0, storm: 0, mist: 0 },
  brume: { label: 'Brume', cover: 0.35, rain: 0, storm: 0, mist: 1 },
  pluie: { label: 'Pluie', cover: 0.92, rain: 1, storm: 0, mist: 0.25 },
  orage: { label: 'Orage', cover: 1, rain: 1, storm: 1, mist: 0 }
};
// Temps de fond d'un jour (fréquences), puis ses voisins quand il tourne
const ODDS = [['clair', 0.42], ['voile', 0.26], ['brume', 0.14], ['pluie', 0.13], ['orage', 0.05]];
const TURNS = { clair: 'voile', voile: 'pluie', brume: 'clair', pluie: 'voile', orage: 'pluie' };
const SLOT_H = 6;
const BLEND_H = 0.7;
const dayIndex = date => Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - new Date(2026, 0, 1)) / DAY_MS);
function baseOf(day) {
  let r = hash(day, 3);
  for (const [kind, p] of ODDS) {
    if (r < p) return kind;
    r -= p;
  }
  return 'clair';
}
// Temps d'un créneau de 6 h : le temps du jour, ou il tourne (un créneau sur trois environ)
function slotKind(day, slot) {
  const base = baseOf(day);
  return hash(day, 11 + slot) < 0.68 ? base : TURNS[base];
}
// Météo à une date : temps du créneau, valeurs continues (transitions de 40 min), arc-en-ciel juste après une pluie
export function weatherAt(date, forced = null) {
  const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const { rise } = sunTimes(date);
  const day = dayIndex(date);
  const slot = Math.floor(hour / SLOT_H);
  const kind = forced || slotKind(day, slot);
  const into = hour - slot * SLOT_H;
  // Mélange avec le créneau voisin près des bords
  let other = kind;
  let k = 0;
  if (!forced && into > SLOT_H - BLEND_H / 2) {
    other = slot === 3 ? slotKind(day + 1, 0) : slotKind(day, slot + 1);
    k = smooth((into - (SLOT_H - BLEND_H / 2)) / BLEND_H);
  } else if (!forced && into < BLEND_H / 2) {
    other = slot === 0 ? slotKind(day - 1, 3) : slotKind(day, slot - 1);
    k = smooth((BLEND_H / 2 - into) / BLEND_H);
  }
  const a = WEATHERS[kind];
  const b = WEATHERS[other];
  const at = key => a[key] + (b[key] - a[key]) * k;
  // La brume se lève dans la matinée ; un peu de brume à l'aube les jours couverts
  const morning = clamp(1 - Math.abs(hour - (rise + 0.8)) / 2.6);
  const mist = at('mist') * morning;
  // Arc-en-ciel : dans l'heure qui suit la fin d'une pluie, de jour
  const rainbow = !forced && slot > 0 && WEATHERS[slotKind(day, slot - 1)].rain && !a.rain ? clamp(1 - Math.abs(into - 0.9) / 0.6) : 0;
  return { kind, label: a.label, cover: at('cover'), rain: at('rain'), storm: at('storm'), mist, rainbow };
}

/* ---------- Lumière du jour ---------- */
// Étapes de la journée, placées par rapport au lever (R) et au coucher (S) du soleil : teinte de la scène
// (multipliée), haut et bas de la mer, nuit (étoiles, lucioles), chaleur (reflets roses)
const NIGHT = { tint: '#5A68A6', sea: ['#1D3557', '#13263F'], night: 1, warm: 0 };
const KEYS = [
  { id: 'night', at: (R) => R - 2, ...NIGHT },
  { id: 'dawn', at: (R) => R - 0.8, tint: '#6E7CB6', sea: ['#2E4A78', '#1B3354'], night: 0.8, warm: 0.1 },
  { id: 'dawn', at: (R) => R - 0.2, tint: '#D0A9B4', sea: ['#9FA8CC', '#4C6E96'], night: 0.3, warm: 0.6 },
  { id: 'morning', at: (R) => R + 0.45, tint: '#FFDCA6', sea: ['#F2CFA0', '#4F8FBF'], night: 0, warm: 1 },
  { id: 'morning', at: (R) => R + 2.2, tint: '#FFF5E4', sea: ['#7CC4E6', '#3E8DBF'], night: 0, warm: 0.15 },
  { id: 'noon', at: (R, S) => (R + S) / 2, tint: '#FFFFFF', sea: ['#6CC0E6', '#3E8DBF'], night: 0, warm: 0 },
  { id: 'afternoon', at: (R, S) => S - 3, tint: '#FFF7EA', sea: ['#72C2E4', '#3E8BBC'], night: 0, warm: 0.1 },
  { id: 'afternoon', at: (R, S) => S - 1.2, tint: '#FFE3B2', sea: ['#90C6DE', '#3E86B8'], night: 0, warm: 0.5 },
  { id: 'sunset', at: (R, S) => S - 0.15, tint: '#FFBA88', sea: ['#F2AA82', '#3C6F9E'], night: 0.05, warm: 1 },
  { id: 'dusk', at: (R, S) => S + 0.4, tint: '#EEA4C0', sea: ['#C88AB0', '#2F5684'], night: 0.3, warm: 0.8 },
  { id: 'dusk', at: (R, S) => S + 0.95, tint: '#8C80C4', sea: ['#4A4E8E', '#22355C'], night: 0.7, warm: 0.3 },
  { id: 'night', at: (R, S) => S + 1.6, ...NIGHT }
];
export const MOMENTS = {
  night: 'Nuit', dawn: 'Aube', morning: 'Matin', noon: 'Midi', afternoon: 'Après-midi', sunset: 'Couchant', dusk: 'Crépuscule'
};

// Ciel complet à une date : { hour, rise, set, id, label, night, warm, lit, tint, sea, cloud, sun, weather }
// forced : { weather } pour imposer un temps (essais)
export function skyAt(date, forced = {}) {
  const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const { rise, set } = sunTimes(date);
  const weather = weatherAt(date, forced.weather);
  const times = KEYS.map(key => key.at(rise, set));
  // Étape courante et suivante (la nuit relie le dernier soir au premier matin)
  let i = times.findIndex((h, k) => k < KEYS.length - 1 && hour >= h && hour < times[k + 1]);
  let k = 0;
  let a = NIGHT;
  let b = NIGHT;
  let id = 'night';
  if (i >= 0) {
    a = KEYS[i];
    b = KEYS[i + 1];
    k = smooth((hour - times[i]) / (times[i + 1] - times[i]));
    id = k < 0.5 ? a.id : b.id;
  }
  const lerp = key => a[key] + (b[key] - a[key]) * k;
  // Ciel couvert : la lumière grisaille et baisse ; la pluie et l'orage l'assombrissent encore
  const dim = 1 - weather.rain * 0.16 - weather.storm * 0.14;
  let tint = mix(a.tint, b.tint, k);
  tint = mix(tint, grey(tint, 0.93 * dim), weather.cover * 0.8);
  const sea = [0, 1].map(j => {
    const clear = mix(a.sea[j], b.sea[j], k);
    return mix(clear, grey(clear, 0.95 * dim), weather.cover * 0.7);
  });
  const night = lerp('night');
  const warm = lerp('warm') * (1 - weather.cover * 0.75);
  // Nuages : blancs, dorés ou roses avec la chaleur du ciel, gris sous la pluie, bleutés la nuit
  const cloud = mix(mix(mix('#FFFFFF', '#FFC7A0', warm * 0.7), '#8E9AC0', night), '#9BA3AE', weather.rain * 0.7 * (1 - night));
  // Lumières : elles s'allument quand la scène s'assombrit (soir, nuit, gros temps)
  const lit = clamp((0.9 - luma(tint)) / 0.42);
  // Soleil : de 0 (lever) à 1 (coucher), hauteur 0 à 1 ; la lune la nuit
  const progress = clamp((hour - rise) / (set - rise));
  const up = hour > rise && hour < set ? Math.sin(progress * Math.PI) : 0;
  return { hour, rise, set, id, label: MOMENTS[id], night, warm, lit, tint, sea, cloud, sun: { progress, up }, weather };
}

// Heure affichée « 07:42 »
export const clockText = date => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
