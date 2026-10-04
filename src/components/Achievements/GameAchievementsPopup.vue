<template>
  <GModal
    v-if="achievement"
    eyebrow="Sceau rompu"
    :label="`Succès débloqué : ${achievement.name}`"
    :width="420"
    align="center"
    @close="closePopup"
  >
    <div :class="['seal', { 'seal--leaving': isLeaving }]">
      <img v-if="achievement.image" :src="achievement.image" alt="" class="seal__image" />
      <GSeal v-else :size="88" />
      <h2 class="g-display g-gold seal__name">{{ achievement.name }}</h2>
      <hr class="g-rule seal__rule" />
      <p class="g-italic seal__description">{{ achievement.description }}</p>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import GSeal from '@/components/ui/GSeal.vue';

const AUTO_CLOSE_DELAY = 5000;
const FADE_DURATION = 320;

// Annonce d'un succès débloqué : se referme seule après 5 s
export default {
  name: 'GameAchievementsPopup',
  components: { GModal, GSeal },
  props: {
    achievement: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'achievement-popup-opened'],
  data() {
    return {
      autoCloseTimer: null,
      fadeTimer: null,
      isLeaving: false
    };
  },
  watch: {
    achievement(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(this.handleAchievementPopup);
      } else if (oldVal) {
        this.clearTimers();
      }
    }
  },
  mounted() {
    if (this.achievement) {
      this.$nextTick(this.handleAchievementPopup);
    }
  },
  beforeUnmount() {
    this.clearTimers();
  },
  methods: {
    handleAchievementPopup() {
      this.isLeaving = false;
      this.$emit('achievement-popup-opened');
      this.startAutoCloseTimer();
    },

    startAutoCloseTimer() {
      this.clearTimers();
      this.autoCloseTimer = setTimeout(this.fadeOutAndClose, AUTO_CLOSE_DELAY);
    },

    clearTimers() {
      clearTimeout(this.autoCloseTimer);
      clearTimeout(this.fadeTimer);
      this.autoCloseTimer = null;
      this.fadeTimer = null;
    },

    closePopup() {
      this.fadeOutAndClose();
    },

    // Fondu de la fenêtre puis fermeture (une seule émission)
    fadeOutAndClose() {
      if (this.isLeaving) return;
      this.clearTimers();
      this.isLeaving = true;
      this.fadeTimer = setTimeout(() => {
        this.$emit('close');
      }, FADE_DURATION);
    }
  }
};
</script>

<style scoped>
.seal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.seal__image {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 0 18px rgba(224, 182, 84, 0.45));
}
.seal__name {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  color: var(--oc-gold);
}
.seal__rule { width: 140px; }
.seal__description { margin: 0; font-size: 18px; }

</style>

<style>
/* Fondu de sortie de la fenêtre qui contient le sceau */
.g-modal-backdrop:has(.seal--leaving) {
  opacity: 0;
  transition: opacity 320ms var(--oc-ease-out);
}
</style>
