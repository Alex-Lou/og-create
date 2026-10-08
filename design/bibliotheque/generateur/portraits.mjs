// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_portraits.mjs : ne pas modifier à la main.
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
    var P2 = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var EYE_DARK = "#2A2420";
    var WHITE = "#FFFFFF";
    function eyes(list, mode, ry = 2.35, EYE = EYE_DARK) {
      const cx = list.reduce((a, e) => a + e[0], 0) / list.length;
      let s = "";
      list.forEach(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1;
        if (mode === "blink") s += P2(`M${r2(x - 1.7)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + 1.7)},${r2(y + 0.4)}`, "none", 1);
        else if (mode === "joy") s += P2(`M${r2(x - 1.8)},${r2(y + 1)} Q${x},${r2(y - 1.2)} ${r2(x + 1.8)},${r2(y + 1)}`, "none", 1.1);
        else if (mode === "wink" && i === 1) s += P2(`M${r2(x - 1.6)},${r2(y + 0.2)} L${r2(x + 1.6)},${r2(y + 0.2)}`, "none", 1);
        else if (mode === "big") s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P2(`M${r2(x - k * 1.3)},${r2(y - 1.4)} L${r2(x + k * 1.1)},${y} L${r2(x - k * 1.3)},${r2(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r2(x - rx)},${r2(top)} Q${x},${r2(top - 0.9)} ${r2(x + rx)},${r2(top)} A${rx} ${r2(ry * 0.85)} 0 0 1 ${r2(x - rx)},${r2(top)} Z" fill="${EYE}"/>` + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P2(`M${r2(x - rx - 0.5)},${r2(top + 0.3)} Q${x},${r2(top - 1.1)} ${r2(x + rx + 0.5)},${r2(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r2(top + (k > 0 ? tO : tI)), yr = r2(top + (k > 0 ? tI : tO));
          s += `<path d="M${r2(x - rx)},${yl} L${r2(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r2(x - rx)},${yl} Z" fill="${EYE}"/>` + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P2(`M${r2(x - rx - 0.4)},${r2(yl - (yr - yl) * 0.12)} L${r2(x + rx + 0.4)},${r2(yr + (yr - yl) * 0.12)}`, "none", 1);
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
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P2(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, fill, w) + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
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
      const { expr, n } = ctx;
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
        return P2(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P2(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r2(mx - w)},${my} Q${mx},${r2(my + w * 0.94)} ${r2(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r2(mx - 1.4)},${r2(my + 1.1)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.4)},${r2(my + 1.1)}`);
      else if (expr === "fache") s += P2(`M${r2(mx - 1.7)},${r2(my + 1.3)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.7)},${r2(my + 1.3)} Q${mx},${r2(my + 0.7)} ${r2(mx - 1.7)},${r2(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P2(`M${r2(mx - 1.8)},${r2(my + 0.6)} Q${r2(mx - 1.2)},${r2(my - 0.1)} ${r2(mx - 0.6)},${r2(my + 0.6)} Q${mx},${r2(my + 1.3)} ${r2(mx + 0.6)},${r2(my + 0.6)} Q${r2(mx + 1.2)},${r2(my - 0.1)} ${r2(mx + 1.8)},${r2(my + 0.6)}`, "none", 0.8);
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
      const body = P2(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P2(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 2.3)},${r2(y)} L${r2(x + 2.3)},${r2(y)} Q${r2(x + 2.9)},${r2(y + 3.4)} ${r2(x + 1.4)},${r2(y + 4.3)} L${r2(x - 1.4 - toe)},${r2(y + 4.3)} Q${r2(x - 3.1 - toe)},${r2(y + 3.8)} ${r2(x - 2.3)},${r2(y)} Z`;
      let s = P2(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      const top = c.hip;
      return `<rect x="${r2(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r2(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r2(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r2(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function arm(c, a, b, elbow, main) {
      const pts = elbow ? [a, elbow, b] : [a, b];
      if (c.sleeves || c.bandage) return armOf(c, pts, main);
      const d = "M" + pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = line(OUT, c.armW + W * 2) + line(c.sleeve, c.armW);
      if (c.cuff) {
        const f = pts[pts.length - 2];
        const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
        const at = /* @__PURE__ */ __name((k) => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len], "at");
        s += limb(at(2.5), at(0.9), c.armW, c.cuff);
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(arm, "arm");
    var poing = /* @__PURE__ */ __name((c, b) => E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ""), "poing");
    function armOf(c, pts, main) {
      const b = pts[pts.length - 1], f = pts[pts.length - 2];
      const len = Math.hypot(b[0] - f[0], b[1] - f[1]) || 1;
      const ux = (b[0] - f[0]) / len, uy = (b[1] - f[1]) / len, nx = -uy, ny = ux;
      const at = /* @__PURE__ */ __name((k) => [b[0] - ux * k, b[1] - uy * k], "at");
      const path = /* @__PURE__ */ __name((list) => "M" + list.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L"), "path");
      const stroke = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
      const fw = c.armW * 0.8;
      let s = "";
      let cut = null;
      if (c.sleeves) {
        const k = Math.min(c.sleeveCut || 5, len * 0.62);
        cut = at(k);
        const d = path([...pts.slice(0, -1), cut]);
        s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        const fd = path([cut, b]);
        s += stroke(fd, OUT, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P22 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        if (c.sleeves === "torn") {
          const zig = [P22(h, -0.5), P22(h * 0.45, 1.5), P22(0, 0.4), P22(-h * 0.5, 1.6), P22(-h, -0.5)];
          s += `<path d="${path([P22(h, -1.8), ...zig, P22(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT, 0.85);
        } else {
          const r = h + 0.3, band = [P22(r, -0.7), P22(r, 0.75), P22(-r, 0.75), P22(-r, -0.7)];
          s += `<path d="${path(band)} Z" fill="${c.cuff || c.sleeve}" stroke="${OUT}" stroke-width="0.85" stroke-linejoin="round"/>` + L(P22(r * 0.7, -0.1), P22(-r * 0.7, -0.1), "rgba(255,255,255,.35)", 0.45);
        }
      } else {
        const d = path(pts);
        s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
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
      const ph = walk ? [1, 0, -1, 0][n] : 0;
      const bob = walk && n % 2 === 1 ? -1 : 0;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const ctx = { view, pose, n, ph, id, walk };
      const [lx, rx] = c.legX[view];
      const ly = c.ground + (walk ? ph > 0 ? 1 : ph < 0 ? -1.4 : 0 : 0);
      const ry = c.ground + (walk ? ph < 0 ? 1 : ph > 0 ? -1.4 : 0 : 0);
      const side = view === "se" ? -1 : 1;
      const lxx = lx + (walk ? side * ph * 0.9 : 0);
      const rxx = rx - (walk ? side * ph * 0.6 : 0);
      const tiltL = walk && ph < 0 && view !== "front" ? view === "se" ? 14 : -14 : 0;
      const tiltR = walk && ph > 0 && view !== "front" ? view === "se" ? 14 : -14 : 0;
      const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
      const swing = -ph;
      const [shL, shR] = c.shoulders;
      const handL = [c.hands[0][0] + swing * 0.9, c.hands[0][1] + swing * 1.4];
      const handR = [c.hands[1][0] - swing * 0.9, c.hands[1][1] - swing * 1.4];
      const act = pose === "action" || pose === "salut" ? c.pose.call(cc, ctx) : null;
      const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
      const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : "";
      const armRight = act && act.right != null ? act.right : (c.holdOver ? "" : held) + arm(cc, shR, handR);
      ctx.expr = expr || act && act.expr || (pose === "salut" ? "content" : "neutre");
      ctx.eyeMode = expr ? null : act && act.eyeMode;
      ctx.open = !expr && act && act.open;
      ctx.blink = pose === "repos" && n === 1;
      let s = "";
      s += c.backItems ? c.backItems(cc, ctx) : "";
      s += act && act.under ? act.under : "";
      s += legs.join("");
      s += c.body(cc, ctx);
      if (view !== "front") s += armRight;
      s += c.neck ? c.neck(cc, ctx) : "";
      if (view === "front") s += armLeft + armRight;
      else s += armLeft;
      s += c.overArms ? c.overArms(cc, ctx) : "";
      s += c.head(cc, ctx, act || {});
      s += c.overHead ? c.overHead(cc, ctx) : "";
      s += c.holdOver ? held : "";
      s += act && act.over ? act.over : "";
      return `<g transform="translate(0 ${bob})">${s}</g>`;
    }
    __name(frame, "frame");
    var svg = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`, "svg");
    var POSES = [["face_repos", "front", "repos", 2], ["avant_marche", "se", "marche", 4], ["dos_marche", "ne", "marche", 4], ["face_salut", "front", "salut", 2]];
    module.exports = { OUT, W, r2, st, P: P2, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES };
  }
});

// personnages/portraits.js
var require_portraits = __commonJS({
  "personnages/portraits.js"(exports, module) {
    var T = require_troupe();
    var G = null;
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P2 = /* @__PURE__ */ __name((d, fill, w = 0.7) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var thin = /* @__PURE__ */ __name((s, k) => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${f(w * k)}"`), "thin");
    var IR = "pi";
    var SKIN = "#F2C9A0";
    var lash = /* @__PURE__ */ __name((x, y, rx, ry, k) => P2(`M${f(x - rx - 0.25)},${f(y - ry * 0.3)} Q${f(x)},${f(y - ry - 0.8)} ${f(x + rx + 0.25)},${f(y - ry * 0.3)}`, "none", 0.8) + P2(`M${f(x - k * (rx + 0.15))},${f(y - ry * 0.45)} L${f(x - k * (rx + 0.95))},${f(y - ry * 0.85)}`, "none", 0.6), "lash");
    var shine = /* @__PURE__ */ __name((x, y, rx, ry) => E(x + 0.45, y - ry * 0.4, 0.68, 0.74, WHITE) + E(x - 0.5, y + ry * 0.45, 0.3, 0.3, WHITE) + P2(`M${f(x - rx * 0.62)},${f(y + ry * 0.5)} Q${f(x)},${f(y + ry * 0.95)} ${f(x + rx * 0.62)},${f(y + ry * 0.5)}`, "none", 0).replace('fill="none"', `fill="none" stroke="#B88468" stroke-width="0.45" opacity=".85"`), "shine");
    var iris = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, `url(#${IR})`), "iris");
    var EYE = {
      open: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => iris(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + shine(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + lash(x, y, rx, ry, k), "open"),
      blink: /* @__PURE__ */ __name((x, y, rx, ry, k) => P2(`M${f(x - rx - 0.25)},${f(y + 0.3)} Q${f(x)},${f(y + 1.7)} ${f(x + rx + 0.25)},${f(y + 0.3)}`, "none", 0.8) + P2(`M${f(x - k * (rx + 0.2))},${f(y + 0.3)} L${f(x - k * (rx + 0.9))},${f(y - 0.2)}`, "none", 0.6), "blink"),
      joy: /* @__PURE__ */ __name((x, y, rx) => P2(`M${f(x - rx - 0.3)},${f(y + 1)} Q${f(x)},${f(y - 1.5)} ${f(x + rx + 0.3)},${f(y + 1)}`, "none", 0.85), "joy"),
      big: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + iris(x + (o.dx || 0), y + 0.2, rx * 0.6, ry * 0.55) + E(x + (o.dx || 0) + 0.3, y - 0.4, 0.32, 0.34, WHITE), "big"),
      tiny: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + E(x + (o.dx || 0), y + 0.3, 0.42, 0.52, OUT), "tiny"),
      squeeze: /* @__PURE__ */ __name((x, y, rx, ry, k) => P2(`M${f(x - k * 1.4)},${f(y - 1.5)} L${f(x + k * 1.2)},${y} L${f(x - k * 1.4)},${f(y + 1.5)}`, "none", 0.85), "squeeze"),
      lid: /* @__PURE__ */ __name((x, y, rx, ry, k, o) => {
        const top = y - 0.6, yl = f(top + (k > 0 ? o.tO : o.tI)), yr = f(top + (k > 0 ? o.tI : o.tO));
        const d = `M${f(x - rx)},${yl} L${f(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${f(x - rx)},${yl} Z`;
        return `<path d="${d}" fill="url(#${IR})"/>` + E(x + 0.45, y + 0.7, 0.42, 0.42, WHITE) + (o.glint ? E(x - 0.4, y + 0.2, 0.28, 0.28, WHITE) : "") + P2(`M${f(x - rx - 0.45)},${f(yl - (yr - yl) * 0.12)} L${f(x + rx + 0.45)},${f(yr + (yr - yl) * 0.12)}`, "none", 0.85);
      }, "lid"),
      sleepy: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const top = y + 0.3;
        return `<path d="M${f(x - rx)},${f(top)} Q${x},${f(top - 0.9)} ${f(x + rx)},${f(top)} A${rx} ${f(ry * 0.85)} 0 0 1 ${f(x - rx)},${f(top)} Z" fill="url(#${IR})"/>` + E(x + 0.4, top + 0.9, 0.34, 0.34, WHITE) + P2(`M${f(x - rx - 0.5)},${f(top + 0.3)} Q${x},${f(top - 1.1)} ${f(x + rx + 0.5)},${f(top + 0.3)}`, "none", 0.85) + (o.cerne ? P2(`M${f(x - rx * 0.8)},${f(y + ry + 0.5)} Q${x},${f(y + ry + 1.3)} ${f(x + rx * 0.8)},${f(y + ry + 0.5)}`, "none", 0).replace('fill="none"', 'fill="none" stroke="#A47C9C" stroke-width="0.55" opacity=".8"') : "");
      }, "sleepy"),
      star: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const r = ry * 1.05 * (o.s || 1);
        let d = "";
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r;
          d += `${i ? "L" : "M"}${f(x + q * Math.cos(a))},${f(y + q * Math.sin(a))}`;
        }
        return P2(d + " Z", "#FFD54A", 0.6) + E(x - r * 0.25, y - r * 0.3, r * 0.18, r * 0.14, WHITE);
      }, "star"),
      heart: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const s = 1.15 * (o.s || 1);
        return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${P2("M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z", "#F0607A", 0.55)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`;
      }, "heart"),
      spiral: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        let d = "";
        for (let i = 0; i <= 28; i++) {
          const a = i * 0.42 + (o.rot || 0), r = 0.1 + i * 0.065;
          d += `${i ? "L" : "M"}${f(x + r * Math.cos(a))},${f(y + r * 1.2 * Math.sin(a))}`;
        }
        return E(x, y, rx + 0.3, ry + 0.15, WHITE, 0.6) + P2(d, "none", 0.55);
      }, "spiral"),
      line: /* @__PURE__ */ __name((x, y, rx, ry, k) => P2(`M${f(x - rx - 0.2)},${f(y + 0.2 - k * 0.3)} L${f(x + rx + 0.2)},${f(y + 0.2 + k * 0.3)}`, "none", 0.85), "line")
    };
    var BROW = {
      neutre: [0, 0.1, -0.6],
      content: [-0.3, -0.2, -0.7],
      rire: [-0.6, -0.4, -0.8],
      surpris: [-1.4, -1.1, -1],
      triste: [-1.1, 0.6, 0],
      fache: [1.1, -0.6, 0],
      gene: [-0.7, 0.3, -0.2],
      endormi: [0.4, 0.4, -0.3],
      emu: [-1, 0.2, -0.5],
      effraye: [-1.7, -0.4, -1.1],
      boude: [1, -0.1, 0.1],
      determine: [1.2, -0.9, 0.2],
      emerveille: [-1.3, -1, -1],
      adore: [-0.9, -0.6, -0.9],
      etourdi: [-0.4, 0.5, -0.3],
      crocodile: [-1.4, 0.9, 0.2],
      pensif: [-0.5, -0.9, -0.7],
      malicieux: [0.5, -1, -0.5],
      fier: [-0.3, -0.7, -0.9],
      fatigue: [0.1, 0.7, -0.1],
      degoute: [0.9, -0.3, 0.3]
    };
    function sourcils(e) {
      const g = G, cx = (g.eyes[0][0] + g.eyes[1][0]) / 2, [bi, bo, arch] = BROW[e];
      return g.eyes.map(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1, hw = rx + 0.5, by = y + g.browY;
        const up = (e === "pensif" || e === "malicieux") && i === 1 ? -0.9 : 0;
        return `<path d="M${f(x - k * hw)},${f(by + bo + up)} Q${f(x)},${f(by + (bi + bo) / 2 + arch + up)} ${f(x + k * hw)},${f(by + bi + up)}" fill="none" stroke="${g.brow}" stroke-width="${f(g.browW * 0.85)}" stroke-linecap="round"/>`;
      }).join("");
    }
    __name(sourcils, "sourcils");
    var YEUX = {
      neutre: ["open"],
      content: ["open"],
      rire: ["joy"],
      surpris: ["big"],
      triste: ["lid", { tO: 0.9, tI: -0.3 }],
      fache: ["lid", { tO: -0.3, tI: 1 }],
      gene: ["squeeze"],
      endormi: ["blink"],
      emu: ["joy"],
      effraye: ["tiny"],
      boude: ["lid", { tO: 0.2, tI: 0.8 }],
      determine: ["lid", { tO: -0.4, tI: 0.7, glint: true }],
      emerveille: ["star"],
      adore: ["heart"],
      etourdi: ["spiral"],
      crocodile: ["squeeze"],
      pensif: ["open", { dx: -0.5, dy: -0.55 }],
      malicieux: [["open"], ["joy"]],
      fier: ["joy"],
      fatigue: ["sleepy", { cerne: true }],
      degoute: [["line"], ["sleepy"]]
    };
    var CLIGNE = ["neutre", "content", "pensif", "boude", "determine", "triste", "fache", "malicieux", "surpris", "fatigue"];
    function yeux(e, t, ferme) {
      const g = G, cx = (g.eyes[0][0] + g.eyes[1][0]) / 2;
      return g.eyes.map(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1;
        let [m, o] = Array.isArray(YEUX[e][0]) ? YEUX[e][i] : YEUX[e];
        o = { ...o || {} };
        if (ferme && m !== "joy") m = "blink";
        if (e === "emerveille") o.s = 0.9 + 0.2 * Math.abs(Math.sin(2 * Math.PI * t + i));
        if (e === "adore") o.s = 1 + 0.12 * Math.max(0, Math.sin(4 * Math.PI * t));
        if (e === "etourdi") o.rot = (i ? -1 : 1) * 2 * Math.PI * t;
        if (e === "effraye") o.dx = 0.25 * Math.sin(8 * Math.PI * t + i);
        return EYE[m](x, y, rx, g.ry, k, o);
      }).join("");
    }
    __name(yeux, "yeux");
    var MC = 0;
    function ouverte(mx, my, hw, depth, dents) {
      const g = G, d = `M${f(mx - hw)},${f(my - 0.2)} Q${f(mx)},${f(my + depth)} ${f(mx + hw)},${f(my - 0.2)} Z`, id = `${IR}m${MC++}`;
      return P2(d, g.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + depth * 0.5, hw * 0.6, depth * 0.3, g.tongue)}${dents ? `<rect x="${f(mx - hw)}" y="${f(my - 0.4)}" width="${f(2 * hw)}" height="0.75" fill="${WHITE}"/>` : ""}</g>` + P2(d, "none", 0.75);
    }
    __name(ouverte, "ouverte");
    function bouche(e, t) {
      const g = G, [mx, my] = g.mouth, w = g.mw, line = /* @__PURE__ */ __name((d, wd = 0.75) => P2(d, "none", wd), "line");
      switch (e) {
        case "neutre":
          return line(g.neutral(mx, my));
        case "content":
          return line(`M${f(mx - w)},${my} Q${mx},${f(my + w * 0.95)} ${f(mx + w)},${my}`) + line(`M${f(mx - w - 0.3)},${f(my - 0.2)} L${f(mx - w + 0.1)},${f(my + 0.2)}`, 0.5);
        case "rire":
          return ouverte(mx, my, w + 0.5, w * 1.5 + 1.3 - 0.4 * Math.abs(Math.sin(4 * Math.PI * t)), true);
        case "surpris":
          return E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.75) + E(mx, my + 1.4, 0.5, 0.4, g.tongue);
        case "triste":
          return line(`M${f(mx - 1.4)},${f(my + 1.1)} Q${mx},${f(my - 0.1)} ${f(mx + 1.4)},${f(my + 1.1)}`);
        case "fache":
          return P2(`M${f(mx - 1.7)},${f(my + 1.3)} Q${mx},${f(my - 0.4)} ${f(mx + 1.7)},${f(my + 1.3)} Q${mx},${f(my + 0.7)} ${f(mx - 1.7)},${f(my + 1.3)} Z`, g.mouthC, 0.75);
        case "gene":
        case "etourdi": {
          const a = e === "etourdi" ? 0.3 * Math.sin(2 * Math.PI * t) : 0;
          return line(`M${f(mx - 1.9)},${f(my + 0.6 + a)} Q${f(mx - 1.25)},${f(my - 0.1)} ${f(mx - 0.6)},${f(my + 0.6)} Q${mx},${f(my + 1.3 - a)} ${f(mx + 0.6)},${f(my + 0.6)} Q${f(mx + 1.25)},${f(my - 0.1)} ${f(mx + 1.9)},${f(my + 0.6 - a)}`, 0.65);
        }
        case "endormi":
          return E(mx, my + 0.7, 0.6, 0.75 + 0.15 * Math.sin(2 * Math.PI * t), g.mouthC, 0.65);
        case "emu":
          return ouverte(mx, my, w + 0.2, w * 1.1 + 1, false) + line(`M${f(mx - w - 0.6)},${f(my - 0.4)} L${f(mx - w - 0.1)},${f(my + 0.1)}`, 0.5);
        case "effraye": {
          let d = "";
          for (let i = 0; i <= 16; i++) {
            const a = i / 16 * 2 * Math.PI, r = 1 + 0.12 * Math.sin(a * 5 + 8 * Math.PI * t);
            d += `${i ? "L" : "M"}${f(mx + 1.25 * r * Math.cos(a))},${f(my + 1.3 + 1.5 * r * Math.sin(a))}`;
          }
          return P2(d + " Z", g.mouthC, 0.7) + E(mx, my + 2, 0.7, 0.5, g.tongue);
        }
        case "boude":
          return P2(`M${f(mx - 0.2)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my - 0.1)} ${f(mx + 1.1)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my + 1.4)} ${f(mx - 0.2)},${f(my + 0.7)} Z`, g.mouthC, 0.65);
        case "determine":
          return P2(`M${f(mx - w - 0.2)},${f(my)} Q${mx},${f(my + 0.5)} ${f(mx + w + 0.2)},${f(my - 0.3)} Q${f(mx + 0.2)},${f(my + 2.2)} ${f(mx - w - 0.2)},${f(my)} Z`, WHITE, 0.7) + line(`M${f(mx - w)},${f(my + 0.35)} Q${mx},${f(my + 0.9)} ${f(mx + w)},${f(my + 0.1)}`, 0.4);
        case "emerveille":
          return ouverte(mx, my, w + 0.7, w * 1.6 + 1.5, true);
        case "adore":
          return line(`M${f(mx - 1.6)},${f(my + 0.2)} Q${f(mx - 0.8)},${f(my + 1.3)} ${mx},${f(my + 0.3)} Q${f(mx + 0.8)},${f(my + 1.3)} ${f(mx + 1.6)},${f(my + 0.2)}`, 0.7);
        case "crocodile": {
          const s = 0.3 * Math.sin(8 * Math.PI * t), d = `M${f(mx - 2.3)},${f(my + 0.1)} L${f(mx + 2.3)},${f(my + 0.1)} Q${f(mx + 1.9)},${f(my + 3.9 + s)} ${mx},${f(my + 4 + s)} Q${f(mx - 1.9)},${f(my + 3.9 + s)} ${f(mx - 2.3)},${f(my + 0.1)} Z`, id = `${IR}m${MC++}`;
          return P2(d, G.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + 3.4, 1.4, 1, G.tongue)}<rect x="${f(mx - 2.3)}" y="${f(my - 0.2)}" width="4.6" height="0.8" fill="${WHITE}"/></g>` + P2(d, "none", 0.75);
        }
        case "pensif":
          return line(`M${f(mx - 0.4)},${f(my + 0.7)} Q${f(mx + 0.4)},${f(my + 0.5)} ${f(mx + 1.1)},${f(my + 0.2)}`, 0.7);
        case "malicieux":
          return line(`M${f(mx - 1.4)},${f(my + 0.4)} Q${f(mx + 0.2)},${f(my + 1.3)} ${f(mx + 1.7)},${f(my - 0.4)}`) + P2(`M${f(mx - 0.3)},${f(my + 0.85)} Q${f(mx + 0.25)},${f(my + 2.5 + 0.2 * Math.sin(2 * Math.PI * t))} ${f(mx + 0.9)},${f(my + 0.6)} Z`, G.tongue, 0.55);
        case "fier":
          return line(`M${f(mx - w - 0.4)},${f(my - 0.2)} Q${mx},${f(my + 1.8)} ${f(mx + w + 0.4)},${f(my - 0.2)}`, 0.75) + line(`M${f(mx + w + 0.2)},${f(my - 0.6)} L${f(mx + w + 0.6)},${f(my + 0.1)}`, 0.5);
        case "fatigue":
          return E(mx, my + 0.8, 0.85, 0.45 + 0.25 * Math.max(0, Math.sin(2 * Math.PI * t)), g.mouthC, 0.6);
        case "degoute":
          return line(`M${f(mx - 1.8)},${f(my + 1.1)} Q${f(mx - 0.9)},${f(my + 0.1)} ${mx},${f(my + 0.8)} Q${f(mx + 0.9)},${f(my + 1.5)} ${f(mx + 1.8)},${f(my + 0.5)}`, 0.7) + P2(`M${f(mx + 0.1)},${f(my + 0.9)} Q${f(mx + 0.6)},${f(my + 2.2)} ${f(mx + 1.1)},${f(my + 1.1)} Z`, G.tongue, 0.5);
      }
      return "";
    }
    __name(bouche, "bouche");
    var drop = /* @__PURE__ */ __name((x, y, r, fill = "#A9DCFF", o = 1) => `<g opacity="${f(o)}">${P2(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y + r)} Q${f(x - r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, fill, 0.55)}${E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE)}</g>`, "drop");
    var eclat = /* @__PURE__ */ __name((x, y, r, o = 1) => r < 0.1 ? "" : `<path d="M${x},${f(y - r)} Q${f(x + r * 0.18)},${f(y - r * 0.18)} ${f(x + r)},${y} Q${f(x + r * 0.18)},${f(y + r * 0.18)} ${x},${f(y + r)} Q${f(x - r * 0.18)},${f(y + r * 0.18)} ${f(x - r)},${y} Q${f(x - r * 0.18)},${f(y - r * 0.18)} ${x},${f(y - r)} Z" fill="#FFF3B0" stroke="${OUT}" stroke-width="0.4" opacity="${f(o)}"/>`, "eclat");
    var coeur = /* @__PURE__ */ __name((x, y, s, o) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" opacity="${f(o)}">${P2("M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z", "#F0607A", 0.6)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`, "coeur");
    var zee = /* @__PURE__ */ __name((x, y, z, o) => {
      const d = `M${f(x)},${f(y)} L${f(x + z)},${f(y)} L${f(x)},${f(y + z)} L${f(x + z)},${f(y + z)}`;
      return `<g opacity="${f(o)}"><path d="${d}" fill="none" stroke="${OUT}" stroke-width="${f(z * 0.45 + 0.7)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${f(z * 0.45)}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
    }, "zee");
    var rougeur = /* @__PURE__ */ __name((k = 1) => G.cheeks.map(([x, rx]) => E(x, G.cheekY, rx * 1.35 * k, 1.5 * k, "#F08A8A").replace("/>", ' opacity=".55"/>') + [-0.5, 0, 0.5].map((d) => `<line x1="${f(x + d * rx * 1.2 - 0.35)}" y1="${f(G.cheekY + 0.55)}" x2="${f(x + d * rx * 1.2 + 0.35)}" y2="${f(G.cheekY - 0.55)}" stroke="#D9605A" stroke-width="0.4" stroke-linecap="round"/>`).join("")).join(""), "rougeur");
    var traits = /* @__PURE__ */ __name((x0, x1, y0, y1, col, n = 5) => {
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = x0 + (x1 - x0) * i / (n - 1);
        s += `<line x1="${f(x)}" y1="${y0}" x2="${f(x)}" y2="${y1 - i % 2 * 1.2}" stroke="${col}" stroke-width="0.55" stroke-linecap="round" opacity=".75"/>`;
      }
      return s;
    }, "traits");
    function signes(e, t) {
      const g = G, [ex0, ey0] = g.eyes[0], [ex1] = g.eyes[1], cx = (ex0 + ex1) / 2, ry = g.ry, [tx, ty] = g.temple, [ax, ay] = g.anger, [zx, zy] = g.zz;
      const fr = /* @__PURE__ */ __name((x) => x - Math.floor(x), "fr");
      switch (e) {
        case "rire":
          return drop(ex0 - 2, ey0 + 0.6, 0.55) + drop(ex1 + 2, ey0 + 0.6, 0.55);
        case "surpris": {
          const k = 0.6 + 0.4 * Math.abs(Math.sin(2 * Math.PI * t));
          return [[-1, ex0 - 4.2], [1, ex1 + 4.2]].map(([s, x]) => [0, 1, 2].map((i) => `<line x1="${f(x)}" y1="${f(ey0 - 4 + i * 2.2)}" x2="${f(x + s * 1.6 * k)}" y2="${f(ey0 - 4.6 + i * 2.2)}" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/>`).join("")).join("");
        }
        case "triste": {
          const u = fr(t);
          return drop(ex0 + 1.2, ey0 + ry + 1.2 + u * 3.6, 0.95, "#A9DCFF", 1 - u * 0.6);
        }
        case "fache": {
          const s = 1 + 0.25 * Math.abs(Math.sin(2 * Math.PI * t)), a = 0.5 * s, b = 1.7 * s;
          const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${f(ax + i * a)},${f(ay + j * b)} Q${f(ax + i * a)},${f(ay + j * a)} ${f(ax + i * b)},${f(ay + j * a)}`).join(" ");
          return `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="0.9" stroke-linecap="round"/>`;
        }
        case "gene":
          return rougeur() + drop(tx, ty + fr(t) * 2.4, 1.8);
        case "endormi":
          return [0, 1, 2].map((i) => {
            const u = fr(t + i / 3);
            return zee(zx - 1 + u * 3, zy + 4.5 - u * 5, 1.3 + u * 1.3, Math.sin(Math.PI * u));
          }).join("");
        case "emu":
          return g.eyes.map(([x, y]) => E(x, y + ry * 0.2, 1.9, 0.5, "#A9DCFF").replace("/>", ' opacity=".8"/>')).join("") + [0, 1].map((i) => {
            const u = fr(t + i / 2), x = i ? ex1 + 1.6 : ex0 - 1.6;
            return drop(x, ey0 + 1.4 + u * 4, 0.8, "#A9DCFF", 1 - u * 0.7);
          }).join("") + rougeur(0.8);
        case "effraye":
          return traits(ex0 - 2, ex1 + 2, 15.6, 19.4, "#6E86C8", 7) + drop(tx + 0.4, ty + 1 + fr(t) * 2, 1.5) + drop(ax - 3, ay + 7 + fr(t + 0.5) * 2, 1.2);
        case "boude": {
          const u = fr(t);
          return E(g.cheeks[1][0] - 0.4, g.cheekY - 0.2, 2.6, 1.8, "#F08A8A").replace("/>", ' opacity=".7"/>') + E(g.cheeks[1][0] - 1, g.cheekY - 0.8, 0.7, 0.4, WHITE).replace("/>", ' opacity=".7"/>') + `<g opacity="${f(1 - u)}" transform="translate(${f(ax - 1 + u * 2)} ${f(ay + 2 - u * 2)}) scale(${f(0.6 + u * 0.6)})">${P2("M-2,0.6 a1.2,1.2 0 0 1 0.6,-2 a1.5,1.5 0 0 1 2.8,0 a1.2,1.2 0 0 1 0.6,2 Z", "#F4F2EA", 0.5)}</g>`;
        }
        case "determine": {
          const k = Math.abs(Math.sin(2 * Math.PI * t));
          return eclat(ex1 + 2.6, ey0 - 2.6, 1.6 * k) + `<g opacity=".9">${traits(ax - 4, ax + 1, ay + 1, ay + 4, "#F2994A", 3)}</g>`;
        }
        case "emerveille":
          return [[ex0 - 5, ey0 - 7, 0], [ex1 + 5, ey0 - 8, 0.33], [cx, ey0 - 14, 0.66], [ex1 + 6.5, ey0 + 1, 0.5]].map(([x, y, o]) => eclat(x, y, 1.8 * Math.abs(Math.sin(2 * Math.PI * (t + o))))).join("") + rougeur(0.7);
        case "adore":
          return [0, 1, 2].map((i) => {
            const u = fr(t + i / 3), x = [ex0 - 5, ex1 + 5, ex1 + 3][i];
            return coeur(x + Math.sin(u * 6.3) * 0.6, ey0 - 2 - u * 9, 0.55 + u * 0.25, Math.sin(Math.PI * u));
          }).join("") + rougeur(0.9);
        case "etourdi":
          return [0, 1, 2].map((i) => {
            const a = 2 * Math.PI * (t + i / 3);
            return eclat(f(cx + 10 * Math.cos(a)), f(ey0 - 17 + 2.2 * Math.sin(a)), 1.3);
          }).join("");
        case "crocodile":
          return g.eyes.map(([x, y], i) => {
            const s = i ? 1 : -1, x0 = x, y0 = y + 0.6, d = `M${f(x0 - 1.3)},${f(y0)} Q${f(x0 + s * 0.6 - 1)},${f(y0 + 5)} ${f(x0 + s * 1.6 - 1.4)},${f(y0 + 10)} L${f(x0 + s * 1.6 + 1.6)},${f(y0 + 10)} Q${f(x0 + s * 0.6 + 1.2)},${f(y0 + 5)} ${f(x0 + 1.3)},${f(y0)} Z`;
            return P2(d, "#B8E4FF", 0.55) + `<path d="M${f(x0 + s * 0.2)},${f(y0 + 1)} Q${f(x0 + s * 0.7)},${f(y0 + 5)} ${f(x0 + s * 1.5)},${f(y0 + 9.4)}" fill="none" stroke="${WHITE}" stroke-width="0.45" stroke-linecap="round" stroke-dasharray="1.4 2.2" stroke-dashoffset="${f(-t * 7.2)}" opacity=".9"/>`;
          }).join("") + [0, 1].map((i) => {
            const u = fr(t + i / 2);
            return drop(i ? ex1 + 6 + u * 1.5 : ex0 - 6 - u * 1.5, ey0 + 4 + u * 3, 0.7, "#A9DCFF", 1 - u);
          }).join("");
        case "pensif": {
          const [mx, my] = g.mouth, hx = mx + 2.8, hy = my + 4.4;
          return E(hx, hy, 2.2, 1.9, SKIN, 0.7) + `<path d="M${f(hx - 1.6)},${f(hy - 0.4)} Q${f(hx - 0.6)},${f(hy - 1.5)} ${f(hx + 0.6)},${f(hy - 1.3)}" fill="none" stroke="${OUT}" stroke-width="0.55" stroke-linecap="round"/><path d="M${f(hx - 1.2)},${f(hy + 0.4)} L${f(hx + 0.6)},${f(hy + 0.1)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`;
        }
        case "malicieux":
          return eclat(ex1 + 2.8, ey0 - 2.4, 1.4 * Math.abs(Math.sin(2 * Math.PI * t)));
        case "fier":
          return eclat(ex1 + 6, ey0 - 7, 1.9 * Math.abs(Math.sin(2 * Math.PI * t))) + eclat(ex1 + 8, ey0 - 3, 1.1 * Math.abs(Math.sin(2 * Math.PI * (t + 0.4))));
        case "fatigue": {
          const a = 0.5 * Math.sin(2 * Math.PI * t);
          return [-3, 0, 3].map((dx, i) => `<path d="M${f(cx + dx + a)},${f(ey0 - 20.8 + i % 2)} q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4" fill="none" stroke="#7A7A9A" stroke-width="0.6" stroke-linecap="round" opacity=".8"/>`).join("") + drop(tx, ty + 1, 1.2);
        }
        case "degoute":
          return traits(ex0 - 1.6, ex1 + 1.6, 15.8, 19, "#7AA858", 6) + E(G.mouth[0], G.mouth[1] + 4, 0, 0, "none");
      }
      return "";
    }
    __name(signes, "signes");
    var BX = 37.5;
    var BY = 10.5;
    var contour = /* @__PURE__ */ __name((d, fill, w = 0.7) => `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${f(w + 1.6)}" stroke-linejoin="round" stroke-linecap="round"/>` + P2(d, fill, w), "contour");
    var BULLES = {
      exclamation: /* @__PURE__ */ __name((t) => {
        const s = 1 + 0.18 * Math.max(0, Math.sin(2 * Math.PI * t));
        return `<g transform="translate(${BX} ${BY}) scale(${f(s)})">${contour("M-1.2,-5 L1.2,-5 L0.7,1 L-0.7,1 Z", "#E8504A")}${contour("M0,2.2 a1,1 0 1 1 0.01,0 Z", "#E8504A")}</g>`;
      }, "exclamation"),
      question: /* @__PURE__ */ __name((t) => `<g transform="translate(${BX} ${BY}) rotate(${f(12 * Math.sin(2 * Math.PI * t))})">${contour("M-2.2,-2.6 Q-2.2,-5.4 0.2,-5.4 Q2.6,-5.4 2.6,-3 Q2.6,-1.4 1,-0.6 Q0.4,-0.3 0.4,0.8 L-0.8,0.8 Q-0.9,-1 0.4,-1.8 Q1.2,-2.3 1.2,-3 Q1.2,-4 0.2,-4 Q-0.8,-4 -0.8,-2.6 Z", "#4C8FE8")}${contour("M-0.2,2.2 a0.95,0.95 0 1 1 0.01,0 Z", "#4C8FE8")}</g>`, "question"),
      points: /* @__PURE__ */ __name((t) => `<g transform="translate(${BX - 5.4} ${BY})">${contour("M-3,-4.6 Q-3,-7.4 0,-7.4 L6,-7.4 Q9,-7.4 9,-4.6 Q9,-1.8 6,-1.8 L1.6,-1.8 L-0.6,0.6 L-0.2,-1.9 Q-3,-2.2 -3,-4.6 Z", "#FFFFFF", 0.6)}${[0, 1, 2].map((i) => E(-0.2 + i * 3, -4.6, 0.75, 0.75, OUT).replace("/>", ` opacity="${f(t * 3 > i ? 1 : 0.15)}"/>`)).join("")}</g>`, "points"),
      note: /* @__PURE__ */ __name((t) => `<g transform="translate(${BX} ${f(BY - 1.2 * Math.abs(Math.sin(2 * Math.PI * t)))}) rotate(${f(-10 + 20 * Math.sin(2 * Math.PI * t))})">${contour("M-1.6,1.6 a1.6,1.2 -20 1 1 0.01,0 Z M-0.1,1.2 L-0.1,-5 Q2.4,-4 2.6,-2.2 Q1.8,-3 0.9,-3.2 L0.9,1.2", "#9A6ED8", 0.6)}</g>`, "note"),
      ampoule: /* @__PURE__ */ __name((t) => {
        const o = 0.35 + 0.45 * (Math.sin(2 * Math.PI * t * 2) > -0.3 ? 1 : 0.2);
        return `<g transform="translate(${BX} ${BY})"><circle cx="0" cy="-2.4" r="5" fill="#FFF3B0" opacity="${f(o * 0.6)}"/>${contour("M0,-6.4 Q3.2,-6.4 3.2,-3.2 Q3.2,-1.6 1.6,-0.4 L1.4,1 L-1.4,1 L-1.6,-0.4 Q-3.2,-1.6 -3.2,-3.2 Q-3.2,-6.4 0,-6.4 Z", "#FFD54A")}${P2("M-1.3,1.6 L1.3,1.6 L1,2.8 L-1,2.8 Z", "#B8B0A0", 0.55)}${E(-1, -4.2, 0.6, 0.9, WHITE)}${[[-5.4, -3.2, -7.2, -3.2], [5.4, -3.2, 7.2, -3.2], [-3.8, -7.4, -5, -8.6], [3.8, -7.4, 5, -8.6], [0, -8, 0, -9.8]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#F2B230" stroke-width="0.7" stroke-linecap="round" opacity="${f(o + 0.2)}"/>`).join("")}</g>`;
      }, "ampoule"),
      orage: /* @__PURE__ */ __name((t) => {
        const flash = Math.floor(t * 8) % 4 === 1;
        return `<g transform="translate(${f(BX - 1 + 0.4 * Math.sin(2 * Math.PI * t))} ${BY})">${contour("M-4,-1 Q-6,-1 -6,-3 Q-6,-5 -4,-5 Q-3.6,-7.6 -1,-7.6 Q1,-7.6 1.6,-6 Q2.4,-6.8 3.6,-6.4 Q5.4,-5.8 5,-4 Q6.6,-3.6 6.2,-2 Q5.8,-1 4.6,-1 Z", "#8A8EA8", 0.6)}${P2("M0.4,-1 L-1.2,2.2 L0.4,2.2 L-0.6,5.2 L2,1.2 L0.4,1.2 L1.6,-1 Z", flash ? "#FFF6A0" : "#F2C94C", 0.5)}</g>`;
      }, "orage")
    };
    var PH = 8;
    var MS = 125;
    var phases = /* @__PURE__ */ __name((fn) => {
      let o = "";
      for (let i = 0; i < PH; i++) o += `<g opacity="${i ? 0 : 1}"><animate attributeName="opacity" values="1;0" keyTimes="0;${f(1 / PH)}" calcMode="discrete" dur="${PH * MS}ms" begin="${-(PH - i) * MS}ms" repeatCount="indefinite"/>${fn(i / PH)}</g>`;
      return o;
    }, "phases");
    var cligne = /* @__PURE__ */ __name((ouverts, fermes) => `<g>${'<animate attributeName="opacity" values="1;0;1" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>'}${ouverts}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${fermes}</g>`, "cligne");
    var BOUGE = { rire: ["0 0;0 -0.5;0 0", "0.5s"], effraye: ["-0.25 0;0.25 0;-0.25 0", "0.18s"], etourdi: ["-0.5 0;0.5 0;-0.5 0", "1.4s"], crocodile: ["0 0;0 0.5;0 0", "0.35s"], emerveille: ["0 0;0 -0.35;0 0", "1s"] };
    var MOUVANTS = ["emerveille", "adore", "etourdi", "effraye"];
    function dessin(c, e, uid, fixe) {
      G = null;
      MC = 0;
      IR = `${uid}i`;
      SKIN = c.skin || "#F2C9A0";
      const base = thin(T.frame({ ...c, uid }, "front", "repos", 0, "vide"), 0.6);
      G = T.visageVide();
      recadrer();
      const defs = `<defs><linearGradient id="${IR}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1814"/><stop offset=".55" stop-color="#2E2420"/><stop offset="1" stop-color="${G.eyeColor || "#7A4C38"}"/></linearGradient></defs>`;
      let visage = sourcils(e) + bouche(e, 0);
      let y;
      if (fixe) y = yeux(e, 0, false);
      else if (MOUVANTS.includes(e)) y = phases((t) => yeux(e, t, false));
      else if (CLIGNE.includes(e)) y = cligne(yeux(e, 0, false), yeux(e, 0, true));
      else y = yeux(e, 0, false);
      if (!fixe && ["rire", "etourdi", "endormi", "effraye", "crocodile", "malicieux", "fatigue"].includes(e)) visage = sourcils(e) + phases((t) => bouche(e, t));
      const s = fixe ? signes(e, 0.2) : phases((t) => signes(e, t));
      const b = BOUGE[e] && !fixe ? `<animateTransform attributeName="transform" type="translate" values="${BOUGE[e][0]}" dur="${BOUGE[e][1]}" repeatCount="indefinite"/>` : "";
      return `${defs}<g>${b}${base}${visage}${y}${s}</g>`;
    }
    __name(dessin, "dessin");
    var VB = [5, 0, 38, 38];
    function recadrer() {
      const cx = (G.eyes[0][0] + G.eyes[1][0]) / 2, ey = G.eyes[0][1];
      VB = [f(cx - 19), f(ey - 22.6), 38, 38];
      BX = VB[0] + 32.5;
      BY = VB[1] + 10.5;
    }
    __name(recadrer, "recadrer");
    var EXPRESSIONS_PORTRAIT2 = Object.keys(YEUX);
    var NOMS_EXPRESSIONS = { neutre: "Neutre", content: "Content", rire: "Rire", surpris: "Surpris", triste: "Triste", fache: "Fâché", gene: "Gêné", endormi: "Endormi", emu: "Ému aux larmes", effraye: "Effrayé", boude: "Boudeur", determine: "Déterminé", emerveille: "Émerveillé (yeux en étoiles)", adore: "Adore (yeux en cœurs)", etourdi: "Étourdi (yeux en spirale)", crocodile: "Gros chagrin", pensif: "Pensif", malicieux: "Malicieux", fier: "Fier", fatigue: "Fatigué", degoute: "Dégoûté" };
    var NOMS_BULLES = { exclamation: "Exclamation (!)", question: "Question (?)", points: "Points de suspension (…)", note: "Note de musique", ampoule: "Ampoule (une idée)", orage: "Nuage d'orage" };
    var BULLES_PORTRAIT2 = Object.keys(BULLES);
    var HD = 4;
    var TAILLE = 96;
    var svgOf = /* @__PURE__ */ __name((cadre, corps, hd) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TAILLE * hd}" height="${TAILLE * hd}" viewBox="${cadre.join(" ")}">${corps}</svg>`, "svgOf");
    function portrait(c, expr = "neutre", { fixe = false, hd = HD, uid } = {}) {
      if (!YEUX[expr]) throw new Error(`expression inconnue : ${expr} (${EXPRESSIONS_PORTRAIT2.join(", ")})`);
      const corps = dessin(c, expr, uid || `${c.uid || "p"}${expr}`, fixe), cadre = VB.slice();
      return { svg: svgOf(cadre, corps, hd), cadre, corps };
    }
    __name(portrait, "portrait");
    function bulle(cle, { fixe = false, hd = HD } = {}) {
      if (!BULLES[cle]) throw new Error(`bulle inconnue : ${cle} (${BULLES_PORTRAIT2.join(", ")})`);
      BX = 32.5;
      BY = 10.5;
      const corps = fixe ? BULLES[cle](0.3) : phases(BULLES[cle]), cadre = [0, 0, 38, 38];
      return { svg: svgOf(cadre, corps, hd), cadre, corps };
    }
    __name(bulle, "bulle");
    module.exports = { portrait, bulle, EXPRESSIONS_PORTRAIT: EXPRESSIONS_PORTRAIT2, BULLES_PORTRAIT: BULLES_PORTRAIT2, NOMS_EXPRESSIONS, NOMS_BULLES, HD_PORTRAIT: HD, TAILLE_PORTRAIT: TAILLE };
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
      taille: { petite: "Petite", moyenne: "Moyenne", grande: "Grande" },
      silhouette: { fine: "Fine", moyenne: "Moyenne", large: "Large", ronde: "Ronde" },
      visage: { rond: "Rond", ovale: "Ovale", carre: "Carré" },
      formeYeux: { ronds: "Ronds", amande: "En amande", grands: "Grands", rieurs: "Rieurs", paisibles: "Paisibles" },
      cils: { sans: "Sans", legers: "Légers", recourbes: "Recourbés" },
      sourcils: { fins: "Fins", epais: "Épais", doux: "Doux" },
      bouche: { douce: "Douce", sourire: "Souriante", malice: "Malicieuse", serieuse: "Sérieuse" },
      rousseur: { non: "Sans", legere: "Quelques-unes", oui: "Taches de rousseur" },
      joues: { roses: "Roses", discretes: "Discrètes" },
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
        rasee: "Rasée"
      },
      meches: { sans: "Une couleur", pointes: "Pointes colorées", meches: "Mèches" },
      haut: { tshirt: "T-shirt", mariniere: "Marinière", pull: "Pull", sweat: "Sweat à capuche", chemise: "Chemise", veste: "Veste ouverte" },
      // la robe d'une pièce remplace le haut (le choix du haut est gardé : il revient si l'on change de bas)
      bas: { pantalon: "Pantalon", short: "Short", jupe: "Jupe", salopette: "Salopette", robe: "Robe chasuble", robeEntiere: "Robe" }
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
    var A = /* @__PURE__ */ __name((nom, emplacement, zones, defaut, rarete, source, garde, saison) => ({ nom, emplacement, zones, defaut, rarete, source, ...prix(rarete, source), garde, ...saison ? { saison } : {} }), "A");
    var ACCESSOIRES = {
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
    };
    var CHOIX = {
      taille: "formes",
      silhouette: "formes",
      peau: "peau",
      visage: "formes",
      yeux: "yeux",
      formeYeux: "formes",
      cils: "formes",
      sourcils: "formes",
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
      bas: "formes",
      couleurBas: "tissus",
      chaussures: "tissus"
    };
    var DEFAUT = {
      taille: "moyenne",
      silhouette: "moyenne",
      peau: "peche",
      visage: "rond",
      yeux: "brun",
      formeYeux: "ronds",
      cils: "sans",
      sourcils: "fins",
      bouche: "douce",
      levres: "naturelles",
      rousseur: "non",
      joues: "roses",
      grain: "non",
      coupe: "courte",
      cheveux: "brun",
      meches: "sans",
      couleurMeches: "blond",
      haut: "tshirt",
      couleurHaut: "corail",
      bas: "pantalon",
      couleurBas: "jean",
      chaussures: "cuir",
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
      const bas = un(cles(FORMES.bas)), couleurBas = un(tissus.filter(loin));
      const o = {
        taille: un(cles(FORMES.taille)),
        silhouette: un(cles(FORMES.silhouette)),
        peau: un(cles(NUANCIERS.peau)),
        visage: un(cles(FORMES.visage)),
        yeux: un(cles(NUANCIERS.yeux)),
        formeYeux: un(cles(FORMES.formeYeux)),
        cils: un(cles(FORMES.cils)),
        sourcils: un(cles(FORMES.sourcils)),
        bouche: un(cles(FORMES.bouche)),
        levres: r() < 0.3 ? un(cles(NUANCIERS.levres).slice(1)) : "naturelles",
        rousseur: r() < 0.25 ? un(["legere", "oui"]) : "non",
        joues: un(cles(FORMES.joues)),
        grain: r() < 0.15 ? un(["joue", "levre"]) : "non",
        coupe: un(cles(FORMES.coupe)),
        cheveux: r() < 0.8 ? un(naturels) : un(fantaisie),
        meches: r() < 0.2 ? un(["pointes", "meches"]) : "sans",
        couleurMeches: un(cles(NUANCIERS.cheveux)),
        haut,
        couleurHaut,
        bas,
        couleurBas,
        chaussures: un(["cuir", "caramel", "noir", "blanc", "creme", "rouge", "jean", "rose"]),
        accessoires: {}
      };
      const permis = Object.entries(ACCESSOIRES).filter(([, a]) => !a.saison && (!gratuit || a.source === "gratuit"));
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
    var { OUT, P: P2, E, L, limb, clip, r2, shoe } = require_troupe();
    var { tone, mix } = require_avatar_choix();
    var sx = /* @__PURE__ */ __name((d, k) => k ? d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`) : d, "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`), "mirror");
    var decale = /* @__PURE__ */ __name((v) => v === "se" ? -1.4 : 0, "decale");
    var reflet = /* @__PURE__ */ __name((c) => tone(c, 1.45), "reflet");
    var fleurette = /* @__PURE__ */ __name((x, y, r, col, coeur2 = "#F2C04B") => [0, 1, 2, 3, 4].map((i) => {
      const a = i / 5 * Math.PI * 2 - Math.PI / 2;
      return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.78, r * 0.78, col, 0.55);
    }).join("") + E(x, y, r * 0.55, r * 0.55, coeur2, 0.5), "fleurette");
    var feuille = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${s})">${P2("M0,0 Q1.3,-1.1 2.8,0 Q1.3,1.1 0,0 Z", "#7EB45A", 0.5)}</g>`, "feuille");
    var etoile = /* @__PURE__ */ __name((x, y, r, col, w = 0.6) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = i / 10 * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        return `${r2(x + Math.cos(a) * rr)},${r2(y + Math.sin(a) * rr)}`;
      });
      return P2(`M${pts.join(" L")} Z`, col, w);
    }, "etoile");
    var coeur = /* @__PURE__ */ __name((x, y, s, col, w = 0.5) => P2(`M${r2(x)},${r2(y + s * 0.9)} C${r2(x - s * 1.5)},${r2(y)} ${r2(x - s * 0.9)},${r2(y - s * 1.1)} ${r2(x)},${r2(y - s * 0.35)} C${r2(x + s * 0.9)},${r2(y - s * 1.1)} ${r2(x + s * 1.5)},${r2(y)} ${r2(x)},${r2(y + s * 0.9)} Z`, col, w), "coeur");
    var scintille = /* @__PURE__ */ __name((x, y, s, col) => P2(`M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.18)},${r2(y - s * 0.18)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.18)},${r2(y + s * 0.18)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.18)},${r2(y + s * 0.18)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.18)},${r2(y - s * 0.18)} ${r2(x)},${r2(y - s)} Z`, col, 0.45), "scintille");
    function reperes(c) {
      const [[x0, y0], [x1]] = c.shoulders, dy = c.dy || 0, e = (x1 - x0) / 2;
      const k = c.k || { sw: e + 0.5, hw: e + 2.2, b: 0, ...c.porte };
      const hanche = r2(c.hip - dy);
      return { cou: r2(y0 - dy - 3.2), e, sw: k.sw, hw: k.hw, b: k.b, hanche, ourlet: c.coatHem !== void 0 ? c.coatHem : r2(hanche + (c.ground - c.hip) * 0.45) };
    }
    __name(reperes, "reperes");
    function capucheRabattue(uid, view, R, col, S) {
      const { cou: y, e } = R, a = r2(24 - e + 0.4), b = r2(24 + e - 0.4);
      if (view !== "ne") return P2(`M${a},${r2(y + 0.8)} Q24,${r2(y - 3.8)} ${b},${r2(y + 0.8)} L${b},${r2(y + 3)} L${a},${r2(y + 3)} Z`, S);
      const d = `M${a},${r2(y + 2.2)} Q24,${r2(y + 6.8)} ${b},${r2(y + 2.2)} L${r2(24 + e + 0.6)},${r2(y + 7.8)} Q24,${r2(y + 11.4)} ${r2(24 - e - 0.6)},${r2(y + 7.8)} Z`;
      return P2(d, col) + clip(`${uid}cap`, d, `<rect x="27.2" y="${r2(y)}" width="16" height="14" fill="${S}"/>`) + P2(d, "none") + P2(`M${r2(24 - e + 1.6)},${r2(y + 6.6)} Q24,${r2(y + 9.6)} ${r2(24 + e - 1.6)},${r2(y + 6.6)}`, "none", 0.7);
    }
    __name(capucheRabattue, "capucheRabattue");
    function bonnet(c, { view }, [col, revers]) {
      const k = view === "se" ? -0.8 : 0, X = /* @__PURE__ */ __name((x) => r2(x + k), "X");
      const dome = `M${X(10.4)},15.6 Q${X(9.8)},5.6 ${X(24)},5.4 Q${X(38.2)},5.6 ${X(37.6)},15.6 Z`;
      const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${X(38)},12.8 L${X(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
      const cotes = [-11, -6.6, -2.2, 2.2, 6.6, 11].map((d) => `<path d="M${X(24 + d * 0.55)},6 Q${X(24 + d * 1.05)},9.2 ${X(24 + d * 1.1)},15.4" fill="none" stroke="${tone(col, 0.8)}" stroke-width="0.6"/>`).join("");
      const mailles = [-12, -8, -4, 0, 4, 8, 12].map((d) => L([24 + d + k, 13.6 + (Math.abs(d) < 6 ? 1 : 0.4) - Math.abs(d) * 0.05], [24 + d * 1.01 + k, 16.4 + (Math.abs(d) < 6 ? 1.1 : 0.4) - Math.abs(d) * 0.05], tone(revers, 0.84), 0.5)).join("");
      return P2(dome, col) + clip(`${c.uid}bn${view}`, dome, cotes + `<rect x="${X(27.6)}" y="2" width="12" height="15" fill="${tone(col, 0.86)}" opacity="0.7"/>`) + P2(dome, "none") + P2(rim, revers) + clip(`${c.uid}rv${view}`, rim, mailles) + P2(rim, "none") + E(X(24), 5.7, 2.3, 1.55, revers, 0.85) + E(X(23.4), 5.2, 0.8, 0.55, "#FFFFFF", 0);
    }
    __name(bonnet, "bonnet");
    function arceau(c, { view }, [, col]) {
      const d = view === "se" ? "M13.4,20.4 Q12.6,8.6 24.2,8.2 Q36.2,8.6 35.8,20.4" : "M12.6,20.4 Q12,7.6 24,7.4 Q36,7.6 35.4,20.4";
      return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    __name(arceau, "arceau");
    function cacheOreilles(c, { view }, [col]) {
      const muffs = view === "se" ? [[35.4, 22.6]] : view === "ne" ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
      return muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P2(`M${r2(x - 1.7)},${r2(y + 1.3)} Q${x},${r2(y + 2.6)} ${r2(x + 1.7)},${r2(y + 1.3)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`) + E(x - 0.7, y - 1.2, 0.9, 0.8, "#FFFFFF", 0)).join("");
    }
    __name(cacheOreilles, "cacheOreilles");
    function paille(c, { view }, [col]) {
      const k = decale(view);
      const crown = sx("M15.6,13.4 Q15.8,5.2 24,5 Q32.2,5.2 32.4,13.4 Z", k);
      return E(24 + k, 13.6, view === "ne" ? 15.4 : 16.4, 3.4, "#F2D27E") + P2(crown, "#E8C46A") + `<rect x="${r2(15.6 + k)}" y="10.6" width="16.8" height="2.2" fill="${col}"/>` + P2(crown, "none") + L([17.2 + k, 8], [21 + k, 6.4], "#FFF0B8", 0.9);
    }
    __name(paille, "paille");
    function casquette(c, { view }, [col]) {
      const k = decale(view);
      const dome = sx("M11.6,15.6 Q11.4,5.6 24,5.4 Q36.6,5.6 36.4,15.6 Z", k);
      const visor = view === "ne" ? "" : view === "se" ? P2("M9,15.6 Q8.4,12.6 16,13.6 L22,15.6 Q15,17.4 9,15.6 Z", tone(col, 0.8)) : P2("M15,15.4 Q24,12.6 33,15.4 Q24,19 15,15.4 Z", tone(col, 0.8));
      return P2(dome, col) + P2(sx("M23.4,5.6 L23.4,15.4", k), "none", 0.5) + E(24 + k, 5.6, 1.1, 0.8, tone(col, 0.8), 0.6) + visor;
    }
    __name(casquette, "casquette");
    function bandana(c, { view }, [col]) {
      const ne = view === "ne", k = decale(view);
      const d = ne ? "M11.2,17.6 Q10.8,6 24,5.8 Q37.2,6 36.8,17.6 Q24,14.4 11.2,17.6 Z" : sx("M11.6,16.4 Q11.4,6.2 24,6 Q36.6,6.2 36.4,16.4 Q24,13 11.6,16.4 Z", k);
      let s = P2(d, col) + clip(`${c.uid}bd${view}`, d, [[16, 9], [21, 7.4], [27, 8], [31.6, 10.6], [19, 12.6], [28.6, 12.6]].map(([x, y]) => E(x + k, y, 0.7, 0.7, "#FFF4E0", 0)).join("")) + P2(d, "none");
      if (ne) s += P2("M23,16.4 Q21.4,19.6 21.8,22.6 Q23,21.6 23.8,22.2 Q23.4,19.4 24.4,16.6 Z", tone(col, 0.85), 0.8) + P2("M25,16.4 Q27.4,19 27.6,22 Q26.4,21.2 25.6,21.8 Q25.4,19.2 23.8,16.8 Z", tone(col, 0.85), 0.8) + E(24, 16.4, 1.8, 1.3, col, 0.8);
      return s;
    }
    __name(bandana, "bandana");
    function couronneFleurs(c, { view }, [col]) {
      const k = decale(view);
      const pts = view === "ne" ? [[12.6, 15.6], [15.8, 12.6], [19.8, 11.2], [24, 10.8], [28.2, 11.2], [32.2, 12.6], [35.4, 15.6]] : [[12.8, 14.6], [16, 11.8], [20, 10.6], [24, 10.2], [28, 10.6], [32, 11.8], [35.2, 14.6]];
      const alt = mix(col, "#FFFFFF", 0.55);
      let s = P2(sx(view === "ne" ? "M12.6,15.6 Q24,8.6 35.4,15.6" : "M12.8,14.6 Q24,8 35.2,14.6", k), "none", 0) + pts.slice(0, -1).map(([x, y], i) => feuille(x + k + 1.4, y - 0.4, i % 2 ? -30 : 20, 0.9)).join("");
      s += pts.map(([x, y], i) => fleurette(x + k, y, i % 2 ? 1.05 : 1.25, i % 2 ? alt : col)).join("");
      return s;
    }
    __name(couronneFleurs, "couronneFleurs");
    function beret(c, { view }, [col]) {
      const k = decale(view);
      const d = view === "ne" ? "M11.8,13.4 Q10.6,6.4 22.4,5 Q34.6,4.4 37.6,9.6 Q38.4,12.6 35.6,13.2 Q24,10.6 11.8,13.4 Z" : sx("M12.4,12.2 Q11,6 22.4,4.8 Q34,4.2 37.6,8.8 Q38.6,11.6 35.4,12.2 Q24,10 12.4,12.2 Z", k);
      return P2(d, col) + clip(`${c.uid}br${view}`, d, `<path d="${sx("M8,10 Q24,7.6 42,10 L42,16 L8,16 Z", k)}" fill="${tone(col, 0.82)}"/>`) + P2(d, "none") + P2(sx("M24.2,5.2 L24.5,4.4 L25.6,4.5", k), "none", 1.1) + L([16 + k, 7.6], [21 + k, 6], tone(col, 1.3), 1);
    }
    __name(beret, "beret");
    function oreillesChat(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const ear = sx("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z", k), inner = sx("M15,9.8 L14.5,6 L18.2,8 Z", k);
      const earR = sx(mirror("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z"), k), innerR = sx(mirror("M15,9.8 L14.5,6 L18.2,8 Z"), k);
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>` + P2(ear, col) + P2(earR, col) + (ne ? "" : P2(inner, "#F4A8B8", 0) + P2(innerR, "#F4A8B8", 0));
    }
    __name(oreillesChat, "oreillesChat");
    function oreillesLapin(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const left = sx("M16.2,9.4 Q14.2,5.2 15.6,3.4 Q17.6,2.4 19.2,4.6 Q20.2,6.8 19.4,8.8 Z", k);
      const right = sx("M28.6,8.6 Q29,4.6 31.6,3.8 Q34.2,3.6 36.4,5.8 Q36.8,7.4 35,7.2 Q32.6,6.4 31.4,9.2 Z", k);
      const pink = "#F4A8B8";
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 1.8)">` + P2(left, col) + P2(right, col) + (ne ? "" : P2(sx("M16.8,8.4 Q15.6,5.4 16.4,4.4 Q17.6,4 18.4,5.4 Q18.8,7 18.4,8.2 Z", k), pink, 0) + P2(sx("M30.2,7.6 Q30.6,5.4 32,4.9 Q33.8,4.8 35.2,6 Q33,5.6 31.6,7.8 Z", k), pink, 0)) + "</g>";
    }
    __name(oreillesLapin, "oreillesLapin");
    function diademe(c, { view }, [col]) {
      const k = decale(view);
      if (view === "ne") return `<path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
      const d = sx("M15.4,11.6 Q24,8.6 32.6,11.6 L31.4,8.8 L28.4,9.6 L26.2,6.6 L24,4.8 L21.8,6.6 L19.6,9.6 L16.6,8.8 Z", k);
      return P2(d, col, 0.9) + P2(sx("M16.4,10.6 Q24,8 31.6,10.6", k), "none", 0.45) + E(24 + k, 8.2, 1.1, 1.3, "#E8879C", 0.6) + E(23.7 + k, 7.8, 0.35, 0.4, "#FFFFFF", 0) + E(19.8 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + E(28.2 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + L([20.6 + k, 8.2], [22.6 + k, 6.4], reflet(col), 0.6);
    }
    __name(diademe, "diademe");
    var PIN = { front: [15.4, 10.6], se: [14.6, 11], ne: [32.6, 11.6] };
    function noeud(c, { view }, [col]) {
      const [x, y] = PIN[view], d = tone(col, 0.82);
      return P2(`M${x},${y} Q${r2(x - 4.4)},${r2(y - 3.6)} ${r2(x - 4.4)},${r2(y + 0.2)} Q${r2(x - 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8) + P2(`M${x},${y} Q${r2(x + 4.4)},${r2(y - 3.6)} ${r2(x + 4.4)},${r2(y + 0.2)} Q${r2(x + 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8) + P2(`M${r2(x - 0.6)},${r2(y + 0.6)} L${r2(x - 1.8)},${r2(y + 3.8)} L${r2(x - 0.4)},${r2(y + 3.2)} Z M${r2(x + 0.6)},${r2(y + 0.6)} L${r2(x + 1.8)},${r2(y + 3.8)} L${r2(x + 0.4)},${r2(y + 3.2)} Z`, d, 0.6) + E(x, y, 1.15, 1.25, d, 0.7) + L([x - 3.2, y - 1], [x - 1.8, y - 1.6], tone(col, 1.35), 0.6);
    }
    __name(noeud, "noeud");
    function barrettes(c, { view }, [col]) {
      const [x, y] = PIN[view];
      const one = /* @__PURE__ */ __name((dx, dy) => `<rect x="${r2(x + dx - 2.2)}" y="${r2(y + dy - 0.65)}" width="4.4" height="1.3" rx="0.65" fill="${col}" stroke="${OUT}" stroke-width="0.6" transform="rotate(-28 ${r2(x + dx)} ${r2(y + dy)})"/>`, "one");
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
    var branches = /* @__PURE__ */ __name((view, col) => (view === "se" ? P2("M27.9,22.2 L34.4,21.4", "none", 0.8) : P2("M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6", "none", 0.8)).replace(`stroke="${OUT}"`, `stroke="${col}"`), "branches");
    var deDos = /* @__PURE__ */ __name((col) => P2("M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${col}"`), "deDos");
    function lunettes(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne") return deDos(forme === "rondes" ? col : tone(col, 0.7));
        const [[x1, y], [x2]] = VERRES[view];
        const se = view === "se", f = se ? 0.86 : 1;
        const frame = forme === "rondes" ? col : tone(col, 0.9);
        const glass = forme === "soleil" ? `fill="${tone(col, 0.45)}" fill-opacity="0.9"` : forme === "coeur" ? `fill="${mix(col, "#FFFFFF", 0.3)}" fill-opacity="0.55"` : 'fill="rgba(200,230,255,.25)"';
        const lens = /* @__PURE__ */ __name((x, w) => {
          if (forme === "rondes" || forme === "soleil") return `<circle cx="${x}" cy="${y}" r="${r2(3.1 * w)}" ${glass} stroke="${frame}" stroke-width="${forme === "soleil" ? 1 : 0.9}"/>`;
          if (forme === "carrees") return `<rect x="${r2(x - 3.2 * w)}" y="${r2(y - 2.4)}" width="${r2(6.4 * w)}" height="4.8" rx="1.1" ${glass} stroke="${frame}" stroke-width="1"/>`;
          if (forme === "papillon") {
            const o = x < 24 - (se ? 1.4 : 0) ? -1 : 1;
            return `<path d="M${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Q${x},${r2(y - 2.6)} ${r2(x + 3.4 * w * o)},${r2(y - 2.8)} Q${r2(x + 3 * w * o)},${r2(y + 2.6)} ${x},${r2(y + 2.4)} Q${r2(x - 3 * w * o)},${r2(y + 2.2)} ${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Z" ${glass} stroke="${frame}" stroke-width="1"/>`;
          }
          return coeur(x, y + 0.2, 3 * w, mix(col, "#FFFFFF", 0.3), 1).replace(`fill="${mix(col, "#FFFFFF", 0.3)}"`, glass).replace(`stroke="${OUT}"`, `stroke="${frame}"`);
        }, "lens");
        let s = lens(x1, 1) + lens(x2, f) + P2(se ? "M20.1,22.4 Q21.2,21.6 22.9,22.4" : "M22.5,22.4 Q24,21.4 25.5,22.4", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${frame}"`) + branches(view, frame);
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
      return `<g transform="rotate(-24 ${x} ${y})"><rect x="${r2(x - 2.4)}" y="${r2(y - 0.95)}" width="4.8" height="1.9" rx="0.9" fill="${col}" stroke="${OUT}" stroke-width="0.6"/><rect x="${r2(x - 0.8)}" y="${r2(y - 0.75)}" width="1.6" height="1.5" rx="0.3" fill="${tone(col, 0.88)}"/>` + [-1.7, 1.5].map((d) => E(x + d, y - 0.25, 0.16, 0.16, tone(col, 0.7), 0) + E(x + d + 0.2, y + 0.35, 0.16, 0.16, tone(col, 0.7), 0)).join("") + "</g>";
    }
    __name(pansement, "pansement");
    var LOBES = { front: [[11.8, 24.6], [36.2, 24.6]], se: [[35.1, 25]] };
    function boucles(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne" || !c.oreillesVisibles) return "";
        return LOBES[view].map(([x, y]) => {
          if (forme === "puces") return E(x, y, 0.75, 0.75, col, 0.5) + E(x - 0.25, y - 0.25, 0.22, 0.22, reflet(col), 0);
          if (forme === "anneaux") return `<circle cx="${x}" cy="${r2(y + 1)}" r="1.25" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r2(y + 1)}" r="1.25" fill="none" stroke="${col}" stroke-width="0.6"/>`;
          return L([x, y], [x, y + 1.6], OUT, 0.5) + etoile(x, y + 2.8, 1.35, col, 0.5);
        }).join("");
      };
    }
    __name(boucles, "boucles");
    var milieu = /* @__PURE__ */ __name((v) => v === "se" ? 21.6 : 24, "milieu");
    function foulard(c, { view }, [col]) {
      if (view === "ne") return P2("M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z", col);
      const kx = view === "se" ? 18.6 : 20.8;
      return P2("M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z", col) + P2(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, col) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(col, 0.8), 0.9);
    }
    __name(foulard, "foulard");
    function echarpe(c, { view }, [col, raie]) {
      const y = reperes(c).cou, uid = c.uid, Y = /* @__PURE__ */ __name((d) => r2(y + d), "Y");
      const band = `M15.2,${Y(-0.4)} Q24,${Y(4.6)} 32.8,${Y(-0.4)} L33.6,${Y(3.2)} Q24,${Y(9)} 14.4,${Y(3.2)} Z`;
      const rayures = /* @__PURE__ */ __name((id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${8 + i * 6}" y="${Y(-10)}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${Y(5)})"/>`).join("")), "rayures");
      let s = "";
      if (view === "ne") {
        const pan3 = `M28,${Y(3.4)} L31.2,${Y(2.8)} L32.6,${Y(13)} L29.2,${Y(13.4)} Z`;
        s += P2(band, col) + rayures(`${uid}e${view}`, band) + P2(band, "none");
        return s + P2(pan3, col) + clip(`${uid}p${view}`, pan3, [6, 9.4].map((d) => `<rect x="27" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P2(pan3, "none") + [0.7, 1.6, 2.5].map((d) => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join("");
      }
      const ex = view === "se" ? 24.6 : 27.4;
      const pan2 = `M${ex},${Y(3.6)} L${r2(ex + 3)},${Y(3.2)} L${r2(ex + 3.6)},${Y(13.4)} L${r2(ex + 0.2)},${Y(13.8)} Z`;
      s += P2(pan2, col) + clip(`${uid}p${view}`, pan2, [6.2, 9.6].map((d) => `<rect x="${r2(ex - 1)}" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P2(pan2, "none") + [0.7, 1.6, 2.5].map((d) => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join("");
      s += P2(band, col) + rayures(`${uid}e${view}`, band) + P2(band, "none");
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
      const shell = `M${o},${r2(y + 2.4)} L${r2(o - 2.2)},${r2(y - 0.4)} Q${o},${r2(y - 2.6)} ${r2(o + 2.2)},${r2(y - 0.4)} Z`;
      return P2(`M${o - 6},31.4 Q${o},37.8 ${o + 6},31.4`, "none", 0.5) + P2(shell, col, 0.6) + [-1.1, 0, 1.1].map((d) => L([o, y + 2.1], [o + d * 1.4, y - 1.1], tone(col, 0.7), 0.4)).join("");
    }
    __name(coquillage, "coquillage");
    function papillon(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = 32.8;
      return P2(`M${o},${y} L${r2(o - 3.2)},${r2(y - 1.8)} L${r2(o - 3.2)},${r2(y + 1.8)} Z M${o},${y} L${r2(o + 3.2)},${r2(y - 1.8)} L${r2(o + 3.2)},${r2(y + 1.8)} Z`, col, 0.7) + E(o, y, 0.95, 1.05, tone(col, 0.8), 0.6);
    }
    __name(papillon, "papillon");
    function sacDos(c, ctx, [col]) {
      const { view } = ctx, { sw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere") {
        if (view !== "se") return "";
        const bag = "M28.4,33.2 Q28.6,31.6 31,31.6 L36.6,31.8 Q38.6,32 38.6,34.4 L38.4,44.6 Q38.2,46 36.4,46 L30.4,46 Q28.4,46 28.4,44 Z";
        return P2(bag, col) + P2("M31,37.4 L38.4,37.6", "none", 0.6);
      }
      if (view === "ne") {
        const bag = "M17.4,35 Q17.4,32.8 20,32.8 L28,32.8 Q30.6,32.8 30.6,35 L30.4,45 Q30.4,46.8 28.4,46.8 L19.6,46.8 Q17.6,46.8 17.6,45 Z";
        return limb([24 - sw + 2.2, 31.6], [19, 34], 1.5, d) + limb([24 + sw - 2.2, 31.6], [29, 34], 1.5, d) + P2(bag, col) + P2("M17.6,38 Q24,40.6 30.4,38 L30.4,35 Q30.6,32.8 28,32.8 L20,32.8 Q17.4,32.8 17.4,35 Z", d, 0.9) + `<rect x="22.6" y="38.4" width="2.8" height="2.2" rx="0.5" fill="#E8C46A" stroke="${OUT}" stroke-width="0.6"/>` + P2("M19.8,42 L28.2,42 L28,45.4 L20,45.4 Z", "none", 0.6);
      }
      return limb([24 - sw + 2.4, 31.4], [24 - sw + 2.8, 40.6], 1.5, d) + limb([24 + sw - 2.4, 31.4], [24 + sw - 2.8 + (view === "se" ? -1 : 0), 40.6], 1.5, d);
    }
    __name(sacDos, "sacDos");
    function besace(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere") return "";
      const strap = view === "ne" ? [[24 - sw + 1.6, 31.8], [24 + hw - 1.4, 44.2]] : [[24 + sw - 1.6, 31.8], [24 - hw + 1.8, 44.2]];
      const bx = view === "ne" ? 24 + hw - 1.2 : 24 - hw + 1.6;
      const bag = `M${r2(bx - 3.6)},42.6 L${r2(bx + 3.6)},42.6 L${r2(bx + 3.4)},48 Q${bx},48.8 ${r2(bx - 3.4)},48 Z`;
      return limb(strap[0], strap[1], 1.3, d) + P2(bag, col) + P2(`M${r2(bx - 3.6)},42.6 L${r2(bx + 3.6)},42.6 L${r2(bx + 3.5)},45.2 Q${bx},46.4 ${r2(bx - 3.5)},45.2 Z`, d, 0.8) + E(bx, 45.4, 0.6, 0.6, "#E8C46A", 0.5);
    }
    __name(besace, "besace");
    function cape(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere" && view !== "ne") {
        const p = `M${r2(24 - sw - 0.6)},31.4 Q24,29.6 ${r2(24 + sw + 0.6)},31.4 L${r2(24 + hw + 4.2)},52.6 Q24,54.6 ${r2(24 - hw - 4.2)},52.6 Z`;
        return P2(p, col) + clip(`${c.uid}cp${view}`, p, `<rect x="0" y="28" width="48" height="30" fill="${d}" opacity="0.55"/>`) + P2(p, "none");
      }
      if (ctx.couche === "cou" && view !== "ne") {
        const o = milieu(view);
        return P2(`M${r2(o - 5.4)},31 Q${o},33.4 ${r2(o + 5.4)},31`, "none", 1.6).replace(`stroke="${OUT}"`, `stroke="${d}"`) + E(o, 32.6, 1.1, 1.1, "#E8C46A", 0.6);
      }
      if (ctx.couche === "surBras" && view === "ne") {
        const p = `M${r2(24 - sw - 1.2)},31.2 Q24,29.2 ${r2(24 + sw + 1.2)},31.2 Q${r2(24 + sw + 3.4)},34 ${r2(24 + hw + 4.4)},52.6 Q24,54.8 ${r2(24 - hw - 4.4)},52.6 Q${r2(24 - sw - 3.4)},34 ${r2(24 - sw - 1.2)},31.2 Z`;
        return P2(p, col) + clip(`${c.uid}cq${view}`, p, [-5, 0, 5].map((x) => L([24 + x * 0.5, 36], [24 + x, 53], d, 0.7)).join("") + `<rect x="27" y="28" width="20" height="30" fill="${d}" opacity="0.35"/>`) + P2(p, "none");
      }
      return "";
    }
    __name(cape, "cape");
    function ailes(c, ctx, [col]) {
      const { view } = ctx, light = mix(col, "#FFFFFF", 0.45);
      const wing = "M19.6,36.4 Q10.6,26.6 6.2,31.4 Q4.4,36.6 10.6,38.6 Q8.2,43.6 13.6,44.6 Q17.6,42.4 19.8,38.6 Z";
      const veins = "M18.6,37 Q12,32 7.6,32.6 M18.6,37.6 Q13.4,39 11,38.6 M18.8,38.2 Q16,41.6 14,43.6";
      const one = /* @__PURE__ */ __name((d, v, id) => P2(d, col) + clip(id, d, `<path d="${v}" fill="none" stroke="${light}" stroke-width="0.9"/>`) + P2(d, "none"), "one");
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
      const basket = `M${r2(x - 4)},${y} L${r2(x + 4)},${y} L${r2(x + 3.2)},${r2(y + 4.4)} Q${x},${r2(y + 5.2)} ${r2(x - 3.2)},${r2(y + 4.4)} Z`;
      return P2(`M${r2(x - 3.4)},${r2(y + 0.2)} Q${x},${r2(y - 6.6)} ${r2(x + 3.4)},${r2(y + 0.2)}`, "none", 1.6).replace(`stroke="${OUT}"`, 'stroke="#8A5A30"') + fleurette(x - 2, y - 0.6, 1.05, col) + fleurette(x + 1.6, y - 0.9, 1.1, mix(col, "#FFFFFF", 0.5)) + feuille(x - 0.2, y - 0.4, -60, 0.9) + P2(basket, "#C9925A") + clip(`${c.uid}pn${ctx.view}`, basket, [1.4, 2.8].map((d) => L([x - 4, y + d], [x + 4, y + d], "#9A6A3A", 0.5)).join("") + [-2, 0, 2].map((d) => L([x + d, y], [x + d * 0.85, y + 5], "#9A6A3A", 0.5)).join("")) + P2(basket, "none");
    }
    __name(panier, "panier");
    function ombrelle(c, ctx, [col], h) {
      const [x, y] = h, tip = [Math.min(x + 3, 38.6), y - 17.4];
      const canopy = "M-7,0 Q-6.7,-6.2 0,-6.7 Q6.7,-6.2 7,0 Q5.25,-1.2 3.5,0 Q1.75,-1.2 0,0 Q-1.75,-1.2 -3.5,0 Q-5.25,-1.2 -7,0 Z";
      const ribs = [-3.5, 0, 3.5].map((d) => L([d * 0.5, -6.3], [d, -0.2], tone(col, 0.82), 0.5)).join("");
      return limb([x, y + 0.4], tip, 0.7, "#8A5A30") + `<g transform="translate(${r2(tip[0])} ${r2(tip[1] + 1.6)}) rotate(16)">${P2(canopy, col)}${ribs}${E(0, -6.9, 0.6, 0.6, tone(col, 0.8), 0.5)}</g>`;
    }
    __name(ombrelle, "ombrelle");
    var balance = /* @__PURE__ */ __name((ctx) => ctx.walk ? [0.5, 0, -0.5, 0][ctx.n] : 0, "balance");
    function pan(c, ctx) {
      const { sw, hw, b, cou: y, hanche, ourlet: H } = reperes(c), w = balance(ctx);
      const mx = (sw + hw) / 2 + b + 0.6;
      return `M${r2(24 - sw - 0.5)},${r2(y + 1.6)} Q24,${r2(y - 1.2)} ${r2(24 + sw + 0.5)},${r2(y + 1.6)} Q${r2(24 + mx)},${r2(y + 8.8)} ${r2(24 + hw + 0.9)},${r2(hanche + 0.9)} L${r2(24 + hw + 2.4 + w)},${H} Q${r2(24 + w)},${r2(H + 1.8)} ${r2(24 - hw - 2.4 + w)},${H} L${r2(24 - hw - 0.9)},${r2(hanche + 0.9)} Q${r2(24 - mx)},${r2(y + 8.8)} ${r2(24 - sw - 0.5)},${r2(y + 1.6)} Z`;
    }
    __name(pan, "pan");
    function panPeint(c, ctx, id, col, S, reflets = "") {
      const { view } = ctx, d = pan(c, ctx), { sw, cou: y, ourlet: H } = reperes(c);
      const ombre = `<rect x="${view === "se" ? 25.4 : 27.2}" y="${r2(y - 1.8)}" width="16" height="30" fill="${S}"/><path d="M6,${r2(H - 1.6)} Q24,${r2(H + 1.4)} 42,${r2(H - 1.6)} L42,${r2(H + 4)} L6,${r2(H + 4)} Z" fill="${S}"/>`;
      const clair = view === "ne" ? "" : `<rect x="${r2(24 - sw + 0.6)}" y="${r2(y + 3.6)}" width="1.3" height="10" rx="0.6" fill="${tone(col, 1.28)}"/>`;
      return P2(d, col) + clip(`${c.uid}${id}${view}`, d, ombre + clair + reflets) + P2(d, "none");
    }
    __name(panPeint, "panPeint");
    function poches(c, { view }, S) {
      const { hw, hanche } = reperes(c), se = view === "se";
      const one = /* @__PURE__ */ __name((x, l) => P2(`M${r2(x)},${r2(hanche + 1.1)} L${r2(x + l)},${r2(hanche + 1.1)} L${r2(x + l - 0.2)},${r2(hanche + 2.7)} L${r2(x + 0.2)},${r2(hanche + 2.7)} Z`, S, 0.6), "one");
      return one(24 - hw - 0.4 - (se ? 0.6 : 0), 4.4) + one(24 + hw - (se ? 3.4 : 4), se ? 3 : 4.4);
    }
    __name(poches, "poches");
    function colFourrure(o, view, col, y) {
      const S = tone(col, 0.86), Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      if (view === "ne") {
        return P2(`M15.4,${Y(0)} Q24,${Y(3.2)} 32.6,${Y(0)} L33.2,${Y(2.4)} Q24,${Y(6.2)} 14.8,${Y(2.4)} Z`, col, 0.9) + P2(`M17.4,${Y(2.8)} Q24,${Y(5.2)} 30.6,${Y(2.8)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
      }
      const pts = Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        return [(1 - t) ** 2 * (o + 8.4) + 2 * t * (1 - t) * o + t * t * (o - 8.4), (1 - t) ** 2 * (y + 1.8) + 2 * t * (1 - t) * (y + 8.4) + t * t * (y + 1.8)];
      });
      let d = `M${r2(o - 6.8)},${Y(-0.2)} Q${o},${Y(3)} ${r2(o + 6.8)},${Y(-0.2)} L${r2(pts[0][0])},${r2(pts[0][1])}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        d += ` Q${r2((x0 + x1) / 2)},${r2((y0 + y1) / 2 + 1.5)} ${r2(x1)},${r2(y1)}`;
      }
      d += " Z";
      return P2(d, col, 0.9) + P2(`M${r2(o - 5)},${Y(3.4)} Q${o},${Y(6.4)} ${r2(o + 5)},${Y(3.4)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
    }
    __name(colFourrure, "colFourrure");
    var BOIS = "#D9B27C";
    function manteau(c, ctx, [col, fourrure]) {
      if (ctx.couche !== "dessus") return "";
      const { view } = ctx, { cou: y, ourlet: H } = reperes(c), S = tone(col, 0.8), w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r2(y + d), "Y");
      let s = panPeint(c, ctx, "mt", col, S);
      if (view === "ne") {
        s += P2(`M24,${Y(3)} L${r2(24 + w * 0.6)},${r2(H - 3.6)}`, "none", 0.5) + P2(`M${r2(24 + w * 0.6)},${r2(H - 3.6)} L${r2(24 + w)},${r2(H + 0.6)}`, "none", 0.8) + `<rect x="19.2" y="${Y(10.8)}" width="9.6" height="1.8" rx="0.8" fill="${S}" stroke="${OUT}" stroke-width="0.7"/>` + E(20.5, y + 11.7, 0.55, 0.55, BOIS, 0.45) + E(27.5, y + 11.7, 0.55, 0.55, BOIS, 0.45);
        return s + colFourrure(24, view, fourrure, y);
      }
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      s += P2(`M${r2(o + 1.2)},${Y(3.6)} L${r2(o + 1.2 + w)},${r2(H + 0.8)}`, "none", 0.8);
      for (const d of [6.2, 9.6, 13]) {
        const yy = y + d, x = o + 1.2 + w * (yy - sh) / (H - sh);
        s += L([x - 2.6, yy], [x + 2.6, yy], tone(col, 0.55), 0.55) + `<rect x="${r2(x - 1.5)}" y="${r2(yy - 0.55)}" width="3" height="1.1" rx="0.55" fill="${BOIS}" stroke="${OUT}" stroke-width="0.5"/>`;
      }
      return s + poches(c, ctx, S) + colFourrure(o, view, fourrure, y);
    }
    __name(manteau, "manteau");
    function cire(c, ctx, [col]) {
      const { view } = ctx, S = tone(col, 0.82), R = reperes(c);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R, col, S);
      if (ctx.couche !== "dessus") return "";
      const { cou: y, ourlet: H, sw, hw, hanche } = R, w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r2(y + d), "Y");
      const gl = "rgba(255,255,255,.55)";
      const reflets = view === "ne" ? L([24 - sw + 2.2, y + 4.2], [24 - sw + 1.8, y + 8.8], gl, 0.9) : L([24 - sw + 3, y + 4.6], [24 - sw + 2.6, y + 9.2], gl, 0.9) + L([24 - hw + 0.6, hanche + 2.5], [24 - hw + 0.2 + w, hanche + 4.9], gl, 0.8);
      let s = panPeint(c, ctx, "cr", col, S, reflets);
      if (view === "ne") return s + P2(`M24,${Y(9.2)} L${r2(24 + w)},${r2(H + 0.6)}`, "none", 0.5) + capucheRabattue(c.uid, view, R, col, S);
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      if ((c.o.accessoires.dessus || {}).ouvert) {
        const coin = `M${r2(o - 2.6)},${Y(2)} L${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 2)} L${r2(o - 3 + w)},${r2(H + 2)} Z`;
        s = `<clipPath id="${c.uid}cro${view}"><path d="M0,0 L48,0 L48,64 L0,64 Z ${coin}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c.uid}cro${view})">${s}</g>`;
        s += P2(`M${r2(o - 2.6)},${Y(2)} L${r2(o - 3 + w)},${r2(H + 0.4)} M${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 0.4)}`, "none");
        s += [6, 10, 14].map((d) => y + d).filter((yy) => yy < H - 2).map((yy) => E(o - 4.2 + w * (yy - sh) / (H - sh), yy, 0.55, 0.55, tone(col, 0.5), 0.4)).join("");
        s += P2(`M${r2(o - 6.4)},${Y(0.8)} L${r2(o - 2.4)},${Y(4.4)} L${r2(o - 3.6)},${Y(5.8)} Z`, col, 0.8) + P2(`M${r2(o + 6.4)},${Y(0.8)} L${r2(o + 2.4)},${Y(4.4)} L${r2(o + 3.6)},${Y(5.8)} Z`, S, 0.8);
        return s + poches(c, ctx, S);
      }
      s += P2(`M${r2(o + 0.8)},${Y(3)} L${r2(o + 0.8 + w)},${r2(H + 0.8)}`, "none", 0.9);
      s += [5.6, 9.2, 12.8, 16.4].map((d) => y + d).filter((yy) => yy < H - 1.4).map((yy) => E(o + 2.2 + w * (yy - sh) / (H - sh), yy, 0.6, 0.6, tone(col, 0.5), 0.4)).join("");
      s += P2(`M${r2(o - 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o - 1.6)},${Y(6)} Z`, col, 0.8) + P2(`M${r2(o + 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o + 2.4)},${Y(6)} Z`, S, 0.8);
      return s + poches(c, ctx, S);
    }
    __name(cire, "cire");
    function chale(c, { view }, [col, frange]) {
      const { cou: y, e } = reperes(c), uid = c.uid, Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      const S = tone(col, 0.82), L0 = r2(24 - e - 3.6), R0 = r2(24 + e + 3.6);
      const tricot = /* @__PURE__ */ __name(() => [0, 1, 2, 3, 4, 5].map((i) => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join("") + [0, 1, 2, 3, 4, 5].map((i) => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join(""), "tricot");
      if (view === "ne") {
        const d2 = `M${L0},${Y(5.4)} Q${r2(24 - e - 1)},${Y(0.4)} 24,${Y(-0.2)} Q${r2(24 + e + 1)},${Y(0.4)} ${R0},${Y(5.4)} Q${r2(R0 + 0.2)},${Y(8.4)} ${r2(R0 - 1.2)},${Y(9.6)} L24,${Y(17.6)} L${r2(L0 + 1.2)},${Y(9.6)} Q${r2(L0 - 0.2)},${Y(8.4)} ${L0},${Y(5.4)} Z`;
        return P2(d2, col) + clip(`${uid}ch${view}`, d2, tricot() + `<rect x="25.6" y="${Y(-2)}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P2(d2, "none") + [-1.6, -0.5, 0.6, 1.7].map((dx) => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join("");
      }
      const o = view === "se" ? 22 : 24;
      const d = `M${r2(o - 5.6)},${Y(0.6)} L${o},${Y(8.6)} L${r2(o + 5.6)},${Y(0.6)} Q${r2(R0 - 2.4)},${Y(1.4)} ${R0},${Y(4.6)} Q${r2(R0 + 0.6)},${Y(7.6)} ${r2(R0 - 0.2)},${Y(10)} Q${r2(o + 6)},${Y(11.4)} ${r2(o + 1.6)},${Y(10.2)} L${o},${Y(11.6)} L${r2(o - 1.6)},${Y(10.2)} Q${r2(o - 6)},${Y(11.4)} ${r2(L0 + 0.2)},${Y(10)} Q${r2(L0 - 0.6)},${Y(7.6)} ${L0},${Y(4.6)} Q${r2(L0 + 2.4)},${Y(1.4)} ${r2(o - 5.6)},${Y(0.6)} Z`;
      let s = P2(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${r2(o + 3.4)}" y="${Y(-2)}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P2(d, "none");
      const pan2 = /* @__PURE__ */ __name((dx, sg) => `M${r2(o + dx)},${Y(10.4)} L${r2(o + dx + sg * 2.4)},${Y(10.6)} L${r2(o + dx + sg * 2.8)},${Y(15)} L${r2(o + dx + sg * 0.4)},${Y(15.2)} Z`, "pan");
      s += P2(pan2(0.2, 1), S) + P2(pan2(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
      return s + [0.6, 1.5, 2.4].map((t) => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join("");
    }
    __name(chale, "chale");
    function pelerine(c, ctx, [col, bord]) {
      const { view } = ctx, R = reperes(c), { cou: y, e } = R, S = tone(col, 0.8);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R, col, S);
      const L0 = r2(24 - e - 3.8), R0 = r2(24 + e + 3.8), B = r2(y + 10.6), Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      const d = `M${r2(24 - e - 0.4)},${Y(0.8)} Q24,${Y(-1.4)} ${r2(24 + e + 0.4)},${Y(0.8)} Q${r2(R0 - 0.6)},${Y(3)} ${R0},${B} Q24,${r2(B + 3.4)} ${L0},${B} Q${r2(L0 + 0.6)},${Y(3)} ${r2(24 - e - 0.4)},${Y(0.8)} Z`;
      let s = P2(d, col) + clip(`${c.uid}pl${view}`, d, `<rect x="${view === "se" ? 25.4 : 27.2}" y="${Y(-2)}" width="18" height="18" fill="${S}"/><path d="M0,${r2(B - 1.2)} Q24,${r2(B + 2.2)} 48,${r2(B - 1.2)} L48,${r2(B + 6)} L0,${r2(B + 6)} Z" fill="${bord}"/>` + [-10, -6, -2, 2, 6, 10].map((x) => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join("")) + P2(d, "none");
      if (view === "ne") s += capucheRabattue(`${c.uid}pl`, view, R, col, S);
      return s;
    }
    __name(pelerine, "pelerine");
    function etole(c, { view }, [col]) {
      const { cou: y, e } = reperes(c), S = tone(col, 0.84), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6, B = y + (view === "ne" ? 9.4 : 7.6), n = 6;
      const festons = /* @__PURE__ */ __name((x0, x1, yb) => {
        let d2 = "";
        const l = (x1 - x0) / n;
        for (let i = n - 1; i >= 0; i--) d2 += ` Q${r2(x0 + l * (i + 0.5))},${r2(yb + 1.6)} ${r2(x0 + l * i)},${r2(yb)}`;
        return d2;
      }, "festons");
      const d = `M${r2(24 - e - 0.4)},${r2(y + 0.6)} Q24,${r2(y - 1.8)} ${r2(24 + e + 0.4)},${r2(y + 0.6)} Q${r2(R0 - 0.6)},${r2(y + 2)} ${r2(R0)},${r2(B)}${festons(L0, R0, B)} Q${r2(L0 + 0.6)},${r2(y + 2)} ${r2(24 - e - 0.4)},${r2(y + 0.6)} Z`;
      const touffes = [-9, -5, -1, 3, 7, 10].map((dx, i) => `<path d="M${r2(24 + dx - 1)},${r2(y + 3 + i % 2 * 2)} q1,1.2 2,0" fill="none" stroke="${S}" stroke-width="0.6" stroke-linecap="round"/>`).join("");
      return P2(d, col, 0.9) + clip(`${c.uid}et${view}`, d, touffes + `<rect x="${view === "se" ? 25.6 : 27.4}" y="${r2(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P2(d, "none", 0.9);
    }
    __name(etole, "etole");
    function botte(fourree) {
      return (c, ctx, [col, fourrure], [x, y, dir, tilt]) => {
        const w = c.legW + 1.4, top = Math.max(y - 5.4, c.hip + 0.4), S = tone(col, 0.76);
        let s = `<rect x="${r2(x - w / 2)}" y="${r2(top)}" width="${r2(w)}" height="${r2(y - top + 1.6)}" rx="1.3" fill="${col}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r2(x + w / 2 - 1.8)}" y="${r2(top + 0.8)}" width="1.1" height="${r2(y - top)}" rx="0.5" fill="${S}"/>`;
        if (!fourree) {
          s += `<rect x="${r2(x - w / 2 + 0.9)}" y="${r2(top + 1.8)}" width="0.9" height="${r2(Math.max(0.8, y - top - 2.4))}" rx="0.45" fill="rgba(255,255,255,.6)"/><rect x="${r2(x - w / 2)}" y="${r2(top)}" width="${r2(w)}" height="1.5" rx="0.7" fill="${tone(col, 0.82)}" stroke="${OUT}" stroke-width="0.8"/>`;
        }
        s += shoe({ ...c, uid: `${c.uid}b`, shoe: col, shoeS: tone(col, 0.68), shoeH: fourree ? tone(col, 1.22) : "rgba(255,255,255,.75)" }, x, y, dir, tilt);
        if (fourree) {
          const a = x - w / 2 - 0.8, b = x + w / 2 + 0.8, t0 = top - 1.2, t1 = top + 1.6, l = (b - a) / 3;
          let d = `M${r2(a)},${r2(t1)} Q${r2(a - 0.3)},${r2(t0 + 0.5)} ${r2(a + 0.9)},${r2(t0)} Q${r2(x)},${r2(t0 - 0.6)} ${r2(b - 0.9)},${r2(t0)} Q${r2(b + 0.3)},${r2(t0 + 0.5)} ${r2(b)},${r2(t1)}`;
          for (let i = 2; i >= 0; i--) d += ` Q${r2(a + l * (i + 0.5))},${r2(t1 + 1.1)} ${r2(a + l * i)},${r2(t1)}`;
          s += P2(`${d} Z`, fourrure, 0.8) + [0.3, 0.7].map((f) => P2(`M${r2(a + (b - a) * f - 0.7)},${r2(t0 + 1)} q0.7,0.9 1.4,0`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(fourrure, 0.82)}"`)).join("");
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
    var { P: P2, E, L, clip, expression, arm, r2 } = require_troupe();
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
      return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})"><rect x="-1.5" y="${-len / 2}" width="3" height="${len}" rx="0.8" fill="${C.brass}" stroke="#3C2819" stroke-width="0.9"/><rect x="-1.1" y="${-len / 2 + 0.6}" width="0.8" height="${len - 1.2}" rx="0.4" fill="${C.brassH}"/><rect x="-1.95" y="${-len / 2 - 0.4}" width="3.9" height="2.1" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.8"/><line x1="-1.5" y1="0.8" x2="1.5" y2="0.8" stroke="${C.brassS}" stroke-width="0.7"/></g>`;
    }
    __name(spyglass, "spyglass");
    function heldGlass(x, y, rot, ext) {
      const seg = [[2.2, 1.15, C.brassS], [1.2 + 3 * ext, 1.5, C.brass], [4.8, 1.9, C.brass]];
      let s = "", x0 = 0;
      for (const [len, h, fill] of seg) {
        s += `<rect x="${r2(x0 - len)}" y="${-h}" width="${r2(len)}" height="${2 * h}" rx="0.5" fill="${fill}" stroke="#3C2819" stroke-width="0.9"/><rect x="${r2(x0 - len + 0.5)}" y="${r2(-h + 0.4)}" width="${r2(Math.max(len - 1, 0.2))}" height="0.6" rx="0.3" fill="${C.brassH}"/>`;
        x0 -= len;
      }
      s += `<rect x="${r2(x0 - 1.6)}" y="-2.35" width="2" height="4.7" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.9"/>`;
      return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${s}</g>`;
    }
    __name(heldGlass, "heldGlass");
    var twinkle = /* @__PURE__ */ __name((x, y, r) => P2(`M${x},${r2(y - r)} Q${r2(x + r * 0.2)},${r2(y - r * 0.2)} ${r2(x + r)},${y} Q${r2(x + r * 0.2)},${r2(y + r * 0.2)} ${x},${r2(y + r)} Q${r2(x - r * 0.2)},${r2(y + r * 0.2)} ${r2(x - r)},${y} Q${r2(x - r * 0.2)},${r2(y - r * 0.2)} ${x},${r2(y - r)} Z`, "#FFF6C8", 0.6), "twinkle");
    var COAT = "M15.5,32.5 Q24,29.8 32.5,32.5 L35,47.5 Q24,51 13,47.5 Z";
    var aster2 = {
      name: "Aster",
      uid: "as",
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
        let s = P2(COAT, C.coat);
        s += clip(`${c.uid}c`, COAT, `<rect x="${shadeX}" y="30" width="10" height="22" fill="${C.coatS}"/><path d="M13,47 Q24,50.2 35,47 L35,52 L13,52 Z" fill="${C.coatS}"/><rect x="14.6" y="34" width="1.4" height="12" rx="0.7" fill="${C.coatH}"/>`);
        s += P2(COAT, "none");
        if (view === "ne") {
          s += P2("M24,34 L24,49.4", "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s;
        }
        const o = view === "front" ? 24 : 21.5;
        s += P2(`M${o},33.2 L${o + (view === "se" ? -0.6 : 0)},49.6`, "none", 0.9);
        for (const y of [37, 41, 45]) s += E(o + 1.6, y, 0.75, 0.75, C.coatS, 0.6);
        s += P2(`M${view === "se" ? 15.8 : 16.2},42.5 L${view === "se" ? 19.2 : 20},42.3`, "none", 0.8);
        if (pose !== "action") s += spyglass(29.4, 44.8, -14);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") {
          return P2("M16.5,31 Q24,34.6 31.5,31 L32,34 Q24,37.6 16,34 Z", C.scarf) + P2("M28.5,34.6 L31.4,41.2 L28.4,41.6 L27,35.4 Z", C.scarf) + P2("M29,36 L30.6,40.4", "none", 0.6);
        }
        const kx = view === "se" ? 18.2 : 20.5;
        return P2("M16.5,31 Q24,34.8 31.5,31 L32,34 Q24,38 16,34 Z", C.scarf) + P2("M17.4,33.6 Q24,36.8 30.8,33.4", "none", 0.6) + P2(`M${kx},35.2 L${kx - 2},42 L${kx + 1.2},41.4 L${kx + 1.6},36 Z`, C.scarf) + E(kx + 0.6, 35.6, 1.9, 1.5, C.scarfS, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const tufts = P2("M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z", C.hair) + P2("M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z", C.hair);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z";
          s += (c.coiffe ? "" : tufts) + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P2(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="32" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C.hair}"/>`) + P2(back2, "none");
          s += P2("M17,11 Q24,7.6 31,11", "none", 0.8) + P2("M19.6,12.6 Q18.8,20 20.4,27.6", "none", 0.6) + P2("M24.4,11.8 Q25.2,19.4 24.2,28.4", "none", 0.6);
          s += L([18, 9.6], [23.4, 8.8], C.hairH, 1.3);
          if (!relevee(c)) s += P2("M14.6,11.6 Q6.6,10.8 6.4,19 Q8.6,16.8 12.6,17.8 Z", C.hair) + E(13.4, 13.4, 1.5, 1.4, C.scarf, 0.9);
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          return s;
        }
        const se = view === "se";
        const back = se ? "M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z" : "M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z";
        const fx = se ? 22.6 : 24;
        const face = `M${fx - (se ? 11.2 : 11.6)},21.6 a${se ? 11.2 : 11.6},10.4 0 1,0 ${2 * (se ? 11.2 : 11.6)},0 a${se ? 11.2 : 11.6},10.4 0 1,0 ${-2 * (se ? 11.2 : 11.6)},0 Z`;
        const bangs = se ? "M11.6,19 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L32.6,14.8 L31,18.6 L27.6,13.8 L24.4,18 L21.4,13.6 L18.2,17.8 L15.6,14.2 L13.4,19.4 Z" : "M12,18.6 Q13,8 24,8 Q35,8 36,18.6 L33,15 L31,19 L28,14 L25,18.4 L22,14 L19,18 L16,14.4 L14,19.2 Z";
        if (!relevee(c)) s += P2("M33.4,11.6 Q41.4,10.8 41.6,19 Q39.4,16.8 35.4,17.8 Z", C.hair) + E(34.6, 13.4, 1.5, 1.4, C.scarf, 0.9);
        if (!c.coiffe) s += tufts;
        s += P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="25" width="32" height="8" fill="${C.hairS}"/>`) + P2(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]] : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
        const cheeks = se ? [[15.2, 1.9], [28.2, 1.5]] : [[16.6, 2], [31.4, 2]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.15, C.cheek, 0)).join("") + fr.map(([x, y]) => E(x, y, 0.38, 0.38, C.freckle, 0)).join(""));
        s += P2(face, "none");
        s += P2(bangs, C.hair) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], C.hairH, 1.3);
        if (c.coiffe) s += c.coiffe(c, ctx, "tete");
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.35,
          brow: "#6B2620",
          browY: -4.1,
          browW: 1.05,
          mouth: [se ? 20.8 : 24, 27],
          mw: 1.7,
          mouthC: C.mouth,
          tongue: "#E07A72",
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.4)} Q${r2(mx + 0.3)},${r2(my + 1.2)} ${r2(mx + 1.6)},${my}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 12.6 : 13.4, 12.4],
          anger: [40, 6.8],
          zz: [36.4, 5.8]
        }, ctx);
        return s;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], n === 0 ? [37.4, 25.4] : [38.8, 27.4]) };
        }
        const ext = n === 0 ? 0 : 1;
        const near = arm(this, [15.4, 33.2], [12.6, 24.8], [10.2, 31.4]);
        const hip = arm(this, [32, 34], [32.6, 42.8], [37.4, 38.4]);
        return { expr: "neutre", eyeMode: "wink", left: "", right: hip, over: heldGlass(16.4, 22.8, 4, ext) + near + (ext ? twinkle(2.8, 18.6, 1.9) : "") };
      }
    };
    module.exports = aster2;
  }
});

// personnages/cannelle.js
var require_cannelle = __commonJS({
  "personnages/cannelle.js"(exports, module) {
    var { P: P2, E, L, limb, clip, expression, arm, r2 } = require_troupe();
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
      return limb(a, b, 1.5, C.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], C.copperH, 0.5) + `<g transform="rotate(${tilt} ${r2(b[0])} ${r2(b[1])})">${E(b[0], b[1], 3.3, 2.6, C.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, C.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, C.copperH, 0)}</g>`;
    }
    __name(ladle, "ladle");
    var DRESS = /* @__PURE__ */ __name((sway) => `M15.2,33 Q24,30.2 32.8,33 Q${r2(37 + sway)},42 ${r2(37.6 + sway)},53.6 Q${r2(24 + sway)},57.2 ${r2(10.4 + sway)},53.6 Q${r2(11 + sway)},42 15.2,33 Z`, "DRESS");
    var cannelle2 = {
      name: "Cannelle",
      uid: "ca",
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
        let s = P2(d, C.dress) + clip(`${c.uid}d`, d, `<rect x="${view === "se" ? 27.6 : 29.4}" y="30" width="12" height="30" fill="${C.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${C.dressS}"/><rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${C.dressH}"/>`) + P2(d, "none");
        if (view === "ne") {
          s += P2("M17,40.4 Q24,41.6 31,40.4", "none", 0.8);
          s += P2("M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z", C.apron, 0.9) + P2("M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z", C.apron, 0.9);
          s += P2("M23.4,41.6 L21.6,47.4 L23.4,47 Z", C.apron, 0.8) + P2("M24.6,41.6 L26.4,47.4 L24.6,47 Z", C.apron, 0.8) + E(24, 41, 1.3, 1.1, C.apronS, 0.8);
          s += ladle([33, 50.4], [11.6, 26.2], 25);
          return s;
        }
        const k = view === "se" ? -2 : 0;
        const ap = `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2 Q${r2(33.2 + k + sway)},47 ${r2(33 + k + sway)},53.4 Q${r2(24 + k + sway)},55.6 ${r2(15 + k + sway)},53.4 Q${r2(14.8 + k + sway)},47 ${17.6 + k},40.2 Z`;
        s += P2(ap, C.apron) + clip(`${c.uid}a`, ap, `<rect x="${28 + k}" y="34" width="8" height="24" fill="${C.apronS}"/>` + E(21 + k, 46.6, 1.3, 0.85, C.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, C.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, C.stain, 0)) + P2(ap, "none");
        s += P2(`M${17.6 + k},40.2 L${30.4 + k},40.2`, "none", 0.8);
        s += P2(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, C.apron, 0.8);
        s += limb([31.4, 33.8], [16.8, 47.2], 1.15, C.strap);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P2("M19.8,25 L28.2,25 L28.4,31.95 Q24,31.25 19.6,31.95 Z", C.skinS, 0) + P2("M19.6,31.95 Q24,31.25 28.4,31.95", "none");
        return P2("M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z", C.apron, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const spoon = limb([26.6, 9.2], [31.2, 4], 1.1, C.spoon) + `<g transform="rotate(40 32 3.2)">${E(32, 3.2, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.9, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
        const bun = E(24, 8.6, 5.4, 4.3, C.hair) + P2("M20.4,8.2 Q24,5.6 27.6,8.2", "none", 0.6);
        let s = "";
        if (view === "ne") {
          const back2 = "M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.8,30 35.8,32.8 Q32.6,34 28.6,32.8 Q27,28.4 24,28.4 Q21,28.4 19.4,32.8 Q15.4,34 12.2,32.8 Q11.2,30 12,22 Z";
          s += P2(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.6" cy="19.8" rx="13.8" ry="12.4" fill="${C.hair}"/>`) + P2(back2, "none");
          s += P2("M16.6,31.6 Q15.8,21.4 20.6,14.4", "none", 0.6) + P2("M24,26.4 Q23.4,21 24,15.4", "none", 0.6) + P2("M31.4,31.6 Q32.2,21.4 27.4,14.4", "none", 0.6);
          const curl = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="#3C2819" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.hair}" stroke-width="0.7" stroke-linecap="round"/>`, "curl");
          s += curl("M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31");
          s += L([14.6, 17.6], [16.8, 13.6], C.hairH, 1.2);
          s += limb([26.6, 9.6], [31.2, 3.8], 1.1, C.spoon) + `<g transform="rotate(40 32 3)">${E(32, 3, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.7, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
          s += E(24, 10.4, 5.4, 4.4, C.hair) + P2("M20.4,10.4 Q24,7.6 27.6,10.4", "none", 0.6) + L([21, 8.8], [23.6, 7.9], C.hairH, 1.1);
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
        s += P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P2(back, "none");
        const cheeks = se ? [[15.6, 2.2], [28.6, 1.8]] : [[16.4, 2.6], [31.6, 2.6]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.8, r * (ctx.expr === "gene" ? 1.25 : 1), ctx.expr === "gene" ? 2 : 1.6, C.cheek, 0)).join(""));
        s += P2(face, "none");
        s += P2(bangs, C.hair) + L(se ? [14.6, 12.6] : [15.8, 12.6], se ? [19.4, 10.6] : [21, 10.6], C.hairH, 1.2);
        const outer = se ? [[14.6, 1]] : [[16.2, -1], [31.8, 1]];
        for (const [x, d] of outer) s += L([x, 23.4], [x + (d < 0 ? -1 : 1) * 1.1, 24.1], C.nose, 0.5);
        const nx = se ? 20.8 : 24;
        s += P2(se ? `M${nx + 0.4},24.2 Q${nx - 1.4},25.6 ${nx + 0.6},26` : `M${nx - 0.9},25.5 Q${nx},26.3 ${nx + 0.9},25.5`, "none", 0.8).replace('stroke="#3C2819"', `stroke="${C.nose}"`);
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.4], [25.2, 22.8, 1.25]] : [[19.4, 22.8, 1.45], [28.6, 22.8, 1.45]],
          ry: 2.1,
          brow: C.brow,
          browY: -4.4,
          browW: 0.95,
          mouth: [se ? 21 : 24, 27.8],
          mw: 2.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.7)},${r2(my + 0.3)} Q${mx},${r2(my + 1.4)} ${r2(mx + 1.7)},${r2(my + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 26.8,
          temple: [se ? 12.8 : 13.6, 13.4],
          anger: [38, 11],
          zz: [35.8, 6.2]
        }, ctx);
        return s;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [33, 35], n === 0 ? [38.6, 26.4] : [40, 28.4]) };
        }
        const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6];
        const bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
        const elbow = [9.6, 40.6];
        const left = arm(this, [15, 35], [14.8, 44.4], elbow);
        const right = ladle([hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand);
        return { expr: "rire", left, right };
      }
    };
    module.exports = cannelle2;
  }
});

// personnages/galet.js
var require_galet = __commonJS({
  "personnages/galet.js"(exports, module) {
    var { OUT, P: P2, E, L, limb, clip, expression, arm, r2 } = require_troupe();
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
      return `<g transform="rotate(${rot} ${r2(h[0])} ${r2(h[1])})">` + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, C.wood) + `<rect x="${r2(h[0] - 2.4)}" y="${r2(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${C.wood}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r2(h[0] + 0.9)}" y="${r2(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${C.woodS}"/></g>`;
    }
    __name(mallet, "mallet");
    var chisel = /* @__PURE__ */ __name((a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, C.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, C.steel), "chisel");
    var SMOCK = "M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z";
    var BEARD = "M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z";
    var galet2 = {
      name: "Galet",
      uid: "ga",
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
        let s = P2(SMOCK, C.smock) + clip(`${c.uid}s`, SMOCK, `<rect x="${view === "se" ? 26.2 : 27.8}" y="34" width="9" height="20" fill="${C.smockS}"/>`) + P2(SMOCK, "none");
        s += P2("M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z", C.belt, 0.8);
        if (view === "ne") return s + P2("M24,38 L24,52", "none", 0.6);
        const k = view === "se" ? -1.6 : 0;
        s += `<rect x="${r2(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${C.brass}" stroke="${OUT}" stroke-width="0.6"/>`;
        return s + chisel([30.2 + k, 44.6], [31, 51.4]);
      },
      head(c, ctx) {
        const { view } = ctx;
        const beanie = "M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z";
        const hole = /* @__PURE__ */ __name((x, y) => E(x, y, 1.1, 0.85, "#5E2A15", 0.6) + P2(`M${r2(x - 0.6)},${r2(y + 0.3)} Q${x},${r2(y - 1.6)} ${r2(x + 0.7)},${r2(y + 0.2)}`, C.white, 0.5), "hole");
        const woolCap = /* @__PURE__ */ __name((k2 = 0) => `<g transform="translate(${k2} 0)">` + P2("M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z", C.wool, 0.8) + P2(beanie, C.wool) + clip(`${ctx.id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${C.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${C.wool}"/>`) + P2(beanie, "none") + hole(18.4, 9.8) + hole(29.6, 11.6) + P2("M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z", C.wool, 0.9) + [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${x},${r2(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r2(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${C.woolS}" stroke-width="0.5"/>`).join("") + L([13, 15.4], [17.8, 14.4], C.woolH, 0.8) + "</g>", "woolCap");
        let s = "";
        if (view === "ne") {
          const back = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z";
          s += E(12.4, 23, 1.7, 2.3, C.skin) + E(35.6, 23, 1.7, 2.3, C.skin);
          const tuft = /* @__PURE__ */ __name((m) => {
            const d = "M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z";
            const g = /* @__PURE__ */ __name((inner) => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`, "g");
            return g(P2(d, C.beard) + clip(`${ctx.id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${C.beardS}"/><path d="M8,34.6 Q14,36.4 22,34 L22,40 L8,40 Z" fill="${C.beardS}"/>`) + P2(d, "none") + P2("M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35", "none", 0.5) + L([12.8, 31], [13.2, 33.2], C.beardH, 0.7));
          }, "tuft");
          s += tuft(1) + tuft(-1);
          s += P2(back, C.skin) + clip(`${c.uid}h`, back, `<rect x="27" y="8" width="12" height="22" fill="${C.skinS}"/><path d="M8,24.4 Q24,28.2 40,24.4 L40,34 L8,34 Z" fill="${C.white}"/><path d="M8,28.6 Q24,31.8 40,28.6 L40,34 L8,34 Z" fill="${C.whiteS}"/>`) + P2(back, "none");
          s += P2("M11.2,24.8 Q24,28.6 36.8,24.8", "none", 0.6) + P2("M16,27.4 Q16.6,29 18.2,29.6", "none", 0.5) + P2("M30.4,27.4 Q30,29 28.6,29.6", "none", 0.5);
          s += P2("M24.6,5.2 Q25.2,2.4 22.8,1.8 Q23,3.6 21.8,5 Z", C.wool, 0.8) + P2("M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", C.wool) + P2("M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z", C.wool, 0.9) + E(26.6, 9.6, 1.1, 0.85, "#5E2A15", 0.6) + P2("M26,9.9 Q26.6,8 27.3,9.8", C.white, 0.5);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        s += se ? E(35, 23.2, 1.7, 2.3, C.skin) : E(11.8, 22.8, 1.7, 2.3, C.skin) + E(36.2, 22.8, 1.7, 2.3, C.skin);
        s += P2(sx("M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z"), C.white, 0.8) + P2(sx("M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z"), C.white, 0.8);
        const cheeks = se ? [[15.2, 1.6], [28.2, 1.3]] : [[16.6, 1.7], [31.4, 1.7]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${C.skinS}"/>` + cheeks.map(([x, r]) => E(x, 25.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + L([15.6 + k, 19.4], [17.6 + k, 19.8], C.skinS, 0.5) + L([30.4 + k, 19.8], [32.4 + k, 19.4], C.skinS, 0.5));
        s += P2(face, "none");
        s += woolCap(k);
        const beard = sx(BEARD);
        s += P2(beard, C.beard) + clip(`${c.uid}b`, beard, `<rect x="${se ? 26 : 27.6}" y="24" width="10" height="26" fill="${C.beardS}"/>` + [18.6, 21.6, 24.6, 27.4].map((x) => `<path d="M${r2(x + k)},31 Q${r2(x + k - 0.6)},36 ${r2(x + k + 0.4)},41" fill="none" stroke="${C.beardS}" stroke-width="0.5"/>`).join("") + `<rect x="${r2(16.6 + k)}" y="29" width="1.1" height="7" rx="0.5" fill="${C.beardH}"/>`) + P2(beard, "none");
        const mx = se ? 20.8 : 24;
        s += P2(`M${r2(mx - 4.2)},27.2 Q${r2(mx - 2.4)},25 ${mx},26.2 Q${r2(mx + 2.4)},25 ${r2(mx + 4.2)},27.2 Q${r2(mx + 2.2)},28.4 ${mx},27.4 Q${r2(mx - 2.2)},28.4 ${r2(mx - 4.2)},27.2 Z`, C.beardH, 0.8);
        s += E(se ? 20.4 : 24, 24.6, 1.5, 1.3, C.nose, 0.8) + E(se ? 19.9 : 23.5, 24.2, 0.45, 0.35, "#FFFFFF", 0);
        s += expression({
          eyes: se ? [[17.2, 21.4, 1.4], [25.2, 21.4, 1.2]] : [[19.4, 21.4, 1.45], [28.6, 21.4, 1.45]],
          ry: 2.1,
          brow: C.white,
          browY: -3.4,
          browW: 1.9,
          // au repos : les yeux mi-clos sous les sourcils broussailleux, la bouche cachée sous la moustache (« Hm. »)
          restEyes: "sleepy",
          mouth: [mx, 28.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((x, y) => `M${r2(x - 0.8)},${r2(y + 0.3)} L${r2(x + 0.8)},${r2(y + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 25.2,
          temple: [se ? 9.6 : 8.8, 18.6],
          anger: [39.4, 6.6],
          zz: [37.4, 3.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          const h = n === 0 ? [36.4, 30.8] : [37.6, 32.4];
          return { open: true, right: mallet(h, 180) + arm(this, [31.6, 38.8], h) };
        }
        const block = P2("M3.6,47.8 L13.4,47.8 L13.4,57.4 L3.6,57.4 Z", C.stone) + P2("M3.6,47.8 L5.4,45.8 L15.2,45.8 L13.4,47.8 Z", "#C2BDB2", 0.9) + P2("M13.4,47.8 L15.2,45.8 L15.2,55.4 L13.4,57.4 Z", C.stoneS, 0.9);
        const rune = n ? `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>` : "";
        const runeLine = `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${n ? "#E9FFFF" : OUT}" stroke-width="${n ? 0.9 : 0.6}" stroke-linecap="round"/>`;
        const left = chisel([14.4, 46.8], [11.4, 49.8]) + arm(this, [16.4, 38.8], [14.6, 46.6], [12.2, 42.4]);
        const sparks = n ? [[10.6, 43.4, 9.2, 41.6], [13.2, 42.6, 13.6, 40.4], [8.6, 45.8, 6.6, 45]].map(([a, b, x, y]) => L([a, b], [x, y], "#F2C94C", 0.8)).join("") + `<g transform="rotate(-12 6.4 41.4)">${E(6.4, 41.4, 1.1, 0.8, OUT, 0)}${L([7.35, 41.4], [7.35, 37.8], OUT, 0.6)}<path d="M7.35,37.8 Q9,38.4 8.6,39.8" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>` : "";
        const right = n === 0 ? mallet([34, 30.4], 160) + arm(this, [31.6, 38.8], [34, 30.4], [37, 36.6]) : mallet([19.6, 44.6], 118) + arm(this, [31.6, 38.8], [19.6, 44.6], [33.4, 46.2]);
        return { expr: n ? "content" : "neutre", left: block + rune + runeLine + left, right: "", over: right + sparks };
      }
    };
    module.exports = galet2;
  }
});

// personnages/melisse.js
var require_melisse = __commonJS({
  "personnages/melisse.js"(exports, module) {
    var { OUT, P: P2, E, L, clip, expression, arm, r2 } = require_troupe();
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
    var crescent = /* @__PURE__ */ __name((x, y, r, fill = C.moon) => `<path d="M${r2(x)},${r2(y - r)} A${r} ${r} 0 1 0 ${r2(x)},${r2(y + r)} A${r2(r * 0.72)} ${r} 0 1 1 ${r2(x)},${r2(y - r)} Z" fill="${fill}"/>`, "crescent");
    var posy = /* @__PURE__ */ __name((x, y) => [[0, 0, C.lavender], [1.6, -0.6, C.pink], [3, 0.2, C.yellow], [1.2, 1, C.lavender]].map(([dx, dy, f]) => E(x + dx, y + dy, 0.85, 0.85, f, 0.5)).join(""), "posy");
    function box(x, y, open = false) {
      const lid = open ? P2(`M${r2(x - 3.7)},${r2(y - 2.2)} L${r2(x + 3.7)},${r2(y - 2.2)} L${r2(x + 2.8)},${r2(y - 5.2)} L${r2(x - 2.8)},${r2(y - 5.2)} Z`, C.ironS, 0.8) : `<rect x="${r2(x - 3.9)}" y="${r2(y - 3)}" width="7.8" height="1.6" rx="0.4" fill="${C.ironH}" stroke="${OUT}" stroke-width="0.8"/>`;
      return `<rect x="${r2(x - 3.7)}" y="${r2(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${C.iron}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r2(x + 1.6)}" y="${r2(y - 1.8)}" width="1.6" height="3.8" fill="${C.ironS}"/>` + lid + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.35, 0.35, C.ironH, 0)).join("") + (open ? "" : `<rect x="${r2(x - 0.6)}" y="${r2(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${C.yellow}" stroke="${OUT}" stroke-width="0.5"/>`);
    }
    __name(box, "box");
    var DRESS = "M16.2,33 Q24,30.4 31.8,33 L34.6,53.6 Q24,56 13.4,53.6 Z";
    var SHAWL = "M15.2,32.6 Q24,29.6 32.8,32.6 L34.2,40.8 L30.4,38.6 Q24,41.6 17.6,38.6 L13.8,40.8 Z";
    var SHAWL_BACK = "M15.2,32.6 Q24,29.6 32.8,32.6 L33.6,36.2 L24,47.4 L14.4,36.2 Z";
    var melisse2 = {
      name: "Mélisse",
      uid: "me",
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
        let s = P2(DRESS, C.dress) + clip(`${c.uid}d`, DRESS, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="10" height="28" fill="${C.dressS}"/><path d="M12,52.6 Q24,55.2 36,52.6 L36,58 L12,58 Z" fill="${C.dressS}"/>`) + P2(DRESS, "none");
        if (c.noShawl) return s;
        const sh = view === "ne" ? SHAWL_BACK : SHAWL;
        const moons = view === "ne" ? [[19.6, 36.2], [24, 41.4], [28.4, 36.2], [24, 34.2]] : [[16.6, 36.4], [31.4, 36.4], [20.4, 35], [27.6, 35]];
        s += P2(sh, C.shawl) + clip(`${c.uid}s`, sh, `<rect x="${view === "se" ? 26.6 : 28}" y="28" width="9" height="22" fill="${C.shawlS}"/>` + moons.map(([x, y]) => crescent(x, y, 1)).join("")) + P2(sh, "none");
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
        const crown = /* @__PURE__ */ __name((m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">` + P2("M15.4,12.2 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.2 Q24,14 15.4,12.2 Z", C.straw) + P2("M15.6,9.6 Q24,11.4 32.4,9.6 L32.6,12.2 Q24,14 15.4,12.2 Z", C.band, 0.8) + posy(16.8, 9.8) + L([18, 6], [21.4, 4.6], C.strawH, 1) + "</g>", "crown");
        let s = "";
        if (view === "ne") {
          const back2 = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.6,29.4 35.4,32.2 Q30,33.8 24,33.8 Q18,33.8 12.6,32.2 Q10.4,29.4 11.2,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          s += P2(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="8" width="34" height="26" fill="${C.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${C.hair}"/>`) + P2(back2, "none");
          s += P2("M18,17 Q17.4,24 19,30.6", "none", 0.6) + P2("M29.6,17 Q30.4,24 28.8,30.8", "none", 0.6) + P2("M24,18 Q24.4,25 23.4,31.4", "none", 0.6);
          for (const [x, y] of [[22.6, 31.8], [20.4, 33.2], [18.2, 34.4]]) s += E(x, y, 1.6, 1.45, C.hair, 0.8);
          s += L([22, 31.2], [21, 31.9], C.hairH, 0.6);
          return s + brim(-1) + crown(-1);
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const back = "M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z";
        const bangs = sx("M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.4 L23,15.2 Q15,15.6 12.4,20 Z");
        s += P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P2(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="5.6" fill="${C.skinS}" opacity="0.6"/>` + cheeks.map(([x, r]) => E(x, 26.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.95, C.cheek, 0)).join(""));
        s += P2(face, "none");
        s += P2(bangs, C.hair) + L([16 + k, 15.2], [20.6 + k, 14.4], C.hairH, 0.9);
        s += `<g transform="translate(${k} 0)">${brim()}${crown()}</g>`;
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.5], [25.2, 22.8, 1.3]] : [[19.4, 22.8, 1.55], [28.6, 22.8, 1.55]],
          ry: 2.3,
          brow: C.hairS,
          browY: -4.1,
          browW: 1,
          // au repos : paupières lourdes et un sourire en coin, mystérieuse et tranquille
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.4],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.3)} Q${r2(mx + 0.2)},${r2(my + 1.2)} ${r2(mx + 1.4)},${r2(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.4,
          temple: [se ? 11.6 : 10.8, 22.8],
          anger: [40.4, 6],
          zz: [36.4, 7.6]
        }, ctx);
        return s;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34.4], n === 0 ? [37.4, 25.8] : [38.8, 27.8]) };
        }
        const seeds = n ? [[22.4, 37.2, 0.7], [25.6, 35.6, 0.8], [23.8, 33.6, 0.6], [20.6, 34.4, 0.55], [27.6, 33, 0.5]].map(([x, y, r]) => E(x, y, r * 2.2, r * 2.2, C.glow, 0).replace("fill=", 'fill-opacity="0.45" fill=') + E(x, y, r, r, C.yellow, 0.4)).join("") + crescent(31, 36.6, 1.5, C.glow) : "";
        const left = box(24, 43.6, n === 1) + seeds + arm(this, [16, 34.4], [20.4, 43.4], [12.8, 40.6]);
        const right = arm(this, [32, 34.4], [27.6, 43.4], [35.2, 40.6]);
        return { expr: n ? "content" : "neutre", left, right };
      }
    };
    module.exports = melisse2;
  }
});

