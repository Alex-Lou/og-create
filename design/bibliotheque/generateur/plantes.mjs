// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_plantes.mjs : ne pas modifier à la main.
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
    var L2 = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L2(a, b, OUT, w + W * 2) + L2(a, b, fill, w), "limb");
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
    function lumiere(c, id) {
      const couleurs = /* @__PURE__ */ new Set();
      for (const k of PRINCIPALES) if (typeof c[k] === "string" && /^#[0-9A-Fa-f]{6}$/.test(c[k])) couleurs.add(c[k].toUpperCase());
      for (const k of c.teintes || []) couleurs.add(k.toUpperCase());
      for (const cols of Object.values(c.acc || {})) for (const k of cols) if (/^#[0-9A-Fa-f]{6}$/.test(k)) couleurs.add(k.toUpperCase());
      couleurs.delete("#FFFFFF");
      couleurs.delete(OUT);
      const habits = new Set(["top", "bas", "leg", "sleeve", "coat", "base"].map((k) => typeof c[k] === "string" ? c[k].toUpperCase() : null));
      let defs = "";
      const table = /* @__PURE__ */ new Map();
      let i = 0;
      for (const h of couleurs) {
        const g = `${id}G${i++}`;
        const l = hsl(h)[2];
        const clair = ton(h, l > 0.85 ? 1.12 : 1.28), sombre = ton(h, l < 0.25 ? 0.68 : 0.74);
        const stops = `<stop offset="0" stop-color="${clair}"/><stop offset="0.45" stop-color="${h}"/><stop offset="1" stop-color="${sombre}"/>`;
        defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0.75" y2="1">${stops}</linearGradient><linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="${habits.has(h) ? 6 : 4}" y1="${habits.has(h) ? 28 : 2}" x2="42" y2="60">${stops}</linearGradient>`;
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
    var EXPRS = ["neutre", "content", "rire", "surpris", "triste", "fache", "gene", "endormi"];
    var BROW = {
      neutre: [0, 0.1, -0.6],
      content: [-0.3, -0.2, -0.7],
      rire: [-0.6, -0.4, -0.8],
      surpris: [-1.4, -1.1, -1],
      triste: [-1.1, 0.6, 0],
      fache: [1.1, -0.6, 0],
      gene: [-0.7, 0.3, -0.2],
      endormi: [0.4, 0.4, -0.3]
    };
    var EYEMODE = { rire: "joy", endormi: "blink", surpris: "big", gene: "squeeze", triste: "sad", fache: "angry" };
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
      const [bi, bo, arch] = BROW[expr];
      for (const [x, y, rx] of g.eyes) {
        const k = cx > x ? 1 : -1, hw = rx + 0.45, by = y + g.browY;
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
      if (expr === "gene") {
        for (const [x, rx] of g.cheeks) for (const d of [-0.5, 0, 0.5]) s += L2([x + d * rx * 1.2 - 0.35, g.cheekY + 0.55], [x + d * rx * 1.2 + 0.35, g.cheekY - 0.55], "#D9605A", 0.45);
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
    function shoe(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 3)},${r2(y)} L${r2(x + 3)},${r2(y)} L${r2(x + 3.3)},${r2(y + 3.6)} Q${r2(x - 0.4)},${r2(y + 5.4)} ${r2(x - 3.3 - toe)},${r2(y + 3.8)} Z`;
      const sole = `M${r2(x - 3.4 - toe)},${r2(y + 3.3)} Q${r2(x - 0.4)},${r2(y + 5)} ${r2(x + 3.4)},${r2(y + 3.1)} L${r2(x + 3.4)},${r2(y + 5.6)} L${r2(x - 3.4 - toe)},${r2(y + 5.6)} Z`;
      const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 2.3)},${r2(y)} L${r2(x + 2.3)},${r2(y)} Q${r2(x + 2.9)},${r2(y + 3.4)} ${r2(x + 1.4)},${r2(y + 4.3)} L${r2(x - 1.4 - toe)},${r2(y + 4.3)} Q${r2(x - 3.1 - toe)},${r2(y + 3.8)} ${r2(x - 2.3)},${r2(y)} Z`;
      let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L2([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
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
            s += L2([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L2(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT, 1.5) + L2(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
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
      const ly = c.ground + (walk ? ph > 0 ? ph : ph * 1.4 : 0);
      const ry = c.ground + (walk ? ph < 0 ? -ph : -ph * 1.4 : 0);
      const side = view === "se" ? -1 : 1;
      const lxx = r2(lx + (walk ? side * ph * 0.9 : 0));
      const rxx = r2(rx - (walk ? side * ph * 0.6 : 0));
      const tiltL = walk && ph < 0 && view !== "front" ? r2((view === "se" ? 14 : -14) * -ph) : 0;
      const tiltR = walk && ph > 0 && view !== "front" ? r2((view === "se" ? 14 : -14) * ph) : 0;
      const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
      const swing = -ph;
      const [shL, shR] = c.shoulders;
      const handL = [r2(c.hands[0][0] + swing * 0.9), r2(c.hands[0][1] + swing * 1.4)];
      const handR = [r2(c.hands[1][0] - swing * 0.9), r2(c.hands[1][1] - swing * 1.4)];
      const act = pose === "action" || pose === "salut" ? c.pose.call(cc, ctx) : null;
      const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
      const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : "";
      const armRight = act && act.right != null ? act.right : (c.holdOver ? "" : held) + arm(cc, shR, handR);
      ctx.expr = expr || act && act.expr || (pose === "salut" ? "content" : "neutre");
      ctx.eyeMode = expr ? null : act && act.eyeMode;
      ctx.open = !expr && act && act.open;
      ctx.blink = pose === "repos" && n % 4 === 3;
      const menton = view === "ne" ? "" : E(view === "se" ? 22.6 : 24, 33.6 + (c.dy || 0), (shR[0] - shL[0]) * 0.24, 1.1, "rgba(0,0,0,.13)", 0);
      let s = "";
      s += c.backItems ? c.backItems(cc, ctx) : "";
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
    module.exports = { OUT, W, r2, st, P, E, L: L2, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/deco.js
var require_deco = __commonJS({
  "atelier/deco.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var K = 1.25;
    var TW = 64 * K;
    var TH = 32 * K;
    var PROP = [-40 * K, -92 * K, 80 * K, 112 * K];
    var BUILDING = [-76 * K, -124 * K, 152 * K, 168 * K];
    var BIG = [-112 * K, -200 * K, 224 * K, 264 * K];
    var pt = /* @__PURE__ */ __name((u, v, z = 0) => [(u - v) * TW / 2, (u + v) * TH / 2 - z * K], "pt");
    var LEAVES = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
    var PINE = { light: "#86C774", mid: "#4F9A4C", dark: "#2F6E3A" };
    var WOOD = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
    var WOOD_DARK = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
    var GRANITE = { top: "#CBC6BA", left: "#A6A094", right: "#7E786E" };
    var poly = /* @__PURE__ */ __name((points, fill, w = 0.9) => `<polygon points="${points.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" ")}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`, "poly");
    var face = /* @__PURE__ */ __name((pts3, fill, w) => poly(pts3.map((p) => pt(...p)), fill, w), "face");
    var shadow = /* @__PURE__ */ __name((u, v, r, a = 0.22) => {
      const [x, y] = pt(u, v);
      return E(x, y, r * TW * 0.55, r * TH * 0.55, `rgba(40,55,20,${a})`, 0);
    }, "shadow");
    function box(u0, v0, u1, v1, z0, z1, c, w = 0.9) {
      return face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], c.left, w) + face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], c.right, w) + face([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], c.top, w);
    }
    __name(box, "box");
    function crown(blobs, c, id) {
      const out = blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r + 1.1)}" fill="${OUT}"/>`).join("");
      const base = blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${c.mid}"/>`).join("");
      const clipId = `cr${id}`;
      const clipPath = `<clipPath id="${clipId}">${blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}"/>`).join("")}</clipPath>`;
      const shade = blobs.map(([x, y, r]) => `<circle cx="${r2(x + r * 0.35)}" cy="${r2(y + r * 0.45)}" r="${r2(r * 0.85)}" fill="${c.dark}"/>`).join("");
      const lite = blobs.map(([x, y, r]) => `<circle cx="${r2(x - r * 0.25)}" cy="${r2(y - r * 0.3)}" r="${r2(r * 0.62)}" fill="${c.mid}"/>`).join("") + blobs.map(([x, y, r]) => `<circle cx="${r2(x - r * 0.4)}" cy="${r2(y - r * 0.45)}" r="${r2(r * 0.32)}" fill="${c.light}"/>`).join("");
      return out + base + `<defs>${clipPath}</defs><g clip-path="url(#${clipId})">${shade}${lite}</g>`;
    }
    __name(crown, "crown");
    function boulder(u, v, ru, rv, h, c, seed = 1) {
      const [x, y] = pt(u, v);
      const w = ru * TW * 0.78, d = rv * TH * 0.7, H = h * K;
      const j = /* @__PURE__ */ __name((k) => 1 + 0.14 * Math.sin(seed * 12.9898 + k * 78.233), "j");
      const path = `M${r2(x - w)},${r2(y)} Q${r2(x - w * 1.02)},${r2(y - H * 0.7 * j(1))} ${r2(x - w * 0.45)},${r2(y - H * j(2))} Q${r2(x + w * 0.1)},${r2(y - H * 1.12 * j(3))} ${r2(x + w * 0.62)},${r2(y - H * 0.78 * j(4))} Q${r2(x + w * 1.04)},${r2(y - H * 0.42)} ${r2(x + w)},${r2(y)} Q${x},${r2(y + d)} ${r2(x - w)},${r2(y)} Z`;
      const id = `rk${seed}_${[u, v, ru, rv, h].map(r2).join("_")}`.replace(/-/g, "m").replace(/\./g, "p");
      return `<path d="${path}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${r2(x + w * 0.55)}" cy="${r2(y - H * 0.1)}" rx="${r2(w * 0.8)}" ry="${r2(H * 0.75)}" fill="${c.right}"/><ellipse cx="${r2(x - w * 0.25)}" cy="${r2(y - H * 0.95)}" rx="${r2(w * 0.7)}" ry="${r2(H * 0.38)}" fill="${c.top}"/></g><path d="M${r2(x - w * 0.6)},${r2(y - H * 0.7)} Q${r2(x - w * 0.35)},${r2(y - H * 0.98)} ${r2(x + w * 0.05)},${r2(y - H * 1.02)}" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    }
    __name(boulder, "boulder");
    var flower = /* @__PURE__ */ __name((x, y, r, petal, heart = "#E8A13A") => [0, 72, 144, 216, 288].map((a) => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.78, r * 0.78, petal, 0.5)).join("") + E(x, y, r * 0.55, r * 0.55, heart, 0.4), "flower");
    var stroke = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
    var thick = /* @__PURE__ */ __name((d, w, color) => stroke(d, w + 2.2, OUT) + stroke(d, w, color), "thick");
    module.exports = { K, TW, TH, PROP, BUILDING, BIG, pt, poly, face, shadow, box, crown, boulder, flower, stroke, thick, LEAVES, PINE, WOOD, WOOD_DARK, GRANITE };
    function cylinder(u, v, r, z0, z1, c, w = 1) {
      const [x, y0] = pt(u, v, z0), [, y1] = pt(u, v, z1);
      const rx = r * TW * 0.7, ry = r * TH * 0.7;
      const side = `M${r2(x - rx)},${r2(y1)} L${r2(x - rx)},${r2(y0)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(x + rx)},${r2(y0)} L${r2(x + rx)},${r2(y1)} Z`;
      return `<path d="${side}" fill="${c.left}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/><path d="M${r2(x + rx * 0.15)},${r2(y1 + ry)} L${r2(x + rx * 0.15)},${r2(y0 + ry)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(x + rx)},${r2(y0)} L${r2(x + rx)},${r2(y1)} Z" fill="${c.right}"/><path d="${side}" fill="none" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>` + E(x, y1, rx, ry, c.top, w);
    }
    __name(cylinder, "cylinder");
    var disc = /* @__PURE__ */ __name((u, v, r, z, fill, w = 1) => {
      const [x, y] = pt(u, v, z);
      return E(x, y, r * TW * 0.7, r * TH * 0.7, fill, w);
    }, "disc");
    function gable(u0, v0, u1, v1, z, h, c, o = 0.08) {
      const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o;
      return face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], c.back, 1) + face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], c.gable, 1) + face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], c.front, 1);
    }
    __name(gable, "gable");
    function pyramid(u0, v0, u1, v1, z, h, c, o = 0.06) {
      const A = [u0 - o, v0 - o, z], B = [u1 + o, v0 - o, z], Cc = [u1 + o, v1 + o, z], Dd = [u0 - o, v1 + o, z], T = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
      return face([A, B, T], c.back, 1) + face([Dd, A, T], c.back, 1) + face([B, Cc, T], c.right, 1) + face([Cc, Dd, T], c.front, 1);
    }
    __name(pyramid, "pyramid");
    var post = /* @__PURE__ */ __name((u, v, z0, z1, c = WOOD_DARK, w = 0.03) => box(u - w, v - w, u + w, v + w, z0, z1, c, 0.7), "post");
    var rail = /* @__PURE__ */ __name((a, b, z, w = 2, c = WOOD_DARK.left) => {
      const p = pt(a[0], a[1], z), q = pt(b[0], b[1], z);
      return `<path d="M${r2(p[0])},${r2(p[1])} L${r2(q[0])},${r2(q[1])}" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round"/><path d="M${r2(p[0])},${r2(p[1])} L${r2(q[0])},${r2(q[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    }, "rail");
    function flame(x, y, h, w, k) {
      const sway = Math.sin(k * Math.PI * 2) * w * 0.35;
      const tip = /* @__PURE__ */ __name((s, dx) => `M${r2(x - w * s)},${r2(y)} Q${r2(x - w * s * 1.1)},${r2(y - h * s * 0.55)} ${r2(x + dx)},${r2(y - h * s)} Q${r2(x + w * s * 1.1)},${r2(y - h * s * 0.55)} ${r2(x + w * s)},${r2(y)} Z`, "tip");
      return `<path d="${tip(1, sway)}" fill="#E8573A" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
    }
    __name(flame, "flame");
    var glow = /* @__PURE__ */ __name((x, y, r, rgb = "255,224,138", a = 0.38) => {
      const id = `lueur_${[x, y, r, a].map(r2).join("_")}_${rgb}`.replace(/,/g, "-").replace(/\./g, "p");
      return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r2(Math.min(0.9, a * 1.8))}"/><stop offset="0.45" stop-color="rgb(${rgb})" stop-opacity="${r2(a * 0.8)}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 1.25)}" fill="url(#${id})"/>`;
    }, "glow");
    var STONE = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
    var WHITE_STONE = { top: "#FBF8F1", left: "#E7E1D3", right: "#C9C0AC" };
    var ROOF_RED = { back: "#B9503B", front: "#E06E52", gable: "#F3E4C4", right: "#B9503B" };
    var ROOF_BLUE = { back: "#3E6FA8", front: "#5C8FD0", gable: "#F3E4C4", right: "#3E6FA8" };
    var THATCH = { back: "#C99A45", front: "#EBC46F", gable: "#F3E4C4", right: "#C99A45" };
    var WALL = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
    var SOIL = { top: "#946240", left: "#784C2E", right: "#5E3A22" };
    var WATER = "#5BAFD8";
    var WATER_LIGHT = "#9AD6F0";
    var BRASS = { top: "#F4D67A", left: "#E2B546", right: "#B88A2E" };
    var IRON = { top: "#9AA2AD", left: "#7E8691", right: "#5E6670" };
    Object.assign(module.exports, { cylinder, disc, gable, pyramid, post, rail, flame, glow, STONE, WHITE_STONE, ROOF_RED, ROOF_BLUE, THATCH, WALL, SOIL, WATER, WATER_LIGHT, BRASS, IRON });
  }
});

