// Le Grimoire : l'étagère « Tes éléments » sous le livre. Recherche, filtres (par famille, fertiles, ou pour la page
// à portée ouverte), fiche d'un élément ouverte par un appui long.
// Mixin de BookView.vue : ses données et méthodes s'ajoutent à celles du Livre, qui les lit dans son gabarit.

import { chapterOfFamily } from '@/book/chapters';
import { search } from '@/utils/search';
import { familyIndex } from '@/utils/eras';
import { vibrate } from '@/utils/fx';

export default {
  data() {
    return {
      query: '',
      // Filtre de l'étagère : « auto » suit la page (familles de l'indice), sinon « all » ou une famille
      filter: 'auto',
      // Recherche et filtres, repliés par défaut sous la ligne « Tes éléments »
      showFilters: false,
      // Page à portée ouverte : familles de ses ingrédients et ingrédient révélé par l'Encre
      pageClue: null,
      // Fiche d'un élément ouverte par un appui long : { name, family, chapter, fertile, rect }
      info: null
    };
  },
  computed: {
    familyOf() {
      return familyIndex(this.categories);
    },
    pageHint() {
      return this.pageClue ? this.pageClue.revealed : null;
    },
    // Ingrédients proposés pour la page : le plateau du serveur (bons ingrédients et leurres), sinon ses familles
    pageList() {
      if (!this.pageClue) return [];
      if (this.pageClue.tray) {
        const owned = new Set(this.discoveredElements);
        return this.pageClue.tray.filter(name => owned.has(name));
      }
      const wanted = new Set(this.pageClue.families);
      return [...this.discoveredElements].reverse().filter(name => wanted.has(this.familyOf[name]));
    },
    activeFilter() {
      if (this.filter !== 'auto') return this.filter;
      return this.pageClue ? 'page' : 'all';
    },
    filters() {
      const owned = this.discoveredElements;
      const counts = {};
      owned.forEach(name => {
        const family = this.familyOf[name];
        if (family) counts[family] = (counts[family] || 0) + 1;
      });
      const pills = [];
      if (this.pageClue) pills.push({ id: 'page', label: '✦ Pour cette page', count: this.pageList.length });
      pills.push({ id: 'all', label: 'Tout', count: owned.length });
      const fertile = owned.filter(name => this.unexplored[name] > 0).length;
      if (fertile) pills.push({ id: 'fertile', glyph: 'ui:sprout', label: 'Fertiles', count: fertile });
      Object.keys(this.categories).forEach(family => {
        if (counts[family]) pills.push({ id: family, label: family === 'Elements Fondamentaux' ? 'Éléments premiers' : family, count: counts[family] });
      });
      return pills;
    },
    // Libellé du bouton des filtres : le filtre en cours
    activeLabel() {
      return this.filters.find(pill => pill.id === this.activeFilter)?.label || 'Tout';
    },
    shelf() {
      if (this.only) return this.discoveredElements.filter(name => this.only.includes(name));
      const newestFirst = [...this.discoveredElements].reverse();
      if (this.query.trim()) return search(newestFirst, this.query);
      const active = this.activeFilter;
      if (active === 'all') return newestFirst;
      // Les plus prometteurs d'abord : ceux qui entrent dans le plus de mélanges inexplorés
      if (active === 'fertile') {
        return newestFirst.filter(name => this.unexplored[name] > 0).sort((a, b) => this.unexplored[b] - this.unexplored[a]);
      }
      if (active === 'page' && this.pageClue) {
        const list = this.pageList;
        // L'ingrédient révélé (encre ou offert) passe en tête
        const hint = this.pageClue.revealed;
        return hint && list.includes(hint) ? [hint, ...list.filter(n => n !== hint)] : list;
      }
      return newestFirst.filter(name => this.familyOf[name] === active);
    }
  },
  methods: {
    // Choisir un filtre efface la recherche et replie le panneau
    pickFilter(id) {
      this.filter = id;
      this.query = '';
      this.showFilters = false;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    // Appui long sur une tuile : la fiche de l'élément (le toucher, lui, l'envoie dans l'Athanor)
    openInfo(name, event) {
      const family = this.familyOf[name] || '';
      const tile = event.target && event.target.closest ? event.target.closest('.tile') : null;
      this.info = { name, family: family.replace(/_/g, ' '), chapter: chapterOfFamily(family), fertile: this.unexplored[name] || 0, rect: tile ? tile.getBoundingClientRect() : null };
      vibrate(10);
    },
    selectInfo() {
      const { name, rect } = this.info;
      this.info = null;
      this.$emit('select', name, rect);
    }
  }
};
