<template>
  <section
    ref="zone"
    :class="['craft-zone', { 'craft-zone--multi': slotCount > 2, 'craft-zone--over': dragOver }]"
    aria-label="Zone de création"
    @dragenter.prevent="dragOver = true"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <p class="craft-zone__hint" v-if="!picked.length && !result && !failMessage">
      Choisis des éléments à fusionner
    </p>
    <!-- Échec : dit dans la zone elle-même, sans jamais couvrir le bouton Fusionner -->
    <transition name="fail">
      <p v-if="failMessage" class="craft-zone__fail" role="status">{{ failMessage }}</p>
    </transition>

    <div :class="['craft-zone__slots', { 'is-failing': failing }]">
      <template v-for="(slot, index) in slots" :key="index">
        <span v-if="index > 0" class="craft-zone__plus" :class="{ 'is-hidden': merging }" aria-hidden="true">+</span>
        <button
          type="button"
          :ref="el => setSlotRef(el, index)"
          :class="['slot', { 'slot--filled': slot.name, 'slot--new': unlockedIndex === index }]"
          :style="slot.style"
          :aria-label="slot.name ? `Retirer ${slot.name}` : `Emplacement ${index + 1} vide`"
          :disabled="!slot.name || merging"
          @click="remove(index)"
        >
          <template v-if="slot.name">
            <span class="slot__emoji">{{ emojiOf(slot.name) }}</span>
            <span class="slot__name">{{ slot.name }}</span>
          </template>
        </button>
      </template>
    </div>

    <div class="craft-zone__actions">
      <button type="button" class="btn-ghost" aria-label="Vider la zone" :disabled="!picked.length || merging" @click="clear">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path></svg>
      </button>
      <button v-if="showFuseButton" type="button" class="btn-fuse" :disabled="picked.length < 2 || merging" @click="fuse">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"></path></svg>
        <span>{{ merging ? 'Fusion…' : 'Fusionner' }}</span>
      </button>
    </div>

    <!-- Révélation du résultat : dans la zone sur PC, plein écran sur mobile -->
    <transition name="reveal">
      <button v-if="result" type="button" class="reveal" aria-live="polite" @click="dismiss">
        <span class="reveal__halo" aria-hidden="true"></span>
        <span class="reveal__card">
          <img v-if="result.image" class="reveal__image" :src="result.image" :alt="result.name" />
          <span v-else class="reveal__emoji">{{ emojiOf(result.name) }}</span>
          <span class="reveal__name">{{ result.name }}</span>
          <span v-if="result.isNew" class="reveal__badge">Nouvelle découverte</span>
          <span v-else class="reveal__known">Déjà dans ton inventaire</span>
        </span>
      </button>
    </transition>
  </section>
</template>

<script>
import { findRecipe } from '@/utils/recipes';

const MERGE_MS = 520;
const REVEAL_MS = 1700;
const FAIL_MS = 1800;

function creatureImage(name) {
  try {
    return require(`@/assets/creatures/${name}.png`);
  } catch {
    return null;
  }
}

// Zone de fusion : 2 à 4 emplacements, fusion automatique quand il n'y en a que 2
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
    slots() {
      const center = (this.slotCount - 1) / 2;
      return Array.from({ length: this.slotCount }, (_, i) => {
        const name = this.picked[i] || null;
        // Pendant la fusion, chaque élément glisse vers le centre et s'efface
        const offset = (center - i) * 100;
        const style = this.merging && name ? { transform: `translateX(${offset}%) scale(.6)`, opacity: 0 } : null;
        return { name, style };
      });
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
      if (from) this.$nextTick(() => this.fly(name, from, this.slotEls[index]));
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
        this.result = { name, isNew, image: creatureImage(name) };
        this.$emit('craft-success', name);
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
    },

    // Petite « comète » de la carte vers l'emplacement
    fly(name, from, target) {
      if (!target || !target.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      const to = target.getBoundingClientRect();
      const ghost = document.createElement('div');
      ghost.className = 'craft-ghost';
      ghost.textContent = this.emojiOf(name);
      Object.assign(ghost.style, { left: `${from.left + from.width / 2 - 20}px`, top: `${from.top + from.height / 2 - 20}px` });
      document.body.appendChild(ghost);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const animation = ghost.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.25)`, opacity: 1, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(.8)`, opacity: 0.2 }
        ],
        { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      animation.onfinish = () => ghost.remove();
    }
  }
};
</script>

<style scoped>
.craft-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 260px;
  padding: 24px 16px;
  border-radius: var(--oc-radius-lg);
  background: rgba(12, 9, 24, 0.55);
  border: 1px solid var(--oc-line);
  transition: border-color var(--oc-medium) var(--oc-ease-out), box-shadow var(--oc-medium) var(--oc-ease-out);
}

.craft-zone--over {
  border-color: var(--oc-accent-line);
  box-shadow: 0 0 0 4px var(--oc-accent-soft);
}

.craft-zone__hint {
  margin: 0;
  font-size: 13px;
  color: var(--oc-text-faint);
}

.craft-zone__slots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.craft-zone__plus {
  color: var(--oc-text-faint);
  font-size: 20px;
  transition: opacity var(--oc-medium);
}
.craft-zone__plus.is-hidden { opacity: 0; }

.is-failing { animation: shake 0.45s ease; }
.craft-zone__fail {
  margin: 0;
  padding: 8px 14px;
  border-radius: var(--oc-radius-sm);
  background: rgba(252, 165, 165, 0.1);
  color: var(--oc-danger);
  font-size: 13px;
  text-align: center;
}
.fail-enter-active, .fail-leave-active { transition: opacity var(--oc-medium) var(--oc-ease-out), transform var(--oc-medium) var(--oc-ease-out); }
.fail-enter-from, .fail-leave-to { opacity: 0; transform: translateY(6px); }