// atelier/arbres.js
var require_arbres = __commonJS({
  "atelier/arbres.js"(exports, module) {
    var { OUT, P, E, r2 } = require_troupe2();
    var VERTS = {
      // devant : touffes de devant (plus chaudes) ; fond : touffe du fond (plus froide et plus sombre)
      doux: { devant: { light: "#DFF3A8", mid: "#A5D466", dark: "#68A64B" }, fond: { light: "#A3D172", mid: "#77AF50", dark: "#4F8744" } },
      profond: { devant: { light: "#C4E27E", mid: "#86C153", dark: "#4F8E40" }, fond: { light: "#86BE5C", mid: "#5E9946", dark: "#3B6E3D" } }
    };
    var AUTOMNE = {
      orange: { devant: { light: "#FFD98A", mid: "#F5A04A", dark: "#D06A2E" }, fond: { light: "#F2B562", mid: "#DB7F3A", dark: "#A9502A" } },
      rouge: { devant: { light: "#FFB38A", mid: "#E8664A", dark: "#B8402F" }, fond: { light: "#E58A5E", mid: "#C4503A", dark: "#8E3328" } }
    };
    var SAISON = {
      tendre: { devant: { light: "#F0FABE", mid: "#BFE47C", dark: "#7DB653" }, fond: { light: "#BBE08A", mid: "#8EC160", dark: "#5E9447" } },
      hiver: { devant: { light: "#CADDB4", mid: "#86AE78", dark: "#557F5E" }, fond: { light: "#9DC090", mid: "#6A9468", dark: "#466A52" } }
    };
    var TEINTES = { ...VERTS, ...AUTOMNE, ...SAISON };
    var BOIS = { left: "#9C6A43", right: "#74492C", bark: "#55331E", light: "#B98458" };
    var W = 1.1;
    var rond = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`, "rond");
    var sc = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k)), "sc");
    function touffe(id, lobes, c, marques, k, neige = false) {
      const L2 = lobes.map(([x, y, r, f]) => [x * k, y * k, r * k, f]);
      const contour = L2.map(([x, y, r]) => rond(x, y, r + W, OUT)).join("");
      const zone = `<clipPath id="${id}">${L2.map(([x, y, r]) => rond(x, y, r, "#000")).join("")}</clipPath>`;
      const hauts = L2.filter((l) => l[3] !== 0);
      const dedans = L2.map(([x, y, r]) => rond(x, y, r, c.dark)).join("") + L2.map(([x, y, r]) => rond(x - r * 0.2, y - r * 0.32, r * 0.86, c.mid)).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.34, y - r * 0.48, r * 0.5, c.light)).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.22, y - r * 0.3, r * 0.5, c.mid)).join("") + marques.map(([x, y, s = 1]) => {
        const X = x * k, Y = y * k, S = s * Math.max(k, 0.85);
        return `<path d="M${r2(X - 2.6 * S)},${r2(Y)} Q${r2(X - 1.3 * S)},${r2(Y + 1.8 * S)} ${r2(X)},${r2(Y)} Q${r2(X + 1.3 * S)},${r2(Y + 1.8 * S)} ${r2(X + 2.6 * S)},${r2(Y)}" fill="none" stroke="${c.dark}" stroke-width="0.8" stroke-linecap="round"/>`;
      }).join("") + (neige ? hauts.map(([x, y, r]) => rond(x + r * 0.04, y - r * 0.46, r * 0.8, "#D6E4EE")).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.04, y - r * 0.58, r * 0.78, "#FFFFFF")).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.3, y - r * 0.82, r * 0.16, "#F2F7FC")).join("") : "");
      return contour + `<defs>${zone}</defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(touffe, "touffe");
    function tronc(id, k) {
      const d = sc("M-13,2.2 Q-8,0.6 -6.4,-5 Q-5,-16 -5,-26 Q-5.4,-34 -12,-44 L-5,-46 Q-1.4,-40 0,-36 Q1.6,-41 7,-47 L13,-43 Q5.6,-34 5.2,-26 Q5,-16 6.2,-6 Q7.6,0.4 13,2.6 Q8.6,4 5.2,2.4 Q2.6,5 -0.6,3.4 Q-3.6,4.8 -6,2.6 Q-9.4,3.6 -13,2.2 Z", k);
      const dedans = `<path d="${sc("M1.6,4 Q2.6,-14 2,-27 Q4,-36 9,-46 L16,-46 L16,4 Z", k)}" fill="${BOIS.right}"/><path d="${sc("M5.2,2.4 Q8,2.8 13,2.6 L14,6 L4,6 Z", k)}" fill="${BOIS.right}"/><ellipse cx="0" cy="${r2(-38 * k)}" rx="${r2(16 * k)}" ry="${r2(8 * k)}" fill="${BOIS.right}"/><path d="${sc("M-2.6,-7 Q-3.2,-13 -2.4,-19 M2.8,-11 Q3.4,-16 2.8,-22 M-3.4,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.6,-4 Q-4,-12 -4.2,-20", k)}" fill="none" stroke="${BOIS.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
      return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(tronc, "tronc");
    var herbe = /* @__PURE__ */ __name((x, y, col, s = 1) => `<path d="${sc("M-3,0 Q-3.2,-3 -4.6,-4.6 Q-1.6,-3.6 -0.8,-1.4 Q-0.6,-4.8 0.4,-6.2 Q1.6,-3.6 1,-1.2 Q2.2,-3.6 4.4,-4.4 Q3,-2 3,0 Q0,1.2 -3,0 Z", s)}" transform="translate(${r2(x)} ${r2(y)})" fill="${col}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`, "herbe");
    var champignon = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">` + P("M-1,0 L-0.8,-2.2 L0.8,-2.2 L1,0 Z", "#F6EBD6", 0.7) + P("M-2.9,-2 Q-2.6,-5.2 0,-5.4 Q2.6,-5.2 2.9,-2 Q0,-1.3 -2.9,-2 Z", "#E2574C", 0.8) + E(-1, -3.8, 0.6, 0.5, "#FFFFFF", 0) + E(1.1, -3.1, 0.45, 0.4, "#FFFFFF", 0) + "</g>", "champignon");
    var PETALES = [0, 72, 144, 216, 288].map((a) => [Math.cos((a - 90) * Math.PI / 180) * 1.2, Math.sin((a - 90) * Math.PI / 180) * 1.2]);
    var fleurette = /* @__PURE__ */ __name((x, y, col) => PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 1.4, OUT)).join("") + PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 0.95, col)).join("") + rond(x, y, 0.7, "#F2B33D"), "fleurette");
    function pied(k) {
      return herbe(-15 * k, 3, "#86B852", 0.85) + champignon(-7.5 * k, 5.2) + herbe(10.5 * k, 5.6, "#94C25C", 0.7) + fleurette(15 * k, 4.4, "#FFFFFF") + fleurette(19 * k, 2.6, "#F7B6C8") + fleurette(18.6 * k, 6.6, "#FFFFFF");
    }
    __name(pied, "pied");
    var FOND = [[-13, -74, 12.5], [4, -79, 14], [20, -70, 11.5], [-26, -63, 9.5], [29, -60, 8]];
    var GAUCHE = [[-21, -55, 13], [-33, -50, 8], [-26, -41, 8, 0], [-13, -43, 8, 0]];
    var DROITE = [[17, -55, 12], [28, -49, 8.5], [22, -40, 7.5, 0], [10, -45, 7.5, 0]];
    var MILIEU = [[-2, -62, 11.5], [-9, -51, 7.5, 0], [5, -52, 8, 0]];
    function arbre({ vert = "doux", petit = false, fleuri = false, neige = false } = {}) {
      const c = TEINTES[vert], k = petit ? 0.76 : 1;
      const id = `arb${petit ? "p" : "g"}${vert[0]}${fleuri ? "f" : ""}${neige ? "n" : ""}`;
      return E(3 * k, 1.5, 27 * k, 12 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + tronc(`${id}t`, k) + touffe(`${id}a`, FOND, c.fond, [[-6, -69], [13, -66, 0.9], [24, -74, 0.8]], k, neige) + touffe(`${id}b`, DROITE, c.devant, [[15, -47], [25, -52, 0.9]], k, neige) + touffe(`${id}c`, GAUCHE, c.devant, [[-23, -46], [-15, -52, 0.9], [-31, -55, 0.8]], k, neige) + touffe(`${id}d`, MILIEU, c.devant, [[-3, -54], [3, -60, 0.8]], k, neige) + (fleuri ? pied(k) : "") + (neige ? congere(k) : "");
    }
    __name(arbre, "arbre");
    var ARBRES = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleuri of [false, true]) {
      const fichier = ["arbre", petit && "petit", vert === "profond" && "profond", fleuri && "fleuri"].filter(Boolean).join("_");
      const libelle = `Arbre (${[petit ? "petit" : "grand", `vert ${vert}`, fleuri && "pied fleuri"].filter(Boolean).join(", ")})`;
      ARBRES.push([fichier, libelle, { vert, petit, fleuri }]);
    }
    var FLEURS_PRINTEMPS = [[-27, -52], [-8, -50], [2, -67], [21, -47], [27, -57], [-4, -78], [-18, -72], [12, -75]];
    function arbreSaison({ saison = "printemps", petit = false } = {}) {
      const k = petit ? 0.76 : 1;
      if (saison === "hiver") return arbre({ vert: "hiver", petit, neige: true });
      return arbre({ vert: "tendre", petit, fleuri: true }) + FLEURS_PRINTEMPS.map(([x, y], i) => fleurette(x * k, y * k, i % 3 === 1 ? "#F7B6C8" : "#FFFFFF")).join("");
    }
    __name(arbreSaison, "arbreSaison");
    var ARBRES_SAISONS = [];
    for (const saison of ["printemps", "hiver"]) for (const petit of [false, true]) {
      ARBRES_SAISONS.push([["arbre", saison, petit && "petit"].filter(Boolean).join("_"), `Arbre ${saison === "hiver" ? "d'hiver" : "de printemps"} (${petit ? "petit" : "grand"}, ${saison === "hiver" ? "sous la neige, congère au pied" : "vert tendre, en fleurs, pied fleuri"})`, { saison, petit }]);
    }
    function pomme(id, x, y, s, feuille) {
      const r = 2.7 * s;
      const d = `M${r2(x)},${r2(y - r * 0.7)} Q${r2(x + r * 1.1)},${r2(y - r * 1.25)} ${r2(x + r * 1.05)},${r2(y + r * 0.05)} Q${r2(x + r * 0.9)},${r2(y + r * 1.05)} ${r2(x)},${r2(y + r * 0.95)} Q${r2(x - r * 0.9)},${r2(y + r * 1.05)} ${r2(x - r * 1.05)},${r2(y + r * 0.05)} Q${r2(x - r * 1.1)},${r2(y - r * 1.25)} ${r2(x)},${r2(y - r * 0.7)} Z`;
      return `<path d="${d}" fill="#E2574C" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${E(x + r * 0.55, y + r * 0.55, r * 0.95, r * 0.8, "#B83A35", 0)}</g><ellipse cx="${r2(x - r * 0.42)}" cy="${r2(y - r * 0.2)}" rx="${r2(r * 0.3)}" ry="${r2(r * 0.38)}" fill="#FFFFFF" opacity="0.85"/><path d="M${r2(x)},${r2(y - r * 0.6)} q${r2(0.2 * s)},${r2(-1.3 * s)} ${r2(0.9 * s)},${r2(-1.8 * s)}" stroke="${OUT}" stroke-width="${r2(0.9 * Math.max(s, 0.8))}" fill="none" stroke-linecap="round"/>` + (feuille ? `<path d="M${r2(x + 0.7 * s)},${r2(y - r * 0.85)} q${r2(1.6 * s)},${r2(-1.6 * s)} ${r2(3.2 * s)},${r2(-0.9 * s)} q${r2(-1.2 * s)},${r2(1.4 * s)} ${r2(-3.2 * s)},${r2(0.9 * s)} Z" fill="#8CC152" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` : "");
    }
    __name(pomme, "pomme");
    var petale = /* @__PURE__ */ __name((x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT}" stroke-width="0.5" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`, "petale");
    var POMMES = [[-26, -49, 1, true], [-15, -58, 1], [-31, -57, 0.9], [-7, -46, 1], [3, -66, 1, true], [13, -50, 1], [23, -45, 1, true], [27, -55, 0.9], [-3, -76, 0.9], [14, -73, 0.9]];
    var TOMBEES = [[12, 5, 1], [-17, 6, 0.95, true]];
    var FLEURS = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];
    var PETALES_SOL = [[-16, 4.5, 30, "#F7B6C8"], [-12, 7, -40, "#FFFFFF"], [9, 6, 70, "#FFFFFF"], [14, 3.5, -20, "#F7B6C8"], [18, 6.5, 50, "#FFFFFF"], [-20, 2.5, 80, "#FFFFFF"]];
    function pommier({ vert = "doux", petit = false, fleurs = false, tombees = false } = {}) {
      const k = petit ? 0.76 : 1, s = 1.12 * Math.max(k, 0.85);
      const id = `pom${petit ? "p" : "g"}${vert[0]}${fleurs ? "f" : ""}${tombees ? "t" : ""}`;
      let o = arbre({ vert, petit });
      if (fleurs) o += FLEURS.map(([x, y], i) => fleurette(x * k, y * k, i % 3 ? "#FFFFFF" : "#F7B6C8")).join("") + (tombees ? PETALES_SOL.map(([x, y, a, col]) => petale(x * k, y, a, col)).join("") : "");
      else o += POMMES.map(([x, y, t, f], i) => pomme(`${id}${i}`, x * k, y * k, t * s, f)).join("") + (tombees ? TOMBEES.map(([x, y, t, f], i) => pomme(`${id}s${i}`, x * k, y, t * 1.05, f)).join("") : "");
      return o;
    }
    __name(pommier, "pommier");
    var POMMIERS = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleurs of [false, true]) for (const tombees of [false, true]) {
      const fichier = ["pommier", petit && "petit", vert === "profond" && "profond", fleurs && "fleurs", tombees && "tombees"].filter(Boolean).join("_");
      const libelle = `Pommier (${[petit ? "petit" : "grand", `vert ${vert}`, fleurs ? "en fleurs" : "en pommes", tombees && (fleurs ? "pétales tombés" : "pommes tombées")].filter(Boolean).join(", ")})`;
      POMMIERS.push([fichier, libelle, { vert, petit, fleurs, tombees }]);
    }
    var feuilleMorte = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${s})"><path d="M0,-2.8 Q2.2,-0.6 0,2.8 Q-2.2,-0.6 0,-2.8 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/><path d="M0,-1.8 L0,2.2" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round" opacity="0.6"/></g>`, "feuilleMorte");
    var FEUILLES_SOL = [[-18, 3.5, 30, 0], [-12, 7, -50, 1], [-21, 7, 80, 2], [10, 6.5, 60, 1], [16, 3, -20, 0], [19, 7.5, 40, 2], [3, 8, -70, 0]];
    var FEUILLES_AIR = [[-31, -30, 25, 1], [30, -22, -35, 0]];
    var ROUSSES = ["#F5A04A", "#E8664A", "#F2C14E"];
    function automne({ teinte = "orange", petit = false, feuilles = false } = {}) {
      const k = petit ? 0.76 : 1;
      return arbre({ vert: teinte, petit }) + (feuilles ? FEUILLES_SOL.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join("") + FEUILLES_AIR.map(([x, y, a, i]) => feuilleMorte(x * k, y * k, a, ROUSSES[i], 1.1)).join("") : "");
    }
    __name(automne, "automne");
    var AUTOMNES = [];
    for (const petit of [false, true]) for (const teinte of ["orange", "rouge"]) for (const feuilles of [false, true]) {
      const fichier = ["arbre_automne", petit && "petit", teinte === "rouge" && "rouge", feuilles && "feuilles"].filter(Boolean).join("_");
      const libelle = `Arbre d'automne (${[petit ? "petit" : "grand", teinte, feuilles && "feuilles tombées"].filter(Boolean).join(", ")})`;
      AUTOMNES.push([fichier, libelle, { teinte, petit, feuilles }]);
    }
    var VERTS_BOULEAU = {
      doux: { devant: { light: "#EEF8C0", mid: "#C3E27E", dark: "#8BBB55" }, fond: { light: "#C2DF8C", mid: "#98C45E", dark: "#6C9C47" } },
      profond: { devant: { light: "#D9EE9A", mid: "#A6D262", dark: "#6FA545" }, fond: { light: "#A4CC70", mid: "#7AAE4D", dark: "#527F3E" } }
    };
    var ECORCE = { left: "#F4F1EA", right: "#CFC8BA", marque: "#3A3A3A" };
    function troncBouleau(id, k) {
      const d = sc("M-8,1.8 Q-4.5,0.6 -3.6,-4 Q-3,-20 -3.4,-36 Q-4,-44 -9,-52 L-5.4,-54.4 Q-1.6,-48 0,-44 Q1.4,-49 6,-55.4 L9.4,-52.4 Q4,-44 3.4,-36 Q3,-20 3.8,-5 Q5,0.6 8.5,2 Q5,3.2 2.6,2 Q0,3.6 -2.6,2.2 Q-5,3.4 -8,1.8 Z", k);
      const marques = [[-2.2, -9, 2.4], [1.4, -15, 2], [-2.4, -22, 2.2], [1.2, -28, 2.6], [-1.8, -34, 1.8], [-5.6, -46, 1.6], [4.6, -47, 1.6]];
      const dedans = `<path d="${sc("M1.2,4 Q1.8,-20 1.6,-36 Q3,-44 8,-56 L14,-56 L14,4 Z", k)}" fill="${ECORCE.right}"/><path d="${sc("M-9,4 L-9,-1.5 Q-4,-3.5 0,-3 Q4,-3.5 9,-1.5 L9,4 Z", k)}" fill="#8E877C"/><ellipse cx="0" cy="${r2(-44 * k)}" rx="${r2(12 * k)}" ry="${r2(6 * k)}" fill="${ECORCE.right}"/>` + marques.map(([x, y, w]) => `<path d="M${r2((x - w / 2) * k)},${r2(y * k)} Q${r2(x * k)},${r2((y - 0.9) * k)} ${r2((x + w / 2) * k)},${r2(y * k)} Q${r2(x * k)},${r2((y + 0.6) * k)} ${r2((x - w / 2) * k)},${r2(y * k)} Z" fill="${ECORCE.marque}"/>`).join("");
      return `<path d="${d}" fill="${ECORCE.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(troncBouleau, "troncBouleau");
    var B_FOND = [[-10, -84, 10], [6, -90, 10.5], [17, -78, 9], [-19, -72, 8.5], [1, -75, 10]];
    var B_GAUCHE = [[-16, -60, 10], [-24, -55, 7], [-19, -48, 6.5, 0], [-9, -50, 7, 0]];
    var B_DROITE = [[14, -63, 9.5], [22, -57, 7], [17, -49, 6.5, 0], [7, -52, 6.5, 0]];
    var B_MILIEU = [[-1, -71, 9], [-6, -61, 6.5, 0], [5, -62, 6.5, 0]];
    function bouleau({ vert = "doux", petit = false, fleuri = false } = {}) {
      const c = VERTS_BOULEAU[vert], k = petit ? 0.76 : 1;
      const id = `bou${petit ? "p" : "g"}${vert[0]}${fleuri ? "f" : ""}`;
      return E(2 * k, 1.5, 21 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + troncBouleau(`${id}t`, k) + touffe(`${id}a`, B_FOND, c.fond, [[-4, -80], [12, -76, 0.8]], k) + touffe(`${id}b`, B_DROITE, c.devant, [[13, -55, 0.8], [20, -60, 0.7]], k) + touffe(`${id}c`, B_GAUCHE, c.devant, [[-17, -53, 0.8], [-10, -58, 0.7]], k) + touffe(`${id}d`, B_MILIEU, c.devant, [[-2, -64, 0.8]], k) + (fleuri ? pied(k * 0.85) : "");
    }
    __name(bouleau, "bouleau");
    var BOULEAUX = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleuri of [false, true]) {
      const fichier = ["bouleau", petit && "petit", vert === "profond" && "profond", fleuri && "fleuri"].filter(Boolean).join("_");
      const libelle = `Bouleau (${[petit ? "petit" : "grand", `vert ${vert}`, fleuri && "pied fleuri"].filter(Boolean).join(", ")})`;
      BOULEAUX.push([fichier, libelle, { vert, petit, fleuri }]);
    }
    var PINS = {
      doux: { light: "#A8D88A", mid: "#5FAE5C", dark: "#3B7F45" },
      profond: { light: "#8CC77A", mid: "#4A9650", dark: "#2C6A3C" }
    };
    function etageD(y, w, h, n) {
      const top = y - h, pas = 2 * w / n;
      let d = `M0,${r2(top)} Q${r2(-w * 0.3)},${r2(top + h * 0.6)} ${r2(-w)},${r2(y)}`;
      for (let i = 0; i < n; i++) {
        const x0 = -w + i * pas;
        d += ` Q${r2(x0 + pas / 2)},${r2(y + 3.6)} ${r2(x0 + pas)},${r2(y)}`;
      }
      return d + ` Q${r2(w * 0.3)},${r2(top + h * 0.6)} 0,${r2(top)} Z`;
    }
    __name(etageD, "etageD");
    function etage(id, y, w, h, n, c, neige, yNeige) {
      const d = etageD(y, w, h, n), top = y - h, pas = 2 * w / n;
      let dedans = `<path d="M${r2(w * 0.08)},${r2(top)} Q${r2(w * 0.45)},${r2(top + h * 0.6)} ${r2(w + 2)},${r2(y + 4)} L${r2(w * 0.12)},${r2(y + 4)} Z" fill="${c.dark}"/>`;
      for (let i = 0; i < n; i++) dedans += `<ellipse cx="${r2(-w + (i + 0.5) * pas)}" cy="${r2(y + 1.6)}" rx="${r2(pas * 0.42)}" ry="2" fill="${c.dark}" opacity="0.55"/>`;
      dedans += `<path d="M-1.2,${r2(top + 3)} Q${r2(-w * 0.32)},${r2(top + h * 0.6)} ${r2(-w + 3)},${r2(y - 1.2)}" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + [[-w * 0.45, y - h * 0.35], [w * 0.15, y - h * 0.55], [-w * 0.1, y - h * 0.2], [w * 0.5, y - h * 0.25]].map(([x, yy]) => `<path d="M${r2(x - 1.8)},${r2(yy - 1.2)} L${r2(x)},${r2(yy + 0.6)} L${r2(x + 1.8)},${r2(yy - 1.2)}" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
      if (neige) {
        const yc = yNeige, xc = w * (yc - top) / h * 1.08;
        dedans += `<path d="M0,${r2(top - 0.4)} Q${r2(-w * 0.18)},${r2(top + h * 0.3)} ${r2(-xc - 1)},${r2(yc)} Q${r2(-xc * 0.6)},${r2(yc + 3)} ${r2(-xc * 0.3)},${r2(yc + 0.6)} Q0,${r2(yc + 3.2)} ${r2(xc * 0.3)},${r2(yc + 0.4)} Q${r2(xc * 0.65)},${r2(yc + 2.8)} ${r2(xc + 1)},${r2(yc - 0.4)} Q${r2(w * 0.18)},${r2(top + h * 0.3)} 0,${r2(top - 0.4)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r2(w * 0.06)},${r2(top + 1.5)} Q${r2(w * 0.2)},${r2(top + h * 0.3)} ${r2(xc * 0.9)},${r2(yc)}" stroke="#D6E4EE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      }
      let o = `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
      if (neige) {
        let f = `M${r2(-w + 1)},${r2(y - 0.2)}`;
        for (let i = 0; i < n; i++) {
          const x0 = -w + i * pas;
          f += ` Q${r2(x0 + pas / 2)},${r2(y + 3.4)} ${r2(Math.min(x0 + pas, w - 1))},${r2(y - 0.2)}`;
        }
        o += `<path d="${f}" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${f}" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      return o;
    }
    __name(etage, "etage");
    function troncSapin(id, k) {
      const d = sc("M-7.5,1.8 Q-4,0.6 -3.4,-4 L-3,-16 L3,-16 L3.4,-4 Q4,0.6 8,2 Q4.4,3.2 2,2 Q0,3.4 -2.2,2.2 Q-4.6,3.2 -7.5,1.8 Z", k);
      return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${sc("M0.8,4 L1,-17 L9,-17 L9,4 Z", k)}" fill="${BOIS.right}"/><path d="${sc("M-1.6,-4 L-1.4,-11", k)}" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/></g>`;
    }
    __name(troncSapin, "troncSapin");
    var pommeDePin = /* @__PURE__ */ __name((x, y, a) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"><path d="M0,-2.6 Q2.2,-1 1.8,1.2 Q0,3 -1.8,1.2 Q-2.2,-1 0,-2.6 Z" fill="#A0703F" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/><path d="M-1.4,-0.6 Q0,0.4 1.4,-0.6 M-1.5,1 Q0,2 1.5,1" stroke="#6E4A28" stroke-width="0.5" fill="none"/></g>`, "pommeDePin");
    var congere = /* @__PURE__ */ __name((k) => `<path d="M${r2(-17 * k)},4 Q${r2(-14 * k)},-1 ${r2(-8 * k)},1.5 Q${r2(-5 * k)},-0.5 ${r2(-2 * k)},3 Q${r2(4 * k)},0 ${r2(8 * k)},3 Q${r2(13 * k)},0 ${r2(18 * k)},4.5 Q0,9 ${r2(-17 * k)},4 Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${r2(3 * k)},5.5 Q${r2(10 * k)},6.6 ${r2(15 * k)},5" stroke="#D6E4EE" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, "congere");
    var ETAGES = [[-10, 25, 28, 5], [-27, 20.5, 27, 4], [-44, 16, 25, 4], [-60, 11, 24, 3]];
    function sapin({ vert = "doux", petit = false, neige = false, pied: pied2 = false } = {}) {
      const c = PINS[vert], k = petit ? 0.76 : 1;
      const id = `sap${neige ? "n" : ""}${petit ? "p" : "g"}${vert[0]}${pied2 ? "x" : ""}`;
      return E(2 * k, 1.5, 24 * k, 10.5 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + troncSapin(`${id}t`, k) + ETAGES.map(([y, w, h, n], i) => etage(`${id}${i}`, y * k, w * k, h * k, n, c, neige, (i < ETAGES.length - 1 ? ETAGES[i + 1][0] + 6.5 : y - h * 0.55) * k)).join("") + (pied2 ? neige ? congere(k) : pommeDePin(-12 * k, 5, -20) + pommeDePin(11 * k, 6, 30) + pommeDePin(15 * k, 3.4, 80) : "");
    }
    __name(sapin, "sapin");
    var SAPINS = [];
    for (const neige of [false, true]) for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const pied2 of [false, true]) {
      const fichier = [neige ? "sapin_neige" : "sapin", petit && "petit", vert === "profond" && "profond", pied2 && (neige ? "congere" : "pommes_de_pin")].filter(Boolean).join("_");
      const libelle = `${neige ? "Sapin enneigé" : "Sapin"} (${[petit ? "petit" : "grand", `vert ${vert}`, pied2 && (neige ? "congère au pied" : "pommes de pin")].filter(Boolean).join(", ")})`;
      SAPINS.push([fichier, libelle, { vert, petit, neige, pied: pied2 }]);
    }
    var PALMES = {
      doux: { devant: { light: "#C2E594", mid: "#82C65E", dark: "#4F9046" }, fond: { light: "#94C870", mid: "#5E9F4A", dark: "#3D7340" } },
      profond: { devant: { light: "#A6D67C", mid: "#66B052", dark: "#3E7C3E" }, fond: { light: "#7EB862", mid: "#4C8C44", dark: "#2F6136" } }
    };
    var STIPE = { left: "#C08A55", right: "#946339", light: "#D9A976" };
    var qPt = /* @__PURE__ */ __name((a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]], "qPt");
    var qTan = /* @__PURE__ */ __name((a, c, b, t) => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])], "qTan");
    var pts = /* @__PURE__ */ __name((l) => l.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L"), "pts");
    function palme(id, o, dx, dy, larg, c, k) {
      const b = [o[0] + dx * k, o[1] + dy * k], ctl = [o[0] + dx * k * 0.5, o[1] + dy * k * 0.5 - Math.abs(dx) * 0.38 * k];
      const N = 14, axe = [], haut = [], bas = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N, p = qPt(o, ctl, b, t), d2 = qTan(o, ctl, b, t), L2 = Math.hypot(d2[0], d2[1]) || 1;
        let nx = -d2[1] / L2, ny = d2[0] / L2;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        const w = larg * k * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0.75) + 0.3, cran = i % 2 ? 0.35 : 1;
        axe.push(p);
        haut.push([p[0] + nx * w * 0.55, p[1] + ny * w * 0.55]);
        bas.push([p[0] - nx * w * cran, p[1] - ny * w * cran]);
      }
      const d = `M${pts(haut.concat(bas.slice().reverse()))} Z`;
      return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M${pts(axe.concat(bas.slice().reverse()))} Z" fill="${c.dark}"/><path d="M${r2(o[0])},${r2(o[1] - 0.8)} Q${r2(ctl[0])},${r2(ctl[1] - 0.8)} ${r2(b[0])},${r2(b[1] - 0.8)}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
    }
    __name(palme, "palme");
    function stipe(id, k) {
      const a = [0, 0], ctl = [-7 * k, -32 * k], b = [8 * k, -62 * k], N = 8;
      let o = "";
      for (let i = 0; i < N; i++) {
        const t0 = i / N, t1 = (i + 1) / N, p0 = qPt(a, ctl, b, t0), p1 = qPt(a, ctl, b, t1);
        const w0 = (5 - 1.8 * t0) * k, w1 = (5 - 1.8 * t1) * k * 1.12;
        const d0 = qTan(a, ctl, b, t0), L0 = Math.hypot(d0[0], d0[1]), n0 = [-d0[1] / L0, d0[0] / L0];
        const d1 = qTan(a, ctl, b, t1), L1 = Math.hypot(d1[0], d1[1]), n1 = [-d1[1] / L1, d1[0] / L1];
        const l0 = [p0[0] - n0[0] * w0, p0[1] - n0[1] * w0], r0 = [p0[0] + n0[0] * w0, p0[1] + n0[1] * w0];
        const l1 = [p1[0] - n1[0] * w1, p1[1] - n1[1] * w1], r1 = [p1[0] + n1[0] * w1, p1[1] + n1[1] * w1];
        const d = `M${r2(l0[0])},${r2(l0[1])} L${r2(l1[0])},${r2(l1[1])} Q${r2(p1[0])},${r2(p1[1] + 1.4 * k)} ${r2(r1[0])},${r2(r1[1])} L${r2(r0[0])},${r2(r0[1])} Q${r2(p0[0])},${r2(p0[1] + 1.8 * k)} ${r2(l0[0])},${r2(l0[1])} Z`;
        o += `<path d="${d}" fill="${STIPE.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}${i}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id}${i})"><path d="M${r2(p0[0] + n0[0] * w0 * 0.25)},${r2(p0[1] + 4)} L${r2(p1[0] + n1[0] * w1 * 0.25)},${r2(p1[1] - 2)} L${r2(p1[0] + n1[0] * 12)},${r2(p1[1] - 2)} L${r2(p0[0] + n0[0] * 12)},${r2(p0[1] + 4)} Z" fill="${STIPE.right}"/><path d="M${r2(l1[0])},${r2(l1[1] + 1.2)} Q${r2(p1[0])},${r2(p1[1] + 2.6 * k)} ${r2(r1[0])},${r2(r1[1] + 1.2)}" stroke="${STIPE.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/></g>`;
      }
      return o;
    }
    __name(stipe, "stipe");
    var noixDeCoco = /* @__PURE__ */ __name((x, y, s) => E(x, y, 3 * s, 3 * s, "#7A4E28", 0.9) + E(x - 0.9 * s, y - s, 0.9 * s, 0.8 * s, "#A87A4C", 0) + E(x + 0.4 * s, y + 1.2 * s, 0.35 * s, 0.35 * s, "#4E3018", 0), "noixDeCoco");
    var PALMES_FOND = [[-30, 4, 6], [31, 6, 6], [-10, -22, 5.5], [14, -21, 5.5]];
    var PALMES_DEVANT = [[-26, 17, 6.5], [27, 19, 6.5], [-20, -8, 6], [22, -6, 6]];
    function palmier({ vert = "doux", petit = false, cocos = false } = {}) {
      const c = PALMES[vert], k = petit ? 0.76 : 1, o = [8 * k, -62 * k], s = Math.max(k, 0.85);
      const id = `pal${petit ? "p" : "g"}${vert[0]}${cocos ? "c" : ""}`;
      return E(3 * k, 1.5, 22 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + stipe(`${id}s`, k) + PALMES_FOND.map(([dx, dy, l], i) => palme(`${id}f${i}`, o, dx, dy, l, c.fond, k)).join("") + PALMES_DEVANT.map(([dx, dy, l], i) => palme(`${id}d${i}`, o, dx, dy, l, c.devant, k)).join("") + noixDeCoco(o[0] - 3.4 * k, o[1] + 6 * k, s) + noixDeCoco(o[0] + 3.6 * k, o[1] + 6.6 * k, s) + noixDeCoco(o[0] + 0.1 * k, o[1] + 9.6 * k, s) + (cocos ? noixDeCoco(-12 * k, 4.5, 0.95) + noixDeCoco(14 * k, 5.5, 0.9) : "");
    }
    __name(palmier, "palmier");
    var PALMIERS = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const cocos of [false, true]) {
      const fichier = ["palmier", petit && "petit", vert === "profond" && "profond", cocos && "cocos"].filter(Boolean).join("_");
      const libelle = `Palmier (${[petit ? "petit" : "grand", `vert ${vert}`, cocos && "noix de coco au pied"].filter(Boolean).join(", ")})`;
      PALMIERS.push([fichier, libelle, { vert, petit, cocos }]);
    }
    var BOIS_MORT = {
      gris: { left: "#A69B8F", right: "#7C7268", light: "#C4BAAE", bark: "#5E554C" },
      brun: { left: "#8A6A4F", right: "#664C37", light: "#A7876A", bark: "#4A3626" }
    };
    var BRANCHES = [
      [[[-8.5, -42.7], [-16, -52], [-22, -63]], 3.6],
      [[[-13.5, -48.5], [-19, -48], [-23, -51]], 1.6],
      [[[0, -34], [1.2, -48], [-1, -62], [2, -75]], 3.6],
      [[[1.2, -48], [7, -57]], 1.6],
      [[[9.5, -41.2], [17, -47], [25, -57]], 3.6],
      [[[17, -47], [22, -43], [27, -45]], 1.5],
      [[[12.5, -43.5], [14, -55]], 1.5]
    ];
    function branchesMortes(c, k) {
      const segs = [];
      BRANCHES.forEach(([p, w0]) => {
        for (let i = 0; i < p.length - 1; i++) segs.push([p[i], p[i + 1], w0 * (1 - i / p.length * 0.75)]);
      });
      const seg = /* @__PURE__ */ __name(([a, b], w, col) => `<path d="M${r2(a[0] * k)},${r2(a[1] * k)} L${r2(b[0] * k)},${r2(b[1] * k)}" stroke="${col}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "seg");
      return segs.map(([a, b, w]) => seg([a, b], w * k + W * 2, OUT)).join("") + segs.map(([a, b, w]) => seg([a, b], w * k, c.left)).join("") + segs.map(([a, b, w]) => seg([[a[0] + w * 0.22, a[1]], [b[0] + w * 0.22, b[1]]], w * k * 0.45, c.right)).join("");
    }
    __name(branchesMortes, "branchesMortes");
    function troncMort(id, c, k) {
      const d = sc("M-12,2.2 Q-7,0.8 -5.8,-5 Q-4.6,-14 -5.2,-22 Q-5.6,-30 -10.5,-41 L-6.5,-44.5 Q-2.2,-38 0,-35 Q2,-38.5 7.5,-43 L11.5,-39.5 Q5.6,-31 5,-22 Q4.4,-12 5.8,-6 Q7,0.6 12.5,2.6 Q8,4 4.8,2.4 Q2.4,4.8 -0.6,3.4 Q-3.4,4.6 -5.8,2.6 Q-9,3.6 -12,2.2 Z", k);
      const dedans = `<path d="${sc("M1.4,4 Q2.4,-12 1.8,-22 Q3.4,-32 8.5,-44.5 L16,-44.5 L16,4 Z", k)}" fill="${c.right}"/><path d="${sc("M-2.4,-6 Q-3,-12 -2.2,-17 M2.6,-9 Q3.2,-14 2.6,-19 M-3.2,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.4,-4 Q-3.8,-12 -4,-20", k)}" fill="none" stroke="${c.light}" stroke-width="1" stroke-linecap="round" opacity="0.8"/>` + E(-0.6 * k, -15 * k, 2.4 * k, 3 * k, c.light, 0.8) + E(-0.4 * k, -14.6 * k, 1.5 * k, 2.1 * k, "#3A2E26", 0) + E(-3.6 * k, -25 * k, 2 * k, 1 * k, "#B7C46C", 0.5) + E(-2.2 * k, -24.4 * k, 1 * k, 0.6 * k, "#B7C46C", 0.4);
      return `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(troncMort, "troncMort");
    function arbreMort({ teinte = "gris", petit = false, champignons = false } = {}) {
      const c = BOIS_MORT[teinte], k = petit ? 0.76 : 1;
      const id = `mor${petit ? "p" : "g"}${teinte[0]}${champignons ? "c" : ""}`;
      const raccord = /* @__PURE__ */ __name((a, b) => `<path d="M${r2(a[0] * k)},${r2(a[1] * k)} L${r2(b[0] * k)},${r2(b[1] * k)}" stroke="${c.left}" stroke-width="${r2(3.6 * k)}" stroke-linecap="butt"/><path d="M${r2((a[0] + 0.8) * k)},${r2(a[1] * k)} L${r2((b[0] + 0.8) * k)},${r2(b[1] * k)}" stroke="${c.right}" stroke-width="${r2(1.6 * k)}" stroke-linecap="butt"/>`, "raccord");
      return E(2 * k, 1.5, 19 * k, 8.5 * k, "rgba(40,55,20,0.22)", 0) + branchesMortes(c, k) + troncMort(`${id}t`, c, k) + raccord([-7.6, -41.5], [-10, -45.6]) + raccord([8.6, -40.6], [11, -42.5]) + (champignons ? champignon(-9 * k, 5.4) + champignon(10.5 * k, 5.6) + champignon(14 * k, 3.4) : "");
    }
    __name(arbreMort, "arbreMort");
    var ARBRES_MORTS = [];
    for (const petit of [false, true]) for (const teinte of ["gris", "brun"]) for (const champignons of [false, true]) {
      const fichier = ["arbre_mort", petit && "petit", teinte === "brun" && "brun", champignons && "champignons"].filter(Boolean).join("_");
      const libelle = `Arbre mort (${[petit ? "petit" : "grand", teinte, champignons && "champignons au pied"].filter(Boolean).join(", ")})`;
      ARBRES_MORTS.push([fichier, libelle, { teinte, petit, champignons }]);
    }
    module.exports = {
      arbre,
      ARBRES,
      arbreSaison,
      ARBRES_SAISONS,
      pommier,
      POMMIERS,
      automne,
      AUTOMNES,
      bouleau,
      BOULEAUX,
      sapin,
      SAPINS,
      palmier,
      PALMIERS,
      arbreMort,
      ARBRES_MORTS,
      // pour les autres plantes (plantes.js) : les verts, la touffe de feuillage, la fleurette, le champignon, l'herbe
      VERTS,
      TEINTES,
      fleurette,
      feuillage: touffe,
      champignon,
      herbe,
      congere,
      feuilleMorte,
      ROUSSES,
      // pour les arbres de saison (arbres_saisons.js) : les troncs, l'étage du sapin, le pied fleuri, le pétale, la pomme de pin
      tronc,
      troncBouleau,
      troncSapin,
      etage,
      ETAGES,
      pied,
      petale,
      pommeDePin,
      BOIS,
      W
    };
  }
});

