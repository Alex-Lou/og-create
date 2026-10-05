<template>
  <GModal :eyebrow="eyebrow" :title="title" :width="380" @close="$emit('close')">
    <form class="rename" @submit.prevent="save">
      <label class="rename__label" for="rename-input">Nouveau nom</label>
      <input
        id="rename-input"
        ref="input"
        v-model="draft"
        class="rename__input"
        :maxlength="max"
        autocomplete="off"
        autocapitalize="words"
        spellcheck="false"
        :aria-invalid="String(Boolean(draft) && !cleaned)"
        aria-describedby="rename-hint"
      />
      <p id="rename-hint" :class="['rename__hint', { 'is-bad': draft && !cleaned }]">
        2 à {{ max }} lettres ou chiffres ; un espace, un tiret ou une apostrophe entre deux.
      </p>
      <button v-if="current !== base" type="button" class="rename__reset" :disabled="busy" @click="$emit('save', '')">
        Reprendre le nom d’origine : <strong>{{ base }}</strong>
      </button>
    </form>
    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="$emit('close')">Annuler</button>
      <button type="button" class="g-btn" :disabled="busy || !cleaned || cleaned === current" @click="save">Renommer</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import { cleanName, NAME_MAX } from '@/utils/names';

// Renommer un bâtiment (dès son palier III) ou un quartier à soi : le nom actuel, prêt à changer ; le nom d'origine
// se reprend d'un toucher. Le serveur applique les mêmes règles.
export default {
  name: 'RenameSheet',
  components: { GModal },
  props: {
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    current: { type: String, required: true },
    base: { type: String, required: true },
    max: { type: Number, default: NAME_MAX },
    busy: { type: Boolean, default: false }
  },
  emits: ['save', 'close'],
  data() {
    return { draft: this.current };
  },
  computed: {
    cleaned() {
      return cleanName(this.draft, this.max);
    }
  },
  mounted() {
    this.$nextTick(() => this.$refs.input && this.$refs.input.select());
  },
  methods: {
    save() {
      if (this.cleaned && this.cleaned !== this.current) this.$emit('save', this.cleaned);
    }
  }
};
</script>

<style scoped>
.rename { display: grid; gap: 8px; font-family: var(--font-ui); }
.rename__label { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.rename__input {
  min-height: 46px; padding: 8px 14px; border: 1px solid rgba(74, 52, 38, .25); border-radius: 14px;
  background: var(--vellum-50); color: var(--ink-900); font-family: var(--font-display); font-weight: 700; font-size: 19px;
}
.rename__input[aria-invalid='true'] { border-color: #B0503A; }
.rename__hint { margin: 0; font-size: 12px; color: var(--ink-500); }
.rename__hint.is-bad { color: #B0503A; font-weight: 800; }
.rename__reset {
  justify-self: start; padding: 6px 0; border: 0; background: none; color: var(--ink-700); cursor: pointer;
  font-family: var(--font-ui); font-size: 13px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px;
}
</style>
