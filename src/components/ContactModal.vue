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

<style scoped>
.contact-modal {
    position: absolute;
    top: 45px; /* Position juste sous l'icône */
    right: 0;
    background: #2A2A2A;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 300px;
    z-index: 1000;
}

.contact-content {
    padding: 15px;
}

.contact-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    color: #cfcfcf;
}

.close-btn {
    background: none;
    border: none;
    color: #cfcfcf;
    font-size: 20px;
    cursor: pointer;
}

.contact-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    background: #1e1e1e;
    color: #cfcfcf;
}

.contact-textarea {
    min-height: 100px;
    resize: vertical;
}

.submit-btn {
    width: 100%;
    padding: 8px;
    background: #00acc1;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
}

.submit-btn:hover {
    background: #4dd0e1;
}

.error-message {
    color: #ff4136;
    margin-bottom: 10px;
    font-size: 14px;
}

.success-message {
    color: #2ecc71;
    margin-bottom: 10px;
    font-size: 14px;
    text-align: center;
}

</style>