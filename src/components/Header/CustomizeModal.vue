<template>
  <GModal title="Le Cabinet" eyebrow="Ce que tu portes se voit sur ton sceau" :width="960" @close="closeModal">
    <div class="cabinet">
      <aside class="cabinet__preview" aria-label="Aperçu">
        <span class="g-mono">Aperçu</span>
        <div class="cabinet__seal">
          <img :src="art(selectedAvatar, 'coin.png')" alt="" class="cabinet__seal-avatar" />
          <img :src="art(selectedFrame, 'basicCadre.png')" alt="" class="cabinet__seal-frame" />
        </div>
        <span class="g-display cabinet__worn">{{ wornLabel }}</span>
        <hr class="g-rule cabinet__rule" />
        <div class="cabinet__line">
          <span class="g-mono">Solde</span>
          <span class="cabinet__ecus">{{ coins }} écus</span>
        </div>
        <p
          :class="['g-note', 'cabinet__note', purchaseStatus === 'error' ? 'g-note--error' : 'g-note--ok']"
          role="status"
          aria-live="polite"
        >{{ purchaseMessage }}</p>
      </aside>

      <div class="cabinet__shelves">
        <p v-if="isLoading" class="g-mono">Ouverture du cabinet…</p>
        <template v-else>
          <section
            v-for="family in families"
            :key="family.key"
            class="cabinet__family"
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
                :class="['cabinet__item', 'g-bevel', {
                  'is-worn': family.selected === item.image_path,
                  'is-locked': !family.owned.includes(item.image_path)
                }]"
                :aria-pressed="family.selected === item.image_path ? 'true' : 'false'"
                :aria-label="itemLabel(item, family)"
                @click="family.onPick(item)"
              >
                <img :src="art(item.image_path, family.fallback)" alt="" class="cabinet__art" />
                <span class="cabinet__name">{{ item.name }}</span>
                <span v-if="!family.owned.includes(item.image_path)" class="cabinet__price">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
                    <path d="M1.5 5.5h7v6h-7z"></path>
                    <path d="M3 5.5V3.5a2 2 0 0 1 4 0v2"></path>
                  </svg>
                  {{ item.price }} écus
                </span>
                <span v-else :class="['g-mono', { 'g-gold': family.selected === item.image_path }]">
                  {{ family.selected === item.image_path ? 'porté' : 'possédé' }}
                </span>
              </button>
            </div>
          </section>
        </template>
      </div>
    </div>

    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="closeModal">Annuler</button>
      <button type="button" class="g-btn" :disabled="isSaving" @click="save">
        {{ isSaving ? 'Sauvegarde…' : 'Enregistrer' }}
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

const MESSAGE_DURATION = 3000;

