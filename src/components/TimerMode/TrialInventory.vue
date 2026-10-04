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
        <button
          v-for="element in shown"
          :key="element"
          type="button"
          :class="['plate', 'g-bevel', { 'plate--fresh': element === freshElement }]"
          :aria-label="element"
          :draggable="canDrag ? 'true' : 'false'"
          @dragstart="startDrag($event, element)"
          @click="$emit('selectResource', element, $event.currentTarget.getBoundingClientRect())"
        >
          <span class="plate__dot" :style="{ background: dotColor(element) }" aria-hidden="true"></span>
          <span :class="['plate__ink', { 'g-ink--glow': element === freshElement }]" aria-hidden="true"><ElementGlyph :glyph="elementEmojis[element] || '❔'" /></span>
          <span :class="['plate__name', { 'plate__name--long': isLong(element) }]">{{ element }}</span>
        </button>
      </div>
    </section>

    <p v-else class="g-italic registry__empty">
      {{ query ? `Aucun élément ne répond à « ${query} ».` : 'Le registre est encore vierge.' }}
      <button v-if="suggestion" type="button" class="registry__suggest" @click="query = suggestion">Vouliez-vous dire « {{ suggestion }} » ?</button>
    </p>
  </div>
</template>

<script>
import { familyInk, familyIndex } from '@/utils/eras';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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
  components: { ElementGlyph },
  props: {
    categories: { type: Object, required: true },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    // Dernière découverte, mise en valeur
    freshElement: { type: String, default: null }
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
    // Un mot de 9 lettres ou plus ne tient pas sur une planche de téléphone : un cran plus petit
    isLong(element) {
      return element.split(/[\s'’-]+/).some(word => word.length >= 9);
    },
    dotColor(element) {
      const [r, g, b] = familyInk(this.familyOf[element]);
      return `rgb(${r}, ${g}, ${b})`;
    },
    // Entrée dans la recherche : le premier résultat part dans l'Athanor ; recherche vide = fusionner
    onSearchEnter() {
      if (!this.query.trim()) {
        this.$emit('fuse');
        return;
      }
      const first = this.shown[0];
      if (!first) return;
      const plate = this.$el.querySelector('.plate');
      this.$emit('selectResource', first, plate?.getBoundingClientRect() || null);
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
.plate {
  appearance: none;
  position: relative;
  min-height: 92px;
  padding: 14px 4px 8px;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--oc-text);
  background: linear-gradient(180deg, var(--vellum-50), var(--vellum-100));
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--edge-paper), var(--shadow-1);
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background var(--oc-fast), box-shadow var(--oc-fast), transform var(--oc-fast) var(--oc-ease-out), opacity var(--oc-fast);
}
.plate[draggable='true'] { cursor: grab; }
.plate:hover { background: var(--vellum-50); box-shadow: inset 0 0 0 1px var(--oc-line-strong), var(--edge-paper), var(--shadow-1); }
.plate:hover .plate__ink { animation: quiver 0.5s var(--oc-ease-spring); }
.plate:active { transform: translateY(2px) scale(0.96); box-shadow: inset 0 0 0 1px var(--oc-line), 0 1px 0 var(--vellum-400); }

.plate__dot { position: absolute; top: 7px; left: 7px; width: 6px; height: 6px; border-radius: 50%; opacity: 0.85; }
.plate__ink { font-size: 28px; line-height: 1; }
.plate__name {
  max-width: 100%;
  padding: 0 2px;
  font-weight: 800;
  font-size: 12px;
  line-height: 1.15;
  text-align: center;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* Noms longs : césure française aux bonnes syllabes si le navigateur la connaît, jamais une coupure en plein mot */
  hyphens: auto;
  -webkit-hyphens: auto;
}
.plate--fresh { box-shadow: inset 0 0 0 2px var(--gold-400), var(--oc-shadow-accent); animation: fresh 1.6s var(--oc-ease-out); }

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

@keyframes quiver {
  35% { transform: rotate(-7deg) scale(1.1); }
  70% { transform: rotate(5deg) scale(1.04); }
}
@keyframes fresh {
  0% { transform: scale(0.88); }
  40% { transform: scale(1.05); }
  100% { transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .plate:hover .plate__ink, .plate--fresh { animation: none; }
}

/* Mobile : 5 planches par ligne sur la plupart des téléphones, cibles de 60 px et plus */
@media (max-width: 859px) {
  .registry { gap: 12px; }
  .plates { grid-template-columns: repeat(auto-fill, minmax(62px, 1fr)); gap: 6px; }
  .plate { min-height: 72px; padding: 12px 2px 5px; gap: 4px; --oc-bevel: 7px; }
  /* Une nouvelle découverte défile au-dessus des panneaux fixés en bas (dock, consigne) */
  .plate { scroll-margin: 70px 0 calc(var(--oc-overlay, 120px) + 16px); }
  .plate__ink { font-size: 23px; }
  .plate__name { font-size: 10.5px; }
  .plate__name--long { font-size: 8.5px; letter-spacing: -0.03em; }
}
</style>
