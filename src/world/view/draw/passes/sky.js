// Le ciel et la lumière (draw/loop.js : draw) : mouettes en vol, carte de lumière de l'heure, pluie, arc-en-ciel, le
// temps qu'il fait, l'aurore, l'étoile filante, l'étalonnage. Méthodes de WorldView.vue (this : le composant), réunies
// par draw.js.
import { drawClouds, drawTint, drawWeather, drawWeatherMonde } from '@/world/scene';
import { luneDuVol } from '@/world/lumiere/nuitDuConseil';
import { drawLightmap, drawEclair, eclatAt, lueurOf, drawEclat, flashTint, drawArcEnCiel, drawPluie, drawRefletsPluie, drawRays, refletOf, teteOf, cielDe, drawFilante, drawPaillettes, drawGolden, poserLiseres, drawLiseres, drawEtalonnage, slantOf, auroreOf, colonnesOf, lumieresAurore, drawAurore, libererAurore, brumeAutomne, drawNeige } from '@/world/lumiere';
import { lumierePhenix } from '@/world/phenix';
import { drawBras, drawApercu } from '@/world/faune';
import { drawFlyingGull } from '@/world/sea';
import { mixToward, climateAt, drawClimate, drawClimatMonde } from '@/world/climates';
import { TW } from '../../constants';
import { SEASON } from '@/world/plants';

// Le Kraken est-il à l'écran (son centre, avec une marge d'une case) ?
const seenKraken = (kr, view, ground) => { const c = ground(kr.x, kr.y); return c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW && c.y < view.y + view.h + TW; };

