<template>
  <GModal eyebrow="Le Cabinet" title="Ce que tu portes se grave sur ton sceau" :width="1240" @close="closeModal">
    <div class="cabinet">
      <aside class="cabinet__preview" aria-label="Aperçu">
        <span class="g-mono cabinet__ecus">{{ coins }} écus</span>
        <GSigil
          class="cabinet__seal"
          :shares="shares"
          :rings="rings"
          :frame="tried.frame"
          :emblem="tried.avatar"
          :size="300"
          :label="`Aperçu : ${wornLabel}`"
        />
        <span class="g-display cabinet__worn">{{ wornLabel }}</span>
        <p
          :class="['cabinet__note', purchaseStatus === 'error' ? 'g-note g-note--error' : purchaseStatus === 'success' ? 'g-note g-note--ok' : 'g-italic']"
          role="status"
          aria-live="polite"
        >{{ purchaseMessage || trialNote }}</p>
      </aside>

      <div class="cabinet__shelves">
        <div class="g-tabs cabinet__tabs" role="tablist" aria-label="Rayonnages">
          <button
            v-for="family in families"
            :key="family.key"
            type="button"
            role="tab"
            :aria-selected="shelf === family.key"
            @click="shelf = family.key"
          >{{ family.title }} · {{ family.ownedCount }}/{{ family.items.length }}</button>
        </div>
        <p v-if="isLoading" class="g-mono">Ouverture du cabinet…</p>
        <template v-else>
          <section
            v-for="family in families"
            :key="family.key"
            :class="['cabinet__family', { 'is-shelf': shelf === family.key }]"
            :aria-labelledby="`cabinet-${family.key}`"
          >
            <h3 :id="`cabinet-${family.key}`" class="cabinet__family-head">
              <span class="cabinet__num">{{ family.num }}</span>
              <span class="cabinet__family-title">{{ family.title }}</span>
              <span class="cabinet__dots" aria-hidden="true"></span>
              <span class="cabinet__count">{{ family.ownedCount }} / {{ family.items.length }}</span>
            </h3>
            <div class="cabinet__grid">
              <button
                v-for="item in family.items"
                :key="item.id"
                type="button"
                :class="['cabinet__item', 'g-bevel', `is-${status(item)}`]"
                :aria-pressed="tried[item.type] === item.image_path ? 'true' : 'false'"
                :aria-label="`Essayer ${item.name} : ${statusLabel(item)}`"
                @click="tryOn(item)"
              >
                <GSigil
                  :shares="family.key === 'frame' ? shares : []"
                  :frame="family.key === 'frame' ? item.image_path : undefined"
                  :emblem="family.key === 'avatar' ? item.image_path : undefined"
                  :bare="family.key === 'avatar'"
                  :size="88"
                  label=""
                />
                <span class="cabinet__name">{{ item.name }}</span>
                <span class="g-mono cabinet__tag">
                  <svg v-if="!owned.has(item.image_path)" width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
                    <path d="M1.5 5.5h7v6h-7z"></path>
                    <path d="M3 5.5V3.5a2 2 0 0 1 4 0v2"></path>
                  </svg>
                  {{ statusLabel(item) }}
                </span>
              </button>
            </div>
          </section>
        </template>
      </div>
    </div>

    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="trying.length ? cancelTrial() : closeModal()">
        {{ trying.length ? 'Annuler l’essai' : 'Fermer' }}
      </button>
      <button v-if="!trying.length" type="button" class="g-btn" :disabled="isSaving || !changed" @click="save">
        {{ isSaving ? 'Gravure…' : 'Porter ce sceau' }}
      </button>
      <button v-else-if="trying[0].achievement" type="button" class="g-btn" disabled>Pièce à mériter</button>
      <button v-else type="button" class="g-btn" @click="purchaseItem(trying[0])">
        Acquérir · {{ trying[0].price }} écus
      </button>
    </template>

    <!-- Confirmation d'achat, par-dessus le cabinet -->
    <GModal
      v-if="pendingItem"
      eyebrow="Le Cabinet"
      :title="`Acquérir ${pendingItem.name} ?`"
      :width="460"
      @close="cancelPurchase"
    >
      <dl class="cabinet__bill">
        <div class="cabinet__line">
          <dt>Prix</dt>
          <dd class="cabinet__ecus">{{ pendingItem.price }} écus</dd>
        </div>
        <div class="cabinet__line">
          <dt>Solde après achat</dt>
          <dd class="cabinet__ecus cabinet__ecus--after">{{ coins - pendingItem.price }} écus</dd>
        </div>
      </dl>
      <hr class="g-rule" />
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="cancelPurchase">Renoncer</button>
        <button type="button" class="g-btn" :disabled="isPurchasing" @click="confirmPurchase">
          {{ isPurchasing ? 'Un instant…' : 'Acquérir' }}
        </button>
      </template>
    </GModal>
  </GModal>
