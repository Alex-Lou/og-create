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
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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

<style scoped>
/* Ses jetons (le papier des sceaux et des cases : tokens/book.css) */
.chapters { --chapters-bar-radius: 2px; }
.chapters { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.chapters__row {
  appearance: none;
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 8px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--cc, var(--vellum-50));
  color: var(--ink-900);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
.chapters__row:active:not(:disabled) { transform: translateY(2px); }
.chapters__row:focus-visible, .pages button:focus-visible { outline: 2px solid var(--gold-500); outline-offset: 2px; }
.chapters__row.is-on { box-shadow: inset 0 0 0 2px var(--ci, var(--gold-500)), 0 2px 0 var(--vellum-400); }
.chapters__row.is-toc { background: var(--vellum-50); }
.chapters__row.is-sealed { background: var(--vellum-200); color: var(--ink-500); cursor: default; }
.chapters__seal {
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: var(--r-round);
  background: var(--grimoire-paper);
  color: var(--ci, var(--ink-700));
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 14px;
}
.chapters__row.is-sealed .chapters__seal { color: var(--ink-500); }
.chapters__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.chapters__name { font-weight: 800; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chapters__row.is-toc .chapters__name { flex: 1; }
.chapters__bar { height: 4px; border-radius: var(--chapters-bar-radius); background: rgba(255, 255, 255, 0.75); overflow: hidden; }
.chapters__bar span { display: block; height: 100%; border-radius: var(--chapters-bar-radius); background: var(--ci); }
.chapters__meta { flex: none; font-family: var(--oc-font-mono); font-weight: 800; font-size: 12px; color: var(--ink-700); }
.chapters__go { flex: none; font-size: 22px; line-height: 1; color: var(--ci); }

.pages { display: flex; flex-direction: column; gap: 12px; }
.pages__bar { display: flex; justify-content: space-between; gap: 8px; }
.pages__back, .pages__cover, .pages__arrow {
  appearance: none;
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--r-pill);
  background: var(--vellum-50);
  color: var(--ink-700);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--font-ui);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  touch-action: manipulation;
}
.pages__cover { background: var(--cc); color: var(--ci); }
.pages__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pages__cell {
  appearance: none;
  min-width: 0;
  min-height: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 4px;
  border: 0;
  border-radius: var(--r-tile);
  background: var(--grimoire-paper);
  color: var(--ci);
  box-shadow: inset 0 0 0 1.5px var(--ci), 0 2px 0 var(--vellum-400);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
.pages__cell:active { transform: translateY(2px) scale(0.97); }
.pages__cell.is-found { background: var(--cc); color: var(--ink-900); box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400); }
.pages__cell.is-on { box-shadow: inset 0 0 0 2.5px var(--gold-500), 0 2px 0 var(--gold-600); }
.pages__medal { width: 40px; height: 40px; display: grid; place-items: center; border-radius: var(--r-round); background: var(--grimoire-paper); font-family: var(--oc-font-display); font-weight: 700; font-size: 22px; line-height: 1; }
.pages__cell.is-found .pages__medal { font-size: 26px; }
.pages__label { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 800; font-size: 11.5px; }
.pages__cell:not(.is-found) .pages__label { font-family: var(--oc-font-display); font-size: 13px; letter-spacing: 0.04em; }
.pages__empty { margin: 8px 0; text-align: center; font-style: italic; color: var(--ink-500); }
.pages__nav { display: flex; align-items: center; justify-content: center; gap: 16px; }
.pages__arrow { width: 44px; padding: 0; font-size: 20px; }
.pages__arrow:disabled { opacity: 0.35; cursor: default; }
.pages__count { min-width: 48px; text-align: center; font-family: var(--oc-font-mono); font-weight: 800; font-size: 13px; color: var(--ink-700); }
</style>
