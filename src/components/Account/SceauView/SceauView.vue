<template>
  <section class="sceau" aria-label="Ton sceau">
    <!-- Le sceau vivant du joueur -->
    <div class="sceau__hero g-panel">
      <GSigil :shares="families.map(f => f.share)" :rings="rings" :frame="worn.frame" :emblem="worn.emblem" :size="sigilSize" />
      <h2 class="g-title sceau__name">{{ isLoggedIn ? username : 'Invité' }}</h2>
      <p class="g-italic sceau__era">{{ eraLabel }}</p>
      <p class="g-italic sceau__hint">Chaque découverte redessine ton sceau. Aucun joueur n’a le même.</p>
    </div>

    <ul class="sceau__stats">
      <li class="sceau__stat"><span class="g-mono">Registre</span><strong>{{ found }}<small> / {{ total }}</small></strong></li>
      <li class="sceau__stat"><span class="g-mono">Succès</span><strong>{{ unlocked }}<small> / {{ achievementsTotal }}</small></strong></li>
      <li class="sceau__stat"><span class="g-mono">Records</span><strong class="sceau__records">{{ records }}</strong></li>
    </ul>

    <!-- Tout ce qui touche au joueur, au même endroit -->
    <nav class="sceau__actions" aria-label="Ton compte">
      <button v-if="!isLoggedIn" type="button" class="g-btn sceau__login" @click="$emit('login')">Se connecter · créer un compte</button>
      <button v-if="isLoggedIn" type="button" class="sceau__row" @click="$emit('open-account')">
        <span class="sceau__row-title">Mon compte</span><span class="sceau__row-note">Nom, photo, adresse, mot de passe, mes données</span>
      </button>
      <button v-if="isLoggedIn" type="button" class="sceau__row" @click="$emit('open-cabinet')">
        <span class="sceau__row-title">Le Cabinet</span><span class="sceau__row-note">Cadres et emblèmes de ton sceau</span>
      </button>
      <button type="button" class="sceau__row" @click="$emit('open-codex')">
        <span class="sceau__row-title">Succès</span><span class="sceau__row-note">{{ unlocked }} sceaux rompus sur {{ achievementsTotal }}</span>
      </button>
      <button type="button" class="sceau__row" @click="$emit('replay-prologue')">
        <span class="sceau__row-title">Revoir le prologue</span><span class="sceau__row-note">Le naufrage de l’Hirondelle et la rencontre de Brume</span>
      </button>
      <button type="button" class="sceau__row" @click="$emit('open-contact')">
        <span class="sceau__row-title">Écrire aux créateurs</span><span class="sceau__row-note">Une idée, un souci : on lit tout</span>
      </button>
    </nav>

    <section class="sceau__branches g-panel" aria-label="Branches du sceau">
      <span class="g-mono">Branches du sceau</span>
      <ul class="sceau__legend">
        <li v-for="(family, index) in families" :key="family.name">
          <span class="sceau__num">{{ roman(index + 1) }}</span>
          <span class="sceau__fam">
            <span>{{ family.name }}</span>
            <span class="g-bar"><span :style="{ width: `${Math.round(family.share * 100)}%` }"></span></span>
          </span>
          <span class="sceau__share">{{ Math.round(family.share * 100) }}&nbsp;%</span>
        </li>
      </ul>
    </section>

    <!-- Tout en bas, loin des gestes courants -->
    <button v-if="isLoggedIn" type="button" class="sceau__logout" @click="$emit('logout')">Se déconnecter</button>
  </section>
</template>

<script>
import GSigil from '@/components/ui/GSigil/GSigil.vue';
import { roman } from '@/utils/roman';
import { LEVELS } from '@/utils/trialProgress';

// Onglet Sceau : le sceau vivant du joueur, ce qui le façonne, et son compte (Mon compte, Cabinet, Succès, contact)
export default {
  name: 'SceauView',
  components: { GSigil },
  props: {
    isLoggedIn: { type: Boolean, default: false },
    username: { type: String, default: 'Alchimiste' },
    eraLabel: { type: String, default: '' },
    // [{ name, share }] : familles entamées, dans l'ordre du registre
    families: { type: Array, default: () => [] },
    rings: { type: Number, default: 0 },
    // Pièces du Cabinet portées : { frame, emblem }
    worn: { type: Object, default: () => ({}) },
    found: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    unlocked: { type: Number, default: 0 },
    achievementsTotal: { type: Number, default: 0 },
    bestScores: { type: Object, default: () => ({}) }
  },
  emits: ['open-account', 'open-cabinet', 'open-codex', 'open-contact', 'replay-prologue', 'login', 'logout'],
  computed: {
    records() {
      return LEVELS.map(level => this.bestScores[level] || 0).join(' · ');
    },
    sigilSize() {
      return window.innerWidth < 860 ? 220 : 280;
    }
  },
  methods: {
    roman
  }
};
</script>

<style scoped src="./SceauView.css"></style>
