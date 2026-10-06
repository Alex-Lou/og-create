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
import ElementTile from '@/components/ui/ElementTile.vue';
import HangmanSheet from './HangmanSheet.vue';
import ChapterSheet from './ChapterSheet.vue';
import GrimoireBinding from './GrimoireBinding.vue';
import { BOOK_TITLE, chapterOfFamily } from '@/book/chapters';
import { search } from '@/utils/search';
import { familyIndex } from '@/utils/eras';
import * as storage from '@/utils/storage';
import { createBook } from '@/book/curlBook';
import { sideOf } from '@/book/spread';
import { paintPage, paintEndpaper, clearDrawings, bookFontsReady, CHAPTER_STYLE } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion, HAPTIC } from '@/utils/fx';
import { unlockCinematic } from '@/book/fx';
import { guide } from '@/game/guide';
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import longpress from '@/directives/longpress';
import { loadSavoirs } from '@/game/savoirs';

const INK_PRICE = 50;
// Rejouer un pendu perdu sans attendre le lendemain (le serveur fixe le prix : services/bookLetters.js)
const RETRY_PRICE = 20;
// Pages par feuille de table de chapitre (deux colonnes de 8)
const INDEX_SIZE = 16;
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
    // L'étape de civilisation, sous le titre de l'Ex libris (la garde au revers de la couverture)
    stage: { type: String, default: null }
  },
  emits: ['select', 'coins-updated', 'show-alert', 'aim', 'inscribed', 'seal', 'marked-opened', 'loaded'],
  data() {
    return {
      spots: [],
      // Pendu ouvert : { page, chapter, style, verdict, inscribed } ; une lettre envoyée attend le verdict du serveur
      guess: null,
      guessBusy: false,
      RETRY_PRICE,
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
      query: '',
      // Filtre de l'étagère : « auto » suit la page (familles de l'indice), sinon « all » ou une famille
      filter: 'auto',
      // Recherche et filtres, repliés par défaut sous la ligne « Tes éléments »
      showFilters: false,
      // Page à portée ouverte : familles de ses ingrédients et ingrédient révélé par l'Encre
      pageClue: null,
      loadError: false,
      // Grimoire : une page à la fois (téléphone), ouverture en cours, pages prêtes, avancée (tranches), éclat des
      // sigles, page visée sur la double page
      single: false,
      // Fiche d'un élément ouverte par un appui long : { name, family, chapter, fertile, rect }
      info: null,
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
    },
    familyOf() {
      return familyIndex(this.categories);
    },
    pageHint() {
      return this.pageClue ? this.pageClue.revealed : null;
    },
    // Ingrédients proposés pour la page : le plateau du serveur (bons ingrédients et leurres), sinon ses familles
    pageList() {
      if (!this.pageClue) return [];
      if (this.pageClue.tray) {
        const owned = new Set(this.discoveredElements);
        return this.pageClue.tray.filter(name => owned.has(name));
      }
      const wanted = new Set(this.pageClue.families);
      return [...this.discoveredElements].reverse().filter(name => wanted.has(this.familyOf[name]));
    },
    activeFilter() {
      if (this.filter !== 'auto') return this.filter;
      return this.pageClue ? 'page' : 'all';
    },
    filters() {
      const owned = this.discoveredElements;
      const counts = {};
      owned.forEach(name => {
        const family = this.familyOf[name];
        if (family) counts[family] = (counts[family] || 0) + 1;
      });
      const pills = [];
      if (this.pageClue) pills.push({ id: 'page', label: '✦ Pour cette page', count: this.pageList.length });
      pills.push({ id: 'all', label: 'Tout', count: owned.length });
      const fertile = owned.filter(name => this.unexplored[name] > 0).length;
      if (fertile) pills.push({ id: 'fertile', glyph: 'ui:sprout', label: 'Fertiles', count: fertile });
      Object.keys(this.categories).forEach(family => {
        if (counts[family]) pills.push({ id: family, label: family === 'Elements Fondamentaux' ? 'Éléments premiers' : family, count: counts[family] });
      });
      return pills;
    },
    // Libellé du bouton des filtres : le filtre en cours
    activeLabel() {
      return this.filters.find(pill => pill.id === this.activeFilter)?.label || 'Tout';
    },
    shelf() {
      const newestFirst = [...this.discoveredElements].reverse();
      if (this.query.trim()) return search(newestFirst, this.query);
      const active = this.activeFilter;
      if (active === 'all') return newestFirst;
      // Les plus prometteurs d'abord : ceux qui entrent dans le plus de mélanges inexplorés
      if (active === 'fertile') {
        return newestFirst.filter(name => this.unexplored[name] > 0).sort((a, b) => this.unexplored[b] - this.unexplored[a]);
      }
      if (active === 'page' && this.pageClue) {
        const list = this.pageList;
        // L'ingrédient révélé (encre ou offert) passe en tête
        const hint = this.pageClue.revealed;
        return hint && list.includes(hint) ? [hint, ...list.filter(n => n !== hint)] : list;
      }
      return newestFirst.filter(name => this.familyOf[name] === active);
    }
  },
  watch: {
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
    // Choisir un filtre efface la recherche et replie le panneau
    pickFilter(id) {
      this.filter = id;
      this.query = '';
      this.showFilters = false;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
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
        // Chapitre scellé : seule la page marquée du fil d'Ariane s'y ouvre
        if (!chapter.open) {
          chapter.pages.filter(page => page.marked).forEach(page => models.push(this.reachModel(chapter, page)));
          continue;
        }
        // Table du chapitre, sur autant de feuilles qu'il faut : pages à trouver d'abord, puis inscrites
        const listed = [...chapter.pages.filter(p => p.status !== 'found'), ...chapter.pages.filter(p => p.status === 'found')];
        const parts = Math.ceil(listed.length / INDEX_SIZE);
        for (let part = 0; part < parts; part++) {
          const entries = listed.slice(part * INDEX_SIZE, (part + 1) * INDEX_SIZE).map(page => ({ key: page.id, page, index: -1 }));
          models.push({ type: 'index', key: `idx-${chapter.id}-${part + 1}`, chapter, entries, part: part + 1, parts });
        }
        for (const page of chapter.pages) {
          models.push(page.status === 'found'
            ? { type: 'found', key: page.id, chapter, page }
            : this.reachModel(chapter, page));
        }
        if (chapter.far || chapter.sealed) models.push({ type: 'far', key: `far-${chapter.id}`, chapter, count: chapter.far, waiting: chapter.sealed || 0 });
      }
      // Chaque case d'une table connaît la page où elle mène
      const at = new Map(models.map((model, index) => [model.key, index]));
      models.forEach(model => {
        if (model.type === 'index') model.entries.forEach(entry => { entry.index = at.get(entry.key) ?? -1; });
      });
      return models;
    },
    reachModel(chapter, page) {
      const aim = this.aims[page.id] || null;
      const need = page.freeInkAfter;
      const freeInk = Boolean(aim && aim.freeInk) || (need > 0 && page.misses >= need);
      // Ingrédient révélé par l'Encre : retenu par le serveur (ink) ; l'appareil garde les achats d'avant
      const revealed = page.ink || this.revealed[page.id] || null;
      // Un premier essai sur la page (compté par le serveur, ou fait pendant la session) dévoile les familles
      const tried = Boolean(aim) || page.misses > 0;
      // Ce qu'un maître a soufflé sur la page : { who, ingredient } ou { who, family }
      const whisper = this.savoirs[page.id] || null;
      return { type: 'reach', key: page.id, chapter, page, revealed, aim, freeInk, tried, whisper };
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
    // Appui long sur une tuile : la fiche de l'élément (le toucher, lui, l'envoie dans l'Athanor)
    openInfo(name, event) {
      const family = this.familyOf[name] || '';
      const tile = event.target && event.target.closest ? event.target.closest('.tile') : null;
      this.info = { name, family: family.replace(/_/g, ' '), chapter: chapterOfFamily(family), fertile: this.unexplored[name] || 0, rect: tile ? tile.getBoundingClientRect() : null };
      vibrate(10);
    },
    selectInfo() {
      const { name, rect } = this.info;
      this.info = null;
      this.$emit('select', name, rect);
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
            ? { families: [...new Set(model.page.clue)], tray: model.page.tray || null, revealed: model.revealed || null }
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
        if (effect.kind === 'inscribed-here' || effect.kind === 'inscribed') this.runeFlash++;
        if (effect.kind === 'inscribed-here') {
          const rect = this.engine && this.engine.rectOf('vignette');
          if (rect) {
            ring(center(rect), rect.width * 1.5);
            burst(center(rect), 22, rect.width * 1.1);
          }
          vibrate([12, 40, 18]);
        } else if (effect.kind === 'inscribed') {
          // Page inscrite ailleurs : la puce de chapitre salue la découverte
          const chip = this.$refs.chapterChip;
          if (chip) {
            chip.classList.remove('is-ping');
            void chip.offsetWidth;
            chip.classList.add('is-ping');
            burst(center(chip.getBoundingClientRect()), 10, 36);
          }
        } else if (effect.kind === 'opened') {
          await unlockCinematic({ id: effect.chapter, name: effect.name }, CHAPTER_STYLE[effect.chapter].wax);
          guide.tip(`chapter-${effect.chapter}`);
          const index = this.chapterState.find(c => c.id === effect.chapter)?.index;
          if (this.engine && index > 0) await this.engine.go(index);
        }
      }
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
    },

    // ----- Pendu -----
    openGuess(id) {
      const model = this.models.find(m => m.type === 'reach' && m.key === id);
      if (!model || !model.page.hangman) return;
      this.guess = { page: { ...model.page }, chapter: { id: model.chapter.id, name: model.chapter.name }, style: CHAPTER_STYLE[model.chapter.id], verdict: null, inscribed: '' };
    },
    // Nouvel état d'un pendu (réponse du serveur) : la page peinte et la feuille ouverte suivent
    applyHangman(id, hangman) {
      const page = this.bookData && this.bookData.chapters.flatMap(c => c.pages).find(p => p.id === id);
      if (!page) return;
      page.hangman = hangman;
      this.models = this.buildModels(this.bookData);
      this.modelsVersion++;
      if (this.engine) this.engine.refresh();
      if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, page: { ...page } };
    },
    // Une lettre posée dans une case ; mot complet : le serveur inscrit l'élément (comme un mélange)
    async onGuess({ position, letter }) {
      if (!this.guess || this.guessBusy) return;
      const id = this.guess.page.id;
      this.guessBusy = true;
      try {
        const { hangman, verdict, inscribed } = await playService.letter(id, position, letter);
        this.applyHangman(id, hangman);
        if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, verdict: { position, letter, verdict } };
        if (inscribed) {
          if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, inscribed: inscribed.result };
          vibrate(HAPTIC.discovery);
          burst({ x: window.innerWidth / 2, y: window.innerHeight * 0.3 }, 22, 150);
          this.$emit('inscribed', inscribed);
        } else {
          vibrate(verdict === 'miss' ? HAPTIC.fail : HAPTIC.tap);
        }
      } catch (error) {
        // Partie perdue entre-temps : le serveur renvoie l'état à montrer
        if (error.response?.data?.hangman) this.applyHangman(id, error.response.data.hangman);
        else this.$emit('show-alert', messageOf(error, 'Cette lettre n’a pas pu être jouée.'));
      } finally {
        this.guessBusy = false;
      }
    },
    async onRetry() {
      if (!this.guess || this.guessBusy) return;
      const id = this.guess.page.id;
      this.guessBusy = true;
      try {
        const { hangman, coins } = await playService.retryLetters(id);
        this.applyHangman(id, hangman);
        this.$emit('coins-updated', coins);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Impossible de rejouer pour l’instant.'));
      } finally {
        this.guessBusy = false;
      }
    }
  }
};
</script>

