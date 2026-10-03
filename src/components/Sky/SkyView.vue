<template>
  <section
    ref="sky"
    class="sky"
    aria-label="Ciel du registre"
    @pointerdown="bgDown"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @wheel.prevent="wheel"
  >
    <div ref="dust" class="sky__dust" aria-hidden="true">
      <span v-for="d in dust" :key="d.k" class="sky__mote" :style="d.style"></span>
    </div>

    <div ref="world" class="sky__world" :style="{ width: `${sky.width}px`, height: `${sky.height}px` }">
      <div v-for="f in constellations" :key="`halo-${f.key}`" class="sky__halo" :style="f.halo" aria-hidden="true"></div>

      <svg class="sky__sockets" :width="sky.width" :height="sky.height" aria-hidden="true">
        <circle v-for="(s, i) in sky.sockets" :key="i" :cx="s.x" :cy="s.y" r="5" :fill="colorOf(s.key)" />
      </svg>

      <SkyLines :width="sky.width" :height="sky.height" :families="constellations" :positions="positions" :tether="tether" />

      <button
        v-for="f in constellations"
        :key="`nom-${f.key}`"
        type="button"
        class="sky__family"
        :style="f.labelStyle"
        @pointerdown.stop
        @click="focusFamily(f)"
      >
        <span class="sky__full">{{ f.label }}</span><span class="sky__short">{{ f.short }}</span> <i>{{ f.found.length }}/{{ f.total }}</i>
      </button>

      <SkyStar
        v-for="name in stars"
        :key="name"
        :name="name"
        :glyph="elementEmojis[name] || '✨'"
        :color="familyColorOf(name)"
        :pos="positions[name]"
        :hover="hover === name && drag?.name !== name"
        :dragging="drag?.name === name && drag.moved"
        :pulse="pulses[name] || null"
        :lit="lit.has(name)"
        @down="starDown"
        @key="pick"
      />

      <template v-if="fx">
        <span :key="`onde-${fx.n}`" class="sky__wave" :style="fx.wave" aria-hidden="true"></span>
        <span v-for="(p, i) in fx.sparks" :key="`etincelle-${fx.n}-${i}`" class="sky__spark" :style="p" aria-hidden="true"></span>
      </template>
    </div>

    <!-- Vue de loin : chaque constellation est un nuage à la taille du pouce ; un tap plonge dedans -->
    <transition name="clouds">
      <div v-if="far" class="sky__clouds" @pointerdown.stop @wheel.stop>
        <button
          v-for="f in constellations"
          :key="`nuage-${f.key}`"
          type="button"
          class="sky__cloud"
          :style="{ '--c': f.color }"
          @click="enterFamily(f)"
        >
          <span class="sky__cloud-inks" aria-hidden="true">
            <span v-for="name in f.found.slice(0, 3)" :key="name" class="g-ink"><ElementGlyph :glyph="elementEmojis[name] || '✨'" /></span>
          </span>
          <span class="sky__cloud-name">{{ f.short }}</span>
          <span class="sky__cloud-count">{{ f.found.length }} / {{ f.total }}</span>
        </button>
      </div>
    </transition>

    <p v-show="!searching" :key="msgKey" class="sky__msg g-italic" aria-live="polite">{{ message }}</p>

    <!-- Recherche : les étoiles qui répondent s'allument, le ciel vole vers la première -->
    <form v-if="searching" class="sky__search" @pointerdown.stop @submit.prevent="goFirst">
      <label class="sky__field">
        <span class="oc-sr-only">Chercher une étoile</span>
        <input ref="searchInput" v-model="query" type="text" placeholder="Nom d’un élément…" autocomplete="off" enterkeyhint="go" @keydown.esc="closeSearch" />
      </label>
      <button type="button" class="sky__close" aria-label="Fermer la recherche" @click="closeSearch">×</button>
      <div v-if="query.trim()" class="sky__results">
        <button v-for="name in results" :key="name" type="button" class="sky__result" @click="goTo(name)">
          <span class="g-ink" aria-hidden="true"><ElementGlyph :glyph="elementEmojis[name] || '✨'" /></span>{{ name }}
        </button>
        <span v-if="!results.length" class="g-italic sky__none">Aucune étoile ne porte ce nom.</span>
      </div>
    </form>

    <div class="sky__tools">
      <button type="button" class="g-btn sky__all" @pointerdown.stop @click="showAll">Constellations</button>
      <button type="button" class="sky__zoom" :aria-pressed="searching" aria-label="Chercher une étoile" @pointerdown.stop @click="openSearch">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg>
      </button>
      <button type="button" class="sky__zoom" aria-label="Éloigner" @pointerdown.stop @click="zoomBy(1 / 1.6)">−</button>
      <button type="button" class="sky__zoom" aria-label="Rapprocher" @pointerdown.stop @click="zoomBy(1.6)">+</button>
      <button type="button" class="sky__clue" @pointerdown.stop @click="$emit('hint')">Piste <i>{{ hintPrice }}</i></button>
    </div>
  </section>