// personnages/ondin.js
var require_ondin = __commonJS({
  "personnages/ondin.js"(exports, module) {
    var { OUT, P: P2, E, L, limb, clip, expression, arm, bareFoot, r2 } = require_troupe();
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
    var drop = /* @__PURE__ */ __name((x, y, r) => P2(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, C.water, 0.6), "drop");
    function rod(h, side = 1) {
      const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.6, h[1] + 9];
      return limb(h, j, 1.1, C.wood) + limb(j, b, 1.1, C.wood) + limb(j, tip, 1.2, C.wood) + `<g transform="rotate(${side * -35} ${r2(b[0])} ${r2(b[1])})">${E(b[0] + side * 1.1, b[1], 1.3, 0.65, C.leaf, 0.6)}</g>`;
    }
    __name(rod, "rod");
    function jar(x, y) {
      const d = `M${r2(x - 1.6)},${r2(y - 1.6)} L${r2(x + 1.6)},${r2(y - 1.6)} Q${r2(x + 2.1)},${r2(y - 1.2)} ${r2(x + 2)},${y} L${r2(x + 1.9)},${r2(y + 1.9)} Q${x},${r2(y + 2.6)} ${r2(x - 1.9)},${r2(y + 1.9)} L${r2(x - 2)},${y} Q${r2(x - 2.1)},${r2(y - 1.2)} ${r2(x - 1.6)},${r2(y - 1.6)} Z`;
      return `<path d="${d}" fill="${C.glass}" fill-opacity="0.65" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r2(x - 1.1)},${r2(y - 0.6)} L${r2(x - 1.1)},${r2(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r2(x - 1.3)}" y="${r2(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${C.cork}" stroke="${OUT}" stroke-width="0.7"/>`;
    }
    __name(jar, "jar");
    var COAT = "M15.8,37.4 Q24,35 32.2,37.4 L35,52.4 Q24,55 13,52.4 Z";
    var CAP = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z";
    var CAP_DOS = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.8,14.6 Q24,18 11.2,14.6 Q11.4,14.1 12,13.8 Z";
    function cap(uid, d = CAP) {
      const stripes = [20, 28, 36, 44].map((x) => `<path d="M${x},0 L${x + 2.6},0 L${x - 5.4},22 L${x - 8},22 Z" fill="${C.cream}"/>`).join("");
      return P2(d, C.cap) + clip(`${uid}k`, d, `<rect x="8" y="0" width="38" height="22" fill="${C.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${C.cap}"/>${stripes}`) + P2(d, "none") + E(41.6, 24.4, 2.2, 2.2, C.cream) + E(42.2, 25.2, 0.8, 0.7, "#DCCDB5", 0);
    }
    __name(cap, "cap");
    var ondin2 = {
      name: "Ondin",
      uid: "on",
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
        let s = P2(COAT, C.coat) + clip(`${c.uid}c`, COAT, `<rect x="${se ? 26.2 : 27.8}" y="34" width="10" height="22" fill="${C.coatS}"/><path d="M12,52 Q24,54.8 36,52 L36,57 L12,57 Z" fill="${C.coatS}"/><rect x="14.6" y="39" width="1.3" height="11" rx="0.65" fill="${C.coatH}"/>`) + P2(COAT, "none");
        if (view === "ne") {
          s += P2(`M24,${relevee(c) ? 38 : 42.4} L24,53.8`, "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s + cord("M13.9,46.4 Q24,48.6 34.1,46.4", 1.1, C.rope);
        }
        const k = se ? -1.6 : 0;
        s += P2(`M${17 + k},37.2 Q${21 + k},37.4 ${24 + k},40.2 L${20.6 + k},42 Z`, C.coatS, 0.8) + P2(`M${31 + k},37.2 Q${27 + k},37.4 ${24 + k},40.2 L${27.4 + k},42 Z`, C.coatS, 0.8);
        s += P2(`M${24 + k},40 L${24 + k + (se ? -0.6 : 0)},53.8`, "none", 0.9);
        for (const y of [42.6, 50.4]) s += `<rect x="${r2(24.5 + k)}" y="${y - 0.5}" width="2.4" height="1" rx="0.5" fill="${C.wood}" stroke="${OUT}" stroke-width="0.5"/>`;
        s += cord("M13.9,45.6 Q24,47.6 34.1,45.6", 1.1, C.rope);
        s += cord(`M${20.2 + k},47 L${19.4 + k},49.6`, 0.8, C.rope) + cord(`M${20.8 + k},47 L${21.4 + k},49.4`, 0.8, C.rope) + E(20.5 + k, 46.9, 1.1, 0.9, C.rope, 0.7);
        s += L([27.6 + k, 47.1], [27.6 + k, 48.4], OUT, 0.6) + jar(27.6 + k, 50.6);
        return s;
      },
      // de dos : la nuque (dans l'ombre) entre les boucles, rentrée sous le col du ciré
      neck(c, { view }) {
        if (view !== "ne") return "";
        return P2("M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z", C.skinS, 0) + P2("M19.6,36.55 Q24,35.85 28.4,36.55", "none");
      },
      head(c, ctx) {
        const { view } = ctx;
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 L35.6,33.2 L34,32 L33,34 L31.4,32.4 L30,34 L28.6,32.4 L27.2,33.8 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.8 L19.4,32.4 L18,34 L16.6,32.4 L15,34 L14,32 L12.4,33.2 L12,31 Q10.6,28 11,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          if (!relevee(c)) {
            s += P2(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${C.hair}"/>`) + P2(back2, "none");
            s += P2("M18.4,19 Q17.8,25.4 19.2,31.4", "none", 0.6) + P2("M28.8,19 Q29.8,25.4 28.6,31.4", "none", 0.6);
          }
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          else s += `<g transform="translate(48 0) scale(-1 1)">${cap(c.uid, CAP_DOS)}</g>` + P2("M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z", C.cream, 0.9);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.6,26.4 35.6,27.2 L14,27.2 Q12.2,26.4 12,21.6 Z" : "M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q36.8,25.4 35,26.6 L13,26.6 Q11.2,25.4 11.4,21 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.4,15.8 31.6,15.8 Q30,18 27.6,17.6 Q26.4,15.4 24,15.6 Q21.6,15.4 20.4,17.6 Q18,18 16.4,15.8 Q13.6,15.8 12,19.4 Z");
        if (!c.coiffe) s += (se ? "" : P2("M11.8,17.4 Q8.4,18 8.8,21.2 Q10.2,19.6 11.8,19.8 Z", C.hair)) + P2(sx("M36.2,17.4 Q39.6,18 39.2,21.2 Q37.8,19.6 36.2,19.8 Z"), C.hair);
        s += P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${C.hairS}"/>`) + P2(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15, 2], [28.2, 1.6]] : [[16.4, 2.2], [31.6, 2.2]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.2, C.cheek, 0)).join(""));
        s += P2(face, "none");
        s += P2(bangs, C.hair) + L([16.4 + k, 14.6], [21.2 + k, 13.9], C.hairH, 1);
        s += c.coiffe ? c.coiffe(c, ctx, "tete") : `<g transform="translate(${k} 0)">${cap(c.uid)}${P2("M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z", C.cream, 0.9)}</g>`;
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.65], [25.2, 22.6, 1.45]] : [[19.4, 22.6, 1.7], [28.6, 22.6, 1.7]],
          ry: 2.5,
          brow: C.brow,
          browY: -4.3,
          browW: 1,
          // au repos : les yeux mi-clos (la brume le tient encore), une toute petite bouche
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 0.9)},${r2(my + 0.4)} Q${mx},${r2(my + 1.1)} ${r2(mx + 0.9)},${r2(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 13.4 : 12.4, 22.6],
          anger: [8.4, 8.6],
          zz: [6.6, 6.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          return { open: true, left: rod(this.hands[0], -1) + arm(this, this.shoulders[0], this.hands[0]), right: arm(this, [31.6, 38.8], n === 0 ? [36.6, 30.6] : [38, 32.6]) };
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
    module.exports = ondin2;
  }
});

