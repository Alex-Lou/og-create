<template>
  <section class="name-sign" aria-label="Enseigne">
    <h3 class="name-sign__title">Enseigne</h3>
    <!-- Avant le palier V : ce qui viendra -->
    <div v-if="site.level < signs.level" class="name-sign__teaser">
      <NameSignArt sign-style="bois" :name="signs.name" :width="78" />
      <p>Au palier {{ roman(signs.level) }}, ce bâtiment portera une enseigne à ton nom, dans le style de ton choix.</p>
    </div>
    <template v-else>
      <!-- Le nom écrit sur toutes les enseignes de l'île : aperçu en direct pendant la saisie -->
      <div v-if="!editing" class="name-sign__name">
        <span>Nom écrit : <strong>{{ signs.name }}</strong></span>
        <button type="button" class="name-sign__link" :disabled="busy" @click="startEdit">Modifier</button>
      </div>
      <form v-else class="name-sign__form" @submit.prevent="submit">
        <label class="name-sign__label" for="name-sign-input">Nom sur tes enseignes</label>
        <div class="name-sign__row">
          <input
            id="name-sign-input"
            ref="input"
            v-model="draft"
            class="name-sign__input"
            :maxlength="signs.nameMax"
            autocomplete="off"
            autocapitalize="words"
            spellcheck="false"
            :aria-invalid="String(Boolean(draft) && !cleaned)"
            aria-describedby="name-sign-hint"
          />
          <button type="submit" class="name-sign__btn" :disabled="busy || !cleaned">Valider</button>
          <button type="button" class="name-sign__btn name-sign__btn--quiet" @click="editing = false">Annuler</button>
        </div>
        <p id="name-sign-hint" :class="['name-sign__hint', { 'is-bad': draft && !cleaned }]">
          2 à {{ signs.nameMax }} lettres ou chiffres ; un espace, un tiret ou une apostrophe entre deux.
        </p>
      </form>
      <ul class="name-sign__styles">
        <li v-for="look in signs.styles" :key="look.id" :class="['name-sign__card', { 'is-worn': site.sign === look.id }]">
          <span class="name-sign__art"><NameSignArt :sign-style="look.id" :name="preview" :width="112" :label="look.name" /></span>
          <span class="name-sign__style">{{ look.name }}</span>
          <span class="name-sign__text">{{ look.text }}</span>
          <span v-if="site.sign === look.id" class="name-sign__worn">Portée</span>
          <button v-else-if="look.owned" type="button" class="name-sign__btn name-sign__btn--quiet" :disabled="busy" @click="$emit('choose', look)">Porter</button>
          <button
            v-else
            type="button"
            :class="['name-sign__btn', { 'is-confirm': confirming === look.id }]"
            :disabled="busy || (coins !== null && coins < look.price)"
            :aria-label="confirming === look.id ? `Confirmer l’achat : ${look.name}, ${look.price} écus` : `${look.name} : ${look.price} écus`"
            @click="buy(look)"
          >
            <template v-if="confirming === look.id">Confirmer · {{ look.price }}</template>
            <template v-else>{{ look.price }}<span class="name-sign__coin" aria-hidden="true"></span></template>
          </button>
        </li>
      </ul>
    </template>
  </section>
</template>

<script>
import NameSignArt from '../NameSignArt/NameSignArt.vue';
import { roman } from '@/utils/roman';
import { cleanSignName } from '@/world/nameSigns';

// Délai pour confirmer un achat (second toucher)
const CONFIRM_MS = 3000;

// Section « Enseigne » de la boutique d'un bâtiment (dès le palier V) : le nom écrit sur les enseignes de l'île, et les
// six styles à porter (achetés une fois, d'un double toucher). Le serveur tranche (prix, palier, nom).
export default {
  name: 'NameSignPanel',
  components: { NameSignArt },
  props: {
    site: { type: Object, required: true },
    // Vue du serveur : { name, level, nameMax, styles: [{ id, name, price, text, owned }] }
    signs: { type: Object, required: true },
    coins: { type: Number, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['choose', 'rename'],
  data() {
    return { editing: false, draft: '', confirming: null };
  },
  computed: {
    cleaned() {
      return cleanSignName(this.draft);
    },
    // Ce qu'affichent les aperçus : le nom en cours de saisie s'il convient
    preview() {
      return (this.editing && this.cleaned) || this.signs.name;
    }
  },
  beforeUnmount() {
    clearTimeout(this.confirmTimer);
  },
  methods: {
    roman,
    startEdit() {
      this.draft = this.signs.name;
      this.editing = true;
      this.$nextTick(() => this.$refs.input && this.$refs.input.select());
    },
    submit() {
      if (!this.cleaned) return;
      if (this.cleaned !== this.signs.name) this.$emit('rename', this.cleaned);
      this.editing = false;
    },
    // Premier toucher : « Confirmer » ; second toucher (dans les 3 s) : achat et port
    buy(look) {
      clearTimeout(this.confirmTimer);
      if (this.confirming === look.id) {
        this.confirming = null;
        this.$emit('choose', look);
        return;
      }
      this.confirming = look.id;
      this.confirmTimer = setTimeout(() => { this.confirming = null; }, CONFIRM_MS);
    }
  }
};
</script>

<style scoped src="./NameSignPanel.css"></style>
