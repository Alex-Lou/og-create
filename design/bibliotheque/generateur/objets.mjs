// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_objets.mjs : ne pas modifier à la main.
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
    var OUT2 = "#3C2819";
    var W = 1.1;
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT2}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P2 = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT2, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 };
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
      couleurs.delete(OUT2);
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
        else if (mode === "big") s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P2(`M${r22(x - k * 1.3)},${r22(y - 1.4)} L${r22(x + k * 1.1)},${y} L${r22(x - k * 1.3)},${r22(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r22(x - rx)},${r22(top)} Q${x},${r22(top - 0.9)} ${r22(x + rx)},${r22(top)} A${rx} ${r22(ry * 0.85)} 0 0 1 ${r22(x - rx)},${r22(top)} Z" fill="${EYE}"/>` + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P2(`M${r22(x - rx - 0.5)},${r22(top + 0.3)} Q${x},${r22(top - 1.1)} ${r22(x + rx + 0.5)},${r22(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r22(top + (k > 0 ? tO : tI)), yr = r22(top + (k > 0 ? tI : tO));
          s += `<path d="M${r22(x - rx)},${yl} L${r22(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r22(x - rx)},${yl} Z" fill="${EYE}"/>` + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P2(`M${r22(x - rx - 0.4)},${r22(yl - (yr - yl) * 0.12)} L${r22(x + rx + 0.4)},${r22(yr + (yr - yl) * 0.12)}`, "none", 1);
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
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P2(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, fill, w) + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
    var zee = /* @__PURE__ */ __name((x, y, z) => {
      const d = `M${r22(x)},${r22(y)} L${r22(x + z)},${r22(y)} L${r22(x)},${r22(y + z)} L${r22(x + z)},${r22(y + z)}`;
      return `<path d="${d}" fill="none" stroke="${OUT2}" stroke-width="${r22(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r22(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
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
        return P2(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P2(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r22(mx - w)},${my} Q${mx},${r22(my + w * 0.94)} ${r22(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r22(mx - 1.4)},${r22(my + 1.1)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.4)},${r22(my + 1.1)}`);
      else if (expr === "fache") s += P2(`M${r22(mx - 1.7)},${r22(my + 1.3)} Q${mx},${r22(my - 0.4)} ${r22(mx + 1.7)},${r22(my + 1.3)} Q${mx},${r22(my + 0.7)} ${r22(mx - 1.7)},${r22(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P2(`M${r22(mx - 1.8)},${r22(my + 0.6)} Q${r22(mx - 1.2)},${r22(my - 0.1)} ${r22(mx - 0.6)},${r22(my + 0.6)} Q${mx},${r22(my + 1.3)} ${r22(mx + 0.6)},${r22(my + 0.6)} Q${r22(mx + 1.2)},${r22(my - 0.1)} ${r22(mx + 1.8)},${r22(my + 0.6)}`, "none", 0.8);
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
      const body = P2(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P2(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 2.3)},${r22(y)} L${r22(x + 2.3)},${r22(y)} Q${r22(x + 2.9)},${r22(y + 3.4)} ${r22(x + 1.4)},${r22(y + 4.3)} L${r22(x - 1.4 - toe)},${r22(y + 4.3)} Q${r22(x - 3.1 - toe)},${r22(y + 3.8)} ${r22(x - 2.3)},${r22(y)} Z`;
      let s = P2(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT2, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      const top = c.hip;
      return `<rect x="${r22(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r22(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r22(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r22(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function enfoncer(pts2) {
      const [a, n] = pts2, len = Math.hypot(n[0] - a[0], n[1] - a[1]) || 1;
      return [[r22(a[0] + (n[0] - a[0]) / len * 1.1), r22(a[1] + (n[1] - a[1]) / len * 1.1)], ...pts2.slice(1)];
    }
    __name(enfoncer, "enfoncer");
    function arm(c, a, b, elbow, main, partie = "tout") {
      const pts2 = enfoncer(elbow ? [a, elbow, b] : [a, b]);
      if (c.sleeves || c.bandage) return armOf(c, pts2, main, partie);
      const d = "M" + pts2.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = "";
      if (partie !== "devant") {
        s += line(OUT2, c.armW + W * 2) + line(c.sleeve, c.armW);
        if (c.cuff) {
          const f = pts2[pts2.length - 2];
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
    function armOf(c, pts2, main, partie = "tout") {
      const b = pts2[pts2.length - 1], f = pts2[pts2.length - 2];
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
        const d = path([...pts2.slice(0, -1), cut]);
        if (derriere) s += stroke(d, OUT2, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
        const fd = path([cut, b]);
        s += stroke(fd, OUT2, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P22 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
        const ombre = /* @__PURE__ */ __name((rr, dk) => `<path d="M${pt(P22(rr * 0.7, dk + rr * 0.55))} Q${pt(P22(0, dk + rr * 1.25))} ${pt(P22(-rr * 0.7, dk + rr * 0.55))}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="0.6" stroke-linecap="round"/>`, "ombre");
        if (c.sleeves === "court") {
          const e = path([at(k + 1.6), at(k - 0.4)]);
          s += stroke(e, OUT2, c.armW + W * 2) + stroke(e, c.sleeve, c.armW) + ombre(c.armW / 2 + 1.1, -0.4);
        } else if (c.sleeves === "torn") {
          const zig = [P22(h, -0.5), P22(h * 0.45, 1.5), P22(0, 0.4), P22(-h * 0.5, 1.6), P22(-h, -0.5)];
          s += `<path d="${path([P22(h, -1.8), ...zig, P22(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT2, 0.85);
        } else {
          const r = h + 0.4, arc = `M${pt(P22(r, -0.4))} Q${pt(P22(0, r * 0.95))} ${pt(P22(-r, -0.4))}`;
          s += `<path d="${arc}" fill="none" stroke="${OUT2}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${c.cuff || c.sleeve}" stroke-width="1.5" stroke-linecap="round"/><path d="M${pt(P22(r * 0.55, -0.2))} Q${pt(P22(0, r * 0.45))} ${pt(P22(-r * 0.55, -0.2))}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="0.45" stroke-linecap="round"/>`;
        }
      } else {
        const d = path(pts2);
        if (derriere) s += stroke(d, OUT2, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        if (!devant) return s;
      }
      if (c.bandage) {
        const screenLeft = pts2[0][0] < 24;
        const charLeft = c.view === "ne" ? screenLeft : !screenLeft;
        if (c.bandage === "left" === charLeft) {
          const w = (cut ? fw : c.armW) + 0.7;
          s += limb(at(2.2), at(4.4), w, "#F4EEDF");
          for (const k of [2.9, 3.7]) {
            const p = at(k);
            s += L([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT2, 1.5) + L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
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
    module.exports = { OUT: OUT2, W, r2: r22, st, P: P2, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp: lerp2, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/torche.js
var require_torche = __commonJS({
  "atelier/torche.js"(exports, module) {
    var { OUT: OUT2, P: P2, E, r2: r22 } = require_troupe2();
    var TETE = -45.4;
    var BOIS = { corps: "#D6C3A2", ombre: "#B29C78", clair: "#EADCC0" };
    var CORDE = "#C9A66B";
    var TOILE = { corps: "#8A5A30", ombre: "#6A4224", brule: "#3E2A1C" };
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var LUMIERE = [0, 0, 43, 38, "255,186,96"];
    var langue = /* @__PURE__ */ __name(([tip, r, base, l], k, s, fill, contour) => `<path d="M${r22(base[0] * k)},${r22(base[1] * k)} C${r22((r[0] + 3 * s) * k)},${r22(r[1] * k)} ${r22((tip[0] + 2 * s) * k)},${r22((tip[1] + 8 * s) * k)} ${r22(tip[0] * k)},${r22(tip[1] * k)} C${r22((tip[0] - 2 * s) * k)},${r22((tip[1] + 8 * s) * k)} ${r22((l[0] - 3 * s) * k)},${r22(l[1] * k)} ${r22(base[0] * k)},${r22(base[1] * k)} Z" fill="${fill}"${contour ? ` stroke="${OUT2}" stroke-width="0.8" stroke-linejoin="round"` : ""}/>`, "langue");
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
      s += trait(poteau, OUT2, 5.6) + trait(poteau, BOIS.corps, 3.4) + trait("M1.2,-1 Q0.2,-14 1.4,-26 Q2,-31 1.8,-35", BOIS.ombre, 1) + trait("M-1.2,-3 Q-2,-12 -1.2,-20", BOIS.clair, 0.8);
      s += E(-0.6, -15.6, 1, 1.4, BOIS.ombre, 0.6);
      s += [[-5.4, 1.4, 3, 2], [5, 1.8, 3.2, 2.2], [0.4, 3.6, 2.6, 1.7]].map(([x, y, rx, ry]) => E(x, y, rx, ry, "#B4AEA4", 0.9) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3, "rgba(255,255,255,.6)", 0)).join("");
      s += [-33.2, -31.2, -29.2].map((y) => trait(`M-2.6,${r22(y + 0.8)} L3.4,${r22(y - 0.6)}`, OUT2, 2.4) + trait(`M-2.6,${r22(y + 0.8)} L3.4,${r22(y - 0.6)}`, CORDE, 1.1)).join("");
      const T2 = `M-4.2,-36.6 Q-5.8,-41.4 -5.6,${TETE} L5.8,${TETE} Q6,-41.4 4.6,-36.6 Q0.2,-35.2 -4.2,-36.6 Z`;
      s += P2(T2, TOILE.corps, 1) + `<clipPath id="trc${eteinte ? "e" : ""}"><path d="${T2}"/></clipPath><g clip-path="url(#trc${eteinte ? "e" : ""})"><rect x="1.6" y="-47" width="6" height="12" fill="${TOILE.ombre}"/>` + [-43.4, -41.2, -39].map((y) => trait(`M-6,${y} Q0,${r22(y + 1.4)} 6,${y}`, TOILE.ombre, 0.7)).join("") + `</g>`;
      s += E(0.1, TETE, 5.7, 1.9, eteinte ? TOILE.brule : "#5E3A22", 1) + (eteinte ? E(-1.4, TETE - 0.3, 1.6, 0.6, "#6A5848", 0) : E(0.1, TETE, 4.2, 1.2, "#F28A2E", 0));
      return s;
    }
    __name(corps, "corps");
    function torche2(etat = "allumee", n = 0) {
      if (etat === "eteinte") {
        return corps(true) + `<g opacity=".75">${trait(`M0.4,${TETE - 1.6} Q-2.4,${TETE - 5} 0.6,${TETE - 8} Q3.4,${TETE - 11} 0.8,${TETE - 14.6}`, "#9AA0A8", 1.6)}</g><circle cx="1.6" cy="${TETE - 17}" r="1.4" fill="rgba(170,176,184,.6)"/>`;
      }
      return lueur(TETE - 9, n) + corps(false) + `<g transform="translate(0 ${r22(TETE + 0.6)})">${flamme(n)}</g>`;
    }
    __name(torche2, "torche");
    function torcheIcone2() {
      const WO = 1.3;
      let s = `<g transform="rotate(16 16 17)">`;
      s += trait("M16,30 L16,14.6", OUT2, 4.6) + trait("M16,30 L16,14.6", BOIS.corps, 2.2) + trait("M16.8,29 L16.8,15.6", BOIS.ombre, 0.7);
      s += [21, 19.4].map((y) => trait(`M13.8,${r22(y + 0.7)} L18.2,${r22(y - 0.5)}`, OUT2, 2.2) + trait(`M13.8,${r22(y + 0.7)} L18.2,${r22(y - 0.5)}`, CORDE, 1)).join("");
      const T2 = "M12.6,16.6 Q11.6,13 11.8,11 L20.2,11 Q20.4,13 19.4,16.6 Q16,17.6 12.6,16.6 Z";
      s += `<path d="${T2}" fill="${TOILE.corps}" stroke="${OUT2}" stroke-width="${WO}" stroke-linejoin="round"/>` + trait("M12,13.4 Q16,14.6 20,13.4", TOILE.ombre, 0.7);
      s += E(16, 11, 4.2, 1.4, "#F28A2E", 1);
      s += `<g transform="translate(16 11.6) scale(0.42)">${flamme(0, 1)}</g></g>`;
      return s + `<path d="M25.4,6.4 L25.8,7.6 L27,8 L25.8,8.4 L25.4,9.6 L25,8.4 L23.8,8 L25,7.6 Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="0.5"/>`;
    }
    __name(torcheIcone2, "torcheIcone");
    module.exports = { torche: torche2, torcheIcone: torcheIcone2, LUMIERE, TETE };
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
function snowPan(A, B, C, D, k = 0.8, glacons = false) {
  const n = Math.max(3, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 9));
  const low = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, kk = k + (i % 2 ? 0.06 : -0.04);
    return lerp(lerp(A, D, kk), lerp(B, C, kk), t);
  });
  const up = [[A[0], A[1] - 1.6], [B[0], B[1] - 1.6]];
  let d = `M${fmt(up[0][0])},${fmt(up[0][1])} L${fmt(up[1][0])},${fmt(up[1][1])} L${fmt(low[n][0])},${fmt(low[n][1])}`;
  for (let i = n - 1; i >= 0; i--) {
    const p = low[i], q = low[i + 1], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 1.4];
    d += ` Q${fmt(m[0])},${fmt(m[1])} ${fmt(p[0])},${fmt(p[1])}`;
  }
  d += " Z";
  const sh = low.map(([x, y]) => [x, y + 1.2]);
  let o = `<polyline points="${pts(sh)}" fill="none" stroke="${NEIGE.shade}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="${NEIGE.light}"${EDGE}/>`;
  if (glacons) {
    const m = Math.max(2, Math.round(Math.hypot(C[0] - D[0], C[1] - D[1]) / 7));
    for (let i = 0; i < m; i++) {
      const t = (i + 0.5) / m, [x, y] = lerp(D, C, t), l = 2.6 + i * 7 % 3 * 0.9;
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

// atelier/port/src/world/palette.js
var WOOD = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
var WOOD_DARK = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
var STONE = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
var WALL = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
function pebble(u, v, s, color = STONE) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${x + s * 0.12}" cy="${y + s * 0.18}" rx="${s}" ry="${s * 0.62}" fill="${color.right}"/><ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * 0.66}" fill="${color.left}"/><ellipse cx="${x - s * 0.28}" cy="${y - s * 0.22}" rx="${s * 0.5}" ry="${s * 0.3}" fill="${color.top}"/>`;
}
__name(pebble, "pebble");
function planksLeft(u0, u1, vf, z0, z1, step = 6) {
  let out = "";
  for (let z = z0 + step; z < z1; z += step) {
    out += `<polyline points="${[P(u0, vf, z), P(u1, vf, z)].map((p) => p.join(",")).join(" ")}" stroke="rgba(70,40,20,.25)" stroke-width="0.8"/>`;
  }
  return out;
}
__name(planksLeft, "planksLeft");
function planksRight(uf, v0, v1, z0, z1, step = 6) {
  let out = "";
  for (let z = z0 + step; z < z1; z += step) {
    out += `<polyline points="${[P(uf, v0, z), P(uf, v1, z)].map((p) => p.join(",")).join(" ")}" stroke="rgba(40,20,10,.25)" stroke-width="0.8"/>`;
  }
  return out;
}
__name(planksRight, "planksRight");

// atelier/port/src/world/tiers/kit.js
var f2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var xy = /* @__PURE__ */ __name(([x, y]) => `${f2(x)},${f2(y)}`, "xy");
var ln = /* @__PURE__ */ __name((a, b, color, w = 1.2, extra = "") => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`, "ln");
var poly = /* @__PURE__ */ __name((points, fill, extra = "") => `<polygon points="${points.map(xy).join(" ")}" fill="${fill}"${extra}/>`, "poly");
var ell = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`, "dot");

// atelier/port/src/world/rareSprites.js
var CRESTS = {
  foyer: [[-34, -11], [-9, -56], [18, -61], [23, -106], [41, -124], [63, -161], [30, -169]],
  carriere: [[-2, -68], [0, -67], [19, -74], [0, -116], [0, -116], [1, -107], [14, -136]],
  bosquet: [[-2, -63], [0, -67], [0, -69], [2, -123], [3, -119], [3, -119], [10, -143]],
  puits: [[-15, -60], [0, -41], [-19, -57], [0, -57], [-3, -105], [0, -119], [0, -57]],
  potager: [[3, -37], [-7, -55], [-1, -61], [-14, -84], [0, -98], [0, -108], [-3, -86]],
  atelier: [[-25, -59], [-25, -71], [-25, -71], [-32, -87], [-2, -95], [0, -148], [0, -133]],
  ponton: [[-19, -26], [-23, -52], [-19, -51], [0, -93], [0, -93], [0, -93], [0, -93]]
};
var FORGE_CHIMNEYS = [[0.55, -0.05, 44], [0.55, -0.2, 58], [0.7, -0.34, 64], [0.91, -0.15, 96], [0.93, -0.15, 100], [0.93, -0.15, 108], [0.91, -0.15, 66]];
var crestOf = /* @__PURE__ */ __name((site, level) => CRESTS[site][Math.max(1, Math.min(level, 7)) - 1], "crestOf");
var half = /* @__PURE__ */ __name((level) => level >= 4 ? 1.5 : 1, "half");
var xy2 = /* @__PURE__ */ __name(([x, y]) => `${f2(x)},${f2(y)}`, "xy");
var shift = /* @__PURE__ */ __name((dx, dy, level) => [dx / 64 / half(level), -dx / 64 / half(level), -dy], "shift");
var sparkle = /* @__PURE__ */ __name((x, y, r, fill, o = 1) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x)},${f2(y)} ${f2(x + r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + r)} Q${f2(x)},${f2(y)} ${f2(x - r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - r)} Z" fill="${fill}" opacity="${f2(o)}"/>`, "sparkle");
var rand = /* @__PURE__ */ __name((k) => {
  const s = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}, "rand");
var frameOf = /* @__PURE__ */ __name((points, m = 4) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.floor(Math.min(...xs) - m);
  const y = Math.floor(Math.min(...ys) - m);
  return [x, y, Math.ceil(Math.max(...xs) + m) - x, Math.ceil(Math.max(...ys) + m) - y];
}, "frameOf");
var mover = /* @__PURE__ */ __name((size, draw, path, n = 0, fps = 0) => ({
  at: [0, 0],
  frame: [-size, -size, size * 2, size * 2],
  n,
  fps,
  draw,
  motion: /* @__PURE__ */ __name((t, level) => shift(...path(t, level), level), "motion")
}), "mover");
function garlandGeo(site, level) {
  const h = half(level);
  const [cx, cy] = crestOf(site, level);
  const poleH = level >= 4 ? 30 : 22;
  const poles = [[-0.95 * h, 0.95 * h], [0.95 * h, -0.95 * h]].map(([u, v]) => ({ u, v, top: P(u, v, poleH), base: P(u, v, 0) }));
  const high = cy < -40 ? [cx, cy + 2] : P(-0.85 * h, -0.85 * h, 44);
  return { high, poles, poleH, backPole: cy < -40 ? null : [-0.85 * h, -0.85 * h] };
}
__name(garlandGeo, "garlandGeo");
function chain(a, b, sag, n) {
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
  const at = /* @__PURE__ */ __name((t) => [0, 1].map((i) => (1 - t) * (1 - t) * a[i] + 2 * (1 - t) * t * c[i] + t * t * b[i]), "at");
  return { d: `M${xy2(a)} Q${xy2(c)} ${xy2(b)}`, points: Array.from({ length: n }, (_, k) => at((k + 1) / (n + 1))) };
}
__name(chain, "chain");
var pole = /* @__PURE__ */ __name((u, v, h) => box(u - 0.025, v - 0.025, u + 0.025, v + 0.025, 0, h, WOOD_DARK) + dot(...P(u, v, h + 1.2), 1.4, "#F2C04B"), "pole");
function garlandFrame(site, level) {
  const g = garlandGeo(site, level);
  return frameOf([g.high, ...g.poles.map((p) => p.top), ...g.poles.map((p) => p.base)], 10);
}
__name(garlandFrame, "garlandFrame");
function garland(site, level, n, hang, rope = "#5A4632") {
  const g = garlandGeo(site, level);
  let out = g.poles.map((p) => pole(p.u, p.v, g.poleH)).join("") + (g.backPole ? pole(g.backPole[0], g.backPole[1], 44) : "");
  g.poles.forEach((p, side) => {
    const { d, points } = chain(g.high, p.top, 12 + half(level) * 6, n);
    out += `<path d="${d}" fill="none" stroke="${rope}" stroke-width="0.7"/>`;
    points.forEach((pt, k) => {
      out += hang(pt, k + side * n);
    });
  });
  return out;
}
__name(garland, "garland");
var LAMPION_COLORS = ["#E2463A", "#F08A3A", "#F2C04B", "#C94FA0", "#E2463A"];
function lampion([x, y], k) {
  const c = LAMPION_COLORS[k % LAMPION_COLORS.length];
  return ln([x, y], [x, y + 2], "#5A4632", 0.5) + ell(x, y + 5.4, 2.7, 3.3, c, ' stroke="rgba(80,30,20,.45)" stroke-width="0.4"') + ln([x, y + 2.3], [x, y + 8.5], "rgba(80,30,20,.35)", 0.4) + `<rect x="${f2(x - 1.3)}" y="${f2(y + 1.7)}" width="2.6" height="0.9" fill="#3A2A1E"/><rect x="${f2(x - 1.3)}" y="${f2(y + 8.3)}" width="2.6" height="0.9" fill="#3A2A1E"/>` + ell(x - 0.9, y + 4.4, 0.8, 1.4, "rgba(255,240,200,.55)");
}
__name(lampion, "lampion");
var PENNANT_COLORS = ["#E2463A", "#FFFFFF", "#2F6FB0", "#F2C04B"];
var pennant = /* @__PURE__ */ __name(([x, y], k) => poly([[x - 2.6, y - 0.4], [x + 2.6, y + 0.4], [x + 0.2, y + 7]], PENNANT_COLORS[k % PENNANT_COLORS.length], ' stroke="rgba(40,30,20,.35)" stroke-width="0.4" stroke-linejoin="round"'), "pennant");
function butterfly(color, s = 1.5) {
  return (T2, level, f) => {
    const w = (f === 0 ? 3.2 : 1.3) * s;
    const edge = ' stroke="rgba(60,40,30,.55)" stroke-width="0.4"';
    return ell(-w * 0.75, -1.4 * s, w, 2.2 * s, color, edge) + ell(w * 0.75, -1.4 * s, w, 2.2 * s, color, edge) + ell(-w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"') + ell(w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"') + dot(-w * 0.8, -1.6 * s, 0.6 * s, "rgba(255,255,255,.7)") + dot(w * 0.8, -1.6 * s, 0.6 * s, "rgba(255,255,255,.7)") + ln([0, -2.4 * s], [0, 2 * s], "#3A2A1E", 0.8);
  };
}
__name(butterfly, "butterfly");
function gull(T2, level, f) {
  const up = f === 0;
  const y = up ? -3.6 : 1.6;
  const d = `M-9,${f2(y)} Q-4.5,${f2(up ? -4.6 : -0.6)} 0,0 Q4.5,${f2(up ? -4.6 : -0.6)} 9,${f2(y)}`;
  return `<path d="${d}" fill="none" stroke="#5A6878" stroke-width="2.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>` + ell(0, 0.4, 2.2, 1.4, "#FFFFFF", ' stroke="#5A6878" stroke-width="0.4"') + dot(1.9, 0.3, 0.6, "#F2A23C");
}
__name(gull, "gull");
function dragonfly(T2, level, f) {
  const w = f === 0 ? 4.2 : 2.6;
  return ell(-w * 0.6, -0.8, w * 0.6, 1, "rgba(200,240,255,.75)", ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"') + ell(w * 0.6, -0.8, w * 0.6, 1, "rgba(200,240,255,.75)", ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"') + ln([-0.2, -1.6], [0.6, 3.4], "#2F8FA8", 1.2) + dot(-0.3, -1.8, 0.9, "#1F6F86");
}
__name(dragonfly, "dragonfly");
var bee = /* @__PURE__ */ __name((T2, level, f) => ell(0, 0, 2.3, 1.6, "#F2C04B", ' stroke="#3A2A1E" stroke-width="0.4"') + ln([-0.4, -1.4], [-0.4, 1.4], "#3A2A1E", 0.8) + ln([0.8, -1.4], [0.8, 1.4], "#3A2A1E", 0.8) + ell(-0.3, -2.1, f === 0 ? 1.7 : 0.8, 1, "rgba(255,255,255,.9)"), "bee");
var glowDot = /* @__PURE__ */ __name((core, halo, s = 1) => () => dot(0, 0, 2.6 * s, halo) + dot(0, 0, 1.1 * s, core), "glowDot");
var petal = /* @__PURE__ */ __name((k) => () => ell(0, 0, 2.8, 1.5, k % 2 ? "#F7B6CC" : "#FCD3E1", ` transform="rotate(${k * 47 % 180})" stroke="rgba(200,110,140,.45)" stroke-width="0.3"`), "petal");
function fireflyAt(k, t, level) {
  const h = half(level);
  const [, cy] = crestOf("foyer", level);
  const x = Math.sin(t * 0.37 + k * 1.9) * 54 * h + Math.sin(t * 1.3 + k) * 5;
  const y = -12 - k % 3 * Math.min(18, -cy / 5) + Math.cos(t * 0.53 + k * 2.3) * 8 + Math.cos(t * 0.37 + k * 1.9) * 10 * h;
  return [x, y];
}
__name(fireflyAt, "fireflyAt");
var fireflyBlink = /* @__PURE__ */ __name((k, t) => 0.55 + 0.45 * Math.sin(t * 2.1 + k * 1.7), "fireflyBlink");
var BUTTERFLY_COLORS = ["#F28AB2", "#FFD45E", "#6FB7E6", "#FFFFFF", "#B9A0F0", "#F08A3A", "#F7A8C8"];
function roseBush(T2) {
  const [x, y] = T2.p(0, 0, 0);
  const colors = ["#F28AB2", "#FFFFFF", "#E2574C", "#F7A8C8", "#FFD45E"];
  let out = T2.shadow(0, 0, 0.22) + ell(x, y - 6, 10, 7, "#4F8F3A") + ell(x - 4, y - 8, 6.5, 5, "#6DB04F") + ell(x + 4, y - 9, 6, 4.5, "#7EC45B") + ell(x - 1, y - 12, 5, 3.6, "#8FCB6B");
  for (let i = 0; i < 9; i++) {
    const fx = x + (rand(i) - 0.5) * 16;
    const fy = y - 4 - rand(i + 20) * 10;
    out += dot(fx, fy, 1.7, colors[i % colors.length]) + dot(fx, fy, 0.6, "#FFF4C0");
  }
  return out;
}
__name(roseBush, "roseBush");
var papillons = {
  layers: [
    { at: [0.95, -0.95], frame: [-13, -22, 26, 26], draw: roseBush },
    ...BUTTERFLY_COLORS.map((color, k) => mover(8, butterfly(color), (t, level) => {
      const h = half(level);
      const [, cy] = crestOf("potager", level);
      return [Math.sin(t * 0.45 + k * 1.3) * 52 * h + Math.sin(t * 1.7 + k) * 5, cy * (0.25 + k % 3 * 0.22) - 6 * Math.sin(t * 0.9 + k * 2) + Math.cos(t * 0.45 + k * 1.3) * 12 * h];
    }, 2, 7 + k))
  ]
};
var SUNFLOWERS = [[-1, -0.62], [-1, -0.1], [-0.62, -1], [-0.1, -1], [-0.98, -0.98]];
function sunflower(x, y, h, s) {
  const top = y - h;
  let out = ln([x, y], [x + 1, top], "#4F8F3A", 1.5) + `<path d="M${f2(x + 0.4)},${f2(y - h * 0.4)} q-6,-3 -8,1 q5,2 8,-1 Z" fill="#6DB04F"/><path d="M${f2(x + 0.7)},${f2(y - h * 0.62)} q6,-3 8,1 q-5,2 -8,-1 Z" fill="#7EC45B"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    out += ell(x + 1 + Math.cos(a) * 4.6 * s, top + Math.sin(a) * 4.2 * s, 2.2 * s, 1.1 * s, i % 2 ? "#F2C04B" : "#FFD45E", ` transform="rotate(${f2(a * 180 / Math.PI)} ${f2(x + 1 + Math.cos(a) * 4.6 * s)} ${f2(top + Math.sin(a) * 4.2 * s)})"`);
  }
  out += dot(x + 1, top, 3.3 * s, "#7A4E2C") + dot(x + 0.4, top - 0.6, 1.6 * s, "#9A6A3C");
  return out;
}
__name(sunflower, "sunflower");
var tournesols = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: /* @__PURE__ */ __name((level) => frameOf(SUNFLOWERS.flatMap(([u, v]) => {
        const [x, y] = P(u * half(level), v * half(level));
        return [[x, y], [x, y - (level >= 4 ? 50 : 38)]];
      }), 12), "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => SUNFLOWERS.map(([u, v], k) => sunflower(...P(u * half(level), v * half(level)), (level >= 4 ? 40 : 30) + k % 2 * 6, level >= 4 ? 1.2 : 1)).join(""), "draw")
    },
    ...[0, 1].map((k) => mover(4, bee, (t, level) => {
      const h = half(level);
      return [-30 * h + Math.sin(t * 1.1 + k * 3) * 22 * h + Math.sin(t * 6 + k) * 1.5, -24 * h - 10 + Math.cos(t * 0.9 + k * 2) * 8];
    }, 2, 14))
  ]
};
function oreRock(x, y, s, k) {
  let out = `<path d="M${f2(x - 9 * s)},${f2(y)} L${f2(x - 7 * s)},${f2(y - 7 * s)} L${f2(x - 1 * s)},${f2(y - 11 * s)} L${f2(x + 6 * s)},${f2(y - 8 * s)} L${f2(x + 9 * s)},${f2(y)} Z" fill="#6E6A66" stroke="rgba(40,30,25,.4)" stroke-width="0.6" stroke-linejoin="round"/><path d="M${f2(x - 1 * s)},${f2(y - 11 * s)} L${f2(x + 6 * s)},${f2(y - 8 * s)} L${f2(x + 9 * s)},${f2(y)} L${f2(x + 1 * s)},${f2(y)} Z" fill="#4F4B48"/><polyline points="${xy2([x - 6 * s, y - 2 * s])} ${xy2([x - 3 * s, y - 6 * s])} ${xy2([x, y - 4 * s])} ${xy2([x + 4 * s, y - 8 * s])}" fill="none" stroke="#F2C04B" stroke-width="${f2(1.1 * s)}" stroke-linejoin="round"/>`;
  for (let i = 0; i < 3; i++) out += dot(x + (rand(k * 5 + i) - 0.5) * 12 * s, y - (2 + rand(k * 5 + i + 9) * 6) * s, 1 * s, "#FFE08A");
  return out;
}
__name(oreRock, "oreRock");
var GLINTS = [[-0.42, 0.3], [0.36, 0.22], [0.06, 0.55], [-0.2, 0.78], [0.45, 0.62], [-0.55, 0.62], [0.12, 0.08]];
var glintAt = /* @__PURE__ */ __name((k, level) => {
  const [cx, cy] = crestOf("carriere", level);
  const [fx, fy] = GLINTS[k];
  return [cx * 0.4 + fx * 52 * half(level), cy * (1 - fy) - 6 * fy];
}, "glintAt");
var filonOr = {
  layers: [
    {
      at: [0.9, -0.9],
      frame: [-20, -22, 40, 26],
      draw: /* @__PURE__ */ __name((T2) => {
        const [x, y] = T2.p(0, 0, 0);
        let out = T2.shadow(0, 0, 0.3) + oreRock(x - 7, y + 1, 1, 1) + oreRock(x + 7, y + 2, 0.8, 2);
        for (let i = 0; i < 9; i++) out += ell(x - 5 + i % 4 * 3.4, y - 1 - Math.floor(i / 4) * 2.6, 2.2, 1.6, i % 2 ? "#F2C04B" : "#FFE08A", ' stroke="#A8782A" stroke-width="0.4"');
        return out + sparkle(x + 1, y - 10, 3, "#FFF6C8");
      }, "draw")
    },
    ...GLINTS.map((_, k) => ({
      at: [0, 0],
      n: 4,
      fps: 5,
      frame: /* @__PURE__ */ __name((level) => {
        const [x, y] = glintAt(k, level);
        return [Math.floor(x - 8), Math.floor(y - 8), 16, 16];
      }, "frame"),
      draw: /* @__PURE__ */ __name((T2, level, f, n) => {
        const [x, y] = glintAt(k, level);
        const phase = Math.sin((f + k) % n / n * Math.PI);
        return dot(x, y, 2.4 * phase + 0.4, "rgba(255,214,90,.45)") + sparkle(x, y, 2 + 4.5 * phase, "#FFF2B0", 0.45 + 0.55 * phase);
      }, "draw")
    }))
  ],
  lights: /* @__PURE__ */ __name((level) => {
    const [cx, cy] = crestOf("carriere", level);
    return [[cx * 0.3, cy * 0.45, 24, "255,210,90", 0.55]];
  }, "lights")
};
var CRACKS = [
  [[-1, 0.55], [-0.82, 0.38], [-0.86, 0.18], [-0.66, 0.02], [-0.7, -0.2]],
  [[0.55, -1], [0.38, -0.84], [0.2, -0.88], [0.04, -0.68], [-0.18, -0.72]],
  [[-0.98, -0.98], [-0.8, -0.82], [-0.82, -0.62]]
];
var LAVA_POOL = [0.86, -0.5];
var crackPath = /* @__PURE__ */ __name((crack, level) => crack.map(([u, v]) => xy2(P(u * half(level), v * half(level)))).join(" "), "crackPath");
var lavaBubble = /* @__PURE__ */ __name((T2, level, f, n) => {
  const [x, y] = T2.p(0, 0, 0);
  let out = "";
  for (let k = 0; k < 3; k++) {
    const p = (f + k * 1.4) % n / n;
    out += dot(x - 5 + k * 5, y - 1 - p * 4, 0.6 + p * 1.4, `rgba(255,220,120,${f2(1 - p)})`);
  }
  return out;
}, "lavaBubble");
var coeurLave = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: /* @__PURE__ */ __name((level) => frameOf([...CRACKS.flat(), [LAVA_POOL[0] + 0.3, LAVA_POOL[1]], [LAVA_POOL[0] - 0.3, LAVA_POOL[1]], [LAVA_POOL[0], LAVA_POOL[1] + 0.3], [LAVA_POOL[0], LAVA_POOL[1] - 0.3]].map(([u, v]) => P(u * half(level), v * half(level))), 6), "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => {
        const h = half(level);
        const [pu, pv] = [LAVA_POOL[0] * h, LAVA_POOL[1] * h];
        return CRACKS.map((crack) => {
          const pts2 = crackPath(crack, level);
          return `<polyline points="${pts2}" fill="none" stroke="#3A1A10" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts2}" fill="none" stroke="#FF7A2A" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts2}" fill="none" stroke="#FFD45E" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>`;
        }).join("") + disc(pu, pv, 0, 0.27, "#3A2620") + disc(pu, pv, 0.5, 0.22, "#E2501F") + disc(pu - 0.03, pv - 0.02, 0.8, 0.14, "#FF9A3A") + disc(pu - 0.05, pv - 0.03, 1, 0.07, "#FFD45E");
      }, "draw")
    },
    { at: LAVA_POOL, n: 6, fps: 6, frame: [-12, -10, 24, 13], draw: lavaBubble },
    ...[0, 1, 2].map((k) => mover(3, glowDot("#FFE08A", "rgba(255,120,40,.55)"), (t, level) => {
      const [x, y] = P(LAVA_POOL[0] * half(level), LAVA_POOL[1] * half(level));
      const p = (t * 0.3 + k / 3) % 1;
      return [x + Math.sin(t * 2 + k * 2) * 4 + (k - 1) * 4, y - 4 - p * 34];
    }))
  ],
  lights: /* @__PURE__ */ __name((level) => {
    const h = half(level);
    const [px, py] = P(LAVA_POOL[0] * h, LAVA_POOL[1] * h);
    const [lx, ly] = P(-0.8 * h, 0.2 * h);
    return [[px, py - 3, 26, "255,110,40", 1], [lx, ly, 16, "255,120,50", 0.7]];
  }, "lights")
};
var FAIRY = [[-30, 20], [-12, 32], [14, 26], [32, 16], [-22, 46], [24, 42]];
var fairyAt = /* @__PURE__ */ __name((k, level) => {
  const [cx, cy] = crestOf("bosquet", level);
  const h = half(level);
  return [cx + FAIRY[k][0] * h, cy + FAIRY[k][1] * h];
}, "fairyAt");
var fairyLantern = /* @__PURE__ */ __name(([x, y]) => ln([x, y - 10], [x, y - 3.6], "rgba(60,50,70,.7)", 0.6) + `<path d="M${f2(x - 2.6)},${f2(y - 3.6)} L${f2(x + 2.6)},${f2(y - 3.6)} L${f2(x + 2)},${f2(y + 3.4)} L${f2(x - 2)},${f2(y + 3.4)} Z" fill="#E6DCFF" stroke="#4A3A66" stroke-width="0.6" stroke-linejoin="round"/>` + dot(x, y, 1.6, "#FFFFFF") + `<path d="M${f2(x - 3.1)},${f2(y - 3.6)} L${f2(x)},${f2(y - 6)} L${f2(x + 3.1)},${f2(y - 3.6)} Z" fill="#4A3A66"/>`, "fairyLantern");
var MUSHROOMS = [[-0.92, 0.82], [-0.78, 0.94], [-0.96, 0.62], [-0.66, 0.84], [-0.84, 0.7]];
var fairyAt3 = /* @__PURE__ */ __name((k, t, level) => {
  const h = half(level);
  const [cx, cy] = crestOf("bosquet", level);
  const a = t * (0.5 + k * 0.12) + k * 2.1;
  return [cx + Math.cos(a) * (36 + k * 6) * h, cy + 34 * h + Math.sin(a) * 14 * h + Math.sin(t * 2.3 + k) * 3];
}, "fairyAt3");
var fairy = /* @__PURE__ */ __name((T2, level, f) => {
  const w = f === 0 ? 3 : 1.6;
  return ell(-w, -1.2, w, 1.8, "rgba(225,240,255,.8)", ' stroke="rgba(120,140,200,.6)" stroke-width="0.3"') + ell(w, -1.2, w, 1.8, "rgba(225,240,255,.8)", ' stroke="rgba(120,140,200,.6)" stroke-width="0.3"') + dot(0, 0, 2.6, "rgba(200,170,255,.55)") + dot(0, 0, 1.2, "#FFFFFF");
}, "fairy");
function mushroom(x, y, s, k) {
  const cap = k % 2 ? "#B9A0F0" : "#9FD3F2";
  return ln([x, y], [x, y - 4 * s], "#F4EEDC", 1.6 * s) + `<path d="M${f2(x - 3.6 * s)},${f2(y - 3.6 * s)} Q${f2(x)},${f2(y - 9 * s)} ${f2(x + 3.6 * s)},${f2(y - 3.6 * s)} Z" fill="${cap}" stroke="rgba(60,40,90,.4)" stroke-width="0.4"/>` + dot(x - 1.2 * s, y - 5.6 * s, 0.6 * s, "#FFFFFF") + dot(x + 1.4 * s, y - 5 * s, 0.5 * s, "#FFFFFF");
}
__name(mushroom, "mushroom");
var fees = {
  layers: [
    {
      at: [0, 0],
      frame: /* @__PURE__ */ __name((level) => frameOf(MUSHROOMS.map(([u, v]) => P(u * half(level), v * half(level))).flatMap(([x, y]) => [[x, y - 12], [x, y + 2]]), 6), "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => MUSHROOMS.map(([u, v], k) => mushroom(...P(u * half(level), v * half(level)), (level >= 4 ? 1.2 : 1) * (k % 3 ? 0.85 : 1.1), k)).join(""), "draw")
    },
    {
      at: [0, 0],
      frame: /* @__PURE__ */ __name((level) => frameOf(FAIRY.map((_, k) => fairyAt(k, level)).flatMap(([x, y]) => [[x, y - 11], [x, y + 4]]), 4), "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => FAIRY.map((_, k) => fairyLantern(fairyAt(k, level))).join(""), "draw"),
      motion: /* @__PURE__ */ __name((t) => [Math.sin(t * 1.2) * 8e-3, -Math.sin(t * 1.2) * 8e-3, 0], "motion")
    },
    ...[0, 1, 2].map((k) => mover(5, fairy, (t, level) => fairyAt3(k, t, level), 2, 9))
  ],
  lights: /* @__PURE__ */ __name((level, t) => [
    ...FAIRY.map((_, k) => [...fairyAt(k, level), 10, "205,175,255", 0.85]),
    ...[0, 1, 2].map((k) => [...fairyAt3(k, t, level), 9, "225,215,255", 0.8]),
    [...P(-0.84 * half(level), 0.8 * half(level)), 14, "150,230,255", 0.7]
  ], "lights")
};
function petalCarpet(level, front) {
  const h = half(level);
  let out = "";
  for (let k = 0; k < 40; k++) {
    const a = rand(k) * Math.PI * 2;
    const r = 0.6 + rand(k + 40) * 0.4;
    const u = Math.cos(a) * r * h;
    const v = Math.sin(a) * r * h;
    if (u + v > 0 !== front) continue;
    const [x, y] = P(u, v);
    out += ell(x, y, 2.6, 1.2, k % 3 ? "#F7B6CC" : "#FCD3E1", ` transform="rotate(${Math.round(rand(k + 80) * 180)} ${f2(x)} ${f2(y)})" stroke="rgba(200,110,140,.3)" stroke-width="0.3"`);
  }
  return out;
}
__name(petalCarpet, "petalCarpet");
var footprintFrame = /* @__PURE__ */ __name((level) => frameOf([P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)].map(([x, y]) => [x * half(level), y * half(level)]), 4), "footprintFrame");
var petales = {
  layers: [
    { at: [0, 0], back: true, frame: footprintFrame, draw: /* @__PURE__ */ __name((T2, level) => petalCarpet(level, false), "draw") },
    { at: [0, 0], frame: footprintFrame, draw: /* @__PURE__ */ __name((T2, level) => petalCarpet(level, true), "draw") },
    ...Array.from({ length: 12 }, (_, k) => mover(4, petal(k), (t, level) => {
      const h = half(level);
      const [cx, cy] = crestOf("bosquet", level);
      const p = (t * 0.11 + k / 12) % 1;
      const x0 = cx + (rand(k + 7) - 0.5) * 80 * h;
      return [x0 + Math.sin(t * 1.3 + k) * 6 + p * 10, cy + 18 + p * (-cy - 4 + (rand(k + 3) - 0.3) * 20 * h)];
    }))
  ]
};
var RAINBOW = ["#E2463A", "#F08A3A", "#F2C04B", "#7EC45B", "#5AAED7", "#5C6FC2", "#9C6FD0"];
var rainbowGeo = /* @__PURE__ */ __name((level) => {
  const [, cy] = crestOf("puits", level);
  const h = half(level);
  return { rx: 62 * h, ry: Math.max(-cy + 22, 56 * h), base: -6 * h };
}, "rainbowGeo");
var arcEnCiel = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: /* @__PURE__ */ __name((level) => {
        const g = rainbowGeo(level);
        return frameOf([[-g.rx, g.base], [g.rx, g.base], [0, g.base - g.ry]], 6);
      }, "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => {
        const g = rainbowGeo(level);
        const w = 2.4 * half(level);
        return RAINBOW.map((c, i) => {
          const rx = g.rx - i * w;
          const ry = g.ry - i * w;
          return `<path d="M${f2(-rx)},${f2(g.base)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(rx)},${f2(g.base)}" fill="none" stroke="${c}" stroke-width="${f2(w + 0.2)}" opacity=".62"/>`;
        }).join("");
      }, "draw")
    },
    ...[0, 1, 2].map((k) => ({
      at: [0, 0],
      n: 4,
      fps: 4,
      frame: /* @__PURE__ */ __name((level) => {
        const g = rainbowGeo(level);
        const [x, y] = [[-g.rx, g.base - 2], [g.rx, g.base - 2], [g.rx * 0.5, g.base - g.ry * 0.87]][k];
        return [Math.floor(x - 7), Math.floor(y - 7), 14, 14];
      }, "frame"),
      draw: /* @__PURE__ */ __name((T2, level, f, n) => {
        const g = rainbowGeo(level);
        const [x, y] = [[-g.rx, g.base - 2], [g.rx, g.base - 2], [g.rx * 0.5, g.base - g.ry * 0.87]][k];
        const p = Math.sin((f + k) % n / n * Math.PI);
        return sparkle(x, y, 2 + 3.5 * p, "#FFFFFF", 0.4 + 0.6 * p);
      }, "draw")
    }))
  ]
};
var POND = [1, -1];
var nenuphars = {
  layers: [
    {
      at: POND,
      back: true,
      frame: [-26, -14, 52, 28],
      draw: /* @__PURE__ */ __name((T2) => {
        const pad = /* @__PURE__ */ __name((du, dv, s) => {
          const [x, y] = T2.p(du, dv, 0.6);
          return `<path d="M${f2(x)},${f2(y)} L${f2(x + 3.4 * s)},${f2(y - 1.2 * s)} A${f2(3.6 * s)},${f2(1.9 * s)} 0 1 1 ${f2(x + 3.4 * s)},${f2(y + 1.2 * s)} Z" fill="#6DB04F" stroke="#4F8F3A" stroke-width="0.4"/>`;
        }, "pad");
        const lotus = /* @__PURE__ */ __name((du, dv) => {
          const [x, y] = T2.p(du, dv, 1.2);
          return ell(x - 1.4, y - 1, 1.3, 2.1, "#F7A8C8", ' transform="rotate(-25 ' + f2(x - 1.4) + " " + f2(y - 1) + ')"') + ell(x + 1.4, y - 1, 1.3, 2.1, "#F7A8C8", ' transform="rotate(25 ' + f2(x + 1.4) + " " + f2(y - 1) + ')"') + ell(x, y - 1.6, 1.2, 2.3, "#FCD3E1") + dot(x, y - 0.4, 0.8, "#FFD45E");
        }, "lotus");
        return T2.disc(0, 0, 0, 0.36, "#B9B2A2") + T2.disc(0, 0, 0.3, 0.32, "#5AAED7") + T2.disc(-0.04, -0.03, 0.4, 0.2, "#86C6E6") + pad(-0.14, 0.08, 1) + pad(0.12, -0.12, 0.9) + pad(0.06, 0.16, 0.8) + pad(-0.18, -0.12, 0.75) + lotus(-0.1, 0.06) + lotus(0.14, -0.1);
      }, "draw")
    },
    ...[0, 1].map((k) => mover(6, dragonfly, (t, level) => {
      const [x, y] = P(POND[0] * half(level), POND[1] * half(level));
      return [x + Math.sin(t * (0.8 + k * 0.3) + k * 3) * 16 + Math.sin(t * 3.1 + k) * 2, y - 10 - k * 5 + Math.cos(t * (0.9 + k * 0.2) + k) * 5];
    }, 2, 16))
  ]
};
var pavois = {
  layers: [{
    at: [0, 0],
    frame: /* @__PURE__ */ __name((level) => garlandFrame("ponton", level), "frame"),
    draw: /* @__PURE__ */ __name((T2, level) => garland("ponton", level, 7, pennant, "#3A2A1E"), "draw"),
    motion: /* @__PURE__ */ __name((t) => [Math.sin(t * 2.2) * 6e-3, -Math.sin(t * 2.2) * 6e-3, Math.sin(t * 1.7) * 0.5], "motion")
  }]
};
var perchedGull = /* @__PURE__ */ __name((T2, level, f) => {
  const [x, y] = crestOf("ponton", level);
  const look = f === 3 ? -1 : 1;
  return ell(x, y - 3.2, 3.4, 2.2, "#FFFFFF", ' stroke="rgba(70,80,95,.5)" stroke-width="0.4"') + `<path d="M${f2(x - 3)},${f2(y - 3.6)} Q${f2(x - 0.5)},${f2(y - 5.6)} ${f2(x + 1.8)},${f2(y - 3.4)} Z" fill="#B8C2CC"/>` + dot(x + 2.4 * look, y - 5.6, 1.6, "#FFFFFF") + dot(x + 2.9 * look, y - 5.9, 0.4, "#2A2A2A") + poly([[x + 3.8 * look, y - 5.8], [x + 5.6 * look, y - 5.4], [x + 3.8 * look, y - 5.1]], "#F2A23C") + ln([x - 0.6, y - 1.2], [x - 0.6, y + 0.4], "#F2A23C", 0.5) + ln([x + 0.8, y - 1.2], [x + 0.8, y + 0.4], "#F2A23C", 0.5);
}, "perchedGull");
var mouettes = {
  layers: [
    {
      at: [0, 0],
      n: 4,
      fps: 0.7,
      frame: /* @__PURE__ */ __name((level) => {
        const [x, y] = crestOf("ponton", level);
        return [Math.floor(x - 8), Math.floor(y - 10), 16, 12];
      }, "frame"),
      draw: perchedGull
    },
    ...[0, 1, 2].map((k) => mover(11, gull, (t, level) => {
      const h = half(level);
      const [cx, cy] = crestOf("ponton", level);
      const a = t * (0.42 + k * 0.07) + k * 2.1;
      return [cx + Math.cos(a) * (34 + k * 8) * h, cy - 22 - k * 6 + Math.sin(a) * 10 * h];
    }, 2, 5 + k))
  ]
};
var chimneyAt = /* @__PURE__ */ __name((level) => P(...FORGE_CHIMNEYS[Math.max(1, Math.min(level, 7)) - 1]), "chimneyAt");
var sparks = /* @__PURE__ */ __name((T2, level, f, n) => {
  const [x, y] = chimneyAt(level);
  let out = dot(x, y - 1, 4, "rgba(255,170,60,.35)") + dot(x, y - 1, 2, "rgba(255,230,150,.7)");
  for (let k = 0; k < 16; k++) {
    const p = (f / n + k / 16) % 1;
    const vx = (rand(k) - 0.5) * 46;
    const up = 38 + rand(k + 9) * 14;
    const at = /* @__PURE__ */ __name((q) => [x + vx * q, y - up * q + 34 * q * q], "at");
    const [sx, sy] = at(p);
    const [tx, ty] = at(Math.max(0, p - 0.06));
    out += ln([tx, ty], [sx, sy], p < 0.45 ? "#FFE08A" : "#F08A3A", 1.5 * (1 - p) + 0.5) + dot(sx, sy, 0.9 * (1 - p) + 0.4, "#FFF6D0");
  }
  return out;
}, "sparks");
var etincelles = {
  layers: [{
    at: [0, 0],
    n: 6,
    fps: 10,
    frame: /* @__PURE__ */ __name((level) => {
      const [x, y] = chimneyAt(level);
      return [Math.floor(x - 28), Math.floor(y - 30), 56, 40];
    }, "frame"),
    draw: sparks
  }],
  lights: /* @__PURE__ */ __name((level) => {
    const [x, y] = chimneyAt(level);
    return [[x, y - 6, 18, "255,170,60", 1]];
  }, "lights")
};
function gearPath(x, y, r, teeth, turn) {
  const pts2 = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = turn + i / (teeth * 2) * Math.PI * 2;
    const rr = i % 2 ? r : r * 1.22;
    pts2.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92]);
  }
  return `<polygon points="${pts2.map(xy2).join(" ")}" fill="#F2C04B" stroke="#A8782A" stroke-width="0.6" stroke-linejoin="round"/>` + dot(x, y, r * 0.55, "#FFE08A") + dot(x, y, r * 0.22, "#A8782A");
}
__name(gearPath, "gearPath");
var gears = /* @__PURE__ */ __name((T2, level, f, n) => {
  const [x, y] = crestOf("atelier", level);
  const turn = f / n * (Math.PI * 2 / 10);
  return ln([x, y], [x, y - 12], "#5A4632", 1.4) + gearPath(x, y - 21, 10, 10, turn) + gearPath(x + 15, y - 16.4, 5.6, 6, -turn * (10 / 6) + 0.3);
}, "gears");
var engrenages = {
  layers: [{
    at: [0, 0],
    n: 6,
    fps: 6,
    frame: /* @__PURE__ */ __name((level) => {
      const [x, y] = crestOf("atelier", level);
      return [Math.floor(x - 15), Math.floor(y - 35), 38, 37];
    }, "frame"),
    draw: gears
  }],
  lights: /* @__PURE__ */ __name((level) => {
    const [x, y] = crestOf("atelier", level);
    return [[x + 4, y - 20, 14, "255,215,120", 0.5]];
  }, "lights")
};
var lampions = {
  layers: [{
    at: [0, 0],
    frame: /* @__PURE__ */ __name((level) => garlandFrame("foyer", level), "frame"),
    draw: /* @__PURE__ */ __name((T2, level) => garland("foyer", level, 5, lampion), "draw"),
    motion: /* @__PURE__ */ __name((t) => [0, 0, Math.sin(t * 1.6) * 0.6], "motion")
  }],
  lights: /* @__PURE__ */ __name((level) => {
    const g = garlandGeo("foyer", level);
    return [g.high, ...g.poles.map((p) => chain(g.high, p.top, 12 + half(level) * 6, 5).points[2])].map(([x, y]) => [x, y + 5, 16, "255,150,80", 0.9]);
  }, "lights")
};
var TRELLIS = { v: -0.94, u0: 0.42, u1: 0.98 };
function ivyTrellis(level) {
  const h = half(level);
  const { v, u0, u1 } = { v: TRELLIS.v * h, u0: TRELLIS.u0 * h, u1: TRELLIS.u1 * h };
  const hz = level >= 4 ? 40 : 30;
  let out = box(u0 - 0.03, v - 0.03, u0 + 0.03, v + 0.03, 0, hz, WOOD_DARK) + box(u1 - 0.03, v - 0.03, u1 + 0.03, v + 0.03, 0, hz, WOOD_DARK);
  for (let i = 0; i <= 4; i++) {
    const a = u0 + (u1 - u0) * i / 4;
    out += ln(P(a, v, 0), P(Math.min(u1, a + (u1 - u0) / 2), v, hz * Math.min(1, (u1 - a) / (u1 - u0) * 2)), "#A9703F", 0.9) + ln(P(a, v, 0), P(Math.max(u0, a - (u1 - u0) / 2), v, hz * Math.min(1, (a - u0) / (u1 - u0) * 2)), "#A9703F", 0.9);
  }
  out += ln(P(u0, v, hz), P(u1, v, hz), "#8B5631", 1.4);
  for (let i = 0; i < 34; i++) {
    const t = rand(i);
    const z = hz * Math.pow(rand(i + 50), 0.8);
    const [x, y] = P(u0 + (u1 - u0) * t, v, z);
    out += ell(x, y, 2.6, 1.9, ["#3E7A30", "#4F8F3A", "#6DB04F"][i % 3], ` transform="rotate(${Math.round(rand(i + 9) * 60 - 30)} ${f2(x)} ${f2(y)})"`);
  }
  for (let i = 0; i < 4; i++) {
    const [x, y] = P(u0 + (u1 - u0) * (0.15 + i * 0.24), v, hz);
    out += `<path d="M${f2(x)},${f2(y)} q1.5,5 -0.5,${f2(7 + rand(i) * 6)}" fill="none" stroke="#3E7A30" stroke-width="0.8"/>` + ell(x - 0.3, y + 7 + rand(i) * 5, 1.6, 1.2, "#4F8F3A");
  }
  return out;
}
__name(ivyTrellis, "ivyTrellis");
var lierre = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: /* @__PURE__ */ __name((level) => {
        const h = half(level);
        const hz = level >= 4 ? 40 : 30;
        return frameOf([P(TRELLIS.u0 * h, TRELLIS.v * h, hz), P(TRELLIS.u1 * h, TRELLIS.v * h, hz), P(TRELLIS.u0 * h, TRELLIS.v * h, 0), P(TRELLIS.u1 * h, TRELLIS.v * h, 0)], 8);
      }, "frame"),
      draw: /* @__PURE__ */ __name((T2, level) => ivyTrellis(level), "draw")
    },
    ...Array.from({ length: 6 }, (_, k) => mover(4, glowDot("#FFFBD0", "rgba(210,255,120,.65)", 1.4), (t, level) => fireflyAt(k, t, level)))
  ],
  lights: /* @__PURE__ */ __name((level, t) => Array.from({ length: 6 }, (_, k) => [...fireflyAt(k, t, level), 8, "210,255,120", fireflyBlink(k, t)]), "lights")
};
var RARE_SPRITES = {
  papillons,
  tournesols,
  "filon-or": filonOr,
  "coeur-lave": coeurLave,
  fees,
  petales,
  "arc-en-ciel": arcEnCiel,
  nenuphars,
  pavois,
  mouettes,
  etincelles,
  engrenages,
  lampions,
  lierre
};

// atelier/port/src/world/shopSprites.js
var IRON = { top: "#B4BEC8", left: "#8E99A4", right: "#68737E" };
var DARK_IRON = { top: "#77818B", left: "#5A636C", right: "#41484F" };
var COPPER = { top: "#F4B07A", left: "#D9844E", right: "#A85C31" };
var STRAW = { top: "#F3DE97", left: "#E2C66E", right: "#C4A24E" };
var STUMP = { top: "#E7C08A", left: WOOD.left, right: WOOD.right };
var BARK = { top: "#A8743F", left: "#8B5631", right: "#F1D3A1" };
var BARN = { top: "#E08A70", left: "#C85F46", right: "#A04634" };
var CAST = { top: "#6E9C83", left: "#4F7D66", right: "#355A49" };
var PAIL = { top: "#B98552", left: WOOD.left, right: WOOD.right };
var OUT = "#3C2819";
var f22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var xy3 = /* @__PURE__ */ __name(([x, y]) => `${f22(x)},${f22(y)}`, "xy");
var ln2 = /* @__PURE__ */ __name((a, b, color, w = 1.2, extra = "") => `<line x1="${f22(a[0])}" y1="${f22(a[1])}" x2="${f22(b[0])}" y2="${f22(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`, "ln");
var poly2 = /* @__PURE__ */ __name((points, fill, extra = "") => `<polygon points="${points.map(xy3).join(" ")}" fill="${fill}"${extra}/>`, "poly");
var ell2 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${f22(rx)}" ry="${f22(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot2 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r)}" fill="${fill}"/>`, "dot");
var wave = /* @__PURE__ */ __name((f, n, amp = 1, phase = 0) => Math.sin(f / n * Math.PI * 2 + phase) * amp, "wave");
var star = /* @__PURE__ */ __name((x, y, r, fill, o = 1) => `<path d="M${f22(x)},${f22(y - r)} Q${f22(x)},${f22(y)} ${f22(x + r)},${f22(y)} Q${f22(x)},${f22(y)} ${f22(x)},${f22(y + r)} Q${f22(x)},${f22(y)} ${f22(x - r)},${f22(y)} Q${f22(x)},${f22(y)} ${f22(x)},${f22(y - r)} Z" fill="${fill}" opacity="${f22(o)}"/>`, "star");
var gradient = /* @__PURE__ */ __name((id, from, to) => `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`, "gradient");
function tools(u, v, prefix) {
  const p = /* @__PURE__ */ __name((du = 0, dv = 0, z = 0) => P(u + du, v + dv, z), "p");
  return {
    p,
    u,
    v,
    box: /* @__PURE__ */ __name((a, b, c, d, z0, z1, colors, edge) => box(u + a, v + b, u + c, v + d, z0, z1, colors, edge), "box"),
    gable: /* @__PURE__ */ __name((a, b, c, d, z, h, colors, o, edge) => gable(u + a, v + b, u + c, v + d, z, h, colors, o, edge), "gable"),
    cyl: /* @__PURE__ */ __name((du, dv, z0, z1, r, colors, name) => cylinder(u + du, v + dv, z0, z1, r, colors, `${prefix}-${name}`), "cyl"),
    disc: /* @__PURE__ */ __name((du, dv, z, r, fill, extra) => disc(u + du, v + dv, z, r, fill, extra), "disc"),
    face: /* @__PURE__ */ __name((pts2, fill, extra) => face(pts2.map(([a, b, z]) => [u + a, v + b, z]), fill, extra), "face"),
    shadow: /* @__PURE__ */ __name((du, dv, r, o = 0.22, z = 0) => disc(u + du + 0.1, v + dv + 0.02, z, r, `rgba(40,55,20,${o})`), "shadow"),
    pebble: /* @__PURE__ */ __name((du, dv, s, color) => pebble(u + du, v + dv, s, color), "pebble"),
    id: /* @__PURE__ */ __name((name) => `${prefix}-${name}`, "id")
  };
}
__name(tools, "tools");
function wheel(T2, du, dv, zc, r, axis, { rim = WOOD_DARK.right, spokes = 6, turn = 0, width = 1.6 } = {}) {
  const pt = /* @__PURE__ */ __name((a) => axis === "u" ? T2.p(du + r * Math.cos(a), dv, zc + 32 * r * Math.sin(a)) : T2.p(du, dv + r * Math.cos(a), zc + 32 * r * Math.sin(a)), "pt");
  const ring = Array.from({ length: 20 }, (_, k) => pt(k / 20 * Math.PI * 2));
  const c = T2.p(du, dv, zc);
  let out = `<polygon points="${ring.map(xy3).join(" ")}" fill="rgba(0,0,0,.08)" stroke="${rim}" stroke-width="${width}" stroke-linejoin="round"/>`;
  for (let k = 0; k < spokes; k++) out += ln2(c, pt(turn + k / spokes * Math.PI * 2), rim, 0.8);
  return out + dot2(c[0], c[1], 1.3, rim);
}
__name(wheel, "wheel");
function bucket(T2, du, dv, z, h, r0, r1, colors, name, water = true) {
  const [x, y] = T2.p(du, dv, z);
  const top = y - h;
  return `<defs><linearGradient id="${T2.id(name)}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs><path d="M${f22(x - r1)},${f22(top)} L${f22(x - r0)},${f22(y)} A${f22(r0)},${f22(r0 / 2)} 0 0 0 ${f22(x + r0)},${f22(y)} L${f22(x + r1)},${f22(top)} Z" fill="url(#${T2.id(name)})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x - r1 * 0.96)},${f22(top + h * 0.3)} A${f22(r1 * 0.96)},${f22(r1 / 2)} 0 0 0 ${f22(x + r1 * 0.96)},${f22(top + h * 0.3)}" fill="none" stroke="#3C2819" stroke-width="0.9"/><path d="M${f22(x - r0 * 1.04)},${f22(y - h * 0.22)} A${f22(r0 * 1.04)},${f22(r0 / 2)} 0 0 0 ${f22(x + r0 * 1.04)},${f22(y - h * 0.22)}" fill="none" stroke="#3C2819" stroke-width="0.9"/>` + ell2(x, top, r1, r1 / 2, colors.top, ` stroke="${OUT}" stroke-width="0.6"`) + (water ? ell2(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#4C9CC8") + ell2(x - r1 * 0.25, top, r1 * 0.3, r1 * 0.12, "rgba(255,255,255,.55)") : ell2(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#3A2A1E"));
}
__name(bucket, "bucket");
function stone(x, y, s, c) {
  return ell2(x + s * 0.1, y + s * 0.2, s, s * 0.65, c.right) + ell2(x, y, s, s * 0.66, c.left) + ell2(x - s * 0.3, y - s * 0.25, s * 0.5, s * 0.3, c.top);
}
__name(stone, "stone");
function hen(x, y, { flip = false, peck = 0, step = 0, color = "#FFFDF8", wing = "#E9DFCB" } = {}) {
  const s = flip ? -1 : 1;
  const hx = x + s * (4.6 + peck * 1.8);
  const hy = y - 12.5 + peck * 7;
  const X = /* @__PURE__ */ __name((dx) => f22(x + s * dx), "X");
  const Y = /* @__PURE__ */ __name((dy) => f22(y + dy), "Y");
  return ell2(x, y + 0.3, 5.4, 1.5, "rgba(40,55,20,.25)") + ln2([x - s * 1.2, y - 3], [x - s * 1.6 + step, y], "#E39A33", 1) + ln2([x + s * 1.6, y - 3], [x + s * 2 - step, y], "#E39A33", 1) + `<path d="M${X(-4)},${Y(-7)} L${X(-8.2)},${Y(-13)} L${X(-6.4)},${Y(-7.5)} L${X(-8.8)},${Y(-10)} L${X(-5)},${Y(-5.5)} Z" fill="${wing}"/><path d="M${X(-6.5)},${Y(-7.5)} Q${X(-6)},${Y(-12)} ${X(-1.5)},${Y(-11)} Q${X(2.5)},${Y(-11.5)} ${X(4.6)},${Y(-8.6)} Q${X(5.6)},${Y(-4)} ${X(1)},${Y(-2.6)} Q${X(-4.6)},${Y(-2.2)} ${X(-6.5)},${Y(-7.5)} Z" fill="${color}" stroke="rgba(60,40,25,.5)" stroke-width="0.6"/><path d="M${X(-3.6)},${Y(-7.6)} Q${X(-0.5)},${Y(-10.2)} ${X(2.4)},${Y(-7)} Q${X(-0.4)},${Y(-4.6)} ${X(-3.6)},${Y(-7.6)} Z" fill="${wing}"/><path d="M${X(2.6)},${Y(-9.4)} L${f22(hx - s * 1.4)},${f22(hy + 1.6)} L${f22(hx + s * 1.2)},${f22(hy + 2)} L${X(4.8)},${Y(-7.8)} Z" fill="${color}"/>` + dot2(hx, hy, 2.7, color) + `<path d="M${f22(hx - s * 1.6)},${f22(hy - 2.2)} q${s * 0.5},-2.2 ${s * 1.4},-0.6 q${s * 0.6},-2 ${s * 1.4},-0.2 q${s * 0.9},-1.4 ${s * 1.3},0.4 Z" fill="#E2463A"/><path d="M${f22(hx + s * 2.5)},${f22(hy - 0.6)} l${s * 2.4},0.9 l${-s * 2.4},0.9 Z" fill="#E8A13A"/>` + ell2(hx + s * 1.9, hy + 2, 0.8, 1.2, "#E2463A") + dot2(hx + s * 0.9, hy - 0.5, 0.65, "#2A2420");
}
__name(hen, "hen");
function chick(x, y, hop = 0) {
  return ell2(x, y + 0.2, 2.4, 0.8, "rgba(40,55,20,.22)") + dot2(x, y - 2.6 - hop, 2.3, "#FFE07A") + dot2(x + 1.6, y - 4.6 - hop, 1.5, "#FFE07A") + `<path d="M${f22(x + 3)},${f22(y - 4.8 - hop)} l1.2,0.4 l-1.2,0.4 Z" fill="#E8A13A"/>` + dot2(x + 2, y - 5 - hop, 0.4, "#2A2420");
}
__name(chick, "chick");
function bee2(x, y, up) {
  const w = up ? -1.2 : 0.4;
  return `<ellipse cx="${f22(x - 1.2)}" cy="${f22(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up ? -25 : -5} ${f22(x - 1.2)} ${f22(y - 2 + w)})"/><ellipse cx="${f22(x + 1.2)}" cy="${f22(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up ? 25 : 5} ${f22(x + 1.2)} ${f22(y - 2 + w)})"/>` + ell2(x, y, 2.5, 1.7, "#FFD24E", ' stroke="#3C2819" stroke-width="0.4"') + `<rect x="${f22(x - 0.9)}" y="${f22(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/><rect x="${f22(x + 0.7)}" y="${f22(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/>`;
}
__name(bee2, "bee");
function bird(x, y, { body, breast, wing, flip = false, hop = 0, peck = 0, flap = 0 }) {
  const s = flip ? -1 : 1;
  const by = y - hop;
  const X = /* @__PURE__ */ __name((dx) => f22(x + s * dx), "X");
  const hx = 2.6 + peck * 0.8;
  const hy = -5.4 + peck * 2.6;
  return ell2(x, y + 0.4, 3.2, 0.9, `rgba(40,55,20,${f22(0.22 - hop * 0.03)})`) + ln2([x - s * 0.6, by - 1.4], [x - s * 0.8, y], "#7A5A3A", 0.6) + ln2([x + s * 0.8, by - 1.4], [x + s * 0.8, y], "#7A5A3A", 0.6) + `<path d="M${X(-3.4)},${f22(by - 3)} L${X(-6.4)},${f22(by - 4.8)} L${X(-5.6)},${f22(by - 2.4)} Z" fill="${body}"/>` + ell2(x, by - 3.4, 3.6, 2.6, body) + ell2(x + s * 1.2, by - 2.9, 2.2, 1.8, breast) + dot2(x + s * hx, by + hy, 2, body) + dot2(x + s * (hx + 0.4), by + hy + 0.8, 1.2, breast) + `<path d="M${X(hx + 1.8)},${f22(by + hy - 0.2)} l${s * 1.8},0.5 l${-s * 1.8},0.6 Z" fill="#3D3A36"/>` + dot2(x + s * (hx + 0.5), by + hy - 0.5, 0.5, "#1E1A17") + `<path d="M${X(-1.8)},${f22(by - 4)} q${-s * 1.6},${f22(-1.2 - flap * 2.4)} ${-s * 3.6},${f22(-0.6 - flap)}" stroke="${wing}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}
__name(bird, "bird");
var pelle = {
  layers: [{
    at: { 1: [0.6, -0.3], 2: [0.42, 0.58] },
    frame: [-12, -32, 26, 38],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 4);
      const [hx, hy] = [x + 4.2, y - 27];
      return ell2(x + 1, y + 1, 7.4, 2.6, "#5A3822") + `<path d="M${f22(x - 6.5)},${f22(y + 0.8)} q2,-3.8 6.4,-3.8 q4.6,0 6.4,3.4 Z" fill="#6B4329"/><path d="M${f22(x - 3.4)},${f22(y - 7.4)} L${f22(x + 3.2)},${f22(y - 8.4)} L${f22(x + 3)},${f22(y - 1.4)} Q${f22(x)},${f22(y + 1.4)} ${f22(x - 3)},${f22(y - 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="M${f22(x - 3.4)},${f22(y - 7.4)} L${f22(x - 3)},${f22(y - 0.6)} L${f22(x - 1.8)},${f22(y - 0.2)} L${f22(x - 2)},${f22(y - 7.6)} Z" fill="${IRON.top}"/><path d="M${f22(x + 0.4)},${f22(y - 8)} L${f22(x + 3.2)},${f22(y - 8.4)} L${f22(x + 3)},${f22(y - 1.4)} Q${f22(x + 1.6)},${f22(y)} ${f22(x + 0.6)},${f22(y)} Z" fill="${IRON.right}" opacity=".55"/><rect x="${f22(x - 1.1)}" y="${f22(y - 11)}" width="2.6" height="3.4" rx="0.6" fill="${IRON.right}" transform="rotate(8 ${f22(x)} ${f22(y - 9)})"/>` + ln2([x + 0.3, y - 10.5], [hx, hy + 3.4], WOOD.right, 2) + ln2([x + 0.1, y - 10.5], [hx - 0.4, hy + 3.4], WOOD.top, 0.7) + ln2([hx - 3, hy - 0.4], [hx + 3, hy - 1.6], WOOD.right, 1.9) + ln2([hx - 3, hy - 0.4], [hx - 0.5, hy + 3.6], WOOD.right, 1.2) + ln2([hx + 3, hy - 1.6], [hx + 0.6, hy + 3.4], WOOD.right, 1.2) + `<path d="M${f22(x - 4.4)},${f22(y + 1.2)} q4.4,-2.6 8.8,0 Z" fill="#7A4E30"/>` + dot2(x + 6.6, y - 0.2, 1.2, "#6B4329") + dot2(x - 6.8, y + 1.6, 0.9, "#7A4E30");
    }, "draw")
  }]
};
var arrosoir = {
  layers: [{
    at: [0.76, 0.76],
    frame: [-14, -26, 36, 32],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 4);
      const green = { top: "#B4DDB8", left: "#73B884", right: "#4A8A5B" };
      return ell2(x + 2, y + 1.2, 9, 2.6, "rgba(40,55,20,.25)") + `<path d="M${f22(x + 4)},${f22(y - 4)} L${f22(x + 13.5)},${f22(y - 14.6)} L${f22(x + 14.6)},${f22(y - 13.4)} L${f22(x + 5)},${f22(y - 2)} Z" fill="${green.right}"/><ellipse cx="${f22(x + 14.8)}" cy="${f22(y - 15)}" rx="2.8" ry="1.8" fill="${COPPER.left}" stroke="${COPPER.right}" stroke-width="0.6" transform="rotate(-42 ${f22(x + 14.8)} ${f22(y - 15)})"/>` + [[-0.8, -0.6], [0.5, 0.4], [-0.2, 0.9], [0.9, -0.5]].map(([dx, dy]) => dot2(x + 14.8 + dx, y - 15 + dy, 0.35, COPPER.right)).join("") + T2.cyl(0, 0, 4, 15, 0.085, green, "can") + `<path d="M${f22(x - 3.8)},${f22(y - 5.6)} A3.85,1.92 0 0 0 ${f22(x + 3.8)},${f22(y - 5.6)}" fill="none" stroke="${green.right}" stroke-width="0.9"/>` + ell2(x, y - 15, 2.6, 1.2, "#2F4A36") + `<path d="M${f22(x - 3.4)},${f22(y - 14)} C${f22(x - 3.6)},${f22(y - 22.5)} ${f22(x + 3.6)},${f22(y - 22.5)} ${f22(x + 3.4)},${f22(y - 14.6)}" stroke="${green.right}" stroke-width="1.6" fill="none"/><path d="M${f22(x - 3.9)},${f22(y - 12.6)} q-3.6,0.6 -3.4,4.2 q0.2,2.6 3.2,2.6" stroke="${green.right}" stroke-width="1.4" fill="none"/>` + ln2([x - 2.2, y - 13.2], [x - 2.2, y - 6.4], "rgba(255,255,255,.4)", 1.1);
    }, "draw")
  }]
};
var poulailler = {
  layers: [{
    at: { 1: [0.7, -0.78], 2: [0.68, -0.62] },
    frame: [-24, -48, 48, 56],
    back: true,
    draw: /* @__PURE__ */ __name((T2) => {
      const legs = [[-0.12, -0.09], [0.12, -0.09], [-0.12, 0.09], [0.12, 0.09]].map(([a, b]) => T2.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 0, 8, WOOD_DARK)).join("");
      return T2.shadow(0, 0, 0.2, 0.2) + ell2(...T2.p(0, 0.04, 0), 9, 3.4, STRAW.left) + ell2(...T2.p(0.02, 0.06, 0), 5, 1.8, STRAW.top) + legs + T2.box(-0.15, -0.12, 0.15, 0.12, 8, 22, BARN) + planksLeft(T2.u - 0.15, T2.u + 0.15, T2.v + 0.12, 8, 22, 4.5) + planksRight(T2.u + 0.15, T2.v - 0.12, T2.v + 0.12, 8, 22, 4.5) + T2.box(0.13, 0.1, 0.155, 0.125, 8, 22, WALL, "") + T2.box(-0.155, 0.1, -0.13, 0.125, 8, 22, WALL, "") + T2.box(0.13, -0.125, 0.155, -0.1, 8, 22, WALL, "") + T2.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.12, 17], [-0.02, 0.12, 17]], "#3A2A1E") + T2.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.32, 0], [-0.02, 0.32, 0]], WOOD.top, EDGE) + [0.17, 0.22, 0.27].map((k) => ln2(T2.p(-0.02, k, 9 * (1 - (k - 0.12) / 0.2)), T2.p(0.08, k, 9 * (1 - (k - 0.12) / 0.2)), WOOD.right, 0.7)).join("") + T2.face([[0.15, -0.07, 14], [0.15, 0, 14], [0.15, 0, 19], [0.15, -0.07, 19]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"') + T2.box(0.15, 0.01, 0.22, 0.11, 10, 16, BARN) + T2.face([[0.15, 0.01, 18], [0.22, 0.01, 16], [0.22, 0.11, 16], [0.15, 0.11, 18]], "#7C7F89", EDGE) + T2.gable(-0.15, -0.12, 0.15, 0.12, 22, 9, { front: "#8F939D", back: "#6D717B", gable: BARN.right }, 0.04);
    }, "draw")
  }, {
    at: [0.1, 0.72],
    frame: [-30, -26, 64, 38],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const flock = [
        { du: 0, dv: 0, k: 0, color: "#C98B4E", wing: "#A86A33" },
        { du: -0.3, dv: 0.22, k: 2.1, color: "#FFFDF8", wing: "#E9DFCB" },
        { du: 0.32, dv: -0.26, k: 4.2, color: "#FFFDF8", wing: "#E9DFCB" }
      ];
      const hens = flock.map(({ du, dv, k, color, wing }, i) => {
        const a = f / n * Math.PI * 2 + k;
        const [x, y] = T2.p(du + Math.sin(a) * 0.05, dv + Math.cos(a) * 0.03, 0);
        const peck = (f + i * 3) % n === 2 || (f + i * 3) % n === 3 ? 1 : 0;
        return hen(x, y, { flip: Math.cos(a) < 0, peck, step: f % 2 ? 1 : -1, color, wing });
      }).join("");
      const [cx, cy] = T2.p(0.14 + wave(f, n, 0.04, 1), 0.12, 0);
      return hens + chick(cx, cy, f % 4 === 1 ? 1.2 : 0);
    }, "draw")
  }]
};
var ruche = {
  layers: [{
    at: [-0.86, 0.86],
    frame: [-18, -40, 40, 46],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 0);
      let rings = "";
      for (let k = 0; k < 5; k++) rings += ell2(x, y - 11 - k * 4, 9.6 - k * 1.5, 3.4, k % 2 ? STRAW.left : STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.7"`);
      const lavender = [[-9, 2], [-11, -1], [8, 3], [10, 0]].map(([dx, dy]) => ln2([x + dx, y + dy], [x + dx - 0.6, y + dy - 6], "#6FA35A", 0.7) + ell2(x + dx - 0.6, y + dy - 7, 0.9, 2, "#A98ADB")).join("");
      return T2.shadow(0, 0, 0.16, 0.22) + lavender + T2.box(-0.1, -0.08, -0.07, 0.08, 0, 7, WOOD_DARK) + T2.box(0.07, -0.08, 0.1, 0.08, 0, 7, WOOD_DARK) + T2.box(-0.14, -0.11, 0.14, 0.11, 7, 9, WOOD) + rings + ell2(x, y - 31, 3, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f22(x - 6)},${f22(y - 12)} q6,3 12,0" stroke="rgba(150,105,40,.5)" stroke-width="0.6" fill="none"/><path d="M${f22(x - 2.8)},${f22(y - 9.4)} a2.8,2.4 0 0 1 5.6,0 Z" fill="#3A2A1E"/>`;
    }, "draw")
  }, {
    at: [-0.86, 0.86],
    frame: [-22, -48, 46, 40],
    n: 8,
    fps: 10,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 22);
      return [0, 1, 2, 3].map((k) => {
        const a = f / n * Math.PI * 2 * (k % 2 ? 1 : -1) + k * 1.6;
        return bee2(x + Math.cos(a) * (10 + k * 2), y + Math.sin(a) * 4.5 - k * 3 + 2, (f + k) % 2 === 0);
      }).join("");
    }, "draw")
  }]
};
var RED_PAINT = { top: "#EE7A6E", left: "#D2574B", right: "#A23E35" };
var carrot = /* @__PURE__ */ __name((x, y, a) => `<g transform="rotate(${a} ${f22(x)} ${f22(y)})"><path d="M${f22(x)},${f22(y - 1.4)} L${f22(x + 7)},${f22(y)} L${f22(x)},${f22(y + 1.4)} Z" fill="#F08A3A" stroke="#C8622A" stroke-width="0.4"/><path d="M${f22(x)},${f22(y)} l-3,-1.8 M${f22(x)},${f22(y)} l-3.4,0.2 M${f22(x)},${f22(y)} l-2.4,1.8" stroke="#5FA04A" stroke-width="0.9" stroke-linecap="round"/></g>`, "carrot");
var brouette = {
  layers: [{
    at: [0.9, -0.05],
    frame: [-24, -28, 46, 34],
    draw: /* @__PURE__ */ __name((T2) => {
      const rim = [[-0.16, -0.12], [0.12, -0.12], [0.12, 0.12], [-0.16, 0.12]].map(([a, b]) => T2.p(a, b, 14));
      const base = [[-0.11, -0.085], [0.08, -0.085], [0.08, 0.085], [-0.11, 0.085]].map(([a, b]) => T2.p(a, b, 7));
      const [sx, sy] = T2.p(-0.02, 0, 14.5);
      const handle = /* @__PURE__ */ __name((s) => ln2(T2.p(-0.15, 0.1 * s, 12.5), T2.p(-0.38, 0.11 * s, 9), WOOD.right, 1.7) + ln2(T2.p(-0.15, 0.1 * s, 13.1), T2.p(-0.38, 0.11 * s, 9.6), WOOD.top, 0.6), "handle");
      const leg = /* @__PURE__ */ __name((s) => ln2(T2.p(-0.08, 0.07 * s, 7.4), T2.p(-0.1, 0.08 * s, 0), DARK_IRON.right, 1.3), "leg");
      return T2.shadow(-0.06, 0, 0.22, 0.2) + handle(-1) + leg(-1) + ln2(T2.p(0.06, -0.06, 8), T2.p(0.18, 0, 5), DARK_IRON.right, 1) + poly2(rim, "#3A2A1E") + ell2(sx, sy, 7.6, 3.2, "#6B4329") + ell2(sx - 1.6, sy - 0.8, 4.6, 1.8, "#7A4E30") + carrot(sx - 6, sy - 1.4, -12) + carrot(sx - 4, sy + 0.8, 8) + carrot(sx + 4.6, sy + 1.2, 196) + dot2(sx + 2.6, sy - 2.2, 3.2, "#79BE5C") + `<path d="M${f22(sx + 0.4)},${f22(sy - 2.6)} q2.2,-2.4 4.4,0 M${f22(sx + 1)},${f22(sy - 1.2)} q1.6,-1.4 3.2,0" stroke="#A6D98A" stroke-width="0.7" fill="none"/>` + dot2(sx - 1.4, sy - 2.6, 1.3, "#E86A8A") + dot2(sx + 0.4, sy + 1.2, 1.2, "#E86A8A") + poly2([base[3], base[2], rim[2], rim[3]], RED_PAINT.left, ` stroke="${OUT}" stroke-width="0.6"`) + poly2([base[1], base[2], rim[2], rim[1]], RED_PAINT.right, ` stroke="${OUT}" stroke-width="0.6"`) + `<polyline points="${[rim[1], rim[2], rim[3]].map(xy3).join(" ")}" fill="none" stroke="${RED_PAINT.top}" stroke-width="1.2" stroke-linejoin="round"/>` + wheel(T2, 0.18, 0, 5, 0.06, "u", { rim: "#3D3A36", spokes: 6, width: 1.9 }) + ln2(T2.p(0.06, 0.06, 8), T2.p(0.18, 0, 5), DARK_IRON.right, 1) + leg(1) + handle(1);
    }, "draw")
  }]
};
var CROW = { body: "#33303A", breast: "#4A4652", wing: "#22202A", flip: true };
var flying = /* @__PURE__ */ __name((x, y, up) => `<path d="M${f22(x - 4.4)},${f22(y + (up ? -2 : 1))} Q${f22(x - 2)},${f22(y - (up ? 2.6 : 0.4))} ${f22(x)},${f22(y)} Q${f22(x + 2)},${f22(y - (up ? 2.6 : 0.4))} ${f22(x + 4.4)},${f22(y + (up ? -2 : 1))}" stroke="${CROW.body}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(x, y + 0.2, 1, CROW.body), "flying");
var epouvantail = {
  layers: [{
    at: [-0.88, 0.2],
    frame: [-26, -54, 52, 60],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const sway = wave(f, n, 1);
      const sy = y - 27;
      const tuft = /* @__PURE__ */ __name((cx, cy, s) => [-1, 0, 1].map((k) => ln2([cx, cy + k * 1.1], [cx + s * (3 + Math.abs(k) * 0.4), cy + k * 1.9 + sway * 0.8], STRAW.right, 0.8)).join(""), "tuft");
      const legTuft = /* @__PURE__ */ __name((cx) => [-1, 0, 1].map((k) => ln2([cx + k * 0.8, y - 6], [cx + k * 1.6, y - 2.8], STRAW.right, 0.8)).join(""), "legTuft");
      const crow = f >= 2 && f <= 6 ? bird(x + 9.4, sy - 0.4, { ...CROW, peck: f === 4 ? 1 : 0 }) : flying(x + (f === 7 ? 17 : f === 0 ? 20 : 14), sy - (f === 7 ? 9 : f === 0 ? 14 : 6), f !== 0);
      return ell2(x + 1, y + 0.4, 6, 1.8, "rgba(40,55,20,.25)") + `<rect x="${f22(x - 1)}" y="${f22(y - 40)}" width="2.2" height="40" fill="${WOOD_DARK.left}"/><rect x="${f22(x + 0.2)}" y="${f22(y - 40)}" width="1" height="40" fill="${WOOD_DARK.right}"/>` + legTuft(x - 2.4) + legTuft(x + 2.4) + `<path d="M${f22(x - 4.4)},${f22(y - 16)} L${f22(x + 4.4)},${f22(y - 16)} L${f22(x + 4)},${f22(y - 6)} L${f22(x + 0.8)},${f22(y - 6)} L${f22(x)},${f22(y - 11)} L${f22(x - 0.8)},${f22(y - 6)} L${f22(x - 4)},${f22(y - 6)} Z" fill="#5C83C2" stroke="${OUT}" stroke-width="0.5"/><rect x="${f22(x + 1.3)}" y="${f22(y - 13.4)}" width="2.2" height="2.4" fill="#E2C66E" transform="rotate(8 ${f22(x + 2.4)} ${f22(y - 12.2)})"/><rect x="${f22(x - 13)}" y="${f22(sy - 0.4)}" width="26" height="4" rx="1.6" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(x - 5)},${f22(sy)} L${f22(x + 5)},${f22(sy)} L${f22(x + 4.6)},${f22(y - 15)} L${f22(x - 4.6)},${f22(y - 15)} Z" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/>` + [-10, -7, -2.6, 0, 2.6, 7, 10].map((dx) => ln2([x + dx, sy + (Math.abs(dx) > 5 ? 0 : 0.6)], [x + dx, Math.abs(dx) > 5 ? sy + 3.4 : y - 15.4], "rgba(110,30,25,.5)", 0.6)).join("") + [sy + 1.8, sy + 6, sy + 9.4].map((ly, k) => ln2([x - (k ? 4.8 : 12.6), ly], [x + (k ? 4.8 : 12.6), ly], "rgba(255,214,120,.55)", 0.6)).join("") + ln2([x - 4.7, y - 16], [x + 4.7, y - 16], "#C9A16A", 1.1) + tuft(x - 13, sy + 1.6, -1) + tuft(x + 13, sy + 1.6, 1) + ln2([x - 2.4, sy - 0.6], [x + 2.4, sy - 0.6], "#C9A16A", 1) + ell2(x, sy - 5, 4.6, 5, "#E7C99A", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(x - 2.8)},${f22(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6 M${f22(x + 1.2)},${f22(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6" stroke="#3A2A1E" stroke-width="0.7"/><path d="M${f22(x - 2.6)},${f22(sy - 3)} q2.6,1.8 5.2,0" stroke="#3A2A1E" stroke-width="0.6" fill="none" stroke-dasharray="0.9 0.6"/><g transform="rotate(${f22(-6 + sway * 3)} ${f22(x)} ${f22(sy - 9)})">` + ell2(x, sy - 8.6, 8.6, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f22(x - 4.4)},${f22(sy - 9)} q0.4,-5.4 4.4,-5.4 q4,0 4.4,5.4 Z" fill="${STRAW.left}" stroke="${STRAW.right}" stroke-width="0.6"/><path d="M${f22(x - 4.3)},${f22(sy - 10.6)} q4.3,1.4 8.6,0" stroke="#C8504A" stroke-width="1.3" fill="none"/></g>` + crow;
    }, "draw")
  }]
};
var PUMPKIN_AT = [0.58, 0.3];
var leaf = /* @__PURE__ */ __name((x, y, a, s = 1) => `<path d="M0,0 q4,-5 9,-1 q-3,1 -2,4 q-4,-1 -7,-3 Z" fill="#5FA04A" stroke="#3F7A34" stroke-width="${f22(0.5 / s)}" transform="translate(${f22(x)} ${f22(y)}) rotate(${a}) scale(${s})"/>`, "leaf");
var citrouille = {
  light: /* @__PURE__ */ __name(() => [PUMPKIN_AT[0], PUMPKIN_AT[1], 9, 26], "light"),
  layers: [{
    at: PUMPKIN_AT,
    frame: [-26, -50, 52, 56],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const cy = y - 9.5;
      const lit2 = 0.7 + wave(f, n, 0.3);
      const ribs = [[-8.4, 6.4, "#D9682A"], [8.4, 6.4, "#C85A22"], [-4.6, 7.6, "#EF8A3A"], [4.6, 7.6, "#E57A32"], [0, 8.2, "#F7A04A"]].map(([dx, rx, c]) => ell2(x + dx, cy, rx, 9.4, c, ' stroke="#A9481C" stroke-width="0.6"')).join("");
      const carving = `M${f22(x - 6)},${f22(cy - 1.6)} l2.6,-3.8 l2.4,3.8 Z M${f22(x + 1)},${f22(cy - 1.6)} l2.4,-3.8 l2.6,3.8 Z M${f22(x - 6.8)},${f22(cy + 2)} q6.8,6 13.6,0 l-2,0.4 l-1,1.6 l-1.6,-1 l-1.6,1.4 l-1.4,-1.4 l-1.6,1.2 l-1.4,-1.6 l-1.4,1.2 Z`;
      const sparks2 = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        const a = t * Math.PI * 3 + k * 2.1;
        return star(x + Math.cos(a) * (10 + t * 4), cy - 10 - t * 26, 1.4 + (1 - t) * 1.4, k % 2 ? "#FFF2B0" : "#FFD27A", 1 - t);
      }).join("");
      return ell2(x + 2, y + 0.6, 17, 4.6, "rgba(40,55,20,.25)") + leaf(x - 20, y + 1, -8) + leaf(x + 19, y + 2, 188) + leaf(x - 6, y + 4, 30, 0.8) + `<path d="M${f22(x + 16)},${f22(y + 1)} q4,-3 2,-6 q-2,-2 -3,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>` + ribs + `<path d="M${f22(x - 6)},${f22(cy - 6.4)} q6,-3 12,0" stroke="rgba(255,230,180,.45)" stroke-width="1.4" fill="none"/><path d="${carving}" fill="#5A2A10"/><path d="${carving}" fill="#FFD25A" opacity="${f22(lit2)}"/><path d="M${f22(x - 1)},${f22(cy - 8.6)} q-0.6,-4 2.6,-6.4 l1.4,1 q-2.4,2 -1.6,5.4 Z" fill="#6B8E3A" stroke="#4A6A28" stroke-width="0.5"/><path d="M${f22(x + 2.6)},${f22(cy - 14)} q4,-2 3.4,1.6 q-0.6,2.4 -2.6,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>` + leaf(x - 1, cy - 9, -150, 0.7) + sparks2;
    }, "draw")
  }]
};
var pioche = {
  layers: [{
    at: [0.16, 0.8],
    frame: [-16, -34, 34, 40],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 9);
      return T2.shadow(0, 0, 0.16, 0.22) + T2.box(-0.11, -0.09, 0.11, 0.09, 0, 6, STONE) + T2.box(-0.07, -0.06, 0.08, 0.06, 6, 9, STONE) + T2.pebble(0.15, 0.08, 2.2) + T2.pebble(-0.14, 0.12, 1.8) + ln2([x - 1, y - 1], [x - 10, y - 21], WOOD.right, 2.3) + ln2([x - 1.4, y - 1], [x - 10.4, y - 21], WOOD.top, 0.7) + ln2([x - 8.6, y - 18], [x - 10.4, y - 21.6], "#5E3A22", 2.8) + `<path d="M${f22(x - 9)},${f22(y + 1)} Q${f22(x - 2)},${f22(y - 7)} ${f22(x + 7)},${f22(y + 2)}" stroke="${DARK_IRON.left}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${f22(x - 8.6)},${f22(y)} Q${f22(x - 2)},${f22(y - 7.6)} ${f22(x + 6.4)},${f22(y + 1)}" stroke="${IRON.top}" stroke-width="1" fill="none" stroke-linecap="round"/><rect x="${f22(x - 3.2)}" y="${f22(y - 5.6)}" width="3.6" height="3.4" rx="0.8" fill="${DARK_IRON.right}" transform="rotate(-25 ${f22(x - 1.4)} ${f22(y - 4)})"/>` + T2.box(0.02, 0, 0.1, 0.06, 6, 9, STONE) + `<path d="M${f22(x + 3)},${f22(y + 1.5)} l2,-1.2 l1.2,1.4 Z" fill="${STONE.right}"/>`;
    }, "draw")
  }]
};
var wagonnet = {
  layers: [{
    at: [0.76, 0.8],
    frame: [-24, -28, 48, 36],
    draw: /* @__PURE__ */ __name((T2) => {
      let track = "";
      for (const du of [-0.18, 0, 0.18]) track += T2.box(du - 0.025, -0.13, du + 0.025, 0.13, 0, 1.4, WOOD_DARK);
      track += ln2(T2.p(-0.24, -0.07, 1.4), T2.p(0.24, -0.07, 1.4), "#7C8894", 1.2) + ln2(T2.p(-0.24, 0.07, 1.4), T2.p(0.24, 0.07, 1.4), "#7C8894", 1.2);
      const l0 = T2.p(-0.13, 0.085, 5);
      const r0 = T2.p(0.13, 0.085, 5);
      const l1 = T2.p(-0.17, 0.115, 15);
      const r1 = T2.p(0.17, 0.115, 15);
      const top = [T2.p(-0.17, -0.115, 15), T2.p(0.17, -0.115, 15), r1, l1];
      const ore = [[-0.08, -0.02, 2.8, IRON], [0.04, -0.05, 2.6, IRON], [0, 0.04, 3, STONE], [0.09, 0.03, 2.2, IRON], [-0.1, 0.05, 2.2, STONE]].map(([a, b, s, c]) => stone(...T2.p(a, b, 16), s, c)).join("");
      const [gx, gy] = T2.p(0.02, -0.01, 19);
      return T2.shadow(0, 0, 0.2, 0.2) + track + wheel(T2, -0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + wheel(T2, 0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + poly2([l0, r0, r1, l1], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`) + poly2([r0, T2.p(0.13, -0.085, 5), T2.p(0.17, -0.115, 15), r1], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON.top}" stroke-width="0.9"`) + ore + `<path d="M${f22(gx)},${f22(gy - 2)} l1.6,2 l-1.6,2 l-1.6,-2 Z" fill="#F2C04B"/>` + dot2(gx - 0.4, gy - 0.6, 0.5, "#FFFFFF") + [0.25, 0.5, 0.75].map((k) => dot2(l1[0] + (r1[0] - l1[0]) * k, l1[1] + (r1[1] - l1[1]) * k + 1.6, 0.55, IRON.right)).join("") + wheel(T2, -0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 }) + wheel(T2, 0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 });
    }, "draw")
  }]
};
var LANTERN_AT = [-0.86, 0.5];
var lanterneMine = {
  light: /* @__PURE__ */ __name(() => [LANTERN_AT[0] + 0.2, LANTERN_AT[1], 24, 22], "light"),
  layers: [{
    at: LANTERN_AT,
    frame: [-12, -44, 34, 50],
    draw: /* @__PURE__ */ __name((T2) => T2.shadow(0, 0, 0.08, 0.2) + T2.pebble(-0.04, 0.06, 2.4) + T2.pebble(0.05, 0.05, 2) + T2.box(-0.025, -0.025, 0.025, 0.025, 0, 37, WOOD_DARK) + T2.box(-0.02, -0.018, 0.24, 0.018, 34, 37, WOOD) + ln2(T2.p(0, 0, 25), T2.p(0.11, 0, 35), WOOD_DARK.right, 1.4) + ln2(T2.p(0.2, 0, 34), T2.p(0.2, 0, 32), "#3D3A36", 1), "draw")
  }, {
    at: LANTERN_AT,
    frame: [-2, -40, 24, 26],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [hx, hy] = T2.p(0.2, 0, 32);
      return `<g transform="rotate(${f22(wave(f, n, 7))} ${f22(hx)} ${f22(hy)})">` + ln2([hx, hy], [hx, hy + 3], "#3D3A36", 0.8) + `<path d="M${f22(hx - 3.2)},${f22(hy + 5)} L${f22(hx - 1.6)},${f22(hy + 3)} L${f22(hx + 1.6)},${f22(hy + 3)} L${f22(hx + 3.2)},${f22(hy + 5)} Z" fill="#3D3A36"/><rect x="${f22(hx - 3)}" y="${f22(hy + 5)}" width="6" height="7.4" fill="#FFE08A"/><rect x="${f22(hx + 0.4)}" y="${f22(hy + 5)}" width="2.6" height="7.4" fill="#E9BF4E"/>` + ell2(hx - 0.4, hy + 8.6, 1.3, 1.9, "#FFFDF0") + `<path d="M${f22(hx - 3)},${f22(hy + 5)} v7.4 M${f22(hx)},${f22(hy + 5)} v7.4 M${f22(hx + 3)},${f22(hy + 5)} v7.4" stroke="#3D3A36" stroke-width="0.7"/><rect x="${f22(hx - 3.6)}" y="${f22(hy + 12.2)}" width="7.2" height="1.6" rx="0.5" fill="#3D3A36"/></g>`;
    }, "draw")
  }]
};
var rails = {
  layers: [{
    at: [-0.35, 0.88],
    frame: [-18, -16, 36, 26],
    draw: /* @__PURE__ */ __name((T2) => {
      let out = "";
      for (const dv of [-0.06, 0.04]) out += T2.box(-0.15, dv - 0.02, 0.15, dv + 0.02, 0, 1.5, WOOD_DARK);
      out += ln2(T2.p(-0.1, -0.08, 1.5), T2.p(-0.1, 0.06, 1.5), "#7C8894", 1.2) + ln2(T2.p(0.1, -0.08, 1.5), T2.p(0.1, 0.06, 1.5), "#7C8894", 1.2);
      return out + T2.box(-0.14, 0.06, -0.1, 0.1, 0, 9, WOOD_DARK) + T2.box(0.1, 0.06, 0.14, 0.1, 0, 9, WOOD_DARK) + T2.box(-0.15, 0.05, 0.15, 0.09, 6, 10, { top: "#F2EDE2", left: "#E2574C", right: "#B13A31" }) + [-0.07, 0.03].map((du) => T2.face([[du, 0.09, 6], [du + 0.04, 0.09, 6], [du + 0.04, 0.09, 10], [du, 0.09, 10]], "#FFFDF8")).join("");
    }, "draw")
  }, {
    at: [-0.35, 0],
    frame: [-18, -26, 36, 32],
    n: 4,
    fps: 8,
    motion: /* @__PURE__ */ __name((t) => {
      const c = t % 9 / 9;
      const ease = /* @__PURE__ */ __name((k2) => k2 * k2 * (3 - 2 * k2), "ease");
      let k = 0;
      if (c >= 0.15 && c < 0.45) k = ease((c - 0.15) / 0.3);
      else if (c >= 0.45 && c < 0.6) k = 1;
      else if (c >= 0.6 && c < 0.9) k = 1 - ease((c - 0.6) / 0.3);
      return [0, 0.06 + k * 0.24, 0];
    }, "motion"),
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const turn = f / n * (Math.PI / 2);
      const top = [T2.p(-0.1, -0.13, 13), T2.p(0.1, -0.13, 13), T2.p(0.1, 0.13, 13), T2.p(-0.1, 0.13, 13)];
      const ore = [[-0.03, -0.06, 2.4, IRON], [0.03, 0, 2.6, STONE], [-0.02, 0.06, 2.2, IRON]].map(([a, b, s, c]) => stone(...T2.p(a, b, 14), s, c)).join("");
      return T2.shadow(0, 0, 0.14, 0.2, 1.5) + T2.box(-0.075, -0.1, 0.075, 0.1, 4, 6, DARK_IRON) + T2.face([[-0.075, 0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [-0.1, 0.13, 13]], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`) + T2.face([[0.075, -0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [0.1, -0.13, 13]], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON.top}" stroke-width="0.9"`) + ore + wheel(T2, 0.09, -0.06, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn }) + wheel(T2, 0.09, 0.07, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn });
    }, "draw")
  }]
};
var casque = {
  layers: [{
    at: [-0.1, 0.94],
    frame: [-20, -32, 40, 38],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 12);
      const [rx, ry] = T2.p(0.17, 0.06, 0);
      const [gx, gy] = T2.p(-0.03, 0.15, 4);
      return T2.shadow(0, 0, 0.16, 0.2) + T2.box(-0.09, -0.08, 0.09, 0.08, 0, 12, WOOD) + ln2(T2.p(-0.08, 0.08, 1), T2.p(0.08, 0.08, 11), WOOD_DARK.right, 1.1) + ln2(T2.p(0.09, -0.07, 1), T2.p(0.09, 0.07, 11), WOOD_DARK.right, 1.1) + [0, 1, 2].map((k) => ell2(rx, ry - k * 1.4, 4.8 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ln2([rx + 4, ry - 3], [rx + 7, ry - 1], "#C9A16A", 1.1) + ell2(gx, gy, 2.8, 3.6, CAST.left, ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 0.8, gy - 1, 1, 1.6, CAST.top) + `<rect x="${f22(gx - 0.8)}" y="${f22(gy - 5.4)}" width="1.6" height="1.8" fill="#8B5631"/>` + gradient(T2.id("hat"), "#FFD866", "#D9952A") + ell2(x, y + 0.4, 8.6, 2.8, "rgba(60,40,25,.5)") + ell2(x, y - 0.4, 8.2, 2.8, "#D99A2B", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(x - 6)},${f22(y - 0.8)} C${f22(x - 6.4)},${f22(y - 10.4)} ${f22(x + 6.4)},${f22(y - 10.4)} ${f22(x + 6)},${f22(y - 0.8)} Z" fill="url(#${T2.id("hat")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x + 0.4)},${f22(y - 7.8)} q0.6,3.6 0.4,7" stroke="#C88A20" stroke-width="1.6" fill="none"/><rect x="${f22(x - 5.8)}" y="${f22(y - 6.6)}" width="3.8" height="3.6" rx="0.8" fill="${DARK_IRON.left}"/>` + ell2(x - 4.6, y - 4.8, 1.5, 1.5, "#FFF3B8") + dot2(x - 5, y - 5.3, 0.5, "#FFFFFF");
    }, "draw")
  }]
};
var GEODE_AT = [-0.92, 0.82];
var AMETHYST = ["#B98CF2", "#9466DA", "#DCC6FF", "#7F52C8"];
function crystals(cx, cy, rx, ry, count, seed) {
  let out = "";
  for (let k = 0; k < count; k++) {
    const a = k / count * Math.PI * 2 + seed + k * 7 % 3 * 0.08;
    const reach = 0.3 + k * 5 % 4 * 0.12;
    const bx = cx + Math.cos(a) * rx;
    const by = cy + Math.sin(a) * ry;
    const px = -Math.sin(a) * (1.1 + k % 3 * 0.4);
    const py = Math.cos(a) * (0.8 + k % 2 * 0.3);
    const tx = cx + Math.cos(a) * rx * reach;
    const ty = cy + Math.sin(a) * ry * reach;
    out += poly2([[bx - px, by - py], [tx, ty], [bx + px, by + py]], AMETHYST[k * 3 % 4]) + ln2([bx, by], [tx, ty], "rgba(255,255,255,.25)", 0.4);
  }
  return out;
}
__name(crystals, "crystals");
var geode = {
  light: /* @__PURE__ */ __name(() => [GEODE_AT[0], GEODE_AT[1], 8, 20, "190,140,255"], "light"),
  layers: [{
    at: GEODE_AT,
    frame: [-22, -30, 44, 36],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const cx = x - 2;
      const cy = y - 10;
      const [hx, hy] = T2.p(0.13, 0.1, 0);
      const prism = /* @__PURE__ */ __name((px, py, h, w, c) => poly2([[px - w, py], [px - w, py - h], [px, py - h - w], [px, py]], c.left) + poly2([[px, py], [px, py - h - w], [px + w, py - h], [px + w, py]], c.right), "prism");
      const twinkle = [[-4, -4], [3, -2], [-1, 3]].map(([dx, dy], k) => star(cx + dx, cy + dy, 1.8, "#FFFFFF", Math.max(0, wave(f, n, 1, k * 2.1)))).join("");
      return ell2(x + 1, y + 0.6, 15, 4.4, "rgba(40,55,20,.24)") + gradient(T2.id("shell"), STONE.left, STONE.right) + `<path d="M${f22(cx - 12)},${f22(cy + 2)} Q${f22(cx - 13)},${f22(cy - 9)} ${f22(cx - 2)},${f22(cy - 11)} Q${f22(cx + 11)},${f22(cy - 12)} ${f22(cx + 12.4)},${f22(cy)} Q${f22(cx + 12)},${f22(cy + 9)} ${f22(cx)},${f22(cy + 10)} Q${f22(cx - 11)},${f22(cy + 10)} ${f22(cx - 12)},${f22(cy + 2)} Z" fill="url(#${T2.id("shell")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(cx - 8.6)},${f22(cy)} Q${f22(cx - 8)},${f22(cy - 7.6)} ${f22(cx + 1)},${f22(cy - 7.2)} Q${f22(cx + 9.6)},${f22(cy - 6.6)} ${f22(cx + 9)},${f22(cy + 0.6)} Q${f22(cx + 8)},${f22(cy + 7)} ${f22(cx)},${f22(cy + 6.8)} Q${f22(cx - 8.4)},${f22(cy + 6)} ${f22(cx - 8.6)},${f22(cy)} Z" fill="#3B2550" stroke="#D9D2C6" stroke-width="1"/>` + crystals(cx + 0.6, cy - 0.2, 7.8, 6.2, 16, 0.2) + prism(cx - 2.4, cy + 4, 6, 1.6, { left: "#C8A4F7", right: "#8A5CD4" }) + prism(cx + 1, cy + 4.6, 8.4, 2, { left: "#DCC6FF", right: "#9A6AE0" }) + prism(cx + 4, cy + 4, 5, 1.4, { left: "#B98CF2", right: "#7F52C8" }) + twinkle + ell2(hx, hy - 1, 7.4, 3.8, STONE.right, ` stroke="${OUT}" stroke-width="0.5"`) + ell2(hx, hy - 1.8, 6.6, 3.2, "#E9E2D6") + ell2(hx, hy - 1.8, 5.8, 2.7, "#4A2E66") + crystals(hx, hy - 1.8, 5.4, 2.4, 12, 0.5);
    }, "draw")
  }]
};
var GOLEM_AT = [-0.9, 0.08];
var ROCK = { top: "#C2BCB1", left: "#A39D92", right: "#7E7970" };
var golem = {
  light: /* @__PURE__ */ __name(() => [GOLEM_AT[0], GOLEM_AT[1] + 0.06, 26, 18, "120,230,255"], "light"),
  layers: [{
    at: GOLEM_AT,
    frame: [-24, -54, 48, 60],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const b = wave(f, n, 0.7);
      const glowing = 0.55 + wave(f, n, 0.45, 1);
      const sw = wave(f, n, 0.014);
      const rune = `rgba(130,235,255,${f22(glowing)})`;
      const moss = /* @__PURE__ */ __name((du, dv, z, r) => T2.disc(du, dv, z, r, "#6DB64C") + T2.disc(du - 8e-3, dv - 8e-3, z + 0.6, r * 0.6, "#8FCB6A"), "moss");
      const arm = /* @__PURE__ */ __name((u0, u1, s) => T2.box(u0, -0.05 + s, u1, 0.05 + s, 9 + b, 25 + b, ROCK) + T2.box(u0 - 0.015, -0.065 + s, u1 + 0.015, 0.065 + s, 1 + b, 10 + b, ROCK), "arm");
      const shoulder = /* @__PURE__ */ __name((du, k) => {
        const [px, py] = T2.p(du, 0, 26 + b);
        return stone(px, py, 4.6 + k, ROCK);
      }, "shoulder");
      const eye = /* @__PURE__ */ __name((du) => {
        const [ex, ey] = T2.p(du, 0.07, 30 + b);
        return ell2(ex, ey, 1.5, 1, rune) + dot2(ex, ey, 0.5, "#F2FFFF");
      }, "eye");
      const ring = Array.from({ length: 16 }, (_, k) => T2.p(Math.cos(k / 16 * Math.PI * 2) * 0.06, 0.09, 17 + b + Math.sin(k / 16 * Math.PI * 2) * 4.6));
      return T2.shadow(0, 0, 0.28, 0.24) + T2.pebble(0.26, 0.14, 2.4) + T2.pebble(-0.24, 0.18, 1.8) + arm(-0.25, -0.155, sw) + T2.box(-0.11, -0.05, -0.02, 0.05, 0, 9, ROCK) + T2.box(0.02, -0.05, 0.11, 0.05, 0, 9, ROCK) + T2.box(-0.15, -0.09, 0.15, 0.09, 8 + b, 27 + b, ROCK) + ln2(T2.p(-0.12, 0.09, 24 + b), T2.p(-0.07, 0.09, 20 + b), "rgba(60,50,40,.35)", 0.6) + ln2(T2.p(0.15, -0.05, 12 + b), T2.p(0.15, 0.03, 17 + b), "rgba(60,50,40,.35)", 0.6) + `<polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="rgba(130,235,255,${f22(glowing * 0.35)})" stroke-width="2.4"/><polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="${rune}" stroke-width="0.9"/>` + ln2(T2.p(0, 0.09, 12 + b), T2.p(0, 0.09, 22 + b), rune, 0.9) + ln2(T2.p(-0.04, 0.09, 14 + b), T2.p(0.04, 0.09, 20 + b), rune, 0.8) + shoulder(-0.13, 0) + T2.box(-0.065, -0.05, 0.065, 0.07, 26 + b, 34 + b, ROCK) + eye(-0.032) + eye(0.028) + ln2(T2.p(-0.03, 0.07, 27.4 + b), T2.p(0.025, 0.07, 27 + b), "rgba(60,50,40,.45)", 0.7) + shoulder(0.14, 0.4) + arm(0.155, 0.25, -sw) + moss(-0.03, 0, 34 + b, 0.05) + moss(0.17, 0, 25 + b, 0.035) + moss(-0.11, -0.04, 27 + b, 0.035) + dot2(...T2.p(-0.02, 0.01, 35.4 + b), 0.9, "#F7A8C8");
    }, "draw")
  }]
};
var hache = {
  layers: [{
    at: [-0.42, 0.84],
    frame: [-24, -32, 46, 38],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 9);
      const log = /* @__PURE__ */ __name((a, b, z) => T2.box(a, b, a + 0.2, b + 0.065, z, z + 4.6, BARK) + ell2(...T2.p(a + 0.2, b + 0.032, z + 2.3), 1.1, 1.6, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T2.shadow(-0.1, 0.04, 0.2, 0.2) + log(-0.36, -0.06, 0) + log(-0.36, 0.01, 0) + log(-0.36, 0.08, 0) + log(-0.34, -0.025, 4.6) + log(-0.34, 0.045, 4.6) + T2.cyl(0, 0, 0, 9, 0.11, STUMP, "block") + ell2(x, y, 3.4, 1.7, "none", ' stroke="#B98552" stroke-width="0.6"') + ell2(x, y, 1.4, 0.7, "none", ' stroke="#B98552" stroke-width="0.5"') + [-3, 0, 3].map((dx) => ln2([x + dx, y + 1.6], [x + dx + 0.4, y + 8], "rgba(60,40,25,.5)", 0.6)).join("") + ln2([x + 0.6, y - 1.6], [x + 9.5, y - 17], WOOD.right, 2) + ln2([x + 0.3, y - 1.8], [x + 9.2, y - 17.2], WOOD.top, 0.6) + `<path d="M${f22(x - 3.2)},${f22(y + 0.6)} L${f22(x + 3.6)},${f22(y - 1.2)} L${f22(x + 2.6)},${f22(y - 4.8)} L${f22(x - 2.2)},${f22(y - 4.6)} Q${f22(x - 4.4)},${f22(y - 2)} ${f22(x - 3.2)},${f22(y + 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="M${f22(x - 3.2)},${f22(y + 0.6)} Q${f22(x - 4.4)},${f22(y - 2)} ${f22(x - 2.2)},${f22(y - 4.6)}" stroke="${IRON.top}" stroke-width="0.8" fill="none"/>` + [[6, 3], [-5, 4], [8, 1], [3, 5]].map(([dx, dy]) => `<path d="M${f22(x + dx)},${f22(y + 9 + dy)} l1.6,-0.6 l0.4,0.9 Z" fill="#E7C08A"/>`).join("");
    }, "draw")
  }]
};
var scie = {
  layers: [{
    at: [0.78, -0.74],
    frame: [-26, -34, 52, 40],
    draw: /* @__PURE__ */ __name((T2) => {
      const leg = /* @__PURE__ */ __name((du, s) => ln2(T2.p(du, -0.09 * s, 0), T2.p(du, 0.09 * s, 14), WOOD_DARK.right, 2), "leg");
      const [b0x, b0y] = T2.p(0.02, -0.13, 15);
      const [b1x, b1y] = T2.p(0.02, 0.13, 15);
      const teeth = Array.from({ length: 9 }, (_, k) => `${k ? "L" : "M"}${f22(b0x + (b1x - b0x) * k / 8)},${f22(b0y + (b1y - b0y) * k / 8 + (k % 2 ? 1 : 0))}`).join(" ");
      const [dx, dy] = T2.p(0.03, 0.02, 0);
      return T2.shadow(0, 0, 0.24, 0.18) + ell2(dx, dy, 6, 2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + leg(-0.15, 1) + leg(-0.15, -1) + T2.box(-0.26, -0.055, 0.24, 0.055, 12, 19, BARK) + ell2(...T2.p(0.24, 0, 15.5), 1.6, 2.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + leg(0.15, 1) + leg(0.15, -1) + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>` + ln2([b0x, b0y], [b1x, b1y], IRON.left, 1.4) + ln2([b0x, b0y], [b0x + 1.5, b0y - 14], WOOD.right, 1.6) + ln2([b1x, b1y], [b1x + 1.5, b1y - 14], WOOD.right, 1.6) + ln2([b0x + 0.8, b0y - 7], [b1x + 0.8, b1y - 7], WOOD.left, 1.2) + ln2([b0x + 1.5, b0y - 14], [b1x + 1.5, b1y - 14], "#C9A16A", 0.7, ' stroke-dasharray="1 0.8"') + T2.cyl(-0.3, 0.12, 0, 4, 0.06, STUMP, "round1") + T2.cyl(-0.22, 0.16, 0, 3, 0.05, STUMP, "round2");
    }, "draw")
  }]
};
var nichoir = {
  layers: [{
    at: [0.86, 0.12],
    frame: [-14, -54, 28, 60],
    draw: /* @__PURE__ */ __name((T2) => {
      const [hx, hy] = T2.p(0, 0.065, 41);
      return T2.shadow(0, 0, 0.08, 0.2) + T2.pebble(0.04, 0.04, 2.2) + T2.box(-0.02, -0.02, 0.02, 0.02, 0, 35, WOOD_DARK) + T2.box(-0.07, -0.065, 0.07, 0.065, 35, 46, { top: "#FBF3DF", left: "#F3E4C4", right: "#D8C39B" }) + dot2(hx, hy, 2, "#3A2A1E") + ln2([hx, hy + 4], [hx - 2.4, hy + 5.2], WOOD_DARK.right, 1) + T2.gable(-0.07, -0.065, 0.07, 0.065, 46, 8, { front: "#6FA3D9", back: "#4C7FB5", gable: "#D8C39B" }, 0.03) + `<path d="M${f22(hx - 4)},${f22(hy - 4)} l1.4,-1 l1.4,1" stroke="#F7A8C8" stroke-width="0.8" fill="none"/>`;
    }, "draw")
  }, {
    at: [0.75, 0.42],
    frame: [-26, -18, 52, 24],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [x1, y1] = T2.p(-0.14, 0.05, 0);
      const [x2, y2] = T2.p(0.2, -0.12, 0);
      return bird(x1 + (f >= 4 ? 2 : 0), y1, { body: "#8B6A4E", breast: "#E8743F", wing: "#6F5238", flip: f >= 4, hop: f === 3 || f === 7 ? 2.6 : 0, peck: f === 1 || f === 5 ? 1 : 0, flap: f === 3 || f === 7 ? 1 : 0 }) + bird(x2, y2, { body: "#5E92C8", breast: "#F2D35A", wing: "#456F9C", flip: f % 4 >= 2, hop: f === 6 ? 2.4 : 0, peck: f === 0 || f === 2 ? 1 : 0, flap: f === 6 ? 1 : 0 });
    }, "draw")
  }]
};
var charrette = {
  layers: [{
    at: { 1: [0.62, 0.78], 2: [0.25, 0.84] },
    frame: [-30, -34, 62, 42],
    draw: /* @__PURE__ */ __name((T2) => {
      const log = /* @__PURE__ */ __name((dv, z) => T2.box(-0.22, dv - 0.035, 0.1, dv + 0.035, z, z + 5, BARK) + ell2(...T2.p(0.1, dv, z + 2.5), 1.2, 1.8, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T2.shadow(-0.04, 0, 0.3, 0.18) + wheel(T2, -0.08, -0.13, 9, 0.12, "u", { rim: "#5E3A22", spokes: 8, width: 2 }) + ln2(T2.p(0.1, -0.09, 10), T2.p(0.42, -0.09, 1), WOOD.right, 1.6) + T2.box(-0.24, -0.12, 0.12, 0.12, 9, 12, WOOD) + log(-0.07, 12) + log(0, 12) + log(0.07, 12) + log(-0.035, 17) + log(0.035, 17) + T2.box(-0.24, 0.115, 0.12, 0.13, 12, 17, WOOD_DARK) + [-0.2, -0.04, 0.1].map((du) => T2.box(du, 0.11, du + 0.025, 0.135, 9, 18, WOOD_DARK)).join("") + ln2(T2.p(0.1, 0.09, 10), T2.p(0.42, 0.09, 1), WOOD.right, 1.6) + ln2(T2.p(0.1, 0.09, 10.6), T2.p(0.42, 0.09, 1.6), WOOD.top, 0.6) + wheel(T2, -0.08, 0.14, 9, 0.12, "u", { rim: "#4A2E1A", spokes: 8, width: 2.2 }) + T2.disc(-0.08, 0.15, 9, 0.02, "#C9A16A");
    }, "draw")
  }]
};
var passePartout = {
  layers: [{
    at: [0.9, 0.62],
    frame: [-30, -32, 58, 40],
    draw: /* @__PURE__ */ __name((T2) => {
      const [b0x, b0y] = T2.p(0.1, -0.24, 13);
      const [b1x, b1y] = T2.p(0.1, 0.26, 13);
      const sag = 2.4;
      const blade = `M${f22(b0x)},${f22(b0y)} Q${f22((b0x + b1x) / 2)},${f22((b0y + b1y) / 2 + sag)} ${f22(b1x)},${f22(b1y)} L${f22(b1x)},${f22(b1y + 3)} Q${f22((b0x + b1x) / 2)},${f22((b0y + b1y) / 2 + sag + 5)} ${f22(b0x)},${f22(b0y + 3)} Z`;
      const teeth = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        const tx = b0x + (b1x - b0x) * t;
        const ty = b0y + (b1y - b0y) * t + 3 + (sag + 2) * 4 * t * (1 - t);
        return `${k ? "L" : "M"}${f22(tx)},${f22(ty + (k % 2 ? 1.2 : 0))}`;
      }).join(" ");
      const grip = /* @__PURE__ */ __name((gx, gy) => ln2([gx, gy + 1], [gx, gy - 8], WOOD.right, 2) + ln2([gx - 0.4, gy + 1], [gx - 0.4, gy - 8], WOOD.top, 0.6) + ln2([gx - 2.2, gy - 7], [gx + 2.2, gy - 7], WOOD_DARK.right, 1.4), "grip");
      const [dx, dy] = T2.p(0.05, 0.14, 0);
      return T2.shadow(0, 0, 0.3, 0.18) + T2.box(-0.17, -0.09, -0.11, 0.09, 0, 3, WOOD_DARK) + T2.box(0.11, -0.09, 0.17, 0.09, 0, 3, WOOD_DARK) + T2.box(-0.34, -0.065, 0.3, 0.065, 3, 12, BARK) + ell2(...T2.p(0.3, 0, 7.5), 2.2, 3.4, "none", ' stroke="#C9935E" stroke-width="0.6"') + ell2(...T2.p(0.3, 0, 7.5), 0.9, 1.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + [5.4, 8.2, 10.4].map((z, k) => ln2(T2.p(-0.32 + k * 0.05, 0.065, z), T2.p(0.26 - k * 0.04, 0.065, z + 0.3), "rgba(60,35,20,.3)", 0.6)).join("") + ln2(T2.p(-0.3, -0.03, 12), T2.p(0.26, -0.03, 12), "rgba(255,230,190,.35)", 0.8) + T2.face([[0.05, 0.065, 12], [0.15, 0.065, 12], [0.1, 0.065, 7.4]], "#F1D3A1") + T2.face([[0.05, -0.065, 12], [0.15, -0.065, 12], [0.15, 0.065, 12], [0.05, 0.065, 12]], "#E7C08A") + ell2(dx, dy, 6.4, 2.2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + `<path d="${blade}" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>` + ln2([b0x + 3, b0y + 0.8], [b1x - 3, b1y + 0.8], "rgba(255,255,255,.5)", 0.6) + grip(b0x, b0y) + grip(b1x, b1y);
    }, "draw")
  }]
};
var acorn = /* @__PURE__ */ __name((x, y, s = 1) => ell2(x, y, 1.6 * s, 1.9 * s, "#B98552") + `<path d="M${f22(x - 1.8 * s)},${f22(y - 0.8 * s)} q${f22(1.8 * s)},${f22(-2.2 * s)} ${f22(3.6 * s)},0 Z" fill="#7A4E30"/>` + ln2([x, y - 1.9 * s], [x + 0.4 * s, y - 2.8 * s], "#5E3A22", 0.5), "acorn");
var ecureuil = {
  layers: [{
    at: [-0.12, 0.94],
    frame: [-18, -38, 36, 44],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [sx, sy] = T2.p(0, 0, 8);
      const hop = f === 6 ? 2.6 : f === 7 ? 1 : 0;
      const nib = f % 2 && f < 6 ? 0.6 : 0;
      const tail = wave(f, n, 1.2);
      const x = sx - 1;
      const y = sy - 0.6 - hop;
      return T2.shadow(0, 0, 0.13, 0.22) + T2.cyl(0, 0, 0, 8, 0.1, STUMP, "stump") + ell2(sx, sy, 3, 1.4, "none", ' stroke="#B98552" stroke-width="0.6"') + ell2(sx, sy, 1.2, 0.6, "none", ' stroke="#B98552" stroke-width="0.5"') + acorn(...T2.p(0.16, 0.06, 1.6)) + acorn(...T2.p(0.1, 0.16, 1.6), 0.9) + `<path d="M${f22(x - 2)},${f22(y - 2)} C${f22(x - 9)},${f22(y - 2)} ${f22(x - 10 + tail)},${f22(y - 12)} ${f22(x - 6 + tail)},${f22(y - 17)} C${f22(x - 3 + tail)},${f22(y - 20)} ${f22(x + 1.4 + tail)},${f22(y - 16)} ${f22(x - 1 + tail * 0.6)},${f22(y - 13)} C${f22(x - 4)},${f22(y - 10)} ${f22(x - 4)},${f22(y - 5)} ${f22(x + 0.5)},${f22(y - 3)} Z" fill="#D9743A" stroke="#A9521F" stroke-width="0.5"/><path d="M${f22(x - 4)},${f22(y - 4)} C${f22(x - 8)},${f22(y - 6)} ${f22(x - 7 + tail)},${f22(y - 13)} ${f22(x - 4.6 + tail)},${f22(y - 15.6)}" stroke="#F2A266" stroke-width="1" fill="none"/>` + ell2(x + 0.6, y - 4.6, 3.6, 4.6, "#E0823F", ' stroke="rgba(120,50,20,.35)" stroke-width="0.5"') + ell2(x + 2, y - 4, 1.8, 3.2, "#F6D7B0") + ell2(x - 0.6, y - 1.6, 2.8, 1.8, "#C8662E") + dot2(x + 2.6, y - 10 + nib * 0.4, 2.8, "#E0823F") + `<path d="M${f22(x + 1.2)},${f22(y - 12)} l0.2,-3.2 l1.8,2.6 Z" fill="#C8662E"/>` + ln2([x + 1.4, y - 15.2], [x + 1, y - 16.4], "#A9521F", 0.6) + ell2(x + 3.8, y - 9 + nib * 0.4, 1.6, 1.2, "#F6D7B0") + dot2(x + 3.4, y - 10.8 + nib * 0.4, 0.65, "#1E1A17") + dot2(x + 5.2, y - 9.4 + nib * 0.4, 0.5, "#5E3A22") + acorn(x + 4.4, y - 6.6 + nib, 0.9) + ell2(x + 3.4, y - 6 + nib, 1, 0.8, "#C8662E") + ell2(x + 5.2, y - 6.2 + nib, 1, 0.8, "#C8662E");
    }, "draw")
  }]
};
var STAG_AT = [0.9, -0.3];
var antler = /* @__PURE__ */ __name((x, y, s, c, w = 1.2) => `<path d="M${f22(x)},${f22(y)} q${-1 * s},-5 ${2 * s},-9 q${2 * s},-3 ${1 * s},-7 M${f22(x + 0.5 * s)},${f22(y - 4)} q${-3 * s},-1 ${-4 * s},-4.4 M${f22(x + 1.6 * s)},${f22(y - 8.4)} q${-3 * s},-1 ${-3.6 * s},-4.2 M${f22(x + 2.2 * s)},${f22(y - 10.6)} q${2 * s},-1 ${3 * s},-4.2" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`, "antler");
var cerf = {
  light: /* @__PURE__ */ __name(() => [STAG_AT[0], STAG_AT[1], 28, 18, "255,236,190"], "light"),
  layers: [{
    at: STAG_AT,
    frame: [-26, -50, 50, 56],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const graze = f >= 3 && f <= 5 ? 1 : 0;
      const hx = x - 9 - graze * 1.6;
      const hy = y - 22 + graze * 13;
      const coat = "#FBF8F2";
      const shade = "#E2DBCD";
      const motes = [0, 1, 2].map((k) => star(hx + 2 + Math.cos(k * 2.1 + f * 0.8) * 6, hy - 10 - k * 3 + wave(f, n, 1.5, k), 1.3, "#FFF2B0", 0.4 + Math.max(0, wave(f, n, 0.6, k * 2)))).join("");
      return ell2(x, y + 0.5, 11, 2.6, "rgba(40,55,20,.24)") + [[-5.4, 0, shade], [3.6, 0, shade], [-3, 0.8, coat], [6, 0.8, coat]].map(([dx, dy, c]) => ln2([x + dx, y - 10], [x + dx, y + dy - 0.6], c, 1.7) + `<rect x="${f22(x + dx - 0.9)}" y="${f22(y + dy - 1)}" width="1.8" height="1.4" fill="#5E4A3A"/>`).join("") + `<path d="M${f22(x + 8.6)},${f22(y - 14.4)} q${f % 2 ? 2.6 : 1.8},${f % 2 ? -1.6 : -2.4} 1.4,-3.6" stroke="${coat}" stroke-width="2" stroke-linecap="round" fill="none"/>` + ell2(x + 0.6, y - 12.6, 9.4, 4.8, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.6"') + ell2(x + 1.4, y - 9.6, 7, 1.6, shade) + `<path d="M${f22(x - 6)},${f22(y - 16)} L${f22(hx + 1)},${f22(hy - 1)} L${f22(hx + 3)},${f22(hy + 2)} L${f22(x - 4.6)},${f22(y - 10.4)} Z" fill="${coat}"/>` + antler(hx + 2.4, hy - 2.2, 1, "rgba(255,236,170,.35)", 3) + antler(hx + 2.4, hy - 2.2, 1, "#C8962E") + ell2(hx, hy, 3.8, 2.5, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.5"') + ell2(hx - 2.6, hy + 0.9, 1.9, 1.4, shade) + dot2(hx - 4.2, hy + 0.6, 0.8, "#5E4A3A") + dot2(hx - 0.6, hy - 0.6, 0.65, "#2A2420") + `<ellipse cx="${f22(hx + 3.2)}" cy="${f22(hy - 1.4)}" rx="2.4" ry="1" fill="${coat}" stroke="rgba(120,105,80,.3)" stroke-width="0.4" transform="rotate(${f === 1 ? -45 : -20} ${f22(hx + 3.2)} ${f22(hy - 1.4)})"/>` + antler(hx + 0.4, hy - 2, -1, "rgba(255,236,170,.35)", 3) + antler(hx + 0.4, hy - 2, -1, "#E9BF4E") + motes;
    }, "draw")
  }]
};
var seauCuivre = {
  layers: [{
    at: [0.3, 0.88],
    frame: [-14, -24, 28, 30],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 0);
      return ell2(x + 3, y + 1.4, 8, 2.4, "rgba(110,190,230,.45)") + ell2(x + 1.6, y + 0.6, 6.4, 2, "rgba(40,55,20,.2)") + bucket(T2, 0, 0, 0, 10, 5, 6.6, COPPER, "cb") + `<path d="M${f22(x - 6.6)},${f22(y - 10)} Q${f22(x)},${f22(y - 20)} ${f22(x + 6.6)},${f22(y - 10)}" stroke="${COPPER.right}" stroke-width="1" fill="none"/>` + dot2(x - 6.6, y - 10, 0.8, COPPER.right) + dot2(x + 6.6, y - 10, 0.8, COPPER.right) + ln2([x - 3.6, y - 7.6], [x - 3.2, y - 2.2], "rgba(255,240,220,.5)", 1);
    }, "draw")
  }]
};
var poulie = {
  layers: [{
    at: { 1: [0.44, 0], 2: [0.84, 0.32] },
    frame: [-22, -50, 40, 56],
    draw: /* @__PURE__ */ __name((T2, level) => {
      if (level === 1) {
        return wheel(T2, 0.02, 0, 32.5, 0.2, "v", { rim: WOOD_DARK.right, spokes: 8, width: 1.8 }) + ln2(T2.p(0.02, 0, 32.5), T2.p(0.1, 0, 32.5), IRON.right, 1.4) + ln2(T2.p(0.1, 0, 32.5), T2.p(0.1, 0, 26), WOOD.right, 1.6);
      }
      const [px, py] = T2.p(-0.22, 0, 33);
      return T2.shadow(0, 0, 0.08, 0.2) + T2.box(-0.05, -0.05, 0.05, 0.05, 0, 3, STONE) + T2.box(-0.022, -0.022, 0.022, 0.022, 3, 40, WOOD_DARK) + T2.box(-0.26, -0.018, 0.02, 0.018, 37, 40, WOOD) + ln2(T2.p(0, 0, 28), T2.p(-0.1, 0, 38), WOOD_DARK.right, 1.3) + wheel(T2, -0.22, 0, 34, 0.05, "u", { rim: IRON.right, spokes: 4, width: 1.2 }) + ln2([px + 1.6, py], [px + 1.6, py + 14], "#8A6A4A", 0.7) + bucket(T2, -0.22, 0, 17, 6, 3, 3.8, PAIL, "hb");
    }, "draw")
  }]
};
var abreuvoir = {
  layers: [{
    at: [-0.78, 0.66],
    frame: [-24, -18, 48, 26],
    draw: /* @__PURE__ */ __name((T2) => T2.shadow(0, 0, 0.2, 0.18) + T2.box(-0.18, -0.075, 0.18, 0.075, 0, 7, STONE) + T2.face([[-0.15, -0.05, 6.4], [0.15, -0.05, 6.4], [0.15, 0.05, 6.4], [-0.15, 0.05, 6.4]], "#5AAED7") + ln2(T2.p(-0.1, -0.02, 6.4), T2.p(0.04, -0.02, 6.4), "rgba(255,255,255,.6)", 0.8) + [[-0.16, 0.08], [0.1, 0.08], [0.19, 0]].map(([a, b]) => {
      const [x, y] = T2.p(a, b, 0);
      return `<path d="M${f22(x - 2)},${f22(y)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`;
    }).join(""), "draw")
  }, {
    at: [-0.5, 0.74],
    frame: [-22, -28, 38, 32],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [x, y] = T2.p(0, 0, 0);
      const drink = f >= 2 && f <= 5 ? 1 : 0;
      const hx = x - 9.6 - drink * 1.2;
      const hy = y - 13.4 + drink * 4.2;
      const tail = f % 2 ? 2 : -1;
      return ell2(x, y + 0.4, 9, 2, "rgba(40,55,20,.25)") + [[-5, 0], [-2.4, 0.6], [3, 0], [5.4, 0.6]].map(([dx, dy]) => ln2([x + dx, y - 6], [x + dx, y + dy], "#9C8A78", 1.5) + `<rect x="${f22(x + dx - 0.9)}" y="${f22(y + dy - 0.8)}" width="1.8" height="1.2" fill="#3A2A1E"/>`).join("") + `<path d="M${f22(x + 7.4)},${f22(y - 11)} q2.6,${f22(-2 - tail)} 1.6,${f22(-4 - tail)}" stroke="#FBF6EA" stroke-width="2" stroke-linecap="round" fill="none"/>` + ell2(x + 0.6, y - 9.2, 8.2, 4.6, "#FBF6EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.6"') + ell2(x + 1, y - 6.6, 6.4, 1.8, "#E6DCC8") + `<path d="M${f22(x - 6)},${f22(y - 11)} L${f22(hx + 1.6)},${f22(hy - 1.4)} L${f22(hx + 2.4)},${f22(hy + 2.2)} L${f22(x - 5)},${f22(y - 7)} Z" fill="#FBF6EA"/>` + ell2(hx, hy, 3.7, 2.8, "#FBF6EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.6"') + `<path d="M${f22(hx + 0.6)},${f22(hy - 2.4)} q0.6,-4.4 3.6,-4.8 M${f22(hx - 0.8)},${f22(hy - 2.6)} q-0.2,-4.2 2,-5" stroke="#B8A27E" stroke-width="1.1" fill="none" stroke-linecap="round"/><ellipse cx="${f22(hx + 3.2)}" cy="${f22(hy - 1.2)}" rx="2.2" ry="1" fill="#FBF6EA" transform="rotate(${f === 3 ? -40 : -15} ${f22(hx + 3.2)} ${f22(hy - 1.2)})"/><path d="M${f22(hx - 2)},${f22(hy + 2.4)} l-0.4,2.6 l1.4,-1.8 Z" fill="#D9CCB4"/>` + dot2(hx - 3.2, hy + 0.4, 0.7, "#E9A3A3") + dot2(hx - 0.8, hy - 0.8, 0.65, "#2A2420");
    }, "draw")
  }]
};
var PUMP_AT = [0.74, -0.62];
var pompe = {
  layers: [{
    at: PUMP_AT,
    frame: [-18, -42, 36, 48],
    back: true,
    draw: /* @__PURE__ */ __name((T2) => {
      const [sx, sy] = T2.p(0, 0.05, 16);
      const [kx, ky] = T2.p(0, 0, 29);
      return T2.shadow(0, 0.06, 0.16, 0.18) + T2.box(-0.12, -0.1, 0.12, 0.1, 0, 3, STONE) + T2.cyl(0, 0, 3, 25, 0.055, CAST, "body") + T2.cyl(0, 0, 25, 27, 0.075, CAST, "cap") + dot2(kx, ky, 1.6, CAST.left) + `<path d="M${f22(sx - 1.6)},${f22(sy - 1)} L${f22(sx - 7)},${f22(sy + 1.4)} L${f22(sx - 7)},${f22(sy + 3.4)} L${f22(sx - 1.6)},${f22(sy + 1.6)} Z" fill="${CAST.right}"/>` + bucket(T2, 0, 0.24, 0, 7, 3.4, 4.4, PAIL, "pb");
    }, "draw")
  }, {
    at: PUMP_AT,
    frame: [-12, -40, 32, 46],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [px, py] = T2.p(0, 0, 27);
      const a = wave(f, n, 1);
      const [sx, sy] = T2.p(0, 0.05, 16);
      const flowing = a < -0.2;
      return ln2([px - 4, py + 1 + a * 2.4], [px + 15, py + 6.6 - a * 9], CAST.right, 2) + ln2([px - 4, py + 0.4 + a * 2.4], [px + 15, py + 6 - a * 9], CAST.top, 0.6) + dot2(px + 15, py + 6.6 - a * 9, 1.4, CAST.left) + ln2([px - 3, py + 1 + a * 2.4], [px - 3, py + 4], CAST.right, 1) + dot2(px, py + 0.8, 1.2, CAST.top) + (flowing ? `<path d="M${f22(sx - 6.6)},${f22(sy + 3)} q-0.6,4 0,7.6" stroke="#8FD0F0" stroke-width="1.8" fill="none" stroke-linecap="round"/>` + ell2(sx - 6.6, sy + 11.2, 2.4, 0.9, "none", ' stroke="rgba(255,255,255,.75)" stroke-width="0.6"') : "");
    }, "draw")
  }]
};
var sourcier = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-18, -34, 36, 40],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const cx = x;
      const cy = y - 17 + wave(f, n, 1.2);
      const ripple = f % 3 / 3;
      const jet = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        return dot2(x + (k - 1) * 3 * t, y - 1 - Math.sin(t * Math.PI) * 5, 0.8, `rgba(150,215,245,${f22(1 - t * 0.6)})`);
      }).join("");
      return ell2(x, y + 0.4, 7.6, 2.8, "rgba(110,190,230,.45)") + ell2(x, y + 0.2, 4.8, 1.7, "#5AAED7") + ell2(x, y + 0.2, 3 + ripple * 5, 1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T2.pebble(-0.13, 0.04, 2) + T2.pebble(0.11, 0.08, 1.8) + T2.pebble(0.05, -0.11, 1.5) + [[-8, 1], [7, 2]].map(([dx, dy]) => `<path d="M${f22(x + dx - 2)},${f22(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("") + jet + ell2(cx, cy + 8, 5, 1.4, "rgba(255,240,180,.3)") + `<g transform="rotate(${f22(wave(f, n, 6, 1))} ${f22(cx)} ${f22(cy)})"><path d="M${f22(cx - 7)},${f22(cy - 6)} Q${f22(cx - 3)},${f22(cy - 2)} ${f22(cx)},${f22(cy + 2)} M${f22(cx + 7)},${f22(cy - 6)} Q${f22(cx + 3)},${f22(cy - 2)} ${f22(cx)},${f22(cy + 2)} L${f22(cx)},${f22(cy + 6)}" stroke="${WOOD.right}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f22(cx - 6.6)},${f22(cy - 6.4)} Q${f22(cx - 3)},${f22(cy - 2.6)} ${f22(cx - 0.4)},${f22(cy + 1.4)}" stroke="${WOOD.top}" stroke-width="0.5" fill="none"/>` + leaf(cx + 4.6, cy - 3.8, -50, 0.28) + "</g>";
    }, "draw")
  }]
};
function duck(x, y, s, flip, adult) {
  const d = flip ? -1 : 1;
  const X = /* @__PURE__ */ __name((dx) => f22(x + d * dx * s), "X");
  const Y = /* @__PURE__ */ __name((dy) => f22(y + dy * s), "Y");
  const body = adult ? "#FFFDF8" : "#FFE07A";
  const wing = adult ? "#E9DFCB" : "#F2C94E";
  return ell2(x - d * 3 * s, y + 0.4, 4 * s, 1.1 * s, "none", ' stroke="rgba(255,255,255,.65)" stroke-width="0.6"') + `<path d="M${X(-4.6)},${Y(-1.2)} L${X(-6)},${Y(-4.2)} L${X(-3)},${Y(-3)} Z" fill="${wing}"/><path d="M${X(-4.6)},${Y(-1.2)} Q${X(-5)},${Y(-4.6)} ${X(-1)},${Y(-4)} Q${X(3)},${Y(-3.8)} ${X(4)},${Y(-1.4)} Q${X(0)},${Y(0.6)} ${X(-4.6)},${Y(-1.2)} Z" fill="${body}" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/><path d="M${X(-2.6)},${Y(-2.6)} Q${X(-0.4)},${Y(-4.2)} ${X(1.8)},${Y(-2.4)} Q${X(-0.4)},${Y(-1.4)} ${X(-2.6)},${Y(-2.6)} Z" fill="${wing}"/><path d="M${X(1.6)},${Y(-3.4)} L${X(2.2)},${Y(-6.4)} L${X(3.6)},${Y(-6)} L${X(3.4)},${Y(-2.8)} Z" fill="${body}"/>` + dot2(x + d * 2.8 * s, y - 6.6 * s, 2 * s, body) + `<path d="M${X(4.4)},${Y(-6.8)} l${f22(d * 2.6 * s)},${f22(0.6 * s)} l${f22(-d * 2.6 * s)},${f22(0.8 * s)} Z" fill="#F08A3A"/>` + dot2(x + d * 3.4 * s, y - 7.2 * s, 0.5 * s, "#2A2420");
}
__name(duck, "duck");
var canards = {
  layers: [{
    at: [0.78, 0.74],
    frame: [-26, -28, 52, 34],
    n: 12,
    fps: 2,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const reed = /* @__PURE__ */ __name((dx, dy, k) => ln2([x + dx, y + dy], [x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 9 - k % 2 * 2], "#6FA35A", 0.8) + ell2(x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 8 - k % 2 * 2, 0.9, 2.2, "#8B5631"), "reed");
      const swimmers = [[0, 1.1, true], [0.8, 0.6, false], [1.4, 0.6, false]].map(([lag, s, adult]) => {
        const a = f / n * Math.PI * 2 - lag;
        return { y: y - 0.6 + Math.sin(a) * 3, svg: duck(x + Math.cos(a) * 8, y - 0.6 + Math.sin(a) * 3, s, Math.sin(a) > 0, adult) };
      }).sort((p, q) => p.y - q.y).map((p) => p.svg).join("");
      return ell2(x, y + 0.6, 16, 7.4, "#79BE5C") + ell2(x, y, 14, 6.2, "#5AAED7") + ell2(x - 3.6, y - 2, 6, 1.8, "rgba(255,255,255,.3)") + reed(-10, -3, 0) + reed(-8, -4.6, 1) + reed(8.6, -4.2, 2) + reed(10.8, -2.8, 3) + swimmers + T2.pebble(0.22, 0.1, 1.8) + T2.pebble(-0.16, 0.2, 1.6) + [[-12, 4], [11, 4.4]].map(([dx, dy]) => `<path d="M${f22(x + dx - 2)},${f22(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("");
    }, "draw")
  }]
};
var NAIAD_AT = [-0.9, 0.1];
var MARBLE = { top: "#FFFFFF", left: "#ECEAF2", right: "#C3BFD0" };
var naiade = {
  light: /* @__PURE__ */ __name(() => [NAIAD_AT[0], NAIAD_AT[1], 14, 22, "170,225,255"], "light"),
  layers: [{
    at: NAIAD_AT,
    frame: [-22, -60, 44, 66],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [wx, wy] = T2.p(0, 0, 6);
      const [x, y] = T2.p(0, 0, 17);
      const marble = T2.id("marble");
      const [ux, uy] = [x - 5.4, y - 14.6];
      const ripple = f % 4 / 4;
      return T2.shadow(0, 0, 0.24, 0.22) + T2.cyl(0, 0, 0, 6, 0.22, MARBLE, "basin") + T2.disc(0, 0, 6, 0.19, "#7CC8EC") + ell2(wx - 3, wy - 1, 4, 1, "rgba(255,255,255,.45)") + T2.box(-0.06, -0.06, 0.06, 0.06, 6, 17, MARBLE) + gradient(marble, "#FFFFFF", "#C9C5D6") + `<path d="M${f22(x - 3.6)},${f22(y - 13)} L${f22(x + 3.4)},${f22(y - 13)} Q${f22(x + 5.4)},${f22(y - 5)} ${f22(x + 5.2)},${f22(y)} L${f22(x - 5)},${f22(y)} Q${f22(x - 5.4)},${f22(y - 6)} ${f22(x - 3.6)},${f22(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>` + [-2, 0.6, 3].map((dx) => `<path d="M${f22(x + dx * 0.6)},${f22(y - 12)} q${f22(dx * 0.3)},6 ${f22(dx * 0.8)},11.6" stroke="rgba(120,110,140,.3)" stroke-width="0.5" fill="none"/>`).join("") + `<path d="M${f22(x - 3)},${f22(y - 20)} L${f22(x + 3)},${f22(y - 20)} L${f22(x + 3.4)},${f22(y - 13)} L${f22(x - 3.6)},${f22(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/><path d="M${f22(x + 2.8)},${f22(y - 19.4)} q2.6,3 0.6,6.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + dot2(x, y - 23, 2.7, "#F4F2F8") + dot2(x + 1.6, y - 24.6, 1.6, "#E4E1EC") + `<path d="M${f22(x + 2)},${f22(y - 23)} q1.4,3 0.4,5" stroke="#DAD6E4" stroke-width="1" fill="none"/><path d="M${f22(x - 2.6)},${f22(y - 19.4)} q-2.8,1.6 -2.4,4.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/><g transform="rotate(-38 ${f22(ux)} ${f22(uy)})">${ell2(ux, uy, 2.6, 3.2, "#E4E1EC", ' stroke="rgba(90,80,110,.4)" stroke-width="0.5"')}<rect x="${f22(ux - 1.3)}" y="${f22(uy - 4.8)}" width="2.6" height="1.8" fill="#DAD6E4"/></g><path d="M${f22(ux - 3.6)},${f22(uy - 2)} Q${f22(ux - 6)},${f22(uy + 2)} ${f22(ux - 5.4)},${f22(wy - 1)}" stroke="rgba(170,225,255,.45)" stroke-width="3" fill="none"/><path d="M${f22(ux - 3.6)},${f22(uy - 2)} Q${f22(ux - 6)},${f22(uy + 2)} ${f22(ux - 5.4)},${f22(wy - 1)}" stroke="#E8F7FF" stroke-width="1.2" fill="none" stroke-dasharray="2.2 1.4" stroke-dashoffset="${f22(-f * 0.9)}"/>` + ell2(ux - 5.4, wy - 0.6, 1.6 + ripple * 4, 0.6 + ripple * 1.4, "none", ` stroke="rgba(255,255,255,${f22(0.85 - ripple * 0.75)})" stroke-width="0.6"`);
    }, "draw")
  }]
};
var CANNE = {
  1: { at: [0.62, 0.2], tip: [0.08, 0.26, 34], bob: [-0.02, 0.28], pail: [0.12, -0.1] },
  2: { at: [0.73, 0.45], tip: [0.13, -0.07, 28], bob: [0.09, -0.13], pail: [-0.1, 0.16] }
};
var canne = {
  layers: [{
    at: { 1: CANNE[1].at, 2: CANNE[2].at },
    frame: [-26, -40, 42, 54],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const c = CANNE[Math.min(level, 2)];
      const [bx, by] = T2.p(0, 0, 10);
      const [tx, ty] = T2.p(...c.tip);
      const dip = f === 5 || f === 6 ? 1.8 : wave(f, n, 0.5);
      const [ox, oy] = T2.p(c.bob[0], c.bob[1], 0);
      const ripple = f % 4 / 4;
      const [px, py] = T2.p(c.pail[0], c.pail[1], 10);
      return ell2(ox, oy + 0.6, 3 + ripple * 5, 1.1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.7"`) + `<path d="M${f22(tx)},${f22(ty)} Q${f22((tx + ox) / 2 + 2)},${f22((ty + oy) / 2 + 2)} ${f22(ox)},${f22(oy - 1 + dip)}" stroke="rgba(255,255,255,.8)" stroke-width="0.5" fill="none"/>` + dot2(ox, oy - 1.4 + dip, 1.9, "#E2463A") + `<path d="M${f22(ox - 1.9)},${f22(oy - 1.4 + dip)} a1.9,1.9 0 0 0 3.8,0 Z" fill="#FFFDF8"/>` + ln2([ox, oy - 3.2 + dip], [ox, oy - 4.8 + dip], "#3D3A36", 0.6) + bucket(T2, c.pail[0], c.pail[1], 10, 6, 3.4, 4.2, PAIL, "pail", false) + `<path d="M${f22(px - 1)},${f22(py - 6.4)} l${f22(-2.4 + f % 2 * 1.2)},-3.4 l2.6,0.8 Z" fill="#9FB8C8"/>` + ell2(px + 1, py - 6.2, 2, 0.9, "#C7D6E0") + T2.box(-0.02, -0.02, 0.02, 0.02, 10, 15, WOOD_DARK) + `<path d="M${f22(bx)},${f22(by - 3)} Q${f22((bx + tx) / 2 - 1.5)},${f22((by + ty) / 2 - 3)} ${f22(tx)},${f22(ty)}" stroke="${WOOD_DARK.right}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(bx + (tx - bx) * 0.18, by - 3 + (ty - by) * 0.16, 1.4, "#3D3A36");
    }, "draw")
  }]
};
var filet = {
  layers: [{
    at: { 1: [0.34, -0.06], 2: [0.6, -0.04] },
    frame: [-18, -24, 36, 28],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 10);
      const heap = `M${f22(x - 11)},${f22(y + 1)} Q${f22(x - 10)},${f22(y - 6)} ${f22(x - 4)},${f22(y - 7)} Q${f22(x + 1)},${f22(y - 11)} ${f22(x + 6)},${f22(y - 6)} Q${f22(x + 11)},${f22(y - 4)} ${f22(x + 10)},${f22(y + 1.5)} Q${f22(x)},${f22(y + 4.5)} ${f22(x - 11)},${f22(y + 1)} Z`;
      let mesh = "";
      for (let k = -14; k <= 14; k += 2.6) mesh += ln2([x + k - 6, y + 4], [x + k + 4, y - 11], "rgba(120,85,45,.55)", 0.5) + ln2([x + k + 6, y + 4], [x + k - 4, y - 11], "rgba(120,85,45,.55)", 0.5);
      const floats = [[-9, 0], [-4, 2.6], [2, 3], [8, 0.6]].map(([dx, dy], k) => ell2(x + dx, y + dy, 2, 1.4, k % 2 ? "#FFFDF8" : "#F08A3A", ` stroke="${OUT}" stroke-width="0.5"`)).join("");
      return ell2(x + 1, y + 2.6, 12, 3, "rgba(40,30,20,.22)") + `<defs><clipPath id="${T2.id("net")}"><path d="${heap}"/></clipPath></defs><path d="${heap}" fill="#D9BC8C" stroke="#A88350" stroke-width="0.8"/><g clip-path="url(#${T2.id("net")})">${mesh}<path d="M${f22(x - 8)},${f22(y - 1)} q7,-4 15,0" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none"/></g><path d="M${f22(x - 1)},${f22(y - 5.4)} q3,-2 6,0 q-3,2 -6,0 Z M${f22(x + 5)},${f22(y - 5.4)} l2,-1.6 l0,3.2 Z" fill="#B8CCD8"/>` + dot2(x + 0.6, y - 5.6, 0.4, "#2A2420") + floats;
    }, "draw")
  }]
};
var casier = {
  layers: [{
    at: [-0.84, 0.46],
    frame: [-18, -24, 40, 30],
    draw: /* @__PURE__ */ __name((T2) => {
      const slatL = [-0.07, -0.025, 0.02, 0.065].map((du) => T2.face([[du, 0.08, 0], [du + 0.022, 0.08, 0], [du + 0.022, 0.08, 12], [du, 0.08, 12]], WOOD.top, EDGE)).join("");
      const slatR = [-0.05, 0, 0.05].map((dv) => T2.face([[0.1, dv, 0], [0.1, dv + 0.022, 0], [0.1, dv + 0.022, 12], [0.1, dv, 12]], WOOD.left, EDGE)).join("");
      const [bx, by] = T2.p(0.2, 0.16, 0);
      const [rx, ry] = T2.p(0.1, 0.06, 6);
      return T2.shadow(0, 0, 0.14, 0.2) + T2.box(-0.1, -0.08, 0.1, 0.08, 0, 12, { top: "rgba(58,42,30,.85)", left: "rgba(58,42,30,.85)", right: "rgba(40,28,20,.85)" }, "") + T2.face([[-0.03, 0.08, 3], [0.04, 0.08, 3], [0.04, 0.08, 9], [-0.03, 0.08, 9]], "rgba(200,170,120,.5)") + slatL + slatR + T2.box(-0.1, -0.08, 0.1, 0.08, 11, 12.5, WOOD) + [-0.04, 0.03].map((du) => T2.face([[du, -0.08, 12.5], [du + 0.025, -0.08, 12.5], [du + 0.025, 0.08, 12.5], [du, 0.08, 12.5]], WOOD_DARK.top)).join("") + `<path d="M${f22(rx)},${f22(ry)} Q${f22(bx - 4)},${f22(by - 1)} ${f22(bx - 2)},${f22(by - 1)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + ell2(bx, by - 1.6, 3.4, 2.4, "#E2463A", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(bx - 3.4)},${f22(by - 1.6)} h6.8" stroke="#FFFDF8" stroke-width="1.4"/>`;
    }, "draw")
  }, {
    at: [-0.66, 0.84],
    frame: [-10, -12, 20, 15],
    n: 4,
    fps: 7,
    motion: /* @__PURE__ */ __name((t) => [0, Math.sin(t * 0.7) * 0.1, 0], "motion"),
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [x, y] = T2.p(0, 0, 0);
      const claw = f % 2 ? 1.2 : 0;
      const legs = [-1, 1].map((s) => [0, 1, 2].map((k) => ln2([x + s * 2.4, y - 2.6 + k * 0.9], [x + s * (5.4 + (f + k) % 2 * 0.8), y - 0.6 + k * 0.8], "#C2412E", 0.7)).join("")).join("");
      return ell2(x, y + 0.2, 5, 1.3, "rgba(40,30,20,.25)") + legs + ell2(x, y - 3.6, 4.4, 2.8, "#E2573F", ' stroke="rgba(120,30,20,.5)" stroke-width="0.5"') + ell2(x - 1.2, y - 4.6, 1.6, 0.8, "#F28A72") + [-1, 1].map((s) => `<path d="M${f22(x + s * 3.6)},${f22(y - 4.6)} q${s * 1.6},${f22(-1.6 - claw)} ${s * 2.6},${f22(-2.4 - claw)}" stroke="#E2573F" stroke-width="1.2" fill="none"/><path d="M${f22(x + s * 6.2)},${f22(y - 7 - claw)} l${s * 1.2},-1.4 l${s * 0.4},1.6 l${-s * 0.8},0.2 Z" fill="#E2573F"/>`).join("") + ln2([x - 1.2, y - 6], [x - 1.4, y - 7.8], "#2A2420", 0.5) + ln2([x + 1.2, y - 6], [x + 1.4, y - 7.8], "#2A2420", 0.5) + dot2(x - 1.4, y - 8, 0.6, "#1E1A17") + dot2(x + 1.4, y - 8, 0.6, "#1E1A17");
    }, "draw")
  }]
};
var barque = {
  layers: [{
    at: [0.46, -0.62],
    frame: [-26, -30, 52, 38],
    back: true,
    n: 8,
    fps: 5,
    motion: /* @__PURE__ */ __name((t) => [Math.sin(t * 0.22) * 0.05 - 0.01, 0, Math.sin(t * 1.3) * 0.8], "motion"),
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const rim = [T2.p(0.21, 0, 4), T2.p(0.09, 0.1, 4), T2.p(-0.1, 0.1, 4), T2.p(-0.19, 0, 4.6), T2.p(-0.1, -0.1, 4), T2.p(0.09, -0.1, 4)];
      const side = [T2.p(0.21, 0, 4), T2.p(0.09, 0.1, 4), T2.p(-0.1, 0.1, 4), T2.p(-0.19, 0, 4.6), T2.p(-0.16, 0, 0), T2.p(-0.08, 0.07, 0), T2.p(0.06, 0.07, 0), T2.p(0.18, 0, 0.4)];
      const phase = f / n * Math.PI * 2;
      const oar = /* @__PURE__ */ __name((s) => {
        const lock = T2.p(0, 0.1 * s, 6);
        const lift = Math.sin(phase) > 0 ? 3 : 0;
        const blade = T2.p(Math.cos(phase) * 0.09, 0.27 * s, lift);
        return ln2(lock, blade, WOOD_DARK.right, 1.2) + ell2(blade[0], blade[1], 2.6, 1, WOOD.left, ` transform="rotate(-26 ${f22(blade[0])} ${f22(blade[1])})"`) + (lift ? "" : ell2(blade[0], blade[1] + 1.4, 3.6, 1.1, "none", ' stroke="rgba(255,255,255,.7)" stroke-width="0.6"'));
      }, "oar");
      const [rx, ry] = T2.p(-0.03, 0, 6);
      const lean = Math.cos(phase) * 1.2;
      return ell2(...T2.p(0.01, 0.01, 0), 15, 3.4, "rgba(30,70,110,.25)") + oar(-1) + poly2(rim, WOOD_DARK.top, ` stroke="${OUT}" stroke-width="0.7"`) + T2.face([[-0.02, -0.1, 4], [0.03, -0.1, 4], [0.03, 0.1, 4], [-0.02, 0.1, 4]], WOOD.top) + `<path d="M${f22(rx - 3.2 + lean)},${f22(ry - 1)} L${f22(rx + 3.2 + lean)},${f22(ry - 1)} L${f22(rx + 2.6 + lean)},${f22(ry - 9)} L${f22(rx - 2.6 + lean)},${f22(ry - 9)} Z" fill="#5C83C2"/>` + ln2([rx - 2.4 + lean, ry - 7.4], [rx - 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + ln2([rx + 2.4 + lean, ry - 7.4], [rx + 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + dot2(rx + lean, ry - 11.2, 2.6, "#F1C9A5") + ell2(rx + lean, ry - 12.6, 5, 1.4, "#E9BF4E") + `<path d="M${f22(rx - 2.6 + lean)},${f22(ry - 12.8)} q2.6,-3.4 5.2,0 Z" fill="#E9BF4E"/>` + ln2([rx - 2.6 + lean, ry - 12.9], [rx + 2.6 + lean, ry - 12.9], "#C8504A", 0.8) + poly2(side, WOOD.left, ` stroke="${OUT}" stroke-width="0.7"`) + `<polyline points="${[T2.p(0.19, 0, 2.4), T2.p(0.08, 0.085, 2.2), T2.p(-0.09, 0.085, 2.2), T2.p(-0.18, 0, 2.6)].map(xy3).join(" ")}" fill="none" stroke="#3C2819" stroke-width="0.6"/>` + oar(1);
    }, "draw")
  }]
};
var harpon = {
  layers: [{
    at: [0.5, -0.92],
    frame: [-26, -30, 52, 36],
    draw: /* @__PURE__ */ __name((T2) => {
      const post = /* @__PURE__ */ __name((du) => T2.box(du - 0.016, -0.016, du + 0.016, 0.016, 0, 14, WOOD_DARK) + ln2(T2.p(du, 0, 14), T2.p(du - 0.03, 0, 17.4), WOOD_DARK.right, 1.2) + ln2(T2.p(du, 0, 14), T2.p(du + 0.03, 0, 17.4), WOOD_DARK.right, 1.2), "post");
      const tip = T2.p(0.32, 0, 15.6);
      const neck = T2.p(0.22, 0, 15.2);
      const [cx, cy] = T2.p(-0.14, 0.15, 0);
      const [fx, fy] = T2.p(0.12, 0.14, 0);
      const [ex, ey] = T2.p(-0.3, 0, 15.6);
      return T2.shadow(0, 0.04, 0.26, 0.16) + post(-0.15) + post(0.13) + ln2(T2.p(-0.3, 0, 15.6), neck, WOOD.right, 1.6) + ln2(T2.p(-0.3, 0, 16.2), neck, WOOD.top, 0.5) + poly2([T2.p(0.22, 0, 16.4), tip, T2.p(0.22, 0, 14)], IRON.left, ` stroke="${IRON.right}" stroke-width="0.5"`) + ln2(T2.p(0.25, 0, 15.4), T2.p(0.2, 0, 19), IRON.right, 1) + ln2(T2.p(0.25, 0, 15.2), T2.p(0.21, 0, 12), IRON.right, 1) + `<path d="M${f22(ex)},${f22(ey)} C${f22(ex - 4)},${f22(ey + 5)} ${f22(cx - 7)},${f22(cy - 5)} ${f22(cx - 3)},${f22(cy - 2)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + [0, 1, 2].map((k) => ell2(cx, cy - k * 1.3, 5 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ell2(fx, fy - 2, 3, 2.2, "#D9A877", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(fx, fy - 2.6, 2, 1.1, "#E7C08A");
    }, "draw")
  }]
};
var pelican = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-22, -48, 40, 54],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [x, y] = T2.p(0, 0, 0);
      const [px, py] = T2.p(0, 0, 14);
      const up = f === 2 || f === 3;
      const pouch = f === 4 || f === 5 ? 1 : 0;
      const stretch = f === 6;
      const hx = px - 3.6;
      const hy = py - 17 - (up ? 2 : 0);
      const tipX = up ? hx - 2 : hx - 10;
      const tipY = up ? hy - 9 : hy + 3;
      const ripple = f % 4 / 4;
      return ell2(x, y + 0.4, 5 + ripple * 4, 1.6 + ripple * 1.2, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T2.cyl(0, 0, 0, 14, 0.06, WOOD, "post") + ell2(...T2.p(0, 0, 9), 3.6, 1.6, "none", ' stroke="#C9A16A" stroke-width="1.2"') + ln2([px - 1.6, py - 3], [px - 1.8, py], "#E8A13A", 1) + ln2([px + 1, py - 3], [px + 1.2, py], "#E8A13A", 1) + `<path d="M${f22(px + 4)},${f22(py - 6)} l4,1.4 l-3.4,1.6 Z" fill="#D9D4CA"/>` + (stretch ? `<path d="M${f22(px + 1)},${f22(py - 9)} q5,-9 11,-8 q-3,3 -4,7 Z" fill="#E9E4DA" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/><path d="M${f22(px + 10)},${f22(py - 16.6)} q1.4,-0.4 2,0.6 l-2.6,1.8 Z" fill="#3D3A36"/>` : "") + ell2(px - 0.4, py - 6.4, 6.4, 4.6, "#F4F1EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.5"') + ell2(px + 0.6, py - 6.6, 4.8, 2.8, "#DEDAD0") + `<path d="M${f22(px + 3.6)},${f22(py - 5.4)} l2.4,0.6 l-2.2,1.2 Z" fill="#3D3A36"/><path d="M${f22(px - 4)},${f22(py - 9)} Q${f22(px - 7)},${f22(py - 13)} ${f22(hx + 0.4)},${f22(hy + 1.6)}" stroke="#F4F1EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + dot2(hx, hy, 2.8, "#F4F1EA") + `<path d="M${f22(hx + 0.6)},${f22(hy - 2.6)} q2.4,-1.6 3.4,0.4" stroke="#F2D35A" stroke-width="1" fill="none"/><path d="M${f22(hx - 1.6)},${f22(hy + 0.6)} Q${f22((hx + tipX) / 2)},${f22((hy + tipY) / 2 + 3 + pouch * 4)} ${f22(tipX)},${f22(tipY + 0.6)} L${f22(tipX + 0.4)},${f22(tipY)} Z" fill="#F2B04A" stroke="#C88A20" stroke-width="0.5"/>` + ln2([hx - 1.4, hy - 0.4], [tipX, tipY], "#E8A13A", 1.4) + (f === 2 ? `<path d="M${f22(tipX - 0.6)},${f22(tipY - 0.6)} l-2,-1.8 l0.6,2.6 Z" fill="#9FB8C8"/>` : "") + dot2(hx - 0.6, hy - 0.8, 0.6, "#2A2420");
    }, "draw")
  }]
};
var SIREN_AT = [-0.1, 0.94];
var sirene = {
  light: /* @__PURE__ */ __name(() => [SIREN_AT[0], SIREN_AT[1], 14, 18, "200,240,255"], "light"),
  layers: [{
    at: SIREN_AT,
    frame: [-26, -44, 52, 50],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const ripple = f % 4 / 4;
      const flick = f === 2 || f === 3 ? -2.4 : 0;
      const sway = wave(f, n, 1);
      const mx = x - 1;
      const my = y - 12;
      const hair = "#E2573F";
      const tail = "#3FB5A5";
      return ell2(x, y + 1, 15 + ripple * 4, 4.4 + ripple * 1.2, "none", ` stroke="rgba(255,255,255,${f22(0.75 - ripple * 0.65)})" stroke-width="0.7"`) + ell2(x + 1, y + 0.6, 13, 3.6, "rgba(30,70,110,.25)") + stone(x - 2, y - 4, 10.6, STONE) + stone(x + 7, y - 1.4, 5.4, STONE) + `<path d="M${f22(x - 9)},${f22(y - 1)} q-1,-4 1,-7 M${f22(x - 7)},${f22(y)} q1,-3 -0.4,-6" stroke="#4E9A5A" stroke-width="1" fill="none"/><path d="M${f22(mx - 3)},${f22(my - 16)} Q${f22(mx - 7 + sway)},${f22(my - 9)} ${f22(mx - 5.6 + sway)},${f22(my - 2)} L${f22(mx - 2)},${f22(my - 3)} Q${f22(mx - 3)},${f22(my - 10)} ${f22(mx + 1)},${f22(my - 15)} Z" fill="${hair}"/><path d="M${f22(mx - 3.4)},${f22(my - 4)} Q${f22(mx + 6)},${f22(my - 3)} ${f22(mx + 8)},${f22(my + 4)} Q${f22(mx + 9.6)},${f22(my + 9)} ${f22(mx + 12)},${f22(my + 10 + flick)} L${f22(mx + 10)},${f22(my + 11 + flick * 0.5)} Q${f22(mx + 6)},${f22(my + 8)} ${f22(mx + 4.6)},${f22(my + 3)} Q${f22(mx + 3)},${f22(my)} ${f22(mx - 3)},${f22(my + 0.4)} Z" fill="${tail}" stroke="#23806F" stroke-width="0.5"/>` + [[1, -1.4], [3.6, -0.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${f22(mx + dx - 1)},${f22(my + dy)} q1,-1 2,0" stroke="#7FDCCB" stroke-width="0.5" fill="none"/>`).join("") + `<path d="M${f22(mx + 12)},${f22(my + 10 + flick)} q3,-3 4.6,-1.6 q-1.6,2.4 -1.4,4.2 q-2,-0.4 -3.2,-2.6 Z" fill="#5FD0BE" stroke="#23806F" stroke-width="0.5"/>` + (flick ? [[15, 2], [17, 5], [13, 6]].map(([dx, dy]) => dot2(mx + dx, my + dy, 0.7, "rgba(220,245,255,.9)")).join("") : "") + `<path d="M${f22(mx - 3.4)},${f22(my - 4)} L${f22(mx - 2.6)},${f22(my - 12)} L${f22(mx + 2.6)},${f22(my - 12)} L${f22(mx + 2.4)},${f22(my - 3.6)} Z" fill="#F6CFAE" stroke="rgba(120,70,40,.3)" stroke-width="0.5"/>` + ell2(mx - 1.2, my - 9.6, 1.4, 1.1, "#F28AA8") + ell2(mx + 1.4, my - 9.6, 1.4, 1.1, "#F28AA8") + `<path d="M${f22(mx + 2.4)},${f22(my - 11.4)} q3,-1 3.4,-5" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/><rect x="${f22(mx + 4.2 + sway * 0.4)}" y="${f22(my - 19)}" width="3" height="1.4" rx="0.4" fill="#F2C04B" transform="rotate(-20 ${f22(mx + 5.7)} ${f22(my - 18.3)})"/><path d="M${f22(mx - 2.4)},${f22(my - 11)} q-2.6,3 -1,5.6" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(mx - 3.2, my - 5, 1.6, "#FFFFFF") + dot2(mx - 3.6, my - 5.5, 0.5, "#E8F7FF") + dot2(mx, my - 15, 2.6, "#F6CFAE") + `<path d="M${f22(mx - 2.8)},${f22(my - 15)} Q${f22(mx - 2)},${f22(my - 19.4)} ${f22(mx + 2.8)},${f22(my - 16.4)} Q${f22(mx + 4.4)},${f22(my - 13)} ${f22(mx + 3.6 + sway)},${f22(my - 9)}" stroke="${hair}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${f22(mx - 1.4)},${f22(my - 15.4)} q0.6,0.5 1.2,0" stroke="#5E3A22" stroke-width="0.5" fill="none"/>` + dot2(mx - 0.4, my - 13.4, 0.4, "#E07A7A");
    }, "draw")
  }]
};
var etabli = {
  layers: [{
    at: [0.82, -0.78],
    frame: [-26, -32, 52, 38],
    draw: /* @__PURE__ */ __name((T2) => {
      const legs = [[-0.14, -0.065], [0.14, -0.065], [-0.14, 0.065], [0.14, 0.065]].map(([a, b]) => T2.box(a - 0.016, b - 0.016, a + 0.016, b + 0.016, 0, 11, WOOD_DARK)).join("");
      const [x, y] = T2.p(0, 0, 14);
      const curl = /* @__PURE__ */ __name((dx, dy, w) => `<path d="M${f22(x + dx)},${f22(y + dy - 1)} a1.2,1 0 1 1 1.2,1" stroke="#E7C08A" stroke-width="${w}" fill="none"/>`, "curl");
      return T2.shadow(0, 0, 0.22, 0.18) + legs + T2.box(-0.13, -0.05, 0.13, 0.05, 3, 4.5, WOOD_DARK) + T2.box(-0.1, -0.035, 0.06, 0.035, 4.5, 7, { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" }) + T2.box(-0.17, -0.08, 0.17, 0.08, 11, 14, { top: "#EBC08A", left: WOOD.left, right: WOOD.right }) + T2.box(0.13, 0.05, 0.19, 0.1, 9, 15.5, DARK_IRON) + ln2(T2.p(0.16, 0.1, 12), T2.p(0.16, 0.18, 12), IRON.top, 0.9) + T2.box(-0.08, -0.03, 0, 0.01, 14, 16.5, WOOD) + T2.face([[-0.05, -0.03, 16.5], [-0.035, -0.03, 16.5], [-0.035, 0.01, 18], [-0.05, 0.01, 18]], IRON.right) + ln2([x + 2, y - 0.6], [x + 9, y - 3.6], WOOD.right, 1.3) + `<rect x="${f22(x + 1)}" y="${f22(y - 2.6)}" width="3.6" height="2.2" rx="0.4" fill="${DARK_IRON.left}" transform="rotate(-22 ${f22(x + 2.8)} ${f22(y - 1.5)})"/>` + curl(-8, 1, 0.6) + curl(-5, 3, 0.6) + curl(4, 2.2, 0.6) + curl(-10, 15, 0.7) + curl(6, 16, 0.7) + curl(11, 14, 0.7);
    }, "draw")
  }]
};
var ENCLUME = { 1: [-0.72, 0.76], 2: [-0.04, 0.86] };
var enclume = {
  light: /* @__PURE__ */ __name((level) => {
    const [u, v] = ENCLUME[Math.min(level, 2)];
    return [u - 0.02, v, 18, 12];
  }, "light"),
  layers: [{
    at: ENCLUME,
    frame: [-18, -28, 38, 34],
    draw: /* @__PURE__ */ __name((T2) => {
      const steel = { top: "#9AA6B2", left: "#6E7A86", right: "#4F5A64" };
      const [hx, hy] = T2.p(-0.13, 0.11, 0);
      const [bx, by] = T2.p(0, 0.12, 0);
      return T2.shadow(0, 0, 0.17, 0.2) + T2.cyl(0, 0, 0, 9, 0.12, STUMP, "stump") + [-4, -1, 2, 5].map((dx) => ln2([bx + dx, by - 1], [bx + dx * 0.95, by - 8], "rgba(60,40,25,.5)", 0.6)).join("") + T2.box(-0.07, -0.05, 0.07, 0.05, 9, 11, DARK_IRON) + T2.box(-0.035, -0.03, 0.035, 0.03, 11, 15, DARK_IRON) + T2.box(-0.11, -0.05, 0.08, 0.05, 15, 18.5, steel) + T2.face([[0.08, 0.05, 15], [0.18, 0, 17.4], [0.08, 0.05, 18.5]], steel.left, EDGE) + T2.face([[0.08, -0.05, 18.5], [0.18, 0, 17.6], [0.08, 0.05, 18.5]], steel.top, EDGE) + T2.face([[0.08, -0.05, 15], [0.18, 0, 17.4], [0.08, -0.05, 18.5]], steel.right) + ln2(T2.p(-0.09, -0.02, 18.6), T2.p(0.06, -0.02, 18.6), "rgba(255,255,255,.55)", 0.7) + ln2([hx, hy - 1], [hx + 3, hy - 12], WOOD.right, 1.5) + `<rect x="${f22(hx + 0.4)}" y="${f22(hy - 15)}" width="5.6" height="3" rx="0.6" fill="${DARK_IRON.left}" transform="rotate(16 ${f22(hx + 3)} ${f22(hy - 13.5)})"/>`;
    }, "draw")
  }, {
    at: ENCLUME,
    frame: [-12, -30, 24, 20],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(-0.02, 0, 18.6);
      const heat = 0.75 + wave(f, n, 0.25);
      const spark = f === 0 || f === 1;
      const rot = ` transform="rotate(-8 ${f22(x)} ${f22(y)})"`;
      return `<rect x="${f22(x - 4.6)}" y="${f22(y - 1.6)}" width="9" height="2.2" rx="1" fill="#E2463A"${rot}/><rect x="${f22(x - 3.4)}" y="${f22(y - 1.3)}" width="6.4" height="1.2" rx="0.6" fill="#FFB347" opacity="${f22(heat)}"${rot}/><rect x="${f22(x - 2)}" y="${f22(y - 1.1)}" width="3.4" height="0.7" rx="0.35" fill="#FFF2B0" opacity="${f22(heat)}"${rot}/><path d="M${f22(x - 2)},${f22(y - 4)} q1.4,${f22(-2 - heat)} 0,-5 M${f22(x + 2)},${f22(y - 4)} q-1.4,${f22(-2 - heat)} 0,-5.4" stroke="rgba(255,255,255,${f22(0.18 * heat)})" stroke-width="1" fill="none"/>` + (spark ? [[-5, -6], [4, -8], [7, -4], [-2, -10]].map(([dx, dy], k) => dot2(x + dx * (1 + f * 0.5), y + dy * (1 + f * 0.4), 0.9 - f * 0.3, k % 2 ? "#FFE07A" : "#F7A23B")).join("") : "");
    }, "draw")
  }]
};
var soufflet = {
  layers: [{
    at: [0.84, 0.5],
    frame: [-24, -30, 48, 40],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const open = 4 + wave(f, n, 3);
      const shape = [[0, -0.1], [0.055, -0.065], [0.085, 0.01], [0.075, 0.09], [0.03, 0.135], [-0.03, 0.135], [-0.075, 0.09], [-0.085, 0.01], [-0.055, -0.065]].map(([a, b]) => [a * 1.45, b * 1.45]);
      const z0 = 8;
      const lower = shape.map(([a, b]) => T2.p(a, b, z0));
      const upper = shape.map(([a, b]) => T2.p(a, b, z0 + open));
      const vis = [1, 2, 3, 4, 5, 6, 7];
      const leather = [...vis.map((i) => lower[i]), ...vis.slice().reverse().map((i) => upper[i])];
      const pleats = vis.map((i) => ln2([lower[i][0], lower[i][1] - open * 0.5], [upper[i][0], upper[i][1] + open * 0.2], "rgba(60,30,15,.45)", 0.5)).join("");
      const puff = f >= 1 && f <= 3;
      const [nx, ny] = T2.p(0, -0.24, 8.5);
      const [cx, cy] = T2.p(0, 0.04, z0 + open);
      return T2.shadow(0, 0.02, 0.14, 0.2) + T2.box(-0.08, 0.06, -0.05, 0.09, 0, z0, WOOD_DARK) + T2.box(0.05, 0.06, 0.08, 0.09, 0, z0, WOOD_DARK) + T2.box(-0.02, -0.1, 0.02, -0.07, 0, z0, WOOD_DARK) + poly2(lower, WOOD_DARK.left) + poly2(leather, "#8B5631", ' stroke="#5E3A22" stroke-width="0.5"') + pleats + poly2(upper, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`) + dot2(cx, cy, 1.1, "#5E3A22") + ln2(T2.p(-0.03, 0.19, z0 + open), T2.p(-0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln2(T2.p(0.03, 0.19, z0 + open), T2.p(0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln2(T2.p(0, -0.13, z0 + 0.8), [nx, ny], DARK_IRON.right, 2.4) + ln2(T2.p(0, -0.13, z0 + 1.4), [nx, ny - 0.6], DARK_IRON.top, 0.6) + (puff ? dot2(nx - 2 - f, ny - 1.6 - f * 0.6, 1 + f * 0.5, `rgba(255,255,255,${f22(0.5 - f * 0.12)})`) + dot2(nx - 1, ny - 2.4, 0.6, "#FFB347") : "");
    }, "draw")
  }]
};
var LIFT = [0, 0.2, 0.45, 0.7, 0.9, 1, 1, 0.35];
var marteauPilon = {
  layers: [{
    at: [0.6, 0.92],
    frame: [-22, -46, 44, 52],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const zr = 10 + LIFT[f] * 9;
      const [ax, ay] = T2.p(0, 0, 9.2);
      const [sx, sy] = T2.p(0, 0, 38);
      const strike = f === 0;
      return T2.shadow(0, 0, 0.2, 0.2) + T2.box(-0.14, -0.13, 0.14, 0.13, 0, 3, STONE) + T2.box(-0.035, -0.12, 0.035, -0.08, 3, 29, DARK_IRON) + T2.box(-0.06, -0.05, 0.06, 0.05, 3, 7, DARK_IRON) + T2.box(-0.045, -0.035, 0.045, 0.035, 7, 9, IRON) + `<rect x="${f22(ax - 3.4)}" y="${f22(ay - 1.4)}" width="6.8" height="1.8" rx="0.8" fill="${strike ? "#FFB347" : "#E2463A"}"/>` + T2.box(-0.04, -0.04, 0.04, 0.04, zr, zr + 7, IRON) + ln2(T2.p(0, 0, zr + 7), T2.p(0, 0, 29), IRON.top, 1.4) + T2.box(-0.035, 0.08, 0.035, 0.12, 3, 29, DARK_IRON) + T2.box(-0.05, -0.13, 0.05, 0.13, 29, 32, DARK_IRON) + T2.cyl(0, 0, 32, 38, 0.06, COPPER, "steam") + dot2(sx, sy, 1.1, COPPER.right) + ln2(T2.p(0.04, -0.06, 36), T2.p(0.04, -0.1, 22), COPPER.right, 1.1) + dot2(...T2.p(0, 0.12, 22), 1.8, "#F2EDE2") + ln2(T2.p(0, 0.12, 22), T2.p(0.01, 0.12, 23.2), "#E2463A", 0.6) + (f >= 1 && f <= 4 ? [0, 1].map((k) => dot2(sx + 3 + k * 3 + f, sy - 2 - k * 3 - f, 1.6 + f * 0.5, `rgba(255,255,255,${f22(0.7 - f * 0.12)})`)).join("") : "") + (strike ? [[-7, -4], [6, -5], [-4, -8], [8, -1], [-9, 0]].map(([dx, dy], k) => dot2(ax + dx, ay + dy, 0.9, k % 2 ? "#FFE07A" : "#F7A23B")).join("") : "");
    }, "draw")
  }]
};
var BRASS = { top: "#F6D27A", left: "#D9A84A", right: "#A87A2E" };
var automate = {
  layers: [{
    at: [-0.9, 0.86],
    frame: [-20, -44, 40, 50],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const step = wave(f, n, 1);
      const bob = Math.abs(step) * 0.8;
      const [hx, hy] = T2.p(0, 0, 24.5 + bob);
      const [bx, by] = T2.p(0, 0, 15 + bob);
      const turn = Math.cos(f / n * Math.PI * 2);
      const [kx, ky] = T2.p(-0.13, -0.13, 17 + bob);
      const blink = f === 5;
      const leg = /* @__PURE__ */ __name((du, dv, lift) => T2.box(du - 0.022, dv - 0.022, du + 0.022, dv + 0.022, lift, 9 + bob, DARK_IRON) + T2.box(du - 0.03, dv - 0.03, du + 0.04, dv + 0.04, lift, lift + 2, BRASS), "leg");
      const arm = /* @__PURE__ */ __name((sx, s) => `<g transform="rotate(${f22(step * 24 * s)} ${f22(sx)} ${f22(by - 4)})">${ln2([sx, by - 4], [sx + s * 0.6, by + 3], DARK_IRON.left, 1.6)}${dot2(sx + s * 0.6, by + 3.6, 1.4, BRASS.left)}</g>`, "arm");
      return T2.shadow(0, 0, 0.12, 0.22) + ln2(T2.p(-0.06, -0.06, 17 + bob), [kx, ky], DARK_IRON.right, 1.2) + ell2(kx - 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`) + ell2(kx + 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.top, ` stroke="${BRASS.right}" stroke-width="0.5"`) + leg(-0.03, 0.03, Math.max(0, step) * 2) + leg(0.03, -0.03, Math.max(0, -step) * 2) + arm(bx - 5.6, -1) + T2.cyl(0, 0, 9 + bob, 21 + bob, 0.08, BRASS, "body") + [-3, 0, 3].map((dx) => dot2(bx + dx, by + 4.4, 0.5, BRASS.right)).join("") + dot2(bx, by - 1, 2.2, "#F2EDE2") + ln2([bx, by - 1], [bx + 1.2, by - 2], "#3D3A36", 0.5) + `<circle cx="${f22(bx)}" cy="${f22(by - 1)}" r="2.2" fill="none" stroke="${BRASS.right}" stroke-width="0.6"/>` + arm(bx + 5.6, 1) + T2.cyl(0, 0, 21 + bob, 27 + bob, 0.055, BRASS, "head") + ell2(hx, hy - 2.6, 3.6, 1.8, BRASS.top) + ln2([hx, hy - 3.6], [hx, hy - 8], DARK_IRON.right, 0.7) + dot2(hx, hy - 8.4, 1.1, f % 4 < 2 ? "#7FE0FF" : "#E2463A") + (blink ? ln2([hx - 2.4, hy + 1], [hx - 0.8, hy + 1], "#3D3A36", 0.7) + ln2([hx + 0.8, hy + 1], [hx + 2.4, hy + 1], "#3D3A36", 0.7) : dot2(hx - 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx + 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx - 1.9, hy + 0.7, 0.4, "#FFFFFF") + dot2(hx + 1.3, hy + 0.7, 0.4, "#FFFFFF")) + ln2([hx - 1.4, hy + 3.4], [hx + 1.4, hy + 3.4], BRASS.right, 0.6);
    }, "draw")
  }]
};
var ATHANOR_AT = [-0.4, 0.94];
var GOLD = { top: "#FFE08A", left: "#F0B94A", right: "#C48A26" };
var athanor = {
  light: /* @__PURE__ */ __name(() => [ATHANOR_AT[0], ATHANOR_AT[1], 16, 24, "255,200,110"], "light"),
  layers: [{
    at: ATHANOR_AT,
    frame: [-26, -64, 52, 70],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 22);
      const [fx, fy] = T2.p(0, 0, 9);
      const fire = 0.75 + wave(f, n, 0.25);
      const rx = 0.11 * TW * Math.SQRT1_2;
      const [gx, gy] = [x, y - 17];
      const [qx, qy] = T2.p(0.24, 0.1, 0);
      const bubbles = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        return dot2(gx - 2 + k * 2, gy + 2 - t * 4, 0.6 + t * 0.4, `rgba(255,250,220,${f22(1 - t)})`);
      }).join("");
      return T2.shadow(0, 0, 0.24, 0.22) + T2.box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE) + T2.cyl(0, 0, 3, 22, 0.11, GOLD, "tower") + [8, 15].map((z) => {
        const [lx, ly] = T2.p(0, 0, z);
        return `<path d="M${f22(lx - rx)},${f22(ly)} A${f22(rx)},${f22(rx / 2)} 0 0 0 ${f22(lx + rx)},${f22(ly)}" stroke="${GOLD.right}" stroke-width="1" fill="none"/>`;
      }).join("") + `<path d="M${f22(fx - 3.4)},${f22(fy + 3.6)} L${f22(fx - 3.4)},${f22(fy - 1)} A3.4,3.6 0 0 1 ${f22(fx + 3.4)},${f22(fy - 1)} L${f22(fx + 3.4)},${f22(fy + 3.6)} Z" fill="#4A1E10" stroke="${GOLD.right}" stroke-width="0.8"/>` + ell2(fx, fy + 2, 2.4, 2.6, "#F28A3A", ` opacity="${f22(fire)}"`) + ell2(fx, fy + 2.6, 1.3, 1.6, "#FFE07A", ` opacity="${f22(fire)}"`) + gradient(T2.id("dome"), GOLD.left, GOLD.right) + `<path d="M${f22(x - rx)},${f22(y)} C${f22(x - rx)},${f22(y - 11)} ${f22(x + rx)},${f22(y - 11)} ${f22(x + rx)},${f22(y)} A${f22(rx)},${f22(rx / 2)} 0 0 1 ${f22(x - rx)},${f22(y)} Z" fill="url(#${T2.id("dome")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x - rx * 0.6)},${f22(y - 5)} Q${f22(x - rx * 0.3)},${f22(y - 8)} ${f22(x)},${f22(y - 8.4)}" stroke="rgba(255,255,255,.6)" stroke-width="1" fill="none"/><path d="M${f22(gx + 2)},${f22(gy - 4)} Q${f22(gx + 10)},${f22(gy - 12)} ${f22(qx + 1)},${f22(qy - 9)}" stroke="rgba(230,245,255,.8)" stroke-width="1.6" fill="none"/><path d="M${f22(gx + 2)},${f22(gy - 4)} Q${f22(gx + 10)},${f22(gy - 12)} ${f22(qx + 1)},${f22(qy - 9)}" stroke="rgba(120,150,180,.45)" stroke-width="0.4" fill="none"/><path d="M${f22(gx - 5)},${f22(gy + 1)} A5,5 0 0 0 ${f22(gx + 5)},${f22(gy + 1)} Z" fill="#FFC94A"/>` + bubbles + `<circle cx="${f22(gx)}" cy="${f22(gy)}" r="5" fill="rgba(220,240,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="0.7"/><rect x="${f22(gx - 1.2)}" y="${f22(gy - 8)}" width="2.4" height="3.4" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + dot2(gx - 2, gy - 2, 0.9, "rgba(255,255,255,.8)") + ell2(qx, qy - 3.4, 3.6, 3.6, "rgba(220,240,255,.3)", ' stroke="rgba(255,255,255,.85)" stroke-width="0.6"') + `<path d="M${f22(qx - 3.4)},${f22(qy - 2.6)} A3.6,3.6 0 0 0 ${f22(qx + 3.4)},${f22(qy - 2.6)} Z" fill="#FFC94A"/><rect x="${f22(qx - 0.9)}" y="${f22(qy - 9.4)}" width="1.8" height="2.6" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + (f % 4 === 1 ? dot2(qx + 1, qy - 7 + (f >> 2) * 2, 0.6, "#FFC94A") : "") + star(gx + 7, gy - 3, 1.6, "#FFF2B0", Math.max(0, wave(f, n, 1))) + star(x - rx - 2, y - 2, 1.4, "#FFF2B0", Math.max(0, wave(f, n, 1, 3)));
    }, "draw")
  }]
};
var OVEN_AT = [-0.84, 0.8];
var OVEN_H = 13;
var cuisine = {
  light: /* @__PURE__ */ __name(() => [OVEN_AT[0] - 0.02, OVEN_AT[1] + 0.12, 10, 16], "light"),
  layers: [{
    at: OVEN_AT,
    frame: [-24, -38, 46, 46],
    draw: /* @__PURE__ */ __name((T2) => {
      const [x, y] = T2.p(0, 0, 7);
      const rx = 7.6;
      const ry = 3.8;
      const log = /* @__PURE__ */ __name((a, b, z) => T2.box(a, b, a + 0.045, b + 0.16, z, z + 3.4, BARK), "log");
      const [px, py] = T2.p(0.14, 0.17, 0);
      const joint = "rgba(120,110,95,.4)";
      return T2.shadow(0, 0, 0.22, 0.2) + T2.box(-0.15, -0.15, 0.15, 0.15, 0, 7, STONE) + ln2(T2.p(-0.15, 0.15, 3.5), T2.p(0.15, 0.15, 3.5), joint, 0.6) + [-0.08, 0.02, 0.11].map((du, k) => ln2(T2.p(du, 0.15, k % 2 ? 0 : 3.5), T2.p(du, 0.15, k % 2 ? 3.5 : 7), joint, 0.6)).join("") + `<defs><linearGradient id="${T2.id("dome")}" x1="0" x2="1"><stop offset="0" stop-color="#E3B486"/><stop offset="1" stop-color="#A9724A"/></linearGradient></defs><path d="M${f22(x - rx)},${f22(y)} C${f22(x - rx)},${f22(y - OVEN_H * 1.3)} ${f22(x + rx)},${f22(y - OVEN_H * 1.3)} ${f22(x + rx)},${f22(y)} A${rx},${ry} 0 0 1 ${f22(x - rx)},${f22(y)} Z" fill="url(#${T2.id("dome")})" stroke="${OUT}" stroke-width="0.7"/><path d="M${f22(x - rx * 0.8)},${f22(y - 4)} Q${f22(x)},${f22(y - 1)} ${f22(x + rx * 0.8)},${f22(y - 4)} M${f22(x - rx * 0.55)},${f22(y - 8.4)} Q${f22(x)},${f22(y - 6.4)} ${f22(x + rx * 0.55)},${f22(y - 8.4)}" stroke="rgba(110,60,30,.35)" stroke-width="0.6" fill="none"/>` + T2.cyl(0.02, -0.04, 7 + OVEN_H * 0.9, 7 + OVEN_H * 0.9 + 5, 0.028, { top: "#5E3A2A", left: "#B87E52", right: "#8C5A34" }, "flue") + `<path d="M${f22(x - 5.6)},${f22(y + 1.8)} L${f22(x - 5.6)},${f22(y - 2.4)} A2.6,2.8 0 0 1 ${f22(x - 0.6)},${f22(y - 2.4)} L${f22(x - 0.6)},${f22(y + 2.6)} Z" fill="#3A1E14" stroke="#7A4E30" stroke-width="0.8"/>` + log(0.18, -0.12, 0) + log(0.235, -0.12, 0) + log(0.205, -0.12, 3.4) + ln2([px, py], [px - 9, py - 16], WOOD.right, 1.2) + `<ellipse cx="${f22(px + 1.4)}" cy="${f22(py + 0.6)}" rx="3" ry="1.4" fill="${WOOD.left}" transform="rotate(-30 ${f22(px + 1.4)} ${f22(py + 0.6)})"/>`;
    }, "draw")
  }, {
    at: OVEN_AT,
    frame: [-14, -54, 30, 58],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 7);
      const [cx, cy] = T2.p(0.02, -0.04, 7 + OVEN_H * 0.9 + 5);
      const glow = 0.7 + wave(f, n, 0.3, 1.3);
      const puffs = [0, 1].map((k) => {
        const t = (f / n + k * 0.5) % 1;
        return dot2(cx + 1 + t * 5 + Math.sin(t * 6) * 1.2, cy - 2 - t * 18, 1.8 + t * 3.6, `rgba(236,232,224,${f22(0.6 * (1 - t))})`);
      }).join("");
      return `<ellipse cx="${f22(x - 3.1)}" cy="${f22(y + 0.6)}" rx="1.9" ry="1.6" fill="#F28A3A" opacity="${f22(glow)}"/><ellipse cx="${f22(x - 3.1)}" cy="${f22(y + 1)}" rx="1" ry="0.8" fill="#FFE07A" opacity="${f22(glow)}"/>` + puffs;
    }, "draw")
  }]
};
var HAMMOCK_AT = [0.9, -0.22];
var lit = {
  layers: [{
    at: HAMMOCK_AT,
    frame: [-22, -32, 46, 46],
    draw: /* @__PURE__ */ __name((T2) => T2.shadow(0, -0.5, 0.06, 0.2) + T2.shadow(0, 0.5, 0.06, 0.2) + T2.box(-0.025, -0.525, 0.025, -0.475, 0, 22, WOOD_DARK) + T2.box(-0.025, 0.475, 0.025, 0.525, 0, 22, WOOD_DARK) + ln2(T2.p(0, -0.5, 22), T2.p(0, -0.5, 24), WOOD_DARK.right, 1.4) + ln2(T2.p(0, 0.5, 22), T2.p(0, 0.5, 24), WOOD_DARK.right, 1.4), "draw")
  }, {
    at: HAMMOCK_AT,
    frame: [-20, -26, 42, 34],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const a = T2.p(0, -0.47, 18);
      const b = T2.p(0, 0.47, 18);
      const swing = wave(f, n, 1.4);
      const mx = (a[0] + b[0]) / 2 + swing;
      const my = (a[1] + b[1]) / 2;
      const low = my + 9 + wave(f, n, 0.6, 1);
      const stripe = /* @__PURE__ */ __name((k, color) => `<path d="M${f22(a[0] + 2)},${f22(a[1] + 1 + k)} Q${f22(mx)},${f22(low - 4 + k * 1.6)} ${f22(b[0] - 2)},${f22(b[1] + 1 + k)}" stroke="${color}" stroke-width="1.1" fill="none"/>`, "stripe");
      const kx = a[0] + (b[0] - a[0]) * 0.2 + swing * 0.4;
      const ky = a[1] + (b[1] - a[1]) * 0.2 + 5;
      return ln2(a, [a[0] - 1.2, a[1] + 2.6], "#C9A16A", 0.7) + ln2(b, [b[0] + 1.2, b[1] + 2.6], "#C9A16A", 0.7) + `<path d="M${f22(a[0])},${f22(a[1] + 2)} Q${f22(mx)},${f22(low + 3)} ${f22(b[0])},${f22(b[1] + 2)} Q${f22(mx)},${f22(low - 6)} ${f22(a[0])},${f22(a[1] + 2)} Z" fill="#F3E4C4" stroke="#C9A16A" stroke-width="0.6"/>` + stripe(0, "#E2574C") + stripe(2.2, "#5C83C2") + stripe(4.2, "#E2574C") + ell2(kx, ky, 3.6, 2, "#FFFDF8", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(mx + 1)},${f22(low - 4.6)} l3.4,-1.2 l3.4,1.2 l0,1.6 l-3.4,-1 l-3.4,1 Z" fill="#8C4B32"/><path d="M${f22(mx + 1.4)},${f22(low - 4.8)} l3,-1 l3,1" stroke="#FFFDF8" stroke-width="0.6" fill="none"/>`;
    }, "draw")
  }]
};
var chat = {
  layers: [{
    at: [0.46, 0.8],
    frame: [-14, -16, 28, 20],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const breath = wave(f, n, 0.45);
      const flick = f === 2 || f === 3 ? -1.6 : 0;
      const ear = f === 6 ? -18 : 0;
      return ell2(x, y + 0.4, 9, 2.6, "rgba(40,55,20,.22)") + ell2(x, y - 1, 8.6, 3.2, "#C8504A") + ell2(x - 0.6, y - 1.8, 7.4, 2.4, "#DE6A5E") + [[-8, -0.4], [8, -1], [-6, 1.6], [6, 1.8]].map(([dx, dy]) => dot2(x + dx, y + dy, 0.9, "#F2C04B")).join("") + ell2(x - 0.6, y - 5.4, 6.2 + breath, 3.6 + breath * 0.5, "#F2994A", ' stroke="rgba(120,60,20,.35)" stroke-width="0.5"') + `<path d="M${f22(x - 4)},${f22(y - 8)} q1.4,1.2 1,3 M${f22(x - 1.2)},${f22(y - 8.8)} q1.2,1.4 0.8,3.4 M${f22(x + 1.6)},${f22(y - 8.6)} q1,1.2 0.6,3" stroke="#C8622A" stroke-width="0.9" fill="none"/>` + dot2(x + 4.4, y - 5.2, 3.2, "#F2994A") + `<g transform="rotate(${ear} ${f22(x + 3.4)} ${f22(y - 7.6)})"><path d="M${f22(x + 2.4)},${f22(y - 7.4)} l0.6,-2.8 l1.8,2 Z" fill="#F2994A"/><path d="M${f22(x + 2.8)},${f22(y - 7.6)} l0.4,-1.6 l0.9,1.1 Z" fill="#F7B8B0"/></g><path d="M${f22(x + 5)},${f22(y - 7.8)} l1.4,-2.6 l1.2,2.3 Z" fill="#F2994A"/><path d="M${f22(x + 3.4)},${f22(y - 5.2)} q0.7,0.6 1.4,0 M${f22(x + 5.4)},${f22(y - 5.2)} q0.7,0.6 1.4,0" stroke="#5E3A22" stroke-width="0.6" fill="none"/>` + dot2(x + 6.6, y - 4, 0.5, "#E07A7A") + `<path d="M${f22(x - 6.4)},${f22(y - 3.6)} q-1.4,3.4 3.6,3.8 q4.6,0.2 6.2,-1.4" stroke="#F2994A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${f22(x + 3.4)},${f22(y - 1.2)} q1.6,${f22(-0.6 + flick)} 2.6,${f22(-1.8 + flick)}" stroke="#FFF4E6" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    }, "draw")
  }]
};
var chien = {
  layers: [{
    at: [-0.24, 0.88],
    frame: [-16, -26, 34, 30],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 0);
      const wag = wave(f, n, 3.2);
      const pant = f % 2 ? 0.8 : 0;
      const [gx, gy] = T2.p(0.14, -0.1, 0);
      const head = y - 12.2 + pant * 0.3;
      return ell2(x, y + 0.4, 8, 2, "rgba(40,55,20,.25)") + ell2(gx, gy, 4, 1.6, "#4C7FB5") + ell2(gx, gy - 1, 4, 1.5, "#6FA3D9") + ell2(gx, gy - 1.2, 2.8, 0.9, "#8B5631") + `<path d="M${f22(x - 6)},${f22(y - 3)} q-4,${f22(-2 + wag)} -5,${f22(-6.4 + wag)}" stroke="#B98552" stroke-width="2.4" stroke-linecap="round" fill="none"/>` + ell2(x - 1.6, y - 4.6, 6, 4.4, "#C9935E", ' stroke="rgba(90,50,20,.35)" stroke-width="0.5"') + `<path d="M${f22(x + 0.4)},${f22(y - 8)} Q${f22(x + 4.6)},${f22(y - 7)} ${f22(x + 4.4)},${f22(y)} L${f22(x + 0.6)},${f22(y)} Z" fill="#D9A877"/>` + ln2([x + 1.6, y - 3], [x + 1.6, y - 0.2], "#B98552", 1.8) + ln2([x + 3.6, y - 3], [x + 3.6, y - 0.2], "#B98552", 1.8) + ell2(x + 1.6, y, 1.4, 0.7, "#FFF4E6") + ell2(x + 3.6, y, 1.4, 0.7, "#FFF4E6") + dot2(x + 3, head, 4.4, "#C9935E") + ell2(x + 6.4, head + 1.2, 2.8, 2, "#E7C08A") + dot2(x + 8.8, head + 0.4, 0.95, "#2A2420") + (pant ? `<path d="M${f22(x + 6.6)},${f22(y - 9.4)} q0.6,2.4 1.8,1.4 q0.4,-1 -0.4,-1.8 Z" fill="#E86A7A"/>` : "") + `<path d="M${f22(x + 0.2)},${f22(y - 15.2)} q-3.2,1 -2.2,6.4" stroke="#8B5631" stroke-width="2.6" stroke-linecap="round" fill="none"/>` + dot2(x + 4.6, head - 0.8, 0.7, "#2A2420") + `<path d="M${f22(x + 0.4)},${f22(y - 8.2)} q3,1.4 5.6,0" stroke="#E2463A" stroke-width="1.5" fill="none"/>` + dot2(x + 3.2, y - 7, 0.9, "#F2C04B");
    }, "draw")
  }]
};
var sablier = {
  layers: [{
    at: [0.92, 0.62],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 2,
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 16);
      const k = f / n;
      const glass = `M${f22(x - 4.4)},${f22(y - 20)} C${f22(x - 4.6)},${f22(y - 14)} ${f22(x - 0.6)},${f22(y - 12)} ${f22(x - 0.6)},${f22(y - 10)} C${f22(x - 0.6)},${f22(y - 8)} ${f22(x - 4.6)},${f22(y - 6)} ${f22(x - 4.4)},${f22(y)} L${f22(x + 4.4)},${f22(y)} C${f22(x + 4.6)},${f22(y - 6)} ${f22(x + 0.6)},${f22(y - 8)} ${f22(x + 0.6)},${f22(y - 10)} C${f22(x + 0.6)},${f22(y - 12)} ${f22(x + 4.6)},${f22(y - 14)} ${f22(x + 4.4)},${f22(y - 20)} Z`;
      const top = y - 11 - (1 - k) * 7;
      const pile = 1 + k * 6;
      const post = /* @__PURE__ */ __name((dx) => `<rect x="${f22(x + dx - 0.6)}" y="${f22(y - 21)}" width="1.2" height="21" fill="${WOOD_DARK.left}"/>`, "post");
      return T2.shadow(0, 0, 0.13, 0.22) + T2.cyl(0, 0, 0, 2, 0.06, WOOD_DARK, "foot") + T2.box(-0.012, -0.012, 0.012, 0.012, 2, 12, WOOD_DARK) + T2.cyl(0, 0, 12, 14, 0.12, WOOD, "table") + T2.cyl(0, 0, 14, 16, 0.09, WOOD_DARK, "base") + post(-5.2) + post(5.2) + `<defs><clipPath id="${T2.id("glass")}"><path d="${glass}"/></clipPath></defs><g clip-path="url(#${T2.id("glass")})"><rect x="${f22(x - 5)}" y="${f22(top)}" width="10" height="${f22(y - 10 - top)}" fill="#F2C66E"/><path d="M${f22(x - 5)},${f22(y)} L${f22(x - 5)},${f22(y - pile * 0.4)} Q${f22(x)},${f22(y - pile * 1.6)} ${f22(x + 5)},${f22(y - pile * 0.4)} L${f22(x + 5)},${f22(y)} Z" fill="#E9B65A"/>` + (k < 1 ? ln2([x, y - 10], [x, y - pile], "#F2C66E", 0.7) : "") + `</g><path d="${glass}" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.85)" stroke-width="0.6"/>` + ln2([x - 3, y - 18], [x - 2, y - 14], "rgba(255,255,255,.7)", 0.8) + ln2([x - 3, y - 2], [x - 2.4, y - 5], "rgba(255,255,255,.6)", 0.7) + post(0) + T2.cyl(0, 0, 36, 38, 0.09, WOOD_DARK, "cap") + dot2(...T2.p(0, 0, 39), 1, WOOD.top);
    }, "draw")
  }]
};
var hibou = {
  layers: [{
    at: [-0.92, 0.36],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T2, level, f) => {
      const [ox, oy] = T2.p(0, 0, 25);
      const turn = f === 2 || f === 3 ? 1.6 : f === 5 ? -1.2 : 0;
      const blink = f === 6;
      const feather = "#9C6B43";
      const eye = /* @__PURE__ */ __name((dx) => blink ? `<path d="M${f22(ox + dx - 1.6)},${f22(oy - 14)} q1.6,1 3.2,0" stroke="#3A2A1E" stroke-width="0.7" fill="none"/>` : dot2(ox + dx, oy - 14, 1.8, "#F2C04B") + dot2(ox + dx + turn * 0.3, oy - 14, 0.9, "#1E1A17") + dot2(ox + dx - 0.5, oy - 14.6, 0.35, "#FFFFFF"), "eye");
      return T2.shadow(0, 0, 0.1, 0.2) + T2.pebble(0.05, 0.05, 1.8) + T2.box(-0.02, -0.02, 0.02, 0.02, 0, 23, WOOD_DARK) + T2.box(-0.015, -0.12, 0.015, 0.12, 23, 25, WOOD) + `<path d="M${f22(ox - 2)},${f22(oy - 2)} l-1,4 l2,-1 l1,2 l1,-2 l2,1 l-1,-4 Z" fill="#7A4E30"/>` + ell2(ox, oy - 6.4, 5, 6.4, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + ell2(ox + 0.4, oy - 5.6, 3.2, 4.6, "#E7C99A") + [[-1, -7.4], [1.4, -6.4], [-0.4, -4.4], [1.8, -3.6]].map(([dx, dy]) => `<path d="M${f22(ox + dx - 0.7)},${f22(oy + dy)} l0.7,0.7 l0.7,-0.7" stroke="#B98552" stroke-width="0.5" fill="none"/>`).join("") + ell2(ox - 3.8, oy - 6, 1.8, 4.6, "#7A4E30") + ell2(ox + 4, oy - 6, 1.6, 4.4, "#8B5631") + [-1.6, 0, 1.6].map((dx) => ln2([ox + dx, oy - 1], [ox + dx, oy + 0.6], "#E8A13A", 0.7)).join("") + `<g transform="translate(${f22(turn)} 0)">` + ell2(ox, oy - 14, 5.4, 4.6, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + `<path d="M${f22(ox - 4.6)},${f22(oy - 16.4)} l-0.6,-3.6 l2.6,2 Z M${f22(ox + 4.6)},${f22(oy - 16.4)} l0.6,-3.6 l-2.6,2 Z" fill="${feather}"/>` + ell2(ox - 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + ell2(ox + 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + eye(-2) + eye(2) + `<path d="M${f22(ox - 0.7)},${f22(oy - 12.6)} l0.7,1.6 l0.7,-1.6 Z" fill="#5E3A22"/></g>`;
    }, "draw")
  }]
};
var GRIMOIRE_AT = [0.88, 0.95];
var grimoire = {
  light: /* @__PURE__ */ __name(() => [GRIMOIRE_AT[0], GRIMOIRE_AT[1], 24, 22, "200,160,255"], "light"),
  layers: [{
    at: GRIMOIRE_AT,
    frame: [-14, -22, 28, 28],
    draw: /* @__PURE__ */ __name((T2) => T2.shadow(0, 0, 0.1, 0.2) + T2.box(-0.07, -0.07, 0.07, 0.07, 0, 3, STONE) + T2.cyl(0, 0, 3, 13, 0.035, STONE, "col") + T2.box(-0.06, -0.06, 0.06, 0.06, 13, 15, STONE) + T2.disc(0, 0, 15, 0.045, "rgba(200,160,255,.55)") + T2.disc(0, 0, 15, 0.025, "rgba(240,225,255,.8)"), "draw")
  }, {
    at: GRIMOIRE_AT,
    frame: [-22, -50, 44, 36],
    n: 8,
    fps: 5,
    motion: /* @__PURE__ */ __name((t) => [0, 0, Math.sin(t * 1.4) * 1.6], "motion"),
    draw: /* @__PURE__ */ __name((T2, level, f, n) => {
      const [x, y] = T2.p(0, 0, 25);
      const t = f / n;
      const ex = x + 10 * Math.cos(Math.PI * t);
      const ey = y - 2 - Math.sin(Math.PI * t) * 7;
      const lines = /* @__PURE__ */ __name((s) => [0, 1, 2, 3].map((k) => ln2([x + s * 2.4, y - 3.6 + k * 1.3 + k * 0.1], [x + s * 8.4, y - 4.8 + k * 1.3], "rgba(90,70,110,.4)", 0.5)).join(""), "lines");
      const runes = [0, 1, 2].map((k) => {
        const r = (t + k / 3) % 1;
        const rx = x + (k - 1) * 5 + Math.sin(r * 6 + k) * 1.5;
        const ry = y - 8 - r * 14;
        const o = f22(1 - r);
        return k === 0 ? `<circle cx="${f22(rx)}" cy="${f22(ry)}" r="1.4" fill="none" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>` : k === 1 ? `<path d="M${f22(rx - 1.4)},${f22(ry + 1)} l1.4,-2.4 l1.4,2.4 Z" fill="none" stroke="#FFE7A8" stroke-width="0.6" opacity="${o}"/>` : `<path d="M${f22(rx - 1.2)},${f22(ry)} h2.4 M${f22(rx)},${f22(ry - 1.2)} v2.4" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`;
      }).join("");
      return ell2(x, y + 1, 12, 3, "rgba(200,160,255,.22)") + `<path d="M${f22(x)},${f22(y + 1.4)} L${f22(x - 11)},${f22(y - 2)} L${f22(x - 11)},${f22(y - 3.4)} L${f22(x)},${f22(y)} L${f22(x + 11)},${f22(y - 3.4)} L${f22(x + 11)},${f22(y - 2)} Z" fill="#6A3FA0" stroke="#4A2A78" stroke-width="0.5"/><path d="M${f22(x)},${f22(y)} Q${f22(x - 5)},${f22(y - 5)} ${f22(x - 10)},${f22(y - 3.4)} L${f22(x - 10)},${f22(y - 5)} Q${f22(x - 5)},${f22(y - 7)} ${f22(x)},${f22(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/><path d="M${f22(x)},${f22(y)} Q${f22(x + 5)},${f22(y - 5)} ${f22(x + 10)},${f22(y - 3.4)} L${f22(x + 10)},${f22(y - 5)} Q${f22(x + 5)},${f22(y - 7)} ${f22(x)},${f22(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>` + lines(-1) + lines(1) + `<path d="M${f22(x)},${f22(y - 2)} Q${f22((x + ex) / 2)},${f22(Math.min(y - 6, ey - 3))} ${f22(ex)},${f22(ey - 3)} L${f22(ex)},${f22(ey - 1.6)} Q${f22((x + ex) / 2)},${f22(Math.min(y - 4.4, ey - 1.4))} ${f22(x)},${f22(y)} Z" fill="#FFFDF4" stroke="#D8C39B" stroke-width="0.4"/>` + dot2(x - 10.6, y - 2.7, 0.8, "#F2C04B") + dot2(x + 10.6, y - 2.7, 0.8, "#F2C04B") + runes + star(x - 7, y - 10, 1.4, "#FFF2B0", Math.max(0, wave(f, n, 1))) + star(x + 8, y - 12, 1.2, "#FFF2B0", Math.max(0, wave(f, n, 1, 3)));
    }, "draw")
  }]
};
var SHOP_SPRITES = {
  pelle,
  arrosoir,
  poulailler,
  ruche,
  brouette,
  epouvantail,
  citrouille,
  pioche,
  wagonnet,
  "lanterne-mine": lanterneMine,
  rails,
  casque,
  geode,
  golem,
  hache,
  scie,
  nichoir,
  charrette,
  "passe-partout": passePartout,
  ecureuil,
  cerf,
  "seau-cuivre": seauCuivre,
  poulie,
  abreuvoir,
  pompe,
  sourcier,
  canards,
  naiade,
  canne,
  filet,
  casier,
  barque,
  harpon,
  pelican,
  sirene,
  etabli,
  enclume,
  soufflet,
  "marteau-pilon": marteauPilon,
  automate,
  athanor,
  cuisine,
  lit,
  chat,
  chien,
  sablier,
  hibou,
  grimoire,
  // Pièces rares (skins) : leur accessoire se dessine comme un article quand le bâtiment les porte
  ...RARE_SPRITES
};

// atelier/objets_boutique.mjs
var SHOP_ITEMS = {
  potager: ["pelle", "arrosoir", "poulailler", "ruche", "brouette", "epouvantail", "citrouille"],
  carriere: ["pioche", "wagonnet", "lanterne-mine", "rails", "casque", "geode", "golem"],
  bosquet: ["hache", "scie", "nichoir", "charrette", "passe-partout", "ecureuil", "cerf"],
  puits: ["seau-cuivre", "poulie", "abreuvoir", "pompe", "sourcier", "canards", "naiade"],
  ponton: ["canne", "filet", "casier", "barque", "harpon", "pelican", "sirene"],
  atelier: ["etabli", "enclume", "soufflet", "marteau-pilon", "automate", "athanor"],
  foyer: ["cuisine", "lit", "chat", "chien", "sablier", "hibou", "grimoire"]
};
function paliers(site, id) {
  const ids = SHOP_ITEMS[site], rank = ids.indexOf(id);
  const late = rank >= ids.length - 3 && ids.length === 7 ? true : rank >= ids.length - 3;
  return { late, levels: late ? [5, 6, 7] : [1, 2, 3, 4, 5, 6, 7] };
}
__name(paliers, "paliers");
function calques(site, id) {
  const item = SHOP_SPRITES[id], { levels } = paliers(site, id);
  return item.layers.map((layer, k) => {
    const seen = /* @__PURE__ */ new Map(), dessinDu = {};
    for (const lv of levels) {
      const frames = Array.from({ length: layer.n || 1 }, (_, f) => layer.n ? layer.draw(tools(0, 0, `${id}-${k}`), lv, f, layer.n) : layer.draw(tools(0, 0, `${id}-${k}`), lv));
      const key = frames.join("|");
      if (!seen.has(key)) seen.set(key, { from: lv, frames, frame: typeof layer.frame === "function" ? layer.frame(lv) : layer.frame });
      dessinDu[lv] = seen.get(key);
    }
    const variantes = [...seen.values()];
    const nom = /* @__PURE__ */ __name((vr, f) => id + (item.layers.length > 1 ? `_calque${k + 1}` : "") + (variantes.length > 1 ? `_des_palier${vr.from}` : "") + (vr.frames.length > 1 ? `_${f + 1}` : ""), "nom");
    return { k, layer, levels, variantes, nom, variante: /* @__PURE__ */ __name((lv) => dessinDu[lv], "variante") };
  });
}
__name(calques, "calques");

// atelier/generateur_objets.mjs
var import_torche = __toESM(require_torche(), 1);

// bibliotheque/svg/batiments/batiments.json
var batiments_default = {
  _lisez_moi: "Cadres en pixels (x, y, largeur, hauteur) autour de l'ancre (0, 0), centre de l'emprise au sol (2 × 2 cases aux paliers I-III, 3 × 3 ensuite), à l'échelle du jeu × 1,25 (case de 80 × 40). Paliers : images composées (bâtiment + parties animées + voilier du Ponton) ; lumieres [u, v, z, rayon] et fumees [u, v, z] en cases et pixels × 1,25. Paliers d'hiver (paliers_hiver) : les mêmes images, les toits sous la neige, même ancre ; ete = le palier d'été qu'il remplace. Objets : un fichier par calque, ancré à sa place au sol ; place = [u, v] en cases autour du centre du bâtiment, par palier ; derriere = à peindre avant le bâtiment ; mouvement = le jeu le déplace en plus. Teintes : recolorations (teintes/teinter.mjs). Quand un dessin du jeu dépasse un peu de son cadre (faisceau du phare, ombre d'un objet), le cadre est élargi juste ce qu'il faut, l'ancre ne bouge pas : prendre le cadre noté ici.",
  paliers: {
    foyer_palier1: {
      nom: "Foyer — palier I",
      fichiers: [
        "paliers/foyer/foyer_palier1_1.svg",
        "paliers/foyer/foyer_palier1_2.svg",
        "paliers/foyer/foyer_palier1_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 111,
      animations: [
        "flame (3 images, 9/s)"
      ],
      lumieres: [
        {
          u: 0,
          v: 0,
          z: 12.5,
          rayon: 67.5
        }
      ],
      fumees: [
        {
          u: 0,
          v: 0,
          z: 30
        }
      ]
    },
    foyer_palier2: {
      nom: "Foyer — palier II",
      fichiers: [
        "paliers/foyer/foyer_palier2_1.svg",
        "paliers/foyer/foyer_palier2_2.svg",
        "paliers/foyer/foyer_palier2_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 111,
      animations: [
        "flame (3 images, 9/s)"
      ],
      lumieres: [
        {
          u: 0.5,
          v: 0.36,
          z: 10,
          rayon: 50
        }
      ],
      fumees: [
        {
          u: 0.5,
          v: 0.36,
          z: 22.5
        }
      ]
    },
    foyer_palier3: {
      nom: "Foyer — palier III",
      fichiers: [
        "paliers/foyer/foyer_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.55,
          v: -0.07,
          z: 17.5,
          rayon: 27.5
        }
      ],
      fumees: [
        {
          u: 0.3,
          v: -0.27,
          z: 77.5
        }
      ]
    },
    foyer_palier4: {
      nom: "Foyer — palier IV",
      fichiers: [
        "paliers/foyer/foyer_palier4_1.svg",
        "paliers/foyer/foyer_palier4_2.svg",
        "paliers/foyer/foyer_palier4_3.svg",
        "paliers/foyer/foyer_palier4_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.81,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.79,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.17,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.42,
          v: -0.56,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.19,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: 0.78,
          v: 0.06,
          z: 7.5,
          rayon: 22.5
        }
      ]
    },
    foyer_palier5: {
      nom: "Foyer — palier V",
      fichiers: [
        "paliers/foyer/foyer_palier5_1.svg",
        "paliers/foyer/foyer_palier5_2.svg",
        "paliers/foyer/foyer_palier5_3.svg",
        "paliers/foyer/foyer_palier5_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.84,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.82,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.03,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.22,
          v: -0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.01,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.38,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.38,
          z: 76.25,
          rayon: 17.5
        }
      ]
    },
    foyer_palier6: {
      nom: "Foyer — palier VI",
      fichiers: [
        "paliers/foyer/foyer_palier6_1.svg",
        "paliers/foyer/foyer_palier6_2.svg",
        "paliers/foyer/foyer_palier6_3.svg",
        "paliers/foyer/foyer_palier6_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.87,
          v: 0.5,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.85,
          v: 0.5,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.27,
          v: 0.5,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.02,
          v: -0.1,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.74,
          v: -0.3,
          z: 52.5,
          rayon: 17.5
        },
        {
          u: 0.74,
          v: -0.3,
          z: 118.75,
          rayon: 17.5
        },
        {
          u: -0.2,
          v: 0.75,
          z: 31.25,
          rayon: 20
        }
      ]
    },
    foyer_palier7: {
      nom: "Foyer — palier VII",
      fichiers: [
        "paliers/foyer/foyer_palier7_1.svg",
        "paliers/foyer/foyer_palier7_2.svg",
        "paliers/foyer/foyer_palier7_3.svg",
        "paliers/foyer/foyer_palier7_4.svg",
        "paliers/foyer/foyer_palier7_5.svg",
        "paliers/foyer/foyer_palier7_6.svg",
        "paliers/foyer/foyer_palier7_7.svg",
        "paliers/foyer/foyer_palier7_8.svg"
      ],
      cadre: [
        -140,
        -250,
        282.5,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 250,
      animations: [
        "beam (8 images, 4/s)",
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.87,
          v: 0.48,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.85,
          v: 0.48,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.29,
          v: 0.48,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.04,
          v: -0.12,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.42,
          v: -0.5,
          z: 180,
          rayon: 42.5
        },
        {
          u: -0.24,
          v: 0.76,
          z: 31.25,
          rayon: 20
        }
      ]
    },
    carriere_palier1: {
      nom: "Carrière — palier I",
      fichiers: [
        "paliers/carriere/carriere_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    carriere_palier2: {
      nom: "Carrière — palier II",
      fichiers: [
        "paliers/carriere/carriere_palier2.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    carriere_palier3: {
      nom: "Carrière — palier III",
      fichiers: [
        "paliers/carriere/carriere_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.04,
          v: -0.23,
          z: 42.5,
          rayon: 22.5
        },
        {
          u: -0.35,
          v: -0.16,
          z: 32.5,
          rayon: 25
        }
      ]
    },
    carriere_palier4: {
      nom: "Carrière — palier IV",
      fichiers: [
        "paliers/carriere/carriere_palier4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: 0.12,
          v: -0.3,
          z: 15,
          rayon: 20
        },
        {
          u: -0.12,
          v: 0.02,
          z: 38.75,
          rayon: 20
        }
      ]
    },
    carriere_palier5: {
      nom: "Carrière — palier V",
      fichiers: [
        "paliers/carriere/carriere_palier5.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: 1.15,
          v: 0.62,
          z: 12.5,
          rayon: 17.5
        }
      ]
    },
    carriere_palier6: {
      nom: "Carrière — palier VI",
      fichiers: [
        "paliers/carriere/carriere_palier6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: -1.1,
          v: -0.3,
          z: 32.5,
          rayon: 20
        },
        {
          u: -0.05,
          v: -0.3,
          z: 42.5,
          rayon: 17.5
        },
        {
          u: 1.4,
          v: -0.9,
          z: 50,
          rayon: 20
        },
        {
          u: 0.12,
          v: 0.62,
          z: 10,
          rayon: 20
        },
        {
          u: -1,
          v: 0.3,
          z: 10,
          rayon: 17.5
        }
      ]
    },
    carriere_palier7: {
      nom: "Carrière — palier VII",
      fichiers: [
        "paliers/carriere/carriere_palier7.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: -0.12,
          v: 0.02,
          z: 38.75,
          rayon: 20
        },
        {
          u: 0.55,
          v: 0.85,
          z: 33.75,
          rayon: 20
        },
        {
          u: 1.06,
          v: 0.49,
          z: 11.25,
          rayon: 15
        },
        {
          u: 1.42,
          v: 0.49,
          z: 11.25,
          rayon: 15
        },
        {
          u: 1.32,
          v: -0.08,
          z: 48.75,
          rayon: 15
        },
        {
          u: -1,
          v: -1.22,
          z: 88.75,
          rayon: 12.5
        },
        {
          u: -0.05,
          v: -1.24,
          z: 88.75,
          rayon: 12.5
        }
      ],
      fumees: [
        {
          u: 0.89,
          v: -0.17,
          z: 77.5
        },
        {
          u: 0.81,
          v: 0.39,
          z: 40
        },
        {
          u: 1.19,
          v: 0.39,
          z: 40
        }
      ]
    },
    bosquet_palier1: {
      nom: "Bosquet — palier I",
      fichiers: [
        "paliers/bosquet/bosquet_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      souplesse_au_vent: 0.03
    },
    bosquet_palier2: {
      nom: "Bosquet — palier II",
      fichiers: [
        "paliers/bosquet/bosquet_palier2.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      souplesse_au_vent: 0.03
    },
    bosquet_palier3: {
      nom: "Bosquet — palier III",
      fichiers: [
        "paliers/bosquet/bosquet_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.42,
          v: -0.04,
          z: 15,
          rayon: 15
        }
      ],
      fumees: [
        {
          u: -0.04,
          v: -0.2,
          z: 55
        }
      ],
      souplesse_au_vent: 0.015
    },
    bosquet_palier4: {
      nom: "Bosquet — palier IV",
      fichiers: [
        "paliers/bosquet/bosquet_palier4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 0.45,
          v: 0.12,
          z: 17.5,
          rayon: 16.25
        }
      ],
      fumees: [
        {
          u: -0.27,
          v: -0.12,
          z: 65
        }
      ],
      souplesse_au_vent: 0.012
    },
    bosquet_palier5: {
      nom: "Bosquet — palier V",
      fichiers: [
        "paliers/bosquet/bosquet_palier5_1.svg",
        "paliers/bosquet/bosquet_palier5_2.svg",
        "paliers/bosquet/bosquet_palier5_3.svg",
        "paliers/bosquet/bosquet_palier5_4.svg",
        "paliers/bosquet/bosquet_palier5_5.svg",
        "paliers/bosquet/bosquet_palier5_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 83,
      animations: [
        "saw (6 images, 12/s)"
      ]
    },
    bosquet_palier6: {
      nom: "Bosquet — palier VI",
      fichiers: [
        "paliers/bosquet/bosquet_palier6_1.svg",
        "paliers/bosquet/bosquet_palier6_2.svg",
        "paliers/bosquet/bosquet_palier6_3.svg",
        "paliers/bosquet/bosquet_palier6_4.svg",
        "paliers/bosquet/bosquet_palier6_5.svg",
        "paliers/bosquet/bosquet_palier6_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 83,
      animations: [
        "saw (6 images, 12/s)",
        "log (6 images, 3/s)"
      ]
    },
    bosquet_palier7: {
      nom: "Bosquet — palier VII",
      fichiers: [
        "paliers/bosquet/bosquet_palier7_1.svg",
        "paliers/bosquet/bosquet_palier7_2.svg",
        "paliers/bosquet/bosquet_palier7_3.svg",
        "paliers/bosquet/bosquet_palier7_4.svg",
        "paliers/bosquet/bosquet_palier7_5.svg",
        "paliers/bosquet/bosquet_palier7_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 200,
      animations: [
        "dust (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: 0.05,
          v: -0.25,
          z: 15,
          rayon: 27.5
        },
        {
          u: -0.07,
          v: -0.25,
          z: 50,
          rayon: 17.5
        },
        {
          u: 0.17,
          v: -0.25,
          z: 60,
          rayon: 17.5
        },
        {
          u: -0.8,
          v: 0.6,
          z: 12.5,
          rayon: 17.5
        },
        {
          u: 0.75,
          v: 0.55,
          z: 12.5,
          rayon: 17.5
        }
      ]
    },
    puits_palier1: {
      nom: "Puits — palier I",
      fichiers: [
        "paliers/puits/puits_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    puits_palier2: {
      nom: "Puits — palier II",
      fichiers: [
        "paliers/puits/puits_palier2_1.svg",
        "paliers/puits/puits_palier2_2.svg",
        "paliers/puits/puits_palier2_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 167,
      animations: [
        "fountain (3 images, 6/s)"
      ]
    },
    puits_palier3: {
      nom: "Puits — palier III",
      fichiers: [
        "paliers/puits/puits_palier3_1.svg",
        "paliers/puits/puits_palier3_2.svg",
        "paliers/puits/puits_palier3_3.svg",
        "paliers/puits/puits_palier3_4.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 333,
      animations: [
        "laundry (4 images, 3/s)"
      ]
    },
    puits_palier4: {
      nom: "Puits — palier IV",
      fichiers: [
        "paliers/puits/puits_palier4_1.svg",
        "paliers/puits/puits_palier4_2.svg",
        "paliers/puits/puits_palier4_3.svg",
        "paliers/puits/puits_palier4_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "jets (4 images, 6/s)"
      ]
    },
    puits_palier5: {
      nom: "Puits — palier V",
      fichiers: [
        "paliers/puits/puits_palier5_1.svg",
        "paliers/puits/puits_palier5_2.svg",
        "paliers/puits/puits_palier5_3.svg",
        "paliers/puits/puits_palier5_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 125,
      animations: [
        "fall (4 images, 8/s)"
      ]
    },
    puits_palier6: {
      nom: "Puits — palier VI",
      fichiers: [
        "paliers/puits/puits_palier6_1.svg",
        "paliers/puits/puits_palier6_2.svg",
        "paliers/puits/puits_palier6_3.svg",
        "paliers/puits/puits_palier6_4.svg",
        "paliers/puits/puits_palier6_5.svg",
        "paliers/puits/puits_palier6_6.svg",
        "paliers/puits/puits_palier6_7.svg",
        "paliers/puits/puits_palier6_8.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 125,
      animations: [
        "wheel (8 images, 8/s)"
      ],
      lumieres: [
        {
          u: -1.06,
          v: -0.25,
          z: 48.75,
          rayon: 17.5
        },
        {
          u: -0.11,
          v: -0.25,
          z: 48.75,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.05,
          v: -1.05,
          z: 105
        }
      ]
    },
    puits_palier7: {
      nom: "Puits — palier VII",
      fichiers: [
        "paliers/puits/puits_palier7_1.svg",
        "paliers/puits/puits_palier7_2.svg",
        "paliers/puits/puits_palier7_3.svg",
        "paliers/puits/puits_palier7_4.svg",
        "paliers/puits/puits_palier7_5.svg",
        "paliers/puits/puits_palier7_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "magic (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: 0,
          v: 0,
          z: 17.5,
          rayon: 50
        },
        {
          u: 0,
          v: 0,
          z: 50,
          rayon: 22.5
        }
      ]
    },
    potager_palier1: {
      nom: "Potager — palier I",
      fichiers: [
        "paliers/potager/potager_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier2: {
      nom: "Potager — palier II",
      fichiers: [
        "paliers/potager/potager_palier2.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier3: {
      nom: "Potager — palier III",
      fichiers: [
        "paliers/potager/potager_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier4: {
      nom: "Potager — palier IV",
      fichiers: [
        "paliers/potager/potager_palier4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3"
    },
    potager_palier5: {
      nom: "Potager — palier V",
      fichiers: [
        "paliers/potager/potager_palier5_1.svg",
        "paliers/potager/potager_palier5_2.svg",
        "paliers/potager/potager_palier5_3.svg",
        "paliers/potager/potager_palier5_4.svg",
        "paliers/potager/potager_palier5_5.svg",
        "paliers/potager/potager_palier5_6.svg",
        "paliers/potager/potager_palier5_7.svg",
        "paliers/potager/potager_palier5_8.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "sails (8 images, 6/s)"
      ]
    },
    potager_palier6: {
      nom: "Potager — palier VI",
      fichiers: [
        "paliers/potager/potager_palier6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.16,
          v: -0.55,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.71,
          v: -0.55,
          z: 16.25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.2,
          v: -1.2,
          z: 86.25
        }
      ]
    },
    potager_palier7: {
      nom: "Potager — palier VII",
      fichiers: [
        "paliers/potager/potager_palier7_1.svg",
        "paliers/potager/potager_palier7_2.svg",
        "paliers/potager/potager_palier7_3.svg",
        "paliers/potager/potager_palier7_4.svg",
        "paliers/potager/potager_palier7_5.svg",
        "paliers/potager/potager_palier7_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "unicorn (6 images, 3/s)",
        "sparkles (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: -1.05,
          v: -0.95,
          z: 37.5,
          rayon: 27.5
        }
      ]
    },
    atelier_palier1: {
      nom: "Atelier — palier I",
      fichiers: [
        "paliers/atelier/atelier_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.85,
          v: -0.05,
          z: 7.5,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.55,
          v: -0.05,
          z: 55
        }
      ]
    },
    atelier_palier2: {
      nom: "Atelier — palier II",
      fichiers: [
        "paliers/atelier/atelier_palier2.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.88,
          v: -0.05,
          z: 8.75,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.55,
          v: -0.2,
          z: 72.5
        }
      ]
    },
    atelier_palier3: {
      nom: "Atelier — palier III",
      fichiers: [
        "paliers/atelier/atelier_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.88,
          v: -0.05,
          z: 8.75,
          rayon: 32.5
        },
        {
          u: 0.56,
          v: -0.08,
          z: 35,
          rayon: 22.5
        },
        {
          u: 0.42,
          v: 0.6,
          z: 6.25,
          rayon: 15
        }
      ],
      fumees: [
        {
          u: 0.7,
          v: -0.34,
          z: 80
        },
        {
          u: 0.36,
          v: -0.36,
          z: 65
        }
      ]
    },
    atelier_palier4: {
      nom: "Atelier — palier IV",
      fichiers: [
        "paliers/atelier/atelier_palier4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 42.5
        },
        {
          u: -0.55,
          v: 0.6,
          z: 12.5,
          rayon: 32.5
        },
        {
          u: -1.05,
          v: 0.6,
          z: 25,
          rayon: 17.5
        },
        {
          u: 0.1,
          v: 0.6,
          z: 25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: 0.91,
          v: -0.15,
          z: 120
        }
      ]
    },
    atelier_palier5: {
      nom: "Atelier — palier V",
      fichiers: [
        "paliers/atelier/atelier_palier5.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 42.5
        },
        {
          u: -1.09,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.74,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.39,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.04,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: 0.93,
          v: -0.15,
          z: 125
        }
      ]
    },
    atelier_palier6: {
      nom: "Atelier — palier VI",
      fichiers: [
        "paliers/atelier/atelier_palier6_1.svg",
        "paliers/atelier/atelier_palier6_2.svg",
        "paliers/atelier/atelier_palier6_3.svg",
        "paliers/atelier/atelier_palier6_4.svg",
        "paliers/atelier/atelier_palier6_5.svg",
        "paliers/atelier/atelier_palier6_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "gear (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 11.25,
          rayon: 45
        },
        {
          u: -1.12,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: -0.87,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: -0.12,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: 0.13,
          v: 0.45,
          z: 25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.05,
          v: -1.05,
          z: 142.5
        },
        {
          u: -0.45,
          v: -1.1,
          z: 127.5
        },
        {
          u: 0.93,
          v: -0.15,
          z: 135
        }
      ]
    },
    atelier_palier7: {
      nom: "Atelier — palier VII",
      fichiers: [
        "paliers/atelier/atelier_palier7_1.svg",
        "paliers/atelier/atelier_palier7_2.svg",
        "paliers/atelier/atelier_palier7_3.svg",
        "paliers/atelier/atelier_palier7_4.svg",
        "paliers/atelier/atelier_palier7_5.svg",
        "paliers/atelier/atelier_palier7_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "bubbles (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: -0.75,
          v: -0.12,
          z: 32.5,
          rayon: 17.5
        },
        {
          u: -0.38,
          v: -0.14,
          z: 60,
          rayon: 17.5
        },
        {
          u: -0.62,
          v: -0.1,
          z: 82.5,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.15,
          z: 45,
          rayon: 30
        },
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.91,
          v: -0.15,
          z: 82.5
        }
      ]
    },
    ponton_palier1: {
      nom: "Ponton — palier I",
      fichiers: [
        "paliers/ponton/ponton_palier1.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier2: {
      nom: "Ponton — palier II",
      fichiers: [
        "paliers/ponton/ponton_palier2.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.82,
          v: 0.14,
          z: 46.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier3: {
      nom: "Ponton — palier III",
      fichiers: [
        "paliers/ponton/ponton_palier3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.82,
          v: 0.14,
          z: 46.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier4: {
      nom: "Ponton — palier IV",
      fichiers: [
        "paliers/ponton/ponton_palier4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier5: {
      nom: "Ponton — palier V",
      fichiers: [
        "paliers/ponton/ponton_palier5.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: -0.75,
          v: 0.2,
          z: 37.5,
          rayon: 22.5
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier6: {
      nom: "Ponton — palier VI",
      fichiers: [
        "paliers/ponton/ponton_palier6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: -0.25,
          v: -0.74,
          z: 12.5,
          rayon: 22.5
        }
      ],
      fumees: [
        {
          u: -0.1,
          v: -0.82,
          z: 50
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier7: {
      nom: "Ponton — palier VII",
      fichiers: [
        "paliers/ponton/ponton_palier7_1.svg",
        "paliers/ponton/ponton_palier7_2.svg",
        "paliers/ponton/ponton_palier7_3.svg",
        "paliers/ponton/ponton_palier7_4.svg",
        "paliers/ponton/ponton_palier7_5.svg",
        "paliers/ponton/ponton_palier7_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 200,
      animations: [
        "kraken (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 27.5
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: 0.95,
          v: -0.12,
          z: 27.5,
          rayon: 20
        },
        {
          u: -0.6,
          v: 0.95,
          z: 5,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    }
  },
  paliers_hiver: {
    foyer_palier1_hiver: {
      nom: "Foyer — palier I, l'hiver",
      ete: "foyer_palier1",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier1_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier1_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier1_hiver_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 111,
      animations: [
        "flame (3 images, 9/s)"
      ],
      lumieres: [
        {
          u: 0,
          v: 0,
          z: 12.5,
          rayon: 67.5
        }
      ],
      fumees: [
        {
          u: 0,
          v: 0,
          z: 30
        }
      ]
    },
    foyer_palier2_hiver: {
      nom: "Foyer — palier II, l'hiver",
      ete: "foyer_palier2",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier2_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier2_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier2_hiver_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 111,
      animations: [
        "flame (3 images, 9/s)"
      ],
      lumieres: [
        {
          u: 0.5,
          v: 0.36,
          z: 10,
          rayon: 50
        }
      ],
      fumees: [
        {
          u: 0.5,
          v: 0.36,
          z: 22.5
        }
      ]
    },
    foyer_palier3_hiver: {
      nom: "Foyer — palier III, l'hiver",
      ete: "foyer_palier3",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.55,
          v: -0.07,
          z: 17.5,
          rayon: 27.5
        }
      ],
      fumees: [
        {
          u: 0.3,
          v: -0.27,
          z: 77.5
        }
      ]
    },
    foyer_palier4_hiver: {
      nom: "Foyer — palier IV, l'hiver",
      ete: "foyer_palier4",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier4_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier4_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier4_hiver_3.svg",
        "paliers_hiver/foyer/foyer_palier4_hiver_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.81,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.79,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.17,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.42,
          v: -0.56,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.19,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: 0.78,
          v: 0.06,
          z: 7.5,
          rayon: 22.5
        }
      ]
    },
    foyer_palier5_hiver: {
      nom: "Foyer — palier V, l'hiver",
      ete: "foyer_palier5",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier5_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier5_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier5_hiver_3.svg",
        "paliers_hiver/foyer/foyer_palier5_hiver_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.84,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.82,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.03,
          v: 0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.22,
          v: -0.42,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.01,
          v: 0.42,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.38,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.38,
          z: 76.25,
          rayon: 17.5
        }
      ]
    },
    foyer_palier6_hiver: {
      nom: "Foyer — palier VI, l'hiver",
      ete: "foyer_palier6",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier6_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier6_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier6_hiver_3.svg",
        "paliers_hiver/foyer/foyer_palier6_hiver_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.87,
          v: 0.5,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.85,
          v: 0.5,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.27,
          v: 0.5,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.02,
          v: -0.1,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.74,
          v: -0.3,
          z: 52.5,
          rayon: 17.5
        },
        {
          u: 0.74,
          v: -0.3,
          z: 118.75,
          rayon: 17.5
        },
        {
          u: -0.2,
          v: 0.75,
          z: 31.25,
          rayon: 20
        }
      ]
    },
    foyer_palier7_hiver: {
      nom: "Foyer — palier VII, l'hiver",
      ete: "foyer_palier7",
      fichiers: [
        "paliers_hiver/foyer/foyer_palier7_hiver_1.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_2.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_3.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_4.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_5.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_6.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_7.svg",
        "paliers_hiver/foyer/foyer_palier7_hiver_8.svg"
      ],
      cadre: [
        -140,
        -250,
        282.5,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 250,
      animations: [
        "beam (8 images, 4/s)",
        "vapor (4 images, 3/s)"
      ],
      lumieres: [
        {
          u: -0.87,
          v: 0.48,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.85,
          v: 0.48,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.29,
          v: 0.48,
          z: 40,
          rayon: 17.5
        },
        {
          u: -0.04,
          v: -0.12,
          z: 40,
          rayon: 17.5
        },
        {
          u: 0.42,
          v: -0.5,
          z: 180,
          rayon: 42.5
        },
        {
          u: -0.24,
          v: 0.76,
          z: 31.25,
          rayon: 20
        }
      ]
    },
    carriere_palier1_hiver: {
      nom: "Carrière — palier I, l'hiver",
      ete: "carriere_palier1",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    carriere_palier2_hiver: {
      nom: "Carrière — palier II, l'hiver",
      ete: "carriere_palier2",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier2_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    carriere_palier3_hiver: {
      nom: "Carrière — palier III, l'hiver",
      ete: "carriere_palier3",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.04,
          v: -0.23,
          z: 42.5,
          rayon: 22.5
        },
        {
          u: -0.35,
          v: -0.16,
          z: 32.5,
          rayon: 25
        }
      ]
    },
    carriere_palier4_hiver: {
      nom: "Carrière — palier IV, l'hiver",
      ete: "carriere_palier4",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier4_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: 0.12,
          v: -0.3,
          z: 15,
          rayon: 20
        },
        {
          u: -0.12,
          v: 0.02,
          z: 38.75,
          rayon: 20
        }
      ]
    },
    carriere_palier5_hiver: {
      nom: "Carrière — palier V, l'hiver",
      ete: "carriere_palier5",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier5_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: 1.15,
          v: 0.62,
          z: 12.5,
          rayon: 17.5
        }
      ]
    },
    carriere_palier6_hiver: {
      nom: "Carrière — palier VI, l'hiver",
      ete: "carriere_palier6",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier6_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: -1.1,
          v: -0.3,
          z: 32.5,
          rayon: 20
        },
        {
          u: -0.05,
          v: -0.3,
          z: 42.5,
          rayon: 17.5
        },
        {
          u: 1.4,
          v: -0.9,
          z: 50,
          rayon: 20
        },
        {
          u: 0.12,
          v: 0.62,
          z: 10,
          rayon: 20
        },
        {
          u: -1,
          v: 0.3,
          z: 10,
          rayon: 17.5
        }
      ]
    },
    carriere_palier7_hiver: {
      nom: "Carrière — palier VII, l'hiver",
      ete: "carriere_palier7",
      fichiers: [
        "paliers_hiver/carriere/carriere_palier7_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -0.53,
          v: -0.3,
          z: 22.5,
          rayon: 30
        },
        {
          u: -0.12,
          v: 0.02,
          z: 38.75,
          rayon: 20
        },
        {
          u: 0.55,
          v: 0.85,
          z: 33.75,
          rayon: 20
        },
        {
          u: 1.06,
          v: 0.49,
          z: 11.25,
          rayon: 15
        },
        {
          u: 1.42,
          v: 0.49,
          z: 11.25,
          rayon: 15
        },
        {
          u: 1.32,
          v: -0.08,
          z: 48.75,
          rayon: 15
        },
        {
          u: -1,
          v: -1.22,
          z: 88.75,
          rayon: 12.5
        },
        {
          u: -0.05,
          v: -1.24,
          z: 88.75,
          rayon: 12.5
        }
      ],
      fumees: [
        {
          u: 0.89,
          v: -0.17,
          z: 77.5
        },
        {
          u: 0.81,
          v: 0.39,
          z: 40
        },
        {
          u: 1.19,
          v: 0.39,
          z: 40
        }
      ]
    },
    bosquet_palier1_hiver: {
      nom: "Bosquet — palier I, l'hiver",
      ete: "bosquet_palier1",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      souplesse_au_vent: 0.03
    },
    bosquet_palier2_hiver: {
      nom: "Bosquet — palier II, l'hiver",
      ete: "bosquet_palier2",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier2_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      souplesse_au_vent: 0.03
    },
    bosquet_palier3_hiver: {
      nom: "Bosquet — palier III, l'hiver",
      ete: "bosquet_palier3",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.42,
          v: -0.04,
          z: 15,
          rayon: 15
        }
      ],
      fumees: [
        {
          u: -0.04,
          v: -0.2,
          z: 55
        }
      ],
      souplesse_au_vent: 0.015
    },
    bosquet_palier4_hiver: {
      nom: "Bosquet — palier IV, l'hiver",
      ete: "bosquet_palier4",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier4_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 0.45,
          v: 0.12,
          z: 17.5,
          rayon: 16.25
        }
      ],
      fumees: [
        {
          u: -0.27,
          v: -0.12,
          z: 65
        }
      ],
      souplesse_au_vent: 0.012
    },
    bosquet_palier5_hiver: {
      nom: "Bosquet — palier V, l'hiver",
      ete: "bosquet_palier5",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier5_hiver_1.svg",
        "paliers_hiver/bosquet/bosquet_palier5_hiver_2.svg",
        "paliers_hiver/bosquet/bosquet_palier5_hiver_3.svg",
        "paliers_hiver/bosquet/bosquet_palier5_hiver_4.svg",
        "paliers_hiver/bosquet/bosquet_palier5_hiver_5.svg",
        "paliers_hiver/bosquet/bosquet_palier5_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 83,
      animations: [
        "saw (6 images, 12/s)"
      ]
    },
    bosquet_palier6_hiver: {
      nom: "Bosquet — palier VI, l'hiver",
      ete: "bosquet_palier6",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier6_hiver_1.svg",
        "paliers_hiver/bosquet/bosquet_palier6_hiver_2.svg",
        "paliers_hiver/bosquet/bosquet_palier6_hiver_3.svg",
        "paliers_hiver/bosquet/bosquet_palier6_hiver_4.svg",
        "paliers_hiver/bosquet/bosquet_palier6_hiver_5.svg",
        "paliers_hiver/bosquet/bosquet_palier6_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 83,
      animations: [
        "saw (6 images, 12/s)",
        "log (6 images, 3/s)"
      ]
    },
    bosquet_palier7_hiver: {
      nom: "Bosquet — palier VII, l'hiver",
      ete: "bosquet_palier7",
      fichiers: [
        "paliers_hiver/bosquet/bosquet_palier7_hiver_1.svg",
        "paliers_hiver/bosquet/bosquet_palier7_hiver_2.svg",
        "paliers_hiver/bosquet/bosquet_palier7_hiver_3.svg",
        "paliers_hiver/bosquet/bosquet_palier7_hiver_4.svg",
        "paliers_hiver/bosquet/bosquet_palier7_hiver_5.svg",
        "paliers_hiver/bosquet/bosquet_palier7_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 200,
      animations: [
        "dust (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: 0.05,
          v: -0.25,
          z: 15,
          rayon: 27.5
        },
        {
          u: -0.07,
          v: -0.25,
          z: 50,
          rayon: 17.5
        },
        {
          u: 0.17,
          v: -0.25,
          z: 60,
          rayon: 17.5
        },
        {
          u: -0.8,
          v: 0.6,
          z: 12.5,
          rayon: 17.5
        },
        {
          u: 0.75,
          v: 0.55,
          z: 12.5,
          rayon: 17.5
        }
      ]
    },
    puits_palier1_hiver: {
      nom: "Puits — palier I, l'hiver",
      ete: "puits_palier1",
      fichiers: [
        "paliers_hiver/puits/puits_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    puits_palier2_hiver: {
      nom: "Puits — palier II, l'hiver",
      ete: "puits_palier2",
      fichiers: [
        "paliers_hiver/puits/puits_palier2_hiver_1.svg",
        "paliers_hiver/puits/puits_palier2_hiver_2.svg",
        "paliers_hiver/puits/puits_palier2_hiver_3.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 167,
      animations: [
        "fountain (3 images, 6/s)"
      ]
    },
    puits_palier3_hiver: {
      nom: "Puits — palier III, l'hiver",
      ete: "puits_palier3",
      fichiers: [
        "paliers_hiver/puits/puits_palier3_hiver_1.svg",
        "paliers_hiver/puits/puits_palier3_hiver_2.svg",
        "paliers_hiver/puits/puits_palier3_hiver_3.svg",
        "paliers_hiver/puits/puits_palier3_hiver_4.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      ms_par_image: 333,
      animations: [
        "laundry (4 images, 3/s)"
      ]
    },
    puits_palier4_hiver: {
      nom: "Puits — palier IV, l'hiver",
      ete: "puits_palier4",
      fichiers: [
        "paliers_hiver/puits/puits_palier4_hiver_1.svg",
        "paliers_hiver/puits/puits_palier4_hiver_2.svg",
        "paliers_hiver/puits/puits_palier4_hiver_3.svg",
        "paliers_hiver/puits/puits_palier4_hiver_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "jets (4 images, 6/s)"
      ]
    },
    puits_palier5_hiver: {
      nom: "Puits — palier V, l'hiver",
      ete: "puits_palier5",
      fichiers: [
        "paliers_hiver/puits/puits_palier5_hiver_1.svg",
        "paliers_hiver/puits/puits_palier5_hiver_2.svg",
        "paliers_hiver/puits/puits_palier5_hiver_3.svg",
        "paliers_hiver/puits/puits_palier5_hiver_4.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 125,
      animations: [
        "fall (4 images, 8/s)"
      ]
    },
    puits_palier6_hiver: {
      nom: "Puits — palier VI, l'hiver",
      ete: "puits_palier6",
      fichiers: [
        "paliers_hiver/puits/puits_palier6_hiver_1.svg",
        "paliers_hiver/puits/puits_palier6_hiver_2.svg",
        "paliers_hiver/puits/puits_palier6_hiver_3.svg",
        "paliers_hiver/puits/puits_palier6_hiver_4.svg",
        "paliers_hiver/puits/puits_palier6_hiver_5.svg",
        "paliers_hiver/puits/puits_palier6_hiver_6.svg",
        "paliers_hiver/puits/puits_palier6_hiver_7.svg",
        "paliers_hiver/puits/puits_palier6_hiver_8.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 125,
      animations: [
        "wheel (8 images, 8/s)"
      ],
      lumieres: [
        {
          u: -1.06,
          v: -0.25,
          z: 48.75,
          rayon: 17.5
        },
        {
          u: -0.11,
          v: -0.25,
          z: 48.75,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.05,
          v: -1.05,
          z: 105
        }
      ]
    },
    puits_palier7_hiver: {
      nom: "Puits — palier VII, l'hiver",
      ete: "puits_palier7",
      fichiers: [
        "paliers_hiver/puits/puits_palier7_hiver_1.svg",
        "paliers_hiver/puits/puits_palier7_hiver_2.svg",
        "paliers_hiver/puits/puits_palier7_hiver_3.svg",
        "paliers_hiver/puits/puits_palier7_hiver_4.svg",
        "paliers_hiver/puits/puits_palier7_hiver_5.svg",
        "paliers_hiver/puits/puits_palier7_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "magic (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: 0,
          v: 0,
          z: 17.5,
          rayon: 50
        },
        {
          u: 0,
          v: 0,
          z: 50,
          rayon: 22.5
        }
      ]
    },
    potager_palier1_hiver: {
      nom: "Potager — palier I, l'hiver",
      ete: "potager_palier1",
      fichiers: [
        "paliers_hiver/potager/potager_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier2_hiver: {
      nom: "Potager — palier II, l'hiver",
      ete: "potager_palier2",
      fichiers: [
        "paliers_hiver/potager/potager_palier2_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier3_hiver: {
      nom: "Potager — palier III, l'hiver",
      ete: "potager_palier3",
      fichiers: [
        "paliers_hiver/potager/potager_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2"
    },
    potager_palier4_hiver: {
      nom: "Potager — palier IV, l'hiver",
      ete: "potager_palier4",
      fichiers: [
        "paliers_hiver/potager/potager_palier4_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3"
    },
    potager_palier5_hiver: {
      nom: "Potager — palier V, l'hiver",
      ete: "potager_palier5",
      fichiers: [
        "paliers_hiver/potager/potager_palier5_hiver_1.svg",
        "paliers_hiver/potager/potager_palier5_hiver_2.svg",
        "paliers_hiver/potager/potager_palier5_hiver_3.svg",
        "paliers_hiver/potager/potager_palier5_hiver_4.svg",
        "paliers_hiver/potager/potager_palier5_hiver_5.svg",
        "paliers_hiver/potager/potager_palier5_hiver_6.svg",
        "paliers_hiver/potager/potager_palier5_hiver_7.svg",
        "paliers_hiver/potager/potager_palier5_hiver_8.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "sails (8 images, 6/s)"
      ]
    },
    potager_palier6_hiver: {
      nom: "Potager — palier VI, l'hiver",
      ete: "potager_palier6",
      fichiers: [
        "paliers_hiver/potager/potager_palier6_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.16,
          v: -0.55,
          z: 16.25,
          rayon: 17.5
        },
        {
          u: -0.71,
          v: -0.55,
          z: 16.25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.2,
          v: -1.2,
          z: 86.25
        }
      ]
    },
    potager_palier7_hiver: {
      nom: "Potager — palier VII, l'hiver",
      ete: "potager_palier7",
      fichiers: [
        "paliers_hiver/potager/potager_palier7_hiver_1.svg",
        "paliers_hiver/potager/potager_palier7_hiver_2.svg",
        "paliers_hiver/potager/potager_palier7_hiver_3.svg",
        "paliers_hiver/potager/potager_palier7_hiver_4.svg",
        "paliers_hiver/potager/potager_palier7_hiver_5.svg",
        "paliers_hiver/potager/potager_palier7_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 333,
      animations: [
        "unicorn (6 images, 3/s)",
        "sparkles (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: -1.05,
          v: -0.95,
          z: 37.5,
          rayon: 27.5
        }
      ]
    },
    atelier_palier1_hiver: {
      nom: "Atelier — palier I, l'hiver",
      ete: "atelier_palier1",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.85,
          v: -0.05,
          z: 7.5,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.55,
          v: -0.05,
          z: 55
        }
      ]
    },
    atelier_palier2_hiver: {
      nom: "Atelier — palier II, l'hiver",
      ete: "atelier_palier2",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier2_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.88,
          v: -0.05,
          z: 8.75,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.55,
          v: -0.2,
          z: 72.5
        }
      ]
    },
    atelier_palier3_hiver: {
      nom: "Atelier — palier III, l'hiver",
      ete: "atelier_palier3",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.88,
          v: -0.05,
          z: 8.75,
          rayon: 32.5
        },
        {
          u: 0.56,
          v: -0.08,
          z: 35,
          rayon: 22.5
        },
        {
          u: 0.42,
          v: 0.6,
          z: 6.25,
          rayon: 15
        }
      ],
      fumees: [
        {
          u: 0.7,
          v: -0.34,
          z: 80
        },
        {
          u: 0.36,
          v: -0.36,
          z: 65
        }
      ]
    },
    atelier_palier4_hiver: {
      nom: "Atelier — palier IV, l'hiver",
      ete: "atelier_palier4",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier4_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 42.5
        },
        {
          u: -0.55,
          v: 0.6,
          z: 12.5,
          rayon: 32.5
        },
        {
          u: -1.05,
          v: 0.6,
          z: 25,
          rayon: 17.5
        },
        {
          u: 0.1,
          v: 0.6,
          z: 25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: 0.91,
          v: -0.15,
          z: 120
        }
      ]
    },
    atelier_palier5_hiver: {
      nom: "Atelier — palier V, l'hiver",
      ete: "atelier_palier5",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier5_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 42.5
        },
        {
          u: -1.09,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.74,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.39,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        },
        {
          u: -0.04,
          v: 0.45,
          z: 27.5,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: 0.93,
          v: -0.15,
          z: 125
        }
      ]
    },
    atelier_palier6_hiver: {
      nom: "Atelier — palier VI, l'hiver",
      ete: "atelier_palier6",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier6_hiver_1.svg",
        "paliers_hiver/atelier/atelier_palier6_hiver_2.svg",
        "paliers_hiver/atelier/atelier_palier6_hiver_3.svg",
        "paliers_hiver/atelier/atelier_palier6_hiver_4.svg",
        "paliers_hiver/atelier/atelier_palier6_hiver_5.svg",
        "paliers_hiver/atelier/atelier_palier6_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "gear (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: 1.4,
          v: -0.15,
          z: 11.25,
          rayon: 45
        },
        {
          u: -1.12,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: -0.87,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: -0.12,
          v: 0.45,
          z: 25,
          rayon: 17.5
        },
        {
          u: 0.13,
          v: 0.45,
          z: 25,
          rayon: 17.5
        }
      ],
      fumees: [
        {
          u: -1.05,
          v: -1.05,
          z: 142.5
        },
        {
          u: -0.45,
          v: -1.1,
          z: 127.5
        },
        {
          u: 0.93,
          v: -0.15,
          z: 135
        }
      ]
    },
    atelier_palier7_hiver: {
      nom: "Atelier — palier VII, l'hiver",
      ete: "atelier_palier7",
      fichiers: [
        "paliers_hiver/atelier/atelier_palier7_hiver_1.svg",
        "paliers_hiver/atelier/atelier_palier7_hiver_2.svg",
        "paliers_hiver/atelier/atelier_palier7_hiver_3.svg",
        "paliers_hiver/atelier/atelier_palier7_hiver_4.svg",
        "paliers_hiver/atelier/atelier_palier7_hiver_5.svg",
        "paliers_hiver/atelier/atelier_palier7_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 167,
      animations: [
        "bubbles (6 images, 6/s)"
      ],
      lumieres: [
        {
          u: -0.75,
          v: -0.12,
          z: 32.5,
          rayon: 17.5
        },
        {
          u: -0.38,
          v: -0.14,
          z: 60,
          rayon: 17.5
        },
        {
          u: -0.62,
          v: -0.1,
          z: 82.5,
          rayon: 17.5
        },
        {
          u: 0.9,
          v: -0.15,
          z: 45,
          rayon: 30
        },
        {
          u: 1.4,
          v: -0.15,
          z: 10,
          rayon: 37.5
        }
      ],
      fumees: [
        {
          u: 0.91,
          v: -0.15,
          z: 82.5
        }
      ]
    },
    ponton_palier1_hiver: {
      nom: "Ponton — palier I, l'hiver",
      ete: "ponton_palier1",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier1_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier2_hiver: {
      nom: "Ponton — palier II, l'hiver",
      ete: "ponton_palier2",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier2_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.82,
          v: 0.14,
          z: 46.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier3_hiver: {
      nom: "Ponton — palier III, l'hiver",
      ete: "ponton_palier3",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier3_hiver.svg"
      ],
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      emprise: "2 × 2",
      lumieres: [
        {
          u: 0.82,
          v: 0.14,
          z: 46.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier4_hiver: {
      nom: "Ponton — palier IV, l'hiver",
      ete: "ponton_palier4",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier4_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier5_hiver: {
      nom: "Ponton — palier V, l'hiver",
      ete: "ponton_palier5",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier5_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: -0.75,
          v: 0.2,
          z: 37.5,
          rayon: 22.5
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier6_hiver: {
      nom: "Ponton — palier VI, l'hiver",
      ete: "ponton_palier6",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier6_hiver.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 25
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: -0.25,
          v: -0.74,
          z: 12.5,
          rayon: 22.5
        }
      ],
      fumees: [
        {
          u: -0.1,
          v: -0.82,
          z: 50
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    },
    ponton_palier7_hiver: {
      nom: "Ponton — palier VII, l'hiver",
      ete: "ponton_palier7",
      fichiers: [
        "paliers_hiver/ponton/ponton_palier7_hiver_1.svg",
        "paliers_hiver/ponton/ponton_palier7_hiver_2.svg",
        "paliers_hiver/ponton/ponton_palier7_hiver_3.svg",
        "paliers_hiver/ponton/ponton_palier7_hiver_4.svg",
        "paliers_hiver/ponton/ponton_palier7_hiver_5.svg",
        "paliers_hiver/ponton/ponton_palier7_hiver_6.svg"
      ],
      cadre: [
        -140,
        -250,
        280,
        330
      ],
      emprise: "3 × 3",
      ms_par_image: 200,
      animations: [
        "kraken (6 images, 5/s)"
      ],
      lumieres: [
        {
          u: -1.12,
          v: -1.12,
          z: 57.5,
          rayon: 27.5
        },
        {
          u: 1.24,
          v: 0.22,
          z: 51.25,
          rayon: 20
        },
        {
          u: 0.95,
          v: -0.12,
          z: 27.5,
          rayon: 20
        },
        {
          u: -0.6,
          v: 0.95,
          z: 5,
          rayon: 20
        }
      ],
      voilier: "compris dans l'image (le jeu le berce à part : décor/ilots/voilier)"
    }
  },
  chantier: {
    nom: "Chantier (3 phases)",
    fichiers: [
      "chantier/chantier_1.svg",
      "chantier/chantier_2.svg",
      "chantier/chantier_3.svg"
    ],
    cadres: [
      [
        -95,
        -155,
        190,
        210
      ],
      [
        -95,
        -155,
        190,
        210
      ],
      [
        -95,
        -155,
        190,
        210
      ]
    ]
  },
  skins: {
    "toit-rouge": {
      nom: "Foyer — toit rouge",
      batiment: "foyer",
      fichiers: [
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier1.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier2.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier3.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier4.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier5.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier6.svg",
        "skins/foyer/toit-rouge/foyer_toit-rouge_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          282.5,
          330
        ]
      ]
    },
    "toit-bleu-foyer": {
      nom: "Foyer — toit bleu",
      batiment: "foyer",
      fichiers: [
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier1.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier2.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier3.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier4.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier5.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier6.svg",
        "skins/foyer/toit-bleu-foyer/foyer_toit-bleu-foyer_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          282.5,
          330
        ]
      ]
    },
    "toit-chaume-foyer": {
      nom: "Foyer — toit de chaume",
      batiment: "foyer",
      fichiers: [
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier1.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier2.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier3.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier4.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier5.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier6.svg",
        "skins/foyer/toit-chaume-foyer/foyer_toit-chaume-foyer_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          282.5,
          330
        ]
      ]
    },
    "roche-ocre": {
      nom: "Carrière — roche ocre",
      batiment: "carriere",
      fichiers: [
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier1.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier2.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier3.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier4.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier5.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier6.svg",
        "skins/carriere/roche-ocre/carriere_roche-ocre_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "roche-granit": {
      nom: "Carrière — granit",
      batiment: "carriere",
      fichiers: [
        "skins/carriere/roche-granit/carriere_roche-granit_palier1.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier2.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier3.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier4.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier5.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier6.svg",
        "skins/carriere/roche-granit/carriere_roche-granit_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "roche-cristal": {
      nom: "Carrière — veines de cristal",
      batiment: "carriere",
      fichiers: [
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier1.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier2.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier3.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier4.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier5.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier6.svg",
        "skins/carriere/roche-cristal/carriere_roche-cristal_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    printemps: {
      nom: "Bosquet — printemps",
      batiment: "bosquet",
      fichiers: [
        "skins/bosquet/printemps/bosquet_printemps_palier1.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier2.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier3.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier4.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier5.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier6.svg",
        "skins/bosquet/printemps/bosquet_printemps_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    automne: {
      nom: "Bosquet — automne",
      batiment: "bosquet",
      fichiers: [
        "skins/bosquet/automne/bosquet_automne_palier1.svg",
        "skins/bosquet/automne/bosquet_automne_palier2.svg",
        "skins/bosquet/automne/bosquet_automne_palier3.svg",
        "skins/bosquet/automne/bosquet_automne_palier4.svg",
        "skins/bosquet/automne/bosquet_automne_palier5.svg",
        "skins/bosquet/automne/bosquet_automne_palier6.svg",
        "skins/bosquet/automne/bosquet_automne_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    givre: {
      nom: "Bosquet — givre",
      batiment: "bosquet",
      fichiers: [
        "skins/bosquet/givre/bosquet_givre_palier1.svg",
        "skins/bosquet/givre/bosquet_givre_palier2.svg",
        "skins/bosquet/givre/bosquet_givre_palier3.svg",
        "skins/bosquet/givre/bosquet_givre_palier4.svg",
        "skins/bosquet/givre/bosquet_givre_palier5.svg",
        "skins/bosquet/givre/bosquet_givre_palier6.svg",
        "skins/bosquet/givre/bosquet_givre_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "toit-bleu": {
      nom: "Puits — kiosque bleu",
      batiment: "puits",
      fichiers: [
        "skins/puits/toit-bleu/puits_toit-bleu_palier1.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier2.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier3.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier4.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier5.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier6.svg",
        "skins/puits/toit-bleu/puits_toit-bleu_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "toit-chaume": {
      nom: "Puits — kiosque de chaume",
      batiment: "puits",
      fichiers: [
        "skins/puits/toit-chaume/puits_toit-chaume_palier1.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier2.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier3.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier4.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier5.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier6.svg",
        "skins/puits/toit-chaume/puits_toit-chaume_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "pierre-blanche": {
      nom: "Puits — pierre blanche",
      batiment: "puits",
      fichiers: [
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier1.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier2.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier3.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier4.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier5.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier6.svg",
        "skins/puits/pierre-blanche/puits_pierre-blanche_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "cloture-blanche": {
      nom: "Potager — clôture blanche",
      batiment: "potager",
      fichiers: [
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier1.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier2.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier3.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier4.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier5.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier6.svg",
        "skins/potager/cloture-blanche/potager_cloture-blanche_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "cloture-pierre": {
      nom: "Potager — muret de pierre",
      batiment: "potager",
      fichiers: [
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier1.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier2.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier3.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier4.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier5.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier6.svg",
        "skins/potager/cloture-pierre/potager_cloture-pierre_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "cloture-fleurie": {
      nom: "Potager — clôture fleurie",
      batiment: "potager",
      fichiers: [
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier1.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier2.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier3.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier4.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier5.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier6.svg",
        "skins/potager/cloture-fleurie/potager_cloture-fleurie_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "enseigne-doree": {
      nom: "Atelier — enseigne dorée",
      batiment: "atelier",
      fichiers: [
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier1.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier2.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier3.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier4.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier5.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier6.svg",
        "skins/atelier/enseigne-doree/atelier_enseigne-doree_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "toit-ardoise": {
      nom: "Atelier — toit d'ardoise",
      batiment: "atelier",
      fichiers: [
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier1.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier2.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier3.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier4.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier5.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier6.svg",
        "skins/atelier/toit-ardoise/atelier_toit-ardoise_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "voile-rouge": {
      nom: "Ponton — voile rouge",
      batiment: "ponton",
      fichiers: [
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier1.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier2.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier3.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier4.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier5.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier6.svg",
        "skins/ponton/voile-rouge/ponton_voile-rouge_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "voile-rayee": {
      nom: "Ponton — voile rayée",
      batiment: "ponton",
      fichiers: [
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier1.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier2.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier3.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier4.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier5.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier6.svg",
        "skins/ponton/voile-rayee/ponton_voile-rayee_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    },
    "voile-bleue": {
      nom: "Ponton — voile bleue",
      batiment: "ponton",
      fichiers: [
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier1.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier2.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier3.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier4.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier5.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier6.svg",
        "skins/ponton/voile-bleue/ponton_voile-bleue_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ]
    }
  },
  objets: {
    pelle: {
      nom: "pelle",
      batiment: "potager",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/pelle/pelle.svg"
          ],
          cadre: [
            -15,
            -43,
            32.5,
            50.5
          ],
          derriere: false,
          place: {
            I: [
              0.6,
              -0.3
            ],
            II: [
              0.42,
              0.58
            ],
            III: [
              0.42,
              0.58
            ],
            IV: [
              0.63,
              0.87
            ],
            V: [
              0.63,
              0.87
            ],
            VI: [
              0.63,
              0.87
            ],
            VII: [
              0.63,
              0.87
            ]
          }
        }
      ]
    },
    arrosoir: {
      nom: "arrosoir",
      batiment: "potager",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/arrosoir/arrosoir.svg"
          ],
          cadre: [
            -17.5,
            -32.5,
            45,
            40
          ],
          derriere: false,
          place: {
            I: [
              0.76,
              0.76
            ],
            II: [
              0.76,
              0.76
            ],
            III: [
              0.76,
              0.76
            ],
            IV: [
              1.14,
              1.14
            ],
            V: [
              1.14,
              1.14
            ],
            VI: [
              1.14,
              1.14
            ],
            VII: [
              1.14,
              1.14
            ]
          }
        }
      ]
    },
    poulailler: {
      nom: "poulailler",
      batiment: "potager",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/poulailler/poulailler_calque1.svg"
          ],
          cadre: [
            -30,
            -60,
            60,
            70
          ],
          derriere: true,
          place: {
            I: [
              0.7,
              -0.78
            ],
            II: [
              0.68,
              -0.62
            ],
            III: [
              0.68,
              -0.62
            ],
            IV: [
              1.02,
              -0.93
            ],
            V: [
              1.02,
              -0.93
            ],
            VI: [
              1.02,
              -0.93
            ],
            VII: [
              1.02,
              -0.93
            ]
          }
        },
        {
          fichiers: [
            "objets/potager/poulailler/poulailler_calque2_1.svg",
            "objets/potager/poulailler/poulailler_calque2_2.svg",
            "objets/potager/poulailler/poulailler_calque2_3.svg",
            "objets/potager/poulailler/poulailler_calque2_4.svg",
            "objets/potager/poulailler/poulailler_calque2_5.svg",
            "objets/potager/poulailler/poulailler_calque2_6.svg",
            "objets/potager/poulailler/poulailler_calque2_7.svg",
            "objets/potager/poulailler/poulailler_calque2_8.svg"
          ],
          cadre: [
            -37.5,
            -32.5,
            80,
            47.5
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            I: [
              0.1,
              0.72
            ],
            II: [
              0.1,
              0.72
            ],
            III: [
              0.1,
              0.72
            ],
            IV: [
              0.15,
              1.08
            ],
            V: [
              0.15,
              1.08
            ],
            VI: [
              0.15,
              1.08
            ],
            VII: [
              0.15,
              1.08
            ]
          }
        }
      ]
    },
    ruche: {
      nom: "ruche",
      batiment: "potager",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/ruche/ruche_calque1.svg"
          ],
          cadre: [
            -22.5,
            -50,
            50,
            58
          ],
          derriere: false,
          place: {
            I: [
              -0.86,
              0.86
            ],
            II: [
              -0.86,
              0.86
            ],
            III: [
              -0.86,
              0.86
            ],
            IV: [
              -1.29,
              1.29
            ],
            V: [
              -1.29,
              1.29
            ],
            VI: [
              -1.29,
              1.29
            ],
            VII: [
              -1.29,
              1.29
            ]
          }
        },
        {
          fichiers: [
            "objets/potager/ruche/ruche_calque2_1.svg",
            "objets/potager/ruche/ruche_calque2_2.svg",
            "objets/potager/ruche/ruche_calque2_3.svg",
            "objets/potager/ruche/ruche_calque2_4.svg",
            "objets/potager/ruche/ruche_calque2_5.svg",
            "objets/potager/ruche/ruche_calque2_6.svg",
            "objets/potager/ruche/ruche_calque2_7.svg",
            "objets/potager/ruche/ruche_calque2_8.svg"
          ],
          cadre: [
            -27.5,
            -60,
            57.5,
            50
          ],
          derriere: false,
          ms_par_image: 100,
          place: {
            I: [
              -0.86,
              0.86
            ],
            II: [
              -0.86,
              0.86
            ],
            III: [
              -0.86,
              0.86
            ],
            IV: [
              -1.29,
              1.29
            ],
            V: [
              -1.29,
              1.29
            ],
            VI: [
              -1.29,
              1.29
            ],
            VII: [
              -1.29,
              1.29
            ]
          }
        }
      ]
    },
    brouette: {
      nom: "brouette",
      batiment: "potager",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/brouette/brouette.svg"
          ],
          cadre: [
            -30,
            -35,
            57.5,
            43
          ],
          derriere: false,
          place: {
            V: [
              1.35,
              -0.08
            ],
            VI: [
              1.35,
              -0.08
            ],
            VII: [
              1.35,
              -0.08
            ]
          }
        }
      ]
    },
    epouvantail: {
      nom: "epouvantail",
      batiment: "potager",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/epouvantail/epouvantail_1.svg",
            "objets/potager/epouvantail/epouvantail_2.svg",
            "objets/potager/epouvantail/epouvantail_3.svg",
            "objets/potager/epouvantail/epouvantail_4.svg",
            "objets/potager/epouvantail/epouvantail_5.svg",
            "objets/potager/epouvantail/epouvantail_6.svg",
            "objets/potager/epouvantail/epouvantail_7.svg",
            "objets/potager/epouvantail/epouvantail_8.svg"
          ],
          cadre: [
            -32.5,
            -67.5,
            65,
            75
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            V: [
              -1.32,
              0.3
            ],
            VI: [
              -1.32,
              0.3
            ],
            VII: [
              -1.32,
              0.3
            ]
          }
        }
      ]
    },
    citrouille: {
      nom: "citrouille",
      batiment: "potager",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/potager/citrouille/citrouille_1.svg",
            "objets/potager/citrouille/citrouille_2.svg",
            "objets/potager/citrouille/citrouille_3.svg",
            "objets/potager/citrouille/citrouille_4.svg",
            "objets/potager/citrouille/citrouille_5.svg",
            "objets/potager/citrouille/citrouille_6.svg",
            "objets/potager/citrouille/citrouille_7.svg",
            "objets/potager/citrouille/citrouille_8.svg"
          ],
          cadre: [
            -32.5,
            -62.5,
            65,
            75
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            V: [
              0.87,
              0.45
            ],
            VI: [
              0.87,
              0.45
            ],
            VII: [
              0.87,
              0.45
            ]
          }
        }
      ],
      lumiere: {
        u: 0.87,
        v: 0.45,
        z: 11.25,
        rayon: 32.5
      }
    },
    pioche: {
      nom: "pioche",
      batiment: "carriere",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/pioche/pioche.svg"
          ],
          cadre: [
            -20,
            -42.5,
            42.5,
            50
          ],
          derriere: false,
          place: {
            I: [
              0.16,
              0.8
            ],
            II: [
              0.16,
              0.8
            ],
            III: [
              0.16,
              0.8
            ],
            IV: [
              0.24,
              1.2
            ],
            V: [
              0.24,
              1.2
            ],
            VI: [
              0.24,
              1.2
            ],
            VII: [
              0.24,
              1.2
            ]
          }
        }
      ]
    },
    wagonnet: {
      nom: "wagonnet",
      batiment: "carriere",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/wagonnet/wagonnet.svg"
          ],
          cadre: [
            -30,
            -35,
            60,
            45
          ],
          derriere: false,
          place: {
            I: [
              0.76,
              0.8
            ],
            II: [
              0.76,
              0.8
            ],
            III: [
              0.76,
              0.8
            ],
            IV: [
              1.14,
              1.2
            ],
            V: [
              1.14,
              1.2
            ],
            VI: [
              1.14,
              1.2
            ],
            VII: [
              1.14,
              1.2
            ]
          }
        }
      ]
    },
    "lanterne-mine": {
      nom: "lanterne mine",
      batiment: "carriere",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/lanterne-mine/lanterne-mine_calque1.svg"
          ],
          cadre: [
            -15,
            -55,
            42.5,
            62.5
          ],
          derriere: false,
          place: {
            I: [
              -0.86,
              0.5
            ],
            II: [
              -0.86,
              0.5
            ],
            III: [
              -0.86,
              0.5
            ],
            IV: [
              -1.29,
              0.75
            ],
            V: [
              -1.29,
              0.75
            ],
            VI: [
              -1.29,
              0.75
            ],
            VII: [
              -1.29,
              0.75
            ]
          }
        },
        {
          fichiers: [
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_1.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_2.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_3.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_4.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_5.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_6.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_7.svg",
            "objets/carriere/lanterne-mine/lanterne-mine_calque2_8.svg"
          ],
          cadre: [
            -2.5,
            -50,
            30,
            32.5
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            I: [
              -0.86,
              0.5
            ],
            II: [
              -0.86,
              0.5
            ],
            III: [
              -0.86,
              0.5
            ],
            IV: [
              -1.29,
              0.75
            ],
            V: [
              -1.29,
              0.75
            ],
            VI: [
              -1.29,
              0.75
            ],
            VII: [
              -1.29,
              0.75
            ]
          }
        }
      ],
      lumiere: {
        u: -0.99,
        v: 0.75,
        z: 30,
        rayon: 27.5
      }
    },
    rails: {
      nom: "rails",
      batiment: "carriere",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/rails/rails_calque1.svg"
          ],
          cadre: [
            -22.5,
            -20,
            45,
            32.5
          ],
          derriere: false,
          place: {
            I: [
              -0.35,
              0.88
            ],
            II: [
              -0.35,
              0.88
            ],
            III: [
              -0.35,
              0.88
            ],
            IV: [
              -0.52,
              1.32
            ],
            V: [
              -0.52,
              1.32
            ],
            VI: [
              -0.52,
              1.32
            ],
            VII: [
              -0.52,
              1.32
            ]
          }
        },
        {
          fichiers: [
            "objets/carriere/rails/rails_calque2_1.svg",
            "objets/carriere/rails/rails_calque2_2.svg",
            "objets/carriere/rails/rails_calque2_3.svg",
            "objets/carriere/rails/rails_calque2_4.svg"
          ],
          cadre: [
            -22.5,
            -32.5,
            45,
            40
          ],
          derriere: false,
          ms_par_image: 125,
          mouvement: true,
          place: {
            I: [
              -0.35,
              0
            ],
            II: [
              -0.35,
              0
            ],
            III: [
              -0.35,
              0
            ],
            IV: [
              -0.52,
              0
            ],
            V: [
              -0.52,
              0
            ],
            VI: [
              -0.52,
              0
            ],
            VII: [
              -0.52,
              0
            ]
          }
        }
      ]
    },
    casque: {
      nom: "casque",
      batiment: "carriere",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/casque/casque.svg"
          ],
          cadre: [
            -25,
            -40,
            50,
            48.5
          ],
          derriere: false,
          place: {
            V: [
              -0.15,
              1.41
            ],
            VI: [
              -0.15,
              1.41
            ],
            VII: [
              -0.15,
              1.41
            ]
          }
        }
      ]
    },
    geode: {
      nom: "geode",
      batiment: "carriere",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/geode/geode_1.svg",
            "objets/carriere/geode/geode_2.svg",
            "objets/carriere/geode/geode_3.svg",
            "objets/carriere/geode/geode_4.svg",
            "objets/carriere/geode/geode_5.svg",
            "objets/carriere/geode/geode_6.svg"
          ],
          cadre: [
            -27.5,
            -37.5,
            55,
            46.5
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            V: [
              -1.38,
              1.23
            ],
            VI: [
              -1.38,
              1.23
            ],
            VII: [
              -1.38,
              1.23
            ]
          }
        }
      ],
      lumiere: {
        u: -1.38,
        v: 1.23,
        z: 10,
        rayon: 25
      }
    },
    golem: {
      nom: "golem",
      batiment: "carriere",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/carriere/golem/golem_1.svg",
            "objets/carriere/golem/golem_2.svg",
            "objets/carriere/golem/golem_3.svg",
            "objets/carriere/golem/golem_4.svg",
            "objets/carriere/golem/golem_5.svg",
            "objets/carriere/golem/golem_6.svg",
            "objets/carriere/golem/golem_7.svg",
            "objets/carriere/golem/golem_8.svg"
          ],
          cadre: [
            -30,
            -67.5,
            60,
            78.5
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            V: [
              -1.35,
              0.12
            ],
            VI: [
              -1.35,
              0.12
            ],
            VII: [
              -1.35,
              0.12
            ]
          }
        }
      ],
      lumiere: {
        u: -1.35,
        v: 0.21,
        z: 32.5,
        rayon: 22.5
      }
    },
    hache: {
      nom: "hache",
      batiment: "bosquet",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/hache/hache.svg"
          ],
          cadre: [
            -30,
            -40,
            57.5,
            48
          ],
          derriere: false,
          place: {
            I: [
              -0.42,
              0.84
            ],
            II: [
              -0.42,
              0.84
            ],
            III: [
              -0.42,
              0.84
            ],
            IV: [
              -0.63,
              1.26
            ],
            V: [
              -0.63,
              1.26
            ],
            VI: [
              -0.63,
              1.26
            ],
            VII: [
              -0.63,
              1.26
            ]
          }
        }
      ]
    },
    scie: {
      nom: "scie",
      batiment: "bosquet",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/scie/scie.svg"
          ],
          cadre: [
            -32.5,
            -42.5,
            65,
            52.5
          ],
          derriere: false,
          place: {
            I: [
              0.78,
              -0.74
            ],
            II: [
              0.78,
              -0.74
            ],
            III: [
              0.78,
              -0.74
            ],
            IV: [
              1.17,
              -1.11
            ],
            V: [
              1.17,
              -1.11
            ],
            VI: [
              1.17,
              -1.11
            ],
            VII: [
              1.17,
              -1.11
            ]
          }
        }
      ]
    },
    nichoir: {
      nom: "nichoir",
      batiment: "bosquet",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/nichoir/nichoir_calque1.svg"
          ],
          cadre: [
            -17.5,
            -71,
            35,
            78.5
          ],
          derriere: false,
          place: {
            I: [
              0.86,
              0.12
            ],
            II: [
              0.86,
              0.12
            ],
            III: [
              0.86,
              0.12
            ],
            IV: [
              1.29,
              0.18
            ],
            V: [
              1.29,
              0.18
            ],
            VI: [
              1.29,
              0.18
            ],
            VII: [
              1.29,
              0.18
            ]
          }
        },
        {
          fichiers: [
            "objets/bosquet/nichoir/nichoir_calque2_1.svg",
            "objets/bosquet/nichoir/nichoir_calque2_2.svg",
            "objets/bosquet/nichoir/nichoir_calque2_3.svg",
            "objets/bosquet/nichoir/nichoir_calque2_4.svg",
            "objets/bosquet/nichoir/nichoir_calque2_5.svg",
            "objets/bosquet/nichoir/nichoir_calque2_6.svg",
            "objets/bosquet/nichoir/nichoir_calque2_7.svg",
            "objets/bosquet/nichoir/nichoir_calque2_8.svg"
          ],
          cadre: [
            -32.5,
            -22.5,
            65,
            30
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            I: [
              0.75,
              0.42
            ],
            II: [
              0.75,
              0.42
            ],
            III: [
              0.75,
              0.42
            ],
            IV: [
              1.13,
              0.63
            ],
            V: [
              1.13,
              0.63
            ],
            VI: [
              1.13,
              0.63
            ],
            VII: [
              1.13,
              0.63
            ]
          }
        }
      ]
    },
    charrette: {
      nom: "charrette",
      batiment: "bosquet",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/charrette/charrette.svg"
          ],
          cadre: [
            -37.5,
            -42.5,
            77.5,
            53.5
          ],
          derriere: false,
          place: {
            I: [
              0.62,
              0.78
            ],
            II: [
              0.25,
              0.84
            ],
            III: [
              0.25,
              0.84
            ],
            IV: [
              0.38,
              1.26
            ],
            V: [
              0.38,
              1.26
            ],
            VI: [
              0.38,
              1.26
            ],
            VII: [
              0.38,
              1.26
            ]
          }
        }
      ]
    },
    "passe-partout": {
      nom: "passe partout",
      batiment: "bosquet",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/passe-partout/passe-partout.svg"
          ],
          cadre: [
            -37.5,
            -40,
            72.5,
            51.5
          ],
          derriere: false,
          place: {
            V: [
              1.35,
              0.93
            ],
            VI: [
              1.35,
              0.93
            ],
            VII: [
              1.35,
              0.93
            ]
          }
        }
      ]
    },
    ecureuil: {
      nom: "ecureuil",
      batiment: "bosquet",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/ecureuil/ecureuil_1.svg",
            "objets/bosquet/ecureuil/ecureuil_2.svg",
            "objets/bosquet/ecureuil/ecureuil_3.svg",
            "objets/bosquet/ecureuil/ecureuil_4.svg",
            "objets/bosquet/ecureuil/ecureuil_5.svg",
            "objets/bosquet/ecureuil/ecureuil_6.svg",
            "objets/bosquet/ecureuil/ecureuil_7.svg",
            "objets/bosquet/ecureuil/ecureuil_8.svg"
          ],
          cadre: [
            -22.5,
            -47.5,
            45,
            55
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            V: [
              -0.18,
              1.41
            ],
            VI: [
              -0.18,
              1.41
            ],
            VII: [
              -0.18,
              1.41
            ]
          }
        }
      ]
    },
    cerf: {
      nom: "cerf",
      batiment: "bosquet",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/bosquet/cerf/cerf_1.svg",
            "objets/bosquet/cerf/cerf_2.svg",
            "objets/bosquet/cerf/cerf_3.svg",
            "objets/bosquet/cerf/cerf_4.svg",
            "objets/bosquet/cerf/cerf_5.svg",
            "objets/bosquet/cerf/cerf_6.svg",
            "objets/bosquet/cerf/cerf_7.svg",
            "objets/bosquet/cerf/cerf_8.svg"
          ],
          cadre: [
            -32.5,
            -62.5,
            62.5,
            70
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            V: [
              1.35,
              -0.45
            ],
            VI: [
              1.35,
              -0.45
            ],
            VII: [
              1.35,
              -0.45
            ]
          }
        }
      ],
      lumiere: {
        u: 1.35,
        v: -0.45,
        z: 35,
        rayon: 22.5
      }
    },
    "seau-cuivre": {
      nom: "seau cuivre",
      batiment: "puits",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/seau-cuivre/seau-cuivre.svg"
          ],
          cadre: [
            -17.5,
            -30,
            35,
            37.5
          ],
          derriere: false,
          place: {
            I: [
              0.3,
              0.88
            ],
            II: [
              0.3,
              0.88
            ],
            III: [
              0.3,
              0.88
            ],
            IV: [
              0.45,
              1.32
            ],
            V: [
              0.45,
              1.32
            ],
            VI: [
              0.45,
              1.32
            ],
            VII: [
              0.45,
              1.32
            ]
          }
        }
      ]
    },
    poulie: {
      nom: "poulie",
      batiment: "puits",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/poulie/poulie_des_palier1.svg",
            "objets/puits/poulie/poulie_des_palier2.svg"
          ],
          cadre: [
            [
              -27.5,
              -62.5,
              50,
              70
            ],
            [
              -27.5,
              -62.5,
              50,
              70
            ]
          ],
          derriere: false,
          place: {
            I: [
              0.44,
              0
            ],
            II: [
              0.84,
              0.32
            ],
            III: [
              0.84,
              0.32
            ],
            IV: [
              1.26,
              0.48
            ],
            V: [
              1.26,
              0.48
            ],
            VI: [
              1.26,
              0.48
            ],
            VII: [
              1.26,
              0.48
            ]
          }
        }
      ]
    },
    abreuvoir: {
      nom: "abreuvoir",
      batiment: "puits",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/abreuvoir/abreuvoir_calque1.svg"
          ],
          cadre: [
            -30,
            -22.5,
            60,
            32.5
          ],
          derriere: false,
          place: {
            I: [
              -0.78,
              0.66
            ],
            II: [
              -0.78,
              0.66
            ],
            III: [
              -0.78,
              0.66
            ],
            IV: [
              -1.17,
              0.99
            ],
            V: [
              -1.17,
              0.99
            ],
            VI: [
              -1.17,
              0.99
            ],
            VII: [
              -1.17,
              0.99
            ]
          }
        },
        {
          fichiers: [
            "objets/puits/abreuvoir/abreuvoir_calque2_1.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_2.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_3.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_4.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_5.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_6.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_7.svg",
            "objets/puits/abreuvoir/abreuvoir_calque2_8.svg"
          ],
          cadre: [
            -27.5,
            -35,
            47.5,
            40
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            I: [
              -0.5,
              0.74
            ],
            II: [
              -0.5,
              0.74
            ],
            III: [
              -0.5,
              0.74
            ],
            IV: [
              -0.75,
              1.11
            ],
            V: [
              -0.75,
              1.11
            ],
            VI: [
              -0.75,
              1.11
            ],
            VII: [
              -0.75,
              1.11
            ]
          }
        }
      ]
    },
    pompe: {
      nom: "pompe",
      batiment: "puits",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/pompe/pompe_calque1.svg"
          ],
          cadre: [
            -22.5,
            -52.5,
            45,
            61.5
          ],
          derriere: true,
          place: {
            I: [
              0.74,
              -0.62
            ],
            II: [
              0.74,
              -0.62
            ],
            III: [
              0.74,
              -0.62
            ],
            IV: [
              1.11,
              -0.93
            ],
            V: [
              1.11,
              -0.93
            ],
            VI: [
              1.11,
              -0.93
            ],
            VII: [
              1.11,
              -0.93
            ]
          }
        },
        {
          fichiers: [
            "objets/puits/pompe/pompe_calque2_1.svg",
            "objets/puits/pompe/pompe_calque2_2.svg",
            "objets/puits/pompe/pompe_calque2_3.svg",
            "objets/puits/pompe/pompe_calque2_4.svg",
            "objets/puits/pompe/pompe_calque2_5.svg",
            "objets/puits/pompe/pompe_calque2_6.svg",
            "objets/puits/pompe/pompe_calque2_7.svg",
            "objets/puits/pompe/pompe_calque2_8.svg"
          ],
          cadre: [
            -15,
            -50,
            40,
            57.5
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            I: [
              0.74,
              -0.62
            ],
            II: [
              0.74,
              -0.62
            ],
            III: [
              0.74,
              -0.62
            ],
            IV: [
              1.11,
              -0.93
            ],
            V: [
              1.11,
              -0.93
            ],
            VI: [
              1.11,
              -0.93
            ],
            VII: [
              1.11,
              -0.93
            ]
          }
        }
      ]
    },
    sourcier: {
      nom: "sourcier",
      batiment: "puits",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/sourcier/sourcier_1.svg",
            "objets/puits/sourcier/sourcier_2.svg",
            "objets/puits/sourcier/sourcier_3.svg",
            "objets/puits/sourcier/sourcier_4.svg",
            "objets/puits/sourcier/sourcier_5.svg",
            "objets/puits/sourcier/sourcier_6.svg"
          ],
          cadre: [
            -22.5,
            -42.5,
            45,
            50
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            V: [
              1.38,
              -0.18
            ],
            VI: [
              1.38,
              -0.18
            ],
            VII: [
              1.38,
              -0.18
            ]
          }
        }
      ]
    },
    canards: {
      nom: "canards",
      batiment: "puits",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/canards/canards_1.svg",
            "objets/puits/canards/canards_2.svg",
            "objets/puits/canards/canards_3.svg",
            "objets/puits/canards/canards_4.svg",
            "objets/puits/canards/canards_5.svg",
            "objets/puits/canards/canards_6.svg",
            "objets/puits/canards/canards_7.svg",
            "objets/puits/canards/canards_8.svg",
            "objets/puits/canards/canards_9.svg",
            "objets/puits/canards/canards_10.svg",
            "objets/puits/canards/canards_11.svg",
            "objets/puits/canards/canards_12.svg"
          ],
          cadre: [
            -32.5,
            -35,
            65,
            46
          ],
          derriere: false,
          ms_par_image: 500,
          place: {
            V: [
              1.17,
              1.11
            ],
            VI: [
              1.17,
              1.11
            ],
            VII: [
              1.17,
              1.11
            ]
          }
        }
      ]
    },
    naiade: {
      nom: "naiade",
      batiment: "puits",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/puits/naiade/naiade_1.svg",
            "objets/puits/naiade/naiade_2.svg",
            "objets/puits/naiade/naiade_3.svg",
            "objets/puits/naiade/naiade_4.svg",
            "objets/puits/naiade/naiade_5.svg",
            "objets/puits/naiade/naiade_6.svg",
            "objets/puits/naiade/naiade_7.svg",
            "objets/puits/naiade/naiade_8.svg"
          ],
          cadre: [
            -27.5,
            -75,
            55,
            85
          ],
          derriere: false,
          ms_par_image: 167,
          place: {
            V: [
              -1.35,
              0.15
            ],
            VI: [
              -1.35,
              0.15
            ],
            VII: [
              -1.35,
              0.15
            ]
          }
        }
      ],
      lumiere: {
        u: -1.35,
        v: 0.15,
        z: 17.5,
        rayon: 27.5
      }
    },
    canne: {
      nom: "canne",
      batiment: "ponton",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/canne/canne_des_palier1_1.svg",
            "objets/ponton/canne/canne_des_palier1_2.svg",
            "objets/ponton/canne/canne_des_palier1_3.svg",
            "objets/ponton/canne/canne_des_palier1_4.svg",
            "objets/ponton/canne/canne_des_palier1_5.svg",
            "objets/ponton/canne/canne_des_palier1_6.svg",
            "objets/ponton/canne/canne_des_palier1_7.svg",
            "objets/ponton/canne/canne_des_palier1_8.svg",
            "objets/ponton/canne/canne_des_palier2_1.svg",
            "objets/ponton/canne/canne_des_palier2_2.svg",
            "objets/ponton/canne/canne_des_palier2_3.svg",
            "objets/ponton/canne/canne_des_palier2_4.svg",
            "objets/ponton/canne/canne_des_palier2_5.svg",
            "objets/ponton/canne/canne_des_palier2_6.svg",
            "objets/ponton/canne/canne_des_palier2_7.svg",
            "objets/ponton/canne/canne_des_palier2_8.svg"
          ],
          cadre: [
            [
              -32.5,
              -50,
              52.5,
              67.5
            ],
            [
              -32.5,
              -50,
              52.5,
              67.5
            ]
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            I: [
              0.62,
              0.2
            ],
            II: [
              0.73,
              0.45
            ],
            III: [
              0.73,
              0.45
            ],
            IV: [
              1.1,
              0.68
            ],
            V: [
              1.1,
              0.68
            ],
            VI: [
              1.1,
              0.68
            ],
            VII: [
              1.1,
              0.68
            ]
          }
        }
      ]
    },
    filet: {
      nom: "filet",
      batiment: "ponton",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/filet/filet.svg"
          ],
          cadre: [
            -22.5,
            -30,
            45,
            35
          ],
          derriere: false,
          place: {
            I: [
              0.34,
              -0.06
            ],
            II: [
              0.6,
              -0.04
            ],
            III: [
              0.6,
              -0.04
            ],
            IV: [
              0.9,
              -0.06
            ],
            V: [
              0.9,
              -0.06
            ],
            VI: [
              0.9,
              -0.06
            ],
            VII: [
              0.9,
              -0.06
            ]
          }
        }
      ]
    },
    casier: {
      nom: "casier",
      batiment: "ponton",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/casier/casier_calque1.svg"
          ],
          cadre: [
            -22.5,
            -30,
            50,
            39.5
          ],
          derriere: false,
          place: {
            I: [
              -0.84,
              0.46
            ],
            II: [
              -0.84,
              0.46
            ],
            III: [
              -0.84,
              0.46
            ],
            IV: [
              -1.26,
              0.69
            ],
            V: [
              -1.26,
              0.69
            ],
            VI: [
              -1.26,
              0.69
            ],
            VII: [
              -1.26,
              0.69
            ]
          }
        },
        {
          fichiers: [
            "objets/ponton/casier/casier_calque2_1.svg",
            "objets/ponton/casier/casier_calque2_2.svg",
            "objets/ponton/casier/casier_calque2_3.svg",
            "objets/ponton/casier/casier_calque2_4.svg"
          ],
          cadre: [
            -12.5,
            -15,
            25,
            18.75
          ],
          derriere: false,
          ms_par_image: 143,
          mouvement: true,
          place: {
            I: [
              -0.66,
              0.84
            ],
            II: [
              -0.66,
              0.84
            ],
            III: [
              -0.66,
              0.84
            ],
            IV: [
              -0.99,
              1.26
            ],
            V: [
              -0.99,
              1.26
            ],
            VI: [
              -0.99,
              1.26
            ],
            VII: [
              -0.99,
              1.26
            ]
          }
        }
      ]
    },
    barque: {
      nom: "barque",
      batiment: "ponton",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/barque/barque_1.svg",
            "objets/ponton/barque/barque_2.svg",
            "objets/ponton/barque/barque_3.svg",
            "objets/ponton/barque/barque_4.svg",
            "objets/ponton/barque/barque_5.svg",
            "objets/ponton/barque/barque_6.svg",
            "objets/ponton/barque/barque_7.svg",
            "objets/ponton/barque/barque_8.svg"
          ],
          cadre: [
            -32.5,
            -37.5,
            65,
            49
          ],
          derriere: true,
          ms_par_image: 200,
          mouvement: true,
          place: {
            I: [
              0.46,
              -0.62
            ],
            II: [
              0.46,
              -0.62
            ],
            III: [
              0.46,
              -0.62
            ],
            IV: [
              0.69,
              -0.93
            ],
            V: [
              0.69,
              -0.93
            ],
            VI: [
              0.69,
              -0.93
            ],
            VII: [
              0.69,
              -0.93
            ]
          }
        }
      ]
    },
    harpon: {
      nom: "harpon",
      batiment: "ponton",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/harpon/harpon.svg"
          ],
          cadre: [
            -32.5,
            -37.5,
            65,
            48.5
          ],
          derriere: false,
          place: {
            V: [
              0.75,
              -1.38
            ],
            VI: [
              0.75,
              -1.38
            ],
            VII: [
              0.75,
              -1.38
            ]
          }
        }
      ]
    },
    pelican: {
      nom: "pelican",
      batiment: "ponton",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/pelican/pelican_1.svg",
            "objets/ponton/pelican/pelican_2.svg",
            "objets/ponton/pelican/pelican_3.svg",
            "objets/ponton/pelican/pelican_4.svg",
            "objets/ponton/pelican/pelican_5.svg",
            "objets/ponton/pelican/pelican_6.svg",
            "objets/ponton/pelican/pelican_7.svg",
            "objets/ponton/pelican/pelican_8.svg"
          ],
          cadre: [
            -27.5,
            -60,
            50,
            67.5
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            V: [
              1.38,
              -0.18
            ],
            VI: [
              1.38,
              -0.18
            ],
            VII: [
              1.38,
              -0.18
            ]
          }
        }
      ]
    },
    sirene: {
      nom: "sirene",
      batiment: "ponton",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/ponton/sirene/sirene_1.svg",
            "objets/ponton/sirene/sirene_2.svg",
            "objets/ponton/sirene/sirene_3.svg",
            "objets/ponton/sirene/sirene_4.svg",
            "objets/ponton/sirene/sirene_5.svg",
            "objets/ponton/sirene/sirene_6.svg",
            "objets/ponton/sirene/sirene_7.svg",
            "objets/ponton/sirene/sirene_8.svg"
          ],
          cadre: [
            -32.5,
            -55,
            65,
            64
          ],
          derriere: false,
          ms_par_image: 250,
          place: {
            V: [
              -0.15,
              1.41
            ],
            VI: [
              -0.15,
              1.41
            ],
            VII: [
              -0.15,
              1.41
            ]
          }
        }
      ],
      lumiere: {
        u: -0.15,
        v: 1.41,
        z: 17.5,
        rayon: 22.5
      }
    },
    etabli: {
      nom: "etabli",
      batiment: "atelier",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/etabli/etabli.svg"
          ],
          cadre: [
            -32.5,
            -40,
            65,
            49.5
          ],
          derriere: false,
          place: {
            I: [
              0.82,
              -0.78
            ],
            II: [
              0.82,
              -0.78
            ],
            III: [
              0.82,
              -0.78
            ],
            IV: [
              1.23,
              -1.17
            ],
            V: [
              1.23,
              -1.17
            ],
            VI: [
              1.23,
              -1.17
            ],
            VII: [
              1.23,
              -1.17
            ]
          }
        }
      ]
    },
    enclume: {
      nom: "enclume",
      batiment: "atelier",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/enclume/enclume_calque1.svg"
          ],
          cadre: [
            -22.5,
            -35,
            47.5,
            43
          ],
          derriere: false,
          place: {
            I: [
              -0.72,
              0.76
            ],
            II: [
              -0.04,
              0.86
            ],
            III: [
              -0.04,
              0.86
            ],
            IV: [
              -0.06,
              1.29
            ],
            V: [
              -0.06,
              1.29
            ],
            VI: [
              -0.06,
              1.29
            ],
            VII: [
              -0.06,
              1.29
            ]
          }
        },
        {
          fichiers: [
            "objets/atelier/enclume/enclume_calque2_1.svg",
            "objets/atelier/enclume/enclume_calque2_2.svg",
            "objets/atelier/enclume/enclume_calque2_3.svg",
            "objets/atelier/enclume/enclume_calque2_4.svg",
            "objets/atelier/enclume/enclume_calque2_5.svg",
            "objets/atelier/enclume/enclume_calque2_6.svg",
            "objets/atelier/enclume/enclume_calque2_7.svg",
            "objets/atelier/enclume/enclume_calque2_8.svg"
          ],
          cadre: [
            -15,
            -43,
            30,
            30.5
          ],
          derriere: false,
          ms_par_image: 167,
          place: {
            I: [
              -0.72,
              0.76
            ],
            II: [
              -0.04,
              0.86
            ],
            III: [
              -0.04,
              0.86
            ],
            IV: [
              -0.06,
              1.29
            ],
            V: [
              -0.06,
              1.29
            ],
            VI: [
              -0.06,
              1.29
            ],
            VII: [
              -0.06,
              1.29
            ]
          }
        }
      ],
      lumiere: {
        u: -0.09,
        v: 1.29,
        z: 22.5,
        rayon: 15
      }
    },
    soufflet: {
      nom: "soufflet",
      batiment: "atelier",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/soufflet/soufflet_1.svg",
            "objets/atelier/soufflet/soufflet_2.svg",
            "objets/atelier/soufflet/soufflet_3.svg",
            "objets/atelier/soufflet/soufflet_4.svg",
            "objets/atelier/soufflet/soufflet_5.svg",
            "objets/atelier/soufflet/soufflet_6.svg",
            "objets/atelier/soufflet/soufflet_7.svg",
            "objets/atelier/soufflet/soufflet_8.svg"
          ],
          cadre: [
            -30,
            -37.5,
            60,
            50
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            I: [
              0.84,
              0.5
            ],
            II: [
              0.84,
              0.5
            ],
            III: [
              0.84,
              0.5
            ],
            IV: [
              1.26,
              0.75
            ],
            V: [
              1.26,
              0.75
            ],
            VI: [
              1.26,
              0.75
            ],
            VII: [
              1.26,
              0.75
            ]
          }
        }
      ]
    },
    "marteau-pilon": {
      nom: "marteau pilon",
      batiment: "atelier",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/marteau-pilon/marteau-pilon_1.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_2.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_3.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_4.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_5.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_6.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_7.svg",
            "objets/atelier/marteau-pilon/marteau-pilon_8.svg"
          ],
          cadre: [
            -27.5,
            -64,
            55,
            73
          ],
          derriere: false,
          ms_par_image: 167,
          place: {
            V: [
              0.9,
              1.38
            ],
            VI: [
              0.9,
              1.38
            ],
            VII: [
              0.9,
              1.38
            ]
          }
        }
      ]
    },
    automate: {
      nom: "automate",
      batiment: "atelier",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/automate/automate_1.svg",
            "objets/atelier/automate/automate_2.svg",
            "objets/atelier/automate/automate_3.svg",
            "objets/atelier/automate/automate_4.svg",
            "objets/atelier/automate/automate_5.svg",
            "objets/atelier/automate/automate_6.svg",
            "objets/atelier/automate/automate_7.svg",
            "objets/atelier/automate/automate_8.svg"
          ],
          cadre: [
            -25,
            -55,
            50,
            62.5
          ],
          derriere: false,
          ms_par_image: 167,
          place: {
            V: [
              -1.35,
              1.29
            ],
            VI: [
              -1.35,
              1.29
            ],
            VII: [
              -1.35,
              1.29
            ]
          }
        }
      ]
    },
    athanor: {
      nom: "athanor",
      batiment: "atelier",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/atelier/athanor/athanor_1.svg",
            "objets/atelier/athanor/athanor_2.svg",
            "objets/atelier/athanor/athanor_3.svg",
            "objets/atelier/athanor/athanor_4.svg",
            "objets/atelier/athanor/athanor_5.svg",
            "objets/atelier/athanor/athanor_6.svg",
            "objets/atelier/athanor/athanor_7.svg",
            "objets/atelier/athanor/athanor_8.svg"
          ],
          cadre: [
            -32.5,
            -80,
            65,
            90
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            V: [
              -0.6,
              1.41
            ],
            VI: [
              -0.6,
              1.41
            ],
            VII: [
              -0.6,
              1.41
            ]
          }
        }
      ],
      lumiere: {
        u: -0.6,
        v: 1.41,
        z: 20,
        rayon: 30
      }
    },
    cuisine: {
      nom: "cuisine",
      batiment: "foyer",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/cuisine/cuisine_calque1.svg"
          ],
          cadre: [
            -30,
            -47.5,
            57.5,
            58
          ],
          derriere: false,
          place: {
            I: [
              -0.84,
              0.8
            ],
            II: [
              -0.84,
              0.8
            ],
            III: [
              -0.84,
              0.8
            ],
            IV: [
              -1.26,
              1.2
            ],
            V: [
              -1.26,
              1.2
            ],
            VI: [
              -1.26,
              1.2
            ],
            VII: [
              -1.26,
              1.2
            ]
          }
        },
        {
          fichiers: [
            "objets/foyer/cuisine/cuisine_calque2_1.svg",
            "objets/foyer/cuisine/cuisine_calque2_2.svg",
            "objets/foyer/cuisine/cuisine_calque2_3.svg",
            "objets/foyer/cuisine/cuisine_calque2_4.svg",
            "objets/foyer/cuisine/cuisine_calque2_5.svg",
            "objets/foyer/cuisine/cuisine_calque2_6.svg",
            "objets/foyer/cuisine/cuisine_calque2_7.svg",
            "objets/foyer/cuisine/cuisine_calque2_8.svg"
          ],
          cadre: [
            -17.5,
            -67.5,
            37.5,
            72.5
          ],
          derriere: false,
          ms_par_image: 200,
          place: {
            I: [
              -0.84,
              0.8
            ],
            II: [
              -0.84,
              0.8
            ],
            III: [
              -0.84,
              0.8
            ],
            IV: [
              -1.26,
              1.2
            ],
            V: [
              -1.26,
              1.2
            ],
            VI: [
              -1.26,
              1.2
            ],
            VII: [
              -1.26,
              1.2
            ]
          }
        }
      ],
      lumiere: {
        u: -1.29,
        v: 1.38,
        z: 12.5,
        rayon: 20
      }
    },
    lit: {
      nom: "lit",
      batiment: "foyer",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/lit/lit_calque1.svg"
          ],
          cadre: [
            -27.5,
            -41.5,
            57.5,
            59
          ],
          derriere: false,
          place: {
            I: [
              0.9,
              -0.22
            ],
            II: [
              0.9,
              -0.22
            ],
            III: [
              0.9,
              -0.22
            ],
            IV: [
              1.35,
              -0.33
            ],
            V: [
              1.35,
              -0.33
            ],
            VI: [
              1.35,
              -0.33
            ],
            VII: [
              1.35,
              -0.33
            ]
          }
        },
        {
          fichiers: [
            "objets/foyer/lit/lit_calque2_1.svg",
            "objets/foyer/lit/lit_calque2_2.svg",
            "objets/foyer/lit/lit_calque2_3.svg",
            "objets/foyer/lit/lit_calque2_4.svg",
            "objets/foyer/lit/lit_calque2_5.svg",
            "objets/foyer/lit/lit_calque2_6.svg",
            "objets/foyer/lit/lit_calque2_7.svg",
            "objets/foyer/lit/lit_calque2_8.svg"
          ],
          cadre: [
            -25,
            -33,
            52.5,
            43
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            I: [
              0.9,
              -0.22
            ],
            II: [
              0.9,
              -0.22
            ],
            III: [
              0.9,
              -0.22
            ],
            IV: [
              1.35,
              -0.33
            ],
            V: [
              1.35,
              -0.33
            ],
            VI: [
              1.35,
              -0.33
            ],
            VII: [
              1.35,
              -0.33
            ]
          }
        }
      ]
    },
    chat: {
      nom: "chat",
      batiment: "foyer",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/chat/chat_1.svg",
            "objets/foyer/chat/chat_2.svg",
            "objets/foyer/chat/chat_3.svg",
            "objets/foyer/chat/chat_4.svg",
            "objets/foyer/chat/chat_5.svg",
            "objets/foyer/chat/chat_6.svg",
            "objets/foyer/chat/chat_7.svg",
            "objets/foyer/chat/chat_8.svg"
          ],
          cadre: [
            -17.5,
            -20,
            35,
            25
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            I: [
              0.46,
              0.8
            ],
            II: [
              0.46,
              0.8
            ],
            III: [
              0.46,
              0.8
            ],
            IV: [
              0.69,
              1.2
            ],
            V: [
              0.69,
              1.2
            ],
            VI: [
              0.69,
              1.2
            ],
            VII: [
              0.69,
              1.2
            ]
          }
        }
      ]
    },
    chien: {
      nom: "chien",
      batiment: "foyer",
      paliers: "I à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/chien/chien_1.svg",
            "objets/foyer/chien/chien_2.svg",
            "objets/foyer/chien/chien_3.svg",
            "objets/foyer/chien/chien_4.svg",
            "objets/foyer/chien/chien_5.svg",
            "objets/foyer/chien/chien_6.svg",
            "objets/foyer/chien/chien_7.svg",
            "objets/foyer/chien/chien_8.svg"
          ],
          cadre: [
            -20,
            -32.5,
            42.5,
            37.5
          ],
          derriere: false,
          ms_par_image: 167,
          place: {
            I: [
              -0.24,
              0.88
            ],
            II: [
              -0.24,
              0.88
            ],
            III: [
              -0.24,
              0.88
            ],
            IV: [
              -0.36,
              1.32
            ],
            V: [
              -0.36,
              1.32
            ],
            VI: [
              -0.36,
              1.32
            ],
            VII: [
              -0.36,
              1.32
            ]
          }
        }
      ]
    },
    sablier: {
      nom: "sablier",
      batiment: "foyer",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/sablier/sablier_1.svg",
            "objets/foyer/sablier/sablier_2.svg",
            "objets/foyer/sablier/sablier_3.svg",
            "objets/foyer/sablier/sablier_4.svg",
            "objets/foyer/sablier/sablier_5.svg",
            "objets/foyer/sablier/sablier_6.svg",
            "objets/foyer/sablier/sablier_7.svg",
            "objets/foyer/sablier/sablier_8.svg"
          ],
          cadre: [
            -20,
            -57.5,
            40,
            65
          ],
          derriere: false,
          ms_par_image: 500,
          place: {
            V: [
              1.38,
              0.93
            ],
            VI: [
              1.38,
              0.93
            ],
            VII: [
              1.38,
              0.93
            ]
          }
        }
      ]
    },
    hibou: {
      nom: "hibou",
      batiment: "foyer",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/hibou/hibou_1.svg",
            "objets/foyer/hibou/hibou_2.svg",
            "objets/foyer/hibou/hibou_3.svg",
            "objets/foyer/hibou/hibou_4.svg",
            "objets/foyer/hibou/hibou_5.svg",
            "objets/foyer/hibou/hibou_6.svg",
            "objets/foyer/hibou/hibou_7.svg",
            "objets/foyer/hibou/hibou_8.svg"
          ],
          cadre: [
            -20,
            -57.5,
            40,
            65
          ],
          derriere: false,
          ms_par_image: 333,
          place: {
            V: [
              -1.38,
              0.54
            ],
            VI: [
              -1.38,
              0.54
            ],
            VII: [
              -1.38,
              0.54
            ]
          }
        }
      ]
    },
    grimoire: {
      nom: "grimoire",
      batiment: "foyer",
      paliers: "V à VII",
      calques: [
        {
          fichiers: [
            "objets/foyer/grimoire/grimoire_calque1.svg"
          ],
          cadre: [
            -17.5,
            -27.5,
            35,
            35
          ],
          derriere: false,
          place: {
            V: [
              1.32,
              1.42
            ],
            VI: [
              1.32,
              1.42
            ],
            VII: [
              1.32,
              1.42
            ]
          }
        },
        {
          fichiers: [
            "objets/foyer/grimoire/grimoire_calque2_1.svg",
            "objets/foyer/grimoire/grimoire_calque2_2.svg",
            "objets/foyer/grimoire/grimoire_calque2_3.svg",
            "objets/foyer/grimoire/grimoire_calque2_4.svg",
            "objets/foyer/grimoire/grimoire_calque2_5.svg",
            "objets/foyer/grimoire/grimoire_calque2_6.svg",
            "objets/foyer/grimoire/grimoire_calque2_7.svg",
            "objets/foyer/grimoire/grimoire_calque2_8.svg"
          ],
          cadre: [
            -27.5,
            -62.5,
            55,
            45
          ],
          derriere: false,
          ms_par_image: 200,
          mouvement: true,
          place: {
            V: [
              1.32,
              1.42
            ],
            VI: [
              1.32,
              1.42
            ],
            VII: [
              1.32,
              1.42
            ]
          }
        }
      ],
      lumiere: {
        u: 1.32,
        v: 1.42,
        z: 30,
        rayon: 27.5
      }
    }
  },
  pieces_rares: {
    papillons: {
      nom: "papillons",
      batiment: "potager",
      fichiers: [
        "pieces_rares/papillons/papillons_potager_palier1.svg",
        "pieces_rares/papillons/papillons_potager_palier2.svg",
        "pieces_rares/papillons/papillons_potager_palier3.svg",
        "pieces_rares/papillons/papillons_potager_palier4.svg",
        "pieces_rares/papillons/papillons_potager_palier5.svg",
        "pieces_rares/papillons/papillons_potager_palier6.svg",
        "pieces_rares/papillons/papillons_potager_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    tournesols: {
      nom: "tournesols",
      batiment: "potager",
      fichiers: [
        "pieces_rares/tournesols/tournesols_potager_palier1.svg",
        "pieces_rares/tournesols/tournesols_potager_palier2.svg",
        "pieces_rares/tournesols/tournesols_potager_palier3.svg",
        "pieces_rares/tournesols/tournesols_potager_palier4.svg",
        "pieces_rares/tournesols/tournesols_potager_palier5.svg",
        "pieces_rares/tournesols/tournesols_potager_palier6.svg",
        "pieces_rares/tournesols/tournesols_potager_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    "filon-or": {
      nom: "filon or",
      batiment: "carriere",
      fichiers: [
        "pieces_rares/filon-or/filon-or_carriere_palier1.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier2.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier3.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier4.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier5.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier6.svg",
        "pieces_rares/filon-or/filon-or_carriere_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          192,
          210
        ],
        [
          -95,
          -155,
          192,
          210
        ],
        [
          -95,
          -155,
          192,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    "coeur-lave": {
      nom: "coeur lave",
      batiment: "carriere",
      fichiers: [
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier1.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier2.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier3.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier4.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier5.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier6.svg",
        "pieces_rares/coeur-lave/coeur-lave_carriere_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    fees: {
      nom: "fees",
      batiment: "bosquet",
      fichiers: [
        "pieces_rares/fees/fees_bosquet_palier1.svg",
        "pieces_rares/fees/fees_bosquet_palier2.svg",
        "pieces_rares/fees/fees_bosquet_palier3.svg",
        "pieces_rares/fees/fees_bosquet_palier4.svg",
        "pieces_rares/fees/fees_bosquet_palier5.svg",
        "pieces_rares/fees/fees_bosquet_palier6.svg",
        "pieces_rares/fees/fees_bosquet_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    petales: {
      nom: "petales",
      batiment: "bosquet",
      fichiers: [
        "pieces_rares/petales/petales_bosquet_palier1.svg",
        "pieces_rares/petales/petales_bosquet_palier2.svg",
        "pieces_rares/petales/petales_bosquet_palier3.svg",
        "pieces_rares/petales/petales_bosquet_palier4.svg",
        "pieces_rares/petales/petales_bosquet_palier5.svg",
        "pieces_rares/petales/petales_bosquet_palier6.svg",
        "pieces_rares/petales/petales_bosquet_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    "arc-en-ciel": {
      nom: "arc en ciel",
      batiment: "puits",
      fichiers: [
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier1.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier2.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier3.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier4.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier5.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier6.svg",
        "pieces_rares/arc-en-ciel/arc-en-ciel_puits_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    nenuphars: {
      nom: "nenuphars",
      batiment: "puits",
      fichiers: [
        "pieces_rares/nenuphars/nenuphars_puits_palier1.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier2.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier3.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier4.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier5.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier6.svg",
        "pieces_rares/nenuphars/nenuphars_puits_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          207.5,
          210
        ],
        [
          -95,
          -155,
          207.5,
          210
        ],
        [
          -95,
          -155,
          207.5,
          210
        ],
        [
          -140,
          -250,
          292.5,
          330
        ],
        [
          -140,
          -250,
          292.5,
          330
        ],
        [
          -140,
          -250,
          292.5,
          330
        ],
        [
          -140,
          -250,
          292.5,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    pavois: {
      nom: "pavois",
      batiment: "ponton",
      fichiers: [
        "pieces_rares/pavois/pavois_ponton_palier1.svg",
        "pieces_rares/pavois/pavois_ponton_palier2.svg",
        "pieces_rares/pavois/pavois_ponton_palier3.svg",
        "pieces_rares/pavois/pavois_ponton_palier4.svg",
        "pieces_rares/pavois/pavois_ponton_palier5.svg",
        "pieces_rares/pavois/pavois_ponton_palier6.svg",
        "pieces_rares/pavois/pavois_ponton_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    mouettes: {
      nom: "mouettes",
      batiment: "ponton",
      fichiers: [
        "pieces_rares/mouettes/mouettes_ponton_palier1.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier2.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier3.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier4.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier5.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier6.svg",
        "pieces_rares/mouettes/mouettes_ponton_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    etincelles: {
      nom: "etincelles",
      batiment: "atelier",
      fichiers: [
        "pieces_rares/etincelles/etincelles_atelier_palier1.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier2.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier3.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier4.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier5.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier6.svg",
        "pieces_rares/etincelles/etincelles_atelier_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    engrenages: {
      nom: "engrenages",
      batiment: "atelier",
      fichiers: [
        "pieces_rares/engrenages/engrenages_atelier_palier1.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier2.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier3.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier4.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier5.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier6.svg",
        "pieces_rares/engrenages/engrenages_atelier_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    lampions: {
      nom: "lampions",
      batiment: "foyer",
      fichiers: [
        "pieces_rares/lampions/lampions_foyer_palier1.svg",
        "pieces_rares/lampions/lampions_foyer_palier2.svg",
        "pieces_rares/lampions/lampions_foyer_palier3.svg",
        "pieces_rares/lampions/lampions_foyer_palier4.svg",
        "pieces_rares/lampions/lampions_foyer_palier5.svg",
        "pieces_rares/lampions/lampions_foyer_palier6.svg",
        "pieces_rares/lampions/lampions_foyer_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          282.5,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    },
    lierre: {
      nom: "lierre",
      batiment: "foyer",
      fichiers: [
        "pieces_rares/lierre/lierre_foyer_palier1.svg",
        "pieces_rares/lierre/lierre_foyer_palier2.svg",
        "pieces_rares/lierre/lierre_foyer_palier3.svg",
        "pieces_rares/lierre/lierre_foyer_palier4.svg",
        "pieces_rares/lierre/lierre_foyer_palier5.svg",
        "pieces_rares/lierre/lierre_foyer_palier6.svg",
        "pieces_rares/lierre/lierre_foyer_palier7.svg"
      ],
      cadres: [
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -95,
          -155,
          190,
          210
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          280,
          330
        ],
        [
          -140,
          -250,
          282.5,
          330
        ]
      ],
      note: "image 1 de l'accessoire ; le jeu l'anime (calques de shopSprites)"
    }
  },
  teintes: {
    vendues: {
      craie: "Craie",
      sepia: "Sépia",
      corail: "Corail",
      ocean: "Océan",
      emeraude: "Émeraude",
      lavande: "Lavande",
      flamboyant: "Flamboyant",
      sakura: "Sakura",
      frimas: "Frimas",
      cristal: "Cristal",
      "nuit-etoilee": "Nuit étoilée",
      "or-royal": "Or royal"
    },
    des_pieces_rares: [
      "papillons",
      "tournesols",
      "filon-or",
      "coeur-lave",
      "fees",
      "petales",
      "arc-en-ciel",
      "nenuphars",
      "pavois",
      "mouettes",
      "etincelles",
      "engrenages",
      "lampions",
      "lierre"
    ],
    outil: "teintes/teinter.mjs : tintSvg(svg, idDeTeinte)"
  }
};

// atelier/generateur_objets.mjs
var K = 1.25;
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(" ")}">${body}</svg>`, "svgOf");
var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
var SITE = Object.fromEntries(Object.entries(SHOP_ITEMS).flatMap(([site, ids]) => ids.map((id) => [id, site])));
var OBJETS = Object.fromEntries(Object.entries(SITE).map(([id, site]) => {
  const o = batiments_default.objets[id];
  return [id, { batiment: site, paliers: paliers(site, id).levels, calques: o.calques.length, derriere: o.calques.map((c) => c.derriere) }];
}));
var TORCHE = { allumee: 3, eteinte: 1, ms_par_image: 111 };
var cache = /* @__PURE__ */ new Map();
var calquesDe = /* @__PURE__ */ __name((id) => {
  if (!SITE[id]) throw new Error(`objet inconnu : ${id} (${Object.keys(SITE).join(", ")})`);
  if (!cache.has(id)) cache.set(id, calques(SITE[id], id));
  return cache.get(id);
}, "calquesDe");
function objet(id, calque = 1, palier, image = 1) {
  const cs = calquesDe(id), c = cs[calque - 1];
  if (!c) throw new Error(`${id} : calque ${calque} (de 1 à ${cs.length})`);
  if (!c.levels.includes(+palier)) throw new Error(`${id} : palier ${palier} (${c.levels.map((l) => ROMAN[l - 1]).join(", ")})`);
  const vr = c.variante(+palier), i = c.variantes.indexOf(vr);
  if (!(image >= 1 && image <= vr.frames.length)) throw new Error(`${id} : image ${image} (de 1 à ${vr.frames.length})`);
  const cad = batiments_default.objets[id].calques[calque - 1].cadre, cadre = Array.isArray(cad[0]) ? cad[i] : cad;
  return { svg: svgOf(cadre, `<g transform="scale(${K})">${vr.frames[image - 1]}</g>`), cadre, ms_par_image: c.layer.n ? Math.round(1e3 / c.layer.fps) : null };
}
__name(objet, "objet");
var CADRE_TORCHE = [-50, -115, 100, 140];
function torche(etat = "allumee", image = 1) {
  if (etat !== "allumee" && etat !== "eteinte") throw new Error(`torche : état ${etat} (allumee ou eteinte)`);
  if (!(image >= 1 && image <= TORCHE[etat])) throw new Error(`torche ${etat} : image ${image} (de 1 à ${TORCHE[etat]})`);
  return { svg: svgOf(CADRE_TORCHE, import_torche.default.torche(etat, image - 1)), cadre: CADRE_TORCHE, ms_par_image: etat === "allumee" ? TORCHE.ms_par_image : null };
}
__name(torche, "torche");
function torcheIcone() {
  return { svg: svgOf([0, 0, 32, 32], import_torche.default.torcheIcone()), cadre: [0, 0, 32, 32], ms_par_image: null };
}
__name(torcheIcone, "torcheIcone");
var LUMIERE_TORCHE = import_torche.default.LUMIERE;
function liste() {
  const out = [];
  for (const [id, site] of Object.entries(SITE)) {
    for (const c of calquesDe(id)) for (const vr of c.variantes) vr.frames.forEach((_, f) => out.push({ fichier: `batiments/objets/${site}/${id}/${c.nom(vr, f)}.svg`, fonction: "objet", args: [id, c.k + 1, vr.from, f + 1] }));
  }
  for (let n = 1; n <= TORCHE.allumee; n++) out.push({ fichier: `decor/defenses/torche_allumee_${n}.svg`, fonction: "torche", args: ["allumee", n] });
  out.push({ fichier: "decor/defenses/torche_eteinte.svg", fonction: "torche", args: ["eteinte", 1] });
  out.push({ fichier: "decor/defenses/torche_icone.svg", fonction: "torcheIcone", args: [] });
  return out;
}
__name(liste, "liste");
export {
  LUMIERE_TORCHE,
  OBJETS,
  TORCHE,
  liste,
  objet,
  torche,
  torcheIcone
};
