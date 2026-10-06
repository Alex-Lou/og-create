// Le Grimoire : le pendu d'une page (HangmanSheet). Une lettre par case, le serveur juge ; mot complet, l'élément
// s'inscrit. Mixin de BookView.vue : ses données et méthodes s'ajoutent à celles du Livre, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { CHAPTER_STYLE } from '@/book/painter';
import { burst, vibrate, HAPTIC } from '@/utils/fx';

// Rejouer un pendu perdu sans attendre le lendemain (le serveur fixe le prix : services/bookLetters.js)
const RETRY_PRICE = 20;

export default {
  data() {
    return {
      // Pendu ouvert : { page, chapter, style, verdict, inscribed } ; une lettre envoyée attend le verdict du serveur
      guess: null,
      guessBusy: false,
      RETRY_PRICE
    };
  },
  methods: {
    // ----- Pendu -----
    openGuess(id) {
      const model = this.models.find(m => m.type === 'reach' && m.key === id);
      if (!model || !model.page.hangman) return;
      this.guess = { page: { ...model.page }, chapter: { id: model.chapter.id, name: model.chapter.name }, style: CHAPTER_STYLE[model.chapter.id], verdict: null, inscribed: '' };
    },
    // Nouvel état d'un pendu (réponse du serveur) : la page peinte et la feuille ouverte suivent
    applyHangman(id, hangman) {
      const page = this.bookData && this.bookData.chapters.flatMap(c => c.pages).find(p => p.id === id);
      if (!page) return;
      page.hangman = hangman;
      this.models = this.buildModels(this.bookData);
      this.modelsVersion++;
      if (this.engine) this.engine.refresh();
      if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, page: { ...page } };
    },
    // Une lettre posée dans une case ; mot complet : le serveur inscrit l'élément (comme un mélange)
    async onGuess({ position, letter }) {
      if (!this.guess || this.guessBusy) return;
      const id = this.guess.page.id;
      this.guessBusy = true;
      try {
        const { hangman, verdict, inscribed } = await playService.letter(id, position, letter);
        this.applyHangman(id, hangman);
        if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, verdict: { position, letter, verdict } };
        if (inscribed) {
          if (this.guess && this.guess.page.id === id) this.guess = { ...this.guess, inscribed: inscribed.result };
          vibrate(HAPTIC.discovery);
          burst({ x: window.innerWidth / 2, y: window.innerHeight * 0.3 }, 22, 150);
          this.$emit('inscribed', inscribed);
        } else {
          vibrate(verdict === 'miss' ? HAPTIC.fail : HAPTIC.tap);
        }
      } catch (error) {
        // Partie perdue entre-temps : le serveur renvoie l'état à montrer
        if (error.response?.data?.hangman) this.applyHangman(id, error.response.data.hangman);
        else this.$emit('show-alert', messageOf(error, 'Cette lettre n’a pas pu être jouée.'));
      } finally {
        this.guessBusy = false;
      }
    },
    async onRetry() {
      if (!this.guess || this.guessBusy) return;
      const id = this.guess.page.id;
      this.guessBusy = true;
      try {
        const { hangman, coins } = await playService.retryLetters(id);
        this.applyHangman(id, hangman);
        this.$emit('coins-updated', coins);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Impossible de rejouer pour l’instant.'));
      } finally {
        this.guessBusy = false;
      }
    }
  }
};