</template>

<script>
import SkyStar from './SkyStar.vue';
import SkyLines from './SkyLines.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { search } from '@/utils/search';
import { columnsFor, layoutSky, nearestStar, shortName } from '@/utils/sky';
import { familyColor } from '@/utils/eras';
import { JOKER_PRICE } from '@/utils/hints';
import { vibrate, HAPTIC } from '@/utils/feedback';

// Places choisies par le joueur, relatives au centre de leur constellation (confort mémorisé sur l'appareil)
const PLACES_KEY = 'oc-sky-places';
function readPlaces() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLACES_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}
function savePlaces(places) {
  try {
    localStorage.setItem(PLACES_KEY, JSON.stringify(places));
  } catch {
    // Stockage indisponible : les places restent valables pour la session
  }
}

const MAX_ZOOM = 1.7;
const HUD = 62; // bas du ciel occupé par la rangée de boutons
// Sur un écran étroit, le dézoom s'arrête là où une étoile reste lisible et touchable (≈ 45 px) :
// en dessous, on passe à l'écran des nuages
const MIN_ZOOM_TOUCH = 0.7;
const NARROW = 700;
// Zoom de départ quand on plonge d'un nuage vers sa constellation (le ciel « s'approche »)
const DIVE_FROM = 0.3;
const LONG_PRESS_MS = 520;
const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6 + 0.2;
  const d = 70 + (i % 3) * 26;
  return [Math.cos(a) * d, Math.sin(a) * d];
});
const DUST = Array.from({ length: 80 }, (_, i) => {
  const size = 0.8 + (i % 4) * 0.5;
  return {
    k: i,
    style: `left: ${((i * 37.13) % 100).toFixed(2)}%; top: ${((i * 61.7) % 100).toFixed(2)}%; width: ${size}px; height: ${size}px; animation-duration: ${2.6 + (i % 5) * 0.7}s; animation-delay: ${(i % 9) * 0.35}s;`
  };
});
const rgb = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

