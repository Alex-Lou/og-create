// Brume sur l'île : où elle flotte, son dessin, et ce que fait un toucher sur elle (la quête active, sa récompense, le
// nom du peuple, le naufrage et le souvenir retrouvé). Méthodes de WorldView.vue (this : le composant), réunies par
// draw.js.

import { ring, burst, vibrate, fly, confetti, banner } from '@/utils/fx';
import { landmarksShown } from '@/world/landmarks';
import { floatOf, joyHop, BRUME_ALT, drawBrume, BRUME_REACH } from '@/world/brume';
import { brumeArtLayer, drawBrumeArt } from '@/world/brumeArt';
import { wreckOf, memoryOf } from '@/world/story';
import { builtOf } from '@/world/faces';
import { questShort, questPlan } from '@/game/prologue';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { TW, TH } from '../constants';

// Les écus d'une quête réclamée : leurs départs (ms, après la bannière) et leur course jusqu'à la bourse
const COIN_DELAYS = [700, 860, 1020, 1180, 1340, 1500];
const COIN_FLIGHT_MS = 950;
// Un point de l'écran, s'il y est assez pour la bannière ; sinon le milieu de l'écran
const MARGIN = 110;
function onScreen(at) {
  const w = window.innerWidth, h = window.innerHeight;
  return at.x >= MARGIN && at.x <= w - MARGIN && at.y >= MARGIN && at.y <= h - 40 ? at : { x: w / 2, y: h / 2 };
}

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
    // (une quête réclamée : elle bondit de joie)
    const x = spot.x + dx, y = spot.y - BRUME_ALT + dy - (this.brumeJoy ? joyHop(performance.now() - this.brumeJoy) : 0);
    const ready = Boolean(this.quest && this.quest.done);
    // Son dessin de la bibliothèque (son stade), à la taille du feu follet par code, qui le remplace en attendant
    const layer = brumeArtLayer(this.brumeState, ready, this.reduced() ? 0 : t);
    const r = (this.brumeState.sun ? 6.5 : 8) * Math.max(1, 0.6 / s);
    if (!layer || !drawBrumeArt(ctx, layer, x, y, spot, r, this.repaintSoon)) drawBrume(ctx, x, y, spot, t, ready, s, this.brumeState);
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
    else if (quest && quest.kind === 'sleep') this.sleep();
    else if (quest && quest.target) {
      this.showQuestTarget();
      this.$emit('show-alert', `Brume : ${quest.label}.`);
    } else if (quest && quest.kind === 'runs' && this.state.charges.count) this.questHarvest();
    else this.questOpen = true;
  },
  // Brume (quête active, actes finis), le nom du peuple, Anya et l'avatar du joueur : le tutoriel et les veillées
  // (App.vue) y lisent où en est le joueur. short : ce que la quête fait payer manque ; plan : l'élément que son bâtiment
  // demande, pas encore écrit (game/prologue.js). hold : un coffre est ouvert, ou va s'ouvrir (une veillée ou une scène
  // l'attend) ; built : les maîtres dont le bâtiment est fondé (les autres paraissent en naufragés)
  emitQuest() {
    const state = this.state;
    if (!state) return;
    const hold = Boolean(this.holdWreck || this.reveal || this.haul || this.wreck);
    this.$emit('quest', state.brume ? { ...state.brume, short: questShort(state.brume.quest, state, this.stockPaid), plan: questPlan(state.brume.quest, state), people: state.people || null, anya: state.anya || null, avatar: state.avatar || null, hold, built: builtOf(state.villagers) } : null);
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
    // (les scènes et le tutoriel attendaient que l'annonce se referme)
    this.emitQuest();
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
  // Dormir, la première nuit : fondu au noir, la nuit se passe, puis Aster rejoint le camp et sa Récolte s'ouvre
  async sleep() {
    if (!this.quest || this.busy || this.nightFade) return;
    this.questOpen = false;
    this.busy = true;
    this.nightFade = true;
    await new Promise(resolve => setTimeout(resolve, 900));
    try {
      const { world } = await playService.sleep();
      this.apply(world);
      this.emitQuest();
    } catch (error) {
      this.$emit('show-alert', messageOf(error, 'Tu ne peux pas dormir pour l’instant.'));
    }
    this.nightFade = false;
    this.busy = false;
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
      // La fête (choix de l'auteur, 9 oct. : plus lente, plus festive, lisible à l'œil) : Brume bondit de joie, deux
      // anneaux, une gerbe d'étincelles et des confettis, la bannière « Quête accomplie ! » et ses écus ; puis les écus
      // volent un à un, posément, jusqu'à la bourse
      this.brumeJoy = performance.now();
      if (hit) {
        const sp = this.toScreen(hit.x, hit.y);
        // (Brume hors de l'écran, réclamée depuis le suivi des quêtes : la fête se tient au milieu de l'écran)
        const at = onScreen(this.canvasPoint(sp.x, sp.y));
        ring(at, 90);
        setTimeout(() => ring(at, 150), 260);
        burst(at, 28, 110);
        confetti(at, 36);
        banner({ x: at.x, y: at.y - 46 }, 'Quête accomplie !', `+${gained} écus`);
        const purse = document.querySelector('.world__purse');
        if (purse) COIN_DELAYS.forEach(ms => setTimeout(() => fly('ui:coin', { left: at.x - 10, top: at.y - 10, width: 20, height: 20 }, purse, COIN_FLIGHT_MS), ms));
      } else {
        this.$emit('show-alert', `Quête accomplie\u00a0! +${gained} écus`);
      }
      vibrate([20, 60, 20, 60, 40]);
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
