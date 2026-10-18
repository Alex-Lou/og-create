// L'île : le Bestiaire des animaux rencontrés (choix de l'auteur, 18 oct.). Le premier toucher d'une créature
// l'inscrit sur le compte (serveur : animals) et l'île le dit d'une pastille ; le livre s'ouvre depuis le Carnet
// d'explorateur (BestiaryBook). Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île.

import playService from '@/services/playService';
import notificationService from '@/services/notificationService';
import { creatureOfHit, creatureOf } from '@/world/creatures';
import { BESTIARY } from '@/texts/world/creatures';

export default {
  data() {
    return {
      // Le Bestiaire ouvert en plein écran
      bestiaryOpen: false
    };
  },
  watch: {
    // (le livre couvre l'écran : l'île ne s'anime pas dessous)
    bestiaryOpen() {
      this.syncLoop();
    }
  },
  created() {
    // Les rencontres en route vers le serveur (deux touchers de suite n'en font qu'une)
    this.meeting = new Set();
  },
  methods: {
    openBestiary() {
      this.logOpen = false;
      this.bestiaryOpen = true;
    },
    // Un toucher sur une créature (gestures.js : hit.animal) : la première fois, elle entre au Bestiaire. Une rencontre
    // qui échoue (hors ligne) se retente au toucher suivant, sans rien dire
    meetCreature(animal) {
      const id = creatureOfHit(animal);
      if (!id || !this.state || this.meeting.has(id) || (this.state.animals || []).some(a => a.id === id)) return;
      this.meeting.add(id);
      playService.meetAnimal(id)
        .then(({ animal: met, at }) => {
          const known = (this.state && this.state.animals) || [];
          if (!this.state || known.some(a => a.id === met)) return;
          this.state.animals = [...known, { id: met, at }];
          notificationService.show({ message: BESTIARY.met(creatureOf(met).name), type: 'success' });
        })
        .catch(() => {})
        .finally(() => this.meeting.delete(id));
    }
  }
};
