// L'image qui commence (draw/loop.js : draw) : son heure et son ciel (le vol du conseil garde sa nuit), l'orage, les
// fêtes, le liseré, la mer de fond, la caméra (et ses tremblements), la vue, l'arc-en-ciel et l'étoile filante. Méthodes
// de WorldView.vue (this : le composant), réunies par draw.js.
import { drawSea } from '@/world/scene';
import { nuitVolOf, nuitDe, mixPhase, orageDuVol } from '@/world/lumiere/nuitDuConseil';
import { debordOf } from '../../elan';
import { eclairAt, eclairRimOf, tonnerreAt, arcApresAverse, arcForce, arcGeometrie, pluieOf, cielOf, filanteAt, rimOf, clearRims, imageSuivanteRims } from '@/world/lumiere';
import { setSpriteDetail } from '@/world/spriteCache';
import { shakeOf } from '@/world/fetes';
import { SEASON } from '@/world/plants';

export default {
  prepareFrame({ now, canvas }) {
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
    // (et son orage, jusqu'au phare)
    const nuit = this.nuitVol.k > 0 ? mixPhase(real, this.skyAt(nuitDe(date)), this.nuitVol.k) : real;
    const phase = this.nuitVol.k > 0 ? { ...nuit, weather: orageDuVol(nuit.weather, this.nuitVol.k) } : nuit;
    this.phase = phase;
    // Orage : l'éclair de cet instant (ou rien), qui éclaire la scène, durcit les ombres et allume la pluie ; sur le
    // phare, pendant le vol du conseil, les deux coups qui frappent près de la tour (WorldView, phare.js)
    const orage = this.conseilFoudre(now) || eclairAt(t, phase.weather.storm);
    const flash = orage ? orage.flash : 0;
    this.itemHits = [];
    this.nameSignHits = [];
    this.syncClock(real, date, now);
    // Les fêtes de cette image (un bâtiment construit ou qui gagne un palier : world/fetes.js)
    const fetes = this.fetesNow(now);
    // Le liseré des bâtiments et des arbres : doré à l'heure dorée, blanc à l'éclair (ses images restent le temps de
    // l'heure dorée ou de l'orage, puis partent)
    const rim = rimOf(phase) || eclairRimOf(orage);
    imageSuivanteRims();
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
    const filante = ciel > 0.02 ? filanteAt(t, pluieOf(date, SEASON)) : null;
    const file = filante && filante.cycle !== this.filanteCaught ? filante : null;
    return { ctx, width, height, dpr, s, t, date, phase, orage, flash, fetes, view, arc, arcGeo, ciel, file };
  }
};
