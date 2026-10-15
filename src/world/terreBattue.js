// La terre battue sous les bâtiments et les chantiers (loop.js) : à la place d'un aplat de cases beige, une seule
// tache de terre par emprise, aux bords arrondis et un peu irréguliers, qui se fond dans le sol autour (trois couches
// de plus en plus serrées), semée d'un peu de grain (des mouchetures sombres et claires, de rares cailloux). Choix de
// l'auteur, 15 oct. : à peine visible, la texture du sol dessous (herbe, sable, neige) doit rester ce qu'on voit.
// Bâti : la terre tassée, claire ; chantier : la terre remuée, plus sombre. Le dessin d'une emprise est calculé une
// fois (le hasard est tiré de sa place, il ne bouge pas d'une image à l'autre), puis rejoué à chaque image.
import { hash } from '@/world/scene';

const TERRE = {
  bati: { fond: [201, 171, 124], sombre: 'rgba(112, 80, 46, .16)', clair: 'rgba(255, 244, 214, .2)' },
  chantier: { fond: [173, 136, 88], sombre: 'rgba(92, 62, 32, .2)', clair: 'rgba(240, 220, 180, .2)' }
};
// (de la plus large à la plus serrée, toutes légères : le sol se voit au travers, le bord se fond)
const COUCHES = [[1, 0.07], [0.88, 0.1], [0.76, 0.14]];
const POINTS = 28;
const cache = new Map();

// Le bord d'une couche : un carré arrondi (super-ellipse) de l'emprise, en cases (a le long de x, b le long de y),
// un peu irrégulier
function bord(w, h, k, seed) {
  return Array.from({ length: POINTS }, (_, i) => {
    const t = (i / POINTS) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    const r = k * (1 + 0.07 * (hash(seed + i, k * 10) - 0.5) * 2);
    return [Math.sign(c) * Math.abs(c) ** 0.5 * (w / 2) * r, Math.sign(s) * Math.abs(s) ** 0.5 * (h / 2) * r];
  });
}

// Le dessin d'une emprise (w × h cases, en place x, y), en cases autour de son centre
export function terreOf(x, y, w, h) {
  const key = `${x},${y},${w},${h}`;
  if (cache.has(key)) return cache.get(key);
  const seed = x * 31 + y * 17;
  const couches = COUCHES.map(([k, a]) => ({ a, bord: bord(w, h, k, seed + k * 100) }));
  // le grain : dans la tache serrée seulement (pas de mouchetures sur le sol d'à côté)
  const grain = [];
  for (let i = 0, n = Math.round(7 * w * h); i < n; i++) {
    const a = (hash(seed + i, 1.3) - 0.5) * w * 0.8, b = (hash(seed + i, 2.7) - 0.5) * h * 0.8;
    if ((Math.abs(a) / (w * 0.4)) ** 4 + (Math.abs(b) / (h * 0.4)) ** 4 > 1) continue;
    const q = hash(seed + i, 4.1);
    grain.push({ a, b, sorte: q < 0.6 ? 'sombre' : q < 0.95 ? 'clair' : 'caillou', r: 0.6 + hash(seed + i, 5.9) });
  }
  const dessin = { couches, grain };
  cache.set(key, dessin);
  return dessin;
}

// La tache d'une emprise, centrée en c (le centre de l'emprise à l'écran du monde) ; tw, th : une case
export function drawTerreBattue(ctx, site, c, tw, th) {
  const { couches, grain } = terreOf(site.x, site.y, site.w, site.h);
  const t = site.level ? TERRE.bati : TERRE.chantier;
  const px = (a, b) => [c.x + (a - b) * tw / 2, c.y + (a + b) * th / 2];
  for (const { a, bord: pts } of couches) {
    ctx.beginPath();
    pts.forEach(([u, v], i) => { const [x, y] = px(u, v); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = `rgba(${t.fond.join(', ')}, ${a})`;
    ctx.fill();
  }
  const k = tw / 64;
  for (const g of grain) {
    const [x, y] = px(g.a, g.b);
    if (g.sorte === 'caillou') {
      ctx.fillStyle = 'rgba(70, 50, 30, .2)';
      ctx.beginPath(); ctx.ellipse(x, y + 0.8 * k, 2.2 * g.r * k, 1.2 * g.r * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(181, 174, 156, .7)';
      ctx.beginPath(); ctx.ellipse(x, y, 2 * g.r * k, 1.1 * g.r * k, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = t[g.sorte];
      ctx.beginPath(); ctx.ellipse(x, y, 2.4 * g.r * k, 1 * g.r * k, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
}
