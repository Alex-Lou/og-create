<template>
  <div class="world__sheet-backdrop" @click.self="$emit('close')">
    <div class="world__sheet world__sheet--site" role="dialog" :aria-label="site.name">
      <div class="world__site-head">
        <img class="world__site-art" :src="art" alt="" />
        <div class="world__site-id">
          <!-- Le quartier se renomme dès qu'il est à soi, le bâtiment dès son palier III -->
          <span class="world__eyebrow world__named">{{ zoneName }}<button type="button" class="world__pen world__pen--small" :aria-label="`Renommer le quartier ${zoneName}`" @click="$emit('rename', 'zone', site.zone)"><svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><path d="M3,14.6 L3,17 L5.4,17 L14.6,7.8 L12.2,5.4 Z M15.6,6.8 L17,5.4 C17.4,5 17.4,4.4 17,4 L16,3 C15.6,2.6 15,2.6 14.6,3 L13.2,4.4 Z" fill="currentColor"/></svg></button></span>
          <span class="world__sheet-title world__named">{{ site.level ? site.name : `${site.name} · à bâtir` }}<button
            v-if="site.level"
            type="button"
            :class="['world__pen', { 'is-locked': site.level < site.renameLevel }]"
            :aria-label="site.level < site.renameLevel ? `Renommer : au palier ${roman(site.renameLevel)}` : `Renommer ${site.name}`"
            @click="$emit('rename', 'site', site.id)"
          ><svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><path d="M3,14.6 L3,17 L5.4,17 L14.6,7.8 L12.2,5.4 Z M15.6,6.8 L17,5.4 C17.4,5 17.4,4.4 17,4 L16,3 C15.6,2.6 15,2.6 14.6,3 L13.2,4.4 Z" fill="currentColor"/></svg></button></span>
          <span class="world__pips" :aria-label="`Niveau ${site.level} sur ${site.maxLevel}`">
            <span v-for="k in site.maxLevel" :key="k" :class="['world__pip', { 'is-on': k <= site.level }]"></span>
          </span>
        </div>
        <button type="button" class="world__link" @click="$emit('close')">Fermer</button>
      </div>
      <div class="world__tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="String(tab === 'overview')" :class="['world__tab', { 'is-on': tab === 'overview' }]" @click="$emit('tab', 'overview')">Aperçu</button>
        <button type="button" role="tab" :aria-selected="String(tab === 'evolution')" :class="['world__tab', { 'is-on': tab === 'evolution' }]" @click="$emit('tab', 'evolution')">
          Évolution<span v-if="buildReady" class="world__tab-dot" aria-label="prête"></span>
        </button>
        <button v-if="site.shop && site.shop.length" type="button" role="tab" :aria-selected="String(tab === 'shop')" :class="['world__tab', { 'is-on': tab === 'shop' }]" @click="$emit('tab', 'shop')">Boutique</button>
        <button v-if="site.annexes && site.annexes.length" type="button" role="tab" :aria-selected="String(tab === 'annexes')" :class="['world__tab', { 'is-on': tab === 'annexes' }]" @click="$emit('tab', 'annexes')">
          Annexes<span v-if="annexReady" class="world__tab-dot" aria-label="à poser"></span>
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { roman } from '@/utils/roman';
// Fiche d'un bâtiment, son cadre : son dessin, son quartier et son nom (renommables), ses paliers, ses onglets ; l'onglet
// ouvert (Aperçu, Évolution, Boutique, Annexes) vient en slot, de l'île. Ses styles sont ceux de l'île (WorldView,
// classes world__)
export default {
  name: 'SiteSheet',
  props: {
    site: { type: Object, required: true },
    // Onglet ouvert : overview, evolution, shop ou annexes
    tab: { type: String, required: true },
    // Dessin du bâtiment ; nom de son quartier
    art: { type: String, default: '' },
    zoneName: { type: String, default: '' },
    // Points des onglets : palier suivant prêt à bâtir, annexe prête à poser
    buildReady: { type: Boolean, default: false },
    annexReady: { type: Boolean, default: false }
  },
  emits: ['tab', 'rename', 'close'],
  methods: {
    roman
  }
};
</script>
