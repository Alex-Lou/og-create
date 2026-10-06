<template>
  <GModal :eyebrow="`Pendu · Chapitre ${chapter.id}`" title="Devine le nom" :width="440" align="center" @close="$emit('close')">
    <div class="hang" :style="{ '--hc': color, '--hi': ink }" @keydown="onKey">
      <!-- L'illustration se recoud pièce par pièce, une par lettre posée -->
      <div :class="['hang__art', { 'is-whole': inscribed }]" aria-hidden="true">
        <span v-if="hm.emoji" class="hang__glyph"><ElementGlyph :glyph="hm.emoji" /></span>
        <span v-for="k in 9" :key="k" :class="['hang__patch', { 'is-off': shown.has(k - 1) }]"><span>?</span></span>
      </div>

      <p v-if="page.riddle" class="hang__riddle">« {{ page.riddle }} »</p>
      <!-- Le type de l'élément, pour ne pas chercher dans le vide -->
      <p v-if="kind" class="hang__kind">✦ {{ kind }} ✦</p>

      <!-- Le mot : on touche une case, puis une lettre -->
      <p class="hang__word" role="group" :aria-label="wordLabel">
        <template v-for="(char, k) in cells" :key="k">
          <span v-if="!playable[k]" :class="['hang__cell', char === ' ' ? 'is-gap' : 'is-mark']">{{ char === ' ' ? '' : char }}</span>
          <button
            v-else
            type="button"
            :class="['hang__cell', { 'is-on': char, 'is-pending': !char && pending && pending.position === k, 'is-picked': !char && k === selected && playing && !pending, 'is-shake': k === shaken }]"
            :disabled="Boolean(char) || !playing"
            :aria-label="char ? `Case ${k + 1} : ${char}` : `Case ${k + 1}, vide`"
            :aria-pressed="!char && k === selected"
            @click="pick(k)"
          >{{ char || (pending && pending.position === k ? pending.letter : '') }}</button>
        </template>
      </p>
      <p class="hang__say" aria-live="polite">{{ say }}</p>

      <p class="hang__lives" :aria-label="`${hm.max - hm.misses} erreur(s) permise(s) sur ${hm.max}`">
        <span v-for="k in hm.max" :key="k" :class="['hang__drop', { 'is-lost': k > hm.max - hm.misses }]" aria-hidden="true"></span>
        <span class="hang__lives-text">{{ livesText }}</span>
      </p>

      <!-- Fin de partie : élément inscrit, ou partie perdue -->
      <div v-if="inscribed" class="hang__end is-won" role="status">
        <p><strong>{{ inscribed }}</strong> rejoint ton registre&nbsp;!</p>
        <button type="button" class="g-btn" @click="$emit('close')">Voir la page</button>
      </div>
      <div v-else-if="hm.failedUntil" class="hang__end is-lost" role="status">
        <p>Toutes les gouttes sont tombées&nbsp;: le pendu se rouvre {{ reopens }}.</p>
        <button v-if="isLoggedIn" type="button" class="g-btn" :disabled="busy" @click="$emit('retry')">Rejouer · {{ retryPrice }} écus</button>
        <p v-else class="hang__note">Avec un compte, tu peux rejouer tout de suite contre des écus.</p>
      </div>

      <div v-else class="hang__keys" role="group" aria-label="Clavier">
        <div v-for="row in ROWS" :key="row" class="hang__row">
          <button
            v-for="letter in row"
            :key="letter"
            type="button"
            :class="['hang__key', keyState(letter), { 'is-sending': pending && pending.letter === letter }]"
            :disabled="selected < 0 || absent.has(letter)"
            :aria-label="`Lettre ${letter}`"
            @click="put(letter)"
          >{{ letter }}</button>
        </div>
      </div>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { shownPatches } from '@/book/patchwork';
import { FAMILY_WORDS } from '@/book/painter';

const ROWS = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'];
const fold = char => char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
const isLetter = char => /^[A-Z]$/.test(fold(char));

