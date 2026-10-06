<template>
  <GModal :eyebrow="opened ? `Chapitre ${opened.id}` : title" :title="opened ? opened.name : 'Chapitres'" :width="420" @close="$emit('close')">
    <!-- Niveau 1 : les chapitres -->
    <ul v-if="!opened" class="chapters">
      <li>
        <button type="button" :class="['chapters__row', 'is-toc', { 'is-on': !current }]" @click="$emit('go', 0)">
          <span class="chapters__seal" aria-hidden="true">◆</span>
          <span class="chapters__name">Sommaire</span>
          <span class="chapters__meta">★ {{ stars }}</span>
        </button>
      </li>
      <li v-for="chapter in chapters" :key="chapter.id">
        <button
          type="button"
          :class="['chapters__row', { 'is-on': current === chapter.id, 'is-sealed': !chapter.open }]"
          :style="tint(chapter.id)"
          :disabled="!chapter.open"
          :aria-label="chapter.open
            ? `Chapitre ${chapter.id}, ${chapter.name} : ${chapter.found} pages sur ${chapter.total}, voir ses pages`
            : `Chapitre ${chapter.id}, ${chapter.name}, scellé : encore ${left(chapter)} découvertes`"
          @click="open(chapter.id)"
        >
          <span class="chapters__seal" aria-hidden="true">{{ chapter.id }}</span>
          <span class="chapters__body">
            <span class="chapters__name">{{ chapter.name }}</span>
            <span v-if="chapter.open" class="chapters__bar" aria-hidden="true"><span :style="{ width: `${percent(chapter)}%` }"></span></span>
          </span>
          <span class="chapters__meta">
            <template v-if="chapter.open">{{ chapter.found }}/{{ chapter.total }}</template>
            <template v-else><ElementGlyph glyph="ui:lock" /> {{ chapter.need }}</template>
          </span>
          <span v-if="chapter.open" class="chapters__go" aria-hidden="true">›</span>
        </button>
      </li>
    </ul>

    <!-- Niveau 2 : les pages du chapitre, par feuilles de 12 (jamais de longue liste) -->
    <div v-else class="pages" :style="tint(opened.id)">
      <div class="pages__bar">
        <button type="button" class="pages__back" @click="openedId = null">‹ Chapitres</button>
        <button type="button" class="pages__cover" @click="$emit('go', opened.index)">Couverture</button>
      </div>
      <div v-if="list.length" class="pages__grid">
        <button
          v-for="entry in shown"
          :key="entry.key"
          type="button"
          :class="['pages__cell', { 'is-found': entry.page.status === 'found', 'is-on': entry.key === currentKey }]"
          :aria-label="entry.page.status === 'found' ? `${entry.page.name}, inscrite` : `Page à trouver, ${entry.page.letters} lettres`"
          @click="$emit('go', entry.index)"
        >
          <span class="pages__medal" aria-hidden="true">
            <ElementGlyph v-if="entry.page.status === 'found'" :glyph="entry.page.emoji" />
            <template v-else>?</template>
          </span>
          <span class="pages__label">{{ entry.page.status === 'found' ? entry.page.name : maskOf(entry.page) }}</span>
        </button>
      </div>
      <p v-else class="pages__empty">Rien à portée pour l’instant : chaque découverte en rapproche.</p>
      <div v-if="sheets > 1" class="pages__nav">
        <button type="button" class="pages__arrow" :disabled="sheet === 0" aria-label="Feuille précédente" @click="sheet--">‹</button>
        <span class="pages__count">{{ sheet + 1 }} / {{ sheets }}</span>
        <button type="button" class="pages__arrow" :disabled="sheet >= sheets - 1" aria-label="Feuille suivante" @click="sheet++">›</button>
      </div>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { CHAPTER_STYLE } from '@/book/chapters';

const PER_SHEET = 12;

// Feuille des chapitres, ouverte depuis la puce au-dessus du Livre : les chapitres, puis les pages d'un chapitre
export default {
  name: 'ChapterSheet',
  components: { GModal, ElementGlyph },
  props: {
    title: { type: String, required: true },
    // [{ id, name, open, index, found, total, need }]
    chapters: { type: Array, required: true },
    // Pages de chaque chapitre ouvert, dans l'ordre des tables : { [id]: [{ key, index, page }] }
    pages: { type: Object, default: () => ({}) },
    // Chapitre et page ouverts (null au sommaire)
    current: { type: String, default: null },
    currentKey: { type: String, default: null },
    stars: { type: Number, default: 0 }
  },
  emits: ['go', 'close'],
  data() {
    return { openedId: null, sheet: 0 };
  },
  computed: {
    opened() {
      return this.openedId ? this.chapters.find(c => c.id === this.openedId) || null : null;
    },
    list() {
      return (this.opened && this.pages[this.opened.id]) || [];
    },
    sheets() {
      return Math.ceil(this.list.length / PER_SHEET);
    },
    shown() {
      return this.list.slice(this.sheet * PER_SHEET, (this.sheet + 1) * PER_SHEET);
    }
  },
  created() {
    // Depuis un chapitre, la feuille s'ouvre directement sur ses pages
    const chapter = this.chapters.find(c => c.id === this.current);
    if (chapter && chapter.open) this.open(chapter.id);
  },
  methods: {
    open(id) {
      this.openedId = id;
      const at = (this.pages[id] || []).findIndex(entry => entry.key === this.currentKey);
      this.sheet = at > 0 ? Math.floor(at / PER_SHEET) : 0;
    },
    tint(id) {
      const style = CHAPTER_STYLE[id];
      return { '--cc': style.color, '--ci': style.ink };
    },
    percent(chapter) {
      return chapter.total ? Math.round((chapter.found / chapter.total) * 100) : 0;
    },
    left(chapter) {
      return Math.max(0, chapter.need - this.stars);
    },
    maskOf(page) {
      const mask = page.hangman ? page.hangman.mask : [...Array(page.letters)].map((_, k) => (k === 0 && page.first ? page.first : null));
      // Espace fine au-delà de 6 lettres : le mot tient sur sa case
      return mask.map(char => (char === ' ' ? '·' : char || '_')).join(mask.length > 6 ? '\u2009' : ' ');
    }
  }
};
</script>

<style scoped src="./ChapterSheet.css"></style>
