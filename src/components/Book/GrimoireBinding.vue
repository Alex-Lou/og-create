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
            <span ref="gem" class="grim__cover-gem"></span>
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
    title: { type: String, default: '' }
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
      paintEndpaper(canvas.getContext('2d'), canvas.width, canvas.height, 'left', true);
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

<style scoped>
/* Mesures : --m marge du plat autour des pages, --sb tranche du bas ; --smax, --sr, --sl (tranches) viennent du script */
.grim { position: absolute; inset: 0; --m: 16px; --sb: 5px; --r: 20px; pointer-events: none; }
.grim.is-compact { --m: 12px; --sb: 4px; }
.grim.is-closed .grim__left, .grim.is-closed .grim__board--left, .grim.is-closed .grim__fold { visibility: hidden; }

/* Lueur chaude de la bougie sur le bureau, sous le livre */
.grim__glow {
  position: absolute; inset: -40px -50px -50px -60px; z-index: 0;
  background: radial-gradient(closest-side at 50% 40%, rgba(255, 176, 88, .26), rgba(255, 176, 88, 0));
  animation: grim-flicker 6s steps(1, end) infinite;
}

/* Plats : cuir grainé, biseau, ombre portée */
.grim__board {
  position: absolute; z-index: 1;
  top: calc(-1 * var(--m)); bottom: calc(-1 * (var(--m) + var(--sb)));
  background-color: #5C1F25;
  background-image: var(--grain), radial-gradient(120% 90% at 38% 28%, #7A2A31 0%, #5C1F25 55%, #34100F 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .55), inset 0 2px 0 rgba(255, 214, 170, .14), inset 0 -4px 8px rgba(0, 0, 0, .45), 0 22px 46px rgba(0, 0, 0, .55), 0 4px 12px rgba(0, 0, 0, .35);
}
.grim__board--right { left: 50%; right: calc(-1 * (var(--m) + var(--smax))); border-radius: 3px 12px 12px 3px; }
.grim__board--left { left: calc(-1 * (var(--m) + var(--smax))); right: 50%; border-radius: 12px 3px 3px 12px; }
/* Double filet doré poussé au fer */
.grim__tool {
  position: absolute; inset: 5px; border-radius: 8px;
  border: 1px solid rgba(214, 170, 90, .55);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0), inset 0 0 0 3px rgba(214, 170, 90, .3);
}

/* Coins en laiton */
.grim__corner { position: absolute; z-index: 1; width: 34px; height: 34px; background: var(--corner) center / contain no-repeat; filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .5)); }
.grim.is-compact .grim__corner { width: 28px; height: 28px; }
.grim > .grim__corner--tr { top: calc(-1 * var(--m) - 2px); right: calc(-1 * (var(--m) + var(--smax)) - 2px); transform: rotate(90deg); }
.grim > .grim__corner--br { bottom: calc(-1 * (var(--m) + var(--sb)) - 2px); right: calc(-1 * (var(--m) + var(--smax)) - 2px); transform: rotate(180deg); }
.grim > .grim__corner--tl { top: calc(-1 * var(--m) - 2px); left: calc(-1 * (var(--m) + var(--smax)) - 2px); }
.grim > .grim__corner--bl { bottom: calc(-1 * (var(--m) + var(--sb)) - 2px); left: calc(-1 * (var(--m) + var(--smax)) - 2px); transform: rotate(270deg); }

/* Blocs des pages : la tranche dorée dépasse, à gauche des pages lues, à droite de celles qui restent */
.grim__block {
  position: absolute; z-index: 1; top: 1px; bottom: calc(-1 * var(--sb));
  background-repeat: no-repeat;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .45);
  background-image:
    repeating-linear-gradient(90deg, rgba(92, 60, 18, .45) 0 1px, rgba(255, 236, 180, .25) 1px 2px),
    repeating-linear-gradient(180deg, rgba(92, 60, 18, .45) 0 1px, rgba(255, 236, 180, .25) 1px 2px),
    linear-gradient(180deg, #EBD38C, #C9A24A 38%, #A9822F 70%, #E4C47A);
}
.grim__block--right {
  left: 50%; right: calc(-1 * var(--sr));
  border-radius: 2px var(--r) var(--r) 2px;
  background-size: var(--sr) 100%, 100% var(--sb), 100% 100%;
  background-position: right top, left bottom, 0 0;
}
.grim__block--left {
  left: calc(-1 * var(--sl)); right: 50%;
  border-radius: var(--r) 2px 2px var(--r);
  background-size: var(--sl) 100%, 100% var(--sb), 100% 100%;
  background-position: left top, left bottom, 0 0;
}

