<template>
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Personnaliser votre avatar</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <!-- Ajoutez ici le contenu de personnalisation -->
          <p>Contenu de personnalisation en cours de développement...</p>
        </div>
        <div class="modal-footer">
          <button class="save-btn" @click="save">Enregistrer</button>
          <button class="cancel-btn" @click="closeModal">Annuler</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CustomizeModal",
    methods: {
      closeModal() {
        // Emit l'événement pour fermer le modal dans le composant parent
        this.$emit('close');
      },
      save() {
        // Logique de sauvegarde à compléter selon vos besoins
        this.$emit('save');
        this.closeModal();
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }
  
  .modal-container {
    background: #000000;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .modal-body {
    margin-top: 10px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .save-btn,
  .cancel-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .save-btn {
    background: #2D96A4;
    color: white;
  }
  
  .cancel-btn {
    background: #FF4136;
    color: white;
  }
  </style>
  