<style scoped>
/* Le Livre : papier crème posé sur le bureau sombre du jeu */
.book-view {
  container-type: inline-size;
  --book-ink: var(--ink-900);
  --book-paper: var(--vellum-100);
  --book-radius: 20px;
  /* Le fil d'Ariane : le ruban rouge et son fond */
  --book-ribbon: #b8322a;
  --book-ribbon-wash: rgba(184, 50, 42, .12);
}
.book-view__head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
  padding: 2px 2px 6px;
}
.book-view__chapter {
  appearance: none; border: 0; cursor: pointer;
  min-width: 0; min-height: 44px; padding: 4px 14px 4px 5px;
  display: inline-flex; align-items: center; gap: 10px;
  border-radius: var(--r-pill);
  background: var(--rc); color: var(--ri);
  box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .12), 0 3px 0 rgba(var(--shade-rgb), .18);
  touch-action: manipulation; -webkit-tap-highlight-color: transparent;
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
.book-view__chapter:active { transform: translateY(2px); }
.book-view__chapter:focus-visible { outline: 3px solid var(--oc-gold); outline-offset: 2px; }
.book-view__chapter.is-ping { animation: book-ping .8s cubic-bezier(.3, 1.5, .55, 1) 2; }
.book-view__chapter-seal {
  flex: none; width: 34px; height: 34px; display: grid; place-items: center;
  border-radius: var(--r-round); background: var(--grimoire-paper); color: var(--ri);
  font-family: var(--oc-font-display); font-weight: 700; font-size: 14px;
}
.book-view__chapter-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--oc-font-display); font-weight: 700; font-size: 20px; line-height: 1.1; }
.book-view__ariane {
  display: flex; align-items: center; gap: 8px; margin: 2px auto 6px; padding: 6px 12px 6px 8px; border: 0; border-radius: var(--r-pill);
  background: var(--book-ribbon-wash); color: var(--oc-text); font: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
}
.book-view__ariane strong { font-weight: 900; }
.book-view__ariane-ribbon {
  width: 9px; height: 16px; background: var(--book-ribbon); box-shadow: inset 0 0 0 1px var(--oc-aim);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
}
.book-view__stars {
  appearance: none; border: 0; cursor: pointer;
  flex: none; min-height: 32px; padding: 4px 12px; border-radius: var(--r-pill);
  background: var(--vellum-50); color: var(--oc-gold);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--oc-font-mono); font-size: 14px; font-weight: 900;
}
.book-view__summary {
  appearance: none; border: 0; cursor: pointer;
  flex: none; width: 40px; height: 40px; border-radius: var(--r-round);
  display: grid; place-items: center; margin-left: auto;
  background: var(--vellum-50); color: var(--ink-900);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  touch-action: manipulation; -webkit-tap-highlight-color: transparent;
}
.book-view__summary:active { transform: translateY(2px); box-shadow: inset 0 0 0 1px var(--oc-line); }
.book-view__summary:focus-visible { outline: 3px solid var(--oc-gold); outline-offset: 2px; }
.book-view__stage { position: relative; }
/* Deux pages côte à côte : la reliure prend ~97 px en largeur (lanière à gauche, fermoir à droite), ~60 px en hauteur */
.book-view__stage.is-spread {
  --book-w: max(240px, min(calc((100cqw - 120px) / 2), calc((100dvh - 430px) * .75), 440px));
  height: calc(var(--book-w) * 4 / 3 + 60px);
}
.book-view__rig { position: absolute; inset: 0; }
/* La double page (le canvas du moteur s'y cale) ; la reliure s'étend autour, centrée avec elle */
.book-view__wrap {
  position: absolute; top: 20px;
  left: calc((100% - 2 * var(--book-w)) / 2 + 14px);
  width: calc(2 * var(--book-w));
  aspect-ratio: 3 / 2;
}
/* Téléphone : une page à la fois, aussi grande que la largeur le permet (plat et fermoir ~26 px à droite ; à gauche
   de la reliure, une bande de la feuille tournée) ; l'étagère des éléments suit dessous. La scène coupe la
   couverture qui s'ouvre vers la gauche, et la feuille posée à gauche s'efface vers le bord */
