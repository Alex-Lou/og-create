<template>
  <section class="book-view" :aria-label="BOOK_TITLE">
    <header class="book-view__head">
      <!-- Puce de chapitre : ouvre la feuille des 7 chapitres -->
      <button
        ref="chapterChip"
        type="button"
        class="book-view__chapter"
        :style="chipStyle"
        :aria-label="currentChapter ? `Chapitre ${currentChapter.id}, ${currentChapter.name} : changer de chapitre` : `${BOOK_TITLE} : choisir un chapitre`"
        @click="openChapters"
      >
        <span class="book-view__chapter-seal" aria-hidden="true">{{ currentChapter ? currentChapter.id : '◆' }}</span>
        <span class="book-view__chapter-name">{{ currentChapter ? currentChapter.name : BOOK_TITLE }}</span>
        <span class="book-view__chevron" aria-hidden="true">▾</span>
      </button>
      <!-- Retour direct à la table du chapitre (sa première feuille), puis au sommaire du Livre -->
      <button v-if="summaryJump" type="button" class="book-view__summary" :aria-label="summaryJump.label" :title="summaryJump.label" @click="goTo(summaryJump.index)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"></path><circle cx="3.5" cy="6" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="3.5" cy="12" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="3.5" cy="18" r="1.3" fill="currentColor" stroke="none"></circle></svg>
      </button>
      <button type="button" class="book-view__stars" :aria-label="`${stars} découvertes : revenir au sommaire`" @click="goTo(0)">★ {{ stars }}</button>
    </header>
    <!-- Le fil d'Ariane (bible, § 6.1) : la cible de la quête, les pages qui restent ; un toucher ouvre la page marquée -->
    <button v-if="ariane" type="button" class="book-view__ariane" @click="goMarked">
      <span class="book-view__ariane-ribbon" aria-hidden="true"></span>
      <span>Vers : <strong>{{ ariane.target }}</strong> — {{ ariane.remaining > 1 ? `encore ${ariane.remaining} pages` : 'dernière page' }}</span>
    </button>

    <div ref="stage" :class="['book-view__stage', single ? 'is-single' : 'is-spread', { 'is-opening': opening }]">
      <div ref="rig" class="book-view__rig">
        <div ref="wrap" class="book-view__wrap">
          <GrimoireBinding
            :compact="single"
            :chapter="currentChapter ? currentChapter.id : null"
            :chapters="chapterState"
            :progress="leaf"
            :flash="runeFlash"
            :aim="aimSide"
            :opening="opening"
            :ready="engineReady && !hold"
            :awake="anyaAwake"
            :title="BOOK_TITLE"
            :stage="stage"
            @opened="onOpened"
          />
        </div>
        <!-- Une page à la fois : la bande de la feuille tournée, à gauche de la reliure, ramène à la page d'avant -->
        <button v-if="single && currentKey !== 'toc' && !opening" type="button" class="book-view__back" aria-label="Page précédente" @click="goBack"></button>
        <div ref="hot" class="book-view__hot" role="region" aria-roledescription="page de livre" tabindex="0" :aria-label="pageLabel" :data-marked="ariane && currentKey === ariane.page ? 'oui' : null">
          <template v-for="spot in spots" :key="spot.id">
            <div v-if="spot.pulse" class="book-view__pulse" :style="spotStyle(spot)"></div>
            <button
              v-if="spot.action"
              type="button"
              class="book-view__spot"
              :data-spot="spot.id"
              :style="spotStyle(spot)"
              :aria-label="spot.label"
              @click="onSpot(spot)"
            ></button>
          </template>
        </div>
      </div>
      <p v-if="loadError" class="book-view__error" role="alert">
        Le Grimoire ne s’ouvre pas.
        <button type="button" class="book-view__retry" @click="load">Réessayer</button>
      </p>
    </div>

    <!-- Une seule ligne : le titre et un seul bouton ; recherche et filtres se déplient ensemble au toucher -->
    <div class="book-view__shelf-head">
      <span class="book-view__shelf-title">Tes éléments</span>
      <button
        type="button"
        :class="['book-view__tool', { 'is-on': showFilters, 'is-page': !query.trim() && activeFilter === 'page' }]"
        :aria-expanded="String(showFilters)"
        aria-label="Chercher et filtrer les éléments"
        @click="toggleFilters"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg>
        <span class="book-view__tool-label">{{ query.trim() ? `« ${query.trim()} »` : activeLabel }}</span>
        <span class="book-view__chevron" aria-hidden="true">▾</span>
      </button>
    </div>
    <div v-if="showFilters" class="book-view__filters" aria-label="Chercher et filtrer">
      <input
        ref="search"
        v-model="query"
        class="book-view__search"
        type="search"
        :placeholder="`Chercher parmi ${discoveredElements.length}…`"
        aria-label="Chercher un élément"
        @keydown.enter="showFilters = false"
        @keydown.esc="showFilters = false"
      />
      <button
        v-for="pill in filters"
        :key="pill.id"
        type="button"
        :aria-pressed="!query.trim() && activeFilter === pill.id"
        :class="['book-view__filter', { 'is-on': !query.trim() && activeFilter === pill.id, 'is-page': pill.id === 'page' }]"
        @click="pickFilter(pill.id)"
      ><ElementGlyph v-if="pill.glyph" :glyph="pill.glyph" /> {{ pill.label }} <span class="book-view__filter-count">{{ pill.count }}</span></button>
    </div>
    <div class="book-view__shelf" aria-label="Éléments connus">
      <ElementTile
        v-for="name in shelf"
        :key="name"
        :name="name"
        :data-name="name"
        :glyph="elementEmojis[name]"
        :family="familyOf[name]"
        :is-new="name === freshElement"
        :ink="name === pageHint"
        :data-next="name === nextPick ? 'oui' : null"
        :fertile="unexplored[name] || 0"
        :slot-index="picked.indexOf(name)"
        v-longpress="event => openInfo(name, event)"
        @click="$emit('select', name, $event.currentTarget.getBoundingClientRect())"
      />
      <p v-if="!shelf.length" class="book-view__empty">{{ query.trim() ? `Aucun élément ne ressemble à « ${query} ».` : 'Aucun élément dans cette famille.' }}</p>
    </div>

    <ChapterSheet
      v-if="showChapters"
      :title="BOOK_TITLE"
      :chapters="chapterState"
      :pages="sheetPages"
      :current="currentChapter ? currentChapter.id : null"
      :current-key="currentKey"
      :stars="stars"
      @go="index => { showChapters = false; goTo(index); }"
      @close="showChapters = false"
    />

    <HangmanSheet
      v-if="guess"
      :page="guess.page"
      :chapter="guess.chapter"
      :color="guess.style.color"
      :ink="guess.style.ink"
      :is-logged-in="isLoggedIn"
      :busy="guessBusy"
      :retry-price="RETRY_PRICE"
      :verdict="guess.verdict"
      :inscribed="guess.inscribed"
      @guess="onGuess"
      @retry="onRetry"
      @close="guess = null"
    />
    <!-- Fiche d'un élément (appui long sur sa tuile) : famille, chapitre, mélanges qu'il cache encore -->
    <GModal v-if="info" :eyebrow="info.family || 'Élément'" :title="info.name" align="center" :width="420" @close="info = null">
      <div class="book-view__info">
        <span class="book-view__info-glyph"><ElementGlyph :glyph="elementEmojis[info.name] || 'ui:unknown'" /></span>
        <p>Chapitre {{ info.chapter }} du Grimoire</p>
        <p v-if="info.fertile > 0">Il cache encore <strong>{{ info.fertile }}</strong> mélange{{ info.fertile > 1 ? 's' : '' }} inédit{{ info.fertile > 1 ? 's' : '' }}.</p>
        <p v-else>Tous ses mélanges sont découverts.</p>
        <p v-if="info.name === pageHint">L’Encre l’a révélé pour la page ouverte.</p>
      </div>
      <template #actions>
        <button type="button" class="book-view__info-btn" @click="selectInfo">Dans l’Athanor</button>
      </template>
    </GModal>
  </section>