// Ciel du registre (Infini) : les familles en constellations, les éléments en étoiles.
// Il ne connaît aucune recette : il désigne des éléments à l'Athanor, qui interroge le serveur.
export default {
  name: 'SkyView',
  components: { SkyStar, SkyLines, ElementGlyph },
  props: {
    categories: { type: Object, required: true },
    familyTotals: { type: Object, default: () => ({}) },
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    // Dernière découverte, à faire naître
    freshElement: { type: String, default: null },
    // Dernier mélange réussi ({ name, isNew, n }) et dernier échec ({ ingredients, n })
    lastSuccess: { type: Object, default: null },
    lastFail: { type: Object, default: null }
  },
  emits: ['select', 'pair', 'inspect', 'hint'],
  data() {
    return {
      positions: {},
      places: readPlaces(),
      drag: null,
      hover: null,
      pulses: {},
      fx: null,
      fxCount: 0,
      message: 'Glisse une étoile sur une autre · touche-la pour la poser dans l’Athanor',
      // Forme de la zone du ciel (largeur / hauteur utile), pour disposer les constellations
      aspect: 0.7,
      hintPrice: JOKER_PRICE,
      dust: DUST,
      // Vue lointaine (nuages) ; recherche ouverte ; étoiles allumées par la recherche
      far: false,
      msgKey: 0,
      searching: false,
      query: '',
      lit: new Set()
    };
  },
  computed: {
    discovered() {
      return new Set(this.discoveredElements);
    },
    // Familles où le joueur a déjà une étoile, dans l'ordre du registre
    familyList() {
      return Object.entries(this.categories)
        .map(([key, elements]) => ({ key, total: this.familyTotals[key] || elements.length, found: elements.filter(e => this.discovered.has(e)) }))
        .filter(f => f.found.length);
    },
    sky() {
      return layoutSky(this.familyList, columnsFor(this.familyList.length, this.aspect));
    },
    stars() {
      return this.familyList.flatMap(f => f.found);
    },
    familyOfStar() {
      return Object.fromEntries(this.familyList.flatMap(f => f.found.map(n => [n, f.key])));
    },
    constellations() {
      return this.sky.families.map(f => {
        const color = this.colorOf(f.key);
        const r = f.spread + 130;
        return {
          ...f,
          color,
          label: f.key,
          short: shortName(f.key),
          halo: `left: ${f.cx - r}px; top: ${f.cy - r}px; width: ${2 * r}px; height: ${2 * r}px; background: radial-gradient(circle, ${color.replace('rgb', 'rgba').replace(')', ', .2)')} 0%, ${color.replace('rgb', 'rgba').replace(')', ', .07)')} 48%, transparent 70%);`,
          // De loin, le nom grandit avec la constellation ; de près, il garde une taille fixe à l'écran
          labelStyle: `left: ${f.cx}px; top: ${f.cy - f.spread - 70}px; color: ${color}; --fmax: ${Math.round(28 + f.spread * 0.22)}px;`
        };
      });
    },
    results() {
      return search(this.stars, this.query).slice(0, 8);
    },
    tether() {
      const d = this.drag;
      if (!d || !d.moved) return null;
      return { name: d.name, x: d.ox, y: d.oy, self: this.hover === d.name };
    }
  },
  watch: {
    // Une nouvelle étoile prend sa place (ou celle que le joueur lui avait choisie)
    sky: {
      immediate: true,
      handler(next, previous) {
        this.placeStars();
        // Collection chargée ou ciel réorganisé : on recadre tant que le joueur n'a pas pris la main
        if (previous && !this.touched && (next.width !== previous.width || next.height !== previous.height)) {
          this.$nextTick(() => this.showStars(false));
        }
      }
    },
    freshElement(name) {
      if (!name) return;
      this.$nextTick(() => {
        this.pulse(name, 'born');
        this.burstAt(name);
        this.reveal(name, true);
      });
    },
    lastSuccess(value) {
      // Une découverte naît déjà (freshElement) : ici, seulement les éléments déjà connus
      if (!value || value.isNew) return;
      this.pulse(value.name, 'echo');
      this.reveal(value.name, false);
      this.message = `${value.name}, déjà dans ton ciel`;
    },
    // Pendant la frappe, les étoiles qui répondent s'allument (goTo garde ensuite la seule choisie)
    query(q) {
      if (this.searching) this.lit = new Set(q.trim() ? this.results : []);
    },
    // Chaque nouveau message réapparaît, puis s'efface de lui-même
    message() {
      this.msgKey += 1;
    },
    lastFail(value) {
      if (!value) return;
      value.ingredients.forEach(name => this.pulse(name, 'shake'));
      this.message = `${value.ingredients.join(' + ')} : le ciel reste muet`;
    }
  },
  created() {
    this.view = { s: 1, tx: 0, ty: 0 };
    this.pointers = new Map();
    this.timers = [];
    this.raf = 0;
  },
  mounted() {
    this.resize = () => this.fit();
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(this.$refs.sky);
    window.addEventListener('resize', this.resize);
    this.fit();
  },
  beforeUnmount() {
    this.observer?.disconnect();
    window.removeEventListener('resize', this.resize);
    this.timers.forEach(clearTimeout);
    cancelAnimationFrame(this.raf);
    clearTimeout(this.pressTimer);
  },
  methods: {
    colorOf(key) {
      return rgb(familyColor(key));
    },
    familyColorOf(name) {
      return this.colorOf(this.familyOfStar[name]);
    },
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    placeStars() {
      const centers = Object.fromEntries(this.sky.families.map(f => [f.key, f]));
      for (const name of this.stars) {
        const home = this.sky.home[name];
        const saved = this.places[name];
        const c = centers[saved?.[2]];
        const target = c ? { x: c.cx + saved[0], y: c.cy + saved[1] } : home;
        if (!this.positions[name]) this.positions[name] = { x: target.x, y: target.y, px: 0, py: 0 };
        else Object.assign(this.positions[name], { x: target.x, y: target.y });
      }
    },

    // ——— Vue : hauteur, zoom et déplacement (appliqués directement, sans redessiner les étoiles) ———
    fit() {
      const el = this.$refs.sky;
      if (!el) return;
      const root = document.getElementById('game-container') || document.documentElement;
      const overlay = parseFloat(getComputedStyle(root).getPropertyValue('--oc-overlay')) || 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const bottomPad = overlay ? 30 : 36;
      el.style.height = `${Math.max(380, window.innerHeight - top - overlay - bottomPad)}px`;
      this.size = { w: el.clientWidth, h: el.clientHeight };
      const aspect = Math.round((this.size.w / Math.max(1, this.size.h - HUD)) * 10) / 10;
      if (aspect !== this.aspect) this.aspect = aspect;
      if (this.touched) this.apply(this.view, false);
      else this.showStars(false);
    },
    narrow() {
      return (this.size?.w || 390) < NARROW;
    },
    // Le dézoom s'arrête là où les étoiles restent lisibles ; plus loin, c'est l'écran des nuages
    minZoom() {
      const { w, h } = this.size || { w: 390, h: 600 };
      const fit = Math.min(w / this.sky.width, (h - HUD) / this.sky.height) * 0.95;
      return this.narrow() ? MIN_ZOOM_TOUCH : Math.max(fit, 0.5);
    },
    starZoom() {
      return this.minZoom();
    },
    clamp(v) {
      const { w, h } = this.size || { w: 390, h: 600 };
      const s = Math.max(this.minZoom() * 0.9, Math.min(MAX_ZOOM, v.s));
      const W = this.sky.width * s;
      const H = this.sky.height * s;
      const m = 120;
      const tx = W < w ? (w - W) / 2 : Math.max(w - W - m, Math.min(m, v.tx));
      const ty = H < h - HUD ? (h - HUD - H) / 2 : Math.max(h - HUD - H - m, Math.min(m, v.ty));
      return { s, tx, ty };
    },
    apply(v, animate) {
      this.view = this.clamp(v);
      const { s, tx, ty } = this.view;
      const world = this.$refs.world;
      if (!world) return;
      world.style.transition = animate ? 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
      world.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      world.style.setProperty('--inv', (1 / s).toFixed(4));
      world.style.setProperty('--inv-line', (1 / Math.max(s, 0.45)).toFixed(4));
      world.style.setProperty('--names', s >= 0.42 ? '1' : '0');
      const dust = this.$refs.dust;
      if (dust) {
        dust.style.transition = world.style.transition;
        dust.style.transform = `translate3d(${(tx * 0.06).toFixed(1)}px, ${(ty * 0.06).toFixed(1)}px, 0)`;
      }
    },
    zoomAt(lx, ly, s, animate) {
      const v = this.view;
      const wx = (lx - v.tx) / v.s;
      const wy = (ly - v.ty) / v.s;
      const ns = Math.max(this.minZoom() * 0.9, Math.min(MAX_ZOOM, s));
      this.apply({ s: ns, tx: lx - wx * ns, ty: ly - wy * ns }, animate);
    },
    zoomBy(factor) {
      this.touched = true;
      // Dézoomer en butée ouvre les nuages
      if (factor < 1 && this.view.s <= this.minZoom() * 1.01) return this.showAll();
      const { w, h } = this.size;
      this.zoomAt(w / 2, (h - HUD) / 2, this.view.s * factor, true);
    },
    focusOn(x, y, s) {
      const { w, h } = this.size;
      const ns = Math.max(this.minZoom(), Math.min(MAX_ZOOM, s));
      this.apply({ s: ns, tx: w / 2 - x * ns, ty: (h - HUD) / 2 - y * ns }, true);
    },
    // Plonger dans une constellation : elle remplit l'écran si elle le peut, sinon on y navigue au doigt
    focusFamily(f) {
      this.touched = true;
      this.focusOn(f.cx, f.cy, Math.max(this.starZoom(), Math.min(1, ((this.size.h - HUD) * 0.8) / (2 * f.spread + 160))));
    },
    // Tap sur un nuage : les nuages s'effacent et le ciel s'approche de la constellation, étoiles lisibles
    enterFamily(f) {
      this.far = false;
      this.touched = true;
      const { w, h } = this.size;
      this.apply({ s: DIVE_FROM, tx: w / 2 - f.cx * DIVE_FROM, ty: (h - HUD) / 2 - f.cy * DIVE_FROM }, false);
      requestAnimationFrame(() => this.focusFamily(f));
    },
    openSearch() {
      this.searching = true;
      this.$nextTick(() => this.$refs.searchInput?.focus());
    },
    closeSearch() {
      this.searching = false;
      this.query = '';
    },
    // Résultat touché : le ciel vole vers l'étoile, qui reste allumée ; un tap sur elle la pose dans l'Athanor
    goTo(name) {
      const p = this.positions[name];
      if (!p) return;
      this.touched = true;
      this.far = false;
      this.lit = new Set([name]);
      this.searching = false;
      this.query = '';
      this.focusOn(p.x, p.y, Math.max(this.view.s, 0.9));
      this.pulse(name, 'echo');
      this.message = `${name} brille : touche-la pour la poser dans l’Athanor`;
    },
    goFirst() {
      if (this.results[0]) this.goTo(this.results[0]);
    },
    // Vue de loin : l'écran des nuages
    showAll() {
      this.closeSearch();
      this.far = true;
    },
    // Ouverture : cadrer les étoiles déjà allumées (les places vides ne doivent pas tout écraser)
    showStars(animate = false) {
      const pts = this.stars.map(n => this.positions[n]).filter(Boolean);
      if (!pts.length || !this.size) return this.showAll();
      const pad = 110;
      const x0 = Math.min(...pts.map(p => p.x)) - pad;
      const x1 = Math.max(...pts.map(p => p.x)) + pad;
      const y0 = Math.min(...pts.map(p => p.y)) - pad - 40;
      const y1 = Math.max(...pts.map(p => p.y)) + pad;
      const { w, h } = this.size;
      // Peu d'étoiles : on les montre de près ; beaucoup : on ouvre sur les nuages
      const fit = Math.min(1, w / (x1 - x0), (h - HUD) / (y1 - y0));
      if (fit < this.starZoom()) return this.showAll();
      this.apply({ s: fit, tx: w / 2 - ((x0 + x1) / 2) * fit, ty: (h - HUD) / 2 - ((y0 + y1) / 2) * fit }, animate);
    },
    // Montre une étoile si elle est hors de vue (ou de trop loin pour être lue)
    reveal(name, closer) {
      const p = this.positions[name];
      if (!p) return;
      if (this.far) {
        // Une étoile naît pendant qu'on survole les nuages : on plonge sur elle
        this.far = false;
        this.touched = true;
        return this.focusOn(p.x, p.y, Math.max(this.view.s, 0.9));
      }
      const { s, tx, ty } = this.view;
      const sx = tx + p.x * s;
      const sy = ty + p.y * s;
      const out = sx < 30 || sx > this.size.w - 30 || sy < 20 || sy > this.size.h - HUD - 10;
      if (out || (closer && s < 0.6)) this.later(() => this.focusOn(p.x, p.y, Math.max(s, 0.8)), closer ? 650 : 250);
    },
    local(e) {
      const r = this.$refs.sky.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    },
    stopInertia() {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    },

    // ——— Gestes ———
    bgDown(e) {
      this.stopInertia();
      const p = this.local(e);
      this.pointers.set(e.pointerId, p);
      this.$refs.sky.setPointerCapture?.(e.pointerId);
      if (this.pointers.size === 2) return this.startPinch();
      this.pan = { start: p, tx: this.view.tx, ty: this.view.ty, moved: false, hist: [{ ...p, t: performance.now() }] };
    },
    starDown(e, name) {
      e.stopPropagation();
      this.stopInertia();
      const p = this.local(e);
      this.pointers.set(e.pointerId, p);
      this.$refs.sky.setPointerCapture?.(e.pointerId);
      if (this.pointers.size === 2) return this.startPinch();
      const o = this.positions[name];
      this.drag = { name, start: p, ox: o.x, oy: o.y, moved: false, left: false, rect: e.currentTarget.getBoundingClientRect() };
      clearTimeout(this.pressTimer);
      this.pressTimer = setTimeout(() => {
        if (this.drag?.name === name && !this.drag.moved) {
          vibrate(HAPTIC.success);
          this.drag = null;
          this.$emit('inspect', name);
        }
      }, LONG_PRESS_MS);
    },
    startPinch() {
      this.touched = true;
      const [a, b] = [...this.pointers.values()];
      clearTimeout(this.pressTimer);
      this.pan = null;
      if (this.drag) this.cancelDrag();
      this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, view: { ...this.view } };
    },
    move(e) {
      if (!this.pointers.has(e.pointerId)) return;
      const p = this.local(e);
      this.pointers.set(e.pointerId, p);
      const v = this.view;
      if (this.pinch && this.pointers.size >= 2) {
        const [a, b] = [...this.pointers.values()];
        const v0 = this.pinch.view;
        const s = v0.s * Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const wx = (this.pinch.mid.x - v0.tx) / v0.s;
        const wy = (this.pinch.mid.y - v0.ty) / v0.s;
        // Pincer nettement sous la butée : au relâcher, on ressort vers les nuages
        this.pinch.below = s < this.minZoom() * 0.75;
        const ns = Math.max(this.minZoom() * 0.9, Math.min(MAX_ZOOM, s));
        return this.apply({ s: ns, tx: mid.x - wx * ns, ty: mid.y - wy * ns }, false);
      }
      const d = this.drag;
      if (d) {
        const dx = p.x - d.start.x;
        const dy = p.y - d.start.y;
        if (!d.moved && Math.hypot(dx, dy) < 7) return;
        if (!d.moved) {
          clearTimeout(this.pressTimer);
          d.moved = true;
        }
        const pos = this.positions[d.name];
        pos.x = d.ox + dx / v.s;
        pos.y = d.oy + dy / v.s;
        const fromHome = Math.hypot(pos.x - d.ox, pos.y - d.oy) * v.s;
        d.left = d.left || fromHome > 70;
        let target = nearestStar(this.positions, this.stars, pos.x, pos.y, 46 / v.s, d.name);
        // Revenir sur sa propre trace : l'étoile avec elle-même (Hydrogène + Hydrogène…)
        if (!target && d.left && fromHome < 34) target = d.name;
        if (target !== this.hover) {
          if (target) vibrate(HAPTIC.tap);
          this.hover = target;
        }
        // Aimant : près d'une cible, l'étoile se laisse attirer
        const t = target && target !== d.name ? this.positions[target] : null;
        pos.px = t ? (t.x - pos.x) * 0.35 : 0;
        pos.py = t ? (t.y - pos.y) * 0.35 : 0;
        return;
      }
      if (this.pan) {
        const dx = p.x - this.pan.start.x;
        const dy = p.y - this.pan.start.y;
        if (!this.pan.moved && Math.hypot(dx, dy) < 6) return;
        this.pan.moved = true;
        this.touched = true;
        this.pan.hist.push({ ...p, t: performance.now() });
        if (this.pan.hist.length > 5) this.pan.hist.shift();
        this.apply({ s: v.s, tx: this.pan.tx + dx, ty: this.pan.ty + dy }, false);
      }
    },
    up(e) {
      this.pointers.delete(e.pointerId);
      clearTimeout(this.pressTimer);
      if (this.pinch) {
        if (this.pointers.size < 2) {
          if (this.pinch.below) this.showAll();
          this.pinch = null;
        }
        return;
      }
      const d = this.drag;
      if (d) {
        this.drag = null;
        const target = this.hover;
        this.hover = null;
        const pos = this.positions[d.name];
        pos.px = 0;
        pos.py = 0;
        if (!d.moved) return this.pick(d.name, d.rect);
        if (target) return this.fusePair(d, target);
        return this.keepPlace(d.name);
      }
      if (this.pan) {
        const pan = this.pan;
        this.pan = null;
        if (pan.moved) return this.inertia(pan.hist);
        const p = this.local(e);
        const now = performance.now();
        if (this.lastTap && now - this.lastTap.t < 320 && Math.hypot(p.x - this.lastTap.x, p.y - this.lastTap.y) < 40) {
          this.lastTap = null;
          return this.zoomAt(p.x, p.y, this.view.s * 1.9, true);
        }
        this.lastTap = { ...p, t: now };
      }
    },
    inertia(hist) {
      if (hist.length < 2) return;
      const a = hist[0];
      const b = hist[hist.length - 1];
      const dt = Math.max(16, b.t - a.t);
      let vx = (b.x - a.x) / dt;
      let vy = (b.y - a.y) / dt;
      if (Math.hypot(vx, vy) < 0.25) return;
      let last = performance.now();
      const step = now => {
        const d = now - last;
        last = now;
        const before = this.view;
        this.apply({ s: before.s, tx: before.tx + vx * d, ty: before.ty + vy * d }, false);
        const f = Math.pow(0.93, d / 16);
        vx *= f;
        vy *= f;
        const stuck = this.view.tx === before.tx && this.view.ty === before.ty;
        this.raf = Math.hypot(vx, vy) > 0.02 && !stuck ? requestAnimationFrame(step) : 0;
      };
      this.raf = requestAnimationFrame(step);
    },
    wheel(e) {
      this.touched = true;
      this.stopInertia();
      const p = this.local(e);
      const s = this.view.s * Math.exp(-e.deltaY * 0.0016);
      if (s < this.minZoom() * 0.75) return this.showAll();
      this.zoomAt(p.x, p.y, s, false);
    },
    cancelDrag() {
      const d = this.drag;
      if (!d) return;
      Object.assign(this.positions[d.name], { x: d.ox, y: d.oy, px: 0, py: 0 });
      this.drag = null;
      this.hover = null;
    },

    // ——— Jeu ———
    pick(name, rect = null) {
      if (this.lit.has(name)) this.lit = new Set();
      vibrate(HAPTIC.tap);
      this.pulse(name, 'echo');
      this.$emit('select', name, rect);
    },
    // L'étoile glissée file vers sa partenaire, l'Athanor reçoit la paire, puis elle revient à sa place
    fusePair(d, target) {
      const pos = this.positions[d.name];
      if (target !== d.name) {
        const t = this.positions[target];
        Object.assign(pos, { x: t.x, y: t.y });
      }
      this.message = d.name === target ? `${d.name} + ${d.name}…` : `${d.name} + ${target}…`;
      this.$emit('pair', d.name, target, d.rect);
      this.later(() => Object.assign(pos, { x: d.ox, y: d.oy }), 320);
    },
    keepPlace(name) {
      const key = this.familyOfStar[name];
      const c = this.sky.families.find(f => f.key === key);
      const p = this.positions[name];
      if (!c) return;
      this.places = { ...this.places, [name]: [Math.round(p.x - c.cx), Math.round(p.y - c.cy), key] };
      savePlaces(this.places);
      this.message = `${name} prend place ailleurs dans le ciel`;
    },
    pulse(name, kind) {
      const n = (this.pulses[name]?.n || 0) + 1;
      this.pulses = { ...this.pulses, [name]: { kind, n } };
    },
    burstAt(name) {
      const p = this.positions[name];
      if (!p) return;
      const color = this.familyColorOf(name);
      this.fxCount += 1;
      this.fx = {
        n: this.fxCount,
        wave: `left: ${p.x - 60}px; top: ${p.y - 60}px; border-color: ${color}; box-shadow: 0 0 60px ${color}, inset 0 0 30px ${color};`,
        sparks: SPARKS.map(([dx, dy], i) => `left: ${p.x - 4}px; top: ${p.y - 4}px; background: ${i % 2 ? 'var(--oc-gold-strong)' : color}; box-shadow: 0 0 10px ${color}; --dx: ${dx.toFixed(0)}px; --dy: ${dy.toFixed(0)}px;`)
      };
      this.message = `${name} s’allume dans ${this.familyOfStar[name]} !`;
    }
  }
};
</script>