.book-view__stage.is-single {
  --book-w: max(min(240px, calc(100cqw - 60px)), min(calc(100cqw - 60px), calc((100dvh - 400px) * .75), 460px));
  height: calc(var(--book-w) * 4 / 3 + 48px);
  overflow-x: clip; overflow-y: visible;
}
/* PC étroit (l'Athanor à droite, pas de dock en bas) : moins de hauteur à réserver sous le livre */
@media (min-width: 860px) {
  .book-view__stage.is-single { --book-w: max(220px, min(calc(100cqw - 60px), calc((100dvh - 300px) * .75), 460px)); }
}
.book-view__stage.is-single .book-view__rig :deep(canvas.gl) {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 calc((100% - var(--book-w)) * .36));
  mask-image: linear-gradient(90deg, transparent 0, #000 calc((100% - var(--book-w)) * .36));
}
.book-view__back {
  position: absolute; z-index: 4; left: 0; top: 14px;
  width: calc((100% - var(--book-w)) / 2 - 3px); height: calc(var(--book-w) * 4 / 3);
  border: 0; padding: 0; background: transparent; cursor: pointer;
  touch-action: manipulation; -webkit-tap-highlight-color: transparent;
}
.book-view__back:focus-visible { outline: 3px solid rgba(var(--oc-aim-rgb), .9); outline-offset: -3px; }
.book-view__stage.is-single .book-view__wrap {
  top: 14px;
  left: calc((100% - var(--book-w)) / 2 - 3px);
  width: var(--book-w);
  aspect-ratio: 3 / 4;
}
/* Couches : reliure 1, pages 2, aura 3, zones interactives 4, couverture de l'ouverture 6 */
.book-view__rig :deep(canvas.gl) { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
.book-view__hot { position: absolute; z-index: 4; touch-action: pan-y; border-radius: var(--book-radius); outline: none; }
.book-view__stage.is-opening .book-view__hot { pointer-events: none; }
/* Pendant un tour, le liseré de la page visée s'efface */
.book-view__rig:has(.book-view__hot.is-turning) :deep(.grim__aim) { opacity: 0; }
.book-view__hot:focus-visible { box-shadow: 0 0 0 3px var(--oc-gold); }
.book-view__hot.is-turning > * { visibility: hidden; }
.book-view__spot { position: absolute; border: 0; padding: 0; background: transparent; border-radius: var(--r-tile); cursor: pointer; }
.book-view__spot:focus-visible { outline: 3px solid rgba(var(--oc-aim-rgb), .9); outline-offset: 2px; }
.book-view__pulse { position: absolute; border-radius: var(--r-round); pointer-events: none; animation: book-aura 2.4s ease-out infinite; }
@keyframes book-aura { 0% { box-shadow: 0 0 0 0 rgba(var(--oc-aim-rgb), .5); } 70%, 100% { box-shadow: 0 0 0 22px rgba(var(--oc-aim-rgb), 0); } }
@keyframes book-ping { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.book-view__error { position: absolute; inset: 30% 10% auto; text-align: center; color: var(--oc-on-bg); z-index: 4; }
.book-view__retry { margin-left: 8px; }

.book-view__shelf-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
.book-view__shelf-title { font-family: var(--oc-font-mono); font-weight: 800; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-on-bg-faint); }
.book-view__search {
  flex: 1 1 100%; min-width: 0; margin-bottom: 4px;
  padding: 8px 14px; border-radius: var(--r-pill);
  border: 0;
  background: var(--vellum-50); color: var(--ink-900);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
  font: inherit; font-size: 14px; font-weight: 700;
}
/* Panneau des filtres, déplié sous la ligne du titre */
.book-view__filters {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-top: 8px; padding: 10px;
  border-radius: var(--r-md);
  background: var(--vellum-100);
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--shadow-1);
  animation: book-unfold .2s var(--oc-ease-out);
}
@keyframes book-unfold { from { opacity: 0; transform: translateY(-4px); } }
.book-view__tool {
  flex: 0 1 auto; min-width: 0; max-width: 62%; height: 40px; padding: 0 12px;
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  border: 0; border-radius: var(--r-pill); cursor: pointer;
  background: var(--vellum-50); color: var(--ink-700);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--font-ui); font-size: 13px; font-weight: 800;
}
.book-view__tool-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.book-view__tool.is-page { color: var(--oc-gold); box-shadow: inset 0 0 0 2px var(--gold-300), 0 2px 0 var(--vellum-400); }
.book-view__tool.is-on { background: var(--gold-200); box-shadow: inset 0 0 0 1px var(--oc-accent-line), 0 2px 0 var(--gold-600); }
.book-view__chevron { display: inline-block; margin-left: 2px; font-size: 11px; transition: transform .2s ease; }
.book-view__tool[aria-expanded='true'] .book-view__chevron { transform: rotate(180deg); }
.book-view__filter {
  flex: none;
  min-height: 34px; padding: 4px 12px;
  border: 0; border-radius: var(--r-pill);
  background: var(--vellum-50); color: var(--ink-700);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--font-ui); font-size: 13px; font-weight: 800;
  cursor: pointer;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.book-view__filter.is-on { background: linear-gradient(180deg, var(--gold-300), var(--gold-500)); color: var(--ink-900); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 2px 0 var(--gold-600); }
