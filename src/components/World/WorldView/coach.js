// L'île et le coach du tutoriel (game/coach.js) : elle dit où sont ses cibles à l'écran (Brume, un bâtiment, un
// habitant, le panneau d'un quartier, ce que la mer a rendu sur la plage de Brumelune, la cage aux poules, une bête qui a faim) et
// amène la caméra vers celle de la leçon. Mixin de WorldView.vue.

import { coach } from '@/game/coach';
import { guide } from '@/game/guide';
import { TW, DEPOSIT_SCALE } from '@/world/view/constants';
import { BRUME_ALT, BRUME_REACH } from '@/world/brume';
import { depositWait } from '@/world/finds';
import { SEA_Z, HS } from '@/world/terrain';
import { ROAD_SCALE } from './roads';

// L'ordre où le coach montre ce que la mer a rendu
const GREVE_ORDER = ['bois', 'galet', 'coquillage'];

export default {
  computed: {
    // La cible de la leçon sur l'île (« site:puits »…), ou null
    coachTarget() {
      const lesson = coach.state.lesson;
      return lesson && lesson.target && lesson.target.startsWith('île:') ? lesson.target.slice(4) : null;
    },
    // Ce que regarde la réplique en cours (game/prologueScenes.js : look), ou null
    guideLook() {
      const line = guide.current;
      return (line && line.look) || null;
    }
  },
  watch: {
    // Une nouvelle cible : la caméra va vers elle (une fois par leçon)
    coachTarget(name) {
      if (name) this.$nextTick(() => this.coachFocus(name));
    },
    // Une réplique qui montre quelque chose (la longue-vue d'Aster : l'îlot, puis son chantier) : la caméra y glisse ;
    // l'îlot, de plus loin, pour qu'on le voie au large
    guideLook(name) {
      const at = name && this.coachWorld(name);
      if (at) this.glideTo({ x: at.x, y: at.y + 20, s: name === 'ilot' ? Math.min(this.cam.s, 0.55) : Math.max(this.cam.s, 1.1) });
    }
  },
  mounted() {
    this.offCoach = coach.island(name => this.coachRect(name));
    // « Me montrer » (CoachLayer) : la caméra va vers la cible, si elle existe
    this.offFocus = coach.focusIsland(name => {
      if (!this.coachWorld(name)) return false;
      this.coachFocus(name);
      return true;
    });
  },
  beforeUnmount() {
    clearTimeout(this.focusTimer);
    if (this.offCoach) this.offCoach();
    if (this.offFocus) this.offFocus();
  },
  methods: {
    // Une cible de l'île dans le monde : { x, y, r } (centre et rayon), ou null
    coachWorld(name) {
      if (!this.state) return null;
      const [kind, id] = name.split(':');
      if (kind === 'brume') {
        if (this.brumeHit) return { x: this.brumeHit.x, y: this.brumeHit.y, r: this.brumeHit.r };
        // (hors de l'écran, elle n'est pas dessinée : sa place près de l'objectif de la quête)
        const spot = this.brumeSpot && this.brumeSpot();
        return spot ? { x: spot.x, y: spot.y - BRUME_ALT, r: BRUME_REACH } : null;
      }
      // L'Îlot aux Mouettes, au large (la longue-vue d'Aster) : le milieu de ses terres
      if (kind === 'ilot') {
        const cells = this.islets && this.islets.colony;
        if (!cells || !cells.length) return null;
        const c = this.ground(cells.reduce((t, p) => t + p.x, 0) / cells.length, cells.reduce((t, p) => t + p.y, 0) / cells.length);
        return { x: c.x, y: c.y, r: TW };
      }
      // Aster dans les vagues (le matin de son arrivée) ; hors de l'écran, sa case de mer
      if (kind === 'eau') {
        if (this.swimHit) return { x: this.swimHit.x, y: this.swimHit.y, r: this.swimHit.r };
        if (!this.swimSpot || !this.waiting.includes('ponton')) return null;
        const c = this.world(this.swimSpot.x + 0.5, this.swimSpot.y + 0.5);
        return { x: c.x, y: c.y - SEA_Z * HS - 18, r: 22 };
      }
      // Le premier chemin : la prochaine case à toucher, du Puits vers le sentier (seulement le tracé ouvert)
      if (kind === 'chemin') {
        const start = this.roadMode && this.roadHint;
        if (!start) return null;
        const g = this.ground(start.x, start.y);
        return { x: g.x, y: g.y, r: TW * 0.42 };
      }
      if (kind === 'site') {
        const site = this.state.sites.find(s => s.id === id);
        if (!site) return null;
        const c = this.centerOf(site);
        return { x: c.x, y: c.y - TW * 0.35 * site.w, r: TW * 0.45 * site.w };
      }
      if (kind === 'habitant') {
        const hit = (this.landHits || []).find(h => h.key === `vil:${id}`);
        return hit ? { x: hit.x, y: hit.y - 6, r: Math.max(18, hit.r) } : null;
      }
      if (kind === 'quartier') {
        const sign = (this.signs || []).find(sg => sg.zone && sg.zone.id === id);
        return sign ? { x: sign.x, y: sign.y, r: sign.r + 6 } : null;
      }
      // Une trouvaille de la plage prête, à l'écran d'abord (sinon la main ne se verrait pas) : le bois flotté, puis les
      // galets (deux bois et un galet : de quoi bâtir le feu de camp), la plus proche du centre de l'écran
      if (kind === 'trouvaille') {
        const off = c => {
          if (!this.geo) return 1;
          const s = this.toScreen(c.x, c.y);
          return s.x >= 0 && s.y >= 0 && s.x <= this.geo.width && s.y <= this.geo.height ? 0 : 1;
        };
        const ready = this.shownPickups.filter(p => !depositWait(p, this.clock - this.loadedAt)).map(p => {
          const g = this.ground(p.x, p.y);
          return { off: off(g), rank: GREVE_ORDER.indexOf(p.kind), d: Math.hypot(g.x - this.cam.x, g.y - this.cam.y), ...g };
        });
        const c = ready.sort((a, b) => a.off - b.off || a.rank - b.rank || a.d - b.d)[0];
        return c ? { x: c.x, y: c.y - 6, r: TW * 0.4 * DEPOSIT_SCALE } : null;
      }
      if (kind === 'cage') {
        const cage = (this.state.camp || []).find(item => item.art === 'cage_coincee');
        if (!cage) return null;
        const c = this.ground(cage.x, cage.y);
        return { x: c.x, y: c.y - TW * 0.3, r: TW * 0.45 };
      }
      // La bulle de faim d'une bête
      // La bulle d'un besoin d'un habitant (la toucher le comble)
      if (kind === 'besoin') {
        const bubble = (this.needBubbles || []).find(b => b.id === id && !b.visitor && !b.beast);
        return bubble ? { x: bubble.x, y: bubble.y, r: Math.max(16, bubble.r) } : null;
      }
      if (kind === 'faim') {
        const bubble = (this.needBubbles || []).find(b => b.beast && !b.ready);
        return bubble ? { x: bubble.x, y: bubble.y, r: Math.max(16, bubble.r) } : null;
      }
      return null;
    },
    // Son rectangle à l'écran (page) : { x, y, w, h }, ou null
    coachRect(name) {
      const at = this.coachWorld(name);
      const canvas = this.$refs.canvas;
      if (!at || !canvas || !this.geo) return null;
      const box = canvas.getBoundingClientRect();
      const p = this.toScreen(at.x, at.y);
      const r = Math.max(22, at.r * this.cam.s);
      return { x: box.left + p.x - r, y: box.top + p.y - r, w: 2 * r, h: 2 * r };
    },
    // La caméra va vers la cible, assez près pour la toucher (une cible pas encore dessinée : quelques essais)
    coachFocus(name, tries = 0) {
      const at = this.coachWorld(name);
      if (!at) {
        clearTimeout(this.focusTimer);
        if (tries < 10 && this.coachTarget === name) this.focusTimer = setTimeout(() => this.coachFocus(name, tries + 1), 300);
        return;
      }
      // (la caméra glisse jusque-là, sans sauter ; dans le tracé, à la taille du doigt)
      this.glideTo({ x: at.x, y: at.y + 20, s: Math.max(this.cam.s, this.roadMode ? ROAD_SCALE : 1.1) });
    }
  }
};
