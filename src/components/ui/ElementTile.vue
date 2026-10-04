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
    <span v-if="price !== null" class="tile__price" aria-hidden="true">{{ price }}</span>
  </button>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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
    compact: { type: Boolean, default: false },
    // Prix en écus (décoration à acheter), null sinon
    price: { type: Number, default: null }
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

<style scoped>
.tile {
  appearance: none;
  position: relative;
  min-width: 0;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding: 7px 3px 6px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .6), rgba(255, 255, 255, 0) 62%), var(--card);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 3px 0 var(--card-edge), var(--shadow-1);
  color: var(--ink-700);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  touch-action: manipulation;
  transition: transform var(--oc-fast) var(--oc-ease-out), box-shadow var(--oc-fast);
}
.tile:active { transform: translateY(2px) scale(0.96); box-shadow: inset 0 0 0 1px var(--oc-line), 0 1px 0 var(--card-edge); }
.tile:focus-visible { outline: 2px solid var(--gold-500); outline-offset: 2px; }

/* Coin de famille : un losange à l'encre du chapitre */
.tile__corner { position: absolute; top: 7px; left: 7px; width: 6px; height: 6px; transform: rotate(45deg); border-radius: 1px; background: var(--ti); opacity: 0.75; }
.tile__medal {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, #fff 0 18%, var(--tc) 100%);
  /* Liseré clair : le médaillon se détache du carton teinté */
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, .8), 0 1px 2px rgba(74, 52, 38, .12);
  font-size: 27px;
  line-height: 1;
}
.tile__name {
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: var(--font-ui);
  font-size: 10.5px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  hyphens: auto;
  -webkit-hyphens: auto;
}
.tile__name.is-long { font-size: 9px; letter-spacing: -0.02em; }
.tile__name.is-xlong { font-size: 7.5px; letter-spacing: -0.03em; }

/* Fertile : mélanges encore inexplorés */
.tile__badge {
  position: absolute;
  top: -6px;
  right: -5px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--verdigris-500);
  color: #fff;
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 11px;
  box-shadow: 0 0 0 2px var(--vellum-50);
}
.tile__tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 6px;
  border-radius: 6px;
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.tile__tag--new { top: -7px; background: var(--gold-300); color: var(--ink-900); box-shadow: 0 0 0 1px var(--gold-600); }
.tile__tag--ink { bottom: -7px; background: var(--ink-900); color: var(--gold-200); }

/* Prix d'achat : pastille dorée en bas de la tuile */
.tile__price {
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 6px 1px 16px;
  border-radius: 999px;
  background: var(--gold-200) radial-gradient(circle at 8px 50%, var(--gold-500) 0 4px, transparent 4.5px);
  color: var(--ink-900);
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 10px;
  box-shadow: 0 0 0 1px var(--gold-600);
  white-space: nowrap;
}
/* Nouveau : liseré d'or, gardé jusqu'au premier usage */
.tile.is-new { box-shadow: inset 0 0 0 2px var(--gold-400), 0 3px 0 var(--gold-600), var(--shadow-1); animation: tile-pop 0.55s var(--oc-ease-spring); }
/* Révélé par l'Encre pour la page ouverte */
.tile.is-ink { box-shadow: inset 0 0 0 2px var(--gold-500), 0 0 14px rgba(239, 193, 99, 0.55), 0 3px 0 var(--gold-600); }
/* Tout exploré : papier plus terne, dessin désaturé */
.tile.is-spent { background: var(--vellum-200); color: var(--ink-500); }
.tile.is-spent .tile__medal { filter: saturate(0.35); opacity: 0.75; }
/* Dans l'Athanor : contour en pointillés et chiffre de l'emplacement ; la tuile reste pleine,
   car un même élément peut occuper plusieurs emplacements (Eau + Eau) */
.tile.is-slot { box-shadow: 0 3px 0 var(--card-edge), var(--shadow-1); outline: 2px dashed var(--ti); outline-offset: -2px; }
.tile__slot {
  position: absolute;
  top: -6px;
  right: -5px;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--ink-900);
  color: var(--gold-200);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 11px;
  box-shadow: 0 0 0 2px var(--vellum-50);
}

/* Compacte : sans nom, plus petite */
.tile--compact { min-height: 0; padding: 5px; }
.tile--compact .tile__medal { width: 36px; height: 36px; font-size: 23px; }

@keyframes tile-pop { 0% { transform: scale(0.55); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .tile.is-new { animation: none; }
}
</style>