// atelier/arbres_saisons.js
var require_arbres_saisons = __commonJS({
  "atelier/arbres_saisons.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var {
      feuillage: touffe,
      fleurette,
      herbe,
      congere,
      feuilleMorte,
      tronc,
      troncBouleau,
      troncSapin,
      etage,
      ETAGES,
      pied,
      petale,
      pommeDePin,
      BOIS,
      W,
      ARBRES_SAISONS,
      AUTOMNES,
      SAPINS
    } = require_arbres();
    var TAILLES = { grand: 1, moyen: 0.88, petit: 0.76 };
    var rond = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`, "rond");
    var ombre = /* @__PURE__ */ __name((k, rx, ry, hiver) => E(2 * k, 1.5, rx * k, ry * k, hiver ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0), "ombre");
    var T = /* @__PURE__ */ __name((dl, dm, dd, fl, fm, fd) => ({ devant: { light: dl, mid: dm, dark: dd }, fond: { light: fl, mid: fm, dark: fd } }), "T");
    function rameaux(liste2, c, k, neige = false) {
      const segs = [];
      liste2.forEach(([p, w0]) => {
        for (let i = 0; i < p.length - 1; i++) segs.push([p[i], p[i + 1], w0 * (1 - i / p.length * 0.7)]);
      });
      const seg = /* @__PURE__ */ __name((a, b, w, col, dx = 0, dy = 0) => `<path d="M${r2(a[0] * k + dx)},${r2(a[1] * k + dy)} L${r2(b[0] * k + dx)},${r2(b[1] * k + dy)}" stroke="${col}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "seg");
      return segs.map(([a, b, w]) => seg(a, b, w * k + W * 2, OUT)).join("") + segs.map(([a, b, w]) => seg(a, b, w * k, c.left)).join("") + segs.map(([a, b, w]) => seg(a, b, w * k * 0.4, c.right, w * k * 0.22)).join("") + (neige ? segs.filter((s) => s[2] > 1.4).map(([a, b, w]) => seg(a, b, w * k * 0.5, "#FFFFFF", 0, -w * k * 0.32)).join("") : "");
    }
    __name(rameaux, "rameaux");
    var CERISIER = {
      rose: T("#FFE6EE", "#F9B8CC", "#E0849F", "#F6C7D6", "#E89AB2", "#C06A87"),
      blanc: T("#FFFFFF", "#F6EEF0", "#D9C3CB", "#EEDDE3", "#DCC4CC", "#B89AA6")
    };
    var C_FOND = [[-16, -72, 11], [0, -78, 12.5], [17, -71, 11], [-30, -62, 9], [31, -60, 9]];
    var C_GAUCHE = [[-24, -54, 11], [-36, -50, 7.5], [-29, -42, 7, 0], [-15, -44, 7.5, 0]];
    var C_DROITE = [[22, -53, 11], [35, -49, 7.5], [27, -41, 7, 0], [13, -45, 7.5, 0]];
    var C_MILIEU = [[-2, -61, 11], [-8, -50, 7, 0], [6, -51, 7.5, 0]];
    var C_FLEURS = [[-28, -55], [-12, -66], [4, -72], [20, -60], [30, -51], [-20, -46], [10, -52], [-4, -82], [24, -73]];
    var C_SOL = [[-17, 4.5, 30], [-12, 7, -40], [9, 6, 70], [14, 3.5, -20], [19, 6.5, 50], [-21, 2.5, 80], [2, 8, 10]];
    function cerisier({ teinte = "rose", k = 1, id }) {
      const c = CERISIER[teinte], autre = teinte === "rose" ? "#FFFFFF" : "#F7B6C8";
      return ombre(k, 30, 12) + tronc(`${id}t`, k) + touffe(`${id}a`, C_FOND, c.fond, [[-6, -70], [13, -68, 0.8]], k) + touffe(`${id}b`, C_DROITE, c.devant, [[17, -48, 0.8]], k) + touffe(`${id}c`, C_GAUCHE, c.devant, [[-24, -47, 0.8]], k) + touffe(`${id}d`, C_MILIEU, c.devant, [[-2, -55, 0.8]], k) + C_FLEURS.map(([x, y]) => fleurette(x * k, y * k, autre)).join("") + C_SOL.map(([x, y, a], i) => petale(x * k, y, a, i % 2 ? autre : c.devant.mid)).join("");
    }
    __name(cerisier, "cerisier");
    var MAGNOLIA = {
      rose: { pale: "#FCE6F0", mid: "#E9A3C5", fonce: "#B85A8E" },
      blanc: { pale: "#FFFFFF", mid: "#F2E6EC", fonce: "#D49AB8" }
    };
    var BOIS_MAGNOLIA = { left: "#8E7A6A", right: "#665446" };
    var M_BRANCHES = [
      [[[-8.5, -44], [-17, -58], [-23, -74]], 4.6],
      [[[-17, -58], [-30, -64]], 2.6],
      [[[-12, -51], [-14, -60]], 2],
      [[[0, -36], [-2, -56], [2, -82]], 4.6],
      [[[-1.4, -62], [-10, -74]], 2.2],
      [[[9.5, -45], [18, -60], [22, -77]], 4.6],
      [[[18, -60], [30, -64]], 2.6],
      [[[0.6, -72], [11, -85]], 2.2]
    ];
    var M_FLEURS = [[-23, -76, 1], [-31, -66, 0.85], [2, -84, 1], [-10, -76, 0.85], [22, -79, 1], [31, -65, 0.85], [11, -87, 0.85], [-14, -61, 0.7]];
    var M_FEUILLES = [[-20, -66, -40], [-4, -70, 30], [15, -68, -30], [26, -61, 40], [6, -58, 20], [-26, -59, 60]];
    function tulipe(x, y, s, c) {
      const p = /* @__PURE__ */ __name((d, col) => `<path d="${d}" fill="${col}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})"/>`, "p");
      return p("M0,3 Q-3.2,-1 -1.4,-5.6 Q0,-6.6 1.4,-5.6 Q3.2,-1 0,3 Z", c.mid) + p("M0,3.2 Q-5.4,1.6 -5,-3.4 Q-3,-3.6 -1.6,-1.6 Q-0.6,1 0,3.2 Z", c.pale) + p("M0,3.2 Q5.4,1.6 5,-3.4 Q3,-3.6 1.6,-1.6 Q0.6,1 0,3.2 Z", c.pale) + `<path d="M${r2(x - 2.2 * s)},${r2(y + 1.4 * s)} Q${r2(x)},${r2(y + 3.6 * s)} ${r2(x + 2.2 * s)},${r2(y + 1.4 * s)}" stroke="${c.fonce}" stroke-width="${r2(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
    }
    __name(tulipe, "tulipe");
    var feuille = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<path d="M0,-3 Q2,-0.6 0,3 Q-2,-0.6 0,-3 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})"/>`, "feuille");
    function magnolia({ teinte = "rose", k = 1, id }) {
      const c = MAGNOLIA[teinte], s = Math.max(k, 0.85) * 1.25;
      return ombre(k, 26, 10.5) + rameaux(M_BRANCHES, BOIS_MAGNOLIA, k) + tronc(`${id}t`, k) + M_FEUILLES.map(([x, y, a]) => feuille(x * k, y * k, a, "#9CCB62", s)).join("") + M_FLEURS.map(([x, y, t]) => tulipe(x * k, y * k, t * s, c)).join("") + [[-15, 5, 40], [11, 6, -30], [17, 3.5, 70]].map(([x, y, a]) => petale(x * k, y, a, c.mid)).join("");
    }
    __name(magnolia, "magnolia");
    var SAULE = {
      tendre: T("#F0FABE", "#BFE47C", "#7DB653", "#BBE08A", "#8EC160", "#5E9447"),
      dore: T("#FAF9C2", "#DCE47E", "#A6B44E", "#D2D88A", "#B4BE5C", "#838F3E")
    };
    var S_HAUT = [[-14, -76, 11], [4, -81, 12.5], [19, -73, 10.5], [-26, -66, 8.5], [30, -64, 8], [-4, -66, 10], [12, -64, 9]];
    var S_MECHES_FOND = [[-32, -62, -26, 2.8], [-24, -66, -18, 3], [-15, -68, -24, 3], [-6, -70, -20, 3], [4, -70, -26, 3], [13, -68, -18, 3], [22, -66, -24, 3], [31, -62, -20, 2.8]];
    var S_MECHES = [[-27, -62, -12, 3], [-19, -64, -28, 3], [-10, -66, -16, 3], [11, -66, -30, 3], [19, -64, -14, 3], [28, -60, -22, 3]];
    function meche(id, x, y0, y1, w, c, k) {
      const X = x * k, A = y0 * k, B = y1 * k, Wd = w * k, m = (A + B) / 2, dx = (x < 0 ? -1 : 1) * 1.2 * k;
      const d = `M${r2(X - Wd)},${r2(A)} Q${r2(X - Wd - 0.6 + dx * 0.4)},${r2(m)} ${r2(X - Wd * 0.35 + dx)},${r2(B - 2)} Q${r2(X + dx)},${r2(B + 1.6)} ${r2(X + Wd * 0.35 + dx)},${r2(B - 2)} Q${r2(X + Wd + 0.6 + dx * 0.4)},${r2(m)} ${r2(X + Wd)},${r2(A)} Z`;
      let dedans = `<path d="M${r2(X + Wd * 0.35)},${r2(A)} L${r2(X + Wd + 3)},${r2(A)} L${r2(X + Wd + 3 + dx)},${r2(B + 3)} L${r2(X + Wd * 0.2 + dx)},${r2(B + 3)} Z" fill="${c.dark}"/>`;
      for (let y = A + 4 * k, i = 0; y < B - 3; y += 3.6 * k, i++) {
        const t = (y - A) / (B - A), xx = X + dx * t;
        dedans += `<path d="M${r2(xx - Wd * 0.5)},${r2(y - 0.8)} L${r2(xx - Wd * 0.1)},${r2(y + 0.4)} L${r2(xx + Wd * 0.3)},${r2(y - 0.8)}" stroke="${c.dark}" stroke-width="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      dedans += `<path d="M${r2(X - Wd * 0.5)},${r2(A + 2)} Q${r2(X - Wd * 0.5 + dx * 0.3)},${r2(m)} ${r2(X - Wd * 0.2 + dx)},${r2(B - 4)}" stroke="${c.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
      return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(meche, "meche");
    function saule({ teinte = "tendre", k = 1, id }) {
      const c = SAULE[teinte];
      return ombre(k, 30, 12) + S_MECHES_FOND.map(([x, a, b, w], i) => meche(`${id}f${i}`, x, a, b, w, c.fond, k)).join("") + tronc(`${id}t`, k) + S_MECHES.map(([x, a, b, w], i) => meche(`${id}m${i}`, x, a, b, w, c.devant, k)).join("") + touffe(`${id}a`, S_HAUT, c.devant, [[-8, -72], [12, -74, 0.8], [-22, -66, 0.8]], k) + herbe(-17 * k, 4, "#94C25C", 0.7) + herbe(13 * k, 5.2, "#86B852", 0.75);
    }
    __name(saule, "saule");
    var CHENE = {
      ete: T("#C8E68A", "#7FBF4E", "#478A3A", "#7FB65A", "#558F42", "#356638"),
      sombre: T("#A9D27A", "#5E9F45", "#336E33", "#679C50", "#41783A", "#28532E")
    };
    var H_FOND = [[-20, -78, 13], [0, -86, 14.5], [20, -78, 13], [-34, -64, 10], [35, -63, 10]];
    var H_GAUCHE = [[-25, -57, 13.5], [-38, -51, 9], [-30, -42, 8.5, 0], [-15, -44, 8.5, 0]];
    var H_DROITE = [[24, -57, 13], [38, -51, 9], [30, -42, 8.5, 0], [15, -45, 8.5, 0]];
    var H_MILIEU = [[0, -66, 12.5], [-8, -53, 8, 0], [8, -53, 8.5, 0]];
    var gland = /* @__PURE__ */ __name((x, y, a, fruit, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})"><path d="M-1.8,-0.4 Q-2,3 0,3.6 Q2,3 1.8,-0.4 Z" fill="${fruit}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/><path d="M-2.3,0 Q-2.3,-2.2 0,-2.3 Q2.3,-2.2 2.3,0 Q0,0.8 -2.3,0 Z" fill="#8A6A44" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/><path d="M0,-2.3 L0,-3.4" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/></g>`, "gland");
    function chene({ teinte = "ete", k = 1, id, roux = false }) {
      const c = roux ? CHENE_ROUX[teinte] : CHENE[teinte];
      return ombre(k, 33, 13) + tronc(`${id}t`, k) + touffe(`${id}a`, H_FOND, c.fond, [[-8, -74], [12, -72, 0.9], [26, -78, 0.8], [-26, -66, 0.8]], k) + touffe(`${id}b`, H_DROITE, c.devant, [[20, -50], [32, -54, 0.8]], k) + touffe(`${id}c`, H_GAUCHE, c.devant, [[-24, -49], [-34, -56, 0.8]], k) + touffe(`${id}d`, H_MILIEU, c.devant, [[-2, -58], [5, -66, 0.8]], k) + (roux ? FEUILLES_CHENE.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, c.feuilles[i])).join("") + [[-12, 6, -30], [12, 5, 50], [16, 7.5, 10]].map(([x, y, a]) => gland(x * k, y, a, "#B88A4E")).join("") : herbe(-17 * k, 4, "#86B852", 0.8) + herbe(14 * k, 5.4, "#94C25C", 0.7) + gland(-9 * k, 6, 20, "#9CC25A", 0.9));
    }
    __name(chene, "chene");
    var TILLEUL = {
      clair: T("#E4F2A6", "#A9CF63", "#6F9E45", "#A9CB78", "#7FA855", "#557D3E"),
      bleute: T("#D2E8B4", "#8FBC7A", "#5C8C5A", "#9CBE90", "#6E9A6A", "#4A6E50")
    };
    var L_FOND = [[-10, -92, 11], [8, -94, 11], [-19, -78, 10], [19, -78, 10], [0, -82, 12]];
    var L_GAUCHE = [[-20, -62, 11], [-26, -52, 8], [-19, -44, 7.5, 0], [-9, -47, 7.5, 0]];
    var L_DROITE = [[19, -63, 11], [25, -52, 8], [18, -44, 7.5, 0], [8, -47, 7.5, 0]];
    var L_MILIEU = [[-1, -72, 11], [-7, -58, 8, 0], [6, -59, 8, 0]];
    var L_FLEURS = [[-22, -60], [-12, -72], [6, -78], [18, -62], [-4, -90], [14, -88], [-17, -82], [2, -60]];
    var grappe = /* @__PURE__ */ __name((x, y) => `<path d="M${r2(x - 0.6)},${r2(y - 3)} Q${r2(x + 2.4)},${r2(y - 1.6)} ${r2(x + 2.2)},${r2(y + 1.4)} Q${r2(x + 0.4)},${r2(y + 0.2)} ${r2(x - 0.6)},${r2(y - 3)} Z" fill="#E6EFB0" stroke="${OUT}" stroke-width="0.5"/>` + [[-0.8, 1.6], [0.8, 2.2], [-0.2, 3.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.1, OUT) + rond(x + dx, y + dy, 0.75, "#FFF2B0")).join(""), "grappe");
    function tilleul({ teinte = "clair", k = 1, id }) {
      const c = TILLEUL[teinte];
      return ombre(k, 26, 10.5) + tronc(`${id}t`, k) + touffe(`${id}a`, L_FOND, c.fond, [[-6, -86], [10, -84, 0.8]], k) + touffe(`${id}b`, L_DROITE, c.devant, [[17, -55, 0.8]], k) + touffe(`${id}c`, L_GAUCHE, c.devant, [[-19, -55, 0.8]], k) + touffe(`${id}d`, L_MILIEU, c.devant, [[-2, -64, 0.8]], k) + L_FLEURS.map(([x, y]) => grappe(x * k, y * k)).join("") + herbe(-14 * k, 4, "#86B852", 0.75) + fleurette(13 * k, 4.6, "#FFFFFF") + fleurette(17 * k, 2.8, "#FFF2B0");
    }
    __name(tilleul, "tilleul");
    var PARASOL = {
      doux: T("#A8D88A", "#5FAE5C", "#3B7F45", "#7DB86A", "#4A9450", "#2F6A3C"),
      profond: T("#8CC77A", "#4A9650", "#2C6A3C", "#6AA662", "#3A8046", "#225834")
    };
    var P_FOND = [[-26, -84, 9], [-10, -89, 10], [8, -90, 10], [25, -85, 9], [38, -79, 7], [-38, -78, 7]];
    var P_DEVANT = [[-30, -75, 9], [-15, -78, 10], [2, -79, 10], [19, -77, 10], [33, -73, 8], [-40, -72, 6, 0], [-22, -69, 7, 0], [10, -70, 7.5, 0], [26, -68, 6.5, 0]];
    function futParasol(id, k) {
      const sc = /* @__PURE__ */ __name((d2) => d2.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k)), "sc");
      const d = sc("M-9,2 Q-5,0.6 -4.4,-4 Q-3.4,-32 0.4,-60 L-7,-67 L-4,-69.5 Q0.6,-65 2.6,-62.6 Q6,-67 12,-70 L13.6,-67.2 Q7.6,-63.4 5.6,-58 Q2.6,-32 4.2,-5 Q5.2,0.6 9,2 Q5,3.2 2,2 Q0,3.4 -2.4,2.2 Q-5,3.2 -9,2 Z");
      const dedans = `<path d="${sc("M1,4 Q0,-30 3.4,-60 L16,-72 L16,4 Z")}" fill="${BOIS.right}"/><path d="${sc("M-1.6,-10 Q-1.8,-18 -1.2,-24 M2,-30 Q1.4,-38 2.4,-44 M-0.6,-40 q0.4,-3 0.8,-5")}" fill="none" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-3.2,-6 Q-2.6,-24 -0.6,-44")}" fill="none" stroke="${BOIS.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
      return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
    }
    __name(futParasol, "futParasol");
    function pinParasol({ teinte = "doux", k = 1, id }) {
      const c = PARASOL[teinte];
      return ombre(k, 30, 11) + futParasol(`${id}t`, k) + touffe(`${id}a`, P_FOND, c.fond, [[-18, -88, 0.8], [16, -88, 0.8]], k) + touffe(`${id}b`, P_DEVANT, c.devant, [[-24, -74, 0.8], [-6, -76, 0.8], [12, -76, 0.8], [28, -72, 0.8]], k) + pommeDePin(-12 * k, 5, -20) + pommeDePin(12 * k, 6, 30);
    }
    __name(pinParasol, "pinParasol");
    var ERABLE = {
      cramoisi: T("#FF9C8A", "#D9413A", "#9E2830", "#D8655A", "#B13434", "#7A2229"),
      ecarlate: T("#FFC27A", "#F0703A", "#C04228", "#E88A50", "#CC5A2E", "#923A22")
    };
    var R_FOND = [[-14, -80, 12], [4, -85, 13], [21, -76, 11], [-27, -66, 10], [30, -64, 9]];
    var R_GAUCHE = [[-22, -57, 12.5], [-34, -52, 8.5], [-27, -43, 8, 0], [-13, -45, 8, 0]];
    var R_DROITE = [[19, -57, 12], [31, -51, 8.5], [24, -42, 7.5, 0], [11, -46, 7.5, 0]];
    var R_MILIEU = [[-2, -66, 12], [-9, -53, 7.5, 0], [6, -54, 8, 0]];
    var erableFeuille = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})"><path d="M0,3 L-0.6,1.4 L-3.2,1.8 L-2.4,0 L-3.6,-1.2 L-1.6,-1.2 L-1.8,-3 L-0.6,-2 L0,-3.8 L0.6,-2 L1.8,-3 L1.6,-1.2 L3.6,-1.2 L2.4,0 L3.2,1.8 L0.6,1.4 Z" fill="${col}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/><path d="M0,1.6 L0,4.4" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/></g>`, "erableFeuille");
    var R_AIR = [[-26, -50, 20], [-8, -70, -15], [14, -62, 30], [26, -48, -25], [2, -84, 10], [-18, -76, 40]];
    var R_SOL = [[-18, 3.5, 30], [-12, 7, -50], [-22, 7, 80], [10, 6.5, 60], [16, 3, -20], [20, 7.5, 40], [3, 8, -70], [-4, 5, 15]];
    function erable({ teinte = "cramoisi", k = 1, id }) {
      const c = ERABLE[teinte], f = [c.devant.mid, c.devant.light, "#F2C14E"];
      return ombre(k, 30, 12) + tronc(`${id}t`, k) + touffe(`${id}a`, R_FOND, c.fond, [], k) + touffe(`${id}b`, R_DROITE, c.devant, [], k) + touffe(`${id}c`, R_GAUCHE, c.devant, [], k) + touffe(`${id}d`, R_MILIEU, c.devant, [], k) + R_AIR.map(([x, y, a], i) => erableFeuille(x * k, y * k, a, i % 2 ? c.devant.light : c.devant.dark, 0.9)).join("") + R_SOL.map(([x, y, a], i) => erableFeuille(x * k, y, a, f[i % 3])).join("") + erableFeuille(-31 * k, -28 * k, 25, f[0], 1.05) + erableFeuille(31 * k, -20 * k, -35, f[2], 1.05);
    }
    __name(erable, "erable");
    var GINKGO = {
      or: T("#FFF2A0", "#F5CF3A", "#D19A1E", "#F0D266", "#DDAE2C", "#A87A1A"),
      citron: T("#FBF7B8", "#E3DE5C", "#ACA933", "#D6D47A", "#BDB943", "#868527")
    };
    var G_FOND = [[-6, -96, 10], [9, -90, 10], [-15, -82, 9], [16, -76, 9], [0, -80, 11]];
    var G_GAUCHE = [[-16, -64, 10.5], [-22, -55, 7.5], [-16, -46, 7, 0], [-6, -49, 7, 0]];
    var G_DROITE = [[16, -62, 10], [22, -53, 7.5], [15, -45, 7, 0], [6, -49, 7, 0]];
    var G_MILIEU = [[0, -70, 10], [-5, -58, 7, 0], [6, -58, 7, 0]];
    var eventail = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})"><path d="M0,2.4 L-3,-1.4 Q-1.6,-3.4 -0.3,-2.2 L0,-1.2 L0.3,-2.2 Q1.6,-3.4 3,-1.4 Z" fill="${col}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/><path d="M0,2.4 L0,4.4" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/></g>`, "eventail");
    var G_SOL = [[-18, 3.5, 30], [-12, 7, -50], [-22, 6.5, 80], [10, 6.5, 60], [16, 3, -20], [21, 6.5, 40], [3, 8, -70], [-5, 5, 10], [7, 3, -40]];
    function ginkgo({ teinte = "or", k = 1, id }) {
      const c = GINKGO[teinte];
      return E(1 * k, 4, 24 * k, 6 * k, c.devant.mid, 0.8) + E(-2 * k, 3.4, 16 * k, 3.4 * k, c.devant.light, 0) + tronc(`${id}t`, k) + touffe(`${id}a`, G_FOND, c.fond, [[-4, -88, 0.8], [10, -82, 0.8]], k) + touffe(`${id}b`, G_DROITE, c.devant, [[16, -55, 0.8]], k) + touffe(`${id}c`, G_GAUCHE, c.devant, [[-17, -57, 0.8]], k) + touffe(`${id}d`, G_MILIEU, c.devant, [[-1, -64, 0.8]], k) + G_SOL.map(([x, y, a], i) => eventail(x * k, y, a, i % 2 ? c.devant.light : c.devant.dark)).join("") + eventail(-26 * k, -30 * k, 25, c.devant.mid, 1.1) + eventail(25 * k, -22 * k, -35, c.devant.light, 1.1);
    }
    __name(ginkgo, "ginkgo");
    var CHENE_ROUX = {
      roux: { ...T("#F2B474", "#C9783A", "#93502A", "#C98A54", "#A2602F", "#6E4024"), feuilles: ["#C9783A", "#E8A65A", "#93502A"] },
      brun: { ...T("#E0BE84", "#B08A4E", "#7C5E34", "#B49260", "#8E6E40", "#62492A"), feuilles: ["#B08A4E", "#D8B474", "#7C5E34"] }
    };
    var FEUILLES_CHENE = [[-19, 3.5, 30, 0], [-13, 7, -50, 1], [-22, 7, 80, 2], [9, 6.5, 60, 1], [19, 3, -20, 0], [21, 7.5, 40, 2], [2, 8, -70, 0]];
    var BOULEAU_NU = {
      pourpre: { left: "#F4F1EA", right: "#CFC8BA", brindille: "#8A5A6A" },
      gris: { left: "#EEEDEA", right: "#C2C0BA", brindille: "#8E8A84" }
    };
    var N_BRANCHES = [
      [[[-7.2, -53], [-14, -66], [-17, -82]], 2.6],
      [[[-14, -66], [-24, -74]], 1.4],
      [[[-11.4, -60], [-21, -60]], 1.2],
      [[[0, -44], [1, -62], [-1, -80], [1, -94]], 2.4],
      [[[1, -62], [8, -72]], 1.2],
      [[[-0.6, -80], [-7, -88]], 1.1],
      [[[7.6, -54], [14, -68], [19, -84]], 2.6],
      [[[14, -68], [24, -73]], 1.4],
      [[[11, -61], [20, -58]], 1.2]
    ];
    var N_BRINDILLES = [[-17, -82], [-24, -74], [-21, -60], [1, -94], [8, -72], [-7, -88], [19, -84], [24, -73], [20, -58]];
    function bouleauNu({ teinte = "pourpre", k = 1, id }) {
      const c = BOULEAU_NU[teinte];
      const brin = /* @__PURE__ */ __name(([x, y]) => {
        const X = x * k, Y = y * k, dx = x < 0 ? -1 : 1;
        return `<path d="M${r2(X)},${r2(Y)} l${r2(dx * 2.6)},${r2(-3.4)} M${r2(X)},${r2(Y)} l${r2(dx * 3.6)},${r2(-0.6)} M${r2(X)},${r2(Y)} l${r2(-dx * 0.6)},${r2(-3.8)}" stroke="${c.brindille}" stroke-width="0.8" stroke-linecap="round" fill="none"/>`;
      }, "brin");
      return ombre(k, 20, 9, true) + N_BRINDILLES.map(brin).join("") + rameaux(N_BRANCHES, c, k, true) + troncBouleau(`${id}t`, k) + congere(k * 0.9);
    }
    __name(bouleauNu, "bouleauNu");
    var HOUX = {
      sombre: T("#7FB27A", "#3F7D4A", "#24573A", "#5E9460", "#2F6640", "#1C4430"),
      bleu: T("#8FB8A0", "#4E8670", "#2E5E50", "#6E9C88", "#3A6E5C", "#244C40")
    };
    var X_FOND = [[0, -80, 10], [-11, -68, 10.5], [11, -68, 10.5], [-19, -52, 9.5], [19, -52, 9.5]];
    var X_MILIEU = [[-8, -60, 10], [8, -60, 10], [0, -70, 9]];
    var X_BAS = [[-14, -36, 10, 0], [0, -40, 11], [14, -36, 10, 0], [-23, -28, 7.5, 0], [23, -28, 7.5, 0], [-6, -24, 9, 0], [7, -24, 9, 0]];
    var X_BAIES = [[-10, -64], [7, -70], [12, -54], [-16, -42], [3, -46], [18, -32], [-21, -28], [-3, -30], [9, -24]];
    var baies = /* @__PURE__ */ __name((x, y) => [[-1.2, 0], [1.2, 0.2], [0, -1.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.6, OUT)).join("") + [[-1.2, 0], [1.2, 0.2], [0, -1.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.05, "#D8323A") + rond(x + dx - 0.35, y + dy - 0.35, 0.35, "#FFFFFF")).join(""), "baies");
    function houx({ teinte = "sombre", k = 1, id }) {
      const c = HOUX[teinte];
      return ombre(k, 24, 10, true) + troncSapin(`${id}t`, k) + touffe(`${id}a`, X_FOND, c.fond, [[-12, -62, 0.8], [12, -60, 0.8]], k, true) + touffe(`${id}b`, X_BAS, c.devant, [[-12, -32, 0.8], [12, -30, 0.8], [0, -34, 0.8]], k) + touffe(`${id}c`, X_MILIEU, c.devant, [[-6, -54, 0.8], [6, -54, 0.8]], k, true) + X_BAIES.map(([x, y]) => baies(x * k, y * k)).join("") + congere(k * 0.9);
    }
    __name(houx, "houx");
    var GIVRE = {
      givre: { light: "#E4F0F2", mid: "#9CC0B8", dark: "#5F8A88" },
      argent: { light: "#EEF2F6", mid: "#B4C4CC", dark: "#7A8E9A" }
    };
    function sapinGivre({ teinte = "givre", k = 1, id }) {
      const c = GIVRE[teinte];
      let o = ombre(k, 24, 10.5, true) + troncSapin(`${id}t`, k);
      ETAGES.forEach(([y, w, h, n], i) => {
        const Y = y * k, Wd = w * k, pas = 2 * Wd / n;
        o += etage(`${id}${i}`, Y, Wd, h * k, n, c, false);
        let f = `M${r2(-Wd + 1)},${r2(Y - 0.2)}`;
        for (let j = 0; j < n; j++) {
          const x0 = -Wd + j * pas;
          f += ` Q${r2(x0 + pas / 2)},${r2(Y + 3.4)} ${r2(Math.min(x0 + pas, Wd - 1))},${r2(Y - 0.2)}`;
        }
        o += `<path d="${f}" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`;
        for (let j = 1; j < n; j++) {
          const x = -Wd + j * pas;
          o += `<path d="M${r2(x - 1)},${r2(Y + 0.4)} L${r2(x)},${r2(Y + 3.6)} L${r2(x + 1)},${r2(Y + 0.4)} Z" fill="#E8F4FA" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
        }
      });
      o += [[-10, -36], [8, -52], [-4, -70], [12, -22], [-14, -18]].map(([x, y]) => `<path d="M${r2(x * k)},${r2(y * k - 2)} L${r2(x * k)},${r2(y * k + 2)} M${r2(x * k - 2)},${r2(y * k)} L${r2(x * k + 2)},${r2(y * k)}" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round"/>`).join("");
      return o + congere(k);
    }
    __name(sapinGivre, "sapinGivre");
    var ESSENCES = [
      ["cerisier", "Cerisier en fleurs", "printemps", cerisier, ["rose", "blanc"], { rose: "fleurs roses", blanc: "fleurs blanches" }],
      ["magnolia", "Magnolia", "printemps", magnolia, ["rose", "blanc"], { rose: "fleurs roses", blanc: "fleurs blanches" }],
      ["saule", "Saule tendre", "printemps", saule, ["tendre", "dore"], { tendre: "vert tendre", dore: "vert doré" }],
      ["chene", "Chêne touffu", "ete", chene, ["ete", "sombre"], { ete: "vert d'été", sombre: "vert sombre" }],
      ["tilleul", "Tilleul en fleurs", "ete", tilleul, ["clair", "bleute"], { clair: "vert clair", bleute: "vert bleuté" }],
      ["pin_parasol", "Pin parasol", "ete", pinParasol, ["doux", "profond"], { doux: "vert doux", profond: "vert profond" }],
      ["erable", "Érable rouge", "automne", erable, ["cramoisi", "ecarlate"], { cramoisi: "cramoisi", ecarlate: "écarlate" }],
      ["ginkgo", "Ginkgo doré", "automne", ginkgo, ["or", "citron"], { or: "or", citron: "jaune citron" }],
      ["chene_roux", "Chêne roux", "automne", (o) => chene({ ...o, roux: true }), ["roux", "brun"], { roux: "roux", brun: "brun" }],
      ["bouleau_nu", "Bouleau nu", "hiver", bouleauNu, ["pourpre", "gris"], { pourpre: "brindilles pourpres", gris: "brindilles grises" }],
      ["houx", "Houx", "hiver", houx, ["sombre", "bleu"], { sombre: "vert sombre", bleu: "vert bleu" }],
      ["sapin_givre", "Sapin givré", "hiver", sapinGivre, ["givre", "argent"], { givre: "givre vert pâle", argent: "givre argenté" }]
    ];
    var ARBRES_DE_SAISON = [];
    var SAISONS = { printemps: {}, ete: {}, automne: {}, hiver: {} };
    for (const [essence, nom, saison, dessin, teintes, noms] of ESSENCES) for (const taille of ["grand", "moyen", "petit"]) for (const teinte of teintes) {
      const autre = teinte !== teintes[0];
      const fichier = [essence, taille !== "grand" && taille, autre && teinte].filter(Boolean).join("_");
      const id = `s${fichier.replace(/[^a-z]/g, "").slice(0, 6)}${taille[0]}${autre ? "b" : "a"}${ESSENCES.findIndex((e) => e[0] === essence)}`;
      ARBRES_DE_SAISON.push([fichier, `${nom} (${taille}, ${noms[teinte]})`, saison, () => dessin({ teinte, k: TAILLES[taille], id })]);
      (SAISONS[saison][essence] = SAISONS[saison][essence] || []).push(`${fichier}.svg`);
    }
    SAISONS.printemps.arbre_printemps = ARBRES_SAISONS.filter((a) => a[2].saison === "printemps").map((a) => `${a[0]}.svg`);
    SAISONS.automne.arbre_automne = AUTOMNES.map((a) => `${a[0]}.svg`);
    SAISONS.hiver.arbre_hiver = ARBRES_SAISONS.filter((a) => a[2].saison === "hiver").map((a) => `${a[0]}.svg`);
    SAISONS.hiver.sapin_neige = SAPINS.filter((a) => a[2].neige).map((a) => `${a[0]}.svg`);
    module.exports = { ARBRES_DE_SAISON, SAISONS, ESSENCES };
  }
});

