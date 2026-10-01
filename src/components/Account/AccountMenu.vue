<template>
  <div ref="root" class="account">
    <button
      type="button"
      :class="['account__trigger', 'g-bevel', { 'is-guest': !isLoggedIn, 'is-open': open, 'is-compact': compact }]"
      :aria-label="isLoggedIn ? `Compte de ${username}` : 'Menu du compte (invité)'"
      :aria-expanded="String(open)"
      @click="toggle"
    >
      <GSigil :shares="shares" :rings="rings" :frame="worn.frame" :emblem="worn.emblem" :size="38" label="" />
      <span class="account__tag">
        <span class="account__tag-name">{{ isLoggedIn ? username : 'Se connecter' }}</span>
        <span v-if="isLoggedIn" class="g-mono account__tag-era">{{ eraLabel }}</span>
      </span>
      <svg class="account__chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.3"></path></svg>
    </button>

    <transition name="account-pop">
      <nav v-if="open" class="account__menu g-panel" aria-label="Compte">
        <div class="account__who">
          <GSigil :shares="shares" :rings="rings" :frame="worn.frame" :emblem="worn.emblem" :size="56" />
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
    // Pièces du Cabinet portées : { frame, emblem }
    worn: { type: Object, default: () => ({}) },
    eraLabel: { type: String, default: '' },
    // Vrai pendant l'Épreuve : le sceau seul, pour laisser la place au sablier
    compact: { type: Boolean, default: false }
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
  align-items: center;
  gap: 10px;
  max-width: 240px;
  min-height: 48px;
  padding: 4px 14px 4px 6px;
  border: 0;
  cursor: pointer;
  text-align: left;
  color: var(--oc-text);
  background: rgba(233, 223, 200, 0.04);
  box-shadow: inset 0 0 0 1px var(--oc-line);
  transition: background var(--oc-fast), box-shadow var(--oc-fast);
}
.account__trigger:hover, .account__trigger.is-open { background: var(--oc-gold-soft); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
.account__trigger .g-sigil { flex-shrink: 0; transition: transform var(--oc-slow) var(--oc-ease-out); }
.account__trigger:hover .g-sigil { transform: rotate(-12deg); }
.account__tag { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.account__tag-name { font-size: 16px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--oc-text-strong); }
.is-guest .account__tag-name { color: var(--oc-gold); }
.account__tag-era { font-size: 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.account__chevron { flex-shrink: 0; color: var(--oc-text-muted); transition: transform var(--oc-fast); }
.is-open .account__chevron { transform: rotate(180deg); }
.account__trigger.is-compact { padding-right: 8px; }
.is-compact .account__tag { display: none; }
@media (max-width: 1199px) {
  .account__tag { display: none; }
  .account__trigger { padding-right: 8px; }
}
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
/* Mobile : le sceau seul ; un point doré signale qu'on peut se connecter */
@media (max-width: 859px) {
  .account__trigger { position: relative; gap: 0; min-height: 0; padding: 3px; background: none; box-shadow: none; }
  .account__tag, .account__chevron { display: none; }
  .account__trigger.is-guest::after {
    content: '';
    position: absolute;
    top: 3px;
    right: 3px;
    width: 8px;
    height: 8px;
    background: var(--oc-gold);
    transform: rotate(45deg);
    box-shadow: 0 0 8px rgba(224, 182, 84, 0.8);
  }
}
.account-pop-enter-active, .account-pop-leave-active { transition: opacity var(--oc-fast), transform var(--oc-fast) var(--oc-ease-out); }
.account-pop-enter-from, .account-pop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
