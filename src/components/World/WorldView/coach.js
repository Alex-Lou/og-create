// L'île et le coach du tutoriel (game/coach.js) : elle dit où sont ses cibles à l'écran (Brume, un bâtiment, un
// habitant, le panneau d'un quartier, ce que la mer a rendu sur la plage de Brumelune, la caisse de Lorena, une case
// dorée, une création posée, la cage aux poules, une bête qui a faim). La caméra ne va plus d'elle-même vers la cible
// (choix de l'auteur, 11 oct. : un « ! » la marque, une flèche au bord si elle est hors de vue : draw/marks.js) ; « Me
// montrer » l'y mène. Seule exception : un nouveau venu, vers qui elle glisse une fois (NEWCOMERS). Mixin de WorldView.vue.

import { coach } from '@/game/coach';
import { BARRAGE } from '@/game/prologue';
import { guide } from '@/game/guide';
import { TW, DEPOSIT_SCALE } from '@/world/view/constants';
import { BRUME_ALT, BRUME_REACH } from '@/world/brume';
import { depositWait } from '@/world/finds';
import { ROAD_SCALE } from './roads';

// L'ordre où le coach montre ce que la mer a rendu
const GREVE_ORDER = ['bois', 'galet', 'coquillage'];
// Un nouveau venu paraît (Lorena dans l'eau, Jovin qui sort de la brume, Pierrot endormi sur sa planche) : la caméra
// glisse une fois vers lui, puis le « ! » prend le relais (choix de l'auteur, 13 oct. : on voit qui arrive). Leçon → sa
// cible
const NEWCOMERS = { 'quest-aster-eau': 'habitant:ponton', 'quest-rivet-brume': 'habitant:atelier', 'quest-eveil-ondin': 'habitant:puits' };

