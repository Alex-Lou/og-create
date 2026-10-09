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
        const h = c.armW / 2 + 0.5, P2 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        if (c.sleeves === "torn") {
          const zig = [P2(h, -0.5), P2(h * 0.45, 1.5), P2(0, 0.4), P2(-h * 0.5, 1.6), P2(-h, -0.5)];
          s += `<path d="${path([P2(h, -1.8), ...zig, P2(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT, 0.85);
        } else {
          const r = h + 0.3, band = [P2(r, -0.7), P2(r, 0.75), P2(-r, 0.75), P2(-r, -0.7)];
          s += `<path d="${path(band)} Z" fill="${c.cuff || c.sleeve}" stroke="${OUT}" stroke-width="0.85" stroke-linejoin="round"/>` + L(P2(r * 0.7, -0.1), P2(-r * 0.7, -0.1), "rgba(255,255,255,.35)", 0.45);
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
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES };
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
      let v = "M0,0 L240,0 L240,14";
      for (let x = 240; x > 0; x -= 24) v += ` Q${x - 12},26 ${x - 24},14`;
      s += P(v + " Z", ROUGE.ombre, W) + trait("M0,10 L240,10", OR.corps, 1.4);
      for (let x = 12; x < 240; x += 24) s += rond(x, 21.6, 1.6, OR.corps, 0.7);
      return s;
    }
    __name(estrade, "estrade");
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
    var PIECES2 = [
      ["estrade", "Estrade de l'aperçu", [240, 180], null, estrade, "le fond de l'aperçu en pied de l'éditeur (avm__stage), en background cover ; les pieds de l'avatar au centre du plateau", { pieds: [120, 154] }],
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