// atelier/herbes.js
var require_herbes = __commonJS({
  "atelier/herbes.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var { VERTS, TEINTES, fleurette, congere } = require_arbres();
    var W = 1.1;
    function brinD(x, w, tx, ty, b) {
      const mx = (x + tx) / 2 + b, my = ty * 0.5, n = 0.9;
      return `M${r2(x - w / 2)},0.5 Q${r2(mx - w * 0.45)},${r2(my)} ${r2(tx - n)},${r2(ty + n * 1.2)} Q${r2(tx)},${r2(ty - n * 0.6)} ${r2(tx + n)},${r2(ty + n * 1.2)} Q${r2(mx + w * 0.45)},${r2(my)} ${r2(x + w / 2)},0.5 Q${r2(x)},1.7 ${r2(x - w / 2)},0.5 Z`;
    }
    __name(brinD, "brinD");
    function brin(id, [x, w, tx, ty, b], c) {
      const d = brinD(x, w, tx, ty, b);
      const mx = (x + tx) / 2 + b, my = ty * 0.5;
      return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${r2(x + 0.8)}" cy="1.4" rx="${r2(w * 1.1)}" ry="${r2(Math.abs(ty) * 0.34)}" fill="${c.dark}"/><path d="M${r2(x - w * 0.14)},${r2(ty * 0.22)} Q${r2(mx - w * 0.2)},${r2(my)} ${r2(tx - 0.15)},${r2(ty + 2.4)}" stroke="${c.light}" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
    }
    __name(brin, "brin");
    function motte(id, c, s) {
      const d = `M${r2(-7.5 * s)},0.8 Q${r2(-8 * s)},${r2(-2.2 * s)} ${r2(-4.8 * s)},${r2(-2.4 * s)} Q${r2(-2.8 * s)},${r2(-3.8 * s)} 0,${r2(-3.3 * s)} Q${r2(2.8 * s)},${r2(-4 * s)} ${r2(4.8 * s)},${r2(-2.3 * s)} Q${r2(8 * s)},${r2(-2.2 * s)} ${r2(7.5 * s)},0.8 Q0,${r2(2.6 * s)} ${r2(-7.5 * s)},0.8 Z`;
      return `<path d="${d}" fill="${c.dark}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${r2(-1.5 * s)}" cy="${r2(-3 * s)}" rx="${r2(5 * s)}" ry="${r2(1.5 * s)}" fill="${c.mid}"/></g>`;
    }
    __name(motte, "motte");
    var tige = /* @__PURE__ */ __name((x0, y0, x1, y1) => {
      const d = `M${r2(x0)},${r2(y0)} Q${r2((x0 + x1) / 2 + 0.8)},${r2((y0 + y1) / 2)} ${r2(x1)},${r2(y1)}`;
      return `<path d="${d}" stroke="${OUT}" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#7BB352" stroke-width="1" fill="none" stroke-linecap="round"/>`;
    }, "tige");
    var FOND = [[-3.5, 5, -8, -12.5, -1.2], [1, 5.4, 2, -16, 0.8], [4.5, 5, 9.5, -11.5, 1.6]];
    var DEVANT = [[-5.5, 4.8, -11, -8, -1.6], [-1.5, 5.4, -3.6, -13, -1], [2.5, 5, 6, -10.5, 1.2], [6, 4.4, 11.5, -6.5, 1.6]];
    function touffe({ vert = "doux", motte: avecMotte = false, petite = false, fleurie = false } = {}) {
      const c = VERTS[vert], s = petite ? 0.7 : 1;
      const id = `tf${avecMotte ? "m" : ""}${petite ? "p" : "g"}${vert[0]}${fleurie ? "f" : ""}`;
      const S = /* @__PURE__ */ __name((l) => l.map(([x, w, tx, ty, b]) => [x * s, w * Math.max(s, 0.8), tx * s, ty * s, b * s]), "S");
      let o = E(1, 1, 12.5 * s, 4.2 * s, "rgba(40,55,20,0.22)", 0);
      o += S(FOND).map((b, i) => brin(`${id}a${i}`, b, c.fond)).join("");
      if (fleurie) o += tige(-1 * s, -3, -2.6 * s, -17.5 * s);
      o += S(DEVANT).map((b, i) => brin(`${id}b${i}`, b, c.devant)).join("");
      if (fleurie) o += tige(4.5 * s, -3, 7 * s, -13.5 * s) + fleurette(-2.6 * s, -18 * s, "#FFFFFF") + fleurette(7 * s, -14 * s, "#F7B6C8");
      if (avecMotte) o += motte(`${id}m`, c.devant, s);
      return o;
    }
    __name(touffe, "touffe");
    var TOUFFES = [];
    for (const motte2 of [false, true]) for (const petite of [false, true]) for (const vert of ["doux", "profond"]) for (const fleurie of [false, true]) {
      const fichier = ["touffe", motte2 && "motte", petite && "petite", vert === "profond" && "profond", fleurie && "fleurie"].filter(Boolean).join("_");
      const libelle = `Touffe d'herbe (${[motte2 && "avec motte", petite ? "petite" : "grande", `vert ${vert}`, fleurie && "fleurie"].filter(Boolean).join(", ")})`;
      TOUFFES.push([fichier, libelle, { vert, motte: motte2, petite, fleurie }]);
    }
    var BLOND = { devant: { light: "#F6E6A8", mid: "#DDBD66", dark: "#A98A3E" }, fond: { light: "#E4CB86", mid: "#C4A052", dark: "#8E6F36" } };
    function touffeSaison({ saison = "automne", petite = false } = {}) {
      const hiver = saison === "hiver", c = hiver ? TEINTES.hiver : BLOND, s = petite ? 0.7 : 1;
      const id = `tfs${saison[0]}${petite ? "p" : "g"}`;
      const S = /* @__PURE__ */ __name((l) => l.map(([x, w, tx, ty, b]) => [x * s, w * Math.max(s, 0.8), tx * s, ty * s, b * s]), "S");
      let o = E(1, 1, 12.5 * s, 4.2 * s, hiver ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0);
      o += S(FOND).map((b, i) => brin(`${id}a${i}`, b, c.fond)).join("");
      o += S(DEVANT).map((b, i) => brin(`${id}b${i}`, b, c.devant)).join("");
      o += S([...FOND, ...DEVANT]).map(([, , tx, ty]) => hiver ? E(tx + 0.2, ty + 1.1, 1.15, 0.75, "#FFFFFF", 0.5) : E(tx, ty + 0.4, 0.9, 1.4, "#C9A04E", 0.6)).join("");
      if (hiver) o += congere(0.55 * s);
      return o;
    }
    __name(touffeSaison, "touffeSaison");
    var TOUFFES_SAISONS = [];
    for (const saison of ["automne", "hiver"]) for (const petite of [false, true]) {
      TOUFFES_SAISONS.push([["touffe", saison, petite && "petite"].filter(Boolean).join("_"), `Touffe d'herbe ${saison === "hiver" ? "d'hiver" : "d'automne"} (${petite ? "petite" : "grande"}, ${saison === "hiver" ? "neige sur les pointes, congère au pied" : "herbe blonde, épis de graines"})`, { saison, petite }]);
    }
    module.exports = { touffe, TOUFFES, touffeSaison, TOUFFES_SAISONS };
  }
});

