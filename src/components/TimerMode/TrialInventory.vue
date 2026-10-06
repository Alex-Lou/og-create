<template>
  <div class="registry">
    <div class="registry__tools">
      <label class="registry__search">
        <span class="oc-sr-only">Chercher un élément</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg>
        <input
          ref="search"
          v-model="query"
          type="search"
          :placeholder="`Chercher parmi ${discoveredElements.length} éléments…`"
          autocomplete="off"
          enterkeyhint="go"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc="query = ''"
        />
      </label>
    </div>

    <section v-if="shown.length" class="shelf">
      <div class="shelf__head">
        <h2 class="shelf__title">{{ query.trim() ? 'Résultats' : 'Éléments du défi' }}</h2>
        <span class="shelf__note">{{ shown.length }}</span>
      </div>
      <div class="plates">
        <ElementTile
          v-for="element in shown"
          :key="element"
          :class="['registry__tile', { 'registry__tile--fresh': element === freshElement }]"
          :name="element"
          :glyph="elementEmojis[element]"
          :family="familyOf[element]"
          :is-new="element === freshElement"
          :slot-index="picked.indexOf(element)"
          :draggable="canDrag ? 'true' : 'false'"
          @dragstart="startDrag($event, element)"
          @click="$emit('selectResource', element, $event.currentTarget.getBoundingClientRect())"
        />
      </div>
    </section>

    <p v-else class="g-italic registry__empty">
      {{ query ? `Aucun élément ne répond à « ${query} ».` : 'Le registre est encore vierge.' }}
      <button v-if="suggestion" type="button" class="registry__suggest" @click="query = suggestion">Vouliez-vous dire « {{ suggestion }} » ?</button>
    </p>
  </div>
</template>

<script>
import { familyIndex } from '@/utils/eras';
import ElementTile from '@/components/ui/ElementTile/ElementTile.vue';
import { search, suggest } from '@/utils/search';

// Glisser une planche vers l'Athanor : seulement à la souris (au doigt, le glisser gênerait le défilement)
function finePointer() {
  try {
    return window.matchMedia('(pointer: fine)').matches;
  } catch {
    return false;
  }
}

// Saisie en cours ailleurs, ou fenêtre ouverte : les lettres tapées ne vont pas à la recherche
function typingElsewhere(event) {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || event.key === ' ') return true;
  if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return true;
  return Boolean(document.querySelector('[aria-modal="true"]'));
}

// Inventaire de l'Épreuve : les éléments du défi, avec une recherche par nom
export default {
  name: 'TrialInventory',
  components: { ElementTile },
  props: {
    categories: { type: Object, required: true },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    // Dernière découverte, mise en valeur
    freshElement: { type: String, default: null },
    // Éléments posés dans l'Athanor, dans l'ordre des emplacements
    picked: { type: Array, default: () => [] }
  },
  emits: ['selectResource', 'fuse'],
  data() {
    return {
      query: '',
      canDrag: finePointer()
    };
  },
  computed: {
    familyOf() {
      return familyIndex(this.categories);
    },
    shown() {
      return this.query.trim() ? search(this.discoveredElements, this.query) : this.discoveredElements;
    },
    suggestion() {
      if (!this.query.trim() || this.shown.length) return null;
      return suggest(this.discoveredElements, this.query);
    }
  },
  watch: {
    // La nouvelle découverte défile en vue, en douceur. « nearest » ne tient pas compte des marges
    // (scroll-margin) : une planche cachée derrière le dock ou la consigne serait jugée visible.
    freshElement(name) {
      if (!name) return;
      this.$nextTick(() => {
        const el = this.$el.querySelector('.registry__tile--fresh');
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
  methods: {
    // Entrée dans la recherche : le premier résultat part dans l'Athanor ; recherche vide = fusionner
    onSearchEnter() {
      if (!this.query.trim()) {
        this.$emit('fuse');
        return;
      }
      const first = this.shown[0];
      if (!first) return;
      const tile = this.$el.querySelector('.registry__tile');
      this.$emit('selectResource', first, tile?.getBoundingClientRect() || null);
      this.query = '';
    },
    startDrag(event, element) {
      event.dataTransfer.setData('text/plain', element);
      event.dataTransfer.effectAllowed = 'copy';
    }
  }
};
</script>

<style scoped>
.registry {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* Outils : une seule ligne, collée en haut pendant le défilement */
.registry__tools {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 8px;
  background: linear-gradient(180deg, var(--bg) 80%, transparent);
}
.registry__search {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 16px;
  border-radius: var(--r-pill);
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong), var(--shadow-1);
  color: var(--oc-text-faint);
  transition: box-shadow var(--oc-fast);
}
.registry__search:focus-within { box-shadow: inset 0 0 0 2px var(--oc-accent-line), var(--shadow-1); }
.registry__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-weight: 700;
  font-size: 16px;
  color: var(--oc-text-strong);
}
.registry__search input::placeholder { color: var(--oc-text-faint); }

.shelf {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Voile léger : lisible, le fond vivant reste visible autour */
  padding: 8px 12px 12px;
  margin: 0 -12px;
  border-radius: var(--r-lg);
  background: linear-gradient(180deg, var(--vellum-100), var(--vellum-200));
  box-shadow: inset 0 0 0 1px var(--oc-line);
}
.shelf__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.shelf__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-weight: 400;
  font-size: 17px;
  letter-spacing: 0.04em;
  color: var(--oc-text-strong);
}
.shelf__note { font-family: var(--oc-font-mono); font-size: 10px; letter-spacing: 0.04em; color: var(--oc-text-muted); text-align: right; }
.plates {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 8px;
}
.registry__tile[draggable='true'] { cursor: grab; }

.registry__empty { margin: 24px 0; text-align: center; color: var(--oc-on-bg-faint); }
.registry__suggest {
  appearance: none;
  display: block;
  margin: 10px auto 0;
  min-height: 44px;
  padding: 0 14px;
  border: 0;
  cursor: pointer;
  font: inherit;
  color: var(--oc-gold);
  background: var(--oc-gold-soft);
  box-shadow: inset 0 0 0 1px var(--oc-accent-line);
}

/* Mobile : 5 tuiles par ligne sur la plupart des téléphones, cibles de 60 px et plus */
@media (max-width: 859px) {
  .registry { gap: 12px; }
  .plates { grid-template-columns: repeat(auto-fill, minmax(62px, 1fr)); gap: 6px; }
  /* Une nouvelle découverte défile au-dessus des panneaux fixés en bas (dock, consigne) */
  .registry__tile { scroll-margin: 70px 0 calc(var(--oc-overlay, 120px) + 16px); }
}
</style>
