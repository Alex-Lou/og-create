<template>
  <div class="world__panel">
    <p v-if="!site.level" class="world__site-effect">Bâtis d’abord ce bâtiment pour ouvrir sa boutique.</p>
    <p v-else-if="site.produce" class="world__shop-note">
      Bonus de production : <strong>+{{ site.bonus || 0 }} %</strong> <span>(jusqu’à +100 %)</span>
    </p>
    <NameSignPanel
      v-if="site.level && signs"
      ref="nameSign"
      :site="site"
      :signs="signs"
      :coins="coins"
      :busy="busy"
      @choose="look => $emit('sign', look)"
      @rename="name => $emit('rename', name)"
    />
    <section v-for="group in shopGroups(site)" :key="group.kind" class="world__shop-group" :aria-label="group.label">
      <h3 class="world__shop-title">{{ group.label }}</h3>
      <ul class="world__cards">
        <li
          v-for="item in group.items"
          :key="item.id"
          :class="['world__card', { 'is-owned': item.owned, 'is-worn': site.skin === item.id, 'is-locked': !item.owned && site.level < item.minLevel, 'is-rare': item.rare }]"
        >
          <button type="button" class="world__card-open" :aria-label="`Fiche : ${item.name}`" @click="$emit('describe', item)">
            <span class="world__card-art">
              <img :src="itemArt(site, item)" alt="" />
              <span v-if="item.rare" class="world__card-palier world__card-palier--rare">Rare</span>
              <span v-else class="world__card-palier" :aria-label="`Palier ${roman(item.minLevel)}`">{{ roman(item.minLevel) }}</span>
              <span v-if="site.skin === item.id" class="world__card-badge">Porté</span>
              <span v-else-if="item.owned && item.kind !== 'skin'" class="world__card-badge">✓</span>
            </span>
            <span class="world__card-name">{{ item.name }}</span>
          </button>
          <span class="world__card-effect">{{ itemNote(site, item) }}</span>
          <button
            v-if="!item.owned"
            v-longpress="() => $emit('describe', item)"
            type="button"
            :class="['world__card-btn', { 'is-off': !canBuy(site, item) }]"
            :disabled="busy"
            :aria-label="buyLabel(site, item)"
            @click="$emit('buy', item, $event)"
          >
            <template v-if="lockOf(site, item)">{{ lockOf(site, item) }}</template>
            <template v-else>{{ item.price }}<span class="world__coin world__coin--small" aria-hidden="true"></span></template>
          </button>
          <button v-else-if="item.kind === 'skin' && site.skin !== item.id" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="$emit('wear', item.id)">Porter</button>
          <button v-else-if="item.kind === 'skin'" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="$emit('wear', '')">Ôter</button>
          <span v-else class="world__card-owned">Sur ton île</span>
        </li>
      </ul>
    </section>
    <transition name="world-undo">
      <div v-if="undoable" class="world__undo" role="status">
        <span>{{ undoable.name }} : acheté</span>
        <button type="button" class="world__undo-btn" :disabled="busy" @click="$emit('undo')">Annuler</button>
      </div>
    </transition>
  </div>
</template>

<script>
import NameSignPanel from './NameSignPanel.vue';
import longpress from '@/directives/longpress';
import { roman } from '@/utils/roman';
import { shopGroups, itemArt, itemNote, itemLock, itemBuyable, itemBuyLabel } from '@/world/shop';
// Onglet « Boutique » de la fiche d'un bâtiment : outils et objets (effets), pièces rares, skins et teintes
// (apparence), rangés par palier, et l'enseigne. Un toucher sur le prix achète (annulable 4 s), un toucher sur le dessin
// ou un appui long sur le prix ouvre la fiche de l'article. Achats, skins et enseigne restent à l'île, qui les reçoit en
// événements. Ses styles sont ceux de l'île (WorldView, classes world__)
export default {
  name: 'SiteShop',
  components: { NameSignPanel },
  directives: { longpress },
  props: {
    site: { type: Object, required: true },
    // Enseignes de l'île (vue du serveur), ou null
    signs: { type: Object, default: null },
    // Solde connu, ou null (le serveur tranchera)
    coins: { type: Number, default: null },
    busy: { type: Boolean, default: false },
    // Dernier achat, encore annulable : { id, name }, ou null
    undoable: { type: Object, default: null }
  },
  emits: ['describe', 'buy', 'wear', 'sign', 'rename', 'undo'],
  methods: {
    roman,
    shopGroups,
    itemArt,
    itemNote,
    lockOf(site, item) {
      return itemLock(site, item, this.coins);
    },
    canBuy(site, item) {
      return itemBuyable(site, item, this.coins);
    },
    buyLabel(site, item) {
      return itemBuyLabel(site, item, this.coins);
    },
    // L'enseigne mise sous les yeux (appui long sur une enseigne de l'île)
    showSign(reduced) {
      const panel = this.$refs.nameSign;
      if (panel && panel.$el && panel.$el.scrollIntoView) panel.$el.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    }
  }
};
</script>

<style scoped src="./SiteShop.css"></style>
