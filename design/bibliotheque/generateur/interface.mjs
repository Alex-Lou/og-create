// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_interface.mjs : ne pas modifier à la main.
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
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/interface.js
var require_interface = __commonJS({
  "atelier/interface.js"(exports, module) {
    var { OUT, P, E, L, clip, r2 } = require_troupe2();
    var WO = 1.3;
    var WI = 0.8;
    var rond = /* @__PURE__ */ __name((x, y, r, fill, w = WO) => E(x, y, r, r, fill, w), "rond");
    var reflet = /* @__PURE__ */ __name((x, y, rx, ry, a = 0.85) => E(x, y, rx, ry, `rgba(255,255,255,${a})`, 0), "reflet");
    var rr = /* @__PURE__ */ __name((x, y, w, h, r) => `M${r2(x + r)},${y} L${r2(x + w - r)},${y} Q${r2(x + w)},${y} ${r2(x + w)},${r2(y + r)} L${r2(x + w)},${r2(y + h - r)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - r)},${r2(y + h)} L${r2(x + r)},${r2(y + h)} Q${x},${r2(y + h)} ${x},${r2(y + h - r)} L${x},${r2(y + r)} Q${x},${y} ${r2(x + r)},${y} Z`, "rr");
    var etincelle = /* @__PURE__ */ __name((x, y, s = 1) => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="${r2(0.35 * s)}"/>`, "etincelle");
    var etoile = /* @__PURE__ */ __name((x, y, R, r, fill, w) => P(Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R;
      return `${i ? "L" : "M"}${r2(x + k * Math.cos(a))},${r2(y + k * Math.sin(a))}`;
    }).join(" ") + " Z", fill, w), "etoile");
    var OR = { clair: "#FFE28A", corps: "#F2C04B", ombre: "#D49A2A", fonce: "#A8741C" };
    var BOIS = { clair: "#D9AE76", corps: "#B98A55", ombre: "#94693E" };
    var PAGE = { corps: "#FBF3DE", ombre: "#E6D6B4" };
    function grimoire() {
      const cuir = "#A2432F", cuirS = "#7E3022", cuirH = "#C06A50";
      let s = P(rr(7, 6.2, 21, 22.6, 2.2), PAGE.corps, WO);
      s += [10, 13, 16, 19, 22, 25].map((y) => L([25.9, y], [27.2, y], PAGE.ombre, 0.6)).join("");
      const C = rr(4.4, 4, 21.4, 22.6, 2.2);
      s += P(C, cuir, 0) + clip("grc", C, `<rect x="4" y="3" width="4.4" height="25" fill="${cuirS}"/><path d="M15,27 L26,16.4 L26,27 Z" fill="${cuirS}" opacity=".45"/>`) + P(`M9.6,6.4 Q9.6,5.6 10.6,5.6 L20,5.6`, "none", 0).replace('stroke="none"', `stroke="${cuirH}" stroke-width="1.2" stroke-linecap="round"`) + P(C, "none", WO);
      s += L([8.4, 4.6], [8.4, 26], OUT, WI) + [8.4, 15.3, 22.2].map((y) => L([5.2, y], [7.8, y], OR.corps, 1.1)).join("");
      s += P("M25.8,8.6 L25.8,4 L21.2,4 Z", OR.corps, WI) + P("M25.8,22 L25.8,26.6 L21.2,26.6 Z", OR.corps, WI);
      s += rond(16.4, 15.3, 5.2, OR.corps) + rond(16.4, 15.3, 3.9, OR.ombre, 0) + rond(15.6, 15.3, 2.9, "#FFF4CC", 0) + rond(17, 14.4, 2.5, OR.ombre, 0) + etincelle(18.6, 16.8, 0.75);
      s += reflet(14.2, 12.4, 1, 0.6, 0.7);
      s += P(rr(22.6, 13.4, 6.4, 3.8, 1.2), OR.corps, WI) + rond(27.2, 15.3, 1, OR.fonce, 0);
      return s;
    }
    __name(grimoire, "grimoire");
    var boules = /* @__PURE__ */ __name((list, fill, line = OUT, w = WO) => list.map(([x, y, r]) => E(x, y, r + w / 2, r + w / 2, line, 0)).join("") + list.map(([x, y, r]) => E(x, y, r - w / 2, r - w / 2, fill, 0)).join(""), "boules");
    function ile() {
      let s = E(16, 25.4, 14.2, 4.6, "#7CC4EC", WO) + P("M5,25 Q8,23.6 11,25 M21,25.6 Q24,24.2 27,25.6", "none", 0).replace('stroke="none"', 'stroke="#D8F1FF" stroke-width="1" stroke-linecap="round"');
      const S = "M4.6,24.6 Q6.4,16.4 15.6,15.8 Q25.2,15.6 27.6,24.4 Q16,28.4 4.6,24.6 Z";
      const herbe = "M3,22.4 Q7,19 10.6,20.4 Q13.6,21.6 16.6,20.2 Q20,18.8 23,20.2 Q25.8,21.4 29,22.8";
      s += P(S, "#F4DCA4", 0) + clip("ils", S, `<path d="M17,28 Q25,23 27.6,16 L30,28 Z" fill="#E2C083"/><path d="${herbe} L29,14 L3,14 Z" fill="#7DB852"/><path d="M16.6,20.2 Q20,18.8 23,20.2 Q25.8,21.4 29,22.8 L29,17 Q22,16.4 18,19 Z" fill="#5E9A3C"/><path d="${herbe}" fill="none" stroke="${OUT}" stroke-width="${WI}" stroke-linecap="round"/>`) + P(S, "none", WO);
      s += L([12.4, 18], [12.4, 12.6], OUT, 4) + L([12.4, 17.6], [12.4, 12.8], BOIS.corps, 1.8);
      const feuilles = [[9, 11, 3.6], [12.8, 7.6, 4.4], [16.6, 10.8, 3.6]];
      s += boules(feuilles, "#7DB852");
      s += `<clipPath id="ilf">${feuilles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r2(r - WO / 2)}"/>`).join("")}</clipPath><g clip-path="url(#ilf)"><path d="M4,11.6 Q12.8,16.4 21,11 L21,16 L4,16 Z" fill="#5E9A3C"/></g>`;
      s += reflet(11.4, 5.8, 1.6, 1, 0.55) + reflet(7.8, 9.8, 0.8, 0.6, 0.45);
      s += P("M19.4,21.2 Q19.8,18.2 22.4,18 Q24.8,18.2 25,21.2 Q22.2,22.2 19.4,21.2 Z", "#B4AEA4", WI) + reflet(21.4, 19.2, 0.8, 0.5, 0.6);
      s += `<g opacity=".95">${boules([[23.4, 7.6, 2.6], [26.8, 8.4, 2.2], [21.4, 9.4, 1.6], [25, 9.8, 2]], "#EEF2F8", "#8C96B0", 1)}</g>`;
      return s;
    }
    __name(ile, "ile");
    function defis() {
      const verre = "#E6F3FA", verreS = "#C4DCEA";
      const B = "M10.4,7.2 L21.6,7.2 Q21.4,12.2 17,15.2 Q16.6,15.6 16.6,16 Q16.6,16.4 17,16.8 Q21.4,19.8 21.6,24.8 L10.4,24.8 Q10.6,19.8 15,16.8 Q15.4,16.4 15.4,16 Q15.4,15.6 15,15.2 Q10.6,12.2 10.4,7.2 Z";
      let s = P(B, verre, 0) + clip("dfv", B, `<path d="M18,8 L22,8 L22,25 L18,25 Q20,17 18,8 Z" fill="${verreS}"/><path d="M12.6,11.6 Q16,12.6 19.4,11.6 Q18.4,14 16,15.4 Q13.6,14 12.6,11.6 Z" fill="${OR.corps}"/><path d="M10,25 Q11,20.4 16,19.8 Q21,20.4 22,25 Z" fill="${OR.corps}"/><path d="M16,19.8 Q20,20.6 21.6,25 L18.4,25 Q18.6,21.6 16,19.8 Z" fill="${OR.ombre}"/><rect x="15.6" y="15.4" width="0.8" height="4.6" fill="${OR.corps}"/>`) + P(B, "none", WO);
      s += reflet(12.6, 9.6, 0.7, 1.4, 0.9) + reflet(12.4, 22.2, 0.6, 1, 0.8);
      s += [7.8, 24.2].map((x) => P(rr(x - 1, 6.6, 2, 18.8, 1), BOIS.corps, WI)).join("");
      s += P(rr(5.6, 3.6, 20.8, 4, 1.6), BOIS.corps, WO) + P(rr(5.6, 24.4, 20.8, 4, 1.6), BOIS.corps, WO);
      s += L([7.4, 4.8], [24.6, 4.8], BOIS.clair, 0.9) + L([7.4, 25.6], [24.6, 25.6], BOIS.clair, 0.9);
      return s;
    }
    __name(defis, "defis");
    function sceau() {
      const cire = "#C9483A", cireS = "#9C3428", cireH = "#E27A68";
      let s = P("M11.4,21 L8.4,29.4 L11.6,28 L13.4,30.6 L16,22.6 Z", "#3E78C8", WI) + P("M20.6,21 L23.6,29.4 L20.4,28 L18.6,30.6 L16,22.6 Z", "#3E78C8", WI);
      const n = 11, R = 11.2, r = 10, cx = 16, cy = 14.4;
      const bord = Array.from({ length: n * 2 }, (_, i) => {
        const a = -Math.PI / 2 + i * Math.PI / n, k = i % 2 ? r : R;
        return [cx + k * Math.cos(a), cy + k * Math.sin(a)];
      });
      const D = bord.map(([x, y], i) => i ? `Q${r2(x)},${r2(y)} ${r2((x + bord[(i + 1) % bord.length][0]) / 2)},${r2((y + bord[(i + 1) % bord.length][1]) / 2)}` : `M${r2((x + bord[1][0]) / 2)},${r2((y + bord[1][1]) / 2)}`).join(" ") + " Z";
      s += P(D, cire, 0) + clip("scc", D, `<circle cx="20" cy="18.6" r="11" fill="${cireS}" opacity=".55"/>`) + P(D, "none", WO);
      s += rond(16, 14.4, 6.6, cireS, WI) + rond(16, 14.4, 5.6, cire, 0) + etoile(16, 14.6, 4.2, 1.8, "#F6B6A6", WI);
      s += P("M8.6,10.2 Q10,6.6 14,5.8", "none", 0).replace('stroke="none"', `stroke="${cireH}" stroke-width="1.4" stroke-linecap="round"`);
      return s;
    }
    __name(sceau, "sceau");
    function sac() {
      const toile = "#D8BE8C", toileS = "#B79A66", corde = "#8E5E34";
      const branche = "M17.6,10.6 L20.8,5.6 L23.4,2.8 M20.8,5.6 L24.8,5.2";
      let s = P(branche, "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"`) + P(branche, "none", 0).replace('stroke="none"', 'stroke="#D6C3A2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"');
      s += P("M8.4,10.8 Q7.6,5.4 11.8,4.6 Q16,5.4 15.2,10.8 Z", "#F4A9A0", WI) + [9.8, 11.8, 13.8].map((x) => L([x, 10.4], [11.8, 5.6], "#D27E76", 0.6)).join("");
      const B = "M9.6,12 Q4.6,16.6 5.6,23 Q7,29 16,29 Q25,29 26.4,23 Q27.4,16.6 22.4,12 Z";
      s += P(B, toile, 0) + clip("sab", B, `<path d="M18,29 Q26,26 25.4,14 L28,14 L28,30 Z" fill="${toileS}"/><path d="M8,24.6 Q16,27 24,24.6" fill="none" stroke="${toileS}" stroke-width="0.8" stroke-dasharray="1.2 1"/>`) + P(B, "none", WO);
      s += P("M8.6,9.6 Q16,8 23.4,9.6 L22.6,12.8 Q16,11.6 9.4,12.8 Z", toile, WI) + L([11.2, 10], [11.6, 12.2], toileS, 0.6) + L([16, 9.4], [16, 11.8], toileS, 0.6) + L([20.6, 10], [20.2, 12.2], toileS, 0.6);
      s += P("M9,12.6 Q16,11 23,12.6", "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"`) + P("M9,12.6 Q16,11 23,12.6", "none", 0).replace('stroke="none"', `stroke="${corde}" stroke-width="1.2" stroke-linecap="round"`);
      s += P("M16,12 Q14,15.6 12.6,16.8 M16,12 Q17.8,15.8 19.4,16.6", "none", 0).replace('stroke="none"', `stroke="${corde}" stroke-width="1" stroke-linecap="round"`) + rond(16, 12, 1.1, corde, WI);
      s += reflet(9.4, 17.4, 1, 2, 0.45);
      return s;
    }
    __name(sac, "sac");
    function taches() {
      const vert = "#4E8A3A";
      let s = P("M8,6.6 L24,6.6 L24,26 L8,26 Z", PAGE.corps, 0) + clip("tap", "M8,6.6 L24,6.6 L24,26 L8,26 Z", `<rect x="20" y="6" width="5" height="21" fill="${PAGE.ombre}"/>`) + P("M8,6.6 L8,26 M24,6.6 L24,26", "none", WO);
      s += P(rr(5.4, 3.6, 21.2, 4.2, 2.1), PAGE.ombre, WO) + rond(6.6, 5.7, 1.2, "#C9AE7E", WI) + rond(25.4, 5.7, 1.2, "#C9AE7E", WI);
      s += P(rr(5.4, 24.4, 21.2, 4.2, 2.1), PAGE.ombre, WO) + rond(6.6, 26.5, 1.2, "#C9AE7E", WI) + rond(25.4, 26.5, 1.2, "#C9AE7E", WI);
      [10.6, 15.4, 20.2].forEach((y, i) => {
        s += P(rr(9.8, y - 1.6, 3.2, 3.2, 0.7), "#FFFFFF", WI) + L([14.6, y], [21.6, y], "#B9A68A", 1.3);
        if (i < 2) s += P(`M10.4,${r2(y - 0.2)} L11.6,${r2(y + 1.2)} L14,${r2(y - 2.2)}`, "none", 0).replace('stroke="none"', `stroke="${vert}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`);
      });
      return s;
    }
    __name(taches, "taches");
    function menu() {
      const n = 8, R = 12.6, r = 9.8, cx = 16, cy = 16;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, d = Math.PI / n;
        pts.push([a - d * 0.95, r], [a - d * 0.5, R], [a + d * 0.5, R], [a + d * 0.95, r]);
      }
      const D = pts.map(([a, k], i) => `${i ? "L" : "M"}${r2(cx + k * Math.cos(a))},${r2(cy + k * Math.sin(a))}`).join(" ") + " Z";
      let s = P(D, OR.corps, 0) + clip("mnr", D, `<circle cx="21" cy="21" r="12" fill="${OR.ombre}"/>`) + P(D, "none", WO);
      s += rond(16, 16, 6.2, OR.clair, WI) + rond(16, 16, 3.2, "#6E4A22", WO);
      s += P("M8.2,12 Q9.6,8.6 13,7.4", "none", 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.3" stroke-linecap="round"');
      return s;
    }
    __name(menu, "menu");
    function ecu() {
      let s = E(16, 16.8, 12.4, 12.4, OR.ombre, WO) + E(15.4, 16, 11.6, 11.6, OR.corps, WI);
      s += E(15.4, 16, 8.4, 8.4, OR.ombre, WI) + E(15.2, 15.8, 7.6, 7.6, OR.corps, 0);
      s += etoile(15.3, 16.2, 5.4, 2.4, OR.clair, WI);
      s += P("M6.6,12.6 Q8.2,7.6 13.4,6.2", "none", 0).replace('stroke="none"', 'stroke="#FFF4C4" stroke-width="1.6" stroke-linecap="round"');
      return s + etincelle(25.4, 7, 1.8);
    }
    __name(ecu, "ecu");
    function pierre() {
      const D = "M4.6,21.6 L8,11.6 L16,6.4 L24.4,9 L28,17.6 L25.6,25 L16.6,27.8 L7.6,26.2 Z";
      let s = P(D, "#B6B1A8", 0) + clip("pie", D, `<path d="M16,6.4 L24.4,9 L28,17.6 L19,16.4 Z" fill="#D4CFC6"/><path d="M28,17.6 L25.6,25 L16.6,27.8 L19,16.4 Z" fill="#928D86"/><path d="M4.6,21.6 L7.6,26.2 L16.6,27.8 L19,16.4 L11,18.6 Z" fill="#A49F97"/>`) + P(D, "none", WO);
      s += P("M8,11.6 L11,18.6 L19,16.4 L16,6.4 M11,18.6 L4.6,21.6 M19,16.4 L28,17.6 M19,16.4 L16.6,27.8", "none", WI);
      return s + reflet(13.4, 11, 1.6, 1, 0.7);
    }
    __name(pierre, "pierre");
    function bois() {
      const ecorce = "#9A6A3E", ecorceS = "#7A5030", coeur2 = "#EBCB92", cerne2 = "#C99A5C";
      let s = P("M12,6.4 L26,6.4 Q29.4,6.4 29.4,10.6 Q29.4,14.8 26,14.8 L12,14.8 Z", ecorce, WO) + L([15, 9.6], [24, 9.6], ecorceS, WI) + L([17, 12.2], [25, 12.2], ecorceS, WI);
      s += E(12, 10.6, 3, 4.2, coeur2, WO) + E(12, 10.6, 1.6, 2.4, "none", WI).replace(`stroke="${OUT}"`, `stroke="${cerne2}"`);
      s += P("M9,14.6 L24.6,14.6 Q28.6,14.6 28.6,20.2 Q28.6,25.8 24.6,25.8 L9,25.8 Z", ecorce, WO) + L([13, 18], [24, 18], ecorceS, WI) + L([14.6, 22.4], [25.6, 22.4], ecorceS, WI);
      s += reflet(18, 16.4, 4, 0.6, 0.35);
      s += E(9, 20.2, 4.4, 5.6, coeur2, WO) + E(9, 20.2, 2.8, 3.6, "none", WI).replace(`stroke="${OUT}"`, `stroke="${cerne2}"`) + E(9, 20.2, 1.2, 1.6, cerne2, 0);
      s += P("M20,14.6 Q20.4,11.6 22.6,11 Q22.4,13.4 20,14.6 Z", "#7DB852", WI);
      return s;
    }
    __name(bois, "bois");
    function eau() {
      const D = "M16,3.4 Q9,12.6 8,18.4 Q7.6,27.6 16,28.4 Q24.4,27.6 24,18.4 Q23,12.6 16,3.4 Z";
      let s = P(D, "#5CB0E6", 0) + clip("eau", D, `<path d="M19,28.6 Q25,25 23.4,16 L27,16 L27,30 Z" fill="#3F8CCB"/><path d="M8,22 Q12,26.6 16,26.6 L16,30 L6,30 Z" fill="#4E9FD9"/>`) + P(D, "none", WO);
      s += E(12.2, 18.6, 1.6, 3.2, "rgba(255,255,255,.9)", 0) + rond(13.2, 13.6, 0.9, "rgba(255,255,255,.9)", 0);
      return s;
    }
    __name(eau, "eau");
    function nourriture() {
      const D = "M16,9.8 Q12.6,7.2 9,8.6 Q4,10.8 5,18.2 Q6.4,26.6 12,28 Q14,28.4 16,27.4 Q18,28.4 20,28 Q25.6,26.6 27,18.2 Q28,10.8 23,8.6 Q19.4,7.2 16,9.8 Z";
      let s = P(D, "#E04E3E", 0) + clip("nou", D, `<path d="M20,28.6 Q27.4,25 26.4,14 L30,14 L30,30 Z" fill="#B8342A"/>`) + P(D, "none", WO);
      s += P("M16,10.4 Q15.6,6.4 17.6,3.6", "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"`) + P("M16,10.4 Q15.6,6.4 17.6,3.6", "none", 0).replace('stroke="none"', 'stroke="#8A5A30" stroke-width="1.1" stroke-linecap="round"');
      s += P("M17.2,6.2 Q20.6,2.6 25,4.2 Q22.4,8.4 17.2,6.2 Z", "#7DB852", WI) + L([18.4, 5.8], [22.6, 4.6], "#5E9A3C", 0.6);
      return s + E(10, 14.4, 1.7, 2.6, "rgba(255,255,255,.75)", 0) + rond(11.2, 19.4, 0.7, "rgba(255,255,255,.6)", 0);
    }
    __name(nourriture, "nourriture");
    function poisson() {
      const corps = "#6CB8DC", ventre = "#CFEAF5", nageoire = "#3F8EBD";
      let s = P("M8.4,16 L2.8,10 Q2.4,16 2.8,22 Z", nageoire, WO);
      const D = "M7,16 Q9.6,7.2 18.6,7 Q27,7.4 29.4,16 Q27,24.6 18.6,25 Q9.6,24.8 7,16 Z";
      s += P(D, corps, 0) + clip("poi", D, `<path d="M6,16 Q16,26 30,17 L30,27 L6,27 Z" fill="${ventre}"/><path d="M12,8 L13.6,8 Q11.6,16 13.6,24 L12,24 Z" fill="#5AA6CC"/>`) + P(D, "none", WO);
      s += P("M15,7.6 Q18.4,3.6 22,7.2", nageoire, WI) + P("M17,19.4 Q19.4,22.8 21.4,19.6", nageoire, WI);
      s += rond(23.4, 13.6, 2.2, "#2A2420", 0) + rond(22.7, 12.9, 0.8, "#FFFFFF", 0);
      s += P("M25.2,18.4 Q26.6,19.4 27.8,18.2", "none", WI) + E(25, 16.2, 1.1, 0.6, "rgba(240,128,128,.55)", 0);
      return s + reflet(15.6, 11, 2, 1, 0.6);
    }
    __name(poisson, "poisson");
    function recolte() {
      let s = P("M2.4,23.6 Q16,19.6 29.6,23.6 L29.6,29 L2.4,29 Z", "#F4DCA4", WO);
      const V = "M3,20 Q4.6,8.4 15.6,5 Q25.4,2.8 28.8,10.6 Q24.6,8 20.6,10.2 Q17.4,12.4 19.6,15.6 Q15.6,15.2 15.4,11.8 Q11,15 11.6,21.6 Q7,19.4 3,20 Z";
      s += P(V, "#5CB0E6", 0) + clip("rcv", V, `<path d="M3,22 Q8,12 16,9 L16,24 Z" fill="#3F8CCB" opacity=".6"/>`) + P(V, "none", WO);
      s += P("M19.6,15.6 Q15.6,15.2 15.4,11.8 Q17,8.6 20.6,10.2", "none", 0).replace('stroke="none"', 'stroke="#EAF7FF" stroke-width="1.4" stroke-linecap="round"');
      s += rond(26.6, 13.6, 1, "#EAF7FF", 0) + rond(24.2, 15.6, 0.7, "#EAF7FF", 0);
      s += P("M6.4,27.4 Q5.6,22 10,21.2 Q14.4,22 13.6,27.4 Z", "#F4A9A0", WI) + [8, 10, 12].map((x) => L([x, 26.8], [10, 22], "#D27E76", 0.6)).join("") + P(rr(8.4, 26.8, 3.2, 1.4, 0.6), "#E8928A", WI);
      s += `<g transform="rotate(14 22.6 25)">${etoile(22.6, 25, 4.6, 2, "#F49A4A", WI)}</g>` + rond(22.6, 25, 0.6, "#FFD3A8", 0);
      return s + etincelle(27.6, 21, 1.4);
    }
    __name(recolte, "recolte");
    function ramasser() {
      const osier = "#D2A062", osierS = "#A87A42";
      let s = P("M8.4,14 Q8.4,3.6 16,3.6 Q23.6,3.6 23.6,14", "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.4" stroke-linecap="round"`) + P("M8.4,14 Q8.4,3.6 16,3.6 Q23.6,3.6 23.6,14", "none", 0).replace('stroke="none"', `stroke="${osier}" stroke-width="1.6" stroke-linecap="round"`);
      s += P("M17,13.6 Q17.4,9.4 21.6,8.6 Q25,9 24.8,12.6 Q24.4,14.6 22.4,14.6 Z", "#A8A39A", WI);
      s += P("M7.6,14.4 Q8.4,10 12.6,9.8 Q15.6,10.4 16.6,13 L16,14.6 Z", "#6CB8DC", WI) + rond(14.2, 11.8, 0.6, "#2A2420", 0);
      s += rond(15.4, 12.2, 3.6, "#E04E3E", WI) + reflet(14.2, 11, 0.8, 1.1, 0.75) + L([15.6, 8.8], [16.2, 7.2], "#8A5A30", 1);
      const B = "M5,14 L27,14 L24.4,26.6 Q24,28.4 22,28.4 L10,28.4 Q8,28.4 7.6,26.6 Z";
      s += P(B, osier, 0) + clip("ram", B, `<path d="M19,29 L27,14 L28,14 L28,30 Z" fill="${osierS}"/>` + [18.4, 22.6].map((y) => `<path d="M4,${y} L28,${y}" stroke="${osierS}" stroke-width="0.9"/>`).join("") + [9.6, 13, 16.4, 19.8, 23.2].map((x) => `<path d="M${x},14 L${r2(x + (16 - x) * 0.12)},29" stroke="${osierS}" stroke-width="0.9"/>`).join("")) + P(B, "none", WO);
      s += P(rr(4, 12.6, 24, 3.2, 1.6), osier, WO) + L([6, 13.6], [26, 13.6], "#E8C08A", 0.8);
      return s;
    }
    __name(ramasser, "ramasser");
    function carnet() {
      const cuir = "#4F9A86", cuirS = "#3A7868", cuirH = "#7CC0AC";
      let s = P(rr(7.4, 4.6, 19, 23.8, 2), PAGE.corps, WO) + [8, 11, 14, 17, 20, 23].map((y) => L([24.8, y], [26, y], PAGE.ombre, 0.6)).join("");
      const C = rr(5, 3.4, 19.8, 23.8, 2);
      s += P(C, cuir, 0) + clip("cac", C, `<path d="M14,28 L25,17 L25,28 Z" fill="${cuirS}" opacity=".6"/>`) + P(C, "none", WO);
      s += P(rr(7, 5.4, 15.8, 19.8, 1.2), "none", 0).replace('stroke="none"', `stroke="${cuirH}" stroke-width="0.7" stroke-dasharray="1.2 0.9"`);
      s += P("M14.9,8.6 L16.4,13.8 L21.6,15.3 L16.4,16.8 L14.9,22 L13.4,16.8 L8.2,15.3 L13.4,13.8 Z", OR.corps, WI) + P("M14.9,8.6 L16.4,13.8 L14.9,15.3 Z M21.6,15.3 L16.4,16.8 L14.9,15.3 Z M14.9,22 L13.4,16.8 L14.9,15.3 Z M8.2,15.3 L13.4,13.8 L14.9,15.3 Z", OR.ombre, 0) + rond(14.9, 15.3, 1, OR.clair, WI);
      s += P(rr(20.8, 2.6, 2.4, 25.6, 1), "#C9483A", WI);
      return s + reflet(8.6, 7.4, 1.6, 0.7, 0.45);
    }
    __name(carnet, "carnet");
    function trouvailles() {
      let s = P("M4.6,26.4 Q5.6,21.6 11,21 L21.6,20.6 Q27.4,21.2 27.6,26.4 Q16,29.6 4.6,26.4 Z", "#A8A39A", WO) + reflet(9.6, 23.4, 1.6, 0.6, 0.5);
      s += P("M6.8,23.4 L7.4,15.6 L10.4,13 L12.6,16 L12.4,22.6 Z", "#F2B04A", WI) + P("M10.4,13 L12.6,16 L12.4,22.6 L10.2,23 Z", "#D48A2A", 0);
      s += P("M19.8,22.8 L20.4,16.4 L23.4,14.2 L26,17 L25.2,23 Z", "#5A4A6E", WI) + P("M23.4,14.2 L26,17 L25.2,23 L23,23.2 Z", "#3E3252", 0) + L([21, 17.4], [22.6, 15.6], "#9A88B4", 0.8);
      const G = "M11.6,23.6 L12.6,9.4 L16.4,4 L20.2,9.4 L21,23.6 Z";
      s += P(G, "#BDE6F6", 0) + clip("trg", G, `<path d="M16.4,4 L20.2,9.4 L21,24 L16.4,24 Z" fill="#8CCBE6"/>`) + P(G, "none", WO) + L([16.4, 4.6], [16.4, 23.2], "#E8F7FD", 0.7) + L([12.8, 9.6], [20, 9.6], "#E8F7FD", 0.6);
      return s + etincelle(24.8, 7.6, 1.8) + etincelle(7.6, 9.6, 1.1);
    }
    __name(trouvailles, "trouvailles");
    function expedition() {
      let s = P("M13.4,4.8 Q16,1.4 18.6,4.8", "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"`) + P("M13.4,4.8 Q16,1.4 18.6,4.8", "none", 0).replace('stroke="none"', `stroke="${OR.corps}" stroke-width="1.4" stroke-linecap="round"`);
      s += rond(16, 17, 12.2, OR.ombre) + rond(15.6, 16.6, 11.2, OR.corps, 0) + rond(16, 17, 8.8, "#FBF3DE", WI);
      s += [0, 1, 2, 3].map((i) => {
        const a = i * Math.PI / 2;
        return L([16 + 7.4 * Math.sin(a), 17 - 7.4 * Math.cos(a)], [16 + 8.4 * Math.sin(a), 17 - 8.4 * Math.cos(a)], OUT, 1);
      }).join("");
      s += `<g transform="rotate(38 16 17)">${P("M16,9.6 L18.4,17 L13.6,17 Z", "#D8443A", WI)}${P("M16,24.4 L18.4,17 L13.6,17 Z", "#4A7EC8", WI)}</g>` + rond(16, 17, 1.2, OR.fonce, WI);
      s += P("M6.6,12.4 Q8.4,7.6 13.4,6.2", "none", 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.4" stroke-linecap="round"');
      return s;
    }
    __name(expedition, "expedition");
    var trait = /* @__PURE__ */ __name((d, color, w) => P(d, "none", 0).replace('stroke="none"', `stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`), "trait");
    var cerne = /* @__PURE__ */ __name((d, color, w) => trait(d, OUT, w + 2 * WO * 0.85) + trait(d, color, w), "cerne");
    function outils() {
      let s = cerne("M8.6,24.6 L22,10.6", "#9AA4B4", 2.6) + P("M19.6,6.4 Q23.4,3 27,5.4 L24.2,8.2 L25,10.2 L27,11 L29.6,8.2 Q31.2,12 28,15 Q25.2,17 22.2,15.4 Z", "#9AA4B4", WO) + rond(9, 24.2, 2.2, "#9AA4B4");
      s += rond(9, 24.2, 0.9, "#5E6676", 0) + L([20.6, 9.6], [24.6, 13.2], "#D6DCE6", 0.8);
      s += cerne("M23.6,25.6 L11,12.4", BOIS.corps, 2.8) + L([22.8, 24], [13, 13.6], BOIS.clair, 0.9);
      s += `<g transform="rotate(-46 9.6 10.6)">${P(rr(3.6, 7.8, 12, 5.8, 1.4), "#8E96A6", WO)}${P(rr(4.6, 8.6, 4.4, 1.4, 0.6), "#C8CED8", 0)}</g>`;
      return s;
    }
    __name(outils, "outils");
    function fleur() {
      let s = cerne("M16,18 Q15.4,24 16.4,29", "#5E9A3C", 1.6) + P("M16.2,25 Q20.6,20.6 25,22.6 Q21.4,27 16.2,25 Z", "#7DB852", WI) + L([17.4, 24.8], [22.4, 22.8], "#5E9A3C", 0.6);
      const petales = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        return [16 + 5.8 * Math.cos(a), 12.4 + 5.8 * Math.sin(a), 4.4];
      });
      s += boules(petales, "#F6A6C0") + petales.map(([x, y]) => reflet(x - 1.2, y - 1.2, 1, 0.7, 0.55)).join("");
      s += rond(16, 12.4, 3.4, OR.corps, WI) + rond(15, 11.4, 1, OR.clair, 0);
      return s;
    }
    __name(fleur, "fleur");
    var visage = /* @__PURE__ */ __name((bouche, yeux, extra = "") => rond(16, 16.6, 12, "#FFD978") + clip("vis", "M4,16.6 A12,12 0 1 0 28,16.6 A12,12 0 1 0 4,16.6 Z", '<circle cx="20" cy="21" r="12" fill="#F2BF52"/>') + rond(16, 16.6, 12, "none") + E(8.8, 20.2, 2.2, 1.3, "rgba(240,120,110,.55)", 0) + E(23.2, 20.2, 2.2, 1.3, "rgba(240,120,110,.55)", 0) + yeux + bouche + extra + reflet(10.6, 9.6, 2, 1.1, 0.6), "visage");
    var oeil = /* @__PURE__ */ __name((x, y) => E(x, y, 1.6, 2.2, "#2A2420", 0) + rond(x - 0.5, y - 0.8, 0.6, "#FFFFFF", 0), "oeil");
    function humeurJoie() {
      return visage(P("M11.6,19.6 Q16,25.6 20.4,19.6 Q16,21.2 11.6,19.6 Z", "#B8483A", WI), trait("M9.4,15.6 Q11,13.4 12.6,15.6", OUT, 1.3) + trait("M19.4,15.6 Q21,13.4 22.6,15.6", OUT, 1.3));
    }
    __name(humeurJoie, "humeurJoie");
    function humeurCalme() {
      return visage(trait("M12.8,21 Q16,23 19.2,21", OUT, 1.2), oeil(11, 15.2) + oeil(21, 15.2));
    }
    __name(humeurCalme, "humeurCalme");
    function humeurBouderie() {
      return visage(
        trait("M13.2,22.4 Q16,20.6 18.8,22.4", OUT, 1.2),
        oeil(11, 16.2) + oeil(21, 16.2) + trait("M8.4,13.4 Q10.6,13.4 12.6,12", OUT, 1.1) + trait("M23.6,13.4 Q21.4,13.4 19.4,12", OUT, 1.1),
        `<g opacity=".95">${boules([[24.6, 5.4, 2.4], [27.6, 6.2, 2], [22.2, 6.8, 1.6]], "#CCD4E1", "#6E7890", 1)}</g>`
      );
    }
    __name(humeurBouderie, "humeurBouderie");
    function coeur() {
      const D = "M16,27.4 Q4.4,19.6 4,11.4 Q4,5 9.8,4.6 Q14,4.6 16,9 Q18,4.6 22.2,4.6 Q28,5 28,11.4 Q27.6,19.6 16,27.4 Z";
      let s = P(D, "#E8566A", 0) + clip("coe", D, '<path d="M16,28 Q27,20 28,12 L30,12 L30,30 Z" fill="#C83C52"/>') + P(D, "none", WO);
      return s + E(10.2, 10.4, 2, 2.8, "rgba(255,255,255,.75)", 0) + rond(13, 7.6, 0.8, "rgba(255,255,255,.75)", 0);
    }
    __name(coeur, "coeur");
    function verrou() {
      let s = cerne("M10.4,15 L10.4,10.6 Q10.4,4.4 16,4.4 Q21.6,4.4 21.6,10.6 L21.6,15", "#B4BCC8", 2.4);
      const C = rr(6, 13.6, 20, 15, 3);
      s += P(C, OR.corps, 0) + clip("ver", C, `<rect x="6" y="23" width="20" height="6" fill="${OR.ombre}"/><rect x="20.4" y="13" width="6" height="16" fill="${OR.ombre}" opacity=".6"/>`) + P(C, "none", WO);
      s += rond(16, 19.6, 2, "#5A3A1C", 0) + P("M15,20.6 L14.4,24.6 L17.6,24.6 L17,20.6 Z", "#5A3A1C", 0);
      return s + P("M8.4,17.4 Q8.6,15.2 10.8,15", "none", 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.3" stroke-linecap="round"');
    }
    __name(verrou, "verrou");
    function inconnu() {
      let s = boules([[10, 18, 6], [17, 13, 7.4], [23, 18.6, 5.6], [16, 21.4, 6]], "#E4E9F1", "#6E7890", WO);
      s += clip("inc", "M2,30 L30,30 L30,20 Q16,26 2,20 Z", boules([[10, 18, 6], [17, 13, 7.4], [23, 18.6, 5.6], [16, 21.4, 6]], "#C4CDDC", "rgba(0,0,0,0)", WO));
      s += reflet(13.4, 9.6, 2, 1.2, 0.8);
      s += trait("M13.4,12.6 Q13.6,9.4 16.6,9.4 Q19.6,9.6 19.4,12.4 Q19.2,14.2 17,15 Q16.2,15.4 16.2,17.2", "#5A6680", 2.2) + rond(16.2, 20.6, 1.3, "#5A6680", 0);
      return s;
    }
    __name(inconnu, "inconnu");
    function etincelleIcone() {
      const quatre = /* @__PURE__ */ __name((x, y, R, r) => `M${x},${r2(y - R)} Q${r2(x + r)},${r2(y - r)} ${r2(x + R)},${y} Q${r2(x + r)},${r2(y + r)} ${x},${r2(y + R)} Q${r2(x - r)},${r2(y + r)} ${r2(x - R)},${y} Q${r2(x - r)},${r2(y - r)} ${x},${r2(y - R)} Z`, "quatre");
      let s = P(quatre(14, 17, 11.6, 1.8), OR.corps, WO) + P(quatre(14, 17, 6.4, 1), OR.clair, 0);
      s += P(quatre(25, 7.4, 4.6, 0.8), "#FFF0B0", WI) + P(quatre(25.4, 24.6, 3, 0.6), "#FFF0B0", WI);
      return s;
    }
    __name(etincelleIcone, "etincelleIcone");
    function chapitre() {
      let s = P("M3,9.6 Q9.6,6.4 16,9.6 Q22.4,6.4 29,9.6 L29,25.4 Q22.4,22.6 16,25.4 Q9.6,22.6 3,25.4 Z", "#A2432F", WO);
      const G = "M4.6,8.4 Q10.4,5.6 16,8.6 L16,24 Q10.4,21.4 4.6,23.4 Z", D = "M16,8.6 Q21.6,5.6 27.4,8.4 L27.4,23.4 Q21.6,21.4 16,24 Z";
      s += P(G, PAGE.corps, WI) + P(D, PAGE.corps, WI) + clip("chd", D, `<path d="M16,8 L28,8 L28,25 L22,25 Q20,16 16,8 Z" fill="${PAGE.ombre}" opacity=".6"/>`);
      s += [12, 15, 18].map((y) => L([6.6, y], [13.8, y - 0.6], "#C9B48E", 0.8) + L([18.2, y - 0.6], [25.4, y], "#C9B48E", 0.8)).join("");
      s += P("M21,6.4 L21,13.6 L22.6,12.2 L24.2,13.6 L24.2,6.4 Z", "#C9483A", WI);
      return s + L([16, 8.6], [16, 24], OUT, WI);
    }
    __name(chapitre, "chapitre");
    function plan() {
      const papier = "#F4EBD2";
      let s = P("M6.4,7.2 L26,7.2 L26,25.6 L6.4,25.6 Z", papier, WO) + clip("pla", "M6.4,7.2 L26,7.2 L26,25.6 L6.4,25.6 Z", `<rect x="21" y="7" width="5" height="19" fill="${PAGE.ombre}"/>`);
      s += trait("M10.6,21.4 L10.6,15.6 L16,11.2 L21.4,15.6 L21.4,21.4 Z M14.4,21.4 L14.4,17.6 L17.6,17.6 L17.6,21.4", "#3E78C8", 1);
      s += trait("M9.6,23.4 L22.4,23.4", "#8CB4E0", 0.7);
      s += P(rr(4.2, 5, 4.4, 22.8, 2.2), "#E6D6B4", WO) + P(rr(23.8, 5, 4.4, 22.8, 2.2), "#E6D6B4", WO) + L([5.8, 7], [5.8, 25.8], "#FFF8E6", 0.8);
      return s;
    }
    __name(plan, "plan");
    function carte() {
      const D = "M3,8 L11,5 L21,8 L29,5 L29,24 L21,27 L11,24 L3,27 Z";
      let s = P(D, "#F1E2BC", 0) + clip("car", D, '<path d="M11,5 L21,8 L21,27 L11,24 Z" fill="#E4D2A6"/><path d="M5,22 Q8,17 12,18 Q15,19 16,14" fill="none" stroke="#9CC97A" stroke-width="4" stroke-linecap="round"/><ellipse cx="25" cy="20" rx="3.4" ry="2.4" fill="#9ED0EE"/>') + P(D, "none", WO);
      s += L([11, 5], [11, 24], OUT, WI) + L([21, 8], [21, 27], OUT, WI);
      s += trait("M6.6,22.4 Q9,15 14.6,14.6 Q19.6,14.4 21,11", "#9A5A34", 1.1).replace("stroke-linecap", 'stroke-dasharray="1.6 1.4" stroke-linecap');
      s += trait("M22.4,8.6 L26,12.2 M26,8.6 L22.4,12.2", "#C9483A", 1.6);
      return s;
    }
    __name(carte, "carte");
    function pousse() {
      let s = P("M5.4,27 Q6.6,20.6 16,20.4 Q25.4,20.6 26.6,27 Q16,29.4 5.4,27 Z", "#9A6A3E", WO) + E(11.4, 23.2, 1.2, 0.6, "#B88458", 0) + E(20.4, 24.6, 1, 0.5, "#7A5030", 0);
      s += cerne("M16,21.4 Q15.6,16 16.4,11.6", "#6EA448", 1.6);
      s += P("M16.2,15.4 Q9.6,16.4 6.4,10.6 Q12.6,8.2 16.2,15.4 Z", "#8CC060", WO) + L([15.2, 14.6], [9.4, 11], "#5E9A3C", 0.7);
      s += P("M16.4,12 Q19.6,4.2 27,4.8 Q26,12.4 16.4,12 Z", "#8CC060", WO) + L([17.6, 11.2], [24.6, 6.4], "#5E9A3C", 0.7);
      return s + reflet(10.6, 11.4, 1, 0.5, 0.6) + reflet(22.4, 6.6, 1.2, 0.5, 0.6);
    }
    __name(pousse, "pousse");
    function glace() {
      const D = "M16,3.4 L26.6,9.6 L26.6,22.4 L16,28.6 L5.4,22.4 L5.4,9.6 Z";
      let s = P(D, "#CDEBF8", 0) + clip("gla", D, '<path d="M16,16 L26.6,9.6 L26.6,22.4 L16,28.6 Z" fill="#9CD2EC"/><path d="M16,16 L16,28.6 L5.4,22.4 Z" fill="#B6E0F4"/>') + P(D, "none", WO);
      s += P("M16,3.4 L16,16 L26.6,9.6 M16,16 L5.4,22.4 M16,16 L16,28.6", "none", WI);
      return s + P("M8.4,10.8 L13.6,7.8", "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"') + etincelle(25.6, 4.6, 1.4);
    }
    __name(glace, "glace");
    function laine() {
      const fil = "#E7C2C8", filS = "#C99AA2";
      let s = cerne("M5,6.4 L27.6,25.4", BOIS.clair, 1.4) + cerne("M27,4.4 L6.6,27.6", BOIS.clair, 1.4) + rond(5, 6.4, 1.6, "#C9483A", WI) + rond(27, 4.4, 1.6, "#C9483A", WI);
      s += rond(15.4, 15.6, 11.2, fil) + clip("lai", "M4.2,15.6 A11.2,11.2 0 1 0 26.6,15.6 A11.2,11.2 0 1 0 4.2,15.6 Z", `<circle cx="20" cy="20" r="11" fill="${filS}" opacity=".55"/>` + ["M6,10 Q16,14 24,6", "M5,16 Q15,20 25,10", "M6,22 Q16,25 26,16", "M10,5 Q14,16 10,26", "M17,4.6 Q22,15 18,26.8"].map((d) => `<path d="${d}" fill="none" stroke="${filS}" stroke-width="0.9" stroke-linecap="round"/>`).join("")) + rond(15.4, 15.6, 11.2, "none");
      return s + reflet(10.4, 9.6, 2.2, 1.2, 0.6);
    }
    __name(laine, "laine");
    function roseau() {
      let s = cerne("M10.4,29 L12,9.4", "#7DA850", 1.6) + cerne("M16,29 L16,6.4", "#7DA850", 1.6) + cerne("M21.6,29 L20.2,10.4", "#7DA850", 1.6);
      s += [[12, 9.4, -5], [16, 6.4, 0], [20.2, 10.4, 5]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})">${P(rr(x - 1.8, y - 1, 3.6, 8.6, 1.8), "#9A6A3E", WO)}${L([x - 0.6, y + 1], [x - 0.6, y + 6], "#B88458", 0.7)}</g>`).join("");
      s += P("M16.4,23 Q22,18.6 25.4,20.4 Q21.6,24.4 16.4,23 Z", "#8CC060", WI);
      return s + P(rr(9.6, 21.6, 12.8, 2.6, 1.2), "#E2C083", WI);
    }
    __name(roseau, "roseau");
    function sel() {
      const tas = "M7.6,15.6 Q7.8,10.2 11.6,9.4 Q12.6,4.2 16.6,4 Q20.8,4.4 21.6,9.4 Q24.6,10.4 24.4,15.6 Z";
      let s = P(tas, "#FBFBF6", WO) + clip("sel", tas, '<ellipse cx="21.4" cy="15" rx="6" ry="6" fill="#E2E6EA"/>');
      s += [[13, 11.6], [17.2, 8.2], [19.8, 12], [10.2, 12.8], [15.4, 13.6]].map(([x, y]) => `<rect x="${x}" y="${y}" width="1.7" height="1.7" rx="0.2" fill="#FFFFFF" stroke="#9AA4B0" stroke-width="0.5" transform="rotate(20 ${x} ${y})"/>`).join("");
      s += P("M3.6,15 L28.4,15 Q27.4,25.6 16,26 Q4.6,25.6 3.6,15 Z", BOIS.corps, WO) + clip("sco", "M3.6,15 L28.4,15 Q27.4,25.6 16,26 Q4.6,25.6 3.6,15 Z", `<path d="M18,26 Q27,24 28.4,15 L30,15 L30,27 Z" fill="${BOIS.ombre}"/>`);
      s += E(16, 15, 12.4, 1.8, BOIS.clair, WO) + E(16, 14.6, 8.6, 1, "#FBFBF6", 0);
      return s + etincelle(25.4, 7, 1.4);
    }
    __name(sel, "sel");
    function fruits() {
      let s = P("M16,12.4 L12,3.4 L15,6.6 L16.2,2.2 L17.6,6.8 L21,3.6 L18,12.4 Z", "#6EA448", WO) + L([16.2, 5], [16.2, 11.4], "#4E7A3A", 0.6);
      const D = "M16,11.4 Q24,11.6 24.4,20 Q24.2,28.8 16,29 Q7.8,28.8 7.6,20 Q8,11.6 16,11.4 Z";
      s += P(D, "#F2B640", 0) + clip("fru", D, '<path d="M19,29 Q25,25 24.6,15 L27,15 L27,30 Z" fill="#D4902A"/>' + ["M8,16 L21,29", "M10,12.6 L24.6,27", "M14,11.4 L25,22", "M24,16 L11,29", "M22,12.6 L7.4,27", "M18,11.4 L7.4,22"].map((d) => `<path d="${d}" stroke="#B8761E" stroke-width="0.8"/>`).join("")) + P(D, "none", WO);
      return s + reflet(11.6, 16.4, 1.2, 2, 0.5);
    }
    __name(fruits, "fruits");
    function obsidienne() {
      const D = "M6.6,22.6 L5.4,12.4 L13,4.4 L23.6,6.4 L27.4,15.6 L23.4,26.4 L12.4,28 Z";
      let s = P(D, "#4C4160", 0) + clip("obs", D, '<path d="M13,4.4 L23.6,6.4 L27.4,15.6 L17,15 Z" fill="#76669A"/><path d="M27.4,15.6 L23.4,26.4 L12.4,28 L17,15 Z" fill="#342A42"/><path d="M5.4,12.4 L13,4.4 L17,15 L6.6,22.6 Z" fill="#5C4F72"/>') + P(D, "none", WO);
      s += P("M13,4.4 L17,15 L27.4,15.6 M17,15 L6.6,22.6 M17,15 L12.4,28", "none", WI).replace(`stroke="${OUT}"`, 'stroke="#1E1824"');
      return s + P("M9,11.6 L12.6,7.6", "none", 0).replace('stroke="none"', 'stroke="#B8A6D8" stroke-width="1.4" stroke-linecap="round"') + etincelle(24.8, 9.6, 1.3);
    }
    __name(obsidienne, "obsidienne");
    var ROND = "M3,16 A13,13 0 1 0 29,16 A13,13 0 1 0 3,16 Z";
    var pastille = /* @__PURE__ */ __name((id, c, cS) => P(ROND, c, 0) + clip(id, ROND, `<circle cx="21" cy="21" r="13" fill="${cS}" opacity=".75"/>`) + P(ROND, "none", WO) + trait("M7.4,12.4 Q9,7.8 13.6,6.4", "rgba(255,255,255,.7)", 1.6), "pastille");
    var signe = /* @__PURE__ */ __name((d, w = 3) => cerne(d, "#FFFFFF", w), "signe");
    var PASTILLES = { rouge: ["#EE6A7A", "#C84458"], vert: ["#74C25E", "#4E9A3E"], bleu: ["#62AEE4", "#3F86C2"], bois: ["#D8A868", "#A87A42"], violet: ["#A48ED6", "#7A64B0"], ardoise: ["#86A2BC", "#5E7A96"] };
    function fermer() {
      return pastille("kfe", ...PASTILLES.rouge) + signe("M11.4,11.4 L20.6,20.6 M20.6,11.4 L11.4,20.6");
    }
    __name(fermer, "fermer");
    function retour() {
      return pastille("kre", ...PASTILLES.bois) + signe("M21.4,21.4 Q22.4,12.4 13,12.4", 2.6) + signe("M15.8,8.8 L12.2,12.4 L15.8,16", 2.6);
    }
    __name(retour, "retour");
    function fleche() {
      return pastille("kfl", ...PASTILLES.bleu) + signe("M9.6,16 L21.4,16 M16.6,10.8 L21.8,16 L16.6,21.2");
    }
    __name(fleche, "fleche");
    function valider() {
      return pastille("kva", ...PASTILLES.vert) + signe("M9.8,16.4 L14,20.6 L22.2,11.6", 3.2);
    }
    __name(valider, "valider");
    function pleinEcran() {
      return pastille("kpe", ...PASTILLES.ardoise) + signe("M9.4,13.2 L9.4,9.4 L13.2,9.4 M18.8,9.4 L22.6,9.4 L22.6,13.2 M22.6,18.8 L22.6,22.6 L18.8,22.6 M13.2,22.6 L9.4,22.6 L9.4,18.8", 2.2);
    }
    __name(pleinEcran, "pleinEcran");
    function reglages() {
      return pastille("krg", ...PASTILLES.violet) + signe("M9.4,11 L22.6,11 M9.4,16 L22.6,16 M9.4,21 L22.6,21", 1.4) + [[19, 11], [12.4, 16], [17, 21]].map(([x, y]) => rond(x, y, 2.1, OR.corps, WI) + rond(x - 0.6, y - 0.6, 0.6, OR.clair, 0)).join("");
    }
    __name(reglages, "reglages");
    var loupe = /* @__PURE__ */ __name((id, plus) => cerne("M20.4,20.4 L26.8,26.8", BOIS.corps, 3.6) + L([21.4, 20.8], [25.6, 25], BOIS.clair, 0.9) + rond(13.6, 13.6, 9.2, OR.corps) + P("M7.2,13.6 A6.4,6.4 0 1 0 20,13.6 A6.4,6.4 0 1 0 7.2,13.6 Z", "#DDF1FA", WI) + clip(id, "M7.2,13.6 A6.4,6.4 0 1 0 20,13.6 A6.4,6.4 0 1 0 7.2,13.6 Z", '<circle cx="17" cy="17" r="6.4" fill="#B8DDEE"/>') + trait(plus ? "M10.4,13.6 L16.8,13.6 M13.6,10.4 L13.6,16.8" : "M10.4,13.6 L16.8,13.6", "#3E78C8", 1.8) + reflet(10.4, 9.8, 1.4, 0.8, 0.8), "loupe");
    function zoomPlus() {
      return loupe("kzp", true);
    }
    __name(zoomPlus, "zoomPlus");
    function zoomMoins() {
      return loupe("kzm", false);
    }
    __name(zoomMoins, "zoomMoins");
    var hautParleur = /* @__PURE__ */ __name((id) => {
      const D = "M5.4,12.4 L10.6,12.4 L17,6.6 L17,25.4 L10.6,19.6 L5.4,19.6 Q4.4,19.6 4.4,18.6 L4.4,13.4 Q4.4,12.4 5.4,12.4 Z";
      return P(D, OR.corps, 0) + clip(id, D, `<rect x="11" y="16" width="7" height="10" fill="${OR.ombre}"/><rect x="4" y="16.4" width="7" height="4" fill="${OR.ombre}"/>`) + P(D, "none", WO) + L([10.6, 12.8], [10.6, 19.2], OUT, WI) + reflet(13.2, 10.4, 0.7, 1.4, 0.7);
    }, "hautParleur");
    function son() {
      return hautParleur("kso") + cerne("M20.6,12.4 Q23,16 20.6,19.6", "#7CC4EC", 1.4) + cerne("M23.6,9.2 Q28,16 23.6,22.8", "#7CC4EC", 1.4);
    }
    __name(son, "son");
    function sonCoupe() {
      return hautParleur("ksc") + cerne("M21,12.6 L27.4,19 M27.4,12.6 L21,19", "#EE6A7A", 1.8);
    }
    __name(sonCoupe, "sonCoupe");
    function musique() {
      let s = cerne("M12.4,21.6 L12.4,10.4 M24.4,18.6 L24.4,7.4", OR.fonce, 1.4) + P("M11.4,8.4 L25.4,5 L25.4,9 L11.4,12.4 Z", OR.corps, WO);
      s += [[9.6, 22.4], [21.6, 19.4]].map(([x, y]) => `<g transform="rotate(-22 ${x} ${y})">${E(x, y, 3.6, 2.7, OR.corps, WO)}${reflet(x - 1.2, y - 0.9, 1, 0.6, 0.8)}</g>`).join("");
      return s + etincelle(6.4, 7.4, 1.6);
    }
    __name(musique, "musique");
    function batir() {
      let s = P(rr(3.6, 22.6, 17, 5, 1.2), BOIS.clair, WO) + L([5.4, 24.4], [18.6, 24.4], BOIS.ombre, 0.6) + rond(17.2, 25.1, 0.9, "#8E96A6", WI);
      s += cerne("M9.4,21.6 L20,10.4", BOIS.corps, 2.8) + L([10.2, 20], [18.6, 11.2], BOIS.clair, 0.8);
      s += `<g transform="rotate(44 21.4 9.4)">${P(rr(14.4, 5, 14, 8.8, 2.2), "#C8925A", WO)}${P(rr(16.6, 5, 2, 8.8, 0), "#8E96A6", WI)}${P(rr(24.2, 5, 2, 8.8, 0), "#8E96A6", WI)}${reflet(20.6, 6.6, 1.6, 0.6, 0.6)}</g>`;
      return s + etincelle(26.4, 21, 1.6);
    }
    __name(batir, "batir");
    function evoluer() {
      const D = "M16,3.4 L26.6,14.2 L20.6,14.2 L20.6,26.4 Q20.6,28.4 18.6,28.4 L13.4,28.4 Q11.4,28.4 11.4,26.4 L11.4,14.2 L5.4,14.2 Z";
      return P(D, "#7CC860", 0) + clip("kev", D, '<path d="M16,3 L27,14 L20.6,14.6 L20.6,29 L16,29 Z" fill="#58A040"/>') + P(D, "none", WO) + trait("M8.6,12.8 L15.4,6", "rgba(255,255,255,.75)", 1.4) + reflet(14, 19, 0.8, 3, 0.45) + etincelle(25.4, 22, 1.8) + etincelle(6.4, 21.4, 1.2);
    }
    __name(evoluer, "evoluer");
    function annexes() {
      let s = P(rr(6, 13.6, 15.6, 13, 1.2), "#F4DCA4", WO) + clip("kan", rr(6, 13.6, 15.6, 13, 1.2), '<rect x="17" y="13" width="5" height="14" fill="#E2C083"/>');
      s += P("M3.4,15.2 L13.8,6 L24.2,15.2 Q23.4,16.6 22,15.8 L13.8,8.8 L5.6,15.8 Q4.2,16.6 3.4,15.2 Z", "#E06A4E", WO);
      s += P(rr(11.6, 19, 4.6, 7.6, 2.2), BOIS.corps, WI) + rond(15, 23, 0.6, OR.corps, 0) + P(rr(8, 16.6, 3, 3, 0.6), "#BFE3F2", WI);
      s += rond(23.6, 22.6, 6.4, "#74C25E") + clip("kap", "M17.2,22.6 A6.4,6.4 0 1 0 30,22.6 A6.4,6.4 0 1 0 17.2,22.6 Z", '<circle cx="26.6" cy="25.6" r="6.4" fill="#4E9A3E" opacity=".7"/>') + rond(23.6, 22.6, 6.4, "none");
      return s + signe("M20.6,22.6 L26.6,22.6 M23.6,19.6 L23.6,25.6", 2);
    }
    __name(annexes, "annexes");
    function deplacer() {
      const b = "#62AEE4";
      let s = cerne("M16,7.4 L16,24.6 M7.4,16 L24.6,16", b, 3.2);
      s += ["M16,2.6 L21.4,8.6 L10.6,8.6 Z", "M16,29.4 L21.4,23.4 L10.6,23.4 Z", "M2.6,16 L8.6,10.6 L8.6,21.4 Z", "M29.4,16 L23.4,10.6 L23.4,21.4 Z"].map((d) => P(d, b, WO)).join("");
      return s + rond(16, 16, 3.4, "#FFFFFF", WO) + reflet(14.6, 5.6, 1, 0.6, 0.7);
    }
    __name(deplacer, "deplacer");
    function tourner() {
      let s = P("M16,10.6 L23.4,16 L16,21.4 L8.6,16 Z", "#9CC97A", WI) + P("M16,21.4 L23.4,16 L23.4,17.6 L16,23 L8.6,17.6 L8.6,16 Z", "#7A5A3A", WI);
      s += cerne("M27.2,18 A11.2,11.2 0 1 1 21,6.4", "#F49A4A", 2.4);
      return s + P("M27.6,9.2 L19.8,3.2 L18.8,11.4 Z", "#F49A4A", WO) + reflet(8.4, 11.4, 1, 0.6, 0.7);
    }
    __name(tourner, "tourner");
    function temps() {
      let s = cerne("M9.4,26.6 L7.6,29 M22.6,26.6 L24.4,29", OUT, 1);
      s += rond(8.2, 7.8, 3.6, OR.corps) + rond(23.8, 7.8, 3.6, OR.corps) + cerne("M10.8,5.4 Q16,2.4 21.2,5.4", "#9AA4B4", 1);
      s += rond(16, 17.6, 11, "#EE6A7A") + clip("ktp", "M5,17.6 A11,11 0 1 0 27,17.6 A11,11 0 1 0 5,17.6 Z", '<circle cx="20.6" cy="22" r="11" fill="#C84458" opacity=".7"/>') + rond(16, 17.6, 11, "none");
      s += rond(16, 17.6, 8, "#FBF3DE", WI) + [0, 1, 2, 3].map((i) => {
        const a = i * Math.PI / 2;
        return L([16 + 6.4 * Math.sin(a), 17.6 - 6.4 * Math.cos(a)], [16 + 7.2 * Math.sin(a), 17.6 - 7.2 * Math.cos(a)], OUT, 0.9);
      }).join("");
      s += trait("M16,17.6 L16,12.4 M16,17.6 L19.6,19.4", OUT, 1.3) + rond(16, 17.6, 1, OR.fonce, 0);
      return s + trait("M8.6,13.4 Q9.8,10 13,8.6", "rgba(255,255,255,.7)", 1.4);
    }
    __name(temps, "temps");
    var etoileD = /* @__PURE__ */ __name((x, y, R, r) => Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R;
      return `${i ? "L" : "M"}${r2(x + k * Math.cos(a))},${r2(y + k * Math.sin(a))}`;
    }).join(" ") + " Z", "etoileD");
    function etoileIcone() {
      const D = etoileD(16, 17.2, 14, 6.8);
      return P(D, OR.corps, 0) + clip("ket", D, `<path d="M16,17.2 L31,12 L31,31 L16,31 Z" fill="${OR.ombre}"/>`) + P(D, "none", WO) + P(etoileD(16, 17.2, 7, 3.4), OR.clair, 0) + reflet(11.6, 13.6, 1.2, 0.8, 0.8) + etincelle(27, 5.4, 1.4);
    }
    __name(etoileIcone, "etoileIcone");
    function cadeau() {
      let s = P(rr(6.4, 15.4, 19.2, 13, 1.4), "#F08CAA", 0) + clip("kca", rr(6.4, 15.4, 19.2, 13, 1.4), '<rect x="20" y="15" width="6" height="14" fill="#D06A8C"/>') + P(rr(6.4, 15.4, 19.2, 13, 1.4), "none", WO);
      s += P(rr(4.6, 10.6, 22.8, 5.6, 1.4), "#F6A6C0", WO) + P(rr(14, 10.6, 4, 17.8, 0), OR.corps, WI);
      s += P("M16,10.8 Q9.6,2.6 7.6,7 Q7,10.6 16,10.8 Z", OR.corps, WO) + P("M16,10.8 Q22.4,2.6 24.4,7 Q25,10.6 16,10.8 Z", OR.corps, WO);
      s += rond(16, 10.6, 2, OR.ombre, WI) + reflet(10, 6.8, 0.9, 0.6, 0.8) + reflet(8.4, 18, 0.8, 1.6, 0.5);
      return s;
    }
    __name(cadeau, "cadeau");
    function coffreIcone() {
      const corps = rr(4.6, 14.6, 22.8, 13.4, 1.6), couv = "M4.6,15.2 L4.6,11.6 Q4.6,5.4 16,5.4 Q27.4,5.4 27.4,11.6 L27.4,15.2 Z";
      let s = P(corps, BOIS.corps, 0) + clip("kco", corps, `<rect x="21" y="14" width="7" height="15" fill="${BOIS.ombre}"/>`) + P(corps, "none", WO);
      s += P(couv, BOIS.clair, 0) + clip("kcv", couv, `<rect x="21" y="5" width="7" height="11" fill="${BOIS.corps}"/>`) + P(couv, "none", WO);
      s += [8.4, 21.6].map((x) => P(rr(x - 1.2, 5.8, 2.4, 22, 0.4), OR.corps, WI)).join("");
      s += P(rr(13.4, 12.4, 5.2, 6, 1.2), OR.corps, WI) + rond(16, 14.8, 0.9, "#5A3A1C", 0) + L([16, 15.2], [16, 16.8], "#5A3A1C", 0.8);
      return s + reflet(9.2, 8.6, 1.6, 0.7, 0.55) + etincelle(27, 4, 1.6);
    }
    __name(coffreIcone, "coffreIcone");
    function boutique() {
      let s = cerne("M7,12 L7,26 M25,12 L25,26", BOIS.corps, 1.6);
      s += P(rr(4.4, 19.4, 23.2, 8.6, 1.2), BOIS.corps, 0) + clip("kbo", rr(4.4, 19.4, 23.2, 8.6, 1.2), `<rect x="4" y="25" width="24" height="4" fill="${BOIS.ombre}"/>`) + P(rr(4.4, 19.4, 23.2, 8.6, 1.2), "none", WO) + L([6, 21], [26, 21], BOIS.clair, 0.8);
      s += rond(11.4, 17.4, 2.4, "#E04E3E", WI) + rond(15.6, 17.8, 2, OR.corps, WI) + rond(20.4, 17.4, 2.4, "#7CC860", WI) + reflet(10.6, 16.6, 0.6, 0.8, 0.8);
      const A = "M3.4,6.6 Q16,4.6 28.6,6.6 L28.6,11.4 Q27.4,14 25.6,11.4 Q24.4,14 22.6,11.4 Q21.4,14 19.6,11.4 Q18.4,14 16.6,11.4 Q15.4,14 13.6,11.4 Q12.4,14 10.6,11.4 Q9.4,14 7.6,11.4 Q6.4,14 4.6,11.4 Q3.4,13 3.4,11.4 Z";
      s += P(A, "#FFFFFF", 0) + clip("kba", A, [4, 10, 16, 22].map((x) => `<rect x="${x}" y="4" width="3" height="11" fill="#EE6A7A"/>`).join("")) + P(A, "none", WO);
      return s;
    }
    __name(boutique, "boutique");
    function quete() {
      let s = P(rr(7, 8.6, 15, 18, 0.6), PAGE.corps, WO) + clip("kqu", rr(7, 8.6, 15, 18, 0.6), `<rect x="18" y="8" width="5" height="19" fill="${PAGE.ombre}"/>`);
      s += P(rr(4.8, 6, 19.4, 4, 2), PAGE.ombre, WO) + P(rr(4.8, 24.6, 19.4, 4, 2), PAGE.ombre, WO);
      s += [13.6, 17, 20.4].map((y) => L([9.4, y], [18, y], "#B9A68A", 1.1)).join("");
      s += rond(23.4, 10.6, 6.6, OR.corps) + clip("kqp", "M16.8,10.6 A6.6,6.6 0 1 0 30,10.6 A6.6,6.6 0 1 0 16.8,10.6 Z", `<circle cx="26.4" cy="13.6" r="6.6" fill="${OR.ombre}"/>`) + rond(23.4, 10.6, 6.6, "none");
      return s + trait("M23.4,7 L23.4,11", "#8A4A1C", 2.2) + rond(23.4, 14.2, 1.2, "#8A4A1C", 0);
    }
    __name(quete, "quete");
    function succes() {
      const C = "M9,4.6 L23,4.6 L23,10 Q23,18 16,18.6 Q9,18 9,10 Z";
      let s = cerne("M9.2,7.6 Q4.6,7.4 5.2,11.6 Q6,15 10,14.6 M22.8,7.6 Q27.4,7.4 26.8,11.6 Q26,15 22,14.6", OR.corps, 1.4);
      s += P(C, OR.corps, 0) + clip("ksu", C, `<path d="M18,4 L24,4 L24,19 L16,19 Q21,15 18,4 Z" fill="${OR.ombre}"/>`) + P(C, "none", WO);
      s += P(etoileD(16, 10.8, 3.6, 1.6), OR.clair, WI) + P(rr(14.4, 18.2, 3.2, 4.4, 0.6), OR.ombre, WI);
      s += P(rr(9.4, 22.2, 13.2, 5.6, 1.4), BOIS.corps, WO) + P(rr(12.6, 23.8, 6.8, 2.4, 0.6), OR.corps, WI);
      return s + trait("M11.2,7 L11.4,11.4", "rgba(255,255,255,.75)", 1.2) + etincelle(26.6, 21, 1.4);
    }
    __name(succes, "succes");
    function nouveau() {
      const D = Array.from({ length: 24 }, (_, i) => {
        const a = -Math.PI / 2 + i * Math.PI / 12, k = i % 2 ? 10.6 : 13.2;
        return `${i ? "L" : "M"}${r2(16 + k * Math.cos(a))},${r2(16 + k * Math.sin(a))}`;
      }).join(" ") + " Z";
      return P(D, "#EE6A7A", 0) + clip("kno", D, '<circle cx="21" cy="21" r="13" fill="#C84458" opacity=".75"/>') + P(D, "none", WO) + signe("M16,9.6 L16,17.4", 3) + rond(16, 22.2, 1.9, "#FFFFFF", WI);
    }
    __name(nouveau, "nouveau");
    var tete = /* @__PURE__ */ __name((x, y, r, peau, cheveux) => rond(x, y, r, peau, WO) + P(`M${r2(x - r)},${r2(y - 0.2)} Q${r2(x - r * 1.04)},${r2(y - r * 1.12)} ${x},${r2(y - r * 1.06)} Q${r2(x + r * 1.04)},${r2(y - r * 1.12)} ${r2(x + r)},${r2(y - 0.2)} Q${r2(x + r * 0.5)},${r2(y - r * 0.56)} ${x},${r2(y - r * 0.4)} Q${r2(x - r * 0.5)},${r2(y - r * 0.56)} ${r2(x - r)},${r2(y - 0.2)} Z`, cheveux, WI) + E(x - r * 0.36, y + r * 0.12, r * 0.13, r * 0.18, "#2A2420", 0) + E(x + r * 0.36, y + r * 0.12, r * 0.13, r * 0.18, "#2A2420", 0) + E(x - r * 0.58, y + r * 0.42, r * 0.2, r * 0.12, "rgba(240,120,110,.6)", 0) + E(x + r * 0.58, y + r * 0.42, r * 0.2, r * 0.12, "rgba(240,120,110,.6)", 0) + trait(`M${r2(x - r * 0.16)},${r2(y + r * 0.46)} Q${x},${r2(y + r * 0.6)} ${r2(x + r * 0.16)},${r2(y + r * 0.46)}`, OUT, 0.7), "tete");
    function profil() {
      const F = "M6.6,16 A9.4,11 0 1 0 25.4,16 A9.4,11 0 1 0 6.6,16 Z";
      let s = E(16, 16, 12.4, 14, BOIS.corps, WO) + E(16, 16, 9.4, 11, "#BFE3F2", WI);
      s += clip("kpr", F, `<path d="M7,30 Q7,21.4 16,21.4 Q25,21.4 25,30 Z" fill="#62AEE4" stroke="${OUT}" stroke-width="${WI}"/>` + tete(16, 15, 5.4, "#FFE0C4", "#8A5A30"));
      s += E(16, 16, 9.4, 11, "none", WI) + trait("M6.4,9.4 Q8.6,4.6 13,3.4", BOIS.clair, 1.2);
      return s + rond(16, 2.6, 1.6, OR.corps, WI);
    }
    __name(profil, "profil");
    function gardeRobe() {
      let s = cerne("M16,8.4 Q15.6,4.2 18.4,4.4 Q20.6,4.8 19.8,7.2", "#9AA4B4", 1.1) + cerne("M4.6,14.2 L16,8.4 L27.4,14.2", BOIS.corps, 1.6);
      const T = "M9.6,12.4 L13.2,11 Q16,13.4 18.8,11 L22.4,12.4 L26.8,17.8 L23.4,20 L22,18.4 L22,27.6 Q22,28.4 21.2,28.4 L10.8,28.4 Q10,28.4 10,27.6 L10,18.4 L8.6,20 L5.2,17.8 Z";
      s += P(T, "#74C25E", 0) + clip("kgr", T, '<path d="M17,29 Q22,24 22,12 L28,18 L28,29 Z" fill="#4E9A3E"/>') + P(T, "none", WO);
      s += P("M13.2,11 Q16,15 18.8,11", "none", WI) + rond(16, 18.6, 0.7, "#FBF3DE", 0.5) + rond(16, 22, 0.7, "#FBF3DE", 0.5);
      return s + P("M19.6,24.6 Q18.2,22.8 19.2,22 Q20,21.6 20.4,22.6 Q20.8,21.6 21.4,22 Q22.2,22.8 20.4,24.6 Z".replace(/(\d+\.?\d*),(\d+\.?\d*)/g, (m, a, b) => `${r2(a - 2.4)},${b}`), "#EE6A7A", 0.5);
    }
    __name(gardeRobe, "gardeRobe");
    function amis() {
      return tete(21.8, 19.4, 6.8, "#F2C9A4", "#3E3A3A") + tete(10.6, 18.4, 7.2, "#FFE0C4", "#C8783A") + P("M16.2,9.6 Q12.6,7.2 12.8,4.8 Q13.2,2.8 15,3 Q16,3.2 16.2,4.4 Q16.4,3.2 17.4,3 Q19.2,2.8 19.6,4.8 Q19.8,7.2 16.2,9.6 Z", "#EE6A7A", WI) + reflet(14.4, 4.6, 0.6, 0.5, 0.8);
    }
    __name(amis, "amis");
    function visite() {
      const D = "M8.4,27 L8.4,13 Q8.4,4.6 16,4.6 Q23.6,4.6 23.6,13 L23.6,27 Z";
      let s = P(D, BOIS.corps, 0) + clip("kvi", D, `<rect x="19.6" y="4" width="5" height="24" fill="${BOIS.ombre}"/>` + [12.4, 16, 19.6].map((x) => `<path d="M${x},5 L${x},27" stroke="${BOIS.ombre}" stroke-width="0.7"/>`).join("")) + P(D, "none", WO);
      s += rond(16, 11.4, 2.8, "#BFE3F2", WI) + L([16, 8.6], [16, 14.2], OUT, 0.6) + rond(20.4, 18.4, 1.1, OR.corps, WI);
      s += P(rr(6, 26.4, 20, 3.2, 1.2), "#EE6A7A", WI) + P("M16,29 Q14.4,27.8 15,27.2 Q15.6,26.8 16,27.6 Q16.4,26.8 17,27.2 Q17.6,27.8 16,29 Z", "#FFFFFF", 0);
      s += cerne("M5,26 L5,21", "#6EA448", 0.9) + cerne("M27,26 L27,21", "#6EA448", 0.9);
      return s + [[5, 20.4, "#F6A6C0"], [27, 20.4, OR.corps]].map(([x, y, c]) => rond(x, y, 1.9, c, WI) + rond(x, y, 0.7, "#FFF4CC", 0)).join("");
    }
    __name(visite, "visite");
    function messages() {
      const D = rr(3.6, 8, 24.8, 17.4, 2);
      let s = P(D, "#FBF3DE", 0) + clip("kme", D, `<path d="M3,26 L16,15 L29,26 Z" fill="${PAGE.ombre}"/>`) + P(D, "none", WO);
      s += trait("M4.4,9 L16,18.4 L27.6,9", OUT, WI) + trait("M4.6,24.6 L12.6,17.2 M27.4,24.6 L19.4,17.2", "#C9B48E", 0.8);
      return s + P("M16,22.4 Q11.8,19.6 12,17 Q12.4,15 14.2,15.2 Q15.4,15.4 16,16.6 Q16.6,15.4 17.8,15.2 Q19.6,15 20,17 Q20.2,19.6 16,22.4 Z", "#E04E3E", WI) + reflet(14, 16.6, 0.7, 0.5, 0.8);
    }
    __name(messages, "messages");
    function notifications() {
      const D = "M16,5.4 Q23.4,5.6 23.6,13.4 L23.8,19.4 L26.8,23.2 L5.2,23.2 L8.2,19.4 L8.4,13.4 Q8.6,5.6 16,5.4 Z";
      let s = rond(16, 26, 2.6, OR.ombre) + P(D, OR.corps, 0) + clip("kno2", D, `<path d="M19,5 Q24,10 24,20 L28,24 L16,24 Z" fill="${OR.ombre}"/>`) + P(D, "none", WO);
      s += rond(16, 4.6, 1.6, OR.corps, WI) + trait("M10.6,18 L10.8,13.2 Q11,9.6 13.6,8.4", "rgba(255,255,255,.75)", 1.4);
      return s + rond(25, 7.4, 4, "#EE6A7A") + reflet(23.8, 6.2, 1, 0.6, 0.8);
    }
    __name(notifications, "notifications");
    var ICONES2 = [
      ["grimoire", "Grimoire", grimoire, "l'onglet du Grimoire"],
      ["ile", "Île", ile, "l'onglet de l'île"],
      ["defis", "Défis", defis, "l'onglet des Défis"],
      ["sceau", "Sceau", sceau, "l'onglet du Sceau (le compte, les succès)"],
      ["sac", "Sac", sac, "le sac de la v6 (étape 4) : ce que le joueur a ramassé"],
      ["taches", "Tâches", taches, "les tâches de Brume (v6, étape 6)"],
      ["menu", "Menu", menu, "le menu de la v6 (étape 6) : l'avatar, les réglages"],
      ["ecu", "Écu", ecu, "le compteur d'écus, les prix, les gains"],
      ["pierre", "Pierre", pierre, "la ressource pierre (stock, Récolte, prix)"],
      ["bois", "Bois", bois, "la ressource bois"],
      ["eau", "Eau", eau, "la ressource eau"],
      ["nourriture", "Nourriture", nourriture, "la ressource nourriture, le besoin « manger »"],
      ["poisson", "Poisson", poisson, "le poisson (ce que produit le Ponton)"],
      ["recolte", "Récolte", recolte, "le bouton de la Récolte"],
      ["ramasser", "Tout ramasser", ramasser, "le bouton « Tout ramasser »"],
      ["carnet", "Carnet d'explorateur", carnet, "le bouton du carnet d'explorateur"],
      ["trouvailles", "Trouvailles", trouvailles, "le bouton des trouvailles des climats"],
      ["expedition", "Expédition", expedition, "une expédition en cours"],
      ["outils", "Outils", outils, "le besoin « travailler » (fiche d'un camarade, bulle de besoin)"],
      ["fleur", "Fleur", fleur, "le besoin « se distraire »"],
      ["humeur_joie", "Humeur : joie", humeurJoie, "l'humeur d'un camarade : content"],
      ["humeur_calme", "Humeur : calme", humeurCalme, "l'humeur d'un camarade : tranquille"],
      ["humeur_bouderie", "Humeur : bouderie", humeurBouderie, "l'humeur d'un camarade : il lui manque quelque chose"],
      ["coeur", "Cœur", coeur, "l'amitié d'un camarade (cœurs de la fiche, récompenses)"],
      ["verrou", "Verrou", verrou, "ce qui est scellé : un chapitre, un rang de l'établi"],
      ["inconnu", "Inconnu", inconnu, "un élément pas encore trouvé"],
      ["etincelle", "Étincelle", etincelleIcone, "une quête, une chose à faire, le dessin par défaut"],
      ["chapitre", "Chapitre", chapitre, "le chapitre du Grimoire qu'il faut avoir ouvert"],
      ["plan", "Plan", plan, "le plan d'un bâtiment (au-dessus d'un chantier, étapes d'un bâtiment)"],
      ["carte", "Carte", carte, "un quartier, une expédition"],
      ["pousse", "Pousse", pousse, "le filtre « fertiles » du Grimoire"],
      ["glace", "Glace", glace, "la trouvaille des Cimes"],
      ["laine", "Laine", laine, "la trouvaille des Landes"],
      ["roseau", "Roseau", roseau, "la trouvaille du Marais"],
      ["sel", "Sel", sel, "la trouvaille des Dunes"],
      ["fruits", "Fruits", fruits, "la trouvaille de la Jungle"],
      ["obsidienne", "Obsidienne", obsidienne, "la trouvaille du Volcan"],
      // les commandes
      ["fermer", "Fermer", fermer, "fermer une fiche, une fenêtre"],
      ["retour", "Retour", retour, "revenir en arrière"],
      ["fleche", "Flèche", fleche, "suivant, page suivante (vers la droite ; les autres directions en la tournant en CSS)"],
      ["valider", "Valider", valider, "confirmer, c'est fait"],
      ["zoom_plus", "Zoom avant", zoomPlus, "rapprocher la vue"],
      ["zoom_moins", "Zoom arrière", zoomMoins, "éloigner la vue"],
      ["plein_ecran", "Plein écran", pleinEcran, "passer en plein écran"],
      ["reglages", "Réglages", reglages, "les réglages"],
      ["son", "Son", son, "le son allumé"],
      ["son_coupe", "Son coupé", sonCoupe, "le son coupé"],
      ["musique", "Musique", musique, "la musique"],
      // les actions des bâtiments
      ["batir", "Bâtir", batir, "bâtir sur un chantier"],
      ["evoluer", "Faire évoluer", evoluer, "faire passer un bâtiment au palier suivant"],
      ["annexes", "Annexes", annexes, "l'onglet des annexes, poser une annexe"],
      ["deplacer", "Déplacer", deplacer, "déplacer un bâtiment, une annexe"],
      ["tourner", "Tourner", tourner, "tourner un bâtiment, une annexe"],
      ["temps", "Temps", temps, "le temps qu'il reste (production, évolution, expédition)"],
      // récompenses et boutique
      ["etoile", "Étoile", etoileIcone, "une récompense, un palier, une note"],
      ["cadeau", "Cadeau", cadeau, "un cadeau, une récompense à ouvrir"],
      ["coffre", "Coffre", coffreIcone, "les coffres (le bouton, la liste)"],
      ["boutique", "Boutique", boutique, "la boutique"],
      ["quete", "Quête", quete, "une quête à prendre ou à rendre"],
      ["succes", "Succès", succes, "les succès"],
      ["nouveau", "Nouveau", nouveau, "quelque chose de nouveau (pastille sur un bouton)"],
      // le perso et les autres
      ["profil", "Profil", profil, "le profil du joueur, son avatar"],
      ["garde_robe", "Garde-robe", gardeRobe, "la garde-robe de l'avatar"],
      ["amis", "Amis", amis, "les amis"],
      ["visite", "Visites", visite, "visiter une île, les visites reçues"],
      ["messages", "Messages", messages, "les messages"],
      ["notifications", "Notifications", notifications, "les notifications"]
    ];
    module.exports = { ICONES: ICONES2 };
  }
});

// atelier/generateur_interface.mjs
var import_interface = __toESM(require_interface(), 1);
var CADRE = [0, 0, 32, 32];
var ICONES = Object.fromEntries(import_interface.default.ICONES.map(([id, nom, , sert]) => [id, { nom, sert }]));
function icone(id, px = 32) {
  const i = import_interface.default.ICONES.find((x) => x[0] === id);
  if (!i) throw new Error(`icône inconnue : ${id} (${Object.keys(ICONES).join(", ")})`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${CADRE.join(" ")}">${i[2]()}</svg>`, cadre: CADRE, ms_par_image: null };
}
__name(icone, "icone");
var HD = 128;
function liste() {
  return [
    ...import_interface.default.ICONES.map(([id]) => ({ fichier: `interface/${id}_icone.svg`, fonction: "icone", args: [id] })),
    ...import_interface.default.ICONES.map(([id]) => ({ fichier: `interface/hd/${id}_icone.svg`, fonction: "icone", args: [id, HD] }))
  ];
}
__name(liste, "liste");
export {
  HD,
  ICONES,
  icone,
  liste
};
