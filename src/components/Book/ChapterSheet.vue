<template>
  <GModal :eyebrow="title" title="Chapitres" :width="420" @close="$emit('close')">
    <ul class="chapters">
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
          :style="{ '--cc': style(chapter.id).color, '--ci': style(chapter.id).ink }"
          :disabled="!chapter.open"
          :aria-label="chapter.open
            ? `Chapitre ${chapter.id}, ${chapter.name} : ${chapter.found} pages sur ${chapter.total}`
            : `Chapitre ${chapter.id}, ${chapter.name}, scellé : encore ${left(chapter)} découvertes`"
          @click="$emit('go', chapter.index)"
        >
          <span class="chapters__seal" aria-hidden="true">{{ chapter.id }}</span>
          <span class="chapters__body">
            <span class="chapters__name">{{ chapter.name }}</span>
            <span v-if="chapter.open" class="chapters__bar" aria-hidden="true"><span :style="{ width: `${percent(chapter)}%` }"></span></span>
          </span>
          <span class="chapters__meta">{{ chapter.open ? `${chapter.found}/${chapter.total}` : `🔒 ${chapter.need}` }}</span>
        </button>
      </li>
    </ul>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import { CHAPTER_STYLE } from '@/book/chapters';

// Feuille des chapitres, ouverte depuis la puce de chapitre au-dessus du Livre (remplace les rubans)
export default {
  name: 'ChapterSheet',
  components: { GModal },
  props: {
    title: { type: String, required: true },
    // [{ id, name, open, index, found, total, need }]
    chapters: { type: Array, required: true },
    // Chapitre ouvert (null au sommaire)
    current: { type: String, default: null },
    stars: { type: Number, default: 0 }
  },
  emits: ['go', 'close'],
  methods: {
    style(id) {
      return CHAPTER_STYLE[id];
    },
    percent(chapter) {
      return chapter.total ? Math.round((chapter.found / chapter.total) * 100) : 0;
    },
    left(chapter) {
      return Math.max(0, chapter.need - this.stars);
    }
  }
};
</script>

<style scoped>
.chapters { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.chapters__row {
  appearance: none;
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px 6px 8px;
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
.chapters__row:focus-visible { outline: 2px solid var(--gold-500); outline-offset: 2px; }
.chapters__row.is-on { box-shadow: inset 0 0 0 2px var(--ci, var(--gold-500)), 0 2px 0 var(--vellum-400); }
.chapters__row.is-toc { background: var(--vellum-50); }
.chapters__row.is-sealed { background: var(--vellum-200); color: var(--ink-500); cursor: default; }
.chapters__seal {
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #FFFDF8;
  color: var(--ci, var(--ink-700));
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 14px;
}
.chapters__row.is-sealed .chapters__seal { color: var(--ink-500); }
.chapters__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.chapters__name { font-weight: 800; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chapters__row.is-toc .chapters__name { flex: 1; }
.chapters__bar { height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.75); overflow: hidden; }
.chapters__bar span { display: block; height: 100%; border-radius: 2px; background: var(--ci); }
.chapters__meta { flex: none; font-family: var(--oc-font-mono); font-weight: 800; font-size: 12px; color: var(--ink-700); }
</style>
