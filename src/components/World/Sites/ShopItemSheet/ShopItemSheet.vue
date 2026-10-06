<template>
  <GModal :eyebrow="eyebrow" :title="item.name" :width="420" @close="$emit('close')">
    <div class="item-sheet">
      <div :class="['item-sheet__art', { 'is-locked': !reached && !item.owned }]">
        <img :src="art" alt="" />
        <span v-if="item.rare" class="item-sheet__chip item-sheet__chip--rare">Rare</span>
        <span v-else class="item-sheet__chip" :aria-label="`Palier ${palier}`">{{ palier }}</span>
      </div>
      <p v-if="!item.owned && !item.rare" :class="['item-sheet__palier', reached ? 'is-ok' : 'is-missing']">
        {{ reached ? `Palier ${palier} atteint` : `Il faut le palier ${palier} : ce bâtiment est au palier ${current}.` }}
      </p>
      <dl class="item-sheet__facts">
        <div v-for="fact in facts" :key="fact.label" class="item-sheet__fact">
          <dt>{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>
      <!-- Mode d'emploi : où le trouver, comment s'en servir, pourquoi l'avoir -->
      <section class="item-sheet__guide" aria-label="Mode d’emploi">
        <h3 class="item-sheet__guide-title">Mode d’emploi</h3>
        <dl class="item-sheet__guide-list">
          <div><dt>Où</dt><dd>{{ guide.where }}</dd></div>
          <div><dt>Comment</dt><dd>{{ guide.how }}</dd></div>
          <div><dt>Pourquoi</dt><dd>{{ guide.why }}</dd></div>
        </dl>
      </section>
    </div>
    <template #actions>
      <span v-if="!item.owned && item.rare" class="item-sheet__lock">{{ item.chapter ? `Offerte par le chapitre ${item.chapter}` : 'Dans les coffres légendaires' }}</span>
      <template v-else-if="!item.owned">
        <span v-if="lock && reached" class="item-sheet__lock">{{ lock }}</span>
        <button type="button" class="g-btn" :disabled="busy || Boolean(lock)" @click="$emit('buy', $event)">
          Acheter · {{ item.price }}<span class="item-sheet__coin" aria-hidden="true"></span>
        </button>
      </template>
      <button v-else-if="item.kind === 'skin'" type="button" class="g-btn" :disabled="busy" @click="$emit('wear', worn ? '' : item.id)">
        {{ worn ? 'Ôter' : 'Porter' }}
      </button>
      <span v-else class="item-sheet__owned">Sur ton île</span>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { roman } from '@/utils/roman';
import { tintOf } from '@/world/tints';
import { guideOf } from '@/world/itemGuide';

const KIND = { outil: 'Outil', objet: 'Objet', skin: 'Skin' };
const PROD_CAP = 100;
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

// Fiche d'un article de la boutique : grand dessin, palier demandé, effet chiffré (avant → après), prix et action.
// Les nombres affichés viennent de l'état du serveur ; la fiche ne fait que les mettre côte à côte.
export default {
  name: 'ShopItemSheet',
  components: { GModal },
  props: {
    site: { type: Object, required: true },
    item: { type: Object, required: true },
    art: { type: String, required: true },
    // Raison pour laquelle l'article ne s'achète pas encore ('' : achetable)
    lock: { type: String, default: '' },
    busy: { type: Boolean, default: false },
    // Récolte : coups par partie et parties en réserve, tels qu'ils sont aujourd'hui
    maxMoves: { type: Number, default: 0 },
    maxCharges: { type: Number, default: 0 }
  },
  emits: ['buy', 'wear', 'close'],
  computed: {
    palier() {
      return roman(this.item.minLevel);
    },
    current() {
      return roman(this.site.level) || '0';
    },
    reached() {
      return this.site.level >= this.item.minLevel;
    },
    worn() {
      return this.site.skin === this.item.id;
    },
    guide() {
      return guideOf(this.item, this.site);
    },
    eyebrow() {
      const kind = this.item.rare ? 'Pièce rare' : this.item.kind === 'skin' && tintOf(this.item.id) ? 'Teinte' : KIND[this.item.kind] || 'Article';
      return `${kind} · ${this.site.name}`;
    },
    facts() {
      const gain = this.item.gain;
      if (!gain) return [{ label: this.item.kind === 'skin' ? 'Apparence' : 'Effet', value: this.item.effect }];
      if (this.item.owned) return [{ label: 'Effet', value: `${this.item.effect} : actif sur ton île` }];
      const facts = [];
      if (gain.prod) {
        const now = this.site.bonus || 0;
        const next = Math.min(PROD_CAP, now + Math.round(gain.prod * 100));
        facts.push({ label: 'Production', value: `+${now} % → +${next} %${next === PROD_CAP ? ' (plafond)' : ''}` });
      }
      if (gain.coins) {
        const now = this.site.perHour ? this.site.perHour.coins : 0;
        facts.push({ label: 'Écus par heure', value: `${now} → ${now + gain.coins}` });
        facts.push({ label: 'Écus par jour', value: `+${gain.coins * 24}` });
      }
      if (gain.moves) facts.push({ label: 'Coups par Récolte', value: `${this.maxMoves} → ${this.maxMoves + gain.moves}` });
      if (gain.charges) facts.push({ label: 'Parties en réserve', value: `${this.maxCharges} → ${this.maxCharges + gain.charges}` });
      if (gain.regenMs) facts.push({ label: 'Retour d’une partie', value: `toutes les ${plural(Math.round(gain.regenMs / 60000), 'minute')}` });
      return facts.length ? facts : [{ label: 'Effet', value: this.item.effect }];
    }
  }
};
</script>

<style scoped src="./ShopItemSheet.css"></style>