.book-view__filter.is-page:not(.is-on) { color: var(--oc-gold); box-shadow: inset 0 0 0 2px var(--gold-300), 0 2px 0 var(--vellum-400); }
.book-view__filter-count { opacity: .6; font-weight: 700; margin-left: 2px; }
/* Grille verticale qui remplit exactement la largeur : aucune tuile coupée au bord */
.book-view__shelf {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(62px, 1fr));
  gap: 8px;
  margin-top: 10px; padding: 2px 2px 6px;
}
/* Fiche d'un élément */
.book-view__info { text-align: center; }
.book-view__info p { margin: 6px 0; }
.book-view__info-glyph { display: inline-grid; place-items: center; width: 72px; height: 72px; margin-bottom: 6px; border-radius: var(--r-round); background: var(--vellum-200); font-size: 40px; }
.book-view__info-btn {
  appearance: none; border: 0; cursor: pointer; min-height: 44px; padding: 8px 22px; border-radius: var(--r-pill);
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 15px;
}
.book-view__empty { grid-column: 1 / -1; margin: 8px 0; color: var(--oc-on-bg-faint); font-style: italic; }

@media (prefers-reduced-motion: reduce) {
  .book-view__pulse, .book-view__chapter.is-ping { animation: none; }
}
</style>

<style>
/* Polices de l'intérieur du Grimoire (pages peintes en canvas : book/painter.js), hébergées avec le jeu pour
   s'afficher hors ligne ; licence : src/assets/fonts/OFL.txt */
