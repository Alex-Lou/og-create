// Le moteur des effets (fêtes, éclats, lucioles) : un seul canevas posé sur l'écran, partagé par tous les effets, et
// fait pour rester fluide sur un téléphone moyen.
// - Les images (lueurs, étoiles, éclats) sont dessinées une fois, puis seulement recopiées (drawImage) : aucun
//   dégradé recalculé à chaque image.
// - Les particules sont recyclées (pas de création d'objets pendant l'animation) et plafonnées ; si les images
//   ralentissent, le moteur en fait naître moins (qualité adaptative).
// - Aucune lecture de la page pendant l'animation : les cibles (une bourse, un compteur) sont mesurées au départ.
// - La boucle ne tourne que s'il y a quelque chose à dessiner ; le canevas est vidé et masqué ensuite (un seul,
//   jamais recréé : rien ne s'accumule).
// Animation réduite : rien (les effets restent décoratifs ; chaque appelant garde son retour immobile).
import { reducedMotion } from './fx';

const MAX = 240;
// la résolution du canevas (au-delà de 1,5, le coût monte sans gain visible pour des lueurs)
const DPR_MAX = 1.5;

let cv = null, g = null, W = 0, H = 0, D = 1, raf = 0, last = 0, temps = 0, gel = 0;
let qualite = 1, lentes = 0, image = 0;
const vivantes = [], libres = [], formes = [];
const sprites = new Map();

// Le moteur ne tourne que dans un navigateur qui sait dessiner (sinon, rien : les effets sont décoratifs)
// (la préférence « réduire les animations » est lue une fois, puis suivie : rien n'est recalculé à chaque particule)
const reduit = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const possible = () => typeof document !== 'undefined' && !(reduit ? reduit.matches : reducedMotion());
function couche() {
  if (cv) return Boolean(g);
  cv = document.createElement('canvas');
  cv.className = 'oc-vfx';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  g = cv.getContext('2d');
  if (!g) return false;
  taille();
  window.addEventListener('resize', taille, { passive: true });
  return true;
}
function taille() {
  if (!cv) return;
  D = Math.min(DPR_MAX, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  cv.width = Math.round(W * D);
  cv.height = Math.round(H * D);
  g.setTransform(D, 0, 0, D, 0, 0);
}

// Une image dessinée une fois (clé : sa forme et sa couleur), recopiée ensuite
function sprite(cle, taillePx, dessin) {
  let s = sprites.get(cle);
  if (s) return s;
  s = document.createElement('canvas');
  s.width = s.height = taillePx;
  dessin(s.getContext('2d'), taillePx);
  sprites.set(cle, s);
  return s;
}
// couleur : 'r,g,b'
export const lueur = c => sprite(`lueur:${c}`, 64, (x, n) => {
  const gr = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  gr.addColorStop(0, `rgba(${c},1)`);
  gr.addColorStop(0.35, `rgba(${c},.55)`);
  gr.addColorStop(1, `rgba(${c},0)`);
  x.fillStyle = gr;
  x.fillRect(0, 0, n, n);
});
export const etoile = c => sprite(`etoile:${c}`, 64, (x, n) => {
  x.drawImage(lueur(c), n * 0.15, n * 0.15, n * 0.7, n * 0.7);
  x.fillStyle = 'rgba(255,255,245,1)';
  x.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, r = i % 2 ? n * 0.06 : n * 0.48;
    x.lineTo(n / 2 + Math.cos(a) * r, n / 2 + Math.sin(a) * r);
  }
  x.fill();
});
export { sprite };

// Un anneau magique au sol (les ondes des fêtes de l'île et de Brume) : un fil d'or dans un halo bleu azur, et quelques
// étincelles bleu pâle qui tournent dessus. Le halo et le fil sont peints (ils gardent leur couleur de jour, sur un sol
// clair) ; la lueur autour et le cœur du fil s'ajoutent à la lumière (ils brillent la nuit). a : son opacité ; w :
// l'épaisseur du fil ; n : ses étincelles ; t : le temps (s), qui les fait tourner
const AZUR = '96,164,255', AZUR_PROFOND = '66,128,236', AZUR_PALE = '196,226,255', FIL = '242,188,72', COEUR = '255,236,178';
export function anneau(g, x, y, rx, ry, a, w, n = 0, t = 0) {
  if (a <= 0.01 || !(rx > 0) || !(ry > 0)) return;
  const avant = g.globalCompositeOperation;
  const trait = (mode, couleur, largeur, opacite) => {
    g.globalCompositeOperation = mode;
    g.globalAlpha = a * opacite;
    g.strokeStyle = `rgb(${couleur})`;
    g.lineWidth = largeur;
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.stroke();
  };
  trait('lighter', AZUR, w * 7, 0.16);
  trait('source-over', AZUR_PROFOND, w * 3.4, 0.3);
  trait('source-over', AZUR, w * 1.9, 0.45);
  trait('source-over', FIL, w, 0.95);
  trait('lighter', COEUR, w * 0.35, 0.55);
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const an = (i / n) * Math.PI * 2 + t * 0.9;
    const s = (5 + 3 * Math.sin(t * 7 + i * 2.1)) * Math.min(1, w / 1.5 + 0.4);
    g.globalAlpha = a * (0.55 + 0.45 * Math.abs(Math.sin(t * 6 + i)));
    g.drawImage(etoile(AZUR_PALE), x + Math.cos(an) * rx - s / 2, y + Math.sin(an) * ry - s / 2, s, s);
  }
  g.globalCompositeOperation = avant;
}