// « Le Cabinet » : choix du cadre et de l'emblème, achat en écus
export default {
  name: 'CustomizeModal',
  components: { GModal },
  props: {
    currentFrame: {
      type: String,
      default: 'basicCadre.png'
    },
    currentAvatar: {
      type: String,
      default: 'coin.png'
    },
    userCoins: {
      type: Number,
      default: 0
    }
  },
  emits: ['close', 'save', 'coins-updated'],
  data() {
    return {
      selectedFrame: this.currentFrame,
      selectedAvatar: this.currentAvatar,
      frames: [],
      avatars: [],
      unlockedItems: [],
      unlockedFramePaths: [],
      unlockedAvatarPaths: [],
      isLoading: true,
      isSaving: false,
      isPurchasing: false,
      pendingItem: null,
      purchaseMessage: '',
      purchaseStatus: '',
      messageTimer: null,
      coins: this.userCoins
    };
  },
  computed: {
    families() {
      return [
        {
          key: 'frame',
          num: 'I',
          title: 'Cadres',
          items: this.frames,
          owned: this.unlockedFramePaths,
          selected: this.selectedFrame,
          fallback: 'basicCadre.png',
          onPick: this.handleFrameClick
        },
        {
          key: 'avatar',
          num: 'II',
          title: 'Emblèmes',
          items: this.avatars,
          owned: this.unlockedAvatarPaths,
          selected: this.selectedAvatar,
          fallback: 'coin.png',
          onPick: this.handleAvatarClick
        }
      ].map(family => ({
        ...family,
        ownedCount: family.items.filter(item => family.owned.includes(item.image_path)).length
      }));
    },
    wornLabel() {
      const frame = this.frames.find(f => f.image_path === this.selectedFrame);
      const avatar = this.avatars.find(a => a.image_path === this.selectedAvatar);
      return [frame?.name, avatar?.name].filter(Boolean).join(' · ') || 'Ton sceau';
    }
  },
  watch: {
    userCoins(newVal) {
      this.coins = newVal;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    // Image du dossier Svgs, avec repli si le fichier est absent
    art(path, fallback) {
      try {
        return require(`@/assets/Svgs/${path || fallback}`);
      } catch (error) {
        return require(`@/assets/Svgs/${fallback}`);
      }
    },

    itemLabel(item, family) {
      if (!family.owned.includes(item.image_path)) return `${item.name}, ${item.price} écus, à acquérir`;
      return `${item.name}, ${family.selected === item.image_path ? 'porté' : 'possédé'}`;
    },

    // Message temporaire sous l'aperçu
    flash(message, status) {
      clearTimeout(this.messageTimer);
      this.purchaseMessage = message;
      this.purchaseStatus = status;
      this.messageTimer = setTimeout(() => {
        this.purchaseMessage = '';
      }, MESSAGE_DURATION);
    },

    async loadAllItems() {
      try {
        this.isLoading = true;

        const [allItems, unlockedItems, selections] = await Promise.all([
          customizationService.getAllItems(),
          customizationService.getUnlockedItems(),
          customizationService.getUserSelections()
        ]);

        this.frames = customizationService.getFrames(allItems);
        this.avatars = customizationService.getAvatars(allItems);
        this.unlockedItems = unlockedItems;

        this.unlockedFramePaths = customizationService.getFrames(unlockedItems).map(frame => frame.image_path);
        this.unlockedAvatarPaths = customizationService.getAvatars(unlockedItems).map(avatar => avatar.image_path);

        if (selections) {
          this.selectedFrame = selections.selectedFrame || this.currentFrame;
          this.selectedAvatar = selections.selectedAvatar || this.currentAvatar;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des items:', error);
      } finally {
        this.isLoading = false;
      }
    },

    handleFrameClick(frame) {
      if (this.unlockedFramePaths.includes(frame.image_path)) {
        this.selectedFrame = frame.image_path;
      } else {
        this.purchaseItem(frame);
      }
    },

    handleAvatarClick(avatar) {
      if (this.unlockedAvatarPaths.includes(avatar.image_path)) {
        this.selectedAvatar = avatar.image_path;
      } else {
        this.purchaseItem(avatar);
      }
    },

    // Vérifie le solde puis ouvre la confirmation
    purchaseItem(item) {
      if (this.coins < item.price) {
        this.flash(`Vous n’avez pas assez d’écus ! Il vous manque ${item.price - this.coins} écus`, 'error');
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
        // Le parent met à jour son solde
        this.$emit('coins-updated', result.remainingCoins);

        if (item.type === 'frame') {
          this.unlockedFramePaths.push(item.image_path);
          this.selectedFrame = item.image_path;
        } else if (item.type === 'avatar') {
          this.unlockedAvatarPaths.push(item.image_path);
          this.selectedAvatar = item.image_path;
        }

        this.flash(`${item.name} acquis avec succès !`, 'success');
      } catch (error) {
        console.error('Erreur lors de l\'achat:', error);
        this.flash(error.response?.data?.message || 'Erreur lors de l\'achat', 'error');
      } finally {
        this.isPurchasing = false;
        this.pendingItem = null;
      }
    },

    async save() {
      if (!this.unlockedFramePaths.includes(this.selectedFrame) ||
          !this.unlockedAvatarPaths.includes(this.selectedAvatar)) {
        this.flash('Vous ne pouvez pas sélectionner un item verrouillé', 'error');
        return;
      }

      try {
        this.isSaving = true;

        await customizationService.saveUserSelections({
          selectedFrame: this.selectedFrame,
          selectedAvatar: this.selectedAvatar
        });

        this.$emit('save', {
          frame: this.selectedFrame,
          avatar: this.selectedAvatar
        });

        this.closeModal();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        this.flash('Erreur lors de la sauvegarde', 'error');
      } finally {
        this.isSaving = false;
      }
    }
  },
  async mounted() {
    this.coins = this.userCoins;
    await this.loadAllItems();
  },
  beforeUnmount() {
    clearTimeout(this.messageTimer);
  }
};
</script>

<style scoped>
.cabinet {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 36px;
  align-items: start;
}

/* Aperçu : sceau porté et solde */
.cabinet__preview {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: inset 0 0 0 1px var(--oc-line);
}
.cabinet__seal {
  position: relative;
  width: 168px;
  height: 168px;
}
.cabinet__seal-frame,
.cabinet__seal-avatar {
  position: absolute;
  object-fit: contain;
}
.cabinet__seal-frame { inset: 0; width: 100%; height: 100%; }
.cabinet__seal-avatar { inset: 15%; width: 70%; height: 70%; }
.cabinet__worn { font-size: 21px; line-height: 1.2; }
.cabinet__rule { align-self: stretch; }
.cabinet__line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  align-self: stretch;
}
.cabinet__ecus {
  margin: 0;
  font-family: var(--oc-font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--oc-gold);
}
.cabinet__ecus--after { color: var(--oc-text-muted); }
.cabinet__note { min-height: 1.45em; }

/* Rayonnages numérotés */
.cabinet__shelves {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}
.cabinet__family { display: flex; flex-direction: column; gap: 14px; }
.cabinet__family-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0;
  font-weight: 400;
}
.cabinet__num {
  min-width: 22px;
  font-family: var(--oc-font-display);
  font-size: 15px;
  color: var(--oc-gold);
}
.cabinet__family-title {
  font-family: var(--oc-font-display);
  font-size: 19px;
  letter-spacing: 0.05em;
  color: var(--oc-text-strong);
  white-space: nowrap;
}
.cabinet__dots {
  flex: 1;
  border-bottom: 1px dotted var(--oc-line-strong);
  transform: translateY(-4px);
}
.cabinet__count {
  font-family: var(--oc-font-mono);
  font-size: 11px;
  color: var(--oc-text-muted);
}

