<template>
  <section class="world" aria-label="Le Monde">
    <header class="world__head">
      <div>
        <span class="world__eyebrow">Ton île</span>
        <span class="world__title">Le Monde</span>
      </div>
      <span v-if="state" class="world__phase" :title="`Sur ton île, c’est le moment : ${phaseLabel}`">{{ phaseGlyph }} {{ phaseLabel }}</span>
      <!-- Écus produits par l'île, à récolter (le solde reste dans l'en-tête) -->
      <button
        v-if="state && state.pending > 0"
        type="button"
        class="world__coins is-ready"
        :disabled="busy"
        :aria-label="`Récolter ${state.pending} écus`"
        @click="collect"
      >
        <span class="world__coin" aria-hidden="true"></span>+{{ state.pending }}<span class="world__coins-note">à récolter</span>
      </button>
    </header>

    <!-- Invité : l'île demande un compte (ses ressources et écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">Ton île t’attend.</p>
      <p class="world__guest-text">Crée un compte pour bâtir ton île : chantiers, récoltes et décorations y sont gardés pour toi.</p>
      <button type="button" class="world__btn" @click="$emit('login')">Se connecter · créer un compte</button>
    </div>

    <template v-else>
      <!-- Réserves de l'île et Récolte -->
      <div v-if="state" class="world__hud">
        <ul class="world__stock" aria-label="Réserves">
          <li v-for="r in RESOURCES" :key="r.id" class="world__res" :title="r.label">
            <span aria-hidden="true">{{ r.glyph }}</span><strong>{{ state.stock[r.id] }}</strong><span class="oc-sr-only">{{ r.label }}</span>
          </li>
        </ul>
        <button type="button" class="world__play" :disabled="busy || !state.charges.count" @click="startHarvest">
          <span class="world__play-label">Récolte</span>
          <span class="world__play-sub">{{ chargesText }}</span>
        </button>
      </div>

      <div ref="stage" class="world__stage">
        <canvas
          ref="canvas"
          class="world__canvas"
          role="img"
          :aria-label="canvasLabel"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onCancel"
          @wheel.prevent="onWheel"
        ></canvas>
        <div v-if="state" class="world__zoom">
          <button type="button" aria-label="Zoomer" @click="zoomBy(1.25)">+</button>
          <button type="button" aria-label="Dézoomer" @click="zoomBy(0.8)">−</button>
        </div>
        <p v-if="loadError" class="world__error" role="alert">
          L’île ne répond pas.
          <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
        </p>
        <p v-else-if="moving" class="world__banner" role="status">
          Touche une case libre pour y poser {{ moving }}.
          <button type="button" class="world__link" @click="moving = null">Annuler</button>
        </p>
        <p v-else-if="state && firstVisit" class="world__banner">Touche un chantier pour le bâtir, une case d’herbe pour décorer.</p>

        <!-- Décoration touchée : déplacer ou retirer -->
        <div v-if="selected && !moving" class="world__menu" :style="menuStyle" role="dialog" :aria-label="`${selected.element}`">
          <span class="world__menu-name">{{ selected.element }}</span>
          <button type="button" class="world__menu-btn" @click="startMove">Déplacer</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="removeSelected">Retirer</button>
        </div>
      </div>

      <p v-if="state" class="world__note">
        Bâtis tes chantiers avec les plans du Livre et les ressources de la Récolte. Tes décorations produisent {{ state.rate }} écu par heure.
      </p>
    </template>

    <!-- Fiche d'un chantier -->
    <transition name="world-sheet">
      <div v-if="site" class="world__sheet-backdrop" @click.self="site = null">
        <div class="world__sheet" role="dialog" :aria-label="site.name">
          <div class="world__sheet-head">
            <span class="world__sheet-title">
              <span aria-hidden="true">{{ lookOf(site) }}</span> {{ site.name }}
              <small v-if="site.maxLevel > 1 && site.level">niv. {{ site.level }}/{{ site.maxLevel }}</small>
            </span>
            <button type="button" class="world__link" @click="site = null">Fermer</button>
          </div>
          <p v-if="site.effect" class="world__site-effect">{{ site.effect }}</p>
          <template v-if="site.next">
            <p class="world__site-step">{{ site.level ? `Prochaine étape : ${site.next.name}` : 'À bâtir' }}</p>
            <ul class="world__needs">
              <li v-if="site.next.plan" :class="['world__need', site.next.planOwned ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="site.next.planEmoji || '📜'" /></span>
                <span>Plan : <strong>{{ site.next.plan }}</strong></span>
                <em>{{ site.next.planOwned ? 'trouvé' : 'à découvrir dans le Livre' }}</em>
              </li>
              <li v-for="(n, r) in site.next.cost" :key="r" :class="['world__need', state.stock[r] >= n ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true">{{ GLYPH[r] }}</span>
                <span><strong>{{ state.stock[r] }}</strong> / {{ n }} {{ LABEL[r] }}</span>
              </li>
            </ul>
            <p class="world__site-next">{{ site.next.effect }}</p>
            <div class="world__sheet-actions">
              <button type="button" class="world__btn" :disabled="!canBuild(site) || busy" @click="build(site)">
                {{ site.level ? `Bâtir : ${site.next.name}` : 'Bâtir' }}
              </button>
              <button v-if="!affordable(site) && state.charges.count" type="button" class="world__btn world__btn--quiet" :disabled="busy" @click="startHarvest">
                Jouer une Récolte
              </button>
            </div>
          </template>
          <p v-else class="world__site-step">Chantier achevé.</p>
        </div>
      </div>
    </transition>

    <!-- Choix de la décoration à poser -->
    <transition name="world-sheet">
      <div v-if="picking" class="world__sheet-backdrop" @click.self="picking = null">
        <div class="world__sheet" role="dialog" aria-label="Choisir une décoration">
          <div class="world__sheet-head">
            <span class="world__sheet-title">Décorer</span>
            <button type="button" class="world__link" @click="picking = null">Fermer</button>
          </div>
          <input v-model="query" class="world__search" type="search" :placeholder="`Chercher parmi ${available.length}…`" aria-label="Chercher un élément" />
          <div class="world__grid">
            <ElementTile
              v-for="name in pickList"
              :key="name"
              :name="name"
              :glyph="elementEmojis[name]"
              :family="familyOf[name]"
              :aria-label="`Poser ${name}`"
              @click="place(name, picking.x, picking.y)"
            />
            <p v-if="!pickList.length" class="world__empty">{{ available.length ? 'Aucun élément ne ressemble à cette recherche.' : 'Toutes tes découvertes sont déjà sur l’île.' }}</p>
          </div>
        </div>
      </div>
    </transition>

    <HarvestGame
      v-if="run"
      :run="run"
      :sending="sending"
      :result="runResult"
      :error="runError"
      @finish="finishHarvest"
      @close="closeHarvest"
    />
  </section>
