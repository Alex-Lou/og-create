<template>
  <!-- (par-dessus toute l'île, sa barre d'onglets et Brume : monté dans body) -->
  <teleport to="body">
  <div class="bestiary" role="dialog" aria-modal="true" :aria-label="T.title" :style="vars" @keydown.esc.stop="$emit('close')">
    <header class="bestiary__head">
      <button type="button" class="bestiary__tool" :aria-label="T.toc" :title="T.toc" @click="goTo(0)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"></path><circle cx="3.5" cy="6" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="3.5" cy="12" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="3.5" cy="18" r="1.3" fill="currentColor" stroke="none"></circle></svg>
      </button>
      <span class="bestiary__count">{{ metMap.size }} / {{ creatures.length }}</span>
      <button ref="close" type="button" class="bestiary__tool" :aria-label="T.close" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>
      </button>
    </header>
    <div ref="stage" :class="['bestiary__stage', single ? 'is-single' : 'is-spread']">
      <div ref="rig" class="bestiary__rig">
        <div ref="wrap" class="bestiary__wrap">
          <!-- Reliure de cuir vert de naturaliste, coins de laiton ; les pages (le canvas du moteur) s'y posent -->
          <span class="bestiary__board" aria-hidden="true"><i v-for="k in 4" :key="k" :class="`bestiary__corner bestiary__corner--${k}`"></i></span>
          <span class="bestiary__ribbon" aria-hidden="true"></span>
        </div>
        <!-- Une page à la fois : la bande de la feuille tournée ramène à la page d'avant -->
        <button v-if="single && at > 0" type="button" class="bestiary__back" aria-label="Page précédente" @click="goTo(at - 1)"></button>
        <div ref="hot" class="bestiary__hot" role="region" aria-roledescription="page de livre" tabindex="0" :aria-label="pageLabel">
          <button
            v-for="spot in spots"
            :key="spot.id"
            type="button"
            class="bestiary__spot"
            :style="spotStyle(spot)"
            :aria-label="spot.label"
            @click="onSpot(spot)"
          ></button>
          <!-- Le tampon qui tombe sur une case (une créature rencontrée depuis la dernière ouverture) -->
          <canvas v-for="fall in falls" :key="fall.id" :ref="el => paintFall(el, fall)" class="bestiary__fall" :style="fall.style" @animationend="landed(fall)"></canvas>
        </div>
        <!-- La couverture qui s'ouvre (un toucher la passe) -->
        <div v-if="opening" class="bestiary__cover" @click="opened" @animationend="opened">
          <span class="bestiary__cover-title">{{ T.title }}</span>
        </div>
      </div>
    </div>
    <CreatureSheet v-if="sheet" :creature="sheet" :met="metMap.get(sheet.id) || null" :zones="zones" :elements="elements" :acts="acts" @close="sheet = null" />
  </div>
  </teleport>
</template>

<script>
import CreatureSheet from '../CreatureSheet/CreatureSheet.vue';
import { createBook } from '@/book/curlBook';
import { paintEndpaper, bookFontsReady } from '@/book/painter';
import { bestiaryPages, paintBestiaryPage, stamp, CELL, STAMP_AT } from '@/book/bestiaryPainter';
import { LEATHER_GRAIN, BRASS_CORNER } from '@/book/grimoire';
import { CREATURES, CATEGORIES } from '@/world/creatures';
import { creaturePortraitUrl } from '@/world/creatureArt';
import { BLANK } from '@/world/library';
import { BESTIARY as T } from '@/texts/world/creatures';
import { reducedMotion, vibrate } from '@/utils/fx';
import * as storage from '@/utils/storage';
import '@/components/Book/BookView/BookView.global.css';

// Les tampons déjà tombés sur cet appareil : ceux des créatures rencontrées depuis tombent à l'ouverture suivante
const STAMPED_KEY = 'oc_bestiaire_tampons';
// Double page à partir de cette place (comme le Grimoire)
const SPREAD_MIN_WIDTH = 900;
const SPREAD_MIN_HEIGHT = 640;
const SHORT_DATE = { day: 'numeric', month: 'short' };

