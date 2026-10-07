// Brume sur l'île : où elle flotte, son dessin, et ce que fait un toucher sur elle (la quête active, sa récompense, le
// nom du peuple, le naufrage et le souvenir retrouvé). Méthodes de WorldView.vue (this : le composant), réunies par
// draw.js.

import { ring, burst, vibrate } from '@/utils/fx';
import { landmarksShown } from '@/world/landmarks';
import { floatOf, BRUME_ALT, drawBrume, BRUME_REACH } from '@/world/brume';
import { wreckOf, memoryOf } from '@/world/story';
import { builtOf } from '@/world/faces';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { TW, TH } from '../constants';

export default {
  // Où flotte Brume (point au sol) : à côté du bâtiment, du lieu ou du panneau du quartier que vise la quête active (un
  // lieu d'un quartier encore inconnu : devant ce quartier, à explorer d'abord), sinon près du Foyer
  brumeSpot() {
    const target = this.quest && this.quest.target;
    const hidden = target && target.landmark && (this.state.landmarks || []).find(l => l.id === target.landmark && l.known === false);
    const zoneId = target && (target.zone || (hidden && hidden.zone));
    const zone = zoneId && this.state.map.zones.find(z => z.id === zoneId);
    if (zone && zone.anchor) {
      const g = this.ground(zone.anchor.x, zone.anchor.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const place = target && target.landmark && landmarksShown(this.state).find(l => l.id === target.landmark);
    if (place) {
      const g = this.ground(place.x, place.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const site = this.state.sites.find(s => s.id === ((target && (target.site || target.villager)) || 'foyer'));
    if (!site) return null;
    const c = this.centerOf(site);
    return { x: c.x - TW * 0.42 * site.w, y: c.y - TH * 0.15 };
  },
  drawBrume(ctx, t, s) {
    const spot = this.brumeSpot();
    if (!spot) {
      this.brumeHit = null;
      return;
    }
    const { dx, dy } = floatOf(t);
    const x = spot.x + dx, y = spot.y - BRUME_ALT + dy;
    drawBrume(ctx, x, y, spot, t, Boolean(this.quest && this.quest.done), s, this.brumeState);
    this.brumeHit = { x, y, r: BRUME_REACH * Math.max(1, 0.6 / s) };
  },
  // La caméra va vers l'objectif de la quête
  showQuestTarget() {
    const spot = this.brumeSpot();
    this.questOpen = false;
    if (!spot) return;
    this.cam.x = spot.x;
    this.cam.y = spot.y;
    this.clampCam();
    this.draw(performance.now());
  },
  // Un toucher sur Brume : réclamer si la récompense attend, sinon mener vers l'objectif ou lancer la Récolte ; sans
  // action possible, sa fiche (l'appui long l'ouvre toujours)
  questAct() {
    const quest = this.quest;
    if (quest && quest.done) this.claimQuest();
    else if (quest && quest.target) {
      this.showQuestTarget();
      this.$emit('show-alert', `Brume : ${quest.label}.`);
    } else if (quest && quest.kind === 'runs' && this.state.charges.count) this.questHarvest();
    else this.questOpen = true;
  },
  // Brume (quête active, actes finis), le nom du peuple, Anya et l'avatar du joueur : le tutoriel et les veillées
  // (App.vue) y lisent où en est le joueur. hold : un coffre est ouvert, ou va s'ouvrir (une veillée ou une scène
  // l'attend) ; built : les maîtres dont le bâtiment est fondé (les autres paraissent en naufragés)
  emitQuest() {
    const state = this.state;
    if (!state) return;
    const hold = Boolean(this.holdWreck || this.reveal || this.haul);
    this.$emit('quest', state.brume ? { ...state.brume, people: state.people || null, anya: state.anya || null, avatar: state.avatar || null, hold, built: builtOf(state.villagers) } : null);
  },
  // Naufrage à annoncer pour la quête active (déjà vus : retenus sur l'appareil)
  checkWreck() {
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem('oc_wrecks') || '[]'); } catch (e) { seen = []; }
    const wreck = wreckOf(this.quest, Array.isArray(seen) ? seen : []);
    if (!wreck || this.wreck || this.reveal || this.haul || this.holdWreck) return;
    this.wreck = wreck;
    try { localStorage.setItem('oc_wrecks', JSON.stringify([...seen, wreck.id])); } catch (e) { /* le confort seulement */ }
  },
  // Fin de l'annonce : la caméra va vers le quartier où dort le naufragé
  closeWreck() {
    const zone = this.wreck && this.state && this.state.map.zones.find(z => z.id === this.wreck.zone);
    this.wreck = null;
    if (zone && zone.anchor) this.lookAtCell(zone.anchor.x, zone.anchor.y);
  },
  // Le souvenir retrouvé (bible, § 6.2 et § 14) : la caméra va vers le naufragé ; un éclat doré, sa réplique
  showMemory(questId) {
    const memory = memoryOf(questId);
    const resident = memory && this.village && this.village.residents.find(r => r.id === `vil:${memory.villager}`);
    const friend = memory && (this.state.villagers || []).find(v => v.id === memory.villager);
    if (!resident || !friend) return;
    this.lookAtCell(resident.work.x, resident.work.y);
    const g = this.ground(resident.work.x, resident.work.y);
    const sp = this.toScreen(g.x, g.y);
    const at = this.canvasPoint(sp.x, sp.y - 30);
    if (!this.reduced()) {
      ring(at, 110);
      burst(at, 30, 90);
    }
    this.showTip(sp.x, sp.y - 40, { title: `${friend.name} · ${friend.role}`, text: memory.line }, 6000);
  },
  // L'action de la quête active : la fiche de Brume se ferme, puis l'action (Grimoire, fiche, caméra…)
  runQuestAction() {
    const action = this.questAction;
    this.questOpen = false;
    if (action) action.run();
  },
  // La caméra va vers une case de l'île
  lookAtCell(x, y) {
    const g = this.ground(x, y);
    this.cam.x = g.x;
    this.cam.y = g.y;
    this.clampCam();
    this.draw(performance.now());
  },
  // Fiche d'un bâtiment, sur un onglet (s'il existe)
  openSiteSheet(id, tab) {
    const site = this.state && this.state.sites.find(s => s.id === id);
    if (!site) return;
    this.site = site;
    this.siteTab = tab === 'annexes' && site.annexes && site.annexes.length && site.level >= 2 ? 'annexes' : site.level ? 'overview' : 'evolution';
  },
  // Le nom du peuple (quête « peuple ») : enregistré par le serveur, qui renvoie la vue de l'île
  async namePeople() {
    const name = this.peopleName.trim();
    if (this.busy || name.length < 2) return;
    this.busy = true;
    try {
      this.apply(await playService.worldPeople(name));
      this.peopleName = '';
      this.$emit('show-alert', `Le peuple de « ${this.state.people} »`);
    } catch (error) {
      this.$emit('show-alert', messageOf(error, 'Ce nom n’a pas pu être donné.'));
    } finally {
      this.busy = false;
    }
  },
  // La quête demande une Récolte : la fiche se ferme, la Récolte commence
  questHarvest() {
    this.questOpen = false;
    this.startHarvest();
  },
  // Récompense de la quête active : versée par le serveur ; la fiche reste ouverte sur la quête suivante
  async claimQuest() {
    if (!this.quest || this.busy) return;
    // La dernière quête d'un acte donne aussi un coffre : il s'ouvre juste après les écus
    const chest = this.quest.chest ? `quete:${this.quest.id}` : null;
    const questId = this.quest.id;
    // Un coffre va s'ouvrir : le naufrage de la quête suivante l'attendra
    this.holdWreck = Boolean(chest);
    let claimed = false;
    this.busy = true;
    try {
      const hit = this.brumeHit;
      const { gained, coins, world } = await playService.worldQuest(this.quest.id);
      this.apply(world);
      this.$emit('coins-updated', coins);
      if (hit) {
        const sp = this.toScreen(hit.x, hit.y);
        const at = this.canvasPoint(sp.x, sp.y);
        ring(at, 90);
        burst(at, 24, 80);
      }
      vibrate([12, 30, 16]);
      this.$emit('show-alert', `Brume : +${gained} écus\u00a0!`);
      claimed = true;
    } catch (error) {
      this.$emit('show-alert', messageOf(error, 'La récompense n’a pas pu être reçue.'));
    } finally {
      this.busy = false;
    }
    if (claimed && chest) {
      this.questOpen = false;
      await this.openChest(chest);
    }
    this.holdWreck = false;
    this.emitQuest();
    if (claimed && chest) this.checkWreck();
    else if (claimed && memoryOf(questId)) {
      // Un souvenir rendu : la fiche se ferme sur la scène du souvenir retrouvé
      this.questOpen = false;
      this.$nextTick(() => this.showMemory(questId));
    }
  }
};
