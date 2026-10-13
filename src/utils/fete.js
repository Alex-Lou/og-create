// La fête de Brume, quand on réclame la récompense d'une quête (choix de l'auteur, 11 oct. : plus de vie, plus de
// magie, jamais de confettis ; fluide sur un téléphone moyen). Elle se joue sur le moteur des effets (utils/vfx.js) :
//   1. anticipation : la brume est aspirée vers Brume, sa lueur monte ;
//   2. éclat : un arrêt d'un instant, un éclair clair ; Brume bondit (son saut, world/brume.js : joyHop) ;
//   3. magie : un cercle de brume tourne sous elle, un croissant de lune s'ouvre au-dessus, ses rayons tournent, deux
//      ondes s'élargissent, des volutes partent, des lucioles montent et scintillent ;
//   4. le mot de Brume (« Youpi ! »…), le parchemin « Quête accomplie » et son sceau de cire ;
//   5. les écus jaillissent de Brume en tournant, puis la bourse les attire un à un (poussière d'étoiles dans leur
//      sillage) ; elle sursaute à chacun.
// Le voile et l'éclair sont des éléments de la page (animés par le navigateur, sans repeindre l'écran) ; la lune, ses
// rayons et l'écu sont dessinés une fois. Tout est décoratif. Animation réduite : le parchemin seul, immobile.
// Ce qui entoure Brume suit Brume quand on fait glisser l'île (une ancre, utils/vfx.js), à sa taille d'écran ; le
// parchemin et les écus qui volent vers la bourse parlent à l'interface : ils restent à l'écran.
import { reducedMotion } from './fx';
import { glyphSrc } from './glyph';
import { particule, gerbe, forme, arret, sprite, lueur, etoile, ancre, decale, decroche, anneau } from './vfx';
import { garderDansLEcran } from './cadre';

// La durée de la fête (ms)
export const FETE_MS = 3600;
// Quand Brume bondit, après l'anticipation (ms)
export const ECLAT_MS = 380;
// Les mots de Brume, dans sa voix (choix de l'auteur, 13 oct. : jamais « Bravo ! », bible § 7.4)
const MOTS = ['Youpi !', 'Hourra !', 'On l’a fait !', 'Ça brille !'];

// Les teintes, en canaux : l'or des écus, le clair, le mauve de Brume, la brume, la lune
const OR = '255,214,120', CLAIR = '255,248,226', MAUVE = '198,178,255', BRUME = '236,232,255', LUNE = '255,243,200';
const rnd = (a, b) => a + Math.random() * (b - a);
const ease = k => 1 - (1 - k) ** 3;
// l'apparition et l'effacement d'une forme (k : 0 → 1)
const tenue = (k, entree, sortie) => (k < entree ? k / entree : k > 1 - sortie ? (1 - k) / sortie : 1);