// atelier/rochers.js
var require_rochers = __commonJS({
  "atelier/rochers.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var { fleurette, herbe, congere, feuilleMorte, ROUSSES } = require_arbres();
    var PIERRES = {
      gris: { light: "#D3CDC2", mid: "#ABA498", dark: "#857E73", fente: "#6B655C" },
      ocre: { light: "#EDCD9A", mid: "#CFA06E", dark: "#A7774D", fente: "#8A5E3A" },
      sombre: { light: "#A39D96", mid: "#7A746E", dark: "#56514C", fente: "#433E3A" }
    };
    var sc = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k)), "sc");
    function bloc(id, { d, haut, flanc, fentes = "", reflet = "" }, c, k, dedans = "") {
      return `<path d="${sc(d, k)}" fill="${c.mid}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${sc(d, k)}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${sc(flanc, k)}" fill="${c.dark}"/><path d="${sc(haut, k)}" fill="${c.light}"/><path d="${sc("M-30,1 Q0,-3 30,1 L30,8 L-30,8 Z", k)}" fill="${c.dark}" opacity="0.55"/>` + (fentes && `<path d="${sc(fentes, k)}" stroke="${c.fente}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`) + (reflet && `<path d="${sc(reflet, k)}" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.75"/>`) + dedans + "</g>";
    }
    __name(bloc, "bloc");
    var lezard = /* @__PURE__ */ __name((x, y, a, s) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})">` + E(-2, -1.9, 1, 0.6, "#7BB34C", 0.5) + E(2.6, -1.9, 1, 0.6, "#7BB34C", 0.5) + `<path d="M-3,0.4 Q-7.6,1.8 -10,-0.4 Q-11.2,-2.2 -9.6,-2.8 Q-9.8,-1.4 -8,-0.6 Q-6,0 -3,-1.2 Z" fill="#8CC45A" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + E(0, 0, 4.2, 1.9, "#8CC45A", 0.7) + E(-0.6, -0.6, 2.6, 0.8, "#B7DE86", 0) + E(-1.6, 0.2, 0.45, 0.45, "#5E9A3E", 0) + E(0.6, 0.5, 0.45, 0.45, "#5E9A3E", 0) + E(1.8, -0.2, 0.4, 0.4, "#5E9A3E", 0) + E(-2, 1.9, 1, 0.6, "#7BB34C", 0.5) + E(2.6, 1.9, 1, 0.6, "#7BB34C", 0.5) + E(4.9, -0.4, 2.2, 1.6, "#8CC45A", 0.7) + E(4.5, -1, 1, 0.5, "#B7DE86", 0) + E(5.6, -0.9, 0.7, 0.75, OUT, 0) + E(5.4, -1.15, 0.24, 0.24, "#FFFFFF", 0) + `<path d="M5.4,0.4 Q6.2,0.8 6.8,0.2" stroke="${OUT}" stroke-width="0.45" fill="none" stroke-linecap="round"/></g>`, "lezard");
    var ROCHER = {
      d: "M-18,0 Q-20,-7 -15,-12 Q-11,-19 -2,-20 Q8,-21 13,-15 Q19,-9 18,-2 Q17,2 10,2.6 Q0,3.6 -10,2.6 Q-17,2 -18,0 Z",
      haut: "M-22,-10 Q-14,-11 -4,-13.4 Q4,-15 9,-19 L9,-26 L-22,-26 Z",
      flanc: "M4,-24 Q9,-14 6,-6 Q4,0 5,6 L26,6 L26,-24 Z",
      fentes: "M-3,-20 Q-1.6,-16.6 -4,-13.6 M6,-6 Q9,-4.6 10.4,-1.4 M-12,-4 l3,1.2",
      reflet: "M-13.4,-12.6 Q-10,-17 -5,-18"
    };
    var CAILLOU = {
      d: "M-4,0.6 Q-4.6,-2.6 -1.4,-3.6 Q2.4,-4.2 3.8,-1.4 Q4.4,0.8 2,1.2 Q-1,1.6 -4,0.6 Z",
      haut: "M-6,-1.6 Q-2,-2 2,-3.6 L2,-6 L-6,-6 Z",
      flanc: "M1,-5 Q2.4,-2 1.4,2 L6,2 L6,-5 Z"
    };
    function rocher({ teinte = "gris", petit = false, lezard: avecLezard = false } = {}) {
      const c = PIERRES[teinte], k = petit ? 0.75 : 1;
      const id = `roc${petit ? "p" : "g"}${teinte[0]}${avecLezard ? "l" : ""}`;
      return E(1, 1.5, 22 * k, 6.5 * k, "rgba(40,55,20,0.22)", 0) + bloc(`${id}a`, ROCHER, c, k) + `<g transform="translate(${r2(-21 * k)} ${r2(3.4 * k)})">${bloc(`${id}b`, CAILLOU, c, k)}</g>` + (avecLezard ? lezard(-1 * k, -18.6 * k, -12, Math.max(k, 0.85)) : "");
    }
    __name(rocher, "rocher");
    var NEIGE_ROCHER = "M-22,-8.6 Q-17,-7.4 -13,-10.2 Q-8,-8 -3,-11.2 Q3,-9.4 7.6,-13 Q11.6,-10.4 15.6,-11.6 Q19,-9 22,-9.4 L22,-26 L-22,-26 Z";
    var NEIGE_CAILLOU = "M-6,-0.6 Q-3,0.4 -1,-1.6 Q1.4,-0.2 3,-1.8 Q4.6,-0.6 6,-0.8 L6,-6 L-6,-6 Z";
    var neigeSur = /* @__PURE__ */ __name((d, k) => `<path d="${sc(d.replace(/-?\d+(\.\d+)?,(-?\d+(\.\d+)?)/g, (m, x, y) => `${x},${r2(+y + 1.3)}`), k)}" fill="#D6E4EE"/><path d="${sc(d, k)}" fill="#FFFFFF"/>`, "neigeSur");
    function rocherSaison({ saison = "hiver", petit = false } = {}) {
      const c = PIERRES.gris, k = petit ? 0.75 : 1, hiver = saison === "hiver";
      const id = `rocs${saison[0]}${petit ? "p" : "g"}`;
      let o = E(1, 1.5, 22 * k, 6.5 * k, hiver ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + bloc(`${id}a`, ROCHER, c, k, hiver ? neigeSur(NEIGE_ROCHER, k) : "") + `<g transform="translate(${r2(-21 * k)} ${r2(3.4 * k)})">${bloc(`${id}b`, CAILLOU, c, k, hiver ? neigeSur(NEIGE_CAILLOU, k) : "")}</g>`;
      if (hiver) o += congere(k * 0.9);
      else if (saison === "automne") o += [[-8, -17.6, 30, 0, 1], [3, -18.6, -40, 1, 0.95], [10, -14, 70, 2, 0.9]].map(([x, y, a, i, s]) => feuilleMorte(x * k, y * k, a, ROUSSES[i], s)).join("") + [[-14, 4.6, 50, 1], [8, 5.4, -20, 0], [15, 3.4, 80, 2], [-2, 6.2, 10, 2]].map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join("");
      else o += herbe(-12 * k, 4.6, "#9ACD5E", 0.8) + herbe(14 * k, 3.6, "#8CC152", 0.75) + [[-6, 5.4, "#FFFFFF"], [9, 5.8, "#F7B6C8"], [18, 4.2, "#FFFFFF"], [-17, 6.4, "#F2C04B"]].map(([x, y, col]) => fleurette(x * k, y, col)).join("");
      return o;
    }
    __name(rocherSaison, "rocherSaison");
    var ROCHERS_SAISONS = [];
    for (const saison of ["printemps", "automne", "hiver"]) for (const petit of [false, true]) {
      ROCHERS_SAISONS.push([["rocher", saison, petit && "petit"].filter(Boolean).join("_"), `Rocher ${{ printemps: "de printemps", automne: "d'automne", hiver: "d'hiver" }[saison]} (${petit ? "petit" : "grand"}, ${{ printemps: "herbe neuve et fleurettes au pied", automne: "feuilles mortes dessus et au pied", hiver: "calotte de neige, congère au pied" }[saison]})`, { saison, petit }]);
    }
    var ROCHERS = [];
    for (const petit of [false, true]) for (const teinte of ["gris", "ocre"]) for (const lz of [false, true]) {
      const fichier = ["rocher", petit && "petit", teinte === "ocre" && "ocre", lz && "lezard"].filter(Boolean).join("_");
      const libelle = `Rocher (${[petit ? "petit" : "grand", teinte === "ocre" ? "grès ocre" : "granite gris", lz && "un lézard"].filter(Boolean).join(", ")})`;
      ROCHERS.push([fichier, libelle, { teinte, petit, lezard: lz }]);
    }
    var BLOC_HAUT = {
      d: "M-12,0 Q-13.6,-7 -10.4,-12.4 L-3,-16.6 Q2.6,-18.6 7,-15.6 Q11.6,-11.6 11.4,-5 Q11,0.6 4,1.6 Q-6,2 -12,0 Z",
      haut: "M-16,-10 Q-8,-11 -1,-13 Q4,-14.4 8,-16 L8,-24 L-16,-24 Z",
      flanc: "M5,-20 Q7.4,-11 5.6,-5 Q4.6,-1 5.4,4 L16,4 L16,-20 Z",
      fentes: "M0,-17.4 Q1.4,-14 -0.6,-11.4 M-8,-3 l2.4,1",
      reflet: "M-9.4,-11.6 L-4,-14.8"
    };
    var BLOC_PLAT = {
      d: "M-10,0 Q-11.4,-4.4 -7.6,-7.4 Q-3,-10 3,-9.4 Q8.6,-8.6 10,-4.4 Q11,-0.6 7.6,0.8 Q0,2 -10,0 Z",
      haut: "M-14,-4.6 Q-6,-5.4 0,-6.6 Q4,-7.4 7,-9.8 L7,-14 L-14,-14 Z",
      flanc: "M3,-12 Q6,-6 4,-2 Q3.4,0 4,3 L14,3 L14,-12 Z",
      fentes: "M-3,-9.4 Q-2,-7.4 -3.4,-5.6",
      reflet: "M-7,-6.4 Q-5,-8.4 -2,-9"
    };
    var galet = /* @__PURE__ */ __name((x, y, rx, ry, c) => E(x, y, rx, ry, c.mid, 0.6) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.45, ry * 0.35, c.light, 0), "galet");
    var GALETS = [[-4, 9.4, 2.4, 1.3], [5, 10.2, 1.9, 1.05], [18, 8, 2.2, 1.2], [-21, 3.4, 1.7, 0.95], [-12.6, 10, 1.4, 0.8]];
    var pose = /* @__PURE__ */ __name((x, y, k, svg) => `<g transform="translate(${r2(x * k)} ${r2(y * k)})">${svg}</g>`, "pose");
    function rochers({ teinte = "gris", petits = false, galets = false } = {}) {
      const c = PIERRES[teinte], k = petits ? 0.75 : 1;
      const id = `rcs${petits ? "p" : "g"}${teinte[0]}${galets ? "g" : ""}`;
      return E(1, 3, 25 * k, 8 * k, "rgba(40,55,20,0.22)", 0) + pose(-5, -1, k, bloc(`${id}a`, BLOC_HAUT, c, k * 1.1)) + pose(-13, 4.6, k, bloc(`${id}b`, CAILLOU, c, k * 1.25)) + pose(8, 4, k, bloc(`${id}c`, BLOC_PLAT, c, k)) + (galets ? GALETS.map(([x, y, rx, ry]) => galet(x * k, y * k, rx * k, ry * k, c)).join("") : "");
    }
    __name(rochers, "rochers");
    var ROCHERS_TAS = [];
    for (const petits of [false, true]) for (const teinte of ["gris", "sombre"]) for (const ga of [false, true]) {
      const fichier = ["rochers", petits && "petits", teinte === "sombre" && "sombres", ga && "galets"].filter(Boolean).join("_");
      const libelle = `Rochers (${[petits ? "petits" : "grands", teinte === "sombre" ? "pierre sombre" : "granite gris", ga && "des galets au pied"].filter(Boolean).join(", ")})`;
      ROCHERS_TAS.push([fichier, libelle, { teinte, petits, galets: ga }]);
    }
    var AIGUILLE = {
      d: "M-11,0 Q-12,-9 -9.6,-17 L-6.4,-27 Q-5,-33 -1.6,-37 L3.4,-35.4 Q6.4,-30 7.4,-24 L9.2,-15 Q11,-7 10.4,-2 Q9.4,1.6 3,1.8 Q-5,2 -11,0 Z",
      haut: "M-16,-12 Q-10,-16 -7,-25 Q-4.4,-31 -1,-33.4 Q2,-33.4 4,-35 L4,-44 L-16,-44 Z",
      flanc: "M2.4,-44 Q3,-30 4.2,-20 Q5.4,-8 4.4,4 L16,4 L16,-44 Z",
      fentes: "M-9,-17 Q-6,-15.6 -3,-16.4 M-1.4,-31 Q0.4,-27.4 -1.8,-24 M5.4,-13 Q7.4,-10 6.8,-6 M-7,-6 l2.4,0.8",
      reflet: "M-8.4,-18.6 L-5.8,-26.4"
    };
    var oiseau = /* @__PURE__ */ __name((x, y, s) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})"><path d="M-0.6,-0.4 l-0.4,0.8 M1,-0.4 l0.4,0.8" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/><path d="M2.6,-3 L6.6,-5.6 L6.4,-3 Z" fill="#8C6343" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` + E(0, -3.2, 3.6, 2.9, "#B98A5E", 0.7) + E(-0.9, -2.5, 2.2, 1.8, "#F1DDBF", 0) + `<path d="M-0.2,-4.4 Q2.6,-5.4 4,-3 Q2,-1.6 -0.2,-2.6 Z" fill="#8C6343" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` + E(-2.4, -6.2, 2.2, 2, "#B98A5E", 0.7) + E(-3.4, -5.4, 0.7, 0.4, "#F7A8B8", 0) + E(-3, -6.7, 0.55, 0.6, OUT, 0) + E(-3.15, -6.9, 0.18, 0.18, "#FFFFFF", 0) + `<path d="M-4.4,-6.5 L-6,-6 L-4.4,-5.5 Z" fill="#F2A33A" stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"/></g>`, "oiseau");
    function aiguille({ petite = false, double = false, oiseau: avecOiseau = false } = {}) {
      const c = PIERRES.gris, k = petite ? 0.75 : 1;
      const id = `aig${petite ? "p" : "g"}${double ? "d" : ""}${avecOiseau ? "o" : ""}`;
      return E(1, 2.5, 22 * k, 7 * k, "rgba(40,55,20,0.22)", 0) + (double ? pose(10, -1.5, k, bloc(`${id}d`, AIGUILLE, c, k * 0.62)) : "") + pose(-2, 0, k, bloc(`${id}a`, AIGUILLE, c, k)) + pose(-13, 4.4, k, bloc(`${id}b`, CAILLOU, c, k)) + pose(10, 5, k, bloc(`${id}c`, BLOC_PLAT, c, k * 0.6)) + (avecOiseau ? oiseau(-1.4 * k, -36.2 * k, Math.max(k, 0.85)) : "");
    }
    __name(aiguille, "aiguille");
    var AIGUILLES = [];
    for (const petite of [false, true]) for (const double of [false, true]) for (const oi of [false, true]) {
      const fichier = ["aiguille", petite && "petite", double && "double", oi && "oiseau"].filter(Boolean).join("_");
      const libelle = `Aiguille de roche (${[petite ? "petite" : "grande", double ? "double" : "seule", oi && "un oiseau perché"].filter(Boolean).join(", ")})`;
      AIGUILLES.push([fichier, libelle, { petite, double, oiseau: oi }]);
    }
    var MOUSSE = { light: "#B5DC86", mid: "#8FC25E", dark: "#6FA24A", bord: "#5E8F3E" };
    function mousse(bord, ombre, reflet, k) {
      return `<path d="${sc(bord, k)}" fill="${MOUSSE.mid}" stroke="${MOUSSE.bord}" stroke-width="0.7" stroke-linejoin="round"/><path d="${sc(ombre, k)}" fill="${MOUSSE.dark}"/><path d="${sc(reflet, k)}" fill="${MOUSSE.light}"/>`;
    }
    __name(mousse, "mousse");
    var MOUSSE_ROCHER = [
      "M-22,-11 Q-18,-8.4 -15,-10.6 Q-12,-7.4 -8.6,-10 Q-5.6,-7.2 -2,-9.6 Q1.6,-6.8 4.6,-9.6 Q8,-7.4 10.6,-10.4 Q14,-8.2 22,-11 L22,-26 L-22,-26 Z",
      "M7,-26 Q9.6,-18 8.6,-11 Q12,-9 22,-11 L22,-26 Z",
      "M-11,-15.6 Q-7,-18.4 -1,-17.6 Q-5,-15.8 -11,-15.6 Z"
    ];
    var MOUSSE_PLAT = [
      "M-14,-4 Q-10,-2.2 -7,-4 Q-4,-1.8 -1,-3.8 Q2,-1.8 5,-4 Q8,-2.2 14,-4.6 L14,-14 L-14,-14 Z",
      "M4,-14 Q6,-8 5,-3.4 Q8,-2.4 14,-4.6 L14,-14 Z",
      "M-6,-7 Q-3,-8.8 1,-8.4 Q-2,-7.2 -6,-7 Z"
    ];
    var FLEURS_MOUSSE = [[-12, -12.6, "#FFFFFF"], [-4.6, -15.6, "#F7B6C8"], [3, -13, "#FFFFFF"], [12, 0.6, "#F7B6C8"], [16.4, 1.4, "#FFFFFF"]];
    var escargot = /* @__PURE__ */ __name((x, y, s) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})"><path d="M4.6,-2.8 L5.2,-5.8 M5.4,-2.6 L6.8,-5.2" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>` + E(5.2, -5.9, 0.5, 0.5, OUT, 0) + E(6.8, -5.3, 0.5, 0.5, OUT, 0) + `<path d="M-4.4,0 Q-5,-1.2 -2.6,-1.4 L3,-1.4 Q4.4,-1.6 4.8,-3.2 L5.6,-3.2 Q6.6,-0.6 5,0.2 Q0,0.6 -4.4,0 Z" fill="#E9D9B8" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + E(-0.4, -3.6, 3.4, 3.1, "#E59A55", 0.7) + E(-1.2, -4.6, 1.4, 0.9, "#F4BE84", 0) + `<path d="M-0.2,-3.4 a0.8,0.8 0 1 1 0.9,-0.6 a1.8,1.8 0 1 1 -2.6,1.6" stroke="#B9692F" stroke-width="0.55" fill="none" stroke-linecap="round"/><path d="M5.2,-1.2 Q5.6,-0.8 6,-1.2" stroke="${OUT}" stroke-width="0.4" fill="none" stroke-linecap="round"/></g>`, "escargot");
    function rochersMoussus({ petits = false, fleuris = false, escargot: avecEscargot = false } = {}) {
      const c = PIERRES.gris, k = petits ? 0.75 : 1;
      const id = `rcm${petits ? "p" : "g"}${fleuris ? "f" : ""}${avecEscargot ? "e" : ""}`;
      const kg = k * 0.82, kp = k * 0.85;
      return E(1, 2.5, 24 * k, 7.5 * k, "rgba(40,55,20,0.22)", 0) + pose(-4, -1, k, bloc(`${id}a`, ROCHER, c, kg, mousse(...MOUSSE_ROCHER, kg))) + pose(-17, 4.6, k, bloc(`${id}b`, CAILLOU, c, k)) + pose(11, 4, k, bloc(`${id}c`, BLOC_PLAT, c, kp, mousse(...MOUSSE_PLAT, kp))) + (fleuris ? FLEURS_MOUSSE.map(([x, y, col]) => fleurette(x * k, y * k, col)).join("") : "") + (avecEscargot ? escargot(-8 * k, 8 * k, Math.max(k, 0.85)) : "");
    }
    __name(rochersMoussus, "rochersMoussus");
    var ROCHERS_MOUSSUS = [];
    for (const petits of [false, true]) for (const fleuris of [false, true]) for (const es of [false, true]) {
      const fichier = ["rochers_moussus", petits && "petits", fleuris && "fleuris", es && "escargot"].filter(Boolean).join("_");
      const libelle = `Rochers moussus (${[petits ? "petits" : "grands", fleuris && "mousse fleurie", es && "un escargot"].filter(Boolean).join(", ")})`;
      ROCHERS_MOUSSUS.push([fichier, libelle, { petits, fleuris, escargot: es }]);
    }
    module.exports = { rocherSaison, ROCHERS_SAISONS, rocher, ROCHERS, rochers, ROCHERS_TAS, aiguille, AIGUILLES, rochersMoussus, ROCHERS_MOUSSUS };
  }
});

// atelier/plage.js
var require_plage = __commonJS({
  "atelier/plage.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var ombre = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, "rgba(120,90,40,0.2)", 0), "ombre");
    var sc = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k)), "sc");
    var groupe = /* @__PURE__ */ __name((x, y, s, svg) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">${svg}</g>`, "groupe");
    var COLORIS = {
      chauds: { coq: "#FBE3CC", strie: "#DDAA84", sj: "#F6B2BE", cote: "#D27C90", dedans: "#F29AA8" },
      nacres: { coq: "#EFE6F6", strie: "#B9A3D2", sj: "#DCCBF0", cote: "#9D84C2", dedans: "#C9B2E6" }
    };
    function saintJacques(id, c) {
      const d = "M0,0 L-1.8,-0.2 L-1.6,-1.2 Q-5.8,-1.8 -5.8,-3.8 Q-3.4,-6.4 0,-6.6 Q3.4,-6.4 5.8,-3.8 Q5.8,-1.8 1.6,-1.2 L1.8,-0.2 Z";
      return `<path d="${d}" fill="${c.sj}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M1.2,-8 L8,-8 L8,1 L1.2,1 Z" fill="${c.cote}" opacity="0.35"/>` + E(-2.4, -4.6, 2, 0.9, "#FFFFFF", 0).replace("/>", ' opacity="0.55"/>') + "</g>" + [-4.2, -2.4, -0.8, 0.8, 2.4, 4.2].map((x) => `<path d="M0,-1.2 L${r2(x)},${r2(-5.6 + Math.abs(x) * 0.28)}" stroke="${c.cote}" stroke-width="0.5" stroke-linecap="round"/>`).join("");
    }
    __name(saintJacques, "saintJacques");
    function conque(id, c) {
      const d = "M-7.4,-3.6 L-5.2,-3.4 Q-4.4,-4.8 -2.8,-4 Q-1.6,-5.8 0.6,-4.8 Q3,-6.4 5.2,-4.4 Q7.4,-2.2 5.6,0.2 Q3.4,1.8 0,0.8 Q-3.4,-0.4 -7.4,-3.6 Z";
      return `<path d="${d}" fill="${c.coq}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M-8,-2 Q0,1 8,-1.4 L8,3 L-8,3 Z" fill="${c.strie}" opacity="0.4"/></g><path d="M-5.2,-3.4 Q-4.4,-2.6 -3.6,-1.8 M-2.8,-4 Q-2,-2.4 -1,-0.6 M0.6,-4.8 Q1.4,-2.4 2.4,0.4" stroke="${c.strie}" stroke-width="0.6" fill="none" stroke-linecap="round"/>` + E(4, -1.6, 1.9, 1.3, c.dedans, 0.6) + E(3.6, -1.9, 0.8, 0.5, "#FFFFFF", 0).replace("/>", ' opacity="0.6"/>');
    }
    __name(conque, "conque");
    var coque = /* @__PURE__ */ __name((x, y, r, c) => E(x, y, r, r * 0.7, c.coq, 0.7) + `<path d="M${r2(x - r * 0.4)},${r2(y + r * 0.5)} Q${r2(x - r * 0.5)},${r2(y - r * 0.2)} ${r2(x - r * 0.2)},${r2(y - r * 0.6)} M${r2(x + r * 0.3)},${r2(y + r * 0.55)} Q${r2(x + r * 0.4)},${r2(y - r * 0.1)} ${r2(x + r * 0.15)},${r2(y - r * 0.62)}" stroke="${c.strie}" stroke-width="0.45" fill="none" stroke-linecap="round"/>` + E(x - r * 0.35, y - r * 0.25, r * 0.3, r * 0.18, "#FFFFFF", 0), "coque");
    function etoile(x, y, s) {
      const bras = [0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5;
        const p = /* @__PURE__ */ __name((ang, r) => `${r2(x + Math.cos(ang) * r * s)},${r2(y + Math.sin(ang) * r * 0.62 * s)}`, "p");
        return `${i ? "L" : "M"}${p(a - 0.12, 4.6)} Q${p(a, 5.6)} ${p(a + 0.12, 4.6)} L${p(b, 1.9)}`;
      }).join(" ") + " Z";
      return `<path d="${bras}" fill="#F29A4A" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>` + E(x, y, 1.3 * s, 0.8 * s, "#F7B877", 0) + [0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        return E(x + Math.cos(a) * 3 * s, y + Math.sin(a) * 1.86 * s, 0.4 * s, 0.3 * s, "#FFE1B8", 0);
      }).join("");
    }
    __name(etoile, "etoile");
    function coquillages({ coloris = "chauds", petits = false, etoile: avecEtoile = false } = {}) {
      const c = COLORIS[coloris], k = petits ? 0.75 : 1;
      const id = `coq${petits ? "p" : "g"}${coloris[0]}${avecEtoile ? "e" : ""}`;
      return ombre(12 * k, 5.4 * k, 6.6 * k, 2 * k) + ombre(-11.6 * k, 2.4 * k, 7 * k, 1.8 * k) + groupe(12 * k, 5 * k, 1.5 * k, saintJacques(`${id}a`, c)) + groupe(-11.6 * k, 2 * k, 1.5 * k, conque(`${id}b`, c)) + coque(0, 8.6 * k, 2.4 * k, c) + coque(21 * k, -2.6 * k, 1.9 * k, c) + coque(-21 * k, -4 * k, 1.6 * k, c) + (avecEtoile ? etoile(1 * k, -8 * k, 1.3 * k) : "");
    }
    __name(coquillages, "coquillages");
    var COQUILLAGES = [];
    for (const petits of [false, true]) for (const coloris of ["chauds", "nacres"]) for (const et of [false, true]) {
      const fichier = ["coquillages", petits && "petits", coloris === "nacres" && "nacres", et && "etoile"].filter(Boolean).join("_");
      const libelle = `Coquillages (${[petits ? "petits" : "grands", coloris === "nacres" ? "nacrés" : "coloris chauds", et && "une étoile de mer"].filter(Boolean).join(", ")})`;
      COQUILLAGES.push([fichier, libelle, { coloris, petits, etoile: et }]);
    }
    var BOIS = {
      blanchi: { light: "#F3ECDE", mid: "#D9CEBB", dark: "#B0A38D" },
      sombre: { light: "#BE9E7E", mid: "#97795D", dark: "#6F5641" }
    };
    var BRANCHE = [["M-22,5 Q-10,-1 4,1 Q14,2 22,-3", 6], ["M-2,0.6 Q2,-6 8,-9", 3], ["M13,1.6 Q16,-3.6 20,-5", 2.2]];
    var trait = /* @__PURE__ */ __name((d, col, w, dy = 0) => `<path d="${d}" stroke="${col}" stroke-width="${r2(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"${dy ? ` transform="translate(0 ${r2(dy)})"` : ""}/>`, "trait");
    var algue = /* @__PURE__ */ __name((d, nervure, col, k) => `<path d="${sc(d, k)}" fill="${col}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` + trait(sc(nervure, k), "#4E8A3A", 0.45), "algue");
    var ALGUES = [
      ["M-9,-1.6 Q-10.6,2 -9,4.6 Q-7.8,6.6 -9.4,8.6 Q-6.4,7.6 -6.8,4.8 Q-7.2,2 -6.6,-1.4 Z", "M-7.8,-1 Q-8.6,2.4 -7.8,4.8 Q-7.4,6.4 -8.4,7.8", "#6FAE4E"],
      ["M-6,-1.4 Q-4,1.6 -5.4,4 Q-3.2,3 -3.4,0.4 Q-3.6,-1 -4.4,-1.8 Z", "M-5,-1.2 Q-4,1 -4.6,3", "#8CC45A"],
      ["M9,0 Q7.6,3 9,5.8 Q10.4,4.6 10.6,2 Q10.8,0.6 10.6,-0.4 Z", "M9.8,0 Q9,2.6 9.4,4.8", "#6FAE4E"]
    ];
    function boisFlotte({ bois = "blanchi", petit = false, algues = false } = {}) {
      const c = BOIS[bois], k = petit ? 0.75 : 1;
      const tr = BRANCHE.map(([d, w]) => [sc(d, k), w * k]);
      return ombre(0, 4.6 * k, 24 * k, 4.6 * k) + tr.map(([d, w]) => trait(d, OUT, w + 2.2)).join("") + tr.map(([d, w]) => trait(d, c.mid, w)).join("") + tr.map(([d, w]) => trait(d, c.dark, w * 0.42, w * 0.22)).join("") + tr.map(([d, w]) => trait(d, c.light, w * 0.36, -w * 0.2)).join("") + trait(sc("M-16,3.2 Q-9,0.2 -3,0.4 M6,1.4 Q12,1.8 17,-0.2", k), c.dark, 0.5) + E(-8 * k, 1.6 * k, 1.2 * k, 0.7 * k, c.dark, 0.5) + (algues ? ALGUES.map(([d, n, col]) => algue(d, n, col, k)).join("") + coque(-17 * k, 9 * k, 2 * k, COLORIS.chauds) : "");
    }
    __name(boisFlotte, "boisFlotte");
    var BOIS_FLOTTES = [];
    for (const petit of [false, true]) for (const bois of ["blanchi", "sombre"]) for (const al of [false, true]) {
      const fichier = ["bois_flotte", petit && "petit", bois === "sombre" && "sombre", al && "algues"].filter(Boolean).join("_");
      const libelle = `Bois flotté (${[petit ? "petit" : "grand", bois === "sombre" ? "bois mouillé sombre" : "bois blanchi", al && "des algues accrochées"].filter(Boolean).join(", ")})`;
      BOIS_FLOTTES.push([fichier, libelle, { bois, petit, algues: al }]);
    }
    module.exports = { coquillages, COQUILLAGES, boisFlotte, BOIS_FLOTTES };
  }
});

