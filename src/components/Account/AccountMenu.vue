<template>
  <div ref="root" class="account">
    <button
      type="button"
      class="account__trigger"
      :aria-label="isLoggedIn ? 'Mon compte' : 'Menu'"
      :aria-expanded="String(open)"
      @click="toggle"
    >
      <GSigil :shares="shares" :rings="rings" :size="44" label="" />
    </button>

    <transition name="account-pop">
      <nav v-if="open" class="account__menu g-panel" aria-label="Compte">
        <div class="account__who">
          <GSigil :shares="shares" :rings="rings" :size="56" />
          <div class="account__id">
            <span class="g-display account__name">{{ isLoggedIn ? username : 'Invité' }}</span>
            <span class="g-mono">{{ eraLabel }}</span>
          </div>
        </div>
        <hr class="g-rule" />
        <template v-if="isLoggedIn">
          <button type="button" class="account__link" @click="pick('open-sceau')">Mon sceau</button>
          <button type="button" class="account__link" @click="pick('open-cabinet')">Le Cabinet</button>
        </template>
        <button v-else type="button" class="account__link account__link--gold" @click="openSeuil">Se connecter · créer un compte</button>
        <button type="button" class="account__link" @click="pick('open-codex')">Codex des succès</button>
        <button type="button" class="account__link" @click="pick('open-contact')">Écrire aux créateurs</button>
        <template v-if="isLoggedIn">
          <hr class="g-rule" />
          <button type="button" class="account__link account__link--quiet" @click="pick('logout')">Se déconnecter</button>
        </template>
      </nav>
    </transition>

    <SeuilModal v-if="seuilOpen" @close="seuilOpen = false" />
  </div>
</template>

<script>
import GSigil from '@/components/ui/GSigil.vue';
import SeuilModal from './SeuilModal.vue';

// Sceau du joueur dans l'en-tête : menu du compte (le Seuil pour se connecter en invité)
export default {
  name: 'AccountMenu',
  components: { GSigil, SeuilModal },
  props: {
    isLoggedIn: { type: Boolean, default: false },
    currentUser: { type: Object, default: null },
    shares: { type: Array, default: () => [] },
    rings: { type: Number, default: 0 },
    eraLabel: { type: String, default: '' }
  },
  emits: ['open-sceau', 'open-cabinet', 'open-codex', 'open-contact', 'logout'],
  data() {
    return { open: false, seuilOpen: false };
  },
  computed: {
    username() {
      return this.currentUser?.username || this.currentUser?.email || 'Alchimiste';
    }
  },
  mounted() {
    this.onOutside = event => {
      if (this.open && !this.$refs.root.contains(event.target)) this.open = false;
    };
    this.onKey = event => {
      if (event.key === 'Escape') this.open = false;
    };
    document.addEventListener('pointerdown', this.onOutside);
    document.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    document.removeEventListener('pointerdown', this.onOutside);
    document.removeEventListener('keydown', this.onKey);
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    openSeuil() {
      this.open = false;
      this.seuilOpen = true;
    },
    pick(event) {
      this.open = false;
      this.$emit(event);
    }
  }
};
</script>

<style scoped>
.account { position: relative; }
.account__trigger {
  appearance: none;
  display: flex;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
.account__trigger:hover { transform: rotate(-8deg); }
.account__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 60;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  --oc-panel: #14110d;
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--oc-shadow);
}
.account__who { display: flex; align-items: center; gap: 14px; }
.account__id { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.account__name { font-size: 19px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.account__link {
  appearance: none;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 18px;
  color: var(--oc-text);
}
.account__link:hover { color: var(--oc-gold); }
.account__link--gold { color: var(--oc-gold); }
.account__link--quiet { font-family: var(--oc-font-italic); font-style: italic; color: var(--oc-text-muted); }
.account-pop-enter-active, .account-pop-leave-active { transition: opacity var(--oc-fast), transform var(--oc-fast) var(--oc-ease-out); }
.account-pop-enter-from, .account-pop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
