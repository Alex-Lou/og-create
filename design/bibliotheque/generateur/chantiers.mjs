// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_chantiers.mjs : ne pas modifier à la main.
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
    var OUT7 = "#3C2819";
    var W = 1.1;
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT7}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P2 = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E2 = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT7, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var IMAGES7 = { repos: 4, marche: 8, salut: 4, action: 2 };
    var lerp2 = /* @__PURE__ */ __name((a, b, k) => Array.isArray(a) ? a.map((v, i) => r22(v + (b[i] - v) * k)) : r22(a + (b - a) * k), "lerp");
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
      couleurs.delete(OUT7);
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
        if (mode === "blink") s += P2(`M${r22(x - 1.7)},${r22(y + 0.4)} Q${x},${r22(y + 1.8)} ${r22(x + 1.7)},${r22(y + 0.4)}`, "none", 1);
        else if (mode === "joy") s += P2(`M${r22(x - 1.8)},${r22(y + 1)} Q${x},${r22(y - 1.2)} ${r22(x + 1.8)},${r22(y + 1)}`, "none", 1.1);
        else if (mode === "wink" && i === 1) s += P2(`M${r22(x - 1.6)},${r22(y + 0.2)} L${r22(x + 1.6)},${r22(y + 0.2)}`, "none", 1);
        else if (mode === "big") s += E2(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E2(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E2(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P2(`M${r22(x - k * 1.3)},${r22(y - 1.4)} L${r22(x + k * 1.1)},${y} L${r22(x - k * 1.3)},${r22(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r22(x - rx)},${r22(top)} Q${x},${r22(top - 0.9)} ${r22(x + rx)},${r22(top)} A${rx} ${r22(ry * 0.85)} 0 0 1 ${r22(x - rx)},${r22(top)} Z" fill="${EYE}"/>` + E2(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P2(`M${r22(x - rx - 0.5)},${r22(top + 0.3)} Q${x},${r22(top - 1.1)} ${r22(x + rx + 0.5)},${r22(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r22(top + (k > 0 ? tO : tI)), yr = r22(top + (k > 0 ? tI : tO));
          s += `<path d="M${r22(x - rx)},${yl} L${r22(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r22(x - rx)},${yl} Z" fill="${EYE}"/>` + E2(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P2(`M${r22(x - rx - 0.4)},${r22(yl - (yr - yl) * 0.12)} L${r22(x + rx + 0.4)},${r22(yr + (yr - yl) * 0.12)}`, "none", 1);
        } else s += E2(x, y, rx, ry, EYE, 0) + E2(x + 0.55, y - 1, 0.62, 0.62, WHITE, 0) + E2(x - 0.5, y + 1, 0.3, 0.3, WHITE, 0);
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
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P2(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, fill, w) + E2(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
    var zee = /* @__PURE__ */ __name((x, y, z) => {
      const d = `M${r22(x)},${r22(y)} L${r22(x + z)},${r22(y)} L${r22(x)},${r22(y + z)} L${r22(x + z)},${r22(y + z)}`;
      return `<path d="${d}" fill="none" stroke="${OUT7}" stroke-width="${r22(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r22(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
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
        return P2(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E2(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P2(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r22(mx - w)},${my} Q${mx},${r22(my + w * 0.94)} ${r22(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E2(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r22(mx - 1.4)},${r22(my + 1.1)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.4)},${r22(my + 1.1)}`);
      else if (expr === "fache") s += P2(`M${r22(mx - 1.7)},${r22(my + 1.3)} Q${mx},${r22(my - 0.4)} ${r22(mx + 1.7)},${r22(my + 1.3)} Q${mx},${r22(my + 0.7)} ${r22(mx - 1.7)},${r22(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P2(`M${r22(mx - 1.8)},${r22(my + 0.6)} Q${r22(mx - 1.2)},${r22(my - 0.1)} ${r22(mx - 0.6)},${r22(my + 0.6)} Q${mx},${r22(my + 1.3)} ${r22(mx + 0.6)},${r22(my + 0.6)} Q${r22(mx + 1.2)},${r22(my - 0.1)} ${r22(mx + 1.8)},${r22(my + 0.6)}`, "none", 0.8);
      else if (expr === "endormi") s += E2(mx, my + 0.7, 0.6, 0.75, g.mouthC, 0.8);
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
      const body = P2(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P2(d, "none") + E2(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 2.3)},${r22(y)} L${r22(x + 2.3)},${r22(y)} Q${r22(x + 2.9)},${r22(y + 3.4)} ${r22(x + 1.4)},${r22(y + 4.3)} L${r22(x - 1.4 - toe)},${r22(y + 4.3)} Q${r22(x - 3.1 - toe)},${r22(y + 3.8)} ${r22(x - 2.3)},${r22(y)} Z`;
      let s = P2(d, c.skin) + E2(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT7, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      const top = c.hip;
      return `<rect x="${r22(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r22(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r22(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r22(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function enfoncer(pts4) {
      const [a, n] = pts4, len = Math.hypot(n[0] - a[0], n[1] - a[1]) || 1;
      return [[r22(a[0] + (n[0] - a[0]) / len * 1.1), r22(a[1] + (n[1] - a[1]) / len * 1.1)], ...pts4.slice(1)];
    }
    __name(enfoncer, "enfoncer");
    function arm(c, a, b, elbow, main, partie = "tout") {
      const pts4 = enfoncer(elbow ? [a, elbow, b] : [a, b]);
      if (c.sleeves || c.bandage) return armOf(c, pts4, main, partie);
      const d = "M" + pts4.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = "";
      if (partie !== "devant") {
        s += line(OUT7, c.armW + W * 2) + line(c.sleeve, c.armW);
        if (c.cuff) {
          const f = pts4[pts4.length - 2];
          const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
          const at = /* @__PURE__ */ __name((k) => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len], "at");
          s += limb(at(2.5), at(0.9), c.armW, c.cuff);
        }
      }
      if (partie === "derriere") return s;
      return s + (main != null ? main : poing(c, b));
    }
    __name(arm, "arm");
    var poing = /* @__PURE__ */ __name((c, b) => E2(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E2(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ""), "poing");
    function armOf(c, pts4, main, partie = "tout") {
      const b = pts4[pts4.length - 1], f = pts4[pts4.length - 2];
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
        const d = path([...pts4.slice(0, -1), cut]);
        if (derriere) s += stroke(d, OUT7, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
        const fd = path([cut, b]);
        s += stroke(fd, OUT7, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P22 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
        const ombre3 = /* @__PURE__ */ __name((rr, dk) => `<path d="M${pt(P22(rr * 0.7, dk + rr * 0.55))} Q${pt(P22(0, dk + rr * 1.25))} ${pt(P22(-rr * 0.7, dk + rr * 0.55))}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="0.6" stroke-linecap="round"/>`, "ombre");
        if (c.sleeves === "court") {
          const e = path([at(k + 1.6), at(k - 0.4)]);
          s += stroke(e, OUT7, c.armW + W * 2) + stroke(e, c.sleeve, c.armW) + ombre3(c.armW / 2 + 1.1, -0.4);
        } else if (c.sleeves === "torn") {
          const zig = [P22(h, -0.5), P22(h * 0.45, 1.5), P22(0, 0.4), P22(-h * 0.5, 1.6), P22(-h, -0.5)];
          s += `<path d="${path([P22(h, -1.8), ...zig, P22(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT7, 0.85);
        } else {
          const r = h + 0.4, arc = `M${pt(P22(r, -0.4))} Q${pt(P22(0, r * 0.95))} ${pt(P22(-r, -0.4))}`;
          s += `<path d="${arc}" fill="none" stroke="${OUT7}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${c.cuff || c.sleeve}" stroke-width="1.5" stroke-linecap="round"/><path d="M${pt(P22(r * 0.55, -0.2))} Q${pt(P22(0, r * 0.45))} ${pt(P22(-r * 0.55, -0.2))}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="0.45" stroke-linecap="round"/>`;
        }
      } else {
        const d = path(pts4);
        if (derriere) s += stroke(d, OUT7, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
      }
      if (c.bandage) {
        const screenLeft = pts4[0][0] < 24;
        const charLeft = c.view === "ne" ? screenLeft : !screenLeft;
        if (c.bandage === "left" === charLeft) {
          const w = (cut ? fw : c.armW) + 0.7;
          s += limb(at(2.2), at(4.4), w, "#F4EEDF");
          for (const k of [2.9, 3.7]) {
            const p = at(k);
            s += L([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT7, 1.5) + L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
        }
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(armOf, "armOf");
    function frame(c, view, pose, n, expr) {
      const id = `${c.uid}${view}${pose}${n}`;
      const cc = { ...c, uid: id, view };
      const walk = pose === "marche";
      const ph = walk ? r22(Math.cos(n % IMAGES7.marche / IMAGES7.marche * Math.PI * 2)) : 0;
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
      const menton = view === "ne" ? "" : E2(view === "se" ? 22.6 : 24, 33.6 + (c.dy || 0), (shR[0] - shL[0]) * 0.24, 1.1, "rgba(0,0,0,.13)", 0);
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
    var POSES = [["face_repos", "front", "repos", IMAGES7.repos], ["avant_marche", "se", "marche", IMAGES7.marche], ["dos_marche", "ne", "marche", IMAGES7.marche], ["face_salut", "front", "salut", IMAGES7.salut]];
    module.exports = { OUT: OUT7, W, r2: r22, st, P: P2, E: E2, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES: IMAGES7, lerp: lerp2, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/arbres.js
var require_arbres = __commonJS({
  "atelier/arbres.js"(exports, module) {
    var { OUT: OUT7, P: P2, E: E2, r2: r22 } = require_troupe2();
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
    var BOIS3 = { left: "#9C6A43", right: "#74492C", bark: "#55331E", light: "#B98458" };
    var W = 1.1;
    var rond2 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r)}" fill="${fill}"/>`, "rond");
    var sc = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r22(n * k)), "sc");
    function touffe2(id, lobes, c, marques, k, neige = false) {
      const L = lobes.map(([x, y, r, f]) => [x * k, y * k, r * k, f]);
      const contour = L.map(([x, y, r]) => rond2(x, y, r + W, OUT7)).join("");
      const zone = `<clipPath id="${id}">${L.map(([x, y, r]) => rond2(x, y, r, "#000")).join("")}</clipPath>`;
      const hauts = L.filter((l) => l[3] !== 0);
      const dedans2 = L.map(([x, y, r]) => rond2(x, y, r, c.dark)).join("") + L.map(([x, y, r]) => rond2(x - r * 0.2, y - r * 0.32, r * 0.86, c.mid)).join("") + hauts.map(([x, y, r]) => rond2(x - r * 0.34, y - r * 0.48, r * 0.5, c.light)).join("") + hauts.map(([x, y, r]) => rond2(x - r * 0.22, y - r * 0.3, r * 0.5, c.mid)).join("") + marques.map(([x, y, s = 1]) => {
        const X = x * k, Y = y * k, S = s * Math.max(k, 0.85);
        return `<path d="M${r22(X - 2.6 * S)},${r22(Y)} Q${r22(X - 1.3 * S)},${r22(Y + 1.8 * S)} ${r22(X)},${r22(Y)} Q${r22(X + 1.3 * S)},${r22(Y + 1.8 * S)} ${r22(X + 2.6 * S)},${r22(Y)}" fill="none" stroke="${c.dark}" stroke-width="0.8" stroke-linecap="round"/>`;
      }).join("") + (neige ? hauts.map(([x, y, r]) => rond2(x + r * 0.04, y - r * 0.46, r * 0.8, "#D6E4EE")).join("") + hauts.map(([x, y, r]) => rond2(x - r * 0.04, y - r * 0.58, r * 0.78, "#FFFFFF")).join("") + hauts.map(([x, y, r]) => rond2(x - r * 0.3, y - r * 0.82, r * 0.16, "#F2F7FC")).join("") : "");
      return contour + `<defs>${zone}</defs><g clip-path="url(#${id})">${dedans2}</g>`;
    }
    __name(touffe2, "touffe");
    function tronc(id, k) {
      const d = sc("M-13,2.2 Q-8,0.6 -6.4,-5 Q-5,-16 -5,-26 Q-5.4,-34 -12,-44 L-5,-46 Q-1.4,-40 0,-36 Q1.6,-41 7,-47 L13,-43 Q5.6,-34 5.2,-26 Q5,-16 6.2,-6 Q7.6,0.4 13,2.6 Q8.6,4 5.2,2.4 Q2.6,5 -0.6,3.4 Q-3.6,4.8 -6,2.6 Q-9.4,3.6 -13,2.2 Z", k);
      const dedans2 = `<path d="${sc("M1.6,4 Q2.6,-14 2,-27 Q4,-36 9,-46 L16,-46 L16,4 Z", k)}" fill="${BOIS3.right}"/><path d="${sc("M5.2,2.4 Q8,2.8 13,2.6 L14,6 L4,6 Z", k)}" fill="${BOIS3.right}"/><ellipse cx="0" cy="${r22(-38 * k)}" rx="${r22(16 * k)}" ry="${r22(8 * k)}" fill="${BOIS3.right}"/><path d="${sc("M-2.6,-7 Q-3.2,-13 -2.4,-19 M2.8,-11 Q3.4,-16 2.8,-22 M-3.4,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${BOIS3.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.6,-4 Q-4,-12 -4.2,-20", k)}" fill="none" stroke="${BOIS3.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
      return `<path d="${d}" fill="${BOIS3.left}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans2}</g>`;
    }
    __name(tronc, "tronc");
    var herbe = /* @__PURE__ */ __name((x, y, col, s = 1) => `<path d="${sc("M-3,0 Q-3.2,-3 -4.6,-4.6 Q-1.6,-3.6 -0.8,-1.4 Q-0.6,-4.8 0.4,-6.2 Q1.6,-3.6 1,-1.2 Q2.2,-3.6 4.4,-4.4 Q3,-2 3,0 Q0,1.2 -3,0 Z", s)}" transform="translate(${r22(x)} ${r22(y)})" fill="${col}" stroke="${OUT7}" stroke-width="0.8" stroke-linejoin="round"/>`, "herbe");
    var champignon = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r22(x)} ${r22(y)})">` + P2("M-1,0 L-0.8,-2.2 L0.8,-2.2 L1,0 Z", "#F6EBD6", 0.7) + P2("M-2.9,-2 Q-2.6,-5.2 0,-5.4 Q2.6,-5.2 2.9,-2 Q0,-1.3 -2.9,-2 Z", "#E2574C", 0.8) + E2(-1, -3.8, 0.6, 0.5, "#FFFFFF", 0) + E2(1.1, -3.1, 0.45, 0.4, "#FFFFFF", 0) + "</g>", "champignon");
    var PETALES = [0, 72, 144, 216, 288].map((a) => [Math.cos((a - 90) * Math.PI / 180) * 1.2, Math.sin((a - 90) * Math.PI / 180) * 1.2]);
    var fleurette = /* @__PURE__ */ __name((x, y, col) => PETALES.map(([dx, dy]) => rond2(x + dx, y + dy, 1.4, OUT7)).join("") + PETALES.map(([dx, dy]) => rond2(x + dx, y + dy, 0.95, col)).join("") + rond2(x, y, 0.7, "#F2B33D"), "fleurette");
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
      return E2(3 * k, 1.5, 27 * k, 12 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + tronc(`${id}t`, k) + touffe2(`${id}a`, FOND, c.fond, [[-6, -69], [13, -66, 0.9], [24, -74, 0.8]], k, neige) + touffe2(`${id}b`, DROITE, c.devant, [[15, -47], [25, -52, 0.9]], k, neige) + touffe2(`${id}c`, GAUCHE, c.devant, [[-23, -46], [-15, -52, 0.9], [-31, -55, 0.8]], k, neige) + touffe2(`${id}d`, MILIEU, c.devant, [[-3, -54], [3, -60, 0.8]], k, neige) + (fleuri ? pied(k) : "") + (neige ? congere(k) : "");
    }
    __name(arbre, "arbre");
    var ARBRES2 = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleuri of [false, true]) {
      const fichier = ["arbre", petit && "petit", vert === "profond" && "profond", fleuri && "fleuri"].filter(Boolean).join("_");
      const libelle = `Arbre (${[petit ? "petit" : "grand", `vert ${vert}`, fleuri && "pied fleuri"].filter(Boolean).join(", ")})`;
      ARBRES2.push([fichier, libelle, { vert, petit, fleuri }]);
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
    function pomme(id, x, y, s, feuille4) {
      const r = 2.7 * s;
      const d = `M${r22(x)},${r22(y - r * 0.7)} Q${r22(x + r * 1.1)},${r22(y - r * 1.25)} ${r22(x + r * 1.05)},${r22(y + r * 0.05)} Q${r22(x + r * 0.9)},${r22(y + r * 1.05)} ${r22(x)},${r22(y + r * 0.95)} Q${r22(x - r * 0.9)},${r22(y + r * 1.05)} ${r22(x - r * 1.05)},${r22(y + r * 0.05)} Q${r22(x - r * 1.1)},${r22(y - r * 1.25)} ${r22(x)},${r22(y - r * 0.7)} Z`;
      return `<path d="${d}" fill="#E2574C" stroke="${OUT7}" stroke-width="0.9" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${E2(x + r * 0.55, y + r * 0.55, r * 0.95, r * 0.8, "#B83A35", 0)}</g><ellipse cx="${r22(x - r * 0.42)}" cy="${r22(y - r * 0.2)}" rx="${r22(r * 0.3)}" ry="${r22(r * 0.38)}" fill="#FFFFFF" opacity="0.85"/><path d="M${r22(x)},${r22(y - r * 0.6)} q${r22(0.2 * s)},${r22(-1.3 * s)} ${r22(0.9 * s)},${r22(-1.8 * s)}" stroke="${OUT7}" stroke-width="${r22(0.9 * Math.max(s, 0.8))}" fill="none" stroke-linecap="round"/>` + (feuille4 ? `<path d="M${r22(x + 0.7 * s)},${r22(y - r * 0.85)} q${r22(1.6 * s)},${r22(-1.6 * s)} ${r22(3.2 * s)},${r22(-0.9 * s)} q${r22(-1.2 * s)},${r22(1.4 * s)} ${r22(-3.2 * s)},${r22(0.9 * s)} Z" fill="#8CC152" stroke="${OUT7}" stroke-width="0.7" stroke-linejoin="round"/>` : "");
    }
    __name(pomme, "pomme");
    var petale2 = /* @__PURE__ */ __name((x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT7}" stroke-width="0.5" transform="translate(${r22(x)} ${r22(y)}) rotate(${a})"/>`, "petale");
    var POMMES = [[-26, -49, 1, true], [-15, -58, 1], [-31, -57, 0.9], [-7, -46, 1], [3, -66, 1, true], [13, -50, 1], [23, -45, 1, true], [27, -55, 0.9], [-3, -76, 0.9], [14, -73, 0.9]];
    var TOMBEES = [[12, 5, 1], [-17, 6, 0.95, true]];
    var FLEURS2 = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];
    var PETALES_SOL = [[-16, 4.5, 30, "#F7B6C8"], [-12, 7, -40, "#FFFFFF"], [9, 6, 70, "#FFFFFF"], [14, 3.5, -20, "#F7B6C8"], [18, 6.5, 50, "#FFFFFF"], [-20, 2.5, 80, "#FFFFFF"]];
    function pommier({ vert = "doux", petit = false, fleurs = false, tombees = false } = {}) {
      const k = petit ? 0.76 : 1, s = 1.12 * Math.max(k, 0.85);
      const id = `pom${petit ? "p" : "g"}${vert[0]}${fleurs ? "f" : ""}${tombees ? "t" : ""}`;
      let o = arbre({ vert, petit });
      if (fleurs) o += FLEURS2.map(([x, y], i) => fleurette(x * k, y * k, i % 3 ? "#FFFFFF" : "#F7B6C8")).join("") + (tombees ? PETALES_SOL.map(([x, y, a, col]) => petale2(x * k, y, a, col)).join("") : "");
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
    var feuilleMorte = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${a}) scale(${s})"><path d="M0,-2.8 Q2.2,-0.6 0,2.8 Q-2.2,-0.6 0,-2.8 Z" fill="${col}" stroke="${OUT7}" stroke-width="0.6" stroke-linejoin="round"/><path d="M0,-1.8 L0,2.2" stroke="${OUT7}" stroke-width="0.4" stroke-linecap="round" opacity="0.6"/></g>`, "feuilleMorte");
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
      const dedans2 = `<path d="${sc("M1.2,4 Q1.8,-20 1.6,-36 Q3,-44 8,-56 L14,-56 L14,4 Z", k)}" fill="${ECORCE.right}"/><path d="${sc("M-9,4 L-9,-1.5 Q-4,-3.5 0,-3 Q4,-3.5 9,-1.5 L9,4 Z", k)}" fill="#8E877C"/><ellipse cx="0" cy="${r22(-44 * k)}" rx="${r22(12 * k)}" ry="${r22(6 * k)}" fill="${ECORCE.right}"/>` + marques.map(([x, y, w]) => `<path d="M${r22((x - w / 2) * k)},${r22(y * k)} Q${r22(x * k)},${r22((y - 0.9) * k)} ${r22((x + w / 2) * k)},${r22(y * k)} Q${r22(x * k)},${r22((y + 0.6) * k)} ${r22((x - w / 2) * k)},${r22(y * k)} Z" fill="${ECORCE.marque}"/>`).join("");
      return `<path d="${d}" fill="${ECORCE.left}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans2}</g>`;
    }
    __name(troncBouleau, "troncBouleau");
    var B_FOND = [[-10, -84, 10], [6, -90, 10.5], [17, -78, 9], [-19, -72, 8.5], [1, -75, 10]];
    var B_GAUCHE = [[-16, -60, 10], [-24, -55, 7], [-19, -48, 6.5, 0], [-9, -50, 7, 0]];
    var B_DROITE = [[14, -63, 9.5], [22, -57, 7], [17, -49, 6.5, 0], [7, -52, 6.5, 0]];
    var B_MILIEU = [[-1, -71, 9], [-6, -61, 6.5, 0], [5, -62, 6.5, 0]];
    function bouleau({ vert = "doux", petit = false, fleuri = false } = {}) {
      const c = VERTS_BOULEAU[vert], k = petit ? 0.76 : 1;
      const id = `bou${petit ? "p" : "g"}${vert[0]}${fleuri ? "f" : ""}`;
      return E2(2 * k, 1.5, 21 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + troncBouleau(`${id}t`, k) + touffe2(`${id}a`, B_FOND, c.fond, [[-4, -80], [12, -76, 0.8]], k) + touffe2(`${id}b`, B_DROITE, c.devant, [[13, -55, 0.8], [20, -60, 0.7]], k) + touffe2(`${id}c`, B_GAUCHE, c.devant, [[-17, -53, 0.8], [-10, -58, 0.7]], k) + touffe2(`${id}d`, B_MILIEU, c.devant, [[-2, -64, 0.8]], k) + (fleuri ? pied(k * 0.85) : "");
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
      let d = `M0,${r22(top)} Q${r22(-w * 0.3)},${r22(top + h * 0.6)} ${r22(-w)},${r22(y)}`;
      for (let i = 0; i < n; i++) {
        const x0 = -w + i * pas;
        d += ` Q${r22(x0 + pas / 2)},${r22(y + 3.6)} ${r22(x0 + pas)},${r22(y)}`;
      }
      return d + ` Q${r22(w * 0.3)},${r22(top + h * 0.6)} 0,${r22(top)} Z`;
    }
    __name(etageD, "etageD");
    function etage(id, y, w, h, n, c, neige, yNeige) {
      const d = etageD(y, w, h, n), top = y - h, pas = 2 * w / n;
      let dedans2 = `<path d="M${r22(w * 0.08)},${r22(top)} Q${r22(w * 0.45)},${r22(top + h * 0.6)} ${r22(w + 2)},${r22(y + 4)} L${r22(w * 0.12)},${r22(y + 4)} Z" fill="${c.dark}"/>`;
      for (let i = 0; i < n; i++) dedans2 += `<ellipse cx="${r22(-w + (i + 0.5) * pas)}" cy="${r22(y + 1.6)}" rx="${r22(pas * 0.42)}" ry="2" fill="${c.dark}" opacity="0.55"/>`;
      dedans2 += `<path d="M-1.2,${r22(top + 3)} Q${r22(-w * 0.32)},${r22(top + h * 0.6)} ${r22(-w + 3)},${r22(y - 1.2)}" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + [[-w * 0.45, y - h * 0.35], [w * 0.15, y - h * 0.55], [-w * 0.1, y - h * 0.2], [w * 0.5, y - h * 0.25]].map(([x, yy]) => `<path d="M${r22(x - 1.8)},${r22(yy - 1.2)} L${r22(x)},${r22(yy + 0.6)} L${r22(x + 1.8)},${r22(yy - 1.2)}" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
      if (neige) {
        const yc = yNeige, xc = w * (yc - top) / h * 1.08;
        dedans2 += `<path d="M0,${r22(top - 0.4)} Q${r22(-w * 0.18)},${r22(top + h * 0.3)} ${r22(-xc - 1)},${r22(yc)} Q${r22(-xc * 0.6)},${r22(yc + 3)} ${r22(-xc * 0.3)},${r22(yc + 0.6)} Q0,${r22(yc + 3.2)} ${r22(xc * 0.3)},${r22(yc + 0.4)} Q${r22(xc * 0.65)},${r22(yc + 2.8)} ${r22(xc + 1)},${r22(yc - 0.4)} Q${r22(w * 0.18)},${r22(top + h * 0.3)} 0,${r22(top - 0.4)} Z" fill="#FFFFFF" stroke="${OUT7}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(w * 0.06)},${r22(top + 1.5)} Q${r22(w * 0.2)},${r22(top + h * 0.3)} ${r22(xc * 0.9)},${r22(yc)}" stroke="#D6E4EE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      }
      let o = `<path d="${d}" fill="${c.mid}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans2}</g>`;
      if (neige) {
        let f = `M${r22(-w + 1)},${r22(y - 0.2)}`;
        for (let i = 0; i < n; i++) {
          const x0 = -w + i * pas;
          f += ` Q${r22(x0 + pas / 2)},${r22(y + 3.4)} ${r22(Math.min(x0 + pas, w - 1))},${r22(y - 0.2)}`;
        }
        o += `<path d="${f}" stroke="${OUT7}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${f}" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      return o;
    }
    __name(etage, "etage");
    function troncSapin(id, k) {
      const d = sc("M-7.5,1.8 Q-4,0.6 -3.4,-4 L-3,-16 L3,-16 L3.4,-4 Q4,0.6 8,2 Q4.4,3.2 2,2 Q0,3.4 -2.2,2.2 Q-4.6,3.2 -7.5,1.8 Z", k);
      return `<path d="${d}" fill="${BOIS3.left}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${sc("M0.8,4 L1,-17 L9,-17 L9,4 Z", k)}" fill="${BOIS3.right}"/><path d="${sc("M-1.6,-4 L-1.4,-11", k)}" stroke="${BOIS3.bark}" stroke-width="0.7" stroke-linecap="round"/></g>`;
    }
    __name(troncSapin, "troncSapin");
    var pommeDePin = /* @__PURE__ */ __name((x, y, a) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${a})"><path d="M0,-2.6 Q2.2,-1 1.8,1.2 Q0,3 -1.8,1.2 Q-2.2,-1 0,-2.6 Z" fill="#A0703F" stroke="${OUT7}" stroke-width="0.7" stroke-linejoin="round"/><path d="M-1.4,-0.6 Q0,0.4 1.4,-0.6 M-1.5,1 Q0,2 1.5,1" stroke="#6E4A28" stroke-width="0.5" fill="none"/></g>`, "pommeDePin");
    var congere = /* @__PURE__ */ __name((k) => `<path d="M${r22(-17 * k)},4 Q${r22(-14 * k)},-1 ${r22(-8 * k)},1.5 Q${r22(-5 * k)},-0.5 ${r22(-2 * k)},3 Q${r22(4 * k)},0 ${r22(8 * k)},3 Q${r22(13 * k)},0 ${r22(18 * k)},4.5 Q0,9 ${r22(-17 * k)},4 Z" fill="#FFFFFF" stroke="${OUT7}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${r22(3 * k)},5.5 Q${r22(10 * k)},6.6 ${r22(15 * k)},5" stroke="#D6E4EE" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, "congere");
    var ETAGES = [[-10, 25, 28, 5], [-27, 20.5, 27, 4], [-44, 16, 25, 4], [-60, 11, 24, 3]];
    function sapin({ vert = "doux", petit = false, neige = false, pied: pied2 = false } = {}) {
      const c = PINS[vert], k = petit ? 0.76 : 1;
      const id = `sap${neige ? "n" : ""}${petit ? "p" : "g"}${vert[0]}${pied2 ? "x" : ""}`;
      return E2(2 * k, 1.5, 24 * k, 10.5 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + troncSapin(`${id}t`, k) + ETAGES.map(([y, w, h, n], i) => etage(`${id}${i}`, y * k, w * k, h * k, n, c, neige, (i < ETAGES.length - 1 ? ETAGES[i + 1][0] + 6.5 : y - h * 0.55) * k)).join("") + (pied2 ? neige ? congere(k) : pommeDePin(-12 * k, 5, -20) + pommeDePin(11 * k, 6, 30) + pommeDePin(15 * k, 3.4, 80) : "");
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
    var pts4 = /* @__PURE__ */ __name((l) => l.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L"), "pts");
    function palme(id, o, dx, dy, larg, c, k) {
      const b = [o[0] + dx * k, o[1] + dy * k], ctl = [o[0] + dx * k * 0.5, o[1] + dy * k * 0.5 - Math.abs(dx) * 0.38 * k];
      const N = 14, axe = [], haut = [], bas = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N, p = qPt(o, ctl, b, t), d2 = qTan(o, ctl, b, t), L = Math.hypot(d2[0], d2[1]) || 1;
        let nx = -d2[1] / L, ny = d2[0] / L;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        const w = larg * k * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0.75) + 0.3, cran = i % 2 ? 0.35 : 1;
        axe.push(p);
        haut.push([p[0] + nx * w * 0.55, p[1] + ny * w * 0.55]);
        bas.push([p[0] - nx * w * cran, p[1] - ny * w * cran]);
      }
      const d = `M${pts4(haut.concat(bas.slice().reverse()))} Z`;
      return `<path d="${d}" fill="${c.mid}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M${pts4(axe.concat(bas.slice().reverse()))} Z" fill="${c.dark}"/><path d="M${r22(o[0])},${r22(o[1] - 0.8)} Q${r22(ctl[0])},${r22(ctl[1] - 0.8)} ${r22(b[0])},${r22(b[1] - 0.8)}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
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
        const d = `M${r22(l0[0])},${r22(l0[1])} L${r22(l1[0])},${r22(l1[1])} Q${r22(p1[0])},${r22(p1[1] + 1.4 * k)} ${r22(r1[0])},${r22(r1[1])} L${r22(r0[0])},${r22(r0[1])} Q${r22(p0[0])},${r22(p0[1] + 1.8 * k)} ${r22(l0[0])},${r22(l0[1])} Z`;
        o += `<path d="${d}" fill="${STIPE.left}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}${i}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id}${i})"><path d="M${r22(p0[0] + n0[0] * w0 * 0.25)},${r22(p0[1] + 4)} L${r22(p1[0] + n1[0] * w1 * 0.25)},${r22(p1[1] - 2)} L${r22(p1[0] + n1[0] * 12)},${r22(p1[1] - 2)} L${r22(p0[0] + n0[0] * 12)},${r22(p0[1] + 4)} Z" fill="${STIPE.right}"/><path d="M${r22(l1[0])},${r22(l1[1] + 1.2)} Q${r22(p1[0])},${r22(p1[1] + 2.6 * k)} ${r22(r1[0])},${r22(r1[1] + 1.2)}" stroke="${STIPE.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/></g>`;
      }
      return o;
    }
    __name(stipe, "stipe");
    var noixDeCoco = /* @__PURE__ */ __name((x, y, s) => E2(x, y, 3 * s, 3 * s, "#7A4E28", 0.9) + E2(x - 0.9 * s, y - s, 0.9 * s, 0.8 * s, "#A87A4C", 0) + E2(x + 0.4 * s, y + 1.2 * s, 0.35 * s, 0.35 * s, "#4E3018", 0), "noixDeCoco");
    var PALMES_FOND = [[-30, 4, 6], [31, 6, 6], [-10, -22, 5.5], [14, -21, 5.5]];
    var PALMES_DEVANT = [[-26, 17, 6.5], [27, 19, 6.5], [-20, -8, 6], [22, -6, 6]];
    function palmier({ vert = "doux", petit = false, cocos = false } = {}) {
      const c = PALMES[vert], k = petit ? 0.76 : 1, o = [8 * k, -62 * k], s = Math.max(k, 0.85);
      const id = `pal${petit ? "p" : "g"}${vert[0]}${cocos ? "c" : ""}`;
      return E2(3 * k, 1.5, 22 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + stipe(`${id}s`, k) + PALMES_FOND.map(([dx, dy, l], i) => palme(`${id}f${i}`, o, dx, dy, l, c.fond, k)).join("") + PALMES_DEVANT.map(([dx, dy, l], i) => palme(`${id}d${i}`, o, dx, dy, l, c.devant, k)).join("") + noixDeCoco(o[0] - 3.4 * k, o[1] + 6 * k, s) + noixDeCoco(o[0] + 3.6 * k, o[1] + 6.6 * k, s) + noixDeCoco(o[0] + 0.1 * k, o[1] + 9.6 * k, s) + (cocos ? noixDeCoco(-12 * k, 4.5, 0.95) + noixDeCoco(14 * k, 5.5, 0.9) : "");
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
      const seg = /* @__PURE__ */ __name(([a, b], w, col) => `<path d="M${r22(a[0] * k)},${r22(a[1] * k)} L${r22(b[0] * k)},${r22(b[1] * k)}" stroke="${col}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "seg");
      return segs.map(([a, b, w]) => seg([a, b], w * k + W * 2, OUT7)).join("") + segs.map(([a, b, w]) => seg([a, b], w * k, c.left)).join("") + segs.map(([a, b, w]) => seg([[a[0] + w * 0.22, a[1]], [b[0] + w * 0.22, b[1]]], w * k * 0.45, c.right)).join("");
    }
    __name(branchesMortes, "branchesMortes");
    function troncMort(id, c, k) {
      const d = sc("M-12,2.2 Q-7,0.8 -5.8,-5 Q-4.6,-14 -5.2,-22 Q-5.6,-30 -10.5,-41 L-6.5,-44.5 Q-2.2,-38 0,-35 Q2,-38.5 7.5,-43 L11.5,-39.5 Q5.6,-31 5,-22 Q4.4,-12 5.8,-6 Q7,0.6 12.5,2.6 Q8,4 4.8,2.4 Q2.4,4.8 -0.6,3.4 Q-3.4,4.6 -5.8,2.6 Q-9,3.6 -12,2.2 Z", k);
      const dedans2 = `<path d="${sc("M1.4,4 Q2.4,-12 1.8,-22 Q3.4,-32 8.5,-44.5 L16,-44.5 L16,4 Z", k)}" fill="${c.right}"/><path d="${sc("M-2.4,-6 Q-3,-12 -2.2,-17 M2.6,-9 Q3.2,-14 2.6,-19 M-3.2,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.4,-4 Q-3.8,-12 -4,-20", k)}" fill="none" stroke="${c.light}" stroke-width="1" stroke-linecap="round" opacity="0.8"/>` + E2(-0.6 * k, -15 * k, 2.4 * k, 3 * k, c.light, 0.8) + E2(-0.4 * k, -14.6 * k, 1.5 * k, 2.1 * k, "#3A2E26", 0) + E2(-3.6 * k, -25 * k, 2 * k, 1 * k, "#B7C46C", 0.5) + E2(-2.2 * k, -24.4 * k, 1 * k, 0.6 * k, "#B7C46C", 0.4);
      return `<path d="${d}" fill="${c.left}" stroke="${OUT7}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans2}</g>`;
    }
    __name(troncMort, "troncMort");
    function arbreMort({ teinte = "gris", petit = false, champignons = false } = {}) {
      const c = BOIS_MORT[teinte], k = petit ? 0.76 : 1;
      const id = `mor${petit ? "p" : "g"}${teinte[0]}${champignons ? "c" : ""}`;
      const raccord = /* @__PURE__ */ __name((a, b) => `<path d="M${r22(a[0] * k)},${r22(a[1] * k)} L${r22(b[0] * k)},${r22(b[1] * k)}" stroke="${c.left}" stroke-width="${r22(3.6 * k)}" stroke-linecap="butt"/><path d="M${r22((a[0] + 0.8) * k)},${r22(a[1] * k)} L${r22((b[0] + 0.8) * k)},${r22(b[1] * k)}" stroke="${c.right}" stroke-width="${r22(1.6 * k)}" stroke-linecap="butt"/>`, "raccord");
      return E2(2 * k, 1.5, 19 * k, 8.5 * k, "rgba(40,55,20,0.22)", 0) + branchesMortes(c, k) + troncMort(`${id}t`, c, k) + raccord([-7.6, -41.5], [-10, -45.6]) + raccord([8.6, -40.6], [11, -42.5]) + (champignons ? champignon(-9 * k, 5.4) + champignon(10.5 * k, 5.6) + champignon(14 * k, 3.4) : "");
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
      ARBRES: ARBRES2,
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
      feuillage: touffe2,
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
      petale: petale2,
      pommeDePin,
      BOIS: BOIS3,
      W
    };
  }
});

// atelier/deco.js
var require_deco = __commonJS({
  "atelier/deco.js"(exports, module) {
    var { OUT: OUT7, E: E2, r2: r22 } = require_troupe2();
    var K2 = 1.25;
    var TW2 = 64 * K2;
    var TH2 = 32 * K2;
    var PROP = [-40 * K2, -92 * K2, 80 * K2, 112 * K2];
    var BUILDING = [-76 * K2, -124 * K2, 152 * K2, 168 * K2];
    var BIG = [-112 * K2, -200 * K2, 224 * K2, 264 * K2];
    var pt = /* @__PURE__ */ __name((u, v, z = 0) => [(u - v) * TW2 / 2, (u + v) * TH2 / 2 - z * K2], "pt");
    var LEAVES = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
    var PINE = { light: "#86C774", mid: "#4F9A4C", dark: "#2F6E3A" };
    var WOOD2 = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
    var WOOD_DARK2 = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
    var GRANITE = { top: "#CBC6BA", left: "#A6A094", right: "#7E786E" };
    var poly2 = /* @__PURE__ */ __name((points, fill, w = 0.9) => `<polygon points="${points.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" ")}" fill="${fill}" stroke="${OUT7}" stroke-width="${w}" stroke-linejoin="round"/>`, "poly");
    var face2 = /* @__PURE__ */ __name((pts32, fill, w) => poly2(pts32.map((p) => pt(...p)), fill, w), "face");
    var shadow2 = /* @__PURE__ */ __name((u, v, r, a = 0.22) => {
      const [x, y] = pt(u, v);
      return E2(x, y, r * TW2 * 0.55, r * TH2 * 0.55, `rgba(40,55,20,${a})`, 0);
    }, "shadow");
    function box2(u0, v0, u1, v1, z0, z1, c, w = 0.9) {
      return face2([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], c.left, w) + face2([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], c.right, w) + face2([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], c.top, w);
    }
    __name(box2, "box");
    function crown(blobs, c, id) {
      const out = blobs.map(([x, y, r]) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r + 1.1)}" fill="${OUT7}"/>`).join("");
      const base = blobs.map(([x, y, r]) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r)}" fill="${c.mid}"/>`).join("");
      const clipId = `cr${id}`;
      const clipPath = `<clipPath id="${clipId}">${blobs.map(([x, y, r]) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r)}"/>`).join("")}</clipPath>`;
      const shade = blobs.map(([x, y, r]) => `<circle cx="${r22(x + r * 0.35)}" cy="${r22(y + r * 0.45)}" r="${r22(r * 0.85)}" fill="${c.dark}"/>`).join("");
      const lite = blobs.map(([x, y, r]) => `<circle cx="${r22(x - r * 0.25)}" cy="${r22(y - r * 0.3)}" r="${r22(r * 0.62)}" fill="${c.mid}"/>`).join("") + blobs.map(([x, y, r]) => `<circle cx="${r22(x - r * 0.4)}" cy="${r22(y - r * 0.45)}" r="${r22(r * 0.32)}" fill="${c.light}"/>`).join("");
      return out + base + `<defs>${clipPath}</defs><g clip-path="url(#${clipId})">${shade}${lite}</g>`;
    }
    __name(crown, "crown");
    function boulder(u, v, ru, rv, h, c, seed = 1) {
      const [x, y] = pt(u, v);
      const w = ru * TW2 * 0.78, d = rv * TH2 * 0.7, H = h * K2;
      const j = /* @__PURE__ */ __name((k) => 1 + 0.14 * Math.sin(seed * 12.9898 + k * 78.233), "j");
      const path = `M${r22(x - w)},${r22(y)} Q${r22(x - w * 1.02)},${r22(y - H * 0.7 * j(1))} ${r22(x - w * 0.45)},${r22(y - H * j(2))} Q${r22(x + w * 0.1)},${r22(y - H * 1.12 * j(3))} ${r22(x + w * 0.62)},${r22(y - H * 0.78 * j(4))} Q${r22(x + w * 1.04)},${r22(y - H * 0.42)} ${r22(x + w)},${r22(y)} Q${x},${r22(y + d)} ${r22(x - w)},${r22(y)} Z`;
      const id = `rk${seed}_${[u, v, ru, rv, h].map(r22).join("_")}`.replace(/-/g, "m").replace(/\./g, "p");
      return `<path d="${path}" fill="${c.left}" stroke="${OUT7}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${r22(x + w * 0.55)}" cy="${r22(y - H * 0.1)}" rx="${r22(w * 0.8)}" ry="${r22(H * 0.75)}" fill="${c.right}"/><ellipse cx="${r22(x - w * 0.25)}" cy="${r22(y - H * 0.95)}" rx="${r22(w * 0.7)}" ry="${r22(H * 0.38)}" fill="${c.top}"/></g><path d="M${r22(x - w * 0.6)},${r22(y - H * 0.7)} Q${r22(x - w * 0.35)},${r22(y - H * 0.98)} ${r22(x + w * 0.05)},${r22(y - H * 1.02)}" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    }
    __name(boulder, "boulder");
    var flower = /* @__PURE__ */ __name((x, y, r, petal, heart = "#E8A13A") => [0, 72, 144, 216, 288].map((a) => E2(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.78, r * 0.78, petal, 0.5)).join("") + E2(x, y, r * 0.55, r * 0.55, heart, 0.4), "flower");
    var stroke = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
    var thick = /* @__PURE__ */ __name((d, w, color) => stroke(d, w + 2.2, OUT7) + stroke(d, w, color), "thick");
    module.exports = { K: K2, TW: TW2, TH: TH2, PROP, BUILDING, BIG, pt, poly: poly2, face: face2, shadow: shadow2, box: box2, crown, boulder, flower, stroke, thick, LEAVES, PINE, WOOD: WOOD2, WOOD_DARK: WOOD_DARK2, GRANITE };
    function cylinder2(u, v, r, z0, z1, c, w = 1) {
      const [x, y0] = pt(u, v, z0), [, y1] = pt(u, v, z1);
      const rx = r * TW2 * 0.7, ry = r * TH2 * 0.7;
      const side = `M${r22(x - rx)},${r22(y1)} L${r22(x - rx)},${r22(y0)} A${r22(rx)} ${r22(ry)} 0 0 0 ${r22(x + rx)},${r22(y0)} L${r22(x + rx)},${r22(y1)} Z`;
      return `<path d="${side}" fill="${c.left}" stroke="${OUT7}" stroke-width="${w}" stroke-linejoin="round"/><path d="M${r22(x + rx * 0.15)},${r22(y1 + ry)} L${r22(x + rx * 0.15)},${r22(y0 + ry)} A${r22(rx)} ${r22(ry)} 0 0 0 ${r22(x + rx)},${r22(y0)} L${r22(x + rx)},${r22(y1)} Z" fill="${c.right}"/><path d="${side}" fill="none" stroke="${OUT7}" stroke-width="${w}" stroke-linejoin="round"/>` + E2(x, y1, rx, ry, c.top, w);
    }
    __name(cylinder2, "cylinder");
    var disc2 = /* @__PURE__ */ __name((u, v, r, z, fill, w = 1) => {
      const [x, y] = pt(u, v, z);
      return E2(x, y, r * TW2 * 0.7, r * TH2 * 0.7, fill, w);
    }, "disc");
    function gable2(u0, v0, u1, v1, z, h, c, o = 0.08) {
      const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o;
      return face2([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], c.back, 1) + face2([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], c.gable, 1) + face2([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], c.front, 1);
    }
    __name(gable2, "gable");
    function pyramid(u0, v0, u1, v1, z, h, c, o = 0.06) {
      const A2 = [u0 - o, v0 - o, z], B = [u1 + o, v0 - o, z], Cc = [u1 + o, v1 + o, z], Dd = [u0 - o, v1 + o, z], T2 = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
      return face2([A2, B, T2], c.back, 1) + face2([Dd, A2, T2], c.back, 1) + face2([B, Cc, T2], c.right, 1) + face2([Cc, Dd, T2], c.front, 1);
    }
    __name(pyramid, "pyramid");
    var post = /* @__PURE__ */ __name((u, v, z0, z1, c = WOOD_DARK2, w = 0.03) => box2(u - w, v - w, u + w, v + w, z0, z1, c, 0.7), "post");
    var rail = /* @__PURE__ */ __name((a, b, z, w = 2, c = WOOD_DARK2.left) => {
      const p = pt(a[0], a[1], z), q = pt(b[0], b[1], z);
      return `<path d="M${r22(p[0])},${r22(p[1])} L${r22(q[0])},${r22(q[1])}" stroke="${OUT7}" stroke-width="${w + 1.6}" stroke-linecap="round"/><path d="M${r22(p[0])},${r22(p[1])} L${r22(q[0])},${r22(q[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    }, "rail");
    function flame(x, y, h, w, k) {
      const sway = Math.sin(k * Math.PI * 2) * w * 0.35;
      const tip = /* @__PURE__ */ __name((s, dx) => `M${r22(x - w * s)},${r22(y)} Q${r22(x - w * s * 1.1)},${r22(y - h * s * 0.55)} ${r22(x + dx)},${r22(y - h * s)} Q${r22(x + w * s * 1.1)},${r22(y - h * s * 0.55)} ${r22(x + w * s)},${r22(y)} Z`, "tip");
      return `<path d="${tip(1, sway)}" fill="#E8573A" stroke="${OUT7}" stroke-width="0.9" stroke-linejoin="round"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
    }
    __name(flame, "flame");
    var glow = /* @__PURE__ */ __name((x, y, r, rgb = "255,224,138", a = 0.38) => {
      const id = `lueur_${[x, y, r, a].map(r22).join("_")}_${rgb}`.replace(/,/g, "-").replace(/\./g, "p");
      return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r22(Math.min(0.9, a * 1.8))}"/><stop offset="0.45" stop-color="rgb(${rgb})" stop-opacity="${r22(a * 0.8)}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r * 1.25)}" fill="url(#${id})"/>`;
    }, "glow");
    var STONE2 = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
    var WHITE_STONE = { top: "#FBF8F1", left: "#E7E1D3", right: "#C9C0AC" };
    var ROOF_RED2 = { back: "#B9503B", front: "#E06E52", gable: "#F3E4C4", right: "#B9503B" };
    var ROOF_BLUE = { back: "#3E6FA8", front: "#5C8FD0", gable: "#F3E4C4", right: "#3E6FA8" };
    var THATCH = { back: "#C99A45", front: "#EBC46F", gable: "#F3E4C4", right: "#C99A45" };
    var WALL2 = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
    var SOIL = { top: "#946240", left: "#784C2E", right: "#5E3A22" };
    var WATER = "#5BAFD8";
    var WATER_LIGHT = "#9AD6F0";
    var BRASS = { top: "#F4D67A", left: "#E2B546", right: "#B88A2E" };
    var IRON = { top: "#9AA2AD", left: "#7E8691", right: "#5E6670" };
    Object.assign(module.exports, { cylinder: cylinder2, disc: disc2, gable: gable2, pyramid, post, rail, flame, glow, STONE: STONE2, WHITE_STONE, ROOF_RED: ROOF_RED2, ROOF_BLUE, THATCH, WALL: WALL2, SOIL, WATER, WATER_LIGHT, BRASS, IRON });
  }
});

// atelier/port/src/world/iso.js
var TW = 64;
var TH = 32;
function P(u, v, z = 0) {
  return [(u - v) * TW / 2, (u + v) * TH / 2 - z];
}
__name(P, "P");
var fmt = /* @__PURE__ */ __name((n) => (Math.round(n * 100) / 100).toString(), "fmt");
var pts = /* @__PURE__ */ __name((list) => list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" "), "pts");
function face(points, fill, extra = "") {
  return `<polygon points="${pts(points.map((p) => P(...p)))}" fill="${fill}"${extra}/>`;
}
__name(face, "face");
var EDGE = ' stroke="#3C2819" stroke-width="0.72" stroke-linejoin="round"';
function box(u0, v0, u1, v1, z0, z1, colors, edge = EDGE) {
  return [
    face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], colors.left, edge),
    face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], colors.right, edge),
    face([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], colors.top, edge)
  ].join("");
}
__name(box, "box");
var HIVER = false;
var NEIGE = { light: "#F6FAFD", shade: "#D6E4EE", glace: "#CFE6F2" };
var lerp = /* @__PURE__ */ __name((p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], "lerp");
function snowPan(A2, B, C, D2, k = 0.8, glacons = false) {
  const n = Math.max(3, Math.round(Math.hypot(B[0] - A2[0], B[1] - A2[1]) / 9));
  const low = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, kk = k + (i % 2 ? 0.06 : -0.04);
    return lerp(lerp(A2, D2, kk), lerp(B, C, kk), t);
  });
  const up = [[A2[0], A2[1] - 1.6], [B[0], B[1] - 1.6]];
  let d = `M${fmt(up[0][0])},${fmt(up[0][1])} L${fmt(up[1][0])},${fmt(up[1][1])} L${fmt(low[n][0])},${fmt(low[n][1])}`;
  for (let i = n - 1; i >= 0; i--) {
    const p = low[i], q = low[i + 1], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 1.4];
    d += ` Q${fmt(m[0])},${fmt(m[1])} ${fmt(p[0])},${fmt(p[1])}`;
  }
  d += " Z";
  const sh = low.map(([x, y]) => [x, y + 1.2]);
  let o = `<polyline points="${pts(sh)}" fill="none" stroke="${NEIGE.shade}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="${NEIGE.light}"${EDGE}/>`;
  if (glacons) {
    const m = Math.max(2, Math.round(Math.hypot(C[0] - D2[0], C[1] - D2[1]) / 7));
    for (let i = 0; i < m; i++) {
      const t = (i + 0.5) / m, [x, y] = lerp(D2, C, t), l = 2.6 + i * 7 % 3 * 0.9;
      o += `<path d="M${fmt(x - 1.1)},${fmt(y)} L${fmt(x + 1.1)},${fmt(y + 0.4)} L${fmt(x + 0.1)},${fmt(y + l)} Z" fill="${NEIGE.glace}" stroke="${OUT_ICE}" stroke-width="0.5" stroke-linejoin="round"/>`;
    }
  }
  return o;
}
__name(snowPan, "snowPan");
var OUT_ICE = "rgba(60,40,25,.55)";
function gable(u0, v0, u1, v1, z, h, colors, o = 0.08, edge = EDGE) {
  const vm = (v0 + v1) / 2;
  const a = u0 - o;
  const b = u1 + o;
  const rive = [P(b, v0 - o, z), P(b, vm, z + h), P(b, v1 + o, z)];
  return [
    face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], colors.back, edge),
    HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v0 - o, z), P(a, v0 - o, z), 0.9) : "",
    face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], colors.gable, edge),
    face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], colors.front, edge),
    HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v1 + o, z), P(a, v1 + o, z), 0.8, true) : "",
    // Planche de rive le long du pignon (l'hiver, un bourrelet de neige dessus)
    `<polyline points="${pts(rive)}" fill="none" stroke="#3C2819" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>`,
    HIVER ? `<polyline points="${pts(rive.map(([x, y]) => [x + 0.6, y - 1.2]))}" fill="none" stroke="#3C2819" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts(rive.map(([x, y]) => [x + 0.6, y - 1.2]))}" fill="none" stroke="${NEIGE.light}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>` : ""
  ].join("");
}
__name(gable, "gable");
function disc(u, v, z, r, fill, extra = "") {
  const [x, y] = P(u, v, z);
  return `<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(r * TW * Math.SQRT1_2)}" ry="${fmt(r * TH * Math.SQRT1_2)}" fill="${fill}"${extra}/>`;
}
__name(disc, "disc");
function cylinder(u, v, z0, z1, r, colors, id, edge = EDGE) {
  const [x0, y0] = P(u, v, z0);
  const [, y1] = P(u, v, z1);
  const rx = r * TW * Math.SQRT1_2;
  const ry = r * TH * Math.SQRT1_2;
  const side = `M${fmt(x0 - rx)},${fmt(y1)} L${fmt(x0 - rx)},${fmt(y0)} A${fmt(rx)},${fmt(ry)} 0 0 0 ${fmt(x0 + rx)},${fmt(y0)} L${fmt(x0 + rx)},${fmt(y1)} Z`;
  return `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs><path d="${side}" fill="url(#${id})"${edge}/><ellipse cx="${fmt(x0)}" cy="${fmt(y1)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${colors.top}"${edge}/>`;
}
__name(cylinder, "cylinder");
function shadow(u, v, r, opacity = 0.22) {
  return disc(u + 0.12, v + 0.02, 0, r, `rgba(40,55,20,${opacity})`);
}
__name(shadow, "shadow");

