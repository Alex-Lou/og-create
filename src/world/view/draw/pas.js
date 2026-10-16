// Sous les pas des habitants qui marchent (world/pas.js) : une bouffée de sable, de la poussière de chemin, des
// gouttes sur le sol mouillé. Méthodes de WorldView.vue (this : le composant), réunies par draw.js. La bouffée est une
// petite image dessinée une fois par teinte ; rien n'est fait pour qui ne marche pas.
import { solDePas, pasOf, bouffeesOf, TEINTES } from '@/world/pas';
import { rond } from '@/world/textures';

const bouffee = tone => rond(`bouffee:${tone}`, 24, [[0, `rgba(${tone},1)`], [0.55, `rgba(${tone},.55)`], [1, `rgba(${tone},0)`]]);

// Une graine propre à chaque marcheur (ils ne posent pas le pied ensemble)
const seedOf = id => { let h = 3; for (const ch of String(id)) h = (h * 33 + ch.charCodeAt(0)) % 997; return h / 997; };

export default {
  // Ce que soulèvent les pas d'un habitant qui marche, à ses pieds (dessiné juste avant lui)
  drawPas(ctx, critter, t) {
    if (critter.pose !== 'walk' || critter.z > 0.5) return;
    const g = this.M.ground(Math.round(critter.x), Math.round(critter.y));
    const wet = Math.max(this.wet ? this.wet.value : 0, (this.phase && this.phase.weather.rain) || 0);
    const sol = solDePas(g, wet);
    if (!sol) return;
    const c = this.ground(critter.x, critter.y);
    const tone = TEINTES[sol];
    ctx.save();
    for (const p of pasOf(t, seedOf(critter.id))) {
      for (const b of bouffeesOf(sol, p.age, p.cote)) {
        ctx.globalAlpha = b.a;
        const x = c.x + b.dx, y = c.y + b.dy;
        if (b.rond) {
          ctx.strokeStyle = `rgb(${tone})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(x, y, b.r, b.r * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (sol === 'eau') {
          ctx.fillStyle = `rgb(${tone})`;
          ctx.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
        } else {
          ctx.drawImage(bouffee(tone), x - b.r, y - b.r * 0.7, b.r * 2, b.r * 1.4);
        }
      }
    }
    ctx.restore();
  }
};
