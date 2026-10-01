<template>
  <section
    ref="zone"
    :class="['athanor', 'g-panel', { 'athanor--multi': slotCount > 2, 'athanor--over': dragOver, 'is-merging': merging }]"
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
          <span class="slot__ink g-ink" aria-hidden="true">{{ emojiOf(slot.name) }}</span>
          <span class="slot__name">{{ slot.name }}</span>
        </template>
        <span v-else class="g-mono slot__num">{{ slot.num }}</span>
      </button>

      <p class="athanor__center g-italic" aria-hidden="true">
        {{ merging ? 'Transmutation…' : picked.length ? '' : 'Dépose ici' }}
      </p>
    </div>

    <!-- Échec : dit dans l'Athanor, sans jamais couvrir le bouton -->
    <transition name="fail">
      <p v-if="failMessage" class="athanor__fail" role="status">{{ failMessage }}</p>
    </transition>

    <div class="athanor__actions">
      <button type="button" class="g-btn g-btn--ghost athanor__clear" aria-label="Vider l’Athanor" :disabled="!picked.length || merging" @click="clear">
        Vider
      </button>
      <button v-if="showFuseButton" type="button" class="g-btn athanor__fuse" :disabled="picked.length < 2 || merging" @click="fuse">
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
          <span v-else class="reveal__ink g-ink--glow" aria-hidden="true">{{ emojiOf(result.name) }}</span>
          <span class="reveal__name">{{ result.name }}</span>
          <span class="g-italic reveal__origin">{{ result.from.join(' + ') }}</span>
        </span>
      </button>
    </transition>
  </section>
</template>

<script>
import { findRecipe } from '@/utils/recipes';
import { HAPTIC, burst, fly, vibrate } from '@/utils/feedback';

const MERGE_MS = 520;
const REVEAL_MS = 1700;
const FAIL_MS = 1800;
// Rayon de l'anneau des emplacements, en px (cercle de 360 px)
const RING_RADIUS = 130;
const ROMAN = ['I', 'II', 'III', 'IV'];

function creatureImage(name) {
  try {
    return require(`@/assets/creatures/${name}.png`);
  } catch {
    return null;
  }
}

