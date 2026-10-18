// Brume sur l'île : où elle flotte, son dessin, et ce que fait un toucher sur elle (la quête active, sa récompense, le
// nom du peuple, le naufrage et le souvenir retrouvé). Méthodes de WorldView.vue (this : le composant), réunies par
// draw.js.

import { vibrate } from '@/utils/fx';
import { feteBrume, ECLAT_MS, FETE_MS } from '@/utils/fete';
import { guide } from '@/game/guide';
import { landmarksShown } from '@/world/landmarks';
import { floatOf, joyHop, JOY_MS, BRUME_ALT, drawBrume, BRUME_REACH, WISP, toneOf, moodOf, motionOf, glideStep, GLIDE_WAIT_S } from '@/world/brume';
import { brumeArtLayer, drawBrumeArt } from '@/world/brumeArt';
import { PHENIX_EVERY, PHENIX_FOR, PHENIX_DECALE, phenixHeure, phenixAt, drawPhenix } from '@/world/phenix';
import { wreckOf, memoryOf } from '@/world/story';
import { builtOf } from '@/world/faces';
import { questShort, questPlan } from '@/game/prologue';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { TW, TH } from '../constants';
import { BRUME_ALERTS, BRUME_ERRORS } from '@/texts/world/brume';
import { MEMORY_HELP } from '@/texts/tutorial/coach';

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
  // Le vol du Phénix (world/phenix.js) : une fois le Phénix écrit, du coucher du soleil à l'aube, de temps en temps,
  // quand aucune récompense n'attend ; il fait le tour de ce qu'on regardait quand il s'est envolé ; null hors vol
  phenixOf(t, view, phase) {
    const u = t - PHENIX_DECALE;
    if (u < 0 || !(this.elements || []).includes('Phénix') || !phenixHeure(phase) || (this.quest && this.quest.done)) return null;
    const cycle = Math.floor(u / PHENIX_EVERY), τ = u - cycle * PHENIX_EVERY;
    const spot = τ < PHENIX_FOR && this.brumeSpot();
    if (!spot) return null;
    let p = this.passages.phenix;
    if (!p || p.cycle !== cycle) p = this.passages.phenix = { cycle, centre: { x: view.x + view.w / 2, y: view.y + view.h * 0.56 }, rayon: Math.min(420, Math.max(110, view.w * 0.27)) };
    return phenixAt({ x: spot.x, y: spot.y - BRUME_ALT, g: spot.y }, p.centre, p.rayon, τ);
  },
  // Où est Brume à l'instant t : son point au sol (spot), sa flamme (x, y), la récompense qui attend (ready), son
  // humeur (mood) et son étirement (sx, sy) ; null si elle n'est nulle part. Sa lumière et son dessin le lisent une fois
  // par image : ils ne se décalent jamais.
  // Animée selon ce qu'elle vit (choix de l'auteur, 8 oct. ; world/brume.js : moodOf, motionOf) : elle sautille quand la
  // récompense attend, sursaute à une quête nouvelle puis glisse vers sa nouvelle place (jamais de saut), frémit gênée
  // quand il manque de quoi payer, somnole la nuit ; sa joie (une quête réclamée) garde son saut (joyHop)
  brumeAt(t) {
    const target = this.brumeSpot();
    if (!target) {
      this.brumeGlide = null;
      return null;
    }
    const still = this.reduced();
    const sinceQuest = this.brumeQuestAt ? t - this.brumeQuestAt : Infinity;
    // (sur place le temps du sursaut, puis elle glisse)
    const from = this.brumeGlide;
    const spot = from && !still ? (sinceQuest < GLIDE_WAIT_S ? from.at : glideStep(from.at, target, Math.min(0.1, t - from.t))) : target;
    this.brumeGlide = { at: spot, t };
    const ready = Boolean(this.quest && this.quest.done);
    const joyFor = this.brumeJoy ? performance.now() - this.brumeJoy : Infinity;
    const short = Boolean(this.quest && !ready && this.state && questShort(this.quest, this.state, this.stockPaid));
    const mood = still ? (ready ? 'pret' : 'neutre')
      : moodOf({ joy: joyFor >= 0 && joyFor < JOY_MS, ready, short, night: Boolean(this.phase && this.phase.night > 0.6), sinceQuest, t });
    const m = still ? { dx: 0, dy: 0, sx: 1, sy: 1 } : motionOf(mood, t, sinceQuest);
    const { dx, dy } = floatOf(t);
    // (une quête réclamée : elle bondit de joie)
    const x = spot.x + dx + m.dx, y = spot.y - BRUME_ALT + dy + m.dy - (this.brumeJoy ? joyHop(joyFor) : 0);
    return { spot, x, y, ready, mood, sx: m.sx, sy: m.sy };
  },
  // La nuit, Brume éclaire autour d'elle, à sa couleur (choix de l'auteur, 15 oct. : le froid magique du feu follet
  // contre le chaud des feux et des fenêtres) : une lueur dans l'air autour de la flamme, et une flaque au sol sous
  // elle (elle vole trop haut pour que la flaque d'une source y tombe). Pour la carte de lumière seulement : son halo,
  // elle le dessine elle-même. at : brumeAt ; s : échelle de la caméra (sa taille minimale quand on voit toute l'île).
  // En vol, le Phénix éclaire à sa place (lumierePhenix)
  brumeLights(at, phase, t, s) {
    if (!at || this.phenix || phase.lit <= 0.01) return [];
    // (sa teinte blanchie de moitié : la carte de lumière rend au sol ses couleurs, la lueur froide vient par-dessus)
    const color = this.brumeTone(at).split(',').map(c => Math.round(+c + (255 - c) * 0.55)).join(',');
    const k = Math.max(1, 0.6 / s);
    const breath = phase.lit * (0.92 + 0.08 * Math.sin(t * 3));
    const ground = at.spot.y;
    return [
      { x: at.x, y: at.y, r: 34 * k, k: 0.45 * breath, color, pool: false, gy: ground },
      { x: at.spot.x, y: ground - 8 * k, r: 24 * k, k: 0.35 * breath, color, pool: true, gy: ground, sol: true }
    ];
  },
  // La couleur de sa lueur (« r,g,b ») : celle de son stade, dorée quand la récompense attend
  brumeTone(at) {
    return (at.ready ? WISP.ready : toneOf(this.brumeState)).halo;
  },
  // La nuit, sa lueur froide posée sur le sol, en addition par-dessus la nuit : la carte de lumière ne fait que rendre
  // au sol ses couleurs de plein jour (sur l'herbe, un vert acide) ; c'est cette lueur qui dit le feu follet
  drawBrumeGlow(ctx, at, t, s) {
    const lit = this.phase ? this.phase.lit : 0;
    if (lit <= 0.01) return;
    const color = this.brumeTone(at);
    const r = 54 * Math.max(1, 0.6 / s);
    const a = lit * 0.5 * (0.92 + 0.08 * Math.sin(t * 3));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(at.spot.x, at.spot.y);
    ctx.scale(1, 0.5);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${color},${a.toFixed(3)})`);
    g.addColorStop(0.45, `rgba(${color},${(a * 0.45).toFixed(3)})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  },
  drawBrume(ctx, t, s, at = this.brumeAt(t)) {
    this.phenixHit = null;
    if (!at) {
      this.brumeHit = null;
      return;
    }
    // En vol, le Phénix prend sa place (un toucher : une gerbe de braises)
    const ph = this.phenix;
    if (ph) {
      const touche = this.scared.get('phenix');
      drawPhenix(ctx, ph, t, s, touche ? touche.at : null);
      this.brumeHit = null;
      this.phenixHit = { x: ph.x, y: ph.y - 8, r: BRUME_REACH * 1.6 * Math.max(1, 0.6 / s) };
      return;
    }
    const { spot, x, y, ready, mood, sx, sy } = at;
    this.drawBrumeGlow(ctx, at, t, s);
    // Son dessin de la bibliothèque (son stade, son expression), à la taille du feu follet par code, qui le remplace en
    // attendant ; étiré ou écrasé par son humeur, autour du bas de la flamme
    const still = this.reduced();
    const layer = brumeArtLayer(this.brumeState, ready, still ? 0 : t, mood);
    const k = Math.max(1, 0.6 / s);
    const r = (this.brumeState.sun ? 6.5 : 8) * k;
    ctx.save();
    if (sx !== 1 || sy !== 1) {
      ctx.translate(x, y);
      ctx.scale(sx, sy);
      ctx.translate(-x, -y);
    }
    if (!layer || !drawBrumeArt(ctx, layer, x, y, spot, r, this.repaintSoon)) drawBrume(ctx, x, y, spot, t, ready, s, this.brumeState);
    ctx.restore();
    if (ready && !still) this.drawBrumeSparks(ctx, x, y, r, k, t);
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
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem('oc_wrecks') || '[]'); } catch (e) { seen = []; }
    const wreck = wreckOf(this.quest, Array.isArray(seen) ? seen : []);
    if (!wreck || this.wreck || this.reveal || this.haul || this.holdWreck) return;
    this.wreck = wreck;
    try { localStorage.setItem('oc_wrecks', JSON.stringify([...seen, wreck.id])); } catch (e) { /* le confort seulement */ }
  },
  // Fin de l'annonce : la caméra va vers le quartier où dort le naufragé
  closeWreck() {
    const wreck = this.wreck;
    const zone = wreck && this.state && this.state.map.zones.find(z => z.id === wreck.zone);
    this.wreck = null;
    // (ce qu'on en dit, l'annonce refermée : WorldView, phare.js)
    if (wreck && wreck.after) this.sayArc(`naufrage-${wreck.id}`, wreck.after);
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
    this.busy = true;
    try {
      this.apply(await playService.worldPeople(name));
      this.peopleName = '';
      this.$emit('show-alert', BRUME_ALERTS.people(this.state.people));
    } catch (error) {
      this.$emit('show-alert', messageOf(error, BRUME_ERRORS.people), 'error');
    } finally {
      this.busy = false;
    }
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
};
