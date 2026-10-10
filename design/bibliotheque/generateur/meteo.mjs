// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_meteo.mjs : ne pas modifier à la main.
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
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT, w + W * 2) + L(a, b, fill, w), "limb");
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
      const [bi, bo, arch] = BROW[expr];
      for (const [x, y, rx] of g.eyes) {
        const k = cx > x ? 1 : -1, hw = rx + 0.45, by = y + g.browY;
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
        if (derriere) s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
        const fd = path([cut, b]);
        s += stroke(fd, OUT, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P2 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
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
    module.exports = { OUT, W, r2: r22, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/meteo.js
var require_meteo = __commonJS({
  "atelier/meteo.js"(exports, module) {
    var { OUT, P, E, L, r2: r22 } = require_troupe2();
    var TAU = Math.PI * 2;
    var hash = /* @__PURE__ */ __name((a, b) => {
      const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return s - Math.floor(s);
    }, "hash");
    var T = 256;
    function wrapped(x, y, m, draw, W = T, H = T) {
      let o = "";
      const mx = (x % W + W) % W, my = (y % H + H) % H;
      for (const dx of [-W, 0, W]) for (const dy of [-H, 0, H]) {
        const px = mx + dx, py = my + dy;
        if (px > -m && px < W + m && py > -m && py < H + m) o += draw(px, py);
      }
      return o;
    }
    __name(wrapped, "wrapped");
    var line = /* @__PURE__ */ __name((d, w, c, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "line");
    var tk = /* @__PURE__ */ __name((d, w, c) => line(d, w + 2.2, OUT) + line(d, w, c), "tk");
    var TILES = {};
    var rain = /* @__PURE__ */ __name((night) => ({
      w: T,
      h: T,
      n: 8,
      ms: 110,
      draw: /* @__PURE__ */ __name((k) => {
        const c = night ? "rgba(205,218,242,.42)" : "rgba(168,186,212,.6)";
        let d = "";
        for (let i = 0; i < 24; i++) {
          const s = hash(i, 3) < 0.6 ? 1 : 2;
          const len = (9 + hash(i, 4) * 8) * 1.25;
          d += wrapped(hash(i, 1) * T + s * T * k / 8, hash(i, 2) * T + s * 4 * T * k / 8, 30, (x, y) => `M${r22(x)},${r22(y)} l${r22(-len * 0.25)},${r22(-len)} `);
        }
        return line(d, 1.4, c);
      }, "draw")
    }), "rain");
    TILES.pluie_jour = rain(false);
    TILES.pluie_nuit = rain(true);
    TILES.neige = { w: T, h: T, n: 16, ms: 200, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 16; i++) {
        const r = (1 + hash(i, 4) * 1.8) * 1.25;
        const x = hash(i, 1) * T + Math.sin(TAU * k / 16 + i) * 14;
        o += wrapped(x, hash(i, 2) * T + T * k / 16, 6, (px, py) => E(px, py, r, r, "rgba(255,255,255,.88)", 0));
      }
      return o;
    }, "draw") };
    TILES.rafales = { w: T, h: T, n: 8, ms: 100, draw: /* @__PURE__ */ __name((k) => {
      let d = "";
      for (let i = 0; i < 5; i++) {
        const len = (40 + hash(i, 8) * 60) * 1.25, wob = 6 * Math.sin(TAU * k / 8 + i);
        d += wrapped(hash(i, 6) * T + T * k / 8, hash(i, 5) * T, len + 8, (x, y) => `M${r22(x)},${r22(y)} q${r22(len * 0.5)},${r22(-wob)} ${r22(len)},0 `);
      }
      return line(d, 1.5, "rgba(255,255,255,.5)");
    }, "draw") };
    var banks = /* @__PURE__ */ __name((veil, bank, a) => ({ w: 2 * T, h: T, n: 12, ms: 500, draw: /* @__PURE__ */ __name((k) => {
      const W = 2 * T;
      let o = `<defs><radialGradient id="b"><stop offset="0" stop-color="rgb(${bank})" stop-opacity="${a}"/><stop offset="1" stop-color="rgb(${bank})" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${T}" fill="${veil}"/>`;
      for (let i = 0; i < 3; i++) {
        const R = 150;
        o += wrapped(hash(i, 61) * W + W * k / 12, T * (0.2 + i * 0.3) + Math.sin(TAU * k / 12 + i) * 10, R, (x, y) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${R}" fill="url(#b)"/>`, W, T);
      }
      return o;
    }, "draw") }), "banks");
    TILES.brume = banks("rgba(236,239,243,.3)", "244,246,249", 0.32);
    TILES.brume_marais = banks("rgba(228,236,228,.22)", "236,242,236", 0.34);
    TILES.chaleur = { w: T, h: T, n: 6, ms: 160, draw: /* @__PURE__ */ __name((k) => {
      let d = "";
      const gap = T / 7;
      for (let i = 0; i < 8; i++) {
        const y0 = T - (i * gap + gap * k / 6);
        let p = "";
        for (let x = 0; x <= T; x += 8) p += `${x ? "L" : "M"}${x},${r22(y0 + Math.sin(x / 128 * TAU + TAU * k / 6 + i) * 3.75)} `;
        d += p;
      }
      return line(d, 2.5, "rgba(255,244,220,.3)");
    }, "draw") };
    TILES.averse = { w: T, h: T, n: 8, ms: 100, draw: /* @__PURE__ */ __name((k) => {
      let d = "";
      for (let i = 0; i < 28; i++) {
        const s = hash(i, 13) < 0.5 ? 1 : 2;
        const len = (14 + hash(i, 14) * 8) * 1.25;
        d += wrapped(hash(i, 11) * T, hash(i, 12) * T + s * 4 * T * k / 8, 32, (x, y) => `M${r22(x)},${r22(y)} l-2.5,${r22(-len)} `);
      }
      return `<rect width="${T}" height="${T}" fill="rgba(120,170,140,.1)"/>` + line(d, 1.6, "rgba(190,215,225,.58)");
    }, "draw") };
    TILES.cendres = { w: T, h: T, n: 16, ms: 200, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 22; i++) {
        const ember = i % 5 === 0;
        const dir = ember ? -1 : 1;
        const x = hash(i, 21) * T + Math.sin(TAU * k / 16 + i) * 18;
        o += wrapped(x, hash(i, 22) * T + dir * T * k / 16, 6, (px, py) => ember ? `<rect x="${r22(px)}" y="${r22(py)}" width="3" height="3" rx="0.8" fill="rgb(255,150,70)" fill-opacity="${r22(0.9 * (0.6 + 0.4 * Math.sin(TAU * k / 4 + i)))}"/>` : `<rect x="${r22(px)}" y="${r22(py)}" width="3" height="2" rx="0.6" fill="rgba(90,84,80,.62)"/>`);
      }
      return o;
    }, "draw") };
    TILES.etoiles = { w: T, h: T, n: 4, ms: 400, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 10; i++) {
        const a = 0.5 + 0.5 * Math.sin(TAU * k / 4 + i * 3.1);
        o += `<rect x="${r22(hash(i, 21) * T)}" y="${r22(hash(i, 29) * T)}" width="2" height="2" rx="0.5" fill="rgb(255,248,220)" fill-opacity="${r22(a * 0.75)}"/>`;
      }
      return o;
    }, "draw") };
    var twinkleSoft = /* @__PURE__ */ __name((x, y, s) => `<path d="M${r22(x)},${r22(y - s)} Q${r22(x)},${r22(y)} ${r22(x + s)},${r22(y)} Q${r22(x)},${r22(y)} ${r22(x)},${r22(y + s)} Q${r22(x)},${r22(y)} ${r22(x - s)},${r22(y)} Q${r22(x)},${r22(y)} ${r22(x)},${r22(y - s)} Z" fill="#FFFFFF" stroke="rgba(150,175,210,.6)" stroke-width="0.3"/>`, "twinkleSoft");
    function flake(x, y, R, a) {
      let d = "";
      for (let b = 0; b < 6; b++) {
        const t = a + b * TAU / 6, c = Math.cos(t), s = Math.sin(t);
        d += `M${r22(x)},${r22(y)} L${r22(x + c * R)},${r22(y + s * R)} `;
        for (const side of [-1, 1]) {
          const m = 0.55, l = R * 0.32, u = t + side * 0.8;
          d += `M${r22(x + c * R * m)},${r22(y + s * R * m)} l${r22(Math.cos(u) * l)},${r22(Math.sin(u) * l)} `;
        }
      }
      return line(d, 2.6, "rgba(120,150,195,.45)") + line(d, 1.2, "rgba(255,255,255,.95)") + E(x, y, R * 0.16, R * 0.16, "#FFFFFF", 0);
    }
    __name(flake, "flake");
    TILES.flocons = { w: T, h: T, n: 16, ms: 200, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 18; i++) {
        const big = i % 3 === 0, R = big ? (5 + hash(i, 34) * 3) * 1.25 : (1.2 + hash(i, 34) * 1.4) * 1.25;
        const x = hash(i, 31) * T + Math.sin(TAU * k / 16 + i) * 12, y = hash(i, 32) * T + T * k / 16;
        o += wrapped(x, y, R + 4, (px, py) => big ? flake(px, py, R, hash(i, 33) * TAU + TAU / 6 * (k / 16)) : E(px, py, R + 0.8, R + 0.8, "rgba(120,150,195,.35)", 0) + E(px, py, R, R, "rgba(255,255,255,.95)", 0));
      }
      return o;
    }, "draw") };
    var LEAF = [["#E2703A", "#F2A06A", "#A8481E"], ["#C8463A", "#E07A6A", "#8E2E24"], ["#E8B04A", "#F4D27E", "#A87A22"], ["#A86A3A", "#C9935E", "#6E4424"]];
    function fallingLeaf(x, y, l, rot, sx, c) {
      const [face, revers, nerf] = c, f = sx < 0 ? revers : face;
      const leaf = `M0,${r22(-l / 2)} Q${r22(l * 0.42)},${r22(-l * 0.15)} ${r22(l * 0.12)},${r22(l * 0.38)} L0,${r22(l / 2)} L${r22(-l * 0.12)},${r22(l * 0.38)} Q${r22(-l * 0.42)},${r22(-l * 0.15)} 0,${r22(-l / 2)} Z`;
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)}) scale(${r22(sx)} 1)"><path d="${leaf}" fill="${f}" stroke="${nerf}" stroke-width="0.9" stroke-linejoin="round"/><path d="M0,${r22(-l / 2 + 1.4)} L0,${r22(l / 2 + 2.2)}" stroke="${nerf}" stroke-width="0.8" stroke-linecap="round"/><path d="M0,${r22(-l * 0.05)} l${r22(l * 0.2)},${r22(-l * 0.16)} M0,${r22(l * 0.16)} l${r22(-l * 0.2)},${r22(-l * 0.16)}" stroke="${nerf}" stroke-width="0.6" stroke-linecap="round" fill="none"/></g>`;
    }
    __name(fallingLeaf, "fallingLeaf");
    TILES.feuilles = { w: T, h: T, n: 16, ms: 200, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 9; i++) {
        const ph = TAU * k / 16 + i * 1.7, l = (13 + hash(i, 44) * 5) * 1.25;
        const x = hash(i, 41) * T + Math.sin(ph) * 18, y = hash(i, 42) * T + T * k / 16;
        const cs = Math.cos(ph * (i % 2 ? 1 : 2)), sx = Math.sign(cs || 1) * Math.max(0.35, Math.abs(cs));
        o += wrapped(x, y, l + 6, (px, py) => fallingLeaf(px, py, l, hash(i, 43) * 360 + Math.sin(ph) * 40, sx, LEAF[i % 4]));
      }
      return o;
    }, "draw") };
    function petal(x, y, l, rot, sx) {
      const d = `M0,${r22(l / 2)} Q${r22(-l * 0.5)},${r22(l * 0.05)} ${r22(-l * 0.18)},${r22(-l * 0.42)} L0,${r22(-l * 0.3)} L${r22(l * 0.18)},${r22(-l * 0.42)} Q${r22(l * 0.5)},${r22(l * 0.05)} 0,${r22(l / 2)} Z`;
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)}) scale(${r22(sx)} 1)"><path d="${d}" fill="${sx < 0 ? "#F9D3DE" : "#F4A9BF"}" stroke="rgba(176,86,112,.75)" stroke-width="0.7" stroke-linejoin="round"/><path d="M0,${r22(l * 0.32)} Q${r22(-l * 0.06)},0 0,${r22(-l * 0.18)}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="0.7" stroke-linecap="round"/></g>`;
    }
    __name(petal, "petal");
    TILES.petales = { w: T, h: T, n: 16, ms: 180, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 14; i++) {
        const ph = TAU * k / 16 + i * 2.1, l = (7 + hash(i, 54) * 3) * 1.25;
        const x = hash(i, 51) * T + T * k / 16 + Math.sin(ph) * 6, y = hash(i, 52) * T + T * k / 16 + Math.cos(ph) * 6;
        const cs = Math.cos(ph), sx = Math.sign(cs || 1) * Math.max(0.3, Math.abs(cs));
        o += wrapped(x, y, l + 6, (px, py) => petal(px, py, l, hash(i, 53) * 360 + 360 * k / 16, sx));
      }
      return o;
    }, "draw") };
    TILES.pollen = { w: T, h: T, n: 24, ms: 250, draw: /* @__PURE__ */ __name((k) => {
      let o = "";
      for (let i = 0; i < 16; i++) {
        const ph = TAU * k / 24 + i * 2.3, r = (0.9 + hash(i, 64) * 0.9) * 1.25, a = 0.55 + 0.45 * Math.sin(ph * 2);
        const x = hash(i, 61) * T + Math.sin(ph) * 10, y = hash(i, 62) * T - T * k / 24;
        o += wrapped(x, y, r * 4, (px, py) => E(px, py, r * 3.2, r * 3.2, `rgba(255,226,120,${r22(0.16 * a)})`, 0) + E(px, py, r, r, `rgba(255,232,140,${r22(0.6 + 0.4 * a)})`, 0) + E(px - r * 0.3, py - r * 0.3, r * 0.4, r * 0.4, `rgba(255,255,235,${r22(0.8 * a)})`, 0));
      }
      return o;
    }, "draw") };
    var SPR = {};
    var CLOUD_SHAPES = [
      [[0, 0, 46, 16], [-24, 3, 24, 12], [26, 4, 26, 11], [-4, -10, 26, 15]],
      [[0, 0, 40, 14], [-28, 4, 20, 10], [22, 2, 28, 13], [6, -11, 22, 14], [-14, -7, 16, 11]],
      [[0, 0, 52, 15], [-30, 3, 22, 11], [32, 4, 22, 10], [-8, -9, 24, 13], [16, -6, 18, 11]]
    ];
    var CLOUD_COLORS = { jour: ["#FFFFFF", "#E3EAF2"], dore: ["#FFE1CC", "#F2C2A8"], nuit: ["#8E9AC0", "#6E7AA4"], pluie: ["#B0B6BF", "#8E95A0"] };
    function cloud(shape, [top, under]) {
      const s = 1.25;
      const els = CLOUD_SHAPES[shape].map(([x, y, rx, ry]) => [x * s, y * s, rx * s, ry * s]);
      return `<g opacity="0.55">${els.map(([x, y, rx, ry]) => E(x, y, rx + 1.1, ry + 1.1, OUT, 0)).join("")}</g>` + els.map(([x, y, rx, ry]) => E(x, y, rx, ry, under, 0)).join("") + els.map(([x, y, rx, ry]) => E(x - rx * 0.06, y - ry * 0.18, rx * 0.94, ry * 0.8, top, 0)).join("");
    }
    __name(cloud, "cloud");
    for (let sh = 0; sh < 3; sh++) for (const [name, cols] of Object.entries(CLOUD_COLORS)) SPR[`nuage${sh + 1}_${name}`] = { group: "nuages", frame: [-80, -38, 160, 66], n: 1, draw: /* @__PURE__ */ __name(() => cloud(sh, cols), "draw") };
    SPR.ombre_nuage = { group: "nuages", frame: [-80, -38, 160, 66], n: 1, draw: /* @__PURE__ */ __name(() => `<g opacity="0.22">${CLOUD_SHAPES[0].map(([x, y, rx, ry]) => E(x * 1.5, y * 1.5, rx * 1.5, ry * 1.5, "rgb(30,50,40)", 0)).join("")}</g>`, "draw") };
    SPR.arc_en_ciel = { group: "ciel", frame: [-200, -205, 400, 210], n: 1, draw: /* @__PURE__ */ __name(() => ["#E2463A", "#F08A3A", "#F2C04B", "#7EC45B", "#5AAED7", "#5C6FC2", "#9C6FD0"].map((c, i) => {
      const r = 195 - i * 8.75;
      return line(`M${-r},0 A${r},${r} 0 0 1 ${r},0`, 8.75, c);
    }).join("").replace(/^/, '<g opacity="0.6">') + "</g>", "draw") };
    SPR.eclair = { group: "ciel", frame: [-50, -120, 100, 130], n: 2, draw: /* @__PURE__ */ __name((k) => {
      const bolt = "M6,-112 L-14,-58 L0,-58 L-16,-10 L-6,-10 L-12,8 L22,-34 L8,-34 L24,-76 L10,-76 L22,-112 Z";
      return (k ? "" : '<defs><radialGradient id="eclair-halo"><stop offset="0" stop-color="rgb(255,246,200)" stop-opacity=".7"/><stop offset=".5" stop-color="rgb(255,246,200)" stop-opacity=".25"/><stop offset="1" stop-color="rgb(255,246,200)" stop-opacity="0"/></radialGradient></defs><circle cx="2" cy="-52" r="48" fill="url(#eclair-halo)"/>') + P(bolt, k ? "#F2D27A" : "#FFF6C8", 1.6) + (k ? "" : line("M10,-104 L-6,-60", 1.6, "rgba(255,255,255,.9)"));
    }, "draw") };
    SPR.flash = { group: "ciel", frame: [0, 0, 640, 360], stretch: true, n: 1, draw: /* @__PURE__ */ __name(() => '<rect width="640" height="360" fill="rgb(240,244,255)" fill-opacity="0.42"/>', "draw") };
    var lowSun = /* @__PURE__ */ __name((cx, rgb) => () => `<defs><radialGradient id="s" cx="${cx}" cy="-0.05" r="1.05" gradientTransform="translate(${cx} -0.05) scale(0.5625 1) translate(${-cx} 0.05)"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity=".32"/><stop offset=".55" stop-color="rgb(${rgb})" stop-opacity=".1"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><rect width="640" height="360" fill="url(#s)"/>`, "lowSun");
    SPR.soleil_bas_matin = { group: "ciel", frame: [0, 0, 640, 360], stretch: true, n: 1, draw: lowSun(0.815, "255,214,150") };
    SPR.soleil_bas_soir = { group: "ciel", frame: [0, 0, 640, 360], stretch: true, n: 1, draw: lowSun(0.185, "255,158,112") };
    SPR.luciole = { group: "lumieres", frame: [-12, -12, 24, 24], n: 4, ms: 180, draw: /* @__PURE__ */ __name((k) => {
      const a = 0.5 + 0.5 * Math.sin(TAU * k / 4);
      return `<defs><radialGradient id="luciole-halo"><stop offset="0" stop-color="rgb(230,255,140)" stop-opacity="${r22(0.45 + 0.4 * a)}"/><stop offset="1" stop-color="rgb(230,255,140)" stop-opacity="0"/></radialGradient></defs><circle r="${r22(8 + 3 * a)}" fill="url(#luciole-halo)"/>` + E(0, 0, 2, 2, `rgba(250,255,190,${r22(0.6 + 0.4 * a)})`, 0);
    }, "draw") };
    SPR.halo_chaud = { group: "lumieres", frame: [-60, -60, 120, 120], n: 1, draw: /* @__PURE__ */ __name(() => '<defs><radialGradient id="h"><stop offset="0" stop-color="rgb(255,196,110)" stop-opacity=".55"/><stop offset=".4" stop-color="rgb(255,196,110)" stop-opacity=".22"/><stop offset="1" stop-color="rgb(255,196,110)" stop-opacity="0"/></radialGradient></defs><circle r="60" fill="url(#h)"/>', "draw") };
    SPR.plein_soleil = { group: "ciel", frame: [0, 0, 640, 360], stretch: true, n: 1, draw: /* @__PURE__ */ __name(() => {
      const sx = 520, sy = -40;
      const rays = [[2, 0.05], [2.2, 0.07], [2.4, 0.05], [2.6, 0.08], [2.8, 0.05]].map(([a, w], i) => {
        const L2 = 560, p1 = [sx + Math.cos(a - w) * L2, sy + Math.sin(a - w) * L2], p2 = [sx + Math.cos(a + w) * L2, sy + Math.sin(a + w) * L2];
        return `<path d="M${sx},${sy} L${r22(p1[0])},${r22(p1[1])} L${r22(p2[0])},${r22(p2[1])} Z" fill="url(#plein-soleil-rai)" opacity="${[0.5, 0.35, 0.45, 0.3, 0.4][i]}"/>`;
      }).join("");
      return `<defs><radialGradient id="plein-soleil" cx="${r22(sx / 640)}" cy="${r22(sy / 360)}" r="0.95" gradientTransform="translate(${r22(sx / 640)} ${r22(sy / 360)}) scale(0.5625 1) translate(${r22(-sx / 640)} ${r22(-sy / 360)})"><stop offset="0" stop-color="rgb(255,250,225)" stop-opacity=".55"/><stop offset=".35" stop-color="rgb(255,232,160)" stop-opacity=".22"/><stop offset="1" stop-color="rgb(255,232,160)" stop-opacity="0"/></radialGradient><radialGradient id="plein-soleil-rai" cx="${sx}" cy="${sy}" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="rgb(255,248,210)" stop-opacity=".5"/><stop offset="1" stop-color="rgb(255,248,210)" stop-opacity="0"/></radialGradient></defs><rect width="640" height="360" fill="url(#plein-soleil)"/>${rays}`;
    }, "draw") };
    var CASE = [-40, -20, 80, 40];
    var diamond = /* @__PURE__ */ __name((k = 1) => `M0,${r22(-20 * k)} L${r22(40 * k)},0 L0,${r22(20 * k)} L${r22(-40 * k)},0 Z`, "diamond");
    var inCase = /* @__PURE__ */ __name((g, n, m = 0.62) => {
      const out = [];
      for (let i = 0; out.length < n && i < 200; i++) {
        const x = (hash(g, i * 2) - 0.5) * 80, y = (hash(g, i * 2 + 1) - 0.5) * 40;
        if (Math.abs(x) / 40 + Math.abs(y) / 20 < m) out.push([x, y, i]);
      }
      return out;
    }, "inCase");
    var snowCover = /* @__PURE__ */ __name((g) => `<path d="${diamond()}" fill="#EEF4FA"/>` + inCase(g, 4, 0.55).map(([x, y, i]) => {
      const rx = 6 + hash(g, i + 50) * 6, ry = rx * 0.33;
      return E(x, y + ry * 0.2, rx, ry, "#E2EAF4", 0) + E(x - rx * 0.12, y - ry * 0.3, rx * 0.82, ry * 0.62, "#FBFDFF", 0);
    }).join("") + inCase(g + 7, 4, 0.7).map(([x, y]) => twinkleSoft(x, y, 1.5)).join(""), "snowCover");
    SPR.neige_sol_a = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => snowCover(71), "draw") };
    SPR.neige_sol_b = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => snowCover(72), "draw") };
    SPR.neige_sol_c = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => snowCover(73), "draw") };
    var snowPatches = /* @__PURE__ */ __name((g) => inCase(g, 4, 0.56).map(([x, y, i]) => {
      const rx = 6 + hash(g, i + 30) * 7, ry = rx * 0.42;
      return `<path d="M${r22(x - rx)},${r22(y)} Q${r22(x - rx * 0.8)},${r22(y - ry)} ${r22(x)},${r22(y - ry * 0.9)} Q${r22(x + rx * 0.9)},${r22(y - ry * 1.1)} ${r22(x + rx)},${r22(y)} Q${r22(x + rx * 0.6)},${r22(y + ry)} ${r22(x - rx * 0.1)},${r22(y + ry * 0.85)} Q${r22(x - rx * 0.9)},${r22(y + ry * 0.9)} ${r22(x - rx)},${r22(y)} Z" fill="#EAF1F8" stroke="rgba(170,190,215,.7)" stroke-width="0.7"/>` + E(x - rx * 0.2, y - ry * 0.3, rx * 0.55, ry * 0.4, "#FAFCFF", 0);
    }).join("") + inCase(g + 3, 2, 0.5).map(([x, y]) => twinkleSoft(x, y, 1.3)).join(""), "snowPatches");
    SPR.neige_fondante_a = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => snowPatches(81), "draw") };
    SPR.neige_fondante_b = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => snowPatches(82), "draw") };
    SPR.givre = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => `<path d="${diamond()}" fill="rgba(236,244,255,.38)"/>` + [[-20, -1, 3.2], [-6, -8, 2.4], [8, 6, 3.4], [22, -2, 2.6], [-8, 8, 2.2], [4, -3, 1.8]].map(([x, y, r], i) => {
      let d = "";
      for (let b = 0; b < 6; b++) {
        const a = b * TAU / 6 + i * 0.4;
        d += `M${x},${y} l${r22(Math.cos(a) * r)},${r22(Math.sin(a) * r * 0.55)} `;
      }
      return line(d, 0.7, "rgba(255,255,255,.95)");
    }).join("") + line("M-30,2 l5,-1.6 M-26,4 l4,-2.2 M26,6 l-5,-1.4 M30,1 l-4,-2", 0.6, "rgba(255,255,255,.8)"), "draw") };
    function puddle(rx, ry, rings = -1) {
      const d = `M${r22(-rx)},0 Q${r22(-rx * 0.9)},${r22(-ry * 1.05)} ${r22(-rx * 0.1)},${r22(-ry)} Q${r22(rx * 0.7)},${r22(-ry * 1.15)} ${r22(rx)},${r22(-ry * 0.1)} Q${r22(rx * 0.95)},${r22(ry * 0.95)} ${r22(rx * 0.1)},${r22(ry)} Q${r22(-rx * 0.8)},${r22(ry * 1.05)} ${r22(-rx)},0 Z`;
      let o = `<path d="${d}" transform="scale(1.12 1.18)" fill="rgba(70,90,80,.28)"/><path d="${d}" fill="#8DB8D4" stroke="rgba(60,80,90,.55)" stroke-width="0.8"/><path d="M${r22(-rx * 0.55)},${r22(-ry * 0.35)} Q${r22(-rx * 0.1)},${r22(-ry * 0.6)} ${r22(rx * 0.35)},${r22(-ry * 0.45)}" fill="none" stroke="rgba(235,248,255,.85)" stroke-width="1.2" stroke-linecap="round"/><path d="M${r22(rx * 0.1)},${r22(ry * 0.35)} L${r22(rx * 0.45)},${r22(ry * 0.25)}" fill="none" stroke="rgba(235,248,255,.6)" stroke-width="0.9" stroke-linecap="round"/>`;
      if (rings >= 0) for (const [x, y, ph] of [[-rx * 0.4, ry * 0.1, 0], [rx * 0.35, -ry * 0.2, 2], [rx * 0.05, ry * 0.4, 1]]) {
        const t = (rings + ph) % 4 / 4, R = 1 + t * rx * 0.35;
        o += E(x, y, R, R * 0.45, "none", 0).replace('stroke="none"', `stroke="rgba(240,250,255,${r22(0.9 * (1 - t))})" stroke-width="0.8"`);
      }
      return o;
    }
    __name(puddle, "puddle");
    SPR.flaque_petite = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => puddle(13, 5.5), "draw") };
    SPR.flaque_grande = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => puddle(24, 9.5), "draw") };
    SPR.flaque_pluie = { group: "sol", frame: CASE, n: 4, ms: 220, draw: /* @__PURE__ */ __name((k) => puddle(24, 9.5, k), "draw") };
    var ICE = { clair: "#D8EEF7", mi: "#B6DCEC", fond: "#8EC3DB", fissure: "rgba(255,255,255,.9)" };
    function ice(g, neige = false) {
      let o = `<path d="${diamond()}" fill="${ICE.mi}"/>`;
      const [[cx, cy]] = inCase(g, 1, 0.3);
      const br = [0, 1, 2].map((b) => {
        const a = hash(g, b + 9) * TAU, l = 9 + hash(g, b + 12) * 9;
        let d = `M${r22(cx)},${r22(cy)}`, x = cx, y = cy;
        for (let i = 1; i <= 3; i++) {
          x += Math.cos(a + (hash(g, b * 5 + i) - 0.5) * 0.9) * l / 3;
          y += Math.sin(a + (hash(g, b * 5 + i) - 0.5) * 0.9) * l / 6;
          if (Math.abs(x) / 40 + Math.abs(y) / 20 > 0.8) break;
          d += ` L${r22(x)},${r22(y)}`;
        }
        return d;
      }).join(" ");
      o += line(br, 1.6, "rgba(120,170,200,.45)") + line(br, 0.7, ICE.fissure);
      const [[rx0, ry0]] = inCase(g + 3, 1, 0.45);
      o += line(`M${r22(rx0 - 5)},${r22(ry0 + 3)} L${r22(rx0 + 5)},${r22(ry0 - 3)} M${r22(rx0 - 1)},${r22(ry0 + 5)} L${r22(rx0 + 5)},${r22(ry0 + 1.4)}`, 1.3, "rgba(255,255,255,.7)");
      o += inCase(g + 5, 3, 0.55).map(([x, y], i) => E(x, y, 0.9 + i % 2 * 0.5, 0.6 + i % 2 * 0.3, "rgba(255,255,255,.7)", 0)).join("");
      if (neige) o += inCase(g + 11, 4, 0.6).map(([x, y, i]) => {
        const rx = 4 + hash(g, i + 40) * 5;
        return E(x, y, rx, rx * 0.36, "rgba(250,252,255,.92)", 0) + E(x - rx * 0.2, y - 0.4, rx * 0.5, rx * 0.16, "#FFFFFF", 0);
      }).join("") + [[-26, 4], [14, -10], [28, 0]].map(([x, y]) => twinkleSoft(x, y, 1.3)).join("");
      return o;
    }
    __name(ice, "ice");
    SPR.glace_a = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => ice(91), "draw") };
    SPR.glace_b = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => ice(92), "draw") };
    SPR.glace_c = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => ice(93), "draw") };
    SPR.glace_neige = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => ice(94, true), "draw") };
    SPR.flaque_gelee = { group: "sol", frame: CASE, n: 1, draw: /* @__PURE__ */ __name(() => {
      const rx = 24, ry = 9.5;
      const d = `M${r22(-rx)},0 Q${r22(-rx * 0.9)},${r22(-ry * 1.05)} ${r22(-rx * 0.1)},${r22(-ry)} Q${r22(rx * 0.7)},${r22(-ry * 1.15)} ${r22(rx)},${r22(-ry * 0.1)} Q${r22(rx * 0.95)},${r22(ry * 0.95)} ${r22(rx * 0.1)},${r22(ry)} Q${r22(-rx * 0.8)},${r22(ry * 1.05)} ${r22(-rx)},0 Z`;
      return `<path d="${d}" transform="scale(1.12 1.18)" fill="rgba(235,244,255,.7)"/><path d="${d}" fill="${ICE.mi}" stroke="rgba(110,150,175,.6)" stroke-width="0.8"/>` + E(2, 1.5, rx * 0.6, ry * 0.5, ICE.fond, 0).replace("/>", ' opacity="0.5"/>') + line("M-6,-2 L0,1 L7,-1.4 M0,1 L2,6 M-6,-2 L-12,1", 1.4, "rgba(120,170,200,.45)") + line("M-6,-2 L0,1 L7,-1.4 M0,1 L2,6 M-6,-2 L-12,1", 0.6, ICE.fissure) + line(`M${r22(-rx * 0.55)},${r22(-ry * 0.35)} L${r22(-rx * 0.2)},${r22(-ry * 0.62)}`, 1.2, "rgba(255,255,255,.85)") + twinkleSoft(rx * 0.45, -ry * 0.3, 1.4);
    }, "draw") };
    var SAISONS = {
      printemps: { nom: "Printemps", teinte: "rgba(255,214,226,.1)", air: ["petales", "pollen"], sol: ["flaque_petite", "flaque_grande", "flaque_pluie"] },
      ete: { nom: "Été", teinte: "rgba(255,228,150,.12)", air: ["pollen"], ciel: ["plein_soleil"] },
      automne: { nom: "Automne", teinte: "rgba(226,142,72,.14)", air: ["feuilles"], sol: ["flaque_petite", "flaque_grande", "flaque_pluie"] },
      hiver: { nom: "Hiver", teinte: "rgba(196,216,255,.18)", air: ["flocons"], sol: ["neige_sol_a", "neige_sol_b", "neige_sol_c", "neige_fondante_a", "neige_fondante_b", "givre", "flaque_gelee"], eau: ["glace_a", "glace_b", "glace_c", "glace_neige"] }
    };
    var NIGHT = { tint: "#5A68A6", sea: ["#1D3557", "#13263F"], night: 1, warm: 0 };
    var MOMENTS = [
      ["nuit", "Nuit", "au lever − 2 h, et au coucher + 1 h 36", NIGHT],
      ["aube_1", "Aube (tôt)", "au lever − 48 min", { tint: "#6E7CB6", sea: ["#2E4A78", "#1B3354"], night: 0.8, warm: 0.1 }],
      ["aube_2", "Aube", "au lever − 12 min", { tint: "#D0A9B4", sea: ["#9FA8CC", "#4C6E96"], night: 0.3, warm: 0.6 }],
      ["matin_1", "Matin doré", "au lever + 27 min", { tint: "#FFDCA6", sea: ["#F2CFA0", "#4F8FBF"], night: 0, warm: 1 }],
      ["matin_2", "Matin", "au lever + 2 h 12", { tint: "#FFF5E4", sea: ["#7CC4E6", "#3E8DBF"], night: 0, warm: 0.15 }],
      ["midi", "Midi", "midi solaire", { tint: "#FFFFFF", sea: ["#6CC0E6", "#3E8DBF"], night: 0, warm: 0 }],
      ["apres_midi_1", "Après-midi", "au coucher − 3 h", { tint: "#FFF7EA", sea: ["#72C2E4", "#3E8BBC"], night: 0, warm: 0.1 }],
      ["apres_midi_2", "Fin d'après-midi", "au coucher − 1 h 12", { tint: "#FFE3B2", sea: ["#90C6DE", "#3E86B8"], night: 0, warm: 0.5 }],
      ["couchant", "Couchant", "au coucher − 9 min", { tint: "#FFBA88", sea: ["#F2AA82", "#3C6F9E"], night: 0.05, warm: 1 }],
      ["crepuscule_1", "Crépuscule rosé", "au coucher + 24 min", { tint: "#EEA4C0", sea: ["#C88AB0", "#2F5684"], night: 0.3, warm: 0.8 }],
      ["crepuscule_2", "Crépuscule", "au coucher + 57 min", { tint: "#8C80C4", sea: ["#4A4E8E", "#22355C"], night: 0.7, warm: 0.3 }]
    ];
    var WEATHERS = {
      clair: { label: "Ciel clair", cover: 0, rain: 0, storm: 0, mist: 0 },
      voile: { label: "Ciel voilé", cover: 0.72, rain: 0, storm: 0, mist: 0 },
      brume: { label: "Brume", cover: 0.35, rain: 0, storm: 0, mist: 1 },
      pluie: { label: "Pluie", cover: 0.92, rain: 1, storm: 0, mist: 0.25 },
      orage: { label: "Orage", cover: 1, rain: 1, storm: 1, mist: 0 }
    };
    var CLIMATES = {
      cimes: { nom: "Les Cimes", teinte: "rgba(200,222,255,.16)", air: "neige" },
      landes: { nom: "Les Landes", teinte: "rgba(170,160,190,.12)", air: "rafales" },
      marais: { nom: "Le Marais", teinte: "rgba(150,175,140,.16)", air: "brume_marais" },
      dunes: { nom: "Les Dunes", teinte: "rgba(255,210,140,.15)", air: "chaleur" },
      jungle: { nom: "La Jungle", teinte: "rgba(90,160,110,.14)", air: "averse" },
      volcan: { nom: "Le Volcan", teinte: "rgba(120,60,50,.2)", air: "cendres" }
    };
    var SUN = "#F2B23C";
    var SUN_L = "#FFD77A";
    var sun = /* @__PURE__ */ __name((x, y, r, rays = true) => (rays ? Array.from({ length: 8 }, (_, i) => {
      const a = i / 8 * TAU;
      return tk(`M${r22(x + Math.cos(a) * (r + 3))},${r22(y + Math.sin(a) * (r + 3))} L${r22(x + Math.cos(a) * (r + 7))},${r22(y + Math.sin(a) * (r + 7))}`, 1.6, SUN);
    }).join("") : "") + E(x, y, r, r, SUN, 1.3) + E(x - r * 0.3, y - r * 0.3, r * 0.42, r * 0.42, SUN_L, 0), "sun");
    var cloudIcon = /* @__PURE__ */ __name((x, y, s, fill = "#F4F6FA", under = "#D6DCE4") => {
      const parts = [[0, 0, 13, 8], [-9, 2, 7, 6], [9, 2, 8, 6], [-2, -5, 8, 7], [5, -3, 6, 5]].map(([a, b, rx, ry]) => [x + a * s, y + b * s, rx * s, ry * s]);
      return parts.map(([a, b, rx, ry]) => E(a, b, rx + 1.3, ry + 1.3, OUT, 0)).join("") + parts.map(([a, b, rx, ry]) => E(a, b, rx, ry, under, 0)).join("") + parts.map(([a, b, rx, ry]) => E(a - rx * 0.05, b - ry * 0.2, rx * 0.92, ry * 0.75, fill, 0)).join("");
    }, "cloudIcon");
    var moon = /* @__PURE__ */ __name((x, y, r) => P(`M${x + r * 0.3},${y - r} A${r},${r} 0 1 0 ${x + r},${y + r * 0.45} A${r * 0.78},${r * 0.78} 0 1 1 ${x + r * 0.3},${y - r} Z`, "#F4ECD0", 1.3), "moon");
    var twinkle = /* @__PURE__ */ __name((x, y, s) => P(`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`, "#FFF3C4", 0.7), "twinkle");
    var horizon = /* @__PURE__ */ __name((y, c = "#7EC45B") => P(`M2,${y} Q24,${y - 3} 46,${y} L46,46 L2,46 Z`, c, 1.3), "horizon");
    var panel = /* @__PURE__ */ __name((id, c, body) => `<defs><clipPath id="${id}"><rect x="1.5" y="1.5" width="45" height="45" rx="11"/></clipPath></defs><g clip-path="url(#${id})"><rect x="1.5" y="1.5" width="45" height="45" fill="${c}"/>${body}</g><rect x="1.5" y="1.5" width="45" height="45" rx="11" fill="none" stroke="${OUT}" stroke-width="1.3"/>`, "panel");
    var ICONS = {
      // Temps
      clair: /* @__PURE__ */ __name(() => sun(24, 24, 9), "clair"),
      voile: /* @__PURE__ */ __name(() => sun(30, 17, 7) + cloudIcon(21, 29, 1.15), "voile"),
      brume: /* @__PURE__ */ __name(() => sun(24, 17, 7, false) + tk("M7,28 H33 M13,34 H41 M7,40 H29", 2.4, "#C6CDD6"), "brume"),
      pluie: /* @__PURE__ */ __name(() => cloudIcon(24, 19, 1.25, "#E6EAF0", "#BFC6D0") + tk("M15,33 l-2,6 M24,33 l-2,6 M33,33 l-2,6", 1.6, "#5AAED7"), "pluie"),
      orage: /* @__PURE__ */ __name(() => cloudIcon(24, 18, 1.25, "#9AA2B2", "#7D8696") + P("M25,26 L18,37 H24 L20,46 L31,33 H25 L29,26 Z", "#F2C04B", 1.2), "orage"),
      arc_en_ciel: /* @__PURE__ */ __name(() => ["#E2463A", "#F2C04B", "#7EC45B", "#5AAED7", "#9C6FD0"].map((c, i) => line(`M${6 + i * 2.6},36 A${18 - i * 2.6},${18 - i * 2.6} 0 0 1 ${42 - i * 2.6},36`, 2.6, c)).join("") + cloudIcon(10.4, 37, 0.55) + cloudIcon(37.2, 37, 0.55), "arc_en_ciel"),
      // Moments
      nuit: /* @__PURE__ */ __name(() => panel("ic-nuit", "#2B3566", moon(22, 22, 10) + twinkle(36, 12, 3.4) + twinkle(36, 32, 2.4) + twinkle(10, 38, 2)), "nuit"),
      aube: /* @__PURE__ */ __name(() => panel("ic-aube", "#B9A6D2", sun(24, 34, 8) + horizon(35, "#6E9F72") + twinkle(39, 10, 2.4)), "aube"),
      matin: /* @__PURE__ */ __name(() => panel("ic-matin", "#FFE7C2", sun(19, 26, 7) + horizon(37)), "matin"),
      midi: /* @__PURE__ */ __name(() => panel("ic-midi", "#CDEBFA", sun(24, 19, 7) + horizon(38)), "midi"),
      apres_midi: /* @__PURE__ */ __name(() => panel("ic-apres-midi", "#E2F1F7", sun(30, 22, 7) + horizon(38)), "apres_midi"),
      couchant: /* @__PURE__ */ __name(() => panel("ic-couchant", "#FFC59E", sun(24, 36, 9) + horizon(35, "#7E8F5B") + tk("M6,24 H14 M34,24 H42", 1.4, "#F08A3A")), "couchant"),
      crepuscule: /* @__PURE__ */ __name(() => panel("ic-crepuscule", "#8C80C4", E(24, 39, 13, 6, "#EEA4C0", 0) + horizon(38, "#4E5E6E") + twinkle(14, 14, 2.8) + twinkle(33, 10, 2) + twinkle(38, 22, 1.6)), "crepuscule"),
      // Climats
      cimes: /* @__PURE__ */ __name(() => P("M3,42 L18,14 L26,26 L32,18 L45,42 Z", "#A8B4C8") + P("M14,21 L18,14 L22,21 L20,23 L18,21 L16,23 Z", "#FFFFFF", 0.9) + P("M29,23 L32,18 L35,23 L33,25 L32,23 L31,25 Z", "#FFFFFF", 0.9) + tk("M36,6 V16 M31,8.5 L41,13.5 M31,13.5 L41,8.5", 1.2, "#FFFFFF"), "cimes"),
      landes: /* @__PURE__ */ __name(() => tk("M6,16 H28 q8,0 8,-5 q0,-5 -5,-5 q-4,0 -4,4", 2.2, "#9FB4C8") + tk("M4,26 H36 q7,0 7,5 q0,5 -5,5 q-4,0 -4,-4", 2.2, "#9FB4C8") + tk("M10,36 H22", 2.2, "#9FB4C8"), "landes"),
      marais: /* @__PURE__ */ __name(() => E(24, 38, 20, 6, "#7FB6A8", 1.3) + [12, 18, 30, 36].map((x, i) => tk(`M${x},38 L${x + (i % 2 ? 1 : -1)},${16 + i * 2}`, 1.4, "#6E9A44") + E(x + (i % 2 ? 1 : -1), 18 + i * 2, 1.8, 4, "#8A5A2E", 0.9)).join("") + tk("M6,28 H20 M26,24 H42", 2.4, "rgba(236,242,236,.95)"), "marais"),
      dunes: /* @__PURE__ */ __name(() => sun(33, 15, 5) + P("M2,38 Q14,22 26,32 Q34,26 46,30 L46,46 L2,46 Z", "#F2C77A") + P("M2,44 Q18,32 34,40 Q40,37 46,38 L46,46 L2,46 Z", "#E2A855", 1.1), "dunes"),
      jungle: /* @__PURE__ */ __name(() => P("M24,44 Q8,34 10,16 Q22,10 30,4 Q42,20 24,44 Z", "#5FAE5A") + line("M24,44 Q22,26 28,8", 1.4, "#2F7A3A") + line("M23,34 L14,28 M24,26 L15,19 M25,30 L33,22 M26,20 L32,14", 1, "#2F7A3A") + tk("M40,26 l-1.4,4 M36,34 l-1.4,4 M42,38 l-1.4,4", 1.3, "#5AAED7"), "jungle"),
      volcan: /* @__PURE__ */ __name(() => P("M4,44 L18,16 L30,16 L44,44 Z", "#6E625A") + P("M18,16 L21,24 L24,19 L27,25 L30,16 Z", "#E8573A", 1) + P("M22,19 L24,30 L26,19", "#F2A35A", 0) + E(20, 9, 4, 3, "rgba(120,112,108,.8)", 0.9) + E(27, 6, 3.4, 2.6, "rgba(150,142,138,.8)", 0.9), "volcan")
    };
    var blossom = /* @__PURE__ */ __name((x, y, r) => Array.from({ length: 5 }, (_, i) => {
      const a = i / 5 * TAU - Math.PI / 2, cx = x + Math.cos(a) * r * 0.62, cy = y + Math.sin(a) * r * 0.62;
      return `<g transform="translate(${r22(cx)} ${r22(cy)}) rotate(${r22(a * 180 / Math.PI + 90)})">${P(`M0,${r22(r * 0.5)} Q${r22(-r * 0.62)},${r22(r * 0.1)} ${r22(-r * 0.26)},${r22(-r * 0.5)} L0,${r22(-r * 0.36)} L${r22(r * 0.26)},${r22(-r * 0.5)} Q${r22(r * 0.62)},${r22(r * 0.1)} 0,${r22(r * 0.5)} Z`, "#F6B6C8", 1.1)}</g>`;
    }).join("") + E(x, y, r * 0.3, r * 0.3, "#F2C04B", 1) + [0, 1, 2, 3, 4].map((i) => {
      const a = i / 5 * TAU - Math.PI / 2 + 0.6;
      return E(x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42, 0.9, 0.9, "#E2703A", 0);
    }).join(""), "blossom");
    var maple = /* @__PURE__ */ __name((x, y, s, c, d) => P(`M${x},${r22(y - 16 * s)} L${r22(x + 3 * s)},${r22(y - 9 * s)} L${r22(x + 9 * s)},${r22(y - 12 * s)} L${r22(x + 7 * s)},${r22(y - 5 * s)} L${r22(x + 14 * s)},${r22(y - 4 * s)} L${r22(x + 9 * s)},${r22(y + 1 * s)} L${r22(x + 11 * s)},${r22(y + 5 * s)} L${r22(x + 2 * s)},${r22(y + 3 * s)} L${x},${r22(y + 7 * s)} L${r22(x - 2 * s)},${r22(y + 3 * s)} L${r22(x - 11 * s)},${r22(y + 5 * s)} L${r22(x - 9 * s)},${r22(y + 1 * s)} L${r22(x - 14 * s)},${r22(y - 4 * s)} L${r22(x - 7 * s)},${r22(y - 5 * s)} L${r22(x - 9 * s)},${r22(y - 12 * s)} L${r22(x - 3 * s)},${r22(y - 9 * s)} Z`, c, 1.2) + line(`M${x},${r22(y + 13 * s)} L${x},${r22(y - 12 * s)} M${x},${r22(y - 1 * s)} L${r22(x + 9 * s)},${r22(y - 3.5 * s)} M${x},${r22(y - 1 * s)} L${r22(x - 9 * s)},${r22(y - 3.5 * s)} M${x},${r22(y - 6 * s)} L${r22(x + 5 * s)},${r22(y - 10 * s)} M${x},${r22(y - 6 * s)} L${r22(x - 5 * s)},${r22(y - 10 * s)}`, 1, d), "maple");
    var snowIcon = /* @__PURE__ */ __name((x, y, R) => {
      let dd = "";
      for (let b = 0; b < 6; b++) {
        const t = b * TAU / 6 - Math.PI / 2, c = Math.cos(t), s = Math.sin(t);
        dd += `M${x},${y} L${r22(x + c * R)},${r22(y + s * R)} `;
        for (const side of [-1, 1]) {
          const u = t + side * 0.75;
          dd += `M${r22(x + c * R * 0.58)},${r22(y + s * R * 0.58)} l${r22(Math.cos(u) * R * 0.3)},${r22(Math.sin(u) * R * 0.3)} `;
        }
      }
      return tk(dd, 2, "#E8F2FC") + E(x, y, 2.4, 2.4, "#FFFFFF", 1);
    }, "snowIcon");
    Object.assign(ICONS, {
      printemps: /* @__PURE__ */ __name(() => blossom(24, 22, 15) + P("M30,40 Q36,33 44,34 Q40,42 30,40 Z", "#7EC45B", 1.1) + line("M31,39.5 Q37,36 42,35.5", 0.8, "#4F8F3A"), "printemps"),
      ete: /* @__PURE__ */ __name(() => sun(24, 18, 8) + P("M2,34 Q8,30 14,34 Q20,38 26,34 Q32,30 38,34 Q42,37 46,34 L46,46 L2,46 Z", "#5AAED7", 1.2) + line("M8,40 Q12,38 16,40 M28,41 Q32,39 36,41", 1, "#BFE3F4"), "ete"),
      automne: /* @__PURE__ */ __name(() => maple(24, 23, 1.25, "#E2703A", "#A8481E"), "automne"),
      hiver: /* @__PURE__ */ __name(() => snowIcon(24, 24, 17), "hiver")
    });
    var ICON_GROUPS = { temps: ["clair", "voile", "brume", "pluie", "orage", "arc_en_ciel"], moments: ["nuit", "aube", "matin", "midi", "apres_midi", "couchant", "crepuscule"], climats: ["cimes", "landes", "marais", "dunes", "jungle", "volcan"], saisons: ["printemps", "ete", "automne", "hiver"] };
    module.exports = { TILES, SPR, MOMENTS, WEATHERS, CLIMATES, SAISONS, ICONS, ICON_GROUPS, T };
  }
});

// atelier/generateur_meteo.mjs
var import_meteo = __toESM(require_meteo(), 1);
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var svgOf = /* @__PURE__ */ __name((vb, body, stretch = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(" ")}"${stretch ? ' preserveAspectRatio="none"' : ""}>${body}</svg>`, "svgOf");
var ECRAN = [0, 0, 640, 360];
var plein = /* @__PURE__ */ __name((c) => `<rect width="640" height="360" fill="${c}"/>`, "plein");
var GROUPES_TUILES = { pluie_jour: "temps", pluie_nuit: "temps", brume: "temps", neige: "climats", rafales: "climats", brume_marais: "climats", chaleur: "climats", averse: "climats", cendres: "climats", etoiles: "ciel", flocons: "saisons", feuilles: "saisons", petales: "saisons", pollen: "saisons" };
var METEO = {
  tuiles: Object.fromEntries(Object.entries(import_meteo.default.TILES).map(([id, t]) => [id, { groupe: GROUPES_TUILES[id], images: t.n, tuile: [t.w, t.h], ms_par_image: t.ms }])),
  sprites: Object.fromEntries(Object.entries(import_meteo.default.SPR).map(([id, s]) => [id, { groupe: s.group, images: s.n, cadre: s.frame, etirer: !!s.stretch }])),
  moments: import_meteo.default.MOMENTS.map(([id]) => id),
  climats: Object.keys(import_meteo.default.CLIMATES),
  saisons: Object.keys(import_meteo.default.SAISONS),
  icones: import_meteo.default.ICON_GROUPS
};
var verifie = /* @__PURE__ */ __name((table, quoi, id) => {
  if (!table[id]) throw new Error(`${quoi} inconnu : ${id} (${Object.keys(table).join(", ")})`);
  return table[id];
}, "verifie");
var image = /* @__PURE__ */ __name((n, max) => {
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
}, "image");
function tuile(id, n = 1) {
  const t = verifie(import_meteo.default.TILES, "calque", id);
  image(n, t.n);
  return { svg: svgOf([0, 0, t.w, t.h], t.draw(n - 1)), cadre: [0, 0, t.w, t.h], ms_par_image: t.ms };
}
__name(tuile, "tuile");
function sprite(id, n = 1) {
  const s = verifie(import_meteo.default.SPR, "dessin", id);
  image(n, s.n);
  return { svg: svgOf(s.frame, s.draw(n - 1), s.stretch), cadre: s.frame, ms_par_image: s.n > 1 ? s.ms || 300 : null };
}
__name(sprite, "sprite");
function teinte(sorte, id) {
  const couleur = sorte === "moments" ? (import_meteo.default.MOMENTS.find((m) => m[0] === id) || [])[3]?.tint : sorte === "climats" ? import_meteo.default.CLIMATES[id]?.teinte : sorte === "saisons" ? import_meteo.default.SAISONS[id]?.teinte : null;
  if (!["moments", "climats", "saisons"].includes(sorte)) throw new Error(`teinte : ${sorte} (moments, climats ou saisons)`);
  if (!couleur) throw new Error(`teinte ${sorte} inconnue : ${id} (${METEO[sorte].join(", ")})`);
  return { svg: svgOf(ECRAN, plein(couleur), true), cadre: ECRAN, ms_par_image: null };
}
__name(teinte, "teinte");
function mer(id) {
  const m = import_meteo.default.MOMENTS.find((x) => x[0] === id);
  if (!m) throw new Error(`moment inconnu : ${id} (${METEO.moments.join(", ")})`);
  const [haut, bas] = m[3].sea;
  return { svg: svgOf(ECRAN, `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs><rect width="640" height="360" fill="url(#m)"/>`, true), cadre: ECRAN, ms_par_image: null };
}
__name(mer, "mer");
function icone(groupe, id) {
  const ids = verifie(import_meteo.default.ICON_GROUPS, "groupe", groupe);
  if (!ids.includes(id)) throw new Error(`icône inconnue : ${id} (${ids.join(", ")})`);
  return { svg: svgOf([0, 0, 48, 48], import_meteo.default.ICONS[id]()), cadre: [0, 0, 48, 48], ms_par_image: null };
}
__name(icone, "icone");
function liste() {
  const out = [], f = /* @__PURE__ */ __name((rel) => `meteo/${rel}`, "f");
  for (const [id, t] of Object.entries(import_meteo.default.TILES)) for (let n = 1; n <= t.n; n++) out.push({ fichier: f(`${GROUPES_TUILES[id]}/${id}_${n}.svg`), fonction: "tuile", args: [id, n] });
  for (const [id, s] of Object.entries(import_meteo.default.SPR)) for (let n = 1; n <= s.n; n++) out.push({ fichier: f(`${s.group}/${id}${s.n > 1 ? `_${n}` : ""}.svg`), fonction: "sprite", args: [id, n] });
  for (const [id] of import_meteo.default.MOMENTS) out.push({ fichier: f(`moments/teinte_${id}.svg`), fonction: "teinte", args: ["moments", id] }, { fichier: f(`moments/mer_${id}.svg`), fonction: "mer", args: [id] });
  for (const id of Object.keys(import_meteo.default.CLIMATES)) out.push({ fichier: f(`climats/teinte_${id}.svg`), fonction: "teinte", args: ["climats", id] });
  for (const id of Object.keys(import_meteo.default.SAISONS)) out.push({ fichier: f(`saisons/teinte_${id}.svg`), fonction: "teinte", args: ["saisons", id] });
  for (const [g, ids] of Object.entries(import_meteo.default.ICON_GROUPS)) for (const id of ids) out.push({ fichier: f(`icones/${g}/${id}.svg`), fonction: "icone", args: [g, id] });
  return out;
}
__name(liste, "liste");
export {
  GROUPES_TUILES,
  METEO,
  icone,
  liste,
  mer,
  sprite,
  teinte,
  tuile
};
