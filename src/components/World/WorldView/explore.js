// L'île : l'exploration. Les quartiers à acheter, les expéditions, les lieux et les gisements trouvés, le carnet
// d'explorateur et la réserve des trouvailles, le naufrage. Mixin de WorldView.vue : ses données et méthodes s'ajoutent
// à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { landmarkTop, landmarkScale } from '@/world/landmarkSprites';
import { landmarksShown, landmarksWaiting, landmarkTip } from '@/world/landmarks';
import { depositsShown, depositsReady, depositWait } from '@/world/finds';
import { burst, ring, vibrate } from '@/utils/fx';
import { guide } from '@/game/guide';

export default {
  data() {
    return {
      // Quartier dont la fiche d'achat est ouverte
      zone: null,
      // Carnet d'explorateur ouvert, et la page qu'il montre d'emblée (identifiant d'un lieu)
      logOpen: false,
      logFocus: null,
      // Réserve des trouvailles de climat ouverte
      findsOpen: false,
      // Naufrage annoncé (bible, § 6.7) : { id, zone, wreck, text } ou null
      wreck: null
    };
  },
  computed: {
    // Lieux remarquables des quartiers connus ; ceux d'un quartier à soi qui attendent d'être découverts
    shownLandmarks() {
      return landmarksShown(this.state);
    },
    waitingLandmarks() {
      return landmarksWaiting(this.state).length;
    },
    // Gisements des quartiers connus ; ceux d'un quartier à soi qui sont prêts ; des trouvailles en réserve
    shownDeposits() {
      return depositsShown(this.state);
    },
    readyDeposits() {
      return depositsReady(this.state, this.clock - this.loadedAt).length;
    },
    ownedFinds() {
      return Boolean(this.state && (this.state.finds || []).some(f => f.amount > 0));
    },
    // Expédition en route : temps avant son retour, en clair (« 1 h 40 », « 12 min »)
    tripLeft() {
      const trip = this.state && this.state.expedition;
      if (!trip) return '';
      const ms = Math.max(0, trip.endsIn - (this.clock - this.loadedAt));
      const minutes = Math.max(1, Math.ceil(ms / 60000));
      return minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, '0')}` : ''}` : `${minutes} min`;
    }
  },
  methods: {
    zoneName(id) {
      return this.state.map.zones.find(z => z.id === id)?.name || '';
    },
    sitesIn(zone) {
      return this.state.sites.filter(s => s.zone === zone.id).map(s => s.name);
    },
    // Achat d'un quartier : la brume se dissipe, le panneau éclate
    async buyZone(zone) {
      this.busy = true;
      try {
        const sign = this.signs.find(sg => sg.zone.id === zone.id);
        const { bought, coins, world } = await playService.worldZone(zone.id);
        this.unveils.set(zone.id, performance.now());
        this.zone = null;
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (sign) {
          const sp = this.toScreen(sign.x, sign.y);
          const at = this.canvasPoint(sp.x, sp.y);
          ring(at, 140);
          burst(at, 30, 110);
        }
        vibrate([14, 40, 20]);
        this.$emit('show-alert', `Nouveau quartier : ${bought}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le quartier n’a pas pu être acheté.'));
      } finally {
        this.busy = false;
      }
    },
    // Expédition vers un quartier inconnu : le serveur prend vivres, bois et une partie de Récolte ; elle revient après
    // zone.trip heures (l'île se recharge alors, le quartier se dévoile)
    async explore(zone) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { world } = await playService.worldExpedition(zone.id);
        this.apply(world);
        this.zone = null;
        vibrate([10, 30, 10]);
        this.$emit('show-alert', `L’expédition est partie ! Retour dans ${zone.trip} h.`);
        guide.tip('expedition');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’expédition n’a pas pu partir.'));
      } finally {
        this.busy = false;
      }
    },
    // La pastille de l'expédition : la caméra va vers le quartier qu'elle explore, sa fiche s'ouvre
    showExpedition() {
      const zone = this.state.map.zones.find(z => z.id === this.state.expedition.zone);
      if (!zone) return;
      if (zone.anchor) {
        const c = this.ground(zone.anchor.x, zone.anchor.y);
        this.cam.x = c.x;
        this.cam.y = c.y;
        this.clampCam();
        this.draw(performance.now());
      }
      this.zone = zone;
    },
    // Lieu remarquable touché : à découvrir dans un quartier à soi, le serveur l'inscrit ; sinon il sautille et dit ce
    // qu'il fait, ou comment l'atteindre
    tapLandmark(landmark, px, py) {
      const zone = this.state.map.zones.find(z => z.id === landmark.zone);
      this.scared.set(`landmark:${landmark.id}`, { at: performance.now() / 1000 });
      if (!landmark.found && zone && zone.owned) {
        this.findLandmark(landmark, px, py);
        return;
      }
      this.showTip(px, py, this.tipOf({ landmark }));
      vibrate(6);
    },
    // Découverte d'un lieu : le serveur l'inscrit (effet durable, coffre qui attend) ; l'île le fête, Brume en parle,
    // puis son coffre s'ouvre
    async findLandmark(landmark, px, py) {
      if (this.busy) return;
      this.busy = true;
      let fresh = false;
      try {
        const { fresh: first, world } = await playService.worldLandmark(landmark.id);
        fresh = first;
        this.apply(world);
        const found = (world.landmarks || []).find(l => l.id === landmark.id) || landmark;
        if (fresh) {
          const at = this.canvasPoint(px, py);
          ring(at, 110);
          burst(at, 32, 120);
          vibrate([14, 40, 20, 40, 26]);
          this.pops.set(`landmark:${landmark.id}`, performance.now());
          this.$emit('show-alert', `Lieu découvert : ${found.name}\u00a0! ${found.effect}.`);
          guide.say(landmarkTip(found));
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce lieu n’a pas pu être découvert.'));
      } finally {
        this.busy = false;
      }
      if (fresh) this.openChest(`lieu:${landmark.id}`);
    },
    // Gisement touché : prêt dans un quartier à soi, il se ramasse ; sinon il sautille et dit quand il repousse, ou
    // comment l'atteindre
    tapDeposit(deposit, px, py) {
      const zone = this.state.map.zones.find(z => z.id === deposit.zone);
      this.scared.set(`deposit:${deposit.id}`, { at: performance.now() / 1000 });
      if (zone && zone.owned && !depositWait(deposit, this.clock - this.loadedAt)) {
        this.gatherDeposit(deposit, px, py);
        return;
      }
      this.showTip(px, py, this.tipOf({ deposit }));
      vibrate(6);
    },
    // Ramassage : le serveur donne quelques trouvailles (une seule fois) ; le gisement repousse
    async gatherDeposit(deposit, px, py) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { find, amount, world } = await playService.worldDeposit(deposit.id);
        this.apply(world);
        burst(this.canvasPoint(px, py), 16, 60);
        vibrate([8, 30, 10]);
        this.pops.set(`deposit:${deposit.id}`, performance.now());
        const stock = (world.finds || []).find(f => f.id === find);
        this.$emit('show-alert', `Trouvaille : +${amount} ${stock ? stock.name.toLowerCase() : find}${stock ? ` (${stock.amount} en réserve)` : ''}`);
        guide.tip('finds');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce gisement n’a pas pu être ramassé.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Carnet d'explorateur, ouvert à la page d'un lieu (ou au début)
    openLog(id = null) {
      this.logFocus = id;
      this.logOpen = true;
    },
    // « Voir sur l'île » : la caméra va vers le lieu, le carnet se ferme
    showLandmark(id) {
      const landmark = this.shownLandmarks.find(l => l.id === id);
      this.logOpen = false;
      if (!landmark) return;
      const c = this.ground(landmark.x, landmark.y);
      this.cam.x = c.x;
      this.cam.y = c.y + (landmarkTop(landmark.id) * landmarkScale(landmark.id)) / 2;
      this.clampCam();
      this.draw(performance.now());
    }
  }
};
