// Moteur du Livre : pages tournées en WebGL (vraie courbure), repli en fondu sans WebGL.
// - le maillage de la feuille s'enroule sur un cylindre qui suit le doigt ;
// - lumière, reflet sur le pli, ombre portée et transparence du papier dans les shaders ;
// - rendu seulement pendant un tour (rien ne tourne au repos) ; pages voisines préparées à l'avance ;
// - perte de contexte gérée ; destroy() retire écouteurs, boucles, textures, tampons et programme ;
// - double page (opts.spread, grand écran) : la feuille de droite se soulève et retombe à gauche, son verso est
//   la vraie page suivante ; la page visée (gauche ou droite) est la dernière touchée ;
// - vue rapprochée (opts.zoom, téléphone) : la double page lue de près, une page à la fois ; la caméra (BookView)
//   glisse d'une page à l'autre de la même double page, et la feuille tourne pour changer de double page.
// Le contenu des pages vient de paint(index, ctx, largeur, hauteur, côté) → { hotspots, label } ; en double page,
// index vaut aussi −1 (la garde, au revers de la couverture) ou count() (la garde de fin).
import { paperNoise as noise, PAPER_BACK } from './painter';
import { reducedMotion } from '@/utils/fx';
import { spreadOf, pagesOf, sideOf, spreadCount, spreadSpots } from './spread';

