// Brume sur l'île : où elle flotte, son dessin, sa lumière et le vol du Phénix. Méthodes de WorldView.vue (this : le
// composant), réunies par draw.js ; ce que fait un toucher sur elle (sa quête, le serveur) vit dans
// components/World/WorldView/brumeQuest.js.

import { landmarksShown } from '@/world/landmarks';
import { floatOf, joyHop, JOY_MS, BRUME_ALT, drawBrume, BRUME_REACH, WISP, toneOf, moodOf, motionOf, glideStep, GLIDE_WAIT_S } from '@/world/brume';
import { brumeArtLayer, drawBrumeArt } from '@/world/brumeArt';
import { PHENIX_EVERY, PHENIX_FOR, PHENIX_DECALE, phenixHeure, phenixAt, drawPhenix } from '@/world/phenix';
import { questShort } from '@/game/prologue';
import { TW, TH } from '../constants';

export default {
  // Où flotte Brume (point au sol) : à côté du bâtiment, du lieu ou du panneau du quartier que vise la quête active (un
  // lieu d'un quartier encore inconnu : devant ce quartier, à explorer d'abord), sinon près du Foyer
  brumeSpot() {
    const target = this.quest && this.quest.target;
    const hidden = target && target.landmark && (this.state.landmarks || []).find(l => l.id === target.landmark && l.known === false);
    const zoneId = target && (target.zone || (hidden && hidden.zone));
    const zone = zoneId && this.state.map.zones.find(z => z.id === zoneId);
    if (zone && zone.anchor) {
      const g = this.ground(zone.anchor.x, zone.anchor.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const place = target && target.landmark && landmarksShown(this.state).find(l => l.id === target.landmark);
    if (place) {
      const g = this.ground(place.x, place.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const site = this.state.sites.find(s => s.id === ((target && (target.site || target.villager)) || 'foyer'));
    if (!site) return null;
    const c = this.centerOf(site);
    return { x: c.x - TW * 0.42 * site.w, y: c.y - TH * 0.15 };
  },
  // Le vol du Phénix (world/phenix.js) : une fois le Phénix écrit, du coucher du soleil à l'aube, de temps en temps,
  // quand aucune récompense n'attend ; il fait le tour de ce qu'on regardait quand il s'est envolé ; null hors vol
  phenixOf(t, view, phase) {
    const u = t - PHENIX_DECALE;
    if (u < 0 || !(this.elements || []).includes('Phénix') || !phenixHeure(phase) || (this.quest && this.quest.done)) return null;
    const cycle = Math.floor(u / PHENIX_EVERY), τ = u - cycle * PHENIX_EVERY;
    const spot = τ < PHENIX_FOR && this.brumeSpot();
    if (!spot) return null;
    let p = this.passages.phenix;
    if (!p || p.cycle !== cycle) p = this.passages.phenix = { cycle, centre: { x: view.x + view.w / 2, y: view.y + view.h * 0.56 }, rayon: Math.min(420, Math.max(110, view.w * 0.27)) };
    return phenixAt({ x: spot.x, y: spot.y - BRUME_ALT, g: spot.y }, p.centre, p.rayon, τ);
  },
  // Où est Brume à l'instant t : son point au sol (spot), sa flamme (x, y), la récompense qui attend (ready), son
  // humeur (mood) et son étirement (sx, sy) ; null si elle n'est nulle part. Sa lumière et son dessin le lisent une fois
  // par image : ils ne se décalent jamais.
  // Animée selon ce qu'elle vit (choix de l'auteur, 8 oct. ; world/brume.js : moodOf, motionOf) : elle sautille quand la
  // récompense attend, sursaute à une quête nouvelle puis glisse vers sa nouvelle place (jamais de saut), frémit gênée
  // quand il manque de quoi payer, somnole la nuit ; sa joie (une quête réclamée) garde son saut (joyHop)
  brumeAt(t) {
    const target = this.brumeSpot();
    if (!target) {
      this.brumeGlide = null;
      return null;
    }
    const still = this.reduced();
    const sinceQuest = this.brumeQuestAt ? t - this.brumeQuestAt : Infinity;
    // (sur place le temps du sursaut, puis elle glisse)
    const from = this.brumeGlide;
    const spot = from && !still ? (sinceQuest < GLIDE_WAIT_S ? from.at : glideStep(from.at, target, Math.min(0.1, t - from.t))) : target;
    this.brumeGlide = { at: spot, t };
    const ready = Boolean(this.quest && this.quest.done);
    const joyFor = this.brumeJoy ? performance.now() - this.brumeJoy : Infinity;
    const short = Boolean(this.quest && !ready && this.state && questShort(this.quest, this.state, this.stockPaid));
    const mood = still ? (ready ? 'pret' : 'neutre')
      : moodOf({ joy: joyFor >= 0 && joyFor < JOY_MS, ready, short, night: Boolean(this.phase && this.phase.night > 0.6), sinceQuest, t });
    const m = still ? { dx: 0, dy: 0, sx: 1, sy: 1 } : motionOf(mood, t, sinceQuest);
    const { dx, dy } = floatOf(t);
    // (une quête réclamée : elle bondit de joie)
    const x = spot.x + dx + m.dx, y = spot.y - BRUME_ALT + dy + m.dy - (this.brumeJoy ? joyHop(joyFor) : 0);
    return { spot, x, y, ready, mood, sx: m.sx, sy: m.sy };
  },
  // La nuit, Brume éclaire autour d'elle, à sa couleur (choix de l'auteur, 15 oct. : le froid magique du feu follet
  // contre le chaud des feux et des fenêtres) : une lueur dans l'air autour de la flamme, et une flaque au sol sous
  // elle (elle vole trop haut pour que la flaque d'une source y tombe). Pour la carte de lumière seulement : son halo,
  // elle le dessine elle-même. at : brumeAt ; s : échelle de la caméra (sa taille minimale quand on voit toute l'île).
  // En vol, le Phénix éclaire à sa place (lumierePhenix)
  brumeLights(at, phase, t, s) {
    if (!at || this.phenix || phase.lit <= 0.01) return [];
    // (sa teinte blanchie de moitié : la carte de lumière rend au sol ses couleurs, la lueur froide vient par-dessus)
    const color = this.brumeTone(at).split(',').map(c => Math.round(+c + (255 - c) * 0.55)).join(',');
    const k = Math.max(1, 0.6 / s);
    const breath = phase.lit * (0.92 + 0.08 * Math.sin(t * 3));
    const ground = at.spot.y;
    return [
      { x: at.x, y: at.y, r: 34 * k, k: 0.45 * breath, color, pool: false, gy: ground },
      { x: at.spot.x, y: ground - 8 * k, r: 24 * k, k: 0.35 * breath, color, pool: true, gy: ground, sol: true }
    ];
  },
  // La couleur de sa lueur (« r,g,b ») : celle de son stade, dorée quand la récompense attend
  brumeTone(at) {
    return (at.ready ? WISP.ready : toneOf(this.brumeState)).halo;
  },
  // La nuit, sa lueur froide posée sur le sol, en addition par-dessus la nuit : la carte de lumière ne fait que rendre
  // au sol ses couleurs de plein jour (sur l'herbe, un vert acide) ; c'est cette lueur qui dit le feu follet
  drawBrumeGlow(ctx, at, t, s) {
    const lit = this.phase ? this.phase.lit : 0;
    if (lit <= 0.01) return;
    const color = this.brumeTone(at);
    const r = 54 * Math.max(1, 0.6 / s);
    const a = lit * 0.5 * (0.92 + 0.08 * Math.sin(t * 3));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(at.spot.x, at.spot.y);
    ctx.scale(1, 0.5);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${color},${a.toFixed(3)})`);
    g.addColorStop(0.45, `rgba(${color},${(a * 0.45).toFixed(3)})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  },
  drawBrume(ctx, t, s, at = this.brumeAt(t)) {
    this.phenixHit = null;
    if (!at) {
      this.brumeHit = null;
      return;
    }
    // En vol, le Phénix prend sa place (un toucher : une gerbe de braises)
    const ph = this.phenix;
    if (ph) {
      const touche = this.scared.get('phenix');
      drawPhenix(ctx, ph, t, s, touche ? touche.at : null);
      this.brumeHit = null;
      this.phenixHit = { x: ph.x, y: ph.y - 8, r: BRUME_REACH * 1.6 * Math.max(1, 0.6 / s) };
      return;
    }
    const { spot, x, y, ready, mood, sx, sy } = at;
    this.drawBrumeGlow(ctx, at, t, s);
    // Son dessin de la bibliothèque (son stade, son expression), à la taille du feu follet par code, qui le remplace en
    // attendant ; étiré ou écrasé par son humeur, autour du bas de la flamme
    const still = this.reduced();
    const layer = brumeArtLayer(this.brumeState, ready, still ? 0 : t, mood);
    const k = Math.max(1, 0.6 / s);
    const r = (this.brumeState.sun ? 6.5 : 8) * k;
    ctx.save();
    if (sx !== 1 || sy !== 1) {
      ctx.translate(x, y);
      ctx.scale(sx, sy);
      ctx.translate(-x, -y);
    }
    if (!layer || !drawBrumeArt(ctx, layer, x, y, spot, r, this.repaintSoon)) drawBrume(ctx, x, y, spot, t, ready, s, this.brumeState);
    ctx.restore();
    if (ready && !still) this.drawBrumeSparks(ctx, x, y, r, k, t);
    this.brumeHit = { x, y, r: BRUME_REACH * k };
  },
  // Trois étincelles dorées qui montent et s'éteignent : la récompense attend
  drawBrumeSparks(ctx, x, y, r, k, t) {
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.5 + i / 3) % 1;
      ctx.fillStyle = `rgba(255,200,90,${(0.9 * (1 - p)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(t * 1.7 + i * 2.1) * r * 1.4, y - r * (1.6 + p * 2.6), (1.6 - p) * k, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
