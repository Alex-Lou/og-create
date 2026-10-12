<template>
  <transition name="toast-pop" appear>
    <div v-if="isVisible" :class="['toast', `toast--${type}`]">
      <span class="toast__medal" aria-hidden="true">
        <ElementGlyph v-if="medal" :glyph="medal" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="type === 'success'" d="M5 12.5l4.5 4.5L19 7.5" />
          <path v-else d="M12 6v7.5M12 18.2v.1" />
        </svg>
      </span>
      <span class="toast__body">
        <span class="toast__said">{{ said }}</span>
        <span v-if="gains.length" class="toast__gains">
          <span v-for="(g, i) in gains" :key="i" class="toast__gain">{{ g.text }}<ElementGlyph v-if="gains.length > 1 && g.glyph" :glyph="g.glyph" /></span>
        </span>
        <span v-if="message" class="toast__message">{{ message }}</span>
      </span>
      <button v-if="showClose" type="button" class="toast__close" aria-label="Fermer la notification" @click="close">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"></path>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';

// Ce que dit chaque ton aux lecteurs d'écran (l'icône du médaillon le dit aux yeux)
const SAID = {
  info: 'Info :',
  success: 'Réussi :',
  warning: 'Attention :',
  error: 'Oups :',
  gain: 'Gagné :'
};
// Le médaillon de chaque ton : une icône du jeu (utils/icons.js), sinon un trait dessiné (coche, point d'exclamation)
const MEDAL = { info: 'ui:spark', gain: 'ui:basket' };

// Notification éphémère montée par notificationService : une pastille de l'île (médaillon, gains, message)
export default {
  name: 'ToastNotification',
  components: { ElementGlyph },
  props: {
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error', 'gain'].includes(value)
    },
    // Ce qu'on gagne : [{ glyph, text }] (« +40 » et l'écu) ; mis en avant, en or, avant le message
    gains: {
      type: Array,
      default: () => []
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  data() {
    return {
      isVisible: true,
      timeout: null
    };
  },
  computed: {
    said() {
      return SAID[this.type] || SAID.info;
    },
    // Un seul gain : son icône dans le médaillon (l'écu) ; plusieurs : le panier, et chaque icône à côté de son nombre
    medal() {
      if (this.type === 'gain' && this.gains.length === 1 && this.gains[0].glyph) return this.gains[0].glyph;
      return MEDAL[this.type] || null;
    }
  },
  mounted() {
    this.timeout = setTimeout(this.close, this.duration);
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
  methods: {
    close() {
      if (!this.isVisible) return;
      clearTimeout(this.timeout);
      this.isVisible = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped src="./ToastNotification.css"></style>

<style src="./ToastNotification.global.css"></style>