// --- les images dessinées une fois ---
// le croissant de lune et son halo
const lune = () => sprite('fete:lune', 160, (x, n) => {
  const c = n / 2;
  const h = x.createRadialGradient(c, c, n * 0.08, c, c, c);
  h.addColorStop(0, `rgba(${BRUME},.55)`);
  h.addColorStop(1, `rgba(${BRUME},0)`);
  x.fillStyle = h;
  x.fillRect(0, 0, n, n);
  const R = n * 0.2;
  x.fillStyle = `rgb(${LUNE})`;
  x.beginPath();
  x.arc(c, c - 3, R, 0, 7);
  x.arc(c + R * 0.48, c - R * 0.32, R * 0.9, 0, 7, true);
  x.fill('evenodd');
  x.strokeStyle = 'rgba(201,160,74,.9)';
  x.lineWidth = 2;
  x.stroke();
});
// l'éventail de ses douze rayons
const rayons = () => sprite('fete:rayons', 300, (x, n) => {
  const c = n / 2;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6, l = c * (i % 2 ? 0.82 : 1);
    const gr = x.createLinearGradient(c, c, c + Math.cos(a) * l, c + Math.sin(a) * l);
    gr.addColorStop(0, `rgba(${LUNE},.38)`);
    gr.addColorStop(1, `rgba(${LUNE},0)`);
    x.fillStyle = gr;
    x.beginPath();
    x.moveTo(c, c);
    x.lineTo(c + Math.cos(a - 0.08) * l, c + Math.sin(a - 0.08) * l);
    x.lineTo(c + Math.cos(a + 0.08) * l, c + Math.sin(a + 0.08) * l);
    x.fill();
  }
});
// l'écu : celui de la bibliothèque une fois chargé ; d'ici là, une pièce d'or dessinée
let ecuPret = null, ecuCharge = false;
function ecu() {
  if (ecuPret) return ecuPret;
  const src = glyphSrc('ui:coin');
  if (src && !ecuCharge) {
    ecuCharge = true;
    const img = new Image();
    img.onload = () => { ecuPret = sprite('fete:ecu', 48, (x, n) => x.drawImage(img, 0, 0, n, n)); };
    img.src = src;
  }
  return sprite('fete:ecu-dessin', 48, (x, n) => {
    const c = n / 2, gr = x.createRadialGradient(c * 0.7, c * 0.7, 2, c, c, c);
    gr.addColorStop(0, '#ffe7a0');
    gr.addColorStop(0.7, '#e9ae2e');
    gr.addColorStop(1, '#b9832a');
    x.fillStyle = gr;
    x.beginPath();
    x.arc(c, c, c - 2, 0, 7);
    x.fill();
    x.strokeStyle = 'rgba(90,58,18,.8)';
    x.lineWidth = 2;
    x.stroke();
  });
}

