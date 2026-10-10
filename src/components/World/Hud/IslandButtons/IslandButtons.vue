<template>
  <!-- Colonne de gauche (comme les grands jeux mobiles : les objectifs et les coffres au bord gauche, la carte à droite,
       l'action principale sous le pouce) : le suivi des quêtes d'abord (slot), puis coffres, carnet, trouvailles,
       boussole. Une colonne : rien ne se chevauche, quel que soit le nombre de boutons. -->
  <div class="world__left">
  <slot name="quests" />
  <!-- Coffres : celui du jour et ceux qui attendent (pastille) -->
  <button
    v-if="chests"
    type="button"
    :class="['world__chest-btn', { 'is-ready': chestCount, 'is-locked': locked('chests') }]"
    :disabled="locked('chests')"
    :aria-label="chestCount ? `Coffres : ${chestCount} à ouvrir` : 'Coffres'"
    @click="$emit('chests')"
  >
    <img :src="ICON.coffre" alt="" width="28" height="28" draggable="false" />
    <span v-if="chestCount" class="world__chest-badge" aria-hidden="true">{{ chestCount }}</span>
  </button>
  <!-- Carnet d'explorateur : les lieux remarquables (pastille : ceux qui attendent d'être découverts) -->
  <button
    v-if="landmarks"
    type="button"
    :class="['world__log-btn', { 'is-ready': waitingLandmarks, 'is-locked': locked('log') }]"
    :disabled="locked('log')"
    :aria-label="waitingLandmarks ? `Carnet d’explorateur : ${waitingLandmarks} lieu${waitingLandmarks > 1 ? 'x' : ''} à découvrir` : 'Carnet d’explorateur'"
    @click="$emit('log')"
  >
    <img :src="ICON.carnet" alt="" width="26" height="26" draggable="false" />
    <span v-if="waitingLandmarks" class="world__chest-badge" aria-hidden="true">{{ waitingLandmarks }}</span>
  </button>
  <!-- Trouvailles de climat : la réserve à part (pastille : gisements prêts dans les quartiers à soi) -->
  <button
    v-if="finds"
    type="button"
    :class="['world__finds-btn', { 'is-ready': readyDeposits, 'is-locked': locked('finds') }]"
    :disabled="locked('finds')"
    :aria-label="readyDeposits ? `Trouvailles : ${readyDeposits} gisement${readyDeposits > 1 ? 's' : ''} prêt${readyDeposits > 1 ? 's' : ''}` : 'Trouvailles'"
    @click="$emit('finds')"
  >
    <img :src="ICON.trouvailles" alt="" width="26" height="26" draggable="false" />
    <span v-if="readyDeposits" class="world__chest-badge" aria-hidden="true">{{ readyDeposits }}</span>
  </button>
  <!-- La boussole : l'expédition en route et le temps avant son retour ; sans expédition, une terre à explorer -->
  <button
    v-if="tripLeft || explore"
    type="button"
    :class="['world__trip-btn', { 'is-locked': locked('trip') }]"
    :disabled="locked('trip')"
    :aria-label="tripLeft ? `Expédition en route : retour dans ${tripLeft}` : 'Boussole : envoyer une expédition'"
    @click="$emit('trip')"
  >
    <img :src="ICON.expedition" alt="" width="26" height="26" draggable="false" />
    <span v-if="tripLeft" class="world__trip-left">{{ tripLeft }}</span>
  </button>
  </div>
  <div class="world__zoom">
    <button type="button" aria-label="Zoomer" :class="{ 'is-locked': locked('zoom') }" :disabled="locked('zoom')" @click="$emit('zoom', 1.25)"><img :src="ICON.zoom_plus" alt="" width="30" height="30" draggable="false" /></button>
    <button type="button" aria-label="Dézoomer" :class="{ 'is-locked': locked('zoom') }" :disabled="locked('zoom')" @click="$emit('zoom', 0.8)"><img :src="ICON.zoom_moins" alt="" width="30" height="30" draggable="false" /></button>
    <!-- Plein écran : l'île seule, sans barres (et l'écran entier quand l'appareil le permet) -->
    <button type="button" :class="{ 'is-locked': locked('immersive') }" :disabled="locked('immersive')" :aria-label="immersive ? 'Quitter le plein écran' : 'Plein écran'" :aria-pressed="immersive" @click="$emit('immersive')">
      <img :src="immersive ? ICON.fermer : ICON.plein_ecran" alt="" width="30" height="30" draggable="false" />
    </button>
    <!-- Tracer un chemin (l'île neuve n'a que son sentier) : le mode chemin ; un second toucher le quitte -->
    <button type="button" data-coach="road" :class="{ 'is-on': road, 'is-locked': locked('road') }" :disabled="locked('road')" :aria-label="road ? 'Quitter le tracé des chemins' : 'Tracer un chemin'" :aria-pressed="road" @click="$emit('road')">
      <img :src="ROAD_ICON" alt="" width="30" height="30" draggable="false" />
    </button>
  </div>
  <!-- La Récolte, action principale de l'île : en bas à droite, sous le pouce, ses parties en pastille -->
  <button v-if="harvest" type="button" :class="['world__play', 'world__play--fab', { 'is-locked': locked('harvest') }]" :disabled="busy || !charges || locked('harvest')" :aria-label="`Récolte : ${chargesText}`" @click="$emit('harvest')">
    <span class="world__play-label">Récolte</span>
    <span class="world__play-sub">{{ chargesShort }}</span>
  </button>