</template>

<script>
import customizationService from '@/services/customizationService';
import GModal from '@/components/ui/GModal.vue';
import GSigil from '@/components/ui/GSigil.vue';
import { DEFAULT_EMBLEM, DEFAULT_FRAME } from '@/utils/cabinet';

const MESSAGE_DURATION = 3000;

// « Le Cabinet » : essayer un cadre ou un emblème sur son sceau, l'acquérir en écus (ou le mériter), le porter
export default {
  name: 'CustomizeModal',
  components: { GModal, GSigil },
  props: {
    currentFrame: { type: String, default: DEFAULT_FRAME },
    currentAvatar: { type: String, default: DEFAULT_EMBLEM },
    userCoins: { type: Number, default: 0 },
    // Sceau du joueur, pour l'aperçu
    shares: { type: Array, default: () => [] },
    rings: { type: Number, default: 0 }
  },
  emits: ['close', 'save', 'coins-updated'],
  data() {
    return {
      items: [],
      owned: new Set(),
      // Pièces posées sur l'aperçu (possédées ou non), par type
      tried: { frame: this.currentFrame, avatar: this.currentAvatar },
      // Rayonnage affiché sur mobile
      shelf: 'frame',
      isLoading: true,
      isSaving: false,
      isPurchasing: false,
      pendingItem: null,
      purchaseMessage: '',
      purchaseStatus: '',
      coins: this.userCoins
    };
  },
  computed: {
    families() {
      return [
        { key: 'frame', num: 'I', title: 'Cadres' },
        { key: 'avatar', num: 'II', title: 'Emblèmes' }
      ].map(family => {
        // Par prix croissant, les pièces à mériter en dernier
        const items = this.items
          .filter(item => item.type === family.key)
          .sort((a, b) => Boolean(a.achievement) - Boolean(b.achievement) || a.price - b.price);
        return { ...family, items, ownedCount: items.filter(item => this.owned.has(item.image_path)).length };
      });
    },
    byPath() {
      return Object.fromEntries(this.items.map(item => [item.image_path, item]));
    },
    // Pièces essayées mais pas encore possédées
    trying() {
      return ['frame', 'avatar'].map(type => this.byPath[this.tried[type]]).filter(item => item && !this.owned.has(item.image_path));
    },
    changed() {
      return this.tried.frame !== this.currentFrame || this.tried.avatar !== this.currentAvatar;
    },
    wornLabel() {
      return [this.byPath[this.tried.frame]?.name, this.byPath[this.tried.avatar]?.name].filter(Boolean).join(' · ') || 'Ton sceau';
    },
    trialNote() {
      const item = this.trying[0];
      if (!item) return this.changed ? 'Prêt à être gravé.' : 'Touche une pièce pour l’essayer.';
      return item.achievement
        ? `À l’essai : ${item.name} se mérite par le succès « ${item.achievement} ».`
        : `À l’essai : ${item.name} n’est pas encore à toi.`;
    }
  },
  watch: {
    userCoins(value) {
      this.coins = value;
    }
  },
  async mounted() {
    await this.loadAllItems();
  },
  beforeUnmount() {
    clearTimeout(this.messageTimer);
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    status(item) {
      if (item.image_path === (item.type === 'frame' ? this.currentFrame : this.currentAvatar)) return 'worn';
      if (this.tried[item.type] === item.image_path) return 'trying';
      if (this.owned.has(item.image_path)) return 'owned';
      return item.achievement ? 'earned' : 'locked';
    },
    statusLabel(item) {
      return {
        worn: 'porté',
        trying: this.owned.has(item.image_path) ? 'à l’essai' : item.achievement ? `succès · ${item.achievement}` : `${item.price} écus`,
        owned: 'possédé',
        earned: `succès · ${item.achievement}`,
        locked: `${item.price} écus`
      }[this.status(item)];
    },
    // Message temporaire sous l'aperçu
    flash(message, status) {
      clearTimeout(this.messageTimer);
      this.purchaseMessage = message;
      this.purchaseStatus = status;
      this.messageTimer = setTimeout(() => {
        this.purchaseMessage = '';
        this.purchaseStatus = '';
      }, MESSAGE_DURATION);
    },
    async loadAllItems() {
      try {
        const [allItems, unlockedItems] = await Promise.all([
          customizationService.getAllItems(),
          customizationService.getUnlockedItems()
        ]);
        this.items = allItems;
        this.owned = new Set(unlockedItems.map(item => item.image_path));
      } catch (error) {
        this.flash('Le cabinet n’a pas pu être ouvert.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    tryOn(item) {
      this.tried = { ...this.tried, [item.type]: item.image_path };
    },
    cancelTrial() {
      this.tried = { frame: this.currentFrame, avatar: this.currentAvatar };
    },
    // Vérifie le solde puis ouvre la confirmation
    purchaseItem(item) {
      if (this.coins < item.price) {
        this.flash(`Il te manque ${item.price - this.coins} écus.`, 'error');
        return;
      }
      this.pendingItem = item;
    },
    cancelPurchase() {
      if (!this.isPurchasing) this.pendingItem = null;
    },
    async confirmPurchase() {
      const item = this.pendingItem;
      if (!item || this.isPurchasing) return;
      this.isPurchasing = true;
      try {
        const result = await customizationService.purchaseItem(item.id);
        this.coins = result.remainingCoins;
        this.$emit('coins-updated', result.remainingCoins);
        this.owned = new Set([...this.owned, item.image_path]);
        this.flash(`${item.name} est à toi.`, 'success');
      } catch (error) {
        this.flash(error.response?.data?.message || 'L’achat n’a pas abouti.', 'error');
      } finally {
        this.isPurchasing = false;
        this.pendingItem = null;
      }
    },
    async save() {
      if (this.trying.length) return;
      this.isSaving = true;
      try {
        await customizationService.saveUserSelections({ selectedFrame: this.tried.frame, selectedAvatar: this.tried.avatar });
        this.$emit('save', { frame: this.tried.frame, avatar: this.tried.avatar });
        this.closeModal();
      } catch (error) {
        this.flash('Le sceau n’a pas pu être gravé.', 'error');
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
.cabinet {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

/* Aperçu : le sceau avec les pièces essayées */
.cabinet__preview {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}
.cabinet__ecus {
  margin: 0;
  font-family: var(--oc-font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--oc-gold);
}
.cabinet__preview > .cabinet__ecus { align-self: flex-end; }
.cabinet__ecus--after { color: var(--oc-text-muted); }
.cabinet__seal { max-width: 100%; height: auto; }
.cabinet__worn { font-size: 22px; line-height: 1.2; color: var(--oc-text-strong); }
.cabinet__note { min-height: 2.9em; margin: 0; font-size: 16px; color: var(--oc-text-muted); }

/* Rayonnages numérotés */
.cabinet__shelves { display: flex; flex-direction: column; gap: 26px; min-width: 0; }
.cabinet__tabs { display: none; }
.cabinet__family { display: flex; flex-direction: column; gap: 14px; }
.cabinet__family-head {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-weight: 400;
}
.cabinet__num { min-width: 24px; font-family: var(--oc-font-display); font-size: 15px; color: var(--oc-gold); }
.cabinet__family-title { font-family: var(--oc-font-display); font-size: 19px; letter-spacing: 0.04em; color: var(--oc-text-strong); }
.cabinet__dots { flex: 1; min-width: 16px; border-bottom: 1px dotted var(--oc-line-strong); transform: translateY(-4px); }
.cabinet__count { font-family: var(--oc-font-mono); font-size: 11px; color: var(--oc-text-muted); }
.cabinet__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; }

.cabinet__item {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px 12px;
  border: 0;
  cursor: pointer;
  color: var(--oc-text);
  background: linear-gradient(180deg, rgba(233, 223, 200, 0.045), rgba(233, 223, 200, 0.012));
  box-shadow: inset 0 0 0 1px var(--oc-line);
  transition: box-shadow var(--oc-fast), background var(--oc-fast);
}
.cabinet__item:hover { box-shadow: inset 0 0 0 1px var(--oc-line-strong); }
.cabinet__item.is-worn { box-shadow: inset 0 0 0 1px var(--oc-gold), var(--oc-shadow-accent); }
.cabinet__item.is-trying { background: var(--oc-gold-soft); box-shadow: inset 0 0 0 1px var(--oc-accent-line); }
.cabinet__item.is-earned .g-sigil, .cabinet__item.is-locked .g-sigil { opacity: 0.6; }
.cabinet__name { font-size: 15px; line-height: 1.15; text-align: center; }
.cabinet__tag { display: flex; align-items: center; gap: 5px; font-size: 9px; text-align: center; }
.is-worn .cabinet__tag, .is-trying .cabinet__tag, .is-locked .cabinet__tag { color: var(--oc-gold); }

.cabinet__bill { margin: 0; display: flex; flex-direction: column; gap: 10px; }
.cabinet__line { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.cabinet__line dt { font-size: 17px; }
.cabinet__line dd { margin: 0; }

/* Mobile : aperçu en haut, un rayonnage à la fois (onglets) */
@media (max-width: 859px) {
  .cabinet { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .cabinet__preview { position: static; gap: 8px; }
  .cabinet__seal { width: 190px; }
  .cabinet__worn { font-size: 19px; }
  .cabinet__note { min-height: 0; font-size: 15px; }
  .cabinet__tabs { display: flex; }
  .cabinet__family { display: none; }
  .cabinet__family.is-shelf { display: flex; }
  .cabinet__family-head { display: none; }
  .cabinet__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .cabinet__item { padding: 10px 4px; }
  .cabinet__item .g-sigil { width: 70px; height: 70px; }
  .cabinet__name { font-size: 13px; }
}
</style>

<style>
/* Mobile : le cabinet occupe tout l'écran, actions collées en bas */
@media (max-width: 859px) {
  .g-modal-backdrop:has(> .g-modal > .cabinet) { padding: 0; }
  .g-modal:has(> .cabinet) {
    width: 100% !important;
    height: 100%;
    max-height: none;
    padding: calc(24px + env(safe-area-inset-top)) 16px 0;
  }
  .g-modal:has(> .cabinet) > .g-modal__actions {
    position: sticky;
    bottom: 0;
    margin: auto -16px 0;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: var(--oc-surface-strong);
    box-shadow: 0 -1px 0 var(--oc-line);
  }
  .g-modal:has(> .cabinet) > .g-modal__actions > * { flex: 1; }
}
</style>
