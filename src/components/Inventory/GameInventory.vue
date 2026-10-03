<template>
  <div class="registry">
    <div class="registry__tools">
      <label class="registry__search">
        <span class="oc-sr-only">Chercher dans le registre</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg>
        <input
          ref="search"
          v-model="query"
          type="search"
          :placeholder="`Chercher parmi ${discoveredElements.length} entrées…`"
          autocomplete="off"
          enterkeyhint="go"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc="query = ''"
        />
      </label>
      <!-- Outils de l'Infini : fiches, entrées à compléter, piste payante -->
      <div v-if="!isTimerMode" class="registry__aids" role="group" aria-label="Aides">
        <button type="button" :aria-pressed="inspecting" title="Toucher une planche ouvre sa fiche" @click="inspecting = !inspecting">Fiches</button>
        <button type="button" :aria-pressed="unfinishedOnly" title="Entrées qui donnent encore des éléments inconnus" @click="unfinishedOnly = !unfinishedOnly">À compléter</button>
        <button type="button" class="registry__clue" @click="$emit('hint')">Une piste <i>{{ hintPrice }} écus</i></button>
      </div>
      <div v-if="!isTimerMode" class="registry__sort" role="group" aria-label="Classer le registre">
        <span class="g-mono">Classer</span>
        <button v-for="s in sorts" :key="s.key" type="button" :aria-pressed="sort === s.key" @click="setSort(s.key)">{{ s.label }}</button>
      </div>
      <p v-if="!isTimerMode && reachable !== null" class="registry__reach" aria-live="polite">{{ reachText }}</p>
      <div v-if="families.length > 1" class="registry__index" role="group" aria-label="Familles">
        <button type="button" class="registry__fold" @click="toggleAll">{{ allCollapsed ? 'Tout déplier' : 'Tout plier' }}</button>
        <button type="button" :aria-pressed="!family" @click="family = null">Tout le registre</button>
        <button
          v-for="f in families"
          :key="f.key"
          type="button"
          :aria-pressed="family === f.key"
          @click="family = family === f.key ? null : f.key"
        >
          <i>{{ f.num }}</i>{{ f.label }}
        </button>
      </div>
    </div>

    <!-- Sous la main : épinglés d'abord, puis les derniers éléments posés -->
    <section v-if="handyElements.length" class="family family--handy" aria-label="Sous la main">
      <div class="family__head family__head--static">
        <span class="family__num">✦</span>
        <h2 class="family__title">Sous la main</h2>
        <span class="family__dots" aria-hidden="true"></span>
      </div>
      <div class="plates plates--row">
        <button
          v-for="element in handyElements"
          :key="element"
          type="button"
          :class="['plate', 'g-bevel', { 'plate--inspect': inspecting }]"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @click="select($event, element)"
          @contextmenu.prevent="$emit('inspect', element)"
        >
          <span v-if="pinned.has(element)" class="plate__no plate__pin" aria-label="épinglé">★</span>
          <span class="plate__ink g-ink" aria-hidden="true"><ElementGlyph :glyph="getElementEmoji(element)" /></span>
          <span class="plate__name">{{ element }}</span>
        </button>
      </div>
    </section>

    <p v-if="query.trim() && family" class="registry__scope g-mono">
      dans : {{ familyLabel }}
      <button type="button" aria-label="Chercher dans tout le registre" @click="family = null">✕</button>
    </p>

    <section v-for="group in visibleGroups" :key="group.key" class="family">
      <div v-if="group.flat" class="family__head family__head--static">
        <span class="family__num">{{ group.num }}</span>
        <h2 class="family__title">{{ group.label }}</h2>
        <span class="family__dots" aria-hidden="true"></span>
        <span class="family__count">{{ group.found }}</span>
      </div>
      <button v-else type="button" class="family__head" :aria-expanded="isOpen(group.key)" @click="toggle(group.key)">
        <span class="family__num">{{ group.num }}</span>
        <h2 class="family__title">{{ group.label }}</h2>
        <span class="family__dots" aria-hidden="true"></span>
        <span :class="['family__count', { 'is-full': group.found === group.total }]">{{ pad(group.found) }} / {{ pad(group.total) }}</span>
      </button>
      <div v-show="group.flat || isOpen(group.key)" class="plates">
        <button
          v-for="element in group.elements"
          :key="element"
          type="button"
          :class="['plate', 'g-bevel', { 'plate--fresh': element === freshElement, 'plate--inspect': inspecting }]"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @click="select($event, element)"
          @contextmenu.prevent="!isTimerMode && $emit('inspect', element)"
        >
          <span class="plate__no">Pl. {{ pad(entryNumber[element]) }}</span>
          <span :class="['plate__ink', element === freshElement ? 'g-ink--glow' : 'g-ink']" aria-hidden="true"><ElementGlyph :glyph="getElementEmoji(element)" /></span>
          <span class="plate__name">{{ element }}</span>
        </button>
      </div>
    </section>

    <p v-if="!visibleGroups.length" class="g-italic registry__empty">
      {{ query ? `Aucune entrée ne répond à « ${query} ».` : unfinishedOnly ? 'Tout ce que tu possèdes a livré ses secrets.' : 'Le registre est encore vierge.' }}
      <button v-if="suggestion" type="button" class="registry__suggest" @click="query = suggestion">Vouliez-vous dire « {{ suggestion }} » ?</button>
    </p>
  </div>
