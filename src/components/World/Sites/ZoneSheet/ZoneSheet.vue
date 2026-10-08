<template>
  <div class="world__sheet-backdrop" @click.self="$emit('close')">
    <div v-if="zone.known === false" class="world__sheet" role="dialog" aria-label="Terre inconnue">
      <div class="world__sheet-head">
        <span class="world__sheet-title"><ElementGlyph glyph="ui:map" /> Terre inconnue</span>
        <button type="button" class="world__link" @click="$emit('close')">Fermer</button>
      </div>
      <p class="world__site-effect">Une brume légère couvre cette terre : on devine son relief. Une expédition révélera son climat et ce qu’elle cache. Elle emporte :</p>
      <ul class="world__needs">
        <li class="world__need">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:map" /></span>
          <span><strong>{{ zone.trip }} h</strong> de voyage</span>
        </li>
        <li v-for="(n, r) in zone.cost" :key="r" :class="['world__need', stock[r] >= n ? 'is-ok' : 'is-missing']">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="GLYPH[r]" /></span>
          <span><strong>{{ n }}</strong> {{ WORDS[r] }}</span>
        </li>
        <li :class="['world__need', charges ? 'is-ok' : 'is-missing']">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:spark" /></span>
          <span>Une partie de Récolte</span>
          <em>{{ charges }} en réserve</em>
        </li>
      </ul>
      <p v-if="expedition && expedition.zone === zone.id" class="world__trip-note">Ton expédition est en route : retour dans {{ tripLeft }}.</p>
      <p v-else-if="expedition" class="world__trip-note">Une expédition est déjà en route ailleurs : attends son retour.</p>
      <p v-else-if="zone.closed" class="world__trip-note">
        Les terres alentour s’ouvrent quand le cœur de l’île est à toi.<template v-if="coreLeft.length"> Il te manque : {{ coreLeft.join(', ') }}.</template>
      </p>
      <p v-else-if="!zone.explorable" class="world__trip-note">Une expédition part d’un quartier à toi, vers un quartier voisin : achète d’abord un quartier qui touche celui-ci.</p>
      <div class="world__sheet-actions">
        <button type="button" class="world__btn" :disabled="!zone.explorable || busy" @click="$emit('explore')">Envoyer une expédition</button>
      </div>
    </div>
    <div v-else class="world__sheet" role="dialog" :aria-label="zone.name">
      <div class="world__sheet-head">
        <span class="world__sheet-title"><ElementGlyph glyph="ui:map" /> {{ zone.name }}</span>
        <button type="button" class="world__link" @click="$emit('close')">Fermer</button>
      </div>
      <p class="world__site-effect">
        Agrandis ton île<template v-if="sites.length"> : ce quartier abrite {{ sites.join(', ') }}</template>, et de la place pour tes créations.
      </p>
      <p v-if="CLIMATE_TEXT[zone.climate]" class="world__climate"><strong>{{ CLIMATE_NAMES[zone.climate] }}</strong> · {{ CLIMATE_TEXT[zone.climate] }}</p>
      <ul class="world__needs">
        <li v-if="zone.chapter" :class="['world__need', zone.open ? 'is-ok' : 'is-missing']">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:book" /></span>
          <span>Chapitre <strong>{{ zone.chapter }}</strong> du Grimoire</span>
          <em>{{ zone.open ? 'ouvert' : 'encore scellé' }}</em>
        </li>
        <!-- (au tutoriel, La Source se découvre en faisant naître son élément dans l'Athanor, sans écus) -->
        <li v-if="zone.plan" :class="['world__need', zone.planOwned ? 'is-ok' : 'is-missing']">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:book" /></span>
          <span>Faire naître <strong>« {{ zone.plan }} »</strong> dans l’Athanor</span>
          <em>{{ zone.planOwned ? 'né' : 'pas encore' }}</em>
        </li>
        <li v-else class="world__need">
          <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:coin" /></span>
          <span><strong>{{ zone.price }}</strong> écus</span>
        </li>
      </ul>
      <div class="world__sheet-actions">
        <button type="button" class="world__btn" data-coach="zone-buy" :disabled="!zone.open || (zone.plan && !zone.planOwned) || busy" @click="$emit('buy')">
          {{ zone.plan ? 'Lever la brume' : `Acheter · ${zone.price} écus` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { GLYPH } from '@/game/resources';
import { WORDS } from '@/world/needs';
import { CLIMATE_NAMES, CLIMATE_TEXT } from '@/world/climates';
// Fiche d'un quartier : à acheter (prix en écus, chapitre du Grimoire ; au tutoriel, La Source : son élément à écrire), ou terre inconnue à explorer (ce qu'emporte
// l'expédition). Achat et départ restent à l'île, qui les reçoit en événements. Ses styles sont ceux de l'île
// (WorldView, classes world__)
export default {
  name: 'ZoneSheet',
  components: { ElementGlyph },
  props: {
    zone: { type: Object, required: true },
    // Noms des bâtiments du quartier
    sites: { type: Array, default: () => [] },
    // Réserves de l'île, et parties de Récolte en réserve
    stock: { type: Object, required: true },
    charges: { type: Number, default: 0 },
    // Expédition en route ({ zone, endsIn }), ou null ; le temps avant son retour, en clair
    expedition: { type: Object, default: null },
    tripLeft: { type: String, default: '' },
    // Les quartiers du cœur de l'île pas encore à soi (noms) : les terres alentour restent fermées tant qu'il en reste
    coreLeft: { type: Array, default: () => [] },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'explore', 'buy'],
  data() {
    return { GLYPH, WORDS, CLIMATE_NAMES, CLIMATE_TEXT };
  }
};
</script>

<style scoped src="./ZoneSheet.css"></style>
