// Le suivi des quêtes de l'île (Hud/QuestTracker, world/tracker.js) : la quête principale, ce qui attend ailleurs, ce
// que propose Brume pour la quête active, et les commandes déjà enseignées pendant le tutoriel. Mixin de WorldView.vue.

import { mainOf, todoOf, MAX_TODO } from '@/world/tracker';
import { islandTaught } from '@/game/prologue';
import { landmarksWaiting } from '@/world/landmarks';
import { depositsReady } from '@/world/finds';

export default {
  data() {
    return {
      // Le suivi des quêtes déplié : replié en arrivant, il se replie au premier toucher ailleurs (Hud/QuestTracker)
      trackerOpen: false,
      MAX_TODO,
    };
  },
  computed: {
    // Pendant le tutoriel, les commandes de l'île déjà enseignées (game/prologue.js) ; les autres sont grisées. null : tout
    // répond
    taught() {
      return islandTaught({ tutorial: Boolean(this.trackerMain && this.trackerMain.tutorial), quest: this.quest && this.quest.id });
    },
    // Le suivi des quêtes (Hud/QuestTracker, world/tracker.js) : la quête principale et ce qui attend ailleurs
    trackerMain() {
      return this.state ? mainOf(this.state.brume) : null;
    },
    // (pendant le tutoriel, rien d'autre que son étape : le joueur apprend une chose à la fois)
    trackerAll() {
      if (!this.state || (this.trackerMain && this.trackerMain.tutorial)) return [];
      return todoOf({
        state: this.state,
        stock: this.stockPaid,
        chests: this.chestCount,
        landmarks: landmarksWaiting(this.state),
        deposits: this.readyDeposits,
        buildable: (this.state.sites || []).filter(site => !site.hidden && this.canBuild(site))
      });
    },
    // Ce que propose Brume pour la quête active pas encore faite (hors Récolte et nom du peuple) : { label, run } ou null
    questAction() {
      const quest = this.quest;
      const state = this.state;
      if (!quest || quest.done || !state) return null;
      const target = quest.target || {};
      const grimoire = { label: quest.ariane ? 'Voir dans le Grimoire' : 'Ouvrir le Grimoire', run: () => this.$emit('go', 'infinite') };
      const sheetOf = id => ({ label: 'Fiche du Foyer', run: () => this.openSiteSheet(id, 'annexes') });
      const look = (label, cell) => (cell ? { label, run: () => this.lookAtCell(cell.x, cell.y) } : null);
      if (quest.kind === 'sleep') return { label: 'Dormir', run: () => this.sleep() };
      if (quest.chapter || quest.ariane || quest.kind === 'stars' || quest.kind === 'element') return grimoire;
      if (quest.kind === 'need' || quest.kind === 'wake') {
        const who = (state.villagers || []).find(v => v.id === target.villager);
        return who ? { label: `Voir ${who.name}`, run: () => this.openVillager(who.id) } : null;
      }
      if (quest.kind === 'heart') {
        const best = (state.villagers || []).reduce((a, b) => (!a || b.points > a.points ? b : a), null);
        return best ? { label: `Voir ${best.name}`, run: () => this.openVillager(best.id) } : null;
      }
      if (quest.kind === 'crafts' || quest.kind === 'craft') return { label: 'Ouvrir l’établi', run: () => this.openBench() };
      if (quest.kind === 'annex' || quest.kind === 'house') return sheetOf('foyer');
      if (quest.kind === 'visitor' || quest.kind === 'settle') {
        return state.visitor ? { label: 'Voir le voyageur', run: () => this.openVisitor() } : look('Montrer le Ponton', state.sites.find(s => s.id === 'ponton'));
      }
      if (quest.kind === 'expedition') {
        const zone = state.map.zones.find(z => z.known === false && z.explorable && z.anchor);
        return look('Montrer une terre à explorer', zone && zone.anchor);
      }
      if (quest.kind === 'landmark' && !target.landmark) return look('Montrer un lieu', landmarksWaiting(state)[0]);
      // Un lieu d'un quartier encore inconnu : sa fiche (l'expédition qui le découvrira)
      const hidden = target.landmark && (state.landmarks || []).find(l => l.id === target.landmark && l.known === false);
      const far = hidden && state.map.zones.find(z => z.id === hidden.zone);
      if (far) return { label: 'Montrer la terre à explorer', run: () => this.showZone(far) };
      if (quest.kind === 'gather') return look('Montrer un gisement', depositsReady(state)[0]);
      return quest.target ? { label: 'Montrer', run: () => this.showQuestTarget() } : null;
    },
  },
  methods: {
    toggleTracker() {
      this.trackerOpen = !this.trackerOpen;
    },
    // Une ligne « À faire aussi » : ce qu'elle désigne s'ouvre
    trackerGo(item) {
      if (item.kind === 'site') this.openSiteSheet(item.arg);
      else if (item.kind === 'build') this.openSiteSheet(item.arg, 'evolution');
      else if (item.kind === 'villager') this.openVillager(item.arg);
      else if (item.kind === 'visitor') this.openVisitor();
      else if (item.kind === 'beast') this.openBeast(item.arg);
      else if (item.kind === 'chests') this.chestsOpen = true;
      else if (item.kind === 'craft') this.placeFromBench(item.arg);
      else if (item.kind === 'landmark') this.showLandmark(item.arg);
      else if (item.kind === 'finds') this.findsOpen = true;
    },
  }
};