// personnages/rivet.js
var require_rivet = __commonJS({
  "personnages/rivet.js"(exports, module) {
    var { P: P2, E, L, limb, clip, expression, arm, r2 } = require_troupe();
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
    var lens = /* @__PURE__ */ __name((x, y, r) => E(x, y, r, r, C.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, C.glass, 0.6) + glint(`M${r2(x - r * 0.42)},${r2(y - r * 0.1)} Q${r2(x - r * 0.36)},${r2(y - r * 0.4)} ${r2(x - r * 0.08)},${r2(y - r * 0.44)}`, 0.5), "lens");
    function gear(x, y, r, rot) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 + rot * Math.PI / 180;
        const rr = i % 2 ? r * 0.76 : r;
        pts.push(`${r2(x + rr * Math.cos(a))},${r2(y + rr * Math.sin(a))}`);
      }
      return P2(`M${pts.join(" L")} Z`, C.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, C.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, "#3C2819", 0);
    }
    __name(gear, "gear");
    var screwdriver = /* @__PURE__ */ __name((a, b) => limb([a[0] + (b[0] - a[0]) * 0.35, a[1] + (b[1] - a[1]) * 0.35], b, 0.6, C.steel) + limb(a, [a[0] + (b[0] - a[0]) * 0.4, a[1] + (b[1] - a[1]) * 0.4], 1.6, C.red), "screwdriver");
    var TORSO = "M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z";
    var APRON = /* @__PURE__ */ __name((k) => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${32.2 + k},52 Q${24 + k},53.8 ${15.8 + k},52 L${17.4 + k},40 Z`, "APRON");
    var rivet2 = {
      name: "Rivet",
      uid: "ri",
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
        let s = P2(TORSO, C.shirt) + clip(`${c.uid}t`, TORSO, `<rect x="${view === "se" ? 26.4 : 27.6}" y="30" width="10" height="20" fill="${C.shirtS}"/>`) + P2(TORSO, "none");
        if (view === "ne") {
          s += limb([18.2, 32.8], [29, 41.2], 1.5, C.leather) + limb([29.8, 32.8], [19, 41.2], 1.5, C.leather);
          s += P2("M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z", C.leather, 0.8) + P2("M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z", C.leather, 0.8) + limb([23.6, 41.8], [22.4, 45.4], 0.9, C.leather) + limb([24.4, 41.8], [25.8, 45.2], 0.9, C.leather) + E(24, 41.4, 1, 0.9, C.leatherS, 0.8);
          return s;
        }
        const k = view === "se" ? -1.8 : 0;
        const ap = APRON(k);
        s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], C.leatherS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], C.leatherS, 1.2);
        s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, C.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, C.red);
        s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${C.wood}" stroke="#3C2819" stroke-width="0.6"/>`;
        s += P2(ap, C.leather) + clip(`${c.uid}a`, ap, `<rect x="${27.6 + k}" y="34" width="8" height="22" fill="${C.leatherS}"/><rect x="${18.4 + k}" y="35.8" width="1" height="15" rx="0.5" fill="${C.leatherH}"/>`) + P2(ap, "none");
        s += `<rect x="${19.2 + k}" y="43.2" width="9.6" height="5.6" rx="0.8" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.8"/><path d="M${20 + k},44.2 L${28 + k},44.2" stroke="${C.leatherH}" stroke-width="0.5" stroke-dasharray="0.8 0.6"/>` + L([24 + k, 43.4], [24 + k, 48.6], "#3C2819", 0.5);
        s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.7"/>` + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, C.pencil);
        for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += E(x + k, y, 0.45, 0.45, C.brass, 0.4);
        s += L([17.4 + k, 40.6], [30.6 + k, 40.6], C.leatherS, 0.8);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P2("M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z", C.skinS, 0) + P2("M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z", C.collar, 0.8);
        const k = view === "se" ? -1.6 : 0;
        return P2(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, C.collar, 0.8) + P2(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, C.collar, 0.8);
      },
      head(c, ctx, act) {
        const { view } = ctx;
        const cowlick = P2("M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z", C.grey, 0.9) + L([23.4, 7], [24.2, 4.2], C.greyS, 0.5);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z";
          s += cowlick + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P2(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${C.hair}"/>`) + P2(back2, "none");
          s += P2("M17.6,15 Q16.8,21 18.4,28.6", "none", 0.6) + P2("M24.6,15 Q25.4,21 24.2,28.4", "none", 0.6) + P2("M31,16.4 Q32,22 30.6,29.2", "none", 0.6) + L([16.6, 10.2], [21.6, 8.6], C.hairH, 1.2);
          s += P2("M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z", C.strap, 0.8) + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${C.brass}" stroke="#3C2819" stroke-width="0.6"/>`;
          s += c.coiffe ? c.coiffe(c, ctx, "cheveux") + c.coiffe(c, ctx, "tete") : pencil([15.4, 20.6], [9.2, 19.2]);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z" : "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z");
        const grey = sx("M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z");
        s += cowlick + P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="6" fill="${C.hairS}"/>`) + P2(back, "none");
        s += se ? E(35, 23.2, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([33.4, 20.8], [39.2, 19.2])) : E(11.8, 22.8, 1.5, 2.1, C.skin) + E(36.2, 22.8, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([14, 20.8], [7.8, 19.4]) + pencil([34, 20.8], [40.2, 19.4]));
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.5 : 1.05, C.cheek, 0)).join(""));
        s += P2(face, "none");
        s += P2(bangs, C.hair) + P2(grey, C.grey, 0.8) + L([15 + k, 12.6], [20 + k, 11], C.hairH, 1.2) + L([26.4 + k, 12.2], [29.4 + k, 12.6], "#F2EFEA", 0.9);
        if (c.coiffe) s += c.coiffe(c, ctx, "cheveux");
        s += P2(se ? "M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z" : "M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z", C.strap, 0.8);
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
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.8,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : absorbé, un demi-sourire (il pense déjà à autre chose)
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.6)} L${r2(mx + 0.7)},${r2(my + 0.6)} Q${r2(mx + 1.3)},${r2(my + 0.6)} ${r2(mx + 1.6)},${r2(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 13 : 13.6, 20.4],
          anger: [40.6, 7.4],
          zz: [37, 8.4]
        }, ctx);
        return s;
      },
      pose({ pose, n, view }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], n === 0 ? [37.4, 25.4] : [38.8, 27.4]) };
        }
        const [x, y] = [view === "se" ? 25.2 : 28.6, 22.8];
        const eye = n === 0 ? E(x, y, 2.3, 3, "#2A2420", 0) + E(x + 0.8, y - 1.3, 0.9, 0.9, "#FFFFFF", 0) + E(x - 0.7, y + 1.3, 0.45, 0.45, "#FFFFFF", 0) : P2(`M${x - 2.6},${y + 1.2} Q${x},${y - 2} ${x + 2.6},${y + 1.2}`, "none", 1.4);
        const loupe = L([31.4, 13.6], [31, 19.4], C.brassS, 0.9) + E(x, y, 3.6, 3.6, C.brass, 0.9) + E(x, y, 2.9, 2.9, C.skin, 0) + eye + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${C.glass}" fill-opacity="0.35"/>` + glint(`M${r2(x - 1.8)},${r2(y - 0.6)} Q${r2(x - 1.6)},${r2(y - 1.8)} ${r2(x - 0.4)},${r2(y - 2.1)}`, 0.6) + E(x, y, 2.9, 2.9, "none", 0.8);
        const g = gear(36.2, 25, 2.8, n ? 22.5 : 0) + (n ? L([39.8, 21], [41.2, 19.6], "#3C2819", 0.6) + L([40.6, 24.2], [42.4, 23.8], "#3C2819", 0.6) + L([37.8, 20.6], [38.2, 18.8], "#3C2819", 0.6) : "");
        const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
        const left = arm(this, [16, 34], [14.4, 45]) + screwdriver([14.4, 44.2], [12.8, 50.2]);
        if (view === "ne") return { expr: n ? "rire" : "neutre", left, right: "", over: g + right };
        return { expr: n ? "rire" : "neutre", lensDown: true, left, right: "", over: loupe + g + right };
      }
    };
    module.exports = rivet2;
  }
});