.cabinet__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 12px;
}
.cabinet__item {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 16px 8px 12px;
  border: 0;
  cursor: pointer;
  color: var(--oc-text);
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  transition: background var(--oc-fast), box-shadow var(--oc-fast);
}
.cabinet__item:hover { background: var(--oc-surface-hover); }
.cabinet__item.is-worn { box-shadow: inset 0 0 0 1px var(--oc-accent-line), var(--oc-shadow-accent); }
.cabinet__art {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.cabinet__item.is-locked .cabinet__art { opacity: 0.35; filter: grayscale(1); }
.cabinet__name { font-size: 15px; line-height: 1.2; }
.cabinet__price {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--oc-font-mono);
  font-size: 11px;
  color: var(--oc-gold);
}

/* Confirmation d'achat */
.cabinet__bill { display: flex; flex-direction: column; gap: 14px; margin: 0; }
.cabinet__bill dt { font-size: 18px; }

@media (max-width: 859px) {
  .cabinet { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .cabinet__preview {
    position: static;
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    grid-template-areas: 'seal worn' 'seal line' 'note note';
    align-items: center;
    gap: 8px 16px;
    padding: 16px;
    text-align: left;
  }
  .cabinet__preview > .g-mono,
  .cabinet__rule { display: none; }
  .cabinet__seal { grid-area: seal; width: 96px; height: 96px; }
  .cabinet__worn { grid-area: worn; font-size: 18px; }
  .cabinet__preview .cabinet__line { grid-area: line; }
  .cabinet__note { grid-area: note; min-height: 0; }
  .cabinet__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
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