// atelier/objets.js
var require_objets = __commonJS({
  "atelier/objets.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var { box } = require_deco();
    var ombre = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, "rgba(40,55,20,0.22)", 0), "ombre");
    var trait = /* @__PURE__ */ __name((d, col, w) => `<path d="${d}" stroke="${col}" stroke-width="${r2(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var groupe = /* @__PURE__ */ __name((x, y, s, svg, a = 0) => `<g transform="translate(${r2(x)} ${r2(y)})${a ? ` rotate(${a})` : ""} scale(${r2(s)})">${svg}</g>`, "groupe");
    var PAILLE = { light: "#EDD290", mid: "#D3AF64", dark: "#A67F40", creux: "#7A5A30" };
    function brins(k, devant) {
      let o = "";
      for (let i = 0; i < 34; i++) {
        const a = i / 34 * Math.PI * 2 + 0.05;
        if (Math.sin(a) > 0 !== devant) continue;
        const rx = (10.8 - i % 3 * 0.8) * k, ry = (5.3 - i % 3 * 0.4) * k, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
        const tx = -Math.sin(a) * 2.4 * k, ty = Math.cos(a) * 1.2 * k;
        o += trait(`M${r2(x - tx)},${r2(y - ty)} Q${r2(x + Math.cos(a) * 1 * k)},${r2(y + Math.sin(a) * 0.7 * k)} ${r2(x + tx)},${r2(y + ty)}`, i % 3 ? PAILLE.light : PAILLE.dark, 0.8 * k);
      }
      return o;
    }
    __name(brins, "brins");
    var BRINDILLES = ["M-10.4,-1.6 L-14,-3.6 M-12.6,-2.8 L-13.4,-4.6", "M10.8,2.6 L14,2 M12.6,2.3 L13.6,3.4"];
    var brindilles = /* @__PURE__ */ __name((k) => BRINDILLES.map((d) => {
      const s = d.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k));
      return trait(s, OUT, 1.6 * k) + trait(s, PAILLE.dark, 0.6 * k);
    }).join(""), "brindilles");
    var oeuf = /* @__PURE__ */ __name((x, y, k) => E(x, y, 2.6 * k, 3.2 * k, "#E4EEEA", 0.8) + [[0.9, -0.8, 0.5], [-1, 0.6, 0.45], [0.6, 1.4, 0.35], [-0.4, -1.8, 0.3]].map(([dx, dy, r]) => E(x + dx * k, y + dy * k, r * k, r * k, "#8C7458", 0)).join("") + E(x - 0.9 * k, y - 1.3 * k, 0.7 * k, 1 * k, "#FFFFFF", 0), "oeuf");
    var poussin = /* @__PURE__ */ __name((x, y, k, regard = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(regard * k)} ${r2(k)})">` + E(0, -2.6, 3.4, 3, "#D9D5CD", 0.8) + E(-0.8, -3.4, 1.8, 1.2, "#F1EEE8", 0) + trait("M-0.2,-5.5 q-0.2,-0.9 0.5,-1.1 M0.6,-5.5 q0.3,-0.7 1,-0.6", OUT, 0.55) + E(-1.2, -3.2, 0.5, 0.55, OUT, 0) + E(1.2, -3.2, 0.5, 0.55, OUT, 0) + E(-1.35, -3.4, 0.17, 0.17, "#FFFFFF", 0) + E(1.05, -3.4, 0.17, 0.17, "#FFFFFF", 0) + `<path d="M-0.9,-2.3 L0,-1.2 L0.9,-2.3 L0,-2.8 Z" fill="#F2B33D" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` + E(-2.2, -2.3, 0.6, 0.35, "#F7A8B8", 0) + E(2.2, -2.3, 0.6, 0.35, "#F7A8B8", 0) + "</g>", "poussin");
    var plume = /* @__PURE__ */ __name((x, y, s, a) => groupe(x, y, s, `<path d="M0,0 Q-1.8,-3.6 -0.6,-8 Q0.4,-9.6 1.2,-8 Q2,-3.6 0,0 Z" fill="#F4F6F6" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/><path d="M-0.6,-8 Q0.4,-9.6 1.2,-8 Q0.6,-6.6 -0.4,-6.8 Z" fill="#9AA4AA"/>` + trait("M0,0.6 L0.3,-8.4", "#9AA4AA", 0.5), a), "plume");
    function nid({ petit = false, poussins = false, plume: avecPlume = false } = {}) {
      const k = petit ? 0.75 : 1;
      return ombre(1, 2.4 * k, 15 * k, 6.4 * k) + `<path d="M${r2(-12 * k)},0 L${r2(-11.2 * k)},${r2(3.4 * k)} A${r2(11.2 * k)} ${r2(5.6 * k)} 0 0 0 ${r2(11.2 * k)},${r2(3.4 * k)} L${r2(12 * k)},0 Z" fill="${PAILLE.dark}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>` + trait(`M${r2(-10 * k)},${r2(4.6 * k)} Q0,${r2(8.4 * k)} ${r2(10 * k)},${r2(4.6 * k)} M${r2(-11 * k)},${r2(2.4 * k)} Q0,${r2(6.6 * k)} ${r2(11 * k)},${r2(2.4 * k)}`, PAILLE.mid, 0.7 * k) + E(0, 0, 12 * k, 6 * k, PAILLE.mid, 1.1) + E(0, -0.4 * k, 8 * k, 3.8 * k, PAILLE.creux, 0.7) + E(0.6 * k, 0.2 * k, 6 * k, 2.6 * k, "#5E4424", 0) + brins(k, false) + brindilles(k) + (poussins ? poussin(-3 * k, 1.2 * k, k, -1) + poussin(2.8 * k, 1.6 * k, k * 0.92) : oeuf(-3 * k, -1.8 * k, k) + oeuf(2.6 * k, -1.4 * k, k) + oeuf(-0.2 * k, 0, k)) + brins(k, true) + (avecPlume ? plume(10 * k, -1 * k, 0.9 * k, 28) + plume(-15 * k, 6 * k, 0.75 * k, -68) : "");
    }
    __name(nid, "nid");
    var NIDS = [];
    for (const petit of [false, true]) for (const po of [false, true]) for (const pl of [false, true]) {
      const fichier = ["nid", petit && "petit", po && "poussins", pl && "plume"].filter(Boolean).join("_");
      const libelle = `Nid de mouettes (${[petit ? "petit" : "grand", po ? "deux poussins" : "trois œufs", pl && "une plume"].filter(Boolean).join(", ")})`;
      NIDS.push([fichier, libelle, { petit, poussins: po, plume: pl }]);
    }
    var POTEAUX = {
      bois: { light: "#C98E58", mid: "#9C6638", dark: "#6E4424" },
      fer: { light: "#6A7078", mid: "#454B53", dark: "#2C3036" }
    };
    var FER = { mid: "#3E4248", light: "#5C626A" };
    var feuilleLierre = /* @__PURE__ */ __name((x, y, a) => groupe(x, y, 0.8, `<path d="M0,0 Q-2.4,-1.2 -1.8,-3 Q-0.8,-3.8 0,-2.8 Q0.8,-3.8 1.8,-3 Q2.4,-1.2 0,0 Z" fill="#5E9E48" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>` + trait("M0,-0.4 L0,-2.4", "#3E7A34", 0.4), a), "feuilleLierre");
    var LIERRE = [[-2.4, -6, -40], [2.4, -11, 35], [-2.4, -16, -30], [2.2, -21, 40], [-2.2, -26, -35], [2, -31, 30]];
    function lanterne({ poteau = "bois", lierre = false, allumee = false } = {}) {
      const c = POTEAUX[poteau], fer = poteau === "fer";
      const id = `lan${poteau[0]}${lierre ? "l" : ""}${allumee ? "a" : ""}`;
      const w = fer ? 1.6 : 2.2;
      const pied = fer ? `<path d="M-4,0.6 Q-3.6,-2.4 -${w},-4 L${w},-4 Q3.6,-2.4 4,0.6 Z" fill="${c.mid}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` : `<path d="M-3.6,0.8 L-3,-1.6 L3,-1.6 L3.6,0.8 Z" fill="#9A9488" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`;
      const poteauSvg = `<rect x="${-w}" y="-41" width="${2 * w}" height="${fer ? 37 : 39.4}" rx="${fer ? 0.8 : 1}" fill="${c.mid}" stroke="${OUT}" stroke-width="1"/><rect x="${r2(w * 0.25)}" y="-40.4" width="${r2(w * 0.65)}" height="${fer ? 36 : 38.6}" fill="${c.dark}"/><rect x="${r2(-w * 0.7)}" y="-40.4" width="${r2(w * 0.4)}" height="${fer ? 36 : 38.6}" fill="${c.light}"/>` + (fer ? "" : trait("M-0.6,-34 l0,4 M0.4,-20 l0,5 M-0.4,-9 l0,3", c.dark, 0.5));
      const potence = trait("M0,-41 L9.4,-41", OUT, 3.4) + trait("M0,-41 L9.4,-41", c.mid, 1.8) + (fer ? trait("M0,-35 Q5.4,-35.4 5.4,-41 Q2.6,-41 3,-38.4", OUT, 2.2) + trait("M0,-35 Q5.4,-35.4 5.4,-41 Q2.6,-41 3,-38.4", c.mid, 0.9) : trait("M0,-35 L5.4,-41", OUT, 2.6) + trait("M0,-35 L5.4,-41", c.mid, 1.2)) + E(0, -41.6, w * 0.9, 1, c.mid, 0.9);
      const vitre = allumee ? "#FFE27A" : "#DCE7EB";
      const lumiere = allumee ? `<defs><radialGradient id="${id}g"><stop offset="0" stop-color="#FFE08A" stop-opacity="0.7"/><stop offset="0.5" stop-color="#FFE08A" stop-opacity="0.26"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient></defs><circle cx="8.6" cy="-31.6" r="17" fill="url(#${id}g)"/>` + E(8.6, 1.4, 9, 3, "rgba(255,224,138,0.32)", 0) : "";
      const lanterneSvg = trait("M8.6,-41 L8.6,-38.4", OUT, 0.9) + `<path d="M5.4,-35.6 L6.6,-38.6 L10.6,-38.6 L11.8,-35.6 Z" fill="${FER.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>` + E(8.6, -39.2, 1, 0.8, FER.mid, 0.7) + `<rect x="5.6" y="-35.6" width="6" height="7.8" fill="${vitre}" stroke="${OUT}" stroke-width="0.9"/>` + (allumee ? `<path d="M8.6,-30 Q6.8,-31.6 8.6,-34.4 Q10.4,-31.6 8.6,-30 Z" fill="#F29A4A"/><path d="M8.6,-30.4 Q7.8,-31.4 8.6,-32.8 Q9.4,-31.4 8.6,-30.4 Z" fill="#FFF6C8"/>` : `<path d="M6.4,-29.2 L8.4,-34.8" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/>`) + trait("M8.6,-35.6 L8.6,-27.8 M5.6,-31.7 L11.6,-31.7", FER.mid, 0.6) + `<path d="M5,-27.8 L12.2,-27.8 L11,-26.4 L6.2,-26.4 Z" fill="${FER.mid}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`;
      return ombre(1, 0.8, 8, 3) + lumiere + pied + poteauSvg + (lierre ? trait("M0.6,-1 Q-2.6,-6 0.4,-11 Q3,-16 -0.4,-21 Q-2.8,-26 0.4,-31", "#3E7A34", 0.8) + LIERRE.map(([x, y, a]) => feuilleLierre(x, y, a)).join("") : "") + potence + lanterneSvg;
    }
    __name(lanterne, "lanterne");
    var LANTERNES = [];
    for (const poteau of ["bois", "fer"]) for (const li of [false, true]) for (const al of [false, true]) {
      const fichier = ["lanterne", poteau === "fer" && "fer", li && "lierre", al && "allumee"].filter(Boolean).join("_");
      const libelle = `Lanterne sur pied (${[poteau === "fer" ? "poteau de fer" : "poteau de bois", li && "du lierre", al ? "allumée" : "éteinte"].filter(Boolean).join(", ")})`;
      LANTERNES.push([fichier, libelle, { poteau, lierre: li, allumee: al }]);
    }
    var BANCS = {
      naturel: { lattes: { top: "#E8B97E", left: "#C78D55", right: "#9C6438" }, pieds: { top: "#A9703F", left: "#8B5631", right: "#6A3F22" } },
      peint: { lattes: { top: "#A6D690", left: "#74B366", right: "#518E4C" }, pieds: { top: "#5E8C56", left: "#4A7444", right: "#365A33" } }
    };
    var chat = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">` + E(0, -2.8, 5.4, 3.4, "#F2A35A", 0.8) + E(-1, -3.8, 3.2, 1.6, "#F7C08A", 0) + `<path d="M-2.4,-5.4 Q-1.8,-3.4 -2.6,-1.4 M0,-5.9 Q0.6,-3.6 -0.2,-0.8" stroke="#D27E3A" stroke-width="0.6" fill="none" stroke-linecap="round"/><path d="M-5,-1.4 Q-2,1.4 3.4,0.4 Q5.6,-0.2 5.4,-1.6" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-5,-1.4 Q-2,1.4 3.4,0.4 Q5.6,-0.2 5.4,-1.6" stroke="#F2A35A" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M1.6,-6.2 L2.2,-8.6 L3.6,-6.8 Z M4.4,-6.6 L5.8,-8.4 L6,-6 Z" fill="#F2A35A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` + E(3.8, -4.8, 2.8, 2.3, "#F2A35A", 0.8) + E(3.4, -5.4, 1.4, 0.8, "#F7C08A", 0) + `<path d="M2.4,-4.8 q0.6,0.5 1.2,0 M4.4,-4.8 q0.6,0.5 1.2,0" stroke="${OUT}" stroke-width="0.5" fill="none" stroke-linecap="round"/>` + E(4, -3.9, 0.4, 0.3, "#F29AA8", 0) + E(2.2, -3.9, 0.55, 0.32, "#F7A8B8", 0) + E(5.8, -3.9, 0.55, 0.32, "#F7A8B8", 0) + "</g>", "chat");
    function banc({ petit = false, peint = false, chat: avecChat = false } = {}) {
      const c = BANCS[peint ? "peint" : "naturel"], L2 = petit ? 0.21 : 0.31;
      const pied = /* @__PURE__ */ __name((u, v, z1) => box(u - 0.022, v - 0.022, u + 0.022, v + 0.022, 0, z1, c.pieds, 0.8), "pied");
      const dossier = pied(-L2 + 0.04, -0.088, 22) + pied(L2 - 0.04, -0.088, 22) + box(-L2, -0.105, L2, -0.078, 13.6, 16.4, c.lattes, 0.9) + box(-L2, -0.105, L2, -0.078, 18.4, 21.2, c.lattes, 0.9);
      const pieds = pied(-L2 + 0.04, 0.066, 9) + pied(L2 - 0.04, 0.066, 9);
      const assise = [[-0.092, -0.036], [-0.028, 0.028], [0.036, 0.092]].map(([v0, v1]) => box(-L2, v0, L2, v1, 9, 10.8, c.lattes, 0.9)).join("");
      const [cx, cy] = require_deco().pt(0.06, 0, 10.8);
      return E(0, 3, petit ? 17 : 24, 7.5, "rgba(40,55,20,0.22)", 0) + dossier + pieds + assise + (avecChat ? chat(cx, cy) : "");
    }
    __name(banc, "banc");
    var BANCS_LISTE = [];
    for (const petit of [false, true]) for (const peint of [false, true]) for (const ch of [false, true]) {
      const fichier = ["banc", petit && "petit", peint && "peint", ch && "chat"].filter(Boolean).join("_");
      const libelle = `Banc (${[petit ? "deux places" : "trois places", peint ? "peint en vert" : "bois naturel", ch && "un chat endormi"].filter(Boolean).join(", ")})`;
      BANCS_LISTE.push([fichier, libelle, { petit, peint, chat: ch }]);
    }
    var NEIGE = { light: "#FFFFFF", mid: "#EEF4FA", dark: "#CFDDEB", creux: "#B7C9DC" };
    function bouleDeNeige(id, x, y, r) {
      return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${NEIGE.mid}" stroke="${OUT}" stroke-width="1.1"/><defs><clipPath id="${id}"><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}"/></clipPath></defs><g clip-path="url(#${id})"><circle cx="${r2(x + r * 0.32)}" cy="${r2(y + r * 0.36)}" r="${r2(r * 0.95)}" fill="${NEIGE.dark}"/><circle cx="${r2(x - r * 0.06)}" cy="${r2(y - r * 0.06)}" r="${r2(r * 0.9)}" fill="${NEIGE.mid}"/><circle cx="${r2(x - r * 0.36)}" cy="${r2(y - r * 0.42)}" r="${r2(r * 0.36)}" fill="${NEIGE.light}"/></g>`;
    }
    __name(bouleDeNeige, "bouleDeNeige");
    var brasBrindille = /* @__PURE__ */ __name((x0, y0, x1, y1, s) => {
      const fx = x0 + (x1 - x0) * 0.62, fy = y0 + (y1 - y0) * 0.62;
      const d = `M${r2(x0)},${r2(y0)} L${r2(x1)},${r2(y1)} M${r2(fx)},${r2(fy)} l${r2(2.4 * s)},${r2(-3.2)} M${r2(x1)},${r2(y1)} l${r2(-0.6 * s)},-2.6 M${r2(x1)},${r2(y1)} l${r2(2.4 * s)},-0.6`;
      return trait(d, OUT, 2.9) + trait(d, "#8A5A32", 1.2);
    }, "brasBrindille");
    function echarpe(id, y, couleur, raie) {
      const tour = `M-11,${y - 1.6} Q0,${y + 2.4} 11,${y - 1.6} L11.2,${y + 2.2} Q0,${y + 6.4} -11.2,${y + 2.2} Z`;
      const pan = `M4,${y + 2} L9.4,${y + 1} L11.6,${y + 11} L6.4,${y + 12} Z`;
      return `<path d="${pan}" fill="${couleur}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` + [0.35, 0.7].map((t) => trait(`M${r2(4.6 + 2.1 * t)},${r2(y + 2 + 10 * t)} L${r2(9.8 + 2.1 * t)},${r2(y + 1 + 10 * t)}`, raie, 1.1)).join("") + [6.8, 8.4, 10, 11.4].map((x) => trait(`M${x},${r2(y + 12 - (x - 6.4) * 0.2)} l0.3,2`, couleur, 1)).join("") + `<path d="${tour}" fill="${couleur}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${tour}"/></clipPath></defs><g clip-path="url(#${id})">` + [-7, -2.5, 2, 6.5].map((x) => trait(`M${x},${y - 3} l1.4,10`, raie, 1.2)).join("") + `<path d="M-12,${y + 3.6} Q0,${y + 7.6} 12,${y + 3.6} L12,${y + 8} L-12,${y + 8} Z" fill="rgba(0,0,0,.18)"/></g>`;
    }
    __name(echarpe, "echarpe");
    var hautDeForme = /* @__PURE__ */ __name((y, ruban) => `<g transform="rotate(-8 0 ${y})">` + E(0, y, 9.6, 2.6, "#3A3440", 1) + `<path d="M-6,${y} L-5.4,${y - 11} Q0,${y - 12.4} 5.4,${y - 11} L6,${y} Q0,${y + 1.8} -6,${y} Z" fill="#3A3440" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/><path d="M-5.9,${y - 2.6} Q0,${y - 1} 5.9,${y - 2.6} L5.8,${y - 4.6} Q0,${y - 3} -5.8,${y - 4.6} Z" fill="${ruban}"/>` + trait(`M-3.6,${y - 9.6} L-3.8,${y - 5.4}`, "#5E5868", 1) + "</g>", "hautDeForme");
    var bonnetTricote = /* @__PURE__ */ __name((y, c, revers) => `<path d="M-9.4,${y} Q-9.6,${y - 11} 0,${y - 12.4} Q9.6,${y - 11} 9.4,${y} Z" fill="${c}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` + [-5, -1.6, 1.8, 5.2].map((x) => trait(`M${x},${y - 1} Q${x * 1.05},${y - 6} ${x * 0.8},${y - 10.4}`, "rgba(0,0,0,.16)", 0.8)).join("") + `<path d="M-10.2,${y + 0.6} Q0,${y - 2.6} 10.2,${y + 0.6} L10,${y - 3.2} Q0,${y - 6.2} -10,${y - 3.2} Z" fill="${revers}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` + [-7, -3.5, 0, 3.5, 7].map((x) => trait(`M${x},${y - 0.6 - Math.abs(x) * 0.02} l0,-3`, "rgba(0,0,0,.14)", 0.7)).join("") + E(1, y - 13.4, 3.2, 3, revers, 1) + E(0.1, y - 14.4, 1.2, 1, "#FFFFFF", 0), "bonnetTricote");
    var visageBonhomme = /* @__PURE__ */ __name((y) => E(-3.7, y - 1.2, 1.35, 1.75, "#2A2420", 0) + E(3.3, y - 1.2, 1.35, 1.75, "#2A2420", 0) + E(-4.1, y - 1.9, 0.5, 0.55, "#FFFFFF", 0) + E(2.9, y - 1.9, 0.5, 0.55, "#FFFFFF", 0) + E(-6.4, y + 2.4, 1.9, 1.1, "#F7B6C8", 0) + E(6.4, y + 4, 1.7, 1, "#F7B6C8", 0) + `<path d="M-0.6,${y + 0.4} Q3.6,${y + 0.6} 8.2,${y + 2.2} Q3.4,${y + 2.8} -0.6,${y + 2.6} Z" fill="#F08A3A" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>` + trait(`M2.2,${y + 0.9} l0.3,1.3 M4.6,${y + 1.3} l0.3,1.1`, "#C8622A", 0.5) + [-3.2, -1.6, 0.2, 2, 3.6].map((x, i) => E(x, y + 4.6 + [0.2, 0.9, 1.2, 0.9, 0.2][i], 0.55, 0.55, "#2A2420", 0)).join(""), "visageBonhomme");
    var rougeGorge = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})"><path d="M3.4,-1.6 L6.6,-0.6 L4,0.8 Z" fill="#7A5236" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + E(0.6, -2.6, 3.6, 2.9, "#9C6B44", 0.8) + E(-0.6, -1.8, 2.2, 2, "#F08A3A", 0) + E(-2.2, -4.6, 2.2, 2.1, "#9C6B44", 0.8) + E(-2.8, -4.2, 1.2, 1.1, "#F08A3A", 0) + E(-2.6, -5.4, 0.5, 0.55, "#2A2420", 0) + `<path d="M-4.2,-4.8 L-5.8,-4.4 L-4.2,-4 Z" fill="#E8B24A" stroke="${OUT}" stroke-width="0.4"/>` + trait("M-0.6,0 l-0.4,1.2 M1,0.2 l0.2,1.2", OUT, 0.5) + "</g>", "rougeGorge");
    var tasDeNeige = /* @__PURE__ */ __name((s) => `<path d="M${r2(-16 * s)},1.6 Q${r2(-14 * s)},-2.6 ${r2(-8 * s)},-1.4 Q${r2(-3 * s)},-3.2 ${r2(2 * s)},-1.6 Q${r2(8 * s)},-3.4 ${r2(13 * s)},-1 Q${r2(17 * s)},0 ${r2(16 * s)},2.4 Q0,5.6 ${r2(-16 * s)},1.6 Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.9"/>` + trait(`M${r2(2 * s)},2.6 Q${r2(8 * s)},3.4 ${r2(13 * s)},1.8`, "#D6E4EE", 1.2), "tasDeNeige");
    function bonhommeDeNeige({ petit = false, bleu = false, oiseau = false } = {}) {
      const s = petit ? 0.78 : 1;
      const id = `bdn${petit ? "p" : "g"}${bleu ? "b" : "r"}${oiseau ? "o" : ""}`;
      const corps = bouleDeNeige(`${id}a`, 0, -14, 14.5) + [-19, -13, -7].map((y) => E(-1.6, y, 1.2, 1.15, "#2A2420", 0) + E(-1.9, y - 0.4, 0.4, 0.35, "#7A7480", 0)).join("");
      const brasG = brasBrindille(-12.6, -21, -24, -29.5, -1), brasD = brasBrindille(12.4, -21, 23.6, -30, 1);
      const tete = bouleDeNeige(`${id}b`, 0, -37, 10.4) + visageBonhomme(-37);
      const coiffe = bleu ? bonnetTricote(-44.6, "#5C8FD6", "#F2EDE4") : hautDeForme(-45.4, "#D9443A");
      const ech = echarpe(`${id}c`, -28.6, bleu ? "#5C8FD6" : "#D9443A", "#F2EDE4");
      const body = brasG + brasD + corps + tete + ech + coiffe + (oiseau ? rougeGorge(21.4, -29.6) : "");
      return E(3, 1.5, 19 * s, 6.5 * s, "rgba(60,80,110,0.22)", 0) + groupe(0, 0, s, tasDeNeige(1) + body);
    }
    __name(bonhommeDeNeige, "bonhommeDeNeige");
    var BONSHOMMES = [];
    for (const petit of [false, true]) for (const bleu of [false, true]) for (const oiseau of [false, true]) {
      const fichier = ["bonhomme_de_neige", petit && "petit", bleu && "bleu", oiseau && "rouge_gorge"].filter(Boolean).join("_");
      const libelle = `Bonhomme de neige (${[petit ? "petit" : "grand", bleu ? "écharpe bleue et bonnet tricoté" : "écharpe rouge et haut-de-forme", oiseau && "un rouge-gorge sur le bras"].filter(Boolean).join(", ")})`;
      BONSHOMMES.push([fichier, libelle, { petit, bleu, oiseau }]);
    }
    module.exports = { nid, NIDS, lanterne, LANTERNES, banc, BANCS_LISTE, bonhommeDeNeige, BONSHOMMES };
  }
});

