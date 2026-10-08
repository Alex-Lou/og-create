// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_hud.mjs : ne pas modifier à la main.
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
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
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
      const [shL, shR] = c.shoulders;
      const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4;
      const handL = [r2(c.hands[0][0] + swing * bal), r2(c.hands[0][1] + swing * balY)];
      const handR = [r2(c.hands[1][0] - swing * bal), r2(c.hands[1][1] - swing * balY)];
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
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
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
    var { OUT, P, E, L, clip, r2 } = require_troupe2();
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
      ["point_nouveau", "Point « nouveau »", [14, 14], null, pointNouveau, "une chose à faire sur un onglet (tabbar__dot)"]
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

// atelier/generateur_hud.mjs
var import_hud = __toESM(require_hud(), 1);
var PIECES = Object.fromEntries(import_hud.default.PIECES.map(([id, nom, taille, tranche, , sert]) => [id, { nom, sert, taille, tranche }]));
var HD = import_hud.default.HD;
function piece(id, hd = import_hud.default.HD) {
  const p = import_hud.default.PIECES.find((x) => x[0] === id);
  if (!p) throw new Error(`pièce inconnue : ${id} (${Object.keys(PIECES).join(", ")})`);
  const [w, h] = p[2], cadre = [0, 0, w, h];
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w * hd}" height="${h * hd}" viewBox="${cadre.join(" ")}">${p[4]()}</svg>`, cadre, ms_par_image: null };
}
__name(piece, "piece");
function liste() {
  return import_hud.default.PIECES.map(([id]) => ({ fichier: `hud/${id}.svg`, fonction: "piece", args: [id] }));
}
__name(liste, "liste");
export {
  HD,
  PIECES,
  liste,
  piece
};
