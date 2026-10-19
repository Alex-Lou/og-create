// La boucle d'animation et le dessin d'une image de l'île : le sol, la mer, ce qui se tient debout trié par profondeur,
// le relief qui cache le pied, la case sous un point du monde. Méthodes de WorldView.vue (this : le composant), réunies
// par draw.js.

import { wetnessAt, SOMMET, creteDe } from '@/world/lumiere';
import { drawSprite, drawSpriteIn, imageOf } from '@/world/spriteCache';
import { flyingGull } from '@/world/beastArt';
import { drawCell, SEA_Z, HS, worldOf, CELL_BELOW, CELL_ABOVE_MAX } from '@/world/terrain';
import { qualiteSuivante, setQualiteFx } from '@/world/perf';
import { TW, TH, FRAME_DOIGT_MS } from '../constants';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
// Pendant son chargement (loading.js), l'île, cachée par l'écran de chargement, ne se dessine que pour compter ses
// dessins : quatre fois par seconde, et le fil principal va à la lecture des dessins (redessiner l'île cachée à chaque
// image en prenait près de la moitié sur un téléphone lent)
const LOADING_FRAME_MS = 250;

// Pendant une pose : ce qui se tient devant une case dorée (jusqu'à tant de rangs plus près, et tant de colonnes de côté)
// ne garde que tant d'opacité
const XRAY_DEPTH = 6;
const XRAY_SIDE = 2;



