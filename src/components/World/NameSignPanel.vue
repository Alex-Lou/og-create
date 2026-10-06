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
import NameSignArt from './NameSignArt.vue';
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

<style scoped>
.name-sign { display: grid; gap: 10px; margin-bottom: 14px; font-family: var(--font-ui); }
.name-sign__title { margin: 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.name-sign__teaser { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: var(--r-tile); background: var(--vellum-200); }
.name-sign__teaser p { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.4; color: var(--ink-700); }
.name-sign__name { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border-radius: var(--r-sm); background: var(--vellum-200); font-size: 14px; font-weight: 700; }
.name-sign__name strong { font-family: var(--font-display); font-size: 16px; }
.name-sign__link {
  border: 0; background: none; padding: 6px 4px; color: var(--ink-900); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
  text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
}
.name-sign__form { display: grid; gap: 6px; padding: 10px 12px; border-radius: var(--r-sm); background: var(--vellum-200); }
.name-sign__label { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.name-sign__row { display: flex; gap: 6px; flex-wrap: wrap; }
.name-sign__input {
  flex: 1 1 140px; min-width: 0; min-height: 40px; padding: 6px 12px; border: 1px solid rgba(74, 52, 38, .25); border-radius: var(--r-sm);
  background: var(--vellum-50); color: var(--ink-900); font-family: var(--font-display); font-weight: 700; font-size: 17px;
}
.name-sign__input[aria-invalid='true'] { border-color: #B0503A; }
.name-sign__hint { margin: 0; font-size: 12px; color: var(--ink-500); }
.name-sign__hint.is-bad { color: #B0503A; font-weight: 800; }
.name-sign__styles { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.name-sign__card {
  display: grid; justify-items: center; align-content: start; gap: 4px; padding: 8px 8px 10px; border-radius: var(--r-md); text-align: center;
  background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1);
}
.name-sign__card.is-worn { box-shadow: inset 0 0 0 2px var(--gold-400); }
.name-sign__art { display: grid; place-items: center; width: 100%; padding: 4px 0; border-radius: var(--r-sm); background: radial-gradient(circle at 50% 78%, #CFE8B8, var(--vellum-200) 74%); }
.name-sign__style { font-family: var(--font-display); font-weight: 700; font-size: 15px; line-height: 1.15; }
.name-sign__text { color: var(--ink-500); font-size: 12px; font-weight: 700; line-height: 1.3; }
.name-sign__btn {
  min-height: 38px; min-width: 88px; padding: 6px 14px; border: 0; border-radius: var(--r-pill); margin-top: 2px;
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
  cursor: pointer; touch-action: manipulation;
}
.name-sign__btn--quiet { background: var(--vellum-200); color: var(--ink-900); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .18); }
.name-sign__btn.is-confirm { background: var(--gold-400); color: var(--ink-900); box-shadow: 0 3px 0 var(--gold-600); }
.name-sign__btn:disabled { opacity: .45; cursor: default; }
.name-sign__worn { margin-top: 2px; padding: 9px 0; color: #4E8A3A; font-size: 13px; font-weight: 900; }
.name-sign__coin { width: 13px; height: 13px; border-radius: var(--r-round); background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5); }
</style>
