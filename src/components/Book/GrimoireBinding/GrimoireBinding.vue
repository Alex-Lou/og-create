<template>
  <div class="grim" :class="{ 'is-compact': compact, 'is-closed': closed }" :style="vars" aria-hidden="true">
    <!-- Reliure du grimoire autour de la double page (le canvas du moteur). La racine ne crée pas de contexte
         d'empilement : chaque pièce choisit sa couche (1 : sous les pages ; 3 : aura ; 6 : couverture de l'ouverture) -->
    <span class="grim__glow"></span>
    <!-- Plats de cuir ; le gauche attend que la couverture se soit posée -->
    <span class="grim__board grim__board--left"><span class="grim__tool"></span></span>
    <span class="grim__board grim__board--right"><span class="grim__tool"></span></span>
    <span class="grim__corner grim__corner--tl grim__left"></span>
    <span class="grim__corner grim__corner--bl grim__left"></span>
    <span class="grim__corner grim__corner--tr"></span>
    <span class="grim__corner grim__corner--br"></span>
    <!-- Tranches dorées : pages déjà lues à gauche, pages à lire à droite -->
    <span class="grim__block grim__block--left grim__left"></span>
    <span class="grim__block grim__block--right"></span>
    <span class="grim__fold grim__fold--top"></span>
    <span class="grim__fold grim__fold--bottom"></span>
    <span class="grim__headband grim__headband--top"></span>
    <span class="grim__headband grim__headband--bottom"></span>
    <!-- Les sept sigles dorés au fer : allumés pour les chapitres ouverts, celui du chapitre ouvert pulse -->
    <span :class="['grim__runes', { 'is-flash': flashing }]">
      <span
        v-for="(rune, k) in runes"
        :key="rune.id"
        :class="['grim__rune', { 'is-open': rune.open, 'is-current': rune.id === chapter, 'is-ignite': rune.id === igniting }]"
        :style="{ '--k': k }"
      ><svg viewBox="0 0 24 24"><path :d="rune.d"></path></svg></span>
    </span>
    <span class="grim__strap grim__left"></span>
    <span class="grim__clasp"><span class="grim__gem"></span></span>
    <span class="grim__ribbon"><svg viewBox="0 0 12 40"><path d="M0 0H12V36L6 30.5L0 36Z"></path><path class="grim__ribbon-sheen" d="M3.4 0V31"></path></svg></span>
    <!-- Aura : lueur de bougie, poussière d'or, page visée (double page) -->
    <span class="grim__candle"></span>
    <span class="grim__motes"><i v-for="k in 7" :key="k" :style="{ '--k': k }"></i></span>
    <span v-if="aim && !closed" :class="['grim__aim', `grim__aim--${aim}`]"></span>
    <!-- Ouverture : le grimoire fermé, ses fermoirs sautent et la couverture pivote ; un toucher la passe -->
    <template v-if="opening">
      <span ref="shade" class="grim__shade"></span>
      <div ref="cover" class="grim__cover" @click="skip">
        <div ref="leaf" class="grim__leaf">
          <div class="grim__face grim__face--front">
            <span class="grim__corner grim__corner--tl"></span>
            <span class="grim__corner grim__corner--tr"></span>
            <span class="grim__corner grim__corner--br"></span>
            <span class="grim__corner grim__corner--bl"></span>
            <span v-for="(rune, k) in runes" :key="rune.id" ref="lights" class="grim__light" :style="lightStyle(k)"><svg viewBox="0 0 24 24"><path :d="rune.d"></path></svg></span>
            <span ref="gem" :class="['grim__cover-gem', { 'is-awake': awake }]"></span>
            <span class="grim__title">{{ title }}</span>
            <span class="grim__subtitle">Grimoire d’alchimie</span>
            <span ref="bandTop" class="grim__band grim__band--top"></span>
            <span ref="bandBottom" class="grim__band grim__band--bottom"></span>
          </div>
          <!-- Revers : le plat gauche tel qu'il sera posé (cuir, coins, tranche, lanière) et la garde peinte -->
          <div class="grim__face grim__face--back">
            <span class="grim__tool"></span>
            <span class="grim__corner grim__corner--tl"></span>
            <span class="grim__corner grim__corner--bl"></span>
            <span class="grim__block grim__block--inside"></span>
            <canvas ref="endpaper" class="grim__endpaper"></canvas>
            <span class="grim__strap grim__strap--inside"></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { SIGILS, CHAPTER_IDS, LEATHER, LEATHER_GRAIN, BRASS_CORNER, CLASP_PLATE, CLASP_STRAP, coverArt } from '@/book/grimoire';
