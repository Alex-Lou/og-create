// La Route des feux sur l'île (world/feux.js) : les fanaux des Anciens près des lieux découverts, éteints (braises
// froides, un filet de fumée) ou rallumés (la flamme penche au vent, fume, lance ses braises, éclaire l'île la nuit et
// se voit de loin). Méthodes de WorldView.vue (this : le composant), réunies par draw.js.
// Ce qui coûte est fait une fois : le fanal est un dessin gardé (spriteCache), la flamme, son cœur et l'éclat du loin
// sont trois petites images dessinées une fois puis posées tournées et étirées ; rien n'est calculé pour un fanal hors
// de l'écran.
import { drawSprite } from '@/world/spriteCache';
import { sprite, P } from '@/world/iso';
import { feuxOf, feuAt, flammeOf, VASQUE, VOILE_RECULE } from '@/world/feux';
import { TW } from '../constants';

/* ---------- Le fanal (dessin gardé, éteint ou allumé) ---------- */

const PIERRE = { haut: '#CFC7B8', clair: '#A9A192', sombre: '#7B7366', trait: '#4A443C' };
const BOX = { x: -16, y: -36, w: 32, h: 44 };
function fanalSvg(vif) {
  const { haut, clair, sombre, trait } = PIERRE;
  const rune = vif ? '#FFC468' : '#5E574D';
  const cendre = vif
    ? '<ellipse cx="0" cy="-29.4" rx="8.6" ry="3.2" fill="#FF9A3C"/><ellipse cx="0" cy="-29.6" rx="5" ry="1.8" fill="#FFE08A"/>'
    : '<ellipse cx="0" cy="-29.4" rx="8.6" ry="3.2" fill="#4E4842"/>'
      + '<circle cx="-3.2" cy="-29.8" r="1" fill="#7A716A"/><circle cx="2.6" cy="-29" r="1.1" fill="#7A716A"/>'
      + '<circle cx="0.4" cy="-30.2" r="0.8" fill="#8E3A22"/><circle cx="-1.6" cy="-28.6" r="0.6" fill="#8E3A22"/>';
  return '<ellipse cx="0" cy="1" rx="13" ry="5" fill="rgba(40,30,20,.28)"/>'
    // le socle
    + `<polygon points="-12,-3 0,3 0,6 -12,0" fill="${clair}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<polygon points="0,3 12,-3 12,0 0,6" fill="${sombre}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<polygon points="-12,-3 0,-9 12,-3 0,3" fill="${haut}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    // le pilier, et les signes des Anciens gravés dans sa face éclairée (ils rougeoient quand le feu brûle)
    + `<polygon points="-6,-5 0,-2 0,-25 -6,-28" fill="${clair}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<polygon points="0,-2 6,-5 6,-28 0,-25" fill="${sombre}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<path d="M-4.2,-20 L-1.8,-18.6 M-3,-19.3 L-3,-14.6 M-4.2,-12.4 L-1.8,-11" stroke="${rune}" stroke-width="1" stroke-linecap="round" fill="none"/>`
    + '<path d="M-6,-9 Q-4,-11 -2.4,-8.6" stroke="#7FA060" stroke-width="1.4" stroke-linecap="round" fill="none"/>'
    // la vasque
    + `<path d="M-11,-29 Q-9,-22 0,-21 Q9,-22 11,-29 Z" fill="${sombre}" stroke="${trait}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<ellipse cx="0" cy="-29" rx="11" ry="4.6" fill="${haut}" stroke="${trait}" stroke-width=".8"/>`
    + cendre;
}
const FANAL = {
  froid: { key: 'feu-fanal-froid', make: () => sprite(fanalSvg(false), BOX) },
  vif: { key: 'feu-fanal-vif', make: () => sprite(fanalSvg(true), BOX) }
};

/* ---------- La flamme, son cœur, l'éclat du loin (trois images, dessinées une fois) ---------- */

