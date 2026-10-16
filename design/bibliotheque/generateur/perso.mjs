// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_perso.mjs : ne pas modifier à la main.
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
    var W = 1.1;
    var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 };
    var lerp = /* @__PURE__ */ __name((a, b, k) => Array.isArray(a) ? a.map((v, i) => r2(v + (b[i] - v) * k)) : r2(a + (b - a) * k), "lerp");
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
          defs += `<linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="0" y1="${r2(y0 * k)}" x2="0" y2="${r2(y1 * k)}"><stop offset="0" stop-color="${clair}"/><stop offset="0.22" stop-color="${h}"/><stop offset="0.78" stop-color="${h2}"/><stop offset="1" stop-color="${ton(h2, 0.78)}"/></linearGradient>`;
          table.set(h, { fill: `${g}t`, stroke: `${g}t` });
          continue;
        }
        const stops = `<stop offset="0" stop-color="${clair}"/><stop offset="0.45" stop-color="${h}"/><stop offset="1" stop-color="${sombre}"/>`;
        defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0.75" y2="1">${stops}</linearGradient><linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="${r2((habits.has(h) ? 6 : 4) * k)}" y1="${r2((habits.has(h) ? 28 : 2) * k)}" x2="${r2(42 * k)}" y2="${r2(60 * k)}">${stops}</linearGradient>`;
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
        if (mode === "blink") s += P(`M${r2(x - 1.7)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + 1.7)},${r2(y + 0.4)}`, "none", 1);
        else if (mode === "joy") s += P(`M${r2(x - 1.8)},${r2(y + 1)} Q${x},${r2(y - 1.2)} ${r2(x + 1.8)},${r2(y + 1)}`, "none", 1.1);
        else if (mode === "wink" && i === 1) s += P(`M${r2(x - 1.6)},${r2(y + 0.2)} L${r2(x + 1.6)},${r2(y + 0.2)}`, "none", 1);
        else if (mode === "big") s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P(`M${r2(x - k * 1.3)},${r2(y - 1.4)} L${r2(x + k * 1.1)},${y} L${r2(x - k * 1.3)},${r2(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r2(x - rx)},${r2(top)} Q${x},${r2(top - 0.9)} ${r2(x + rx)},${r2(top)} A${rx} ${r2(ry * 0.85)} 0 0 1 ${r2(x - rx)},${r2(top)} Z" fill="${EYE}"/>` + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P(`M${r2(x - rx - 0.5)},${r2(top + 0.3)} Q${x},${r2(top - 1.1)} ${r2(x + rx + 0.5)},${r2(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r2(top + (k > 0 ? tO : tI)), yr = r2(top + (k > 0 ? tI : tO));
          s += `<path d="M${r2(x - rx)},${yl} L${r2(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r2(x - rx)},${yl} Z" fill="${EYE}"/>` + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P(`M${r2(x - rx - 0.4)},${r2(yl - (yr - yl) * 0.12)} L${r2(x + rx + 0.4)},${r2(yr + (yr - yl) * 0.12)}`, "none", 1);
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
      return { d: pts.map(([x, y]) => `L${r2(x)},${r2(y)}`).join(" "), tips };
    }
    __name(dechirure, "dechirure");
    var filPendant = /* @__PURE__ */ __name((x, y, m = 1) => `<path d="M${r2(x)},${r2(y - 0.2)} q${r2(m * 0.45)},0.8 ${r2(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width=".45" stroke-linecap="round"/>`, "filPendant");
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
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, fill, w) + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
    var zee = /* @__PURE__ */ __name((x, y, z) => {
      const d = `M${r2(x)},${r2(y)} L${r2(x + z)},${r2(y)} L${r2(x)},${r2(y + z)} L${r2(x + z)},${r2(y + z)}`;
      return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r2(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
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
        s += `<path d="M${r2(x - k * hw)},${r2(by + bo)} Q${r2(x)},${r2(by + (bi + bo) / 2 + arch)} ${r2(x + k * hw)},${r2(by + bi)}" fill="none" stroke="${g.brow}" stroke-width="${g.browW}" stroke-linecap="round"/>`;
      }
      const rest = expr === "neutre" && g.restEyes ? g.restEyes : "open";
      s += eyes(g.eyes, ctx.eyeMode || EYEMODE[expr] || (ctx.blink ? "blink" : rest), g.ry, g.eyeColor);
      const open = /* @__PURE__ */ __name((hw, depth) => {
        const d = `M${r2(mx - hw)},${r2(my - 0.2)} Q${r2(mx)},${r2(my + depth)} ${r2(mx + hw)},${r2(my - 0.2)} Z`;
        return P(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r2(mx - w)},${my} Q${mx},${r2(my + w * 0.94)} ${r2(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r2(mx - 1.4)},${r2(my + 1.1)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.4)},${r2(my + 1.1)}`);
      else if (expr === "fache") s += P(`M${r2(mx - 1.7)},${r2(my + 1.3)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.7)},${r2(my + 1.3)} Q${mx},${r2(my + 0.7)} ${r2(mx - 1.7)},${r2(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P(`M${r2(mx - 1.8)},${r2(my + 0.6)} Q${r2(mx - 1.2)},${r2(my - 0.1)} ${r2(mx - 0.6)},${r2(my + 0.6)} Q${mx},${r2(my + 1.3)} ${r2(mx + 0.6)},${r2(my + 0.6)} Q${r2(mx + 1.2)},${r2(my - 0.1)} ${r2(mx + 1.8)},${r2(my + 0.6)}`, "none", 0.8);
      else if (expr === "endormi") s += E(mx, my + 0.7, 0.6, 0.75, g.mouthC, 0.8);
      else if (expr === "soulage") {
        s += line(`M${r2(mx - w * 0.72)},${r2(my + 0.1)} Q${mx},${r2(my + w * 0.62)} ${r2(mx + w * 0.72)},${r2(my + 0.1)}`);
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
        const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r2(x + i * a)},${r2(y + j * b)} Q${r2(x + i * a)},${r2(y + j * a)} ${r2(x + i * b)},${r2(y + j * a)}`).join(" ");
        s += `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
      }
      if (expr === "endormi") {
        const [x, y] = g.zz;
        s += n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
      }
      return s;
    }
    __name(expression, "expression");
    var pivotPied = /* @__PURE__ */ __name((c, x, y, dir) => c.jambe ? `${r2(x)} ${r2(y + 0.6)}` : `${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)}`, "pivotPied");
    function shoe(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 3)},${r2(y)} L${r2(x + 3)},${r2(y)} L${r2(x + 3.3)},${r2(y + 3.6)} Q${r2(x - 0.4)},${r2(y + 5.4)} ${r2(x - 3.3 - toe)},${r2(y + 3.8)} Z`;
      const sole = `M${r2(x - 3.4 - toe)},${r2(y + 3.3)} Q${r2(x - 0.4)},${r2(y + 5)} ${r2(x + 3.4)},${r2(y + 3.1)} L${r2(x + 3.4)},${r2(y + 5.6)} L${r2(x - 3.4 - toe)},${r2(y + 5.6)} Z`;
      const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 2.3)},${r2(y)} L${r2(x + 2.3)},${r2(y)} Q${r2(x + 2.9)},${r2(y + 3.4)} ${r2(x + 1.4)},${r2(y + 4.3)} L${r2(x - 1.4 - toe)},${r2(y + 4.3)} Q${r2(x - 3.1 - toe)},${r2(y + 3.8)} ${r2(x - 2.3)},${r2(y)} Z`;
      let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
      const top = c.hip;
      return `<rect x="${r2(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r2(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r2(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r2(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function enfoncer(pts) {
      const [a, n] = pts, len = Math.hypot(n[0] - a[0], n[1] - a[1]) || 1;
      return [[r2(a[0] + (n[0] - a[0]) / len * 1.1), r2(a[1] + (n[1] - a[1]) / len * 1.1)], ...pts.slice(1)];
    }
    __name(enfoncer, "enfoncer");
    function arm(c, a, b, elbow, main, partie = "tout") {
      if (c.bras) return c.bras(c, a, b, elbow, main, partie);
      const pts = enfoncer(elbow ? [a, elbow, b] : [a, b]);
      if (c.sleeves || c.bandage) return armOf(c, pts, main, partie);
      const d = "M" + pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = "";
      if (partie !== "devant") {
        s += line(OUT, c.armW + W * 2) + line(c.sleeve, c.armW);
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
      const path = /* @__PURE__ */ __name((list) => "M" + list.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L"), "path");
      const stroke = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
      const fw = c.armW * 0.8;
      let s = "";
      let cut = null;
      const derriere = partie !== "devant", devant = partie !== "derriere";
      if (c.sleeves) {
        const k = c.sleeves === "court" ? len * 0.77 : Math.min(c.sleeveCut || 5, len * 0.62);
        cut = at(k);
        const d = path([...pts.slice(0, -1), cut]);
        if (derriere) s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
        const fd = path([cut, b]);
        s += stroke(fd, OUT, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P2 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        const pt = /* @__PURE__ */ __name((q) => `${r2(q[0])},${r2(q[1])}`, "pt");
        const ombre = /* @__PURE__ */ __name((rr, dk) => `<path d="M${pt(P2(rr * 0.7, dk + rr * 0.55))} Q${pt(P2(0, dk + rr * 1.25))} ${pt(P2(-rr * 0.7, dk + rr * 0.55))}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="0.6" stroke-linecap="round"/>`, "ombre");
        if (c.sleeves === "court") {
          const e = path([at(k + 1.6), at(k - 0.4)]);
          s += stroke(e, OUT, c.armW + W * 2) + stroke(e, c.sleeve, c.armW) + ombre(c.armW / 2 + 1.1, -0.4);
        } else if (c.sleeves === "torn") {
          const zig = [P2(h, -0.5), P2(h * 0.45, 1.5), P2(0, 0.4), P2(-h * 0.5, 1.6), P2(-h, -0.5)];
          s += `<path d="${path([P2(h, -1.8), ...zig, P2(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT, 0.85);
        } else {
          const r = h + 0.4, arc = `M${pt(P2(r, -0.4))} Q${pt(P2(0, r * 0.95))} ${pt(P2(-r, -0.4))}`;
          s += `<path d="${arc}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${c.cuff || c.sleeve}" stroke-width="1.5" stroke-linecap="round"/><path d="M${pt(P2(r * 0.55, -0.2))} Q${pt(P2(0, r * 0.45))} ${pt(P2(-r * 0.55, -0.2))}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="0.45" stroke-linecap="round"/>`;
        }
      } else {
        const d = path(pts);
        if (derriere) s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
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
      const ph = walk ? r2(Math.cos(n % IMAGES.marche / IMAGES.marche * Math.PI * 2)) : 0;
      const bob = walk ? r2(-(1 - Math.abs(ph))) : 0;
      const breath = pose === "repos" ? [0, -0.35, -0.7, -0.35][n % 4] : 0;
      const k = pose === "salut" ? [0, 0.5, 1, 0.5][n % 4] : n % 2;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const sway = r2(ph * 0.5);
      const ctx = { view, pose, n, ph, k, sway, breath, id, walk };
      const [lx, rx] = c.legX[view];
      const tq = view !== "front", pas = tq ? 1.7 : 0.9, lever = tq ? 1.8 : 1.4;
      const ly = c.ground + (walk ? ph > 0 ? ph : ph * lever : 0);
      const ry = c.ground + (walk ? ph < 0 ? -ph : -ph * lever : 0);
      const side = view === "se" ? -1 : 1;
      const lxx = r2(lx + (walk ? side * ph * pas : 0));
      const rxx = r2(rx - (walk ? side * ph * pas * 0.7 : 0));
      const tiltL = walk && ph < 0 && tq ? r2((view === "se" ? 18 : -18) * -ph) : 0;
      const tiltR = walk && ph > 0 && tq ? r2((view === "se" ? 18 : -18) * ph) : 0;
      const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
      const swing = -ph;
      const loinG = view === "se" && c.brasLointain === "gauche";
      const dosG = view === "ne" && c.brasLointain === "gauche";
      const ecart = loinG || dosG ? 1.3 : 0, ecartD = dosG ? 1.3 : 0;
      const shL = [c.shoulders[0][0] - ecart, c.shoulders[0][1]], shR = [c.shoulders[1][0] + ecartD, c.shoulders[1][1]];
      const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4;
      const balance = /* @__PURE__ */ __name((sh, h, k2) => {
        if (!c.bras) return [r2(h[0] + k2 * bal), r2(h[1] + k2 * balY)];
        const a = k2 * (tq ? 0.16 : 0.1), vx = h[0] - sh[0], vy = h[1] - sh[1];
        return [r2(sh[0] + vx * Math.cos(a) + vy * Math.sin(a)), r2(sh[1] - vx * Math.sin(a) + vy * Math.cos(a))];
      }, "balance");
      const handL = balance(shL, [c.hands[0][0] - ecart, c.hands[0][1]], swing);
      const handR = balance(shR, [c.hands[1][0] + ecartD, c.hands[1][1]], -swing);
      const act = pose === "action" || pose === "salut" ? c.pose.call(cc, ctx) : null;
      const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
      const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : "";
      const heldBehind = view === "ne" && !c.holdOver && c.hold && c.hold.derriereDeDos ? held : "";
      const armRight = act && act.right != null ? act.right : (c.holdOver || heldBehind ? "" : held) + arm(cc, shR, handR);
      ctx.expr = expr || act && act.expr || (pose === "salut" ? "content" : c.repos || "neutre");
      ctx.eyeMode = expr ? null : act && act.eyeMode;
      ctx.open = !expr && act && act.open;
      ctx.blink = pose === "repos" && n % 4 === 3;
      const menton = view === "ne" ? "" : E(view === "se" ? 22.6 : 24, 33.6 + (c.dy || 0), (shR[0] - shL[0]) * 0.24, 1.1, "rgba(0,0,0,.13)", 0);
      let s = "";
      s += c.backItems ? c.backItems(cc, ctx) : "";
      s += heldBehind;
      s += act && act.under ? act.under : "";
      let haut = (loinG ? armLeft : dosG ? armLeft + armRight : "") + c.body(cc, ctx) + menton;
      if (view !== "front" && !dosG) haut += armRight;
      haut += c.neck ? c.neck(cc, ctx) : "";
      if (view === "front") haut += armLeft + armRight;
      else if (!loinG && !dosG) haut += armLeft;
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
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, pivotPied, eyes, expression, visageVide, EXPRS, TRAITS, dechirure, filPendant, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/hud.js
var require_hud = __commonJS({
  "atelier/hud.js"(exports, module) {
    var { OUT, P, E, clip, r2 } = require_troupe2();
    var W = 1.4;
    var BOIS = { clair: "#E2BC88", corps: "#B98A55", ombre: "#8E623A", fonce: "#6E4A2A", veine: "#A47848" };
    var PAPIER = { corps: "#FBF3DE", ombre: "#E9DAB8", clair: "#FFFBF0" };
    var OR = { clair: "#FFE596", corps: "#F2C04B", ombre: "#C8902A", fonce: "#A8741C" };
    var ETEINT = { clair: "#EDE6D8", corps: "#D6CCBA", ombre: "#B0A48E" };
    var SOMBRE = { corps: "#5A3A22", ombre: "#43291A", clair: "#7A5434" };
    var rr = /* @__PURE__ */ __name((x, y, w, h, r) => {
      r = Math.min(r, w / 2, h / 2);
      return `M${r2(x + r)},${r2(y)} L${r2(x + w - r)},${r2(y)} Q${r2(x + w)},${r2(y)} ${r2(x + w)},${r2(y + r)} L${r2(x + w)},${r2(y + h - r)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - r)},${r2(y + h)} L${r2(x + r)},${r2(y + h)} Q${r2(x)},${r2(y + h)} ${r2(x)},${r2(y + h - r)} L${r2(x)},${r2(y + r)} Q${r2(x)},${r2(y)} ${r2(x + r)},${r2(y)} Z`;
    }, "rr");
    var rond = /* @__PURE__ */ __name((x, y, r, fill, w = W) => E(x, y, r, r, fill, w), "rond");
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var clou = /* @__PURE__ */ __name((x, y) => rond(x, y, 1.15, OR.corps, 0.8) + rond(x - 0.35, y - 0.35, 0.4, OR.clair, 0), "clou");
    var etincelle = /* @__PURE__ */ __name((x, y, s = 1) => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="${r2(0.35 * s)}"/>`, "etincelle");
    function plaque(id, w, h, { r = 10, rebord = 4, levre = 3, face = PAPIER, bois = BOIS, clous = true, enfonce = 0 } = {}) {
      const o = rr(0.7, 0.7, w - 1.4, h - 1.4, r);
      const l = enfonce ? 1 : levre;
      let s = P(o, bois.ombre, 0) + clip(`${id}o`, o, `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - l, r)}" fill="${bois.corps}"/>` + trait(`M${r2(r)},2.4 L${r2(w - r)},2.4`, bois.clair, 1.1) + trait(`M${r2(r + 2)},${r2(rebord * 0.55 + 1.2)} L${r2(w - r - 6)},${r2(rebord * 0.55 + 1.2)}`, bois.veine, 0.5) + trait(`M${r2(r + 6)},${r2(h - l - rebord * 0.5)} L${r2(w - r - 2)},${r2(h - l - rebord * 0.5)}`, bois.veine, 0.5)) + P(o, "none", W);
      if (face) {
        const fy = rebord + enfonce * 0.6, fh = h - 2 * rebord - l + 0.4;
        const f = rr(rebord, fy, w - 2 * rebord, fh, Math.max(r - rebord * 0.8, 2));
        s += P(f, face.corps, 0) + clip(`${id}f`, f, `<rect x="0" y="${r2(fy - 1)}" width="${w}" height="2.6" fill="${face.ombre}"/><rect x="0" y="${r2(fy + fh - 1.6)}" width="${w}" height="2" fill="${face.clair || face.corps}" opacity=".7"/>`) + P(f, "none", 1);
      }
      if (clous) {
        const cx = Math.max(r * 0.62, 3), cyH = rebord * 0.55 + 0.6, cyB = h - l - rebord * 0.55;
        s += clou(cx, cyH) + clou(w - cx, cyH) + clou(cx, cyB) + clou(w - cx, cyB);
      }
      return s;
    }
    __name(plaque, "plaque");
    function bouton(id, w, h, etat, { r = 14, face = OR } = {}) {
      const f = etat === "desactive" ? ETEINT : face, enf = etat === "appuye" ? 2.4 : 0;
      const lev = 4, reb = 3;
      let s = P(rr(0.7, 0.7, w - 1.4, h - 1.4, r), BOIS.ombre, 0) + clip(`${id}o`, rr(0.7, 0.7, w - 1.4, h - 1.4, r), `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - (enf ? 1.4 : lev), r)}" fill="${BOIS.corps}"/>` + trait(`M${r2(r)},2.2 L${r2(w - r)},2.2`, BOIS.clair, 1)) + P(rr(0.7, 0.7, w - 1.4, h - 1.4, r), "none", W);
      const fy = reb + enf, fh = h - 2 * reb - (enf ? 1.4 : lev) - enf + 0.6;
      const F = rr(reb, fy, w - 2 * reb, fh, r - reb * 0.7);
      s += P(F, f.ombre, 0) + clip(`${id}f`, F, `<path d="${rr(reb, fy, w - 2 * reb, fh - 2.6, r - reb * 0.7)}" fill="${f.corps}"/><rect x="0" y="${r2(fy + 1.4)}" width="${w}" height="${r2(Math.max(fh * 0.28, 3))}" fill="${f.clair}" opacity=".75"/>` + trait(`M${r2(r)},${r2(fy + 2.2)} L${r2(w - r)},${r2(fy + 2.2)}`, "#FFFFFF", 1.1)) + P(F, "none", 1);
      const cx = Math.max(r * 0.55, 3);
      s += [[cx, reb * 0.5 + 0.9], [w - cx, reb * 0.5 + 0.9]].map(([x, y]) => rond(x, y, 0.9, OR.fonce, 0.6)).join("");
      return s;
    }
    __name(bouton, "bouton");
    var bourse = /* @__PURE__ */ __name(() => plaque("hbo", 64, 34, { r: 14 }), "bourse");
    var tuileReserve = /* @__PURE__ */ __name(() => plaque("htu", 48, 48, { r: 10 }), "tuileReserve");
    var boutonRecolte = /* @__PURE__ */ __name((etat) => () => bouton(`hre${etat[0]}`, 112, 60, etat, { r: 14 }), "boutonRecolte");
    var boutonRamasser = /* @__PURE__ */ __name((etat) => () => bouton(`hra${etat[0]}`, 96, 44, etat, { r: 18 }), "boutonRamasser");
    var boutonIle = /* @__PURE__ */ __name((etat) => () => plaque(`hil${etat[0]}`, 48, 48, { r: 11, rebord: 4.4, face: etat === "pret" ? OR : PAPIER, enfonce: etat === "appuye" ? 2 : 0 }) + (etat === "pret" ? etincelle(41.6, 6.4, 1.6) : ""), "boutonIle");
    var boutonZoom = /* @__PURE__ */ __name((etat) => () => plaque(`hzo${etat[0]}`, 40, 40, { r: 10, rebord: 4, clous: false, enfonce: etat === "appuye" ? 2 : 0 }), "boutonZoom");
    var etiquette = /* @__PURE__ */ __name(() => plaque("het", 72, 34, { r: 12, face: SOMBRE }), "etiquette");
    var pastille = /* @__PURE__ */ __name(() => rond(11, 11.4, 9.6, "#B83228", W) + rond(11, 10.6, 9, "#D9483C", 0) + rond(11, 10.6, 7.2, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="1" stroke-opacity=".75"') + E(7.4, 6.8, 2.4, 1.4, "rgba(255,255,255,.7)", 0), "pastille");
    var horlogeCadre = /* @__PURE__ */ __name((etat) => () => plaque(`hho${etat[0]}`, 104, 38, { r: 15, face: etat === "accelere" ? OR : PAPIER }) + (etat === "accelere" ? etincelle(96, 7, 1.5) + etincelle(8, 31, 1.1) : ""), "horlogeCadre");
    function cadran(nuit) {
      const D = "M2,20.4 A18,18 0 0 1 38,20.4 Z";
      const ciel = nuit ? `<rect x="0" y="0" width="40" height="22" fill="#3E4A86"/><rect x="0" y="12" width="40" height="10" fill="#5A5C9E"/>` + [[10, 9], [16, 5], [27, 7], [31, 13], [20, 11], [7, 15]].map(([x, y], i) => rond(x, y, i % 2 ? 0.55 : 0.8, "#FFF6D0", 0)).join("") : `<rect x="0" y="0" width="40" height="22" fill="#9ED6F2"/><rect x="0" y="11" width="40" height="11" fill="#CDEBF6"/><rect x="0" y="16" width="40" height="6" fill="#FBE6B4"/>`;
      const mer = `<rect x="0" y="17.6" width="40" height="4" fill="${nuit ? "#2E3A6E" : "#5CB0E6"}"/>` + trait("M5,19 L9,19 M24,19.4 L29,19.4", nuit ? "#6E7CB8" : "#D8F1FF", 0.8) + `<path d="M26,18 Q28.4,14.6 31,15 Q33.6,15.6 34.4,18 Z" fill="${nuit ? "#4A5A3E" : "#7DB852"}" stroke="${OUT}" stroke-width="0.6"/>`;
      return P(D, nuit ? "#3E4A86" : "#9ED6F2", 0) + clip(`hca${nuit ? "n" : "j"}`, D, ciel + mer) + P(D, "none", 1.2) + `<path d="M5.6,19.6 A14.4,14.4 0 0 1 34.4,19.6" fill="none" stroke="${nuit ? "#B8C0EC" : "#FFFFFF"}" stroke-width="0.8" stroke-dasharray="1.4 1.6" stroke-linecap="round"/>` + trait("M1,21 L39,21", OUT, 1.2);
    }
    __name(cadran, "cadran");
    var soleil = /* @__PURE__ */ __name(() => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = i * Math.PI / 4;
      return trait(`M${r2(6 + 4.4 * Math.cos(a))},${r2(6 + 4.4 * Math.sin(a))} L${r2(6 + 5.6 * Math.cos(a))},${r2(6 + 5.6 * Math.sin(a))}`, OR.ombre, 0.9);
    }).join("") + rond(6, 6, 3.6, OR.corps, 0.8) + E(4.6, 6.6, 0.3, 0.42, OUT, 0) + E(7.4, 6.6, 0.3, 0.42, OUT, 0) + E(3.9, 7.5, 0.6, 0.35, "rgba(240,120,110,.7)", 0) + E(8.1, 7.5, 0.6, 0.35, "rgba(240,120,110,.7)", 0) + trait("M5.4,7.7 Q6,8.3 6.6,7.7", OUT, 0.45) + rond(4.8, 4.6, 0.6, OR.clair, 0), "soleil");
    var lune = /* @__PURE__ */ __name(() => P("M8,1.4 A5,5 0 1 0 10.6,9.4 A4,4 0 0 1 8,1.4 Z", "#F4ECD0", 0.8) + trait("M4.2,6.6 Q4.8,7.2 5.4,6.6", OUT, 0.45) + E(3.6, 8, 0.55, 0.32, "rgba(240,120,110,.6)", 0) + trait("M8.6,3 L10.2,3 L8.6,4.6 L10.2,4.6", "#8C96C8", 0.5), "lune");
    function barreOnglets() {
      const w = 160, h = 72, o = rr(0.7, 0.7, w - 1.4, h + 10, 16);
      return P(o, BOIS.corps, 0) + clip("hba", o, trait(`M16,2.4 L${w - 16},2.4`, BOIS.clair, 1.2) + trait(`M10,9 L${w - 10},9`, BOIS.ombre, 0.8) + trait(`M10,10 L${w - 10},10`, BOIS.clair, 0.6) + trait(`M24,30 L${w - 24},30 M18,46 L${w - 18},46 M26,60 L${w - 26},60`, BOIS.veine, 0.5)) + P(o, "none", W) + clou(9, 5.6) + clou(w - 9, 5.6);
    }
    __name(barreOnglets, "barreOnglets");
    var medaillon = /* @__PURE__ */ __name((etat) => () => plaque(`hme${etat[0]}`, 44, 40, { r: 12, rebord: 3.6, levre: 2.4, face: etat === "actif" ? OR : PAPIER, clous: false }) + (etat === "actif" ? etincelle(38.6, 5, 1.3) : ""), "medaillon");
    var pointNouveau = /* @__PURE__ */ __name(() => rond(7, 7, 5.6, "#D9483C", 1.2) + rond(7, 7, 4.2, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.8" stroke-opacity=".8"') + E(5.4, 5.2, 1.4, 0.8, "rgba(255,255,255,.75)", 0), "pointNouveau");
    function railOnglets() {
      const w = 88, h = 160, o = rr(-12, 0.7, w + 11.3, h - 1.4, 16);
      return P(o, BOIS.corps, 0) + clip("hra", o, trait(`M${w - 2.4},16 L${w - 2.4},${h - 16}`, BOIS.clair, 1.2) + trait(`M${w - 9},10 L${w - 9},${h - 10}`, BOIS.ombre, 0.8) + trait(`M${w - 10},10 L${w - 10},${h - 10}`, BOIS.clair, 0.6) + trait(`M56,24 L56,${h - 24} M36,18 L36,${h - 18} M16,26 L16,${h - 26}`, BOIS.veine, 0.5)) + P(o, "none", W) + clou(w - 5.6, 9) + clou(w - 5.6, h - 9);
    }
    __name(railOnglets, "railOnglets");
    var bandeau = /* @__PURE__ */ __name(() => plaque("hbd", 72, 40, { r: 14, rebord: 4.4, face: SOMBRE }), "bandeau");
    var panneau = /* @__PURE__ */ __name(() => plaque("hpa", 72, 48, { r: 14, rebord: 4.6, levre: 3.4 }), "panneau");
    var boutonPapier = /* @__PURE__ */ __name((etat) => () => plaque(`hpp${etat[0]}`, 64, 36, { r: 12, rebord: 3.2, levre: 3, clous: false, enfonce: etat === "appuye" ? 2 : 0 }), "boutonPapier");
    function feuille() {
      const w = 120, h = 64, r = 18, reb = 5.2, o = rr(0.7, 0.7, w - 1.4, h + 20, r);
      const f = rr(reb, reb + 0.4, w - 2 * reb, h + 20, r - reb * 0.8);
      return P(o, BOIS.corps, 0) + clip("hfeo", o, trait(`M${r},2.4 L${w - r},2.4`, BOIS.clair, 1.1) + trait(`M${r + 4},${r2(reb * 0.55 + 1.2)} L${w - r - 8},${r2(reb * 0.55 + 1.2)}`, BOIS.veine, 0.5) + trait(`M2.6,${r} L2.6,${h}`, BOIS.veine, 0.5) + trait(`M${w - 2.6},${r} L${w - 2.6},${h}`, BOIS.ombre, 0.6)) + P(o, "none", W) + P(f, PAPIER.corps, 0) + clip("hfef", f, `<rect x="0" y="${r2(reb - 0.6)}" width="${w}" height="3" fill="${PAPIER.ombre}"/>`) + P(f, "none", 1) + clou(r * 0.62, reb * 0.55 + 0.6) + clou(w - r * 0.62, reb * 0.55 + 0.6);
    }
    __name(feuille, "feuille");
    function sceauQuete(pret) {
      const c = 22;
      let s = rond(c, c + 0.8, 20.6, BOIS.ombre, W) + rond(c, c, 20, BOIS.corps, 0) + trait(`M${c - 13},${c - 14} Q${c},${c - 21} ${c + 13},${c - 14}`, BOIS.clair, 1.1) + rond(c, c, 20, "none", W) + rond(c, c + 0.6, 14.4, OR.ombre, 1) + clip(
        pret ? "hsqp" : "hsqr",
        `M${c - 14.4},${c} A14.4,14.4 0 1 1 ${c + 14.4},${c} A14.4,14.4 0 1 1 ${c - 14.4},${c} Z`,
        rond(c, c - 1, 13.6, pret ? OR.clair : OR.corps, 0) + E(c - 4.6, c - 7.4, 6.4, 3.2, "rgba(255,255,255,.55)", 0)
      ) + rond(c, c + 0.6, 14.4, "none", 1);
      if (pret) s += `<path d="M${c - 2.2},${c - 9} L${c + 2.2},${c - 9} L${c + 1.2},${c + 3} L${c - 1.2},${c + 3} Z" fill="${SOMBRE.corps}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + rond(c, c + 6.6, 1.9, SOMBRE.corps, 0.6) + etincelle(36.6, 7.4, 1.5);
      else s += `<path d="M${c},${c - 9} Q${c + 1.4},${c - 1.4} ${c + 8},${c} Q${c + 1.4},${c + 1.4} ${c},${c + 9} Q${c - 1.4},${c + 1.4} ${c - 8},${c} Q${c - 1.4},${c - 1.4} ${c},${c - 9} Z" fill="${OR.fonce}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/><path d="M${c},${c - 6} Q${c + 0.6},${c - 0.6} ${c + 5},${c}" fill="none" stroke="${OR.clair}" stroke-width="0.8" stroke-linecap="round"/>`;
      return s;
    }
    __name(sceauQuete, "sceauQuete");
    var rr4 = /* @__PURE__ */ __name((x, y, w, h, [a, b, c, d]) => `M${r2(x + a)},${r2(y)} L${r2(x + w - b)},${r2(y)} Q${r2(x + w)},${r2(y)} ${r2(x + w)},${r2(y + b)} L${r2(x + w)},${r2(y + h - c)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - c)},${r2(y + h)} L${r2(x + d)},${r2(y + h)} Q${r2(x)},${r2(y + h)} ${r2(x)},${r2(y + h - d)} L${r2(x)},${r2(y + a)} Q${r2(x)},${r2(y)} ${r2(x + a)},${r2(y)} Z`, "rr4");
    var PAPIERS = {
      parchemin: { face: PAPIER.corps, levre: "#E2CDA2", reflet: PAPIER.clair, trait: OUT, filet: OR.ombre, filetA: 0.5, rayons: [16, 16, 16, 16] },
      sombre: { face: "#3A2E47", levre: "#22192C", reflet: "#4B3D5C", trait: "#140C1C", filet: "#B07CD8", filetA: 0.55, rayons: [22, 6, 20, 10] },
      nuit: { face: "#1C2A40", levre: "#101A2A", reflet: "#26364F", trait: "#0A1220", filet: "#C8DCF0", filetA: 0.3, rayons: [22, 22, 22, 22] }
    };
    function bulle(sorte) {
      const p = PAPIERS[sorte], w = 72, h = 60, l = 2.4, k = p.rayons;
      const o = rr4(0.7, 0.7, w - 1.4, h - 1.4, k);
      const f = rr4(0.7, 0.7, w - 1.4, h - 1.4 - l, k);
      return P(o, p.levre, 0) + clip(`hbu${sorte[0]}`, o, `<path d="${f}" fill="${p.face}"/><rect x="0" y="1.4" width="${w}" height="3.2" fill="${p.reflet}" opacity=".85"/>`) + P(o, "none", W).replace(`stroke="${OUT}"`, `stroke="${p.trait}"`) + `<path d="${rr4(4.4, 4.4, w - 8.8, h - 8.8 - l, k.map((r) => Math.max(r - 3.4, 2)))}" fill="none" stroke="${p.filet}" stroke-width=".6" opacity="${p.filetA}"/>`;
    }
    __name(bulle, "bulle");
    function queue(sorte, droite) {
      const p = PAPIERS[sorte];
      const g = /* @__PURE__ */ __name((s) => droite ? `<g transform="translate(16,0) scale(-1,1)">${s}</g>` : s, "g");
      return g(`<path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4 Z" fill="${p.face}"/><path d="M16,10.6 Q9.6,11.2 4.6,13.6 Q9.4,12.4 16,13.4 Z" fill="${p.levre}"/><path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4" fill="none" stroke="${p.trait}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    __name(queue, "queue");
    var FENTE = [[50, 2], [45, 17], [53, 30], [46, 43], [54, 55], [47, 68], [52, 82], [48, 95]];
    var feston = /* @__PURE__ */ __name((cx, cy, r, n, a = 0.06) => {
      let d = "";
      for (let i = 0; i <= n * 2; i++) {
        const t = i / (n * 2) * Math.PI * 2 - Math.PI / 2, rr0 = r * (i % 2 ? 1 + a : 1 - a * 0.4);
        const x = cx + Math.cos(t) * rr0, y = cy + Math.sin(t) * rr0;
        d += i ? i % 2 ? ` Q${r2(x)},${r2(y)}` : ` ${r2(x)},${r2(y)}` : `M${r2(x)},${r2(y)}`;
      }
      return d + " Z";
    }, "feston");
    function sceauCire() {
      const cx = 48, cy = 42, R = 34;
      const defs = `<defs><radialGradient id="hsc-cire" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#EC7A62"/><stop offset=".55" stop-color="#C9483A"/><stop offset="1" stop-color="#8A2C22"/></radialGradient><radialGradient id="hsc-creux" cx=".5" cy=".62" r=".62"><stop offset="0" stop-color="#C9483A"/><stop offset=".8" stop-color="#A9382C"/><stop offset="1" stop-color="#7E261E"/></radialGradient><linearGradient id="hsc-ruban" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A94DC"/><stop offset="1" stop-color="#2E5EA8"/></linearGradient></defs>`;
      let s = defs + E(cx + 3, 90, 30, 4.4, "rgba(60,40,25,.2)", 0);
      for (const m of [-1, 1]) {
        const x0 = cx + m * 6, x1 = cx + m * 22;
        s += P(`M${r2(x0 - 7)},58 L${r2(x1 - 7)},91 L${r2(x1)},86 L${r2(x1 + 7)},92 L${r2(x0 + 7)},60 Z`, "url(#hsc-ruban)", W) + trait(`M${r2(x0 - 2)},62 L${r2(x1 - 2)},86`, "#8FBAEE", 0.9) + trait(`M${r2(x0 + 3)},62 L${r2(x1 + 3.4)},86`, "#244C8C", 0.7);
      }
      const cire = feston(cx, cy, R, 13);
      s += P(`M${cx - 22},${cy + 26} Q${cx - 24},${cy + 36} ${cx - 19},${cy + 37} Q${cx - 15},${cy + 36} ${cx - 16},${cy + 28} Z`, "#B23E31", W) + P(`M${cx + 15},${cy + 29} Q${cx + 15},${cy + 39} ${cx + 19.4},${cy + 39} Q${cx + 23},${cy + 37} ${cx + 21},${cy + 26} Z`, "#B23E31", W);
      s += P(cire, "url(#hsc-cire)", 0) + clip("hscc", cire, E(cx + 10, cy + 12, R * 0.95, R * 0.85, "rgba(110,30,20,.28)", 0)) + P(cire, "none", W);
      s += `<circle cx="${cx}" cy="${cy}" r="${r2(R * 0.74)}" fill="none" stroke="#E87A66" stroke-width="3.4"/>` + trait(`M${cx - 18},${cy + 18} A${R * 0.74},${R * 0.74} 0 0 0 ${cx + 22},${cy + 12}`, "#8E2C22", 3);
      s += E(cx, cy, R * 0.62, R * 0.62, "url(#hsc-creux)", 1) + trait(`M${cx - 16},${cy - 9} A${R * 0.6},${R * 0.6} 0 0 1 ${cx + 16},${cy - 9}`, "#7A241C", 1.6) + trait(`M${cx - 14},${cy + 13} A${R * 0.6},${R * 0.6} 0 0 0 ${cx + 14},${cy + 13}`, "#E8826C", 1.2);
      const etoile = Array.from({ length: 10 }, (_, i) => {
        const a = i * Math.PI / 5 - Math.PI / 2, rr0 = i % 2 ? 6.4 : 14.4;
        return `${r2(cx + Math.cos(a) * rr0)},${r2(cy + 1 + Math.sin(a) * rr0)}`;
      });
      s += `<polygon points="${etoile.join(" ")}" fill="#7E261E" transform="translate(0.8 1.2)"/><polygon points="${etoile.join(" ")}" fill="#E06A56" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>` + trait(`M${cx},${cy - 12.6} L${cx - 3.4},${cy - 4}`, "#FFB8A6", 1.1) + trait(`M${cx - 12.6},${cy - 3.4} L${cx - 5},${cy - 2.6}`, "#FFB8A6", 0.9);
      s += E(cx - 18, cy - 20, 6, 2.6, "rgba(255,220,205,.7)", 0).replace("/>", ` transform="rotate(-35 ${cx - 18} ${cy - 20})"/>`) + rond(cx - 25, cy - 9, 1.4, "rgba(255,230,215,.8)", 0);
      return s;
    }
    __name(sceauCire, "sceauCire");
    function sceauFente() {
      const coupe = /* @__PURE__ */ __name((a, b, y) => [r2(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])), y], "coupe");
      const pts = [coupe(FENTE[0], FENTE[1], 9), ...FENTE.slice(1, -2), coupe(FENTE[5], FENTE[6], 80)];
      const d = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
      return `<defs><linearGradient id="hsf-or" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C0"/><stop offset="1" stop-color="#F2C04B"/></linearGradient></defs>` + trait(d, "rgba(255,214,100,.35)", 7) + trait(d, OUT, 3.2) + trait(d, "url(#hsf-or)", 1.8) + trait(d, "#FFFFFF", 0.6);
    }
    __name(sceauFente, "sceauFente");
    function billet() {
      const w = 96, h = 56, BRUN = "#7A5636";
      const haut = 7, bas = h - 7;
      const bord = /* @__PURE__ */ __name((x, sens) => {
        const pts = [];
        for (let i = 0; i <= 12; i++) {
          const y = haut + (bas - haut) * i / 12;
          pts.push([x + sens * (0.45 * Math.sin(i * 2.3) + 0.3 * Math.sin(i * 5.1 + 1)), y]);
        }
        return pts;
      }, "bord");
      const doux = /* @__PURE__ */ __name((pts) => pts.slice(1, -1).map((p, i) => {
        const q = pts[i + 2];
        return `Q${r2(p[0])},${r2(p[1])} ${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`;
      }).join(" ") + ` L${r2(pts[pts.length - 1][0])},${r2(pts[pts.length - 1][1])}`, "doux");
      const g = bord(3.2, 1), d = bord(w - 3.2, -1).reverse();
      const feuille2 = `M${r2(g[0][0])},${r2(g[0][1])} ${doux(g)} L${r2(d[0][0])},${r2(d[0][1])} ${doux(d)} Z`;
      const defs = '<linearGradient id="hbiV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBD7AE"/><stop offset=".2" stop-color="#FFF7E4"/><stop offset=".55" stop-color="#FBEFD3"/><stop offset=".82" stop-color="#F1DDB3"/><stop offset="1" stop-color="#DCC08E"/></linearGradient><linearGradient id="hbiH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9A46A" stop-opacity=".55"/><stop offset=".1" stop-color="#C9A46A" stop-opacity="0"/><stop offset=".9" stop-color="#C9A46A" stop-opacity="0"/><stop offset="1" stop-color="#B8925A" stop-opacity=".6"/></linearGradient><linearGradient id="hbiR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6DE"/><stop offset=".3" stop-color="#F3E2BC"/><stop offset=".72" stop-color="#D8BC8A"/><stop offset="1" stop-color="#B2905C"/></linearGradient><radialGradient id="hbiT"><stop offset="0" stop-color="#B8894A" stop-opacity=".32"/><stop offset="1" stop-color="#B8894A" stop-opacity="0"/></radialGradient><radialGradient id="hbiS" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF4D8"/><stop offset=".6" stop-color="#E4C995"/><stop offset="1" stop-color="#B8955E"/></radialGradient>';
      const coin = /* @__PURE__ */ __name((cx, cy, sx, sy, k) => [[3.4 + k, 3, 3.2], [9 - k, 5.4 + k, 1.6], [5.6, 9.6 - k, 1.2]].map(([a, b, r]) => `<ellipse cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" rx="${r2(r)}" ry="${r2(r * 0.8)}" fill="url(#hbiT)"/>`).join("") + [[6.4, 2.2, 0.32], [11.5, 7.6, 0.26], [2.6, 11, 0.3], [13.4 - k, 3.4 + k, 0.22]].map(([a, b, r]) => `<circle cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" r="${r}" fill="#B08A55" opacity=".45"/>`).join(""), "coin");
      const rouleau = /* @__PURE__ */ __name((y, dessous) => {
        const cyl = rr(1, y, w - 2, 10, 5);
        const bout = /* @__PURE__ */ __name((x) => E(x, y + 5, 2.6, 4.7, "url(#hbiS)", 0.8).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`) + E(x + 0.2, y + 5, 1.6, 3, "none", 0.45).replace(`stroke="${OUT}"`, 'stroke="#9C784A"') + E(x + 0.35, y + 5.1, 0.7, 1.4, "#C9A874", 0.4).replace(`stroke="${OUT}"`, 'stroke="#9C784A"'), "bout");
        return P(cyl, "url(#hbiR)", 0.9).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`) + `<path d="M6,${r2(y + 2.3)} L${w - 6},${r2(y + 2.3)}" stroke="#FFFDF4" stroke-width=".9" stroke-linecap="round" opacity=".8"/><path d="M5,${r2(dessous ? y + 1.2 : y + 8.9)} L${w - 5},${r2(dessous ? y + 1.2 : y + 8.9)}" stroke="#A8845A" stroke-width=".5" opacity=".7"/>` + bout(3.4) + bout(w - 3.4);
      }, "rouleau");
      return `<defs>${defs}</defs><path d="${feuille2}" fill="url(#hbiV)"/>` + clip("hbiF", feuille2, `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#hbiH)"/><rect x="0" y="${haut}" width="${w}" height="5" fill="#9C7646" opacity=".18"/><rect x="0" y="${haut}" width="${w}" height="2.4" fill="#9C7646" opacity=".16"/><rect x="0" y="${bas - 5}" width="${w}" height="5" fill="#9C7646" opacity=".1"/>` + coin(3, haut + 1, 1, 1, 0) + coin(w - 3, haut + 1, -1, 1, 1) + coin(3, bas - 1, 1, -1, 2) + coin(w - 3, bas - 1, -1, -1, 1)) + `<path d="${feuille2}" fill="none" stroke="${BRUN}" stroke-width=".8" stroke-linejoin="round"/>` + rouleau(1.2, false) + rouleau(h - 11.2, true);
    }
    __name(billet, "billet");
    var PIECES2 = [
      ["bourse", "Bourse d'écus", [64, 34], [12, 16, 15, 16], bourse, "le compteur d'écus (world__purse)"],
      ["tuile_reserve", "Tuile d'une réserve", [48, 48], [12, 12, 15, 12], tuileReserve, "les quatre réserves de la barre du haut (world__res)"],
      ...["repos", "appuye", "desactive"].map((e) => [`bouton_recolte_${e}`, `Bouton Récolte (${e === "repos" ? "au repos" : e === "appuye" ? "appuyé" : "désactivé"})`, [112, 60], [18, 22, 22, 22], boutonRecolte(e), "le bouton de la Récolte (world__play)"]),
      ...["repos", "appuye", "desactive"].map((e) => [`bouton_ramasser_${e}`, `Bouton « Tout ramasser » (${e === "repos" ? "au repos" : e === "appuye" ? "appuyé" : "désactivé"})`, [96, 44], [16, 22, 20, 22], boutonRamasser(e), "le bouton « Tout ramasser » (world__coins)"]),
      ...["repos", "pret", "appuye"].map((e) => [`bouton_ile_${e}`, `Bouton de l'île (${e === "repos" ? "au repos" : e === "pret" ? "quelque chose attend" : "appuyé"})`, [48, 48], null, boutonIle(e), "coffres, carnet, trouvailles (l'icône par-dessus, de 24 à 28 px)"]),
      ...["repos", "appuye"].map((e) => [`bouton_zoom_${e}`, `Bouton de zoom (${e === "repos" ? "au repos" : "appuyé"})`, [40, 40], null, boutonZoom(e), "zoom avant, zoom arrière, plein écran (l'icône par-dessus)"]),
      ["etiquette", "Étiquette de la boussole", [72, 34], [12, 16, 15, 16], etiquette, "l'expédition en route, le temps avant son retour (world__trip-btn)"],
      ["pastille", "Pastille de compte", [22, 22], null, pastille, "ce qui attend sur un bouton (le chiffre en blanc par-dessus)"],
      ...["jour", "accelere"].map((e) => [`horloge_${e}`, `Cadre de l'horloge (${e === "jour" ? "au repos" : "journée en accéléré"})`, [104, 38], [13, 18, 16, 18], horlogeCadre(e), "l'horloge de l'île (island-clock)"]),
      ["cadran_jour", "Cadran de l'horloge (jour)", [40, 24], null, () => cadran(false), "le fond du cadran, le jour (le soleil se pose sur l'arc)"],
      ["cadran_nuit", "Cadran de l'horloge (nuit)", [40, 24], null, () => cadran(true), "le fond du cadran, la nuit (la lune se pose sur l'arc)"],
      ["soleil", "Soleil du cadran", [12, 12], null, soleil, "le soleil, posé sur l'arc du cadran à l'heure qu'il est"],
      ["lune", "Lune du cadran", [12, 12], null, lune, "la lune, posée sur l'arc du cadran la nuit"],
      ["barre_onglets", "Barre d'onglets", [160, 72], [22, 28, 0, 28], barreOnglets, "la barre des onglets en bas de l'écran (tabbar)"],
      ...["repos", "actif"].map((e) => [`medaillon_${e}`, `Médaillon d'un onglet (${e === "repos" ? "au repos" : "onglet actif"})`, [44, 40], null, medaillon(e), "le médaillon d'un onglet (tabbar__medal), l'icône par-dessus"]),
      ["point_nouveau", "Point « nouveau »", [14, 14], null, pointNouveau, "une chose à faire sur un onglet (tabbar__dot)"],
      ["rail_onglets", "Rail d'onglets", [88, 160], [22, 22, 22, 0], railOnglets, "la barre des onglets debout à gauche, sur grand écran (tabbar)"],
      ["bandeau", "Bandeau", [72, 40], [14, 18, 17, 18], bandeau, "ce que fait le doigt dans un mode de l'île (world__banner), la bulle d'un appui long (world__tip)"],
      ["panneau", "Panneau", [72, 48], [15, 18, 18, 18], panneau, "le menu d'une pose sur l'île (world__menu)"],
      ...["repos", "appuye"].map((e) => [`bouton_papier_${e}`, `Petit bouton de papier (${e === "repos" ? "au repos" : "appuyé"})`, [64, 36], [12, 14, 14, 14], boutonPapier(e), "le geste secondaire d'un bandeau, d'un menu ou d'une feuille (world__link, world__menu-btn--quiet)"]),
      ["feuille", "Haut d'une feuille", [120, 64], [26, 24, 0, 24], feuille, "la feuille qui monte du bas de l'écran (world__sheet)"],
      ...["repos", "pret"].map((e) => [`sceau_quete_${e}`, `Sceau des quêtes (${e === "repos" ? "au repos" : "quête à prendre"})`, [44, 44], null, () => sceauQuete(e === "pret"), "le médaillon du suivi des quêtes (tracker__seal), l'anneau de progression par-dessus"]),
      ["bulle", "Bulle de dialogue", [72, 60], [20, 20, 22, 20], () => bulle("parchemin"), "les répliques : Brume et les siens sur l'île (guide__bubble), le coach du tutoriel (coach__say), les scènes (ps__bubble)"],
      ["bulle_queue", "Queue d'une bulle", [16, 20], null, () => queue("parchemin", false), "la queue de la bulle, vers celui qui parle (à gauche)"],
      ["bulle_sombre", "Bulle d'un hostile", [72, 60], [24, 22, 24, 22], () => bulle("sombre"), "un hostile parle : bulle sombre, coins irréguliers"],
      ["bulle_sombre_queue", "Queue d'une bulle d'hostile", [16, 20], null, () => queue("sombre", true), "la queue vers l'hostile, à droite (il fait face au joueur)"],
      ["bulle_pensee", "Bulle d'une pensée", [72, 60], [24, 24, 24, 24], () => bulle("nuit"), "une pensée, dans les scènes (ps__bubble.is-thought)"],
      ["billet", "Billet des notifications", [96, 56], [14, 16, 14, 16], billet, "une notification (toast) : un gain, une réussite, une erreur ; son ruban (à la couleur du ton) et son sceau de cire en CSS"],
      ["sceau_cire", "Sceau de cire (Sceau rompu)", [96, 96], null, sceauCire, "le sceau qui tombe, frappe et se fend en deux à l'annonce d'un succès (seal__wax) ; ses deux moitiés : le même dessin découpé le long de la fente (zones : fente)", { fente: FENTE }],
      ["sceau_fente", "Fente du sceau", [96, 96], null, sceauFente, "le trait d'or de la fente, posé sur le sceau juste avant qu'il se coupe (seal__crack)", { fente: FENTE }]
    ];
    module.exports = {
      PIECES: PIECES2,
      HD: 4,
      // pour les autres familles en bois et parchemin (perso.js) : les couleurs et les briques de dessin
      BOIS,
      PAPIER,
      OR,
      ETEINT,
      SOMBRE,
      W,
      rr,
      rond,
      trait,
      clou,
      etincelle,
      plaque,
      bouton
    };
  }
});

// atelier/carte_embarquement.js
var require_carte_embarquement = __commonJS({
  "atelier/carte_embarquement.js"(exports, module) {
    var { OUT, P, E, clip, r2 } = require_troupe2();
    var W = 1.4;
    var MARINE = { corps: "#2E4E8C", ombre: "#22396A", clair: "#4E72B4" };
    var PAPIER = { corps: "#F8F0DC", ombre: "#EADBB8", fibre: "#D9C8A2", encre: "#6B5A48" };
    var OR = { clair: "#FFE596", corps: "#E8B84A", ombre: "#B8862A" };
    var ROUGE = "#C8463A";
    var ENCRE = "#2E4E8C";
    var DECHIRE = " L313,170 Q309.6,171.6 311.4,175.4 L307.8,178.6 Q305.2,182 307.4,185.6 L302.6,188 Q299.2,190.6 300.8,194.8 L295.6,196.4 Q291.4,198.6 292.4,202 L286,203 L282,204";
    var ZONES = { photo: [29, 80, 58, 70, -4], nom: [104, 88, 128, 13] };
    var texte = /* @__PURE__ */ __name((x, y, t, size, col, extra = "", ancre = "start") => `<text x="${r2(x)}" y="${r2(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="${col}" text-anchor="${ancre}" ${extra}>${t}</text>`, "texte");
    var trait = /* @__PURE__ */ __name((d, color, w, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`, "trait");
    var hasard = /* @__PURE__ */ __name((graine) => () => (graine = graine * 16807 % 2147483647) / 2147483647, "hasard");
    function papierD(dechire) {
      const bord = /* @__PURE__ */ __name((x0, y0, x1, y1, n, amp, h2) => {
        let d2 = "";
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          d2 += ` L${r2(x0 + (x1 - x0) * t + (y1 !== y0 ? (h2() - 0.5) * amp : 0))},${r2(y0 + (y1 - y0) * t + (x1 !== x0 ? (h2() - 0.5) * amp : 0))}`;
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
      return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${s})"><path d="${corps}" fill="${col}"/>` + (ventre ? `<path d="M9,0.6 C6,1.6 3.4,1.8 1.6,1.4 C3.6,2.4 6.6,2.2 9,0.6 Z" fill="${ventre}"/><circle cx="6.4" cy="-0.5" r="0.55" fill="${ventre === "#FFFFFF" ? MARINE.corps : "#FFFFFF"}"/>` : "") + "</g>";
    }
    __name(hirondelle, "hirondelle");
    function ecusson(x, y) {
      const D = `M${x - 12},${y - 15} L${x + 12},${y - 15} L${x + 12},${y + 2} Q${x + 12},${y + 12} ${x},${y + 18} Q${x - 12},${y + 12} ${x - 12},${y + 2} Z`;
      const d2 = `M${x - 9.4},${y - 12.4} L${x + 9.4},${y - 12.4} L${x + 9.4},${y + 1.6} Q${x + 9.4},${y + 10} ${x},${y + 15} Q${x - 9.4},${y + 10} ${x - 9.4},${y + 1.6} Z`;
      return P(D, OR.corps, W) + P(d2, MARINE.clair, 0.8) + clip("ceb", d2, `<rect x="${x}" y="${y - 14}" width="12" height="32" fill="${MARINE.corps}" opacity=".5"/>`) + hirondelle(x - 1, y + 1, 0.82, "#FFFFFF", "#FFFFFF") + trait(`M${x - 8},${y - 13.4} L${x + 3},${y - 13.4}`, OR.clair, 0.9);
    }
    __name(ecusson, "ecusson");
    function champ(x, y, w, libelle, valeur) {
      return texte(x, y, libelle, 5.6, PAPIER.encre, 'letter-spacing="0.6"') + trait(`M${x},${r2(y + 9)} L${r2(x + w)},${r2(y + 9)}`, "#A8987C", 0.6) + (valeur ? texte(x + 1, y + 7.6, valeur, 8, ENCRE, 'font-style="italic"') : "");
    }
    __name(champ, "champ");
    function carte(etat = "neuve") {
      const trempee = etat === "trempee", id = `ce${etat[0]}`;
      const D = papierD(trempee);
      const h = hasard(7);
      let s = `<path d="${D}" fill="rgba(30,20,10,.28)" transform="translate(2.4 3.2)"/>` + P(D, PAPIER.corps, 0);
      let grain = "";
      for (let i = 0; i < 260; i++) grain += `<circle cx="${r2(h() * 320)}" cy="${r2(h() * 210)}" r="${r2(0.25 + h() * 0.45)}" fill="${h() > 0.5 ? PAPIER.fibre : "#FFFFFF"}" opacity="${r2(0.25 + h() * 0.35)}"/>`;
      for (let i = 0; i < 26; i++) {
        const x2 = h() * 300 + 10, y = h() * 190 + 10;
        grain += trait(`M${r2(x2)},${r2(y)} q${r2(3 + h() * 5)},${r2((h() - 0.5) * 2)} ${r2(8 + h() * 8)},${r2((h() - 0.5) * 1.4)}`, PAPIER.fibre, 0.35, 'opacity=".55"');
      }
      s += clip(`${id}p`, D, `<rect x="0" y="150" width="320" height="60" fill="${PAPIER.ombre}" opacity=".45"/>` + grain + `<g opacity=".07">${hirondelle(186, 128, 5.2, MARINE.corps)}</g><rect x="0" y="0" width="320" height="46" fill="${MARINE.corps}"/><rect x="0" y="38" width="320" height="8" fill="${MARINE.ombre}"/>` + trait("M0,46.4 L320,46.4", OR.corps, 1.4) + trait("M0,41 Q6,38.6 12,41 T24,41 T36,41 T48,41 T60,41 T72,41 T84,41 T96,41 T108,41 T120,41 T132,41 T144,41 T156,41 T168,41 T180,41 T192,41 T204,41 T216,41 T228,41 T240,41 T252,41 T264,41 T276,41 T288,41 T300,41 T312,41 T324,41", "#7E9CD0", 0.7) + `<rect x="243" y="47" width="80" height="170" fill="${PAPIER.ombre}" opacity=".5"/>` + (trempee ? taches() : "")) + P(D, "none", W);
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
      s += clip(`${id}e`, D, `<circle cx="243" cy="6" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W}"/>` + (trempee ? "" : `<circle cx="243" cy="204" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W}"/>`));
      s += texte(279, 22, "TALON", 6, "#B8C8E8", 'letter-spacing="2"', "middle") + hirondelle(285, 33, 0.9, "#F6EFDC");
      s += texte(279, 68, "N° 0742", 9, ENCRE, 'font-weight="bold"', "middle") + texte(279, 84, "Cabine 7 · Siège 12", 5.6, PAPIER.encre, "", "middle");
      s += texte(279, 98, "Havre-Gris", 6.2, ENCRE, 'font-style="italic"', "middle") + trait("M274,102 L284,102 M281,99.6 L284,102 L281,104.4", PAPIER.encre, 0.7) + texte(279, 113, "Îles de la Brume", 6.2, ENCRE, 'font-style="italic"', "middle");
      const hb = hasard(29);
      let barres = "", x = 254;
      while (x < 304) {
        const w = 0.6 + Math.floor(hb() * 3) * 0.6;
        barres += `<rect x="${r2(x)}" y="148" width="${r2(w)}" height="30" fill="#2A2420"/>`;
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
      for (let i = 0; i < 40; i++) trous += `<circle cx="${r2(150 + h() * 90)}" cy="${r2(160 + h() * 34)}" r="${r2(0.4 + h() * 0.9)}" fill="${PAPIER.corps}"/>`;
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
          s += trait(`M${r2(xx)},${y} q${r2((h() - 0.5) * 1.4)},${r2(l / 2)} ${r2((h() - 0.5) * 1.2)},${r2(l)}`, ENCRE, r2(0.5 + h() * 0.5), 'opacity=".32"') + `<circle cx="${r2(xx)}" cy="${r2(y + l)}" r="0.7" fill="${ENCRE}" opacity=".3"/>`;
        }
      }
      s += trait("M96,6 Q110,100 128,204", "#FFFFFF", 1.4, 'opacity=".55"') + trait("M97.6,6 Q111.6,100 129.6,204", "rgba(120,96,60,.35)", 0.8);
      return s;
    }
    __name(trempe, "trempe");
    module.exports = { carte, ZONES };
  }
});

// atelier/plage_loge.js
var require_plage_loge = __commonJS({
  "atelier/plage_loge.js"(exports, module) {
    var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var h = /* @__PURE__ */ __name((a, b = 0) => {
      const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }, "h");
    var pts = /* @__PURE__ */ __name((a) => a.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" "), "pts");
    var path = /* @__PURE__ */ __name((d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra}/>`, "path");
    var poly = /* @__PURE__ */ __name((a, fill, extra = "") => `<polygon points="${pts(a)}" fill="${fill}"${extra}/>`, "poly");
    var ell = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}"${extra}/>`, "ell");
    var lin = /* @__PURE__ */ __name((id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, extra = "") => `<radialGradient id="${id}"${extra}>${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`, "rad");
    var ink = /* @__PURE__ */ __name((w) => ` stroke="${ENCRE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "ink");
    var trait = /* @__PURE__ */ __name((d, c, w, a = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` stroke-opacity="${a}"` : ""}/>`, "trait");
    var ENCRE = "#2A1A2E";
    var CIEL = ["#5C4188", "#A0639E", "#E68DA2", "#F9BC90", "#FFDDA6"];
    var LUNE = "#FFF4D8";
    var LUNE_F = "#FFE3B0";
    var MER = ["#C98AA6", "#9A6696", "#6E4C84"];
    var SABLE = { mouille: "#C08EA2", clair: "#F4CBAA", sec: "#E6B192", fonce: "#B98284" };
    var VERT = { fonce: "#1F2834", corps: "#2E4040", clair: "#4C6658", lune: "#FFBE8E" };
    var TRONC = { lune: "#E0A288", corps: "#7C5864", ombre: "#46303E", bague: "#2E2030" };
    var PIEDS = [180, 308];
    var HORIZON = 196;
    var RIVAGE = 230;
    var LUNE_XY = [104, 176];
    var LANTERNE = [236, 320];
    var X0 = -160;
    var X1 = 600;
    var LARGE = X1 - X0;
    var BAS = 640;
    var FLAQUES = [[112, 282, 20, 4.2], [296, 330, 26, 5], [58, 338, 18, 3.8], [214, 266, 12, 2.6]];
    function ciel() {
      const [lx, ly] = LUNE_XY;
      let d = lin("pcC", 0, 0, 0, 1, [[0, CIEL[0]], [0.3, CIEL[1]], [0.62, CIEL[2]], [0.86, CIEL[3]], [1, CIEL[4]]]) + rad("pcH", [[0, "#FFF0C8", 0.9], [0.14, "#FFD49A", 0.62], [0.42, "#F6A08E", 0.26], [1, "#F6A08E", 0]], ` cx="${lx}" cy="${ly}" r="190" gradientUnits="userSpaceOnUse"`) + rad("pcL", [[0, "#FFFFFF"], [0.55, LUNE], [1, "#FFD08A"]], ` cx="${lx - 3}" cy="${ly - 4}" r="17" gradientUnits="userSpaceOnUse"`) + lin("pcM", 0, 0, 0, 1, [[0, MER[0]], [0.5, MER[1]], [1, MER[2]]]) + lin("pcB", 0, 0, 0, 1, [[0, "#FFD2B4", 0], [0.5, "#FFD2B4", 0.55], [1, "#FFD2B4", 0]]);
      let s = `<defs>${d}</defs><rect x="${X0}" width="${LARGE}" height="${HORIZON + 1}" fill="url(#pcC)"/>`;
      for (let i = 0; i < 18; i++) {
        const x = X0 + h(i, 1) * LARGE, y = 4 + h(i, 2) * h(i, 2) * 56;
        const a = 0.2 + 0.45 * h(i, 3), r = 0.3 + 0.45 * h(i, 4);
        s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="#FFF2E4" opacity="${r2(a * (1 - y / 70))}"/>`;
      }
      s += `<circle cx="292" cy="40" r="1.1" fill="#FFF6EA" opacity=".85"/>` + trait("M289,40 L295,40 M292,37 L292,43", "#FFF6EA", 0.35, 0.55);
      s += `<rect x="${X0}" width="${LARGE}" height="${HORIZON + 1}" fill="url(#pcH)"/>`;
      s += `<circle cx="${lx}" cy="${ly}" r="30" fill="#FFE6B8" opacity=".22"/>`;
      s += `<circle cx="${lx}" cy="${ly}" r="15.5" fill="url(#pcL)"/>`;
      s += `<path d="M${lx - 15.2},${ly + 3} Q${lx},${ly + 7} ${lx + 15.2},${ly + 3} L${lx + 14},${ly + 7} Q${lx},${ly + 10.5} ${lx - 14},${ly + 7} Z" fill="#FFC27E" opacity=".55"/>`;
      s += `<circle cx="${lx}" cy="${ly}" r="15.5" fill="none" stroke="#FFFFFF" stroke-width=".6" opacity=".7"/>`;
      s += rayons();
      s += nuage(268, 30, 230, 46, "pcn1", 3) + nuage(196, 6, 150, 30, "pcn5", 9, 0.9) + nuage(-10, 16, 120, 34, "pcn2", 5) + nuage(178, 128, 96, 18, "pcn3", 7, 0.75) + nuage(338, 150, 90, 16, "pcn4", 11, 0.7) + nuage(-96, 40, 150, 40, "pcn6", 13) + nuage(-40, 140, 90, 16, "pcn7", 15, 0.7) + nuage(470, 22, 170, 44, "pcn8", 17) + nuage(452, 126, 100, 18, "pcn9", 19, 0.75);
      s += `<rect x="${X0}" y="${HORIZON}" width="${LARGE}" height="${RIVAGE - HORIZON + 6}" fill="url(#pcM)"/>`;
      for (let i = 0; i < 200; i++) {
        const t = h(i, 7), y = HORIZON + 2 + t * t * (RIVAGE - HORIZON - 2), x = X0 + h(i, 8) * LARGE, w = 1.5 + 5 * t;
        s += trait(`M${r2(x)},${r2(y)} L${r2(x + w)},${r2(y)}`, h(i, 9) > 0.5 ? "#E8A6B4" : "#5E3E74", 0.5 + 0.6 * t, 0.6);
      }
      for (let i = 0; i < 30; i++) {
        const t = h(i, 51), y = HORIZON + 5 + t * (RIVAGE - HORIZON - 10), x = X0 + h(i, 52) * (LARGE - 20), w = 10 + 30 * t;
        s += trait(`M${r2(x)},${r2(y + 1)} Q${r2(x + w / 2)},${r2(y - 1.2 - t)} ${r2(x + w)},${r2(y + 1)}`, "#FFD2B0", 0.6 + 0.6 * t, r2(0.3 + 0.4 * (1 - Math.abs(x - LUNE_XY[0]) / 360)));
      }
      s += path(`M232,${HORIZON + 0.5} Q246,${HORIZON - 7} 262,${HORIZON - 8} Q284,${HORIZON - 14} 300,${HORIZON - 9} Q318,${HORIZON - 6} 336,${HORIZON + 0.5} Z`, "#6A4378");
      s += palmierLoin(266, HORIZON - 9, 1) + palmierLoin(290, HORIZON - 12, -1);
      s += path(`M232,${HORIZON + 0.6} L336,${HORIZON + 0.6}`, "none", ' stroke="#F2B39A" stroke-width=".8"');
      s += path(`M-150,${HORIZON + 0.5} Q-120,${HORIZON - 5} -86,${HORIZON - 4} Q-60,${HORIZON - 7} -30,${HORIZON + 0.5} Z`, "#9A6488");
      s += `<rect x="${X0}" y="${HORIZON - 12}" width="${LARGE}" height="22" fill="url(#pcB)"/>`;
      return s;
    }
    __name(ciel, "ciel");
    function rayons() {
      const [lx, ly] = LUNE_XY;
      let s = `<defs>${lin("pcR", 0, 0, 0, 1, [[0, "#FFE2B0", 0.16], [1, "#FFE2B0", 0]])}</defs>`;
      for (const [a, w] of [[-22, 10], [-48, 7], [-74, 12], [-104, 8], [-140, 10]]) {
        const r = a * Math.PI / 180, ex = lx + Math.cos(r) * 190, ey = ly + Math.sin(r) * 190, nx = -Math.sin(r), ny = Math.cos(r);
        s += poly([[lx + nx * 2, ly + ny * 2], [lx - nx * 2, ly - ny * 2], [ex - nx * w * 2, ey - ny * w * 2], [ex + nx * w * 2, ey + ny * w * 2]], "url(#pcR)");
      }
      return s;
    }
    __name(rayons, "rayons");
    function palmierLoin(x, y, m) {
      const top = [x + 3 * m, y - 15];
      let s = trait(`M${x},${y} Q${x + 0.5 * m},${y - 8} ${top[0]},${top[1]}`, "#6A4378", 1.1);
      for (const [a, l] of [[-150, 7], [-120, 6], [-60, 6], [-30, 7], [-95, 5], [10, 5], [170, 5]]) {
        const r = a * Math.PI / 180, ex = top[0] + Math.cos(r) * l, ey = top[1] + Math.sin(r) * l * 0.6 + 2.4;
        s += trait(`M${top[0]},${top[1]} Q${r2((top[0] + ex) / 2)},${r2(top[1] - 1.6)} ${r2(ex)},${r2(ey)}`, "#6A4378", 0.9);
      }
      return s;
    }
    __name(palmierLoin, "palmierLoin");
    function nuage(x, y, w, ht, id, graine, a = 1) {
      const c = [];
      const n = Math.max(4, Math.round(w / 13));
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), bosse = Math.sin(Math.PI * (0.08 + 0.84 * t));
        const r = ht * (0.32 + 0.42 * bosse) * (0.75 + 0.5 * h(i, graine));
        c.push([x - w / 2 + t * w + (h(i, graine + 1) - 0.5) * 8, y - r * 0.55 - ht * 0.18 * bosse, r]);
      }
      for (let i = 0; i < n + 1; i++) c.push([x - w / 2 + 6 + i / n * (w - 12), y - ht * 0.06 + h(i, graine + 2) * 2, ht * (0.2 + 0.1 * h(i, graine + 3))]);
      const corps = c.map(([cx, cy, r]) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/>`).join("");
      let s = `<defs>${lin(id, 0, 0, 0, 1, [[0, "#7A5A9C"], [0.5, "#A26CA2"], [1, "#C7809E"]])}<clipPath id="${id}c">${corps}</clipPath></defs>`;
      s += `<g fill="#F4A6A8" opacity="${r2(0.2 * a)}" transform="translate(${r2(x)} ${r2(y)}) scale(1.06 1.1) translate(${r2(-x)} ${r2(-y)})">${corps}</g>`;
      s += `<g opacity="${a}"><g fill="#FFC79A">${corps}</g>`;
      s += `<g clip-path="url(#${id}c)"><g fill="url(#${id})" transform="translate(1.6 -3)">${corps}</g>`;
      return s + "</g></g>";
    }
    __name(nuage, "nuage");
    function nuages() {
      let s = `<defs>${lin("pnN", 0, 0, 0, 1, [[0, "#A6709E", 0.8], [1, "#F2A08E", 0.8]])}</defs>`;
      const un = /* @__PURE__ */ __name((x0) => {
        let t = "";
        for (const [x, y, w, k] of [[40, 64, 70, 1], [150, 30, 54, 0.8], [250, 86, 80, 1.1], [330, 44, 40, 0.7]]) {
          const X = x0 + x;
          t += path(`M${r2(X - w)},${y} Q${r2(X - w * 0.5)},${r2(y - 9 * k)} ${r2(X)},${r2(y - 7 * k)} Q${r2(X + w * 0.4)},${r2(y - 12 * k)} ${r2(X + w)},${y} Q${r2(X)},${r2(y + 5 * k)} ${r2(X - w)},${y} Z`, "url(#pnN)");
          t += trait(`M${r2(X - w * 0.8)},${r2(y + 1.2)} Q${r2(X - w * 0.2)},${r2(y + 3 * k)} ${r2(X + w * 0.6)},${r2(y + 0.6)}`, "#FFE0B4", 0.9, 0.6);
        }
        return t;
      }, "un");
      return s + un(0) + un(360) + un(720) + un(1080);
    }
    __name(nuages, "nuages");
    function eclat(tirage) {
      const [lx] = LUNE_XY;
      let s = "";
      for (let i = 0; i < 46; i++) {
        const t = i / 45, y = 2 + t * (RIVAGE - HORIZON - 4);
        if (h(i, tirage + 3) < 0.28) continue;
        const large = 6 + 34 * t, x = lx - large / 2 + h(i, tirage) * large * 0.6, w = 2 + 10 * t * h(i, tirage + 5);
        const a = 0.85 - 0.45 * t;
        s += trait(`M${r2(x)},${r2(y)} L${r2(x + w)},${r2(y)}`, i % 5 ? "#FFE2A8" : "#FFFFFF", 0.6 + 0.9 * t, r2(a));
      }
      return s;
    }
    __name(eclat, "eclat");
    function flot() {
      const ondule = /* @__PURE__ */ __name((y, a) => {
        let d = `M-4,${y}`;
        for (let x = 0; x <= LARGE + 4; x += 12) d += ` Q${x + 6},${r2(y - a - h(x, y) * a)} ${x + 12},${y}`;
        return d;
      }, "ondule");
      let s = `<defs>${lin("pfE", 0, 0, 0, 1, [[0, "#FFF1E8", 0.9], [0.4, "#F4C2C4", 0.45], [1, "#C892A6", 0]])}</defs>`;
      s += path(`${ondule(8, 2.4)} L${LARGE + 4},30 L-4,30 Z`, "url(#pfE)");
      s += trait(ondule(8, 2.4), "#FFF6EE", 1.2, 0.85);
      for (let i = 0; i < 76; i++) s += ell(h(i, 11) * LARGE, 11 + h(i, 12) * 8, 1.2 + 2.4 * h(i, 13), 0.5 + 0.6 * h(i, 14), "#FFF6EE", ` opacity="${r2(0.25 + 0.4 * h(i, 15))}"`);
      return s;
    }
    __name(flot, "flot");
    function sol() {
      const [px, py] = PIEDS;
      let d = lin("psM", 0, 0, 0, 1, [[0, "#D8A0B4"], [1, SABLE.mouille]]) + `<linearGradient id="psS" x1="0" y1="${RIVAGE}" x2="0" y2="${BAS}" gradientUnits="userSpaceOnUse">${[[0, SABLE.mouille], [0.08, SABLE.clair], [0.3, SABLE.sec], [0.4, SABLE.fonce], [0.7, "#7A4E68"], [1, "#4A2E48"]].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>` + lin("psR", 0, 0, 0, 1, [[0, "#FFE6B8", 0.75], [1, "#FFE6B8", 0]]) + lin("psD", 0, 0, 1, 1, [[0, "#F2C2A0"], [1, "#B07C8A"]]) + lin("psF", 0, 0, 0, 1, [[0, "#F6BCA8"], [1, "#C48AAA"]]) + lin("psT", 0, 0, 1, 0, [[0, TRONC.lune], [0.35, TRONC.corps], [1, TRONC.ombre]]) + rad("psO", [[0, "#4A2440", 0.42], [1, "#4A2440", 0]]);
      let s = `<defs>${d}</defs>`;
      s += `<rect x="${X0}" y="${RIVAGE}" width="${LARGE}" height="40" fill="url(#psM)"/>`;
      s += path(`M${LUNE_XY[0] - 10},${RIVAGE} L${LUNE_XY[0] + 10},${RIVAGE} L${LUNE_XY[0] + 22},${RIVAGE + 38} L${LUNE_XY[0] - 18},${RIVAGE + 38} Z`, "url(#psR)", ' opacity=".55"');
      let bord = `M${X0 - 4},${RIVAGE + 16}`;
      for (let x = X0; x <= X1 + 4; x += 20) bord += ` Q${x + 10},${r2(RIVAGE + 12 + h(x, 3) * 6)} ${x + 20},${r2(RIVAGE + 15 + h(x, 4) * 4)}`;
      s += path(`${bord} L${X1 + 24},${BAS} L${X0 - 4},${BAS} Z`, "url(#psS)");
      for (let i = 0; i < 520; i++) {
        const t = h(i, 21), x = X0 + h(i, 22) * LARGE, y = RIVAGE + 18 + t * (BAS - 60 - RIVAGE - 18);
        s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(0.3 + 0.5 * t)}" fill="${h(i, 23) > 0.5 ? "#FFE4CC" : "#A8727C"}" opacity=".5"/>`;
      }
      for (let i = 0; i < 40; i++) {
        const x = X0 + h(i, 31) * (LARGE - 20), y = RIVAGE + 26 + h(i, 32) * 220, w = 14 + 18 * h(i, 33);
        s += trait(`M${r2(x)},${r2(y)} Q${r2(x + w / 2)},${r2(y - 2)} ${r2(x + w)},${r2(y)}`, "#C48E8A", 0.6, 0.5);
      }
      for (const [x, y, r] of [[148, 264, 1.6], [92, 316, 1.9], [318, 300, 1.5], [36, 290, 1.4]]) {
        s += ell(x, y, r * 1.3, r * 0.8, "#FFE6D8", ink(0.5)) + trait(`M${x - r * 0.6},${y} L${x + r * 0.6},${y - r * 0.4}`, ENCRE, 0.35, 0.6) + `<circle cx="${x - r * 0.5}" cy="${y - r * 0.4}" r=".45" fill="#FFFFFF"/>`;
      }
      FLAQUES.forEach(([cx, cy, rx, ry], i) => {
        s += ell(cx, cy + 0.8, rx + 1.6, ry + 1, SABLE.fonce, ' opacity=".7"') + ell(cx, cy, rx, ry, "url(#psF)");
        s += trait(`M${r2(cx - rx * 0.5)},${r2(cy - ry * 0.25)} L${r2(cx - rx * 0.1)},${r2(cy - ry * 0.25)} M${r2(cx + rx * 0.05)},${r2(cy + ry * 0.2)} L${r2(cx + rx * 0.35)},${r2(cy + ry * 0.2)}`, "#FFE8D0", 0.7, 0.7);
        if (i === 0) s += ell(cx - rx * 0.55, cy - ry * 0.1, 2.2, 0.9, LUNE_F, ' opacity=".9"');
      });
      for (let i = 0; i < 9; i++) {
        const t = i / 9, x = 118 + (px - 6 - 118) * t + (i % 2 ? 4 : -4), y = RIVAGE + 12 + (py - 14 - RIVAGE - 12) * t;
        const k = 0.7 + 0.5 * t;
        s += ell(x, y, 2.2 * k, 1 * k, "#A06C7C", ' opacity=".7"') + ell(x + 0.3, y - 0.3 * k, 1.2 * k, 0.4 * k, "#FFD8C0", ' opacity=".5"');
      }
      s += path("M-6,250 Q20,232 46,240 Q70,250 92,272 Q60,276 -6,280 Z", "url(#psD)", ink(1));
      s += trait("M6,244 Q30,236 52,244", "#FFE0C4", 0.9, 0.7);
      s += tronc([[36, 262], [40, 214], [52, 168]], 5.2, 3.2, "psT", 0.9);
      for (let i = 0; i < 11; i++) {
        const x = 4 + i * 7.6 + h(i, 41) * 3, y = 250 + Math.abs(x - 40) * 0.12 + h(i, 42) * 3;
        s += herbe(x, y, 8 + 7 * h(i, 43), i);
      }
      s += caisse(262, 276) + planche() + corde(296, 292) + bouteille(96, 268) + tonneau(440, 284) + rame();
      for (const [x, y, rx] of [[120, 420, 30], [250, 470, 40], [40, 520, 34], [330, 560, 30], [-60, 440, 26], [440, 430, 30]]) s += ell(x, y, rx, rx * 0.18, "#9A6A90", ' opacity=".5"') + trait(`M${x - rx * 0.4},${y - 0.6} L${x},${y - 0.6}`, "#F2B8B0", 0.8, 0.5);
      for (const [x, y] of [[180, 400], [300, 500], [60, 470], [-20, 380], [400, 380]]) s += trait(`M${x},${y} Q${x + 10},${y - 5} ${x + 22},${y} Q${x + 30},${y + 4} ${x + 40},${y}`, "#2C4A3E", 1.4, 0.8);
      s += trait("M126,296 Q138,290 150,296 Q160,302 172,298", "#2C4A3E", 1.4) + trait("M128,298 Q140,293 148,298", "#4E7666", 0.6, 0.7);
      s += trait("M300,262 Q312,256 322,262", "#2C4A3E", 1.2);
      s += ell(334, 302, 26, 4.4, "url(#psO)");
      s += ell(px + 14, py + 1, 38, 5.2, "url(#psO)");
      return s;
    }
    __name(sol, "sol");
    function herbe(x, y, l, i) {
      let s = "";
      for (let j = 0; j < 5; j++) {
        const a = -1.2 + j * 0.6 + (h(i, j) - 0.5) * 0.4, ex = x + Math.sin(a) * l * 0.6, ey = y - Math.cos(a * 0.6) * l;
        s += trait(`M${r2(x)},${r2(y)} Q${r2(x + (ex - x) * 0.3)},${r2(y - l * 0.6)} ${r2(ex)},${r2(ey)}`, j % 2 ? VERT.corps : VERT.fonce, 0.9);
        if (j === 1 || j === 3) s += trait(`M${r2(x + (ex - x) * 0.7)},${r2(y - l * 0.8)} L${r2(ex)},${r2(ey)}`, VERT.lune, 0.5, 0.55);
      }
      return s;
    }
    __name(herbe, "herbe");
    function tronc(c, w0, w1, grad, kInk) {
      const [[ax, ay], [bx, by], [cx, cy]] = c;
      const at = /* @__PURE__ */ __name((t) => [(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * bx + t * t * cx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * by + t * t * cy], "at");
      const n = 18, G = [], D = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.02)), [x0, y0] = at(Math.max(0, t - 0.02));
        const tx = x2 - x0, ty = y2 - y0, l = Math.hypot(tx, ty) || 1, nx = -ty / l, ny = tx / l, w = w0 + (w1 - w0) * t;
        G.push([x - nx * w, y - ny * w]);
        D.push([x + nx * w, y + ny * w]);
      }
      const corps = [...G, ...D.reverse()];
      let s = poly(corps, `url(#${grad})`, ink(kInk));
      for (let i = 1; i < 17; i++) {
        const t = i / 17, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.02)), [x0, y0] = at(t - 0.02);
        const tx = x2 - x0, ty = y2 - y0, l = Math.hypot(tx, ty), nx = -ty / l, ny = tx / l, w = (w0 + (w1 - w0) * t) * 0.92;
        s += trait(`M${r2(x - nx * w)},${r2(y - ny * w)} Q${r2(x + tx / l * 1.4)},${r2(y + ty / l * 1.4)} ${r2(x + nx * w)},${r2(y + ny * w)}`, TRONC.bague, 0.7, 0.8);
        s += trait(`M${r2(x - nx * w)},${r2(y - ny * w)} L${r2(x - nx * w * 0.45)},${r2(y - ny * w * 0.45 + 0.8)}`, "#FFD0A8", 0.5, 0.6);
      }
      return s;
    }
    __name(tronc, "tronc");
    function caisse(x, y) {
      const B = { lune: "#E2AE92", corps: "#9A6C66", ombre: "#5E3E4A" };
      let s = poly([[x - 22, y + 6], [x - 18, y - 16], [x + 6, y - 20], [x + 6, y + 4]], B.corps, ink(1.1));
      s += poly([[x + 6, y - 20], [x + 24, y - 14], [x + 22, y + 8], [x + 6, y + 4]], B.ombre, ink(1.1));
      s += poly([[x - 18, y - 16], [x - 2, y - 24], [x + 22, y - 20], [x + 6, y - 20]], B.lune, ink(1.1));
      s += trait(`M${x - 20},${y - 6} L${x + 6},${y - 9} M${x - 19},${y - 11} L${x + 6},${y - 14}`, "#2A2030", 0.7, 0.8);
      s += trait(`M${x + 7},${y - 8} L${x + 23},${y - 3}`, "#1E1826", 0.7, 0.8);
      s += trait(`M${x - 14},${y - 18} L${x + 4},${y - 22}`, "#B8A8A0", 0.6, 0.6);
      s += poly([[x - 4, y - 21], [x + 3, y - 30], [x + 8, y - 27], [x + 2, y - 19]], B.lune, ink(0.9));
      s += path(`M${x - 26},${y + 8} Q${x},${y + 1} ${x + 28},${y + 9} L${x + 28},${y + 12} L${x - 26},${y + 12} Z`, SABLE.clair);
      s += trait(`M${x - 26},${y + 8} Q${x},${y + 1} ${x + 28},${y + 9}`, "#FFE0C8", 0.6, 0.7);
      return s;
    }
    __name(caisse, "caisse");
    function planche() {
      let s = poly([[44, 312], [112, 300], [114, 306], [46, 319]], "#8E6258", ink(1));
      s += trait("M50,313 L108,302", "#E2AE92", 0.6, 0.7) + trait("M64,313 L70,312 M86,308 L92,307", "#2A2030", 0.6);
      s += `<circle cx="57" cy="313.5" r=".9" fill="#2A2030"/><circle cx="101" cy="305" r=".9" fill="#2A2030"/>`;
      return s + path("M40,318 Q76,312 116,306 L118,310 Q80,318 40,322 Z", SABLE.sec, ' opacity=".8"');
    }
    __name(planche, "planche");
    function corde(x, y) {
      let s = ell(x, y, 9, 3.4, "none", ' stroke="#2A2030" stroke-width="3.2"') + ell(x, y, 9, 3.4, "none", ' stroke="#8E7E6A" stroke-width="1.8"');
      s += ell(x, y - 0.6, 5.6, 2, "none", ' stroke="#2A2030" stroke-width="3"') + ell(x, y - 0.6, 5.6, 2, "none", ' stroke="#A89480" stroke-width="1.6"');
      return s + trait(`M${x + 8},${y + 1} Q${x + 16},${y + 6} ${x + 26},${y + 4}`, "#2A2030", 3) + trait(`M${x + 8},${y + 1} Q${x + 16},${y + 6} ${x + 26},${y + 4}`, "#8E7E6A", 1.6);
    }
    __name(corde, "corde");
    function bouteille(x, y) {
      let s = `<g transform="rotate(-62 ${x} ${y})">` + path(`M${x - 3},${y + 7} L${x - 3},${y - 3} Q${x - 3},${y - 6} ${x - 1.4},${y - 7} L${x - 1.4},${y - 11} L${x + 1.4},${y - 11} L${x + 1.4},${y - 7} Q${x + 3},${y - 6} ${x + 3},${y - 3} L${x + 3},${y + 7} Z`, "#3E6A6A", ink(0.8) + ' fill-opacity=".85"');
      s += trait(`M${x - 1.6},${y + 5} L${x - 1.6},${y - 3}`, "#CDEBEA", 0.8, 0.8) + `<rect x="${x - 1.6}" y="${y - 13}" width="3.2" height="2.4" fill="#7A5A44"${ink(0.6)}/></g>`;
      return s + path(`M${x - 4},${y + 3} Q${x + 2},${y - 1} ${x + 9},${y + 3} L${x + 9},${y + 5} L${x - 4},${y + 5} Z`, SABLE.clair);
    }
    __name(bouteille, "bouteille");
    function tonneau(x, y) {
      let s = ell(x - 12, y, 6, 9, "#7A5250", ink(1.1)) + path(`M${x - 12},${y - 9} L${x + 12},${y - 10} Q${x + 18},${y} ${x + 12},${y + 10} L${x - 12},${y + 9} Z`, "#946458", ink(1.1));
      s += trait(`M${x - 4},${y - 9.4} Q${x + 1},${y} ${x - 4},${y + 9.4} M${x + 6},${y - 9.8} Q${x + 11},${y} ${x + 6},${y + 9.8}`, "#2A2030", 1.6) + trait(`M${x - 2},${y - 7} L${x + 10},${y - 7.6}`, "#E2AE92", 0.7, 0.7);
      return s + ell(x - 12, y, 3.6, 6, "#3A2E36") + path(`M${x - 22},${y + 9} Q${x},${y + 4} ${x + 22},${y + 10} L${x + 22},${y + 13} L${x - 22},${y + 13} Z`, SABLE.clair);
    }
    __name(tonneau, "tonneau");
    function rame() {
      return poly([[-110, 318], [-46, 292], [-44, 296], [-108, 322]], "#8E6258", ink(1)) + path("M-46,292 Q-30,284 -22,290 Q-28,300 -44,296 Z", "#9A6C62", ink(1)) + trait("M-104,318 L-50,296", "#E2AE92", 0.6, 0.7) + path("M-120,322 Q-80,314 -40,300 L-38,304 Q-80,320 -120,326 Z", SABLE.sec, ' opacity=".85"');
    }
    __name(rame, "rame");
    var COURONNE_D = [298, 70];
    var COURONNE_G = [52, 168];
    function palmierD() {
      const d = `<defs>${lin("ppT", 0, 0, 1, 0, [[0, TRONC.lune], [0.3, TRONC.corps], [1, TRONC.ombre]])}</defs>`;
      return d + tronc([[340, 304], [340, 170], [COURONNE_D[0], COURONNE_D[1]]], 11, 6.5, "ppT", 1.3);
    }
    __name(palmierD, "palmierD");
    function palme(ox, oy, ang, L, chute, larg, id, lune = 0.55) {
      const a = ang * Math.PI / 180, ex = ox + Math.cos(a) * L, ey = oy + Math.sin(a) * L + chute;
      const cx = ox + Math.cos(a) * L * 0.45, cy = oy + Math.sin(a) * L * 0.45 - L * 0.22;
      const at = /* @__PURE__ */ __name((t) => [(1 - t) * (1 - t) * ox + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) * (1 - t) * oy + 2 * (1 - t) * t * cy + t * t * ey], "at");
      const n = 15, lames = [[], []];
      for (let i = 1; i <= n; i++) {
        const t = (i - 0.3) / n, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.01)), [x0, y0] = at(Math.max(0, t - 0.01));
        const l = Math.hypot(x2 - x0, y2 - y0) || 1, ux = (x2 - x0) / l, uy = (y2 - y0) / l;
        const len = larg * 2.4 * Math.pow(Math.sin(Math.PI * Math.min(0.98, 0.15 + t * 0.9)), 0.8);
        [1, -1].forEach((k, j) => {
          const nx = -uy * k, ny = ux * k;
          let dx = ux * 0.75 + nx * 0.55, dy = uy * 0.75 + ny * 0.55 + 0.9;
          const dl = Math.hypot(dx, dy);
          dx /= dl;
          dy /= dl;
          const tx = x + dx * len, ty = y + dy * len + len * 0.18, mx = x + dx * len * 0.55 - nx * 0.6, my = y + dy * len * 0.5;
          const b = 1.1 + larg * 0.06;
          lames[j].push(`M${r2(x - ux * b)},${r2(y - uy * b)} Q${r2(mx - ux * b * 0.9)},${r2(my - uy * b * 0.9)} ${r2(tx)},${r2(ty)} Q${r2(mx + ux * b * 0.9)},${r2(my + uy * b * 0.9)} ${r2(x + ux * b)},${r2(y + uy * b)} Z`);
        });
      }
      const nerv = Array.from({ length: 13 }, (_, i) => at(i / 12));
      const ligne = /* @__PURE__ */ __name((a2) => "M" + a2.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" L"), "ligne");
      let s = `<path d="${lames[1].join(" ")}" fill="#0F1E22"${ink(0.6)}/>`;
      s += trait(ligne(nerv), ENCRE, 2.2) + trait(ligne(nerv), "#2C4A44", 1.1);
      s += `<path d="${lames[0].join(" ")}" fill="url(#${id})"${ink(0.6)}/>`;
      s += trait(ligne(nerv.slice(1, 9)), VERT.lune, 0.8, lune);
      return s;
    }
    __name(palme, "palme");
    function palmesD() {
      const [x, y] = COURONNE_D;
      let s = `<defs>${lin("pdA", 0, 0, 1, 1, [[0, VERT.clair], [0.5, VERT.corps], [1, VERT.fonce]])}${lin("pdB", 0, 0, 1, 1, [[0, VERT.corps], [1, "#0E1A1E"]])}</defs>`;
      for (const [a, L, c, w] of [[-62, 52, 10, 8], [-118, 54, 12, 8], [-14, 60, 24, 9], [-92, 46, 6, 7], [-165, 70, 22, 9]]) s += palme(x, y, a, L, c, w, "pdB", 0.25);
      for (const [a, L, c, w] of [[-176, 88, 40, 11], [-200, 74, 44, 10], [152, 66, 38, 10], [10, 58, 36, 9.5], [-140, 70, 20, 10], [-40, 56, 18, 9], [120, 50, 34, 9], [60, 40, 30, 8]]) s += palme(x, y, a, L, c, w, "pdA");
      for (const [cx, cy] of [[x - 4, y + 5], [x + 3, y + 6], [x - 0.5, y + 10]]) s += `<circle cx="${cx}" cy="${cy}" r="4.2" fill="#3A2C26"${ink(0.9)}/><circle cx="${cx - 1.4}" cy="${cy - 1.5}" r="1.1" fill="#8A7A84" opacity=".7"/>`;
      return s;
    }
    __name(palmesD, "palmesD");
    function palmesG() {
      const [x, y] = COURONNE_G;
      let s = `<defs>${lin("pgA", 0, 0, 1, 1, [[0, VERT.clair], [0.55, VERT.corps], [1, VERT.fonce]])}${lin("pgB", 0, 0, 1, 1, [[0, VERT.corps], [1, "#0E1A1E"]])}</defs>`;
      for (const [a, L, c, w] of [[-118, 30, 6, 5], [-64, 32, 8, 5]]) s += palme(x, y, a, L, c, w, "pgB", 0.25);
      for (const [a, L, c, w] of [[-156, 38, 16, 6], [-24, 42, 18, 6.5], [18, 34, 22, 6], [168, 32, 20, 6], [-92, 26, 4, 5], [130, 26, 18, 5]]) s += palme(x, y, a, L, c, w, "pgA");
      s += `<circle cx="${x - 1}" cy="${y + 3}" r="2.6" fill="#3A2C26"${ink(0.7)}/><circle cx="${x + 2.4}" cy="${y + 3.6}" r="2.4" fill="#3A2C26"${ink(0.7)}/>`;
      return s;
    }
    __name(palmesG, "palmesG");
    function devant() {
      let s = `<defs>${lin("pvA", 0, 0, 0, 1, [[0, "#2E3640"], [1, "#161A24"]])}</defs>`;
      const feuille = /* @__PURE__ */ __name((x, y, r, rot) => {
        const d = `M0,${r2(r)} Q${r2(-r * 1.15)},${r2(r * 0.2)} ${r2(-r * 0.75)},${r2(-r * 0.55)} Q${r2(-r * 0.4)},${r2(-r * 0.95)} 0,${r2(-r * 0.5)} Q${r2(r * 0.4)},${r2(-r * 0.95)} ${r2(r * 0.75)},${r2(-r * 0.55)} Q${r2(r * 1.15)},${r2(r * 0.2)} 0,${r2(r)} Z`;
        let f = `<g transform="translate(${x} ${y}) rotate(${rot})">` + path(d, "url(#pvA)", ink(1.2));
        f += trait(`M0,${r2(-r * 0.5)} L0,${r2(r * 0.9)}`, "#060C10", 1);
        for (const k of [-1, 1]) for (const t of [0.05, 0.35, 0.62]) f += trait(`M0,${r2(-r * 0.4 + t * r * 1.2)} Q${r2(k * r * 0.35)},${r2(-r * 0.5 + t * r * 1.2)} ${r2(k * r * 0.62)},${r2(-r * 0.62 + t * r * 1.25)}`, "#060C10", 0.7, 0.8);
        f += trait(`M${r2(-r * 0.9)},${r2(r * 0.05)} Q${r2(-r * 0.85)},${r2(-r * 0.6)} ${r2(-r * 0.2)},${r2(-r * 0.62)}`, VERT.lune, 1.1, 0.75);
        return f + "</g>";
      }, "feuille");
      s += trait("M-4,360 Q20,330 34,318 M10,360 Q40,336 58,330 M30,362 Q60,346 80,344", "#0A1216", 2.2);
      s += feuille(-2, 318, 22, 40) + feuille(30, 330, 26, 14) + feuille(64, 348, 20, -18) + feuille(8, 352, 18, 70);
      s += palme(374, 352, -164, 92, 10, 9, "pvA");
      for (let i = 0; i < 6; i++) s += herbe(304 + i * 9, 362, 22 + 10 * h(i, 61), i + 20);
      s += trait("M300,350 Q312,330 318,322 M314,356 Q324,334 332,326", "#FFB46A", 0.9, 0.45);
      return s;
    }
    __name(devant, "devant");
    function lanterne() {
      const L = { lune: "#E8C098", corps: "#8A6A4E", ombre: "#4A3828" };
      let s = `<defs>${rad("plV", [[0, "#FFF6D6"], [0.35, "#FFD48A"], [0.75, "#F0A04E"], [1, "#B4682E"]], ' cx="14" cy="24" r="10" gradientUnits="userSpaceOnUse"')}${rad("plF", [[0, "#FFFFFF"], [0.5, "#FFF0B0"], [1, "#FFB040", 0]], ' cx="14" cy="24" r="4.6" gradientUnits="userSpaceOnUse"')}</defs><g transform="rotate(5 14 38)">`;
      s += trait("M8,9 Q14,0 20,9", ENCRE, 2.6) + trait("M8,9 Q14,0 20,9", L.corps, 1.2);
      s += path("M6,12 L22,12 L19,7.5 L9,7.5 Z", L.corps, ink(1.1)) + trait("M9.5,8.6 L15,8.6", L.lune, 0.8, 0.8);
      s += path("M7.5,13 L20.5,13 L21.5,32 L6.5,32 Z", "url(#plV)", ink(1.1));
      s += ell(14, 25, 2.4, 4.6, "url(#plF)");
      s += path("M14,19.5 Q12,23.5 13.2,26.5 Q14,28 14.8,26.5 Q16,23.5 14,19.5 Z", "#FFFDF2");
      s += trait("M10.5,13.4 L10,31.6 M17.5,13.4 L18,31.6", L.ombre, 1, 0.9) + trait("M7.2,20 L20.8,20", L.ombre, 0.8, 0.7);
      s += trait("M8.6,14.6 L8.2,30", "#FFFFFF", 0.7, 0.55);
      s += path("M5,32 L23,32 L24,37 L4,37 Z", L.corps, ink(1.1)) + trait("M6.2,33.6 L14,33.6", L.lune, 0.8, 0.7);
      s += "</g>";
      return s + path("M1,38.5 Q14,34.5 27,38.5 L27,40 L1,40 Z", "#E6B192");
    }
    __name(lanterne, "lanterne");
    function brume() {
      let s = `<defs>${rad("pbV", [[0, "#FFE6EA", 0.62], [0.4, "#F8C8D4", 0.4], [0.75, "#E8A8C0", 0.12], [1, "#E2A2BC", 0]])}</defs>`;
      for (let i = 0; i < 26; i++) {
        const rx = 34 + 30 * h(i, 73), ry = 16 + 14 * h(i, 74);
        const x = rx + h(i, 71) * (360 - 2 * rx), y = ry + 4 + h(i, 72) * (100 - 2 * ry - 8);
        s += ell(x, y, rx, ry, "url(#pbV)");
      }
      return s;
    }
    __name(brume, "brume");
    var CALQUES = [
      ["plage_ciel", "Plage au couchant : le ciel, le soleil, la mer au loin", [LARGE, HORIZON + 40], () => `<g transform="translate(${-X0} 0)">${ciel()}</g>`, [X0, 0, LARGE, HORIZON + 40], "le fond : le ciel du soir, le soleil bas et son halo, ses rayons, les premières étoiles, la mer rose, l'îlot à l'horizon"],
      ["plage_nuages", "Plage au couchant : les nuages qui passent", [1440, 110], nuages, [-180, 0, 1440, 110], "une bande qui boucle : elle glisse vers la gauche de 720 (la moitié de sa largeur), sans fin, devant le soleil"],
      ["plage_eclat_a", "Plage au couchant : le chemin d'or du soleil sur la mer (1)", [120, RIVAGE - HORIZON], () => eclat(1), [LUNE_XY[0] - 60, HORIZON, 120, RIVAGE - HORIZON], "l'éclat qui tremble : les deux tirages alternent (fondu)"],
      ["plage_eclat_b", "Plage au couchant : le chemin d'or du soleil sur la mer (2)", [120, RIVAGE - HORIZON], () => eclat(2), [LUNE_XY[0] - 60, HORIZON, 120, RIVAGE - HORIZON], "l'autre tirage de l'éclat"],
      ["plage_flot", "Plage au couchant : le flot", [LARGE, 30], flot, [X0, RIVAGE - 10, LARGE, 30], "l'écume qui monte sur le sable et redescend (translation, écrasement, fondu) ; deux, décalés"],
      ["plage_sol", "Plage au couchant : le sable, la dune, les restes du naufrage", [LARGE, BAS - 150], () => `<g transform="translate(${-X0} -150)">${sol()}</g>`, [X0, 150, LARGE, BAS - 150], "la plage : le sable mouillé, les flaques, les pas, la dune et le tronc du petit palmier, la caisse, la planche, la corde, la bouteille"],
      ["plage_palmes_g", "Plage au couchant : les palmes du petit palmier", [100, 70], () => `<g transform="translate(-2 -128)">${palmesG()}</g>`, [2, 128, 100, 70], "elles se balancent autour du haut du tronc (origine : zones.origine)"],
      ["plage_palmier_d", "Plage au couchant : le tronc du grand palmier", [80, 250], () => `<g transform="translate(-280 -60)">${palmierD()}</g>`, [280, 60, 80, 250], "le tronc, immobile"],
      ["plage_palmes_d", "Plage au couchant : les palmes du grand palmier", [200, 150], () => `<g transform="translate(-200 -10)">${palmesD()}</g>`, [200, 10, 200, 150], "elles se balancent autour du haut du tronc (origine : zones.origine)"],
      ["plage_devant", "Plage au couchant : le devant (feuilles dans les coins)", [360, 90], () => `<g transform="translate(0 -270)">${devant()}</g>`, [0, 270, 360, 90], "par-dessus le personnage (rien devant ses pieds)"],
      ["plage_lanterne", "Plage au couchant : la lanterne", [28, 40], lanterne, [LANTERNE[0] - 14, LANTERNE[1] - 38, 28, 40], "devant le personnage, à sa droite ; sa lueur vacille dans le jeu"],
      ["plage_brume", "Plage au couchant : une nappe de brume", [360, 100], brume, [0, 230, 360, 100], "le lever (elle s'ouvre sur le personnage) et le retour (au salut) ; une nappe basse, à ses pieds, qui dérive"]
    ];
    var SCENE = {
      taille: [360, 360],
      panorama: [X0, X1],
      bas: BAS,
      pieds: PIEDS,
      lanterne: LANTERNE,
      lune: LUNE_XY,
      horizon: HORIZON,
      rivage: RIVAGE,
      flaques: FLAQUES,
      origines: { plage_palmes_g: COURONNE_G, plage_palmes_d: COURONNE_D }
    };
    module.exports = { CALQUES, SCENE };
  }
});

