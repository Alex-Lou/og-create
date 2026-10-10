<template>
  <section
    ref="zone"
    :class="['athanor', 'g-panel', { 'athanor--quick': quick, 'athanor--multi': slotCount > 2, 'athanor--over': dragOver, 'is-merging': merging }]"
    aria-label="Athanor"
    @dragenter.prevent="dragOver = true"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <header class="athanor__head">
      <h2 class="athanor__title">Athanor</h2>
      <span class="g-mono">{{ picked.length ? picked.join(' + ') : `${slotCount} emplacements` }}</span>
    </header>

    <div :class="['athanor__circle', { 'is-failing': failing }]">
      <svg class="athanor__ring" viewBox="0 0 360 360" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round">
          <circle cx="180" cy="180" r="170" stroke-opacity=".3"></circle>
          <circle cx="180" cy="180" r="130" stroke-opacity=".45" stroke-dasharray="2 6"></circle>
          <polygon :points="ringPolygon" stroke-opacity=".4"></polygon>
          <circle cx="180" cy="180" r="54" stroke-opacity=".55"></circle>
          <circle cx="180" cy="180" r="48" stroke-opacity=".22"></circle>
        </g>
        <circle cx="180" cy="180" r="3" fill="var(--oc-gold)"></circle>
      </svg>

      <button
        v-for="(slot, index) in slots"
        :key="index"
        type="button"
        :ref="el => setSlotRef(el, index)"
        :class="['slot', { 'slot--filled': slot.name, 'slot--new': unlockedIndex === index }]"
        :style="slot.style"
        :aria-label="slot.name ? `Retirer ${slot.name}` : `Emplacement ${index + 1} libre`"
        :disabled="!slot.name || merging"
        @click="remove(index)"
      >
        <template v-if="slot.name">
          <span class="slot__ink" aria-hidden="true"><ElementGlyph :glyph="emojiOf(slot.name)" /></span>
          <span class="slot__name">{{ slot.name }}</span>
        </template>
        <span v-else class="g-mono slot__num">{{ slot.num }}</span>
      </button>

      <p class="athanor__center g-italic" aria-hidden="true">
        {{ merging ? 'Transmutation…' : picked.length ? '' : 'Dépose ici' }}
      </p>
    </div>

    <!-- Échec : dit dans l'Athanor sur PC ; sur mobile, en haut de l'écran, hors de la zone de jeu -->
    <transition name="fail">
      <p v-if="failMessage" class="athanor__fail" role="status">{{ failMessage }}</p>
    </transition>

    <div class="athanor__actions">
      <button type="button" class="g-btn g-btn--ghost athanor__clear" aria-label="Vider l’Athanor" :disabled="!picked.length || merging" @click="clear">
        Vider
      </button>
      <button v-if="showFuseButton" type="button" class="g-btn athanor__fuse" :disabled="picked.length < 2 || merging || busy" @click="fuse">
        {{ merging ? 'Transmutation…' : 'Transmuer' }}
      </button>
    </div>

    <!-- Révélation : dans l'Athanor sur PC, plein écran sur mobile -->
    <transition name="reveal">
      <button v-if="result" type="button" class="reveal" aria-live="polite" @click="dismiss">
        <span class="reveal__halo" aria-hidden="true"></span>
        <span ref="revealCard" :class="['reveal__card', { 'is-new': result.isNew }]">
          <span class="g-mono g-gold">{{ result.isNew ? 'Nouvelle entrée au registre' : 'Déjà consigné' }}</span>
          <img v-if="result.image" class="reveal__image" :src="result.image" :alt="result.name" />
          <span v-else class="reveal__ink g-ink--glow" aria-hidden="true"><ElementGlyph :glyph="emojiOf(result.name)" /></span>
          <span class="reveal__name">{{ result.name }}</span>
          <span class="g-italic reveal__origin">{{ result.from.join(' + ') }}</span>
        </span>
      </button>
    </transition>
  </section>
</template>

<script>
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { HAPTIC, burst, center, fly, ring, vibrate } from '@/utils/fx';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { aimMessage } from '@/book/aim';
import { guide } from '@/game/guide';
import { roman } from '@/utils/roman';

