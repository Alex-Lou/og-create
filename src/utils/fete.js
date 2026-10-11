// La fête de Brume, quand on réclame la récompense d'une quête (choix de l'auteur, 11 oct. : plus de vie, plus de
// magie, jamais de confettis). Un canevas posé sur tout l'écran, le temps de la fête, puis retiré :
//   1. anticipation : la brume est aspirée vers Brume, sa lueur monte ;
//   2. éclat : un arrêt d'un instant, un éclair clair ; Brume bondit (son saut, world/brume.js : joyHop) ;
//   3. magie : un cercle de brume tourne sous elle, un croissant de lune s'ouvre au-dessus, ses rayons tournent, deux
//      ondes s'élargissent, des volutes partent en spirale, des lucioles montent et scintillent en étoile ;
//   4. le mot de Brume (« Youpi ! »…), le parchemin « Quête accomplie » et son sceau de cire ;
//   5. les écus jaillissent de Brume en tournant, puis la bourse les attire un à un (poussière d'étoiles dans leur
//      sillage) ; elle sursaute à chacun.
// Tout est décoratif. Animation réduite : le parchemin seul, immobile, le temps de le lire.
import { reducedMotion } from './fx';
import { glyphSrc } from './glyph';

// La durée de la fête (ms) : le parchemin, les écus, puis tout s'efface
export const FETE_MS = 3600;
// Quand Brume bondit, après l'anticipation (ms)
export const ECLAT_MS = 380;
const MOTS = ['Youpi !', 'Hourra !', 'Bravo !', 'Bien joué !'];

