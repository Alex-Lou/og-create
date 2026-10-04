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
      <button v-if="isLoggedIn" type="button" class="sceau__row" @click="$emit('open-cabinet')">
        <span class="sceau__row-title">Le Cabinet</span><span class="sceau__row-note">Cadres et emblèmes de ton sceau</span>
      </button>
      <button type="button" class="sceau__row" @click="$emit('open-codex')">
        <span class="sceau__row-title">Codex des succès</span><span class="sceau__row-note">{{ unlocked }} sceaux rompus sur {{ achievementsTotal }}</span>
      </button>
      <button type="button" class="sceau__row" @click="$emit('open-contact')">
        <span class="sceau__row-title">Écrire aux créateurs</span><span class="sceau__row-note">Une idée, un souci : on lit tout</span>
      </button>
      <button v-if="isLoggedIn" type="button" class="sceau__logout" @click="$emit('logout')">Se déconnecter</button>
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
  </section>
</template>

<script>
import GSigil from '@/components/ui/GSigil.vue';
import { roman } from '@/utils/roman';
import { LEVELS } from '@/utils/trialProgress';

// Onglet Sceau : le sceau vivant du joueur, ce qui le façonne, et son compte (Cabinet, Codex, contact)
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
  emits: ['open-cabinet', 'open-codex', 'open-contact', 'login', 'logout'],
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

<style scoped>
.sceau {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 640px;
  margin: 0 auto;
}
.sceau__hero { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 24px 20px 20px; text-align: center; }
.sceau__name { margin-top: 10px; overflow-wrap: anywhere; }
.sceau__era { margin: 0; font-size: 17px; }
.sceau__hint { margin: 6px 0 0; font-size: 14px; color: var(--oc-text-faint); }

.sceau__stats { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.sceau__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 6px;
  border-radius: var(--r-md);
  text-align: center;
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--edge-paper), var(--shadow-1);
}
.sceau__stat strong { font-family: var(--oc-font-display); font-weight: 700; font-size: 22px; line-height: 1.1; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.sceau__stat small { font-family: var(--oc-font-body); font-weight: 800; font-size: 12px; color: var(--ink-500); }
.sceau__records { font-size: 17px !important; }

.sceau__actions { display: flex; flex-direction: column; gap: 10px; }
.sceau__login { width: 100%; }
.sceau__row {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-height: 60px;
  padding: 10px 44px 10px 18px;
  border: 0;
  border-radius: var(--r-md);
  cursor: pointer;
  text-align: left;
  position: relative;
  color: var(--ink-900);
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--edge-paper), var(--shadow-1);
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
/* Chevron de la rangée */
.sceau__row::after {
  content: '';
  position: absolute;
  right: 20px;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-top: -5px;
  border-top: 2px solid var(--ink-300);
  border-right: 2px solid var(--ink-300);
  transform: rotate(45deg);
}
.sceau__row:active { transform: translateY(2px); }
.sceau__row-title { font-family: var(--oc-font-display); font-weight: 700; font-size: 18px; }
.sceau__row-note { font-weight: 700; font-size: 13px; color: var(--ink-500); }
.sceau__logout {
  appearance: none;
  align-self: center;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--oc-font-display);
  font-style: italic;
  font-size: 16px;
  color: var(--ink-500);
}

.sceau__branches { display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; }
.sceau__legend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.sceau__legend li { display: grid; grid-template-columns: 34px minmax(0, 1fr) 48px; align-items: center; gap: 10px; }
.sceau__num { font-family: var(--oc-font-display); font-weight: 700; font-size: 14px; color: var(--oc-gold); }
.sceau__fam { display: flex; flex-direction: column; gap: 6px; font-weight: 700; font-size: 14px; }
.sceau__share { white-space: nowrap; text-align: right; font-weight: 800; font-size: 13px; font-variant-numeric: tabular-nums; color: var(--ink-500); }
</style>
