// Brume sur l'île : où elle flotte, son dessin, et ce que fait un toucher sur elle (la quête active, sa récompense, le
// nom du peuple, le naufrage et le souvenir retrouvé). Méthodes de WorldView.vue (this : le composant), réunies par
// draw.js.

import { ring, burst, vibrate, fly } from '@/utils/fx';
import { landmarksShown } from '@/world/landmarks';
import { floatOf, BRUME_ALT, drawBrume, BRUME_REACH, moodOf, motionOf, glideStep, GLIDE_WAIT_S } from '@/world/brume';
import { brumeArtLayer, drawBrumeArt } from '@/world/brumeArt';
import { wreckOf, memoryOf } from '@/world/story';
import { builtOf } from '@/world/faces';
import { questShort, questPlan } from '@/game/prologue';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { TW, TH } from '../constants';

// Les écus volent de Brume à la bourse, l'un après l'autre (ms) ; « +N » monte au-dessus d'elle (s)
const COIN_MS = 900;
const COIN_GAP_MS = 120;
const FLOAT_S = 1.4;

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
  // Brume, animée selon ce qu'elle vit (world/brume.js : moodOf, motionOf) : elle sautille quand la récompense attend,
  // bondit de joie quand on la touche, sursaute à une quête nouvelle puis glisse vers sa nouvelle place (jamais de saut),
  // frémit gênée quand il manque de quoi payer, somnole la nuit ; « +N » monte au-dessus d'elle après la récompense
  drawBrume(ctx, t, s) {
    const spot = this.brumeSpot();
    if (!spot) {
      this.brumeHit = null;
      return;
    }
    const still = this.reduced();
    const sinceClaim = this.brumeClaimAt ? t - this.brumeClaimAt : Infinity;
    const sinceQuest = this.brumeQuestAt ? t - this.brumeQuestAt : Infinity;
    // (sur place le temps du sursaut, puis elle glisse)
    const waiting = sinceQuest < GLIDE_WAIT_S;
    const at = this.brumeAt && !still ? (waiting ? this.brumeAt : glideStep(this.brumeAt, spot, Math.min(0.1, t - (this.brumeT || t)))) : { x: spot.x, y: spot.y };
    this.brumeAt = at;
    this.brumeT = t;
    const ready = Boolean(this.quest && this.quest.done);
    const short = Boolean(this.quest && !ready && this.state && questShort(this.quest, this.state, this.stockPaid));
    const mood = still ? (ready ? 'pret' : 'neutre') : moodOf({ ready, short, night: Boolean(this.phase && this.phase.night > 0.6), sinceClaim, sinceQuest, t });
    const m = still ? { dx: 0, dy: 0, sx: 1, sy: 1 } : motionOf(mood, t, mood === 'rire' ? sinceClaim : sinceQuest);
    const { dx, dy } = floatOf(t);
    const x = at.x + dx + m.dx, y = at.y - BRUME_ALT + dy + m.dy;
    // Son dessin de la bibliothèque (son stade, son expression), à la taille du feu follet par code, qui le remplace en
    // attendant
    const layer = brumeArtLayer(this.brumeState, ready, still ? 0 : t, mood);
    const k = Math.max(1, 0.6 / s);
    const r = (this.brumeState.sun ? 6.5 : 8) * k;
    ctx.save();
    if (m.sx !== 1 || m.sy !== 1) {
      ctx.translate(x, y);
      ctx.scale(m.sx, m.sy);
      ctx.translate(-x, -y);
    }
    if (!layer || !drawBrumeArt(ctx, layer, x, y, at, r, this.repaintSoon)) drawBrume(ctx, x, y, at, t, ready, s, this.brumeState);
    ctx.restore();
    if (ready && !still) this.drawBrumeSparks(ctx, x, y, r, k, t);
    this.drawBrumeFloats(ctx, x, y - r * 2.6, k, t);
    this.brumeHit = { x, y, r: BRUME_REACH * k };
  },
  // Trois étincelles dorées qui montent et s'éteignent : la récompense attend
  drawBrumeSparks(ctx, x, y, r, k, t) {
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.5 + i / 3) % 1;
      ctx.fillStyle = `rgba(255,200,90,${(0.9 * (1 - p)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(t * 1.7 + i * 2.1) * r * 1.4, y - r * (1.6 + p * 2.6), (1.6 - p) * k, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  // « +N » (les écus reçus) : naît au-dessus de Brume, monte et s'efface en FLOAT_S
  drawBrumeFloats(ctx, x, y, k, t) {
    const floats = this.brumeFloats;
    if (!floats || !floats.length) return;
    this.brumeFloats = floats.filter(f => t - f.at < FLOAT_S);
    ctx.font = `900 ${(13 * k).toFixed(1)}px Nunito, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    for (const f of this.brumeFloats) {
      const p = (t - f.at) / FLOAT_S;
      const fy = y - p * 24 * k;
      ctx.globalAlpha = p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
      ctx.lineWidth = 3 * k;
      ctx.strokeStyle = 'rgba(74,52,38,.9)';
      ctx.strokeText(f.text, x, fy);
      ctx.fillStyle = '#F2C04B';
      ctx.fillText(f.text, x, fy);
    }
    ctx.globalAlpha = 1;
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
      // La fête (choix de l'auteur, 8 oct.) : Brume bondit de joie, « +N » monte au-dessus d'elle, les écus volent
      // lentement jusqu'à la bourse, qui gonfle ; aucune alerte
      const now = performance.now() / 1000;
      this.brumeClaimAt = now;
      this.brumeFloats = [...(this.brumeFloats || []), { text: `+${gained}`, at: now }];
      if (hit) {
        const sp = this.toScreen(hit.x, hit.y);
        const at = this.canvasPoint(sp.x, sp.y);
        ring(at, 90);
        burst(at, 24, 80);
        // (la bourse apparaît avec le premier écu : après le rendu)
        this.$nextTick(() => {
          const purse = document.querySelector('.world__purse');
          if (!purse || this.gone) return;
          [0, 1, 2, 3, 4].forEach(i => setTimeout(() => { if (!this.gone) fly('ui:coin', { left: at.x - 10, top: at.y - 10, width: 20, height: 20 }, purse, COIN_MS); }, i * COIN_GAP_MS));
          setTimeout(() => {
            if (this.gone) return;
            purse.classList.add('is-bump');
            setTimeout(() => purse.classList.remove('is-bump'), 600);
          }, COIN_MS);
        });
      }
      vibrate([12, 30, 16]);
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
