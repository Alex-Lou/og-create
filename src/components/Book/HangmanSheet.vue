<template>
  <GModal :eyebrow="`Pendu · Chapitre ${chapter.id}`" title="Devine le nom" :width="440" align="center" @close="$emit('close')">
    <div class="hang" :style="{ '--hc': color, '--hi': ink }" @keydown="onKey">
      <!-- L'illustration se recoud pièce par pièce, une par bonne lettre -->
      <div :class="['hang__art', { 'is-whole': hm.name }]" aria-hidden="true">
        <span v-if="hm.emoji" class="hang__glyph"><ElementGlyph :glyph="hm.emoji" /></span>
        <span v-for="k in 9" :key="k" :class="['hang__patch', { 'is-off': shown.has(k - 1) }]"><span>?</span></span>
      </div>

      <p v-if="page.riddle" class="hang__riddle">« {{ page.riddle }} »</p>

      <p class="hang__word" :aria-label="wordLabel">
        <span
          v-for="(char, k) in cells"
          :key="k"
          :class="['hang__cell', { 'is-gap': char === ' ', 'is-mark': char && !isLetter(char), 'is-on': char && char !== ' ' }]"
        >{{ char === ' ' ? '' : char }}</span>
      </p>

      <p class="hang__lives" :aria-label="`${hm.max - hm.misses} erreur(s) permise(s) sur ${hm.max}`">
        <span v-for="k in hm.max" :key="k" :class="['hang__drop', { 'is-lost': k > hm.max - hm.misses }]" aria-hidden="true"></span>
        <span class="hang__lives-text">{{ livesText }}</span>
      </p>

      <!-- Fin de partie : nom trouvé (à fabriquer) ou partie perdue -->
      <div v-if="hm.name" class="hang__end is-won" role="status">
        <p><strong>{{ hm.name }}</strong> ! Il te reste à le fabriquer.</p>
        <button type="button" class="g-btn" @click="$emit('craft')">Chercher la recette</button>
      </div>
      <div v-else-if="hm.failedUntil" class="hang__end is-lost" role="status">
        <p>Toutes les gouttes sont tombées : le pendu se rouvre {{ reopens }}.</p>
        <button v-if="isLoggedIn" type="button" class="g-btn" :disabled="busy" @click="$emit('retry')">Rejouer · {{ retryPrice }} écus</button>
        <p v-else class="hang__note">Avec un compte, tu peux rejouer tout de suite contre des écus.</p>
      </div>

      <div v-else class="hang__keys" role="group" aria-label="Clavier">
        <div v-for="row in ROWS" :key="row" class="hang__row">
          <button
            v-for="letter in row"
            :key="letter"
            type="button"
            :class="['hang__key', keyState(letter)]"
            :disabled="busy || tried.has(letter)"
            :aria-label="`Lettre ${letter}`"
            @click="$emit('guess', letter)"
          >{{ letter }}</button>
        </div>
      </div>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { shownPatches } from '@/book/patchwork';

const ROWS = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'];
const fold = char => char.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

// Le pendu d'une page à portée : le serveur juge chaque lettre, cette feuille ne fait que montrer son verdict
export default {
  name: 'HangmanSheet',
  components: { GModal, ElementGlyph },
  props: {
    // Page à portée, avec son état de pendu (page.hangman)
    page: { type: Object, required: true },
    chapter: { type: Object, required: true },
    color: { type: String, default: '#F1E7D2' },
    ink: { type: String, default: '#4A3426' },
    isLoggedIn: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    retryPrice: { type: Number, default: 20 }
  },
  emits: ['guess', 'retry', 'craft', 'close'],
  data() {
    return { ROWS };
  },
  computed: {
    hm() {
      return this.page.hangman;
    },
    cells() {
      return this.hm.name ? [...this.hm.name] : this.hm.mask.map(char => char || '');
    },
    tried() {
      return new Set(this.hm.tried);
    },
    // Lettres présentes dans le mot (d'après le masque) : pour colorer les touches
    found() {
      return new Set(this.cells.filter(Boolean).map(fold));
    },
    shown() {
      return shownPatches(this.page.id, this.hm);
    },
    livesText() {
      const left = this.hm.max - this.hm.misses;
      if (this.hm.name) return 'Mot trouvé';
      if (this.hm.failedUntil) return 'Partie perdue';
      return left > 1 ? `${left} erreurs permises` : left === 1 ? 'Dernière erreur permise' : '';
    },
    reopens() {
      const at = new Date(this.hm.failedUntil);
      const time = at.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return at.toDateString() === new Date().toDateString() ? `à ${time}` : `demain à ${time}`;
    },
    wordLabel() {
      return this.hm.name ? `Mot trouvé : ${this.hm.name}` : `Mot : ${this.cells.map(c => c || 'blanc').join(', ')}`;
    }
  },
  methods: {
    isLetter: char => /^[A-Z]$/.test(fold(char)),
    keyState(letter) {
      if (!this.tried.has(letter)) return '';
      return this.found.has(letter) ? 'is-hit' : 'is-miss';
    },
    // Clavier physique : une lettre tapée = une touche
    onKey(event) {
      const letter = event.key && event.key.length === 1 ? fold(event.key) : '';
      if (!/^[A-Z]$/.test(letter) || this.busy || this.hm.name || this.hm.failedUntil || this.tried.has(letter)) return;
      event.preventDefault();
      this.$emit('guess', letter);
    }
  }
};
</script>

