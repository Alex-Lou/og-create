// La pluie sur la plage de nuit (PlageScene) : un peu de pluie, en biais, sur deux toiles. Derrière le personnage, les
// gouttes du fond et ce qu'elles font au sol plus loin que ses pieds ; devant lui, les gouttes proches et le sol plus
// près que ses pieds. Chaque goutte a sa profondeur (z, de 0 au loin à 1 tout près) : plus elle est proche, plus elle
// est longue, rapide et visible, et plus bas elle touche le sable. Au sol, elle éclabousse (une petite couronne) ; dans
// une flaque, elle fait un rond. Près de la lanterne, elle prend sa lumière. Un éclair éclaire toutes les gouttes.
// La scène (perso.json : plage_ciel, zones.scene) est en unités (360 × 360, son panorama de chaque côté, son sable qui
// descend) ; repere() dit où elle est posée sur la toile (le CSS la cale) : l'échelle k, et où tombent x = X0 et y = 0.
// Les gouttes couvrent ce que la toile en montre.
// (par 360 unités de large qu'on voit)
const FOND = 70, PROCHES = 14;
const FROID = [200, 214, 245], CHAUD = [255, 204, 140];
// le vent : la goutte glisse vers la gauche en tombant
const VENT = -0.2;

export function pluie(back, front, scene, repere) {
  const [, py] = scene.pieds, [lx, ly] = scene.lanterne, [X0] = scene.panorama;
  const toiles = [back, front].map(c => ({ c, g: c.getContext('2d') }));
  let w = 0, h = 0, k = 1, x0 = 0, y0 = 0, dpr = 1, raf = 0, last = 0, eclair = 0;
  // ce que la toile montre de la scène : de vx0 à vx1, de vy0 (le haut) à vy1 (le bas)
  let vx0 = 0, vx1 = 360, vy0 = 0, vy1 = 360;
  const sx = x => x0 + (x - X0) * k, sy = y => y0 + y * k;

  const neuve = (g, haut) => {
    g.z = g.proche ? 0.75 + 0.25 * Math.random() : Math.random() * 0.8;
    g.x = vx0 - 40 + Math.random() * (vx1 - vx0 + 80);
    g.y = haut ? vy0 - 20 - Math.random() * 60 : vy0 + Math.random() * (vy1 - vy0);
    // (au sol : du rivage jusqu'au bas de ce qu'on voit, plus bas pour les gouttes proches)
    g.sol = scene.rivage + 6 + Math.pow(g.z, 0.8) * (Math.min(scene.bas, vy1) - scene.rivage - 2);
    g.v = 250 + 230 * g.z;
    g.l = 4 + 10 * g.z + (g.proche ? 8 : 0);
    g.a = 0.16 + 0.3 * g.z;
    return g;
  };
  let gouttes = [];
  const traces = [];
  const flaque = (x, y) => scene.flaques.find(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);

  function taille() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = back.clientWidth;
    h = back.clientHeight;
    ({ k, x0, y0 } = repere());
    if (!(k > 0)) k = 1;
    vx0 = X0 + (0 - x0) / k; vx1 = X0 + (w - x0) / k; vy0 = (0 - y0) / k; vy1 = (h - y0) / k;
    for (const { c } of toiles) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    // autant de gouttes que la largeur vue en demande
    const n = Math.max(1, (vx1 - vx0) / 360);
    gouttes = [...Array.from({ length: Math.round(FOND * n) }, () => neuve({}, false)), ...Array.from({ length: Math.round(PROCHES * n) }, () => neuve({ proche: true }, false))];
  }
  const lumiere = (x, y) => Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * 1.3) / 80);
  const teinte = f => FROID.map((v, i) => Math.round(v + (CHAUD[i] - v) * f)).join(',');

  function pas(dt) {
    for (const g of gouttes) {
      g.y += g.v * dt;
      g.x += g.v * VENT * dt;
      if (g.y < g.sol) continue;
      const f = flaque(g.x, g.sol);
      traces.push({ x: g.x, y: g.sol, t: 0, rond: !!f, z: g.z });
      neuve(g, true);
    }
    for (let i = traces.length - 1; i >= 0; i--) { traces[i].t += dt; if (traces[i].t > (traces[i].rond ? 0.7 : 0.28)) traces.splice(i, 1); }
  }

  function dessine() {
    for (const { g } of toiles) { g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h); g.lineCap = 'round'; }
    const [gb, gf] = toiles.map(t => t.g);
    for (const g of gouttes) {
      const ctx = g.proche ? gf : gb, f = lumiere(g.x, g.y);
      const a = Math.min(0.95, g.a * (1 + 1.6 * f) + 0.5 * eclair);
      ctx.strokeStyle = `rgba(${teinte(f)},${a.toFixed(3)})`;
      ctx.lineWidth = (0.6 + 0.9 * g.z) * Math.min(1.6, k);
      ctx.beginPath();
      ctx.moveTo(sx(g.x), sy(g.y));
      ctx.lineTo(sx(g.x - g.l * VENT), sy(g.y - g.l));
      ctx.stroke();
    }
    for (const t of traces) {
      // (au sol plus loin que ses pieds : derrière lui ; plus près : devant)
      const ctx = t.y > py ? gf : gb, f = lumiere(t.x, t.y), x = sx(t.x), y = sy(t.y), s = (0.5 + t.z) * k;
      if (t.rond) {
        const p = t.t / 0.7, r = (1 + 6 * p) * s;
        ctx.strokeStyle = `rgba(${teinte(f)},${(0.5 * (1 - p)).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // la couronne : deux gouttelettes qui sautent et retombent
        const p = t.t / 0.28, up = Math.sin(p * Math.PI) * 3 * s;
        ctx.fillStyle = `rgba(${teinte(f)},${(0.55 * (1 - p) + 0.3 * eclair).toFixed(3)})`;
        for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(x + d * p * 3 * s, y - up, 0.5 * s + 0.3, 0, Math.PI * 2); ctx.fill(); }
      }
    }
  }

  function boucle(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    pas(dt);
    dessine();
    raf = requestAnimationFrame(boucle);
  }
  // la page cachée : la pluie s'arrête (rien ne tourne pour rien) ; elle reprend où elle en était
  const vue = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(boucle); }
  };
  const observe = new ResizeObserver(() => { taille(); dessine(); });

  taille();
  observe.observe(back);
  return {
    // mouvement réduit : une seule image, immobile
    fixe() { dessine(); },
    lance() { document.addEventListener('visibilitychange', vue); vue(); },
    // l'éclair : la force de l'éclat, de 0 à 1 (les gouttes s'éclairent)
    eclaire(v) { eclair = v; },
    arrete() { cancelAnimationFrame(raf); observe.disconnect(); document.removeEventListener('visibilitychange', vue); }
  };
}