// atelier/port/src/world/palette.js
var WOOD = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
var WOOD_DARK = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
var STONE = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
var WALL = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
var ROOF_RED = { front: "#E06E52", back: "#B9503B" };
var GLASS = "#FFE6A3";
function pebble(u, v, s, color = STONE) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${x + s * 0.12}" cy="${y + s * 0.18}" rx="${s}" ry="${s * 0.62}" fill="${color.right}"/><ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * 0.66}" fill="${color.left}"/><ellipse cx="${x - s * 0.28}" cy="${y - s * 0.22}" rx="${s * 0.5}" ry="${s * 0.3}" fill="${color.top}"/>`;
}
__name(pebble, "pebble");
function doorLeft(ua, ub, vf, h, color = WOOD_DARK.right) {
  return face([[ua, vf, 0], [ub, vf, 0], [ub, vf, h], [ua, vf, h]], color, EDGE) + face([[ub - 0.04, vf, h * 0.45], [ub - 0.02, vf, h * 0.45], [ub - 0.02, vf, h * 0.5], [ub - 0.04, vf, h * 0.5]], "#F2C04B");
}
__name(doorLeft, "doorLeft");
function windowLeft(ua, ub, vf, z0, z1, glass = GLASS) {
  const um = (ua + ub) / 2;
  const zm = (z0 + z1) / 2;
  return face([[ua, vf, z0], [ub, vf, z0], [ub, vf, z1], [ua, vf, z1]], glass, ' stroke="#7A4E2C" stroke-width="1.4" stroke-linejoin="round"') + `<polyline points="${[P(um, vf, z0), P(um, vf, z1)].map((p) => p.join(",")).join(" ")}" stroke="#7A4E2C" stroke-width="1"/><polyline points="${[P(ua, vf, zm), P(ub, vf, zm)].map((p) => p.join(",")).join(" ")}" stroke="#7A4E2C" stroke-width="1"/>`;
}
__name(windowLeft, "windowLeft");
function windowRight(uf, va, vb, z0, z1, glass = GLASS) {
  const vm = (va + vb) / 2;
  const zm = (z0 + z1) / 2;
  return face([[uf, va, z0], [uf, vb, z0], [uf, vb, z1], [uf, va, z1]], glass, ' stroke="#5E3A22" stroke-width="1.4" stroke-linejoin="round"') + `<polyline points="${[P(uf, vm, z0), P(uf, vm, z1)].map((p) => p.join(",")).join(" ")}" stroke="#5E3A22" stroke-width="1"/><polyline points="${[P(uf, va, zm), P(uf, vb, zm)].map((p) => p.join(",")).join(" ")}" stroke="#5E3A22" stroke-width="1"/>`;
}
__name(windowRight, "windowRight");

// atelier/montage.mjs
var OUT = "#3C2819";
var f2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var pts2 = /* @__PURE__ */ __name((list) => list.map(([x, y]) => `${f2(x)},${f2(y)}`).join(" "), "pts");
var ln = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`, "ln");
var tk = /* @__PURE__ */ __name((a, b, color, w) => ln(a, b, OUT, w + 1.44) + ln(a, b, color, w), "tk");
var pathTk = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${f2(w + 1.44)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "pathTk");
var ell = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`, "ell");
var poly = /* @__PURE__ */ __name((list, fill, extra = EDGE) => `<polygon points="${pts2(list)}" fill="${fill}"${extra}/>`, "poly");
var TERRE = { claire: "#B07A4A", moyenne: "#946240", sombre: "#784C2E", motte: "#8B5A34" };
var CORDE = "#F2E4C0";
var FANIONS = ["#E2574C", "#F2C04B", "#6FA3D9", "#FFF4E0", "#7EC45B"];
var COLOMBAGE = "#7A4E2C";
var DEDANS = { gauche: "#6E4A32", droite: "#5A3A28", sol: "#CFC6B4" };
var TUILE = { top: "#F08A6A", left: "#E06E52", right: "#B9503B" };
var SAPIN = ["#2F6E3A", "#4F9A4C", "#86C774"];
function geo(emprise) {
  const R2 = emprise === "3x3" ? 1.5 : 1, hs = emprise === "3x3" ? 1.35 : 1;
  const F = Math.round(5 * hs), W = F + Math.round(26 * hs);
  return { R: R2, hs, F, W, h: Math.round(17 * hs), u0: -0.6 * R2, u1: 0.45 * R2, v0: -0.6 * R2, v1: 0.45 * R2, k: 0.9 * R2 };
}
__name(geo, "geo");
var gros = /* @__PURE__ */ __name((u, v, s, body) => {
  if (s === 1) return body;
  const [x, y] = P(u, v, 0);
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${s}) translate(${f2(-x)} ${f2(-y)})">${body}</g>`;
}, "gros");
var bouffee = /* @__PURE__ */ __name((x, y, s, a = 1) => `<g opacity="${a}">${[[-s * 0.9, 0, s * 0.8], [s * 0.7, s * 0.1, s * 0.7], [0, -s * 0.6, s]].map(([dx, dy, r]) => ell(x + dx, y + dy, r + 0.6, r * 0.86 + 0.6, OUT)).join("") + [[-s * 0.9, 0, s * 0.8], [s * 0.7, s * 0.1, s * 0.7], [0, -s * 0.6, s]].map(([dx, dy, r]) => ell(x + dx, y + dy, r, r * 0.86, "#F4E8D0")).join("") + ell(x - s * 0.3, y - s * 0.9, s * 0.4, s * 0.26, "#FFFFFF", ' opacity=".7"')}</g>`, "bouffee");
function piquet(u, v, h) {
  const [tx, ty] = P(u, v, h);
  return box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, h, WOOD) + `<path d="M${f2(tx - 2.3)},${f2(ty + 1)} L${f2(tx)},${f2(ty - 3)} L${f2(tx + 2.3)},${f2(ty + 1)} Z" fill="${WOOD.top}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
}
__name(piquet, "piquet");
function guirlande(a, b, nb, n, decal = 0) {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 4.4];
  const q = /* @__PURE__ */ __name((t) => [(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * m[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * m[1] + t * t * b[1]], "q");
  let s = pathTk(`M${f2(a[0])},${f2(a[1])} Q${f2(m[0])},${f2(m[1])} ${f2(b[0])},${f2(b[1])}`, CORDE, 0.7);
  for (let i = 1; i <= nb; i++) {
    const t = i / (nb + 1), [x, y] = q(t), sw = [0.9, 0, -0.9][(n + i) % 3];
    s += `<path d="M${f2(x - 2)},${f2(y - 0.2)} L${f2(x + 2)},${f2(y + 0.2)} L${f2(x + sw)},${f2(y + 4.6)} Z" fill="${FANIONS[(i + decal) % FANIONS.length]}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`;
  }
  return s;
}
__name(guirlande, "guirlande");
function planches(u0, u1, v, c = 3) {
  let s = shadow((u0 + u1) / 2, v, (u1 - u0) * 0.45, 0.16);
  for (let i = 0; i < c; i++) {
    const d = i % 2 ? 0.03 : -0.02;
    s += box(u0 + d, v - 0.09, u1 + d, v + 0.09, i * 2.6, i * 2.6 + 2.6, WOOD);
    s += ln(P(u0 + d + 0.02, v + 0.09, i * 2.6 + 1.3), P(u1 + d - 0.02, v + 0.09, i * 2.6 + 1.3), "rgba(90,55,25,.35)", 0.5);
  }
  return s;
}
__name(planches, "planches");
function pierres(u, v, c = 3, couleur = STONE) {
  const place = [[0, 0, 0], [0.16, 0.02, 0], [0.07, 0.01, 6]].slice(0, c);
  return shadow(u + 0.08, v, 0.2, 0.16) + place.map(([du, dv, z]) => box(u + du - 0.08, v + dv - 0.08, u + du + 0.08, v + dv + 0.08, z, z + 6, couleur) + ln(P(u + du - 0.06, v + dv + 0.08, z + 3), P(u + du + 0.06, v + dv + 0.08, z + 3), "rgba(120,110,95,.4)", 0.5)).join("");
}
__name(pierres, "pierres");
function tuiles(u, v) {
  let s = shadow(u, v, 0.16, 0.16);
  for (let i = 0; i < 4; i++) s += box(u - 0.1, v - 0.08, u + 0.1, v + 0.08, i * 2, i * 2 + 2, TUILE) + ln(P(u - 0.1, v + 0.08, i * 2 + 2), P(u + 0.1, v + 0.08, i * 2 + 2), "rgba(255,255,255,.35)", 0.5);
  return s;
}
__name(tuiles, "tuiles");
function mortier(u, v) {
  const [mx, my] = P(u, v, 7);
  return shadow(u, v, 0.1, 0.18) + cylinder(u, v, 0, 7, 0.09, { top: "#CFC6B4", left: "#9AA6B2", right: "#6F7A85" }, `mortier${f2(u * 100)}${f2(v * 100)}`.replace(/[.-]/g, "x")) + ell(mx, my, 3.6, 1.6, "#E6DFD0") + ell(mx - 1, my - 0.4, 1.4, 0.6, "#FFFFFF", ' opacity=".6"') + `<path d="M${f2(mx - 1)},${f2(my)} l3.4,-6" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M${f2(mx - 1)},${f2(my)} l3.4,-6" stroke="${WOOD.right}" stroke-width="1.3" stroke-linecap="round"/><path d="M${f2(mx - 3)},${f2(my + 0.6)} l4,-1.4 l1,1.6 Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
}
__name(mortier, "mortier");
function tas(u, v, s = 1) {
  const [hx, hy] = P(u, v, 0);
  const d = `M${f2(hx - 13 * s)},${f2(hy + 2)} Q${f2(hx - 9 * s)},${f2(hy - 8 * s)} ${f2(hx)},${f2(hy - 9 * s)} Q${f2(hx + 9 * s)},${f2(hy - 8 * s)} ${f2(hx + 13 * s)},${f2(hy + 2)} Q${f2(hx)},${f2(hy + 6)} ${f2(hx - 13 * s)},${f2(hy + 2)} Z`;
  return `<path d="${d}" fill="${TERRE.claire}" stroke="${OUT}" stroke-width="0.8"/><path d="M${f2(hx - 6 * s)},${f2(hy - 5 * s)} q4,-3 8,-1" stroke="#C99A62" stroke-width="1.2" fill="none" stroke-linecap="round"/>` + ell(hx + 5 * s, hy - 1, 2, 1.2, TERRE.motte) + ell(hx - 8 * s, hy + 1, 1.6, 1, TERRE.sombre) + `<path d="M${f2(hx + 2)},${f2(hy - 4 * s)} l4.2,0.8 l-0.6,5.6 q-2,1.6 -4.2,-0.6 Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + tk([hx + 4, hy - 3.6 * s], [hx + 8, hy - 3.6 * s - 17], WOOD.left, 1.4) + tk([hx + 5.6, hy - 3.6 * s - 18], [hx + 10.6, hy - 3.6 * s - 18], WOOD.top, 1.2);
}
__name(tas, "tas");
function brouette(u, v, charge = "terre") {
  const [x, y] = P(u, v, 0);
  const caisse2 = [[x - 9, y - 9], [x + 6, y - 9], [x + 4, y - 3], [x - 7, y - 3]];
  let s = ell(x, y + 1.6, 12, 3.4, "rgba(40,55,20,.18)");
  s += tk([x + 4, y - 4], [x + 12, y - 1], WOOD.left, 1.3) + tk([x + 3, y - 6], [x + 12.5, y - 3], WOOD.left, 1.3);
  s += tk([x + 3, y - 3], [x + 4, y + 1.2], WOOD_DARK.left, 1);
  s += charge === "terre" ? `<path d="M${f2(x - 9)},${f2(y - 9)} Q${f2(x - 1.5)},${f2(y - 16)} ${f2(x + 6)},${f2(y - 9)} Z" fill="${TERRE.claire}" stroke="${OUT}" stroke-width="0.7"/>` + ell(x - 2, y - 12, 2, 1.1, TERRE.motte) : [[-5, -10.5], [0.5, -11], [-2.2, -13.4]].map(([dx, dy]) => ell(x + dx, y + dy, 3, 2.2, STONE.left, ` stroke="${OUT}" stroke-width="0.6"`) + ell(x + dx - 0.8, y + dy - 0.8, 1.2, 0.7, "#FFFFFF", ' opacity=".55"')).join("");
  s += poly(caisse2, "#4F8FC0") + ln([x - 7.6, y - 7.4], [x + 4.8, y - 7.4], "rgba(255,255,255,.4)", 0.8);
  s += ell(x - 8, y - 1, 3.4, 3.4, OUT) + ell(x - 8, y - 1, 2.4, 2.4, "#5A5250") + ell(x - 8, y - 1, 0.8, 0.8, "#C9C2B6");
  return s;
}
__name(brouette, "brouette");
function panneau(u, v) {
  const [sx, sy] = P(u, v, 19);
  return box(u - 0.025, v - 0.025, u + 0.025, v + 0.025, 0, 18, WOOD_DARK) + face([[u - 0.18, v, 14], [u + 0.18, v, 14], [u + 0.18, v, 24], [u - 0.18, v, 24]], "#F3D27A", EDGE) + `<path d="M${f2(sx - 4)},${f2(sy + 3.6)} L${f2(sx - 4)},${f2(sy - 0.4)} L${f2(sx)},${f2(sy - 3.6)} L${f2(sx + 4)},${f2(sy - 0.4)} L${f2(sx + 4)},${f2(sy + 3.6)} Z" fill="none" stroke="#4A3426" stroke-width="0.9" stroke-linejoin="round" opacity=".8"/><rect x="${f2(sx - 1)}" y="${f2(sy + 0.8)}" width="2" height="2.8" fill="#4A3426" opacity=".8"/>`;
}
__name(panneau, "panneau");
function caissePlan(u, v) {
  const z = 9.2, c = 0.14, pt = /* @__PURE__ */ __name((du, dv) => [u + du, v + dv, z], "pt");
  let s = shadow(u, v, 0.14, 0.16) + box(u - 0.11, v - 0.11, u + 0.11, v + 0.11, 0, 9, WOOD) + ln(P(u - 0.09, v + 0.11, 1), P(u + 0.09, v + 0.11, 8), "rgba(70,40,20,.45)", 0.8);
  s += face([pt(-c, -c), pt(c, -c), pt(c, c), pt(-c, c)], "#6FA3D9", EDGE);
  const tr = /* @__PURE__ */ __name((a, b) => ln(P(...pt(...a)), P(...pt(...b)), "#FFFFFF", 0.6), "tr");
  s += tr([-0.07, -0.06], [0.07, -0.06]) + tr([0.07, -0.06], [0.07, 0.07]) + tr([0.07, 0.07], [-0.07, 0.07]) + tr([-0.07, 0.07], [-0.07, -0.06]) + tr([-0.07, 0], [0.07, 0]) + tr([0, 0], [0, 0.07]);
  const [ax, ay] = P(u - c + 0.01, v - c + 0.02, z + 1.2), [bx, by] = P(u - c + 0.01, v + c - 0.02, z + 1.2);
  s += `<path d="M${f2(ax)},${f2(ay)} L${f2(bx)},${f2(by)}" stroke="${OUT}" stroke-width="3.8" stroke-linecap="round"/><path d="M${f2(ax)},${f2(ay)} L${f2(bx)},${f2(by)}" stroke="#5E92C4" stroke-width="2.4" stroke-linecap="round"/>` + ln([ax + 0.6, ay - 0.6], [bx + 0.6, by - 0.6], "rgba(255,255,255,.5)", 0.6);
  const [gx, gy] = P(u + c - 0.03, v + c - 0.03, z);
  return s + ell(gx, gy - 0.8, 2.2, 1.5, STONE.left, ` stroke="${OUT}" stroke-width="0.6"`) + ell(gx - 0.6, gy - 1.3, 0.9, 0.5, "#FFFFFF", ' opacity=".6"');
}
__name(caissePlan, "caissePlan");
function trace(g) {
  const { u0, u1, v0, v1 } = g, c = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  let s = `<polygon points="${pts2(c.map(([u, v]) => P(u, v, 0)))}" fill="none" stroke="#FFF8E8" stroke-width="1.5" stroke-dasharray="3.4 2.4" opacity=".9"/>`;
  const pq = /* @__PURE__ */ __name(([u, v]) => box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 0, 5, WOOD), "pq");
  s += pq(c[0]) + pq(c[1]) + pq(c[3]);
  s += [[0, 1], [0, 3]].map(([a, b]) => ln(P(...c[a], 4), P(...c[b], 4), CORDE, 0.6)).join("");
  s += [[1, 2], [3, 2]].map(([a, b]) => ln(P(...c[a], 4), P(...c[b], 4), CORDE, 0.6)).join("") + pq(c[2]);
  return s;
}
__name(trace, "trace");
function echelle(pied, tete, nb) {
  const a = P(...pied), b = P(...tete), e = 2.6;
  let s = tk([a[0] - e, a[1]], [b[0] - e, b[1]], WOOD.left, 1.1) + tk([a[0] + e, a[1]], [b[0] + e, b[1]], WOOD.left, 1.1);
  for (let i = 1; i <= nb; i++) {
    const t = i / (nb + 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    s += ln([x - e, y], [x + e, y], WOOD.right, 1);
  }
  return s;
}
__name(echelle, "echelle");
function seauPendu(haut, long, n) {
  const a = [-1.6, 0, 1.6][n % 3], b = [haut[0] + a, haut[1] + long];
  return ln(haut, b, OUT, 1.6) + ln(haut, b, CORDE, 0.7) + `<path d="M${f2(b[0] - 3)},${f2(b[1] + 0.6)} L${f2(b[0] + 3)},${f2(b[1] + 0.6)} L${f2(b[0] + 2.2)},${f2(b[1] + 5.4)} L${f2(b[0] - 2.2)},${f2(b[1] + 5.4)} Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + ell(b[0], b[1] + 0.6, 3, 1, "#E6DFD0", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f2(b[0] - 3)},${f2(b[1] + 0.6)} Q${f2(b[0])},${f2(b[1] - 2.6)} ${f2(b[0] + 3)},${f2(b[1] + 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
}
__name(seauPendu, "seauPendu");
function dalle(g) {
  const { u0, u1, v0, v1, F } = g;
  let s = box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, F, STONE);
  const n = Math.round((u1 - u0) / 0.22);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    s += ln(P(u0 + (u1 - u0) * t, v0, F), P(u0 + (u1 - u0) * t, v1, F), "rgba(120,110,95,.32)", 0.5) + ln(P(u0, v0 + (v1 - v0) * t, F), P(u1, v0 + (v1 - v0) * t, F), "rgba(120,110,95,.32)", 0.5);
  }
  for (let i = 1; i < n; i++) {
    const t = (i + 0.5) / n;
    if (t < 1) s += ln(P(u0 + (u1 - u0) * t, v1 + 0.04, 0.6), P(u0 + (u1 - u0) * t, v1 + 0.04, F - 0.6), "rgba(120,110,95,.4)", 0.5) + ln(P(u1 + 0.04, v0 + (v1 - v0) * t, 0.6), P(u1 + 0.04, v0 + (v1 - v0) * t, F - 0.6), "rgba(90,80,70,.4)", 0.5);
  }
  return s;
}
__name(dalle, "dalle");
var poteau = /* @__PURE__ */ __name((u, v, z0, z1, c = WOOD) => box(u - 0.04, v - 0.04, u + 0.04, v + 0.04, z0, z1, c), "poteau");
function poutre(a, b, z, c = WOOD) {
  const du = b[0] - a[0], dv = b[1] - a[1];
  return du ? box(Math.min(a[0], b[0]) - 0.04, a[1] - 0.04, Math.max(a[0], b[0]) + 0.04, a[1] + 0.04, z - 3, z, c) : box(a[0] - 0.04, Math.min(a[1], b[1]) - 0.04, a[0] + 0.04, Math.max(a[1], b[1]) + 0.04, z - 3, z, c);
}
__name(poutre, "poutre");
function charpente(g, part) {
  const { u0, u1, v0, v1, F, W } = g, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
  if (part === "fond") return poteau(u0, v0, F, W) + poteau(um, v0, F, W) + poteau(u0, vm, F, W) + poteau(u1, v0, F, W) + poteau(u0, v1, F, W) + poutre([u0, v0], [u1, v0], W) + poutre([u0, v0], [u0, v1], W);
  return poteau(um, v1, F, W) + poteau(u1, vm, F, W) + poteau(u1, v1, F, W) + poutre([u0, v1], [u1, v1], W) + poutre([u1, v0], [u1, v1], W) + tk(P(u0 + 0.06, v1 + 0.04, F + 2), P(um - 0.06, v1 + 0.04, W - 4), WOOD.left, 1.4) + tk(P(u1 + 0.04, vm + 0.06, F + 2), P(u1 + 0.04, v1 - 0.06, W - 4), WOOD.right, 1.4);
}
__name(charpente, "charpente");
function mursFond(g) {
  const { u0, u1, v0, v1, F, W } = g;
  return face([[u0, v0, F], [u1, v0, F], [u1, v0, W], [u0, v0, W]], DEDANS.gauche, EDGE) + face([[u0, v0, F], [u0, v1, F], [u0, v1, W], [u0, v0, W]], DEDANS.droite, EDGE) + face([[u0, v0, F], [u1, v0, F], [u1, v1, F], [u0, v1, F]], DEDANS.sol, EDGE);
}
__name(mursFond, "mursFond");
function mursDevant(g) {
  const { u0, u1, v0, v1, F, W, R: R2 } = g, um = (u0 + u1) / 2, vm = (v0 + v1) / 2, zm = (F + W) / 2;
  let s = face([[u0, v1, F], [u1, v1, F], [u1, v1, W], [u0, v1, W]], WALL.left, EDGE) + face([[u1, v0, F], [u1, v1, F], [u1, v1, W], [u1, v0, W]], WALL.right, EDGE);
  const bois = /* @__PURE__ */ __name((a, b) => ln(P(...a), P(...b), COLOMBAGE, 1.6), "bois");
  s += bois([um, v1, F], [um, v1, W]) + bois([u0, v1, zm], [u1, v1, zm]) + bois([u1, vm, F], [u1, vm, W]) + bois([u1, v0, zm], [u1, v1, zm]);
  s += bois([u0 + 0.04, v1, F + 1], [um - 0.04, v1, zm - 1]) + bois([u1, v0 + 0.04, zm + 1], [u1, vm - 0.04, W - 1]);
  s += doorLeft(um + 0.08 * R2, u1 - 0.1 * R2, v1, Math.round(zm - F + 4) + F) + windowLeft(u0 + 0.1 * R2, um - 0.1 * R2, v1, zm + 2, W - 3) + windowRight(u1, vm + 0.08 * R2, v1 - 0.1 * R2, zm + 2, W - 3);
  s += poutre([u0, v1], [u1, v1], W) + poutre([u1, v0], [u1, v1], W);
  return s;
}
__name(mursDevant, "mursDevant");
function toit(g, n) {
  const { u0, u1, v0, v1, W, h } = g, vm = (v0 + v1) / 2, o = 0.08;
  let s = gable(u0, v0, u1, v1, W, h, { front: "#5A3A28", back: ROOF_RED.back, gable: WALL.right }, o);
  s += ln(P(u1, vm, W), P(u1, vm, W + h - 2), COLOMBAGE, 1.4) + ln(P(u1, v0 + 0.1, W + 1), P(u1, vm, W + h - 2), COLOMBAGE, 1.2);
  const A2 = /* @__PURE__ */ __name((t, w) => [u0 - o + (u1 - u0 + 2 * o) * t, v1 + o + (vm - v1 - o) * w, W + h * w], "A");
  for (let i = 0; i <= 6; i++) s += ln(P(...A2(i / 6, 0)), P(...A2(i / 6, 1)), WOOD.top, 1.6) + ln(P(...A2(i / 6, 0)), P(...A2(i / 6, 1)), "rgba(60,40,25,.5)", 0.4);
  for (let j = 1; j <= 4; j++) s += ln(P(...A2(0, j / 5)), P(...A2(1, j / 5)), WOOD.left, 1.1);
  const bas = 0.42;
  s += poly([P(...A2(0, 0)), P(...A2(1, 0)), P(...A2(1, bas)), P(...A2(0, bas))], ROOF_RED.front);
  for (let j = 1; j <= 3; j++) s += ln(P(...A2(0.01, bas * j / 3.4)), P(...A2(0.99, bas * j / 3.4)), "rgba(140,50,35,.45)", 0.7);
  for (let i = 1; i < 10; i++) s += ln(P(...A2(i / 10, 0)), P(...A2(i / 10 + 0.01, bas)), "rgba(140,50,35,.25)", 0.5);
  const [bx, by] = P(u1 + o - 0.02, vm, W + h);
  s += tk([bx, by], [bx, by - 7], WOOD_DARK.left, 1);
  s += [[0, -7, 4.2, 6], [0, -10.4, 3.4, 5], [0, -13.2, 2.4, 4]].map(([dx, dy, w, hh], i) => `<path d="M${f2(bx + dx - w)},${f2(by + dy + 1)} L${f2(bx + dx)},${f2(by + dy - hh + 1)} L${f2(bx + dx + w)},${f2(by + dy + 1)} Z" fill="${SAPIN[i]}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`).join("");
  s += ["#E2574C", "#F2C04B", "#6FA3D9"].map((c, i) => {
    const o2 = [0, 1, 2][(n + i) % 3] - 1, x0 = bx + 0.8, y0 = by - 6.6 + i * 0.8;
    return pathTk(`M${f2(x0)},${f2(y0)} c${f2(2.6)},${f2(-1.4 + o2)} ${f2(4.4)},${f2(1.6 + i * 0.8)} ${f2(6.6)},${f2(1 + i * 1.2)} s${f2(3.4)},${f2(-1.8 - o2)} ${f2(5.4)},${f2(0.6 + i * 1.4)}`, c, 1);
  }).join("");
  return s;
}
__name(toit, "toit");
function echafaudageDroite(g, n) {
  const { u1, v0, v1, F, W } = g, ue = u1 + 0.16, z = Math.round((F + W) / 2) + 2;
  let s = "";
  for (const v of [v0 + 0.06, v1 - 0.02]) s += tk(P(ue, v, 0), P(ue, v, W + 6), WOOD_DARK.left, 1.2);
  s += box(u1 + 0.04, v0 + 0.02, ue + 0.04, v1 + 0.02, z - 2, z, WOOD) + ln(P(ue + 0.04, v0 + 0.06, z + 7), P(ue + 0.04, v1 - 0.02, z + 7), OUT, 2.2) + ln(P(ue + 0.04, v0 + 0.06, z + 7), P(ue + 0.04, v1 - 0.02, z + 7), WOOD.left, 1);
  const [fx, fy] = P(ue, v1 - 0.02, W + 6), w = [0, 1, -0.6][n % 3];
  s += `<path d="M${f2(fx)},${f2(fy)} L${f2(fx + 7 + w)},${f2(fy + 2 - w * 0.4)} L${f2(fx)},${f2(fy + 4.6)} Z" fill="#E2574C" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
  return s;
}
__name(echafaudageDroite, "echafaudageDroite");
var ETAPES = ["piquets", "terrassement", "fondations", "charpente", "murs", "toit"];
function montage(emprise, etape5, n = 0) {
  const g = geo(emprise), { R: R2, k, u0, u1, v0, v1, F, W } = g, i = ETAPES.indexOf(etape5);
  if (i < 0) throw new Error("étape inconnue : " + etape5);
  const hp = 13;
  const coin = [[-k, -k], [k, -k], [k, k], [-k, k]].map(([u, v]) => P(u, v, hp - 1.5));
  const nb = Math.round(4 * R2);
  let s = shadow(0, 0, 1.08 * R2, 0.1);
  if (i === 0) s += [[-0.3, 0.1, 3], [0.25, -0.35, 2.6], [0.1, 0.4, 2.2]].map(([u, v, r]) => {
    const [x, y] = P(u * R2, v * R2, 0);
    return ell(x, y, r * 2.2, r, "rgba(150,110,60,.18)");
  }).join("");
  else {
    const blob = Array.from({ length: 28 }, (_, j) => {
      const t = j / 28 * Math.PI * 2, r = 0.74 * R2 * (1 + 0.07 * Math.sin(t * 3 + 0.6) + 0.04 * Math.sin(t * 5));
      return P(Math.cos(t) * r - 0.06 * R2, Math.sin(t) * r - 0.06 * R2, 0);
    });
    s += `<polygon points="${pts2(blob)}" fill="rgba(150,105,60,.45)"/>`;
    s += [[-0.3, -0.2, 3.4], [0.2, 0.25, 2.8], [0.38, -0.32, 2.4], [-0.12, 0.42, 2], [0.04, -0.5, 2.2]].map(([u, v, r], j) => {
      const [x, y] = P(u * R2, v * R2, 0);
      return ell(x, y, r, r * 0.6, j % 2 ? TERRE.motte : TERRE.claire);
    }).join("");
    if (i <= 2) s += pebble(0.3 * R2, -0.18 * R2, 2.4) + pebble(-0.26 * R2, 0.32 * R2, 2);
  }
  s += guirlande(coin[0], coin[1], nb, n) + guirlande(coin[3], coin[0], nb, n, 2);
  s += piquet(-k, -k, hp) + piquet(k, -k, hp) + piquet(-k, k, hp);
  if (i >= 2) s += dalle(g);
  if (i >= 4) s += mursFond(g);
  if (i >= 3) s += charpente(g, "fond");
  if (i >= 3) s += charpente(g, "devant");
  if (i === 3) s += seauPendu(P(u1, (v0 + v1) / 2 + 0.06, W - 1.5), 10 + 2 * R2, n);
  if (i >= 4) s += mursDevant(g);
  if (i >= 5) s += toit(g, n);
  if (i === 3 || i === 4) s += echelle([u0 + 0.14 * R2, v1 + 0.24 * R2, 0], [u0 + 0.14 * R2, v1 + 0.04, W + 3], Math.round(5 * g.hs));
  if (i >= 4) s += echafaudageDroite(g, n);
  if (i === 4) s += seauPendu(P(u1 + 0.18, v1 - 0.02, W + 4), 14 * g.hs, n);
  const o = R2 === 1 ? 1 : 1.25, at = /* @__PURE__ */ __name((u, v, f) => gros(u * R2, v * R2, o, f(u * R2, v * R2)), "at");
  if (i === 0) s += at(0.2, -0.12, caissePlan);
  if (i === 1) s += at(0.58, -0.24, (u, v) => brouette(u, v, "terre"));
  if (i <= 1) s += trace(g);
  if (i === 2) s += at(0.7, -0.45, (u, v) => pierres(u, v, 3)) + at(0.72, 0.02, (u, v) => brouette(u, v, "pierres")) + at(0.74, 0.44, mortier);
  if (i === 3) s += at(0.7, -0.45, (u, v) => pierres(u, v, 2)) + at(0.72, 0.1, mortier);
  if (i === 5) s += at(0.72, -0.36, tuiles);
  if (i >= 3) s += gros(0.09 * R2, 0.72 * R2, o, planches(-0.18 * R2, 0.36 * R2, 0.72 * R2, i === 3 ? 3 : 2));
  if (i === 1) s += at(0.3, 0.24, (u, v) => tas(u, v, 1));
  s += at(-0.52, 0.8, panneau);
  s += guirlande(coin[1], coin[2], nb, n, 1) + guirlande(coin[2], coin[3], nb, n, 3) + piquet(k, k, hp);
  if (i === 1) {
    const [x, y] = P(0.3 * R2, 0.24 * R2, 12 * o);
    s += bouffee(x - 10 + n * 3, y - n * 2.4, 2.4 + n * 0.5, [0.95, 0.75, 0.45][n]);
  }
  if (i === 2) {
    const [x, y] = P(0.7 * R2, -0.45 * R2, 14 * o);
    s += bouffee(x + 6 - n * 2, y - n * 2.6, 2.2 + n * 0.5, [0.9, 0.7, 0.4][n]);
  }
  return s;
}
__name(montage, "montage");
function devoilement(emprise, n) {
  const { R: R2, hs } = geo(emprise), t = (n + 1) / 4;
  let s = "";
  const tour = 12;
  for (let j = 0; j < tour; j++) {
    const a = j / tour * Math.PI * 2 + 0.26, r = (0.7 + 0.42 * t) * R2;
    if (Math.cos(a) + Math.sin(a) < -0.35) continue;
    const [x, y] = P(Math.cos(a) * r, Math.sin(a) * r, 2 + 6 * t);
    s += bouffee(x, y, (4.4 - 1.8 * t) * hs, f2(1.05 - t * 0.85));
  }
  const etoile3 = /* @__PURE__ */ __name((x, y, r, c) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x + r * 0.18)},${f2(y - r * 0.18)} ${f2(x + r)},${f2(y)} Q${f2(x + r * 0.18)},${f2(y + r * 0.18)} ${f2(x)},${f2(y + r)} Q${f2(x - r * 0.18)},${f2(y + r * 0.18)} ${f2(x - r)},${f2(y)} Q${f2(x - r * 0.18)},${f2(y - r * 0.18)} ${f2(x)},${f2(y - r)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`, "etoile");
  const vol = [[-38, -50], [34, -62], [-12, -84], [46, -30], [-48, -22], [10, -100]];
  vol.forEach(([x, y], j) => {
    if ((j + n) % 2 === 0 || n === 1) s += etoile3(x * R2 * 0.9, y * hs - n * 6, (n === 1 ? 4.6 : 3.4) - j % 3 * 0.6, j % 2 ? "#FFF4C2" : "#FFD36A");
  });
  if (n >= 1) {
    const pet = [[-30, -40, "#F7A8B0"], [24, -52, "#FFFFFF"], [-6, -70, "#F2C04B"], [40, -18, "#B3E386"], [-44, -10, "#F7A8B0"], [14, -86, "#6FA3D9"], [0, -30, "#FFFFFF"]];
    pet.forEach(([x, y, c], j) => {
      const yy = y * hs + (n - 1) * 9 + j, xx = x * R2 * 0.95 + Math.sin(j + n) * 3;
      s += `<ellipse cx="${f2(xx)}" cy="${f2(yy)}" rx="2.2" ry="1.3" transform="rotate(${(j * 47 + n * 30) % 180} ${f2(xx)} ${f2(yy)})" fill="${c}" stroke="${OUT}" stroke-width="0.45"/>`;
    });
  }
  return s;
}
__name(devoilement, "devoilement");
function echafaudage(emprise, couche, n = 0) {
  const { R: R2, hs } = geo(emprise), e = 0.9 * R2, H = Math.round(50 * hs), z1 = Math.round(H * 0.42), z2 = Math.round(H * 0.84);
  const perche = /* @__PURE__ */ __name((u, v) => tk(P(u, v, 0), P(u, v, H), WOOD_DARK.left, 1.2) + ell(...P(u, v, 0), 2.4, 1.2, "rgba(40,55,20,.2)"), "perche");
  const plancher = /* @__PURE__ */ __name((a, b, z) => {
    const du = b[0] - a[0], w2 = 0.07;
    return du ? box(Math.min(a[0], b[0]), a[1] - w2, Math.max(a[0], b[0]), a[1] + w2, z - 1.8, z, WOOD) : box(a[0] - w2, Math.min(a[1], b[1]), a[0] + w2, Math.max(a[1], b[1]), z - 1.8, z, WOOD);
  }, "plancher");
  const rambarde = /* @__PURE__ */ __name((a, b, z) => ln(P(a[0], a[1], z), P(b[0], b[1], z), OUT, 2) + ln(P(a[0], a[1], z), P(b[0], b[1], z), WOOD.left, 0.9), "rambarde");
  if (couche === "derriere") {
    return perche(-e, -e) + perche(e, -e) + perche(-e, e) + [z1, z2].map((z) => plancher([-e, -e], [e, -e], z) + plancher([-e, -e], [-e, e], z) + rambarde([-e, -e], [e, -e], z + 7) + rambarde([-e, -e], [-e, e], z + 7)).join("");
  }
  let s = perche(-e, e) + perche(e, -e);
  s += [z1, z2].map((z) => plancher([e, -e], [e, e], z) + rambarde([e, -e], [e, e], z + 7)).join("");
  s += perche(e, e);
  s += echelle([e + 0.24, 0.1 * R2, 0], [e + 0.03, 0.1 * R2, z1 + 5], Math.round(4 * hs));
  const [fx, fy] = P(e, e, H), w = [0, 1, -0.6][n % 3];
  s += `<path d="M${f2(fx)},${f2(fy)} L${f2(fx + 8 + w)},${f2(fy + 2.2 - w * 0.4)} L${f2(fx)},${f2(fy + 5)} Z" fill="#F2C04B" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += seauPendu(P(e, -0.35 * R2, z2 + 6), 12 * hs, n);
  return s;
}
__name(echafaudage, "echafaudage");

// atelier/cultures.mjs
var OUT2 = "#3C2819";
var f22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var ln2 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f22(a[0])}" y1="${f22(a[1])}" x2="${f22(b[0])}" y2="${f22(b[1])}" stroke="${color}" stroke-width="${f22(w)}" stroke-linecap="round"/>`, "ln");
var ell2 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${f22(rx)}" ry="${f22(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r)}" fill="${fill}"/>`, "dot");
var chemin = /* @__PURE__ */ __name((d, stroke, w, fill = "none") => `<path d="${d}" stroke="${stroke}" stroke-width="${f22(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`, "chemin");
var wave = /* @__PURE__ */ __name((f, n, amp = 1, phase = 0) => Math.sin(f / n * Math.PI * 2 + phase) * amp, "wave");
var CADRE = [-34, -30, 68, 48];
var CULTURES = ["ble", "carottes", "citrouilles", "laitues", "choux", "tomates", "haricots", "fraises", "pommes_de_terre"];
var ETAPES2 = ["bechage", "sillons", "semis", "pousses", "croissance"];
var ETAPES_POTAGER = [...ETAPES2, "mur"];
var etapesDe = /* @__PURE__ */ __name((culture) => POTAGER[culture] ? ETAPES_POTAGER : ETAPES2, "etapesDe");
var IMAGES = 3;
var COLS = [-0.31, -0.155, 0, 0.155, 0.31];
var ROWS = [-0.28, -0.14, 0, 0.14, 0.28];
var TERRE2 = { bord: "#8A5A36", dedans: "#9B6A42", creux: "#6E4528", crete: "#B07E54", motte: "#7E5232", clair: "#B98A5E" };
var HERBE = { fond: "#8FC060", clair: "#A9D67E", brin: "#5E9A3E" };
var LEAF = "#5FA04A";
var LEAF_LIGHT = "#8FCB6A";
var carre = /* @__PURE__ */ __name((r, fill, extra = EDGE) => face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra), "carre");
var sillons = /* @__PURE__ */ __name(() => ROWS.map((dv) => ln2(P(-0.4, dv, 0), P(0.4, dv, 0), TERRE2.creux, 2.6) + ln2(P(-0.4, dv - 0.03, 0.6), P(0.4, dv - 0.03, 0.6), TERRE2.crete, 1)).join(""), "sillons");
var plants = /* @__PURE__ */ __name(() => ROWS.flatMap((dv, r) => COLS.map((du, c) => ({ du, dv, k: r * 5 + c }))).sort((a, b) => a.du + a.dv - (b.du + b.dv)), "plants");
var touffe = /* @__PURE__ */ __name((x, y, s = 1) => [-1.2, 0, 1.2].map((o, i) => ln2([x + o * 0.5 * s, y], [x + o * s, y - (2.4 + (i === 1 ? 1 : 0)) * s], HERBE.brin, 0.7)).join(""), "touffe");
var piquet2 = /* @__PURE__ */ __name((u, v) => box(u - 0.022, v - 0.022, u + 0.022, v + 0.022, 0, 8, WOOD), "piquet");
function bornage(f, devant) {
  if (!devant) return piquet2(0.44, -0.44) + piquet2(-0.44, 0.44);
  const [rx, ry] = P(0.44, -0.44, 7.4), s = wave(f, IMAGES, 1.2);
  return piquet2(0.44, 0.44) + ln2(P(0.44, -0.44, 7), P(0.44, 0.44, 7), "rgba(235,225,200,.8)", 0.5) + ln2(P(-0.44, 0.44, 7), P(0.44, 0.44, 7), "rgba(235,225,200,.8)", 0.5) + chemin(`M${f22(rx)},${f22(ry)} q${f22(2 + s * 0.5)},${f22(0.6 + s)} ${f22(4 + s)},${f22(0.2 + s * 1.4)}`, "#E2574C", 1.1);
}
__name(bornage, "bornage");
function beche(u, v) {
  const [x, y] = P(u, v, 0);
  return `<polygon points="${f22(x - 2)},${f22(y - 4)} ${f22(x + 2)},${f22(y - 4.4)} ${f22(x + 1.7)},${f22(y + 0.6)} ${f22(x - 1.6)},${f22(y + 1)}" fill="#A9AFB8"${EDGE}/>` + ln2([x + 0.1, y - 4.2], [x + 1.2, y - 15], OUT2, 2.4) + ln2([x + 0.1, y - 4.2], [x + 1.2, y - 15], WOOD.left, 1.3) + ln2([x - 0.8, y - 15.1], [x + 3.2, y - 15.5], OUT2, 2.2) + ln2([x - 0.8, y - 15.1], [x + 3.2, y - 15.5], WOOD.top, 1.1);
}
__name(beche, "beche");
function rateau(u, v) {
  const a = P(u, v, 0.6), b = P(u + 0.3, v - 0.12, 0.6);
  let out = ln2(a, b, OUT2, 2.2) + ln2(a, b, WOOD.left, 1.2);
  const [hx, hy] = b;
  out += ln2([hx - 1.4, hy + 2.4], [hx + 1.6, hy - 2.2], OUT2, 2) + ln2([hx - 1.4, hy + 2.4], [hx + 1.6, hy - 2.2], "#8A8F98", 1);
  for (let k = 0; k < 5; k++) {
    const t = k / 4, x = hx - 1.4 + t * 3, y = hy + 2.4 - t * 4.6;
    out += ln2([x, y], [x + 1.4, y + 0.4], "#6E737C", 0.6);
  }
  return out;
}
__name(rateau, "rateau");
function ver(u, v, f) {
  const [x, y] = P(u, v, 0), s = wave(f, IMAGES, 1);
  return chemin(`M${f22(x - 2.4)},${f22(y)} q${f22(1)},${f22(-1.4 + s)} ${f22(2.2)},${f22(-0.4)} q${f22(1.2)},${f22(1 - s)} ${f22(2.2)},${f22(-1.2 - s * 0.4)}`, OUT2, 1.9) + chemin(`M${f22(x - 2.4)},${f22(y)} q${f22(1)},${f22(-1.4 + s)} ${f22(2.2)},${f22(-0.4)} q${f22(1.2)},${f22(1 - s)} ${f22(2.2)},${f22(-1.2 - s * 0.4)}`, "#E9A0A0", 1);
}
__name(ver, "ver");
function moineau(u, v, f) {
  const [x, y] = P(u, v, 0), t = f === 1 ? 2.2 : 0;
  return ell2(x, y + 0.5, 3.4, 0.9, "rgba(40,55,20,.25)") + ln2([x - 0.5, y - 0.2], [x - 0.8, y - 1.8], "#C8862A", 0.6) + ln2([x + 0.7, y - 0.2], [x + 0.5, y - 1.8], "#C8862A", 0.6) + `<path d="M${f22(x - 4.6)},${f22(y - 3.2)} Q${f22(x - 1.4)},${f22(y - 6.6)} ${f22(x + 2.6)},${f22(y - 4)} Q${f22(x + 1.6)},${f22(y - 1.2)} ${f22(x - 2.6)},${f22(y - 1.6)} Z" fill="#B88352"${EDGE}/><path d="M${f22(x - 2.8)},${f22(y - 2.2)} Q${f22(x)},${f22(y - 1.4)} ${f22(x + 1.6)},${f22(y - 2.4)}" fill="none" stroke="#F0DEC0" stroke-width="0.9" stroke-linecap="round"/>` + chemin(`M${f22(x - 3.4)},${f22(y - 3.6)} q2,-1.4 4,-0.6`, "#7A5232", 0.7) + `<circle cx="${f22(x + 3)}" cy="${f22(y - 5.6 + t)}" r="2" fill="#9A6A42"${EDGE}/>` + ell2(x + 3.1, y - 6.5 + t, 1.4, 0.6, "#6E4A2E") + dot(x + 3.7, y - 5.9 + t, 0.42, "#1E1410") + `<polygon points="${f22(x + 4.8)},${f22(y - 5.6 + t)} ${f22(x + 6.4)},${f22(y - 5 + t)} ${f22(x + 4.8)},${f22(y - 4.8 + t)}" fill="#E8B04A"${EDGE}/>`;
}
__name(moineau, "moineau");
var DESSIN = { ble: "#EBC85E", carottes: "#F08A3A", citrouilles: "#E8862E" };
var dessinDe = /* @__PURE__ */ __name((culture) => DESSIN[culture] || POTAGER[culture].dessin, "dessinDe");
function sachet(u, v, culture) {
  const [x, y] = P(u, v, 0);
  return `<polygon points="${f22(x - 2.6)},${f22(y)} ${f22(x + 2.6)},${f22(y - 0.6)} ${f22(x + 2.8)},${f22(y - 7)} ${f22(x - 2.4)},${f22(y - 6.6)}" fill="#F4E6C8"${EDGE}/>` + ln2([x - 2.4, y - 5.6], [x + 2.8, y - 6], "#C9B48A", 0.6) + ell2(x + 0.2, y - 3, 1.5, 1.7, dessinDe(culture), ` stroke="${OUT2}" stroke-width="0.4"`) + ln2([x + 0.2, y - 4.6], [x + 0.6, y - 5.6], LEAF, 0.7);
}
__name(sachet, "sachet");
function graine(culture, x, y, k) {
  if (culture === "ble") return [-1.6, 0, 1.6].map((o, i) => ell2(x + o, y - 0.4 + i % 2 * 0.3, 0.7, 0.4, "#E2C66E", ` stroke="#A8823A" stroke-width="0.3" transform="rotate(${(k * 37 + i * 50) % 180} ${f22(x + o)} ${f22(y - 0.4)})"`)).join("");
  if (culture === "carottes") return [-1.4, -0.4, 0.6, 1.5].map((o, i) => dot(x + o, y - 0.3 + i % 2 * 0.3, 0.32, "#5A3A22")).join("");
  return k % 2 ? "" : ell2(x - 0.6, y - 0.3, 0.9, 0.55, "#F4E6C0", ' stroke="#B8A47A" stroke-width="0.3"') + ell2(x + 0.8, y - 0.1, 0.9, 0.55, "#F4E6C0", ' stroke="#B8A47A" stroke-width="0.3"');
}
__name(graine, "graine");
function pousse(culture, x, y, f, k) {
  const s = wave(f, IMAGES, 0.6, k * 0.9);
  if (culture === "ble") return [-0.8, 0, 0.8].map((o, i) => ln2([x + o * 0.4, y], [x + o + s, y - 3 - (i === 1 ? 1 : 0)], "#7CBF4E", 0.6)).join("");
  if (culture === "carottes") return [-1, 1].map((o) => chemin(`M${f22(x)},${f22(y)} q${f22(o * 0.4 + s * 0.3)},-1.4 ${f22(o + s * 0.4)},-2.8`, LEAF_LIGHT, 0.8) + dot(x + o + s * 0.4, y - 2.9, 0.6, LEAF_LIGHT)).join("");
  if (k % 2) return "";
  return ln2([x, y], [x + s * 0.3, y - 2.2], "#6FA84A", 0.6) + ell2(x - 1.3 + s * 0.3, y - 2.6, 1.3, 0.8, LEAF_LIGHT, ` stroke="#4F8F3A" stroke-width="0.3"`) + ell2(x + 1.3 + s * 0.3, y - 2.7, 1.3, 0.8, LEAF, ` stroke="#4F8F3A" stroke-width="0.3"`);
}
__name(pousse, "pousse");
function croissance(culture, x, y, f, k) {
  const s = wave(f, IMAGES, 1.2, k * 0.9);
  if (culture === "ble") {
    return [-1.2, 0, 1.2].map((o, i) => {
      const tx = x + o + s * (0.7 + i * 0.15), ty = y - 8 - (i === 1 ? 1.2 : 0);
      return ln2([x + o * 0.4, y], [tx, ty], "#6FA84A", 0.8) + `<ellipse cx="${f22(tx)}" cy="${f22(ty - 1.3)}" rx="0.9" ry="2" fill="#A9CF6A" stroke="#6F9A3E" stroke-width="0.35" transform="rotate(${f22(s * 6)} ${f22(tx)} ${f22(ty)})"/>`;
    }).join("");
  }
  if (culture === "carottes") {
    return ell2(x, y, 1.2, 0.6, "#F08A3A", ' stroke="#C8622A" stroke-width="0.3"') + [-1.8, -0.6, 0.6, 1.8].map((o, i) => chemin(`M${f22(x)},${f22(y - 0.3)} q${f22(o * 0.5 + s * 0.3)},-2.4 ${f22(o * 0.8 + s * 0.5)},-${f22(4.6 + i % 2)}`, i % 2 ? LEAF_LIGHT : LEAF, 1)).join("");
  }
  if (k % 2) return chemin(`M${f22(x - 3)},${f22(y - 0.4)} q${f22(2 + s * 0.3)},-1.6 ${f22(5)},-0.4`, "#5E9A3E", 0.7);
  const fleur = k % 4 === 0;
  return ell2(x, y + 0.2, 4, 1.1, "rgba(40,55,20,.2)") + `<circle cx="${f22(x - 1.8)}" cy="${f22(y - 2)}" r="2" fill="${LEAF}" stroke="#3F7A2E" stroke-width="0.35"/><circle cx="${f22(x + 1.6 + s * 0.3)}" cy="${f22(y - 2.5)}" r="2.2" fill="${LEAF_LIGHT}" stroke="#4F8F3A" stroke-width="0.35"/>` + (fleur ? [0, 72, 144, 216, 288].map((a) => ell2(x + 0.2 + s * 0.3 + Math.cos(a * Math.PI / 180) * 0.9, y - 4.6 + Math.sin(a * Math.PI / 180) * 0.6, 0.8, 0.55, "#F7C83A")).join("") + dot(x + 0.2 + s * 0.3, y - 4.6, 0.45, "#E08A1E") : ell2(x + 0.4, y - 0.8, 1.6, 1.2, "#7FB24A", ' stroke="#4F7A2E" stroke-width="0.35"'));
}
__name(croissance, "croissance");
var BOIS = { tuteur: "#A9794A", fonce: "#7A5232" };
var ROUGE = "#E2453A";
var tige = /* @__PURE__ */ __name((a, b, color = "#5E9A3E", w = 0.7) => ln2(a, b, color, w), "tige");
var feuille = /* @__PURE__ */ __name((x, y, rx, ry, fill, rot = 0, edge = "#3F7A2E") => `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${f22(rx)}" ry="${f22(ry)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"${rot ? ` transform="rotate(${f22(rot)} ${f22(x)} ${f22(y)})"` : ""}/>`, "feuille");
var fruit = /* @__PURE__ */ __name((x, y, r, fill, edge) => `<circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.3, "rgba(255,255,255,.55)"), "fruit");
var piquetTuteur = /* @__PURE__ */ __name((x, y, h) => ln2([x, y + 0.4], [x + 0.4, y - h], OUT2, 1.9) + ln2([x, y + 0.4], [x + 0.4, y - h], BOIS.tuteur, 1), "piquetTuteur");
var trefle = /* @__PURE__ */ __name((x, y, r, fill, s = 0) => [-60, 0, 60].map((a) => feuille(x + Math.sin(a * Math.PI / 180) * r * 0.9 + s * 0.2, y - r * 0.8 - Math.cos(a * Math.PI / 180) * r * 0.6, r * 0.62, r * 0.48, fill, a)).join(""), "trefle");
var paille = /* @__PURE__ */ __name((x, y) => [[-3, 0.6, 2.6, -0.2], [-2, -0.6, 3, 0.4], [-3.2, 1.2, 1.4, 1.6]].map(([a, b, c, d]) => ln2([x + a, y + b], [x + c, y + d], "#E8C86A", 0.55)).join(""), "paille");
var butte = /* @__PURE__ */ __name((x, y) => ell2(x, y + 0.2, 3.6, 1.6, TERRE2.motte, ` stroke="${OUT2}" stroke-width="0.35"`) + ell2(x - 0.6, y - 0.3, 2, 0.7, TERRE2.clair), "butte");
function escargot(x, y, f) {
  const d = f * 0.8;
  return chemin(`M${f22(x - 3 + d)},${f22(y)} l3.6,0`, "#E8DCC8", 1.6) + `<circle cx="${f22(x - 1 + d)}" cy="${f22(y - 1.6)}" r="1.7" fill="#C98A4A" stroke="${OUT2}" stroke-width="0.4"/>` + chemin(`M${f22(x - 1.6 + d)},${f22(y - 1.6)} a0.8,0.8 0 1,1 0.8,0.6`, "#8A5A2A", 0.4) + ln2([x + 0.6 + d, y - 0.4], [x + 1.2 + d, y - 2.2], "#E8DCC8", 0.4) + ln2([x + 0.9 + d, y - 0.4], [x + 1.8 + d, y - 1.9], "#E8DCC8", 0.4);
}
__name(escargot, "escargot");
function papillonBlanc(x, y, f) {
  const o = [1, 0.35, 0.75][f % 3], h = [0, -1.2, -0.5][f % 3];
  return [-1, 1].map((s) => `<path d="M${f22(x)},${f22(y + h - 0.4)} Q${f22(x + s * 3.2 * o)},${f22(y + h - 3.4)} ${f22(x + s * 2.6 * o)},${f22(y + h + 0.2)} Q${f22(x + s * 1.2 * o)},${f22(y + h + 1.2)} ${f22(x)},${f22(y + h - 0.4)} Z" fill="#FFFFFF" stroke="${OUT2}" stroke-width="0.35"/><path d="M${f22(x + s * 2.3 * o)},${f22(y + h - 2.6)} Q${f22(x + s * 3.1 * o)},${f22(y + h - 2.9)} ${f22(x + s * 2.9 * o)},${f22(y + h - 1.4)} Z" fill="#3D3A36"/>`).join("") + ln2([x, y + h - 1.2], [x, y + h + 0.6], OUT2, 0.7);
}
__name(papillonBlanc, "papillonBlanc");
function coccinelle(x, y) {
  return `<circle cx="${f22(x)}" cy="${f22(y)}" r="1.2" fill="${ROUGE}" stroke="${OUT2}" stroke-width="0.35"/>` + ln2([x, y - 1.2], [x, y + 1.2], OUT2, 0.3) + dot(x - 0.5, y + 0.2, 0.25, OUT2) + dot(x + 0.5, y - 0.2, 0.25, OUT2) + dot(x + 1.1, y - 0.5, 0.45, OUT2);
}
__name(coccinelle, "coccinelle");
function abeille(x, y, f) {
  const dx = [0, 2.4, 1][f % 3], dy = [0, -1, 0.8][f % 3];
  return `<ellipse cx="${f22(x + dx)}" cy="${f22(y + dy)}" rx="1.4" ry="1" fill="#F2C04B" stroke="${OUT2}" stroke-width="0.35"/>` + ln2([x + dx - 0.2, y + dy - 0.9], [x + dx - 0.2, y + dy + 0.9], OUT2, 0.4) + ell2(x + dx - 0.2, y + dy - 1.4, 0.9, 0.6, "rgba(255,255,255,.85)", ` stroke="${OUT2}" stroke-width="0.3"`);
}
__name(abeille, "abeille");
function godets(u, v) {
  const [x, y] = P(u, v, 0);
  return [[-2.4, 0], [2.2, -0.4]].map(([dx, dy]) => `<polygon points="${f22(x + dx - 1.6)},${f22(y + dy - 2.6)} ${f22(x + dx + 1.6)},${f22(y + dy - 2.6)} ${f22(x + dx + 1.1)},${f22(y + dy)} ${f22(x + dx - 1.1)},${f22(y + dy)}" fill="#C8704A"${EDGE}/>` + trefle(x + dx, y + dy - 2.6, 1.5, "#4F8F3A")).join("");
}
__name(godets, "godets");
function panier(u, v, couleur) {
  const [x, y] = P(u, v, 0);
  return ell2(x, y - 2.4, 3.4, 1.2, "#7A5232", ` stroke="${OUT2}" stroke-width="0.4"`) + [[-1.4, -2.8], [0.6, -3], [1.8, -2.4], [-0.4, -2]].map(([a, b]) => fruit(x + a, y + b, 1, couleur, "#9A7040")).join("") + `<path d="M${f22(x - 3.4)},${f22(y - 2.4)} L${f22(x - 2.6)},${f22(y + 0.2)} Q${f22(x)},${f22(y + 1.2)} ${f22(x + 2.6)},${f22(y + 0.2)} L${f22(x + 3.4)},${f22(y - 2.4)} Q${f22(x)},${f22(y - 1.2)} ${f22(x - 3.4)},${f22(y - 2.4)} Z" fill="#B8864E"${EDGE}/>` + ln2([x - 3, y - 1.2], [x + 3, y - 1.2], "#8A5E32", 0.5) + chemin(`M${f22(x - 3)},${f22(y - 2.6)} Q${f22(x)},${f22(y - 8)} ${f22(x + 3)},${f22(y - 2.6)}`, "#8A5E32", 0.9);
}
__name(panier, "panier");
var POTAGER = {
  laitues: {
    dessin: "#8FCB6A",
    graine: /* @__PURE__ */ __name((x, y) => [-1.2, 0, 1.2].map((o, i) => dot(x + o, y - 0.3 + i % 2 * 0.3, 0.3, "#CDBB8E")).join(""), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => [-1, 0, 1].map((o, i) => feuille(x + o * 0.9 + s * 0.2, y - 1 - (i === 1 ? 0.5 : 0), 0.9, 0.6, LEAF_LIGHT, o * 30)).join(""), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [0, 72, 144, 216, 288].map((a) => feuille(x + Math.cos(a * Math.PI / 180) * 1.5 + s * 0.15, y - 1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.3, 0.9, LEAF_LIGHT, a)).join("") + feuille(x, y - 1.8, 1, 0.8, "#B8E07A"), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => [0, 60, 120, 180, 240, 300].map((a) => feuille(x + Math.cos(a * Math.PI / 180) * 2.2 + s * 0.15, y - 1.6 + Math.sin(a * Math.PI / 180) * 1.1, 1.8, 1.2, "#7CC25A", a)).join("") + [0, 90, 180, 270].map((a) => feuille(x + Math.cos(a * Math.PI / 180) * 0.9, y - 2.4 + Math.sin(a * Math.PI / 180) * 0.5, 1.2, 0.9, "#A9D86E", a)).join("") + feuille(x, y - 2.8, 0.9, 0.7, "#CFEA92"), "mur"),
    bete: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(0.08, 0.38, 0);
      return escargot(x, y, f);
    }, "bete")
  },
  choux: {
    dessin: "#7FA894",
    espace: true,
    graine: /* @__PURE__ */ __name((x, y) => dot(x - 0.6, y - 0.2, 0.4, "#3A2A22") + dot(x + 0.7, y - 0.1, 0.4, "#3A2A22"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige([x, y], [x + s * 0.2, y - 1.8], "#6E9C88", 0.6) + feuille(x - 1.1 + s * 0.2, y - 2.2, 1.2, 0.8, "#9CC4B0", -20, "#4E7A68") + feuille(x + 1.1 + s * 0.2, y - 2.3, 1.2, 0.8, "#8FB8A0", 20, "#4E7A68"), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [-130, -50, 30, 150].map((a) => feuille(x + Math.cos(a * Math.PI / 180) * 2.2 + s * 0.2, y - 1.8 + Math.sin(a * Math.PI / 180) * 1.2, 2, 1.3, "#7FA894", a, "#4E7A68")).join("") + feuille(x, y - 2.4, 1.3, 1.1, "#A8CDB8", 0, "#4E7A68"), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => [-150, -90, -30, 30, 90, 150].map((a) => feuille(x + Math.cos(a * Math.PI / 180) * 3 + s * 0.2, y - 1.6 + Math.sin(a * Math.PI / 180) * 1.4, 2.2, 1.4, "#6E9C88", a, "#4E7A68")).join("") + `<circle cx="${f22(x)}" cy="${f22(y - 3)}" r="2.6" fill="#B5D6B0" stroke="#4E7A68" stroke-width="0.4"/>` + chemin(`M${f22(x - 1.6)},${f22(y - 3.6)} q1.6,-1 3.2,0 M${f22(x)},${f22(y - 5.4)} l0,2.6`, "#7FA894", 0.4), "mur"),
    bete: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(0.05, 0.2, 9);
      return papillonBlanc(x, y, f);
    }, "bete")
  },
  tomates: {
    dessin: ROUGE,
    espace: true,
    graine: /* @__PURE__ */ __name((x, y) => ell2(x - 0.6, y - 0.2, 0.6, 0.4, "#F0E2BE", ' stroke="#B8A47A" stroke-width="0.3"') + ell2(x + 0.7, y - 0.1, 0.6, 0.4, "#F0E2BE", ' stroke="#B8A47A" stroke-width="0.3"'), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige([x, y], [x + s * 0.3, y - 3], "#6FA84A", 0.6) + feuille(x - 1 + s * 0.3, y - 2.6, 1, 0.55, "#6FA84A", -30) + feuille(x + 1 + s * 0.3, y - 3, 1, 0.55, LEAF, 30), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => piquetTuteur(x + 0.8, y, 11) + tige([x, y], [x + 0.6 + s * 0.2, y - 9], "#5E9A3E", 0.8) + [[-1.6, -3, -30], [1.8, -5, 30], [-1.6, -7, -30], [1.4, -8.6, 30]].map(([a, b, r]) => feuille(x + a + s * 0.3, y + b, 1.4, 0.7, LEAF, r)).join("") + [0, 72, 144, 216, 288].map((a) => ell2(x - 0.6 + Math.cos(a * Math.PI / 180) * 0.6 + s * 0.3, y - 5.8 + Math.sin(a * Math.PI / 180) * 0.4, 0.5, 0.35, "#F7C83A")).join("") + fruit(x + 1.2 + s * 0.3, y - 3.6, 0.9, "#8FC060", "#5E8A3A"), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => piquetTuteur(x + 0.8, y, 11) + tige([x, y], [x + 0.6 + s * 0.2, y - 9], "#5E9A3E", 0.8) + [[-1.6, -3, -30], [1.8, -5, 30], [-1.6, -7.4, -30], [1.6, -8.8, 30]].map(([a, b, r]) => feuille(x + a + s * 0.3, y + b, 1.4, 0.7, LEAF, r)).join("") + [[1.4, -3.4, 1.2], [-1, -4.8, 1.1], [0.4, -6.2, 1], [-1.2, -2.4, 0.9]].map(([a, b, r], i) => fruit(x + a + s * 0.3, y + b, r, i === 3 ? "#F08A3A" : ROUGE, "#A8302A")).join(""), "mur"),
    bete: /* @__PURE__ */ __name(() => {
      const [x, y] = P(0.155, 0, 0);
      return coccinelle(x - 1.6, y - 7.4);
    }, "bete")
  },
  haricots: {
    dessin: "#7EC45B",
    espace: true,
    graine: /* @__PURE__ */ __name((x, y) => ell2(x - 0.7, y - 0.3, 1.1, 0.6, "#F2EBDD", ' stroke="#A89A80" stroke-width="0.3"') + dot(x - 0.7, y - 0.3, 0.25, "#5A3A22") + ell2(x + 0.9, y - 0.1, 1.1, 0.6, "#C98A6A", ' stroke="#8A5A3A" stroke-width="0.3"'), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige([x, y], [x + s * 0.2, y - 2.6], "#7CBF4E", 0.8) + feuille(x - 1.1 + s * 0.2, y - 2.8, 1.3, 0.9, LEAF_LIGHT, -15) + feuille(x + 1.1 + s * 0.2, y - 2.9, 1.3, 0.9, LEAF, 15), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => piquetTuteur(x, y, 13) + chemin(`M${f22(x)},${f22(y)} q2,-2 0,-4 q-2,-2 0.2,-4 q2,-2 0.2,-3.4`, "#5E9A3E", 0.7) + [[-1.6, -2.4], [1.6, -5], [-1.4, -8], [1.4, -10.4]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1, i % 2 ? LEAF_LIGHT : LEAF, a * 15)).join("") + [[1.2, -7], [-1, -11]].map(([a, b]) => dot(x + a + s * 0.3, y + b, 0.7, ROUGE)).join(""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => piquetTuteur(x, y, 13) + chemin(`M${f22(x)},${f22(y)} q2,-2 0,-4 q-2,-2 0.2,-4 q2,-2 0.2,-3.4`, "#5E9A3E", 0.7) + [[-1.6, -2.4], [1.6, -5], [-1.4, -8], [1.4, -10.4]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1, i % 2 ? LEAF_LIGHT : LEAF, a * 15)).join("") + [[1, -3.4], [-1.2, -6.2], [1.2, -8.4]].map(([a, b]) => chemin(`M${f22(x + a + s * 0.3)},${f22(y + b)} q0.6,1.6 0,3.2`, "#3F7A2E", 1.5) + chemin(`M${f22(x + a + s * 0.3)},${f22(y + b)} q0.6,1.6 0,3.2`, "#9AD06A", 0.8)).join(""), "mur"),
    bete: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(0.31, -0.14, 12);
      return abeille(x, y, f);
    }, "bete")
  },
  fraises: {
    dessin: ROUGE,
    semoir: /* @__PURE__ */ __name((u, v) => godets(u, v), "semoir"),
    graine: /* @__PURE__ */ __name((x, y) => trefle(x, y, 1.2, "#4F8F3A"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s, k) => trefle(x, y, 1.7, "#4F8F3A", s) + (k % 3 === 0 ? dot(x + 1.6, y - 1.2, 0.6, "#FFFFFF") + dot(x + 1.6, y - 1.2, 0.25, "#F2C04B") : ""), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s, k) => paille(x, y) + trefle(x - 1.2, y, 1.8, "#4F8F3A", s) + trefle(x + 1.3, y - 0.2, 1.8, LEAF, s) + (k % 2 ? dot(x + 0.2, y - 2.6, 0.7, "#FFFFFF") + dot(x + 0.2, y - 2.6, 0.3, "#F2C04B") : fruit(x + 0.4, y - 0.6, 0.7, "#B8D88A", "#6F9A3E")), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s, k) => paille(x, y) + trefle(x - 1.2, y, 1.8, "#4F8F3A", s) + trefle(x + 1.3, y - 0.2, 1.8, LEAF, s) + [[0.4, -0.4], [-1.6, 0.2], ...k % 2 ? [[1.8, 0.4]] : []].map(([a, b]) => `<path d="M${f22(x + a - 0.9)},${f22(y + b - 0.6)} Q${f22(x + a)},${f22(y + b + 1.8)} ${f22(x + a + 0.9)},${f22(y + b - 0.6)} Z" fill="${ROUGE}" stroke="#A8302A" stroke-width="0.35"/>` + dot(x + a - 0.3, y + b, 0.15, "#F7E08A") + dot(x + a + 0.3, y + b + 0.3, 0.15, "#F7E08A") + ln2([x + a - 0.7, y + b - 0.7], [x + a + 0.7, y + b - 0.7], "#4F8F3A", 0.6)).join(""), "mur"),
    bete: /* @__PURE__ */ __name(() => "", "bete")
  },
  pommes_de_terre: {
    dessin: "#D9B27A",
    semoir: /* @__PURE__ */ __name((u, v) => panier(u, v, "#D9B27A"), "semoir"),
    graine: /* @__PURE__ */ __name((x, y, k) => k % 2 ? "" : fruit(x, y - 0.6, 1.1, "#D9B27A", "#9A7040") + ln2([x - 0.2, y - 1.6], [x - 0.6, y - 2.6], "#B07ACB", 0.6), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s, k) => k % 2 ? "" : butte(x, y) + trefle(x, y - 0.8, 1.4, "#4F8F3A", s), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s, k) => k % 2 ? "" : butte(x, y) + [[-1.6, -1.2], [1.4, -1.4], [0, -2.6]].map(([a, b]) => trefle(x + a, y + b, 1.6, a ? "#5E9A3E" : LEAF, s)).join("") + (k % 4 === 0 ? [0, 120, 240].map((a) => dot(x + 0.4 + Math.cos(a * Math.PI / 180) * 0.6, y - 4.6 + Math.sin(a * Math.PI / 180) * 0.4, 0.45, "#ECE2F4")).join("") + dot(x + 0.4, y - 4.6, 0.25, "#F2C04B") : ""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s, k) => k % 2 ? "" : butte(x, y) + [[-1.6, -1.2], [1.4, -1.4], [0, -2.6]].map(([a, b], i) => trefle(x + a, y + b, 1.6, i === 2 ? "#B9B24A" : "#9C9A3E", s)).join("") + fruit(x + 2.4, y + 0.6, 0.9, "#D9B27A", "#9A7040") + (k % 4 === 0 ? fruit(x - 2.6, y + 0.8, 0.8, "#D9B27A", "#9A7040") : ""), "mur"),
    bete: /* @__PURE__ */ __name(() => "", "bete")
  }
};
function plantDuPotager(culture, quoi, x, y, f, k) {
  const c = POTAGER[culture];
  if (c.espace && k % 2 && quoi !== "semis") return "";
  const s = wave(f, IMAGES, quoi === "pousses" ? 0.6 : 1.2, k * 0.9);
  return quoi === "semis" ? c.graine(x, y, k) : c[quoi === "pousses" ? "pousse" : quoi](x, y, s, k);
}
__name(plantDuPotager, "plantDuPotager");
function etape(culture, quoi, n) {
  if (!CULTURES.includes(culture)) throw new Error(`culture inconnue : ${culture}`);
  const f = n % IMAGES;
  if (!etapesDe(culture).includes(quoi)) throw new Error(`étape inconnue : ${quoi} (${etapesDe(culture).join(", ")})`);
  let out;
  if (quoi === "bechage") {
    out = carre(0.45, HERBE.fond) + bornage(f, false) + face([[-0.41, -0.41, 0], [0.41, -0.41, 0], [0.41, 0.06, 0], [-0.41, 0.06, 0]], TERRE2.dedans, ` stroke="${TERRE2.bord}" stroke-width="0.8"`);
    for (const [du, dv] of [[-0.3, -0.3], [-0.1, -0.33], [0.12, -0.28], [0.3, -0.32], [-0.22, -0.12], [0.02, -0.14], [0.24, -0.1], [-0.34, 0.02], [0.1, 0.02], [0.32, 0.03]]) {
      const [x, y] = P(du, dv, 0);
      out += ell2(x, y, 2.4, 1.2, TERRE2.motte, ` stroke="${OUT2}" stroke-width="0.4"`) + ell2(x - 0.5, y - 0.4, 1.1, 0.5, TERRE2.clair);
    }
    for (const [du, dv] of [[-0.25, 0.22], [0.05, 0.3], [0.28, 0.2], [-0.05, 0.16], [0.2, 0.36]]) {
      const [x, y] = P(du, dv, 0);
      out += touffe(x, y);
    }
    const [hx, hy] = P(-0.3, 0.3, 0);
    out += ell2(hx, hy - 1, 4.4, 2.2, "#7DAF4E", ` stroke="#4F7A2E" stroke-width="0.4"`) + touffe(hx - 1.6, hy - 1.6, 0.9) + touffe(hx + 1.4, hy - 1.8, 0.9) + ver(-0.16, -0.24, f) + beche(0.2, 0.08);
  } else {
    out = carre(0.45, TERRE2.bord) + carre(0.41, TERRE2.dedans, "") + bornage(f, false) + sillons();
    if (quoi === "sillons") out += rateau(-0.36, 0.42);
    else {
      const pot = POTAGER[culture];
      for (const p of plants()) {
        const [x, y] = P(p.du, p.dv, 0);
        out += pot ? plantDuPotager(culture, quoi, x, y, f, p.k) : quoi === "semis" ? graine(culture, x, y, p.k) : quoi === "pousses" ? pousse(culture, x, y, f, p.k) : croissance(culture, x, y, f, p.k);
      }
      if (quoi === "semis") out += moineau(-0.08, 0.36, f) + (pot && pot.semoir ? pot.semoir(0.36, 0.47) : sachet(0.36, 0.47, culture));
      if (quoi === "mur") out += pot.bete(f);
    }
  }
  return out + bornage(f, true);
}
__name(etape, "etape");

// atelier/verger.mjs
var import_troupe = __toESM(require_troupe2(), 1);
var import_arbres = __toESM(require_arbres(), 1);
var import_deco = __toESM(require_deco(), 1);
var { OUT: OUT3, E, r2 } = import_troupe.default;
var CADRE2 = import_deco.default.PROP;
var ARBRES = ["pommier", "poirier", "cerisier", "prunier", "abricotier"];
var ETAPES3 = ["trou", "plantation", "jeune", "floraison", "fruits_verts", "mur"];
var IMAGES2 = 3;
var BOIS2 = { left: "#9C6A43", right: "#74492C", clair: "#B98458" };
var TERRE3 = { trou: "#4E3020", bord: "#7A4E30", tas: "#8B5A34", clair: "#B07E54" };
var ln3 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "ln");
var tk2 = /* @__PURE__ */ __name((a, b, color, w) => ln3(a, b, OUT3, w + 1.6) + ln3(a, b, color, w), "tk");
var rond = /* @__PURE__ */ __name((x, y, r, fill, w = 0.8) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}" stroke="${OUT3}" stroke-width="${w}"/>`, "rond");
var wave2 = /* @__PURE__ */ __name((f, amp = 1, phase = 0) => Math.sin(f / IMAGES2 * Math.PI * 2 + phase) * amp, "wave");
var ESPECES = {
  pommier: { fleurs: ["#FFFFFF", "#F7B6C8"], fruit: "pomme", couleur: "#E2574C", ombre: "#B83A35" },
  poirier: { fleurs: ["#FFFFFF", "#FFFFFF"], fruit: "poire", couleur: "#D2D45A", ombre: "#9AA83A" },
  cerisier: { fleurs: ["#F7B6C8", "#FFFFFF"], fruit: "cerise", couleur: "#B8203A", ombre: "#7E1428" },
  prunier: { fleurs: ["#FFFFFF", "#F4ECF8"], fruit: "prune", couleur: "#7A4A9A", ombre: "#523070" },
  abricotier: { fleurs: ["#FFFFFF", "#F9D2DA"], fruit: "abricot", couleur: "#F2A03A", ombre: "#D0702E" }
};
var VERT = { couleur: "#9CCB5A", ombre: "#6F9A3E" };
function fruit2(sorte, x, y, s, c) {
  const reflet = /* @__PURE__ */ __name((dx, dy, r) => `<ellipse cx="${r2(x + dx * s)}" cy="${r2(y + dy * s)}" rx="${r2(r * s)}" ry="${r2(r * 1.25 * s)}" fill="#FFFFFF" opacity="0.8"/>`, "reflet");
  const queue = /* @__PURE__ */ __name((dy = -2) => `<path d="M${r2(x)},${r2(y + dy * s)} q${r2(0.2 * s)},${r2(-1.2 * s)} ${r2(0.9 * s)},${r2(-1.7 * s)}" stroke="${OUT3}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`, "queue");
  if (sorte === "cerise") {
    return `<path d="M${r2(x - 1.6 * s)},${r2(y)} Q${r2(x - 0.6 * s)},${r2(y - 3.6 * s)} ${r2(x + 0.4 * s)},${r2(y - 4.4 * s)} Q${r2(x + 0.6 * s)},${r2(y - 2.6 * s)} ${r2(x + 1.6 * s)},${r2(y + 0.4 * s)}" stroke="${OUT3}" stroke-width="0.7" fill="none" stroke-linecap="round"/>` + rond(x - 1.6 * s, y + 0.6 * s, 1.5 * s, c.couleur, 0.7) + rond(x + 1.6 * s, y + 1 * s, 1.5 * s, c.couleur, 0.7) + reflet(-2.1, 0.1, 0.4) + reflet(1.1, 0.5, 0.4);
  }
  if (sorte === "poire") {
    const d = `M${r2(x)},${r2(y - 2.8 * s)} Q${r2(x + 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.2 * s)},${r2(y - 0.6 * s)} Q${r2(x + 2.6 * s)},${r2(y + 0.6 * s)} ${r2(x + 2 * s)},${r2(y + 2 * s)} Q${r2(x)},${r2(y + 3.2 * s)} ${r2(x - 2 * s)},${r2(y + 2 * s)} Q${r2(x - 2.6 * s)},${r2(y + 0.6 * s)} ${r2(x - 1.2 * s)},${r2(y - 0.6 * s)} Q${r2(x - 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x)},${r2(y - 2.8 * s)} Z`;
    return `<path d="${d}" fill="${c.couleur}" stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"/>` + E(x + 0.9 * s, y + 1.4 * s, 1.1 * s, 0.9 * s, c.ombre, 0) + reflet(-0.8, 0.4, 0.4) + queue(-2.6);
  }
  const rx = sorte === "prune" ? 2.1 : 2.5, ry = sorte === "prune" ? 2.6 : 2.4;
  return `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rx * s)}" ry="${r2(ry * s)}" fill="${c.couleur}" stroke="${OUT3}" stroke-width="0.8"/>` + E(x + 0.8 * s, y + 0.9 * s, rx * 0.6 * s, ry * 0.55 * s, c.ombre, 0) + (sorte === "pomme" ? "" : `<path d="M${r2(x - 0.3 * s)},${r2(y - ry * s * 0.9)} Q${r2(x - 1 * s)},${r2(y)} ${r2(x - 0.2 * s)},${r2(y + ry * s * 0.85)}" stroke="${c.ombre}" stroke-width="0.6" fill="none"/>`) + reflet(-0.9, -0.5, sorte === "prune" ? 0.35 : 0.45) + queue(-ry + 0.3);
}
__name(fruit2, "fruit");
var FRUITS = [[-26, -49], [-15, -58], [-31, -57], [-7, -46], [3, -66], [13, -50], [23, -45], [27, -55], [-3, -76], [14, -73]];
var TOMBES = [[12, 5], [-17, 6]];
var FLEURS = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];
var ombre = /* @__PURE__ */ __name((rx = 27) => E(3, 1.5, rx, rx * 0.44, "rgba(40,55,20,0.22)", 0), "ombre");
var touffeHerbe = /* @__PURE__ */ __name((x, y) => import_arbres.default.herbe(x, y, "#86B852", 0.8), "touffeHerbe");
function beche2(x, y) {
  return `<polygon points="${r2(x - 2.4)},${r2(y - 5)} ${r2(x + 2.4)},${r2(y - 5.4)} ${r2(x + 2)},${r2(y + 0.6)} ${r2(x - 2)},${r2(y + 1)}" fill="#A9AFB8" stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"/>` + tk2([x + 0.1, y - 5.2], [x + 1.6, y - 20], BOIS2.left, 1.4) + tk2([x - 1, y - 20.2], [x + 4, y - 20.8], BOIS2.clair, 1.3);
}
__name(beche2, "beche");
function arrosoir(x, y, f) {
  const gouttes = [0, 1, 2].map((i) => {
    const t = (f + i) % IMAGES2 / IMAGES2;
    return E(x - 13 - t * 2, y - 9 + t * 8, 0.6, 0.9, "#7FC4EA", 0);
  }).join("");
  return `<path d="M${r2(x - 4)},${r2(y - 7)} L${r2(x + 4)},${r2(y - 7)} L${r2(x + 3.4)},${r2(y)} L${r2(x - 3.4)},${r2(y)} Z" fill="#6E9FC0" stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"/>` + tk2([x - 3.6, y - 4], [x - 11, y - 10], "#6E9FC0", 1.1) + E(x - 11.6, y - 10.4, 1.4, 0.9, "#5A88A8", 0.6) + `<path d="M${r2(x - 2)},${r2(y - 7)} Q${r2(x)},${r2(y - 12)} ${r2(x + 2.6)},${r2(y - 7)}" stroke="${OUT3}" stroke-width="1.6" fill="none"/><path d="M${r2(x - 2)},${r2(y - 7)} Q${r2(x)},${r2(y - 12)} ${r2(x + 2.6)},${r2(y - 7)}" stroke="#6E9FC0" stroke-width="0.7" fill="none"/>` + gouttes;
}
__name(arrosoir, "arrosoir");
function abeille2(x, y, f) {
  const dx = [0, 4, 1.6][f], dy = [0, -2, 1.4][f];
  return E(x + dx - 0.6, y + dy - 2, 1.4, 0.9, "rgba(255,255,255,0.85)", 0.5) + E(x + dx + 0.8, y + dy - 2.2, 1.2, 0.8, "rgba(255,255,255,0.85)", 0.5) + E(x + dx, y + dy, 2, 1.4, "#F2C04B", 0.6) + ln3([x + dx - 0.4, y + dy - 1.3], [x + dx - 0.4, y + dy + 1.3], OUT3, 0.6) + ln3([x + dx + 0.8, y + dy - 1.2], [x + dx + 0.8, y + dy + 1.2], OUT3, 0.6);
}
__name(abeille2, "abeille");
var petale = /* @__PURE__ */ __name((x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT3}" stroke-width="0.5" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`, "petale");
var tuteur = /* @__PURE__ */ __name((h, x = 4) => tk2([x, 4], [x + 0.6, -h], BOIS2.clair, 1.2), "tuteur");
var lien = /* @__PURE__ */ __name((y, x0, x1) => tk2([x0, y], [x1, y - 0.4], "#E8D8A8", 0.8), "lien");
function jeune(id, s = 1) {
  const c = import_arbres.default.VERTS.doux.devant;
  const tige3 = `<path d="M-1.2,2 Q-1,-14 -0.4,-${r2(30 * s)} L1.2,-${r2(30 * s)} Q1.4,-14 1.6,2 Z" fill="${BOIS2.left}" stroke="${OUT3}" stroke-width="1" stroke-linejoin="round"/>`;
  return tige3 + import_arbres.default.feuillage(id, [[-6, -32, 6.5], [6, -34, 7], [0, -42, 6.5]].map(([x, y, r]) => [x * s, y * s, r * s]), c, [[-4, -30], [4, -36, 0.8]], 1);
}
__name(jeune, "jeune");
function etape2(arbre, quoi, n) {
  const e = ESPECES[arbre];
  if (!e) throw new Error(`arbre inconnu : ${arbre} (${ARBRES.join(", ")})`);
  if (!ETAPES3.includes(quoi)) throw new Error(`étape inconnue : ${quoi} (${ETAPES3.join(", ")})`);
  const f = n % IMAGES2, id = `vg${arbre.slice(0, 3)}${quoi.slice(0, 3)}${f}`;
  if (quoi === "trou") {
    const r = wave2(f, 1.2);
    return ombre(20) + touffeHerbe(-16, 4) + touffeHerbe(15, 6) + E(0, 2, 11, 5, TERRE3.bord, 0.9) + E(0, 2.6, 8.4, 3.6, TERRE3.trou, 0) + E(-15, -0.6, 8, 4.4, TERRE3.tas, 0.9) + E(-16, -2.2, 4.6, 2.2, TERRE3.clair, 0) + E(-11 + r, 0.6, 1.6, 1, TERRE3.tas, 0.6) + beche2(10, 1.6);
  }
  if (quoi === "plantation") {
    const s2 = wave2(f, 0.6);
    return ombre(14) + touffeHerbe(-17, 4) + E(0, 2, 10, 4.4, TERRE3.bord, 0.9) + E(0, 2.2, 7.6, 3.2, TERRE3.tas, 0) + E(-2, 1.4, 3, 1, "rgba(90,140,180,0.45)", 0) + tuteur(26) + `<path d="M-0.6,2 Q-0.4,-10 ${r2(s2 * 0.4)},-22" stroke="${OUT3}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-0.6,2 Q-0.4,-10 ${r2(s2 * 0.4)},-22" stroke="${BOIS2.left}" stroke-width="1.2" fill="none" stroke-linecap="round"/>` + [[-3, -16, -30], [3, -19, 30], [-2, -22, -20], [2.4, -24, 25]].map(([x, y, a], i) => `<ellipse cx="${r2(x + s2 * 0.4)}" cy="${y}" rx="2" ry="1.1" fill="${i % 2 ? "#A5D466" : "#68A64B"}" stroke="${OUT3}" stroke-width="0.6" transform="rotate(${a} ${r2(x + s2 * 0.4)} ${y})"/>`).join("") + lien(-12, -0.4, 4.4) + arrosoir(23, 3, f);
  }
  if (quoi === "jeune") return ombre(16) + tuteur(34) + jeune(id) + lien(-20, 0, 4.6) + touffeHerbe(-14, 4) + import_arbres.default.fleurette(12, 4, "#FFFFFF");
  if (quoi === "floraison") {
    const k = 0.76;
    const chute = [[-20, -30], [8, -20], [22, -36], [-8, -12]].map(([x, y], i) => petale(x * k + wave2(f, 2, i), y + (f * 6 + i * 9) % 18, (f * 50 + i * 70) % 360, e.fleurs[i % 2])).join("");
    return import_arbres.default.arbre({ vert: "tendre", petit: true }) + FLEURS.map(([x, y], i) => import_arbres.default.fleurette(x * k, y * k, i % 3 ? e.fleurs[0] : e.fleurs[1])).join("") + chute + abeille2(14, -52, f);
  }
  if (quoi === "fruits_verts") {
    const k = 0.76, s2 = 0.85 * Math.max(k, 0.85);
    return import_arbres.default.arbre({ vert: "doux", petit: true }) + FRUITS.map(([x, y]) => fruit2(e.fruit, x * k, y * k + wave2(f, 0.3, x), s2, VERT)).join("");
  }
  const s = 1.12;
  return import_arbres.default.arbre({ vert: "doux" }) + FRUITS.map(([x, y]) => fruit2(e.fruit, x, y + wave2(f, 0.4, x), s, e)).join("") + TOMBES.map(([x, y]) => fruit2(e.fruit, x, y, 1.05, e)).join("") + abeille2(-12, 0, f);
}
__name(etape2, "etape");

// atelier/lunaire.mjs
var OUT4 = "#3C2819";
var f23 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var ln4 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f23(a[0])}" y1="${f23(a[1])}" x2="${f23(b[0])}" y2="${f23(b[1])}" stroke="${color}" stroke-width="${f23(w)}" stroke-linecap="round"/>`, "ln");
var ell3 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f23(x)}" cy="${f23(y)}" rx="${f23(rx)}" ry="${f23(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot2 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f23(x)}" cy="${f23(y)}" r="${f23(r)}" fill="${fill}"/>`, "dot");
var chemin2 = /* @__PURE__ */ __name((d, stroke, w, fill = "none") => `<path d="${d}" stroke="${stroke}" stroke-width="${f23(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`, "chemin");
var wave3 = /* @__PURE__ */ __name((f, amp = 1, phase = 0) => Math.sin(f / IMAGES3 * Math.PI * 2 + phase) * amp, "wave");
var bord = /* @__PURE__ */ __name((w = 0.35) => ` stroke="${OUT4}" stroke-width="${w}"`, "bord");
var CADRE3 = [-34, -30, 68, 48];
var PLANTES = ["melisse", "lunaire", "fleur_de_lune", "herbe_des_anciens"];
var ETAPES4 = ["nouvelle_lune", "croissant", "quartier", "gibbeuse", "pleine_lune"];
var IMAGES3 = 3;
var R = 0.4;
var anneau = /* @__PURE__ */ __name((r) => Array.from({ length: 24 }, (_, i) => {
  const a = i / 24 * Math.PI * 2;
  return P(Math.cos(a) * r, Math.sin(a) * r, 0);
}), "anneau");
var pts3 = /* @__PURE__ */ __name((list) => list.map(([x, y]) => `${f23(x)},${f23(y)}`).join(" "), "pts");
var PIERRES = Array.from({ length: 16 }, (_, i) => i / 16 * Math.PI * 2);
var pierre = /* @__PURE__ */ __name((a) => {
  const [x, y] = P(Math.cos(a) * (R + 0.04), Math.sin(a) * (R + 0.04), 0);
  return ell3(x, y - 0.6, 2.4, 1.4, "#DAD5C8", bord(0.45)) + ell3(x - 0.6, y - 1.1, 1.1, 0.5, "#F2EFE6");
}, "pierre");
var pierres2 = /* @__PURE__ */ __name((devant) => PIERRES.filter((a) => Math.cos(a) + Math.sin(a) > 0 === devant).map(pierre).join(""), "pierres");
function carre2() {
  return `<polygon points="${pts3(anneau(R + 0.06))}" fill="#8FC060"${EDGE}/><polygon points="${pts3(anneau(R))}" fill="#5E3E2E" stroke="#4A2F22" stroke-width="0.6"/><polygon points="${pts3(anneau(R * 0.7))}" fill="#6A4634"/>` + pierres2(false);
}
__name(carre2, "carre");
function pierreDeLune(phase, f) {
  const [x, y] = P(0.44, -0.46, 0);
  let out = `<path d="M${f23(x - 3.4)},${f23(y)} L${f23(x - 3)},${f23(y - 9)} Q${f23(x)},${f23(y - 12)} ${f23(x + 3)},${f23(y - 9)} L${f23(x + 3.4)},${f23(y)} Z" fill="#B9B4AC"${EDGE}/><path d="M${f23(x + 1.2)},${f23(y)} L${f23(x + 1.4)},${f23(y - 10.6)} Q${f23(x + 2.6)},${f23(y - 10)} ${f23(x + 3)},${f23(y - 9)} L${f23(x + 3.4)},${f23(y)} Z" fill="#9A958C"/>`;
  const cx = x, cy = y - 6.4, r = 2.1;
  out += dot2(cx, cy, r + 0.3, "#5A5650") + dot2(cx, cy, r, "#3E3A44");
  if (phase > 0) {
    const k = [0, 0.55, 0, -0.55, -1][phase];
    out += `<path d="M${f23(cx)},${f23(cy - r)} A${r},${r} 0 0,1 ${f23(cx)},${f23(cy + r)} A${f23(Math.abs(k) * r)},${r} 0 0,${k > 0 ? 0 : 1} ${f23(cx)},${f23(cy - r)} Z" fill="#F4F0D8"/>`;
    if (phase === 4) out += dot2(cx, cy, r + 1.6 + wave3(f, 0.4), "rgba(244,240,200,.25)");
  }
  return out;
}
__name(pierreDeLune, "pierreDeLune");
var PLACES = [[0, 0], ...[0, 1, 2, 3, 4, 5].map((i) => {
  const a = i / 6 * Math.PI * 2 + 0.3;
  return [Math.cos(a) * 0.22, Math.sin(a) * 0.22];
})].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
var VERT2 = { fonce: "#3F7A2E", moyen: "#5FA04A", clair: "#8FCB6A", tendre: "#B8E07A" };
var feuille2 = /* @__PURE__ */ __name((x, y, rx, ry, fill, rot = 0) => `<ellipse cx="${f23(x)}" cy="${f23(y)}" rx="${f23(rx)}" ry="${f23(ry)}" fill="${fill}"${bord()}${rot ? ` transform="rotate(${f23(rot)} ${f23(x)} ${f23(y)})"` : ""}/>`, "feuille");
var lueur = /* @__PURE__ */ __name((x, y, r, col, a) => dot2(x, y, r, `rgba(${col},${f23(a)})`), "lueur");
var etoile = /* @__PURE__ */ __name((x, y, r, o = 1) => `<path d="M${f23(x)},${f23(y - r)} Q${f23(x)},${f23(y)} ${f23(x + r)},${f23(y)} Q${f23(x)},${f23(y)} ${f23(x)},${f23(y + r)} Q${f23(x)},${f23(y)} ${f23(x - r)},${f23(y)} Q${f23(x)},${f23(y)} ${f23(x)},${f23(y - r)} Z" fill="#FFFBE0" opacity="${f23(o)}"/>`, "etoile");
var tige2 = /* @__PURE__ */ __name((x, y, h, s, col = VERT2.moyen) => ln4([x, y], [x + s * 0.3, y - h], col, 0.7), "tige");
var DESSINS = {
  // la mélisse : un buisson de feuilles ovales dentelées, de petites fleurs blanches ; des reflets d'argent sous la lune
  melisse: {
    graine: /* @__PURE__ */ __name((x, y) => dot2(x - 0.5, y - 0.2, 0.35, "#2E2018") + dot2(x + 0.6, y - 0.1, 0.35, "#2E2018"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige2(x, y, 1.6, s) + feuille2(x - 0.9 + s * 0.3, y - 1.8, 0.9, 0.7, VERT2.clair) + feuille2(x + 0.9 + s * 0.3, y - 1.9, 0.9, 0.7, VERT2.tendre), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [[-1.6, -1.6, -30], [1.6, -1.8, 30], [-0.9, -3.2, -20], [1, -3.4, 20], [0, -4.4, 0]].map(([a, b, r], i) => feuille2(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? VERT2.clair : VERT2.moyen, r)).join(""), "croissance"),
    bouton: /* @__PURE__ */ __name((x, y, s) => DESSINS.melisse.croissance(x, y, s) + [[-1, -4.6], [1.2, -5], [0.1, -5.8]].map(([a, b]) => dot2(x + a + s * 0.3, y + b, 0.45, "#E8F2D8")).join(""), "bouton"),
    fleur: /* @__PURE__ */ __name((x, y, s, f, k) => DESSINS.melisse.croissance(x, y, s) + [[-1, -4.6], [1.2, -5], [0.1, -5.8], [-1.8, -3.2]].map(([a, b]) => dot2(x + a + s * 0.3, y + b, 0.65, "#FFFFFF") + dot2(x + a + s * 0.3, y + b, 0.25, "#F2D88A")).join("") + etoile(x + 1.8, y - 3.4 - k % 2, 0.9, [1, 0.3, 0.6][(f + k) % 3]), "fleur")
  },
  // la lunaire : des feuilles en cœur, des fleurs mauves ; à la pleine lune, ses disques d'argent translucides
  lunaire: {
    graine: /* @__PURE__ */ __name((x, y) => ell3(x - 0.6, y - 0.2, 0.8, 0.5, "#7A5A3A", bord(0.3)) + ell3(x + 0.8, y - 0.1, 0.8, 0.5, "#7A5A3A", bord(0.3)), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige2(x, y, 2, s) + feuille2(x - 1 + s * 0.3, y - 2.2, 1.1, 0.9, VERT2.moyen, -20) + feuille2(x + 1 + s * 0.3, y - 2.3, 1.1, 0.9, VERT2.clair, 20), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => tige2(x, y, 6, s) + [[-1.4, -2, -25], [1.4, -3, 25], [-1.2, -4.6, -20], [1.2, -5.6, 20]].map(([a, b, r], i) => feuille2(x + a + s * 0.3, y + b, 1.3, 1.1, i % 2 ? VERT2.clair : VERT2.moyen, r)).join(""), "croissance"),
    bouton: /* @__PURE__ */ __name((x, y, s) => DESSINS.lunaire.croissance(x, y, s) + [[0, -7], [-0.8, -6.4], [0.9, -6.6]].map(([a, b]) => dot2(x + a + s * 0.3, y + b, 0.6, "#B98AD8")).join(""), "bouton"),
    fleur: /* @__PURE__ */ __name((x, y, s, f, k) => DESSINS.lunaire.croissance(x, y, s) + [[0, -7.4], [-1.4, -6.2], [1.5, -6.6]].map(([a, b], i) => lueur(x + a + s * 0.3, y + b, 2.1 + wave3(f, 0.3, k + i), "235,238,255", 0.25) + `<ellipse cx="${f23(x + a + s * 0.3)}" cy="${f23(y + b)}" rx="1.5" ry="1.5" fill="rgba(240,242,255,.78)" stroke="#9AA0B8" stroke-width="0.4"/>` + dot2(x + a + s * 0.3 - 0.4, y + b - 0.3, 0.3, "#C8CCE0")).join(""), "fleur")
  },
  // la fleur de lune : une liane qui grimpe à son petit arceau, des boutons en spirale ; elle s'ouvre, grande et blanche, la nuit
  fleur_de_lune: {
    graine: /* @__PURE__ */ __name((x, y) => dot2(x, y - 0.4, 0.8, "#3A2A22"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => tige2(x, y, 2, s, "#6FA84A") + feuille2(x - 1.1 + s * 0.3, y - 2.2, 1.2, 0.7, VERT2.clair, -35) + feuille2(x + 1.1 + s * 0.3, y - 2.3, 1.2, 0.7, VERT2.moyen, 35), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => chemin2(`M${f23(x - 2)},${f23(y)} Q${f23(x - 2.4)},${f23(y - 8)} ${f23(x)},${f23(y - 8.4)} Q${f23(x + 2.4)},${f23(y - 8)} ${f23(x + 2)},${f23(y)}`, "#A9794A", 0.9) + chemin2(`M${f23(x)},${f23(y)} q-2,-2 -1.6,-4 q0.6,-2.6 2.2,-3.6`, "#5E9A3E", 0.6) + [[-1.6, -2.6], [-1.2, -5], [1, -7.2]].map(([a, b], i) => feuille2(x + a + s * 0.3, y + b, 1.3, 1.1, i % 2 ? VERT2.clair : VERT2.moyen, a * 12)).join(""), "croissance"),
    bouton: /* @__PURE__ */ __name((x, y, s) => DESSINS.fleur_de_lune.croissance(x, y, s) + [[1.6, -5.4], [-2, -7.4]].map(([a, b]) => chemin2(`M${f23(x + a + s * 0.3)},${f23(y + b + 1.6)} q0.8,-1 0,-2.2 q-0.6,-0.6 0.2,-1`, "#F4F0E0", 1.4)).join(""), "bouton"),
    fleur: /* @__PURE__ */ __name((x, y, s, f, k) => DESSINS.fleur_de_lune.croissance(x, y, s) + [[1.8, -5.6], [-2, -7.6]].map(([a, b], i) => {
      const cx = x + a + s * 0.3, cy = y + b, o = 1.7 + wave3(f, 0.15, k + i);
      return lueur(cx, cy, o + 1.4, "255,252,230", 0.3) + dot2(cx, cy, o, "#FFFFFF") + `<circle cx="${f23(cx)}" cy="${f23(cy)}" r="${f23(o)}" fill="none" stroke="#C8C4B0" stroke-width="0.4"/>` + [0, 72, 144, 216, 288].map((t) => ln4([cx, cy], [cx + Math.cos(t * Math.PI / 180) * o * 0.8, cy + Math.sin(t * Math.PI / 180) * o * 0.8], "#E8E2C8", 0.3)).join("") + dot2(cx, cy, 0.45, "#F2E8A0");
    }).join(""), "fleur")
  },
  // l'herbe des Anciens : la graine étrange de cette île ; des crosses qui se déroulent, des runes qui luisent, des
  // clochettes bleues lumineuses à la pleine lune
  herbe_des_anciens: {
    graine: /* @__PURE__ */ __name((x, y, f, k) => lueur(x, y - 0.4, 1.4, "120,200,255", [0.2, 0.4, 0.3][(f + k) % 3]) + dot2(x, y - 0.4, 0.6, "#7FD0F0"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => chemin2(`M${f23(x)},${f23(y)} q${f23(s * 0.3)},-2 0.6,-2.6 a0.8,0.8 0 1,0 -0.8,-0.6`, "#4FA8A0", 0.8), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [-1.2, 0, 1.2].map((o, i) => chemin2(`M${f23(x + o * 0.4)},${f23(y)} q${f23(o + s * 0.3)},-3 ${f23(o * 0.8)},-${f23(4.6 + (i === 1 ? 1 : 0))} a0.9,0.9 0 1,0 -0.9,-0.6`, i === 1 ? "#5CB8B0" : "#3E8E86", 0.9)).join("") + ln4([x - 0.3, y - 1.6], [x + 0.3, y - 2.4], "#9FE8F4", 0.4), "croissance"),
    bouton: /* @__PURE__ */ __name((x, y, s) => DESSINS.herbe_des_anciens.croissance(x, y, s) + [[-1.4, -5], [1.4, -5.2]].map(([a, b]) => ell3(x + a + s * 0.3, y + b, 0.7, 0.9, "#5A88C8", bord(0.3))).join(""), "bouton"),
    fleur: /* @__PURE__ */ __name((x, y, s, f, k) => DESSINS.herbe_des_anciens.croissance(x, y, s) + [[-1.4, -5], [1.4, -5.2], [0, -6.6]].map(([a, b], i) => {
      const cx = x + a + s * 0.3, cy = y + b;
      return lueur(cx, cy + 0.4, 2 + wave3(f, 0.3, k + i), "120,200,255", 0.3) + `<path d="M${f23(cx - 1.1)},${f23(cy + 0.8)} Q${f23(cx - 1)},${f23(cy - 1.2)} ${f23(cx)},${f23(cy - 1.2)} Q${f23(cx + 1)},${f23(cy - 1.2)} ${f23(cx + 1.1)},${f23(cy + 0.8)} Z" fill="#8FD8F4"${bord(0.35)}/>` + dot2(cx, cy + 0.9, 0.3, "#E8FAFF");
    }).join("") + dot2(x + wave3(f, 2, k), y - 8 - (f + k) % 3, 0.35, "#CFF4FF"), "fleur")
  }
};
function lunette(f) {
  const [x0, y0] = P(-0.18, 0.1, 13), x = x0 + [0, 3, 1.5][f], y = y0 + [0, -1.6, 0.8][f], o = [1, 0.45, 0.75][f];
  return lueur(x, y, 4, "210,240,200", 0.18) + [-1, 1].map((s) => `<path d="M${f23(x)},${f23(y)} Q${f23(x + s * 3.6 * o)},${f23(y - 3)} ${f23(x + s * 3 * o)},${f23(y + 0.4)} Q${f23(x + s * 2 * o)},${f23(y + 2.4)} ${f23(x + s * 1.2 * o)},${f23(y + 4.2)} Q${f23(x + s * 0.6)},${f23(y + 1.6)} ${f23(x)},${f23(y)} Z" fill="#CFEAB8"${bord(0.4)}/>` + dot2(x + s * 2.2 * o, y - 0.6, 0.45, "#E8C86A")).join("") + ln4([x, y - 1], [x, y + 1.6], OUT4, 0.8) + chemin2(`M${f23(x - 0.3)},${f23(y - 1)} q-0.8,-1.2 -1.4,-1.4 M${f23(x + 0.3)},${f23(y - 1)} q0.8,-1.2 1.4,-1.4`, OUT4, 0.35);
}
__name(lunette, "lunette");
function etape3(plante, quoi, n) {
  const d = DESSINS[plante];
  if (!d) throw new Error(`plante inconnue : ${plante} (${PLANTES.join(", ")})`);
  const phase = ETAPES4.indexOf(quoi);
  if (phase < 0) throw new Error(`étape inconnue : ${quoi} (${ETAPES4.join(", ")})`);
  const f = n % IMAGES3;
  let out = carre2() + pierreDeLune(phase, f);
  PLACES.forEach(([du, dv], k) => {
    const [x, y] = P(du, dv, 0), s = wave3(f, phase < 2 ? 0.6 : 1, k * 0.9);
    out += [() => d.graine(x, y, f, k), () => d.pousse(x, y, s), () => d.croissance(x, y, s), () => d.bouton(x, y, s), () => d.fleur(x, y, s, f, k)][phase]();
  });
  out += pierres2(true);
  if (phase === 3) out += [[-0.3, 0.3], [0.32, 0.12], [0, -0.3]].map(([du, dv], i) => {
    const [x, y] = P(du, dv, 0);
    return etoile(x, y - 3, 0.7, [0.9, 0.3, 0.6][(f + i) % 3]);
  }).join("");
  if (phase === 4) out += lunette(f);
  return out;
}
__name(etape3, "etape");

// atelier/cultures_climat.mjs
var OUT5 = "#3C2819";
var f24 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var ln5 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f24(a[0])}" y1="${f24(a[1])}" x2="${f24(b[0])}" y2="${f24(b[1])}" stroke="${color}" stroke-width="${f24(w)}" stroke-linecap="round"/>`, "ln");
var ell4 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f24(x)}" cy="${f24(y)}" rx="${f24(rx)}" ry="${f24(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot3 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f24(x)}" cy="${f24(y)}" r="${f24(r)}" fill="${fill}"/>`, "dot");
var chemin3 = /* @__PURE__ */ __name((d, stroke, w, fill = "none") => `<path d="${d}" stroke="${stroke}" stroke-width="${f24(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`, "chemin");
var bord2 = /* @__PURE__ */ __name((w = 0.35) => ` stroke="${OUT5}" stroke-width="${w}"`, "bord");
var wave4 = /* @__PURE__ */ __name((f, amp = 1, phase = 0) => Math.sin(f / IMAGES4 * Math.PI * 2 + phase) * amp, "wave");
var feuille3 = /* @__PURE__ */ __name((x, y, rx, ry, fill, rot = 0) => `<ellipse cx="${f24(x)}" cy="${f24(y)}" rx="${f24(rx)}" ry="${f24(ry)}" fill="${fill}"${bord2()}${rot ? ` transform="rotate(${f24(rot)} ${f24(x)} ${f24(y)})"` : ""}/>`, "feuille");
var fruit3 = /* @__PURE__ */ __name((x, y, r, fill, edge) => `<circle cx="${f24(x)}" cy="${f24(y)}" r="${f24(r)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"/>` + dot3(x - r * 0.35, y - r * 0.35, r * 0.3, "rgba(255,255,255,.55)"), "fruit");
var CADRE4 = [-34, -30, 68, 48];
var CLIMATS = ["cimes", "landes", "marais", "dunes", "jungle", "volcan"];
var CULTURE = { cimes: "myrtilles", landes: "sarrasin", marais: "riz", dunes: "pasteques", jungle: "ananas", volcan: "piments" };
var ETAPES5 = ["preparation", "plantation", "pousses", "croissance", "mur"];
var IMAGES4 = 3;
var carre3 = /* @__PURE__ */ __name((r, fill, extra = EDGE) => face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra), "carre");
var COLS2 = [-0.28, -0.093, 0.093, 0.28];
var ROWS2 = [-0.28, -0.093, 0.093, 0.28];
var places = /* @__PURE__ */ __name(() => ROWS2.flatMap((dv, r) => COLS2.map((du, c) => ({ du, dv, k: r * 4 + c }))).sort((a, b) => a.du + a.dv - (b.du + b.dv)), "places");
var caillou = /* @__PURE__ */ __name((x, y, s, fill = "#A8A49A") => ell4(x, y, 1.6 * s, 1 * s, fill, bord2(0.4)) + ell4(x - 0.4 * s, y - 0.4 * s, 0.7 * s, 0.35 * s, "rgba(255,255,255,.35)"), "caillou");
var SOLS = {
  // la terrasse des cimes : un muret de pierres sèches devant, une terre caillouteuse
  cimes: {
    sol: /* @__PURE__ */ __name(() => carre3(0.45, "#9AA48A") + carre3(0.41, "#7E6A56", "") + [[-0.3, -0.2], [0.1, -0.32], [0.28, 0.05], [-0.12, 0.22], [0.2, 0.3]].map(([u, v]) => {
      const [x, y] = P(u, v, 0);
      return caillou(x, y, 0.5);
    }).join(""), "sol"),
    devant: /* @__PURE__ */ __name(() => [-0.38, -0.25, -0.12, 0.01, 0.14, 0.27, 0.4].map((u, i) => {
      const [x, y] = P(u, 0.45, 0);
      return caillou(x, y + i % 2 * 0.6, 1.2, i % 2 ? "#B4B0A6" : "#9C988E");
    }).join("") + [0.38, 0.25, 0.12, -0.01, -0.14, -0.27].map((v, i) => {
      const [x, y] = P(0.45, v, 0);
      return caillou(x, y + i % 2 * 0.6, 1.1, i % 2 ? "#9C988E" : "#B4B0A6");
    }).join(""), "devant"),
    preparer: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(-0.1, 0.1, 0);
      return caillou(x, y, 1.4) + caillou(x + 4, y - 1, 1.1) + ln5([x + 7, y + 1], [x + 9 + wave4(f, 0.3), y - 9], WOOD.left, 1.3) + ln5([x + 5.6, y - 9.6], [x + 10.6, y - 8.2], "#8A8F98", 1.6);
    }, "preparer")
  },
  // la lande : une tourbe sombre, des touffes de bruyère mauve au bord
  landes: {
    sol: /* @__PURE__ */ __name(() => carre3(0.45, "#8C9A6A") + carre3(0.41, "#4E3A2E", ""), "sol"),
    devant: /* @__PURE__ */ __name((f) => [[-0.42, 0.38], [0.4, 0.42], [0.42, -0.36], [-0.1, 0.44], [0.44, 0.05]].map(([u, v], i) => {
      const [x, y] = P(u, v, 0);
      return [-1.4, 0, 1.4].map((o) => ln5([x + o * 0.4, y], [x + o + wave4(f, 0.4, i), y - 3.4], "#6E8A4A", 0.8) + dot3(x + o + wave4(f, 0.4, i), y - 3.4, 0.7, "#B87AB8")).join("");
    }).join(""), "devant"),
    preparer: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(-0.2, 0.1, 0);
      return ell4(x, y - 1, 4.6, 2.2, "#6E7A4A", bord2(0.4)) + [-2, 0, 2].map((o) => dot3(x + o, y - 2.6, 0.8, "#B87AB8")).join("") + ln5([x + 8, y + 1], [x + 10, y - 8 + wave4(f, 0.3)], WOOD.left, 1.3) + ln5([x + 8.2, y - 7.6], [x + 12, y - 9], "#8A8F98", 1.4);
    }, "preparer")
  },
  // la rizière : une diguette de terre, l'eau qui miroite entre les plants
  marais: {
    sol: /* @__PURE__ */ __name((f) => carre3(0.45, "#7A9A5A") + carre3(0.42, "#8A6A46", "") + carre3(0.37, "#6FA8B8", ` stroke="#4E7E8E" stroke-width="0.6"`) + [[-0.2, -0.1], [0.15, 0.2], [0.1, -0.25]].map(([u, v], i) => {
      const [x, y] = P(u, v, 0);
      return ln5([x - 2 + wave4(f, 0.6, i), y], [x + 2 + wave4(f, 0.6, i), y], "rgba(255,255,255,.55)", 0.6);
    }).join(""), "sol"),
    devant: /* @__PURE__ */ __name(() => "", "devant"),
    preparer: /* @__PURE__ */ __name(() => {
      const [x, y] = P(0.3, 0.38, 0);
      return ell4(x, y - 1.6, 3, 1.6, "#C8B88A", bord2(0.4)) + ln5([x - 1, y - 3], [x + 1.2, y - 3.6], "#8A7A4A", 0.5);
    }, "preparer")
    // le sac de semence au bord de la diguette
  },
  // les dunes : le sable, la ganivelle (des lattes de châtaignier liées de fil de fer) contre le vent
  dunes: {
    sol: /* @__PURE__ */ __name((f) => carre3(0.45, "#E8D49A") + carre3(0.41, "#DCC488", "") + [[-0.2, -0.1], [0.2, 0.15]].map(([u, v], i) => {
      const [x, y] = P(u, v, 0);
      return chemin3(`M${f24(x - 4)},${f24(y)} q2,-1 4,0 q2,1 4,0`, "rgba(180,150,90,.6)", 0.5);
    }).join(""), "sol"),
    devant: /* @__PURE__ */ __name(() => {
      let out = "";
      for (let i = 0; i < 9; i++) {
        const u = -0.44 + i * 0.11, [x, y] = P(u, 0.46, 0);
        out += ln5([x, y], [x + 0.2, y - 6.4], OUT5, 1.6) + ln5([x, y], [x + 0.2, y - 6.4], "#B8946A", 0.8);
      }
      return out + ln5(P(-0.44, 0.46, 2), P(0.44, 0.46, 2), "#6E737C", 0.4) + ln5(P(-0.44, 0.46, 5), P(0.44, 0.46, 5), "#6E737C", 0.4);
    }, "devant"),
    preparer: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(0, -0.1, 0);
      return [0, 1, 2].map((i) => ln5([x - 6 + i * 3, y], [x - 6 + i * 3 + 0.2, y - 6], "#B8946A", 0.9)).join("") + ln5([x - 7, y - 3], [x + 1, y - 3.4], "#6E737C", 0.4) + dot3(x + 6 + wave4(f, 1), y - 1, 0.5, "rgba(220,196,136,.9)");
    }, "preparer")
  },
  // la jungle : une terre rouge, de grandes feuilles qui débordent sur le bord
  jungle: {
    sol: /* @__PURE__ */ __name(() => carre3(0.45, "#5E9A4A") + carre3(0.41, "#A8583A", ""), "sol"),
    devant: /* @__PURE__ */ __name((f) => [[-0.44, 0.42, -40], [0.44, -0.4, 40], [0.42, 0.44, 0]].map(([u, v, r], i) => {
      const [x, y] = P(u, v, 0);
      return feuille3(x, y - 3, 2.4, 5.4, i % 2 ? "#4E8E3A" : "#3E7A2E", r + wave4(f, 4, i)) + ln5([x, y], [x + Math.sin(r * Math.PI / 180) * 4, y - 6], "#2E5E22", 0.4);
    }).join(""), "devant"),
    preparer: /* @__PURE__ */ __name(() => {
      const [x, y] = P(-0.15, 0.15, 0);
      return ell4(x, y - 1, 4, 1.8, "#7A4A2E", bord2(0.4)) + [[-2, -2], [1, -2.4], [2.6, -1.4]].map(([a, b]) => feuille3(x + a, y + b, 1.2, 2.4, "#5E8A3A", a * 20)).join("") + ln5([x + 7, y + 1], [x + 9.4, y - 9], WOOD.left, 1.3) + `<path d="M${f24(x + 8.6)},${f24(y - 9)} q3,-1 4,1 q-2,0 -4,-1 Z" fill="#A9AFB8"${bord2(0.4)}/>`;
    }, "preparer")
    // les tiges coupées, la machette
  },
  // le volcan : la cendre noire, de petites pierres de lave, une fumerolle au loin
  volcan: {
    sol: /* @__PURE__ */ __name(() => carre3(0.45, "#6E6A5E") + carre3(0.41, "#3A3438", "") + [[-0.3, -0.25], [0.25, -0.1], [-0.05, 0.3]].map(([u, v]) => {
      const [x, y] = P(u, v, 0);
      return caillou(x, y, 0.6, "#5A4A48") + dot3(x + 0.3, y - 0.2, 0.25, "#E8703A");
    }).join(""), "sol"),
    devant: /* @__PURE__ */ __name((f) => {
      const [x, y] = P(0.44, -0.44, 0);
      return [0, 1, 2].map((i) => dot3(x - 2 + wave4(f, 1, i), y - 4 - i * 2.6 - f % 3 * 0.6, 1.2 + i * 0.4, `rgba(220,214,206,${f24(0.55 - i * 0.15)})`)).join("");
    }, "devant"),
    preparer: /* @__PURE__ */ __name(() => {
      const [x, y] = P(-0.1, 0.1, 0);
      return caillou(x, y, 1.3, "#5A4A48") + caillou(x + 3.6, y - 0.8, 1, "#4A3E3E") + ln5([x + 7, y + 1], [x + 9, y - 9], WOOD.left, 1.3) + ln5([x + 7.6, y - 9.4], [x + 11, y - 8.4], "#8A8F98", 1.6);
    }, "preparer")
  }
};
var PLANTES2 = {
  // les myrtilles : de petits buissons, des fleurs en clochettes roses, puis les baies bleues
  myrtilles: {
    graine: /* @__PURE__ */ __name((x, y) => ln5([x, y], [x, y - 1.6], "#7A5A3A", 0.6) + dot3(x, y - 1.8, 0.7, "#6FA84A"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => [-1, 1].map((o) => feuille3(x + o + s * 0.2, y - 1.4, 0.9, 0.6, "#6FA84A", o * 30)).join(""), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s, k) => [[-1.4, -1.4], [1.4, -1.6], [0, -2.8]].map(([a, b], i) => feuille3(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? "#5E9A3E" : "#4F8A3A", a * 15)).join("") + (k % 2 ? dot3(x + 0.8, y - 3.4, 0.55, "#F2B8C8") : ""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => [[-1.4, -1.4], [1.4, -1.6], [0, -2.8]].map(([a, b], i) => feuille3(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? "#6E8A3E" : "#5E7A3A", a * 15)).join("") + [[-1, -2.2], [1.2, -2.6], [0.2, -3.6], [-1.6, -1]].map(([a, b]) => fruit3(x + a + s * 0.3, y + b, 0.65, "#4A5AA8", "#2E3A70")).join(""), "mur")
  },
  // le sarrasin : des tiges rouges, des feuilles en cœur, des grappes de fleurs blanc rosé, puis les graines brunes
  sarrasin: {
    graine: /* @__PURE__ */ __name((x, y) => [-0.8, 0.6].map((o) => `<polygon points="${f24(x + o)},${f24(y - 1)} ${f24(x + o + 0.6)},${f24(y)} ${f24(x + o - 0.6)},${f24(y)}" fill="#6E4A2E"/>`).join(""), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => ln5([x, y], [x + s * 0.3, y - 2], "#C85A4A", 0.6) + feuille3(x - 0.8 + s * 0.3, y - 2.2, 0.9, 0.7, "#7CBF4E", -20) + feuille3(x + 0.8 + s * 0.3, y - 2.3, 0.9, 0.7, "#6FA84A", 20), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => ln5([x, y], [x + s * 0.4, y - 5.4], "#C85A4A", 0.7) + [[-1, -2.4], [1, -3.6], [-0.8, -4.6]].map(([a, b]) => feuille3(x + a + s * 0.4, y + b, 1, 0.8, "#6FA84A", a * 25)).join("") + [[-0.4, -6], [0.5, -6.2], [0, -6.8]].map(([a, b]) => dot3(x + a + s * 0.4, y + b, 0.55, "#FBEAF0")).join(""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => ln5([x, y], [x + s * 0.4, y - 5.4], "#A8402E", 0.7) + [[-1, -2.4], [1, -3.6]].map(([a, b]) => feuille3(x + a + s * 0.4, y + b, 1, 0.8, "#8A9A4A", a * 25)).join("") + [[-0.5, -5.8], [0.5, -6], [0, -6.8], [-0.2, -6.2]].map(([a, b]) => `<polygon points="${f24(x + a + s * 0.4)},${f24(y + b - 0.6)} ${f24(x + a + s * 0.4 + 0.5)},${f24(y + b + 0.3)} ${f24(x + a + s * 0.4 - 0.5)},${f24(y + b + 0.3)}" fill="#7A5232"/>`).join(""), "mur")
  },
  // le riz : des touffes repiquées dans l'eau, qui montent, puis s'inclinent sous les épis dorés
  riz: {
    graine: /* @__PURE__ */ __name((x, y) => [-0.6, 0.6].map((o) => ln5([x + o * 0.3, y], [x + o, y - 1.6], "#8FCB6A", 0.6)).join(""), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => [-0.8, 0, 0.8].map((o) => ln5([x + o * 0.3, y], [x + o + s * 0.3, y - 2.6], "#7CBF4E", 0.6)).join(""), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [-1.2, -0.4, 0.4, 1.2].map((o, i) => ln5([x + o * 0.3, y], [x + o + s * 0.5, y - 5 - i % 2], "#5FA04A", 0.7)).join(""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => [-1.2, -0.4, 0.4, 1.2].map((o, i) => {
      const tx = x + o + s * 0.5, ty = y - 5 - i % 2;
      return chemin3(`M${f24(x + o * 0.3)},${f24(y)} Q${f24(tx - 0.4)},${f24(ty)} ${f24(tx + 1.4)},${f24(ty + 1.6)}`, "#B8A24A", 0.7) + ell4(tx + 1.2, ty + 1.2, 0.5, 1.1, "#E8CC6A", ` stroke="#A8823A" stroke-width="0.3" transform="rotate(30 ${f24(tx + 1.2)} ${f24(ty + 1.2)})"`);
    }).join(""), "mur")
  },
  // les pastèques : des graines plates, des tiges qui rampent sur le sable, des fleurs jaunes, puis les grosses pastèques rayées
  pasteques: {
    espace: true,
    graine: /* @__PURE__ */ __name((x, y) => ell4(x - 0.6, y - 0.2, 0.6, 0.4, "#2E2218") + ell4(x + 0.7, y - 0.1, 0.6, 0.4, "#2E2218"), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => ln5([x, y], [x + s * 0.3, y - 1.8], "#6FA84A", 0.6) + feuille3(x - 1.1 + s * 0.3, y - 2, 1.2, 0.8, "#7CBF4E", -20) + feuille3(x + 1.1 + s * 0.3, y - 2.1, 1.2, 0.8, "#6FA84A", 20), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => chemin3(`M${f24(x - 4)},${f24(y)} q2,-1.6 4,-0.4 q2,1 4,-0.6`, "#5E9A3E", 0.7) + [[-2.6, -1.2], [0.4, -1.6], [2.8, -1.4]].map(([a, b], i) => feuille3(x + a + s * 0.3, y + b, 1.6, 1.1, i % 2 ? "#7CBF4E" : "#5E9A3E", a * 10)).join("") + dot3(x + 1.4, y - 2.8, 0.7, "#F7C83A"), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => chemin3(`M${f24(x - 4)},${f24(y)} q2,-1.6 4,-0.4 q2,1 4,-0.6`, "#5E9A3E", 0.7) + [[-2.8, -1.4], [3, -1.6]].map(([a, b]) => feuille3(x + a + s * 0.3, y + b, 1.6, 1.1, "#5E9A3E", a * 10)).join("") + ell4(x, y - 1.6, 3.4, 2.2, "#3E8A3A", bord2(0.45)) + [-1.6, 0, 1.6].map((o) => chemin3(`M${f24(x + o)},${f24(y - 3.6)} q${f24(o * 0.3)},2 0,4`, "#2A5E26", 0.6)).join("") + ell4(x - 1, y - 2.6, 1, 0.5, "rgba(255,255,255,.3)"), "mur")
  },
  // les ananas : des rosettes de feuilles en épées, qui s'élargissent ; le fruit rouge orangé monte au milieu, puis doré
  ananas: {
    espace: true,
    graine: /* @__PURE__ */ __name((x, y) => [-30, 0, 30].map((r) => feuille3(x + r / 30, y - 1.4, 0.4, 1.4, "#6E9A5A", r)).join(""), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => [-50, -20, 20, 50].map((r) => feuille3(x + r / 25 + s * 0.2, y - 1.8, 0.5, 2, "#5E8A4A", r)).join(""), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s) => [-65, -35, -10, 10, 35, 65].map((r, i) => feuille3(x + r / 18 + s * 0.2, y - 2.4, 0.6, 3, i % 2 ? "#5E8A4A" : "#4E7A3E", r)).join("") + ell4(x, y - 3.6, 1.1, 1.4, "#C8503A", bord2(0.35)), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s) => [-65, -35, 35, 65].map((r, i) => feuille3(x + r / 18 + s * 0.2, y - 2.4, 0.6, 3, i % 2 ? "#5E8A4A" : "#4E7A3E", r)).join("") + ell4(x, y - 4.4, 1.6, 2.2, "#E8A83A", bord2(0.4)) + [[-0.6, -4.8], [0.6, -4.2], [0, -3.6], [0, -5.4]].map(([a, b]) => ln5([x + a - 0.4, y + b - 0.4], [x + a + 0.4, y + b + 0.4], "#A8702A", 0.35)).join("") + [-30, 0, 30].map((r) => feuille3(x + r / 30, y - 7.4, 0.4, 1.6, "#5E8A4A", r)).join(""), "mur")
  },
  // les piments : de petits plants, des fleurs blanches, puis les piments verts et rouges qui pendent
  piments: {
    graine: /* @__PURE__ */ __name((x, y) => [-0.6, 0.6].map((o) => ell4(x + o, y - 0.2, 0.5, 0.35, "#F2D88A")).join(""), "graine"),
    pousse: /* @__PURE__ */ __name((x, y, s) => ln5([x, y], [x + s * 0.3, y - 2], "#5E9A3E", 0.6) + feuille3(x - 0.9 + s * 0.3, y - 2.2, 1, 0.6, "#6FA84A", -25) + feuille3(x + 0.9 + s * 0.3, y - 2.3, 1, 0.6, "#5E9A3E", 25), "pousse"),
    croissance: /* @__PURE__ */ __name((x, y, s, k) => ln5([x, y], [x + s * 0.4, y - 4.6], "#4E8A3A", 0.7) + [[-1.2, -2.2], [1.2, -3], [-1, -4], [1, -4.8]].map(([a, b], i) => feuille3(x + a + s * 0.4, y + b, 1.1, 0.6, i % 2 ? "#6FA84A" : "#4E8A3A", a * 25)).join("") + (k % 2 ? dot3(x + 0.6, y - 3.6, 0.5, "#FFFFFF") : ""), "croissance"),
    mur: /* @__PURE__ */ __name((x, y, s, k) => ln5([x, y], [x + s * 0.4, y - 4.6], "#4E8A3A", 0.7) + [[-1.2, -2.2], [1.2, -3], [-1, -4], [1, -4.8]].map(([a, b], i) => feuille3(x + a + s * 0.4, y + b, 1.1, 0.6, i % 2 ? "#6FA84A" : "#4E8A3A", a * 25)).join("") + [[-0.8, -3.4, "#E2453A"], [0.9, -2.6, k % 3 ? "#E2453A" : "#7FB24A"], [0.2, -4.2, "#F08A3A"]].map(([a, b, c]) => chemin3(`M${f24(x + a + s * 0.4)},${f24(y + b)} q0.6,1.2 0.1,2.6`, "#8A2A20", 1.5) + chemin3(`M${f24(x + a + s * 0.4)},${f24(y + b)} q0.6,1.2 0.1,2.6`, c, 0.8)).join(""), "mur")
  }
};
function etape4(climat, quoi, n) {
  const sol = SOLS[climat];
  if (!sol) throw new Error(`climat inconnu : ${climat} (${CLIMATS.join(", ")})`);
  const k0 = ETAPES5.indexOf(quoi);
  if (k0 < 0) throw new Error(`étape inconnue : ${quoi} (${ETAPES5.join(", ")})`);
  const f = n % IMAGES4, p = PLANTES2[CULTURE[climat]];
  let out = sol.sol(f);
  if (quoi === "preparation") out += sol.preparer(f);
  else for (const { du, dv, k } of places()) {
    if (p.espace && k % 2 && quoi !== "plantation") continue;
    const [x, y] = P(du, dv, 0), s = wave4(f, quoi === "pousses" ? 0.6 : 1.1, k * 0.9);
    out += quoi === "plantation" ? p.graine(x, y, k) : quoi === "pousses" ? p.pousse(x, y, s, k) : p[quoi](x, y, s, k);
  }
  return out + sol.devant(f);
}
__name(etape4, "etape");

// atelier/reserves.mjs
var OUT6 = "#3C2819";
var f25 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var ln6 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f25(a[0])}" y1="${f25(a[1])}" x2="${f25(b[0])}" y2="${f25(b[1])}" stroke="${color}" stroke-width="${f25(w)}" stroke-linecap="round"/>`, "ln");
var ell5 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f25(x)}" cy="${f25(y)}" rx="${f25(rx)}" ry="${f25(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot4 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f25(x)}" cy="${f25(y)}" r="${f25(r)}" fill="${fill}"/>`, "dot");
var bord3 = /* @__PURE__ */ __name((w = 0.45) => ` stroke="${OUT6}" stroke-width="${w}"`, "bord");
var etoile2 = /* @__PURE__ */ __name((x, y, r) => `<path d="M${f25(x)},${f25(y - r)} Q${f25(x)},${f25(y)} ${f25(x + r)},${f25(y)} Q${f25(x)},${f25(y)} ${f25(x)},${f25(y + r)} Q${f25(x)},${f25(y)} ${f25(x - r)},${f25(y)} Q${f25(x)},${f25(y)} ${f25(x)},${f25(y - r)} Z" fill="#FFFBE0"/>`, "etoile");
var CADRE5 = [-34, -30, 68, 48];
var BATIMENTS = ["foyer", "ponton", "atelier", "puits", "bosquet", "carriere", "potager"];
var ETATS = ["vide", "moitie", "plein"];
var IMAGES5 = { vide: 1, moitie: 1, plein: 2 };
var ombre2 = /* @__PURE__ */ __name((rx = 16) => {
  const [x, y] = P(0, 0, 0);
  return ell5(x + 1, y + 1, rx, rx * 0.45, "rgba(40,55,20,0.2)");
}, "ombre");
function caisse(u, v, a, h) {
  return box(u - a, v - a * 0.8, u + a, v + a * 0.8, 0, h, WOOD) + [0.3, 0.65].map((t) => ln6(P(u - a, v + a * 0.8, h * t), P(u + a, v + a * 0.8, h * t), WOOD_DARK.right, 0.5)).join("");
}
__name(caisse, "caisse");
var dedans = /* @__PURE__ */ __name((u, v, a, h) => {
  const c = [[u - a, v - a * 0.8], [u + a, v - a * 0.8], [u + a, v + a * 0.8], [u - a, v + a * 0.8]].map(([a1, b1]) => P(a1, b1, h));
  return `<polygon points="${c.map(([x, y]) => `${f25(x)},${f25(y)}`).join(" ")}" fill="#4A2E1A"${EDGE}/>`;
}, "dedans");
var tas2 = /* @__PURE__ */ __name((u, v, a, h, n, objet) => {
  let o = "";
  const pos = [[-0.5, -0.4], [0.5, -0.3], [0, 0.1], [-0.5, 0.45], [0.5, 0.5], [0, -0.6], [-0.1, 0.2], [0.3, 0.05], [-0.3, -0.05]];
  for (let i = 0; i < n; i++) {
    const [du, dv] = pos[i];
    const [x, y] = P(u + du * a, v + dv * a * 0.8, h + (i > 4 ? 2.4 : 0.6));
    o += objet(x, y, i);
  }
  return o;
}, "tas");
var DESSINS2 = {
  // le foyer : la marmite sur son trépied et le panier de miches
  foyer: /* @__PURE__ */ __name((n) => {
    const [mx, my] = P(-0.12, -0.05, 0);
    let o = ombre2() + [[-5, 0], [5, 0], [0, 3]].map(([dx, dy]) => ln6([mx + dx * 0.6, my + dy * 0.4 - 7], [mx + dx, my + dy], "#3B3C42", 1.1)).join("") + `<path d="M${f25(mx - 6)},${f25(my - 8)} Q${f25(mx - 6)},${f25(my - 1)} ${f25(mx)},${f25(my - 1)} Q${f25(mx + 6)},${f25(my - 1)} ${f25(mx + 6)},${f25(my - 8)} Z" fill="#3E3E46"${bord3()}/>` + ell5(mx, my - 8, 6, 1.8, n ? "#E8A04A" : "#2A2A30", bord3());
    if (n === 2) o += ell5(mx, my - 8.2, 4.6, 1.2, "#F2C46A") + [0, 1].map((i) => dot4(mx - 2 + i * 3.4, my - 8.4, 0.7, "#E8803A")).join("");
    const [px, py] = P(0.24, 0.16, 0);
    o += ell5(px, py - 2, 6, 2.4, "#B8864E", bord3()) + `<path d="M${f25(px - 6)},${f25(py - 2)} L${f25(px - 5)},${f25(py + 1)} Q${f25(px)},${f25(py + 2.6)} ${f25(px + 5)},${f25(py + 1)} L${f25(px + 6)},${f25(py - 2)} Z" fill="#A8743E"${bord3()}/>`;
    const miches = [[-2.6, -3], [1.8, -3.2], [-0.4, -4.6], [3.6, -2.2], [-3.8, -1.8]].slice(0, [0, 2, 5][n]);
    return o + miches.map(([dx, dy]) => ell5(px + dx, py + dy, 2.2, 1.4, "#D89A4E", bord3(0.4)) + ln6([px + dx - 1, py + dy - 0.4], [px + dx + 1, py + dy - 0.6], "#F2C88A", 0.5)).join("");
  }, "foyer"),
  // le ponton : la caisse de poissons et la nasse
  ponton: /* @__PURE__ */ __name((n) => ombre2() + caisse(0, 0, 0.2, 7) + dedans(0, 0, 0.2, 7) + tas2(0, 0, 0.2, 7, [0, 4, 9][n], (x, y, i) => {
    const c = ["#8FB8D8", "#E8A06A", "#B8C8D0"][i % 3];
    return `<path d="M${f25(x - 3)},${f25(y)} Q${f25(x)},${f25(y - 1.6)} ${f25(x + 2.2)},${f25(y)} Q${f25(x)},${f25(y + 1.6)} ${f25(x - 3)},${f25(y)} Z M${f25(x + 2)},${f25(y)} l1.4,-1 l0,2 Z" fill="${c}"${bord3(0.4)}/>` + dot4(x - 1.8, y - 0.2, 0.3, OUT6);
  }), "ponton"),
  // l'atelier : la caisse de rouages et de petites pièces de laiton
  atelier: /* @__PURE__ */ __name((n) => ombre2() + caisse(0, 0, 0.2, 6) + dedans(0, 0, 0.2, 6) + tas2(0, 0, 0.2, 6, [0, 4, 9][n], (x, y, i) => i % 2 ? `<circle cx="${f25(x)}" cy="${f25(y - 1)}" r="2" fill="#D8A84A"${bord3(0.4)}/>` + dot4(x, y - 1, 0.7, "#8A6A2A") + [0, 60, 120, 180, 240, 300].map((a) => dot4(x + Math.cos(a * Math.PI / 180) * 2.2, y - 1 + Math.sin(a * Math.PI / 180) * 2.2, 0.5, "#D8A84A")).join("") : ell5(x, y - 0.6, 1.6, 0.8, "#A9AFB8", bord3(0.4)) + dot4(x, y - 0.7, 0.4, "#5A5E66")), "atelier"),
  // le puits : les seaux d'eau, vides, un plein, tous pleins
  puits: /* @__PURE__ */ __name((n) => ombre2() + [[-0.18, -0.08], [0.16, -0.12], [0.02, 0.16]].map(([u, v], i) => {
    const [x, y] = P(u, v, 0), plein = i < [0, 1, 3][n];
    return `<path d="M${f25(x - 3.6)},${f25(y - 7)} L${f25(x - 2.8)},${f25(y)} L${f25(x + 2.8)},${f25(y)} L${f25(x + 3.6)},${f25(y - 7)} Z" fill="${WOOD.left}"${bord3()}/>` + ln6([x - 3.2, y - 3.6], [x + 3.2, y - 3.6], "#3B3C42", 0.7) + ell5(x, y - 7, 3.6, 1.2, plein ? "#7FC4EA" : "#4A2E1A", bord3()) + (plein ? ell5(x - 1, y - 7.2, 1.2, 0.4, "#C8ECFA") : "") + `<path d="M${f25(x - 3.4)},${f25(y - 7)} Q${f25(x)},${f25(y - 12)} ${f25(x + 3.4)},${f25(y - 7)}" stroke="#3B3C42" stroke-width="0.6" fill="none"/>`;
  }).join(""), "puits"),
  // le bosquet : la pile de bûches calées par deux piquets
  bosquet: /* @__PURE__ */ __name((n) => {
    const [x, y] = P(0, 0, 0);
    const rangs = [[], [[-4, 0], [0, 0], [4, 0]], [[-6, 0], [-2, 0], [2, 0], [6, 0], [-4, -3.6], [0, -3.6], [4, -3.6], [-2, -7.2], [2, -7.2]]][n];
    return ombre2() + [-8.4, 8.4].map((dx) => ln6([x + dx, y + 1], [x + dx, y - 10], WOOD_DARK.left, 1.4)).join("") + rangs.map(([dx, dy]) => ell5(x + dx, y + dy - 1.8, 2, 1.8, "#C89A6A", bord3()) + ell5(x + dx, y + dy - 1.8, 1.1, 1, "none", ' stroke="#9A6A42" stroke-width="0.4"') + dot4(x + dx, y + dy - 1.8, 0.3, "#8A5A32")).join("") + (n ? "" : ell5(x, y - 0.4, 6, 1.2, "#8A6A46", ' opacity="0.6"') + [-3, 2].map((dx) => dot4(x + dx, y - 0.6, 0.6, "#C89A6A")).join(""));
  }, "bosquet"),
  // la carrière : le tas de pierres taillées sur une palette
  carriere: /* @__PURE__ */ __name((n) => {
    let o = ombre2() + box(-0.22, -0.18, 0.22, 0.18, 0, 1.6, WOOD);
    const blocs = [[], [[-0.1, 0], [0.1, 0]], [[-0.12, -0.08], [0.1, -0.08], [-0.12, 0.08], [0.1, 0.08], [-0.01, 0, 1]]][n];
    for (const [u, v, haut] of blocs) o += box(u - 0.08, v - 0.06, u + 0.08, v + 0.06, haut ? 6.4 : 1.6, haut ? 11.2 : 6.4, STONE);
    return o;
  }, "carriere"),
  // le potager : les paniers de légumes (carottes, choux, citrouille)
  potager: /* @__PURE__ */ __name((n) => {
    let o = ombre2();
    [[-0.16, -0.06], [0.16, 0.08]].forEach(([u, v], i) => {
      const [x, y] = P(u, v, 0);
      o += ell5(x, y - 3.4, 5, 1.8, "#7A5232", bord3()) + `<path d="M${f25(x - 5)},${f25(y - 3.4)} L${f25(x - 4)},${f25(y)} Q${f25(x)},${f25(y + 1.4)} ${f25(x + 4)},${f25(y)} L${f25(x + 5)},${f25(y - 3.4)} Z" fill="#B8864E"${bord3()}/>`;
      if (n > i) o += i === 0 ? [[-2.2, -4.4], [0, -5], [2.2, -4.2]].map(([dx, dy]) => `<path d="M${f25(x + dx - 0.8)},${f25(y + dy)} L${f25(x + dx + 0.9)},${f25(y + dy - 0.4)} L${f25(x + dx + 2)},${f25(y + dy + 1.4)} Z" fill="#F08A3A"${bord3(0.35)}/>` + ln6([x + dx - 0.6, y + dy - 0.2], [x + dx - 1.6, y + dy - 2], "#5FA04A", 0.8)).join("") : dot4(x - 1.6, y - 4.6, 2, "#9CC4B0") + `<circle cx="${f25(x + 1.8)}" cy="${f25(y - 4.4)}" r="2.2" fill="#E8862E"${bord3(0.4)}/>`;
    });
    return o;
  }, "potager")
};
function reserve(batiment, etat, n) {
  const d = DESSINS2[batiment];
  if (!d) throw new Error(`bâtiment inconnu : ${batiment} (${BATIMENTS.join(", ")})`);
  const k = ETATS.indexOf(etat);
  if (k < 0) throw new Error(`état inconnu : ${etat} (${ETATS.join(", ")})`);
  let o = d(k);
  if (k === 2) o += n % 2 ? etoile2(9, -16, 2.2) + etoile2(-11, -10, 1.6) : etoile2(-6, -18, 2.4) + etoile2(12, -8, 1.6);
  return o;
}
__name(reserve, "reserve");

// atelier/generateur_chantiers.mjs
var K = 1.25;
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2]}" height="${cadre[3]}" viewBox="${cadre.join(" ")}"><g transform="scale(${K})">${body}</g></svg>`, "svgOf");
var EMPRISES = { "2x2": { nom: "2 × 2 cases", cadre: [-95, -155, 190, 210] }, "3x3": { nom: "3 × 3 cases", cadre: [-140, -250, 280, 330] } };
var PART = { piquets: 0, terrassement: 0.12, fondations: 0.28, charpente: 0.46, murs: 0.64, toit: 0.82 };
var MS = { etape: 220, devoilement: 110, spectacle: 450 };
var IMAGES6 = { etape: 3, devoilement: 4, echafaudage: 3 };
var verifie = /* @__PURE__ */ __name((emprise, n, max) => {
  if (!EMPRISES[emprise]) throw new Error(`emprise inconnue : ${emprise} (2x2 ou 3x3)`);
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
  return EMPRISES[emprise].cadre;
}, "verifie");
function etapeDuMontage(emprise, etape5, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES6.etape);
  if (!ETAPES.includes(etape5)) throw new Error(`étape inconnue : ${etape5} (${ETAPES.join(", ")})`);
  return { svg: svgOf(cadre, montage(emprise, etape5, n - 1)), cadre, ms_par_image: MS.etape };
}
__name(etapeDuMontage, "etapeDuMontage");
function devoilementDuBatiment(emprise, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES6.devoilement);
  return { svg: svgOf(cadre, devoilement(emprise, n - 1)), cadre, ms_par_image: MS.devoilement };
}
__name(devoilementDuBatiment, "devoilementDuBatiment");
function echafaudageDEvolution(emprise, couche, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES6.echafaudage);
  if (couche !== "derriere" && couche !== "devant") throw new Error(`couche inconnue : ${couche} (derriere ou devant)`);
  return { svg: svgOf(cadre, echafaudage(emprise, couche, n - 1)), cadre, ms_par_image: MS.etape };
}
__name(echafaudageDEvolution, "echafaudageDEvolution");
var CULTURES2 = { cultures: CULTURES, etapes: Object.fromEntries(CULTURES.map((c) => [c, etapesDe(c)])), cadre: CADRE.map((v) => v * K), images: IMAGES };
var PART_CULTURE = { bechage: 0, sillons: 0.15, semis: 0.3, pousses: 0.5, croissance: 0.7, mur: 1 };
var MS_CULTURE = { etape: 280, spectacle: 450 };
function etapeDeCulture(culture, etape5, n = 1) {
  if (!CULTURES.includes(culture)) throw new Error(`culture inconnue : ${culture} (${CULTURES.join(", ")})`);
  if (!etapesDe(culture).includes(etape5)) throw new Error(`étape inconnue : ${etape5} (${etapesDe(culture).join(", ")})`);
  if (!(+n >= 1 && +n <= IMAGES)) throw new Error(`image ${n} : de 1 à ${IMAGES}`);
  return { svg: svgOf(CULTURES2.cadre, etape(culture, etape5, n - 1)), cadre: CULTURES2.cadre, ms_par_image: MS_CULTURE.etape };
}
__name(etapeDeCulture, "etapeDeCulture");
var VERGER = { arbres: ARBRES, etapes: ETAPES3, cadre: CADRE2, images: IMAGES2 };
var PART_VERGER = { trou: 0, plantation: 0.1, jeune: 0.25, floraison: 0.5, fruits_verts: 0.7, mur: 1 };
var MS_VERGER = { etape: 300, spectacle: 450 };
function etapeDuVerger(arbre, etape5, n = 1) {
  if (!ARBRES.includes(arbre)) throw new Error(`arbre inconnu : ${arbre} (${ARBRES.join(", ")})`);
  if (!ETAPES3.includes(etape5)) throw new Error(`étape inconnue : ${etape5} (${ETAPES3.join(", ")})`);
  if (!(+n >= 1 && +n <= IMAGES2)) throw new Error(`image ${n} : de 1 à ${IMAGES2}`);
  const c = CADRE2;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2]}" height="${c[3]}" viewBox="${c.join(" ")}">${etape2(arbre, etape5, n - 1)}</svg>`, cadre: c, ms_par_image: MS_VERGER.etape };
}
__name(etapeDuVerger, "etapeDuVerger");
var LUNAIRE = { plantes: PLANTES, etapes: ETAPES4, cadre: CADRE3.map((v) => v * K), images: IMAGES3 };
var PART_LUNAIRE = { nouvelle_lune: 0, croissant: 0.25, quartier: 0.5, gibbeuse: 0.75, pleine_lune: 1 };
var MS_LUNAIRE = { etape: 320, spectacle: 500 };
function etapeLunaire(plante, etape5, n = 1) {
  if (!PLANTES.includes(plante)) throw new Error(`plante inconnue : ${plante} (${PLANTES.join(", ")})`);
  if (!ETAPES4.includes(etape5)) throw new Error(`étape inconnue : ${etape5} (${ETAPES4.join(", ")})`);
  if (!(+n >= 1 && +n <= IMAGES3)) throw new Error(`image ${n} : de 1 à ${IMAGES3}`);
  return { svg: svgOf(LUNAIRE.cadre, etape3(plante, etape5, n - 1)), cadre: LUNAIRE.cadre, ms_par_image: MS_LUNAIRE.etape };
}
__name(etapeLunaire, "etapeLunaire");
var CLIMATS2 = { climats: CLIMATS, culture: CULTURE, etapes: ETAPES5, cadre: CADRE4.map((v) => v * K), images: IMAGES4 };
var PART_CLIMAT = { preparation: 0, plantation: 0.15, pousses: 0.35, croissance: 0.6, mur: 1 };
var MS_CLIMAT = { etape: 300, spectacle: 450 };
function etapeDeClimat(climat, etape5, n = 1) {
  if (!CLIMATS.includes(climat)) throw new Error(`climat inconnu : ${climat} (${CLIMATS.join(", ")})`);
  if (!ETAPES5.includes(etape5)) throw new Error(`étape inconnue : ${etape5} (${ETAPES5.join(", ")})`);
  if (!(+n >= 1 && +n <= IMAGES4)) throw new Error(`image ${n} : de 1 à ${IMAGES4}`);
  return { svg: svgOf(CLIMATS2.cadre, etape4(climat, etape5, n - 1)), cadre: CLIMATS2.cadre, ms_par_image: MS_CLIMAT.etape };
}
__name(etapeDeClimat, "etapeDeClimat");
var RESERVES = { batiments: BATIMENTS, etats: ETATS, images: IMAGES5, cadre: CADRE5.map((v) => v * K) };
var MS_RESERVE = 500;
var fichierReserve = /* @__PURE__ */ __name((b, e, n) => `batiments/reserves/${b}/reserve_${b}_${e}${IMAGES5[e] > 1 ? `_${n}` : ""}.svg`, "fichierReserve");
function reserveDuBatiment(batiment, etat, n = 1) {
  if (!BATIMENTS.includes(batiment)) throw new Error(`bâtiment inconnu : ${batiment} (${BATIMENTS.join(", ")})`);
  if (!ETATS.includes(etat)) throw new Error(`état inconnu : ${etat} (${ETATS.join(", ")})`);
  const k = IMAGES5[etat];
  if (!(+n >= 1 && +n <= k)) throw new Error(`image ${n} : de 1 à ${k}`);
  return { svg: svgOf(RESERVES.cadre, reserve(batiment, etat, n - 1)), cadre: RESERVES.cadre, ms_par_image: k > 1 ? MS_RESERVE : null };
}
__name(reserveDuBatiment, "reserveDuBatiment");
function liste() {
  const out = [];
  for (const b of BATIMENTS) for (const e of ETATS) for (let n = 1; n <= IMAGES5[e]; n++) out.push({ fichier: fichierReserve(b, e, n), fonction: "reserveDuBatiment", args: [b, e, n] });
  for (const c of CLIMATS) for (const e of ETAPES5) for (let n = 1; n <= IMAGES4; n++) out.push({ fichier: `decor/climats/${c}/climat_${c}_${e}_${n}.svg`, fonction: "etapeDeClimat", args: [c, e, n] });
  for (const p of PLANTES) for (const e of ETAPES4) for (let n = 1; n <= IMAGES3; n++) out.push({ fichier: `decor/lunaire/${p}/lunaire_${p}_${e}_${n}.svg`, fonction: "etapeLunaire", args: [p, e, n] });
  for (const a of ARBRES) for (const e of ETAPES3) for (let n = 1; n <= IMAGES2; n++) out.push({ fichier: `decor/verger/${a}/verger_${a}_${e}_${n}.svg`, fonction: "etapeDuVerger", args: [a, e, n] });
  for (const c of CULTURES) for (const e of etapesDe(c)) for (let n = 1; n <= IMAGES; n++) out.push({ fichier: `decor/cultures/${c}/culture_${c}_${e}_${n}.svg`, fonction: "etapeDeCulture", args: [c, e, n] });
  for (const em of Object.keys(EMPRISES)) {
    const d = `batiments/montage/${em}`;
    for (const e of ETAPES) for (let n = 1; n <= IMAGES6.etape; n++) out.push({ fichier: `${d}/montage_${em}_${e}_${n}.svg`, fonction: "etapeDuMontage", args: [em, e, n] });
    for (let n = 1; n <= IMAGES6.devoilement; n++) out.push({ fichier: `${d}/devoilement_${em}_${n}.svg`, fonction: "devoilementDuBatiment", args: [em, n] });
    for (const c of ["derriere", "devant"]) for (let n = 1; n <= IMAGES6.echafaudage; n++) out.push({ fichier: `${d}/echafaudage_${em}_${c}_${n}.svg`, fonction: "echafaudageDEvolution", args: [em, c, n] });
  }
  return out;
}
__name(liste, "liste");
export {
  CLIMATS2 as CLIMATS,
  CULTURES2 as CULTURES,
  EMPRISES,
  ETAPES,
  IMAGES6 as IMAGES,
  LUNAIRE,
  MS,
  MS_CLIMAT,
  MS_CULTURE,
  MS_LUNAIRE,
  MS_RESERVE,
  MS_VERGER,
  PART,
  PART_CLIMAT,
  PART_CULTURE,
  PART_LUNAIRE,
  PART_VERGER,
  RESERVES,
  VERGER,
  devoilementDuBatiment,
  echafaudageDEvolution,
  etapeDeClimat,
  etapeDeCulture,
  etapeDuMontage,
  etapeDuVerger,
  etapeLunaire,
  liste,
  reserveDuBatiment
};
