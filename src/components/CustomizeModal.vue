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

        <div class="selection-section">
          <h3>Sélection de cadre</h3>
          <div class="frame-grid">
            <div 
              v-for="frame in frameImages" 
              :key="frame"
              :class="['frame-item', { selected: selectedFrame === frame }]"
              @click="selectFrame(frame)"
            >
              <img :src="require(`@/assets/Svgs/${frame}`)" :alt="frame" />
            </div>
          </div>

          <h3>Sélection d'avatar</h3>
          <div class="avatar-grid">
            <div 
              v-for="avatar in avatarImages" 
              :key="avatar"
              :class="['avatar-item', { selected: selectedAvatar === avatar }]"
              @click="selectAvatar(avatar)"
            >
              <img :src="require(`@/assets/Svgs/${avatar}`)" :alt="avatar" />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="save-btn" @click="save">Enregistrer</button>
        <button class="cancel-btn" @click="closeModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/CustomizeModalStyle.css';

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
    }
  },
  data() {
    return {
      selectedFrame: this.currentFrame,
      selectedAvatar: this.currentAvatar,
      frameImages: [],
      avatarImages: []
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    selectFrame(frameImage) {
      this.selectedFrame = frameImage;
    },
    selectAvatar(avatarImage) {
      this.selectedAvatar = avatarImage;
    },
    save() {
      this.$emit('save', {
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      });
      this.closeModal();
    },
    loadImages() {
      // Utiliser le contexte require pour charger dynamiquement les images
      const svgContext = require.context('@/assets/Svgs', false, /\.(png|jpe?g|svg)$/);
      
      // Obtenir tous les noms de fichiers
      const imageFiles = svgContext.keys().map(key => {
        // Extraire le nom du fichier à partir du chemin (./nomfichier.ext -> nomfichier.ext)
        return key.split('./')[1];
      });
      
      // Filtrer les cadres (contient "Cadre" dans le nom)
      this.frameImages = imageFiles.filter(file => 
        file.includes('Cadre') || file.includes('cadre') || file.includes('frame') || file.includes('Frame')
      );
      
      // Filtrer les avatars (contient "Avatar" dans le nom)
      this.avatarImages = imageFiles.filter(file => 
        file.includes('Avatar') || file.includes('avatar')
      );
      
      // Si aucun avatar n'est trouvé, ajouter l'image coin.png comme avatar par défaut
      if (this.avatarImages.length === 0 && imageFiles.includes('coin.png')) {
        this.avatarImages.push('coin.png');
      }
      
      console.log('Cadres trouvés:', this.frameImages);
      console.log('Avatars trouvés:', this.avatarImages);
      
      // Vérifier si le cadre et l'avatar actuels existent dans les listes
      if (!this.frameImages.includes(this.selectedFrame) && this.frameImages.length > 0) {
        this.selectedFrame = this.frameImages[0];
      }
      
      if (!this.avatarImages.includes(this.selectedAvatar) && this.avatarImages.length > 0) {
        this.selectedAvatar = this.avatarImages[0];
      }
    }
  },
  mounted() {
    // Charger les images au montage du composant
    this.loadImages();
  }
}
</script>