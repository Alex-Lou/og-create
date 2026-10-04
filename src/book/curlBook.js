// Moteur du Livre : pages tournées en WebGL (vraie courbure), repli en fondu sans WebGL.
// - le maillage de la feuille s'enroule sur un cylindre qui suit le doigt ;
// - lumière, reflet sur le pli, ombre portée et transparence du papier dans les shaders ;
// - rendu seulement pendant un tour (rien ne tourne au repos) ; pages voisines préparées à l'avance ;
// - perte de contexte gérée ; destroy() retire écouteurs, boucles, textures, tampons et programme.
// Le contenu des pages vient de paint(index, ctx, largeur, hauteur) → { hotspots, label }.
import { paperNoise as noise } from './painter';
import { reducedMotion } from '@/utils/fx';

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
uniform float uMode, uCurlF, uRF, uCorner, uAlpha;
varying vec2 vUV;
varying vec3 vN;
varying float vD;
void main() {
  vec2 p = vUV * uPageF;
  float rc = p.x > uPageF.x * 0.5 ? uCorner : uCorner * 0.3;
  vec2 inner = clamp(p, vec2(rc), uPageF - vec2(rc));
  float mask = clamp(0.5 - (length(p - inner) - rc), 0.0, 1.0);
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
    else {
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
  const ac = new AbortController();
  const on = (target, type, fn, extra) => target.addEventListener(type, fn, { ...extra, signal: ac.signal });
  const canvas = document.createElement('canvas');
  canvas.className = 'gl';
  rig.insertBefore(canvas, hot);
  const COLS = 44, ROWS = 30, POOL = 4;

  let gl = null, ctx2d = null, prog = null, buf = null, ibuf = null, backTex = null, indexCount = 0;
  const loc = {};
  let dpr = 1, cw = 0, ch = 0;
  const page = { x: 0, y: 0, w: 0, h: 0 }; // en px CSS, relatif au canvas
  let index = opts.start || 0, version = 0;
  const pool = [];
  // Tour en cours : P0 = point saisi (bord droit), F = doigt (en px de texture)
  let phase = 'idle', dir = 0, target = 0, turning = false, fade = 1;
  const P0 = { x: 0, y: 0 }, F = { x: 0, y: 0 }, F0 = { x: 0, y: 0 }, Fend = { x: 0, y: 0 };
  let raf = 0, anim = null, pointer = null, suppressClick = false, prefetchTimer = 0, layoutRaf = 0;
  let sx = 0, sy = 0, xPrev = 0, tPrev = 0, xLast = 0, yLast = 0, tLast = 0;

  const W = () => page.w * dpr;
  const H = () => page.h * dpr;

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
    for (const name of ['uPage', 'uOrigin', 'uCanvas', 'uL', 'uDir', 'uR', 'uCurl', 'uDepth', 'uFront', 'uBack', 'uMode', 'uCorner', 'uAlpha', 'uPageF', 'uCurlF', 'uRF']) loc[name] = gl.getUniformLocation(prog, name);
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
    b2.fillStyle = '#F1E7D2';
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
    pool.push({ canvas: c, ctx: c.getContext('2d'), tex: null, index: -1, version: -1, hotspots: [], label: '' });
  }

  function layout() {
    layoutRaf = 0;
    const rect = stage.getBoundingClientRect();
    const book = wrap.getBoundingClientRect();
    const rigRect = rig.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = Math.round(rect.width * dpr);
    ch = Math.round(rect.height * dpr);
    canvas.width = cw;
    canvas.height = ch;
    page.x = book.left - rigRect.left;
    page.y = book.top - rigRect.top;
    page.w = book.width;
    page.h = book.height;
    Object.assign(hot.style, { left: `${page.x}px`, top: `${page.y}px`, width: `${page.w}px`, height: `${page.h}px` });
    for (const entry of pool) {
      entry.canvas.width = Math.round(W());
      entry.canvas.height = Math.round(H());
      entry.index = -1;
    }
    version++;
    if (anim) finishNow();
    draw();
    rest();
  }

  function victim() {
    let best = null, distance = -1;
    for (const entry of pool) {
      if (entry.index === index || (turning && entry.index === target)) continue;
      const d = entry.index < 0 ? 1e9 : Math.abs(entry.index - index);
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
    const result = paint(i, e.ctx, e.canvas.width, e.canvas.height);
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
    return { lx: (P0.x + F.x) / 2, ly: (P0.y + F.y) / 2, ux: Math.cos(angle), uy: Math.sin(angle), r: w * (.1 - .04 * progress), progress };
  }

  function drawSheet(e, mode, c, a) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, e.tex);
    gl.uniform1i(loc.uFront, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, backTex);
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
    gl.uniform2f(loc.uOrigin, page.x * dpr, page.y * dpr);
    gl.uniform2f(loc.uCanvas, cw, ch);
    gl.uniform1f(loc.uDepth, H() * 2.6);
    gl.uniform1f(loc.uCorner, 20 * dpr);
    if (turning && phase !== 'fade') {
      const c = curl();
      const under = entry(dir > 0 ? target : index);
      const front = entry(dir > 0 ? index : target);
      gl.disable(gl.DEPTH_TEST);
      drawSheet(under, 1, c, 1);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      drawSheet(front, 0, c, 1);
      gl.disable(gl.DEPTH_TEST);
    } else if (phase === 'fade') {
      drawSheet(entry(target), 0, null, 1);
      drawSheet(entry(index), 0, null, fade);
    } else {
      drawSheet(entry(index), 0, null, 1);
    }
  }
  function draw2d() {
    ctx2d.clearRect(0, 0, cw, ch);
    const x = page.x * dpr, y = page.y * dpr;
    // Coins arrondis comme en WebGL : petit côté reliure, grand côté tranche
    const big = 20 * dpr, small = 6 * dpr, w = W(), h = H();
    ctx2d.save();
    ctx2d.beginPath();
    ctx2d.moveTo(x + small, y);
    ctx2d.arcTo(x + w, y, x + w, y + h, big);
    ctx2d.arcTo(x + w, y + h, x, y + h, big);
    ctx2d.arcTo(x, y + h, x, y, small);
    ctx2d.arcTo(x, y, x + w, y, small);
    ctx2d.clip();
    if (phase === 'fade') {
      ctx2d.drawImage(entry(target).canvas, x, y);
      ctx2d.globalAlpha = fade;
    }
    ctx2d.drawImage(entry(index).canvas, x, y);
    ctx2d.restore();
  }

  // Fin de tour, ou état de repos après un changement : couche interactive et voisines
  function rest() {
    if (turning || phase !== 'idle') return;
    const e = entry(index);
    hot.classList.remove('is-turning');
    if (onRest) onRest(index, e.hotspots, e.label);
    clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(() => {
      if (turning) return;
      if (index + 1 < count()) entry(index + 1);
      if (index > 0) entry(index - 1);
    }, 80);
  }

  function begin(d, tgt, y) {
    dir = d;
    target = tgt;
    turning = true;
    hot.classList.add('is-turning');
    const w = W(), h = H();
    P0.x = w;
    P0.y = Math.min(h * .92, Math.max(h * .08, y));
    Fend.x = 2 * (-(Math.PI * .06 + .035) * w) - P0.x;
    Fend.y = P0.y;
    const start = d > 0 ? P0 : Fend;
    F.x = F0.x = start.x;
    F.y = F0.y = start.y;
  }
  function end(commit) {
    turning = false;
    phase = 'idle';
    if (commit) index = target;
    draw();
    if (commit && onChange) onChange(index);
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
    const goal = commit === (dir > 0) ? Fend : P0;
    const distance = Math.abs(goal.x - F.x);
    const duration = Math.max(170, Math.min(620, (distance / (P0.x - Fend.x)) * 720)) * speed;
    animateTo(goal.x, goal.y, duration, commit ? easeOut : easeBack, 0, () => {
      end(commit);
      if (resolve) resolve(commit);
    });
  }

  function go(tgt, speed = 1) {
    if (anim) finishNow();
    if (phase !== 'idle' || tgt < 0 || tgt >= count() || tgt === index) return Promise.resolve(false);
    return new Promise(resolve => {
      if (reducedMotion() || !gl) {
        // Fondu
        target = tgt;
        phase = 'fade';
        turning = true;
        hot.classList.add('is-turning');
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
      const d = tgt > index ? 1 : -1;
      begin(d, tgt, H() * .62);
      phase = 'anim';
      const goal = d > 0 ? Fend : P0;
      animateTo(goal.x, goal.y, 560 * speed, easeOut, d > 0 ? H() * .07 : -H() * .04, () => {
        end(true);
        resolve(true);
      });
    });
  }

  function tap(event) {
    if (event.target.closest('button')) return;
    const rect = hot.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    if (x > .66) go(index + 1);
    else if (x < .34) go(index - 1);
  }

  on(hot, 'pointerdown', event => {
    if (event.button !== 0 || pointer !== null) return;
    if (anim) finishNow();
    if (phase !== 'idle') return;
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
        const tgt = index + d;
        suppressClick = true;
        if (tgt < 0 || tgt >= count()) { phase = 'blocked'; return; }
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
      settle(commit, 1, null);
    } else if (phase === 'swipe') {
      phase = 'idle';
      go(index + dir);
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
    if (event.key === 'ArrowRight') go(index + 1);
    else if (event.key === 'ArrowLeft') go(index - 1);
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
    get index() { return index; },
    // Change de page sans animation (pages rechargées, page courante retrouvée par son identifiant)
    jump(i) {
      if (anim) finishNow();
      if (phase !== 'idle' || i < 0 || i >= count()) return;
      index = i;
      version++;
      draw();
      rest();
    },
    // Le contenu a changé : repeindre et réafficher (pendant un tour, la fin s'en charge)
    refresh() {
      version++;
      if (!turning) { draw(); rest(); }
    },
    // Rectangle écran d'une zone de la page visible (pour les effets)
    rectOf(id) {
      const e = pool.find(p => p.index === index);
      const spot = e && e.hotspots.find(s => s.id === id);
      const rect = hot.getBoundingClientRect();
      if (!spot) return null;
      const k = rect.width / 100;
      return { left: rect.left + spot.x * k, top: rect.top + spot.y * k, width: spot.w * k, height: spot.h * k };
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
