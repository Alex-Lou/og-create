// Fond vivant : des atomes qui évoluent avec la progression du joueur.
//   Ère 1  poussière d'étoiles : atomes qui dérivent et scintillent
//   Ère 2  molécules           : liaisons lumineuses entre atomes proches
//   Ère 3  réactions           : les atomes se touchent, fusionnent puis se divisent
//   Ère 4  courants            : un champ de flux emporte l'ensemble en tourbillons
//   Ère 5  vie                 : les gros atomes deviennent des cellules à membrane
// Moteur canvas 2D sans dépendance ; le composant Vue ne fait que le piloter.

// Une image du fond toutes les FRAME_MS au plus (30 par seconde)
const FRAME_MS = 32;
const TAU = Math.PI * 2;
const LINK_DISTANCE = 90;
// Sur le vélin, chaque famille s'écrit à l'encre : sa couleur assombrie, posée en « multiply »
const ink = c => c.map(v => Math.round(v * 0.62));

export default class LivingBackground {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reduced = reducedMotion;
    this.atoms = [];
    this.rings = [];
    this.palette = [[233, 223, 200]];
    this.era = 1;
    this.population = 40;
    this.intensity = [0, 0, 0, 0]; // ères 2 à 5, animées en douceur de 0 à 1
    this.running = false;
    this.last = 0;
    this.frame = null;
    this.resize();
  }

  // --- pilotage ---
  configure({ era, population, palette }) {
    const first = this.atoms.length === 0;
    this.era = era;
    this.population = Math.min(population, this.width < 700 ? 110 : 170);
    if (palette && palette.length) this.palette = palette;
    if (first) {
      // Premier affichage : l'état courant directement, sans transition
      this.intensity = this.intensity.map((_, k) => (era >= k + 2 ? 1 : 0));
      for (let i = 0; i < this.population; i++) this.spawn(Math.random() * this.width, Math.random() * this.height, 0, 0, 1);
    }
  }

  // Gerbe d'atomes et onde dorée à l'endroit d'une découverte
  burst(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU;
      const speed = 1.2 + Math.random() * 1.6;
      this.spawn(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0);
    }
    this.rings.push({ x, y, t: 0, big: true });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = 0;
    const step = (time) => {
      if (!this.running) return;
      // (30 images par seconde suffisent à un fond qui flotte : moitié moins de calcul qu'à chaque image de l'écran)
      if (this.last && time - this.last < FRAME_MS) {
        this.frame = requestAnimationFrame(step);
        return;
      }
      const dt = this.last ? Math.min(2, (time - this.last) / 16.67) : 1;
      this.last = time;
      this.step(dt, time);
      // Mouvement réduit : environ une image par seconde
      if (this.reduced) this.timer = setTimeout(() => { this.frame = requestAnimationFrame(step); }, 900);
      else this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  // (l'image demandée et la minuterie du mouvement réduit, chacune la sienne)
  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = this.canvas.clientWidth || window.innerWidth;
    this.height = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- simulation ---
  spawn(x, y, vx, vy, alpha) {
    this.atoms.push({
      x, y, vx, vy,
      r: 0.8 + Math.random() * 1.4,
      color: this.palette[Math.floor(Math.random() * this.palette.length)],
      alpha,
      age: Math.random() * 1000,
      cooldown: 60
    });
  }

  step(dt, time) {
    const { ctx, atoms, width: W, height: H, intensity } = this;
    for (let k = 0; k < 4; k++) {
      const target = this.era >= k + 2 ? 1 : 0;
      intensity[k] += (target - intensity[k]) * 0.012 * dt;
    }
    const [bond, react, flow, life] = intensity;
    ctx.clearRect(0, 0, W, H);

    // La population suit le nombre d'éléments découverts
    if (atoms.length < this.population && Math.random() < 0.25) this.spawn(Math.random() * W, Math.random() * H, 0, 0, 0);
    if (atoms.length > this.population + 10) atoms.shift();

    this.move(dt, time, flow);
    this.interact(dt, bond, react);
    this.draw(life);
    this.drawRings(dt);
  }

  move(dt, time, flow) {
    const { atoms, width: W, height: H } = this;
    for (const a of atoms) {
      a.age += dt;
      a.cooldown -= dt;
      if (a.alpha < 1) a.alpha = Math.min(1, a.alpha + 0.02 * dt);
      // Dérive brownienne
      a.vx += (Math.random() - 0.5) * 0.03 * dt;
      a.vy += (Math.random() - 0.5) * 0.03 * dt;
      // Courants (ère 4)
      if (flow > 0.01) {
        const angle = Math.sin(a.x * 0.0032 + time * 0.00015) * 2.2 + Math.cos(a.y * 0.0041 - time * 0.0001) * 2.2;
        a.vx += Math.cos(angle) * 0.018 * flow * dt;
        a.vy += Math.sin(angle) * 0.018 * flow * dt;
      }
      a.vx *= 0.985;
      a.vy *= 0.985;
      const speed = Math.hypot(a.vx, a.vy);
      const max = 0.6 + flow * 0.5;
      if (speed > max) {
        a.vx *= max / speed;
        a.vy *= max / speed;
      }
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
      if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
    }
  }

  interact(dt, bond, react) {
    const { ctx, atoms } = this;
    let merge = null;
    ctx.lineWidth = 1;
    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      for (let j = i + 1; j < atoms.length; j++) {
        const b = atoms[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (dx > LINK_DISTANCE || dx < -LINK_DISTANCE || dy > LINK_DISTANCE || dy < -LINK_DISTANCE) continue;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        // Liaisons (ère 2) : lignes lumineuses et ressort vers une distance d'équilibre
        if (bond > 0.01 && d < LINK_DISTANCE) {
          const alpha = (1 - d / LINK_DISTANCE) * 0.32 * bond * Math.min(a.alpha, b.alpha);
          const c = ink(a.color);
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (d < 60) {
            const force = (d - 30) * 0.0006 * bond * dt;
            a.vx += (dx / d) * force; a.vy += (dy / d) * force;
            b.vx -= (dx / d) * force; b.vy -= (dy / d) * force;
          }
        }
        // Réactions (ère 3) : deux atomes qui se touchent peuvent fusionner
        if (!merge && react > 0.3 && d < 7 && a.cooldown < 0 && b.cooldown < 0 && Math.random() < 0.05 * react) merge = [i, j];
      }
    }
    if (merge) {
      const [i, j] = merge;
      const a = atoms[i];
      const b = atoms[j];
      a.r = Math.min(4.2, Math.sqrt(a.r * a.r + b.r * b.r));
      a.cooldown = 120;
      a.vx = (a.vx + b.vx) / 2;
      a.vy = (a.vy + b.vy) / 2;
      this.rings.push({ x: a.x, y: a.y, t: 0, big: false });
      atoms.splice(j, 1);
    }
    // … puis les plus gros se divisent : la population reste vivante
    if (react > 0.3) {
      for (let i = atoms.length - 1; i >= 0; i--) {
        const a = atoms[i];
        if (a.r > 3.2 && a.cooldown < 0 && Math.random() < 0.004 * react) {
          a.r /= 1.41;
          a.cooldown = 90;
          const angle = Math.random() * TAU;
          atoms.push({ ...a, vx: -Math.cos(angle) * 0.8, vy: -Math.sin(angle) * 0.8, alpha: 1, age: 0 });
          a.vx += Math.cos(angle) * 0.8;
          a.vy += Math.sin(angle) * 0.8;
        }
      }
    }
  }

  draw(life) {
    const { ctx, atoms } = this;
    ctx.globalCompositeOperation = 'multiply';
    atoms.forEach((a, i) => {
      const c = ink(a.color);
      const base = `rgba(${c[0]},${c[1]},${c[2]},`;
      const twinkle = 0.65 + 0.35 * Math.sin(a.age * 0.05 + i);
      ctx.fillStyle = base + (0.08 * a.alpha).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4.5, 0, TAU); ctx.fill();
      ctx.fillStyle = base + (0.5 * a.alpha * twinkle).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, TAU); ctx.fill();
      // Cellules (ère 5) : une membrane qui respire autour des gros atomes
      if (life > 0.01 && a.r > 1.7) {
        const radius = a.r * (3 + Math.sin(a.age * 0.03 + i) * 0.4) + 2;
        ctx.strokeStyle = base + (0.35 * life * a.alpha).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(a.x, a.y, radius * 1.12, radius, a.age * 0.004, 0, TAU); ctx.stroke();
        ctx.fillStyle = base + (0.06 * life * a.alpha).toFixed(3) + ')';
        ctx.fill();
      }
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  drawRings(dt) {
    const { ctx, rings } = this;
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.t += dt;
      const progress = ring.t / (ring.big ? 70 : 30);
      if (progress >= 1) { rings.splice(i, 1); continue; }
      ctx.strokeStyle = ring.big
        ? `rgba(185,131,42,${(0.55 * (1 - progress)).toFixed(3)})`
        : `rgba(133,112,95,${(0.4 * (1 - progress)).toFixed(3)})`;
      ctx.lineWidth = ring.big ? 2 : 1;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, (ring.big ? 180 : 14) * progress + 4, 0, TAU);
      ctx.stroke();
    }
  }
}