// atelier/plantes.js
var require_plantes = __commonJS({
  "atelier/plantes.js"(exports, module) {
    var { OUT, E, r2 } = require_troupe2();
    var { VERTS, TEINTES, fleurette, feuillage, champignon, herbe, congere, feuilleMorte, ROUSSES } = require_arbres();
    var baie = /* @__PURE__ */ __name((x, y) => E(x, y, 1.7, 1.7, "#D9443C", 0.8) + E(x - 0.5, y - 0.6, 0.5, 0.5, "#FFFFFF", 0), "baie");
    var grappe = /* @__PURE__ */ __name((x, y) => baie(x - 1.4, y + 0.6) + baie(x + 1.5, y + 0.8) + baie(x, y - 1), "grappe");
    var B_FOND = [[-9, -20, 8.5], [4, -23, 9], [13, -15, 7.5]];
    var B_GAUCHE = [[-13, -10, 8], [-5, -8, 7, 0]];
    var B_DROITE = [[11, -9, 7.5], [3, -7, 7, 0]];
    var B_MILIEU = [[-2, -15, 8]];
    var FLEURS_B = [[-10, -22, "#F7B6C8"], [5, -26, "#FFFFFF"], [12, -17, "#F7B6C8"], [-14, -11, "#FFFFFF"], [-2, -18, "#F7B6C8"], [9, -9, "#FFFFFF"]];
    var GRAPPES = [[-9, -21], [7, -24], [12, -12], [-12, -9], [-1, -15]];
    function buisson({ vert = "doux", petit = false, baies = false } = {}) {
      const c = VERTS[vert], k = petit ? 0.75 : 1;
      const id = `bui${petit ? "p" : "g"}${vert[0]}${baies ? "b" : ""}`;
      return E(1.5 * k, 1, 21 * k, 8 * k, "rgba(40,55,20,0.22)", 0) + feuillage(`${id}a`, B_FOND, c.fond, [[-3, -20, 0.8], [10, -18, 0.7]], k) + feuillage(`${id}b`, B_DROITE, c.devant, [[9, -6, 0.7]], k) + feuillage(`${id}c`, B_GAUCHE, c.devant, [[-12, -7, 0.7]], k) + feuillage(`${id}d`, B_MILIEU, c.devant, [[-2, -12, 0.7]], k) + (baies ? GRAPPES.map(([x, y]) => grappe(x * k, y * k)).join("") : FLEURS_B.map(([x, y, col]) => fleurette(x * k, y * k, col)).join(""));
    }
    __name(buisson, "buisson");
    var BUISSONS = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const baies of [false, true]) {
      const fichier = ["buisson", petit && "petit", vert === "profond" && "profond", baies && "baies"].filter(Boolean).join("_");
      const libelle = `Buisson (${[petit ? "petit" : "grand", `vert ${vert}`, baies ? "à baies" : "fleuri"].join(", ")})`;
      BUISSONS.push([fichier, libelle, { vert, petit, baies }]);
    }
    var FEUILLES_B = [[-15, 3.4, 40, 0], [-9, 6, -30, 1], [10, 5.6, 70, 2], [16, 2.8, -15, 0]];
    function buissonSaison({ saison = "automne", petit = false } = {}) {
      const k = petit ? 0.75 : 1, neige = saison === "hiver", c = TEINTES[neige ? "hiver" : "orange"];
      const id = `buis${saison[0]}${petit ? "p" : "g"}`;
      return E(1.5 * k, 1, 21 * k, 8 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + feuillage(`${id}a`, B_FOND, c.fond, [[-3, -20, 0.8], [10, -18, 0.7]], k, neige) + feuillage(`${id}b`, B_DROITE, c.devant, [[9, -6, 0.7]], k, neige) + feuillage(`${id}c`, B_GAUCHE, c.devant, [[-12, -7, 0.7]], k, neige) + feuillage(`${id}d`, B_MILIEU, c.devant, [[-2, -12, 0.7]], k, neige) + (neige ? congere(k * 0.8) : GRAPPES.map(([x, y]) => grappe(x * k, y * k)).join("") + FEUILLES_B.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join(""));
    }
    __name(buissonSaison, "buissonSaison");
    var BUISSONS_SAISONS = [];
    for (const saison of ["automne", "hiver"]) for (const petit of [false, true]) {
      BUISSONS_SAISONS.push([["buisson", saison, petit && "petit"].filter(Boolean).join("_"), `Buisson ${saison === "hiver" ? "d'hiver" : "d'automne"} (${petit ? "petit" : "grand"}, ${saison === "hiver" ? "sous la neige, congère au pied" : "roux, chargé de baies, feuilles mortes au pied"})`, { saison, petit }]);
    }
    var FEUILLAGE_BRUYERE = { light: "#B5D58A", mid: "#79A65A", dark: "#4F7A44" };
    var CLOCHETTES = {
      mauve: { light: "#ECCDF5", mid: "#B57AD6", dark: "#7E4AA6" },
      rose: { light: "#F9CFE0", mid: "#E07AAE", dark: "#A94A7E" }
    };
    function epi(x, y, n, c, k) {
      let o = "";
      for (let i = 0; i < n; i++) {
        const cx = x + Math.sin(i * 1.3) * 0.5 * k, cy = y - i * 2.3 * k, rx = (1.7 - i * 0.22) * k, ry = 1.35 * k;
        o += E(cx, cy, rx, ry, i < 1 ? c.dark : c.mid, 0.6) + E(cx - rx * 0.35, cy - ry * 0.3, rx * 0.35, ry * 0.3, c.light, 0);
      }
      return o;
    }
    __name(epi, "epi");
    var papillon = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})"><path d="M0,0 Q-3.6,-4 -4.4,-1.2 Q-4,1 0,0.4 Z M0,0 Q3.6,-4 4.4,-1.2 Q4,1 0,0.4 Z" fill="#FFD45E" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/><path d="M0,0.4 Q-3,1.2 -2.6,3 Q-1,2.6 0,0.6 Z M0,0.4 Q3,1.2 2.6,3 Q1,2.6 0,0.6 Z" fill="#F2A93B" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + E(-2.6, -1.4, 0.55, 0.55, OUT, 0) + E(2.6, -1.4, 0.55, 0.55, OUT, 0) + `<path d="M0,-0.6 L0,1.8 M0,-0.6 q-0.6,-1.4 -1.4,-1.8 M0,-0.6 q0.6,-1.4 1.4,-1.8" stroke="${OUT}" stroke-width="0.6" fill="none" stroke-linecap="round"/></g>`, "papillon");
    var R_BASE = [[-11, -3, 4.5], [0, -3, 5, 0], [11, -3, 4.5]];
    var R_COUSSIN = [[-8, -9, 6.5], [1, -12, 7.5], [9, -8, 6], [-3, -6, 5.5, 0], [5, -6, 5.5, 0]];
    var POINTS = [[-10, -10], [-6, -13], [-1, -16], [4, -15], [9, -11], [-4, -8], [2, -9], [7, -6], [-9, -6]];
    var EPIS = [[-6, -15, 3], [0, -19, 3], [6, -16, 3]];
    function bruyere({ teinte = "mauve", petit = false, papillon: avecPapillon = false } = {}) {
      const c = CLOCHETTES[teinte], k = petit ? 0.75 : 1;
      const id = `bru${petit ? "p" : "g"}${teinte[0]}${avecPapillon ? "b" : ""}`;
      return E(1, 1, 16 * k, 6 * k, "rgba(40,55,20,0.22)", 0) + feuillage(`${id}a`, R_BASE, FEUILLAGE_BRUYERE, [], k) + EPIS.map(([x, y, n]) => epi(x * k, y * k, n, c, k)).join("") + feuillage(`${id}b`, R_COUSSIN, c, [], k) + POINTS.map(([x, y]) => E(x * k, y * k, 0.9 * k, 0.75 * k, c.light, 0) + E((x + 0.3) * k, (y + 0.5) * k, 0.5 * k, 0.3 * k, c.dark, 0)).join("") + (avecPapillon ? papillon(2 * k, -21 * k) : "");
    }
    __name(bruyere, "bruyere");
    var BRUYERES = [];
    for (const petit of [false, true]) for (const teinte of ["mauve", "rose"]) for (const pap of [false, true]) {
      const fichier = ["bruyere", petit && "petite", teinte === "rose" && "rose", pap && "papillon"].filter(Boolean).join("_");
      const libelle = `Bruyère (${[petit ? "petite" : "grande", teinte, pap && "un papillon posé"].filter(Boolean).join(", ")})`;
      BRUYERES.push([fichier, libelle, { teinte, petit, papillon: pap }]);
    }
    var tige = /* @__PURE__ */ __name((x0, y0, x1, y1) => {
      const d = `M${r2(x0)},${r2(y0)} Q${r2((x0 + x1) / 2 + (x1 > x0 ? -1 : 1))},${r2((y0 + y1) / 2)} ${r2(x1)},${r2(y1)}`;
      return `<path d="${d}" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6FA84A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    }, "tige");
    var feuilleTige = /* @__PURE__ */ __name((x, y, a) => `<path d="M0,0 Q2.4,-2 5,-0.6 Q2.4,1.6 0,0 Z" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`, "feuilleTige");
    function fleur(x, y, col, s) {
      const p = [0, 72, 144, 216, 288].map((a) => [x + Math.cos((a - 90) * Math.PI / 180) * 1.8 * s, y + Math.sin((a - 90) * Math.PI / 180) * 1.8 * s]);
      return p.map(([a, b]) => E(a, b, 1.75 * s + 0.6, 1.75 * s + 0.6, OUT, 0)).join("") + p.map(([a, b]) => E(a, b, 1.75 * s, 1.75 * s, col, 0)).join("") + p.map(([a, b]) => E(a - 0.4 * s, b - 0.5 * s, 0.6 * s, 0.6 * s, "#FFFFFF", 0).replace("/>", ' opacity="0.55"/>')).join("") + E(x, y, 1.1 * s, 1.1 * s, "#F2B33D", 0.6);
    }
    __name(fleur, "fleur");
    function marguerite(x, y, s) {
      const p = [0, 45, 90, 135, 180, 225, 270, 315];
      const petale = /* @__PURE__ */ __name((a, col, w) => `<ellipse cx="0" cy="${r2(-2.4 * s)}" rx="${r2(0.95 * s + w)}" ry="${r2(1.9 * s + w)}" fill="${col}" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`, "petale");
      return p.map((a) => petale(a, OUT, 0.6)).join("") + p.map((a) => petale(a, "#FFFFFF", 0)).join("") + E(x, y, 1.6 * s, 1.6 * s, "#F2B33D", 0.6) + E(x - 0.5 * s, y - 0.5 * s, 0.5 * s, 0.5 * s, "#FFE08A", 0);
    }
    __name(marguerite, "marguerite");
    var abeille = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">` + E(-1.2, -2, 1.6, 1.2, "#FFFFFF", 0.6).replace("/>", ' opacity="0.9"/>') + E(1.2, -2.2, 1.6, 1.2, "#FFFFFF", 0.6).replace("/>", ' opacity="0.9"/>') + E(0, 0, 2.6, 1.8, "#FFD45E", 0.7) + `<path d="M-0.6,-1.7 L-0.6,1.7 M1,-1.6 L1,1.6" stroke="${OUT}" stroke-width="0.8"/>` + E(-2.2, -0.3, 0.9, 0.9, OUT, 0) + "</g>", "abeille");
    var COULEURS = ["#F7B6C8", "#FFD45E", "#FFFFFF", "#C9A8F0", "#F49A7A", "#FFD45E", "#F7B6C8", "#FFFFFF"];
    var TOUFFES_FLEURS = [
      [-13, -1, [[-1, -4, -12], [1, 3, -14], [0, -1, -7]]],
      [12, 1, [[-1, -3, -13], [1, 3, -10]]],
      [0, 7, [[-1, -4, -11], [1, 2, -14], [0, 5, -7]]]
    ];
    function fleurs({ marguerites = false, petites = false, abeille: avecAbeille = false } = {}) {
      const k = petites ? 0.75 : 1;
      let o = E(1, 2, 22 * k, 8 * k, "rgba(40,55,20,0.2)", 0), n = 0;
      TOUFFES_FLEURS.forEach(([cx, cy, fl], j) => {
        const X = cx * k, Y = cy * k;
        o += fl.map(([x0, x, y]) => tige(X + x0 * k, Y + 0.5, X + x * k, Y + (y + 1.5) * k)).join("");
        o += feuilleTige(X - 1.6 * k, Y - 3 * k, j % 2 ? -30 : -150) + feuilleTige(X + 1.2 * k, Y - 4.5 * k, j % 2 ? -150 : -25);
        o += fl.map(([, x, y]) => marguerites ? marguerite(X + x * k, Y + y * k, k) : fleur(X + x * k, Y + y * k, COULEURS[n++ % COULEURS.length], k)).join("");
      });
      return o + (avecAbeille ? abeille(4 * k, -22 * k) : "");
    }
    __name(fleurs, "fleurs");
    var FLEURS = [];
    for (const petites of [false, true]) for (const marguerites of [false, true]) for (const ab of [false, true]) {
      const fichier = ["fleurs", petites && "petites", marguerites && "marguerites", ab && "abeille"].filter(Boolean).join("_");
      const libelle = `Fleurs (${[marguerites ? "marguerites" : "bouquet mélangé", petites ? "petit" : "grand", ab && "une abeille"].filter(Boolean).join(", ")})`;
      FLEURS.push([fichier, libelle, { marguerites, petites, abeille: ab }]);
    }
    var CACTUS = { light: "#B9DE8E", mid: "#7EBE5E", dark: "#4E8E4A", cote: "#3F7A40", epine: "#FFF6DC" };
    var corps = /* @__PURE__ */ __name((id, d, ombre, cotes, epines) => `<path d="${d}" fill="${CACTUS.mid}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${ombre}" fill="${CACTUS.dark}"/><path d="${cotes}" stroke="${CACTUS.cote}" stroke-width="0.7" fill="none" stroke-linecap="round"/></g>` + epines.map(([x, y]) => `<path d="M${r2(x - 0.9)},${r2(y - 0.7)} L${r2(x)},${r2(y)} L${r2(x + 0.9)},${r2(y - 0.7)}" stroke="${CACTUS.epine}" stroke-width="0.55" fill="none" stroke-linecap="round"/>`).join(""), "corps");
    var sc2 = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r2(n * k)), "sc2");
    function cierge(id, k) {
      const brasG = sc2("M-5,-13.6 L-11,-13.6 Q-15.8,-13.6 -15.8,-18.4 L-15.8,-27.6 Q-15.8,-30.4 -13,-30.4 Q-10.2,-30.4 -10.2,-27.6 L-10.2,-19.4 L-5,-19.4 Z", k);
      const brasD = sc2("M5,-10 L10.6,-10 Q15.2,-10 15.2,-14.6 L15.2,-23.2 Q15.2,-26 12.5,-26 Q9.8,-26 9.8,-23.2 L9.8,-15.6 L5,-15.6 Z", k);
      const tronc = sc2("M-5.6,0.6 L-5.6,-35 Q-5.6,-41.5 0,-41.5 Q5.6,-41.5 5.6,-35 L5.6,0.6 Q0,2 -5.6,0.6 Z", k);
      return corps(`${id}g`, brasG, sc2("M-13,-13 L-9,-13 L-9,-31 L-13,-31 Z M-15,-16.4 L-4,-16.4 L-4,-12 L-15,-12 Z", k), sc2("M-13,-17 L-13,-28.4", k), [[-14.6 * k, -23 * k], [-11.4 * k, -26 * k], [-8 * k, -16 * k]]) + corps(`${id}d`, brasD, sc2("M12.5,-9 L16,-9 L16,-27 L12.5,-27 Z M4,-12.6 L16,-12.6 L16,-9 L4,-9 Z", k), sc2("M12.5,-13.4 L12.5,-24", k), [[14 * k, -19 * k], [11 * k, -22.4 * k], [8 * k, -12.6 * k]]) + corps(
        `${id}t`,
        tronc,
        sc2("M1.6,2 L1.6,-42 L7,-42 L7,2 Z", k),
        sc2("M-2.2,-1 L-2.2,-37 M2.2,-1 L2.2,-37", k),
        [[-4.4, -8], [-0.2, -14], [4, -6], [-4.4, -22], [4, -20], [-0.2, -29], [-4.2, -34], [3.8, -33]].map(([x, y]) => [x * k, y * k])
      ) + `<path d="${sc2("M-3.8,-6 L-3.8,-32", k)}" stroke="${CACTUS.light}" stroke-width="${r2(1.1 * k)}" stroke-linecap="round" opacity="0.8"/>`;
    }
    __name(cierge, "cierge");
    function boule(id, k) {
      const d = sc2("M-11,0.4 Q-13.5,-8 -9.5,-14.5 Q-5,-20 0,-20 Q5,-20 9.5,-14.5 Q13.5,-8 11,0.4 Q0,3 -11,0.4 Z", k);
      return corps(
        `${id}b`,
        d,
        sc2("M3,3 Q6,-10 3,-21 L16,-21 L16,3 Z", k),
        sc2("M0,1.6 L0,-20 M-5,1.2 Q-8,-9 -4,-19 M5,1.2 Q8,-9 4,-19 M-9.5,0.8 Q-13,-7 -8.4,-15 M9.5,0.8 Q13,-7 8.4,-15", k),
        [[-2.5, -6], [2.5, -12], [-7, -10], [7, -5], [-2.5, -16], [6.5, -14], [-9, -3]].map(([x, y]) => [x * k, y * k])
      ) + `<path d="${sc2("M-7,-4 Q-9,-10 -5,-16", k)}" stroke="${CACTUS.light}" stroke-width="${r2(1.1 * k)}" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    }
    __name(boule, "boule");
    var caillou = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, "#B9A27A", 0.5) + E(x - rx * 0.25, y - ry * 0.3, rx * 0.55, ry * 0.45, "#D9C8A2", 0), "caillou");
    var cailloux = /* @__PURE__ */ __name((k) => caillou(-10 * k, 3, 2.2 * k, 1.3 * k) + caillou(11 * k, 4, 1.8 * k, 1.1 * k) + caillou(8 * k, 1.6, 1.2 * k, 0.8 * k), "cailloux");
    function cactus({ forme = "cierge", petit = false, fleur: avecFleur = true } = {}) {
      const k = petit ? 0.75 : 1, id = `cac${forme[0]}${petit ? "p" : "g"}${avecFleur ? "f" : ""}`;
      const haut = forme === "cierge" ? -42 : -20.5;
      return E(1.5 * k, 1.5, 15 * k, 5.5 * k, "rgba(60,50,20,0.22)", 0) + cailloux(k) + (forme === "cierge" ? cierge(id, k) : boule(id, k)) + (avecFleur ? fleur(0, haut * k - 1.4, "#F27A9A", 0.95) : "");
    }
    __name(cactus, "cactus");
    var CACTUS_LISTE = [];
    for (const forme of ["cierge", "boule"]) for (const petit of [false, true]) for (const fl of [true, false]) {
      const fichier = ["cactus", forme === "boule" && "boule", petit && "petit", !fl && "sans_fleur"].filter(Boolean).join("_");
      const libelle = `Cactus (${[forme === "boule" ? "en boule" : "cierge à bras", petit ? "petit" : "grand", fl ? "fleuri" : "sans fleur"].join(", ")})`;
      CACTUS_LISTE.push([fichier, libelle, { forme, petit, fleur: fl }]);
    }
    var ECORCES = {
      brune: { left: "#9C6A43", right: "#74492C", bark: "#55331E", coupe: "#E8C08A", cerne: "#C9965E" },
      grise: { left: "#A69B8F", right: "#7C7268", bark: "#5E554C", coupe: "#D9CDB8", cerne: "#B3A58C" }
    };
    function souche({ ecorce = "brune", petite = false, champignons: champignons2 = false } = {}) {
      const c = ECORCES[ecorce], k = petite ? 0.75 : 1;
      const id = `sou${petite ? "p" : "g"}${ecorce[0]}${champignons2 ? "c" : ""}`;
      const d = sc2("M-12.5,1.6 Q-9.2,0.6 -8.8,-3 L-9,-12 L9,-12 L8.8,-3 Q9.4,0.6 13,2 Q8.4,3.6 5.2,2.1 Q2,4.2 -1,2.8 Q-4.2,4.2 -6.6,2.3 Q-9.8,3.2 -12.5,1.6 Z", k);
      const flancs = `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${sc2("M2.4,4 L3,-13 L14,-13 L14,4 Z", k)}" fill="${c.right}"/><path d="${sc2("M-5.6,-2 L-6,-9.4 M-1.4,0 L-1.6,-8 M5.6,-1 L6,-8.6", k)}" stroke="${c.bark}" stroke-width="0.7" fill="none" stroke-linecap="round"/></g>`;
      const coupe = E(0, -12 * k, 9 * k, 3.8 * k, c.coupe, 1.1) + E(0, -12 * k, 6 * k, 2.4 * k, "none", 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`) + E(0, -12 * k, 3 * k, 1.2 * k, "none", 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`) + `<path d="${sc2("M1,-12 L5.6,-13.6", k)}" stroke="${c.cerne}" stroke-width="0.7" stroke-linecap="round"/>`;
      const pousse = `<path d="${sc2("M-5,-12.6 Q-5.6,-17 -4,-20", k)}" stroke="${OUT}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="${sc2("M-5,-12.6 Q-5.6,-17 -4,-20", k)}" stroke="#6FA84A" stroke-width="0.9" fill="none" stroke-linecap="round"/><path d="${sc2("M-4,-19.6 Q-1,-22.6 1.6,-20.4 Q-1,-18.4 -4,-19.6 Z M-4.6,-17 Q-8,-19.4 -9.6,-16.6 Q-7,-15.2 -4.6,-17 Z", k)}" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
      return E(1, 1.5, 15 * k, 5.5 * k, "rgba(40,55,20,0.22)", 0) + flancs + coupe + (champignons2 ? champignon(-11 * k, 4.4) + champignon(11.5 * k, 4.8) + champignon(7.5 * k, 5.6) : pousse);
    }
    __name(souche, "souche");
    var SOUCHES = [];
    for (const petite of [false, true]) for (const ecorce of ["brune", "grise"]) for (const ch of [false, true]) {
      const fichier = ["souche", petite && "petite", ecorce === "grise" && "grise", ch && "champignons"].filter(Boolean).join("_");
      const libelle = `Souche (${[petite ? "petite" : "grande", `écorce ${ecorce}`, ch ? "des champignons" : "une pousse"].join(", ")})`;
      SOUCHES.push([fichier, libelle, { ecorce, petite, champignons: ch }]);
    }
    function rondin({ ecorce = "brune", petit = false, champignons: champignons2 = false } = {}) {
      const c = ECORCES[ecorce], k = petit ? 0.75 : 1;
      const id = `ron${petit ? "p" : "g"}${ecorce[0]}${champignons2 ? "c" : ""}`;
      const A = [-21 * k, -4.5 * k], B = [18 * k, 15 * k], r = 6.8 * k, ra = 5.2 * k;
      const surAxe = /* @__PURE__ */ __name((t, o) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + o * r], "surAxe");
      const d = `M${r2(A[0])},${r2(A[1] - r)} L${r2(B[0])},${r2(B[1] - r)} L${r2(B[0])},${r2(B[1] + r)} L${r2(A[0])},${r2(A[1] + r)} A${r2(ra)} ${r2(r)} 0 0 1 ${r2(A[0])},${r2(A[1] - r)} Z`;
      const dedans = `<path d="M${r2(A[0] - ra)},${r2(A[1] + r * 0.25)} L${r2(B[0])},${r2(B[1] + r * 0.25)} L${r2(B[0])},${r2(B[1] + r + 2)} L${r2(A[0] - ra)},${r2(A[1] + r + 2)} Z" fill="${c.right}"/><path d="M${r2(A[0] + 2 * k)},${r2(A[1] - r * 0.62)} L${r2(B[0] - 3 * k)},${r2(B[1] - r * 0.62)}" stroke="${c.coupe}" stroke-width="${r2(1.1 * k)}" stroke-linecap="round" opacity="0.6"/>` + [[0.2, -0.15, 5], [0.45, 0.2, 6], [0.7, -0.3, 4.5], [0.3, 0.55, 5]].map(([t, o, l]) => {
        const x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t + o * r;
        return `<path d="M${r2(x)},${r2(y)} l${r2(l * 0.89 * k)},${r2(l * 0.45 * k)}" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/>`;
      }).join("");
      const coupe = E(B[0], B[1], ra, r, c.coupe, 1.1) + E(B[0], B[1], ra * 0.62, r * 0.62, "none", 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`) + E(B[0], B[1], ra * 0.28, r * 0.28, "none", 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`);
      const mousse = E(A[0] + 7 * k, A[1] + 3.5 * k - r, 5 * k, 1.8 * k, "#9CCB6A", 0.8) + E(A[0] + 5.6 * k, A[1] + 3 * k - r - 0.6 * k, 2.4 * k, 0.7 * k, "#C8E59A", 0) + `<path d="M${r2(A[0] + 15 * k)},${r2(A[1] + 7.5 * k - r)} q0,-4 2.4,-5" stroke="${OUT}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${r2(A[0] + 15 * k)},${r2(A[1] + 7.5 * k - r)} q0,-4 2.4,-5" stroke="${c.left}" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M${r2(A[0] + 17.2 * k)},${r2(A[1] + 2.6 * k - r)} q2.6,-2.4 5,-0.8 q-2.4,1.8 -5,0.8 Z" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
      return E(0, 8 * k, 26 * k, 9 * k, "rgba(40,55,20,0.22)", 0) + `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>` + coupe + mousse + (champignons2 ? [0.38, 0.5, 0.62].map((t, i) => {
        const [x, y] = surAxe(t, i === 1 ? 0.95 : 0.75);
        return champignon(x, y);
      }).join("") : "");
    }
    __name(rondin, "rondin");
    var RONDINS = [];
    for (const petit of [false, true]) for (const ecorce of ["brune", "grise"]) for (const ch of [false, true]) {
      const fichier = ["rondin", petit && "petit", ecorce === "grise" && "gris", ch && "champignons"].filter(Boolean).join("_");
      const libelle = `Rondin (${[petit ? "petit" : "grand", `écorce ${ecorce}`, ch ? "des champignons" : "mousse et pousse"].join(", ")})`;
      RONDINS.push([fichier, libelle, { ecorce, petit, champignons: ch }]);
    }
    var CHAPEAUX = {
      rouges: { mid: "#E2574C", dark: "#B03A33", light: "#F59A86", pois: true },
      bruns: { mid: "#B7804C", dark: "#8A5A31", light: "#D9A876", pois: false },
      nuit: { mid: "#7FE0C0", dark: "#4FB59A", light: "#C8FFE8" }
    };
    function champi(id, x, y, s, c, pois, nuit) {
      const pied = `M${r2(x - 1.6 * s)},${r2(y)} Q${r2(x - 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x - 1.2 * s)},${r2(y - 4.4 * s)} L${r2(x + 1.2 * s)},${r2(y - 4.4 * s)} Q${r2(x + 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.6 * s)},${r2(y)} Q${r2(x)},${r2(y + 0.8 * s)} ${r2(x - 1.6 * s)},${r2(y)} Z`;
      const ch = `M${r2(x - 4.6 * s)},${r2(y - 4 * s)} Q${r2(x - 4.4 * s)},${r2(y - 9.4 * s)} ${r2(x)},${r2(y - 9.8 * s)} Q${r2(x + 4.4 * s)},${r2(y - 9.4 * s)} ${r2(x + 4.6 * s)},${r2(y - 4 * s)} Q${r2(x)},${r2(y - 2.6 * s)} ${r2(x - 4.6 * s)},${r2(y - 4 * s)} Z`;
      return (nuit ? E(x, y - 6.4 * s, 7.4 * s, 6 * s, "rgb(150,255,210)", 0).replace("/>", ' opacity="0.2"/>') + E(x, y - 6.6 * s, 5.4 * s, 4.4 * s, "rgb(170,255,220)", 0).replace("/>", ' opacity="0.3"/>') : "") + `<path d="${pied}" fill="#F6EEDC" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${r2(x + 0.2 * s)},${r2(y - 0.2)} Q${r2(x + 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x + 0.6 * s)},${r2(y - 4.2 * s)} L${r2(x + 1.2 * s)},${r2(y - 4.4 * s)} Q${r2(x + 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.6 * s)},${r2(y)} Z" fill="#DCCFB4"/><path d="${ch}" fill="${c.mid}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${ch}"/></clipPath></defs><g clip-path="url(#${id})">` + E(x + 2.2 * s, y - 4.4 * s, 4.6 * s, 3 * s, c.dark, 0) + E(x - 1.6 * s, y - 8.2 * s, 2 * s, 1.1 * s, c.light, 0) + `</g><path d="M${r2(x - 3.6 * s)},${r2(y - 3.9 * s)} Q${r2(x)},${r2(y - 2.9 * s)} ${r2(x + 3.6 * s)},${r2(y - 3.9 * s)}" stroke="${OUT}" stroke-width="0.5" fill="none" opacity="0.5"/>` + (pois ? [[-1.8, -7.4, 0.8], [1.4, -8.2, 0.6], [2.6, -6, 0.65], [-0.2, -5.6, 0.5]].map(([dx, dy, r]) => E(x + dx * s, y + dy * s, r * s * 1.2, r * s, "#FFFFFF", 0)).join("") : "");
    }
    __name(champi, "champi");
    var FAMILLE = [[-5, 2, 1.25], [6, 4, 0.95], [11.5, 0, 0.7]];
    function champignons({ sorte = "rouges", petits = false, nuit = false } = {}) {
      const k = petits ? 0.75 : 1, c = nuit ? CHAPEAUX.nuit : CHAPEAUX[sorte];
      const id = `chp${petits ? "p" : "g"}${sorte[0]}${nuit ? "n" : ""}`;
      return E(2 * k, 2, 14 * k, 5 * k, "rgba(40,55,20,0.22)", 0) + herbe(-13 * k, 3.4, "#86B852", 0.7) + FAMILLE.map(([x, y, t], i) => champi(`${id}${i}`, x * k, y * k, t * k, c, CHAPEAUX[sorte].pois, nuit)).join("");
    }
    __name(champignons, "champignons");
    var CHAMPIGNONS = [];
    for (const petits of [false, true]) for (const sorte of ["rouges", "bruns"]) for (const nuit of [false, true]) {
      const fichier = ["champignons", petits && "petits", sorte === "bruns" && "bruns", nuit && "nuit"].filter(Boolean).join("_");
      const libelle = `Champignons (${[sorte === "bruns" ? "cèpes bruns" : "amanites rouges", petits ? "petits" : "grands", nuit && "la nuit, ils luisent"].filter(Boolean).join(", ")})`;
      CHAMPIGNONS.push([fichier, libelle, { sorte, petits, nuit }]);
    }
    var mare = /* @__PURE__ */ __name((k, rx = 24, ry = 10.5) => E(0, 1, rx * k, ry * k, "#8FC8E0", 1.1) + E(-3 * k, 0, rx * 0.68 * k, ry * 0.6 * k, "#B6E0F0", 0) + `<path d="M${r2(-14 * k)},${r2(3 * k)} q${r2(6 * k)},${r2(-2 * k)} ${r2(12 * k)},0 M${r2(4 * k)},${r2(6 * k)} q${r2(4 * k)},${r2(-1.4 * k)} ${r2(8 * k)},0" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>`, "mare");
    function feuilleRoseau(x, h, pli, k) {
      const d = `M${r2((x - 1.4) * k)},${r2(3 * k)} Q${r2((x - 1.2) * k)},${r2((3 - h * 0.55) * k)} ${r2((x + pli) * k)},${r2((3 - h) * k)} Q${r2((x + 1) * k)},${r2((3 - h * 0.5) * k)} ${r2((x + 1.4) * k)},${r2(3 * k)} Z`;
      return `<path d="${d}" fill="#7FB650" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${r2((x - 0.3) * k)},${r2(2 * k)} Q${r2((x - 0.2) * k)},${r2((3 - h * 0.5) * k)} ${r2((x + pli * 0.8) * k)},${r2((3 - h * 0.9) * k)}" stroke="#B5DB86" stroke-width="0.7" fill="none" stroke-linecap="round"/>`;
    }
    __name(feuilleRoseau, "feuilleRoseau");
    function massette(x, h, k) {
      const tx = x + (x > 0 ? 1.2 : -1.2), top = 3 - h;
      return `<path d="M${r2(x * k)},${r2(3 * k)} Q${r2(x * k)},${r2((3 - h * 0.6) * k)} ${r2(tx * k)},${r2(top * k)}" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${r2(x * k)},${r2(3 * k)} Q${r2(x * k)},${r2((3 - h * 0.6) * k)} ${r2(tx * k)},${r2(top * k)}" stroke="#7EA850" stroke-width="1.1" fill="none" stroke-linecap="round"/><rect x="${r2((tx - 1.7) * k)}" y="${r2((top + 1) * k)}" width="${r2(3.4 * k)}" height="${r2(7.4 * k)}" rx="${r2(1.7 * k)}" fill="#8A5A36" stroke="${OUT}" stroke-width="0.9"/><rect x="${r2((tx - 1) * k)}" y="${r2((top + 2) * k)}" width="${r2(0.9 * k)}" height="${r2(4.4 * k)}" rx="${r2(0.45 * k)}" fill="#B88458"/><path d="M${r2(tx * k)},${r2((top + 1) * k)} L${r2(tx * k)},${r2((top - 1.6) * k)}" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
    }
    __name(massette, "massette");
    var libellule = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(-12)">` + ["-2.4,-1.6,3.2,1", "2.4,-1.6,3.2,1", "-2.2,0.4,2.8,0.9", "2.2,0.4,2.8,0.9"].map((v) => {
      const [cx, cy, rx, ry] = v.split(",").map(Number);
      return E(cx * 1.2, cy, rx, ry, "#EAF6FF", 0.5).replace("/>", ' opacity="0.9"/>');
    }).join("") + `<path d="M0,-1 L0,5.4" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="M0,-1 L0,5.4" stroke="#4FA3C8" stroke-width="1" stroke-linecap="round"/>` + E(0, -1.6, 1.2, 1.1, "#4FA3C8", 0.7) + "</g>", "libellule");
    var FEUILLES_R = [[-12, 18, -3], [-7, 24, -2], [-2, 20, 2], [3, 26, 2.4], [8, 19, 3], [12, 15, 3.4]];
    var MASSETTES = [[-9, 26], [0.5, 30], [6, 24]];
    function roseaux({ petits = false, eau = true, libellule: avecLibellule = false } = {}) {
      const k = petits ? 0.75 : 1;
      return (eau ? mare(k) : E(1, 2, 16 * k, 5.5 * k, "rgba(40,55,20,0.22)", 0)) + MASSETTES.map(([x, h]) => massette(x, h, k)).join("") + FEUILLES_R.map(([x, h, p]) => feuilleRoseau(x, h, p, k)).join("") + (avecLibellule ? libellule(9 * k, -25 * k) : "");
    }
    __name(roseaux, "roseaux");
    var ROSEAUX = [];
    for (const petits of [false, true]) for (const eau of [true, false]) for (const lib of [false, true]) {
      const fichier = ["roseaux", petits && "petits", !eau && "rive", lib && "libellule"].filter(Boolean).join("_");
      const libelle = `Roseaux (${[petits ? "petits" : "grands", eau ? "dans une mare" : "sur la rive", lib && "une libellule"].filter(Boolean).join(", ")})`;
      ROSEAUX.push([fichier, libelle, { petits, eau, libellule: lib }]);
    }
    function feuilleNenuphar(id, x, y, rx, a) {
      const ry = rx * 0.52, t = a * Math.PI / 180;
      const d = `M${r2(x)},${r2(y)} L${r2(x + rx * Math.cos(t - 0.22))},${r2(y + ry * Math.sin(t - 0.22))} A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(x + rx * Math.cos(t + 0.22))},${r2(y + ry * Math.sin(t + 0.22))} Z`;
      return `<path d="${d}" fill="#79B85A" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${E(x - rx * 0.25, y - ry * 0.3, rx * 0.7, ry * 0.6, "#A2D27A", 0)}${E(x + rx * 0.4, y + ry * 0.5, rx * 0.7, ry * 0.5, "#5C9A47", 0)}</g>` + [0.9, 1.6, 2.4, 3.2, 4, 4.8].map((b) => `<path d="M${r2(x)},${r2(y)} L${r2(x + rx * 0.75 * Math.cos(t + b))},${r2(y + ry * 0.75 * Math.sin(t + b))}" stroke="#5C9A47" stroke-width="0.5" stroke-linecap="round"/>`).join("");
    }
    __name(feuilleNenuphar, "feuilleNenuphar");
    function fleurNenuphar(x, y, c, s) {
      const petale = /* @__PURE__ */ __name((a, rx, ry, col) => `<path d="M0,0 Q${r2(rx * s)},${r2(-ry * 0.55 * s)} 0,${r2(-ry * s)} Q${r2(-rx * s)},${r2(-ry * 0.55 * s)} 0,0 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`, "petale");
      return [-62, -32, 0, 32, 62].map((a) => petale(a, 2.3, 6.4, c.fond)).join("") + E(x, y - 2.6 * s, 1.8 * s, 1.1 * s, "#F2C94C", 0.5) + [-40, -13, 13, 40].map((a) => petale(a, 2, 5, c.devant)).join("");
    }
    __name(fleurNenuphar, "fleurNenuphar");
    var grenouille = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">` + E(0, -2.4, 4.4, 3.2, "#8CC45A", 0.9) + E(-1.2, -2.6, 2.2, 1.4, "#B7DE86", 0) + E(-3.4, -0.2, 1.6, 0.8, "#7BB34C", 0.7) + E(3.4, -0.2, 1.6, 0.8, "#7BB34C", 0.7) + E(-2.1, -5.4, 1.6, 1.5, "#8CC45A", 0.9) + E(2.1, -5.4, 1.6, 1.5, "#8CC45A", 0.9) + E(-2.1, -5.5, 0.95, 0.95, "#FFFFFF", 0) + E(2.1, -5.5, 0.95, 0.95, "#FFFFFF", 0) + E(-1.9, -5.4, 0.55, 0.6, OUT, 0) + E(2.3, -5.4, 0.55, 0.6, OUT, 0) + `<path d="M-1.4,-2.6 Q0,-1.6 1.4,-2.6" stroke="${OUT}" stroke-width="0.6" fill="none" stroke-linecap="round"/>` + E(-2.6, -2.4, 0.7, 0.4, "#F7A8B8", 0) + E(2.6, -2.4, 0.7, 0.4, "#F7A8B8", 0) + "</g>", "grenouille");
    var FLEURS_EAU = { roses: { fond: "#F49AB8", devant: "#FBCADB" }, blancs: { fond: "#E8EEF0", devant: "#FFFFFF" } };
    var FEUILLES_N = [[-14, 1, 7, 20], [6, -4, 6.4, 150], [13, 5, 6, 60], [-3, 7, 5.4, 260]];
    function nenuphars({ teinte = "roses", petits = false, grenouille: avecGrenouille = false } = {}) {
      const k = petits ? 0.75 : 1, c = FLEURS_EAU[teinte];
      const id = `nen${petits ? "p" : "g"}${teinte[0]}${avecGrenouille ? "r" : ""}`;
      return mare(k, 28, 12) + FEUILLES_N.map(([x, y, r, a], i) => feuilleNenuphar(`${id}${i}`, x * k, y * k, r * k, a)).join("") + fleurNenuphar(6 * k, -4.6 * k, c, k) + fleurNenuphar(-3 * k, 6.4 * k, c, 0.75 * k) + (avecGrenouille ? grenouille(-14 * k, 1.4 * k) : "");
    }
    __name(nenuphars, "nenuphars");
    var NENUPHARS = [];
    for (const petits of [false, true]) for (const teinte of ["roses", "blancs"]) for (const gr of [false, true]) {
      const fichier = ["nenuphars", petits && "petits", teinte === "blancs" && "blancs", gr && "grenouille"].filter(Boolean).join("_");
      const libelle = `Nénuphars (${[petits ? "petits" : "grands", `fleurs ${teinte}`, gr && "une grenouille"].filter(Boolean).join(", ")})`;
      NENUPHARS.push([fichier, libelle, { teinte, petits, grenouille: gr }]);
    }
    module.exports = {
      buissonSaison,
      BUISSONS_SAISONS,
      buisson,
      BUISSONS,
      bruyere,
      BRUYERES,
      fleurs,
      FLEURS,
      cactus,
      CACTUS_LISTE,
      souche,
      SOUCHES,
      rondin,
      RONDINS,
      champignons,
      CHAMPIGNONS,
      roseaux,
      ROSEAUX,
      nenuphars,
      NENUPHARS
    };
  }
});

