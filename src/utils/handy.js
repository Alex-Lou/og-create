import { reactive } from 'vue';

// « Sous la main » : éléments épinglés et derniers éléments posés dans l'Athanor.
// Simple confort d'affichage, mémorisé sur cet appareil (aucune donnée de jeu ici).
const KEY = 'oc-handy';
export const RECENT_MAX = 8;
export const PIN_MAX = 12;

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || {};
    return {
      pins: Array.isArray(saved.pins) ? saved.pins.filter(n => typeof n === 'string').slice(0, PIN_MAX) : [],
      recent: Array.isArray(saved.recent) ? saved.recent.filter(n => typeof n === 'string').slice(0, RECENT_MAX) : []
    };
  } catch {
    return { pins: [], recent: [] };
  }
}

export const handy = reactive(read());

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ pins: handy.pins, recent: handy.recent }));
  } catch {
    // Stockage indisponible (navigation privée…) : la liste reste valable pour la session
  }
}

export function isPinned(name) {
  return handy.pins.includes(name);
}

// Renvoie false si la limite d'épingles est atteinte
export function togglePin(name) {
  if (isPinned(name)) handy.pins = handy.pins.filter(n => n !== name);
  else if (handy.pins.length >= PIN_MAX) return false;
  else handy.pins = [...handy.pins, name];
  save();
  return true;
}

// Un élément déjà dans la liste garde sa place : la rangée ne bouge pas sous le doigt
export function markUsed(name) {
  if (handy.recent.includes(name)) return;
  handy.recent = [name, ...handy.recent].slice(0, RECENT_MAX);
  save();
}