// atelier/plage_feuille.js
var require_plage_feuille = __commonJS({
  "atelier/plage_feuille.js"(exports, module) {
    var { OUT, P, clip, r2 } = require_troupe2();
    var { W, rr, rond, trait, plaque, etincelle } = require_hud();
    var BF = { clair: "#E4E0D4", corps: "#ABA597", ombre: "#7A746A", fonce: "#58534B", veine: "#C9C4B6" };
    var VOILE = { corps: "rgba(66,34,66,.86)", ombre: "rgba(46,22,48,.9)", clair: "rgba(112,64,106,.6)", couture: "#8C5888" };
    var VOILE_SOMBRE = { corps: "rgba(42,20,44,.9)", ombre: "rgba(30,14,32,.92)", clair: "rgba(76,40,76,.6)" };
    var VOILE_CLAIRE = { corps: "#6A3C68", ombre: "#55304F", clair: "#7E4C7A" };
    var NUIT = { clair: "#925A8C", corps: "#643A64", ombre: "#46264A" };
    var LANTERNE = { clair: "#FFEAB0", corps: "#F7C462", ombre: "#D58E32", fonce: "#A0601E" };
    var ETEINTE = { clair: "#E8E6DE", corps: "#CFCBC0", ombre: "#ABA597" };
    var CORDE = { corps: "#CDB78C", ombre: "#8F7652" };
    var VERRE = "#4FA89A";
    var noeud = /* @__PURE__ */ __name((x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(1.5 * s)}" ry="${r2(0.8 * s)}" fill="${BF.ombre}"/><ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(0.6 * s)}" ry="${r2(0.3 * s)}" fill="${BF.fonce}"/>`, "noeud");
    function ligature(x, y, a) {
      let s = `<g transform="rotate(${a} ${x} ${y})">`;
      for (const dx of [-3.1, 0, 3.1]) {
        s += `<rect x="${r2(x + dx - 1.45)}" y="${r2(y - 5.4)}" width="2.9" height="10.8" rx="1.45" fill="${CORDE.corps}" stroke="${OUT}" stroke-width=".8"/>`;
        for (const t of [-3.2, -0.8, 1.6, 4]) s += trait(`M${r2(x + dx - 1.2)},${r2(y + t - 0.8)} L${r2(x + dx + 1.2)},${r2(y + t + 0.6)}`, CORDE.ombre, 0.55);
      }
      s += trait(`M${r2(x + 4.6)},${r2(y + 4.4)} Q${r2(x + 7)},${r2(y + 7)} ${r2(x + 6.4)},${r2(y + 9)}`, OUT, 2.4) + trait(`M${r2(x + 4.6)},${r2(y + 4.4)} Q${r2(x + 7)},${r2(y + 7)} ${r2(x + 6.4)},${r2(y + 9)}`, CORDE.corps, 1.2);
      return s + "</g>";
    }
    __name(ligature, "ligature");
    function veinage(w, h, r, rebord, l) {
      const bh = rebord, ond = /* @__PURE__ */ __name((x0, x1, y, a, k) => {
        let d = `M${r2(x0)},${r2(y)}`;
        const n = Math.max(2, Math.round((x1 - x0) / 9));
        for (let i = 0; i < n; i++) {
          const xa = x0 + (i + 0.5) / n * (x1 - x0), xb = x0 + (i + 1) / n * (x1 - x0);
          d += ` Q${r2(xa)},${r2(y + (i % 2 ? a : -a) * k)} ${r2(xb)},${r2(y)}`;
        }
        return d;
      }, "ond");
      const ondV = /* @__PURE__ */ __name((y0, y1, x, a) => {
        let d = `M${r2(x)},${r2(y0)}`;
        const n = Math.max(2, Math.round((y1 - y0) / 9));
        for (let i = 0; i < n; i++) {
          const ya = y0 + (i + 0.5) / n * (y1 - y0), yb = y0 + (i + 1) / n * (y1 - y0);
          d += ` Q${r2(x + (i % 2 ? a : -a))},${r2(ya)} ${r2(x)},${r2(yb)}`;
        }
        return d;
      }, "ondV");
      let s = "";
      for (const [y, c, a] of [[bh * 0.35 + 0.8, BF.veine, 0.4], [bh * 0.7 + 0.8, BF.ombre, 0.35]]) s += trait(ond(r, w - r, y, a, 1), c, 0.45);
      for (const [y, c, a] of [[h - l - bh * 0.4, BF.veine, 0.4], [h - l - bh * 0.75, BF.ombre, 0.35]]) s += trait(ond(r, w - r, y, a, 1), c, 0.45);
      for (const [x, c] of [[bh * 0.4 + 0.6, BF.veine], [bh * 0.72 + 0.6, BF.ombre], [w - bh * 0.4 - 0.6, BF.veine], [w - bh * 0.72 - 0.6, BF.ombre]]) s += trait(ondV(r, h - r - l, x, 0.35), c, 0.45);
      return s;
    }
    __name(veinage, "veinage");
    var plaqueBF = /* @__PURE__ */ __name((id, w, h, o = {}) => plaque(id, w, h, { bois: BF, face: VOILE, clous: false, ...o }) + veinage(w, h, o.r || 10, o.rebord || 4, o.enfonce ? 1 : o.levre || 3) + (o.noeud === false ? "" : noeud(Math.max((o.r || 10) * 0.7, 3.4), h - (o.levre || 3) - (o.rebord || 4) * 0.55, 0.8)), "plaqueBF");
    function boutonBF(id, w, h, etat, { r = 14, face = LANTERNE } = {}) {
      const f = etat === "desactive" ? ETEINTE : face, enf = etat === "appuye" ? 2.4 : 0;
      const lev = 4, reb = 3, O = rr(0.7, 0.7, w - 1.4, h - 1.4, r);
      let s = P(O, BF.ombre, 0) + clip(`${id}o`, O, `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - (enf ? 1.4 : lev), r)}" fill="${BF.corps}"/>` + trait(`M${r2(r)},2.2 L${r2(w - r)},2.2`, BF.clair, 1) + trait(`M${r2(r + 4)},${r2(h - lev - 1.2)} L${r2(w - r - 8)},${r2(h - lev - 1.2)}`, BF.veine, 0.5)) + P(O, "none", W);
      const fy = reb + enf, fh = h - 2 * reb - (enf ? 1.4 : lev) - enf + 0.6;
      const F = rr(reb, fy, w - 2 * reb, fh, r - reb * 0.7);
      s += P(F, f.ombre, 0) + clip(`${id}f`, F, `<path d="${rr(reb, fy, w - 2 * reb, fh - 2.6, r - reb * 0.7)}" fill="${f.corps}"/><rect x="0" y="${r2(fy + 1.4)}" width="${w}" height="${r2(Math.max(fh * 0.28, 3))}" fill="${f.clair}" opacity=".75"/>` + trait(`M${r2(r)},${r2(fy + 2.2)} L${r2(w - r)},${r2(fy + 2.2)}`, "#FFFFFF", 1.1) + (f === LANTERNE ? `<ellipse cx="${w / 2}" cy="${r2(fy + fh * 0.55)}" rx="${r2(w * 0.42)}" ry="${r2(fh * 0.38)}" fill="#FFF3C8" opacity=".35"/>` : "")) + P(F, "none", 1);
      return s;
    }
    __name(boutonBF, "boutonBF");
    function onglet(actif) {
      const w = 64, h = 38, id = `fon${actif ? "a" : "r"}`;
      const O = `M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h} Z`;
      const F = `M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h} Z`;
      const f = actif ? VOILE : VOILE_SOMBRE;
      const bord = /* @__PURE__ */ __name((d) => d.replace(/ Z$/, ""), "bord");
      return P(O, BF.corps, 0) + clip(`${id}o`, O, trait(`M12,2.2 L${w - 12},2.2`, BF.clair, 1) + noeud(6, 22, 0.7)) + `<path d="${bord(O)}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>` + P(F, f.corps, 0) + clip(`${id}f`, F, actif ? trait(`M10,4.6 L${w - 10},4.6`, LANTERNE.corps, 1.6) + `<rect x="0" y="5.4" width="${w}" height="6" fill="${LANTERNE.corps}" opacity=".12"/>` : `<rect x="0" y="3" width="${w}" height="2.6" fill="${f.ombre}"/>`) + `<path d="${bord(F)}" fill="none" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` + (actif ? etincelle(w - 7, 8.4, 1.2) : "");
    }
    __name(onglet, "onglet");
    var choix = /* @__PURE__ */ __name((actif) => plaqueBF(`fch${actif ? "a" : "r"}`, 56, 34, { r: 12, rebord: 3, levre: 2.4, face: actif ? LANTERNE : VOILE_CLAIRE, noeud: false }) + (actif ? rond(49.6, 6.6, 5, VERRE, 1) + trait("M47.2,6.8 L49,8.6 L52,5", "#FFFFFF", 1.3) : ""), "choix");
    function nuancier(etat) {
      if (etat === "aucun") return rond(17, 17, 15.2, BF.corps, W) + rond(17, 17, 11, VOILE_CLAIRE.corps, 1) + trait("M10,24 L24,10", "#E0705E", 2);
      const c = etat === "actif" ? LANTERNE : BF;
      const anneau = "M1.8,17 A15.2,15.2 0 1 0 32.2,17 A15.2,15.2 0 1 0 1.8,17 Z M6,17 A11,11 0 1 1 28,17 A11,11 0 1 1 6,17 Z";
      return `<path d="${anneau}" fill="${c.corps}" fill-rule="evenodd" stroke="${OUT}" stroke-width="${W}"/>` + trait("M6.4,10.4 Q9.4,4.6 15.6,3.4", c.clair, 1.2) + (etat === "actif" ? etincelle(29, 5, 1.4) : trait("M23,30.4 Q27.6,28.6 30,25", BF.ombre, 0.8));
    }
    __name(nuancier, "nuancier");
    function panneau() {
      const w = 96, h = 96;
      let s = plaqueBF("fpa", w, h, { r: 14, rebord: 6, levre: 3, noeud: false });
      s += trait("M14,11 L82,11", VOILE.couture, 0.6) + trait("M14,12.4 L82,12.4", VOILE.couture, 0.35) + trait("M14,83 L82,83", VOILE.couture, 0.6) + trait("M16,8.6 L80,8.6", "#FFD6E0", 0.5).replace("/>", ' opacity=".35"/>');
      return s + ligature(7, 7, -45) + ligature(89, 7, 45) + ligature(7, 87, 225) + ligature(89, 87, 135);
    }
    __name(panneau, "panneau");
    function tourner(droite) {
      let s = rond(22, 22.6, 20, BF.ombre, W) + rond(22, 21.6, 19.6, BF.corps, 0) + rond(22, 22, 15.4, NUIT.corps, 1) + trait("M9,14 Q12,8.6 18,7.4", BF.clair, 1.3) + noeud(33.6, 32.4, 0.7);
      const fleche = trait("M28.6,27.4 A8.4,8.4 0 1 1 29.4,17", OUT, 4.2) + trait("M28.6,27.4 A8.4,8.4 0 1 1 29.4,17", BF.clair, 2) + P("M25.4,15.4 L31.6,12.2 L31.8,19.2 Z", BF.clair, 1);
      return s + (droite ? `<g transform="translate(44 0) scale(-1 1)">${fleche}</g>` : fleche);
    }
    __name(tourner, "tourner");
    function hasard() {
      let s = boutonBF("fha", 100, 40, "repos", { r: 14, face: NUIT });
      s += `<g transform="rotate(-14 17 17.4)">${P(rr(9.6, 10, 14.8, 14.8, 3.4), "#FFFFFF", 1.1)}${P(rr(9.6, 21, 14.8, 3.8, 1.8), "#E6DCCB", 0)}` + [[13.4, 13.8], [17, 17.4], [20.6, 21]].map(([x, y]) => rond(x, y, 1.15, "#C9483A", 0)).join("") + "</g>";
      return s;
    }
    __name(hasard, "hasard");
    var bouton = /* @__PURE__ */ __name((etat) => () => boutonBF(`fbo${etat[0]}`, 96, 44, etat, { r: 18 }), "bouton");
    var boutonVoile = /* @__PURE__ */ __name((etat) => () => plaqueBF(`fbv${etat[0]}`, 64, 36, { r: 12, rebord: 3.2, levre: 3, face: etat === "appuye" ? VOILE_SOMBRE : NUIT, enfonce: etat === "appuye" ? 2 : 0, noeud: false }), "boutonVoile");
    var PIECES2 = [
      ["feuille_onglet_repos", "Onglet de la plage (au repos)", [64, 38], [14, 16, 2, 16], () => onglet(false), "un onglet de l'éditeur, sur la plage (avm__tab)"],
      ["feuille_onglet_actif", "Onglet de la plage (ouvert)", [64, 38], [14, 16, 2, 16], () => onglet(true), "l'onglet ouvert (avm__tab.is-on)"],
      ["feuille_choix_repos", "Cadre d'un choix, bois flotté (au repos)", [56, 34], [12, 14, 14, 14], () => choix(false), "une vignette de l'éditeur (avm__thumb-art)"],
      ["feuille_choix_actif", "Cadre d'un choix, bois flotté (choisi)", [56, 34], [12, 14, 14, 14], () => choix(true), "la vignette retenue (avm__thumb.is-on)"],
      ["feuille_nuancier_repos", "Nuancier de bois flotté (au repos)", [34, 34], null, () => nuancier("repos"), "une couleur à choisir (avm__swatch) : la couleur en CSS dessous"],
      ["feuille_nuancier_actif", "Nuancier de bois flotté (choisi)", [34, 34], null, () => nuancier("actif"), "la couleur retenue (avm__swatch.is-on)"],
      ["feuille_nuancier_aucun", "Nuancier « aucune couleur », bois flotté", [34, 34], null, () => nuancier("aucun"), "le choix « aucune couleur » (avm__swatch.is-none)"],
      ["feuille_panneau", "Panneau de voile dans son bois flotté", [96, 96], [16, 16, 19, 16], panneau, "la liste des choix de l'éditeur (avm__panel)"],
      ["feuille_tourner_gauche", "Tourner à gauche, bois flotté", [44, 44], null, () => tourner(false), "faire tourner l'aperçu vers la gauche (avm__turn--left)"],
      ["feuille_tourner_droite", "Tourner à droite, bois flotté", [44, 44], null, () => tourner(true), "faire tourner l'aperçu vers la droite (avm__turn--right)"],
      ["feuille_hasard", "« Au hasard », bois flotté", [100, 40], [14, 18, 16, 34], hasard, "le bouton « Au hasard » (avm__luck), le texte à droite du dé"],
      ...["repos", "appuye", "desactive"].map((e) => [`feuille_bouton_${e}`, `Plaque d'or de lanterne (${e === "repos" ? "au repos" : e === "appuye" ? "appuyée" : "éteinte"})`, [96, 44], [16, 22, 20, 22], bouton(e), "le geste principal de l'éditeur : « C'est moi », « Garder » (pav__ok)"]),
      ...["repos", "appuye"].map((e) => [`feuille_voile_${e}`, `Bouton de voile (${e === "repos" ? "au repos" : "appuyé"})`, [64, 36], [12, 14, 14, 14], boutonVoile(e), "le geste secondaire de l'éditeur : « Annuler », « Retour » (pav__back)"])
    ];
    module.exports = { PIECES: PIECES2, BF, VOILE, LANTERNE };
  }
});