/* Pli du dos entre les deux pages, sur les marges du plat */
.grim__fold { position: absolute; z-index: 1; left: calc(50% - 2px); width: 4px; background: linear-gradient(90deg, rgba(0, 0, 0, .55), rgba(255, 214, 170, .12), rgba(0, 0, 0, .55)); }
.grim__fold--top { top: calc(-1 * var(--m)); height: var(--m); }
.grim__fold--bottom { bottom: calc(-1 * (var(--m) + var(--sb))); height: calc(var(--m) + var(--sb)); }

/* Tranchefiles : petites perles de soie brodée en tête et en queue du dos */
.grim__headband {
  position: absolute; z-index: 1; left: calc(50% - 6px); width: 12px; height: 5px; border-radius: 3px;
  background: repeating-linear-gradient(90deg, var(--silk) 0 2px, #E9CF86 2px 3.5px, #F4E6C8 3.5px 4.5px);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .5);
}
.grim__headband--top { top: -4px; }
.grim__headband--bottom { bottom: -4px; }

/* Sigles des chapitres sur la marge du bas, sous la page de droite */
.grim__runes {
  position: absolute; z-index: 1; left: calc(50% + 9%); right: 9%;
  bottom: calc(-1 * (var(--m) + var(--sb))); height: calc(var(--m) + 1px);
  display: flex; align-items: center; justify-content: space-between;
}
.grim__rune { position: relative; width: 13px; height: 13px; color: rgba(0, 0, 0, .55); transition: color .5s ease; }
.grim.is-compact .grim__rune { width: 11px; height: 11px; }
.grim__rune svg { display: block; width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 1px 0 rgba(255, 214, 170, .18)); }
.grim__rune.is-open { color: #D8B260; }
.grim__rune.is-open svg { filter: drop-shadow(0 0 2px rgba(255, 214, 120, .45)); }
.grim__rune.is-current { color: #FFE4A0; animation: grim-rune 2.8s ease-in-out infinite; }
.grim__rune.is-ignite { animation: grim-ignite 1.4s cubic-bezier(.3, 1.5, .5, 1); }
.grim__runes.is-flash .grim__rune.is-open { animation: grim-sweep 1.2s ease-out calc(var(--k) * 90ms) both; }

/* Lanière du fermoir, ouverte : elle pend du plat gauche */
.grim__strap { position: absolute; z-index: 1; width: 50px; height: 20px; top: calc(50% - 10px); left: calc(-1 * (var(--m) + var(--smax)) - 38px); background: var(--strap) center / contain no-repeat; transform: scaleX(-1) rotate(-6deg); filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .45)); }
.grim.is-compact .grim__strap { width: 40px; height: 16px; top: calc(50% - 8px); left: calc(-1 * (var(--m) + var(--smax)) - 30px); }
/* Gâche du fermoir et sa gemme, à la couleur du chapitre */
.grim__clasp { position: absolute; z-index: 1; width: 26px; height: 56px; top: calc(50% - 28px); right: calc(-1 * (var(--m) + var(--smax)) - 9px); background: var(--plate) center / contain no-repeat; filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .5)); }
.grim.is-compact .grim__clasp { width: 20px; height: 44px; top: calc(50% - 22px); right: calc(-1 * (var(--m) + var(--smax)) - 7px); }
.grim__gem {
  position: absolute; left: 50%; top: 50%; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #FFFFFF 0, var(--silk) 34%, var(--gem-deep) 100%);
  box-shadow: inset 0 -1px 2px rgba(0, 0, 0, .5), 0 0 0 1.5px #7A5A1E;
  transition: background .6s ease;
}
.grim.is-compact .grim__gem { width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; }
.grim__gem::after {
  content: ''; position: absolute; inset: -9px; border-radius: 50%;
  background: radial-gradient(closest-side, var(--silk), transparent);
  opacity: .35; animation: grim-gem 3.2s ease-in-out infinite;
}
/* Signet de soie : sort du pli en bas et ondule */
.grim__ribbon { position: absolute; z-index: 1; left: calc(50% + 12px); top: calc(100% - 3px); width: 13px; height: 42px; color: var(--silk); transform-origin: 50% 0; transition: color .6s ease; animation: grim-sway 4.6s ease-in-out infinite; filter: drop-shadow(1px 2px 1px rgba(0, 0, 0, .4)); }
.grim.is-compact .grim__ribbon { width: 11px; height: 36px; left: 10px; }
.grim__ribbon svg { display: block; width: 100%; height: 100%; }
.grim__ribbon path { fill: currentColor; }
.grim__ribbon .grim__ribbon-sheen { fill: none; stroke: rgba(255, 255, 255, .35); stroke-width: 1.4; }