// --- les ancres ---
// Une ancre : les effets qui la portent suivent un point de l'île qui bouge à l'écran (Brume, quand on fait glisser
// l'île) en gardant leur taille. suit() rend le décalage depuis le départ, { x, y } (calculé, jamais lu dans la page) ;
// relu une fois par image (decale : où il en est).
export const ancre = suit => ({ suit, x: 0, y: 0, image: -1 });
export function decale(a) {
  if (a.image !== image) {
    const o = a.suit();
    a.x = o.x;
    a.y = o.y;
    a.image = image;
  }
  return a;
}
// Une particule quitte son ancre (un écu qui part vers la bourse) : elle reste où on la voit
export function decroche(p) {
  if (!p || !p.ancre) return;
  const a = decale(p.ancre);
  p.x += a.x;
  p.y += a.y;
  p.ancre = null;
}

// --- les particules ---
// p : { img, x, y, vx, vy, vie, taille, grav, frein, rot, vr, alpha (0 : s'éteint, 1 : constant, 2 : naît et
// s'éteint), etire (traînée : l'image s'allonge dans le sens de la course), vers : {x, y} (attracteur), force,
// arrive (rayon d'arrivée), fin (appelé à l'arrivée), clign (scintillement), bruit (flottement), tour (elle tourne
// sur elle-même : une pièce), sillage (elle sème de petites étoiles : la chance par image), add (false : sans lueur),
// ancre (elle suit son point : x, y, vers sont relatifs à son départ) }
export function particule(o) {
  if (vivantes.length >= MAX || !possible() || !couche()) return null;
  const p = libres.pop() || {};
  p.img = o.img; p.x = o.x; p.y = o.y; p.vx = o.vx || 0; p.vy = o.vy || 0; p.age = 0; p.vie = o.vie || 0.6;
  p.taille = o.taille || 8; p.grav = o.grav || 0; p.frein = o.frein ?? 1; p.rot = o.rot || 0; p.vr = o.vr || 0;
  p.alpha = o.alpha ?? 0; p.etire = o.etire || 0; p.vers = o.vers || null; p.force = o.force || 0; p.arrive = o.arrive || 10;
  p.fin = o.fin || null; p.clign = o.clign || 0; p.bruit = o.bruit || 0; p.graine = Math.random() * 9; p.add = o.add !== false;
  p.tour = o.tour || 0; p.sillage = o.sillage || 0; p.semis = o.semis || null; p.ancre = o.ancre || null;
  vivantes.push(p);
  demarre();
  return p;
}
// Une gerbe de n particules autour d'un point (n réduit si les images ralentissent) ; lien : son ancre
export function gerbe(at, n, fabrique, lien = null) {
  const k = Math.max(1, Math.round(n * qualite));
  for (let i = 0; i < k; i++) {
    const a = Math.random() * Math.PI * 2;
    const o = fabrique(i, a);
    if (o) particule({ x: at.x, y: at.y, ancre: lien, ...o });
  }
}
// Une forme dessinée à chaque image pendant sa vie (une lune, un cercle, une onde) : dessin(g, k, temps), k de 0 à 1 ;
// lien : son ancre
export function forme(retard, vie, dessin, lien = null) {
  if (!possible() || !couche()) return;
  formes.push({ t0: temps + retard, vie, dessin, ancre: lien });
  demarre();
}
// Un arrêt sur image (ms) : l'impact se sent
export function arret(ms) { gel = Math.max(gel, ms); }