// Le pendu d'une page à portée : le joueur choisit une case puis une lettre ; le serveur juge chaque lettre
// (juste, ailleurs dans le mot, absente). Cette feuille ne fait que montrer son verdict.
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
    retryPrice: { type: Number, default: 20 },
    // Dernier verdict du serveur : { position, letter, verdict }
    verdict: { type: Object, default: null },
    // Nom de l'élément inscrit (mot complet), sinon vide
    inscribed: { type: String, default: '' }
  },
  emits: ['guess', 'retry', 'close'],
  data() {
    // pending : lettre posée, affichée tout de suite en attendant le verdict du serveur (le réseau peut être lent)
    return { ROWS, selected: -1, shaken: -1, pending: null };
  },
  computed: {
    hm() {
      return this.page.hangman;
    },
    kind() {
      return FAMILY_WORDS[this.page.family] || '';
    },
    cells() {
      return this.inscribed ? [...this.inscribed] : this.hm.mask.map(char => char || '');
    },
    // Cases de lettres (cachées ou déjà posées) ; espaces, tirets, apostrophes restent figés
    playable() {
      return this.hm.mask.map(char => !char || isLetter(char));
    },
    playing() {
      return !this.inscribed && !this.hm.failedUntil;
    },
    absent() {
      return new Set(this.hm.absent || []);
    },
    placed() {
      return new Set(this.cells.filter(Boolean).map(fold));
    },
    shown() {
      return shownPatches(this.page.id, { ...this.hm, name: this.inscribed || undefined });
    },
    livesText() {
      const left = this.hm.max - this.hm.misses;
      if (this.inscribed) return 'Mot trouvé';
      if (this.hm.failedUntil) return 'Partie perdue';
      return left > 1 ? `${left} erreurs permises` : left === 1 ? 'Dernière erreur permise' : '';
    },
    say() {
      if (!this.verdict || !this.playing) return '';
      const { letter, verdict } = this.verdict;
      if (verdict === 'elsewhere') return `«\u00a0${letter}\u00a0» est dans le mot, mais pas ici.`;
      if (verdict === 'miss') return `Pas de «\u00a0${letter}\u00a0» dans ce mot.`;
      return '';
    },
    reopens() {
      const at = new Date(this.hm.failedUntil);
      const time = at.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return at.toDateString() === new Date().toDateString() ? `à ${time}` : `demain à ${time}`;
    },
    wordLabel() {
      return `Mot de ${this.cells.length} lettres : ${this.cells.map(c => c || 'vide').join(', ')}`;
    }
  },
  watch: {
    // Après chaque verdict : la case suivante encore vide est choisie ; une lettre mal placée fait trembler sa case
    'hm.mask': {
      handler() {
        this.pending = null;
        if (this.selected < 0 || this.hm.mask[this.selected]) this.selectNext();
      },
      immediate: true
    },
    // Réponse reçue (ou échec réseau) : la lettre en attente laisse place à l'état du serveur
    busy(now) {
      if (!now) this.pending = null;
    },
    verdict(next) {
      this.pending = null;
      // La lettre posée repart : mal placée ou absente du mot
      if (next && next.verdict !== 'hit') {
        this.shaken = next.position;
        setTimeout(() => (this.shaken = -1), 450);
      }
    }
  },
  methods: {
    selectNext() {
      const from = Math.max(0, this.selected);
      const order = [...this.hm.mask.keys()].map(i => (from + i) % this.hm.mask.length);
      this.selected = order.find(k => !this.hm.mask[k]) ?? -1;
    },
    pick(k) {
      if (!this.pending) this.selected = k;
    },
    put(letter) {
      if (this.busy || this.pending || this.selected < 0 || !this.playing || this.absent.has(letter)) return;
      this.pending = { position: this.selected, letter };
      this.$emit('guess', { position: this.selected, letter });
    },
    // Lettre absente : barrée ; posée quelque part : verte ; dans le mot mais pas encore posée : ambre
    keyState(letter) {
      if (this.absent.has(letter)) return 'is-miss';
      if (this.placed.has(letter)) return 'is-hit';
      return (this.hm.tried || []).includes(letter) ? 'is-elsewhere' : '';
    },
    // Clavier physique : une lettre tapée = une touche ; flèches pour changer de case
    onKey(event) {
      if (!this.playing) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const step = event.key === 'ArrowRight' ? 1 : -1;
        const n = this.hm.mask.length;
        for (let k = 1; k < n; k++) {
          const next = (this.selected + step * k + n) % n;
          if (!this.hm.mask[next]) { this.pick(next); break; }
        }
        event.preventDefault();
        return;
      }
      const letter = event.key && event.key.length === 1 ? fold(event.key) : '';
      if (!/^[A-Z]$/.test(letter)) return;
      event.preventDefault();
      this.put(letter);
    }
  }
};
</script>

<style scoped src="./HangmanSheet.css"></style>
