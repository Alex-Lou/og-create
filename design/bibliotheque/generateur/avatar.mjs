// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur.mjs : ne pas modifier à la main.
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
    var EXPRS2 = ["neutre", "content", "rire", "surpris", "triste", "fache", "gene", "endormi"];
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
    function expression(g, ctx) {
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
    function frame2(c, view, pose2, n, expr) {
      const id = `${c.uid}${view}${pose2}${n}`;
      const cc = { ...c, uid: id, view };
      const walk = pose2 === "marche";
      const ph = walk ? [1, 0, -1, 0][n] : 0;
      const bob = walk && n % 2 === 1 ? -1 : 0;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const ctx = { view, pose: pose2, n, ph, id, walk };
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
      const act = pose2 === "action" || pose2 === "salut" ? c.pose.call(cc, ctx) : null;
      const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
      const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : "";
      const armRight = act && act.right != null ? act.right : (c.holdOver ? "" : held) + arm(cc, shR, handR);
      ctx.expr = expr || act && act.expr || (pose2 === "salut" ? "content" : "neutre");
      ctx.eyeMode = expr ? null : act && act.eyeMode;
      ctx.open = !expr && act && act.open;
      ctx.blink = pose2 === "repos" && n === 1;
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
    __name(frame2, "frame");
    var svg2 = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`, "svg");
    var POSES2 = [["face_repos", "front", "repos", 2], ["avant_marche", "se", "marche", 4], ["dos_marche", "ne", "marche", 4], ["face_salut", "front", "salut", 2]];
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, EXPRS: EXPRS2, drop, zee, arm, poing, bareFoot, shoe, leg, frame: frame2, svg: svg2, POSES: POSES2 };
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
    var NUANCIERS2 = {
      peau: nuancier(PEAU),
      cheveux: nuancier(CHEVEUX),
      yeux: nuancier(YEUX),
      tissus: nuancier(TISSUS),
      metaux: nuancier(METAUX),
      levres: nuancier(LEVRES),
      teintures: nuancier(TEINTURES)
    };
    var NOMS_NUANCIERS2 = {
      peau: noms(PEAU),
      cheveux: noms(CHEVEUX),
      yeux: noms(YEUX),
      tissus: noms(TISSUS),
      metaux: noms(METAUX),
      levres: noms(LEVRES),
      teintures: noms(TEINTURES)
    };
    var PRIX2 = { commun: 80, rare: 200, epique: 500, legendaire: 1200 };
    var prix = /* @__PURE__ */ __name((rarete, source) => source === "boutique" ? { prix: PRIX2[rarete] } : source === "gratuit" ? { prix: 0 } : {}, "prix");
    var TEINTURES_GAINS2 = Object.fromEntries(TEINTURES.map(([k, , , rarete, source]) => [k, { rarete, source, ...prix(rarete, source) }]));
    var FORMES2 = {
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
    var EMPLACEMENTS2 = {
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
    var ACCESSOIRES2 = {
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
    var CHOIX2 = {
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
    var DEFAUT2 = {
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
    var accepte = /* @__PURE__ */ __name((nom, cle) => NUANCIERS2[nom] && cle in NUANCIERS2[nom] || (nom === "tissus" || nom === "cheveux") && cle in NUANCIERS2.teintures, "accepte");
    var couleur2 = /* @__PURE__ */ __name((nom, cle) => NUANCIERS2[nom] && NUANCIERS2[nom][cle] || NUANCIERS2.teintures[cle], "couleur");
    var libelle2 = /* @__PURE__ */ __name((cle, valeur) => {
      const nom = CHOIX2[cle];
      if (nom === "formes") return FORMES2[cle][valeur];
      return NOMS_NUANCIERS2[nom] && NOMS_NUANCIERS2[nom][valeur] || NOMS_NUANCIERS2.teintures[valeur];
    }, "libelle");
    function verifier2(choix2 = {}) {
      const o = { ...DEFAUT2, ...choix2, accessoires: { ...choix2.accessoires || {} } };
      for (const [k, v] of Object.entries(o)) {
        if (k === "accessoires") continue;
        const nom = CHOIX2[k];
        if (!nom) throw new Error(`choix inconnu : ${k}`);
        if (nom === "formes" ? !(v in FORMES2[k]) : !accepte(nom, v)) throw new Error(`choix inconnu : ${k} = ${v}`);
      }
      for (const [place, a] of Object.entries(o.accessoires)) {
        if (!a) {
          delete o.accessoires[place];
          continue;
        }
        const def = ACCESSOIRES2[a.id];
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
    __name(verifier2, "verifier");
    var couleursAccessoire2 = /* @__PURE__ */ __name((a) => a.couleurs.map((cle, i) => couleur2(ACCESSOIRES2[a.id].zones[i] === "metal" ? "metaux" : "tissus", cle)), "couleursAccessoire");
    var naufrageChoix2 = /* @__PURE__ */ __name((o) => ({ ...o, accessoires: Object.fromEntries(Object.entries(o.accessoires || {}).filter(([, a]) => a && ACCESSOIRES2[a.id].garde)) }), "naufrageChoix");
    function graine2(n) {
      let a = n >>> 0;
      return () => {
        a = a + 1831565813 >>> 0;
        let t = a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    __name(graine2, "graine");
    function auHasard2(n, { gratuit = true } = {}) {
      const r = graine2(n);
      const un = /* @__PURE__ */ __name((list) => list[Math.floor(r() * list.length) % list.length], "un");
      const cles = /* @__PURE__ */ __name((obj) => Object.keys(obj), "cles");
      const naturels = CHEVEUX.slice(0, 14).map(([k]) => k), fantaisie = CHEVEUX.slice(14).map(([k]) => k);
      const tissus = cles(NUANCIERS2.tissus);
      const haut = un(cles(FORMES2.haut)), couleurHaut = un(tissus);
      const loin = /* @__PURE__ */ __name((c) => {
        const [h1, , l1] = hsl(NUANCIERS2.tissus[couleurHaut]), [h2, , l2] = hsl(NUANCIERS2.tissus[c]);
        return Math.abs(l1 - l2) > 0.18 || Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) > 50;
      }, "loin");
      const bas = un(cles(FORMES2.bas)), couleurBas = un(tissus.filter(loin));
      const o = {
        taille: un(cles(FORMES2.taille)),
        silhouette: un(cles(FORMES2.silhouette)),
        peau: un(cles(NUANCIERS2.peau)),
        visage: un(cles(FORMES2.visage)),
        yeux: un(cles(NUANCIERS2.yeux)),
        formeYeux: un(cles(FORMES2.formeYeux)),
        cils: un(cles(FORMES2.cils)),
        sourcils: un(cles(FORMES2.sourcils)),
        bouche: un(cles(FORMES2.bouche)),
        levres: r() < 0.3 ? un(cles(NUANCIERS2.levres).slice(1)) : "naturelles",
        rousseur: r() < 0.25 ? un(["legere", "oui"]) : "non",
        joues: un(cles(FORMES2.joues)),
        grain: r() < 0.15 ? un(["joue", "levre"]) : "non",
        coupe: un(cles(FORMES2.coupe)),
        cheveux: r() < 0.8 ? un(naturels) : un(fantaisie),
        meches: r() < 0.2 ? un(["pointes", "meches"]) : "sans",
        couleurMeches: un(cles(NUANCIERS2.cheveux)),
        haut,
        couleurHaut,
        bas,
        couleurBas,
        chaussures: un(["cuir", "caramel", "noir", "blanc", "creme", "rouge", "jean", "rose"]),
        accessoires: {}
      };
      const permis = Object.entries(ACCESSOIRES2).filter(([, a]) => !a.saison && (!gratuit || a.source === "gratuit"));
      const nb = Math.floor(r() * 3);
      for (let i = 0; i < nb; i++) {
        const [id, a] = un(permis);
        if (o.accessoires[a.emplacement]) continue;
        o.accessoires[a.emplacement] = { id, couleurs: a.zones.map((z) => z === "metal" ? un(cles(NUANCIERS2.metaux)) : un(tissus)) };
      }
      return verifier2(o);
    }
    __name(auHasard2, "auHasard");
    module.exports = {
      NUANCIERS: NUANCIERS2,
      NOMS_NUANCIERS: NOMS_NUANCIERS2,
      TEINTURES_GAINS: TEINTURES_GAINS2,
      PRIX: PRIX2,
      FORMES: FORMES2,
      EMPLACEMENTS: EMPLACEMENTS2,
      ACCESSOIRES: ACCESSOIRES2,
      CHOIX: CHOIX2,
      DEFAUT: DEFAUT2,
      verifier: verifier2,
      libelle: libelle2,
      couleur: couleur2,
      couleursAccessoire: couleursAccessoire2,
      naufrageChoix: naufrageChoix2,
      auHasard: auHasard2,
      graine: graine2,
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
    var { OUT, P, E, L, limb, clip, r2, shoe } = require_troupe();
    var { tone, mix } = require_avatar_choix();
    var sx = /* @__PURE__ */ __name((d, k) => k ? d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`) : d, "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`), "mirror");
    var decale = /* @__PURE__ */ __name((v) => v === "se" ? -1.4 : 0, "decale");
    var reflet = /* @__PURE__ */ __name((c) => tone(c, 1.45), "reflet");
    var fleurette = /* @__PURE__ */ __name((x, y, r, col, coeur2 = "#F2C04B") => [0, 1, 2, 3, 4].map((i) => {
      const a = i / 5 * Math.PI * 2 - Math.PI / 2;
      return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.78, r * 0.78, col, 0.55);
    }).join("") + E(x, y, r * 0.55, r * 0.55, coeur2, 0.5), "fleurette");
    var feuille = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${s})">${P("M0,0 Q1.3,-1.1 2.8,0 Q1.3,1.1 0,0 Z", "#7EB45A", 0.5)}</g>`, "feuille");
    var etoile = /* @__PURE__ */ __name((x, y, r, col, w = 0.6) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = i / 10 * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        return `${r2(x + Math.cos(a) * rr)},${r2(y + Math.sin(a) * rr)}`;
      });
      return P(`M${pts.join(" L")} Z`, col, w);
    }, "etoile");
    var coeur = /* @__PURE__ */ __name((x, y, s, col, w = 0.5) => P(`M${r2(x)},${r2(y + s * 0.9)} C${r2(x - s * 1.5)},${r2(y)} ${r2(x - s * 0.9)},${r2(y - s * 1.1)} ${r2(x)},${r2(y - s * 0.35)} C${r2(x + s * 0.9)},${r2(y - s * 1.1)} ${r2(x + s * 1.5)},${r2(y)} ${r2(x)},${r2(y + s * 0.9)} Z`, col, w), "coeur");
    var scintille = /* @__PURE__ */ __name((x, y, s, col) => P(`M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.18)},${r2(y - s * 0.18)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.18)},${r2(y + s * 0.18)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.18)},${r2(y + s * 0.18)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.18)},${r2(y - s * 0.18)} ${r2(x)},${r2(y - s)} Z`, col, 0.45), "scintille");
    function reperes(c) {
      const [[x0, y0], [x1]] = c.shoulders, dy = c.dy || 0, e = (x1 - x0) / 2;
      const k = c.k || { sw: e + 0.5, hw: e + 2.2, b: 0, ...c.porte };
      const hanche = r2(c.hip - dy);
      return { cou: r2(y0 - dy - 3.2), e, sw: k.sw, hw: k.hw, b: k.b, hanche, ourlet: c.coatHem !== void 0 ? c.coatHem : r2(hanche + (c.ground - c.hip) * 0.45) };
    }
    __name(reperes, "reperes");
    function capucheRabattue(uid, view, R, col, S) {
      const { cou: y, e } = R, a = r2(24 - e + 0.4), b = r2(24 + e - 0.4);
      if (view !== "ne") return P(`M${a},${r2(y + 0.8)} Q24,${r2(y - 3.8)} ${b},${r2(y + 0.8)} L${b},${r2(y + 3)} L${a},${r2(y + 3)} Z`, S);
      const d = `M${a},${r2(y + 2.2)} Q24,${r2(y + 6.8)} ${b},${r2(y + 2.2)} L${r2(24 + e + 0.6)},${r2(y + 7.8)} Q24,${r2(y + 11.4)} ${r2(24 - e - 0.6)},${r2(y + 7.8)} Z`;
      return P(d, col) + clip(`${uid}cap`, d, `<rect x="27.2" y="${r2(y)}" width="16" height="14" fill="${S}"/>`) + P(d, "none") + P(`M${r2(24 - e + 1.6)},${r2(y + 6.6)} Q24,${r2(y + 9.6)} ${r2(24 + e - 1.6)},${r2(y + 6.6)}`, "none", 0.7);
    }
    __name(capucheRabattue, "capucheRabattue");
    function bonnet(c, { view }, [col, revers]) {
      const k = view === "se" ? -0.8 : 0, X = /* @__PURE__ */ __name((x) => r2(x + k), "X");
      const dome = `M${X(10.4)},15.6 Q${X(9.8)},5.6 ${X(24)},5.4 Q${X(38.2)},5.6 ${X(37.6)},15.6 Z`;
      const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${X(38)},12.8 L${X(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
      const cotes = [-11, -6.6, -2.2, 2.2, 6.6, 11].map((d) => `<path d="M${X(24 + d * 0.55)},6 Q${X(24 + d * 1.05)},9.2 ${X(24 + d * 1.1)},15.4" fill="none" stroke="${tone(col, 0.8)}" stroke-width="0.6"/>`).join("");
      const mailles = [-12, -8, -4, 0, 4, 8, 12].map((d) => L([24 + d + k, 13.6 + (Math.abs(d) < 6 ? 1 : 0.4) - Math.abs(d) * 0.05], [24 + d * 1.01 + k, 16.4 + (Math.abs(d) < 6 ? 1.1 : 0.4) - Math.abs(d) * 0.05], tone(revers, 0.84), 0.5)).join("");
      return P(dome, col) + clip(`${c.uid}bn${view}`, dome, cotes + `<rect x="${X(27.6)}" y="2" width="12" height="15" fill="${tone(col, 0.86)}" opacity="0.7"/>`) + P(dome, "none") + P(rim, revers) + clip(`${c.uid}rv${view}`, rim, mailles) + P(rim, "none") + E(X(24), 5.7, 2.3, 1.55, revers, 0.85) + E(X(23.4), 5.2, 0.8, 0.55, "#FFFFFF", 0);
    }
    __name(bonnet, "bonnet");
    function arceau(c, { view }, [, col]) {
      const d = view === "se" ? "M13.4,20.4 Q12.6,8.6 24.2,8.2 Q36.2,8.6 35.8,20.4" : "M12.6,20.4 Q12,7.6 24,7.4 Q36,7.6 35.4,20.4";
      return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    __name(arceau, "arceau");
    function cacheOreilles(c, { view }, [col]) {
      const muffs = view === "se" ? [[35.4, 22.6]] : view === "ne" ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
      return muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P(`M${r2(x - 1.7)},${r2(y + 1.3)} Q${x},${r2(y + 2.6)} ${r2(x + 1.7)},${r2(y + 1.3)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`) + E(x - 0.7, y - 1.2, 0.9, 0.8, "#FFFFFF", 0)).join("");
    }
    __name(cacheOreilles, "cacheOreilles");
    function paille(c, { view }, [col]) {
      const k = decale(view);
      const crown = sx("M15.6,13.4 Q15.8,5.2 24,5 Q32.2,5.2 32.4,13.4 Z", k);
      return E(24 + k, 13.6, view === "ne" ? 15.4 : 16.4, 3.4, "#F2D27E") + P(crown, "#E8C46A") + `<rect x="${r2(15.6 + k)}" y="10.6" width="16.8" height="2.2" fill="${col}"/>` + P(crown, "none") + L([17.2 + k, 8], [21 + k, 6.4], "#FFF0B8", 0.9);
    }
    __name(paille, "paille");
    function casquette(c, { view }, [col]) {
      const k = decale(view);
      const dome = sx("M11.6,15.6 Q11.4,5.6 24,5.4 Q36.6,5.6 36.4,15.6 Z", k);
      const visor = view === "ne" ? "" : view === "se" ? P("M9,15.6 Q8.4,12.6 16,13.6 L22,15.6 Q15,17.4 9,15.6 Z", tone(col, 0.8)) : P("M15,15.4 Q24,12.6 33,15.4 Q24,19 15,15.4 Z", tone(col, 0.8));
      return P(dome, col) + P(sx("M23.4,5.6 L23.4,15.4", k), "none", 0.5) + E(24 + k, 5.6, 1.1, 0.8, tone(col, 0.8), 0.6) + visor;
    }
    __name(casquette, "casquette");
    function bandana(c, { view }, [col]) {
      const ne = view === "ne", k = decale(view);
      const d = ne ? "M11.2,17.6 Q10.8,6 24,5.8 Q37.2,6 36.8,17.6 Q24,14.4 11.2,17.6 Z" : sx("M11.6,16.4 Q11.4,6.2 24,6 Q36.6,6.2 36.4,16.4 Q24,13 11.6,16.4 Z", k);
      let s = P(d, col) + clip(`${c.uid}bd${view}`, d, [[16, 9], [21, 7.4], [27, 8], [31.6, 10.6], [19, 12.6], [28.6, 12.6]].map(([x, y]) => E(x + k, y, 0.7, 0.7, "#FFF4E0", 0)).join("")) + P(d, "none");
      if (ne) s += P("M23,16.4 Q21.4,19.6 21.8,22.6 Q23,21.6 23.8,22.2 Q23.4,19.4 24.4,16.6 Z", tone(col, 0.85), 0.8) + P("M25,16.4 Q27.4,19 27.6,22 Q26.4,21.2 25.6,21.8 Q25.4,19.2 23.8,16.8 Z", tone(col, 0.85), 0.8) + E(24, 16.4, 1.8, 1.3, col, 0.8);
      return s;
    }
    __name(bandana, "bandana");
    function couronneFleurs(c, { view }, [col]) {
      const k = decale(view);
      const pts = view === "ne" ? [[12.6, 15.6], [15.8, 12.6], [19.8, 11.2], [24, 10.8], [28.2, 11.2], [32.2, 12.6], [35.4, 15.6]] : [[12.8, 14.6], [16, 11.8], [20, 10.6], [24, 10.2], [28, 10.6], [32, 11.8], [35.2, 14.6]];
      const alt = mix(col, "#FFFFFF", 0.55);
      let s = P(sx(view === "ne" ? "M12.6,15.6 Q24,8.6 35.4,15.6" : "M12.8,14.6 Q24,8 35.2,14.6", k), "none", 0) + pts.slice(0, -1).map(([x, y], i) => feuille(x + k + 1.4, y - 0.4, i % 2 ? -30 : 20, 0.9)).join("");
      s += pts.map(([x, y], i) => fleurette(x + k, y, i % 2 ? 1.05 : 1.25, i % 2 ? alt : col)).join("");
      return s;
    }
    __name(couronneFleurs, "couronneFleurs");
    function beret(c, { view }, [col]) {
      const k = decale(view);
      const d = view === "ne" ? "M11.8,13.4 Q10.6,6.4 22.4,5 Q34.6,4.4 37.6,9.6 Q38.4,12.6 35.6,13.2 Q24,10.6 11.8,13.4 Z" : sx("M12.4,12.2 Q11,6 22.4,4.8 Q34,4.2 37.6,8.8 Q38.6,11.6 35.4,12.2 Q24,10 12.4,12.2 Z", k);
      return P(d, col) + clip(`${c.uid}br${view}`, d, `<path d="${sx("M8,10 Q24,7.6 42,10 L42,16 L8,16 Z", k)}" fill="${tone(col, 0.82)}"/>`) + P(d, "none") + P(sx("M24.2,5.2 L24.5,4.4 L25.6,4.5", k), "none", 1.1) + L([16 + k, 7.6], [21 + k, 6], tone(col, 1.3), 1);
    }
    __name(beret, "beret");
    function oreillesChat(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const ear = sx("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z", k), inner = sx("M15,9.8 L14.5,6 L18.2,8 Z", k);
      const earR = sx(mirror("M14.4,10.8 L13.6,4.4 L19.8,7.8 Z"), k), innerR = sx(mirror("M15,9.8 L14.5,6 L18.2,8 Z"), k);
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>` + P(ear, col) + P(earR, col) + (ne ? "" : P(inner, "#F4A8B8", 0) + P(innerR, "#F4A8B8", 0));
    }
    __name(oreillesChat, "oreillesChat");
    function oreillesLapin(c, { view }, [col]) {
      const k = decale(view), ne = view === "ne";
      const band = sx("M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6", k);
      const left = sx("M16.2,9.4 Q14.2,5.2 15.6,3.4 Q17.6,2.4 19.2,4.6 Q20.2,6.8 19.4,8.8 Z", k);
      const right = sx("M28.6,8.6 Q29,4.6 31.6,3.8 Q34.2,3.6 36.4,5.8 Q36.8,7.4 35,7.2 Q32.6,6.4 31.4,9.2 Z", k);
      const pink = "#F4A8B8";
      return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 1.8)">` + P(left, col) + P(right, col) + (ne ? "" : P(sx("M16.8,8.4 Q15.6,5.4 16.4,4.4 Q17.6,4 18.4,5.4 Q18.8,7 18.4,8.2 Z", k), pink, 0) + P(sx("M30.2,7.6 Q30.6,5.4 32,4.9 Q33.8,4.8 35.2,6 Q33,5.6 31.6,7.8 Z", k), pink, 0)) + "</g>";
    }
    __name(oreillesLapin, "oreillesLapin");
    function diademe(c, { view }, [col]) {
      const k = decale(view);
      if (view === "ne") return `<path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
      const d = sx("M15.4,11.6 Q24,8.6 32.6,11.6 L31.4,8.8 L28.4,9.6 L26.2,6.6 L24,4.8 L21.8,6.6 L19.6,9.6 L16.6,8.8 Z", k);
      return P(d, col, 0.9) + P(sx("M16.4,10.6 Q24,8 31.6,10.6", k), "none", 0.45) + E(24 + k, 8.2, 1.1, 1.3, "#E8879C", 0.6) + E(23.7 + k, 7.8, 0.35, 0.4, "#FFFFFF", 0) + E(19.8 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + E(28.2 + k, 9.6, 0.55, 0.55, "#8EC5E8", 0.4) + L([20.6 + k, 8.2], [22.6 + k, 6.4], reflet(col), 0.6);
    }
    __name(diademe, "diademe");
    var PIN = { front: [15.4, 10.6], se: [14.6, 11], ne: [32.6, 11.6] };
    function noeud(c, { view }, [col]) {
      const [x, y] = PIN[view], d = tone(col, 0.82);
      return P(`M${x},${y} Q${r2(x - 4.4)},${r2(y - 3.6)} ${r2(x - 4.4)},${r2(y + 0.2)} Q${r2(x - 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${x},${y} Q${r2(x + 4.4)},${r2(y - 3.6)} ${r2(x + 4.4)},${r2(y + 0.2)} Q${r2(x + 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${r2(x - 0.6)},${r2(y + 0.6)} L${r2(x - 1.8)},${r2(y + 3.8)} L${r2(x - 0.4)},${r2(y + 3.2)} Z M${r2(x + 0.6)},${r2(y + 0.6)} L${r2(x + 1.8)},${r2(y + 3.8)} L${r2(x + 0.4)},${r2(y + 3.2)} Z`, d, 0.6) + E(x, y, 1.15, 1.25, d, 0.7) + L([x - 3.2, y - 1], [x - 1.8, y - 1.6], tone(col, 1.35), 0.6);
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
    var branches = /* @__PURE__ */ __name((view, col) => (view === "se" ? P("M27.9,22.2 L34.4,21.4", "none", 0.8) : P("M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6", "none", 0.8)).replace(`stroke="${OUT}"`, `stroke="${col}"`), "branches");
    var deDos = /* @__PURE__ */ __name((col) => P("M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${col}"`), "deDos");
    function lunettes(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne") return deDos(forme === "rondes" ? col : tone(col, 0.7));
        const [[x1, y], [x2]] = VERRES[view];
        const se = view === "se", f = se ? 0.86 : 1;
        const frame2 = forme === "rondes" ? col : tone(col, 0.9);
        const glass = forme === "soleil" ? `fill="${tone(col, 0.45)}" fill-opacity="0.9"` : forme === "coeur" ? `fill="${mix(col, "#FFFFFF", 0.3)}" fill-opacity="0.55"` : 'fill="rgba(200,230,255,.25)"';
        const lens = /* @__PURE__ */ __name((x, w) => {
          if (forme === "rondes" || forme === "soleil") return `<circle cx="${x}" cy="${y}" r="${r2(3.1 * w)}" ${glass} stroke="${frame2}" stroke-width="${forme === "soleil" ? 1 : 0.9}"/>`;
          if (forme === "carrees") return `<rect x="${r2(x - 3.2 * w)}" y="${r2(y - 2.4)}" width="${r2(6.4 * w)}" height="4.8" rx="1.1" ${glass} stroke="${frame2}" stroke-width="1"/>`;
          if (forme === "papillon") {
            const o = x < 24 - (se ? 1.4 : 0) ? -1 : 1;
            return `<path d="M${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Q${x},${r2(y - 2.6)} ${r2(x + 3.4 * w * o)},${r2(y - 2.8)} Q${r2(x + 3 * w * o)},${r2(y + 2.6)} ${x},${r2(y + 2.4)} Q${r2(x - 3 * w * o)},${r2(y + 2.2)} ${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Z" ${glass} stroke="${frame2}" stroke-width="1"/>`;
          }
          return coeur(x, y + 0.2, 3 * w, mix(col, "#FFFFFF", 0.3), 1).replace(`fill="${mix(col, "#FFFFFF", 0.3)}"`, glass).replace(`stroke="${OUT}"`, `stroke="${frame2}"`);
        }, "lens");
        let s = lens(x1, 1) + lens(x2, f) + P(se ? "M20.1,22.4 Q21.2,21.6 22.9,22.4" : "M22.5,22.4 Q24,21.4 25.5,22.4", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${frame2}"`) + branches(view, frame2);
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
      if (view === "ne") return P("M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z", col);
      const kx = view === "se" ? 18.6 : 20.8;
      return P("M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z", col) + P(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, col) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(col, 0.8), 0.9);
    }
    __name(foulard, "foulard");
    function echarpe(c, { view }, [col, raie]) {
      const y = reperes(c).cou, uid = c.uid, Y = /* @__PURE__ */ __name((d) => r2(y + d), "Y");
      const band = `M15.2,${Y(-0.4)} Q24,${Y(4.6)} 32.8,${Y(-0.4)} L33.6,${Y(3.2)} Q24,${Y(9)} 14.4,${Y(3.2)} Z`;
      const rayures = /* @__PURE__ */ __name((id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${8 + i * 6}" y="${Y(-10)}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${Y(5)})"/>`).join("")), "rayures");
      let s = "";
      if (view === "ne") {
        const pan3 = `M28,${Y(3.4)} L31.2,${Y(2.8)} L32.6,${Y(13)} L29.2,${Y(13.4)} Z`;
        s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, "none");
        return s + P(pan3, col) + clip(`${uid}p${view}`, pan3, [6, 9.4].map((d) => `<rect x="27" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan3, "none") + [0.7, 1.6, 2.5].map((d) => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join("");
      }
      const ex = view === "se" ? 24.6 : 27.4;
      const pan2 = `M${ex},${Y(3.6)} L${r2(ex + 3)},${Y(3.2)} L${r2(ex + 3.6)},${Y(13.4)} L${r2(ex + 0.2)},${Y(13.8)} Z`;
      s += P(pan2, col) + clip(`${uid}p${view}`, pan2, [6.2, 9.6].map((d) => `<rect x="${r2(ex - 1)}" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan2, "none") + [0.7, 1.6, 2.5].map((d) => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join("");
      s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, "none");
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
      return P(`M${o - 6},31.4 Q${o},37.8 ${o + 6},31.4`, "none", 0.5) + P(shell, col, 0.6) + [-1.1, 0, 1.1].map((d) => L([o, y + 2.1], [o + d * 1.4, y - 1.1], tone(col, 0.7), 0.4)).join("");
    }
    __name(coquillage, "coquillage");
    function papillon(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = 32.8;
      return P(`M${o},${y} L${r2(o - 3.2)},${r2(y - 1.8)} L${r2(o - 3.2)},${r2(y + 1.8)} Z M${o},${y} L${r2(o + 3.2)},${r2(y - 1.8)} L${r2(o + 3.2)},${r2(y + 1.8)} Z`, col, 0.7) + E(o, y, 0.95, 1.05, tone(col, 0.8), 0.6);
    }
    __name(papillon, "papillon");
    function sacDos(c, ctx, [col]) {
      const { view } = ctx, { sw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere") {
        if (view !== "se") return "";
        const bag = "M28.4,33.2 Q28.6,31.6 31,31.6 L36.6,31.8 Q38.6,32 38.6,34.4 L38.4,44.6 Q38.2,46 36.4,46 L30.4,46 Q28.4,46 28.4,44 Z";
        return P(bag, col) + P("M31,37.4 L38.4,37.6", "none", 0.6);
      }
      if (view === "ne") {
        const bag = "M17.4,35 Q17.4,32.8 20,32.8 L28,32.8 Q30.6,32.8 30.6,35 L30.4,45 Q30.4,46.8 28.4,46.8 L19.6,46.8 Q17.6,46.8 17.6,45 Z";
        return limb([24 - sw + 2.2, 31.6], [19, 34], 1.5, d) + limb([24 + sw - 2.2, 31.6], [29, 34], 1.5, d) + P(bag, col) + P("M17.6,38 Q24,40.6 30.4,38 L30.4,35 Q30.6,32.8 28,32.8 L20,32.8 Q17.4,32.8 17.4,35 Z", d, 0.9) + `<rect x="22.6" y="38.4" width="2.8" height="2.2" rx="0.5" fill="#E8C46A" stroke="${OUT}" stroke-width="0.6"/>` + P("M19.8,42 L28.2,42 L28,45.4 L20,45.4 Z", "none", 0.6);
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
      return limb(strap[0], strap[1], 1.3, d) + P(bag, col) + P(`M${r2(bx - 3.6)},42.6 L${r2(bx + 3.6)},42.6 L${r2(bx + 3.5)},45.2 Q${bx},46.4 ${r2(bx - 3.5)},45.2 Z`, d, 0.8) + E(bx, 45.4, 0.6, 0.6, "#E8C46A", 0.5);
    }
    __name(besace, "besace");
    function cape(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere" && view !== "ne") {
        const p = `M${r2(24 - sw - 0.6)},31.4 Q24,29.6 ${r2(24 + sw + 0.6)},31.4 L${r2(24 + hw + 4.2)},52.6 Q24,54.6 ${r2(24 - hw - 4.2)},52.6 Z`;
        return P(p, col) + clip(`${c.uid}cp${view}`, p, `<rect x="0" y="28" width="48" height="30" fill="${d}" opacity="0.55"/>`) + P(p, "none");
      }
      if (ctx.couche === "cou" && view !== "ne") {
        const o = milieu(view);
        return P(`M${r2(o - 5.4)},31 Q${o},33.4 ${r2(o + 5.4)},31`, "none", 1.6).replace(`stroke="${OUT}"`, `stroke="${d}"`) + E(o, 32.6, 1.1, 1.1, "#E8C46A", 0.6);
      }
      if (ctx.couche === "surBras" && view === "ne") {
        const p = `M${r2(24 - sw - 1.2)},31.2 Q24,29.2 ${r2(24 + sw + 1.2)},31.2 Q${r2(24 + sw + 3.4)},34 ${r2(24 + hw + 4.4)},52.6 Q24,54.8 ${r2(24 - hw - 4.4)},52.6 Q${r2(24 - sw - 3.4)},34 ${r2(24 - sw - 1.2)},31.2 Z`;
        return P(p, col) + clip(`${c.uid}cq${view}`, p, [-5, 0, 5].map((x) => L([24 + x * 0.5, 36], [24 + x, 53], d, 0.7)).join("") + `<rect x="27" y="28" width="20" height="30" fill="${d}" opacity="0.35"/>`) + P(p, "none");
      }
      return "";
    }
    __name(cape, "cape");
    function ailes(c, ctx, [col]) {
      const { view } = ctx, light = mix(col, "#FFFFFF", 0.45);
      const wing = "M19.6,36.4 Q10.6,26.6 6.2,31.4 Q4.4,36.6 10.6,38.6 Q8.2,43.6 13.6,44.6 Q17.6,42.4 19.8,38.6 Z";
      const veins = "M18.6,37 Q12,32 7.6,32.6 M18.6,37.6 Q13.4,39 11,38.6 M18.8,38.2 Q16,41.6 14,43.6";
      const one = /* @__PURE__ */ __name((d, v, id) => P(d, col) + clip(id, d, `<path d="${v}" fill="none" stroke="${light}" stroke-width="0.9"/>`) + P(d, "none"), "one");
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
      return P(`M${r2(x - 3.4)},${r2(y + 0.2)} Q${x},${r2(y - 6.6)} ${r2(x + 3.4)},${r2(y + 0.2)}`, "none", 1.6).replace(`stroke="${OUT}"`, 'stroke="#8A5A30"') + fleurette(x - 2, y - 0.6, 1.05, col) + fleurette(x + 1.6, y - 0.9, 1.1, mix(col, "#FFFFFF", 0.5)) + feuille(x - 0.2, y - 0.4, -60, 0.9) + P(basket, "#C9925A") + clip(`${c.uid}pn${ctx.view}`, basket, [1.4, 2.8].map((d) => L([x - 4, y + d], [x + 4, y + d], "#9A6A3A", 0.5)).join("") + [-2, 0, 2].map((d) => L([x + d, y], [x + d * 0.85, y + 5], "#9A6A3A", 0.5)).join("")) + P(basket, "none");
    }
    __name(panier, "panier");
    function ombrelle(c, ctx, [col], h) {
      const [x, y] = h, tip = [Math.min(x + 3, 38.6), y - 17.4];
      const canopy = "M-7,0 Q-6.7,-6.2 0,-6.7 Q6.7,-6.2 7,0 Q5.25,-1.2 3.5,0 Q1.75,-1.2 0,0 Q-1.75,-1.2 -3.5,0 Q-5.25,-1.2 -7,0 Z";
      const ribs = [-3.5, 0, 3.5].map((d) => L([d * 0.5, -6.3], [d, -0.2], tone(col, 0.82), 0.5)).join("");
      return limb([x, y + 0.4], tip, 0.7, "#8A5A30") + `<g transform="translate(${r2(tip[0])} ${r2(tip[1] + 1.6)}) rotate(16)">${P(canopy, col)}${ribs}${E(0, -6.9, 0.6, 0.6, tone(col, 0.8), 0.5)}</g>`;
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
      return P(d, col) + clip(`${c.uid}${id}${view}`, d, ombre + clair + reflets) + P(d, "none");
    }
    __name(panPeint, "panPeint");
    function poches(c, { view }, S) {
      const { hw, hanche } = reperes(c), se = view === "se";
      const one = /* @__PURE__ */ __name((x, l) => P(`M${r2(x)},${r2(hanche + 1.1)} L${r2(x + l)},${r2(hanche + 1.1)} L${r2(x + l - 0.2)},${r2(hanche + 2.7)} L${r2(x + 0.2)},${r2(hanche + 2.7)} Z`, S, 0.6), "one");
      return one(24 - hw - 0.4 - (se ? 0.6 : 0), 4.4) + one(24 + hw - (se ? 3.4 : 4), se ? 3 : 4.4);
    }
    __name(poches, "poches");
    function colFourrure(o, view, col, y) {
      const S = tone(col, 0.86), Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      if (view === "ne") {
        return P(`M15.4,${Y(0)} Q24,${Y(3.2)} 32.6,${Y(0)} L33.2,${Y(2.4)} Q24,${Y(6.2)} 14.8,${Y(2.4)} Z`, col, 0.9) + P(`M17.4,${Y(2.8)} Q24,${Y(5.2)} 30.6,${Y(2.8)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
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
      return P(d, col, 0.9) + P(`M${r2(o - 5)},${Y(3.4)} Q${o},${Y(6.4)} ${r2(o + 5)},${Y(3.4)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
    }
    __name(colFourrure, "colFourrure");
    var BOIS = "#D9B27C";
    function manteau(c, ctx, [col, fourrure]) {
      if (ctx.couche !== "dessus") return "";
      const { view } = ctx, { cou: y, ourlet: H } = reperes(c), S = tone(col, 0.8), w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r2(y + d), "Y");
      let s = panPeint(c, ctx, "mt", col, S);
      if (view === "ne") {
        s += P(`M24,${Y(3)} L${r2(24 + w * 0.6)},${r2(H - 3.6)}`, "none", 0.5) + P(`M${r2(24 + w * 0.6)},${r2(H - 3.6)} L${r2(24 + w)},${r2(H + 0.6)}`, "none", 0.8) + `<rect x="19.2" y="${Y(10.8)}" width="9.6" height="1.8" rx="0.8" fill="${S}" stroke="${OUT}" stroke-width="0.7"/>` + E(20.5, y + 11.7, 0.55, 0.55, BOIS, 0.45) + E(27.5, y + 11.7, 0.55, 0.55, BOIS, 0.45);
        return s + colFourrure(24, view, fourrure, y);
      }
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      s += P(`M${r2(o + 1.2)},${Y(3.6)} L${r2(o + 1.2 + w)},${r2(H + 0.8)}`, "none", 0.8);
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
      if (view === "ne") return s + P(`M24,${Y(9.2)} L${r2(24 + w)},${r2(H + 0.6)}`, "none", 0.5) + capucheRabattue(c.uid, view, R, col, S);
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      if ((c.o.accessoires.dessus || {}).ouvert) {
        const coin = `M${r2(o - 2.6)},${Y(2)} L${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 2)} L${r2(o - 3 + w)},${r2(H + 2)} Z`;
        s = `<clipPath id="${c.uid}cro${view}"><path d="M0,0 L48,0 L48,64 L0,64 Z ${coin}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c.uid}cro${view})">${s}</g>`;
        s += P(`M${r2(o - 2.6)},${Y(2)} L${r2(o - 3 + w)},${r2(H + 0.4)} M${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 0.4)}`, "none");
        s += [6, 10, 14].map((d) => y + d).filter((yy) => yy < H - 2).map((yy) => E(o - 4.2 + w * (yy - sh) / (H - sh), yy, 0.55, 0.55, tone(col, 0.5), 0.4)).join("");
        s += P(`M${r2(o - 6.4)},${Y(0.8)} L${r2(o - 2.4)},${Y(4.4)} L${r2(o - 3.6)},${Y(5.8)} Z`, col, 0.8) + P(`M${r2(o + 6.4)},${Y(0.8)} L${r2(o + 2.4)},${Y(4.4)} L${r2(o + 3.6)},${Y(5.8)} Z`, S, 0.8);
        return s + poches(c, ctx, S);
      }
      s += P(`M${r2(o + 0.8)},${Y(3)} L${r2(o + 0.8 + w)},${r2(H + 0.8)}`, "none", 0.9);
      s += [5.6, 9.2, 12.8, 16.4].map((d) => y + d).filter((yy) => yy < H - 1.4).map((yy) => E(o + 2.2 + w * (yy - sh) / (H - sh), yy, 0.6, 0.6, tone(col, 0.5), 0.4)).join("");
      s += P(`M${r2(o - 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o - 1.6)},${Y(6)} Z`, col, 0.8) + P(`M${r2(o + 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o + 2.4)},${Y(6)} Z`, S, 0.8);
      return s + poches(c, ctx, S);
    }
    __name(cire, "cire");
    function chale(c, { view }, [col, frange]) {
      const { cou: y, e } = reperes(c), uid = c.uid, Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      const S = tone(col, 0.82), L0 = r2(24 - e - 3.6), R0 = r2(24 + e + 3.6);
      const tricot = /* @__PURE__ */ __name(() => [0, 1, 2, 3, 4, 5].map((i) => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join("") + [0, 1, 2, 3, 4, 5].map((i) => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join(""), "tricot");
      if (view === "ne") {
        const d2 = `M${L0},${Y(5.4)} Q${r2(24 - e - 1)},${Y(0.4)} 24,${Y(-0.2)} Q${r2(24 + e + 1)},${Y(0.4)} ${R0},${Y(5.4)} Q${r2(R0 + 0.2)},${Y(8.4)} ${r2(R0 - 1.2)},${Y(9.6)} L24,${Y(17.6)} L${r2(L0 + 1.2)},${Y(9.6)} Q${r2(L0 - 0.2)},${Y(8.4)} ${L0},${Y(5.4)} Z`;
        return P(d2, col) + clip(`${uid}ch${view}`, d2, tricot() + `<rect x="25.6" y="${Y(-2)}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P(d2, "none") + [-1.6, -0.5, 0.6, 1.7].map((dx) => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join("");
      }
      const o = view === "se" ? 22 : 24;
      const d = `M${r2(o - 5.6)},${Y(0.6)} L${o},${Y(8.6)} L${r2(o + 5.6)},${Y(0.6)} Q${r2(R0 - 2.4)},${Y(1.4)} ${R0},${Y(4.6)} Q${r2(R0 + 0.6)},${Y(7.6)} ${r2(R0 - 0.2)},${Y(10)} Q${r2(o + 6)},${Y(11.4)} ${r2(o + 1.6)},${Y(10.2)} L${o},${Y(11.6)} L${r2(o - 1.6)},${Y(10.2)} Q${r2(o - 6)},${Y(11.4)} ${r2(L0 + 0.2)},${Y(10)} Q${r2(L0 - 0.6)},${Y(7.6)} ${L0},${Y(4.6)} Q${r2(L0 + 2.4)},${Y(1.4)} ${r2(o - 5.6)},${Y(0.6)} Z`;
      let s = P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${r2(o + 3.4)}" y="${Y(-2)}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none");
      const pan2 = /* @__PURE__ */ __name((dx, sg) => `M${r2(o + dx)},${Y(10.4)} L${r2(o + dx + sg * 2.4)},${Y(10.6)} L${r2(o + dx + sg * 2.8)},${Y(15)} L${r2(o + dx + sg * 0.4)},${Y(15.2)} Z`, "pan");
      s += P(pan2(0.2, 1), S) + P(pan2(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
      return s + [0.6, 1.5, 2.4].map((t) => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join("");
    }
    __name(chale, "chale");
    function pelerine(c, ctx, [col, bord]) {
      const { view } = ctx, R = reperes(c), { cou: y, e } = R, S = tone(col, 0.8);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R, col, S);
      const L0 = r2(24 - e - 3.8), R0 = r2(24 + e + 3.8), B = r2(y + 10.6), Y = /* @__PURE__ */ __name((d2) => r2(y + d2), "Y");
      const d = `M${r2(24 - e - 0.4)},${Y(0.8)} Q24,${Y(-1.4)} ${r2(24 + e + 0.4)},${Y(0.8)} Q${r2(R0 - 0.6)},${Y(3)} ${R0},${B} Q24,${r2(B + 3.4)} ${L0},${B} Q${r2(L0 + 0.6)},${Y(3)} ${r2(24 - e - 0.4)},${Y(0.8)} Z`;
      let s = P(d, col) + clip(`${c.uid}pl${view}`, d, `<rect x="${view === "se" ? 25.4 : 27.2}" y="${Y(-2)}" width="18" height="18" fill="${S}"/><path d="M0,${r2(B - 1.2)} Q24,${r2(B + 2.2)} 48,${r2(B - 1.2)} L48,${r2(B + 6)} L0,${r2(B + 6)} Z" fill="${bord}"/>` + [-10, -6, -2, 2, 6, 10].map((x) => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join("")) + P(d, "none");
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
      return P(d, col, 0.9) + clip(`${c.uid}et${view}`, d, touffes + `<rect x="${view === "se" ? 25.6 : 27.4}" y="${r2(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none", 0.9);
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
          s += P(`${d} Z`, fourrure, 0.8) + [0.3, 0.7].map((f) => P(`M${r2(a + (b - a) * f - 0.7)},${r2(t0 + 1)} q0.7,0.9 1.4,0`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(fourrure, 0.82)}"`)).join("");
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
    function couche2(c, nom, ctx, extra) {
      let s = "";
      for (const [place, a] of Object.entries(c.o.accessoires)) {
        const f = DESSINS[a.id] && DESSINS[a.id][nom];
        if (f) s += f(c, { ...ctx, couche: nom }, c.acc[place], extra);
      }
      return s;
    }
    __name(couche2, "couche");
    function habiller(m, objets, suffixe) {
      const c = { ...m, uid: `${m.uid}${suffixe}`, o: { accessoires: {} }, acc: {} };
      for (const [place, { id, couleurs, ...options }] of Object.entries(objets)) {
        c.o.accessoires[place] = { id, ...options };
        c.acc[place] = couleurs;
      }
      const puis = /* @__PURE__ */ __name((f, nom) => function(cc, ctx) {
        return (f ? f.call(this, cc, ctx) : "") + couche2(cc, nom, ctx);
      }, "puis");
      Object.assign(c, { backItems: puis(m.backItems, "derriere"), body: puis(m.body, "dessus"), neck: puis(m.neck, "cou"), overArms: puis(m.overArms, "surBras") });
      if (objets.tete || objets.cheveux) c.coiffe = (cc, ctx, nom) => couche2(cc, nom, ctx);
      for (const place of ["dessus", "mains"]) {
        const a = objets[place];
        if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](a.couleurs, c));
      }
      if (objets.pieds) c.foot = (cc, x, y, dir, tilt) => couche2(cc, "pieds", {}, [x, y, dir, tilt]);
      return c;
    }
    __name(habiller, "habiller");
    module.exports = { DESSINS, PORTE, couche: couche2, reperes, capucheRabattue, habiller };
  }
});

// personnages/avatar.js
var require_avatar = __commonJS({
  "personnages/avatar.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, shoe, r2 } = require_troupe();
    var choix2 = require_avatar_choix();
    var { verifier: verifier2, couleur: couleur2, couleursAccessoire: couleursAccessoire2, tone, mix, hsl, clarte } = choix2;
    var { couche: couche2, PORTE, capucheRabattue, reperes } = require_avatar_accessoires();
    var TAILLE = { petite: 3.2, moyenne: 0, grande: -2 };
    var CORPS = {
      fine: { sw: 7.6, hw: 9.2, b: 0, arm: 3.4, legW: 5 },
      moyenne: { sw: 8.5, hw: 10.2, b: 0, arm: 3.8, legW: 5.4 },
      large: { sw: 10, hw: 11, b: 0, arm: 4.3, legW: 5.9 },
      ronde: { sw: 8.9, hw: 11.2, b: 1.8, arm: 4.1, legW: 6 }
    };
    function torso(k, hem = 46.6) {
      const mx = (k.sw + k.hw) / 2 + k.b, my = (32.6 + hem) / 2;
      return `M${r2(24 - k.sw)},32.6 Q24,30 ${r2(24 + k.sw)},32.6 Q${r2(24 + mx)},${r2(my)} ${r2(24 + k.hw)},${hem} Q24,${r2(hem + 3)} ${r2(24 - k.hw)},${hem} Q${r2(24 - mx)},${r2(my)} ${r2(24 - k.sw)},32.6 Z`;
    }
    __name(torso, "torso");
    var FACE = { front: { fx: 24, rx: 11.6 }, se: { fx: 22.6, rx: 11.2 } };
    function faceD(v, forme = "rond") {
      const { fx, rx } = FACE[v];
      const a = r2(fx - rx), b = r2(fx + rx);
      const low = forme === "ovale" ? `C${a},28.4 ${r2(fx - 4.8)},33.4 ${fx},33.4 C${r2(fx + 4.8)},33.4 ${b},28.4 ${b},21.6` : forme === "carre" ? `C${a},30.6 ${r2(fx - 8.6)},32 ${fx},32 C${r2(fx + 8.6)},32 ${b},30.6 ${b},21.6` : `a${rx},10.4 0 1,0 ${r2(2 * rx)},0`;
      return `M${a},21.6 ${low} a${rx},10.4 0 1,0 ${r2(-2 * rx)},0 Z`;
    }
    __name(faceD, "faceD");
    var BACK = {
      front: "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z",
      se: "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z",
      ne: "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.2,27 34.6,28.8 Q24,31 13.4,28.8 Q10.8,27 11,21 Z"
    };
    var BOB = {
      front: "M10.8,21.6 Q10,7 24,6.6 Q38,7 37.2,21.6 L37.4,29.8 Q24,31 10.6,29.8 Z",
      se: "M11.6,21.6 Q10.4,7 24,6.8 Q38.6,7 38,21.6 L38.2,29.8 Q26,31 11.8,29.6 Z",
      ne: "M10.8,21 Q10,6.6 24,6.4 Q38,6.6 37.2,21 L37.4,30 Q24,31.6 10.6,30 Z"
    };
    var BANGS = {
      front: "M12,19.4 Q11.6,9.6 24,9.2 Q36.4,9.6 36.2,18.6 Q33.4,13.8 28.4,13.4 Q25.4,15.6 21.6,15.2 Q17.4,15 14.6,17.4 Q12.8,18.6 12,19.4 Z",
      se: "M11.4,19.4 Q11,9.6 23,9 Q35,9.4 35.4,18 Q32.6,13.6 27.6,13.2 Q24.6,15.4 20.6,15 Q16.6,14.8 13.8,17.2 Q12.2,18.4 11.4,19.4 Z"
    };
    var sx = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`), "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`), "mirror");
    var FRANGE = {
      // carré : frange droite, coupée net au-dessus des sourcils
      carre: "M12.2,19 Q11.4,9.4 24,9.2 Q36.6,9.4 35.8,19 Q35,16.8 33.2,16.6 L14.8,16.6 Q13,16.8 12.2,19 Z",
      // mèche : une grande mèche qui part du sommet et retombe sur le côté du front
      meche: "M12,20.6 Q10.4,8.4 22.4,7.4 Q31,6.4 35,9.8 Q37.2,12.4 36.2,18.6 Q34.6,14.8 31.4,14 Q25.4,13.6 20.6,16.8 Q16,19.8 12,20.6 Z",
      // en bataille : frange en pointes
      bataille: "M12.2,19.2 Q11.6,9.6 24,9.2 Q36.4,9.6 36,18.8 L33.8,15 L32.2,17.4 L29.8,13.6 L27.6,16.6 L25,13.4 L22.6,16.8 L20.2,13.8 L17.8,17 L15.6,14.4 L14,17.6 Z"
    };
    FRANGE.deuxChignons = FRANGE.carre;
    var EPIS = {
      front: [
        "M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,5.6 L17.8,6 L19,4.6 L22.4,6.3 L25.2,4.4 L27.4,6.5 L31.2,5.4 L31,7.4 Q35.6,9.2 35.4,13.4 Z",
        "M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,5.6 L17.8,6 L19,4.6 L22.4,6.3 L25.2,4.4 L27.4,6.5 L31.2,5.4 L31,7.4 Q35.6,9.2 35.4,13.4"
      ],
      ne: [
        "M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,5.4 L17.6,6.5 L18.8,4.6 L22.4,6.1 L25.2,4.4 L27.6,6.3 L31.4,5.4 L31.4,7.4 Q36,9 35.8,12.6 Z",
        "M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,5.4 L17.6,6.5 L18.8,4.6 L22.4,6.1 L25.2,4.4 L27.6,6.3 L31.4,5.4 L31.4,7.4 Q36,9 35.8,12.6"
      ]
    };
    var COUETTE = "M12.8,18 Q5.6,19.2 6.4,28.8 Q8.6,26.6 10.2,27.6 Q9.8,23.2 13,21.2 Z";
    function curls(cx, cy, rx, ry, n, bumps = 1.9) {
      let d = "";
      for (let i = 0; i <= n; i++) {
        const t = i / n * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
        if (i === 0) {
          d += `M${r2(x)},${r2(y)}`;
          continue;
        }
        const tm = (i - 0.5) / n * Math.PI * 2 - Math.PI / 2;
        d += ` Q${r2(cx + Math.cos(tm) * (rx + bumps))},${r2(cy + Math.sin(tm) * (ry + bumps))} ${r2(x)},${r2(y)}`;
      }
      return d + " Z";
    }
    __name(curls, "curls");
    function braid(x, y0, y1, dx, c, n = 5) {
      const h = (y1 - y0) / n;
      let s = "";
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, side = i % 2 ? 1 : -1, w = 1.85 - i * 0.05;
        const cx = x + dx * t + side * 0.5, cy = y0 + h * (i + 0.5);
        s += `<g transform="translate(${r2(cx)} ${r2(cy)}) rotate(${side * 32})">${E(0, 0, w, h * 0.68, i % 2 ? c.hairS : c.hair, 0.8)}${P(`M${r2(-w * 0.5)},${r2(-h * 0.2)} Q0,${r2(h * 0.25)} ${r2(w * 0.5)},${r2(-h * 0.2)}`, "none", 0.4)}${L([-w * 0.45, -h * 0.38], [-w * 0.05, -h * 0.5], c.hairH, 0.55)}</g>`;
      }
      const bx = x + dx, by = y1 + 0.2;
      return s + P(`M${r2(bx - 1.1)},${r2(by + 0.4)} L${r2(bx - 1.6)},${r2(by + 2.7)} L${r2(bx - 0.5)},${r2(by + 2)} L${r2(bx)},${r2(by + 3.1)} L${r2(bx + 0.5)},${r2(by + 2)} L${r2(bx + 1.6)},${r2(by + 2.7)} L${r2(bx + 1.1)},${r2(by + 0.4)} Z`, c.hair, 0.7) + E(bx, by, 1.45, 0.95, c.tie, 0.7);
    }
    __name(braid, "braid");
    function lock(a, b, c, w = 2.2) {
      const at = /* @__PURE__ */ __name((t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], "at");
      return limb(a, b, w, c.hair) + L(at(0.08), at(0.3), c.hairH, 0.6) + [0.38, 0.7].map((t) => {
        const p = at(t);
        return L([p[0] - w * 0.45, p[1]], [p[0] + w * 0.45, p[1] + 0.3], c.hairS, 0.5);
      }).join("") + E(b[0], b[1] + 0.2, w * 0.5, 0.5, c.hairS, 0);
    }
    __name(lock, "lock");
    var LOCKS = {
      front: [[[13.4, 17], [12, 32.6]], [[15.2, 19.4], [14.6, 30.4]], [[34.6, 17], [36, 32.6]], [[32.8, 19.4], [33.4, 30.4]]],
      se: [[[12.6, 17.6], [11.6, 31]], [[33.4, 16.4], [35.8, 33.4]], [[35.8, 18.6], [38, 31.4]]],
      ne: [[[13.6, 20], [13, 35.6]], [[18.4, 23], [18, 38]], [[24, 23.6], [24, 38.6]], [[29.6, 23], [30, 38]], [[34.4, 20], [35, 35.6]]]
    };
    var LOCKS_HAUT = "M17.4,10.4 Q16.4,13.4 16.8,16.6 M21.6,9.6 Q21,12.6 21.4,15.4 M26.4,9.8 Q26.8,12.4 26.4,14.4 M31,11 Q32,13.4 32.4,15.6";
    var MILONGUE = {
      front: "M10.6,21.6 Q9.8,7 24,6.6 Q38.2,7 37.4,21.6 Q37.6,28.6 39.6,32.6 Q37,33.8 35.2,32.2 L12.8,32.2 Q11,33.8 8.4,32.6 Q10.4,28.6 10.6,21.6 Z",
      se: "M11.2,21.6 Q10.2,7 24,6.8 Q38.8,7 38.2,21.6 Q38.4,28.6 40.4,32.6 Q37.8,33.8 36,32.2 L13.6,32.2 Q11.8,33.8 9.4,32.6 Q11,28.6 11.2,21.6 Z",
      ne: "M10.8,21 Q10,6.6 24,6.4 Q38,6.6 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z"
    };
    var MECHE_LONGUE = "M14.4,15 Q9.8,22 11.2,31.6 Q12.8,29.6 14.2,30.2 Q13.4,22 15.6,17.6 Z";
    var MECHE_MILONGUE = "M14.4,15 Q10,21.6 11,28.4 Q10.4,30.4 9.2,31.4 Q12.2,31.4 13.8,29.6 Q13.4,22 15.6,17.6 Z";
    var MECHE_ONDULEE = "M14.4,15 Q9.8,18.6 11.2,22.6 Q12.6,26.4 10.4,30 Q9.2,33.2 11.6,35.6 Q12.4,33.2 14,31.8 Q15.6,28.4 13.6,24.8 Q12.6,21.4 15.6,17.6 Z";
    var QUEUE_COTE = "M32.6,27.8 Q37.4,28.6 37.2,33.4 Q37,38.4 33.2,41.8 Q34.2,37.6 33.6,34.4 Q33,31.4 32.4,29.8 Z";
    var QUEUE_COTE_SENS = "M34.6,30.4 Q36.2,34.4 34.6,39";
    var SENS_FRANGE = {
      defaut: "M24.6,9.8 Q19.4,11.4 16,16.6 M26.4,9.8 Q23,12.4 21.8,15 M28.2,10 Q32,11.6 34.4,16",
      carre: "M17.6,10.2 L17.4,16.2 M22,9.6 L21.8,16.2 M26.4,9.6 L26.6,16.2 M30.8,10.2 L31,16.2",
      meche: "M30.6,9.2 Q25.2,10.4 21,15 M27.4,8.4 Q21.6,10.2 16.2,16.8",
      bataille: "M18,12.6 L17.8,16.4 M22.6,12 L22.6,16.2 M27.4,12.4 L27.6,16 M31.8,13.2 L32.2,16.6"
    };
    var sensFrange = /* @__PURE__ */ __name((coupe) => coupe === "carre" || coupe === "deuxChignons" ? SENS_FRANGE.carre : SENS_FRANGE[coupe] || SENS_FRANGE.defaut, "sensFrange");
    var TIRES = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.2,29.8 36.2,32.6 Q32.6,34 28.6,32.8 Q27,28.6 24,28.6 Q21,28.6 19.4,32.8 Q15.4,34 11.8,32.6 Q10.8,29.8 11,21 Z";
    var TIRES_PLEIN = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.2,29.8 36.2,32.6 Q24,35 11.8,32.6 Q10.8,29.8 11,21 Z";
    var NUQUE = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z";
    var RAIE = "M24,7.4 L24,29.4";
    var DOS = {
      courte: { forme: NUQUE, sens: "M23.4,9.6 Q18.6,15 17.6,27.6 M25.2,9.4 Q24.6,18 24,29.4 M27,9.8 Q31,15.6 31,27.4" },
      meche: { forme: NUQUE, sens: "M20.6,9.8 Q17,16 17.6,27.6 M24,9.2 Q25,18 24,29.4 M27.6,9.6 Q32.4,14 31.2,27.4" },
      bataille: {
        forme: "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.6,26 36.6,29.4 L36.8,32.6 L34.4,31 L33.8,34 L31.2,32 L30.4,34.4 L28.4,31.8 L27.4,33.8 Q25.8,30.6 24,29.2 Q22.2,30.6 20.6,33.8 L19.6,31.8 L17.6,34.4 L16.8,32 L14.2,34 L13.6,31 L11.2,32.6 L11.4,29.4 Q10.4,26 11,21 Z",
        sens: "M22.6,9.6 Q18.4,16 17.6,28.6 M25,9.2 Q25,19 25.2,30.4 M27.4,9.8 Q31.6,16 31,28.4"
      },
      carre: {
        forme: "M10.8,21 Q10,6.6 24,6.4 Q38,6.6 37.2,21 L37.8,30.8 Q37.8,32.6 35.6,32.8 Q24,34 12.4,32.8 Q10.2,32.6 10.2,30.8 Z",
        sens: "M21.6,9.8 Q17,17 16.6,30.6 M24.6,9.4 Q25,19 24.4,31.4 M27.6,9.8 Q32,17 32,30.8",
        detail: "M12.8,31 Q24,32.4 35.2,31"
        // le bas du carré, qui rentre
      },
      milongue: {
        forme: "M10.8,21 Q10,6.6 24,6.4 Q38,6.6 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z",
        sens: "M21.4,9.8 Q16.6,18 15.8,32 M24.6,9.4 Q25.2,20 24.4,33.4 M27.8,9.8 Q32.6,18 32.6,32"
      },
      longue: {
        forme: "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.8,30 36.8,36.8 Q36.2,39.6 33.4,40 Q31.4,41.2 29.2,40.2 Q26.6,41.6 24,40.6 Q21.4,41.6 18.8,40.2 Q16.6,41.2 14.6,40 Q11.8,39.6 11.2,36.8 Q10.2,30 11,21 Z",
        sens: "M21.4,9.8 Q16.6,20 17.4,38.8 M24.6,9.4 Q25.6,22 24.2,40 M27.8,9.8 Q32.2,20 30.8,38.8"
      },
      ondulee: {
        forme: "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q38.8,25.4 37,29.2 Q39,33.2 37,37 Q35.8,40.6 32.2,40.2 Q28.2,42 24,40.6 Q19.8,42 15.8,40.2 Q12.2,40.6 11,37 Q9,33.2 11,29.2 Q9.2,25.4 11,21 Z",
        sens: "M21.2,9.8 Q17.4,15 18.8,21.6 Q20,28 17.2,34.6 Q16.2,37.6 17.6,39.6 M24.6,9.4 Q26,16 24,23 Q22.4,30 24.8,39.8 M28,9.8 Q31.6,15 29.6,21.6 Q28.2,28 31,34.6 Q32,37.6 30.6,39.6"
      },
      queue: { forme: TIRES, sens: "M14.4,25.4 Q15.4,17.6 21.6,14.2 M33.6,25.4 Q32.6,17.6 26.4,14.2 M19.6,28.6 Q20.4,20 23,15.4 M28.4,28.6 Q27.6,20 25,15.4" },
      queueCote: { forme: TIRES, sens: "M30.4,10.4 Q20,12 15.2,25.6 M35.6,19.6 Q24,19.4 15.6,26.4 M33.6,27 Q24,27.4 16,27.6 M24.8,8.4 Q17.4,11.6 14.6,24.8" },
      couettes: { forme: TIRES, sens: RAIE + " M23.2,10.6 Q17.2,12.2 13.6,18.2 M23.2,17 Q18,17.4 13.6,19.6 M23,24.6 Q17.6,24.8 13.8,21 M24.8,10.6 Q30.8,12.2 34.4,18.2 M24.8,17 Q30,17.4 34.4,19.6 M25,24.6 Q30.4,24.8 34.2,21" },
      chignon: { forme: TIRES, sens: "M15.4,26.6 Q15.6,17.6 20.6,11.8 M24,29.4 Q23.4,20 24,13.4 M32.6,26.6 Q32.4,17.6 27.4,11.8" },
      chignonBas: { forme: TIRES, sens: "M16.6,12 Q17.4,20 21.4,24.6 M24,10 Q24.4,18 24,23.6 M31.4,12 Q30.6,20 26.6,24.6" },
      deuxChignons: { forme: TIRES, sens: RAIE + " M23.2,25.6 Q18.6,20 17.4,13.2 M23,18 Q19.8,15 18.6,12.4 M24.8,25.6 Q29.4,20 30.6,13.2 M25,18 Q28.2,15 29.4,12.4" },
      couronne: { forme: TIRES, sens: "M17.6,17.8 Q17,23 18.6,28.4 M24,16.6 Q24.4,23 24,29.6 M30.4,17.8 Q31,23 29.4,28.4" },
      tresses: { forme: TIRES, sens: RAIE + " M23.2,10.6 Q18.8,15 17.4,25.4 M23,18 Q20.2,21 18.4,25.6 M24.8,10.6 Q29.2,15 30.6,25.4 M25,18 Q27.8,21 29.6,25.6" },
      locks: { forme: TIRES_PLEIN, sens: "M17.4,10.4 Q15.4,18 15.8,27.6 M21,8.8 Q20,18 20.4,29.2 M24.4,8.4 Q24.6,18 24.4,29.6 M28,8.8 Q29,18 28.4,29.2 M31.4,10.6 Q33.2,18 32.6,27.6" }
    };
    var LOCKS_DOS = [[14.4, 35.6], [18.6, 38.4], [22.6, 37], [26.6, 39], [30.4, 37.4], [34, 35.4]];
    var COUVRE_HAUT = /* @__PURE__ */ new Set(["bonnet", "paille", "casquette", "bandana", "beret"]);
    var OREILLES_CACHEES = { front: /* @__PURE__ */ new Set(["longue", "carre", "milongue", "ondulee"]), se: /* @__PURE__ */ new Set(["carre", "milongue"]) };
    var POINTES = {
      courte: [12, 19.4],
      meche: [11, 19.4],
      bataille: [10, 18.4],
      carre: [19, 30],
      milongue: [21, 33.4],
      longue: [24, 40],
      ondulee: [24, 41],
      queue: [16, 38],
      queueCote: [26, 41],
      couettes: [20, 29],
      chignon: [18, 30],
      deuxChignons: [18, 30],
      couronne: [18, 30],
      tresses: [26, 38],
      bouclee: [12, 30],
      locks: [22, 38]
    };
    var POINTES_DOS = {
      courte: [22, 30],
      meche: [22, 30],
      bataille: [22, 31],
      carre: [24, 31.6],
      milongue: [26, 34],
      longue: [28, 41],
      ondulee: [28, 42],
      queue: [20, 33],
      queueCote: [24, 41],
      couettes: [20, 30],
      chignon: [22, 30],
      deuxChignons: [22, 30],
      couronne: [22, 30],
      tresses: [26, 40],
      bouclee: [16, 30],
      locks: [24, 40]
    };
    function peinture(c, view) {
      const o = c.o;
      if (o.meches !== "pointes" || o.coupe === "rasee") return { h: c, defs: "" };
      const [y0, y1] = (view === "ne" ? POINTES_DOS : POINTES)[o.coupe];
      const g = /* @__PURE__ */ __name((id, a, b) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`, "g");
      const idH = `${c.uid}hg`, idS = `${c.uid}hs`;
      return { h: { ...c, hair: `url(#${idH})`, hairS: `url(#${idS})` }, defs: `<defs>${g(idH, c.hair, c.meche)}${g(idS, c.hairS, c.mecheS)}</defs>` };
    }
    __name(peinture, "peinture");
    var meches = /* @__PURE__ */ __name((c, view, d, sens) => clip(`${c.uid}mc${view}`, d, `<path d="${sens}" fill="none" stroke="${mix(c.meche, c.cheveux, 0.2)}" stroke-width="1.3" stroke-linecap="round"/>`), "meches");
    function couronneTresse(c, view) {
      const k = view === "se" ? -1.2 : 0;
      const [p0, p1, p2] = view === "ne" ? [[12.4, 17.4], [24, 6.8], [35.6, 17.4]] : [[12.6, 15.8], [24, 5.2], [35.4, 15.8]];
      let s = "";
      for (let i = 0; i < 9; i++) {
        const t = (i + 0.5) / 9;
        const x = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * p1[0] + t * t * p2[0] + k, y = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * p1[1] + t * t * p2[1];
        const a = Math.atan2(2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])) * 180 / Math.PI;
        s += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(a + (i % 2 ? 22 : -22))})">${E(0, 0, 2.1, 1.25, i % 2 ? c.hairS : c.hair, 0.8)}</g>`;
      }
      return s;
    }
    __name(couronneTresse, "couronneTresse");
    function hairBehindBody(c0, view) {
      const { h: c } = peinture(c0, view);
      const coupe = c.o.coupe;
      if (view === "ne") return "";
      if (coupe === "longue") return P(view === "se" ? "M12.4,22 Q11,34 13.6,40 L34.6,40 Q37.4,34 36.4,22 Z" : "M11.6,22 Q10.4,34 13,40.4 L35,40.4 Q37.6,34 36.4,22 Z", c.hairS);
      if (coupe === "ondulee") {
        const d = "M11.4,22 Q8.4,26.4 10.4,30.6 Q8.2,34.8 10.6,38.6 Q11.8,42.4 15.6,41.8 Q19.6,43.4 24,41.8 Q28.4,43.4 32.4,41.8 Q36.2,42.4 37.4,38.6 Q39.8,34.8 37.6,30.6 Q39.6,26.4 36.6,22 Z";
        return P(view === "se" ? sx(d, 0.4) : d, c.hairS);
      }
      return "";
    }
    __name(hairBehindBody, "hairBehindBody");
    function hairBack(c, view) {
      const { coupe } = c.o;
      const H = c.hair, S = c.hairS;
      let s = "";
      if (view === "ne") return s;
      if (coupe === "chignon" && !c.couvert) {
        s += E(view === "se" ? 25.4 : 24, 7.8, 4.4, 3.6, H) + P(`M${view === "se" ? 22 : 20.6},6.8 Q${view === "se" ? 25.4 : 24},5 ${view === "se" ? 28.8 : 27.4},6.8`, "none", 0.6);
      }
      if (coupe === "deuxChignons" && !c.couvert && !c.oreillesPortees) {
        const xs = view === "se" ? [14.6, 32] : [15.4, 32.6];
        s += xs.map((x) => E(x, 8.8, 3.7, 3.4, H) + P(`M${r2(x - 1.9)},8.8 Q${x},6.2 ${r2(x + 1.9)},8.6`, "none", 0.55)).join("");
      }
      if (coupe === "queue") {
        const q = "M32.6,10.8 Q40.8,9.8 41,17.4 Q41,23.2 37.4,27.2 Q37.6,22.4 36.6,19.2 Q35.4,16 33,15.4 Z";
        s += P(view === "se" ? sx(q, 0.6) : q, H) + P(view === "se" ? "M37.2,13.4 Q39.6,18 38.6,23.6" : "M36.6,13.4 Q39,18 38,23.6", "none", 0.5) + E(view === "se" ? 34.6 : 34, 12.6, 1.5, 1.4, c.tie, 0.9);
      }
      if (coupe === "bouclee") {
        const cl = curls(view === "se" ? 23.6 : 24, 17.6, 15.4, 11.6, 14);
        s += P(cl, H) + clip(`${c.uid}cb${view}`, cl, `<rect x="4" y="22" width="40" height="14" fill="${S}"/>`) + P(cl, "none");
      }
      return s;
    }
    __name(hairBack, "hairBack");
    var couettes = /* @__PURE__ */ __name((c, view) => {
      const left = view === "se" ? sx(COUETTE, -0.6) : COUETTE;
      const right = view === "se" ? sx(mirror(COUETTE), 0.6) : mirror(COUETTE);
      const ties = view === "se" ? [[11.6, 19.6], [36.8, 19.6]] : [[12.2, 19.6], [35.8, 19.6]];
      return P(left, c.hair) + P(right, c.hair) + P(sx("M8.6,22.4 Q8,25.4 8.4,27.6", view === "se" ? -0.6 : 0), "none", 0.5) + ties.map(([x, y]) => E(x, y, 1.5, 1.3, c.tie, 0.8)).join("");
    }, "couettes");
    var MODES = { rire: "joy", endormi: "blink", surpris: "big", gene: "squeeze", triste: "sad", fache: "angry" };
    function cils(c, eyes, ey, ctx) {
      const o = c.o;
      if (o.cils === "sans") return "";
      const rest = ctx.expr === "neutre" && o.formeYeux === "paisibles" ? "sleepy" : "open";
      const mode = ctx.eyeMode || MODES[ctx.expr] || (ctx.blink ? "blink" : rest);
      const cx = (eyes[0][0] + eyes[1][0]) / 2;
      const angles = o.cils === "recourbes" ? [28, 52, 74] : [50, 74], len = o.cils === "recourbes" ? 1.25 : 1;
      let s = "";
      for (const [x, y, rx] of eyes) {
        const m = cx > x ? -1 : 1;
        if (mode === "open" || mode === "big") {
          const ry = mode === "big" ? ey + 0.1 : ey, rr = mode === "big" ? rx + 0.25 : rx;
          for (const a of angles) {
            const t = a * Math.PI / 180, bx = x + m * rr * Math.sin(t), by = y - ry * Math.cos(t), t2 = t + 0.45;
            s += P(`M${r2(bx)},${r2(by)} Q${r2(bx + m * len * 0.55 * Math.sin(t2))},${r2(by - len * 0.8 * Math.cos(t2) - 0.15)} ${r2(bx + m * len * Math.sin(t2 + 0.25))},${r2(by - len * Math.cos(t2 + 0.25))}`, "none", 0.6);
          }
        } else if (mode === "blink" || mode === "sleepy" || mode === "joy") {
          const ex = x + m * (mode === "sleepy" ? rx + 0.4 : 1.7), eyy = mode === "joy" ? y + 1 : mode === "sleepy" ? y + 0.5 : y + 0.4;
          for (let i = 0; i < angles.length; i++) s += L([ex - m * 0.35 * i, eyy + 0.15 * i], [ex + m * (0.55 + 0.2 * i), eyy + 0.95 - 0.1 * i], OUT, 0.55);
        }
      }
      return s;
    }
    __name(cils, "cils");
    function levres(c, ctx, mx, my) {
      if (!c.levres) return "";
      let d = null;
      if (ctx.expr === "neutre") d = BOUCHE[c.o.bouche](mx, my);
      else if (ctx.expr === "content" && !ctx.open) d = `M${r2(mx - 1.7)},${my} Q${mx},${r2(my + 1.6)} ${r2(mx + 1.7)},${my}`;
      else if (ctx.expr === "triste") d = `M${r2(mx - 1.4)},${r2(my + 1.1)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.4)},${r2(my + 1.1)}`;
      return d ? `<path d="${d}" fill="none" stroke="${tone(c.levres, 0.82)}" stroke-width="1.15" stroke-linecap="round"/>` : "";
    }
    __name(levres, "levres");
    function nuque(c) {
      const d = "M19.2,24.6 L28.8,24.6 L29.2,33.6 L18.8,33.6 Z";
      return P(d, c.skinS);
    }
    __name(nuque, "nuque");
    function head(c0, ctx) {
      const { view } = ctx;
      const { h: c, defs } = peinture(c0, view);
      const o = c.o, H = c.hair, S = c.hairS, HI = c0.hairH;
      const coupe = o.coupe, couvert = c0.couvert;
      const avecMeches = o.meches === "meches" && coupe !== "rasee";
      let s = defs + hairBack(c, view);
      if (view === "ne") {
        const longs = coupe === "longue" || coupe === "ondulee" || coupe === "milongue";
        const ombre = /* @__PURE__ */ __name((forme) => clip(`${c.uid}h`, forme, `<rect x="8" y="4" width="34" height="40" fill="${S}"/><ellipse cx="22.4" cy="${longs ? 21 : 18.4}" rx="13.8" ry="${longs ? 16.4 : 12.8}" fill="${H}"/>`), "ombre");
        if (coupe === "rasee") {
          const tete = "M11.6,21 Q10.8,8 24,7.6 Q37.2,8 36.4,21 Q36.8,29.6 35.2,32.2 Q24,35.4 12.8,32.2 Q11.2,29.6 11.6,21 Z";
          const duvet = "M8,4 L40,4 L40,27.4 Q34.6,29.6 31,28.6 Q27.6,30.4 24,29.8 Q20.4,30.4 17,28.6 Q13.4,29.6 8,27.4 Z";
          s += P(tete, c.skin) + clip(`${c.uid}rz`, tete, `<path d="M8,31.6 Q24,34.4 40,31.6 L40,40 L8,40 Z" fill="${c.skinS}"/><path d="${duvet}" fill="${c.buzz}"/>` + P("M14,28.8 Q17.4,30 20.4,29.4 M27.6,29.4 Q30.6,30 34,28.8", "none", 0.45) + [[17.4, 12], [21.4, 10.4], [26.6, 10.6], [30.6, 12.4], [19, 17], [24, 16.2], [29, 17.2], [16.4, 21.4], [31.6, 21.4]].map(([x, y]) => L([x, y], [x + 0.4, y + 1], c.buzzS, 0.5)).join("") + L([17, 10.6], [21.4, 8.8], tone(c.buzz, 1.25), 1.1)) + P(tete, "none");
          s += E(11.6, 22.6, 1.5, 2.1, c.skin) + E(36.4, 22.6, 1.5, 2.1, c.skin);
          return s + couche2(c0, "cheveux", ctx) + couche2(c0, "tete", ctx);
        }
        s += E(12.6, 23, 1.6, 2.2, c.skin) + E(35.4, 23, 1.6, 2.2, c.skin);
        if (coupe === "bouclee") {
          const bas = curls(24, 27.8, 13.4, 6, 10, 1.7);
          s += P(bas, S) + P(bas, "none");
          const cl = curls(24, 17.6, 15.4, 11.6, 14);
          s += P(cl, H) + ombre(cl) + P(cl, "none") + `<path d="${[[18, 12], [24, 10.4], [30, 12], [15.4, 18], [21.4, 17], [27, 17.4], [32.6, 18.6], [18.4, 23.6], [24.4, 24.4], [30.2, 23.4]].map(([x, y]) => `M${r2(x + 1.2)},${r2(y - 0.7)} Q${r2(x - 0.9)},${r2(y - 1.4)} ${r2(x - 0.9)},${y} Q${r2(x - 0.5)},${r2(y + 1.2)} ${r2(x + 0.9)},${r2(y + 0.6)}`).join(" ")}" fill="none" stroke="${tone(c0.hair, 0.66)}" stroke-width="0.7" stroke-linecap="round"/>` + L([16.4, 11], [20.6, 9], HI, 1.2);
          if (avecMeches) s += meches(c0, view, cl, "M17,10 Q15.4,17 17,25 M24,8.4 Q24.6,17 23.8,27 M31,10 Q32.6,17 31,25");
          return s + couche2(c0, "cheveux", ctx) + couche2(c0, "tete", ctx);
        }
        const dos = DOS[coupe === "chignon" && couvert ? "chignonBas" : coupe];
        if (coupe === "locks") s += LOCKS_DOS.map(([x, y1]) => lock([x, 24], [x + (x - 24) * 0.04, y1], c)).join("");
        s += P(dos.forme, H) + ombre(dos.forme) + P(dos.forme, "none") + clip(`${c.uid}hs`, dos.forme, P(dos.sens + (dos.detail ? " " + dos.detail : ""), "none", 0.55)) + L([16.4, 10.6], [21.6, 8.6], HI, 1.3);
        if (avecMeches) s += meches(c0, view, dos.forme, dos.sens);
        if (coupe === "bataille" && !couvert) s += P(EPIS.ne[0], H, 0) + P(EPIS.ne[1], "none", 1) + L([16.6, 7.4], [21.4, 6.6], HI, 1.1);
        if (coupe === "queue") {
          const queue = "M21.8,14 Q19.2,21.4 21.2,29.6 Q22.4,32.6 24,33.2 Q25.6,32.6 26.8,29.6 Q28.8,21.4 26.2,14 Z";
          s += P(queue, H) + clip(`${c.uid}qd`, queue, `<rect x="24.6" y="12" width="6" height="24" fill="${S}"/>`) + P(queue, "none") + P("M23,17 Q22.2,23.6 23.2,30.4 M25.2,17 Q25.8,23.6 24.8,30.6", "none", 0.5) + E(24, 14, 2.4, 1.5, c.tie, 0.8);
        }
        if (coupe === "queueCote") s += P(mirror(QUEUE_COTE), H) + P(mirror(QUEUE_COTE_SENS), "none", 0.5) + E(13.8, 28.4, 1.6, 1.4, c.tie, 0.8);
        if (coupe === "couettes") s += couettes(c, "front");
        if (coupe === "chignon") {
          s += couvert ? E(24, 25.4, 3.8, 3.2, H) + P("M21.2,24.6 Q24,23 26.8,24.6", "none", 0.55) : E(24, 9.6, 5.2, 4.2, H) + P("M20.4,9.4 Q24,6.6 27.6,9.4", "none", 0.6) + L([20.8, 7.8], [23.4, 6.8], HI, 1.1);
        }
        if (coupe === "deuxChignons" && !couvert && !c0.oreillesPortees) s += [16.8, 31.2].map((x) => E(x, 10.4, 3.7, 3.4, H) + P(`M${r2(x - 1.9)},10.4 Q${x},7.8 ${r2(x + 1.9)},10.2`, "none", 0.55)).join("");
        if (coupe === "couronne" && !couvert) s += couronneTresse(c, view);
        if (coupe === "tresses") s += braid(17.4, 25.4, 37.6, -0.6, c) + braid(30.6, 25.4, 37.6, 0.6, c);
        return s + couche2(c0, "cheveux", ctx) + couche2(c0, "tete", ctx);
      }
      const se = view === "se";
      const face = faceD(view, o.visage);
      const back = coupe === "carre" ? BOB[view] : coupe === "milongue" ? MILONGUE[view] : BACK[view];
      if (coupe !== "rasee" && coupe !== "bouclee") s += P(back, H) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="10" fill="${S}"/>`) + P(back, "none");
      const oreilles = !OREILLES_CACHEES[view].has(coupe);
      if (oreilles) s += se ? E(35, 23.2, 1.5, 2.1, c.skin) : E(11.8, 22.8, 1.5, 2.1, c.skin) + E(36.2, 22.8, 1.5, 2.1, c.skin);
      const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]] : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
      const quelques = se ? [0, 1, 3] : [0, 1, 3, 4];
      const cheeks = se ? [[15.2, 1.8], [28.2, 1.5]] : [[16.6, 1.9], [31.4, 1.9]];
      const frange = coupe === "rasee" || coupe === "bouclee" ? null : FRANGE[coupe] ? se ? sx(FRANGE[coupe], -1) : FRANGE[coupe] : BANGS[view];
      s += P(face, c.skin);
      s += clip(`${c.uid}f`, face, (frange ? `<path d="${frange}" fill="${c.skinS}" transform="translate(0 1.4)"/>` : "") + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.1, c.cheek, 0)).join("") + (o.rousseur === "non" ? "" : fr.filter((p, i) => o.rousseur === "oui" || quelques.includes(i)).map(([x, y]) => E(x, y, 0.38, 0.38, c.freckle, 0)).join("")));
      s += P(face, "none");
      if (o.grain !== "non") {
        const [x, y] = GRAIN[o.grain][view];
        s += E(x, y, 0.45, 0.45, c.mole, 0);
      }
      s += couche2({ ...c0, oreillesVisibles: oreilles }, "oreilles", ctx) + couche2(c0, "joues", ctx);
      if (coupe === "rasee") {
        const cap = se ? "M11.8,19.6 Q11.6,8.4 23,7.8 Q34.8,8.2 35.4,19 Q33,14.2 23.2,13.8 Q14.6,14 11.8,19.6 Z" : "M12.4,19.8 Q12.2,8.2 24,7.8 Q35.8,8.2 35.6,19.8 Q33.4,13.8 24,13.6 Q14.6,13.8 12.4,19.8 Z";
        s += P(cap, c.buzz, 0.9) + L(se ? [15.4, 11.4] : [17, 11], se ? [21.4, 9.6] : [23, 9.4], tone(c.buzz, 1.25), 1);
      } else if (coupe === "bouclee") {
        const top = curls(se ? 23.2 : 24, 11.6, 12.6, 4.6, 11, 1.6);
        s += P(top, H) + L(se ? [15.6, 9.6] : [17, 9.4], se ? [21, 8] : [22.4, 7.8], HI, 1.1);
        if (avecMeches) s += meches(c, view, top, sx("M18,8.6 Q17.6,11 18.4,14 M24,7.4 Q24.4,10 24,13.6 M30,8.6 Q30.4,11 29.6,14", se ? -0.8 : 0));
      } else {
        if (coupe === "bataille" && !couvert) s += P(se ? sx(EPIS.front[0], -1) : EPIS.front[0], H, 0) + P(se ? sx(EPIS.front[1], -1) : EPIS.front[1], "none", 1);
        const sens = se ? sx(sensFrange(coupe), -1) : sensFrange(coupe);
        s += P(frange, H) + clip(`${c.uid}sf`, frange, P(sens, "none", 0.5)) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], HI, 1.3);
        if (avecMeches) s += meches(c, view, frange, sens);
        const long = { longue: MECHE_LONGUE, milongue: MECHE_MILONGUE, ondulee: MECHE_ONDULEE }[coupe];
        if (long) s += se ? P(sx(mirror(long), -0.6), H) : P(long, H) + P(mirror(long), H);
        if (coupe === "carre") {
          const lk = "M14.2,15.4 Q10.4,20.4 11,29.4 L14.4,29.4 Q13.6,22.4 15.8,17.8 Z";
          s += se ? P(sx(mirror(lk), -0.4), H) : P(lk, H) + P(mirror(lk), H);
        }
        if (coupe === "queueCote") s += P(se ? sx(QUEUE_COTE, 0.4) : QUEUE_COTE, H) + P(se ? sx(QUEUE_COTE_SENS, 0.4) : QUEUE_COTE_SENS, "none", 0.5) + E(se ? 34.6 : 34.2, 28.4, 1.6, 1.4, c.tie, 0.8);
        if (coupe === "couronne" && !couvert) s += couronneTresse(c, view);
        if (coupe === "tresses") s += se ? braid(12.6, 26.4, 37.4, -0.4, c) + braid(34.2, 26, 37.4, 0.8, c) : braid(13.4, 26, 37.8, -0.6, c) + braid(34.6, 26, 37.8, 0.6, c);
        if (coupe === "couettes") s += couettes(c, view);
        if (coupe === "locks") s += P(se ? sx(LOCKS_HAUT, -1) : LOCKS_HAUT, "none", 0.6) + LOCKS[view].map(([a, b]) => lock(a, b, c)).join("");
      }
      s += couche2(c0, "cheveux", ctx);
      const brow = { fins: [1, -4.1], epais: [1.6, -4.2], doux: [0.95, -3.7] }[o.sourcils];
      const [ex, ey] = YEUX[o.formeYeux];
      const eyes = se ? [[17.2, 22.6, r2(1.55 * ex)], [25.2, 22.6, r2(1.35 * ex)]] : [[19.4, 22.6, r2(1.6 * ex)], [28.6, 22.6, r2(1.6 * ex)]];
      const mouth = [se ? 20.8 : 24, 27];
      s += expression({
        eyes,
        ry: ey,
        eyeColor: c.eye,
        restEyes: o.formeYeux === "paisibles" ? "sleepy" : void 0,
        brow: tone(c0.hair, 0.55),
        browY: brow[1] - Math.max(0, ey - 2.35) * 0.6,
        browW: brow[0],
        mouth,
        mw: 1.7,
        mouthC: "#7A3B30",
        tongue: "#E07A72",
        neutral: BOUCHE[o.bouche],
        cheeks,
        cheekY: 26.2,
        temple: [se ? 12.6 : 13.4, 12.4],
        anger: [40, 6.8],
        zz: [36.4, 7.4 - Math.min(c.dy, 0)]
      }, ctx);
      const open = !ctx.blink && !ctx.eyeMode && (ctx.expr === "content" || ctx.expr === "neutre" && o.formeYeux !== "paisibles");
      if (open && o.formeYeux === "rieurs") {
        for (const [x, y, rx] of eyes) {
          const t = y + ey * 0.42;
          s += `<path d="M${r2(x - rx - 0.5)},${r2(t + 0.5)} Q${x},${r2(t - 0.7)} ${r2(x + rx + 0.5)},${r2(t + 0.5)} L${r2(x + rx + 0.5)},${r2(y + ey + 0.7)} L${r2(x - rx - 0.5)},${r2(y + ey + 0.7)} Z" fill="${c.skin}"/>` + P(`M${r2(x - rx - 0.3)},${r2(t + 0.4)} Q${x},${r2(t - 0.6)} ${r2(x + rx + 0.3)},${r2(t + 0.4)}`, "none", 0.8);
        }
      }
      if (open && o.formeYeux === "amande") {
        const cx = (eyes[0][0] + eyes[1][0]) / 2;
        for (const [x, y, rx] of eyes) {
          const m = cx > x ? -1 : 1;
          s += P(`M${r2(x - m * rx * 0.9)},${r2(y - ey * 0.55)} Q${r2(x - m * rx * 0.1)},${r2(y - ey * 1.45)} ${r2(x + m * (rx + 0.7))},${r2(y - ey * 0.5)}`, "none", 0.7);
        }
      }
      s += cils(c0, eyes, ey, ctx) + levres(c0, ctx, mouth[0], mouth[1]);
      s += couche2(c0, "visage", ctx) + couche2(c0, "tete", ctx);
      return s;
    }
    __name(head, "head");
    var YEUX = { ronds: [1, 2.35], amande: [1.12, 1.95], grands: [1.16, 2.75], rieurs: [1, 2.35], paisibles: [1, 2.35] };
    var BOUCHE = {
      douce: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.3)} ${r2(mx + 1.4)},${r2(my + 0.3)}`, "douce"),
      sourire: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 2)},${r2(my)} Q${mx},${r2(my + 1.9)} ${r2(mx + 2)},${r2(my)}`, "sourire"),
      malice: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.5)},${r2(my + 0.7)} Q${r2(mx + 0.3)},${r2(my + 1.3)} ${r2(mx + 1.7)},${r2(my - 0.2)}`, "malice"),
      serieuse: /* @__PURE__ */ __name((mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.7)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.7)}`, "serieuse")
    };
    var GRAIN = { joue: { front: [31, 27.2], se: [26.8, 27] }, levre: { front: [26.4, 28.6], se: [23, 28.6] } };
    function skirt(c, view, sway, top, hem) {
      const { hw } = c.k;
      const a = hw + 0.2, b = hw + 2.4 + (hem - top) * 0.1;
      const d = `M${r2(24 - a)},${top} L${r2(24 + a)},${top} L${r2(24 + b + sway)},${hem} Q${r2(24 + sway)},${r2(hem + 1.8)} ${r2(24 - b + sway)},${hem} Z`;
      const shadeX = view === "se" ? 25.4 : 27.2;
      const pleats = [-0.45, 0.1].map((t) => L([24 + t * a, top + 2.4], [24 + t * b * 1.1 + sway, hem + 0.4], c.basS, 0.6)).join("");
      return P(d, c.bas) + clip(`${c.uid}sk`, d, `<path d="M${shadeX},${top} L48,${top} L48,${hem + 3} L${r2(shadeX + 1 + sway)},${hem + 3} Z" fill="${c.basS}"/>` + pleats + L([24 - a + 1, top + 1], [24 - b + 1.6 + sway, hem - 0.4], c.basH, 0.9)) + P(d, "none");
    }
    __name(skirt, "skirt");
    function shortLeg(c, x, frayed = false) {
      const w = c.legW + 1.8, y0 = c.hip - 0.4, y1 = c.hip + c.shortLen;
      let s = `<rect x="${r2(x - w / 2)}" y="${r2(y0)}" width="${r2(w)}" height="${r2(y1 - y0)}" rx="1.2" fill="${c.bas}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r2(x + w / 2 - 1.9)}" y="${r2(y0 + 0.6)}" width="1.2" height="${r2(y1 - y0 - 1.2)}" rx="0.5" fill="${c.basS}"/>`;
      s += frayed ? P(`M${r2(x - w / 2 + 0.2)},${r2(y1 - 0.2)} L${r2(x - w / 4)},${r2(y1 + 1.2)} L${x},${r2(y1 + 0.2)} L${r2(x + w / 4)},${r2(y1 + 1.4)} L${r2(x + w / 2 - 0.2)},${r2(y1 - 0.2)}`, "none", 0.8) : L([x - w / 2 + 0.7, y1 - 1.2], [x + w / 2 - 0.7, y1 - 1.2], c.basS, 0.6);
      return s;
    }
    __name(shortLeg, "shortLeg");
    function body(c, ctx) {
      const { view, n, walk } = ctx;
      const k = c.k, bas = c.o.bas;
      const robeE = bas === "robeEntiere", haut = robeE ? null : c.o.haut;
      const ne = view === "ne", se = view === "se";
      const tucked = bas === "jupe" || bas === "salopette" || bas === "robe" || robeE;
      const hem = tucked ? 44.8 : 46.6;
      const T = torso(k, hem);
      const top = robeE ? c.bas : c.top, topS = robeE ? c.basS : c.topS, topH = robeE ? c.basH : c.topH;
      const o = se ? 21.6 : 24;
      const sway = walk ? [0.5, 0, -0.5, 0][n] : 0;
      let s = "";
      if (bas === "jupe") s += skirt(c, view, sway, 43.6, c.skirtHem);
      if (bas === "robe" || robeE) s += skirt(c, view, sway, 43.6, c.robeHem);
      if (bas === "short") s += `<rect x="21.6" y="44.4" width="4.8" height="4.6" fill="${c.bas}"/>`;
      const mar = haut === "mariniere";
      s += P(T, mar ? c.base : top);
      let inner = mar ? [35.2, 38, 40.8, 43.6, 46.4].map((y) => `<rect x="8" y="${y}" width="32" height="1.3" fill="${c.stripe}"/>`).join("") + `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="rgba(60,40,25,.13)"/>` : `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="${topS}"/><path d="M8,${hem - 0.6} Q24,${hem + 2.4} 40,${hem - 0.6} L40,52 L8,52 Z" fill="${topS}"/><rect x="${r2(24 - k.sw + 0.1)}" y="34" width="1.3" height="10" rx="0.6" fill="${topH}"/>`;
      if (haut === "pull" || haut === "sweat") inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>` + (haut === "pull" ? [17, 20, 23, 26, 29, 32].map((x) => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join("") : "");
      const under = bas === "robe" || bas === "salopette" ? c.bas : c.tee;
      if (haut === "veste" && !ne) {
        inner += `<path d="M${o - 3.4},31.6 L${o + 3.4},31.6 L${o + 3},49 L${o - 3},49 Z" fill="${under}"/>` + L([o - 3.3, 32], [o - 2.9, 48.8], OUT, 0.8) + L([o + 3.3, 32], [o + 2.9, 48.8], OUT, 0.8);
      }
      if (haut === "sweat" && !ne) {
        const pk = `M${o - 5.2},40.6 L${o + 5.2},40.6 L${o + 6.4},${hem - 1.4} L${o - 6.4},${hem - 1.4} Z`;
        inner += P(pk, tone(top, 0.92), 0.7) + P(`M${o - 5.2},40.6 Q${o - 5.4},43 ${o - 6.4},${hem - 1.4} M${o + 5.2},40.6 Q${o + 5.4},43 ${o + 6.4},${hem - 1.4}`, "none", 0.6);
      }
      s += clip(`${c.uid}t`, T, inner) + P(T, "none");
      if (ne) {
        s += P("M24,33.8 L24,47.4", "none", 0.5);
        if (haut === "chemise" || haut === "veste") s += P("M17.6,31.4 Q24,34.4 30.4,31.4 L30,33.6 Q24,36.2 18,33.6 Z", topS, 0.8);
        if (haut === "sweat" && !c.o.accessoires.dessus) s += capucheRabattue(c.uid, view, reperes(c), top, topS);
        if (robeE) s += P("M17.6,31.4 Q24,34 30.4,31.4 L30,33.2 Q24,35.8 18,33.2 Z", "#FFFDF6", 0.8);
      } else if (robeE) {
        s += P(`M${o - 0.3},32.6 Q${o - 4.4},30.8 ${o - 5.4},32.8 Q${o - 4.6},35.8 ${o - 0.5},34.4 Z`, "#FFFDF6", 0.8) + P(`M${o + 0.3},32.6 Q${o + 4.4},30.8 ${o + 5.4},32.8 Q${o + 4.6},35.8 ${o + 0.5},34.4 Z`, "#FFFDF6", 0.8);
      } else if (haut === "chemise") {
        s += P(`M${o - 4.6},31.2 L${o},34.8 L${o - 1.6},36.4 Z`, "#FFFDF6", 0.8) + P(`M${o + 4.6},31.2 L${o},34.8 L${o + 1.6},36.4 Z`, "#FFFDF6", 0.8);
        s += L([o, 35], [o + (se ? -0.4 : 0), hem + 1], OUT, 0.6) + [38.4, 41.8, 45].filter((y) => y < hem).map((y) => E(o + 1, y, 0.55, 0.55, "#FFFDF6", 0.5)).join("");
      } else if (haut === "pull") {
        s += P(`M${o - 4},31.4 Q${o},34.6 ${o + 4},31.4 L${o + 4},32.8 Q${o},36 ${o - 4},32.8 Z`, topS, 0.8);
      } else if (haut === "veste") {
        s += P(`M${o - 3.4},31.6 L${o - 1.2},36.4 L${o - 4.6},34 Z`, topS, 0.8) + P(`M${o + 3.4},31.6 L${o + 1.2},36.4 L${o + 4.6},34 Z`, topS, 0.8);
      } else if (mar) {
        s += P(`M${o - 5.4},31.8 Q${o},33.4 ${o + 5.4},31.8`, "none", 0.8);
      } else if (haut === "tshirt") {
        s += P(`M${o - 3.2},31.4 Q${o},34.4 ${o + 3.2},31.4`, "none", 0.8);
      }
      if (bas === "salopette") {
        s += P(`M${r2(24 - k.hw + 0.2)},43.2 L${r2(24 + k.hw - 0.2)},43.2 L${r2(24 + k.hw)},46.6 Q24,48 ${r2(24 - k.hw)},46.6 Z`, c.bas) + P(`M${r2(24 - k.hw + 1)},43.4 L${r2(24 - k.hw + 1.4)},46.2`, "none", 0.5);
        if (haut !== "veste" || ne) s += bretelles(c, view, o, true);
      }
      if (robeE) {
        const band = "M0,42.4 L48,42.4 L48,44.4 L0,44.4 Z";
        s += clip(`${c.uid}rc`, T, P(band, c.basS, 0.6)) + P(T, "none");
        if (ne) {
          s += P("M24,43.4 L22.6,47.6 L24.2,47 L25,47.8 Z", c.basS, 0.6) + P("M24,43.4 L25.6,47.4 L24.4,46.8 Z", c.basS, 0.6) + E(21.6, 42.9, 2.1, 1.25, c.basS, 0.7) + E(26.4, 42.9, 2.1, 1.25, c.basS, 0.7) + E(24, 43.3, 0.95, 0.95, c.bas, 0.6);
        }
      }
      if (bas === "robe" && (haut !== "veste" || ne)) {
        const d = ne ? "M0,40.2 Q24,41.6 48,40.2 L48,50 L0,50 Z" : `M${o - 6.6},36.6 Q${o},37.8 ${o + 6.6},36.6 L${r2(o + k.hw + 1.6)},45.8 L${r2(o - k.hw - 1.6)},45.8 Z`;
        s += clip(`${c.uid}rb`, T, P(d, c.bas) + `<rect x="${se ? 25.4 : 27.2}" y="36" width="14" height="12" fill="${c.basS}" opacity="0.7"/>`) + P(T, "none") + bretelles(c, view, o, false);
      }
      return s + couche2(c, "dessus", ctx);
    }
    __name(body, "body");
    function bretelles(c, view, o, bavette) {
      const { sw } = c.k;
      if (view === "ne") {
        return limb([24 - sw + 2, 32.4], [27.4, bavette ? 43.4 : 40.6], 1.6, c.bas) + limb([24 + sw - 2, 32.4], [20.6, bavette ? 43.4 : 40.6], 1.6, c.bas);
      }
      let s = "";
      if (bavette) {
        const bib = `M${o - 5},37.2 L${o + 5},37.2 L${o + 5.4},44 L${o - 5.4},44 Z`;
        s += P(bib, c.bas) + clip(`${c.uid}bv`, bib, `<rect x="${o + 2.4}" y="36" width="5" height="9" fill="${c.basS}"/>`) + P(bib, "none") + P(`M${o - 2.4},39.2 L${o + 2.4},39.2 L${o + 2.2},42 L${o - 2.2},42 Z`, "none", 0.6);
      }
      const y0 = bavette ? 37.8 : 37.2, x0 = bavette ? 4.2 : 5.4;
      s += limb([o - x0, y0], [24 - sw + 1.8, 32.2], 1.6, c.bas) + limb([o + x0, y0], [24 + sw - 1.8, 32.2], 1.6, c.bas);
      if (bavette) s += E(o - x0, y0 + 0.2, 0.8, 0.8, "#E8C46A", 0.6) + E(o + x0, y0 + 0.2, 0.8, 0.8, "#E8C46A", 0.6);
      return s;
    }
    __name(bretelles, "bretelles");
    function neck(c, ctx) {
      const { view } = ctx;
      const o = view === "se" ? 21.6 : 24;
      let s = "";
      if (c.o.haut === "sweat" && c.o.bas !== "robeEntiere" && view !== "ne" && !c.o.accessoires.dessus) {
        const dessous = c.o.bas === "robe" || c.o.bas === "salopette";
        s += P(`M${o - 6.4},31 Q${o},35.6 ${o + 6.4},31 L${o + 8.2},32.6 Q${o},39 ${o - 8.2},32.6 Z`, c.topS, 0.9);
        if (!dessous) s += [-1.8, 1.8].map((d) => L([o + d, 35.2], [o + d * 1.2, 40], OUT, 1.5) + L([o + d, 35.2], [o + d * 1.2, 40], c.tee, 0.6) + E(o + d * 1.2, 40.3, 0.6, 0.6, c.tee, 0.5)).join("");
      }
      return s + couche2(c, "cou", ctx);
    }
    __name(neck, "neck");
    function book(x, y) {
      return P(`M${x - 6},${y} L${x + 6},${y} L${x + 6},${y + 6.4} L${x - 6},${y + 6.4} Z`, "#7A4E2C", 0.9) + P(`M${x - 5.2},${y - 0.6} Q${x - 2.6},${y - 1.6} ${x},${y} Q${x + 2.6},${y - 1.6} ${x + 5.2},${y - 0.6} L${x + 5.2},${y + 5.4} Q${x + 2.6},${y + 4.6} ${x},${y + 5.8} Q${x - 2.6},${y + 4.6} ${x - 5.2},${y + 5.4} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.8], OUT, 0.6) + [1.6, 2.8, 4].map((d) => L([x - 4.2, y + d], [x - 1.2, y + d], "#C9B98F", 0.45) + L([x + 1.2, y + d], [x + 4.2, y + d], "#C9B98F", 0.45)).join("");
    }
    __name(book, "book");
    function pose2({ pose: pose3, n }) {
      const dy = this.dy, e = this.k.sw - 8.5;
      const [shL, shR] = this.shoulders;
      if (pose3 === "salut") return { open: true, right: arm(this, shR, n === 0 ? [37.4 + e * 0.64, 25.4 + dy] : [38.8 + e * 0.64, 27.4 + dy]) };
      if (this.geste === "grelotter") {
        const d = n ? 0.5 : -0.5;
        const left = arm(this, shL, [27.4 + d, 38.6 + dy], [19 + d - e * 0.5, 41 + dy]);
        const right = arm(this, shR, [20.6 + d, 38.2 + dy], [29 + d + e * 0.5, 40.6 + dy]);
        return { expr: "triste", left: "", right: "", over: left + right };
      }
      if (this.geste === "lire") {
        const left = arm(this, shL, [19.6, 41.4 + dy], [15.6 - e * 0.5, 41.4 + dy]);
        const right = arm(this, shR, [28.4, 41.4 + dy], [32.4 + e * 0.5, 41.4 + dy]);
        return { expr: n ? "surpris" : "neutre", left: "", right: "", over: book(24, 37.4 + dy) + left + right };
      }
      const reach = n ? [13.2, 50.4 + dy * 0.6] : [14.4, 47 + dy * 0.6];
      return { expr: "content", left: arm(this, shL, reach, [14.2 - e * 0.6, 40.6 + dy]) };
    }
    __name(pose2, "pose");
    var up = /* @__PURE__ */ __name((f, dy) => dy ? (cc, ctx, act) => {
      const s = f(cc, ctx, act);
      return s ? `<g transform="translate(0 ${dy})">${s}</g>` : "";
    } : f, "up");
    function avatar2(choixAvatar = {}, opts = {}) {
      const o = verifier2(choixAvatar);
      const k = CORPS[o.silhouette], dy = TAILLE[o.taille];
      const skin = couleur2("peau", o.peau);
      const hair = couleur2("cheveux", o.cheveux), meche = couleur2("cheveux", o.couleurMeches);
      const top = couleur2("tissus", o.couleurHaut);
      const bas = couleur2("tissus", o.couleurBas);
      const shoeC = couleur2("tissus", o.chaussures);
      const nues = o.bas === "short" || o.bas === "jupe" || o.bas === "robe" || o.bas === "robeEntiere";
      const sp = (k.hw - 10.2) * 0.45;
      const legLen = 56.5 - (44.5 + dy);
      const robe = o.bas === "robeEntiere";
      const mar = !robe && o.haut === "mariniere";
      const claires = clarte(top) > 0.8;
      const base = mar ? claires ? "#2E3E66" : "#F4EEDF" : top;
      const [hh, hs] = hsl(hair);
      const acc = Object.fromEntries(Object.entries(o.accessoires).map(([place, a]) => [place, couleursAccessoire2(a)]));
      const c = {
        name: "Avatar",
        uid: opts.uid || "av",
        o,
        k,
        dy,
        geste: opts.geste,
        acc,
        couvert: !!(o.accessoires.tete && COUVRE_HAUT.has(o.accessoires.tete.id)),
        // des oreilles de chat ou de lapin prennent la place des deux chignons
        oreillesPortees: !!(o.accessoires.tete && /^oreilles/.test(o.accessoires.tete.id)),
        skin,
        skinS: tone(skin, 0.88),
        mole: tone(skin, 0.5),
        hair,
        cheveux: hair,
        hairS: tone(hair, 0.74),
        hairH: tone(hair, 1.32),
        buzz: mix(hair, skin, 0.38),
        buzzS: tone(mix(hair, skin, 0.38), 0.78),
        meche,
        mecheS: tone(meche, 0.74),
        tie: hs > 0.35 && (hh < 25 || hh > 320) ? "#3E5A8C" : "#C8463A",
        eye: couleur2("yeux", o.yeux),
        cheek: o.joues === "roses" ? "#F29E9A" : tone("#F29E9A", 1.18),
        freckle: tone(skin, 0.7),
        levres: o.levres === "naturelles" ? null : couleur2("levres", o.levres),
        top,
        topS: tone(top, 0.82),
        topH: tone(top, 1.28),
        tee: "#F4EEDF",
        base,
        stripe: top,
        bas,
        basS: tone(bas, 0.78),
        basH: tone(bas, 1.25),
        sleeve: robe ? bas : base,
        armW: k.arm,
        cuff: robe ? "#FFFDF6" : { pull: tone(top, 0.82), sweat: tone(top, 0.82), veste: tone(top, 0.82), chemise: "#FFFDF6", mariniere: top }[o.haut] || null,
        sleeves: robe || o.haut === "tshirt" || mar ? "roll" : void 0,
        sleeveCut: mar ? 4.4 : 6.4,
        leg: nues ? skin : bas,
        legS: nues ? tone(skin, 0.88) : tone(bas, 0.78),
        legW: nues ? k.legW - 0.9 : k.legW,
        hip: r2(44.5 + dy),
        ground: 56.5,
        skirtHem: r2(44.5 + legLen * 0.6),
        robeHem: r2(44.5 + legLen * 0.66),
        shortLen: r2(legLen * 0.64),
        coatHem: r2(44.5 + legLen * 0.45),
        shoe: shoeC,
        shoeS: tone(shoeC, 0.72),
        shoeH: tone(shoeC, 1.25),
        legX: { front: [20.5 - sp, 27.5 + sp], se: [20 - sp, 27.6 + sp], ne: [21 - sp, 28 + sp] },
        shoulders: [[24 - (k.sw - 0.5), 34 + dy], [24 + (k.sw - 0.5), 34 + dy]],
        hands: [[24 - (k.hw - 0.4 + k.b * 0.6), 45.2 + dy], [24 + (k.hw - 0.4 + k.b * 0.6), 45.2 + dy]],
        backItems: up((cc, ctx) => (ctx.view === "ne" ? nuque(cc) : "") + hairBehindBody(cc, ctx.view) + couche2(cc, "derriere", ctx), dy),
        overArms: up((cc, ctx) => couche2(cc, "surBras", ctx), dy),
        body: up(body, dy),
        neck: up(neck, dy),
        head: up(head, dy),
        pose: pose2
      };
      if (o.bas === "short") c.foot = (cc, x, y, dir, tilt) => shortLeg(cc, x) + shoe(cc, x, y, dir, tilt);
      for (const place of ["dessus", "mains"]) {
        const a = o.accessoires[place];
        if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](acc[place], c));
      }
      if (o.accessoires.pieds) c.foot = (cc, x, y, dir, tilt) => (o.bas === "short" ? shortLeg(cc, x) : "") + couche2(cc, "pieds", {}, [x, y, dir, tilt]);
      if (o.accessoires.main) c.hold = (cc, hand, ctx) => couche2(cc, "main", ctx, hand);
      return c;
    }
    __name(avatar2, "avatar");
    module.exports = { avatar: avatar2, shortLeg, ...choix2 };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/gestes.js
var require_gestes = __commonJS({
  "atelier/gestes.js"(exports, module) {
    var { OUT, P, E, L, limb, zee, r2, frame: frame2, arm } = require_troupe2();
    var CADRE_PARAPLUIE2 = [0, -18, 48, 82];
    var CADRE_COUCHE2 = [0, 0, 64, 48];
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "trait");
    var lueur = /* @__PURE__ */ __name((x, y, r, a = 0.5) => [1, 0.66, 0.4].map((k, i) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * k)}" fill="rgba(255,214,120,${r2(a * (0.3 + i * 0.3))})"/>`).join(""), "lueur");
    function lanterne(h, n = 0) {
      return `<g transform="translate(${r2(h[0])} ${r2(h[1])}) scale(1.3) translate(${r2(-h[0])} ${r2(-h[1])})">${petiteLanterne(h, n)}</g>`;
    }
    __name(lanterne, "lanterne");
    function petiteLanterne(h, n) {
      const [x, y0] = h, y = y0 + 1.4;
      const flamme = n % 2 ? "M0,-1.6 Q1,0 0,1.2 Q-1,0 0,-1.6 Z" : "M0,-1.9 Q0.8,0.1 0,1.2 Q-0.9,-0.1 0,-1.9 Z";
      return P(`M${r2(x - 1.6)},${r2(y + 1.4)} Q${x},${r2(y - 1.8)} ${r2(x + 1.6)},${r2(y + 1.4)}`, "none", 0.8) + lueur(x, y + 4.6, 4.6, 0.55) + P(`M${r2(x - 2.6)},${r2(y + 2.6)} L${r2(x + 2.6)},${r2(y + 2.6)} L${r2(x + 1.8)},${r2(y + 1.2)} L${r2(x - 1.8)},${r2(y + 1.2)} Z`, "#5A4A3A", 0.8) + `<rect x="${r2(x - 2.1)}" y="${r2(y + 2.6)}" width="4.2" height="4.8" rx="0.6" fill="#FFE7A0" stroke="${OUT}" stroke-width="0.8"/><g transform="translate(${x} ${r2(y + 5.1)})">${P(flamme, "#F2A63A", 0.5)}</g>` + L([x - 2.1, y + 5], [x + 2.1, y + 5], "#5A4A3A", 0.5) + `<rect x="${r2(x - 2.6)}" y="${r2(y + 7.3)}" width="5.2" height="1.3" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.8"/>`;
    }
    __name(petiteLanterne, "petiteLanterne");
    function parapluie(h, col = "#D9443A") {
      const [x, y] = h, cx = x - 5, cy = -3.6;
      const r = 15, dark = "#8E2A24";
      const toile = `M${r2(cx - r)},${r2(cy + 2.4)} Q${r2(cx - r)},${r2(cy - 9.6)} ${r2(cx)},${r2(cy - 10.4)} Q${r2(cx + r)},${r2(cy - 9.6)} ${r2(cx + r)},${r2(cy + 2.4)}` + [0.75, 0.5, 0.25, 0].map((k) => ` Q${r2(cx + r * (k + 0.125) * 2 - r)},${r2(cy + 0.8)} ${r2(cx + r * k * 2 - r)},${r2(cy + 2.4)}`).join("") + " Z";
      const pans = [-0.5, 0, 0.5].map((k) => trait(`M${r2(cx)},${r2(cy - 10.2)} Q${r2(cx + r * k * 0.9)},${r2(cy - 6)} ${r2(cx + r * k * 1.5)},${r2(cy + 2.2)}`, dark, 0.6)).join("");
      return limb([x, y + 1], [cx, cy + 1.6], 0.8, "#7A5A3A") + P(`M${r2(x)},${r2(y + 1)} q0,3 -2.4,3`, "none", 1.2) + P(toile, col) + `<path d="M${r2(cx + r * 0.25)},${r2(cy - 9)} Q${r2(cx + r * 0.8)},${r2(cy - 6)} ${r2(cx + r)},${r2(cy + 2.4)} L${r2(cx + r * 0.5)},${r2(cy + 2.4)} Q${r2(cx + r * 0.4)},${r2(cy - 4)} ${r2(cx + r * 0.25)},${r2(cy - 9)} Z" fill="${dark}" opacity="0.35"/>` + pans + P(toile, "none") + E(cx, cy - 11, 0.8, 0.8, "#7A5A3A", 0.6) + L([cx - r * 0.6, cy - 6.6], [cx - r * 0.25, cy - 8.6], "rgba(255,255,255,.55)", 0.9);
    }
    __name(parapluie, "parapluie");
    function valise(h, col = "#9A5A34") {
      const [x, y] = h;
      return P(`M${r2(x - 1.4)},${r2(y + 2.6)} Q${x},${r2(y + 0.2)} ${r2(x + 1.4)},${r2(y + 2.6)}`, "none", 1) + `<rect x="${r2(x - 4.4)}" y="${r2(y + 2.4)}" width="8.8" height="6.6" rx="1.2" fill="${col}" stroke="${OUT}" stroke-width="1"/><rect x="${r2(x + 1.2)}" y="${r2(y + 2.6)}" width="3" height="6.2" fill="rgba(60,40,25,.2)"/>` + [-2.4, 2].map((d) => L([x + d, y + 2.6], [x + d, y + 8.8], "#5A3A24", 0.7)).join("") + `<rect x="${r2(x - 1.2)}" y="${r2(y + 4.8)}" width="2.4" height="1.8" rx="0.3" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.5"/>`;
    }
    __name(valise, "valise");
    var avecLanterne2 = /* @__PURE__ */ __name((c) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h, ctx) => lanterne([h[0], Math.min(h[1], 49)], ctx.n), "hold"), holdOver: false }), "avecLanterne");
    var avecParapluie2 = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => parapluie(h, col), "hold"), holdOver: true }), "avecParapluie");
    var avecValise2 = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => valise(h, col), "hold"), holdOver: false }), "avecValise");
    var ZEDS = /<path d="M([-\d.]+),([-\d.]+) L([-\d.]+),\2 L\1,([-\d.]+) L\3,\4" fill="none"[^>]*\/>/g;
    function couche2(c, n = 0, couverture = { fond: "#C98F5A", motif: "#E8C07A" }) {
      const corps = frame2(c, "front", "repos", 0, "endormi").replace(ZEDS, "");
      const souffle = n ? -0.5 : 0;
      const couv = `M31,${r2(9.6 + souffle)} Q46,${r2(7.6 + souffle)} 60.6,10.4 Q62.8,24 60.6,37.6 Q46,40.4 31,${r2(38.4 - souffle)} Q28.6,24 31,${r2(9.6 + souffle)} Z`;
      return `<ellipse cx="32" cy="26" rx="29" ry="14" fill="rgba(40,55,20,.16)"/>` + E(9, 24, 7.6, 11, "#F4EEDF", 1.1) + L([4.6, 18], [6.4, 15.6], "#FFFFFF", 1) + `<g transform="translate(32 24) scale(0.95) translate(-32 -24)"><g transform="translate(0 48) rotate(-90)">${corps}</g></g>` + P(couv, couverture.fond, 1.2) + [16, 24, 32].map((y) => L([33, y + souffle * 0.5], [59.2, y], couverture.motif, 1.1)).join("") + P(`M31,${r2(9.6 + souffle)} Q28.6,24 31,${r2(38.4 - souffle)} L34.6,${r2(38.2 - souffle)} Q32.4,24 34.6,${r2(9.8 + souffle)} Z`, couverture.motif, 0.9) + (n ? zee(30.6, 6.4, 2) + zee(34, 2.4, 2.6) : zee(30, 7.4, 1.8) + zee(33, 3.6, 2.4));
    }
    __name(couche2, "couche");
    function paume(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.85 * s, h = 2.5 * s;
      return E(x + k * w * 0.95, y + 0.5 * s, 0.95 * s, 1.35 * s, f, 0.9) + P(`M${r2(x - w)},${r2(y + h * 0.55)} L${r2(x - w)},${r2(y - h * 0.35)} Q${r2(x - w)},${r2(y - h)} ${r2(x)},${r2(y - h)} Q${r2(x + w)},${r2(y - h)} ${r2(x + w)},${r2(y - h * 0.35)} L${r2(x + w)},${r2(y + h * 0.55)} Q${r2(x)},${r2(y + h * 1.05)} ${r2(x - w)},${r2(y + h * 0.55)} Z`, f, 0.9) + (c.moufle ? "" : [-0.6, 0.6].map((d) => L([x + d * s, y - h + 0.35], [x + d * s, y - h * 0.35], OUT, 0.42)).join(""));
    }
    __name(paume, "paume");
    function tranche(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.3 * s, h = 2.5 * s;
      return P(`M${r2(x - w)},${r2(y + h * 0.6)} L${r2(x - w)},${r2(y - h * 0.4)} Q${r2(x - w)},${r2(y - h)} ${r2(x)},${r2(y - h)} Q${r2(x + w)},${r2(y - h)} ${r2(x + w)},${r2(y - h * 0.4)} L${r2(x + w)},${r2(y + h * 0.6)} Q${r2(x)},${r2(y + h)} ${r2(x - w)},${r2(y + h * 0.6)} Z`, f, 0.9) + E(x + k * w * 0.9, y + 0.6 * s, 0.8 * s, 1.1 * s, f, 0.8);
    }
    __name(tranche, "tranche");
    function tendre2({ view, n }) {
      const [a, b] = this.shoulders;
      const w = n ? 0.45 : 0;
      if (view === "front") {
        const y = a[1] + 7, l = [a[0] + 1.7 - w, y + w], r = [b[0] - 1.7 + w, y + w];
        return {
          expr: "content",
          left: arm(this, a, l, [a[0] - 1.5, a[1] + 8.4], paume(this, [l[0], l[1] - 0.5], 1, 1.08)),
          right: arm(this, b, r, [b[0] + 1.5, b[1] + 8.4], paume(this, [r[0], r[1] - 0.5], -1, 1.08))
        };
      }
      if (view === "se") {
        return {
          expr: "content",
          left: arm(this, a, [a[0] - 6.4 - w, a[1] + 5.4], [a[0] - 2.2, a[1] + 7], tranche(this, [a[0] - 6.6 - w, a[1] + 4.8], 1)),
          right: arm(this, b, [b[0] - 9.6 - w, b[1] + 4.8], [b[0] - 4.4, b[1] + 7], tranche(this, [b[0] - 9.8 - w, b[1] + 4.2], 1, 0.95))
        };
      }
      return {
        left: "",
        right: "",
        under: arm(this, a, [a[0] + 3.6, a[1] + 4.6 - w], [a[0] - 2.6, a[1] + 5.8]) + arm(this, b, [b[0] + 2.4, b[1] + 4.6 - w], [b[0] + 2, b[1] + 7.2], tranche(this, [b[0] + 2.5, b[1] + 4 - w], 1, 0.95))
      };
    }
    __name(tendre2, "tendre");
    var avecMainsTendues2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}mt`, pose: tendre2 }), "avecMainsTendues");
    var eclat = /* @__PURE__ */ __name((x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => {
      const p = [x + dx * 1.2, y + dy * 1.2], q = [x + dx * 2.4, y + dy * 2.4];
      return L(p, q, OUT, 1.45) + L(p, q, "#FFF6CC", 0.55);
    }).join(""), "eclat");
    function applaudir2({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 6.2;
      if (view === "front") {
        const g = n ? 1.35 : 4;
        return {
          expr: "rire",
          left: arm(this, a, [24 - g, y], [a[0] - 1.2, a[1] + 7.6], tranche(this, [24 - g, y - 0.5], -1)),
          right: arm(this, b, [24 + g, y], [b[0] + 1.2, b[1] + 7.6], tranche(this, [24 + g, y - 0.5], 1)),
          over: n ? eclat(24, y - 3.2) : ""
        };
      }
      if (view === "se") {
        const x = a[0] - 4.4, g = n ? 0.7 : 3.2;
        return {
          expr: "rire",
          right: arm(this, b, [x + g, y - 0.4], [b[0] - 2.6, b[1] + 7.2], tranche(this, [x + g, y - 0.9], -1, 0.95)),
          left: arm(this, a, [x - g, y], [a[0] - 1.2, a[1] + 7.4], tranche(this, [x - g, y - 0.5], 1)),
          over: n ? eclat(x - 0.2, y - 3.8) : ""
        };
      }
      const k = n ? 1.4 : 0;
      return {
        left: "",
        right: "",
        under: arm(this, a, [24 - 0.6, y - 1], [a[0] - 3.2 + k, a[1] + 5.6]) + arm(this, b, [24 + 0.6, y - 1], [b[0] + 3.2 - k, b[1] + 5.6]),
        over: n ? eclat(b[0] + 3.4, a[1] + 1.8) : ""
      };
    }
    __name(applaudir2, "applaudir");
    var avecApplaudir2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ap`, pose: applaudir2 }), "avecApplaudir");
    function canne(b, t, f, k, plonge) {
      const len = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / len, uy = (t[1] - b[1]) / len;
      const at = /* @__PURE__ */ __name((d) => [b[0] + ux * d, b[1] + uy * d], "at");
      const m = at(len * 0.62), g = at(3.2), r = at(5.4), rk = [r[0] - uy * k * 1.5, r[1] + ux * k * 1.5];
      const [x, y] = f, yb = y + (plonge ? 0.7 : 0);
      return L(b, m, OUT, 2.4) + L(m, t, OUT, 1.8) + L(b, m, "#D8AE6E", 1.15) + L(m, t, "#D8AE6E", 0.65) + [0.3, 0.5].map((q) => L(at(len * q - 0.35), at(len * q + 0.35), "#A8794A", 0.9)).join("") + L(b, g, OUT, 2.8) + L(b, g, "#7A4E2A", 1.6) + L(r, rk, OUT, 1) + E(rk[0], rk[1], 1.15, 1.15, "#9AA2AD", 0.6) + E(rk[0] - 0.3, rk[1] - 0.3, 0.4, 0.4, "#E2E8EE", 0) + trait(`M${r2(t[0])},${r2(t[1])} Q${r2(t[0] + (x - t[0]) * 0.2 + (plonge ? 0 : 0.8))},${r2((t[1] + yb) / 2)} ${r2(x)},${r2(yb - 1.5)}`, OUT, 0.35) + E(x, y + 1.2, 4.2, 1.35, "rgba(120,190,226,.55)", 0) + (plonge ? E(x, y + 1.2, 3.6, 1.1, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.45"') : "") + E(x, y + 1.2, 2.4, 0.75, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.5"') + `<g transform="translate(0 ${plonge ? 0.7 : 0})">${E(x, y, 1.65, 1.65, "#FFFFFF", 0.7)}${P(`M${r2(x - 1.65)},${r2(y)} A1.65,1.65 0 0 1 ${r2(x + 1.65)},${r2(y)} Z`, "#E2463A", 0)}${E(x, y, 1.65, 1.65, "none", 0.7)}${E(x - 0.6, y - 0.7, 0.45, 0.3, "#FFFFFF", 0)}${L([x, y - 1.65], [x, y - 2.5], OUT, 0.5)}</g>`;
    }
    __name(canne, "canne");
    function pecher({ view, n }) {
      const [a, b] = this.shoulders;
      const d = n ? 1.6 : 0;
      const sur = /* @__PURE__ */ __name((talon2, scion2, q) => {
        const l = Math.hypot(scion2[0] - talon2[0], scion2[1] - talon2[1]);
        return [talon2[0] + (scion2[0] - talon2[0]) * q / l, talon2[1] + (scion2[1] - talon2[1]) * q / l];
      }, "sur");
      if (view === "front") {
        const talon2 = [a[0] + 1.6, a[1] + 11.4], scion2 = [Math.min(45.6, b[0] + 13.6), a[1] - 8 + d];
        return {
          expr: "content",
          left: canne(talon2, scion2, [Math.min(43, b[0] + 11), 54.4], 1, n) + arm(this, a, sur(talon2, scion2, 3), [a[0] - 0.6, a[1] + 7]),
          right: arm(this, b, sur(talon2, scion2, 9), [b[0] + 1.6, b[1] + 6.2])
        };
      }
      if (view === "se") {
        const talon2 = [b[0] - 4, b[1] + 11.4], scion2 = [Math.max(2.4, a[0] - 13.6), a[1] - 8 + d];
        return {
          expr: "content",
          right: arm(this, b, sur(talon2, scion2, 3), [b[0] - 0.6, b[1] + 7.6]),
          left: canne(talon2, scion2, [Math.max(5, a[0] - 11), 54.4], -1, n) + arm(this, a, sur(talon2, scion2, 9.5), [a[0] - 1, a[1] + 6])
        };
      }
      const talon = [26, a[1] + 8], scion = [Math.min(45.4, b[0] + 13), a[1] - 10 + d];
      return {
        left: "",
        right: "",
        under: canne(talon, scion, [Math.min(43.4, b[0] + 11.4), a[1] + 4], 1, n) + arm(this, a, sur(talon, scion, 2), [a[0] - 2.4, a[1] + 6.4]) + arm(this, b, sur(talon, scion, 7), [b[0] + 2.8, b[1] + 6.4])
      };
    }
    __name(pecher, "pecher");
    var avecPecher2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pe`, pose: pecher }), "avecPecher");
    function pioche(m, h, k = 1) {
      const len = Math.hypot(h[0] - m[0], h[1] - m[1]), ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b], "pt");
      const fer = [pt(0.4, -5.6), pt(1.6, -2.6), pt(1.9, 0), pt(1.6, 2.4), pt(0.6, 6.2), pt(-0.6, 2.4), pt(-1.1, 0), pt(-0.6, -2.6)];
      const d = `M${fer.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L")} Z`;
      return L(m, h, OUT, 3.4) + L(m, h, "#B07A45", 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], "#C99A62", 0.5) + P(d, "#A9B1BB", 1) + L(pt(0.9, -4), pt(1.2, -1.2), "#E2E8EE", 0.6) + E(h[0], h[1], 1.1, 1.1, "#6E747E", 0.7);
    }
    __name(pioche, "pioche");
    var eclats = /* @__PURE__ */ __name((x, y) => [[-3.6, -2.6, 0.9], [-1.6, -4.6, 0.7], [2.6, -3.4, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, "#9A8E80", 0.5)).join("") + [[0, -1], [0.7, -0.7], [-0.7, -0.7]].map(([dx, dy]) => L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], OUT, 1.4) + L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], "#FFF2B0", 0.6)).join("") + E(x, y + 0.6, 4.4, 1.2, "rgba(110,90,70,.35)", 0), "eclats");
    var pierre = /* @__PURE__ */ __name((x, y) => E(x, y - 0.2, 4.6, 1.3, "rgba(40,55,20,.22)", 0) + P(`M${r2(x - 4.2)},${r2(y)} Q${r2(x - 4.6)},${r2(y - 3.6)} ${r2(x - 1)},${r2(y - 4.4)} Q${r2(x + 3.4)},${r2(y - 4.8)} ${r2(x + 4.2)},${r2(y - 1.4)} Q${r2(x + 4.4)},${r2(y + 0.2)} ${r2(x)},${r2(y + 0.3)} Z`, "#A79E92") + P(`M${r2(x - 2.8)},${r2(y - 2.6)} Q${r2(x - 1.6)},${r2(y - 3.8)} ${r2(x + 0.4)},${r2(y - 3.8)}`, "none", 0).replace('stroke="none"', 'stroke="#D2CBC0" stroke-width="0.8" stroke-linecap="round"') + P(`M${r2(x + 1.4)},${r2(y - 4.2)} L${r2(x + 0.8)},${r2(y - 2.4)} L${r2(x + 1.6)},${r2(y - 1.2)}`, "none", 0.5), "pierre");
    var surLigne = /* @__PURE__ */ __name((m, h, q) => {
      const l = Math.hypot(h[0] - m[0], h[1] - m[1]);
      return [m[0] + (h[0] - m[0]) * q / l, m[1] + (h[1] - m[1]) * q / l];
    }, "surLigne");
    function piocher({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const p2 = [b[0] + 9, 61];
        if (!n) {
          const m3 = [b[0] - 1.4, b[1] + 5], h3 = [Math.min(42, b[0] + 10.4), a[1] - 8.4];
          return { expr: "content", under: pierre(...p2), left: pioche(m3, h3, 1) + arm(this, a, m3, [a[0] + 0.6, a[1] + 7.4]), right: arm(this, b, surLigne(m3, h3, 4.6), [b[0] + 3, b[1] + 4.4]) };
        }
        const m2 = [24 + 0.6, a[1] + 9.6], h2 = [p2[0] - 0.4, p2[1] - 4.4];
        return { expr: "rire", under: pierre(...p2), left: pioche(m2, h2, -1) + arm(this, a, m2, [a[0] - 0.6, a[1] + 6.4]), right: arm(this, b, surLigne(m2, h2, 4.2), [b[0] + 1.4, b[1] + 6.8]), over: eclats(h2[0] + 0.6, h2[1] + 0.4) };
      }
      if (view === "se") {
        const p2 = [a[0] - 9, 61];
        if (!n) {
          const m3 = [b[0] - 4.4, b[1] + 4.6], h3 = [Math.min(43, b[0] + 10), a[1] - 9];
          return { expr: "content", under: pierre(...p2), right: pioche(m3, h3, -1) + arm(this, b, surLigne(m3, h3, 4.6), [b[0] + 2.6, b[1] + 4.6]), left: arm(this, a, m3, [a[0] - 0.6, a[1] + 6.6]) };
        }
        const m2 = [a[0] + 2.6, a[1] + 9], h2 = [p2[0] + 0.4, p2[1] - 4.4];
        return { expr: "rire", under: pierre(...p2), right: arm(this, b, surLigne(m2, h2, 4.2), [b[0] - 0.6, b[1] + 7]), left: pioche(m2, h2, 1) + arm(this, a, m2, [a[0] - 1.4, a[1] + 5.8]), over: eclats(h2[0] - 0.6, h2[1] + 0.4) };
      }
      const p = [b[0] + 7, a[1] + 18];
      if (!n) {
        const m2 = [b[0] - 2, b[1] + 1], h2 = [b[0] + 6, a[1] - 18];
        return { left: "", right: "", under: pierre(...p) + arm(this, a, [b[0] - 4, b[1] + 2], [a[0] - 2.4, a[1] + 5.6]), over: pioche(m2, h2, 1) + arm(this, b, [b[0] - 1, b[1] - 1.4], [b[0] + 3, b[1] + 4.4]) };
      }
      const m = [24 + 2, a[1] + 7], h = [p[0] - 0.4, p[1] - 4.4];
      return { expr: "rire", left: "", right: "", under: pierre(...p) + pioche(m, h, 1) + arm(this, a, [24 - 1, a[1] + 7.4], [a[0] - 2.4, a[1] + 6]) + arm(this, b, surLigne(m, h, 3), [b[0] + 2.4, b[1] + 6]), over: eclats(h[0] + 0.4, h[1] + 0.4) };
    }
    __name(piocher, "piocher");
    var avecPiocher2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pi`, pose: piocher }), "avecPiocher");
    var fruit = /* @__PURE__ */ __name((x, y, s = 1, col = "#E2463A") => E(x, y, 1.45 * s, 1.35 * s, col, 0.7) + E(x - 0.5 * s, y - 0.45 * s, 0.4 * s, 0.3 * s, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.7" fill=') + L([x, y - 1.2 * s], [x + 0.3 * s, y - 2.1 * s], OUT, 0.5) + P(`M${r2(x + 0.3 * s)},${r2(y - 1.9 * s)} q1.2,-0.9 1.9,-0.1 q-1,0.7 -1.9,0.1 Z`, "#6FB24E", 0.4), "fruit");
    function panier([x, y], n = 3) {
      const by = y + 5, w = 5.4;
      const anse = `M${r2(x - w * 0.8)},${r2(by)} Q${r2(x)},${r2(y - 2.6)} ${r2(x + w * 0.8)},${r2(by)}`;
      const corps = `M${r2(x - w)},${r2(by)} L${r2(x - w * 0.78)},${r2(by + 5)} Q${r2(x)},${r2(by + 6.2)} ${r2(x + w * 0.78)},${r2(by + 5)} L${r2(x + w)},${r2(by)} Q${r2(x)},${r2(by + 1.3)} ${r2(x - w)},${r2(by)} Z`;
      const fruits = [[-2.6, -0.1, "#E2463A"], [2.6, 0, "#E2463A"], [0, -0.5, "#F2A63A"], [-1.2, -1.5, "#C9343A"]].slice(0, n).map(([dx, dy, c]) => fruit(x + dx, by + dy, 0.85, c)).join("");
      return P(anse, "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"`) + P(anse, "none", 0).replace('stroke="none"', 'stroke="#C99A5A" stroke-width="1" stroke-linecap="round"') + E(x, by, w, 1.3, "#7A5A30", 0.8) + fruits + P(corps, "#C99A5A") + [2, 3.6].map((d) => `<path d="M${r2(x - w * 0.93 + d * 0.05)},${r2(by + d)} Q${r2(x)},${r2(by + d + 1.1)} ${r2(x + w * 0.93 - d * 0.05)},${r2(by + d)}" fill="none" stroke="#A67A40" stroke-width="0.5"/>`).join("") + [-2.8, 0, 2.8].map((d) => L([x + d, by + 1.2], [x + d * 0.85, by + 5.4], "#A67A40", 0.45)).join("") + `<path d="M${r2(x - w)},${r2(by)} Q${r2(x)},${r2(by + 2.6)} ${r2(x + w)},${r2(by)}" fill="none" stroke="${OUT}" stroke-width="2.3" stroke-linecap="round"/><path d="M${r2(x - w)},${r2(by)} Q${r2(x)},${r2(by + 2.6)} ${r2(x + w)},${r2(by)}" fill="none" stroke="#E2B878" stroke-width="1" stroke-linecap="round"/>`;
    }
    __name(panier, "panier");
    function cueillir({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const hp2 = [a[0] - 1.8, a[1] + 9.4];
        const pan2 = panier(hp2, n ? 4 : 3);
        if (!n) {
          const h2 = [b[0] + 8.4, a[1] - 3.6];
          return { expr: "content", left: arm(this, a, hp2, [a[0] - 2.4, a[1] + 5]) + pan2, right: arm(this, b, h2, [b[0] + 6.4, b[1] + 2.2]) + fruit(h2[0] + 0.3, h2[1] - 2) };
        }
        const h = [a[0] + 1.4, a[1] + 8.6];
        return { expr: "rire", left: arm(this, a, hp2, [a[0] - 2.4, a[1] + 5]) + pan2, right: arm(this, b, h, [b[0] + 1.6, b[1] + 6.8]) };
      }
      if (view === "se") {
        const hp2 = [b[0] + 1.8, b[1] + 9.4];
        const pan2 = panier(hp2, n ? 4 : 3);
        if (!n) {
          const h2 = [a[0] - 8.4, a[1] - 3.6];
          return { expr: "content", right: arm(this, b, hp2, [b[0] + 2.4, b[1] + 5]) + pan2, left: arm(this, a, h2, [a[0] - 6.4, a[1] + 2.2]) + fruit(h2[0] - 0.3, h2[1] - 2) };
        }
        const h = [b[0] + 0.6, b[1] + 8.6];
        return { expr: "rire", right: arm(this, b, hp2, [b[0] + 2.4, b[1] + 5]) + pan2, left: arm(this, a, h, [a[0] - 1, a[1] + 7]) };
      }
      const hp = [b[0] + 2.4, b[1] + 9.4];
      const pan = panier(hp, n ? 4 : 3);
      if (!n) {
        const h = [a[0] - 8.4, a[1] - 3.6];
        return { left: arm(this, a, h, [a[0] - 6.4, a[1] + 2.2]) + fruit(h[0] - 0.3, h[1] - 2), right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan };
      }
      return { left: "", right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan, under: arm(this, a, [24 + 3, a[1] + 8], [a[0] - 2.4, a[1] + 6]) };
    }
    __name(cueillir, "cueillir");
    var avecCueillir2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}cu`, pose: cueillir }), "avecCueillir");
    function arrosoir(h, k = 1, a = 0) {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      const pt = /* @__PURE__ */ __name((x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c], "pt");
      const d = /* @__PURE__ */ __name((ps) => `M${ps.map(([x, y]) => pt(x, y).map(r2).join(",")).join(" L")} Z`, "d");
      const corps = d([[-4.2, 2.4], [3.6, 2.4], [3.9, 9.4], [-4.5, 9.4]]);
      const bec = d([[3.4, 7.6], [9, 2.4], [9.5, 3.2], [3.8, 9.2]]);
      const pomme = pt(9.7, 2.6), bout = pt(10.4, 3.4);
      const anse = `M${pt(-3.2, 2.6).map(r2)} Q${pt(-0.4, -3.4).map(r2)} ${pt(2.4, 2.6).map(r2)}`;
      const t = /* @__PURE__ */ __name((dd, col, w) => trait(dd, col, w), "t");
      return {
        svg: t(anse, OUT, 2.6) + t(anse, "#3F7A57", 1.2) + P(bec, "#4E8F6A", 0.9) + E(pomme[0], pomme[1], 1.6, 1.6, "#3F7A57", 0.8) + E(pomme[0], pomme[1], 0.7, 0.7, "#9CC9A8", 0) + P(corps, "#4E8F6A") + L(pt(-4.3, 5), pt(3.7, 5), "#6FB08A", 1) + L(pt(-3, 3.6), pt(-3.2, 8.4), "#A6D4B4", 0.7),
        bout
      };
    }
    __name(arrosoir, "arrosoir");
    var pluie = /* @__PURE__ */ __name(([x, y], sol, k, n) => [0, 1, 2].map((i) => {
      const q = (i + 0.4 + (n ? 0.5 : 0)) / 3, gx = x + k * 1.2 * q, gy = y + (sol - y) * q;
      return gy < sol - 1 ? P(`M${r2(gx)},${r2(gy - 1.2)} Q${r2(gx + 1.1)},${r2(gy + 0.3)} ${r2(gx)},${r2(gy + 0.9)} Q${r2(gx - 1.1)},${r2(gy + 0.3)} ${r2(gx)},${r2(gy - 1.4)} Z`, "#8FD3F2", 0.4) : "";
    }).join(""), "pluie");
    var pousse = /* @__PURE__ */ __name((x, y, n) => E(x, y, 4.4, 1.2, "#6B4A2E", 0.6) + E(x - 0.6, y - 0.2, 2.2, 0.5, "#8A6440", 0) + L([x, y], [x, y - 3.6], OUT, 1.4) + L([x, y], [x, y - 3.6], "#6FB24E", 0.6) + P(`M${r2(x)},${r2(y - 3.2)} q-2.4,${n ? -1.6 : -0.6} -3.4,${n ? -0.2 : 0.8} q1.8,0.8 3.4,-0.8 Z`, "#7CC25A", 0.5) + P(`M${r2(x)},${r2(y - 3.4)} q2.4,${n ? -1.6 : -0.6} 3.4,${n ? -0.2 : 0.8} q-1.8,0.8 -3.4,-0.8 Z`, "#7CC25A", 0.5), "pousse");
    function arroser({ view, n }) {
      const [a, b] = this.shoulders;
      if (view === "front") {
        const h2 = [b[0] + 3, b[1] + 7.4], ar2 = arrosoir(h2, 1, 38), sol2 = 61;
        return { expr: "content", under: pousse(ar2.bout[0] - 0.4, sol2, n), right: arm(this, b, h2, [b[0] + 3, b[1] + 3.4]) + ar2.svg, over: pluie(ar2.bout, sol2 - 1, 1, n) };
      }
      if (view === "se") {
        const h2 = [a[0] - 3, a[1] + 7.4], ar2 = arrosoir(h2, -1, 38), sol2 = 61;
        return { expr: "content", under: pousse(ar2.bout[0] + 0.4, sol2, n), left: arm(this, a, h2, [a[0] - 3, a[1] + 3.4]) + ar2.svg, over: pluie(ar2.bout, sol2 - 1, -1, n) };
      }
      const h = [b[0] + 1.4, b[1] + 6.4], ar = arrosoir(h, 1, 40), sol = a[1] + 18;
      return { left: "", right: "", under: pousse(ar.bout[0] - 0.6, sol, n) + ar.svg + pluie(ar.bout, sol - 1, 1, n) + arm(this, a, [24 + 1, a[1] + 7.6], [a[0] - 1.6, a[1] + 6]), over: arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(arroser, "arroser");
    var avecArroser2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ar`, pose: arroser }), "avecArroser");
    function caisse(x, y, w = 11, h = 8.4) {
      const g = x - w / 2, d = x + w / 2, t = y - h, p = 2.2;
      const face = `M${r2(g)},${r2(y)} L${r2(d)},${r2(y)} L${r2(d)},${r2(t)} L${r2(g)},${r2(t)} Z`;
      const dessus = `M${r2(g)},${r2(t)} L${r2(g + p)},${r2(t - p * 0.7)} L${r2(d + p)},${r2(t - p * 0.7)} L${r2(d)},${r2(t)} Z`;
      const cote = `M${r2(d)},${r2(y)} L${r2(d + p)},${r2(y - p * 0.7)} L${r2(d + p)},${r2(t - p * 0.7)} L${r2(d)},${r2(t)} Z`;
      return P(cote, "#94683F") + P(dessus, "#D2A574") + P(face, "#B8875A") + [1 / 3, 2 / 3].map((k) => L([g + 0.4, t + h * k], [d - 0.4, t + h * k], "#8A5E36", 0.5)).join("") + L([g + 0.6, y - 0.6], [d - 0.6, t + 0.6], "#8A5E36", 0.9) + L([g + 1.2, t + 0.9], [d - 1.6, t + 0.9], "rgba(255,255,255,.35)", 0.6) + [[g + 1, t + 1], [d - 1, t + 1], [g + 1, y - 1], [d - 1, y - 1]].map(([a, b]) => E(a, b, 0.35, 0.35, "#5A3A20", 0)).join("") + P(face, "none");
    }
    __name(caisse, "caisse");
    function porter({ view, n }) {
      const [a, b] = this.shoulders;
      const up = n ? -0.9 : 0;
      const x = Math.min(b[0] + 7, 39.8), y = b[1] - 0.8 + up;
      const main = [Math.min(b[0] + 10.2, 43), b[1] - 0.2 + up];
      const autre = view === "ne" ? arm(this, a, [a[0] - 1.4, a[1] + 11 - up]) : arm(this, a, [a[0] - 1.6, a[1] + 10.6 + up * 0.5]);
      return {
        expr: "content",
        left: autre,
        right: "",
        over: caisse(x, y, 10.4) + arm(this, b, main, [b[0] + 6.6, b[1] + 5.4])
      };
    }
    __name(porter, "porter");
    var avecPorter2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}po`, pose: porter }), "avecPorter");
    function marteau(m, t) {
      const len = Math.hypot(t[0] - m[0], t[1] - m[1]), ux = (t[0] - m[0]) / len, uy = (t[1] - m[1]) / len, nx = -uy, ny = ux;
      const q = /* @__PURE__ */ __name((a, b) => [t[0] + ux * a + nx * b, t[1] + uy * a + ny * b], "q");
      const tete = [q(-1.3, -3.2), q(1.3, -3.2), q(1.3, 2.2), q(0.4, 3.6), q(-0.4, 3.6), q(-1.3, 2.2)];
      return L(m, t, OUT, 3.2) + L(m, t, "#C99A62", 1.4) + L(m, [m[0] + ux * 2.4, m[1] + uy * 2.4], "#7A4E2A", 1.6) + P(`M${tete.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L")} Z`, "#8E96A0", 0.9) + L(q(-0.7, -2.6), q(-0.7, 1.4), "#C9CFD6", 0.5);
    }
    __name(marteau, "marteau");
    var planche = /* @__PURE__ */ __name((g, d, y, cx) => `<rect x="${r2(g)}" y="${r2(y - 1.5)}" width="${r2(d - g)}" height="3" rx="0.6" fill="#D2A574" stroke="${OUT}" stroke-width="0.9"/>` + L([g + 1, y - 0.3], [d - 1, y - 0.3], "#B8875A", 0.45) + L([g + 2, y + 0.7], [d - 3, y + 0.7], "#B8875A", 0.4) + L([cx, y - 1.4], [cx, y - 3.4], OUT, 1.3) + L([cx, y - 1.4], [cx, y - 3.4], "#C9CFD6", 0.5) + E(cx, y - 3.5, 0.9, 0.35, "#8E96A0", 0.5), "planche");
    var tac = /* @__PURE__ */ __name((x, y) => [[-1, -0.6], [0, -1.1], [1, -0.6]].map(([dx, dy]) => {
      const p = [x + dx * 1.6, y + dy * 1.6], q = [x + dx * 3, y + dy * 3];
      return L(p, q, OUT, 1.4) + L(p, q, "#FFF2B0", 0.6);
    }).join(""), "tac");
    function reparer2({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 9.4;
      if (view === "front") {
        const cx = 25.4, pl = planche(15.4, 32.6, y, cx);
        const hp = [16.6, y + 0.2];
        if (!n) {
          const m2 = [Math.min(b[0] + 6.4, 39.6), a[1] + 1.4], t2 = [Math.min(b[0] + 8.6, 41.8), a[1] - 5.4];
          return { expr: "content", left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m2, [b[0] + 4.6, b[1] + 5.8]) + marteau(m2, t2) };
        }
        const m = [b[0] + 1.6, y - 3.6], t = [cx + 1.4, y - 5.6];
        return { expr: "rire", left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m, [b[0] + 2.6, b[1] + 6.6]) + marteau(m, t), over: tac(cx, y - 3.6) };
      }
      if (view === "se") {
        const cx = a[0] - 0.4, pl = planche(a[0] - 8.4, b[0] - 1.4, y, cx);
        const hp = [b[0] - 3, y + 0.2];
        if (!n) {
          const m2 = [Math.max(a[0] - 5, 8.4), a[1] + 1.4], t2 = [Math.max(a[0] - 8.4, 5.6), a[1] - 5];
          return { expr: "content", right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m2, [a[0] - 3.6, a[1] + 5.6]) + marteau(m2, t2) };
        }
        const m = [a[0] - 3.4, y - 4], t = [cx - 1.2, y - 5.8];
        return { expr: "rire", right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + marteau(m, t), over: tac(cx, y - 3.6) };
      }
      if (!n) {
        const m = [Math.min(b[0] + 6.4, 39.6), a[1] + 0.6], t = [Math.min(b[0] + 8.2, 41.4), a[1] - 6.2];
        return { left: "", right: "", under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]), over: arm(this, b, m, [b[0] + 4.4, b[1] + 5.6]) + marteau(m, t) };
      }
      return { expr: "rire", left: "", right: "", under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [24 + 3, y - 2], [b[0] + 2.4, b[1] + 6]), over: tac(b[0] + 3.6, y - 3) };
    }
    __name(reparer2, "reparer");
    var avecReparer2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}re`, pose: reparer2 }), "avecReparer");
    function onde(x, y, dx, dy, n) {
      const k = n ? 1.2 : 1;
      const anneau = /* @__PURE__ */ __name((r, o) => {
        const e = /* @__PURE__ */ __name((color, w) => `<ellipse cx="${r2(x + dx * o)}" cy="${r2(y + dy * o)}" rx="${r2(r)}" ry="${r2(r * 0.9)}" fill="none" stroke="${color}" stroke-width="${w}"/>`, "e");
        return e(OUT, 1.5) + e("#EAF6FF", 0.7);
      }, "anneau");
      const etoile = /* @__PURE__ */ __name((sx, sy, s) => `<path d="M${r2(sx)},${r2(sy - s)} Q${r2(sx + s * 0.2)},${r2(sy - s * 0.2)} ${r2(sx + s)},${r2(sy)} Q${r2(sx + s * 0.2)},${r2(sy + s * 0.2)} ${r2(sx)},${r2(sy + s)} Q${r2(sx - s * 0.2)},${r2(sy + s * 0.2)} ${r2(sx - s)},${r2(sy)} Q${r2(sx - s * 0.2)},${r2(sy - s * 0.2)} ${r2(sx)},${r2(sy - s)} Z" fill="#FFF2B0" stroke="${OUT}" stroke-width="0.4"/>`, "etoile");
      return `<g opacity="0.9">${anneau(3.4 * k, 0.8) + anneau(5 * k, 1.8)}</g>` + etoile(x + dx * 3 + 4.4 * k, y + dy * 3 - 4.6 * k, n ? 1.2 : 0.9) + etoile(x + dx * 3 - 4.6 * k, y + dy * 3 + 3.6 * k, n ? 0.8 : 1.1);
    }
    __name(onde, "onde");
    function repousser({ view, n }) {
      const [a, b] = this.shoulders;
      const d = n ? 1.4 : 0;
      if (view === "front") {
        const h2 = [Math.min(b[0] + 4.6 + d, 38.2), a[1] + 3.6 - d * 0.4];
        return { expr: "content", right: arm(this, b, h2, [b[0] + 3.4, b[1] + 6.6]) + paume(this, [h2[0], h2[1] - 0.6], -1, 1.1), over: onde(h2[0], h2[1] - 0.8, 0.6, -0.3, n) + paume(this, [h2[0], h2[1] - 0.6], -1, 1.1) };
      }
      if (view === "se") {
        const h2 = [Math.max(a[0] - 6 - d * 0.8, 9.6), a[1] + 3.4];
        return { expr: "content", left: arm(this, a, h2, [a[0] - 2.6, a[1] + 6.4]) + tranche(this, [h2[0] - 0.2, h2[1] - 0.6], 1, 1.05), over: onde(h2[0] - 0.4, h2[1] - 0.8, -1, 0, n) + tranche(this, [h2[0] - 0.2, h2[1] - 0.6], 1, 1.05) };
      }
      const h = [Math.min(b[0] + 4.6 + d * 0.6, 38), a[1] - 3.6 - d * 0.4];
      return { left: "", right: "", over: arm(this, b, h, [b[0] + 4.4, b[1] + 4.6]) + onde(h[0], h[1] - 0.8, 0.4, -0.8, n) + tranche(this, [h[0], h[1] - 0.6], 1, 1.05) };
    }
    __name(repousser, "repousser");
    var avecRepousser2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}rp`, pose: repousser }), "avecRepousser");
    function carnet(x, y, lignes) {
      return P(`M${r2(x - 5.4)},${r2(y)} L${r2(x + 5.4)},${r2(y)} L${r2(x + 5.4)},${r2(y + 6)} L${r2(x - 5.4)},${r2(y + 6)} Z`, "#3E5A8C", 0.9) + P(`M${r2(x - 4.7)},${r2(y - 0.5)} Q${r2(x - 2.3)},${r2(y - 1.3)} ${r2(x)},${r2(y)} Q${r2(x + 2.3)},${r2(y - 1.3)} ${r2(x + 4.7)},${r2(y - 0.5)} L${r2(x + 4.7)},${r2(y + 5.1)} Q${r2(x + 2.3)},${r2(y + 4.4)} ${r2(x)},${r2(y + 5.4)} Q${r2(x - 2.3)},${r2(y + 4.4)} ${r2(x - 4.7)},${r2(y + 5.1)} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.4], OUT, 0.55) + L([x + 3.4, y + 5.2], [x + 3.6, y + 7.4], "#D9443A", 0.7) + [1.4, 2.5, 3.6].map((d) => L([x - 3.9, y + d], [x - 1, y + d], "#8A7A6A", 0.4)).join("") + [1.4, 2.5, 3.6].slice(0, lignes).map((d) => `<path d="M${r2(x + 1)},${r2(y + d)} q0.5,-0.4 1,0 t1,0 t1,0" fill="none" stroke="#3E5A8C" stroke-width="0.4"/>`).join("");
    }
    __name(carnet, "carnet");
    function crayon(p, ux, uy) {
      const l = 6, q = [p[0] + ux * l, p[1] + uy * l], t = [p[0] + ux * 1.2, p[1] + uy * 1.2];
      return L(t, q, OUT, 2.2) + L(t, q, "#F2C04B", 1) + L(p, t, OUT, 1.1) + L(p, [p[0] + ux * 0.6, p[1] + uy * 0.6], "#3A3A44", 0.5) + L([q[0] - ux * 0.9, q[1] - uy * 0.9], q, "#F2A0B0", 1);
    }
    __name(crayon, "crayon");
    function ecrire2({ view, n }) {
      const [a, b] = this.shoulders;
      const y = a[1] + 3.6;
      if (view === "front") {
        const x = 24, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1];
        const tient = arm(this, a, [x - 5.2, y + 5.6], [a[0] - 1.4, a[1] + 6.8]);
        const ecrit = arm(this, b, [p[0] + 1.6, p[1] + 2.2], [b[0] + 2.6, b[1] + 6.6]) + crayon(p, 0.55, -0.83);
        return { expr: "content", left: tient, right: "", over: carnet(x, y, n ? 2 : 1) + ecrit };
      }
      if (view === "se") {
        const x = a[0] - 3, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1], h = [p[0] + 1.6, p[1] + 2.2];
        const tient = arm(this, b, [x - 4.4, y + 5.8], [b[0] + 0.6, b[1] + 7]);
        const ecrit = arm(this, a, h, [a[0] + 1.4, a[1] + 6.4], "");
        return { expr: "content", right: tient, left: "", over: ecrit + carnet(x, y, n ? 2 : 1) + crayon(p, 0.55, -0.83) + E(h[0], h[1], 2.1, 2.1, this.hand || this.skin) };
      }
      return { left: "", right: "", under: arm(this, a, [24 - 3, y + 5.6], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [b[0] + 1.6, y + 4], [b[0] + 4.4 + n * 1.4, b[1] + 5.6 - n * 0.6]) };
    }
    __name(ecrire2, "ecrire");
    var avecEcrire2 = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ec`, pose: ecrire2 }), "avecEcrire");
    module.exports = { lanterne, parapluie, valise, avecLanterne: avecLanterne2, avecParapluie: avecParapluie2, avecValise: avecValise2, couche: couche2, CADRE_PARAPLUIE: CADRE_PARAPLUIE2, CADRE_COUCHE: CADRE_COUCHE2, ZEDS, paume, tranche, tendre: tendre2, avecMainsTendues: avecMainsTendues2, applaudir: applaudir2, avecApplaudir: avecApplaudir2, pecher, avecPecher: avecPecher2, piocher, avecPiocher: avecPiocher2, cueillir, avecCueillir: avecCueillir2, arroser, avecArroser: avecArroser2, porter, avecPorter: avecPorter2, reparer: reparer2, avecReparer: avecReparer2, repousser, avecRepousser: avecRepousser2, ecrire: ecrire2, avecEcrire: avecEcrire2 };
  }
});