@font-face { font-family: 'IM Fell English'; font-style: normal; font-weight: 400; font-display: swap; src: url('@/assets/fonts/im-fell-english.woff2') format('woff2'); }
@font-face { font-family: 'IM Fell English'; font-style: italic; font-weight: 400; font-display: swap; src: url('@/assets/fonts/im-fell-english-italic.woff2') format('woff2'); }
@font-face { font-family: 'IM Fell English SC'; font-style: normal; font-weight: 400; font-display: swap; src: url('@/assets/fonts/im-fell-english-sc.woff2') format('woff2'); }
@font-face { font-family: 'UnifrakturMaguntia'; font-style: normal; font-weight: 400; font-display: swap; src: url('@/assets/fonts/unifraktur-maguntia.woff2') format('woff2'); }

/* Cinématique d'ouverture de chapitre (montée hors du composant, dans body) */
.book-unlock {
  /* Ses jetons : le voile, les rayons (en canaux), l'or du sceau et de son bouton */
  --unlock-veil: radial-gradient(circle at 50% 42%, rgba(58, 38, 24, .82), rgba(24, 16, 10, .94));
  --unlock-ray-rgb: 255, 220, 150;
  --unlock-gold: #ffe2a6;
  --unlock-gold-edge: #c9933a;
  position: fixed; inset: 0; z-index: var(--z-unlock);
  display: grid; place-items: center; align-content: center; gap: 18px;
  background: var(--unlock-veil);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  color: var(--vellum-50); text-align: center;
  opacity: 0;
}
.book-unlock__rays {
  position: absolute; left: 50%; top: 42%; width: 140vmax; height: 140vmax;
  margin: -70vmax 0 0 -70vmax;
  background: repeating-conic-gradient(from 0deg, rgba(var(--unlock-ray-rgb), .16) 0 9deg, rgba(var(--unlock-ray-rgb), 0) 9deg 22deg);
  -webkit-mask: radial-gradient(circle, #000 0, transparent 45%);
  mask: radial-gradient(circle, #000 0, transparent 45%);
  animation: book-spin 14s linear infinite;
  opacity: 0;
}
@keyframes book-spin { to { transform: rotate(360deg); } }
.book-unlock__seal { position: relative; width: 150px; height: 150px; }
.book-unlock__seal img { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; }
.book-unlock__eyebrow { font-size: 12px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; color: var(--unlock-gold); opacity: 0; font-family: var(--font-ui); }
.book-unlock__name { font-family: var(--font-display); font-weight: 700; font-size: 34px; line-height: 1.05; opacity: 0; }
.book-unlock__go {
  margin-top: 6px; min-height: 48px; padding: 12px 26px;
  border: 0; border-radius: var(--r-pill);
  background: var(--unlock-gold); color: var(--ink-900);
  font-family: var(--font-ui); font-weight: 900; font-size: 16px;
  box-shadow: 0 6px 0 var(--unlock-gold-edge);
  cursor: pointer; opacity: 0;
}
</style>
