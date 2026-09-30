<template>
  <div class="inventory">
    <div class="inventory__tools">
      <label class="search">
        <span class="oc-sr-only">Rechercher un élément</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
        <input v-model="query" type="search" :placeholder="`Rechercher parmi ${discoveredElements.length} éléments…`" autocomplete="off" />
      </label>
      <div v-if="families.length > 1" class="chips" role="group" aria-label="Filtrer par famille">
        <button type="button" class="chip chip--tool" :aria-label="allCollapsed ? 'Tout déplier' : 'Tout plier'" @click="toggleAll">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path v-if="allCollapsed" d="M7 10l5 5 5-5"></path><path v-else d="M7 14l5-5 5 5"></path></svg>
          {{ allCollapsed ? 'Déplier' : 'Plier' }}
        </button>
        <button type="button" :class="['chip', { 'chip--on': !family }]" :aria-pressed="!family" @click="family = null">Tout</button>
        <button
          v-for="f in families"
          :key="f.key"
          type="button"
          :class="['chip', { 'chip--on': family === f.key }]"
          :style="{ '--c': f.rgb }"
          :aria-pressed="family === f.key"
          @click="family = family === f.key ? null : f.key"
        >
          <span class="chip__dot" aria-hidden="true"></span>{{ f.label }}
        </button>
      </div>
    </div>

    <section v-for="group in visibleGroups" :key="group.key" class="family" :style="{ '--c': group.rgb }">
      <button
        type="button"
        class="family__head"
        :aria-expanded="isOpen(group.key)"
        @click="toggle(group.key)"
      >
        <svg class="family__chevron" :class="{ 'is-closed': !isOpen(group.key) }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"></path></svg>
        <h2 class="family__title">{{ group.label }}</h2>
        <span class="family__count">{{ group.found }} / {{ group.total }}</span>
        <span class="family__bar" aria-hidden="true"><span :style="{ width: group.progress + '%' }"></span></span>
      </button>
      <div v-show="isOpen(group.key)" class="grid">
        <button
          v-for="element in group.elements"
          :key="element"
          type="button"
          :class="['card', { 'card--fresh': element === freshElement }]"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @click="select($event, element)"
        >
          <span class="card__emoji" aria-hidden="true">{{ getElementEmoji(element) }}</span>
          <span class="card__name">{{ element }}</span>
        </button>
      </div>
    </section>

    <p v-if="!visibleGroups.length" class="inventory__empty">
      {{ query ? `Aucun élément ne correspond à « ${query} ».` : 'Aucun élément pour l’instant.' }}
    </p>
  </div>
</template>

<script>
import { BASE_CATEGORY } from '@/utils/gameConstants';
import { familyColor } from '@/utils/eras';

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

