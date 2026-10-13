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
      <!-- Le moment (choix de l'auteur, 13 oct.) : le sceau de cire tombe, frappe, se fend en deux en lâchant une
           poussière d'or ; dessous paraît le médaillon du succès, puis son nom se déroule sur le ruban -->
      <div class="seal__stage" aria-hidden="true">
        <span class="seal__medal">
          <img v-if="achievement.image" :src="achievement.image" alt="" class="seal__image" />
          <GSeal v-else :size="88" />
        </span>
        <span class="seal__ring"></span>
        <span class="seal__wax">
          <span class="seal__half seal__half--left"></span>
          <span class="seal__half seal__half--right"></span>
          <span class="seal__crack"></span>
        </span>
        <span class="seal__dust"><i v-for="d in DUST" :key="d.id" :style="d.style"></i></span>
      </div>
      <h2 class="g-display seal__name">{{ achievement.name }}</h2>
      <hr class="g-rule seal__rule" />
      <p class="g-italic seal__description">{{ achievement.description }}</p>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import GSeal from '@/components/ui/GSeal/GSeal.vue';

// (le moment dure ~1,8 s : la fenêtre reste ensuite le temps d'être lue)
const AUTO_CLOSE_DELAY = 6500;
const FADE_DURATION = 320;

// La poussière d'or qui jaillit de la fente : des grains fixes (direction, distance, taille, départ)
const DUST = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + (i % 2) * 0.22;
  const d = 46 + (i % 4) * 12;
  return { id: i, style: { '--dx': `${Math.round(Math.cos(a) * d)}px`, '--dy': `${Math.round(Math.sin(a) * d * 0.8 - 10)}px`, '--s': `${7 + (i % 3) * 3}px`, animationDelay: `${780 + (i % 5) * 24}ms` } };
});

// Annonce d'un succès débloqué : le sceau rompu, puis la fenêtre se referme seule après 6,5 s
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
      DUST,
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

<style scoped src="./GameAchievementsPopup.css"></style>

<style src="./GameAchievementsPopup.global.css"></style>