// atelier/assis.js
var require_assis = __commonJS({
  "atelier/assis.js"(exports, module) {
    var { arm, leg, limb, r2 } = require_troupe2();
    var KNEE = 53;
    var SEAT2 = 53.6;
    var dyOf = /* @__PURE__ */ __name((c) => r2(KNEE - c.hip), "dyOf");
    function assis2(c, view, n, expr, geste) {
      const id = `${c.uid}${view}assis${geste ? geste.name : ""}${n}`;
      const cc = { ...c, uid: id, view };
      const ctx = { view, pose: "repos", n, ph: 0, id, walk: false, expr: expr || "neutre", eyeMode: null, open: false, blink: !geste && n === 1 };
      const dy = dyOf(c);
      ctx.seatDy = dy;
      const knee = KNEE;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const up = /* @__PURE__ */ __name((s2) => s2 ? `<g transform="translate(0 ${dy})">${s2}</g>` : "", "up");
      const [lx, rx] = c.legX[view];
      const shin = { ...cc, hip: knee };
      const sh = c.shoulders.map(([x, y]) => [x, y + dy]);
      let legs = "", hands;
      if (view === "front") {
        legs = [lx, rx].map((x) => leg(shin, x, c.ground, dir, 0)).join("");
        hands = [[24 - 2.8, knee - 1.4], [24 + 2.8, knee - 1.4]];
      } else if (view === "se") {
        const FWD = 3.6;
        for (const x of [rx, lx]) legs += limb([x + 0.6, knee - 0.4], [x - FWD, knee], c.legW - 0.2, c.leg) + leg(shin, x - FWD, c.ground, dir, 0);
        hands = [[lx - FWD + 0.2, knee - 1.6], [rx - FWD + 0.4, knee - 1.8]];
      } else {
        hands = [[c.hands[0][0] - 0.6, c.hands[0][1] + dy - 1.2], [c.hands[1][0] + 0.6, c.hands[1][1] + dy - 1.2]];
      }
      const act = geste ? geste.call({ ...cc, shoulders: sh }, ctx) : null;
      if (act) {
        ctx.expr = expr || act.expr || "neutre";
        ctx.eyeMode = expr ? null : act.eyeMode || null;
        ctx.open = !expr && !!act.open;
      }
      const armL = act && act.left != null ? act.left : arm(cc, sh[0], hands[0]);
      const armR = act && act.right != null ? act.right : arm(cc, sh[1], hands[1]);
      let s = up(c.backItems ? c.backItems(cc, ctx) : "");
      s += act && act.under ? act.under : "";
      s += legs;
      s += up(c.body(cc, ctx));
      if (view !== "front") s += armR;
      s += up(c.neck ? c.neck(cc, ctx) : "");
      s += view === "front" ? armL + armR : armL;
      s += up(c.overArms ? c.overArms(cc, ctx) : "");
      s += up(c.head(cc, ctx, act || {}));
      s += up(c.overHead ? c.overHead(cc, ctx) : "");
      s += act && act.over ? act.over : "";
      return s;
    }
    __name(assis2, "assis");
    module.exports = { assis: assis2, dyOf, SEAT: SEAT2 };
  }
});

