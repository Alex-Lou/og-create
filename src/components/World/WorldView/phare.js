// L'île : l'arc du Phare (choix de l'auteur, 15 oct. : ecriture/arc_phare.md). Le vol de la caméra du conseil, du feu
// droit jusqu'à l'Îlot aux Mouettes (choix de l'auteur, 16 oct. : sans détour ni demi-tour), sous l'orage ; deux coups
// de foudre près de la tour ; puis retour au feu, et la pluie jusqu'au matin (App, chronicle.js) ; la Route des
// feux : un lieu découvert rallume son feu d'un geste (sa bulle, gestures.js), le serveur le retient, et ceux qui sont
// là en parlent. La lumière de nuit d'un feu rallumé, et la brume qui s'écarte autour de la tour, sont celles de la
// session ambiance (rien n'est dessiné ici). Mixin de WorldView.vue.
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { guide } from '@/game/guide';
import { bubbleFace, builtOf, NAMES, playerBubble } from '@/world/faces';
import { along, ease } from '@/world/flight';
import { foudreAt } from '@/world/lumiere';
import { phareArtLayer, phareArtLayers } from '@/world/decorArt';
import { prefetchSprite } from '@/world/spriteCache';
import { sunTimes } from '@/world/sky';
import { load, save } from '@/utils/storage';
import { NEAR_SCALE, PAN_SCALE } from '@/world/view/constants';
import { STALE_GAP_MS } from '@/world/terrain';
import { arcMomentsOf, fireLinesOf } from '@/world/arc';
import { FLOATING_ZONE } from '@/world/islets';
import { FAILED } from '@/texts/world/screens/alerts';
import { FIRE, FIRST_FIRE, PASSEUR_LANTERN, PHARE_QUESTION } from '@/texts/world/phare';

// Son allure : l'aller (ms), l'arrêt sur la tour, le retour au feu ; le zoom du survol
const OUT_MS = 4200;
const HOLD_MS = 3200;
const HOME_MS = 2000;
const FLIGHT_SCALE = 0.55;
// En mouvement réduit : des coupes franches, chaque arrêt tant de ms
const CUT_MS = 1400;
// Les deux coups de foudre sur la tour (choix de l'auteur, 16 oct. : la gravité de la scène ; près de la tour, qui reste
// éteinte) : ms après l'arrivée, l'impact de part et d'autre de son pied (dx, dy : unités du monde), le côté d'où vient
// leur lumière (x), leur forme (cycle : à part de ceux de l'orage). Pas en mouvement réduit
const STRIKES = [{ at: 500, dx: -80, dy: 36, x: 0.3, cycle: -101 }, { at: 1800, dx: 90, dy: 24, x: 0.7, cycle: -102 }];
// La vue aux jumelles de Lorena (choix de l'auteur, 16 oct. : BinocularView.vue) : la caméra vise la tour à cette part de sa
// hauteur depuis son sommet (la lanterne éteinte au haut des deux verres) ; le temps qu'elle met à les baisser (ms)
const AIM = 0.32;
const LOWER_MS = 520;
// La pluie du conseil, retenue sur l'appareil jusqu'au matin du jeu (WorldView, sky.js : skyAt)
const RAIN_KEY = 'oc_pluie_conseil';
// La préparation du trajet : tant de vues le long du vol, ses carrés du sol peints par morceaux dans les moments de
// répit (SLICE_MS au moins chacun, loin d'une longue tâche) ; ses carrés à refaire se refont jusqu'au vol, RETOUCH_MS au
// plus
const PREPARE_STEPS = 8;
const SLICE_MS = 16;
const RETOUCH_MS = 120000;
// (un moment de répit attendu IDLE_MS au plus : pendant que la scène s'anime, le navigateur n'en a presque jamais, et
// chaque morceau de la préparation ne fait que SLICE_MS)
const IDLE_MS = 50;
const idle = fn => (window.requestIdleCallback ? { idle: requestIdleCallback(fn, { timeout: IDLE_MS }) } : { timer: setTimeout(fn, 32) });
const cancelIdle = task => {
  if (task && task.idle) cancelIdleCallback(task.idle);
  else if (task) clearTimeout(task.timer);
};

