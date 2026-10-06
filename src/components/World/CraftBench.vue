<template>
  <GModal eyebrow="Créations d’île" title="L’établi" :width="560" @close="$emit('close')">
    <div class="bench">
      <p class="bench__note">
        Assemble une création, puis pose-la sur l’île : chacune a sa place. Chaque création faite en ouvre d’autres.
      </p>

      <!-- Paliers : un onglet chacun ; fermé, il dit ce qui l'ouvre -->
      <div class="bench__tabs" role="tablist" aria-label="Paliers">
        <button
          v-for="tier in TIERS"
          :key="tier"
          type="button"
          role="tab"
          :aria-selected="String(tab === tier)"
          :class="['bench__tab', { 'is-on': tab === tier, 'is-locked': !isOpen(tier) }]"
          :aria-label="TIER_LABEL[tier]"
          @click="tab = tier"
        >
          <ElementGlyph v-if="!isOpen(tier)" glyph="ui:lock" /><span><span v-if="numberOf(tier)" class="bench__tab-word">Palier </span>{{ numberOf(tier) || TIER_LABEL[tier] }}</span>
        </button>
      </div>
      <p v-if="!isOpen(tab)" class="bench__locked">{{ tierHint(tab, crafts.epreuves, crafts.stars) }}</p>

      <ul class="bench__list">
        <li v-for="c in shown" :key="c.id" :class="['bench__card', { 'is-ready': !c.block, 'is-locked': !c.open }]">
          <span class="bench__art">
            <img :src="artOf(c)" alt="" />
            <span v-if="c.made" class="bench__badge" :aria-label="`${c.made} fabriquée${c.made > 1 ? 's' : ''}`">×{{ c.made }}</span>
          </span>
          <span class="bench__body">
            <span class="bench__name">{{ c.name }}</span>
            <span class="bench__place">{{ c.place }}</span>
            <CostList class="bench__cost" :cost="c.cost" :finds="c.finds" :stock="stock" />
            <ul v-if="c.elements.length" class="bench__know" aria-label="Savoir-faire (éléments du Grimoire, non dépensés)">
              <li v-for="e in c.elements" :key="e.name" :class="{ 'is-missing': !e.have }">
                <ElementGlyph :glyph="e.have ? elementEmojis[e.name] || 'ui:spark' : 'ui:unknown'" /> {{ e.name }}
              </li>
            </ul>
            <span v-if="c.block && c.open" class="bench__block">{{ c.block }}</span>
          </span>
          <span class="bench__actions">
            <button
              type="button"
              class="bench__btn"
              :disabled="busy || Boolean(c.block)"
              :aria-label="c.block ? `${c.name} : ${c.block}` : `Assembler ${c.name}`"
              @click="$emit('assemble', c.id)"
            >Assembler</button>
            <button
              v-if="c.reserve"
              type="button"
              class="bench__btn bench__btn--place"
              :disabled="busy || !c.spots.length"
              :title="c.spots.length ? '' : 'Aucune case libre ne convient pour l’instant.'"
              @click="$emit('place', c.id)"
            >Poser · {{ c.reserve }}</button>
          </span>
        </li>
      </ul>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import CostList from '@/components/World/CostList.vue';
import { spriteUrl } from '@/world/spriteCache';
import { craftThumb } from '@/world/craftSprites';
import { TIER_LABEL, tierHint } from '@/world/crafts';

const TIERS = ['start', 'I', 'II', 'III', 'climat'];