</template>

<script>
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import ElementTile from '@/components/ui/ElementTile/ElementTile.vue';
import HangmanSheet from '../HangmanSheet/HangmanSheet.vue';
import ChapterSheet from '../ChapterSheet/ChapterSheet.vue';
import GrimoireBinding from '../GrimoireBinding/GrimoireBinding.vue';
import { BOOK_TITLE } from '@/book/chapters';
import * as storage from '@/utils/storage';
import { createBook } from '@/book/curlBook';
import { sideOf } from '@/book/spread';
import { paintPage, paintEndpaper, clearDrawings, bookFontsReady, CHAPTER_STYLE } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion, HAPTIC } from '@/utils/fx';
import { guide } from '@/game/guide';
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import longpress from '@/directives/longpress';
import { loadSavoirs } from '@/game/savoirs';
import shelf from './shelf';
import pages from './pages';
import effects from './effects';
import hangman from './hangman';

const INK_PRICE = 50;
const INK_KEY = 'oc_book_ink';
// Les deux pages côte à côte dès que le Livre a la place (largeur du composant, hauteur de la fenêtre) ;
// sinon (téléphone) la double page lue de près, une page à la fois
const SPREAD_MIN_WIDTH = 700;
const SPREAD_MIN_HEIGHT = 600;
// L'ouverture du grimoire ne se joue qu'une fois par visite
let openedOnce = false;
// Page où l'on était en quittant le Livre : on la retrouve au retour (la mémoire, elle, est libérée)
let lastKey = null;

