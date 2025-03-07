<template>
    <div class="contact-modal">
        <div class="contact-content">
            <div class="contact-header">
                <h3>Contactez-nous</h3>
                <button class="close-btn" @click="$emit('close')">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit">
                <input 
                    type="email" 
                    v-model="email" 
                    placeholder="Votre email"
                    class="contact-input"
                    required
                />
                <textarea 
                    v-model="message" 
                    placeholder="Votre message"
                    class="contact-input contact-textarea"
                    required
                ></textarea>
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </div>
                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Envoi...' : 'Envoyer' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import '@/assets/ComponentsStyle/HeaderStyle/ContactModalStyle.css'
import axios from 'axios';

export default {
    name: 'ContactModal',
    props: {
        isDarkMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            email: '',
            message: '',
            errorMessage: '',
            successMessage: '',
            isLoading: false
        }
    },
    methods: {
        async handleSubmit() {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                await axios.post('http://localhost:3000/api/contact/send', {
                    email: this.email,
                    message: this.message
                });

                this.successMessage = 'Message envoyé avec succès !';
                this.email = '';
                this.message = '';
                
                // Ferme le modal après 2 secondes
                setTimeout(() => {
                    this.$emit('close');
                }, 2000);

            } catch (error) {
                this.errorMessage = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
                console.error('Erreur:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>