export default {
  computed: {
    // La cible de la leçon sur l'île (« site:puits »…), ou null
    coachTarget() {
      const lesson = coach.state.lesson;
      return lesson && lesson.target && lesson.target.startsWith('île:') ? lesson.target.slice(4) : null;
    },
    coachLessonId() {
      return coach.state.lesson ? coach.state.lesson.id : null;
    },
    // La leçon refermée d'une croix (game/coach.js : close) : le « ! » du suivi des quêtes la rappelle
    coachHidden() {
      return Boolean(coach.state.lesson && coach.state.hidden === coach.state.lesson.id);
    },
    // Ce que regarde la réplique en cours (texts/tutorial/scenes.js : look), ou null
    guideLook() {
      const line = guide.current;
      return (line && line.look) || null;
    }
  },
  watch: {
    // (une fois par visite, et jamais si son geste a déjà été fait)
    coachLessonId(id) {
      if (!NEWCOMERS[id] || coach.state.seen.has(id) || (this.greeted && this.greeted.has(id))) return;
      this.greeted = new Set([...(this.greeted || []), id]);
      this.coachFocus(NEWCOMERS[id]);
    },
    // Une réplique qui montre quelque chose (la longue-vue de Lorena : l'îlot, puis son chantier) : la caméra y glisse ;
    // l'îlot, de plus loin, pour qu'on le voie au large (pas avant que la caméra existe : une réplique déjà affichée quand
    // l'île se monte, les bouteilles d'après le tutoriel, cassait tout le rendu de l'île)
    guideLook(name) {
      this.lookAt(name);
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
    // Le « ! » : la leçon revient, la caméra va vers sa cible
    recallLesson() {
      coach.recall();
    },
    // La caméra glisse vers ce que montre une réplique (name : une cible de l'île, coachWorld), si l'île est là
    lookAt(name) {
      const at = name && this.cam && this.coachWorld(name);
      if (at) this.glideTo({ x: at.x, y: at.y + 20, s: name === 'ilot' ? Math.min(this.cam.s, 0.55) : Math.max(this.cam.s, 1.1) });
    },
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
      // L'Îlot aux Mouettes, au large (la longue-vue de Lorena) : le milieu de ses terres
      if (kind === 'ilot') {
        const cells = this.islets && this.islets.colony;
        if (!cells || !cells.length) return null;
        const c = this.ground(cells.reduce((t, p) => t + p.x, 0) / cells.length, cells.reduce((t, p) => t + p.y, 0) / cells.length);
        return { x: c.x, y: c.y, r: TW };
      }
      // Le passage des égarés vers le camp de Lorena, où se plantent ses piquets (game/prologue.js : BARRAGE)
      if (kind === 'barrage') {
        const c = this.ground(BARRAGE.reduce((t, p) => t + p.x, 0) / BARRAGE.length, BARRAGE.reduce((t, p) => t + p.y, 0) / BARRAGE.length);
        return { x: c.x, y: c.y, r: TW };
      }
      // La bouteille échouée sur une plage (draw/life.js : bottleSpotOf)
      if (kind === 'bouteille') {
        if (!this.bottleSpot) return null;
        const c = this.ground(this.bottleSpot.x + 0.5, this.bottleSpot.y + 0.5);
        return { x: c.x, y: c.y - 6, r: 14 };
      }
      // La caisse de Lorena, échouée près du camp (les caisses repêchées du camp)
      if (kind === 'caisse') {
        const crate = (this.state.camp || []).find(item => item.art === 'caisses');
        if (!crate) return null;
        const c = this.ground(crate.x, crate.y);
        return { x: c.x, y: c.y - TW * 0.25, r: TW * 0.4 };
      }
      // Un coin du camp (« coin:cannelle » : sa cuisine, son abri)
      if (kind === 'coin') {
        const corner = (this.state.camp || []).find(item => item.id === id);
        if (!corner) return null;
        const c = this.ground(corner.x + (corner.w - 1) / 2, corner.y + (corner.h - 1) / 2);
        return { x: c.x, y: c.y - TW * 0.3, r: TW * 0.6 };
      }
      // Le trait de l'enclos (leçon des clôtures) : la première case de l'anneau qui n'est pas encore dans le trait, d'où
      // le doigt part (pendant la pose d'une création qui se trace)
      if (kind === 'trace') {
        if (!this.lineCraft) return null;
        const cells = this.craftTrace ? this.craftTrace.cells : [];
        const next = this.enclos.find(sp => !cells.some(c => c.x === sp.x && c.y === sp.y));
        if (!next) return null;
        const g = this.ground(next.x, next.y);
        return { x: g.x, y: g.y, r: TW * 0.42 };
      }
      // Pendant une pose ou un déplacement : pour une création, la case dorée que la vue regarde (celle que la caméra a
      // cadrée : workshop.js, focusOnSpots ; les trois torches de Jovin sont loin l'une de l'autre) ; pour une annexe (le
      // poulailler, le jour de Marcelle), la plus proche de son coin, sinon du Feu (le camp)
      if (kind === 'pose') {
        const foyer = this.state.sites.find(s => s.id === 'foyer');
        const corner = this.annexPlacing && (this.state.camp || []).find(item => item.id === 'cannelle');
        let spots = this.poseSpots(this.craftPlacing ? this.craftSpots : this.annexPlacing ? this.annexSpots : []);
        // (une annexe : côté terre, jamais plus bas que le Feu vers la mer, s'il y a de la place ; choix de l'auteur, 13 oct.)
        const inland = this.annexPlacing && foyer ? spots.filter(sp => sp.y < foyer.y + foyer.h) : [];
        if (inland.length) spots = inland;
        if (!spots.length) return null;
        const to = corner || (foyer ? { x: foyer.x + foyer.w / 2, y: foyer.y + foyer.h / 2 } : spots[0]);
        const far = this.craftPlacing
          ? spot => { const g = this.ground(spot.x, spot.y); return Math.hypot(g.x - this.cam.x, g.y - this.cam.y); }
          : spot => Math.hypot(spot.x - to.x, spot.y - to.y);
        const sp = spots.reduce((a, b) => (far(b) < far(a) ? b : a));
        const g = this.ground(sp.x, sp.y);
        return { x: g.x, y: g.y, r: TW * 0.42 };
      }
      // Une création posée de cette sorte (la plus proche du centre de la vue)
      if (kind === 'creation') {
        const mine = this.crafted.filter(c => c.craft === id).map(c => ({ c, g: this.ground(c.x, c.y) }));
        if (!mine.length) return null;
        const { g } = mine.reduce((a, b) => (Math.hypot(b.g.x - this.cam.x, b.g.y - this.cam.y) < Math.hypot(a.g.x - this.cam.x, a.g.y - this.cam.y) ? b : a));
        return { x: g.x, y: g.y - TW * 0.3, r: TW * 0.45 };
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
      // (hors de l'écran, ni l'habitant ni le panneau ne sont dessinés : la caméra va vers son bâtiment, vers la place du
      // panneau ; la main se pose sur eux quand ils paraissent)
      if (kind === 'habitant') {
        const hit = (this.landHits || []).find(h => h.key === `vil:${id}`);
        if (hit) return { x: hit.x, y: hit.y - 6, r: Math.max(18, hit.r) };
        const home = this.state.sites.find(s => s.id === id && !s.hidden);
        if (!home) return null;
        const c = this.centerOf(home);
        return { x: c.x, y: c.y, r: TW * 0.45 };
      }
      if (kind === 'quartier') {
        const sign = (this.signs || []).find(sg => sg.zone && sg.zone.id === id);
        if (sign) return { x: sign.x, y: sign.y, r: sign.r + 6 };
        const zone = this.state.map.zones.find(z => z.id === id && !z.owned);
        const at = zone && this.signPlaceOf(zone);
        if (!at) return null;
        const c = this.ground(at.x, at.y);
        return { x: c.x, y: c.y - 30, r: 26 };
      }
      // Une trouvaille de la plage prête (« trouvaille:coquillage » : de cette sorte), à l'écran d'abord (sinon la main ne se verrait pas) : le bois flotté, puis les
      // galets (deux bois et un galet : de quoi bâtir le feu de camp), la plus proche du centre de l'écran
      if (kind === 'trouvaille') {
        const off = c => {
          if (!this.geo) return 1;
          const s = this.toScreen(c.x, c.y);
          return s.x >= 0 && s.y >= 0 && s.x <= this.geo.width && s.y <= this.geo.height ? 0 : 1;
        };
        const ready = this.shownPickups.filter(p => (!id || p.kind === id) && !depositWait(p, this.clock - this.loadedAt)).map(p => {
          const g = this.ground(p.x, p.y);
          return { off: off(g), rank: GREVE_ORDER.indexOf(p.kind), d: Math.hypot(g.x - this.cam.x, g.y - this.cam.y), ...g };
        });
        const c = ready.sort((a, b) => a.off - b.off || a.rank - b.rank || a.d - b.d)[0];
        return c ? { x: c.x, y: c.y - 6, r: TW * 0.4 * DEPOSIT_SCALE } : null;
      }
      // Une poule échappée (le jour de Marcelle : hens.js), la plus proche du centre de la vue ; id : laquelle
      if (kind === 'poule') {
        const loose = (this.landHits || []).filter(h => h.who && this.looseHens.has(h.who.beast));
        if (!loose.length) return null;
        const h = loose.reduce((a, b) => (Math.hypot(b.x - this.cam.x, b.y - this.cam.y) < Math.hypot(a.x - this.cam.x, a.y - this.cam.y) ? b : a));
        return { x: h.x, y: h.y, r: Math.max(16, h.r), id: h.who.beast };
      }
      // La planche de Pierrot, là où elle s'échoue (castaways.js : entranceOf)
      if (kind === 'planche') {
        const spot = this.entranceOf(this.state, 'puits');
        if (!spot) return null;
        const c = this.ground(spot.x, spot.y);
        return { x: c.x, y: c.y - TW * 0.2, r: TW * 0.45 };
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
      // Une case de l'île (« case:x:y » : un lieu, un gisement, une terre à explorer ; world/questPoint.js)
      if (kind === 'case') {
        const [, x, y] = name.split(':').map(Number);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        const g = this.ground(x, y);
        return { x: g.x, y: g.y - TW * 0.2, r: TW * 0.45 };
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