// personnages/sylve.js
var require_sylve = __commonJS({
  "personnages/sylve.js"(exports, module) {
    var { OUT, P: P2, E, L, clip, expression, arm, bareFoot, r2 } = require_troupe();
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
    var leaf = /* @__PURE__ */ __name((x, y, len, w, rot, fill = C.leaf) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">` + P2(`M0,0 Q${w},${r2(len / 2)} 0,${len} Q${-w},${r2(len / 2)} 0,0 Z`, fill, 0.7) + L([0, 0.6], [0, len - 0.8], C.leafS, 0.4) + "</g>", "leaf");
    var vine = /* @__PURE__ */ __name((d, w = 1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.vine}" stroke-width="${w}" stroke-linecap="round"/>`, "vine");
    var twig = /* @__PURE__ */ __name((a, b, f) => L(a, b, OUT, 1.6) + L(f[0], f[1], OUT, 1.3) + L(a, b, C.twig, 0.8) + L(f[0], f[1], C.twig, 0.6), "twig");
    var feather = /* @__PURE__ */ __name((x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P2("M0,0 Q1.8,-5.2 7,-8.2 Q5.8,-3 0.8,0.6 Z", C.feather, 0.8) + L([2.4, -3.4], [3.8, -2.2], C.featherS, 0.6) + L([3.8, -5.2], [5, -4], C.featherS, 0.6) + P2("M5.6,-7.2 Q6.6,-7.8 7,-8.2 Q6.8,-7 6.2,-6.2 Z", "#FFFFFF", 0) + "</g>", "feather");
    var note = /* @__PURE__ */ __name((x, y) => `<g transform="rotate(-12 ${x} ${y})">${E(x, y, 1.1, 0.8, OUT, 0)}${L([x + 0.95, y], [x + 0.95, y - 3.6], OUT, 0.6)}<path d="M${r2(x + 0.95)},${r2(y - 3.6)} Q${r2(x + 2.6)},${r2(y - 3)} ${r2(x + 2.2)},${r2(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>`, "note");
    var CAPE = "M14.4,33 Q24,30.6 33.6,33 L37.6,52.4 Q36.2,54.4 34.6,52.8 Q33.2,55 31.4,53.2 Q29.8,55.2 28,53.4 Q26,55.4 24,53.6 Q22,55.4 20,53.4 Q18.2,55.2 16.6,53.2 Q14.8,55 13.4,52.8 Q11.8,54.4 10.4,52.4 Z";
    var TUNIC = "M16.2,32.6 Q24,30 31.8,32.6 L33.4,48.6 L31.2,50.4 L29.4,48.8 L27.2,50.6 L25,48.8 L23,50.6 L20.8,48.8 L18.8,50.4 L16.8,48.8 L14.6,50 Z";
    function cape(uid, over) {
      const rows = over ? [38.4, 43.4, 48.4].map((y) => `<path d="M10,${y} Q12,${y + 2} 14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y}" fill="none" stroke="${C.leafS}" stroke-width="0.7"/>`).join("") : "";
      return P2(CAPE, C.leaf) + clip(`${uid}cp`, CAPE, `<rect x="27" y="30" width="14" height="28" fill="${C.leafS}"/>${rows}<rect x="13.6" y="35" width="1.2" height="15" rx="0.6" fill="${C.leafH}"/>`) + P2(CAPE, "none");
    }
    __name(cape, "cape");
    var sylve2 = {
      name: "Sylve",
      uid: "sy",
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
        let s = P2(TUNIC, C.tunic) + clip(`${c.uid}t`, TUNIC, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="9" height="22" fill="${C.tunicS}"/>`) + P2(TUNIC, "none");
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
          s += P2(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="36" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.6" rx="13.4" ry="12.4" fill="${C.hair}"/>`) + P2(back, "none");
          s += P2("M17,12 Q15.6,22 17.6,32", "none", 0.6) + P2("M24.4,11.4 Q25.4,22 23.6,33.6", "none", 0.6) + P2("M30.6,12.4 Q32,22 30.4,32", "none", 0.6);
          s += L([16.8, 10], [22, 8.4], C.hairH, 1.2) + L([27, 16], [29.4, 15.4], C.twig, 0.8) + feather(13.4, 14.6, -1);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z");
        s += twig([12.6, 14.2], [8.2, 12.6], [[10.2, 13.2], [9.2, 15]]) + twig([36.2, 21.2], [40.2, 22.6], [[38.4, 21.8], [39.6, 20.2]]);
        s += P2(long, C.hair) + clip(`${c.uid}h`, long, `<rect x="8" y="24" width="32" height="12" fill="${C.hairS}"/>`) + P2(long, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        const paint = cheeks.map(([x, r]) => [-0.6, 0.6].map((dy) => L([x - r * 0.9, 25.6 + dy * 1.6], [x + r * 0.9, 25.2 + dy * 1.6], C.paint, 0.75)).join("")).join("");
        s += P2(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 27.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + paint);
        s += P2(face, "none");
        s += P2(sx("M12.6,16.4 Q11.2,24 13.4,30 Q14,24 14.8,18.6 Z"), C.hair, 0.8) + P2(sx("M35.4,16.4 Q36.8,24 34.6,30 Q34,24 33.2,18.6 Z"), C.hair, 0.8);
        s += P2(bangs, C.hair) + L([15.6 + k, 11.2], [21.6 + k, 9.6], C.hairH, 1.2) + feather(34.4 + k, 14.6);
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.4,
          brow: C.brow,
          browY: -4.1,
          browW: 1.15,
          mouth: [se ? 20.8 : 24, 27.6],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : sur ses gardes, la bouche serrée de travers
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.1)},${r2(my + 0.7)} L${r2(mx + 1.1)},${r2(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 27.4,
          temple: [se ? 11.6 : 10.8, 22.4],
          anger: [8.4, 12.6],
          zz: [3.6, 11.4]
        }, ctx);
        return s;
      },
      pose({ pose, n }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [31.8, 34], n === 0 ? [37.2, 25.4] : [38.6, 27.4]) };
        }
        const left = arm(this, [16.2, 34], [22.2, 43.4], [12.6, 40.6]);
        const right = arm(this, [31.8, 34], [25.8, 43.4], [35.4, 40.6]);
        const seedOrSprout = n === 0 ? E(24, 41.4, 1.1, 0.8, C.seed, 0.7) + note(36.4, 25.4) + note(39.6, 19.6) : L([24, 42], [24, 36.4], OUT, 1.8) + L([24, 42], [24, 36.4], C.vine, 0.9) + leaf(24, 37, 3.8, 1.5, 125) + leaf(24, 37, 3.8, 1.5, -125) + note(36.8, 22.4) + note(10.4, 24.6) + note(40.2, 16.8);
        return n === 0 ? { expr: "content", eyeMode: "blink", open: true, left, right, over: seedOrSprout } : { expr: "rire", left, right, over: seedOrSprout };
      }
    };
    module.exports = sylve2;
  }
});