<style scoped>
.sky {
  position: relative;
  height: 600px;
  margin: 12px 0 16px;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  background: #07060a;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  contain: strict;
}
.sky__dust { position: absolute; inset: -40px; pointer-events: none; }
.sky__mote { position: absolute; border-radius: 50%; background: var(--oc-text); animation: twinkle 3s infinite; }
.sky__world { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
.sky__halo { position: absolute; border-radius: 50%; pointer-events: none; }
.sky__sockets { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
/* Places encore vides : de simples points pâles, pour deviner la taille de la constellation */
.sky__sockets circle { opacity: 0.28; }
.sky__family {
  appearance: none;
  position: absolute;
  padding: 0;
  white-space: nowrap;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: center;
  font-family: var(--oc-font-display);
  font-size: min(calc(15px * var(--inv, 1)), var(--fmax, 60px));
  letter-spacing: 0.06em;
  text-shadow: 0 0 calc(12px * var(--inv, 1)) #07060a;
  transform: translate(-50%, -100%);
}
.sky__short { display: none; }
.sky__family i { font-family: var(--oc-font-mono); font-style: normal; font-size: 0.66em; color: var(--oc-text-muted); }
.sky__wave {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid;
  pointer-events: none;
  opacity: 0;
  animation: wave 1s ease-out;
}
.sky__spark {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  animation: spark 0.85s cubic-bezier(0.1, 0.7, 0.3, 1);
}

/* Le message flotte au-dessus des boutons, puis s'efface de lui-même : il ne prend pas de place au jeu */
.sky__msg {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 70px;
  margin: 0;
  padding: 6px 10px;
  text-align: center;
  font-size: 15px;
  line-height: 1.3;
  color: var(--oc-text-muted);
  background: rgba(7, 6, 10, 0.78);
  pointer-events: none;
  animation: msg 6s ease-in forwards;
}
@keyframes msg { 0%, 75% { opacity: 1; } 100% { opacity: 0; } }
.sky__tools {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 6px;
  padding: 8px;
  background: linear-gradient(rgba(7, 6, 10, 0), #07060a 55%);
}
/* Nuages : la vue de loin. Des disques à la taille du pouce, posés sur le ciel */
.sky__clouds {
  position: absolute;
  inset: 0 0 62px;
  overflow-y: auto;
  padding: 26px 14px 84px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 26px 22px;
  background: rgba(7, 6, 10, 0.55);
  touch-action: pan-y;
}
.sky__cloud {
  appearance: none;
  flex: none;
  width: 98px;
  height: 98px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--oc-text-strong);
  background: radial-gradient(circle, color-mix(in srgb, var(--c) 36%, transparent) 0%, color-mix(in srgb, var(--c) 14%, transparent) 60%, transparent 72%);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 55%, transparent), 0 0 30px color-mix(in srgb, var(--c) 30%, transparent);
  transition: transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.sky__cloud:active { transform: scale(0.94); }
.sky__cloud:focus-visible { outline: 2px solid var(--oc-gold); outline-offset: 3px; }
.sky__cloud-inks { display: flex; gap: 3px; font-size: 17px; line-height: 1; filter: drop-shadow(0 0 3px #07060a); }
.sky__cloud-name { max-width: 96px; font-family: var(--oc-font-display); font-size: 13px; letter-spacing: 0.04em; color: var(--c); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sky__cloud-count { font-family: var(--oc-font-mono); font-size: 9px; color: var(--oc-text-muted); }
@media (min-width: 700px) {
  .sky__cloud { width: 136px; height: 136px; }
  .sky__cloud-inks { font-size: 22px; }
  .sky__cloud-name { max-width: 126px; font-size: 15px; }
}
.clouds-enter-active, .clouds-leave-active { transition: opacity 0.3s, transform 0.3s; }
.clouds-enter-from { opacity: 0; transform: scale(1.08); }
.clouds-leave-to { opacity: 0; transform: scale(0.92); }


/* Recherche */
.sky__search {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 62px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: rgba(19, 17, 27, 0.96);
  box-shadow: inset 0 0 0 1px var(--oc-accent-line), 0 12px 30px rgba(0, 0, 0, 0.6);
}
.sky__field { flex: 1; min-width: 0; display: flex; }
.sky__field input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 10px;
  border: 0;
  outline: none;
  font-family: var(--oc-font-italic);
  font-style: italic;
  font-size: 18px;
  color: var(--oc-text-strong);
  background: transparent;
  border-bottom: 1px solid var(--oc-accent-line);
}
.sky__close { appearance: none; width: 44px; height: 44px; border: 0; cursor: pointer; font-size: 24px; color: var(--oc-text-muted); background: none; }
.sky__results { flex-basis: 100%; display: flex; flex-wrap: wrap; gap: 6px; }
.sky__result {
  appearance: none;
  min-height: 40px;
  padding: 0 12px 0 8px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--oc-text-strong);
  background: rgba(233, 223, 200, 0.05);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
}
.sky__result .g-ink { font-size: 20px; line-height: 1; }
.sky__none { font-size: 14px; color: var(--oc-text-muted); }
.sky__all { flex: 1; min-width: 0; min-height: 46px; padding: 0 10px; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sky__zoom,
.sky__clue {
  appearance: none;
  min-width: 46px;
  min-height: 46px;
  border: 0;
  cursor: pointer;
  font-size: 22px;
  color: var(--oc-text-strong);
  background: rgba(7, 6, 10, 0.6);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
}
.sky__clue { padding: 0 12px; font-size: 14px; }
.sky__clue i { font-family: var(--oc-font-mono); font-style: normal; font-size: 9px; color: var(--oc-gold); }

@keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.85; } }
@keyframes wave { from { transform: scale(0.1); opacity: 1; } to { transform: scale(3.4); opacity: 0; } }
@keyframes spark {
  from { transform: translate(0, 0) scale(1); opacity: 1; }
  to { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sky__mote, .sky__wave, .sky__spark { animation: none; }
}
</style>
