// L'île : l'arc du Phare (choix de l'auteur, 15 oct. : ecriture/arc_phare.md). Le vol de la caméra du conseil, du feu
// jusqu'à l'Îlot aux Mouettes, par les quartiers des actes II à V, puis retour au feu (App, chronicle.js) ; la Route des
// feux : un lieu découvert rallume son feu d'un geste (sa bulle, gestures.js), le serveur le retient, et ceux qui sont
// là en parlent. La lumière de nuit d'un feu rallumé, et la brume qui s'écarte autour de la tour, sont celles de la
// session ambiance (rien n'est dessiné ici). Mixin de WorldView.vue.
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { guide } from '@/game/guide';
import { bubbleFace, builtOf, NAMES } from '@/world/faces';
import { along, ease, softPath } from '@/world/flight';
import { arcMomentsOf, fireLinesOf } from '@/world/arc';
import { FLOATING_ZONE } from '@/world/islets';
import { FAILED } from '@/texts/world/screens/alerts';
import { FIRE, FIRST_FIRE, PASSEUR_LANTERN, PHARE_QUESTION } from '@/texts/world/phare';

// Les quartiers que survole la caméra, dans l'ordre où on les ouvrira (la Colline, le Faubourg, la Crique, le Hameau)
const FLIGHT_ZONES = ['colline', 'est', 'crique', 'hameau'];
// Son allure : l'aller (ms), l'arrêt sur la tour, le retour au feu ; le zoom du survol
const OUT_MS = 6200;
const HOLD_MS = 2400;
const HOME_MS = 2000;
const FLIGHT_SCALE = 0.55;
// En mouvement réduit : des coupes franches, chaque arrêt tant de ms
const CUT_MS = 1400;

// Qui dit une réplique de l'arc (texts/world/phare.js) : une didascalie (aside), Brume, un maître (son nom et son
// visage, de naufragé tant que son bâtiment n'est pas fondé ; built : ceux qui le sont), ou un nom écrit
export function arcSpeaker(line, built) {
  if (line.aside) return { aside: true };
  if (line.who === 'brume') return {};
  if (NAMES[line.who]) return { who: NAMES[line.who], ...bubbleFace(line.who, { castaway: !built.includes(line.who) }) };
  return { who: line.who };
}

export default {
  data() {
    return {
      // Le vol en cours : son image demandée, son minuteur, et la promesse à tenir à la fin
      flightRaf: 0,
      flightTimer: 0,
      flightDone: null,
      flightRelease: null
    };
  },
  beforeUnmount() {
    this.stopFlight();
  },
  methods: {
    // Le vol du conseil : une promesse tenue à son retour au feu (tout de suite si l'île n'a ni feu ni îlot)
    flyToLighthouse() {
      this.stopFlight();
      return new Promise(resolve => {
        const ilot = this.coachWorld('ilot');
        const foyer = this.state && this.state.sites.find(s => s.id === 'foyer');
        if (!ilot || !foyer || !this.cam) {
          resolve();
          return;
        }
        this.flightDone = resolve;
        const home = this.ground(foyer.x + (foyer.w - 1) / 2, foyer.y + (foyer.h - 1) / 2);
        const back = { x: home.x, y: home.y, s: this.cam.s };
        const zones = FLIGHT_ZONES.map(id => this.state.map.zones.find(z => z.id === id)).filter(z => z && z.anchor)
          .map(z => this.ground(z.anchor.x, z.anchor.y));
        const pts = softPath([{ x: this.cam.x, y: this.cam.y }, ...zones, { x: ilot.x, y: ilot.y }]);
        // (pendant le vol, les répliques hors scénario attendent : rien ne parle par-dessus)
        this.flightRelease = guide.hold();
        if (this.reduced()) {
          this.cutThrough([...pts.slice(1).map(p => ({ ...p, s: FLIGHT_SCALE })), back]);
          return;
        }
        const from = this.cam.s;
        const start = performance.now();
        const step = now => {
          const k = Math.min(1, (now - start) / OUT_MS);
          const at = along(pts, ease(k));
          this.cam.x = at.x;
          this.cam.y = at.y;
          // (le zoom recule vite, puis tient)
          this.cam.s = from + (FLIGHT_SCALE - from) * ease(Math.min(1, k * 3));
          this.clampCam();
          this.draw(now);
          if (k < 1) {
            this.flightRaf = requestAnimationFrame(step);
            return;
          }
          this.flightRaf = 0;
          this.flightTimer = setTimeout(() => {
            this.glideTo(back, HOME_MS);
            this.flightTimer = setTimeout(() => this.endFlight(), HOME_MS);
          }, HOLD_MS);
        };
        this.flightRaf = requestAnimationFrame(step);
      });
    },
    // (mouvement réduit : la caméra se pose sur chaque point, sans glisser)
    cutThrough(stops) {
      const [first, ...rest] = stops;
      if (!first) {
        this.endFlight();
        return;
      }
      this.glideTo(first, 0);
      this.flightTimer = setTimeout(() => this.cutThrough(rest), CUT_MS);
    },
    endFlight() {
      this.flightTimer = 0;
      if (this.flightRelease) this.flightRelease();
      this.flightRelease = null;
      const done = this.flightDone;
      this.flightDone = null;
      if (done) done();
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
      lines.forEach((line, i) => guide.say({ id: i ? `${key}-${i}` : key, text: line.text, ...arcSpeaker(line, built) }));
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