// Qui dit une réplique de l'arc (texts/world/phare.js) : une didascalie (aside), Brume, le joueur (son nom et son
// avatar : look), un maître (son nom et son visage, avec son expression : mood ; de naufragé tant que son bâtiment n'est
// pas fondé ; built : ceux qui le sont), ou un nom écrit
export function arcSpeaker(line, built, look = null) {
  if (line.aside) return { aside: true };
  if (line.who === 'brume') return {};
  if (line.who === 'joueur') return playerBubble(look);
  if (NAMES[line.who]) return { who: NAMES[line.who], ...bubbleFace(line.who, { castaway: !built.includes(line.who), mood: line.mood }) };
  return { who: line.who };
}

export default {
  data() {
    return {
      // Le vol en cours : son image demandée, son minuteur, et la promesse à tenir à la fin
      flightRaf: 0,
      flightTimer: 0,
      flightDone: null,
      flightRelease: null,
      // La caméra glisse (aller ou retour : le sol se peint au plus à PAN_SCALE) ; l'instant de son arrivée sur la tour
      // (les coups de foudre : conseilFoudre) ; la préparation du trajet en cours
      flightPan: false,
      flightHoldAt: 0,
      prepareTask: null,
      // La vue aux jumelles pendant le vol : 'haut', 'net', 'bas' (BinocularView.vue), ou null
      jumelles: null,
      // La pluie du conseil : jusqu'à cette date du jeu (ms), 0 sinon
      conseilRainUntil: load(RAIN_KEY, 0)
    };
  },
  beforeUnmount() {
    this.stopFlight();
    cancelIdle(this.prepareTask);
  },
  methods: {
    // Le trajet du vol : du point de vue actuel droit jusqu'à la tour de l'îlot (pts : visée à AIM de sa hauteur, sinon le
    // milieu de l'îlot), le retour au-dessus du feu (back), le zoom du départ (from) ; null si l'île n'a ni feu ni îlot
    flightRoute() {
      const ilot = this.coachWorld('ilot');
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer');
      if (!ilot || !foyer || !this.cam) return null;
      const home = this.ground(foyer.x + (foyer.w - 1) / 2, foyer.y + (foyer.h - 1) / 2);
      const phare = this.phareSpot();
      const layer = phare && phareArtLayer(this.phareLook(this.skyDate()));
      const box = layer && layer.make().box;
      const aim = box ? { x: phare.x, y: phare.y + box.y + box.h * AIM } : { x: ilot.x, y: ilot.y };
      return { pts: [{ x: this.cam.x, y: this.cam.y }, aim], back: { x: home.x, y: home.y, s: this.cam.s }, from: this.cam.s };
    },
    // Le vol se prépare pendant qu'on lit le conseil (App : la scène s'ouvre ; le dessin de l'île est à l'arrêt dessous) :
    // les carrés du sol de son trajet, aller et retour, à l'échelle où ils seront peints, par morceaux dans les moments
    // de répit (gardés jusqu'au vol, refaits si un chemin ou un dessin du décor arrive d'ici là : world/terrain.js) ; et
    // toutes les images de la tour, sous la pluie du conseil (lues à son apparition, une toutes les 380 ms, elle
    // manquait à l'arrivée et le vol saccadait)
    prepareLighthouse() {
      cancelIdle(this.prepareTask);
      this.prepareTask = null;
      // (une préparation d'avant n'a plus à être gardée)
      if (this.terrain) this.terrain.release();
      const route = this.flightRoute();
      if (!route || !this.terrain || !this.geo) return;
      const { width, height, dpr } = this.geo;
      for (const layer of phareArtLayers({ ...this.phareLook(this.skyDate()), mouille: true })) prefetchSprite(layer.key, layer.make, FLIGHT_SCALE * dpr);
      const views = [];
      for (let i = 0; i <= PREPARE_STEPS; i++) {
        const k = i / PREPARE_STEPS;
        const at = along(route.pts, k);
        const s = route.from + (FLIGHT_SCALE - route.from) * ease(Math.min(1, k * 3));
        views.push({ view: { x: at.x - width / s / 2, y: at.y - height / s / 2, w: width / s, h: height / s }, scale: Math.min(s * dpr, PAN_SCALE), bake: s < NEAR_SCALE });
      }
      // (et l'arrêt sur la tour, où le sol reprend sa finesse : peint à l'arrivée, il saccadait)
      const end = route.pts[1];
      views.push({ view: { x: end.x - width / FLIGHT_SCALE / 2, y: end.y - height / FLIGHT_SCALE / 2, w: width / FLIGHT_SCALE, h: height / FLIGHT_SCALE }, scale: FLIGHT_SCALE * dpr, bake: FLIGHT_SCALE < NEAR_SCALE });
      // (le trajet prêt, ses carrés à refaire se refont jusqu'au départ, un chemin ou un dessin du décor arrivé depuis ;
      // pas au-delà de RETOUCH_MS, si le vol ne vient pas)
      const retouchEnd = performance.now() + RETOUCH_MS;
      // (chaque moment de répit peint le carré en cours le temps qu'il a de libre, SLICE_MS au moins : pendant que la
      // scène s'anime, il en a peu, et le trajet n'avançait plus)
      const next = deadline => {
        this.prepareTask = null;
        const until = performance.now() + Math.max(SLICE_MS, deadline && deadline.timeRemaining ? deadline.timeRemaining() : 0);
        while (views.length && !this.terrain.prepare(views[0].view, views[0].scale, views[0].bake, until)) views.shift();
        if (views.length || this.terrain.retouch(until)) this.prepareTask = idle(next);
        else if (performance.now() < retouchEnd) this.prepareTask = { timer: setTimeout(() => { this.prepareTask = idle(next); }, STALE_GAP_MS) };
      };
      this.prepareTask = idle(next);
    },
    // Le vol du conseil : une promesse tenue à son retour au feu (tout de suite si l'île n'a ni feu ni îlot) ; rain : la
    // pluie reste sur l'île jusqu'au matin du jeu (le conseil joué ; pas quand on le revoit)
    flyToLighthouse({ rain = false } = {}) {
      this.stopFlight();
      return new Promise(resolve => {
        const route = this.flightRoute();
        if (!route) {
          resolve();
          return;
        }
        this.flightDone = resolve;
        if (rain) this.rainUntilMorning();
        const { pts, back, from } = route;
        // (pendant le vol, les répliques hors scénario attendent : rien ne parle par-dessus)
        this.flightRelease = guide.hold();
        if (this.reduced()) {
          this.cutThrough([{ ...pts[1], s: FLIGHT_SCALE, jumelles: 'net' }, back]);
          return;
        }
        const start = performance.now();
        this.flightPan = true;
        // (Lorena porte ses jumelles à ses yeux et cherche la tour pendant que la caméra glisse)
        this.jumelles = 'haut';
        const step = now => {
          const k = Math.min(1, (now - start) / OUT_MS);
          const at = along(pts, ease(k));
          this.cam.x = at.x;
          this.cam.y = at.y;
          // (le zoom recule vite, puis tient)
          this.cam.s = from + (FLIGHT_SCALE - from) * ease(Math.min(1, k * 3));
          this.clampCam();
          // (la boucle de l'île saute cette image : un seul dessin par image, drawSoon)
          this.lastFrame = now;
          this.draw(now);
          if (k < 1) {
            this.flightRaf = requestAnimationFrame(step);
            return;
          }
          // Sur la tour : la caméra s'arrête, le sol reprend sa finesse, la foudre frappe deux fois ; puis retour au feu
          this.flightRaf = 0;
          this.flightPan = false;
          this.flightHoldAt = now;
          this.jumelles = 'net';
          this.flightTimer = setTimeout(() => {
            this.flightHoldAt = 0;
            this.flightPan = true;
            this.jumelles = 'bas';
            this.glideTo(back, HOME_MS);
            this.flightTimer = setTimeout(() => {
              this.jumelles = null;
              this.flightTimer = setTimeout(() => this.endFlight(), HOME_MS - LOWER_MS);
            }, LOWER_MS);
          }, HOLD_MS);
        };
        this.flightRaf = requestAnimationFrame(step);
      });
    },
    // Les coups de foudre de cet instant sur la tour (draw/loop.js, à la place de l'éclair de l'orage), ou null : le
    // dernier parti d'abord (le second frappe pendant que le premier s'éteint)
    conseilFoudre(now) {
      if (!this.flightHoldAt || this.reduced()) return null;
      const phare = this.phareSpot();
      if (!phare) return null;
      for (const s of [...STRIKES].reverse()) {
        const e = foudreAt((now - this.flightHoldAt - s.at) / 1000, s.cycle, { x: phare.x + s.dx, y: phare.y + s.dy }, s.x);
        if (e) return e;
      }
      return null;
    },
    // La pluie du conseil (choix de l'auteur, 16 oct.) : elle tient jusqu'au prochain lever du soleil du jeu, retenue
    // sur l'appareil
    rainUntilMorning() {
      const date = this.skyDate();
      const { rise } = sunTimes(date);
      const until = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, Math.round(rise * 60));
      if (until <= date) until.setDate(until.getDate() + 1);
      this.conseilRainUntil = until.getTime();
      save(RAIN_KEY, this.conseilRainUntil);
    },
    // Le temps que la pluie du conseil impose à cette date du jeu ('pluie'), ou null
    conseilRain(date) {
      return this.conseilRainUntil && date.getTime() < this.conseilRainUntil ? 'pluie' : null;
    },
    // (mouvement réduit : la caméra se pose sur chaque point, sans glisser)
    cutThrough(stops) {
      const [first, ...rest] = stops;
      if (!first) {
        this.endFlight();
        return;
      }
      this.glideTo(first, 0);
      this.jumelles = first.jumelles || null;
      this.flightTimer = setTimeout(() => this.cutThrough(rest), CUT_MS);
    },
    endFlight() {
      this.flightTimer = 0;
      this.flightPan = false;
      this.flightHoldAt = 0;
      this.jumelles = null;
      if (this.flightRelease) this.flightRelease();
      this.flightRelease = null;
      const done = this.flightDone;
      this.flightDone = null;
      // (le vol passé, sa préparation s'arrête et les carrés de son trajet redeviennent des carrés comme les autres ; pas
      // à l'arrêt qui précède un vol, quand aucun n'était en cours)
      if (done) {
        cancelIdle(this.prepareTask);
        this.prepareTask = null;
        if (this.terrain) this.terrain.release();
        done();
      }
    },
    // (le démontage, ou un nouveau vol : tout s'arrête, la promesse est tenue)
    stopFlight() {
      cancelAnimationFrame(this.flightRaf);
      clearTimeout(this.flightTimer);
      this.flightRaf = 0;
      this.endFlight();
    },
    // Le feu d'un lieu découvert, rallumé (le serveur le retient) : l'île le fête, ceux qui sont là en parlent ; le
    // premier de la route, Brume se souvient du feu de la plage
    async lightFire(landmark) {
      if (this.busy) return;
      this.busy = true;
      const first = !(this.state.landmarks || []).some(l => l.lit);
      try {
        const { fresh, world } = await playService.landmarkFire(landmark.id);
        this.apply(world);
        if (fresh) {
          const c = this.ground(landmark.x, landmark.y);
          this.sparkle('eclat', c);
          this.pops.set(`landmark:${landmark.id}`, performance.now());
          vibrate([14, 40, 20]);
          this.$emit('show-alert', FIRE.done(landmark.name));
          this.sayFire(landmark.id, first);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.landmark), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Ce que disent les lieux au feu rallumé (texts/world/phare.js : FIRE_LINES ; deux variantes selon un acte fini)
    sayFire(id, first) {
      this.sayArc(`feu-${id}`, fireLinesOf(id, (this.state.brume && this.state.brume.acts) || []));
      if (first) this.sayArc('feu-premier', [FIRST_FIRE]);
    },
    // Des répliques de l'arc, chacune une fois (key : leur nom ; la première garde le nom seul, les suivantes un rang)
    sayArc(key, lines) {
      if (!this.state || !lines) return;
      const built = builtOf(this.state.villagers);
      lines.forEach((line, i) => guide.say({ id: i ? `${key}-${i}` : key, text: line.text, ...arcSpeaker(line, built, this.state.avatar) }));
    },
    // Un nouvel état de l'île (serve.js : apply) : ce qui vient de se passer dans l'arc (world/arc.js), dit sur l'île
    arcLines(prev, next) {
      for (const moment of arcMomentsOf(prev, next)) this.sayArc(`arc-${moment.key}`, moment.lines);
    },
    // Le soir de la veillée V (App, chronicle.js) : la caméra va au feu ; Brume demande si tu partiras ; tu ne réponds pas
    askPhareQuestion() {
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer');
      if (foyer) this.lookAtCell(foyer.x, foyer.y);
      this.sayArc('arc-question-phare', PHARE_QUESTION);
    },
    // La barque du Passeur touchée, son île à soi (gestures.js) : la lanterne du Passeur, une fois ; elle sursaute
    tapFerry() {
      vibrate(6);
      if (this.owns(this.state, FLOATING_ZONE)) this.sayArc('arc-passeur-lanterne', [PASSEUR_LANTERN]);
    }
  }
};
