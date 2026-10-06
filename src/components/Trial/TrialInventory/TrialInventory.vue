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

<style scoped src="./TrialInventory.css"></style>
