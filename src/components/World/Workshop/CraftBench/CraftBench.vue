<template>
  <GModal sheet eyebrow="Créations d’île" title="L’établi" :width="560" @close="$emit('close')">
    <div class="bench">
      <p class="bench__note">
        {{ T.note }}
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
      <p v-if="!isOpen(tab)" class="bench__locked">{{ tierHint(tab, crafts.epreuves, crafts.stars, crafts.locks) }}</p>

      <ul class="bench__list">
        <li v-for="c in shown" :key="c.id" :class="['bench__card', { 'is-ready': !c.block, 'is-locked': !c.open }]">
          <span class="bench__art">
            <img v-if="artStyleOf(c)" :src="artOf(c)" alt="" :style="artStyleOf(c)" />
            <span v-if="c.made" class="bench__badge" :aria-label="`${c.made} fabriquée${c.made > 1 ? 's' : ''}`">×{{ c.made }}</span>
          </span>
          <span class="bench__body">
            <span class="bench__name">{{ c.name }}</span>
            <span class="bench__place">{{ c.place }}</span>
            <CostList class="bench__cost" :cost="timesBag(c.cost, countOf(c))" :finds="timesBag(c.finds, countOf(c))" :stock="stock" />
            <!-- Plusieurs pièces d'un coup : ×1, ×3, ×5, et ce que demande la tâche en cours, déjà choisi -->
            <span v-if="!c.block && roomOf(c) > 1" class="bench__batch" role="group" :aria-label="T.batch">
              <button
                v-for="n in batchChoices(needs[c.id] || 0)"
                :key="n"
                type="button"
                :class="['bench__chip', { 'is-on': countOf(c) === n, 'is-need': n === needs[c.id] }]"
                :disabled="n > roomOf(c)"
                :aria-pressed="String(countOf(c) === n)"
                @click="counts = { ...counts, [c.id]: n }"
              >{{ n === needs[c.id] && n > 1 ? T.need(n) : `×${n}` }}</button>
            </span>
            <ul v-if="c.elements.length" class="bench__know" aria-label="Savoir-faire (éléments du Grimoire, non dépensés)">
              <li v-for="e in c.elements" :key="e.name" :class="{ 'is-missing': !e.have }">
                <ElementGlyph :glyph="e.have ? elementEmojis[e.name] || 'ui:spark' : 'ui:unknown'" /> {{ e.name }}
              </li>
            </ul>
            <!-- Le verrou parlant : le savoir-faire qui manque, ses pages, et le ruban du Grimoire vers lui -->
            <span v-if="missingKnow(c, crafts.catalog).length" class="bench__block">
              <span v-for="e in missingKnow(c, crafts.catalog)" :key="e.name" class="bench__need">{{ knowText(e) }}</span>
              <button v-if="followable" type="button" class="world__btn world__btn--quiet bench__follow" :data-coach="`craft-follow-${c.id}`" @click="$emit('follow', missingKnow(c, crafts.catalog)[0].name)">
                <ElementGlyph glyph="ui:book" />
                Suivre dans le Grimoire
              </button>
            </span>
            <span v-else-if="c.block && c.open" class="bench__block">{{ c.block }}</span>
          </span>
          <span class="bench__actions">
            <button
              type="button"
              class="world__btn bench__btn"
              :data-coach="`craft-${c.id}`"
              :disabled="busy || Boolean(c.block)"
              :aria-label="c.block ? `${c.name} : ${c.block}` : T.assemble(c.name, countOf(c))"
              @click="$emit('assemble', c.id, countOf(c))"
            >Assembler<span v-if="countOf(c) > 1"> ×{{ countOf(c) }}</span></button>
            <button
              v-if="c.reserve"
              type="button"
              class="world__btn bench__btn bench__btn--place"
              :data-coach="`place-${c.id}`"
              :disabled="busy || !c.spots.length"
              :title="c.spots.length ? '' : T.noSpot"
              @click="$emit('place', c.id)"
            >Poser · {{ c.reserve }}</button>
            <!-- (ce qui se pose d'un trait, sans réserve : fabriqué et payé en passant, une fois le premier assemblé, ou à
                 l'enclos d’Agathe : le serveur le dit, traceable) -->
            <button
              v-else-if="c.line && c.traceable"
              type="button"
              class="world__btn bench__btn bench__btn--place"
              data-coach="bench-trace"
              :disabled="busy || Boolean(c.block) || !c.spots.length"
              @click="$emit('place', c.id)"
            >Tracer</button>
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
import { artBody } from '@/world/artBody';
import { TIER_LABEL, tierHint, missingKnow, knowText, batchRoom, batchChoices, timesBag, artFitStyle } from '@/world/crafts';
import { CRAFT_BENCH as T } from '@/texts/world/screens/workshop';

const TIERS = ['start', 'I', 'II', 'III', 'climat'];
// La vignette d'une création (px : CraftBench.css, .bench__art) et sa marge intérieure
const ART_W = 84;
const ART_H = 96;
const ART_PAD = 6;

// L'établi (fiche du Foyer, quête de Brume) : les créations d'île par palier, ce qu'elles coûtent, le savoir-faire du
// Livre qu'elles demandent, où elles se posent. « Assembler » ouvre le puzzle ; « Poser » allume les cases permises sur
// l'île. Le palier des climats : des créations payées aussi en trouvailles, posées seulement dans leur climat, qui y
// enrichissent les gisements. Le serveur décide de tout (crafts : vue de l'île).
export default {
  name: 'CraftBench',
  components: { GModal, ElementGlyph, CostList },
  props: {
    // { epreuves: { have, need }, open: [paliers], locks: { palier: ce qui l'ouvre }, catalog: [...], placed: [...] }
    crafts: { type: Object, required: true },
    // Ressources et trouvailles de climat
    stock: { type: Object, required: true },
    elementEmojis: { type: Object, default: () => ({}) },
    busy: { type: Boolean, default: false },
    // Le ruban du Grimoire peut suivre un savoir-faire (pas sous la brume épaisse du tutoriel)
    followable: { type: Boolean, default: false },
    // Ce que demande la tâche en cours ({ création: pièces qui manquent }) : la quantité déjà choisie
    needs: { type: Object, default: () => ({}) }
  },
  emits: ['assemble', 'place', 'close', 'follow'],
  data() {
    // Onglet du départ : celui de la création que la leçon du tutoriel fait fabriquer (serveur : tutorial), sinon le
    // premier palier ouvert où il reste une création jamais faite (sinon le plus haut ouvert)
    const open = this.crafts.open;
    const lesson = this.crafts.catalog.find(c => c.tutorial && !c.made);
    // (celui des climats ne s'ouvre pas de lui-même : ses créations attendent des trouvailles)
    const fresh = open.filter(t => t !== 'climat').find(t => this.crafts.catalog.some(c => c.tier === t && !c.made));
    return { T, TIERS, TIER_LABEL, tab: (lesson && lesson.tier) || fresh || open.filter(t => t !== 'climat').pop() || 'start', counts: {} };
  },
  computed: {
    shown() {
      return this.crafts.catalog.filter(c => c.tier === this.tab);
    }
  },
  methods: {
    tierHint,
    missingKnow,
    knowText,
    batchChoices,
    timesBag,
    // Combien de pièces le stock paie
    roomOf(c) {
      return batchRoom(c, this.stock);
    },
    // La quantité choisie : celle du joueur, sinon ce que demande la tâche en cours, dans ce que le stock paie
    countOf(c) {
      const room = Math.max(1, this.roomOf(c));
      return Math.min(room, this.counts[c.id] || this.needs[c.id] || 1);
    },
    // (un palier fermé s'ouvre pour la création que la leçon du tutoriel fait fabriquer)
    isOpen(tier) {
      return this.crafts.open.includes(tier) || this.crafts.catalog.some(c => c.tier === tier && c.tutorial);
    },
    // Le numéro d'un palier (I, II, III), ou null : sur téléphone, son onglet ne montre que lui
    numberOf(tier) {
      return ['I', 'II', 'III'].includes(tier) ? tier : null;
    },
    artOf(c) {
      return creationThumb(c.id) ?? spriteUrl(`craft-thumb-${c.id}`, () => craftThumb(c.id));
    },
    // Sa place dans la vignette : ce qui s'en voit nettement (son ombre comprise) le plus grand possible, un halo léger
    // autour ; null tant qu'il n'est pas mesuré (rien ne se pose une fois de travers)
    artStyleOf(c) {
      const body = artBody(this.artOf(c));
      return body && artFitStyle({ ...body.seen, ratio: body.ratio }, ART_W, ART_H, ART_PAD);
    }
  }
};
</script>

<style scoped src="./CraftBench.css"></style>