</template>

<script>
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import ElementTile from '@/components/ui/ElementTile.vue';
import { familyIndex } from '@/utils/eras';
import HarvestGame from './HarvestGame.vue';
import { search } from '@/utils/search';
import { glyph } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion } from '@/utils/fx';
import * as storage from '@/utils/storage';
import { GLYPH, LABEL, RESOURCES } from '@/game/resources';
import { BUILDINGS, NATURE, LIGHTS, SMOKE, flameFrames, boatSprite } from '@/world/sprites';
import { UPGRADES } from '@/world/buildings2';
import { NATURE2, CRITTERS, PLINTH } from '@/world/nature';
import { drawSprite } from '@/world/spriteCache';
import { P } from '@/world/iso';
import { phaseAt, forcedPhase, drawSea, drawCloudShadows, drawClouds, drawBirds, drawTint, glow, fireflies, hash } from '@/world/scene';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
const TW = 64; // largeur d'une case à l'échelle 1 (unités du monde)
const TH = TW / 2;
const DEPTH = 30;
const MAX_SCALE = 1.8;
// Allure des bâtiments construits, par niveau
const LOOK = { foyer: ['🔥', '🛖', '🏠'], carriere: ['⛏️'], bosquet: ['🌳'], puits: ['🪣'], potager: ['🥕'], atelier: ['🛠️'], ponton: ['⛵'] };
const SEEN_KEY = 'oc_world_seen';
// Construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève (ms)
const RAISE_MS = 2400;
const FLAMES = flameFrames();
// Ce qui plie au vent, et de combien
const SWAY = { bosquet: 0.03, tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08 };
// Tous les décors naturels (planches 1 et 2), et ce qui pousse où, avec sa fréquence cumulée
const ALL_NATURE = { ...NATURE, ...NATURE2 };
const BEACH_MIX = [['palm', 0.1], ['mossy', 0.15], ['shells', 0.2], ['driftwood', 0.23]];
const GRASS_MIX = [['tuft', 0.1], ['flowers', 0.16], ['bush', 0.185], ['mushrooms', 0.205], ['stump', 0.22], ['birch', 0.235], ['apple', 0.245], ['autumn', 0.255], ['reeds', 0.265], ['lily', 0.275], ['log', 0.285]];
// Chaque chantier a ses niveaux : ceux de la planche 1, puis le niveau 2 (prêt pour quand le serveur l'ouvrira)
const LOOKS = Object.fromEntries(Object.entries(BUILDINGS).map(([id, list]) => [id, UPGRADES[id] ? [...list, UPGRADES[id]] : list]));

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, décorations) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  components: { ElementGlyph, ElementTile, HarvestGame },
  props: {
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false },
    // Familles des éléments connus ({ famille: [noms] }) : teinte des tuiles
    categories: { type: Object, default: () => ({}) }
  },
  emits: ['coins-updated', 'show-alert', 'login'],
  data() {
    return {
      GLYPH, LABEL, RESOURCES,
      state: null,
      guest: false,
      loadError: false,
      busy: false,
      picking: null,
      selected: null,
      moving: null,
      site: null,
      query: '',
      menuPos: { x: 0, y: 0 },
      run: null,
      sending: false,
      runResult: null,
      runError: '',
      firstVisit: false,
      clock: Date.now(),
      phaseLabel: '',
      phaseGlyph: ''
    };
  },
  computed: {
    familyOf() {
      return familyIndex(this.categories);
    },
    placedNames() {
      return new Set(this.state ? this.state.tiles.map(t => t.element) : []);
    },
    available() {
      return [...this.discoveredElements].reverse().filter(name => !this.placedNames.has(name));
    },
    pickList() {
      return this.query.trim() ? search(this.available, this.query) : this.available;
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    },
    chargesText() {
      if (!this.state) return '';
      const { count, max, nextIn } = this.state.charges;
      if (count >= max || nextIn === null) return `${count}/${max} parties`;
      const minutes = Math.max(1, Math.ceil((nextIn - (this.clock - this.loadedAt)) / 60000));
      return `${count}/${max} · +1 dans ${minutes} min`;
    },
    canvasLabel() {
      if (!this.state) return 'Ton île';
      const built = this.state.sites.filter(s => s.level).map(s => s.name);
      const names = this.state.tiles.map(t => t.element);
      return `Ton île : ${built.join(', ')} bâtis${names.length ? ` ; décorations : ${names.join(', ')}` : ''}.`;
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    }
  },
  created() {
    // Non réactifs : géométrie, caméra, pointeurs, horloge, animations de pose
    this.geo = null;
    this.cam = null;
    this.pointers = new Map();
    this.gesture = null;
    this.raf = 0;
    this.lastFrame = 0;
    this.pops = new Map();
    // Bâtiments en train de s'élever : id → { at, from } ; décor naturel des cases libres
    this.raises = new Map();
    this.props = [];
    this.forced = forcedPhase();
    this.ac = null;
    this.observer = null;
    this.loadedAt = Date.now();
    this.tick = 0;
    // L'île peut quitter l'écran pendant un chargement (changement d'onglet) : la réponse est alors ignorée
    this.gone = false;
  },
  async mounted() {
    this.ac = new AbortController();
    document.addEventListener('visibilitychange', () => this.syncLoop(), { signal: this.ac.signal });
    this.syncPhase();
    this.tick = setInterval(() => {
      this.clock = Date.now();
      this.syncPhase();
      const charges = this.state && this.state.charges;
      if (charges && charges.nextIn !== null && this.clock - this.loadedAt > charges.nextIn + 2000 && !this.busy && !this.run) this.load();
    }, 20000);
    try {
      this.firstVisit = !storage.load(SEEN_KEY);
    } catch {
      this.firstVisit = false;
    }
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    clearInterval(this.tick);
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  },
  methods: {
    reduced() {
      return reducedMotion();
    },
    async load() {
      try {
        const state = await playService.world();
        if (this.gone) return;
        this.apply(state);
        this.guest = false;
        this.loadError = false;
      } catch (error) {
        if (this.gone) return;
        if ([401, 402].includes(error.response?.status)) {
          this.guest = true;
          this.state = null;
          return;
        }
        console.error('Erreur lors du chargement de l’île:', error);
        this.loadError = true;
      }
    },
    apply(state) {
      // Un niveau gagné depuis le dernier état : le bâtiment s'élève sous les yeux du joueur
      if (this.state && !this.reduced()) {
        const before = new Map(this.state.sites.map(site => [site.id, site.level]));
        state.sites.forEach(site => {
          const from = before.get(site.id);
          if (from !== undefined && site.level > from) this.raises.set(site.id, { at: performance.now(), from });
        });
      }
      this.props = this.natureOf(state);
      this.state = state;
      this.loadedAt = Date.now();
      this.clock = this.loadedAt;
      if (this.site) this.site = state.sites.find(s => s.id === this.site.id) || null;
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },
    lookOf(site) {
      const looks = LOOK[site.id] || ['🏗️'];
      return site.level ? looks[Math.min(site.level, looks.length) - 1] : '🚧';
    },
    syncPhase() {
      const phase = phaseAt(this.forced || new Date());
      this.phaseLabel = phase.label;
      this.phaseGlyph = phase.glyph;
    },
    // Décor naturel, fixe pour une île donnée : palmiers et rochers sur la plage, touffes et fleurs dans l'herbe.
    // Seulement sur les cases libres : une décoration posée le remplace, et il ne gêne aucun toucher.
    natureOf(state) {
      const n = state.size;
      const taken = new Set(state.tiles.map(t => t.y * n + t.x));
      state.sites.forEach(site => {
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) taken.add((site.y + dy) * n + site.x + dx);
      });
      const props = [];
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (taken.has(y * n + x)) continue;
          const beach = x === 0 || y === 0 || x === n - 1 || y === n - 1;
          const roll = hash(x, y);
          let kind;
          kind = ((beach ? BEACH_MIX : GRASS_MIX).find(([, upTo]) => roll < upTo) || [null])[0];
          if (kind) props.push({ kind, x, y, depth: x + y });
        }
      }
      return props;
    },
    // Chantier : 0 = plan à trouver, 1 = plan trouvé, 2 = tout est prêt
    stageOf(site) {
      if (!site.next || !site.next.planOwned) return 0;
      return this.affordable(site) ? 2 : 1;
    },
    // Vent : rafales lentes et frémissement, différents d'un point à l'autre de l'île
    windAt(t, x) {
      const gust = 0.55 + 0.45 * Math.sin(t * 0.21);
      return (Math.sin(t * 1.1 + x * 0.35) * 0.65 + Math.sin(t * 2.6 + x) * 0.25) * gust;
    },
    // Dessine un sprite ancré en (x, y) du monde, plié par le vent (cisaillement depuis sa base)
    swayed(ctx, key, make, x, y, skew, repaint) {
      if (!skew) {
        drawSprite(ctx, key, make, x, y, repaint);
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, -skew, 1, 0, 0);
      drawSprite(ctx, key, make, 0, 0, repaint);
      ctx.restore();
    },
    // Bouffées de poussière autour d'une emprise de chantier, k de 0 à 1
    dust(ctx, x, y, k, count = 9) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + hash(i, 3);
        const d = TW * (0.45 + 0.5 * k);
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * 0.5 - k * 14;
        const r = 7 + k * 16 * (0.6 + hash(i, 9));
        ctx.fillStyle = `rgba(214,190,150,${(0.55 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    affordable(site) {
      return Boolean(site.next) && Object.entries(site.next.cost).every(([r, n]) => this.state.stock[r] >= n);
    },
    canBuild(site) {
      return Boolean(site.next) && site.next.planOwned && this.affordable(site);
    },

    /* ---------- Géométrie et caméra ---------- */
    setup() {
      const stage = this.$refs.stage;
      const canvas = this.$refs.canvas;
      if (!stage || !canvas || !this.state) return;
      if (!this.observer) {
        this.observer = new ResizeObserver(() => {
          this.setup();
          this.draw(performance.now());
        });
        this.observer.observe(stage);
      }
      const width = stage.clientWidth;
      const height = Math.round(Math.min(Math.max(width * 1.1, 360), window.innerHeight * 0.62, 640));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      const n = this.state.size;
      const fit = Math.min(width / (n * TW + TW), height / (n * TH + DEPTH + TW * 1.6));
      this.geo = { width, height, dpr, n, minScale: Math.min(fit, 1) };
      // Première vue : le Foyer au centre, à taille confortable pour le pouce
      if (!this.cam) {
        const foyer = this.state.sites.find(s => s.id === 'foyer');
        const c = this.world(foyer ? foyer.x + 0.5 : n / 2, foyer ? foyer.y + 0.5 : n / 2);
        this.cam = { s: Math.max(this.geo.minScale, Math.min(1, width / (TW * 6.5))), x: c.x, y: c.y };
      }
      this.clampCam();
    },
    // Centre d'une case (ou d'un point fractionnaire) dans le monde
    world(x, y) {
      return { x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 };
    },
    toScreen(wx, wy) {
      const { s, x, y } = this.cam;
      return { x: (wx - x) * s + this.geo.width / 2, y: (wy - y) * s + this.geo.height / 2 };
    },
    toWorld(px, py) {
      const { s, x, y } = this.cam;
      return { x: (px - this.geo.width / 2) / s + x, y: (py - this.geo.height / 2) / s + y };
    },
    tileAt(px, py) {
      const w = this.toWorld(px, py);
      const a = w.x / (TW / 2);
      const b = w.y / (TH / 2);
      const x = Math.round((a + b) / 2);
      const y = Math.round((b - a) / 2);
      const n = this.state.size;
      return x >= 0 && y >= 0 && x < n && y < n ? { x, y } : null;
    },
    clampCam() {
      const n = this.state.size;
      const cam = this.cam;
      cam.s = Math.max(this.geo.minScale, Math.min(MAX_SCALE, cam.s));
      cam.x = Math.max(-(n * TW) / 2, Math.min((n * TW) / 2, cam.x));
      cam.y = Math.max(0, Math.min(n * TH, cam.y));
    },
    // Zoom autour d'un point de l'écran (le point du monde sous le doigt ne bouge pas)
    zoomAt(px, py, factor) {
      const before = this.toWorld(px, py);
      this.cam.s *= factor;
      this.clampCam();
      const after = this.toWorld(px, py);
      this.cam.x += before.x - after.x;
      this.cam.y += before.y - after.y;
      this.clampCam();
      this.draw(performance.now());
    },
    zoomBy(factor) {
      if (this.geo) this.zoomAt(this.geo.width / 2, this.geo.height / 2, factor);
    },

    /* ---------- Boucle et dessin ---------- */
    syncLoop() {
      const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run;
      if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
      if (!run && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },
    frame(now) {
      this.raf = 0;
      if (now - this.lastFrame >= FRAME_MS) {
        this.lastFrame = now;
        this.draw(now);
      }
      this.syncLoop();
    },
    diamond(ctx, cx, cy, w, h) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx + w / 2, cy);
      ctx.lineTo(cx, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy);
      ctx.closePath();
    },
    draw(now) {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.geo || !this.state || !this.cam) return;
      const ctx = canvas.getContext('2d');
      const { width, height, dpr, n } = this.geo;
      const { s } = this.cam;
      const t = this.reduced() ? 0 : now / 1000;
      const phase = phaseAt(this.forced || new Date());
      // Mer, selon l'heure
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSea(ctx, width, height, t, phase);
      // Monde : unités du monde, caméra appliquée
      const o = this.toScreen(0, 0);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
      const mid = this.world(n / 2 - 0.5, n / 2 - 0.5);
      // Ronds dans l'eau autour de l'île
      for (let k = 0; k < 3; k++) {
        const phase = (t * 0.12 + k / 3) % 1;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * (1 - phase)})`;
        ctx.lineWidth = 2 / s;
        ctx.beginPath();
        ctx.ellipse(mid.x, mid.y + DEPTH, (n * TW) * (0.58 + phase * 0.3), (n * TH) * (0.62 + phase * 0.3), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Écume au pied des falaises : une frange claire qui respire
      const foam = 0.35 + 0.25 * Math.sin(t * 1.6);
      ctx.strokeStyle = `rgba(255, 255, 255, ${foam.toFixed(3)})`;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const west = this.world(-0.5, n - 0.5);
      const south = this.world(n - 0.5, n - 0.5);
      const east = this.world(n - 0.5, -0.5);
      ctx.moveTo(west.x, west.y + DEPTH + 2 + Math.sin(t * 2) * 1.5);
      ctx.lineTo(south.x, south.y + DEPTH + 2 + Math.sin(t * 2 + 1) * 1.5);
      ctx.lineTo(east.x, east.y + DEPTH + 2 + Math.sin(t * 2 + 2) * 1.5);
      ctx.stroke();
      // Falaises (faces avant)
      const side = (x0, y0, x1, y1, color) => {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1, y1 + DEPTH);
        ctx.lineTo(x0, y0 + DEPTH);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      for (let i = 0; i < n; i++) {
        const left = this.world(i, n - 1);
        side(left.x - TW / 2, left.y, left.x, left.y + TH / 2, i % 2 ? '#9C6A3A' : '#A87444');
        const right = this.world(n - 1, i);
        side(right.x, right.y + TH / 2, right.x + TW / 2, right.y, i % 2 ? '#7E5229' : '#875A2F');
      }
      // Sol : plage sur le pourtour, herbe ailleurs, terre battue sous les chantiers
      const plots = new Map();
      for (const site of this.state.sites) {
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) plots.set((site.y + dy) * n + site.x + dx, site);
      }
      const occupied = new Set(this.state.tiles.map(tile => tile.y * n + tile.x));
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const c = this.world(x, y);
          const plot = plots.get(y * n + x);
          const beach = x === 0 || y === 0 || x === n - 1 || y === n - 1;
          this.diamond(ctx, c.x, c.y, TW, TH);
          if (plot) ctx.fillStyle = plot.level ? ((x + y) % 2 ? '#D9C49A' : '#E0CCA4') : ((x + y) % 2 ? '#B89468' : '#C09C70');
          else if (beach) ctx.fillStyle = (x + y) % 2 ? '#EBD49B' : '#F0DBA6';
          else ctx.fillStyle = (x + y) % 2 ? '#93CE70' : '#9ED67B';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, .16)';
          ctx.lineWidth = 1 / s;
          ctx.stroke();
          if (this.moving && !plot && !occupied.has(y * n + x)) {
            ctx.setLineDash([4 / s, 3 / s]);
            ctx.strokeStyle = 'rgba(255, 250, 220, .9)';
            ctx.lineWidth = 1.5 / s;
            ctx.stroke();
            ctx.setLineDash([]);
          }
          if ((this.selected && this.selected.x === x && this.selected.y === y) || (this.picking && this.picking.x === x && this.picking.y === y)) {
            ctx.strokeStyle = '#F2C04B';
            ctx.lineWidth = 2.5 / s;
            ctx.stroke();
          }
        }
      }
      // Contour des chantiers : pointillés à bâtir, doré quand tout est prêt
      for (const site of this.state.sites) {
        const c = this.world(site.x + 0.5, site.y + 0.5);
        this.diamond(ctx, c.x, c.y, TW * 2, TH * 2);
        const ready = this.canBuild(site);
        if (ready || !site.level) {
          ctx.setLineDash(ready ? [] : [6, 5]);
          ctx.strokeStyle = ready ? `rgba(245, 195, 68, ${0.6 + 0.4 * Math.sin(t * 3)})` : 'rgba(90, 60, 30, .55)';
          ctx.lineWidth = ready ? 3 : 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (this.site && this.site.id === site.id) {
          ctx.strokeStyle = '#F2C04B';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }
      }
      const worldTransform = ctx.getTransform();
      // Ombres des nuages qui glissent sur l'île (écran)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCloudShadows(ctx, width, height, t, phase);
      ctx.setTransform(worldTransform);
      // Ce qui se tient debout (bâtiments, décorations, nature), du plus loin au plus proche
      const standing = [
        ...this.state.sites.map(site => ({ depth: site.x + site.y + 2, site })),
        ...this.state.tiles.map(tile => ({ depth: tile.x + tile.y, tile })),
        ...this.props.map(prop => ({ depth: prop.depth, prop })),
        ...this.critters(t).map(critter => ({ depth: critter.x + critter.y, critter }))
      ].sort((p, q) => p.depth - q.depth);
      const repaint = () => this.draw(performance.now());
      for (const item of standing) {
        if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
        else if (item.tile) this.drawTile(ctx, item.tile, now, t, repaint);
        else if (item.prop) this.drawProp(ctx, item.prop, t, repaint);
        else this.drawCritter(ctx, item.critter, repaint);
      }
      this.drawSmoke(ctx, t, phase);
      // Ciel : nuages et mouettes (écran), puis la teinte de l'heure sur toute la scène
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawClouds(ctx, width, height, t, phase);
      drawBirds(ctx, width, height, t, phase);
      drawTint(ctx, width, height, phase);
      ctx.setTransform(worldTransform);
      this.drawLights(ctx, t, phase);
      // Les noms des lieux passent par-dessus tout : aucune décoration ne les cache
      if (this.cam.s >= 0.55) this.state.sites.forEach(site => this.drawLabel(ctx, site));
    },
    drawSite(ctx, site, t, now, repaint) {
      const c = this.world(site.x + 0.5, site.y + 0.5);
      const looks = LOOKS[site.id] || [BUILDINGS.chantier[2]];
      const raise = this.raises.get(site.id);
      const k = raise ? Math.min(1, (now - raise.at) / RAISE_MS) : 1;
      if (raise && k >= 1) this.raises.delete(site.id);
      if (!site.level) {
        // Chantier, dans sa phase ; tout prêt, un peu de poussière de temps en temps
        const stage = this.stageOf(site);
        drawSprite(ctx, `chantier-${stage}`, BUILDINGS.chantier[stage], c.x, c.y, repaint);
        if (stage === 2) {
          const puff = (t * 0.5) % 1;
          if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
        }
        if (site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
        return;
      }
      const level = Math.min(site.level, looks.length);
      const key = `${site.id}-${level}`;
      const make = looks[level - 1];
      if (k < 1) {
        // 1. L'ancien état tremble dans la poussière ; 2. le nouveau bâtiment s'élève depuis le sol ; 3. petit rebond
        const before = raise.from ? Math.min(raise.from, looks.length) : 0;
        const beforeKey = before ? `${site.id}-${before}` : 'chantier-2';
        const beforeMake = before ? looks[before - 1] : BUILDINGS.chantier[2];
        if (k < 0.35) {
          const shake = Math.sin(now / 28) * 1.6 * (1 - k / 0.35);
          drawSprite(ctx, beforeKey, beforeMake, c.x + shake, c.y, repaint);
        } else {
          const r = Math.min(1, (k - 0.35) / 0.5);
          const rise = 1 - Math.pow(1 - r, 3);
          const pop = k > 0.85 ? 1 + Math.sin(((k - 0.85) / 0.15) * Math.PI) * 0.05 : 1;
          ctx.save();
          // Le bâtiment sort de terre : découpé au ras du sol (bas de l'emprise), il monte de 96 px
          ctx.beginPath();
          ctx.rect(c.x - TW * 1.4, c.y - TW * 2.6, TW * 2.8, TW * 2.6 + TH * 1.05);
          ctx.clip();
          ctx.translate(c.x, c.y + (1 - rise) * 96);
          ctx.scale(pop, pop);
          drawSprite(ctx, key, make, 0, 0, repaint);
          ctx.restore();
        }
        this.dust(ctx, c.x, c.y + 6, k);
        return;
      }
      this.swayed(ctx, key, make, c.x, c.y, (SWAY[site.id] || 0) * this.windAt(t, site.x + site.y), repaint);
      // Parties vivantes : flamme du feu de camp, voilier bercé au Ponton
      if (site.id === 'foyer' && level === 1) {
        const frame = Math.floor(t * 9) % FLAMES.length;
        drawSprite(ctx, `flame-${frame}`, () => FLAMES[frame], c.x, c.y, repaint);
      }
      if (site.id === 'ponton') {
        const [bx, by] = P(0.05, 0.5, 0);
        ctx.save();
        ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
        ctx.rotate(Math.sin(t * 1.1) * 0.035);
        drawSprite(ctx, 'boat', boatSprite, -bx, -by, repaint);
        ctx.restore();
      }
    },
    drawProp(ctx, prop, t, repaint) {
      const c = this.world(prop.x, prop.y);
      this.swayed(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], c.x, c.y, (SWAY[prop.kind] || 0) * this.windAt(t, prop.x * 0.7 + prop.y), repaint);
    },
    // Petite vie de l'île, déterministe dans le temps : où est chaque animal, dans quelle image, de quel côté il regarde.
    // Poules autour du Foyer, papillons et abeilles sur les fleurs (le jour), grenouille aux nénuphars, poisson près de la côte.
    critters(t) {
      if (!this.state) return [];
      const phase = phaseAt(this.forced || new Date());
      const out = [];
      const foyer = this.state.sites.find(s => s.id === 'foyer');
      if (foyer) {
        for (let k = 0; k < 2; k++) {
          const a = t * 0.22 + k * 2.4;
          const x = foyer.x + 1 + Math.cos(a) * 1.55 + Math.sin(t * 0.9 + k) * 0.08;
          const y = foyer.y + 1 + Math.sin(a * 1.3) * 1.35;
          const pecking = Math.sin(t * 0.7 + k * 3) > 0.55;
          out.push({ kind: 'chicken', x, y, z: 0, frame: pecking && Math.sin(t * 9) > 0 ? 1 : 0, flip: Math.sin(a) > 0 });
        }
      }
      if (phase.night < 0.5) {
        const flowers = this.props.filter(p => p.kind === 'flowers' || p.kind === 'bush').slice(0, 4);
        flowers.forEach((p, k) => {
          const a = t * (0.6 + k * 0.1) + k;
          const kind = k % 2 ? 'bee' : 'butterfly';
          out.push({ kind, x: p.x + Math.cos(a) * 0.35, y: p.y + Math.sin(a * 1.4) * 0.3, z: 6 + Math.sin(t * 2 + k) * 3, frame: Math.floor(t * (kind === 'bee' ? 20 : 8) + k) % 2, flip: Math.cos(a) < 0 });
        });
      }
      const pond = this.props.find(p => p.kind === 'lily' || p.kind === 'reeds');
      if (pond) out.push({ kind: 'frog', x: pond.x + 0.12, y: pond.y + 0.1, z: 0, frame: (t % 4) < 0.35 ? 1 : 0, flip: false });
      // Poisson : un saut toutes les 7 s, à un endroit différent du rivage
      const cycle = Math.floor(t / 7);
      const into = (t % 7) / 7;
      if (into < 0.12) {
        const n = this.state.size;
        const side = hash(cycle, 1) < 0.5;
        const along = 1 + hash(cycle, 2) * (n - 2);
        out.push({ kind: 'fish', x: side ? n + 0.6 : along, y: side ? along : n + 0.6, z: 0, frame: into < 0.06 ? 0 : 1, flip: hash(cycle, 3) < 0.5 });
      }
      return out;
    },
    drawCritter(ctx, critter, repaint) {
      const c = this.world(critter.x, critter.y);
      ctx.save();
      ctx.translate(c.x, c.y - critter.z);
      if (critter.flip) ctx.scale(-1, 1);
      drawSprite(ctx, `${critter.kind}-${critter.frame}`, CRITTERS[critter.kind][critter.frame], 0, 0, repaint);
      ctx.restore();
    },
    // Fumée des cheminées : bouffées qui montent, grossissent, s'effacent et partent avec le vent
    drawSmoke(ctx, t, phase) {
      for (const site of this.state.sites) {
        const anchors = site.level && SMOKE[site.id];
        const at = anchors && anchors[Math.min(site.level, anchors.length) - 1];
        if (!at || this.raises.has(site.id)) continue;
        const c = this.world(site.x + 0.5, site.y + 0.5);
        const [sx, sy] = P(...at);
        for (let i = 0; i < 4; i++) {
          const k = (t * 0.32 + i / 4) % 1;
          const x = c.x + sx + k * 16 + this.windAt(t, i) * 4 * k;
          const y = c.y + sy - k * 46;
          const tone = phase.night > 0.5 ? '170,175,200' : '236,232,224';
          ctx.fillStyle = `rgba(${tone},${(0.5 * (1 - k)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, 3.5 + k * 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    // Lumières : fenêtres et feux s'allument au crépuscule ; lucioles la nuit
    drawLights(ctx, t, phase) {
      const lit = Math.min(1, phase.night * 1.1 + phase.warm * 0.45);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const site of this.state.sites) {
        const sets = site.level && LIGHTS[site.id];
        const lights = sets && sets[Math.min(site.level, sets.length) - 1];
        if (!lights || this.raises.has(site.id)) continue;
        const c = this.world(site.x + 0.5, site.y + 0.5);
        const fire = site.id === 'foyer' && site.level === 1;
        lights.forEach(([u, v, z, r], i) => {
          const [lx, ly] = P(u, v, z);
          const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + i) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + i);
          glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : lit) * flicker);
        });
      }
      if (phase.night > 0.35) {
        const strength = (phase.night - 0.35) / 0.65;
        for (const fly of fireflies(t, this.state.size)) {
          const p = this.world(fly.x, fly.y);
          glow(ctx, p.x, p.y - fly.z, 9, strength * fly.a, '255,236,140');
          ctx.fillStyle = `rgba(255,250,200,${(strength * fly.a).toFixed(3)})`;
          ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
        }
      }
      ctx.restore();
    },
    // Nom du lieu, lisible dès qu'on est assez près
    drawLabel(ctx, site) {
      const c = this.world(site.x + 0.5, site.y + 0.5);
      const k = 1 / Math.min(1, this.cam.s);
      ctx.font = `800 ${12 * k}px Nunito, system-ui, sans-serif`;
      const w = ctx.measureText(site.name).width + 14 * k;
      const h = 18 * k;
      const y = c.y + TH * 0.62;
      ctx.fillStyle = site.level ? 'rgba(251, 246, 234, .92)' : 'rgba(74, 52, 38, .82)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(c.x - w / 2, y - h / 2, w, h, h / 2);
      else ctx.rect(c.x - w / 2, y - h / 2, w, h);
      ctx.fill();
      ctx.fillStyle = site.level ? '#4A3426' : '#FBF6EA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(site.name, c.x, y + 0.5);
      ctx.textBaseline = 'alphabetic';
    },
    drawTile(ctx, tile, now, t, repaint) {
      const c = this.world(tile.x, tile.y);
      const started = this.pops.get(tile.element);
      let scale = 1;
      if (started) {
        const k = Math.min(1, (now - started) / 450);
        const back = 1.7;
        scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(tile.element);
      }
      const bob = Math.sin(t * 1.6 + tile.x * 0.8 + tile.y * 1.3) * TW * 0.025;
      // Socle de pierre et de bois ; l'élément flotte au-dessus et respire
      drawSprite(ctx, 'plinth', PLINTH, c.x, c.y, repaint);
      ctx.fillStyle = '#000';
      glyph(ctx, tile.emoji, c.x, c.y - TW * 0.42 + bob, TW * 0.56 * scale, repaint);
    },

    /* ---------- Gestes : glisser, pincer, toucher ---------- */
    point(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    onDown(event) {
      if (!this.state) return;
      this.$refs.canvas.setPointerCapture(event.pointerId);
      this.pointers.set(event.pointerId, this.point(event));
      if (this.pointers.size === 1) this.gesture = { start: this.point(event), moved: 0, at: performance.now() };
      else this.gesture = { pinch: this.pinchOf(), moved: Infinity };
    },
    pinchOf() {
      const [a, b] = [...this.pointers.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    },
    onMove(event) {
      if (!this.pointers.has(event.pointerId) || !this.gesture) return;
      const prev = this.pointers.get(event.pointerId);
      const p = this.point(event);
      this.pointers.set(event.pointerId, p);
      if (this.pointers.size >= 2 && this.gesture.pinch) {
        const next = this.pinchOf();
        const last = this.gesture.pinch;
        if (last.d > 0) this.zoomAt(next.mx, next.my, next.d / last.d);
        this.cam.x -= (next.mx - last.mx) / this.cam.s;
        this.cam.y -= (next.my - last.my) / this.cam.s;
        this.clampCam();
        this.gesture.pinch = next;
        this.draw(performance.now());
        return;
      }
      this.gesture.moved = Math.max(this.gesture.moved, Math.hypot(p.x - this.gesture.start.x, p.y - this.gesture.start.y));
      if (this.gesture.moved > 8) {
        this.selected = null;
        this.cam.x -= (p.x - prev.x) / this.cam.s;
        this.cam.y -= (p.y - prev.y) / this.cam.s;
        this.clampCam();
        this.draw(performance.now());
      }
    },
    onCancel(event) {
      this.pointers.delete(event.pointerId);
      if (!this.pointers.size) this.gesture = null;
    },
    onUp(event) {
      const gesture = this.gesture;
      const p = this.point(event);
      this.pointers.delete(event.pointerId);
      if (this.pointers.size) {
        // Un doigt reste après un pincement : on reprend un glissement sans toucher
        const [rest] = [...this.pointers.values()];
        this.gesture = { start: rest, moved: Infinity };
        return;
      }
      this.gesture = null;
      if (!gesture || gesture.moved > 8 || this.busy) return;
      this.tap(p.x, p.y);
    },
    onWheel(event) {
      if (!this.geo) return;
      const p = this.point(event);
      this.zoomAt(p.x, p.y, event.deltaY < 0 ? 1.12 : 0.89);
    },
    // Ce qui est sous le doigt : bâtiment, décoration, puis case
    hitAt(px, py) {
      const w = this.toWorld(px, py);
      const candidates = [
        ...this.state.sites.map(site => ({ site, depth: site.x + site.y + 2, c: this.world(site.x + 0.5, site.y + 0.5), r: TW * 0.75, h: TW * 1.1 })),
        ...this.state.tiles.map(tile => ({ tile, depth: tile.x + tile.y, c: this.world(tile.x, tile.y), r: TW * 0.36, h: TW * 0.85 }))
      ].sort((p, q) => q.depth - p.depth);
      const hit = candidates.find(o => Math.abs(w.x - o.c.x) < o.r && w.y > o.c.y - o.h && w.y < o.c.y + TH * (o.site ? 1 : 0.2));
      if (hit) return hit;
      const tile = this.tileAt(px, py);
      if (!tile) return null;
      const site = this.state.sites.find(s => tile.x >= s.x && tile.x < s.x + 2 && tile.y >= s.y && tile.y < s.y + 2);
      return site ? { site } : { cell: tile };
    },
    tap(px, py) {
      this.markSeen();
      const hit = this.hitAt(px, py);
      if (this.moving) {
        const cell = hit && hit.cell;
        if (!cell) {
          this.$emit('show-alert', 'Choisis une case d’herbe libre.');
          return;
        }
        const name = this.moving;
        this.moving = null;
        this.place(name, cell.x, cell.y);
        return;
      }
      this.selected = null;
      if (!hit) {
        this.draw(performance.now());
        return;
      }
      if (hit.site) {
        this.site = hit.site;
        vibrate(6);
      } else if (hit.tile) {
        const c = this.world(hit.tile.x, hit.tile.y);
        const sp = this.toScreen(c.x, c.y);
        this.menuPos = { x: Math.max(80, Math.min(this.geo.width - 80, sp.x)), y: Math.max(8, sp.y - TW * this.cam.s * 1.05) };
        this.selected = hit.tile;
        vibrate(6);
      } else {
        this.query = '';
        this.picking = hit.cell;
      }
      this.draw(performance.now());
    },
    markSeen() {
      if (!this.firstVisit) return;
      this.firstVisit = false;
      try {
        storage.save(SEEN_KEY, 1);
      } catch {
        /* stockage indisponible : le conseil reviendra, sans gravité */
      }
    },
    screenRectOf(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const c = this.world(x, y);
      const sp = this.toScreen(c.x, c.y);
      return { left: rect.left + sp.x - 30, top: rect.top + sp.y - 40, width: 60, height: 60 };
    },

    /* ---------- Actions ---------- */
    async build(site) {
      this.busy = true;
      try {
        const { built, world } = await playService.worldBuild(site.id);
        this.apply(world);
        this.site = null;
        this.$nextTick(() => {
          const at = center(this.screenRectOf(site.x + 0.5, site.y + 0.5));
          ring(at, 120);
          burst(at, 26, 90);
          vibrate([14, 40, 20]);
        });
        this.$emit('show-alert', `Nouveau sur ton île : ${built}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le chantier n’a pas pu être bâti.'));
      } finally {
        this.busy = false;
      }
    },
    async startHarvest() {
      this.busy = true;
      try {
        this.site = null;
        this.runResult = null;
        this.runError = '';
        this.run = await playService.harvestStart();
        this.syncLoop();
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La Récolte n’a pas pu commencer.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    async finishHarvest(moves) {
      this.sending = true;
      try {
        const { gains, world } = await playService.harvestFinish(this.run.id, moves);
        this.runResult = gains;
        this.apply(world);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.runError = messageOf(error, 'Le serveur n’a pas pu peser ta récolte.');
        this.load();
      } finally {
        this.sending = false;
      }
    },
    closeHarvest() {
      this.run = null;
      this.syncLoop();
    },
    async place(name, x, y) {
      this.picking = null;
      this.busy = true;
      try {
        this.pops.set(name, performance.now());
        this.apply(await playService.worldPlace(name, x, y));
        this.$nextTick(() => {
          burst(center(this.screenRectOf(x, y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(name);
        this.$emit('show-alert', messageOf(error, 'L’objet n’a pas pu être posé.'));
      } finally {
        this.busy = false;
      }
    },
    startMove() {
      this.moving = this.selected.element;
      this.selected = null;
      this.draw(performance.now());
    },
    async removeSelected() {
      const tile = this.selected;
      this.selected = null;
      this.busy = true;
      try {
        this.apply(await playService.worldRemove(tile.x, tile.y));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’objet n’a pas pu être retiré.'));
      } finally {
        this.busy = false;
      }
    },
    async collect(event) {
      const button = event.currentTarget;
      this.busy = true;
      try {
        const { gained, coins, world } = await playService.worldCollect();
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (gained > 0) {
          const at = center(button.getBoundingClientRect());
          ring(at, 90);
          burst(at, 20, 70);
          vibrate([12, 40, 18]);
          this.$emit('show-alert', `+${gained} écu${gained > 1 ? 's' : ''} récoltés sur ton île.`);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La récolte d’écus n’a pas pu se faire.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped>
.world { position: relative; }
.world__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; padding: 4px 2px 8px; }
.world__eyebrow { display: block; font-family: var(--oc-font-mono); font-weight: 800; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-on-bg-faint); }
.world__phase {
  margin-left: auto; flex: none; min-height: 32px; padding: 4px 12px;
  display: inline-flex; align-items: center; gap: 6px;
  border-radius: 999px; background: var(--vellum-50); color: var(--ink-700);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--font-ui); font-weight: 800; font-size: 13px;
}
.world__title { display: block; font-family: var(--oc-font-display); font-weight: 700; font-size: 24px; line-height: 1.1; color: var(--oc-on-bg); }
.world__coins {
  flex: none; display: inline-flex; align-items: center; gap: 7px;
  min-height: 38px; padding: 6px 14px;
  border: 1px solid rgba(224, 182, 84, .3); border-radius: 999px;
  background: rgba(224, 182, 84, .08); color: var(--oc-text-faint);
  font-family: var(--font-ui); font-weight: 900; font-size: 15px;
  cursor: pointer;
}
.world__coins.is-ready { background: var(--gold-400); border-color: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600); animation: world-glow 2s ease-in-out infinite; }
.world__coins:disabled { cursor: default; }
.world__coins-note { font-size: 11px; font-weight: 800; letter-spacing: .02em; opacity: .8; }
@keyframes world-glow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.world__coin { width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5); }

.world__hud { display: flex; align-items: stretch; gap: 8px; margin-bottom: 8px; }
.world__stock { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.world__res {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  min-height: 46px; border-radius: 14px; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); font-size: 17px;
}
.world__res strong { font-size: 15px; font-weight: 900; font-variant-numeric: tabular-nums; }
.world__play {
  flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 108px; padding: 4px 12px; border: 0; border-radius: 16px;
  background: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600);
  font-family: var(--font-ui); cursor: pointer;
}
.world__play:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--gold-600); }
.world__play:disabled { background: #6E6253; color: #D8CCBA; box-shadow: none; cursor: default; }
.world__play-label { font-family: var(--font-display); font-size: 17px; font-weight: 700; line-height: 1.1; }
.world__play-sub { font-size: 11px; font-weight: 800; opacity: .85; white-space: nowrap; }

.world__stage { position: relative; border-radius: 22px; overflow: hidden; }
.world__canvas { display: block; width: 100%; touch-action: none; cursor: grab; }
.world__zoom { position: absolute; right: 10px; top: 10px; display: flex; flex-direction: column; gap: 6px; }
.world__zoom button {
  width: 38px; height: 38px; border: 0; border-radius: 12px;
  background: rgba(251, 246, 234, .92); color: var(--ink-900);
  font-size: 22px; font-weight: 900; line-height: 1; cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
}
.world__banner, .world__error {
  position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: max-content; max-width: 92%; margin: 0; padding: 8px 14px; border-radius: 14px;
  background: rgba(30, 22, 16, .82); color: #F6EEDD;
  font-family: var(--font-ui); font-size: 13px; font-weight: 700; text-align: center;
}
.world__link { margin-left: 6px; border: 0; background: none; color: #F2C04B; font: inherit; font-weight: 900; cursor: pointer; text-decoration: underline; }
.world__menu {
  position: absolute; transform: translate(-50%, -100%);
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; border-radius: 16px;
  background: var(--vellum-100); color: var(--ink-900);
  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);
  font-family: var(--font-ui);
  z-index: 2;
}
.world__menu-name { font-weight: 900; font-size: 13px; padding: 0 4px; white-space: nowrap; }
.world__menu-btn { min-height: 34px; padding: 4px 12px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font: inherit; font-weight: 800; font-size: 13px; cursor: pointer; }
.world__menu-btn--quiet { background: var(--vellum-200); color: var(--ink-500); }
.world__note { margin: 8px 2px 0; color: var(--oc-on-bg-faint); font-size: 13px; font-style: italic; }
.world__guest { padding: 28px 20px; border-radius: 22px; background: var(--vellum-100); color: var(--ink-900); text-align: center; font-family: var(--font-ui); }
.world__guest-title { margin: 0; font-family: var(--font-display); font-size: 26px; font-weight: 700; }
.world__guest-text { margin: 10px 0 18px; color: var(--ink-500); }
.world__btn { min-height: 46px; padding: 10px 22px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 15px; cursor: pointer; }
.world__btn:disabled { opacity: .45; cursor: default; }
.world__btn--small { min-height: 32px; padding: 4px 12px; font-size: 13px; margin-left: 6px; }
.world__btn--quiet { background: var(--vellum-200); color: var(--ink-900); }

.world__sheet-backdrop { position: fixed; inset: 0; z-index: 70; background: rgba(10, 8, 6, .55); display: flex; align-items: flex-end; justify-content: center; }
.world__sheet {
  width: min(100%, 560px); max-height: 74dvh; display: flex; flex-direction: column;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); overflow-y: auto;
}
.world__sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
.world__sheet-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; }
.world__sheet-title small { font-family: var(--font-ui); font-size: 12px; font-weight: 800; color: var(--ink-500); margin-left: 4px; }
.world__sheet .world__link { color: #8A5A1C; }
.world__site-effect { margin: 0 0 10px; padding: 8px 12px; border-radius: 12px; background: var(--vellum-200); font-weight: 700; }
.world__site-step { margin: 6px 0 8px; font-weight: 900; font-size: 15px; }
.world__site-next { margin: 8px 0 12px; color: var(--ink-500); font-style: italic; }
.world__needs { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.world__need { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 6px 12px; border-radius: 12px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); }
.world__need em { margin-left: auto; font-size: 12px; font-weight: 800; font-style: normal; }
.world__need.is-ok em, .world__need.is-ok strong { color: #4E8A3A; }
.world__need.is-missing em, .world__need.is-missing strong { color: #B0503A; }
.world__need-glyph { width: 28px; font-size: 22px; text-align: center; }
.world__sheet-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.world__search { width: 100%; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--vellum-300); background: var(--vellum-50); color: var(--ink-900); font: inherit; font-size: 15px; }
.world__grid { margin-top: 10px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 8px; padding-bottom: 6px; }
.world__empty { grid-column: 1 / -1; color: var(--ink-500); font-style: italic; text-align: center; }
.world-sheet-enter-active, .world-sheet-leave-active { transition: opacity .25s ease; }
.world-sheet-enter-active .world__sheet, .world-sheet-leave-active .world__sheet { transition: transform .3s cubic-bezier(.3, 1.2, .5, 1); }
.world-sheet-enter-from, .world-sheet-leave-to { opacity: 0; }
.world-sheet-enter-from .world__sheet, .world-sheet-leave-to .world__sheet { transform: translateY(100%); }
@media (prefers-reduced-motion: reduce) {
  .world__coins.is-ready { animation: none; }
}
</style>