const rnd = (a, b) => a + Math.random() * (b - a);
const ease = k => 1 - (1 - k) ** 3;
// Les teintes de la fête, en canaux (rgba(…, a)) : l'or des écus, le clair, le mauve de Brume, la brume
const OR = '255,214,120', CLAIR = '255,248,226', MAUVE = '198,178,255', BRUME = '236,232,255', LUNE = '255,243,200';
const rgba = (c, a) => `rgba(${c},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

// Un élément de la fête (le parchemin, le mot), retiré au bout de ms
function pose(el, ms) {
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
  return el;
}

// Le parchemin « Quête accomplie », le nom de la quête dessous, le sceau de cire qui tombe dessus
function parchemin(at, titre, sous, still) {
  const el = document.createElement('div');
  el.className = `oc-fete-titre${still ? ' is-still' : ''}`;
  el.setAttribute('role', 'status');
  el.style.left = `${Math.round(at.x)}px`;
  el.style.top = `${Math.round(at.y)}px`;
  const lettre = document.createElement('div');
  lettre.className = 'oc-fete-lettre';
  const h = document.createElement('strong');
  h.textContent = titre;
  lettre.appendChild(h);
  if (sous) {
    const p = document.createElement('span');
    p.textContent = sous;
    lettre.appendChild(p);
  }
  const sceau = document.createElement('span');
  sceau.className = 'oc-fete-sceau';
  const src = glyphSrc('ui:quete');
  if (src) {
    const img = document.createElement('img');
    Object.assign(img, { src, alt: '' });
    sceau.appendChild(img);
  }
  lettre.appendChild(sceau);
  el.appendChild(lettre);
  setTimeout(() => el.classList.add('is-out'), FETE_MS - 1800);
  return pose(el, FETE_MS - 1300);
}

// Le mot de Brume : une onomatopée qui jaillit à côté d'elle, lettre par lettre
function mot(at) {
  const el = document.createElement('div');
  el.className = 'oc-fete-mot';
  el.setAttribute('aria-hidden', 'true');
  el.style.left = `${Math.round(at.x + 46)}px`;
  el.style.top = `${Math.round(at.y - 58)}px`;
  [...MOTS[Math.floor(Math.random() * MOTS.length)]].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.animationDelay = `${i * 35}ms`;
    el.appendChild(s);
  });
  return pose(el, 1300);
}

// La bourse sursaute (un écu arrive)
function sursaut(purse) {
  if (!purse) return;
  purse.classList.remove('oc-bump');
  void purse.offsetWidth;
  purse.classList.add('oc-bump');
}

// at : Brume à l'écran (son cœur) ; sol : le point au sol sous elle ; purse : l'élément de la bourse ; titre, sous : le
// parchemin ; ecus : combien d'écus volent (décoratif : la bourse compte déjà le gain)
export function feteBrume({ at, sol, purse, titre = 'Quête accomplie', sous = '', ecus = 8 }) {
  const still = reducedMotion();
  // le parchemin, au-dessus de la lune
  const haut = { x: at.x, y: Math.max(70, at.y - 220) };
  if (still) {
    parchemin(haut, titre, sous, true);
    setTimeout(() => sursaut(purse), 400);
    return;
  }
  const ground = sol || { x: at.x, y: at.y + 40 };
  const cv = document.createElement('canvas');
  cv.className = 'oc-fete';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const d = Math.min(2, window.devicePixelRatio || 1), W = window.innerWidth, H = window.innerHeight;
  cv.width = W * d;
  cv.height = H * d;
  const g = cv.getContext('2d');
  if (!g) {
    cv.remove();
    return;
  }
  g.scale(d, d);
  const coin = new Image();
  const coinSrc = glyphSrc('ui:coin');
  if (coinSrc) coin.src = coinSrc;
  const P = [], F = [];
  let temps = 0, gel = 0, last = performance.now(), fini = false;
  const t0 = last;
  const trace = max => Object.assign([], { max });
  const forme = (debut, vie, draw) => F.push({ debut, vie, draw });
  const bourse = () => {
    if (!purse) return { x: 24, y: 24 };
    const r = purse.getBoundingClientRect();
    return { x: r.left + Math.min(r.width / 2, 24), y: r.top + r.height / 2 };
  };

  // --- les particules ---
  const aspire = () => {
    for (let i = 0; i < 28; i++) {
      const a = rnd(0, 7), dd = rnd(90, 170);
      P.push({ type: 'lueur', x: at.x + Math.cos(a) * dd, y: at.y + Math.sin(a) * dd * 0.7, vx: -Math.sin(a) * 40, vy: Math.cos(a) * 40, vie: 0.6, taille: rnd(7, 13), c: i % 3 ? BRUME : MAUVE, vers: at, force: 900, arrive: 14, trace: trace(6), alpha: k => Math.min(1, k * 4) * 0.8 });
    }
    P.push({ type: 'lueur', x: at.x, y: at.y, vx: 0, vy: 0, vie: 0.45, taille: 30, grandit: 1.4, c: BRUME, alpha: k => k * 0.9 });
  };
  const etincelles = (p, n, c = CLAIR) => {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, 7), v = rnd(60, 140);
      P.push({ type: 'lueur', x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: rnd(0.3, 0.55), taille: rnd(2, 4), c, frein: 0.9, trace: trace(4) });
    }
  };
  const lucioles = () => {
    for (let i = 0; i < 40; i++) {
      const a = -Math.PI / 2 + rnd(-1.4, 1.4), v = rnd(60, 180);
      P.push({ type: 'etoile', x: at.x + rnd(-10, 10), y: at.y + rnd(-10, 10), vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, vie: rnd(1.9, 2.9), taille: rnd(8, 13), c: [MAUVE, OR, CLAIR][i % 3],
        frein: 0.965, grav: -18, bruit: 90, graine: rnd(0, 9), clign: rnd(6, 12), rot: rnd(0, 1), spirale: rnd(-2, 2), trace: trace(9), alpha: k => (k < 0.1 ? k * 10 : 1 - k * k) });
    }
  };
  const volutes = () => {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * 7 + rnd(0, 0.4), v = rnd(150, 210);
      P.push({ type: 'lueur', x: at.x, y: at.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, vie: 0.9, taille: 5, c: BRUME, frein: 0.93, spirale: 3.2, trace: trace(16) });
    }
  };
  const fontaine = () => {
    for (let i = 0; i < ecus; i++) {
      setTimeout(() => {
        if (fini) return;
        const a = -Math.PI / 2 + rnd(-0.9, 0.9), v = rnd(170, 240);
        const p = { type: 'ecu', normal: true, x: at.x, y: at.y - 8, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 4, taille: 20, tour: rnd(7, 11), grav: 260, frein: 0.985, alpha: () => 1, poussiere: true,
          fin: () => { sursaut(purse); etincelles(bourse(), 6, OR); } };
        P.push(p);
        setTimeout(() => Object.assign(p, { vers: bourse, force: 1400, grav: 0, arrive: 14, trace: trace(7), c: OR }), 520 + i * 70);
      }, i * 55);
    }
  };

  // --- les formes : le voile, l'éclair, le cercle de brume, la lune, les ondes ---
  forme(0, FETE_MS / 1000, (k) => {
    const o = (k < 0.12 ? k / 0.12 : k > 0.8 ? (1 - k) / 0.2 : 1) * 0.55;
    const v = g.createRadialGradient(at.x, at.y, 40, at.x, at.y, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(30,20,60,0)');
    v.addColorStop(1, `rgba(14,10,34,${o.toFixed(3)})`);
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
  });
  const eclat = ECLAT_MS / 1000;
  forme(eclat, 0.32, (k) => {
    const r = 40 + ease(k) * 240, gr = g.createRadialGradient(at.x, at.y, 0, at.x, at.y, r);
    gr.addColorStop(0, rgba(CLAIR, 0.9 * (1 - k)));
    gr.addColorStop(0.35, rgba(BRUME, 0.45 * (1 - k)));
    gr.addColorStop(1, rgba(BRUME, 0));
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
  });
  // le cercle de brume sous Brume : deux anneaux qui tournent en sens contraire, des étoiles posées dessus
  forme(eclat, 2.6, (k) => {
    const o = k < 0.12 ? k / 0.12 : k > 0.75 ? (1 - k) / 0.25 : 1, R = 30 + ease(Math.min(1, k * 2.5)) * 26;
    g.save();
    g.translate(ground.x, ground.y);
    g.scale(1, 0.42);
    g.globalCompositeOperation = 'lighter';
    g.lineWidth = 2;
    g.strokeStyle = rgba(BRUME, 0.75 * o);
    g.setLineDash([10, 7]);
    g.lineDashOffset = -temps * 40;
    g.beginPath();
    g.arc(0, 0, R, 0, 7);
    g.stroke();
    g.setLineDash([3, 6]);
    g.lineDashOffset = temps * 30;
    g.strokeStyle = rgba(MAUVE, 0.8 * o);
    g.beginPath();
    g.arc(0, 0, R * 0.74, 0, 7);
    g.stroke();
    g.setLineDash([]);
    for (let i = 0; i < 6; i++) {
      const a = temps * 0.9 + (i * Math.PI) / 3, s = 4 + Math.sin(temps * 6 + i) * 1.5;
      etoile(g, Math.cos(a) * R, Math.sin(a) * R, s, rgba(i % 2 ? OR : CLAIR, o), 0);
    }
    const h = g.createRadialGradient(0, 0, 0, 0, 0, R * 1.2);
    h.addColorStop(0, rgba(MAUVE, 0.35 * o));
    h.addColorStop(1, rgba(MAUVE, 0));
    g.fillStyle = h;
    g.beginPath();
    g.arc(0, 0, R * 1.2, 0, 7);
    g.fill();
    g.globalCompositeOperation = 'source-over';
    g.restore();
  });
  // le croissant de lune au-dessus d'elle, ses rayons qui tournent
  forme(eclat, 2.6, (k) => {
    const o = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1, R = 40 + ease(Math.min(1, k * 3)) * 12;
    g.save();
    g.translate(at.x, at.y - 62);
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const a = temps * 0.35 + (i * Math.PI) / 6, l = R * (2.1 + 0.4 * Math.sin(temps * 2 + i));
      const gr = g.createLinearGradient(0, 0, Math.cos(a) * l, Math.sin(a) * l);
      gr.addColorStop(0, rgba(LUNE, 0.32 * o));
      gr.addColorStop(1, rgba(LUNE, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(Math.cos(a - 0.08) * l, Math.sin(a - 0.08) * l);
      g.lineTo(Math.cos(a + 0.08) * l, Math.sin(a + 0.08) * l);
      g.fill();
    }
    const h = g.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 1.5);
    h.addColorStop(0, rgba(BRUME, 0.55 * o));
    h.addColorStop(1, rgba(BRUME, 0));
    g.fillStyle = h;
    g.beginPath();
    g.arc(0, 0, R * 1.5, 0, 7);
    g.fill();
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = o;
    g.fillStyle = rgba(LUNE, 1);
    g.beginPath();
    g.arc(0, -4, R * 0.62, 0, 7);
    g.arc(R * 0.3, -R * 0.2, R * 0.56, 0, 7, true);
    g.fill('evenodd');
    g.strokeStyle = 'rgba(201,160,74,.9)';
    g.lineWidth = 2;
    g.stroke();
    g.globalAlpha = 1;
    g.restore();
  });
  const onde = (debut, max, epais, c, a0, vie) => forme(debut, vie, (k) => {
    const r = 14 + ease(k) * max;
    g.globalCompositeOperation = 'lighter';
    g.strokeStyle = rgba(c, a0 * (1 - k));
    g.lineWidth = epais * (1 - k * 0.7);
    g.beginPath();
    g.ellipse(ground.x, ground.y, r, r * 0.42, 0, 0, 7);
    g.stroke();
    g.globalCompositeOperation = 'source-over';
  });
  onde(eclat, 150, 16, BRUME, 0.55, 0.9);
  onde(eclat + 0.09, 120, 3, LUNE, 1, 0.7);

  // --- le déroulé ---
  aspire();
  const plus = (ms, f) => setTimeout(() => { if (!fini) f(); }, ms);
  plus(ECLAT_MS, () => { gel = 70; volutes(); etincelles(at, 18); });
  plus(ECLAT_MS + 120, lucioles);
  plus(ECLAT_MS + 300, () => mot(at));
  plus(ECLAT_MS + 520, () => parchemin(haut, titre, sous, false));
  plus(ECLAT_MS + 880, fontaine);
  plus(FETE_MS + 400, () => { fini = true; });

  function maj(p, dt) {
    if (p.vers) {
      const c = typeof p.vers === 'function' ? p.vers() : p.vers, dx = c.x - p.x, dy = c.y - p.y, dd = Math.hypot(dx, dy) || 1, k = p.force * (1 + p.age * 3);
      p.vx += (dx / dd) * k * dt;
      p.vy += (dy / dd) * k * dt;
      if (dd < (p.arrive || 10)) {
        p.age = p.vie;
        if (p.fin) p.fin(p);
        return;
      }
    }
    if (p.spirale) {
      const a = Math.atan2(p.vy, p.vx) + p.spirale * dt, v = Math.hypot(p.vx, p.vy);
      p.vx = Math.cos(a) * v;
      p.vy = Math.sin(a) * v;
    }
    if (p.bruit) {
      p.vx += Math.sin(temps * 3 + p.graine) * p.bruit * dt;
      p.vy += Math.cos(temps * 2.3 + p.graine * 1.7) * p.bruit * 0.6 * dt;
    }
    p.vy += (p.grav || 0) * dt;
    const fr = (p.frein ?? 1) ** (dt * 60);
    p.vx *= fr;
    p.vy *= fr;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.trace) {
      p.trace.push([p.x, p.y]);
      if (p.trace.length > p.trace.max) p.trace.shift();
    }
    // la poussière d'étoiles dans le sillage d'un écu qui file vers la bourse
    if (p.poussiere && p.vers && Math.random() < 0.5) P.push({ type: 'etoile', x: p.x + rnd(-4, 4), y: p.y + rnd(-4, 4), vx: rnd(-20, 20), vy: rnd(-20, 20), vie: rnd(0.35, 0.6), taille: rnd(3, 6), c: Math.random() < 0.5 ? OR : CLAIR, graine: rnd(0, 9), clign: 14, rot: rnd(0, 1), frein: 0.92 });
  }
  function dessine(p) {
    const k = (p.age || 0) / p.vie, a = p.alpha ? p.alpha(k) : 1 - k;
    if (a <= 0) return;
    if (p.trace && p.trace.length > 1) {
      g.lineCap = 'round';
      for (let i = 1; i < p.trace.length; i++) {
        const f = i / p.trace.length;
        g.strokeStyle = rgba(p.c, a * f * 0.7);
        g.lineWidth = p.taille * f * 0.9;
        g.beginPath();
        g.moveTo(p.trace[i - 1][0], p.trace[i - 1][1]);
        g.lineTo(p.trace[i][0], p.trace[i][1]);
        g.stroke();
      }
    }
    if (p.type === 'lueur') {
      const r = p.taille * (p.grandit ? 1 + k * p.grandit : 1), gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      gr.addColorStop(0, rgba(p.c, a));
      gr.addColorStop(1, rgba(p.c, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.arc(p.x, p.y, r, 0, 7);
      g.fill();
    } else if (p.type === 'etoile') {
      const s = p.taille * (0.6 + 0.4 * Math.abs(Math.sin(temps * p.clign + p.graine))) * a;
      etoile(g, p.x, p.y, s, rgba(p.c, a), p.rot);
      const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 1.6);
      gr.addColorStop(0, rgba(p.c, a * 0.75));
      gr.addColorStop(1, rgba(p.c, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.arc(p.x, p.y, s * 1.6, 0, 7);
      g.fill();
    } else if (p.type === 'ecu' && coin.complete && coin.naturalWidth) {
      const s = p.taille, w = Math.abs(Math.cos(p.age * p.tour)) * s + 1.5;
      g.drawImage(coin, p.x - w / 2, p.y - s / 2, w, s);
    }
  }
  function boucle(now) {
    let dt = Math.min(50, now - last) / 1000;
    last = now;
    if (gel > 0) {
      gel -= dt * 1000;
      dt = 0;
    }
    temps += dt;
    const ecoule = (now - t0) / 1000;
    g.clearRect(0, 0, W, H);
    for (const f of F) {
      const k = (ecoule - f.debut) / f.vie;
      if (k >= 0 && k < 1) f.draw(k);
    }
    for (let i = P.length - 1; i >= 0; i--) {
      P[i].age = (P[i].age || 0) + dt;
      if (P[i].age >= P[i].vie) P.splice(i, 1);
    }
    g.globalCompositeOperation = 'lighter';
    for (const p of P.slice()) {
      maj(p, dt);
      if (!p.normal) dessine(p);
    }
    g.globalCompositeOperation = 'source-over';
    for (const p of P) if (p.normal) dessine(p);
    if (fini && !P.length) {
      cv.remove();
      return;
    }
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);
}

// Une étoile à quatre branches (la luciole qui scintille, les étoiles du cercle)
function etoile(g, x, y, s, couleur, rot) {
  g.fillStyle = couleur;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + rot, r = i % 2 ? s * 0.22 : s;
    g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  g.fill();
}
