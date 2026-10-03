<template>
  <section class="book-view" aria-label="Le Livre">
    <header class="book-view__head">
      <div>
        <span class="book-view__eyebrow">{{ currentChapter ? `Chapitre ${currentChapter.id}` : 'Sommaire' }}</span>
        <span class="book-view__title">{{ currentChapter ? currentChapter.name : 'Le Livre' }}</span>
      </div>
      <span class="book-view__stars" :aria-label="`${stars} découvertes`">★ {{ stars }}</span>
    </header>

    <div ref="stage" class="book-view__stage">
      <div ref="rig" class="book-view__rig">
        <div ref="wrap" class="book-view__wrap">
          <nav class="book-view__ribbons" aria-label="Chapitres">
            <button
              v-for="ribbon in ribbons"
              :key="ribbon.key"
              type="button"
              :ref="el => setRibbonRef(el, ribbon.key)"
              :class="['book-view__ribbon', { 'is-on': ribbon.on, 'is-sealed': ribbon.sealed }]"
              :style="{ '--rc': ribbon.color, '--ri': ribbon.ink }"
              :aria-label="ribbon.label"
              @click="goTo(ribbon.index)"
            >{{ ribbon.text }}</button>
          </nav>
        </div>
        <div ref="hot" class="book-view__hot" role="region" aria-roledescription="page de livre" tabindex="0" :aria-label="pageLabel">
          <template v-for="spot in spots" :key="spot.id">
            <div v-if="spot.pulse" class="book-view__pulse" :style="spotStyle(spot)"></div>
            <button
              v-if="spot.action"
              type="button"
              class="book-view__spot"
              :style="spotStyle(spot)"
              :aria-label="spot.label"
              @click="onSpot(spot)"
            ></button>
          </template>
          <div v-if="showHint" class="book-view__hint" aria-hidden="true"></div>
        </div>
      </div>
      <p v-if="loadError" class="book-view__error" role="alert">
        Le Livre ne s’ouvre pas.
        <button type="button" class="book-view__retry" @click="load">Réessayer</button>
      </p>
    </div>

    <div class="book-view__shelf-head">
      <span class="book-view__shelf-title">Tes éléments</span>
      <input
        v-model="query"
        class="book-view__search"
        type="search"
        :placeholder="`Chercher parmi ${discoveredElements.length}…`"
        aria-label="Chercher un élément"
      />
    </div>
    <div class="book-view__shelf" aria-label="Éléments connus">
      <button
        v-for="name in shelf"
        :key="name"
        type="button"
        :class="['book-view__chip', { 'is-new': name === freshElement }]"
        :aria-label="`Mettre ${name} dans l’Athanor`"
        @click="$emit('select', name, $event.currentTarget.getBoundingClientRect())"
      >
        <span class="book-view__chip-glyph" aria-hidden="true"><ElementGlyph :glyph="elementEmojis[name]" /></span>
        <span class="book-view__chip-name">{{ name }}</span>
      </button>
      <p v-if="!shelf.length" class="book-view__empty">Aucun élément ne ressemble à « {{ query }} ».</p>
    </div>
  </section>
</template>

<script>
import playService from '@/services/playService';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { search } from '@/utils/search';
import { createBook } from '@/book/curlBook';
import { paintPage, CHAPTER_STYLE } from '@/book/painter';
import { burst, ring, buzz, center, unlockCinematic } from '@/book/fx';

const INK_PRICE = 50;
const INK_KEY = 'oc_book_ink';
const HINT_KEY = 'oc_livre_hint';

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage plein ou bloqué */ }
}