export default {
  drawSkyPass({ now, ctx, width, height, dpr, s, t, date, phase, orage, flash, view, arc, arcGeo, ciel, file, phare, kraken, apercu, rainK, life, worldTransform, climatOf, climats }) {
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
    // La pluie, dans le monde : chaque goutte tombe jusqu'à son point de chute et y éclabousse ; la lumière de l'heure la
    // prend ensuite (une goutte s'allume dans le halo d'une lanterne). De loin, moins de gouttes (lumiere/pluie.js)
    // (en hiver, elle tombe en neige : lumiere/saisons.js)
    // (pendant le vol du conseil, l'orage se voit aussi de loin : la pluie ne s'éclaircit plus avec le zoom ; elle suit
    // toujours la qualité des particules de l'appareil)
    const densPluie = this.fxQ * Math.max(this.nuitVol.k, Math.min(1, (s / 0.8) ** 2));
    if (phase.weather.rain > 0.02 && SEASON === 'hiver') drawNeige(ctx, view, t, rainK, densPluie);
    else if (phase.weather.rain > 0.02) drawPluie(ctx, view, t, rainK, phase.night, flash, { slant: slantOf(t), dens: densPluie });
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
    // (une nuit d'aurore, sa lumière verdit la neige des sommets et la mer voisine : dans la carte de lumière seulement,
    // pas dans les lumières de l'image d'avant, devant lesquelles le Voile recule : elle luit sur la brume sans la lever)
    const aurore = auroreOf(phase, date);
    const crete = aurore > 0.02 ? this.creteAurore() : null;
    // (une lumière loin hors de la vue n'éclaire rien qu'on voie : ni la carte ni les halos ne la peignent ; sa portée
    // et son halo restent sous quatre fois son rayon. Le Voile et les reflets sur la mer gardent toutes les lumières)
    const vue = l => l.x + l.r * 4 > view.x && l.x - l.r * 4 < view.x + view.w && l.y + l.r * 4 > view.y && l.y - l.r * 4 < view.y + view.h;
    if (!crete) libererAurore();
    // (ce que les liserés des personnages éclairent encore, devant quoi rien ne s'est dessiné ; ils brillent après le voile)
    const liseres = this.liseres ? poserLiseres(ctx, this.liseres.liste) : null;
    this.liseres = null;
    if (!drawLightmap(ctx, this.geo, phase, worldTransform, crete ? [...lights, ...lumieresAurore(crete, aurore)] : lights, flash, vue)) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawTint(ctx, width, height, flash > 0.01 ? { ...phase, tint: flashTint(phase.tint, flash) } : phase);
    }
    // L'arc-en-ciel, accroché à l'île
    if (arcGeo) drawArcEnCiel(ctx, this.geo, worldTransform, arcGeo, arc, now - this.arcBorn, t, this.reduced());
    // Le temps qu'il fait, posé sur l'île (rien de collé à l'écran) : la lumière de l'éclair, l'éclat en paliers des gros
    // coups (pas en mouvement réduit : une île qui s'illumine d'un coup) ou la lueur qui suit le flash, puis le tracé, qui
    // frappe un point de l'île ou de la mer (lumiere/eclairs.js) ; la lueur du soleil bas et les bancs de brume
    // (scene.js) ; l'heure dorée ; les lumières qui se reflètent sur le sol mouillé ; les rayons du soleil bas
    ctx.setTransform(worldTransform);
    drawEclat(ctx, view, (!this.reduced() && eclatAt(t, phase.weather.storm)) || lueurOf(orage));
    drawEclair(ctx, view, orage);
    drawWeatherMonde(ctx, view, t, phase, this.terrain.bounds, brumeAutomne(phase, date, SEASON));
    drawGolden(ctx, view, phase, this.terrain.bounds);
    drawRefletsPluie(ctx, view, t, rainK, phase.night, lights, s, SEASON === 'hiver');
    drawRays(ctx, view, t, phase, s);
    // Une nuit d'aurore, ses rideaux pendent haut au-dessus des sommets, verts et violets, et se plissent lentement
    // (immobiles en mouvement réduit : lumiere/aurore.js)
    if (crete) drawAurore(ctx, colonnesOf(crete, view, this.reduced() ? 0 : t, aurore));
    // L'étoile filante tout en haut du ciel, à peine (on la voit surtout dans l'eau), dans le monde ; elle se touche là
    // ou dans son reflet (le doigt, à l'écran), et éclate en paillettes, dans le monde (view/gestures.js)
    if (file) drawFilante(ctx, cielDe(file.cycle, view), file, ciel * 0.45, t);
    this.filanteHit = file && file.k < 1 ? [file, refletOf(file)].map(f => {
      const p = teteOf(f, cielDe(file.cycle, view));
      return { ...this.toScreen(p.x, p.y), wx: p.x, wy: p.y, cycle: file.cycle };
    }) : null;
    if (this.paillettes && !drawPaillettes(ctx, this.paillettes, performance.now())) this.paillettes = null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // (le voile laiteux de la brume : un étalonnage, sans forme)
    drawWeather(ctx, width, height, t, phase);
    const here = this.cellAt(this.cam.x, this.cam.y);
    this.climateMix = mixToward(this.climateMix, climateAt(this.M, this.state.map.zones, here.x, here.y), this.climateT ? Math.min(0.5, t - this.climateT) : 1);
    this.climateT = t;
    // (la teinte du climat visé : un étalonnage, sans forme)
    drawClimate(ctx, width, height, this.climateMix);
    // L'étalonnage de l'heure : ombres, tons moyens et lumières prennent chacun leur couleur (lumiere/etalonnage.js)
    drawEtalonnage(ctx, width, height, phase);
    // La nuit de la veillée : la magie par-dessus tout le décor (draw/veillee.js)
    this.drawVeillee(ctx, width, height);
    // Le liseré vivant des personnages, en lumière par-dessus le voile de la nuit (lumiere/lisere.js)
    drawLiseres(ctx, liseres);
    ctx.setTransform(worldTransform);
    // (ses nappes de brume qui luisent et ses lucioles, posées sur l'île)
    this.drawVeilleeMonde(ctx, view, t, s);
    return { sources, brume, vue };
  }
};
