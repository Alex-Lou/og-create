// L'île : le Bestiaire des animaux rencontrés (choix de l'auteur, 18 oct.). Le premier toucher d'une créature
// l'inscrit sur le compte (serveur : animals) et l'île le dit d'une pastille ; le livre s'ouvre depuis le Carnet
// d'explorateur (BestiaryBook) ; une créature rare qui sort près de ce qu'on regarde se signale (hors tutoriel). Mixin
// de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île.

import playService from '@/services/playService';
import notificationService from '@/services/notificationService';
import { creatureOfHit, creatureOf } from '@/world/creatures';
import { rareSigns } from '@/world/rareSigns';
import { guide } from '@/game/guide';
import { recordSighting } from '@/world/sightings';
import { BESTIARY, CATEGORY_TITLES } from '@/texts/world/creatures';

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
    // Le suivi des créatures rares sorties (le petit signe)
    this.rareSigns = rareSigns();
  },
  methods: {
    openBestiary() {
      this.logOpen = false;
      this.bestiaryOpen = true;
    },
    // Un toucher sur une créature (gestures.js : hit.animal) : une rencontre de plus sur cet appareil (world/sightings.js) ;
    // la première fois, elle entre au Bestiaire, et une catégorie complète rapporte ses écus. Une rencontre qui échoue
    // (hors ligne) se retente au toucher suivant, sans rien dire
    meetCreature(animal) {
      const id = creatureOfHit(animal);
      if (!id || !this.state) return;
      recordSighting(id);
      if (this.meeting.has(id) || (this.state.animals || []).some(a => a.id === id)) return;
      this.meeting.add(id);
      playService.meetAnimal(id)
        .then(({ animal: met, at, rewards = [], coins }) => {
          const known = (this.state && this.state.animals) || [];
          if (this.state && !known.some(a => a.id === met)) {
            this.state.animals = [...known, { id: met, at }];
            notificationService.show({ message: BESTIARY.met(creatureOf(met).name), type: 'success' });
          }
          // (une catégorie complète : sa récompense, versée par le serveur)
          for (const r of rewards) notificationService.show({ message: BESTIARY.reward(CATEGORY_TITLES[r.category], r.coins), type: 'success' });
          if (coins !== undefined) this.$emit('coins-updated', coins);
        })
        .catch(() => {})
        .finally(() => this.meeting.delete(id));
    },
    // Le petit signe des raretés (world/rareSigns.js), à chaque image, après ce qu'on peut toucher (view/draw/loop.js) ;
    // view : ce qu'on regarde (dans le monde). Un Éclat sur la créature ; la première fois qu'on en voit une pas encore
    // rencontrée, Brume le dit (une fois sur l'appareil, si elle ne dit rien d'autre ; avant ce qui attend)
    signRare(view) {
      if (guide.state.tutorial || !this.state) return;
      for (const { hit, creature } of this.rareSigns.see(view, performance.now(), this.landHits, this.seaHits)) {
        this.sparkle('eclat', { x: hit.x, y: hit.y });
        const met = (this.state.animals || []).some(a => a.id === creature.id);
        if (!met && !guide.current) guide.say({ id: `rare-${creature.id}`, text: creature.rarity === 'rare' ? BESTIARY.rareLine : BESTIARY.legendLine, island: true }, { first: true });
      }
    }
  }
};
