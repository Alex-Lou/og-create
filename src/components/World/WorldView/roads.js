// L'île : tracer ses chemins (choix de l'auteur, 8 oct. : l'île neuve n'a que son sentier, le joueur trace le reste).
// Le mode chemin, comme les jeux de ferme sur téléphone (choix de l'auteur, 8 oct.) : un doigt qui glisse déplace
// l'île, comme partout ; un toucher pose une case (ou la retire) ; un appui long puis un glissé trace tout un trait
// (l'île défile seule quand le doigt approche du bord). L'île s'approche à l'ouverture, les cases voisines du tracé
// se montrent, ↶ retire la dernière case ; la gomme efface les chemins déjà tracés. Le bandeau dit le compte (cases,
// offertes, pierres) ; « Tracer » envoie, le serveur décide (game/roads.js reprend ses règles pour l'aperçu). Les
// cases tracées se creusent sous les yeux (les 5 étapes de la bibliothèque, puis le chemin de terre). Mixin de
// WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { roadBlock, roadCost, stepCells, bigOf, joined, ringOf, routeTo, pathGround } from '@/game/roads';
import { coach } from '@/game/coach';
import { landmarksShown } from '@/world/landmarks';
import { depositsShown } from '@/world/finds';
import { digFile, effectImage, pathImage } from '@/world/pathArt';
import { pathMask, pathGrass } from '@/world/terrain';
import { TW, TH } from '@/world/view/constants';

// Le creusement d'une case : 5 étapes de STAGE_MS, chaque case un peu après la précédente (STAGGER_MS)
const STAGE_MS = 130;
const STAGGER_MS = 70;
// L'appui long qui trace d'un trait (plus court que celui des bulles d'info : on veut tracer)
export const ROAD_HOLD_MS = 260;
// Le zoom du tracé : une case d'environ 80 × 40 px, assez grande pour le doigt
export const ROAD_SCALE = 1.25;
// Le bord qui fait défiler pendant un trait : sa largeur (px) et la vitesse au plus près du bord (px d'écran par ms)
const EDGE_PX = 52;
const EDGE_SPEED = 0.55;
const SIDES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const key = c => `${c.x},${c.y}`;

