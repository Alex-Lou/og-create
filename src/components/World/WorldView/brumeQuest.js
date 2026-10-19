// Brume et sa quête, côté île : ce que fait un toucher sur elle (mener vers l'objectif, réclamer la récompense, dormir),
// le nom du peuple, le naufrage annoncé (déjà vus : retenus sur l'appareil) et le souvenir retrouvé. Les appels au
// serveur vivent ici ; son dessin et sa place à l'écran, dans world/view/draw/brume.js.

import { vibrate } from '@/utils/fx';
import { feteBrume, ECLAT_MS, FETE_MS } from '@/utils/fete';
import { guide } from '@/game/guide';
import { wreckOf, memoryOf } from '@/world/story';
import { builtOf } from '@/world/faces';
import { questShort, questPlan } from '@/game/prologue';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { load, save } from '@/utils/storage';
import { BRUME_ALERTS, BRUME_ERRORS } from '@/texts/world/brume';
import { MEMORY_HELP } from '@/texts/tutorial/coach';

// Les naufrages déjà annoncés sur cet appareil (leurs ids)
const WRECKS_KEY = 'oc_wrecks';

// Un point de l'écran, s'il y est assez pour la bannière ; sinon le milieu de l'écran
const MARGIN = 110;
function onScreen(at) {
  const w = window.innerWidth, h = window.innerHeight;
  return at.x >= MARGIN && at.x <= w - MARGIN && at.y >= MARGIN && at.y <= h - 40 ? at : { x: w / 2, y: h / 2 };
}