function normalize(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Inventaire : éléments découverts, groupés par famille (aucun état métier ici)
export default {
  name: 'GameInventory',
  props: {
    categories: { type: Object, required: true },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isTimerMode: { type: Boolean, default: false },
    // Dernière découverte, mise en valeur
    freshElement: { type: String, default: null }
  },
  emits: ['selectResource'],
  data() {
    return { query: '', family: null, collapsed: readCollapsed() };
  },
  computed: {
    groups() {
      // En Timer : l'inventaire de la question forme une seule famille
      if (this.isTimerMode) {
        return [this.group('Éléments du défi', this.discoveredElements, this.discoveredElements)];
      }
      // Une famille s'affiche dès qu'un de ses éléments est découvert
      const discovered = new Set(this.discoveredElements);
      return Object.entries(this.categories)
        .map(([name, elements]) => this.group(name, elements, elements.filter(e => discovered.has(e))))
        .filter(g => g.key === BASE_CATEGORY || g.found > 0);
    },
    allCollapsed() {
      return this.groups.length > 0 && this.groups.every(g => this.collapsed[g.key]);
    },
    families() {
      return this.groups.map(({ key, label, rgb }) => ({ key, label, rgb }));
    },
    visibleGroups() {
      const q = normalize(this.query.trim());
      return this.groups
        .filter(g => !this.family || g.key === this.family)
        .map(g => ({ ...g, elements: q ? g.elements.filter(e => normalize(e).includes(q)) : g.elements }))
        .filter(g => g.elements.length);
    }
  },
  watch: {
    // Un filtre qui n'existe plus (sortie du Timer…) est oublié
    families(list) {
      if (this.family && !list.some(f => f.key === this.family)) this.family = null;
    },
    // La nouvelle découverte défile en vue, en douceur
    freshElement(name) {
      if (!name) return;
      this.$nextTick(() => {
        const el = this.$el.querySelector('.card--fresh');
        el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
      });
    }
  },
  methods: {
    // Une recherche en cours affiche toujours les résultats, même dans une famille pliée
    isOpen(key) {
      return Boolean(this.query.trim()) || !this.collapsed[key];
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
    group(name, all, found) {
      const color = familyColor(name);
      return {
        key: name,
        label: name.replace(/_/g, ' '),
        rgb: color.join(', '),
        elements: found,
        found: found.length,
        total: all.length,
        progress: all.length ? (found.length / all.length) * 100 : 0
      };
    },
    getElementEmoji(element) {
      return this.elementEmojis[element] || '❓';
    },
    startDrag(event, element) {
      event.dataTransfer.setData('text/plain', element);
      event.dataTransfer.effectAllowed = 'copy';
    },
    select(event, element) {
      // Le rectangle de la carte sert à animer l'élément jusqu'à la zone de création
      this.$emit('selectResource', element, event.currentTarget.getBoundingClientRect());
    }
  }
};
</script>

<style scoped>
.inventory {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.inventory__tools {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  background: linear-gradient(180deg, rgba(7, 6, 13, 0.94) 75%, rgba(7, 6, 13, 0));
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  background: var(--oc-panel);
  border: 1px solid var(--oc-line);
  color: var(--oc-text-faint);
  transition: border-color var(--oc-fast);
}
.search:focus-within { border-color: var(--oc-accent-line); }
.search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  background: transparent;
  color: var(--oc-text);
  font: inherit;
  font-size: 14px;
  outline: none;
}
.search input::placeholder { color: var(--oc-text-faint); }

.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }
.chip {
  --c: 196, 181, 253;
  appearance: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--oc-radius-pill);
  border: 1px solid var(--oc-line);
  background: var(--oc-panel);
  color: var(--oc-text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--oc-fast), color var(--oc-fast), border-color var(--oc-fast);
}
.chip__dot { width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--c)); }
.chip--on { background: var(--oc-text); color: #140f24; border-color: var(--oc-text); }
.chip--tool { color: var(--oc-text); }

.family {
  /* Voile léger derrière chaque famille : lisible même pliée, le fond vivant reste visible autour */
  padding: 10px 12px;
  margin: 0 -12px;
  border-radius: var(--oc-radius);
  background: rgba(7, 6, 13, 0.55);
}
.family__head {
  appearance: none;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 6px 10px;
  margin: 0;
  padding: 4px 0;
  border: 0;
  background: none;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.family__chevron { color: var(--oc-text-muted); transition: transform var(--oc-fast) var(--oc-ease-out); }
.family__chevron.is-closed { transform: rotate(-90deg); }
.family__head:hover .family__title { color: #fff; }
.family__head[aria-expanded='true'] { margin-bottom: 10px; }
.family__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--oc-text-strong);
}
.family__count { font-size: 12px; color: var(--oc-text-muted); font-variant-numeric: tabular-nums; }
.family__bar {
  grid-column: 2 / -1;
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
.family__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: rgb(var(--c));
  transition: width var(--oc-slow) var(--oc-ease-out);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 10px;
}

.card {
  appearance: none;
  position: relative;
  min-height: 84px;
  padding: 10px 4px 8px;
  border-radius: 18px;
  border: 1px solid rgba(var(--c), 0.16);
  /* Halo coloré de la famille derrière l'emoji */
  background: radial-gradient(90% 70% at 50% 30%, rgba(var(--c), 0.16), rgba(var(--c), 0) 70%), var(--oc-surface);
  color: var(--oc-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: transform var(--oc-fast) var(--oc-ease-out), background var(--oc-fast), border-color var(--oc-fast),
    box-shadow var(--oc-fast);
}
.card:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--c), 0.45);
  box-shadow: 0 8px 22px rgba(var(--c), 0.12);
}
.card:hover .card__emoji { animation: wiggle 0.5s var(--oc-ease-spring); }
.card:active { transform: scale(0.95); }
.card__emoji { font-size: 30px; line-height: 1; }
.card__name { max-width: 100%; padding: 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card--fresh { animation: fresh 1.6s var(--oc-ease-out); border-color: rgba(250, 204, 21, 0.6); }

.inventory__empty {
  margin: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--oc-text-faint);
}

/* Mobile : cartes plus compactes, 4 par ligne sur la plupart des téléphones */
@media (max-width: 859px) {
  .inventory { gap: 12px; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px; }
  .card { min-height: 72px; padding: 8px 2px 6px; border-radius: 14px; gap: 4px; font-size: 11px; }
  .card__emoji { font-size: 24px; }
  .search { height: 40px; }
  .chip { height: 32px; padding: 0 12px; font-size: 12px; }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0) scale(1); }
  35% { transform: rotate(-8deg) scale(1.12); }
  70% { transform: rotate(6deg) scale(1.05); }
}
@keyframes fresh {
  0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7); transform: scale(0.85); }
  40% { transform: scale(1.06); }
  100% { box-shadow: 0 0 0 16px rgba(250, 204, 21, 0); transform: none; }
}
</style>