// atelier/naufrage.js
var require_naufrage = __commonJS({
  "atelier/naufrage.js"(exports, module) {
    var { OUT, P, E, L, clip, bareFoot, shoe, r2 } = require_troupe2();
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
      return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(hex, "hex");
    var fade = /* @__PURE__ */ __name((c, k = 1) => {
      const [h, s, l] = hsl(c);
      return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]);
    }, "fade");
    var recolor = /* @__PURE__ */ __name((str, map) => str.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => map[m.toUpperCase()] || m), "recolor");
    var CANVAS = { cloth: "#E6DCC3", shade: "#C9BB98", seam: "#B3A27C", rope: "#B08850", ropeS: "#86663A" };
    var cord = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "cord");
    var pts = /* @__PURE__ */ __name((a) => a.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" L"), "pts");
    function tatter(x, y, color, w = 2.2, s = 1) {
      const zig = [[x - w, y - 0.1], [x - w * 0.5, y + 2.4 * s], [x, y + 0.9 * s], [x + w * 0.5, y + 3 * s], [x + w, y - 0.1]];
      return `<path d="M${r2(x - w)},${r2(y - 1)} L${pts(zig)} L${r2(x + w)},${r2(y - 1)} Z" fill="${color}"/><path d="M${pts(zig)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    __name(tatter, "tatter");
    function hole(x, y, r, color) {
      const a = Array.from({ length: 9 }, (_, i) => {
        const t = i / 9 * Math.PI * 2, k = [1, 0.86, 1, 0.9, 1, 0.84, 0.98, 0.9, 1][i];
        return [x + Math.cos(t) * r * k, y + Math.sin(t) * r * 0.72 * k];
      });
      return `<path d="M${pts(a)} Z" fill="${color}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/><path d="M${r2(x + r * 0.2)},${r2(y + r * 0.66)} q0.3,0.8 -0.2,1.5" fill="none" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round"/>`;
    }
    __name(hole, "hole");
    var rip = /* @__PURE__ */ __name((x, y, len = 2.6) => `<path d="M${r2(x - len / 2)},${r2(y)} L${r2(x - len / 6)},${r2(y + 0.7)} L${r2(x + len / 6)},${r2(y - 0.5)} L${r2(x + len / 2)},${r2(y + 0.3)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`, "rip");
    function weed(path, leaves = []) {
      return cord(path, 1.7, "#5C8A45") + `<path d="${path}" fill="none" stroke="#86B562" stroke-width="0.5" stroke-linecap="round" stroke-dasharray="1.2 1.6"/>` + leaves.map(([x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + P("M0,0 Q1.6,2 0,4.4 Q-1.6,2 0,0 Z", "#6E9E50", 0.7) + L([0, 0.6], [0, 3.6], "#4E7A3A", 0.4) + "</g>").join("");
    }
    __name(weed, "weed");
    var smudge = /* @__PURE__ */ __name((x, y, color = "#8A6A50") => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="1.8" ry="0.85" fill="${color}" opacity="0.6" transform="rotate(-14 ${r2(x)} ${r2(y)})"/><ellipse cx="${r2(x + 1.7)}" cy="${r2(y + 0.7)}" rx="0.55" ry="0.4" fill="${color}" opacity="0.55"/>`, "smudge");
    function rolledFoot(cuff, cuffS) {
      return (c, x, y, dir, tilt) => {
        const w = c.legW;
        const shin = `<rect x="${r2(x - w / 2 + 0.3)}" y="${r2(y - 3.2)}" width="${r2(w - 0.6)}" height="4.2" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r2(x - w / 2 + 0.85)}" y="${r2(y - 2.6)}" width="${r2(w - 1.7)}" height="3.8" fill="${c.skin}"/>`;
        const band = `<rect x="${r2(x - w / 2 - 0.5)}" y="${r2(y - 4.6)}" width="${r2(w + 1)}" height="2" rx="0.8" fill="${cuff}" stroke="${OUT}" stroke-width="1"/>` + L([x - w / 2 + 0.2, y - 3.4], [x + w / 2 - 0.2, y - 3.4], cuffS, 0.5);
        return shin + bareFoot(c, x, y, dir, tilt) + band;
      };
    }
    __name(rolledFoot, "rolledFoot");
    function cape(sh, view, uid, cloth = CANVAS, extra = "") {
      const [[x0, y], [x1]] = sh;
      const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      const k = view === "se" ? -1.6 : 0;
      if (view === "ne") {
        const d = `M${r2(cx - hw + 1)},${r2(y - 3.4)} Q${cx},${r2(y - 1.4)} ${r2(cx + hw - 1)},${r2(y - 3.4)} Q${r2(cx + hw + 2.8)},${r2(y - 2.4)} ${r2(cx + hw + 3)},${r2(y + 2)} L${r2(cx + hw + 2.6)},${r2(y + 8)} L${r2(cx + hw + 0.4)},${r2(y + 6.8)} L${r2(cx + 5)},${r2(y + 9)} L${r2(cx + 2)},${r2(y + 7.4)} L${r2(cx - 1.6)},${r2(y + 9.2)} L${r2(cx - 4.6)},${r2(y + 7.2)} L${r2(cx - hw + 0.4)},${r2(y + 8.6)} L${r2(cx - hw - 2.6)},${r2(y + 7.6)} L${r2(cx - hw - 3)},${r2(y + 2)} Q${r2(cx - hw - 2.8)},${r2(y - 2.4)} ${r2(cx - hw + 1)},${r2(y - 3.4)} Z`;
        return P(d, cloth.cloth) + clip(`${uid}vo`, d, extra + `<rect x="${r2(cx + 3)}" y="${r2(y - 6)}" width="14" height="20" fill="${cloth.shade}" opacity="0.8"/><path d="M${r2(cx - hw - 4)},${r2(y + 3.4)} Q${cx},${r2(y + 5)} ${r2(cx + hw + 4)},${r2(y + 3.4)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, "none");
      }
      const far = view === "se" ? 0.75 : 1;
      const panel = /* @__PURE__ */ __name((m, f) => {
        const X = /* @__PURE__ */ __name((u) => r2(cx + k + m * u * f), "X");
        return `M${X(1.4)},${r2(y - 3.6)} Q${X(hw + 1.6)},${r2(y - 4)} ${X(hw + 2.8)},${r2(y + 1.2)} L${X(hw + 2.6)},${r2(y + 7)} L${X(hw + 1)},${r2(y + 5.9)} L${X(hw - 0.6)},${r2(y + 7.4)} L${X(hw - 2.2)},${r2(y + 5.8)} L${X(4.4)},${r2(y + 6.6)} Q${X(3.6)},${r2(y + 2.8)} ${X(0.7)},${r2(y + 0.6)} Z`;
      }, "panel");
      const L1 = panel(-1, 1), R1 = panel(1, far);
      const shadeR = `<rect x="${r2(cx + k + 2)}" y="${r2(y - 6)}" width="16" height="20" fill="${cloth.shade}" opacity="0.8"/>`;
      const seam = /* @__PURE__ */ __name((m) => `<path d="M${r2(cx + k + m * (hw + 2))},${r2(y + 1.6)} L${r2(cx + k + m * 4.4)},${r2(y + 3.8)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`, "seam");
      let s = P(L1, cloth.cloth) + clip(`${uid}vl`, L1, extra + seam(-1)) + P(L1, "none");
      s += P(R1, cloth.cloth) + clip(`${uid}vr`, R1, extra + shadeR + seam(far)) + P(R1, "none");
      const kx = cx + k;
      s += cord(`M${r2(kx - 1.6)},${r2(y + 0.4)} L${r2(kx - 2.4)},${r2(y + 4.4)}`, 0.8, cloth.rope) + cord(`M${r2(kx + 1.4)},${r2(y + 0.4)} L${r2(kx + 2)},${r2(y + 4)}`, 0.8, cloth.rope);
      s += E(kx, y + 0.2, 1.5, 1.15, cloth.rope, 0.8) + L([kx - 0.6, y - 0.2], [kx + 0.5, y + 0.6], cloth.ropeS, 0.4);
      return s;
    }
    __name(cape, "cape");
    function castaway(c, spec) {
      const map = {};
      for (const col of spec.fade || []) map[col.toUpperCase()] = fade(col, spec.k || 1);
      Object.assign(map, spec.map || {});
      const F = /* @__PURE__ */ __name((s) => s ? recolor(s, map) : s, "F");
      const mapO = { ...map };
      for (const col of spec.overKeep || []) delete mapO[col.toUpperCase()];
      const FO = /* @__PURE__ */ __name((s) => recolor(s, mapO), "FO");
      const legs = spec.leg === "skin" ? { leg: c.skin, legS: c.skinS || spec.skinS } : { leg: F(c.leg), legS: F(c.legS) };
      const rolled = spec.leg === "roll" ? rolledFoot(F(c.leg), F(c.legS)) : null;
      const bare = /* @__PURE__ */ __name((cc, x, y, dir, tilt) => rolled ? rolled(cc, x, y, dir, tilt) : bareFoot(cc, x, y, dir, tilt), "bare");
      const foot = spec.bareSide ? (cc, x, y, dir, tilt) => {
        const screenLeft = x < 24, charRight = cc.view === "ne" ? !screenLeft : screenLeft;
        return spec.bareSide === "right" === charRight ? bare(cc, x, y, dir, tilt) : shoe(cc, x, y, dir, tilt);
      } : bare;
      const out = {
        ...c,
        ...spec.flags || {},
        name: c.name,
        uid: c.uid + "n",
        skinS: c.skinS || spec.skinS,
        sleeve: F(c.sleeve),
        cuff: c.cuff ? F(c.cuff) : c.cuff,
        sleeves: spec.sleeves,
        sleeveCut: spec.sleeveCut,
        bandage: spec.bandage,
        bareSide: spec.bareSide,
        shoe: c.shoe && F(c.shoe),
        shoeS: c.shoeS && F(c.shoeS),
        shoeH: c.shoeH && F(c.shoeH),
        ...legs,
        foot,
        backItems: /* @__PURE__ */ __name((cc, ctx) => (spec.backItems ? spec.backItems(cc, ctx) : F(c.backItems ? c.backItems(cc, ctx) : "")) + (spec.back ? spec.back(ctx) : ""), "backItems"),
        body: /* @__PURE__ */ __name((cc, ctx) => {
          const v = ctx.view;
          const sway = spec.sway ? spec.sway(ctx) : 0;
          let s = F(c.body(cc, ctx));
          for (const [x, y, w, sc] of spec.holes && spec.holes[v] || []) s += hole(x + sway, y, w, F(sc));
          for (const [x, y, len] of spec.rips && spec.rips[v] || []) s += rip(x + sway, y, len);
          for (const [x, y, col, w, k] of spec.tatters && spec.tatters[v] || []) s += tatter(x + sway, ctx.seatDy ? Math.min(y, 63.5 - ctx.seatDy - 3 * (k ?? 1) - 0.45) : y, F(col), w, k);
          return s + (spec.over ? spec.over(ctx, cc) : "");
        }, "body"),
        neck: c.neck ? (cc, ctx) => F(c.neck(cc, ctx)) : void 0,
        restLeft: c.restLeft ? (cc, ctx) => F(c.restLeft(cc, ctx)) : void 0,
        hold: c.hold ? (cc, h, ctx) => F(c.hold(cc, h, ctx)) : void 0,
        head: /* @__PURE__ */ __name((cc, ctx, act) => {
          const h = F(c.head(cc, ctx, act));
          return spec.headFix ? spec.headFix(h, ctx) : h;
        }, "head"),
        overArms: spec.capeFn ? (cc, ctx) => spec.capeFn(cc, ctx) : spec.cape ? (cc, ctx) => cape(spec.capeSh || c.shoulders, ctx.view, cc.uid, spec.cape, spec.capeExtra ? spec.capeExtra(ctx.view) : "") : void 0,
        overHead: spec.head ? (cc, ctx) => spec.head(ctx) : void 0,
        // le geste : appelé sur la copie de l'image (manches, bandage), bras délavés, et ce qui passe par-dessus aussi
        pose(ctx) {
          const a = c.pose.call(this, ctx);
          if (!a) return a;
          return { ...a, left: a.left != null ? F(a.left) : a.left, right: a.right != null ? F(a.right) : a.right, over: a.over ? FO(a.over) : a.over };
        }
      };
      return out;
    }
    __name(castaway, "castaway");
    module.exports = { castaway, fade, recolor, cape, tatter, hole, rip, weed, smudge, cord, CANVAS };
  }
});