// Le Livre : chapitres et pages du joueur (calculés par le serveur), tournés au doigt en WebGL.
// Le moteur et les pages peintes ne sont pas réactifs (propriétés d'instance) : seule la couche
// interactive (spots), l'en-tête et l'étagère passent par Vue.
export default {
  name: 'BookView',
  // L'étagère, les pages, les effets d'une découverte et le pendu vivent chacun dans leur fichier, à côté (mixins) ;
  // le Livre garde ce qui les relie : le chargement, le moteur, la navigation, l'Encre, le cycle de vie
  mixins: [shelf, pages, effects, hangman],
  components: { ElementTile, HangmanSheet, ChapterSheet, GrimoireBinding, GModal, ElementGlyph },
  directives: { longpress },
  props: {
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false },
    freshElement: { type: String, default: null },
    // Familles des éléments connus ({ famille: [noms] }, dans l'ordre du registre)
    categories: { type: Object, default: () => ({}) },
    // Mélanges encore inexplorés par élément ({ nom: nombre }, du serveur) ; absent = tout exploré
    unexplored: { type: Object, default: () => ({}) },
    // Éléments posés dans l'Athanor, dans l'ordre des emplacements
    picked: { type: Array, default: () => [] },
    // Révélation en cours dans l'Athanor : les effets du Livre attendent qu'elle se ferme
    revealing: { type: Boolean, default: false },
    // Venu de la quête de l'île : le Grimoire s'ouvre sur la page marquée du fil d'Ariane
    openMarked: { type: Boolean, default: false },
    // Venu d'un Savoir soufflé sur l'île : le Grimoire s'ouvre sur cette page (si elle est encore à trouver)
    openPage: { type: String, default: null },
    // Anya s'est révélée : la gemme de la couverture reste allumée (bible, § 6.14)
    anyaAwake: { type: Boolean, default: false },
    // Le tutoriel joue une scène : la couverture attend avant de s'ouvrir
    hold: { type: Boolean, default: false },
    // Grimoire nu du tutoriel : seuls ces éléments sur l'étagère (null : tous)
    only: { type: Array, default: null },
    // L'étape de civilisation, sous le titre de l'Ex libris (la garde au revers de la couverture)
    stage: { type: String, default: null }
  },
  emits: ['select', 'coins-updated', 'show-alert', 'aim', 'inscribed', 'seal', 'marked-opened', 'loaded'],
  data() {
    return {
      spots: [],
      BOOK_TITLE,
      showChapters: false,
      // Pages de chaque chapitre pour la feuille, figées à son ouverture
      sheetPages: {},
      pageLabel: BOOK_TITLE,
      stars: 0,
      // Le fil d'Ariane de la quête active (serveur) : { target, remaining, page, chapter } ou null
      ariane: null,
      currentKey: 'toc',
      // Les pages (non réactives) changent à chaque chargement : ce compteur fait suivre ce qui en dépend
      modelsVersion: 0,
      chapterState: [],
      loadError: false,
      // Grimoire : une page à la fois (téléphone), ouverture en cours, pages prêtes, avancée (tranches), éclat des
      // sigles, page visée sur la double page
      single: false,
      opening: false,
      engineReady: false,
      leaf: 0,
      runeFlash: 0,
      aimSide: null
    };
  },
  computed: {
    currentChapter() {
      const id = this.currentKey === 'toc' ? null : this.chapterOfKey(this.currentKey);
      return id ? this.chapterState.find(c => c.id === id) || null : null;
    },
    // Bouton « Sommaire » : dans un chapitre, la première feuille de sa table ; depuis cette feuille (ou la page
    // de titre du chapitre), le sommaire du Livre ; rien au sommaire même
    summaryJump() {
      if (this.modelsVersion < 0) return null;
      const key = this.currentKey;
      if (key === 'toc') return null;
      const id = this.chapterOfKey(key);
      const first = id ? this.models.findIndex(m => m.key === `idx-${id}-1`) : -1;
      if (first > 0 && key !== `idx-${id}-1` && key !== `ch-${id}`) return { index: first, label: `Revenir à la table du chapitre ${id}` };
      return { index: 0, label: 'Revenir au sommaire du Grimoire' };
    },
    // Couleurs de la puce : celles du chapitre ouvert, vélin au sommaire
    chipStyle() {
      const style = this.currentChapter ? CHAPTER_STYLE[this.currentChapter.id] : null;
      return style ? { '--rc': style.color, '--ri': style.ink } : { '--rc': '#FFFDF8', '--ri': '#4A3426' };
    }
  },
  watch: {
    // Le Grimoire nu commence ou finit : la page se redessine (l'Encre y paraît ou non)
    only() {
      if (this.engine) this.engine.refresh();
    },
    'discoveredElements.length'() {
      clearTimeout(this.reloadTimer);
      this.reloadTimer = setTimeout(() => this.load(), 120);
    },
    // L'équation d'une page à portée suit l'Athanor
    picked() {
      if (this.engine && this.models[this.engine.index]?.type === 'reach') this.engine.refresh();
    },
    revealing(now) {
      if (!now) this.flushEffects();
    },
    stage() {
      if (this.engine) this.engine.refresh();
    }
  },
  created() {
    // Non réactifs : moteur, modèles de pages, données brutes, encre révélée, Savoirs soufflés par les maîtres
    this.engine = null;
    this.models = [{ type: 'toc', key: 'toc', chapters: [], chapterIndex: {} }];
    this.bookData = null;
    this.revealed = storage.load(INK_KEY, {});
    this.savoirs = loadSavoirs();
    // Dernier verdict de chaque page visée : { tried, right, of, misses, need, freeInk }
    this.aims = {};
    this.aimedKey = null;
    this.pendingEffects = [];
    this.repaintRaf = 0;
    this.reloadTimer = 0;
    // Le Livre peut quitter l'écran pendant un chargement (changement d'onglet) : la réponse est alors ignorée
    this.gone = false;
    this.opening = !openedOnce && !reducedMotion();
    openedOnce = true;
    this.sizeObserver = null;
  },
  async mounted() {
    this.single = this.wantsSingle();
    this.sizeObserver = new ResizeObserver(() => this.checkMode());
    this.sizeObserver.observe(this.$el);
    // Les polices des pages arrivent : les pages déjà peintes sans elles sont repeintes
    bookFontsReady().then(() => {
      if (!this.gone && this.engine) this.engine.refresh();
    });
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    lastKey = this.currentKey;
    clearDrawings();
    if (this.sizeObserver) this.sizeObserver.disconnect();
    if (this.aimedKey) this.$emit('aim', null);
    clearTimeout(this.reloadTimer);
    cancelAnimationFrame(this.repaintRaf);
    if (this.engine) this.engine.destroy();
    this.engine = null;
  },
  methods: {
    spotStyle(spot) {
      return { left: `${spot.x}%`, top: `${spot.y * 0.75}%`, width: `${spot.w}%`, height: `${spot.h * 0.75}%` };
    },
    // Verdict d'un mélange visé sur cette page (transmis par l'Athanor)
    onAim(aim) {
      if (!this.bookData) return;
      const wasFree = this.models.find(m => m.key === aim.page)?.freeInk;
      this.aims = { ...this.aims, [aim.page]: aim };
      this.models = this.buildModels(this.bookData);
      this.modelsVersion++;
      if (this.engine) this.engine.refresh();
      if (aim.freeInk && !wasFree) {
        const slot = this.engine && this.engine.rectOf('ink');
        if (slot) {
          ring(center(slot), slot.width * 0.8);
          burst(center(slot), 14, 44);
        }
        vibrate([10, 30, 10]);
      }
    },
    assets() {
      const families = Object.fromEntries((this.bookData ? this.bookData.chapters : []).map(c => [c.id, c.families || []]));
      return {
        emojiOf: name => this.elementEmojis[name],
        onReady: () => this.scheduleRepaint(),
        inkPrice: INK_PRICE,
        // (le Grimoire nu du tutoriel : pas d'Encre sur la page)
        bare: Boolean(this.only),
        stars: this.stars,
        picked: this.picked,
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
        if (this.gone) return;
        console.error('Erreur lors du chargement du Livre:', error);
        this.loadError = !this.bookData;
        // Rien à ouvrir : le grimoire ne reste pas fermé sur l'erreur
        if (this.loadError) this.opening = false;
        return;
      }
      if (this.gone) return;
      const previous = this.bookData;
      const previousKey = this.engine ? this.models[this.engine.index]?.key : 'toc';
      this.bookData = data;
      this.stars = data.stars;
      this.ariane = data.ariane || null;
      this.models = this.buildModels(data);
      this.modelsVersion++;
      this.chapterState = data.chapters.map(c => ({
        id: c.id, name: c.name, open: c.open, found: c.found, total: c.total, need: c.need,
        index: this.models.findIndex(m => m.key === `ch-${c.id}`)
      }));
      if (!this.engine) {
        // Venu de l'île : la page d'un Savoir soufflé, ou celle que marque la quête ; sinon, retour sur la page qu'on
        // lisait (si elle existe encore)
        const wanted = this.openPage || (this.openMarked && data.ariane ? data.ariane.page : null);
        const marked = wanted ? this.models.findIndex(m => m.key === wanted) : -1;
        if (marked >= 0) this.$emit('marked-opened');
        this.mountEngine(marked >= 0 ? marked : Math.max(0, lastKey ? this.models.findIndex(m => m.key === lastKey) : 0));
        return;
      }
      // La page courante est retrouvée par son identifiant (des pages peuvent s'insérer avant elle)
      let index = this.models.findIndex(m => m.key === previousKey);
      if (index < 0) index = this.chapterState.find(c => c.id === this.chapterOfKey(previousKey))?.index ?? 0;
      if (index !== this.engine.index) this.engine.jump(index);
      else this.engine.refresh();
      if (previous) this.queueEffects(previous, data, previousKey);
      this.$emit('loaded');
    },
    wantsSingle() {
      return !(this.$el.clientWidth >= SPREAD_MIN_WIDTH && window.innerHeight >= SPREAD_MIN_HEIGHT);
    },
    // Passage une page ↔ deux pages : le moteur est refait, sur la même page
    checkMode() {
      const want = this.wantsSingle();
      if (want === this.single) return;
      if (!this.engine) {
        this.single = want;
        return;
      }
      const at = this.engine.index;
      this.engine.destroy();
      this.engine = null;
      this.opening = false;
      this.single = want;
      this.$nextTick(() => {
        if (!this.gone && !this.engine) this.mountEngine(at);
      });
    },
    // La couverture s'est posée : la page de gauche (la garde) apparaît
    onOpened() {
      this.opening = false;
      if (this.engine) this.engine.setClosed(false);
      guide.tip('welcome');
    },
    mountEngine(start = 0) {
      this.engine = createBook({
        stage: this.$refs.stage,
        rig: this.$refs.rig,
        wrap: this.$refs.wrap,
        hot: this.$refs.hot,
        start,
        spread: !this.single,
        count: () => this.models.length,
        // Hors du Livre (−1, count), les gardes marbrées ; une page de gauche se peint côté gauche (reliure à droite)
        paint: (index, ctx, w, h, side) => (index < 0 || index >= this.models.length
          ? paintEndpaper(ctx, w, h, side, index < 0, this.stage)
          : paintPage(this.models[index], index, ctx, w, h, this.assets(), side)),
        // Double page : la page visée par défaut, celle de gauche, sauf si seule la droite attend un mélange
        pickSide: ({ left, right }) => {
          const reach = i => this.models[i]?.type === 'reach';
          return reach(right) && !reach(left) ? 'right' : 'left';
        },
        onChange: () => vibrate(8),
        onRest: (index, hotspots, label) => {
          const model = this.models[index];
          const key = model?.key || 'toc';
          // Nouvelle page : l'étagère revient au filtre automatique
          if (key !== this.currentKey) this.filter = 'auto';
          this.currentKey = key;
          this.spots = hotspots;
          this.pageLabel = label;
          this.leaf = this.models.length > 1 ? index / (this.models.length - 1) : 0;
          this.aimSide = !this.single && model && model.type === 'reach' ? sideOf(index) : null;
          this.pageClue = model && model.type === 'reach'
            ? { families: [...new Set(model.page.clue)], tray: model.page.tray || null, revealed: model.revealed || null, guided: Boolean(model.page.guidedInk), groups: model.page.groups || null }
            : null;
          // L'Athanor vise cette page : ses mélanges y reçoivent un verdict
          const aimed = model && model.type === 'reach' ? model.key : null;
          if (aimed) guide.tip('reach');
          if (aimed !== this.aimedKey) {
            this.aimedKey = aimed;
            this.$emit('aim', aimed);
          }
        }
      });
      if (this.opening) this.engine.setClosed(true);
      else guide.tip('welcome');
      this.engineReady = true;
    },
    openChapters() {
      const pages = {};
      this.models.forEach(model => {
        if (model.type === 'index') pages[model.chapter.id] = [...(pages[model.chapter.id] || []), ...model.entries];
      });
      this.sheetPages = pages;
      this.showChapters = true;
    },
    goTo(index) {
      if (this.engine && index >= 0) this.engine.go(index);
    },
    goBack() {
      if (this.engine) this.goTo(this.engine.index - 1);
    },
    // La première page à trouver d'un chapitre (le tutoriel y mène, sans dire laquelle c'est)
    openReach(chapterId) {
      this.goTo(this.models.findIndex(m => m.type === 'reach' && m.chapter.id === chapterId));
    },
    // La page marquée du fil d'Ariane
    goMarked() {
      if (this.ariane) this.goTo(this.models.findIndex(m => m.key === this.ariane.page));
    },
    async onSpot(spot) {
      if (spot.action === 'goto') {
        this.goTo(Number(spot.data));
        return;
      }
      if (spot.action === 'guess') {
        this.openGuess(spot.data);
        return;
      }
      if (spot.action === 'seal') {
        vibrate(HAPTIC.tap);
        this.$emit('seal');
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
        storage.save(INK_KEY, this.revealed);
        this.$emit('coins-updated', coins);
        this.models = this.buildModels(this.bookData);
        this.modelsVersion++;
        this.engine.refresh();
        this.filter = 'page';
        if (slot) burst(center(slot), 12, 40);
        vibrate(10);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’Encre n’a pas pu être utilisée.'));
      }
    }
  }
};
</script>

<style scoped src="./BookView.css"></style>

<style src="./BookView.global.css"></style>
