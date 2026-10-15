// La boucle d'animation et le dessin d'une image de l'île : le sol, la mer, ce qui se tient debout trié par profondeur,
// le relief qui cache le pied, la case sous un point du monde. Méthodes de WorldView.vue (this : le composant), réunies
// par draw.js.

import { drawSea, drawCloudShadows, drawClouds, drawTint, drawWeather } from '@/world/scene';
import { nuitVolOf, nuitDe, mixPhase, luneDuVol } from '@/world/lumiere/nuitDuConseil';
import { debordOf } from '../elan';
import { drawSheen, drawLightmap, drawHalos, hazeOf, drawShadows, shadowLight, eclairAt, drawEclair, eclairRimOf, eclatAt, lueurOf, drawEclat, flashTint, tonnerreAt, arcApresAverse, arcForce, arcGeometrie, drawArcEnCiel, drawRefletArc, drawPluie, drawRays, drawMotes, drawAigrettes, drawBraises, drawAllumages, pluieOf, cielOf, filanteAt, refletOf, teteOf, drawFilante, drawPaillettes, drawVignette, drawGolden, rimOf, clearRims, drawEtalonnage, rainFelt, slantOf, wetnessAt, drawWetGround, rainQuality, zoomOfRain, puddlesOf, drawPuddles, drawRipples, rippleSpotsOf } from '@/world/lumiere';
import { drawCaustics, drawLace, drawGlitter, glitterOf } from '@/world/rivage';
import { refletDuPhare, drawPhareReflet, drawPhareOmbre } from '@/world/phareLumiere';
import { phareRefletImage } from '@/world/decorArt';
import { lumierePhenix } from '@/world/phenix';
import { drawGeant, drawLueursGeant, drawGeyser, drawKraken, drawBras, drawLueursKraken, bancsOf, drawBancs, drawEclatsBancs, drawLueursBancs, drawBoule, drawApercu } from '@/world/faune';
import { crestOf } from '@/world/rareSprites';
import { setSpriteDetail, drawSprite, drawSpriteIn, imageOf, spriteGroup } from '@/world/spriteCache';
import { flyingGull } from '@/world/beastArt';
import { drawSparkles, drawWaves, drawShallows, drawRings, drawGullShadow, drawFlyingGull, drawPlankton, drawJellies, shoreEdges } from '@/world/sea';
import { drawFloatBelow, FLOATING_ZONE, drawSpring } from '@/world/islets';
import { drawLive, drawCell, SEA_Z, HS, worldOf, CELL_BELOW, CELL_ABOVE_MAX } from '@/world/terrain';
import { freshOf, drawFresh } from '@/world/eauDouce';
import { mixToward, climateAt, drawClimate, drawClimatMonde } from '@/world/climates';
import { gridWanted } from '@/world/perf';
import { drawTerreBattue } from '@/world/terreBattue';
import { shakeOf, shadowOf } from '@/world/fetes';
import { TW, TH, SEA_KINDS } from '../constants';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
// Pendant son chargement (loading.js), l'île, cachée par l'écran de chargement, ne se dessine que pour compter ses
// dessins : quatre fois par seconde, et le fil principal va à la lecture des dessins (redessiner l'île cachée à chaque
// image en prenait près de la moitié sur un téléphone lent)
const LOADING_FRAME_MS = 250;
// Vue de loin (zoom sous FAR_SCALE) : ni masquage par le relief devant ce qui se tient debout (invisible à cette
// taille), ni petits détails du décor ; la très grande île reste fluide
const FAR_SCALE = 0.45;
// De près seulement (zoom dès NEAR_SCALE), le décor fixe se dessine à chaque image et plie au vent ; plus loin, il est
// cuit dans les carrés du sol (sauf près de ce qui se tient debout : il doit pouvoir passer devant)
const NEAR_SCALE = 0.9;
const SMALL_PROPS = new Set(['tuft', 'flowers', 'shells', 'mushrooms', 'reeds', 'lily', 'stump', 'log', 'driftwood', 'nest']);

// Pendant une pose : ce qui se tient devant une case dorée (jusqu'à tant de rangs plus près, et tant de colonnes de côté)
// ne garde que tant d'opacité
const XRAY_DEPTH = 6;
const XRAY_SIDE = 2;
const XRAY_ALPHA = 0.2;

// Le Kraken est-il à l'écran (son centre, avec une marge d'une case) ?
const seenKraken = (kr, view, ground) => { const c = ground(kr.x, kr.y); return c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW && c.y < view.y + view.h + TW; };

// Les braises d'un fanal de la Route des feux : bien moins que le grand feu de camp (une vasque, pas un bûcher ; en
// lumière qui s'ajoute, trop de braises se fondaient en un trait blanc)
const FANAL_BRAISES = 0.35;