// Un élément de la fête, retiré au bout de ms
function pose(el, ms) {
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
  return el;
}
// Le voile qui assombrit l'île autour de Brume, et l'éclair : des éléments de la page (CSS, composés par le navigateur)
function voile(at) {
  const el = document.createElement('div');
  el.className = 'oc-fete-voile';
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--x', `${Math.round(at.x)}px`);
  el.style.setProperty('--y', `${Math.round(at.y)}px`);
  el.style.animationDuration = `${FETE_MS}ms`;
  return pose(el, FETE_MS);
}
function eclair(at) {
  const el = document.createElement('div');
  el.className = 'oc-fete-eclair';
  el.setAttribute('aria-hidden', 'true');
  el.style.left = `${Math.round(at.x)}px`;
  el.style.top = `${Math.round(at.y)}px`;
  return pose(el, 400);
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
  pose(el, FETE_MS - 1300);
  // (Brume près d'un bord ou du HUD : le parchemin, centré sur elle, glisse vers l'intérieur de l'écran et hors du HUD,
  // jamais rogné, son sceau compris : utils/cadre.js)
  garderDansLEcran(el);
  return el;
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
// Les éléments de la page autour de Brume, décalés de d (là où Brume est allée) : le voile recentre son ombre, l'éclair
// et le mot se déplacent (par une propriété que leur animation n'utilise pas)
function suivre(page, d) {
  // (rien à toucher tant que Brume n'a pas bougé d'un pixel)
  const cle = `${Math.round(d.x)},${Math.round(d.y)},${page.length}`;
  if (page.cle === cle) return;
  page.cle = cle;
  for (const [el, quoi] of page) {
    if (!el.isConnected) continue;
    if (quoi === 'voile') {
      el.style.setProperty('--dx', `${Math.round(d.x)}px`);
      el.style.setProperty('--dy', `${Math.round(d.y)}px`);
    } else if (quoi === 'eclair') el.style.translate = `${d.x}px ${d.y}px`;
    else el.style.transform = `translate(${d.x}px, ${d.y}px)`;
  }
}
// La bourse sursaute (un écu arrive)
function sursaut(purse) {
  if (!purse) return;
  purse.classList.remove('oc-bump');
  void purse.offsetWidth;
  purse.classList.add('oc-bump');
}

// at : Brume à l'écran (son cœur) ; sol : le point au sol sous elle ; purse : l'élément de la bourse ; titre, sous : le
// parchemin ; ecus : combien d'écus volent (décoratif : la bourse compte déjà le gain) ; suit : de combien Brume a
// bougé à l'écran depuis le départ, { x, y } (sans suit, la fête reste où elle est)
export function feteBrume({ at, sol, purse, titre = 'Quête accomplie', sous = '', ecus = 8, suit = null }) {
  const haut = { x: at.x, y: Math.max(70, at.y - 220) };
  if (reducedMotion()) {
    parchemin(haut, titre, sous, true);
    setTimeout(() => sursaut(purse), 400);
    return;
  }
  const ground = sol || { x: at.x, y: at.y + 40 };
  // la bourse, mesurée une fois (elle ne bouge pas pendant la fête)
  const r = purse && purse.getBoundingClientRect();
  const bourse = r ? { x: r.left + Math.min(r.width / 2, 24), y: r.top + r.height / 2 } : { x: 24, y: 24 };
  const S = ECLAT_MS / 1000;
  const A = suit ? ancre(suit) : null;
  const page = [[voile(at), 'voile']];
  // (les éléments de la page qui entourent Brume la suivent aussi, tant qu'ils sont là)
  if (A) forme(0, FETE_MS / 1000, () => suivre(page, decale(A)));

  // 1. anticipation : la brume aspirée vers Brume, sa lueur qui monte
  gerbe(at, 26, (i, a) => {
    const d = rnd(90, 170);
    return { img: lueur(i % 3 ? BRUME : MAUVE), x: at.x + Math.cos(a) * d, y: at.y + Math.sin(a) * d * 0.7, vx: -Math.sin(a) * 40, vy: Math.cos(a) * 40, vie: 0.6, taille: rnd(14, 24), vers: at, force: 900, arrive: 14, etire: 0.05, alpha: 2 };
  }, A);
  forme(0, S, (g, k) => {
    const s = 60 * (1 + k * 1.4);
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = k * 0.9;
    g.drawImage(lueur(BRUME), at.x - s / 2, at.y - s / 2, s, s);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
  }, A);

  // 2. éclat
  setTimeout(() => {
    arret(70);
    page.push([eclair(at), 'eclair']);
    gerbe(at, 18, (i, a) => ({ img: lueur(CLAIR), vx: Math.cos(a) * rnd(60, 140), vy: Math.sin(a) * rnd(60, 140), vie: rnd(0.3, 0.55), taille: rnd(6, 10), frein: 0.9, etire: 0.04 }), A);
    // les volutes de brume qui partent en tournoyant
    gerbe(at, 7, (i) => { const a = (i / 7) * Math.PI * 2; return { img: lueur(BRUME), vx: Math.cos(a) * 190, vy: Math.sin(a) * 130, vie: 0.9, taille: 12, frein: 0.93, bruit: 260, etire: 0.08 }; }, A);
  }, ECLAT_MS);

  // 3. magie : le cercle de brume au sol, la lune et ses rayons, deux ondes
  forme(S, 2.6, (g, k, t) => {
    const o = tenue(k, 0.12, 0.25), R = 30 + ease(Math.min(1, k * 2.5)) * 26;
    g.save();
    g.translate(ground.x, ground.y);
    g.scale(1, 0.42);
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = o;
    g.drawImage(lueur(MAUVE), -R * 1.2, -R * 1.2, R * 2.4, R * 2.4);
    g.lineWidth = 2;
    g.setLineDash([10, 7]);
    g.lineDashOffset = -t * 40;
    g.strokeStyle = `rgba(${BRUME},.8)`;
    g.beginPath();
    g.arc(0, 0, R, 0, 7);
    g.stroke();
    g.setLineDash([3, 6]);
    g.lineDashOffset = t * 30;
    g.strokeStyle = `rgba(${MAUVE},.85)`;
    g.beginPath();
    g.arc(0, 0, R * 0.74, 0, 7);
    g.stroke();
    g.setLineDash([]);
    for (let i = 0; i < 6; i++) {
      const a = t * 0.9 + (i * Math.PI) / 3, s = 10 + Math.sin(t * 6 + i) * 3;
      g.drawImage(etoile(i % 2 ? OR : CLAIR), Math.cos(a) * R - s / 2, Math.sin(a) * R - s / 2, s, s);
    }
    g.restore();
  }, A);
  forme(S, 2.6, (g, k, t) => {
    const o = tenue(k, 0.15, 0.25), z = 0.8 + ease(Math.min(1, k * 3)) * 0.25, cx = at.x, cy = at.y - 62;
    g.save();
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = o;
    g.translate(cx, cy);
    g.rotate(t * 0.35);
    const R = 150 * z * (1 + 0.04 * Math.sin(t * 2));
    g.drawImage(rayons(), -R, -R, R * 2, R * 2);
    g.restore();
    g.globalAlpha = o;
    const L = 160 * z;
    g.drawImage(lune(), cx - L / 2, cy - L / 2, L, L);
    g.globalAlpha = 1;
  }, A);
  const onde = (retard, max, epais, c, a0, vie) => forme(S + retard, vie, (g, k) => {
    const rr = 14 + ease(k) * max;
    g.globalCompositeOperation = 'lighter';
    g.strokeStyle = `rgba(${c},${(a0 * (1 - k)).toFixed(3)})`;
    g.lineWidth = epais * (1 - k * 0.7);
    g.beginPath();
    g.ellipse(ground.x, ground.y, rr, rr * 0.42, 0, 0, 7);
    g.stroke();
    g.globalCompositeOperation = 'source-over';
  }, A);
  onde(0, 150, 16, BRUME, 0.55, 0.9);
  // (l'anneau d'or dans son halo bleu, comme les fêtes de l'île : utils/vfx.js)
  forme(S + 0.09, 0.7, (g, k, t) => {
    const rr = 14 + ease(k) * 120;
    g.globalCompositeOperation = 'lighter';
    anneau(g, ground.x, ground.y, rr, rr * 0.42, 1 - k, 3 * (1 - k * 0.7), 6, t);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
  }, A);

  // 4. les lucioles, le mot, le parchemin
  setTimeout(() => gerbe(at, 36, (i) => {
    const a = -Math.PI / 2 + rnd(-1.4, 1.4), v = rnd(60, 180);
    return { img: etoile([MAUVE, OR, CLAIR][i % 3]), x: at.x + rnd(-10, 10), y: at.y + rnd(-10, 10), vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, vie: rnd(1.9, 2.9), taille: rnd(16, 24), frein: 0.965, grav: -18, bruit: 90, clign: rnd(6, 12), etire: 0.02, alpha: 2 };
  }, A), ECLAT_MS + 120);
  setTimeout(() => page.push([mot(at), 'mot']), ECLAT_MS + 300);
  setTimeout(() => parchemin(haut, titre, sous, false), ECLAT_MS + 520);

  // 5. les écus : une fontaine, puis la bourse les attire un à un
  setTimeout(() => {
    for (let i = 0; i < ecus; i++) {
      setTimeout(() => {
        const a = -Math.PI / 2 + rnd(-0.9, 0.9), v = rnd(170, 240);
        const p = particule({ img: ecu(), x: at.x, y: at.y - 8, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 4, taille: 20, tour: rnd(7, 11), grav: 260, frein: 0.985, alpha: 1, add: false, ancre: A,
          fin: () => {
            sursaut(purse);
            gerbe(bourse, 6, (j, b) => ({ img: lueur(OR), vx: Math.cos(b) * rnd(40, 90), vy: Math.sin(b) * rnd(40, 90), vie: 0.4, taille: 8, frein: 0.9 }));
          } });
        // (elle jaillit de Brume, puis la bourse, à l'écran, l'attire : elle quitte l'ancre de Brume)
        if (p) setTimeout(() => {
          decroche(p);
          Object.assign(p, { vers: bourse, force: 1400, grav: 0, arrive: 14, sillage: 0.5, semis: etoile(OR) });
        }, 520 + i * 70);
      }, i * 55);
    }
  }, ECLAT_MS + 880);
}

// Les images de la fête se préparent quand le navigateur est libre (la première fête ne paie pas leur dessin)
if (typeof window !== 'undefined' && window.requestIdleCallback) {
  window.requestIdleCallback(() => {
    lune();
    rayons();
    ecu();
    for (const c of [OR, CLAIR, MAUVE, BRUME]) { lueur(c); etoile(c); }
  });
}