/* Aura, au-dessus des pages */
.grim__candle {
  position: absolute; inset: 0; z-index: 3; border-radius: var(--r);
  background: radial-gradient(60% 60% at 30% 6%, rgba(255, 190, 110, .14), rgba(255, 190, 110, 0) 70%);
  animation: grim-flicker 6s steps(1, end) infinite;
}
.grim__motes { position: absolute; inset: 0; z-index: 3; overflow: visible; }
.grim__motes i {
  position: absolute; bottom: 8%; left: calc(var(--k) * 12.5% - 2%); width: 3px; height: 3px; border-radius: 50%;
  background: radial-gradient(circle, #FFF2C4, rgba(255, 210, 120, 0) 70%);
  box-shadow: 0 0 4px rgba(255, 214, 140, .8);
  opacity: 0; animation: grim-mote 9s linear calc(var(--k) * -1.3s) infinite;
}
.grim__motes i:nth-child(odd) { animation-duration: 11s; width: 2px; height: 2px; }
.grim__aim {
  position: absolute; z-index: 3; top: 0; bottom: 0; width: 50%;
  box-shadow: inset 0 0 0 2px rgba(227, 169, 59, .75), inset 0 0 26px rgba(227, 169, 59, .22);
  transition: opacity .2s ease;
}
.grim__aim--left { left: 0; border-radius: var(--r) 4px 4px var(--r); }
.grim__aim--right { left: 50%; border-radius: 4px var(--r) var(--r) 4px; }

/* Couverture de l'ouverture : le plat avant, posé sur la page de droite, charnière sur le dos */
.grim__shade { position: absolute; z-index: 5; inset: 0 0 0 50%; background: linear-gradient(90deg, rgba(20, 8, 4, .85), rgba(20, 8, 4, .4)); border-radius: 6px var(--r) var(--r) 6px; }
.grim__cover {
  position: absolute; z-index: 6; pointer-events: auto; cursor: pointer;
  left: 50%; top: calc(-1 * var(--m)); right: calc(-1 * (var(--m) + var(--smax))); bottom: calc(-1 * (var(--m) + var(--sb)));
  perspective: 2200px;
}
.grim__leaf { position: absolute; inset: 0; transform-origin: 0 50%; transform-style: preserve-3d; }
.grim__face {
  position: absolute; inset: 0; container-type: inline-size;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background-color: #5C1F25;
  background-image: var(--grain), radial-gradient(120% 90% at 38% 28%, #7A2A31 0%, #5C1F25 55%, #34100F 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .55), inset 0 2px 0 rgba(255, 214, 170, .14), inset 0 -4px 8px rgba(0, 0, 0, .45);
}
.grim__face--front { border-radius: 3px 12px 12px 3px; background-image: var(--grain), var(--art); background-size: auto, 100% 100%; box-shadow: 0 18px 40px rgba(0, 0, 0, .55); }
.grim__face--back { transform: rotateY(180deg); border-radius: 12px 3px 3px 12px; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .55), inset 0 2px 0 rgba(255, 214, 170, .14), inset 0 -4px 8px rgba(0, 0, 0, .45), 0 22px 46px rgba(0, 0, 0, .55), 0 4px 12px rgba(0, 0, 0, .35); }
.grim__face .grim__corner--tl { top: -2px; left: -2px; }
.grim__face .grim__corner--tr { top: -2px; right: -2px; transform: rotate(90deg); }
.grim__face .grim__corner--br { bottom: -2px; right: -2px; transform: rotate(180deg); }
.grim__face .grim__corner--bl { bottom: -2px; left: -2px; transform: rotate(270deg); }
.grim__light { position: absolute; width: 7%; aspect-ratio: 1; transform: translate(-50%, -50%); opacity: 0; color: #FFE6A8; }
.grim__light svg { display: block; width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 3px rgba(255, 214, 120, .95)); }
.grim__cover-gem {
  position: absolute; left: 50%; top: 50%; width: 15%; aspect-ratio: 1; border-radius: 50%; transform: translate(-50%, -50%);
  background: radial-gradient(circle at 34% 30%, #FFFFFF 0, #C2475A 30%, #5A1220 100%);
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, .55), 0 0 0 2px #7A5A1E, 0 0 0 4px rgba(201, 162, 74, .6), 0 0 18px rgba(255, 120, 130, .45);
  filter: brightness(.7);
}
.grim__title, .grim__subtitle {
  position: absolute; left: 10%; right: 10%; text-align: center; font-family: var(--oc-font-display); font-weight: 700;
  background: linear-gradient(180deg, #FBE7AE, #D3AA52 55%, #8A6420); -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, .6));
}
.grim__title { top: 6.5%; font-size: 9.5cqw; line-height: 1.1; letter-spacing: .02em; }
.grim__subtitle { bottom: 8.5%; font-size: 4.6cqw; font-style: italic; font-weight: 500; }
.grim__band { position: absolute; right: -5%; width: 27%; height: 8%; background: var(--strap) center / contain no-repeat; filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .5)); }
.grim__band--top { top: 22%; }
.grim__band--bottom { bottom: 22%; }
.grim__block--inside {
  left: calc(var(--m) + var(--smax) - var(--sl)); right: 0; top: calc(var(--m) + 1px); bottom: var(--m);
  border-radius: var(--r) 2px 2px var(--r);
  background-size: var(--sl) 100%, 100% var(--sb), 100% 100%;
  background-position: left top, left bottom, 0 0;
}
.grim__endpaper { position: absolute; z-index: 2; left: calc(var(--m) + var(--smax)); top: var(--m); width: calc(100% - var(--m) - var(--smax)); height: calc(100% - 2 * var(--m) - var(--sb)); border-radius: var(--r) 6px 6px var(--r); }
.grim__strap--inside { left: -38px; }
.grim.is-compact .grim__strap--inside { left: -30px; }