// atelier/avatar_naufrage.js
var require_avatar_naufrage = __commonJS({
  "atelier/avatar_naufrage.js"(exports, module) {
    var { avatar: avatar2, naufrageChoix: naufrageChoix2, verifier: verifier2, shortLeg, delave, ACCESSOIRES: ACCESSOIRES2 } = require_avatar();
    var { bareFoot } = require_troupe2();
    var { castaway, weed, smudge } = require_naufrage();
    function avatarNaufrage2(choix2 = {}, opts = {}) {
      const c = avatar2(naufrageChoix2(verifier2(choix2)), { ...opts, uid: (opts.uid || "av") + "n" });
      const { haut, bas } = c.o;
      const dy = c.dy;
      const tissus = Object.entries(c.o.accessoires).flatMap(([place, a]) => c.acc[place].filter((col, i) => ACCESSOIRES2[a.id].zones[i] === "tissu"));
      const fadeList = [c.top, c.topS, c.topH, c.tee, c.base, c.stripe, c.bas, c.basS, c.basH, c.cuff, ...tissus].filter(Boolean);
      const T = c.top === c.base ? c.top : c.base;
      const hemTop = bas === "pantalon" || bas === "short";
      const robe = bas === "robe" || bas === "robeEntiere";
      const jupe = bas === "jupe" ? c.skirtHem : robe ? c.robeHem : null;
      const tatters = {};
      for (const [v, list, skirtX] of [
        ["front", [[17.4, 47.4, 2, 1], [29.4, 47.6, 2.2, 1.2]], [19.2, 29.4]],
        ["se", [[16.6, 47.2, 2, 1], [27.2, 47.6, 2, 1.1]], [17.8, 27.6]],
        ["ne", [[18.4, 47.4, 2, 1], [29.6, 47.2, 2.1, 1]], [19.6, 29.8]]
      ]) {
        tatters[v] = [
          ...hemTop ? list.map(([x, y, w, k]) => [x, y + dy, T, w, k]) : [],
          ...jupe ? [[skirtX[0], jupe + 0.6 + dy, c.bas, 2.1, 1], [skirtX[1], jupe + 0.8 + dy, c.bas, 2.2, 1.1]] : []
        ];
      }
      const holeC = /* @__PURE__ */ __name((v) => bas === "salopette" && v !== "ne" || robe ? c.basS : c.o.haut === "mariniere" ? c.stripe : c.topS, "holeC");
      const holes = { front: [[28.4, 39.8 + dy, 1.25, holeC("front")]], se: [[26.8, 40 + dy, 1.15, holeC("se")]], ne: [[20.2, 41.6 + dy, 1.2, holeC("ne")]] };
      const shift = /* @__PURE__ */ __name((s) => dy ? `<g transform="translate(0 ${dy})">${s}</g>` : s, "shift");
      const n = castaway(c, {
        fade: fadeList,
        leg: bas === "pantalon" || bas === "salopette" ? "roll" : "skin",
        // la robe d'une pièce garde ses manches courtes, comme le t-shirt
        sleeves: haut === "tshirt" || haut === "mariniere" || bas === "robeEntiere" ? "roll" : "torn",
        sleeveCut: haut === "tshirt" || bas === "robeEntiere" ? 6.4 : haut === "mariniere" ? 4.4 : 5,
        tatters,
        holes,
        rips: { front: [[19.6, 43.2 + dy, 2.4]], se: [[18.8, 43.4 + dy, 2.2]], ne: [[28.4, 43 + dy, 2.2]] },
        head: /* @__PURE__ */ __name(({ view }) => shift(view === "ne" ? weed("M30.4,10.6 Q33.2,14.4 32,19.4", [[32.4, 15, 24]]) : view === "se" ? weed("M13.4,11.6 Q15.8,15.2 14.6,20", [[14.8, 15.6, -20]]) + smudge(27.4, 27.6, "#A8885E") : weed("M14.2,11.8 Q16.8,15.4 15.6,20.2", [[15.8, 15.8, -20]]) + smudge(30.4, 27.6, "#A8885E")), "head")
      });
      if (bas === "short") {
        const worn = { bas: delave(c.bas), basS: delave(c.basS) };
        n.foot = (cc, x, y, dir, tilt) => shortLeg({ ...cc, ...worn }, x, true) + bareFoot(cc, x, y, dir, tilt);
      }
      return n;
    }
    __name(avatarNaufrage2, "avatarNaufrage");
    module.exports = { avatarNaufrage: avatarNaufrage2 };
  }
});