// Le Livre : chapitres et pages du joueur (calculés par le serveur), tournés au doigt en WebGL.
// Le moteur et les pages peintes ne sont pas réactifs (propriétés d'instance) : seule la couche
// interactive (spots), l'en-tête et l'étagère passent par Vue.
export default {
  name: 'BookView',
  components: { ElementGlyph },
  props: {
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false },
    freshElement: { type: String, default: null },
    // Révélation en cours dans l'Athanor : les effets du Livre attendent qu'elle se ferme
    revealing: { type: Boolean, default: false }
  },
  emits: ['select', 'coins-updated', 'show-alert'],
  data() {
    return {
      spots: [],
      pageLabel: 'Le Livre',
      stars: 0,
      currentKey: 'toc',
      chapterState: [],
      query: '',
      showHint: !readStore(HINT_KEY, false),
      loadError: false
    };
  },
  computed: {
    currentChapter() {
      const id = this.currentKey === 'toc' ? null : this.chapterOfKey(this.currentKey);
      return id ? this.chapterState.find(c => c.id === id) || null : null;
    },
    ribbons() {
      const on = this.currentChapter ? this.currentChapter.id : null;
      return [
        { key: 'toc', text: '◆', label: 'Sommaire', index: 0, color: '#FFFDF8', ink: '#4A3426', on: !on, sealed: false },
        ...this.chapterState.map(c => ({
          key: c.id, text: c.id, label: `Chapitre ${c.id}${c.open ? '' : ', scellé'}`, index: c.index,
          color: CHAPTER_STYLE[c.id].color, ink: CHAPTER_STYLE[c.id].ink, on: on === c.id, sealed: !c.open
        }))
      ];
    },
    shelf() {
      const newestFirst = [...this.discoveredElements].reverse();
      return this.query.trim() ? search(newestFirst, this.query) : newestFirst;
    }
  },
  watch: {
    'discoveredElements.length'() {
      clearTimeout(this.reloadTimer);
      this.reloadTimer = setTimeout(() => this.load(), 120);
    },
    revealing(now) {
      if (!now) this.flushEffects();
    }
  },
  created() {
    // Non réactifs : moteur, modèles de pages, données brutes, encre révélée
    this.engine = null;
    this.models = [{ type: 'toc', key: 'toc', chapters: [], chapterIndex: {} }];
    this.bookData = null;
    this.revealed = readStore(INK_KEY, {});
    this.pendingEffects = [];
    this.ribbonEls = {};
    this.repaintRaf = 0;
    this.reloadTimer = 0;
  },
  async mounted() {
    await this.load();
  },
  beforeUnmount() {
    clearTimeout(this.reloadTimer);
    cancelAnimationFrame(this.repaintRaf);
    if (this.engine) this.engine.destroy();
    this.engine = null;
  },
  methods: {
    setRibbonRef(el, key) {
      if (el) this.ribbonEls[key] = el;
      else delete this.ribbonEls[key];
    },
    spotStyle(spot) {
      return { left: `${spot.x}%`, top: `${spot.y * 0.75}%`, width: `${spot.w}%`, height: `${spot.h * 0.75}%` };
    },
    chapterOfKey(key) {
      const model = this.models.find(m => m.key === key);
      return model && model.chapter ? model.chapter.id : null;
    },
    buildModels(data) {
      const chapterIndex = {};
      const models = [{ type: 'toc', key: 'toc', chapters: data.chapters, chapterIndex }];
      for (const chapter of data.chapters) {
        chapterIndex[chapter.id] = models.length;
        models.push({ type: 'chapter', key: `ch-${chapter.id}`, chapter });
        if (!chapter.open) continue;
        for (const page of chapter.pages) {
          models.push(page.status === 'found'
            ? { type: 'found', key: page.id, chapter, page }
            : { type: 'reach', key: page.id, chapter, page, revealed: this.revealed[page.id] || null });
        }
        if (chapter.far) models.push({ type: 'far', key: `far-${chapter.id}`, chapter, count: chapter.far });
      }
      return models;
    },
    assets() {
      const families = Object.fromEntries((this.bookData ? this.bookData.chapters : []).map(c => [c.id, c.families || []]));
      return {
        emojiOf: name => this.elementEmojis[name],
        onReady: () => this.scheduleRepaint(),
        inkPrice: INK_PRICE,
        stars: this.stars,
        familiesOf: id => families[id] || []
      };
    },
    // Un dessin vient d'arriver : une seule peinture pour tous ceux de la même image
    scheduleRepaint() {
      if (this.repaintRaf) return;
      this.repaintRaf = requestAnimationFrame(() => {
        this.repaintRaf = 0;
        if (this.engine) this.engine.refresh();
      });
    },
    async load() {
      let data;
      try {
        data = await playService.book();
        this.loadError = false;
      } catch (error) {
        console.error('Erreur lors du chargement du Livre:', error);
        this.loadError = !this.bookData;
        return;
      }
      const previous = this.bookData;
      const previousKey = this.engine ? this.models[this.engine.index]?.key : 'toc';
      this.bookData = data;
      this.stars = data.stars;
      this.models = this.buildModels(data);
      this.chapterState = data.chapters.map(c => ({ id: c.id, name: c.name, open: c.open, index: this.models.findIndex(m => m.key === `ch-${c.id}`) }));
      if (!this.engine) {
        this.mountEngine();
        return;
      }
      // La page courante est retrouvée par son identifiant (des pages peuvent s'insérer avant elle)
      let index = this.models.findIndex(m => m.key === previousKey);
      if (index < 0) index = this.chapterState.find(c => c.id === this.chapterOfKey(previousKey))?.index ?? 0;
      if (index !== this.engine.index) this.engine.jump(index);
      else this.engine.refresh();
      if (previous) this.queueEffects(previous, data, previousKey);
    },
    mountEngine() {
      this.engine = createBook({
        stage: this.$refs.stage,
        rig: this.$refs.rig,
        wrap: this.$refs.wrap,
        hot: this.$refs.hot,
        start: 0,
        count: () => this.models.length,
        paint: (index, ctx, w, h) => paintPage(this.models[index], index, ctx, w, h, this.assets()),
        onChange: () => {
          if (this.showHint) {
            this.showHint = false;
            writeStore(HINT_KEY, true);
          }
          buzz(8);
        },
        onRest: (index, hotspots, label) => {
          this.currentKey = this.models[index]?.key || 'toc';
          this.spots = hotspots;
          this.pageLabel = label;
        }
      });
    },
    // Ce qui a changé depuis le dernier chargement : page inscrite, chapitre ouvert
    queueEffects(previous, data, previousKey) {
      const before = new Map(previous.chapters.flatMap(c => c.pages).map(p => [p.id, p.status]));
      const opened = data.chapters.filter(c => c.open && !previous.chapters.find(p => p.id === c.id)?.open);
      for (const chapter of data.chapters) {
        for (const page of chapter.pages) {
          if (page.status !== 'found' || before.get(page.id) === 'found') continue;
          this.pendingEffects.push({ kind: page.id === previousKey ? 'inscribed-here' : 'inscribed', chapter: chapter.id, name: page.name });
        }
      }
      for (const chapter of opened) this.pendingEffects.push({ kind: 'opened', chapter: chapter.id, name: chapter.name });
      if (!this.revealing) this.flushEffects();
    },
    async flushEffects() {
      const effects = this.pendingEffects.splice(0);
      for (const effect of effects) {
        if (effect.kind === 'inscribed-here') {
          const rect = this.engine && this.engine.rectOf('vignette');
          if (rect) {
            ring(center(rect), rect.width * 1.5);
            burst(center(rect), 22, rect.width * 1.1);
          }
          buzz([12, 40, 18]);
        } else if (effect.kind === 'inscribed') {
          const ribbon = this.ribbonEls[effect.chapter];
          if (ribbon) {
            ribbon.classList.remove('is-ping');
            void ribbon.offsetWidth;
            ribbon.classList.add('is-ping');
            burst(center(ribbon.getBoundingClientRect()), 10, 36);
          }
        } else if (effect.kind === 'opened') {
          await unlockCinematic({ id: effect.chapter, name: effect.name }, CHAPTER_STYLE[effect.chapter].wax);
          const index = this.chapterState.find(c => c.id === effect.chapter)?.index;
          if (this.engine && index > 0) await this.engine.go(index);
        }
      }
    },
    goTo(index) {
      if (this.engine && index >= 0) this.engine.go(index);
    },
    async onSpot(spot) {
      if (spot.action === 'goto') {
        this.goTo(Number(spot.data));
        return;
      }
      if (spot.action !== 'ink') return;
      if (!this.isLoggedIn) {
        this.$emit('show-alert', 'L’Encre demande un compte : tes écus y sont gardés.');
        return;
      }
      const slot = this.engine && this.engine.rectOf('ink');
      try {
        const { page, ingredient, coins } = await playService.ink(spot.data);
        this.revealed = { ...this.revealed, [page]: ingredient };
        writeStore(INK_KEY, this.revealed);
        this.$emit('coins-updated', coins);
        this.models = this.buildModels(this.bookData);
        this.engine.refresh();
        if (slot) burst(center(slot), 12, 40);
        buzz(10);
      } catch (error) {
        this.$emit('show-alert', error.response?.data?.message || 'L’Encre n’a pas pu être utilisée.');
      }
    }
  }
};
</script>

