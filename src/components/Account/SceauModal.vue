<template>
  <GModal eyebrow="Sceau de" :title="username" :width="1080" @close="$emit('close')">
    <div class="sceau">
      <section class="sceau__side" aria-label="Branches du sceau">
        <p class="g-italic sceau__era">{{ eraLabel }}</p>
        <span class="g-mono">Branches du sceau</span>
        <ul class="sceau__legend">
          <li v-for="(family, index) in families" :key="family.name">
            <span class="g-display sceau__num">{{ roman(index + 1) }}</span>
            <span class="sceau__fam">
              <span>{{ family.name }}</span>
              <span class="g-bar"><span :style="{ width: `${Math.round(family.share * 100)}%`, background: family.share >= 1 ? 'var(--oc-gold)' : null }"></span></span>
            </span>
            <span class="g-mono sceau__share">{{ Math.round(family.share * 100) }}&nbsp;%</span>
          </li>
        </ul>
      </section>
      <div class="sceau__center">
        <GSigil :shares="families.map(f => f.share)" :rings="rings" :frame="worn.frame" :emblem="worn.emblem" :size="sigilSize" />
        <p class="g-italic sceau__hint">Chaque découverte le redessine. Aucun joueur n’a le même.</p>
      </div>
      <section class="sceau__side" aria-label="Accomplissements">
        <div class="sceau__stat"><span class="g-mono">Registre</span><span class="g-display sceau__big">{{ found }} <small class="g-mono">/ {{ total }}</small></span></div>
        <div class="sceau__stat"><span class="g-mono">Anneaux · succès</span><span class="g-display sceau__big">{{ rings }} <small class="g-mono">· {{ unlocked }} / {{ achievementsTotal }} sceaux</small></span></div>
        <div class="sceau__stat"><span class="g-mono">Épreuves · records</span><span>{{ records }}</span></div>
        <hr class="g-rule" />
        <div class="sceau__actions">
          <button type="button" class="g-btn g-btn--ghost g-btn--small" @click="$emit('open-codex')">Ouvrir le Codex</button>
          <button type="button" class="g-btn g-btn--ghost g-btn--small" @click="$emit('logout')">Se déconnecter</button>
        </div>
      </section>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import GSigil from '@/components/ui/GSigil.vue';
import { roman } from '@/utils/roman';

// Page du joueur : son sceau vivant et ce qui le façonne
export default {
  name: 'SceauModal',
  components: { GModal, GSigil },
  props: {
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
  emits: ['close', 'open-codex', 'logout'],
  computed: {
    records() {
      return ['Facile', 'Moyen', 'Difficile'].map(level => `${level} ${this.bestScores[level] || 0}`).join(' · ');
    },
    sigilSize() {
      return window.innerWidth < 860 ? 280 : 420;
    }
  },
  methods: {
    roman
  }
};
</script>

<style scoped>
.sceau__share { white-space: nowrap; text-align: right; }
.sceau {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 32px;
  align-items: center;
}
.sceau__side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sceau__era { margin: -10px 0 4px; font-size: 18px; }
.sceau__legend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.sceau__legend li { display: grid; grid-template-columns: 30px minmax(0, 1fr) 44px; align-items: center; gap: 10px; }
.sceau__num { font-size: 14px; color: var(--oc-gold); }
.sceau__fam { display: flex; flex-direction: column; gap: 6px; font-size: 15px; }
.sceau__legend .g-bar { height: 2px; }
.sceau__center { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.sceau__hint { margin: 0; font-size: 15px; text-align: center; }
.sceau__stat { display: flex; flex-direction: column; gap: 4px; }
.sceau__big { font-size: 30px; line-height: 1.1; }
.sceau__big small { font-size: 10px; }
.sceau__actions { display: flex; flex-wrap: wrap; gap: 10px; }
@media (max-width: 859px) {
  .sceau { grid-template-columns: 1fr; }
  .sceau__center { order: -1; }
}
</style>