/* Téléphone, une seule page : le plat droit sous la page, le dos en mince bande à gauche quand le livre est fermé
   (sans coins ni lanière), le pli, les tranchefiles et le signet au bord gauche ; la couverture couvre la page et
   s'ouvre vers la gauche */
.grim.is-compact .grim__board--right, .grim.is-compact .grim__block--right, .grim.is-compact .grim__cover { left: 0; }
.grim.is-compact .grim__board--left { right: 100%; border-radius: 10px 2px 2px 10px; }
.grim.is-compact.is-closed .grim__board--left { visibility: visible; }
/* Livre ouvert : le plat gauche passe sous la feuille posée à gauche et s'efface vers le bord de la scène */
.grim.is-compact:not(.is-closed) .grim__board--left {
  left: calc(-1 * (var(--m) + var(--smax)) - 90px); border-radius: 0 2px 2px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent 30%, #000 75%); mask-image: linear-gradient(90deg, transparent 30%, #000 75%);
}
.grim.is-compact .grim__board--left .grim__tool, .grim.is-compact > .grim__corner.grim__left, .grim.is-compact .grim__block--left, .grim.is-compact > .grim__strap { display: none; }
.grim.is-compact .grim__fold { left: -2px; }
.grim.is-compact .grim__headband { left: -6px; }
.grim.is-compact .grim__runes { left: 9%; }
.grim.is-compact .grim__shade { inset: 0; border-radius: 6px var(--r) var(--r) 6px; }

@keyframes grim-flicker {
  0% { opacity: .85; } 9% { opacity: 1; } 17% { opacity: .78; } 26% { opacity: .95; } 41% { opacity: .82; }
  52% { opacity: 1; } 63% { opacity: .88; } 71% { opacity: .76; } 84% { opacity: .97; } 92% { opacity: .84; }
}
@keyframes grim-gem { 0%, 100% { opacity: .25; transform: scale(.85); } 50% { opacity: .7; transform: scale(1.12); } }
@keyframes grim-rune { 0%, 100% { filter: drop-shadow(0 0 1px rgba(255, 214, 120, .5)); } 50% { filter: drop-shadow(0 0 5px rgba(255, 224, 140, 1)); } }
@keyframes grim-ignite { 0% { transform: scale(1); } 40% { transform: scale(1.7); color: #FFFFFF; filter: drop-shadow(0 0 8px #FFE29A); } 100% { transform: scale(1); } }
@keyframes grim-sweep { 0%, 100% { filter: none; } 40% { color: #FFFFFF; filter: drop-shadow(0 0 6px #FFE29A); transform: translateY(-1px); } }
@keyframes grim-sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(3deg); } }
@keyframes grim-mote {
  0% { opacity: 0; transform: translate(0, 0); }
  15% { opacity: .9; }
  50% { transform: translate(10px, -90px); }
  85% { opacity: .7; }
  100% { opacity: 0; transform: translate(-6px, -190px); }
}

@media (prefers-reduced-motion: reduce) {
  .grim__glow, .grim__candle, .grim__motes i, .grim__ribbon, .grim__gem::after, .grim__rune { animation: none !important; }
  .grim__motes { display: none; }
}
</style>