// atelier/plantes_liste.js
var require_plantes_liste = __commonJS({
  "atelier/plantes_liste.js"(exports, module) {
    var { arbre, ARBRES, arbreSaison, ARBRES_SAISONS, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX, sapin, SAPINS, palmier, PALMIERS, arbreMort, ARBRES_MORTS } = require_arbres();
    var { ARBRES_DE_SAISON } = require_arbres_saisons();
    var { touffe, TOUFFES, touffeSaison, TOUFFES_SAISONS } = require_herbes();
    var { rocher, ROCHERS, rocherSaison, ROCHERS_SAISONS, rochers, ROCHERS_TAS, aiguille, AIGUILLES, rochersMoussus, ROCHERS_MOUSSUS } = require_rochers();
    var { coquillages, COQUILLAGES, boisFlotte, BOIS_FLOTTES } = require_plage();
    var { nid, NIDS, lanterne, LANTERNES, banc, BANCS_LISTE, bonhommeDeNeige, BONSHOMMES } = require_objets();
    var { buisson, BUISSONS, buissonSaison, BUISSONS_SAISONS, bruyere, BRUYERES, fleurs, FLEURS, cactus, CACTUS_LISTE, souche, SOUCHES, rondin, RONDINS, champignons, CHAMPIGNONS, roseaux, ROSEAUX, nenuphars, NENUPHARS } = require_plantes();
    var PLANTES2 = [
      // les arbres refaits (arbres.js) : l'arbre et ses 8 variantes, le pommier et ses 16, l'arbre d'automne et ses 8, le bouleau
      // et ses 8, le sapin et le sapin enneigé et leurs 8 chacun, le palmier et ses 8, l'arbre mort et ses 8
      ...ARBRES.map(([fichier, libelle, o]) => [fichier, libelle, "tree", () => arbre(o)]),
      // l'arbre au printemps (vert tendre, en fleurs) et en hiver (sous la neige) ; l'automne a son arbre, juste après
      ...ARBRES_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, "tree", () => arbreSaison(o)]),
      // les arbres de saison (arbres_saisons.js) : trois essences par saison, en trois tailles et deux teintes ; l'index
      // plantes/saisons.json range chaque arbre dans sa saison
      ...ARBRES_DE_SAISON.map(([fichier, libelle, , dessin]) => [fichier, libelle, "tree", dessin]),
      ...POMMIERS.map(([fichier, libelle, o]) => [fichier, libelle, "apple", () => pommier(o)]),
      ...AUTOMNES.map(([fichier, libelle, o]) => [fichier, libelle, "autumn", () => automne(o)]),
      ...BOULEAUX.map(([fichier, libelle, o]) => [fichier, libelle, "birch", () => bouleau(o)]),
      ...SAPINS.map(([fichier, libelle, o]) => [fichier, libelle, o.neige ? "snowpine" : "pine", () => sapin(o)]),
      ...PALMIERS.map(([fichier, libelle, o]) => [fichier, libelle, "palm", () => palmier(o)]),
      ...ARBRES_MORTS.map(([fichier, libelle, o]) => [fichier, libelle, "deadtree", () => arbreMort(o)]),
      // les autres plantes refaites (plantes.js) : le buisson et ses 8 variantes, la bruyère et ses 8, les fleurs et leurs 8,
      // le cactus et ses 8, la souche et ses 8, le rondin et ses 8, les champignons et leurs 8, les roseaux et leurs 8, les
      // nénuphars et leurs 8
      ...BUISSONS.map(([fichier, libelle, o]) => [fichier, libelle, "bush", () => buisson(o)]),
      // le buisson en automne (roux, à baies) et en hiver (sous la neige)
      ...BUISSONS_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, "bush", () => buissonSaison(o)]),
      ...BRUYERES.map(([fichier, libelle, o]) => [fichier, libelle, "heather", () => bruyere(o)]),
      ...FLEURS.map(([fichier, libelle, o]) => [fichier, libelle, "flowers", () => fleurs(o)]),
      ...CACTUS_LISTE.map(([fichier, libelle, o]) => [fichier, libelle, "cactus", () => cactus(o)]),
      ...SOUCHES.map(([fichier, libelle, o]) => [fichier, libelle, "stump", () => souche(o)]),
      ...RONDINS.map(([fichier, libelle, o]) => [fichier, libelle, "log", () => rondin(o)]),
      ...CHAMPIGNONS.map(([fichier, libelle, o]) => [fichier, libelle, "mushrooms", () => champignons(o)]),
      ...ROSEAUX.map(([fichier, libelle, o]) => [fichier, libelle, "reeds", () => roseaux(o)]),
      ...NENUPHARS.map(([fichier, libelle, o]) => [fichier, libelle, "lily", () => nenuphars(o)]),
      // la touffe d'herbe refaite (herbes.js) et ses 16 variantes
      ...TOUFFES.map(([fichier, libelle, o]) => [fichier, libelle, "tuft", () => touffe(o)]),
      // la touffe en automne (blonde) et en hiver (neige sur les pointes)
      ...TOUFFES_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, "tuft", () => touffeSaison(o)]),
      // le rocher, les rochers en tas, l'aiguille et les rochers moussus refaits (rochers.js) et leurs 8 variantes chacun
      ...ROCHERS.map(([fichier, libelle, o]) => [fichier, libelle, "rock", () => rocher(o)]),
      // le rocher au printemps (fleurettes au pied), en automne (feuilles mortes) et en hiver (sous la neige)
      ...ROCHERS_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, "rock", () => rocherSaison(o)]),
      ...ROCHERS_TAS.map(([fichier, libelle, o]) => [fichier, libelle, "rocks", () => rochers(o)]),
      ...AIGUILLES.map(([fichier, libelle, o]) => [fichier, libelle, "crag", () => aiguille(o)]),
      ...ROCHERS_MOUSSUS.map(([fichier, libelle, o]) => [fichier, libelle, "mossy", () => rochersMoussus(o)]),
      // les coquillages et le bois flotté refaits (plage.js) et leurs 8 variantes chacun
      ...COQUILLAGES.map(([fichier, libelle, o]) => [fichier, libelle, "shells", () => coquillages(o)]),
      ...BOIS_FLOTTES.map(([fichier, libelle, o]) => [fichier, libelle, "driftwood", () => boisFlotte(o)]),
      // le nid, la lanterne et le banc refaits (objets.js) et leurs 8 variantes chacun ; le bonhomme de neige
      ...NIDS.map(([fichier, libelle, o]) => [fichier, libelle, "nest", () => nid(o)]),
      ...LANTERNES.map(([fichier, libelle, o]) => [fichier, libelle, "lantern", () => lanterne(o)]),
      ...BANCS_LISTE.map(([fichier, libelle, o]) => [fichier, libelle, "bench", () => banc(o)]),
      // le bonhomme de neige (l'hiver) et ses 8 variantes
      ...BONSHOMMES.map(([fichier, libelle, o]) => [fichier, libelle, "snowman", () => bonhommeDeNeige(o)])
    ];
    module.exports = { PLANTES: PLANTES2 };
  }
});

// atelier/generateur_plantes.mjs
var import_deco = __toESM(require_deco(), 1);
var import_plantes_liste = __toESM(require_plantes_liste(), 1);
var CADRE = import_deco.default.PROP;
var PLANTES = Object.fromEntries(import_plantes_liste.default.PLANTES.map(([nom, libelle, decor]) => [nom, { libelle, decor }]));
function plante(nom) {
  const p = import_plantes_liste.default.PLANTES.find((x) => x[0] === nom);
  if (!p) throw new Error(`plante inconnue : ${nom} (${import_plantes_liste.default.PLANTES.length} plantes : voir PLANTES)`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${CADRE[2]}" height="${CADRE[3]}" viewBox="${CADRE.join(" ")}">${p[3]()}</svg>`, cadre: CADRE, ms_par_image: null };
}
__name(plante, "plante");
function liste() {
  return import_plantes_liste.default.PLANTES.map(([nom]) => ({ fichier: `plantes/${nom}.svg`, fonction: "plante", args: [nom] }));
}
__name(liste, "liste");
export {
  PLANTES,
  liste,
  plante
};
