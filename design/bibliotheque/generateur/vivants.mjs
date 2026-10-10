// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_vivants.mjs : ne pas modifier à la main.
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

// atelier/brume.js
var require_brume = __commonJS({
  "atelier/brume.js"(exports, module) {
    var { P, E, L, eyes, drop, zee, r2 } = require_troupe2();
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
      return `M${r2(x)},${r2(y + r)} C${r2(x + r * 1.3)},${r2(y + r)} ${r2(x + r * 1.15)},${r2(y - r * 0.45)} ${r2(x + sway)},${r2(y - top)} C${r2(x - r * 1.15)},${r2(y - r * 0.45)} ${r2(x - r * 1.3)},${r2(y + r)} ${r2(x)},${r2(y + r)} Z`;
    }
    __name(flamePath, "flamePath");
    var star4 = /* @__PURE__ */ __name((x, y, s, fill) => P(`M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.22)},${r2(y - s * 0.22)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.22)},${r2(y + s * 0.22)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.22)},${r2(y + s * 0.22)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.22)},${r2(y - s * 0.22)} ${r2(x)},${r2(y - s)} Z`, fill, 0.6), "star4");
    var RUNES = ["M-1,-1.6 L-1,1.6 M-1,-1.6 L1,-0.4 L-1,0.6 L1,1.6", "M0,-1.6 L0,1.6 M-1.2,-1.4 L0,-0.2 L1.2,-1.4", "M-1.2,1.6 L0,-1.6 L1.2,1.6 M-0.7,0.2 L0.7,0.2"];
    var rune = /* @__PURE__ */ __name((x, y, i, color) => `<path d="${RUNES[i % 3]}" transform="translate(${r2(x)} ${r2(y)})" fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>`, "rune");
    var leaf = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})${s === 1 ? "" : ` scale(${s})`}">${P("M0,-3.6 Q2.4,0 0,3.6 Q-2.4,0 0,-3.6 Z", "#4FB062", 0.7)}${L([0, -2.6], [0, 2.6], "#2F7A3F", 0.5)}</g>`, "leaf");
    var heart = /* @__PURE__ */ __name((x, y, s) => P(`M${r2(x)},${r2(y + s * 1.1)} C${r2(x - s * 1.8)},${r2(y - s * 0.1)} ${r2(x - s * 0.9)},${r2(y - s * 1.4)} ${r2(x)},${r2(y - s * 0.5)} C${r2(x + s * 0.9)},${r2(y - s * 1.4)} ${r2(x + s * 1.8)},${r2(y - s * 0.1)} ${r2(x)},${r2(y + s * 1.1)} Z`, "#F29A3B", 0.7), "heart");
    var crown = /* @__PURE__ */ __name((x, y, rot) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">` + P("M-4,1.4 L-4.4,-2.2 L-2,-0.4 L0,-3 L2,-0.4 L4.4,-2.2 L4,1.4 Z", "#F6C744", 0.8) + E(0, -3, 0.7, 0.7, "#E8584A", 0.5) + E(-4.4, -2.2, 0.5, 0.5, "#FFFFFF", 0.4) + E(4.4, -2.2, 0.5, 0.5, "#FFFFFF", 0.4) + "</g>", "crown");
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
      back += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${st.halo})" stop-opacity="${st.dim ? 0.25 : 0.55}"/><stop offset="1" stop-color="rgb(${st.halo})" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${r2(y - r * 0.5)}" r="${st.sun ? 20 : 17}" fill="url(#${id})"/>`;
      if (st.wings) {
        const flap = [0, -1.6, -2.4, -1.6][n % 4];
        for (const m of [-1, 1]) back += `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P(`M3,-2 Q12,${r2(-12 + flap)} 18,${r2(-8 + flap)} Q14,-6 16,${r2(-3 + flap * 0.4)} Q11,-3 13,1 Q8,-1 5,3 Z`, st.edge, 1) + P(`M4,-1.4 Q11,${r2(-9 + flap)} 15,${r2(-7 + flap)} Q11,-4 12,-1 Q8,-1.6 5,1.6 Z`, st.flame, 0) + "</g>";
        back += P(`M${r2(x - 2)},${r2(y + r - 1)} Q${r2(x - 4)},${r2(y + r + 4.6)} ${r2(x - 1)},${r2(y + r + 6.2)} Q${x},${r2(y + r + 3.2)} ${r2(x + 1)},${r2(y + r + 6.2)} Q${r2(x + 4)},${r2(y + r + 4.6)} ${r2(x + 2)},${r2(y + r - 1)} Z`, st.edge, 1);
      }
      if (st.sun) {
        const rot = n * 11.25, cx = x, cy0 = y - r * 0.55;
        for (let i = 0; i < 12; i++) {
          const a = (i * 30 + rot) * Math.PI / 180, r0 = r * 1.15, rr = r * (i % 2 ? 1.55 : 1.8);
          if (Math.sin(a) > 0.6) continue;
          back += P(`M${r2(cx + Math.cos(a - 0.14) * r0)},${r2(cy0 + Math.sin(a - 0.14) * r0)} L${r2(cx + Math.cos(a) * rr)},${r2(cy0 + Math.sin(a) * rr)} L${r2(cx + Math.cos(a + 0.14) * r0)},${r2(cy0 + Math.sin(a + 0.14) * r0)} Z`, i % 2 ? st.flame : st.edge, 0.8).replace(/stroke="[^"]+"/, `stroke="${st.line}"`);
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
        sparks += E(x + Math.sin((ph + i) * 4.2) * r * 0.9, y - r * (1.3 + p * 1.8), 0.9 - p * 0.5, 0.9 - p * 0.5, `rgb(${st.halo})`, 0).replace("fill=", `fill-opacity="${r2(0.95 - p * 0.7)}" fill=`);
      }
      const face = withFace ? faceOf(x, y, r, n, expr) : "";
      let badge = "";
      if (st.badge) {
        const bx = x + r * 1.15, by = y - r * 2 - n % 2 * 0.8;
        badge = E(bx, by, 3.2, 3.2, "#E8584A", 1).replace(/stroke="[^"]+"/, 'stroke="#7A2418"') + `<path d="M${r2(bx)},${r2(by - 1.8)} L${r2(bx)},${r2(by + 0.5)}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>` + E(bx, by + 1.6, 0.6, 0.6, "#FFFFFF", 0);
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

// atelier/anya.js
var require_anya = __commonJS({
  "atelier/anya.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, r2, IMAGES, lerp, lumiere, peindre } = require_troupe2();
    var C = {
      skin: "#EFE6CF",
      skinS: "#D6CBB0",
      vein: "#E8B84A",
      hair: "#79C267",
      hairS: "#4F9A4C",
      hairH: "#C8EE9A",
      antler: "#9C7350",
      antlerS: "#76543A",
      petal: "#F7C6D9",
      white: "#FFFFFF",
      heart: "#F2C94C",
      dress: "#FBF4E2",
      dressS: "#E8DABA",
      gold: "#E8B84A",
      fur: "#4E8F4C",
      furS: "#3D7440",
      mvein: "#F7D774",
      collar: "#EBC66E",
      collarS: "#C99A45",
      paleG: "#C8EE9A",
      paleGold: "#F7E3A1",
      wingO: "#F2B53B",
      wingB: "#FFF3C4",
      bird: "#5C9CE0",
      eye: "#4E6B18",
      cheek: "#F2B0A8",
      mouth: "#7A4A3A",
      tongue: "#E07A72",
      glow: "255,225,140"
    };
    var AR = { armW: 3.8, sleeve: C.skin, cuff: null, skin: C.skin };
    var MANTEAUX = {
      ete: {
        fur: C.fur,
        furS: C.furS,
        vein: C.mvein,
        glow: "255,220,120",
        hem: C.gold,
        collar: C.collar,
        plumes: [C.gold, C.paleG, C.paleGold],
        plumesHaut: [C.paleGold, C.gold, C.paleG],
        feuilles: [C.gold, C.paleG],
        fleur: C.white,
        ailes: [C.wingO, C.wingB]
      },
      printemps: {
        fur: "#7CBF5C",
        furS: "#5E9E48",
        vein: "#FCE3EC",
        glow: "255,205,225",
        hem: "#F29BB8",
        collar: "#F7C6D9",
        plumes: [C.white, C.petal, C.paleG],
        plumesHaut: [C.petal, C.white, C.paleG],
        feuilles: [C.paleG, "#A6DC7E"],
        fleur: C.petal,
        ailes: ["#8EC5EE", "#FBE38A"]
      },
      automne: {
        fur: "#C8642F",
        furS: "#A24C24",
        vein: "#F7C66A",
        glow: "255,190,110",
        hem: "#E8A23A",
        collar: "#D98B4A",
        plumes: ["#8A5A36", "#D9A55A", "#F2D3A0"],
        plumesHaut: ["#F2D3A0", "#8A5A36", "#D9A55A"],
        feuilles: ["#E8A23A", "#D2452E"],
        fleur: "#F2C94C",
        ailes: ["#E07A2E", "#F2D3A0"]
      },
      hiver: {
        fur: "#EEF2F6",
        furS: "#C9D6E3",
        vein: "#A9D8F0",
        glow: "170,220,255",
        hem: "#9CC7E0",
        collar: "#FFFFFF",
        plumes: ["#FFFFFF", "#DDE7F0", "#B9CCDC"],
        plumesHaut: ["#DDE7F0", "#FFFFFF", "#B9CCDC"],
        feuilles: ["#DDEFF8", "#B9DDF0"],
        fleur: C.white,
        ailes: ["#BFE3F7", "#FFFFFF"]
      }
    };
    var SAISONS_A = Object.keys(MANTEAUX);
    var glandA = /* @__PURE__ */ __name((x, y, r) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r})">${E(0, 1.1, 1.3, 1.6, "#B07A48", 0.5)}${P("M-1.6,0.2 Q0,-1.8 1.6,0.2 Z", "#7A5236", 0.5)}${L([0, -1.2], [0.3, -2.2], OUT, 0.5)}</g>`, "glandA");
    var flocon = /* @__PURE__ */ __name((x, y, r, col = "#FFFFFF") => [0, 60, 120].map((a) => {
      const c = Math.cos(a * Math.PI / 180) * r, sn = Math.sin(a * Math.PI / 180) * r;
      return L([x - c, y - sn], [x + c, y + sn], "#7FA8C8", 1.3) + L([x - c, y - sn], [x + c, y + sn], col, 0.6);
    }).join(""), "flocon");
    var touffe = /* @__PURE__ */ __name((x, y, col) => `<path d="M${r2(x - 1.4)},${r2(y)} Q${r2(x - 0.6)},${r2(y + 1.6)} ${r2(x)},${r2(y + 0.4)} Q${r2(x + 0.6)},${r2(y + 1.6)} ${r2(x + 1.4)},${r2(y)}" fill="none" stroke="${col}" stroke-width="0.75" stroke-linecap="round"/>`, "touffe");
    function orne(saison, sway) {
      const dx = /* @__PURE__ */ __name((y) => y > 95 ? sway * 0.6 : 0, "dx");
      if (saison === "printemps") return [[26, 60], [22, 76], [20, 92], [25, 86], [54, 60], [58, 76], [60, 92], [55, 86]].map(([x, y], i) => flower(x + dx(y), y, i % 3 ? 1.1 : 1.4, i % 2 ? C.white : C.petal)).join("");
      if (saison === "automne") return [[25, 64, 20], [56, 66, -30], [21, 90, 60], [59, 88, -50]].map(([x, y, r]) => glandA(x + dx(y), y, r)).join("") + [[23, 78, 40, "#D2452E"], [57, 80, -40, "#E8A23A"], [19, 98, 70, "#B5532A"], [61, 97, -60, "#D2452E"]].map(([x, y, r, c]) => leaf(x + dx(y), y, 4.4, 1.8, r, c)).join("");
      if (saison === "hiver") return [[24, 58], [26, 70], [56, 58], [54, 70], [21, 82], [59, 84], [19, 94], [61, 94], [25, 92], [55, 92], [28, 62], [52, 62], [23, 76], [57, 72], [34, 96], [46, 96], [40, 92]].map(([x, y], i) => touffe(x + dx(y), y, i % 2 ? "#AFC3D6" : "#C3D2E0")).join("") + [[23, 66, 2], [57, 64, 1.8], [21, 88, 1.7], [59, 78, 2], [26, 80, 1.4]].map(([x, y, r]) => flocon(x + dx(y), y, r)).join("");
      return "";
    }
    __name(orne, "orne");
    var flower = /* @__PURE__ */ __name((x, y, r, petal = C.petal) => [0, 72, 144, 216, 288].map((a) => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.75, r * 0.75, petal, 0.5)).join("") + E(x, y, r * 0.55, r * 0.55, C.heart, 0.4), "flower");
    var firefly = /* @__PURE__ */ __name((x, y, k = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.6 * k)}" fill="rgb(255,236,150)" fill-opacity="0.35"/>` + E(x, y, 0.9 * k, 0.9 * k, "#FFF3A8", 0.4), "firefly");
    var branch = /* @__PURE__ */ __name((d, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${C.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "branch");
    var leaf = /* @__PURE__ */ __name((x, y, len, w, rot, fill = C.hair) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${P(`M0,0 Q${w},${r2(len / 2)} 0,${len} Q${-w},${r2(len / 2)} 0,0 Z`, fill, 0.6)}</g>`, "leaf");
    var feather = /* @__PURE__ */ __name((x, y, rot, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${P("M0,0 Q2.4,4 0,9 Q-2.4,4 0,0 Z", fill, 0.6)}${L([0, 1], [0, 8], OUT, 0.35)}</g>`, "feather");
    var butterfly = /* @__PURE__ */ __name((x, y, open, fill) => `<g transform="translate(${r2(x)} ${r2(y)})">${P(`M0,0 Q${r2(-3.2 * open)},-3.4 ${r2(-3.4 * open)},-0.4 Q${r2(-2.6 * open)},1.6 0,0.6 Z`, fill, 0.5)}${P(`M0,0 Q${r2(3.2 * open)},-3.4 ${r2(3.4 * open)},-0.4 Q${r2(2.6 * open)},1.6 0,0.6 Z`, fill, 0.5)}${L([0, -1.2], [0, 1.4], OUT, 0.6)}</g>`, "butterfly");
    var bird = /* @__PURE__ */ __name((x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">` + E(0, 0, 2.6, 2.1, C.bird, 0.7) + E(0.6, 0.8, 1.4, 1, C.white, 0) + P("M2.4,-0.6 L4,-0.2 L2.4,0.4 Z", C.heart, 0.4) + E(1.1, -0.8, 0.4, 0.4, OUT, 0) + P("M-2.2,-0.4 L-4.2,-1.2 L-3.6,0.6 Z", C.bird, 0.5) + "</g>", "bird");
    function antlers(k, birdSide = 1) {
      let s = '<g transform="translate(40 19.4) scale(0.86) translate(-40 -19.4)">';
      for (const m of [-1, 1]) {
        const X = /* @__PURE__ */ __name((x) => r2(40 + k + m * (x - 40)), "X");
        s += branch(`M${X(34)},19.4 Q${X(30)},13 ${X(26.4)},10 Q${X(23.6)},7.6 ${X(21.8)},4.2`, 2);
        s += branch(`M${X(28.8)},11.8 Q${X(27.6)},7.6 ${X(28.8)},4.2`, 1.4) + branch(`M${X(25)},9.2 Q${X(21.8)},10.4 ${X(19.2)},9.6`, 1.3);
        s += flower(+X(21.8), 4, 1.2) + flower(+X(28.8), 4, 1.1, C.white) + flower(+X(19.2), 9.6, 1, C.white) + flower(+X(26.6), 9.8, 0.9) + leaf(+X(31.2), 14.4, 2.6, 1, m * 70, C.hair);
      }
      return s + bird(r2(40 + k + birdSide * 15.6), 8.6, birdSide) + "</g>";
    }
    __name(antlers, "antlers");
    function anyaFrame(view, pose, n, expr, saison = "ete") {
      const M = MANTEAUX[saison];
      const walk = pose === "marche";
      const N = IMAGES[pose] || 2, t = n % N / N;
      const ph = walk ? r2(Math.cos(t * Math.PI * 2)) : 0;
      const bob = walk ? r2(-(1 - Math.abs(ph))) : pose === "repos" ? [0, -0.5, -1, -0.5][n % 4] : 0;
      const sway = walk ? r2(1.4 * ph) : pose === "repos" ? r2(0.5 * Math.sin(t * Math.PI * 2)) : 0;
      const kh = pose === "salut" ? [0, 0.5, 1, 0.5][n % 4] : n % 2;
      const glowK = pose === "action" ? n ? 1.25 : 1.1 : pose === "repos" ? r2(1 + 0.05 * Math.sin(t * Math.PI * 2)) : 1;
      const k = view === "se" ? -2.4 : 0;
      const uid = `an${view}${pose}${n}${saison === "ete" ? "" : saison}`;
      let s = "";
      s += `<defs><radialGradient id="${uid}g"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="${r2(0.6 * glowK)}"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="62" rx="${r2(40 * glowK)}" ry="${r2(62 * glowK)}" fill="url(#${uid}g)"/>`;
      const flies = [0, 1, 2, 3, 4].map((i) => {
        const a = (t + i / 5) * Math.PI * 2;
        return { x: 40 + Math.cos(a) * 30, y: 66 + Math.sin(a * 2) * 10 + Math.sin(a) * 24, back: Math.sin(a) < 0 };
      });
      s += flies.filter((f) => f.back).map((f) => firefly(f.x, f.y)).join("");
      let g = "";
      const ground = walk ? flower(ph >= 0 ? 34 : 46, 125.6, 1.3) + (Math.abs(ph) < 0.8 ? flower(ph >= 0 ? 47 : 33, 126, 0.9, C.white) : "") : pose === "action" ? [[24, 123.4], [32, 124.8], [48, 124.8], [56, 123.4], [40, 125.4]].slice(0, n ? 5 : 3).map(([x, y], i) => flower(x, y, 1.4, i % 2 ? C.white : C.petal)).join("") : flower(46, 126, 1.1);
      const hairBack = view === "ne" ? "M28.2,30 Q27.8,14.8 40,14.6 Q52.2,14.8 51.8,30 Q51.4,36.4 47.4,39 Q49.4,50 49,62 Q48.8,74 47,84 Q45.4,80.4 43.6,86.6 Q41.8,81.6 40,89 Q38.2,81.6 36.4,86.6 Q34.6,80.4 33,84 Q31.2,74 31,62 Q30.6,50 32.6,39 Q28.6,36.4 28.2,30 Z" : "M28.6,24 Q27.6,40 28.4,56 L51.6,56 Q52.4,40 51.4,24 Z";
      const cloak = `M29,45.4 Q40,40.6 51,45.4 Q60,70 ${r2(66 + sway)},119.6 Q${r2(53 + sway)},126 40,124.8 Q${r2(27 + sway)},126 ${r2(14 + sway)},119.6 Q20,70 29,45.4 Z`;
      const feathers = [15.6, 20.2, 24.8, 29.4, 34, 38.6, 43.2, 47.8, 52.4, 57, 61.6].map((x, i) => feather(x + sway * 0.8, 111.4 + i % 2 * 1.6, (i - 5) * 4, M.plumes[i % 3])).join("") + [18.4, 23, 27.6, 52.4, 57, 61.6].map((x, i) => feather(x + sway * 0.6, 101 + i % 2 * 1.4, i < 3 ? -8 : 8, M.plumesHaut[i % 3])).join("") + [[19, 70], [24, 82], [58, 66], [61, 90]].map(([x, y], i) => leaf(x, y, 4, 1.6, i % 2 ? 30 : -30, M.feuilles[i % 2])).join("") + [[22.4, 62], [59.6, 78], [17.6, 92]].map(([x, y]) => flower(x, y, 1.1, M.fleur)).join("") + orne(saison, sway);
      const wing = r2(0.6 + 0.4 * Math.abs(Math.sin(t * Math.PI * 4 + 1)));
      const veinD = [-1, 1].map((m) => {
        const X = /* @__PURE__ */ __name((x, lo) => r2(40 + m * (x - 40) + (lo ? sway * 0.6 : 0)), "X");
        let d = `M${X(30)},50 Q${X(23)},80 ${X(18.6, 1)},114`;
        for (const [y, x, dx, dy] of [[62, 26.6, -4.2, 6], [76, 23.6, -5, 7.4], [90, 21.2, -5.2, 8], [103, 19.6, -4.6, 7.6], [70, 25, 3.4, 6.4], [86, 22, 3.8, 7]]) d += ` M${X(x, y > 95)},${y} Q${X(x + dx * 0.3, y > 95)},${r2(y + dy * 0.7)} ${X(x + dx, y + dy > 95)},${r2(y + dy)}`;
        return d;
      }).join(" ") + (view === "ne" ? ` M40,46 L${r2(40 + sway * 0.4)},118` : "");
      const cloakVeins = `<path d="${veinD}" fill="none" stroke="rgb(${M.glow})" stroke-width="2.2" stroke-linecap="round" opacity="0.35"/><path d="${veinD}" fill="none" stroke="${M.vein}" stroke-width="0.75" stroke-linecap="round"/><path d="M${r2(12 + sway)},118.6 Q40,128.4 ${r2(68 + sway)},118.6" fill="none" stroke="${M.hem}" stroke-width="2.4"/>`;
      const cloakTex = clip(`${uid}c`, cloak, `<rect x="49" y="40" width="20" height="90" fill="${M.furS}"/>${cloakVeins}${feathers}`) + (view === "ne" ? butterfly(30, 86, wing, M.ailes[0]) + butterfly(51, 74, 1.2 - wing * 0.5, M.ailes[1]) + butterfly(46, 98, wing, M.ailes[0]) : butterfly(20.6, 78, wing, M.ailes[0]) + butterfly(60, 72, 1.2 - wing * 0.5, M.ailes[1]) + butterfly(62.4, 102, wing, M.ailes[0]) + butterfly(18.4, 104, 1.2 - wing * 0.5, M.ailes[1]));
      const swing = ph;
      let armL = arm(AR, [31.6, 48.4], [27.6 + swing, 84 - swing * 1.4], [29.2, 66]);
      let armR = arm(AR, [48.4, 48.4], [52.4 - swing, 84 + swing * 1.4], [50.8, 66]);
      let over = "";
      if (pose === "salut") {
        const h = lerp([57, 47.4], [57.4, 44.6], kh);
        armR = arm(AR, [48.4, 48.4], h, [57.2, 60]);
        over += E(h[0], h[1] - 4.4, 3.4, 3.4, "rgb(255,236,150)", 0).replace("fill=", 'fill-opacity="0.45" fill=') + flower(h[0] - 1.4, h[1] - 6 - kh * 2.4, 1.1) + flower(h[0] + 2.4, h[1] - 3.4 - kh * 3.4, 0.9, C.white) + (kh > 0.6 ? firefly(h[0] - 3.6, h[1] - 10) : "");
      }
      if (pose === "action") {
        armL = arm(AR, [31.6, 48.4], [14.4, 72], [22.6, 60]);
        armR = arm(AR, [48.4, 48.4], [65.6, 72], [57.4, 60]);
        over += firefly(12.4, 66, 1.2) + firefly(67.6, 66, 1.2) + (n ? firefly(16, 58) + firefly(64, 58) : "");
      }
      const veinsArm = pose === "repos" || walk ? L([28.6 + swing * 0.6, 70], [28.2 + swing * 0.8, 78], C.vein, 0.5) + L([51.4 - swing * 0.6, 70], [51.8 - swing * 0.8, 78], C.vein, 0.5) : "";
      if (view === "ne") {
        g += `<g transform="translate(0 -2)">${antlers(0, -1)}</g>`;
        g += P(cloak, M.fur) + cloakTex + P(cloak, "none") + ground;
        g += [36, 44].map((x, i) => E(x + (walk ? (i ? -sway : sway) * 0.6 : 0), 123.4, 2.4, 1.6, C.skin, 0.8)).join("");
        g += armL + armR;
        const strands = `M40,15.6 Q32,22 31.4,32 M40,15.6 Q48,22 48.6,32 M35.4,40 Q34,56 34.6,72 Q35,80 36.4,85 M40,38 Q40.4,60 40,88 M44.6,40 Q46,56 45.4,72 Q45,80 43.6,85`;
        g += P(hairBack, C.hair) + clip(`${uid}h`, hairBack, `<rect x="45.4" y="14" width="16" height="96" fill="${C.hairS}"/><path d="${strands}" fill="none" stroke="${C.hairS}" stroke-width="0.8" stroke-linecap="round" opacity="0.9"/><path d="M33.6,19.6 Q30.6,26 30.8,33 M36.4,17.4 Q34.4,22 34,28 M33.6,46 Q32.8,58 33.2,70" fill="none" stroke="${C.hairH}" stroke-width="1.3" stroke-linecap="round"/>`) + P(hairBack, "none");
        g += P("M29.4,31.4 Q40,36.6 50.6,31.4", "none", 2.6).replace(`stroke="${OUT}"`, `stroke="${C.hairS}"`) + [[30.4, 31.6, -40], [35, 34, -15], [45, 34, 15], [49.6, 31.6, 40]].map(([x, y, r]) => leaf(x, y, 3, 1.3, r, C.hairH)).join("") + [[32.6, 33, C.white], [37.6, 34.8, C.petal], [42.4, 34.8, C.white], [47.4, 33, C.petal]].map(([x, y, c]) => flower(x, y, 1.1, c)).join("");
        g += [[37.4, 54, 14], [43.2, 66, -14]].map(([x, y, r], i) => leaf(x, y, 3.4, 1.4, r, i % 2 ? C.hairH : C.hairS)).join("");
        g += [[40.4, 19, 1], [33, 60, 0.8]].map(([x, y, r]) => flower(x, y, r, C.white)).join("");
      } else {
        g += P(hairBack, C.hair) + P(hairBack, "none");
        g += P(cloak, M.fur) + cloakTex + P(cloak, "none") + ground;
        g += [[36, 0], [44, 1]].map(([x, i]) => {
          const fwd = walk ? r2((i ? -ph : ph) * 0.8) : 0;
          return E(x + k * 0.3, 123.2 + fwd, 2.6, 1.7, C.skin, 0.8) + L([x + k * 0.3 - 1, 124 + fwd], [x + k * 0.3 - 1, 124.8 + fwd], OUT, 0.4) + L([x + k * 0.3 + 0.4, 124.2 + fwd], [x + k * 0.3 + 0.4, 124.9 + fwd], OUT, 0.4);
        }).join("");
        const dress = `M${r2(34.6 + k * 0.4)},46 Q${r2(40 + k * 0.4)},44.4 ${r2(45.4 + k * 0.4)},46 L${r2(49.4 + sway * 0.6)},121.4 Q40,124.6 ${r2(30.6 + sway * 0.6)},121.4 Z`;
        g += P(dress, C.dress) + clip(`${uid}d`, dress, `<rect x="${44 + k * 0.4}" y="40" width="12" height="90" fill="${C.dressS}"/><path d="M26,117.4 Q40,121 54,117.4" fill="none" stroke="${C.gold}" stroke-width="1"/><path d="M${40 + k * 0.4},52 Q${38 + k * 0.4},70 ${41 + k * 0.4},90 Q${39 + k * 0.4},104 ${40 + k * 0.4},116" fill="none" stroke="${C.gold}" stroke-width="0.6" opacity="0.8"/>` + leaf(36 + k * 0.4, 70, 3, 1.1, 40, C.hairH) + leaf(44 + k * 0.4, 84, 3, 1.1, -40, C.hairH)) + P(dress, "none");
        g += P(`M27.6,45 Q40,39.6 52.4,45 L53.6,51.4 Q50.6,54.4 47.6,52 Q44,55.2 40,52.6 Q36,55.2 32.4,52 Q29.4,54.4 26.4,51.4 Z`, M.collar) + P(`M30,47.6 Q33,50 36,48.6 M44,48.6 Q47,50 50,47.6`, "none", 0.6);
        g += armL + armR + veinsArm;
        g += `<rect x="${37.6 + k * 0.5}" y="38" width="4.8" height="8.4" fill="${C.skin}"/>` + L([37.6 + k * 0.5, 38], [37.6 + k * 0.5, 45], OUT, 1) + L([42.4 + k * 0.5, 38], [42.4 + k * 0.5, 45], OUT, 1);
        const fx = 40 + k, face = `M${fx - 12},31 a12,12.6 0 1,0 24,0 a12,12.6 0 1,0 -24,0 Z`;
        g += `<g transform="translate(0 -2)">${antlers(k, 1)}</g>` + P(`M${27.4 + k},31 Q${27 + k},15 ${40 + k},14.6 Q${53 + k},15 ${52.6 + k},31 Z`, C.hair);
        const veins = `M${29.6 + k},33.4 Q${32 + k},36 ${33.8 + k},39.6 M${31.8 + k},36.4 L${30.2 + k},38 M${50.4 + k},33.4 Q${48 + k},36 ${46.2 + k},39.6 M${48.2 + k},36.4 L${49.8 + k},38`;
        g += P(face, C.skin) + clip(`${uid}f`, face, `<rect x="${45 + k}" y="18" width="14" height="28" fill="${C.skinS}" opacity="0.5"/>` + E(31.8 + k, 37, 2.2, 1.2, C.cheek, 0) + E(48.2 + k, 37, 2.2, 1.2, C.cheek, 0) + `<path d="${veins}" fill="none" stroke="rgb(255,220,120)" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/><path d="${veins}" fill="none" stroke="${C.vein}" stroke-width="0.7" stroke-linecap="round"/>`) + P(face, "none");
        const lockL = `M${29 + k},26 Q${25.8 + k},46 ${28 + k},62 Q${29.6 + k},68 ${31.4 + k},73 Q${32 + k},60 ${32.4 + k},48 Q${32.6 + k},36 ${31.8 + k},28 Z`;
        const lockR = `M${51 + k},26 Q${54.2 + k},46 ${52 + k},62 Q${50.4 + k},68 ${48.6 + k},73 Q${48 + k},60 ${47.6 + k},48 Q${47.4 + k},36 ${48.2 + k},28 Z`;
        g += P(lockL, C.hair) + P(lockR, C.hair) + leaf(30 + k, 50, 3.8, 1.5, 20) + leaf(30.4 + k, 62, 3.8, 1.5, -15, C.hairH) + leaf(50 + k, 50, 3.8, 1.5, -20) + leaf(49.6 + k, 62, 3.8, 1.5, 15, C.hairH);
        g += P(`M${28.2 + k},29 Q${28.4 + k},17 ${40 + k},16.6 Q${51.6 + k},17 ${51.8 + k},29 Q${48.8 + k},22.4 ${42.4 + k},21.8 L${40 + k},24.6 L${37.6 + k},21.8 Q${31.2 + k},22.4 ${28.2 + k},29 Z`, C.hair) + L([31.2 + k, 21.4], [35.8 + k, 19.2], C.hairH, 1.1);
        g += P(`M${40 + k},19.6 L${41.8 + k},21.6 L${40 + k},23.8 L${38.2 + k},21.6 Z`, "#3FA866", 0.7) + E(39.5 + k, 21.1, 0.4, 0.55, C.white, 0);
        g += expression({
          eyes: view === "se" ? [[34.6 + k + 1.2, 32.4, 1.9], [43 + k + 1.2, 32.4, 1.7]] : [[35, 32.4, 2], [45, 32.4, 2]],
          ry: 2.8,
          eyeColor: C.eye,
          brow: C.hairS,
          browY: -4.8,
          browW: 0.9,
          restEyes: "sleepy",
          mouth: [40 + k + (view === "se" ? 0.4 : 0), 38.4],
          mw: 1.8,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.2)} ${r2(mx + 1.4)},${r2(my + 0.3)}`, "neutral"),
          cheeks: [[31.8 + k, 2.2], [48.2 + k, 2.2]],
          cheekY: 37,
          temple: [26.4 + k, 30],
          anger: [60, 18],
          zz: [56, 14]
        }, { expr, n, id: uid, blink: pose === "repos" && n % 4 === 3, open: false });
      }
      s += `<g transform="translate(0 ${bob})">${g}${over}</g>`;
      s += flies.filter((f) => !f.back).map((f) => firefly(f.x, f.y)).join("");
      const { defs, table } = lumiere({ skin: C.skin, hair: C.hair, teintes: [M.fur, C.dress, M.collar, C.collar] }, uid, 80 / 48);
      return defs + peindre(s, table);
    }
    __name(anyaFrame, "anyaFrame");
    var POSES_A = [["face_repos", "front", "repos", IMAGES.repos], ["avant_marche", "se", "marche", IMAGES.marche], ["dos_marche", "ne", "marche", IMAGES.marche], ["face_benediction", "front", "salut", IMAGES.salut], ["face_eveil", "front", "action", 2]];
    var EXPR_OF = { repos: "neutre", marche: "neutre", salut: "content", action: "content" };
    var svgA = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${128 * scale}" viewBox="0 0 80 128">${body}</svg>`, "svgA");
    module.exports = { anyaFrame, POSES_A, EXPR_OF, svgA, SAISONS_A };
  }
});

// atelier/cerf.js
var require_cerf = __commonJS({
  "atelier/cerf.js"(exports, module) {
    var { OUT, P, E, L, clip, r2 } = require_troupe2();
    var C = { coat: "#F7F4EC", coatS: "#DCD6C8", shade: "#E6E0D3", belly: "#FFFFFF", antler: "#F2C94C", antlerS: "#D6A63A", hoof: "#E2B85A", hoofS: "#C2953C", nose: "#6A5450", eye: "#2A2420", petal: "#F7C6D9", glow: "255,225,140", spot: "#E2DCCD", inner: "#F2C6C0" };
    var seg = /* @__PURE__ */ __name((a, b, w, color) => `<path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "seg");
    var leg = /* @__PURE__ */ __name(([a, b, c], w0, w1, fill) => seg(a, b, w0 + 2.2, OUT) + seg(b, c, w1 + 2.2, OUT) + seg(a, b, w0, fill) + seg(b, c, w1, fill), "leg");
    var hoof = /* @__PURE__ */ __name((x, col) => P(`M${r2(x - 1.9)},77 L${r2(x - 1.5)},75 L${r2(x + 1.6)},75 L${r2(x + 2.2)},77 Z`, col, 0.8), "hoof");
    var tine = /* @__PURE__ */ __name((d, w, col) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "tine");
    var flower = /* @__PURE__ */ __name((x, y, r) => [0, 72, 144, 216, 288].map((a) => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.75, r * 0.75, C.petal, 0.4)).join("") + E(x, y, r * 0.5, r * 0.5, "#FFE7A3", 0.3), "flower");
    var sparkle = /* @__PURE__ */ __name((x, y, r) => `<path d="M${r2(x)},${r2(y - r)} Q${r2(x)},${r2(y)} ${r2(x + r)},${r2(y)} Q${r2(x)},${r2(y)} ${r2(x)},${r2(y + r)} Q${r2(x)},${r2(y)} ${r2(x - r)},${r2(y)} Q${r2(x)},${r2(y)} ${r2(x)},${r2(y - r)} Z" fill="#FFF2B8" opacity="0.9"/>`, "sparkle");
    function ear(x, y, rot, far) {
      return `<g transform="rotate(${rot} ${r2(x)} ${r2(y)})">${P(`M${r2(x)},${r2(y)} Q${r2(x - 4.2)},${r2(y - 2.8)} ${r2(x - 7.8)},${r2(y)} Q${r2(x - 4.2)},${r2(y + 2.4)} ${r2(x)},${r2(y + 0.9)} Z`, far ? C.coatS : C.coat, 0.9)}${far ? "" : E(x - 4, y + 0.2, 2.2, 0.8, C.inner, 0)}</g>`;
    }
    __name(ear, "ear");
    function head(hx, hy, blink, tw, k) {
      const at = /* @__PURE__ */ __name((dx, dy) => `${r2(hx + dx)},${r2(hy + dy)}`, "at");
      const far = `M${at(2, -5)} C${at(4, -9.6)} ${at(7.6, -12.8)} ${at(9, -18.6)} M${at(4.4, -10)} Q${at(7, -9.8)} ${at(9.2, -10.6)} M${at(6.8, -14)} Q${at(9.6, -14)} ${at(11.8, -15.4)}`;
      const near = `M${at(-1.2, -5)} C${at(-2.4, -11)} ${at(-5.6, -15)} ${at(-4.6, -22.4)} M${at(-2.6, -10.8)} Q${at(-0.6, -12.6)} ${at(0.4, -15)} M${at(-4.4, -15.6)} Q${at(-7.6, -16.8)} ${at(-9.6, -19.4)}`;
      let s = `<path d="${far} ${near}" fill="none" stroke="rgb(${C.glow})" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>`;
      s += tine(far, 1.4, C.antlerS) + flower(hx + 9, hy - 18.6, 0.8) + flower(hx + 11.8, hy - 15.4, 0.7);
      s += ear(hx + 1.4, hy - 4.2, -52, true);
      s += E(hx, hy, 7, 6.3, C.coat);
      s += clip(`ct${k}`, `M${r2(hx - 7)},${r2(hy)} a7,6.3 0 1,0 14,0 a7,6.3 0 1,0 -14,0 Z`, `<ellipse cx="${r2(hx - 1)}" cy="${r2(hy + 6)}" rx="7" ry="2.6" fill="${C.shade}"/>`) + E(hx, hy, 7, 6.3, "none");
      s += E(hx + 5.2, hy + 2.6, 3.8, 3, C.belly, 0.9) + E(hx + 8.3, hy + 1.7, 1.15, 0.95, C.nose, 0.6);
      s += P(`M${at(6.4, 4.5)} Q${at(7.4, 5.1)} ${at(8.4, 4.3)}`, "none", 0.6);
      s += E(hx - 0.6, hy + 2.6, 2, 1, "#F6C2C2", 0);
      s += blink ? P(`M${at(0.3, -0.6)} Q${at(1.8, 1)} ${at(3.3, -0.6)}`, "none", 0.9) : E(hx + 1.8, hy - 0.6, 1.35, 1.75, C.eye, 0) + E(hx + 2.3, hy - 1.4, 0.55, 0.55, "#FFFFFF", 0) + E(hx + 1.3, hy + 0.3, 0.25, 0.25, "#FFFFFF", 0) + L([hx + 2.9, hy - 2.1], [hx + 4, hy - 3], OUT, 0.5);
      s += ear(hx - 2.6, hy - 4, -28, false);
      s += tine(near, 1.7, C.antler) + flower(hx - 4.6, hy - 22.4, 1.1) + flower(hx - 9.6, hy - 19.4, 1) + flower(hx + 0.4, hy - 15, 0.85);
      s += tw ? sparkle(hx - 13.4, hy - 13.6, 1.5) + sparkle(hx + 13, hy - 21.6, 1) + sparkle(hx + 3.4, hy - 25.4, 0.85) : sparkle(hx - 11.6, hy - 24.2, 1.1) + sparkle(hx + 14, hy - 12.6, 1.4) + sparkle(hx - 1.8, hy - 26.2, 0.75);
      return `<g transform="translate(${r2(hx)} ${r2(hy)}) scale(1.22) translate(${r2(-hx)} ${r2(-hy)})">${s}</g>`;
    }
    __name(head, "head");
    function ruff(x0, y0, x1, y1, n, bw) {
      const at = /* @__PURE__ */ __name((t, dx) => `${r2(x0 + (x1 - x0) * t + dx)},${r2(y0 + (y1 - y0) * t)}`, "at");
      let edge = `M${at(0, 0)}`;
      for (let i = 1; i <= n; i++) edge += ` Q${at((i - 0.5) / n, bw)} ${at(i / n, i < n ? bw * 0.4 : 0)}`;
      return P(`${edge} L${at(1, -1.6)} L${at(0, -1.6)} Z`, C.belly, 0) + P(edge, "none", 0.8);
    }
    __name(ruff, "ruff");
    function coat(id, d, under, haunch, shoulder, spots) {
      const line = /* @__PURE__ */ __name((p) => `<path d="${p}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/>`, "line");
      return clip(id, d, `<ellipse cx="${under[0]}" cy="${under[1]}" rx="${under[2]}" ry="${under[3]}" fill="${C.shade}"/>` + line(haunch) + line(shoulder) + spots.map(([x, y, rx, ry]) => E(x, y, rx, ry, C.spot, 0)).join(""));
    }
    __name(coat, "coat");
    var tail = /* @__PURE__ */ __name((x, y, rot) => `<g transform="rotate(${rot} ${r2(x)} ${r2(y)})">${P(`M${r2(x + 1.4)},${r2(y - 0.6)} Q${r2(x - 3.2)},${r2(y - 4)} ${r2(x - 3.4)},${r2(y)} Q${r2(x - 2.8)},${r2(y + 3)} ${r2(x + 1)},${r2(y + 2.4)} Z`, C.belly, 0.9)}</g>`, "tail");
    function cerfFrame(pose, n = 0, blink = false, view = "profil") {
      if (view !== "profil") return cerf3(view, pose, n, blink);
      const k = `${pose}${n}${blink ? 1 : 0}`;
      let s = `<defs><radialGradient id="cg${k}"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="0.4"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="44" rx="40" ry="36" fill="url(#cg${k})"/>`;
      if (pose === "repos") {
        const d2 = "M24,75.6 C18.6,74.6 17,67.6 20.8,63.4 C24.6,59.6 32.4,58.8 39.6,59 C45,59.2 48.6,58 51,55 C53,52.2 54.2,48.4 55.8,44.4 L61.4,46.6 C60,51 59.4,55.4 59.8,59.6 C60.4,65.4 61.6,70.6 58.6,73.8 C53.4,76.8 33.2,76.9 24,75.6 Z";
        s += E(41, 77, 24, 1.8, "rgba(40,55,20,.18)", 0) + tail(20.2, 64.4, -10);
        s += P(d2, C.coat) + coat(`cb${k}`, d2, [40, 77.4, 21, 4.6], "M22.6,64 Q26,72.6 34.4,75.8", "M52.4,60 Q54.6,67 51.4,74", [[31.6, 63.4, 1.5, 1], [37.2, 61.6, 1.3, 0.9], [42.6, 63.6, 1.4, 1], [35, 66.6, 1.1, 0.8], [47, 62.2, 1.1, 0.8]]) + P(d2, "none");
        s += ruff(59.4, 55.4, 60.2, 67.4, 3, 2.6);
        s += seg([31.4, 75.4], [35.6, 75.9], 4.6, OUT) + seg([31.4, 75.4], [35.6, 75.9], 2.4, C.coat) + E(37.3, 76, 1.8, 1.2, C.hoof, 0.8);
        s += seg([55.6, 72.8], [62, 75.2], 5, OUT) + seg([55.6, 72.8], [62, 75.2], 2.8, C.coat) + E(63.8, 75.6, 1.9, 1.3, C.hoof, 0.8);
        return s + head(60.6, 41.2, blink, 0, k);
      }
      const step = n ? 1 : -1;
      const by = n ? -0.6 : 0;
      const b = /* @__PURE__ */ __name((x, y) => `${r2(x)},${r2(y + by)}`, "b");
      s += E(38, 77, 20, 1.6, "rgba(40,55,20,.18)", 0);
      s += leg([[28, 55 + by], [25 + step * 1.2, 65.6], [26.6 - step * 2.6, 75.2]], 4.4, 2.7, C.coatS) + hoof(26.6 - step * 2.6, C.hoofS);
      s += leg([[48, 55 + by], [49.6 + step * 1.2, 65.2], [48.6 + step * 2.6, 75.2]], 4.2, 2.7, C.coatS) + hoof(48.6 + step * 2.6, C.hoofS);
      s += tail(20.2, 46.6 + by, n ? -16 : -4);
      s += leg([[31.4, 55 + by], [28.4 - step * 1.2, 66], [30.4 + step * 2.6, 75.2]], 4.8, 2.9, C.coat) + hoof(30.4 + step * 2.6, C.hoof);
      s += leg([[51.4, 55 + by], [52.6 - step * 1.2, 65.4], [51.4 - step * 2.6, 75.2]], 4.6, 2.9, C.coat) + hoof(51.4 - step * 2.6, C.hoof);
      const d = `M${b(22.8, 57.8)} C${b(18.6, 55.2)} ${b(18.4, 49.6)} ${b(20.4, 46)} C${b(22.4, 41.8)} ${b(27.4, 40)} ${b(33.4, 40.2)} C${b(39.6, 40.4)} ${b(44.4, 39.6)} ${b(47.5, 37.5)} C${b(50.4, 34.6)} ${b(52.6, 30.4)} ${b(54.4, 26.6)} L${b(59, 28.4)} C${b(57.6, 33.6)} ${b(56.2, 38.6)} ${b(56.6, 44.4)} C${b(57.2, 50.4)} ${b(55.8, 56)} ${b(50.4, 58.8)} C${b(45.6, 60.4)} ${b(40.4, 58.6)} ${b(35.6, 58.8)} C${b(30.6, 59)} ${b(26, 60)} ${b(22.8, 57.8)} Z`;
      s += P(d, C.coat) + coat(
        `cb${k}`,
        d,
        [38, 61.2 + by, 20, 5],
        `M${b(22.4, 49.6)} Q${b(25, 57)} ${b(33, 59.6)}`,
        `M${b(51.2, 45.6)} Q${b(52.4, 53)} ${b(48.6, 59.2)}`,
        [[30, 45.2 + by, 1.6, 1.1], [35.6, 43.4 + by, 1.3, 0.9], [40.6, 45.6 + by, 1.4, 1], [33.2, 48.6 + by, 1.1, 0.8], [45.4, 43.6 + by, 1.1, 0.8]]
      ) + P(d, "none");
      s += ruff(56, 37.4 + by, 56.4, 50.4 + by, 3, 2.6);
      return s + head(58.6, 23.4 + by, blink, n, k);
    }
    __name(cerfFrame, "cerfFrame");
    var DEG = Math.PI / 180;
    function eggPath(cx, cy, rx, ry, a, egg) {
      const c = Math.cos(a * DEG), s = Math.sin(a * DEG), pts = [];
      for (let i = 0; i < 64; i++) {
        const t = i / 64 * Math.PI * 2, x = Math.cos(t) * rx, y = Math.sin(t) * ry * (1 + egg * Math.cos(t));
        pts.push(`${r2(cx + x * c - y * s)},${r2(cy + x * s + y * c)}`);
      }
      return `M${pts.join(" L")} Z`;
    }
    __name(eggPath, "eggPath");
    var hoof3 = /* @__PURE__ */ __name((x, y, col, cleft) => P(`M${r2(x - 2)},${r2(y)} L${r2(x - 1.6)},${r2(y - 1.9)} L${r2(x + 1.6)},${r2(y - 1.9)} L${r2(x + 2)},${r2(y)} Z`, col, 0.8) + (cleft ? L([x, y - 1.5], [x, y - 0.2], OUT, 0.5) : ""), "hoof3");
    function ear3(x, y, rot, dir, far, back) {
      const fill = far ? C.coatS : C.coat;
      return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${-dir} 1) rotate(${rot})">${P("M0,0 Q-4.2,-2.8 -7.8,0 Q-4.2,2.4 0,0.9 Z", fill, 0.9)}${far || back ? "" : E(-4, 0.2, 2.2, 0.8, C.inner, 0)}</g>`;
    }
    __name(ear3, "ear3");
    function antler3(hx, hy, dir, col, w, k) {
      const at = /* @__PURE__ */ __name((dx, dy) => `${r2(hx + dir * dx)},${r2(hy + dy)}`, "at");
      const d = `M${at(2.4, -5)} C${at(4, -10.4)} ${at(8.2, -13.4)} ${at(8.4, -20.6)} M${at(4.2, -9.8)} Q${at(3, -12.6)} ${at(3.4, -15.8)} M${at(6.8, -14.2)} Q${at(10.2, -15)} ${at(12.6, -17.8)}`;
      return { d, svg: tine(d, w, col) + flower(hx + dir * 8.4, hy - 20.6, 1.05 * k) + flower(hx + dir * 3.4, hy - 15.8, 0.8 * k) + flower(hx + dir * 12.6, hy - 17.8, 0.9 * k) };
    }
    __name(antler3, "antler3");
    function head3(view, hx, hy, blink, tw, k) {
      const at = /* @__PURE__ */ __name((dx, dy) => `${r2(hx + dx)},${r2(hy + dy)}`, "at");
      const se = view === "avant";
      const near = antler3(hx, hy, se ? -1 : 1, C.antler, 1.7, 1), far = antler3(hx, hy, se ? 1 : -1, C.antlerS, 1.4, 0.85);
      let s = `<path d="${near.d} ${far.d}" fill="none" stroke="rgb(${C.glow})" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>`;
      const skull = `M${r2(hx - 6.8)},${r2(hy)} a6.8,6.2 0 1,0 13.6,0 a6.8,6.2 0 1,0 -13.6,0 Z`;
      if (se) {
        s += far.svg + ear3(hx + 4.6, hy - 3.6, 26, 1, true, false);
        s += E(hx, hy, 6.8, 6.2, C.coat) + clip(`ct${k}`, skull, `<ellipse cx="${r2(hx - 1.4)}" cy="${r2(hy + 6.2)}" rx="7" ry="2.4" fill="${C.shade}"/>`) + E(hx, hy, 6.8, 6.2, "none");
        s += E(hx + 2.4, hy + 3.3, 3.7, 2.9, C.belly, 0.9) + E(hx + 3.1, hy + 2.1, 1.3, 0.95, C.nose, 0.6) + E(hx + 2.7, hy + 1.8, 0.4, 0.25, "#FFFFFF", 0);
        s += P(`M${at(1.4, 4.7)} Q${at(2.5, 5.5)} ${at(3.8, 4.6)}`, "none", 0.6);
        s += E(hx - 3.9, hy + 2.3, 1.8, 0.9, "#F6C2C2", 0) + E(hx + 5.6, hy + 1.2, 1.1, 0.8, "#F6C2C2", 0);
        s += blink ? P(`M${at(-4, -0.8)} Q${at(-2.6, 0.8)} ${at(-1.2, -0.8)} M${at(2.2, -1.4)} Q${at(3.4, 0)} ${at(4.6, -1.4)}`, "none", 0.9) : E(hx - 2.6, hy - 0.7, 1.35, 1.75, C.eye, 0) + E(hx - 2.1, hy - 1.5, 0.55, 0.55, "#FFFFFF", 0) + E(hx - 3, hy + 0.2, 0.25, 0.25, "#FFFFFF", 0) + L([hx - 3.7, hy - 2.1], [hx - 4.7, hy - 2.9], OUT, 0.5) + E(hx + 3.4, hy - 1.3, 1.15, 1.55, C.eye, 0) + E(hx + 3.8, hy - 2, 0.48, 0.48, "#FFFFFF", 0) + L([hx + 4.3, hy - 2.6], [hx + 5.2, hy - 3.3], OUT, 0.5);
        s += ear3(hx - 4.6, hy - 3.4, 22, -1, false, false) + near.svg;
      } else {
        s += E(hx + 5.6, hy + 1.6, 2.6, 2.1, C.belly, 0.9) + E(hx + 7.4, hy + 0.9, 0.7, 0.6, C.nose, 0);
        s += ear3(hx - 4.4, hy - 3, 24, -1, true, true);
        s += E(hx, hy, 6.8, 6.2, C.coat) + clip(`ct${k}`, skull, `<ellipse cx="${r2(hx - 0.8)}" cy="${r2(hy + 5.6)}" rx="6.2" ry="3.4" fill="${C.shade}"/><path d="M${at(-3.4, -4.4)} Q${at(0, -6.4)} ${at(3.4, -4.4)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.6"/>`) + E(hx, hy, 6.8, 6.2, "none");
        s += E(hx + 5.2, hy + 2.6, 1.3, 0.7, "#F6C2C2", 0);
        s += ear3(hx + 4.6, hy - 3.2, 24, 1, false, true) + far.svg + near.svg;
      }
      s += tw ? sparkle(hx - 14, hy - 13, 1.5) + sparkle(hx + 14.2, hy - 20.4, 1) + sparkle(hx + 1, hy - 25.6, 0.85) : sparkle(hx - 11.4, hy - 24.4, 1.1) + sparkle(hx + 15, hy - 12.4, 1.4) + sparkle(hx - 2, hy - 26.4, 0.75);
      return `<g transform="translate(${r2(hx)} ${r2(hy)}) scale(1.22) translate(${r2(-hx)} ${r2(-hy)})">${s}</g>`;
    }
    __name(head3, "head3");
    function bib(x0, x1, y0, y1, n) {
      const xc = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      const pt = /* @__PURE__ */ __name((t) => [xc - hw + 2 * hw * t, y1 - 3.2 * (2 * t - 1) ** 2], "pt");
      let edge = `M${pt(0).map(r2)}`;
      for (let i = 1; i <= n; i++) {
        const [ax, ay] = pt((i - 1) / n), [bx, by] = pt(i / n), [mx, my] = pt((i - 0.5) / n);
        edge += ` Q${r2(mx + (mx - xc) * 0.08)},${r2(my + 2)} ${r2(bx)},${r2(by)}`;
      }
      const [lx, ly] = pt(0), [rx, ry] = pt(1);
      const d = `M${r2(xc - hw * 0.6)},${r2(y0)} C${r2(xc - hw * 1.04)},${r2(y0 + 2.6)} ${r2(lx - 0.4)},${r2(ly - 3)} ${r2(lx)},${r2(ly)}${edge.replace(/^M[^ ]+/, "")} C${r2(rx + 0.4)},${r2(ry - 3)} ${r2(xc + hw * 1.04)},${r2(y0 + 2.6)} ${r2(xc + hw * 0.6)},${r2(y0)} Z`;
      const tufts = [[0.3, 0.45], [0.62, 0.4], [0.46, 0.7]].map(([tx, ty]) => `M${r2(x0 + 2 * hw * tx - 0.8)},${r2(y0 + (y1 - y0) * ty)} q0.8,1.3 1.6,0`).join(" ");
      return P(d, C.belly, 0) + P(edge, "none", 0.8) + `<path d="${tufts}" fill="none" stroke="${C.coatS}" stroke-width="0.7" stroke-linecap="round"/>`;
    }
    __name(bib, "bib");
    function collar(x0, x1, y, n) {
      const w = x1 - x0;
      let edge = `M${r2(x0)},${r2(y)}`;
      for (let i = 1; i <= n; i++) edge += ` Q${r2(x0 + w * (i - 0.5) / n)},${r2(y + 1.8)} ${r2(x0 + w * i / n)},${r2(y - (i === n ? 0.6 : 0))}`;
      return P(`${edge} L${r2(x1 - 0.6)},${r2(y - 4)} L${r2(x0 + 0.6)},${r2(y - 4)} Z`, C.belly, 0) + P(edge, "none", 0.8);
    }
    __name(collar, "collar");
    function cerf3(view, pose, n, blink) {
      const se = view === "avant";
      const k = `${view}${pose}${n}${blink ? 1 : 0}`;
      const rest = pose === "repos";
      const by = !rest && n ? -0.6 : 0, ph = n ? -1 : 1;
      let s = `<defs><radialGradient id="cg${k}"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="0.4"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="44" rx="40" ry="36" fill="url(#cg${k})"/>`;
      const a = se ? 16 : -16;
      const [cx, cy, rx, ry] = rest ? [se ? 36 : 38, 67.4, 15, 8.2] : [se ? 35.6 : 38, 49.4 + by, se ? 13.8 : 14.6, 9.2];
      const d = eggPath(cx, cy, rx, ry, rest ? a * 0.6 : a, se ? 0.1 : -0.1);
      const [hx, hy] = rest ? se ? [52.2, 44.6] : [51, 47.6] : se ? [52.6, 25.6 + by] : [50.8, 27.6 + by];
      s += `<ellipse cx="${se ? 37 : 39}" cy="${rest ? 76.4 : 73.6}" rx="${rest ? 19 : 20}" ry="${rest ? 2.6 : 4.4}" fill="rgba(40,55,20,.18)" transform="rotate(${se ? 8 : -8} ${se ? 37 : 39} ${rest ? 76.4 : 73.6})"/>`;
      if (!rest) {
        const st = 1.4 * ph;
        const L4 = se ? [
          { hip: [30, 50.6], foot: [29.4, 69], hind: 1, near: 0, sw: st },
          { hip: [24.4, 52.4], foot: [23, 71.2], hind: 1, near: 1, sw: -st },
          { hip: [49.4, 56], foot: [50.6, 74.6], hind: 0, near: 0, sw: -st },
          { hip: [43.4, 58], foot: [44, 77], hind: 0, near: 1, sw: st }
        ] : [
          { hip: [45.4, 49.6], foot: [45.4, 68.6], hind: 0, near: 0, sw: st },
          { hip: [50.4, 51.4], foot: [52, 70.6], hind: 0, near: 1, sw: -st },
          { hip: [24.4, 55.4], foot: [23.6, 74.6], hind: 1, near: 0, sw: -st },
          { hip: [29.6, 57.2], foot: [30.5, 77], hind: 1, near: 1, sw: st }
        ];
        for (const l of L4) {
          const fx = l.foot[0] + l.sw * 0.9, fy = l.foot[1] + l.sw * (se ? 0.32 : -0.32);
          const hip = [l.hip[0], l.hip[1] + by], mid = [(hip[0] + fx) / 2 + (l.hind ? -1.3 : 0.6), (hip[1] + fy) / 2 + 0.6];
          const [w0, w1] = l.near ? l.hind ? [4.6, 2.9] : [4.8, 3] : [4.2, 2.6];
          s += leg([hip, mid, [fx, fy - 1.6]], w0, w1, l.near ? C.coat : C.coatS) + hoof3(fx, fy, l.near ? C.hoof : C.hoofS, se);
        }
      }
      const neckD = se ? rest ? [[42.6, 64], [44.2, 57.4], [46.8, 51.6], [55.8, 51], [55, 56.4], [55, 64]] : [[42.4, 47.6], [43.8, 40.6], [46.6, 34.4], [56.4, 32.4], [55.2, 37.8], [55.4, 47.6]] : rest ? [[44.6, 63], [45.2, 58], [46.4, 54], [56, 52.6], [55.6, 57.6], [53.6, 63.4]] : [[44.2, 42.6], [45, 37.4], [46.2, 33.4], [55.8, 32], [55.4, 37.4], [52.4, 44.8]];
      const nk = neckD.map(([x, y]) => [x, rest ? y : y + by]);
      const neckPath = `M${nk[0].map(r2)} C${nk[1].map(r2)} ${nk[2].map(r2)} ${r2(nk[2][0] + 0.4)},${r2(nk[2][1] - 1.2)} L${r2(nk[3][0])},${r2(nk[3][1] - 1)} C${nk[3].map(r2)} ${nk[4].map(r2)} ${nk[5].map(r2)} Z`;
      const neckLines = `M${nk[0].map(r2)} C${nk[1].map(r2)} ${nk[2].map(r2)} ${r2(nk[2][0] + 0.4)},${r2(nk[2][1] - 1.2)} M${r2(nk[3][0])},${r2(nk[3][1] - 1)} C${nk[3].map(r2)} ${nk[4].map(r2)} ${nk[5].map(r2)}`;
      const neck = P(neckPath, C.coat, 0) + P(neckLines, "none");
      if (!se) s += neck + collar(hx - 5.6, hx + 5.4, hy + 7.4, 4) + head3(view, hx, hy, false, n, k);
      if (se) s += rest ? tail(21.8, 62.4, 12) : tail(21.6, 43.8 + by, n ? 4 : 16);
      const u = /* @__PURE__ */ __name((t, v) => {
        const c = Math.cos((rest ? a * 0.6 : a) * DEG), sn = Math.sin((rest ? a * 0.6 : a) * DEG);
        const x = t * rx, y = v * ry;
        return [r2(cx + x * c - y * sn), r2(cy + x * sn + y * c)];
      }, "u");
      const haunch = se ? `M${u(-0.62, -0.5)} Q${u(-0.82, 0.3)} ${u(-0.4, 0.86)}` : `M${u(-0.2, -0.62)} Q${u(0.06, 0.2)} ${u(-0.24, 0.9)}`;
      const shoulder = se ? `M${u(0.48, -0.56)} Q${u(0.7, 0.2)} ${u(0.5, 0.92)}` : `M${u(0.56, -0.7)} Q${u(0.74, 0.1)} ${u(0.58, 0.82)}`;
      const spots = (se ? [[-0.4, -0.5], [-0.05, -0.62], [0.3, -0.44], [-0.2, -0.18], [0.12, -0.12]] : [[-0.5, -0.4], [-0.12, -0.6], [0.26, -0.52], [-0.28, -0.12], [0.1, -0.2]]).map(([t, v], i) => {
        const [x, y] = u(t, v);
        return [x, y, [1.6, 1.3, 1.4, 1.1, 1.1][i], [1.1, 0.9, 1, 0.8, 0.8][i]];
      });
      s += P(d, C.coat) + clip(`cb${k}`, d, `<ellipse cx="${u(0.05, 1)[0]}" cy="${u(0.05, 1)[1] + 1.4}" rx="${r2(rx * 1.2)}" ry="${r2(ry * 0.56)}" fill="${C.shade}"/>` + (se ? "" : `<ellipse cx="${u(-0.86, 0.1)[0]}" cy="${u(-0.86, 0.1)[1]}" rx="${r2(rx * 0.36)}" ry="${r2(ry * 0.66)}" fill="${C.belly}"/>`) + `<path d="${haunch}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/><path d="${shoulder}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/>` + spots.map(([x, y, sx, sy]) => E(x, y, sx, sy, C.spot, 0)).join("") + `<path d="M${u(-0.5, -0.86)} Q${u(0, -1.12)} ${u(0.42, -0.9)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>`) + P(d, "none");
      if (rest) s += se ? seg([24.6, 73.8], [30.6, 75.8], 4.6, OUT) + seg([24.6, 73.8], [30.6, 75.8], 2.4, C.coat) + E(32.4, 76, 1.8, 1.2, C.hoof, 0.8) + seg([44, 73.4], [49.8, 75.4], 5, OUT) + seg([44, 73.4], [49.8, 75.4], 2.8, C.coat) + E(51.6, 75.8, 1.9, 1.3, C.hoof, 0.8) : seg([31.4, 74.6], [37.6, 76], 4.8, OUT) + seg([31.4, 74.6], [37.6, 76], 2.6, C.coat) + E(39.4, 76.2, 1.8, 1.2, C.hoof, 0.8);
      if (!se) {
        const [tx, ty] = u(-0.92, -0.4), w = rest ? 0 : ph * 0.5;
        s += P(`M${r2(tx + 0.6)},${r2(ty - 2.2)} Q${r2(tx - 3.6 + w)},${r2(ty + 0.2)} ${r2(tx - 1 + w)},${r2(ty + 4.8)} Q${r2(tx + 3)},${r2(ty + 2.6)} ${r2(tx + 0.6)},${r2(ty - 2.2)} Z`, C.belly, 0.9) + `<path d="M${r2(tx - 0.2)},${r2(ty)} q-0.6,1.6 -0.2,3" fill="none" stroke="${C.coatS}" stroke-width="0.6" stroke-linecap="round"/>`;
      }
      if (se) s += neck + (rest ? bib(43.6, 55.2, 55.4, 65.4, 5) : bib(43.2, 55.2, 38.6 + by, 49.6 + by, 5)) + head3(view, hx, hy, blink, n, k);
      return s;
    }
    __name(cerf3, "cerf3");
    var svgC = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${92 * scale}" viewBox="0 -12 80 92">${body}</svg>`, "svgC");
    module.exports = { cerfFrame, svgC };
  }
});

// atelier/passeur.js
var require_passeur = __commonJS({
  "atelier/passeur.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, r2 } = require_troupe2();
    var C = {
      skin: "#C9C4BC",
      skinS: "#A9A39A",
      shadow: "#3A3F4A",
      shadowS: "#2A2E37",
      glowEye: "#F6E7A0",
      feather: "#9AA0A8",
      featherS: "#7E848C",
      featherH: "#C2C7CE",
      pole: "#5A4632",
      iron: "#3E4248",
      light: "#FFE08A"
    };
    var HY = -0.6;
    var featherRows = /* @__PURE__ */ __name((x0, x1, ys) => ys.map((y, r) => {
      let d = `M${x0},${y}`;
      for (let x = x0; x < x1; x += 3) d += ` Q${r2(x + 1.5)},${y + 2.2} ${r2(x + 3)},${y}`;
      return `<path d="${d}" fill="none" stroke="${r % 2 ? C.featherS : C.featherH}" stroke-width="0.7"/>`;
    }).join(""), "featherRows");
    function lantern(x, y, big = 0) {
      const id = `pl${Math.round(x * 10)}${Math.round(y * 10)}${big}`;
      return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(255,224,138)" stop-opacity="${0.6 + big * 0.2}"/><stop offset="1" stop-color="rgb(255,224,138)" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y + 4}" r="${5.2 + big * 1.2}" fill="url(#${id})"/>` + L([x, y - 2.6], [x, y], OUT, 0.7) + P(`M${r2(x - 2.4)},${y} L${r2(x + 2.4)},${y} L${r2(x + 3)},${y + 2} L${r2(x + 3)},${y + 6.4} L${r2(x - 3)},${y + 6.4} L${r2(x - 3)},${y + 2} Z`, C.light, 0.9) + L([x - 3, y + 2], [x + 3, y + 2], C.iron, 0.8) + L([x, y + 2], [x, y + 6.4], C.iron, 0.6) + P(`M${r2(x - 3.2)},${y + 6.4} L${r2(x + 3.2)},${y + 6.4} L${r2(x + 2.2)},${y + 7.8} L${r2(x - 2.2)},${y + 7.8} Z`, C.iron, 0.6) + E(x - 1, y + 3.6, 0.6, 1.2, "#FFFFFF", 0);
    }
    __name(lantern, "lantern");
    function pole(h, top, big = 0) {
      const bottom = [h[0] - (top[0] - h[0]) * 0.18, h[1] + 7];
      return limb(bottom, [top[0], top[1]], 1.4, C.pole) + `<path d="M${top[0]},${top[1]} Q${top[0] + 1},${top[1] - 3} ${top[0] + 4.6},${top[1] - 2}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M${top[0]},${top[1]} Q${top[0] + 1},${top[1] - 3} ${top[0] + 4.6},${top[1] - 2}" fill="none" stroke="${C.pole}" stroke-width="1.2" stroke-linecap="round"/>` + lantern(top[0] + 4.6, top[1] + 0.6, big) + E(h[0], h[1], 2.1, 2.1, C.skin);
    }
    __name(pole, "pole");
    var CAPE = "M15,33 Q24,29.6 33,33 L37.6,58.6 Q24,62 10.4,58.6 Z";
    var ROBE = "M16.4,33.2 Q24,30.6 31.6,33.2 L34,58 Q24,60.6 14,58 Z";
    var passeur2 = {
      name: "Le Passeur",
      uid: "pa",
      teintes: [C.feather, C.shadow],
      skin: C.skin,
      skinS: C.skinS,
      sleeve: C.feather,
      cuff: C.featherS,
      armW: 4,
      leg: "#3A3F4A",
      legS: "#2A2E37",
      legW: 4.6,
      hip: 50,
      ground: 56.6,
      shoe: "#2E3138",
      shoeS: "#1E2026",
      shoeH: "#4A4E56",
      legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
      shoulders: [[16, 34.4], [32, 34.4]],
      hands: [[14.4, 45.6], [33.6, 45.6]],
      action: ["face_lanterne", "front"],
      // la perche ne quitte pas sa main droite ; elle passe devant la capuche (à côté du visage)
      holdOver: true,
      hold(c, h) {
        return pole(h, [h[0] + 5.2, h[1] - 39]);
      },
      backItems(c, { view }) {
        if (view === "ne") return "";
        return P(CAPE, C.feather) + clip(`${c.uid}k`, CAPE, `<rect x="27" y="30" width="12" height="32" fill="${C.featherS}"/>${featherRows(9, 39, [38, 43, 48, 53, 57])}`) + P(CAPE, "none");
      },
      body(c, { view }) {
        const shape = view === "ne" ? CAPE : ROBE;
        let s = P(shape, C.feather) + clip(`${c.uid}r`, shape, `<rect x="${view === "se" ? 26 : 27.6}" y="30" width="12" height="32" fill="${C.featherS}"/>${featherRows(9, 39, [37, 41.4, 45.8, 50.2, 54.6])}`) + P(shape, "none");
        if (view !== "ne") s += P(`M${view === "se" ? 22.4 : 24},34.4 L${view === "se" ? 21.8 : 24},59`, "none", 0.8);
        return s;
      },
      head(c, ctx) {
        const { view } = ctx;
        const hood = "M10.6,30.4 Q9.6,14.6 18,8.6 Q23,4.8 27.2,3.4 Q27,6.8 30,8.4 Q38.4,13.2 37.4,30.4 Q36.6,34 33,34.6 L15,34.6 Q11.4,34 10.6,30.4 Z";
        let s = "";
        s += P(hood, C.feather) + clip(`${ctx.id}h`, hood, `<rect x="27.4" y="0" width="14" height="36" fill="${C.featherS}"/>${featherRows(8, 40, [12, 17, 22, 27, 32])}`) + P(hood, "none");
        if (view === "ne") return `<g transform="translate(0 ${HY})">${s}</g>`;
        const k = view === "se" ? -1.6 : 0;
        const opening = `M${14.4 + k},30 Q${13.6 + k},14.6 ${24 + k},13.4 Q${34.4 + k},14.6 ${33.6 + k},30 Q${24 + k},34.4 ${14.4 + k},30 Z`;
        s += P(opening, C.shadow) + clip(`${ctx.id}o`, opening, `<ellipse cx="${24 + k}" cy="14" rx="12" ry="4.6" fill="${C.shadowS}"/>`) + P(opening, "none");
        s += expression({
          eyes: view === "se" ? [[20.4 + k + 1.4, 22.8, 1.25], [27.4 + k + 1.4, 22.8, 1.1]] : [[20.2, 22.8, 1.3], [27.8, 22.8, 1.3]],
          ry: 1.7,
          eyeColor: C.glowEye,
          brow: "none",
          browY: -3.4,
          browW: 0.8,
          mouth: [24 + k, 27.4],
          mw: 1.4,
          mouthC: C.shadowS,
          tongue: C.shadowS,
          neutral: /* @__PURE__ */ __name(() => "", "neutral"),
          cheeks: [],
          cheekY: 26,
          temple: [9.4, 22],
          anger: [9.4, 11],
          zz: [4.6, 13]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          const h2 = this.hands[1];
          return { left: arm(this, [16, 34.4], n === 0 ? [10.6, 26.6] : [9.6, 28.4]), right: arm(this, [32, 34.4], h2), over: pole(h2, [h2[0] + 5.2, h2[1] - 39]) };
        }
        const h = n ? [34.4, 36.4] : [34, 38.6];
        const wisps = n ? ["M8,20 Q4,14 10,10 Q15,8 13,4", "M40,40 Q46,36 43,30", "M6,44 Q2,40 6,36"].map((d) => `<path d="${d}" fill="none" stroke="#E6EEF5" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`).join("") : "";
        return { expr: n ? "surpris" : "neutre", right: arm(this, [32, 34.4], h, [36.4, 40.4]), over: pole(h, [h[0] + 4.2, 5.6], 1) + wisps };
      }
    };
    passeur2.pose = passeur2.pose.bind(passeur2);
    var TALL = 1.25;
    var tall = /* @__PURE__ */ __name((body) => `<g transform="translate(30 78) scale(${TALL}) translate(-24 -62)">${body.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${r2(+w / TALL)}"`)}</g>`, "tall");
    passeur2.svgP = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${60 * scale}" height="${80 * scale}" viewBox="0 0 60 80">${tall(body)}</svg>`;
    module.exports = passeur2;
  }
});

// atelier/noms_personnages.js
var require_noms_personnages = __commonJS({
  "atelier/noms_personnages.js"(exports, module) {
    function nomPersonnage(rel) {
      const parts = rel.split("/");
      const base = parts.pop().replace(/\.svg$/, "");
      const [top, a, b] = parts;
      const out = /* @__PURE__ */ __name((dirs, name) => [...dirs, name + ".svg"].join("/"), "out");
      if (top === "vivants" && a === "cerf") {
        const m = base.match(/^cerf_(?:(avant|dos)_)?([a-z]+)(?:_(\d+))?$/);
        return out([top, "cerf-blanc"], ["cerf-blanc", m[1] || "profil", m[2], m[3]].filter(Boolean).join("_"));
      }
      if (top === "personnages") {
        if (a === "naufrages") {
          if (base.startsWith(b + "_naufrage_")) return out([top, a, b], `${b}-naufrage_${base.slice(b.length + 10)}`);
          throw new Error("naufragé inattendu : " + rel);
        }
      }
      return rel;
    }
    __name(nomPersonnage, "nomPersonnage");
    var MIROIR_KIT = /^(personnages\/maitres\/[a-z]+|personnages\/naufrages\/[a-z]+|personnages\/avatar\/avatar-\d+(?:-naufrage)?|personnages\/visiteurs\/visiteur-\d+|personnages\/epilogue\/arrivant-\d+|vivants\/(anya|passeur))\/[a-z0-9-]+_avant_/;
    function miroir(svg) {
      const m = svg.match(/^(<svg[^>]*viewBox="([^"]+)"[^>]*>)([\s\S]*)(<\/svg>\s*)$/);
      if (!m) throw new Error("SVG inattendu pour le miroir");
      const [x, , w] = m[2].trim().split(/[\s,]+/).map(Number);
      return `${m[1]}<g transform="translate(${2 * x + w} 0) scale(-1 1)">${m[3]}</g>${m[4]}`;
    }
    __name(miroir, "miroir");
    function vitessePersonnage(id, pose) {
      const [top, a] = id.split("/");
      if (top === "vivants") {
        if (a === "brume") return /expr/.test(id) ? 600 : 220;
        if (a === "cerf-blanc") return pose === "repos" ? [1800, 180] : 300;
        if (pose === "marche") return a === "anya" ? 130 : 100;
        if (a === "anya") return pose === "repos" || pose === "expr" ? [1100, 900, 1100, 180] : pose === "benediction" ? 400 : [700, 900];
        if (a === "passeur") return pose === "repos" || pose === "expr" ? [700, 600, 700, 160] : pose === "salut" ? 190 : [700, 900];
        return pose === "repos" ? a === "anya" ? 1200 : [900, 160] : [700, 900];
      }
      if (top === "personnages") {
        if (/^(marche|lanterne|parapluie)$/.test(pose)) return 85;
        if (pose === "repos") return [700, 600, 700, 160];
        if (pose === "salut") return 160;
        if (pose === "dort" || pose === "couche") return 900;
        if (pose === "expr") return [700, 600, 700, 160];
        if (pose === "grelotter") return 140;
        if (pose === "lire") return [1400, 900];
        if (pose === "ramasser") return [500, 800];
        return [700, 1100];
      }
      return void 0;
    }
    __name(vitessePersonnage, "vitessePersonnage");
    module.exports = { nomPersonnage, MIROIR_KIT, miroir, vitessePersonnage };
  }
});

// atelier/generateur_vivants.mjs
var import_brume = __toESM(require_brume(), 1);
var import_anya = __toESM(require_anya(), 1);
var import_cerf = __toESM(require_cerf(), 1);
var import_passeur = __toESM(require_passeur(), 1);
var import_troupe = __toESM(require_troupe2(), 1);
var import_noms_personnages = __toESM(require_noms_personnages(), 1);
var cadreDe = /* @__PURE__ */ __name((svg) => svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number), "cadreDe");
function rendu(lib, svg, pose, images) {
  const rel = import_noms_personnages.default.nomPersonnage(lib);
  if (import_noms_personnages.default.MIROIR_KIT.test(rel)) svg = import_noms_personnages.default.miroir(svg);
  const id = rel.replace(/(_\d+)?\.svg$/, "");
  return { fichier: rel, svg, cadre: cadreDe(svg), ms_par_image: images > 1 ? import_noms_personnages.default.vitessePersonnage(id, pose) ?? null : null };
}
__name(rendu, "rendu");
var sans = /* @__PURE__ */ __name(({ fichier, ...r }) => r, "sans");
var dans = /* @__PURE__ */ __name((liste2, quoi, x) => {
  if (!liste2.includes(x)) throw new Error(`${quoi} : ${x} (${liste2.join(", ")})`);
}, "dans");
var image = /* @__PURE__ */ __name((n, max) => {
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
}, "image");
var suffixe = /* @__PURE__ */ __name((saison) => saison === "ete" ? "" : `_${saison}`, "suffixe");
var STADES = Object.keys(import_brume.default.STAGES);
var EXPR_BRUME = import_troupe.default.EXPRS.filter((x) => x !== "fache");
var EXPR_ANYA = import_troupe.default.EXPRS.filter((x) => !["fache", "gene", "rire", "endormi"].includes(x));
var POSES_PASSEUR = [...import_troupe.default.POSES, [import_passeur.default.action[0], import_passeur.default.action[1], "action", 2]];
var CERF = { profil: ["marche", "repos", "clignement"], avant: ["marche", "repos", "clignement"], dos: ["marche", "repos"] };
var VIVANTS = {
  brume: { stades: STADES, images: 4, expressions: EXPR_BRUME, images_expression: 2 },
  anya: { postures: Object.fromEntries(import_anya.default.POSES_A.map(([nom, , , k]) => [nom, k])), saisons: import_anya.default.SAISONS_A, expressions: EXPR_ANYA, images_expression: import_troupe.default.IMAGES.repos },
  cerf: { vues: CERF, images_marche: 2 },
  passeur: { postures: Object.fromEntries(POSES_PASSEUR.map(([nom, , , k]) => [nom, k])), expressions: import_troupe.default.EXPRS, images_expression: import_troupe.default.IMAGES.repos }
};
function brume_(stade, n) {
  dans(STADES, "stade inconnu", stade);
  image(n, 4);
  return rendu(`vivants/brume/brume_${stade}_${n}.svg`, import_brume.default.svgB(import_brume.default.brumeFrame(stade, n - 1)), stade, 4);
}
__name(brume_, "brume_");
function brumeExpression_(expr, n) {
  dans(EXPR_BRUME, "expression inconnue", expr);
  image(n, 2);
  return rendu(`vivants/brume/brume_expr_${expr}_${n}.svg`, import_brume.default.svgB(import_brume.default.brumeEyes(n - 1, expr)), "expr", 2);
}
__name(brumeExpression_, "brumeExpression_");
function anya_(posture, n, saison = "ete") {
  const p = import_anya.default.POSES_A.find((x) => x[0] === posture);
  if (!p) throw new Error(`posture inconnue : ${posture} (${import_anya.default.POSES_A.map((x) => x[0]).join(", ")})`);
  const [, view, pose, k] = p;
  dans(import_anya.default.SAISONS_A, "saison inconnue", saison);
  image(n, k);
  return rendu(`vivants/anya/anya_${posture}${suffixe(saison)}_${n}.svg`, import_anya.default.svgA(import_anya.default.anyaFrame(view, pose, n - 1, import_anya.default.EXPR_OF[pose], saison)), posture.split("_")[1], k);
}
__name(anya_, "anya_");
function anyaExpression_(expr, n, saison = "ete") {
  dans(EXPR_ANYA, "expression inconnue", expr);
  dans(import_anya.default.SAISONS_A, "saison inconnue", saison);
  image(n, import_troupe.default.IMAGES.repos);
  return rendu(`vivants/anya/anya_expr_${expr}${suffixe(saison)}_${n}.svg`, import_anya.default.svgA(import_anya.default.anyaFrame("front", "repos", n - 1, expr, saison)), "expr", import_troupe.default.IMAGES.repos);
}
__name(anyaExpression_, "anyaExpression_");
function cerf_(vue, pose, n = 1) {
  if (!CERF[vue]) throw new Error(`vue inconnue : ${vue} (${Object.keys(CERF).join(", ")})`);
  dans(CERF[vue], "pose inconnue", pose);
  const k = pose === "marche" ? 2 : 1;
  image(n, k);
  const b = pose === "clignement" ? import_cerf.default.cerfFrame("marche", 0, true, vue) : import_cerf.default.cerfFrame(pose, n - 1, false, vue);
  const lib = `vivants/cerf/cerf_${vue === "profil" ? "" : vue + "_"}${pose}${k > 1 ? `_${n}` : ""}.svg`;
  return rendu(lib, import_cerf.default.svgC(b), pose, k);
}
__name(cerf_, "cerf_");
function passeur_(posture, n) {
  const p = POSES_PASSEUR.find((x) => x[0] === posture);
  if (!p) throw new Error(`posture inconnue : ${posture} (${POSES_PASSEUR.map((x) => x[0]).join(", ")})`);
  const [, view, pose, k] = p;
  image(n, k);
  return rendu(`vivants/passeur/passeur_${posture}_${n}.svg`, import_passeur.default.svgP(import_troupe.default.frame(import_passeur.default, view, pose, n - 1)), posture.split("_")[1], k);
}
__name(passeur_, "passeur_");
function passeurExpression_(expr, n) {
  dans(import_troupe.default.EXPRS, "expression inconnue", expr);
  image(n, import_troupe.default.IMAGES.repos);
  return rendu(`vivants/passeur/passeur_expr_${expr}_${n}.svg`, import_passeur.default.svgP(import_troupe.default.frame(import_passeur.default, "front", "repos", n - 1, expr)), "expr", import_troupe.default.IMAGES.repos);
}
__name(passeurExpression_, "passeurExpression_");
var brume = /* @__PURE__ */ __name((...a) => sans(brume_(...a)), "brume");
var brumeExpression = /* @__PURE__ */ __name((...a) => sans(brumeExpression_(...a)), "brumeExpression");
var anya = /* @__PURE__ */ __name((...a) => sans(anya_(...a)), "anya");
var anyaExpression = /* @__PURE__ */ __name((...a) => sans(anyaExpression_(...a)), "anyaExpression");
var cerf = /* @__PURE__ */ __name((...a) => sans(cerf_(...a)), "cerf");
var passeur = /* @__PURE__ */ __name((...a) => sans(passeur_(...a)), "passeur");
var passeurExpression = /* @__PURE__ */ __name((...a) => sans(passeurExpression_(...a)), "passeurExpression");
function liste() {
  const out = [];
  const ajoute = /* @__PURE__ */ __name((fonction, f, args) => out.push({ fichier: f(...args).fichier, fonction, args }), "ajoute");
  for (const s of STADES) for (let n = 1; n <= 4; n++) ajoute("brume", brume_, [s, n]);
  for (const x of EXPR_BRUME) for (let n = 1; n <= 2; n++) ajoute("brumeExpression", brumeExpression_, [x, n]);
  for (const saison of import_anya.default.SAISONS_A) {
    for (const [nom, , , k] of import_anya.default.POSES_A) for (let n = 1; n <= k; n++) ajoute("anya", anya_, [nom, n, saison]);
    for (const x of EXPR_ANYA) for (let n = 1; n <= import_troupe.default.IMAGES.repos; n++) ajoute("anyaExpression", anyaExpression_, [x, n, saison]);
  }
  for (const [vue, poses] of Object.entries(CERF)) for (const p of poses) for (let n = 1; n <= (p === "marche" ? 2 : 1); n++) ajoute("cerf", cerf_, [vue, p, n]);
  for (const [nom, , , k] of POSES_PASSEUR) for (let n = 1; n <= k; n++) ajoute("passeur", passeur_, [nom, n]);
  for (const x of import_troupe.default.EXPRS) for (let n = 1; n <= import_troupe.default.IMAGES.repos; n++) ajoute("passeurExpression", passeurExpression_, [x, n]);
  return out;
}
__name(liste, "liste");
export {
  VIVANTS,
  anya,
  anyaExpression,
  brume,
  brumeExpression,
  cerf,
  liste,
  passeur,
  passeurExpression
};
