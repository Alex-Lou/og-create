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
import { messageOf } from '@/utils/errors';
import customizationService from '@/services/customizationService';
import GModal from '@/components/ui/GModal/GModal.vue';
import GSigil from '@/components/ui/GSigil/GSigil.vue';
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
        this.flash(messageOf(error, 'L’achat n’a pas abouti.'), 'error');
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

<style scoped src="./CustomizeModal.css"></style>

<style src="./CustomizeModal.global.css"></style>
