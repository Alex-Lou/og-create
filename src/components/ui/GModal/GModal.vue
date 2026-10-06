<template>
  <teleport to="body">
    <div class="g-modal-backdrop" @mousedown.self="dismissible && close()">
      <section
        ref="dialog"
        :class="['g-modal', 'g-panel', `g-modal--${align}`]"
        :style="{ width: `min(${width}px, 100%)` }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : null"
        :aria-label="title ? null : label"
        tabindex="-1"
        @keydown.esc.stop="dismissible && close()"
      >
        <button v-if="dismissible" type="button" class="g-modal__close" aria-label="Fermer" @click="close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"></path></svg>
        </button>
        <header v-if="eyebrow || title" class="g-modal__head">
          <span v-if="eyebrow" class="g-mono">{{ eyebrow }}</span>
          <h2 v-if="title" :id="titleId" class="g-title">{{ frenchSpaces(title) }}</h2>
        </header>
        <slot></slot>
        <footer v-if="$slots.actions" class="g-modal__actions">
          <slot name="actions"></slot>
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script>
import { frenchSpaces } from '@/utils/typo';
let uid = 0;

// Fenêtre unique du jeu : fond assombri, Échap / clic à côté pour fermer, focus gardé dans la fenêtre
export default {
  name: 'GModal',
  props: {
    title: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    // Nom accessible quand la fenêtre n'a pas de titre visible
    label: { type: String, default: 'Fenêtre' },
    width: { type: Number, default: 520 },
    align: { type: String, default: 'start', validator: v => ['start', 'center'].includes(v) },
    // Faux : ni croix, ni Échap, ni clic à côté (choix obligatoire)
    dismissible: { type: Boolean, default: true }
  },
  emits: ['close'],
  data() {
    return { titleId: `g-modal-title-${++uid}` };
  },
  mounted() {
    this.previousFocus = document.activeElement;
    // Premier contrôle visible (un contrôle masqué, propre au mobile par exemple, ne peut pas recevoir le focus)
    const first = [...this.$refs.dialog.querySelectorAll('input, textarea, select, button:not(.g-modal__close), a[href]')]
      .find(el => el.offsetParent !== null);
    (first || this.$refs.dialog).focus({ preventScroll: true });
  },
  beforeUnmount() {
    this.previousFocus?.focus?.({ preventScroll: true });
  },
  methods: {
    frenchSpaces,
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style src="./GModal.global.css"></style>