// atelier/perso.js
var require_perso = __commonJS({
  "atelier/perso.js"(exports, module) {
    var { OUT, P, E, clip, r2 } = require_troupe2();
    var { BOIS, PAPIER, OR, W, rr, rond, trait, clou, etincelle, plaque, bouton, HD: HD2 } = require_hud();
    var ROUGE = { corps: "#C9483A", ombre: "#9C3428", clair: "#E27A68" };
    var VERT = "#5E9A3C";
    function estrade() {
      let s = `<rect x="0" y="0" width="240" height="180" fill="#F3E3C4"/>` + E(120, 118, 96, 70, "#FBF0D8", 0) + E(120, 104, 54, 52, "#FFF8E8", 0);
      s += `<rect x="0" y="150" width="240" height="30" fill="${BOIS.corps}"/>` + trait("M0,150 L240,150", OUT, 1.2) + trait("M0,162 L240,162 M0,172 L240,172", BOIS.ombre, 0.6);
      s += P("M50,154 L50,162 Q120,182 190,162 L190,154 Z", BOIS.ombre, W) + E(120, 154, 70, 14, BOIS.clair, W);
      s += `<clipPath id="pes"><ellipse cx="120" cy="154" rx="70" ry="14"/></clipPath><g clip-path="url(#pes)">${[94, 120, 146].map((x) => trait(`M${x},139 L${x},169`, BOIS.veine, 0.7)).join("")}${E(104, 149, 30, 4, "rgba(255,255,255,.45)", 0)}</g>`;
      s += E(120, 154, 36, 7, "rgba(255,240,190,.55)", 0);
      const rideau = /* @__PURE__ */ __name((m) => {
        const X = /* @__PURE__ */ __name((x) => r2(m ? 240 - x : x), "X");
        const d = `M${X(0)},0 L${X(58)},0 Q${X(52)},52 ${X(32)},98 Q${X(46)},132 ${X(30)},180 L${X(0)},180 Z`;
        return P(d, ROUGE.corps, 0) + clip(`per${m ? "d" : "g"}`, d, `<path d="M${X(0)},0 L${X(14)},0 Q${X(12)},90 ${X(8)},180 L${X(0)},180 Z" fill="${ROUGE.ombre}"/>` + trait(`M${X(26)},4 Q${X(24)},60 ${X(20)},96 M${X(40)},4 Q${X(36)},56 ${X(28)},98 M${X(20)},104 Q${X(26)},140 ${X(18)},178 M${X(34)},108 Q${X(38)},144 ${X(28)},178`, ROUGE.ombre, 1.1) + trait(`M${X(46)},6 Q${X(42)},50 ${X(30)},94`, ROUGE.clair, 1.2)) + P(d, "none", W) + E(Number(X(33)), 99, 7, 3.4, OR.corps, 1) + E(Number(X(33)), 99, 3, 1.4, OR.clair, 0) + trait(`M${X(30)},102 Q${X(28)},110 ${X(31)},114 M${X(36)},102 Q${X(38)},110 ${X(35)},114`, OR.ombre, 1.2);
      }, "rideau");
      s += rideau(false) + rideau(true);
      return s + lambrequin();
    }
    __name(estrade, "estrade");
    function lambrequin() {
      let v = "M0,0 L240,0 L240,14";
      for (let x = 240; x > 0; x -= 24) v += ` Q${x - 12},26 ${x - 24},14`;
      let s = P(v + " Z", ROUGE.ombre, W) + trait("M0,10 L240,10", OR.corps, 1.4);
      for (let x = 12; x < 240; x += 24) s += rond(x, 21.6, 1.6, OR.corps, 0.7);
      return s;
    }
    __name(lambrequin, "lambrequin");
    function rideauPan() {
      const w = 120, h = 240, creux = "#7E2A20";
      let s = `<rect x="0" y="0" width="${w}" height="${h}" fill="${ROUGE.corps}"/>`;
      for (let i = 0; i < 6; i++) {
        const x = 12 + i * 19;
        s += P(`M${x + 6},0 Q${x + 7.4},${h / 2} ${x + 4.6},${h} L${x + 12.4},${h} Q${x + 11.6},${h / 2} ${x + 11},0 Z`, ROUGE.clair, 0).replace("fill=", 'fill-opacity=".45" fill=') + P(`M${x - 2.6},0 Q${x - 1.8},${h / 2} ${x - 6.4},${h} L${x + 6.4},${h} Q${x + 1.8},${h / 2} ${x + 2.6},0 Z`, ROUGE.ombre, 0) + trait(`M${x},0 Q${x + 0.2},${h / 2} ${x - 0.4},${h}`, creux, 1.3) + trait(`M${x + 8.6},0 Q${x + 9.4},${h / 2} ${x + 8.2},${h}`, ROUGE.clair, 1.4);
      }
      s += `<rect x="0" y="${h - 12}" width="${w}" height="12" fill="${creux}" opacity=".35"/><rect x="0" y="0" width="7" height="${h}" fill="${ROUGE.ombre}"/>` + trait(`M${w - 4},0 L${w - 4},${h}`, ROUGE.clair, 1.2) + trait(`M${w - 0.8},0 L${w - 0.8},${h}`, OUT, W);
      return s;
    }
    __name(rideauPan, "rideauPan");
    function frange() {
      let s = `<rect x="0" y="0.8" width="24" height="4.6" fill="${OR.corps}"/>` + trait("M0,2.6 L24,2.6", OR.clair, 0.9) + trait("M0,0.8 L24,0.8 M0,5.4 L24,5.4", OUT, 1);
      for (const x of [4, 12, 20]) {
        s += P(`M${x - 1.8},5.4 L${x - 2.6},13.6 Q${x},15.4 ${x + 2.6},13.6 L${x + 1.8},5.4 Z`, OR.corps, 0.9) + trait(`M${x - 0.7},6.8 L${x - 1.1},13.2 M${x + 0.7},6.8 L${x + 1.1},13.2`, OR.ombre, 0.6);
      }
      return s;
    }
    __name(frange, "frange");
    function onglet(actif) {
      const w = 64, h = 38, id = `pon${actif ? "a" : "r"}`;
      const O = `M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h} Z`;
      const F = `M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h} Z`;
      const f = actif ? OR : PAPIER;
      return P(O, BOIS.corps, 0) + clip(`${id}o`, O, trait(`M12,2.2 L${w - 12},2.2`, BOIS.clair, 1)) + P(O, "none", W).replace(`d="${O}"`, `d="M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h}"`) + P(F, f.corps, 0) + clip(`${id}f`, F, `<rect x="0" y="3" width="${w}" height="2.6" fill="${f.ombre}"/>`) + P(F, "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="1"`).replace(`d="${F}"`, `d="M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h}"`) + (actif ? etincelle(w - 7, 7.4, 1.2) : "");
    }
    __name(onglet, "onglet");
    var choix = /* @__PURE__ */ __name((actif) => plaque(`pch${actif ? "a" : "r"}`, 56, 34, { r: 12, rebord: 3, levre: 2.4, face: actif ? OR : PAPIER, clous: false }) + (actif ? rond(49.6, 6.6, 5, VERT, 1) + trait("M47.2,6.8 L49,8.6 L52,5", "#FFFFFF", 1.3) : ""), "choix");
    function nuancier(etat) {
      if (etat === "aucun") return rond(17, 17, 15.2, BOIS.corps, W) + rond(17, 17, 11, PAPIER.corps, 1) + trait("M10,24 L24,10", ROUGE.corps, 2);
      const c = etat === "actif" ? OR : BOIS;
      const anneau = "M1.8,17 A15.2,15.2 0 1 0 32.2,17 A15.2,15.2 0 1 0 1.8,17 Z M6,17 A11,11 0 1 1 28,17 A11,11 0 1 1 6,17 Z";
      return `<path d="${anneau}" fill="${c.corps}" fill-rule="evenodd" stroke="${OUT}" stroke-width="${W}"/>` + trait("M6.4,10.4 Q9.4,4.6 15.6,3.4", c.clair, 1.2) + (etat === "actif" ? etincelle(29, 5, 1.4) : "");
    }
    __name(nuancier, "nuancier");
    function tourner(droite) {
      let s = rond(22, 22.6, 20, BOIS.ombre, W) + rond(22, 21.6, 19.6, BOIS.corps, 0) + rond(22, 22, 15.4, PAPIER.corps, 1) + trait("M9,14 Q12,8.6 18,7.4", BOIS.clair, 1.3);
      const fleche = trait("M28.6,27.4 A8.4,8.4 0 1 1 29.4,17", OUT, 4.2) + trait("M28.6,27.4 A8.4,8.4 0 1 1 29.4,17", BOIS.corps, 2) + P("M25.4,15.4 L31.6,12.2 L31.8,19.2 Z", BOIS.corps, 1);
      return s + (droite ? `<g transform="translate(44 0) scale(-1 1)">${fleche}</g>` : fleche);
    }
    __name(tourner, "tourner");
    function hasard() {
      let s = bouton("pha", 100, 40, "repos", { r: 14 });
      s += `<g transform="rotate(-14 17 17.4)">${P(rr(9.6, 10, 14.8, 14.8, 3.4), "#FFFFFF", 1.1)}${P(rr(9.6, 21, 14.8, 3.8, 1.8), "#E6DCCB", 0)}` + [[13.4, 13.8], [17, 17.4], [20.6, 21]].map(([x, y]) => rond(x, y, 1.15, ROUGE.corps, 0)).join("") + "</g>";
      return s;
    }
    __name(hasard, "hasard");
    var panneau = /* @__PURE__ */ __name(() => plaque("ppa", 96, 96, { r: 14, rebord: 6, levre: 3 }), "panneau");
    function ruban() {
      let s = P("M0,14 L22,14 L22,34 L0,34 L8,24 Z", ROUGE.ombre, W) + P("M140,14 L118,14 L118,34 L140,34 L132,24 Z", ROUGE.ombre, W);
      s += P("M22,34 L28,30 L28,38 Z", "#7A2A20", 1) + P("M118,34 L112,30 L112,38 Z", "#7A2A20", 1);
      const B = "M16,6 L124,6 L124,30 L16,30 Z";
      s += P(B, ROUGE.corps, 0) + clip("pru", B, `<rect x="16" y="25" width="108" height="5" fill="${ROUGE.ombre}"/>` + trait("M16,9.4 L124,9.4", ROUGE.clair, 1.2)) + P(B, "none", W);
      return s + trait("M16,12 L124,12 M16,26 L124,26", OR.corps, 0.9) + rond(19.4, 18, 1.1, OR.corps, 0.6) + rond(120.6, 18, 1.1, OR.corps, 0.6);
    }
    __name(ruban, "ruban");
    var tuileCompteur = /* @__PURE__ */ __name(() => plaque("ptu", 72, 60, { r: 11, rebord: 4.4 }), "tuileCompteur");
    var ligne = /* @__PURE__ */ __name((etat) => () => {
      const enf = etat === "appuye" ? 2 : 0;
      return plaque(`pli${etat[0]}`, 160, 52, { r: 12, rebord: 4, enfonce: enf, clous: false }) + trait(`M142,${17 + enf} L148,${24 + enf} L142,${31 + enf}`, OUT, 3.6) + trait(`M142,${17 + enf} L148,${24 + enf} L142,${31 + enf}`, BOIS.corps, 1.6);
    }, "ligne");
    var barreFond = /* @__PURE__ */ __name(() => P(rr(0.7, 0.7, 62.6, 12.6, 6.3), BOIS.fonce, W) + P(rr(2.6, 2.6, 58.8, 8.8, 4.4), "#4E331C", 0) + `<rect x="8" y="2.8" width="48" height="1.4" fill="#2E1E10" opacity=".6"/>`, "barreFond");
    var barrePlein = /* @__PURE__ */ __name(() => {
      const d = rr(0.7, 0.7, 62.6, 12.6, 6.3);
      return P(d, OR.corps, 0) + clip("pbp", d, `<rect x="0" y="8.6" width="64" height="6" fill="${OR.ombre}"/>` + trait("M7,3.8 L57,3.8", OR.clair, 1.6)) + P(d, "none", 1.1);
    }, "barrePlein");
    var CE = require_carte_embarquement();
    var PL = require_plage_loge();
    var PIECES2 = [
      ["estrade", "Estrade de l'aperçu", [240, 180], null, estrade, "le fond de l'aperçu en pied de l'éditeur (avm__stage), en background cover ; les pieds de l'avatar au centre du plateau", { pieds: [120, 154] }],
      ["rideau", "Rideau de scène (un pan)", [120, 240], null, rideauPan, "le rideau qui s'ouvre et se ferme sur l'estrade (avm__drape) : le pan gauche, en background cover depuis le haut ; le droit en miroir"],
      ["frange", "Frange du rideau", [24, 16], null, frange, "la frange dorée au bas du rideau (avm__drape), répétée en largeur"],
      ["lambrequin", "Lambrequin de l'estrade", [240, 28], null, lambrequin, "le lambrequin seul, posé par-dessus le rideau au même endroit que celui du fond de l'estrade (avm__valance)"],
      // la plage au couchant (plage_loge.js) : les calques du fond de l'éditeur, chacun à sa place dans la scène
      ...PL.CALQUES.map(([id, nom, taille, dessin, place, sert], i) => [id, nom, taille, null, dessin, sert, i === 0 ? { place, scene: PL.SCENE } : { place }]),
      // la feuille des choix sur la plage : bois flotté et voile (plage_feuille.js)
      ...require_plage_feuille().PIECES,
      ["onglet_repos", "Onglet (au repos)", [64, 38], [14, 16, 2, 16], () => onglet(false), "un onglet de l'éditeur : Corps, Visage, Cheveux, Tenue, Objets (avm__tab)"],
      ["onglet_actif", "Onglet (actif)", [64, 38], [14, 16, 2, 16], () => onglet(true), "l'onglet ouvert (avm__tab.is-on)"],
      ["choix_repos", "Pastille d'un choix (au repos)", [56, 34], [12, 14, 14, 14], () => choix(false), "un choix de l'éditeur (avm__chip)"],
      ["choix_actif", "Pastille d'un choix (choisie)", [56, 34], [12, 14, 14, 14], () => choix(true), "le choix retenu (avm__chip.is-on)"],
      ["nuancier_repos", "Cadre d'un nuancier (au repos)", [34, 34], null, () => nuancier("repos"), "une couleur à choisir (avm__swatch) : la couleur en CSS dessous, un rond de 22 px au centre"],
      ["nuancier_actif", "Cadre d'un nuancier (choisi)", [34, 34], null, () => nuancier("actif"), "la couleur retenue (avm__swatch.is-on)"],
      ["nuancier_aucun", "Nuancier « aucune couleur »", [34, 34], null, () => nuancier("aucun"), "le choix « aucune couleur » (avm__swatch.is-none)"],
      ["tourner_gauche", "Bouton « tourner à gauche »", [44, 44], null, () => tourner(false), "faire tourner l'aperçu vers la gauche (avm__turn--left)"],
      ["tourner_droite", "Bouton « tourner à droite »", [44, 44], null, () => tourner(true), "faire tourner l'aperçu vers la droite (avm__turn--right)"],
      ["hasard", "Bouton « Au hasard »", [100, 40], [14, 18, 16, 34], hasard, "le bouton « Au hasard » (avm__luck), le texte à droite du dé"],
      ["panneau", "Panneau de parchemin", [96, 96], [16, 16, 19, 16], panneau, "la liste des choix de l'éditeur (avm__panel), les blocs de la page du Sceau (g-panel)"],
      ["ruban", "Ruban du nom", [140, 40], [8, 30, 12, 30], ruban, "le nom du joueur sous son sceau (sceau__name)"],
      ["tuile_compteur", "Tuile d'un compteur", [72, 60], [13, 14, 16, 14], tuileCompteur, "Registre, Succès, Records (sceau__stat)"],
      ["ligne_repos", "Ligne de menu (au repos)", [160, 52], [14, 26, 16, 14], ligne("repos"), "Mon compte, le Cabinet, les Succès, le prologue, écrire aux créateurs (sceau__row)"],
      ["ligne_appuye", "Ligne de menu (appuyée)", [160, 52], [14, 26, 16, 14], ligne("appuye"), "la ligne qu'on touche"],
      ["barre_fond", "Barre de progression (fond)", [64, 14], [6, 7, 6, 7], barreFond, "la rainure d'une barre (g-bar), les branches du sceau"],
      ["barre_plein", "Barre de progression (remplie)", [64, 14], [6, 7, 6, 7], barrePlein, "le remplissage d'une barre, posé sur le fond à la largeur voulue"],
      ["carte_embarquement", "Carte d'embarquement (neuve)", [320, 210], null, () => CE.carte("neuve"), "la carte d'embarquement du prologue (étapes 0a, 0b) : la photo dans son tirage, le nom sur sa ligne", CE.ZONES],
      ["carte_embarquement_tampon", "Carte d'embarquement (tamponnée « EMBARQUÉ »)", [320, 210], null, () => CE.carte("tampon"), "la carte tamponnée, juste avant que le vent l'emporte (étape 0c)", CE.ZONES],
      ["carte_embarquement_trempee", "Carte d'embarquement (trempée par le naufrage)", [320, 210], null, () => CE.carte("trempee"), "la carte sortie trempée d'une poche, au réveil sur la plage de Brumelune : encre coulée, coin déchiré, taches d'eau", CE.ZONES]
    ];
    module.exports = { PIECES: PIECES2, HD: HD2 };
  }
});

// atelier/generateur_perso.mjs
var import_perso = __toESM(require_perso(), 1);
var PIECES = Object.fromEntries(import_perso.default.PIECES.map(([id, nom, taille, tranche, , sert, zones]) => [id, { nom, sert, taille, tranche, zones: zones || null }]));
var HD = import_perso.default.HD;
function piece(id, hd = import_perso.default.HD) {
  const p = import_perso.default.PIECES.find((x) => x[0] === id);
  if (!p) throw new Error(`pièce inconnue : ${id} (${Object.keys(PIECES).join(", ")})`);
  const [w, h] = p[2], cadre = [0, 0, w, h];
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w * hd}" height="${h * hd}" viewBox="${cadre.join(" ")}">${p[4]()}</svg>`, cadre, ms_par_image: null };
}
__name(piece, "piece");
function liste() {
  return import_perso.default.PIECES.map(([id]) => ({ fichier: `perso/${id}.svg`, fonction: "piece", args: [id] }));
}
__name(liste, "liste");
export {
  HD,
  PIECES,
  liste,
  piece
};
