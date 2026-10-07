// L'île : la Récolte et les mini-jeux des bâtiments (ouvrir, jouer, envoyer la partie, montrer le résultat). Mixin de
// WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';

export default {
  data() {
    return {
      run: null,
      sending: false,
      runResult: null,
      // Écus de la Récolte rendue (1 par tranche de 10 ressources)
      runEarned: 0,
      runError: '',
      // Mini-jeu ouvert (id), sa partie, son envoi, son résultat
      gameId: null,
      gameRun: null,
      gameStarting: false,
      gameSending: false,
      gameResult: null,
      gameError: ''
    };
  },
  computed: {
    // Mini-jeu ouvert : sa vue (réserve de parties à jour) et le nom de son bâtiment
    gameView() {
      return this.gameId && this.state ? (this.state.games || []).find(g => g.id === this.gameId) || null : null;
    },
    gameSiteName() {
      const site = this.gameView && this.state.sites.find(s => s.id === this.gameView.site);
      return site ? site.name : '';
    }
  },
  methods: {
    async startHarvest() {
      this.busy = true;
      try {
        this.site = null;
        this.runResult = null;
        this.runEarned = 0;
        this.runError = '';
        this.runChest = null;
        this.run = await playService.harvestStart();
        this.syncLoop();
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La Récolte n’a pas pu commencer.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    async finishHarvest(moves) {
      this.sending = true;
      try {
        const { gains, earned, coins, chest, world } = await playService.harvestFinish(this.run.id, moves);
        this.runResult = gains;
        this.runEarned = earned || 0;
        this.runChest = chest || null;
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.runError = messageOf(error, 'Le serveur n’a pas pu peser ta récolte.');
        this.load();
      } finally {
        this.sending = false;
      }
    },
    // Mini-jeux : la fiche du bâtiment se ferme, la fenêtre du jeu s'ouvre sur sa règle
    openGame(id) {
      this.site = null;
      this.gameId = id;
      this.gameRun = null;
      this.gameResult = null;
      this.gameError = '';
      this.syncLoop();
    },
    // Une partie : prise sur la réserve par le serveur, qui donne la graine (Rejouer : une nouvelle)
    async startGame() {
      if (this.gameStarting) return;
      this.gameStarting = true;
      this.gameError = '';
      try {
        const { run, world } = await playService.gameStart(this.gameId);
        this.gameResult = null;
        this.apply(world);
        this.gameRun = run;
      } catch (error) {
        this.gameError = messageOf(error, 'La partie n’a pas pu commencer.');
        this.gameRun = null;
        this.load();
      } finally {
        this.gameStarting = false;
      }
    },
    async finishGame(input) {
      this.gameSending = true;
      try {
        const { earned, raw, detail, coins, world } = await playService.gameFinish(this.gameRun.id, input);
        this.gameResult = { earned, raw, detail };
        this.apply(world);
        this.$emit('coins-updated', coins);
        vibrate(earned ? [12, 40, 18] : 8);
      } catch (error) {
        this.gameError = messageOf(error, 'Le serveur n’a pas pu compter tes prises.');
        this.load();
      } finally {
        this.gameSending = false;
      }
    },
    closeGame() {
      this.gameId = null;
      this.gameRun = null;
      this.syncLoop();
    },
    closeHarvest() {
      this.run = null;
      this.syncLoop();
      // Un coffre est tombé pendant la partie : il s'ouvre au retour sur l'île
      if (this.runChest) this.showChest(this.runChest);
      this.runChest = null;
    }
  }
};