function demarre() {
  if (raf) return;
  cv.style.display = '';
  last = performance.now();
  raf = requestAnimationFrame(boucle);
}
function boucle(now) {
  let dt = Math.min(50, now - last) / 1000;
  // qualité adaptative : des images lentes répétées font naître moins de particules
  if (now - last > 26) lentes = Math.min(30, lentes + 1); else lentes = Math.max(0, lentes - 1);
  qualite = lentes > 12 ? 0.45 : lentes > 6 ? 0.7 : 1;
  last = now;
  if (gel > 0) { gel -= dt * 1000; dt = 0; }
  temps += dt;
  image++;
  g.clearRect(0, 0, W, H);
  for (let i = formes.length - 1; i >= 0; i--) {
    const f = formes[i], k = (temps - f.t0) / f.vie;
    if (k >= 1) { formes.splice(i, 1); continue; }
    if (k < 0) continue;
    if (!f.ancre) {
      f.dessin(g, k, temps);
      continue;
    }
    const a = decale(f.ancre);
    g.save();
    g.translate(a.x, a.y);
    f.dessin(g, k, temps);
    g.restore();
  }
  g.globalCompositeOperation = 'lighter';
  let normal = false;
  for (let i = vivantes.length - 1; i >= 0; i--) {
    const p = vivantes[i];
    p.age += dt;
    if (p.vers) {
      const dx = p.vers.x - p.x, dy = p.vers.y - p.y, d = Math.hypot(dx, dy) || 1, f = p.force * (1 + p.age * 3) * dt;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
      if (d < p.arrive) { p.age = p.vie; if (p.fin) p.fin(p); }
    }
    if (p.age >= p.vie) { vivantes.splice(i, 1); p.fin = null; p.vers = null; p.ancre = null; libres.push(p); continue; }
    if (p.bruit) { p.vx += Math.sin(temps * 3 + p.graine) * p.bruit * dt; p.vy += Math.cos(temps * 2.3 + p.graine) * p.bruit * 0.6 * dt; }
    p.vy += p.grav * dt;
    if (p.frein !== 1) { const fr = p.frein ** (dt * 60); p.vx *= fr; p.vy *= fr; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.sillage && p.semis && Math.random() < p.sillage * qualite) particule({ img: p.semis, x: p.x + (Math.random() - 0.5) * 8, y: p.y + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30, vie: 0.45, taille: 7, frein: 0.92, ancre: p.ancre });
    if (!p.add) { normal = true; continue; }
    dessine(p);
  }
  if (normal) {
    g.globalCompositeOperation = 'source-over';
    for (const p of vivantes) if (!p.add) dessine(p);
  }
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;
  if (!vivantes.length && !formes.length) {
    raf = 0;
    g.clearRect(0, 0, W, H);
    cv.style.display = 'none';
    return;
  }
  raf = requestAnimationFrame(boucle);
}
function dessine(p) {
  const k = p.age / p.vie;
  let a = p.alpha === 1 ? 1 : p.alpha === 2 ? (k < 0.12 ? k / 0.12 : 1 - (k - 0.12) / 0.88) : 1 - k;
  if (p.clign) a *= 0.55 + 0.45 * Math.abs(Math.sin(temps * p.clign + p.graine));
  if (a <= 0.01 || !p.img) return;
  g.globalAlpha = a;
  const s = p.taille;
  // (une particule ancrée se dessine là où son point est allé)
  const o = p.ancre ? decale(p.ancre) : null, x = o ? p.x + o.x : p.x, y = o ? p.y + o.y : p.y;
  if (p.etire) {
    // la traînée : l'image s'allonge dans le sens de la course, selon la vitesse
    const v = Math.hypot(p.vx, p.vy), l = s + Math.min(s * 4, v * p.etire), an = Math.atan2(p.vy, p.vx), c = Math.cos(an) * D, sn = Math.sin(an) * D;
    g.setTransform(c, sn, -sn, c, x * D, y * D);
    g.drawImage(p.img, -l + s / 2, -s / 2, l, s);
    g.setTransform(D, 0, 0, D, 0, 0);
  } else if (p.tour) {
    // une pièce qui tourne : sa largeur bat
    const w = Math.abs(Math.cos(p.age * p.tour)) * s + 1.5;
    g.drawImage(p.img, x - w / 2, y - s / 2, w, s);
  } else if (p.rot) {
    const c = Math.cos(p.rot) * D, sn = Math.sin(p.rot) * D;
    g.setTransform(c, sn, -sn, c, x * D, y * D);
    g.drawImage(p.img, -s / 2, -s / 2, s, s);
    g.setTransform(D, 0, 0, D, 0, 0);
  } else {
    g.drawImage(p.img, x - s / 2, y - s / 2, s, s);
  }
}

// Pour les tests et l'aperçu : combien de particules vivent, si la boucle tourne
export const echelle = () => D;
export const etat = () => ({ particules: vivantes.length, formes: formes.length, actif: Boolean(raf), qualite });
