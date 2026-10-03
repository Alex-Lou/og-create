<template>
  <div class="registry">
    <!-- Une seule ligne d'outils : la recherche sous les yeux, la piste à côté -->
    <div class="registry__tools">
      <label class="registry__search">
        <span class="oc-sr-only">Chercher un élément ou une famille</span>
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
      <button v-if="!isTimerMode" type="button" class="registry__clue" @click="$emit('hint')">Piste <i>{{ hintPrice }}</i></button>
    </div>

    <!-- Sous la main : épinglés d'abord, puis les derniers éléments posés -->
    <section v-if="handyElements.length" class="shelf shelf--handy" aria-label="Sous la main">
      <h2 class="shelf__title">Sous la main</h2>
      <div class="plates plates--row">
        <button
          v-for="element in handyElements"
          :key="element"
          v-bind="plateProps(element)"
        >
          <span v-if="pinned.has(element)" class="plate__pin" aria-hidden="true">★</span>
          <span class="plate__ink g-ink" aria-hidden="true"><ElementGlyph :glyph="getElementEmoji(element)" /></span>
          <span :class="['plate__name', { 'plate__name--long': isLong(element) }]">{{ element }}</span>
        </button>
      </div>
    </section>

    <section v-for="shelf in shelves" :key="shelf.key" :class="['shelf', { 'shelf--spent': shelf.spent }]">
      <div class="shelf__head">
        <h2 class="shelf__title">{{ shelf.label }}</h2>
        <span class="shelf__note">{{ shelf.note }}</span>
      </div>
      <div class="plates">
        <button
          v-for="element in shelf.elements"
          :key="element"
          v-bind="plateProps(element)"
        >
          <span class="plate__dot" :style="{ background: dotColor(element) }" aria-hidden="true"></span>
          <span v-if="!isTimerMode && unexplored[element] > 0" class="plate__left" aria-hidden="true">{{ unexplored[element] > 9 ? '9+' : unexplored[element] }}</span>
          <span :class="['plate__ink', element === freshElement ? 'g-ink--glow' : 'g-ink']" aria-hidden="true"><ElementGlyph :glyph="getElementEmoji(element)" /></span>
          <span :class="['plate__name', { 'plate__name--long': isLong(element) }]">{{ element }}</span>
        </button>
      </div>
    </section>

    <p v-if="!shelves.length" class="g-italic registry__empty">
      {{ query ? `Aucun élément ne répond à « ${query} ».` : 'Le registre est encore vierge.' }}
      <button v-if="suggestion" type="button" class="registry__suggest" @click="query = suggestion">Vouliez-vous dire « {{ suggestion }} » ?</button>
    </p>
  </div>
</template>

<script>
import { JOKER_PRICE } from '@/utils/hints';
import { familyColor } from '@/utils/eras';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { search, suggest } from '@/utils/search';
import { handy, markUsed } from '@/utils/handy';
import { familyIndex, familyMatches, orderRegistry } from '@/utils/registry';

// Appui long sur une planche : sa fiche s'ouvre (le toucher simple la pose dans l'Athanor)
const LONG_PRESS_MS = 480;
const PRESS_SLOP = 10;

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