import { CHAPTER_STYLE } from '@/book/chapters';
import { paintEndpaper } from '@/book/painter';
import { burst, center, vibrate } from '@/utils/fx';

const COVER_ART = coverArt();
// Couleur assombrie (gemme : facette d'ombre)
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = v => Math.round(v * (1 - k));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

export default {
  name: 'GrimoireBinding',
  props: {
    // Téléphone : une seule page, reliure plus fine, dos à gauche
    compact: { type: Boolean, default: false },
    // Chapitre de la page visée (null : sommaire), et état des sept chapitres ({ id, open })
    chapter: { type: String, default: null },
    chapters: { type: Array, default: () => [] },
    // Avancée dans le Livre (0 : première page, 1 : dernière) : épaisseur des tranches
    progress: { type: Number, default: 0 },
    // Compteur : chaque hausse fait courir la lumière sur les sigles (page inscrite)
    flash: { type: Number, default: 0 },
    // Page visée sur la double page ('left' | 'right'), ou null
    aim: { type: String, default: null },
    // Ouverture : le grimoire est d'abord fermé ; ready : les pages sont peintes, la couverture peut s'ouvrir
    opening: { type: Boolean, default: false },
    ready: { type: Boolean, default: false },
    // Anya s'est révélée : la gemme de la couverture (la Terre, au centre des sept sceaux) reste allumée, or et vert
    awake: { type: Boolean, default: false },
    title: { type: String, default: '' },
    // L'étape de civilisation, sous le titre de l'Ex libris
    stage: { type: String, default: null }
  },
  emits: ['opened'],
  data() {
    return { flashing: false, igniting: null };
  },
  computed: {
    // Livre fermé : le plat gauche et sa page attendent la couverture
    closed() {
      return this.opening;
    },
    runes() {
      const open = new Set(this.chapters.filter(c => c.open).map(c => c.id));
      return CHAPTER_IDS.map(id => ({ id, d: SIGILS[id].d, open: open.has(id) }));
    },
    vars() {
      const silk = this.chapter ? CHAPTER_STYLE[this.chapter].wax : LEATHER.garnet;
      const most = this.compact ? 7 : 9;
      const thick = share => `${(2 + (most - 2) * share).toFixed(1)}px`;
      return {
        '--grain': LEATHER_GRAIN,
        '--corner': BRASS_CORNER,
        '--plate': CLASP_PLATE,
        '--strap': CLASP_STRAP,
        '--art': COVER_ART,
        '--silk': silk,
        '--gem-deep': shade(silk, 0.5),
        '--smax': `${most}px`,
        '--sr': thick(1 - this.progress),
        '--sl': thick(this.progress)
      };
    }
  },
  watch: {
    flash() {
      this.flashing = false;
      clearTimeout(this.flashTimer);
      requestAnimationFrame(() => {
        this.flashing = true;
        this.flashTimer = setTimeout(() => { this.flashing = false; }, 1400);
      });
    },
    chapter(id, before) {
      if (!id || id === before) return;
      this.igniting = id;
      clearTimeout(this.igniteTimer);
      this.igniteTimer = setTimeout(() => { this.igniting = null; }, 1500);
    },
    ready() {
      this.maybePlay();
    },
    // Une nouvelle ouverture (rejouée) attend que la couverture soit rendue
    opening(now) {
      if (!now) return;
      this.played = false;
      this.$nextTick(() => this.maybePlay());
    }
  },
  created() {
    this.anims = [];
    this.flashTimer = 0;
    this.igniteTimer = 0;
    this.played = false;
  },
  mounted() {
    this.maybePlay();
  },
  beforeUnmount() {
    clearTimeout(this.flashTimer);
    clearTimeout(this.igniteTimer);
    this.anims.forEach(a => a.cancel());
  },
  methods: {
    // Sigles allumés sur la couverture : sur la couronne du médaillon (le même cercle que dans l'image)
    lightStyle(k) {
      const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
      return { left: `${50 + 29 * Math.cos(a)}%`, top: `${50 + 22.14 * Math.sin(a)}%` };
    },
    maybePlay() {
      if (!this.opening || !this.ready || this.played || !this.$refs.leaf) return;
      this.played = true;
      this.paintEndpaper();
      this.play();
    },
    // La garde au revers de la couverture : la même peinture que la page −1 du moteur, à la même taille
    paintEndpaper() {
      const canvas = this.$refs.endpaper;
      const rect = this.$el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.compact ? rect.width : rect.width / 2;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(rect.height * dpr);
      paintEndpaper(canvas.getContext('2d'), canvas.width, canvas.height, 'left', true, this.stage);
    },
    play() {
      const opts = (duration, delay = 0, easing = 'ease-out') => ({ duration, delay, easing, fill: 'forwards' });
      const lights = this.$refs.lights || [];
      const add = (el, frames, timing) => {
        const a = el.animate(frames, timing);
        this.anims.push(a);
        return a;
      };
      // 1. Les sigles s'allument un à un, la gemme s'éveille
      lights.forEach((el, k) => add(el, [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.6)' }, { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }], opts(260, 120 + k * 85)));
      add(this.$refs.gem, [{ filter: 'brightness(.7)', transform: 'translate(-50%, -50%) scale(1)' }, { filter: 'brightness(1.5)', transform: 'translate(-50%, -50%) scale(1.12)', offset: 0.6 }, { filter: 'brightness(1.15)', transform: 'translate(-50%, -50%) scale(1)' }], opts(900, 200));
      // 2. Les fermoirs sautent
      add(this.$refs.bandTop, [{ transform: 'none', opacity: 1 }, { transform: 'translate(18%, -60%) rotate(-24deg)', opacity: 0 }], opts(300, 900, 'cubic-bezier(.3, 1.4, .6, 1)'));
      add(this.$refs.bandBottom, [{ transform: 'none', opacity: 1 }, { transform: 'translate(18%, 60%) rotate(24deg)', opacity: 0 }], opts(300, 940, 'cubic-bezier(.3, 1.4, .6, 1)'));
      const snap = setTimeout(() => {
        vibrate([12, 40, 12]);
        const cover = this.$refs.cover && this.$refs.cover.getBoundingClientRect();
        if (cover) {
          burst({ x: cover.right - 8, y: cover.top + cover.height * 0.26 }, 8, 30);
          burst({ x: cover.right - 8, y: cover.top + cover.height * 0.74 }, 8, 30);
        }
      }, 920);
      // 3. La couverture pivote sur le dos et se pose à gauche ; son ombre quitte la page
      const leaf = add(this.$refs.leaf, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }], opts(1050, 1180, 'cubic-bezier(.5, .05, .25, 1)'));
      add(this.$refs.shade, [{ opacity: 0.55 }, { opacity: 0 }], opts(600, 1180));
      this.anims.push({ cancel: () => clearTimeout(snap), finish: () => clearTimeout(snap) });
      leaf.onfinish = () => {
        const rect = this.$el.getBoundingClientRect();
        burst(center(rect), 16, rect.width * 0.4);
        this.anims = [];
        this.$emit('opened');
      };
    },
    // Un toucher : l'ouverture va à sa fin
    skip() {
      this.anims.forEach(a => a.finish());
    }
  }
};
</script>

<style scoped src="./GrimoireBinding.css"></style>