const VERT = `
attribute vec2 aUV;
uniform vec2 uPage, uOrigin, uCanvas, uL, uDir;
uniform float uR, uCurl, uDepth;
varying vec2 vUV;
varying vec3 vN;
varying float vD;
void main() {
  vec2 p = aUV * uPage;
  vec3 pos = vec3(p, 0.0);
  vec3 n = vec3(0.0, 0.0, 1.0);
  float d = dot(p - uL, uDir);
  if (uCurl > 0.5 && d > 0.0) {
    vec2 base = p - uDir * d;
    float half_ = 3.14159265 * uR;
    if (d < half_) {
      float a = d / uR;
      pos.xy = base + uDir * (uR * sin(a));
      pos.z = uR * (1.0 - cos(a));
      n = vec3(-uDir * sin(a), cos(a));
    } else {
      pos.xy = base - uDir * (d - half_);
      pos.z = 2.0 * uR;
      n = vec3(0.0, 0.0, -1.0);
    }
  }
  vUV = aUV;
  vN = n;
  vD = d;
  vec2 c = uCanvas * 0.5;
  vec2 world = uOrigin + pos.xy;
  vec2 sp = c + (world - c) * (uDepth / (uDepth - pos.z));
  gl_Position = vec4(sp.x / uCanvas.x * 2.0 - 1.0, 1.0 - sp.y / uCanvas.y * 2.0, -pos.z / (4.0 * uR + 1.0), 1.0);
}`;
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uFront, uBack;
uniform vec2 uPageF;
uniform float uMode, uCurlF, uRF, uCorner, uAlpha, uMirror, uBackPage;
varying vec2 vUV;
varying vec3 vN;
varying float vD;
void main() {
  vec2 p = vUV * uPageF;
  // Page de gauche à plat : la reliure est à droite, les grands coins à gauche
  vec2 pm = uMirror > 0.5 ? vec2(uPageF.x - p.x, p.y) : p;
  float rc = pm.x > uPageF.x * 0.5 ? uCorner : uCorner * 0.3;
  vec2 inner = clamp(pm, vec2(rc), uPageF - vec2(rc));
  float mask = clamp(0.5 - (length(pm - inner) - rc), 0.0, 1.0);
  if (mask <= 0.0) discard;
  vec3 col;
  if (uMode > 0.5) {
    col = texture2D(uFront, vUV).rgb;
    if (uCurlF > 0.5 && vD > 0.0) col *= 1.0 - 0.5 * exp(-max(vD - uRF * 0.6, 0.0) / (uRF * 2.2));
  } else {
    vec3 n = normalize(vN);
    bool front = n.z >= 0.0;
    vec3 nv = front ? n : -n;
    vec3 base;
    if (front) base = texture2D(uFront, vUV).rgb;
    else if (uBackPage > 0.5) {
      // Verso imprimé (double page) : la page suivante, vue de l'autre côté de la feuille
      vec3 paper = texture2D(uBack, vec2(1.0 - vUV.x, vUV.y)).rgb;
      base = mix(paper, paper * texture2D(uFront, vUV).rgb, 0.06);
    } else {
      vec3 paper = texture2D(uBack, vUV).rgb;
      base = mix(paper, paper * texture2D(uFront, vUV).rgb, 0.12);
    }
    vec3 L = normalize(vec3(-0.35, -0.55, 1.0));
    float diff = clamp(dot(nv, L) / L.z, 0.0, 1.0);
    float shade = mix(0.58, 1.0, diff);
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(nv, H), 0.0), 42.0) * 0.2 * uCurlF * step(0.0, vD);
    float ao = 1.0;
    if (uCurlF > 0.5 && vD < 0.0) ao = 1.0 - 0.3 * exp(vD / (uRF * 1.3));
    col = base * shade * ao + spec;
  }
  float a = mask * uAlpha;
  gl_FragColor = vec4(col * a, a);
}`;

export function createBook(opts) {
  const { stage, rig, wrap, hot, count, paint, onChange, onRest } = opts;
  const spread = Boolean(opts.spread);
  const zoom = spread && Boolean(opts.zoom);
  const ac = new AbortController();
  const on = (target, type, fn, extra) => target.addEventListener(type, fn, { ...extra, signal: ac.signal });
  const canvas = document.createElement('canvas');
  canvas.className = 'gl';
  rig.insertBefore(canvas, hot);
  const COLS = 44, ROWS = 30, POOL = spread ? 8 : 4;

  let gl = null, ctx2d = null, prog = null, buf = null, ibuf = null, backTex = null, indexCount = 0;
  const loc = {};
  let dpr = 1, cw = 0, ch = 0;
  // Feuille de droite (la seule, hors double page), en px CSS, relative au canvas
  const page = { x: 0, y: 0, w: 0, h: 0 };
  // Position : numéro de page, ou de double page ; side : page visée sur la double page
  const start = opts.start || 0;
  let at = spread ? spreadOf(start) : start, side = spread ? sideOf(start) : 'right', version = 0;
  const pool = [];
  // Tour en cours : P0 = point saisi (bord droit), F = doigt (en px de texture) ; goal = position visée,
  // goalPage = page à viser à l'arrivée (double page ; null : choix par défaut)
  let phase = 'idle', dir = 0, goal = 0, goalPage = null, turning = false, fade = 1;
  // Double page fermée (ouverture du grimoire) : seule la page de droite est peinte
  let closed = false;
  const P0 = { x: 0, y: 0 }, F = { x: 0, y: 0 }, F0 = { x: 0, y: 0 }, Fend = { x: 0, y: 0 };
  let raf = 0, anim = null, pointer = null, suppressClick = false, prefetchTimer = 0, layoutRaf = 0;
  let sx = 0, sy = 0, xPrev = 0, tPrev = 0, xLast = 0, yLast = 0, tLast = 0;

  const W = () => page.w * dpr;
  const H = () => page.h * dpr;
  const positions = () => (spread ? spreadCount(count()) : count());
  const valid = i => i >= 0 && i < count();
  // Page visée : la page elle-même, ou celle du côté visé sur la double page
  const activeIndex = () => (!spread ? at : side === 'left' ? pagesOf(at).left : pagesOf(at).right);
  // Côté visé toujours sur une vraie page (pas sur une garde)
  function fixSide() {
    if (!spread) return;
    const { left, right } = pagesOf(at);
    if (side === 'left' && !valid(left)) side = 'right';
    else if (side === 'right' && !valid(right)) side = 'left';
  }
  // Côté visé à l'arrivée du tour en cours : la page demandée ; sinon, de près, la page qu'on lit ensuite (la
  // gauche en avançant, la droite en reculant) ; sinon le choix de BookView (pickSide)
  function arrivalSide() {
    const { left, right } = pagesOf(goal);
    let s = goalPage !== null ? sideOf(goalPage) : zoom ? (dir > 0 ? 'left' : 'right') : opts.pickSide ? opts.pickSide({ left, right }) : 'left';
    if (s === 'left' && !valid(left)) s = 'right';
    else if (s === 'right' && !valid(right)) s = 'left';
    return s;
  }
  // Un tour validé commence : BookView fait suivre la caméra vers la page d'arrivée
  function announceTurn() {
    if (!opts.onTurn) return;
    opts.onTurn(spread ? (arrivalSide() === 'left' ? pagesOf(goal).left : pagesOf(goal).right) : goal);
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function makeTexture() {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function initGL() {
    gl = null;
    if (!opts.forceFallback) {
      try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, depth: true }); } catch { gl = null; }
    }
    if (!gl) {
      ctx2d = canvas.getContext('2d');
      return;
    }
    try {
      prog = gl.createProgram();
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (error) {
      console.warn('WebGL indisponible, repli en fondu', error);
      gl = null;
      ctx2d = canvas.getContext('2d');
      return;
    }
    gl.useProgram(prog);
    for (const name of ['uPage', 'uOrigin', 'uCanvas', 'uL', 'uDir', 'uR', 'uCurl', 'uDepth', 'uFront', 'uBack', 'uMode', 'uCorner', 'uAlpha', 'uPageF', 'uCurlF', 'uRF', 'uMirror', 'uBackPage']) loc[name] = gl.getUniformLocation(prog, name);
    loc.aUV = gl.getAttribLocation(prog, 'aUV');
    // Grille de la feuille
    const verts = new Float32Array((COLS + 1) * (ROWS + 1) * 2);
    let k = 0;
    for (let r = 0; r <= ROWS; r++) for (let c = 0; c <= COLS; c++) { verts[k++] = c / COLS; verts[k++] = r / ROWS; }
    const idx = new Uint16Array(COLS * ROWS * 6);
    k = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const a = r * (COLS + 1) + c, b = a + 1, d = a + COLS + 1, e = d + 1;
      idx[k++] = a; idx[k++] = d; idx[k++] = b; idx[k++] = b; idx[k++] = d; idx[k++] = e;
    }
    indexCount = idx.length;
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc.aUV);
    gl.vertexAttribPointer(loc.aUV, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LESS);
    // Verso : papier un peu plus sombre, même grain
    const back = document.createElement('canvas');
    back.width = 256;
    back.height = 342;
    const b2 = back.getContext('2d');
    b2.fillStyle = PAPER_BACK;
    b2.fillRect(0, 0, 256, 342);
    b2.fillStyle = b2.createPattern(noise(), 'repeat');
    b2.fillRect(0, 0, 256, 342);
    backTex = makeTexture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, back);
    for (const entry of pool) entry.tex = makeTexture();
  }
  function releaseGL() {
    if (!gl) return;
    for (const entry of pool) if (entry.tex) gl.deleteTexture(entry.tex);
    if (backTex) gl.deleteTexture(backTex);
    if (buf) gl.deleteBuffer(buf);
    if (ibuf) gl.deleteBuffer(ibuf);
    if (prog) gl.deleteProgram(prog);
    for (const entry of pool) entry.tex = null;
    backTex = buf = ibuf = prog = null;
  }

  for (let i = 0; i < POOL; i++) {
    const c = document.createElement('canvas');
    pool.push({ canvas: c, ctx: c.getContext('2d'), tex: null, index: null, version: -1, hotspots: [], label: '' });
  }

  function layout() {
    layoutRaf = 0;
    // Le canvas couvre le gréement (plus large que la scène en vue rapprochée : la caméra le fait glisser)
    const rect = rig.getBoundingClientRect();
    const book = wrap.getBoundingClientRect();
    const rigRect = rig.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = Math.round(rect.width * dpr);
    ch = Math.round(rect.height * dpr);
    canvas.width = cw;
    canvas.height = ch;
    // En double page, wrap couvre les deux pages : la feuille qui tourne est celle de droite
    page.w = spread ? book.width / 2 : book.width;
    page.h = book.height;
    page.x = book.left - rigRect.left + (spread ? page.w : 0);
    page.y = book.top - rigRect.top;
    Object.assign(hot.style, { left: `${book.left - rigRect.left}px`, top: `${page.y}px`, width: `${book.width}px`, height: `${page.h}px` });
    for (const entry of pool) {
      entry.canvas.width = Math.round(W());
      entry.canvas.height = Math.round(H());
      entry.index = null;
    }
    version++;
    if (anim) finishNow();
    draw();
    rest();
  }

  // Pages affichées (et celles de l'arrivée pendant un tour) : jamais évincées du cache
  function shown(i) {
    const list = spread ? [pagesOf(at).left, pagesOf(at).right] : [at];
    if (turning) list.push(...(spread ? [pagesOf(goal).left, pagesOf(goal).right] : [goal]));
    return list.includes(i);
  }
  function victim() {
    const focus = spread ? 2 * at : at;
    let best = null, distance = -1;
    for (const entry of pool) {
      if (entry.index !== null && shown(entry.index)) continue;
      const d = entry.index === null ? 1e9 : Math.abs(entry.index - focus);
      if (d > distance) { distance = d; best = entry; }
    }
    return best || pool[0];
  }
  function entry(i) {
    let e = pool.find(p => p.index === i);
    if (e && e.version === version) return e;
    if (!e) e = victim();
    e.index = i;
    e.version = version;
    const result = paint(i, e.ctx, e.canvas.width, e.canvas.height, spread ? sideOf(i) : 'right');
    e.hotspots = result.hotspots;
    e.label = result.label;
    if (gl && e.tex) {
      gl.bindTexture(gl.TEXTURE_2D, e.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, e.canvas);
    }
    return e;
  }

  function curl() {
    const w = W();
    const dx = P0.x - F.x, dy = P0.y - F.y;
    const length = Math.hypot(dx, dy);
    const progress = Math.min(1, Math.max(0, dx / (P0.x - Fend.x)));
    let angle = length > 1 ? Math.atan2(dy, dx) : 0;
    if (dx <= 0) angle = 0;
    const tilt = .55 * (1 - progress);
    angle = Math.max(-tilt, Math.min(tilt, angle));
    // Double page : le rayon du pli s'efface en fin de tour, pour que la feuille retombe à plat sur la gauche
    const r = spread ? w * Math.max(.002, .1 * (1 - progress)) : w * (.1 - .04 * progress);
    return { lx: (P0.x + F.x) / 2, ly: (P0.y + F.y) / 2, ux: Math.cos(angle), uy: Math.sin(angle), r, progress };
  }

  // x : bord gauche de la feuille (px CSS) ; mirror : page de gauche à plat ; back : page imprimée au verso
  function drawSheet(e, mode, c, a, { x = page.x, mirror = false, back = null } = {}) {
    gl.uniform2f(loc.uOrigin, x * dpr, page.y * dpr);
    gl.uniform1f(loc.uMirror, mirror ? 1 : 0);
    gl.uniform1f(loc.uBackPage, back ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, e.tex);
    gl.uniform1i(loc.uFront, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, back ? back.tex : backTex);
    gl.uniform1i(loc.uBack, 1);
    gl.uniform1f(loc.uMode, mode);
    gl.uniform1f(loc.uAlpha, a);
    const r = c ? c.r : W() * .1;
    // La page de dessous reste à plat (uCurl, sommets) mais reçoit l'ombre du pli (uCurlF, pixels)
    gl.uniform1f(loc.uCurl, c && mode === 0 ? 1 : 0);
    gl.uniform1f(loc.uCurlF, c ? 1 : 0);
    gl.uniform1f(loc.uR, r);
    gl.uniform1f(loc.uRF, r);
    if (c) {
      gl.uniform2f(loc.uL, c.lx, c.ly);
      gl.uniform2f(loc.uDir, c.ux, c.uy);
    }
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
  }

  function draw() {
    if (!cw || !page.w) return;
    if (!gl) return draw2d();
    if (gl.isContextLost()) return;
    gl.viewport(0, 0, cw, ch);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(loc.uPage, W(), H());
    gl.uniform2f(loc.uPageF, W(), H());
    gl.uniform2f(loc.uCanvas, cw, ch);
    gl.uniform1f(loc.uDepth, H() * 2.6);
    gl.uniform1f(loc.uCorner, 20 * dpr);
    if (spread) return drawSpread();
    if (turning && phase !== 'fade') {
      const c = curl();
      const under = entry(dir > 0 ? goal : at);
      const front = entry(dir > 0 ? at : goal);
      gl.disable(gl.DEPTH_TEST);
      drawSheet(under, 1, c, 1);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      drawSheet(front, 0, c, 1);
      gl.disable(gl.DEPTH_TEST);
    } else if (phase === 'fade') {
      drawSheet(entry(goal), 0, null, 1);
      drawSheet(entry(at), 0, null, fade);
    } else {
      drawSheet(entry(at), 0, null, 1);
    }
  }
  // Double page : vers l'avant, la feuille de droite (recto : la page de droite, verso : la future page de gauche)
  // se soulève au-dessus de la page de droite suivante ; vers l'arrière, la feuille revient de la gauche
  function drawSpread() {
    const now = pagesOf(at), to = pagesOf(goal);
    const left = page.x - page.w;
    const pair = (pages, a) => {
      if (!closed) drawSheet(entry(pages.left), 0, null, a, { x: left, mirror: true });
      drawSheet(entry(pages.right), 0, null, a);
    };
    gl.disable(gl.DEPTH_TEST);
    if (turning && phase !== 'fade') {
      const c = curl();
      const ahead = dir > 0;
      drawSheet(entry(ahead ? now.left : to.left), 0, null, 1, { x: left, mirror: true });
      drawSheet(entry(ahead ? to.right : now.right), 1, c, 1);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      drawSheet(entry(ahead ? now.right : to.right), 0, c, 1, { back: entry(ahead ? to.left : now.left) });
      gl.disable(gl.DEPTH_TEST);
    } else if (phase === 'fade') {
      pair(to, 1);
      pair(now, fade);
    } else {
      pair(now, 1);
    }
  }
  function draw2d() {
    ctx2d.clearRect(0, 0, cw, ch);
    const left = page.x - page.w;
    const pair = (pages, a) => {
      if (!closed) sheet2d(entry(pages.left), left, true, a);
      sheet2d(entry(pages.right), page.x, false, a);
    };
    if (!spread) {
      if (phase === 'fade') sheet2d(entry(goal), page.x, false, 1);
      sheet2d(entry(at), page.x, false, phase === 'fade' ? fade : 1);
    } else if (phase === 'fade') {
      pair(pagesOf(goal), 1);
      pair(pagesOf(at), fade);
    } else {
      pair(pagesOf(at), 1);
    }
  }
  // Coins arrondis comme en WebGL : petit côté reliure, grand côté tranche (à gauche pour une page de gauche)
  function sheet2d(e, px, mirror, a) {
    const x = px * dpr, y = page.y * dpr, w = W(), h = H();
    const big = 20 * dpr, small = 6 * dpr;
    const [tl, tr, br, bl] = mirror ? [big, small, small, big] : [small, big, big, small];
    ctx2d.save();
    ctx2d.globalAlpha = a;
    ctx2d.beginPath();
    ctx2d.moveTo(x + tl, y);
    ctx2d.arcTo(x + w, y, x + w, y + h, tr);
    ctx2d.arcTo(x + w, y + h, x, y + h, br);
    ctx2d.arcTo(x, y + h, x, y, bl);
    ctx2d.arcTo(x, y, x + w, y, tl);
    ctx2d.clip();
    ctx2d.drawImage(e.canvas, x, y);
    ctx2d.restore();
  }

  // Fin de tour, ou état de repos après un changement : couche interactive et voisines
  function rest() {
    if (turning || phase !== 'idle') return;
    hot.classList.remove('is-turning');
    notify();
    clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(() => {
      if (turning) return;
      const near = [at + 1, at - 1].filter(p => p >= 0 && p < positions());
      (spread ? near.flatMap(p => [pagesOf(p).left, pagesOf(p).right]) : near).forEach(i => entry(i));
    }, 80);
  }
  // Page visée, zones et texte : en double page, les zones des deux pages, et le texte de la page visée d'abord
  function notify() {
    if (!onRest) return;
    if (!spread) {
      const e = entry(at);
      onRest(at, e.hotspots, e.label);
      return;
    }
    fixSide();
    const active = activeIndex();
    const { left, right } = pagesOf(at);
    const pages = [left, right].filter(valid).map(i => ({ i, e: entry(i) }));
    // De près, seule la page lue est interactive (l'autre est hors champ)
    const live = zoom ? pages.filter(p => p.i === active) : pages;
    const hotspots = live.flatMap(({ i, e }) => spreadSpots(e.hotspots, sideOf(i)));
    const labels = [...live].sort((a, b) => (b.i === active) - (a.i === active)).map(p => p.e.label);
    onRest(active, hotspots, labels.join(' — '));
  }
  // Double page : toucher une page la vise (l'Athanor y envoie ses verdicts)
  function aimAt(event) {
    const rect = hot.getBoundingClientRect();
    const s = (event.clientX - rect.left) / rect.width < .5 ? 'left' : 'right';
    const i = s === 'left' ? pagesOf(at).left : pagesOf(at).right;
    if (s !== side && valid(i)) {
      side = s;
      notify();
    }
  }

  function begin(d, tgt, y) {
    dir = d;
    goal = tgt;
    turning = true;
    hot.classList.add('is-turning');
    const w = W(), h = H();
    P0.x = w;
    P0.y = Math.min(h * .92, Math.max(h * .08, y));
    // Page simple : la feuille part au-delà de la reliure ; double page : elle retombe en miroir sur la gauche
    Fend.x = spread ? -P0.x : 2 * (-(Math.PI * .06 + .035) * w) - P0.x;
    Fend.y = P0.y;
    const start = d > 0 ? P0 : Fend;
    F.x = F0.x = start.x;
    F.y = F0.y = start.y;
  }
  function end(commit) {
    turning = false;
    phase = 'idle';
    if (commit) {
      if (spread) side = arrivalSide();
      at = goal;
    }
    goalPage = null;
    draw();
    if (commit && onChange) onChange(activeIndex());
    rest();
  }

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeBack = t => { const s = 1.4; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  function animateTo(tx, ty, duration, ease, lift, done) {
    const fx = F.x, fy = F.y, t0 = performance.now();
    anim = { tx, ty, done };
    const step = now => {
      const t = Math.min(1, (now - t0) / duration);
      const e = ease(t);
      F.x = fx + (tx - fx) * e;
      F.y = fy + (ty - fy) * e - lift * Math.sin(Math.PI * t);
      draw();
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        const finish = anim.done;
        anim = null;
        finish();
      }
    };
    raf = requestAnimationFrame(step);
  }
  function finishNow() {
    if (!anim) return;
    cancelAnimationFrame(raf);
    raf = 0;
    F.x = anim.tx;
    F.y = anim.ty;
    const finish = anim.done;
    anim = null;
    finish();
  }
  function settle(commit, speed, resolve) {
    phase = 'anim';
    const to = commit === (dir > 0) ? Fend : P0;
    const distance = Math.abs(to.x - F.x);
    const duration = Math.max(170, Math.min(620, (distance / (P0.x - Fend.x)) * 720)) * speed;
    animateTo(to.x, to.y, duration, commit ? easeOut : easeBack, 0, () => {
      end(commit);
      if (resolve) resolve(commit);
    });
  }

  // Aller à une position (page, ou double page) ; pageIndex : la page à viser à l'arrivée (double page)
  function move(pos, pageIndex = null, speed = 1) {
    if (anim) finishNow();
    if (phase !== 'idle' || pos < 0 || pos >= positions()) return Promise.resolve(false);
    if (pos === at) {
      // Déjà sur la bonne double page : seule la page visée change
      if (spread && pageIndex !== null && sideOf(pageIndex) !== side) {
        side = sideOf(pageIndex);
        fixSide();
        notify();
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
    goalPage = pageIndex;
    dir = pos > at ? 1 : -1;
    return new Promise(resolve => {
      if (reducedMotion() || !gl) {
        // Fondu
        goal = pos;
        phase = 'fade';
        turning = true;
        hot.classList.add('is-turning');
        announceTurn();
        const t0 = performance.now();
        anim = {
          tx: 0, ty: 0, done: () => {
            fade = 1;
            end(true);
            resolve(true);
          }
        };
        const step = now => {
          fade = 1 - Math.min(1, (now - t0) / (190 * speed));
          draw();
          if (fade > 0) raf = requestAnimationFrame(step);
          else { raf = 0; const finish = anim.done; anim = null; finish(); }
        };
        raf = requestAnimationFrame(step);
        return;
      }
      const d = dir;
      begin(d, pos, H() * .62);
      announceTurn();
      phase = 'anim';
      const finish = d > 0 ? Fend : P0;
      animateTo(finish.x, finish.y, (spread ? 700 : 560) * speed, easeOut, d > 0 ? H() * .07 : -H() * .04, () => {
        end(true);
        resolve(true);
      });
    });
  }

  // Page publique : en double page, aller à sa double page et la viser
  const go = (i, speed = 1) => (spread ? move(spreadOf(i), i, speed) : move(i, null, speed));

  // Page suivante, précédente : de près, d'abord l'autre page de la même double page (rien ne tourne)
  function next() {
    if (zoom && side === 'left' && phase === 'idle' && !anim && valid(pagesOf(at).right)) return look('right');
    return move(at + 1);
  }
  function prev() {
    if (zoom && side === 'right' && phase === 'idle' && !anim && valid(pagesOf(at).left)) return look('left');
    return move(at - 1);
  }
  function look(s) {
    side = s;
    notify();
    if (onChange) onChange(activeIndex());
    return Promise.resolve(true);
  }

  function tap(event) {
    if (event.target.closest('button')) return;
    const rect = hot.getBoundingClientRect();
    let x = (event.clientX - rect.left) / rect.width;
    // De près : position dans la page lue (au-delà de ses bords, la page voisine qui dépasse)
    if (zoom) x = x * 2 - (side === 'right' ? 1 : 0);
    // Bord extérieur d'une page : tourner (sur la double page, le tiers extérieur de chaque page)
    const edge = spread && !zoom ? .17 : .34;
    if (x > 1 - edge) next();
    else if (x < edge) prev();
  }

  on(hot, 'pointerdown', event => {
    if (event.button !== 0 || pointer !== null) return;
    if (anim) finishNow();
    if (phase !== 'idle') return;
    if (spread && !zoom) aimAt(event);
    suppressClick = false;
    pointer = event.pointerId;
    sx = xPrev = xLast = event.clientX;
    sy = yLast = event.clientY;
    tPrev = tLast = event.timeStamp;
    phase = 'press';
  });
  on(hot, 'pointermove', event => {
    if (event.pointerId !== pointer) return;
    if (phase === 'press') {
      const dx = event.clientX - sx, dy = event.clientY - sy;
      // Un geste en diagonale (coin tiré) tourne aussi la page ; seul un geste nettement vertical fait défiler
      if (Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * .8) {
        const d = dx < 0 ? 1 : -1;
        const tgt = at + d;
        suppressClick = true;
        // De près, vers l'autre page de la même double page : la caméra glissera au lâcher
        if (zoom && ((d > 0 && side === 'left' && valid(pagesOf(at).right)) || (d < 0 && side === 'right' && valid(pagesOf(at).left)))) {
          phase = 'swipe';
          dir = d;
          return;
        }
        if (tgt < 0 || tgt >= positions()) { phase = 'blocked'; return; }
        if (reducedMotion() || !gl) { phase = 'swipe'; dir = d; return; }
        hot.setPointerCapture(pointer);
        const rect = hot.getBoundingClientRect();
        begin(d, tgt, ((event.clientY - rect.top) / rect.height) * H());
        sx = event.clientX;
        sy = event.clientY;
        phase = 'drag';
      } else if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx) * 1.25) {
        phase = 'blocked';
      }
      return;
    }
    if (phase === 'drag') {
      xPrev = xLast;
      tPrev = tLast;
      xLast = event.clientX;
      yLast = event.clientY;
      tLast = event.timeStamp;
      if (!raf) raf = requestAnimationFrame(frameDrag);
    }
  });
  function frameDrag() {
    raf = 0;
    if (phase !== 'drag') return;
    const gain = (P0.x - Fend.x) / (1.45 * W());
    F.x = Math.min(P0.x, Math.max(Fend.x, F0.x + (xLast - sx) * dpr * gain));
    F.y = F0.y + (yLast - sy) * dpr * .5;
    draw();
  }
  const release = event => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    if (phase === 'drag') {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      frameDrag();
      const dt = tLast - tPrev;
      const velocity = dt > 0 && event.timeStamp - tLast < 100 ? (xLast - xPrev) / dt : 0;
      const flick = dir > 0 ? -velocity : velocity;
      const progress = dir > 0 ? curl().progress : 1 - curl().progress;
      const commit = event.type === 'pointerup' && (flick > .45 || (flick > -.45 && progress > .3));
      if (commit) announceTurn();
      settle(commit, 1, null);
    } else if (phase === 'swipe') {
      phase = 'idle';
      if (dir > 0) next();
      else prev();
    } else if (phase === 'press') {
      phase = 'idle';
      if (event.type === 'pointerup') tap(event);
    } else if (phase !== 'anim' && phase !== 'fade') {
      phase = 'idle';
    }
  };
  on(hot, 'pointerup', release);
  on(hot, 'pointercancel', release);
  on(hot, 'click', event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.stopPropagation();
    event.preventDefault();
  }, { capture: true });
  on(hot, 'keydown', event => {
    if (event.key === 'ArrowRight') next();
    else if (event.key === 'ArrowLeft') prev();
  });
  on(canvas, 'webglcontextlost', event => {
    event.preventDefault();
    if (anim) finishNow();
    cancelAnimationFrame(raf);
    raf = 0;
  });
  on(canvas, 'webglcontextrestored', () => {
    initGL();
    version++;
    draw();
  });
  const observer = new ResizeObserver(() => {
    if (!layoutRaf) layoutRaf = requestAnimationFrame(layout);
  });
  observer.observe(stage);

  initGL();
  layout();

  return {
    go,
    // Page visée (la page affichée, ou celle du côté visé sur la double page)
    get index() { return activeIndex(); },
    // Change de page sans animation (pages rechargées, page courante retrouvée par son identifiant)
    jump(i) {
      if (anim) finishNow();
      if (phase !== 'idle' || i < 0 || i >= count()) return;
      at = spread ? spreadOf(i) : i;
      if (spread) {
        side = sideOf(i);
        fixSide();
      }
      version++;
      draw();
      rest();
    },
    // Double page fermée (ouverture du grimoire) : la page de gauche n'apparaît qu'une fois la couverture posée
    setClosed(flag) {
      closed = Boolean(flag);
      if (!turning) draw();
    },
    // Le contenu a changé : repeindre et réafficher (pendant un tour, la fin s'en charge)
    refresh() {
      version++;
      if (!turning) { draw(); rest(); }
    },
    // Rectangle écran d'une zone de la page visible (pour les effets)
    rectOf(id) {
      const e = pool.find(p => p.index === activeIndex());
      const spot = e && e.hotspots.find(s => s.id === id);
      const rect = hot.getBoundingClientRect();
      if (!spot) return null;
      const width = spread ? rect.width / 2 : rect.width;
      const left = rect.left + (spread && side === 'right' ? width : 0);
      const k = width / 100;
      return { left: left + spot.x * k, top: rect.top + spot.y * k, width: spot.w * k, height: spot.h * k };
    },
    destroy() {
      ac.abort();
      observer.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(layoutRaf);
      clearTimeout(prefetchTimer);
      raf = layoutRaf = 0;
      anim = null;
      releaseGL();
      if (gl) {
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
      gl = null;
      for (const e of pool) { e.canvas.width = e.canvas.height = 0; }
      pool.length = 0;
      canvas.remove();
      hot.classList.remove('is-turning');
    }
  };
}