export default {
  /* ---------- Boucle et dessin ---------- */
  syncLoop() {
    // (un jeu par-dessus l'île : la Récolte, un mini-jeu, la chasse aux poules, la marmite ; ou une scène plein écran :
    // l'île, cachée, ne se redessine pas, sauf pour finir de se charger : elle compte ses dessins en se dessinant,
    // quatre fois par seconde, loading.js)
    const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run && !this.gameId && !this.henChase && !this.cooking && (!this.covered || this.loadingSince);
    if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
    if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  },
  frame(now) {
    this.raf = 0;
    if (now - this.lastFrame >= (this.loadingSince ? LOADING_FRAME_MS : FRAME_MS)) {
      this.lastFrame = now;
      const start = performance.now();
      this.draw(now);
      const ms = performance.now() - start;
      // (sous la pluie, sa qualité suit ce que coûte une image sur cet appareil : averse.js)
      if (this.phase && this.phase.weather.rain > 0.02) this.rainQ = rainQuality(this.rainQ, ms);
      if (this.perf) {
        this.perf.frame(now, ms);
        const text = this.perf.text(now, this.cam ? this.cam.s : 0);
        if (text) this.perfText = text;
      }
    }
    this.syncLoop();
  },
  // Le doigt bouge (glisser, pincer, zoomer, tracer) : un seul dessin à l'image suivante, quel que soit le nombre
  // d'événements du doigt d'ici là (un écran tactile en envoie plusieurs par image : chacun redessinait toute l'île)
  drawSoon() {
    // (une minuterie qui finit après le départ de l'île ne redessine rien : fêtes et petits gestes en mouvement réduit)
    if (this.soonRaf || this.gone) return;
    this.soonRaf = requestAnimationFrame(now => {
      this.soonRaf = 0;
      this.lastFrame = now;
      this.draw(now);
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
    // (le temps de cette image : chaque quartier ne se demande qu'une fois s'il est sous la brume épaisse, terrain.js)
    this.thickMemo = new Map();
    const ctx = canvas.getContext('2d');
    const { width, height, dpr } = this.geo;
    const { s } = this.cam;
    const t = this.reduced() ? 0 : now / 1000;
    const date = this.skyDate(now);
    const real = this.skyAt(date);
    // Le vol du conseil garde la nuit du conseil, quelle que soit l'heure (lumiere/nuitDuConseil.js ; le vol : WorldView,
    // phare.js) ; l'horloge de l'en-tête, elle, garde l'heure du jeu
    this.nuitVol = nuitVolOf(this.nuitVol, Boolean(this.flightRaf || this.flightTimer), now, this.reduced());
    const phase = this.nuitVol.k > 0 ? mixPhase(real, this.skyAt(nuitDe(date)), this.nuitVol.k) : real;
    this.phase = phase;
    // Orage : l'éclair de cet instant (ou rien), qui éclaire la scène, durcit les ombres et allume la pluie
    const orage = eclairAt(t, phase.weather.storm);
    const flash = orage ? orage.flash : 0;
    this.itemHits = [];
    this.nameSignHits = [];
    this.syncClock(real, date, now);
    // Les fêtes de cette image (un bâtiment construit ou qui gagne un palier : world/fetes.js)
    const fetes = this.fetesNow(now);
    // Le liseré des bâtiments et des arbres : doré à l'heure dorée, blanc à l'éclair (ses images restent le temps de
    // l'heure dorée ou de l'orage, puis partent)
    const rim = rimOf(phase) || eclairRimOf(orage);
    const rimsKept = !!rim || phase.weather.storm >= 0.5;
    if (!rimsKept && this.rimsKept) clearRims();
    this.rimsKept = rimsKept;
    this.rim = rim;
    // Mer, selon l'heure
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSea(ctx, width, height, t, phase);
    // Monde : unités du monde, caméra appliquée (l'écran tremble un instant à l'impact d'une fête ou d'une pose, et
    // doucement au tonnerre)
    const o = this.toScreen(0, 0);
    // (tirée au-delà du bord de l'île, la caméra le dépasse à peine : view/elan.js)
    o.x -= debordOf(this.debordRaw.x, s) * s;
    o.y -= debordOf(this.debordRaw.y, s) * s;
    if (!this.reduced()) {
      const shake = shakeOf(fetes, now, this.sparks);
      const grondement = tonnerreAt(t, phase.weather.storm);
      // (le Kraken qui surgit : un tremblement court, de l'image d'avant)
      const surgit = this.krakenShake || 0;
      o.x += shake.x + grondement.x + surgit * 3.2 * Math.sin(t * 61);
      o.y += shake.y + grondement.y + surgit * 2.4 * Math.sin(t * 47 + 1);
    }
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
    // Vue de loin, les dessins sont recopiés à moindre détail (images réduites une fois pour toutes)
    setSpriteDetail(dpr * s);
    // Monde visible : seuls les carrés de sol et ce qui s'y tient, à l'écran, sont dessinés
    const tl = this.toWorld(0, 0);
    const br = this.toWorld(width, height);
    const view = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
    // L'arc-en-ciel après l'averse (lumiere/arcEnCiel.js) : sa force, sa naissance à l'écran (il se trace quand il
    // paraît), la partie réveillée de l'île qu'il enjambe ; son reflet se pose sur la mer, lui-même plus loin
    const arc = arcForce(phase, this.arcAfter ? arcApresAverse(now - this.arcAfter) : 0);
    if (arc < 0.02) this.arcBorn = 0;
    else if (!this.arcBorn) this.arcBorn = now;
    const awake = this.arcBorn && this.awakeBox();
    const arcGeo = awake && arcGeometrie(awake);
    // Les étoiles filantes, par nuit claire (lumiere/filantes.js ; pas en mouvement réduit) : celle qui file, sauf celle
    // qu'on vient de toucher ; son reflet sur la mer, puis elle-même, tout en haut du ciel
    const ciel = this.reduced() ? 0 : cielOf(phase);
    const filante = ciel > 0.02 ? filanteAt(t, pluieOf(date)) : null;
    const file = filante && filante.cycle !== this.filanteCaught ? filante : null;
    // Sous le sol : reflets, vagues qui arrivent derrière l'île, bancs de poissons, puis les eaux peu profondes par-dessus
    // (la terre les recouvre)
    // Reflets du soleil sur l'eau : pas la nuit, ni sous un ciel couvert
    drawSparkles(ctx, view, t, Math.max(phase.night, phase.weather.cover * 0.85), s);
    drawWaves(ctx, this.live.back, view, t, false);
    // Les bancs (faune/bancs.js) : ceux qu'on vient de toucher fusent, celui de la boule de sardines se ramasse (pas en
    // mouvement réduit)
    const boule = this.reduced() ? null : this.bouleOf(t, view);
    const bancs = bancsOf(this.sea.schools, t, k => (this.scared.get(`school:${k}`) || {}).at, boule);
    drawBancs(ctx, bancs, view, phase.night);
    drawShallows(ctx, this.sea.shallow, view, phase.night);
    drawEclatsBancs(ctx, bancs, phase.night);
    // La lumière qui danse au fond des eaux peu profondes, puis le chemin du soleil, de la lune ou de l'éclair (posé
    // sur la mer : il suit la caméra, comme les reflets), et le reflet de l'arc-en-ciel qui ondule
    drawCaustics(ctx, this.sea.shallow, view, t, (1 - phase.night * 0.85) * (1 - phase.weather.cover * 0.6));
    drawGlitter(ctx, view, t, phase, date, s, this.terrain.bounds, orage);
    if (arcGeo) drawRefletArc(ctx, this.geo, ctx.getTransform(), arcGeo, arc, now - this.arcBorn, t, this.reduced());
    // Le reflet du phare des Anciens sur la mer, sous son îlot (la terre le cache où elle passe), teinté du ciel
    const phare = this.phareSpot();
    const phareSeen = phare && phare.x > view.x - TW * 4 && phare.x < view.x + view.w + TW * 4 && phare.y - TW * 8 < view.y + view.h && phare.y + TW * 7 > view.y;
    if (phareSeen) {
      const img = phareRefletImage(this.phareLook(date, this.wetOf(date)).vide, this.reduced() ? 0 : t, this.repaintSoon);
      if (img) drawPhareReflet(ctx, img, phare.x, phare.y, refletDuPhare(phase, glitterOf(phase, date), orage, this.wetOf(date)), this.reduced() ? 0 : t);
    }
    if (file) {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFilante(ctx, width, height, refletOf(file), ciel, t);
      ctx.restore();
    }
    // Le Géant des profondeurs glisse sous la mer (faune/geant.js ; pas en mouvement réduit) ; ses lueurs de nuit et son
    // geyser, après la carte de lumière
    const geant = this.reduced() ? null : this.geantOf(t, view);
    if (geant) drawGeant(ctx, geant, t, phase.night);
    // Le Kraken au large (faune/kraken.js ; pas en mouvement réduit) : son ombre, ses bulles, son œil ; ses bras hors de
    // l'eau, puis ses lueurs de nuit, plus loin
    const kraken = this.reduced() ? null : this.krakenOf(t, view, phase);
    // (dans l'orage, à la lueur d'un éclair, un de ses bras entrevu au large : pas en mouvement réduit)
    const apercu = this.reduced() ? null : this.apercuOf(t, view, phase);
    // Le vol du Phénix (draw/brume.js : phenixOf) ; il se dessine à la place de Brume, et éclaire le sol sous lui
    this.phenix = this.reduced() ? null : this.phenixOf(t, view, phase);
    if (kraken) drawKraken(ctx, kraken, t, phase.night);
    // La boule de sardines bouillonne à la surface
    drawBoule(ctx, boule, t, phase.night);
    drawFloatBelow(ctx, this.islets.float, view, t, phase.night);
    // Sol en relief, en carrés gardés en images (les nouveaux dans un budget de 8 ms) ; puis l'eau douce qui bouge,
    // les vagues et l'écume devant l'île, les ronds dans l'eau des dauphins et de la baleine
    // (avec le décor fixe cuit dedans, sauf de près)
    const near = s >= NEAR_SCALE;
    const baked = !near;
    // (le décor cuit dans le sol compte avec le décor, pendant le chargement de l'île)
    spriteGroup('decor');
    const missing = this.terrain.draw(ctx, view, s * dpr, 8, baked);
    if (gridWanted()) this.drawGrid(ctx, view);
    drawLive(ctx, this.M, this.live, view, t);
    // L'eau douce vivante : poissons, lumière au fond, courant, cascades, bonds (le courant se calcule une fois par île)
    if (!this.fresh || this.fresh.live !== this.live) this.fresh = { live: this.live, ...freshOf(this.M, this.live) };
    drawFresh(ctx, this.M, this.live, this.fresh, view, t, (1 - phase.night * 0.85) * (1 - phase.weather.cover * 0.6), this.reduced());
    // L'averse : les flaques du sol mouillé (elles sèchent après la pluie), puis les ronds de la pluie sur l'eau
    // (flaques et ronds se placent une fois par île ; le mouillé se recalcule une fois par minute)
    const rainK = rainFelt(phase.weather.rain, t);
    const wet = this.wetOf(date);
    if (wet > 0.04 || rainK > 0.03) {
      if (!this.rainSpots || this.rainSpots.fresh !== this.fresh) {
        const puddles = puddlesOf(this.M);
        this.rainSpots = { fresh: this.fresh, puddles, spots: rippleSpotsOf(this.fresh.cells, this.sea.shallow[0], puddles) };
      }
      // (pas de flaque sous la brume : le sol n'y est pas encore découvert)
      const open = p => this.veilAt(p.x, p.y) < 0.05 && !this.hiddenCell(p.x, p.y);
      // le sol mouillé fonce et ses chemins luisent, sous les flaques (lumiere/mouille.js) : toute la terre découverte
      // (sous la brume, les cases voilées restent pâles ; au bord, le mouillé s'efface)
      drawWetGround(ctx, this.M, view, wet, t, (x, y) => (this.hiddenCell(x, y) ? 0 : (1 - this.veilAt(x, y)) ** 3));
      drawPuddles(ctx, this.rainSpots.puddles, view, wet, open, { flash, arc });
      drawRipples(ctx, this.rainSpots.spots, view, t, rainK, this.rainQ, wet, open);
    }
    if (this.owns(this.state, FLOATING_ZONE)) drawSpring(ctx, this.islets.spring, view, t);
    drawWaves(ctx, this.live.shore, view, t, true);
    drawLace(ctx, shoreEdges(this.live.shore, view, t), t);
    const life = this.seaLife(t, view, phase);
    drawRings(ctx, life.rings);
    // Sol des chantiers : terre battue (bâti) ou chantier, une tache par emprise qui se fond dans le sol autour
    // (terreBattue.js) ; cases libres pendant un déplacement ; case choisie
    for (const site of this.shownSites()) drawTerreBattue(ctx, site, this.centerOf(site), TW, TH);
    // L'intérieur des enclos fermés, d'une lueur chaude (WorldView, enclosures.js)
    this.drawPens(ctx, view, t);
    // Pose d'une annexe ou d'une création : les cases autorisées battent en doré, la case choisie est cerclée. Contour
    // net (un trait sombre sous un trait doré : lisible sur le sable, la neige et la lande) ; un losange clair part du
    // centre de chaque case et s'efface (sauf en mouvement réduit)
    // (un seul niveau à la fois, plateau ou sol : poseLevel.js)
    const golden = this.annexPlacing && this.placingSite ? { spots: this.poseSpots(this.annexSpots), chosen: this.annexConfirm }
      : this.craftPlacing ? { spots: this.poseSpots(this.craftSpots), chosen: this.craftConfirm }
        : this.siteMoving ? { spots: this.poseSpots(this.siteMoving.spots), chosen: this.siteMoveConfirm } : null;
    // (un bâtiment qu'on déplace : sa future emprise, 3 × 3, en blanc doré sous la case choisie)
    for (const cell of this.siteMoveCells()) {
      const c = this.ground(cell.x, cell.y);
      this.diamond(ctx, c.x, c.y, TW, TH);
      ctx.fillStyle = 'rgba(255, 244, 200, .42)';
      ctx.fill();
    }
    if (golden) this.drawGoldenCells(ctx, golden, view, t, s, false);
    // Le tracé d'un chemin (aperçu), les cases qui se creusent (roads.js)
    this.drawRoads(ctx, t, s);
    if (this.craftMenu) {
      const c = this.ground(this.craftMenu.x, this.craftMenu.y);
      this.diamond(ctx, c.x, c.y, TW, TH);
      ctx.strokeStyle = '#F2C04B';
      ctx.lineWidth = 2.5 / s;
      ctx.stroke();
    }
    // Contour des chantiers : pointillés à bâtir, doré quand tout est prêt
    for (const site of this.shownSites()) {
      if (site.locked) continue;
      const c = this.centerOf(site);
      this.diamond(ctx, c.x, c.y, TW * site.w, TH * site.h);
      const ready = this.canBuild(site);
      if (ready || !site.level) {
        ctx.setLineDash(ready ? [] : [6, 5]);
        ctx.strokeStyle = ready ? `rgba(245, 195, 68, ${0.6 + 0.4 * Math.sin(t * 3)})` : 'rgba(90, 60, 30, .55)';
        ctx.lineWidth = ready ? 3 : 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (this.site && this.site.id === site.id) {
        ctx.strokeStyle = '#F2C04B';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
    }
    // Brume qui se lève sur le quartier qu'on vient d'acheter (la brume des autres est peinte dans le sol)
    for (const id of [...this.unveils.keys()]) {
      const unveiled = this.state.map.zones.find(z => z.id === id);
      const mist = this.mistOf(unveiled, now);
      if (!mist) continue;
      ctx.fillStyle = `rgba(236, 238, 242, ${((this.thickMist() ? 0.9 : 0.62) * mist).toFixed(3)})`;
      for (const [x, y] of this.zoneTiles.get(id) || []) {
        const c = this.ground(x, y);
        this.diamond(ctx, c.x, c.y, TW + 1, TH + 1);
        ctx.fill();
      }
    }
    // Carrés de sol encore à préparer : une image de plus, même sans boucle d'animation (pas sous une scène)
    if (missing && !this.raf && !this.moreRaf && !this.covered) {
      this.moreRaf = requestAnimationFrame(() => {
        this.moreRaf = 0;
        this.draw(performance.now());
      });
    }
    const worldTransform = ctx.getTransform();
    // Le vent sur l'herbe : des vagues de lumière douce (lumiere/vent.js) ; le jour, par beau temps, d'assez près, pas en
    // mouvement réduit, et rien dans un quartier pas encore à soi
    if (s >= 0.45 && !this.reduced()) {
      const k = 0.11 * (1 - phase.night) ** 1.5 * (1 - Math.min(1, phase.weather.rain * 2)) * (1 - phase.weather.cover * 0.5) * Math.min(1, (s - 0.45) / 0.2);
      drawSheen(ctx, this.M, view, t, k, this.lightGate(now));
    }
    // Ombres portées des bâtiments : elles suivent le soleil (et, la nuit, la lune)
    drawShadows(ctx, this.state.sites.filter(site => site.level && !site.locked).map(site => {
      const c = this.centerOf(site);
      const h = Math.max(18, -crestOf(site.id, site.level)[1]);
      // (un bâtiment qui s'élève : son ombre grandit avec lui, depuis celle de son ancien état)
      const raise = this.raises.get(site.id);
      const grow = raise ? shadowOf(now - raise.at, raise.from ? Math.max(18, -crestOf(site.id, raise.from)[1]) / h : 0.35) : 1;
      // (le volume du bâtiment, pas toute son emprise : jardins et chemins n'ont pas d'ombre)
      return { x: c.x, y: c.y, hw: site.w / 2 * 0.48, hh: site.h / 2 * 0.48, h: h * 0.62 * grow };
    }).concat(this.feuxShadows()), shadowLight(phase, date, orage));
    // (l'ombre du phare des Anciens, toute sa hauteur, sur son îlot et sur la mer)
    if (phareSeen) drawPhareOmbre(ctx, phare.x, phare.y, shadowLight(phase, date, orage));
    for (const g of life.gulls) drawGullShadow(ctx, g, s);
    // Ce qui se tient debout (bâtiments, créations, nature), du plus loin au plus proche
    // (seulement ce qui est à l'écran ; un grand sprite dépasse vers le haut de son pied)
    const far = s < FAR_SCALE;
    const seenAt = (wx, wy) => wx > view.x - TW * 2.5 && wx < view.x + view.w + TW * 2.5 && wy > view.y - TW * 0.6 && wy < view.y + view.h + TW * 3.2;
    const seen = (x, y) => { const c = this.ground(x, y); return seenAt(c.x, c.y); };
    // (les bâtiments et le camp des personnages ne se montrent pas sous la brume du tutoriel, même à demi : on ne les a
    // pas encore rencontrés, choix de l'auteur, 11 oct. ; le décor, lui, s'y devine)
    const met = (x, y) => !this.hiddenCell(x, y);
    // (qui marche sur l'île : les portes s'ouvrent devant lui, walls.js)
    const crowd = this.critters(t);
    this.swingDoors(t, crowd);
    const standing = [
      ...this.shownSites().filter(site => met(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2)).map(site => ({ depth: site.x + site.y + site.w, site })),
      ...this.crafted.filter(craft => seen(craft.x, craft.y)).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...(this.state.annexes || []).filter(annex => seen(annex.x, annex.y)).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Aperçu de la pose en attente de confirmation (miroir, couleur choisis), en transparence sur sa case dorée
      ...[this.craftGhost, ...this.lineGhosts].filter(Boolean).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...[this.annexGhost].filter(Boolean).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Le camp des naufragés : un élément de 2 × 2 cases se range comme un bâtiment, un objet comme une annexe
      // (la cage d’Agathe qui dérive encore jusqu'au sable : hens.js, driftOf)
      ...(this.state.camp || []).filter(item => seen(item.x, item.y) && met(item.x, item.y)).map(item => this.driftOf(item, t))
        .map(item => ({ depth: item.x + item.y + (item.w > 1 ? item.w : 0), camp: item })),
      ...this.shownLandmarks.filter(landmark => seen(landmark.x, landmark.y)).map(landmark => ({ depth: landmark.x + landmark.y, landmark })),
      // Le fanal de la Route des feux, juste devant son lieu (draw/feux.js)
      ...this.feuxSeen(view).map(feu => ({ depth: feu.x + feu.y + 0.05, feu })),
      ...this.groundFinds.filter(deposit => seen(deposit.x, deposit.y)).map(deposit => ({ depth: deposit.x + deposit.y, deposit })),
      ...this.state.sites.filter(site => site.level && site.produce && !site.locked).map(site => ({ site, at: this.reserveAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, reserve: site })),
      ...this.state.sites.filter(site => site.sign && !site.locked).map(site => ({ site, at: this.nameSignAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, nameSign: site })),
      ...(baked ? this.liveProps : this.props).filter(prop => seenAt(prop.wx, prop.wy) && !(far && SMALL_PROPS.has(prop.kind))).map(prop => ({ depth: prop.depth, prop })),
      ...[...crowd, ...life.standing].filter(critter => seen(critter.x, critter.y))
        .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
      ...this.ferryItems(t),
      // Le phare des Anciens, au milieu de son îlot (3 × 3 cases : rangé derrière ce qui se tient devant lui)
      ...(phareSeen ? [{ depth: phare.gx + phare.gy + 1.5, phare: true }] : []),
      ...this.state.map.zones.filter(zone => !zone.owned && this.signShown(zone)).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
        .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
    ].sort((p, q) => p.depth - q.depth);
    this.signs = [];
    const repaint = this.repaintSoon;
    // Pendant une pose (choix de l'auteur, 15 oct. : on doit voir où l'on pose) : ce qui se tient devant une case dorée
    // ou une case du trait s'efface presque, et ces cases se redessinent par-dessus tout, relief compris (drawGoldenOver)
    const xray = golden && !far ? this.xrayOf([...golden.spots, ...(this.craftTrace ? this.craftTrace.cells : [])]) : null;
    // L'air des climats, dans le monde et sur leur terrain seulement (climates.js) : d'abord ce qui reste au ras du sol
    // (nappes du marais, chaleur des dunes), derrière ce qui se tient debout ; pas en mouvement réduit
    const zones = this.state.map.zones;
    const climatOf = (x, y) => { const c = this.cellAt(x, y); return climateAt(this.M, zones, c.x, c.y); };
    const climats = !this.reduced();
    if (climats) drawClimatMonde(ctx, 'sol', view, t, climatOf, phase.night, s);
    for (const item of standing) {
      // (groupe de ses dessins, pour le chargement de l'île)
      spriteGroup(item.critter || item.ferry ? 'vivants' : item.prop ? 'decor' : 'batiments');
      const front = xray && this.frontCellOf(item);
      const faded = Boolean(front && xray(front.x, front.y));
      if (faded) {
        ctx.save();
        ctx.globalAlpha *= XRAY_ALPHA;
      }
      if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
      else if (item.craft) {
        this.drawCraft(ctx, item.craft, t, now, repaint);
        if (!far) this.occlude(ctx, item.craft.x, item.craft.y, baked);
      } else if (item.annex) {
        this.drawAnnex(ctx, item.annex, t, now, repaint);
        if (!far) this.occlude(ctx, item.annex.x, item.annex.y, baked);
      } else if (item.camp) {
        this.drawCamp(ctx, item.camp, t, repaint);
        // (la cage d’Agathe qui dérive est entre deux cases : sa case la plus proche)
        if (!far) this.occlude(ctx, Math.round(item.camp.x + item.camp.w - 1), Math.round(item.camp.y + item.camp.h - 1), baked);
      } else if (item.landmark) {
        this.drawLandmark(ctx, item.landmark, t, now, repaint);
        if (!far) this.occlude(ctx, item.landmark.x, item.landmark.y, baked);
      } else if (item.feu) {
        this.drawFeu(ctx, item.feu, t, now, phase, repaint);
      } else if (item.phare) {
        this.drawPhare(ctx, t, date, wet, repaint);
      } else if (item.deposit) {
        this.drawDeposit(ctx, item.deposit, t, now, repaint);
        if (!far) this.occlude(ctx, item.deposit.x, item.deposit.y, baked);
      } else if (item.prop) {
        this.drawProp(ctx, item.prop, t, repaint, now, !near);
        if (!far) this.occlude(ctx, item.prop.x, item.prop.y, baked);
      } else if (item.nameSign) this.drawNameSign(ctx, item.nameSign, t, repaint);
      else if (item.reserve) this.drawReserve(ctx, item.reserve, t, repaint);
      else if (item.sign) this.drawSign(ctx, item.sign, t, repaint);
      else if (item.ferry) this.drawFerry(ctx, item.ferry, repaint);
      else {
        // (sous les pas de qui marche : sable, poussière, gouttes ; d'assez près, pas en mouvement réduit : draw/pas.js)
        if (!far && s >= 0.6 && !this.reduced()) this.drawPas(ctx, item.critter, t);
        this.drawCritter(ctx, item.critter, repaint);
        if (!far && !SEA_KINDS.has(item.critter.kind)) {
          this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y), baked);
          if (baked) this.standInFront(ctx, item.critter);
        }
      }
      if (faded) ctx.restore();
    }
    if (xray) this.drawGoldenCells(ctx, golden, view, t, s, true);
    // (la boucle suggérée d'un trait, les cases refusées : par-dessus tout)
    if (golden) {
      this.drawLoopHint(ctx, view, t, s);
      this.drawRefused(ctx, view, s);
    }
    // La brume d'une découverte, la poussière d'une pose (world/fetes.js)
    this.drawFetesGround(ctx, fetes, now);
    // Ombres des nuages qui glissent sur l'île, par-dessus le sol et ce qui s'y tient
    drawCloudShadows(ctx, this.terrain.bounds, t, phase);
    // Brume vivante qui dérive au-dessus des terres voilées
    this.drawWisps(ctx, t, now, view);
    this.drawSmoke(ctx, t, phase);
    // Les aigrettes de pissenlit que le vent emporte, le jour (lumiere/petiteVie.js ; pas en mouvement réduit)
    if (!this.reduced()) drawAigrettes(ctx, view, t, phase, s);
    // Ciel : mouettes en vol, nuages haut au-dessus de l'île, puis la teinte de l'heure sur toute la scène
    if (kraken) drawBras(ctx, kraken, t);
    if (apercu) drawApercu(ctx, apercu.ap, apercu.at, t);
    // (l'écran ne tremble que si on le voit surgir : il passe au large, on le croise par hasard)
    const surgitIci = kraken && seenKraken(kraken, view, this.ground.bind(this));
    this.krakenShake = surgitIci ? kraken.secousse : 0;
    for (const g of life.gulls) if (!this.drawGullArt(ctx, g, t, s)) drawFlyingGull(ctx, g, t, s);
    drawClouds(ctx, this.terrain.bounds, t, phase, s);
    // Lumière de l'heure : la carte de lumière (les sources éclairent ce qui les entoure), ou la teinte à plat quand
    // rien n'est allumé
    // (puis ce qui flotte dans l'air des climats, que la lumière de l'heure va prendre : neige, pluie, cendre, pétales…)
    if (climats) drawClimatMonde(ctx, 'air', view, t, climatOf, phase.night, s);
    const sources = [];
    this.drawLights(ctx, t, phase, view, sources);
    if (this.phenix) sources.push(lumierePhenix(this.phenix, phase.night, s));
    // Brume éclaire la nuit autour d'elle (sans halo ici : elle dessine le sien, plus bas ; en vol, le Phénix éclaire)
    const brume = this.brumeAt(t);
    const lights = brume ? [...sources, ...this.brumeLights(brume, phase, t, s)] : [...sources];
    // (pendant le vol du conseil, la lune éclaire la tour : lumiere/nuitDuConseil.js)
    const lune = luneDuVol(this.nuitVol && this.nuitVol.k, phare);
    if (lune) lights.push(lune);
    this.lightSpots = lights;
    if (!drawLightmap(ctx, this.geo, phase, worldTransform, lights, flash)) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawTint(ctx, width, height, flash > 0.01 ? { ...phase, tint: flashTint(phase.tint, flash) } : phase);
    }
    // L'arc-en-ciel, accroché à l'île
    if (arcGeo) drawArcEnCiel(ctx, this.geo, worldTransform, arcGeo, arc, now - this.arcBorn, t, this.reduced());
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // La lumière de l'éclair, de son côté : l'éclat en paliers des gros coups (pas en mouvement réduit : une île qui
    // s'illumine d'un coup), sinon la lueur qui suit le flash ; puis le tracé
    drawEclat(ctx, width, height, (!this.reduced() && eclatAt(t, phase.weather.storm)) || lueurOf(orage));
    drawEclair(ctx, width, height, orage);
    // L'étoile filante tout en haut du ciel, à peine (on la voit surtout dans l'eau) ; elle se touche là ou dans son
    // reflet, et éclate en paillettes (view/gestures.js)
    if (file) drawFilante(ctx, width, height, file, ciel * 0.45, t);
    this.filanteHit = file && file.k < 1 ? [file, refletOf(file)].map(f => ({ ...teteOf(f, width, height), cycle: file.cycle })) : null;
    if (this.paillettes && !drawPaillettes(ctx, this.paillettes, performance.now())) this.paillettes = null;
    drawWeather(ctx, width, height, t, phase);
    drawGolden(ctx, width, height, phase);
    // Pluie (les lumières, ramenées à l'écran, s'y reflètent)
    if (phase.weather.rain > 0.02) {
      const m = worldTransform;
      const onScreen = lights.filter(l => l.pool !== false).map(l => ({ x: (m.a * l.x + m.c * l.gy + m.e) / dpr, y: (m.b * l.x + m.d * l.gy + m.f) / dpr, r: l.r * m.a / dpr, k: l.k, color: l.color }));
      drawPluie(ctx, width, height, t, rainK, phase.night, flash, onScreen, { slant: slantOf(t), q: this.rainQ, zoom: zoomOfRain(s) });
    }
    const here = this.cellAt(this.cam.x, this.cam.y);
    this.climateMix = mixToward(this.climateMix, climateAt(this.M, this.state.map.zones, here.x, here.y), this.climateT ? Math.min(0.5, t - this.climateT) : 1);
    this.climateT = t;
    // (la teinte du climat visé : un étalonnage, sans forme)
    drawClimate(ctx, width, height, this.climateMix);
    // L'étalonnage de l'heure : ombres, tons moyens et lumières prennent chacun leur couleur (lumiere/etalonnage.js)
    drawEtalonnage(ctx, width, height, phase);
    // Ambiance : rayons du soleil bas, vignettage (les éclats de lumière, eux, flottent dans le monde : plus bas)
    drawRays(ctx, width, height, t, phase);
    drawVignette(ctx, width, height, phase);
    // La nuit de la veillée : la magie par-dessus tout le décor (draw/veillee.js)
    this.drawVeillee(ctx, width, height, t);
    ctx.setTransform(worldTransform);
    // Halos des sources déjà rangées pour la carte de lumière (rien n'est recalculé)
    drawHalos(ctx, sources, hazeOf(phase), t);
    // Éclats de lumière dans l'air de l'île, posés dans le monde (pas en mouvement réduit)
    if (!this.reduced()) drawMotes(ctx, view, t, phase, s);
    // Les braises qui montent du feu de camp, plus vives la nuit (ce qu'il reste du feu à la veillée : fireLeft)
    if (!this.reduced()) drawBraises(ctx, this.fireSpots(), t, phase, this.fireLeft());
    // Celles des feux rallumés de la Route des feux, puis leur éclat, qui se voit de loin (draw/feux.js)
    if (!this.reduced()) drawBraises(ctx, this.feuxBraises(view), t, phase, FANAL_BRAISES);
    this.drawFeuxLointains(ctx, view, t, phase, s);
    // Ce qui brille de soi-même dans l'air des climats : braises du volcan, spores du marais la nuit
    if (climats) drawClimatMonde(ctx, 'lueurs', view, t, climatOf, phase.night, s);
    // L'étincelle d'une lumière du soir qui s'allume, la fumée de celle qui s'éteint (lumiere/allumage.js)
    drawAllumages(ctx, this.allumages, performance.now());
    // La lumière des fêtes (le projecteur d'un Grand moment, l'éclat) et des petits gestes
    this.drawFetes(ctx, fetes, view, now);
    // La nuit, le plancton s'allume dans l'écume, les méduses et les bancs luisent
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawPlankton(ctx, this.live.shore, view, t, phase.night);
    if (life.jellies) drawJellies(ctx, life.jellies, view, t, phase.night);
    drawLueursBancs(ctx, bancs, phase.night);
    ctx.restore();
    if (geant) {
      drawLueursGeant(ctx, geant, t, phase.night);
      drawGeyser(ctx, geant);
    }
    if (kraken) drawLueursKraken(ctx, kraken, t, phase.night);
    // Brume flotte au-dessus de tout (et luit la nuit)
    this.drawBrume(ctx, t, s, brume);
    // Les noms des lieux passent par-dessus tout : aucune création ne les cache
    if (this.cam.s >= 0.55) this.shownSites().filter(site => !site.locked).forEach(site => this.drawLabel(ctx, site, now));
    // Étoiles des lieux à découvrir : par-dessus tout, de jour comme de nuit
    this.drawBeacons(ctx, t, seen);
    // Bulles de production à toucher, au-dessus de tout ; les « ! » de l'étape du tutoriel (et leur flèche au bord)
    this.drawBubbles(ctx, t, repaint, now);
    this.drawMarks(ctx, t, dpr, now);
    // Le mot des fêtes et ce qu'on gagne, par-dessus tout
    this.drawFeteWords(ctx, fetes, now);
    // Ce qui est choisi (premier toucher) : un contour doré qui bat
    this.drawPick(ctx, t);
    // Arrivée sur l'île : où en est la première vue
    this.watchLoading(missing, this.terrain.seen || 0);
    this.thickMemo = null;
  },
  // Le mouillé du sol à cette date (averse.js : la pluie des trois dernières heures), recalculé une fois par minute
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
    const [key, make] = this.critterSprite(critter);
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
