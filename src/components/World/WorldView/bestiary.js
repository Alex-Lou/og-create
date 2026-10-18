// L'île : le Bestiaire des animaux rencontrés (choix de l'auteur, 18 oct.). Le premier toucher d'une créature
// l'inscrit sur le compte (serveur : animals) et l'île le dit d'une pastille ; le livre s'ouvre depuis le Carnet
// d'explorateur (BestiaryBook). Le petit signe des raretés : une créature rare ou légendaire qui sort près de ce qu'on
// regarde scintille (un Éclat), une fois par sortie (au plus une toutes les SIGN_CALM ms) ; la première fois qu'on en
// voit une pas encore rencontrée, Brume le dit (une fois sur l'appareil, si elle ne dit rien d'autre ; avant ce qui
// attend). Ni pendant le tutoriel, ni pour le Kraken (il a déjà son signe : view/draw/life.js, sayKraken), ni pour les
// égarés (on les repousse). Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île.

import playService from '@/services/playService';
import notificationService from '@/services/notificationService';
import { creatureOfHit, creatureOf } from '@/world/creatures';
import { guide } from '@/game/guide';
import { BESTIARY } from '@/texts/world/creatures';

const SIGN_CALM = 60 * 1000;
const SIGNED = new Set(['rare', 'légendaire']);

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
    // Le petit signe : les créatures rares sorties (clé de la cible → { frame, signed }), la créature de chaque bête
    // sauvage (clé → créature rare, ou null), l'image en cours, le dernier signe (ms)
    this.rareOut = new Map();
    this.wildRare = new Map();
    this.rareFrame = 0;
    this.rareSignAt = -Infinity;
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
    },
    // À chaque image, après ce qu'on peut toucher (view/draw/loop.js) ; view : ce qu'on regarde (dans le monde)
    signRare(view) {
      if (guide.state.tutorial || !this.state) return;
      const frame = ++this.rareFrame;
      this.signAmong(this.landHits, view, frame);
      this.signAmong(this.seaHits, view, frame);
      // (rentrée, ou partie : sa prochaine sortie aura son signe)
      for (const [key, out] of this.rareOut) if (out.frame !== frame) this.rareOut.delete(key);
    },
    signAmong(hits, view, frame) {
      for (const hit of hits) {
        const creature = this.rareOf(hit);
        if (!creature) continue;
        let out = this.rareOut.get(hit.key);
        if (!out) this.rareOut.set(hit.key, (out = { frame, signed: false }));
        out.frame = frame;
        if (out.signed || hit.x < view.x || hit.x > view.x + view.w || hit.y < view.y || hit.y > view.y + view.h) continue;
        const now = performance.now();
        if (now - this.rareSignAt < SIGN_CALM) continue;
        out.signed = true;
        this.rareSignAt = now;
        this.sparkle('eclat', { x: hit.x, y: hit.y });
        const met = (this.state.animals || []).some(a => a.id === creature.id);
        if (!met && !guide.current) guide.say({ id: `rare-${creature.id}`, text: creature.rarity === 'rare' ? BESTIARY.rareLine : BESTIARY.legendLine, island: true }, { first: true });
      }
    },
    // La créature rare ou légendaire d'une cible de l'île, ou null : une bête sauvage (gardée par bête), le Géant
    rareOf(hit) {
      if (hit.kind === 'geant') return creatureOf('geant');
      const id = hit.who && hit.who.id;
      if (!id || !id.startsWith('wild:')) return null;
      if (!this.wildRare.has(id)) {
        const creature = creatureOf(creatureOfHit(hit));
        this.wildRare.set(id, creature && SIGNED.has(creature.rarity) ? creature : null);
      }
      return this.wildRare.get(id);
    }
  }
};
