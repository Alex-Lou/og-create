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
import GModal from '@/components/ui/GModal.vue';
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

<style scoped>
.item-sheet { display: flex; flex-direction: column; gap: 12px; }
.item-sheet__art {
  position: relative; display: grid; place-items: center; height: 168px; border-radius: 16px;
  background: radial-gradient(circle at 50% 70%, #CFE8B8, var(--vellum-200) 72%);
}
.item-sheet__art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 14px 18px; box-sizing: border-box; object-fit: contain; }
.item-sheet__art.is-locked img { filter: grayscale(.7) opacity(.65); }
.item-sheet__chip {
  position: absolute; top: 10px; left: 10px; min-width: 30px; padding: 2px 8px; border-radius: 999px;
  background: var(--ink-900); color: var(--gold-300); font-family: var(--font-display); font-weight: 700; font-size: 14px; text-align: center;
}
.item-sheet__chip--rare { background: linear-gradient(135deg, #F2C04B, #C9952A); color: var(--ink-900); }
.item-sheet__palier { margin: 0; padding: 8px 12px; border-radius: 12px; font-weight: 800; font-size: 14px; }
.item-sheet__palier.is-ok { background: #E3F1D6; color: #3E6E2E; }
.item-sheet__palier.is-missing { background: var(--vellum-200); color: var(--ink-700); }
.item-sheet__facts { margin: 0; display: grid; gap: 6px; }
.item-sheet__fact { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 6px 2px; border-bottom: 1px dashed rgba(74, 52, 38, .18); }
.item-sheet__fact dt { color: var(--ink-500); font-weight: 700; font-size: 13px; }
.item-sheet__fact dd { margin: 0; font-weight: 900; font-size: 15px; text-align: right; }
.item-sheet__guide { padding: 10px 12px; border-radius: 14px; background: var(--vellum-200); }
.item-sheet__guide-title { margin: 0 0 6px; font-family: var(--font-display); font-size: 15px; font-weight: 700; }
.item-sheet__guide-list { margin: 0; display: grid; gap: 6px; }
.item-sheet__guide-list div { display: grid; grid-template-columns: 74px 1fr; gap: 8px; align-items: baseline; }
.item-sheet__guide-list dt { color: var(--ink-500); font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.item-sheet__guide-list dd { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.35; }
.item-sheet__lock { flex: 1; color: var(--ink-500); font-weight: 800; font-size: 13px; }
.item-sheet__owned { color: #4E8A3A; font-weight: 900; }
.item-sheet__coin {
  display: inline-block; width: 14px; height: 14px; margin-left: 5px; vertical-align: -2px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5);
}
</style>
