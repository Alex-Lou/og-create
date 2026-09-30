<template>
  <GModal
    v-if="showModal"
    :width="540"
    align="center"
    :label="victoryRewards?.isBossReward ? 'Gardien vaincu' : 'Région explorée'"
    @close="onClose"
  >
    <!-- Victoire sur un gardien -->
    <div v-if="victoryRewards?.isBossReward" class="xv">
      <span class="g-mono g-gold">Gardien vaincu</span>
      <h2 class="g-title xv__title">La voie s'ouvre</h2>
      <p class="g-italic xv__story">
        <template v-if="victoryRewards?.alreadyDefeated">
          Tu triomphes à nouveau de {{ boss ? boss.name : 'ce gardien' }}.
        </template>
        <template v-else>
          {{ boss ? boss.name : 'Le gardien' }} retourne à l'ombre. Au-delà, la route se dessine.
        </template>
      </p>
      <figure v-if="boss && bossDefeatedImage" class="xv__figure">
        <img :src="bossDefeatedImage" :alt="`${boss.name || 'Le gardien'} vaincu`" class="xv__img" />
      </figure>
      <p v-if="victoryRewards?.alreadyDefeated" class="g-mono xv__note">Gardien déjà vaincu · aucune récompense cette fois</p>
      <dl v-else class="xv__rewards">
        <div v-if="victoryRewards?.coins"><dt class="g-mono">écus</dt><dd class="g-display g-gold">+{{ victoryRewards.coins }}</dd></div>
        <div v-if="victoryRewards?.xp"><dt class="g-mono">savoir</dt><dd class="g-display">+{{ victoryRewards.xp }}</dd></div>
        <div v-if="victoryRewards?.energy"><dt class="g-mono">souffle</dt><dd class="g-display">+{{ victoryRewards.energy }}</dd></div>
        <div v-if="victoryRewards?.bonus"><dt class="g-mono">bonus</dt><dd class="g-display xv__bonus">{{ victoryRewards.bonus }}</dd></div>
      </dl>
      <p v-if="hasUnlockedRegions && !victoryRewards?.alreadyDefeated" class="g-note g-note--ok">
        De nouvelles régions sont ouvertes sur la carte.
      </p>
      <button type="button" class="g-btn" @click="onClose">Continuer</button>
    </div>

    <!-- Région explorée -->
    <div v-else class="xv">
      <span class="g-mono xv__ok">Région explorée</span>
      <h2 class="g-title xv__title">{{ regionName }}</h2>
      <p class="g-italic xv__story">
        <template v-if="victoryRewards?.alreadyCompleted">Tu relèves une nouvelle fois le défi de {{ regionName }}.</template>
        <template v-else>Le défi de {{ regionName }} est relevé : la région s'inscrit au Carnet de route.</template>
      </p>
      <p v-if="victoryRewards?.alreadyCompleted" class="g-mono xv__note">Région déjà explorée · aucune récompense cette fois</p>
      <dl v-else class="xv__rewards">
        <div v-if="victoryRewards?.coins"><dt class="g-mono">écus</dt><dd class="g-display g-gold">+{{ victoryRewards.coins }}</dd></div>
        <div v-if="victoryRewards?.xp"><dt class="g-mono">savoir</dt><dd class="g-display">+{{ victoryRewards.xp }}</dd></div>
        <div v-if="victoryRewards?.energy"><dt class="g-mono">souffle</dt><dd class="g-display">+{{ victoryRewards.energy }}</dd></div>
      </dl>
      <p v-if="hasUnlockedRegions && !victoryRewards?.alreadyCompleted" class="g-note g-note--ok">
        De nouvelles régions sont ouvertes : pars les explorer.
      </p>
      <button type="button" class="g-btn" @click="onClose">Continuer</button>
    </div>
  </GModal>
</template>

<script>
  import GModal from '@/components/ui/GModal.vue';

  export default {
    name: 'ExplorerVictoryModal',
    components: { GModal },
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      victoryRewards: {
        type: Object,
        default: () => ({})
      },
      regionName: {
        type: String,
        default: 'cette région'
      },
      boss: {
        type: Object,
        default: null
      },
      bossDefeatedImage: {
        type: String,
        default: ''
      },
      hasUnlockedRegions: {
        type: Boolean,
        default: false
      }
    },
    emits: ['close'],
    methods: {
      onClose() {
        this.$emit('close');
      }
    }
  };
  </script>

<style scoped>
.xv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
.xv__title { font-size: 38px; }
.xv__ok { color: var(--oc-verdigris); }
.xv__story { margin: 0; font-size: 18px; line-height: 1.5; color: var(--oc-text); }
.xv__note { margin: 0; }
.xv__figure {
  margin: 0;
  width: 100%;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  background: repeating-linear-gradient(135deg, rgba(233, 223, 200, 0.03) 0 2px, transparent 2px 10px);
}
.xv__img { max-width: 100%; max-height: 100%; object-fit: contain; }
.xv__rewards {
  margin: 4px 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
}
.xv__rewards > div { display: flex; flex-direction: column-reverse; gap: 4px; }
.xv__rewards dd { margin: 0; font-size: 26px; line-height: 1.1; }
.xv__bonus { font-size: 18px; }

@media (max-width: 520px) {
  .xv__title { font-size: 30px; }
  .xv .g-btn { align-self: stretch; }
}
</style>