<style scoped>
/* Le Livre : papier crème posé sur le bureau sombre du jeu */
.book-view {
  container-type: inline-size;
  --book-ink: #4A3426;
  --book-paper: #FBF6EA;
  --book-radius: 20px;
}
.book-view__head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
  padding: 4px 2px 10px;
}
.book-view__eyebrow { display: block; font-family: var(--oc-font-mono, monospace); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-text-faint); }
.book-view__title { display: block; font-family: var(--oc-font-display); font-size: 22px; line-height: 1.1; color: var(--oc-text); }
.book-view__stars {
  flex: none; padding: 4px 12px; border-radius: 999px;
  background: rgba(224, 182, 84, .14); color: var(--oc-gold);
  font-family: var(--oc-font-mono, monospace); font-size: 14px; font-weight: 600;
}
.book-view__stage {
  --book-w: max(220px, min(calc(100cqw - 56px), calc((100dvh - 420px) * .75), 460px));
  position: relative;
  height: calc(var(--book-w) * 4 / 3 + 24px);
}
.book-view__rig { position: absolute; inset: 0; }
.book-view__wrap {
  position: absolute; top: 8px;
  left: calc((100% - var(--book-w) - 38px) / 2);
  width: var(--book-w);
  aspect-ratio: 3 / 4;
}
/* Tranche des pages en dessous et ombre du livre (statiques, sous le canvas) */
.book-view__wrap::before, .book-view__wrap::after {
  content: ''; position: absolute; inset: 0;
  border-radius: 6px var(--book-radius) var(--book-radius) 6px;
}
.book-view__wrap::before { transform: translate(7px, 7px); background: #CDBB98; box-shadow: 0 22px 46px rgba(0, 0, 0, .55), 0 4px 12px rgba(0, 0, 0, .35); }
.book-view__wrap::after { transform: translate(3.5px, 3.5px); background: repeating-linear-gradient(180deg, #EFE5D0 0 2px, #E3D6BC 2px 3px); }
.book-view__rig :deep(canvas.gl) { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
.book-view__hot { position: absolute; z-index: 3; touch-action: pan-y; border-radius: 6px var(--book-radius) var(--book-radius) 6px; outline: none; }
.book-view__hot:focus-visible { box-shadow: 0 0 0 3px var(--oc-gold); }
.book-view__hot.is-turning > * { visibility: hidden; }
.book-view__spot { position: absolute; border: 0; padding: 0; background: transparent; border-radius: 14px; cursor: pointer; }
.book-view__spot:focus-visible { outline: 3px solid rgba(227, 169, 59, .9); outline-offset: 2px; }
.book-view__pulse { position: absolute; border-radius: 50%; pointer-events: none; animation: book-aura 2.4s ease-out infinite; }
@keyframes book-aura { 0% { box-shadow: 0 0 0 0 rgba(227, 169, 59, .5); } 70%, 100% { box-shadow: 0 0 0 22px rgba(227, 169, 59, 0); } }
.book-view__hint {
  position: absolute; right: 8%; top: 66%; width: 54px; height: 54px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, .95) 30%, rgba(255, 255, 255, .35) 60%, rgba(255, 255, 255, 0) 72%);
  box-shadow: 0 6px 18px rgba(74, 52, 38, .25);
  pointer-events: none;
  animation: book-swipe 2.2s cubic-bezier(.5, 0, .3, 1) infinite;
}
@keyframes book-swipe {
  0% { transform: translateX(0) scale(.8); opacity: 0; }
  15% { transform: translateX(0) scale(1); opacity: 1; }
  70% { transform: translateX(-150%) scale(1); opacity: 1; }
  100% { transform: translateX(-190%) scale(.8); opacity: 0; }
}
.book-view__ribbons { position: absolute; top: 6%; right: -34px; display: flex; flex-direction: column; gap: 5px; z-index: 1; }
.book-view__ribbon {
  width: 40px; min-height: 40px; padding: 0 0 0 11px;
  border: 0; border-radius: 0 12px 12px 0;
  background: var(--rc); color: var(--ri);
  font-family: Fraunces, Georgia, serif; font-weight: 700; font-size: 13px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .35), inset 0 -3px 0 rgba(0, 0, 0, .08);
  transform: translateX(-9px);
  transition: transform .35s cubic-bezier(.3, 1.5, .55, 1);
  cursor: pointer;
}
.book-view__ribbon.is-on { transform: translateX(0); }
.book-view__ribbon.is-sealed { background: #8F8270; color: #D8CCB6; }
.book-view__ribbon.is-ping { animation: book-ping .8s cubic-bezier(.3, 1.5, .55, 1) 2; }
@keyframes book-ping { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(7px); } }
.book-view__error { position: absolute; inset: 30% 10% auto; text-align: center; color: var(--oc-text); z-index: 4; }
.book-view__retry { margin-left: 8px; }

.book-view__shelf-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
.book-view__shelf-title { font-family: var(--oc-font-mono, monospace); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-text-faint); }
.book-view__search {
  min-width: 0; flex: 1; max-width: 220px;
  padding: 6px 10px; border-radius: 10px;
  border: 1px solid var(--oc-line, rgba(233, 223, 200, .2));
  background: rgba(233, 223, 200, .06); color: var(--oc-text);
  font: inherit; font-size: 14px;
}
.book-view__shelf {
  display: flex; gap: 8px;
  margin-top: 8px; padding: 2px 2px 6px;
  overflow-x: auto; overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.book-view__shelf::-webkit-scrollbar { display: none; }
.book-view__chip {
  flex: none;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  width: 64px; min-height: 64px; padding: 7px 3px 5px;
  border: 0; border-radius: 16px;
  background: var(--book-paper); color: var(--book-ink);
  box-shadow: 0 3px 0 rgba(0, 0, 0, .35);
  cursor: pointer;
  transition: transform .15s ease;
}
.book-view__chip:active { transform: scale(.92); }
.book-view__chip-glyph { font-size: 26px; line-height: 1; }
.book-view__chip-name { font-size: 10.5px; font-weight: 700; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: Nunito, system-ui, sans-serif; color: #8A7262; }
.book-view__chip.is-new { box-shadow: 0 0 0 2.5px var(--oc-gold), 0 3px 0 rgba(0, 0, 0, .35); animation: book-pop .55s cubic-bezier(.3, 1.5, .55, 1); }
@keyframes book-pop { 0% { transform: scale(.55); } 100% { transform: scale(1); } }
.book-view__empty { margin: 8px 0; color: var(--oc-text-faint); font-style: italic; }

@media (prefers-reduced-motion: reduce) {
  .book-view__pulse, .book-view__hint, .book-view__ribbon.is-ping, .book-view__chip.is-new { animation: none; }
}
</style>

<style>
/* Cinématique d'ouverture de chapitre (montée hors du composant, dans body) */
.book-unlock {
  position: fixed; inset: 0; z-index: 80;
  display: grid; place-items: center; align-content: center; gap: 18px;
  background: radial-gradient(circle at 50% 42%, rgba(58, 38, 24, .82), rgba(24, 16, 10, .94));
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  color: #FFFDF8; text-align: center;
  opacity: 0;
}
.book-unlock__rays {
  position: absolute; left: 50%; top: 42%; width: 140vmax; height: 140vmax;
  margin: -70vmax 0 0 -70vmax;
  background: repeating-conic-gradient(from 0deg, rgba(255, 220, 150, .16) 0 9deg, rgba(255, 220, 150, 0) 9deg 22deg);
  -webkit-mask: radial-gradient(circle, #000 0, transparent 45%);
  mask: radial-gradient(circle, #000 0, transparent 45%);
  animation: book-spin 14s linear infinite;
  opacity: 0;
}
@keyframes book-spin { to { transform: rotate(360deg); } }
.book-unlock__seal { position: relative; width: 150px; height: 150px; }
.book-unlock__seal img { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; }
.book-unlock__eyebrow { font-size: 12px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: #FFE2A6; opacity: 0; font-family: Nunito, system-ui, sans-serif; }
.book-unlock__name { font-family: Fraunces, Georgia, serif; font-weight: 700; font-size: 34px; line-height: 1.05; opacity: 0; }
.book-unlock__go {
  margin-top: 6px; min-height: 48px; padding: 12px 26px;
  border: 0; border-radius: 999px;
  background: #FFE2A6; color: #4A3426;
  font-family: Nunito, system-ui, sans-serif; font-weight: 900; font-size: 16px;
  box-shadow: 0 6px 0 #C9933A;
  cursor: pointer; opacity: 0;
}
</style>