// L'établi (fiche du Foyer, quête de Brume) : les créations d'île par palier, ce qu'elles coûtent, le savoir-faire du
// Livre qu'elles demandent, où elles se posent. « Assembler » ouvre le puzzle ; « Poser » allume les cases permises sur
// l'île. Le palier des climats : des créations payées aussi en trouvailles, posées seulement dans leur climat, qui y
// enrichissent les gisements. Le serveur décide de tout (crafts : vue de l'île).
export default {
  name: 'CraftBench',
  components: { GModal, ElementGlyph, CostList },
  props: {
    // { epreuves: { have, need }, open: [paliers], catalog: [...], placed: [...] }
    crafts: { type: Object, required: true },
    // Ressources et trouvailles de climat
    stock: { type: Object, required: true },
    elementEmojis: { type: Object, default: () => ({}) },
    busy: { type: Boolean, default: false }
  },
  emits: ['assemble', 'place', 'close'],
  data() {
    // Onglet du départ : le premier palier ouvert où il reste une création jamais faite (sinon le plus haut ouvert)
    const open = this.crafts.open;
    // (celui des climats ne s'ouvre pas de lui-même : ses créations attendent des trouvailles)
    const fresh = open.filter(t => t !== 'climat').find(t => this.crafts.catalog.some(c => c.tier === t && !c.made));
    return { TIERS, TIER_LABEL, tab: fresh || open.filter(t => t !== 'climat').pop() || 'start' };
  },
  computed: {
    shown() {
      return this.crafts.catalog.filter(c => c.tier === this.tab);
    }
  },
  methods: {
    tierHint,
    isOpen(tier) {
      return this.crafts.open.includes(tier);
    },
    // Le numéro d'un palier (I, II, III), ou null : sur téléphone, son onglet ne montre que lui
    numberOf(tier) {
      return ['I', 'II', 'III'].includes(tier) ? tier : null;
    },
    artOf(c) {
      return spriteUrl(`craft-thumb-${c.id}`, () => craftThumb(c.id));
    }
  }
};
</script>

<style scoped>
/* Ses jetons : un savoir qui manque */
.bench { --bench-missing-bg: #f8e3dc; }
.bench { display: flex; flex-direction: column; gap: 10px; font-family: var(--font-ui); }
.bench__note { margin: 0; padding: 8px 12px; border-radius: var(--r-sm); background: var(--vellum-200); font-weight: 700; font-size: 13px; line-height: 1.4; }
.bench__tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: var(--r-pill); background: var(--vellum-200); }
.bench__tab {
  display: inline-flex; justify-content: center; align-items: center; gap: 4px; min-height: 36px; padding: 4px 6px; border: 0; border-radius: var(--r-pill);
  background: none; color: var(--ink-700); font: inherit; font-weight: 900; font-size: 12px; white-space: nowrap; cursor: pointer; touch-action: manipulation;
}
.bench__tab.is-on { background: var(--ink-900); color: var(--vellum-50); }
.bench__tab.is-locked:not(.is-on) { color: var(--ink-500); }
/* Téléphone : cinq onglets dans la largeur, « Palier » s'efface devant son numéro (le nom entier reste en aria-label) */
@media (max-width: 520px) {
  .bench__tab-word { display: none; }
}
.bench__locked { margin: 0; padding: 8px 12px; border-radius: var(--r-sm); background: var(--gold-100); box-shadow: inset 0 0 0 1px var(--gold-300); font-size: 13px; font-weight: 800; line-height: 1.4; }
.bench__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.bench__card {
  display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: 6px 10px; align-items: start;
  padding: 8px; border-radius: var(--r-md); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1);
}
.bench__card.is-ready { box-shadow: inset 0 0 0 2px var(--gold-400); }
.bench__art {
  grid-row: 1 / span 2; position: relative; display: block; height: 96px; border-radius: var(--r-sm);
  background: radial-gradient(circle at 50% 72%, var(--oc-art-halo), var(--vellum-200) 72%);
}
.bench__art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 6px; box-sizing: border-box; object-fit: contain; }
.bench__card.is-locked .bench__art img { filter: grayscale(.8) opacity(.55); }
.bench__badge { position: absolute; top: 5px; right: 5px; padding: 1px 7px; border-radius: var(--r-pill); background: var(--oc-success); color: var(--oc-on-success); font-size: 11px; font-weight: 900; }
.bench__body { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.bench__name { font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.15; }
.bench__place { color: var(--ink-700); font-size: 12px; font-weight: 700; line-height: 1.3; }
.bench__cost { margin: 2px 0 0; }
.bench__know { margin: 2px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px; font-size: 12px; font-weight: 900; color: var(--ink-700); }
.bench__know li { display: inline-flex; align-items: center; gap: 3px; padding: 1px 8px 1px 4px; border-radius: var(--r-pill); background: var(--vellum-200); }
.bench__know li.is-missing { background: var(--bench-missing-bg); color: var(--oc-missing); }
.bench__block { color: var(--oc-missing); font-size: 12px; font-weight: 800; line-height: 1.3; }
.bench__actions { grid-column: 2; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.bench__btn {
  min-height: 40px; min-width: 104px; padding: 6px 14px; border: 0; border-radius: var(--r-pill);
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
  cursor: pointer; touch-action: manipulation;
}
.bench__btn--place { background: var(--oc-success); }
.bench__btn:disabled { background: var(--vellum-300); color: var(--ink-500); cursor: default; }
</style>