.slot {
  appearance: none;
  width: 108px;
  height: 108px;
  padding: 6px;
  border-radius: 26px;
  border: 1.5px dashed var(--oc-line-strong);
  background: rgba(7, 6, 13, 0.35);
  color: var(--oc-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: default;
  transition: transform var(--oc-slow) cubic-bezier(0.6, -0.2, 0.4, 1.2), opacity var(--oc-slow) ease,
    border-color var(--oc-fast), background var(--oc-fast);
  animation: breathe 3.2s ease-in-out infinite;
}
.slot:disabled { opacity: 1; }
.slot--filled {
  border-style: solid;
  border-color: rgba(196, 181, 253, 0.4);
  background: rgba(30, 22, 54, 0.75);
  cursor: pointer;
  animation: none;
}
.slot--filled:hover { border-color: var(--oc-danger); }
.slot--new { animation: unlock 1.4s var(--oc-ease-out); }
.slot__emoji { font-size: 42px; line-height: 1; }
.slot__name { font-size: 12px; font-weight: 500; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.craft-zone--multi .slot { width: 92px; height: 92px; }
.craft-zone--multi .slot__emoji { font-size: 34px; }

.craft-zone__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-ghost {
  appearance: none;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1px solid var(--oc-line-strong);
  background: var(--oc-panel);
  color: var(--oc-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color var(--oc-fast), border-color var(--oc-fast);
}
.btn-ghost:hover:not(:disabled) { color: var(--oc-text); border-color: var(--oc-accent-line); }
.btn-ghost:disabled { opacity: 0.4; cursor: default; }

.btn-fuse {
  appearance: none;
  height: 48px;
  padding: 0 26px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(180deg, var(--oc-accent), var(--oc-accent-strong));
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: var(--oc-shadow-accent);
  transition: transform var(--oc-fast) var(--oc-ease-out), opacity var(--oc-fast);
}
.btn-fuse:active:not(:disabled) { transform: scale(0.97); }
.btn-fuse:disabled { opacity: 0.35; box-shadow: none; cursor: default; }

/* Révélation */
.reveal {
  appearance: none;
  position: absolute;
  inset: 0;
  z-index: 3;
  border: 0;
  border-radius: inherit;
  background: rgba(12, 9, 24, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}
.reveal__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 280px;
  height: 280px;
  margin: -140px 0 0 -140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.55) 0%, rgba(167, 139, 250, 0.35) 38%, rgba(167, 139, 250, 0) 70%);
  animation: halo 1.1s var(--oc-ease-out) forwards;
}
.reveal__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: pop 0.6s var(--oc-ease-spring) both;
}
.reveal__image {
  width: 132px;
  height: 132px;
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5));
}
.reveal__emoji { font-size: 72px; line-height: 1; }
.reveal__name {
  font-family: var(--oc-font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--oc-text-strong);
}
.reveal__badge {
  padding: 4px 12px;
  border-radius: var(--oc-radius-pill);
  background: var(--oc-gold);
  color: #3b2a05;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.reveal__known { font-size: 12px; color: var(--oc-text-muted); }

.reveal-enter-active, .reveal-leave-active { transition: opacity var(--oc-medium) var(--oc-ease-out); }
.reveal-enter-from, .reveal-leave-to { opacity: 0; }

@keyframes breathe {
  0%, 100% { border-color: rgba(196, 181, 253, 0.22); }
  50% { border-color: rgba(196, 181, 253, 0.42); }
}
@keyframes unlock {
  0% { transform: scale(0.4); opacity: 0; box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.8); border-color: var(--oc-gold); }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); box-shadow: 0 0 0 16px rgba(250, 204, 21, 0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
@keyframes halo {
  0% { transform: scale(0.2); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: scale(1.25); opacity: 0; }
}
@keyframes pop {
  0% { transform: scale(0.3) translateY(10px); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

/* Mobile : dock fixé en bas, dans la zone du pouce ; révélation plein écran */
@media (max-width: 859px) {
  .craft-zone {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    min-height: 0;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
    border-bottom: 0;
    /* Opaque : les cartes qui défilent dessous ne doivent pas transparaître */
    background: #0e0b1a;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.45);
  }
  .craft-zone__hint { display: none; }
  .craft-zone__fail {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: calc(100% + 10px);
    background: #1c1016;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  }
  .craft-zone__slots { gap: 8px; }
  .craft-zone__plus { font-size: 16px; }
  .slot { width: 64px; height: 64px; border-radius: 18px; gap: 2px; }
  .slot__emoji { font-size: 26px; }
  .slot__name { font-size: 10px; }
  .craft-zone--multi { flex-direction: column; align-items: stretch; gap: 10px; }
  .craft-zone--multi .craft-zone__slots { justify-content: space-between; }
  .craft-zone--multi .slot { width: 68px; height: 68px; }
  .craft-zone--multi .slot__emoji { font-size: 26px; }
  .craft-zone--multi .btn-fuse { flex: 1; justify-content: center; }
  .btn-fuse { padding: 0 18px; }
  .reveal {
    position: fixed;
    z-index: 30;
    border-radius: 0;
    background: rgba(7, 6, 13, 0.72);
  }
}
</style>

<style>
/* Comète animée (ajoutée au body, hors du composant) */
.craft-ghost {
  position: fixed;
  z-index: 50;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  pointer-events: none;
  filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.8));
}
</style>
