<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Personnaliser votre profil</h2>
        <button @click="closeModal" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="preview-section">
          <h3>Aperçu</h3>
          <div class="user-preview">
            <img 
              :src="require(`@/assets/Svgs/${selectedFrame}`)" 
              alt="Cadre" 
              class="frame-image-preview"
            />
            <img 
              :src="require(`@/assets/Svgs/${selectedAvatar}`)" 
              alt="Avatar" 
              class="user-image-preview"
            />
          </div>
        </div>

        <div class="user-info">
          <p><span class="coins-icon">🪙</span> {{ coins }} pièces disponibles</p>
        </div>

        <div class="selection-section">
          <h3>Sélection de cadre</h3>
          <div class="frame-grid">
            <div 
              v-for="frame in frames" 
              :key="frame.id"
              :class="['frame-item', { 
                selected: selectedFrame === frame.image_path,
                locked: !unlockedFramePaths.includes(frame.image_path)
              }]"
              @click="handleFrameClick(frame)"
            >
              <img :src="require(`@/assets/Svgs/${frame.image_path}`)" :alt="frame.name" />
              <div v-if="!unlockedFramePaths.includes(frame.image_path)" class="locked-overlay">
                <i class="lock-icon">🔒</i>
                <span class="price">{{ frame.price }} 🪙</span>
              </div>
            </div>
          </div>

          <h3>Sélection d'avatar</h3>
          <div class="avatar-grid">
            <div 
              v-for="avatar in avatars" 
              :key="avatar.id"
              :class="['avatar-item', { 
                selected: selectedAvatar === avatar.image_path,
                locked: !unlockedAvatarPaths.includes(avatar.image_path)
              }]"
              @click="handleAvatarClick(avatar)"
            >
              <img :src="require(`@/assets/Svgs/${avatar.image_path}`)" :alt="avatar.name" />
              <div v-if="!unlockedAvatarPaths.includes(avatar.image_path)" class="locked-overlay">
                <i class="lock-icon">🔒</i>
                <span class="price">{{ avatar.price }} 🪙</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="purchaseMessage" :class="['purchase-message', purchaseStatus]">
          {{ purchaseMessage }}
        </div>
      </div>
      <div class="modal-footer">
        <button class="save-btn" @click="save" :disabled="isSaving">
          {{ isSaving ? 'Sauvegarde...' : 'Enregistrer' }}
        </button>
        <button class="cancel-btn" @click="closeModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/CustomizeModalStyle.css';
import customizationService from '@/services/customizationService';

export default {
  name: "CustomizeModal",
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
      purchaseMessage: '',
      purchaseStatus: '',
      coins: this.userCoins
    };
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
    
    async loadAllItems() {
      try {
        this.isLoading = true;
        
        const [allItems, unlockedItems, selections] = await Promise.all([
          customizationService.getAllItems(),
          customizationService.getUnlockedItems(),
          customizationService.getUserSelections()
        ]);
        
        console.log('Tous les items:', allItems);
        console.log('Items déverrouillés:', unlockedItems);
        console.log('Sélections actuelles:', selections);
        
        this.frames = customizationService.getFrames(allItems);
        this.avatars = customizationService.getAvatars(allItems);
        this.unlockedItems = unlockedItems;
        
        this.unlockedFramePaths = customizationService.getFrames(unlockedItems)
          .map(frame => frame.image_path);
        
        this.unlockedAvatarPaths = customizationService.getAvatars(unlockedItems)
          .map(avatar => avatar.image_path);
        
        if (selections) {
          this.selectedFrame = selections.selectedFrame || this.currentFrame;
          this.selectedAvatar = selections.selectedAvatar || this.currentAvatar;
        }
        
        console.log('Frames disponibles:', this.frames);
        console.log('Avatars disponibles:', this.avatars);
        console.log('Frames déverrouillés:', this.unlockedFramePaths);
        console.log('Avatars déverrouillés:', this.unlockedAvatarPaths);
      } catch (error) {
        console.error('Erreur lors du chargement des items:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async handleFrameClick(frame) {
      if (this.unlockedFramePaths.includes(frame.image_path)) {
        this.selectedFrame = frame.image_path;
      } else {
        await this.purchaseItem(frame);
      }
    },
    
    async handleAvatarClick(avatar) {
      if (this.unlockedAvatarPaths.includes(avatar.image_path)) {
        this.selectedAvatar = avatar.image_path;
      } else {
        await this.purchaseItem(avatar);
      }
    },
    
    async purchaseItem(item) {
      try {
        if (this.coins < item.price) {
          this.purchaseMessage = `Vous n'avez pas assez de pièces ! Il vous manque ${item.price - this.coins} 🪙`;
          this.purchaseStatus = 'error';
          
          setTimeout(() => {
            this.purchaseMessage = '';
          }, 3000);
          
          return;
        }
        
        const confirmPurchase = confirm(`Voulez-vous acheter "${item.name}" pour ${item.price} pièces ?`);
        
        if (!confirmPurchase) return;
        
        const result = await customizationService.purchaseItem(item.id);
        
        this.coins = result.remainingCoins;
        
        // Émission de l'événement pour mettre à jour le composant parent
        this.$emit('coins-updated', result.remainingCoins);
        
        if (item.type === 'frame') {
          this.unlockedFramePaths.push(item.image_path);
          this.selectedFrame = item.image_path;
        } else if (item.type === 'avatar') {
          this.unlockedAvatarPaths.push(item.image_path);
          this.selectedAvatar = item.image_path;
        }
        
        this.purchaseMessage = `${item.name} acheté avec succès !`;
        this.purchaseStatus = 'success';
        
        setTimeout(() => {
          this.purchaseMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Erreur lors de l\'achat:', error);
        
        this.purchaseMessage = error.response?.data?.message || 'Erreur lors de l\'achat';
        this.purchaseStatus = 'error';
        
        setTimeout(() => {
          this.purchaseMessage = '';
        }, 3000);
      }
    },
    
    async save() {
      try {
        this.isSaving = true;
        
        if (!this.unlockedFramePaths.includes(this.selectedFrame) || 
            !this.unlockedAvatarPaths.includes(this.selectedAvatar)) {
          this.purchaseMessage = 'Vous ne pouvez pas sélectionner un item verrouillé';
          this.purchaseStatus = 'error';
          
          setTimeout(() => {
            this.purchaseMessage = '';
          }, 3000);
          
          this.isSaving = false;
          return;
        }
        
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
        
        this.purchaseMessage = 'Erreur lors de la sauvegarde';
        this.purchaseStatus = 'error';
        
        setTimeout(() => {
          this.purchaseMessage = '';
        }, 3000);
      } finally {
        this.isSaving = false;
      }
    }
  },
  async mounted() {
    this.coins = this.userCoins;
    await this.loadAllItems();
  }
}
</script>