// Le Bestiaire des animaux rencontrés (choix de l'auteur, 18 oct.) : un livre qui s'ouvre en plein écran depuis le
// Carnet d'explorateur, ses pages tournées comme celles du Grimoire (book/curlBook.js), peintes de sa main
// (book/bestiaryPainter.js) : le sommaire, une case par créature (son tampon une fois rencontrée), l'index. Une case
// touchée ouvre sa fiche (CreatureSheet). Les créatures rencontrées viennent du serveur (vue de l'île : animals).
export default {
  name: 'BestiaryBook',
  components: { CreatureSheet },
  props: {
    // [{ id, at }] (serveur : animals)
    met: { type: Array, default: () => [] },
    zones: { type: Array, required: true },
    elements: { type: Array, default: () => [] },
    acts: { type: Array, default: () => [] }
  },
  emits: ['close'],
  data() {
    const stamped = new Set(storage.load(STAMPED_KEY, []));
    const pending = reducedMotion() ? [] : this.met.map(m => m.id).filter(id => !stamped.has(id));
    return {
      T,
      creatures: CREATURES,
      single: true,
      at: 0,
      spots: [],
      pageLabel: '',
      opening: !reducedMotion(),
      sheet: null,
      falls: [],
      // (les tampons qui attendent de tomber : la page les peint sans eux)
      hidden: new Set(pending)
    };
  },
  computed: {
    metMap() {
      return new Map(this.met.map(m => [m.id, m.at]));
    },
    book() {
      return bestiaryPages(this.creatures, CATEGORIES, this.metMap);
    },
    // Les portraits (lus à la demande) : chacun arrivé, les pages sont repeintes
    portraits() {
      return this.creatures.map(creaturePortraitUrl);
    },
    vars() {
      return { '--grain': LEATHER_GRAIN, '--corner': BRASS_CORNER };
    }
  },
  watch: {
    portraits() {
      this.repaint();
    },
    met() {
      this.repaint();
    }
  },
  created() {
    this.images = new Map();
    this.engine = null;
    this.repaintRaf = 0;
  },
  mounted() {
    this.single = this.wantsSingle();
    this.sizeObserver = new ResizeObserver(() => this.checkMode());
    this.sizeObserver.observe(this.$refs.stage);
    bookFontsReady().then(() => this.repaint());
    // (une créature rencontrée depuis la dernière ouverture : le livre s'ouvre à sa page)
    const first = [...this.hidden][0];
    this.$nextTick(() => this.mountEngine(first ? this.book.pageOf.get(first) : 0));
    this.$refs.close.focus();
  },
  beforeUnmount() {
    if (this.sizeObserver) this.sizeObserver.disconnect();
    cancelAnimationFrame(this.repaintRaf);
    if (this.engine) this.engine.destroy();
    this.engine = null;
    this.saveStamped();
  },
  methods: {
    wantsSingle() {
      return !(window.innerWidth >= SPREAD_MIN_WIDTH && window.innerHeight >= SPREAD_MIN_HEIGHT);
    },
    // Passage une page ↔ deux pages : le moteur est refait, sur la même page
    checkMode() {
      const want = this.wantsSingle();
      if (want === this.single) return;
      const at = this.at;
      if (this.engine) this.engine.destroy();
      this.engine = null;
      this.single = want;
      this.$nextTick(() => this.mountEngine(at));
    },
    mountEngine(start) {
      const pages = () => this.book.pages;
      this.engine = createBook({
        stage: this.$refs.stage,
        rig: this.$refs.rig,
        wrap: this.$refs.wrap,
        hot: this.$refs.hot,
        start,
        spread: !this.single,
        count: () => pages().length,
        // (hors du livre, les gardes marbrées, sans l'ex-libris du Grimoire)
        paint: (index, ctx, w, h, side) => (index < 0 || index >= pages().length
          ? paintEndpaper(ctx, w, h, side, false)
          : paintBestiaryPage(pages()[index], index, ctx, w, h, this.assets(), side)),
        onChange: () => vibrate(8),
        onRest: (index, hotspots, label) => {
          this.at = index;
          this.spots = hotspots;
          this.pageLabel = label;
          if (!this.opening) this.dropStamps();
        }
      });
    },
    assets() {
      return {
        creatures: this.creatures,
        met: this.metMap,
        image: creature => this.imageOf(creature),
        hidden: this.hidden,
        pageOf: this.book.pageOf,
        indexPage: this.book.index,
        dateOf: at => new Date(at).toLocaleDateString('fr-FR', SHORT_DATE)
      };
    },
    // Le portrait d'une créature, prêt à peindre, ou null (il arrive : les pages seront repeintes)
    imageOf(creature) {
      const url = creaturePortraitUrl(creature);
      if (!url || url === BLANK) return null;
      let img = this.images.get(creature.id);
      if (!img || img.src !== url) {
        img = new Image();
        img.onload = () => this.repaint();
        img.src = url;
        this.images.set(creature.id, img);
      }
      return img.complete && img.naturalWidth ? img : null;
    },
    repaint() {
      if (this.repaintRaf) return;
      this.repaintRaf = requestAnimationFrame(() => {
        this.repaintRaf = 0;
        if (this.engine) this.engine.refresh();
      });
    },
    spotStyle(spot) {
      return { left: `${spot.x}%`, top: `${spot.y * 0.75}%`, width: `${spot.w}%`, height: `${spot.h * 0.75}%` };
    },
    goTo(index) {
      if (this.engine && index >= 0) this.engine.go(index);
    },
    onSpot(spot) {
      if (spot.action === 'goto') this.goTo(spot.data);
      else if (spot.action === 'creature') this.sheet = this.creatures.find(c => c.id === spot.data);
    },
    // La couverture s'est ouverte : les tampons de la page tombent
    opened() {
      if (!this.opening) return;
      this.opening = false;
      this.dropStamps();
    },
    // Les tampons qui attendent, sur la page en vue : ils tombent ; ceux des autres pages se posent simplement
    dropStamps() {
      if (!this.hidden.size) return;
      const shown = new Map(this.spots.filter(s => s.action === 'creature').map(s => [s.data, s]));
      for (const id of [...this.hidden]) {
        const spot = shown.get(id);
        if (!spot) {
          this.hidden.delete(id);
          continue;
        }
        if (this.falls.some(f => f.id === id)) continue;
        // (la case en u de la page : sur la double page, x et w en moitiés)
        const k = spot.w / CELL.w;
        const size = 16;
        this.falls.push({
          id, k, size,
          style: { left: `${spot.x + (STAMP_AT.dx - size / 2) * k}%`, top: `${(spot.y + STAMP_AT.dy - size / 2) * 0.75}%`, width: `${size * k}%`, height: `${size * 0.75}%` }
        });
      }
      this.repaint();
    },
    // Le tampon d'une case, de la même main que la page
    paintFall(el, fall) {
      if (!el || el.dataset.painted) return;
      el.dataset.painted = '1';
      const width = (this.$refs.hot.clientWidth * fall.size * fall.k) / 100;
      const dpr = window.devicePixelRatio || 1;
      el.width = el.height = Math.round(width * dpr);
      const u = ((width * dpr) / fall.size) * STAMP_AT.k;
      const creature = this.creatures.find(c => c.id === fall.id);
      stamp(el.getContext('2d'), u, fall.size / 2 / STAMP_AT.k, fall.size / 2 / STAMP_AT.k, new Date(this.metMap.get(fall.id)).toLocaleDateString('fr-FR', SHORT_DATE), creature.no);
    },
    // Le tampon est tombé : la page le peint, l'image de la chute s'en va
    landed(fall) {
      vibrate(14);
      this.hidden.delete(fall.id);
      this.falls = this.falls.filter(f => f !== fall);
      this.repaint();
    },
    saveStamped() {
      storage.save(STAMPED_KEY, this.met.map(m => m.id));
    }
  }
};
</script>

<style scoped src="./BestiaryBook.css"></style>