// Athanor : 2 à 4 emplacements ; la transmutation part seule quand toutes les cases sont remplies
export default {
  name: 'CraftZone',
  props: {
    slotCount: { type: Number, default: 2 },
    craftingRecipes: { type: Object, required: true },
    elementEmojis: { type: Object, required: true },
    discoveredElements: { type: Array, default: () => [] },
    autoFuse: { type: Boolean, default: true }
  },
  emits: ['craft-success', 'craft-fail', 'discovery', 'show-alert', 'revealing'],
  data() {
    return {
      picked: [],
      merging: false,
      failing: false,
      failMessage: '',
      result: null,
      dragOver: false,
      unlockedIndex: -1
    };
  },
  computed: {
    showFuseButton() {
      return !this.autoFuse || this.slotCount > 2;
    },
    // Emplacements posés sur l'anneau (PC) ; à la transmutation, chacun glisse vers le centre
    slots() {
      return Array.from({ length: this.slotCount }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / this.slotCount;
        const x = Math.round(RING_RADIUS * Math.cos(a));
        const y = Math.round(RING_RADIUS * Math.sin(a));
        return { name: this.picked[i] || null, num: ROMAN[i], style: { '--x': `${x}px`, '--y': `${y}px` } };
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
  },
  mounted() {
    this.onKey = event => this.handleKey(event);
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
    this.timers.forEach(clearTimeout);
  },
  methods: {
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    setSlotRef(el, index) {
      this.slotEls[index] = el;
    },
    emojiOf(name) {
      return this.elementEmojis[name] || '✨';
    },

    // Ajoute un élément ; `from` = rectangle de la carte d'origine, pour l'animer jusqu'à son emplacement
    add(name, from = null) {
      if (!name || this.merging) return;
      if (this.result) this.dismiss();
      if (this.picked.length >= this.slotCount) this.picked = [];
      const index = this.picked.length;
      this.picked.push(name);
      if (from) this.$nextTick(() => fly(this.emojiOf(name), from, this.slotEls[index]));
      // Toutes les cases remplies : la fusion part seule ; le bouton sert aux combinaisons partielles (2/3, 3/4…)
      if (this.autoFuse && this.picked.length === this.slotCount) this.later(() => this.fuse(), 300);
    },
    remove(index) {
      if (this.merging) return;
      this.picked.splice(index, 1);
    },
    clear() {
      this.picked = [];
      this.merging = false;
      this.result = null;
    },

    fuse() {
      if (this.picked.length < 2 || this.merging) return;
      const ingredients = [...this.picked];
      const name = findRecipe(this.craftingRecipes, ingredients);
      if (!name) {
        this.failing = true;
        this.failMessage = 'Rien ne se passe… Essaie une autre combinaison.';
        this.$emit('craft-fail', ingredients);
        vibrate(HAPTIC.fail);
        this.later(() => {
          this.failing = false;
          this.picked = [];
        }, 700);
        this.later(() => (this.failMessage = ''), FAIL_MS);
        return;
      }
      const isNew = !this.discoveredElements.includes(name);
      this.merging = true;
      this.later(() => {
        this.merging = false;
        this.picked = [];
        this.result = { name, isNew, image: creatureImage(name), from: ingredients };
        this.$emit('craft-success', name);
        vibrate(isNew ? HAPTIC.discovery : HAPTIC.success);
        if (isNew) this.$nextTick(() => burst(this.$refs.revealCard, { count: 26, spread: 170 }));
        if (isNew) {
          const box = this.$refs.zone.getBoundingClientRect();
          this.$emit('discovery', { name, x: box.left + box.width / 2, y: box.top + box.height / 2 });
        }
        this.later(() => this.dismiss(), REVEAL_MS);
      }, MERGE_MS);
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

<style scoped>
.athanor {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 24px 24px 26px;
  transition: box-shadow var(--oc-medium) var(--oc-ease-out);
}
.athanor--over { box-shadow: inset 0 0 0 1px var(--oc-accent-line), var(--oc-shadow-accent); }
.athanor__head { align-self: stretch; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.athanor__head .g-mono { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.athanor__title { margin: 0; font-family: var(--oc-font-display); font-weight: 400; font-size: 24px; color: var(--oc-text-strong); }

.athanor__circle { position: relative; width: 360px; height: 360px; flex-shrink: 0; }
.athanor__ring { position: absolute; inset: 0; width: 100%; height: 100%; color: var(--oc-text); animation: turn 120s linear infinite; }
.athanor--over .athanor__ring, .is-merging .athanor__ring { color: var(--oc-gold); }
.athanor__center {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
  font-size: 15px;
  pointer-events: none;
}

.slot {
  appearance: none;
  position: absolute;
  left: calc(50% + var(--x));
  top: calc(50% + var(--y));
  width: 84px;
  height: 84px;
  margin: -42px 0 0 -42px;
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
  color: var(--oc-text-faint);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: default;
  transition: transform var(--oc-slow) cubic-bezier(0.6, -0.2, 0.4, 1.2), opacity var(--oc-slow) ease, box-shadow var(--oc-fast), background var(--oc-fast);
}
.slot:disabled { opacity: 1; }
.slot--filled { background: #100e0b; box-shadow: inset 0 0 0 1px rgba(233, 223, 200, 0.45); color: var(--oc-text); cursor: pointer; }
.slot--filled:hover { box-shadow: inset 0 0 0 1px var(--oc-danger); }
.slot--new { animation: unlock 1.4s var(--oc-ease-out); }
.slot__ink { font-size: 30px; line-height: 1; }
.slot__name { max-width: 100%; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slot__num { font-size: 9px; }
.is-merging .slot--filled { transform: translate(calc(-1 * var(--x)), calc(-1 * var(--y))) scale(0.4); opacity: 0; }

.is-failing { animation: shake 0.45s ease; }
.athanor__fail {
  margin: 0;
  padding: 8px 14px;
  background: rgba(217, 118, 94, 0.1);
  box-shadow: inset 0 0 0 1px rgba(217, 118, 94, 0.35);
  color: var(--oc-danger);
  font-size: 15px;
  text-align: center;
}
.fail-enter-active, .fail-leave-active { transition: opacity var(--oc-medium) var(--oc-ease-out), transform var(--oc-medium) var(--oc-ease-out); }
.fail-enter-from, .fail-leave-to { opacity: 0; transform: translateY(6px); }

.athanor__actions { display: flex; gap: 12px; }

/* Révélation */
.reveal {
  appearance: none;
  position: absolute;
  inset: 0;
  z-index: 3;
  border: 0;
  background: rgba(12, 10, 8, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  color: var(--oc-text);
}
.reveal__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(224, 182, 84, 0.4) 0%, rgba(224, 182, 84, 0) 68%);
  animation: halo 1.2s var(--oc-ease-out) forwards;
}
.reveal__card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; animation: pop 0.6s var(--oc-ease-spring) both; }
.reveal__image { width: 132px; height: 132px; object-fit: contain; filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5)); }
.reveal__ink { font-size: 76px; line-height: 1; }
.reveal__name { font-family: var(--oc-font-display); font-size: 40px; line-height: 1; color: var(--oc-text-strong); }
.reveal__origin { font-size: 17px; }
/* Première découverte : le nom s'embrase un instant */
.reveal__card.is-new .reveal__name { animation: kindle 1.6s var(--oc-ease-out); }
.reveal__card.is-new .reveal__ink, .reveal__card.is-new .reveal__image { animation: rise 0.9s var(--oc-ease-spring) both; }
.reveal-enter-active, .reveal-leave-active { transition: opacity var(--oc-medium) var(--oc-ease-out); }
.reveal-enter-from, .reveal-leave-to { opacity: 0; }

@keyframes turn { to { transform: rotate(360deg); } }
@keyframes unlock {
  0% { transform: scale(0.4); opacity: 0; box-shadow: inset 0 0 0 1px var(--oc-gold), 0 0 0 0 rgba(224, 182, 84, 0.8); }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); box-shadow: inset 0 0 0 1px var(--oc-line-strong), 0 0 0 16px rgba(224, 182, 84, 0); }
}
@keyframes shake {
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
@keyframes halo {
  0% { transform: scale(0.2); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: scale(1.25); opacity: 0.6; }
}
@keyframes kindle {
  0% { color: var(--oc-gold); text-shadow: 0 0 28px rgba(224, 182, 84, 0.95); }
  100% { color: var(--oc-text-strong); text-shadow: 0 0 0 rgba(224, 182, 84, 0); }
}
@keyframes rise {
  0% { transform: translateY(18px) scale(0.6); filter: brightness(2.2); }
  100% { transform: none; filter: none; }
}
@keyframes pop {
  0% { transform: scale(0.4) translateY(10px); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

/* Mobile : dock fixé en bas, emplacements en ligne ; révélation plein écran */
@media (max-width: 859px) {
  .athanor {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 10px;
    padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
    background: #0f0d0a;
    box-shadow: 0 -1px 0 var(--oc-line-strong), 0 -18px 30px rgba(0, 0, 0, 0.6);
  }
  .athanor::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -4px;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    background: var(--oc-gold);
    transform: rotate(45deg);
  }
  .athanor__head { display: none; }
  .athanor__circle { width: auto; height: auto; flex: 0 1 auto; min-width: 0; display: flex; gap: 8px; }
  .athanor__ring, .athanor__center { display: none; }
  .slot { position: relative; left: auto; top: auto; margin: 0; width: 60px; height: 60px; flex-shrink: 0; }
  .slot__ink { font-size: 24px; }
  .slot__name { display: none; }
  .is-merging .slot--filled { transform: scale(0.5); }
  /* Une seule ligne : emplacements puis bouton, qui prend la place restante */
  .athanor__actions { flex: 1; min-width: 0; }
  .athanor__clear { display: none; }
  .athanor__fuse { flex: 1; min-width: 0; min-height: 52px; padding: 0 12px; font-size: 16px; }
  .athanor--multi .slot { width: 52px; height: 52px; }
  .athanor--multi .slot__ink { font-size: 21px; }
  .athanor__fail {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: calc(100% + 12px);
    background: #1a0f0b;
    box-shadow: inset 0 0 0 1px rgba(217, 118, 94, 0.35), 0 8px 24px rgba(0, 0, 0, 0.5);
  }
  .reveal { position: fixed; z-index: 30; background: rgba(12, 10, 8, 0.9); }
  .reveal__name { font-size: 48px; }
}
</style>

