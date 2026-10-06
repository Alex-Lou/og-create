<template>
  <GModal eyebrow="Réserve à part" title="Trouvailles de climat" :width="440" @close="$emit('close')">
    <div class="finds">
      <p class="finds__note">
        Chaque climat a sa trouvaille. Elle se ramasse sur les gisements de ses quartiers, une fois à toi ; un gisement
        repousse en quelques heures. Les trouvailles paient les créations de climat (établi, onglet Climats) et les
        annexes de climat (fiche d’un bâtiment, dès le palier III). Chaque création de climat posée dans un quartier y
        fait rendre une trouvaille de plus à chaque ramassage (jusqu’à +3).
      </p>
      <ul class="finds__list">
        <li v-for="f in finds" :key="f.id" :class="['finds__row', { 'is-empty': !f.amount }]">
          <span class="finds__icon" aria-hidden="true"><ElementGlyph :glyph="FIND_GLYPH[f.id]" /></span>
          <span class="finds__body">
            <span class="finds__name">{{ f.name }} <span class="finds__climate">· {{ CLIMATE_NAMES[f.climate] }}</span></span>
            <span class="finds__where">{{ whereOf(f) }}</span>
          </span>
          <strong class="finds__amount" :aria-label="`${f.amount} ${f.name}`">{{ f.amount }}</strong>
        </li>
      </ul>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { CLIMATE_NAMES } from '@/world/climates';
import { FIND_GLYPH, DEPOSIT_NAMES, depositWait } from '@/world/finds';

// La réserve des trouvailles de climat : combien on en a, où se trouvent leurs gisements et combien sont prêts.
// Tout vient de la vue de l'île (serveur).
export default {
  name: 'FindsSheet',
  components: { GModal, ElementGlyph },
  props: {
    // [{ id, name, climate, amount }]
    finds: { type: Array, required: true },
    // Gisements des quartiers connus : [{ id, zone, find, readyIn }]
    deposits: { type: Array, required: true },
    // Quartiers de la carte (à soi ou non)
    zones: { type: Array, required: true },
    // Temps écoulé depuis le chargement de la vue (ms)
    elapsed: { type: Number, default: 0 }
  },
  emits: ['close'],
  data() {
    return { FIND_GLYPH, CLIMATE_NAMES };
  },
  methods: {
    whereOf(f) {
      const owned = new Set(this.zones.filter(z => z.owned).map(z => z.id));
      const mine = this.deposits.filter(d => d.find === f.id && owned.has(d.zone));
      const [name] = DEPOSIT_NAMES[f.id];
      if (!mine.length) return `${name} : dans les quartiers de ce climat, une fois à toi.`;
      const ready = mine.filter(d => !depositWait(d, this.elapsed)).length;
      return `${name} : ${ready} prêt${ready > 1 ? 's' : ''} sur ${mine.length}.`;
    }
  }
};
</script>

<style scoped>
.finds { display: flex; flex-direction: column; gap: 10px; font-family: var(--font-ui); }
.finds__note { margin: 0; padding: 8px 12px; border-radius: var(--r-sm); background: var(--vellum-200); font-weight: 700; font-size: 13px; line-height: 1.4; }
.finds__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.finds__row {
  display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 10px; align-items: center;
  padding: 8px 12px 8px 8px; border-radius: var(--r-tile); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1);
}
.finds__icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: var(--r-sm); background: var(--vellum-200); font-size: 28px; }
.finds__row.is-empty .finds__icon { filter: grayscale(.6) opacity(.65); }
.finds__body { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.finds__name { font-family: var(--font-display); font-weight: 700; font-size: 16px; }
.finds__climate { font-family: var(--font-ui); font-size: 12px; font-weight: 700; color: var(--ink-700); }
.finds__where { color: var(--ink-700); font-size: 12px; font-weight: 700; line-height: 1.3; }
.finds__amount { font-size: 20px; font-weight: 900; font-variant-numeric: tabular-nums; }
.finds__row.is-empty .finds__amount { color: var(--ink-500); }
</style>
