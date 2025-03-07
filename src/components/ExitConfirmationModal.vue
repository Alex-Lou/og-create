<template>
    <div v-if="visible" class="exit-confirmation-modal">
      <div class="exit-confirmation-content">
        <h2>Confirmer la sortie</h2>
        <p>Êtes-vous sûr de vouloir quitter le mode Explorer ?</p>
        <div class="exit-confirmation-actions">
          <button 
            class="exit-confirmation-btn exit-confirmation-btn-yes"
            @click="$emit('confirm')"
          >
            Oui
          </button>
          <button 
            class="exit-confirmation-btn exit-confirmation-btn-no"
            @click="$emit('cancel')"
          >
            Non
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ExitConfirmationModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>