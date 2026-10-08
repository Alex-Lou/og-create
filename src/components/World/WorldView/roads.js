// L'île : tracer ses chemins (choix de l'auteur, 8 oct. : l'île neuve n'a que son sentier, le joueur trace le reste).
// Le mode chemin : un doigt trace (les cases se suivent sous le doigt), deux doigts déplacent l'île ; un tracé qui part
// d'une case en attente la retire, la gomme efface les chemins déjà tracés. Le bandeau dit le compte (cases, offertes,
// pierres) ; « Tracer » envoie, le serveur décide (game/roads.js reprend ses règles pour l'aperçu). Les cases tracées
// se creusent sous les yeux (les 5 étapes de la bibliothèque, puis le chemin de terre). Mixin de WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { roadBlock, roadCost, stepCells, bigOf, joined, ringOf } from '@/game/roads';
import { landmarksShown } from '@/world/landmarks';
import { depositsShown } from '@/world/finds';
import { digFile, effectImage, pathImage } from '@/world/pathArt';
import { pathMask, pathGrass } from '@/world/terrain';
import { TW, TH } from '@/world/view/constants';

// Le creusement d'une case : 5 étapes de STAGE_MS, chaque case un peu après la précédente (STAGGER_MS)
const STAGE_MS = 130;
const STAGGER_MS = 70;
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
      if (mode.eraser) return mode.erase.length ? `${mode.erase.length} case${mode.erase.length > 1 ? 's' : ''} à effacer.` : 'Glisse le doigt sur tes chemins pour les effacer.';
      if (!mode.lay.length) return 'Glisse un doigt pour tracer ; deux doigts pour bouger l’île.';
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
      vibrate(6);
    },
    cancelRoad() {
      this.roadMode = null;
      this.roadRefused = null;
      this.draw(performance.now());
    },
    toggleEraser() {
      if (!this.roadMode) return;
      this.roadMode = { ...this.roadMode, eraser: !this.roadMode.eraser };
    },
    // Le doigt se pose : il trace (ou efface) ; posé sur une case en attente, il retire les cases qu'il parcourt
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
      this.draw(performance.now());
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