</template>

<script>
import { BASE_CATEGORY } from '@/utils/gameConstants';
import { roman } from '@/utils/roman';
import { JOKER_PRICE } from '@/utils/hints';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { search, suggest } from '@/utils/search';
import { handy, markUsed } from '@/utils/handy';

// Familles pliées : simple confort d'affichage, mémorisé sur cet appareil
const COLLAPSED_KEY = 'oc-collapsed-families';
function readCollapsed() {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSED_KEY)) || {};
  } catch {
    return {};
  }
}
function saveCollapsed(value) {
  try {
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(value));
  } catch {
    // Stockage indisponible (navigation privée…) : le pliage reste valable pour la session
  }
}

// Classement du registre (Familles, Récentes découvertes, A-Z), mémorisé sur cet appareil
const SORT_KEY = 'oc-registry-sort';
const SORTS = [
  { key: 'families', label: 'Familles' },
  { key: 'recent', label: 'Récentes' },
  { key: 'alpha', label: 'A-Z' }
];
function readSort() {
  try {
    const value = localStorage.getItem(SORT_KEY);
    return SORTS.some(s => s.key === value) ? value : 'families';
  } catch {
    return 'families';
  }
}

// Saisie en cours ailleurs, ou fenêtre ouverte : les lettres tapées ne vont pas à la recherche
function typingElsewhere(event) {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || event.key === ' ') return true;
  if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return true;
  return Boolean(document.querySelector('[aria-modal="true"]'));
}