// atelier/generateur_portraits.mjs
var import_portraits = __toESM(require_portraits(), 1);
var import_aster = __toESM(require_aster(), 1);
var import_cannelle = __toESM(require_cannelle(), 1);
var import_galet = __toESM(require_galet(), 1);
var import_melisse = __toESM(require_melisse(), 1);
var import_ondin = __toESM(require_ondin(), 1);
var import_rivet = __toESM(require_rivet(), 1);
var import_sylve = __toESM(require_sylve(), 1);
var MAITRES = { aster: import_aster.default, cannelle: import_cannelle.default, galet: import_galet.default, melisse: import_melisse.default, ondin: import_ondin.default, rivet: import_rivet.default, sylve: import_sylve.default };
var { EXPRESSIONS_PORTRAIT, BULLES_PORTRAIT, TAILLE_PORTRAIT, HD_PORTRAIT } = import_portraits.default;
function portraitMaitre(id, expression = "neutre") {
  if (!MAITRES[id]) throw new Error(`maître inconnu : ${id} (${Object.keys(MAITRES).join(", ")})`);
  const { svg, cadre } = import_portraits.default.portrait(MAITRES[id], expression);
  return { svg, cadre, ms_par_image: null };
}
__name(portraitMaitre, "portraitMaitre");
function bullePortrait(cle) {
  const { svg, cadre } = import_portraits.default.bulle(cle);
  return { svg, cadre, ms_par_image: null };
}
__name(bullePortrait, "bullePortrait");
function liste() {
  const out = [];
  for (const id of Object.keys(MAITRES)) for (const e of import_portraits.default.EXPRESSIONS_PORTRAIT) out.push({ fichier: `portraits/${id}/${id}-portrait_${e}.svg`, fonction: "portraitMaitre", args: [id, e] });
  for (const k of import_portraits.default.BULLES_PORTRAIT) out.push({ fichier: `portraits/bulles/bulle_${k}.svg`, fonction: "bullePortrait", args: [k] });
  return out;
}
__name(liste, "liste");
export {
  BULLES_PORTRAIT,
  EXPRESSIONS_PORTRAIT,
  HD_PORTRAIT,
  MAITRES,
  TAILLE_PORTRAIT,
  bullePortrait,
  liste,
  portraitMaitre
};
