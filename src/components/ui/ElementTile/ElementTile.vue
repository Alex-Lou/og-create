<template>
  <button
    type="button"
    :class="['tile', state, { 'tile--compact': compact }]"
    :style="{ '--tc': tint.color, '--ti': card.ink, '--card': card.card, '--card-edge': card.edge }"
    :aria-label="label"
  >
    <span class="tile__corner" aria-hidden="true"></span>
    <span class="tile__medal" aria-hidden="true"><ElementGlyph :glyph="glyph || 'ui:unknown'" /></span>
    <span v-if="!compact" :class="['tile__name', lengthClass]">{{ name }}</span>
    <span v-if="slotIndex >= 0" class="tile__slot" aria-hidden="true">{{ numeral }}</span>
    <span v-if="badge" class="tile__badge" aria-hidden="true">{{ fertile > 99 ? '99+' : fertile }}</span>
    <span v-if="tag" :class="['tile__tag', `tile__tag--${tag.kind}`]" aria-hidden="true">{{ tag.text }}</span>
  </button>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { styleOfFamily, tintOfFamily } from '@/book/chapters';
import { roman } from '@/utils/roman';

// La tuile d'élément, la même partout (Livre, Épreuve, Île) : carton teinté par sa famille, médaillon teinté par
// le chapitre de sa famille, nom sur deux lignes. Une seule chose brille à la fois : Athanor > Encre > Nouveau.
export default {
  name: 'ElementTile',
  components: { ElementGlyph },
  props: {
    name: { type: String, required: true },
    glyph: { type: String, default: '' },
    family: { type: String, default: '' },
    // Découvert récemment et pas encore utilisé
    isNew: { type: Boolean, default: false },
    // Mélanges inédits qui l'utilisent ; 0 = tout exploré ; null = inconnu
    fertile: { type: Number, default: null },
    // Emplacement de l'Athanor qu'il occupe (0, 1…), -1 sinon
    slotIndex: { type: Number, default: -1 },
    // Ingrédient révélé par l'Encre pour la page ouverte
    ink: { type: Boolean, default: false },
    // Densité compacte : sans nom (Épreuve, longues listes)
    compact: { type: Boolean, default: false }
  },
  computed: {
    tint() {
      return styleOfFamily(this.family);
    },
    card() {
      return tintOfFamily(this.family);
    },
    numeral() {
      return roman(this.slotIndex + 1);
    },
    exhausted() {
      return this.fertile === 0;
    },
    state() {
      if (this.slotIndex >= 0) return 'is-slot';
      if (this.ink) return 'is-ink';
      if (this.isNew) return 'is-new';
      return this.exhausted ? 'is-spent' : '';
    },
    badge() {
      return this.slotIndex < 0 && this.fertile > 0;
    },
    tag() {
      if (this.slotIndex >= 0) return null;
      if (this.ink) return { kind: 'ink', text: 'Encre' };
      if (this.isNew) return { kind: 'new', text: 'Nouveau' };
      return null;
    },
    // Un long mot ne tient pas sur une tuile de téléphone : un ou deux crans plus petit (jamais coupé)
    lengthClass() {
      const longest = Math.max(...this.name.split(/[\s'’-]+/).map(word => word.length));
      if (longest >= 12) return 'is-xlong';
      return longest >= 9 ? 'is-long' : '';
    },
    label() {
      const notes = [];
      if (this.slotIndex >= 0) notes.push(`dans l’Athanor, emplacement ${this.numeral}`);
      if (this.ink) notes.push('révélé par l’Encre');
      if (this.isNew) notes.push('nouveau');
      if (this.fertile > 0) notes.push(`${this.fertile} mélange${this.fertile > 1 ? 's' : ''} encore inexploré${this.fertile > 1 ? 's' : ''}`);
      if (this.exhausted) notes.push('tout exploré');
      return [this.name, ...notes].join(', ');
    }
  }
};
</script>

<style scoped src="./ElementTile.css"></style>
