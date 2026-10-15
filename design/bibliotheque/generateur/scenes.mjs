// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_scenes.mjs : ne pas modifier à la main.
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// personnages/troupe.js
var require_troupe = __commonJS({
  "personnages/troupe.js"(exports, module) {
    var OUT = "#3C2819";
    var W2 = 1.1;
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W2) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = W2) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W2) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT, w + W2 * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 };
    var lerp = /* @__PURE__ */ __name((a, b, k) => Array.isArray(a) ? a.map((v, i) => r22(v + (b[i] - v) * k)) : r22(a + (b - a) * k), "lerp");
    var hsl = /* @__PURE__ */ __name((hex2) => {
      const n = parseInt(hex2.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
      let h = 0, sat = 0;
      if (d) {
        sat = d / (1 - Math.abs(2 * l - 1));
        h = mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return [h, sat, l];
    }, "hsl");
    var hex = /* @__PURE__ */ __name(([h, s, l]) => {
      const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2;
      const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return "#" + [r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
    }, "hex");
    var ton = /* @__PURE__ */ __name((c, k) => {
      const [h, s, l] = hsl(c);
      return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]);
    }, "ton");
    var PRINCIPALES = ["skin", "hair", "top", "bas", "leg", "sleeve", "shoe", "coat", "base", "hand", "buzz"];
    function lumiere(c, id, k = 1) {
      const couleurs = /* @__PURE__ */ new Set();
      for (const k2 of PRINCIPALES) if (typeof c[k2] === "string" && /^#[0-9A-Fa-f]{6}$/.test(c[k2])) couleurs.add(c[k2].toUpperCase());
      for (const k2 of c.teintes || []) couleurs.add(k2.toUpperCase());
      for (const cols of Object.values(c.acc || {})) for (const k2 of cols) if (/^#[0-9A-Fa-f]{6}$/.test(k2)) couleurs.add(k2.toUpperCase());
      couleurs.delete("#FFFFFF");
      couleurs.delete(OUT);
      const habits = new Set(["top", "bas", "leg", "sleeve", "coat", "base"].map((k2) => typeof c[k2] === "string" ? c[k2].toUpperCase() : null));
      let defs = "";
      const table = /* @__PURE__ */ new Map();
      let i = 0;
      for (const h of couleurs) {
        const g = `${id}G${i++}`;
        const l = hsl(h)[2];
        const clair = ton(h, l > 0.85 ? 1.12 : 1.28), sombre = ton(h, l < 0.25 ? 0.68 : 0.74);
        const deg = c.degrades && c.degrades[h];
        if (deg) {
          const [h2, y0, y1] = deg;
          defs += `<linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="0" y1="${r22(y0 * k)}" x2="0" y2="${r22(y1 * k)}"><stop offset="0" stop-color="${clair}"/><stop offset="0.22" stop-color="${h}"/><stop offset="0.78" stop-color="${h2}"/><stop offset="1" stop-color="${ton(h2, 0.78)}"/></linearGradient>`;
          table.set(h, { fill: `${g}t`, stroke: `${g}t` });
          continue;
        }
        const stops = `<stop offset="0" stop-color="${clair}"/><stop offset="0.45" stop-color="${h}"/><stop offset="1" stop-color="${sombre}"/>`;
        defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0.75" y2="1">${stops}</linearGradient><linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="${r22((habits.has(h) ? 6 : 4) * k)}" y1="${r22((habits.has(h) ? 28 : 2) * k)}" x2="${r22(42 * k)}" y2="${r22(60 * k)}">${stops}</linearGradient>`;
        table.set(h, habits.has(h) ? { fill: `${g}t`, stroke: `${g}t` } : { fill: g, stroke: `${g}t` });
      }
      return { defs: defs ? `<defs>${defs}</defs>` : "", table };
    }
    __name(lumiere, "lumiere");
    var peindre = /* @__PURE__ */ __name((s, table) => table.size ? s.replace(/(fill|stroke)="(#[0-9A-Fa-f]{6})"/g, (m, a, h) => {
      const g = table.get(h.toUpperCase());
      return g ? `${a}="url(#${g[a]})"` : m;
    }) : s, "peindre");
    var EYE_DARK = "#2A2420";
    var WHITE = "#FFFFFF";
    function eyes(list, mode, ry = 2.35, EYE = EYE_DARK) {
      const cx = list.reduce((a, e) => a + e[0], 0) / list.length;
      let s = "";
      list.forEach(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1;
        if (mode === "blink") s += P(`M${r22(x - 1.7)},${r22(y + 0.4)} Q${x},${r22(y + 1.8)} ${r22(x + 1.7)},${r22(y + 0.4)}`, "none", 1);
        else if (mode === "joy") s += P(`M${r22(x - 1.8)},${r22(y + 1)} Q${x},${r22(y - 1.2)} ${r22(x + 1.8)},${r22(y + 1)}`, "none", 1.1);
        else if (mode === "wink" && i === 1) s += P(`M${r22(x - 1.6)},${r22(y + 0.2)} L${r22(x + 1.6)},${r22(y + 0.2)}`, "none", 1);
        else if (mode === "big") s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P(`M${r22(x - k * 1.3)},${r22(y - 1.4)} L${r22(x + k * 1.1)},${y} L${r22(x - k * 1.3)},${r22(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r22(x - rx)},${r22(top)} Q${x},${r22(top - 0.9)} ${r22(x + rx)},${r22(top)} A${rx} ${r22(ry * 0.85)} 0 0 1 ${r22(x - rx)},${r22(top)} Z" fill="${EYE}"/>` + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P(`M${r22(x - rx - 0.5)},${r22(top + 0.3)} Q${x},${r22(top - 1.1)} ${r22(x + rx + 0.5)},${r22(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r22(top + (k > 0 ? tO : tI)), yr = r22(top + (k > 0 ? tI : tO));
          s += `<path d="M${r22(x - rx)},${yl} L${r22(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r22(x - rx)},${yl} Z" fill="${EYE}"/>` + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P(`M${r22(x - rx - 0.4)},${r22(yl - (yr - yl) * 0.12)} L${r22(x + rx + 0.4)},${r22(yr + (yr - yl) * 0.12)}`, "none", 1);
        } else s += E(x, y, rx, ry, EYE, 0) + E(x + 0.55, y - 1, 0.62, 0.62, WHITE, 0) + E(x - 0.5, y + 1, 0.3, 0.3, WHITE, 0);
      });
      return s;
    }
    __name(eyes, "eyes");
    function dechirure(a, q, b, seed = 1) {
      const r = /* @__PURE__ */ __name((i) => {
        const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
        return v - Math.floor(v);
      }, "r");
      const tongues = [[0.24 + r(1) * 0.08, 2.5 + r(2) * 0.6, 0.11], [0.66 + r(3) * 0.08, 1.7 + r(4) * 0.5, 0.085]];
      const notches = [[0.45 + r(5) * 0.06, 0.55, 0.035], [0.88 - r(6) * 0.04, 0.5, 0.03]];
      const N = 40, pts = [], tips = [];
      for (let i = 1; i <= N; i++) {
        const t = i / N, u = 1 - t;
        const x = u * u * a[0] + 2 * u * t * q[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * q[1] + t * t * b[1];
        let dy = (r(10 + i) - 0.5) * 0.3 * (i < N ? 1 : 0);
        for (const [c, len, w] of tongues) {
          const z = Math.abs(t - c) / w;
          if (z < 1) dy += len * (1 - z * z) ** 1.6;
        }
        for (const [c, dep, w] of notches) {
          const z = Math.abs(t - c) / w;
          if (z < 1) dy -= dep * (1 - z);
        }
        pts.push([x, y + dy]);
      }
      for (const [c] of tongues) {
        const p = pts[Math.round(c * N) - 1];
        tips.push(p);
      }
      return { d: pts.map(([x, y]) => `L${r22(x)},${r22(y)}`).join(" "), tips };
    }
    __name(dechirure, "dechirure");
    var filPendant = /* @__PURE__ */ __name((x, y, m = 1) => `<path d="M${r22(x)},${r22(y - 0.2)} q${r22(m * 0.45)},0.8 ${r22(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width=".45" stroke-linecap="round"/>`, "filPendant");
    var TRAITS = {
      homme: { browArch: 0.45, browLift: 0.35, browLen: 0.35, lashes: false },
      garcon: { browArch: 0.25, browLift: 0.15, browLen: 0.15, lashes: false },
      femme: { browArch: -0.2, browLift: -0.25, browLen: -0.15, lashes: true }
    };
    var EXPRS = ["neutre", "content", "rire", "surpris", "triste", "fache", "gene", "endormi"];
    var BROW = {
      neutre: [0, 0.1, -0.6],
      content: [-0.3, -0.2, -0.7],
      rire: [-0.6, -0.4, -0.8],
      surpris: [-1.4, -1.1, -1],
      triste: [-1.1, 0.6, 0],
      fache: [1.1, -0.6, 0],
      gene: [-0.7, 0.3, -0.2],
      endormi: [0.4, 0.4, -0.3],
      // soulagé (hors de la liste commune, pour une scène : 10_aster) : le bout intérieur des sourcils relevé (le
      // soulagement, FACS AU1), les yeux qui se ferment doucement, un petit sourire bouche fermée, les joues roses
      soulage: [-0.8, 0.2, -0.5]
    };
    var EYEMODE = { rire: "joy", endormi: "blink", surpris: "big", gene: "squeeze", triste: "sad", fache: "angry", soulage: "blink" };
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, fill, w) + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
    var zee = /* @__PURE__ */ __name((x, y, z) => {
      const d = `M${r22(x)},${r22(y)} L${r22(x + z)},${r22(y)} L${r22(x)},${r22(y + z)} L${r22(x + z)},${r22(y + z)}`;
      return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r22(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r22(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
    }, "zee");
    var visage = null;
    var visageVide = /* @__PURE__ */ __name(() => visage, "visageVide");
    function expression(g, ctx) {
      if (ctx.expr === "vide") {
        visage = g;
        return "";
      }
      const { expr } = ctx, n = ctx.n % 2;
      const [mx, my] = g.mouth;
      const w = g.mw;
      const cx = g.eyes.reduce((a, e) => a + e[0], 0) / g.eyes.length;
      let s = "";
      const [bi, bo, a0] = BROW[expr], arch = a0 + (g.browArch || 0);
      for (const [x, y, rx] of g.eyes) {
        const k = cx > x ? 1 : -1, hw = rx + 0.45 + (g.browLen || 0), by = y + g.browY + (g.browLift || 0);
        s += `<path d="M${r22(x - k * hw)},${r22(by + bo)} Q${r22(x)},${r22(by + (bi + bo) / 2 + arch)} ${r22(x + k * hw)},${r22(by + bi)}" fill="none" stroke="${g.brow}" stroke-width="${g.browW}" stroke-linecap="round"/>`;
      }
      const rest = expr === "neutre" && g.restEyes ? g.restEyes : "open";
      s += eyes(g.eyes, ctx.eyeMode || EYEMODE[expr] || (ctx.blink ? "blink" : rest), g.ry, g.eyeColor);
      const open = /* @__PURE__ */ __name((hw, depth) => {
        const d = `M${r22(mx - hw)},${r22(my - 0.2)} Q${r22(mx)},${r22(my + depth)} ${r22(mx + hw)},${r22(my - 0.2)} Z`;
        return P(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r22(mx - w)},${my} Q${mx},${r22(my + w * 0.94)} ${r22(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r22(mx - 1.4)},${r22(my + 1.1)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.4)},${r22(my + 1.1)}`);
      else if (expr === "fache") s += P(`M${r22(mx - 1.7)},${r22(my + 1.3)} Q${mx},${r22(my - 0.4)} ${r22(mx + 1.7)},${r22(my + 1.3)} Q${mx},${r22(my + 0.7)} ${r22(mx - 1.7)},${r22(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P(`M${r22(mx - 1.8)},${r22(my + 0.6)} Q${r22(mx - 1.2)},${r22(my - 0.1)} ${r22(mx - 0.6)},${r22(my + 0.6)} Q${mx},${r22(my + 1.3)} ${r22(mx + 0.6)},${r22(my + 0.6)} Q${r22(mx + 1.2)},${r22(my - 0.1)} ${r22(mx + 1.8)},${r22(my + 0.6)}`, "none", 0.8);
      else if (expr === "endormi") s += E(mx, my + 0.7, 0.6, 0.75, g.mouthC, 0.8);
      else if (expr === "soulage") {
        s += line(`M${r22(mx - w * 0.72)},${r22(my + 0.1)} Q${mx},${r22(my + w * 0.62)} ${r22(mx + w * 0.72)},${r22(my + 0.1)}`);
        for (const [x, rx] of g.cheeks) s += E(x, g.cheekY, rx * 1.2, 1.2, "#F08A8A", 0).replace("/>", ' opacity=".45"/>');
      }
      if (expr === "gene") {
        for (const [x, rx] of g.cheeks) for (const d of [-0.5, 0, 0.5]) s += L([x + d * rx * 1.2 - 0.35, g.cheekY + 0.55], [x + d * rx * 1.2 + 0.35, g.cheekY - 0.55], "#D9605A", 0.45);
        s += drop(g.temple[0], g.temple[1] + n * 0.9, 2, "#A9DCFF");
      }
      if (expr === "triste") {
        const [x, y, rx] = g.eyes[0];
        s += drop(x - (cx > x ? 1 : -1) * (rx - 0.2), y + g.ry + 1.2 + n * 1.2, 1.05, "#A9DCFF", 0.55);
      }
      if (expr === "fache") {
        const [x, y] = g.anger, a = n ? 0.6 : 0.5, b = n ? 2 : 1.7;
        const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r22(x + i * a)},${r22(y + j * b)} Q${r22(x + i * a)},${r22(y + j * a)} ${r22(x + i * b)},${r22(y + j * a)}`).join(" ");
        s += `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
      }
      if (expr === "endormi") {
        const [x, y] = g.zz;
        s += n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
      }
      return s;
    }
    __name(expression, "expression");
    function shoe(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 3)},${r22(y)} L${r22(x + 3)},${r22(y)} L${r22(x + 3.3)},${r22(y + 3.6)} Q${r22(x - 0.4)},${r22(y + 5.4)} ${r22(x - 3.3 - toe)},${r22(y + 3.8)} Z`;
      const sole = `M${r22(x - 3.4 - toe)},${r22(y + 3.3)} Q${r22(x - 0.4)},${r22(y + 5)} ${r22(x + 3.4)},${r22(y + 3.1)} L${r22(x + 3.4)},${r22(y + 5.6)} L${r22(x - 3.4 - toe)},${r22(y + 5.6)} Z`;
      const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 2.3)},${r22(y)} L${r22(x + 2.3)},${r22(y)} Q${r22(x + 2.9)},${r22(y + 3.4)} ${r22(x + 1.4)},${r22(y + 4.3)} L${r22(x - 1.4 - toe)},${r22(y + 4.3)} Q${r22(x - 3.1 - toe)},${r22(y + 3.8)} ${r22(x - 2.3)},${r22(y)} Z`;
      let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      const top = c.hip;
      return `<rect x="${r22(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r22(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r22(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r22(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function enfoncer(pts) {
      const [a, n] = pts, len = Math.hypot(n[0] - a[0], n[1] - a[1]) || 1;
      return [[r22(a[0] + (n[0] - a[0]) / len * 1.1), r22(a[1] + (n[1] - a[1]) / len * 1.1)], ...pts.slice(1)];
    }
    __name(enfoncer, "enfoncer");
    function arm(c, a, b, elbow, main, partie = "tout") {
      const pts = enfoncer(elbow ? [a, elbow, b] : [a, b]);
      if (c.sleeves || c.bandage) return armOf(c, pts, main, partie);
      const d = "M" + pts.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = "";
      if (partie !== "devant") {
        s += line(OUT, c.armW + W2 * 2) + line(c.sleeve, c.armW);
        if (c.cuff) {
          const f = pts[pts.length - 2];
          const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
          const at = /* @__PURE__ */ __name((k) => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len], "at");
          s += limb(at(2.5), at(0.9), c.armW, c.cuff);
        }
      }
      if (partie === "derriere") return s;
      return s + (main != null ? main : poing(c, b));
    }
    __name(arm, "arm");
    var poing = /* @__PURE__ */ __name((c, b) => E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ""), "poing");
    function armOf(c, pts, main, partie = "tout") {
      const b = pts[pts.length - 1], f = pts[pts.length - 2];
      const len = Math.hypot(b[0] - f[0], b[1] - f[1]) || 1;
      const ux = (b[0] - f[0]) / len, uy = (b[1] - f[1]) / len, nx = -uy, ny = ux;
      const at = /* @__PURE__ */ __name((k) => [b[0] - ux * k, b[1] - uy * k], "at");
      const path = /* @__PURE__ */ __name((list) => "M" + list.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L"), "path");
      const stroke = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
      const fw = c.armW * 0.8;
      let s = "";
      let cut = null;
      const derriere = partie !== "devant", devant = partie !== "derriere";
      if (c.sleeves) {
        const k = c.sleeves === "court" ? len * 0.77 : Math.min(c.sleeveCut || 5, len * 0.62);
        cut = at(k);
        const d = path([...pts.slice(0, -1), cut]);
        if (derriere) s += stroke(d, OUT, c.armW + W2 * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
        const fd = path([cut, b]);
        s += stroke(fd, OUT, fw + W2 * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P2 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
        const ombre = /* @__PURE__ */ __name((rr, dk) => `<path d="M${pt(P2(rr * 0.7, dk + rr * 0.55))} Q${pt(P2(0, dk + rr * 1.25))} ${pt(P2(-rr * 0.7, dk + rr * 0.55))}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="0.6" stroke-linecap="round"/>`, "ombre");
        if (c.sleeves === "court") {
          const e = path([at(k + 1.6), at(k - 0.4)]);
          s += stroke(e, OUT, c.armW + W2 * 2) + stroke(e, c.sleeve, c.armW) + ombre(c.armW / 2 + 1.1, -0.4);
        } else if (c.sleeves === "torn") {
          const zig = [P2(h, -0.5), P2(h * 0.45, 1.5), P2(0, 0.4), P2(-h * 0.5, 1.6), P2(-h, -0.5)];
          s += `<path d="${path([P2(h, -1.8), ...zig, P2(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT, 0.85);
        } else {
          const r = h + 0.4, arc = `M${pt(P2(r, -0.4))} Q${pt(P2(0, r * 0.95))} ${pt(P2(-r, -0.4))}`;
          s += `<path d="${arc}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${c.cuff || c.sleeve}" stroke-width="1.5" stroke-linecap="round"/><path d="M${pt(P2(r * 0.55, -0.2))} Q${pt(P2(0, r * 0.45))} ${pt(P2(-r * 0.55, -0.2))}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="0.45" stroke-linecap="round"/>`;
        }
      } else {
        const d = path(pts);
        if (derriere) s += stroke(d, OUT, c.armW + W2 * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
      }
      if (c.bandage) {
        const screenLeft = pts[0][0] < 24;
        const charLeft = c.view === "ne" ? screenLeft : !screenLeft;
        if (c.bandage === "left" === charLeft) {
          const w = (cut ? fw : c.armW) + 0.7;
          s += limb(at(2.2), at(4.4), w, "#F4EEDF");
          for (const k of [2.9, 3.7]) {
            const p = at(k);
            s += L([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT, 1.5) + L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
        }
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(armOf, "armOf");
    function frame(c, view, pose, n, expr) {
      const id = `${c.uid}${view}${pose}${n}`;
      const cc = { ...c, uid: id, view };
      const walk = pose === "marche";
      const ph = walk ? r22(Math.cos(n % IMAGES.marche / IMAGES.marche * Math.PI * 2)) : 0;
      const bob = walk ? r22(-(1 - Math.abs(ph))) : 0;
      const breath = pose === "repos" ? [0, -0.35, -0.7, -0.35][n % 4] : 0;
      const k = pose === "salut" ? [0, 0.5, 1, 0.5][n % 4] : n % 2;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const sway = r22(ph * 0.5);
      const ctx = { view, pose, n, ph, k, sway, breath, id, walk };
      const [lx, rx] = c.legX[view];
      const tq = view !== "front", pas = tq ? 1.7 : 0.9, lever = tq ? 1.8 : 1.4;
      const ly = c.ground + (walk ? ph > 0 ? ph : ph * lever : 0);
      const ry = c.ground + (walk ? ph < 0 ? -ph : -ph * lever : 0);
      const side = view === "se" ? -1 : 1;
      const lxx = r22(lx + (walk ? side * ph * pas : 0));
      const rxx = r22(rx - (walk ? side * ph * pas * 0.7 : 0));
      const tiltL = walk && ph < 0 && tq ? r22((view === "se" ? 18 : -18) * -ph) : 0;
      const tiltR = walk && ph > 0 && tq ? r22((view === "se" ? 18 : -18) * ph) : 0;
      const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
      const swing = -ph;
      const [shL, shR] = c.shoulders;
      const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4;
      const handL = [r22(c.hands[0][0] + swing * bal), r22(c.hands[0][1] + swing * balY)];
      const handR = [r22(c.hands[1][0] - swing * bal), r22(c.hands[1][1] - swing * balY)];
      const act = pose === "action" || pose === "salut" ? c.pose.call(cc, ctx) : null;
      const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
      const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : "";
      const heldBehind = view === "ne" && !c.holdOver && c.hold && c.hold.derriereDeDos ? held : "";
      const armRight = act && act.right != null ? act.right : (c.holdOver || heldBehind ? "" : held) + arm(cc, shR, handR);
      ctx.expr = expr || act && act.expr || (pose === "salut" ? "content" : "neutre");
      ctx.eyeMode = expr ? null : act && act.eyeMode;
      ctx.open = !expr && act && act.open;
      ctx.blink = pose === "repos" && n % 4 === 3;
      const menton = view === "ne" ? "" : E(view === "se" ? 22.6 : 24, 33.6 + (c.dy || 0), (shR[0] - shL[0]) * 0.24, 1.1, "rgba(0,0,0,.13)", 0);
      let s = "";
      s += c.backItems ? c.backItems(cc, ctx) : "";
      s += heldBehind;
      s += act && act.under ? act.under : "";
      let haut = c.body(cc, ctx) + menton;
      if (view !== "front") haut += armRight;
      haut += c.neck ? c.neck(cc, ctx) : "";
      if (view === "front") haut += armLeft + armRight;
      else haut += armLeft;
      haut += c.overArms ? c.overArms(cc, ctx) : "";
      haut += c.head(cc, ctx, act || {});
      haut += c.overHead ? c.overHead(cc, ctx) : "";
      haut += c.holdOver ? held : "";
      haut += act && act.over ? act.over : "";
      s += legs.join("") + (breath ? `<g transform="translate(0 ${breath})">${haut}</g>` : haut);
      const { defs, table } = lumiere(c, id);
      return defs + `<g transform="translate(0 ${bob})">${peindre(s, table)}</g>`;
    }
    __name(frame, "frame");
    var svg = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`, "svg");
    var POSES = [["face_repos", "front", "repos", IMAGES.repos], ["avant_marche", "se", "marche", IMAGES.marche], ["dos_marche", "ne", "marche", IMAGES.marche], ["face_salut", "front", "salut", IMAGES.salut]];
    module.exports = { OUT, W: W2, r2: r22, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, TRAITS, dechirure, filPendant, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/brume.js
var require_brume = __commonJS({
  "atelier/brume.js"(exports, module) {
    var { P, E, L, eyes, drop, zee, r2: r22 } = require_troupe2();
    var NAVY = "#1D3557";
    var STAGES = {
      s0: { label: "Stade 0 · pâle et tremblante", core: "#FFFFFF", flame: "#EEF5F7", edge: "#B8CDD6", line: "#6E8792", halo: "200,220,230", r: 8, tremble: true },
      s1: { label: "Stade 1 · bleu clair", core: "#FFFFFF", flame: "#BFF0FF", edge: "#5CC8F0", line: "#23647F", halo: "120,210,255" },
      s2: { label: "Stade 2 · turquoise", core: "#FFFFFF", flame: "#B4F5E6", edge: "#2EC4B6", line: "#16685F", halo: "90,220,200" },
      s3: { label: "Stade 3 · étoiles", core: "#FFFFFF", flame: "#E6F1FF", edge: "#93B6E6", line: "#40618F", halo: "190,210,255", orn: 3 },
      s4: { label: "Stade 4 · feuille", core: "#FFFFFF", flame: "#E2F6E8", edge: "#7FCB9A", line: "#2F7048", halo: "170,230,190", orn: 4 },
      s5: { label: "Stade 5 · cœur ambré", core: "#FFFDF2", flame: "#FFE7A3", edge: "#F2B23B", line: "#8A5A12", halo: "255,200,90", orn: 5 },
      s6: { label: "Stade 6 · runes", core: "#FFF8E8", flame: "#FFD98A", edge: "#E8992E", line: "#7E4A10", halo: "255,185,80", orn: 6 },
      s6pale: { label: "Stade 6 · pâlie", core: "#F4F4F4", flame: "#DCDDE0", edge: "#A6A8AE", line: "#5E6066", halo: "190,190,195", orn: 6, dim: true, r: 8.4 },
      s6phenix: { label: "Stade 6 · Phénix", core: "#FFFBEA", flame: "#FFCF6E", edge: "#F0622E", line: "#8A2410", halo: "255,150,70", orn: 6, wings: true },
      s7: { label: "Stade 7 · couronne dorée", core: "#FFFDF2", flame: "#FFE08A", edge: "#F2A33B", line: "#8A5212", halo: "255,205,110", orn: 7 },
      s7soleil: { label: "Stade 7 · soleil du phare", core: "#FFFFF4", flame: "#FFEB99", edge: "#FFB734", line: "#9A5A0A", halo: "255,215,120", orn: 7, sun: true },
      pret: { label: "Récompense prête (« ! »)", core: "#FFFDF2", flame: "#FFE7A3", edge: "#F2B23B", line: "#8A5A12", halo: "255,200,90", badge: true }
    };
    function flamePath(x, y, r, sway, k = 1) {
      const top = r * 2.05 * k;
      return `M${r22(x)},${r22(y + r)} C${r22(x + r * 1.3)},${r22(y + r)} ${r22(x + r * 1.15)},${r22(y - r * 0.45)} ${r22(x + sway)},${r22(y - top)} C${r22(x - r * 1.15)},${r22(y - r * 0.45)} ${r22(x - r * 1.3)},${r22(y + r)} ${r22(x)},${r22(y + r)} Z`;
    }
    __name(flamePath, "flamePath");
    var star4 = /* @__PURE__ */ __name((x, y, s, fill) => P(`M${r22(x)},${r22(y - s)} Q${r22(x + s * 0.22)},${r22(y - s * 0.22)} ${r22(x + s)},${r22(y)} Q${r22(x + s * 0.22)},${r22(y + s * 0.22)} ${r22(x)},${r22(y + s)} Q${r22(x - s * 0.22)},${r22(y + s * 0.22)} ${r22(x - s)},${r22(y)} Q${r22(x - s * 0.22)},${r22(y - s * 0.22)} ${r22(x)},${r22(y - s)} Z`, fill, 0.6), "star4");
    var RUNES = ["M-1,-1.6 L-1,1.6 M-1,-1.6 L1,-0.4 L-1,0.6 L1,1.6", "M0,-1.6 L0,1.6 M-1.2,-1.4 L0,-0.2 L1.2,-1.4", "M-1.2,1.6 L0,-1.6 L1.2,1.6 M-0.7,0.2 L0.7,0.2"];
    var rune = /* @__PURE__ */ __name((x, y, i, color) => `<path d="${RUNES[i % 3]}" transform="translate(${r22(x)} ${r22(y)})" fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>`, "rune");
    var leaf = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})${s === 1 ? "" : ` scale(${s})`}">${P("M0,-3.6 Q2.4,0 0,3.6 Q-2.4,0 0,-3.6 Z", "#4FB062", 0.7)}${L([0, -2.6], [0, 2.6], "#2F7A3F", 0.5)}</g>`, "leaf");
    var heart = /* @__PURE__ */ __name((x, y, s) => P(`M${r22(x)},${r22(y + s * 1.1)} C${r22(x - s * 1.8)},${r22(y - s * 0.1)} ${r22(x - s * 0.9)},${r22(y - s * 1.4)} ${r22(x)},${r22(y - s * 0.5)} C${r22(x + s * 0.9)},${r22(y - s * 1.4)} ${r22(x + s * 1.8)},${r22(y - s * 0.1)} ${r22(x)},${r22(y + s * 1.1)} Z`, "#F29A3B", 0.7), "heart");
    var crown = /* @__PURE__ */ __name((x, y, rot) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">` + P("M-4,1.4 L-4.4,-2.2 L-2,-0.4 L0,-3 L2,-0.4 L4.4,-2.2 L4,1.4 Z", "#F6C744", 0.8) + E(0, -3, 0.7, 0.7, "#E8584A", 0.5) + E(-4.4, -2.2, 0.5, 0.5, "#FFFFFF", 0.4) + E(4.4, -2.2, 0.5, 0.5, "#FFFFFF", 0.4) + "</g>", "crown");
    function faceOf(x, y, r, n, expr) {
      const ey = y - r * 0.05;
      const list = [[x - 3.2, ey, 1.35], [x + 3.2, ey, 1.35]];
      const mode = { neutre: n === 3 ? "blink" : "open", content: "open", rire: "joy", surpris: "big", triste: "sad", gene: "squeeze", endormi: "blink" }[expr];
      let face = eyes(list, mode, 1.9, NAVY).replace(/stroke="#3C2819"/g, `stroke="${NAVY}"`);
      if (["content", "rire", "gene"].includes(expr)) face = E(x - 5.4, ey + 2.6, 1.4, 0.8, "#F7A8B0", 0) + E(x + 5.4, ey + 2.6, 1.4, 0.8, "#F7A8B0", 0) + face;
      if (expr === "gene") face += drop(x + r + 2.6, y - r * 0.9 + n % 2 * 0.8, 1.4, "#A9DCFF");
      if (expr === "triste") face += drop(x - 4.2, ey + 3 + n % 2 * 1.2, 0.9, "#A9DCFF");
      if (expr === "endormi") face += n % 2 ? zee(x + 7, y - r * 2, 2) + zee(x + 10, y - r * 2.5, 2.6) : zee(x + 6.4, y - r * 1.8, 1.8) + zee(x + 9.2, y - r * 2.3, 2.4);
      return face;
    }
    __name(faceOf, "faceOf");
    function brumeFrame(stageKey, n, expr = "neutre", withFace = true) {
      const st = STAGES[stageKey];
      const r = st.r || 9;
      const ph = n % 4 / 4;
      const sway = Math.sin(ph * Math.PI * 2) * r * 0.32;
      const jit = st.tremble ? [[0, 0], [0.5, -0.2], [-0.4, 0.2], [0.3, 0.3]][n % 4] : [0, 0];
      const bob = [0, -0.6, -1, -0.6][n % 4];
      const x = 20 + jit[0], y = 32 + bob + jit[1];
      let back = "", front = "";
      const id = `bh${stageKey}${n}`;
      back += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${st.halo})" stop-opacity="${st.dim ? 0.25 : 0.55}"/><stop offset="1" stop-color="rgb(${st.halo})" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${r22(y - r * 0.5)}" r="${st.sun ? 20 : 17}" fill="url(#${id})"/>`;
      if (st.wings) {
        const flap = [0, -1.6, -2.4, -1.6][n % 4];
        for (const m of [-1, 1]) back += `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P(`M3,-2 Q12,${r22(-12 + flap)} 18,${r22(-8 + flap)} Q14,-6 16,${r22(-3 + flap * 0.4)} Q11,-3 13,1 Q8,-1 5,3 Z`, st.edge, 1) + P(`M4,-1.4 Q11,${r22(-9 + flap)} 15,${r22(-7 + flap)} Q11,-4 12,-1 Q8,-1.6 5,1.6 Z`, st.flame, 0) + "</g>";
        back += P(`M${r22(x - 2)},${r22(y + r - 1)} Q${r22(x - 4)},${r22(y + r + 4.6)} ${r22(x - 1)},${r22(y + r + 6.2)} Q${x},${r22(y + r + 3.2)} ${r22(x + 1)},${r22(y + r + 6.2)} Q${r22(x + 4)},${r22(y + r + 4.6)} ${r22(x + 2)},${r22(y + r - 1)} Z`, st.edge, 1);
      }
      if (st.sun) {
        const rot = n * 11.25, cx = x, cy0 = y - r * 0.55;
        for (let i = 0; i < 12; i++) {
          const a = (i * 30 + rot) * Math.PI / 180, r0 = r * 1.15, rr = r * (i % 2 ? 1.55 : 1.8);
          if (Math.sin(a) > 0.6) continue;
          back += P(`M${r22(cx + Math.cos(a - 0.14) * r0)},${r22(cy0 + Math.sin(a - 0.14) * r0)} L${r22(cx + Math.cos(a) * rr)},${r22(cy0 + Math.sin(a) * rr)} L${r22(cx + Math.cos(a + 0.14) * r0)},${r22(cy0 + Math.sin(a + 0.14) * r0)} Z`, i % 2 ? st.flame : st.edge, 0.8).replace(/stroke="[^"]+"/, `stroke="${st.line}"`);
        }
      }
      const orn = st.orn || 0;
      if (orn >= 3) {
        const count = orn >= 6 ? 6 : 3;
        for (let i = 0; i < count; i++) {
          const a = (ph + i / count) * Math.PI * 2;
          const ox = x + Math.cos(a) * 14, oy = y - 1.5 + Math.sin(a) * 5.5;
          const isRune = count === 6 && i % 2 === 1;
          let g = isRune ? `${E(ox, oy, 2.1, 2.1, `rgb(${st.halo})`, 0).replace("fill=", 'fill-opacity="0.35" fill=')}${rune(ox, oy, (i - 1) / 2, st.line)}` : star4(ox, oy, count === 6 ? 2.1 : 2.5, "#FFF6C8");
          if (st.dim) g = `<g opacity="0.45">${g}</g>`;
          if (Math.sin(a) < 0) back += g;
          else front += g;
        }
      }
      const outer = flamePath(x, y, r, sway);
      let body = P(outer, st.edge, 1.1).replace(/stroke="[^"]+"/, `stroke="${st.line}"`) + P(flamePath(x, y + r * 0.12, r * 0.8, sway * 0.8, 0.95), st.flame, 0) + P(flamePath(x, y + r * 0.38, r * 0.5, sway * 0.6, 0.85), st.core, 0);
      const cy = y - r * 0.95;
      let inner = "";
      if (orn >= 4) inner += orn >= 5 ? leaf(x + sway * 0.55, y - r * 1.5, [-18, 0, 18, 0][n % 4], 0.7) : leaf(x + sway * 0.3, cy, [-18, 0, 18, 0][n % 4]);
      if (orn >= 5) inner += heart(x + sway * 0.25, cy, 2.1 + n % 2 * 0.2);
      if (orn >= 7) inner += crown(x + sway * 0.9, y - r * 1.92, sway * 2);
      body += st.dim && inner ? `<g opacity="0.55">${inner}</g>` : inner;
      let sparks = "";
      for (let i = 0; i < 3; i++) {
        const p = (ph + i / 3) % 1;
        sparks += E(x + Math.sin((ph + i) * 4.2) * r * 0.9, y - r * (1.3 + p * 1.8), 0.9 - p * 0.5, 0.9 - p * 0.5, `rgb(${st.halo})`, 0).replace("fill=", `fill-opacity="${r22(0.95 - p * 0.7)}" fill=`);
      }
      const face = withFace ? faceOf(x, y, r, n, expr) : "";
      let badge = "";
      if (st.badge) {
        const bx = x + r * 1.15, by = y - r * 2 - n % 2 * 0.8;
        badge = E(bx, by, 3.2, 3.2, "#E8584A", 1).replace(/stroke="[^"]+"/, 'stroke="#7A2418"') + `<path d="M${r22(bx)},${r22(by - 1.8)} L${r22(bx)},${r22(by + 0.5)}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>` + E(bx, by + 1.6, 0.6, 0.6, "#FFFFFF", 0);
      }
      return back + body + front + sparks + face + badge;
    }
    __name(brumeFrame, "brumeFrame");
    function brumeEyes(n, expr = "neutre") {
      const bob = [0, -0.6, -1, -0.6][n % 4];
      return faceOf(20, 32 + bob, 9, n, expr);
    }
    __name(brumeEyes, "brumeEyes");
    var svgB = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${40 * scale}" height="${48 * scale}" viewBox="0 0 40 48">${body}</svg>`, "svgB");
    module.exports = { STAGES, brumeFrame, brumeEyes, svgB };
  }
});

// atelier/dormeurs.js
var require_dormeurs = __commonJS({
  "atelier/dormeurs.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, arm, zee, r2: r22 } = require_troupe2();
    function boulder(x, y, w, h, uid) {
      const d = `M${x},${r22(y + h)} Q${r22(x - w * 0.04)},${r22(y + h * 0.35)} ${r22(x + w * 0.3)},${r22(y + h * 0.08)} Q${r22(x + w * 0.55)},${r22(y - h * 0.06)} ${r22(x + w * 0.8)},${r22(y + h * 0.12)} Q${r22(x + w * 1.04)},${r22(y + h * 0.4)} ${r22(x + w)},${r22(y + h)} Z`;
      return P(d, "#B4AEA2") + clip(`${uid}rk`, d, `<rect x="${r22(x + w * 0.62)}" y="${y - 2}" width="${w}" height="${h + 4}" fill="#958F84"/><ellipse cx="${r22(x + w * 0.32)}" cy="${r22(y + h * 0.22)}" rx="${r22(w * 0.16)}" ry="${r22(h * 0.07)}" fill="#CDC8BE"/><path d="M${r22(x + w * 0.15)},${r22(y + h * 0.55)} q3,-1.4 6,0.4" fill="none" stroke="#958F84" stroke-width="0.6"/>` + E(x + w * 0.8, y + h * 0.3, 1.6, 1, "#9DAE7C", 0)) + P(d, "none");
    }
    __name(boulder, "boulder");
    function cleft(uid) {
      const gap = "M12.6,62 L13.6,30 L16.4,16 L19.8,6.4 L23.4,2.6 L26.6,7.6 L30.4,16.4 L34.6,30 L36,62 Z";
      const left = "M1.4,62 L2.4,38 Q3,28.6 6.4,22.6 L10.6,12.4 L15.4,3.4 Q17.8,1.6 19.4,4.6 L21.4,9.6 L17.4,18.6 L15.8,34 L17.4,62 Z";
      const right = "M31,62 L32.4,44 L31.4,30 L28.4,18.4 Q29.2,11.8 32.6,12.6 L37.4,17.6 Q43.4,23.4 44.8,33.4 L46.6,62 Z";
      const rock = /* @__PURE__ */ __name((d, id, shade) => P(d, "#ABA59A") + clip(id, d, shade + '<path d="M0,40 q4,-1.2 8,0.4 M34,50 q3.4,-1 7,0.4 M4,52 q3,-0.8 6,0.4" fill="none" stroke="#8E897F" stroke-width="0.6"/>' + E(9, 29, 2.2, 1.1, "#9DAE7C", 0)) + P(d, "none"), "rock");
      return P(gap, "#46423C") + clip(`${uid}gp`, gap, '<path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="5" stroke-linecap="round" opacity="0.18"/><path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="0.8" stroke-linecap="round" opacity="0.75"/>') + P(gap, "none") + rock(left, `${uid}cl`, '<rect x="13" y="0" width="12" height="64" fill="#8E897F"/><path d="M6.4,26 L12.6,12 L14.4,13 L8.4,27 Z" fill="#C2BDB2"/>') + rock(right, `${uid}cr`, '<rect x="38" y="10" width="12" height="54" fill="#8E897F"/><path d="M29.6,16 L33,13.8 L34.6,15.4 L31.2,17.6 Z" fill="#C2BDB2"/>');
    }
    __name(cleft, "cleft");
    function crate(x, y, w, h, uid) {
      const d = `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
      return P(d, "#B8875A") + clip(`${uid}cr`, d, `<rect x="${r22(x + w * 0.68)}" y="${y}" width="${w}" height="${h}" fill="#94683F"/>` + [0.33, 0.66].map((k) => `<line x1="${x}" y1="${r22(y + h * k)}" x2="${x + w}" y2="${r22(y + h * k)}" stroke="${OUT}" stroke-width="0.6"/>`).join("") + `<rect x="${x}" y="${y}" width="${w}" height="1.6" fill="#D2A578"/>`) + P(d, "none") + L([x + 1.4, y + 1.4], [x + w - 1.4, y + h - 1.4], OUT, 0.7) + E(x + 2.2, y + h * 0.5, 0.4, 0.4, "#5E5650", 0) + E(x + w - 2.2, y + h * 0.5, 0.4, 0.4, "#5E5650", 0);
    }
    __name(crate, "crate");
    function jar(x, y, rot = 0) {
      const d = `M${r22(x - 1.6)},${r22(y - 1.6)} L${r22(x + 1.6)},${r22(y - 1.6)} Q${r22(x + 2.1)},${r22(y - 1.2)} ${r22(x + 2)},${y} L${r22(x + 1.9)},${r22(y + 1.9)} Q${x},${r22(y + 2.6)} ${r22(x - 1.9)},${r22(y + 1.9)} L${r22(x - 2)},${y} Q${r22(x - 2.1)},${r22(y - 1.2)} ${r22(x - 1.6)},${r22(y - 1.6)} Z`;
      return `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="#D6ECF2" fill-opacity="0.75" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(x - 1.1)},${r22(y - 0.6)} L${r22(x - 1.1)},${r22(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r22(x - 1.3)}" y="${r22(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.7"/></g>`;
    }
    __name(jar, "jar");
    function rod(a, b) {
      const j = [a[0] + (b[0] - a[0]) * 0.72, a[1] + (b[1] - a[1]) * 0.72];
      return limb(a, j, 1.2, "#A8743F") + limb(j, b, 1.1, "#A8743F") + limb(j, [b[0] + 2.6, b[1] + 1.2], 1.1, "#A8743F") + `<g transform="rotate(-30 ${r22(b[0] + 2.6)} ${r22(b[1] + 1.2)})">${E(b[0] + 3.6, b[1] + 1.2, 1.3, 0.65, "#7BB661", 0.6)}</g>`;
    }
    __name(rod, "rod");
    function mallet(a, b) {
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90;
      return limb(a, b, 1.2, "#A8743F") + `<g transform="rotate(${r22(ang)} ${r22(b[0])} ${r22(b[1])})"><rect x="${r22(b[0] - 2.4)}" y="${r22(b[1] - 0.6)}" width="4.8" height="2.8" rx="0.9" fill="#A8743F" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(b[0] + 0.9)}" y="${r22(b[1] - 0.2)}" width="1.1" height="2" rx="0.4" fill="#7E5530"/></g>`;
    }
    __name(mallet, "mallet");
    function spyglass(x, y, rot) {
      return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-1.5" y="-4.5" width="3" height="9" rx="0.8" fill="#C9A24A" stroke="${OUT}" stroke-width="0.9"/><rect x="-1.1" y="-3.9" width="0.8" height="7.8" rx="0.4" fill="#F0D58A"/><rect x="-1.95" y="-4.9" width="3.9" height="2.1" rx="0.6" fill="#8E6E2C" stroke="${OUT}" stroke-width="0.8"/></g>`;
    }
    __name(spyglass, "spyglass");
    var tin = /* @__PURE__ */ __name((x, y) => `<rect x="${r22(x - 4)}" y="${r22(y - 2)}" width="8" height="4" rx="0.8" fill="#B8C0C8" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x - 3.2)}" y="${r22(y - 1.4)}" width="6.4" height="1.6" rx="0.5" fill="#6E7680"/>` + [[-2.2, -0.9], [-0.6, -1], [1, -0.8], [2.4, -1]].map(([dx, dy]) => E(x + dx, y + dy, 0.55, 0.45, "#D9C27A", 0.4)).join(""), "tin");
    var screw = /* @__PURE__ */ __name((x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">${L([x, y], [x + 2.2, y], OUT, 1.3)}${L([x, y], [x + 2.2, y], "#B8C0C8", 0.6)}${E(x, y, 0.75, 0.75, "#D9C27A", 0.5)}</g>`, "screw");
    var snore = /* @__PURE__ */ __name((x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#CFEFFF" fill-opacity="0.7" stroke="${OUT}" stroke-width="0.6"/><path d="M${r22(x - r * 0.5)},${r22(y - r * 0.2)} Q${r22(x - r * 0.4)},${r22(y - r * 0.6)} ${r22(x)},${r22(y - r * 0.65)}" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round"/>`, "snore");
    function soles(c, xs, y, stub = true) {
      let s = "";
      for (const [i, x] of xs.entries()) {
        const bare = !!c.foot && (!c.bareSide || c.bareSide === "right" === (i === 0));
        if (stub && c.leg !== c.skin) s += `<rect x="${r22(x - c.legW / 2)}" y="${r22(y - 6)}" width="${c.legW}" height="4.6" rx="1.4" fill="${c.leg}" stroke="${OUT}" stroke-width="1.1"/>`;
        else if (stub) s += `<rect x="${r22(x - c.legW / 2 + 0.3)}" y="${r22(y - 5.4)}" width="${r22(c.legW - 0.6)}" height="4" rx="1.4" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/>`;
        if (bare) {
          s += E(x, y, 2.5, 3, c.skin) + E(x + 0.5, y + 1.3, 1.5, 1.1, c.skinS || c.skin, 0);
          for (const [dx, dy, r] of [[-1.6, -2.6, 0.62], [-0.5, -3, 0.66], [0.6, -3, 0.62], [1.6, -2.6, 0.55]]) s += E(x + dx, y + dy, r, r, c.skin, 0.55);
        } else {
          s += E(x, y, 2.6, 3.1, c.shoeS) + E(x, y - 0.9, 1.7, 1.4, c.shoe, 0) + L([x - 1.6, y + 1.3], [x + 1.6, y + 1.3], c.shoe, 0.6);
        }
      }
      return s;
    }
    __name(soles, "soles");
    function seated(c, n, o) {
      const id = `${c.uid}dort${n}`;
      const cc = { ...c, uid: id };
      const ctx = { view: "front", pose: "repos", n, ph: 0, id, walk: false, expr: o.expr || "endormi", eyeMode: null, open: false, blink: false };
      const dy = o.dy;
      const sh = c.shoulders.map(([x, y]) => [x, y + dy]);
      let s = o.back ? o.back(cc, sh) : "";
      s += `<g transform="translate(0 ${dy})">${c.backItems && !o.noBackItems ? c.backItems(cc, ctx) : ""}${c.body(cc, ctx)}${c.neck ? c.neck(cc, ctx) : ""}</g>`;
      s += o.legs ? o.legs(cc) : soles(cc, o.feet, o.footY);
      s += o.lap ? o.lap(cc, sh) : "";
      s += o.arms(cc, sh);
      s += c.overArms ? `<g transform="translate(0 ${dy})">${c.overArms(cc, ctx)}</g>` : "";
      const head = c.head(cc, ctx, {}) + (c.overHead ? c.overHead(cc, ctx) : "") + (o.face ? o.face(cc, n) : "");
      s += `<g transform="translate(${o.hx || 0} ${r22(dy + (o.hy || 0))}) rotate(${o.tilt} 24 ${o.pivot || 31})">${head}</g>`;
      s += o.front ? o.front(cc, sh) : "";
      return s;
    }
    __name(seated, "seated");
    var POSES = {
      Ondin: {
        dy: 5.6,
        tilt: 13,
        hy: 0.6,
        feet: [19.4, 28.6],
        footY: 59.4,
        back: /* @__PURE__ */ __name((cc) => boulder(9, 24, 37, 38, cc.uid) + rod([39.6, 61], [43.2, 40.6]), "back"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [21.4, 53.8], [13.2, 50.6]) + arm(cc, r, [26.6, 53.8], [35, 50.6]), "arms"),
        face: /* @__PURE__ */ __name((cc, n) => snore(27.6, 27.6 + 4.4, n ? 2.3 : 1.1), "face"),
        front: /* @__PURE__ */ __name(() => jar(8.6, 60.2, 78), "front")
      },
      Galet: {
        dy: 6.4,
        tilt: -6,
        hy: 1.4,
        feet: [20.4, 27.6],
        footY: 59.6,
        back: /* @__PURE__ */ __name((cc) => cleft(cc.uid), "back"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [21.6, 54.4], [13.4, 51.6]) + mallet([36.6, 56.6], [39.8, 61]) + arm(cc, r, [36.6, 56.4], [36.4, 50.4]), "arms"),
        front: /* @__PURE__ */ __name(() => "", "front")
      },
      Aster: {
        dy: 9,
        tilt: -11,
        hy: 0.4,
        feet: [19.6, 28.4],
        footY: 59.6,
        back: /* @__PURE__ */ __name((cc) => crate(7, 30, 34, 24, cc.uid), "back"),
        lap: /* @__PURE__ */ __name(() => spyglass(24, 53.4, 78), "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [20.2, 53.6], [13.4, 50.4]) + arm(cc, r, [27.8, 53.6], [34.6, 50.4]), "arms")
      },
      Cannelle: {
        dy: 5.2,
        tilt: 10,
        hy: 0.4,
        feet: [19.6, 28.4],
        footY: 60,
        noBackItems: true,
        lap: /* @__PURE__ */ __name((cc) => limb([15.6, 55.6], [32.6, 43.6], 1.5, "#C27C45") + `<g transform="rotate(-30 33.6 42.4)">${E(33.6, 42.4, 3.3, 2.6, "#C27C45")}${E(33.6, 41.9, 2.3, 1.4, "#8F5530", 0)}${E(32.4, 43.3, 0.8, 0.45, "#EAA46C", 0)}</g>`, "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [26.4, 50.6], [12.6, 49.4]) + arm(cc, r, [30.4, 46.2], [36.4, 50.4]), "arms")
      },
      Rivet: {
        dy: 8.6,
        tilt: -14,
        hy: 1.2,
        feet: [19.6, 28.4],
        footY: 59.6,
        lap: /* @__PURE__ */ __name(() => tin(24, 54.2), "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [19.8, 54.4], [13.4, 50.6]) + arm(cc, r, [28.2, 54.4], [34.6, 50.6]), "arms"),
        front: /* @__PURE__ */ __name(() => screw(8.6, 60.4, -20) + screw(37.6, 61.2, 30) + screw(41.4, 59.2, 70), "front")
      },
      Mélisse: {
        dy: 6.2,
        tilt: 6,
        hy: 8.4,
        pivot: 34,
        feet: [19.6, 28.4],
        footY: 60.4,
        lap: /* @__PURE__ */ __name(() => "", "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => {
          const box = `<rect x="16.4" y="46.4" width="15.2" height="8.4" rx="1" fill="#6E7480" stroke="${OUT}" stroke-width="1"/><rect x="27.2" y="47" width="3.6" height="7.4" fill="#545A65"/><rect x="15.8" y="44.8" width="16.4" height="2.6" rx="0.6" fill="#9AA2AD" stroke="${OUT}" stroke-width="0.9"/>` + [[17.6, 48.6], [30.4, 48.6], [17.6, 53], [30.4, 53]].map(([x, y]) => E(x, y, 0.45, 0.45, "#9AA2AD", 0)).join("") + `<rect x="23" y="47.6" width="2" height="2" rx="0.4" fill="#F2C94C" stroke="${OUT}" stroke-width="0.6"/>`;
          return box + arm(cc, l, [28.4, 45.2], [12.8, 46]) + arm(cc, r, [19.6, 45.4], [35.2, 46.2]);
        }, "arms")
      }
    };
    function stripZ(str, [x, y], n) {
      const zz = n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
      return str.replace(zz, "");
    }
    __name(stripZ, "stripZ");
    function sylveCurled(c, n) {
      const id = `${c.uid}dort${n}`;
      const cc = { ...c, uid: id };
      const ctx = { view: "se", pose: "repos", n, ph: 0, id, walk: false, expr: "endormi", eyeMode: null, open: false, blink: false };
      const leaf = c.nauMound ? [c.nauMound.fill, c.nauMound.shade, c.nauMound.hi] : ["#5E9E4A", "#467A37", "#86C06A"];
      const mound = "M20,46 Q16.6,33.4 29,27.8 Q41,22.6 51.4,29.2 Q60,35 57.6,46 Q55.8,47.6 53.8,46.2 Q52.2,48 50.2,46.4 Q48.4,48 46.4,46.4 Q44.4,48 42.4,46.4 Q40.4,48 38.4,46.4 Q36.4,48 34.4,46.4 Q32.4,48 30.4,46.4 Q28.4,48 26.4,46.4 Q24.2,48 22.2,46.2 Q20.6,47.4 20,46 Z";
      const rows = [33, 38, 43].map((y) => `<path d="M14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y} Q40,${y + 2} 42,${y} Q44,${y + 2} 46,${y} Q48,${y + 2} 50,${y} Q52,${y + 2} 54,${y} Q56,${y + 2} 58,${y} Q60,${y + 2} 62,${y}" fill="none" stroke="${leaf[1]}" stroke-width="0.7"/>`).join("");
      let s = `<ellipse cx="38.6" cy="46.2" rx="20.6" ry="2.2" fill="#3C2819" opacity="0.12"/>`;
      s += P(mound, leaf[0]) + clip(`${id}m`, mound, `<rect x="41" y="20" width="24" height="30" fill="${leaf[1]}"/>${c.nauMound ? "" : rows}<ellipse cx="33" cy="30.8" rx="8" ry="2" fill="${leaf[2]}"/>`) + P(mound, "none");
      if (c.nauMound) {
        s += `<path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"/><path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="#E6DCC3" stroke-width="2" stroke-linecap="round"/>`;
        for (const [x, y, r] of [[30, 27.4, -60], [44.6, 26.6, 50], [50.4, 30.4, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${r})">${P("M0,0 Q1.4,1.9 0,3.8 Q-1.4,1.9 0,0 Z", c.nauMound.leaf, 0.7)}</g>`;
      }
      for (const [x, y, rot] of [[57.6, 42.6, -20], [59.8, 44.8, -8]]) {
        s += `<g transform="rotate(${rot} ${x} ${y})">${E(x, y, 1.9, 2.4, c.skin)}${E(x + 0.4, y + 1, 1.1, 0.9, c.skinS || c.skin, 0)}` + [[-1.2, -2, 0.5], [-0.3, -2.4, 0.52], [0.6, -2.3, 0.48], [1.3, -1.9, 0.42]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r, c.skin, 0.5)).join("") + "</g>";
      }
      const head = stripZ(c.head(cc, ctx, {}), [3.6, 11.4], n) + (c.overHead ? c.overHead(cc, ctx) : "");
      s += `<g transform="translate(1.8 12.6) rotate(-24 24 31) scale(0.92)">${head}</g>`;
      s += n ? zee(30.6, 9, 2) + zee(33.4, 5.2, 2.6) : zee(30, 10, 1.8) + zee(32.6, 6.6, 2.4);
      return `<g transform="translate(0 -1.2)">${s}</g>`;
    }
    __name(sylveCurled, "sylveCurled");
    function sleepFrame(c, n) {
      const key = c.name;
      if (key === "Sylve") return sylveCurled(c, n);
      return seated(c, n, POSES[key]);
    }
    __name(sleepFrame, "sleepFrame");
    var isCurled = /* @__PURE__ */ __name((c) => c.name === "Sylve", "isCurled");
    module.exports = { sleepFrame, isCurled, POSES, stripZ, boulder, cleft, crate, jar, rod, mallet, spyglass, tin, screw, snore, soles, seated };
  }
});

// atelier/naufrage.js
var require_naufrage = __commonJS({
  "atelier/naufrage.js"(exports, module) {
    var { OUT, P, E, L, clip, bareFoot, shoe, r2: r22 } = require_troupe2();
    function hsl(hex2) {
      const n = parseInt(hex2.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
      let h = 0, s = 0;
      if (d) {
        s = d / (1 - Math.abs(2 * l - 1));
        h = mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return [h, s, l];
    }
    __name(hsl, "hsl");
    function hex([h, s, l]) {
      const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2;
      const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(hex, "hex");
    var fade = /* @__PURE__ */ __name((c, k = 1) => {
      const [h, s, l] = hsl(c);
      return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]);
    }, "fade");
    var recolor = /* @__PURE__ */ __name((str, map) => str.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => map[m.toUpperCase()] || m), "recolor");
    var CANVAS = { cloth: "#E6DCC3", shade: "#C9BB98", seam: "#B3A27C", rope: "#B08850", ropeS: "#86663A" };
    var cord = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r22(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "cord");
    var pts = /* @__PURE__ */ __name((a) => a.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L"), "pts");
    function tatter(x, y, color, w = 2.2, s = 1, band = null) {
      const m = Math.round(x * 10) % 2 ? 1 : -1, X = /* @__PURE__ */ __name((t) => r22(x + m * t), "X");
      const bottom = `L${X(-w)},${r22(y - 0.1)} Q${X(-w * 0.74)},${r22(y + 1.9 * s)} ${X(-w * 0.22)},${r22(y + 3.1 * s)} Q${X(w * 0.06)},${r22(y + 3.7 * s)} ${X(w * 0.3)},${r22(y + 2.5 * s)} L${X(w * 0.52)},${r22(y + 1.2 * s)} Q${X(w * 0.76)},${r22(y + 1.9 * s)} ${X(w)},${r22(y + 0.3 * s)}`;
      const d = `M${X(-w)},${r22(y - 1)} ${bottom} L${X(w)},${r22(y - 1)} Z`;
      const id = `tt${Math.round(x * 10)}${Math.round(y * 10)}`;
      const raie = band ? `<clipPath id="${id}"><path d="${d}"/></clipPath><rect x="${r22(x - w - 1)}" y="${r22(y + 0.7 * s)}" width="${r22(2 * w + 2)}" height="${r22(0.95 * s)}" fill="${band}" clip-path="url(#${id})"/>` : "";
      const tip = [x + m * -w * 0.12, y + 3.4 * s];
      return `<path d="${d}" fill="${color}"/>` + raie + `<path d="M${X(-w * 0.62)},${r22(y + 1.5 * s)} Q${X(-w * 0.2)},${r22(y + 2.3 * s)} ${X(w * 0.24)},${r22(y + 1.9 * s)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round" opacity=".28"/><path d="M${bottom.slice(1)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/><path d="M${r22(tip[0])},${r22(tip[1])} q${r22(m * 0.45)},0.8 ${r22(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`;
    }
    __name(tatter, "tatter");
    function hole(x, y, r, color) {
      const a = Array.from({ length: 9 }, (_, i) => {
        const t = i / 9 * Math.PI * 2, k = [1, 0.86, 1, 0.9, 1, 0.84, 0.98, 0.9, 1][i];
        return [x + Math.cos(t) * r * k, y + Math.sin(t) * r * 0.72 * k];
      });
      return `<path d="M${pts(a)} Z" fill="${color}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/><path d="M${r22(x + r * 0.2)},${r22(y + r * 0.66)} q0.3,0.8 -0.2,1.5" fill="none" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round"/>`;
    }
    __name(hole, "hole");
    var rip = /* @__PURE__ */ __name((x, y, len = 2.6) => `<path d="M${r22(x - len / 2)},${r22(y)} L${r22(x - len / 6)},${r22(y + 0.7)} L${r22(x + len / 6)},${r22(y - 0.5)} L${r22(x + len / 2)},${r22(y + 0.3)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`, "rip");
    function weed(path, leaves = []) {
      return cord(path, 1.7, "#5C8A45") + `<path d="${path}" fill="none" stroke="#86B562" stroke-width="0.5" stroke-linecap="round" stroke-dasharray="1.2 1.6"/>` + leaves.map(([x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + P("M0,0 Q1.6,2 0,4.4 Q-1.6,2 0,0 Z", "#6E9E50", 0.7) + L([0, 0.6], [0, 3.6], "#4E7A3A", 0.4) + "</g>").join("");
    }
    __name(weed, "weed");
    var smudge = /* @__PURE__ */ __name((x, y, color = "#8A6A50") => `<ellipse cx="${r22(x)}" cy="${r22(y)}" rx="1.8" ry="0.85" fill="${color}" opacity="0.6" transform="rotate(-14 ${r22(x)} ${r22(y)})"/><ellipse cx="${r22(x + 1.7)}" cy="${r22(y + 0.7)}" rx="0.55" ry="0.4" fill="${color}" opacity="0.55"/>`, "smudge");
    function rolledFoot(cuff, cuffS) {
      return (c, x, y, dir, tilt) => {
        const w = c.legW;
        const shin = `<rect x="${r22(x - w / 2 + 0.3)}" y="${r22(y - 3.2)}" width="${r22(w - 0.6)}" height="4.2" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r22(x - w / 2 + 0.85)}" y="${r22(y - 2.6)}" width="${r22(w - 1.7)}" height="3.8" fill="${c.skin}"/>`;
        const band = `<rect x="${r22(x - w / 2 - 0.5)}" y="${r22(y - 4.6)}" width="${r22(w + 1)}" height="2" rx="0.8" fill="${cuff}" stroke="${OUT}" stroke-width="1"/>` + L([x - w / 2 + 0.2, y - 3.4], [x + w / 2 - 0.2, y - 3.4], cuffS, 0.5);
        return shin + bareFoot(c, x, y, dir, tilt) + band;
      };
    }
    __name(rolledFoot, "rolledFoot");
    function cape(sh, view, uid, cloth = CANVAS, extra = "") {
      const [[x0, y], [x1]] = sh;
      const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      const k = view === "se" ? -1.6 : 0;
      if (view === "ne") {
        const d = `M${r22(cx - hw + 1)},${r22(y - 3.4)} Q${cx},${r22(y - 1.4)} ${r22(cx + hw - 1)},${r22(y - 3.4)} Q${r22(cx + hw + 2.8)},${r22(y - 2.4)} ${r22(cx + hw + 3)},${r22(y + 2)} L${r22(cx + hw + 2.6)},${r22(y + 8)} L${r22(cx + hw + 0.4)},${r22(y + 6.8)} L${r22(cx + 5)},${r22(y + 9)} L${r22(cx + 2)},${r22(y + 7.4)} L${r22(cx - 1.6)},${r22(y + 9.2)} L${r22(cx - 4.6)},${r22(y + 7.2)} L${r22(cx - hw + 0.4)},${r22(y + 8.6)} L${r22(cx - hw - 2.6)},${r22(y + 7.6)} L${r22(cx - hw - 3)},${r22(y + 2)} Q${r22(cx - hw - 2.8)},${r22(y - 2.4)} ${r22(cx - hw + 1)},${r22(y - 3.4)} Z`;
        return P(d, cloth.cloth) + clip(`${uid}vo`, d, extra + `<rect x="${r22(cx + 3)}" y="${r22(y - 6)}" width="14" height="20" fill="${cloth.shade}" opacity="0.8"/><path d="M${r22(cx - hw - 4)},${r22(y + 3.4)} Q${cx},${r22(y + 5)} ${r22(cx + hw + 4)},${r22(y + 3.4)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, "none");
      }
      const far = view === "se" ? 0.75 : 1;
      const panel = /* @__PURE__ */ __name((m, f) => {
        const X = /* @__PURE__ */ __name((u) => r22(cx + k + m * u * f), "X");
        return `M${X(1.4)},${r22(y - 3.6)} Q${X(hw + 1.6)},${r22(y - 4)} ${X(hw + 2.8)},${r22(y + 1.2)} L${X(hw + 2.6)},${r22(y + 7)} L${X(hw + 1)},${r22(y + 5.9)} L${X(hw - 0.6)},${r22(y + 7.4)} L${X(hw - 2.2)},${r22(y + 5.8)} L${X(4.4)},${r22(y + 6.6)} Q${X(3.6)},${r22(y + 2.8)} ${X(0.7)},${r22(y + 0.6)} Z`;
      }, "panel");
      const L1 = panel(-1, 1), R1 = panel(1, far);
      const shadeR = `<rect x="${r22(cx + k + 2)}" y="${r22(y - 6)}" width="16" height="20" fill="${cloth.shade}" opacity="0.8"/>`;
      const seam = /* @__PURE__ */ __name((m) => `<path d="M${r22(cx + k + m * (hw + 2))},${r22(y + 1.6)} L${r22(cx + k + m * 4.4)},${r22(y + 3.8)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`, "seam");
      let s = P(L1, cloth.cloth) + clip(`${uid}vl`, L1, extra + seam(-1)) + P(L1, "none");
      s += P(R1, cloth.cloth) + clip(`${uid}vr`, R1, extra + shadeR + seam(far)) + P(R1, "none");
      const kx = cx + k;
      s += cord(`M${r22(kx - 1.6)},${r22(y + 0.4)} L${r22(kx - 2.4)},${r22(y + 4.4)}`, 0.8, cloth.rope) + cord(`M${r22(kx + 1.4)},${r22(y + 0.4)} L${r22(kx + 2)},${r22(y + 4)}`, 0.8, cloth.rope);
      s += E(kx, y + 0.2, 1.5, 1.15, cloth.rope, 0.8) + L([kx - 0.6, y - 0.2], [kx + 0.5, y + 0.6], cloth.ropeS, 0.4);
      return s;
    }
    __name(cape, "cape");
    function castaway(c, spec) {
      const map = {};
      for (const col of spec.fade || []) map[col.toUpperCase()] = fade(col, spec.k || 1);
      Object.assign(map, spec.map || {});
      const F = /* @__PURE__ */ __name((s) => s ? recolor(s, map) : s, "F");
      const mapO = { ...map };
      for (const col of spec.overKeep || []) delete mapO[col.toUpperCase()];
      const FO = /* @__PURE__ */ __name((s) => recolor(s, mapO), "FO");
      const legs = spec.leg === "skin" ? { leg: c.skin, legS: c.skinS || spec.skinS } : { leg: F(c.leg), legS: F(c.legS) };
      const rolled = spec.leg === "roll" ? rolledFoot(F(c.leg), F(c.legS)) : null;
      const bare = /* @__PURE__ */ __name((cc, x, y, dir, tilt) => rolled ? rolled(cc, x, y, dir, tilt) : bareFoot(cc, x, y, dir, tilt), "bare");
      const foot = spec.bareSide ? (cc, x, y, dir, tilt) => {
        const screenLeft = x < 24, charRight = cc.view === "ne" ? !screenLeft : screenLeft;
        return spec.bareSide === "right" === charRight ? bare(cc, x, y, dir, tilt) : shoe(cc, x, y, dir, tilt);
      } : bare;
      const out = {
        ...c,
        ...spec.flags || {},
        name: c.name,
        uid: c.uid + "n",
        skinS: c.skinS || spec.skinS,
        // la lumière (troupe.lumiere) cherche les couleurs principales : les délavées, comme dans le dessin
        ...Object.fromEntries(["top", "bas", "base", "coat", "hair", "buzz", "hand"].filter((k) => typeof c[k] === "string").map((k) => [k, map[c[k].toUpperCase()] || c[k]])),
        teintes: (c.teintes || []).map((x) => map[x.toUpperCase()] || x),
        sleeve: F(c.sleeve),
        cuff: c.cuff ? F(c.cuff) : c.cuff,
        sleeves: spec.sleeves,
        sleeveCut: spec.sleeveCut,
        bandage: spec.bandage,
        bareSide: spec.bareSide,
        shoe: c.shoe && F(c.shoe),
        shoeS: c.shoeS && F(c.shoeS),
        shoeH: c.shoeH && F(c.shoeH),
        ...legs,
        foot,
        backItems: /* @__PURE__ */ __name((cc, ctx) => (spec.backItems ? spec.backItems(cc, ctx) : F(c.backItems ? c.backItems(cc, ctx) : "")) + (spec.back ? spec.back(ctx) : ""), "backItems"),
        body: /* @__PURE__ */ __name((cc, ctx) => {
          const v = ctx.view;
          const sway = spec.sway ? spec.sway(ctx) : 0;
          let s = F(c.body(cc, ctx));
          for (const [x, y, w, sc] of spec.holes && spec.holes[v] || []) s += hole(x + sway, y, w, F(sc));
          for (const [x, y, len] of spec.rips && spec.rips[v] || []) s += rip(x + sway, y, len);
          for (const [x, y, col, w, k, band] of spec.tatters && spec.tatters[v] || []) s += tatter(x + sway, ctx.seatDy ? Math.min(y, 63.5 - ctx.seatDy - 3.7 * (k ?? 1) - 0.45) : y, F(col), w, k, band ? F(band) : null);
          return s + (spec.over ? spec.over(ctx, cc) : "");
        }, "body"),
        neck: c.neck ? (cc, ctx) => F(c.neck(cc, ctx)) : void 0,
        restLeft: c.restLeft ? (cc, ctx) => F(c.restLeft(cc, ctx)) : void 0,
        hold: c.hold ? (cc, h, ctx) => F(c.hold(cc, h, ctx)) : void 0,
        head: /* @__PURE__ */ __name((cc, ctx, act) => {
          const h = F(c.head(cc, ctx, act));
          return spec.headFix ? spec.headFix(h, ctx) : h;
        }, "head"),
        overArms: spec.capeFn ? (cc, ctx) => spec.capeFn(cc, ctx) : spec.cape ? (cc, ctx) => cape(spec.capeSh || c.shoulders, ctx.view, cc.uid, spec.cape, spec.capeExtra ? spec.capeExtra(ctx.view) : "") : void 0,
        overHead: spec.head ? (cc, ctx) => spec.head(ctx) : void 0,
        // le geste : appelé sur la copie de l'image (manches, bandage), bras délavés, et ce qui passe par-dessus aussi
        pose(ctx) {
          const a = c.pose.call(this, ctx);
          if (!a) return a;
          return { ...a, left: a.left != null ? F(a.left) : a.left, right: a.right != null ? F(a.right) : a.right, over: a.over ? FO(a.over) : a.over };
        }
      };
      return out;
    }
    __name(castaway, "castaway");
    module.exports = { castaway, fade, recolor, cape, tatter, hole, rip, weed, smudge, cord, CANVAS };
  }
});

// personnages/avatar_choix.js
var require_avatar_choix = __commonJS({
  "personnages/avatar_choix.js"(exports, module) {
    function hsl(hex2) {
      const n = parseInt(hex2.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
      let h = 0, s = 0;
      if (d) {
        s = d / (1 - Math.abs(2 * l - 1));
        h = mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return [h, s, l];
    }
    __name(hsl, "hsl");
    function hex([h, s, l]) {
      const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2;
      const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return "#" + [r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(hex, "hex");
    var mix = /* @__PURE__ */ __name((a, b, k) => {
      const p = /* @__PURE__ */ __name((c) => [0, 2, 4].map((i) => parseInt(c.slice(1 + i, 3 + i), 16)), "p");
      const A2 = p(a), B = p(b);
      return "#" + A2.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }, "mix");
    var tone = /* @__PURE__ */ __name((c, k) => {
      const [h, s, l] = hsl(c);
      return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]);
    }, "tone");
    var delave = /* @__PURE__ */ __name((c, k = 1) => {
      const [h, s, l] = hsl(c);
      return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]);
    }, "delave");
    var clarte = /* @__PURE__ */ __name((c) => hsl(c)[2], "clarte");
    var nuancier = /* @__PURE__ */ __name((list) => Object.fromEntries(list.map(([k, c]) => [k, c])), "nuancier");
    var noms = /* @__PURE__ */ __name((list) => Object.fromEntries(list.map(([k, , n]) => [k, n])), "noms");
    var PEAU = [
      ["nacre", "#FCE8D8", "Nacre"],
      ["porcelaine", "#F6D3B3", "Porcelaine"],
      ["rosee", "#F3C9B4", "Rosée"],
      ["peche", "#F2C9A0", "Pêche"],
      ["doree", "#EDC294", "Dorée"],
      ["miel", "#E9B98F", "Miel"],
      ["sable", "#DCAA7A", "Sable"],
      ["ocre", "#D09A68", "Ocre"],
      ["cannelle", "#C98B5E", "Cannelle"],
      ["bronze", "#B47A4C", "Bronze"],
      ["cuivre", "#A26A42", "Cuivre"],
      ["cacao", "#8D5A3B", "Cacao"],
      ["acajou", "#7C4C33", "Acajou"],
      ["ebene", "#6B4430", "Ébène"],
      ["ombre", "#5C3A28", "Terre d'ombre"],
      ["nuit", "#4A2E20", "Nuit"]
    ];
    var CHEVEUX = [
      ["jais", "#221B17", "Noir de jais"],
      ["noir", "#3A2A1E", "Noirs"],
      ["chocolat", "#5A3A26", "Chocolat"],
      ["brun", "#7A4E2C", "Bruns"],
      ["auburn", "#8E3B26", "Auburn"],
      ["roux", "#B94E3A", "Roux"],
      ["cuivre", "#C8642F", "Cuivrés"],
      ["chatain", "#C9873E", "Châtains"],
      ["venitien", "#D9935A", "Blond vénitien"],
      ["blond", "#E8C46A", "Blonds"],
      ["platine", "#F2E3B3", "Blond platine"],
      ["gris", "#8A8F98", "Gris"],
      ["blanc", "#D9D4CC", "Blancs"],
      ["nuit", "#2E2E3A", "Bleu nuit"],
      ["bonbon", "#F28AB2", "Rose bonbon"],
      ["poudre", "#E8B4C0", "Rose poudré"],
      ["cerise", "#C0304A", "Cerise"],
      ["corail", "#F08A6E", "Corail"],
      ["lilas", "#B79BDB", "Lilas"],
      ["violet", "#7A4FB0", "Violet"],
      ["ciel", "#8EC5E8", "Bleu ciel"],
      ["turquoise", "#4FB8B0", "Turquoise"],
      ["menthe", "#9ADBB8", "Menthe"],
      ["sapin", "#3E6E4E", "Vert sapin"]
    ];
    var YEUX = [
      ["brun", "#2A2420", "Bruns"],
      ["chocolat", "#4A3020", "Chocolat"],
      ["noisette", "#6B4A2A", "Noisette"],
      ["ambre", "#A0682A", "Ambre"],
      ["or", "#B8902F", "Dorés"],
      ["olive", "#6B7A3A", "Olive"],
      ["vert", "#3E6B3A", "Verts"],
      ["emeraude", "#2E8A5A", "Émeraude"],
      ["eau", "#4F9A92", "Vert d'eau"],
      ["azur", "#4E8FD0", "Azur"],
      ["bleu", "#3A5C8C", "Bleus"],
      ["grisbleu", "#6A7F96", "Gris-bleu"],
      ["gris", "#4E5560", "Gris"],
      ["violet", "#6E4E9E", "Violets"],
      ["rose", "#C26A8E", "Roses"],
      ["noir", "#1E1A18", "Noirs"]
    ];
    var TISSUS = [
      ["blanc", "#F8F4EA", "Blanc"],
      ["creme", "#F1E6CC", "Crème"],
      ["sable", "#C9B080", "Sable"],
      ["caramel", "#B07A48", "Caramel"],
      ["cuir", "#5E3A22", "Cuir"],
      ["charbon", "#4A4E5C", "Charbon"],
      ["noir", "#2E2A2A", "Noir"],
      ["rosepale", "#F4C2CC", "Rose pâle"],
      ["rose", "#E8879C", "Rose"],
      ["framboise", "#C8466E", "Framboise"],
      ["corail", "#E8705A", "Corail"],
      ["rouge", "#C8463A", "Rouge"],
      ["bordeaux", "#6E2E3A", "Bordeaux"],
      ["abricot", "#F2A65A", "Abricot"],
      ["soleil", "#F2C04B", "Soleil"],
      ["menthe", "#7EC4A0", "Menthe"],
      ["olive", "#6E7A44", "Olive"],
      ["foret", "#4E7A4A", "Forêt"],
      ["ciel", "#6FA3D9", "Ciel"],
      ["lagon", "#3FA7A8", "Lagon"],
      ["jean", "#3E5A8C", "Jean"],
      ["marine", "#2E3E66", "Marine"],
      ["lavande", "#A48CD6", "Lavande"],
      ["prune", "#7A3E5E", "Prune"]
    ];
    var METAUX = [["or", "#E2B34A", "Or"], ["argent", "#C9CED6", "Argent"], ["orrose", "#E6A88E", "Or rose"], ["cuivre", "#C77A4A", "Cuivre"], ["sombre", "#4A3A30", "Écaille sombre"]];
    var LEVRES = [["naturelles", null, "Naturelles"], ["rose", "#E07A8A", "Rosées"], ["corail", "#E8705A", "Corail"], ["framboise", "#C8466E", "Framboise"], ["nude", "#C98B7A", "Nude"], ["prune", "#8E3E5E", "Prune"], ["rouge", "#C8303A", "Rouges"]];
    var TEINTURES = [
      ["nacre", "#F3E6EE", "Nacre", "rare", "boutique"],
      ["opale", "#BFE3E0", "Opale", "rare", "coffre"],
      ["or", "#E2B34A", "Or", "epique", "coffre"],
      ["argent", "#C9CED6", "Argent", "rare", "boutique"],
      ["rubis", "#B0203A", "Rubis", "epique", "coffre"],
      ["saphir", "#2A4FA8", "Saphir", "epique", "boutique"],
      ["emeraude", "#1E7A4E", "Émeraude", "epique", "coffre"],
      ["amethyste", "#7A3EA8", "Améthyste", "rare", "coffre"],
      ["onyx", "#1E1A1C", "Onyx", "rare", "boutique"],
      ["aurore", "#F7B7A3", "Aurore", "legendaire", "coffre"]
    ];
    var NUANCIERS = {
      peau: nuancier(PEAU),
      cheveux: nuancier(CHEVEUX),
      yeux: nuancier(YEUX),
      tissus: nuancier(TISSUS),
      metaux: nuancier(METAUX),
      levres: nuancier(LEVRES),
      teintures: nuancier(TEINTURES)
    };
    var NOMS_NUANCIERS = {
      peau: noms(PEAU),
      cheveux: noms(CHEVEUX),
      yeux: noms(YEUX),
      tissus: noms(TISSUS),
      metaux: noms(METAUX),
      levres: noms(LEVRES),
      teintures: noms(TEINTURES)
    };
    var PRIX = { commun: 80, rare: 200, epique: 500, legendaire: 1200 };
    var prix = /* @__PURE__ */ __name((rarete, source) => source === "boutique" ? { prix: PRIX[rarete] } : source === "gratuit" ? { prix: 0 } : {}, "prix");
    var TEINTURES_GAINS = Object.fromEntries(TEINTURES.map(([k, , , rarete, source]) => [k, { rarete, source, ...prix(rarete, source) }]));
    var FORMES = {
      genre: { femme: "Femme", homme: "Homme" },
      taille: { petite: "Petite", moyenne: "Moyenne", grande: "Grande" },
      silhouette: { fine: "Fine", moyenne: "Moyenne", large: "Large", ronde: "Ronde" },
      visage: { rond: "Rond", ovale: "Ovale", coeur: "En cœur", carre: "Carré", anguleux: "Anguleux", large: "Large" },
      formeYeux: { ronds: "Ronds", amande: "En amande", grands: "Grands", rieurs: "Rieurs", paisibles: "Paisibles" },
      cils: { sans: "Sans", legers: "Légers", recourbes: "Recourbés" },
      sourcils: { fins: "Fins", epais: "Épais", doux: "Doux" },
      barbe: { sans: "Sans", malRase: "Mal rasé", courte: "Barbe courte", collier: "Collier", bouc: "Bouc", pleine: "Barbe pleine" },
      moustache: { sans: "Sans", fine: "Fine", epaisse: "Chevron", guidon: "Guidon", gauloise: "Gauloise" },
      bouche: { douce: "Douce", sourire: "Souriante", malice: "Malicieuse", serieuse: "Sérieuse" },
      rousseur: { non: "Sans", legere: "Quelques-unes", oui: "Taches de rousseur", dense: "Beaucoup", nez: "Sur le nez" },
      menton: { doux: "Doux", fin: "Fin", court: "Court", fort: "Fort", fendu: "Fendu" },
      age: { jeune: "Jeune", adulte: "Adulte", mur: "Mûr", age: "Âgé" },
      cicatrice: { sans: "Sans", sourcil: "Au sourcil", joue: "Sur la joue", nez: "Sur le nez", levre: "À la lèvre" },
      joues: { roses: "Roses", discretes: "Discrètes", sans: "Sans" },
      grain: { non: "Sans", joue: "Sur la joue", levre: "Au coin de la lèvre" },
      coupe: {
        courte: "Courte",
        meche: "Mèche",
        bataille: "En bataille",
        carre: "Carré",
        milongue: "Mi-longue",
        longue: "Longue",
        ondulee: "Longue ondulée",
        queue: "Queue de cheval",
        queueCote: "Queue sur le côté",
        couettes: "Couettes",
        chignon: "Chignon",
        deuxChignons: "Deux chignons",
        couronne: "Couronne tressée",
        tresses: "Tresses",
        bouclee: "Bouclée",
        locks: "Locks",
        rasee: "Rasée",
        degrade: "Dégradé",
        banane: "Banane",
        raie: "Raie sur le côté",
        herisse: "Hérissée",
        boucleeCourte: "Bouclée courte",
        chignonHomme: "Chignon d'homme",
        pixie: "Pixie",
        demiQueue: "Demi-queue",
        tresseCote: "Tresse sur le côté",
        puffs: "Puffs",
        locksLongues: "Locks longues"
      },
      meches: { sans: "Une couleur", pointes: "Pointes colorées", meches: "Mèches" },
      haut: { tshirt: "T-shirt", debardeur: "Débardeur", polo: "Polo", mariniere: "Marinière", chemise: "Chemise", pull: "Pull", colRoule: "Col roulé", sweat: "Sweat à capuche", gilet: "Gilet", veste: "Veste ouverte" },
      // la robe d'une pièce remplace le haut (le choix du haut est gardé : il revient si l'on change de bas)
      bas: { pantalon: "Pantalon", short: "Short", bermuda: "Bermuda", salopette: "Salopette", jupe: "Jupe", jupePlissee: "Jupe plissée", robe: "Robe chasuble", robeEntiere: "Robe", robeLongue: "Robe longue" },
      formeChaussures: { souliers: "Souliers", baskets: "Baskets", bottines: "Bottines", bottes: "Bottes", sandales: "Sandales", ballerines: "Ballerines", sabots: "Sabots" },
      // un habit d'une couleur, ou en dégradé de sa couleur vers une seconde (du haut au bas de la pièce)
      motifHaut: { uni: "Uni", degrade: "Dégradé", raye: "Rayé", pois: "À pois" },
      motifBas: { uni: "Uni", degrade: "Dégradé", raye: "Rayé", pois: "À pois" }
    };
    var EMPLACEMENTS = {
      tete: "Tête",
      cheveux: "Dans les cheveux",
      visage: "Lunettes",
      joues: "Sur les joues",
      oreilles: "Oreilles",
      cou: "Cou",
      dos: "Dos",
      main: "À la main",
      dessus: "Par-dessus",
      pieds: "Aux pieds",
      mains: "Aux mains"
    };
    var SOURCES = { gratuit: 0, boutique: 1, coffre: 2 };
    var parOrdre = /* @__PURE__ */ __name((o) => Object.fromEntries(Object.entries(o).sort(([, a], [, b]) => Object.keys(EMPLACEMENTS).indexOf(a.emplacement) - Object.keys(EMPLACEMENTS).indexOf(b.emplacement) || SOURCES[a.source] - SOURCES[b.source] || (a.prix || 0) - (b.prix || 0))), "parOrdre");
    var A = /* @__PURE__ */ __name((nom, emplacement, zones, defaut, rarete, source, garde, saison) => ({ nom, emplacement, zones, defaut, rarete, source, ...prix(rarete, source), garde, ...saison ? { saison } : {} }), "A");
    var ACCESSOIRES = parOrdre({
      bonnet: A("Bonnet", "tete", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false),
      paille: A("Chapeau de paille", "tete", ["tissu"], ["rouge"], "commun", "gratuit", false),
      casquette: A("Casquette", "tete", ["tissu"], ["ciel"], "commun", "gratuit", false),
      bandana: A("Bandana", "tete", ["tissu"], ["rouge"], "commun", "gratuit", true),
      couronneFleurs: A("Couronne de fleurs", "tete", ["tissu"], ["rose"], "commun", "gratuit", false),
      beret: A("Béret", "tete", ["tissu"], ["bordeaux"], "commun", "boutique", false),
      oreillesChat: A("Oreilles de chat", "tete", ["tissu"], ["noir"], "rare", "boutique", false),
      oreillesLapin: A("Oreilles de lapin", "tete", ["tissu"], ["blanc"], "rare", "coffre", false),
      diademe: A("Diadème", "tete", ["metal"], ["or"], "legendaire", "coffre", false),
      noeud: A("Nœud", "cheveux", ["tissu"], ["rose"], "commun", "gratuit", true),
      barrettes: A("Barrettes", "cheveux", ["tissu"], ["soleil"], "commun", "gratuit", true),
      fleur: A("Fleur", "cheveux", ["tissu"], ["corail"], "commun", "boutique", true),
      etoile: A("Barrette étoile", "cheveux", ["metal"], ["or"], "rare", "coffre", true),
      lunettesRondes: A("Lunettes rondes", "visage", ["metal"], ["sombre"], "commun", "gratuit", true),
      lunettesCarrees: A("Lunettes carrées", "visage", ["tissu"], ["noir"], "commun", "gratuit", true),
      lunettesPapillon: A("Lunettes papillon", "visage", ["tissu"], ["framboise"], "commun", "boutique", true),
      lunettesSoleil: A("Lunettes de soleil", "visage", ["tissu"], ["noir"], "commun", "boutique", false),
      tricorne: A("Tricorne", "tete", ["tissu"], ["noir"], "commun", "gratuit", false),
      hautForme: A("Haut-de-forme", "tete", ["tissu"], ["noir"], "commun", "gratuit", false),
      monocle: A("Monocle", "visage", ["metal"], ["or"], "commun", "gratuit", true),
      cravate: A("Cravate", "cou", ["tissu"], ["rouge"], "commun", "gratuit", true),
      medaille: A("Médaille", "cou", ["tissu", "metal"], ["rouge", "or"], "commun", "gratuit", true),
      cicatrice: A("Cicatrice", "joues", ["tissu"], ["rosepale"], "commun", "gratuit", true),
      pipe: A("Pipe", "main", ["tissu", "metal"], ["caramel", "argent"], "commun", "gratuit", false),
      canne: A("Canne", "main", ["tissu", "metal"], ["noir", "or"], "commun", "gratuit", false),
      lunettesCoeur: A("Lunettes cœur", "visage", ["tissu"], ["rose"], "rare", "coffre", false),
      coeurs: A("Petits cœurs", "joues", ["tissu"], ["rose"], "commun", "gratuit", false),
      etoiles: A("Petites étoiles", "joues", ["tissu"], ["soleil"], "commun", "boutique", false),
      pansement: A("Pansement", "joues", ["tissu"], ["creme"], "commun", "gratuit", true),
      puces: A("Puces", "oreilles", ["metal"], ["or"], "commun", "gratuit", true),
      anneaux: A("Anneaux", "oreilles", ["metal"], ["or"], "commun", "gratuit", true),
      pendantsEtoile: A("Pendants étoile", "oreilles", ["metal"], ["argent"], "rare", "boutique", true),
      foulard: A("Foulard", "cou", ["tissu"], ["soleil"], "commun", "gratuit", true),
      echarpe: A("Écharpe rayée", "cou", ["tissu", "tissu"], ["rouge", "creme"], "commun", "boutique", true),
      perles: A("Collier de perles", "cou", ["metal"], ["argent"], "rare", "coffre", true),
      coquillage: A("Pendentif coquillage", "cou", ["metal"], ["or"], "commun", "gratuit", true),
      papillon: A("Nœud papillon", "cou", ["tissu"], ["rouge"], "commun", "boutique", true),
      sacDos: A("Sac à dos", "dos", ["tissu"], ["abricot"], "commun", "gratuit", false),
      besace: A("Besace", "dos", ["tissu"], ["caramel"], "commun", "gratuit", false),
      cape: A("Cape", "dos", ["tissu"], ["bordeaux"], "rare", "boutique", false),
      ailes: A("Ailes en tissu", "dos", ["tissu"], ["lavande"], "epique", "coffre", false),
      peluche: A("Peluche", "main", ["tissu"], ["caramel"], "rare", "boutique", false),
      panier: A("Panier fleuri", "main", ["tissu"], ["rose"], "commun", "boutique", false),
      ombrelle: A("Ombrelle", "main", ["tissu"], ["rosepale"], "epique", "coffre", false),
      // les tenues de saison (la mer les prend : elles servent sur l'île, une fois la saison venue)
      manteau: A("Manteau d'hiver", "dessus", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false, "hiver"),
      cire: A("Ciré", "dessus", ["tissu"], ["soleil"], "commun", "gratuit", false, "pluie"),
      bottesPluie: A("Bottes de pluie", "pieds", ["tissu"], ["rouge"], "commun", "gratuit", false, "pluie"),
      bottesFourrees: A("Bottes fourrées", "pieds", ["tissu", "tissu"], ["caramel", "creme"], "commun", "gratuit", false, "hiver"),
      moufles: A("Moufles", "mains", ["tissu", "tissu"], ["rouge", "creme"], "commun", "gratuit", false, "hiver"),
      cacheOreilles: A("Cache-oreilles", "tete", ["tissu", "tissu"], ["rouge", "rouge"], "commun", "gratuit", false, "hiver"),
      chale: A("Châle", "dessus", ["tissu", "tissu"], ["prune", "creme"], "commun", "gratuit", false, "hiver"),
      pelerine: A("Pèlerine", "dessus", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false, "hiver"),
      etole: A("Étole de fourrure", "dessus", ["tissu"], ["creme"], "commun", "gratuit", false, "hiver")
    });
    var GENRES = {
      coupe: {
        femme: [
          "carre",
          "milongue",
          "longue",
          "ondulee",
          "queue",
          "queueCote",
          "couettes",
          "chignon",
          "deuxChignons",
          "couronne",
          "tresses",
          "bouclee",
          "pixie",
          "demiQueue",
          "tresseCote",
          "puffs",
          "locksLongues"
        ],
        homme: ["courte", "meche", "bataille", "degrade", "banane", "raie", "herisse", "boucleeCourte", "chignonHomme", "rasee"]
      },
      bas: { femme: ["jupe", "jupePlissee", "robe", "robeEntiere", "robeLongue"] },
      formeChaussures: { femme: ["ballerines"] },
      visage: { femme: ["coeur"], homme: ["carre", "anguleux", "large"] },
      menton: { homme: ["fin", "court", "fort", "fendu"] },
      levres: { femme: ["rose", "corail", "framboise", "nude", "prune", "rouge"] },
      joues: { femme: ["roses"] },
      barbe: { homme: ["malRase", "courte", "collier", "bouc", "pleine"] },
      moustache: { homme: ["fine", "epaisse", "guidon", "gauloise"] },
      accessoires: {
        femme: [
          "couronneFleurs",
          "oreillesChat",
          "oreillesLapin",
          "diademe",
          "noeud",
          "barrettes",
          "fleur",
          "etoile",
          "lunettesPapillon",
          "lunettesCoeur",
          "coeurs",
          "etoiles",
          "puces",
          "anneaux",
          "pendantsEtoile",
          "perles",
          "coquillage",
          "ailes",
          "peluche",
          "panier",
          "ombrelle",
          "chale",
          "etole"
        ],
        homme: ["tricorne", "hautForme", "monocle", "cravate", "papillon", "medaille", "cicatrice", "pipe", "canne"]
      }
    };
    var GENRE_DE = Object.fromEntries(Object.entries(GENRES).map(([cle, g]) => [cle, Object.fromEntries(Object.entries(g).flatMap(([genre, vals]) => vals.map((v) => [v, genre])))]));
    var genreDe = /* @__PURE__ */ __name((cle, valeur) => (GENRE_DE[cle] || {})[valeur] || null, "genreDe");
    var pourGenre = /* @__PURE__ */ __name((cle, valeur, genre) => {
      const g = genreDe(cle, valeur);
      return !g || g === genre;
    }, "pourGenre");
    var DEFAUT_GENRE = {
      femme: { coupe: "milongue", joues: "roses", barbe: "sans", moustache: "sans", visage: "rond", cils: "legers", sourcils: "fins" },
      homme: { visage: "carre", coupe: "courte", cils: "sans", levres: "naturelles", joues: "sans", bas: "pantalon", sourcils: "epais" }
    };
    var LIES_AU_CORPS = ["cils", "sourcils"];
    for (const [id, a] of Object.entries(ACCESSOIRES)) {
      const g = genreDe("accessoires", id);
      if (g) a.genre = g;
    }
    function selonGenre(o) {
      const out = { ...o, accessoires: { ...o.accessoires || {} } };
      for (const cle of LIES_AU_CORPS) out[cle] = DEFAUT_GENRE[out.genre][cle];
      for (const cle of Object.keys(GENRES)) {
        if (cle === "accessoires") continue;
        if (!pourGenre(cle, out[cle], out.genre)) out[cle] = DEFAUT_GENRE[out.genre][cle];
      }
      for (const [place, a] of Object.entries(out.accessoires)) if (a && !pourGenre("accessoires", a.id, out.genre)) delete out.accessoires[place];
      return out;
    }
    __name(selonGenre, "selonGenre");
    var CHOIX = {
      genre: "formes",
      menton: "formes",
      age: "formes",
      cicatrice: "formes",
      taille: "formes",
      silhouette: "formes",
      peau: "peau",
      visage: "formes",
      yeux: "yeux",
      formeYeux: "formes",
      cils: "formes",
      sourcils: "formes",
      barbe: "formes",
      moustache: "formes",
      bouche: "formes",
      levres: "levres",
      rousseur: "formes",
      joues: "formes",
      grain: "formes",
      coupe: "formes",
      cheveux: "cheveux",
      meches: "formes",
      couleurMeches: "cheveux",
      haut: "formes",
      couleurHaut: "tissus",
      motifHaut: "formes",
      couleurHaut2: "tissus",
      bas: "formes",
      couleurBas: "tissus",
      motifBas: "formes",
      couleurBas2: "tissus",
      chaussures: "tissus",
      formeChaussures: "formes"
    };
    var DEFAUT = {
      genre: "femme",
      menton: "doux",
      age: "adulte",
      cicatrice: "sans",
      taille: "moyenne",
      silhouette: "moyenne",
      peau: "peche",
      visage: "rond",
      yeux: "brun",
      formeYeux: "ronds",
      cils: "sans",
      sourcils: "fins",
      barbe: "sans",
      moustache: "sans",
      bouche: "douce",
      levres: "naturelles",
      rousseur: "non",
      joues: "roses",
      grain: "non",
      coupe: "milongue",
      cheveux: "brun",
      meches: "sans",
      couleurMeches: "blond",
      haut: "tshirt",
      couleurHaut: "corail",
      motifHaut: "uni",
      couleurHaut2: "soleil",
      bas: "pantalon",
      couleurBas: "jean",
      motifBas: "uni",
      couleurBas2: "marine",
      chaussures: "cuir",
      formeChaussures: "souliers",
      accessoires: {}
    };
    var accepte = /* @__PURE__ */ __name((nom, cle) => NUANCIERS[nom] && cle in NUANCIERS[nom] || (nom === "tissus" || nom === "cheveux") && cle in NUANCIERS.teintures, "accepte");
    var couleur = /* @__PURE__ */ __name((nom, cle) => NUANCIERS[nom] && NUANCIERS[nom][cle] || NUANCIERS.teintures[cle], "couleur");
    var libelle = /* @__PURE__ */ __name((cle, valeur) => {
      const nom = CHOIX[cle];
      if (nom === "formes") return FORMES[cle][valeur];
      return NOMS_NUANCIERS[nom] && NOMS_NUANCIERS[nom][valeur] || NOMS_NUANCIERS.teintures[valeur];
    }, "libelle");
    function verifier(choix = {}) {
      const o = { ...DEFAUT, ...choix, accessoires: { ...choix.accessoires || {} } };
      if (o.genre !== "homme") {
        o.barbe = "sans";
        o.moustache = "sans";
      }
      for (const [k, v] of Object.entries(o)) {
        if (k === "accessoires") continue;
        const nom = CHOIX[k];
        if (!nom) throw new Error(`choix inconnu : ${k}`);
        if (nom === "formes" ? !(v in FORMES[k]) : !accepte(nom, v)) throw new Error(`choix inconnu : ${k} = ${v}`);
      }
      for (const [place, a] of Object.entries(o.accessoires)) {
        if (!a) {
          delete o.accessoires[place];
          continue;
        }
        const def = ACCESSOIRES[a.id];
        if (!def) throw new Error(`accessoire inconnu : ${a.id}`);
        if (def.emplacement !== place) throw new Error(`accessoire ${a.id} : il se porte en « ${def.emplacement} », pas en « ${place} »`);
        if (a.couleurs && a.couleurs.length > def.zones.length) throw new Error(`accessoire ${a.id} : ${def.zones.length} couleur(s) attendue(s)`);
        const cs = def.zones.map((z, i) => a.couleurs && a.couleurs[i] || def.defaut[i]);
        cs.forEach((cle, i) => {
          if (!accepte(def.zones[i] === "metal" ? "metaux" : "tissus", cle)) throw new Error(`accessoire ${a.id} : couleur inconnue ${cle}`);
        });
        o.accessoires[place] = { id: a.id, couleurs: cs };
      }
      return o;
    }
    __name(verifier, "verifier");
    var couleursAccessoire = /* @__PURE__ */ __name((a) => a.couleurs.map((cle, i) => couleur(ACCESSOIRES[a.id].zones[i] === "metal" ? "metaux" : "tissus", cle)), "couleursAccessoire");
    var naufrageChoix = /* @__PURE__ */ __name((o) => ({ ...o, accessoires: Object.fromEntries(Object.entries(o.accessoires || {}).filter(([, a]) => a && ACCESSOIRES[a.id].garde)) }), "naufrageChoix");
    function graine(n) {
      let a = n >>> 0;
      return () => {
        a = a + 1831565813 >>> 0;
        let t = a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    __name(graine, "graine");
    function auHasard(n, { gratuit = true } = {}) {
      const r = graine(n);
      const un = /* @__PURE__ */ __name((list) => list[Math.floor(r() * list.length) % list.length], "un");
      const cles = /* @__PURE__ */ __name((obj) => Object.keys(obj), "cles");
      const naturels = CHEVEUX.slice(0, 14).map(([k]) => k), fantaisie = CHEVEUX.slice(14).map(([k]) => k);
      const tissus = cles(NUANCIERS.tissus);
      const haut = un(cles(FORMES.haut)), couleurHaut = un(tissus);
      const loin = /* @__PURE__ */ __name((c) => {
        const [h1, , l1] = hsl(NUANCIERS.tissus[couleurHaut]), [h2, , l2] = hsl(NUANCIERS.tissus[c]);
        return Math.abs(l1 - l2) > 0.18 || Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) > 50;
      }, "loin");
      const genre = r() < 0.5 ? "homme" : "femme";
      const de = /* @__PURE__ */ __name((cle) => cles(FORMES[cle]).filter((v) => pourGenre(cle, v, genre)), "de");
      const bas = un(de("bas")), couleurBas = un(tissus.filter(loin));
      const o = {
        genre,
        taille: un(cles(FORMES.taille)),
        silhouette: un(cles(FORMES.silhouette)),
        peau: un(cles(NUANCIERS.peau)),
        visage: un(de("visage")),
        yeux: un(cles(NUANCIERS.yeux)),
        formeYeux: un(cles(FORMES.formeYeux)),
        cils: un(genre === "homme" ? ["sans"] : de("cils")),
        sourcils: genre === "homme" ? un(["epais", "fins"]) : un(cles(FORMES.sourcils)),
        barbe: genre === "homme" && r() < 0.35 ? un(["malRase", "courte", "collier", "bouc", "pleine"]) : "sans",
        moustache: genre === "homme" && r() < 0.25 ? un(["fine", "epaisse", "guidon", "gauloise"]) : "sans",
        bouche: un(cles(FORMES.bouche)),
        levres: genre === "femme" && r() < 0.3 ? un(cles(NUANCIERS.levres).slice(1)) : "naturelles",
        age: un(["jeune", "adulte", "adulte", "adulte", "mur", "age"]),
        menton: genre === "homme" ? un(["doux", "fin", "court", "fort", "fendu"]) : "doux",
        cicatrice: r() < 0.1 ? un(["sourcil", "joue", "nez", "levre"]) : "sans",
        rousseur: r() < 0.25 ? un(["legere", "oui", "dense", "nez"]) : "non",
        joues: un(de("joues")),
        grain: r() < 0.15 ? un(["joue", "levre"]) : "non",
        coupe: un(de("coupe").concat(["locks"])),
        cheveux: r() < 0.8 ? un(naturels) : un(fantaisie),
        meches: r() < 0.2 ? un(["pointes", "meches"]) : "sans",
        couleurMeches: un(cles(NUANCIERS.cheveux)),
        haut,
        couleurHaut,
        bas,
        couleurBas,
        chaussures: un(["cuir", "caramel", "noir", "blanc", "creme", "rouge", "jean", "rose"]),
        formeChaussures: un(de("formeChaussures")),
        accessoires: {}
      };
      const permis = Object.entries(ACCESSOIRES).filter(([id, a]) => !a.saison && (!gratuit || a.source === "gratuit") && pourGenre("accessoires", id, genre));
      const nb = Math.floor(r() * 3);
      for (let i = 0; i < nb; i++) {
        const [id, a] = un(permis);
        if (o.accessoires[a.emplacement]) continue;
        o.accessoires[a.emplacement] = { id, couleurs: a.zones.map((z) => z === "metal" ? un(cles(NUANCIERS.metaux)) : un(tissus)) };
      }
      return verifier(o);
    }
    __name(auHasard, "auHasard");
    module.exports = {
      NUANCIERS,
      NOMS_NUANCIERS,
      TEINTURES_GAINS,
      PRIX,
      FORMES,
      EMPLACEMENTS,
      ACCESSOIRES,
      CHOIX,
      DEFAUT,
      verifier,
      libelle,
      couleur,
      couleursAccessoire,
      naufrageChoix,
      auHasard,
      graine,
      GENRES,
      DEFAUT_GENRE,
      LIES_AU_CORPS,
      genreDe,
      pourGenre,
      selonGenre,
      hsl,
      hex,
      mix,
      tone,
      delave,
      clarte
    };
  }
});

// personnages/avatar_accessoires.js
var require_avatar_accessoires = __commonJS({
  "personnages/avatar_accessoires.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, r2: r22, shoe } = require_troupe();
    var { tone, mix } = require_avatar_choix();
    var sx = /* @__PURE__ */ __name((d, k) => k ? d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`) : d, "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(48 - x)},${y}`), "mirror");
    var decale = /* @__PURE__ */ __name((v) => v === "se" ? -1.4 : 0, "decale");
    var nuque = /* @__PURE__ */ __name((v) => v === "se" ? 0.6 : 0, "nuque");
    var reflet = /* @__PURE__ */ __name((c) => tone(c, 1.45), "reflet");
    var fleurette = /* @__PURE__ */ __name((x, y, r, col, coeur2 = "#F2C04B") => [0, 1, 2, 3, 4].map((i) => {
      const a = i / 5 * Math.PI * 2 - Math.PI / 2;
      return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.78, r * 0.78, col, 0.55);
    }).join("") + E(x, y, r * 0.55, r * 0.55, coeur2, 0.5), "fleurette");
    var feuille = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot}) scale(${s})">${P("M0,0 Q1.3,-1.1 2.8,0 Q1.3,1.1 0,0 Z", "#7EB45A", 0.5)}</g>`, "feuille");
    var etoile = /* @__PURE__ */ __name((x, y, r, col, w = 0.6) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = i / 10 * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        return `${r22(x + Math.cos(a) * rr)},${r22(y + Math.sin(a) * rr)}`;
      });
      return P(`M${pts.join(" L")} Z`, col, w);
    }, "etoile");
    var coeur = /* @__PURE__ */ __name((x, y, s, col, w = 0.5) => P(`M${r22(x)},${r22(y + s * 0.9)} C${r22(x - s * 1.5)},${r22(y)} ${r22(x - s * 0.9)},${r22(y - s * 1.1)} ${r22(x)},${r22(y - s * 0.35)} C${r22(x + s * 0.9)},${r22(y - s * 1.1)} ${r22(x + s * 1.5)},${r22(y)} ${r22(x)},${r22(y + s * 0.9)} Z`, col, w), "coeur");
    var scintille = /* @__PURE__ */ __name((x, y, s, col) => P(`M${r22(x)},${r22(y - s)} Q${r22(x + s * 0.18)},${r22(y - s * 0.18)} ${r22(x + s)},${r22(y)} Q${r22(x + s * 0.18)},${r22(y + s * 0.18)} ${r22(x)},${r22(y + s)} Q${r22(x - s * 0.18)},${r22(y + s * 0.18)} ${r22(x - s)},${r22(y)} Q${r22(x - s * 0.18)},${r22(y - s * 0.18)} ${r22(x)},${r22(y - s)} Z`, col, 0.45), "scintille");
    function reperes(c) {
      const [[x0, y0], [x1]] = c.shoulders, dy = c.dy || 0, e = (x1 - x0) / 2;
      const k = c.k || { sw: e + 0.5, hw: e + 2.2, b: 0, ...c.porte };
      const hanche = r22(c.hip - dy);
      return { cou: r22(y0 - dy - 3.2), e, sw: k.sw, hw: k.hw, b: k.b, hanche, ourlet: c.coatHem !== void 0 ? c.coatHem : r22(hanche + (c.ground - c.hip) * 0.45) };
    }
    __name(reperes, "reperes");
    function capucheRabattue(uid, view, R, col, S) {
      const { cou: y, e } = R, a = r22(24 - e + 0.4), b = r22(24 + e - 0.4);
      if (view !== "ne") return P(`M${a},${r22(y + 0.8)} Q24,${r22(y - 3.8)} ${b},${r22(y + 0.8)} L${b},${r22(y + 3)} L${a},${r22(y + 3)} Z`, S);
      const d = `M${a},${r22(y + 2.2)} Q24,${r22(y + 6.8)} ${b},${r22(y + 2.2)} L${r22(24 + e + 0.6)},${r22(y + 7.8)} Q24,${r22(y + 11.4)} ${r22(24 - e - 0.6)},${r22(y + 7.8)} Z`;
      return P(d, col) + clip(`${uid}cap`, d, `<rect x="27.2" y="${r22(y)}" width="16" height="14" fill="${S}"/>`) + P(d, "none") + P(`M${r22(24 - e + 1.6)},${r22(y + 6.6)} Q24,${r22(y + 9.6)} ${r22(24 + e - 1.6)},${r22(y + 6.6)}`, "none", 0.7);
    }
    __name(capucheRabattue, "capucheRabattue");
    function bonnet(c, { view }, [col, revers]) {
      const k = view === "se" ? -0.8 : 0, X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const dome = `M${X(10.4)},15.6 Q${X(9.8)},5.6 ${X(24)},5.4 Q${XD(38.2)},5.6 ${XD(37.6)},15.6 Z`;
      const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${XD(38)},12.8 L${XD(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
      const cotes = [-11, -6.6, -2.2, 2.2, 6.6, 11].map((d) => `<path d="M${X(24 + d * 0.55)},6 Q${X(24 + d * 1.05)},9.2 ${X(24 + d * 1.1)},15.4" fill="none" stroke="${tone(col, 0.8)}" stroke-width="0.6"/>`).join("");
      const mailles = [-12, -8, -4, 0, 4, 8, 12].map((d) => L([24 + d + k, 13.6 + (Math.abs(d) < 6 ? 1 : 0.4) - Math.abs(d) * 0.05], [24 + d * 1.01 + k, 16.4 + (Math.abs(d) < 6 ? 1.1 : 0.4) - Math.abs(d) * 0.05], tone(revers, 0.84), 0.5)).join("");
      return P(dome, col) + clip(`${c.uid}bn${view}`, dome, cotes + `<rect x="${X(27.6)}" y="2" width="12" height="15" fill="${tone(col, 0.86)}" opacity="0.7"/>`) + P(dome, "none") + P(rim, revers) + clip(`${c.uid}rv${view}`, rim, mailles) + P(rim, "none") + E(X(24), 5.7, 2.3, 1.55, revers, 0.85) + E(X(23.4), 5.2, 0.8, 0.55, "#FFFFFF", 0);
    }
    __name(bonnet, "bonnet");
    function arceau(c, { view }, [, col]) {
      const d = view === "se" ? "M13.4,20.4 Q12.6,8.6 24.2,8.2 Q36.2,8.6 35.8,20.4" : "M12.6,20.4 Q12,7.6 24,7.4 Q36,7.6 35.4,20.4";
      return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    __name(arceau, "arceau");
    function cacheOreilles(c, { view }, [col]) {
      const muffs = view === "se" ? [[35.4, 22.6]] : view === "ne" ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
      return muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P(`M${r22(x - 1.7)},${r22(y + 1.3)} Q${x},${r22(y + 2.6)} ${r22(x + 1.7)},${r22(y + 1.3)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`) + E(x - 0.7, y - 1.2, 0.9, 0.8, "#FFFFFF", 0)).join("");
    }
    __name(cacheOreilles, "cacheOreilles");
    function paille(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), ne = view === "ne";
      const PA = "#F2D27E", PS = "#D9AE52", PT = "#B88A3A", PH = "#FFF2C2";
      const calotte = `M${X(14.8)},14 Q${X(14.4)},5.2 ${X(24)},4.9 Q${XD(33.6)},5.2 ${XD(33.2)},14 Z`;
      const bord = `M${X(6.4)},14.6 Q${X(6.8)},11.6 ${X(14.8)},11.8 Q${X(24)},10.6 ${XD(33.2)},11.8 Q${XD(41.2)},11.6 ${XD(41.6)},14.6 Q${XD(40)},17.8 ${X(24)},17.8 Q${X(8)},17.8 ${X(6.4)},14.6 Z`;
      const rangs = /* @__PURE__ */ __name((y0, y1, pas) => Array.from({ length: Math.round((y1 - y0) / pas) }, (_, i) => `M${X(4)},${r22(y0 + i * pas)} L${X(44)},${r22(y0 + i * pas)}`).join(" "), "rangs");
      let s = `<ellipse cx="${X(24)}" cy="17" rx="13" ry="1.6" fill="${c.hairS || "#000"}" opacity=".35"/>`;
      s += P(bord, PA) + clip(`${c.uid}pb${view}`, bord, `<path d="${rangs(12, 18, 1.2)}" stroke="${PS}" stroke-width=".35" fill="none"/><rect x="${X(28)}" y="10" width="16" height="9" fill="${PS}" opacity=".45"/>`) + P(bord, "none") + `<path d="M${X(8)},14.8 Q${X(24)},16.6 ${X(40)},14.8" stroke="${PT}" stroke-width=".5" fill="none"/>`;
      s += P(calotte, PA) + clip(`${c.uid}pc${view}`, calotte, `<path d="${rangs(5.6, 14, 1.1)}" stroke="${PS}" stroke-width=".35" fill="none"/><rect x="${X(27.4)}" y="4" width="8" height="11" fill="${PS}" opacity=".55"/><rect x="${X(14)}" y="10.6" width="20" height="2.4" fill="${col}"/><rect x="${X(14)}" y="12.4" width="20" height=".6" fill="${tone(col, 0.7)}"/>`) + P(calotte, "none") + L([X(17.2), 8.4], [X(20.6), 6.6], PH, 0.9);
      const nx = ne ? 16 : 31.2;
      if (view !== "se" || true) s += P(`M${X(nx)},11.8 l-1.8,-1.2 l0,2.6 Z M${X(nx)},11.8 l1.8,-1.2 l0,2.6 Z`, col, 0.5) + E(+X(nx), 11.8, 0.7, 0.7, tone(col, 0.8), 0.4);
      return s;
    }
    __name(paille, "paille");
    function casquette(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.72), H = tone(col, 1.35);
      const dome = `M${X(11.4)},15.8 Q${X(11.2)},5.4 ${X(24)},5.2 Q${XD(36.8)},5.4 ${XD(36.6)},15.8 Q${X(24)},14.4 ${X(11.4)},15.8 Z`;
      const coutures = view === "ne" ? `M${X(24)},5.4 L${X(24)},14.8 M${X(18)},6.6 Q${X(16.6)},10.6 ${X(16.8)},15 M${X(30)},6.6 Q${X(31.4)},10.6 ${X(31.2)},15` : `M${X(24)},5.4 L${X(24)},14.6 M${X(19)},6.2 Q${X(17)},10.4 ${X(17.2)},14.8 M${X(29)},6.2 Q${X(31)},10.4 ${X(30.8)},14.8`;
      let s = P(dome, col) + clip(`${c.uid}cq${view}`, dome, `<rect x="${X(27)}" y="4" width="12" height="13" fill="${S}" opacity=".7"/><path d="${coutures}" stroke="${S}" stroke-width=".5" fill="none"/>` + (view === "ne" ? `<path d="M${X(19)},15.6 Q${X(24)},11.6 ${X(29)},15.6 Z" fill="${c.hair || "#5A3A26"}"/><path d="M${X(17)},15.6 L${X(31)},15.6" stroke="${S}" stroke-width="1.2"/>` : "")) + P(dome, "none") + E(+X(24), 5.3, 1.1, 0.75, S, 0.6) + L([X(15.4), 9.4], [X(19.6), 7.2], H, 0.9);
      if (view === "front") {
        const v = `M${X(14.2)},15.2 Q${X(24)},12.8 ${X(33.8)},15.2 Q${X(34.6)},17.6 ${X(24)},18.6 Q${X(13.4)},17.6 ${X(14.2)},15.2 Z`;
        s += P(v, col) + clip(`${c.uid}cv${view}`, v, `<path d="M${X(12)},16.4 Q${X(24)},18.8 ${X(36)},16.4 L${X(36)},20 L${X(12)},20 Z" fill="${S}"/>`) + P(v, "none") + `<path d="M${X(16)},15.6 Q${X(24)},13.6 ${X(32)},15.6" stroke="${H}" stroke-width=".45" fill="none" stroke-dasharray=".8 .6"/>`;
      } else if (view === "se") {
        const v = `M${X(12.4)},14.6 Q${X(7)},13.2 ${X(5.4)},15.6 Q${X(6.4)},17.6 ${X(12)},17.2 L${X(19)},16.2 Q${X(16)},14.6 ${X(12.4)},14.6 Z`;
        s += P(v, col) + clip(`${c.uid}cv${view}`, v, `<rect x="${X(4)}" y="16" width="16" height="3" fill="${S}"/>`) + P(v, "none") + `<path d="M${X(7)},15.4 Q${X(10)},14.6 ${X(13.6)},15.2" stroke="${H}" stroke-width=".45" fill="none" stroke-dasharray=".8 .6"/>`;
      }
      return s;
    }
    __name(casquette, "casquette");
    function bandana(c, { view }, [col]) {
      const ne = view === "ne", k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.74), H = tone(col, 1.3);
      const d = ne ? `M${X(11)},18.2 Q${X(10.6)},5.8 ${X(24)},5.6 Q${X(37.4)},5.8 ${X(37)},18.2 Q${X(24)},15.6 ${X(11)},18.2 Z` : `M${X(11.2)},17 Q${X(11)},5.8 ${X(24)},5.6 Q${XD(37)},5.8 ${XD(36.8)},17 Q${X(24)},13.6 ${X(11.2)},17 Z`;
      const pois = [[15.6, 9.6], [20.4, 7.4], [26.4, 7.6], [31.6, 9.8], [18, 12.6], [24, 11], [29.8, 12.8], [14.4, 14.6], [33.6, 14.6]];
      let s = P(d, col) + clip(`${c.uid}bd${view}`, d, `<rect x="${X(27.6)}" y="4" width="12" height="16" fill="${S}" opacity=".7"/>` + pois.map(([x, y]) => E(+X(x), y, 0.75, 0.62, "#FFF6E6", 0)).join("") + `<path d="M${X(12.6)},${ne ? 16.4 : 15} Q${X(24)},${ne ? 13.6 : 12} ${X(35.4)},${ne ? 16.4 : 15}" stroke="${S}" stroke-width=".55" fill="none"/>`) + P(d, "none") + L([X(15.6), 8.4], [X(20.4), 6.6], H, 0.9);
      if (ne) s += P(`M${X(23.2)},17 Q${X(21.2)},20.6 ${X(21.6)},24 Q${X(22.8)},22.8 ${X(23.8)},23.4 Q${X(23.4)},20.2 ${X(24.4)},17.2 Z`, S, 0.7) + P(`M${X(24.8)},17 Q${X(27.4)},20 ${X(27.6)},23.4 Q${X(26.4)},22.6 ${X(25.4)},23 Q${X(25.4)},20 ${X(23.6)},17.4 Z`, S, 0.7) + E(+X(24), 16.8, 2, 1.4, col, 0.7) + L([X(23.2), 16.4], [X(24.4), 16.2], H, 0.5);
      return s;
    }
    __name(bandana, "bandana");
    function couronneFleurs(c, { view }, [col]) {
      const k = decale(view);
      const pts = view === "ne" ? [[12.6, 15.6], [15.8, 12.6], [19.8, 11.2], [24, 10.8], [28.2, 11.2], [32.2, 12.6], [35.4, 15.6]] : [[12.8, 14.6], [16, 11.8], [20, 10.6], [24, 10.2], [28, 10.6], [32, 11.8], [35.2, 14.6]];
      const alt = mix(col, "#FFFFFF", 0.55);
      let s = P(sx(view === "ne" ? "M12.6,15.6 Q24,8.6 35.4,15.6" : "M12.8,14.6 Q24,8 35.2,14.6", k), "none", 0) + pts.slice(0, -1).map(([x, y], i) => feuille(x + k + 1.4, y - 0.4, i % 2 ? -30 : 20, 0.9)).join("");
      s += pts.map(([x, y], i) => fleurette(x + k, y, i % 2 ? 1.05 : 1.25, i % 2 ? alt : col)).join("");
      return s;
    }
    __name(couronneFleurs, "couronneFleurs");
    function beret(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.72), H = tone(col, 1.35);
      const ne = view === "ne";
      const feutre = ne ? `M${X(11.2)},13.6 Q${X(9.6)},5.6 ${X(22.6)},4.4 Q${X(36.4)},3.6 ${X(38.6)},9.6 Q${X(39.6)},13 ${X(36)},13.6 Q${X(24)},11 ${X(11.2)},13.6 Z` : `M${X(11.6)},13 Q${X(9.8)},5.4 ${X(22.4)},4.2 Q${XD(36.4)},3.4 ${XD(38.8)},9 Q${XD(39.8)},12.4 ${XD(36.2)},13 Q${X(24)},10.6 ${X(11.6)},13 Z`;
      const bande = ne ? `M${X(12.2)},13.4 Q${X(24)},11.2 ${X(35.8)},13.4 L${X(35.6)},15 Q${X(24)},12.8 ${X(12.4)},15 Z` : `M${X(12.6)},12.8 Q${X(24)},10.8 ${XD(35.8)},12.8 L${XD(35.6)},14.4 Q${X(24)},12.4 ${X(12.8)},14.4 Z`;
      return '<g transform="translate(0 1.3)">' + P(bande, S, 0.8) + P(feutre, col) + clip(`${c.uid}br${view}`, feutre, `<path d="M${X(8)},10.4 Q${X(24)},7.8 ${X(42)},10 L${X(42)},16 L${X(8)},16 Z" fill="${S}"/><ellipse cx="${X(20)}" cy="6.4" rx="6" ry="1.8" fill="${H}" opacity=".55"/>`) + P(feutre, "none") + P(`M${X(24.2)},4.6 Q${X(24.4)},3.2 ${X(25.8)},3`, "none", 1.2).replace(`stroke="${OUT}"`, `stroke="${S}"`) + "</g>";
    }
    __name(beret, "beret");
    function oreillesChat(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const ear = sx("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z", k), inner = sx("M15,9.8 L14.5,6 L18.2,8 Z", k);
      const earR = sx(mirror("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z"), k), innerR = sx(mirror("M15,9.8 L14.5,6 L18.2,8 Z"), k);
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>` + P(ear, col) + P(earR, col) + (ne ? "" : P(inner, "#F4A8B8", 0) + P(innerR, "#F4A8B8", 0));
    }
    __name(oreillesChat, "oreillesChat");
    function oreillesLapin(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const left = sx("M16.2,9.4 Q14.2,5.2 15.6,3.4 Q17.6,2.4 19.2,4.6 Q20.2,6.8 19.4,8.8 Z", k);
      const right = sx("M28.6,8.6 Q29,4.6 31.6,3.8 Q34.2,3.6 36.4,5.8 Q36.8,7.4 35,7.2 Q32.6,6.4 31.4,9.2 Z", k);
      const pink = "#F4A8B8";
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 1.8)">` + P(left, col) + P(right, col) + (ne ? "" : P(sx("M16.8,8.4 Q15.6,5.4 16.4,4.4 Q17.6,4 18.4,5.4 Q18.8,7 18.4,8.2 Z", k), pink, 0) + P(sx("M30.2,7.6 Q30.6,5.4 32,4.9 Q33.8,4.8 35.2,6 Q33,5.6 31.6,7.8 Z", k), pink, 0)) + "</g>";
    }
    __name(oreillesLapin, "oreillesLapin");
    function diademe(c, { view }, [col]) {
      const k = decale(view);
      if (view === "ne") return `<path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
      const d = sx("M15.4,11.6 Q24,8.6 32.6,11.6 L31.4,8.8 L28.4,9.6 L26.2,6.6 L24,4.8 L21.8,6.6 L19.6,9.6 L16.6,8.8 Z", k);
      return P(d, col, 0.9) + P(sx("M16.4,10.6 Q24,8 31.6,10.6", k), "none", 0.45) + E(24 + k, 8.2, 1.1, 1.3, "#E8879C", 0.6) + E(23.7 + k, 7.8, 0.35, 0.4, "#FFFFFF", 0) + E(19.8 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + E(28.2 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + L([20.6 + k, 8.2], [22.6 + k, 6.4], reflet(col), 0.6);
    }
    __name(diademe, "diademe");
    var PIN = { front: [15.4, 10.6], se: [14.6, 11], ne: [32.6, 11.6] };
    function noeud(c, { view }, [col]) {
      const [x, y] = PIN[view], d = tone(col, 0.82);
      return P(`M${x},${y} Q${r22(x - 4.4)},${r22(y - 3.6)} ${r22(x - 4.4)},${r22(y + 0.2)} Q${r22(x - 3.8)},${r22(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${x},${y} Q${r22(x + 4.4)},${r22(y - 3.6)} ${r22(x + 4.4)},${r22(y + 0.2)} Q${r22(x + 3.8)},${r22(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${r22(x - 0.6)},${r22(y + 0.6)} L${r22(x - 1.8)},${r22(y + 3.8)} L${r22(x - 0.4)},${r22(y + 3.2)} Z M${r22(x + 0.6)},${r22(y + 0.6)} L${r22(x + 1.8)},${r22(y + 3.8)} L${r22(x + 0.4)},${r22(y + 3.2)} Z`, d, 0.6) + E(x, y, 1.15, 1.25, d, 0.7) + L([x - 3.2, y - 1], [x - 1.8, y - 1.6], tone(col, 1.35), 0.6);
    }
    __name(noeud, "noeud");
    function barrettes(c, { view }, [col]) {
      const [x, y] = PIN[view];
      const one = /* @__PURE__ */ __name((dx, dy) => `<rect x="${r22(x + dx - 2.2)}" y="${r22(y + dy - 0.65)}" width="4.4" height="1.3" rx="0.65" fill="${col}" stroke="${OUT}" stroke-width="0.6" transform="rotate(-28 ${r22(x + dx)} ${r22(y + dy)})"/>`, "one");
      return one(-0.4, -0.8) + one(1.4, 1.6);
    }
    __name(barrettes, "barrettes");
    function fleur(c, { view }, [col]) {
      const [x, y] = PIN[view];
      return feuille(x + 1, y + 1.2, 30) + feuille(x - 1, y + 1.4, 150) + fleurette(x, y, 1.6, col);
    }
    __name(fleur, "fleur");
    function etoileCheveux(c, { view }, [col]) {
      const [x, y] = PIN[view];
      return etoile(x, y, 2.4, col, 0.65) + L([x - 0.6, y - 1.2], [x - 0.1, y - 1.8], reflet(col), 0.5);
    }
    __name(etoileCheveux, "etoileCheveux");
    var VERRES = { front: [[19.4, 22.8], [28.6, 22.8]], se: [[17.2, 22.8], [25.4, 22.8]] };
    var branches = /* @__PURE__ */ __name((view, col) => (view === "se" ? P("M27.9,22.2 L34.4,21.4", "none", 0.8) : P("M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6", "none", 0.8)).replace(`stroke="${OUT}"`, `stroke="${col}"`), "branches");
    var deDos = /* @__PURE__ */ __name((col) => P("M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${col}"`), "deDos");
    function lunettes(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne") return deDos(forme === "rondes" ? col : tone(col, 0.7));
        const [[x1, y], [x2]] = VERRES[view];
        const se = view === "se", f = se ? 0.86 : 1;
        const frame = forme === "rondes" ? col : tone(col, 0.9);
        const glass = forme === "soleil" ? `fill="${tone(col, 0.45)}" fill-opacity="0.9"` : forme === "coeur" ? `fill="${mix(col, "#FFFFFF", 0.3)}" fill-opacity="0.55"` : 'fill="rgba(200,230,255,.25)"';
        const lens = /* @__PURE__ */ __name((x, w) => {
          if (forme === "rondes" || forme === "soleil") return `<circle cx="${x}" cy="${y}" r="${r22(3.1 * w)}" ${glass} stroke="${frame}" stroke-width="${forme === "soleil" ? 1 : 0.9}"/>`;
          if (forme === "carrees") return `<rect x="${r22(x - 3.2 * w)}" y="${r22(y - 2.4)}" width="${r22(6.4 * w)}" height="4.8" rx="1.1" ${glass} stroke="${frame}" stroke-width="1"/>`;
          if (forme === "papillon") {
            const o = x < 24 - (se ? 1.4 : 0) ? -1 : 1;
            return `<path d="M${r22(x - 3.2 * w * o)},${r22(y - 1.2)} Q${x},${r22(y - 2.6)} ${r22(x + 3.4 * w * o)},${r22(y - 2.8)} Q${r22(x + 3 * w * o)},${r22(y + 2.6)} ${x},${r22(y + 2.4)} Q${r22(x - 3 * w * o)},${r22(y + 2.2)} ${r22(x - 3.2 * w * o)},${r22(y - 1.2)} Z" ${glass} stroke="${frame}" stroke-width="1"/>`;
          }
          return coeur(x, y + 0.2, 3 * w, mix(col, "#FFFFFF", 0.3), 1).replace(`fill="${mix(col, "#FFFFFF", 0.3)}"`, glass).replace(`stroke="${OUT}"`, `stroke="${frame}"`);
        }, "lens");
        let s = lens(x1, 1) + lens(x2, f) + P(se ? "M20.1,22.4 Q21.2,21.6 22.9,22.4" : "M22.5,22.4 Q24,21.4 25.5,22.4", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${frame}"`) + branches(view, frame);
        if (forme === "soleil") s += L([x1 - 1.4, y - 1.2], [x1 - 0.4, y - 2], "#FFFFFF", 0.7) + L([x2 - 1.2, y - 1.2], [x2 - 0.4, y - 1.8], "#FFFFFF", 0.6);
        return s;
      };
    }
    __name(lunettes, "lunettes");
    var JOUES = { front: [[16.4, 26.4], [31.6, 26.4]], se: [[15.2, 26.4], [28.2, 26.4]] };
    function coeurs(c, { view }, [col]) {
      return view === "ne" ? "" : JOUES[view].map(([x, y], i) => coeur(x, y, i && view === "se" ? 0.75 : 0.9, col, 0.45)).join("");
    }
    __name(coeurs, "coeurs");
    function etoilesJoues(c, { view }, [col]) {
      return view === "ne" ? "" : JOUES[view].map(([x, y], i) => scintille(x, y, i && view === "se" ? 1.1 : 1.35, col)).join("");
    }
    __name(etoilesJoues, "etoilesJoues");
    function pansement(c, { view }, [col]) {
      if (view === "ne") return "";
      const [x, y] = view === "se" ? [15.6, 25.6] : [31, 25.4];
      return `<g transform="rotate(-24 ${x} ${y})"><rect x="${r22(x - 2.4)}" y="${r22(y - 0.95)}" width="4.8" height="1.9" rx="0.9" fill="${col}" stroke="${OUT}" stroke-width="0.6"/><rect x="${r22(x - 0.8)}" y="${r22(y - 0.75)}" width="1.6" height="1.5" rx="0.3" fill="${tone(col, 0.88)}"/>` + [-1.7, 1.5].map((d) => E(x + d, y - 0.25, 0.16, 0.16, tone(col, 0.7), 0) + E(x + d + 0.2, y + 0.35, 0.16, 0.16, tone(col, 0.7), 0)).join("") + "</g>";
    }
    __name(pansement, "pansement");
    var LOBES = { front: [[11.8, 24.6], [36.2, 24.6]], se: [[35.1, 25]] };
    function boucles(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne" || !c.oreillesVisibles) return "";
        return LOBES[view].map(([x, y]) => {
          if (forme === "puces") return E(x, y, 0.75, 0.75, col, 0.5) + E(x - 0.25, y - 0.25, 0.22, 0.22, reflet(col), 0);
          if (forme === "anneaux") return `<circle cx="${x}" cy="${r22(y + 1)}" r="1.25" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r22(y + 1)}" r="1.25" fill="none" stroke="${col}" stroke-width="0.6"/>`;
          return L([x, y], [x, y + 1.6], OUT, 0.5) + etoile(x, y + 2.8, 1.35, col, 0.5);
        }).join("");
      };
    }
    __name(boucles, "boucles");
    var milieu = /* @__PURE__ */ __name((v) => v === "se" ? 21.6 : 24, "milieu");
    function foulard(c, { view }, [col]) {
      if (view === "ne") return P("M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z", col);
      const kx = view === "se" ? 18.6 : 20.8;
      return P("M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z", col) + P(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, col) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(col, 0.8), 0.9);
    }
    __name(foulard, "foulard");
    function echarpe(c, { view }, [col, raie]) {
      const y = reperes(c).cou, uid = c.uid, Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      const band = `M15.2,${Y(-0.4)} Q24,${Y(4.6)} 32.8,${Y(-0.4)} L33.6,${Y(3.2)} Q24,${Y(9)} 14.4,${Y(3.2)} Z`;
      const rayures = /* @__PURE__ */ __name((id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${8 + i * 6}" y="${Y(-10)}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${Y(5)})"/>`).join("")), "rayures");
      let s = "";
      if (view === "ne") {
        const pan3 = `M28,${Y(3.4)} L31.2,${Y(2.8)} L32.6,${Y(13)} L29.2,${Y(13.4)} Z`;
        s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, "none");
        return s + P(pan3, col) + clip(`${uid}p${view}`, pan3, [6, 9.4].map((d) => `<rect x="27" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan3, "none") + [0.7, 1.6, 2.5].map((d) => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join("");
      }
      const ex = view === "se" ? 24.6 : 27.4;
      const pan2 = `M${ex},${Y(3.6)} L${r22(ex + 3)},${Y(3.2)} L${r22(ex + 3.6)},${Y(13.4)} L${r22(ex + 0.2)},${Y(13.8)} Z`;
      s += P(pan2, col) + clip(`${uid}p${view}`, pan2, [6.2, 9.6].map((d) => `<rect x="${r22(ex - 1)}" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan2, "none") + [0.7, 1.6, 2.5].map((d) => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join("");
      s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, "none");
      return s + E(view === "se" ? 22.4 : 24.6, y + 4, 2.4, 1.7, tone(col, 0.9), 0.9);
    }
    __name(echarpe, "echarpe");
    function perles(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), perle = mix(col, "#FFFFFF", 0.62);
      return Array.from({ length: 9 }, (_, i) => {
        const t = i / 8, x = (1 - t) ** 2 * (o - 6.4) + 2 * t * (1 - t) * o + t * t * (o + 6.4), y = (1 - t) ** 2 * 31.6 + 2 * t * (1 - t) * 38.4 + t * t * 31.6;
        return E(x, y, 0.78, 0.78, perle, 0.45) + E(x - 0.25, y - 0.25, 0.22, 0.22, "#FFFFFF", 0);
      }).join("");
    }
    __name(perles, "perles");
    function coquillage(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = 37.6;
      const shell = `M${o},${r22(y + 2.4)} L${r22(o - 2.2)},${r22(y - 0.4)} Q${o},${r22(y - 2.6)} ${r22(o + 2.2)},${r22(y - 0.4)} Z`;
      return P(`M${o - 6},31.4 Q${o},37.8 ${o + 6},31.4`, "none", 0.5) + P(shell, col, 0.6) + [-1.1, 0, 1.1].map((d) => L([o, y + 2.1], [o + d * 1.4, y - 1.1], tone(col, 0.7), 0.4)).join("");
    }
    __name(coquillage, "coquillage");
    function papillon(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = 32.8;
      return P(`M${o},${y} L${r22(o - 3.2)},${r22(y - 1.8)} L${r22(o - 3.2)},${r22(y + 1.8)} Z M${o},${y} L${r22(o + 3.2)},${r22(y - 1.8)} L${r22(o + 3.2)},${r22(y + 1.8)} Z`, col, 0.7) + E(o, y, 0.95, 1.05, tone(col, 0.8), 0.6);
    }
    __name(papillon, "papillon");
    function sacDos(c, ctx, [col]) {
      const { view } = ctx, { sw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere") {
        if (view !== "se") return "";
        const bag = "M28.4,33.2 Q28.6,31.6 31,31.6 L36.6,31.8 Q38.6,32 38.6,34.4 L38.4,44.6 Q38.2,46 36.4,46 L30.4,46 Q28.4,46 28.4,44 Z";
        return P(bag, col) + P("M31,37.4 L38.4,37.6", "none", 0.6);
      }
      if (view === "ne") {
        const bag = "M17.4,35 Q17.4,32.8 20,32.8 L28,32.8 Q30.6,32.8 30.6,35 L30.4,45 Q30.4,46.8 28.4,46.8 L19.6,46.8 Q17.6,46.8 17.6,45 Z";
        return limb([24 - sw + 2.2, 31.6], [19, 34], 1.5, d) + limb([24 + sw - 2.2, 31.6], [29, 34], 1.5, d) + P(bag, col) + P("M17.6,38 Q24,40.6 30.4,38 L30.4,35 Q30.6,32.8 28,32.8 L20,32.8 Q17.4,32.8 17.4,35 Z", d, 0.9) + `<rect x="22.6" y="38.4" width="2.8" height="2.2" rx="0.5" fill="#E8C46A" stroke="${OUT}" stroke-width="0.6"/>` + P("M19.8,42 L28.2,42 L28,45.4 L20,45.4 Z", "none", 0.6);
      }
      return limb([24 - sw + 2.4, 31.4], [24 - sw + 2.8, 40.6], 1.5, d) + limb([24 + sw - 2.4, 31.4], [24 + sw - 2.8 + (view === "se" ? -1 : 0), 40.6], 1.5, d);
    }
    __name(sacDos, "sacDos");
    function besace(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere") return "";
      const strap = view === "ne" ? [[24 - sw + 1.6, 31.8], [24 + hw - 1.4, 44.2]] : [[24 + sw - 1.6, 31.8], [24 - hw + 1.8, 44.2]];
      const bx = view === "ne" ? 24 + hw - 1.2 : 24 - hw + 1.6;
      const bag = `M${r22(bx - 3.6)},42.6 L${r22(bx + 3.6)},42.6 L${r22(bx + 3.4)},48 Q${bx},48.8 ${r22(bx - 3.4)},48 Z`;
      return limb(strap[0], strap[1], 1.3, d) + P(bag, col) + P(`M${r22(bx - 3.6)},42.6 L${r22(bx + 3.6)},42.6 L${r22(bx + 3.5)},45.2 Q${bx},46.4 ${r22(bx - 3.5)},45.2 Z`, d, 0.8) + E(bx, 45.4, 0.6, 0.6, "#E8C46A", 0.5);
    }
    __name(besace, "besace");
    function cape(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere" && view !== "ne") {
        const p = `M${r22(24 - sw - 0.6)},31.4 Q24,29.6 ${r22(24 + sw + 0.6)},31.4 L${r22(24 + hw + 4.2)},52.6 Q24,54.6 ${r22(24 - hw - 4.2)},52.6 Z`;
        return P(p, col) + clip(`${c.uid}cp${view}`, p, `<rect x="0" y="28" width="48" height="30" fill="${d}" opacity="0.55"/>`) + P(p, "none");
      }
      if (ctx.couche === "cou" && view !== "ne") {
        const o = milieu(view);
        return P(`M${r22(o - 5.4)},31 Q${o},33.4 ${r22(o + 5.4)},31`, "none", 1.6).replace(`stroke="${OUT}"`, `stroke="${d}"`) + E(o, 32.6, 1.1, 1.1, "#E8C46A", 0.6);
      }
      if (ctx.couche === "surBras" && view === "ne") {
        const p = `M${r22(24 - sw - 1.2)},31.2 Q24,29.2 ${r22(24 + sw + 1.2)},31.2 Q${r22(24 + sw + 3.4)},34 ${r22(24 + hw + 4.4)},52.6 Q24,54.8 ${r22(24 - hw - 4.4)},52.6 Q${r22(24 - sw - 3.4)},34 ${r22(24 - sw - 1.2)},31.2 Z`;
        return P(p, col) + clip(`${c.uid}cq${view}`, p, [-5, 0, 5].map((x) => L([24 + x * 0.5, 36], [24 + x, 53], d, 0.7)).join("") + `<rect x="27" y="28" width="20" height="30" fill="${d}" opacity="0.35"/>`) + P(p, "none");
      }
      return "";
    }
    __name(cape, "cape");
    function ailes(c, ctx, [col]) {
      const { view } = ctx, light = mix(col, "#FFFFFF", 0.45);
      const wing = "M19.6,36.4 Q10.6,26.6 6.2,31.4 Q4.4,36.6 10.6,38.6 Q8.2,43.6 13.6,44.6 Q17.6,42.4 19.8,38.6 Z";
      const veins = "M18.6,37 Q12,32 7.6,32.6 M18.6,37.6 Q13.4,39 11,38.6 M18.8,38.2 Q16,41.6 14,43.6";
      const one = /* @__PURE__ */ __name((d, v, id) => P(d, col) + clip(id, d, `<path d="${v}" fill="none" stroke="${light}" stroke-width="0.9"/>`) + P(d, "none"), "one");
      if (ctx.couche === "derriere" && view !== "ne") return one(wing, veins, `${c.uid}wl${view}`) + one(mirror(wing), mirror(veins), `${c.uid}wr${view}`);
      if (ctx.couche === "surBras" && view === "ne") {
        const w2 = "M22.4,36 Q12.6,25 7,30.6 Q4.8,36.4 11.4,38.8 Q9,44.4 14.8,45.2 Q19.4,42.6 22.6,38.4 Z";
        const v2 = "M21.4,36.6 Q13.6,31.4 8.4,32 M21.4,37.4 Q14.6,39 11.8,38.8 M21.6,38 Q17.6,42 15.2,44.2";
        return one(w2, v2, `${c.uid}wl${view}`) + one(mirror(w2), mirror(v2), `${c.uid}wr${view}`) + E(24, 37, 1.6, 1.4, tone(col, 0.8), 0.7);
      }
      return "";
    }
    __name(ailes, "ailes");
    function peluche(c, ctx, [col], h) {
      const [x, y] = [h[0] + 0.6, h[1] + 3.6], d = tone(col, 0.82);
      return E(x, y + 2.6, 2.4, 2.6, col) + E(x - 1.9, y - 2.4, 1, 1, col, 0.8) + E(x + 1.9, y - 2.4, 1, 1, col, 0.8) + E(x, y - 0.6, 2.7, 2.4, col) + E(x, y + 0.2, 1.1, 0.8, mix(col, "#FFFFFF", 0.5), 0.5) + E(x, y - 0.1, 0.4, 0.3, OUT, 0) + E(x - 0.9, y - 1.2, 0.32, 0.36, OUT, 0) + E(x + 0.9, y - 1.2, 0.32, 0.36, OUT, 0) + E(x - 1.9, y + 3.6, 0.9, 0.7, d, 0.6) + E(x + 1.9, y + 3.6, 0.9, 0.7, d, 0.6);
    }
    __name(peluche, "peluche");
    function panier(c, ctx, [col], h) {
      const [x, y] = [h[0], h[1] + 4.6];
      const basket = `M${r22(x - 4)},${y} L${r22(x + 4)},${y} L${r22(x + 3.2)},${r22(y + 4.4)} Q${x},${r22(y + 5.2)} ${r22(x - 3.2)},${r22(y + 4.4)} Z`;
      return P(`M${r22(x - 3.4)},${r22(y + 0.2)} Q${x},${r22(y - 6.6)} ${r22(x + 3.4)},${r22(y + 0.2)}`, "none", 1.6).replace(`stroke="${OUT}"`, 'stroke="#8A5A30"') + fleurette(x - 2, y - 0.6, 1.05, col) + fleurette(x + 1.6, y - 0.9, 1.1, mix(col, "#FFFFFF", 0.5)) + feuille(x - 0.2, y - 0.4, -60, 0.9) + P(basket, "#C9925A") + clip(`${c.uid}pn${ctx.view}`, basket, [1.4, 2.8].map((d) => L([x - 4, y + d], [x + 4, y + d], "#9A6A3A", 0.5)).join("") + [-2, 0, 2].map((d) => L([x + d, y], [x + d * 0.85, y + 5], "#9A6A3A", 0.5)).join("")) + P(basket, "none");
    }
    __name(panier, "panier");
    function ombrelle(c, ctx, [col], h) {
      const [x, y] = h, tip = [Math.min(x + 3, 38.6), y - 17.4];
      const canopy = "M-7,0 Q-6.7,-6.2 0,-6.7 Q6.7,-6.2 7,0 Q5.25,-1.2 3.5,0 Q1.75,-1.2 0,0 Q-1.75,-1.2 -3.5,0 Q-5.25,-1.2 -7,0 Z";
      const ribs = [-3.5, 0, 3.5].map((d) => L([d * 0.5, -6.3], [d, -0.2], tone(col, 0.82), 0.5)).join("");
      return limb([x, y + 0.4], tip, 0.7, "#8A5A30") + `<g transform="translate(${r22(tip[0])} ${r22(tip[1] + 1.6)}) rotate(16)">${P(canopy, col)}${ribs}${E(0, -6.9, 0.6, 0.6, tone(col, 0.8), 0.5)}</g>`;
    }
    __name(ombrelle, "ombrelle");
    var balance = /* @__PURE__ */ __name((ctx) => ctx.sway || 0, "balance");
    function pan(c, ctx) {
      const { sw, hw, b, cou: y, hanche, ourlet: H } = reperes(c), w = balance(ctx);
      const mx = (sw + hw) / 2 + b + 0.6;
      return `M${r22(24 - sw - 0.5)},${r22(y + 1.6)} Q24,${r22(y - 1.2)} ${r22(24 + sw + 0.5)},${r22(y + 1.6)} Q${r22(24 + mx)},${r22(y + 8.8)} ${r22(24 + hw + 0.9)},${r22(hanche + 0.9)} L${r22(24 + hw + 2.4 + w)},${H} Q${r22(24 + w)},${r22(H + 1.8)} ${r22(24 - hw - 2.4 + w)},${H} L${r22(24 - hw - 0.9)},${r22(hanche + 0.9)} Q${r22(24 - mx)},${r22(y + 8.8)} ${r22(24 - sw - 0.5)},${r22(y + 1.6)} Z`;
    }
    __name(pan, "pan");
    function panPeint(c, ctx, id, col, S, reflets = "") {
      const { view } = ctx, d = pan(c, ctx), { sw, cou: y, ourlet: H } = reperes(c);
      const ombre = `<rect x="${view === "se" ? 25.4 : 27.2}" y="${r22(y - 1.8)}" width="16" height="30" fill="${S}"/><path d="M6,${r22(H - 1.6)} Q24,${r22(H + 1.4)} 42,${r22(H - 1.6)} L42,${r22(H + 4)} L6,${r22(H + 4)} Z" fill="${S}"/>`;
      const clair = view === "ne" ? "" : `<rect x="${r22(24 - sw + 0.6)}" y="${r22(y + 3.6)}" width="1.3" height="10" rx="0.6" fill="${tone(col, 1.28)}"/>`;
      return P(d, col) + clip(`${c.uid}${id}${view}`, d, ombre + clair + reflets) + P(d, "none");
    }
    __name(panPeint, "panPeint");
    function poches(c, { view }, S) {
      const { hw, hanche } = reperes(c), se = view === "se";
      const one = /* @__PURE__ */ __name((x, l) => P(`M${r22(x)},${r22(hanche + 1.1)} L${r22(x + l)},${r22(hanche + 1.1)} L${r22(x + l - 0.2)},${r22(hanche + 2.7)} L${r22(x + 0.2)},${r22(hanche + 2.7)} Z`, S, 0.6), "one");
      return one(24 - hw - 0.4 - (se ? 0.6 : 0), 4.4) + one(24 + hw - (se ? 3.4 : 4), se ? 3 : 4.4);
    }
    __name(poches, "poches");
    function colFourrure(o, view, col, y) {
      const S = tone(col, 0.86), Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      if (view === "ne") {
        return P(`M15.4,${Y(0)} Q24,${Y(3.2)} 32.6,${Y(0)} L33.2,${Y(2.4)} Q24,${Y(6.2)} 14.8,${Y(2.4)} Z`, col, 0.9) + P(`M17.4,${Y(2.8)} Q24,${Y(5.2)} 30.6,${Y(2.8)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
      }
      const pts = Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        return [(1 - t) ** 2 * (o + 8.4) + 2 * t * (1 - t) * o + t * t * (o - 8.4), (1 - t) ** 2 * (y + 1.8) + 2 * t * (1 - t) * (y + 8.4) + t * t * (y + 1.8)];
      });
      let d = `M${r22(o - 6.8)},${Y(-0.2)} Q${o},${Y(3)} ${r22(o + 6.8)},${Y(-0.2)} L${r22(pts[0][0])},${r22(pts[0][1])}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        d += ` Q${r22((x0 + x1) / 2)},${r22((y0 + y1) / 2 + 1.5)} ${r22(x1)},${r22(y1)}`;
      }
      d += " Z";
      return P(d, col, 0.9) + P(`M${r22(o - 5)},${Y(3.4)} Q${o},${Y(6.4)} ${r22(o + 5)},${Y(3.4)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
    }
    __name(colFourrure, "colFourrure");
    var BOIS = "#D9B27C";
    function manteau(c, ctx, [col, fourrure]) {
      if (ctx.couche !== "dessus") return "";
      const { view } = ctx, { cou: y, ourlet: H } = reperes(c), S = tone(col, 0.8), w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      let s = panPeint(c, ctx, "mt", col, S);
      if (view === "ne") {
        s += P(`M24,${Y(3)} L${r22(24 + w * 0.6)},${r22(H - 3.6)}`, "none", 0.5) + P(`M${r22(24 + w * 0.6)},${r22(H - 3.6)} L${r22(24 + w)},${r22(H + 0.6)}`, "none", 0.8) + `<rect x="19.2" y="${Y(10.8)}" width="9.6" height="1.8" rx="0.8" fill="${S}" stroke="${OUT}" stroke-width="0.7"/>` + E(20.5, y + 11.7, 0.55, 0.55, BOIS, 0.45) + E(27.5, y + 11.7, 0.55, 0.55, BOIS, 0.45);
        return s + colFourrure(24, view, fourrure, y);
      }
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      s += P(`M${r22(o + 1.2)},${Y(3.6)} L${r22(o + 1.2 + w)},${r22(H + 0.8)}`, "none", 0.8);
      for (const d of [6.2, 9.6, 13]) {
        const yy = y + d, x = o + 1.2 + w * (yy - sh) / (H - sh);
        s += L([x - 2.6, yy], [x + 2.6, yy], tone(col, 0.55), 0.55) + `<rect x="${r22(x - 1.5)}" y="${r22(yy - 0.55)}" width="3" height="1.1" rx="0.55" fill="${BOIS}" stroke="${OUT}" stroke-width="0.5"/>`;
      }
      return s + poches(c, ctx, S) + colFourrure(o, view, fourrure, y);
    }
    __name(manteau, "manteau");
    function cire(c, ctx, [col]) {
      const { view } = ctx, S = tone(col, 0.82), R = reperes(c);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R, col, S);
      if (ctx.couche !== "dessus") return "";
      const { cou: y, ourlet: H, sw, hw, hanche } = R, w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      const gl = "rgba(255,255,255,.55)";
      const reflets = view === "ne" ? L([24 - sw + 2.2, y + 4.2], [24 - sw + 1.8, y + 8.8], gl, 0.9) : L([24 - sw + 3, y + 4.6], [24 - sw + 2.6, y + 9.2], gl, 0.9) + L([24 - hw + 0.6, hanche + 2.5], [24 - hw + 0.2 + w, hanche + 4.9], gl, 0.8);
      let s = panPeint(c, ctx, "cr", col, S, reflets);
      if (view === "ne") return s + P(`M24,${Y(9.2)} L${r22(24 + w)},${r22(H + 0.6)}`, "none", 0.5) + capucheRabattue(c.uid, view, R, col, S);
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      if ((c.o.accessoires.dessus || {}).ouvert) {
        const coin = `M${r22(o - 2.6)},${Y(2)} L${r22(o + 2.6)},${Y(2)} L${r22(o + 3 + w)},${r22(H + 2)} L${r22(o - 3 + w)},${r22(H + 2)} Z`;
        s = `<clipPath id="${c.uid}cro${view}"><path d="M0,0 L48,0 L48,64 L0,64 Z ${coin}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c.uid}cro${view})">${s}</g>`;
        s += P(`M${r22(o - 2.6)},${Y(2)} L${r22(o - 3 + w)},${r22(H + 0.4)} M${r22(o + 2.6)},${Y(2)} L${r22(o + 3 + w)},${r22(H + 0.4)}`, "none");
        s += [6, 10, 14].map((d) => y + d).filter((yy) => yy < H - 2).map((yy) => E(o - 4.2 + w * (yy - sh) / (H - sh), yy, 0.55, 0.55, tone(col, 0.5), 0.4)).join("");
        s += P(`M${r22(o - 6.4)},${Y(0.8)} L${r22(o - 2.4)},${Y(4.4)} L${r22(o - 3.6)},${Y(5.8)} Z`, col, 0.8) + P(`M${r22(o + 6.4)},${Y(0.8)} L${r22(o + 2.4)},${Y(4.4)} L${r22(o + 3.6)},${Y(5.8)} Z`, S, 0.8);
        return s + poches(c, ctx, S);
      }
      s += P(`M${r22(o + 0.8)},${Y(3)} L${r22(o + 0.8 + w)},${r22(H + 0.8)}`, "none", 0.9);
      s += [5.6, 9.2, 12.8, 16.4].map((d) => y + d).filter((yy) => yy < H - 1.4).map((yy) => E(o + 2.2 + w * (yy - sh) / (H - sh), yy, 0.6, 0.6, tone(col, 0.5), 0.4)).join("");
      s += P(`M${r22(o - 5.2)},${Y(0.4)} L${r22(o + 0.4)},${Y(4.6)} L${r22(o - 1.6)},${Y(6)} Z`, col, 0.8) + P(`M${r22(o + 5.2)},${Y(0.4)} L${r22(o + 0.4)},${Y(4.6)} L${r22(o + 2.4)},${Y(6)} Z`, S, 0.8);
      return s + poches(c, ctx, S);
    }
    __name(cire, "cire");
    function chale(c, { view }, [col, frange]) {
      const { cou: y, e } = reperes(c), uid = c.uid, Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      const S = tone(col, 0.82), L0 = r22(24 - e - 3.6), R0 = r22(24 + e + 3.6);
      const tricot = /* @__PURE__ */ __name(() => [0, 1, 2, 3, 4, 5].map((i) => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join("") + [0, 1, 2, 3, 4, 5].map((i) => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join(""), "tricot");
      if (view === "ne") {
        const d2 = `M${L0},${Y(5.4)} Q${r22(24 - e - 1)},${Y(0.4)} 24,${Y(-0.2)} Q${r22(24 + e + 1)},${Y(0.4)} ${R0},${Y(5.4)} Q${r22(R0 + 0.2)},${Y(8.4)} ${r22(R0 - 1.2)},${Y(9.6)} L24,${Y(17.6)} L${r22(L0 + 1.2)},${Y(9.6)} Q${r22(L0 - 0.2)},${Y(8.4)} ${L0},${Y(5.4)} Z`;
        return P(d2, col) + clip(`${uid}ch${view}`, d2, tricot() + `<rect x="25.6" y="${Y(-2)}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P(d2, "none") + [-1.6, -0.5, 0.6, 1.7].map((dx) => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join("");
      }
      const o = view === "se" ? 22 : 24;
      const d = `M${r22(o - 5.6)},${Y(0.6)} L${o},${Y(8.6)} L${r22(o + 5.6)},${Y(0.6)} Q${r22(R0 - 2.4)},${Y(1.4)} ${R0},${Y(4.6)} Q${r22(R0 + 0.6)},${Y(7.6)} ${r22(R0 - 0.2)},${Y(10)} Q${r22(o + 6)},${Y(11.4)} ${r22(o + 1.6)},${Y(10.2)} L${o},${Y(11.6)} L${r22(o - 1.6)},${Y(10.2)} Q${r22(o - 6)},${Y(11.4)} ${r22(L0 + 0.2)},${Y(10)} Q${r22(L0 - 0.6)},${Y(7.6)} ${L0},${Y(4.6)} Q${r22(L0 + 2.4)},${Y(1.4)} ${r22(o - 5.6)},${Y(0.6)} Z`;
      let s = P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${r22(o + 3.4)}" y="${Y(-2)}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none");
      const pan2 = /* @__PURE__ */ __name((dx, sg) => `M${r22(o + dx)},${Y(10.4)} L${r22(o + dx + sg * 2.4)},${Y(10.6)} L${r22(o + dx + sg * 2.8)},${Y(15)} L${r22(o + dx + sg * 0.4)},${Y(15.2)} Z`, "pan");
      s += P(pan2(0.2, 1), S) + P(pan2(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
      return s + [0.6, 1.5, 2.4].map((t) => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join("");
    }
    __name(chale, "chale");
    function pelerine(c, ctx, [col, bord]) {
      const { view } = ctx, R = reperes(c), { cou: y, e } = R, S = tone(col, 0.8);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R, col, S);
      const L0 = r22(24 - e - 3.8), R0 = r22(24 + e + 3.8), B = r22(y + 10.6), Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      const d = `M${r22(24 - e - 0.4)},${Y(0.8)} Q24,${Y(-1.4)} ${r22(24 + e + 0.4)},${Y(0.8)} Q${r22(R0 - 0.6)},${Y(3)} ${R0},${B} Q24,${r22(B + 3.4)} ${L0},${B} Q${r22(L0 + 0.6)},${Y(3)} ${r22(24 - e - 0.4)},${Y(0.8)} Z`;
      let s = P(d, col) + clip(`${c.uid}pl${view}`, d, `<rect x="${view === "se" ? 25.4 : 27.2}" y="${Y(-2)}" width="18" height="18" fill="${S}"/><path d="M0,${r22(B - 1.2)} Q24,${r22(B + 2.2)} 48,${r22(B - 1.2)} L48,${r22(B + 6)} L0,${r22(B + 6)} Z" fill="${bord}"/>` + [-10, -6, -2, 2, 6, 10].map((x) => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join("")) + P(d, "none");
      if (view === "ne") s += capucheRabattue(`${c.uid}pl`, view, R, col, S);
      return s;
    }
    __name(pelerine, "pelerine");
    function etole(c, { view }, [col]) {
      const { cou: y, e } = reperes(c), S = tone(col, 0.84), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6, B = y + (view === "ne" ? 9.4 : 7.6), n = 6;
      const festons = /* @__PURE__ */ __name((x0, x1, yb) => {
        let d2 = "";
        const l = (x1 - x0) / n;
        for (let i = n - 1; i >= 0; i--) d2 += ` Q${r22(x0 + l * (i + 0.5))},${r22(yb + 1.6)} ${r22(x0 + l * i)},${r22(yb)}`;
        return d2;
      }, "festons");
      const d = `M${r22(24 - e - 0.4)},${r22(y + 0.6)} Q24,${r22(y - 1.8)} ${r22(24 + e + 0.4)},${r22(y + 0.6)} Q${r22(R0 - 0.6)},${r22(y + 2)} ${r22(R0)},${r22(B)}${festons(L0, R0, B)} Q${r22(L0 + 0.6)},${r22(y + 2)} ${r22(24 - e - 0.4)},${r22(y + 0.6)} Z`;
      const touffes = [-9, -5, -1, 3, 7, 10].map((dx, i) => `<path d="M${r22(24 + dx - 1)},${r22(y + 3 + i % 2 * 2)} q1,1.2 2,0" fill="none" stroke="${S}" stroke-width="0.6" stroke-linecap="round"/>`).join("");
      return P(d, col, 0.9) + clip(`${c.uid}et${view}`, d, touffes + `<rect x="${view === "se" ? 25.6 : 27.4}" y="${r22(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none", 0.9);
    }
    __name(etole, "etole");
    function botte(fourree) {
      return (c, ctx, [col, fourrure], [x, y, dir, tilt]) => {
        const w = c.legW + 1.4, top = Math.max(y - 5.4, c.hip + 0.4), S = tone(col, 0.76);
        let s = `<rect x="${r22(x - w / 2)}" y="${r22(top)}" width="${r22(w)}" height="${r22(y - top + 1.6)}" rx="1.3" fill="${col}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r22(x + w / 2 - 1.8)}" y="${r22(top + 0.8)}" width="1.1" height="${r22(y - top)}" rx="0.5" fill="${S}"/>`;
        if (!fourree) {
          s += `<rect x="${r22(x - w / 2 + 0.9)}" y="${r22(top + 1.8)}" width="0.9" height="${r22(Math.max(0.8, y - top - 2.4))}" rx="0.45" fill="rgba(255,255,255,.6)"/><rect x="${r22(x - w / 2)}" y="${r22(top)}" width="${r22(w)}" height="1.5" rx="0.7" fill="${tone(col, 0.82)}" stroke="${OUT}" stroke-width="0.8"/>`;
        }
        s += shoe({ ...c, uid: `${c.uid}b`, shoe: col, shoeS: tone(col, 0.68), shoeH: fourree ? tone(col, 1.22) : "rgba(255,255,255,.75)" }, x, y, dir, tilt);
        if (fourree) {
          const a = x - w / 2 - 0.8, b = x + w / 2 + 0.8, t0 = top - 1.2, t1 = top + 1.6, l = (b - a) / 3;
          let d = `M${r22(a)},${r22(t1)} Q${r22(a - 0.3)},${r22(t0 + 0.5)} ${r22(a + 0.9)},${r22(t0)} Q${r22(x)},${r22(t0 - 0.6)} ${r22(b - 0.9)},${r22(t0)} Q${r22(b + 0.3)},${r22(t0 + 0.5)} ${r22(b)},${r22(t1)}`;
          for (let i = 2; i >= 0; i--) d += ` Q${r22(a + l * (i + 0.5))},${r22(t1 + 1.1)} ${r22(a + l * i)},${r22(t1)}`;
          s += P(`${d} Z`, fourrure, 0.8) + [0.3, 0.7].map((f) => P(`M${r22(a + (b - a) * f - 0.7)},${r22(t0 + 1)} q0.7,0.9 1.4,0`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(fourrure, 0.82)}"`)).join("");
        }
        return s;
      };
    }
    __name(botte, "botte");
    var PORTE = {
      manteau: /* @__PURE__ */ __name(([col, fourrure]) => ({ sleeve: col, cuff: fourrure, sleeves: void 0 }), "manteau"),
      cire: /* @__PURE__ */ __name(([col]) => ({ sleeve: col, cuff: tone(col, 0.82), sleeves: void 0 }), "cire"),
      moufles: /* @__PURE__ */ __name(([col, revers], c) => ({ hand: col, moufle: true, ...c.sleeves ? {} : { cuff: revers } }), "moufles")
    };
    function tricorne(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), S = tone(col, 0.7), H = tone(col, 1.35), galon = mix(col, "#F2D58A", 0.75);
      const XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const calotte = `M${X(12.2)},14 Q${X(11.4)},5 ${X(24)},4.8 Q${XD(36.6)},5 ${XD(35.8)},14 Z`;
      const bord = view === "ne" ? `M${X(8.6)},12.4 Q${X(10.6)},11 ${X(13)},12.2 Q${X(24)},9.4 ${X(35)},12.2 Q${X(37.4)},11 ${X(39.4)},12.4 Q${X(37)},16.4 ${X(24)},16 Q${X(11)},16.4 ${X(8.6)},12.4 Z` : `M${X(8.4)},12.6 Q${X(10.4)},11 ${X(12.8)},12.2 Q${X(18)},9.2 ${X(24)},10.2 Q${X(30)},9.2 ${X(35.2)},12.2 Q${X(37.6)},11 ${X(39.6)},12.6 Q${X(38)},15.6 ${X(31.4)},15.4 Q${X(26.6)},15.6 ${X(24)},17.8 Q${X(21.4)},15.6 ${X(16.6)},15.4 Q${X(10)},15.6 ${X(8.4)},12.6 Z`;
      const liseret = view === "ne" ? `M${X(9.4)},12.6 Q${X(11)},11.8 ${X(13)},12.8 Q${X(24)},10.2 ${X(35)},12.8 Q${X(37)},11.8 ${X(38.6)},12.6` : `M${X(9.2)},12.7 Q${X(10.8)},11.7 ${X(12.9)},12.8 Q${X(18)},10 ${X(24)},11 Q${X(30)},10 ${X(35.1)},12.8 Q${X(37.2)},11.7 ${X(38.8)},12.7`;
      return P(calotte, S) + clip(`${c.uid}tc${view}`, calotte, `<ellipse cx="${X(20)}" cy="7.4" rx="5" ry="2.2" fill="${col}"/>`) + P(calotte, "none") + P(bord, col) + clip(`${c.uid}tb${view}`, bord, `<rect x="${X(27)}" y="8" width="14" height="10" fill="${S}" opacity=".8"/>`) + P(bord, "none") + `<path d="${liseret}" fill="none" stroke="${galon}" stroke-width=".9" stroke-linecap="round"/>` + L([X(14.6), 11.6], [X(19), 10.4], H, 0.8) + (view === "ne" ? "" : E(X(24), 13.2, 1.2, 1.2, galon, 0.6));
    }
    __name(tricorne, "tricorne");
    function hautForme(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), S = tone(col, 0.68), H = tone(col, 1.45), ruban = tone(col, 0.5);
      const XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const tube = `M${X(13)},14.6 Q${X(13.6)},9 ${X(14.4)},4.6 Q${X(24)},3.7 ${XD(33.6)},4.6 Q${XD(34.4)},9 ${XD(35)},14.6 Z`;
      const dessus = `M${X(14.4)},4.6 Q${X(24)},3.7 ${XD(33.6)},4.6 Q${X(24)},6.1 ${X(14.4)},4.6 Z`;
      const bord = `M${X(8.8)},14.6 Q${X(9.6)},12.4 ${X(12.6)},13.8 Q${X(24)},15.8 ${XD(35.4)},13.8 Q${XD(38.4)},12.4 ${XD(39.2)},14.6 Q${XD(37.6)},17.9 ${X(24)},17.9 Q${X(10.4)},17.9 ${X(8.8)},14.6 Z`;
      return P(tube, col) + clip(`${c.uid}hf${view}`, tube, `<rect x="${X(28)}" y="3" width="8" height="13" fill="${S}"/><rect x="${X(12)}" y="11" width="24" height="3.2" fill="${ruban}"/><rect x="${X(17.4)}" y="5" width="1.6" height="6" fill="${H}" opacity=".7"/>`) + P(tube, "none") + P(dessus, S, 0.6) + P(bord, col) + clip(`${c.uid}hb${view}`, bord, `<rect x="${X(28)}" y="12" width="12" height="7" fill="${S}"/>`) + P(bord, "none") + L([X(11), 14.6], [X(15.4), 15.5], H, 0.6);
    }
    __name(hautForme, "hautForme");
    function monocle(c, { view }, [col]) {
      if (view === "ne") return "";
      const se = view === "se";
      const x = se ? 25.2 : 28.6, y = 22.6, H = tone(col, 1.45), S = tone(col, 0.7);
      const chaine = se ? `M${r22(x + 0.6)},25.5 Q${r22(x + 1.8)},28.6 ${r22(x + 1)},32` : `M${r22(x + 1.4)},25.4 Q${r22(x + 3)},28.4 ${r22(x + 2.2)},32.2`;
      return `<path d="${chaine}" fill="none" stroke="${S}" stroke-width=".5" stroke-dasharray=".7 .45" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3.1" fill="rgba(210,236,255,.28)" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="3.1" fill="none" stroke="${col}" stroke-width=".7"/><path d="M${r22(x - 2.2)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y - 2.1)} ${r22(x - 0.2)},${r22(y - 2.4)}" fill="none" stroke="#FFFFFF" stroke-width=".55" opacity=".85" stroke-linecap="round"/>` + E(x + 1.6, y + 1.7, 0.35, 0.35, H, 0);
    }
    __name(monocle, "monocle");
    function cravate(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = reperes(c).cou + 3.4, S = tone(col, 0.72), H = tone(col, 1.3), raie = mix(col, "#FFFFFF", 0.45);
      const noeud2 = `M${r22(o - 1.6)},${r22(y)} L${r22(o + 1.6)},${r22(y)} L${r22(o + 1.1)},${r22(y + 2.2)} L${r22(o - 1.1)},${r22(y + 2.2)} Z`;
      const lame = `M${r22(o - 1.1)},${r22(y + 2)} L${r22(o + 1.1)},${r22(y + 2)} L${r22(o + 2)},${r22(y + 9.6)} L${o},${r22(y + 11.4)} L${r22(o - 2)},${r22(y + 9.6)} Z`;
      return P(lame, col) + clip(`${c.uid}cv${view}`, lame, `<rect x="${o}" y="${r22(y)}" width="3" height="12" fill="${S}"/>` + [3.6, 6.4, 9.2].map((d) => `<path d="M${r22(o - 3)},${r22(y + d)} L${r22(o + 3)},${r22(y + d - 1.6)}" stroke="${raie}" stroke-width=".55"/>`).join("")) + P(lame, "none") + P(noeud2, S) + L([o - 0.8, y + 0.5], [o - 0.1, y + 0.4], H, 0.45);
    }
    __name(cravate, "cravate");
    function medaille(c, { view }, [col, metal]) {
      if (view === "ne") return "";
      const o = milieu(view) + (view === "se" ? -1.2 : -2.6), y = reperes(c).cou + 5, H = tone(metal, 1.45), S = tone(metal, 0.7);
      const ruban = `M${r22(o - 1.3)},${r22(y)} L${r22(o + 1.3)},${r22(y)} L${r22(o + 1)},${r22(y + 3.2)} L${r22(o - 1)},${r22(y + 3.2)} Z`;
      return P(ruban, col, 0.6) + `<rect x="${r22(o - 0.3)}" y="${r22(y)}" width=".6" height="3.2" fill="${mix(col, "#FFFFFF", 0.55)}"/>` + E(o, y + 5, 2, 2, metal, 0.8) + E(o, y + 5, 1.35, 1.35, S, 0) + etoile(o, y + 5, 1.15, H, 0) + E(o - 0.8, y + 4.2, 0.45, 0.35, "#FFFFFF", 0);
    }
    __name(medaille, "medaille");
    function cicatrice(c, { view }, [col]) {
      if (view === "ne") return "";
      const [x, y] = view === "se" ? [15.6, 21.2] : [18.6, 21];
      const pale = mix(col, "#FFFFFF", 0.25), S = tone(col, 0.7);
      return `<path d="M${r22(x - 1.2)},${r22(y - 3.4)} L${r22(x + 1.4)},${r22(y + 3)}" stroke="${S}" stroke-width="1.15" stroke-linecap="round"/><path d="M${r22(x - 1.2)},${r22(y - 3.4)} L${r22(x + 1.4)},${r22(y + 3)}" stroke="${pale}" stroke-width=".55" stroke-linecap="round"/>` + [-1.6, 0, 1.6].map((d) => L([x + d * 0.4 - 0.9, y + d + 0.35], [x + d * 0.4 + 0.9, y + d - 0.35], S, 0.4)).join("");
    }
    __name(cicatrice, "cicatrice");
    function pipe(c, ctx, [col, metal], h) {
      const [x, y] = [h[0] + 0.6, h[1] - 1.2], S = tone(col, 0.7), H = tone(col, 1.35);
      const fourneau = `M${r22(x + 0.4)},${r22(y - 3.4)} L${r22(x + 3.6)},${r22(y - 3.4)} Q${r22(x + 3.8)},${r22(y + 0.4)} ${r22(x + 2)},${r22(y + 0.6)} Q${r22(x + 0.2)},${r22(y + 0.4)} ${r22(x + 0.4)},${r22(y - 3.4)} Z`;
      return `<path d="M${r22(x + 0.6)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y + 0.2)} ${r22(x - 3.2)},${r22(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M${r22(x + 0.6)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y + 0.2)} ${r22(x - 3.2)},${r22(y - 1.6)}" fill="none" stroke="${metal}" stroke-width=".85" stroke-linecap="round"/>` + P(fourneau, col, 0.8) + clip(`${c.uid}pp${ctx.view}`, fourneau, `<rect x="${r22(x + 2.2)}" y="${r22(y - 4)}" width="2" height="5" fill="${S}"/>`) + E(x + 2, y - 3.4, 1.5, 0.5, "#3A2416", 0.5) + E(x + 2, y - 3.5, 0.8, 0.25, "#E8743A", 0) + L([x + 0.9, y - 2.6], [x + 0.9, y - 0.8], H, 0.45) + `<path d="M${r22(x + 2)},${r22(y - 4.4)} Q${r22(x + 1)},${r22(y - 6)} ${r22(x + 2.2)},${r22(y - 7.4)} Q${r22(x + 3.2)},${r22(y - 8.8)} ${r22(x + 2.2)},${r22(y - 10)}" fill="none" stroke="#E8EEF2" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`;
    }
    __name(pipe, "pipe");
    function canne(c, ctx, [col, metal], h) {
      const [x, y] = h, S = tone(col, 0.7), H = tone(col, 1.45);
      const fut = `M${r22(x + 0.2)},${r22(y - 1)} L${r22(x + 3)},${r22(y + 9.6)}`;
      return `<path d="${fut}" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="${fut}" stroke="${col}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r22(x + 0.5)},${r22(y - 0.6)} L${r22(x + 2.9)},${r22(y + 8.6)}" stroke="${H}" stroke-width=".35" stroke-linecap="round" opacity=".8"/><path d="M${r22(x + 0.2)},${r22(y - 1)} Q${r22(x - 0.6)},${r22(y - 4)} ${r22(x - 3)},${r22(y - 3.4)} Q${r22(x - 4.4)},${r22(y - 2.8)} ${r22(x - 4)},${r22(y - 1.4)}" fill="none" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="M${r22(x + 0.2)},${r22(y - 1)} Q${r22(x - 0.6)},${r22(y - 4)} ${r22(x - 3)},${r22(y - 3.4)} Q${r22(x - 4.4)},${r22(y - 2.8)} ${r22(x - 4)},${r22(y - 1.4)}" fill="none" stroke="${S}" stroke-width="1.1" stroke-linecap="round"/>` + E(x + 0.3, y - 0.6, 0.9, 0.55, metal, 0.5) + E(x + 3, y + 9.8, 0.8, 0.5, metal, 0.5);
    }
    __name(canne, "canne");
    var DESSINS = {
      bonnet: { tete: bonnet },
      cacheOreilles: { cheveux: arceau, tete: cacheOreilles },
      paille: { tete: paille },
      casquette: { tete: casquette },
      bandana: { tete: bandana },
      couronneFleurs: { tete: couronneFleurs },
      beret: { tete: beret },
      oreillesChat: { tete: oreillesChat },
      oreillesLapin: { tete: oreillesLapin },
      diademe: { tete: diademe },
      noeud: { cheveux: noeud },
      barrettes: { cheveux: barrettes },
      fleur: { cheveux: fleur },
      etoile: { cheveux: etoileCheveux },
      lunettesRondes: { visage: lunettes("rondes") },
      lunettesCarrees: { visage: lunettes("carrees") },
      lunettesPapillon: { visage: lunettes("papillon") },
      lunettesSoleil: { visage: lunettes("soleil") },
      lunettesCoeur: { visage: lunettes("coeur") },
      coeurs: { joues: coeurs },
      etoiles: { joues: etoilesJoues },
      pansement: { joues: pansement },
      puces: { oreilles: boucles("puces") },
      anneaux: { oreilles: boucles("anneaux") },
      pendantsEtoile: { oreilles: boucles("etoile") },
      foulard: { cou: foulard },
      echarpe: { cou: echarpe },
      perles: { cou: perles },
      coquillage: { cou: coquillage },
      papillon: { cou: papillon },
      sacDos: { derriere: sacDos, cou: sacDos },
      besace: { cou: besace },
      cape: { derriere: cape, cou: cape, surBras: cape },
      ailes: { derriere: ailes, surBras: ailes },
      peluche: { main: peluche },
      panier: { main: panier },
      ombrelle: { main: ombrelle },
      tricorne: { tete: tricorne },
      hautForme: { tete: hautForme },
      monocle: { visage: monocle },
      cravate: { cou: cravate },
      medaille: { cou: medaille },
      cicatrice: { joues: cicatrice },
      pipe: { main: pipe },
      canne: { main: canne },
      manteau: { dessus: manteau },
      cire: { derriere: cire, dessus: cire },
      bottesPluie: { pieds: botte(false) },
      bottesFourrees: { pieds: botte(true) },
      chale: { surBras: chale },
      pelerine: { derriere: pelerine, surBras: pelerine },
      etole: { surBras: etole }
    };
    function couche(c, nom, ctx, extra) {
      let s = "";
      for (const [place, a] of Object.entries(c.o.accessoires)) {
        const f = DESSINS[a.id] && DESSINS[a.id][nom];
        if (f) s += f(c, { ...ctx, couche: nom }, c.acc[place], extra);
      }
      return s;
    }
    __name(couche, "couche");
    function habiller(m, objets, suffixe) {
      const c = { ...m, uid: `${m.uid}${suffixe}`, o: { accessoires: {} }, acc: {} };
      for (const [place, { id, couleurs, ...options }] of Object.entries(objets)) {
        c.o.accessoires[place] = { id, ...options };
        c.acc[place] = couleurs;
      }
      const puis = /* @__PURE__ */ __name((f, nom) => function(cc, ctx) {
        return (f ? f.call(this, cc, ctx) : "") + couche(cc, nom, ctx);
      }, "puis");
      Object.assign(c, { backItems: puis(m.backItems, "derriere"), body: puis(m.body, "dessus"), neck: puis(m.neck, "cou"), overArms: puis(m.overArms, "surBras") });
      if (objets.tete || objets.cheveux) c.coiffe = (cc, ctx, nom) => couche(cc, nom, ctx);
      for (const place of ["dessus", "mains"]) {
        const a = objets[place];
        if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](a.couleurs, c));
      }
      if (objets.pieds) c.foot = (cc, x, y, dir, tilt) => couche(cc, "pieds", {}, [x, y, dir, tilt]);
      return c;
    }
    __name(habiller, "habiller");
    module.exports = { DESSINS, PORTE, couche, reperes, capucheRabattue, habiller };
  }
});

// personnages/aster.js
var require_aster = __commonJS({
  "personnages/aster.js"(exports, module) {
    var { P, E, L, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var relevee = /* @__PURE__ */ __name((c) => !!(c.coiffe && c.coiffe.capuche), "relevee");
    var C = {
      skin: "#F2C9A0",
      skinS: "#DDA982",
      hair: "#B94E3A",
      hairS: "#8E3328",
      hairH: "#DE7A57",
      coat: "#F2C04B",
      coatS: "#CC9A2F",
      coatH: "#FFE49A",
      scarf: "#C8463A",
      scarfS: "#9A2F28",
      brass: "#C9A24A",
      brassS: "#8E6E2C",
      brassH: "#F0D58A",
      cheek: "#F29E9A",
      freckle: "#C97B5A",
      mouth: "#7A3B30"
    };
    function spyglass(x, y, rot, len = 9) {
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})"><rect x="-1.5" y="${-len / 2}" width="3" height="${len}" rx="0.8" fill="${C.brass}" stroke="#3C2819" stroke-width="0.9"/><rect x="-1.1" y="${-len / 2 + 0.6}" width="0.8" height="${len - 1.2}" rx="0.4" fill="${C.brassH}"/><rect x="-1.95" y="${-len / 2 - 0.4}" width="3.9" height="2.1" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.8"/><line x1="-1.5" y1="0.8" x2="1.5" y2="0.8" stroke="${C.brassS}" stroke-width="0.7"/></g>`;
    }
    __name(spyglass, "spyglass");
    function heldGlass(x, y, rot, ext) {
      const seg = [[2.2, 1.15, C.brassS], [1.2 + 3 * ext, 1.5, C.brass], [4.8, 1.9, C.brass]];
      let s = "", x0 = 0;
      for (const [len, h, fill] of seg) {
        s += `<rect x="${r22(x0 - len)}" y="${-h}" width="${r22(len)}" height="${2 * h}" rx="0.5" fill="${fill}" stroke="#3C2819" stroke-width="0.9"/><rect x="${r22(x0 - len + 0.5)}" y="${r22(-h + 0.4)}" width="${r22(Math.max(len - 1, 0.2))}" height="0.6" rx="0.3" fill="${C.brassH}"/>`;
        x0 -= len;
      }
      s += `<rect x="${r22(x0 - 1.6)}" y="-2.35" width="2" height="4.7" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.9"/>`;
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">${s}</g>`;
    }
    __name(heldGlass, "heldGlass");
    var twinkle = /* @__PURE__ */ __name((x, y, r) => P(`M${x},${r22(y - r)} Q${r22(x + r * 0.2)},${r22(y - r * 0.2)} ${r22(x + r)},${y} Q${r22(x + r * 0.2)},${r22(y + r * 0.2)} ${x},${r22(y + r)} Q${r22(x - r * 0.2)},${r22(y + r * 0.2)} ${r22(x - r)},${y} Q${r22(x - r * 0.2)},${r22(y - r * 0.2)} ${x},${r22(y - r)} Z`, "#FFF6C8", 0.6), "twinkle");
    var COAT = "M15.5,32.5 Q24,29.8 32.5,32.5 L35,47.5 Q24,51 13,47.5 Z";
    var aster = {
      name: "Aster",
      uid: "as",
      teintes: [C.hair, C.coat, C.scarf, C.brass],
      skin: C.skin,
      sleeve: C.coat,
      cuff: null,
      armW: 3.9,
      leg: "#2F5684",
      legS: "#22416A",
      legW: 5.4,
      hip: 44.5,
      ground: 56.5,
      shoe: "#5E3A22",
      shoeS: "#43281A",
      shoeH: "#80583A",
      legX: { front: [20.5, 27.5], se: [20, 27.6], ne: [21, 28] },
      shoulders: [[16, 34], [32, 34]],
      hands: [[14.2, 45.2], [33.8, 45.2]],
      action: ["avant_longuevue", "se"],
      // derrière le corps : capuche (face, trois quarts) ; longue-vue (de dos)
      backItems(c, { view }) {
        if (view === "ne") return spyglass(15.4, 44, 18);
        return relevee(c) ? "" : capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
      },
      body(c, { view, pose }) {
        const shadeX = view === "se" ? 26 : 27.5;
        let s = P(COAT, C.coat);
        s += clip(`${c.uid}c`, COAT, `<rect x="${shadeX}" y="30" width="10" height="22" fill="${C.coatS}"/><path d="M13,47 Q24,50.2 35,47 L35,52 L13,52 Z" fill="${C.coatS}"/><rect x="14.6" y="34" width="1.4" height="12" rx="0.7" fill="${C.coatH}"/>`);
        s += P(COAT, "none");
        if (view === "ne") {
          s += P("M24,34 L24,49.4", "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s;
        }
        const o = view === "front" ? 24 : 21.5;
        s += P(`M${o},33.2 L${o + (view === "se" ? -0.6 : 0)},49.6`, "none", 0.9);
        for (const y of [37, 41, 45]) s += E(o + 1.6, y, 0.75, 0.75, C.coatS, 0.6);
        s += P(`M${view === "se" ? 15.8 : 16.2},42.5 L${view === "se" ? 19.2 : 20},42.3`, "none", 0.8);
        if (pose !== "action") s += spyglass(29.4, 44.8, -14);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") {
          return P("M16.5,31 Q24,34.6 31.5,31 L32,34 Q24,37.6 16,34 Z", C.scarf) + P("M28.5,34.6 L31.4,41.2 L28.4,41.6 L27,35.4 Z", C.scarf) + P("M29,36 L30.6,40.4", "none", 0.6);
        }
        const kx = view === "se" ? 18.2 : 20.5;
        return P("M16.5,31 Q24,34.8 31.5,31 L32,34 Q24,38 16,34 Z", C.scarf) + P("M17.4,33.6 Q24,36.8 30.8,33.4", "none", 0.6) + P(`M${kx},35.2 L${kx - 2},42 L${kx + 1.2},41.4 L${kx + 1.6},36 Z`, C.scarf) + E(kx + 0.6, 35.6, 1.9, 1.5, C.scarfS, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const tufts = P("M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z", C.hair) + P("M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z", C.hair);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z";
          s += (c.coiffe ? "" : tufts) + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="32" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M17,11 Q24,7.6 31,11", "none", 0.8) + P("M19.6,12.6 Q18.8,20 20.4,27.6", "none", 0.6) + P("M24.4,11.8 Q25.2,19.4 24.2,28.4", "none", 0.6);
          s += L([18, 9.6], [23.4, 8.8], C.hairH, 1.3);
          if (!relevee(c)) s += P("M14.6,11.6 Q6.6,10.8 6.4,19 Q8.6,16.8 12.6,17.8 Z", C.hair) + E(13.4, 13.4, 1.5, 1.4, C.scarf, 0.9);
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          return s;
        }
        const se = view === "se";
        const back = se ? "M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z" : "M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z";
        const fx = se ? 22.6 : 24;
        const face = `M${fx - (se ? 11.2 : 11.6)},21.6 a${se ? 11.2 : 11.6},10.4 0 1,0 ${2 * (se ? 11.2 : 11.6)},0 a${se ? 11.2 : 11.6},10.4 0 1,0 ${-2 * (se ? 11.2 : 11.6)},0 Z`;
        const bangs = se ? "M11.6,19 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L32.6,14.8 L31,18.6 L27.6,13.8 L24.4,18 L21.4,13.6 L18.2,17.8 L15.6,14.2 L13.4,19.4 Z" : "M12,18.6 Q13,8 24,8 Q35,8 36,18.6 L33,15 L31,19 L28,14 L25,18.4 L22,14 L19,18 L16,14.4 L14,19.2 Z";
        if (!relevee(c)) s += P("M33.4,11.6 Q41.4,10.8 41.6,19 Q39.4,16.8 35.4,17.8 Z", C.hair) + E(34.6, 13.4, 1.5, 1.4, C.scarf, 0.9);
        if (!c.coiffe) s += tufts;
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="25" width="32" height="8" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]] : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
        const cheeks = se ? [[15.2, 1.9], [28.2, 1.5]] : [[16.6, 2], [31.4, 2]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.15, C.cheek, 0)).join("") + fr.map(([x, y]) => E(x, y, 0.38, 0.38, C.freckle, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], C.hairH, 1.3);
        if (c.coiffe) s += c.coiffe(c, ctx, "tete");
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.35,
          brow: "#6B2620",
          browY: -4.1,
          browW: 1.05,
          ...TRAITS.femme,
          mouth: [se ? 20.8 : 24, 27],
          mw: 1.7,
          mouthC: C.mouth,
          tongue: "#E07A72",
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.4)} Q${r22(mx + 0.3)},${r22(my + 1.2)} ${r22(mx + 1.6)},${my}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 12.6 : 13.4, 12.4],
          anger: [40, 6.8],
          zz: [36.4, 5.8]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
        }
        const ext = n === 0 ? 0 : 1;
        const near = arm(this, [15.4, 33.2], [12.6, 24.8], [10.2, 31.4]);
        const hip = arm(this, [32, 34], [32.6, 42.8], [37.4, 38.4]);
        return { expr: "neutre", eyeMode: "wink", left: "", right: hip, over: heldGlass(16.4, 22.8, 4, ext) + near + (ext ? twinkle(2.8, 18.6, 1.9) : "") };
      }
    };
    module.exports = aster;
  }
});

// atelier/aster2.js
var require_aster2 = __commonJS({
  "atelier/aster2.js"(exports, module) {
    module.exports = require_aster();
  }
});

// personnages/cannelle.js
var require_cannelle = __commonJS({
  "personnages/cannelle.js"(exports, module) {
    var { P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var C = {
      skin: "#E9B98F",
      skinS: "#CF9C72",
      nose: "#B97A58",
      hair: "#D9D4CC",
      hairS: "#ABA59C",
      hairH: "#F5F2EC",
      brow: "#8C857C",
      dress: "#A8553A",
      dressS: "#84402B",
      dressH: "#C46E4E",
      apron: "#F4E9D8",
      apronS: "#DCCDB5",
      stain: "#C9A27A",
      copper: "#C27C45",
      copperS: "#8F5530",
      copperH: "#EAA46C",
      strap: "#6B4226",
      spoon: "#C9CED6",
      spoonS: "#9AA2AD",
      cheek: "#F08F86",
      mouth: "#7A3B30",
      tongue: "#E07A72"
    };
    function ladle(a, b, tilt = 0) {
      return limb(a, b, 1.5, C.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], C.copperH, 0.5) + `<g transform="rotate(${tilt} ${r22(b[0])} ${r22(b[1])})">${E(b[0], b[1], 3.3, 2.6, C.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, C.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, C.copperH, 0)}</g>`;
    }
    __name(ladle, "ladle");
    var DRESS = /* @__PURE__ */ __name((sway) => `M15.2,33 Q24,30.2 32.8,33 Q${r22(37 + sway)},42 ${r22(37.6 + sway)},53.6 Q${r22(24 + sway)},57.2 ${r22(10.4 + sway)},53.6 Q${r22(11 + sway)},42 15.2,33 Z`, "DRESS");
    var cannelle = {
      name: "Cannelle",
      uid: "ca",
      teintes: [C.hair, C.dress, C.apron, C.copper],
      skin: C.skin,
      sleeve: C.dress,
      cuff: C.apron,
      armW: 4.3,
      leg: "#6A5A52",
      legS: "#54463F",
      legW: 4.8,
      hip: 50,
      ground: 56.8,
      shoe: "#8A5A2E",
      shoeS: "#6B4322",
      shoeH: "#B07E4C",
      legX: { front: [20.5, 27.5], se: [20, 27.4], ne: [20.8, 27.8] },
      shoulders: [[15, 35], [33, 35]],
      hands: [[12.6, 46.6], [35.4, 46.6]],
      action: ["face_louche", "front"],
      // louche en bandoulière : dans le dos (face, trois quarts), sauf quand elle la brandit
      backItems(c, { view, pose }) {
        if (view === "ne" || pose === "action") return "";
        return ladle([15, 50], [37.6, 26.4], -25);
      },
      body(c, { view, ph, walk }) {
        const sway = walk ? ph * 0.7 : 0;
        const d = DRESS(sway);
        let s = P(d, C.dress) + clip(`${c.uid}d`, d, `<rect x="${view === "se" ? 27.6 : 29.4}" y="30" width="12" height="30" fill="${C.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${C.dressS}"/><rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${C.dressH}"/>`) + P(d, "none");
        if (view === "ne") {
          s += P("M17,40.4 Q24,41.6 31,40.4", "none", 0.8);
          s += P("M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z", C.apron, 0.9) + P("M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z", C.apron, 0.9);
          s += P("M23.4,41.6 L21.6,47.4 L23.4,47 Z", C.apron, 0.8) + P("M24.6,41.6 L26.4,47.4 L24.6,47 Z", C.apron, 0.8) + E(24, 41, 1.3, 1.1, C.apronS, 0.8);
          s += ladle([33, 50.4], [11.6, 26.2], 25);
          return s;
        }
        const k = view === "se" ? -2 : 0;
        const ap = `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2 Q${r22(33.2 + k + sway)},47 ${r22(33 + k + sway)},53.4 Q${r22(24 + k + sway)},55.6 ${r22(15 + k + sway)},53.4 Q${r22(14.8 + k + sway)},47 ${17.6 + k},40.2 Z`;
        s += P(ap, C.apron) + clip(`${c.uid}a`, ap, `<rect x="${28 + k}" y="34" width="8" height="24" fill="${C.apronS}"/>` + E(21 + k, 46.6, 1.3, 0.85, C.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, C.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, C.stain, 0)) + P(ap, "none");
        s += P(`M${17.6 + k},40.2 L${30.4 + k},40.2`, "none", 0.8);
        s += P(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, C.apron, 0.8);
        s += limb([31.4, 33.8], [16.8, 47.2], 1.15, C.strap);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P("M19.8,25 L28.2,25 L28.4,31.95 Q24,31.25 19.6,31.95 Z", C.skinS, 0) + P("M19.6,31.95 Q24,31.25 28.4,31.95", "none");
        return P("M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z", C.apron, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const spoon = limb([26.6, 9.2], [31.2, 4], 1.1, C.spoon) + `<g transform="rotate(40 32 3.2)">${E(32, 3.2, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.9, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
        const bun = E(24, 8.6, 5.4, 4.3, C.hair) + P("M20.4,8.2 Q24,5.6 27.6,8.2", "none", 0.6);
        let s = "";
        if (view === "ne") {
          const back2 = "M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.8,30 35.8,32.8 Q32.6,34 28.6,32.8 Q27,28.4 24,28.4 Q21,28.4 19.4,32.8 Q15.4,34 12.2,32.8 Q11.2,30 12,22 Z";
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.6" cy="19.8" rx="13.8" ry="12.4" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M16.6,31.6 Q15.8,21.4 20.6,14.4", "none", 0.6) + P("M24,26.4 Q23.4,21 24,15.4", "none", 0.6) + P("M31.4,31.6 Q32.2,21.4 27.4,14.4", "none", 0.6);
          const curl = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="#3C2819" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.hair}" stroke-width="0.7" stroke-linecap="round"/>`, "curl");
          s += curl("M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31");
          s += L([14.6, 17.6], [16.8, 13.6], C.hairH, 1.2);
          s += limb([26.6, 9.6], [31.2, 3.8], 1.1, C.spoon) + `<g transform="rotate(40 32 3)">${E(32, 3, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.7, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
          s += E(24, 10.4, 5.4, 4.4, C.hair) + P("M20.4,10.4 Q24,7.6 27.6,10.4", "none", 0.6) + L([21, 8.8], [23.6, 7.9], C.hairH, 1.1);
          return s;
        }
        const se = view === "se";
        const fx = se ? 22.6 : 24;
        const rx = se ? 11.3 : 11.6;
        const back = se ? "M12.6,22 Q11.4,9 24,9 Q37.4,9 36.4,22 Q36.4,27 33.8,28 L15,28 Q12.6,27 12.6,22 Z" : "M12,22 Q11,9 24,9 Q37,9 36,22 Q36,27 33.6,28 L14.4,28 Q12,27 12,22 Z";
        const face = `M${fx - rx},22.4 a${rx},10.2 0 1,0 ${2 * rx},0 a${rx},10.2 0 1,0 ${-2 * rx},0 Z`;
        const part = se ? 21.6 : 24;
        const bangs = `M${se ? 11.8 : 12.6},19.4 Q${se ? 12 : 12.6},9.8 ${part},9.6 Q${se ? 35 : 35.4},9.8 ${se ? 35.2 : 35.4},19.4 Q${se ? 32 : 32.6},13.8 ${part + 1},12.8 L${part},14.2 L${part - 1},12.8 Q${se ? 14.6 : 15.4},13.8 ${se ? 11.8 : 12.6},19.4 Z`;
        s += spoon + bun;
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        const cheeks = se ? [[15.6, 2.2], [28.6, 1.8]] : [[16.4, 2.6], [31.6, 2.6]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.8, r * (ctx.expr === "gene" ? 1.25 : 1), ctx.expr === "gene" ? 2 : 1.6, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L(se ? [14.6, 12.6] : [15.8, 12.6], se ? [19.4, 10.6] : [21, 10.6], C.hairH, 1.2);
        const outer = se ? [[14.6, 1]] : [[16.2, -1], [31.8, 1]];
        for (const [x, d] of outer) s += L([x, 23.4], [x + (d < 0 ? -1 : 1) * 1.1, 24.1], C.nose, 0.5);
        const nx = se ? 20.8 : 24;
        s += P(se ? `M${nx + 0.4},24.2 Q${nx - 1.4},25.6 ${nx + 0.6},26` : `M${nx - 0.9},25.5 Q${nx},26.3 ${nx + 0.9},25.5`, "none", 0.8).replace('stroke="#3C2819"', `stroke="${C.nose}"`);
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.4], [25.2, 22.8, 1.25]] : [[19.4, 22.8, 1.45], [28.6, 22.8, 1.45]],
          ry: 2.1,
          brow: C.brow,
          browY: -4.4,
          browW: 0.95,
          ...TRAITS.femme,
          mouth: [se ? 21 : 24, 27.8],
          mw: 2.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.7)},${r22(my + 0.3)} Q${mx},${r22(my + 1.4)} ${r22(mx + 1.7)},${r22(my + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 26.8,
          temple: [se ? 12.8 : 13.6, 13.4],
          anger: [38, 11],
          zz: [35.8, 6.2]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [33, 35], lerp([38.6, 26.4], [40, 28.4], k)) };
        }
        const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6];
        const bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
        const elbow = [9.6, 40.6];
        const left = arm(this, [15, 35], [14.8, 44.4], elbow);
        const right = ladle([hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand);
        return { expr: "rire", left, right };
      }
    };
    module.exports = cannelle;
  }
});

// atelier/cannelle.js
var require_cannelle2 = __commonJS({
  "atelier/cannelle.js"(exports, module) {
    module.exports = require_cannelle();
  }
});

// personnages/rivet.js
var require_rivet = __commonJS({
  "personnages/rivet.js"(exports, module) {
    var { P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var C = {
      skin: "#DDA57C",
      skinS: "#C08A62",
      hair: "#6B4A32",
      hairS: "#4F3524",
      hairH: "#8C6646",
      grey: "#CFCAC2",
      greyS: "#A8A29A",
      shirt: "#3F8A86",
      shirtS: "#2E6B68",
      collar: "#EFE6D6",
      leather: "#8A5A36",
      leatherS: "#6B4328",
      leatherH: "#A87650",
      brass: "#C9A24A",
      brassS: "#8E6E2C",
      glass: "#CFEAF0",
      strap: "#4A3426",
      steel: "#B8C0C8",
      steelS: "#8A949E",
      red: "#C8463A",
      wood: "#E2C28E",
      pencil: "#F2C94C",
      eraser: "#EE8F8F",
      cheek: "#EE9C8C",
      mouth: "#7A3B30",
      tongue: "#E07A72"
    };
    var pencil = /* @__PURE__ */ __name((a, b) => limb(a, b, 1.4, C.pencil) + E(b[0], b[1], 0.95, 0.95, C.eraser, 0.8), "pencil");
    var glint = /* @__PURE__ */ __name((d, w) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round"/>`, "glint");
    var lens = /* @__PURE__ */ __name((x, y, r) => E(x, y, r, r, C.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, C.glass, 0.6) + glint(`M${r22(x - r * 0.42)},${r22(y - r * 0.1)} Q${r22(x - r * 0.36)},${r22(y - r * 0.4)} ${r22(x - r * 0.08)},${r22(y - r * 0.44)}`, 0.5), "lens");
    function gear(x, y, r, rot) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 + rot * Math.PI / 180;
        const rr = i % 2 ? r * 0.76 : r;
        pts.push(`${r22(x + rr * Math.cos(a))},${r22(y + rr * Math.sin(a))}`);
      }
      return P(`M${pts.join(" L")} Z`, C.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, C.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, "#3C2819", 0);
    }
    __name(gear, "gear");
    var screwdriver = /* @__PURE__ */ __name((a, b) => limb([a[0] + (b[0] - a[0]) * 0.35, a[1] + (b[1] - a[1]) * 0.35], b, 0.6, C.steel) + limb(a, [a[0] + (b[0] - a[0]) * 0.4, a[1] + (b[1] - a[1]) * 0.4], 1.6, C.red), "screwdriver");
    var TORSO = "M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z";
    var APRON = /* @__PURE__ */ __name((k) => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${32.2 + k},52 Q${24 + k},53.8 ${15.8 + k},52 L${17.4 + k},40 Z`, "APRON");
    var rivet = {
      name: "Rivet",
      uid: "ri",
      teintes: [C.hair, C.shirt, C.leather, C.grey],
      skin: C.skin,
      sleeve: C.shirt,
      cuff: C.shirtS,
      armW: 3.8,
      leg: "#4A4E5C",
      legS: "#383B47",
      legW: 4.8,
      hip: 46,
      ground: 56.6,
      shoe: "#3E3330",
      shoeS: "#2A221F",
      shoeH: "#5E504A",
      legX: { front: [20.5, 27.5], se: [20, 27.6], ne: [21, 28] },
      shoulders: [[16, 34], [32, 34]],
      hands: [[14.4, 45], [33.6, 45]],
      action: ["face_loupe", "front"],
      body(c, { view }) {
        let s = P(TORSO, C.shirt) + clip(`${c.uid}t`, TORSO, `<rect x="${view === "se" ? 26.4 : 27.6}" y="30" width="10" height="20" fill="${C.shirtS}"/>`) + P(TORSO, "none");
        if (view === "ne") {
          s += limb([18.2, 32.8], [29, 41.2], 1.5, C.leather) + limb([29.8, 32.8], [19, 41.2], 1.5, C.leather);
          s += P("M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z", C.leather, 0.8) + P("M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z", C.leather, 0.8) + limb([23.6, 41.8], [22.4, 45.4], 0.9, C.leather) + limb([24.4, 41.8], [25.8, 45.2], 0.9, C.leather) + E(24, 41.4, 1, 0.9, C.leatherS, 0.8);
          return s;
        }
        const k = view === "se" ? -1.8 : 0;
        const ap = APRON(k);
        s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], C.leatherS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], C.leatherS, 1.2);
        s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, C.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, C.red);
        s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${C.wood}" stroke="#3C2819" stroke-width="0.6"/>`;
        s += P(ap, C.leather) + clip(`${c.uid}a`, ap, `<rect x="${27.6 + k}" y="34" width="8" height="22" fill="${C.leatherS}"/><rect x="${18.4 + k}" y="35.8" width="1" height="15" rx="0.5" fill="${C.leatherH}"/>`) + P(ap, "none");
        s += `<rect x="${19.2 + k}" y="43.2" width="9.6" height="5.6" rx="0.8" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.8"/><path d="M${20 + k},44.2 L${28 + k},44.2" stroke="${C.leatherH}" stroke-width="0.5" stroke-dasharray="0.8 0.6"/>` + L([24 + k, 43.4], [24 + k, 48.6], "#3C2819", 0.5);
        s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.7"/>` + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, C.pencil);
        for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += E(x + k, y, 0.45, 0.45, C.brass, 0.4);
        s += L([17.4 + k, 40.6], [30.6 + k, 40.6], C.leatherS, 0.8);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P("M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z", C.skinS, 0) + P("M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z", C.collar, 0.8);
        const k = view === "se" ? -1.6 : 0;
        return P(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, C.collar, 0.8) + P(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, C.collar, 0.8);
      },
      head(c, ctx, act) {
        const { view } = ctx;
        const cowlick = P("M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z", C.grey, 0.9) + L([23.4, 7], [24.2, 4.2], C.greyS, 0.5);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z";
          s += cowlick + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M17.6,15 Q16.8,21 18.4,28.6", "none", 0.6) + P("M24.6,15 Q25.4,21 24.2,28.4", "none", 0.6) + P("M31,16.4 Q32,22 30.6,29.2", "none", 0.6) + L([16.6, 10.2], [21.6, 8.6], C.hairH, 1.2);
          s += P("M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z", C.strap, 0.8) + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${C.brass}" stroke="#3C2819" stroke-width="0.6"/>`;
          s += c.coiffe ? c.coiffe(c, ctx, "cheveux") + c.coiffe(c, ctx, "tete") : pencil([15.4, 20.6], [9.2, 19.2]);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z" : "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z");
        const grey = sx("M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z");
        s += cowlick + P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        s += se ? E(35, 23.2, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([33.4, 20.8], [39.2, 19.2])) : E(11.8, 22.8, 1.5, 2.1, C.skin) + E(36.2, 22.8, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([14, 20.8], [7.8, 19.4]) + pencil([34, 20.8], [40.2, 19.4]));
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.5 : 1.05, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + P(grey, C.grey, 0.8) + L([15 + k, 12.6], [20 + k, 11], C.hairH, 1.2) + L([26.4 + k, 12.2], [29.4 + k, 12.6], "#F2EFEA", 0.9);
        if (c.coiffe) s += c.coiffe(c, ctx, "cheveux");
        s += P(se ? "M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z" : "M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z", C.strap, 0.8);
        const big = se ? [[17.8, 10.8, 2.8], [26.6, 10.4, 2.5]] : [[19.4, 10.8, 2.9], [28.6, 10.8, 2.9]];
        const small = se ? [[16, 8.6, 1.8], [28.4, 8.2, 1.6]] : [[17.4, 8.6, 1.9], [30.6, 8.6, 1.9]];
        big.forEach(([x, y, r], i) => {
          if (act.lensDown && i === 1) return;
          s += lens(x, y, r) + lens(small[i][0], small[i][1], small[i][2]);
        });
        if (c.coiffe) s += c.coiffe(c, ctx, "tete");
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.35,
          brow: "#3B271B",
          browY: -4,
          browW: 1.3,
          ...TRAITS.homme,
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.8,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : absorbé, un demi-sourire (il pense déjà à autre chose)
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.6)} L${r22(mx + 0.7)},${r22(my + 0.6)} Q${r22(mx + 1.3)},${r22(my + 0.6)} ${r22(mx + 1.6)},${r22(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 13 : 13.6, 20.4],
          anger: [40.6, 7.4],
          zz: [37, 8.4]
        }, ctx);
        return s;
      },
      pose({ pose, n, k, view }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
        }
        const [x, y] = [view === "se" ? 25.2 : 28.6, 22.8];
        const eye = n === 0 ? E(x, y, 2.3, 3, "#2A2420", 0) + E(x + 0.8, y - 1.3, 0.9, 0.9, "#FFFFFF", 0) + E(x - 0.7, y + 1.3, 0.45, 0.45, "#FFFFFF", 0) : P(`M${x - 2.6},${y + 1.2} Q${x},${y - 2} ${x + 2.6},${y + 1.2}`, "none", 1.4);
        const loupe = L([31.4, 13.6], [31, 19.4], C.brassS, 0.9) + E(x, y, 3.6, 3.6, C.brass, 0.9) + E(x, y, 2.9, 2.9, C.skin, 0) + eye + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${C.glass}" fill-opacity="0.35"/>` + glint(`M${r22(x - 1.8)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y - 1.8)} ${r22(x - 0.4)},${r22(y - 2.1)}`, 0.6) + E(x, y, 2.9, 2.9, "none", 0.8);
        const g = gear(36.2, 25, 2.8, n ? 22.5 : 0) + (n ? L([39.8, 21], [41.2, 19.6], "#3C2819", 0.6) + L([40.6, 24.2], [42.4, 23.8], "#3C2819", 0.6) + L([37.8, 20.6], [38.2, 18.8], "#3C2819", 0.6) : "");
        const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
        const left = arm(this, [16, 34], [14.4, 45]) + screwdriver([14.4, 44.2], [12.8, 50.2]);
        if (view === "ne") return { expr: n ? "rire" : "neutre", left, right: "", over: g + right };
        return { expr: n ? "rire" : "neutre", lensDown: true, left, right: "", over: loupe + g + right };
      }
    };
    module.exports = rivet;
  }
});

// atelier/rivet.js
var require_rivet2 = __commonJS({
  "atelier/rivet.js"(exports, module) {
    module.exports = require_rivet();
  }
});

// personnages/ondin.js
var require_ondin = __commonJS({
  "personnages/ondin.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, bareFoot, r2: r22, lerp, TRAITS } = require_troupe();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var relevee = /* @__PURE__ */ __name((c) => !!(c.coiffe && c.coiffe.capuche), "relevee");
    var C = {
      skin: "#F5CFA8",
      skinS: "#E0AE86",
      hair: "#E2B45A",
      hairS: "#B98A3A",
      hairH: "#F6D58E",
      brow: "#8C6526",
      coat: "#3D7CC9",
      coatS: "#2E5F9E",
      coatH: "#7DB0E8",
      lining: "#A9CBEF",
      cap: "#BFD3F2",
      capS: "#93AEDB",
      cream: "#F4EEDF",
      rope: "#D8C08A",
      wood: "#A8743F",
      leaf: "#7BB661",
      glass: "#D6ECF2",
      cork: "#B07E4C",
      water: "#A9DCFF",
      cheek: "#F6A0A0",
      mouth: "#7A3B30",
      tongue: "#E07A72"
    };
    var HY = 4.4;
    var cord = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "cord");
    var drop = /* @__PURE__ */ __name((x, y, r) => P(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, C.water, 0.6), "drop");
    function rod(h, side = 1) {
      const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.6, h[1] + 9];
      return limb(h, j, 1.1, C.wood) + limb(j, b, 1.1, C.wood) + limb(j, tip, 1.2, C.wood) + `<g transform="rotate(${side * -35} ${r22(b[0])} ${r22(b[1])})">${E(b[0] + side * 1.1, b[1], 1.3, 0.65, C.leaf, 0.6)}</g>`;
    }
    __name(rod, "rod");
    function jar(x, y) {
      const d = `M${r22(x - 1.6)},${r22(y - 1.6)} L${r22(x + 1.6)},${r22(y - 1.6)} Q${r22(x + 2.1)},${r22(y - 1.2)} ${r22(x + 2)},${y} L${r22(x + 1.9)},${r22(y + 1.9)} Q${x},${r22(y + 2.6)} ${r22(x - 1.9)},${r22(y + 1.9)} L${r22(x - 2)},${y} Q${r22(x - 2.1)},${r22(y - 1.2)} ${r22(x - 1.6)},${r22(y - 1.6)} Z`;
      return `<path d="${d}" fill="${C.glass}" fill-opacity="0.65" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(x - 1.1)},${r22(y - 0.6)} L${r22(x - 1.1)},${r22(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r22(x - 1.3)}" y="${r22(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${C.cork}" stroke="${OUT}" stroke-width="0.7"/>`;
    }
    __name(jar, "jar");
    var COAT = "M15.8,37.4 Q24,35 32.2,37.4 L35,52.4 Q24,55 13,52.4 Z";
    var CAP = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z";
    var CAP_DOS = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.8,14.6 Q24,18 11.2,14.6 Q11.4,14.1 12,13.8 Z";
    function cap(uid, d = CAP) {
      const stripes = [20, 28, 36, 44].map((x) => `<path d="M${x},0 L${x + 2.6},0 L${x - 5.4},22 L${x - 8},22 Z" fill="${C.cream}"/>`).join("");
      return P(d, C.cap) + clip(`${uid}k`, d, `<rect x="8" y="0" width="38" height="22" fill="${C.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${C.cap}"/>${stripes}`) + P(d, "none") + E(41.6, 24.4, 2.2, 2.2, C.cream) + E(42.2, 25.2, 0.8, 0.7, "#DCCDB5", 0);
    }
    __name(cap, "cap");
    var ondin = {
      name: "Ondin",
      uid: "on",
      teintes: [C.hair, C.coat, C.cap, C.lining],
      skin: C.skin,
      skinS: C.skinS,
      sleeve: C.coat,
      cuff: C.lining,
      armW: 4.4,
      leg: C.skin,
      legS: C.skinS,
      legW: 4.2,
      hip: 50.4,
      ground: 56.8,
      foot: bareFoot,
      legX: { front: [21, 27], se: [20.6, 27.2], ne: [21.4, 27.6] },
      shoulders: [[16.4, 38.8], [31.6, 38.8]],
      hands: [[14.8, 48.2], [33.2, 48.2]],
      action: ["face_baguette", "front"],
      // la baguette ne quitte pas sa main droite (repos et marche)
      hold(c, h) {
        return rod(h, 1);
      },
      // derrière le corps : la capuche rabattue de son ciré, qui dépasse derrière le cou (de face, de trois quarts)
      backItems(c, { view }) {
        return view === "ne" || relevee(c) ? "" : capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
      },
      body(c, { view }) {
        const se = view === "se";
        let s = P(COAT, C.coat) + clip(`${c.uid}c`, COAT, `<rect x="${se ? 26.2 : 27.8}" y="34" width="10" height="22" fill="${C.coatS}"/><path d="M12,52 Q24,54.8 36,52 L36,57 L12,57 Z" fill="${C.coatS}"/><rect x="14.6" y="39" width="1.3" height="11" rx="0.65" fill="${C.coatH}"/>`) + P(COAT, "none");
        if (view === "ne") {
          s += P(`M24,${relevee(c) ? 38 : 42.4} L24,53.8`, "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s + cord("M13.9,46.4 Q24,48.6 34.1,46.4", 1.1, C.rope);
        }
        const k = se ? -1.6 : 0;
        s += P(`M${17 + k},37.2 Q${21 + k},37.4 ${24 + k},40.2 L${20.6 + k},42 Z`, C.coatS, 0.8) + P(`M${31 + k},37.2 Q${27 + k},37.4 ${24 + k},40.2 L${27.4 + k},42 Z`, C.coatS, 0.8);
        s += P(`M${24 + k},40 L${24 + k + (se ? -0.6 : 0)},53.8`, "none", 0.9);
        for (const y of [42.6, 50.4]) s += `<rect x="${r22(24.5 + k)}" y="${y - 0.5}" width="2.4" height="1" rx="0.5" fill="${C.wood}" stroke="${OUT}" stroke-width="0.5"/>`;
        s += cord("M13.9,45.6 Q24,47.6 34.1,45.6", 1.1, C.rope);
        s += cord(`M${20.2 + k},47 L${19.4 + k},49.6`, 0.8, C.rope) + cord(`M${20.8 + k},47 L${21.4 + k},49.4`, 0.8, C.rope) + E(20.5 + k, 46.9, 1.1, 0.9, C.rope, 0.7);
        s += L([27.6 + k, 47.1], [27.6 + k, 48.4], OUT, 0.6) + jar(27.6 + k, 50.6);
        return s;
      },
      // de dos : la nuque (dans l'ombre) entre les boucles, rentrée sous le col du ciré
      neck(c, { view }) {
        if (view !== "ne") return "";
        return P("M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z", C.skinS, 0) + P("M19.6,36.55 Q24,35.85 28.4,36.55", "none");
      },
      head(c, ctx) {
        const { view } = ctx;
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 L35.6,33.2 L34,32 L33,34 L31.4,32.4 L30,34 L28.6,32.4 L27.2,33.8 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.8 L19.4,32.4 L18,34 L16.6,32.4 L15,34 L14,32 L12.4,33.2 L12,31 Q10.6,28 11,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          if (!relevee(c)) {
            s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${C.hair}"/>`) + P(back2, "none");
            s += P("M18.4,19 Q17.8,25.4 19.2,31.4", "none", 0.6) + P("M28.8,19 Q29.8,25.4 28.6,31.4", "none", 0.6);
          }
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          else s += `<g transform="translate(48 0) scale(-1 1)">${cap(c.uid, CAP_DOS)}</g>` + P("M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z", C.cream, 0.9);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.6,26.4 35.6,27.2 L14,27.2 Q12.2,26.4 12,21.6 Z" : "M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q36.8,25.4 35,26.6 L13,26.6 Q11.2,25.4 11.4,21 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.4,15.8 31.6,15.8 Q30,18 27.6,17.6 Q26.4,15.4 24,15.6 Q21.6,15.4 20.4,17.6 Q18,18 16.4,15.8 Q13.6,15.8 12,19.4 Z");
        if (!c.coiffe) s += (se ? "" : P("M11.8,17.4 Q8.4,18 8.8,21.2 Q10.2,19.6 11.8,19.8 Z", C.hair)) + P(sx("M36.2,17.4 Q39.6,18 39.2,21.2 Q37.8,19.6 36.2,19.8 Z"), C.hair);
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15, 2], [28.2, 1.6]] : [[16.4, 2.2], [31.6, 2.2]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.6, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.2, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L([16.4 + k, 14.6], [21.2 + k, 13.9], C.hairH, 1);
        s += c.coiffe ? c.coiffe(c, ctx, "tete") : `<g transform="translate(${k} 0)">${cap(c.uid)}${P("M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z", C.cream, 0.9)}</g>`;
        s += expression({
          // (les yeux un peu plus bas, choix de l'auteur, 12 oct. : ils étaient trop hauts sous le bonnet)
          eyes: se ? [[17.2, 23.3, 1.65], [25.2, 23.3, 1.45]] : [[19.4, 23.3, 1.7], [28.6, 23.3, 1.7]],
          ry: 2.5,
          brow: C.brow,
          browY: -4.3,
          browW: 1,
          ...TRAITS.garcon,
          // au repos : les yeux mi-clos (la brume le tient encore), une toute petite bouche
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 0.9)},${r22(my + 0.4)} Q${mx},${r22(my + 1.1)} ${r22(mx + 0.9)},${r22(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 26.6,
          temple: [se ? 13.4 : 12.4, 23.2],
          anger: [8.4, 8.6],
          zz: [6.6, 6.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, left: rod(this.hands[0], -1) + arm(this, this.shoulders[0], this.hands[0]), right: arm(this, [31.6, 38.8], lerp([36.6, 30.6], [38, 32.6], k)) };
        }
        const j = [24, 45.2], hl = [19.4, 47.4], hr = [28.6, 47.4];
        const tip = n === 0 ? [24.4, 38] : [24.8, 53.6];
        const stick = limb(hl, j, 1.1, C.wood) + limb(hr, j, 1.1, C.wood) + limb(j, tip, 1.2, C.wood) + (n ? L([21.6, 48.6], [20.8, 50.6], OUT, 0.6) + L([27.6, 48.6], [28.4, 50.6], OUT, 0.6) + drop(20.8, 55, 0.9) + drop(28.8, 54.8, 0.9) : "");
        return {
          expr: n ? "surpris" : "neutre",
          left: stick + arm(this, [16.4, 38.8], hl, [12, 44.2]),
          right: arm(this, [31.6, 38.8], hr, [36, 44.2])
        };
      }
    };
    module.exports = ondin;
  }
});

// atelier/ondin.js
var require_ondin2 = __commonJS({
  "atelier/ondin.js"(exports, module) {
    module.exports = require_ondin();
  }
});

// personnages/sylve.js
var require_sylve = __commonJS({
  "personnages/sylve.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, bareFoot, r2: r22, lerp, TRAITS, dechirure, filPendant } = require_troupe();
    var C = {
      skin: "#E8B88E",
      skinS: "#CC9A70",
      hair: "#4A3328",
      hairS: "#33231B",
      hairH: "#6E4E3C",
      brow: "#2E1F18",
      twig: "#8A6440",
      feather: "#3E7FC1",
      featherS: "#1F3F66",
      leaf: "#5E9E4A",
      leafS: "#467A37",
      leafH: "#86C06A",
      tunic: "#A88655",
      tunicS: "#86683E",
      vine: "#4E7A34",
      paint: "#3F8F4A",
      seed: "#8A6440",
      cheek: "#EE9C8C",
      mouth: "#7A3B30",
      tongue: "#E07A72"
    };
    var leaf = /* @__PURE__ */ __name((x, y, len, w, rot, fill = C.leaf) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">` + P(`M0,0 Q${w},${r22(len / 2)} 0,${len} Q${-w},${r22(len / 2)} 0,0 Z`, fill, 0.7) + L([0, 0.6], [0, len - 0.8], C.leafS, 0.4) + "</g>", "leaf");
    var vine = /* @__PURE__ */ __name((d, w = 1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.vine}" stroke-width="${w}" stroke-linecap="round"/>`, "vine");
    var twig = /* @__PURE__ */ __name((a, b, f) => L(a, b, OUT, 1.6) + L(f[0], f[1], OUT, 1.3) + L(a, b, C.twig, 0.8) + L(f[0], f[1], C.twig, 0.6), "twig");
    var feather = /* @__PURE__ */ __name((x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P("M0,0 Q1.8,-5.2 7,-8.2 Q5.8,-3 0.8,0.6 Z", C.feather, 0.8) + L([2.4, -3.4], [3.8, -2.2], C.featherS, 0.6) + L([3.8, -5.2], [5, -4], C.featherS, 0.6) + P("M5.6,-7.2 Q6.6,-7.8 7,-8.2 Q6.8,-7 6.2,-6.2 Z", "#FFFFFF", 0) + "</g>", "feather");
    var note = /* @__PURE__ */ __name((x, y) => `<g transform="rotate(-12 ${x} ${y})">${E(x, y, 1.1, 0.8, OUT, 0)}${L([x + 0.95, y], [x + 0.95, y - 3.6], OUT, 0.6)}<path d="M${r22(x + 0.95)},${r22(y - 3.6)} Q${r22(x + 2.6)},${r22(y - 3)} ${r22(x + 2.2)},${r22(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>`, "note");
    var CAPE = "M14.4,33 Q24,30.6 33.6,33 L37.6,52.4 Q36.2,54.4 34.6,52.8 Q33.2,55 31.4,53.2 Q29.8,55.2 28,53.4 Q26,55.4 24,53.6 Q22,55.4 20,53.4 Q18.2,55.2 16.6,53.2 Q14.8,55 13.4,52.8 Q11.8,54.4 10.4,52.4 Z";
    var TUNIC_DECHIRE = dechirure([33.4, 48.6], [24, 51.4], [14.6, 49.2], 4);
    var TUNIC = `M16.2,32.6 Q24,30 31.8,32.6 L33.4,48.6 ${TUNIC_DECHIRE.d} Z`;
    function cape(uid, over) {
      const rows = over ? [38.4, 43.4, 48.4].map((y) => `<path d="M10,${y} Q12,${y + 2} 14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y}" fill="none" stroke="${C.leafS}" stroke-width="0.7"/>`).join("") : "";
      return P(CAPE, C.leaf) + clip(`${uid}cp`, CAPE, `<rect x="27" y="30" width="14" height="28" fill="${C.leafS}"/>${rows}<rect x="13.6" y="35" width="1.2" height="15" rx="0.6" fill="${C.leafH}"/>`) + P(CAPE, "none");
    }
    __name(cape, "cape");
    var sylve = {
      name: "Sylve",
      uid: "sy",
      teintes: [C.hair, C.tunic, C.leaf, C.feather],
      skin: C.skin,
      skinS: C.skinS,
      sleeve: C.skin,
      cuff: C.vine,
      armW: 3.6,
      leg: C.skin,
      legS: C.skinS,
      legW: 4.4,
      hip: 47.6,
      ground: 56.6,
      foot: bareFoot,
      legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
      shoulders: [[16.2, 34], [31.8, 34]],
      hands: [[14.6, 45], [33.4, 45]],
      action: ["face_chant", "front"],
      // c.noCape (naufragée) : la cape est perdue, il n'en reste que la liane (voir naufrages.js)
      backItems(c, { view }) {
        return view === "ne" || c.noCape ? "" : cape(c.uid, false);
      },
      body(c, { view }) {
        let s = P(TUNIC, C.tunic) + clip(`${c.uid}t`, TUNIC, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="9" height="22" fill="${C.tunicS}"/>`) + P(TUNIC, "none") + TUNIC_DECHIRE.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
        s += vine("M15.2,42.2 Q24,44 32.8,42.2", 1);
        if (view === "ne") return s + (c.noCape ? "" : cape(c.uid, true)) + [16.6, 20.6, 24, 27.4, 31.4].map((x, i) => leaf(x, 31.6, 3.6, 1.4, [30, 12, 0, -12, -30][i])).join("");
        const k = view === "se" ? -1.6 : 0;
        return s + leaf(19.6 + k, 43.4, 2.8, 1.1, 20) + leaf(20.6 + k, 43.4, 2.6, 1, -15);
      },
      // col de feuilles autour du cou (de face et de trois quarts)
      neck(c, { view }) {
        if (view === "ne") return "";
        const k = view === "se" ? -1.6 : 0;
        return [18.2, 21, 24, 27, 29.8].map((x, i) => leaf(x + k, 32.4, 4.2, 1.6, [38, 16, 0, -16, -38][i])).join("");
      },
      head(c, ctx) {
        const { view } = ctx;
        const long = "M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,30.4 L36.6,29.2 L36.4,33.4 L34.4,31.2 L33.4,34.6 L31.6,31.4 L16.4,31.4 L14.6,34.6 L13.6,31.2 L11.6,33.4 L11.4,29.2 L9.4,30.4 Z";
        let s = "";
        if (view === "ne") {
          const back = "M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,31 L36.4,29.6 L36.6,34.4 L34,32 L33.2,36 L30.8,33 L29.4,36.6 L27.2,33.4 L24.6,37 L22.4,33.4 L20,36.6 L18.4,33 L15.8,35.6 L14.8,32 L12,34 L11.6,29.6 L9.4,31 Z";
          s += twig([35.4, 14.2], [39.8, 12.6], [[37.8, 13.2], [38.8, 15]]) + twig([11.8, 21.2], [7.8, 22.6], [[9.6, 21.8], [8.4, 20.2]]) + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="36" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.6" rx="13.4" ry="12.4" fill="${C.hair}"/>`) + P(back, "none");
          s += P("M17,12 Q15.6,22 17.6,32", "none", 0.6) + P("M24.4,11.4 Q25.4,22 23.6,33.6", "none", 0.6) + P("M30.6,12.4 Q32,22 30.4,32", "none", 0.6);
          s += L([16.8, 10], [22, 8.4], C.hairH, 1.2) + L([27, 16], [29.4, 15.4], C.twig, 0.8) + feather(13.4, 14.6, -1);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z");
        s += twig([12.6, 14.2], [8.2, 12.6], [[10.2, 13.2], [9.2, 15]]) + twig([36.2, 21.2], [40.2, 22.6], [[38.4, 21.8], [39.6, 20.2]]);
        s += P(long, C.hair) + clip(`${c.uid}h`, long, `<rect x="8" y="24" width="32" height="12" fill="${C.hairS}"/>`) + P(long, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        const paint = cheeks.map(([x, r]) => [-0.6, 0.6].map((dy) => L([x - r * 0.9, 25.6 + dy * 1.6], [x + r * 0.9, 25.2 + dy * 1.6], C.paint, 0.75)).join("")).join("");
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 27.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + paint);
        s += P(face, "none");
        s += P(sx("M12.6,16.4 Q11.2,24 13.4,30 Q14,24 14.8,18.6 Z"), C.hair, 0.8) + P(sx("M35.4,16.4 Q36.8,24 34.6,30 Q34,24 33.2,18.6 Z"), C.hair, 0.8);
        s += P(bangs, C.hair) + L([15.6 + k, 11.2], [21.6 + k, 9.6], C.hairH, 1.2) + feather(34.4 + k, 14.6);
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.4,
          brow: C.brow,
          browY: -4.1,
          browW: 1.15,
          ...TRAITS.femme,
          mouth: [se ? 20.8 : 24, 27.6],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : sur ses gardes, la bouche serrée de travers
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.1)},${r22(my + 0.7)} L${r22(mx + 1.1)},${r22(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 27.4,
          temple: [se ? 11.6 : 10.8, 22.4],
          anger: [8.4, 12.6],
          zz: [3.6, 11.4]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [31.8, 34], lerp([37.2, 25.4], [38.6, 27.4], k)) };
        }
        const left = arm(this, [16.2, 34], [22.2, 43.4], [12.6, 40.6]);
        const right = arm(this, [31.8, 34], [25.8, 43.4], [35.4, 40.6]);
        const seedOrSprout = n === 0 ? E(24, 41.4, 1.1, 0.8, C.seed, 0.7) + note(36.4, 25.4) + note(39.6, 19.6) : L([24, 42], [24, 36.4], OUT, 1.8) + L([24, 42], [24, 36.4], C.vine, 0.9) + leaf(24, 37, 3.8, 1.5, 125) + leaf(24, 37, 3.8, 1.5, -125) + note(36.8, 22.4) + note(10.4, 24.6) + note(40.2, 16.8);
        return n === 0 ? { expr: "content", eyeMode: "blink", open: true, left, right, over: seedOrSprout } : { expr: "rire", left, right, over: seedOrSprout };
      }
    };
    module.exports = sylve;
  }
});

// atelier/sylve.js
var require_sylve2 = __commonJS({
  "atelier/sylve.js"(exports, module) {
    module.exports = require_sylve();
  }
});

// personnages/galet.js
var require_galet = __commonJS({
  "personnages/galet.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var C = {
      skin: "#B9B3A8",
      skinS: "#9C968B",
      nose: "#A39C90",
      wool: "#B5562E",
      woolS: "#8E3F20",
      woolH: "#D07448",
      beard: "#A3B48A",
      beardS: "#7F9068",
      beardH: "#C4D1AC",
      white: "#EEEAE0",
      whiteS: "#C9C3B6",
      smock: "#6E6458",
      smockS: "#564E44",
      belt: "#4A3A2C",
      brass: "#C9A24A",
      wood: "#A8743F",
      woodS: "#7E5530",
      steel: "#B8C0C8",
      stone: "#A9A49A",
      stoneS: "#86817A",
      glow: "#8FE3E8",
      cheek: "#E3A396",
      mouth: "#5A3028",
      tongue: "#D9786E"
    };
    var HY = 4.4;
    function mallet(h, rot) {
      return `<g transform="rotate(${rot} ${r22(h[0])} ${r22(h[1])})">` + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, C.wood) + `<rect x="${r22(h[0] - 2.4)}" y="${r22(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${C.wood}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(h[0] + 0.9)}" y="${r22(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${C.woodS}"/></g>`;
    }
    __name(mallet, "mallet");
    var chisel = /* @__PURE__ */ __name((a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, C.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, C.steel), "chisel");
    var SMOCK = "M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z";
    var BEARD = "M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z";
    var galet = {
      name: "Galet",
      uid: "ga",
      teintes: [C.wool, C.beard, C.smock, C.white],
      skin: C.skin,
      skinS: C.skinS,
      sleeve: C.smock,
      cuff: C.smockS,
      armW: 4.2,
      leg: "#55504A",
      legS: "#403C37",
      legW: 4.6,
      hip: 50.4,
      ground: 56.8,
      shoe: "#4A3C30",
      shoeS: "#33291F",
      shoeH: "#6B5A4A",
      legX: { front: [21, 27], se: [20.6, 27.2], ne: [21.4, 27.6] },
      shoulders: [[16.4, 38.8], [31.6, 38.8]],
      hands: [[14.8, 48.2], [33.2, 48.2]],
      action: ["face_rune", "front"],
      // le maillet ne quitte pas sa main droite
      hold(c, h) {
        return mallet(h, -8);
      },
      body(c, { view }) {
        let s = P(SMOCK, C.smock) + clip(`${c.uid}s`, SMOCK, `<rect x="${view === "se" ? 26.2 : 27.8}" y="34" width="9" height="20" fill="${C.smockS}"/>`) + P(SMOCK, "none");
        s += P("M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z", C.belt, 0.8);
        if (view === "ne") return s + P("M24,38 L24,52", "none", 0.6);
        const k = view === "se" ? -1.6 : 0;
        s += `<rect x="${r22(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${C.brass}" stroke="${OUT}" stroke-width="0.6"/>`;
        return s + chisel([30.2 + k, 44.6], [31, 51.4]);
      },
      head(c, ctx) {
        const { view } = ctx;
        const beanie = "M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z";
        const hole = /* @__PURE__ */ __name((x, y) => E(x, y, 1.1, 0.85, "#5E2A15", 0.6) + P(`M${r22(x - 0.6)},${r22(y + 0.3)} Q${x},${r22(y - 1.6)} ${r22(x + 0.7)},${r22(y + 0.2)}`, C.white, 0.5), "hole");
        const woolCap = /* @__PURE__ */ __name((k2 = 0) => `<g transform="translate(${k2} 0)">` + P("M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z", C.wool, 0.8) + P(beanie, C.wool) + clip(`${ctx.id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${C.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${C.wool}"/>`) + P(beanie, "none") + hole(18.4, 9.8) + hole(29.6, 11.6) + P("M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z", C.wool, 0.9) + [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${x},${r22(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r22(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${C.woolS}" stroke-width="0.5"/>`).join("") + L([13, 15.4], [17.8, 14.4], C.woolH, 0.8) + "</g>", "woolCap");
        let s = "";
        if (view === "ne") {
          const back = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z";
          s += E(12.4, 23, 1.7, 2.3, C.skin) + E(35.6, 23, 1.7, 2.3, C.skin);
          const tuft = /* @__PURE__ */ __name((m) => {
            const d = "M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z";
            const g = /* @__PURE__ */ __name((inner) => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`, "g");
            return g(P(d, C.beard) + clip(`${ctx.id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${C.beardS}"/><path d="M8,34.6 Q14,36.4 22,34 L22,40 L8,40 Z" fill="${C.beardS}"/>`) + P(d, "none") + P("M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35", "none", 0.5) + L([12.8, 31], [13.2, 33.2], C.beardH, 0.7));
          }, "tuft");
          s += tuft(1) + tuft(-1);
          s += P(back, C.skin) + clip(`${c.uid}h`, back, `<rect x="27" y="8" width="12" height="22" fill="${C.skinS}"/><path d="M8,24.4 Q24,28.2 40,24.4 L40,34 L8,34 Z" fill="${C.white}"/><path d="M8,28.6 Q24,31.8 40,28.6 L40,34 L8,34 Z" fill="${C.whiteS}"/>`) + P(back, "none");
          s += P("M11.2,24.8 Q24,28.6 36.8,24.8", "none", 0.6) + P("M16,27.4 Q16.6,29 18.2,29.6", "none", 0.5) + P("M30.4,27.4 Q30,29 28.6,29.6", "none", 0.5);
          s += P("M24.6,5.2 Q25.2,2.4 22.8,1.8 Q23,3.6 21.8,5 Z", C.wool, 0.8) + P("M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", C.wool) + P("M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z", C.wool, 0.9) + E(26.6, 9.6, 1.1, 0.85, "#5E2A15", 0.6) + P("M26,9.9 Q26.6,8 27.3,9.8", C.white, 0.5);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        s += se ? E(35, 23.2, 1.7, 2.3, C.skin) : E(11.8, 22.8, 1.7, 2.3, C.skin) + E(36.2, 22.8, 1.7, 2.3, C.skin);
        s += P(sx("M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z"), C.white, 0.8) + P(sx("M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z"), C.white, 0.8);
        const cheeks = se ? [[15.2, 1.6], [28.2, 1.3]] : [[16.6, 1.7], [31.4, 1.7]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${C.skinS}"/>` + cheeks.map(([x, r]) => E(x, 25.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + L([15.6 + k, 19.4], [17.6 + k, 19.8], C.skinS, 0.5) + L([30.4 + k, 19.8], [32.4 + k, 19.4], C.skinS, 0.5));
        s += P(face, "none");
        s += woolCap(k);
        const beard = sx(BEARD);
        s += P(beard, C.beard) + clip(`${c.uid}b`, beard, `<rect x="${se ? 26 : 27.6}" y="24" width="10" height="26" fill="${C.beardS}"/>` + [18.6, 21.6, 24.6, 27.4].map((x) => `<path d="M${r22(x + k)},31 Q${r22(x + k - 0.6)},36 ${r22(x + k + 0.4)},41" fill="none" stroke="${C.beardS}" stroke-width="0.5"/>`).join("") + `<rect x="${r22(16.6 + k)}" y="29" width="1.1" height="7" rx="0.5" fill="${C.beardH}"/>`) + P(beard, "none");
        const mx = se ? 20.8 : 24;
        s += P(`M${r22(mx - 4.2)},27.2 Q${r22(mx - 2.4)},25 ${mx},26.2 Q${r22(mx + 2.4)},25 ${r22(mx + 4.2)},27.2 Q${r22(mx + 2.2)},28.4 ${mx},27.4 Q${r22(mx - 2.2)},28.4 ${r22(mx - 4.2)},27.2 Z`, C.beardH, 0.8);
        s += E(se ? 20.4 : 24, 24.6, 1.5, 1.3, C.nose, 0.8) + E(se ? 19.9 : 23.5, 24.2, 0.45, 0.35, "#FFFFFF", 0);
        s += expression({
          // (les yeux un peu plus bas, au milieu du visage, choix de l'auteur, 12 oct. : ils étaient trop hauts sous le bonnet)
          eyes: se ? [[17.2, 22.3, 1.4], [25.2, 22.3, 1.2]] : [[19.4, 22.3, 1.45], [28.6, 22.3, 1.45]],
          ry: 2.1,
          brow: C.white,
          browY: -3.4,
          browW: 1.9,
          ...TRAITS.homme,
          // au repos : les yeux mi-clos sous les sourcils broussailleux, la bouche cachée sous la moustache (« Hm. »)
          restEyes: "sleepy",
          mouth: [mx, 28.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((x, y) => `M${r22(x - 0.8)},${r22(y + 0.3)} L${r22(x + 0.8)},${r22(y + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 25.2,
          temple: [se ? 9.6 : 8.8, 18.6],
          anger: [39.4, 6.6],
          zz: [37.4, 3.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          const h = lerp([36.4, 30.8], [37.6, 32.4], k);
          return { open: true, right: mallet(h, 180) + arm(this, [31.6, 38.8], h) };
        }
        const block = P("M3.6,47.8 L13.4,47.8 L13.4,57.4 L3.6,57.4 Z", C.stone) + P("M3.6,47.8 L5.4,45.8 L15.2,45.8 L13.4,47.8 Z", "#C2BDB2", 0.9) + P("M13.4,47.8 L15.2,45.8 L15.2,55.4 L13.4,57.4 Z", C.stoneS, 0.9);
        const rune = n ? `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>` : "";
        const runeLine = `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${n ? "#E9FFFF" : OUT}" stroke-width="${n ? 0.9 : 0.6}" stroke-linecap="round"/>`;
        const left = chisel([14.4, 46.8], [11.4, 49.8]) + arm(this, [16.4, 38.8], [14.6, 46.6], [12.2, 42.4]);
        const sparks = n ? [[10.6, 43.4, 9.2, 41.6], [13.2, 42.6, 13.6, 40.4], [8.6, 45.8, 6.6, 45]].map(([a, b, x, y]) => L([a, b], [x, y], "#F2C94C", 0.8)).join("") + `<g transform="rotate(-12 6.4 41.4)">${E(6.4, 41.4, 1.1, 0.8, OUT, 0)}${L([7.35, 41.4], [7.35, 37.8], OUT, 0.6)}<path d="M7.35,37.8 Q9,38.4 8.6,39.8" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>` : "";
        const right = n === 0 ? mallet([34, 30.4], 160) + arm(this, [31.6, 38.8], [34, 30.4], [37, 36.6]) : mallet([19.6, 44.6], 118) + arm(this, [31.6, 38.8], [19.6, 44.6], [33.4, 46.2]);
        return { expr: n ? "content" : "neutre", left: block + rune + runeLine + left, right: "", over: right + sparks };
      }
    };
    module.exports = galet;
  }
});

// atelier/galet.js
var require_galet2 = __commonJS({
  "atelier/galet.js"(exports, module) {
    module.exports = require_galet();
  }
});

// personnages/melisse.js
var require_melisse = __commonJS({
  "personnages/melisse.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var C = {
      skin: "#C68A62",
      skinS: "#A9704C",
      hand: "#8E6A4E",
      hair: "#2B2230",
      hairS: "#1C1620",
      hairH: "#4A3E52",
      straw: "#E3C27A",
      strawS: "#BF9A52",
      strawH: "#F2DCA0",
      band: "#7A4A6A",
      lavender: "#A88BD0",
      pink: "#E89AB0",
      yellow: "#F2C94C",
      shawl: "#2E3A6B",
      shawlS: "#232C52",
      moon: "#F4EEDF",
      dress: "#8FA27A",
      dressS: "#728560",
      iron: "#6E7480",
      ironS: "#545A65",
      ironH: "#9AA2AD",
      glow: "#F6E7A0",
      cheek: "#E39A8A",
      mouth: "#6A3028",
      tongue: "#D9786E"
    };
    var crescent = /* @__PURE__ */ __name((x, y, r, fill = C.moon) => `<path d="M${r22(x)},${r22(y - r)} A${r} ${r} 0 1 0 ${r22(x)},${r22(y + r)} A${r22(r * 0.72)} ${r} 0 1 1 ${r22(x)},${r22(y - r)} Z" fill="${fill}"/>`, "crescent");
    var posy = /* @__PURE__ */ __name((x, y) => [[0, 0, C.lavender], [1.6, -0.6, C.pink], [3, 0.2, C.yellow], [1.2, 1, C.lavender]].map(([dx, dy, f]) => E(x + dx, y + dy, 0.85, 0.85, f, 0.5)).join(""), "posy");
    function box(x, y, open = false) {
      const lid = open ? P(`M${r22(x - 3.7)},${r22(y - 2.2)} L${r22(x + 3.7)},${r22(y - 2.2)} L${r22(x + 2.8)},${r22(y - 5.2)} L${r22(x - 2.8)},${r22(y - 5.2)} Z`, C.ironS, 0.8) : `<rect x="${r22(x - 3.9)}" y="${r22(y - 3)}" width="7.8" height="1.6" rx="0.4" fill="${C.ironH}" stroke="${OUT}" stroke-width="0.8"/>`;
      return `<rect x="${r22(x - 3.7)}" y="${r22(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${C.iron}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x + 1.6)}" y="${r22(y - 1.8)}" width="1.6" height="3.8" fill="${C.ironS}"/>` + lid + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.35, 0.35, C.ironH, 0)).join("") + (open ? "" : `<rect x="${r22(x - 0.6)}" y="${r22(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${C.yellow}" stroke="${OUT}" stroke-width="0.5"/>`);
    }
    __name(box, "box");
    var DRESS = "M16.2,33 Q24,30.4 31.8,33 L34.6,53.6 Q24,56 13.4,53.6 Z";
    var SHAWL = "M15.2,32.6 Q24,29.6 32.8,32.6 L34.2,40.8 L30.4,38.6 Q24,41.6 17.6,38.6 L13.8,40.8 Z";
    var SHAWL_BACK = "M15.2,32.6 Q24,29.6 32.8,32.6 L33.6,36.2 L24,47.4 L14.4,36.2 Z";
    var melisse = {
      name: "Mélisse",
      uid: "me",
      teintes: [C.hair, C.straw, C.shawl, C.dress, C.lavender],
      skin: C.skin,
      skinS: C.skinS,
      hand: C.hand,
      sleeve: C.dress,
      cuff: null,
      armW: 3.8,
      leg: "#5A4A44",
      legS: "#463A35",
      legW: 4.4,
      hip: 50,
      ground: 56.8,
      shoe: "#A8743F",
      shoeS: "#7E5530",
      shoeH: "#C9965E",
      legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
      shoulders: [[16, 34.4], [32, 34.4]],
      hands: [[14.4, 45.4], [33.6, 45.4]],
      action: ["face_graines", "front"],
      // la boîte à graines serrée contre elle : le bras gauche ne balance pas
      restLeft(c, { view }) {
        if (view === "ne") return arm(c, [16, 34.4], [15.6, 41.8], [13.2, 40.2]);
        const k = view === "se" ? -1.6 : 0;
        return box(21.8 + k, 43.4) + arm(c, [16, 34.4], [19.6 + k, 43.2], [13, 41]);
      },
      body(c, { view }) {
        let s = P(DRESS, C.dress) + clip(`${c.uid}d`, DRESS, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="10" height="28" fill="${C.dressS}"/><path d="M12,52.6 Q24,55.2 36,52.6 L36,58 L12,58 Z" fill="${C.dressS}"/>`) + P(DRESS, "none");
        if (c.noShawl) return s;
        const sh = view === "ne" ? SHAWL_BACK : SHAWL;
        const moons = view === "ne" ? [[19.6, 36.2], [24, 41.4], [28.4, 36.2], [24, 34.2]] : [[16.6, 36.4], [31.4, 36.4], [20.4, 35], [27.6, 35]];
        s += P(sh, C.shawl) + clip(`${c.uid}s`, sh, `<rect x="${view === "se" ? 26.6 : 28}" y="28" width="9" height="22" fill="${C.shawlS}"/>` + moons.map(([x, y]) => crescent(x, y, 1)).join("")) + P(sh, "none");
        const fr = view === "ne" ? [[22.4, 46], [24, 47.6], [25.6, 46]] : [[14.4, 40.6], [15.4, 40], [32.6, 40], [33.6, 40.6]];
        return s + fr.map(([x, y]) => L([x, y], [x, y + 1.6], C.shawlS, 0.6)).join("");
      },
      // longue tresse sur l'épaule (de face et de trois quarts)
      neck(c, { view }) {
        if (view === "ne") return "";
        const k = view === "se" ? -1.4 : 0;
        let s = "";
        for (let i = 0; i < 5; i++) s += E(29.4 + k + (i % 2 ? -0.5 : 0.2), 31.6 + i * 2.4, 1.6, 1.5, C.hair, 0.8);
        return s + L([30 + k, 31], [29.4 + k, 33.6], C.hairH, 0.7) + E(29.2 + k, 44.2, 0.9, 0.9, C.pink, 0.6);
      },
      head(c, ctx) {
        const { view } = ctx;
        const brim = /* @__PURE__ */ __name((m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">` + E(24, 12.4, 17.6, 4.4, C.straw) + clip(`${ctx.id}b${m}`, "M6,12.4 a18,4.8 0 1,0 36,0 a18,4.8 0 1,0 -36,0 Z", `<ellipse cx="22" cy="11" rx="16" ry="3.4" fill="${C.strawH}"/><rect x="31" y="6" width="12" height="12" fill="${C.strawS}"/>`) + E(24, 12.4, 17.6, 4.4, "none") + "</g>", "brim");
        const crown = /* @__PURE__ */ __name((m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">` + P("M15.4,12.2 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.2 Q24,14 15.4,12.2 Z", C.straw) + P("M15.6,9.6 Q24,11.4 32.4,9.6 L32.6,12.2 Q24,14 15.4,12.2 Z", C.band, 0.8) + posy(16.8, 9.8) + L([18, 6], [21.4, 4.6], C.strawH, 1) + "</g>", "crown");
        let s = "";
        if (view === "ne") {
          const back2 = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.6,29.4 35.4,32.2 Q30,33.8 24,33.8 Q18,33.8 12.6,32.2 Q10.4,29.4 11.2,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="8" width="34" height="26" fill="${C.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M18,17 Q17.4,24 19,30.6", "none", 0.6) + P("M29.6,17 Q30.4,24 28.8,30.8", "none", 0.6) + P("M24,18 Q24.4,25 23.4,31.4", "none", 0.6);
          for (const [x, y] of [[22.6, 31.8], [20.4, 33.2], [18.2, 34.4]]) s += E(x, y, 1.6, 1.45, C.hair, 0.8);
          s += L([22, 31.2], [21, 31.9], C.hairH, 0.6);
          return s + brim(-1) + crown(-1);
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const back = "M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z";
        const bangs = sx("M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.4 L23,15.2 Q15,15.6 12.4,20 Z");
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="5.6" fill="${C.skinS}" opacity="0.6"/>` + cheeks.map(([x, r]) => E(x, 26.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.95, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L([16 + k, 15.2], [20.6 + k, 14.4], C.hairH, 0.9);
        s += `<g transform="translate(${k} 0)">${brim()}${crown()}</g>`;
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.5], [25.2, 22.8, 1.3]] : [[19.4, 22.8, 1.55], [28.6, 22.8, 1.55]],
          ry: 2.3,
          brow: C.hairS,
          browY: -4.1,
          browW: 1,
          ...TRAITS.femme,
          // au repos : paupières lourdes et un sourire en coin, mystérieuse et tranquille
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.4],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.3)} Q${r22(mx + 0.2)},${r22(my + 1.2)} ${r22(mx + 1.4)},${r22(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.4,
          temple: [se ? 11.6 : 10.8, 22.8],
          anger: [40.4, 6],
          zz: [36.4, 7.6]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34.4], lerp([37.4, 25.8], [38.8, 27.8], k)) };
        }
        const seeds = n ? [[22.4, 37.2, 0.7], [25.6, 35.6, 0.8], [23.8, 33.6, 0.6], [20.6, 34.4, 0.55], [27.6, 33, 0.5]].map(([x, y, r]) => E(x, y, r * 2.2, r * 2.2, C.glow, 0).replace("fill=", 'fill-opacity="0.45" fill=') + E(x, y, r, r, C.yellow, 0.4)).join("") + crescent(31, 36.6, 1.5, C.glow) : "";
        const left = box(24, 43.6, n === 1) + seeds + arm(this, [16, 34.4], [20.4, 43.4], [12.8, 40.6]);
        const right = arm(this, [32, 34.4], [27.6, 43.4], [35.2, 40.6]);
        return { expr: n ? "content" : "neutre", left, right };
      }
    };
    module.exports = melisse;
  }
});

// atelier/melisse.js
var require_melisse2 = __commonJS({
  "atelier/melisse.js"(exports, module) {
    module.exports = require_melisse();
  }
});

// atelier/naufrages.js
var require_naufrages = __commonJS({
  "atelier/naufrages.js"(exports, module) {
    var { castaway, weed, smudge, cord, fade, CANVAS } = require_naufrage();
    var { OUT, P, E, L, clip, limb, r2: r22, dechirure, filPendant } = require_troupe2();
    var hem = /* @__PURE__ */ __name((x0, x1, y0, yc) => (x) => {
      const t = (x - x0) / (x1 - x0);
      return r22(y0 + 2 * (yc - y0) * t * (1 - t));
    }, "hem");
    var lock = /* @__PURE__ */ __name((d, color) => cord(d, 1.2, color), "lock");
    var walkSway = /* @__PURE__ */ __name((k) => (ctx) => ctx.walk ? ctx.ph * k : 0, "walkSway");
    var SPECS = {
      // Aster : ciré délavé et déchiré, pantalon retroussé, pieds nus, une voile nouée, une algue dans les cheveux
      Aster: (() => {
        const y = hem(13, 35, 47.5, 51), coatS = "#CC9A2F";
        return {
          fade: ["#F2C04B", "#CC9A2F", "#FFE49A", "#C8463A", "#9A2F28", "#2F5684", "#22416A"],
          k: 0.6,
          skinS: "#DDA982",
          leg: "roll",
          sleeves: "torn",
          // sa voile à elle : la toile d'une voile de bateau, bande de renfort rouge, un œillet de laiton
          cape: CANVAS,
          capeExtra: /* @__PURE__ */ __name((view) => `<rect x="0" y="${view === "ne" ? 39.2 : 38.6}" width="48" height="1.15" fill="#C8463A" opacity="0.9"/><circle cx="${view === "ne" ? 30.4 : view === "se" ? 15.2 : 16.4}" cy="${view === "ne" ? 36.6 : 36.4}" r="0.75" fill="none" stroke="#B08A3A" stroke-width="0.55"/>`, "capeExtra"),
          tatters: { front: [[17, y(17), coatS], [30, y(30), coatS, 1.8]], se: [[16.4, y(16.4), coatS], [29.4, y(29.4), coatS, 1.8]], ne: [[18.6, y(18.6), coatS], [30.4, y(30.4), coatS, 1.8]] },
          holes: { front: [[17.6, 45.2, 1.1, "#9C7424"]], se: [[16.8, 45.2, 1.1, "#9C7424"]], ne: [[27.6, 45.4, 1.1, "#9C7424"]] },
          rips: { front: [[29.6, 44.6]], se: [[28, 44.8]], ne: [[19.4, 44.6]] },
          head: /* @__PURE__ */ __name(({ view }) => view === "ne" ? weed("M27.6,6.6 Q34.6,7.4 36.2,12.6 Q37.4,16.8 35.6,20.6", [[36.6, 13.8, -20]]) : view === "se" ? weed("M18.8,7.6 Q13.6,8.4 12.6,13.2 Q11.8,17.4 13.2,20.2", [[12.4, 13.4, 30]]) + smudge(29.4, 28.6) : weed("M18.4,7.4 Q12.8,8.2 11.8,13.2 Q11,17.4 12.4,20.4", [[11.6, 13.4, 30]]) + smudge(31.4, 28.8), "head")
        };
      })(),
      // Cannelle : robe et tablier délavés et effrangés, jambes et pieds nus, le chignon à moitié défait (mèches grises) ;
      // une couverture rayée jetée sur les épaules, les deux pans croisés sur la poitrine et noués devant
      Cannelle: (() => {
        const y = hem(10.4, 37.6, 53.6, 57.2), ya = hem(15, 33, 53.4, 55.6), dS = "#84402B";
        const B = { cloth: "#93A9C2", shade: "#738AA6", stripe: "#E9EEF3", knot: "#7D94B0" };
        const fringe = /* @__PURE__ */ __name((x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => {
          const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, yy = y0 + (y1 - y0) * t;
          return L([x, yy + 0.3], [x - 0.2, yy + 1.7], B.shade, 0.55);
        }).join(""), "fringe");
        const stripes = /* @__PURE__ */ __name((ys) => ys.map((yy) => `<path d="M0,${yy} Q24,${r22(yy + 1.6)} 48,${yy}" stroke="${B.stripe}" stroke-width="0.85" fill="none"/>`).join(""), "stripes");
        const blanket = /* @__PURE__ */ __name((cc, { view }) => {
          if (view === "ne") {
            const d = "M11.8,36 Q13,32 18.4,31.2 Q24,32.6 29.6,31.2 Q35,32 36.2,36 L36.6,43.6 Q30.4,46.2 24,46.4 Q17.6,46.2 11.4,43.6 Z";
            return fringe(11.8, 43.8, 36.2, 43.8, 9) + P(d, B.cloth) + clip(`${cc.uid}cv`, d, stripes([38.2, 41.2]) + `<rect x="27" y="28" width="14" height="22" fill="${B.shade}" opacity="0.75"/>`) + P(d, "none");
          }
          const k = view === "se" ? -2 : 0, far = view === "se" ? 0.82 : 1;
          const X = /* @__PURE__ */ __name((x) => r22(24 + k + (x - 24) * (x > 24 ? far : 1)), "X");
          const left = `M${X(18.6)},31.4 Q${X(13)},32.4 ${X(11.8)},37.6 L${X(12.2)},44.2 Q${X(17.2)},45.6 ${X(23.4)},44.6 L${X(25.4)},41 Q${X(22.4)},36.2 ${X(21)},32.4 Z`;
          const right = `M${X(29.4)},31.4 Q${X(35)},32.4 ${X(36.2)},37.6 L${X(35.8)},44.2 Q${X(30.8)},45.6 ${X(24.6)},44.6 L${X(22.6)},41 Q${X(25.6)},36.2 ${X(27)},32.4 Z`;
          let o = fringe(X(12.4), 44.4, X(23.2), 44.8, 5) + fringe(X(24.8), 44.8, X(35.6), 44.4, 5);
          o += P(left, B.cloth) + clip(`${cc.uid}cl`, left, stripes([38.6, 41.6])) + P(left, "none");
          o += P(right, B.cloth) + clip(`${cc.uid}cr`, right, stripes([38.6, 41.6]) + `<rect x="${X(24)}" y="28" width="16" height="20" fill="${B.shade}" opacity="0.7"/>`) + P(right, "none");
          const kx = X(24);
          o += P(`M${r22(kx - 0.6)},42 L${r22(kx - 1.8)},45.6 L${r22(kx - 0.4)},45.2 Z`, B.knot, 0.7) + P(`M${r22(kx + 0.6)},42 L${r22(kx + 1.6)},45.4 L${r22(kx + 0.2)},45.2 Z`, B.knot, 0.7);
          o += E(kx, 41.6, 1.9, 1.5, B.knot) + P(`M${r22(kx - 1)},41.2 Q${kx},42 ${r22(kx + 1)},41.2`, "none", 0.5);
          return o;
        }, "blanket");
        return {
          fade: ["#A8553A", "#84402B", "#C46E4E", "#F4E9D8", "#DCCDB5"],
          skinS: "#CF9C72",
          leg: "skin",
          capeFn: blanket,
          sway: walkSway(0.7),
          tatters: { front: [[12.8, y(12.8), dS, 1.8], [35.2, y(35.2), dS, 1.8], [26.4, ya(26.4), "#F4E9D8", 1.5, 0.8]], se: [[12.6, y(12.6), dS, 1.8], [35.4, y(35.4), dS, 1.8], [24.2, ya(26.2), "#F4E9D8", 1.5, 0.8]], ne: [[13.4, y(13.4), dS, 1.8], [22, y(22), dS], [34.6, y(34.6), dS, 1.8]] },
          holes: { front: [[33.6, 50.4, 0.9, "#6A3322"]], se: [[33.8, 50.6, 0.9, "#6A3322"]], ne: [[30.2, 50.8, 1, "#6A3322"]] },
          rips: { front: [[20.6, 50.8, 2.2]], se: [[18.8, 50.8, 2.2]], ne: [[16.6, 50.4, 2.4]] },
          head: /* @__PURE__ */ __name(({ view }) => {
            const hair = "#D9D4CC";
            if (view === "ne") return lock("M14.2,22 Q11.4,26.4 12.8,30.4", hair) + lock("M33.8,22 Q36.4,26 35,29.6", hair) + lock("M26.6,11.6 Q30.6,12.4 31,16.4", hair);
            const k = view === "se" ? -0.6 : 0;
            return lock(`M${12.8 + k},18.4 Q${10.6 + k},22.2 ${12 + k},26`, hair) + (view === "se" ? "" : lock("M35.2,18.4 Q37.4,22.2 36,26", hair)) + lock(`M${27.4 + k},9.4 Q${31.4 + k},9.8 ${32.4 + k},13.2`, hair) + smudge(view === "se" ? 27.8 : 31, 29.4);
          }, "head")
        };
      })(),
      // Rivet : chemise délavée aux manches retroussées, un bandage de chiffon sur l'avant-bras gauche, tablier de cuir
      // éraflé dont la poche à outils est à moitié arrachée, une loupe fêlée, pantalon retroussé, pieds nus, suie sur la joue
      Rivet: (() => {
        const ya = hem(15.8, 32.2, 52, 53.8), yt = hem(14.8, 33.2, 46.6, 48.8);
        const crack = /* @__PURE__ */ __name((x, y, r) => `<path d="M${r22(x - r * 0.55)},${r22(y - r * 0.5)} L${r22(x - r * 0.1)},${r22(y - r * 0.05)} L${r22(x - r * 0.3)},${r22(y + r * 0.45)} M${r22(x - r * 0.1)},${r22(y - r * 0.05)} L${r22(x + r * 0.5)},${r22(y + r * 0.1)}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>`, "crack");
        const pocket = /* @__PURE__ */ __name(({ view }) => {
          if (view === "ne") return "";
          const k = view === "se" ? -1.8 : 0;
          return `<rect x="${r22(24.2 + k)}" y="43.4" width="4.4" height="1.5" rx="0.3" fill="#3E2A1C"/>` + P(`M${r22(24.2 + k)},44.8 L${r22(28.8 + k)},44.8 Q${r22(28.4 + k)},47.6 ${r22(26.9 + k)},49.2 Q${r22(25.2 + k)},47.4 ${r22(24.2 + k)},44.8 Z`, "#73533C", 0.8) + L([25.2 + k, 45.6], [27.8 + k, 45.6], "#B08A68", 0.45);
        }, "pocket");
        return {
          fade: ["#3F8A86", "#2E6B68", "#EFE6D6", "#4A4E5C", "#383B47"],
          map: { "#8A5A36": "#93694A", "#6B4328": "#73533C", "#A87650": "#B08A68" },
          // cuir un peu passé
          skinS: "#C08A62",
          leg: "roll",
          sleeves: "roll",
          sleeveCut: 6.4,
          bandage: "left",
          over: pocket,
          tatters: { front: [[15.4, yt(15.4), "#2E6B68", 1.1, 0.8], [32.6, yt(32.6), "#2E6B68", 1.1, 0.8], [21, ya(21), "#6B4328", 1.5, 0.8]], se: [[15.2, yt(15.2), "#2E6B68", 1.1, 0.8], [32.8, yt(32.8), "#2E6B68", 1.1, 0.8], [19.2, ya(21), "#6B4328", 1.5, 0.8]], ne: [[17.4, yt(17.4), "#3F8A86", 1.6], [24.4, yt(24.4), "#3F8A86", 1.4], [30.6, yt(30.6), "#2E6B68", 1.6]] },
          holes: { ne: [[20.6, 37.8, 1, "#24504E"]] },
          rips: { front: [[28.4, 50.6, 2]], se: [[26.6, 50.6, 2]], ne: [[28.4, 44.6, 2.2]] },
          head: /* @__PURE__ */ __name(({ view, pose }) => {
            if (view === "ne") return "";
            const lens = pose === "action" ? [28.6, 22.8, 2.9] : view === "se" ? [26.6, 10.4, 2.5 * 0.68] : [28.6, 10.8, 2.9 * 0.68];
            return crack(...lens) + smudge(view === "se" ? 27.6 : 30.8, 28.6, "#6E5E54");
          }, "head")
        };
      })(),
      // Ondin : ciré délavé et effrangé, le bout du bonnet arraché (le pompon pend au bout d'un fil), une petite étoile de
      // mer accrochée au ciré, une algue prise dans le bonnet ; bocal vide, baguette sauvée
      Ondin: (() => {
        const y = hem(13, 35, 52.4, 55), cS = "#2E5F9E", HY = 4.4;
        const POM = E(41.6, 24.4, 2.2, 2.2, "#F4EEDF") + E(42.2, 25.2, 0.8, 0.7, "#DCCDB5", 0);
        const hanging = /* @__PURE__ */ __name((k, m, n) => {
          const tip = [24 + (41.8 + k - 24) * m, 23.4], swing = n % 2 ? 0.5 : -0.3;
          const end = [24 + (42.6 + k - 24) * m + swing, 28];
          return `<path d="M${r22(tip[0])},${tip[1]} Q${r22((tip[0] + end[0]) / 2 + 0.6 * m)},${r22(25.8)} ${r22(end[0])},${end[1]}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>` + E(end[0], end[1] + 1.8, 2, 2, "#F4EEDF") + E(end[0] + 0.5 * m, end[1] + 2.5, 0.75, 0.65, "#DCCDB5", 0) + L([tip[0] - 0.8, tip[1] + 0.2], [tip[0] + 0.7, tip[1] + 0.5], OUT, 0.5);
        }, "hanging");
        const star = /* @__PURE__ */ __name((x, yy, r, rot) => {
          const p = Array.from({ length: 10 }, (_, i) => {
            const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.46 : r;
            return `${r22(x + Math.cos(a) * rr)},${r22(yy + Math.sin(a) * rr)}`;
          }).join(" L");
          return `<g transform="rotate(${rot} ${x} ${yy})"><path d="M${p} Z" fill="#F2995A" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + [[0, -0.55], [0.5, 0.1], [-0.5, 0.1], [0, 0.5]].map(([dx, dy]) => E(x + dx * r, yy + dy * r, 0.28, 0.28, "#FFD9B3", 0)).join("") + "</g>";
        }, "star");
        return {
          fade: ["#3D7CC9", "#2E5F9E", "#7DB0E8", "#A9CBEF", "#BFD3F2", "#93AEDB"],
          over: /* @__PURE__ */ __name(({ view }) => view === "ne" ? star(28.2, 43, 2.7, -12) : star(view === "se" ? 21.2 : 21, 42.2, 2.7, 16), "over"),
          tatters: { front: [[16, y(16), cS], [31, y(31), cS, 1.8]], se: [[15.6, y(15.6), cS], [30.2, y(30.2), cS, 1.8]], ne: [[17.4, y(17.4), cS], [30.6, y(30.6), cS, 1.8]] },
          holes: { front: [[17.2, 50.8, 0.9, "#264E82"]], se: [[16.4, 51, 0.9, "#264E82"]], ne: [[28.8, 50.6, 1, "#264E82"]] },
          rips: { front: [[30.4, 50.2, 2]], se: [[28.8, 50.4, 2]], ne: [[18.6, 50.6, 2]] },
          headFix: /* @__PURE__ */ __name((h, { view, n }) => {
            const k = view === "se" ? -1.4 : 0, m = view === "ne" ? -1 : 1;
            return h.split(POM).join("").replace(/<\/g>$/, hanging(k, m, n) + "</g>");
          }, "headFix"),
          head: /* @__PURE__ */ __name(({ view }) => {
            if (view === "ne") return weed(`M31,${6.4 + HY} Q34.6,${7.6 + HY} 35.2,${11.2 + HY} Q35.6,${13.8 + HY} 34.6,${16 + HY}`, [[35.6, 12 + HY, -24]]);
            const k = view === "se" ? -1.4 : 0;
            return weed(`M${18 + k},${5.8 + HY} Q${14.2 + k},${7.2 + HY} ${13.4 + k},${10.8 + HY} Q${13 + k},${13.4 + HY} ${14 + k},${15.8 + HY}`, [[12.8 + k, 11.6 + HY, 30]]) + smudge(view === "se" ? 27.6 : 30.8, 28.4 + HY);
          }, "head")
        };
      })(),
      // Sylve : sa cape de feuilles est perdue (il ne reste que la liane et quelques feuilles flétries), tunique délavée et
      // trouée, une bande de voile nouée en ceinture, de la boue sur la joue
      Sylve: (() => {
        const W1 = { leaf: "#8C9A4E", leafS: "#6E7A3A", vine: "#6E7440" };
        const leafAt = /* @__PURE__ */ __name((x, y, len, w, rot) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">` + P(`M0,0 Q${w},${r22(len / 2)} 0,${len} Q${-w},${r22(len / 2)} 0,0 Z`, W1.leaf, 0.7) + L([0, 0.6], [0, len - 0.8], W1.leafS, 0.4) + "</g>", "leafAt");
        const vine = /* @__PURE__ */ __name((d) => cord(d, 1, W1.vine), "vine");
        const remnant = /* @__PURE__ */ __name(({ view }) => view === "ne" ? "" : vine("M15.6,33.4 Q12.2,38 12.6,45.6") + leafAt(12.4, 40.4, 3.2, 1.3, 40) + leafAt(12.8, 45, 3.4, 1.3, 14), "remnant");
        const belt = /* @__PURE__ */ __name(({ view }) => {
          const k = view === "se" ? -1.6 : 0;
          const band = "M15,41.3 Q24,43.1 33,41.3 L33.1,43.5 Q24,45.3 14.9,43.5 Z";
          let o = P(band, "#E6DCC3") + clip(`sybelt${view}`, band, '<rect x="26" y="40" width="10" height="6" fill="#C9BB98"/>') + P(band, "none");
          if (view === "ne") {
            return [[19.2, 43.2, 16], [22.6, 44, 4], [27.6, 43.8, -10]].map(([x, y, r]) => leafAt(x, y, 3.6, 1.4, r)).join("") + o;
          }
          const kx = 19.6 + k;
          o += P(`M${r22(kx - 0.4)},43.6 L${r22(kx - 1.8)},47.8 L${r22(kx - 0.2)},47.6 Z`, "#E6DCC3", 0.7) + P(`M${r22(kx + 0.6)},43.6 L${r22(kx + 1.4)},47.2 L${r22(kx)},47.4 Z`, "#C9BB98", 0.7);
          return o + E(kx, 42.9, 1.5, 1.2, "#D6CBAE", 0.8);
        }, "belt");
        return {
          flags: { noCape: true },
          fade: ["#A88655", "#86683E"],
          map: { "#5E9E4A": W1.leaf, "#467A37": W1.leafS, "#86C06A": "#B1B86C", "#4E7A34": W1.vine },
          overKeep: ["#5E9E4A", "#467A37", "#86C06A", "#4E7A34"],
          // la pousse qui jaillit reste verte
          backItems: /* @__PURE__ */ __name((cc, ctx) => remnant(ctx), "backItems"),
          over: belt,
          holes: { front: [[29.4, 38.2, 0.9, "#6E5530"]], se: [[28, 38.4, 0.9, "#6E5530"]], ne: [[20.4, 40.2, 1, "#6E5530"]] },
          rips: { front: [[18.4, 37.4, 2]], se: [[17, 37.6, 2]], ne: [[28.4, 38.6, 2]] },
          head: /* @__PURE__ */ __name(({ view }) => view === "ne" ? "" : smudge(view === "se" ? 15.4 : 17.4, 29.6, "#7A5E44"), "head")
        };
      })(),
      // Galet : un sac de jute du caboteur porté en poncho (trou pour la tête, bas effiloché, corde à la taille), blouse et
      // pantalon délavés ; il a perdu un sabot : pied droit nu, pantalon retroussé de ce côté
      Galet: /* @__PURE__ */ (() => {
        const HY = 4.4;
        const J = { cloth: "#C2A574", shade: "#9E8456", dot: "#A88C5C", rope: "#7A5A3A" };
        const weave = /* @__PURE__ */ __name((x0, x1, y0, y1) => {
          let o = "";
          for (let yy = y0; yy < y1; yy += 2.2) for (let x = x0 + (Math.round(yy * 10) % 2 ? 1 : 0); x < x1; x += 2.6) o += `<rect x="${r22(x)}" y="${r22(yy)}" width="0.9" height="0.5" fill="${J.dot}" opacity="0.8"/>`;
          return o;
        }, "weave");
        const poncho = /* @__PURE__ */ __name((cc, { view }) => {
          const k = view === "se" ? -1.6 : 0, far = view === "se" ? 0.84 : 1;
          const X = /* @__PURE__ */ __name((x) => r22(24 + k + (x - 24) * (x > 24 ? far : 1)), "X");
          const tear = dechirure([X(12.8), 48.2], [24 + k, 50.4], [X(35.2), 48.2], view === "ne" ? 8 : 6);
          const bottom = `${X(12.8)},48.2 ${tear.d}`;
          const d = view === "ne" ? `M${X(17.4)},36.6 Q${X(13.4)},37.4 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.6)},37.4 ${X(30.6)},36.6 Q24,37.8 ${X(17.4)},36.6 Z` : `M${X(17.6)},37 Q${X(13.6)},37.6 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.4)},37.6 ${X(30.4)},37 Q${24 + k},39.4 ${X(17.6)},37 Z`;
          let o = P(d, J.cloth) + clip(`${cc.uid}pj`, d, weave(10, 38, 38, 50) + `<rect x="${X(28)}" y="34" width="12" height="18" fill="${J.shade}" opacity="0.8"/><path d="M${X(12)},43.2 Q${24 + k},44.6 ${X(36)},43.2" fill="none" stroke="#8A6E44" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, "none");
          o += tear.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
          o += cord(`M${X(12.9)},45.4 Q${24 + k},47.4 ${X(35.3)},45.4`, 0.8, J.rope);
          if (view !== "ne") o += E(X(31.4), 46.1, 1.2, 0.9, J.rope, 0.7) + cord(`M${X(31.2)},46.8 L${X(30.6)},49.6`, 0.6, J.rope) + cord(`M${X(31.8)},46.8 L${X(32.6)},49.2`, 0.6, J.rope);
          return o;
        }, "poncho");
        return {
          fade: ["#6E6458", "#564E44", "#55504A", "#403C37", "#B5562E", "#8E3F20", "#D07448"],
          skinS: "#9C968B",
          leg: "roll",
          bareSide: "right",
          capeFn: poncho,
          tatters: { front: [[16, 51.4, "#6E6458", 1.6], [31.6, 51.5, "#564E44", 1.6]], se: [[15.6, 51.4, "#6E6458", 1.6], [30.6, 51.5, "#564E44", 1.6]], ne: [[17, 51.4, "#6E6458", 1.6], [31.4, 51.5, "#564E44", 1.6]] },
          head: /* @__PURE__ */ __name(() => "", "head")
        };
      })(),
      // Mélisse : robe délavée et déchirée, le châle couleur nuit noué à la taille (la pointe pend dans le dos), le chapeau
      // de paille déchiré au bord, cabossé et effiloché, une algue accrochée au bord ; jambes nues et un sabot perdu
      Melisse: (() => {
        const y = hem(13.4, 34.6, 53.6, 56), dS = "#728560";
        const SH = fade("#2E3A6B"), SHS = fade("#232C52"), MOON = "#F4EEDF";
        const straw = /* @__PURE__ */ __name((x, yy, dx, dy) => L([x, yy], [x + dx, yy + dy], OUT, 1.5) + L([x, yy], [x + dx, yy + dy], "#E3C27A", 0.7), "straw");
        const crescent = /* @__PURE__ */ __name((x, yy, r) => `<path d="M${r22(x)},${r22(yy - r)} A${r} ${r} 0 1 0 ${r22(x)},${r22(yy + r)} A${r22(r * 0.72)} ${r} 0 1 1 ${r22(x)},${r22(yy - r)} Z" fill="${MOON}"/>`, "crescent");
        const shawl = /* @__PURE__ */ __name(({ view }) => {
          const band = "M14.6,43 Q24,45.2 33.4,43 L33.8,46.2 Q24,48.4 14.2,46.2 Z";
          let o = "";
          if (view === "ne") {
            const tri = "M15.2,45.6 Q24,47.6 32.8,45.6 L24.4,55 L23.6,55 Z";
            o += P(tri, SH) + clip(`meltri`, tri, `<rect x="24" y="40" width="12" height="18" fill="${SHS}"/>` + crescent(21.6, 48.6, 0.9) + crescent(25.6, 49.6, 0.9) + crescent(23.8, 52.4, 0.8)) + P(tri, "none") + [23.2, 24.8].map((x) => L([x, 54.8], [x, 56.4], SHS, 0.55)).join("");
          }
          o += P(band, SH) + clip(`melband${view}`, band, `<rect x="27.6" y="40" width="10" height="10" fill="${SHS}"/>` + crescent(18.6, 44.8, 0.8) + crescent(23.4, 45.8, 0.8)) + P(band, "none");
          if (view !== "ne") {
            const k = view === "se" ? -1.4 : 0, kx = 31.4 + k * 0.4;
            o += P(`M${r22(kx - 0.6)},46.4 L${r22(kx - 1.8)},51.4 L${r22(kx - 0.2)},51 Z`, SH, 0.7) + P(`M${r22(kx + 0.6)},46.4 L${r22(kx + 1.6)},50.6 L${r22(kx + 0.2)},50.8 Z`, SHS, 0.7) + E(kx, 45.6, 1.6, 1.3, SHS, 0.8) + [kx - 1.8, kx + 1.6].map((x) => L([x, 51], [x, 52.2], SHS, 0.5)).join("");
          }
          return o;
        }, "shawl");
        const hatDamage = /* @__PURE__ */ __name((k, m) => {
          const X = /* @__PURE__ */ __name((x) => r22(24 + (x - 24) * m + k), "X");
          return `<path d="M${X(11.4)},15.4 L${X(13)},13.4 L${X(14.2)},14.6 L${X(15.6)},12.9" fill="none" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"/>` + P(`M${X(11.4)},15.4 L${X(13)},13.4 L${X(10.6)},12.6 Z`, "#D9C08E", 0.6) + P(`M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2 L${X(20.6)},6.6 Z`, "#A88E5E", 0) + `<path d="M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        }, "hatDamage");
        return {
          flags: { noShawl: true },
          fade: ["#8FA27A", "#728560", "#2E3A6B", "#232C52", "#E3C27A", "#BF9A52", "#F2DCA0", "#7A4A6A", "#A8743F", "#7E5530", "#C9965E"],
          skinS: "#A9704C",
          leg: "skin",
          bareSide: "left",
          over: shawl,
          tatters: { front: [[16, y(16), dS], [31.6, y(31.6), dS, 1.8]], se: [[15.6, y(15.6), dS], [30.8, y(30.8), dS, 1.8]], ne: [[17, y(17), dS], [31, y(31), dS, 1.8]] },
          holes: { front: [[29.6, 38.6, 0.9, "#5C6E4C"]], se: [[28.2, 38.6, 0.9, "#5C6E4C"]], ne: [[19.4, 38.6, 1, "#5C6E4C"]] },
          rips: { front: [[19.6, 50.4, 2.2]], se: [[18.2, 50.4, 2.2]], ne: [[28.6, 50.6, 2.2]] },
          head: /* @__PURE__ */ __name(({ view }) => {
            if (view === "ne") return hatDamage(0, -1) + straw(40.6, 13.6, 2.6, 1.2) + straw(41.2, 12.2, 2.8, -0.4) + weed("M13.6,15.4 Q10.8,18.4 12,22.6", [[11.4, 19.2, 26]]);
            const k = view === "se" ? -1.4 : 0;
            return hatDamage(k, 1) + straw(7.2 + k, 13.4, -2.6, 1) + straw(6.8 + k, 12, -2.8, -0.6) + straw(8.4 + k, 14.8, -1.8, 1.8) + weed(`M${34.4 + k},15.4 Q${37 + k},18.4 ${35.8 + k},22.6`, [[36.6 + k, 19.4, -24]]) + smudge(view === "se" ? 15.6 : 17.6, 29);
          }, "head")
        };
      })()
    };
    var BASE = { Aster: require_aster2(), Cannelle: require_cannelle2(), Rivet: require_rivet2(), Ondin: require_ondin2(), Sylve: require_sylve2(), Galet: require_galet2(), Melisse: require_melisse2() };
    var CAST = Object.entries(BASE).map(([k, c]) => ({ base: c, nau: castaway(c, SPECS[k]) }));
    CAST.find((x) => x.base.name === "Sylve").nau.nauMound = { fill: fade("#A88655"), shade: fade("#86683E"), hi: fade("#C2A274"), leaf: "#8C9A4E" };
    for (const n of ["Galet", "Sylve"]) CAST.find((x) => x.base.name === n).nau.sansDon = true;
    module.exports = { CAST, SPECS };
  }
});

// atelier/gestes.js
var require_gestes = __commonJS({
  "atelier/gestes.js"(exports, module) {
    var { OUT, P, E, L, limb, zee, r2: r22, frame, arm } = require_troupe2();
    var CADRE_PARAPLUIE = [0, -18, 48, 82];
    var CADRE_COUCHE = [0, 0, 64, 48];
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "trait");
    var lueur = /* @__PURE__ */ __name((x, y, r, a = 0.5) => [1, 0.66, 0.4].map((k, i) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r * k)}" fill="rgba(255,214,120,${r22(a * (0.3 + i * 0.3))})"/>`).join(""), "lueur");
    function lanterne(h, n = 0) {
      return `<g transform="translate(${r22(h[0])} ${r22(h[1])}) scale(1.3) translate(${r22(-h[0])} ${r22(-h[1])})">${petiteLanterne(h, n)}</g>`;
    }
    __name(lanterne, "lanterne");
    function petiteLanterne(h, n) {
      const [x, y0] = h, y = y0 + 1.4;
      const flamme = n % 2 ? "M0,-1.6 Q1,0 0,1.2 Q-1,0 0,-1.6 Z" : "M0,-1.9 Q0.8,0.1 0,1.2 Q-0.9,-0.1 0,-1.9 Z";
      return P(`M${r22(x - 1.6)},${r22(y + 1.4)} Q${x},${r22(y - 1.8)} ${r22(x + 1.6)},${r22(y + 1.4)}`, "none", 0.8) + lueur(x, y + 4.6, 4.6, 0.55) + P(`M${r22(x - 2.6)},${r22(y + 2.6)} L${r22(x + 2.6)},${r22(y + 2.6)} L${r22(x + 1.8)},${r22(y + 1.2)} L${r22(x - 1.8)},${r22(y + 1.2)} Z`, "#5A4A3A", 0.8) + `<rect x="${r22(x - 2.1)}" y="${r22(y + 2.6)}" width="4.2" height="4.8" rx="0.6" fill="#FFE7A0" stroke="${OUT}" stroke-width="0.8"/><g transform="translate(${x} ${r22(y + 5.1)})">${P(flamme, "#F2A63A", 0.5)}</g>` + L([x - 2.1, y + 5], [x + 2.1, y + 5], "#5A4A3A", 0.5) + `<rect x="${r22(x - 2.6)}" y="${r22(y + 7.3)}" width="5.2" height="1.3" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.8"/>`;
    }
    __name(petiteLanterne, "petiteLanterne");
    function parapluie(h, col = "#D9443A") {
      const [x, y] = h, cx = x - 5, cy = -3.6;
      const r = 15, dark = "#8E2A24";
      const toile = `M${r22(cx - r)},${r22(cy + 2.4)} Q${r22(cx - r)},${r22(cy - 9.6)} ${r22(cx)},${r22(cy - 10.4)} Q${r22(cx + r)},${r22(cy - 9.6)} ${r22(cx + r)},${r22(cy + 2.4)}` + [0.75, 0.5, 0.25, 0].map((k) => ` Q${r22(cx + r * (k + 0.125) * 2 - r)},${r22(cy + 0.8)} ${r22(cx + r * k * 2 - r)},${r22(cy + 2.4)}`).join("") + " Z";
      const pans = [-0.5, 0, 0.5].map((k) => trait(`M${r22(cx)},${r22(cy - 10.2)} Q${r22(cx + r * k * 0.9)},${r22(cy - 6)} ${r22(cx + r * k * 1.5)},${r22(cy + 2.2)}`, dark, 0.6)).join("");
      return limb([x, y + 1], [cx, cy + 1.6], 0.8, "#7A5A3A") + P(`M${r22(x)},${r22(y + 1)} q0,3 -2.4,3`, "none", 1.2) + P(toile, col) + `<path d="M${r22(cx + r * 0.25)},${r22(cy - 9)} Q${r22(cx + r * 0.8)},${r22(cy - 6)} ${r22(cx + r)},${r22(cy + 2.4)} L${r22(cx + r * 0.5)},${r22(cy + 2.4)} Q${r22(cx + r * 0.4)},${r22(cy - 4)} ${r22(cx + r * 0.25)},${r22(cy - 9)} Z" fill="${dark}" opacity="0.35"/>` + pans + P(toile, "none") + E(cx, cy - 11, 0.8, 0.8, "#7A5A3A", 0.6) + L([cx - r * 0.6, cy - 6.6], [cx - r * 0.25, cy - 8.6], "rgba(255,255,255,.55)", 0.9);
    }
    __name(parapluie, "parapluie");
    function valise(h, col = "#9A5A34") {
      const [x, y] = h;
      return P(`M${r22(x - 1.4)},${r22(y + 2.6)} Q${x},${r22(y + 0.2)} ${r22(x + 1.4)},${r22(y + 2.6)}`, "none", 1) + `<rect x="${r22(x - 4.4)}" y="${r22(y + 2.4)}" width="8.8" height="6.6" rx="1.2" fill="${col}" stroke="${OUT}" stroke-width="1"/><rect x="${r22(x + 1.2)}" y="${r22(y + 2.6)}" width="3" height="6.2" fill="rgba(60,40,25,.2)"/>` + [-2.4, 2].map((d) => L([x + d, y + 2.6], [x + d, y + 8.8], "#5A3A24", 0.7)).join("") + `<rect x="${r22(x - 1.2)}" y="${r22(y + 4.8)}" width="2.4" height="1.8" rx="0.3" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.5"/>`;
    }
    __name(valise, "valise");
    var avecLanterne = /* @__PURE__ */ __name((c) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h, ctx) => lanterne([h[0], Math.min(h[1], 49)], ctx.n), "hold"), holdOver: false }), "avecLanterne");
    var avecParapluie = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => parapluie(h, col), "hold"), holdOver: true }), "avecParapluie");
    var avecValise = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => valise(h, col), "hold"), holdOver: false }), "avecValise");
    var ZEDS = /<path d="M([-\d.]+),([-\d.]+) L([-\d.]+),\2 L\1,([-\d.]+) L\3,\4" fill="none"[^>]*\/>/g;
    function couche(c, n = 0, couverture = { fond: "#C98F5A", motif: "#E8C07A" }) {
      const corps = frame(c, "front", "repos", 0, "endormi").replace(ZEDS, "");
      const souffle = n ? -0.5 : 0;
      const couv = `M31,${r22(9.6 + souffle)} Q46,${r22(7.6 + souffle)} 60.6,10.4 Q62.8,24 60.6,37.6 Q46,40.4 31,${r22(38.4 - souffle)} Q28.6,24 31,${r22(9.6 + souffle)} Z`;
      return `<ellipse cx="32" cy="26" rx="29" ry="14" fill="rgba(40,55,20,.16)"/>` + E(9, 24, 7.6, 11, "#F4EEDF", 1.1) + L([4.6, 18], [6.4, 15.6], "#FFFFFF", 1) + `<g transform="translate(32 24) scale(0.95) translate(-32 -24)"><g transform="translate(0 48) rotate(-90)">${corps}</g></g>` + P(couv, couverture.fond, 1.2) + [16, 24, 32].map((y) => L([33, y + souffle * 0.5], [59.2, y], couverture.motif, 1.1)).join("") + P(`M31,${r22(9.6 + souffle)} Q28.6,24 31,${r22(38.4 - souffle)} L34.6,${r22(38.2 - souffle)} Q32.4,24 34.6,${r22(9.8 + souffle)} Z`, couverture.motif, 0.9) + (n ? zee(30.6, 6.4, 2) + zee(34, 2.4, 2.6) : zee(30, 7.4, 1.8) + zee(33, 3.6, 2.4));
    }
    __name(couche, "couche");
    function paume(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.85 * s, h = 2.5 * s;
      return E(x + k * w * 0.95, y + 0.5 * s, 0.95 * s, 1.35 * s, f, 0.9) + P(`M${r22(x - w)},${r22(y + h * 0.55)} L${r22(x - w)},${r22(y - h * 0.35)} Q${r22(x - w)},${r22(y - h)} ${r22(x)},${r22(y - h)} Q${r22(x + w)},${r22(y - h)} ${r22(x + w)},${r22(y - h * 0.35)} L${r22(x + w)},${r22(y + h * 0.55)} Q${r22(x)},${r22(y + h * 1.05)} ${r22(x - w)},${r22(y + h * 0.55)} Z`, f, 0.9) + (c.moufle ? "" : [-0.6, 0.6].map((d) => L([x + d * s, y - h + 0.35], [x + d * s, y - h * 0.35], OUT, 0.42)).join(""));
    }
    __name(paume, "paume");
    function tranche(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.3 * s, h = 2.5 * s;
      return P(`M${r22(x - w)},${r22(y + h * 0.6)} L${r22(x - w)},${r22(y - h * 0.4)} Q${r22(x - w)},${r22(y - h)} ${r22(x)},${r22(y - h)} Q${r22(x + w)},${r22(y - h)} ${r22(x + w)},${r22(y - h * 0.4)} L${r22(x + w)},${r22(y + h * 0.6)} Q${r22(x)},${r22(y + h)} ${r22(x - w)},${r22(y + h * 0.6)} Z`, f, 0.9) + E(x + k * w * 0.9, y + 0.6 * s, 0.8 * s, 1.1 * s, f, 0.8);
    }
    __name(tranche, "tranche");
    function tendre({ view, n }) {
      const [a, b] = this.shoulders;
      const w = n ? 0.45 : 0;
      if (view === "front") {
        const y = a[1] + 7, l = [a[0] + 1.7 - w, y + w], r = [b[0] - 1.7 + w, y + w];
        return {
          expr: "content",
          left: arm(this, a, l, [a[0] - 1.5, a[1] + 8.4], paume(this, [l[0], l[1] - 0.5], 1, 1.08)),
          right: arm(this, b, r, [b[0] + 1.5, b[1] + 8.4], paume(this, [r[0], r[1] - 0.5], -1, 1.08))
        };
      }
      if (view === "se") {
        return {
          expr: "content",
          left: arm(this, a, [a[0] - 6.4 - w, a[1] + 5.4], [a[0] - 2.2, a[1] + 7], tranche(this, [a[0] - 6.6 - w, a[1] + 4.8], 1)),
          right: arm(this, b, [b[0] - 9.6 - w, b[1] + 4.8], [b[0] - 4.4, b[1] + 7], tranche(this, [b[0] - 9.8 - w, b[1] + 4.2], 1, 0.95))
        };
      }
      return {
        left: "",
        right: "",
        under: arm(this, a, [a[0] + 3.6, a[1] + 4.6 - w], [a[0] - 2.6, a[1] + 5.8]) + arm(this, b, [b[0] + 2.4, b[1] + 4.6 - w], [b[0] + 2, b[1] + 7.2], tranche(this, [b[0] + 2.5, b[1] + 4 - w], 1, 0.95))
      };
    }
    __name(tendre, "tendre");
    var avecMainsTendues = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}mt`, pose: tendre }), "avecMainsTendues");
    var eclat = /* @__PURE__ */ __name((x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => {
      const p = [x + dx * 1.2, y + dy * 1.2], q = [x + dx * 2.4, y + dy * 2.4];
      return L(p, q, OUT, 1.45) + L(p, q, "#FFF6CC", 0.55);
    }).join(""), "eclat");
    function applaudir({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 6.2;
      if (view === "front") {
        const g = n ? 1.35 : 4;
        return {
          expr: "rire",
          left: arm(this, a, [24 - g, y], [a[0] - 1.2, a[1] + 7.6], tranche(this, [24 - g, y - 0.5], -1)),
          right: arm(this, b, [24 + g, y], [b[0] + 1.2, b[1] + 7.6], tranche(this, [24 + g, y - 0.5], 1)),
          over: n ? eclat(24, y - 3.2) : ""
        };
      }
      if (view === "se") {
        const x = a[0] - 4.4, g = n ? 0.7 : 3.2;
        return {
          expr: "rire",
          right: arm(this, b, [x + g, y - 0.4], [b[0] - 2.6, b[1] + 7.2], tranche(this, [x + g, y - 0.9], -1, 0.95)),
          left: arm(this, a, [x - g, y], [a[0] - 1.2, a[1] + 7.4], tranche(this, [x - g, y - 0.5], 1)),
          over: n ? eclat(x - 0.2, y - 3.8) : ""
        };
      }
      const k = n ? 1.4 : 0;
      return {
        left: "",
        right: "",
        under: arm(this, a, [24 - 0.6, y - 1], [a[0] - 3.2 + k, a[1] + 5.6]) + arm(this, b, [24 + 0.6, y - 1], [b[0] + 3.2 - k, b[1] + 5.6]),
        over: n ? eclat(b[0] + 3.4, a[1] + 1.8) : ""
      };
    }
    __name(applaudir, "applaudir");
    var avecApplaudir = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ap`, pose: applaudir }), "avecApplaudir");
    function canne(b, t, f, k, plonge) {
      const len = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / len, uy = (t[1] - b[1]) / len;
      const at = /* @__PURE__ */ __name((d) => [b[0] + ux * d, b[1] + uy * d], "at");
      const m = at(len * 0.62), g = at(3.2), r = at(5.4), rk = [r[0] - uy * k * 1.5, r[1] + ux * k * 1.5];
      const [x, y] = f, yb = y + (plonge ? 0.7 : 0);
      return L(b, m, OUT, 2.4) + L(m, t, OUT, 1.8) + L(b, m, "#D8AE6E", 1.15) + L(m, t, "#D8AE6E", 0.65) + [0.3, 0.5].map((q) => L(at(len * q - 0.35), at(len * q + 0.35), "#A8794A", 0.9)).join("") + L(b, g, OUT, 2.8) + L(b, g, "#7A4E2A", 1.6) + L(r, rk, OUT, 1) + E(rk[0], rk[1], 1.15, 1.15, "#9AA2AD", 0.6) + E(rk[0] - 0.3, rk[1] - 0.3, 0.4, 0.4, "#E2E8EE", 0) + trait(`M${r22(t[0])},${r22(t[1])} Q${r22(t[0] + (x - t[0]) * 0.2 + (plonge ? 0 : 0.8))},${r22((t[1] + yb) / 2)} ${r22(x)},${r22(yb - 1.5)}`, OUT, 0.35) + E(x, y + 1.2, 4.2, 1.35, "rgba(120,190,226,.55)", 0) + (plonge ? E(x, y + 1.2, 3.6, 1.1, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.45"') : "") + E(x, y + 1.2, 2.4, 0.75, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.5"') + `<g transform="translate(0 ${plonge ? 0.7 : 0})">${E(x, y, 1.65, 1.65, "#FFFFFF", 0.7)}${P(`M${r22(x - 1.65)},${r22(y)} A1.65,1.65 0 0 1 ${r22(x + 1.65)},${r22(y)} Z`, "#E2463A", 0)}${E(x, y, 1.65, 1.65, "none", 0.7)}${E(x - 0.6, y - 0.7, 0.45, 0.3, "#FFFFFF", 0)}${L([x, y - 1.65], [x, y - 2.5], OUT, 0.5)}</g>`;
    }
    __name(canne, "canne");
    function pecher({ view, n }) {
      const [a, b] = this.shoulders;
      const d = n ? 1.6 : 0;
      const sur = /* @__PURE__ */ __name((talon2, scion2, q) => {
        const l = Math.hypot(scion2[0] - talon2[0], scion2[1] - talon2[1]);
        return [talon2[0] + (scion2[0] - talon2[0]) * q / l, talon2[1] + (scion2[1] - talon2[1]) * q / l];
      }, "sur");
      if (view === "front") {
        const talon2 = [a[0] + 1.6, a[1] + 11.4], scion2 = [Math.min(45.6, b[0] + 13.6), a[1] - 8 + d];
        return {
          expr: "content",
          left: canne(talon2, scion2, [Math.min(43, b[0] + 11), 54.4], 1, n) + arm(this, a, sur(talon2, scion2, 3), [a[0] - 0.6, a[1] + 7]),
          right: arm(this, b, sur(talon2, scion2, 9), [b[0] + 1.6, b[1] + 6.2])
        };
      }
      if (view === "se") {
        const talon2 = [b[0] - 4, b[1] + 11.4], scion2 = [Math.max(2.4, a[0] - 13.6), a[1] - 8 + d];
        return {
          expr: "content",
          right: arm(this, b, sur(talon2, scion2, 3), [b[0] - 0.6, b[1] + 7.6]),
          left: canne(talon2, scion2, [Math.max(5, a[0] - 11), 54.4], -1, n) + arm(this, a, sur(talon2, scion2, 9.5), [a[0] - 1, a[1] + 6])
        };
      }
      const talon = [26, a[1] + 8], scion = [Math.min(45.4, b[0] + 13), a[1] - 10 + d];
      return {
        left: "",
        right: "",
        under: canne(talon, scion, [Math.min(43.4, b[0] + 11.4), a[1] + 4], 1, n) + arm(this, a, sur(talon, scion, 2), [a[0] - 2.4, a[1] + 6.4]) + arm(this, b, sur(talon, scion, 7), [b[0] + 2.8, b[1] + 6.4])
      };
    }
    __name(pecher, "pecher");
    var avecPecher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pe`, pose: pecher }), "avecPecher");
    function pioche(m, h, k = 1) {
      const len = Math.hypot(h[0] - m[0], h[1] - m[1]), ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b], "pt");
      const fer = [pt(0.4, -5.6), pt(1.6, -2.6), pt(1.9, 0), pt(1.6, 2.4), pt(0.6, 6.2), pt(-0.6, 2.4), pt(-1.1, 0), pt(-0.6, -2.6)];
      const d = `M${fer.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L")} Z`;
      return L(m, h, OUT, 3.4) + L(m, h, "#B07A45", 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], "#C99A62", 0.5) + P(d, "#A9B1BB", 1) + L(pt(0.9, -4), pt(1.2, -1.2), "#E2E8EE", 0.6) + E(h[0], h[1], 1.1, 1.1, "#6E747E", 0.7);
    }
    __name(pioche, "pioche");
    var eclats = /* @__PURE__ */ __name((x, y) => [[-3.6, -2.6, 0.9], [-1.6, -4.6, 0.7], [2.6, -3.4, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, "#9A8E80", 0.5)).join("") + [[0, -1], [0.7, -0.7], [-0.7, -0.7]].map(([dx, dy]) => L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], OUT, 1.4) + L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], "#FFF2B0", 0.6)).join("") + E(x, y + 0.6, 4.4, 1.2, "rgba(110,90,70,.35)", 0), "eclats");
    var pierre = /* @__PURE__ */ __name((x, y) => E(x, y - 0.2, 4.6, 1.3, "rgba(40,55,20,.22)", 0) + P(`M${r22(x - 4.2)},${r22(y)} Q${r22(x - 4.6)},${r22(y - 3.6)} ${r22(x - 1)},${r22(y - 4.4)} Q${r22(x + 3.4)},${r22(y - 4.8)} ${r22(x + 4.2)},${r22(y - 1.4)} Q${r22(x + 4.4)},${r22(y + 0.2)} ${r22(x)},${r22(y + 0.3)} Z`, "#A79E92") + P(`M${r22(x - 2.8)},${r22(y - 2.6)} Q${r22(x - 1.6)},${r22(y - 3.8)} ${r22(x + 0.4)},${r22(y - 3.8)}`, "none", 0).replace('stroke="none"', 'stroke="#D2CBC0" stroke-width="0.8" stroke-linecap="round"') + P(`M${r22(x + 1.4)},${r22(y - 4.2)} L${r22(x + 0.8)},${r22(y - 2.4)} L${r22(x + 1.6)},${r22(y - 1.2)}`, "none", 0.5), "pierre");
    var surLigne = /* @__PURE__ */ __name((m, h, q) => {
      const l = Math.hypot(h[0] - m[0], h[1] - m[1]);
      return [m[0] + (h[0] - m[0]) * q / l, m[1] + (h[1] - m[1]) * q / l];
    }, "surLigne");
    function piocher({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const p2 = [b[0] + 9, 61];
        if (!n) {
          const m3 = [b[0] - 1.4, b[1] + 5], h3 = [Math.min(42, b[0] + 10.4), a[1] - 8.4];
          return { expr: "content", under: pierre(...p2), left: pioche(m3, h3, 1) + arm(this, a, m3, [a[0] + 0.6, a[1] + 7.4]), right: arm(this, b, surLigne(m3, h3, 4.6), [b[0] + 3, b[1] + 4.4]) };
        }
        const m2 = [24 + 0.6, a[1] + 9.6], h2 = [p2[0] - 0.4, p2[1] - 4.4];
        return { expr: "rire", under: pierre(...p2), left: pioche(m2, h2, -1) + arm(this, a, m2, [a[0] - 0.6, a[1] + 6.4]), right: arm(this, b, surLigne(m2, h2, 4.2), [b[0] + 1.4, b[1] + 6.8]), over: eclats(h2[0] + 0.6, h2[1] + 0.4) };
      }
      if (view === "se") {
        const p2 = [a[0] - 9, 61];
        if (!n) {
          const m3 = [b[0] - 4.4, b[1] + 4.6], h3 = [Math.min(43, b[0] + 10), a[1] - 9];
          return { expr: "content", under: pierre(...p2), right: pioche(m3, h3, -1) + arm(this, b, surLigne(m3, h3, 4.6), [b[0] + 2.6, b[1] + 4.6]), left: arm(this, a, m3, [a[0] - 0.6, a[1] + 6.6]) };
        }
        const m2 = [a[0] + 2.6, a[1] + 9], h2 = [p2[0] + 0.4, p2[1] - 4.4];
        return { expr: "rire", under: pierre(...p2), right: arm(this, b, surLigne(m2, h2, 4.2), [b[0] - 0.6, b[1] + 7]), left: pioche(m2, h2, 1) + arm(this, a, m2, [a[0] - 1.4, a[1] + 5.8]), over: eclats(h2[0] - 0.6, h2[1] + 0.4) };
      }
      const p = [b[0] + 7, a[1] + 18];
      if (!n) {
        const m2 = [b[0] - 2, b[1] + 1], h2 = [b[0] + 6, a[1] - 18];
        return { left: "", right: "", under: pierre(...p) + arm(this, a, [b[0] - 4, b[1] + 2], [a[0] - 2.4, a[1] + 5.6]), over: pioche(m2, h2, 1) + arm(this, b, [b[0] - 1, b[1] - 1.4], [b[0] + 3, b[1] + 4.4]) };
      }
      const m = [24 + 2, a[1] + 7], h = [p[0] - 0.4, p[1] - 4.4];
      return { expr: "rire", left: "", right: "", under: pierre(...p) + pioche(m, h, 1) + arm(this, a, [24 - 1, a[1] + 7.4], [a[0] - 2.4, a[1] + 6]) + arm(this, b, surLigne(m, h, 3), [b[0] + 2.4, b[1] + 6]), over: eclats(h[0] + 0.4, h[1] + 0.4) };
    }
    __name(piocher, "piocher");
    var avecPiocher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pi`, pose: piocher }), "avecPiocher");
    var fruit = /* @__PURE__ */ __name((x, y, s = 1, col = "#E2463A") => E(x, y, 1.45 * s, 1.35 * s, col, 0.7) + E(x - 0.5 * s, y - 0.45 * s, 0.4 * s, 0.3 * s, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.7" fill=') + L([x, y - 1.2 * s], [x + 0.3 * s, y - 2.1 * s], OUT, 0.5) + P(`M${r22(x + 0.3 * s)},${r22(y - 1.9 * s)} q1.2,-0.9 1.9,-0.1 q-1,0.7 -1.9,0.1 Z`, "#6FB24E", 0.4), "fruit");
    function panier([x, y], n = 3) {
      const by = y + 5, w = 5.4;
      const anse = `M${r22(x - w * 0.8)},${r22(by)} Q${r22(x)},${r22(y - 2.6)} ${r22(x + w * 0.8)},${r22(by)}`;
      const corps = `M${r22(x - w)},${r22(by)} L${r22(x - w * 0.78)},${r22(by + 5)} Q${r22(x)},${r22(by + 6.2)} ${r22(x + w * 0.78)},${r22(by + 5)} L${r22(x + w)},${r22(by)} Q${r22(x)},${r22(by + 1.3)} ${r22(x - w)},${r22(by)} Z`;
      const fruits = [[-2.6, -0.1, "#E2463A"], [2.6, 0, "#E2463A"], [0, -0.5, "#F2A63A"], [-1.2, -1.5, "#C9343A"]].slice(0, n).map(([dx, dy, c]) => fruit(x + dx, by + dy, 0.85, c)).join("");
      return P(anse, "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"`) + P(anse, "none", 0).replace('stroke="none"', 'stroke="#C99A5A" stroke-width="1" stroke-linecap="round"') + E(x, by, w, 1.3, "#7A5A30", 0.8) + fruits + P(corps, "#C99A5A") + [2, 3.6].map((d) => `<path d="M${r22(x - w * 0.93 + d * 0.05)},${r22(by + d)} Q${r22(x)},${r22(by + d + 1.1)} ${r22(x + w * 0.93 - d * 0.05)},${r22(by + d)}" fill="none" stroke="#A67A40" stroke-width="0.5"/>`).join("") + [-2.8, 0, 2.8].map((d) => L([x + d, by + 1.2], [x + d * 0.85, by + 5.4], "#A67A40", 0.45)).join("") + `<path d="M${r22(x - w)},${r22(by)} Q${r22(x)},${r22(by + 2.6)} ${r22(x + w)},${r22(by)}" fill="none" stroke="${OUT}" stroke-width="2.3" stroke-linecap="round"/><path d="M${r22(x - w)},${r22(by)} Q${r22(x)},${r22(by + 2.6)} ${r22(x + w)},${r22(by)}" fill="none" stroke="#E2B878" stroke-width="1" stroke-linecap="round"/>`;
    }
    __name(panier, "panier");
    function cueillir({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const hp2 = [a[0] - 1.8, a[1] + 9.4];
        const pan2 = panier(hp2, n ? 4 : 3);
        if (!n) {
          const h2 = [b[0] + 8.4, a[1] - 3.6];
          return { expr: "content", left: arm(this, a, hp2, [a[0] - 2.4, a[1] + 5]) + pan2, right: arm(this, b, h2, [b[0] + 6.4, b[1] + 2.2]) + fruit(h2[0] + 0.3, h2[1] - 2) };
        }
        const h = [a[0] + 1.4, a[1] + 8.6];
        return { expr: "rire", left: arm(this, a, hp2, [a[0] - 2.4, a[1] + 5]) + pan2, right: arm(this, b, h, [b[0] + 1.6, b[1] + 6.8]) };
      }
      if (view === "se") {
        const hp2 = [b[0] + 1.8, b[1] + 9.4];
        const pan2 = panier(hp2, n ? 4 : 3);
        if (!n) {
          const h2 = [a[0] - 8.4, a[1] - 3.6];
          return { expr: "content", right: arm(this, b, hp2, [b[0] + 2.4, b[1] + 5]) + pan2, left: arm(this, a, h2, [a[0] - 6.4, a[1] + 2.2]) + fruit(h2[0] - 0.3, h2[1] - 2) };
        }
        const h = [b[0] + 0.6, b[1] + 8.6];
        return { expr: "rire", right: arm(this, b, hp2, [b[0] + 2.4, b[1] + 5]) + pan2, left: arm(this, a, h, [a[0] - 1, a[1] + 7]) };
      }
      const hp = [b[0] + 2.4, b[1] + 9.4];
      const pan = panier(hp, n ? 4 : 3);
      if (!n) {
        const h = [a[0] - 8.4, a[1] - 3.6];
        return { left: arm(this, a, h, [a[0] - 6.4, a[1] + 2.2]) + fruit(h[0] - 0.3, h[1] - 2), right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan };
      }
      return { left: "", right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan, under: arm(this, a, [24 + 3, a[1] + 8], [a[0] - 2.4, a[1] + 6]) };
    }
    __name(cueillir, "cueillir");
    var avecCueillir = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}cu`, pose: cueillir }), "avecCueillir");
    function arrosoir(h, k = 1, a = 0) {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      const pt = /* @__PURE__ */ __name((x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c], "pt");
      const d = /* @__PURE__ */ __name((ps) => `M${ps.map(([x, y]) => pt(x, y).map(r22).join(",")).join(" L")} Z`, "d");
      const corps = d([[-4.2, 2.4], [3.6, 2.4], [3.9, 9.4], [-4.5, 9.4]]);
      const bec = d([[3.4, 7.6], [9, 2.4], [9.5, 3.2], [3.8, 9.2]]);
      const pomme = pt(9.7, 2.6), bout = pt(10.4, 3.4);
      const anse = `M${pt(-3.2, 2.6).map(r22)} Q${pt(-0.4, -3.4).map(r22)} ${pt(2.4, 2.6).map(r22)}`;
      const t = /* @__PURE__ */ __name((dd, col, w) => trait(dd, col, w), "t");
      return {
        svg: t(anse, OUT, 2.6) + t(anse, "#3F7A57", 1.2) + P(bec, "#4E8F6A", 0.9) + E(pomme[0], pomme[1], 1.6, 1.6, "#3F7A57", 0.8) + E(pomme[0], pomme[1], 0.7, 0.7, "#9CC9A8", 0) + P(corps, "#4E8F6A") + L(pt(-4.3, 5), pt(3.7, 5), "#6FB08A", 1) + L(pt(-3, 3.6), pt(-3.2, 8.4), "#A6D4B4", 0.7),
        bout
      };
    }
    __name(arrosoir, "arrosoir");
    var pluie = /* @__PURE__ */ __name(([x, y], sol, k, n) => [0, 1, 2].map((i) => {
      const q = (i + 0.4 + (n ? 0.5 : 0)) / 3, gx = x + k * 1.2 * q, gy = y + (sol - y) * q;
      return gy < sol - 1 ? P(`M${r22(gx)},${r22(gy - 1.2)} Q${r22(gx + 1.1)},${r22(gy + 0.3)} ${r22(gx)},${r22(gy + 0.9)} Q${r22(gx - 1.1)},${r22(gy + 0.3)} ${r22(gx)},${r22(gy - 1.4)} Z`, "#8FD3F2", 0.4) : "";
    }).join(""), "pluie");
    var pousse = /* @__PURE__ */ __name((x, y, n) => E(x, y, 4.4, 1.2, "#6B4A2E", 0.6) + E(x - 0.6, y - 0.2, 2.2, 0.5, "#8A6440", 0) + L([x, y], [x, y - 3.6], OUT, 1.4) + L([x, y], [x, y - 3.6], "#6FB24E", 0.6) + P(`M${r22(x)},${r22(y - 3.2)} q-2.4,${n ? -1.6 : -0.6} -3.4,${n ? -0.2 : 0.8} q1.8,0.8 3.4,-0.8 Z`, "#7CC25A", 0.5) + P(`M${r22(x)},${r22(y - 3.4)} q2.4,${n ? -1.6 : -0.6} 3.4,${n ? -0.2 : 0.8} q-1.8,0.8 -3.4,-0.8 Z`, "#7CC25A", 0.5), "pousse");
    function arroser({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const h2 = [b[0] + 3, b[1] + 7.4], ar2 = arrosoir(h2, 1, 38), sol2 = 61;
        return { expr: "content", under: pousse(ar2.bout[0] - 0.4, sol2, n), right: arm(this, b, h2, [b[0] + 3, b[1] + 3.4]) + ar2.svg, over: pluie(ar2.bout, sol2 - 1, 1, n) };
      }
      if (view === "se") {
        const h2 = [a[0] - 3, a[1] + 7.4], ar2 = arrosoir(h2, -1, 38), sol2 = 61;
        return { expr: "content", under: pousse(ar2.bout[0] + 0.4, sol2, n), left: arm(this, a, h2, [a[0] - 3, a[1] + 3.4]) + ar2.svg, over: pluie(ar2.bout, sol2 - 1, -1, n) };
      }
      const h = [b[0] + 1.4, b[1] + 6.4], ar = arrosoir(h, 1, 40), sol = a[1] + 18;
      return { left: "", right: "", under: pousse(ar.bout[0] - 0.6, sol, n) + ar.svg + pluie(ar.bout, sol - 1, 1, n) + arm(this, a, [24 + 1, a[1] + 7.6], [a[0] - 1.6, a[1] + 6]), over: arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(arroser, "arroser");
    var avecArroser = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ar`, pose: arroser }), "avecArroser");
    function beche(t, l, motte = false) {
      const len = Math.hypot(l[0] - t[0], l[1] - t[1]), ux = (l[0] - t[0]) / len, uy = (l[1] - t[1]) / len, nx = -uy, ny = ux;
      const pt = /* @__PURE__ */ __name((a, b) => [l[0] - ux * a + nx * b, l[1] - uy * a + ny * b], "pt");
      const haut = pt(7, 0);
      const lame = [pt(7, -2.8), pt(7, 2.8), pt(0.8, 2.6), pt(0, 1.2), pt(0, -1.2), pt(0.8, -2.6)];
      const d = `M${lame.map((p) => p.map(r22).join(",")).join(" L")} Z`;
      const mt = motte ? (() => {
        const [mx, my] = pt(4, 0);
        return E(mx - nx * 0.4, my - 1.6, 3, 1.9, "#7A5434", 0.8) + E(mx - 0.8, my - 2.2, 1, 0.6, "#9A7048", 0);
      })() : "";
      return L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], OUT, 3) + L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], "#B07A45", 1.3) + L(t, haut, OUT, 3.2) + L(t, haut, "#B07A45", 1.5) + L(t, surLigne(t, haut, len * 0.5), "#C99A62", 0.5) + P(d, "#A9B1BB", 1) + L(pt(6, -1.6), pt(1.4, -1.6), "#E2E8EE", 0.7) + mt;
    }
    __name(beche, "beche");
    var terre = /* @__PURE__ */ __name((x, y) => E(x, y, 5, 1.4, "rgba(40,55,20,.22)", 0) + P(`M${r22(x - 4.6)},${r22(y + 0.4)} Q${r22(x - 3.4)},${r22(y - 2.6)} ${r22(x)},${r22(y - 2.4)} Q${r22(x + 3.6)},${r22(y - 2.4)} ${r22(x + 4.6)},${r22(y + 0.4)} Z`, "#7A5434", 0.8) + E(x - 2.2, y - 1.4, 1.1, 0.7, "#9A7048", 0) + E(x + 2, y - 1, 0.9, 0.6, "#5E3F26", 0) + E(x + 5.6, y - 0.2, 0.9, 0.7, "#7A5434", 0.5), "terre");
    function becher({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61;
        const [t2, l2] = n ? [[x(2), a[1] + 6], [x(10), sol2 - 6.4]] : [[x(5.4), a[1] + 1], [x(6.6), sol2 + 1.4]];
        const haut = [t2[0], t2[1] + 0.6], bas = surLigne(t2, l2, n ? 6.4 : 9.4);
        const outil = beche(t2, l2, !!n) + (n ? "" : terre(x(6.6), sol2));
        const main = arm(this, p, haut, [x(n ? 2.4 : 4.4), p[1] + 3.4]), autre = arm(this, q, bas, [q[0] + s * 2.4, q[1] + 7.6]);
        const sous = n ? terre(x(7.4), sol2) : "";
        const [cote, loin] = s > 0 ? ["right", "left"] : ["left", "right"];
        return { expr: n ? "rire" : "content", under: sous, [cote]: outil + main, [loin]: autre };
      }
      const sol = a[1] + 18;
      const [t, l] = n ? [[b[0] + 1, a[1] + 4], [b[0] + 8, sol - 5]] : [[b[0] + 3.6, a[1] - 1], [b[0] + 4.8, sol + 1.4]];
      return { expr: n ? "rire" : void 0, left: "", right: "", under: (n ? terre(b[0] + 5, sol) : "") + beche(t, l, !!n) + (n ? "" : terre(b[0] + 4.8, sol)) + arm(this, a, surLigne(t, l, 8), [a[0] - 1.6, a[1] + 6]), over: arm(this, b, [t[0], t[1] + 0.6], [b[0] + 3, b[1] + 3]) };
    }
    __name(becher, "becher");
    var avecBecher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}be`, pose: becher }), "avecBecher");
    var sacGraines = /* @__PURE__ */ __name(([x, y]) => P(`M${r22(x - 3.4)},${r22(y)} Q${r22(x - 4.4)},${r22(y + 6)} ${r22(x)},${r22(y + 6.6)} Q${r22(x + 4.4)},${r22(y + 6)} ${r22(x + 3.4)},${r22(y)} Z`, "#D8C49A") + E(x, y, 3.4, 1.1, "#6E5434", 0.8) + [[-1.4, -0.3], [0.2, -0.6], [1.6, -0.2]].map(([dx, dy]) => E(x + dx, y + dy, 0.6, 0.4, "#E8C66A", 0)).join("") + `<path d="M${r22(x - 3.4)},${r22(y)} Q${r22(x)},${r22(y + 1.4)} ${r22(x + 3.4)},${r22(y)}" fill="none" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="M${r22(x - 3.4)},${r22(y)} Q${r22(x)},${r22(y + 1.4)} ${r22(x + 3.4)},${r22(y)}" fill="none" stroke="#EDE0BE" stroke-width="0.8" stroke-linecap="round"/>` + L([x - 1.6, y + 3], [x - 1.2, y + 5.4], "#B8A274", 0.5), "sacGraines");
    var graines = /* @__PURE__ */ __name((x, y, k) => [[2, 1.6], [3.6, 3.4], [2.6, 5.4], [5, 5.8], [4.2, 8], [6.2, 8.6]].map(([dx, dy], i) => {
      const gx = x + k * dx * 0.75, gy = y + dy * 1.5;
      return E(gx, gy, 0.75, 0.55, "#E8C66A", 0.45).replace("/>", ` transform="rotate(${i * 37 % 90 - 45} ${r22(gx)} ${r22(gy)})"/>`);
    }).join(""), "graines");
    function semer({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const hs2 = [q[0] - s * 1.6, q[1] + 10], sac2 = arm(this, q, hs2, [q[0] - s * 2.6, q[1] + 5.4]) + sacGraines([hs2[0] + s * 1.4, hs2[1] + 0.6]);
        if (!n) {
          const h3 = [hs2[0] + s * 1.8, hs2[1] - 0.6];
          return { expr: "content", [s > 0 ? "left" : "right"]: sac2, [s > 0 ? "right" : "left"]: arm(this, p, h3, [p[0] + s * 0.4, p[1] + 8]) };
        }
        const h2 = [p[0] + s * 6.4, p[1] + 5];
        return { expr: "content", [s > 0 ? "left" : "right"]: sac2, [s > 0 ? "right" : "left"]: arm(this, p, h2, [p[0] + s * 4.6, p[1] + 4]), over: graines(h2[0], h2[1] + 1, s) };
      }
      const hs = [a[0] - 1.4, a[1] + 10];
      const sac = arm(this, a, hs, [a[0] - 2.4, a[1] + 5.4]) + sacGraines([hs[0] - 1, hs[1] + 0.6]);
      if (!n) return { left: sac, right: "", under: arm(this, b, [24 + 2, b[1] + 9], [b[0] - 0.6, b[1] + 7]) };
      const h = [b[0] + 6, b[1] + 4];
      return { left: sac, right: arm(this, b, h, [b[0] + 4.4, b[1] + 3.4]), over: graines(h[0], h[1] + 1, 1) };
    }
    __name(semer, "semer");
    var avecSemer = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}se`, pose: semer }), "avecSemer");
    function faucille(h, k = 1, a = 0) {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      const pt = /* @__PURE__ */ __name((x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c].map(r22).join(","), "pt");
      const lame = `M${pt(0, -2.4)} Q${pt(1.4, -9.4)} ${pt(7.6, -7.8)} Q${pt(9.4, -7)} ${pt(9.2, -5.6)} Q${pt(6.6, -7)} ${pt(3.6, -6)} Q${pt(1.6, -5)} ${pt(1.2, -2.2)} Z`;
      const manche = `M${pt(0, 3)} L${pt(0, -2.6)}`;
      return trait(manche, OUT, 3) + trait(manche, "#B07A45", 1.5) + P(lame, "#A9B1BB", 0.9) + trait(`M${pt(1.2, -4.6)} Q${pt(2.4, -7.4)} ${pt(6, -7.4)}`, "#E2E8EE", 0.6);
    }
    __name(faucille, "faucille");
    var epi = /* @__PURE__ */ __name((x, y, dx, hy) => L([x, y], [x + dx, y - hy], OUT, 1.2) + L([x, y], [x + dx, y - hy], "#D9B04A", 0.5) + E(x + dx * 1.08, y - hy - 1.2, 0.85, 1.7, "#E8C66A", 0.5), "epi");
    var touffe = /* @__PURE__ */ __name((x, y, n) => E(x, y, 4.6, 1.2, "rgba(40,55,20,.22)", 0) + (n ? [-2.4, -0.8, 0.8, 2.4].map((d) => L([x + d, y], [x + d * 1.1, y - 1.6], "#B89A40", 0.7)).join("") + [[-1.6, -6, 30], [1.8, -7.6, -40], [3.4, -5, 70]].map(([dx, dy, r]) => L([x + dx - 0.8, y + dy], [x + dx + 0.8, y + dy], "#D9B04A", 0.6).replace("/>", ` transform="rotate(${r} ${r22(x + dx)} ${r22(y + dy)})"/>`)).join("") : [[-2.4, -0.8, 8], [-0.8, -0.2, 9.2], [0.8, 0.3, 8.6], [2.4, 0.9, 7.6]].map(([d, dx, hy]) => epi(x + d, y, dx, hy)).join("")), "touffe");
    function recolter({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, p = s > 0 ? b : a;
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61;
        const h2 = n ? [x(2.6), sol2 - 7.4] : [x(5.4), p[1] + 3.4];
        const outil = faucille(h2, s, n ? 60 : -20) + arm(this, p, h2, n ? [x(2.4), p[1] + 7] : [x(4.6), p[1] + 6]);
        return { expr: n ? "rire" : "content", under: touffe(x(7), sol2, n), [s > 0 ? "right" : "left"]: outil };
      }
      const sol = a[1] + 18, h = n ? [b[0] + 2, sol - 6] : [b[0] + 5, b[1] + 1];
      return { expr: n ? "rire" : void 0, right: "", under: touffe(b[0] + 6, sol, n), over: faucille(h, 1, n ? 60 : -20) + arm(this, b, h, [b[0] + 3.6, b[1] + 4]) };
    }
    __name(recolter, "recolter");
    var avecRecolter = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}rc`, pose: recolter }), "avecRecolter");
    function scie(h, c) {
      const len = Math.hypot(c[0] - h[0], c[1] - h[1]), ux = (c[0] - h[0]) / len, uy = (c[1] - h[1]) / len, nx = -uy, ny = ux;
      const k = nx * (c[0] > h[0] ? 1 : -1) < 0 || ny < 0 ? -1 : 1;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b * k, h[1] + uy * a + ny * b * k], "pt");
      const L2 = len + 2.4, lame = [pt(1.4, -1.6), pt(L2, -0.8), pt(L2, 0.8), pt(1.4, 1.4)];
      const dents = Array.from({ length: 6 }, (_, i) => {
        const q = 2.4 + i * (L2 - 3) / 6;
        return `${pt(q, 1.2).map(r22)} ${pt(q + 0.6, 1.9).map(r22)}`;
      }).join(" L");
      return P(`M${lame.map((p) => p.map(r22).join(",")).join(" L")} Z`, "#B8C0C9", 0.9) + P(`M${pt(2.4, 1.2).map(r22)} L${dents} L${pt(L2, 0.8).map(r22)} Z`, "#8E96A0", 0.5) + L(pt(2.6, -0.6), pt(L2 - 1, -0.3), "#E2E8EE", 0.6) + E(h[0], h[1], 2.1, 2.1, "#B07A45", 0.9) + E(h[0] - ux * 0.3, h[1] - uy * 0.3, 0.8, 0.8, "#5E3F26", 0);
    }
    __name(scie, "scie");
    function chevalet(x, y, c, n) {
      const top = y - 8, pied = /* @__PURE__ */ __name((dx) => L([x + dx - 3, y], [x + dx + 3, top + 2], OUT, 2.2) + L([x + dx - 3, y], [x + dx + 3, top + 2], "#9A6A3E", 1) + L([x + dx + 3, y], [x + dx - 3, top + 2], OUT, 2.2) + L([x + dx + 3, y], [x + dx - 3, top + 2], "#9A6A3E", 1), "pied");
      const buche = `<rect x="${r22(x - 5.4)}" y="${r22(top - 1.6)}" width="10.8" height="3.6" rx="1.6" fill="#B07A45" stroke="${OUT}" stroke-width="0.9"/>` + E(x + 5.2, top + 0.2, 1.2, 1.7, "#E2B878", 0.8) + E(x + 5.2, top + 0.2, 0.5, 0.8, "#C99A62", 0) + L([x - 4, top - 0.4], [x + 2, top - 0.4], "#C99A62", 0.5);
      const entaille = L([c, top - 1.6], [c, top - 1.6 + (n ? 2.4 : 1.2)], "#5E3F26", 0.8);
      const sciure = E(c, y - 0.2, 2.4, 0.6, "#E8CFA0", 0.4) + (n ? [[0.6, 3], [-0.4, 5], [0.8, 6.6]] : [[0.2, 4]]).map(([dx, dy]) => E(c + dx, top + dy, 0.5, 0.4, "#E8CFA0", 0)).join("");
      return E(x, y, 6, 1.2, "rgba(40,55,20,.22)", 0) + pied(-1.6) + buche + entaille + sciure;
    }
    __name(chevalet, "chevalet");
    function scier({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61, top2 = sol2 - 8, c2 = x(6.4);
        const h2 = n ? [x(3.2), top2 - 4.2] : [x(-0.4), top2 - 8.6];
        const tient = arm(this, q, [x(1.6) - s * 3.6, top2 - 2.2], [q[0] + s * 0.6, q[1] + 8]);
        return { expr: "content", under: chevalet(x(7.4), sol2, c2, n), [s > 0 ? "left" : "right"]: tient, [s > 0 ? "right" : "left"]: scie(h2, [c2, top2 - 1.4]) + arm(this, p, h2, [x(n ? 2.4 : 1.6), p[1] + 6]) };
      }
      const sol = a[1] + 18, top = sol - 8, c = b[0] + 5.4, h = n ? [b[0] + 2.6, top - 3.4] : [b[0] - 0.4, top - 7];
      return { right: "", under: chevalet(b[0] + 6, sol, c, n), over: scie(h, [c, top - 1.4]) + arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(scier, "scier");
    var avecScier = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}sc`, pose: scier }), "avecScier");
    function secateur(h, c, ouvert) {
      const len = Math.hypot(c[0] - h[0], c[1] - h[1]), ux = (c[0] - h[0]) / len, uy = (c[1] - h[1]) / len, nx = -uy, ny = ux;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b], "pt");
      const e = ouvert ? 1.6 : 0.3, axe = pt(1.6, 0);
      const lame = /* @__PURE__ */ __name((s) => P(`M${axe.map(r22)} L${pt(5.4, s * e * 1.4).map(r22)} L${pt(5, s * (e * 1.4 + 0.9)).map(r22)} Z`, "#B8C0C9", 0.7), "lame");
      const poignee = /* @__PURE__ */ __name((s) => L(pt(-2.6, s * 1), axe, OUT, 2.4) + L(pt(-2.6, s * 1), axe, "#D9443A", 1.1), "poignee");
      return poignee(1) + poignee(-1) + lame(1) + lame(-1) + E(axe[0], axe[1], 0.6, 0.6, "#6E747E", 0.5);
    }
    __name(secateur, "secateur");
    function buisson(x, y, k, n) {
      const cy = y - 5, b0 = [x - k * 1, cy - 3.6], b1 = [x - k * 2.6, cy - 11];
      const feuille = /* @__PURE__ */ __name((fx, fy) => E(fx, fy, 1.1, 0.7, "#7CC25A", 0.4), "feuille");
      const ronds = [[-3.2, 1, 3], [3.2, 1, 3], [0, -1.6, 3.6], [-1.8, 2.4, 2.8], [1.8, 2.4, 2.8]];
      const touffu = ronds.map(([dx, dy, r]) => E(x + dx, cy + dy, r + 0.5, r + 0.5, OUT, 0)).join("") + ronds.map(([dx, dy, r]) => E(x + dx, cy + dy, r, r, "#4E9A4A", 0)).join("") + [[-2.8, -0.4], [1.2, -3], [3, 1.4], [-1.2, 2.4], [0.4, 0]].map(([dx, dy]) => feuille(x + dx, cy + dy)).join("");
      const tige = /* @__PURE__ */ __name((p0, p1) => L(p0, p1, OUT, 1.6) + L(p0, p1, "#7A5434", 0.8), "tige");
      if (!n) return E(x, y, 6.4, 1.3, "rgba(40,55,20,.22)", 0) + tige(b0, b1) + feuille(b1[0] - k * 0.8, b1[1] + 1.6) + feuille(b1[0] + k * 0.9, b1[1] + 3.4) + touffu;
      const t0 = [x + k * 1.4, cy - 4.4], t1 = [x + k * 4.6, cy - 1.4];
      return E(x, y, 6.4, 1.3, "rgba(40,55,20,.22)", 0) + tige(b0, [x - k * 1.5, cy - 6]) + touffu + tige(t0, t1) + feuille(t1[0] + k * 0.4, t1[1] - 1.2) + feuille(t0[0] + k * 1.6, t0[1] + 0.4);
    }
    __name(buisson, "buisson");
    function tailler({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, p = s > 0 ? b : a;
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61, bx2 = x(7.2), cy2 = sol2 - 5;
        const h2 = [x(1.8), cy2 - 9.4], c2 = [bx2 - s * 1.8, cy2 - 8];
        return { expr: n ? "rire" : "content", under: buisson(bx2, sol2, s, n), [s > 0 ? "right" : "left"]: arm(this, p, h2, [x(3.4), p[1] + 5]) + secateur(h2, c2, !n) };
      }
      const sol = a[1] + 18, bx = b[0] + 5.2, cy = sol - 5, h = [b[0] + 0.8, cy - 9.4], c = [bx - 1.8, cy - 8];
      return { expr: n ? "rire" : void 0, right: "", under: buisson(bx, sol, 1, n), over: secateur(h, c, !n) + arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(tailler, "tailler");
    var avecTailler = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ta`, pose: tailler }), "avecTailler");
    function caisse(x, y, w = 11, h = 8.4) {
      const g = x - w / 2, d = x + w / 2, t = y - h, p = 2.2;
      const face = `M${r22(g)},${r22(y)} L${r22(d)},${r22(y)} L${r22(d)},${r22(t)} L${r22(g)},${r22(t)} Z`;
      const dessus = `M${r22(g)},${r22(t)} L${r22(g + p)},${r22(t - p * 0.7)} L${r22(d + p)},${r22(t - p * 0.7)} L${r22(d)},${r22(t)} Z`;
      const cote = `M${r22(d)},${r22(y)} L${r22(d + p)},${r22(y - p * 0.7)} L${r22(d + p)},${r22(t - p * 0.7)} L${r22(d)},${r22(t)} Z`;
      return P(cote, "#94683F") + P(dessus, "#D2A574") + P(face, "#B8875A") + [1 / 3, 2 / 3].map((k) => L([g + 0.4, t + h * k], [d - 0.4, t + h * k], "#8A5E36", 0.5)).join("") + L([g + 0.6, y - 0.6], [d - 0.6, t + 0.6], "#8A5E36", 0.9) + L([g + 1.2, t + 0.9], [d - 1.6, t + 0.9], "rgba(255,255,255,.35)", 0.6) + [[g + 1, t + 1], [d - 1, t + 1], [g + 1, y - 1], [d - 1, y - 1]].map(([a, b]) => E(a, b, 0.35, 0.35, "#5A3A20", 0)).join("") + P(face, "none");
    }
    __name(caisse, "caisse");
    function porter({ view, n }) {
      const [a, b] = this.shoulders;
      const up = n ? -0.9 : 0;
      const x = Math.min(b[0] + 7, 39.8), y = b[1] - 0.8 + up;
      const main = [Math.min(b[0] + 10.2, 43), b[1] - 0.2 + up];
      const autre = view === "ne" ? arm(this, a, [a[0] - 1.4, a[1] + 11 - up]) : arm(this, a, [a[0] - 1.6, a[1] + 10.6 + up * 0.5]);
      return {
        expr: "content",
        left: autre,
        right: "",
        over: caisse(x, y, 10.4) + arm(this, b, main, [b[0] + 6.6, b[1] + 5.4])
      };
    }
    __name(porter, "porter");
    var avecPorter = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}po`, pose: porter }), "avecPorter");
    function marteau(m, t) {
      const len = Math.hypot(t[0] - m[0], t[1] - m[1]), ux = (t[0] - m[0]) / len, uy = (t[1] - m[1]) / len, nx = -uy, ny = ux;
      const q = /* @__PURE__ */ __name((a, b) => [t[0] + ux * a + nx * b, t[1] + uy * a + ny * b], "q");
      const tete = [q(-1.3, -3.2), q(1.3, -3.2), q(1.3, 2.2), q(0.4, 3.6), q(-0.4, 3.6), q(-1.3, 2.2)];
      return L(m, t, OUT, 3.2) + L(m, t, "#C99A62", 1.4) + L(m, [m[0] + ux * 2.4, m[1] + uy * 2.4], "#7A4E2A", 1.6) + P(`M${tete.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L")} Z`, "#8E96A0", 0.9) + L(q(-0.7, -2.6), q(-0.7, 1.4), "#C9CFD6", 0.5);
    }
    __name(marteau, "marteau");
    var planche = /* @__PURE__ */ __name((g, d, y, cx) => `<rect x="${r22(g)}" y="${r22(y - 1.5)}" width="${r22(d - g)}" height="3" rx="0.6" fill="#D2A574" stroke="${OUT}" stroke-width="0.9"/>` + L([g + 1, y - 0.3], [d - 1, y - 0.3], "#B8875A", 0.45) + L([g + 2, y + 0.7], [d - 3, y + 0.7], "#B8875A", 0.4) + L([cx, y - 1.4], [cx, y - 3.4], OUT, 1.3) + L([cx, y - 1.4], [cx, y - 3.4], "#C9CFD6", 0.5) + E(cx, y - 3.5, 0.9, 0.35, "#8E96A0", 0.5), "planche");
    var tac = /* @__PURE__ */ __name((x, y) => [[-1, -0.6], [0, -1.1], [1, -0.6]].map(([dx, dy]) => {
      const p = [x + dx * 1.6, y + dy * 1.6], q = [x + dx * 3, y + dy * 3];
      return L(p, q, OUT, 1.4) + L(p, q, "#FFF2B0", 0.6);
    }).join(""), "tac");
    function reparer({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 9.4;
      if (view === "front") {
        const cx = 25.4, pl = planche(15.4, 32.6, y, cx);
        const hp = [16.6, y + 0.2];
        if (!n) {
          const m2 = [Math.min(b[0] + 6.4, 39.6), a[1] + 1.4], t2 = [Math.min(b[0] + 8.6, 41.8), a[1] - 5.4];
          return { expr: "content", left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m2, [b[0] + 4.6, b[1] + 5.8]) + marteau(m2, t2) };
        }
        const m = [b[0] + 1.6, y - 3.6], t = [cx + 1.4, y - 5.6];
        return { expr: "rire", left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m, [b[0] + 2.6, b[1] + 6.6]) + marteau(m, t), over: tac(cx, y - 3.6) };
      }
      if (view === "se") {
        const cx = a[0] - 0.4, pl = planche(a[0] - 8.4, b[0] - 1.4, y, cx);
        const hp = [b[0] - 3, y + 0.2];
        if (!n) {
          const m2 = [Math.max(a[0] - 5, 8.4), a[1] + 1.4], t2 = [Math.max(a[0] - 8.4, 5.6), a[1] - 5];
          return { expr: "content", right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m2, [a[0] - 3.6, a[1] + 5.6]) + marteau(m2, t2) };
        }
        const m = [a[0] - 3.4, y - 4], t = [cx - 1.2, y - 5.8];
        return { expr: "rire", right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + marteau(m, t), over: tac(cx, y - 3.6) };
      }
      if (!n) {
        const m = [Math.min(b[0] + 6.4, 39.6), a[1] + 0.6], t = [Math.min(b[0] + 8.2, 41.4), a[1] - 6.2];
        return { left: "", right: "", under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]), over: arm(this, b, m, [b[0] + 4.4, b[1] + 5.6]) + marteau(m, t) };
      }
      return { expr: "rire", left: "", right: "", under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [24 + 3, y - 2], [b[0] + 2.4, b[1] + 6]), over: tac(b[0] + 3.6, y - 3) };
    }
    __name(reparer, "reparer");
    var avecReparer = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}re`, pose: reparer }), "avecReparer");
    function onde(x, y, dx, dy, n) {
      const k = n ? 1.2 : 1;
      const anneau = /* @__PURE__ */ __name((r, o) => {
        const e = /* @__PURE__ */ __name((color, w) => `<ellipse cx="${r22(x + dx * o)}" cy="${r22(y + dy * o)}" rx="${r22(r)}" ry="${r22(r * 0.9)}" fill="none" stroke="${color}" stroke-width="${w}"/>`, "e");
        return e(OUT, 1.5) + e("#EAF6FF", 0.7);
      }, "anneau");
      const etoile = /* @__PURE__ */ __name((sx, sy, s) => `<path d="M${r22(sx)},${r22(sy - s)} Q${r22(sx + s * 0.2)},${r22(sy - s * 0.2)} ${r22(sx + s)},${r22(sy)} Q${r22(sx + s * 0.2)},${r22(sy + s * 0.2)} ${r22(sx)},${r22(sy + s)} Q${r22(sx - s * 0.2)},${r22(sy + s * 0.2)} ${r22(sx - s)},${r22(sy)} Q${r22(sx - s * 0.2)},${r22(sy - s * 0.2)} ${r22(sx)},${r22(sy - s)} Z" fill="#FFF2B0" stroke="${OUT}" stroke-width="0.4"/>`, "etoile");
      return `<g opacity="0.9">${anneau(3.4 * k, 0.8) + anneau(5 * k, 1.8)}</g>` + etoile(x + dx * 3 + 4.4 * k, y + dy * 3 - 4.6 * k, n ? 1.2 : 0.9) + etoile(x + dx * 3 - 4.6 * k, y + dy * 3 + 3.6 * k, n ? 0.8 : 1.1);
    }
    __name(onde, "onde");
    function repousser({ view, n }) {
      const [a, b] = this.shoulders;
      const d = n ? 1.4 : 0;
      if (view === "front") {
        const h2 = [Math.min(b[0] + 4.6 + d, 38.2), a[1] + 3.6 - d * 0.4];
        return { expr: "content", right: arm(this, b, h2, [b[0] + 3.4, b[1] + 6.6]) + paume(this, [h2[0], h2[1] - 0.6], -1, 1.1), over: onde(h2[0], h2[1] - 0.8, 0.6, -0.3, n) + paume(this, [h2[0], h2[1] - 0.6], -1, 1.1) };
      }
      if (view === "se") {
        const h2 = [Math.max(a[0] - 6 - d * 0.8, 9.6), a[1] + 3.4];
        return { expr: "content", left: arm(this, a, h2, [a[0] - 2.6, a[1] + 6.4]) + tranche(this, [h2[0] - 0.2, h2[1] - 0.6], 1, 1.05), over: onde(h2[0] - 0.4, h2[1] - 0.8, -1, 0, n) + tranche(this, [h2[0] - 0.2, h2[1] - 0.6], 1, 1.05) };
      }
      const h = [Math.min(b[0] + 4.6 + d * 0.6, 38), a[1] - 3.6 - d * 0.4];
      return { left: "", right: "", over: arm(this, b, h, [b[0] + 4.4, b[1] + 4.6]) + onde(h[0], h[1] - 0.8, 0.4, -0.8, n) + tranche(this, [h[0], h[1] - 0.6], 1, 1.05) };
    }
    __name(repousser, "repousser");
    var avecRepousser = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}rp`, pose: repousser }), "avecRepousser");
    function carnet(x, y, lignes) {
      return P(`M${r22(x - 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y + 6)} L${r22(x - 5.4)},${r22(y + 6)} Z`, "#3E5A8C", 0.9) + P(`M${r22(x - 4.7)},${r22(y - 0.5)} Q${r22(x - 2.3)},${r22(y - 1.3)} ${r22(x)},${r22(y)} Q${r22(x + 2.3)},${r22(y - 1.3)} ${r22(x + 4.7)},${r22(y - 0.5)} L${r22(x + 4.7)},${r22(y + 5.1)} Q${r22(x + 2.3)},${r22(y + 4.4)} ${r22(x)},${r22(y + 5.4)} Q${r22(x - 2.3)},${r22(y + 4.4)} ${r22(x - 4.7)},${r22(y + 5.1)} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.4], OUT, 0.55) + L([x + 3.4, y + 5.2], [x + 3.6, y + 7.4], "#D9443A", 0.7) + [1.4, 2.5, 3.6].map((d) => L([x - 3.9, y + d], [x - 1, y + d], "#8A7A6A", 0.4)).join("") + [1.4, 2.5, 3.6].slice(0, lignes).map((d) => `<path d="M${r22(x + 1)},${r22(y + d)} q0.5,-0.4 1,0 t1,0 t1,0" fill="none" stroke="#3E5A8C" stroke-width="0.4"/>`).join("");
    }
    __name(carnet, "carnet");
    function crayon(p, ux, uy) {
      const l = 6, q = [p[0] + ux * l, p[1] + uy * l], t = [p[0] + ux * 1.2, p[1] + uy * 1.2];
      return L(t, q, OUT, 2.2) + L(t, q, "#F2C04B", 1) + L(p, t, OUT, 1.1) + L(p, [p[0] + ux * 0.6, p[1] + uy * 0.6], "#3A3A44", 0.5) + L([q[0] - ux * 0.9, q[1] - uy * 0.9], q, "#F2A0B0", 1);
    }
    __name(crayon, "crayon");
    function ecrire({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 3.6;
      if (view === "front") {
        const x = 24, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1];
        const tient = arm(this, a, [x - 5.2, y + 5.6], [a[0] - 1.4, a[1] + 6.8]);
        const ecrit = arm(this, b, [p[0] + 1.6, p[1] + 2.2], [b[0] + 2.6, b[1] + 6.6]) + crayon(p, 0.55, -0.83);
        return { expr: "content", left: tient, right: "", over: carnet(x, y, n ? 2 : 1) + ecrit };
      }
      if (view === "se") {
        const x = a[0] - 3, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1], h = [p[0] + 1.6, p[1] + 2.2];
        const tient = arm(this, b, [x - 4.4, y + 5.8], [b[0] + 0.6, b[1] + 7]);
        const ecrit = arm(this, a, h, [a[0] + 1.4, a[1] + 6.4], "");
        return { expr: "content", right: tient, left: "", over: ecrit + carnet(x, y, n ? 2 : 1) + crayon(p, 0.55, -0.83) + E(h[0], h[1], 2.1, 2.1, this.hand || this.skin) };
      }
      return { left: "", right: "", under: arm(this, a, [24 - 3, y + 5.6], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [b[0] + 1.6, y + 4], [b[0] + 4.4 + n * 1.4, b[1] + 5.6 - n * 0.6]) };
    }
    __name(ecrire, "ecrire");
    var avecEcrire = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ec`, pose: ecrire }), "avecEcrire");
    module.exports = { lanterne, parapluie, valise, avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, ZEDS, paume, tranche, tendre, avecMainsTendues, applaudir, avecApplaudir, pecher, avecPecher, piocher, avecPiocher, cueillir, avecCueillir, arroser, avecArroser, becher, avecBecher, semer, avecSemer, recolter, avecRecolter, scier, avecScier, tailler, avecTailler, porter, avecPorter, reparer, avecReparer, repousser, avecRepousser, ecrire, avecEcrire };
  }
});

// atelier/torche.js
var require_torche = __commonJS({
  "atelier/torche.js"(exports, module) {
    var { OUT, P, E, r2: r22 } = require_troupe2();
    var TETE = -45.4;
    var BOIS = { corps: "#D6C3A2", ombre: "#B29C78", clair: "#EADCC0" };
    var CORDE = "#C9A66B";
    var TOILE = { corps: "#8A5A30", ombre: "#6A4224", brule: "#3E2A1C" };
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var LUMIERE = [0, 0, 43, 38, "255,186,96"];
    var langue = /* @__PURE__ */ __name(([tip, r, base, l], k, s, fill, contour) => `<path d="M${r22(base[0] * k)},${r22(base[1] * k)} C${r22((r[0] + 3 * s) * k)},${r22(r[1] * k)} ${r22((tip[0] + 2 * s) * k)},${r22((tip[1] + 8 * s) * k)} ${r22(tip[0] * k)},${r22(tip[1] * k)} C${r22((tip[0] - 2 * s) * k)},${r22((tip[1] + 8 * s) * k)} ${r22((l[0] - 3 * s) * k)},${r22(l[1] * k)} ${r22(base[0] * k)},${r22(base[1] * k)} Z" fill="${fill}"${contour ? ` stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"` : ""}/>`, "langue");
    var FORMES = [[[0, -22], [7, -6], [0, 0], [-7, -6]], [[2, -24], [7, -7], [0, 0], [-6, -5]], [[-2, -21], [6, -5], [0, 0], [-7, -7]]];
    var ETINCELLES = [[[5, -27], [-6, -18]], [[-4, -30], [7, -21]], [[3, -32], [-7, -25]]];
    function flamme(n, s = 0.9) {
      const f = FORMES[n % 3].map(([x, y]) => [x * s, y * s]);
      return langue(f, 1, s, "#EE6A3A", true) + langue(f, 0.78, s, "#F7A23B") + langue(f, 0.5, s, "#FFE07A") + ETINCELLES[n % 3].map(([x, y], j) => `<circle cx="${r22(x * s)}" cy="${r22(y * s)}" r="${r22((j ? 0.8 : 1.1) * s)}" fill="#FFD27A"/>`).join("");
    }
    __name(flamme, "flamme");
    var lueur = /* @__PURE__ */ __name((y, n) => [20, 14, 9].map((r, i) => `<circle cx="0" cy="${r22(y)}" r="${r22(r + [0, 0.8, -0.6][n % 3])}" fill="rgba(255,200,110,${[0.1, 0.14, 0.2][i]})"/>`).join(""), "lueur");
    function corps(eteinte) {
      let s = E(1, 1.2, 10, 4.6, "rgba(40,55,20,.2)", 0);
      const poteau = "M0,0.6 Q-1.2,-14 0.2,-26 Q1,-32 0.6,-37";
      s += trait(poteau, OUT, 5.6) + trait(poteau, BOIS.corps, 3.4) + trait("M1.2,-1 Q0.2,-14 1.4,-26 Q2,-31 1.8,-35", BOIS.ombre, 1) + trait("M-1.2,-3 Q-2,-12 -1.2,-20", BOIS.clair, 0.8);
      s += E(-0.6, -15.6, 1, 1.4, BOIS.ombre, 0.6);
      s += [[-5.4, 1.4, 3, 2], [5, 1.8, 3.2, 2.2], [0.4, 3.6, 2.6, 1.7]].map(([x, y, rx, ry]) => E(x, y, rx, ry, "#B4AEA4", 0.9) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3, "rgba(255,255,255,.6)", 0)).join("");
      s += [-33.2, -31.2, -29.2].map((y) => trait(`M-2.6,${r22(y + 0.8)} L3.4,${r22(y - 0.6)}`, OUT, 2.4) + trait(`M-2.6,${r22(y + 0.8)} L3.4,${r22(y - 0.6)}`, CORDE, 1.1)).join("");
      const T = `M-4.2,-36.6 Q-5.8,-41.4 -5.6,${TETE} L5.8,${TETE} Q6,-41.4 4.6,-36.6 Q0.2,-35.2 -4.2,-36.6 Z`;
      s += P(T, TOILE.corps, 1) + `<clipPath id="trc${eteinte ? "e" : ""}"><path d="${T}"/></clipPath><g clip-path="url(#trc${eteinte ? "e" : ""})"><rect x="1.6" y="-47" width="6" height="12" fill="${TOILE.ombre}"/>` + [-43.4, -41.2, -39].map((y) => trait(`M-6,${y} Q0,${r22(y + 1.4)} 6,${y}`, TOILE.ombre, 0.7)).join("") + `</g>`;
      s += E(0.1, TETE, 5.7, 1.9, eteinte ? TOILE.brule : "#5E3A22", 1) + (eteinte ? E(-1.4, TETE - 0.3, 1.6, 0.6, "#6A5848", 0) : E(0.1, TETE, 4.2, 1.2, "#F28A2E", 0));
      return s;
    }
    __name(corps, "corps");
    function torche(etat = "allumee", n = 0) {
      if (etat === "eteinte") {
        return corps(true) + `<g opacity=".75">${trait(`M0.4,${TETE - 1.6} Q-2.4,${TETE - 5} 0.6,${TETE - 8} Q3.4,${TETE - 11} 0.8,${TETE - 14.6}`, "#9AA0A8", 1.6)}</g><circle cx="1.6" cy="${TETE - 17}" r="1.4" fill="rgba(170,176,184,.6)"/>`;
      }
      return lueur(TETE - 9, n) + corps(false) + `<g transform="translate(0 ${r22(TETE + 0.6)})">${flamme(n)}</g>`;
    }
    __name(torche, "torche");
    function torcheIcone() {
      const WO = 1.4;
      let s = `<defs><radialGradient id="tri-lueur"><stop offset="0" stop-color="#FFD27A" stop-opacity=".75"/><stop offset=".55" stop-color="#FFB347" stop-opacity=".3"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs>`;
      s += `<g transform="translate(0 1.8) rotate(16 16 17)">`;
      s += `<circle cx="16" cy="8.8" r="7.4" fill="url(#tri-lueur)"/>`;
      s += trait("M16,26.8 L16,15", OUT, 6) + trait("M16,26.8 L16,15", BOIS.corps, 3.6) + trait("M17.1,25.8 L17.1,16", BOIS.ombre, 1) + trait("M15,25.2 L15,18", BOIS.clair, 0.7);
      s += [21.8, 20, 18.2].map((y) => trait(`M13.2,${r22(y + 0.7)} L18.8,${r22(y - 0.5)}`, OUT, 2.8) + trait(`M13.2,${r22(y + 0.7)} L18.8,${r22(y - 0.5)}`, CORDE, 1.3)).join("");
      const T = "M11.6,16.8 Q10.4,12.8 10.6,10.6 L21.4,10.6 Q21.6,12.8 20.4,16.8 Q16,18 11.6,16.8 Z";
      s += `<path d="${T}" fill="${TOILE.corps}" stroke="${OUT}" stroke-width="${WO}" stroke-linejoin="round"/>` + trait("M11,13.6 Q16,15 21,13.6", TOILE.ombre, 0.8) + trait("M18.4,11.8 L19.4,16", TOILE.ombre, 1.2);
      s += E(16, 10.6, 5.4, 1.7, "#F28A2E", 1.1) + E(15, 10.3, 2.2, 0.6, "#FFD27A", 0);
      s += `<g transform="translate(16 11.4) scale(0.47)">${flamme(0, 1)}</g></g>`;
      return s + `<path d="M26,5.6 L26.5,7 L27.9,7.5 L26.5,8 L26,9.4 L25.5,8 L24.1,7.5 L25.5,7 Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="0.5"/>`;
    }
    __name(torcheIcone, "torcheIcone");
    module.exports = { torche, torcheIcone, LUMIERE, TETE };
  }
});

// atelier/scenes7.js
var require_scenes7 = __commonJS({
  "atelier/scenes7.js"(exports, module) {
    var { OUT, P, E, L } = require_troupe2();
    var { brumeFrame } = require_brume();
    var W2 = 400;
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`, "rad");
    var trait = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra ? " " + extra : ""}/>`, "trait");
    var rnd = /* @__PURE__ */ __name((s) => {
      let x = s;
      return () => (x = x * 16807 % 2147483647) / 2147483647;
    }, "rnd");
    var SPLINE = 'keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1" calcMode="spline"';
    var vaVient = /* @__PURE__ */ __name((type, a, b, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${a};${b};${a}" ${SPLINE} dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`, "vaVient");
    var defile = /* @__PURE__ */ __name((from, to, dur, begin = 0) => `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`, "defile");
    var uneFois = /* @__PURE__ */ __name((type, values, keyTimes, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${keyTimes}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze" additive="sum"/>`, "uneFois");
    var fondu = /* @__PURE__ */ __name((values, keyTimes, dur, begin = 0) => `<animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze"/>`, "fondu");
    var palpite = /* @__PURE__ */ __name((attr, values, dur, begin = 0) => `<animate attributeName="${attr}" values="${values}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`, "palpite");
    var NUIT = { ciel: ["#0B1028", "#26355C"], mer: { haut: "#1E3552", bas: "#2C4A6E", vague: "#3E6890", ecume: "#9FB8D2" }, sable: { haut: "#5E5A56", bas: "#3A3634", ecume: "#8FA9C4", galet: "#3E4352", galetH: "#6A7286", grain: "#7A746C" }, roche: ["#545B6E", "#3E4352", "#2E3240"] };
    var TEMPETE = { ciel: ["#070B1C", "#1E2A52"], mer: { haut: "#142844", bas: "#22406A", vague: "#3E6890", ecume: "#A8C0DA" } };
    var ciel = /* @__PURE__ */ __name((id, [haut, bas], y1 = W2) => `<defs>${lin(id, [[0, haut], [1, bas]])}</defs><rect x="0" y="0" width="${W2}" height="${y1}" fill="url(#${id})"/>`, "ciel");
    function etoiles(n, yMax, seed = 3, filante = false) {
      const g = rnd(seed);
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = f(g() * W2), y = f(g() * yMax), r = f(0.6 + g() * 1.2), d = f(1.8 + g() * 2.6);
        s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6DC">${palpite("opacity", "1;0.25;1", d, g() * d)}</circle>`;
        if (r > 1.55) s += `<path d="M${x},${f(y - r * 3)} L${x},${f(y + r * 3)} M${f(x - r * 3)},${y} L${f(x + r * 3)},${y}" stroke="#FFF6DC" stroke-width="0.5" opacity=".55"/>`;
      }
      if (filante) s += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.8;0.83;0.9;1" dur="9s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;120 50;120 50" keyTimes="0;0.8;0.9;1" dur="9s" repeatCount="indefinite"/>${trait(`M${f(W2 * 0.2)},30 l-34,-14`, "#FFF6DC", 1.6)}<circle cx="${f(W2 * 0.2)}" cy="30" r="1.8" fill="#FFFFFF"/></g>`;
      return s;
    }
    __name(etoiles, "etoiles");
    function lune(id, x, y, r = 16) {
      return `<defs>${rad(id, [[0, "#FFF6D8", 0.55], [1, "#FFF6D8", 0]])}</defs><circle cx="${x}" cy="${y}" r="${f(r * 2.8)}" fill="url(#${id})">${palpite("opacity", "0.8;1;0.8", 6)}</circle>` + E(x, y, r, r, "#F6EED6", 1.6) + E(x - r * 0.35, y - r * 0.25, r * 0.2, r * 0.16, "#E2D8BC") + E(x + r * 0.3, y + r * 0.35, r * 0.26, r * 0.2, "#E2D8BC") + trait(`M${f(x - r * 0.7)},${f(y - r * 0.3)} Q${f(x - r * 0.6)},${f(y - r * 0.75)} ${f(x - r * 0.15)},${f(y - r * 0.85)}`, "#FFFFFF", 1.2, 'opacity=".7"');
    }
    __name(lune, "lune");
    function mer(id, y0, y1, c, vitesse = 1) {
      let s = `<defs>${lin(id, [[0, c.haut], [1, c.bas]])}</defs><rect x="0" y="${y0}" width="${W2}" height="${y1 - y0}" fill="url(#${id})"/>`;
      for (let i = 0; i < 5; i++) {
        const y = f(y0 + (y1 - y0) * (0.12 + i * 0.2)), per = 60 + i * 14, h = 2 + i * 1.1, d = (6 - i * 0.7) / vitesse;
        const vague = Array.from({ length: Math.ceil(W2 / per) + 3 }, (_, k) => `M${k * per - per},${y} q${f(per / 4)},-${f(h)} ${f(per / 2)},0`).join(" ");
        s += `<g>${defile("0 0", `${per} 0`, d, i * 0.7)}${trait(vague, i % 2 ? c.vague : c.ecume, f(1.2 + i * 0.45), `opacity="${f(0.42 + i * 0.12)}"`)}</g>`;
      }
      return s;
    }
    __name(mer, "mer");
    var reflet = /* @__PURE__ */ __name((x, y0, n = 5) => [...Array(n).keys()].map((i) => `<rect x="${f(x - 12 - i * 3)}" y="${f(y0 + i * 10)}" width="${24 + i * 6}" height="2" rx="1" fill="#F6EED6" opacity=".4">${palpite("opacity", "0.12;0.6;0.12", 1.4 + i * 0.3, i * 0.4)}</rect>`).join(""), "reflet");
    function sable(id, y, c = NUIT.sable, seed = 5) {
      let s = `<defs>${lin(id, [[0, c.haut], [1, c.bas]])}</defs>` + P(`M0,${y} Q${W2 * 0.3},${y - 14} ${W2 * 0.55},${y - 6} Q${W2 * 0.8},${y + 2} ${W2},${y - 10} L${W2},${W2} L0,${W2} Z`, `url(#${id})`, 2);
      s += `<g>${vaVient("translate", "0 -3", "0 4", 4.6)}${trait(`M-10,${y + 3} Q${W2 * 0.3},${y - 11} ${W2 * 0.55},${y - 3} Q${W2 * 0.8},${y + 5} ${W2 + 10},${y - 7}`, c.ecume, 2.2, 'opacity=".55"')}</g>`;
      const g = rnd(seed);
      for (let i = 0; i < 14; i++) {
        const x = f(g() * W2), yy = f(y + 20 + g() * (W2 - y - 30)), r = f(2 + g() * 6);
        s += E(x, yy, r, r * 0.6, c.galet, 1.2) + E(x - r * 0.3, yy - r * 0.25, r * 0.35, r * 0.2, c.galetH, 0);
      }
      for (let i = 0; i < 34; i++) s += `<circle cx="${f(g() * W2)}" cy="${f(y + 10 + g() * (W2 - y))}" r="0.7" fill="${c.grain}"/>`;
      return s;
    }
    __name(sable, "sable");
    var nappe = /* @__PURE__ */ __name((y, a, dur, dx = 30, k = 1, rgb = "220,230,242") => `<g>${vaVient("translate", `${-dx} 0`, `${dx} 0`, dur)}${[[-40, 0, 230], [170, 8, 260], [380, -4, 210]].map(([x, dy, rx]) => `<ellipse cx="${x}" cy="${f(y + dy)}" rx="${rx}" ry="${f(26 * k)}" fill="rgb(${rgb})" opacity="${a}"/>`).join("")}</g>`, "nappe");
    function pluie(n, a, seed = 7, w = 1.4) {
      const g = rnd(seed);
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = f(g() * 520), d = 0.45 + g() * 0.25, l = f(14 + g() * 10);
        s += `<path d="M${x},-30 l${f(-l * 0.55)},${l}" stroke="rgb(200,216,238)" stroke-width="${w}" stroke-linecap="round" opacity="${a}">${defile("0 0", "-240 460", d, g() * d)}</path>`;
      }
      return s;
    }
    __name(pluie, "pluie");
    var halo = /* @__PURE__ */ __name((id, x, y, r, rgb = "200,225,240", a = 0.45, dur = 2.6) => `<defs>${rad(id, [[0, `rgb(${rgb})`, a], [1, `rgb(${rgb})`, 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})">${palpite("r", `${f(r * 0.85)};${f(r * 1.1)};${f(r * 0.85)}`, dur)}</circle>`, "halo");
    var brumeCorps = /* @__PURE__ */ __name((s, expr = "neutre") => `<g transform="translate(${f(-20 * s)} ${f(-32 * s)}) scale(${f(s)})">${brumeFrame("s0", 0, expr)}</g>`, "brumeCorps");
    var brume = /* @__PURE__ */ __name((id, x, y, s, expr = "neutre", dur = 2.6, lueur = 0.45) => halo(id, x, y - 16 * s, 26 * s, "220,236,250", lueur, dur) + `<g transform="translate(${f(x)} ${f(y)})"><g>${vaVient("translate", "0 0", `0 ${f(-3.2 * s)}`, dur)}${vaVient("rotate", "-3", "3", dur * 1.6)}${brumeCorps(s, expr)}</g></g>`, "brume");
    function feu(id, x, y, s, prend = false) {
      let o = `<defs>${rad(id + "g", [[0, "#FFD27A", 0.75], [0.45, "#FF9A3A", 0.3], [1, "#FF7A2A", 0]])}${lin(id + "f1", [[0, "#FFE680"], [0.6, "#FF8A2E"], [1, "#E8402A"]])}${lin(id + "f2", [[0, "#FFF6C8"], [1, "#FFC23A"]])}${rad(id + "p", [[0, "#B8B2A6"], [1, "#6E6A62"]], 0.35, 0.3, 0.8)}${lin(id + "b", [[0, "#C08A5A"], [1, "#6A4428"]])}</defs>`;
      const lueur = `<ellipse cx="${x}" cy="${f(y - 8 * s)}" rx="${f(90 * s)}" ry="${f(60 * s)}" fill="url(#${id}g)">${palpite("opacity", "0.85;1;0.75;0.95;0.85", 1.3)}</ellipse>`;
      o += prend ? `<g opacity="0">${fondu("0;0.6;1", "0;0.5;1", 1.6)}${lueur}</g>` : lueur;
      o += [-17, -9, 0, 9, 17].map((dx, i) => E(x + dx * s, y + (i % 2 ? 2 : 3.2) * s, 4.8 * s, 3.2 * s, `url(#${id}p)`, 1.2)).join("");
      for (const [a, b, c, d] of [[-13, 1, 12, -3], [-11, -3, 13, 1]]) o += L([x + a * s, y + b * s], [x + c * s, y + d * s], OUT, 7 * s) + L([x + a * s, y + b * s], [x + c * s, y + d * s], `url(#${id}b)`, 5 * s);
      o += E(x + 12 * s, y - 3 * s, 2 * s, 2.6 * s, "#E8A06A", 0.8) + E(x - 11 * s, y - 3 * s, 2 * s, 2.6 * s, "#E8A06A", 0.8);
      const flamme = /* @__PURE__ */ __name((dx, h, w, fill, dur, beg, trace = true) => `<g transform="translate(${f(x + dx * s)} ${f(y - 1 * s)})"><g>${vaVient("scale", "1 1", "0.93 1.09", dur, beg)}${vaVient("skewX", "-3.5", "3.5", dur * 1.9, beg)}<path d="M${f(-w * s)},${f(-w * s * 0.2)} C${f(-w * s * 1.05)},${f(-h * s * 0.5)} ${f(-w * s * 0.35)},${f(-h * s * 0.72)} 0,${f(-h * s)} C${f(w * s * 0.35)},${f(-h * s * 0.72)} ${f(w * s * 1.05)},${f(-h * s * 0.5)} ${f(w * s)},${f(-w * s * 0.2)} C${f(w * s * 0.9)},${f(w * s * 0.5)} ${f(-w * s * 0.9)},${f(w * s * 0.5)} ${f(-w * s)},${f(-w * s * 0.2)} Z" fill="${fill}"${trace ? ` stroke="${OUT}" stroke-width="${f(1.3 * s / 1.8)}" stroke-linejoin="round"` : ""}/></g></g>`, "flamme");
      let fl = flamme(-5.5, 24, 8, `url(#${id}f1)`, 0.7, 0) + flamme(5.5, 27, 8, `url(#${id}f1)`, 0.62, 0.25) + flamme(0, 31, 9.5, `url(#${id}f1)`, 0.8, 0.1) + flamme(0, 21, 6.4, `url(#${id}f2)`, 0.56, 0.15, false) + flamme(0, 11, 3.4, "#FFFBE6", 0.46, 0.3, false);
      const g = rnd(11);
      for (let i = 0; i < 9; i++) {
        const d = 1.4 + g() * 1.2, bx = (g() - 0.5) * 14 * s, hh = 40 + g() * 40, beg = g() * d;
        fl += `<circle cx="${f(x + bx)}" cy="${f(y - 12 * s)}" r="${f(0.9 + g() * 0.8)}" fill="#FFE07A"><animateTransform attributeName="transform" type="translate" values="0 0;${f(g() * 10 - 5)} ${f(-hh * 0.5)};${f(g() * 14 - 7)} ${f(-hh)}" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.8;0" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></circle>`;
      }
      if (prend) fl = `<g transform="translate(${x} ${y})"><g>${uneFois("scale", "0.1;0.45;1", "0;0.4;1", 1.6)}<g transform="translate(${-x} ${-y})">${fl}</g></g></g>`;
      return o + fl;
    }
    __name(feu, "feu");
    var epave = /* @__PURE__ */ __name((x, y, s, a) => `<g transform="translate(${x} ${y})"><g>${vaVient("rotate", "-16", "-12", 5.2)}${vaVient("translate", "0 0", "0 2.4", 3.4)}<g transform="scale(${s})" opacity="${a}">` + P("M-60,0 L56,0 L66,-14 L-66,-14 Z", "#C8C4BA", 2) + P("M-58,0 L54,0 L60,8 L-50,8 Z", "#8A3A30", 2) + P("M-40,-14 L34,-14 L30,-30 L-36,-30 Z", "#D8D4CA", 2) + `<rect x="6" y="-48" width="14" height="18" fill="#C8A04B" stroke="${OUT}" stroke-width="2"/><rect x="6" y="-44" width="14" height="4" fill="#3E5A8C"/>` + [-50, -36, -22, -8, 6, 20, 34, 48].map((px) => E(px, -7, 3, 3, "#3E5A7E", 1.2)).join("") + "</g></g></g>", "epave");
    function rocher(id, x, y, w, h, c = NUIT.roche) {
      const d = `M${x},${y} Q${f(x - w * 0.06)},${f(y - h * 0.7)} ${f(x + w * 0.3)},${f(y - h)} Q${f(x + w * 0.6)},${f(y - h * 1.12)} ${f(x + w * 0.86)},${f(y - h * 0.8)} Q${f(x + w * 1.04)},${f(y - h * 0.4)} ${f(x + w)},${y} Z`;
      return `<defs>${lin(id, [[0, c[0]], [0.6, c[1]], [1, c[2]]], 0.6, 1)}</defs>` + P(d, `url(#${id})`, 2.4) + P(`M${f(x + w * 0.58)},${f(y - h * 1.04)} Q${f(x + w * 0.9)},${f(y - h * 0.8)} ${f(x + w)},${y} L${f(x + w * 0.66)},${y} Q${f(x + w * 0.74)},${f(y - h * 0.5)} ${f(x + w * 0.58)},${f(y - h * 1.04)} Z`, "rgba(0,0,0,.2)", 0) + trait(`M${f(x + w * 0.2)},${f(y - h * 0.8)} L${f(x + w * 0.4)},${f(y - h * 0.96)}`, "#8A90A4", 3, 'opacity=".8"') + trait(`M${f(x + w * 0.15)},${f(y - h * 0.3)} q${f(w * 0.1)},-6 ${f(w * 0.22)},-2`, c[2], 1.2, 'opacity=".7"');
    }
    __name(rocher, "rocher");
    var greve = /* @__PURE__ */ __name((id, horizon = 250, seed = 3) => ciel(id + "c", NUIT.ciel, horizon) + etoiles(26, horizon - 70, seed) + mer(id + "m", horizon - 54, horizon, NUIT.mer) + nappe(horizon - 40, 0.2, 14) + sable(id + "s", horizon), "greve");
    var vignette = /* @__PURE__ */ __name((id, a = 0.45, rgb = "2,4,10") => `<defs>${rad(id, [[0, `rgb(${rgb})`, 0], [0.55, `rgb(${rgb})`, 0], [1, `rgb(${rgb})`, a]], 0.5, 0.5, 0.74)}</defs><rect x="0" y="0" width="${W2}" height="${W2}" fill="url(#${id})"/>`, "vignette");
    var tache = /* @__PURE__ */ __name((id, x, y, rx, ry, rgb, a, dur = 3) => `<defs>${rad(id, [[0, `rgb(${rgb})`, a], [0.5, `rgb(${rgb})`, a * 0.4], [1, `rgb(${rgb})`, 0]])}</defs><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${id})">${palpite("opacity", "0.82;1;0.82", dur)}</ellipse>`, "tache");
    var ombreAvatar = /* @__PURE__ */ __name((id, a, k = 0.34) => a ? `<defs>${rad(id, [[0, "#000000", k], [0.65, "#000000", k * 0.45], [1, "#000000", 0]])}</defs><ellipse cx="${a.x}" cy="${f(a.y - 1)}" rx="${f(16 * a.echelle)}" ry="${f(4.4 * a.echelle)}" fill="url(#${id})"/>` : "", "ombreAvatar");
    var lueurVoilee = /* @__PURE__ */ __name((id, x, y, r, a = 0.2, rgb = "200,214,240", dur = 9) => `<defs>${rad(id, [[0, `rgb(${rgb})`, a], [0.3, `rgb(${rgb})`, a * 0.45], [0.65, `rgb(${rgb})`, a * 0.12], [1, `rgb(${rgb})`, 0]])}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})">${palpite("opacity", "0.75;1;0.75", dur)}</circle>`, "lueurVoilee");
    function nappeDouce(id, y, a, dur, dx = 30, k = 1, rgb = "220,230,242", seed = 1) {
      const g = rnd(seed);
      let s = `<defs>${rad(id, [[0, `rgb(${rgb})`, a], [0.45, `rgb(${rgb})`, a * 0.6], [1, `rgb(${rgb})`, 0]])}</defs><g>${vaVient("translate", `${-dx} 0`, `${dx} 0`, dur)}`;
      for (const [x, dy, rx] of [[-30, 0, 240], [150, 10, 270], [330, -6, 230], [60, -16, 180], [260, 16, 200]]) s += `<ellipse cx="${x}" cy="${f(y + dy)}" rx="${rx}" ry="${f(36 * k)}" fill="url(#${id})">${palpite("opacity", "0.75;1;0.75", f(5 + g() * 4), g() * 4)}</ellipse>`;
      return s + "</g>";
    }
    __name(nappeDouce, "nappeDouce");
    function houle(id, y0, y1, c, { vitesse = 1, lum = null } = {}) {
      const h = y1 - y0;
      let s = `<defs>${lin(id, [[0, c.haut], [1, c.bas]])}${lin(id + "v", [[0, c.ecume, 0.85], [0.4, c.vague, 0.5], [1, c.vague, 0]])}</defs><rect x="0" y="${y0}" width="${W2}" height="${h}" fill="url(#${id})"/><rect x="0" y="${y0}" width="${W2}" height="1.4" fill="${c.ecume}" opacity=".3"/>`;
      for (let i = 0; i < 5; i++) {
        const y = f(y0 + h * (0.14 + i * 0.19)), per = 70 + i * 16, a = f(1.6 + i * 1.3), d = (7.5 - i * 0.8) / vitesse, n = Math.ceil(W2 / per) + 3;
        let dp = `M${-per},${y}`;
        for (let k = 0; k < n; k++) dp += ` q${f(per / 4)},-${a} ${f(per / 2)},0 q${f(per / 4)},${f(a * 0.45)} ${f(per / 2)},0`;
        dp += ` L${W2 + per * 2},${f(y + 6 + i * 2.2)} L${-per},${f(y + 6 + i * 2.2)} Z`;
        s += `<g>${defile("0 0", `${-per} 0`, d, i * 0.9)}<path d="${dp}" fill="url(#${id}v)" opacity="${f(0.3 + i * 0.1)}"/></g>`;
      }
      if (lum) s += scintille(lum.x, y0 + 4, 6, lum.rgb || "246,238,214", lum.a || 0.5);
      return s;
    }
    __name(houle, "houle");
    var scintille = /* @__PURE__ */ __name((x, y0, n, rgb, a) => [...Array(n).keys()].map((i) => `<rect x="${f(x - 10 - i * 4)}" y="${f(y0 + i * 9)}" width="${20 + i * 8}" height="1.8" rx="0.9" fill="rgb(${rgb})" opacity="${a}">${palpite("opacity", `${f(a * 0.25)};${f(a)};${f(a * 0.25)}`, 1.4 + i * 0.35, i * 0.45)}</rect>`).join(""), "scintille");
    function greveSable(id, y, c = NUIT.sable, seed = 5) {
      const bord = `M0,${y} Q${W2 * 0.3},${y - 14} ${W2 * 0.55},${y - 6} Q${W2 * 0.8},${y + 2} ${W2},${y - 10}`;
      let s = `<defs>${lin(id, [[0, c.haut], [0.4, c.mi || c.haut], [1, c.bas]])}${lin(id + "h", [[0, c.ecume, 0.38], [1, c.ecume, 0]])}${rad(id + "g", [[0, c.galetH], [1, c.galet]], 0.35, 0.3, 0.78)}</defs>` + P(`${bord} L${W2},${W2} L0,${W2} Z`, `url(#${id})`, 2);
      s += `<g>${vaVient("translate", "0 -3", "0 5", 4.6)}` + P(`${bord} L${W2},${y + 26} Q${W2 * 0.8},${y + 34} ${W2 * 0.55},${y + 26} Q${W2 * 0.3},${y + 18} 0,${y + 28} Z`, `url(#${id}h)`, 0) + trait(`M-10,${y + 3} Q${W2 * 0.3},${y - 11} ${W2 * 0.55},${y - 3} Q${W2 * 0.8},${y + 5} ${W2 + 10},${y - 7}`, c.ecume, 3, 'opacity=".42"') + trait(`M-10,${y + 1} Q${W2 * 0.3},${y - 13} ${W2 * 0.55},${y - 5} Q${W2 * 0.8},${y + 3} ${W2 + 10},${y - 9}`, "#FFFFFF", 1.1, 'opacity=".55"');
      const g = rnd(seed);
      for (let i = 0; i < 12; i++) {
        const t = g(), bx = f(t * W2), by = f((1 - t) ** 2 * y + 2 * t * (1 - t) * (y - 10) + t * t * (y - 6) + 1 + g() * 5);
        s += `<circle cx="${bx}" cy="${by}" r="${f(0.8 + g() * 1.2)}" fill="#FFFFFF" opacity=".5">${palpite("opacity", "0.2;0.6;0.2", f(2 + g() * 2), g() * 3)}</circle>`;
      }
      s += "</g>";
      for (let i = 0; i < 7; i++) {
        const x = f(g() * W2), yy = f(y + 34 + g() * (W2 - y - 50)), l = f(30 + g() * 50);
        s += trait(`M${x},${yy} q${f(l / 2)},-${f(2 + g() * 2)} ${l},0`, c.bas, 1.2, 'opacity=".45"') + trait(`M${x},${f(yy + 1.4)} q${f(l / 2)},-${f(2 + g() * 2)} ${l},0`, c.haut, 0.8, 'opacity=".35"');
      }
      for (let i = 0; i < 14; i++) {
        const x = f(g() * W2), yy = f(y + 22 + g() * (W2 - y - 32)), r = f(2 + g() * 6);
        s += E(x + r * 0.35, yy + r * 0.3, r * 1.05, r * 0.5, "rgba(0,0,0,.28)", 0) + E(x, yy, r, r * 0.62, `url(#${id}g)`, 1.1) + E(x - r * 0.3, yy - r * 0.28, r * 0.3, r * 0.15, "#FFFFFF", 0).replace("/>", ' opacity=".35"/>');
      }
      for (let i = 0; i < 40; i++) s += `<circle cx="${f(g() * W2)}" cy="${f(y + 10 + g() * (W2 - y))}" r="${f(0.5 + g() * 0.5)}" fill="${c.grain}" opacity="${f(0.5 + g() * 0.5)}"/>`;
      return s;
    }
    __name(greveSable, "greveSable");
    function brume2(id, x, y, s, expr = "neutre", { dur = 2.6, lueur = 0.45, sol = null } = {}) {
      let o = halo(id + "H", x, y - 14 * s, 30 * s, "210,230,248", lueur, dur);
      if (sol !== null) o += tache(id + "T", x, y + sol, 34 * s, 8 * s, "200,225,245", 0.36, dur * 1.3);
      o += `<g transform="translate(${f(x)} ${f(y)})"><g>${vaVient("translate", "0 0", `0 ${f(-3.2 * s)}`, dur)}${vaVient("rotate", "-3", "3", dur * 1.6)}<g>${vaVient("skewX", "-2.5", "2.5", dur * 0.9, dur * 0.3)}<g>${vaVient("translate", "0 0", `${f(0.45 * s)} 0`, 0.5)}${brumeCorps(s, expr)}</g></g></g></g>`;
      return o;
    }
    __name(brume2, "brume2");
    function rocher2(id, x, y, w, h, c = NUIT.roche, lum = null) {
      const X = /* @__PURE__ */ __name((k) => f(x + w * k), "X"), Y = /* @__PURE__ */ __name((k) => f(y - h * k), "Y");
      const crete = `Q${X(0.2)},${Y(1.02)} ${X(0.36)},${Y(0.98)} Q${X(0.46)},${Y(0.88)} ${X(0.54)},${Y(0.93)} Q${X(0.7)},${Y(1.06)} ${X(0.84)},${Y(0.76)}`;
      const d = `M${x},${y} Q${X(-0.05)},${Y(0.55)} ${X(0.1)},${Y(0.78)} ${crete} Q${X(1.03)},${Y(0.46)} ${X(1)},${y} Z`;
      let s = `<defs>${rad(id + "o", [[0, "#000000", 0.45], [0.55, "#000000", 0.22], [1, "#000000", 0]])}${lin(id, [[0, c[0]], [0.5, c[1]], [1, c[2]]], 0.8, 1)}${lin(id + "f", [[0, "#8E96AA", 0.8], [0.45, "#8E96AA", 0.2], [1, "#8E96AA", 0]], 1, 1)}${lin(id + "d", [[0.5, "#000000", 0], [1, "#000000", 0.38]], 1, 0)}${lin(id + "b", [[0.55, "#000000", 0], [1, "#000000", 0.42]])}</defs>`;
      s += lum ? `<ellipse cx="${X(0.3)}" cy="${f(y + 7)}" rx="${f(w * 0.7)}" ry="${f(h * 0.18)}" fill="url(#${id}o)">${palpite("opacity", "0.8;1;0.8", 3.2)}</ellipse>` : `<ellipse cx="${X(0.66)}" cy="${f(y + 5)}" rx="${f(w * 0.62)}" ry="${f(h * 0.14)}" fill="url(#${id}o)"/>`;
      s += E(x + w * 0.5, y + 1, w * 0.56, 5, NUIT.sable.haut, 0).replace("/>", ' opacity=".5"/>') + P(d, `url(#${id})`, 2.4) + P(d, `url(#${id}f)`, 0) + P(d, `url(#${id}d)`, 0) + P(d, `url(#${id}b)`, 0);
      s += trait(`M${X(0.4)},${Y(0.9)} q${f(w * 0.03)},${f(h * 0.12)} ${f(w * 0.1)},${f(h * 0.2)} q${f(w * 0.03)},${f(h * 0.1)} -${f(w * 0.01)},${f(h * 0.22)}`, c[2], 1.4, 'opacity=".85"') + trait(`M${X(0.62)},${Y(0.5)} q${f(w * 0.06)},${f(h * 0.08)} ${f(w * 0.05)},${f(h * 0.24)}`, c[2], 1.2, 'opacity=".7"') + trait(`M${X(0.14)},${Y(0.34)} q${f(w * 0.08)},-5 ${f(w * 0.2)},-1`, c[2], 1.2, 'opacity=".7"') + trait(`M${X(0.41)},${Y(0.9)} q${f(w * 0.03)},${f(h * 0.12)} ${f(w * 0.1)},${f(h * 0.2)}`, "#8E96AA", 0.8, 'opacity=".45"') + [[0.2, 0.32, 7, 4], [0.5, 0.22, 5, 3], [0.74, 0.5, 6, 3.5], [0.1, 0.14, 4, 2.4], [0.6, 0.76, 4, 2.4]].map(([kx, ky, rx, ry]) => E(x + w * kx, y - h * ky, rx, ry, "#7E8A7A", 0).replace("/>", ' opacity=".5"/>') + E(x + w * kx - rx * 0.3, y - h * ky - ry * 0.3, rx * 0.5, ry * 0.5, "#98A48E", 0).replace("/>", ' opacity=".5"/>')).join("") + [[0.3, 0.7], [0.56, 0.6], [0.8, 0.4]].map(([kx, ky]) => P(`M${X(kx)},${Y(ky)} l4,-3 l4,2 l-3,3 Z`, c[0], 0).replace("/>", ' opacity=".55"/>')).join("");
      if (lum) s += trait(`M${X(0.1)},${Y(0.78)} ${crete}`, `rgb(${lum.rgb || "205,228,245"})`, 2.6, `opacity=".5"`).replace("/>", `>${palpite("opacity", "0.3;0.75;0.3", lum.dur || 3)}</path>`);
      return s;
    }
    __name(rocher2, "rocher2");
    module.exports = /* @__PURE__ */ __name(function scenesAnimees(H) {
      const S = {};
      S["00_carte"] = {
        fond: /* @__PURE__ */ __name(() => ciel("c0", NUIT.ciel) + etoiles(30, 400, 31, true) + `<defs>${lin("c0r", [[0, "#FFFFFF", 0], [0.5, "#FFFFFF", 0.55], [1, "#FFFFFF", 0]], 1, 0)}<clipPath id="c0k"><rect x="70" y="96" width="260" height="196" rx="10"/></clipPath></defs><ellipse cx="200" cy="300" rx="150" ry="14" fill="#000000" opacity=".25"/>` + H.carte(false) + `<g clip-path="url(#c0k)"><rect x="-80" y="80" width="60" height="240" fill="url(#c0r)" transform="skewX(-20)">${`<animateTransform attributeName="transform" type="translate" values="0 0;0 0;460 0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" additive="sum"/>`}</rect></g>`, "fond")
      };
      S["00_tampon"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = ciel("c1", NUIT.ciel) + etoiles(30, 400, 31);
          s += [0, 1, 2].map((i) => `<g opacity=".5">${defile("-260 0", "460 0", 2.6, i * 0.9)}${trait(`M0,${240 + i * 40} q60,-30 120,-10 q60,20 120,-20`, "rgb(220,230,242)", 3)}</g>`).join("");
          const tampon = `<g transform="rotate(-14 250 266)" opacity="0"><animate attributeName="opacity" values="0;0;1" keyTimes="0;0.5;1" dur="0.5s" fill="freeze"/><g transform="translate(250 265)"><g>${uneFois("scale", "1.6;1.6;0.62", "0;0.5;1", 0.5)}<g transform="translate(-250 -265)">${H.tamponSeul()}</g></g></g></g>`;
          s += `<g transform="translate(200 200)"><g>${uneFois("translate", "0 0;0 0;40 -30;100 -80;130 -110", "0;0.3;0.5;0.75;1", 3.4)}${uneFois("rotate", "0;0;10;24;30", "0;0.3;0.5;0.75;1", 3.4)}${uneFois("scale", "1;1;0.8;0.55;0.45", "0;0.3;0.5;0.75;1", 3.4)}<g>${vaVient("translate", "0 -6", "0 6", 2.4)}${vaVient("rotate", "-5", "5", 3.2)}<g transform="translate(-200 -200)">${H.carte(false)}${tampon}</g></g></g></g>`;
          return s;
        }, "fond")
      };
      S["01_pont"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = `<defs>${lin("poC", [[0, "#080C1E"], [0.6, "#16224A"], [1, "#2A3A62"]])}${lin("poP", [[0, "#7A5A3E"], [1, "#4A3322"]])}${lin("poM", [[0, "#D8C8A8"], [1, "#A8987A"]], 1, 0)}${rad("poL", [[0, "#FFE6A0", 0.55], [1, "#FFE6A0", 0]])}${rad("poB", [[0, "#FF8A5A"], [0.7, "#E8562E"], [1, "#B83A1E"]], 0.4, 0.35, 0.7)}</defs>`;
          s += `<rect x="0" y="0" width="400" height="300" fill="url(#poC)"/>`;
          const nuage = /* @__PURE__ */ __name((x, y, k, c, dur, dx) => `<g>${vaVient("translate", `${-dx} 0`, `${dx} 0`, dur)}<g transform="translate(${x} ${y}) scale(${k})">${[[-40, 0, 46, 22], [0, -12, 52, 28], [44, -2, 48, 24], [80, 8, 36, 16], [-74, 10, 34, 14]].map(([cx, cy, rx, ry]) => E(cx, cy, rx, ry, c)).join("")}</g></g>`, "nuage");
          s += nuage(80, 60, 1.2, "#1A2448", 14, 20) + nuage(300, 40, 1.4, "#141C3A", 18, 26) + nuage(200, 110, 1, "#222E58", 11, 14);
          s += `<g opacity="0"><animate attributeName="opacity" values="0;0;0.8;0.15;0.6;0;0" keyTimes="0;0.78;0.79;0.81;0.83;0.88;1" dur="9s" repeatCount="indefinite"/><rect x="0" y="0" width="400" height="300" fill="#B8C8F0" opacity=".22"/>${trait("M262,0 L248,40 L262,46 L240,96 L254,100 L236,150", "#FFFFFF", 3)}${trait("M262,0 L248,40 L262,46 L240,96 L254,100 L236,150", "#B8D0FF", 7, 'opacity=".35"')}</g>`;
          let m = mer("poMe", 190, 300, TEMPETE.mer, 1.6);
          m += `<g>${defile("0 0", "170 0", 4.4)}${P("M-340,240 Q-260,170 -170,214 Q-100,246 -40,206 Q20,170 0,214 Q60,250 130,206 Q200,168 170,214 Q230,250 300,206 Q370,168 340,214 Q400,250 470,206 L470,300 L-340,300 Z", "#1E3A5E", 2)}${trait("M-260,192 q30,-12 60,6 M-90,198 q30,-12 60,6 M80,198 q30,-12 60,6 M250,198 q30,-12 60,6", "#C8DAEE", 2.2)}</g>`;
          s += `<g>${vaVient("translate", "0 -8", "0 8", 3.2)}${vaVient("rotate", "-1.6 200 300", "1.6 200 300", 6.4)}${m}</g>`;
          s += `<g opacity="0"><animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.55;0.62;0.85" dur="3.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 20;0 20;0 -16;0 -30" keyTimes="0;0.55;0.65;0.85" dur="3.2s" repeatCount="indefinite"/>${[[30, 238, 10], [60, 230, 14], [100, 236, 9], [380, 236, 12], [350, 228, 9]].map(([x, y, r]) => E(x, y, r, r * 0.7, "#E8F2FC") + E(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.2, "#FFFFFF")).join("")}</g>`;
          s += P("M0,300 L400,300 L400,400 L0,400 Z", "url(#poP)", 2) + [318, 342, 370].map((y) => L([0, y], [400, y], "#3A2818", 2)).join("");
          s += [[60, 330], [190, 360], [300, 326], [120, 386]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="3" fill="#FFE6A0" opacity=".18">${palpite("opacity", ".1;.26;.1", 2 + i * 0.4)}</ellipse>`).join("");
          s += `<rect x="330" y="14" width="13" height="292" fill="url(#poM)" stroke="${OUT}" stroke-width="2"/>` + trait("M336,20 L400,120 M336,20 L270,250", "#3A2A1A", 1.4, 'opacity=".8"');
          const guirlande = /* @__PURE__ */ __name((x0, y0, x1, y1, creux, dur, beg) => {
            let g = trait(`M${x0},${y0} Q${(x0 + x1) / 2},${(y0 + y1) / 2 + creux} ${x1},${y1}`, OUT, 1.6);
            const cols = ["#FFD15A", "#F27A5A", "#7EC4E8", "#9BE07A"];
            for (let k = 1; k < 8; k++) {
              const t = k / 8, x = f((1 - t) ** 2 * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1), y = f((1 - t) ** 2 * y0 + 2 * t * (1 - t) * ((y0 + y1) / 2 + creux) + t * t * y1 + 6);
              g += `<circle cx="${x}" cy="${y}" r="10" fill="url(#poL)">${palpite("opacity", "1;0.6;1", 1.6 + k * 0.23)}</circle>` + E(x, y, 3.6, 4.6, cols[k % 4], 1.2) + E(x - 1.1, y - 1.6, 1, 1.4, "#FFFFFF").replace("/>", ' opacity=".7"/>');
            }
            return `<g>${vaVient("rotate", `-2.4 ${x1} ${y1}`, `2.4 ${x1} ${y1}`, dur, beg)}${g}</g>`;
          }, "guirlande");
          s += guirlande(-10, 60, 336, 40, 40, 1.8, 0) + guirlande(-10, 130, 336, 110, 46, 2.2, 0.6);
          s += [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${i * 50 + 4}" y="250" width="7" height="58" fill="#EDE6D8" stroke="${OUT}" stroke-width="1.6"/><path d="M${i * 50 + 6},254 L${i * 50 + 6},304" stroke="#FFFFFF" stroke-width="1" opacity=".6"/>`).join("");
          s += `<rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>` + L([0, 247], [400, 247], "#FFFFFF", 1.4);
          s += `<g>${vaVient("rotate", "-6 84 248", "6 84 248", 2.6)}${trait("M84,248 L84,252", "#C8A86A", 2)}<circle cx="84" cy="270" r="22" fill="url(#poB)" stroke="${OUT}" stroke-width="2.4"/><circle cx="84" cy="270" r="11" fill="#4A3322" stroke="${OUT}" stroke-width="2"/>${[45, 135, 225, 315].map((a) => `<rect x="80" y="248" width="8" height="10" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.8" transform="rotate(${a} 84 270)"/>`).join("")}${trait("M68,258 Q74,252 82,250", "#FFFFFF", 2, 'opacity=".6"')}</g>`;
          return s + pluie(60, 0.38, 7, 1.3);
        }, "fond"),
        devant: /* @__PURE__ */ __name(() => pluie(34, 0.28, 13, 1.8), "devant")
      };
      S["01_vague"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = ciel("vgC", TEMPETE.ciel) + `<rect x="0" y="250" width="400" height="150" fill="#6B4E36"/><rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>`;
          s += `<defs>${lin("vgV", [[0, "#3E6890"], [0.4, "#1E3A60"], [1, "#0E1E38"]])}</defs>`;
          const v = P("M-30,560 L-30,270 Q120,150 260,190 Q340,204 368,250 Q340,270 300,262 Q330,300 420,320 L420,560 Z", "url(#vgV)", 3) + trait("M10,250 Q130,150 250,200", "#9FB6CF", 4) + trait("M260,190 Q330,200 362,244", "#E8F0F8", 6) + [[300, 240, 8], [330, 250, 6], [350, 232, 5], [272, 230, 5]].map(([x, y, r]) => E(x, y, r, r * 0.8, "#E8F0F8", 1)).join("");
          s += `<g transform="translate(0 260)"><g>${uneFois("translate", "0 0;0 -150;0 -330", "0;0.45;1", 1.6)}<g>${vaVient("translate", "-8 0", "8 4", 1.8)}${v}</g></g></g>`;
          return s + pluie(50, 0.35, 17);
        }, "fond")
      };
      S["01_noir"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = `<defs>${lin("noC", [[0, "#02040A"], [0.7, "#060B18"], [1, "#0B1424"]])}${rad("noL", [[0, "rgb(110,130,170)", 0.2], [0.4, "rgb(110,130,170)", 0.07], [1, "rgb(110,130,170)", 0]])}${rad("noH", [[0, "rgb(70,95,140)", 0.3], [0.5, "rgb(70,95,140)", 0.12], [1, "rgb(70,95,140)", 0]])}${lin("noV", [[0, "#8FB0D8", 0.55], [0.5, "#4A6A98", 0.25], [1, "#4A6A98", 0]])}</defs><rect x="0" y="0" width="400" height="400" fill="url(#noC)"/>`;
          s += `<circle cx="318" cy="74" r="110" fill="url(#noL)">${palpite("opacity", "0.6;1;0.6", 11)}</circle><ellipse cx="200" cy="288" rx="300" ry="52" fill="url(#noH)">${palpite("opacity", "0.7;1;0.7", 7)}</ellipse>`;
          for (let i = 0; i < 4; i++) {
            const y = [284, 298, 316, 342][i], per = 110 + i * 30, a = 3 + i * 2.5, n = Math.ceil(W2 / per) + 3;
            let dp = `M${-per},${y}`;
            for (let k = 0; k < n; k++) dp += ` q${f(per / 4)},-${a} ${f(per / 2)},0 q${f(per / 4)},${f(a * 0.5)} ${f(per / 2)},0`;
            dp += ` L${W2 + per * 2},${y + 10 + i * 4} L${-per},${y + 10 + i * 4} Z`;
            s += `<g>${vaVient("translate", "0 -2", `0 ${2 + i}`, 5 + i * 1.3, i * 1.1)}<g>${defile("0 0", `${i % 2 ? per : -per} 0`, 14 + i * 3, i * 2.3)}<path d="${dp}" fill="url(#noV)" opacity="${f(0.12 + i * 0.06)}"/></g></g>`;
          }
          const g = rnd(23);
          for (let i = 0; i < 9; i++) {
            const x = f(g() * W2), y = f(286 + g() * 60), l = f(10 + g() * 26), d = f(4 + g() * 4);
            s += `<rect x="${x}" y="${y}" width="${l}" height="1.6" rx="0.8" fill="#9FB8D8" opacity="0">${palpite("opacity", "0;0.3;0", d, g() * d)}</rect>`;
          }
          s += `<g opacity=".5">${scintille(318, 290, 5, "150,170,205", 0.3)}</g>`;
          return s + vignette("noG", 0.6);
        }, "fond")
      };
      S["01_greve"] = {
        fond: /* @__PURE__ */ __name(() => ciel("gcC", NUIT.ciel, 240) + etoiles(20, 170, 41) + lune("gcL", 300, 70) + mer("gcM", 190, 250, NUIT.mer) + reflet(300, 196) + nappe(200, 0.18, 15) + sable("gcS", 250) + H.planche(40, 296, 96, -8) + H.planche(300, 326, 70, 12) + H.chaiseLongue(300, 286, 168) + nappe(300, 0.14, 19, 26, 1.2), "fond"),
        devant: /* @__PURE__ */ __name(() => nappe(370, 0.16, 17, 34, 1.4), "devant")
      };
      S["01_gilet"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = ciel("glC", NUIT.ciel, 150) + etoiles(16, 120, 51) + mer("glM", 130, 214, NUIT.mer) + `<defs>${lin("glS", [[0, NUIT.sable.haut], [1, NUIT.sable.bas]])}</defs>` + P("M0,214 Q200,200 400,210 L400,400 L0,400 Z", "url(#glS)", 2);
          s += `<g>${vaVient("translate", "0 -4", "0 14", 3.6)}${P("M0,214 Q100,206 200,218 Q300,230 400,212 L400,208 Q200,198 0,212 Z", "rgba(220,232,245,.5)", 0)}${trait("M0,214 Q100,206 200,218 Q300,230 400,212", "#E8F2FC", 1.6, 'opacity=".7"')}</g>`;
          const gilet = `<g transform="scale(0.9)">` + P("M-60,-36 Q-62,-48 -40,-50 L-14,-50 Q-8,-30 0,-30 Q8,-30 14,-50 L40,-50 Q62,-48 60,-36 L56,34 Q56,46 40,46 L-40,46 Q-56,46 -56,34 Z", "#F28A2E", 3) + L([0, -30], [0, 46], "#C86A1E", 2) + `<rect x="-56" y="-4" width="112" height="9" fill="#E8E4DA" stroke="${OUT}" stroke-width="1.6"/>` + H.texte(0, 28, "L’HIRONDELLE", 10.5, "#3C2819", 'font-weight="bold" letter-spacing="0.6" opacity="0.75"') + trait("M-48,-38 Q-46,-46 -36,-46", "#FFC88A", 2.4) + "</g>";
          s += `<g transform="translate(266 312)"><g>${uneFois("translate", "20 -60;6 -16;0 0", "0;0.6;1", 2.2)}${uneFois("rotate", "-30;-6;-9", "0;0.6;1", 2.2)}<g>${vaVient("rotate", "-1.5", "1.5", 3.6)}${gilet}</g></g></g>`;
          return s + nappe(170, 0.16, 16);
        }, "fond")
      };
      const ERRE = `<animateMotion dur="11s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0.34;0.34;0.68;0.68;1" keyTimes="0;0.27;0.4;0.66;0.78;1" keySplines="0.45 0 0.55 1;0 0 1 1;0.45 0 0.55 1;0 0 1 1;0.45 0 0.55 1" path="M0,0 C-20,-6 -48,-10 -62,-20 C-44,-38 -4,-44 22,-36 C34,-22 18,-6 0,0"/>`;
      S["02_lueur"] = {
        fond: /* @__PURE__ */ __name(() => ciel("luC", NUIT.ciel, 240) + etoiles(26, 170, 61) + lueurVoilee("luL", 66, 56, 96, 0.16) + houle("luM", 186, 240, NUIT.mer, { vitesse: 0.8 }) + nappeDouce("luN1", 226, 0.36, 16, 20, 0.8, "220,230,242", 3) + greveSable("luS", 240, NUIT.sable, 61) + ombreAvatar("luO", H.avatarDe("02_lueur")) + nappeDouce("luN2", 300, 0.26, 13, 30, 1.1, "220,230,242", 4) + `<g transform="translate(298 232)"><g>${ERRE}${halo("luG", 0, -10, 90, "200,225,245", 0.2, 3.4)}${brume2("luB", 0, 0, 1.8, "neutre", { dur: 2.4, lueur: 0.5, sol: 28 })}</g></g>`, "fond"),
        devant: /* @__PURE__ */ __name(() => nappeDouce("luD", 372, 0.2, 18, 34, 1.4, "220,230,242", 5), "devant")
      };
      S["02_approche"] = {
        fond: /* @__PURE__ */ __name(() => greve("ap", 260, 71) + `<g transform="translate(270 300)"><g>${uneFois("scale", "0.3;1.08;1", "0;0.7;1", 0.55)}<g transform="translate(-270 -300)">${halo("apH", 270, 200, 110, "200,225,240", 0.4)}${brume("apB", 270, 300, 3.8, "surpris", 1.8)}</g></g></g>`, "fond"),
        devant: /* @__PURE__ */ __name(() => nappe(384, 0.14, 15, 30, 1.4), "devant")
      };
      const PEEK = `<animateTransform attributeName="transform" type="translate" values="0 44;0 0;0 0;0 44;0 44" keyTimes="0;0.2;0.58;0.78;1" calcMode="spline" keySplines="0.45 0 0.55 1;0 0 1 1;0.45 0 0.55 1;0 0 1 1" dur="5.6s" repeatCount="indefinite"/>`;
      S["02_rocher"] = {
        fond: /* @__PURE__ */ __name(() => ciel("roC", NUIT.ciel, 250) + etoiles(26, 180, 81) + lueurVoilee("roL", 60, 60, 96, 0.14) + houle("roM", 196, 250, NUIT.mer, { vitesse: 0.9 }) + nappeDouce("roN1", 236, 0.34, 15, 20, 0.8, "220,230,242", 6) + greveSable("roS", 250, NUIT.sable, 81) + ombreAvatar("roO", H.avatarDe("02_rocher")) + tache("roT", 346, 318, 80, 16, "200,225,245", 0.3, 3.6) + `<g transform="translate(298 184)"><g>${PEEK}${halo("roG", 0, -6, 80, "200,225,245", 0.22, 3.2)}${brume2("roB", 0, 0, 2.6, "gene", { dur: 3.2, lueur: 0.3 })}</g></g>` + rocher2("roR", 204, 310, 186, 100, NUIT.roche, { rgb: "205,228,245", dur: 3.2 }) + nappeDouce("roN2", 318, 0.2, 14, 26, 1, "220,230,242", 7), "fond")
      };
      const TOUR_DUR = 6;
      const tour = /* @__PURE__ */ __name((devant) => {
        const path = "M100,0 A100,58 0 0 0 -100,0 A100,58 0 0 0 100,0";
        const vis = devant ? "0;0;1;1;0" : "1;1;0;0;1";
        return `<g transform="translate(200 300)"><g opacity="${devant ? 0 : 1}"><animate attributeName="opacity" values="${vis}" keyTimes="0;0.49;0.5;0.99;1" calcMode="discrete" dur="${TOUR_DUR}s" repeatCount="indefinite"/><animateMotion dur="${TOUR_DUR}s" repeatCount="indefinite" path="${path}"/>${halo(devant ? "exH2" : "exH1", 0, -40, 50)}${brume(devant ? "exB2" : "exB1", 0, 0, devant ? 2.4 : 2.2, "surpris", 1.6)}</g></g>`;
      }, "tour");
      S["02_examine"] = { fond: /* @__PURE__ */ __name(() => greve("ex", 250, 91) + tour(false), "fond"), devant: /* @__PURE__ */ __name(() => tour(true), "devant") };
      S["02_yeux"] = {
        fond: /* @__PURE__ */ __name(() => ciel("byC", ["#141C36", "#2E3C5C"]) + etoiles(30, 200, 101) + nappe(260, 0.2, 14) + nappe(340, 0.16, 18) + halo("byH", 250, 170, 150, "200,220,235", 0.35, 3.6), "fond"),
        devant: /* @__PURE__ */ __name(() => brume("byB", 250, 192, 5.4, "neutre", 3.2, 0.25), "devant")
      };
      S["02_village"] = {
        fond: /* @__PURE__ */ __name(() => ciel("viC", NUIT.ciel, 260) + etoiles(24, 180, 111) + sable("viS", 250) + `<g opacity="0">${fondu("0;1", "0;1", 2.4)}${halo("viH", 200, 210, 180, "210,230,240", 0.32, 4)}</g>` + H.ruines() + `<g>${fondu("1;0.35", "0;1", 2.4)}${nappe(236, 0.3, 15)}${nappe(300, 0.22, 19, 26, 1.2)}</g>` + brume("viB", 226, 150, 2.2, "neutre", 3), "fond")
      };
      S["02_epave"] = {
        fond: /* @__PURE__ */ __name(() => ciel("epC", NUIT.ciel, 220) + etoiles(26, 150, 121) + mer("epM", 170, 260, NUIT.mer) + epave(270, 192, 0.9, 0.5) + nappe(186, 0.32, 16) + nappe(214, 0.24, 20) + sable("epS", 260) + brume("epB", 176, 232, 2, "triste", 3.4), "fond")
      };
      S["02_proche"] = {
        fond: /* @__PURE__ */ __name(() => greve("pr", 250, 131) + halo("prH", 258, 252, 46), "fond"),
        devant: /* @__PURE__ */ __name(() => brume("prB", 258, 272, 1.3, "content", 2.2), "devant")
      };
      S["03_livre"] = {
        fond: /* @__PURE__ */ __name(() => greve("li", 250, 141) + rocher("liR", 214, 330, 180, 140) + E(318, 262, 32, 20, "#1A1E2B", 2) + `<g>${vaVient("translate", "0 0", "-26 8", 2.4)}${vaVient("rotate", "0 316 264", "6 316 264", 2.4)}${H.grimoire(316, 264, 0.95, -6)}</g><g>${vaVient("translate", "0 0", "-18 2", 2.4)}${brume("liB", 268, 266, 2.2, "gene", 1.2)}</g>`, "fond")
      };
      S["03_vent"] = {
        fond: /* @__PURE__ */ __name(() => {
          let s = ciel("veC", NUIT.ciel, 220) + etoiles(26, 150, 151) + lune("veL", 80, 60, 12) + mer("veM", 170, 240, NUIT.mer) + `<g opacity=".4">${fondu("0.4;0.95", "0;1", 3)}${epave(300, 186, 0.8, 1)}</g>` + sable("veS", 240) + H.planche(40, 282, 80, -10) + H.planche(290, 304, 60, 8) + rocher("veR1", 4, 276, 76, 44) + rocher("veR2", 330, 262, 70, 34);
          s += `<g>${uneFois("translate", "0 0;420 0", "0;1", 3.2)}${fondu("1;0.6;0", "0;0.6;1", 3.2)}${nappe(200, 0.5, 9)}${nappe(260, 0.5, 11, 30, 1.3)}${nappe(330, 0.4, 13, 30, 1.2)}</g>`;
          return s + [0, 1, 2].map((i) => `<g>${defile("-200 0", "460 0", 2.2, i * 0.7)}${trait(`M0,${110 + i * 60} q60,-16 120,0 q30,8 60,-6`, "rgb(230,240,250)", 3, 'opacity=".55"')}</g>`).join("");
        }, "fond")
      };
      S["05_feu"] = {
        fond: /* @__PURE__ */ __name(() => ciel("feC", NUIT.ciel, 240) + etoiles(40, 170, 9, true) + lune("feL", 70, 64) + mer("feM", 176, 242, NUIT.mer) + reflet(70, 184) + epave(330, 202, 0.6, 0.55) + sable("feS", 240) + `<g>${uneFois("scale", "1 1;1.12 1", "0;1", 2.4)}${nappe(232, 0.22, 16, 34)}${nappe(302, 0.16, 21, 26)}</g>` + feu("feF", 222, 334, 1.8, true) + brume("feB", 270, 300, 1.8, "content"), "fond")
      };
      S["06_silhouette"] = {
        fond: /* @__PURE__ */ __name(() => ciel("siC", NUIT.ciel, 230) + etoiles(30, 160, 161, true) + mer("siM", 170, 230, NUIT.mer) + nappe(200, 0.2, 16) + sable("siS", 230) + rocher("siR", 270, 236, 120, 70) + `<g>${vaVient("translate", "0 0", "0 -0.8", 4)}${P("M330,164 L331,140 Q332,132 340,131 Q348,132 349,140 L350,164 L345,164 L344,150 L336,150 L335,164 Z", "#0C101C", 0)}${E(340, 124, 5.6, 6.2, "#0C101C", 0)}</g><g>${palpite("opacity", "0.4;0.8;0.5;0.75;0.4", 1.3)}${trait("M331,162 L332,140 Q333,133 339,132 M335.2,121 Q336,119 338,118.4", "rgb(255,190,120)", 1.2)}</g>` + feu("siF", 176, 336, 1.6) + brume("siB", 226, 300, 1.5, "surpris"), "fond")
      };
      return S;
    }, "scenesAnimees");
    module.exports.outils = { f, lin, rad, trait, rnd, SPLINE, vaVient, defile, uneFois, fondu, palpite, halo, nappeDouce, houle, scintille, tache, lueurVoilee, etoiles };
  }
});

// atelier/egares_voile.js
var require_egares_voile = __commonJS({
  "atelier/egares_voile.js"(exports, module) {
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var TRAIT = "#3B4763";
    var BRUN = "#3C2819";
    var LUNE = "#E6EEFF";
    function Dessin(pref) {
      let n = 0;
      const defs = [];
      const id = /* @__PURE__ */ __name(() => `${pref}${n++}`, "id");
      const stops = /* @__PURE__ */ __name((list) => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ""}/>`).join(""), "stops");
      return {
        lin(list, x1, y1, x2, y2) {
          const i = id();
          defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${r22(x1)}" y1="${r22(y1)}" x2="${r22(x2)}" y2="${r22(y2)}">${stops(list)}</linearGradient>`);
          return `url(#${i})`;
        },
        rad(list, cx, cy, r, fx = cx, fy = cy) {
          const i = id();
          defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${r22(cx)}" cy="${r22(cy)}" r="${r22(r)}" fx="${r22(fx)}" fy="${r22(fy)}">${stops(list)}</radialGradient>`);
          return `url(#${i})`;
        },
        // découpe : « inner » seulement à l'intérieur de d
        clip(d, inner) {
          const i = id();
          defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`);
          return `<g clip-path="url(#${i})">${inner}</g>`;
        },
        // fondu vers le bas : plein au-dessus de y0, effacé sous y1 (le bas qui s'effiloche)
        fondu(y0, y1, inner, x = -40, w = 80) {
          const g = this.lin([[0, "#FFFFFF"], [1, "#FFFFFF", 0]], 0, y0, 0, y1);
          const i = id();
          defs.push(`<mask id="${i}" maskUnits="userSpaceOnUse" x="${x}" y="-120" width="${w}" height="140"><rect x="${x}" y="-120" width="${w}" height="140" fill="${g}"/></mask>`);
          return `<g mask="url(#${i})">${inner}</g>`;
        },
        def(xml) {
          defs.push(xml);
        },
        id,
        out(body) {
          return `<defs>${defs.join("")}</defs>${body}`;
        }
      };
    }
    __name(Dessin, "Dessin");
    var path = /* @__PURE__ */ __name((d, fill, stroke = "none", w = 0, extra = "") => `<path d="${d}" fill="${fill}"${stroke !== "none" ? ` stroke="${stroke}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"` : ""}${extra}/>`, "path");
    var line = /* @__PURE__ */ __name((d, color, w, a = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` stroke-opacity="${r22(a)}"` : ""}/>`, "line");
    var ell = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}"${extra}/>`, "ell");
    var hash = /* @__PURE__ */ __name((a, b) => {
      const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }, "hash");
    function effile(a, c1, c2, b, w0, w1) {
      const pt = /* @__PURE__ */ __name((t) => {
        const u = 1 - t;
        return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
      }, "pt");
      const N = 12, left = [], right = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N, p = pt(t), q = pt(Math.min(1, t + 0.01)), o = pt(Math.max(0, t - 0.01));
        const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
        left.push([p[0] - dy / l * w, p[1] + dx / l * w]);
        right.push([p[0] + dy / l * w, p[1] - dx / l * w]);
      }
      const pts = [...left, ...right.reverse()];
      return "M" + pts.map(([x, y]) => `${r22(x)},${r22(y)}`).join(" L") + " Z";
    }
    __name(effile, "effile");
    function sol(D, rx) {
      return ell(0, 0.4, rx, rx * 0.22, D.rad([[0, "#141A2C", 0.4], [0.7, "#1C2438", 0.16], [1, "#1C2438", 0]], 0, 0.4, rx));
    }
    __name(sol, "sol");
    function volutes(list, phase = 0) {
      return list.map(([x, y, s, flip], i) => {
        const k = flip ? -s : s, w = 0.45 + 0.2 * Math.sin((phase + i * 0.3) * Math.PI * 2);
        return line(`M${r22(x)},${r22(y)} q${r22(2.2 * k)},${r22(-1.8 * s)} ${r22(4 * k)},${r22(-0.4 * s)} q${r22(1.1 * k)},${r22(1.1 * s)} ${r22(-0.5 * k)},${r22(1.7 * s)} q${r22(-1 * k)},${r22(0.2 * s)} ${r22(-1 * k)},${r22(-0.7 * s)}`, "#B7C4DA", w * s, 0.45);
      }).join("");
    }
    __name(volutes, "volutes");
    function lueur(D, x, y, r = 0.8, couleur = "#E4EEFF") {
      return ell(x, y, r * 3, r * 2.4, D.rad([[0, couleur, 0.4], [1, couleur, 0]], x, y, r * 3)) + ell(x, y, r, r * 0.7, couleur);
    }
    __name(lueur, "lueur");
    var chaud = /* @__PURE__ */ __name((D, x, y, r, a = 0.34) => ell(x, y, r, r, D.rad([[0, "#FFC27A", a], [0.5, "#FFB067", a * 0.3], [1, "#FFB067", 0]], x, y, r)), "chaud");
    var brumeDe = /* @__PURE__ */ __name((D, x0, y0, x1, y1, clair = "#C8D3E6", mi = "#8D9EBF", fond = "#4F5F82") => D.lin([[0, clair], [0.45, mi], [1, fond]], x0, y0, x1, y1), "brumeDe");
    var contreJour = /* @__PURE__ */ __name((d, a = 1) => line(d, LUNE, 2.4, 0.16 * a) + line(d, LUNE, 0.75, 0.8 * a), "contreJour");
    function corps(D, d, fill, top, bottom, inner = "") {
      return D.fondu(bottom - 9, bottom + 0.5, `<g opacity="0.93">${path(d, fill, TRAIT, 0.85)}${D.clip(d, inner)}</g>`);
    }
    __name(corps, "corps");
    var POSES = {
      avant: ["marche1", "marche2", "repos", "bouderie1", "bouderie2", "fuite1", "fuite2", "luciole1", "luciole2", "luciole3", "luciole4", "brume1", "brume2", "brume3"],
      dos: ["marche1", "marche2", "repos", "fuite1", "fuite2"]
    };
    var poseOf = /* @__PURE__ */ __name((pose) => ({ kind: pose.replace(/\d$/, ""), n: +(pose.match(/\d$/) || [0])[0] }), "poseOf");
    function aura(D, cx, cy, rx, ry, a = 1) {
      return ell(cx, cy, rx, ry, D.rad([[0, "#A9BEE4", 0.2 * a], [0.6, "#8FA6D0", 0.08 * a], [1, "#8FA6D0", 0]], cx, cy, Math.max(rx, ry)));
    }
    __name(aura, "aura");
    function poussieres(D, list, a = 1) {
      return list.map(([x, y, r]) => ell(x, y, r * 2.4, r * 2.4, D.rad([[0, "#DCE7FF", 0.55 * a], [1, "#DCE7FF", 0]], x, y, r * 2.4)) + ell(x, y, r * 0.5, r * 0.5, "#F2F6FF", ` opacity="${r22(0.8 * a)}"`)).join("");
    }
    __name(poussieres, "poussieres");
    var etincelle = /* @__PURE__ */ __name((x, y, s = 1, a = 1) => path(`M${r22(x)},${r22(y - 1.8 * s)} L${r22(x + 0.35 * s)},${r22(y - 0.35 * s)} L${r22(x + 1.8 * s)},${r22(y)} L${r22(x + 0.35 * s)},${r22(y + 0.35 * s)} L${r22(x)},${r22(y + 1.8 * s)} L${r22(x - 0.35 * s)},${r22(y + 0.35 * s)} L${r22(x - 1.8 * s)},${r22(y)} L${r22(x - 0.35 * s)},${r22(y - 0.35 * s)} Z`, "#FFF4CF", "none", 0, a < 1 ? ` opacity="${r22(a)}"` : ""), "etincelle");
    var halo = /* @__PURE__ */ __name((D, x, y, r, a = 1) => ell(x, y, r, r, D.rad([[0, "#FFF1C4", 0.85 * a], [0.25, "#FFD88A", 0.55 * a], [0.6, "#FFB65C", 0.18 * a], [1, "#FFB65C", 0]], x, y, r)), "halo");
    function montee(D, n, x0, y0, w) {
      let s = "";
      for (let i = 0; i < 6; i++) {
        const x = x0 + (hash(i, 31) - 0.5) * w, y = y0 - n * 6 - hash(i, 33) * 14 - i * 1.5, k = 0.7 + hash(i, 35) * 0.6;
        s += line(`M${r22(x)},${r22(y)} q${r22(2 * k)},${r22(-2.4 * k)} ${r22(0.6 * k)},${r22(-4.6 * k)} q${r22(-1.2 * k)},${r22(-1.6 * k)} ${r22(0.4 * k)},${r22(-3 * k)}`, "#C3CFE3", 0.8 * k, r22((0.6 - n * 0.12) * (1 - i * 0.08)));
      }
      return s;
    }
    __name(montee, "montee");
    function finir(D, P, c, o) {
      const { kind, n } = P;
      const [ax, ay, arx, ary] = o.aura;
      let s = sol(D, o.sol || 12);
      if (kind === "luciole" && n >= 3) {
        s += aura(D, ax, ay, arx, ary, 0.5) + o.lumiere(n) + poussieres(D, [[ax - 8, ay - 10, 0.9], [ax + 9, ay - 16, 0.7], [ax - 3, ay - 24, 0.6]], n === 3 ? 0.9 : 0.5);
        return D.out(s);
      }
      const pale = kind === "luciole" && n === 2 ? 0.36 : kind === "brume" ? [1, 0.68, 0.34, 0][n] : 1;
      const svA = kind === "brume" ? pale : 1;
      s += aura(D, ax, ay, arx, ary, kind === "brume" ? 1 - n * 0.25 : 1);
      let g = "";
      if (pale > 0) g += pale < 1 ? `<g opacity="${r22(pale)}">${c.b}</g>` : c.b;
      if (svA > 0) {
        if (kind === "luciole") g += halo(D, o.glow[0], o.glow[1], (o.halo || [16, 20])[n === 1 ? 0 : 1], n === 1 ? 0.75 : 1);
        g += svA < 1 ? `<g opacity="${r22(svA)}">${c.sv}</g>` : c.sv;
      }
      if (pale > 0 && c.f) g += pale < 1 ? `<g opacity="${r22(pale)}">${c.f}</g>` : c.f;
      if (kind === "luciole") g += etincelle(o.glow[0] - 5, o.glow[1] - 4, 0.7, 0.9) + etincelle(o.glow[0] + 5, o.glow[1] + 2, 0.55, 0.8) + (n === 2 ? etincelle(o.glow[0] + 1, o.glow[1] - 8, 0.6, 0.85) : "");
      s += `<g transform="${o.t}">${g}</g>`;
      if (kind === "brume") s += (o.montee === false ? "" : montee(D, n, ax, ay + ary * 0.4, arx * 1.4)) + o.voile(n);
      s += poussieres(D, o.motes || [[ax - arx * 0.8, ay - ary * 0.3, 0.7], [ax + arx * 0.75, ay - ary * 0.55, 0.55], [ax - arx * 0.3, ay - ary * 0.95, 0.5]], kind === "brume" ? 1 - n * 0.3 : 0.85);
      return D.out(s);
    }
    __name(finir, "finir");
    var tf = /* @__PURE__ */ __name((bob = 0, lean = 0, flip = false) => `translate(0 ${r22(bob)}) rotate(${r22(lean)} 0 0)${flip ? " scale(-1 1)" : ""}`, "tf");
    var SN_CORPS = "M-2,-56 C4,-57 9.5,-52 11.5,-46.5 C12.3,-44 11.6,-42 10.2,-40.6 C12.6,-38 13.6,-33.5 13.2,-28 C12.8,-21 12.6,-15 13.4,-9 C11.8,-6.6 10,-4.6 8.2,-5.8 C7,-3 4.8,-1.8 3.2,-3.8 C1.8,-1.4 -0.6,-0.6 -2.2,-3 C-4,-1 -7,-1.2 -8,-4 C-10.5,-2 -14.5,-2.6 -16.5,-4.4 C-13.5,-5.4 -12.5,-7.5 -12.4,-10 C-12.6,-18 -12.2,-28 -11,-36 C-10,-45 -7.5,-53 -2,-56 Z";
    var snMain = /* @__PURE__ */ __name((lift) => ({ hx: r22(13.5 + 4.5 * lift), hy: r22(-33 - 11 * lift) }), "snMain");
    function snEtiquette(D, tx, ty, rot, lumiere = 0) {
      const carton = lumiere ? D.lin([[0, "#FFF8E2"], [0.5, "#FFE3A0"], [1, "#FFC069"]], -3, -4.8, 3, 4.6) : D.lin([[0, "#F8ECCE"], [0.6, "#EAD5A6"], [1, "#CDB07A"]], -3, -4.8, 3, 4.6);
      return `<g transform="translate(${r22(tx)} ${r22(ty)}) rotate(${r22(rot)})">` + path("M-3,-3.4 L-1.6,-4.8 L1.6,-4.8 L3,-3.4 L3,4.6 L-3,4.6 Z", carton, BRUN, 0.65) + line("M-2.6,-3.3 L-1.5,-4.4 L1.5,-4.4 L2.6,-3.3", "#FFFFFF", 0.4, 0.6) + (lumiere ? "" : path("M-2.2,-1.4 C-1.4,0.4 -2,2.2 -1,4 L-0.2,4 C-1,2.2 -0.4,0.6 -1,-1.4 Z", "#33476E", "none", 0, ' opacity="0.45"') + line("M0.5,-1.6 C1.4,0.2 0.7,1.8 1.6,3.8", "#2B3A5A", 0.45, 0.45) + line("M-1.6,-2.1 C-0.4,-2.4 0.8,-1.9 1.8,-2.2", "#2B3A5A", 0.42, 0.4)) + ell(0, -3.2, 0.95, 0.95, "#C9A050", ` stroke="${BRUN}" stroke-width="0.4"`) + ell(-0.25, -3.45, 0.3, 0.3, "#FFF0B8") + ell(0, -3.2, 0.36, 0.36, "#4A3218") + "</g>";
    }
    __name(snEtiquette, "snEtiquette");
    function sansNom(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, -4, 1, 0],
        marche1: [-0.8, 3, 0.35, 0.2],
        marche2: [0.3, 4, 0.3, 0.7],
        bouderie1: [0, -9, 0, 0.3],
        bouderie2: [0.2, -5, 0, 0.5],
        fuite1: [-1, 12, 0, 0.1],
        fuite2: [0.4, 15, 0, 0.6],
        luciole1: [-0.5, -1, 0.6, 0.3],
        luciole2: [-1, -1, 0.6, 0.4],
        brume1: [0, -2, 0.4, 0.3],
        brume2: [-1, -2, 0.4, 0.5],
        brume3: [-2, -2, 0.4, 0.7]
      }[pose] || [0, -4, 1, 0];
      const [bob, lean, lift, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += corps(
        D,
        SN_CORPS,
        brumeDe(D, -10, -54, 12, -12),
        -56,
        0,
        ell(dos ? -2 : 10, -20, 10, 24, D.rad([[0, "#121829", 0.55], [1, "#121829", 0]], dos ? -2 : 10, -20, 13)) + ell(-4, -50, 7, 5, D.rad([[0, "#E2EAF7", 0.35], [1, "#E2EAF7", 0]], -4, -50, 7)) + [[-6.5, -44, -8, -6, 0.5], [-2.5, -40, -3.5, -3, 0.45], [2, -38, 1.5, -4, 0.4], [6.5, -35, 7.5, -6, 0.35], [10, -33, 11, -9, 0.3]].map(([x0, y0, x1, y1, a], i) => line(`M${x0},${y0} C${r22(x0 - 1.2)},${r22(y0 + 12)} ${r22(x1 + 1.2)},${r22(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r22(x0 + 0.7)},${y0} C${r22(x0 - 0.5)},${r22(y0 + 12)} ${r22(x1 + 1.9)},${r22(y1 - 12)} ${r22(x1 + 0.7)},${y1}`, LUNE, 0.45, a * (i < 2 ? 0.7 : 0.35))).join("") + (dos ? line("M3,-55 C5,-48 6,-40 5.5,-30", TRAIT, 0.6, 0.55) + line("M3.7,-55 C5.7,-48 6.7,-40 6.2,-30", LUNE, 0.45, 0.35) : line("M-1,-53 C3,-49.5 4.6,-45 4,-40.6", TRAIT, 0.5, 0.45))
      );
      c.b += contreJour("M-2,-56 C-7.5,-53 -10,-45 -11,-36 C-12.2,-28 -12.6,-18 -12.4,-10");
      if (dos) {
        c.sv += line("M12.8,-30 C14.6,-27 14.2,-23 15,-20", "#C23A2C", 0.5) + chaud(D, 13, -26, 7, 0.22);
      } else {
        const creux = "M10.4,-40.8 C6.4,-41 3.6,-43.2 3.6,-47 C3.8,-50.2 6.8,-51.8 9.6,-50.2 C11.2,-47 11.4,-43.4 10.4,-40.8 Z";
        c.b += path(creux, D.rad([[0, "#070A14"], [0.65, "#141A2C"], [1, "#2A3450"]], 7.4, -45.4, 5.2), TRAIT, 0.6);
        c.b += P.kind === "bouderie" && P.n === 2 ? "" : lueur(D, 6.3, -46.4, 0.62) + lueur(D, 8.8, -45.8, 0.58);
        const { hx: hx2, hy: hy2 } = snMain(lift);
        c.b += path(`M9.6,-37.2 C12.4,-38.6 ${r22(hx2 - 3.6)},${r22(hy2 + 3.4)} ${r22(hx2 - 1)},${r22(hy2 - 0.4)} L${r22(hx2 + 1)},${r22(hy2 + 1.6)} C${r22(hx2 - 0.4)},${r22(hy2 + 5)} ${r22(hx2 - 2)},${r22(hy2 + 7.6)} ${r22(hx2 - 3)},${r22(hy2 + 11)} C${r22(hx2 - 4.6)},${r22(hy2 + 8.6)} 13,-31 11.2,-30 Z`, brumeDe(D, 9, -46, 17, -26), TRAIT, 0.8) + line(`M10.4,-36.6 C12.6,-37.4 ${r22(hx2 - 3.4)},${r22(hy2 + 3.6)} ${r22(hx2 - 1.4)},${r22(hy2 + 1)}`, LUNE, 0.55, 0.45);
        const tx = hx2 + 2.6, ty = hy2 - 6;
        c.sv += chaud(D, tx, ty + 2, 16, 0.38) + line("M10.6,-47 C11.5,-44.4 11,-42 10.2,-40.6", "#FFC27A", 0.7, 0.55 * lift);
        c.sv += snEtiquette(D, tx, ty, -16 + 22 * (1 - lift));
        c.sv += line(`M${r22(tx)},${r22(ty - 3.2)} C${r22(tx - 3)},${r22(ty - 0.6)} ${r22(hx2 - 1.4)},${r22(hy2 - 2.6)} ${r22(hx2)},${r22(hy2 - 0.4)}`, "#C23A2C", 0.5);
        for (const [dx, dy, len] of [[-0.6, 0, 5.6], [0.3, 0.6, 5.2], [1, 1, 4]]) c.f += path(effile([hx2 + dx, hy2 + dy], [hx2 + dx + 1.2, hy2 + dy - 1.6], [hx2 + dx + 2, hy2 + dy - len * 0.6], [hx2 + dx + 1.8 + dx, hy2 + dy - len], 1.1, 0.35), "#CBD6E8", TRAIT, 0.45);
        if (P.kind === "bouderie") c.f += path(`M2,-40 C8,-38 ${r22(hx2 + 1)},${r22(hy2 + 2)} ${r22(hx2 + 2)},${r22(hy2 + 7)} C${r22(hx2)},${r22(hy2 + 12)} 8,-22 3,-20 Z`, brumeDe(D, 2, -40, 18, -20, "#C8D3E6", "#93A3C2", "#5E6F92"), TRAIT, 0.75) + line(`M3,-39.2 C8,-37 ${r22(hx2)},${r22(hy2 + 2.4)} ${r22(hx2 + 1.4)},${r22(hy2 + 6.4)}`, LUNE, 0.45, 0.45);
      }
      c.b += volutes([[-15, -3.4, 1.1], [3, -1.5, 0.9, true], [-5, 0.5, 0.8], [9, -3.5, 0.7, true]], phase);
      const { hx, hy } = snMain(lift);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -30, 18, 30],
        sol: 12,
        glow: [hx + 2.6, hy - 5],
        lumiere: /* @__PURE__ */ __name((k) => {
          const { hx: x0, hy: y0 } = snMain(0.6);
          const x = x0 + 2.6, y = y0 - 6 - (k === 4 ? 18 : 0);
          return halo(D, x, y, k === 4 ? 14 : 18) + `<g opacity="${k === 4 ? 0.85 : 1}">${snEtiquette(D, x, y, k === 4 ? 8 : -10, 1)}</g>` + (k === 4 ? [[0, 6, 0.8], [-1.2, 11, 0.6], [0.8, 15, 0.45]].map(([dx, dy, a]) => etincelle(x + dx, y + dy, 0.6, a)).join("") : etincelle(x - 6, y - 5, 0.8) + etincelle(x + 6, y + 3, 0.6));
        }, "lumiere"),
        // les lettres de brume illisibles qui se dispersent
        voile: /* @__PURE__ */ __name((n) => [[-6, -44], [3, -50], [-2, -36], [6, -40], [-9, -30], [1, -26], [8, -32], [-4, -52]].map(([x, y], i) => {
          const dx = x * (0.4 + n * 0.35), dy = y - n * 5 - hash(i, 41) * 4, k = 0.8 + hash(i, 43) * 0.5;
          const glyphe = [`M0,0 q1,-1.6 2,0 t2,0`, `M0,0 l0.8,-2 l0.8,2 m-1.3,-0.8 l1,0`, `M0,-1 c1,-1 2,1 1,1.6 c-0.8,0.4 -1.6,-0.6 -0.6,-1.2`, `M0,0 l1.6,-1.8 m-1.8,0 l2,2`][i % 4];
          return `<g transform="translate(${r22(dx)} ${r22(dy)}) scale(${r22(k)})">` + line(glyphe, "#DCE5F4", 0.5, r22(0.75 - n * 0.18)) + "</g>";
        }).join(""), "voile")
      });
    }
    __name(sansNom, "sansNom");
    var DO_CORPS = "M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4 C-11.6,-2 -9.8,-4.2 -8.2,-1.6 C-6.2,-3.4 -4.2,-0.6 -2.2,-2.6 C-0.2,-0.4 2.4,-2.8 4.4,-0.8 C6.4,-3 8.4,-1.2 10.4,-3.4 C11,-11 11.6,-19 10,-27 C9,-32 7,-35.5 5,-37.5 Z";
    var RUNES = ["M0,-0.7 l0,1.4 m-0.6,-0.7 l1.2,0", "M-0.5,-0.7 l1,0.7 l-1,0.7", "M-0.6,0.6 l0.6,-1.3 l0.6,1.3", "M0,-0.7 a0.6,0.6 0 1,0 0.1,0"];
    function doTablette(D, x, y, rot, signe = 0, lumiere = false) {
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)})">` + path("M-4.6,-5.6 Q-4.8,-6.4 -3.8,-6.4 L3.8,-6.4 Q4.8,-6.4 4.6,-5.6 L4.4,5.4 Q4.4,6.2 3.6,6.2 L-3.6,6.2 Q-4.4,6.2 -4.4,5.4 Z", lumiere ? D.lin([[0, "#FFF2C8"], [0.5, "#FFD27E"], [1, "#F2A04A"]], -4, -6, 4, 6) : D.lin([[0, "#E6A862"], [0.55, "#C47E3C"], [1, "#8E521F"]], -4, -6, 4, 6), BRUN, 0.7) + path("M-3.4,-5 L3.4,-5 L3.3,4.6 L-3.3,4.6 Z", "none", "#7A4418", 0.42, ' stroke-opacity="0.5"') + line("M-3.8,-5.9 L3.6,-5.9", "#FAD49A", 0.5, 0.75) + (lumiere ? "" : ell(-2.6, 3.4, 0.5, 0.3, "#9A5A26", ' opacity="0.5"') + ell(1.8, -2, 0.4, 0.25, "#9A5A26", ' opacity="0.4"')) + (signe ? ell(0, 0, 4, 4, D.rad([[0, "#FFF0B0", 0.7 * signe], [1, "#FFD27A", 0]], 0, 0, 4)) + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#FFF6D0", 0.7, r22(Math.min(1, signe * 1.2))) + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#9A4E14", 0.3, r22(signe * 0.6)) : "") + "</g>";
    }
    __name(doTablette, "doTablette");
    function dormeur(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const dort = P.kind === "dort";
      const prm = {
        repos: [0, 0, 1, 0],
        marche1: [-0.6, 3, 1, 0.2],
        marche2: [0.2, 5, 0.85, 0.7],
        bouderie1: [0, -6, 0.3, 0.3],
        bouderie2: [0.3, -3, 0.2, 0.5],
        fuite1: [-0.8, 11, 0.6, 0.1],
        fuite2: [0.3, 13, 0.5, 0.6],
        luciole1: [0, 0, 0.4, 0.3],
        luciole2: [-0.6, 0, 0.4, 0.4],
        brume1: [0, 0, 0.6, 0.3],
        brume2: [0.4, 0, 0.6, 0.5],
        brume3: [0.8, 0, 0.6, 0.7],
        dort1: [0, 9, 0, 0.2],
        dort2: [0.5, 9.5, 0, 0.5]
      }[pose] || [0, 0, 1, 0];
      const [bob, lean, reach, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += corps(
        D,
        DO_CORPS,
        brumeDe(D, -12, -46, 10, -10, "#C1CBDD", "#8796B5", "#4D5C7D"),
        -46,
        0,
        ell(dos ? -3 : 8, -16, 10, 22, D.rad([[0, "#10172A", 0.55], [1, "#10172A", 0]], dos ? -3 : 8, -16, 13)) + ell(-8, -40, 7, 6, D.rad([[0, "#E0E8F5", 0.3], [1, "#E0E8F5", 0]], -8, -40, 7)) + line("M-13.3,-9 C-6,-7 3,-7.2 10.6,-9.2", "#D9E2F0", 0.45, 0.35) + line("M-13.4,-6.4 C-6,-4.4 3,-4.7 10.5,-6.6", "#D9E2F0", 0.45, 0.28) + [[-11, -7.8], [-7.4, -6.9], [-3, -6.5], [1.2, -6.6], [5.6, -7.2], [8.6, -7.8]].map(([x, yy], i) => line(RUNES[i % 4].replace("M", `M${r22(x)},${r22(yy)} m`), "#D9E2F0", 0.4, [0.4, 0.3, 0.1, 0.35, 0.05, 0.3][i])).join("") + [[-9, -38, -10.5, -6, 0.45], [-4.5, -40, -5.5, -3, 0.4], [1, -38, 0.6, -3, 0.35], [6, -32, 6.8, -5, 0.3]].map(([x0, y0, x1, y1, a]) => line(`M${x0},${y0} C${r22(x0 - 1.5)},${r22(y0 + 12)} ${r22(x1 + 1)},${r22(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r22(x0 + 0.7)},${y0} C${r22(x0 - 0.8)},${r22(y0 + 12)} ${r22(x1 + 1.7)},${r22(y1 - 12)} ${r22(x1 + 0.7)},${y1}`, LUNE, 0.4, a * 0.6)).join("") + (dos ? line("M2,-45 C1,-36 0.6,-24 1,-8", TRAIT, 0.6, 0.5) + line("M2.6,-45 C1.6,-36 1.2,-24 1.6,-8", LUNE, 0.45, 0.35) : "")
      );
      c.b += contreJour("M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4");
      if (!dort) {
        const bx = r22(11 + 5.5 * reach), by = r22(-31 - 4.6 * reach);
        c.b += path(`M5,-36.5 C8.5,-38.6 ${r22(bx - 3)},${r22(by - 2.6)} ${bx},${r22(by - 1.6)} L${r22(bx + 0.3)},${r22(by + 1.6)} C${r22(bx - 3)},${r22(by + 2.4)} 9,-32 7.4,-30 Z`, brumeDe(D, 5, -40, 16, -30, "#C1CBDD", "#8F9DBB", "#5B6A8B"), TRAIT, 0.8);
        c.b += line(`M5.6,-36.6 C8.6,-38 ${r22(bx - 3)},${r22(by - 2.2)} ${r22(bx - 0.4)},${r22(by - 1.3)}`, LUNE, 0.5, 0.45);
        for (const [dx, len, k] of [[0, 5.4, 0], [0.7, 6.2, 1], [1.4, 5, 2]]) c.b += path(effile([bx + dx * 0.5, by - 0.6 + dx * 0.5], [bx + 1.4 + dx * 0.4, by + 0.8], [bx + 1.8 + dx * 0.3, by + len * 0.5], [bx + 1 + dx * 0.6 - k * 0.2, by + len], 1.15, 0.3), "#B4C0D6", TRAIT, 0.45);
      }
      const hood = "M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4 C12.4,-49.6 13.8,-45 12.6,-40.6 C11.8,-37.6 9.6,-36 7.6,-35.8 C6.8,-39.4 4,-41.6 0.4,-41.8 C-1.2,-41.8 -2.6,-42.6 -3.4,-44 Z";
      let tete = path(hood, brumeDe(D, -3, -53, 12, -36, "#C4CEE0", "#8E9CBA", "#55648A"), TRAIT, 0.85) + contreJour("M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4", 0.9);
      if (!dos) {
        const visage = "M7.2,-36.4 C6.4,-39.6 6.8,-43.6 9,-45.6 C11.2,-45.4 12.6,-42.6 12.2,-39.8 C11.8,-37.6 9.8,-36.2 7.2,-36.4 Z";
        tete += path(visage, D.rad([[0, "#A9B4C9"], [0.7, "#7C88A2"], [1, "#56627E"]], 10.8, -41.4, 5.6), TRAIT, 0.6) + D.clip(visage, ell(9.8, -44.4, 4.6, 2.2, D.rad([[0, "#0F1526", 0.55], [1, "#0F1526", 0]], 9.8, -44.4, 4.6))) + line("M9.2,-42.2 C9.9,-41.8 10.8,-41.8 11.6,-42.4", TRAIT, 0.65) + line("M9.5,-41.75 l-0.15,0.55 m0.85,-0.4 l-0.05,0.55 m0.85,-0.55 l0.05,0.5", TRAIT, 0.3, 0.7) + line("M7.6,-38 C8.6,-37.6 9.8,-37.6 10.8,-38.2", "#5A6683", 0.35, 0.5) + line("M10.6,-45.2 l-0.6,1.4 l0.8,0.8 l-0.4,1", "#EEF3FF", 0.35, 0.8);
      } else tete += line("M2,-52 C4,-49 4.6,-44 4,-40", TRAIT, 0.55, 0.5);
      tete += line("M2,-50.6 l1.2,1.6 l-0.5,1.3 l1,1.1", "#EEF3FF", 0.4, 0.75) + line("M-1,-37 l1,1.4 l-0.6,1.2", "#EEF3FF", 0.35, 0.6);
      c.b += dort ? `<g transform="rotate(16 4 -40) translate(1 2)">${tete}</g>` : tete;
      if (!dos) {
        const signe = dort ? P.n === 1 ? 0.8 : 0.15 : P.kind === "luciole" ? 1 : 0;
        const [tx, ty, tr] = dort ? [6.4, -33.4, -24] : [3.4, -27.4, -14];
        c.sv += chaud(D, tx, ty, 14, 0.34) + line("M10.6,-38.4 C11.6,-37.4 12.2,-36.4 12.4,-35", "#FFC27A", 0.55, 0.5);
        c.sv += doTablette(D, tx, ty, tr, signe);
        if (!dort) c.sv += line("M-1.6,-35.4 L8.4,-20.6", BRUN, 1.4) + line("M-1.6,-35.4 L8.4,-20.6", "#D9B26A", 0.75) + line("M-1.2,-35 L1.1,-31.6", "#F6DFA4", 0.35);
        const bras = dort ? [["M-3.6,-31.6 C0,-27.6 4,-26 9.8,-26.4 L10,-23.6 C4,-23 -1,-25.4 -5,-28.4 Z", 9.8, -26.2]] : [["M-3.6,-30.6 C-0.6,-25.8 3.8,-23.2 8.2,-23.8 L8.6,-21 C3.8,-20.2 -1.4,-22.8 -5,-27.4 Z", 8.2, -23.4]];
        for (const [d, fx, fy] of bras) {
          c.f += path(d, brumeDe(D, -4, -38, 12, -20, "#C1CBDD", "#8F9DBB", "#5B6A8B"), TRAIT, 0.8);
          for (const [dx, dy] of [[0, 0], [0.4, 1.3]]) c.f += path(effile([fx + dx, fy + dy], [fx + 1.4 + dx, fy - 1 + dy], [fx + 2 + dx, fy - 2.2 + dy], [fx + 1.6 + dx, fy - 4 + dy], 1.1, 0.35), "#B4C0D6", TRAIT, 0.45);
        }
      }
      c.b += volutes([[-12.5, -2.4, 1.1], [2, -0.6, 0.9, true], [7.5, -1.8, 0.8]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [-1, -26, 18, 26],
        sol: 13,
        glow: [3.4, -27.4],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -30 - (k === 4 ? 18 : 0);
          return halo(D, 1, y, k === 4 ? 13 : 17) + `<g transform="translate(1 ${y}) scale(${k === 4 ? 1.2 : 1.6})">` + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#FFF6D0", 0.9) + "</g>" + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(1 + dx, y + dy, 0.6, a)).join("") : etincelle(-5, y - 5, 0.8) + etincelle(6, y + 3, 0.6) + `<g opacity="0.35">${doTablette(D, 1, -22, -8)}</g>`);
        }, "lumiere"),
        // l'argile qui s'effrite en écailles de brume
        voile: /* @__PURE__ */ __name((n) => [[-8, -30], [-3, -42], [5, -34], [9, -24], [-11, -18], [2, -14]].map(([x, y], i) => {
          const dy = y - n * 6 - hash(i, 51) * 3, dx = x * (1 + n * 0.25);
          return path(`M${r22(dx)},${r22(dy)} l1.2,-0.6 l0.6,1 l-1.2,0.7 Z`, "#9FAEC8", TRAIT, 0.3, ` opacity="${r22(0.8 - n * 0.22)}"`);
        }).join(""), "voile")
      });
    }
    __name(dormeur, "dormeur");
    var NO_CORPS = "M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12 C-8.6,-11 -6.6,-12.2 -5,-11 L4.6,-11 C6.4,-12.2 8.4,-11 9.8,-12.2 C10.4,-18 10.8,-26 9.8,-32 C9,-38 6.8,-41.8 3.4,-43 Z";
    function noBouee(D, cx, cy, rx, ry, lumiere = false) {
      const arc = /* @__PURE__ */ __name((a0, a1, rr = 1, sweep = 1) => `M${r22(cx + Math.cos(a0) * rx * rr)},${r22(cy + Math.sin(a0) * ry * rr)} A${r22(rx * rr)},${r22(ry * rr)} 0 0 ${sweep} ${r22(cx + Math.cos(a1) * rx * rr)},${r22(cy + Math.sin(a1) * ry * rr)}`, "arc");
      let s = "";
      if (lumiere) {
        s += ell(cx, cy, rx, ry, "none", ` stroke="#FFD888" stroke-width="5" stroke-opacity="0.35"`) + ell(cx, cy, rx, ry, "none", ` stroke="#FFF2C6" stroke-width="2.2"`);
        return s;
      }
      for (let i = 0; i < 6; i++) {
        const a0 = i / 6 * Math.PI, a1 = (i + 1) / 6 * Math.PI;
        s += line(arc(a0, a1), BRUN, 3.4) + line(arc(a0, a1), i % 2 ? "#F2EDE2" : "#CF3A2E", 2.5);
      }
      s += line(arc(0.15, Math.PI - 0.15, 1.08), "#FFFFFF", 0.5, 0.6) + line(arc(0.08, Math.PI - 0.08, 0.9), "#5A1A12", 0.4, 0.35);
      const id = D.id();
      D.def(`<path id="${id}" d="${arc(Math.PI * 0.83, Math.PI * 0.2, 1, 0)}"/>`);
      s += `<text font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="1.45" letter-spacing="0.15" fill="#22304E" opacity="0.85"><textPath href="#${id}">L’HIRONDE</textPath></text>`;
      return s;
    }
    __name(noBouee, "noBouee");
    function noye(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, -3, 1, 0, 0],
        marche1: [-0.6, 3, 0, 0.2, 1],
        marche2: [0.2, 4, 0, 0.7, 2],
        bouderie1: [0, -7, 0, 0.3, 0],
        bouderie2: [0.3, -4, 0, 0.5, 0],
        fuite1: [-0.8, 11, 0, 0.1, 1],
        fuite2: [0.3, 13, 0, 0.6, 2],
        luciole1: [0, -1, 0, 0.3, 0],
        luciole2: [-0.6, -1, 0, 0.4, 0],
        brume1: [0.8, 0, 0, 0.3, 0],
        brume2: [2, 0, 0, 0.5, 0],
        brume3: [3, 0, 0, 0.7, 0]
      }[pose] || [0, -3, 0, 0, 0];
      const [bob, lean, look, phase, step] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += [[-14, 0.6], [-11.5, 1.1], [-9, 0.4], [-16.6, 1], [-12.8, -0.2], [-18.4, 0.5]].map(([x, yy], i) => ell(x, yy, 0.5 + 0.25 * (i % 2), 0.28, "#EEF2F8", ` opacity="${r22(0.6 - i * 0.07)}"`)).join("");
      const jambe = /* @__PURE__ */ __name((x, k) => {
        const lift = step && step === 1 === (k === 0) ? 1.6 : 0, fw = step ? k === 0 ? step === 1 ? 1.2 : -1 : step === 1 ? -1 : 1.2 : 0;
        return path(`M${r22(x - 2.2)},-12 L${r22(x + 2.2)},-12 L${r22(x + 2.4 + fw)},${r22(-3 - lift)} C${r22(x + 3.6 + fw)},${r22(-2.4 - lift)} ${r22(x + 3.8 + fw)},${r22(-0.6 - lift)} ${r22(x + 2.4 + fw)},${r22(-0.4 - lift)} L${r22(x - 2.2 + fw)},${r22(-0.4 - lift)} Z`, D.lin([[0, "#7F90B0"], [1, "#4C5B7C"]], 0, -12, 0, 0), TRAIT, 0.75);
      }, "jambe");
      c.b += D.fondu(-6, 0.5, jambe(-4.6, 0) + jambe(3.2, 1));
      c.b += corps(
        D,
        NO_CORPS,
        brumeDe(D, -10, -43, 10, -10, "#C6D2E5", "#8598BA", "#47587C"),
        -43,
        -9,
        ell(dos ? -2 : 7, -24, 9, 16, D.rad([[0, "#0F1628", 0.55], [1, "#0F1628", 0]], dos ? -2 : 7, -24, 11)) + line("M-7.6,-38 C-8.8,-31 -8.8,-22 -8,-13", LUNE, 1.1, 0.5) + line("M-6.9,-36 C-7.9,-30 -7.9,-24 -7.3,-18", "#FFFFFF", 0.45, 0.65) + line("M-2.6,-40 C-3,-32 -3,-22 -2.8,-12", LUNE, 0.55, 0.3) + (dos ? line("M0.4,-42 C0.6,-32 0.6,-22 0.4,-12", TRAIT, 0.6, 0.45) : line("M3,-40 C3.5,-32 3.6,-22 3.3,-12", TRAIT, 0.6, 0.45) + line("M3.7,-39 C4.2,-32 4.3,-24 4,-15", LUNE, 0.42, 0.3) + [-35, -29.5, -24].map((v) => ell(2.4, v, 0.45, 0.45, "#56668A")).join("")) + line("M7,-37 C8,-30 8.4,-22 8.6,-13", TRAIT, 0.5, 0.35)
      );
      c.b += contreJour("M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12");
      c.b += path("M-5.4,-43.6 C-6.2,-46.4 -3.6,-47.8 -0.8,-46.8 L0.8,-43.4 Z", brumeDe(D, -6, -48, 1, -43), TRAIT, 0.7) + path("M6.2,-43.4 C7,-46.2 4.6,-47.6 2,-46.6 L1.4,-43.2 Z", brumeDe(D, 1, -48, 7, -43, "#AEBCD4", "#7D8FB2", "#4C5C80"), TRAIT, 0.7);
      c.b += path("M5.8,-39.6 C9.2,-37 10.8,-31.4 10.6,-25.6 L7.6,-25 C7.8,-30 6.8,-33.6 4.8,-35.6 Z", brumeDe(D, 5, -40, 11, -24, "#C6D2E5", "#8598BA", "#55678C"), TRAIT, 0.8);
      for (const [dx, len] of [[0, 4.4], [0.9, 5], [1.8, 3.8]]) c.b += path(effile([8 + dx * 0.9, -25.2], [8.4 + dx, -23.6], [8.6 + dx * 0.9, -22.6 + len * 0.3], [8.2 + dx * 0.9, -25.2 + len], 1.05, 0.28), "#B6C4DA", TRAIT, 0.42);
      for (const [x, yy, k] of [[9.2, -18.6, 1], [10, -14.6, 0.8], [9, -10.8, 0.65], [9.8, -7, 0.5], [9.2, -3.6, 0.45]]) c.b += path(`M${x},${r22(yy - 1.5 * k)} Q${r22(x + 0.9 * k)},${r22(yy - 0.2 * k)} ${x},${r22(yy + 0.5 * k)} Q${r22(x - 0.9 * k)},${r22(yy - 0.2 * k)} ${x},${r22(yy - 1.5 * k)} Z`, "#D2E4F5", TRAIT, 0.3, ' opacity="0.75"');
      c.sv += chaud(D, 0.6, -20.6, 12, 0.3) + (dos ? noBouee(D, -0.2, -20.6, 9.4, 3.2).replace(/<text[\s\S]*<\/text>/, "") : noBouee(D, -0.2, -20.6, 9.4, 3.2));
      const tx = r22(1 - 2.4 * look);
      let t = "";
      if (!dos) {
        t += path("M-3.2,-47.6 C-3.6,-43.6 -2.4,-40.4 0.8,-39.4 C3.8,-40.2 5,-43.6 4.6,-47.6 Z", D.lin([[0, "#1B2236"], [0.45, "#6E7C9A"], [1, "#A3B0C8"]], 0, -48, 0, -39.4), TRAIT, 0.65);
        if (look < 0.5) t += ell(-0.9, -44.2, 1.5, 1.1, D.rad([[0, "#05080F", 0.85], [1, "#05080F", 0]], -0.9, -44.2, 1.5)) + ell(2.5, -44, 1.4, 1.05, D.rad([[0, "#05080F", 0.85], [1, "#05080F", 0]], 2.5, -44, 1.4)) + lueur(D, -0.8, -44.1, 0.22, "#C8DBF5") + lueur(D, 2.5, -43.9, 0.2, "#C8DBF5");
        else t += ell(-2.4, -44.2, 1.2, 0.9, D.rad([[0, "#05080F", 0.8], [1, "#05080F", 0]], -2.4, -44.2, 1.2)) + lueur(D, -2.5, -44.1, 0.28, "#DCEBFF");
      }
      for (const [x, len, sw, cc] of [[-3.8, 8, -0.8, "#2E4450"], [-2.2, 6, 0.6, "#3C5660"], [4.4, 7, 0.9, "#2E4450"], [5.4, 9, 0.4, "#4B6B5E"]]) t += path(effile([x, -47.6], [x + sw, -45], [x - sw, -43], [x + sw * 0.6, -47.6 + len], 1.1, 0.25), cc, "none", 0, ' opacity="0.9"');
      t += path("M-8.4,-46.6 C-5,-50 6.4,-50.4 10.4,-46 C9,-44.6 6.8,-45.4 5.2,-46.8 L-3.8,-47 C-5.6,-45.6 -7.4,-45.4 -8.4,-46.6 Z", D.lin([[0, "#B6C3DA"], [1, "#62759A"]], 0, -50, 0, -45), TRAIT, 0.8);
      t += path("M-4.2,-47.2 C-4.2,-53 4.8,-53.8 5.2,-47 Z", D.lin([[0, "#CAD5E8"], [1, "#7F92B4"]], 0, -53.6, 0, -47), TRAIT, 0.8);
      t += line("M-3.4,-50 C-2,-52.6 2,-53 3.8,-51.4", LUNE, 0.65, 0.75) + line("M-7.6,-46.8 C-3,-49.4 5,-49.6 9.4,-46.4", LUNE, 0.45, 0.55);
      t += path("M9.8,-46 Q10.4,-44.8 9.9,-44.2 Q9.3,-44.8 9.8,-46 Z", "#D2E4F5", "none", 0, ' opacity="0.8"');
      c.f += `<g transform="translate(${tx} 0)">${t}</g>`;
      c.b += volutes([[-10.5, -2.4, 1.1], [3, -0.6, 0.9, true], [8, -2, 0.8]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -26, 17, 28],
        sol: 11,
        glow: [-0.2, -20.6],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -24 - (k === 4 ? 22 : 0), s = k === 4 ? 0.7 : 1;
          return halo(D, 0, y, k === 4 ? 13 : 18) + noBouee(D, 0, y, 9 * s, 3.2 * s, true) + (k === 4 ? [[0, 5, 0.9], [0.6, 9, 0.7], [-0.4, 13, 0.5], [0.3, 17, 0.35]].map(([dx, dy, a]) => etincelle(dx, y + dy, 0.55, a)).join("") : etincelle(-9, y - 4, 0.8) + etincelle(9, y + 2, 0.6));
        }, "lumiere"),
        // il se fond en eau (une flaque qui s'étale), puis en vapeur
        voile: /* @__PURE__ */ __name((n) => {
          let s = ell(0, 0.2, 6 + n * 4, 1.4 + n * 0.6, D.rad([[0, "#BFD6EE", 0.55], [1, "#BFD6EE", 0]], 0, 0.2, 6 + n * 4));
          s += [[-6, -4], [5, -6], [-2, -9], [3, -2]].map(([x, y], i) => path(`M${x},${r22(y - n * 2 - 1.5)} Q${x + 0.8},${r22(y - n * 2)} ${x},${r22(y - n * 2 + 0.6)} Q${x - 0.8},${r22(y - n * 2)} ${x},${r22(y - n * 2 - 1.5)} Z`, "#D2E4F5", TRAIT, 0.3, ` opacity="${r22(n < 3 ? 0.8 : 0.3)}"`)).join("");
          return s;
        }, "voile")
      });
    }
    __name(noye, "noye");
    var RA_NOEUD = "M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25 C2.2,-28.4 6.6,-27.4 7.4,-23.8 C11,-23.6 12.8,-19.6 11,-16.4 C12.4,-12.6 8.4,-10 4.2,-11.4 C2,-9.2 -3.6,-9.4 -5.4,-11.4 C-9.2,-10.6 -13.2,-12.4 -11.6,-15.4 Z";
    function raBourgeon(D) {
      return chaud(D, 0.5, -28, 12, 0.4) + `<g transform="translate(0 2)">` + path(effile([0, -27.6], [0.3, -29.6], [0.7, -31], [0.4, -32.8], 1.3, 0.8), "#6FA24A", BRUN, 0.4) + path("M0.4,-32.4 C-1.6,-33.6 -1.4,-36.6 0.6,-37.4 C2.4,-36.4 2.4,-33.6 0.4,-32.4 Z", D.lin([[0, "#C2F290"], [1, "#5FA43C"]], -1, -37, 2, -33), BRUN, 0.55) + line("M0.5,-33 C0.3,-34.4 0.5,-35.8 0.7,-36.8", "#E4FFC8", 0.3, 0.7) + path("M0.6,-32.6 C2.6,-33 4.4,-31.8 4.6,-30.6 C3,-30.2 1.6,-31 0.6,-32.6 Z", D.lin([[0, "#A6E07F"], [1, "#4E8C32"]], 1, -33, 4.6, -30.6), BRUN, 0.45) + ell(-1.9, -29.7, 1.45, 1.45, D.rad([[0, "#FF8576"], [0.6, "#D8312A"], [1, "#961C18"]], -2.3, -30.1, 1.7), ` stroke="${BRUN}" stroke-width="0.45"`) + ell(-2.3, -30.2, 0.42, 0.3, "#FFFFFF", ' opacity="0.85"') + line("M-1.6,-28.3 L-0.3,-27.9", BRUN, 0.4) + "</g>";
    }
    __name(raBourgeon, "raBourgeon");
    function racine(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const terre = P.kind === "terre" ? P.n : 0;
      const prm = {
        repos: [0, 0, 0, 0],
        marche1: [-0.5, 1, 1, 0.2],
        marche2: [0, 2, -1, 0.7],
        bouderie1: [0, 0, -4, 0.3],
        bouderie2: [0.2, 0, -2, 0.5],
        fuite1: [-0.6, 1, 6, 0.1],
        fuite2: [0, 2, 7, 0.6],
        luciole1: [0, 0, 0, 0.3],
        luciole2: [-0.4, 0, 0, 0.4],
        brume1: [0.6, 0, 0, 0.3],
        brume2: [1.2, 0, 0, 0.5],
        brume3: [1.8, 0, 0, 0.7]
      }[pose] || [0, 0, 0, 0];
      const [bob, step, lean, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += D.fondu(-55, -20, path("M-5.5,-21 C-6.2,-34 -5.2,-46 -3.6,-56 L4,-56 C5.4,-46 6.4,-34 5.6,-21 Z", D.lin([[0, "#AFC0DA", 0], [0.5, "#AFC0DA", 0.12], [1, "#AFC0DA", 0.22]], 0, -56, 0, -21)));
      c.b += line("M-5.5,-23 C-6.2,-34 -5.2,-46 -3.6,-55", LUNE, 0.45, 0.2) + line("M5.6,-23 C6.4,-34 5.4,-46 4,-55", LUNE, 0.45, 0.12);
      const pattes = [[-17, -1.4, -8, -16, 0], [16, -0.6, 8, -15.6, 1], [-11.5, 0.6, -5.4, -13.6, 1], [11, 1, 5.2, -13.2, 0], [-5, 1.6, -2.4, -12, 0], [4.6, 1.8, 2.6, -11.8, 1]];
      pattes.forEach(([x, yy, ax, ay, ph], i) => {
        const up = step && (i + ph + (step > 1 ? 1 : 0)) % 2 === 0 ? 2.4 : 0, fw = up ? 1.6 * Math.sign(x) * 0.4 + 1.2 : 0;
        const bx = x + fw, by = yy - up, dir = x > 0 ? 1 : -1;
        c.b += path(effile([ax, ay], [ax + dir * 5.5, ay - 9 + hash(i, 1) * 2], [bx - dir * (1 + hash(i, 2) * 1.5), by - 13], [bx, by], i < 2 ? 3.2 : 3.7, 0.3), i < 2 ? "#6E7FA0" : "#8796B4", TRAIT, 0.7);
        const kx = ax + (bx - ax) * 0.55, ky = ay - 7.4 + hash(i, 3);
        c.b += ell(kx, ky, 1.1, 0.8, i < 2 ? "#7486A6" : "#93A2BF", ` stroke="${TRAIT}" stroke-width="0.4"`);
        c.b += line(`M${r22(ax)},${r22(ay - 0.8)} C${r22(ax + dir * 4)},${r22(ay - 8.6)} ${r22(kx - dir * 1)},${r22(ky - 1.4)} ${r22(kx + dir * 0.6)},${r22(ky - 0.9)}`, LUNE, 0.4, i % 2 ? 0.25 : 0.45);
      });
      c.b += path(RA_NOEUD, D.lin([[0, "#B8C5DA"], [0.45, "#8494B2"], [1, "#4C5B7C"]], -10, -28, 9, -10), TRAIT, 0.85);
      c.b += D.clip(RA_NOEUD, [[-9, -24, -7, -12], [-4.4, -27.4, -2.6, -11], [1.6, -27.6, 2.6, -11.6], [6.2, -25, 7.4, -13]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r22(x0 + 1.8)},${r22((y0 + y1) / 2)} ${r22(x1 - 1.6)},${r22((y0 + y1) / 2 + 2)} ${x1},${y1}`, TRAIT, 0.55, 0.5) + line(`M${r22(x0 - 0.6)},${y0} C${r22(x0 + 1.2)},${r22((y0 + y1) / 2)} ${r22(x1 - 2.2)},${r22((y0 + y1) / 2 + 2)} ${r22(x1 - 0.6)},${y1}`, LUNE, 0.35, 0.3)).join("") + ell(dos ? -4 : 6, -13, 8, 7, D.rad([[0, "#0E1426", 0.55], [1, "#0E1426", 0]], dos ? -4 : 6, -13, 8)));
      c.b += contreJour("M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25");
      for (let i = 0; i < 11; i++) c.b += ell(-7.6 + i * 1.35 + hash(i, 1) * 0.6, -23.6 - Math.sin(i / 10 * Math.PI) * 2 + hash(i, 2) * 0.7, 0.8 + hash(i, 4) * 0.3, 0.55, i % 3 ? "#D2DCEA" : "#E8EEF7", ' opacity="0.9"');
      if (!dos) {
        c.b += path("M-1.8,-17 C-2,-19.6 2,-20.6 3.6,-18.6 C4.4,-16.6 2.4,-15 0.6,-15.2 C-0.8,-15.4 -1.8,-16 -1.8,-17 Z", D.rad([[0, "#05080F"], [1, "#1E2740"]], 0.8, -17.6, 3.4), TRAIT, 0.6);
        if (!(P.kind === "bouderie" && P.n === 2)) c.b += lueur(D, 0, -17.6, 0.36, "#D8E6FF") + lueur(D, 2, -17.4, 0.34, "#D8E6FF");
      }
      for (const [x, yy, k] of [[-10.4, -14.4, 1], [-11.6, -12, 0.7], [9.2, -11.8, 0.85]]) {
        c.b += ell(x, yy, 3.6 * k, 3.2 * k, D.rad([[0, "#BFF3FF", 0.42], [1, "#BFF3FF", 0]], x, yy, 3.6 * k));
        c.b += line(`M${x},${yy} l0,${r22(1.6 * k)}`, "#DDE6F2", 0.65 * k) + path(`M${r22(x - 1.6 * k)},${r22(yy + 0.2)} Q${x},${r22(yy - 1.9 * k)} ${r22(x + 1.6 * k)},${r22(yy + 0.2)} Z`, "#EAF6FB", TRAIT, 0.4) + ell(x - 0.4 * k, yy - 0.7 * k, 0.5 * k, 0.25 * k, "#FFFFFF", ' opacity="0.8"');
      }
      c.sv += raBourgeon(D);
      c.b += volutes([[-15.5, -1.2, 0.8], [14.5, -0.4, 0.8, true], [-3, 1.8, 0.7], [6, 1.4, 0.6, true]], phase);
      const fleur = /* @__PURE__ */ __name((k, y) => {
        let s = halo(D, 0.5, y, k === 4 ? 12 : 16);
        for (let i = 0; i < 5; i++) {
          const a = i / 5 * Math.PI * 2 - Math.PI / 2;
          s += `<g transform="translate(0.5 ${r22(y)}) rotate(${r22(a * 180 / Math.PI + 90)})">` + path("M0,0 C-1.6,-1.6 -1.4,-4.2 0,-4.8 C1.4,-4.2 1.6,-1.6 0,0 Z", "#FFF3CC", "#F2B860", 0.35, ' opacity="0.95"') + "</g>";
        }
        return s + ell(0.5, y, 1.1, 1.1, "#FFD27A");
      }, "fleur");
      if (terre) {
        const down = [0, 8, 18, 30][terre];
        const motte = `M-15,1 C-11,${r22(-2 - terre)} -6,${r22(-3.4 - terre * 1.2)} 0,${r22(-3.6 - terre * 1.2)} C6,${r22(-3.4 - terre * 1.2)} 11,${r22(-2 - terre)} 15,1 Z`;
        let s = sol(D, 14) + aura(D, 0, -16 + down * 0.6, 16, 14, 1 - terre * 0.25);
        const vu = D.clip("M-30,-80 L30,-80 L30,0.6 L-30,0.6 Z", `<g transform="translate(0 ${down})">${c.b}${c.sv}</g>`);
        s += vu;
        if (terre === 3) s += `<g transform="translate(0 21)">${raBourgeon(D)}</g>`;
        s += path(motte, D.lin([[0, "#6E6A6E"], [1, "#3E3B42"]], 0, -6, 0, 1), TRAIT, 0.7);
        s += [[-10, -1.6], [-5, -3], [2, -3.6], [7, -2.6], [12, -1]].map(([x, y], i) => ell(x, y - terre * 0.6, 1 + hash(i, 61) * 0.6, 0.7, "#5A5660", ` stroke="${TRAIT}" stroke-width="0.35"`)).join("");
        s += [[-8, -6], [6, -7], [-2, -9]].map(([x, y], i) => ell(x + (hash(i, 63) - 0.5) * 3, y - terre * 1.5, 0.7, 0.5, "#6A6670", ` opacity="${r22(0.9 - terre * 0.2)}"`)).join("");
        s += line(`M-14,0 C-10,${r22(-2.2 - terre)} -5,${r22(-3.4 - terre * 1.2)} 0,${r22(-3.6 - terre * 1.2)}`, LUNE, 0.45, 0.35);
        return D.out(s);
      }
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -18, 19, 20],
        sol: 15,
        glow: [0, -29],
        motes: [[-14, -22, 0.6], [13, -26, 0.5], [-4, -40, 0.55]],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -24 - (k === 4 ? 20 : 0);
          return (k === 3 ? `<g opacity="0.3">${raBourgeon(D)}</g>` : "") + fleur(k, y) + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.5 + dx, y + dy, 0.55, a)).join("") : etincelle(-6, y - 4, 0.8) + etincelle(7, y + 2, 0.6));
        }, "lumiere"),
        // la mousse qui tombe en flocons de brume
        voile: /* @__PURE__ */ __name((n) => [[-8, -24], [-3, -27], [3, -27], [8, -24], [-12, -14], [11, -12]].map(([x, y], i) => ell(x * (1 + n * 0.2), y - n * 5 - hash(i, 71) * 3, 0.8, 0.55, "#D2DCEA", ` opacity="${r22(0.85 - n * 0.22)}"`)).join(""), "voile")
      });
    }
    __name(racine, "racine");
    var ES_CORPS = "M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3 C-7,-1.2 -4,-2.8 -1,-0.8 C2,-2.8 5,-1 8,-3 C9.6,-13 10.8,-26 10.2,-38 C9.8,-48 7.6,-56 2.6,-58 Z";
    var feuille = /* @__PURE__ */ __name((k, fill, extra = "") => path(`M0,${r22(-k * 1.45)} C${r22(k * 1.05)},${r22(-k * 0.5)} ${r22(k * 0.85)},${r22(k * 0.9)} 0,${r22(k * 1.5)} C${r22(-k * 0.85)},${r22(k * 0.9)} ${r22(-k * 1.05)},${r22(-k * 0.5)} 0,${r22(-k * 1.45)} Z`, fill, TRAIT, 0.4, extra) + line(`M0,${r22(-k * 1.25)} L0,${r22(k * 1.3)}`, TRAIT, 0.3, 0.55) + line(`M0,${r22(-k * 0.2)} l${r22(k * 0.5)},${r22(-k * 0.4)} M0,${r22(k * 0.5)} l${r22(-k * 0.5)},${r22(-k * 0.4)}`, TRAIT, 0.25, 0.45), "feuille");
    var ES_FEUILLES = (() => {
      const out = [];
      for (let i = 0; out.length < 34 && i < 400; i++) {
        const fx = -10 + hash(i, 3) * 20, fy = -56 + hash(i, 5) * 54;
        if (Math.abs(fx) > 9.6 - (fy < -48 ? 3 : 0)) continue;
        if (out.some(([x, yy]) => Math.hypot(x - fx, yy - fy) < 3.6)) continue;
        out.push([fx, fy, -50 + hash(i, 7) * 100, 2.1 + hash(i, 9) * 1.3]);
      }
      return out.sort((a, b) => a[1] - b[1]);
    })();
    var esMasque = /* @__PURE__ */ __name((D, a = 1) => {
      const m = "M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z";
      return path(m, D.lin([[0, "#E6EAF0"], [0.55, "#C3CAD7"], [1, "#949DB1"]], -4, -66, 5, -51), TRAIT, 0.85, a < 1 ? ` opacity="${r22(a)}"` : "") + D.clip(m, [[-3, -63, -2.4, -54], [2.6, -64, 3.2, -53.5], [-0.2, -65.4, 0.4, -61], [0.6, -55, 0.2, -51.4]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r22(x0 + 0.8)},${r22((y0 + y1) / 2)} ${r22(x1 - 0.6)},${r22((y0 + y1) / 2 + 1)} ${x1},${y1}`, "#7E879B", 0.4, 0.6)).join("") + ell(4.6, -57, 4, 8, D.rad([[0, "#2A3247", 0.35], [1, "#2A3247", 0]], 4.6, -57, 6))) + line("M-5,-63.6 C-5.4,-58 -4,-53 0.2,-50.6", LUNE, 0.6, 0.6 * a);
    }, "esMasque");
    function esGraine(D, pouls, y = -38) {
      return chaud(D, 0.3, y, 10 + 6 * pouls, 0.26 + 0.2 * pouls) + ell(0.3, y, 2 + 0.3 * pouls, 2.5 + 0.3 * pouls, D.rad([[0, "#FFE9AE"], [0.45, "#F4A33C"], [1, "#A85A16"]], -0.2, y - 0.8, 2.9), ` stroke="${BRUN}" stroke-width="0.5"`) + ell(-0.4, y - 1, 0.55, 0.8, "#FFF6D8", ' opacity="0.85"');
    }
    __name(esGraine, "esGraine");
    function esprit(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, 0, 0, 0.6, 0],
        marche1: [-0.7, 2, 0, 0.3, 0.2],
        marche2: [0.2, 3, 0, 0.9, 0.7],
        bouderie1: [0, -3, 1, 0.4, 0.3],
        bouderie2: [0.2, -4, 0.6, 0.3, 0.5],
        fuite1: [-1, 9, 0, 0.9, 0.1],
        fuite2: [0.3, 11, 0, 1, 0.6],
        luciole1: [0, 0, 0.3, 1, 0.3],
        luciole2: [-0.6, 0, 0.3, 1, 0.4],
        brume1: [0, 0, 0, 0.5, 0.3],
        brume2: [0, 0, 0, 0.4, 0.5],
        brume3: [0, 0, 0, 0.3, 0.7]
      }[pose] || [0, 0, 0, 0.6, 0];
      const [bob, lean, bow, pouls, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      const sway = P.kind === "marche" || P.kind === "fuite" ? P.n === 1 ? 1.4 : -1 : 0;
      c.b += D.fondu(-14, 0, path(`M-5,-24 C-11,-16 ${r22(-17 + sway)},-8 ${r22(-24 + sway * 1.6)},-2.4 C-17,-0.8 -10,-1.2 -4,-2.2 Z`, D.lin([[0, "#7D8EAF", 0.75], [1, "#7D8EAF", 0.05]], -4, 0, -24, 0), "none"));
      for (let i = 0; i < 9; i++) {
        const x = -8 - i * 1.9 - hash(i, 11) * 1.5 + sway * (i / 9), yy = -2.2 - hash(i, 13) * 3 - Math.max(0, 6 - i) * 0.6, k = 1.6 + hash(i, 15) * 0.8;
        c.b += `<g transform="translate(${r22(x)} ${r22(yy)}) rotate(${r22(hash(i, 17) * 180)})" opacity="${r22(0.75 - i * 0.07)}">` + feuille(k, ["#8C9DBE", "#7486A8", "#A3B2CC"][i % 3]) + "</g>";
      }
      c.b += corps(
        D,
        ES_CORPS,
        brumeDe(D, -10, -58, 10, -10, "#BBC8DE", "#8394B5", "#48587C"),
        -58,
        0,
        ES_FEUILLES.map(([fx, fy, a, k], i) => `<g transform="translate(${r22(fx)} ${r22(fy)}) rotate(${r22(a + (dos ? 30 : 0))})">` + feuille(k, ["#A1B0CC", "#8B9CBD", "#B4C1D8", "#7A8BAD", "#95A5C4"][i % 5]) + line(`M${r22(-k * 0.6)},${r22(-k * 0.6)} C${r22(-k * 0.3)},${r22(-k * 1.1)} 0,${r22(-k * 1.3)} 0,${r22(-k * 1.3)}`, LUNE, 0.3, 0.45) + "</g>").join("") + ell(dos ? -2 : 7, -24, 9, 26, D.rad([[0, "#0E1528", 0.55], [1, "#0E1528", 0]], dos ? -2 : 7, -24, 12))
      );
      c.b += contreJour("M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3");
      for (const [x0, y0, flip] of [[-8.6, -47, -1], [8.4, -47, 1]]) {
        const x1 = x0 + flip * 3.4 + (P.kind === "fuite" ? -flip * 2 : 0), y1 = y0 + 19;
        c.b += path(effile([x0, y0], [x0 + flip * 2.8, y0 + 6], [x1 - flip * 0.4, y1 - 7], [x1, y1], 1.9, 0.9), "#7B8BAA", TRAIT, 0.55);
        for (const [dx, dy] of [[-1.2, 4.6], [0.3, 5.6], [1.6, 4.2]]) c.b += path(effile([x1, y1], [x1 + flip * dx * 0.3, y1 + dy * 0.4], [x1 + flip * dx * 0.8, y1 + dy * 0.7], [x1 + flip * dx, y1 + dy], 0.8, 0.15), "#7B8BAA", TRAIT, 0.35);
      }
      if (dos) c.sv += chaud(D, 0.3, -38, 8 + 4 * pouls, 0.16 + 0.12 * pouls);
      else c.sv += ell(0.3, -38, 3.6, 3.4, D.rad([[0, "#120A06", 0.8], [1, "#26304A", 0.15]], 0.3, -38, 3.6)) + esGraine(D, pouls);
      let t = "";
      const bois = /* @__PURE__ */ __name((k) => {
        const tige = effile([1 + 2.4 * k, -63], [1 + 5 * k, -68], [1 + 6.4 * k, -73], [1 + 10.4 * k, -77.4], 1.6, 0.35);
        const branches = [effile([1 + 5 * k, -68.4], [1 + 6.6 * k, -69.4], [1 + 8.6 * k, -71], [1 + 10 * k, -73.4], 1, 0.25), effile([1 + 7 * k, -73.6], [1 + 6.8 * k, -75.4], [1 + 7.2 * k, -77], [1 + 7.6 * k, -79], 0.9, 0.2), effile([1 + 3.6 * k, -66], [1 + 2.8 * k, -68], [1 + 2.8 * k, -70], [1 + 3 * k, -71.4], 0.9, 0.2)];
        return [tige, ...branches].map((d) => path(d, "#8696B3", TRAIT, 0.45)).join("") + line(`M${r22(1 + 2.4 * k)},-63.4 C${r22(1 + 5 * k)},-68.4 ${r22(1 + 6.4 * k)},-73.4 ${r22(1 + 10 * k)},-77.2`, LUNE, 0.35, k < 0 ? 0.6 : 0.3);
      }, "bois");
      t += bois(-1) + bois(1);
      t += line("M7.4,-72.6 q0.5,2 -0.1,3.6", "#5C6680", 0.4);
      t += [[-0.8, 0, 0.9], [0.8, 0.2, 0.85], [0, 1, 0.95], [-0.3, -0.8, 0.8], [0.9, 0.9, 0.7]].map(([dx, dy, k]) => ell(7.2 + dx, -68.6 + dy, 0.95 * k, 0.6 * k, "#AE9FB6", ` stroke="${TRAIT}" stroke-width="0.25" opacity="0.85"`)).join("") + ell(7.2, -68.5, 0.45, 0.45, "#8C7F6C");
      const detourne = P.kind === "bouderie" && P.n === 2;
      if (dos || detourne) {
        t += path("M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z", brumeDe(D, -5, -66, 6, -50, "#AEBBD3", "#7F90B1", "#4E5E82"), TRAIT, 0.8) + [[-2, -61, 30], [2.4, -59, -40], [0, -55, 10]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) rotate(${a})">` + feuille(2, ["#94A4C2", "#8798B9", "#A5B3CD"][i]) + "</g>").join("");
        if (detourne) t += `<g transform="translate(9 -2) rotate(28 0 -57)">${esMasque(D, 0.85)}</g>`;
      } else {
        t += esMasque(D);
        t += path("M-3,-60.4 C-2.6,-61.6 -0.8,-61.6 -0.6,-60 C-0.8,-58.4 -2.6,-58.4 -3,-60.4 Z", "#0C111E") + path("M1.9,-60.2 C2.3,-61.4 4,-61.4 4.2,-59.8 C4,-58.2 2.3,-58.2 1.9,-60.2 Z", "#0C111E");
        t += lueur(D, -1.8, -59.7, 0.5, "#CFF7DA") + lueur(D, 3.05, -59.5, 0.48, "#CFF7DA");
        t += ell(0.4, -52.6, 6, 4, D.rad([[0, "#FFC27A", 0.22 + 0.16 * pouls], [1, "#FFC27A", 0]], 0.4, -51, 6));
      }
      c.f += `<g transform="rotate(${r22(bow * 14)} 0 -52)">${t}</g>`;
      c.b += volutes([[-8.5, -2, 1.1], [2, -0.4, 0.9, true], [7, -2, 0.9]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean),
        aura: [-2, -36, 18, 40],
        sol: 14,
        glow: [0.3, -38],
        motes: [[-15, -40, 0.7], [13, -50, 0.55], [-6, -72, 0.5]],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -38 - (k === 4 ? 22 : 0);
          return (k === 3 ? `<g transform="translate(-8 14) rotate(-24 0 -57)">${esMasque(D, 0.55)}</g>` : "") + halo(D, 0.3, y, k === 4 ? 13 : 18) + esGraine(D, 1, y) + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.3 + dx, y + dy, 0.55, a)).join("") : etincelle(-6, y - 5, 0.8) + etincelle(7, y + 3, 0.6));
        }, "lumiere"),
        // il s'effeuille : les feuilles s'envolent et se dispersent
        voile: /* @__PURE__ */ __name((n) => ES_FEUILLES.filter((_, i) => i % 3 === 0).map(([fx, fy, a, k], i) => {
          const dx = fx * (1 + n * 0.5) + (hash(i, 81) - 0.5) * n * 6, dy = fy - n * 4 - hash(i, 83) * n * 3;
          return `<g transform="translate(${r22(dx)} ${r22(dy)}) rotate(${r22(a + n * 60)})" opacity="${r22(0.85 - n * 0.2)}">` + feuille(k * 0.9, ["#A1B0CC", "#8B9CBD", "#B4C1D8"][i % 3]) + "</g>";
        }).join(""), "voile")
      });
    }
    __name(esprit, "esprit");
    var EGARES_VOILE = [
      ["fantome", "Le Sans-Nom", sansNom, []],
      ["zombie", "Le Dormeur", dormeur, ["dort1", "dort2"]],
      ["noye-de-l-hirondelle", "Le Noyé de l'Hirondelle", noye, [], "noye"],
      ["racine-errante", "La Racine errante", racine, ["terre1", "terre2", "terre3"], "racine"],
      ["esprit-sylvestre", "L'Esprit sylvestre revenant", esprit, [], "esprit"]
    ];
    module.exports = { POSES, EGARES_VOILE, sansNom, dormeur, noye, racine, esprit, effile, TRAIT, BRUN, LUNE, Dessin, path, line, ell, hash, sol, volutes, lueur, chaud, brumeDe, contreJour, poseOf, finir, tf, halo, etincelle };
  }
});

// atelier/carte_embarquement.js
var require_carte_embarquement = __commonJS({
  "atelier/carte_embarquement.js"(exports, module) {
    var { OUT, P, E, clip, r2: r22 } = require_troupe2();
    var W2 = 1.4;
    var MARINE = { corps: "#2E4E8C", ombre: "#22396A", clair: "#4E72B4" };
    var PAPIER = { corps: "#F8F0DC", ombre: "#EADBB8", fibre: "#D9C8A2", encre: "#6B5A48" };
    var OR = { clair: "#FFE596", corps: "#E8B84A", ombre: "#B8862A" };
    var ROUGE = "#C8463A";
    var ENCRE = "#2E4E8C";
    var DECHIRE = " L313,170 Q309.6,171.6 311.4,175.4 L307.8,178.6 Q305.2,182 307.4,185.6 L302.6,188 Q299.2,190.6 300.8,194.8 L295.6,196.4 Q291.4,198.6 292.4,202 L286,203 L282,204";
    var ZONES = { photo: [29, 80, 58, 70, -4], nom: [104, 88, 128, 13] };
    var texte = /* @__PURE__ */ __name((x, y, t, size, col, extra = "", ancre = "start") => `<text x="${r22(x)}" y="${r22(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="${col}" text-anchor="${ancre}" ${extra}>${t}</text>`, "texte");
    var trait = /* @__PURE__ */ __name((d, color, w, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`, "trait");
    var hasard = /* @__PURE__ */ __name((graine) => () => (graine = graine * 16807 % 2147483647) / 2147483647, "hasard");
    function papierD(dechire) {
      const bord = /* @__PURE__ */ __name((x0, y0, x1, y1, n, amp, h2) => {
        let d2 = "";
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          d2 += ` L${r22(x0 + (x1 - x0) * t + (y1 !== y0 ? (h2() - 0.5) * amp : 0))},${r22(y0 + (y1 - y0) * t + (x1 !== x0 ? (h2() - 0.5) * amp : 0))}`;
        }
        return d2;
      }, "bord");
      const h = hasard(11);
      let d = "M12,6" + bord(12, 6, 308, 6, 14, 0.9, h) + " Q314,6 314,12";
      if (dechire) d += bord(314, 12, 314, 166, 10, 0.9, h) + DECHIRE;
      else d += bord(314, 12, 314, 198, 12, 0.9, h) + " Q314,204 308,204";
      d += bord(dechire ? 282 : 308, 204, 12, 204, 14, 0.9, h) + " Q6,204 6,198" + bord(6, 198, 6, 12, 12, 0.9, h) + " Q6,6 12,6 Z";
      return d;
    }
    __name(papierD, "papierD");
    function hirondelle(x, y, s, col, ventre) {
      const corps = "M10,0 C8,-1.7 5,-2 2.6,-1.1 L-7,-9.4 C-5.4,-5.4 -3.4,-2.4 -1.2,-0.7 L-12,-1.4 L-4.6,0.9 L-12,4.6 L-2.4,2.2 L-7.4,8.6 C-3.4,4.8 -0.6,2.6 2,2 C5,2.4 8,1.6 10,0 Z";
      return `<g transform="translate(${r22(x)} ${r22(y)}) scale(${s})"><path d="${corps}" fill="${col}"/>` + (ventre ? `<path d="M9,0.6 C6,1.6 3.4,1.8 1.6,1.4 C3.6,2.4 6.6,2.2 9,0.6 Z" fill="${ventre}"/><circle cx="6.4" cy="-0.5" r="0.55" fill="${ventre === "#FFFFFF" ? MARINE.corps : "#FFFFFF"}"/>` : "") + "</g>";
    }
    __name(hirondelle, "hirondelle");
    function ecusson(x, y) {
      const D = `M${x - 12},${y - 15} L${x + 12},${y - 15} L${x + 12},${y + 2} Q${x + 12},${y + 12} ${x},${y + 18} Q${x - 12},${y + 12} ${x - 12},${y + 2} Z`;
      const d2 = `M${x - 9.4},${y - 12.4} L${x + 9.4},${y - 12.4} L${x + 9.4},${y + 1.6} Q${x + 9.4},${y + 10} ${x},${y + 15} Q${x - 9.4},${y + 10} ${x - 9.4},${y + 1.6} Z`;
      return P(D, OR.corps, W2) + P(d2, MARINE.clair, 0.8) + clip("ceb", d2, `<rect x="${x}" y="${y - 14}" width="12" height="32" fill="${MARINE.corps}" opacity=".5"/>`) + hirondelle(x - 1, y + 1, 0.82, "#FFFFFF", "#FFFFFF") + trait(`M${x - 8},${y - 13.4} L${x + 3},${y - 13.4}`, OR.clair, 0.9);
    }
    __name(ecusson, "ecusson");
    function champ(x, y, w, libelle, valeur) {
      return texte(x, y, libelle, 5.6, PAPIER.encre, 'letter-spacing="0.6"') + trait(`M${x},${r22(y + 9)} L${r22(x + w)},${r22(y + 9)}`, "#A8987C", 0.6) + (valeur ? texte(x + 1, y + 7.6, valeur, 8, ENCRE, 'font-style="italic"') : "");
    }
    __name(champ, "champ");
    function carte(etat = "neuve") {
      const trempee = etat === "trempee", id = `ce${etat[0]}`;
      const D = papierD(trempee);
      const h = hasard(7);
      let s = `<path d="${D}" fill="rgba(30,20,10,.28)" transform="translate(2.4 3.2)"/>` + P(D, PAPIER.corps, 0);
      let grain = "";
      for (let i = 0; i < 260; i++) grain += `<circle cx="${r22(h() * 320)}" cy="${r22(h() * 210)}" r="${r22(0.25 + h() * 0.45)}" fill="${h() > 0.5 ? PAPIER.fibre : "#FFFFFF"}" opacity="${r22(0.25 + h() * 0.35)}"/>`;
      for (let i = 0; i < 26; i++) {
        const x2 = h() * 300 + 10, y = h() * 190 + 10;
        grain += trait(`M${r22(x2)},${r22(y)} q${r22(3 + h() * 5)},${r22((h() - 0.5) * 2)} ${r22(8 + h() * 8)},${r22((h() - 0.5) * 1.4)}`, PAPIER.fibre, 0.35, 'opacity=".55"');
      }
      s += clip(`${id}p`, D, `<rect x="0" y="150" width="320" height="60" fill="${PAPIER.ombre}" opacity=".45"/>` + grain + `<g opacity=".07">${hirondelle(186, 128, 5.2, MARINE.corps)}</g><rect x="0" y="0" width="320" height="46" fill="${MARINE.corps}"/><rect x="0" y="38" width="320" height="8" fill="${MARINE.ombre}"/>` + trait("M0,46.4 L320,46.4", OR.corps, 1.4) + trait("M0,41 Q6,38.6 12,41 T24,41 T36,41 T48,41 T60,41 T72,41 T84,41 T96,41 T108,41 T120,41 T132,41 T144,41 T156,41 T168,41 T180,41 T192,41 T204,41 T216,41 T228,41 T240,41 T252,41 T264,41 T276,41 T288,41 T300,41 T312,41 T324,41", "#7E9CD0", 0.7) + `<rect x="243" y="47" width="80" height="170" fill="${PAPIER.ombre}" opacity=".5"/>` + (trempee ? taches() : "")) + P(D, "none", W2);
      s += ecusson(30, 25);
      s += texte(50, 25, "L’HIRONDELLE", 15, "#F6EFDC", 'font-weight="bold" letter-spacing="1.6"') + texte(51, 35.4, "Compagnie des Îles de la Brume", 6.6, OR.clair, 'font-style="italic" letter-spacing="0.4"');
      s += texte(236, 22, "BILLET", 5.4, "#B8C8E8", 'letter-spacing="1.4"', "end") + texte(236, 32, "N° 0742", 9, "#F6EFDC", 'font-weight="bold"', "end");
      s += trait("M12,52 L236,52 L236,198 L12,198 Z", MARINE.corps, 0.8, 'opacity=".75"') + trait("M14.6,54.6 L233.4,54.6 L233.4,195.4 L14.6,195.4 Z", MARINE.corps, 0.4, 'opacity=".55"');
      const coin = /* @__PURE__ */ __name((x2, y, sx, sy) => `<g transform="translate(${x2} ${y}) scale(${sx} ${sy})">${trait("M0,9 L0,0 L9,0", OR.ombre, 1.6)}${trait("M2.6,8 Q2.6,2.6 8,2.6", OR.corps, 0.9)}<circle cx="0" cy="0" r="1.7" fill="${OR.corps}" stroke="${OUT}" stroke-width="0.5"/></g>`, "coin");
      s += coin(12, 52, 1, 1) + coin(236, 52, -1, 1) + coin(12, 198, 1, -1) + coin(236, 198, -1, -1);
      let vagues = "M28,191";
      for (let x2 = 28; x2 < 220; x2 += 8) vagues += ` q2,-2.6 4,0 q2,2.6 4,0`;
      s += trait(vagues, MARINE.clair, 0.6, 'opacity=".6"');
      const [px, py, pw, ph, pa] = ZONES.photo, cx = px + pw / 2, cy = py + ph / 2;
      s += `<g transform="rotate(${pa} ${cx} ${cy})"><rect x="${px - 4}" y="${py - 4}" width="${pw + 8}" height="${ph + 14}" fill="rgba(30,20,10,.22)" transform="translate(1.2 1.6)"/><rect x="${px - 4}" y="${py - 4}" width="${pw + 8}" height="${ph + 14}" fill="#FFFDF6" stroke="${OUT}" stroke-width="0.8"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#DCE6F0" stroke="#9AA8B8" stroke-width="0.5"/><path d="M${px},${py} L${px + pw},${py} L${px},${py + ph * 0.5} Z" fill="#FFFFFF" opacity=".25"/>` + (() => {
        const mx = px - 4, my = py - 4, mr = px + pw + 4, mb = py + ph + 10;
        return `<path d="M${mx - 2},${my + 9} L${mx - 2},${my - 2} L${mx + 9},${my - 2} Z" fill="#3A302A"/><path d="M${mr + 2},${mb - 9} L${mr + 2},${mb + 2} L${mr - 9},${mb + 2} Z" fill="#3A302A"/>`;
      })() + texte(cx, py + ph + 7.4, "Passager", 5, "#8A7A64", 'font-style="italic"', "middle") + "</g>";
      s += texte(104, 70, "Carte d’embarquement", 11, ENCRE, 'font-style="italic"') + trait("M104,74 L170,74", OR.corps, 0.9);
      s += champ(104, 86, 128, "NOM", "");
      s += champ(104, 114, 56, "DÉPART", "Havre-Gris") + champ(166, 114, 66, "DESTINATION", "Îles de la Brume");
      s += champ(104, 140, 128, "DATE", "Nuit de la grande marée");
      s += champ(104, 166, 56, "PONT", "Promenade") + champ(166, 166, 30, "CABINE", "") + texte(181, 173.6, "7", 10, ENCRE, 'font-weight="bold"', "middle") + champ(202, 166, 30, "SIÈGE", "12");
      s += trait("M243,52 L243,198", "#8A7A64", 0.9, 'stroke-dasharray="1.4 2.2"');
      s += clip(`${id}e`, D, `<circle cx="243" cy="6" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W2}"/>` + (trempee ? "" : `<circle cx="243" cy="204" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W2}"/>`));
      s += texte(279, 22, "TALON", 6, "#B8C8E8", 'letter-spacing="2"', "middle") + hirondelle(285, 33, 0.9, "#F6EFDC");
      s += texte(279, 68, "N° 0742", 9, ENCRE, 'font-weight="bold"', "middle") + texte(279, 84, "Cabine 7 · Siège 12", 5.6, PAPIER.encre, "", "middle");
      s += texte(279, 98, "Havre-Gris", 6.2, ENCRE, 'font-style="italic"', "middle") + trait("M274,102 L284,102 M281,99.6 L284,102 L281,104.4", PAPIER.encre, 0.7) + texte(279, 113, "Îles de la Brume", 6.2, ENCRE, 'font-style="italic"', "middle");
      const hb = hasard(29);
      let barres = "", x = 254;
      while (x < 304) {
        const w = 0.6 + Math.floor(hb() * 3) * 0.6;
        barres += `<rect x="${r22(x)}" y="148" width="${r22(w)}" height="30" fill="#2A2420"/>`;
        x += w + 0.8 + hb() * 1.2;
      }
      s += barres + texte(279, 186, "0742 · 07 · 12", 5, PAPIER.encre, 'letter-spacing="0.6"', "middle");
      if (etat === "tampon") s += tampon();
      if (trempee) s += clip(`${id}d`, D, trempe(h) + trait(`M314,166${DECHIRE}`, "#E2D2AE", 2.2, 'opacity=".9"'));
      return s;
    }
    __name(carte, "carte");
    function tampon() {
      const h = hasard(5);
      let trous = "";
      for (let i = 0; i < 40; i++) trous += `<circle cx="${r22(150 + h() * 90)}" cy="${r22(160 + h() * 34)}" r="${r22(0.4 + h() * 0.9)}" fill="${PAPIER.corps}"/>`;
      return `<g transform="rotate(-11 196 176)" opacity=".86"><rect x="152" y="160" width="88" height="32" rx="5" fill="none" stroke="${ROUGE}" stroke-width="2.6"/><rect x="156" y="163.6" width="80" height="24.8" rx="3" fill="none" stroke="${ROUGE}" stroke-width="0.9"/>` + texte(196, 179, "EMBARQUÉ", 11.5, ROUGE, 'font-weight="bold" letter-spacing="1"', "middle") + texte(196, 186.4, "L’HIRONDELLE · CABINE 7", 4.4, ROUGE, 'letter-spacing="0.6"', "middle") + trous + "</g>";
    }
    __name(tampon, "tampon");
    function taches() {
      const aureole = /* @__PURE__ */ __name((x, y, rx, ry, a) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="rgba(150,160,150,.16)" stroke="rgba(120,96,60,.38)" stroke-width="0.9"/><ellipse cx="${x - rx * 0.2}" cy="${y - ry * 0.15}" rx="${rx * 0.6}" ry="${ry * 0.55}" transform="rotate(${a} ${x} ${y})" fill="none" stroke="rgba(120,96,60,.2)" stroke-width="0.6"/>`, "aureole");
      return aureole(206, 150, 34, 22, -12) + aureole(60, 188, 30, 14, 8) + aureole(282, 132, 22, 34, 4) + aureole(150, 60, 20, 10, 0) + '<rect x="0" y="0" width="320" height="210" fill="rgba(110,140,160,.10)"/>';
    }
    __name(taches, "taches");
    function trempe(h) {
      let s = "";
      for (const [x, y, n] of [[108, 122, 5], [170, 122, 6], [108, 148, 8], [108, 174, 4], [180, 176, 1], [205, 174, 2], [272, 70, 4], [266, 100, 3], [266, 115, 4]]) {
        for (let i = 0; i < n; i++) {
          const xx = x + i * 6 + h() * 3, l = 3 + h() * 7;
          s += trait(`M${r22(xx)},${y} q${r22((h() - 0.5) * 1.4)},${r22(l / 2)} ${r22((h() - 0.5) * 1.2)},${r22(l)}`, ENCRE, r22(0.5 + h() * 0.5), 'opacity=".32"') + `<circle cx="${r22(xx)}" cy="${r22(y + l)}" r="0.7" fill="${ENCRE}" opacity=".3"/>`;
        }
      }
      s += trait("M96,6 Q110,100 128,204", "#FFFFFF", 1.4, 'opacity=".55"') + trait("M97.6,6 Q111.6,100 129.6,204", "rgba(120,96,60,.35)", 0.8);
      return s;
    }
    __name(trempe, "trempe");
    module.exports = { carte, ZONES };
  }
});

// atelier/ouverture.js
var require_ouverture = __commonJS({
  "atelier/ouverture.js"(exports, module) {
    var { effile } = require_egares_voile();
    var { brumeFrame } = require_brume();
    var { carte: carteEmbarquement } = require_carte_embarquement();
    var W2 = 400;
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var hash = /* @__PURE__ */ __name((a, b) => {
      const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }, "hash");
    function Defs(pref) {
      let n = 0;
      const defs = [];
      const id = /* @__PURE__ */ __name(() => `${pref}${n++}`, "id");
      const stops = /* @__PURE__ */ __name((list) => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ""}/>`).join(""), "stops");
      return {
        lin(list, x1, y1, x2, y2) {
          const i = id();
          defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(list)}</linearGradient>`);
          return `url(#${i})`;
        },
        rad(list, cx, cy, r, fx = cx, fy = cy) {
          const i = id();
          defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fx="${f(fx)}" fy="${f(fy)}">${stops(list)}</radialGradient>`);
          return `url(#${i})`;
        },
        flou(sd, inner = "") {
          const i = id();
          defs.push(`<filter id="${i}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${sd}">${inner}</feGaussianBlur></filter>`);
          return `url(#${i})`;
        },
        clip(d) {
          const i = id();
          defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`);
          return `url(#${i})`;
        },
        out(body) {
          return `<defs>${defs.join("")}</defs>${body}`;
        }
      };
    }
    __name(Defs, "Defs");
    var SPL = /* @__PURE__ */ __name((n) => Array(n).fill("0.45 0 0.55 1").join(";"), "SPL");
    var kt = /* @__PURE__ */ __name((n) => Array.from({ length: n }, (_, i) => f(i / (n - 1))).join(";"), "kt");
    var vaVient = /* @__PURE__ */ __name((type, a, b, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${a};${b};${a}" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL(2)}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`, "vaVient");
    var boucle = /* @__PURE__ */ __name((attr, values, dur, begin = 0) => {
      const v = [...values, values[0]];
      return `<animate attributeName="${attr}" values="${v.join(";")}" keyTimes="${kt(v.length)}" calcMode="spline" keySplines="${SPL(v.length - 1)}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;
    }, "boucle");
    var defile = /* @__PURE__ */ __name((from, to, dur, begin = 0) => `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`, "defile");
    var uneFois = /* @__PURE__ */ __name((type, values, keyTimes, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${SPL(keyTimes.split(";").length - 1)}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze" additive="sum"/>`, "uneFois");
    var fonduUneFois = /* @__PURE__ */ __name((attr, values, keyTimes, dur, begin = 0) => `<animate attributeName="${attr}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${SPL(keyTimes.split(";").length - 1)}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze"/>`, "fonduUneFois");
    var path = /* @__PURE__ */ __name((d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra ? " " + extra : ""}/>`, "path");
    var trait = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${extra ? " " + extra : ""}/>`, "trait");
    var bez = /* @__PURE__ */ __name((p0, p1, p2, p3, t) => {
      const u = 1 - t;
      return [0, 1].map((j) => u * u * u * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t * t * t * p3[j]);
    }, "bez");
    var g1 = /* @__PURE__ */ __name((n) => Math.round(n * 10) / 10, "g1");
    var lisse = /* @__PURE__ */ __name((pts) => `M${pts[0].map(g1).join(",")}` + pts.slice(1).map((p, i) => {
      const q = pts[i + 2];
      return q ? ` Q${p.map(g1).join(",")} ${g1((p[0] + q[0]) / 2)},${g1((p[1] + q[1]) / 2)}` : ` L${p.map(g1).join(",")}`;
    }).join(""), "lisse");
    function racineForme(p0, c1, c2, p3, w0, noeuds = [0.3, 0.58]) {
      const N = 16, cote = [], autre = [], lum = [], ecorce = [[], []];
      for (let i = 0; i <= N; i++) {
        const t = i / N, p = bez(p0, c1, c2, p3, t), q = bez(p0, c1, c2, p3, Math.min(1, t + 0.01)), o = bez(p0, c1, c2, p3, Math.max(0, t - 0.01));
        const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1;
        let nx = -dy / l, ny = dx / l;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        let w = Math.max(1.2, w0 / 2 * (1 - t) ** 0.8);
        for (const k of noeuds) w += w0 / 2 * 0.16 * Math.exp(-(((t - k) / 0.035) ** 2));
        cote.push([p[0] + nx * w, p[1] + ny * w]);
        autre.push([p[0] - nx * w, p[1] - ny * w]);
        lum.push([p[0] + nx * w * 0.3, p[1] + ny * w * 0.3]);
        [-0.4, 0.3].forEach((k, j) => ecorce[j].push([p[0] + nx * w * k, p[1] + ny * w * k]));
      }
      return {
        corps: lisse([...cote, ...autre.reverse()]) + " Z",
        lumiere: lisse([...cote, ...lum.reverse()]) + " Z",
        ecorce: ecorce.map((l) => lisse(l.slice(2, N - 2)))
      };
    }
    __name(racineForme, "racineForme");
    function racine(r, k) {
      const ph = k / 3 * Math.PI * 2;
      const o = /* @__PURE__ */ __name((a, amp) => amp * Math.sin(ph + a), "o");
      const c1 = [r.c1[0] + o(r.s, 10), r.c1[1] + o(r.s + 1, 8)];
      const c2 = [r.c2[0] + o(r.s + 2, 16), r.c2[1] + o(r.s + 3, 12)];
      const b = [r.pointe[0] + o(r.s + 4, 22), r.pointe[1] + o(r.s + 5, 16)];
      return { ...racineForme(r.base, c1, c2, b, r.w, r.noeuds), c1, c2, b };
    }
    __name(racine, "racine");
    function racines01() {
      const D = Defs("rac");
      let s = `<rect width="${W2}" height="${W2}" fill="${D.lin([[0, "#1B4A5C"], [0.22, "#0E2B3A"], [0.6, "#061722"], [1, "#010508"]], 0, 0, 0, W2)}"/>`;
      const surf = /* @__PURE__ */ __name((k) => `M0,0 L400,0 L400,${f(22 + 4 * Math.sin(k))} ` + Array.from({ length: 9 }, (_, i) => {
        const x = 400 - (i + 1) * 50;
        return `Q${f(x + 25)},${f(30 + 6 * Math.sin(k + i * 1.3))} ${x},${f(22 + 5 * Math.sin(k + i * 0.9 + 1))}`;
      }).join(" ") + " Z", "surf");
      s += `<path d="${surf(0)}" fill="${D.lin([[0, "#7FC4C8", 0.55], [1, "#3E8A98", 0.18]], 0, 0, 0, 36)}">${boucle("d", [surf(0), surf(2.1), surf(4.2)], 3.6)}</path>`;
      for (let i = 0; i < 7; i++) {
        const x = 20 + i * 56;
        s += `<path d="M${x},${f(30 + 4 * hash(i, 1))} q14,-5 28,0 q12,4 24,-1" fill="none" stroke="#BFF0EE" stroke-width="1.2" stroke-linecap="round" opacity="0.35">${boucle("opacity", [0.1, 0.45, 0.2], 1.4 + hash(i, 3), hash(i, 5) * 2)}</path>`;
      }
      const loin = [
        { base: [-60, 430], c1: [40, 300], c2: [110, 220], pointe: [178, 120], w: 120, s: 0.3 },
        { base: [470, 460], c1: [380, 330], c2: [330, 240], pointe: [276, 140], w: 110, s: 1.7 }
      ];
      const flouLoin = D.flou(3.2);
      for (const r of loin) {
        const k = [0, 1, 2].map((i) => racine(r, i).corps);
        s += `<path d="${k[0]}" fill="#0C2230" opacity="0.85" filter="${flouLoin}">${boucle("d", k, 7.5, r.s)}</path>`;
      }
      const CHOC = 2.45;
      const tremble = `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;5 -4;-6 3;4 -2;-2 1;0 0" keyTimes="0;${f(CHOC / 3)};${f((CHOC + 0.05) / 3)};${f((CHOC + 0.12) / 3)};${f((CHOC + 0.2) / 3)};${f((CHOC + 0.3) / 3)};1" dur="3s" fill="freeze" additive="sum"/>`;
      const vacille = `<animate attributeName="opacity" values="1;1;0.15;0.9;0.1;0.7;0.2" keyTimes="0;${f(CHOC / 3)};${f((CHOC + 0.04) / 3)};${f((CHOC + 0.1) / 3)};${f((CHOC + 0.16) / 3)};${f((CHOC + 0.26) / 3)};1" dur="3s" fill="freeze"/>`;
      const coque2 = `<g>${tremble}<g>${vaVient("rotate", "-3 150 40", "3.4 150 40", 3.2)}` + path("M62,10 Q66,40 104,52 L196,56 Q232,52 246,26 L250,8 Z", D.lin([[0, "#163240"], [1, "#04101A"]], 0, 8, 0, 56)) + path("M70,26 Q80,44 108,50 L192,53 Q222,50 238,30", "none", 'stroke="#2E5C68" stroke-width="1.2" opacity="0.6"') + // l'hélice et le gouvernail
      path("M232,30 L248,46 L240,52 L226,38 Z", "#061520") + `<circle cx="126" cy="52" r="3.4" fill="#F4FFF4"/><circle cx="126" cy="52" r="9" fill="#DFFFF4" opacity="0.35"/><g>${vacille}${vaVient("rotate", "-14 126 52", "10 126 52", 3.4, 0.6)}<path d="M126,52 L18,430 L238,430 Z" fill="${D.lin([[0, "#DFFFF2", 0.5], [0.55, "#9FE0D2", 0.24], [1, "#6FBFB0", 0.04]], 126, 52, 128, 430)}" filter="${D.flou(9)}"/><path d="M126,52 L86,430 L170,430 Z" fill="${D.lin([[0, "#F4FFF8", 0.55], [0.5, "#BFF2E4", 0.14], [1, "#BFF2E4", 0]], 126, 52, 128, 430)}" filter="${D.flou(4)}"/></g></g></g>`;
      const pres = [
        { base: [-90, 360], c1: [30, 320], c2: [150, 300], pointe: [250, 196], w: 104, s: 0.9, noeuds: [0.26, 0.52] },
        { base: [500, 330], c1: [400, 290], c2: [320, 330], pointe: [246, 292], w: 92, s: 2.4, noeuds: [0.3, 0.6] },
        { base: [120, 490], c1: [150, 420], c2: [230, 400], pointe: [186, 318], w: 120, s: 4.1, noeuds: [0.34] }
      ];
      let devant = "";
      pres.forEach((r, i) => {
        const k = [0, 1, 2].map((j) => racine(r, j));
        const dur = 7 + i * 0.8;
        const corps = D.lin([[0, "#010407"], [0.55, "#06131B"], [1, "#0E2430"]], r.base[0], r.base[1], r.pointe[0], r.pointe[1]);
        devant += `<path d="${k[0].corps}" fill="${corps}">${boucle("d", k.map((x) => x.corps), dur, r.s)}</path>`;
        devant += `<path d="${k[0].lumiere}" fill="#2E6268" opacity="0.4">${boucle("d", k.map((x) => x.lumiere), dur, r.s)}${boucle("opacity", [0.18, 0.5, 0.26], 3.4, 0.6 + i * 0.4)}</path>`;
        for (let j = 0; j < 2; j++) devant += `<path d="${k[0].ecorce[j]}" fill="none" stroke="${j === 0 ? "#0B1E28" : "#1E4048"}" stroke-width="1.2" stroke-linecap="round" opacity="0.7">${boucle("d", k.map((x) => x.ecorce[j]), dur, r.s)}</path>`;
        for (let j = 0; j < 2; j++) {
          const rad = [0, 1, 2].map((m) => {
            const q = k[m], t = 0.42 + j * 0.18;
            const [px, py] = bez(r.base, q.c1, q.c2, q.b, t);
            const a = (j % 2 ? -1 : 1) * (1 + 0.35 * Math.sin(m * 2.1 + i + j)) + (j === 2 ? 0.6 : 0);
            return racineForme([px, py], [px + 26 * Math.cos(a), py - 26 * Math.sin(a) - 8], [px + 42 * Math.cos(a), py - 46], [px + 50 * Math.cos(a + 0.5 * Math.sin(m + j)), py - 60 + 10 * Math.sin(m + j)], 12 - j * 2, []).corps;
          });
          devant += `<path d="${rad[0]}" fill="#061620">${boucle("d", rad, 6.2 + j * 0.7, r.s + j)}</path>`;
        }
      });
      const frappe = [
        racineForme([-40, 430], [30, 360], [80, 330], [128, 318], 86, [0.32]),
        racineForme([-40, 430], [24, 368], [70, 338], [112, 330], 86, [0.32]),
        racineForme([-40, 430], [10, 380], [30, 360], [58, 352], 86, [0.32]),
        racineForme([-40, 430], [20, 300], [196, 230], [166, 60], 86, [0.32])
      ];
      const kt4 = `0;${f(1.4 / 3)};${f(2.1 / 3)};${f(CHOC / 3)};1`;
      const anim = /* @__PURE__ */ __name((k) => `<animate attributeName="d" values="${frappe.map((x) => x[k]).concat([frappe[3][k]]).join(";")}" keyTimes="${kt4}" calcMode="spline" keySplines="0.45 0 0.55 1;0.4 0 0.6 1;0.8 0 1 1;0 0 1 1" dur="3s" fill="freeze"/>`, "anim");
      devant += `<path d="${frappe[0].corps}" fill="${D.lin([[0, "#010407"], [0.6, "#071620"], [1, "#12303A"]], -40, 430, 166, 60)}">${anim("corps")}</path>`;
      devant += `<path d="${frappe[0].lumiere}" fill="#3E7A78" opacity="0.45">${anim("lumiere")}</path>`;
      const t0 = f(CHOC);
      devant += `<circle cx="166" cy="58" r="10" fill="none" stroke="#DFFFF4" stroke-width="3" opacity="0"><animate attributeName="r" values="10;90" begin="${t0}s" dur="0.5s" fill="freeze"/><animate attributeName="opacity" values="0.9;0" begin="${t0}s" dur="0.5s" fill="freeze"/></circle>`;
      for (let i = 0; i < 16; i++) {
        const a = -Math.PI / 2 + (hash(i, 71) - 0.5) * 2.6, v = 30 + hash(i, 73) * 70;
        devant += `<circle cx="166" cy="60" r="${f(1.2 + hash(i, 75) * 2.4)}" fill="none" stroke="#E8FFF8" stroke-width="0.9" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${f(Math.cos(a) * v)} ${f(Math.sin(a) * v * 0.6 + 30)}" begin="${t0}s" dur="0.55s" fill="freeze"/><animate attributeName="opacity" values="0.9;0" begin="${t0}s" dur="0.55s" fill="freeze"/></circle>`;
      }
      let neige = "";
      for (let i = 0; i < 46; i++) {
        const x = f(20 + hash(i, 11) * 340), y = f(60 + hash(i, 13) * 330), r = f(0.6 + hash(i, 15) * 1.4);
        neige += `<circle cx="${x}" cy="${y}" r="${r}" fill="#CFF6EE" opacity="${f(0.25 + hash(i, 17) * 0.5)}">${defile("0 0", `${f(-6 + hash(i, 19) * 12)} -26`, 6 + hash(i, 21) * 5, hash(i, 23) * 6)}</circle>`;
      }
      let bulles = "";
      for (let i = 0; i < 12; i++) {
        const x = f(100 + hash(i, 31) * 60), r = f(1.4 + hash(i, 33) * 2.6), d = f(1.8 + hash(i, 35) * 1.4);
        bulles += `<circle cx="${x}" cy="150" r="${r}" fill="none" stroke="#DFFFF8" stroke-width="0.8" opacity="0.7">${defile("0 0", `${f(-8 + hash(i, 37) * 16)} -110`, d, hash(i, 39) * d)}${boucle("opacity", [0, 0.8, 0.5], d, hash(i, 39) * d)}</circle>`;
      }
      const halo = `<ellipse cx="138" cy="262" rx="110" ry="70" fill="${D.rad([[0, "#8FD8C8", 0.32], [1, "#8FD8C8", 0]], 138, 262, 110)}">${boucle("opacity", [0.6, 1, 0.75], 3.4, 0.6)}</ellipse>`;
      s += coque2 + halo + neige + devant + bulles;
      s += `<rect width="${W2}" height="${W2}" fill="${D.rad([[0, "#000000", 0], [0.7, "#000000", 0.35], [1, "#000000", 0.8]], 160, 160, 330)}"/>`;
      s += `<rect width="${W2}" height="${W2}" fill="#DFFFF4" opacity="0"><animate attributeName="opacity" values="0;0.45;0" keyTimes="0;0.25;1" begin="${t0}s" dur="0.35s" fill="freeze"/></rect>`;
      s += `<rect width="${W2}" height="${W2}" fill="#000" opacity="0">${fonduUneFois("opacity", "0;0;1", `0;${f((CHOC + 0.15) / 3)};1`, 3)}</rect>`;
      return D.out(s);
    }
    __name(racines01, "racines01");
    var COUCHANT = { haut: "#241E4A", mi: "#5E3A6E", bas: "#D8664A", horizon: "#FFD98E", soleil: "#FFF4CC", merLoin: "#5B4878", merPres: "#2B3558", sableMouille: "#9C6A62", sable: "#D6A77E", sableOmbre: "#8E6450" };
    function etoileDeMer(x, y, r, a, c = "#E8744A") {
      let d = "";
      for (let i = 0; i < 5; i++) {
        const t = a + i / 5 * Math.PI * 2, t2 = t + Math.PI / 5;
        d += `${i ? "L" : "M"}${f(x + Math.cos(t) * r)},${f(y + Math.sin(t) * r * 0.62)} Q${f(x + Math.cos(t2) * r * 0.32)},${f(y + Math.sin(t2) * r * 0.2)} `;
      }
      return path(d + "Z", c, 'stroke="#7A2E1E" stroke-width="0.9" stroke-linejoin="round"') + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.16)}" fill="#FFB68A"/>`;
    }
    __name(etoileDeMer, "etoileDeMer");
    var coquillage = /* @__PURE__ */ __name((x, y, r, c = "#F2DCC8") => path(`M${f(x - r)},${f(y)} Q${f(x)},${f(y - r * 1.4)} ${f(x + r)},${f(y)} Q${f(x)},${f(y + r * 0.4)} ${f(x - r)},${f(y)} Z`, c, 'stroke="#8E6A5A" stroke-width="0.6"') + trait(`M${f(x)},${f(y + r * 0.2)} L${f(x)},${f(y - r)} M${f(x - r * 0.5)},${f(y + r * 0.1)} L${f(x - r * 0.2)},${f(y - r * 0.9)} M${f(x + r * 0.5)},${f(y + r * 0.1)} L${f(x + r * 0.2)},${f(y - r * 0.9)}`, "#B89A86", 0.5), "coquillage");
    var algue = /* @__PURE__ */ __name((x, y, s, c = "#3E4A2A") => trait(`M${f(x)},${f(y)} q${f(6 * s)},${f(-4 * s)} ${f(14 * s)},${f(-1 * s)} t${f(12 * s)},${f(-2 * s)} t${f(10 * s)},${f(2 * s)}`, c, 2.2 * s) + trait(`M${f(x + 4 * s)},${f(y + 2 * s)} q${f(8 * s)},${f(2 * s)} ${f(16 * s)},${f(-3 * s)}`, "#5E6A3A", 1.4 * s), "algue");
    var galet = /* @__PURE__ */ __name((D, x, y, rx, ry, c = "#6E5E62") => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${D.lin([[0, "#B89A9A"], [0.4, c], [1, "#3A2E36"]], x - rx, y - ry, x + rx * 0.4, y + ry)}"/><ellipse cx="${f(x - rx * 0.3)}" cy="${f(y - ry * 0.4)}" rx="${f(rx * 0.35)}" ry="${f(ry * 0.22)}" fill="#FFE2C4" opacity="0.45"/>`, "galet");
    var valise = /* @__PURE__ */ __name((x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${path("M-14,0 L14,0 L13,-12 L-13,-12 Z", "#7A4A30", 'stroke="#3A2016" stroke-width="1"')}${path("M-13,-12 L-6,-22 L18,-20 L13,-12 Z", "#8E5A3A", 'stroke="#3A2016" stroke-width="1"')}${trait("M-6,-6 l4,-1 l3,2 l5,-1", "#E8D8C8", 1.4)}${path("M-2,-12 L2,-12 L2,-14 L-2,-14 Z", "#C8A050")}</g>`, "valise");
    var planche = /* @__PURE__ */ __name((x, y, w, a) => `<g transform="rotate(${a} ${f(x)} ${f(y)})"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(w * 0.13)}" rx="1.5" fill="#8A6648" stroke="#3E2A1C" stroke-width="0.8"/>${trait(`M${f(x + 3)},${f(y + w * 0.06)} l${f(w - 6)},0`, "#A8846A", 0.6)}</g>`, "planche");
    var coque = /* @__PURE__ */ __name((x, y, s, a = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${a}) scale(${f(s)})">${path("M-22,0 L22,-4 L18,-14 L-20,-10 Z", "#E8E4DC", 'stroke="#4A3A34" stroke-width="1"')}${path("M-21,-3 L21,-7 L20.4,-9.6 L-21.4,-5.6 Z", "#C8463A")}<circle cx="2" cy="-10" r="2" fill="#4A5A6E" stroke="#4A3A34" stroke-width="0.6"/></g>`, "coque");
    function plageCouchant(D, o) {
      const C = COUCHANT, sx = o.soleil, h = o.horizon, ri = o.rivage;
      let s = `<rect width="${W2}" height="${f(h + 2)}" fill="${D.lin([[0, C.haut], [0.45, C.mi], [0.82, C.bas], [1, C.horizon]], 0, 0, 0, h)}"/>`;
      s += `<circle cx="${sx}" cy="${h}" r="150" fill="${D.rad([[0, "#FFE6A8", 0.75], [0.25, "#FFB070", 0.35], [1, "#FF8060", 0]], sx, h, 150)}"/>`;
      const nuage = /* @__PURE__ */ __name((x, y, w, k) => `<g>${defile("0 0", `${f(30 * k)} 0`, 40, hash(x, y) * 40)}${vaVient("translate", "0 0", `${f(-15 * k)} 0`, 20)}<path d="M${f(x)},${f(y)} q${f(w * 0.2)},${f(-9)} ${f(w * 0.45)},-2 q${f(w * 0.25)},-7 ${f(w * 0.55)},3 q-${f(w * 0.4)},6 -${f(w)},-1 Z" fill="#7A4A78" opacity="0.85"/><path d="M${f(x + w * 0.1)},${f(y + 0.5)} q${f(w * 0.4)},4 ${f(w * 0.85)},1.4" fill="none" stroke="#FFB27A" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/></g>`, "nuage");
      s += nuage(20, h - 120, 120, 1) + nuage(230, h - 140, 150, -1) + nuage(150, h - 70, 90, 0.6) + nuage(300, h - 52, 80, -0.7);
      s += `<g>${defile("0 0", "60 -8", 26)}${trait(`M60,${f(h - 96)} q4,-4 8,0 q4,-4 8,0 M84,${f(h - 104)} q3,-3 6,0 q3,-3 6,0`, "#3A2440", 1.1)}</g>`;
      s += `<g>${D.clip ? "" : ""}<circle cx="${sx}" cy="${f(h + 4)}" r="22" fill="${D.rad([[0, "#FFFFF0"], [0.6, C.soleil], [1, "#FFC27A"]], sx, h, 22)}" clip-path="${D.clip(`M0,0 L400,0 L400,${h} L0,${h} Z`)}">${boucle("r", [22, 22.8, 22.2], 4)}</circle></g>`;
      s += `<rect y="${h}" width="${W2}" height="${f(ri - h + 10)}" fill="${D.lin([[0, C.merLoin], [0.5, "#45406E"], [1, C.merPres]], 0, h, 0, ri)}"/>`;
      for (let i = 0; i < 26; i++) {
        const t = i / 26, y = h + 3 + (ri - h - 10) * t ** 1.4, w = 8 + 34 * t + 10 * hash(i, 3), x = sx + (hash(i, 5) - 0.5) * (18 + 70 * t);
        s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1 + 1.6 * t)}" rx="1" fill="#FFE2A0" opacity="0.6">${boucle("opacity", [0.15, 0.85, 0.35], 1 + hash(i, 7) * 1.6, hash(i, 9) * 2)}</rect>`;
      }
      for (let i = 0; i < 6; i++) {
        const y = h + 6 + i * ((ri - h) / 7);
        s += `<g>${defile("0 0", "0 6", 3.2, i * 0.5)}<path d="M-10,${f(y)} q40,-3 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#8E7AAE" stroke-width="${f(0.8 + i * 0.2)}" opacity="0.5">${boucle("opacity", [0.1, 0.55, 0.1], 3.2, i * 0.5)}</path></g>`;
      }
      s += `<path d="M0,${f(ri)} Q100,${f(ri - 6)} 200,${f(ri + 2)} T400,${f(ri - 4)} L400,400 L0,400 Z" fill="${D.lin([[0, C.sableMouille], [0.35, "#B8806A"], [0.7, C.sable], [1, C.sableOmbre]], 0, ri, 0, 400)}"/>`;
      s += `<rect x="${f(sx - 16)}" y="${f(ri)}" width="32" height="40" fill="${D.lin([[0, "#FFE2A0", 0.5], [1, "#FFE2A0", 0]], 0, ri, 0, ri + 40)}"/>`;
      const vague = /* @__PURE__ */ __name((k) => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)} L410,${f(ri - 6)} L-10,${f(ri - 6)} Z`, "vague");
      s += `<path d="${vague(0)}" fill="#8E86B8" opacity="0.55">${boucle("d", [vague(-4), vague(14), vague(6)], 5.2)}</path>`;
      const ecume = /* @__PURE__ */ __name((k) => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)}`, "ecume");
      s += `<path d="${ecume(0)}" fill="none" stroke="#FFF0DC" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="14 5 3 6" opacity="0.85">${boucle("d", [ecume(-4), ecume(14), ecume(6)], 5.2)}${boucle("opacity", [0.5, 0.95, 0.7], 5.2)}</path>`;
      for (let i = 0; i < 70; i++) {
        const x = hash(i, 41) * 400, y = ri + 14 + hash(i, 43) * (400 - ri - 14);
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + hash(i, 45) * 1.1)}" fill="${hash(i, 47) < 0.5 ? "#F2CFA6" : "#7A5242"}" opacity="0.6"/>`;
      }
      s += o.objets || "";
      return s;
    }
    __name(plageCouchant, "plageCouchant");
    var objetsPlage = /* @__PURE__ */ __name((D) => galet(D, 70, 342, 10, 6) + galet(D, 330, 360, 13, 7) + galet(D, 300, 322, 6, 3.6) + coquillage(150, 340, 5) + coquillage(262, 372, 4, "#F6C8B8") + etoileDeMer(232, 336, 11, 0.3) + etoileDeMer(96, 380, 8, 1.1, "#D85A6A") + algue(24, 318, 1.1) + algue(308, 300, 0.8), "objetsPlage");
    function paupieres01() {
      const D = Defs("pau");
      const plage = `<g transform="translate(200 210) rotate(-5) scale(1.12) translate(-200 -210)">${plageCouchant(D, { soleil: 236, horizon: 186, rivage: 252, objets: objetsPlage(D) + valise(330, 268, 0.7) + planche(40, 262, 40, -8) })}</g>`;
      let s = plage + `<g filter="${D.flou(7)}">${fonduUneFois("opacity", "1;1;0.75;0.9;0.45;0.6;0", "0;0.15;0.32;0.45;0.62;0.75;1", 5.2)}${plage}</g>`;
      for (let i = 0; i < 9; i++) s += `<ellipse cx="${f(20 + hash(i, 61) * 360)}" cy="${f(372 + hash(i, 63) * 30)}" rx="${f(6 + hash(i, 65) * 8)}" ry="${f(4 + hash(i, 67) * 5)}" fill="#C89A72" opacity="0.6" filter="${D.flou(2.5)}"/>`;
      s += `<rect width="${W2}" height="${W2}" fill="${D.rad([[0, "#FFD8A0", 0], [0.7, "#5A2E3A", 0.2], [1, "#1A0E18", 0.75]], 200, 200, 290)}"/>`;
      const lids = /* @__PURE__ */ __name((flouL) => {
        const haut = `<g filter="${flouL}">${uneFois("translate", "0 0;0 0;0 -86;0 0;0 -176;0 -6;0 -6;0 -330", "0;0.17;0.31;0.42;0.58;0.69;0.78;1", 3.6)}<path d="M-40,-420 L440,-420 L440,186 Q200,246 -40,186 Z" fill="#0A0508"/><path d="M-40,182 Q200,242 440,182" fill="none" stroke="#3A1A1E" stroke-width="8" opacity="0.8"/></g>`;
        const bas = `<g filter="${flouL}">${uneFois("translate", "0 0;0 0;0 70;0 0;0 150;0 4;0 4;0 300", "0;0.17;0.31;0.42;0.58;0.69;0.78;1", 3.6)}<path d="M-40,224 Q200,176 440,224 L440,820 L-40,820 Z" fill="#0A0508"/></g>`;
        return haut + bas;
      }, "lids");
      s += lids(D.flou(5));
      return D.out(s);
    }
    __name(paupieres01, "paupieres01");
    function carte01() {
      const D = Defs("car");
      const cx = 214, cy = 300;
      const blanc = `<g transform="rotate(-12 ${cx} ${cy})"><rect x="${cx - 6}" y="${cy - 3.6}" width="12" height="7.2" rx="0.8" fill="#F6EEDC" stroke="#8A7A64" stroke-width="0.6"/><rect x="${cx - 6}" y="${cy - 3.6}" width="12" height="2.2" fill="#2E4E8C"/></g><circle cx="${cx + 4}" cy="${cy - 2}" r="2" fill="#FFFFFF">${boucle("opacity", [0.2, 1, 0.4], 1.6)}${boucle("r", [1.4, 3.2, 1.8], 1.6)}</circle>`;
      const loin = plageCouchant(D, { soleil: 150, horizon: 182, rivage: 250, objets: objetsPlage(D) + coque(70, 276, 0.8, 6) + planche(300, 270, 46, 10) + valise(352, 262, 0.6) + blanc });
      let s = `<g transform="translate(${cx} ${cy})"><g>${uneFois("scale", "1;1;7", "0;0.6;1", 5.2)}<g transform="translate(${-cx} ${-cy})">${loin}</g></g>${fonduUneFois("opacity", "1;1;0", "0;0.78;1", 5.2)}</g>`;
      let pres = `<rect width="${W2}" height="${W2}" fill="${D.lin([[0, "#C8906C"], [0.5, "#B07A60"], [1, "#7A4E44"]], 0, 0, 120, 400)}"/>`;
      for (let i = 0; i < 9; i++) pres += trait(`M-10,${30 + i * 44} q60,-10 120,0 t120,0 t120,0 t120,0`, "#8E5E4E", 3, 'opacity="0.35"') + trait(`M-10,${27 + i * 44} q60,-10 120,0 t120,0 t120,0 t120,0`, "#E8B890", 1.2, 'opacity="0.4"');
      for (let i = 0; i < 90; i++) pres += `<circle cx="${f(hash(i, 81) * 400)}" cy="${f(hash(i, 83) * 400)}" r="${f(0.6 + hash(i, 85) * 1.4)}" fill="${hash(i, 87) < 0.5 ? "#F2CFA6" : "#6A443A"}" opacity="0.55"/>`;
      pres += `<rect width="${W2}" height="${W2}" fill="${D.rad([[0, "#FFD08A", 0.45], [1, "#FFD08A", 0]], 40, 60, 360)}"/>`;
      pres += `<g transform="translate(200 206) rotate(-14) scale(0.62) translate(-160 -105)"><rect x="6" y="10" width="320" height="210" rx="10" fill="#3A2016" opacity="0.35" filter="${D.flou(6)}"/>${carteEmbarquement("trempee")}</g>`;
      const flaque = /* @__PURE__ */ __name((k) => `M-10,${f(300 + k)} Q90,${f(270 + k)} 180,${f(292 + k)} T410,${f(262 + k)} L410,410 L-10,410 Z`, "flaque");
      pres += `<path d="${flaque(0)}" fill="${D.lin([[0, "#9EB8D0", 0.5], [1, "#5A6E8E", 0.75]], 0, 260, 0, 400)}">${boucle("d", [flaque(10), flaque(-14), flaque(2)], 6)}</path>`;
      const bord = /* @__PURE__ */ __name((k) => `M-10,${f(300 + k)} Q90,${f(270 + k)} 180,${f(292 + k)} T410,${f(262 + k)}`, "bord");
      pres += `<path d="${bord(0)}" fill="none" stroke="#FFF4E6" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="18 6 4 8" opacity="0.9">${boucle("d", [bord(10), bord(-14), bord(2)], 6)}</path>`;
      for (let i = 0; i < 10; i++) pres += `<circle cx="${f(40 + hash(i, 91) * 320)}" cy="${f(320 + hash(i, 93) * 60)}" r="${f(1.2 + hash(i, 95) * 2)}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6">${boucle("opacity", [0, 0.7, 0.3], 2 + hash(i, 97) * 2, hash(i, 99) * 3)}</circle>`;
      for (let i = 0; i < 5; i++) pres += `<circle cx="${f(150 + hash(i, 101) * 110)}" cy="${f(170 + hash(i, 103) * 70)}" r="1.6" fill="#FFFFFF">${boucle("opacity", [0, 0.9, 0], 1.8 + hash(i, 105), hash(i, 107) * 2)}</circle>`;
      s += `<g opacity="0">${fonduUneFois("opacity", "0;0;1", "0;0.74;1", 5.4)}<g transform="translate(200 206)"><g>${uneFois("scale", "1.18;1.18;1", "0;0.74;1", 5.6)}<g transform="translate(-200 -206)">${pres}</g></g></g></g>`;
      return D.out(s);
    }
    __name(carte01, "carte01");
    function plage02() {
      const D = Defs("pla");
      let s = plageCouchant(D, { soleil: 236, horizon: 196, rivage: 262, objets: objetsPlage(D) + coque(352, 300, 0.9, -8) + valise(46, 300, 0.85) + planche(300, 282, 50, 6) });
      s += `<rect width="${W2}" height="${W2}" fill="${D.rad([[0, "#FFC27A", 0.22], [1, "#FFC27A", 0]], 236, 196, 260)}"/>`;
      s += `<ellipse cx="136" cy="384" rx="26" ry="7" fill="#3A2030" opacity="0.4"/><path d="M146,382 L104,400 L80,400 L132,378 Z" fill="#3A2030" opacity="0.25"/>`;
      return D.out(s);
    }
    __name(plage02, "plage02");
    function ciel03() {
      const D = Defs("cie");
      const h = 318;
      let s = `<rect width="${W2}" height="${W2}" fill="${D.lin([[0, "#1E1A44"], [0.4, "#4A3470"], [0.75, "#C2586A"], [1, "#F2A070"]], 0, 0, 0, h)}"/>`;
      const traine = /* @__PURE__ */ __name((x, y, w, c, k) => `<g>${defile("0 0", `${f(24 * k)} 0`, 30, hash(x, 1) * 30)}<path d="M${x},${y} q${f(w * 0.3)},-14 ${f(w * 0.6)},-4 q${f(w * 0.25)},-10 ${f(w * 0.5)},4 q-${f(w * 0.5)},12 -${f(w * 1.1)},0 Z" fill="${c}" opacity="0.9"/><path d="M${f(x + 8)},${f(y + 2)} q${f(w * 0.5)},8 ${f(w * 0.95)},2" fill="none" stroke="#FF9A8A" stroke-width="2" stroke-linecap="round">${fonduUneFois("opacity", "0.9;0.25", "0;1", 2.2)}</path></g>`, "traine");
      s += traine(10, 120, 170, "#3A2A5E", 1) + traine(220, 90, 190, "#33285A", -1) + traine(120, 200, 140, "#5A3A6E", 0.6) + traine(260, 240, 120, "#6A3E6E", -0.5);
      s += `<rect width="${W2}" height="${h}" fill="${D.rad([[0, "#FFD08A", 0.7], [0.5, "#FF9A70", 0.25], [1, "#FF8A6A", 0]], 200, h + 40, 230)}">${fonduUneFois("opacity", "1;0.35", "0;1", 2.2)}</rect>`;
      s += `<rect y="${h}" width="${W2}" height="30" fill="${D.lin([[0, "#3E3060"], [1, "#1E1A34"]], 0, h, 0, h + 30)}"/>`;
      s += `<path d="M0,${h + 2} Q200,${h - 2} 400,${h + 2}" fill="none" stroke="#FFB08A" stroke-width="1.2" opacity="0.6"/>`;
      s += `<path d="M0,348 Q120,336 210,344 T400,338 L400,400 L0,400 Z" fill="${D.lin([[0, "#3A2A38"], [1, "#140E18"]], 0, 336, 0, 400)}"/>`;
      s += path("M0,352 L0,262 Q14,250 30,256 Q44,236 62,250 Q78,262 84,300 Q92,330 112,352 Z", "#1A1426") + path("M400,348 L400,276 Q384,262 368,272 Q352,258 340,276 Q326,300 306,348 Z", "#1A1426");
      s += trait("M30,256 Q44,236 62,250", "#FF9A8A", 1.2, 'opacity="0.5"') + trait("M368,272 Q352,258 340,276", "#FF9A8A", 1.2, 'opacity="0.5"');
      s += `<ellipse cx="200" cy="350" rx="60" ry="14" fill="${D.rad([[0, "#BFE6FF", 0.45], [1, "#BFE6FF", 0]], 200, 350, 60)}"/>`;
      s += `<g transform="translate(200 342)"><g>${vaVient("translate", "0 0", "0 -4", 2.4)}<g transform="rotate(-8) scale(1.5) translate(-20 -32)">${brumeFrame("s0", 0, "neutre", false)}</g></g></g>`;
      s += `<rect width="${W2}" height="${W2}" fill="#0A0C24" opacity="0">${fonduUneFois("opacity", "0;0.45", "0;1", 2.2)}</rect>`;
      return D.out(s);
    }
    __name(ciel03, "ciel03");
    var NUIT = { haut: "#070B22", bas: "#1E2C52", mer: "#14223E", sable: "#4A4650", sableBas: "#24222C" };
    function etoiles(D, n, yMax, seed) {
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = hash(i, seed) * 400, y = hash(i, seed + 1) * yMax, r = 0.5 + hash(i, seed + 2) * 1.2, d = 1.8 + hash(i, seed + 3) * 2.6;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#FFF6DC">${boucle("opacity", [1, 0.3, 0.8], d, hash(i, seed + 4) * d)}</circle>`;
      }
      return s;
    }
    __name(etoiles, "etoiles");
    function cercle05() {
      const D = Defs("cer");
      const h = 132;
      let s = `<rect width="${W2}" height="${h + 2}" fill="${D.lin([[0, NUIT.haut], [1, NUIT.bas]], 0, 0, 0, h)}"/>` + etoiles(D, 34, h - 16, 7);
      s += `<circle cx="324" cy="44" r="46" fill="${D.rad([[0, "#E8F0FF", 0.45], [1, "#E8F0FF", 0]], 324, 44, 46)}"/><circle cx="324" cy="44" r="10" fill="#F2F4E8"/><circle cx="321" cy="41" r="2.2" fill="#DCE0D4"/><circle cx="328" cy="47" r="1.5" fill="#DCE0D4"/>`;
      s += `<rect y="${h}" width="${W2}" height="34" fill="${D.lin([[0, "#1E3456"], [1, NUIT.mer]], 0, h, 0, h + 34)}"/>`;
      s += `<path d="M150,${h + 12} L250,${h + 12}" stroke="#C8D8F0" stroke-width="1" opacity="0.3"/>`;
      s += `<g opacity="0.4">${boucle("opacity", [0.2, 0.62, 0.32], 9)}<g transform="translate(176 ${h + 1}) rotate(-7) scale(1.4)">${path("M-34,0 L36,0 L28,-9 L-30,-9 Z", "#2A3550")}${path("M-14,-9 L10,-9 L8,-17 L-12,-17 Z", "#2A3550")}${path("M2,-17 L6,-17 L6,-27 L2,-27 Z", "#2A3550")}${trait("M-36,-1 L40,-1", "#5A6A8E", 0.8)}</g></g>`;
      for (let i = 0; i < 4; i++) s += `<g>${defile("0 0", `${i % 2 ? -40 : 40} 0`, 26 + i * 4, i * 5)}<ellipse cx="${100 + i * 70}" cy="${h + 2 - i * 3}" rx="${150 - i * 10}" ry="${12 + i * 2}" fill="#C8D4E8" opacity="${f(0.16 + i * 0.03)}"/></g>`;
      s += `<path d="M0,${h + 30} Q200,${h + 24} 400,${h + 30} L400,${h + 60} L0,${h + 60} Z" fill="${D.lin([[0, "#8E8A90"], [1, "#5E5A64"]], 0, h + 24, 0, h + 60)}"/>`;
      const lisiere = `M0,${h + 50} Q40,${h + 40} 80,${h + 48} T160,${h + 44} T240,${h + 50} T320,${h + 42} T400,${h + 48} L400,400 L0,400 Z`;
      s += `<path d="${lisiere}" fill="${D.lin([[0, "#3E6448"], [0.45, "#2E5038"], [1, "#18301F"]], 0, h + 40, 0, 400)}"/>`;
      s += `<path d="M0,${h + 50} Q40,${h + 40} 80,${h + 48} T160,${h + 44} T240,${h + 50} T320,${h + 42} T400,${h + 48}" fill="none" stroke="#7FA88A" stroke-width="1.4" opacity="0.5"/>`;
      for (const [x, y, rx, ry, c] of [[60, 250, 110, 30, "#355C40"], [330, 230, 120, 26, "#2A4C36"], [200, 360, 160, 40, "#2A4A32"]]) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="0.6"/>`;
      const bx = 220, by = 300;
      s += `<ellipse cx="${bx}" cy="${by}" rx="150" ry="58" fill="${D.rad([[0, "#BFE6FF", 0.42], [0.55, "#8FBFE8", 0.14], [1, "#8FBFE8", 0]], bx, by, 150)}">${boucle("opacity", [0.8, 1, 0.85], 2.4)}</ellipse>`;
      let herbe = "";
      for (let i = 0; i < 46; i++) {
        const x = hash(i, 21) * 400, y = h + 56 + hash(i, 23) ** 0.8 * (400 - h - 56), k = 0.6 + (y - h) / 260;
        if (Math.hypot((x - bx) / 92, (y - by) / 30) < 1) continue;
        const clair = Math.hypot((x - bx) / 150, (y - by) / 58) < 1;
        const c1 = clair ? "#8FC6A0" : "#4E7A58", c2 = clair ? "#5E9070" : "#2E5038";
        herbe += `<g>${vaVient("rotate", `-4 ${f(x)} ${f(y)}`, `4 ${f(x)} ${f(y)}`, 2.6 + hash(i, 25) * 1.6, hash(i, 27) * 3)}` + trait(`M${f(x)},${f(y)} q${f(-3 * k)},${f(-6 * k)} ${f(-5 * k)},${f(-12 * k)} M${f(x)},${f(y)} q${f(1 * k)},${f(-8 * k)} ${f(0.5 * k)},${f(-15 * k)} M${f(x)},${f(y)} q${f(3 * k)},${f(-5 * k)} ${f(6 * k)},${f(-10 * k)}`, c2, 2 * k) + trait(`M${f(x)},${f(y)} q${f(1 * k)},${f(-8 * k)} ${f(0.5 * k)},${f(-15 * k)}`, c1, 1 * k) + "</g>";
        if (i % 9 === 0) herbe += `<circle cx="${f(x + 8)}" cy="${f(y - 2)}" r="${f(1.6 * k)}" fill="#E8EEF8"/><circle cx="${f(x + 8)}" cy="${f(y - 2)}" r="${f(0.6 * k)}" fill="#F2D88A"/>`;
        if (i % 7 === 3) herbe += [0, 2.1, 4.2].map((a) => `<circle cx="${f(x - 10 + Math.cos(a) * 2.2 * k)}" cy="${f(y - 1 + Math.sin(a) * 1.4 * k)}" r="${f(1.8 * k)}" fill="${c2}"/>`).join("");
      }
      let fond = "", avant = "";
      const pierre = /* @__PURE__ */ __name((a, i) => {
        const x = bx + Math.cos(a) * 56, y = by + Math.sin(a) * 19, r = 9.5 + hash(i, 3) * 3.5, ht = 0.6 + hash(i, 5) * 0.25;
        const g = D.lin([[0, "#C8C8CC"], [0.35, "#8E8C94"], [0.75, "#3E3A44"], [1, "#1A1820"]], x - r, y - r * ht * 2, x + r * 0.4, y + 2);
        const k1 = 0.7 + hash(i, 7) * 0.5, k2 = 0.5 + hash(i, 8) * 0.6, k3 = 0.6 + hash(i, 9) * 0.5;
        return `<ellipse cx="${f(x + 2)}" cy="${f(y + 2)}" rx="${f(r * 1.1)}" ry="${f(r * 0.35)}" fill="#0E1A12" opacity="0.6"/><path d="M${f(x - r)},${f(y)} L${f(x - r * 0.9)},${f(y - r * ht * k1)} Q${f(x - r * 0.55)},${f(y - r * ht * 1.8)} ${f(x - r * 0.1)},${f(y - r * ht * 1.75)} L${f(x + r * 0.35)},${f(y - r * ht * (1.4 + k2 * 0.3))} Q${f(x + r * 0.9)},${f(y - r * ht * k3 * 1.2)} ${f(x + r)},${f(y)} Q${f(x)},${f(y + r * 0.3)} ${f(x - r)},${f(y)} Z" fill="${g}" stroke="#141218" stroke-width="1" stroke-linejoin="round"/><path d="M${f(x - r * 0.5)},${f(y - r * ht * 1.55)} q${f(r * 0.35)},${f(-1.2)} ${f(r * 0.6)},${f(0.6)}" fill="none" stroke="#E8F4FF" stroke-width="1.3" opacity="0.7"/><path d="M${f(x - r * 0.6)},${f(y - r * 0.2)} q${f(r * 0.6)},${f(r * 0.25)} ${f(r * 1.2)},0" fill="none" stroke="#141014" stroke-width="2.6" opacity="0.55"/>`;
      }, "pierre");
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2 + 0.15;
        Math.sin(a) < 0 ? fond += pierre(a, i) : avant += pierre(a, i);
      }
      let bois = `<ellipse cx="${bx}" cy="${by}" rx="46" ry="13" fill="${D.rad([[0, "#2A2626"], [0.75, "#1C1A1C"], [1, "#2E3A30"]], bx, by, 46)}"/>`;
      const buche = /* @__PURE__ */ __name((x0, y0, x1, y1, w) => `<path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="#2A1A12" stroke-width="${f(w + 1.6)}" stroke-linecap="round"/><path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="${D.lin([[0, "#9A7452"], [1, "#5E4230"]], x0, y0, x1, y1)}" stroke-width="${f(w)}" stroke-linecap="round"/><path d="M${f(x0 + (x1 - x0) * 0.2)},${f(y0 + (y1 - y0) * 0.2 - w * 0.25)} L${f(x0 + (x1 - x0) * 0.8)},${f(y0 + (y1 - y0) * 0.8 - w * 0.25)}" stroke="#C8DCF0" stroke-width="0.9" opacity="0.5" stroke-linecap="round"/>`, "buche");
      for (const [dx, dy] of [[-30, 6], [28, 5], [-18, -8], [20, -9], [-4, 9]]) bois += buche(bx + dx, by + dy, bx + dx * 0.12, by - 34 + dy * 0.1, 5);
      bois += buche(bx - 30, by + 4, bx + 30, by + 2, 4.4);
      bois += trait(`M${bx - 6},${by - 30} l-4,-8 M${bx + 4},${by - 31} l5,-7`, "#7A5A40", 1.4);
      const rondin = `<g transform="rotate(-14 ${bx + 104} ${by + 22})"><ellipse cx="${bx + 104}" cy="${by + 30}" rx="40" ry="7" fill="#0E1A12" opacity="0.5"/><rect x="${bx + 70}" y="${by + 10}" width="70" height="18" rx="9" fill="${D.lin([[0, "#A07A58"], [1, "#4E3424"]], 0, by + 10, 0, by + 28)}" stroke="#2A1A12" stroke-width="1.4"/><ellipse cx="${bx + 140}" cy="${by + 19}" rx="5" ry="9" fill="#C8A47A" stroke="#2A1A12" stroke-width="1.2"/><ellipse cx="${bx + 140}" cy="${by + 19}" rx="2.4" ry="4.6" fill="none" stroke="#7A5A3E" stroke-width="0.8"/>${trait(`M${bx + 76},${by + 14} l58,0`, "#D8E8F8", 1, 'opacity="0.45"')}</g>`;
      s += herbe + fond + bois + avant + rondin;
      s += `<g transform="translate(${bx} ${by - 66})"><g>${vaVient("translate", "0 0", "0 -6", 2.6)}<circle cx="0" cy="-12" r="28" fill="${D.rad([[0, "#E0F4FF", 0.6], [1, "#E0F4FF", 0]], 0, -12, 28)}"/><g transform="scale(1.1) translate(-20 -32)">${brumeFrame("s0", 0, "neutre")}</g></g></g>`;
      for (let i = 0; i < 6; i++) s += `<circle cx="${f(120 + hash(i, 81) * 200)}" cy="${f(330 + hash(i, 83) * 40)}" r="1.4" fill="#DFF2FF" opacity="0">${defile("0 0", `${f(-10 + hash(i, 85) * 20)} -70`, 5 + hash(i, 87) * 3, hash(i, 89) * 6)}${boucle("opacity", [0, 0.8, 0], 5 + hash(i, 87) * 3, hash(i, 89) * 6)}</circle>`;
      return D.out(s);
    }
    __name(cercle05, "cercle05");
    function epave10() {
      const D = Defs("epa");
      const h = 168;
      let s = `<rect width="${W2}" height="${W2}" fill="${D.lin([[0, "#8E9AB0"], [0.55, "#C8C6CC"], [1, "#E8D8D0"]], 0, 0, 0, h)}"/>`;
      s += `<ellipse cx="120" cy="${h}" rx="200" ry="60" fill="${D.rad([[0, "#FFE8D8", 0.6], [1, "#FFE8D8", 0]], 120, h, 200)}"/>`;
      s += `<rect y="${h}" width="${W2}" height="${280 - h}" fill="${D.lin([[0, "#A6AEBE"], [0.5, "#7E8EA2"], [1, "#5E7088"]], 0, h, 0, 280)}"/>`;
      for (let i = 0; i < 7; i++) {
        const y = h + 8 + i * 15;
        s += `<g>${defile("0 0", "0 4", 4, i * 0.6)}<path d="M-10,${y} q40,-2 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#D8DEE8" stroke-width="${f(0.6 + i * 0.15)}" opacity="0.5"/></g>`;
      }
      const roc = /* @__PURE__ */ __name((x, y, w, hh) => `<path d="M${x},${y} Q${f(x + w * 0.05)},${f(y - hh * 0.8)} ${f(x + w * 0.35)},${f(y - hh)} Q${f(x + w * 0.7)},${f(y - hh * 1.1)} ${f(x + w)},${f(y - hh * 0.3)} L${f(x + w)},${y} Z" fill="${D.lin([[0, "#8A8690"], [0.5, "#5E5A66"], [1, "#34303A"]], x, y - hh, x + w * 0.6, y)}" stroke="#2A2630" stroke-width="1.2"/><path d="M${f(x + w * 0.2)},${f(y - hh * 0.8)} q${f(w * 0.15)},${f(-hh * 0.15)} ${f(w * 0.3)},${f(-hh * 0.1)}" fill="none" stroke="#C8C4CC" stroke-width="1.4" opacity="0.6"/>`, "roc");
      s += roc(250, 262, 170, 96) + roc(200, 270, 80, 40);
      let ep = `<g>${vaVient("rotate", "-0.6 300 230", "0.6 300 230", 5)}`;
      ep += path("M196,250 L330,214 L352,236 L214,276 Z", D.lin([[0, "#F2EEE6"], [1, "#B8B2AA"]], 196, 214, 214, 276), 'stroke="#3A3236" stroke-width="1.4"');
      ep += path("M198,256 L336,220 L340,226 L202,262 Z", "#C8463A");
      for (let i = 0; i < 4; i++) ep += `<circle cx="${f(224 + i * 30)}" cy="${f(258 - i * 8)}" r="3.4" fill="#4A5A6E" stroke="#2A2630" stroke-width="1"/>`;
      ep += path("M196,250 L330,214 L318,196 L190,230 Z", D.lin([[0, "#A88A68"], [1, "#6E5440"]], 190, 196, 196, 250), 'stroke="#3A2A20" stroke-width="1.2"');
      for (let i = 1; i < 6; i++) ep += trait(`M${f(192 + i * 2)},${f(232 + i * 3.6)} L${f(320 + i * 2)},${f(198 + i * 3.4)}`, "#5A4434", 0.8, 'opacity="0.7"');
      for (let i = 0; i < 6; i++) ep += trait(`M${f(196 + i * 24)},${f(229 - i * 6.4)} l${f(i === 4 ? 6 : 0)},-16`, "#E8E4DC", 1.8);
      ep += trait("M196,213 L262,196 Q280,186 300,190 L326,180", "#E8E4DC", 1.8);
      ep += path("M286,186 Q320,166 364,176 L370,190 Q326,182 288,196 Z", D.lin([[0, "#F2F0EA"], [1, "#C8C2BA"]], 286, 166, 290, 196), 'stroke="#3A3236" stroke-width="1.2"') + path("M288,196 Q326,184 370,190 L368,194 Q326,188 290,200 Z", "#E8743A");
      for (const [x, y, c] of [[214, 214, 0], [234, 206, 1], [250, 222, 2]]) ep += `<g transform="rotate(${-8 + c * 6} ${x} ${y})"><rect x="${x - 10}" y="${y - 10}" width="20" height="18" fill="${D.lin([[0, "#B8946A"], [1, "#7A5A3E"]], x - 10, y - 10, x + 10, y + 8)}" stroke="#3A2A20" stroke-width="1"/>${trait(`M${x - 10},${y - 4} l20,0 M${x - 10},${y + 2} l20,0`, "#5A4430", 0.8)}</g>`;
      ep += trait("M204,206 Q226,226 246,200 Q262,212 258,232 M222,196 Q240,214 262,214", "#D8C8A0", 1.4);
      ep += "</g>";
      s += ep;
      const bat = /* @__PURE__ */ __name((k) => `M190,${f(278 + k)} Q240,${f(270 + k)} 290,${f(266 + k)} T400,${f(260 + k)}`, "bat");
      s += `<path d="${bat(0)}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 6 3 7" opacity="0.8">${boucle("d", [bat(0), bat(-6), bat(2)], 3.8)}</path>`;
      const nx = 160, ny = 250;
      let nage = `<g>${uneFois("translate", "0 0;-34 18", "0;1", 40)}`;
      nage += `<path d="M${nx + 6},${ny + 2} q22,4 44,-2 M${nx + 6},${ny + 4} q22,10 46,6" fill="none" stroke="#F2F4F8" stroke-width="1.2" opacity="0.7"/>`;
      nage += `<ellipse cx="${nx}" cy="${ny + 3}" rx="12" ry="3.4" fill="#5E7088" opacity="0.6"/>`;
      nage += `<g>${vaVient("translate", "0 0", "0 1.6", 0.9)}<circle cx="${nx}" cy="${ny - 3}" r="5" fill="#E8B898" stroke="#3A2A28" stroke-width="0.9"/><path d="M${nx - 5},${ny - 4} Q${nx - 1},${ny - 11} ${nx + 5},${ny - 5} Q${nx + 7},${ny - 9} ${nx + 4},${ny - 11} Q${nx - 2},${ny - 13} ${nx - 5},${ny - 4} Z" fill="#3A2420"/></g>`;
      const bras = /* @__PURE__ */ __name((dx, begin) => `<path d="M${nx + dx},${ny} q-6,-14 -16,-12" fill="none" stroke="#E8B898" stroke-width="2.6" stroke-linecap="round" opacity="0">${`<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.1;0.4;0.5;1" dur="1.4s" begin="${begin}s" repeatCount="indefinite"/>`}</path><circle cx="${nx + dx - 14}" cy="${ny - 2}" r="2" fill="#FFFFFF" opacity="0"><animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.38;0.48;0.6;1" dur="1.4s" begin="${begin}s" repeatCount="indefinite"/></circle>`, "bras");
      nage += bras(-2, 0) + bras(4, -0.7) + "</g>";
      s += nage;
      s += `<path d="M0,300 Q120,284 220,296 T400,290 L400,400 L0,400 Z" fill="${D.lin([[0, "#B8A496"], [0.4, "#D8C4AE"], [1, "#A89480"]], 0, 284, 0, 400)}"/>`;
      const ec = /* @__PURE__ */ __name((k) => `M-10,${f(298 + k)} Q120,${f(288 + k)} 220,${f(298 + k)} T410,${f(292 + k)}`, "ec");
      s += `<path d="${ec(0)}" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.8">${boucle("d", [ec(-2), ec(6), ec(1)], 5)}</path>`;
      s += galet(D, 70, 340, 10, 5, "#7E7680") + galet(D, 330, 352, 12, 6, "#7E7680") + coquillage(160, 330, 4) + planche(260, 320, 44, -6);
      for (let i = 0; i < 3; i++) s += `<g>${defile("0 0", `${i % 2 ? -50 : 50} 0`, 30 + i * 6, i * 7)}<ellipse cx="${80 + i * 120}" cy="${h + 10 + i * 30}" rx="170" ry="16" fill="#F4F2F4" opacity="${f(0.28 - i * 0.05)}"/></g>`;
      s += `<g>${defile("0 0", "-80 10", 18)}${trait("M260,90 q5,-5 10,0 q5,-5 10,0 M296,78 q4,-4 8,0 q4,-4 8,0", "#4A4A5A", 1.4)}</g>`;
      return D.out(s);
    }
    __name(epave10, "epave10");
    module.exports = { racines01, paupieres01, carte01, plage02, ciel03, cercle05, epave10, Defs, vaVient, boucle, defile, uneFois, fonduUneFois, path, trait, hash, f, W: W2 };
  }
});

// atelier/scenes6.js
var require_scenes6 = __commonJS({
  "atelier/scenes6.js"(exports, module) {
    var { OUT, P, E, L, r2: r22, frame, zee, arm } = require_troupe2();
    var { brumeFrame } = require_brume();
    var { sleepFrame, seated, POSES: DORT, jar, rod } = require_dormeurs();
    var { CAST } = require_naufrages();
    var { ZEDS, avecReparer } = require_gestes();
    var { torche } = require_torche();
    var W2 = 400;
    var T = Object.fromEntries(CAST.filter(({ base }) => ["Cannelle", "Rivet", "Aster", "Ondin"].includes(base.name)).map(({ base, nau }) => [base.name, { base, nau }]));
    var NUIT = { ciel: "#16213F", cielBas: "#2C3D63", mer: "#1E3552", merH: "#2E4E72", ecume: "#8FA9C4", sable: "#5E5B57", roche: "#3E4352", rocheH: "#545B6E", brume: "220,230,242" };
    var AUBE = { ciel: "#5B6A9A", cielBas: "#F2B8A0", mer: "#4E6E96", merH: "#6E8EB4", ecume: "#E8D8D0", sable: "#B8A48A", roche: "#6E6A72", rocheH: "#8A8690", brume: "245,230,226" };
    var JOUR = { ciel: "#7EB6E0", cielBas: "#CDE6F2", mer: "#3E8EB8", merH: "#5EAAD0", ecume: "#F4FAFC", sable: "#E8D3A6", roche: "#8E8A84", rocheH: "#ABA79F", brume: "255,255,255" };
    var TEMPETE = { ciel: "#0E1530", cielBas: "#24345A" };
    var trait = /* @__PURE__ */ __name((d, color, w, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`, "trait");
    var grad = /* @__PURE__ */ __name((id, haut, bas) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs>`, "grad");
    var ciel = /* @__PURE__ */ __name((id, c, y1 = W2) => grad(id, c.ciel, c.cielBas) + `<rect x="0" y="0" width="${W2}" height="${y1}" fill="url(#${id})"/>`, "ciel");
    var etoiles = /* @__PURE__ */ __name((pts, f) => pts.map(([x, y], i) => {
      const r = 1.5 + (f + i) % 2 * 0.6;
      return E(x, y, r, r, "#F6EFDC", 0);
    }).join(""), "etoiles");
    var nappe = /* @__PURE__ */ __name((y, a, f, k = 1, c = NUIT) => [[-40, 0, 230], [170, 8, 260], [380, -4, 210]].map(([x, dy, rx]) => `<ellipse cx="${r22(x + f * 9 * k)}" cy="${r22(y + dy)}" rx="${rx}" ry="${r22(26 * k)}" fill="rgba(${c.brume},${a})"/>`).join(""), "nappe");
    function mer(y0, y1, f, c = NUIT) {
      let s = `<rect x="0" y="${y0}" width="${W2}" height="${y1 - y0}" fill="${c.mer}"/>`;
      for (let i = 0; i < 4; i++) {
        const y = y0 + (y1 - y0) * (0.2 + i * 0.22), off = (f * 14 + i * 37) % 80;
        s += trait(Array.from({ length: 7 }, (_, k) => `M${r22(k * 80 - off)},${r22(y)} q20,-${3 + i} 40,0`).join(" "), i % 2 ? c.merH : c.ecume, r22(1.6 + i * 0.4), `opacity="${r22(0.55 + i * 0.1)}"`);
      }
      return s;
    }
    __name(mer, "mer");
    var sable = /* @__PURE__ */ __name((y, c = NUIT) => P(`M0,${y} Q${W2 * 0.3},${y - 14} ${W2 * 0.55},${y - 6} Q${W2 * 0.8},${y + 2} ${W2},${y - 10} L${W2},${W2} L0,${W2} Z`, c.sable, 2) + [[60, y + 40, 9], [300, y + 30, 7], [350, y + 70, 11], [120, y + 90, 6]].map(([x, yy, r]) => E(x, yy, r, r * 0.6, c.roche, 1.6) + E(x - r * 0.3, yy - r * 0.2, r * 0.35, r * 0.2, c.rocheH, 0)).join(""), "sable");
    var rocher = /* @__PURE__ */ __name((x, y, w, h, c = NUIT) => P(`M${x},${y} Q${r22(x - w * 0.06)},${r22(y - h * 0.7)} ${r22(x + w * 0.3)},${r22(y - h)} Q${r22(x + w * 0.6)},${r22(y - h * 1.12)} ${r22(x + w * 0.86)},${r22(y - h * 0.8)} Q${r22(x + w * 1.04)},${r22(y - h * 0.4)} ${r22(x + w)},${y} Z`, c.roche, 2.4) + P(`M${r22(x + w * 0.58)},${r22(y - h * 1.04)} Q${r22(x + w * 0.9)},${r22(y - h * 0.8)} ${r22(x + w)},${y} L${r22(x + w * 0.66)},${y} Q${r22(x + w * 0.74)},${r22(y - h * 0.5)} ${r22(x + w * 0.58)},${r22(y - h * 1.04)} Z`, "rgba(0,0,0,.18)", 0) + L([x + w * 0.2, y - h * 0.8], [x + w * 0.4, y - h * 0.96], c.rocheH, 3), "rocher");
    var pluie = /* @__PURE__ */ __name((f, a = 0.35) => Array.from({ length: 46 }, (_, i) => {
      const x = (i * 53 + f * 21) % 440 - 20, y = (i * 97 + f * 37) % 420 - 20;
      return `<path d="M${x},${y} l-14,22" stroke="rgba(190,210,235,${a})" stroke-width="1.4" stroke-linecap="round"/>`;
    }).join(""), "pluie");
    var poser = /* @__PURE__ */ __name((body, x, y, s, m = 1) => `<g transform="translate(${r22(x - 24 * s * m)} ${r22(y - 62 * s)}) scale(${r22(s * m)} ${r22(s)})">${body}</g>`, "poser");
    var brume = /* @__PURE__ */ __name((x, y, s, n, expr = "neutre") => `<g transform="translate(${r22(x - 20 * s)} ${r22(y - 32 * s)}) scale(${r22(s)})">${brumeFrame("s0", n % 4, expr)}</g>`, "brume");
    var lueur = /* @__PURE__ */ __name((x, y, r, rgb, a) => [1, 0.7, 0.45].map((k, i) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r * k)}" fill="rgba(${rgb},${r22(a * (0.25 + i * 0.25))})"/>`).join(""), "lueur");
    var etincelle = /* @__PURE__ */ __name((x, y, s) => `<path d="M${r22(x)},${r22(y - 4 * s)} L${r22(x + s)},${r22(y - s)} L${r22(x + 4 * s)},${r22(y)} L${r22(x + s)},${r22(y + s)} L${r22(x)},${r22(y + 4 * s)} L${r22(x - s)},${r22(y + s)} L${r22(x - 4 * s)},${r22(y)} L${r22(x - s)},${r22(y - s)} Z" fill="#FFF3B0" stroke="#E8B84A" stroke-width="${r22(0.6 * s)}" stroke-linejoin="round"/>`, "etincelle");
    var texte = /* @__PURE__ */ __name((x, y, t, size, col, extra = "", ancre = "middle") => `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="${col}" text-anchor="${ancre}" ${extra}>${t}</text>`, "texte");
    var lucioles = /* @__PURE__ */ __name((pts, f) => pts.map(([x, y], i) => {
      const yy = y + (f + i) % 2 * 3;
      return lueur(x, yy, 8, "255,236,150", 0.5) + E(x, yy, 1.8, 1.8, "#FFF3A0", 0);
    }).join(""), "lucioles");
    function feu(x, y, s, f, force = 2) {
      const k = [0.25, 0.55, 1][force];
      const fl = /* @__PURE__ */ __name((dx, h, w, col, ph) => {
        const sway = [0, 2, -2, 1][(f + ph) % 4];
        return P(`M${r22(x + dx * s - w * s)},${r22(y)} Q${r22(x + dx * s - w * s * 0.8)},${r22(y - h * s * 0.6)} ${r22(x + dx * s + sway * s)},${r22(y - h * s)} Q${r22(x + dx * s + w * s * 0.8)},${r22(y - h * s * 0.6)} ${r22(x + dx * s + w * s)},${r22(y)} Z`, col, 0);
      }, "fl");
      let s0 = force ? lueur(x, y - 14 * s, 70 * s * k, "255,190,90", 0.5) : "";
      s0 += [-16, -8, 0, 8, 16].map((dx, i) => E(x + dx * s, y + (i % 2 ? 2 : 3) * s, 4.6 * s, 3 * s, "#8A857C", 1.4)).join("") + L([x - 13 * s, y + 1 * s], [x + 12 * s, y - 3 * s], OUT, 7 * s) + L([x - 13 * s, y + 1 * s], [x + 12 * s, y - 3 * s], "#9A6E44", 4.6 * s) + L([x - 11 * s, y - 3 * s], [x + 13 * s, y + 1 * s], OUT, 7 * s) + L([x - 11 * s, y - 3 * s], [x + 13 * s, y + 1 * s], "#B07E50", 4.6 * s);
      if (!force) return s0 + etincelle(x + [0, 3, -2, 1][f % 4] * s, y - 6 * s, 1.4 * s);
      return s0 + fl(-5, 26 * k, 7 * k, "#E8562E", 0) + fl(4, 30 * k, 7 * k, "#F28A2E", 1) + fl(0, 22 * k, 5 * k, "#FFD15A", 2) + fl(-1, 12 * k, 3 * k, "#FFF3B0", 3);
    }
    __name(feu, "feu");
    var epave = /* @__PURE__ */ __name((x, y, s, a = 1) => `<g transform="translate(${x} ${y}) rotate(-14) scale(${s})" opacity="${a}">` + P("M-60,0 L56,0 L66,-14 L-66,-14 Z", "#E8E4DA", 2) + P("M-58,0 L54,0 L60,8 L-50,8 Z", "#B8483A", 2) + P("M-40,-14 L34,-14 L30,-30 L-36,-30 Z", "#F4F0E6", 2) + `<rect x="6" y="-48" width="14" height="18" fill="#F2C04B" stroke="${OUT}" stroke-width="2"/><rect x="6" y="-44" width="14" height="4" fill="#3E5A8C"/>` + [-50, -36, -22, -8, 6, 20, 34, 48].map((px) => E(px, -7, 3, 3, "#5E7A9E", 1.2)).join("") + [-28, -16, -4, 8, 20].map((px) => `<rect x="${px - 3}" y="-25" width="6" height="6" fill="#5E7A9E" stroke="${OUT}" stroke-width="1"/>`).join("") + "</g>", "epave");
    function ruines() {
      const pierre = /* @__PURE__ */ __name((x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#7C7A82" stroke="${OUT}" stroke-width="1.6"/>`, "pierre");
      let s = "";
      for (let i = 0; i < 5; i++) for (let j = 0; j < 4 - i % 3; j++) s += pierre(36 + i * 22 + j % 2 * 8, 226 - j * 14, 20, 13);
      s += P("M256,240 L256,176 Q281,150 306,176 L306,240 L298,240 L298,180 Q281,162 264,180 L264,240 Z", "#7C7A82", 2) + P("M264,240 L264,180 Q281,162 298,180 L298,240 Z", "#232029", 1.4);
      s += `<rect x="150" y="218" width="52" height="24" fill="#7C7A82" stroke="${OUT}" stroke-width="2"/>` + E(176, 242, 26, 8, "#7C7A82", 2) + E(176, 218, 26, 8, "#232029", 2) + [[156, 218, 156, 186], [196, 218, 196, 186], [152, 186, 200, 186]].map(([a, b, c, d]) => L([a, b], [c, d], OUT, 4.4) + L([a, b], [c, d], "#8A6A48", 2.2)).join("");
      return s;
    }
    __name(ruines, "ruines");
    function grimoire(x, y, s, r = -6) {
      const sc = ["#E8584A", "#F2C04B", "#7EC45B", "#5EA8E8", "#B07EE0", "#F28A2E", "#E8E4DA"];
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + lueur(0, -2, 34, "255,220,150", 0.3) + `<rect x="-26" y="-18" width="52" height="36" rx="3" fill="#6B3E24" stroke="${OUT}" stroke-width="2.2"/><rect x="-22" y="-14" width="44" height="28" rx="2" fill="none" stroke="#C8A052" stroke-width="1.4"/>` + [[-26, -18], [26, -18], [-26, 18], [26, 18]].map(([cx, cy]) => E(cx, cy, 3.4, 3.4, "#C8A052", 1.2)).join("") + sc.map((col, i) => E(-18 + i * 6, 0, 2.6, 2.6, col, 1)).join("") + "</g>";
    }
    __name(grimoire, "grimoire");
    var CADRE_PHOTO2 = [92, 150, 96, 116];
    function carte(tampon = false) {
      const [px, py, pw, ph] = CADRE_PHOTO2;
      let s = `<rect x="70" y="96" width="260" height="196" rx="10" fill="#F6EFDC" stroke="${OUT}" stroke-width="3"/><path d="M70,134 L70,106 Q70,96 80,96 L320,96 Q330,96 330,106 L330,134 Z" fill="#2E4E8C" stroke="${OUT}" stroke-width="3"/>` + texte(214, 122, "L’HIRONDELLE", 19, "#F6EFDC", 'font-weight="bold" letter-spacing="3"') + P("M90,116 q8,-8 18,-2 q6,-6 14,-2 q-8,2 -12,8 q-8,-4 -20,-4 Z", "#F6EFDC", 0) + `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="4" fill="#DCE6F0" stroke="${OUT}" stroke-width="2.4"/>` + texte(258, 168, "Carte d’embarquement", 13, "#2E4E8C", 'font-style="italic"') + texte(206, 202, "Nom", 11, "#6B5A48", "", "start") + L([206, 222], [314, 222], "#8A7A64", 1.6) + texte(206, 248, "Cabine", 11, "#6B5A48", "", "start") + texte(300, 248, "7", 13, "#2E4E8C") + L([206, 256], [314, 256], "#8A7A64", 1.2);
      if (tampon) s += `<g transform="rotate(-14 250 266)" opacity="0.88">${tamponSeul()}</g>`;
      return s;
    }
    __name(carte, "carte");
    var tamponSeul = /* @__PURE__ */ __name(() => `<rect x="198" y="249" width="104" height="32" rx="6" fill="none" stroke="#C8463A" stroke-width="3.4"/>${texte(250, 272, "EMBARQUÉ", 16, "#C8463A", 'font-weight="bold" letter-spacing="1.5"')}`, "tamponSeul");
    var ETOILES = [[40, 40], [120, 70], [340, 50], [370, 120], [30, 320], [360, 340], [200, 30], [60, 200]];
    var planche = /* @__PURE__ */ __name((x, y, w, r) => `<g transform="rotate(${r} ${x + w / 2} ${y})"><rect x="${x}" y="${y}" width="${w}" height="9" rx="2" fill="#8A6A48" stroke="${OUT}" stroke-width="1.8"/></g>`, "planche");
    var chaiseLongue = /* @__PURE__ */ __name((x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">${P("M-38,0 L38,0 L30,-16 L-30,-16 Z", "#E8E2D4", 2)}${[-24, -8, 8, 24].map((cx) => `<rect x="${cx - 4}" y="-15" width="8" height="15" fill="#3E78C8" opacity="0.8"/>`).join("")}${L([-30, -2], [-40, 18], OUT, 3)}${L([30, -2], [40, 18], OUT, 3)}</g>`, "chaiseLongue");
    var greveNuit = /* @__PURE__ */ __name((id, f, horizon = 250) => ciel(id, NUIT, horizon) + mer(horizon - 54, horizon, f) + nappe(horizon - 40, 0.2, f) + sable(horizon), "greveNuit");
    var SCENES2 = {};
    var S = /* @__PURE__ */ __name((id, o) => {
      SCENES2[id] = o;
    }, "S");
    S("00_carte", {
      titre: "La carte d’embarquement de l’Hirondelle",
      etapes: ["0a", "0b"],
      images: 2,
      ms: 900,
      fond: /* @__PURE__ */ __name((f) => ciel("c0", NUIT) + etoiles(ETOILES, f) + carte(false), "fond"),
      // la photo : l'avatar de face, découpé au buste dans le cadre de la photo
      avatar: { x: 140, y: 340, echelle: 2.7, vue: "face", pose: "repos", naufrage: false, cadre: CADRE_PHOTO2 }
    });
    S("00_tampon", {
      titre: "Embarqué : le vent emporte la carte",
      etapes: ["0c"],
      images: 3,
      ms: 500,
      fond: /* @__PURE__ */ __name((f) => {
        const [dx, dy, k] = [[0, 0, 1], [40, -30, 0.8], [130, -110, 0.45]][f];
        return ciel("c1", NUIT) + etoiles(ETOILES, f) + (f ? trait("M20,260 q60,-30 120,-10 q60,20 120,-20 M60,320 q70,-24 140,-4", "rgba(220,230,242,.45)", 3) : "") + `<g transform="translate(${200 + dx} ${200 + dy}) rotate(${f * 18}) scale(${k}) translate(-200 -200)">${carte(true)}</g>`;
      }, "fond"),
      avatar: null
    });
    S("01_pont", {
      titre: "Le pont de l’Hirondelle dans la tempête",
      etapes: ["1a"],
      images: 3,
      ms: 160,
      fond: /* @__PURE__ */ __name((f) => {
        let s = ciel("pc", TEMPETE, 260);
        s += mer(200, 300, f) + P(`M0,${230 - f * 3} Q90,${170 - f * 6} 170,${210 - f * 2} Q240,240 320,${200 - f * 4} Q370,180 400,210 L400,300 L0,300 Z`, "#203A5C", 2) + trait(`M80,${195 - f * 4} q30,-10 60,8 M250,${210 - f * 3} q30,-12 60,4`, "#9FB6CF", 3);
        s += P("M0,300 L400,300 L400,400 L0,400 Z", "#6B4E36", 2) + [318, 342, 370].map((y) => L([0, y], [400, y], "#5A3F2A", 2)).join("");
        s += `<rect x="330" y="20" width="12" height="285" fill="#C9B79A" stroke="${OUT}" stroke-width="2"/>`;
        const guirlande = /* @__PURE__ */ __name((x0, y0, x1, y1, ph) => {
          const cy = (y0 + y1) / 2 + 40 + [0, 10, -6][(f + ph) % 3];
          let g = P(`M${x0},${y0} Q${(x0 + x1) / 2},${cy} ${x1},${y1}`, "none", 1.6);
          for (let k = 1; k < 8; k++) {
            const t = k / 8, x = (1 - t) ** 2 * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t * t * y1;
            g += lueur(x, y + 6, 9, "255,220,140", 0.25) + E(x, y + 6, 3.4, 4.4, ["#FFD15A", "#F27A5A", "#7EC4E8", "#9BE07A"][k % 4], 1.2);
          }
          return g;
        }, "guirlande");
        s += guirlande(-10, 60, 336, 40, 0) + guirlande(-10, 130, 336, 110, 1);
        s += [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${i * 50 + 4}" y="250" width="7" height="58" fill="#EDE6D8" stroke="${OUT}" stroke-width="1.6"/>`).join("") + `<rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>` + E(84, 268, 22, 22, "#E8562E", 2.4) + E(84, 268, 11, 11, "#6B4E36", 2) + [0, 90, 180, 270].map((a) => `<rect x="80" y="246" width="8" height="10" fill="#F4EEDF" transform="rotate(${a + 45} 84 268)"/>`).join("");
        return s + pluie(f, 0.4);
      }, "fond"),
      devant: /* @__PURE__ */ __name((f) => pluie(f + 1, 0.25), "devant"),
      avatar: { x: 232, y: 352, echelle: 3.4, vue: "face", pose: "grelotter", naufrage: false }
    });
    S("01_vague", {
      titre: "La vague",
      etapes: ["1b"],
      images: 3,
      ms: 260,
      fond: /* @__PURE__ */ __name((f) => {
        const h = [130, 250, 440][f];
        let s = ciel("vg", TEMPETE) + `<rect x="0" y="250" width="400" height="150" fill="#6B4E36"/><rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>`;
        s += P(`M-20,420 L-20,${400 - h} Q120,${360 - h * 1.25} 260,${380 - h * 1.1} Q330,${388 - h * 1.15} 360,${410 - h} Q330,${420 - h * 0.9} 300,${426 - h * 0.86} L420,${430 - h * 0.7} L420,420 Z`, "#1E3A60", 3) + trait(`M10,${410 - h * 0.95} Q130,${370 - h * 1.15} 250,${392 - h * 1.05}`, "#9FB6CF", 4) + trait(`M260,${380 - h * 1.1} q60,-4 96,28`, "#E8F0F8", 5);
        return s + pluie(f, 0.35);
      }, "fond"),
      avatar: null
    });
    S("01_noir", {
      titre: "Le noir ; la mer, très loin",
      etapes: ["1b"],
      images: 2,
      ms: 1200,
      fond: /* @__PURE__ */ __name((f) => `<rect x="0" y="0" width="400" height="400" fill="#05080F"/>` + trait(`M60,${300 + f} q35,-3 70,0 t70,0 t70,0 t70,0`, "rgba(120,150,190,.35)", 2) + trait(`M120,${312 - f} q30,-2 60,0 t60,0 t60,0`, "rgba(120,150,190,.2)", 1.6), "fond"),
      avatar: null
    });
    S("01_greve", {
      titre: "La plage de Brumelune, la nuit, dans la brume",
      etapes: ["1c"],
      images: 3,
      ms: 400,
      fond: /* @__PURE__ */ __name((f) => ciel("gc", NUIT, 240) + lueur(300, 70, 60, "220,230,245", 0.25) + E(300, 70, 16, 16, "#DCE4EF", 0) + mer(190, 250, f) + nappe(200, 0.18, f) + sable(250) + planche(40, 296, 96, -8) + planche(300, 326, 70, 12) + chaiseLongue(300, 286, 168) + nappe(300, 0.14, f, 1.2), "fond"),
      devant: /* @__PURE__ */ __name((f) => nappe(370, 0.16, -f, 1.4), "devant"),
      avatar: { x: 200, y: 344, echelle: 3.6, vue: "face", pose: "grelotter", naufrage: true }
    });
    S("01_gilet", {
      titre: "Le gilet de sauvetage de l’Hirondelle",
      etapes: ["1d"],
      images: 3,
      ms: 420,
      fond: /* @__PURE__ */ __name((f) => {
        let s = ciel("gl", NUIT, 150) + mer(130, 214, f) + P("M0,214 Q200,200 400,210 L400,400 L0,400 Z", NUIT.sable, 2);
        s += P(`M0,${214 + f * 8} Q100,${206 + f * 9} 200,${218 + f * 6} Q300,${230 + f * 4} 400,${212 + f * 7} L400,208 Q200,198 0,212 Z`, "rgba(220,232,245,.5)", 0);
        s += `<g transform="translate(${272 - f * 4} ${318 - f * 6}) rotate(${-12 + f * 3}) scale(0.9)">` + P("M-60,-36 Q-62,-48 -40,-50 L-14,-50 Q-8,-30 0,-30 Q8,-30 14,-50 L40,-50 Q62,-48 60,-36 L56,34 Q56,46 40,46 L-40,46 Q-56,46 -56,34 Z", "#F28A2E", 3) + L([0, -30], [0, 46], "#C86A1E", 2) + `<rect x="-56" y="-4" width="112" height="9" fill="#E8E4DA" stroke="${OUT}" stroke-width="1.6"/>` + texte(0, 28, "L’HIRONDELLE", 10.5, "#3C2819", 'font-weight="bold" letter-spacing="0.6" opacity="0.75"') + "</g>";
        return s + nappe(170, 0.16, f);
      }, "fond"),
      avatar: { x: 128, y: 372, echelle: 3.6, vue: "avant", pose: "repos", naufrage: true }
    });
    S("02_lueur", {
      titre: "Une lueur erre dans la brume",
      etapes: ["2a"],
      images: 4,
      ms: 600,
      fond: /* @__PURE__ */ __name((f) => {
        const [bx, by] = [[300, 196], [262, 180], [292, 168], [330, 186]][f];
        return greveNuit("lu", f, 240) + lueur(bx, by - 10, 40, "200,225,240", 0.4) + brume(bx, by, 1.2, f) + nappe(232, 0.2, -f, 1.3);
      }, "fond"),
      devant: /* @__PURE__ */ __name((f) => nappe(370, 0.14, f, 1.4), "devant"),
      avatar: { x: 120, y: 384, echelle: 3.4, vue: "dos", pose: "repos", naufrage: true }
    });
    S("02_approche", {
      titre: "Brume approche d’un coup",
      etapes: ["2b"],
      images: 2,
      ms: 300,
      fond: /* @__PURE__ */ __name((f) => greveNuit("ap", f, 260) + lueur(270, 200, 110, "200,225,240", 0.4) + brume(270, 300, 3.8, f, "surpris"), "fond"),
      devant: /* @__PURE__ */ __name((f) => nappe(384, 0.14, f, 1.4), "devant"),
      avatar: { x: 108, y: 376, echelle: 3.6, vue: "avant", pose: "repos", naufrage: true }
    });
    S("02_rocher", {
      titre: "Brume se cache derrière un rocher",
      etapes: ["2c"],
      images: 2,
      ms: 500,
      fond: /* @__PURE__ */ __name((f) => greveNuit("ro", f) + lueur(290, 186, 60, "200,225,240", 0.4) + brume(290, 200 - f * 4, 2.4, f, "gene") + rocher(216, 300, 160, 86), "fond"),
      avatar: { x: 116, y: 366, echelle: 3.4, vue: "avant", pose: "repos", naufrage: true }
    });
    var TOUR = [[300, 250, 0], [214, 152, 0], [100, 262, 0], [222, 330, 1]];
    S("02_examine", {
      titre: "Brume tourne autour de l’avatar",
      etapes: ["2d"],
      images: 4,
      ms: 260,
      fond: /* @__PURE__ */ __name((f) => greveNuit("ex", f) + (TOUR[f][2] ? "" : lueur(TOUR[f][0], TOUR[f][1] - 26, 50, "200,225,240", 0.4) + brume(TOUR[f][0], TOUR[f][1], 2.2, f, "surpris")), "fond"),
      devant: /* @__PURE__ */ __name((f) => TOUR[f][2] ? lueur(TOUR[f][0], TOUR[f][1] - 26, 50, "200,225,240", 0.4) + brume(TOUR[f][0], TOUR[f][1], 2.4, f, "surpris") : "", "devant"),
      avatar: { x: 200, y: 364, echelle: 3.6, vue: "face", pose: "grelotter", naufrage: true }
    });
    S("02_yeux", {
      titre: "Brume, à hauteur des yeux",
      etapes: ["2e"],
      images: 4,
      ms: 220,
      fond: /* @__PURE__ */ __name((f) => ciel("by", { ciel: "#141C36", cielBas: "#2E3C5C" }) + nappe(260, 0.2, f) + nappe(340, 0.16, -f) + lueur(250, 170, 150, "200,220,235", 0.35), "fond"),
      devant: /* @__PURE__ */ __name((f) => brume(250, 192, 5.4, f), "devant"),
      avatar: { x: 120, y: 470, echelle: 6.4, vue: "dos", pose: "repos", naufrage: true }
    });
    S("02_village", {
      titre: "Là, il y avait un village",
      etapes: ["2f"],
      images: 3,
      ms: 420,
      fond: /* @__PURE__ */ __name((f) => ciel("vi", NUIT, 260) + sable(250) + lueur(200, 210, 170 + f * 8, "210,230,240", 0.3) + ruines() + nappe(236, 0.26 - f * 0.06, f) + nappe(300, 0.18 - f * 0.04, -f, 1.2) + brume(226, 150, 2.2, f), "fond"),
      avatar: { x: 336, y: 396, echelle: 3.2, vue: "dos", miroir: true, pose: "repos", naufrage: true }
    });
    S("02_epave", {
      titre: "L’épave, à peine visible",
      etapes: ["2g"],
      images: 3,
      ms: 500,
      fond: /* @__PURE__ */ __name((f) => ciel("ep", NUIT, 220) + mer(170, 260, f) + epave(270, 192, 0.9, 0.5) + nappe(186, 0.32, f) + nappe(214, 0.24, -f) + sable(260) + brume(176, 232, 2, f, "triste"), "fond"),
      avatar: { x: 110, y: 384, echelle: 3.4, vue: "dos", pose: "repos", naufrage: true }
    });
    S("02_proche", {
      titre: "Brume, toute petite, tout près",
      etapes: ["2h"],
      images: 4,
      ms: 260,
      fond: /* @__PURE__ */ __name((f) => greveNuit("pr", f) + lueur(258, 252, 46, "200,225,240", 0.45), "fond"),
      devant: /* @__PURE__ */ __name((f) => brume(258, 272, 1.3, f, "content"), "devant"),
      avatar: { x: 200, y: 376, echelle: 3.8, vue: "face", pose: "repos", naufrage: true }
    });
    S("03_livre", {
      titre: "Le livre aux sept sceaux",
      etapes: ["3a"],
      images: 3,
      ms: 360,
      fond: /* @__PURE__ */ __name((f) => greveNuit("li", f) + rocher(214, 330, 180, 140) + E(318, 262, 32, 20, "#1A1E2B", 2) + grimoire(316 - f * 16, 264 + f * 6, 0.9 + f * 0.08, -6 + f * 5) + brume(268 - f * 12, 266, 2.2, f, f ? "gene" : "neutre"), "fond"),
      avatar: { x: 108, y: 384, echelle: 3.4, vue: "avant", pose: "repos", naufrage: true }
    });
    S("03_vent", {
      titre: "Le vent chasse la brume",
      etapes: ["3e"],
      images: 3,
      ms: 420,
      fond: /* @__PURE__ */ __name((f) => {
        const a = [0.5, 0.28, 0.08][f];
        let s = ciel("ve", NUIT, 220) + lueur(80, 60, 40, "220,230,245", 0.25) + E(80, 60, 12, 12, "#DCE4EF", 0) + mer(170, 240, f) + epave(300, 186, 0.8, 0.4 + f * 0.25) + sable(240) + planche(40, 282, 80, -10) + planche(290, 304, 60, 8) + rocher(4, 276, 76, 44) + rocher(330, 262, 70, 34);
        s += nappe(200, a, f * 2) + nappe(260, a, f * 3, 1.3) + nappe(330, a * 0.8, f * 4, 1.2);
        return s + [0, 1, 2].map((i) => trait(`M${-40 + f * 60 + i * 30},${110 + i * 60} q60,-16 120,0 q30,8 60,-6`, "rgba(230,240,250,.55)", 3)).join("");
      }, "fond"),
      avatar: { x: 200, y: 364, echelle: 3, vue: "dos", pose: "repos", naufrage: true }
    });
    S("05_feu", {
      titre: "Le feu prend",
      etapes: ["5d"],
      images: 4,
      ms: 300,
      fond: /* @__PURE__ */ __name((f) => ciel("fe", NUIT, 240) + mer(180, 240, f) + epave(330, 204, 0.6, 0.6) + sable(240) + nappe(234, 0.28 - f * 0.06, f) + nappe(304, 0.24 - f * 0.06, -f, 1.2) + feu(222, 334, 1.8, f, [0, 1, 2, 2][f]) + brume(270 - f * 4, 300, 1.8, f, f > 1 ? "content" : "neutre"), "fond"),
      avatar: { x: 118, y: 368, echelle: 3.3, vue: "avant", pose: "repos", naufrage: true }
    });
    S("06_silhouette", {
      titre: "Une silhouette sur les rochers",
      etapes: ["6h"],
      images: 3,
      ms: 300,
      fond: /* @__PURE__ */ __name((f) => ciel("si", NUIT, 230) + etoiles(ETOILES.slice(0, 6), f) + mer(170, 230, f) + nappe(200, 0.2, f) + sable(230) + rocher(270, 236, 120, 70) + P("M330,164 L331,140 Q332,132 340,131 Q348,132 349,140 L350,164 L345,164 L344,150 L336,150 L335,164 Z", "#0C101C", 0) + E(340, 124, 5.6, 6.2, "#0C101C", 0) + trait("M331,162 L332,140 Q333,133 339,132 M335.2,121 Q336,119 338,118.4", "rgba(255,190,120,.6)", 1.2) + feu(176, 336, 1.6, f) + brume(226, 300, 1.5, f, "surpris"), "fond"),
      avatar: { x: 96, y: 388, echelle: 3, vue: "dos", pose: "repos", naufrage: true }
    });
    S("07_cannelle", {
      titre: "Cannelle sort de la brume",
      etapes: ["7a"],
      images: 4,
      ms: 260,
      fond: /* @__PURE__ */ __name((f) => ciel("ca", AUBE, 230) + lueur(330, 214, 90, "255,210,170", 0.4) + mer(180, 230, f, AUBE) + sable(230, AUBE) + feu(150, 336, 1.2, f, 1) + poser(frame(T.Cannelle.nau, "se", "marche", f * 2), 296, 326, 2.8) + nappe(276, 0.34 - f * 0.05, f, 1.2, AUBE), "fond"),
      avatar: { x: 92, y: 392, echelle: 3, vue: "avant", pose: "salut", naufrage: true }
    });
    S("07_souvenir", {
      titre: "Le souvenir de Cannelle revient",
      etapes: ["7b"],
      images: 4,
      ms: 300,
      fond: /* @__PURE__ */ __name((f) => ciel("so", AUBE, 230) + mer(180, 230, f, AUBE) + sable(230, AUBE) + feu(156, 336, 1.2, f, 2) + lueur(272, 260, 60 + f * 20, "255,220,120", 0.25 + f * 0.1) + poser(frame(f < 2 ? T.Cannelle.nau : T.Cannelle.base, "se", "repos", f % 2, f === 3 ? "content" : "neutre"), 272, 334, 2.8) + [[232, 196], [312, 206], [244, 290], [306, 282]].slice(0, f + 1).map(([x, y]) => etincelle(x, y, 2.4)).join(""), "fond"),
      avatar: { x: 84, y: 394, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    S("09_rivet", {
      titre: "Rivet sous sa voile",
      etapes: ["9b"],
      images: 2,
      ms: 700,
      fond: /* @__PURE__ */ __name((f) => {
        let s = ciel("ri", JOUR, 220) + mer(160, 220, f, JOUR) + sable(220, JOUR);
        s += P("M150,330 L300,330 L292,346 L160,346 Z", "rgba(60,50,30,.16)", 0) + L([300, 336], [272, 150], OUT, 7) + L([300, 336], [272, 150], "#C9A26E", 4.4) + P(`M272,152 Q${206 + f * 5},${176 - f * 3} 142,${250 + f * 3} L156,336 L300,336 Z`, "#F0E6D0", 2.4) + trait("M186,206 L244,300", "#D8CCB0", 2) + L([142, 250 + f * 3], [120, 340], "#B8A888", 1.4);
        s += poser(frame(T.Rivet.nau, "front", "action", f), 222, 338, 2.4);
        s += P("M176,374 L268,374 L262,348 L182,348 Z", "#7A4E2C", 2) + P("M182,348 L262,348 L256,330 L188,330 Z", "#5A3A24", 2) + [[194, 2.2], [210, 2.6], [228, 3], [246, 3.4]].map(([x, r], i) => E(x, 362, r, r * 0.6, "#B8BCC4", 0.8) + E(x, 366 - i % 2, r * 0.8, r * 0.5, "#9AA0A8", 0.8)).join("");
        return s;
      }, "fond"),
      avatar: { x: 76, y: 388, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    S("10_aster", {
      titre: "Aster tire une caisse des vagues",
      etapes: ["10b"],
      images: 3,
      ms: 360,
      fond: /* @__PURE__ */ __name((f) => {
        let s = ciel("as", JOUR, 190) + mer(150, 300, f, JOUR) + poser(frame(T.Aster.nau, "se", "marche", f * 2, "soulage"), 262, 332, 2.6);
        s += trait(`M166,${262 + f} Q206,${252 - f * 2} 236,262`, "#D8C08A", 2.6) + `<g transform="translate(${144 + f * 4} ${264 + [0, 3, 0][f]}) rotate(${[-6, 4, -2][f]})"><rect x="-24" y="-20" width="48" height="34" fill="#9A6E44" stroke="${OUT}" stroke-width="2.2"/>${[-8, 4].map((y) => L([-24, y], [24, y], "#7A5434", 2)).join("")}</g>`;
        s += `<rect x="0" y="${276 + f * 2}" width="400" height="60" fill="${JOUR.mer}" opacity="0.92"/>` + trait(`M0,${278 + f * 2} q25,-6 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0`, JOUR.ecume, 3);
        return s + P("M0,326 Q200,312 400,322 L400,400 L0,400 Z", JOUR.sable, 2) + P(`M0,${328 - f * 2} Q200,${314 - f * 3} 400,${324 - f * 2} L400,322 Q200,312 0,326 Z`, "rgba(255,255,255,.6)", 0);
      }, "fond"),
      avatar: { x: 76, y: 396, echelle: 3, vue: "avant", pose: "salut", naufrage: true }
    });
    var MATIN = { ciel: "#86BCE4", cielBas: "#FCE3C2", mer: "#4F93C0", merH: "#79B4DA", ecume: "#F6FBFD", sable: "#EBD6A8", mouille: "#D2B985" };
    function plageMatin(id, f) {
      let s = ciel(id, MATIN, 196);
      s += lueur(78, 190, 110, "255,226,170", 0.55) + `<circle cx="78" cy="190" r="24" fill="#FFE9A8"/><circle cx="78" cy="190" r="17" fill="#FFF6D2"/>`;
      for (const [x, y, k] of [[250, 92, 1], [118, 58, 0.7]]) s += P(`M${x - 46 * k},${y} Q${x - 44 * k},${y - 16 * k} ${x - 22 * k},${y - 14 * k} Q${x - 10 * k},${y - 30 * k} ${x + 12 * k},${y - 20 * k} Q${x + 34 * k},${y - 26 * k} ${x + 40 * k},${y - 8 * k} Q${x + 54 * k},${y - 6 * k} ${x + 48 * k},${y} Z`, "#FBE6E4", 1.6) + trait(`M${x - 36 * k},${y - 4} Q${x},${y - 1} ${x + 40 * k},${y - 4}`, "#F2C2B8", 2);
      s += mer(196, 262, f, MATIN);
      s += [0, 1, 2, 3, 4].map((i) => {
        const y = 202 + i * 12, w = 12 + i * 8;
        return `<path d="M${78 - w + (f + i) % 2 * 4},${y} l${w * 2},0" stroke="#FFF1C4" stroke-width="${2.4 - i * 0.3}" stroke-linecap="round" opacity="${0.85 - i * 0.12}"/>`;
      }).join("");
      s += ponton(f);
      s += P("M0,262 Q120,254 230,260 Q320,266 400,256 L400,400 L0,400 Z", MATIN.mouille, 2);
      s += P(`M0,${266 + f * 3} Q60,${258 + f * 2} 120,${264 + f * 3} Q190,${270 + f * 2} 250,${262 + f * 3} Q320,${256 + f * 2} 400,${262 + f * 3} L400,256 Q320,266 230,260 Q120,254 0,262 Z`, "rgba(255,255,255,.75)", 0) + trait(`M0,${268 + f * 3} Q60,${261 + f * 2} 120,${266 + f * 3} Q190,${272 + f * 2} 250,${264 + f * 3} Q320,${258 + f * 2} 400,${264 + f * 3}`, "#FFFFFF", 2);
      s += P("M0,300 Q90,288 200,294 Q300,300 400,288 L400,400 L0,400 Z", MATIN.sable, 2);
      s += [[34, 344, 7], [372, 330, 9], [168, 392, 6]].map(([x, y, r]) => E(x, y, r, r * 0.6, "#B8AE9E", 1.6) + E(x - r * 0.3, y - r * 0.2, r * 0.35, r * 0.2, "#D8D0C2", 0)).join("");
      s += coquille(318, 318, 1.6) + coquille(58, 380, 1.3) + etoileMer(262, 384, 9, 18);
      return s;
    }
    __name(plageMatin, "plageMatin");
    function ponton(f) {
      let s = "";
      for (const [x, y0, y1] of [[300, 236, 276], [334, 230, 272], [370, 224, 268], [404, 218, 262]]) s += L([x, y0], [x, y1], OUT, 7) + L([x, y0], [x, y1], "#8A6440", 4.2);
      s += P("M288,262 L296,232 L412,212 L412,228 Z", "#C49A6A", 2) + P("M288,262 L412,228 L412,234 L288,268 Z", "#9C7448", 2);
      s += [0.2, 0.4, 0.6, 0.8].map((k) => L([296 + (288 - 296) * 0 + k * 116 - 2, 232 - k * 20 + 1], [288 + k * 124, 262 - k * 34], "#A97E52", 1.2)).join("");
      s += L([300, 232], [300, 206], OUT, 4.4) + L([300, 232], [300, 206], "#8A6440", 2.4) + L([372, 218], [372, 192], OUT, 4.4) + L([372, 218], [372, 192], "#8A6440", 2.4) + trait("M300,210 Q336,214 372,196", OUT, 3.2) + trait("M300,210 Q336,214 372,196", "#D8BC84", 1.6);
      s += L([372, 192], [372, 168], OUT, 3.4) + L([372, 192], [372, 168], "#8A6440", 1.6) + P(`M372,168 Q${384},${170 - f * 2} 394,${168 + f} L386,175 L394,${182 + f} Q384,${180 - f * 2} 372,181 Z`, "#C8463A", 1.6);
      return s;
    }
    __name(ponton, "ponton");
    var coquille = /* @__PURE__ */ __name((x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${P("M-5,2 L-6,-2 Q-6,-7 0,-8 Q6,-7 6,-2 L5,2 Z", "#F6E2D0", 1.2)}${[-3.4, -1.2, 1.2, 3.4].map((d) => L([d * 0.3, 1], [d, -6 + Math.abs(d) * 0.4], "#D9A98C", 0.8)).join("")}${P("M-2.6,2.4 L-1.2,0.6 L1.2,0.6 L2.6,2.4 Z", "#EBC9B2", 1)}</g>`, "coquille");
    var etoileMer = /* @__PURE__ */ __name((x, y, r, rot) => `<g transform="rotate(${rot} ${x} ${y})">${P("M" + Array.from({ length: 10 }, (_, i) => {
      const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      return `${r22(x + Math.cos(a) * rr)},${r22(y + Math.sin(a) * rr)}`;
    }).join(" L") + " Z", "#F2995A", 1.4)}${[[0, -0.5], [0.45, 0.1], [-0.45, 0.1], [0, 0.4]].map(([dx, dy]) => E(x + dx * r, y + dy * r, 0.9, 0.9, "#FFD9B3", 0)).join("")}</g>`, "etoileMer");
    function plancheScene(x0, x1, y) {
      const DT = "#DCCBAA", DL = "#C2AF8C", DR = "#9E8C6C";
      let s = E((x0 + x1) / 2 + 6, y + 18, (x1 - x0) / 2 + 12, 9, "rgba(90,70,40,.22)", 0);
      s += P(`M${x0},${y} L${x1},${y} L${x1 - 2},${y + 12} L${x0 + 2},${y + 12} Z`, DL, 2);
      s += [[x0 + 30, x1 - 14], [x0 + 46, x1 - 2]].map(([a, b], i) => L([a + i * 34, y + 6], [b - 120 + i * 30, y + 6], "#3E5A8C", 3)).join("");
      s += P(`M${x0 + 10},${y - 16} L${x1 - 18},${y - 16} L${x1 - 10},${y - 10} L${x0 + 2},${y - 10} L${x0 - 2},${y - 13} L${x0 + 4},${y - 14} Z`, DT, 1.6) + P(`M${x0 + 2},${y - 10} L${x1 - 6},${y - 10} L${x1 - 2},${y - 5} L${x0},${y - 5} Z`, DT, 1.6) + P(`M${x0},${y - 5} L${x1 - 2},${y - 5} L${x1},${y} L${x0},${y} Z`, DT, 1.6);
      s += [[x0 + 24, y - 12], [x0 + 90, y - 7], [x0 + 150, y - 3]].map(([a, b]) => L([a, b], [a + 40, b], DR, 0.9)).join("");
      for (const x of [x0 + 26, x1 - 34]) s += P(`M${x},${y - 17} L${x + 9},${y - 17} L${x + 11},${y + 1} L${x + 2},${y + 1} Z`, "#B39E7C", 1.6) + [y - 13, y - 8, y - 3].map((yy) => E(x + 5.6, yy, 1, 0.7, "#6E6258", 0)).join("");
      s += trait(`M${x1 - 6},${y - 12} Q${x1 + 4},${y - 4} ${x1 - 4},${y + 10}`, OUT, 4) + trait(`M${x1 - 6},${y - 12} Q${x1 + 4},${y - 4} ${x1 - 4},${y + 10}`, "#C9A66B", 2.2) + trait(`M${x1 - 2},${y + 8} Q${x1 + 16},${y + 14} ${x1 + 12},${y + 22} Q${x1 + 8},${y + 28} ${x1 + 22},${y + 30}`, OUT, 3.6) + trait(`M${x1 - 2},${y + 8} Q${x1 + 16},${y + 14} ${x1 + 12},${y + 22} Q${x1 + 8},${y + 28} ${x1 + 22},${y + 30}`, "#C9A66B", 1.8);
      s += P(`M${x0 + 6},${y - 12} Q${x0 - 8},${y - 4} ${x0 - 4},${y + 8} Q${x0},${y + 18} ${x0 - 12},${y + 24} Q${x0 + 4},${y + 22} ${x0 + 6},${y + 10} Q${x0 + 8},${y} ${x0 + 14},${y - 8} Z`, "#86913F", 1.6) + trait(`M${x0 + 10},${y - 9} Q${x0},${y + 2} ${x0 - 4},${y + 18}`, "#B4BE6A", 1) + E(x0 - 1, y + 6, 2.4, 1.8, "#B79D4C", 1.1);
      return s;
    }
    __name(plancheScene, "plancheScene");
    function ondinCouche(n, x, y, k) {
      const corps = frame(T.Ondin.nau, "front", "repos", 0, "endormi").replace(ZEDS, "");
      return `<g transform="translate(${x} ${y}) scale(${k})"><g transform="translate(0 48) rotate(-90)">${corps}</g></g><g transform="translate(${x} ${y}) scale(${k})">${n ? zee(18, 2.4, 2) + zee(21.4, -1.6, 2.6) : zee(17.4, 3.4, 1.8) + zee(20.4, -0.4, 2.4)}</g>`;
    }
    __name(ondinCouche, "ondinCouche");
    S("11_ondin", {
      titre: "Ondin endormi sur sa planche, échouée sur la plage",
      etapes: ["11a"],
      images: 2,
      ms: 900,
      fond: /* @__PURE__ */ __name((f) => {
        let s = plageMatin("on", f) + plancheScene(110, 300, 340);
        s += ondinCouche(f, 112, 236, 2.9);
        s += bocalVide(340, 364);
        return s;
      }, "fond"),
      avatar: { x: 52, y: 396, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    function ondinAssis(n) {
      const pose = {
        ...DORT.Ondin,
        tilt: n ? 9 : 5,
        hy: 0.4,
        back: /* @__PURE__ */ __name(() => rod([40.6, 61.6], [44.4, 40.2]), "back"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [14.6, 57.6], [12.4, 50.8]) + arm(cc, r, [n ? 28.6 : 29.4, n ? 26.6 : 27.6], [36.6, 42.6]), "arms"),
        face: /* @__PURE__ */ __name(() => "", "face"),
        front: /* @__PURE__ */ __name(() => "", "front")
      };
      return seated(T.Ondin.nau, n, pose).replace(ZEDS, "");
    }
    __name(ondinAssis, "ondinAssis");
    var etourdi = /* @__PURE__ */ __name((x, y, n) => `<g transform="rotate(${n ? 14 : -10} ${x} ${y})">${trait(`M${x - 16},${y} Q${x - 16},${y - 9} ${x},${y - 9} Q${x + 16},${y - 9} ${x + 16},${y} Q${x + 16},${y + 7} ${x + 2},${y + 7} Q${x - 8},${y + 7} ${x - 8},${y} Q${x - 8},${y - 4} ${x},${y - 4}`, "#FFFFFF", 4.4)}${trait(`M${x - 16},${y} Q${x - 16},${y - 9} ${x},${y - 9} Q${x + 16},${y - 9} ${x + 16},${y} Q${x + 16},${y + 7} ${x + 2},${y + 7} Q${x - 8},${y + 7} ${x - 8},${y} Q${x - 8},${y - 4} ${x},${y - 4}`, "#8EAAD2", 2.2)}</g>` + [[n ? -22 : 20, n ? -2 : -6], [n ? 20 : -20, n ? -8 : 2]].map(([dx, dy]) => etincelle(x + dx, y + dy, 2)).join(""), "etourdi");
    var bocalVide = /* @__PURE__ */ __name((x, y) => E(x + 2, y + 12, 22, 4, "rgba(90,70,40,.18)", 0) + `<g transform="rotate(-78 ${x} ${y})">${P(`M${x - 11},${y - 13} L${x + 11},${y - 13} Q${x + 15},${y - 10} ${x + 14},${y} L${x + 13},${y + 12} Q${x},${y + 18} ${x - 13},${y + 12} L${x - 14},${y} Q${x - 15},${y - 10} ${x - 11},${y - 13} Z`, "rgba(214,236,242,.82)", 2)}` + trait(`M${x - 8},${y - 6} L${x - 8},${y + 8}`, "#FFFFFF", 3) + trait(`M${x - 3},${y - 8} L${x - 3},${y - 2}`, "#FFFFFF", 1.6) + P(`M${x - 12},${y - 18} L${x + 12},${y - 18} L${x + 11},${y - 12} L${x - 11},${y - 12} Z`, "#CFE6EE", 1.8) + `</g><g transform="rotate(20 ${x + 26} ${y + 6})">${P(`M${x + 20},${y + 2} L${x + 32},${y + 2} L${x + 31},${y + 10} L${x + 21},${y + 10} Z`, "#B07E4C", 1.6)}${L([x + 23, y + 5], [x + 29, y + 5], "#D2A070", 1)}</g>` + E(x - 12, y + 10, 9, 2.6, "rgba(180,215,232,.7)", 0), "bocalVide");
    S("11_reveil", {
      titre: "Ondin, assis sur sa planche, se frotte les yeux",
      etapes: ["11b"],
      images: 2,
      ms: 600,
      fond: /* @__PURE__ */ __name((f) => plageMatin("rv", f) + plancheScene(110, 300, 340) + poser(ondinAssis(f), 196, 352, 3) + bocalVide(340, 364) + etourdi(200, 196, f), "fond"),
      avatar: { x: 52, y: 396, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    var SOIR = { ciel: "#6E5E9A", cielBas: "#F2B48A" };
    function puitsChantier(x, y, e) {
      const bois = /* @__PURE__ */ __name((a, b, w) => L(a, b, OUT, w + 2.4) + L(a, b, "#B07A45", w), "bois");
      const hm = e >= 2 ? 50 : 36;
      let s = E(x, y + 4, 70, 14, "rgba(40,55,20,.22)", 0);
      if (e < 3) {
        const pq = [[x - 70, y + 8], [x + 70, y + 8], [x - 56, y - 14], [x + 56, y - 14]];
        s += trait(`M${pq[2][0]},${pq[2][1] - 12} L${pq[0][0]},${pq[0][1] - 12} L${pq[1][0]},${pq[1][1] - 12} L${pq[3][0]},${pq[3][1] - 12}`, "#F2E4C0", 1.6) + pq.map(([px, py]) => bois([px, py], [px, py - 20], 3)).join("") + [[x - 63, y - 4, "#E2574C"], [x + 63, y - 4, "#F2C04B"], [x, y - 4, "#6FA3D9"]].map(([fx, fy, c]) => P(`M${fx - 4},${fy} L${fx + 4},${fy} L${fx},${fy + 7} Z`, c, 1.2)).join("");
      }
      s += `<rect x="${x - 50}" y="${y - hm}" width="100" height="${hm}" fill="#9A968E" stroke="${OUT}" stroke-width="2.4"/>` + E(x, y, 50, 12, "#9A968E", 2.4) + `<rect x="${x - 48.8}" y="${y - hm + 1}" width="97.6" height="${hm - 2}" fill="#9A968E"/>` + Array.from({ length: Math.round(hm / 14) }, (_, i) => L([x - 50, y - 14 * (i + 1)], [x + 50, y - 14 * (i + 1)], "#7C7A72", 1.4)).join("") + [[-30, 7], [6, 21], [-12, 35], [26, 7], [34, 35]].filter(([, yy]) => yy < hm).map(([dx, yy]) => L([x + dx, y - yy], [x + dx, y - yy + 14], "#7C7A72", 1.4)).join("") + E(x, y - hm, 50, 13, "#B8B4AA", 2.4) + E(x, y - hm + 1, 40, 9, "#1E3552", 1.6) + E(x - 10, y - hm + 1, 14, 3, "#3E6E9A", 0);
      if (e === 0) return s;
      s += bois([x - 46, y - hm + 4], [x - 46, y - 136], 6) + bois([x + 46, y - hm + 4], [x + 46, y - 136], 6);
      if (e < 3) s += bois([x + 86, y + 6], [x + 52, y - 120], 3) + bois([x + 100, y + 4], [x + 64, y - 118], 3) + [0.2, 0.4, 0.6, 0.8].map((t) => bois([x + 86 - 34 * t, y + 6 - 126 * t], [x + 100 - 36 * t, y + 4 - 122 * t], 2)).join("");
      if (e === 1) return s;
      s += bois([x - 58, y - 136], [x + 58, y - 136], 7) + E(x, y - 124, 10, 10, "#8A6A48", 2.2) + E(x, y - 124, 3, 3, "#5E3F26", 0) + L([x, y - 136], [x, y - 124], OUT, 3);
      if (e === 2) return s;
      const seau = /* @__PURE__ */ __name((sx, sy) => P(`M${sx - 11},${sy} L${sx + 11},${sy} L${sx + 8},${sy + 18} L${sx - 8},${sy + 18} Z`, "#8A6A48", 2) + L([sx - 10, sy + 6], [sx + 10, sy + 6], "#5E3F26", 1.6) + E(sx, sy, 11, 3.4, "#7EC4E8", 1.6) + trait(`M${sx - 11},${sy} Q${sx},${sy - 12} ${sx + 11},${sy}`, OUT, 1.6), "seau");
      s += L([x + 10, y - 124], [x + 10, y - 88], "#F2E4C0", 2) + seau(x + 10, y - 88) + seau(x - 28, y - hm - 10);
      s += P(`M${x},${y - 168} L${x - 12},${y - 140} L${x + 12},${y - 140} Z`, "#4F9A4C", 2) + P(`M${x},${y - 158} L${x - 8},${y - 146} L${x + 8},${y - 146} Z`, "#86C774", 0) + [["#E2574C", -10], ["#F2C04B", 0], ["#6FA3D9", 10]].map(([c, dx]) => trait(`M${x + dx * 0.3},${y - 144} q${dx * 1.2},2 ${dx * 2.4},10`, c, 2.4)).join("");
      return s + [[x - 70, y - 150], [x + 74, y - 160], [x - 30, y - 186], [x + 40, y - 192]].map(([sx, sy]) => etincelle(sx, sy, 2.6)).join("");
    }
    __name(puitsChantier, "puitsChantier");
    S("12_chantier", {
      titre: "Le chantier, puis le Puits agrandi",
      etapes: ["12c"],
      images: 4,
      ms: 900,
      fond: /* @__PURE__ */ __name((f) => ciel("ch", SOIR, 200) + lueur(330, 190, 70, "255,200,150", 0.3) + P("M0,200 L400,200 L400,400 L0,400 Z", "#7EB45E", 2) + [[30, 222], [92, 210], [370, 214]].map(([x, y]) => E(x, y, 24, 13, "#5E9A42", 1.6)).join("") + puitsChantier(196, 330, f) + poser(f < 3 ? frame(avecReparer(T.Ondin.base), "se", "action", f % 2) : frame(T.Ondin.base, "se", "salut", 1, "content"), 330, 360, 2.8), "fond"),
      avatar: { x: 70, y: 394, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    var veilleeFond = /* @__PURE__ */ __name((f, [tx, ty] = [352, 330]) => ciel("vc", { ciel: "#0F1630", cielBas: "#2A3758" }, 250) + mer(170, 215, f) + nappe(205, 0.16, f) + sable(215) + lucioles([[40, 190], [80, 176], [350, 186], [372, 200], [20, 210]], f) + `<g transform="translate(${tx} ${ty}) scale(1.6)">${torche("allumee", f % 3)}</g>`, "veilleeFond");
    var pouleEndormie = /* @__PURE__ */ __name((x, y, s, [c, cs], m = 1) => `<g transform="translate(${x} ${y}) scale(${r22(s * m)} ${s})">` + E(0, 1, 11, 3, "rgba(0,0,0,.18)", 0) + P("M-9,-2 Q-14,-8 -12,-12 Q-8,-9 -6,-6 Z", cs, 1) + E(0, -5, 9.6, 7, c, 1.2) + P("M-5,-6 Q0,-9 5,-5", "none", 0.9) + E(6.4, -10, 4.4, 4, c, 1.1) + P("M4.4,-13.6 Q5.4,-16.6 6.8,-14 Q8,-16 8.8,-13.4 Z", "#D8443A", 0.7) + P("M10.4,-10 L12.4,-9.2 L10.4,-8.4 Z", "#F2B640", 0.6) + P("M6.8,-10.6 Q7.8,-9.8 8.8,-10.6", "none", 0.7) + "</g>", "pouleEndormie");
    S("12_veillee", {
      titre: "La première veillée : cinq visages et Brume",
      etapes: ["12k"],
      images: 4,
      ms: 180,
      // en cercle autour du feu : Rivet et Aster derrière (de face), Cannelle et Ondin à droite, tournés vers le feu ;
      // Brume au-dessus ; l'avatar au premier plan à gauche, de dos
      // la torche à gauche, derrière les poules : à droite, Cannelle la cachait
      fond: /* @__PURE__ */ __name((f) => veilleeFond(f, [56, 250]) + pouleEndormie(40, 262, 1.2, ["#C8743A", "#A85A2A"]) + pouleEndormie(66, 256, 1.1, ["#F4EEDF", "#D8CFBE"], -1) + poser(frame(T.Rivet.base, "front", "repos", f % 2), 140, 282, 2.3) + poser(frame(T.Aster.base, "front", "repos", (f + 1) % 2), 262, 282, 2.3) + feu(200, 318, 1.7, f) + brume(200, 150, 2.6, f) + poser(frame(T.Cannelle.base, "se", "repos", f % 2), 338, 330, 2.5) + poser(frame(T.Ondin.base, "se", "repos", (f + 1) % 2), 282, 372, 2.6), "fond"),
      avatar: { x: 104, y: 404, echelle: 2.9, vue: "dos", pose: "repos", naufrage: false }
    });
    var habits = /* @__PURE__ */ __name(([x, y]) => P(`M${r22(x - 6.6)},${r22(y + 7.6)} L${r22(x + 6.6)},${r22(y + 7.6)} L${r22(x + 6)},${r22(y + 3.6)} L${r22(x - 6)},${r22(y + 3.6)} Z`, "#E8C07A", 0.9) + P(`M${r22(x - 6)},${r22(y + 3.6)} L${r22(x + 6)},${r22(y + 3.6)} L${r22(x + 5)},${r22(y)} L${r22(x - 5)},${r22(y)} Z`, "#6E8EB4", 0.9) + trait(`M${r22(x - 3)},${r22(y + 5.6)} l1,0.7 l1,-0.7 l1,0.7 l1,-0.7`, "#B8483A", 0.5), "habits");
    S("12_habits", {
      titre: "Les habits recousus",
      etapes: ["12l"],
      images: 2,
      ms: 600,
      fond: /* @__PURE__ */ __name((f) => veilleeFond(f) + feu(126, 320, 1.5, f) + brume(162, 186, 2.2, f, "content") + poser(frame(T.Cannelle.base, "se", "repos", f, "content") + habits([13.6, 47.4]), 284, 356, 3), "fond"),
      avatar: { x: 150, y: 398, echelle: 3, vue: "avant", pose: "repos", naufrage: true }
    });
    var RYTHME_AVATAR = { grelotter: 320, repos: 900 };
    for (const [id, a] of Object.entries(require_scenes7()({ carte, tamponSeul, texte, planche, chaiseLongue, ruines, grimoire, avatarDe: /* @__PURE__ */ __name((id2) => SCENES2[id2].avatar, "avatarDe") }))) {
      const sc = SCENES2[id];
      SCENES2[id] = { ...sc, images: 1, ms: sc.avatar ? RYTHME_AVATAR[sc.avatar.pose] : 1e3, fond: a.fond, devant: a.devant };
      if (!a.devant) delete SCENES2[id].devant;
    }
    var O = require_ouverture();
    var OUVERTURE = [
      ["01_racines", "01_vague", "Sous la surface, les racines", ["1b"], O.racines01, null],
      ["01_paupieres", "01_noir", "Les paupières qui battent ; la plage au couchant", ["1c"], O.paupieres01, null],
      ["01_carte", "01_greve", "Quelque chose de blanc sur le sable : la carte d’embarquement trempée", ["1d"], O.carte01, null],
      ["02_plage", "01_gilet", "Face à la mer, au couchant", ["2a"], O.plage02, { x: 144, y: 376, echelle: 3, vue: "dos", pose: "repos", naufrage: true }],
      ["03_ciel", "03_vent", "Brume lève les yeux vers le ciel", ["3"], O.ciel03, null],
      ["05_cercle", "03_vent", "Le cercle de pierres noircies ; au large, l’épave dans la brume", ["5"], O.cercle05, { x: 136, y: 386, echelle: 3, vue: "avant", pose: "repos", naufrage: true }],
      ["10_epave", "09_rivet", "Le matin d’Hermine : l’épave contre les rochers", ["10"], O.epave10, null]
    ];
    {
      const ordre = Object.keys(SCENES2);
      for (const [id, apres] of [...OUVERTURE].reverse()) ordre.splice(ordre.indexOf(apres) + 1, 0, id);
      const neuves = Object.fromEntries(OUVERTURE.map(([id, , titre, etapes, dessin, avatar]) => [id, { titre, etapes, images: 1, ms: avatar ? RYTHME_AVATAR[avatar.pose] : 1e3, fond: /* @__PURE__ */ __name(() => dessin(), "fond"), avatar }]));
      const toutes = { ...SCENES2, ...neuves };
      for (const id of Object.keys(SCENES2)) delete SCENES2[id];
      for (const id of ordre) SCENES2[id] = toutes[id];
    }
    module.exports = { SCENES: SCENES2, W: W2, CADRE_PHOTO: CADRE_PHOTO2 };
  }
});

// atelier/generateur_scenes.mjs
var import_scenes6 = __toESM(require_scenes6(), 1);
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var W = import_scenes6.default.W;
var CADRE = [0, 0, W, W];
var svgOf = /* @__PURE__ */ __name((body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(W)}" height="${r2(W)}" viewBox="0 0 ${W} ${W}">${body}</svg>`, "svgOf");
var SCENES = Object.fromEntries(Object.entries(import_scenes6.default.SCENES).map(([id, sc]) => [id, {
  titre: sc.titre,
  etapes: sc.etapes,
  images: sc.images,
  ms_par_image: sc.ms,
  calques: sc.devant ? ["fond", "devant"] : ["fond"],
  avatar: sc.avatar
}]));
var CADRE_PHOTO = import_scenes6.default.CADRE_PHOTO;
function scene(id, calque, n = 1) {
  const sc = import_scenes6.default.SCENES[id];
  if (!sc) throw new Error(`scène inconnue : ${id} (${Object.keys(import_scenes6.default.SCENES).join(", ")})`);
  if (!SCENES[id].calques.includes(calque)) throw new Error(`calque inconnu : ${calque} (${SCENES[id].calques.join(", ")})`);
  if (!(n >= 1 && n <= sc.images)) throw new Error(`image ${n} : de 1 à ${sc.images}`);
  return { svg: svgOf(sc[calque](n - 1)), cadre: CADRE, ms_par_image: sc.images > 1 ? sc.ms : null };
}
__name(scene, "scene");
function liste() {
  const out = [];
  for (const [id, sc] of Object.entries(SCENES)) for (const c of sc.calques) for (let n = 1; n <= sc.images; n++) out.push({ fichier: `scenes/tutoriel/${id}/${id}_${c}_${n}.svg`, fonction: "scene", args: [id, c, n] });
  return out;
}
__name(liste, "liste");
export {
  CADRE_PHOTO,
  SCENES,
  liste,
  scene
};
