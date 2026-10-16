// L'île : l'exploration. Les quartiers à acheter, les expéditions, les lieux et les gisements trouvés, le carnet
// d'explorateur et la réserve des trouvailles, le naufrage. Mixin de WorldView.vue : ses données et méthodes s'ajoutent
// à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { landmarkTop, landmarkScale } from '@/world/landmarkSprites';
import { landmarksShown, landmarksWaiting, landmarkTip } from '@/world/landmarks';
import { depositsShown, depositsReady, depositWait, pickupsShown } from '@/world/finds';
import { vibrate } from '@/utils/fx';
import { guide } from '@/game/guide';
import { FAILED, TOASTS } from '@/texts/world/screens/alerts';
import { NEW_ZONE } from '@/texts/world/screens/island';
import { waitingFireLinesOf } from '@/world/arc';
import { journalOf } from '@/world/journal';
import { dayHourOf } from '@/world/gameClock';
import { load, save } from '@/utils/storage';

// Le journal lu, retenu sur l'appareil ; une heure (ms)
const JOURNAL_KEY = 'oc_journal_lu';
const HOUR_MS = 3600000;

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
      wreck: null,
      // Le dernier jour de l'île où l'on a lu le journal (le point du Carnet), retenu sur l'appareil
      journalRead: load(JOURNAL_KEY, null)
    };
  },
  watch: {
    // Une trouvaille que la mer rend sous nos yeux arrive d'un rebond (pas au premier chargement de l'île : tout
    // rebondirait d'un coup)
    shoreKey(now, before) {
      if (!this.shoreSeen) {
        this.shoreSeen = Boolean(this.state);
        return;
      }
      const old = new Set(before.split(' '));
      for (const key of now.split(' ')) if (key && !old.has(key)) this.pops.set(`deposit:${key.split('@')[0]}`, performance.now());
      this.drawSoon();
    }
  },
  computed: {
    // Le journal de l'île (world/journal.js ; choix de l'auteur, 16 oct.) : la troupe éveillée, hors du tutoriel ({ role,
    // k, name } : son rang comme dans le village)
    journalMasters() {
      if (!this.state || this.thickMist(this.state) || !this.village) return [];
      const names = new Map((this.state.villagers || []).map(v => [v.id, v.name]));
      return this.village.residents.filter(r => r.master && !r.asleep && !r.swim).map(r => ({ role: r.role, k: r.k, name: names.get(r.role) || r.look.label }));
    },
    // Ses sept derniers jours (seulement le Carnet ouvert), au ciel de chaque heure de l'île
    journal() {
      if (!this.logOpen) return [];
      const { day, hour } = dayHourOf(this.clock);
      const skyOf = (d, h) => {
        const phase = this.skyAt(new Date(2026, 0, 1 + d, 0, 0, 0, Math.round(h * HOUR_MS)));
        return { rise: phase.rise, set: phase.set, weather: phase.weather };
      };
      return journalOf({ masters: this.journalMasters, today: day, hour, skyOf });
    },
    // Un jour de l'île s'est écrit depuis la dernière lecture : le point du Carnet (rien ne s'ouvre tout seul)
    journalNew() {
      return this.journalMasters.length > 0 && (this.journalRead === null || this.journalRead < dayHourOf(this.clock).day);
    },
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
    // Ce que la mer a rendu sur la plage de Brumelune, prêt à ramasser (ramassé, il disparaît : la mer en rapportera
    // ailleurs, choix de l'auteur, 15 oct. ; serveur : pickups.js) ; tout ce qui se ramasse sur le sol (dessiné et touché
    // pareil)
    shownPickups() {
      return pickupsShown(this.state).filter(pickup => !depositWait(pickup, this.clock - this.loadedAt));
    },
    // (leurs identifiants et leurs cases : ce qui vient d'arriver se voit)
    shoreKey() {
      return this.shownPickups.map(pickup => `${pickup.id}@${pickup.x},${pickup.y}`).join(' ');
    },
    groundFinds() {
      return [...this.shownDeposits, ...this.shownPickups];
    },
    readyDeposits() {
      return depositsReady(this.state, this.clock - this.loadedAt).length;
    },
    ownedFinds() {
      return Boolean(this.state && (this.state.finds || []).some(f => f.amount > 0));
    },
    // Terre inconnue d'où une expédition peut partir (la boussole y mène), quand aucune n'est en route ; celle du lieu
    // que vise la quête active d'abord
    explorableZone() {
      if (!this.state || this.state.expedition) return null;
      const zones = this.state.map.zones.filter(z => z.known === false && z.explorable && z.anchor);
      const target = this.quest && this.quest.target;
      const hidden = target && target.landmark && (this.state.landmarks || []).find(l => l.id === target.landmark && l.known === false);
      return (hidden && zones.find(z => z.id === hidden.zone)) || zones[0] || null;
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
        // (sa Fête, au pied de son panneau, avec son nom sous le mot : world/fetes.js)
        if (sign) this.celebrateAt(`quartier:${zone.id}`, { x: sign.x, y: sign.y + 30, top: 40 }, NEW_ZONE(bought));
        vibrate([14, 40, 20]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.zone), 'error');
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
        const { world, coins } = await playService.worldExpedition(zone.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.zone = null;
        vibrate([10, 30, 10]);
        this.$emit('show-alert', TOASTS.expedition(zone.trip));
        guide.tip('expedition');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.expedition), 'error');
      } finally {
        this.busy = false;
      }
    },
    // La boussole : la caméra va vers le quartier qu'explore l'expédition en route, sinon vers une terre à explorer, et
    // sa fiche s'ouvre
    showExpedition() {
      const id = this.state.expedition ? this.state.expedition.zone : this.explorableZone && this.explorableZone.id;
      this.showZone(this.state.map.zones.find(z => z.id === id));
    },
    showZone(zone) {
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
        this.findLandmark(landmark);
        return;
      }
      this.showTip(px, py, this.tipOf({ landmark }));
      vibrate(6);
    },
    // Découverte d'un lieu : le serveur l'inscrit (effet durable, coffre qui attend) ; l'île le fête, Brume en parle,
    // puis son coffre s'ouvre
    async findLandmark(landmark) {
      if (this.busy) return;
      this.busy = true;
      let fresh = false;
      try {
        const { fresh: first, world } = await playService.worldLandmark(landmark.id);
        fresh = first;
        this.apply(world);
        const found = (world.landmarks || []).find(l => l.id === landmark.id) || landmark;
        if (fresh) {
          const c = this.ground(landmark.x, landmark.y);
          // (sa Fête dit son nom et, sous le ruban, ce qu'il change : plus de notification en double, choix de l'auteur,
          // 13 oct.)
          this.celebrateAt(`lieu:${landmark.id}`, { x: c.x, y: c.y, top: 50 }, found.name, found.effect || '');
          vibrate([14, 40, 20, 40, 26]);
          this.pops.set(`landmark:${landmark.id}`, performance.now());
          guide.say(landmarkTip(found));
          // (un feu qui attend son acte : Brume en dit sa variante d'avant, phare.js, world/arc.js)
          this.sayArc(`feu-${found.id}-avant`, waitingFireLinesOf(found));
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.landmark), 'error');
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
        this.gatherDeposit(deposit);
        return;
      }
      this.showTip(px, py, this.tipOf({ deposit }));
      vibrate(6);
    },
    // Ramassage : le serveur donne quelques trouvailles (une seule fois) ; le gisement repousse. Ce que la mer a rendu
    // sur la plage de Brumelune va aux réserves (bois, vivres, pierre)
    async gatherDeposit(deposit) {
      if (this.busy) return;
      this.busy = true;
      try {
        if (deposit.pickup) {
          const { gives, world } = await playService.worldPickup(deposit.id);
          this.apply(world);
          this.sparkleCell('petille', deposit, this.gainsOf(gives));
          vibrate([8, 30, 10]);
          this.pops.set(`deposit:${deposit.id}`, performance.now());
          return;
        }
        const { find, amount, world } = await playService.worldDeposit(deposit.id);
        this.apply(world);
        const stock = (world.finds || []).find(f => f.id === find);
        this.sparkleCell('eclat', deposit, [{ text: `+${amount} ${stock ? stock.name.toLowerCase() : find}` }]);
        vibrate([8, 30, 10]);
        this.pops.set(`deposit:${deposit.id}`, performance.now());
        guide.tip('finds');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.deposit), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Le journal lu (son onglet ouvert) : le point du Carnet s'efface jusqu'au jour suivant
    readJournal() {
      this.journalRead = dayHourOf(Date.now()).day;
      save(JOURNAL_KEY, this.journalRead);
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