// personnages/avatar_icones.js
var require_avatar_icones = __commonJS({
  "personnages/avatar_icones.js"(exports, module) {
    var { limb, arm, poing } = require_troupe();
    var { avatar: avatar2, ACCESSOIRES: ACCESSOIRES2, couleursAccessoire: couleursAccessoire2 } = require_avatar();
    var { DESSINS, PORTE } = require_avatar_accessoires();
    var ICONES2 = {
      bonnet: { couches: ["tete"], carre: [9, -5.3, 30] },
      cacheOreilles: { couches: ["cheveux", "tete"], carre: [8.1, 0.3, 31.9] },
      echarpe: { couches: ["cou"], carre: [13.4, 27.5, 21.1] },
      chale: { couches: ["derriere", "surBras"], carre: [11.1, 26.4, 25.8] },
      pelerine: { couches: ["derriere", "surBras"], carre: [11.2, 23.4, 25.6] },
      etole: { couches: ["derriere", "surBras"], carre: [11.5, 22.2, 25.1] },
      manteau: { couches: ["derriere", "dessus", "manches"], carre: [10.4, 27.2, 27.2] },
      cire: { couches: ["derriere", "dessus", "manches"], carre: [10.4, 26.5, 27.2] },
      moufles: { couches: ["mains"], carre: [16, 35.7, 16] },
      bottesPluie: { couches: ["pieds"], carre: [16.2, 48.3, 15.7] },
      bottesFourrees: { couches: ["pieds"], carre: [15.4, 46.8, 17.2] }
    };
    function mannequin(id, cols) {
      const place = ACCESSOIRES2[id].emplacement, m = avatar2({ haut: "pull" }, { uid: `ic${id}` });
      Object.assign(m, { o: { ...m.o, accessoires: { [place]: { id } } }, acc: { [place]: cols } });
      if (PORTE[id]) Object.assign(m, PORTE[id](cols, m));
      return m;
    }
    __name(mannequin, "mannequin");
    function couche2(m, id, nom, ctx, cols) {
      const [shL, shR] = m.shoulders, [hL, hR] = m.hands;
      if (nom === "manches") return arm(m, shL, hL, null, "") + arm(m, shR, hR, null, "");
      if (nom === "mains") return [19.4, 28.6].map((x) => limb([x, hL[1] - 2.5], [x, hL[1] - 0.9], m.armW, cols[1]) + poing(m, [x, hL[1]])).join("");
      if (nom === "pieds") return m.legX.front.map((x) => DESSINS[id].pieds(m, ctx, cols, [x, m.ground, 0, 0])).join("");
      const f = DESSINS[id][nom];
      return f ? f(m, { ...ctx, couche: nom }, cols) : "";
    }
    __name(couche2, "couche");
    function icone2(id, couleurs) {
      const a = ACCESSOIRES2[id], I = ICONES2[id];
      if (!a || !I) throw new Error(`icône inconnue : ${id}`);
      const cols = couleurs || couleursAccessoire2({ id, couleurs: a.defaut });
      const m = mannequin(id, cols), ctx = { view: "front", walk: false, n: 0 };
      const corps = I.couches.map((nom) => couche2(m, id, nom, ctx, cols)).join("");
      const [x, y, s] = I.carre, k = 30 / s, n = /* @__PURE__ */ __name((v) => Math.round(v * 1e4) / 1e4, "n");
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="translate(${n(1 - x * k)} ${n(1 - y * k)}) scale(${n(k)})">${corps}</g></svg>`;
    }
    __name(icone2, "icone");
    module.exports = { icone: icone2, ICONES: ICONES2 };
  }
});

// atelier/generateur.mjs
var import_avatar = __toESM(require_avatar(), 1);
var import_troupe = __toESM(require_troupe(), 1);
var import_gestes = __toESM(require_gestes(), 1);
var import_assis = __toESM(require_assis(), 1);
var import_avatar_naufrage = __toESM(require_avatar_naufrage(), 1);
var import_avatar_icones = __toESM(require_avatar_icones(), 1);
var {
  avatar,
  verifier,
  auHasard,
  graine,
  libelle,
  couleur,
  couleursAccessoire,
  naufrageChoix,
  CHOIX,
  FORMES,
  NUANCIERS,
  NOMS_NUANCIERS,
  EMPLACEMENTS,
  ACCESSOIRES,
  TEINTURES_GAINS,
  PRIX,
  DEFAUT
} = import_avatar.default;
var { avatarNaufrage } = import_avatar_naufrage.default;
var { frame, svg, POSES, EXPRS } = import_troupe.default;
var {
  avecMainsTendues,
  avecApplaudir,
  avecPecher,
  avecPiocher,
  avecCueillir,
  avecArroser,
  avecPorter,
  avecReparer,
  avecRepousser,
  avecEcrire,
  avecLanterne,
  avecParapluie,
  avecValise,
  couche,
  CADRE_PARAPLUIE,
  CADRE_COUCHE,
  tendre,
  applaudir,
  reparer,
  ecrire
} = import_gestes.default;
var { assis, SEAT } = import_assis.default;
var { icone, ICONES } = import_avatar_icones.default;
export {
  ACCESSOIRES,
  CADRE_COUCHE,
  CADRE_PARAPLUIE,
  CHOIX,
  DEFAUT,
  EMPLACEMENTS,
  EXPRS,
  FORMES,
  ICONES,
  NOMS_NUANCIERS,
  NUANCIERS,
  POSES,
  PRIX,
  SEAT,
  TEINTURES_GAINS,
  applaudir,
  assis,
  auHasard,
  avatar,
  avatarNaufrage,
  avecApplaudir,
  avecArroser,
  avecCueillir,
  avecEcrire,
  avecLanterne,
  avecMainsTendues,
  avecParapluie,
  avecPecher,
  avecPiocher,
  avecPorter,
  avecReparer,
  avecRepousser,
  avecValise,
  couche,
  couleur,
  couleursAccessoire,
  ecrire,
  frame,
  graine,
  icone,
  libelle,
  naufrageChoix,
  reparer,
  svg,
  tendre,
  verifier
};