// Registre : éléments découverts, en planches groupées par famille (aucun état métier ici)
export default {
  name: 'GameInventory',
  components: { ElementGlyph },
  props: {
    categories: { type: Object, required: true },
    // Taille de chaque famille (les éléments inconnus ne sont pas envoyés au navigateur)
    familyTotals: { type: Object, default: () => ({}) },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isTimerMode: { type: Boolean, default: false },
    // Dernière découverte, mise en valeur
    freshElement: { type: String, default: null },
    // Nombre de recettes encore inexplorées par élément (filtre « À compléter »)
    unexplored: { type: Object, default: () => ({}) },
    // Nombre d'éléments inconnus créables tout de suite (null : inconnu ou hors Infini)
    reachable: { type: Number, default: null }
  },
  emits: ['selectResource', 'inspect', 'hint', 'fuse'],
  data() {
    return {
      query: '',
      family: null,
      collapsed: readCollapsed(),
      inspecting: false,
      unfinishedOnly: false,
      hintPrice: JOKER_PRICE,
      sort: readSort(),
      sorts: SORTS
    };
  },
  computed: {
    reachText() {
      if (this.reachable === 0) return 'Registre complet : plus rien à découvrir.';
      return this.reachable === 1
        ? '1 élément nouveau à portée de mélange'
        : `${this.reachable} éléments nouveaux à portée de mélange`;
    },
    // Numéro d'entrée au registre : l'ordre de découverte
    entryNumber() {
      return Object.fromEntries(this.discoveredElements.map((name, i) => [name, i + 1]));
    },
    groups() {
      // En Timer : l'inventaire de la question forme une seule famille
      if (this.isTimerMode) {
        return [this.group('Éléments du défi', this.discoveredElements, this.discoveredElements, 0)];
      }
      // Une famille s'affiche dès qu'un de ses éléments est découvert
      const discovered = new Set(this.discoveredElements);
      return Object.entries(this.categories)
        .map(([name, elements], i) => this.group(name, elements, elements.filter(e => discovered.has(e)), i))
        .filter(g => g.key === BASE_CATEGORY || g.found > 0);
    },
    allCollapsed() {
      return this.groups.length > 0 && this.groups.every(g => this.collapsed[g.key]);
    },
    families() {
      return this.groups.map(({ key, label, num }) => ({ key, label, num }));
    },
    familyLabel() {
      return this.families.find(f => f.key === this.family)?.label || '';
    },
    // Éléments retenus par la famille choisie et « À compléter », dans l'ordre des familles
    pool() {
      // « À compléter » est un outil de l'Infini : il ne filtre jamais l'inventaire d'une épreuve
      const unfinished = this.unfinishedOnly && !this.isTimerMode;
      return this.groups
        .filter(g => !this.family || g.key === this.family)
        .flatMap(g => g.elements)
        .filter(e => !unfinished || this.unexplored[e] > 0);
    },
    // Recherche : une seule liste, du plus pertinent au moins pertinent
    results() {
      return this.query.trim() ? search(this.pool, this.query) : [];
    },
    suggestion() {
      if (!this.query.trim() || this.results.length) return null;
      return suggest(this.pool, this.query);
    },
    visibleGroups() {
      if (this.query.trim()) {
        return this.results.length ? [this.flatGroup('Résultats', this.results)] : [];
      }
      if (this.sort === 'recent' && !this.isTimerMode) {
        const order = this.entryNumber;
        return [this.flatGroup('Récentes découvertes', [...this.pool].sort((a, b) => order[b] - order[a]))];
      }
      if (this.sort === 'alpha' && !this.isTimerMode) {
        return [this.flatGroup('De A à Z', [...this.pool].sort((a, b) => a.localeCompare(b, 'fr')))];
      }
      const kept = new Set(this.pool);
      return this.groups
        .filter(g => !this.family || g.key === this.family)
        .map(g => ({ ...g, elements: g.elements.filter(e => kept.has(e)) }))
        .filter(g => g.elements.length);
    },
    pinned() {
      return new Set(handy.pins);
    },
    // Hors épreuve et hors recherche : épinglés puis derniers posés, seulement s'ils sont découverts
    handyElements() {
      if (this.isTimerMode || this.query.trim()) return [];
      const discovered = new Set(this.discoveredElements);
      return [...new Set([...handy.pins, ...handy.recent])].filter(e => discovered.has(e));
    }
  },
  mounted() {
    // PC : taper une lettre n'importe où (hors saisie et hors fenêtre) l'envoie à la recherche
    this.onKey = event => {
      if (typingElsewhere(event) || !this.$el.offsetParent) return;
      this.$refs.search?.focus();
    };
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
  },
  watch: {
    // Un filtre qui n'existe plus (sortie du Timer…) est oublié
    families(list) {
      if (this.family && !list.some(f => f.key === this.family)) this.family = null;
    },
    // La nouvelle découverte défile en vue, en douceur. « nearest » ne tient pas compte des marges
    // (scroll-margin) : une planche cachée derrière le dock ou la consigne serait jugée visible.
    freshElement(name) {
      if (!name) return;
      this.$nextTick(() => {
        const el = this.$el.querySelector('.plate--fresh');
        if (!el?.scrollIntoView) return;
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const visibleBottom = window.innerHeight - parseFloat(style.scrollMarginBottom || 0);
        const visibleTop = parseFloat(style.scrollMarginTop || 0);
        if (box.bottom > visibleBottom) el.scrollIntoView({ block: 'end', behavior: 'smooth' });
        else if (box.top < visibleTop) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  },
  methods: {
    // Une recherche ou un filtre en cours affiche toujours les résultats, même dans une famille pliée
    isOpen(key) {
      return Boolean(this.query.trim()) || (this.unfinishedOnly && !this.isTimerMode) || !this.collapsed[key];
    },
    toggle(key) {
      this.collapsed = { ...this.collapsed, [key]: !this.collapsed[key] };
      saveCollapsed(this.collapsed);
    },
    toggleAll() {
      const collapse = !this.allCollapsed;
      this.collapsed = Object.fromEntries(this.groups.map(g => [g.key, collapse]));
      saveCollapsed(this.collapsed);
    },
    // Liste à plat (recherche, classement par date ou A-Z) : une seule section, sans pliage
    flatGroup(label, elements) {
      return { key: `flat:${label}`, num: '§', label, elements, found: elements.length, flat: true };
    },
    setSort(key) {
      this.sort = key;
      try {
        localStorage.setItem(SORT_KEY, key);
      } catch {
        // Stockage indisponible : le classement reste valable pour la session
      }
    },
    // Entrée dans la recherche : le premier résultat part dans l'Athanor ; recherche vide = fusionner
    onSearchEnter() {
      if (!this.query.trim()) {
        this.$emit('fuse');
        return;
      }
      const first = this.results[0];
      if (!first) return;
      const plate = this.$el.querySelector('.family:not(.family--handy) .plate');
      if (!this.isTimerMode) markUsed(first);
      this.$emit('selectResource', first, plate?.getBoundingClientRect() || null);
      this.query = '';
    },
    group(name, all, found, index) {
      return {
        key: name,
        num: roman(index + 1),
        label: name.replace(/_/g, ' '),
        elements: found,
        found: found.length,
        total: this.familyTotals[name] || all.length
      };
    },
    pad(n) {
      return String(n ?? 0).padStart(2, '0');
    },
    getElementEmoji(element) {
      return this.elementEmojis[element] || '❔';
    },
    startDrag(event, element) {
      if (!this.isTimerMode) markUsed(element);
      event.dataTransfer.setData('text/plain', element);
      event.dataTransfer.effectAllowed = 'copy';
    },
    select(event, element) {
      if (this.inspecting && !this.isTimerMode) {
        this.$emit('inspect', element);
        return;
      }
      if (!this.isTimerMode) markUsed(element);
      // Le rectangle de la planche sert à animer l'élément jusqu'à l'Athanor
      this.$emit('selectResource', element, event.currentTarget.getBoundingClientRect());
    }
  }
};
</script>

<style scoped>
.registry {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}

.registry__tools {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0 10px;
  background: linear-gradient(180deg, rgba(12, 10, 8, 0.96) 80%, rgba(12, 10, 8, 0));
}
.registry__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  border-bottom: 1px solid var(--oc-line-strong);
  color: var(--oc-text-faint);
  transition: border-color var(--oc-fast);
}
.registry__search:focus-within { border-color: var(--oc-accent-line); }
.registry__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-family: var(--oc-font-italic);
  font-style: italic;
  font-size: 17px;
  color: var(--oc-text-strong);
}
.registry__search input::placeholder { color: var(--oc-text-faint); }

.registry__aids { display: flex; flex-wrap: wrap; gap: 8px; }
.registry__aids button {
  appearance: none;
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1;
  color: var(--oc-text-muted);
  background: none;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  transition: color var(--oc-fast), box-shadow var(--oc-fast), background var(--oc-fast);
}
.registry__aids button:hover { color: var(--oc-text-strong); box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.registry__aids button[aria-pressed='true'] { color: var(--oc-gold); background: var(--oc-gold-soft); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
.registry__aids i { font-family: var(--oc-font-mono); font-style: normal; font-size: 9px; color: var(--oc-gold); }
.registry__clue { margin-left: auto; }
.registry__reach {
  margin: 0;
  font-family: var(--oc-font-italic);
  font-style: italic;
  font-size: 15px;
  color: var(--oc-text-faint);
}
.plate--inspect { cursor: help; }
.plate--inspect .plate__no { color: var(--oc-gold); }
.registry__index {
  display: flex;
  gap: 4px 18px;
  overflow-x: auto;
  scrollbar-width: none;
}
.registry__index::-webkit-scrollbar { display: none; }
.registry__index button {
  appearance: none;
  flex-shrink: 0;
  min-height: 36px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
  color: var(--oc-text-muted);
  white-space: nowrap;
}
.registry__index button i {
  font-family: var(--oc-font-mono);
  font-style: normal;
  font-size: 9px;
  color: var(--oc-text-faint);
}
.registry__index button[aria-pressed='true'] {
  color: var(--oc-text-strong);
  text-decoration: underline;
  text-decoration-color: var(--oc-gold);
  text-underline-offset: 6px;
}
.registry__index .registry__fold {
  font-family: var(--oc-font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--oc-text);
}

.family {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* Voile léger : lisible même pliée, le fond vivant reste visible autour */
  padding: 8px 12px;
  margin: 0 -12px;
  background: rgba(12, 10, 8, 0.55);
}
.family__head {
  appearance: none;
  width: 100%;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 12px;
  text-align: left;
  color: inherit;
}
.family__num { min-width: 24px; font-family: var(--oc-font-display); font-size: 15px; color: var(--oc-gold); }
.family__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 0.04em;
  color: var(--oc-text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.family__dots { flex: 1; min-width: 16px; border-bottom: 1px dotted var(--oc-line-strong); transform: translateY(-4px); }
.family__count { font-family: var(--oc-font-mono); font-size: 11px; color: var(--oc-text-muted); }
.family__count.is-full { color: var(--oc-gold); }
.family__head[aria-expanded='false'] .family__title { color: var(--oc-text-muted); }
.family__head:hover .family__title { color: var(--oc-gold-strong); }

.plates {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px;
}
.plate {
  appearance: none;
  position: relative;
  min-height: 104px;
  padding: 16px 6px 10px;
  border: 0;
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--oc-text);
  background: linear-gradient(180deg, rgba(233, 223, 200, 0.05), rgba(233, 223, 200, 0.015));
  box-shadow: inset 0 0 0 1px var(--oc-line);
  user-select: none;
  -webkit-user-select: none;
  transition: background var(--oc-fast), box-shadow var(--oc-fast), transform var(--oc-fast) var(--oc-ease-out);
}
.plate:hover { background: var(--oc-surface-hover); box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.plate:hover .plate__ink { animation: quiver 0.5s var(--oc-ease-spring); }
.plate:active { transform: scale(0.96); }
.plate__no {
  position: absolute;
  top: 6px;
  right: 10px;
  font-family: var(--oc-font-mono);
  font-size: 8px;
  letter-spacing: 0.06em;
  color: var(--oc-text-faint);
}
.plate__ink { font-size: 30px; line-height: 1; }
.plate__name { max-width: 100%; padding: 0 4px; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plate--fresh { box-shadow: inset 0 0 0 1px rgba(224, 182, 84, 0.75), var(--oc-shadow-accent); animation: fresh 1.6s var(--oc-ease-out); }
.plate--fresh .plate__no { color: var(--oc-gold); }

.registry__empty { margin: 24px 0; text-align: center; }
.registry__suggest {
  appearance: none;
  display: block;
  margin: 10px auto 0;
  min-height: 36px;
  padding: 0 14px;
  border: 0;
  cursor: pointer;
  font: inherit;
  color: var(--oc-gold);
  background: var(--oc-gold-soft);
  box-shadow: inset 0 0 0 1px var(--oc-accent-line);
}

.registry__sort { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.registry__sort .g-mono { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--oc-text-faint); }
.registry__sort button {
  appearance: none;
  min-height: 32px;
  padding: 0 10px;
  border: 0;
  cursor: pointer;
  font-size: 13px;
  color: var(--oc-text-muted);
  background: none;
  box-shadow: inset 0 0 0 1px var(--oc-line);
}
.registry__sort button[aria-pressed='true'] { color: var(--oc-gold); background: var(--oc-gold-soft); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }

.registry__scope { display: flex; align-items: center; gap: 8px; margin: -8px 0 0; font-size: 11px; color: var(--oc-text-muted); }
.registry__scope button {
  appearance: none;
  min-width: 32px;
  min-height: 32px;
  border: 0;
  cursor: pointer;
  color: var(--oc-text);
  background: none;
  box-shadow: inset 0 0 0 1px var(--oc-line);
}

.family__head--static { cursor: default; }
.family--handy { background: rgba(12, 10, 8, 0.72); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
/* Sous la main : une seule rangée qui défile de côté, jamais plus haute */
.plates--row { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: thin; padding-bottom: 4px; }
.plates--row .plate { flex: 0 0 96px; }
.plate__pin { color: var(--oc-gold); font-size: 11px; }

@keyframes quiver {
  35% { transform: rotate(-7deg) scale(1.1); }
  70% { transform: rotate(5deg) scale(1.04); }
}
@keyframes fresh {
  0% { transform: scale(0.88); }
  40% { transform: scale(1.05); }
  100% { transform: none; }
}

/* Mobile : planches compactes, 4 par ligne sur la plupart des téléphones */
@media (max-width: 859px) {
  .registry { gap: 14px; }
  .plates { grid-template-columns: repeat(auto-fill, minmax(74px, 1fr)); gap: 8px; }
  .plate { min-height: 82px; padding: 14px 2px 6px; gap: 5px; --oc-bevel: 8px; }
  /* Une nouvelle découverte défile au-dessus des panneaux fixés en bas (dock, consigne) */
  .plate { scroll-margin: 96px 0 calc(var(--oc-overlay, 120px) + 16px); }
  .plate__ink { font-size: 24px; }
  .plate__name { font-size: 12px; }
  .plates--row .plate { flex-basis: 74px; }
}
</style>
