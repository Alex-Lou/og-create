// App : le carnet de l'Infini (compte ou invité) : ce qu'il faut pour l'afficher, aucune recette.
// Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App, qui les lit dans son gabarit.

import playService from '@/services/playService';
import { writeCarnet } from '@/utils/carnet';
import { BASE_ELEMENTS, BASE_CATEGORY } from '@/utils/gameConstants';
import { sortFamilies } from '@/utils/eras';

// Retour sur l'application (PWA remise au premier plan) : carnet rechargé s'il date de plus de 30 s
const STATE_RELOAD_AFTER_MS = 30000;

export default {
  data() {
    return {
      // Éléments de base affichés tout de suite, avant la réponse du serveur
      elementEmojis: { Eau: 'svg:eau', Feu: 'svg:feu', Terre: 'svg:terre', Air: 'svg:air' },
      // Familles : éléments connus du joueur seulement ; leur taille vient du serveur (familyTotals)
      categories: { [BASE_CATEGORY]: [...BASE_ELEMENTS] },
      familyTotals: {},
      // Recettes encore inexplorées par élément du carnet (calculées par le serveur)
      unexploredCounts: {},
      discoveredElements: [...BASE_ELEMENTS],
      // Dernier chargement du carnet, et éléments appris pendant un chargement en cours
      stateLoadedAt: 0,
      learnedDuringLoad: null
    };
  },
  methods: {
    // ----- Carnet de l'Infini (compte ou invité) : ce qu'il faut pour l'afficher, aucune recette -----
    // Vrai si le serveur l'a rendu
    async loadPlayState() {
      // Un élément créé pendant le chargement peut manquer à la réponse : il est gardé
      const learned = new Map();
      this.learnedDuringLoad = learned;
      this.stateLoadedAt = Date.now();
      try {
        const state = await playService.state();
        this.applyPlayState({
          ...state,
          elements: [...new Set([...state.elements, ...learned.keys()])],
          known: { ...state.known, ...Object.fromEntries(learned) }
        });
        this.stateLoadedAt = Date.now();
        this.rememberCarnet();
        return true;
      } catch (error) {
        console.error('Erreur lors du chargement du carnet:', error);
        return false;
      } finally {
        if (this.learnedDuringLoad === learned) this.learnedDuringLoad = null;
      }
    },
    applyPlayState(state) {
      this.familyTotals = state.families || {};
      const categories = Object.fromEntries(Object.keys(this.familyTotals).map(family => [family, []]));
      this.applyKnown(state.known, categories);
      this.categories = sortFamilies(categories);
      this.unexploredCounts = state.unexplored || {};
      if (this.timerSnapshot) this.timerSnapshot = state.elements;
      else this.discoveredElements = state.elements;
    },
    // Copie du carnet sur l'appareil (compte seulement, hors Épreuve)
    rememberCarnet() {
      if (!this.isLoggedIn || !this.currentUser || this.timerSnapshot || this.isTimerActive) return;
      // Rien d'utile tant que le serveur n'a pas encore décrit les familles
      if (!Object.keys(this.familyTotals).length) return;
      const owned = new Set(this.discoveredElements);
      const known = {};
      Object.entries(this.categories).forEach(([family, names]) => names.forEach(name => {
        if (owned.has(name)) known[name] = { emoji: this.elementEmojis[name], family };
      }));
      writeCarnet(this.currentUser.userId, {
        elements: [...this.discoveredElements],
        known,
        families: this.familyTotals,
        unexplored: this.unexploredCounts
      });
    },
    // Application mise de côté : copie à jour ; de retour au premier plan : carnet rechargé (autre appareil)
    handleVisibility() {
      if (document.visibilityState === 'hidden') {
        this.rememberCarnet();
        return;
      }
      if (!this.isLoggedIn || this.timerSnapshot || this.isTimerActive) return;
      if (Date.now() - this.stateLoadedAt > STATE_RELOAD_AFTER_MS) this.loadPlayState();
    },
    // Emoji et famille d'éléments connus ({ nom: { emoji, family } })
    applyKnown(known, categories = this.categories) {
      const emojis = { ...this.elementEmojis };
      Object.entries(known || {}).forEach(([name, { emoji, family }]) => {
        emojis[name] = emoji;
        if (!family) return;
        if (!categories[family]) categories[family] = [];
        if (!categories[family].includes(name)) categories[family].push(name);
      });
      this.elementEmojis = emojis;
    },
    // Résultat d'un mélange réussi, renvoyé par le serveur
    learnElement({ result, emoji, family, unexplored, trial }) {
      this.applyKnown({ [result]: { emoji, family } });
      if (!this.isTimerActive) this.learnedDuringLoad?.set(result, { emoji, family });
      if (unexplored) this.unexploredCounts = unexplored;
      // Épreuve : verdict lu juste après, à la révélation (handleCraftSuccess)
      this.timerVerdict = trial || null;
    }
  }
};