export default {
  data() {
    return {
      // Mode chemin : null, ou { lay: [{ x, y }], erase: [{ x, y }], eraser (la gomme) }
      roadMode: null,
      // Case refusée sous le doigt : { x, y, at }
      roadRefused: null
    };
  },
  created() {
    // Cases qui se creusent : [{ x, y, at (ms, performance.now) }] (non réactif : la boucle de dessin le vide)
    this.roadDigs = [];
  },
  computed: {
    // Ce que dit le serveur des chemins : { laid: [[x, y, offerte]], stone, free, max }
    roads() {
      return (this.state && this.state.roads) || { laid: [], stone: 1, free: 0, max: 80 };
    },
    roadLaid() {
      return new Set(this.roads.laid.map(([x, y]) => `${x},${y}`));
    },
    // Cases où rien ne se trace (en plus du sol et des quartiers) : bâtiments (leur grande emprise), lieux, gisements,
    // annexes, créations, camp
    roadTaken() {
      const out = new Set();
      const state = this.state;
      if (!state) return out;
      const rect = r => { for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.add(`${x},${y}`); };
      state.sites.forEach(site => rect(bigOf(site)));
      (state.camp || []).forEach(c => rect({ x: c.x, y: c.y, w: c.w, h: c.h }));
      [...landmarksShown(state), ...depositsShown(state), ...(state.annexes || []), ...this.crafted].forEach(c => out.add(key(c)));
      return out;
    },
    roadCtx() {
      return {
        ground: (x, y) => (this.M ? this.M.ground(x, y) : null),
        owned: (x, y) => Boolean(this.zoneAt(x, y) && this.zoneAt(x, y).owned),
        taken: this.roadTaken
      };
    },
    roadPrice() {
      const mode = this.roadMode;
      return mode ? roadCost(mode.lay, mode.erase, this.roads.laid, this.roads.free) : { offered: 0, stone: 0, back: 0 };
    },
    // Le bandeau : ce que fait le doigt, puis le compte
    roadBanner() {
      const mode = this.roadMode;
      if (!mode) return '';
      if (mode.eraser) return mode.erase.length ? `${mode.erase.length} case${mode.erase.length > 1 ? 's' : ''} à effacer.` : 'Touche tes chemins pour les effacer.';
      if (!mode.lay.length) return 'Touche une case pour y poser un chemin. Appui long puis glisse : tout un trait.';
      const { offered, stone } = this.roadPrice;
      const parts = [`${mode.lay.length} case${mode.lay.length > 1 ? 's' : ''}`];
      if (offered) parts.push(`${offered} offerte${offered > 1 ? 's' : ''}`);
      if (stone) parts.push(`${stone} pierre${stone > 1 ? 's' : ''}`);
      return parts.join(' · ');
    },
    // Le tracé en attente relie-t-il le Puits au Feu (la quête du premier chemin ; le coach montre alors « Tracer ») ?
    roadLinked() {
      const mode = this.roadMode;
      if (!mode || !mode.lay.length || !this.state || !this.M) return false;
      const built = id => this.state.sites.find(s => s.id === id && s.level > 0);
      const pending = new Set(mode.lay.map(key));
      return joined((x, y) => (pending.has(`${x},${y}`) ? 'p' : this.M.ground(x, y)), built('puits'), built('foyer'));
    },
    // Où commencer le premier chemin : la case libre contre le Puits la plus proche du Feu (la main du coach), ou null
    roadStart() {
      if (!this.state || !this.M) return null;
      const puits = this.state.sites.find(s => s.id === 'puits' && s.level > 0);
      const foyer = this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      if (!puits || !foyer) return null;
      const to = { x: foyer.x + foyer.w / 2, y: foyer.y + foyer.h / 2 };
      const ok = ringOf(puits).filter(c => !roadBlock(c.x, c.y, this.roadCtx));
      return ok.sort((a, b) => Math.hypot(a.x - to.x, a.y - to.y) - Math.hypot(b.x - to.x, b.y - to.y))[0] || null;
    },
    // La leçon du premier chemin : les cases conseillées, celles qui manquent pour relier le Puits au Feu (en passant
    // par le sentier et le tracé en attente, gratuits), en pointillés dorés ; la main du coach montre la première. []
    // hors de cette leçon
    roadGuide() {
      const mode = this.roadMode;
      const lesson = coach.state.lesson;
      if (!mode || mode.eraser || !lesson || lesson.id !== 'quest-chemin' || !this.state || !this.M || this.roadLinked) return [];
      const foyer = this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      const puits = this.state.sites.find(s => s.id === 'puits' && s.level > 0);
      if (!foyer || !puits) return [];
      const pending = new Set(mode.lay.map(key));
      const cost = (x, y) => (pending.has(`${x},${y}`) || pathGround(this.M.ground(x, y)) ? 0 : roadBlock(x, y, this.roadCtx) ? Infinity : 1);
      const ring = new Set(ringOf(foyer).map(key));
      const route = routeTo(ringOf(puits), (x, y) => ring.has(`${x},${y}`), cost);
      return route ? route.filter(c => cost(c.x, c.y) === 1) : [];
    },
    // Où le coach pose la main dans le tracé : la prochaine case conseillée, sinon la dernière posée, sinon le départ
    roadHint() {
      const mode = this.roadMode;
      if (!mode) return null;
      return this.roadGuide[0] || mode.lay[mode.lay.length - 1] || this.roadStart;
    },
    // Assez de pierres (celles qu'un effacement rend comptent) ; quelque chose à envoyer
    roadReady() {
      const mode = this.roadMode;
      if (!mode || (!mode.lay.length && !mode.erase.length)) return false;
      return this.roadPrice.stone <= ((this.state && this.state.stock.stone) || 0) + ((this.state && this.state.pendingStock && this.state.pendingStock.stone) || 0) + this.roadPrice.back;
    }
  },
  methods: {
    startRoad() {
      if (!this.state || this.busy) return;
      this.site = null;
      this.questOpen = false;
      this.craftMenu = null;
      this.dropPick();
      this.roadMode = { lay: [], erase: [], eraser: false };
      // L'île s'approche : des cases à la taille du doigt (pendant la leçon du premier chemin, vers sa première case)
      const hint = this.roadGuide[0];
      const at = hint ? this.ground(hint.x, hint.y) : this.cam;
      if (this.cam && (hint || this.cam.s < ROAD_SCALE)) this.glideTo({ x: at.x, y: at.y, s: Math.max(this.cam.s, ROAD_SCALE) });
      vibrate(6);
    },
    cancelRoad() {
      this.roadEnd();
      this.roadMode = null;
      this.roadRefused = null;
      this.drawSoon();
    },
    // ↶ : la dernière case posée (ou marquée à effacer) est retirée
    undoRoad() {
      const mode = this.roadMode;
      if (!mode) return;
      const list = mode.eraser ? mode.erase : mode.lay;
      if (!list.length) return;
      list.pop();
      vibrate(4);
      this.drawSoon();
    },
    toggleEraser() {
      if (!this.roadMode) return;
      this.roadMode = { ...this.roadMode, eraser: !this.roadMode.eraser };
    },
    // Un toucher : la case se pose, ou se retire si elle attendait déjà (la gomme : marquée à effacer, ou plus). Une
    // case refusée dit pourquoi
    roadTap(px, py) {
      const tile = this.tileAt(px, py);
      const mode = this.roadMode;
      if (!tile || !mode) return;
      const k = key(tile);
      const list = mode.eraser ? mode.erase : mode.lay;
      if (list.some(e => key(e) === k)) {
        if (mode.eraser) mode.erase = mode.erase.filter(e => key(e) !== k);
        else mode.lay = mode.lay.filter(e => key(e) !== k);
        vibrate(3);
      } else if (mode.eraser) {
        if (this.roadLaid.has(k)) this.roadTouch(tile, false);
        else this.roadNo(tile, px, py, 'Touche un chemin que tu as tracé pour l’effacer.');
      } else {
        const why = roadBlock(tile.x, tile.y, this.roadCtx);
        if (why) this.roadNo(tile, px, py, why);
        else if (mode.lay.length >= this.roads.max) this.roadNo(tile, px, py, `Un tracé fait au plus ${this.roads.max} cases : touche « Tracer », puis continue.`);
        else this.roadTouch(tile, false);
      }
      this.drawSoon();
    },
    roadNo(tile, px, py, text) {
      this.roadRefused = { x: tile.x, y: tile.y, at: performance.now() };
      this.showTip(px, py, { title: 'Pas ici', text });
      vibrate([6, 30, 6]);
    },
    // L'appui long : le doigt trace d'un trait (ou efface) ; posé sur une case en attente, il retire les cases qu'il
    // parcourt. gesture : le geste en cours (gestures.js)
    roadHold(gesture) {
      if (!gesture || gesture !== this.gesture || !this.roadMode || this.pointers.size !== 1) return;
      gesture.road = this.roadDown(gesture.start.x, gesture.start.y);
      gesture.held = true;
      vibrate(14);
      this.drawSoon();
    },
    // Le doigt se pose pour un trait : il trace (ou efface) ; posé sur une case en attente, il retire
    roadDown(px, py) {
      const tile = this.tileAt(px, py);
      if (!tile) return null;
      const mode = this.roadMode;
      const removing = !mode.eraser && mode.lay.some(c => c.x === tile.x && c.y === tile.y);
      this.roadTouch(tile, removing);
      return { last: tile, removing };
    },
    roadMove(trace, px, py) {
      const tile = this.tileAt(px, py);
      if (!tile || (tile.x === trace.last.x && tile.y === trace.last.y)) return;
      for (const c of stepCells(trace.last, tile)) this.roadTouch(c, trace.removing);
      trace.last = tile;
      this.drawSoon();
    },
    // Pendant un trait, le doigt près du bord : l'île défile vers lui (une image après l'autre, tant qu'il y reste)
    roadEdge(p) {
      this.edgeAt = p;
      if (this.edgeRaf) return;
      this.edgeTime = 0;
      this.edgeRaf = requestAnimationFrame(now => this.roadEdgeStep(now));
    },
    roadEdgeStep(now) {
      this.edgeRaf = 0;
      const gesture = this.gesture;
      const p = this.edgeAt;
      if (!gesture || !gesture.road || !this.roadMode || !p || !this.geo) return;
      const push = (v, size) => (v < EDGE_PX ? v / EDGE_PX - 1 : v > size - EDGE_PX ? 1 - (size - v) / EDGE_PX : 0);
      const dx = push(p.x, this.geo.width);
      const dy = push(p.y, this.geo.height);
      if (!dx && !dy) return;
      const dt = this.edgeTime ? Math.min(48, now - this.edgeTime) : 16;
      this.edgeTime = now;
      this.cam.x += (dx * EDGE_SPEED * dt) / this.cam.s;
      this.cam.y += (dy * EDGE_SPEED * dt) / this.cam.s;
      this.clampCam();
      // (sous le doigt immobile, l'île a bougé : les cases qu'il survole maintenant se tracent)
      this.roadMove(gesture.road, p.x, p.y);
      this.drawSoon();
      this.edgeRaf = requestAnimationFrame(t => this.roadEdgeStep(t));
    },
    // Le trait s'arrête (doigt levé, second doigt, mode quitté)
    roadEnd() {
      cancelAnimationFrame(this.edgeRaf);
      this.edgeRaf = 0;
      this.edgeAt = null;
    },
    roadTouch(c, removing) {
      const mode = this.roadMode;
      const k = key(c);
      if (mode.eraser) {
        if (this.roadLaid.has(k) && !mode.erase.some(e => key(e) === k)) mode.erase.push({ x: c.x, y: c.y });
        return;
      }
      if (removing) {
        mode.lay = mode.lay.filter(e => key(e) !== k);
        return;
      }
      if (mode.lay.some(e => key(e) === k)) return;
      if (mode.lay.length >= this.roads.max) return;
      if (roadBlock(c.x, c.y, this.roadCtx)) {
        this.roadRefused = { x: c.x, y: c.y, at: performance.now() };
        return;
      }
      mode.lay.push({ x: c.x, y: c.y });
      vibrate(3);
    },
    async confirmRoad() {
      const mode = this.roadMode;
      if (!mode || !this.roadReady || this.busy) return;
      this.busy = true;
      try {
        const lay = mode.lay.map(c => [c.x, c.y]);
        const erase = mode.erase.map(c => [c.x, c.y]);
        const { world } = await playService.worldPaths(lay, erase);
        const now = performance.now();
        this.roadMode = null;
        this.apply(world);
        // Les cases tracées se creusent, l'une après l'autre (pas en mouvement réduit)
        if (!this.reduced()) this.roadDigs = mode.lay.map((c, i) => ({ x: c.x, y: c.y, at: now + i * STAGGER_MS }));
        vibrate([10, 30, 14]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le chemin n’a pas pu être tracé.'));
      } finally {
        this.busy = false;
      }
    },
    // L'aperçu du tracé (au-dessus du sol) : cases en attente en terre claire, cases à effacer barrées, case refusée
    // en rouge un instant ; puis le creusement des cases tracées
    drawRoads(ctx, t, s) {
      const now = performance.now();
      const mode = this.roadMode;
      if (mode) {
        ctx.lineJoin = 'round';
        for (const c of mode.lay) {
          const p = this.ground(c.x, c.y);
          this.diamond(ctx, p.x, p.y, TW * 0.92, TH * 0.92);
          ctx.fillStyle = 'rgba(214, 178, 122, .82)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(92, 56, 12, .7)';
          ctx.lineWidth = 2.6 / s;
          ctx.stroke();
          ctx.strokeStyle = '#FFD45E';
          ctx.lineWidth = 1.4 / s;
          ctx.stroke();
        }
        for (const c of mode.erase) {
          const p = this.ground(c.x, c.y);
          this.diamond(ctx, p.x, p.y, TW * 0.9, TH * 0.9);
          ctx.fillStyle = 'rgba(226, 87, 74, .35)';
          ctx.fill();
          ctx.strokeStyle = '#E2574A';
          ctx.lineWidth = 2 / s;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x - TW * 0.18, p.y - TH * 0.18);
          ctx.lineTo(p.x + TW * 0.18, p.y + TH * 0.18);
          ctx.moveTo(p.x + TW * 0.18, p.y - TH * 0.18);
          ctx.lineTo(p.x - TW * 0.18, p.y + TH * 0.18);
          ctx.stroke();
        }
        // Les cases conseillées (la leçon du premier chemin) en pointillés dorés qui battent ; sinon, les cases libres
        // autour de la dernière posée, d'un point doré
        const beat = 0.55 + 0.45 * Math.sin(t * 5);
        if (this.roadGuide.length) {
          ctx.save();
          ctx.setLineDash([5 / s, 4 / s]);
          ctx.strokeStyle = `rgba(255, 212, 94, ${beat.toFixed(3)})`;
          ctx.lineWidth = 2 / s;
          for (const c of this.roadGuide) {
            const p = this.ground(c.x, c.y);
            this.diamond(ctx, p.x, p.y, TW * 0.78, TH * 0.78);
            ctx.stroke();
          }
          ctx.restore();
        } else if (!mode.eraser && mode.lay.length) {
          const last = mode.lay[mode.lay.length - 1];
          ctx.fillStyle = `rgba(255, 212, 94, ${(0.45 + 0.4 * beat).toFixed(3)})`;
          for (const [dx, dy] of SIDES) {
            const x = last.x + dx;
            const y = last.y + dy;
            if (mode.lay.some(e => e.x === x && e.y === y) || roadBlock(x, y, this.roadCtx)) continue;
            const p = this.ground(x, y);
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, 4 / s + 2, (4 / s + 2) * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        const no = this.roadRefused;
        if (no && now - no.at < 500) {
          const p = this.ground(no.x, no.y);
          this.diamond(ctx, p.x, p.y, TW, TH);
          ctx.strokeStyle = `rgba(226, 87, 74, ${(1 - (now - no.at) / 500).toFixed(3)})`;
          ctx.lineWidth = 2.4 / s;
          ctx.stroke();
        }
      }
      if (!this.roadDigs.length || !this.M) return;
      const left = [];
      for (const dig of this.roadDigs) {
        const ms = now - dig.at;
        if (ms >= 5 * STAGE_MS + 400) continue;
        left.push(dig);
        const p = this.ground(dig.x, dig.y);
        // Avant son tour, la case garde son herbe ; puis les étapes, jusqu'au chemin de terre (déjà peint dessous)
        const stage = ms < 0 ? 0 : Math.floor(ms / STAGE_MS) + 1;
        if (stage <= 5) {
          const img = stage ? pathImage(digFile(stage, pathMask(this.M, dig.x, dig.y)), pathGrass(this.M, dig.x, dig.y)) : null;
          this.diamond(ctx, p.x, p.y, TW, TH);
          ctx.save();
          ctx.clip();
          if (img) ctx.drawImage(img, p.x - TW / 2, p.y - TH / 2, TW, TH);
          else {
            ctx.fillStyle = pathGrass(this.M, dig.x, dig.y);
            ctx.fill();
          }
          ctx.restore();
        }
        // Les mottes au coup de bêche, la poussière à la fin
        const fx = ms >= 0 && ms < 360 ? effectImage('mottes', ms) : ms >= 5 * STAGE_MS ? effectImage('poussiere', ms - 5 * STAGE_MS) : null;
        if (fx) ctx.drawImage(fx, p.x - TW / 2, p.y - TH / 2 - 16, TW, TH * 1.5);
      }
      this.roadDigs = left;
    }
  }
};
