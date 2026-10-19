// Par-dessus tout (draw/loop.js : draw) : halos, éclats et braises, lueurs de la nuit (plancton, méduses, jungle, Géant,
// Kraken), puis Brume, les noms des lieux, les bulles, ce qui est choisi. Méthodes de WorldView.vue (this : le
// composant), réunies par draw.js.
import { drawHalos, hazeOf, drawMotes, drawJungleNuit, drawEffetsNuit, drawBraises, drawAllumages } from '@/world/lumiere';
import { drawLueursGeant, drawGeyser, drawLueursKraken, drawLueursBancs } from '@/world/faune';
import { drawPlankton, drawJellies } from '@/world/sea';
import { drawClimatMonde } from '@/world/climates';
import { SEASON } from '@/world/plants';

// Les braises d'un fanal de la Route des feux : bien moins que le grand feu de camp (une vasque, pas un bûcher ; en
// lumière qui s'ajoute, trop de braises se fondaient en un trait blanc)
const FANAL_BRAISES = 0.35;

export default {
  drawGlowPass({ now, ctx, s, t, phase, fetes, view, water, bancs, geant, kraken, near, life, seenAt, repaint, climatOf, climats, effets, sources, vue }) {
    // Halos des sources déjà rangées pour la carte de lumière (rien n'est recalculé)
    drawHalos(ctx, sources.filter(vue), hazeOf(phase), t);
    // Éclats de lumière dans l'air de l'île, posés dans le monde (pas en mouvement réduit)
    if (!this.reduced()) drawMotes(ctx, view, t, phase, s, SEASON);
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
    drawPlankton(ctx, water.live.shore, view, t, phase.night);
    if (life.jellies) drawJellies(ctx, life.jellies, view, t, phase.night);
    drawLueursBancs(ctx, bancs, phase.night);
    // (et la jungle de la zone de départ : ses plantes, draw/nature.js ; sa mousse, ses lucioles et ses spores,
    // lumiere/jungle.js, pas en mouvement réduit)
    if (!this.reduced()) drawJungleNuit(ctx, this.M, view, t, phase, this.lightGate(now), s);
    if (effets.length) drawEffetsNuit(ctx, effets, t, phase, prop => this.plantAlpha(prop));
    if (phase.night >= 0.02) this.drawLueursJungle(ctx, (this.jungleGlows || []).filter(prop => seenAt(prop.wx, prop.wy)), t, phase.night, near, repaint);
    ctx.restore();
    if (geant) {
      drawLueursGeant(ctx, geant, t, phase.night);
      drawGeyser(ctx, geant);
    }
    if (kraken) drawLueursKraken(ctx, kraken, t, phase.night);
  },
  drawOverlayPass({ now, ctx, dpr, s, t, fetes, missing, seen, repaint, brume }) {
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
  }
};
