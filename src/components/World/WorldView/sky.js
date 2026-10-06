// L'île : l'heure et le ciel de l'en-tête (moment, temps, soleil), et la journée en accéléré. Mixin de WorldView.vue :
// ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { opusOf } from '@/game/opus';
import { phaseAt } from '@/world/scene';
import { clockText } from '@/world/sky';

// Journée en accéléré (toucher sur l'horloge) : 24 h de l'île en 30 s
const WARP_MS = 30000;
const DAY_MS = 86400000;

export default {
  data() {
    return {
      // Horloge de l'en-tête (heure, moment, temps, soleil) ; journée en accéléré
      skyClock: null,
      warping: false
    };
  },
  methods: {
    // Date du ciel : imposée (essais), jouée en accéléré (horloge), ou l'heure réelle
    skyDate(now = performance.now()) {
      if (this.forced && this.forced.date) return this.forced.date;
      if (this.warp) {
        const elapsed = now - this.warp.start;
        if (elapsed < WARP_MS) return new Date(this.warp.from + elapsed * (DAY_MS / WARP_MS));
        this.warp = null;
        this.warping = false;
      }
      return new Date();
    },
    skyAt(date) {
      // La lumière suit le Grand Œuvre (?oeuvre= pour l'imposer pendant les essais)
      return phaseAt(date, { weather: this.forced ? this.forced.weather : null, opus: (this.forced && this.forced.opus) || opusOf(this.actsDone) });
    },
    // Horloge de l'en-tête : remise à jour quand la minute, le moment ou le temps changent (10 fois par seconde au plus
    // pendant l'accéléré)
    syncClock(phase, date, now) {
      const time = clockText(date);
      const clock = this.skyClock;
      if (clock && clock.time === time && clock.label === phase.label && clock.weather === phase.weather.kind) return;
      if (this.warp && now - this.clockAt < 100) return;
      this.clockAt = now;
      const night = phase.sun.up <= 0;
      const progress = night ? ((phase.hour - phase.set + 24) % 24) / (24 - (phase.set - phase.rise)) : phase.sun.progress;
      this.skyClock = { time, label: phase.label, weather: phase.weather.kind, weatherLabel: phase.weather.label, progress, night };
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
