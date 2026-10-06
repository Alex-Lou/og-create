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
import CostList from '@/components/World/Sites/CostList/CostList.vue';
import { spriteUrl } from '@/world/spriteCache';
import { craftThumb } from '@/world/craftSprites';
import { creationThumb } from '@/world/creations';
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
      return creationThumb(c.id) ?? spriteUrl(`craft-thumb-${c.id}`, () => craftThumb(c.id));
    }
  }
};
</script>

<style scoped src="./CraftBench.css"></style>