export default {
  /* ---------- Boucle et dessin ---------- */
  syncLoop() {
    // (un jeu par-dessus l'île : la Récolte, un mini-jeu, la chasse aux poules, la marmite ; ou une scène plein écran :
    // l'île, cachée, ne se redessine pas, sauf pour finir de se charger : elle compte ses dessins en se dessinant,
    // quatre fois par seconde, loading.js)
    const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run && !this.gameId && !this.henChase && !this.cooking && !this.bestiaryOpen && (!this.covered || this.loadingSince);
    if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
    if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  },
  frame(now) {
    this.raf = 0;
    if (now - this.lastFrame >= (this.loadingSince ? LOADING_FRAME_MS : FRAME_MS)) {
      this.drawTimed(now);
    }
    this.syncLoop();
  },
  // Un dessin de l'île, mesuré (la boucle, le doigt, l'élan) : la qualité des particules suit ce qu'il a coûté sur cet
  // appareil (perf.js : qualiteSuivante), et le compteur « ?perf » le compte
  drawTimed(now) {
    this.lastFrame = now;
    const start = performance.now();
    this.draw(now);
    const ms = performance.now() - start;
    this.fxQ = qualiteSuivante(this.fxQ, ms);
    setQualiteFx(this.fxQ);
    if (this.perf) {
      this.perf.frame(now, ms);
      const text = this.perf.text(now, this.cam ? this.cam.s : 0, this.fxQ);
      if (text) this.perfText = text;
    }
  },
  // Le doigt bouge (glisser, pincer, zoomer, tracer) : un seul dessin à l'image suivante, quel que soit le nombre
  // d'événements du doigt d'ici là (un écran tactile en envoie plusieurs par image : chacun redessinait toute l'île)
  drawSoon() {
    // (une minuterie qui finit après le départ de l'île ne redessine rien : fêtes et petits gestes en mouvement réduit)
    if (this.soonRaf || this.gone) return;
    this.soonRaf = requestAnimationFrame(now => {
      this.soonRaf = 0;
      // (trop tôt après le dernier dessin : à l'image suivante, avec ce que le doigt aura fait d'ici là)
      if (now - this.lastFrame < FRAME_DOIGT_MS) this.drawSoon();
      else this.drawTimed(now);
    });
  },
  // Un dessin vient d'arriver : l'île sera redessinée à l'image suivante, une seule fois pour tous ceux qui arrivent
  // ensemble, et seulement si la boucle ne tourne pas déjà (mouvement réduit). Un redessin complet par dessin lu, tout
  // de suite, faisait des centaines de dessins de l'île pendant son chargement. Sous une scène plein écran, rien : l'île
  // se redessine quand elle sort (WorldView : covered)
  repaintSoon() {
    if (this.raf || this.repaintRaf || this.covered) return;
    this.repaintRaf = requestAnimationFrame(() => {
      this.repaintRaf = 0;
      this.draw(performance.now());
    });
  },
  diamond(ctx, cx, cy, w, h) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - h / 2);
    ctx.lineTo(cx + w / 2, cy);
    ctx.lineTo(cx, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy);
    ctx.closePath();
  },
  // La grille des cases (« ?grid ») : un numéro par case, depuis la plage (l'épave), et son (x, y) en petit dessous.
  // Les cases encore sous la brume restent muettes.
  gridNumbers() {
    if (this._gridNumbers) return this._gridNumbers;
    const n = this.state.size, M = this.M;
    const numbers = new Map();
    const seen = new Set();
    // L'épave de l'Hirondelle (le camp, où le naufragé débarque) : la plage, numéro 1
    const queue = [[96, 96]];
    seen.add(96 * n + 96);
    let num = 1;
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      numbers.set(y * n + x, num++);
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        if (!M.land(nx, ny) && M.ground(nx, ny) !== 'b') continue;
        const k = ny * n + nx;
        if (!seen.has(k)) { seen.add(k); queue.push([nx, ny]); }
      }
    }
    this._gridNumbers = numbers;
    return numbers;
  },

  drawGrid(ctx, view) {
    const n = this.state.size, M = this.M;
    const numbers = this.gridNumbers();
    const side = TW / 2 + 2;
    const umin = Math.floor(((view.x - side) * 2) / TW) + 1, umax = Math.ceil(((view.x + view.w + side) * 2) / TW) - 1;
    const dmin = Math.max(0, Math.floor(((view.y - CELL_BELOW) * 2) / TH) + 1), dmax = Math.min(2 * n - 2, Math.ceil(((view.y + view.h + CELL_ABOVE_MAX) * 2) / TH) - 1);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let d = dmin; d <= dmax; d++) {
      const xa = Math.max(0, d - n + 1, Math.ceil((d + umin) / 2)), xb = Math.min(n - 1, d, Math.floor((d + umax) / 2));
      for (let x = xa; x <= xb; x++) {
        const y = d - x;
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        if (this.hiddenCell(x, y)) continue;
        const c = worldOf(x, y, M.height(x, y));
        const num = numbers.get(y * n + x);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(16, 18, 28, .7)';
        ctx.font = '800 12px ui-rounded, Nunito, sans-serif';
        ctx.strokeText(String(num), c.x, c.y - 4);
        ctx.fillStyle = '#FFF6D8';
        ctx.fillText(String(num), c.x, c.y - 4);
        ctx.font = '600 7px ui-rounded, Nunito, sans-serif';
        ctx.strokeText(`${x},${y}`, c.x, c.y + 6);
        ctx.fillStyle = 'rgba(255, 255, 255, .75)';
        ctx.fillText(`${x},${y}`, c.x, c.y + 6);
      }
    }
  },

  draw(now) {
    const canvas = this.$refs.canvas;
    if (!canvas || !this.geo || !this.state || !this.cam) return;
    const { ctx, width, height, dpr, s, t, date, phase, orage, flash, fetes, view, arc, arcGeo, ciel, file } = this.prepareFrame({ now, canvas });
    const { water, agite, bancs, phare, phareSeen, geant, kraken, apercu } = this.drawSeaPass({ now, ctx, s, t, date, phase, orage, view, arc, arcGeo, ciel, file });
    const { near, baked, missing, wet, rainK, life, golden } = this.drawGroundPass({ now, ctx, dpr, s, t, date, phase, flash, view, arc, water, agite, geant, kraken });
    const { worldTransform, seenAt, seen, repaint, climatOf, climats, effets } = this.drawStandingPass({ now, ctx, s, t, date, phase, orage, fetes, view, phare, phareSeen, near, baked, wet, life, golden });
    const { sources, brume, vue } = this.drawSkyPass({ now, ctx, width, height, dpr, s, t, date, phase, orage, flash, view, arc, arcGeo, ciel, file, phare, kraken, apercu, rainK, life, worldTransform, climatOf, climats });
    this.drawGlowPass({ now, ctx, s, t, phase, fetes, view, water, bancs, geant, kraken, near, life, seenAt, repaint, climatOf, climats, effets, sources, vue });
    this.drawOverlayPass({ now, ctx, dpr, s, t, fetes, missing, seen, repaint, brume });
  },
  // Le mouillé du sol à cette date (averse.js : la pluie des trois dernières heures), recalculé une fois par minute
  // La crête des plus hauts sommets de l'île, qui porte l'aurore (lumiere/aurore.js : creteDe), une fois par île
  creteAurore() {
    if (!this.aurore || this.aurore.M !== this.M) {
      const points = [];
      for (let y = 0; y < this.M.n; y++) for (let x = 0; x < this.M.n; x++) if (this.M.height(x, y) >= SOMMET) points.push(this.ground(x, y));
      this.aurore = { M: this.M, crete: creteDe(points) };
    }
    return this.aurore.crete;
  },
  wetOf(date) {
    const minute = Math.floor(date.getTime() / 60000);
    if (!this.wet || this.wet.minute !== minute) this.wet = { minute, value: wetnessAt(date, d => this.skyAt(d).weather.rain) };
    return this.wet.value;
  },
  // Panneau d'un quartier pas encore à soi : caché tant qu'il est sous la brume épaisse (world/reveal.js)
  signShown(zone) {
    return !this.zoneThick(zone);
  },
  // Mouette en vol de la bibliothèque (beastArt.flyingGull) : à peu près la taille du dessin par code, grossie de même
  // quand l'île est vue de loin ; tournée vers la gauche quand elle y va (flip). false tant que son image se lit (le
  // dessin par code la remplace)
  drawGullArt(ctx, g, t, s) {
    const art = flyingGull(t, g.phase);
    if (!art) return false;
    const k = 0.55 * Math.max(1, 0.5 / s);
    ctx.save();
    ctx.translate(g.wx, g.wy - g.alt + 13 * k);
    ctx.scale(g.flip ? -k : k, k);
    const drawn = drawSprite(ctx, art.key, art.make, 0, 0, this.repaintSoon);
    ctx.restore();
    return drawn;
  },
  // Les cases dorées d'une pose (golden : { spots, chosen }) : sous ce qui se tient sur l'île (over faux : elles battent,
  // une onde part du centre), puis par-dessus tout (over vrai : le contour et un voile léger, le trait en cours plus
  // franc), pour que ni le relief ni un arbre devant ne les cachent
  drawGoldenCells(ctx, golden, view, t, s, over) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    const wave = (t * 1.1) % 1;
    const still = this.reduced();
    const traced = new Set((this.craftTrace ? this.craftTrace.cells : []).map(c => `${c.x},${c.y}`));
    const cells = over ? [...golden.spots, ...(this.craftTrace ? this.craftTrace.cells : [])] : golden.spots;
    ctx.lineJoin = 'round';
    for (const spot of cells) {
      const c = this.ground(spot.x, spot.y);
      if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
      const chosen = (golden.chosen && golden.chosen.x === spot.x && golden.chosen.y === spot.y) || traced.has(`${spot.x},${spot.y}`);
      this.diamond(ctx, c.x, c.y, TW, TH);
      if (over) ctx.fillStyle = chosen ? 'rgba(242, 192, 75, .42)' : `rgba(242, 192, 75, ${(0.1 + 0.1 * pulse).toFixed(3)})`;
      else ctx.fillStyle = chosen ? 'rgba(242, 192, 75, .62)' : `rgba(242, 192, 75, ${(0.24 + 0.2 * pulse).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(92, 56, 12, .78)';
      ctx.lineWidth = (chosen ? 4.6 : 3.4) / s;
      ctx.stroke();
      ctx.strokeStyle = chosen ? '#FFF4C8' : '#FFD45E';
      ctx.lineWidth = (chosen ? 2.4 : 1.7) / s;
      ctx.stroke();
      if (over || chosen || still) continue;
      this.diamond(ctx, c.x, c.y, TW * (0.2 + 0.7 * wave), TH * (0.2 + 0.7 * wave));
      ctx.strokeStyle = `rgba(255, 246, 210, ${(0.95 * (1 - wave)).toFixed(3)})`;
      ctx.lineWidth = 1.5 / s;
      ctx.stroke();
    }
  },
  // Ce qui se tient devant une de ces cases (cells : [{ x, y }]) à l'écran : (x, y) → vrai pour la case du pied d'un
  // objet un peu plus près de nous qu'elle (de 1 à XRAY_DEPTH rangs), dans sa colonne ou une voisine
  xrayOf(cells) {
    const columns = new Map();
    for (const c of cells) {
      const col = c.x - c.y;
      if (!columns.has(col)) columns.set(col, []);
      columns.get(col).push(c.x + c.y);
    }
    return (x, y) => {
      const depth = x + y;
      for (let col = x - y - XRAY_SIDE; col <= x - y + XRAY_SIDE; col++) {
        if ((columns.get(col) || []).some(d => depth - d >= 1 && depth - d <= XRAY_DEPTH)) return true;
      }
      return false;
    };
  },
  // La case du pied d'un objet de l'île, la plus proche de nous (un bâtiment, un coin du camp : son coin avant), ou
  // null (ce qui se pose en ce moment, une pancarte, le bac)
  frontCellOf(item) {
    if (item.site) return { x: item.site.x + item.site.w - 1, y: item.site.y + item.site.h - 1 };
    if (item.craft) return item.craft.ghost ? null : item.craft;
    if (item.camp) return { x: Math.round(item.camp.x + item.camp.w - 1), y: Math.round(item.camp.y + item.camp.h - 1) };
    if (item.annex || item.landmark || item.deposit || item.prop) return item.annex || item.landmark || item.deposit || item.prop;
    if (item.critter) return { x: Math.round(item.critter.x), y: Math.round(item.critter.y) };
    return null;
  },
  // Ce qui se tient derrière une case plus haute : cette case est repeinte par-dessus (le relief cache le pied)
  occlude(ctx, x, y, baked = false) {
    const M = this.M;
    const h = M.surface(x, y);
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1]]) {
      const nx = x + dx, ny = y + dy;
      if (!M.land(nx, ny) || M.surface(nx, ny) <= h + 0.01) continue;
      drawCell(ctx, M, nx, ny, this.veilAt(nx, ny));
      // (le décor cuit dans cette case est repeint avec elle)
      if (baked) this.standAt(ctx, nx, ny);
    }
  },
  // Zoom moyen (décor cuit dans le sol) : ce qui marche se dessine par-dessus le sol, donc par-dessus un arbre ou des
  // fleurs cuits devant lui. Le décor cuit des cases devant lui (plus proches) qui le recouvre à l'écran est repeint
  // par-dessus, comme de près où tout se dessine dans l'ordre du relief ; seulement dans sa boîte, pour ne pas doubler
  // ailleurs ce qui est transparent (l'ombre au pied d'un arbre). Sous la brume, le décor à demi effacé reste tel quel
  standInFront(ctx, critter) {
    const art = this.critterSprite(critter);
    if (!art) return;
    const [key, make] = art;
    const box = imageOf(key, make).box;
    const c = this.ground(critter.x, critter.y);
    const top = c.y - critter.z + box.y;
    const bottom = top + box.h;
    // (retourné, le dessin passe de l'autre côté de son pied)
    const left = c.x + Math.min(box.x, -box.x - box.w);
    const right = c.x + Math.max(box.x + box.w, -box.x);
    const rect = { x: left, y: top, w: right - left, h: bottom - top };
    const depth = critter.depth ?? critter.x + critter.y;
    const n = this.state.size;
    const x0 = Math.round(critter.x), y0 = Math.round(critter.y);
    for (let y = y0 - 1; y <= y0 + 3; y++) {
      for (let x = x0 - 1; x <= x0 + 3; x++) {
        const props = this.propsAt && this.propsAt.get(y * n + x);
        if (!props) continue;
        const zone = this.zoneAt(x, y);
        if (!zone || !zone.owned) continue;
        for (const prop of props) {
          if (prop.depth <= depth) continue;
          const pb = imageOf(prop.key, prop.make).box;
          if (prop.wx + pb.x >= right || prop.wx + pb.x + pb.w <= left || prop.wy + pb.y >= bottom || prop.wy + pb.y + pb.h <= top) continue;
          drawSpriteIn(ctx, prop.key, prop.make, prop.wx, prop.wy, rect);
        }
      }
    }
  },
  // Case (fractionnaire) sous un point du monde, au niveau de la mer
  cellAt(wx, wy) {
    const a = (2 * (wy + SEA_Z * HS)) / TH, b = (2 * wx) / TW;
    return { x: (a + b) / 2, y: (a - b) / 2 };
  }
};