export default {
  methods: {
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
        this.$emit('show-alert', BRUME_ALERTS.quest(quest.label));
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
      this.$emit('quest', state.brume ? { ...state.brume, short: questShort(state.brume.quest, state, this.stockPaid), plan: questPlan(state.brume.quest, state), people: state.people || null, anya: state.anya || null, avatar: state.avatar || null, player: state.player || null, hold, built: builtOf(state.villagers) } : null);
    },
    // Naufrage à annoncer pour la quête active (déjà vus : retenus sur l'appareil)
    checkWreck() {
      const stored = load(WRECKS_KEY, []);
      const seen = Array.isArray(stored) ? stored : [];
      const wreck = wreckOf(this.quest, seen);
      if (!wreck || this.wreck || this.reveal || this.haul || this.holdWreck) return;
      this.wreck = wreck;
      save(WRECKS_KEY, [...seen, wreck.id]);
    },
    // Fin de l'annonce : la caméra va vers le quartier où dort le naufragé
    closeWreck() {
      const zone = this.wreck && this.state && this.state.map.zones.find(z => z.id === this.wreck.zone);
      this.wreck = null;
      // (les scènes et le tutoriel attendaient que l'annonce se referme)
      this.emitQuest();
      if (zone && zone.anchor) this.lookAtCell(zone.anchor.x, zone.anchor.y);
    },
    // Le souvenir retrouvé (bible, § 6.2 et § 14) : la caméra va vers le naufragé ; un Éclat à ses pieds, sur l'île
    // (world/fetes.js), sa réplique
    showMemory(questId) {
      const memory = memoryOf(questId);
      const resident = memory && this.village && this.village.residents.find(r => r.id === `vil:${memory.villager}`);
      const friend = memory && (this.state.villagers || []).find(v => v.id === memory.villager);
      if (!resident || !friend) return;
      this.lookAtCell(resident.work.x, resident.work.y);
      const g = this.ground(resident.work.x, resident.work.y);
      const sp = this.toScreen(g.x, g.y);
      this.sparkle('eclat', g);
      this.showTip(sp.x, sp.y - 40, { title: `${friend.name} · ${friend.role}`, text: memory.line }, 6000);
      // (et sa ligne d'aide, en annonce : MEMORY_HELP)
      if (MEMORY_HELP[questId]) this.$emit('show-alert', MEMORY_HELP[questId]);
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
      await this.runAction(BRUME_ERRORS.people, async () => {
        this.apply(await playService.worldPeople(name));
        this.peopleName = '';
        this.$emit('show-alert', BRUME_ALERTS.people(this.state.people));
      });
    },
    // La quête demande une Récolte : la fiche se ferme, la Récolte commence
    questHarvest() {
      this.questOpen = false;
      this.startHarvest();
    },
    // Dormir, la première nuit : fondu au noir, la nuit se passe, puis Lorena rejoint le camp et sa Récolte s'ouvre
    // (la nuit de la veillée : l'App joue d'abord sa scène, puis rappelle sleep(true) ; App, islandStory.js : veillee)
    async sleep(now = false) {
      if (!this.quest || this.busy || this.nightFade) return;
      if (!now && this.acts.brume) {
        this.$emit('act', 'brume');
        return;
      }
      this.questOpen = false;
      this.busy = true;
      this.nightFade = true;
      await new Promise(resolve => setTimeout(resolve, 900));
      try {
        const { world } = await playService.sleep();
        this.apply(world);
        this.emitQuest();
      } catch (error) {
        this.$emit('show-alert', messageOf(error, BRUME_ERRORS.sleep), 'error');
      }
      this.veillee = null;
      this.nightFade = false;
      this.busy = false;
    },
    // Récompense de la quête active : versée par le serveur ; la fiche reste ouverte sur la quête suivante
    async claimQuest() {
      if (!this.quest || this.busy) return;
      // La dernière quête d'un acte donne aussi un coffre : il s'ouvre juste après les écus
      const chest = this.quest.chest ? `quete:${this.quest.id}` : null;
      const questId = this.quest.id, questLabel = this.quest.label;
      // Un coffre va s'ouvrir : le naufrage de la quête suivante l'attendra
      this.holdWreck = Boolean(chest);
      let claimed = false, fete = false;
      this.busy = true;
      try {
        const hit = this.brumeHit;
        const { gained, coins, world } = await playService.worldQuest(this.quest.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        // La fête de Brume (choix de l'auteur, 11 oct. : plus de vie et de magie, pas de confettis ; utils/fete.js) : la
        // brume est aspirée vers elle, puis elle bondit de joie dans un éclat, un cercle de brume, une lune et des lucioles ;
        // le parchemin « Quête accomplie », et les écus que la bourse attire un à un
        setTimeout(() => { this.brumeJoy = performance.now(); }, ECLAT_MS);
        if (hit) {
          const sp = this.toScreen(hit.x, hit.y);
          // (Brume hors de l'écran, réclamée depuis le suivi des quêtes : la fête se tient au milieu de l'écran)
          const vue = this.canvasPoint(sp.x, sp.y), at = onScreen(vue);
          // le cercle de brume se pose au sol sous elle (au milieu de l'écran, juste sous la fête)
          const spot = this.brumeSpot(), gs = spot && this.toScreen(spot.x, spot.y);
          const sol = gs && at === vue ? this.canvasPoint(gs.x, gs.y) : null;
          // (Brume à l'écran : la fête la suit si on fait glisser l'île ; de combien elle a bougé, d'après la caméra)
          let moved = { x: 0, y: 0 };
          const suit = at === vue ? () => {
            if (this.gone || !this.geo) return moved;
            const now = this.toScreen(hit.x, hit.y);
            moved = { x: now.x - sp.x, y: now.y - sp.y };
            return moved;
          } : null;
          // (le temps de la fête, personne ne parle hors scénario : game/guide.js, hold)
          setTimeout(guide.hold(), FETE_MS);
          feteBrume({ at, sol, suit, purse: document.querySelector('.world__purse'), sous: questLabel ? `${questLabel} · +${gained} écus` : `+${gained} écus` });
          fete = !this.reduced();
        } else {
          this.$emit('show-alert', BRUME_ALERTS.done, 'gain', this.gainsOf({}, gained));
        }
        vibrate([20, 60, 20, 60, 40]);
        claimed = true;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, BRUME_ERRORS.reward), 'error');
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
        // Un souvenir rendu : la fiche se ferme sur la scène du souvenir retrouvé, après la fête de Brume (la caméra qui
        // part l'emmènerait hors de l'écran)
        this.questOpen = false;
        setTimeout(() => { if (!this.gone) this.showMemory(questId); }, fete ? FETE_MS : 0);
      }
    }
  }
};