const MERGE_MS = 520;
// Fusion à 2 : même geste, plus vif (voir .athanor--quick)
const QUICK_MERGE_MS = 300;
const REVEAL_MS = 1700;
const FAIL_MS = 1800;
const FAIL_MAX_MS = 3200;
// Durée du vol d'un élément jusqu'à son emplacement (utils/fx.js) : l'animation attend qu'il soit posé
const FLIGHT_MS = 380;
// Rayon de l'anneau des emplacements, en px (cercle de 360 px)
const RING_RADIUS = 130;

// Images des créatures (src/assets/creatures), par nom ; null s'il n'y en a pas
// (chemin relatif à ce fichier : src/components/Craft/CraftZone/ ; avant le rangement par domaine (#173), un niveau de
// moins, d'où des images qui ne se trouvaient plus)
const CREATURES = import.meta.glob('../../../assets/creatures/*.png', { eager: true, import: 'default' });
function creatureImage(name) {
  return CREATURES[`../../../assets/creatures/${name}.png`] || null;
}

// Athanor : 2 à 4 emplacements ; la transmutation part seule quand toutes les cases sont remplies
export default {
  name: 'CraftZone',
  components: { ElementGlyph },
  props: {
    slotCount: { type: Number, default: 2 },
    // Mode de jeu : le serveur juge le mélange avec les éléments en main dans ce mode
    mode: { type: String, default: 'infinite' },
    elementEmojis: { type: Object, required: true },
    // Phrase d'un mélange raté (Infini) ; sans elle, la phrase par défaut
    failText: { type: Function, default: null },
    // Page du Livre visée : le serveur dit combien d'ingrédients du mélange sont justes
    aimPage: { type: String, default: null }
  },
  emits: ['craft-success', 'discovery', 'learned', 'show-alert', 'revealing', 'aimed', 'picked'],
  data() {
    return {
      picked: [],
      // Mélange envoyé au serveur, réponse attendue
      busy: false,
      merging: false,
      failing: false,
      failMessage: '',
      result: null,
      dragOver: false,
      unlockedIndex: -1
    };
  },
  computed: {
    // Deux emplacements : la fusion part dès le second élément, plus courte
    quick() {
      return this.slotCount === 2;
    },
    // Plus de deux emplacements : le bouton sert aux combinaisons partielles (2/3, 3/4…)
    showFuseButton() {
      return this.slotCount > 2;
    },
    // Emplacements posés sur l'anneau (PC) ; à la transmutation, chacun glisse vers le centre
    slots() {
      return Array.from({ length: this.slotCount }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / this.slotCount;
        const x = Math.round(RING_RADIUS * Math.cos(a));
        const y = Math.round(RING_RADIUS * Math.sin(a));
        return { name: this.picked[i] || null, num: roman(i + 1), style: { '--x': `${x}px`, '--y': `${y}px` } };
      });
    },
    ringPolygon() {
      return Array.from({ length: this.slotCount }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / this.slotCount;
        return `${(180 + 130 * Math.cos(a)).toFixed(1)},${(180 + 130 * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
    }
  },
  watch: {
    // Le parent peut différer ses propres popups pendant la révélation
    result(value, previous) {
      if (!value !== !previous) this.$emit('revealing', !!value);
    },
    // Les tuiles de l'étagère montrent quel élément occupe quel emplacement
    picked: {
      handler(list) {
        this.$emit('picked', [...list]);
      },
      deep: true
    },
    slotCount(count, previous) {
      if (this.picked.length > count) this.picked = this.picked.slice(0, count);
      if (count > previous) {
        this.unlockedIndex = count - 1;
        this.later(() => (this.unlockedIndex = -1), 1500);
      }
    }
  },
  created() {
    this.timers = [];
    this.slotEls = []; // éléments DOM des emplacements (non réactif)
    this.landsAt = 0; // fin du vol du dernier élément posé (performance.now)
  },
  mounted() {
    this.onKey = event => this.handleKey(event);
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
    this.timers.forEach(clearTimeout);
    (this.failTimers || []).forEach(clearTimeout);
  },
  methods: {
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    setSlotRef(el, index) {
      this.slotEls[index] = el;
    },
    emojiOf(name) {
      return this.elementEmojis[name] || 'ui:spark';
    },

    // Ajoute un élément ; `from` = rectangle de la carte d'origine, pour l'animer jusqu'à son emplacement
    add(name, from = null) {
      if (!name || this.merging || this.busy) return;
      if (this.result) this.dismiss();
      // Un essai raté s'efface tout de suite si l'on enchaîne : le nouvel élément reste
      if (this.failing) this.endFail();
      else this.failMessage = '';
      if (this.picked.length >= this.slotCount) this.picked = [];
      const index = this.picked.length;
      this.picked.push(name);
      this.landsAt = from ? performance.now() + FLIGHT_MS : 0;
      if (from) this.$nextTick(() => fly(this.emojiOf(name), from, this.slotEls[index]));
      // Toutes les cases remplies : la fusion part seule ; le bouton sert aux combinaisons partielles (2/3, 3/4…)
      if (this.picked.length === this.slotCount) this.later(() => this.fuse(), this.quick ? 0 : 300);
    },
    remove(index) {
      if (this.merging || this.busy) return;
      this.picked.splice(index, 1);
    },
    clear() {
      this.picked = [];
      this.merging = false;
      this.result = null;
    },

    // Le serveur seul connaît les recettes : il répond par le résultat, ou rien
    async fuse() {
      if (this.picked.length < 2 || this.merging || this.busy) return;
      const ingredients = [...this.picked];
      // La demande part tout de suite ; l'Athanor reste fermé jusqu'à ce que l'élément ait fini son vol
      this.busy = true;
      let reply;
      try {
        reply = await playService.combine(this.mode, ingredients, this.aimPage);
      } catch (error) {
        await this.untilLanded();
        this.busy = false;
        this.fail(messageOf(error, 'L’Athanor ne répond pas, réessaie.'));
        return;
      }
      await this.untilLanded();
      this.busy = false;
      const aim = reply.aim ? { ...reply.aim, tried: ingredients } : null;
      if (aim) this.$emit('aimed', aim);
      if (!reply.result) {
        this.fail(aim ? aimMessage(aim) : this.failText ? this.failText(ingredients) : 'Rien ne se passe… Essaie une autre combinaison.');
        if (aim) guide.tip('fail');
        return;
      }
      const { result: name, isNew } = reply;
      this.$emit('learned', reply);
      this.merging = true;
      this.later(() => {
        this.merging = false;
        this.picked = [];
        this.result = { name, isNew, image: creatureImage(name), from: ingredients };
        this.$emit('craft-success', name, ingredients);
        vibrate(isNew ? HAPTIC.discovery : HAPTIC.success);
        if (isNew) this.$nextTick(() => {
          const at = center(this.$refs.revealCard.getBoundingClientRect());
          burst(at, 26, 170);
          ring(at, 180);
        });
        if (isNew) {
          const box = this.$refs.zone.getBoundingClientRect();
          this.$emit('discovery', { name, x: box.left + box.width / 2, y: box.top + box.height / 2 });
        }
        this.later(() => this.dismiss(), REVEAL_MS);
      }, this.quick ? QUICK_MERGE_MS : MERGE_MS);
    },
    untilLanded() {
      const wait = this.landsAt - performance.now();
      return wait > 0 ? new Promise(resolve => this.later(resolve, wait)) : Promise.resolve();
    },
    fail(message) {
      this.failing = true;
      this.failMessage = message;
      vibrate(HAPTIC.fail);
      this.failTimers = [
        setTimeout(() => {
          this.failing = false;
          this.picked = [];
        }, this.quick ? 450 : 700),
        // Une phrase plus longue reste affichée le temps d'être lue, sans s'éterniser
        setTimeout(() => (this.failMessage = ''), Math.min(FAIL_MAX_MS, Math.max(FAIL_MS, message.length * 40)))
      ];
    },
    endFail() {
      (this.failTimers || []).forEach(clearTimeout);
      this.failing = false;
      this.failMessage = '';
      this.picked = [];
    },
    dismiss() {
      this.result = null;
    },

    onDrop(event) {
      this.dragOver = false;
      const name = event.dataTransfer.getData('text/plain');
      if (name && this.elementEmojis[name]) this.add(name);
    },
    onDragLeave(event) {
      if (!this.$refs.zone.contains(event.relatedTarget)) this.dragOver = false;
    },

    // Clavier : Entrée fusionne, Échap vide, Retour arrière retire le dernier (hors saisie)
    handleKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target.closest?.('input, textarea, select, button, [role="button"], [contenteditable="true"]')) return;
      if (event.key === 'Enter') this.fuse();
      else if (event.key === 'Escape') this.clear();
      else if (event.key === 'Backspace' && this.picked.length) this.remove(this.picked.length - 1);
    }
  }
};
</script>

<style scoped src="./CraftZone.css"></style>