let langue = null;
function langueImg() {
  if (langue) return langue;
  langue = document.createElement('canvas');
  langue.width = 24;
  langue.height = 64;
  const g = langue.getContext('2d');
  const grad = g.createLinearGradient(0, 64, 0, 0);
  grad.addColorStop(0, 'rgba(255,246,200,1)');
  grad.addColorStop(0.3, 'rgba(255,196,74,1)');
  grad.addColorStop(0.68, 'rgba(255,112,40,.85)');
  grad.addColorStop(1, 'rgba(214,58,30,0)');
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(12, 64);
  g.bezierCurveTo(-2, 60, 1, 34, 12, 0);
  g.bezierCurveTo(23, 34, 26, 60, 12, 64);
  g.fill();
  return langue;
}
let coeur = null;
function coeurImg() {
  if (coeur) return coeur;
  coeur = document.createElement('canvas');
  coeur.width = coeur.height = 32;
  const g = coeur.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,252,230,1)');
  grad.addColorStop(0.4, 'rgba(255,222,140,.7)');
  grad.addColorStop(1, 'rgba(255,170,70,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return coeur;
}
let eclat = null;
function eclatImg() {
  if (eclat) return eclat;
  eclat = document.createElement('canvas');
  eclat.width = eclat.height = 64;
  const g = eclat.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,246,214,1)');
  grad.addColorStop(0.16, 'rgba(255,196,110,.75)');
  grad.addColorStop(0.5, 'rgba(255,150,70,.16)');
  grad.addColorStop(1, 'rgba(255,140,60,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  // quatre rais fins, comme une lumière vue de loin à travers l'air humide
  g.globalCompositeOperation = 'lighter';
  for (const [w, h] of [[64, 2], [2, 44]]) {
    const ray = g.createRadialGradient(32, 32, 0, 32, 32, Math.max(w, h) / 2);
    ray.addColorStop(0, 'rgba(255,236,190,.8)');
    ray.addColorStop(1, 'rgba(255,200,120,0)');
    g.fillStyle = ray;
    g.fillRect(32 - w / 2, 32 - h / 2, w, h);
  }
  return eclat;
}

// Les trois langues de la flamme : [décalage, taille, phase]
const LANGUES = [[-3.2, 0.62, 1.7], [3.4, 0.56, 3.1], [0, 1, 0]];
function drawFlamme(ctx, x, y, f, t, seed) {
  const img = langueImg();
  for (const [dx, k, ph] of LANGUES) {
    const lick = 0.85 + 0.15 * Math.sin(t * 11 + ph + seed);
    const h = 20 * f.haut * k * lick;
    const w = 9 * k * (0.9 + 0.1 * Math.sin(t * 8.3 + ph));
    ctx.save();
    ctx.translate(x + dx, y + 1);
    ctx.rotate(f.penche * (0.8 + 0.2 * k) + 0.07 * Math.sin(t * 6.7 + ph + seed));
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  }
  // le cœur blanc de la flamme, en lumière qui s'ajoute
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.55 + 0.35 * f.vif;
  const r = 7 * f.haut;
  ctx.drawImage(coeurImg(), x - r + f.penche * 3, y - r * 1.1, r * 2, r * 2);
  ctx.restore();
}

