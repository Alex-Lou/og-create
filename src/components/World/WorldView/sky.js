// L'île : l'heure et le ciel de l'en-tête (moment, temps, soleil), et la journée en accéléré. Mixin de WorldView.vue :
// ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { opusOf } from '@/game/opus';
import { phaseAt } from '@/world/scene';
import { clockText, fixSun, showerAt } from '@/world/sky';
import { tutorialDate, tutorialDay, TUTO_SUN } from '@/world/tutoClock';
import { CYCLE_MS, dayHourOf, gameDate, GAME_SUN } from '@/world/gameClock';

// Journée en accéléré (toucher sur l'horloge) : un cycle de l'horloge du jeu (24 h de l'île) en 30 s
const WARP_MS = 30000;
// Le jour passe (tutoriel) : l'horloge file jusqu'à l'étape suivante en PASS_MS ; au-delà de VEIL_MS d'écart, sous un
// voile de crépuscule (WorldView.css : world__day-pass, même durée)
const PASS_MS = 1600;
const VEIL_MS = 2 * 3600000;

export default {
  data() {
    return {
      // Horloge de l'en-tête (heure, moment, temps, soleil) ; journée en accéléré
      skyClock: null,
      warping: false,
      dayPass: false
    };
  },
  beforeUnmount() {
    fixSun(null);
  },
  methods: {
    // Date du ciel : imposée (essais), celle du tutoriel (son horloge à lui, accélérée : world/tutoClock.js), ou celle
    // de l'horloge du jeu (world/gameClock.js : son soleil à elle), jouée en accéléré (horloge) ou non
    skyDate(now = performance.now()) {
      if (this.forced && this.forced.date) {
        fixSun(null);
        return this.forced.date;
      }
      const tuto = this.tutorialSky(now);
      // (chaque horloge a son soleil à elle : l'heure affichée dit la lumière)
      fixSun(tuto ? TUTO_SUN : GAME_SUN);
      if (tuto) return tuto;
      if (this.warp) {
        const elapsed = now - this.warp.start;
        if (elapsed < WARP_MS) return gameDate(this.warp.from + elapsed * (CYCLE_MS / WARP_MS));
        this.warp = null;
        this.warping = false;
      }
      return gameDate(Date.now());
    },
    // Pendant le tutoriel : le moment de son étape, qui avance depuis qu'elle a commencé sur cet appareil ; null sinon.
    // Une étape plus tard le même jour (la Récolte de Lorena finie, le soir) : le jour passe, l'horloge file jusqu'à elle
    tutorialSky(now) {
      const id = this.quest && this.quest.id;
      if (!id || !this.thickMist()) return null;
      if (this.tutoQuest !== id) {
        const was = this.tutoQuest ? tutorialDate(this.tutoQuest, now - this.tutoSince) : null;
        const to = tutorialDate(id, 0);
        this.tutoQuest = id;
        this.tutoSince = now;
        this.tutoPass = was && to && to > was && !this.reduced() ? { from: was.getTime(), span: to - was } : null;
        if (this.tutoPass && this.tutoPass.span >= VEIL_MS) this.dayPass = true;
      }
      if (this.tutoPass) {
        const k = (now - this.tutoSince) / PASS_MS;
        if (k < 1) return new Date(this.tutoPass.from + this.tutoPass.span * (k * k * (3 - 2 * k)));
        this.tutoPass = null;
        this.tutoSince = now;
      }
      return tutorialDate(id, now - this.tutoSince);
    },
    skyAt(date) {
      // La lumière suit le Grand Œuvre (?oeuvre= pour l'imposer pendant les essais) ; après le conseil, la pluie tient
      // jusqu'au matin (phare.js : conseilRain)
      return phaseAt(date, { weather: this.forced ? this.forced.weather : this.conseilRain(date), opus: (this.forced && this.forced.opus) || opusOf(this.actsDone), shower: this.showerNow() });
    },
    // L'averse de la Pluie écrite (choix de l'auteur, 12 et 14 oct. ; demos.js : guideDemo « averse ») : elle tombe tant
    // que ses répliques se lisent (world/sky.js : showerAt) ; 0 : rien ne passe
    showerNow() {
      if (!this.shower) return 0;
      const k = showerAt((performance.now() - this.shower) / 1000, this.showerLeave);
      if (k === null) {
        this.shower = 0;
        this.showerLeave = null;
        // l'averse passée, l'arc-en-ciel (draw/loop.js)
        this.arcAfter = performance.now();
      }
      return k || 0;
    },
    // Horloge de l'en-tête : remise à jour quand la minute, le moment ou le temps changent (10 fois par seconde au plus
    // pendant l'accéléré)
    syncClock(phase, date, now) {
      const time = clockText(date);
      const day = this.lifeDay();
      const clock = this.skyClock;
      if (clock && clock.time === time && clock.label === phase.label && clock.weather === phase.weather.kind && clock.day === day) return;
      if (this.warp && now - this.clockAt < 100) return;
      this.clockAt = now;
      const night = phase.sun.up <= 0;
      const progress = night ? ((phase.hour - phase.set + 24) % 24) / (24 - (phase.set - phase.rise)) : phase.sun.progress;
      this.skyClock = { time, label: phase.label, weather: phase.weather.kind, weatherLabel: phase.weather.label, progress, night, day };
    },
    // Le jour vécu sur l'île (choix de l'auteur, 18 oct.) : pendant le tutoriel, celui de son étape ; ensuite, un de plus
    // à chaque minuit de l'horloge du jeu depuis qu'il a été quitté (serveur : brume.days ; à l'heure, même pendant la
    // journée en accéléré) ; null tant que le serveur ne le dit pas
    lifeDay() {
      const brume = this.state && this.state.brume;
      if (!brume) return null;
      if (this.thickMist()) return tutorialDay(brume.quest.id);
      const from = brume.days;
      if (!from) return null;
      return (tutorialDay(from.quest) || 1) + dayHourOf(Date.now()).day - dayHourOf(from.at).day;
    },
    syncPhase() {
      const now = performance.now();
      const date = this.skyDate(now);
      this.syncClock(this.skyAt(date), date, now);
    },
    // Toucher sur l'horloge : la journée entière défile en 30 s, puis l'île revient à l'heure ; un autre toucher l'arrête
    toggleWarp() {
      if (this.warp || this.reduced()) {
        this.warp = null;
        this.warping = false;
      } else {
        this.warp = { start: performance.now(), from: Date.now() };
        this.warping = true;
      }
      this.syncLoop();
      this.draw(performance.now());
    }
  }
};