// Registre : une seule liste. D'abord ce qui peut encore donner, le plus récent en tête ; les épuisés à la fin.
// Aucun état métier ici : les compteurs « encore à découvrir » viennent du serveur.
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
    // Nombre de découvertes encore possibles avec chaque élément (calculé par le serveur)
    unexplored: { type: Object, default: () => ({}) },
    // Nombre d'éléments inconnus créables tout de suite (null : inconnu ou hors Infini)
    reachable: { type: Number, default: null }
  },
  emits: ['selectResource', 'inspect', 'hint', 'fuse'],
  data() {
    return {
      query: '',
      hintPrice: JOKER_PRICE,
      canDrag: finePointer()
    };
  },
  computed: {
    familyOf() {
      return familyIndex(this.categories);
    },
    // Recherche : les noms d'abord, puis les éléments d'une famille dont on tape le nom
    results() {
      if (!this.query.trim()) return [];
      const byName = search(this.discoveredElements, this.query);
      const seen = new Set(byName);
      const byFamily = this.isTimerMode ? [] : familyMatches(this.categories, this.discoveredElements, this.query).filter(n => !seen.has(n));
      return [...byName, ...byFamily];
    },
    suggestion() {
      if (!this.query.trim() || this.results.length) return null;
      return suggest(this.discoveredElements, this.query);
    },
    reachNote() {
      if (this.reachable === null) return '';
      if (this.reachable === 0) return 'plus rien à découvrir';
      return `${this.reachable} découverte${this.reachable > 1 ? 's' : ''} à portée`;
    },
    shelves() {
      if (this.query.trim()) {
        return this.results.length ? [{ key: 'results', label: 'Résultats', note: String(this.results.length), elements: this.results }] : [];
      }
      // Épreuve : l'inventaire du défi, tel quel
      if (this.isTimerMode) {
        return this.discoveredElements.length
          ? [{ key: 'trial', label: 'Éléments du défi', note: String(this.discoveredElements.length), elements: this.discoveredElements }]
          : [];
      }
      const { fertile, spent } = orderRegistry(this.discoveredElements, this.unexplored);
      const list = [];
      if (fertile.length) list.push({ key: 'fertile', label: 'À explorer', note: this.reachNote, elements: fertile });
      if (spent.length) list.push({ key: 'spent', label: 'Épuisés', note: 'ne donnent plus rien de nouveau', elements: spent, spent: true });
      return list;
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
    clearTimeout(this.press?.timer);
  },
  watch: {
    // La nouvelle découverte défile en vue, en douceur. « nearest » ne tient pas compte des marges
    // (scroll-margin) : une planche cachée derrière le dock ou la consigne serait jugée visible.
    freshElement(name) {
      if (!name) return;
      this.$nextTick(() => {
        const el = this.$el.querySelector('.shelf:not(.shelf--handy) .plate--fresh');
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
    // Attributs communs d'une planche : toucher = Athanor, appui long ou clic droit = fiche, glisser à la souris
    plateProps(element) {
      const left = this.unexplored[element] || 0;
      return {
        type: 'button',
        class: ['plate', 'g-bevel', { 'plate--fresh': element === this.freshElement }],
        'aria-label': this.isTimerMode || !left ? element : `${element}, encore ${left} découverte${left > 1 ? 's' : ''}`,
        draggable: this.canDrag ? 'true' : 'false',
        onDragstart: event => this.startDrag(event, element),
        onPointerdown: event => this.pressStart(event, element),
        onPointermove: this.pressMove,
        onPointerup: this.pressEnd,
        onPointercancel: this.pressEnd,
        onPointerleave: this.pressEnd,
        onClick: event => this.select(event, element),
        // Clic droit, ou appui long natif d'Android : la fiche, une seule fois
        onContextmenu: event => {
          event.preventDefault();
          if (this.isTimerMode || this.press?.fired) return;
          clearTimeout(this.press?.timer);
          this.press = { fired: true };
          this.$emit('inspect', element);
        }
      };
    },
    pressStart(event, element) {
      clearTimeout(this.press?.timer);
      this.press = null;
      if (this.isTimerMode || event.button > 0) return;
      const press = { x: event.clientX, y: event.clientY, fired: false };
      press.timer = setTimeout(() => {
        press.fired = true;
        navigator.vibrate?.(12);
        this.$emit('inspect', element);
      }, LONG_PRESS_MS);
      this.press = press;
    },
    // Le doigt qui bouge fait défiler la liste : ce n'est plus un appui long
    pressMove(event) {
      const press = this.press;
      if (press && !press.fired && Math.hypot(event.clientX - press.x, event.clientY - press.y) > PRESS_SLOP) {
        clearTimeout(press.timer);
        this.press = null;
      }
    },
    pressEnd() {
      clearTimeout(this.press?.timer);
    },
    // Un mot de 11 lettres ou plus ne tient pas sur une planche de téléphone : un cran plus petit
    isLong(element) {
      return element.split(/[\s'’-]+/).some(word => word.length >= 11);
    },
    dotColor(element) {
      const [r, g, b] = familyColor(this.familyOf[element]);
      return `rgb(${r}, ${g}, ${b})`;
    },
    // Entrée dans la recherche : le premier résultat part dans l'Athanor ; recherche vide = fusionner
    onSearchEnter() {
      if (!this.query.trim()) {
        this.$emit('fuse');
        return;
      }
      const first = this.results[0];
      if (!first) return;
      const plate = this.$el.querySelector('.shelf:not(.shelf--handy) .plate');
      if (!this.isTimerMode) markUsed(first);
      this.$emit('selectResource', first, plate?.getBoundingClientRect() || null);
      this.query = '';
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
      // L'appui long a déjà ouvert la fiche : le relâcher ne pose rien dans l'Athanor
      if (this.press?.fired) {
        this.press = null;
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
  background: linear-gradient(180deg, rgba(12, 10, 8, 0.96) 80%, rgba(12, 10, 8, 0));
}
.registry__search {
  flex: 1;
  min-width: 0;
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
.registry__clue {
  appearance: none;
  flex-shrink: 0;
  min-height: 44px;
  padding: 0 14px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: var(--oc-text);
  background: none;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  transition: color var(--oc-fast), box-shadow var(--oc-fast);
}
.registry__clue:hover { color: var(--oc-text-strong); box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.registry__clue i { font-family: var(--oc-font-mono); font-style: normal; font-size: 10px; color: var(--oc-gold); }

/* Étagères : « Sous la main », « À explorer », « Épuisés » */
.shelf {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Voile léger : lisible, le fond vivant reste visible autour */
  padding: 8px 12px 12px;
  margin: 0 -12px;
  background: rgba(12, 10, 8, 0.55);
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
.shelf--handy { background: rgba(12, 10, 8, 0.72); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
.shelf--handy .shelf__title { font-size: 14px; color: var(--oc-gold); }
/* Épuisés : encore utilisables, mais en retrait */
.shelf--spent .shelf__title { color: var(--oc-text-muted); }
.shelf--spent .plate { opacity: 0.5; }
.shelf--spent .plate:hover, .shelf--spent .plate:focus-visible { opacity: 1; }

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
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--oc-text);
  background: linear-gradient(180deg, rgba(233, 223, 200, 0.05), rgba(233, 223, 200, 0.015));
  box-shadow: inset 0 0 0 1px var(--oc-line);
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background var(--oc-fast), box-shadow var(--oc-fast), transform var(--oc-fast) var(--oc-ease-out), opacity var(--oc-fast);
}
.plate[draggable='true'] { cursor: grab; }
.plate:hover { background: var(--oc-surface-hover); box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.plate:hover .plate__ink { animation: quiver 0.5s var(--oc-ease-spring); }
.plate:active { transform: scale(0.95); }
/* Point de famille, en haut à gauche ; découvertes restantes, en haut à droite */
.plate__dot { position: absolute; top: 7px; left: 7px; width: 6px; height: 6px; border-radius: 50%; opacity: 0.85; }
.plate__left, .plate__pin {
  position: absolute;
  top: 4px;
  right: 6px;
  font-family: var(--oc-font-mono);
  font-size: 10px;
  line-height: 1;
  color: var(--oc-gold);
}
.plate__ink { font-size: 28px; line-height: 1; }
.plate__name {
  max-width: 100%;
  padding: 0 2px;
  font-size: 13px;
  line-height: 1.15;
  text-align: center;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* Noms longs : césure française aux bonnes syllabes, jamais au milieu d'une lettre isolée */
  hyphens: auto;
  -webkit-hyphens: auto;
  overflow-wrap: break-word;
}
.plate--fresh { box-shadow: inset 0 0 0 1px rgba(224, 182, 84, 0.75), var(--oc-shadow-accent); animation: fresh 1.6s var(--oc-ease-out); }

.registry__empty { margin: 24px 0; text-align: center; }
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

/* Sous la main : une seule rangée qui défile de côté, jamais plus haute */
.plates--row { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: thin; padding-bottom: 4px; }
.plates--row .plate { flex: 0 0 88px; }

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
  .plates { grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 6px; }
  .plate { min-height: 72px; padding: 12px 2px 5px; gap: 4px; --oc-bevel: 7px; }
  /* Une nouvelle découverte défile au-dessus des panneaux fixés en bas (dock, consigne) */
  .plate { scroll-margin: 70px 0 calc(var(--oc-overlay, 120px) + 16px); }
  .plate__ink { font-size: 23px; }
  .plate__name { font-size: 11px; }
  .plate__name--long { font-size: 9.5px; letter-spacing: -0.01em; }
  .plates--row .plate { flex-basis: 64px; }
}
</style>