// La fumée : quelques bouffées qui montent, grossissent, s'effacent et partent avec le vent (froid : un mince filet)
function drawFumee(ctx, x, y, t, seed, lit, k, night, penche) {
  const n = lit ? 4 : 3;
  // (celle d'un feu allumé reste sombre : sa propre lumière l'éclaire déjà, une fumée claire y ferait une colonne blanche)
  const tone = lit ? (night > 0.5 ? '70,66,72' : '120,114,110') : night > 0.5 ? '160,165,190' : '226,222,214';
  for (let i = 0; i < n; i++) {
    const age = (t * (lit ? 0.3 : 0.22) + i / n + seed * 0.1) % 1;
    const px = x + age * (8 + 26 * penche) + Math.sin(age * 5 + seed + i) * 2;
    const py = y - age * (lit ? 46 : 32);
    const a = (lit ? 0.2 : 0.32) * k * Math.min(1, age * 6) * (1 - age);
    if (a < 0.01) continue;
    ctx.fillStyle = `rgba(${tone},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(px, py, (lit ? 2.6 : 1.5) + age * (lit ? 7 : 4.5), 0, Math.PI * 2);
    ctx.fill();
  }
}

// Une graine propre à chaque feu (ils ne battent pas ensemble)
const seedOf = id => { let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 1000; return h / 97; };

export default {
  // Les fanaux de l'île (world/feux.js : feuxOf), relus seulement quand l'état change
  feuxShown() {
    if (!this.feux || this.feux.state !== this.state) this.feux = { state: this.state, list: feuxOf(this.state).map(f => ({ ...f, seed: seedOf(f.id) })) };
    return this.feux.list;
  },
  // Le pied du fanal, dans le monde
  feuFoot(feu) {
    const c = this.ground(feu.x, feu.y);
    const [dx, dy] = P(...feuAt(feu.id));
    return { x: c.x + dx, y: c.y + dy };
  },
  // Ce qui se voit d'un fanal à l'écran : rien sous la brume du tutoriel ; à demi pendant que la brume d'un quartier
  // qu'on vient d'acheter s'efface (comme son lieu)
  feuxSeen(view) {
    return this.feuxShown().filter(feu => {
      if (this.hiddenCell(feu.x, feu.y)) return false;
      const c = this.feuFoot(feu);
      return c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW && c.y < view.y + view.h + TW * 1.5;
    });
  },
  // Le fanal, debout près de son lieu (rangé juste devant lui), et sa flamme ou son filet de fumée
  drawFeu(ctx, feu, t, now, phase, repaint) {
    const foot = this.feuFoot(feu);
    const zone = this.zoneAt(feu.x, feu.y);
    const mist = this.mistOf(zone, now);
    const t0 = this.reduced() ? 0 : t;
    ctx.save();
    if (mist) ctx.globalAlpha = 1 - this.mistFade(0.5, zone) * mist;
    const art = feu.lit ? FANAL.vif : FANAL.froid;
    drawSprite(ctx, art.key, art.make, foot.x, foot.y, repaint, `feu:${feu.id}`);
    const y = foot.y - VASQUE;
    if (feu.lit) {
      const f = flammeOf(phase, feu.x, feu.y, t0, feu.seed);
      drawFumee(ctx, foot.x + f.penche * 10, y - 18 * f.haut, t0, feu.seed, true, f.fumee, phase.night, f.penche);
      drawFlamme(ctx, foot.x, y, f, t0, feu.seed);
    } else {
      // les braises froides : un filet de fumée, et une lueur qui revient de loin en loin dans la cendre
      drawFumee(ctx, foot.x, y - 1, t0, feu.seed, false, 1, phase.night, 0.2);
      const pulse = Math.pow(Math.max(0, Math.sin(t0 * 0.9 + feu.seed)), 8);
      if (pulse > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha *= 0.35 * pulse;
        ctx.drawImage(coeurImg(), foot.x - 4, y - 4, 8, 6);
      }
    }
    ctx.restore();
  },
  // Les sources de lumière des feux rallumés (air.js : drawLights) ; shown : la règle de l'image (lightGate)
  feuxLights(emit, ctx, t, phase, shown) {
    const t0 = this.reduced() ? 0 : t;
    for (const feu of this.feuxShown()) {
      if (!feu.lit) continue;
      const on = shown(feu.x, feu.y);
      if (!on) continue;
      const foot = this.feuFoot(feu);
      const f = flammeOf(phase, feu.x, feu.y, t0, feu.seed);
      emit(ctx, foot.x + f.penche * 4, foot.y - VASQUE - 8, f.portee, on * f.lumiere, '255,168,82', true, foot.y);
    }
  },
  // Le Voile recule autour des feux rallumés, de jour comme de nuit (air.js : drawWisps)
  feuxClearing() {
    return this.feuxShown().filter(feu => feu.lit && !this.hiddenCell(feu.x, feu.y)).map(feu => {
      const foot = this.feuFoot(feu);
      return { x: foot.x, y: foot.y - VASQUE, r: TW * VOILE_RECULE, k: 0.9 };
    });
  },
  // L'ombre portée des fanaux (loop.js : drawShadows), comme celle des bâtiments
  feuxShadows() {
    return this.feuxShown().filter(feu => !this.hiddenCell(feu.x, feu.y)).map(feu => {
      const foot = this.feuFoot(feu);
      return { x: foot.x, y: foot.y - 2, hw: 0.1, hh: 0.1, h: VASQUE };
    });
  },
  // Le haut des flammes, pour les braises qui s'en échappent (loop.js : drawBraises)
  feuxBraises(view) {
    return this.feuxSeen(view).filter(feu => feu.lit).map(feu => {
      const foot = this.feuFoot(feu);
      return { x: foot.x, y: foot.y - VASQUE - 12 };
    });
  },
  // Vus de loin : chaque feu rallumé reste un point de lumière, quelle que soit la distance (la nuit, l'île devient la
  // carte de ce qu'on a fait). s : l'échelle de l'écran ; l'éclat garde au moins quelques pixels à l'écran
  drawFeuxLointains(ctx, view, t, phase, s) {
    const t0 = this.reduced() ? 0 : t;
    const force = 0.2 + 0.8 * Math.min(1, phase.lit || 0);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const feu of this.feuxSeen(view)) {
      if (!feu.lit) continue;
      const foot = this.feuFoot(feu);
      const f = flammeOf(phase, feu.x, feu.y, t0, feu.seed);
      const r = Math.max(9, 7 / s) * (0.9 + 0.1 * f.vif);
      // (de près, la flamme et son halo suffisent : l'éclat s'efface à mesure qu'on s'approche)
      ctx.globalAlpha = Math.min(1, force * f.vif * Math.max(0.15, Math.min(1, 1 - (s - 0.5) * 1.7)));
      ctx.drawImage(eclatImg(), foot.x - r, foot.y - VASQUE - 9 - r, r * 2, r * 2);
    }
    ctx.restore();
  }
};