<style scoped>
.hang { display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 4px; outline: none; }

.hang__art {
  position: relative;
  width: 132px;
  height: 132px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle at 38% 30%, #fff, var(--hc));
  box-shadow: 0 0 0 5px var(--vellum-50), 0 0 0 6px var(--oc-line), var(--shadow-2);
}
.hang__glyph { position: absolute; inset: 0; display: grid; place-items: center; font-size: 84px; line-height: 1; }
.hang__patch {
  position: relative;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 38% 30%, #fff, var(--hc));
  box-shadow: inset 0 0 0 0.5px rgba(74, 52, 38, 0.18);
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 18px;
  color: var(--hi);
  opacity: 1;
  transition: opacity var(--oc-medium) var(--oc-ease-out), transform var(--oc-medium) var(--oc-ease-spring);
}
.hang__patch span { opacity: 0.35; }
/* Pièce gagnée : elle s'envole et laisse voir l'illustration */
.hang__patch.is-off { opacity: 0; transform: scale(0.6) rotate(8deg); }
.hang__art.is-whole { animation: whole 0.8s var(--oc-ease-spring); }

.hang__riddle { margin: 0; max-width: 34ch; text-align: center; font-family: var(--oc-font-display); font-style: italic; font-size: 16px; line-height: 1.35; color: var(--ink-700); }

.hang__word { margin: 4px 0 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.hang__cell {
  min-width: 26px;
  height: 36px;
  display: grid;
  place-items: center;
  border-bottom: 2.5px solid var(--ink-300);
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 24px;
  color: var(--hi);
}
.hang__cell.is-on { border-bottom-color: var(--hi); animation: land 0.35s var(--oc-ease-spring); }
.hang__cell.is-gap { min-width: 10px; border: 0; }
.hang__cell.is-mark { min-width: 10px; border: 0; color: var(--ink-500); animation: none; }

.hang__lives { margin: 0; display: flex; align-items: center; gap: 6px; }
/* Gouttes d'encre : une par erreur permise */
.hang__drop {
  width: 14px;
  height: 18px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: radial-gradient(circle at 35% 35%, #6b5446, var(--ink-900));
  clip-path: path('M7 0 C7 0 14 9 14 12 A7 6.5 0 0 1 0 12 C0 9 7 0 7 0 Z');
  transition: opacity var(--oc-medium), transform var(--oc-medium);
}
.hang__drop.is-lost { opacity: 0.18; transform: scale(0.8); }
.hang__lives-text { margin-left: 4px; font-weight: 800; font-size: 13px; color: var(--ink-500); }

.hang__keys { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
.hang__row { display: flex; justify-content: center; gap: 5px; width: 100%; }
.hang__key {
  appearance: none;
  flex: 0 1 34px;
  min-width: 0;
  height: 44px;
  border: 0;
  border-radius: var(--r-xs);
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400);
  font-family: var(--oc-font-body);
  font-weight: 900;
  font-size: 16px;
  color: var(--ink-900);
  cursor: pointer;
  transition: transform var(--oc-fast) var(--oc-ease-out), background var(--oc-fast);
}
.hang__key:active:not(:disabled) { transform: translateY(2px); box-shadow: inset 0 0 0 1px var(--oc-line); }
.hang__key:disabled { cursor: default; }
.hang__key.is-hit { background: var(--verdigris-100); color: var(--verdigris-500); box-shadow: inset 0 0 0 1px var(--verdigris-500); }
.hang__key.is-miss { background: transparent; color: var(--ink-300); box-shadow: inset 0 0 0 1px var(--oc-line); text-decoration: line-through; }

.hang__end { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.hang__end p { margin: 0; font-size: 16px; color: var(--ink-700); }
.hang__end strong { font-family: var(--oc-font-display); font-size: 20px; color: var(--hi); }
.hang__note { font-size: 14px !important; color: var(--ink-500) !important; }

@keyframes land { 0% { transform: translateY(-8px); opacity: 0; } 100% { transform: none; opacity: 1; } }
@keyframes whole { 40% { transform: scale(1.08); } }

@media (prefers-reduced-motion: reduce) {
  .hang__patch, .hang__cell.is-on, .hang__art.is-whole { transition: none; animation: none; }
}
</style>
