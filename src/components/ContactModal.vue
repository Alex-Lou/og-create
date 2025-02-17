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
                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Envoi...' : 'Envoyer' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
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
            isLoading: false
        }
    },
    methods: {
        handleSubmit() {
            // Ici viendra la logique d'envoi du message
            console.log('Message envoyé:', { email: this.email, message: this.message })
            this.$emit('close')
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
</style>