</template>

<script>
import { libraryIcon } from '@/utils/icons';
// (pas encore d'icône « chemin » dans le kit : une case de chemin de la bibliothèque)
import ROAD_ICON from '/design/bibliotheque/svg/chemins/chemin_ne-so.svg?url';

// Boutons posés sur l'île : à gauche le suivi des quêtes (slot), coffres, carnet d'explorateur, trouvailles (avec leurs
// pastilles), expédition en route ; à droite zoom, plein écran et chemins ; en bas à droite la Récolte. Ce qu'ils ouvrent reste à l'île, qui les reçoit en événements. Ses styles sont ceux de l'île
// (WorldView, classes world__). Leurs icônes : celles de la bibliothèque (design/bibliotheque/svg/interface)
const ICON = Object.fromEntries(['coffre', 'carnet', 'trouvailles', 'expedition', 'zoom_plus', 'zoom_moins', 'plein_ecran', 'fermer'].map(name => [name, libraryIcon(name)]));

export default {
  name: 'IslandButtons',
  props: {
    // L'île a des coffres ; combien attendent d'être ouverts
    chests: { type: Boolean, default: false },
    chestCount: { type: Number, default: 0 },
    // Des lieux remarquables à montrer ; combien attendent d'être découverts
    landmarks: { type: Boolean, default: false },
    waitingLandmarks: { type: Number, default: 0 },
    // Des trouvailles de climat ; combien de gisements sont prêts
    finds: { type: Boolean, default: false },
    readyDeposits: { type: Number, default: 0 },
    // Expédition en route : le temps avant son retour, en clair ('' : aucune)
    tripLeft: { type: String, default: '' },
    // Une expédition peut partir (une terre inconnue touche un quartier à soi) : la boussole y mène
    explore: { type: Boolean, default: false },
    immersive: { type: Boolean, default: false },
    // Le mode chemin est ouvert
    road: { type: Boolean, default: false },
    // La Récolte : montrée ; parties en réserve (sur le maximum) et leur texte complet (« 3/3 parties · +1 dans 30 min ») ;
    // l'île est occupée
    harvest: { type: Boolean, default: false },
    charges: { type: Number, default: 0 },
    chargesMax: { type: Number, default: 0 },
    chargesText: { type: String, default: '' },
    busy: { type: Boolean, default: false },
    // Pendant le tutoriel (game/prologue.js : islandTaught), les commandes qu'une leçon a montrées ({ harvest, road }) ;
    // les autres sont grisées. null : tout répond
    taught: { type: Object, default: null }
  },
  emits: ['chests', 'log', 'finds', 'trip', 'zoom', 'immersive', 'road', 'harvest'],
  data() {
    return { ICON, ROAD_ICON };
  },
  computed: {
    // Sur le bouton : les parties seulement (le texte complet est lu par les lecteurs d'écran)
    chargesShort() {
      return this.chargesMax ? `${this.charges}/${this.chargesMax}` : String(this.charges);
    }
  },
  methods: {
    // Une commande pas encore enseignée par le tutoriel : grisée, elle ne répond pas
    locked(key) {
      return Boolean(this.taught && !this.taught[key]);
    }
  }
};
</script>

<style scoped src="./IslandButtons.css"></style>
