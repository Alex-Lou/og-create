// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_decor.mjs : ne pas modifier à la main.
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
    var OUT3 = "#3C2819";
    var W = 1.1;
    var r23 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT3}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P2 = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r23(cx)}" cy="${r23(cy)}" rx="${r23(rx)}" ry="${r23(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r23(a[0])}" y1="${r23(a[1])}" x2="${r23(b[0])}" y2="${r23(b[1])}" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT3, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id3, d, inner) => `<clipPath id="${id3}"><path d="${d}"/></clipPath><g clip-path="url(#${id3})">${inner}</g>`, "clip");
    var EYE_DARK = "#2A2420";
    var WHITE = "#FFFFFF";
    function eyes(list, mode, ry = 2.35, EYE = EYE_DARK) {
      const cx = list.reduce((a, e) => a + e[0], 0) / list.length;
      let s = "";
      list.forEach(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1;
        if (mode === "blink") s += P2(`M${r23(x - 1.7)},${r23(y + 0.4)} Q${x},${r23(y + 1.8)} ${r23(x + 1.7)},${r23(y + 0.4)}`, "none", 1);
        else if (mode === "joy") s += P2(`M${r23(x - 1.8)},${r23(y + 1)} Q${x},${r23(y - 1.2)} ${r23(x + 1.8)},${r23(y + 1)}`, "none", 1.1);
        else if (mode === "wink" && i === 1) s += P2(`M${r23(x - 1.6)},${r23(y + 0.2)} L${r23(x + 1.6)},${r23(y + 0.2)}`, "none", 1);
        else if (mode === "big") s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
        else if (mode === "squeeze") s += P2(`M${r23(x - k * 1.3)},${r23(y - 1.4)} L${r23(x + k * 1.1)},${y} L${r23(x - k * 1.3)},${r23(y + 1.4)}`, "none", 1.1);
        else if (mode === "sleepy") {
          const top = y + 0.3;
          s += `<path d="M${r23(x - rx)},${r23(top)} Q${x},${r23(top - 0.9)} ${r23(x + rx)},${r23(top)} A${rx} ${r23(ry * 0.85)} 0 0 1 ${r23(x - rx)},${r23(top)} Z" fill="${EYE}"/>` + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0) + P2(`M${r23(x - rx - 0.5)},${r23(top + 0.3)} Q${x},${r23(top - 1.1)} ${r23(x + rx + 0.5)},${r23(top + 0.3)}`, "none", 0.9);
        } else if (mode === "sad" || mode === "angry") {
          const [tO, tI] = mode === "sad" ? [0.9, -0.3] : [-0.3, 1];
          const top = y - 0.6;
          const yl = r23(top + (k > 0 ? tO : tI)), yr = r23(top + (k > 0 ? tI : tO));
          s += `<path d="M${r23(x - rx)},${yl} L${r23(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r23(x - rx)},${yl} Z" fill="${EYE}"/>` + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0) + P2(`M${r23(x - rx - 0.4)},${r23(yl - (yr - yl) * 0.12)} L${r23(x + rx + 0.4)},${r23(yr + (yr - yl) * 0.12)}`, "none", 1);
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
    var drop = /* @__PURE__ */ __name((x, y, r, fill, w = 0.7) => P2(`M${r23(x)},${r23(y - r * 1.7)} Q${r23(x + r * 1.5)},${r23(y + r * 0.2)} ${r23(x)},${r23(y + r)} Q${r23(x - r * 1.5)},${r23(y + r * 0.2)} ${r23(x)},${r23(y - r * 1.7)} Z`, fill, w) + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "drop");
    var zee = /* @__PURE__ */ __name((x, y, z) => {
      const d = `M${r23(x)},${r23(y)} L${r23(x + z)},${r23(y)} L${r23(x)},${r23(y + z)} L${r23(x + z)},${r23(y + z)}`;
      return `<path d="${d}" fill="none" stroke="${OUT3}" stroke-width="${r23(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r23(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
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
        s += `<path d="M${r23(x - k * hw)},${r23(by + bo)} Q${r23(x)},${r23(by + (bi + bo) / 2 + arch)} ${r23(x + k * hw)},${r23(by + bi)}" fill="none" stroke="${g.brow}" stroke-width="${g.browW}" stroke-linecap="round"/>`;
      }
      const rest = expr === "neutre" && g.restEyes ? g.restEyes : "open";
      s += eyes(g.eyes, ctx.eyeMode || EYEMODE[expr] || (ctx.blink ? "blink" : rest), g.ry, g.eyeColor);
      const open = /* @__PURE__ */ __name((hw, depth) => {
        const d = `M${r23(mx - hw)},${r23(my - 0.2)} Q${r23(mx)},${r23(my + depth)} ${r23(mx + hw)},${r23(my - 0.2)} Z`;
        return P2(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
      }, "open");
      const line = /* @__PURE__ */ __name((d) => P2(d, "none", 0.9), "line");
      if (expr === "neutre") s += line(g.neutral(mx, my));
      else if (expr === "content") s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r23(mx - w)},${my} Q${mx},${r23(my + w * 0.94)} ${r23(mx + w)},${my}`);
      else if (expr === "rire") s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
      else if (expr === "surpris") s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
      else if (expr === "triste") s += line(`M${r23(mx - 1.4)},${r23(my + 1.1)} Q${mx},${r23(my - 0.1)} ${r23(mx + 1.4)},${r23(my + 1.1)}`);
      else if (expr === "fache") s += P2(`M${r23(mx - 1.7)},${r23(my + 1.3)} Q${mx},${r23(my - 0.4)} ${r23(mx + 1.7)},${r23(my + 1.3)} Q${mx},${r23(my + 0.7)} ${r23(mx - 1.7)},${r23(my + 1.3)} Z`, g.mouthC, 0.9);
      else if (expr === "gene") s += P2(`M${r23(mx - 1.8)},${r23(my + 0.6)} Q${r23(mx - 1.2)},${r23(my - 0.1)} ${r23(mx - 0.6)},${r23(my + 0.6)} Q${mx},${r23(my + 1.3)} ${r23(mx + 0.6)},${r23(my + 0.6)} Q${r23(mx + 1.2)},${r23(my - 0.1)} ${r23(mx + 1.8)},${r23(my + 0.6)}`, "none", 0.8);
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
        const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r23(x + i * a)},${r23(y + j * b)} Q${r23(x + i * a)},${r23(y + j * a)} ${r23(x + i * b)},${r23(y + j * a)}`).join(" ");
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
      const d = `M${r23(x - 3)},${r23(y)} L${r23(x + 3)},${r23(y)} L${r23(x + 3.3)},${r23(y + 3.6)} Q${r23(x - 0.4)},${r23(y + 5.4)} ${r23(x - 3.3 - toe)},${r23(y + 3.8)} Z`;
      const sole = `M${r23(x - 3.4 - toe)},${r23(y + 3.3)} Q${r23(x - 0.4)},${r23(y + 5)} ${r23(x + 3.4)},${r23(y + 3.1)} L${r23(x + 3.4)},${r23(y + 5.6)} L${r23(x - 3.4 - toe)},${r23(y + 5.6)} Z`;
      const body = P2(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P2(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${r23(x - (dir < 0 ? 3 : -3))} ${r23(y + 4.5)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r23(x - 2.3)},${r23(y)} L${r23(x + 2.3)},${r23(y)} Q${r23(x + 2.9)},${r23(y + 3.4)} ${r23(x + 1.4)},${r23(y + 4.3)} L${r23(x - 1.4 - toe)},${r23(y + 4.3)} Q${r23(x - 3.1 - toe)},${r23(y + 3.8)} ${r23(x - 2.3)},${r23(y)} Z`;
      let s = P2(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT3, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${r23(x - (dir < 0 ? 3 : -3))} ${r23(y + 4.5)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      const top = c.hip;
      return `<rect x="${r23(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r23(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/><rect x="${r23(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r23(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>` + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
    }
    __name(leg, "leg");
    function arm(c, a, b, elbow, main) {
      const pts3 = elbow ? [a, elbow, b] : [a, b];
      if (c.sleeves || c.bandage) return armOf(c, pts3, main);
      const d = "M" + pts3.map((p) => `${r23(p[0])},${r23(p[1])}`).join(" L");
      const line = /* @__PURE__ */ __name((color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "line");
      let s = line(OUT3, c.armW + W * 2) + line(c.sleeve, c.armW);
      if (c.cuff) {
        const f = pts3[pts3.length - 2];
        const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
        const at = /* @__PURE__ */ __name((k) => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len], "at");
        s += limb(at(2.5), at(0.9), c.armW, c.cuff);
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(arm, "arm");
    var poing = /* @__PURE__ */ __name((c, b) => E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ""), "poing");
    function armOf(c, pts3, main) {
      const b = pts3[pts3.length - 1], f = pts3[pts3.length - 2];
      const len = Math.hypot(b[0] - f[0], b[1] - f[1]) || 1;
      const ux = (b[0] - f[0]) / len, uy = (b[1] - f[1]) / len, nx = -uy, ny = ux;
      const at = /* @__PURE__ */ __name((k) => [b[0] - ux * k, b[1] - uy * k], "at");
      const path = /* @__PURE__ */ __name((list) => "M" + list.map((p) => `${r23(p[0])},${r23(p[1])}`).join(" L"), "path");
      const stroke = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
      const fw = c.armW * 0.8;
      let s = "";
      let cut = null;
      if (c.sleeves) {
        const k = Math.min(c.sleeveCut || 5, len * 0.62);
        cut = at(k);
        const d = path([...pts3.slice(0, -1), cut]);
        s += stroke(d, OUT3, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
        const fd = path([cut, b]);
        s += stroke(fd, OUT3, fw + W * 2) + stroke(fd, c.skin, fw);
        const h = c.armW / 2 + 0.5, P22 = /* @__PURE__ */ __name((k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2], "P2");
        if (c.sleeves === "torn") {
          const zig = [P22(h, -0.5), P22(h * 0.45, 1.5), P22(0, 0.4), P22(-h * 0.5, 1.6), P22(-h, -0.5)];
          s += `<path d="${path([P22(h, -1.8), ...zig, P22(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT3, 0.85);
        } else {
          const r = h + 0.3, band = [P22(r, -0.7), P22(r, 0.75), P22(-r, 0.75), P22(-r, -0.7)];
          s += `<path d="${path(band)} Z" fill="${c.cuff || c.sleeve}" stroke="${OUT3}" stroke-width="0.85" stroke-linejoin="round"/>` + L(P22(r * 0.7, -0.1), P22(-r * 0.7, -0.1), "rgba(255,255,255,.35)", 0.45);
        }
      } else {
        const d = path(pts3);
        s += stroke(d, OUT3, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
      }
      if (c.bandage) {
        const screenLeft = pts3[0][0] < 24;
        const charLeft = c.view === "ne" ? screenLeft : !screenLeft;
        if (c.bandage === "left" === charLeft) {
          const w = (cut ? fw : c.armW) + 0.7;
          s += limb(at(2.2), at(4.4), w, "#F4EEDF");
          for (const k of [2.9, 3.7]) {
            const p = at(k);
            s += L([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT3, 1.5) + L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
        }
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(armOf, "armOf");
    function frame(c, view, pose, n, expr) {
      const id3 = `${c.uid}${view}${pose}${n}`;
      const cc = { ...c, uid: id3, view };
      const walk = pose === "marche";
      const ph = walk ? [1, 0, -1, 0][n] : 0;
      const bob = walk && n % 2 === 1 ? -1 : 0;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const ctx = { view, pose, n, ph, id: id3, walk };
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
    module.exports = { OUT: OUT3, W, r2: r23, st, P: P2, E, L, limb, clip, eyes, expression, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES };
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
    var { OUT: OUT3, E, r2: r23 } = require_troupe2();
    var K2 = 1.25;
    var TW2 = 64 * K2;
    var TH2 = 32 * K2;
    var PROP2 = [-40 * K2, -92 * K2, 80 * K2, 112 * K2];
    var BUILDING = [-76 * K2, -124 * K2, 152 * K2, 168 * K2];
    var BIG = [-112 * K2, -200 * K2, 224 * K2, 264 * K2];
    var pt = /* @__PURE__ */ __name((u, v, z = 0) => [(u - v) * TW2 / 2, (u + v) * TH2 / 2 - z * K2], "pt");
    var LEAVES2 = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
    var PINE2 = { light: "#86C774", mid: "#4F9A4C", dark: "#2F6E3A" };
    var WOOD2 = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
    var WOOD_DARK2 = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
    var GRANITE = { top: "#CBC6BA", left: "#A6A094", right: "#7E786E" };
    var poly3 = /* @__PURE__ */ __name((points, fill, w = 0.9) => `<polygon points="${points.map((p) => `${r23(p[0])},${r23(p[1])}`).join(" ")}" fill="${fill}" stroke="${OUT3}" stroke-width="${w}" stroke-linejoin="round"/>`, "poly");
    var face2 = /* @__PURE__ */ __name((pts3, fill, w) => poly3(pts3.map((p) => pt(...p)), fill, w), "face");
    var shadow2 = /* @__PURE__ */ __name((u, v, r, a = 0.22) => {
      const [x, y] = pt(u, v);
      return E(x, y, r * TW2 * 0.55, r * TH2 * 0.55, `rgba(40,55,20,${a})`, 0);
    }, "shadow");
    function box2(u0, v0, u1, v1, z0, z1, c, w = 0.9) {
      return face2([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], c.left, w) + face2([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], c.right, w) + face2([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], c.top, w);
    }
    __name(box2, "box");
    function crown(blobs, c, id3) {
      const out = blobs.map(([x, y, r]) => `<circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r + 1.1)}" fill="${OUT3}"/>`).join("");
      const base = blobs.map(([x, y, r]) => `<circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r)}" fill="${c.mid}"/>`).join("");
      const clipId = `cr${id3}`;
      const clipPath = `<clipPath id="${clipId}">${blobs.map(([x, y, r]) => `<circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r)}"/>`).join("")}</clipPath>`;
      const shade = blobs.map(([x, y, r]) => `<circle cx="${r23(x + r * 0.35)}" cy="${r23(y + r * 0.45)}" r="${r23(r * 0.85)}" fill="${c.dark}"/>`).join("");
      const lite = blobs.map(([x, y, r]) => `<circle cx="${r23(x - r * 0.25)}" cy="${r23(y - r * 0.3)}" r="${r23(r * 0.62)}" fill="${c.mid}"/>`).join("") + blobs.map(([x, y, r]) => `<circle cx="${r23(x - r * 0.4)}" cy="${r23(y - r * 0.45)}" r="${r23(r * 0.32)}" fill="${c.light}"/>`).join("");
      return out + base + `<defs>${clipPath}</defs><g clip-path="url(#${clipId})">${shade}${lite}</g>`;
    }
    __name(crown, "crown");
    function boulder2(u, v, ru, rv, h, c, seed = 1) {
      const [x, y] = pt(u, v);
      const w = ru * TW2 * 0.78, d = rv * TH2 * 0.7, H = h * K2;
      const j = /* @__PURE__ */ __name((k) => 1 + 0.14 * Math.sin(seed * 12.9898 + k * 78.233), "j");
      const path = `M${r23(x - w)},${r23(y)} Q${r23(x - w * 1.02)},${r23(y - H * 0.7 * j(1))} ${r23(x - w * 0.45)},${r23(y - H * j(2))} Q${r23(x + w * 0.1)},${r23(y - H * 1.12 * j(3))} ${r23(x + w * 0.62)},${r23(y - H * 0.78 * j(4))} Q${r23(x + w * 1.04)},${r23(y - H * 0.42)} ${r23(x + w)},${r23(y)} Q${x},${r23(y + d)} ${r23(x - w)},${r23(y)} Z`;
      const id3 = `rk${seed}_${[u, v, ru, rv, h].map(r23).join("_")}`.replace(/-/g, "m").replace(/\./g, "p");
      return `<path d="${path}" fill="${c.left}" stroke="${OUT3}" stroke-width="1.1" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id3})"><ellipse cx="${r23(x + w * 0.55)}" cy="${r23(y - H * 0.1)}" rx="${r23(w * 0.8)}" ry="${r23(H * 0.75)}" fill="${c.right}"/><ellipse cx="${r23(x - w * 0.25)}" cy="${r23(y - H * 0.95)}" rx="${r23(w * 0.7)}" ry="${r23(H * 0.38)}" fill="${c.top}"/></g><path d="M${r23(x - w * 0.6)},${r23(y - H * 0.7)} Q${r23(x - w * 0.35)},${r23(y - H * 0.98)} ${r23(x + w * 0.05)},${r23(y - H * 1.02)}" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    }
    __name(boulder2, "boulder");
    var flower = /* @__PURE__ */ __name((x, y, r, petal2, heart = "#E8A13A") => [0, 72, 144, 216, 288].map((a) => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.78, r * 0.78, petal2, 0.5)).join("") + E(x, y, r * 0.55, r * 0.55, heart, 0.4), "flower");
    var stroke = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
    var thick = /* @__PURE__ */ __name((d, w, color) => stroke(d, w + 2.2, OUT3) + stroke(d, w, color), "thick");
    module.exports = { K: K2, TW: TW2, TH: TH2, PROP: PROP2, BUILDING, BIG, pt, poly: poly3, face: face2, shadow: shadow2, box: box2, crown, boulder: boulder2, flower, stroke, thick, LEAVES: LEAVES2, PINE: PINE2, WOOD: WOOD2, WOOD_DARK: WOOD_DARK2, GRANITE };
    function cylinder2(u, v, r, z0, z1, c, w = 1) {
      const [x, y0] = pt(u, v, z0), [, y1] = pt(u, v, z1);
      const rx = r * TW2 * 0.7, ry = r * TH2 * 0.7;
      const side = `M${r23(x - rx)},${r23(y1)} L${r23(x - rx)},${r23(y0)} A${r23(rx)} ${r23(ry)} 0 0 0 ${r23(x + rx)},${r23(y0)} L${r23(x + rx)},${r23(y1)} Z`;
      return `<path d="${side}" fill="${c.left}" stroke="${OUT3}" stroke-width="${w}" stroke-linejoin="round"/><path d="M${r23(x + rx * 0.15)},${r23(y1 + ry)} L${r23(x + rx * 0.15)},${r23(y0 + ry)} A${r23(rx)} ${r23(ry)} 0 0 0 ${r23(x + rx)},${r23(y0)} L${r23(x + rx)},${r23(y1)} Z" fill="${c.right}"/><path d="${side}" fill="none" stroke="${OUT3}" stroke-width="${w}" stroke-linejoin="round"/>` + E(x, y1, rx, ry, c.top, w);
    }
    __name(cylinder2, "cylinder");
    var disc2 = /* @__PURE__ */ __name((u, v, r, z, fill, w = 1) => {
      const [x, y] = pt(u, v, z);
      return E(x, y, r * TW2 * 0.7, r * TH2 * 0.7, fill, w);
    }, "disc");
    function gable2(u0, v0, u1, v1, z, h, c, o = 0.08) {
      const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o;
      return face2([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], c.back, 1) + face2([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], c.gable, 1) + face2([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], c.front, 1);
    }
    __name(gable2, "gable");
    function pyramid2(u0, v0, u1, v1, z, h, c, o = 0.06) {
      const A = [u0 - o, v0 - o, z], B = [u1 + o, v0 - o, z], Cc = [u1 + o, v1 + o, z], Dd = [u0 - o, v1 + o, z], T = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
      return face2([A, B, T], c.back, 1) + face2([Dd, A, T], c.back, 1) + face2([B, Cc, T], c.right, 1) + face2([Cc, Dd, T], c.front, 1);
    }
    __name(pyramid2, "pyramid");
    var post2 = /* @__PURE__ */ __name((u, v, z0, z1, c = WOOD_DARK2, w = 0.03) => box2(u - w, v - w, u + w, v + w, z0, z1, c, 0.7), "post");
    var rail2 = /* @__PURE__ */ __name((a, b, z, w = 2, c = WOOD_DARK2.left) => {
      const p = pt(a[0], a[1], z), q = pt(b[0], b[1], z);
      return `<path d="M${r23(p[0])},${r23(p[1])} L${r23(q[0])},${r23(q[1])}" stroke="${OUT3}" stroke-width="${w + 1.6}" stroke-linecap="round"/><path d="M${r23(p[0])},${r23(p[1])} L${r23(q[0])},${r23(q[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    }, "rail");
    function flame(x, y, h, w, k) {
      const sway = Math.sin(k * Math.PI * 2) * w * 0.35;
      const tip = /* @__PURE__ */ __name((s, dx) => `M${r23(x - w * s)},${r23(y)} Q${r23(x - w * s * 1.1)},${r23(y - h * s * 0.55)} ${r23(x + dx)},${r23(y - h * s)} Q${r23(x + w * s * 1.1)},${r23(y - h * s * 0.55)} ${r23(x + w * s)},${r23(y)} Z`, "tip");
      return `<path d="${tip(1, sway)}" fill="#E8573A" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
    }
    __name(flame, "flame");
    var glow = /* @__PURE__ */ __name((x, y, r, rgb = "255,224,138", a = 0.38) => {
      const id3 = `lueur_${[x, y, r, a].map(r23).join("_")}_${rgb}`.replace(/,/g, "-").replace(/\./g, "p");
      return `<defs><radialGradient id="${id3}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r23(Math.min(0.9, a * 1.8))}"/><stop offset="0.45" stop-color="rgb(${rgb})" stop-opacity="${r23(a * 0.8)}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r * 1.25)}" fill="url(#${id3})"/>`;
    }, "glow");
    var STONE2 = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
    var WHITE_STONE2 = { top: "#FBF8F1", left: "#E7E1D3", right: "#C9C0AC" };
    var ROOF_RED2 = { back: "#B9503B", front: "#E06E52", gable: "#F3E4C4", right: "#B9503B" };
    var ROOF_BLUE = { back: "#3E6FA8", front: "#5C8FD0", gable: "#F3E4C4", right: "#3E6FA8" };
    var THATCH2 = { back: "#C99A45", front: "#EBC46F", gable: "#F3E4C4", right: "#C99A45" };
    var WALL2 = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
    var SOIL = { top: "#946240", left: "#784C2E", right: "#5E3A22" };
    var WATER2 = "#5BAFD8";
    var WATER_LIGHT = "#9AD6F0";
    var BRASS2 = { top: "#F4D67A", left: "#E2B546", right: "#B88A2E" };
    var IRON3 = { top: "#9AA2AD", left: "#7E8691", right: "#5E6670" };
    Object.assign(module.exports, { cylinder: cylinder2, disc: disc2, gable: gable2, pyramid: pyramid2, post: post2, rail: rail2, flame, glow, STONE: STONE2, WHITE_STONE: WHITE_STONE2, ROOF_RED: ROOF_RED2, ROOF_BLUE, THATCH: THATCH2, WALL: WALL2, SOIL, WATER: WATER2, WATER_LIGHT, BRASS: BRASS2, IRON: IRON3 });
  }
});

// atelier/arbres.js
var require_arbres = __commonJS({
  "atelier/arbres.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, r2: r23 } = require_troupe2();
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
    var rond = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r)}" fill="${fill}"/>`, "rond");
    var sc = /* @__PURE__ */ __name((d, k) => d.replace(/-?\d+(\.\d+)?/g, (n) => r23(n * k)), "sc");
    function touffe(id3, lobes, c, marques, k, neige = false) {
      const L = lobes.map(([x, y, r, f]) => [x * k, y * k, r * k, f]);
      const contour = L.map(([x, y, r]) => rond(x, y, r + W, OUT3)).join("");
      const zone = `<clipPath id="${id3}">${L.map(([x, y, r]) => rond(x, y, r, "#000")).join("")}</clipPath>`;
      const hauts = L.filter((l) => l[3] !== 0);
      const dedans = L.map(([x, y, r]) => rond(x, y, r, c.dark)).join("") + L.map(([x, y, r]) => rond(x - r * 0.2, y - r * 0.32, r * 0.86, c.mid)).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.34, y - r * 0.48, r * 0.5, c.light)).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.22, y - r * 0.3, r * 0.5, c.mid)).join("") + marques.map(([x, y, s = 1]) => {
        const X = x * k, Y = y * k, S2 = s * Math.max(k, 0.85);
        return `<path d="M${r23(X - 2.6 * S2)},${r23(Y)} Q${r23(X - 1.3 * S2)},${r23(Y + 1.8 * S2)} ${r23(X)},${r23(Y)} Q${r23(X + 1.3 * S2)},${r23(Y + 1.8 * S2)} ${r23(X + 2.6 * S2)},${r23(Y)}" fill="none" stroke="${c.dark}" stroke-width="0.8" stroke-linecap="round"/>`;
      }).join("") + (neige ? hauts.map(([x, y, r]) => rond(x + r * 0.04, y - r * 0.46, r * 0.8, "#D6E4EE")).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.04, y - r * 0.58, r * 0.78, "#FFFFFF")).join("") + hauts.map(([x, y, r]) => rond(x - r * 0.3, y - r * 0.82, r * 0.16, "#F2F7FC")).join("") : "");
      return contour + `<defs>${zone}</defs><g clip-path="url(#${id3})">${dedans}</g>`;
    }
    __name(touffe, "touffe");
    function tronc(id3, k) {
      const d = sc("M-13,2.2 Q-8,0.6 -6.4,-5 Q-5,-16 -5,-26 Q-5.4,-34 -12,-44 L-5,-46 Q-1.4,-40 0,-36 Q1.6,-41 7,-47 L13,-43 Q5.6,-34 5.2,-26 Q5,-16 6.2,-6 Q7.6,0.4 13,2.6 Q8.6,4 5.2,2.4 Q2.6,5 -0.6,3.4 Q-3.6,4.8 -6,2.6 Q-9.4,3.6 -13,2.2 Z", k);
      const dedans = `<path d="${sc("M1.6,4 Q2.6,-14 2,-27 Q4,-36 9,-46 L16,-46 L16,4 Z", k)}" fill="${BOIS.right}"/><path d="${sc("M5.2,2.4 Q8,2.8 13,2.6 L14,6 L4,6 Z", k)}" fill="${BOIS.right}"/><ellipse cx="0" cy="${r23(-38 * k)}" rx="${r23(16 * k)}" ry="${r23(8 * k)}" fill="${BOIS.right}"/><path d="${sc("M-2.6,-7 Q-3.2,-13 -2.4,-19 M2.8,-11 Q3.4,-16 2.8,-22 M-3.4,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.6,-4 Q-4,-12 -4.2,-20", k)}" fill="none" stroke="${BOIS.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
      return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})">${dedans}</g>`;
    }
    __name(tronc, "tronc");
    var herbe = /* @__PURE__ */ __name((x, y, col, s = 1) => `<path d="${sc("M-3,0 Q-3.2,-3 -4.6,-4.6 Q-1.6,-3.6 -0.8,-1.4 Q-0.6,-4.8 0.4,-6.2 Q1.6,-3.6 1,-1.2 Q2.2,-3.6 4.4,-4.4 Q3,-2 3,0 Q0,1.2 -3,0 Z", s)}" transform="translate(${r23(x)} ${r23(y)})" fill="${col}" stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"/>`, "herbe");
    var champignon = /* @__PURE__ */ __name((x, y) => `<g transform="translate(${r23(x)} ${r23(y)})">` + P2("M-1,0 L-0.8,-2.2 L0.8,-2.2 L1,0 Z", "#F6EBD6", 0.7) + P2("M-2.9,-2 Q-2.6,-5.2 0,-5.4 Q2.6,-5.2 2.9,-2 Q0,-1.3 -2.9,-2 Z", "#E2574C", 0.8) + E(-1, -3.8, 0.6, 0.5, "#FFFFFF", 0) + E(1.1, -3.1, 0.45, 0.4, "#FFFFFF", 0) + "</g>", "champignon");
    var PETALES = [0, 72, 144, 216, 288].map((a) => [Math.cos((a - 90) * Math.PI / 180) * 1.2, Math.sin((a - 90) * Math.PI / 180) * 1.2]);
    var fleurette = /* @__PURE__ */ __name((x, y, col) => PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 1.4, OUT3)).join("") + PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 0.95, col)).join("") + rond(x, y, 0.7, "#F2B33D"), "fleurette");
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
      const id3 = `arb${petit ? "p" : "g"}${vert[0]}${fleuri ? "f" : ""}${neige ? "n" : ""}`;
      return E(3 * k, 1.5, 27 * k, 12 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + tronc(`${id3}t`, k) + touffe(`${id3}a`, FOND, c.fond, [[-6, -69], [13, -66, 0.9], [24, -74, 0.8]], k, neige) + touffe(`${id3}b`, DROITE, c.devant, [[15, -47], [25, -52, 0.9]], k, neige) + touffe(`${id3}c`, GAUCHE, c.devant, [[-23, -46], [-15, -52, 0.9], [-31, -55, 0.8]], k, neige) + touffe(`${id3}d`, MILIEU, c.devant, [[-3, -54], [3, -60, 0.8]], k, neige) + (fleuri ? pied(k) : "") + (neige ? congere(k) : "");
    }
    __name(arbre, "arbre");
    var ARBRES = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleuri of [false, true]) {
      const fichier2 = ["arbre", petit && "petit", vert === "profond" && "profond", fleuri && "fleuri"].filter(Boolean).join("_");
      const libelle = `Arbre (${[petit ? "petit" : "grand", `vert ${vert}`, fleuri && "pied fleuri"].filter(Boolean).join(", ")})`;
      ARBRES.push([fichier2, libelle, { vert, petit, fleuri }]);
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
    function pomme(id3, x, y, s, feuille) {
      const r = 2.7 * s;
      const d = `M${r23(x)},${r23(y - r * 0.7)} Q${r23(x + r * 1.1)},${r23(y - r * 1.25)} ${r23(x + r * 1.05)},${r23(y + r * 0.05)} Q${r23(x + r * 0.9)},${r23(y + r * 1.05)} ${r23(x)},${r23(y + r * 0.95)} Q${r23(x - r * 0.9)},${r23(y + r * 1.05)} ${r23(x - r * 1.05)},${r23(y + r * 0.05)} Q${r23(x - r * 1.1)},${r23(y - r * 1.25)} ${r23(x)},${r23(y - r * 0.7)} Z`;
      return `<path d="${d}" fill="#E2574C" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})">${E(x + r * 0.55, y + r * 0.55, r * 0.95, r * 0.8, "#B83A35", 0)}</g><ellipse cx="${r23(x - r * 0.42)}" cy="${r23(y - r * 0.2)}" rx="${r23(r * 0.3)}" ry="${r23(r * 0.38)}" fill="#FFFFFF" opacity="0.85"/><path d="M${r23(x)},${r23(y - r * 0.6)} q${r23(0.2 * s)},${r23(-1.3 * s)} ${r23(0.9 * s)},${r23(-1.8 * s)}" stroke="${OUT3}" stroke-width="${r23(0.9 * Math.max(s, 0.8))}" fill="none" stroke-linecap="round"/>` + (feuille ? `<path d="M${r23(x + 0.7 * s)},${r23(y - r * 0.85)} q${r23(1.6 * s)},${r23(-1.6 * s)} ${r23(3.2 * s)},${r23(-0.9 * s)} q${r23(-1.2 * s)},${r23(1.4 * s)} ${r23(-3.2 * s)},${r23(0.9 * s)} Z" fill="#8CC152" stroke="${OUT3}" stroke-width="0.7" stroke-linejoin="round"/>` : "");
    }
    __name(pomme, "pomme");
    var petale = /* @__PURE__ */ __name((x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT3}" stroke-width="0.5" transform="translate(${r23(x)} ${r23(y)}) rotate(${a})"/>`, "petale");
    var POMMES = [[-26, -49, 1, true], [-15, -58, 1], [-31, -57, 0.9], [-7, -46, 1], [3, -66, 1, true], [13, -50, 1], [23, -45, 1, true], [27, -55, 0.9], [-3, -76, 0.9], [14, -73, 0.9]];
    var TOMBEES = [[12, 5, 1], [-17, 6, 0.95, true]];
    var FLEURS = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];
    var PETALES_SOL = [[-16, 4.5, 30, "#F7B6C8"], [-12, 7, -40, "#FFFFFF"], [9, 6, 70, "#FFFFFF"], [14, 3.5, -20, "#F7B6C8"], [18, 6.5, 50, "#FFFFFF"], [-20, 2.5, 80, "#FFFFFF"]];
    function pommier({ vert = "doux", petit = false, fleurs = false, tombees = false } = {}) {
      const k = petit ? 0.76 : 1, s = 1.12 * Math.max(k, 0.85);
      const id3 = `pom${petit ? "p" : "g"}${vert[0]}${fleurs ? "f" : ""}${tombees ? "t" : ""}`;
      let o = arbre({ vert, petit });
      if (fleurs) o += FLEURS.map(([x, y], i) => fleurette(x * k, y * k, i % 3 ? "#FFFFFF" : "#F7B6C8")).join("") + (tombees ? PETALES_SOL.map(([x, y, a, col]) => petale(x * k, y, a, col)).join("") : "");
      else o += POMMES.map(([x, y, t, f], i) => pomme(`${id3}${i}`, x * k, y * k, t * s, f)).join("") + (tombees ? TOMBEES.map(([x, y, t, f], i) => pomme(`${id3}s${i}`, x * k, y, t * 1.05, f)).join("") : "");
      return o;
    }
    __name(pommier, "pommier");
    var POMMIERS = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleurs of [false, true]) for (const tombees of [false, true]) {
      const fichier2 = ["pommier", petit && "petit", vert === "profond" && "profond", fleurs && "fleurs", tombees && "tombees"].filter(Boolean).join("_");
      const libelle = `Pommier (${[petit ? "petit" : "grand", `vert ${vert}`, fleurs ? "en fleurs" : "en pommes", tombees && (fleurs ? "pétales tombés" : "pommes tombées")].filter(Boolean).join(", ")})`;
      POMMIERS.push([fichier2, libelle, { vert, petit, fleurs, tombees }]);
    }
    var feuilleMorte = /* @__PURE__ */ __name((x, y, a, col, s = 1) => `<g transform="translate(${r23(x)} ${r23(y)}) rotate(${a}) scale(${s})"><path d="M0,-2.8 Q2.2,-0.6 0,2.8 Q-2.2,-0.6 0,-2.8 Z" fill="${col}" stroke="${OUT3}" stroke-width="0.6" stroke-linejoin="round"/><path d="M0,-1.8 L0,2.2" stroke="${OUT3}" stroke-width="0.4" stroke-linecap="round" opacity="0.6"/></g>`, "feuilleMorte");
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
      const fichier2 = ["arbre_automne", petit && "petit", teinte === "rouge" && "rouge", feuilles && "feuilles"].filter(Boolean).join("_");
      const libelle = `Arbre d'automne (${[petit ? "petit" : "grand", teinte, feuilles && "feuilles tombées"].filter(Boolean).join(", ")})`;
      AUTOMNES.push([fichier2, libelle, { teinte, petit, feuilles }]);
    }
    var VERTS_BOULEAU = {
      doux: { devant: { light: "#EEF8C0", mid: "#C3E27E", dark: "#8BBB55" }, fond: { light: "#C2DF8C", mid: "#98C45E", dark: "#6C9C47" } },
      profond: { devant: { light: "#D9EE9A", mid: "#A6D262", dark: "#6FA545" }, fond: { light: "#A4CC70", mid: "#7AAE4D", dark: "#527F3E" } }
    };
    var ECORCE = { left: "#F4F1EA", right: "#CFC8BA", marque: "#3A3A3A" };
    function troncBouleau(id3, k) {
      const d = sc("M-8,1.8 Q-4.5,0.6 -3.6,-4 Q-3,-20 -3.4,-36 Q-4,-44 -9,-52 L-5.4,-54.4 Q-1.6,-48 0,-44 Q1.4,-49 6,-55.4 L9.4,-52.4 Q4,-44 3.4,-36 Q3,-20 3.8,-5 Q5,0.6 8.5,2 Q5,3.2 2.6,2 Q0,3.6 -2.6,2.2 Q-5,3.4 -8,1.8 Z", k);
      const marques = [[-2.2, -9, 2.4], [1.4, -15, 2], [-2.4, -22, 2.2], [1.2, -28, 2.6], [-1.8, -34, 1.8], [-5.6, -46, 1.6], [4.6, -47, 1.6]];
      const dedans = `<path d="${sc("M1.2,4 Q1.8,-20 1.6,-36 Q3,-44 8,-56 L14,-56 L14,4 Z", k)}" fill="${ECORCE.right}"/><path d="${sc("M-9,4 L-9,-1.5 Q-4,-3.5 0,-3 Q4,-3.5 9,-1.5 L9,4 Z", k)}" fill="#8E877C"/><ellipse cx="0" cy="${r23(-44 * k)}" rx="${r23(12 * k)}" ry="${r23(6 * k)}" fill="${ECORCE.right}"/>` + marques.map(([x, y, w]) => `<path d="M${r23((x - w / 2) * k)},${r23(y * k)} Q${r23(x * k)},${r23((y - 0.9) * k)} ${r23((x + w / 2) * k)},${r23(y * k)} Q${r23(x * k)},${r23((y + 0.6) * k)} ${r23((x - w / 2) * k)},${r23(y * k)} Z" fill="${ECORCE.marque}"/>`).join("");
      return `<path d="${d}" fill="${ECORCE.left}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})">${dedans}</g>`;
    }
    __name(troncBouleau, "troncBouleau");
    var B_FOND = [[-10, -84, 10], [6, -90, 10.5], [17, -78, 9], [-19, -72, 8.5], [1, -75, 10]];
    var B_GAUCHE = [[-16, -60, 10], [-24, -55, 7], [-19, -48, 6.5, 0], [-9, -50, 7, 0]];
    var B_DROITE = [[14, -63, 9.5], [22, -57, 7], [17, -49, 6.5, 0], [7, -52, 6.5, 0]];
    var B_MILIEU = [[-1, -71, 9], [-6, -61, 6.5, 0], [5, -62, 6.5, 0]];
    function bouleau({ vert = "doux", petit = false, fleuri = false } = {}) {
      const c = VERTS_BOULEAU[vert], k = petit ? 0.76 : 1;
      const id3 = `bou${petit ? "p" : "g"}${vert[0]}${fleuri ? "f" : ""}`;
      return E(2 * k, 1.5, 21 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + troncBouleau(`${id3}t`, k) + touffe(`${id3}a`, B_FOND, c.fond, [[-4, -80], [12, -76, 0.8]], k) + touffe(`${id3}b`, B_DROITE, c.devant, [[13, -55, 0.8], [20, -60, 0.7]], k) + touffe(`${id3}c`, B_GAUCHE, c.devant, [[-17, -53, 0.8], [-10, -58, 0.7]], k) + touffe(`${id3}d`, B_MILIEU, c.devant, [[-2, -64, 0.8]], k) + (fleuri ? pied(k * 0.85) : "");
    }
    __name(bouleau, "bouleau");
    var BOULEAUX = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const fleuri of [false, true]) {
      const fichier2 = ["bouleau", petit && "petit", vert === "profond" && "profond", fleuri && "fleuri"].filter(Boolean).join("_");
      const libelle = `Bouleau (${[petit ? "petit" : "grand", `vert ${vert}`, fleuri && "pied fleuri"].filter(Boolean).join(", ")})`;
      BOULEAUX.push([fichier2, libelle, { vert, petit, fleuri }]);
    }
    var PINS = {
      doux: { light: "#A8D88A", mid: "#5FAE5C", dark: "#3B7F45" },
      profond: { light: "#8CC77A", mid: "#4A9650", dark: "#2C6A3C" }
    };
    function etageD(y, w, h, n) {
      const top = y - h, pas = 2 * w / n;
      let d = `M0,${r23(top)} Q${r23(-w * 0.3)},${r23(top + h * 0.6)} ${r23(-w)},${r23(y)}`;
      for (let i = 0; i < n; i++) {
        const x0 = -w + i * pas;
        d += ` Q${r23(x0 + pas / 2)},${r23(y + 3.6)} ${r23(x0 + pas)},${r23(y)}`;
      }
      return d + ` Q${r23(w * 0.3)},${r23(top + h * 0.6)} 0,${r23(top)} Z`;
    }
    __name(etageD, "etageD");
    function etage(id3, y, w, h, n, c, neige, yNeige) {
      const d = etageD(y, w, h, n), top = y - h, pas = 2 * w / n;
      let dedans = `<path d="M${r23(w * 0.08)},${r23(top)} Q${r23(w * 0.45)},${r23(top + h * 0.6)} ${r23(w + 2)},${r23(y + 4)} L${r23(w * 0.12)},${r23(y + 4)} Z" fill="${c.dark}"/>`;
      for (let i = 0; i < n; i++) dedans += `<ellipse cx="${r23(-w + (i + 0.5) * pas)}" cy="${r23(y + 1.6)}" rx="${r23(pas * 0.42)}" ry="2" fill="${c.dark}" opacity="0.55"/>`;
      dedans += `<path d="M-1.2,${r23(top + 3)} Q${r23(-w * 0.32)},${r23(top + h * 0.6)} ${r23(-w + 3)},${r23(y - 1.2)}" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + [[-w * 0.45, y - h * 0.35], [w * 0.15, y - h * 0.55], [-w * 0.1, y - h * 0.2], [w * 0.5, y - h * 0.25]].map(([x, yy]) => `<path d="M${r23(x - 1.8)},${r23(yy - 1.2)} L${r23(x)},${r23(yy + 0.6)} L${r23(x + 1.8)},${r23(yy - 1.2)}" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
      if (neige) {
        const yc = yNeige, xc = w * (yc - top) / h * 1.08;
        dedans += `<path d="M0,${r23(top - 0.4)} Q${r23(-w * 0.18)},${r23(top + h * 0.3)} ${r23(-xc - 1)},${r23(yc)} Q${r23(-xc * 0.6)},${r23(yc + 3)} ${r23(-xc * 0.3)},${r23(yc + 0.6)} Q0,${r23(yc + 3.2)} ${r23(xc * 0.3)},${r23(yc + 0.4)} Q${r23(xc * 0.65)},${r23(yc + 2.8)} ${r23(xc + 1)},${r23(yc - 0.4)} Q${r23(w * 0.18)},${r23(top + h * 0.3)} 0,${r23(top - 0.4)} Z" fill="#FFFFFF" stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r23(w * 0.06)},${r23(top + 1.5)} Q${r23(w * 0.2)},${r23(top + h * 0.3)} ${r23(xc * 0.9)},${r23(yc)}" stroke="#D6E4EE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      }
      let o = `<path d="${d}" fill="${c.mid}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})">${dedans}</g>`;
      if (neige) {
        let f = `M${r23(-w + 1)},${r23(y - 0.2)}`;
        for (let i = 0; i < n; i++) {
          const x0 = -w + i * pas;
          f += ` Q${r23(x0 + pas / 2)},${r23(y + 3.4)} ${r23(Math.min(x0 + pas, w - 1))},${r23(y - 0.2)}`;
        }
        o += `<path d="${f}" stroke="${OUT3}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${f}" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      return o;
    }
    __name(etage, "etage");
    function troncSapin(id3, k) {
      const d = sc("M-7.5,1.8 Q-4,0.6 -3.4,-4 L-3,-16 L3,-16 L3.4,-4 Q4,0.6 8,2 Q4.4,3.2 2,2 Q0,3.4 -2.2,2.2 Q-4.6,3.2 -7.5,1.8 Z", k);
      return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})"><path d="${sc("M0.8,4 L1,-17 L9,-17 L9,4 Z", k)}" fill="${BOIS.right}"/><path d="${sc("M-1.6,-4 L-1.4,-11", k)}" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/></g>`;
    }
    __name(troncSapin, "troncSapin");
    var pommeDePin = /* @__PURE__ */ __name((x, y, a) => `<g transform="translate(${r23(x)} ${r23(y)}) rotate(${a})"><path d="M0,-2.6 Q2.2,-1 1.8,1.2 Q0,3 -1.8,1.2 Q-2.2,-1 0,-2.6 Z" fill="#A0703F" stroke="${OUT3}" stroke-width="0.7" stroke-linejoin="round"/><path d="M-1.4,-0.6 Q0,0.4 1.4,-0.6 M-1.5,1 Q0,2 1.5,1" stroke="#6E4A28" stroke-width="0.5" fill="none"/></g>`, "pommeDePin");
    var congere = /* @__PURE__ */ __name((k) => `<path d="M${r23(-17 * k)},4 Q${r23(-14 * k)},-1 ${r23(-8 * k)},1.5 Q${r23(-5 * k)},-0.5 ${r23(-2 * k)},3 Q${r23(4 * k)},0 ${r23(8 * k)},3 Q${r23(13 * k)},0 ${r23(18 * k)},4.5 Q0,9 ${r23(-17 * k)},4 Z" fill="#FFFFFF" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${r23(3 * k)},5.5 Q${r23(10 * k)},6.6 ${r23(15 * k)},5" stroke="#D6E4EE" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, "congere");
    var ETAGES = [[-10, 25, 28, 5], [-27, 20.5, 27, 4], [-44, 16, 25, 4], [-60, 11, 24, 3]];
    function sapin({ vert = "doux", petit = false, neige = false, pied: pied2 = false } = {}) {
      const c = PINS[vert], k = petit ? 0.76 : 1;
      const id3 = `sap${neige ? "n" : ""}${petit ? "p" : "g"}${vert[0]}${pied2 ? "x" : ""}`;
      return E(2 * k, 1.5, 24 * k, 10.5 * k, neige ? "rgba(60,80,110,0.22)" : "rgba(40,55,20,0.22)", 0) + troncSapin(`${id3}t`, k) + ETAGES.map(([y, w, h, n], i) => etage(`${id3}${i}`, y * k, w * k, h * k, n, c, neige, (i < ETAGES.length - 1 ? ETAGES[i + 1][0] + 6.5 : y - h * 0.55) * k)).join("") + (pied2 ? neige ? congere(k) : pommeDePin(-12 * k, 5, -20) + pommeDePin(11 * k, 6, 30) + pommeDePin(15 * k, 3.4, 80) : "");
    }
    __name(sapin, "sapin");
    var SAPINS = [];
    for (const neige of [false, true]) for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const pied2 of [false, true]) {
      const fichier2 = [neige ? "sapin_neige" : "sapin", petit && "petit", vert === "profond" && "profond", pied2 && (neige ? "congere" : "pommes_de_pin")].filter(Boolean).join("_");
      const libelle = `${neige ? "Sapin enneigé" : "Sapin"} (${[petit ? "petit" : "grand", `vert ${vert}`, pied2 && (neige ? "congère au pied" : "pommes de pin")].filter(Boolean).join(", ")})`;
      SAPINS.push([fichier2, libelle, { vert, petit, neige, pied: pied2 }]);
    }
    var PALMES = {
      doux: { devant: { light: "#C2E594", mid: "#82C65E", dark: "#4F9046" }, fond: { light: "#94C870", mid: "#5E9F4A", dark: "#3D7340" } },
      profond: { devant: { light: "#A6D67C", mid: "#66B052", dark: "#3E7C3E" }, fond: { light: "#7EB862", mid: "#4C8C44", dark: "#2F6136" } }
    };
    var STIPE = { left: "#C08A55", right: "#946339", light: "#D9A976" };
    var qPt = /* @__PURE__ */ __name((a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]], "qPt");
    var qTan = /* @__PURE__ */ __name((a, c, b, t) => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])], "qTan");
    var pts3 = /* @__PURE__ */ __name((l) => l.map((p) => `${r23(p[0])},${r23(p[1])}`).join(" L"), "pts");
    function palme(id3, o, dx, dy, larg, c, k) {
      const b = [o[0] + dx * k, o[1] + dy * k], ctl = [o[0] + dx * k * 0.5, o[1] + dy * k * 0.5 - Math.abs(dx) * 0.38 * k];
      const N2 = 14, axe = [], haut = [], bas = [];
      for (let i = 0; i <= N2; i++) {
        const t = i / N2, p = qPt(o, ctl, b, t), d2 = qTan(o, ctl, b, t), L = Math.hypot(d2[0], d2[1]) || 1;
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
      const d = `M${pts3(haut.concat(bas.slice().reverse()))} Z`;
      return `<path d="${d}" fill="${c.mid}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})"><path d="M${pts3(axe.concat(bas.slice().reverse()))} Z" fill="${c.dark}"/><path d="M${r23(o[0])},${r23(o[1] - 0.8)} Q${r23(ctl[0])},${r23(ctl[1] - 0.8)} ${r23(b[0])},${r23(b[1] - 0.8)}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
    }
    __name(palme, "palme");
    function stipe(id3, k) {
      const a = [0, 0], ctl = [-7 * k, -32 * k], b = [8 * k, -62 * k], N2 = 8;
      let o = "";
      for (let i = 0; i < N2; i++) {
        const t0 = i / N2, t1 = (i + 1) / N2, p0 = qPt(a, ctl, b, t0), p1 = qPt(a, ctl, b, t1);
        const w0 = (5 - 1.8 * t0) * k, w1 = (5 - 1.8 * t1) * k * 1.12;
        const d0 = qTan(a, ctl, b, t0), L0 = Math.hypot(d0[0], d0[1]), n0 = [-d0[1] / L0, d0[0] / L0];
        const d1 = qTan(a, ctl, b, t1), L1 = Math.hypot(d1[0], d1[1]), n1 = [-d1[1] / L1, d1[0] / L1];
        const l0 = [p0[0] - n0[0] * w0, p0[1] - n0[1] * w0], r0 = [p0[0] + n0[0] * w0, p0[1] + n0[1] * w0];
        const l1 = [p1[0] - n1[0] * w1, p1[1] - n1[1] * w1], r1 = [p1[0] + n1[0] * w1, p1[1] + n1[1] * w1];
        const d = `M${r23(l0[0])},${r23(l0[1])} L${r23(l1[0])},${r23(l1[1])} Q${r23(p1[0])},${r23(p1[1] + 1.4 * k)} ${r23(r1[0])},${r23(r1[1])} L${r23(r0[0])},${r23(r0[1])} Q${r23(p0[0])},${r23(p0[1] + 1.8 * k)} ${r23(l0[0])},${r23(l0[1])} Z`;
        o += `<path d="${d}" fill="${STIPE.left}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}${i}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3}${i})"><path d="M${r23(p0[0] + n0[0] * w0 * 0.25)},${r23(p0[1] + 4)} L${r23(p1[0] + n1[0] * w1 * 0.25)},${r23(p1[1] - 2)} L${r23(p1[0] + n1[0] * 12)},${r23(p1[1] - 2)} L${r23(p0[0] + n0[0] * 12)},${r23(p0[1] + 4)} Z" fill="${STIPE.right}"/><path d="M${r23(l1[0])},${r23(l1[1] + 1.2)} Q${r23(p1[0])},${r23(p1[1] + 2.6 * k)} ${r23(r1[0])},${r23(r1[1] + 1.2)}" stroke="${STIPE.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/></g>`;
      }
      return o;
    }
    __name(stipe, "stipe");
    var noixDeCoco = /* @__PURE__ */ __name((x, y, s) => E(x, y, 3 * s, 3 * s, "#7A4E28", 0.9) + E(x - 0.9 * s, y - s, 0.9 * s, 0.8 * s, "#A87A4C", 0) + E(x + 0.4 * s, y + 1.2 * s, 0.35 * s, 0.35 * s, "#4E3018", 0), "noixDeCoco");
    var PALMES_FOND = [[-30, 4, 6], [31, 6, 6], [-10, -22, 5.5], [14, -21, 5.5]];
    var PALMES_DEVANT = [[-26, 17, 6.5], [27, 19, 6.5], [-20, -8, 6], [22, -6, 6]];
    function palmier({ vert = "doux", petit = false, cocos = false } = {}) {
      const c = PALMES[vert], k = petit ? 0.76 : 1, o = [8 * k, -62 * k], s = Math.max(k, 0.85);
      const id3 = `pal${petit ? "p" : "g"}${vert[0]}${cocos ? "c" : ""}`;
      return E(3 * k, 1.5, 22 * k, 9.5 * k, "rgba(40,55,20,0.22)", 0) + stipe(`${id3}s`, k) + PALMES_FOND.map(([dx, dy, l], i) => palme(`${id3}f${i}`, o, dx, dy, l, c.fond, k)).join("") + PALMES_DEVANT.map(([dx, dy, l], i) => palme(`${id3}d${i}`, o, dx, dy, l, c.devant, k)).join("") + noixDeCoco(o[0] - 3.4 * k, o[1] + 6 * k, s) + noixDeCoco(o[0] + 3.6 * k, o[1] + 6.6 * k, s) + noixDeCoco(o[0] + 0.1 * k, o[1] + 9.6 * k, s) + (cocos ? noixDeCoco(-12 * k, 4.5, 0.95) + noixDeCoco(14 * k, 5.5, 0.9) : "");
    }
    __name(palmier, "palmier");
    var PALMIERS = [];
    for (const petit of [false, true]) for (const vert of ["doux", "profond"]) for (const cocos of [false, true]) {
      const fichier2 = ["palmier", petit && "petit", vert === "profond" && "profond", cocos && "cocos"].filter(Boolean).join("_");
      const libelle = `Palmier (${[petit ? "petit" : "grand", `vert ${vert}`, cocos && "noix de coco au pied"].filter(Boolean).join(", ")})`;
      PALMIERS.push([fichier2, libelle, { vert, petit, cocos }]);
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
      const seg = /* @__PURE__ */ __name(([a, b], w, col) => `<path d="M${r23(a[0] * k)},${r23(a[1] * k)} L${r23(b[0] * k)},${r23(b[1] * k)}" stroke="${col}" stroke-width="${r23(w)}" stroke-linecap="round"/>`, "seg");
      return segs.map(([a, b, w]) => seg([a, b], w * k + W * 2, OUT3)).join("") + segs.map(([a, b, w]) => seg([a, b], w * k, c.left)).join("") + segs.map(([a, b, w]) => seg([[a[0] + w * 0.22, a[1]], [b[0] + w * 0.22, b[1]]], w * k * 0.45, c.right)).join("");
    }
    __name(branchesMortes, "branchesMortes");
    function troncMort(id3, c, k) {
      const d = sc("M-12,2.2 Q-7,0.8 -5.8,-5 Q-4.6,-14 -5.2,-22 Q-5.6,-30 -10.5,-41 L-6.5,-44.5 Q-2.2,-38 0,-35 Q2,-38.5 7.5,-43 L11.5,-39.5 Q5.6,-31 5,-22 Q4.4,-12 5.8,-6 Q7,0.6 12.5,2.6 Q8,4 4.8,2.4 Q2.4,4.8 -0.6,3.4 Q-3.4,4.6 -5.8,2.6 Q-9,3.6 -12,2.2 Z", k);
      const dedans = `<path d="${sc("M1.4,4 Q2.4,-12 1.8,-22 Q3.4,-32 8.5,-44.5 L16,-44.5 L16,4 Z", k)}" fill="${c.right}"/><path d="${sc("M-2.4,-6 Q-3,-12 -2.2,-17 M2.6,-9 Q3.2,-14 2.6,-19 M-3.2,-21 q0.4,-3 -0.2,-5", k)}" fill="none" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/><path d="${sc("M-4.4,-4 Q-3.8,-12 -4,-20", k)}" fill="none" stroke="${c.light}" stroke-width="1" stroke-linecap="round" opacity="0.8"/>` + E(-0.6 * k, -15 * k, 2.4 * k, 3 * k, c.light, 0.8) + E(-0.4 * k, -14.6 * k, 1.5 * k, 2.1 * k, "#3A2E26", 0) + E(-3.6 * k, -25 * k, 2 * k, 1 * k, "#B7C46C", 0.5) + E(-2.2 * k, -24.4 * k, 1 * k, 0.6 * k, "#B7C46C", 0.4);
      return `<path d="${d}" fill="${c.left}" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id3})">${dedans}</g>`;
    }
    __name(troncMort, "troncMort");
    function arbreMort({ teinte = "gris", petit = false, champignons = false } = {}) {
      const c = BOIS_MORT[teinte], k = petit ? 0.76 : 1;
      const id3 = `mor${petit ? "p" : "g"}${teinte[0]}${champignons ? "c" : ""}`;
      const raccord = /* @__PURE__ */ __name((a, b) => `<path d="M${r23(a[0] * k)},${r23(a[1] * k)} L${r23(b[0] * k)},${r23(b[1] * k)}" stroke="${c.left}" stroke-width="${r23(3.6 * k)}" stroke-linecap="butt"/><path d="M${r23((a[0] + 0.8) * k)},${r23(a[1] * k)} L${r23((b[0] + 0.8) * k)},${r23(b[1] * k)}" stroke="${c.right}" stroke-width="${r23(1.6 * k)}" stroke-linecap="butt"/>`, "raccord");
      return E(2 * k, 1.5, 19 * k, 8.5 * k, "rgba(40,55,20,0.22)", 0) + branchesMortes(c, k) + troncMort(`${id3}t`, c, k) + raccord([-7.6, -41.5], [-10, -45.6]) + raccord([8.6, -40.6], [11, -42.5]) + (champignons ? champignon(-9 * k, 5.4) + champignon(10.5 * k, 5.6) + champignon(14 * k, 3.4) : "");
    }
    __name(arbreMort, "arbreMort");
    var ARBRES_MORTS = [];
    for (const petit of [false, true]) for (const teinte of ["gris", "brun"]) for (const champignons of [false, true]) {
      const fichier2 = ["arbre_mort", petit && "petit", teinte === "brun" && "brun", champignons && "champignons"].filter(Boolean).join("_");
      const libelle = `Arbre mort (${[petit ? "petit" : "grand", teinte, champignons && "champignons au pied"].filter(Boolean).join(", ")})`;
      ARBRES_MORTS.push([fichier2, libelle, { teinte, petit, champignons }]);
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
      ROUSSES
    };
  }
});

// atelier/crafts.js
var require_crafts = __commonJS({
  "atelier/crafts.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, L, r2: r23 } = require_troupe2();
    var Dk = require_deco();
    var { herbe, fleurette } = require_arbres();
    var {
      pt,
      poly: poly3,
      face: face2,
      shadow: shadow2,
      box: box2,
      crown,
      boulder: boulder2,
      flower,
      stroke,
      thick,
      cylinder: cylinder2,
      disc: disc2,
      gable: gable2,
      pyramid: pyramid2,
      post: post2,
      rail: rail2,
      flame,
      glow,
      LEAVES: LEAVES2,
      WOOD: WOOD2,
      WOOD_DARK: WOOD_DARK2,
      GRANITE,
      STONE: STONE2,
      WHITE_STONE: WHITE_STONE2,
      ROOF_RED: ROOF_RED2,
      ROOF_BLUE,
      WALL: WALL2,
      SOIL,
      WATER: WATER2,
      WATER_LIGHT,
      BRASS: BRASS2,
      IRON: IRON3
    } = Dk;
    var TAU2 = Math.PI * 2;
    var leafDot = /* @__PURE__ */ __name((x, y, r) => E(x + r * 0.2, y + r * 0.2, r, r, LEAVES2.dark, 0.8) + E(x, y, r * 0.85, r * 0.85, LEAVES2.mid, 0) + E(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.4, LEAVES2.light, 0), "leafDot");
    var at = /* @__PURE__ */ __name((u, v, z = 0) => pt(u, v, z), "at");
    var wave2 = /* @__PURE__ */ __name((f, n, amp, ph = 0) => Math.sin(f / n * TAU2 + ph) * amp, "wave");
    var ICE = { top: "#E9F8FF", left: "#BFE7F7", right: "#8CCBE8" };
    var OBSIDIAN = { top: "#4A4258", left: "#2C2A34", right: "#1C1A22" };
    var SANDSTONE = { top: "#E6CFA0", left: "#CDB07A", right: "#A88A58" };
    var COPPER2 = { top: "#F2A66A", left: "#D9824A", right: "#A85E30" };
    var C2 = {};
    var BOIS_CLOTURE = { top: "#EFC992", left: "#D49D60", right: "#A86F3E", grain: "#B47C46", lumiere: "#F8E0B6" };
    function planche(u, w, v0, v1, z0, z1, tip, c) {
      const a = u - w, b = u + w;
      return poly3([at(a, v1, z0), at(b, v1, z0), at(b, v1, z1), at(u, v1, z1 + tip), at(a, v1, z1)], c.left, 1) + poly3([at(b, v0, z0), at(b, v1, z0), at(b, v1, z1), at(b, v0, z1)], c.right, 0.8) + poly3([at(b, v0, z1), at(b, v1, z1), at(u, v1, z1 + tip), at(u, v0, z1 + tip)], c.top, 0.8) + L(at(a + 0.012, v1, z0 + 2), at(a + 0.012, v1, z1 - 0.6), c.lumiere, 0.7) + L(at(u + 0.012, v1, z0 + 4), at(u + 6e-3, v1, z1 - 3), c.grain, 0.5);
    }
    __name(planche, "planche");
    C2.cloture = { n: 1, draw: /* @__PURE__ */ __name(() => {
      const c = BOIS_CLOTURE;
      let s = shadow2(0, 0.06, 0.42, 0.14) + box2(-0.47, -0.026, 0.45, -4e-3, 6, 8.6, c, 0.9) + box2(-0.47, -0.026, 0.45, -4e-3, 13.4, 16, c, 0.9);
      [[-0.37, 17.6], [-0.12, 18.8], [0.13, 18], [0.37, 18.6]].forEach(([u, h]) => {
        s += planche(u, 0.052, 0, 0.026, 0, h, 4.4, c);
        for (const z of [7.3, 14.7]) for (const du of [-0.024, 0.024]) {
          const [x, y] = at(u + du, 0.026, z);
          s += E(x, y, 0.5, 0.5, "#5E4430", 0);
        }
      });
      const [ax, ay] = at(-0.38, 0.06), [bx, by] = at(0.12, 0.06), [cx, cy] = at(0.37, 0.07);
      return s + herbe(ax - 1, ay + 1, "#86B852", 0.7) + herbe(bx + 1.6, by + 1.4, "#94C25C", 0.6) + herbe(cx + 2, cy + 1, "#86B852", 0.55) + fleurette(bx - 3.4, by + 2.6, "#FFFFFF") + fleurette(ax + 5, ay + 3, "#F7B6C8");
    }, "draw") };
    var TERRE = { top: "#7E5233", grain: "#5E3A22" };
    var feuille = /* @__PURE__ */ __name((x, y, a, col = "#6FB24E") => `<path d="M0,0 Q-2.4,-1.2 -3.4,-3.6 Q-0.6,-3.2 0,0 Z" fill="${col}" stroke="${OUT3}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r23(x)} ${r23(y)}) rotate(${a})"/>`, "feuille");
    var pierreBord = /* @__PURE__ */ __name((x, y) => E(x, y, 2.5, 1.35, STONE2.left, 0.7) + E(x - 0.5, y - 0.35, 1.5, 0.7, STONE2.top, 0), "pierreBord");
    function teteMassif(x, y, k) {
      const sorte = k % 3, col = ["#E8566A", "#F7B6C8", "#F2C04B", "#B48AE0", "#F08A3A"][k % 5];
      if (sorte === 0) return P2(`M${r23(x - 2.4)},${r23(y)} Q${r23(x - 2.8)},${r23(y - 3.6)} ${r23(x - 1.2)},${r23(y - 4)} L${r23(x)},${r23(y - 2.6)} L${r23(x + 1.2)},${r23(y - 4)} Q${r23(x + 2.8)},${r23(y - 3.6)} ${r23(x + 2.4)},${r23(y)} Q${r23(x)},${r23(y + 1.2)} ${r23(x - 2.4)},${r23(y)} Z`, col, 0.8) + E(x - 1, y - 2.2, 0.5, 1, "#FFFFFF", 0).replace("/>", ' opacity="0.5"/>');
      if (sorte === 1) return fleurette(x, y - 1.4, k % 2 ? "#FFFFFF" : "#F7B6C8");
      return E(x, y - 1.6, 2.4, 2.2, col, 0.8) + [[-1, -0.6], [0.8, -0.8], [0, 0.6], [-0.2, -1.6]].map(([dx, dy]) => E(x + dx, y - 1.6 + dy, 0.45, 0.45, "#FFFFFF", 0).replace("/>", ' opacity="0.45"/>')).join("");
    }
    __name(teteMassif, "teteMassif");
    C2.massif = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.47, 0.12) + box2(-0.38, -0.34, 0.38, 0.34, 0, 4.6, STONE2);
      for (const u of [-0.26, -0.06, 0.14, 0.32]) s += L(at(u, 0.34, 0.4), at(u, 0.34, 4.2), STONE2.right, 0.6);
      for (const v of [-0.18, 0.02, 0.22]) s += L(at(0.38, v, 0.4), at(0.38, v, 4.2), STONE2.right, 0.6);
      s += L(at(-0.38, 0.34, 2.3), at(0.38, 0.34, 2.3), STONE2.right, 0.5) + L(at(0.38, -0.34, 2.3), at(0.38, 0.34, 2.3), STONE2.right, 0.5);
      s += face2([[-0.34, -0.3, 4.8], [0.34, -0.3, 4.8], [0.34, 0.3, 4.8], [-0.34, 0.3, 4.8]], TERRE.top, 0.6);
      for (const [du, dv] of [[-0.25, -0.1], [0.05, 0.18], [0.22, -0.2], [-0.1, 0.24], [0.28, 0.1]]) {
        const [x, y] = at(du, dv, 4.8);
        s += E(x, y, 0.8, 0.4, TERRE.grain, 0);
      }
      const bord = /* @__PURE__ */ __name((fond) => {
        let o = "";
        for (let i = 0; i <= 7; i++) {
          const u = -0.36 + i * 0.103;
          o += pierreBord(...at(u, fond ? -0.33 : 0.33, 4.8));
        }
        for (let i = 1; i <= 5; i++) {
          const v = -0.33 + i * 0.11;
          o += pierreBord(...at(fond ? -0.37 : 0.37, v, 4.8));
        }
        return o;
      }, "bord");
      s += bord(true);
      let k = 0;
      for (const dv of [-0.2, 0, 0.2]) for (const du of [-0.22, -0.07, 0.08, 0.23]) {
        const [x, y] = at(du + k % 2 * 0.03, dv, 5);
        const sw = wave2(f, 2, 1.2, k * 1.3), h = 5 + k % 3 * 1;
        s += leafDot(x - 2.4, y - 0.6, 2.6) + leafDot(x + 2.2, y - 0.4, 2.4) + leafDot(x, y - 1.8, 2.8) + thick(`M${r23(x)},${r23(y - 2)} q${r23(sw * 0.2)},${r23(-h * 0.5)} ${r23(sw)},${r23(-h)}`, 0.7, "#5DAA45") + feuille(x + sw * 0.5, y - 2 - h * 0.45, -24 - k % 2 * 10) + teteMassif(x + sw, y - 2 - h, k);
        k++;
      }
      return s + bord(false);
    }, "draw") };
    var MOELLONS = ["#CFC7B4", "#C3BBA9", "#BBB29E", "#D6CFBE"];
    function moellon(a, b, z0, z1, face3, fixe, col) {
      const p = face3 === "avant" ? [[a, fixe, z0], [b, fixe, z0], [b, fixe, z1], [a, fixe, z1]] : [[fixe, a, z0], [fixe, b, z0], [fixe, b, z1], [fixe, a, z1]];
      const q = p.map(([u, v, z], i) => face3 === "avant" ? [u + (i === 0 || i === 3 ? 8e-3 : -8e-3), v, z + (i < 2 ? 0.5 : -0.5)] : [u, v + (i === 0 || i === 3 ? 8e-3 : -8e-3), z + (i < 2 ? 0.5 : -0.5)]);
      return poly3(q.map((r) => at(...r)), col, 0.6) + L(at(...q[3]), at(...q[2]), "#FFFFFF", 0.5).replace("/>", ' opacity="0.5"/>');
    }
    __name(moellon, "moellon");
    C2.muret = { n: 1, draw: /* @__PURE__ */ __name(() => {
      let s = shadow2(0, 0, 0.44, 0.14) + box2(-0.42, -0.1, 0.42, 0.1, 0, 15, { top: STONE2.top, left: "#9E9584", right: "#857C6B" });
      const assises = [[0, 5, [-0.42, -0.2, 0.02, 0.22, 0.42]], [5, 10, [-0.42, -0.3, -0.08, 0.12, 0.3, 0.42]], [10, 15, [-0.42, -0.18, 0.06, 0.26, 0.42]]];
      assises.forEach(([z0, z1, us], r) => us.slice(1).forEach((b, i) => {
        s += moellon(us[i], b, z0, z1, "avant", 0.1, MOELLONS[(i + r) % 4]);
      }));
      [[0, 5, [-0.1, 0.02, 0.1]], [5, 10, [-0.1, -0.03, 0.1]], [10, 15, [-0.1, 0.04, 0.1]]].forEach(([z0, z1, vs], r) => vs.slice(1).forEach((b, i) => {
        s += moellon(vs[i], b, z0, z1, "bout", 0.42, ["#A9A08D", "#9E9584"][(i + r) % 2]);
      }));
      for (const [a, b] of [[-0.45, -0.15], [-0.15, 0.15], [0.15, 0.45]]) s += box2(a, -0.125, b, 0.125, 15, 18.2, WHITE_STONE2, 0.9);
      const [m1x, m1y] = at(-0.3, 0.02, 18.2), [m2x, m2y] = at(0.2, 0.06, 18.2), [px, py] = at(0.28, 0.13, 0);
      const coussin = /* @__PURE__ */ __name((x, y, n) => {
        const bosses = [[-3.2, 0.2, 1.8], [-1, -0.6, 2.2], [1.4, -0.2, 2], [3.2, 0.4, 1.5]].slice(0, n);
        return bosses.map(([dx, dy, r]) => E(x + dx, y + dy, r + 0.7, r * 0.62 + 0.6, OUT3, 0)).join("") + bosses.map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.62, "#86C25A", 0)).join("") + bosses.map(([dx, dy, r]) => E(x + dx - r * 0.25, y + dy - r * 0.2, r * 0.5, r * 0.28, "#B5DC86", 0)).join("");
      }, "coussin");
      const brins = [[-0.36, 0.125], [-0.27, 0.125]].map(([u, v]) => {
        const [x, y] = at(u, v, 15.4);
        return thick(`M${r23(x)},${r23(y)} q0.4,2.2 -0.3,3.6`, 0.45, "#86C25A");
      }).join("");
      return s + brins + coussin(m1x, m1y, 4) + coussin(m2x, m2y, 2) + fleurette(m2x + 1, m2y - 1.8, "#FFFFFF") + herbe(px, py, "#86B852", 0.7);
    }, "draw") };
    var FER_LANTERNE = { light: "#6E757E", mid: "#474D55", dark: "#2E3238" };
    C2.lanterne = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), c = FER_LANTERNE;
      let s = shadow2(0, 0, 0.26, 0.16) + box2(-0.095, -0.095, 0.095, 0.095, 0, 3.4, STONE2) + box2(-0.066, -0.066, 0.066, 0.066, 3.4, 6.2, STONE2);
      const [mx, my] = at(-0.07, 0.09, 3.4);
      s += E(mx + 1.2, my - 0.4, 2.6, 1, "#8FCB6A", 0.6);
      s += `<path d="M${x - 3.2},${y - 7.6} Q${x - 2.2},${y - 10} ${x - 1.7},${y - 12} L${x + 1.7},${y - 12} Q${x + 2.2},${y - 10} ${x + 3.2},${y - 7.6} Z" fill="${c.mid}" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/><rect x="${x - 1.7}" y="${y - 45}" width="3.4" height="33.4" fill="${c.mid}" stroke="${OUT3}" stroke-width="0.9"/><rect x="${x + 0.4}" y="${y - 44.6}" width="1" height="32.6" fill="${c.dark}"/><rect x="${x - 1.2}" y="${y - 44.6}" width="0.8" height="32.6" fill="${c.light}"/>` + E(x, y - 29, 2.6, 1.2, c.mid, 0.8) + E(x - 0.8, y - 29.4, 1, 0.4, c.light, 0);
      s += glow(x, y - 52, 13 + f, "255,224,138", 0.3) + `<path d="M${x - 6.2},${y - 45} L${x + 6.2},${y - 45} L${x + 5},${y - 43.4} L${x - 5},${y - 43.4} Z" fill="${c.mid}" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/>` + poly3([[x - 5.2, y - 45], [x + 5.2, y - 45], [x + 5.8, y - 57.4], [x - 5.8, y - 57.4]], "#FFE27A", 1) + flame(x, y - 46.6, 8.4 + f, 2.6, f * 0.5) + `<path d="M${x},${y - 45.4} L${x},${y - 57} M${x - 5.5},${y - 51.4} L${x + 5.5},${y - 51.4}" stroke="${c.mid}" stroke-width="0.7"/><path d="M${x - 4.4},${y - 46.4} L${x - 3},${y - 55.6}" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>` + poly3([[x - 7.8, y - 57.4], [x + 7.8, y - 57.4], [x + 3, y - 62.2], [x - 3, y - 62.2]], c.mid, 1) + poly3([[x + 0.8, y - 57.4], [x + 7.8, y - 57.4], [x + 3, y - 62.2], [x + 0.6, y - 62.2]], c.dark, 0) + E(x, y - 63.6, 1.6, 1.5, c.mid, 0.8) + E(x - 0.5, y - 64, 0.5, 0.45, c.light, 0);
      return s;
    }, "draw") };
    var BOIS_BANC = { lattes: { top: "#EBBE84", left: "#CB9259", right: "#A0683B" }, pieds: { top: "#A9703F", left: "#8B5631", right: "#6A3F22" } };
    C2.banc = { n: 1, draw: /* @__PURE__ */ __name(() => {
      const c = BOIS_BANC, L0 = 0.33;
      const pied = /* @__PURE__ */ __name((u, v, z1) => box2(u - 0.024, v - 0.024, u + 0.024, v + 0.024, 0, z1, c.pieds, 0.8), "pied");
      let s = shadow2(0, 0.02, 0.44, 0.14);
      s += pied(-L0 + 0.03, -0.09, 24) + pied(L0 - 0.03, -0.09, 24);
      for (const z of [13.4, 17.2, 21]) s += box2(-L0, -0.108, L0, -0.082, z, z + 2.6, c.lattes, 0.9);
      s += pied(-L0 + 0.03, 0.07, 9);
      for (const [v0, v1] of [[-0.094, -0.038], [-0.03, 0.026], [0.034, 0.09]]) s += box2(-L0, v0, L0, v1, 9, 10.8, c.lattes, 0.9);
      s += pied(L0 - 0.03, 0.07, 9);
      const accoudoir = /* @__PURE__ */ __name((u) => pied(u, 0.07, 15.6) + box2(u - 0.032, -0.1, u + 0.032, 0.09, 15.6, 17.2, c.lattes, 0.8), "accoudoir");
      s += accoudoir(-L0 + 0.03);
      const [cx, cy] = at(-0.02, 0, 10.8);
      s += `<path d="M${r23(cx - 7)},${r23(cy - 0.4)} Q${r23(cx - 7.6)},${r23(cy - 3.8)} ${r23(cx - 3)},${r23(cy - 4.3)} L${r23(cx + 3.4)},${r23(cy - 4.5)} Q${r23(cx + 7.8)},${r23(cy - 4)} ${r23(cx + 7)},${r23(cy - 0.4)} Q${r23(cx)},${r23(cy + 2)} ${r23(cx - 7)},${r23(cy - 0.4)} Z" fill="#E8566A" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/>` + E(cx - 1.2, cy - 2.9, 3.8, 1.1, "#F28A98", 0) + E(cx + 0.2, cy - 2, 0.45, 0.35, "#B23A4C", 0) + `<path d="M${r23(cx + 3.8)},${r23(cy - 1.8)} q-0.8,-0.9 -1.4,-0.1 q-0.5,0.8 1.4,1.8 q1.9,-1 1.4,-1.8 q-0.6,-0.8 -1.4,0.1 Z" fill="#FFFFFF" opacity="0.85"/>`;
      return s + accoudoir(L0 - 0.03);
    }, "draw") };
    var pailleSort = /* @__PURE__ */ __name((x, y, a) => `<g transform="translate(${r23(x)} ${r23(y)}) rotate(${a})">${thick("M0,0 l-3.2,-1.4 M0,0 l-3.6,0.6 M0,0 l-2.8,2", 0.9, "#EBC46F")}</g>`, "pailleSort");
    C2.epouvantail = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const tilt = f ? 4 : -2;
      let s = shadow2(0, 0, 0.3, 0.14) + herbe(x - 5, y + 1.4, "#86B852", 0.6) + `<g transform="rotate(${tilt} ${x} ${y})">`;
      s += `<rect x="${x - 1.7}" y="${y - 50}" width="3.4" height="50" fill="${WOOD_DARK2.left}" stroke="${OUT3}" stroke-width="0.9"/><rect x="${x + 0.3}" y="${y - 49.6}" width="1" height="49" fill="${WOOD_DARK2.right}"/>` + thick(`M${x - 17},${y - 34} L${x + 17},${y - 34}`, 2.6, WOOD_DARK2.left);
      s += pailleSort(x - 16, y - 34, 0) + pailleSort(x + 16, y - 34, 180);
      s += P2(`M${x - 15},${y - 37} L${x - 7},${y - 37.6} L${x - 7},${y - 31} L${x - 15},${y - 31.2} Z`, "#5C8FD0", 0.9) + P2(`M${x + 15},${y - 37} L${x + 7},${y - 37.6} L${x + 7},${y - 31} L${x + 15},${y - 31.2} Z`, "#5C8FD0", 0.9) + `<rect x="${x - 16}" y="${y - 37.4}" width="2" height="6.4" rx="0.6" fill="#3E6FA8" stroke="${OUT3}" stroke-width="0.6"/><rect x="${x + 14}" y="${y - 37.4}" width="2" height="6.4" rx="0.6" fill="#3E6FA8" stroke="${OUT3}" stroke-width="0.6"/>`;
      const corps = `M${x - 9},${y - 38} L${x + 9},${y - 38} L${x + 8.4},${y - 19} Q${x},${y - 17} ${x - 8.4},${y - 19} Z`;
      s += P2(corps, "#5C8FD0", 1) + `<path d="M${x - 4.4},${y - 37.6} L${x - 4.8},${y - 18.4} M${x + 3.6},${y - 37.6} L${x + 3.8},${y - 18} M${x - 8.6},${y - 31} L${x + 8.6},${y - 31} M${x - 8.4},${y - 24.6} L${x + 8.4},${y - 24.6}" stroke="#3E6FA8" stroke-width="1.2" opacity="0.7"/><rect x="${x + 1.4}" y="${y - 29}" width="5.4" height="5" fill="#E8566A" stroke="${OUT3}" stroke-width="0.7" transform="rotate(-6 ${x + 4} ${y - 26.5})"/><path d="M${x + 1.8},${y - 28.4} l0.8,0 m1,0 l0.8,0 m1,0 l0.8,0 M${x + 1.8},${y - 24.4} l0.8,0 m1,0 l0.8,0 m1,0 l0.8,0" stroke="#FFFFFF" stroke-width="0.5" transform="rotate(-6 ${x + 4} ${y - 26.5})"/>` + E(x - 1.6, y - 33.6, 0.8, 0.8, "#F6EBD6", 0.5) + E(x - 1.6, y - 27.4, 0.8, 0.8, "#F6EBD6", 0.5);
      s += pailleSort(x - 2, y - 38.4, 100) + pailleSort(x + 2, y - 38.4, 80);
      s += E(x, y - 44, 6.6, 6.4, "#E9D2A0", 1) + [[-3, -46], [2.6, -41.4], [3.4, -47.4], [-2.2, -40.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.4, 0.4, "#C9AE78", 0)).join("") + thick(`M${x - 4.4},${y - 38.8} Q${x},${y - 37.6} ${x + 4.4},${y - 38.8}`, 0.7, "#B8935A") + E(x - 2.4, y - 44.6, 1.2, 1.2, "#3A2A24", 0.5) + E(x + 2.4, y - 44.6, 1.2, 1.2, "#3A2A24", 0.5) + E(x - 2.7, y - 45, 0.35, 0.35, "#FFFFFF", 0) + E(x + 2.1, y - 45, 0.35, 0.35, "#FFFFFF", 0) + E(x - 4, y - 42.2, 1, 0.6, "#F29AA8", 0) + E(x + 4, y - 42.2, 1, 0.6, "#F29AA8", 0) + `<path d="M${x - 2.6},${y - 41.8} Q${x},${y - 40} ${x + 2.6},${y - 41.8}" stroke="${OUT3}" stroke-width="0.6" fill="none" stroke-linecap="round"/><path d="M${x - 1.6},${y - 41.6} l0,1.2 M${x},${y - 41} l0,1.2 M${x + 1.6},${y - 41.6} l0,1.2" stroke="${OUT3}" stroke-width="0.45"/>`;
      s += E(x, y - 49.4, 11, 2.8, "#EBC46F", 1) + `<path d="M${x - 9},${y - 49.6} q4,1.4 9,0.2 M${x + 2},${y - 50} q4,1 7,-0.4" stroke="#C9A045" stroke-width="0.5" fill="none"/>` + P2(`M${x - 6},${y - 50} Q${x - 6},${y - 59} ${x},${y - 59.4} Q${x + 6},${y - 59} ${x + 6},${y - 50} Z`, "#EBC46F", 1) + `<path d="M${x - 6},${y - 51.6} Q${x},${y - 50.2} ${x + 6},${y - 51.6} L${x + 6},${y - 53.2} Q${x},${y - 51.8} ${x - 6},${y - 53.2} Z" fill="#E8566A" stroke="${OUT3}" stroke-width="0.6"/>` + E(x - 2, y - 56.4, 1.8, 1.2, "#F7DC8C", 0) + fleurette(x + 4.4, y - 52.4, "#FFFFFF");
      s += "</g>";
      if (f) {
        const [bx, by] = [x + 17.6, y - 37.6];
        s += P2(`M${bx - 4.6},${by + 1.4} L${bx - 7.6},${by + 3.4} L${bx - 4},${by + 2.6} Z`, "#2E2E38", 0.6) + E(bx - 1, by, 3.6, 2.6, "#2E2E38", 0.8) + E(bx - 1.6, by - 0.6, 1.8, 1, "#4A4A58", 0) + E(bx + 1.8, by - 2.6, 2, 1.9, "#2E2E38", 0.8) + E(bx + 2.4, by - 3, 0.5, 0.5, "#FFFFFF", 0) + P2(`M${bx + 3.6},${by - 2.8} l2.2,0.6 l-2.2,0.6 Z`, "#F2B33D", 0.4) + `<path d="M${bx - 1.6},${by + 2.4} l0,1.4 M${bx + 0.4},${by + 2.4} l0,1.4" stroke="#F2B33D" stroke-width="0.6"/>`;
      }
      return s;
    }, "draw") };
    var PLANCHES_NICHOIR = { top: "#F6E7C8", left: "#EAD2A4", right: "#C7AA7A" };
    var mesange = /* @__PURE__ */ __name((x, y, s, corps) => `<g transform="translate(${r23(x)} ${r23(y)}) scale(${r23(s)})">` + (corps ? E(0.4, 1.8, 2.6, 2.2, "#F2D24A", 0.7) + P2("M-1.4,0.6 Q1.6,-0.4 3.2,1.8 Q1.4,3.4 -1.2,2.6 Z", "#5C9CE0", 0.6) + P2("M2.6,2 L5,3.4 L2.8,3.2 Z", "#4A80C0", 0.5) : "") + E(-1.2, -1, 2.2, 2, "#FFFFFF", 0.7) + P2("M-3.2,-1.4 Q-1.4,-3.8 1,-2 Q-0.6,-1.6 -3.2,-1.4 Z", "#5C9CE0", 0.5) + E(-1.6, -0.9, 0.45, 0.5, OUT3, 0) + E(-1.75, -1.1, 0.15, 0.15, "#FFFFFF", 0) + P2("M-3.3,-0.6 L-4.6,-0.2 L-3.3,0.2 Z", "#3A3A44", 0.4) + E(-0.4, 0.2, 0.6, 0.35, "#F7A8B8", 0) + "</g>", "mesange");
    C2.nichoir = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.22, 0.14) + post2(0, 0, 0, 30, WOOD_DARK2, 0.03);
      const [jx, jy] = at(0, 0.03, 22), [kx, ky] = at(0, 0.09, 30);
      s += thick(`M${r23(jx)},${r23(jy)} L${r23(kx)},${r23(ky)}`, 1.2, WOOD_DARK2.left);
      s += box2(-0.11, -0.11, 0.11, 0.11, 30, 44, PLANCHES_NICHOIR);
      for (const u of [-0.055, 0, 0.055]) s += L(at(u, 0.11, 30.6), at(u, 0.11, 43.6), "#CDB283", 0.5);
      for (const v of [-0.04, 0.04]) s += L(at(0.11, v, 30.6), at(0.11, v, 43.6), "#A88E62", 0.5);
      s += gable2(-0.11, -0.11, 0.11, 0.11, 44, 10, ROOF_RED2, 0.04);
      for (const t of [0.33, 0.66]) s += L(at(-0.15, t * 0.15, 54 - 10 * t), at(0.15, t * 0.15, 54 - 10 * t), "#B9503B", 0.6);
      s += E(...at(0.15, 0, 54), 1.2, 1, ROOF_RED2.front, 0.7);
      const [hx, hy] = at(0, 0.11, 39);
      s += E(hx, hy - 1, 2.9, 2.9, "#B89A6A", 0.8) + E(hx, hy - 1, 2.2, 2.2, "#3A2A24", 0) + thick(`M${r23(hx)},${r23(hy + 3.2)} l-2.6,1.2`, 0.9, WOOD_DARK2.left);
      s += f ? mesange(hx - 3.6, hy + 1.4, 1.05, true) : mesange(hx + 0.6, hy - 0.8, 0.78, false);
      return s;
    }, "draw") };
    var coqCuivre = /* @__PURE__ */ __name(() => trait2("M-10,0 L9,0", OUT3, 2.4) + trait2("M-10,0 L9,0", COPPER2.right, 1.1) + P2("M11.6,0 L8,-2.4 L8,2.4 Z", COPPER2.left, 0.8) + P2("M-10,0 L-13,-3 L-11.4,0 L-13,3 Z", COPPER2.left, 0.7) + trait2("M-0.6,-0.6 L-0.6,-3.4 M1.2,-0.6 L1.2,-3.4", OUT3, 0.7) + P2("M-3,-6 Q-8.6,-12 -6.4,-15.4 Q-4.2,-11.4 -1.4,-9 Z", COPPER2.right, 0.8) + P2("M-2.2,-6.6 Q-6,-14.6 -2.8,-16.6 Q-1.8,-12 0,-9.4 Z", COPPER2.left, 0.8) + E(0.4, -5.4, 4.6, 3, COPPER2.left, 0.9) + E(-0.6, -6.4, 2.6, 1.2, COPPER2.top, 0) + P2("M-1.6,-5.6 Q0.6,-3.4 3,-5.2", "none", 0.6) + E(4, -9.4, 2.2, 2.1, COPPER2.left, 0.9) + E(3.4, -10, 0.9, 0.6, COPPER2.top, 0) + P2("M2.8,-11.2 q0.4,-1.8 1.4,-0.8 q0.8,-1.6 1.5,-0.1 q0.8,-0.9 0.9,0.6 Z", "#E8483C", 0.6) + P2("M6,-9.8 L8.2,-9.2 L6,-8.6 Z", "#F2B33D", 0.5) + E(5.6, -8, 0.6, 0.8, "#E8483C", 0.4) + E(4.6, -9.8, 0.45, 0.5, OUT3, 0), "coqCuivre");
    var trait2 = /* @__PURE__ */ __name((d, col, w) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, "trait2");
    C2.girouette = { n: 4, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      let s = shadow2(0, 0, 0.22, 0.14) + box2(-0.085, -0.085, 0.085, 0.085, 0, 2.6, STONE2) + box2(-0.06, -0.06, 0.06, 0.06, 2.6, 4.6, STONE2);
      s += `<rect x="${x - 1.3}" y="${y - 52}" width="2.6" height="46.4" fill="${IRON3.left}" stroke="${OUT3}" stroke-width="0.8"/><rect x="${x + 0.2}" y="${y - 51.6}" width="0.8" height="45.6" fill="${IRON3.right}"/><rect x="${x - 1}" y="${y - 51.6}" width="0.6" height="45.6" fill="${IRON3.top}"/>` + E(x, y - 24, 2.2, 1, IRON3.left, 0.7) + E(x, y - 47, 2.4, 2.3, BRASS2.left, 0.8) + E(x - 0.7, y - 47.7, 0.9, 0.7, BRASS2.top, 0);
      const bras = [[-11, 0], [11, 0], [-6, -4], [6, 4]];
      s += trait2(`M${x - 11},${y - 40} L${x + 11},${y - 40} M${x - 6},${y - 44} L${x + 6},${y - 36}`, OUT3, 2.2) + trait2(`M${x - 11},${y - 40} L${x + 11},${y - 40} M${x - 6},${y - 44} L${x + 6},${y - 36}`, IRON3.left, 1) + bras.map(([dx, dy]) => E(x + dx, y - 40 + dy, 1, 1, IRON3.left, 0.6)).join("") + [["N", x - 7.4, y - 45.4], ["E", x + 12.6, y - 38.6], ["S", x + 6, y - 31.6], ["O", x - 15.6, y - 38.6]].map(([t, a, b]) => `<text x="${a}" y="${b}" font-family="sans-serif" font-size="4.4" font-weight="700" fill="${OUT3}">${t}</text>`).join("");
      const sx = [1, 0.5, -1, -0.5][f];
      s += `<g transform="translate(${x} ${y - 52}) scale(${sx} 1)">${coqCuivre()}</g>`;
      return s;
    }, "draw") };
    C2.fontaine = { n: 3, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.52, 0.14) + cylinder2(0, 0, 0.42, 0, 7, STONE2);
      for (const a2 of [0.35, 0.95, 1.55, 2.15, 2.75]) {
        const [x0, y0] = at(Math.cos(a2) * 0.42, Math.sin(a2) * 0.42, 0.4), [, y1] = at(Math.cos(a2) * 0.42, Math.sin(a2) * 0.42, 6.6);
        s += L([x0, y0], [x0, y1], STONE2.right, 0.6);
      }
      s += disc2(0, 0, 0.42, 7, STONE2.top, 1) + disc2(0, 0, 0.35, 7, WATER2, 0.8) + disc2(-0.05, -0.05, 0.22, 7, WATER_LIGHT, 0);
      for (let i = 0; i < 2; i++) {
        const p = (f / 3 + i * 0.5) % 1;
        const [x2, y2] = at(0.02, 0.02, 7);
        s += E(x2, y2, 9 + p * 12, 4.5 + p * 6, "none", 0).replace('stroke="none"', `stroke="#E8F6FF" stroke-width="0.7" opacity="${r23(0.8 - p * 0.7)}"`);
      }
      const a = f / 3 * TAU2 + 0.8, [px, py] = at(Math.cos(a) * 0.25, Math.sin(a) * 0.25, 7), dir = Math.cos(a + Math.PI / 2) > 0 ? 1 : -1;
      s += `<g transform="translate(${r23(px)} ${r23(py)}) scale(${dir} 1)">` + E(0, 0, 2.6, 1.3, "#F08A3A", 0.6) + P2("M-2.4,0 L-4.4,-1.4 L-4,0 L-4.4,1.4 Z", "#F2A35A", 0.5) + E(1.2, -0.3, 0.3, 0.3, OUT3, 0) + "</g>";
      s += cylinder2(0, 0, 0.075, 7, 8.4, STONE2, 0.7) + cylinder2(0, 0, 0.06, 8.4, 21, WHITE_STONE2, 0.9);
      const [bx, by] = at(0, 0, 21.6), [, yn] = at(0, 0, 13);
      s += P2(`M${r23(bx - 3.36)},${r23(yn)} Q${r23(bx - 3.6)},${r23(by + 5.2)} ${r23(bx - 6.6)},${r23(by + 4)} L${r23(bx + 6.6)},${r23(by + 4)} Q${r23(bx + 3.6)},${r23(by + 5.2)} ${r23(bx + 3.36)},${r23(yn)} A3.36 1.68 0 0 1 ${r23(bx - 3.36)},${r23(yn)} Z`, WHITE_STONE2.left, 0.9) + L([bx + 1.6, yn + 1.2], [bx + 2.4, by + 5], WHITE_STONE2.right, 0.6);
      s += P2(`M${r23(bx - 12)},${r23(by)} Q${r23(bx - 9.6)},${r23(by + 6)} ${r23(bx)},${r23(by + 6.4)} Q${r23(bx + 9.6)},${r23(by + 6)} ${r23(bx + 12)},${r23(by)} Z`, WHITE_STONE2.left, 0.9) + [-7.2, -2.4, 2.4, 7.2].map((dx) => L([bx + dx * 0.9, by + 0.6], [bx + dx * 0.5, by + 5.4], WHITE_STONE2.right, 0.5)).join("") + E(bx, by, 12, 4.2, WHITE_STONE2.top, 0.9) + E(bx, by + 0.2, 9.2, 2.9, WATER2, 0.6) + E(bx - 1.6, by - 0.3, 4.4, 1.1, WATER_LIGHT, 0);
      const [x, y] = at(0, 0, 22);
      s += thick(`M${x},${y} L${x},${r23(y - 8)}`, 1.6, WATER_LIGHT) + E(x, y - 8.6, 1.8, 1.6, "#E8F6FF", 0.6);
      for (const dx of [-9, 9]) s += `<path d="M${r23(bx + dx)},${r23(by + 1.4)} q${dx > 0 ? 1.6 : -1.6},3 ${dx > 0 ? 2.4 : -2.4},9" stroke="#E8F6FF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.85"/>`;
      for (let i = 0; i < 6; i++) {
        const ang = i / 6 * TAU2, p = (f / 3 + i * 0.17) % 1;
        s += E(x + Math.cos(ang) * (4 + p * 5), y - 8 + p * 10 + Math.sin(ang) * 1.6, 0.8, 1.1, "#E8F6FF", 0.4);
      }
      return s;
    }, "draw") };
    C2.brasero = { n: 3, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0, 16);
      let s = shadow2(0, 0, 0.3, 0.16);
      s += [[-0.13, 0.07], [0.13, 0.07], [0, -0.13]].map(([u, v]) => {
        const p = at(u, v, 0), tx = r23(x + (p[0] - x) * 0.7), side = p[0] < x ? -1 : p[0] > x ? 1 : 0.6;
        return thick(`M${tx},${y + 2} L${r23(p[0])},${r23(p[1] - 1.6)} q${r23(side * 1.6)},1.4 ${r23(side * 0.2)},2.6 q${r23(-side * 1.2)},0 ${r23(-side * 0.6)},-1.2`, 1.4, IRON3.right);
      }).join("");
      s += glow(x, y - 10, 18, "255,170,90", 0.32) + `<path d="M${x - 13},${y - 2} Q${x - 12},${y + 9} ${x},${y + 9.4} Q${x + 12},${y + 9} ${x + 13},${y - 2} Z" fill="${IRON3.left}" stroke="${OUT3}" stroke-width="1"/><path d="M${x + 1},${y + 9.3} Q${x + 11.4},${y + 8.6} ${x + 12.6},${y - 1.6} L${x + 13},${y - 2} Q${x + 6},${y + 2.6} ${x + 1},${y + 2.8} Z" fill="${IRON3.right}"/><path d="M${x - 12.4},${y + 2.4} Q${x},${y + 7} ${x + 12.4},${y + 2.4}" stroke="${IRON3.top}" stroke-width="1.6" fill="none"/>` + [-8, -3, 2, 7].map((dx) => E(x + dx, y + 4.6 + Math.abs(dx) * -0.12, 0.55, 0.55, IRON3.right, 0.4)).join("") + `<path d="M${x - 10},${y + 1} Q${x - 8},${y + 4} ${x - 4},${y + 4.6}" stroke="#FFFFFF" stroke-width="0.8" fill="none" opacity="0.35" stroke-linecap="round"/>` + E(x, y - 2, 13, 4, "#3A2620", 1);
      s += [[-7, -2.2, 2.8], [-2, -3.2, 3], [3.4, -2.6, 2.8], [7.6, -1.8, 2.2], [0.6, -1, 2.4], [-4.6, -0.8, 2]].map(([dx, dy, r], i) => E(x + dx, y + dy, r, r * 0.55, "#5A3A2A", 0.6) + E(x + dx, y + dy - 0.2, r * 0.55, r * 0.25, (i + f) % 3 ? "#E8573A" : "#FFB347", 0)).join("");
      s += flame(x - 4, y - 2, 13 + f * 2, 4, f / 3) + flame(x + 4, y - 2, 11 + (2 - f), 3.6, f / 3 + 0.4) + flame(x, y - 2, 17 - f, 4.4, f / 3 + 0.2);
      for (let i = 0; i < 3; i++) {
        const p = (f / 3 + i / 3) % 1;
        s += E(x - 5 + i * 5 + Math.sin(p * 6 + i) * 1.6, y - 18 - p * 14, 0.7, 0.7, "#FFD27A", 0).replace("/>", ` opacity="${r23(1 - p * 0.8)}"/>`);
      }
      return s;
    }, "draw") };
    function grappe(x, y, sw, n = 6) {
      const fl = [];
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), cx = x + sw * t * t, cy = y + 1.8 + i * 2.5, r = 2.2 - t * 1.1, dx = 2 * (1 - t * 0.75);
        fl.push([cx - dx, cy, r, 0], [cx + dx, cy + 0.6, r * 0.95, 1]);
      }
      fl.push([x + sw, y + 1.8 + n * 2.5 - 0.6, 0.9, 1]);
      return fl.map(([cx, cy, r]) => E(cx, cy, r + 0.75, r * 0.9 + 0.75, OUT3, 0)).join("") + fl.map(([cx, cy, r]) => E(cx, cy, r, r * 0.9, "#C9A8F0", 0)).join("") + fl.map(([cx, cy, r, d]) => d ? E(cx + r * 0.25, cy + r * 0.25, r * 0.6, r * 0.5, "#A57BD8", 0) : E(cx - r * 0.3, cy - r * 0.3, r * 0.45, r * 0.35, "#EEE2FC", 0)).join("") + leafDot(x - 2.4, y - 0.6, 2.4) + leafDot(x + 2.2, y - 1, 2.2);
    }
    __name(grappe, "grappe");
    C2.pergola = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.52, 0.12);
      for (const [u, v] of [[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]]) s += box2(u - 0.05, v - 0.05, u + 0.05, v + 0.05, 0, 2.6, STONE2, 0.8) + post2(u, v, 2.6, 36, WOOD2, 0.035);
      const [lx, ly] = at(-0.36, 0.36, 0);
      s += thick(`M${r23(lx + 2)},${r23(ly)} q-4,-6 0.6,-11 q4,-5 -0.6,-10 q-4,-5 0.8,-11`, 1, "#6E5A3A") + [[-1.6, -6, 2.2], [2.4, -13, 2.4], [-1.4, -21, 2.2], [2.2, -28, 2.4], [-0.6, -33, 2]].map(([dx, dy, r]) => leafDot(lx + dx, ly + dy, r)).join("");
      s += box2(-0.44, -0.385, 0.44, -0.335, 36, 40, WOOD2) + box2(-0.44, 0.335, 0.44, 0.385, 36, 40, WOOD2);
      for (const u of [-0.32, -0.16, 0, 0.16, 0.32]) s += box2(u - 0.022, -0.46, u + 0.022, 0.46, 40, 43, WOOD_DARK2, 0.7);
      for (const [u, v, n] of [[-0.24, 0.36, 6], [0.06, 0.36, 7], [0.3, 0.36, 5], [0.36, 0.04, 6], [0.36, -0.22, 5]]) {
        const [x, y] = at(u, v, 37);
        s += grappe(x, y, wave2(f, 2, 1.2, u * 9 + v * 4), n);
      }
      return s;
    }, "draw") };
    var MARBRE = { light: "#FBF8F1", mid: "#ECE6D8", dark: "#CFC6B2", pli: "#B9AF98" };
    C2.statue = { n: 1, draw: /* @__PURE__ */ __name(() => {
      const [x, y] = at(0, 0, 15), c = MARBRE;
      let s = shadow2(0, 0, 0.32, 0.16) + box2(-0.16, -0.16, 0.16, 0.16, 0, 3.4, STONE2) + box2(-0.12, -0.12, 0.12, 0.12, 3.4, 13, WHITE_STONE2) + box2(-0.14, -0.14, 0.14, 0.14, 13, 15, STONE2);
      const pl = [at(-0.09, 0.12, 6), at(0.03, 0.12, 6), at(0.03, 0.12, 10.6), at(-0.09, 0.12, 10.6)];
      s += poly3(pl, "#E4DCC8", 0.6) + L(at(-0.075, 0.12, 9.2), at(0.015, 0.12, 9.2), c.pli, 0.5) + L(at(-0.075, 0.12, 7.6), at(0, 0.12, 7.6), c.pli, 0.5);
      const robe = `M${x - 7.4},${y} Q${x - 8.6},${y - 14} ${x - 4.4},${y - 25} L${x + 4.4},${y - 25} Q${x + 8.6},${y - 14} ${x + 7.4},${y} Q${x},${y + 1.6} ${x - 7.4},${y} Z`;
      s += P2(robe, c.mid, 1) + `<path d="M${x + 1.2},${y - 25} L${x + 4.4},${y - 25} Q${x + 8.6},${y - 14} ${x + 7.4},${y} Q${x + 4},${y + 1} ${x + 2},${y + 1.2} Q${x + 4.6},${y - 12} ${x + 1.2},${y - 25} Z" fill="${c.dark}"/><path d="M${x - 3.6},${y - 22} Q${x - 4.6},${y - 11} ${x - 3.4},${y + 0.8} M${x - 0.6},${y - 21} Q${x - 1},${y - 10} ${x},${y + 1.2} M${x + 3},${y - 20} Q${x + 4.4},${y - 10} ${x + 4.6},${y + 0.8}" stroke="${c.pli}" stroke-width="0.6" fill="none"/><path d="M${x - 5.6},${y - 18} Q${x},${y - 16.4} ${x + 5.6},${y - 18}" stroke="${c.pli}" stroke-width="1" fill="none"/><path d="M${x - 6.4},${y - 8} Q${x - 4},${y - 13} ${x - 6},${y - 20}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
      s += P2(`M${x - 4.6},${y - 24} Q${x - 6.4},${y - 18} ${x - 2},${y - 15.6} Q${x + 0.4},${y - 15.4} ${x},${y - 17} Q${x - 3},${y - 18} ${x - 2.6},${y - 23} Z`, c.light, 0.8);
      s += thick(`M${x + 3.4},${y - 24} Q${x + 6.6},${y - 28} ${x + 7.6},${y - 33.6}`, 1.6, c.mid) + P2(`M${x + 3.4},${y - 34} L${x + 8.6},${y - 36.4} L${x + 8.6},${y - 41.4} L${x + 3.4},${y - 39} Z`, c.light, 0.8) + P2(`M${x + 8.6},${y - 36.4} L${x + 13.6},${y - 34.6} L${x + 13.6},${y - 39.6} L${x + 8.6},${y - 41.4} Z`, c.mid, 0.8) + `<path d="M${x + 4.4},${y - 37.4} l3.4,-1.6 M${x + 4.4},${y - 36} l3.4,-1.6 M${x + 9.6},${y - 39.6} l3,1 M${x + 9.6},${y - 38.2} l3,1" stroke="${c.pli}" stroke-width="0.45"/>` + E(x + 8.2, y - 35.6, 1.5, 1.2, c.light, 0.7);
      s += E(x, y - 29, 3.6, 3.8, c.light, 0.9) + P2(`M${x - 3.6},${y - 29.6} Q${x - 3.4},${y - 33.6} ${x},${y - 33.6} Q${x + 3.6},${y - 33.4} ${x + 3.6},${y - 29.4} Q${x + 1},${y - 31.6} ${x - 3.6},${y - 29.6} Z`, c.dark, 0.6) + E(x + 0.6, y - 34.6, 2, 1.6, c.mid, 0.7) + `<path d="M${x - 2},${y - 28.6} q0.7,0.6 1.4,0 M${x + 0.8},${y - 28.6} q0.7,0.6 1.4,0" stroke="${c.pli}" stroke-width="0.5" fill="none" stroke-linecap="round"/>`;
      const [lx, ly] = at(-0.16, 0.16, 0), feuille2 = /* @__PURE__ */ __name((fx, fy, a) => `<path d="M0,0 Q-2.4,-1.2 -1.8,-3 Q-0.8,-3.8 0,-2.8 Q0.8,-3.8 1.8,-3 Q2.4,-1.2 0,0 Z" transform="translate(${r23(fx)} ${r23(fy)}) rotate(${a})" fill="#5E9E48" stroke="${OUT3}" stroke-width="0.55" stroke-linejoin="round"/>`, "feuille");
      return s + `<path d="M${r23(lx + 1)},${r23(ly)} Q${r23(lx - 1.4)},${r23(ly - 4)} ${r23(lx + 0.6)},${r23(ly - 8)} Q${r23(lx + 2.4)},${r23(ly - 11)} ${r23(lx + 0.4)},${r23(ly - 14)} M${r23(lx + 1)},${r23(ly)} Q${r23(lx + 4)},${r23(ly - 1)} ${r23(lx + 7)},${r23(ly + 1.6)}" stroke="#3E7A34" stroke-width="0.8" fill="none" stroke-linecap="round"/>` + feuille2(lx - 0.6, ly - 2.4, -40) + feuille2(lx + 1.4, ly - 6.6, 30) + feuille2(lx - 0.2, ly - 10, -30) + feuille2(lx + 1.2, ly - 13.6, 20) + feuille2(lx + 4, ly - 0.2, 70) + feuille2(lx + 6.6, ly + 1.8, 100);
    }, "draw") };
    var PEINT = { light: "#FBF7EF", mid: "#E9E1D2", dark: "#C9BDA8" };
    var ROSES = [["#E8566A", "#B5344A"], ["#F5A3BE", "#D46F8E"], ["#FBD6E1", "#E59CB3"]];
    var rose = /* @__PURE__ */ __name((x, y, r, [c, d]) => E(x, y, r, r * 0.9, c, 0.6) + `<path d="M${r23(x - r * 0.55)},${r23(y + r * 0.1)} q${r23(r * 0.5)},${r23(-r * 0.75)} ${r23(r * 1.05)},${r23(-r * 0.05)} q${r23(-r * 0.2)},${r23(r * 0.55)} ${r23(-r * 0.6)},${r23(r * 0.4)} q${r23(-r * 0.3)},${r23(-r * 0.3)} ${r23(r * 0.1)},${r23(-r * 0.45)}" stroke="${d}" stroke-width="0.6" fill="none" stroke-linecap="round"/>` + E(x - r * 0.45, y - r * 0.4, r * 0.25, r * 0.18, "#FFFFFF", 0), "rose");
    var bouton = /* @__PURE__ */ __name((x, y, c) => P2(`M${r23(x)},${r23(y - 2.6)} Q${r23(x + 1.6)},${r23(y - 0.6)} ${r23(x)},${r23(y + 0.4)} Q${r23(x - 1.6)},${r23(y - 0.6)} ${r23(x)},${r23(y - 2.6)} Z`, c, 0.55) + P2(`M${r23(x - 1.2)},${r23(y - 0.6)} Q${r23(x)},${r23(y + 1.6)} ${r23(x + 1.2)},${r23(y - 0.6)} Q${r23(x)},${r23(y)} ${r23(x - 1.2)},${r23(y - 0.6)} Z`, "#6FAE4E", 0.5), "bouton");
    C2.arche = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const H = 32, [, top] = at(0, 0, H);
      let s = shadow2(0, 0, 0.42, 0.12);
      for (const k of [-1, 1]) {
        const u = -0.25 * k, x0 = 20 * k - 3, x1 = 20 * k + 3, [, y0] = at(u, -u, 2.6);
        s += box2(u - 0.05, -u - 0.05, u + 0.05, -u + 0.05, 0, 2.6, STONE2, 0.8);
        let lat = "";
        for (let y = y0; y > top + 4; y -= 7) lat += `M${x0},${r23(y)} L${x1},${r23(y - 7)} M${x1},${r23(y)} L${x0},${r23(y - 7)} `;
        s += thick(lat, 0.8, PEINT.mid) + thick(`M${x0},${r23(y0)} L${x0},${r23(top)} M${x1},${r23(y0)} L${x1},${r23(top)}`, 1.6, PEINT.light) + `<path d="M${x1 + 0.4},${r23(y0)} L${x1 + 0.4},${r23(top)}" stroke="${PEINT.dark}" stroke-width="0.6"/>`;
      }
      const arc = /* @__PURE__ */ __name((rx, ry) => `M${-rx},${r23(top)} A${rx} ${ry} 0 0 1 ${rx},${r23(top)}`, "arc");
      let rungs = "";
      for (let i = 1; i < 8; i++) {
        const t = i / 8 * Math.PI, c = Math.cos(t), si = Math.sin(t);
        rungs += `M${r23(-17 * c)},${r23(top - 15 * si)} L${r23(-23 * c)},${r23(top - 21 * si)} `;
      }
      s += thick(rungs, 1, PEINT.mid) + thick(arc(23, 21), 1.6, PEINT.light) + thick(arc(17, 15), 1.6, PEINT.light) + `<path d="${arc(23, 20.2)}" stroke="#FFFFFF" stroke-width="0.6" fill="none" opacity="0.8"/>`;
      s += `<path d="M-18,0 Q-24,-8 -19,-15 Q-15,-22 -21,-29 Q-25,-34 -20,${r23(top - 4)}" stroke="#4E7A34" stroke-width="1" fill="none" stroke-linecap="round"/>`;
      const along = /* @__PURE__ */ __name((th) => [r23(-20 * Math.cos(th)), r23(top - 18 * Math.sin(th))], "along");
      const feuilles = [[-20, -4, 2.4], [-22, -12, 2.8], [-17.6, -18, 2.4], [-22.4, -25, 3], [-18, -31, 2.6], [-21, -37, 2.8], [21.4, -26, 2.4], [18.6, -33, 2.6], [22, -38, 2.4]];
      for (let i = 0; i <= 9; i++) {
        const [x, y] = along(i / 13 * Math.PI);
        feuilles.push([x + (i % 2 ? 1.4 : -1.2), y + (i % 2 ? 1 : -0.8), 2.6 + i % 3 * 0.3]);
      }
      s += feuilles.map(([x, y, r], i) => leafDot(x + wave2(f, 2, 0.5, i), y, r)).join("");
      s += [[-21, -9, 2.4, 0], [-19, -22, 2.6, 1], [-21.6, -34, 2.8, 0], [21, -30, 2.2, 1]].map(([x, y, r, c]) => rose(x, y, r, ROSES[c])).join("");
      for (const [i, r, c] of [[1, 2.8, 0], [3, 2.6, 1], [5, 2.8, 2], [7, 2.4, 0], [9, 2.4, 1]]) {
        const [x, y] = along(i / 13 * Math.PI);
        s += rose(x + wave2(f, 2, 0.4, i), y - 0.6, r, ROSES[c]);
      }
      s += bouton(-23.4, -16, ROSES[0][0]) + bouton(-16.4, -28, ROSES[1][0]) + bouton(...along(11 / 13 * Math.PI), ROSES[2][0]);
      const [px, py] = [f ? -9 : -12, f ? -14 : -26];
      return s + `<path d="M${px},${py} q2,-1.4 3,0.4 q-1.6,1.4 -3,-0.4 Z" fill="${ROSES[1][0]}" stroke="${OUT3}" stroke-width="0.5" transform="rotate(${f ? 40 : -20} ${px} ${py})"/>`;
    }, "draw") };
    var fruit = /* @__PURE__ */ __name((x, y, r, c) => E(x, y, r, r * 0.92, c, 0.6) + E(x - r * 0.35, y - r * 0.35, r * 0.32, r * 0.22, "#FFFFFF", 0), "fruit");
    var pomme = /* @__PURE__ */ __name((x, y) => fruit(x, y, 2.1, "#E2574C") + `<path d="M${r23(x)},${r23(y - 1.8)} l0.3,-1.2" stroke="${OUT3}" stroke-width="0.6" stroke-linecap="round"/>` + E(x + 1, y - 2.6, 0.9, 0.45, "#7EC45B", 0.4), "pomme");
    var orange = /* @__PURE__ */ __name((x, y) => fruit(x, y, 2.1, "#F2994A") + E(x + 0.2, y - 1.4, 0.35, 0.3, "#B86A2A", 0), "orange");
    var chou = /* @__PURE__ */ __name((x, y) => E(x, y, 2.5, 2.2, "#8FCB6A", 0.6) + `<path d="M${r23(x - 1.6)},${r23(y + 0.4)} q1.6,-2.6 3.2,0 M${r23(x - 0.8)},${r23(y + 1.4)} q0.8,-1.4 1.6,0" stroke="#5E9E48" stroke-width="0.55" fill="none"/>` + E(x - 0.8, y - 1, 0.8, 0.5, "#C6EBA4", 0), "chou");
    var PANIER = { top: "#E6B877", left: "#C9914E", right: "#A87238" };
    C2.etal = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.48, 0.14);
      for (const u of [-0.36, 0.36]) s += post2(u, -0.26, 0, 43, WOOD_DARK2, 0.025);
      for (const [u, v] of [[-0.34, -0.18], [0.34, -0.18], [-0.34, 0.18], [0.34, 0.18]]) s += post2(u, v, 0, 12, WOOD_DARK2, 0.025);
      s += box2(-0.38, -0.22, 0.38, 0.22, 12, 14.4, WOOD2);
      const n0 = at(-0.38, 0.22, 12), n1 = at(0.38, 0.22, 12);
      let nappe = `M${r23(n0[0])},${r23(n0[1] - 2.4)} L${r23(n1[0])},${r23(n1[1] - 2.4)} L${r23(n1[0])},${r23(n1[1] + 2)}`;
      for (let i = 6; i > 0; i--) {
        const t = (i - 1) / 6, [x, y] = [n0[0] + (n1[0] - n0[0]) * t, n0[1] + (n1[1] - n0[1]) * t];
        nappe += ` Q${r23(x + (n1[0] - n0[0]) / 12)},${r23(y + (n1[1] - n0[1]) / 12 + 5)} ${r23(x)},${r23(y + 2)}`;
      }
      s += P2(nappe + " Z", "#F6EEDB", 0.8) + L([n0[0], n0[1] - 0.8], [n1[0], n1[1] - 0.8], "#E8566A", 1);
      for (const [u, fr] of [[-0.22, pomme], [0.02, orange], [0.24, chou]]) {
        s += box2(u - 0.09, -0.12, u + 0.09, 0.06, 14.4, 19, PANIER, 0.7);
        const [bx, by] = at(u + 0.09, -0.03, 16.6);
        s += `<path d="M${r23(bx - 6.4)},${r23(by + 2.4)} L${r23(bx - 0.2)},${r23(by + 5.6)} M${r23(bx - 6.4)},${r23(by + 0.2)} L${r23(bx - 0.2)},${r23(by + 3.4)}" stroke="${PANIER.right}" stroke-width="0.5"/>`;
        for (const [du, dv, dz] of [[-0.05, -0.06, 20], [0.04, -0.06, 20], [-0.05, 0.02, 20], [0.04, 0.02, 20], [0, -0.02, 22.6]]) {
          const [x, y] = at(u + du, dv, dz);
          s += fr(x, y);
        }
      }
      const p0 = at(-0.44, -0.32, 43), p1 = at(0.44, -0.32, 43), p2 = at(0.44, 0.12, 37.4), p3 = at(-0.44, 0.12, 37.4);
      const q = /* @__PURE__ */ __name((A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], "q"), pts3 = /* @__PURE__ */ __name((a) => a.map((p) => p.map(r23).join(",")).join(" "), "pts");
      s += `<polygon points="${pts3([p0, p1, p2, p3])}" fill="#FFF4E2" stroke="${OUT3}" stroke-width="1" stroke-linejoin="round"/>`;
      for (let i = 0; i < 8; i += 2) s += `<polygon points="${pts3([q(p0, p1, i / 8), q(p0, p1, (i + 1) / 8), q(p3, p2, (i + 1) / 8), q(p3, p2, i / 8)])}" fill="#E8566A"/>`;
      s += `<polygon points="${pts3([p0, p1, p2, p3])}" fill="none" stroke="${OUT3}" stroke-width="1" stroke-linejoin="round"/>`;
      for (let i = 0; i < 8; i++) {
        const A = q(p3, p2, i / 8), B = q(p3, p2, (i + 1) / 8), d = 4 + wave2(f, 2, 0.6, i * 1.3);
        s += P2(`M${r23(A[0])},${r23(A[1])} L${r23(B[0])},${r23(B[1])} L${r23(B[0])},${r23(B[1] + 3)} Q${r23((A[0] + B[0]) / 2)},${r23((A[1] + B[1]) / 2 + 3 + d)} ${r23(A[0])},${r23(A[1] + 3)} Z`, i % 2 ? "#FBEBD2" : "#D94A5E", 0.8);
      }
      const [ax, ay] = at(0.5, 0.16, 0);
      return s + P2(`M${r23(ax - 3.6)},${r23(ay)} L${r23(ax - 2.4)},${r23(ay - 11)} L${r23(ax + 4.6)},${r23(ay - 9.6)} L${r23(ax + 3.6)},${r23(ay + 1.2)} Z`, WOOD2.left, 0.8) + `<path d="M${r23(ax - 2.4)},${r23(ay - 1)} L${r23(ax - 1.4)},${r23(ay - 9.8)} L${r23(ax + 3.6)},${r23(ay - 8.8)} L${r23(ax + 2.8)},${r23(ay)} Z" fill="#3E4A48"/>` + E(ax, ay - 6.4, 1.2, 1.1, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.5"') + `<path d="M${r23(ax - 1)},${r23(ay - 2.6)} l1.2,0.2 m0.6,0.1 l1.4,0.2" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round"/>`;
    }, "draw") };
    var FRISE = { top: "#FBF8F1", left: "#EDE6D8", right: "#CFC5B2" };
    var note = /* @__PURE__ */ __name((x, y, k) => E(x, y, 1.5, 1.1, OUT3, 0) + `<path d="M${r23(x + 1.3)},${r23(y)} L${r23(x + 1.3)},${r23(y - 6)} q${r23(1.6 * k)},1 2.6,3.2" stroke="${OUT3}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`, "note");
    C2.kiosque = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.52, 0.12) + cylinder2(0, 0, 0.46, 0, 2.4, STONE2) + cylinder2(0, 0, 0.4, 2.4, 5, STONE2);
      const [cx, cy] = at(0, 0, 5);
      s += disc2(0, 0, 0.36, 5, WOOD2.top, 0.7);
      for (const dx of [-12, -6, 0, 6, 12]) {
        const h = Math.sqrt(Math.max(0, 1 - (dx / 20.2) ** 2)) * 10;
        s += L([cx + dx, cy - h], [cx + dx, cy + h], WOOD2.left, 0.45);
      }
      const cols = Array.from({ length: 6 }, (_, i) => i / 6 * TAU2 + 0.26).map((a) => [Math.cos(a) * 0.32, Math.sin(a) * 0.32]);
      const col = /* @__PURE__ */ __name(([u, v]) => cylinder2(u, v, 0.024, 5, 30, WHITE_STONE2, 0.7), "col");
      const [, yr] = at(0, 0, 10.4), rx = 0.32 * 56, ry = 0.32 * 28;
      const balustre = /* @__PURE__ */ __name((av) => {
        let o = "";
        for (let i = 0; i < 18; i++) {
          const t = i / 18 * TAU2, sy = Math.sin(t);
          if (sy >= 0 !== av) continue;
          const x = cx + rx * Math.cos(t);
          o += L([x, cy + ry * sy], [x, yr + ry * sy], IRON3.right, 0.7);
        }
        return o + `<path d="M${r23(cx - rx)},${r23(yr)} A${r23(rx)} ${r23(ry)} 0 0 ${av ? 0 : 1} ${r23(cx + rx)},${r23(yr)}" stroke="${IRON3.right}" stroke-width="1.2" fill="none"/>`;
      }, "balustre");
      s += cols.filter(([u, v]) => u + v < 0).map(col).join("") + balustre(false);
      const [lx, ly] = at(0, 0, 25);
      s += L([lx, ly - 8], [lx, ly - 1.6], IRON3.right, 0.6) + P2(`M${r23(lx - 1.8)},${r23(ly - 1.6)} L${r23(lx + 1.8)},${r23(ly - 1.6)} L${r23(lx + 1.3)},${r23(ly + 2.4)} L${r23(lx - 1.3)},${r23(ly + 2.4)} Z`, "#FFE08A", 0.6) + E(lx, ly - 1.8, 2.2, 0.8, BRASS2.left, 0.5);
      const [mx, my] = at(0.06, 0.04, 5);
      s += L([mx, my], [mx, my - 9], IRON3.right, 0.8) + L([mx - 2.4, my + 1], [mx + 2.4, my + 1], IRON3.right, 0.8) + P2(`M${r23(mx - 4)},${r23(my - 9)} L${r23(mx + 4)},${r23(my - 10.4)} L${r23(mx + 4)},${r23(my - 15)} L${r23(mx - 4)},${r23(my - 13.6)} Z`, "#FFFDF6", 0.6) + `<path d="M${r23(mx - 3)},${r23(my - 12)} l6,-1 M${r23(mx - 3)},${r23(my - 10.6)} l6,-1" stroke="#B9AF98" stroke-width="0.45"/>`;
      s += balustre(true) + cols.filter(([u, v]) => u + v >= 0).map(col).join("");
      s += cylinder2(0, 0, 0.38, 30, 33.4, FRISE, 0.9);
      const [, yf] = at(0, 0, 30), fr = 0.38 * 56, fry = 0.38 * 28;
      for (let i = 0; i < 9; i++) {
        const t0 = i / 9 * Math.PI, t1 = (i + 1) / 9 * Math.PI, A = [cx + fr * Math.cos(t0), yf + fry * Math.sin(t0)], B = [cx + fr * Math.cos(t1), yf + fry * Math.sin(t1)];
        s += P2(`M${r23(A[0])},${r23(A[1])} L${r23(B[0])},${r23(B[1])} Q${r23((A[0] + B[0]) / 2)},${r23((A[1] + B[1]) / 2 + 5.6)} ${r23(A[0])},${r23(A[1])} Z`, i % 2 ? "#FFFFFF" : "#5C8FD0", 0.7);
      }
      const [tx, tb] = at(0, 0, 33.4), R = 27, Ry = 13.4, tip = tb - 25;
      const gauche = `M${tx - R},${r23(tb)} C${r23(tx - R * 0.86)},${r23(tb - 11)} ${r23(tx - R * 0.3)},${r23(tb - 13)} ${tx},${r23(tip)}`;
      const droite = `C${r23(tx + R * 0.3)},${r23(tb - 13)} ${r23(tx + R * 0.86)},${r23(tb - 11)} ${tx + R},${r23(tb)}`;
      s += P2(`${gauche} ${droite} A${R} ${Ry} 0 0 1 ${tx - R},${r23(tb)} Z`, ROOF_BLUE.front, 1.1) + `<path d="M${tx},${r23(tip)} ${droite} A${R} ${Ry} 0 0 1 ${r23(tx + 6)},${r23(tb + Ry - 0.4)} C${r23(tx + 5)},${r23(tb - 6)} ${r23(tx + 2)},${r23(tb - 14)} ${tx},${r23(tip)} Z" fill="${ROOF_BLUE.back}"/>` + [-0.7, -0.35, 0.4].map((k2) => `<path d="M${tx},${r23(tip)} C${r23(tx + R * k2 * 0.2)},${r23(tb - 14)} ${r23(tx + R * k2 * 0.8)},${r23(tb - 6)} ${r23(tx + R * k2)},${r23(tb + Ry * Math.sqrt(1 - k2 * k2))}" stroke="${k2 < 0 ? "#8DB6E6" : "#2F5A8C"}" stroke-width="0.7" fill="none"/>`).join("") + P2(`${gauche} ${droite} A${R} ${Ry} 0 0 1 ${tx - R},${r23(tb)} Z`, "none", 1.1);
      const k = wave2(f, 2, 1.2);
      s += L([tx, tip], [tx, tip - 10], IRON3.right, 0.9) + E(tx, tip - 0.6, 2, 1.6, BRASS2.left, 0.7) + P2(`M${tx},${r23(tip - 10)} Q${r23(tx + 5)},${r23(tip - 12 + k)} ${r23(tx + 10)},${r23(tip - 9 - k)} L${tx},${r23(tip - 5.6)} Z`, "#E8566A", 0.7) + E(tx, tip - 10.6, 1, 1, BRASS2.top, 0.5);
      return s + (f ? note(cx + 30, cy - 24, 1) : note(cx + 26, cy - 15, 1));
    }, "draw") };
    var BRONZE = { plaque: "#D2AE62", bord: "#A9843E", trait: "#7E5E2A" };
    C2.cadran = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let s = shadow2(0, 0, 0.36, 0.16) + box2(-0.17, -0.17, 0.17, 0.17, 0, 2.2, STONE2) + box2(-0.13, -0.13, 0.13, 0.13, 2.2, 4, STONE2);
      const [bx, by] = at(0, 0, 4), [, ty] = at(0, 0, 17.4), h = by - ty;
      s += P2(`M${r23(bx - 4.6)},${r23(by - 0.4)} Q${r23(bx - 2.6)},${r23(by - h * 0.14)} ${r23(bx - 2.8)},${r23(by - h * 0.24)} Q${r23(bx - 6)},${r23(by - h * 0.46)} ${r23(bx - 2.6)},${r23(by - h * 0.74)} Q${r23(bx - 2)},${r23(by - h * 0.86)} ${r23(bx - 4.4)},${r23(ty)} L${r23(bx + 4.4)},${r23(ty)} Q${r23(bx + 2)},${r23(by - h * 0.86)} ${r23(bx + 2.6)},${r23(by - h * 0.74)} Q${r23(bx + 6)},${r23(by - h * 0.46)} ${r23(bx + 2.8)},${r23(by - h * 0.24)} Q${r23(bx + 2.6)},${r23(by - h * 0.14)} ${r23(bx + 4.6)},${r23(by - 0.4)} Q${r23(bx)},${r23(by + 2)} ${r23(bx - 4.6)},${r23(by - 0.4)} Z`, WHITE_STONE2.left, 0.9) + `<path d="M${r23(bx + 1.2)},${r23(ty + 1)} Q${r23(bx + 3.4)},${r23(by - h * 0.46)} ${r23(bx + 1.6)},${r23(by + 1.2)} L${r23(bx + 4.2)},${r23(by - 0.2)} Q${r23(bx + 2.6)},${r23(by - h * 0.14)} ${r23(bx + 2.8)},${r23(by - h * 0.24)} Q${r23(bx + 5.6)},${r23(by - h * 0.46)} ${r23(bx + 2.6)},${r23(by - h * 0.74)} Q${r23(bx + 2)},${r23(by - h * 0.86)} ${r23(bx + 4)},${r23(ty + 0.6)} Z" fill="${WHITE_STONE2.right}"/><path d="M${r23(bx - 3.6)},${r23(by - h * 0.46)} Q${r23(bx)},${r23(by - h * 0.4)} ${r23(bx + 3.6)},${r23(by - h * 0.46)}" stroke="${WHITE_STONE2.right}" stroke-width="0.6" fill="none"/>`;
      s += cylinder2(0, 0, 0.28, 17.4, 20, WHITE_STONE2) + disc2(0, 0, 0.23, 20, BRONZE.plaque, 0.7);
      const [x, y] = at(0, 0, 20), rx = 0.23 * 56, ry = 0.23 * 28;
      s += E(x, y, rx * 0.8, ry * 0.8, "none", 0).replace('stroke="none"', `stroke="${BRONZE.bord}" stroke-width="0.6"`);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU2, c = Math.cos(a), sn = Math.sin(a);
        s += L([x + c * rx * 0.8, y + sn * ry * 0.8], [x + c * rx * 0.95, y + sn * ry * 0.95], BRONZE.trait, i % 3 ? 0.5 : 0.9);
      }
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU2;
        s += L([x + Math.cos(a) * 2.6, y + Math.sin(a) * 1.3], [x + Math.cos(a) * 3.8, y + Math.sin(a) * 1.9], BRONZE.trait, 0.45);
      }
      s += E(x, y, 1.9, 1, BRONZE.bord, 0.4);
      const sa = f ? 0.75 : -0.35;
      s += `<path d="M${x},${y} L${r23(x + Math.cos(sa - 0.12) * rx * 0.86)},${r23(y + Math.sin(sa - 0.12) * ry * 0.86)} L${r23(x + Math.cos(sa + 0.12) * rx * 0.86)},${r23(y + Math.sin(sa + 0.12) * ry * 0.86)} Z" fill="rgba(70,45,20,0.4)"/>`;
      const g0 = at(0, 0.12, 20), g1 = at(0, -0.12, 20), g2 = at(0, -0.12, 26.4), g3 = at(0.018, -0.12, 26.4), g4 = at(0.018, 0.12, 20);
      s += poly3([g0, g1, g2], BRASS2.right, 0.8) + poly3([g0, g2, g3, g4], BRASS2.top, 0.7);
      const [hx, hy] = at(0.1, 0.2, 0);
      return s + herbe(hx - 6, hy + 1, "#86B852", 0.6) + fleurette(hx - 2.4, hy + 2, "#FFFFFF") + fleurette(hx + 3.4, hy + 1.4, "#F7B6C8");
    }, "draw") };
    var nenuphar = /* @__PURE__ */ __name((x, y, r, a) => {
      const p = /* @__PURE__ */ __name((t) => `${r23(x + Math.cos(t) * r)},${r23(y + Math.sin(t) * r * 0.5)}`, "p");
      return `<path d="M${r23(x)},${r23(y)} L${p(a + 0.3)} A${r23(r)} ${r23(r * 0.5)} 0 1 1 ${p(a - 0.3)} Z" fill="#7EC45B" stroke="${OUT3}" stroke-width="0.7" stroke-linejoin="round"/>` + [a + 1.6, a + 3.1, a + 4.6].map((t) => `<path d="M${r23(x)},${r23(y)} L${p(t)}" stroke="#5E9E48" stroke-width="0.45"/>`).join("") + E(x - r * 0.35, y - r * 0.18, r * 0.3, r * 0.12, "#B3E386", 0);
    }, "nenuphar");
    var lotus = /* @__PURE__ */ __name((x, y) => [-2.4, -1.2, 0, 1.2, 2.4].map((dx, i) => P2(`M${r23(x)},${r23(y)} Q${r23(x + dx * 1.4 - 1.2)},${r23(y - 2.4 + Math.abs(dx) * 0.5)} ${r23(x + dx * 1.3)},${r23(y - 4 + Math.abs(dx) * 0.9)} Q${r23(x + dx * 1.4 + 1.2)},${r23(y - 2.4 + Math.abs(dx) * 0.5)} ${r23(x)},${r23(y)} Z`, i % 2 ? "#F7B6CE" : "#FBD6E1", 0.55)).join("") + E(x, y - 0.8, 1.2, 0.6, "#F2C94C", 0.4), "lotus");
    var koi = /* @__PURE__ */ __name((x, y, dir, tache) => `<g transform="translate(${r23(x)} ${r23(y)}) scale(${dir} 1)">` + P2("M-2.4,0 L-4.8,-1.8 Q-4.2,0 -4.8,1.8 Z", "#F6A04A", 0.5) + E(0, 0, 3, 1.4, tache ? "#FFF4EA" : "#F08A3A", 0.6) + E(tache ? 0.4 : -0.6, -0.2, 1.2, 0.8, tache ? "#F08A3A" : "#FFF4EA", 0) + E(1.9, -0.3, 0.3, 0.3, OUT3, 0) + "</g>", "koi");
    C2.bassin = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const Z = 5.6, ZE = 4, U = 0.42, V = 0.36, u0 = 0.34, v0 = 0.28;
      let s = shadow2(0, 0, 0.52, 0.1) + box2(-U, -V, U, V, 0, Z, STONE2);
      const jo = /* @__PURE__ */ __name((A, B2, c = STONE2.right) => L(A, B2, c, 0.6), "jo");
      s += jo(at(-U, V, Z / 2), at(U, V, Z / 2)) + jo(at(U, V, Z / 2), at(U, -V, Z / 2), "#807663");
      for (const [t, z0, z1] of [[0.22, 0, Z / 2], [0.55, 0, Z / 2], [0.86, 0, Z / 2], [0.08, Z / 2, Z], [0.38, Z / 2, Z], [0.7, Z / 2, Z]]) {
        const u = -U + 2 * U * t;
        s += jo(at(u, V, z0), at(u, V, z1));
      }
      for (const [t, z0, z1] of [[0.3, 0, Z / 2], [0.68, 0, Z / 2], [0.14, Z / 2, Z], [0.5, Z / 2, Z], [0.86, Z / 2, Z]]) {
        const v = V - 2 * V * t;
        s += jo(at(U, v, z0), at(U, v, z1), "#807663");
      }
      const H = /* @__PURE__ */ __name((u, v) => at(u, v, Z), "H"), W = /* @__PURE__ */ __name((u, v) => at(u, v, ZE), "W");
      const X = /* @__PURE__ */ __name((p1, p2, p3, p4) => {
        const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]), t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d;
        return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
      }, "X");
      const T = H(-u0, -v0), R = H(u0, -v0), B = H(u0, v0), Lf = H(-u0, v0), WT = W(-u0, -v0);
      const Pl = X(W(-u0, v0), WT, Lf, B), Pr = X(WT, W(u0, -v0), R, B);
      s += poly3([Lf, T, WT, Pl], "#A49A86", 0.6) + poly3([T, R, Pr, WT], "#8E846F", 0.6) + poly3([Pl, WT, Pr, B], WATER2, 0.6) + poly3([Pl, WT, [WT[0] + 14, WT[1] + 7], [Pl[0] + 8, Pl[1] + 4]], WATER_LIGHT, 0);
      for (const t of [0.25, 0.5, 0.75]) {
        const u = -U + 2 * U * t;
        s += jo(at(u, V, Z), at(u, v0, Z)) + jo(at(u, -V, Z), at(u, -v0, Z));
      }
      for (const t of [0.33, 0.66]) {
        const v = -V + 2 * V * t;
        s += jo(at(U, v, Z), at(u0, v, Z)) + jo(at(-U, v, Z), at(-u0, v, Z));
      }
      const [cx, cy] = at(0.04, 0.04, ZE);
      for (const [dx, dy, k] of [[-6, 2, f], [8, -2, 1 - f]]) s += E(cx + dx, cy + dy, 3 + k * 4, 1.5 + k * 2, "none", 0).replace('stroke="none"', `stroke="#E8F6FF" stroke-width="0.6" opacity="${r23(0.9 - k * 0.5)}"`);
      s += koi(cx + (f ? 6 : -2), cy + 4, f ? -1 : 1, false) + koi(cx + (f ? -10 : -4), cy - 1, f ? 1 : -1, true);
      const bob = f ? 0.3 : -0.3;
      s += nenuphar(cx + 10, cy + 3 + bob, 4.6, 2.6) + nenuphar(cx - 13, cy + 3 - bob, 3.6, 0.4) + nenuphar(cx + 4, cy - 6 - bob, 3, 4) + lotus(cx + 10.6, cy + 2.6 + bob);
      const [jx, jy] = at(-0.24, -0.2, ZE);
      return s + thick(`M${r23(jx - 2)},${r23(jy)} q-1.4,-6 -3.6,-9.6 M${r23(jx)},${r23(jy)} q0.4,-8 1.4,-12.6 M${r23(jx + 2)},${r23(jy)} q2,-5 4.6,-7.4`, 0.9, "#7EC45B") + thick(`M${r23(jx + 0.6)},${r23(jy - 2)} q0,-6 -0.6,-11`, 0.5, "#6E8A44") + E(jx, jy - 14, 1.1, 2.6, "#8A5A34", 0.7);
    }, "draw") };
    var CUIR = { light: "#5E9070", mid: "#3F6B4E", dark: "#2C4E38" };
    C2.longuevue = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0, 25);
      const pied = /* @__PURE__ */ __name((u, v) => {
        const [px, py] = at(u, v, 0);
        return thick(`M${r23(px)},${r23(py)} L${r23(x)},${r23(y + 1)}`, 1.5, WOOD2.left) + `<path d="M${r23(px + (x - px) * 0.1)},${r23(py + (y - py) * 0.1)} L${r23(x)},${r23(y + 1)}" stroke="${WOOD2.top}" stroke-width="0.5"/>` + E(px, py - 0.6, 1.5, 1, BRASS2.left, 0.6);
      }, "pied");
      let s = shadow2(0, 0, 0.32, 0.14) + pied(0.02, -0.2);
      s += box2(-0.36, 0.06, -0.18, 0.24, 0, 6, WOOD2, 0.8);
      const [kx, ky] = at(-0.36, 0.24, 3);
      s += L([kx + 0.6, ky], at(-0.18, 0.24, 3), WOOD2.right, 0.6) + L(at(-0.18, 0.24, 3), at(-0.18, 0.06, 3), "#7A4A24", 0.6);
      s += pied(-0.18, 0.12) + pied(0.18, 0.1);
      const sec = /* @__PURE__ */ __name((x0, x1, h, c, top) => `<rect x="${x0}" y="${-h / 2}" width="${x1 - x0}" height="${h}" rx="0.8" fill="${c}" stroke="${OUT3}" stroke-width="0.8"/><rect x="${x0 + 0.6}" y="${r23(-h / 2 + 0.7)}" width="${r23(x1 - x0 - 1.2)}" height="${r23(h * 0.2)}" rx="0.4" fill="${top}"/>`, "sec");
      const bague = /* @__PURE__ */ __name((bx, h) => `<rect x="${bx - 0.7}" y="${r23(-h / 2)}" width="1.4" height="${h}" rx="0.5" fill="${BRASS2.top}" stroke="${OUT3}" stroke-width="0.6"/>`, "bague");
      s += `<g transform="translate(${x} ${y - 2}) rotate(-17)">` + sec(-18, -14, 3, BRASS2.right, BRASS2.left) + sec(-14, -5, 4.4, BRASS2.left, BRASS2.top) + sec(-5, 6, 5.6, CUIR.mid, CUIR.light) + `<path d="M-3,-2.8 L-1,2.8 M1,-2.8 L3,2.8" stroke="${CUIR.dark}" stroke-width="0.5"/>` + sec(6, 15, 7, BRASS2.left, BRASS2.top) + sec(15, 19, 8.2, BRASS2.right, BRASS2.left) + bague(-5, 5.2) + bague(6, 7.6) + bague(15, 8.6) + E(19, 0, 1.4, 3.6, "#BFE7F7", 0.7) + E(19.2, f ? -1.6 : 1, 0.5, 0.9, "#FFFFFF", 0) + `<rect x="${f ? 10 : 7.6}" y="-3" width="2.6" height="1" rx="0.5" fill="#FFFFFF" opacity="0.9"/></g>`;
      return s + `<path d="M${x - 3},${y + 1} L${x - 2.6},${y - 3.4} L${x + 2.6},${y - 4.4} L${x + 3},${y + 0.2} Z" fill="${BRASS2.right}" stroke="${OUT3}" stroke-width="0.7" stroke-linejoin="round"/>` + E(x, y - 2.6, 1.6, 1.6, BRASS2.top, 0.6);
    }, "draw") };
    var givre = /* @__PURE__ */ __name((x, y, r) => `<path d="M${r23(x)},${r23(y - r)} L${r23(x + r * 0.25)},${r23(y - r * 0.25)} L${r23(x + r)},${r23(y)} L${r23(x + r * 0.25)},${r23(y + r * 0.25)} L${r23(x)},${r23(y + r)} L${r23(x - r * 0.25)},${r23(y + r * 0.25)} L${r23(x - r)},${r23(y)} L${r23(x - r * 0.25)},${r23(y - r * 0.25)} Z" fill="#FFFFFF"/>`, "givre");
    C2.igloo = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bord = Array.from({ length: 14 }, (_, i) => {
        const t = i / 14 * TAU2, r = 1 + (i % 2 ? 0.06 : -0.03) + (i % 3 ? 0 : 0.04);
        return [x + Math.cos(t) * 35 * r, y + 3 + Math.sin(t) * 12.6 * r];
      });
      const mil = /* @__PURE__ */ __name((i) => {
        const p = bord[i % 14], q = bord[(i + 1) % 14];
        return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
      }, "mil");
      let neige = `M${mil(13)}`;
      for (let i = 0; i < 14; i++) neige += ` Q${r23(bord[i][0])},${r23(bord[i][1])} ${mil(i)}`;
      let s = `<path d="${neige}Z" fill="#F4FBFF" stroke="#CFE3EF" stroke-width="1.2" stroke-linejoin="round"/>` + E(x + 6, y + 4, 26, 8, "#DCEEF8", 0) + shadow2(0, 0, 0.46, 0.1);
      const dome = `M${x - 30},${y} Q${x - 31},${y - 34} ${x},${y - 37} Q${x + 31},${y - 34} ${x + 30},${y} Q${x},${y + 9} ${x - 30},${y} Z`;
      const id3 = `igloo-dome-${f}`;
      s += `<defs><clipPath id="${id3}"><path d="${dome}"/></clipPath></defs><path d="${dome}" fill="${ICE.right}"/><g clip-path="url(#${id3})"><path d="${dome}" fill="${ICE.left}" transform="translate(-4 -2)"/><path d="${dome}" fill="${ICE.top}" transform="translate(-9 -4)"/>`;
      s += [[-17, -10, 8], [-2, -18, 7], [-12, -26, 6], [6, -10, 6]].map(([dx, dy, w]) => `<rect x="${x + dx}" y="${y + dy}" width="${w}" height="5" rx="1.6" fill="#FFFFFF" opacity="0.55"/>`).join("");
      const rows = [-7, -15, -23, -30];
      for (const yy of rows) s += `<path d="M${x - 32},${y + yy + 2} Q${x},${y + yy + 7} ${x + 32},${y + yy + 2}" fill="none" stroke="#9FC9E2" stroke-width="0.8"/>`;
      [[-24, -2], [-12, -1], [12, -1], [24, -2], [-19, -10], [-6, -9], [6, -9], [19, -10], [-13, -18], [0, -17], [13, -18], [-7, -25], [7, -25]].forEach(([dx, dy]) => {
        s += `<path d="M${x + dx},${y + dy} l${r23(dx * 0.035)},-6" stroke="#9FC9E2" stroke-width="0.8"/>`;
      });
      s += `</g><path d="${dome}" fill="none" stroke="${OUT3}" stroke-width="1.1" stroke-linejoin="round"/>`;
      s += givre(x - 20, y - 22, 1.8) + givre(x - 8, y - 31, 1.3) + givre(x + 4, y - 14, 1.1);
      const [vx, vy] = [x + 3, y - 36.4];
      s += E(vx, vy, 2.6, 1, "#9FC9E2", 0.6) + [[0, -4 - f * 3, 2.2], [2 + f, -9 - f * 3, 1.7], [-1 + f, -13 - f * 2.6, 1.2]].map(([dx, dy, r], i) => E(vx + dx, vy + dy, r * 1.3, r, "#FFFFFF", 0).replace('stroke="none"', `stroke="#C9DCE6" stroke-width="0.6" opacity="${r23(0.9 - i * 0.2)}"`)).join("");
      s += `<path d="M${x - 13},${y + 5} L${x - 13},${y - 8} Q${x - 4},${y - 17} ${x + 5},${y - 8} L${x + 5},${y + 7} Q${x - 4},${y + 9} ${x - 13},${y + 5} Z" fill="${ICE.top}" stroke="${OUT3}" stroke-width="1"/><path d="M${x + 5},${y - 8} L${x + 5},${y + 7} L${x + 1},${y + 7.4} L${x + 1},${y - 9} Z" fill="${ICE.left}"/><path d="M${x - 13},${y - 1} L${x - 9},${y - 1} M${x - 12},${y - 8.6} L${x - 8.4},${y - 7.4} M${x + 0.6},${y - 7.4} L${x + 4.4},${y - 8.6} M${x - 7},${y - 12.6} l1,3 M${x - 1},${y - 12.6} l-1,3" stroke="#9FC9E2" stroke-width="0.7"/>`;
      s += `<path d="M${x - 9},${y + 5.5} L${x - 9},${y - 6} Q${x - 4},${y - 11} ${x + 1},${y - 6} L${x + 1},${y + 6.5} Z" fill="${f ? "#FFD27A" : "#3A4A5A"}" stroke="${OUT3}" stroke-width="0.8"/>` + (f ? glow(x - 4, y - 1, 12, "255,210,120", 0.35) : "");
      s += (f ? `<path d="M${x - 7.6},${y + 5} L${x - 7.6},${y - 4.6} Q${x - 4},${y - 8.6} ${x - 0.4},${y - 4.6}" stroke="#FFF1C4" stroke-width="0.8" fill="none"/>` : "") + [[-7.4, -8.4, 2], [-4.6, -9.6, 2.6], [-1.6, -8.8, 1.8]].map(([dx, dy, h]) => P2(`M${r23(x + dx - 0.8)},${r23(y + dy)} L${r23(x + dx + 0.8)},${r23(y + dy)} L${r23(x + dx)},${r23(y + dy + h)} Z`, "#E9F8FF", 0.45)).join("");
      const [hx, hy] = at(0.36, 0.16, 0);
      return s + E(hx, hy, 5, 2.2, "#E9F8FF", 0.7) + E(hx, hy + 0.2, 3.6, 1.5, "#3E6FA8", 0) + E(hx - 1, hy - 0.2, 1.4, 0.4, "#7FB2E6", 0) + L([hx + 6, hy + 2], [hx + 3, hy - 13], WOOD2.left, 1.1) + `<path d="M${r23(hx + 3)},${r23(hy - 13)} Q${r23(hx + 0.6)},${r23(hy - 8)} ${r23(hx + 0.4)},${r23(hy)}" stroke="${OUT3}" stroke-width="0.4" fill="none"/><g transform="translate(${r23(hx - 9)} ${r23(hy + 3.4)}) rotate(-12)">` + P2("M2.4,0 L4.4,-1.6 L4,0 L4.4,1.6 Z", "#9FC9E2", 0.5) + E(0, 0, 2.8, 1.3, "#BFD7E8", 0.6) + E(-1.6, -0.3, 0.3, 0.3, OUT3, 0) + "</g>";
    }, "draw") };
    C2.sculpture = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [bx, by] = at(0, 0, 0), [x, y] = at(0, 0, 10);
      let s = E(bx, by + 2, 24, 9, "#F4FBFF", 0).replace('stroke="none"', 'stroke="#CFE3EF" stroke-width="1.2"') + shadow2(0, 0, 0.3, 0.12) + box2(-0.18, -0.18, 0.18, 0.18, 0, 10, ICE);
      s += `<path d="M${r23(bx - 12)},${r23(by - 4)} l4,-6 M${r23(bx - 8)},${r23(by - 1)} l2.6,-4 M${r23(bx + 5)},${r23(by - 2)} l3,-5" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.8"/><path d="M${r23(x - 13.6)},${r23(y + 0.4)} L${r23(x)},${r23(y + 7.2)} L${r23(x + 13.6)},${r23(y + 0.4)}" stroke="#FFFFFF" stroke-width="0.8" fill="none" opacity="0.9"/>`;
      const aile = /* @__PURE__ */ __name((dx, dy, c) => P2(`M${r23(x - 7 + dx)},${r23(y - 6 + dy)} C${r23(x - 9 + dx)},${r23(y - 15 + dy)} ${r23(x - 3 + dx)},${r23(y - 21 + dy)} ${r23(x + 4 + dx)},${r23(y - 20 + dy)} Q${r23(x + 2 + dx)},${r23(y - 17 + dy)} ${r23(x + 0.4 + dx)},${r23(y - 17.4 + dy)} Q${r23(x + 0.6 + dx)},${r23(y - 14 + dy)} ${r23(x - 2 + dx)},${r23(y - 14 + dy)} Q${r23(x - 1.6 + dx)},${r23(y - 10.6 + dy)} ${r23(x - 4.2 + dx)},${r23(y - 10.4 + dy)} Q${r23(x - 3.6 + dx)},${r23(y - 7.4 + dy)} ${r23(x - 7 + dx)},${r23(y - 6 + dy)} Z`, c, 0.8), "aile");
      s += aile(5, -2, ICE.left);
      s += P2(`M${x - 12},${y - 9} Q${x - 10},${y - 2} ${x - 4},${y - 1} Q${x + 6},${y} ${x + 9},${y - 5} Q${x + 10},${y - 10} ${x + 5},${y - 11} Q${x - 2},${y - 10} ${x - 12},${y - 9} Z`, "#E9F8FF", 0.9) + `<path d="M${x - 3},${y - 1.6} Q${x + 6},${y - 1} ${x + 8.4},${y - 5}" stroke="${ICE.left}" stroke-width="1.4" fill="none"/><path d="M${x - 9},${y - 7.6} Q${x - 4},${y - 9.4} ${x + 1},${y - 9.6}" stroke="#FFFFFF" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
      s += aile(0, 0, "#F4FBFF") + `<path d="M${x - 5.4},${y - 9} Q${x - 4},${y - 15} ${x + 1},${y - 18}" stroke="${ICE.left}" stroke-width="0.6" fill="none"/>`;
      const cou = `M${x + 6},${y - 9} Q${x + 12},${y - 17} ${x + 8},${y - 24} Q${x + 4.6},${y - 30} ${x + 8},${y - 32}`;
      s += thick(cou, 2.6, "#E9F8FF") + `<path d="M${x + 7},${y - 11} Q${x + 10.6},${y - 17} ${x + 7},${y - 23.6}" stroke="#FFFFFF" stroke-width="0.8" fill="none" stroke-linecap="round"/>` + E(x + 9, y - 32, 2.6, 2.1, "#E9F8FF", 0.8) + P2(`M${x + 11.2},${y - 32.8} L${x + 15},${y - 31.8} L${x + 11.2},${y - 31} Z`, "#BFE7F7", 0.6) + E(x + 9.6, y - 32.6, 0.45, 0.45, ICE.right, 0);
      s += [[-15, 5, 0], [14, 6, 1], [-6, 9, 2]].map(([dx, dy, k]) => P2(`M${r23(bx + dx)},${r23(by + dy)} l${1.2 + k * 0.3},-2 l1.1,1.8 Z`, k % 2 ? ICE.right : ICE.left, 0.45)).join("");
      return s + (f ? [[x - 12, y - 18, 1.8], [x + 13, y - 24, 1.4], [x + 3, y - 4, 1.2]] : [[x - 6, y - 24, 1.4], [x + 12, y - 12, 1.8], [bx - 10, by - 7, 1.2]]).map(([a, b, r]) => givre(a, b, r)).join("");
    }, "draw") };
    var LAINE = { fond: "#FAF6EE", ombre: "#E6DECD", tete: "#5E5660" };
    function mouton(x, y, k, dir, broute) {
      const bl = [[-4.4, -5, 3.2], [-1, -6.8, 3.4], [2.6, -5.8, 3.2], [-2.6, -3.2, 3], [1.4, -3, 3]].map(([a, b, r3]) => [a * k, b * k, r3 * k]);
      let o = `<g transform="translate(${r23(x)} ${r23(y)}) scale(${dir} 1)">`;
      o += [[-3.4, 0.2], [-1.4, 0.8], [1.6, 0.2], [3.4, 0.8]].map(([a, b]) => L([a * k, -2 * k], [a * k, b * k], LAINE.tete, 1.2 * k)).join("");
      o += bl.map(([a, b, r3]) => E(a, b, r3 + 0.8, r3 * 0.92 + 0.8, OUT3, 0)).join("") + bl.map(([a, b, r3]) => E(a, b, r3, r3 * 0.92, LAINE.fond, 0)).join("") + bl.slice(3).map(([a, b, r3]) => E(a + r3 * 0.25, b + r3 * 0.35, r3 * 0.6, r3 * 0.35, LAINE.ombre, 0)).join("") + E(-2 * k, -8 * k, 1.6 * k, 0.8 * k, "#FFFFFF", 0);
      const hx = 5.2 * k, hy = (broute ? -1.6 : -6.8) * k, ex = hx + 0.75 * k, ey = hy - 0.45 * k, r = 0.75 * k;
      o += E(hx - 2.1 * k, hy - 1 * k, 1.6 * k, 0.75 * k, LAINE.tete, 0.6) + E(hx - 2.35 * k, hy - 1 * k, 0.8 * k, 0.35 * k, "#8A7A80", 0) + E(hx, hy, 2.9 * k, 2.7 * k, LAINE.tete, 0.8) + E(hx + 1.3 * k, hy + 0.95 * k, 1.35 * k, 1 * k, "#4E4650", 0) + E(ex, ey, r * 0.86, r * 1.12, "#2A2420", 0) + E(ex + r * 0.3, ey - r * 0.44, r * 0.38, r * 0.38, "#FFFFFF", 0) + E(ex - r * 0.3, ey + r * 0.5, r * 0.17, r * 0.17, "#FFFFFF", 0) + E(hx + 0.1 * k, hy + 1.05 * k, 0.7 * k, 0.35 * k, "#F7A8B0", 0) + E(hx - 0.7 * k, hy - 2.2 * k, 1.7 * k, 1.05 * k, LAINE.fond, 0.6);
      return o + (broute ? herbe(hx + 1.7 * k, hy + 2.6 * k, "#86B852", 0.4 * k) : "") + "</g>";
    }
    __name(mouton, "mouton");
    C2.parc = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const R = 0.42, H = 9, cos = Math.cos, sin = Math.sin;
      let s = shadow2(0, 0, 0.5, 0.08) + disc2(0, 0, 0.47, 0, "#A8D878", 0.7);
      for (const [u, v, c, k] of [[-0.24, 0.12, "#86B852", 0.6], [0.26, -0.14, "#94C25C", 0.55], [0.04, 0.3, "#86B852", 0.5], [-0.1, -0.28, "#94C25C", 0.5]]) {
        const [hx, hy] = at(u, v);
        s += herbe(hx, hy, c, k);
      }
      {
        const [fx, fy] = at(0.22, 0.22);
        s += fleurette(fx, fy, "#FFFFFF") + fleurette(fx + 5, fy - 1.4, "#F7B6C8");
      }
      const angles = Array.from({ length: 12 }, (_, i) => i / 12 * TAU2 + 0.12), P0 = 0, P1 = 1;
      const pts3 = angles.map((t2) => [cos(t2) * R, sin(t2) * R]), fond = /* @__PURE__ */ __name(([u, v]) => u + v < 0, "fond");
      const piquet = /* @__PURE__ */ __name(([u, v]) => post2(u, v, 0, H, WOOD2, 0.022), "piquet");
      const lisses = /* @__PURE__ */ __name((i, j) => rail2(pts3[i], pts3[j], 3.4, 1.2, WOOD2.left) + rail2(pts3[i], pts3[j], 7, 1.2, WOOD2.left), "lisses");
      const travees = pts3.map((_, i) => [i, (i + 1) % 12]).filter(([i]) => i !== P0);
      s += travees.filter(([i, j]) => fond(pts3[i]) && fond(pts3[j])).map(([i, j]) => lisses(i, j)).join("") + pts3.filter(fond).map(piquet).join("");
      s += box2(-0.14, -0.36, 0.12, -0.26, 0, 4.4, WOOD2, 0.8);
      {
        const [rx, ry] = at(-0.01, -0.31, 4.4);
        s += P2(`M${r23(rx - 8)},${r23(ry + 1)} Q${r23(rx - 6)},${r23(ry - 4)} ${r23(rx - 1)},${r23(ry - 3.4)} Q${r23(rx + 4)},${r23(ry - 5)} ${r23(rx + 7)},${r23(ry - 1)} Q${r23(rx)},${r23(ry + 3)} ${r23(rx - 8)},${r23(ry + 1)} Z`, "#EBC75A", 0.7) + `<path d="M${r23(rx - 5)},${r23(ry - 1)} l2,-2.4 M${r23(rx - 1)},${r23(ry - 1.4)} l1,-2.6 M${r23(rx + 3)},${r23(ry - 1.2)} l1.6,-2.2" stroke="#C9A23E" stroke-width="0.5"/>`;
      }
      const [m1x, m1y] = at(-0.1, -0.06), [m2x, m2y] = at(0.14, 0.08), [ax, ay] = at(-0.2, 0.16);
      s += mouton(m1x, m1y, 1, 1, f === 0) + mouton(m2x, m2y, 1, -1, f === 1) + mouton(ax, ay, 0.68, 1, false);
      s += travees.filter(([i, j]) => !(fond(pts3[i]) && fond(pts3[j]))).map(([i, j]) => lisses(i, j)).join("") + pts3.filter((p) => !fond(p)).map(piquet).join("");
      const g0 = pts3[P1], t = angles[P1] - 0.9, g1 = [g0[0] + cos(t) * 0.24, g0[1] + sin(t) * 0.24];
      s += post2(g1[0], g1[1], 0.4, 7.8, WOOD2, 0.016) + rail2(g0, g1, 2.8, 1.1, WOOD2.top) + rail2(g0, g1, 6.6, 1.1, WOOD2.top) + `<path d="M${at(g0[0], g0[1], 2.8).map(r23).join(",")} L${at(g1[0], g1[1], 6.6).map(r23).join(",")}" stroke="${WOOD2.right}" stroke-width="0.9"/>`;
      return s;
    }, "draw") };
    var PIERRES_CAIRN = [["#B9B2A6", "#D8D2C6", "#8E877B"], ["#A9A69F", "#CBC8C0", "#817E77"], ["#BDB4A2", "#DCD3C1", "#938A78"]];
    var galetCairn = /* @__PURE__ */ __name((x, y, rx, ry, [c, l, d]) => P2(`M${r23(x - rx)},${r23(y)} Q${r23(x - rx)},${r23(y - ry * 1.5)} ${r23(x)},${r23(y - ry * 1.6)} Q${r23(x + rx)},${r23(y - ry * 1.5)} ${r23(x + rx)},${r23(y)} Q${r23(x + rx * 0.9)},${r23(y + ry * 0.9)} ${r23(x)},${r23(y + ry)} Q${r23(x - rx * 0.9)},${r23(y + ry * 0.9)} ${r23(x - rx)},${r23(y)} Z`, c, 0.9) + `<path d="M${r23(x - rx * 0.7)},${r23(y + ry * 0.45)} Q${r23(x)},${r23(y + ry * 1.05)} ${r23(x + rx * 0.85)},${r23(y + ry * 0.2)} Q${r23(x + rx * 0.8)},${r23(y + ry * 0.7)} ${r23(x)},${r23(y + ry * 0.92)} Q${r23(x - rx * 0.6)},${r23(y + ry * 0.8)} ${r23(x - rx * 0.7)},${r23(y + ry * 0.45)} Z" fill="${d}"/>` + E(x - rx * 0.3, y - ry * 0.75, rx * 0.45, ry * 0.4, l, 0), "galetCairn");
    C2.cairn = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      let s = shadow2(0, 0, 0.3, 0.12);
      s += [[-14, 3, 2.2, 0], [12, 4, 1.8, 2], [-9, 6, 1.5, 1], [16, 1, 1.4, 0]].map(([dx, dy, r, k]) => galetCairn(x + dx, y + dy, r * 1.3, r * 0.7, PIERRES_CAIRN[k])).join("");
      const pile = [[0, 0, 12.4, 4.2, 0], [1.4, -7, 9.6, 3.6, 2], [-1, -12.8, 8, 3.2, 1], [1.2, -18, 6.2, 2.8, 0], [0, -22.4, 4.4, 2.2, 2]];
      for (const [dx, dy, rx, ry, k] of pile) s += galetCairn(x + dx, y + dy, rx, ry, PIERRES_CAIRN[k]);
      const mousse = [[-9.6, 0.4, 2.2], [-6.8, -0.6, 2.4], [-4.6, 1.2, 1.8], [-8, 2, 1.8]];
      s += mousse.map(([dx, dy, r]) => E(x + dx, y + dy, r + 0.6, r * 0.8 + 0.6, OUT3, 0)).join("") + mousse.map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, "#8FCB6A", 0)).join("") + E(x - 7.4, y - 1.4, 1.2, 0.6, "#B3E386", 0) + E(x - 10, y - 0.4, 0.8, 0.4, "#B3E386", 0);
      s += fleurette(x - 15, y + 7, "#FFFFFF") + fleurette(x + 9, y + 8, "#F7B6C8");
      const rubans = [[3.6, -9.6, "#E8566A", 16], [3, -15.4, "#F2C04B", 13], [2, -20.4, "#5C8FD0", 11]];
      rubans.forEach(([dx, dy, c, len], i) => {
        const kx = x + dx + 5, ky = y + dy, a = wave2(f, 2, 2.2, i * 1.9);
        const d = `M${r23(kx)},${r23(ky)} q${r23(len * 0.3)},${r23(-2 + a * 0.4)} ${r23(len * 0.55)},${r23(a * 0.5)} t${r23(len * 0.45)},${r23(-1 + a)}`;
        s += thick(d, 1.5, c) + P2(`M${r23(kx + len - 0.4)},${r23(ky - 1 + a * 1.5 - 0.9)} l2.6,-0.6 l-1.2,1.5 l1.2,1.5 l-2.6,-0.6 Z`, c, 0.6) + E(kx, ky, 1.5, 1.2, c, 0.7);
      });
      return s;
    }, "draw") };
    var ROSEAU = { top: "#DCC680", left: "#C2A65A", right: "#9E8440", lien: "#7A5E2A" };
    var jonc = /* @__PURE__ */ __name((x, y, k) => thick(`M${r23(x - 2 * k)},${r23(y)} q-1,-5 -3,-8 M${r23(x)},${r23(y)} q0.4,-7 1,-11 M${r23(x + 2 * k)},${r23(y)} q1.6,-4 3.8,-6.4`, 0.7, "#7EC45B") + E(x + 0.9, y - 12 * k, 0.9, 2.2 * k, "#8A5A34", 0.6), "jonc");
    var libellule = /* @__PURE__ */ __name((x, y, dir) => `<g transform="translate(${r23(x)} ${r23(y)}) scale(${dir} 1)">` + [[-1, -1.8, -20], [-1, 1.8, 20], [1.4, -1.6, -35], [1.4, 1.6, 35]].map(([dx, dy, r]) => `<ellipse cx="${dx}" cy="${dy}" rx="3.4" ry="1.1" transform="rotate(${r} ${dx} ${dy})" fill="#EAF6FB" fill-opacity="0.85" stroke="${OUT3}" stroke-width="0.4"/>`).join("") + L([-6, 0], [2, 0], "#2F8FA0", 1.2) + E(3, 0, 1.3, 1.1, "#2F8FA0", 0.5) + E(3.4, -0.4, 0.4, 0.4, "#FFFFFF", 0) + "</g>", "libellule");
    C2.passerelle = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bord = Array.from({ length: 16 }, (_, i) => {
        const t = i / 16 * TAU2, r = 1 + (i % 2 ? 0.05 : -0.04) + (i % 5 ? 0 : 0.05);
        return [x + Math.cos(t) * 41 * r, y + 1 + Math.sin(t) * 18 * r];
      });
      const mil = /* @__PURE__ */ __name((i) => {
        const p = bord[i % 16], q = bord[(i + 1) % 16];
        return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
      }, "mil");
      let mare = `M${mil(15)}`;
      for (let i = 0; i < 16; i++) mare += ` Q${r23(bord[i][0])},${r23(bord[i][1])} ${mil(i)}`;
      let s = P2(`${mare} Z`, "#7FC2C6", 0.8) + E(x - 6, y - 2, 28, 10, "#A6DAD6", 0);
      s += nenuphar(x - 26, y + 6, 3.6, 0.6) + nenuphar(x + 24, y - 6, 3, 3.6) + nenuphar(x - 18, y - 9, 2.6, 2) + jonc(x - 30, y - 4, 1) + jonc(x + 30, y + 2, 0.9);
      const pilotis = /* @__PURE__ */ __name((v) => [-0.4, 0, 0.4].map((u) => {
        const [px, py] = at(u, v, 0);
        return E(px, py + 0.6, 3.6, 1.4, "none", 0).replace('stroke="none"', 'stroke="#E8F6FF" stroke-width="0.6"') + cylinder2(u, v, 0.026, -0.6, 12, WOOD2, 0.8);
      }).join(""), "pilotis");
      s += pilotis(-0.18) + box2(-0.46, -0.15, 0.46, 0.15, 5.6, 7.6, ROSEAU);
      for (let v = -0.12; v < 0.14; v += 0.04) s += L(at(-0.46, v, 7.6), at(0.46, v, 7.6), ROSEAU.right, 0.4);
      s += L(at(-0.46, 0.15, 6.6), at(0.46, 0.15, 6.6), ROSEAU.right, 0.4);
      for (let v = -0.12; v < 0.14; v += 0.05) {
        const [ex, ey] = at(0.46, v, 6.6);
        s += E(ex, ey, 0.8, 0.7, ROSEAU.top, 0.4);
      }
      for (const u of [-0.34, -0.11, 0.11, 0.34]) s += L(at(u, -0.15, 7.6), at(u, 0.15, 7.6), ROSEAU.lien, 0.9) + L(at(u, 0.15, 7.6), at(u, 0.15, 5.6), ROSEAU.lien, 0.9) + L(at(u + 0.02, -0.15, 7.6), at(u + 0.02, 0.15, 7.6), ROSEAU.lien, 0.6);
      s += pilotis(0.18);
      const corde = /* @__PURE__ */ __name((v) => [[-0.4, 0], [0, 0.4]].map(([a, b]) => {
        const p = at(a, v, 11), q = at(b, v, 11);
        const d = `M${r23(p[0])},${r23(p[1])} Q${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2 + 4)} ${r23(q[0])},${r23(q[1])}`;
        return `<path d="${d}" stroke="${OUT3}" stroke-width="1.8" fill="none"/><path d="${d}" stroke="#D8B878" stroke-width="0.9" fill="none"/>`;
      }).join(""), "corde");
      s += corde(0.18) + jonc(x + 6, y + 15, 0.8);
      return s + (f ? libellule(x + 14, y - 30, -1) : libellule(x - 6, y - 26, 1));
    }, "draw") };
    var BOIS_HERON = { light: "#E7B57A", mid: "#C68A50", dark: "#9A6534", grain: "#875A2E" };
    C2.heron = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), c = BOIS_HERON;
      let s = shadow2(0, 0, 0.32, 0.1) + E(x, y + 2, 21, 8.6, "#8FC8E0", 0.8) + E(x - 3, y + 1, 13, 4.6, "#B4DCEC", 0);
      s += [[-19, 3, 2.4], [-14, 7.6, 2], [-6, 10, 2.4], [4, 10.4, 2.2], [12, 8.6, 2.4], [19, 4.4, 2]].map(([dx, dy, r], i) => E(x + dx, y + dy, r, r * 0.6, i % 2 ? "#BDB4A2" : "#A9A69F", 0.6)).join("");
      s += E(x + 6, y + 3, 4 + f * 2, 1.4 + f * 0.8, "none", 0).replace('stroke="none"', `stroke="#E8F6FF" stroke-width="0.6" opacity="${f ? 0.5 : 0.9}"`);
      s += P2(`M${x - 6},${y + 1.6} Q${x - 6},${y - 1.8} ${x - 1},${y - 2.2} Q${x + 4},${y - 1.8} ${x + 4},${y + 1.4} Q${x - 1},${y + 3} ${x - 6},${y + 1.6} Z`, "#A9A69F", 0.8) + E(x - 2.4, y - 0.8, 2, 0.8, "#CBC8C0", 0);
      s += thick(`M${x - 1},${y - 1.4} L${x - 1.4},${y - 9} L${x - 0.6},${y - 18}`, 0.9, c.dark) + thick(`M${x + 1},${y - 18} L${x + 3.6},${y - 13.6} L${x + 0.6},${y - 12}`, 0.7, c.dark);
      s += P2(`M${x - 12},${y - 21} Q${x - 6},${y - 16.4} ${x + 1},${y - 16.6} Q${x + 8},${y - 17.6} ${x + 8},${y - 24} Q${x + 7},${y - 30} ${x},${y - 30} Q${x - 6},${y - 29.4} ${x - 12},${y - 21} Z`, c.mid, 1) + `<path d="M${x - 9},${y - 19.4} Q${x},${y - 16} ${x + 7.4},${y - 21}" stroke="${c.dark}" stroke-width="1.4" fill="none"/><path d="M${x - 4},${y - 28.4} Q${x + 2},${y - 30} ${x + 5.6},${y - 27}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
      s += P2(`M${x - 9},${y - 21.6} Q${x - 3},${y - 29} ${x + 5},${y - 26.4} Q${x + 1},${y - 21.6} ${x - 9},${y - 21.6} Z`, c.light, 0.8) + `<path d="M${x - 5},${y - 22} q1.4,-2 3,-1 M${x - 1.4},${y - 22.4} q1.4,-2 3,-1 M${x + 2},${y - 23.4} q1,-1.6 2.4,-0.8" stroke="${c.grain}" stroke-width="0.55" fill="none"/>`;
      const [hx, hy, ang] = f ? [x + 11, y - 35, 28] : [x + 7, y - 42, -6];
      s += thick(`M${x + 4},${y - 28} Q${x + 10},${y - 31} ${x + 6},${y - 35} Q${r23((x + 6 + hx) / 2 - 2)},${r23((y - 35 + hy) / 2)} ${hx},${hy + 2}`, 2.2, c.mid);
      s += `<g transform="rotate(${ang} ${hx} ${hy})"><path d="M${hx - 2},${hy - 1.6} q-3,-2 -6,-1.2 M${hx - 2},${hy - 0.8} q-3,-0.6 -5.4,0.6" stroke="${OUT3}" stroke-width="0.7" fill="none" stroke-linecap="round"/>` + E(hx, hy, 3.2, 2.7, c.mid, 0.9) + P2(`M${hx + 2.6},${hy - 0.8} L${hx + 12},${hy + 0.4} L${hx + 2.6},${hy + 1.2} Z`, "#E6B14C", 0.7) + E(hx + 0.6, hy - 0.6, 0.65, 0.65, OUT3, 0) + E(hx + 0.8, hy - 0.8, 0.22, 0.22, "#FFFFFF", 0) + "</g>";
      const [gx, gy] = [x + 13, y + 3];
      s += nenuphar(gx, gy, 4.4, 2.4) + E(gx, gy - 2, 3, 2, "#7FBF55", 0.7) + E(gx - 1.4, gy - 3.8, 1.1, 1, "#7FBF55", 0.6) + E(gx + 1.4, gy - 3.8, 1.1, 1, "#7FBF55", 0.6) + E(gx - 1.4, gy - 4, 0.45, 0.45, OUT3, 0) + E(gx + 1.4, gy - 4, 0.45, 0.45, OUT3, 0) + `<path d="M${gx - 1.2},${gy - 1.8} q1.2,0.9 2.4,0" stroke="${OUT3}" stroke-width="0.45" fill="none"/>`;
      return s;
    }, "draw") };
    var TOILE = { creme: "#F6E9D0", rouge: "#D2583F", cremeO: "#DCCDB0", rougeO: "#A84030" };
    C2.tente = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const q = /* @__PURE__ */ __name((A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], "q");
      const raye = /* @__PURE__ */ __name((A, B, C22, D, n, c1, c2) => {
        let o = "";
        for (let i = 0; i < n; i++) o += poly3([q(A, B, i / n), q(A, B, (i + 1) / n), q(D, C22, (i + 1) / n), q(D, C22, i / n)], i % 2 ? c2 : c1, 0);
        return o;
      }, "raye");
      let s = shadow2(0, 0, 0.52, 0.12);
      {
        const a1 = at(-0.34, -0.05, 25), a2 = at(-0.5, 0.06, 0);
        s += L(a1, a2, "#8A6A40", 0.6) + L(a2, [a2[0], a2[1] - 3], WOOD2.right, 1);
      }
      const E0 = at(0.4, 0.26, 8), E1 = at(0.4, -0.36, 8), R1 = at(0.32, -0.05, 26), G0 = at(0.4, 0.26, 0), G1 = at(0.4, -0.36, 0);
      s += raye(G0, G1, E1, E0, 6, TOILE.cremeO, TOILE.rougeO) + poly3([G0, G1, E1, E0], "none", 0.9);
      s += poly3([E0, E1, R1], TOILE.cremeO, 0.9) + `<path d="M${q(E0, E1, 0.5).map(r23).join(",")} L${R1.map(r23).join(",")}" stroke="${TOILE.rougeO}" stroke-width="2.4"/>` + poly3([E0, E1, R1], "none", 0.9);
      const F0 = at(-0.4, 0.26, 0), F1 = at(0.4, 0.26, 0), F2 = at(0.4, 0.26, 8), F3 = at(-0.4, 0.26, 8);
      s += raye(F0, F1, F2, F3, 8, TOILE.creme, TOILE.rouge) + poly3([F0, F1, F2, F3], "none", 0.9);
      s += poly3([at(-0.17, 0.26, 0), at(0.17, 0.26, 0), at(0.17, 0.26, 7.4), at(-0.17, 0.26, 7.4)], "#4A3226", 0.8);
      {
        const [cx, cy] = at(0, 0.26, 0), [lx, ly] = at(0, 0.26, 6);
        s += L([lx, ly - 1], [lx, ly + 1.4], BRASS2.right, 0.5) + E(lx, ly + 2.6, 1.3, 1.6, "#FFD27A", 0.5) + E(cx - 3, cy - 2, 3.4, 1.8, "#5C8FD0", 0.6) + E(cx + 3, cy - 1.6, 3, 1.6, "#F2C04B", 0.6);
      }
      for (const k2 of [-1, 1]) {
        const a1 = at(0.17 * k2, 0.26, 7.4), a2 = at(0.09 * k2, 0.26, 7.4), a3 = at(0.19 * k2, 0.26, 0.6);
        s += poly3([a1, a2, a3], TOILE.creme, 0.8) + L(q(a2, a3, 0.55), q(a1, a3, 0.55), TOILE.rouge, 0.9);
      }
      const T0 = at(-0.4, 0.26, 8), T1 = at(0.4, 0.26, 8), R0 = at(-0.32, -0.05, 26);
      s += raye(T0, T1, R1, R0, 8, TOILE.creme, TOILE.rouge) + poly3([T0, T1, R1, R0], "none", 1) + L(R0, R1, OUT3, 1.2);
      const k = wave2(f, 2, 1.2);
      s += L(R1, [R1[0], R1[1] - 9], WOOD2.right, 1.1) + P2(`M${r23(R1[0])},${r23(R1[1] - 9)} Q${r23(R1[0] + 4)},${r23(R1[1] - 10 + k)} ${r23(R1[0] + 8)},${r23(R1[1] - 8 - k)} L${r23(R1[0])},${r23(R1[1] - 5)} Z`, "#5C8FD0", 0.6);
      const K0 = at(-0.26, 0.3, 0), K1 = at(0.26, 0.3, 0), K2 = at(0.26, 0.54, 0), K3 = at(-0.26, 0.54, 0);
      s += poly3([K0, K1, K2, K3], "#B8402E", 0.8) + poly3([q(K0, K2, 0.12), q(K1, K3, 0.12), q(K0, K2, 0.88), q(K1, K3, 0.88)], "#E8B04A", 0);
      for (const t of [0.3, 0.5, 0.7]) {
        const [mx, my] = q(q(K0, K3, 0.5), q(K1, K2, 0.5), t);
        s += `<path d="M${r23(mx)},${r23(my - 2.2)} l3,2.2 l-3,2.2 l-3,-2.2 Z" fill="#3E5A8C"/>`;
      }
      for (let i = 0; i <= 6; i++) {
        const [mx, my] = q(K3, K2, i / 6);
        s += L([mx, my], [mx - 0.6, my + 1.6], "#E8B04A", 0.6);
      }
      for (let i = 0; i <= 8; i++) {
        const [mx, my] = q(T0, T1, i / 8), sw = wave2(f, 2, 0.8, i);
        s += L([mx, my], [mx + sw, my + 2.4], OUT3, 0.5) + E(mx + sw, my + 3, 0.9, 0.9, i % 2 ? "#E8B04A" : "#5C8FD0", 0.4);
      }
      const [px, py] = at(-0.12, 0.42, 0);
      s += E(px, py - 2.6, 2.6, 2.2, BRASS2.left, 0.7) + P2(`M${r23(px + 2.2)},${r23(py - 3)} q2.6,-0.6 3.2,-2.6`, "none", 0.8) + E(px, py - 5, 1, 0.6, BRASS2.top, 0.5) + E(px - 0.8, py - 3.2, 0.8, 0.6, BRASS2.top, 0) + [[-6, 1], [-3.6, 2]].map(([dx, dy]) => P2(`M${r23(px + dx - 1)},${r23(py + dy - 3)} L${r23(px + dx + 1)},${r23(py + dy - 3)} L${r23(px + dx + 0.7)},${r23(py + dy)} L${r23(px + dx - 0.7)},${r23(py + dy)} Z`, "#E8F6FF", 0.5)).join("") + `<path d="M${r23(px + 5.4)},${r23(py - 6 - f)} q1.2,-1.6 0,-3.2 q-1.2,-1.6 0,-3.2" stroke="#FFFFFF" stroke-width="0.8" fill="none" opacity="0.8"/>`;
      const [jx, jy] = at(0.4, 0.44, 0);
      return s + P2(`M${jx - 3},${jy} Q${jx - 5.4},${jy - 6} ${jx - 2.2},${jy - 9} L${jx + 2.2},${jy - 9} Q${jx + 5.4},${jy - 6} ${jx + 3},${jy} Z`, "#D9824A", 0.9) + E(jx, jy - 9, 2.4, 0.9, "#B86A36", 0.6) + `<path d="M${jx - 3.6},${jy - 5} Q${jx},${jy - 3.6} ${jx + 3.6},${jy - 5}" stroke="#F2C27A" stroke-width="0.8" fill="none"/>`;
    }, "draw") };
    var SEL = { top: "#FFFDF9", left: "#EEE7DD", right: "#D6CCBF" };
    C2.cadransel = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bord = Array.from({ length: 12 }, (_, i) => {
        const t = i / 12 * TAU2, r = 1 + (i % 2 ? 0.05 : -0.04);
        return [x + Math.cos(t) * 36 * r, y + 1 + Math.sin(t) * 15 * r];
      });
      const mil = /* @__PURE__ */ __name((i) => {
        const p = bord[i % 12], q = bord[(i + 1) % 12];
        return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
      }, "mil");
      let croute = `M${mil(11)}`;
      for (let i = 0; i < 12; i++) croute += ` Q${r23(bord[i][0])},${r23(bord[i][1])} ${mil(i)}`;
      let s = shadow2(0, 0, 0.42, 0.1) + `<path d="${croute} Z" fill="#F8F2EA" stroke="#E0D3C4" stroke-width="1.2"/>`;
      s += `<path d="M${x - 30},${y + 2} l5,-3 l6,1 l3,-4 M${x - 19},${y - 4} l-2,-5 M${x - 25},${y - 1} l-3,5 l5,4 l7,-1 M${x + 22},${y + 6} l5,-3 l6,0 M${x + 27},${y + 3} l2,-6 l-4,-4 M${x + 8},${y + 12} l5,1 l3,-3 M${x - 8},${y + 13} l-4,-2" stroke="#E0D3C4" stroke-width="0.8" fill="none" stroke-linejoin="round"/>`;
      s += cylinder2(0, 0, 0.34, 0, 4.6, SEL);
      for (const t of [0.35, 0.8, 1.25, 1.7, 2.15, 2.6]) {
        const [fx, fy] = at(Math.cos(t) * 0.34, Math.sin(t) * 0.34, 0.6);
        s += L([fx, fy], [fx, fy - 4.6], SEL.right, 0.5);
      }
      const [dx, dy] = at(0, 0, 4.6), rx = 0.34 * 56, ry = 0.34 * 28;
      s += E(dx, dy, rx * 0.84, ry * 0.84, "none", 0).replace('stroke="none"', 'stroke="#CDBFAE" stroke-width="0.7"');
      for (let i = 0; i < 12; i++) {
        const t = i / 12 * TAU2, c = Math.cos(t), sn = Math.sin(t);
        s += P2(`M${r23(dx + c * rx * 0.86)},${r23(dy + sn * ry * 0.86)} L${r23(dx + c * rx * 0.97 - sn * 0.8)},${r23(dy + sn * ry * 0.97 + c * 0.4)} L${r23(dx + c * rx * 0.97 + sn * 0.8)},${r23(dy + sn * ry * 0.97 - c * 0.4)} Z`, "#CDBFAE", 0);
      }
      for (let i = 0; i < 8; i++) {
        const t = i / 8 * TAU2;
        s += L([dx + Math.cos(t) * 2.8, dy + Math.sin(t) * 1.4], [dx + Math.cos(t) * 4.2, dy + Math.sin(t) * 2.1], "#CDBFAE", 0.5);
      }
      s += E(dx, dy, 2, 1, "#E8DCCC", 0.4);
      const sa = f ? 0.8 : -0.3;
      s += `<path d="M${dx},${dy} L${r23(dx + Math.cos(sa - 0.1) * rx * 0.9)},${r23(dy + Math.sin(sa - 0.1) * ry * 0.9)} L${r23(dx + Math.cos(sa + 0.1) * rx * 0.9)},${r23(dy + Math.sin(sa + 0.1) * ry * 0.9)} Z" fill="rgba(90,70,50,0.32)"/>`;
      const g0 = at(0, 0.13, 4.6), g1 = at(0, -0.12, 4.6), g2 = at(0, -0.12, 14.4), g3 = at(0.018, -0.12, 14.4), g4 = at(0.018, 0.13, 4.6);
      s += poly3([g0, g1, g2], SANDSTONE.right, 0.8) + poly3([g0, g2, g3, g4], SANDSTONE.top, 0.7) + L(at(0, -0.04, 6.4), at(0, -0.1, 8.4), SANDSTONE.left, 0.6);
      const ROSE_SEL = { top: "#FFF6F2", left: "#F0D6CF", right: "#D4B4AA" }, cristal = /* @__PURE__ */ __name((u, v, w, h) => box2(u - w, v - w, u + w, v + w, 0, h, ROSE_SEL, 0.6), "cristal");
      s += cristal(0.38, 0.2, 0.026, 2.8) + cristal(0.43, 0.12, 0.018, 1.9) + cristal(0.33, 0.28, 0.016, 1.6) + cristal(-0.4, 0.16, 0.022, 2.4) + cristal(-0.34, 0.25, 0.015, 1.5);
      return s + (f ? [[x - 14, y - 6, 1.6], [x + 18, y + 1, 1.3], [x - 24, y + 4, 1.1]] : [[x + 10, y - 5, 1.5], [x - 18, y + 1, 1.2], [x + 26, y + 3, 1.3]]).map(([a, b, r]) => givre(a, b, r).replace("#FFFFFF", "#F4D67A")).join("");
    }, "draw") };
    var RAYURES = ["#E8566A", "#F2C04B", "#4FB3B0", "#F7EBD0", "#E8566A"];
    C2.hamac = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      let s = E(x, y + 2, 30, 11, "#EED9A8", 0) + shadow2(0, 0, 0.44, 0.1);
      const poteau = /* @__PURE__ */ __name((u, v) => {
        let o = cylinder2(u, v, 0.04, 0, 28, WOOD2, 0.9);
        for (const z of [6, 20, 23]) {
          const [px, py] = at(u, v, z);
          o += `<path d="M${r23(px - 3.2)},${r23(py)} Q${r23(px)},${r23(py + 1.6)} ${r23(px + 3.2)},${r23(py)}" stroke="${WOOD2.right}" stroke-width="0.8" fill="none"/>`;
        }
        const [bx, by] = at(u, v, 12.6);
        o += `<path d="M${r23(bx - 3.2)},${r23(by)} Q${r23(bx)},${r23(by + 1.6)} ${r23(bx + 3.2)},${r23(by)} L${r23(bx + 3.2)},${r23(by - 3)} Q${r23(bx)},${r23(by - 1.4)} ${r23(bx - 3.2)},${r23(by - 3)} Z" fill="#4FB3B0"/>`;
        const [tx, ty] = at(u, v, 28);
        return o + E(tx, ty - 2, 3, 3.2, WOOD2.left, 0.8) + E(tx - 0.9, ty - 3, 1, 1, WOOD2.top, 0);
      }, "poteau");
      s += poteau(-0.3, 0.3) + poteau(0.3, -0.3);
      const pa = at(-0.3, 0.3, 24), pb = at(0.3, -0.3, 24), sw = f ? 2 : -2;
      const a0 = [pa[0] + 7, pa[1] + 2], b0 = [pb[0] - 7, pb[1] + 2];
      for (const [p, q] of [[pa, a0], [pb, b0]]) s += `<path d="M${r23(p[0])},${r23(p[1])} L${r23(q[0])},${r23(q[1] - 3)} M${r23(p[0])},${r23(p[1])} L${r23(q[0])},${r23(q[1] + 3)}" stroke="#8A6A40" stroke-width="0.6"/>` + L([q[0], q[1] - 3.4], [q[0], q[1] + 3.4], WOOD2.right, 1.4);
      const mx = (a0[0] + b0[0]) / 2 + sw, my = (a0[1] + b0[1]) / 2;
      const courbe = /* @__PURE__ */ __name((t) => `M${r23(a0[0])},${r23(a0[1] - 3 + t * 6)} Q${r23(mx)},${r23(my + 9 + t * 16)} ${r23(b0[0])},${r23(b0[1] - 3 + t * 6)}`, "courbe");
      const bande = /* @__PURE__ */ __name((t0, t1) => `${courbe(t0)} L${r23(b0[0])},${r23(b0[1] - 3 + t1 * 6)} Q${r23(mx)},${r23(my + 9 + t1 * 16)} ${r23(a0[0])},${r23(a0[1] - 3 + t1 * 6)} Z`, "bande");
      RAYURES.forEach((c, i) => {
        s += `<path d="${bande(i / 5, (i + 1) / 5)}" fill="${c}"/>`;
      });
      s += `<path d="${bande(0, 1)}" fill="none" stroke="${OUT3}" stroke-width="1" stroke-linejoin="round"/>`;
      s += E(mx + 3, my + 7.4, 3, 2.2, "#F29A3A", 0.8) + E(mx + 1.8, my + 6.6, 1.4, 0.9, "#F8C060", 0) + E(mx + 4.6, my + 7.4, 1.4, 1.2, "#E2574C", 0) + P2(`M${r23(mx + 4)},${r23(my + 5.4)} q2,-2 4,-1 q-2,1.6 -4,1 Z`, "#6FAE4E", 0.5);
      for (let i = 1; i < 8; i++) {
        const t = i / 8, px = (1 - t) ** 2 * a0[0] + 2 * (1 - t) * t * mx + t * t * b0[0], py = (1 - t) ** 2 * (a0[1] + 3) + 2 * (1 - t) * t * (my + 25) + t * t * (b0[1] + 3);
        s += L([px, py], [px + sw * 0.3, py + 2.4], OUT3, 0.5) + E(px + sw * 0.3, py + 3, 0.8, 0.8, RAYURES[i % 3], 0.4);
      }
      const [hx, hy] = at(-0.3, 0.3, 0);
      return s + [[-8, -6, -30], [-3, -9, -8], [3, -8, 14], [7, -5, 34]].map(([dx, dy, r]) => `<g transform="translate(${r23(hx + 1)} ${r23(hy + 1)}) rotate(${r})">${P2(`M0,0 Q-2.4,${dy * 0.5} 0,${dy} Q2.4,${dy * 0.5} 0,0 Z`, "#6FAE4E", 0.6)}</g>`).join("");
    }, "draw") };
    C2.totem = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), w = 8.4, h = 13, y0 = y - 3;
      let s = shadow2(0, 0, 0.28, 0.12) + E(x, y + 1, 12, 4.6, "#9A7048", 0.8) + E(x - 3, y, 6, 2, "#B48A5E", 0) + [[-10, 2.6, 1.6], [9, 3, 1.4], [-6, 4.4, 1.2]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r * 0.8, "#A9A69F", 0.5)).join("");
      const troncon = /* @__PURE__ */ __name((i, c) => {
        const t = y0 - h * (i + 1);
        return `<rect x="${x - w}" y="${r23(t)}" width="${w * 2}" height="${h}" rx="3" fill="${c}" stroke="${OUT3}" stroke-width="1"/><rect x="${x + w * 0.45}" y="${r23(t + 1)}" width="${r23(w * 0.5)}" height="${h - 2}" rx="2" fill="#000000" opacity="0.14"/><rect x="${x - w + 1.4}" y="${r23(t + 1.6)}" width="1.6" height="${h - 3.2}" rx="0.8" fill="#FFFFFF" opacity="0.35"/>`;
      }, "troncon");
      const oeil = /* @__PURE__ */ __name((ex, ey, r, c = "#FFFFFF") => E(ex, ey, r, r * 0.9, c, 0.7) + E(ex, ey, r * 0.45, r * 0.45, OUT3, 0) + E(ex - r * 0.15, ey - r * 0.2, r * 0.15, r * 0.15, "#FFFFFF", 0), "oeil");
      const t0 = y0 - h * 0.5;
      s += E(x - w, t0 - 5.4, 2.6, 2.4, "#B8402E", 0.8) + E(x + w, t0 - 5.4, 2.6, 2.4, "#B8402E", 0.8) + troncon(0, "#C8503A");
      s += `<path d="M${x - 6},${t0 - 4.6} q2.4,-1.6 4.4,0 M${x + 1.6},${t0 - 4.6} q2.4,-1.6 4.4,0" stroke="${OUT3}" stroke-width="0.9" fill="none" stroke-linecap="round"/>` + oeil(x - 3.6, t0 - 2.2, 1.6) + oeil(x + 3.6, t0 - 2.2, 1.6) + E(x, t0 + 2.6, 4.2, 2.8, "#F2C27A", 0.8) + E(x, t0 + 1.6, 1.6, 1.1, OUT3, 0) + `<path d="M${x - 2},${t0 + 3.6} q2,1.6 4,0" stroke="${OUT3}" stroke-width="0.7" fill="none"/>`;
      const t1 = y0 - h * 1.5;
      s += troncon(1, "#3FA7A0") + E(x - 4, t1 - 2.4, 3.2, 3, "#F2C04B", 0.8) + E(x + 4, t1 - 2.4, 3.2, 3, "#F2C04B", 0.8) + oeil(x - 4, t1 - 2.4, 2) + oeil(x + 4, t1 - 2.4, 2) + P2(`M${x - 6},${t1 + 2.4} Q${x},${t1 + 6.6} ${x + 6},${t1 + 2.4} Q${x},${t1 + 4.4} ${x - 6},${t1 + 2.4} Z`, "#E8566A", 0.7);
      const t2 = y0 - h * 2.5;
      s += troncon(2, "#F2C04B") + `<path d="M${x - 6.4},${t2 - 4.4} L${x - 1.4},${t2 - 2.6} M${x + 6.4},${t2 - 4.4} L${x + 1.4},${t2 - 2.6}" stroke="${OUT3}" stroke-width="1.4" stroke-linecap="round"/>` + oeil(x - 3.6, t2 - 1, 1.7) + oeil(x + 3.6, t2 - 1, 1.7) + P2(`M${x - 2.6},${t2 + 0.6} L${x + 2.6},${t2 + 0.6} Q${x + 3},${t2 + 5.4} ${x},${t2 + 7} Q${x + 0.6},${t2 + 4} ${x - 2.6},${t2 + 0.6} Z`, "#E8803A", 0.8);
      const ya = y0 - h * 3 + 2.6, ang = f ? -10 : 4;
      const aile = /* @__PURE__ */ __name((k) => `<g transform="rotate(${ang * k} ${x + w * k} ${ya})">` + P2(`M${x + w * k},${ya + 4} L${x + (w + 15) * k},${ya - 8} L${x + (w + 12) * k},${ya - 3} L${x + (w + 14) * k},${ya - 1} L${x + (w + 10) * k},${ya + 2} L${x + (w + 11) * k},${ya + 4.4} Z`, "#F7EBD0", 0.9) + `<path d="M${x + (w + 2) * k},${ya + 2.4} L${x + (w + 13) * k},${ya - 6} M${x + (w + 2) * k},${ya + 3.4} L${x + (w + 11) * k},${ya - 0.4}" stroke="#E8566A" stroke-width="1.1"/>` + E(x + (w + 3) * k, ya + 1.6, 1.6, 1.4, OUT3, 0) + "</g>", "aile");
      return s + aile(-1) + aile(1) + P2(`M${x - 5},${ya + 0.4} Q${x},${ya - 7} ${x + 5},${ya + 0.4} Z`, "#E8566A", 0.8);
    }, "draw") };
    var BASALTE = { top: "#5A5266", left: "#3A3644", right: "#26232E" };
    C2.obelisque = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), g = f ? "#FFB066" : "#E8573A", braise = f ? "#FF8A4A" : "#C8401E";
      let s = E(x, y + 2, 24, 9.4, "#4A4452", 0.8) + E(x - 4, y + 1, 14, 4.6, "#5A5266", 0);
      s += `<path d="M${x - 20},${y + 4} l5,-1.4 l3,2 l5,-0.6 M${x + 10},${y + 7} l4,-2 l5,0.4 M${x + 6},${y - 3} l5,-1.6" stroke="${braise}" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + [[-14, 6, 0], [15, 2, 1], [-17, 0, 1]].map(([dx, dy, k]) => P2(`M${x + dx},${y + dy} l1.4,-3.4 l1.6,3 Z`, k ? OBSIDIAN.top : OBSIDIAN.left, 0.5)).join("");
      s += shadow2(0, 0, 0.22, 0.12) + box2(-0.15, -0.15, 0.15, 0.15, 0, 2.6, BASALTE) + box2(-0.115, -0.115, 0.115, 0.115, 2.6, 4.6, BASALTE);
      const b = 0.085, t = 0.05, z0 = 4.6, z1 = 44, z2 = 52;
      s += poly3([at(-b, b, z0), at(b, b, z0), at(t, t, z1), at(-t, t, z1)], OBSIDIAN.left, 1) + poly3([at(b, b, z0), at(b, -b, z0), at(t, -t, z1), at(t, t, z1)], OBSIDIAN.right, 1) + poly3([at(-t, t, z1), at(t, t, z1), at(0, 0, z2)], "#55506A", 0.9) + poly3([at(t, t, z1), at(t, -t, z1), at(0, 0, z2)], OBSIDIAN.right, 0.9) + L(at(-b + 0.02, b, z0 + 3), at(-t + 0.012, t, z1 - 2), "#8E84A6", 0.9) + L(at(-t + 8e-3, t, z1 + 1), at(-4e-3, 4e-3, z2 - 2), "#A79DC0", 0.7);
      const [gx] = at(0.03, b - 0.012, 0);
      const signes = [`M${gx - 3.2},${y - 38} q1.6,-1.6 2,0.4 q0,1.6 -1.6,1.2`, `M${gx - 4.2},${y - 28} l1.4,-3 l1.4,3 Z`, `M${gx - 4.6},${y - 20} q1.8,-1.8 3.6,0 q-1.8,1.8 -3.6,0 Z`, `M${gx - 4.8},${y - 11} l1.2,-1.4 l1.2,1.4 l1.2,-1.4`];
      s += signes.map((d) => `<path d="${d}" stroke="${g}" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("") + E(gx - 2.8, y - 20, 0.5, 0.5, g, 0);
      return s + (f ? glow(x - 1, y - 24, 12, "255,120,60", 0.22) : "");
    }, "draw") };
    var PIERRE_VOLC = { mid: "#4A4452", light: "#6A6276", dark: "#2E2A36" };
    C2.bassinchaud = { n: 3, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0, 1);
      const pierre = /* @__PURE__ */ __name((px, py, r) => E(px, py, r, r * 0.66, PIERRE_VOLC.mid, 0.9) + E(px + r * 0.15, py + r * 0.22, r * 0.75, r * 0.36, PIERRE_VOLC.dark, 0) + E(px - r * 0.3, py - r * 0.24, r * 0.4, r * 0.2, PIERRE_VOLC.light, 0), "pierre");
      const anneau = Array.from({ length: 11 }, (_, i) => {
        const t = i / 11 * TAU2 + 0.2;
        return [x + Math.cos(t) * 23, y + Math.sin(t) * 10.4, 4.2 + i % 3 * 0.9, Math.sin(t)];
      });
      let s = shadow2(0, 0, 0.5, 0.1) + E(x, y + 1, 27, 12.4, PIERRE_VOLC.dark, 0.9);
      s += anneau.filter(([, , , sn]) => sn < 0).map(([px, py, r]) => pierre(px, py, r)).join("");
      s += E(x, y + 0.6, 21, 9.2, "#E9E4C8", 0.8) + E(x, y + 0.8, 19, 8.2, "#7FE0D6", 0) + E(x + 1, y + 1.4, 12, 5, "#3FB8B0", 0) + E(x - 6, y - 2, 6, 1.6, "#C8F4EE", 0);
      for (let i = 0; i < 5; i++) {
        const p = (f / 3 + i * 0.21) % 1, bx = x - 9 + i * 4.6, by = y + 3 - i % 2 * 3;
        s += E(bx, by - p * 2, 0.7 + p * 0.6, 0.6 + p * 0.5, "none", 0).replace('stroke="none"', `stroke="#FFFFFF" stroke-width="0.5" opacity="${r23(1 - p * 0.6)}"`);
      }
      s += anneau.filter(([, , , sn]) => sn >= 0).map(([px, py, r]) => pierre(px, py, r)).join("");
      const [sx, sy] = [x + 22, y + 4];
      s += P2(`M${sx - 3.4},${sy - 6} L${sx + 3.4},${sy - 6} L${sx + 2.8},${sy} L${sx - 2.8},${sy} Z`, WOOD2.left, 0.8) + E(sx, sy - 6, 3.4, 1.2, "#7FE0D6", 0.7) + L([sx - 3.1, sy - 3.4], [sx + 3.1, sy - 3.4], "#6E757E", 0.8) + L([sx - 1.2, sy - 5.6], [sx - 1.1, sy - 0.2], WOOD2.right, 0.5) + L([sx + 1.2, sy - 5.6], [sx + 1.1, sy - 0.2], WOOD2.right, 0.5);
      s += P2(`M${x + 11},${y + 10.2} L${x + 17},${y + 9.2} L${x + 17},${y + 11.2} L${x + 11},${y + 12.2} Z`, "#E2D8CA", 0.7) + P2(`M${x + 8.6},${y + 8.8} L${x + 14.6},${y + 7.8} L${x + 17},${y + 9.2} L${x + 11},${y + 10.2} Z`, "#F7F1E8", 0.7) + L([x + 10.4, y + 8.5], [x + 12.8, y + 9.9], "#E8566A", 0.9) + L([x + 12.8, y + 9.9], [x + 12.8, y + 11.9], "#E8566A", 0.9);
      s += [[-30, -3.2], [-34, -1.4], [-38, 0.6]].map(([r, dy], i) => `<g transform="translate(${r23(x - 25)} ${r23(y + 2)}) rotate(${r + i * 22})">${P2(`M0,0 Q-2,${-4 - i} 0,${-8 - i} Q2,${-4 - i} 0,0 Z`, "#6FAE4E", 0.6)}</g>`).join("");
      for (let i = 0; i < 3; i++) {
        const p = (f / 3 + i / 3) % 1, vx = x - 8 + i * 8 + Math.sin(p * TAU2 + i) * 2, vy = y - 4 - p * 22, k = 0.7 + p * 0.8, o = r23(0.95 - p * 0.75);
        s += [[0, 0, 3], [-2.6, 1, 2.2], [2.6, 1, 2.2]].map(([dx, dy, r]) => E(vx + dx * k, vy + dy * k, r * k * 1.2, r * k, "#FFFFFF", 0).replace('stroke="none"', `stroke="#D6E6EA" stroke-width="0.6" opacity="${o}"`)).join("");
      }
      return s;
    }, "draw") };
    module.exports = { C: C2 };
  }
});

// atelier/landmarks.js
var require_landmarks = __commonJS({
  "atelier/landmarks.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, L, r2: r23 } = require_troupe2();
    var Dk = require_deco();
    var { feuillage, herbe, fleurette, palmier, champignon } = require_arbres();
    var { pt, poly: poly3, face: face2, shadow: shadow2, box: box2, crown, boulder: boulder2, flower, stroke, thick, cylinder: cylinder2, disc: disc2, post: post2, rail: rail2, glow, LEAVES: LEAVES2, PINE: PINE2, WOOD: WOOD2, WOOD_DARK: WOOD_DARK2, GRANITE, STONE: STONE2, WATER: WATER2, WATER_LIGHT } = Dk;
    var LAND2 = [-75, -150, 150, 190];
    var TAU2 = Math.PI * 2;
    var at = /* @__PURE__ */ __name((u, v, z = 0) => pt(u, v, z), "at");
    var ICE = { top: "#E9F8FF", left: "#BFE7F7", right: "#8CCBE8" };
    var SNOW = { top: "#FFFFFF", left: "#EAF2F8", right: "#C9D8E6" };
    var SAND2 = { top: "#F2D79A", left: "#E2BF78", right: "#C49A58" };
    var puff2 = /* @__PURE__ */ __name((x, y, r, a = 0.85) => `<g opacity="${a}">${E(x, y, r, r * 0.8, "#FFFFFF", 0.7)}${E(x + r * 0.7, y - r * 0.3, r * 0.7, r * 0.6, "#FFFFFF", 0.7)}${E(x - r * 0.6, y - r * 0.2, r * 0.6, r * 0.5, "#FFFFFF", 0.7)}</g>`, "puff");
    var sparkle2 = /* @__PURE__ */ __name((x, y, s) => P2(`M${x},${r23(y - s)} L${r23(x + s * 0.25)},${r23(y - s * 0.25)} L${r23(x + s)},${y} L${r23(x + s * 0.25)},${r23(y + s * 0.25)} L${x},${r23(y + s)} L${r23(x - s * 0.25)},${r23(y + s * 0.25)} L${r23(x - s)},${y} L${r23(x - s * 0.25)},${r23(y - s * 0.25)} Z`, "#FFFFFF", 0.5), "sparkle");
    var gull2 = /* @__PURE__ */ __name((x, y, flap) => `<g transform="translate(${r23(x)} ${r23(y)})">${E(0, 0, 3.4, 2.2, "#FFFFFF", 0.8)}${E(2.6, -1.8, 1.7, 1.7, "#FFFFFF", 0.8)}${P2("M4,-1.8 l2.2,0.6 l-2.2,0.6 Z", "#F2C94C", 0.4)}${E(2.8, -2.2, 0.35, 0.35, OUT3, 0)}${flap ? P2("M-1,-1 L-5,-6 L1,-2 Z", "#A8B4C2", 0.6) : P2("M-3,-0.4 Q0,-2 2,0 Q0,1 -3,-0.4 Z", "#A8B4C2", 0.5)}</g>`, "gull");
    var menhir = /* @__PURE__ */ __name((u, v, h, w, lit2, lean, id3) => {
      const [x, y] = at(u, v), xy4 = /* @__PURE__ */ __name((p) => p.map(r23).join(","), "xy");
      const pts3 = [[x - w, y], [x - w * 1.06 + lean * 0.35, y - h * 0.45], [x - w * 0.8 + lean * 0.85, y - h * 0.86], [x + lean, y - h - 2], [x + w * 0.82 + lean * 0.85, y - h * 0.82], [x + w * 1.04 + lean * 0.35, y - h * 0.42], [x + w, y]];
      let d = `M${xy4(pts3[0])}`;
      for (let i = 1; i < pts3.length - 1; i++) d += ` Q${xy4(pts3[i])} ${r23((pts3[i][0] + pts3[i + 1][0]) / 2)},${r23((pts3[i][1] + pts3[i + 1][1]) / 2)}`;
      d += ` L${xy4(pts3[6])} Q${x},${r23(y + w * 0.5)} ${xy4(pts3[0])} Z`;
      const [gx, gy] = [r23(x - w * 0.1 + lean * 0.5), r23(y - h * 0.55)];
      return `<defs><clipPath id="${id3}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="${GRANITE.left}"/><g clip-path="url(#${id3})"><path d="M${r23(x + w * 0.15 + lean * 0.9)},${r23(y - h - 6)} L${r23(x + w * 1.4)},${r23(y - h - 6)} L${r23(x + w * 1.4)},${r23(y + w)} L${r23(x + w * 0.22)},${r23(y + w)} Q${r23(x + w * 0.4 + lean * 0.4)},${r23(y - h * 0.45)} ${r23(x + w * 0.15 + lean * 0.9)},${r23(y - h - 6)} Z" fill="${GRANITE.right}"/><path d="M${r23(x - w * 0.62 + lean * 0.8)},${r23(y - h * 0.8)} Q${r23(x - w * 0.9 + lean * 0.3)},${r23(y - h * 0.45)} ${r23(x - w * 0.72)},${r23(y - h * 0.12)}" stroke="${GRANITE.top}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + E(x - w * 0.4 + lean * 0.4, y - h * 0.3, 1.8, 1.1, "#C8C27A", 0) + E(x + w * 0.3 + lean * 0.7, y - h * 0.74, 1.3, 0.8, "#E0DDB0", 0) + E(x - w * 0.2 + lean * 0.8, y - h * 0.82, 0.9, 0.6, "#C8C27A", 0) + `<path d="M${r23(x + w * 0.5 + lean * 0.5)},${r23(y - h * 0.36)} l-1.2,3 l1,2.4" stroke="#6A655C" stroke-width="0.7" fill="none" stroke-linecap="round"/><path d="M${r23(x - w * 1.2)},${r23(y + 1)} Q${r23(x - w * 0.8)},${r23(y - 4.4)} ${r23(x - w * 0.35)},${r23(y - 2.2)} Q${r23(x)},${r23(y - 5)} ${r23(x + w * 0.4)},${r23(y - 2)} Q${r23(x + w * 0.8)},${r23(y - 4)} ${r23(x + w * 1.2)},${r23(y + 1)} L${r23(x + w * 1.2)},${r23(y + w)} L${r23(x - w * 1.2)},${r23(y + w)} Z" fill="#7FA35A"/><path d="M${r23(x - w * 0.8)},${r23(y - 3.2)} q${r23(w * 0.3)},-1.4 ${r23(w * 0.5)},-0.6" stroke="#A8CC78" stroke-width="1" fill="none" stroke-linecap="round"/></g><path d="${d}" fill="none" stroke="${OUT3}" stroke-width="1.1" stroke-linejoin="round"/><path d="M${gx},${gy} m-1.9,0 a1.9,1.9 0 1 1 1.9,1.9 a3,3 0 1 1 -3,-3" stroke="${lit2 ? "#6FF0D8" : "#857F74"}" stroke-width="${lit2 ? 1.3 : 0.9}" fill="none" stroke-linecap="round"/>` + (lit2 ? glow(gx, gy, 7, "120,235,215", 0.4) : "") + `<path d="M${r23(x + w * 0.9)},${r23(y + 1.5)} l-0.6,-4 M${r23(x + w * 1.1)},${r23(y + 1.5)} l0.8,-3.4 M${r23(x + w * 1.3)},${r23(y + 1.6)} l1.4,-2.4" stroke="#6E9A4A" stroke-width="0.9" stroke-linecap="round"/>`;
    }, "menhir");
    var LM3 = {};
    LM3.grotte = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "bosses");
      const crystal2 = /* @__PURE__ */ __name((cx, cy, h, w, lean = 0) => {
        const tip = [cx + lean, cy - h], bl = [cx - w, cy], br = [cx + w, cy], fb = [cx, cy + w * 0.45];
        return poly3([bl, tip, fb], ICE.left, 0) + poly3([fb, tip, br], ICE.right, 0) + poly3([tip, [bl[0] + (tip[0] - bl[0]) * 0.7, bl[1] + (tip[1] - bl[1]) * 0.7], [fb[0] + (tip[0] - fb[0]) * 0.7, fb[1] + (tip[1] - fb[1]) * 0.7]], "#F6FDFF", 0) + L([cx - w * 0.45, cy - h * 0.12], [cx - w * 0.15 + lean * 0.6, cy - h * 0.62], "rgba(255,255,255,.9)", 0.8) + poly3([bl, tip, br, fb], "none", 0.9);
      }, "crystal");
      const grappe = /* @__PURE__ */ __name((cx, cy, h, w) => crystal2(cx - w * 1.3, cy + 1, h * 0.55, w * 0.7, -w * 0.9) + crystal2(cx + w * 1.3, cy + 1.5, h * 0.62, w * 0.75, w) + crystal2(cx, cy, h, w, w * 0.2) + E(cx, cy + w * 0.9, w * 2.3, w * 0.75, "#DCEAF5", 0) + P2(bosses(cx, cy + w * 0.6, w * 2.1, w * 0.7, 8), SNOW.top, 0), "grappe");
      let s = shadow2(0, 0, 0.74, 0.12) + P2(bosses(x, y + 8, 64, 27, 22), SNOW.top, 1.1) + E(x + 6, y + 10, 50, 13, "#DCEAF5", 0) + [[-50, 18, 2.8], [46, 22, 2.4], [-18, 30, 2]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.65, "#8E9AA8", 0.7) + E(x + dx - r * 0.3, y + dy - r * 0.25, r * 0.45, r * 0.25, "#C8D2DC", 0)).join("");
      const mound = `M${x - 52},${y + 6} Q${x - 56},${y - 22} ${x - 34},${y - 38} Q${x - 26},${y - 58} ${x - 2},${y - 56} Q${x + 18},${y - 66} ${x + 34},${y - 46} Q${x + 56},${y - 34} ${x + 52},${y - 4} Q${x + 50},${y + 10} ${x + 36},${y + 12} Q${x},${y + 22} ${x - 52},${y + 6} Z`;
      const id3 = `grotte-tertre-${f}`;
      s += `<defs><clipPath id="${id3}"><path d="${mound}"/></clipPath></defs><path d="${mound}" fill="${SNOW.right}"/><g clip-path="url(#${id3})"><path d="${mound}" fill="${SNOW.left}" transform="translate(-6 -3)"/><path d="${mound}" fill="${SNOW.top}" transform="translate(-13 -6)"/><path d="M${x - 40},${y - 22} q10,-6 22,-4 M${x - 8},${y - 44} q10,-5 20,-2 M${x + 22},${y - 30} q9,-2 16,4 M${x - 36},${y - 4} q6,-3 11,-1" fill="none" stroke="#C9DCEB" stroke-width="1.2" stroke-linecap="round"/><path d="M${x - 30},${y - 50} q6,-4 12,-3 M${x + 8},${y - 58} q5,-3 10,-1" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/></g><path d="${mound}" fill="none" stroke="${OUT3}" stroke-width="1.2" stroke-linejoin="round"/>`;
      s += grappe(x - 22, y - 46, 24, 5) + crystal2(x - 2, y - 52, 12, 3.4, 1) + grappe(x + 30, y - 38, 18, 4.2);
      const mx = x + 4, my = y + 12;
      s += `<path d="M${mx - 21},${my} Q${mx - 22},${my - 38} ${mx},${my - 40} Q${mx + 22},${my - 38} ${mx + 21},${my} Z" fill="${ICE.left}" stroke="${OUT3}" stroke-width="1.1"/><path d="M${mx + 8},${my - 39} Q${mx + 22},${my - 36} ${mx + 21},${my} L${mx + 15},${my} Q${mx + 15},${my - 26} ${mx + 6},${my - 30} Z" fill="${ICE.right}"/><path d="M${mx - 15},${my} Q${mx - 15},${my - 29} ${mx},${my - 30} Q${mx + 15},${my - 29} ${mx + 15},${my} Z" fill="#2C5677" stroke="${OUT3}" stroke-width="0.8"/><path d="M${mx - 10},${my} Q${mx - 9},${my - 20} ${mx},${my - 21} Q${mx + 9},${my - 20} ${mx + 10},${my} Z" fill="#1D4565"/><path d="M${mx - 5},${my} Q${mx - 4.6},${my - 11} ${mx},${my - 11.6} Q${mx + 4.6},${my - 11} ${mx + 5},${my} Z" fill="#132F48"/>` + [[-20, -10, -15, -9], [-17, -26, -12, -22], [0, -40, 0, -30], [17, -26, 12, -22], [20, -10, 15, -9]].map(([a1, b1, a2, b2]) => L([mx + a1, my + b1], [mx + a2, my + b2], "#7FB8D8", 0.8)).join("") + E(mx, my - 8, 7, 3.6, `rgba(130,200,255,${f ? 0.5 : 0.32})`, 0) + (f ? [[-5, -14, 1.8], [6, -8, 1.4]] : [[4, -15, 1.6], [-6, -7, 1.4]]).map(([dx, dy, r]) => P2(`M${mx + dx},${my + dy - r * 1.6} l${r},${r * 1.6} l-${r},${r * 1.6} l-${r},-${r * 1.6} Z`, "#9FDCF8", 0)).join("");
      s += `<path d="M${mx - 15},${my} Q${mx - 20},${my + 7} ${mx - 28},${my + 11} Q${mx - 4},${my + 19} ${mx + 24},${my + 10} Q${mx + 18},${my + 5} ${mx + 15},${my} Z" fill="${ICE.top}" stroke="${ICE.right}" stroke-width="0.9"/><path d="M${mx - 16},${my + 8} l7,-1.2 M${mx + 4},${my + 12} l8,-1.4" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>`;
      const bord = /* @__PURE__ */ __name((dx) => my - 37 + dx * dx / 80, "bord");
      let lip = `M${mx - 18},${r23(bord(-18))} Q${mx - 13},${my - 47} ${mx},${my - 47.5} Q${mx + 13},${my - 47} ${mx + 18},${r23(bord(18))}`;
      for (let dx = 18; dx > -18; dx -= 4.5) lip += ` Q${r23(mx + dx - 2.25)},${r23(bord(dx - 2.25) + 2.2)} ${r23(mx + dx - 4.5)},${r23(bord(dx - 4.5))}`;
      s += P2(lip + " Z", SNOW.top, 1.1) + `<path d="M${mx - 10},${my - 43} q6,-2 12,-1.6" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${mx + 6},${my - 42} q6,1 9,5" stroke="#D6E4F0" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
      for (const [dx, len] of [[-13.5, 5], [-9, 9], [-4.5, 6], [0, 11], [4.5, 6.5], [9, 9.5], [13.5, 5]]) {
        const yy = bord(dx) + 1.2;
        s += P2(`M${mx + dx - 1.8},${r23(yy)} L${mx + dx + 1.8},${r23(yy)} L${mx + dx + 0.2},${r23(yy + len)} Z`, "#EAF7FF", 0.6) + L([mx + dx - 0.6, yy + 1], [mx + dx - 0.1, yy + len * 0.6], "#FFFFFF", 0.6);
      }
      s += grappe(x - 42, y + 8, 14, 3) + grappe(x + 42, y + 12, 15, 3.2);
      s += [[-40, 30, 0], [-33, 27, 1], [-27, 31, 0], [-20, 27, 1]].map(([dx, dy, k]) => E(x + dx, y + dy, 2, 1.1, "#C9D8E6", 0) + E(x + dx + 1.6, y + dy - 1.6, 1, 0.6, "#C9D8E6", 0)).join("");
      const wisp = /* @__PURE__ */ __name((p) => `<g opacity="${r23(0.85 * (1 - p * 0.8))}">${E(mx - 6 - p * 24, my - 10 - p * 10, 7 + p * 5, 3.2 + p * 2.4, "rgba(234,246,255,.75)", 0)}${E(mx - 2 - p * 24, my - 13 - p * 10, 4.4 + p * 3, 2.4 + p * 1.6, "rgba(255,255,255,.85)", 0)}<path d="M${r23(mx - 10 - p * 24)},${r23(my - 10 - p * 10)} q-6,-3 -11,-1 q-4,2 -1.4,4.4 q2.4,1.4 3.4,-1.6" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/></g>`, "wisp");
      s += wisp(f ? 0.5 : 0) + wisp(f ? 0 : 0.5);
      return s + (f ? sparkle2(x + 34, y - 60, 3) + sparkle2(x - 36, y - 24, 2.2) : sparkle2(x - 18, y - 74, 3) + sparkle2(x + 44, y - 20, 2.2));
    }, "draw") };
    var NEIGE_TOIT = { back: "#E3EEF6", front: "#FFFFFF", gable: "#C98A52" };
    LM3.lac = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const rive = /* @__PURE__ */ __name((rx, ry, n, k) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.035) + (i % 5 ? 0 : 0.05) * k;
          return [x + Math.cos(t) * rx * r, y + 2 + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "rive");
      let s = shadow2(0, 0, 0.74, 0.08) + `<path d="${rive(64, 29, 18, 1)}" fill="#FFFFFF" stroke="${OUT3}" stroke-width="1.1"/><path d="${rive(54, 23, 16, 0)}" fill="#CFEAF7" stroke="#9FC9E2" stroke-width="0.9"/>` + E(x + 6, y + 5, 30, 10, "#B4DDF0", 0) + E(x - 14, y - 4, 16, 4, "#E9F8FF", 0);
      const ang = f ? 2.4 : 0.6, [fx, fy] = [x + 10 + Math.cos(ang) * 16, y + 6 + Math.sin(ang) * 6];
      s += `<g transform="translate(${r23(fx)} ${r23(fy)}) scale(${f ? -1 : 1} 1)" opacity="0.55">` + E(0, 0, 4, 1.6, "#8FA6B8", 0) + P2("M-3.4,0 L-6,-1.8 L-5.4,0 L-6,1.8 Z", "#8FA6B8", 0) + "</g>";
      s += `<path d="M${x - 30},${y + 8} l8,-3 l5,2 l7,-4 M${x + 18},${y + 14} l6,-4 l8,1 M${x + 28},${y - 6} l-5,-4 l3,-5" stroke="#9FC9E2" stroke-width="0.8" fill="none" stroke-linejoin="round"/><path d="M${x - 24},${y - 6} l10,-4 M${x - 20},${y - 3} l6,-2.4 M${x + 6},${y + 18} l9,-3.6" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
      s += box2(-0.6, -0.6, -0.34, -0.36, 0, 16, WOOD2) + Dk.gable(-0.62, -0.62, -0.32, -0.34, 16, 10, NEIGE_TOIT, 0.05);
      const [dx0, dy0] = at(-0.54, -0.36, 0), [wx, wy] = at(-0.34, -0.5, 8);
      s += `<path d="M${dx0},${dy0} l0,-10 l5,2.5 l0,10 Z" fill="#5A3A22" stroke="${OUT3}" stroke-width="0.7"/><path d="M${wx - 0.4},${wy - 2} l4,-2 l0,4 l-4,2 Z" fill="#FFD27A" stroke="${OUT3}" stroke-width="0.6"/>` + box2(-0.4, -0.58, -0.35, -0.53, 22, 30, { top: "#9A8E80", left: "#7E7266", right: "#5E554B" }, 0.7);
      const [cx, cy] = at(-0.375, -0.555, 30);
      s += puff2(cx + (f ? 3 : 1), cy - 6 - f * 4, 3.4, 0.85) + puff2(cx + (f ? 7 : 4), cy - 14 - f * 3, 2.4, 0.6);
      for (const [u, v, h] of [[0.2, -0.62, 20], [0.3, -0.64, 13], [0.12, -0.66, 10]]) {
        const [a2, b2] = at(u, v);
        s += poly3([[a2 - 3, b2], [a2, b2 - h], [a2 + 3, b2]], ICE.left, 0.8) + poly3([[a2, b2 - h], [a2 + 3, b2], [a2 + 0.6, b2]], ICE.right, 0) + L([a2 - 1.4, b2 - 2], [a2 - 0.4, b2 - h * 0.6], "#FFFFFF", 0.6);
      }
      s += box2(0.46, -0.48, 0.6, -0.34, 0, 7, ICE, 0.9) + box2(0.48, -0.46, 0.58, -0.36, 7, 13, ICE, 0.9) + box2(-0.62, 0.2, -0.42, 0.4, 0, 10, ICE, 0.9);
      const [hx, hy] = at(0.06, 0.1);
      s += E(hx, hy, 10.4, 5, "#F4FBFF", 0.8) + E(hx, hy + 0.4, 8.4, 3.8, "#2E6A9E", 0) + E(hx - 2.4, hy - 0.6, 3, 0.8, "#5A90C0", 0);
      s += thick(`M${hx + 22},${hy - 2} L${hx + 22.4},${hy - 9}`, 0.7, WOOD_DARK2.left) + thick(`M${hx + 26},${hy + 1} L${hx + 4},${hy - 20}`, 1, WOOD_DARK2.left) + `<path d="M${hx + 4},${hy - 20} Q${hx - 2},${hy - 12} ${hx - 1},${hy - 1 + f}" fill="none" stroke="${OUT3}" stroke-width="0.45"/>` + E(hx - 1, hy - 1 + f, 1.5, 1.3, "#E8483C", 0.6) + `<path d="M${hx - 2.4},${hy - 1.2 + f} h2.8" stroke="#FFFFFF" stroke-width="0.7"/>` + E(hx - 1, hy + 1.4, 3 + f, 1 + f * 0.4, "none", 0).replace('stroke="none"', 'stroke="#9FC9E2" stroke-width="0.5"');
      const [bx, by] = at(-0.16, 0.34);
      return s + P2(`M${bx - 4},${by - 7} L${bx + 4},${by - 7} L${bx + 3.2},${by} L${bx - 3.2},${by} Z`, "#8FA0B0", 0.8) + E(bx, by - 7, 4, 1.4, "#5E6E7E", 0.6) + P2(`M${bx + 0.4},${by - 7.4} L${bx + 2.6},${by - 12} L${bx + 4.4},${by - 11} Z`, "#B8C8D6", 0.6) + L([bx - 3.6, by - 3.6], [bx + 3.6, by - 3.6], "#6E7E8E", 0.6);
    }, "draw") };
    var ROCAILLE = [["#B9B2A6", "#D8D2C6", "#8E877B"], ["#A9A69F", "#CBC8C0", "#817E77"], ["#BDB4A2", "#DCD3C1", "#938A78"]];
    var galet = /* @__PURE__ */ __name((x, y, rx, ry, [c, l, d]) => P2(`M${r23(x - rx)},${r23(y)} Q${r23(x - rx)},${r23(y - ry * 1.5)} ${r23(x)},${r23(y - ry * 1.6)} Q${r23(x + rx)},${r23(y - ry * 1.5)} ${r23(x + rx)},${r23(y)} Q${r23(x + rx * 0.9)},${r23(y + ry * 0.9)} ${r23(x)},${r23(y + ry)} Q${r23(x - rx * 0.9)},${r23(y + ry * 0.9)} ${r23(x - rx)},${r23(y)} Z`, c, 0.9) + `<path d="M${r23(x - rx * 0.7)},${r23(y + ry * 0.45)} Q${r23(x)},${r23(y + ry * 1.05)} ${r23(x + rx * 0.85)},${r23(y + ry * 0.2)} Q${r23(x + rx * 0.8)},${r23(y + ry * 0.7)} ${r23(x)},${r23(y + ry * 0.92)} Q${r23(x - rx * 0.6)},${r23(y + ry * 0.8)} ${r23(x - rx * 0.7)},${r23(y + ry * 0.45)} Z" fill="${d}"/>` + E(x - rx * 0.3, y - ry * 0.75, rx * 0.45, ry * 0.4, l, 0), "galet");
    var edelweiss = /* @__PURE__ */ __name((x, y) => [0, 1, 2, 3, 4, 5].map((i) => {
      const a = i / 6 * TAU2;
      return E(x + Math.cos(a) * 1.5, y + Math.sin(a) * 1, 1.1, 0.7, "#FFFFFF", 0.45);
    }).join("") + E(x, y, 0.8, 0.6, "#F2C94C", 0.3), "edelweiss");
    LM3.col = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bord = Array.from({ length: 16 }, (_, i) => {
        const t = i / 16 * TAU2, r = 1 + (i % 2 ? 0.05 : -0.04) + (i % 5 ? 0 : 0.06);
        return [x + Math.cos(t) * 62 * r, y + 2 + Math.sin(t) * 27 * r];
      });
      const mil = /* @__PURE__ */ __name((i) => {
        const p = bord[i % 16], q = bord[(i + 1) % 16];
        return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
      }, "mil");
      let d = `M${mil(15)}`;
      for (let i = 0; i < 16; i++) d += ` Q${r23(bord[i][0])},${r23(bord[i][1])} ${mil(i)}`;
      let s = shadow2(0, 0, 0.7, 0.08) + P2(`${d} Z`, "#B9D48C", 0.9) + E(x - 8, y - 2, 40, 15, "#C9E0A0", 0);
      s += [[-40, 8, 4, 0], [36, 12, 3.4, 2], [-18, 18, 3, 1], [48, -2, 2.6, 0], [-50, -4, 2.4, 2], [14, -16, 2.2, 1]].map(([dx, dy, r, k]) => galet(x + dx, y + dy, r * 1.4, r * 0.75, ROCAILLE[k])).join("");
      s += [[-30, 14], [24, 18], [6, -10]].map(([dx, dy]) => `<path d="M${x + dx - 3},${y + dy} q-0.6,-3.6 -2.4,-5 M${x + dx},${y + dy} q0.2,-4.4 1,-6.4 M${x + dx + 3},${y + dy} q1,-3 3,-4" stroke="#6E9E4A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join("") + edelweiss(x - 24, y + 8) + edelweiss(x + 30, y + 6) + edelweiss(x - 6, y + 20);
      const cairn = /* @__PURE__ */ __name((u, v, k) => {
        const [cx, cy] = at(u, v);
        return [[0, 0, 11, 4, 0], [1.2, -6.6, 8.6, 3.4, 2], [-0.8, -12, 7, 3, 1], [1, -16.8, 5.4, 2.4, 0], [0, -20.6, 3.8, 1.9, 2]].map(([dx, dy, rx, ry, c]) => galet(cx + dx, cy + dy, rx, ry, ROCAILLE[(c + k) % 3])).join("");
      }, "cairn");
      const crete = /* @__PURE__ */ __name((u, v, k) => {
        const [cx, cy] = at(u, v);
        return P2(`M${r23(cx - 16 * k)},${r23(cy)} L${r23(cx - 11 * k)},${r23(cy - 16 * k)} L${r23(cx - 4 * k)},${r23(cy - 22 * k)} L${r23(cx + 2 * k)},${r23(cy - 30 * k)} L${r23(cx + 9 * k)},${r23(cy - 20 * k)} L${r23(cx + 15 * k)},${r23(cy - 12 * k)} L${r23(cx + 17 * k)},${r23(cy)} Q${r23(cx)},${r23(cy + 4 * k)} ${r23(cx - 16 * k)},${r23(cy)} Z`, "#A9A69F", 1) + `<path d="M${r23(cx + 2 * k)},${r23(cy - 30 * k)} L${r23(cx + 9 * k)},${r23(cy - 20 * k)} L${r23(cx + 15 * k)},${r23(cy - 12 * k)} L${r23(cx + 17 * k)},${r23(cy)} Q${r23(cx + 8 * k)},${r23(cy + 2.6 * k)} ${r23(cx + 2 * k)},${r23(cy + 3 * k)} L${r23(cx + 4 * k)},${r23(cy - 14 * k)} Z" fill="#817E77"/>` + P2(`M${r23(cx - 4 * k)},${r23(cy - 22 * k)} L${r23(cx + 2 * k)},${r23(cy - 30 * k)} L${r23(cx + 7 * k)},${r23(cy - 23 * k)} L${r23(cx + 3 * k)},${r23(cy - 24.6 * k)} L${r23(cx)},${r23(cy - 21 * k)} L${r23(cx - 2 * k)},${r23(cy - 22.6 * k)} Z`, "#FFFFFF", 0.7);
      }, "crete");
      s += crete(-0.62, -0.5, 1.1) + crete(0.06, -0.7, 0.85);
      s += cairn(-0.5, 0.2, 0);
      const a = at(-0.5, 0.2, 18), b = at(0.45, -0.32, 18), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 9];
      s += `<path d="M${r23(a[0])},${r23(a[1])} Q${r23(m[0])},${r23(m[1])} ${r23(b[0])},${r23(b[1])}" fill="none" stroke="${OUT3}" stroke-width="0.7"/>`;
      const cols = ["#E8566A", "#F2C04B", "#5C8FD0", "#7EC45B", "#FFFFFF", "#E8566A", "#F2C04B", "#5C8FD0"];
      cols.forEach((c, i) => {
        const t = (i + 1) / 9, qx = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * m[0] + t * t * b[0], qy = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * m[1] + t * t * b[1], sw = (f ? 1.8 : -1.2) * (i % 2 ? 1 : -0.6);
        s += P2(`M${r23(qx - 2.6)},${r23(qy)} L${r23(qx + 2.6)},${r23(qy)} L${r23(qx + 2.2)},${r23(qy + 5.4)} L${r23(qx + sw)},${r23(qy + 3.8)} L${r23(qx - 2.2)},${r23(qy + 5.4)} Z`, c, 0.6);
      });
      s += cairn(0.45, -0.32, 1);
      const [px, py] = at(0.16, 0.44), top = py - 44;
      s += L([px, py], [px, top], WOOD_DARK2.left, 1.4) + E(px, py, 2.2, 1, "#8A7A62", 0.6) + E(px, top - 1, 1.4, 1.4, "#E2B546", 0.6);
      const len = f ? 20 : 15, drop = f ? 1 : 8, seg = 4;
      for (let i = 0; i < seg; i++) {
        const t0 = i / seg, t1 = (i + 1) / seg, h0 = 3.4 - t0 * 1.6, h1 = 3.4 - t1 * 1.6, x0 = px + 1 + len * t0, x1 = px + 1 + len * t1, y0 = top + 3 + drop * t0 * t0, y1 = top + 3 + drop * t1 * t1;
        s += P2(`M${r23(x0)},${r23(y0 - h0)} L${r23(x1)},${r23(y1 - h1)} L${r23(x1)},${r23(y1 + h1)} L${r23(x0)},${r23(y0 + h0)} Z`, i % 2 ? "#FFFFFF" : "#E8566A", 0.7);
      }
      s += E(px + 1.4, top + 3, 1.2, 3.4, "#C8402E", 0.6);
      return s + (f ? [[-40, -40], [10, -58], [-10, -24]] : [[-56, -34], [-6, -52], [20, -30]]).map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q10,-4 20,0 q6,2 10,-2" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.8"/>`).join("");
    }, "draw") };
    var menhirsDraw = /* @__PURE__ */ __name((fleuri) => (f) => {
      const [x, y] = at(0, 0);
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "bosses");
      let s = shadow2(0, 0, 0.78, 0.1) + P2(bosses(x, y + 2, 62, 29, 22), fleuri ? "#A8D878" : "#9CC874", 1.1) + E(x - 4, y, 44, 19, fleuri ? "#BCE48E" : "#AED486", 0) + `<ellipse cx="${x}" cy="${y}" rx="41" ry="20.5" fill="none" stroke="#D2C394" stroke-width="6" opacity="0.6"/>` + [[-30, 10], [34, -6], [8, 19], [-20, -14], [22, 14]].map(([dx, dy]) => E(x + dx, y + dy, 1.6, 1, "#B4AD9F", 0.5)).join("");
      const couronne = /* @__PURE__ */ __name((devant) => fleuri ? Array.from({ length: 16 }, (_, i) => {
        const a = i / 16 * TAU2, u = Math.cos(a) * 0.68, v = Math.sin(a) * 0.68;
        if (u + v >= 0 !== devant) return "";
        const [fx, fy] = at(u, v);
        return flower(fx, fy - 2, 1.6, ["#F7C6D9", "#FFFFFF", "#F2C94C", "#B48AE0"][i % 4]);
      }).join("") : "", "couronne");
      s += couronne(false);
      const lean = [-1.5, 1, 0, -1, 1.5, 0.5, -0.8];
      const lit2 = /* @__PURE__ */ __name((i) => fleuri || i === f * 3 || i === f * 3 + 1, "lit");
      const stones = Array.from({ length: 7 }, (_, i) => {
        const a = i / 7 * TAU2 - Math.PI / 2 + 0.11;
        return { i, u: Math.cos(a) * 0.58, v: Math.sin(a) * 0.58, h: 24 + i * 7 % 11 };
      }).sort((p, q) => p.u + p.v - (q.u + q.v));
      const pierre = /* @__PURE__ */ __name((st) => menhir(st.u, st.v, st.h, 5.2 + st.i % 3 * 0.7, lit2(st.i), lean[st.i], `menhir-${fleuri ? "f" : "c"}-${f}-${st.i}`), "pierre");
      s += stones.filter((st) => st.u + st.v < 0).map(pierre).join("");
      const TABLE = { top: "#D8D2C6", left: "#B4AD9F", right: "#8F887B" };
      s += box2(-0.09, -0.06, -0.04, 0.06, 0, 6, GRANITE, 0.8) + box2(0.04, -0.06, 0.09, 0.06, 0, 6, GRANITE, 0.8) + box2(-0.17, -0.11, 0.17, 0.11, 6, 10, TABLE, 1);
      const [tx, ty] = at(0, 0, 10);
      s += E(tx - 6, ty - 1, 4, 1.8, "#8DB866", 0) + E(tx - 7, ty - 1.4, 2, 0.8, "#A8CC78", 0) + `<path d="M${tx + 2},${ty - 3} l3,2 l-1,2.6" stroke="#9A9387" stroke-width="0.7" fill="none" stroke-linecap="round"/>`;
      s += stones.filter((st) => st.u + st.v >= 0).map(pierre).join("");
      s += couronne(true);
      if (fleuri) {
        s += [-8, 0, 8].map((dx) => flower(tx + dx, ty - 1, 1.6, "#F7C6D9")).join("") + glow(tx, ty - 10, 26, "255,236,150", 0.22);
      }
      return s;
    }, "menhirsDraw");
    LM3.menhirs = { n: 2, draw: menhirsDraw(false) };
    LM3.menhirs_fleuri = { n: 2, draw: menhirsDraw(true) };
    var FALAISE = { lit: "#D6BC96", mid: "#C2A47C", shade: "#A0835E", strate: "#B4966E", dark: "#6E5A44" };
    LM3.arche = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), c = FALAISE, V = 0.14, Z = 34;
      const F = /* @__PURE__ */ __name((u, z) => at(u, V, z), "F"), B = /* @__PURE__ */ __name((u, z) => at(u, -V, z), "B"), xy4 = /* @__PURE__ */ __name((p) => p.map(r23).join(","), "xy");
      const lisse = /* @__PURE__ */ __name((pts3) => {
        let d = `M${xy4(pts3[0])}`;
        for (let i = 1; i < pts3.length - 1; i++) d += ` Q${xy4(pts3[i])} ${r23((pts3[i][0] + pts3[i + 1][0]) / 2)},${r23((pts3[i][1] + pts3[i + 1][1]) / 2)}`;
        return d + ` L${xy4(pts3[pts3.length - 1])}`;
      }, "lisse");
      let s = E(x, y + 6, 70, 26, "#6FB0DA", 1) + E(x - 8, y + 2, 52, 16, "#8CC6E8", 0) + E(x - 16, y, 26, 6, "#B2DCF2", 0);
      const gauche = [[-0.58, 0], [-0.62, 6], [-0.6, 14], [-0.55, 21]], crete = [[-0.58, 25], [-0.42, 31], [-0.2, 34], [0.06, 35], [0.3, 33], [0.48, 31], [0.58, 28]], droite = [[0.6, 21], [0.56, 13], [0.6, 6], [0.58, 0]];
      const face3 = lisse([...gauche, ...crete, ...droite].map(([u, z]) => F(u, z))) + " Z";
      const bout = [[0.58, 28], ...droite];
      s += poly3([...bout.map(([u, z]) => F(u, z)), ...bout.slice().reverse().map(([u, z]) => B(u + 0.01, z - 1.5))], c.shade, 1.1);
      for (const z of [7, 14, 21]) s += L(F(0.59, z), B(0.6, z - 1.5), c.dark, 0.8);
      const idF = `arche-face-${f}`;
      s += `<defs><clipPath id="${idF}"><path d="${face3}"/></clipPath></defs><path d="${face3}" fill="${c.lit}"/>`;
      s += `<g clip-path="url(#${idF})">` + [[9, 15, c.mid], [22, 27, c.mid]].map(([z0, z1]) => `<path d="M${xy4(F(-0.7, z0))} Q${xy4(F(-0.3, z0 + 2))} ${xy4(F(0, z0))} T${xy4(F(0.7, z0))} L${xy4(F(0.7, z1))} Q${xy4(F(0.3, z1 - 1.6))} ${xy4(F(0, z1))} T${xy4(F(-0.7, z1))} Z" fill="#CDB28C"/>`).join("") + [7, 15, 22, 28].map((z) => `<path d="M${xy4(F(-0.7, z))} Q${xy4(F(-0.35, z + 1.6))} ${xy4(F(0, z))} T${xy4(F(0.7, z))}" stroke="${c.strate}" stroke-width="1" fill="none"/>`).join("") + `<path d="M${xy4(F(-0.7, 0))} L${xy4(F(-0.7, 4))} Q${xy4(F(-0.35, 5.4))} ${xy4(F(0, 3.6))} T${xy4(F(0.7, 4))} L${xy4(F(0.7, 0))} Z" fill="#9C8A66"/><path d="M${xy4(F(-0.5, 4.4))} l1.4,3 M${xy4(F(-0.42, 4.6))} l0.6,2.4 M${xy4(F(0.36, 3.8))} l1,2.8 M${xy4(F(0.46, 3.6))} l0.4,2.2" stroke="#6E8A4E" stroke-width="1" stroke-linecap="round"/><path d="M${xy4(F(-0.44, 26))} l1.6,5 l-1.4,4 M${xy4(F(0.4, 18))} l-1,5 l1.4,3" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round"/></g><path d="${face3}" fill="none" stroke="${OUT3}" stroke-width="1.1" stroke-linejoin="round"/>`;
      const trouUZ = [[-0.28, 0], [-0.31, 6], [-0.28, 13], [-0.17, 20], [0.01, 24], [0.17, 21], [0.27, 15], [0.31, 7], [0.29, 0]];
      const trou = lisse(trouUZ.map(([u, z]) => F(u, z))) + " Z", fond = lisse(trouUZ.map(([u, z]) => B(u, z))) + " Z", id3 = `arche-trou-${f}`;
      s += `<defs><clipPath id="${id3}"><path d="${trou}"/></clipPath></defs><path d="${trou}" fill="${c.dark}"/><g clip-path="url(#${id3})"><path d="${trou}" fill="#5A4836" transform="translate(-3 -2)"/><path d="${fond}" fill="#8CC6E8"/>${E(x + 8, y - 4, 10, 2.4, "#B2DCF2", 0)}<path d="M${x - 2 + (f ? 3 : 0)},${y + 2} q6,2 12,0" stroke="#FFFFFF" stroke-width="1" fill="none"/></g><path d="${trou}" fill="none" stroke="${OUT3}" stroke-width="1.1" stroke-linejoin="round"/>`;
      const T = [...crete.map(([u, z]) => at(u, V + 0.02, z)), ...crete.slice().reverse().map(([u, z]) => at(u, -V - 0.02, z - 2))];
      s += poly3(T, "#8FCB6A", 1);
      let frange = `M${xy4(T[0])}`;
      for (let i = 1; i < crete.length; i++) {
        const p0 = T[i - 1], p1 = T[i];
        frange += ` Q${r23((p0[0] + p1[0]) / 2 - 1)},${r23((p0[1] + p1[1]) / 2 + 3.4)} ${xy4(p1)}`;
      }
      s += P2(frange + " Z", "#7EBE58", 0.8);
      for (const [u, v, col] of [[-0.36, 0.04, "#FFFFFF"], [-0.12, 0.05, "#F7B6C8"], [0.32, 0.02, "#FFFFFF"], [0.12, -0.05, "#F7B6C8"]]) {
        const [fx, fy] = at(u, v, Z);
        s += Dk.flower(fx, fy - 1, 1.4, col, "#F2C94C");
      }
      const rocher = /* @__PURE__ */ __name((dx, dy, r) => `<path d="M${x + dx - r * 1.3},${y + dy + r * 0.3} q${r * 1.3},${r * 0.7} ${r * 2.6},0" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + E(x + dx, y + dy, r, r * 0.66, c.shade, 0.9) + E(x + dx - r * 0.15, y + dy - r * 0.16, r * 0.78, r * 0.44, c.mid, 0) + E(x + dx - r * 0.38, y + dy - r * 0.3, r * 0.34, r * 0.16, c.lit, 0), "rocher");
      s += rocher(-52, 8, 6.4) + rocher(-38, 17, 4.2) + rocher(52, 5, 5.6) + rocher(40, 15, 3.8);
      s += `<path d="${lisse([F(-0.62, 0.6), F(-0.3, -0.4), F(0, 0.8), F(0.3, -0.2), F(0.6, 0.6)])}" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="7 3"/>`;
      const k = f ? 3 : 0;
      s += `<path d="M${x - 46 - k},${y + 22} q-6,3 -12,1 M${x + 22 + k},${y + 24} q8,3 16,1 M${x - 16},${y + 28 + k * 0.5} q8,2 16,0 M${x + 54},${y + 14 - k * 0.5} q5,2 10,0" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
      const [gx, gy] = at(0.16, -0.02, Z);
      return s + gull2(gx, gy - 4, f);
    }, "draw") };
    var SAULE = { devant: { light: "#E6F6AA", mid: "#B4D96E", dark: "#7DAE50" }, fond: { light: "#B7DA7C", mid: "#8DBE57", dark: "#5E9443" } };
    LM3.saule = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), BOIS = { left: "#8E7458", right: "#6A5440", bark: "#4A3A2C", light: "#A88E70" };
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d2 = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d2 += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d2 + " Z";
      }, "bosses");
      const meche = /* @__PURE__ */ __name((sx, sy, len, sw2, c, eau) => {
        const ex = sx + sw2, ey = sy + len, cx = sx + sw2 * 0.1 + (sx < x ? -2.2 : 2.2), cy = sy + len * 0.45, Q = /* @__PURE__ */ __name((t) => [(1 - t) ** 2 * sx + 2 * t * (1 - t) * cx + t * t * ex, (1 - t) ** 2 * sy + 2 * t * (1 - t) * cy + t * t * ey], "Q");
        const d2 = `M${r23(sx)},${r23(sy)} Q${r23(cx)},${r23(cy)} ${r23(ex)},${r23(ey)}`;
        return `<path d="${d2}" stroke="${OUT3}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="${d2}" stroke="${c.mid}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` + [0.28, 0.46, 0.64, 0.82].map((t, k) => {
          const [px, py] = Q(t), sg = k % 2 ? 1 : -1;
          return `<path d="M${r23(px)},${r23(py)} q${sg * 1.4},0.3 ${sg * 2.2},1.8" stroke="${c.mid}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${r23(px)},${r23(py)} q${sg * 1.4},0.3 ${sg * 2.2},1.8" stroke="${c.dark}" stroke-width="0.5" fill="none" stroke-linecap="round"/>`;
        }).join("") + (eau ? `<ellipse cx="${r23(ex)}" cy="${r23(ey + 1.4)}" rx="${3 + (f ? 1 : 0)}" ry="${1.2 + (f ? 0.4 : 0)}" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>` : "");
      }, "meche");
      const sw = /* @__PURE__ */ __name((i, k = 1) => ((f ? 1.8 : -1.4) + (i % 3 - 1) * 0.6) * k, "sw");
      let s = shadow2(0, 0, 0.8, 0.1) + P2(bosses(x, y + 4, 64, 28, 22), "#9CC874", 1.1) + E(x - 8, y + 2, 42, 17, "#AED486", 0) + `<path d="M${x - 2},${y + 14} Q${x + 2},${y + 2} ${x + 20},${y + 3} Q${x + 46},${y + 4} ${x + 48},${y + 13} Q${x + 44},${y + 23} ${x + 22},${y + 23} Q${x + 2},${y + 23} ${x - 2},${y + 14} Z" fill="#7FC0E2" stroke="${OUT3}" stroke-width="1"/>` + E(x + 20, y + 11, 18, 5, "#A6D8F0", 0) + `<path d="M${x + 10},${y + 16} l9,-1 M${x + 30},${y + 19} l7,-1" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
      s += [-42, -35, -27, -19, -10, -2, 7, 15, 24, 32, 40].map((sx, i) => meche(x + sx, y - 58 + Math.abs(sx) * 0.08, 50 - Math.abs(sx) * 0.05 + i % 3 * 3, sw(i, 0.8) + (sx < 0 ? -1.5 : 1.5), SAULE.fond, false)).join("");
      const d = `M${x - 21},${y + 3} Q${x - 12},${y} ${x - 10},${y - 8} Q${x - 13},${y - 22} ${x - 8},${y - 34} Q${x - 10},${y - 44} ${x - 21},${y - 52} L${x - 14},${y - 57} Q${x - 6},${y - 49} ${x - 3},${y - 44} Q${x - 2},${y - 53} ${x + 2},${y - 61} L${x + 9},${y - 59} Q${x + 5},${y - 51} ${x + 5},${y - 43} Q${x + 10},${y - 49} ${x + 19},${y - 53} L${x + 23},${y - 47} Q${x + 12},${y - 40} ${x + 9},${y - 32} Q${x + 12},${y - 18} ${x + 10},${y - 8} Q${x + 12},${y} ${x + 22},${y + 4} Q${x + 15},${y + 6} ${x + 9},${y + 4} Q${x + 5},${y + 7} ${x},${y + 5} Q${x - 5},${y + 7} ${x - 9},${y + 4} Q${x - 15},${y + 6} ${x - 21},${y + 3} Z`;
      const idT = `saule-tronc-${f}`;
      s += `<path d="${d}" fill="${BOIS.left}" stroke="${OUT3}" stroke-width="1.2" stroke-linejoin="round"/><defs><clipPath id="${idT}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${idT})"><path d="M${x + 3},${y + 8} Q${x + 6},${y - 14} ${x + 5},${y - 32} Q${x + 9},${y - 44} ${x + 15},${y - 60} L${x + 30},${y - 60} L${x + 30},${y + 8} Z" fill="${BOIS.right}"/>` + E(x, y - 48, 22, 8, BOIS.right, 0) + `<path d="M${x - 6},${y - 6} Q${x - 7},${y - 14} ${x - 5},${y - 20} M${x + 4},${y - 10} Q${x + 5},${y - 18} ${x + 3},${y - 26} M${x - 7},${y - 30} q1,-4 -0.4,-8 M${x + 1},${y - 36} q-1,-3 0,-6" fill="none" stroke="${BOIS.bark}" stroke-width="0.8" stroke-linecap="round"/><path d="M${x - 8},${y - 4} Q${x - 9},${y - 16} ${x - 7.4},${y - 26}" fill="none" stroke="${BOIS.light}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/></g>` + E(x - 2, y - 20, 3.2, 4.4, BOIS.bark, 0.9) + E(x - 2, y - 19.4, 2, 3.2, "#2E2218", 0);
      s += feuillage(`saule-a-${f}`, [[-30, -72, 15], [-12, -84, 17], [10, -86, 17], [29, -74, 15], [-40, -60, 11], [40, -60, 11], [0, -74, 16]].map(([a, b, r]) => [x + a, y + b, r]), SAULE.fond, [[-18, -78], [4, -80, 0.9], [22, -76, 0.9], [-34, -64, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1) + feuillage(`saule-b-${f}`, [[24, -64, 13], [36, -54, 9, 0], [13, -58, 10, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[24, -58], [33, -52, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1) + feuillage(`saule-c-${f}`, [[-25, -62, 13], [-37, -54, 9, 0], [-14, -56, 10, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[-26, -56], [-34, -50, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1) + feuillage(`saule-d-${f}`, [[-1, -70, 12], [-6, -60, 9, 0], [6, -61, 9, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[-2, -64], [5, -68, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1);
      s += [[-47, -54, 52], [-42, -52, 56], [-36, -51, 50], [-30, -50, 54], [-23, -50, 30], [-15, -52, 22], [-7, -55, 16], [9, -56, 18], [16, -54, 26], [23, -52, 54], [29, -50, 62], [35, -51, 58], [41, -52, 64], [47, -54, 58]].map(([sx, sy, len], i) => meche(x + sx, y + sy, len, sw(i) + (sx < 0 ? -2 : 2), SAULE.devant, sx > 20)).join("");
      s += P2(`M${x + 14},${y + 13} a5,1.9 0 1 1 1.4,1.4 L${x + 14},${y + 13} Z`, "#6FAE4E", 0.7) + P2(`M${x + 38},${y + 17} a4,1.5 0 1 1 1.2,1.2 L${x + 38},${y + 17} Z`, "#6FAE4E", 0.7) + fleurette(x + 13, y + 11.6, "#F7B6C8") + [[-2, 12], [1, 16], [48, 11]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} l-1,-10 M${x + dx + 1.4},${y + dy} l0.6,-12 M${x + dx + 2.8},${y + dy} l1.8,-9" stroke="#5E8C3A" stroke-width="1.1" stroke-linecap="round"/>` + E(x + dx + 2, y + dy - 12.4, 0.9, 2.2, "#8A5A34", 0.5)).join("") + herbe(x - 40, y + 14, "#86B852", 0.9) + herbe(x - 24, y + 22, "#94C25C", 0.75) + fleurette(x - 32, y + 18, "#FFFFFF") + fleurette(x - 46, y + 8, "#F7B6C8");
      const [lx, ly, la] = f ? [30, -26, 140] : [34, -42, 20];
      return s + `<path d="M0,-2.6 Q1.6,0 0,2.6 Q-1.6,0 0,-2.6 Z" fill="${SAULE.devant.light}" stroke="${OUT3}" stroke-width="0.6" transform="translate(${x + lx} ${y + ly}) rotate(${la})"/>`;
    }, "draw") };
    LM3.pilotis = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), xy4 = /* @__PURE__ */ __name((p) => p.map(r23).join(","), "xy");
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "bosses");
      const CHAUME = { back: "#C99A45", front: "#E6BE6A", gable: "#8E6A44" };
      const roseaux = /* @__PURE__ */ __name((rx, ry) => `<path d="M${rx},${ry} l-1.4,-11 M${rx + 1.6},${ry} l0.4,-13 M${rx + 3.2},${ry} l2,-10 M${rx - 1.4},${ry} l-3,-7" stroke="#5E8C3A" stroke-width="1.1" stroke-linecap="round"/>` + E(rx + 0.4, ry - 13.6, 0.9, 2.4, "#8A5A34", 0.5) + E(rx + 5.4, ry - 10.6, 0.8, 2, "#8A5A34", 0.5), "roseaux");
      let s = P2(bosses(x, y + 4, 62, 27, 22), "#6FA8C8", 1.1) + E(x - 8, y + 2, 44, 16, "#8FC8E0", 0) + `<path d="M${x - 40},${y + 8} l10,-1.4 M${x + 26},${y + 20} l9,-1.2 M${x - 18},${y + 22} l7,-1" stroke="#E2F4FC" stroke-width="1.2" stroke-linecap="round"/>` + roseaux(x - 46, y - 2) + roseaux(x + 44, y - 4) + roseaux(x + 22, y - 14);
      s += [[-30, 16, 5], [40, 10, 4]].map(([dx, dy, r]) => P2(`M${x + dx},${y + dy} a${r},${r * 0.4} 0 1 1 ${r * 0.3},${r * 0.3} L${x + dx},${y + dy} Z`, "#6FAE4E", 0.7)).join("") + fleurette(x - 31, y + 14.4, "#FFFFFF");
      const pieux = [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]];
      for (const [u, v] of pieux) {
        const [px, py] = at(u, v);
        s += `<ellipse cx="${r23(px)}" cy="${r23(py + 1)}" rx="${4.4 + f * 1.2}" ry="${1.8 + f * 0.4}" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>` + post2(u, v, -3, 18, WOOD_DARK2, 0.03);
      }
      const barre = /* @__PURE__ */ __name((p, q, w, c) => `<path d="M${xy4(p)} L${xy4(q)}" stroke="${OUT3}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="M${xy4(p)} L${xy4(q)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`, "barre");
      s += barre(at(-0.22, 0.21, 3), at(0.22, 0.21, 16), 1.2, WOOD_DARK2.left) + barre(at(-0.22, 0.21, 16), at(0.22, 0.21, 3), 1.2, WOOD_DARK2.left);
      s += box2(-0.3, -0.26, 0.3, 0.32, 18, 21, WOOD2, 1);
      for (const u of [-0.18, -0.06, 0.06, 0.18]) s += L(at(u, -0.26, 21), at(u, 0.32, 21), WOOD2.right, 0.6);
      const [bx, by] = at(0.66, 0.14);
      s += `<path d="M${xy4(at(0.22, 0.18, 12))} Q${r23(bx - 10)},${r23(by - 8)} ${r23(bx - 14)},${r23(by - 4)}" stroke="#D8C8A0" stroke-width="0.8" fill="none"/><ellipse cx="${r23(bx)}" cy="${r23(by + 2)}" rx="18" ry="3.4" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>` + P2(`M${bx - 16},${by - 4} Q${bx - 12},${by + 4} ${bx},${by + 4} Q${bx + 12},${by + 4} ${bx + 16},${by - 4} Q${bx},${by - 1} ${bx - 16},${by - 4} Z`, WOOD2.left, 1) + P2(`M${bx - 13},${by - 3.4} Q${bx},${by - 0.6} ${bx + 13},${by - 3.4} Q${bx},${by + 1.6} ${bx - 13},${by - 3.4} Z`, WOOD2.right, 0) + L([bx - 2, by - 2.4], [bx + 2, by - 1.4], WOOD2.top, 1.6) + `<path d="M${bx - 6},${by - 2} L${bx + 14},${by - 9}" stroke="${OUT3}" stroke-width="2.4" stroke-linecap="round"/><path d="M${bx - 6},${by - 2} L${bx + 14},${by - 9}" stroke="${WOOD2.top}" stroke-width="1.2" stroke-linecap="round"/>` + E(bx + 15, by - 9.4, 2.4, 1.1, WOOD2.top, 0.8);
      const [lx, ly] = at(0, 0.33, 0);
      s += `<path d="M${r23(lx - 3)},${r23(ly + 2)} L${r23(lx - 3)},${r23(ly - 26)} M${r23(lx + 3)},${r23(ly + 1)} L${r23(lx + 3)},${r23(ly - 27)}" stroke="${OUT3}" stroke-width="2.4" stroke-linecap="round"/><path d="M${r23(lx - 3)},${r23(ly + 2)} L${r23(lx - 3)},${r23(ly - 26)} M${r23(lx + 3)},${r23(ly + 1)} L${r23(lx + 3)},${r23(ly - 27)}" stroke="${WOOD_DARK2.left}" stroke-width="1.1" stroke-linecap="round"/>` + [4, 10, 16, 22].map((z) => L([lx - 3, ly - z], [lx + 3, ly - z - 0.6], WOOD_DARK2.left, 1.1)).join("");
      s += box2(-0.24, -0.2, 0.2, 0.15, 21, 37, WOOD_DARK2, 1);
      for (const u of [-0.15, -0.06, 0.03, 0.12]) s += L(at(u, 0.15, 21), at(u, 0.15, 37), WOOD_DARK2.right, 0.6);
      for (const v of [-0.11, -0.02, 0.07]) s += L(at(0.2, v, 21), at(0.2, v, 37), "#56331C", 0.6);
      s += face2([[-0.18, 0.15, 21], [-0.09, 0.15, 21], [-0.09, 0.15, 32], [-0.18, 0.15, 32]], "#3D2A1E", 0.9) + E(...at(-0.105, 0.15, 26.5), 0.7, 0.7, "#E0B060", 0);
      s += face2([[0.2, -0.13, 25], [0.2, 0.01, 25], [0.2, 0.01, 33], [0.2, -0.13, 33]], "#FFD978", 0.9) + L(at(0.2, -0.06, 25), at(0.2, -0.06, 33), "#56331C", 0.8) + L(at(0.2, -0.13, 29), at(0.2, 0.01, 29), "#56331C", 0.8);
      s += Dk.gable(-0.24, -0.2, 0.2, 0.15, 37, 16, CHAUME, 0.08);
      for (const u of [-0.24, -0.13, -0.02, 0.09, 0.2]) s += L(at(u, 0.2, 38.4), at(u, 0.06, 46), "#C99A45", 0.7);
      s += [-0.26, -0.18, -0.1, -0.02, 0.06, 0.14, 0.22].map((u) => L(at(u, 0.23, 37), at(u + 0.01, 0.23, 34.8), "#B88A3E", 1)).join("");
      const [nx, ny] = at(-0.17, 0.32, 18);
      s += `<path d="M${r23(nx)},${r23(ny)} Q${r23(nx - 6)},${r23(ny + 6)} ${r23(nx - 4)},${r23(ny + 15)} L${r23(nx + 4)},${r23(ny + 18)} Q${r23(nx + 2)},${r23(ny + 8)} ${r23(nx + 6)},${r23(ny + 3)} Z" fill="#E8DCC0" fill-opacity="0.45" stroke="#CDBB92" stroke-width="0.8"/><path d="M${r23(nx - 3)},${r23(ny + 5)} l7,2 M${r23(nx - 4)},${r23(ny + 10)} l7,2.4 M${r23(nx - 1)},${r23(ny + 2)} l-1,13 M${r23(nx + 2.6)},${r23(ny + 3)} l-1.4,14" stroke="#D8C8A0" stroke-width="0.6"/>`;
      const [qx, qy] = at(0.2, 0.15, 35);
      s += L([qx, qy], [qx + 5, qy - 1], WOOD_DARK2.right, 1.2) + L([qx + 5, qy - 1], [qx + 5, qy + 2], "#3D3A36", 0.7) + `<rect x="${r23(qx + 2.8)}" y="${r23(qy + 2)}" width="4.4" height="5.6" rx="1" fill="#FFD978" stroke="${OUT3}" stroke-width="0.7"/>` + E(qx + 5, qy + 1.8, 2.6, 0.9, "#3D3A36", 0) + glow(qx + 5, qy + 5, 10, "255,214,120", f ? 0.42 : 0.34);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4 + f / 8) * TAU2, [fx, fy] = at(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 30 + i % 2 * 10);
        s += glow(fx, fy, 3, "255,236,150", 0.45) + E(fx, fy, 0.9, 0.9, "#FFF3A8", 0.3);
      }
      return s;
    }, "draw") };
    LM3.oasis = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0);
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "bosses");
      const GRES_ROSE = { top: "#F0D49A", left: "#D9B474", right: "#B48A50" };
      const palme = /* @__PURE__ */ __name((u, v, k, tag) => {
        const [px, py] = at(u, v);
        return `<g transform="translate(${r23(px)} ${r23(py)}) rotate(${f ? 1.6 : -1.2}) scale(${k})">${palmier({ vert: "doux" }).replace(/<ellipse[^>]*rgba\(40,55,20,0\.22\)[^>]*\/>/, "").replace(/(id="|url\(#)pal/g, `$1oasis${tag}${f}pal`)}</g>`;
      }, "palme");
      const lotus = /* @__PURE__ */ __name((lx, ly, col) => P2(`M${lx},${ly} a6,2.4 0 1 1 1.8,1.6 Z`, "#6FAE4E", 0.7) + [-2.6, -1.3, 0, 1.3, 2.6].map((dx) => P2(`M${r23(lx + dx * 0.6)},${ly - 0.6} Q${r23(lx + dx - 1)},${r23(ly - 3.4 + Math.abs(dx) * 0.5)} ${r23(lx + dx * 1.1)},${r23(ly - 4.6 + Math.abs(dx) * 0.8)} Q${r23(lx + dx + 1)},${r23(ly - 3.4 + Math.abs(dx) * 0.5)} ${r23(lx + dx * 0.6 + 0.4)},${ly - 0.6} Z`, col, 0.5)).join("") + E(lx + 0.3, ly - 1.4, 1.1, 0.7, "#F2C94C", 0.4), "lotus");
      let s = shadow2(0, 0, 0.8, 0.08) + P2(bosses(x, y + 4, 66, 29, 22), SAND2.top, 1.1) + E(x + 8, y + 12, 50, 14, "#F7E2B0", 0) + [[-48, 18], [40, 22], [-10, 28]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q4,-1.6 8,0 q4,1.6 8,0" stroke="${SAND2.left}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join("") + P2(bosses(x, y + 2, 47, 20.5, 26), "#8FC46A", 1);
      s += palme(-0.52, -0.42, 0.78, "a") + palme(0.46, -0.48, 0.72, "b");
      s += P2(bosses(x, y + 2, 40, 16.5, 24), SAND2.left, 0.9) + E(x, y + 2.4, 36, 14.4, WATER2, 0.9) + E(x - 6, y + 1, 24, 8, WATER_LIGHT, 0) + `<path d="M${x - 26},${y + 6} l8,-1.2 M${x + 14},${y + 10} l9,-1.2" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
      s += [0, 0.5].map((k) => {
        const p = (k + f * 0.25) % 1;
        return `<ellipse cx="${x}" cy="${y + 2}" rx="${r23(12 + p * 18)}" ry="${r23(5 + p * 7)}" fill="none" stroke="#E6F6FF" stroke-width="0.9" opacity="${r23(0.85 * (1 - p))}"/>`;
      }).join("");
      s += lotus(x - 22, y + 2, "#F7B6CE") + lotus(x + 24, y - 2, "#FFFFFF") + lotus(x - 6, y + 12, "#F7B6CE");
      s += Dk.boulder(0, 0.02, 0.13, 0.1, 11, GRES_ROSE, 4);
      const [jx, jy] = at(0, 0.02, 12), h = f ? 22 : 18;
      s += `<path d="M${jx - 2.4},${jy} Q${jx - 1.6},${jy - h * 0.7} ${jx},${jy - h} Q${jx + 1.6},${jy - h * 0.7} ${jx + 2.4},${jy} Z" fill="#DDF3FF" stroke="${OUT3}" stroke-width="0.8"/>` + [[-13, -4, -2], [-10, -2, 0], [-15, -6, 3], [13, -3, -2], [10, -1, 0], [15, -5, 3]].map(([ex, ey, hy]) => `<path d="M${jx},${jy - h} Q${r23(jx + ex * 0.65)},${jy - h - 2 - hy} ${jx + ex},${jy + ey}" stroke="#9ED4F0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.8"/><path d="M${jx},${jy - h} Q${r23(jx + ex * 0.65)},${jy - h - 2 - hy} ${jx + ex},${jy + ey}" stroke="#F2FBFF" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join("") + `<path d="M${jx - 0.6},${jy - 2} L${jx - 0.3},${jy - h + 3}" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round"/>` + (f ? [[-16, -6], [15, -9], [-8, -16], [9, -18]] : [[-17, -2], [16, -4], [-11, -12], [12, -14]]).map(([dx, dy]) => E(jx + dx, jy + dy, 1, 1.3, "#BFE6FA", 0.5)).join("") + E(jx - 12, jy - 3, 3, 1.2, "#FFFFFF", 0) + E(jx + 13, jy - 2, 3, 1.2, "#FFFFFF", 0);
      const [ax, ay] = at(0.75, 0.05);
      s += P2(`M${ax - 3},${ay} Q${ax - 6},${ay - 6} ${ax - 2.4},${ay - 10} L${ax - 2},${ay - 12} L${ax + 2},${ay - 12} L${ax + 2.4},${ay - 10} Q${ax + 6},${ay - 6} ${ax + 3},${ay} Q${ax},${ay + 1.4} ${ax - 3},${ay} Z`, "#C9764A", 0.9) + P2(`M${ax + 0.6},${ay - 10} Q${ax + 5},${ay - 6} ${ax + 2.4},${ay - 0.6} Q${ax + 4},${ay - 6} ${ax + 0.6},${ay - 10} Z`, "#A85C36", 0) + E(ax, ay - 12, 2.4, 0.8, "#7E4426", 0.7) + L([ax - 3.4, ay - 6], [ax + 3.4, ay - 6], "#F2D3A0", 0.8);
      s += herbe(x + 44, y + 6, "#9CC86A", 0.9) + herbe(x - 44, y + 12, "#8CBF5C", 0.8) + herbe(x + 30, y + 20, "#9CC86A", 0.7) + fleurette(x + 50, y + 10, "#F7B6C8") + fleurette(x - 38, y + 18, "#FFFFFF");
      return s + palme(-0.5, 0.34, 0.86, "c");
    }, "draw") };
    var GRES = { lit: "#EDCB8A", shade: "#C99E5C", joint: "#B98C4E", jointO: "#A27A40" };
    LM3.pyramide = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), c = GRES;
      let s = `<path d="M${x - 66},${y + 2} Q${x - 40},${y - 22} ${x - 8},${y - 14} Q${x + 30},${y - 26} ${x + 66},${y} Q${x},${y + 22} ${x - 66},${y + 2} Z" fill="${SAND2.top}" stroke="${OUT3}" stroke-width="1.1"/><path d="M${x - 8},${y - 14} Q${x + 30},${y - 26} ${x + 66},${y} Q${x + 30},${y - 10} ${x - 8},${y - 14} Z" fill="${SAND2.left}"/>`;
      const tip = [x, y - 64], L0 = [x - 36, y - 4], R0 = [x + 36, y - 6], B0 = [x, y + 8];
      s += poly3([L0, tip, B0], c.lit, 1.2) + poly3([tip, R0, B0], c.shade, 1.2);
      for (let i = 1; i < 7; i++) {
        const t = i / 7, l = [L0[0] + (tip[0] - L0[0]) * t, L0[1] + (tip[1] - L0[1]) * t], b = [B0[0] + (tip[0] - B0[0]) * t, B0[1] + (tip[1] - B0[1]) * t], r = [R0[0] + (tip[0] - R0[0]) * t, R0[1] + (tip[1] - R0[1]) * t];
        s += `<path d="M${r23(l[0])},${r23(l[1])} L${r23(b[0])},${r23(b[1])}" stroke="${c.joint}" stroke-width="0.8"/><path d="M${r23(b[0])},${r23(b[1])} L${r23(r[0])},${r23(r[1])}" stroke="${c.jointO}" stroke-width="0.8"/>`;
        const tp = (i - 1) / 7, lp = [L0[0] + (tip[0] - L0[0]) * tp, L0[1] + (tip[1] - L0[1]) * tp], bp = [B0[0] + (tip[0] - B0[0]) * tp, B0[1] + (tip[1] - B0[1]) * tp], rp = [R0[0] + (tip[0] - R0[0]) * tp, R0[1] + (tip[1] - R0[1]) * tp];
        for (const k of i % 2 ? [0.3, 0.7] : [0.5]) {
          const p0 = [lp[0] + (bp[0] - lp[0]) * k, lp[1] + (bp[1] - lp[1]) * k], p1 = [l[0] + (b[0] - l[0]) * k, l[1] + (b[1] - l[1]) * k];
          s += L(p0, p1, c.joint, 0.6);
          const q0 = [bp[0] + (rp[0] - bp[0]) * k, bp[1] + (rp[1] - bp[1]) * k], q1 = [b[0] + (r[0] - b[0]) * k, b[1] + (r[1] - b[1]) * k];
          s += L(q0, q1, c.jointO, 0.6);
        }
      }
      s += `<g stroke="#8A5E2E" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="${x - 22}" cy="${y - 25}" r="2.6"/><path d="M${x - 14},${y - 17} l0,-8 q0,-2.4 2.4,-2.2 q1.6,0.3 1,2"/><path d="M${x - 8},${y - 15} l3,-6 l3,6 Z"/></g>`;
      s += poly3([[x - 7, y - 52], [x, y - 64], [x, y - 49]], "#F6C744", 1) + poly3([[x, y - 64], [x + 7, y - 52], [x, y - 49]], "#D9A12E", 1) + L([x - 3, y - 55], [x - 0.6, y - 61], "#FFF1B0", 0.9);
      s += f ? sparkle2(x - 2, y - 60, 4) + glow(x, y - 58, 10, "255,220,120", 0.3) : "";
      s += `<path d="M${x - 66},${y + 6} Q${x - 34},${y - 18} ${x - 4},${y + 2} Q${x + 30},${y - 20} ${x + 66},${y + 4} Q${x},${y + 24} ${x - 66},${y + 6} Z" fill="${SAND2.top}" stroke="${OUT3}" stroke-width="1.1"/><path d="M${x - 4},${y + 2} Q${x + 30},${y - 20} ${x + 66},${y + 4} Q${x + 30},${y - 4} ${x - 4},${y + 2} Z" fill="${SAND2.left}"/>` + [[-46, 4], [-30, 8], [-12, 10], [10, 8], [32, 4]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q4,-1.6 8,0" stroke="${SAND2.right}" stroke-width="0.6" fill="none"/>`).join("") + [[-52, 8], [46, 6]].map(([dx, dy]) => `<path d="M${x + dx - 2},${y + dy} q-1,-3 -3,-4 M${x + dx},${y + dy} q0,-4 1,-5 M${x + dx + 2},${y + dy} q1,-3 3,-3.6" stroke="#B89A5A" stroke-width="0.9" fill="none" stroke-linecap="round"/>`).join("");
      return s + [0, 1, 2].map((i) => `<path d="M${x + 40 + i * 4 + f * 6},${y - 12 - i * 5} q6,-2 12,0" stroke="#FFF4D8" stroke-width="1" fill="none" stroke-linecap="round" stroke-dasharray="2 2" opacity="0.85"/>`).join("") + `<path d="M${x - 64 + f * 5},${y - 12} q7,-2 14,0" stroke="#FFF4D8" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-dasharray="2 2" opacity="0.8"/>`;
    }, "draw") };
    var JUNGLE = { devant: { light: "#BCE27E", mid: "#6FB24E", dark: "#3F7F3A" }, fond: { light: "#7CBF5A", mid: "#4E9442", dark: "#2F6634" } };
    LM3.arbre = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), BOIS = { left: "#8A623F", right: "#6A4730", bark: "#4A3020", light: "#A57A52" };
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d2 = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d2 += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d2 + " Z";
      }, "bosses");
      const T = /* @__PURE__ */ __name((lobes, marques, c, id3) => feuillage(`arbre-${id3}-${f}`, lobes.map(([a, b, r, h]) => [x + a, y + b, r, h]), c, marques.map(([a, b, k]) => [x + a, y + b, k]), 1), "T");
      const liane = /* @__PURE__ */ __name((lx, ly, len, ph, fleur) => {
        const sw = (f ? 2.4 : -1.8) * (ph % 2 ? 1 : 0.7), ex = lx + sw * 1.4, ey = ly + len, cx = lx + sw * 0.4, cy = ly + len * 0.5, d2 = `M${lx},${ly} Q${r23(cx)},${r23(cy)} ${r23(ex)},${r23(ey)}`;
        const Q = /* @__PURE__ */ __name((t) => [(1 - t) ** 2 * lx + 2 * t * (1 - t) * cx + t * t * ex, (1 - t) ** 2 * ly + 2 * t * (1 - t) * cy + t * t * ey], "Q");
        return `<path d="${d2}" stroke="${OUT3}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="${d2}" stroke="#4E8A3A" stroke-width="1.1" fill="none" stroke-linecap="round"/>` + [0.3, 0.55, 0.8].map((t) => {
          const [px2, py2] = Q(t);
          return P2(`M${r23(px2)},${r23(py2)} q-2.6,-2.4 -5,-0.6 q2.2,2 5,0.6 Z`, JUNGLE.devant.mid, 0.6) + P2(`M${r23(px2)},${r23(py2 + 1)} q2.6,-2.4 5,-0.6 q-2.2,2 -5,0.6 Z`, JUNGLE.devant.light, 0.6);
        }).join("") + (fleur ? E(ex, ey + 1, 2, 2, "#F27A9A", 0.6) + E(ex, ey + 1, 0.8, 0.8, "#F2C94C", 0) : E(ex, ey + 1, 1.8, 1.2, JUNGLE.devant.light, 0.6));
      }, "liane");
      const feuilles = /* @__PURE__ */ __name((fx, fy, angles, len) => angles.map((ang, i) => `<g transform="translate(${fx} ${fy}) rotate(${ang})"><path d="M0,0 Q${r23(len * 0.5)},${r23(-len * 0.38)} ${len},0 Q${r23(len * 0.5)},${r23(len * 0.3)} 0,0 Z" fill="${i % 2 ? "#7DBE58" : "#5FA244"}" stroke="${OUT3}" stroke-width="0.9" stroke-linejoin="round"/><path d="M1,0 Q${r23(len * 0.5)},${r23(-len * 0.08)} ${r23(len - 1.5)},0" stroke="#3F7F3A" stroke-width="0.7" fill="none"/></g>`).join(""), "feuilles");
      let s = shadow2(0, 0, 0.8, 0.12) + P2(bosses(x, y + 4, 64, 28, 22), "#78B356", 1.1) + E(x - 6, y + 2, 46, 18, "#8CC466", 0) + [[-44, 16], [38, 18], [-10, 26], [50, 6]].map(([dx, dy]) => E(x + dx, y + dy, 2.4, 1.2, "#6AA34A", 0)).join("");
      s += T([[-46, -100, 17], [46, -102, 17], [-28, -118, 21], [26, -120, 21], [0, -127, 20.5], [-60, -90, 12], [60, -92, 12]], [[-30, -112], [10, -122, 0.9], [40, -104, 0.9], [-52, -94, 0.8]], JUNGLE.fond, "a");
      s += liane(x - 30, y - 92, 34, 1, false) + liane(x + 20, y - 94, 30, 2, false);
      const racine = /* @__PURE__ */ __name(([dx, dy, sd, h]) => {
        const T0 = [x + sd * 13, y - h], Pt = [x + dx, y + dy], B0 = [x + sd * 3, y + 4];
        return P2(`M${T0[0]},${T0[1]} Q${r23(x + dx * 0.62)},${r23(y - h * 0.18)} ${Pt[0]},${Pt[1]} Q${r23(x + dx * 0.5)},${r23(y + dy + 0.6)} ${B0[0]},${B0[1]} L${x + sd * 9},${y - h * 0.4} Z`, sd < 0 ? BOIS.left : BOIS.right, 1.1) + `<path d="M${r23(T0[0] + sd * 0.6)},${r23(T0[1] + 2)} Q${r23(x + dx * 0.6)},${r23(y - h * 0.12)} ${r23(Pt[0] - sd * 1.6)},${r23(Pt[1] - 1.2)}" stroke="${sd < 0 ? BOIS.light : BOIS.bark}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
      }, "racine");
      s += [[-44, 1, -1, 30], [44, 3, 1, 28]].map(racine).join("");
      const d = `M${x - 17},${y - 2} Q${x - 11},${y - 48} ${x - 15},${y - 94} L${x + 15},${y - 94} Q${x + 11},${y - 48} ${x + 17},${y - 2} Q${x},${y + 4} ${x - 17},${y - 2} Z`, idT = `arbre-tronc-${f}`;
      s += `<path d="${d}" fill="${BOIS.left}" stroke="${OUT3}" stroke-width="1.2" stroke-linejoin="round"/><defs><clipPath id="${idT}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${idT})"><path d="M${x + 4},${y + 4} Q${x + 7},${y - 48} ${x + 4},${y - 96} L${x + 20},${y - 96} L${x + 20},${y + 4} Z" fill="${BOIS.right}"/>` + E(x, y - 88, 20, 8, BOIS.right, 0) + [-10, -5, 0, 9, 13].map((dx, i) => `<path d="M${x + dx},${y} Q${x + dx * 0.7 + (i % 2 ? 1.5 : -1.5)},${y - 46} ${x + dx * 0.9},${y - 92}" stroke="${BOIS.bark}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`).join("") + `<path d="M${x - 12},${y - 8} Q${x - 9},${y - 46} ${x - 12},${y - 86}" stroke="${BOIS.light}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.8"/><path d="M${x - 18},${y - 40} q5,-5 10,-2 q4,3 0,7 q-5,3 -10,0 Z" fill="#6FA84A"/><path d="M${x - 16},${y - 41} q4,-3 7,-1.6" stroke="#9CCB6A" stroke-width="1" fill="none" stroke-linecap="round"/></g>` + E(x + 2, y - 58, 4, 5.6, BOIS.bark, 0.9) + E(x + 2, y - 57.4, 2.6, 4, "#2E1E12", 0);
      s += [[-27, 11, -1, 22], [25, 11, 1, 20]].map(racine).join("");
      s += P2(`M${x - 12},${y - 82} Q${x - 30},${y - 94} ${x - 52},${y - 92} L${x - 52},${y - 86} Q${x - 30},${y - 86} ${x - 11},${y - 72} Z`, BOIS.left, 1.1) + P2(`M${x + 12},${y - 80} Q${x + 30},${y - 90} ${x + 52},${y - 88} L${x + 52},${y - 82} Q${x + 30},${y - 82} ${x + 11},${y - 70} Z`, BOIS.right, 1.1);
      s += T([[-46, -98, 14], [-58, -92, 9, 0], [-34, -94, 10, 0]], [[-46, -92], [-56, -88, 0.8]], JUNGLE.devant, "b") + T([[48, -102, 14], [60, -96, 9, 0], [36, -98, 10, 0]], [[48, -96], [58, -92, 0.8]], JUNGLE.devant, "c") + T([[-12, -114, 15], [13, -116, 15], [0, -106, 12, 0]], [[-12, -108], [12, -110, 0.9], [0, -102, 0.8]], JUNGLE.devant, "d");
      s += liane(x - 48, y - 88, 44, 0, true) + liane(x - 38, y - 88, 28, 1, false) + liane(x + 42, y - 88, 46, 3, true) + liane(x + 54, y - 90, 30, 2, false);
      const [px, py] = [x + 28, y - 84];
      s += (f ? P2(`M${px - 1},${py - 7} q-9,-9 -14,-4 q5,2 10,7 Z`, "#3D7FD0", 0.8) + P2(`M${px + 1},${py - 7} q9,-9 14,-4 q-5,2 -10,7 Z`, "#3D7FD0", 0.8) : "") + P2(`M${px - 1},${py - 1} l-1.6,8 l3,-1 l1,-7 Z`, "#3D7FD0", 0.8) + E(px, py - 5, 3.4, 5, "#E2402F", 0.9) + (f ? "" : P2(`M${px - 2.6},${py - 7} q-1.6,4 0.6,8 q2,-3 1.4,-7 Z`, "#3D7FD0", 0.6)) + E(px + 1, py - 11, 2.8, 2.8, "#E2402F", 0.9) + P2(`M${px + 3.4},${py - 12} q3.2,0.6 1.6,4 q-1,-1.6 -2,-1.6 Z`, "#F2C04B", 0.6) + E(px + 1.8, py - 11.6, 0.9, 0.9, "#FFFFFF", 0) + E(px + 2, py - 11.6, 0.5, 0.5, "#2A2420", 0) + E(px - 0.6, py - 3.6, 1.2, 1.6, "#F2C04B", 0);
      s += feuilles(x - 44, y + 14, [-160, -125, -95, -55], 12) + feuilles(x + 44, y + 14, [-125, -85, -55, -20], 12) + champignon(x - 22, y + 14) + champignon(x - 16, y + 16) + fleurette(x + 24, y + 18, "#F27A9A") + fleurette(x + 30, y + 16, "#F2C94C") + fleurette(x - 30, y + 22, "#F27A9A") + herbe(x + 8, y + 20, "#86B852", 0.8);
      return s;
    }, "draw") };
    LM3.cascade = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), R = { lit: "#B49C7A", mid: "#9A8262", shade: "#7C6648", strate: "#8C7454", ledge: "#C8B290" };
      const BUIS = { light: "#C9EC8E", mid: "#86C35C", dark: "#4F8E40" };
      const buisson = /* @__PURE__ */ __name((bx, by, k, id3) => feuillage(`cascade-${id3}-${f}`, [[bx - 5 * k, by, 5.4 * k], [bx + 5 * k, by - 0.6 * k, 5.8 * k], [bx, by - 4.4 * k, 6.2 * k]], BUIS, [[bx, by - 2 * k, 0.7]], 1), "buisson");
      const galet2 = /* @__PURE__ */ __name((gx, gy, r) => E(gx, gy, r, r * 0.62, R.shade, 0.9) + E(gx - r * 0.15, gy - r * 0.16, r * 0.76, r * 0.42, R.mid, 0) + E(gx - r * 0.38, gy - r * 0.3, r * 0.32, r * 0.15, R.ledge, 0), "galet");
      const crete = [[-62, -94], [-48, -100], [-30, -97], [-14, -101], [14, -101], [30, -98], [46, -101], [62, -95]];
      let face3 = `M${x - 60},${y - 2} Q${x - 66},${y - 30} ${x - 61},${y - 58} Q${x - 66},${y - 78} ${x + crete[0][0]},${y + crete[0][1]}`;
      for (let i = 1; i < crete.length; i++) {
        const [a0, b0] = crete[i - 1], [a1, b1] = crete[i];
        face3 += ` Q${x + (a0 + a1) / 2},${y + Math.min(b0, b1) - 3} ${x + a1},${y + b1}`;
      }
      face3 += ` Q${x + 66},${y - 74} ${x + 61},${y - 52} Q${x + 66},${y - 26} ${x + 60},${y - 4} Q${x},${y + 6} ${x - 60},${y - 2} Z`;
      const idF = `cascade-face-${f}`;
      let s = `<defs><clipPath id="${idF}"><path d="${face3}"/></clipPath></defs><path d="${face3}" fill="${R.lit}"/><g clip-path="url(#${idF})"><path d="M${x + 26},${y - 110} Q${x + 34},${y - 50} ${x + 24},${y + 10} L${x + 80},${y + 10} L${x + 80},${y - 110} Z" fill="${R.shade}"/><path d="M${x - 58},${y - 6} Q${x - 62},${y - 40} ${x - 57},${y - 86}" stroke="${R.ledge}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>` + [-86, -78, -58, -50, -30, -20].map((dy, i) => `<path d="M${x - 70},${y + dy} Q${x - 30},${y + dy + (i % 2 ? 2 : -2)} ${x},${y + dy} T${x + 70},${y + dy}" stroke="${R.strate}" stroke-width="0.9" fill="none"/>`).join("") + [-68, -40].map((dy) => `<path d="M${x - 70},${y + dy + 2} Q${x - 30},${y + dy + 5} ${x},${y + dy + 3} T${x + 70},${y + dy + 2} L${x + 70},${y + dy + 6} Q${x + 30},${y + dy + 8} ${x},${y + dy + 7} T${x - 70},${y + dy + 6} Z" fill="${R.shade}" opacity="0.7"/><path d="M${x - 70},${y + dy - 2} Q${x - 30},${y + dy + 1} ${x},${y + dy - 1} T${x + 70},${y + dy - 2} L${x + 70},${y + dy + 2} Q${x + 30},${y + dy + 4} ${x},${y + dy + 3} T${x - 70},${y + dy + 2} Z" fill="#8FC46A"/><path d="M${x - 70},${y + dy + 2} ${Array.from({ length: 28 }, (_, k) => `q2.5,${k % 2 ? 2.2 : 3.4} 5,0`).join(" ")}" stroke="#6FA84E" stroke-width="1" fill="none"/>`).join("") + `<path d="M${x - 40},${y - 14} l3,-6 l-1,-5 M${x + 40},${y - 80} l-2,6 l2,4" stroke="${R.shade}" stroke-width="0.8" fill="none" stroke-linecap="round"/></g><path d="${face3}" fill="none" stroke="${OUT3}" stroke-width="1.2" stroke-linejoin="round"/>`;
      let herbeTop = `M${x + crete[0][0] - 2},${y + crete[0][1] + 1}`;
      for (let i = 1; i < crete.length; i++) {
        const [a0, b0] = crete[i - 1], [a1, b1] = crete[i];
        herbeTop += ` Q${x + (a0 + a1) / 2},${y + Math.min(b0, b1) - 7} ${x + a1},${y + b1 - 4}`;
      }
      herbeTop += ` L${x + 63},${y - 92}`;
      for (let i = crete.length - 1; i > 0; i--) {
        const [a0, b0] = crete[i], [a1, b1] = crete[i - 1];
        herbeTop += ` Q${x + (a0 + a1) / 2 - 1},${y + Math.max(b0, b1) + 4} ${x + a1},${y + b1 + 2}`;
      }
      s += P2(herbeTop + " Z", "#8FC46A", 1);
      s += buisson(x - 46, y - 102, 1, "a") + buisson(x + 44, y - 103, 0.9, "b") + buisson(x - 52, y - 72, 0.7, "c") + buisson(x + 50, y - 44, 0.75, "d") + buisson(x - 34, y - 44, 0.6, "e");
      s += P2(`M${x - 12},${y - 99} Q${x - 9},${y - 103} ${x - 6},${y - 106} Q${x + 1},${y - 108} ${x + 8},${y - 106} Q${x + 10},${y - 103} ${x + 12},${y - 99} Z`, "#7FC0E2", 0.9) + `<path d="M${x - 4},${y - 104} l5,-0.6 M${x + 1},${y - 101} l6,-0.4" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>`;
      const rideau = `M${x - 12},${y - 99} Q${x - 14},${y - 50} ${x - 16},${y - 4} L${x + 16},${y - 4} Q${x + 14},${y - 50} ${x + 12},${y - 99} Z`, idR = `cascade-rideau-${f}`;
      s += `<defs><clipPath id="${idR}"><path d="${rideau}"/></clipPath></defs><path d="${rideau}" fill="#CFEAF7"/><g clip-path="url(#${idR})"><path d="M${x + 4},${y - 100} L${x + 20},${y - 100} L${x + 20},${y} L${x + 6},${y} Z" fill="#A8D8F0"/>` + Array.from({ length: 7 }, (_, j) => {
        const xx = x - 11 + j * 3.7, off = (f * 0.5 + j * 0.37) % 1 * 36;
        return [0, 36, 72].map((o) => `<path d="M${r23(xx)},${r23(y - 108 + off + o)} l${r23((xx - x) * 0.04)},20" stroke="${j % 2 ? "#FFFFFF" : "#86C6E8"}" stroke-width="1.4" stroke-linecap="round"/>`).join("");
      }).join("") + `</g><path d="${rideau}" fill="none" stroke="${OUT3}" stroke-width="1"/>`;
      s += puff2(x - 2, y - 99, 4.4, 0.95) + puff2(x + 6, y - 100, 3.6, 0.9) + puff2(x - 15, y - 66, 3.4, 0.85) + puff2(x + 15, y - 64, 3.2, 0.85) + puff2(x - 16, y - 38, 3.4, 0.85) + puff2(x + 16, y - 37, 3.2, 0.85);
      s += E(x, y + 4, 46, 13, WATER2, 1.1) + E(x - 6, y + 3, 30, 7, WATER_LIGHT, 0) + `<path d="M${x - 34},${y + 8} l8,-1 M${x + 22},${y + 11} l9,-1.2" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>` + galet2(x - 44, y + 4, 5) + galet2(x - 36, y + 12, 3.6) + galet2(x + 42, y + 6, 4.6) + galet2(x + 34, y + 13, 3.2) + puff2(x - 12, y - 4, 7, 0.9) + puff2(x + 10, y - 6, 6.4, 0.85) + puff2(x, y + 1, 6, 0.95) + puff2(x - 4 + f * 4, y - 14 - f * 3, 5, 0.6) + puff2(x + 8 - f * 4, y - 20 - f * 2, 4, 0.45);
      s += `<g opacity="0.6">${["#E8566A", "#F2A03C", "#F2D04B", "#7EC45B", "#5C8FD0", "#8C6FD0"].map((c, i) => {
        const r = 40 - i * 2.6;
        return `<path d="M${r23(x - r)},${y - 4} A${r23(r)},${r23(r * 0.85)} 0 0 1 ${r23(x + r)},${y - 4}" stroke="${c}" stroke-width="2.6" fill="none"/>`;
      }).join("")}</g>`;
      return s + herbe(x - 30, y + 16, "#86B852", 0.9) + herbe(x + 28, y + 17, "#94C25C", 0.8) + fleurette(x - 22, y + 18, "#FFFFFF") + fleurette(x + 36, y + 17, "#F7B6C8");
    }, "draw") };
    LM3.geyser = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), K2 = 1.25;
      const festons = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.04 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "festons");
      const terrasse = /* @__PURE__ */ __name((rx, ry, z, top, mur) => {
        const cy = y - z * K2, h = 4.4 * K2;
        const bas = /* @__PURE__ */ __name((i) => {
          const t = Math.PI - i / 16 * Math.PI;
          return [x + Math.cos(t) * rx, cy + Math.sin(t) * ry + h];
        }, "bas");
        let wall = `M${x - rx},${r23(cy)} L${r23(bas(0)[0])},${r23(bas(0)[1])}`;
        for (let i = 1; i <= 16; i++) {
          const [px, py] = bas(i), [qx, qy] = bas(i - 1);
          wall += ` Q${r23((px + qx) / 2)},${r23((py + qy) / 2 + 2.2)} ${r23(px)},${r23(py)}`;
        }
        wall += ` L${x + rx},${r23(cy)} Z`;
        return P2(wall, mur, 1) + P2(festons(x, cy, rx, ry, 30), top, 1);
      }, "terrasse");
      let s = shadow2(0, 0, 0.7, 0.08) + E(x, y + 4, 62, 24, "#E9E1C8", 0.8) + E(x - 6, y + 4, 44, 15, "#F2EBD6", 0);
      s += terrasse(54, 21, 0, "#FBF6EA", "#E2D6BC") + terrasse(40, 15.6, 4.4, "#FFFBF2", "#E6DCC4") + terrasse(27, 10.6, 8.8, "#FFFDF7", "#EAE1CB");
      s += [[-34, 6, 7, 2.6], [28, 8, 6, 2.2], [-20, -3, 5, 1.8], [18, -2, 4.6, 1.6], [-8, 12, 6, 2]].map(([dx, dy, rx, ry]) => E(x + dx, y + dy - (dy < 0 ? 5.5 : 0), rx, ry, "#7FCBEA", 0.6) + E(x + dx - rx * 0.3, y + dy - (dy < 0 ? 5.5 : 0) - ry * 0.3, rx * 0.4, ry * 0.3, "#C8EEFA", 0)).join("");
      const [ex, ey] = [x, y - 13.2 * K2];
      s += E(ex, ey, 20, 7.8, "#F2A65A", 0) + E(ex, ey, 16, 6.2, "#F2D267", 0) + E(ex, ey, 12.4, 4.8, "#9ACB6A", 0) + E(ex, ey, 9.6, 3.7, "#3E8FC8", 0.9) + E(ex, ey, 6, 2.2, "#2E6FB0", 0) + E(ex - 2.6, ey - 0.8, 2.8, 0.8, "#9AE0F8", 0);
      s += [[-56, 10, 3.4], [50, 14, 3], [12, 26, 2.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.6, "#7E786E", 0.7) + E(x + dx - r * 0.3, y + dy - r * 0.2, r * 0.4, r * 0.2, "#A9A39A", 0)).join("");
      if (!f) return s + puff2(ex - 2, ey - 9, 5.4, 0.8) + puff2(ex + 4, ey - 19, 4.4, 0.6) + puff2(ex - 1, ey - 27, 3.4, 0.45);
      s += `<path d="M${ex - 4.6},${ey} Q${ex - 6},${ey - 40} ${ex - 3},${ey - 74} L${ex + 3},${ey - 74} Q${ex + 6},${ey - 40} ${ex + 4.6},${ey} Z" fill="#E8F6FF" stroke="${OUT3}" stroke-width="0.9"/><path d="M${ex - 1.4},${ey - 4} Q${ex - 2.4},${ey - 36} ${ex - 1},${ey - 68}" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${ex + 2.6},${ey - 8} Q${ex + 3.4},${ey - 36} ${ex + 1.6},${ey - 60}" stroke="#B8DCF0" stroke-width="0.8" fill="none"/>`;
      s += puff2(ex, ey - 78, 10, 0.92) + puff2(ex - 12, ey - 66, 6.4, 0.85) + puff2(ex + 12, ey - 68, 6.4, 0.85) + puff2(ex - 9, ey - 6, 6, 0.7) + puff2(ex + 10, ey - 4, 5, 0.6);
      return s + [[-18, -50], [20, -46], [-24, -30], [26, -26], [-14, -16], [16, -12]].map(([dx, dy]) => E(ex + dx, ey + dy, 1, 1.4, "#9AD6F0", 0.5)).join("");
    }, "draw") };
    LM3.cratere = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const [x, y] = at(0, 0), B = { lit: "#77707E", mid: "#524C5C", dark: "#36313F" };
      const bosses = /* @__PURE__ */ __name((cx, cy, rx, ry, n) => {
        const pts3 = Array.from({ length: n }, (_, i) => {
          const t = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
          return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r];
        });
        const mil = /* @__PURE__ */ __name((i) => {
          const p = pts3[i % n], q = pts3[(i + 1) % n];
          return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
        }, "mil");
        let d = `M${mil(n - 1)}`;
        for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${mil(i)}`;
        return d + " Z";
      }, "bosses");
      const bloc = /* @__PURE__ */ __name((bx, by, r, k, chaud) => P2(bosses(bx, by, r, r * 0.72, 7 + k % 3), B.mid, 1) + E(bx - r * 0.18, by - r * 0.26, r * 0.66, r * 0.36, B.lit, 0) + E(bx - r * 0.34, by - r * 0.36, r * 0.26, r * 0.12, "#9C96A4", 0) + (chaud ? `<path d="M${r23(bx - r * 0.7)},${r23(by + r * 0.3)} Q${bx},${r23(by + r * 0.75)} ${r23(bx + r * 0.7)},${r23(by + r * 0.3)}" stroke="#F0843A" stroke-width="1.4" fill="none" stroke-linecap="round"/>` : ""), "bloc");
      let s = shadow2(0, 0, 0.8, 0.14) + P2(bosses(x, y + 4, 64, 28, 22), "#6E6460", 1.1) + E(x - 6, y + 4, 46, 17, "#7C726C", 0) + `<path d="M${x - 50},${y + 10} l7,3 l4,-2 l6,4 M${x + 38},${y + 16} l6,-3 l5,2 M${x - 14},${y + 24} l5,-2 l6,2" stroke="#E0602E" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x - 50},${y + 10} l7,3 l4,-2 l6,4 M${x + 38},${y + 16} l6,-3 l5,2 M${x - 14},${y + 24} l5,-2 l6,2" stroke="#FFC46A" stroke-width="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + [[-40, 20, 2.4], [46, 6, 2], [22, 24, 1.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.6, B.dark, 0.6)).join("");
      const blocs = Array.from({ length: 14 }, (_, k) => {
        const a = k / 14 * TAU2 + 0.2;
        return { k, bx: x + Math.cos(a) * 38, by: y - 2 + Math.sin(a) * 16.5, r: 7 + k * 5 % 4, fond: Math.sin(a) < 0 };
      });
      s += blocs.filter((b) => b.fond).map((b) => bloc(b.bx, b.by - 2, b.r, b.k, true)).join("");
      s += E(x, y - 2, 33, 13.4, "#B83A28", 1) + E(x, y - 2.6, 29, 11.4, "#EE7430", 0) + E(x - 3, y - 3.4, 21, 7.8, "#FFB040", 0) + E(x - 5, y - 4, 11, 4, "#FFE39A", 0);
      s += [[-16, 2, 0], [14, -6, 1], [6, 5, 2]].map(([dx, dy, k]) => {
        const cx = x + dx + (f ? (k - 1) * 1.2 : 0), cy = y + dy;
        return P2(`M${cx - 6},${cy} L${cx - 3},${cy - 3} L${cx + 4},${cy - 2.6} L${cx + 7},${cy + 0.4} L${cx + 2},${cy + 2.6} L${cx - 4},${cy + 2.2} Z`, "#4A3A36", 0.6) + L([cx - 2, cy - 2.4], [cx + 1, cy + 2.2], "#FF9A44", 0.7);
      }).join("");
      s += (f ? [[-6, -6, 2.6, 1], [18, 0, 2, 0], [-22, -2, 1.6, 0]] : [[8, -8, 2.2, 0], [-14, -5, 2.8, 1], [20, 2, 1.6, 0]]).map(([dx, dy, r, crev]) => crev ? `<ellipse cx="${x + dx}" cy="${y + dy}" rx="${r * 1.8}" ry="${r * 0.7}" fill="none" stroke="#FFE39A" stroke-width="0.9"/>` + [[-1, -1], [1, -1.2], [0, -1.6]].map(([gx, gy]) => E(x + dx + gx * r * 1.4, y + dy + gy * r * 1.6, 0.8, 1, "#FFC24A", 0)).join("") : E(x + dx, y + dy, r, r * 0.8, "#FFC24A", 0.7) + E(x + dx - r * 0.3, y + dy - r * 0.3, r * 0.35, r * 0.25, "#FFF1C0", 0)).join("");
      s += glow(x, y - 6, 40, "255,140,60", f ? 0.3 : 0.24);
      s += blocs.filter((b) => !b.fond).map((b) => bloc(b.bx, b.by, b.r, b.k, false)).join("");
      const fumee = /* @__PURE__ */ __name((cx, cy, r, a) => `<g opacity="${a}">${E(cx, cy, r, r * 0.72, "#8A8290", 0)}${E(cx + r * 0.6, cy - r * 0.3, r * 0.7, r * 0.55, "#A29AA6", 0)}${E(cx - r * 0.5, cy - r * 0.25, r * 0.6, r * 0.5, "#B4AEB8", 0)}</g>`, "fumee");
      s += fumee(x - 6, y - 24 - f * 6, 8, 0.75) + fumee(x + 4, y - 40 - f * 6, 7, 0.55) + fumee(x - 2, y - 56 - f * 4, 6, 0.35);
      return s + (f ? [[-14, -22], [12, -30], [4, -16]] : [[-10, -30], [16, -20], [-2, -38]]).map(([dx, dy]) => E(x + dx, y + dy, 1, 1, "#FFB040", 0) + E(x + dx, y + dy, 0.4, 0.4, "#FFF1C0", 0)).join("");
    }, "draw") };
    module.exports = { LM: LM3, LAND: LAND2 };
  }
});

// atelier/decor2.js
var require_decor2 = __commonJS({
  "atelier/decor2.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, L, r2: r23 } = require_troupe2();
    var { arbre } = require_arbres();
    var K2 = 1.25;
    var W = 0.88;
    var TAU2 = Math.PI * 2;
    var up2 = /* @__PURE__ */ __name((body) => `<g transform="scale(${K2})">${body}</g>`, "up");
    var big2 = /* @__PURE__ */ __name((f) => f.map((n) => r23(n * K2)), "big");
    var gp = /* @__PURE__ */ __name((u, v, z = 0) => [(u - v) * 32, (u + v) * 16 - z], "gp");
    var pg = /* @__PURE__ */ __name((pts3, fill, w = W, sc = OUT3) => `<polygon points="${pts3.map((p) => `${r23(p[0])},${r23(p[1])}`).join(" ")}" fill="${fill}"${w ? ` stroke="${sc}" stroke-width="${w}" stroke-linejoin="round"` : ""}/>`, "pg");
    var rr = /* @__PURE__ */ __name((x, y, w, h, r, fill, sw = W, sc = OUT3, extra = "") => `<rect x="${r23(x)}" y="${r23(y)}" width="${r23(w)}" height="${r23(h)}" rx="${r23(r)}" fill="${fill}"${sw ? ` stroke="${sc}" stroke-width="${sw}" stroke-linejoin="round"` : ""}${extra}/>`, "rr");
    var line = /* @__PURE__ */ __name((d, w, c, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r23(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "line");
    var tk2 = /* @__PURE__ */ __name((d, w, c) => line(d, w + 1.76, OUT3) + line(d, w, c), "tk");
    var shade = /* @__PURE__ */ __name((x, y, rx, ry, a = 0.22) => E(x, y, rx, ry, `rgba(40,55,20,${a})`, 0), "shade");
    var star2 = /* @__PURE__ */ __name((x, y, s, o = 1) => `<path d="M${r23(x)},${r23(y - s)} Q${r23(x + s * 0.18)},${r23(y - s * 0.18)} ${r23(x + s)},${r23(y)} Q${r23(x + s * 0.18)},${r23(y + s * 0.18)} ${r23(x)},${r23(y + s)} Q${r23(x - s * 0.18)},${r23(y + s * 0.18)} ${r23(x - s)},${r23(y)} Q${r23(x - s * 0.18)},${r23(y - s * 0.18)} ${r23(x)},${r23(y - s)} Z" fill="#FFFFFF" stroke="${OUT3}" stroke-width="0.4" opacity="${o}"/>`, "star");
    function gbox(u0, v0, u1, v1, z0, z1, c, w = W * 0.8) {
      const q = /* @__PURE__ */ __name((u, v, z) => gp(u, v, z), "q");
      return pg([q(u0, v1, z0), q(u1, v1, z0), q(u1, v1, z1), q(u0, v1, z1)], c.left, w) + pg([q(u1, v1, z0), q(u1, v0, z0), q(u1, v0, z1), q(u1, v1, z1)], c.right, w) + pg([q(u0, v0, z1), q(u1, v0, z1), q(u1, v1, z1), q(u0, v1, z1)], c.top, w);
    }
    __name(gbox, "gbox");
    var WOOD2 = { top: "#C99A62", left: "#B07A45", right: "#8A5A32" };
    var WOOD_DARK2 = { top: "#8A5E38", left: "#6E4A2C", right: "#55381F" };
    var cube = /* @__PURE__ */ __name((cx, cy, s) => pg([[cx - s, cy], [cx, cy + s * 0.5], [cx, cy - s * 0.9], [cx - s, cy - s * 1.4]], "#F4EEE8", 0) + pg([[cx, cy + s * 0.5], [cx + s, cy], [cx + s, cy - s * 1.4], [cx, cy - s * 0.9]], "#DCD2C8", 0) + pg([[cx - s, cy - s * 1.4], [cx, cy - s * 0.9], [cx + s, cy - s * 1.4], [cx, cy - s * 1.9]], "#FFFFFF", 0) + pg([[cx - s, cy], [cx, cy + s * 0.5], [cx + s, cy], [cx + s, cy - s * 1.4], [cx, cy - s * 1.9], [cx - s, cy - s * 1.4]], "none", 0.7), "cube");
    var G2 = {
      // Cristaux de glace : une plaque de neige aux bords bosselés, des grappes d'aiguilles à facettes (pan clair, pan d'ombre,
      // pointe éclairée, reflet) qui scintillent ; ramassés, des moignons dans la neige
      glace: {
        frames: [[-30, -46, 60, 56], [-24, -16, 48, 26]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const neige = /* @__PURE__ */ __name((rx, ry) => {
            const n = 14, pts3 = Array.from({ length: n }, (_, i) => {
              const t2 = i / n * TAU2, r = 1 + (i % 2 ? 0.06 : -0.03);
              return [Math.cos(t2) * rx * r, 1 + Math.sin(t2) * ry * r];
            });
            const m = /* @__PURE__ */ __name((i) => {
              const p = pts3[i % n], q = pts3[(i + 1) % n];
              return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
            }, "m");
            let d = `M${m(n - 1)}`;
            for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${m(i)}`;
            return P2(d + " Z", "#FFFFFF", W) + E(rx * 0.15, 2, rx * 0.7, ry * 0.5, "#E2EEF6", 0);
          }, "neige");
          const facette = /* @__PURE__ */ __name((x, y, h, w, lean = 0) => {
            const tip = [x + lean, y - h], bl = [x - w, y], br = [x + w, y], fb = [x, y + w * 0.45];
            return pg([bl, tip, fb], "#C9ECFA", 0) + pg([fb, tip, br], "#8CCBE8", 0) + pg([tip, [bl[0] + (tip[0] - bl[0]) * 0.72, bl[1] + (tip[1] - bl[1]) * 0.72], [fb[0] + (tip[0] - fb[0]) * 0.72, fb[1] + (tip[1] - fb[1]) * 0.72]], "#F6FDFF", 0) + L([x - w * 0.45, y - h * 0.12], [x - w * 0.15 + lean * 0.6, y - h * 0.6], "rgba(255,255,255,.9)", 0.7) + pg([bl, tip, br, fb], "none", W * 0.9);
          }, "facette");
          if (spent) return neige(14, 5) + facette(-6, 1, 5, 3.4, -1) + facette(5, 1.6, 6, 3.6, 1) + facette(0, 3.4, 4, 3);
          const fa = /* @__PURE__ */ __name((x, y, h, w, lean) => facette(x, y, h * t, w * (0.5 + 0.5 * t), lean * t), "fa");
          return shade(0, 2, 18, 6, 0.12) + neige(19, 7) + fa(-12, 0, 13, 3.6, -3) + fa(-7, -1, 21, 4.6, -1.5) + fa(9, -1, 15, 4, 2.6) + fa(13, 1.4, 9, 3, 3) + fa(-1, 2.4, 33, 6.2, 0.6) + fa(5, 4.6, 18, 4.4, 1.6) + fa(-5, 5, 10, 3.2, -1) + E(-1, 6.4, 9, 1.8, "#FFFFFF", 0) + (t < 0.6 ? "" : f ? star2(9, -17 * t, 2.6) + star2(-8, -22 * t, 2.2) : star2(0, -31 * t, 3.2) + star2(14, -8 * t, 1.8));
        }, "draw")
      },
      // Moutons à tondre : un pré aux bords bosselés, ses touffes et ses fleurettes ; deux brebis laineuses en bouclettes
      // cernées d'un seul trait, tête noire, oreilles, œil, queue, qui broutent tour à tour ; tondues, rosées et lisses, elles
      // broutent au milieu des flocons de laine tombés
      laine: {
        frames: [[-30, -26, 60, 34], [-30, -24, 60, 32]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const pre = /* @__PURE__ */ __name(() => {
            const n = 16, rx = 25, ry = 6.4, pts3 = Array.from({ length: n }, (_, i) => {
              const t2 = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
              return [Math.cos(t2) * rx * r, 0.4 + Math.sin(t2) * ry * r];
            });
            const m = /* @__PURE__ */ __name((i) => {
              const p = pts3[i % n], q = pts3[(i + 1) % n];
              return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
            }, "m");
            let d = `M${m(n - 1)}`;
            for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${m(i)}`;
            return P2(d + " Z", "#9CC874", W) + E(-3, 0.2, 18, 4, "#AED486", 0);
          }, "pre");
          const brebis = /* @__PURE__ */ __name((x, y, laineux, broute, flip = false, l2 = 1) => {
            const s = flip ? -1 : 1, Lc = laineux ? "#F7F2E6" : "#EFDCCF", LS = laineux ? "#E2D8C4" : "#DCC4B6";
            let o = shade(x, y + 1.4, 8.6, 2.2) + [-4.4, -1.8, 2, 4.6].map((dx, i) => line(`M${r23(x + s * dx)},${r23(y - 2.6)} L${r23(x + s * dx)},${r23(y + 1.2)}`, 1.8, OUT3) + line(`M${r23(x + s * dx)},${r23(y - 2.6)} L${r23(x + s * dx)},${r23(y + 0.8)}`, 1, i % 2 ? "#5E5660" : "#463F48")).join("");
            o += '<g transform="translate(0 1.1)">' + E(x - s * 7.4, y - 6, 1.7, 1.6, Lc, W * 0.8);
            if (laineux) {
              const B = [[-6, -6.4, 3.1], [-3.4, -9.2, 3.3], [0.4, -9.8, 3.5], [4, -8.8, 3.2], [6.2, -6.2, 2.9], [3.4, -4.6, 3.3], [-1, -4.4, 3.5], [-5, -4.6, 2.9]];
              o += B.map(([dx, dy, r]) => E(x + s * dx, y + dy, r * l2 + W, r * l2 + W, OUT3, 0)).join("") + B.map(([dx, dy, r]) => E(x + s * dx, y + dy, r * l2, r * l2, Lc, 0)).join("") + E(x + s * 0.5, y - 3.4, 6, 1.5, LS, 0) + [[-3.6, -7.2], [0.6, -7.8], [3.8, -6.6], [-1.6, -4.8], [2.6, -4.4], [-5, -5]].map(([dx, dy]) => line(`M${r23(x + s * dx - 1)},${r23(y + dy)} q1,-1.2 2,0`, 0.6, LS)).join("") + E(x - s * 1.4, y - 9.6, 2, 0.8, "#FFFFFF", 0);
            } else {
              o += P2(`M${r23(x - 6.8)},${r23(y - 4)} Q${r23(x - 7.2)},${r23(y - 8.6)} ${r23(x - 2)},${r23(y - 8.8)} L${r23(x + 3)},${r23(y - 9)} Q${r23(x + 7.4)},${r23(y - 8.6)} ${r23(x + 6.8)},${r23(y - 4)} Q${r23(x + 6)},${r23(y - 1.6)} ${x},${r23(y - 1.8)} Q${r23(x - 6.2)},${r23(y - 1.6)} ${r23(x - 6.8)},${r23(y - 4)} Z`, Lc, W) + [[-3.6, -6.8], [0.4, -7.4], [3.8, -6.6], [-1.6, -4.4], [2.4, -4.2]].map(([dx, dy]) => E(x + s * dx, y + dy, 0.9, 0.7, "#F8EAE0", 0)).join("") + E(x + s, y - 2.8, 5.2, 0.9, LS, 0);
            }
            const F = "#5E5660", hx = x + s * 8, hy = y - 7.6 + (broute ? 4.4 : 0), ex = hx + s * 0.6, ey = hy - 0.7;
            return o + E(hx - s * 2.6, hy - 1.4, 2.1, 1, F, 0.6) + E(hx - s * 2.9, hy - 1.4, 1.1, 0.45, "#8A7A80", 0) + E(hx, hy, 3.7, 3.4, F, W) + E(hx - s * 0.9, hy - 1.2, 1.6, 1, "#7A7280", 0) + E(hx + s * 1.6, hy + 1.2, 1.8, 1.35, "#4E4650", 0) + E(ex, ey, 0.86, 1.12, "#2A2420", 0) + E(ex + s * 0.3, ey - 0.44, 0.38, 0.38, "#FFFFFF", 0) + E(ex - s * 0.3, ey + 0.5, 0.17, 0.17, "#FFFFFF", 0) + E(hx + s * 0.1, hy + 1.3, 0.9, 0.45, "#F7A8B0", 0) + (laineux ? E(hx - s * 0.8, hy - 2.9, 2.2, 1.4, Lc, 0.6) : "") + (broute ? line(`M${r23(hx + s * 1.8)},${r23(hy + 3.9)} l${-s * 0.6},-2.6 M${r23(hx + s * 2.8)},${r23(hy + 3.9)} l${s * 0.6},-2.2`, 0.8, "#5F8F3C") : "") + "</g>";
          }, "brebis");
          const deco = tuft3(-23, 3) + tuft3(19, 4.6) + tuft3(-4, 5.6) + flower(-17, 4.6, 1.1, "#FFFFFF") + flower(21, 0.6, 1.1, "#F7B6C8") + flower(12, 5.6, 1, "#FFFFFF");
          if (spent) return pre() + deco + [[-20, 0], [-2, 5], [16, -1], [0, -4]].map(([x, y]) => E(x, y, 1.6, 1.1, "#F7F2E6", 0.6) + E(x + 1.2, y - 0.4, 1, 0.8, "#F7F2E6", 0.5)).join("") + brebis(-11, -2, false, 1) + brebis(6, 4, false, 0);
          const l = 0.6 + 0.4 * t;
          return pre() + deco + brebis(-11, -2, true, f ? 0 : 1, false, l) + brebis(6, 4, true, f ? 1 : 0, false, l);
        }, "draw")
      },
      // Roseaux : une petite mare à la berge herbue, ses reflets et ses ronds ; une touffe de massettes cernées aux épis
      // bruns éclairés et à la pointe fine, de longues feuilles en lame, un nénuphar fleuri ; elles ondulent ; coupés, des
      // tiges courtes au biseau clair
      roseau: {
        frames: [[-24, -44, 48, 52], [-20, -14, 40, 22]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const mare = /* @__PURE__ */ __name((rx, ry) => E(0, 1.4, rx + 2.4, ry + 1.6, "#86B852", W) + E(0, 1.4, rx, ry, "#7FC0E2", W) + E(-rx * 0.25, 0.8, rx * 0.55, ry * 0.45, "#A6D8F0", 0) + line(`M${r23(-rx * 0.5)},${r23(ry * 0.5)} l4,-0.5 M${r23(rx * 0.2)},${r23(ry * 0.8)} l3,-0.4`, 0.8, "#FFFFFF"), "mare");
          const lame = /* @__PURE__ */ __name((x, y, h, sw2, c) => {
            const d = `M${r23(x - 1.1)},${y} Q${r23(x + sw2 * 0.4 - 1)},${r23(y - h * 0.55)} ${r23(x + sw2)},${r23(y - h)} Q${r23(x + sw2 * 0.4 + 1.2)},${r23(y - h * 0.5)} ${r23(x + 1.1)},${y} Z`;
            return P2(d, c, W * 0.8) + line(`M${x},${y - 1} Q${r23(x + sw2 * 0.4)},${r23(y - h * 0.5)} ${r23(x + sw2 * 0.9)},${r23(y - h * 0.92)}`, 0.5, "#4E7A30");
          }, "lame");
          const massette = /* @__PURE__ */ __name((x, y, h, sw2) => {
            const tx = x + sw2, ty = y - h;
            return tk2(`M${r23(x)},${r23(y)} q${r23(sw2 * 0.3)},${r23(-h * 0.5)} ${r23(sw2)},${r23(-h)}`, 1.1, "#5F8F3C") + rr(tx - 1.8, ty + 1.5, 3.6, 7.4, 1.8, "#8A5A2E", W * 0.8) + line(`M${r23(tx - 0.7)},${r23(ty + 2.8)} L${r23(tx - 0.7)},${r23(ty + 7.6)}`, 0.7, "#B88552") + line(`M${r23(tx)},${r23(ty + 1.5)} l${r23(sw2 * 0.08)},-3.4`, 0.7, "#5F8F3C");
          }, "massette");
          if (spent) return mare(12, 4) + [-8, -4, 0, 4, 8].map((dx, k) => {
            const yb = k % 2 * 2, h = 5 + k % 3 * 1.6;
            return tk2(`M${dx},${yb} L${r23(dx + 0.3)},${r23(yb - h)}`, 1.2, "#5F8F3C") + pg([[dx - 0.8, yb - h + 0.6], [dx + 1.4, yb - h - 0.6], [dx + 1.4, yb - h + 0.4]], "#C8DC8A", 0);
          }).join("") + lame(-6, 2, 5, -1.4, "#7FA45A") + lame(6, 2.4, 6, 1.6, "#8FB866");
          const sw = /* @__PURE__ */ __name((k) => (f ? 1.6 : -1.4) * (0.6 + k % 3 * 0.3), "sw");
          const g = 0.5 + 0.5 * t;
          let o = shade(0, 2, 17, 5, 0.12) + mare(14, 4.6);
          o += lame(-11, 1, 16 * g, -4 + sw(0) * 0.5, "#7FA45A") + lame(9, 1.4, 18 * g, 4 + sw(1) * 0.5, "#7FA45A");
          if (t > 0.5) [[-12, 20], [-9, 26], [-5, 32], [-1, 36], [3, 30], [7, 34], [11, 24]].forEach(([dx, h], k) => {
            o += massette(dx, k % 2 * 2, h * t, sw(k));
          });
          o += lame(-7, 2.4, 12 * g, -2.4 + sw(2) * 0.4, "#8FB866") + lame(1, 3, 14 * g, 1.4 + sw(3) * 0.4, "#8FB866") + lame(6, 2.6, 10 * g, 2.6 + sw(4) * 0.4, "#9CC470");
          return o + P2("M8,4.4 a3.4,1.3 0 1 1 1,1 Z", "#6FAE4E", W * 0.7) + E(8.6, 3.6, 1.1, 0.8, "#F7B6CE", 0.5) + `<ellipse cx="-6" cy="5" rx="${2.4 + f}" ry="${0.8 + f * 0.3}" fill="none" stroke="#E2F4FC" stroke-width="0.6"/>`;
        }, "draw")
      },
      // Croûte de sel : une plaque blanche aux bords bosselés, craquelée en alvéoles, une flaque de saumure rosée ; des cubes de
      // sel empilés qui accrochent le soleil ; ramassée, une croûte grise grattée, ses fentes et quelques grains
      sel: {
        frames: [[-30, -26, 60, 36], [-26, -10, 52, 20]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const plaque = /* @__PURE__ */ __name((rx, ry, fill, edge) => {
            const n = 16, pts3 = Array.from({ length: n }, (_, i) => {
              const t2 = i / n * TAU2, r = 1 + (i % 2 ? 0.05 : -0.03);
              return [Math.cos(t2) * rx * r, 0.6 + Math.sin(t2) * ry * r];
            });
            const m = /* @__PURE__ */ __name((i) => {
              const p = pts3[i % n], q = pts3[(i + 1) % n];
              return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
            }, "m");
            let d = `M${m(n - 1)}`;
            for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${m(i)}`;
            return P2(d + " Z", fill, W) + E(rx * 0.12, ry * 0.25, rx * 0.8, ry * 0.55, edge, 0);
          }, "plaque");
          const alveoles = /* @__PURE__ */ __name((c) => line("M-16,-1 l5,-2 l6,1 l4,-2 l7,1 M-11,-3 l1,4 l-4,3 M-5,-2 l2,4 l6,1 l2,3 M3,-3 l1,4 l7,1 M11,2 l3,-3 M-8,4 l5,1", 0.7, c), "alveoles");
          if (spent) return plaque(20, 7.6, "#E2DAD0", "#D6CCC0") + alveoles("#B8AB9A") + line("M-12,-1 q4,2 8,0 M4,3 q4,-1.6 8,0", 0.9, "#C8BCAC") + [[-6, 1], [7, -1], [1, 4]].map(([x, y]) => E(x, y, 1, 0.7, "#FFFFFF", 0.4)).join("");
          return shade(0, 2, 22, 7, 0.12) + plaque(22, 8.4, "#FFFFFF", "#F2EEE8") + E(7, 0.4, 8.6, 3, "#F4C6D0", 0.5) + E(5.6, -0.2, 4.6, 1.3, "#FBE2E8", 0) + alveoles("#DDD3C8") + cube(-13, 0.6, 2.2 * t) + cube(-2, -2.6, 2.8 * t) + cube(11, -2, 2.4 * t) + cube(-7, 3, 3.2 * t) + cube(3.6, 3.4, 3.8 * t) + cube(14, 3, 1.9 * t) + cube(-15, 4, 1.5 * t) + (t < 0.6 ? "" : f ? star2(-8, -6, 2.4) + star2(14, -7, 1.6) : star2(4, -8, 2.8) + star2(-13, -3, 1.6));
        }, "draw")
      },
      // Arbre à fruits : un petit manguier (l'arbre refait, en vert profond) chargé de mangues dorées, rosies au soleil, qui
      // se balance ; cueilli, il garde ses feuilles
      fruits: {
        frames: [[-24, -50, 48, 58], [-24, -50, 48, 58]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const peau = t < 0.5 ? "#9CCB5A" : t < 1 ? "#E2D45A" : "#F6C443", joue = t < 0.5 ? "#7FB24A" : t < 1 ? "#E8B04A" : null;
          const mangue = /* @__PURE__ */ __name((x, y, s, i) => P2(`M${r23(x)},${r23(y - 2.4 * s)} Q${r23(x + 2.5 * s)},${r23(y - 2 * s)} ${r23(x + 2.1 * s)},${r23(y + 0.9 * s)} Q${r23(x + 1.3 * s)},${r23(y + 3 * s)} ${r23(x - 0.4 * s)},${r23(y + 2.7 * s)} Q${r23(x - 2.5 * s)},${r23(y + 1.7 * s)} ${r23(x - 1.9 * s)},${r23(y - 0.6 * s)} Q${r23(x - 1.3 * s)},${r23(y - 2.6 * s)} ${r23(x)},${r23(y - 2.4 * s)} Z`, peau, 0.9) + E(x + 0.7 * s, y + 1.1 * s, 1.2 * s, 0.9 * s, joue || (i % 3 ? "#F2924A" : "#EE7A5A"), 0) + E(x - 0.8 * s, y - 0.9 * s, 0.45 * s, 0.7 * s, "#FFF6D0", 0) + line(`M${r23(x)},${r23(y - 2.3 * s)} q0.3,-1.4 1,-2`, 0.9, OUT3), "mangue");
          const fruits = spent ? "" : [[-20, -38], [-11, -45], [-25, -45], [-5, -36], [3, -51], [10, -39], [18, -35], [21, -43], [-2, -59], [12, -56]].map(([x, y], i) => mangue(x, y, 1.15 * (0.55 + 0.45 * t), i)).join("");
          return `<g transform="rotate(${spent ? 0 : f ? 1.2 : -1.2}) scale(${r23(0.86 / K2)})">${arbre({ vert: "profond", petit: true })}${fruits}</g>`;
        }, "draw")
      },
      // Éclats d'obsidienne : une plaque de cendre aux bords bosselés et ses fentes de braise ; des lames noires à facettes au
      // reflet violet, qui luisent de braises au pied ; ramassés, des cailloux sombres dans la cendre
      obsidienne: {
        frames: [[-28, -38, 56, 48], [-22, -12, 44, 20]],
        draw: /* @__PURE__ */ __name((spent, f, t = 1) => {
          const cendre = /* @__PURE__ */ __name((rx, ry) => {
            const n = 14, pts3 = Array.from({ length: n }, (_, i) => {
              const t2 = i / n * TAU2, r = 1 + (i % 2 ? 0.06 : -0.03);
              return [Math.cos(t2) * rx * r, 1 + Math.sin(t2) * ry * r];
            });
            const m = /* @__PURE__ */ __name((i) => {
              const p = pts3[i % n], q = pts3[(i + 1) % n];
              return `${r23((p[0] + q[0]) / 2)},${r23((p[1] + q[1]) / 2)}`;
            }, "m");
            let d = `M${m(n - 1)}`;
            for (let i = 0; i < n; i++) d += ` Q${r23(pts3[i][0])},${r23(pts3[i][1])} ${m(i)}`;
            return P2(d + " Z", "#6E6460", W) + E(rx * 0.1, 1.6, rx * 0.7, ry * 0.5, "#7C726C", 0);
          }, "cendre");
          const caillou = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, "#2E2B36", W) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.45, ry * 0.3, "#4A4258", 0) + E(x - rx * 0.4, y - ry * 0.45, rx * 0.15, ry * 0.12, "#B9A6E8", 0), "caillou");
          const lame = /* @__PURE__ */ __name((x, y, h, w, lean = 0) => {
            const tip = [x + lean, y - h], bl = [x - w, y], br = [x + w, y], fb = [x, y + w * 0.45];
            return pg([bl, tip, fb], "#3A3644", 0) + pg([fb, tip, br], "#1E1C24", 0) + pg([tip, [bl[0] + (tip[0] - bl[0]) * 0.7, bl[1] + (tip[1] - bl[1]) * 0.7], [fb[0] + (tip[0] - fb[0]) * 0.7, fb[1] + (tip[1] - fb[1]) * 0.7]], "#5A5068", 0) + L([x - w * 0.45, y - h * 0.1], [x - w * 0.12 + lean * 0.6, y - h * 0.62], `rgba(185,166,232,${f ? 0.95 : 0.55})`, 0.9) + pg([bl, tip, br, fb], "none", W * 0.9);
          }, "lame");
          const braises = line("M-12,3 l3,1.4 l3,-1 M6,4 l3,-1.2 l3,1", 1.2, "#E0602E") + line("M-12,3 l3,1.4 l3,-1 M6,4 l3,-1.2 l3,1", 0.5, "#FFC46A");
          if (spent) return cendre(14, 5) + caillou(-4, 1.4, 4.6, 3) + caillou(6, 2.4, 3.8, 2.6) + caillou(1, 4.8, 3, 2);
          const la = /* @__PURE__ */ __name((x, y, h, w, lean) => lame(x, y, h * t, w * (0.5 + 0.5 * t), lean * t), "la");
          return shade(0, 2, 16, 5, 0.18) + cendre(17, 6) + braises + E(0, 2, 13, 3.6, `rgba(255,120,50,${f ? 0.3 : 0.18})`, 0) + la(-10, 0, 13, 4, -3) + la(-6, -1, 19, 4.6, -1.4) + la(8, 0, 17, 4.6, 2.4) + la(12, 2, 9, 3, 2.6) + caillou(7, 6, 4, 2.6) + la(0, 3.4, 26, 5.8, 0.4) + la(-4, 5, 10, 3.2, -1) + E(-5, 4, 1.4, 0.8, f ? "#FF8A4A" : "#E8573A", 0) + E(4, 6.4, 1, 0.6, f ? "#FFB04A" : "#E8573A", 0) + (t < 0.6 ? "" : f ? star2(0, -24 * t, 2.4) + star2(-7, -17 * t, 1.6) : star2(9, -15 * t, 1.8));
        }, "draw")
      }
    };
    var SW = { light: "#D39A5E", mid: "#B07A45", dark: "#7E5230", deep: "#5E3B22" };
    var IRON3 = "#3B3C42";
    function stake(x, y0, y1, w = 3.2, sharp = false, c = SW) {
      const h = w / 2;
      return pg([[x - h, y0], [x - h, y1], ...sharp ? [[x, y1 - 2.4]] : [], [x + h, y1], [x + h, y0]], c.mid) + L([x + h * 0.4, y0 - 0.4], [x + h * 0.4, y1 + 0.8], c.dark, h * 0.6);
    }
    __name(stake, "stake");
    var tuft3 = /* @__PURE__ */ __name((x, y) => tk2(`M${x},${y} l-2.2,-3.6 M${x + 0.6},${y} l0.2,-4.4 M${x + 1.2},${y} l1.8,-3.2`, 0.8, "#7DBF55"), "tuft");
    function flower(x, y, r, color) {
      let o = "";
      for (let k = 0; k < 5; k++) {
        const a = k / 5 * TAU2 - Math.PI / 2;
        o += E(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, r * 0.62, r * 0.62, color, 0.4);
      }
      return o + E(x, y, r * 0.48, r * 0.48, "#F6C443", 0.3);
    }
    __name(flower, "flower");
    var leaf3 = /* @__PURE__ */ __name((x, y, a, color) => `<ellipse cx="${r23(x)}" cy="${r23(y)}" rx="2.6" ry="1.2" fill="${color}" stroke="${OUT3}" stroke-width="0.4" transform="rotate(${r23(a * 180 / Math.PI)} ${r23(x)} ${r23(y)})"/>`, "leaf");
    function butterfly3(x, y, open, color) {
      const w = open ? 2.4 : 0.9;
      return E(x - w * 0.62, y, w, 1.9, color, 0.5) + E(x + w * 0.62, y, w, 1.9, color, 0.5) + L([x, y - 1.6], [x, y + 1.6], "#3A2A20", 0.7);
    }
    __name(butterfly3, "butterfly");
    var framed = /* @__PURE__ */ __name((x, y, w, h, r, fill, edge, ew) => rr(x, y, w, h, r, "none", ew + 1.5, OUT3) + rr(x, y, w, h, r, fill, ew, edge), "framed");
    var S2 = {};
    S2.bois = { n: 1, draw: /* @__PURE__ */ __name(() => shade(0, 0.6, 19, 4) + stake(-15, 1, -33, 3.2, true) + stake(15, 1, -33, 3.2, true) + rr(-20, -29.6, 42, 17, 2, SW.deep, 0) + rr(-21, -31, 42, 17, 2, SW.light) + L([-20.4, -22.5], [20.4, -22.5], SW.dark, 0.9) + L([-19, -29.7], [19, -29.7], "rgba(255,255,255,.3)", 0.8) + L([-19, -21.4], [19, -21.4], "rgba(255,255,255,.2)", 0.7) + L([-14, -26], [-6, -26.3], "rgba(126,82,48,.35)", 0.5) + L([7, -17.4], [16, -17.1], "rgba(126,82,48,.35)", 0.5) + [[-18.6, -28.6], [18.6, -28.6], [-18.6, -16.4], [18.6, -16.4]].map(([x, y]) => E(x, y, 0.85, 0.85, "#4E3626", 0)).join("") + tuft3(-18, 1) + tuft3(13.5, 1.4), "draw") };
    S2.ardoise = { n: 1, draw: /* @__PURE__ */ __name(() => {
      const chalk = "rgba(244,241,232,.85)";
      return shade(0, 0.6, 21, 4) + tk2("M-12,-37 L-17,1 M12,-37 L17,1", 1.8, SW.deep) + pg([[-15.5, -38], [15.5, -38], [20, -6], [-20, -6]], SW.mid) + pg([[-13.2, -35.6], [13.2, -35.6], [17.2, -8.6], [-17.2, -8.6]], "#2F3533", 0.6, "#1E2221") + L([-12.6, -34.4], [12, -34.4], "rgba(255,255,255,.08)", 1.2) + rr(-21, -7, 42, 2.6, 1, SW.dark, 0.6) + tk2("M-19.5,-4.4 L-20.5,1 M19.5,-4.4 L20.5,1", 1.6, SW.mid) + line("M-10,-20.5 q2.5,-2 5,0 t5,0 t5,0 t5,0", 0.8, chalk) + `<path d="M0,-17.2 l0.9,1.9 2,.2 -1.5,1.3 .5,2 -1.9,-1 -1.9,1 .5,-2 -1.5,-1.3 2,-.2z" fill="${chalk}"/>` + E(-7, -14, 0.6, 0.6, chalk, 0) + E(7, -14, 0.6, 0.6, chalk, 0) + E(-9.5, -12, 0.5, 0.5, chalk, 0) + rr(5, -8.3, 5, 1.4, 0.6, "#F7F4EC", 0.4) + L([-14, -9.6], [-6, -9.4], "rgba(244,241,232,.25)", 0.6);
    }, "draw") };
    var FER_PIVOT = [0, -43];
    S2.fer = { n: 4, draw: /* @__PURE__ */ __name((f) => {
      const deg = 0.06 * Math.sin(f / 4 * TAU2) * 180 / Math.PI;
      const chain2 = /* @__PURE__ */ __name((x) => `<line x1="${x}" y1="-42.8" x2="${x}" y2="-35.2" stroke="${IRON3}" stroke-width="1.2" stroke-dasharray="1.5 0.9"/>`, "chain");
      return shade(-20, 0.6, 6, 2.6) + shade(0, 0.6, 13, 2.8) + E(-20, 0.2, 4.2, 1.6, "#55565C", W * 0.7) + rr(-21.3, -47, 2.6, 47.5, 0.8, IRON3, W * 0.6) + L([-19.6, -46], [-19.6, 0], "rgba(255,255,255,.2)", 0.6) + E(-20, -48.6, 2.1, 2.1, IRON3, W * 0.6) + E(-20.6, -49.2, 0.7, 0.7, "rgba(255,255,255,.4)", 0) + rr(-20, -44.4, 40, 2.2, 1, IRON3, W * 0.6) + E(20.4, -43.3, 1.5, 1.5, IRON3, W * 0.6) + line("M-19.6,-33 C-12,-33.5 -8,-37 -6.5,-42.4", 1.4, IRON3) + `<circle cx="-12.4" cy="-37.6" r="2.3" fill="none" stroke="${IRON3}" stroke-width="1.1"/>` + E(-11.2, -38.2, 0.7, 0.7, IRON3, 0) + `<g transform="rotate(${r23(deg)} ${FER_PIVOT[0]} ${FER_PIVOT[1]})">` + chain2(-12) + chain2(12) + rr(-16.2, -34, 34, 16, 2.5, "#3E2716", 0) + framed(-17, -35, 34, 16, 2.5, "#5B3B24", "#D9A441", 1.3) + rr(-15.2, -33.2, 30.4, 12.4, 1.6, "none", 0.6, "rgba(255,222,150,.3)") + E(-12, -34.6, 1.1, 1.1, "#D9A441", 0.4) + E(12, -34.6, 1.1, 1.1, "#D9A441", 0.4) + "</g>";
    }, "draw") };
    S2.laiton = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const stone3 = "#BDB5A8";
      return '<defs><linearGradient id="laiton-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE29A"/><stop offset=".45" stop-color="#E2B04B"/><stop offset="1" stop-color="#B57F24"/></linearGradient><clipPath id="laiton-plaque"><rect x="-18" y="-28" width="36" height="16" rx="1.6"/></clipPath></defs>' + shade(0, 0.6, 25, 4.5) + rr(-23, -5, 46, 5.6, 1.4, "#A39B8E", W * 0.8) + rr(-21, -31, 42, 27, 2, stone3) + L([-21, -17.5], [-18.2, -17.5], "rgba(90,80,70,.4)", 0.6) + L([18.2, -12], [21, -12], "rgba(90,80,70,.4)", 0.6) + L([-8, -4.6], [-8, -10.6], "rgba(90,80,70,.35)", 0.6) + L([9, -4.6], [9, -10.6], "rgba(90,80,70,.35)", 0.6) + rr(-24, -34.4, 48, 4.6, 1.6, "#D3CCC0") + L([-22, -33.2], [22, -33.2], "rgba(255,255,255,.55)", 0.7) + framed(-18, -28, 36, 16, 1.6, "url(#laiton-brass)", "#8A6418", 0.9) + rr(-16.4, -26.4, 32.8, 12.8, 1, "none", 0.6, "rgba(255,248,220,.65)") + [[-16.2, -26.2], [16.2, -26.2], [-16.2, -13.8], [16.2, -13.8]].map(([x, y]) => E(x, y, 0.95, 0.95, "#FFF1C2", 0) + E(x + 0.2, y + 0.25, 0.45, 0.45, "#A9781F", 0)).join("") + E(-20, -2.4, 1.6, 1.6, "#7FA65A", 0.5) + E(-17.4, -1.6, 1.1, 1.1, "#9BC46E", 0.5) + E(19.6, -2, 1.3, 1.3, "#7FA65A", 0.5) + (f ? `<g clip-path="url(#laiton-plaque)"><polygon points="4,-28 9,-28 3,-12 -2,-12" fill="rgba(255,255,240,.6)"/><polygon points="11,-28 12.4,-28 6.4,-12 5,-12" fill="rgba(255,255,240,.45)"/></g>` : "");
    }, "draw") };
    var PETALS = ["#F7A8C8", "#FFFFFF", "#FFD166", "#C9A7EB"];
    S2.fleurie = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      let garland2 = "";
      for (let k = 0; k <= 12; k++) {
        const x = -24 + k * 4;
        garland2 += leaf3(x, -30.4 - 1.8 * Math.sin(Math.PI * (x + 24) / 48) + 0.6, k % 2 ? 0.5 : -0.5, k % 2 ? "#6FAE4E" : "#8FCB6A");
      }
      for (let k = 0; k <= 6; k++) {
        const x = -22 + k * 7.3;
        garland2 += flower(x, -31.4 - 1.8 * Math.sin(Math.PI * (x + 24) / 48), 1.9, PETALS[k % 4]);
      }
      const bunch = /* @__PURE__ */ __name((x, y) => leaf3(x - 2, y - 1, -0.8, "#6FAE4E") + leaf3(x + 2.2, y - 1.2, 0.8, "#8FCB6A") + flower(x - 1.6, y - 3.6, 1.6, "#F7A8C8") + flower(x + 1.8, y - 2.8, 1.4, "#FFFFFF"), "bunch");
      const a = f ? Math.PI : 0;
      return shade(0, 0.6, 20, 4) + stake(-17, 1, -28, 3, false, { mid: "#F3EBDD", dark: "#D6CBB8" }) + stake(17, 1, -28, 3, false, { mid: "#F3EBDD", dark: "#D6CBB8" }) + rr(-20.2, -28, 42, 17, 3, "#D9C9A8", 0) + framed(-21, -29.2, 42, 17, 3, "#FFF4DC", "#7FA866", 1.2) + rr(-19, -27.2, 38, 13, 2, "none", 0.6, "rgba(127,168,102,.55)", ' stroke-dasharray="1.6 1.2"') + garland2 + bunch(-17, 1.4) + bunch(16.6, 1.6) + butterfly3(-24 + 3 * Math.cos(a), -38 + 2.2 * Math.sin(2 * a), !f, "#F59AC0") + butterfly3(22 + 2.6 * Math.cos(a + 2.2), -35.5 + 2 * Math.sin(2 * a + 1), !!f, "#9CC8F2");
    }, "draw") };
    S2.lanterne = { n: 2, draw: /* @__PURE__ */ __name((f) => {
      const one = /* @__PURE__ */ __name((x, kk) => pg([[x - 3.6, -38.6], [x + 3.6, -38.6], [x + 2.4, -40.6], [x - 2.4, -40.6]], IRON3, 0.5) + rr(x - 3.2, -38.6, 6.4, 8.4, 1, `rgba(255,${r23(205 + 25 * kk)},${r23(120 + 30 * kk)},.95)`, 0.9, IRON3) + E(x, -33.8, 1.3 + 0.3 * kk, 2.4 + 0.7 * kk, "#FFF4C8", 0) + L([x, -38.6], [x, -30.2], "rgba(59,60,66,.6)", 0.6) + pg([[x - 3, -30.2], [x + 3, -30.2], [x + 1.4, -28.8], [x - 1.4, -28.8]], IRON3, 0.5), "one");
      return shade(0, 0.6, 24, 4) + stake(-19, 1, -42, 3.2, false, { mid: SW.dark, dark: SW.deep }) + stake(19, 1, -42, 3.2, false, { mid: SW.dark, dark: SW.deep }) + pg([[-27, -43.6], [0, -50.4], [27, -43.6]], "#8A5536") + rr(-27, -44.6, 54, 3.6, 1.2, SW.mid, W * 0.8) + L([-25, -43.6], [25, -43.6], "rgba(255,255,255,.25)", 0.6) + rr(-16.2, -35.2, 34, 17, 2, "#1E2B4A", 0) + framed(-17, -36.4, 34, 17, 2, "#2F3F68", "#E2B546", 1.3) + star2(-14, -33.4, 1.2) + star2(13.6, -33, 1) + E(-13.4, -22.6, 0.45, 0.45, "#F4E3A8", 0) + E(14, -22.2, 0.55, 0.55, "#F4E3A8", 0) + L([-24, -41], [-24, -38.6], IRON3, 0.8) + L([24, -41], [24, -38.6], IRON3, 0.8) + one(-24, f ? 1 : 0) + one(24, f ? 0 : 1);
    }, "draw") };
    var SIGN_TEXT2 = {
      bois: { x: 0, y: -22.5, w: 34, h: 12, size: 9.5, font: "Fraunces 800", color: "#4A2C16" },
      ardoise: { x: 0, y: -27.6, w: 26, h: 10, size: 8.6, font: "Nunito 800", color: "#F4F1E8" },
      fer: { x: 0, y: -27, w: 28, h: 11, size: 9, font: "Fraunces 700", color: "#F3DC9C", pivot: FER_PIVOT },
      laiton: { x: 0, y: -19.8, w: 31, h: 10, size: 9, font: "Fraunces 800", color: "#5A3A10" },
      fleurie: { x: 0, y: -20.6, w: 34, h: 10, size: 9, font: "Fraunces 700", color: "#3F6B35" },
      lanterne: { x: 0, y: -27.9, w: 28, h: 11, size: 9, font: "Fraunces 700", color: "#F4D27A", light: [[-24, -34, 18], [24, -34, 18]] }
    };
    for (const t of Object.values(SIGN_TEXT2)) {
      for (const k of ["x", "y", "w", "h", "size"]) t[k] = r23(t[k] * K2);
      if (t.pivot) t.pivot = big2(t.pivot);
      if (t.light) t.light = t.light.map(big2);
    }
    var SIGN_FRAME2 = [-32, -56, 64, 62];
    var PROP_BOX2 = [-40, -92, 80, 112];
    var BUILDING_BOX2 = [-76, -124, 152, 168];
    var M2 = {};
    M2.ponton = { frame: BUILDING_BOX2, n: 1, draw: /* @__PURE__ */ __name(() => {
      const [wx, wy] = gp(0, 0.05, -1);
      let o = E(wx, wy, 36, 15, "rgba(255,255,255,.32)", 0) + E(wx - 4, wy - 1, 24, 8, "rgba(255,255,255,.22)", 0);
      for (const [u, v] of [[0.38, -0.18], [-0.38, 0.18], [0.38, 0.18], [0, 0.18]]) {
        const [px, py] = gp(u, v, -10);
        o += `<ellipse cx="${r23(px)}" cy="${r23(py + 1)}" rx="4.4" ry="1.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="0.7"/>` + gbox(u - 0.035, v - 0.035, u + 0.035, v + 0.035, -10, 2, WOOD_DARK2);
      }
      o += gbox(-0.42, -0.2, 0.42, 0.2, 2, 5, WOOD2);
      for (let k = -3; k <= 3; k++) o += L(gp(k * 0.12 + 0.06, -0.2, 5), gp(k * 0.12 + 0.06, 0.2, 5), "rgba(90,55,25,.5)", 0.8) + E(...gp(k * 0.12, 0.16, 5), 0.5, 0.35, "#5A3A20", 0) + E(...gp(k * 0.12, -0.16, 5), 0.5, 0.35, "#5A3A20", 0);
      o += L(gp(-0.42, 0.2, 3.5), gp(0.42, 0.2, 3.5), "rgba(90,55,25,.35)", 0.6);
      const [l0x, l0y] = gp(-0.1, 0.21, 4), [l1x, l1y] = gp(-0.1, 0.21, -9);
      o += tk2(`M${r23(l0x - 3)},${r23(l0y)} L${r23(l1x - 3)},${r23(l1y)} M${r23(l0x + 3)},${r23(l0y)} L${r23(l1x + 3)},${r23(l1y)}`, 0.9, WOOD_DARK2.left) + [3, 7, 11].map((d) => L([l0x - 3, l0y + d], [l0x + 3, l0y + d], WOOD_DARK2.left, 0.9)).join("");
      const [cx, cy] = gp(0.3, 0.05, 5);
      o += gbox(0.26, 0.01, 0.34, 0.09, 5, 11, WOOD_DARK2) + E(cx, cy - 6.4, 3.2, 1.4, WOOD_DARK2.top, W * 0.7) + E(cx - 1, cy - 2.4, 4, 1.6, "none", 0).replace('fill="none" stroke="none"', `fill="none" stroke="#D9C08A" stroke-width="1.2"`) + tk2(`M${r23(cx + 2)},${r23(cy - 4)} q6,2 9,8 q2,5 6,9`, 1, "#D9C08A");
      const [bx, by] = gp(-0.28, -0.05, 5);
      return o + P2(`M${r23(bx - 3)},${r23(by - 6)} L${r23(bx + 3)},${r23(by - 6)} L${r23(bx + 2.4)},${r23(by)} L${r23(bx - 2.4)},${r23(by)} Z`, "#8A9AA8", W * 0.8) + E(bx, by - 6, 3, 1, "#5E6E7A", W * 0.6);
    }, "draw") };
    M2.barque_volante = { frame: [-32, -56, 64, 68], n: 2, draw: /* @__PURE__ */ __name((f) => {
      const belly = f ? 6 : 3;
      const coque = "M-22,-6 L20,-6 Q24,-7 25,-12 Q27,-14 26,-9 Q24,4 9,6 L-12,6 Q-20,4 -22,-6 Z";
      const volute = /* @__PURE__ */ __name((x, y, r, a) => `<path d="M${r23(x - r)},${y} a${r},${r} 0 1 1 ${r23(r * 0.9)},${r23(r * 0.6)} a${r23(r * 0.5)},${r23(r * 0.5)} 0 1 1 ${r23(-r * 0.4)},${r23(-r * 0.7)}" fill="none" stroke="rgba(214,244,255,${a})" stroke-width="1.2" stroke-linecap="round"/>`, "volute");
      return E(0, 7, 23, 5, "rgba(120,210,255,.28)", 0) + E(-4, 8.6, 15, 2.6, "rgba(191,240,255,.45)", 0) + volute(-14 + (f ? 2 : 0), 8, 2.4, 0.75) + volute(6 - (f ? 2 : 0), 8.6, 2, 0.6) + volute(16, 7 + (f ? 1 : 0), 1.7, 0.5) + star2(-20 + (f ? 3 : 0), 9.4, 1.3, 0.9) + star2(13 - (f ? 2 : 0), 10, 1.1, 0.8) + line("M-1,-45 L-20,-6.6 M-1,-45 L23,-9", 0.5, WOOD_DARK2.right) + `<defs><clipPath id="barque-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD2.left}"/><g clip-path="url(#barque-coque)"><path d="M-24,1.4 Q0,4.4 28,0 L28,10 L-24,10 Z" fill="` + WOOD2.right + '"/>' + line("M-22,-1.8 Q0,-0.4 25,-3", 0.6, WOOD2.right) + `</g><path d="${coque}" fill="none" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/>` + pg([[-22, -6], [20, -6], [19, -3], [-20.6, -2.6]], WOOD2.top, W * 0.7) + `<path d="M24.6,-11 a1.6,1.6 0 1 1 1.4,1.6" fill="none" stroke="${WOOD_DARK2.right}" stroke-width="0.8"/>` + tk2("M-1,-6 L-1,-47", 1.4, WOOD_DARK2.right) + P2(`M0,-44 Q${16 + belly},-30 0,-12 Z`, "#FFFDF8") + line(`M0,-36 Q${r23(7 + belly / 2)},-33 ${r23(9 + belly / 2)},-31 M0,-19 Q${r23(8 + belly / 2)},-20 ${r23(10 + belly / 2)},-21`, 0.5, "#D8D0BE") + E(5 + belly / 3, -28, 3.4, 3.4, "#5CC8F0", 0.6) + E(5 + belly / 3, -28, 1.5, 1.5, "#1E5A7A", 0) + E(4.4 + belly / 3, -28.8, 0.6, 0.6, "#FFFFFF", 0) + P2("M-2,-40 Q-12,-26 -2,-14 Z", "#F2E4C0", W * 0.8) + L([-19, -6], [-19, -16], "#3D3A36", 1.2) + pg([[-22.6, -22], [-15.4, -22], [-16.4, -23.6], [-21.6, -23.6]], "#3D3A36", 0.5) + rr(-22, -22, 6, 7, 1, "#FFE08A", 0.8, "#3D3A36") + E(-19, -18.4, 1 + f * 0.3, 1.8 + f * 0.5, "#FFF4C8", 0) + E(-19, -18.6, 5 + f, 5 + f, "rgba(255,224,138,.22)", 0);
    }, "draw") };
    M2.bateau_visiteur = { frame: [-30, -56, 62, 64], n: 2, draw: /* @__PURE__ */ __name((f) => {
      const flag2 = f ? "M3,-50.4 Q8,-51.4 13.4,-48 Q8,-46.6 3,-45.6 Z" : "M3,-50.4 Q7,-49 10,-50 L12.6,-46.8 Q8,-45.6 3,-45.6 Z";
      const coque = "M-27,-7 L27,-8 Q25.4,3 13,6 L-14,6 Q-25,3.4 -27,-7 Z";
      const bob = f ? -0.5 : 0.3;
      return E(0, 3.6, 28, 3.6, "rgba(30,70,110,.25)", 0) + line(`M-30,${f ? 4 : 3.4} q3,-1.4 6,0 M24,${f ? 3 : 3.6} q3,-1.6 6,0`, 0.9, "rgba(255,255,255,.85)") + `<g transform="translate(0 ${bob})">` + line("M2,-49 L-24,-7.6 M2,-49 L26,-8", 0.5, "#5A3A20") + `<defs><clipPath id="visiteur-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="#8C5A34"/><g clip-path="url(#visiteur-coque)"><path d="M-30,1.4 Q0,4.4 30,0.4 L30,10 L-30,10 Z" fill="#6E4428"/>` + line("M-27,-2.8 Q0,-1 27,-3.8 M-25,1.2 Q0,3 25,-0.4", 0.6, "#6E4428") + `</g><path d="${coque}" fill="none" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/>` + [-12, 0, 12].map((x) => E(x, -3, 1.3, 1.3, "#A8D8F0", W * 0.7) + E(x - 0.4, -3.4, 0.4, 0.4, "#FFFFFF", 0)).join("") + pg([[-27, -7], [27, -8], [25.4, -4.6], [-25.6, -3.8]], "#FBF6EA", W * 0.7) + L([-25, -4.4], [25, -5.3], "#3E6E9C", 1.3) + pg([[-19, -7], [-19, -16], [-8, -16], [-8, -7]], "#E9D3A8", W * 0.8) + pg([[-8, -7], [-8, -16], [-5.6, -17.4], [-5.6, -7.6]], "#CDB385", W * 0.8) + rr(-17.4, -14.4, 3.6, 7.2, 1.4, "#7A5236", 0.6) + E(-12, -12, 1.6, 1.6, "#7FC4E8", 0.6) + E(-12.4, -12.4, 0.5, 0.5, "#FFFFFF", 0) + pg([[-20.6, -16], [-13, -20.6], [-4.4, -17.4], [-6.4, -16]], "#C9473A", W * 0.8) + L([-13, -20.4], [-5.4, -17.2], "#E06A5A", 0.8) + rr(-17, -23.6, 2.6, 5, 0.6, "#5A4A40", 0.6) + E(-15.6 + (f ? 1 : 0), -26.4 - (f ? 1.4 : 0), 2 + f * 0.5, 1.5 + f * 0.4, "#F4F1EA", 0.5) + E(-13.6 + f * 1.6, -29 - f * 1.6, 1.4, 1.1, "#F4F1EA", 0.4) + rr(9, -12, 9.4, 5.4, 1.2, "#6B4A2E", W * 0.8) + L([9.4, -9.4], [18, -9.4], "#E2B347", 1) + L([12, -12], [12, -6.6], "#4A321E", 0.8) + L([15.6, -12], [15.6, -6.6], "#4A321E", 0.8) + tk2("M2,-7 L2,-50", 1.4, "#5A3A20") + tk2("M2,-43 L19,-41.6", 0.8, "#5A3A20") + P2("M3,-42.6 Q14,-30 21,-11 L3,-9 Z", "#FFFDF8", W) + `<path d="M3,-30 Q11,-27 15.6,-26 L18.2,-20 Q10,-21 3,-21 Z" fill="#6FA3D9" opacity=".6"/>` + line("M3,-36 Q10,-34 16,-32.6 M3,-15 Q12,-15.6 20,-15.6", 0.5, "#D8D0BE") + P2(flag2, "#E2483A", W * 0.7) + E(2, -50.6, 1.2, 1.2, "#E2B347", 0.5) + "</g>";
    }, "draw") };
    var SAILS2 = { blanche: ["#FFFDF8", "#F2E4C0"], rouge: ["#E2574C", "#B13A31"], bleue: ["#6FA3D9", "#4C7FB5"], rayee: ["stripes", "#E2574C"] };
    M2.voilier = { frame: BUILDING_BOX2, n: 1, variants: Object.keys(SAILS2), draw: /* @__PURE__ */ __name((_, sail = "blanche") => {
      const [x, y] = gp(0.05, 0.5, 0);
      const s = SAILS2[sail], X = /* @__PURE__ */ __name((n) => r23(x + n), "X"), Y = /* @__PURE__ */ __name((n) => r23(y + n), "Y");
      const main = s[0] === "stripes" ? "#FFFDF8" : s[0], jib = s[0] === "stripes" ? "#F2E4C0" : s[1];
      const voile = `M${X(1)},${Y(-44)} Q${X(13)},${Y(-30)} ${X(20)},${Y(-12)} L${X(1)},${Y(-10)} Z`;
      const stripes = s[0] === "stripes" ? `<defs><clipPath id="voilier-voile"><path d="${voile}"/></clipPath></defs><g clip-path="url(#voilier-voile)">${[0, 1, 2].map((k) => `<path d="M${X(-2)},${Y(-40 + k * 10)} L${X(24)},${Y(-37 + k * 10)} L${X(24)},${Y(-32 + k * 10)} L${X(-2)},${Y(-35 + k * 10)} Z" fill="${s[1]}"/>`).join("")}</g>` : "";
      const coque = `M${X(-23)},${Y(-6)} L${X(23)},${Y(-7)} Q${X(21)},${Y(4)} ${X(10)},${Y(6)} L${X(-12)},${Y(6)} Q${X(-21)},${Y(4)} ${X(-23)},${Y(-6)} Z`;
      return E(x, y + 6, 24, 5, "rgba(30,70,110,.25)", 0) + line(`M${X(-27)},${Y(5)} q3,-1.4 6,0 M${X(21)},${Y(4.6)} q3,-1.4 6,0`, 0.9, "rgba(255,255,255,.85)") + line(`M${X(0)},${Y(-47)} L${X(-21)},${Y(-6.6)} M${X(0)},${Y(-47)} L${X(22)},${Y(-7)}`, 0.5, "#5A3A20") + `<defs><clipPath id="voilier-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD2.left}"/><g clip-path="url(#voilier-coque)"><path d="M${X(-26)},${Y(1.6)} Q${x},${Y(4.4)} ${X(26)},${Y(0.6)} L${X(26)},${Y(10)} L${X(-26)},${Y(10)} Z" fill="${WOOD2.right}"/>` + line(`M${X(-23)},${Y(-2)} Q${x},${Y(-0.4)} ${X(23)},${Y(-3)}`, 0.6, WOOD2.right) + `</g><path d="${coque}" fill="none" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/>` + [-9, 3].map((n) => E(x + n, y - 2.4, 1.2, 1.2, "#A8D8F0", W * 0.7) + E(x + n - 0.4, y - 2.8, 0.4, 0.4, "#FFFFFF", 0)).join("") + pg([[x - 23, y - 6], [x + 23, y - 7], [x + 21.4, y - 4], [x - 21.6, y - 3.4]], "#FBF6EA", W * 0.7) + tk2(`M${x},${Y(-6)} L${x},${Y(-48)}`, 1.4, WOOD_DARK2.right) + tk2(`M${x},${Y(-41)} L${X(17)},${Y(-39.8)}`, 0.8, WOOD_DARK2.right) + P2(voile, main) + stripes + (stripes ? P2(voile, "none") : "") + line(`M${X(1)},${Y(-34)} Q${X(9)},${Y(-32)} ${X(15)},${Y(-30.6)} M${X(1)},${Y(-18)} Q${X(10)},${Y(-18.4)} ${X(18)},${Y(-18.4)}`, 0.5, "rgba(120,100,80,.35)") + P2(`M${X(-1)},${Y(-38)} Q${X(-8)},${Y(-25)} ${X(-14)},${Y(-13)} L${X(-1)},${Y(-12)} Z`, jib, W * 0.8) + P2(`M${X(0.4)},${Y(-48.4)} Q${X(6)},${Y(-49.4)} ${X(10)},${Y(-46.6)} Q${X(5.6)},${Y(-45.2)} ${X(0.4)},${Y(-44.6)} Z`, s[0] === "stripes" ? s[1] : jib, W * 0.6) + E(x, y - 48.6, 1.1, 1.1, "#E2B347", 0.5);
    }, "draw") };
    M2.bouteille = { frame: [-16, -28, 32, 32], n: 2, draw: /* @__PURE__ */ __name((f) => {
      const a = f ? -14 : -6, id3 = `bouteille-verre-${f}`, rx = f ? 12.6 : 11.8;
      const body = "M-9,-5 L4,-5 Q7.4,-5 8.6,-2.1 L12,-2.1 L12,2.1 L8.6,2.1 Q7.4,5 4,5 L-9,5 Q-12.4,5 -12.4,0 Q-12.4,-5 -9,-5 Z";
      return E(0, 0.8, 14, 2.6, "rgba(30,60,80,.22)", 0) + line(`M${-rx},0 A${rx},2.4 0 0 1 ${rx},0`, 0.7, "rgba(255,255,255,.45)") + `<g transform="translate(-1.4,-2.4) rotate(${a}) scale(.84)"><defs><clipPath id="${id3}"><path d="${body}"/></clipPath></defs>` + rr(-8.4, -2.8, 11, 5.6, 2.6, "#F5E8C6", 0.5) + E(2.6, 0, 1.2, 2.8, "#E6D2A4", 0.4) + line("M2.6,-1.6 q-0.8,1.6 0,3.2", 0.4, "#C9A87A") + line("M-4.4,-0.9 L1,-0.9 M-4.4,0.8 L-0.4,0.8", 0.4, "rgba(150,120,80,.6)") + line("M-6.4,-2.6 L-6.4,2.6", 1.1, "#D9534A") + E(-6.4, 3.2, 1, 1, "#B8302A", 0) + E(-6.7, 2.9, 0.35, 0.35, "rgba(255,255,255,.6)", 0) + P2(body, "rgba(96,180,132,.44)", 0) + `<g clip-path="url(#${id3})"><path d="M-14,2.6 Q-4,1.4 4,3 L14,3.2 L14,8 L-14,8 Z" fill="rgba(40,110,80,.4)"/><path d="M-24,2.6 q5,-1 10,0 t10,0 t10,0 t10,0 L26,16 L-24,16 Z" fill="rgba(120,190,226,.55)" transform="rotate(${-a})"/></g>` + P2(body, "none", W / 0.84) + rr(11.6, -2.7, 1.7, 5.4, 0.7, "#8FD0AA", W * 0.7) + rr(13.1, -1.8, 3.4, 3.6, 0.9, "#C08A58", W * 0.7) + line("M14.6,-1.4 L14.6,1.4", 0.4, "rgba(90,55,30,.5)") + line("M-9,-3.6 Q-2,-4.6 4,-3.8", 1.1, "rgba(255,255,255,.75)") + line("M8.8,-1.4 L11.4,-1.4", 0.6, "rgba(255,255,255,.6)") + E(-10.6, -1.2, 0.5, 1.2, "rgba(255,255,255,.55)", 0) + "</g>" + line(`M${-rx},0 A${rx},2.4 0 0 0 ${rx},0`, 0.9, "rgba(255,255,255,.85)") + line(`M${-rx - 3},${f ? 1.4 : 2.2} q2,-1.2 4,0 M${rx - 1},${f ? 2.2 : 1.4} q2,-1.2 4,0`, 0.8, "rgba(255,255,255,.7)") + E(-rx + 2, -0.6, 0.7, 0.5, "#FFFFFF", 0) + E(rx - 2.4, -0.4, 0.6, 0.45, "#FFFFFF", 0) + (f ? star2(-2, -10.4, 2.2) : "");
    }, "draw") };
    M2.panneau_quartier = { frame: PROP_BOX2, n: 1, draw: /* @__PURE__ */ __name(() => shade(0, 0, 14, 7, 0.2) + gbox(-0.03, -0.03, 0.03, 0.03, 0, 26, WOOD_DARK2) + tuft3(-5, 1) + tuft3(3.4, 1.6) + framed(-17, -40, 34, 17, 3, WOOD2.top, "#7A4E2C", 1.2) + L([-13, -34], [13, -34], "rgba(122,78,44,.3)", 0.8) + line("M-14,-37.4 q6,-0.8 10,0.2 M5,-26 q5,0.6 9,-0.4", 0.5, "rgba(122,78,44,.35)") + [[-14.6, -37.6], [14.6, -37.6], [-14.6, -25.4], [14.6, -25.4]].map(([x, y]) => E(x, y, 0.8, 0.8, "#5A3A20", 0) + E(x - 0.25, y - 0.25, 0.3, 0.3, "#B88A5A", 0)).join("") + line("M0,-40 L0,-42", 0.8, "#8A6A22") + line("M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3", 2.6, OUT3) + line("M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3", 1.2, "#8A6A22") + rr(-4.5, -50, 9, 8, 1.6, "#E9BF4E", W * 0.9) + L([-3.4, -48.6], [-3.4, -43.4], "#FFE39A", 0.8) + E(0, -46.6, 0.9, 1.1, "#5A4214", 0) + L([0, -46], [0, -44.4], "#5A4214", 0.8), "draw") };
    var HS = 22;
    M2.pont = { frame: [-40, -46, 80, 86], n: 1, variants: ["segment", "bout_avant", "bout_arriere"], draw: /* @__PURE__ */ __name((_, kind = "segment") => {
      const z = 0.15 * HS;
      let o = E(0, 22, 30, 7, "rgba(255,255,255,.3)", 0);
      for (const [u, v] of [[0.4, -0.26], [-0.4, 0.26], [0.4, 0.26]]) {
        const p = gp(u, v, z - 2.4);
        o += `<ellipse cx="${r23(p[0])}" cy="${r23(p[1] - 1 + HS * 1.2)}" rx="4.6" ry="1.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="0.7"/>` + rr(p[0] - 2, p[1] - 1, 4, HS * 1.2, 0.6, "#6B4A2A", W * 0.8) + L([p[0] - 0.8, p[1]], [p[0] - 0.8, p[1] - 2 + HS * 1.2], "#8A6238", 0.6);
      }
      o += gbox(-0.5, -0.3, 0.5, 0.3, z - 2.4, z, { top: "#A47A4A", left: "#8A6238", right: "#7A5530" });
      for (let k = -4; k <= 4; k++) o += L(gp(k * 0.11, -0.3, z), gp(k * 0.11, 0.3, z), "rgba(90,55,25,.5)", 0.7) + E(...gp(k * 0.11 - 0.055, 0.24, z), 0.45, 0.3, "#5A3A20", 0) + E(...gp(k * 0.11 - 0.055, -0.24, z), 0.45, 0.3, "#5A3A20", 0);
      const post2 = /* @__PURE__ */ __name((u, v, h) => {
        const p = gp(u, v, z);
        return { s: rr(p[0] - 1.2, p[1] - h, 2.4, h, 0.6, "#5C3F24", 0.6), x: p[0], y: p[1] - h };
      }, "post");
      const rope2 = /* @__PURE__ */ __name((a, b) => tk2(`M${r23(a.x)},${r23(a.y + 1)} Q${r23((a.x + b.x) / 2)},${r23((a.y + b.y) / 2 + 4)} ${r23(b.x)},${r23(b.y + 1)}`, 0.9, "#D9C08A"), "rope");
      const lamp = /* @__PURE__ */ __name((u) => {
        const t = post2(u, 0.27, 24);
        return t.s + E(t.x, t.y - 3, 7, 7, "rgba(255,224,138,.22)", 0) + rr(t.x - 3.4, t.y - 8, 6.8, 2, 0.6, "#3D3A36", 0.5) + rr(t.x - 2.6, t.y - 6, 5.2, 6, 0.8, "#FFE08A", 0.8, "#3D3A36") + E(t.x, t.y - 3, 1, 1.8, "#FFF4C8", 0) + L([t.x, t.y - 6], [t.x, t.y], "#3D3A36", 0.4);
      }, "lamp");
      for (const v of [-0.27, 0.27]) {
        const a = post2(-0.46, v, 12), b = post2(0.46, v, 12);
        if (v > 0 && kind === "bout_arriere") o += lamp(-0.46);
        o += a.s + b.s + rope2(a, b);
      }
      if (kind === "bout_avant") o += lamp(0.46);
      return o;
    }, "draw") };
    M2.epave_radeau = { frame: [-40, -56, 80, 64], n: 1, draw: /* @__PURE__ */ __name(() => {
      const rondin = /* @__PURE__ */ __name((y, x0, x1, c) => rr(x0, y, x1 - x0, 6, 3, c.left, W) + E(x1 - 2.6, y + 3, 2, 2.6, c.top, W * 0.7) + E(x1 - 2.6, y + 3, 0.9, 1.3, c.right, 0) + L([x0 + 4, y + 1.6], [x1 - 7, y + 1.4], c.top, 0.7), "rondin");
      return `<g transform="rotate(-9)">` + rondin(-5, -30, 30, WOOD2) + rondin(-11, -26, 27, { left: "#C99A62", top: "#E0B47A", right: "#8A5A32" }) + [-16, 0, 16].map((x) => rr(x - 1.4, -11.6, 2.8, 13, 0.8, "#D9C08A", W * 0.7)).join("") + P2("M-4,-11 L3,-40 L5.4,-39.4 L1.4,-11 Z", WOOD_DARK2.left) + P2("M3.6,-41 L5.6,-44 L6.4,-39.8 Z", WOOD_DARK2.right, W * 0.6) + P2("M4.6,-37 Q14,-36 21,-30 L17,-28.6 L19,-26 Q12,-25.4 5.6,-24.6 Z", "#E8E2D2", W * 0.8) + line("M7,-33 l6,0.6 M7,-28.6 l5,0.2", 0.5, "#C8BFA8") + line("M-24,-5 q-3,4 -1,8 M22,-4 q4,3 2,7", 0.9, "#D9C08A") + "</g>";
    }, "draw") };
    M2.epave_bateau = { frame: [-54, -72, 108, 90], n: 1, draw: /* @__PURE__ */ __name(() => {
      const coque = "M-46,-10 L46,-10 L34,6 L-36,6 Z";
      return `<g transform="rotate(12)"><defs><clipPath id="epave-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="#7A5A3E"/><g clip-path="url(#epave-coque)"><path d="M-50,0 L50,0 L50,10 L-50,10 Z" fill="#5E4430"/>` + L([-42, -5], [40, -5], "#5A3E28", 0.8) + L([-40, 0], [38, 0], "#5A3E28", 0.6) + P2("M12,-6 L20,-7 L22,0 L16,3 L11,0 Z", "#2E2218", 0.6) + L([13, -6], [10, -9], "#7A5A3E", 1.4) + L([21, -7], [24, -10], "#7A5A3E", 1.2) + `</g><path d="${coque}" fill="none" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/>` + pg([[-46, -10], [46, -10], [44, -7.4], [-44, -7.4]], "#A8825A", W * 0.7) + P2("M-6,-10 L-2,-46 L-1,-50 L1,-46 L2,-48.6 L2.6,-44 L2,-10 Z", WOOD_DARK2.left) + P2("M2,-44 L-30,-36 L-26,-34 L-29,-31 L-22,-30.6 L2,-30 Z", "#E8E2D2", W * 0.8) + line("M-4,-40 l-14,3.6 M-4,-34 l-16,2", 0.5, "#C8BFA8") + line("M-2,-42 Q-14,-26 -40,-10", 0.7, "#D9C08A") + line("M2,-30 q6,6 4,14", 0.8, "#D9C08A") + rr(-26, -18, 12, 8, 1, "#BDB5A8", W * 0.8) + rr(-10, -18, 10, 8, 1, "#A39B8E", W * 0.8) + rr(8, -16, 8, 6, 1, "#BDB5A8", W * 0.8) + L([-24, -15.6], [-16, -15.6], "#D3CCC0", 0.6) + L([-8, -15.4], [-2, -15.4], "#BDB5A8", 0.6) + "</g>";
    }, "draw") };
    M2.epave_barque = { frame: [-40, -32, 80, 44], n: 1, draw: /* @__PURE__ */ __name(() => {
      const coque = "M-30,-8 Q0,6 30,-8 L24,2 Q0,12 -24,2 Z";
      const sac = /* @__PURE__ */ __name((x, y, c) => P2(`M${x - 4},${y + 2} Q${x - 4.6},${y - 3} ${x - 1.6},${y - 4.4} L${x - 2.2},${y - 6} L${x + 2.2},${y - 6} L${x + 1.6},${y - 4.4} Q${x + 4.6},${y - 3} ${x + 4},${y + 2} Q${x},${y + 3.4} ${x - 4},${y + 2} Z`, c, W * 0.8) + L([x - 1.8, y - 4.6], [x + 1.8, y - 4.6], "#8A6A3A", 0.8), "sac");
      return `<g transform="rotate(-16)"><defs><clipPath id="epave-barque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD2.left}"/><g clip-path="url(#epave-barque)"><path d="M-32,1 Q0,10 32,-1 L32,14 L-32,14 Z" fill="${WOOD2.right}"/>` + line("M-28,-3 Q0,9 28,-3", 0.6, WOOD2.right) + P2("M6,1 L12,0 L13,5 L7,6 Z", "#2E2218", 0.5) + `</g><path d="${coque}" fill="none" stroke="${OUT3}" stroke-width="${W}" stroke-linejoin="round"/>` + sac(-10, -2, "#D9C08A") + sac(-1, 0, "#E2CC98") + P2("M8,-4 L14,-7 L16,-3 L10,0 Z", "#C9AE78", W * 0.8) + E(-8, -3.8, 2.2, 2.2, "#C9A45A", W * 0.7) + E(2, -3, 1.8, 1.8, "#8A5A2E", W * 0.7) + E(12, -6.4, 1.6, 1.6, "#E2C27A", W * 0.6) + E(16, -4.6, 1.2, 1.2, "#7FA65A", 0.5) + E(19, -2.4, 1, 1, "#C9A45A", 0.5) + E(-3, -2.6, 1.2, 1.2, "#7FA65A", 0.5) + tk2("M-26,-10 L-6,2", 1, WOOD_DARK2.left) + P2("M-6,1 L-2,4 L-1,2.4 L-4,-0.6 Z", WOOD_DARK2.left, W * 0.6) + line("M-27,-5 Q0,8 27,-5", 1.4, WOOD2.top) + "</g>";
    }, "draw") };
    var silhouette2 = /* @__PURE__ */ __name((body) => body.replace(/fill="(?!none)[^"]*"/g, 'fill="#070E1E"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#070E1E"'), "silhouette");
    module.exports = { K: K2, up: up2, big: big2, G: G2, S: S2, SIGN_TEXT: SIGN_TEXT2, SIGN_FRAME: SIGN_FRAME2, M: M2, silhouette: silhouette2 };
  }
});

// atelier/torche.js
var require_torche = __commonJS({
  "atelier/torche.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, r2: r23 } = require_troupe2();
    var TETE = -45.4;
    var BOIS = { corps: "#D6C3A2", ombre: "#B29C78", clair: "#EADCC0" };
    var CORDE = "#C9A66B";
    var TOILE = { corps: "#8A5A30", ombre: "#6A4224", brule: "#3E2A1C" };
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var LUMIERE = [0, 0, 43, 38, "255,186,96"];
    var langue = /* @__PURE__ */ __name(([tip, r, base, l], k, s, fill, contour) => `<path d="M${r23(base[0] * k)},${r23(base[1] * k)} C${r23((r[0] + 3 * s) * k)},${r23(r[1] * k)} ${r23((tip[0] + 2 * s) * k)},${r23((tip[1] + 8 * s) * k)} ${r23(tip[0] * k)},${r23(tip[1] * k)} C${r23((tip[0] - 2 * s) * k)},${r23((tip[1] + 8 * s) * k)} ${r23((l[0] - 3 * s) * k)},${r23(l[1] * k)} ${r23(base[0] * k)},${r23(base[1] * k)} Z" fill="${fill}"${contour ? ` stroke="${OUT3}" stroke-width="0.8" stroke-linejoin="round"` : ""}/>`, "langue");
    var FORMES = [[[0, -22], [7, -6], [0, 0], [-7, -6]], [[2, -24], [7, -7], [0, 0], [-6, -5]], [[-2, -21], [6, -5], [0, 0], [-7, -7]]];
    var ETINCELLES = [[[5, -27], [-6, -18]], [[-4, -30], [7, -21]], [[3, -32], [-7, -25]]];
    function flamme(n, s = 0.9) {
      const f = FORMES[n % 3].map(([x, y]) => [x * s, y * s]);
      return langue(f, 1, s, "#EE6A3A", true) + langue(f, 0.78, s, "#F7A23B") + langue(f, 0.5, s, "#FFE07A") + ETINCELLES[n % 3].map(([x, y], j) => `<circle cx="${r23(x * s)}" cy="${r23(y * s)}" r="${r23((j ? 0.8 : 1.1) * s)}" fill="#FFD27A"/>`).join("");
    }
    __name(flamme, "flamme");
    var lueur = /* @__PURE__ */ __name((y, n) => [20, 14, 9].map((r, i) => `<circle cx="0" cy="${r23(y)}" r="${r23(r + [0, 0.8, -0.6][n % 3])}" fill="rgba(255,200,110,${[0.1, 0.14, 0.2][i]})"/>`).join(""), "lueur");
    function corps(eteinte) {
      let s = E(1, 1.2, 10, 4.6, "rgba(40,55,20,.2)", 0);
      const poteau = "M0,0.6 Q-1.2,-14 0.2,-26 Q1,-32 0.6,-37";
      s += trait(poteau, OUT3, 5.6) + trait(poteau, BOIS.corps, 3.4) + trait("M1.2,-1 Q0.2,-14 1.4,-26 Q2,-31 1.8,-35", BOIS.ombre, 1) + trait("M-1.2,-3 Q-2,-12 -1.2,-20", BOIS.clair, 0.8);
      s += E(-0.6, -15.6, 1, 1.4, BOIS.ombre, 0.6);
      s += [[-5.4, 1.4, 3, 2], [5, 1.8, 3.2, 2.2], [0.4, 3.6, 2.6, 1.7]].map(([x, y, rx, ry]) => E(x, y, rx, ry, "#B4AEA4", 0.9) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3, "rgba(255,255,255,.6)", 0)).join("");
      s += [-33.2, -31.2, -29.2].map((y) => trait(`M-2.6,${r23(y + 0.8)} L3.4,${r23(y - 0.6)}`, OUT3, 2.4) + trait(`M-2.6,${r23(y + 0.8)} L3.4,${r23(y - 0.6)}`, CORDE, 1.1)).join("");
      const T = `M-4.2,-36.6 Q-5.8,-41.4 -5.6,${TETE} L5.8,${TETE} Q6,-41.4 4.6,-36.6 Q0.2,-35.2 -4.2,-36.6 Z`;
      s += P2(T, TOILE.corps, 1) + `<clipPath id="trc${eteinte ? "e" : ""}"><path d="${T}"/></clipPath><g clip-path="url(#trc${eteinte ? "e" : ""})"><rect x="1.6" y="-47" width="6" height="12" fill="${TOILE.ombre}"/>` + [-43.4, -41.2, -39].map((y) => trait(`M-6,${y} Q0,${r23(y + 1.4)} 6,${y}`, TOILE.ombre, 0.7)).join("") + `</g>`;
      s += E(0.1, TETE, 5.7, 1.9, eteinte ? TOILE.brule : "#5E3A22", 1) + (eteinte ? E(-1.4, TETE - 0.3, 1.6, 0.6, "#6A5848", 0) : E(0.1, TETE, 4.2, 1.2, "#F28A2E", 0));
      return s;
    }
    __name(corps, "corps");
    function torche2(etat = "allumee", n = 0) {
      if (etat === "eteinte") {
        return corps(true) + `<g opacity=".75">${trait(`M0.4,${TETE - 1.6} Q-2.4,${TETE - 5} 0.6,${TETE - 8} Q3.4,${TETE - 11} 0.8,${TETE - 14.6}`, "#9AA0A8", 1.6)}</g><circle cx="1.6" cy="${TETE - 17}" r="1.4" fill="rgba(170,176,184,.6)"/>`;
      }
      return lueur(TETE - 9, n) + corps(false) + `<g transform="translate(0 ${r23(TETE + 0.6)})">${flamme(n)}</g>`;
    }
    __name(torche2, "torche");
    function torcheIcone() {
      const WO = 1.3;
      let s = `<g transform="rotate(16 16 17)">`;
      s += trait("M16,30 L16,14.6", OUT3, 4.6) + trait("M16,30 L16,14.6", BOIS.corps, 2.2) + trait("M16.8,29 L16.8,15.6", BOIS.ombre, 0.7);
      s += [21, 19.4].map((y) => trait(`M13.8,${r23(y + 0.7)} L18.2,${r23(y - 0.5)}`, OUT3, 2.2) + trait(`M13.8,${r23(y + 0.7)} L18.2,${r23(y - 0.5)}`, CORDE, 1)).join("");
      const T = "M12.6,16.6 Q11.6,13 11.8,11 L20.2,11 Q20.4,13 19.4,16.6 Q16,17.6 12.6,16.6 Z";
      s += `<path d="${T}" fill="${TOILE.corps}" stroke="${OUT3}" stroke-width="${WO}" stroke-linejoin="round"/>` + trait("M12,13.4 Q16,14.6 20,13.4", TOILE.ombre, 0.7);
      s += E(16, 11, 4.2, 1.4, "#F28A2E", 1);
      s += `<g transform="translate(16 11.6) scale(0.42)">${flamme(0, 1)}</g></g>`;
      return s + `<path d="M25.4,6.4 L25.8,7.6 L27,8 L25.8,8.4 L25.4,9.6 L25,8.4 L23.8,8 L25,7.6 Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="0.5"/>`;
    }
    __name(torcheIcone, "torcheIcone");
    module.exports = { torche: torche2, torcheIcone, LUMIERE, TETE };
  }
});

// atelier/betes.js
var require_betes = __commonJS({
  "atelier/betes.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, L, clip, r2: r23 } = require_troupe2();
    var K2 = 1.25;
    var box2 = /* @__PURE__ */ __name((x, y, w, h) => [x * K2, y * K2, w * K2, h * K2], "box");
    var BOX = { SMALL: box2(-12, -18, 24, 20), MID: box2(-16, -24, 32, 26), TALL: box2(-16, -34, 32, 36), BIG: box2(-24, -46, 48, 48) };
    var EYE = "#2A2420";
    var tone = /* @__PURE__ */ __name((hex, k) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, "0")).join("").toUpperCase(), "tone");
    var heartIcon = /* @__PURE__ */ __name((x, y, s = 1.4) => P2(`M${r23(x)},${r23(y + s * 1.1)} C${r23(x - s * 1.8)},${r23(y - s * 0.1)} ${r23(x - s * 0.9)},${r23(y - s * 1.4)} ${r23(x)},${r23(y - s * 0.5)} C${r23(x + s * 0.9)},${r23(y - s * 1.4)} ${r23(x + s * 1.8)},${r23(y - s * 0.1)} ${r23(x)},${r23(y + s * 1.1)} Z`, "#F27A8A", 0.6), "heartIcon");
    var line = /* @__PURE__ */ __name((a, b, w, color) => `<path d="M${r23(a[0])},${r23(a[1])} L${r23(b[0])},${r23(b[1])}" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round"/>`, "line");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => line(a, b, w + 2.2, OUT3) + line(a, b, w, fill), "limb");
    var stroke = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r23(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
    var thick = /* @__PURE__ */ __name((d, w, fill) => stroke(d, w + 2.2, OUT3) + stroke(d, w, fill), "thick");
    function eye(x, y, r, mode) {
      if (mode === "blink") return P2(`M${r23(x - r)},${r23(y)} Q${x},${r23(y + r * 0.9)} ${r23(x + r)},${r23(y)}`, "none", 0.8);
      if (mode === "joy") return P2(`M${r23(x - r)},${r23(y + r * 0.4)} Q${x},${r23(y - r * 0.9)} ${r23(x + r)},${r23(y + r * 0.4)}`, "none", 0.9);
      return E(x, y, r * 0.86, r * 1.12, EYE, 0) + E(x + r * 0.3, y - r * 0.44, r * 0.38, r * 0.38, "#FFFFFF", 0) + E(x - r * 0.3, y + r * 0.5, r * 0.17, r * 0.17, "#FFFFFF", 0);
    }
    __name(eye, "eye");
    var hoof = /* @__PURE__ */ __name((x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + E(x - rx * 0.35, y - 0.2, rx * 0.3, 0.22, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.45" fill='), "hoof");
    var toes = /* @__PURE__ */ __name((x, y, rx) => [0.15, 0.55].map((k) => line([x + rx * k, y + 0.05], [x + rx * k, y + 0.75], 0.42, OUT3)).join(""), "toes");
    var paw = /* @__PURE__ */ __name((x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + toes(x, y - 0.1, rx), "paw");
    function quad(c, pose) {
      const walk = pose === "marche1" || pose === "marche2";
      const rest = pose === "repos" || pose === "clignement";
      const ph = pose === "marche2" ? -1 : 1;
      const drop = rest ? c.restDrop ?? -c.legs.top * 0.75 : 0;
      const bob = pose === "marche2" ? -0.4 : 0;
      const [bx, by0, brx, bry] = c.body;
      const by = by0 + drop + bob;
      const [hx, hy0, hr] = c.head;
      const hy = hy0 + drop * (c.headDrop ?? 0.8) + bob;
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const ctx = { pose, rest, walk, bx, by, hx, hy, hr, ph, mode, drop };
      const lg = c.legs;
      const top = lg.top + drop + bob;
      const a = walk ? 1.6 * ph : 0;
      let s = "";
      s += E(bx, -0.2, brx * 0.95, 1.4, "rgba(40,55,20,.18)", 0);
      const leg = /* @__PURE__ */ __name((x, dx, near) => {
        if (rest) return "";
        const foot = [x + dx, -(lg.paw ? 0.9 : 0.6)];
        const shine = near ? line([x - lg.w * 0.2, top + 1.2], [foot[0] - lg.w * 0.2, foot[1] - 1.6], lg.w * 0.26, "rgba(255,255,255,.35)") : "";
        return limb([x, top], foot, lg.w, near ? lg.color || c.fur : lg.colorS || c.furS) + shine + (lg.hoof ? hoof(foot[0], foot[1] + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, lg.paw) : "");
      }, "leg");
      s += leg(lg.back + 1.4, -a, false) + leg(lg.front + 1.4, a, false);
      s += c.parts?.back ? c.parts.back(ctx) : "";
      s += tail(c, ctx);
      const bd = `M${r23(bx - brx)},${r23(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
      s += P2(bd, c.fur) + clip(`q${c.id}${pose}b`, bd, `<rect x="${r23(bx - brx - 1)}" y="${r23(by - bry - 1)}" width="${r23(brx * 2 + 2)}" height="${r23(bry * 2 + 2)}" fill="${c.furS}"/><ellipse cx="${r23(bx - brx * 0.1)}" cy="${r23(by - bry * 0.16)}" rx="${r23(brx * 0.98)}" ry="${r23(bry * 0.9)}" fill="${c.fur}"/><ellipse cx="${bx}" cy="${r23(by + bry * 0.95)}" rx="${r23(brx * 0.9)}" ry="${r23(bry * 0.45)}" fill="${c.belly || c.furS}"/>` + (c.parts?.coat ? c.parts.coat(ctx) : "") + `<path d="M${r23(bx - brx * 0.6)},${r23(by - bry * 0.62)} Q${bx},${r23(by - bry * 0.95)} ${r23(bx + brx * 0.4)},${r23(by - bry * 0.7)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P2(bd, "none");
      if (rest) for (const px of [bx - brx * 0.55, bx + brx * 0.6]) {
        s += E(px, -0.9, lg.w * 0.9, 1, lg.color || c.fur, 0.9);
        if (lg.hoof) s += hoof(px + lg.w * 0.55, -0.7, lg.w * 0.42, lg.hoof);
        else s += toes(px + lg.w * 0.15, -0.9, lg.w * 0.9);
      }
      else s += leg(lg.back, a, true) + leg(lg.front, -a, true);
      s += c.parts?.body ? c.parts.body(ctx) : "";
      s += headQuad(c, ctx);
      if (pose === "joie") s += heartIcon(hx + hr * 0.2, Math.max(hy - hr * 2 - 1.4, BOX[c.size][1] + 2));
      return s;
    }
    __name(quad, "quad");
    function blob(c, id3, cx, cy, rx, ry, coat) {
      const d = `M${r23(cx - rx)},${r23(cy)} a${r23(rx)},${r23(ry)} 0 1,0 ${r23(2 * rx)},0 a${r23(rx)},${r23(ry)} 0 1,0 ${r23(-2 * rx)},0 Z`;
      return P2(d, c.fur) + clip(id3, d, `<rect x="${r23(cx - rx - 1)}" y="${r23(cy - ry - 1)}" width="${r23(rx * 2 + 2)}" height="${r23(ry * 2 + 2)}" fill="${c.furS}"/><ellipse cx="${r23(cx - rx * 0.1)}" cy="${r23(cy - ry * 0.16)}" rx="${r23(rx * 0.98)}" ry="${r23(ry * 0.9)}" fill="${c.fur}"/><ellipse cx="${r23(cx)}" cy="${r23(cy + ry * 0.95)}" rx="${r23(rx * 0.9)}" ry="${r23(ry * 0.45)}" fill="${c.belly || c.furS}"/>` + (coat || "")) + P2(d, "none");
    }
    __name(blob, "blob");
    var zed = /* @__PURE__ */ __name((x, y, k) => `<path d="M${r23(x)},${r23(y)} h${r23(1.8 * k)} l${r23(-1.8 * k)},${r23(2 * k)} h${r23(1.8 * k)}" fill="none" stroke="#7E8CB0" stroke-width="${r23(0.55 * k + 0.2)}" stroke-linecap="round" stroke-linejoin="round"/>`, "zed");
    function petPose(c, pose) {
      if (c.id.startsWith("cat")) return chatPose(c, pose);
      const [bx, , brx, bry] = c.body, hr = c.head[2], lg = c.legs, n = /2$/.test(pose) ? 1 : 0, t = c.tail || {};
      const tw = t.w || 1.3;
      let s = "";
      if (/^assis/.test(pose)) {
        const hx0 = bx - brx * 0.3, hy0 = -bry * 0.95, hrx = brx * 0.62, hry = bry * 0.95;
        const cx2 = bx + brx * 0.3, cy2 = -bry * 1.65, crx = brx * 0.48, cry = bry * 1.15;
        s += E(bx, -0.2, brx * 0.85, 1.4, "rgba(40,55,20,.18)", 0);
        const patte = /* @__PURE__ */ __name((x, near) => limb([x, cy2], [x, -0.9], lg.w, near ? c.fur : c.furS) + paw(x + 0.4, -0.7, lg.w * 0.7, lg.paw || c.belly), "patte");
        s += patte(cx2 - crx * 0.05, false);
        s += blob(c, `pp${c.id}${pose}b`, hx0, hy0, hrx, hry, c.parts?.coat ? c.parts.coat({ bx: hx0, by: hy0 + hry * 0.5 }) : "");
        s += blob(c, `pp${c.id}${pose}c`, cx2, cy2, crx, cry);
        s += thick(`M${r23(hx0 - hrx * 0.95)},${r23(-1.4)} Q${r23(hx0 - hrx * 0.5)},0.3 ${r23(hx0 + hrx * 0.75)},${r23(n ? -2.6 : -0.7)}`, tw, c.fur);
        s += patte(cx2 + crx * 0.4, true) + E(hx0 + hrx * 0.55, -0.85, lg.w * 1.05, 0.9, c.fur, 0.9) + toes(hx0 + hrx * 0.62, -0.9, lg.w * 0.9);
        s += headQuad(c, { pose, hx: cx2 + crx * 0.55, hy: cy2 - cry - hr * 0.3, hr, mode: "open", bx: cx2, by: cy2 });
        return s;
      }
      const cx = bx - brx * 0.1, ry = bry * 0.8 * (n ? 1.06 : 1), cy = -ry, rx = brx * 1.08;
      const hx = cx + rx * 0.82, hy = -hr * 0.92;
      s += E(cx + rx * 0.2, -0.2, rx * 1.05, 1.4, "rgba(40,55,20,.18)", 0);
      s += blob(c, `pp${c.id}${pose}b`, cx, cy, rx, ry, c.parts?.coat ? c.parts.coat({ bx: cx, by: cy + ry * 0.5 }) : "");
      s += thick(`M${r23(cx - rx * 0.95)},${r23(-1.6)} Q${r23(cx - rx * 0.3)},0.4 ${r23(cx + rx * 0.5)},${r23(-0.8)}`, tw, c.fur);
      s += E(hx + hr * 0.55, -0.8, lg.w * 1.1, 0.9, c.fur, 0.9) + toes(hx + hr * 0.62, -0.85, lg.w * 0.9);
      s += headQuad(c, { pose, hx, hy, hr, mode: "blink", bx: cx, by: cy });
      s += zed(hx + hr * 0.7, hy - hr * 1.5, 0.8) + (n ? zed(hx + hr * 1.15, hy - hr * 2.2, 1.05) : "");
      return s;
    }
    __name(petPose, "petPose");
    function chatPose(c, pose) {
      const hr = c.head[2], lg = c.legs, n = /2$/.test(pose) ? 1 : 0, tw = (c.tail || {}).w || 1.3, pc = lg.paw || c.belly;
      const coat = /* @__PURE__ */ __name((bx, by) => c.parts?.coat ? c.parts.coat({ bx, by }) : "", "coat");
      let s = "";
      if (/^assis/.test(pose)) {
        const d = "M-5.4,-0.6 C-6.2,-5.6 -3,-8.2 -0.4,-9.6 C1.6,-10.8 4.4,-9.8 4.4,-7 C4.4,-4.2 3.6,-1.8 3.2,-0.6 Z";
        s += E(-0.6, -0.2, 6.2, 1.4, "rgba(40,55,20,.18)", 0);
        s += limb([1.5, -6], [1.6, -0.9], lg.w, c.furS) + paw(2, -0.7, lg.w * 0.7, pc);
        s += P2(d, c.fur) + clip(`cp${c.id}${pose}`, d, `<rect x="-7" y="-12" width="13" height="13" fill="${c.furS}"/><ellipse cx="-1.4" cy="-5.6" rx="5.6" ry="5.4" fill="${c.fur}"/>` + E(3.6, -5.2, 1.5, 3.2, c.belly || c.furS, 0) + coat(-1.6, -4.2) + `<path d="M-3.6,-6.6 Q-1.4,-9 1.4,-9.6" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P2(d, "none");
        s += `<path d="M-0.4,-0.8 Q0.6,-5 -3.2,-6.4" fill="none" stroke="${OUT3}" stroke-width="0.8" stroke-linecap="round"/>`;
        s += E(0.4, -0.85, lg.w * 1.15, 0.9, c.fur, 0.9) + toes(0.6, -0.9, lg.w * 0.95);
        s += limb([2.9, -6], [3, -0.9], lg.w, c.fur) + paw(3.4, -0.7, lg.w * 0.7, pc);
        s += thick(n ? "M-5,-1.4 Q-1,1.6 3.8,0 Q5.4,-0.6 5.6,-2.6" : "M-5,-1.4 Q-1,1.4 5,-0.4", tw, c.fur);
        s += headQuad(c, { pose, hx: 2.6, hy: -13.4, hr, mode: "open", bx: 0, by: -5 });
        return s;
      }
      const rx = 6.6, ry = 3.8 * (n ? 1.06 : 1), cx = -1.2, cy = -ry, hx = 4, hy = -hr * 0.95;
      s += E(cx + 1, -0.2, rx * 1.05, 1.4, "rgba(40,55,20,.18)", 0);
      s += blob(c, `cp${c.id}${pose}`, cx, cy, rx, ry, coat(cx, cy + ry * 0.5));
      s += thick(`M${r23(cx - rx * 0.92)},-1.6 Q${r23(cx + 1)},1.3 ${r23(hx + 1.4)},-0.4`, tw, c.fur);
      s += headQuad(c, { pose, hx, hy, hr, mode: "blink", bx: cx, by: cy });
      s += E(hx + hr * 0.62, -0.8, lg.w * 1.1, 0.9, c.fur, 0.9) + toes(hx + hr * 0.7, -0.85, lg.w * 0.9);
      s += zed(hx + hr * 0.7, hy - hr * 1.6, 0.8) + (n ? zed(hx + hr * 1.15, hy - hr * 2.3, 1.05) : "");
      return s;
    }
    __name(chatPose, "chatPose");
    function tail(c, { bx, by, ph, walk }) {
      const t = c.tail || {};
      const [, , brx] = c.body;
      const x = bx - brx * 0.92, y = by - c.body[3] * 0.35;
      const w = walk ? ph * 0.8 : 0;
      switch (t.kind) {
        case "tuft":
          return thick(`M${x},${y} Q${r23(x - 2.4)},${r23(y + 2)} ${r23(x - 2 + w)},${r23(y + 6)}`, 0.8, c.fur) + E(x - 2 + w, y + 6.6, 1.1, 1.5, t.color || c.furS, 0.8);
        case "puff":
          return E(x + 0.4, y, t.r || 1.8, t.r || 1.8, t.color || c.belly || "#FFFFFF", 0.9);
        case "curly":
          return stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 2.4, OUT3) + stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 0.9, c.fur);
        case "short":
          return P2(`M${x + 0.6},${y - 0.6} L${r23(x - 2.2)},${r23(y - 3 + w * 0.5)} L${r23(x + 0.4)},${r23(y + 1)} Z`, t.color || c.fur, 0.9);
        case "bushy": {
          const L0 = t.len || 9, up2 = t.up ?? 0.4;
          const tip = [x - L0, y - L0 * up2 + w];
          const d = `M${r23(x + 1)},${r23(y - 1.4)} Q${r23(x - L0 * 0.5)},${r23(y - L0 * up2 - 3.6 + w)} ${r23(tip[0])},${r23(tip[1])} Q${r23(x - L0 * 0.4)},${r23(y + 2.6 + w * 0.5)} ${r23(x + 1)},${r23(y + 1.6)} Z`;
          return P2(d, c.fur) + clip(`t${c.id}${ph}${walk}`, d, `<circle cx="${r23(tip[0])}" cy="${r23(tip[1])}" r="${r23(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P2(d, "none");
        }
        case "horse":
          return thick(`M${x},${y - 1} Q${r23(x - 3)},${r23(y + 1)} ${r23(x - 2.4 + w)},${r23(y + 8)}`, 2.2, t.color) + stroke(`M${r23(x - 1)},${r23(y + 1)} Q${r23(x - 2.6)},${r23(y + 4)} ${r23(x - 2.4 + w)},${r23(y + 7)}`, 0.5, OUT3);
        // le chat : la queue monte en S, le bout recourbé vers l'avant
        case "chat":
          return thick(`M${r23(x + 0.4)},${r23(y)} C${r23(x - 3.4)},${r23(y - 0.4)} ${r23(x - 4.6 + w * 0.4)},${r23(y - 4.6)} ${r23(x - 3.6 + w)},${r23(y - 7.4)} Q${r23(x - 3 + w)},${r23(y - 8.8)} ${r23(x - 1.8 + w)},${r23(y - 8.2)}`, t.w || 1.3, c.fur);
        case "thin":
          return thick(`M${x},${y} Q${r23(x - 3.6)},${r23(y - 1)} ${r23(x - 3.4 + w)},${r23(y - (t.up || 5))}`, t.w || 1.2, t.color || c.fur);
        case "lizard":
          return thick(`M${x + 1},${y + 0.6} Q${r23(x - 4)},${r23(y + 2)} ${r23(x - 6.2 + w)},${r23(-0.9)}`, t.w || 1.8, c.fur);
        case "spiral":
          return thick(`M${x + 1},${y + 0.6} Q${r23(x - 4)},${r23(y + 1)} ${r23(x - 4.6)},${r23(y + 4)} Q${r23(x - 4.4)},${r23(y + 6.4)} ${r23(x - 2.4)},${r23(y + 5.6)} Q${r23(x - 1.6)},${r23(y + 4.2)} ${r23(x - 3)},${r23(y + 4)}`, 1.4, c.fur);
        case "otter":
          return P2(`M${x + 1},${y - 1.2} Q${r23(x - 4)},${r23(y + 0.4)} ${r23(x - 6.4 + w)},${r23(y + 3.4)} Q${r23(x - 3.2)},${r23(y + 3)} ${r23(x + 1)},${r23(y + 1.6)} Z`, c.fur);
        default:
          return "";
      }
    }
    __name(tail, "tail");
    function headQuad(c, ctx) {
      const { hx, hy, hr, mode } = ctx;
      const e = c.ears || {};
      const derriere = e.kind === "fox" || e.kind === "chat";
      let s = "";
      s += ear(c, e, hx, hy, hr, true, ctx.pose);
      if (derriere) s += ear(c, e, hx, hy, hr, false, ctx.pose);
      s += c.parts?.neck ? c.parts.neck(ctx) : "";
      s += c.parts?.behindHead ? c.parts.behindHead(ctx) : "";
      const hw = hr * (c.headW || 1), hd = `M${r23(hx - hw)},${r23(hy)} a${r23(hw)},${r23(hr)} 0 1,0 ${r23(2 * hw)},0 a${r23(hw)},${r23(hr)} 0 1,0 ${r23(-2 * hw)},0 Z`;
      s += P2(hd, c.headC || c.fur) + clip(`q${c.id}${ctx.pose}h`, hd, `<rect x="${r23(hx - hw - 1)}" y="${r23(hy - hr - 1)}" width="${r23(hw * 2 + 2)}" height="${r23(hr * 2 + 2)}" fill="${c.headCS || c.furS}"/><ellipse cx="${r23(hx - hw * 0.12)}" cy="${r23(hy - hr * 0.14)}" rx="${r23(hw * 0.97)}" ry="${r23(hr * 0.92)}" fill="${c.headC || c.fur}"/>`) + P2(hd, "none");
      s += c.parts?.face ? c.parts.face(ctx) : "";
      if (c.snout) {
        const [dx, dy, rx, ry, col] = c.snout;
        s += E(hx + dx, hy + dy, rx, ry, col || c.belly, 0.9);
      }
      if (c.nose) {
        const [dx, dy, r, col] = c.nose;
        s += E(hx + dx, hy + dy, r * 1.1, r * 0.85, col || OUT3, 0.6);
      }
      const [edx, edy, er] = c.eye;
      if (c.iris && mode === "open") s += E(hx + edx, hy + edy, er * 1.1, er * 1.32, c.iris, 0.5);
      s += eye(hx + edx, hy + edy, er, mode);
      if (c.blush !== false) s += E(hx + edx - er * 0.4, hy + edy + er * 1.6, er * 1.05, er * 0.55, "#F7A8B0", 0);
      if (!derriere) s += ear(c, e, hx, hy, hr, false, ctx.pose);
      s += c.parts?.head ? c.parts.head(ctx) : "";
      return s;
    }
    __name(headQuad, "headQuad");
    function oreilleRenard(e, x, y, u, a, col, dedans, id3, w = 1) {
      const forme = /* @__PURE__ */ __name((b2, h2, d2, dy) => `M${r23(x - b2)},${r23(y + dy + d2)} C${r23(x - b2 * 1.06)},${r23(y + dy - h2 * 0.42)} ${r23(x - b2 * 0.34)},${r23(y + dy - h2 * 0.9)} ${r23(x)},${r23(y + dy - h2)} C${r23(x + b2 * 0.34)},${r23(y + dy - h2 * 0.9)} ${r23(x + b2 * 1.06)},${r23(y + dy - h2 * 0.42)} ${r23(x + b2)},${r23(y + dy + d2)} Z`, "forme");
      const b = u * 0.52 * w, h = u * 1.08, d = forme(b, h, u * 0.5, 0);
      const bout = e.tip ? `<rect x="${r23(x - b - 1)}" y="${r23(y - h - 1)}" width="${r23(2 * b + 2)}" height="${r23(h * 0.3 + 1)}" fill="${e.tip}"/>` : "";
      const creux = dedans ? `<path d="${forme(b * 0.56, h * 0.7, u * 0.3, u * 0.08)}" fill="${e.inner || "#F2C6C0"}"/>` : "";
      return `<g transform="rotate(${r23(a)} ${r23(x)} ${r23(y)})">${P2(d, col)}${bout || creux ? clip(id3, d, creux + bout) : ""}${P2(d, "none")}</g>`;
    }
    __name(oreilleRenard, "oreilleRenard");
    function oreilleChat(x, y, b, h, a, col, dedans, id3) {
      const forme = /* @__PURE__ */ __name((b2, h2, dy) => `M${r23(x - b2)},${r23(y + h2 * 0.45)} L${r23(x - b2 * 0.28)},${r23(y + dy - h2 * 0.9)} Q${r23(x)},${r23(y + dy - h2 * 1.06)} ${r23(x + b2 * 0.28)},${r23(y + dy - h2 * 0.9)} L${r23(x + b2)},${r23(y + h2 * 0.45)} Z`, "forme");
      const d = forme(b, h, 0);
      return `<g transform="rotate(${r23(a)} ${r23(x)} ${r23(y)})">${P2(d, col)}${dedans ? clip(id3, d, `<path d="${forme(b * 0.52, h * 0.66, h * 0.1)}" fill="${dedans}"/>`) : ""}${P2(d, "none")}</g>`;
    }
    __name(oreilleChat, "oreilleChat");
    function ear(c, e, hx, hy, hr, far, pose) {
      const col = far ? c.headCS || c.furS : c.headC || c.fur, inner = e.inner || "#F2C6C0";
      const o = far ? -hr * 0.5 : 0;
      const k = e.size || 1;
      switch (e.kind) {
        case "pointy": {
          const x = hx - hr * 0.2 + o, y = hy - hr * 0.75;
          return P2(`M${r23(x - hr * 0.42 * k)},${r23(y + 0.4)} L${r23(x + hr * 0.05)},${r23(y - hr * 1.05 * k)} L${r23(x + hr * 0.5 * k)},${r23(y + 0.2)} Z`, col, 0.9) + (far ? "" : P2(`M${r23(x - hr * 0.2 * k)},${r23(y)} L${r23(x + hr * 0.05)},${r23(y - hr * 0.7 * k)} L${r23(x + hr * 0.28 * k)},${r23(y)} Z`, inner, 0));
        }
        // chat : sur le dessus du crâne, assez petites ; celle du fond en retrait, un peu plus petite, sans le rose
        case "chat":
          return far ? oreilleChat(hx - hr * 0.38, hy - hr * 0.8, hr * 0.32 * k, hr * 0.56 * k, -8, col, null, "") : oreilleChat(hx + hr * 0.16, hy - hr * 0.76, hr * 0.34 * k, hr * 0.6 * k, 8, col, inner, `oc${c.id}${pose}`);
        // renard : derrière la tête (headQuad), celle du fond en retrait, plus petite et plus penchée
        case "fox":
          return far ? oreilleRenard(e, hx - hr * 0.5, hy - hr * 0.56, hr * k * 0.88, -18, col, false, `oe${c.id}${pose}f`, e.w) : oreilleRenard(e, hx - hr * 0.12, hy - hr * 0.6, hr * k, -6, col, true, `oe${c.id}${pose}n`, e.w);
        case "round":
          return E(hx - hr * 0.35 + o, hy - hr * 0.85, hr * 0.38 * k, hr * 0.38 * k, col, 0.9) + (far ? "" : E(hx - hr * 0.35, hy - hr * 0.85, hr * 0.2 * k, hr * 0.2 * k, inner, 0));
        case "side": {
          const x = hx - hr * 0.55 + o * 0.4, y = hy - hr * 0.45;
          return `<g transform="rotate(${far ? -25 : -10} ${r23(x)} ${r23(y)})">${P2(`M${r23(x)},${r23(y)} Q${r23(x - hr * 0.9 * k)},${r23(y - hr * 0.55)} ${r23(x - hr * 1.3 * k)},${r23(y)} Q${r23(x - hr * 0.8 * k)},${r23(y + hr * 0.4)} ${r23(x)},${r23(y + hr * 0.25)} Z`, col, 0.9)}${far ? "" : E(x - hr * 0.75 * k, y, hr * 0.32 * k, hr * 0.14, inner, 0)}</g>`;
        }
        case "flop": {
          const x = hx - hr * 0.1 + o * 0.6, y = hy - hr * 0.8;
          return P2(`M${r23(x - hr * 0.4)},${r23(y + 0.6)} L${r23(x + hr * 0.1)},${r23(y - hr * 0.6 * k)} L${r23(x + hr * 0.75 * k)},${r23(y + hr * 0.25)} Z`, col, 0.9);
        }
        case "hang": {
          const x = hx - hr * 0.5 + o * 0.5, y = hy - hr * 0.6;
          return P2(`M${r23(x + hr * 0.3)},${r23(y)} Q${r23(x - hr * 0.5)},${r23(y - hr * 0.1)} ${r23(x - hr * 0.35)},${r23(y + hr * 1.1 * k)} Q${r23(x + hr * 0.1)},${r23(y + hr * 1.2 * k)} ${r23(x + hr * 0.5)},${r23(y + hr * 0.3)} Z`, far ? c.furS : e.color || c.furS, 0.9);
        }
        case "long": {
          const x = hx - hr * 0.3 + o, y = hy - hr * 0.7;
          return `<g transform="rotate(${far ? -28 : -12} ${r23(x)} ${r23(y)})">${P2(`M${r23(x - hr * 0.3)},${r23(y)} Q${r23(x - hr * 0.5)},${r23(y - hr * 2.2 * k)} ${r23(x + hr * 0.05)},${r23(y - hr * 2.3 * k)} Q${r23(x + hr * 0.5)},${r23(y - hr * 2.2 * k)} ${r23(x + hr * 0.3)},${r23(y)} Z`, col, 0.9)}${far ? "" : E(x, y - hr * 1.2 * k, hr * 0.14, hr * 0.8 * k, inner, 0)}</g>`;
        }
        default:
          return "";
      }
    }
    __name(ear, "ear");
    var spots = /* @__PURE__ */ __name((list, col) => list.map(([x, y, rx, ry]) => E(x, y, rx, ry, col, 0)).join(""), "spots");
    var horn = /* @__PURE__ */ __name((d) => thick(d, 1.1, "#F2E6C8"), "horn");
    var Q = {};
    Q.cow = (v) => {
      const patch3 = v === "rousse" ? "#B8643A" : "#3E3A3A";
      return {
        id: "cow" + (v || ""),
        size: "MID",
        fur: "#FFFFFF",
        furS: "#E2DED6",
        belly: "#F2EEE6",
        // chibi : grosse tête ronde, corps dodu, pattes courtes et trapues
        body: [-2, -9.8, 9.4, 6.6],
        head: [8.4, -14.6, 6.9],
        headW: 1.02,
        legs: { back: -6.6, front: 4.2, top: -6.2, w: 3, hoof: "#5A5250" },
        snout: [4.2, 2.6, 3.6, 2.7, "#F6BDB6"],
        nose: [5.8, 2, 0.6, "#C77A74"],
        eye: [1.3, -1.4, 1.55],
        ears: { kind: "side", size: 0.9 },
        tail: { kind: "tuft", color: patch3 },
        parts: {
          coat: /* @__PURE__ */ __name(({ bx, by }) => spots([[bx - 4, by - 2.4, 3.6, 2.6], [bx + 4, by + 0.6, 2.8, 2.2], [bx - 7.6, by + 1.6, 1.8, 1.6]], patch3), "coat"),
          face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx - hr * 0.3, hy - hr * 0.48, hr * 0.4, hr * 0.3, patch3, 0), "face"),
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => horn(`M${r23(hx - 1.6)},${r23(hy - hr * 0.85)} Q${r23(hx - 2.2)},${r23(hy - hr - 2)} ${r23(hx - 0.6)},${r23(hy - hr - 2.6)}`), "head"),
          body: /* @__PURE__ */ __name(({ bx, by, rest }) => rest ? "" : E(bx + 2.6, by + 6.6, 1.8, 1.1, "#F6BDB6", 0.7), "body")
        }
      };
    };
    Q.sheep = (v) => {
      const wool = v === "noir" ? "#5A5458" : "#F8F4EC", woolS = v === "noir" ? "#443F43" : "#DCD5C8", face2 = v === "noir" ? "#2E2A2E" : "#5E5660";
      const puffs = /* @__PURE__ */ __name((cx, cy, rx, ry) => {
        let s = "";
        for (let i = 0; i < 10; i++) {
          const a = i / 10 * Math.PI * 2;
          s += E(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 2.6, 2.4, wool, 0.9);
        }
        return s + E(cx, cy, rx + 0.4, ry + 0.2, wool, 0) + E(cx - 1.6, cy - 2.6, 3, 1.4, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.4" fill=') + E(cx + 1, cy + 2.6, rx * 0.7, 1.4, woolS, 0).replace("fill=", 'fill-opacity="0.6" fill=');
      }, "puffs");
      return {
        id: "sheep" + (v || ""),
        size: "MID",
        fur: wool,
        furS: woolS,
        belly: woolS,
        headC: face2,
        headCS: face2,
        // chibi : grosse tête, nuage de laine dodu, pattes courtes
        body: [-1.4, -9.4, 7.8, 5.6],
        head: [7.8, -13.6, 5.6],
        legs: { back: -5.2, front: 3.6, top: -5.4, w: 2.2, hoof: "#2E2A2E", color: face2, colorS: v === "noir" ? "#1E1A1E" : "#463F48" },
        snout: [3.4, 2, 2.8, 2.1, face2],
        nose: [5, 1.2, 0.5, "#1E1A1E"],
        eye: [1.1, -0.9, 1.35],
        ears: { kind: "side", size: 0.8, inner: "#8A7A80" },
        tail: { kind: "puff", color: wool, r: 2 },
        parts: {
          body: /* @__PURE__ */ __name(({ bx, by }) => puffs(bx, by, 7.4, 5.4), "body"),
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx - 1.2, hy - hr * 0.78, 2.4, 1.8, wool, 0.9) + E(hx + 0.6, hy - hr * 0.95, 1.6, 1.3, wool, 0.9), "head")
        }
      };
    };
    Q.pig = (v) => ({
      id: "pig" + (v || ""),
      size: "MID",
      fur: "#F6BCBC",
      furS: "#E39C9E",
      belly: "#FAD2D0",
      // chibi : tout rond, grosse tête, petites pattes
      body: [-1.4, -8.8, 8.6, 6.4],
      head: [7.4, -12.8, 6.4],
      legs: { back: -5.2, front: 3.8, top: -4.4, w: 2.6, hoof: "#C77A7C" },
      snout: [5.6, 1.4, 2.2, 2.5, "#F29EA0"],
      eye: [1.4, -1.6, 1.4],
      blush: true,
      ears: { kind: "flop", size: 0.85 },
      tail: { kind: "curly" },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => v === "tachete" ? spots([[bx - 3, by - 2, 2.8, 2.2], [bx + 4, by + 0.4, 2, 1.8], [bx - 6.6, by + 1.6, 1.4, 1.2]], "#8A5A5A") : "", "coat"),
        face: /* @__PURE__ */ __name(({ hx, hy, hr }) => v === "tachete" ? E(hx - hr * 0.4, hy - hr * 0.32, hr * 0.32, hr * 0.26, "#8A5A5A", 0) : "", "face"),
        head: /* @__PURE__ */ __name(({ hx, hy }) => E(hx + 5.1, hy + 1.6, 0.42, 0.66, "#B8686A", 0) + E(hx + 6.2, hy + 1.6, 0.42, 0.66, "#B8686A", 0), "head")
      }
    });
    Q.goat = (v) => {
      const fur = v === "brune" ? "#9A6A44" : "#F4F0E8", furS = v === "brune" ? "#7A5232" : "#D8D2C6";
      return {
        id: "goat" + (v || ""),
        size: "MID",
        fur,
        furS,
        belly: v === "brune" ? "#C49A72" : "#FFFFFF",
        // chibi : grosse tête, corps court, pattes courtes
        body: [-1.6, -10.2, 8, 5.6],
        head: [8, -15.6, 6],
        legs: { back: -5.8, front: 3.8, top: -6.6, w: 2.2, hoof: "#4A3C34" },
        snout: [3.8, 2.2, 3, 2.4, v === "brune" ? "#B48660" : "#EDE6DA"],
        nose: [5.6, 1.4, 0.55, "#4A3C34"],
        eye: [1.1, -1.2, 1.35],
        ears: { kind: "side", size: 0.8 },
        tail: { kind: "short" },
        parts: {
          neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P2(`M${r23(bx + 5.4)},${r23(by - 3.6)} L${r23(hx - 2.6)},${r23(hy - 1)} L${r23(hx + 0.6)},${r23(hy + 3.4)} L${r23(bx + 8.4)},${r23(by + 1)} Z`, fur, 0.9), "neck"),
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => thick(`M${r23(hx - 1)},${r23(hy - hr * 0.8)} Q${r23(hx - 2.6)},${r23(hy - hr - 2.6)} ${r23(hx - 4.6)},${r23(hy - hr - 1.4)}`, 1.1, "#B8A88C") + P2(`M${r23(hx + hr * 0.45)},${r23(hy + hr * 0.74)} L${r23(hx + hr * 0.27)},${r23(hy + hr * 1.36)} L${r23(hx + hr * 0.73)},${r23(hy + hr * 0.78)} Z`, furS, 0.7), "head")
        }
      };
    };
    Q.deer = () => ({
      id: "deer",
      size: "TALL",
      fur: "#C98A50",
      furS: "#A86E3A",
      belly: "#F2DEC0",
      // chibi : grosse tête de faon, corps rond, pattes plus courtes
      body: [-1.6, -14.6, 8.6, 6],
      head: [8.4, -24.4, 6],
      legs: { back: -6.6, front: 4.4, top: -10.4, w: 2, hoof: "#4A3C34" },
      snout: [3.8, 2.2, 3, 2.2, "#E8C9A0"],
      nose: [5.9, 1.4, 0.6, OUT3],
      eye: [1.1, -1.1, 1.4],
      ears: { kind: "side", size: 1 },
      tail: { kind: "puff", color: "#FFFFFF", r: 1.6 },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => spots([[bx - 4, by - 3.4, 0.8, 0.6], [bx - 1, by - 4, 0.8, 0.6], [bx + 2, by - 3.6, 0.8, 0.6], [bx - 2.6, by - 1.8, 0.7, 0.5], [bx + 0.6, by - 2, 0.7, 0.5]], "#FFF4E0"), "coat"),
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P2(`M${r23(bx + 5)},${r23(by - 4)} L${r23(hx - 2.8)},${r23(hy - 0.4)} L${r23(hx + 0.6)},${r23(hy + 3.6)} L${r23(bx + 8.6)},${r23(by + 1)} Z`, "#C98A50", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => thick(`M${r23(hx - 1.4)},${r23(hy - hr * 0.85)} Q${r23(hx - 2.6)},${r23(hy - hr - 3)} ${r23(hx - 1.4)},${r23(hy - hr - 5.6)} M${r23(hx - 2.2)},${r23(hy - hr - 2.6)} L${r23(hx - 4.6)},${r23(hy - hr - 3.8)}`, 0.9, "#E6D2A8"), "head")
      }
    });
    Q.fox = () => ({
      id: "fox",
      size: "MID",
      fur: "#E8803A",
      furS: "#C8642A",
      belly: "#FFF4E6",
      // chibi : grosse tête, corps court, pattes courtes, queue en panache (le renard polaire en hérite)
      body: [-1.4, -8.2, 7.4, 4.8],
      head: [7.2, -12.6, 5.8],
      legs: { back: -4.8, front: 3.8, top: -4.6, w: 1.8, paw: "#3A2A24" },
      snout: [3.8, 2, 3.1, 1.9, "#FFF4E6"],
      nose: [6.4, 1.3, 0.62, OUT3],
      eye: [1.2, -1.2, 1.35],
      ears: { kind: "fox", size: 1.1, inner: "#FFF1E2", tip: "#4A3020" },
      tail: { kind: "bushy", len: 10, up: 0.3, tip: "#FFFFFF" },
      parts: { face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.2917, hy + hr * 0.3333, hr * 0.5417, hr * 0.4167, "#FFF4E6", 0), "face") }
    });
    Q.kit = () => ({ ...Q.fox(), id: "kit", size: "SMALL", body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.6, 4.8], legs: { back: -3, front: 2.4, top: -3, w: 1.4, paw: "#3A2A24" }, snout: [2.6, 1.8, 2.2, 1.4, "#FFF4E6"], nose: [4.6, 1.1, 0.5, OUT3], eye: [1.1, -0.8, 1.3], tail: { kind: "bushy", len: 7, up: 0.5, tip: "#FFFFFF" } });
    Q.snowFox = () => ({ ...Q.fox(), id: "snowFox", fur: "#F6F8FC", furS: "#C9D4E2", belly: "#FFFFFF", ears: { kind: "fox", size: 0.78, inner: "#F4D8DC" }, tail: { kind: "bushy", len: 10, up: 0.4, tip: "#DCE6F2" }, nose: [5.2, 0.9, 0.55, "#3A3A48"], parts: {} });
    Q.fennec = () => ({ ...Q.fox(), id: "fennec", size: "SMALL", fur: "#EDCB94", furS: "#CFA870", belly: "#FFF6E6", body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.4, 4.6], legs: { back: -3, front: 2.4, top: -3, w: 1.2, paw: "#CFA870" }, snout: [2.6, 1.7, 2.1, 1.35, "#FFF6E6"], nose: [4.4, 1, 0.5, OUT3], eye: [1.1, -0.8, 1.3], ears: { kind: "fox", size: 1.45, w: 1.15, inner: "#F6D2C8" }, tail: { kind: "bushy", len: 7, up: 0.3, tip: "#5A4232" }, parts: {} });
    Q.rabbit = () => ({
      id: "rabbit",
      size: "SMALL",
      fur: "#D8C4AE",
      furS: "#B8A288",
      belly: "#FFFFFF",
      // chibi : grosse tête ronde, corps en boule, longues oreilles un peu plus courtes
      body: [-0.6, -5.2, 5, 4],
      head: [4, -9.2, 4.6],
      restDrop: 0.8,
      legs: { back: -2.4, front: 2.4, top: -2.2, w: 1.8, paw: "#FFFFFF" },
      snout: [2.9, 1.5, 1.8, 1.4, "#FFFFFF"],
      nose: [4.3, 0.6, 0.45, "#E88A90"],
      eye: [1.2, -0.9, 1.3],
      ears: { kind: "long", size: 0.8 },
      tail: { kind: "puff", color: "#FFFFFF", r: 1.6 }
    });
    Q.hedgehog = () => ({
      id: "hedgehog",
      size: "SMALL",
      fur: "#E8D2B0",
      furS: "#C8B08C",
      belly: "#F4E6CC",
      // chibi : la tête plus grosse et ronde devant son dôme de piquants
      body: [-0.6, -4.4, 6, 3.6],
      head: [4.6, -4.8, 3.4],
      restDrop: 0.6,
      legs: { back: -3, front: 2.4, top: -1.6, w: 1.2, paw: "#5A4232" },
      snout: [2.6, 1, 2.1, 1.3, "#E8D2B0"],
      nose: [4.5, 0.6, 0.55, OUT3],
      eye: [0.7, -0.7, 1.05],
      ears: { kind: "round", size: 0.7 },
      tail: {},
      parts: {
        // dôme de piquants
        body: /* @__PURE__ */ __name(({ bx, by }) => {
          let d = `M${r23(bx + 3.6)},${r23(by + 2.6)}`;
          for (let i = 0; i <= 10; i++) {
            const a = Math.PI * (0.05 + i * 0.09);
            const r = i % 2 ? 6.4 : 8;
            d += ` L${r23(bx - 0.6 - Math.cos(a) * r)},${r23(by + 1.6 - Math.sin(a) * r * 0.9)}`;
          }
          d += ` L${r23(bx - 6.6)},${r23(by + 3.2)} Z`;
          return P2(d, "#8A6440") + stroke(`M${r23(bx - 3)},${r23(by - 2)} L${r23(bx - 2)},${r23(by - 4)} M${r23(bx)},${r23(by - 2.4)} L${r23(bx + 0.6)},${r23(by - 4.6)}`, 0.6, "#B88A5A");
        }, "body")
      }
    });
    Q.squirrel = () => ({
      id: "squirrel",
      size: "SMALL",
      fur: "#C8642E",
      furS: "#A84E22",
      belly: "#F6E2C8",
      // chibi : grosse tête ronde, petit corps, queue en panache
      body: [-0.4, -5.8, 4.2, 3.8],
      head: [3.4, -10.4, 4.4],
      restDrop: 0.4,
      legs: { back: -2, front: 2.1, top: -2.4, w: 1.4, paw: "#A84E22" },
      snout: [2.4, 1.5, 1.8, 1.3, "#F6E2C8"],
      nose: [3.9, 0.8, 0.42, OUT3],
      eye: [1, -0.9, 1.25],
      ears: { kind: "pointy", size: 0.9, inner: "#F2C6C0" },
      tail: { kind: "bushy", len: 7.6, up: 1.55, tip: "#E07E44" },
      parts: { head: /* @__PURE__ */ __name(({ hx, hy, hr, rest }) => rest ? E(hx + hr * 0.4, hy + hr * 1.1, 1.3, 1.5, "#A8743F", 0.7) + E(hx + hr * 0.4, hy + hr * 1.1 - 1.2, 1.4, 0.7, "#7E5530", 0.6) : "", "head") }
    });
    Q.ibex = () => ({
      id: "ibex",
      size: "TALL",
      fur: "#A8906E",
      furS: "#86704F",
      belly: "#E8DCC4",
      // chibi : grosse tête sous ses grandes cornes, corps rond, pattes plus courtes
      body: [-1.6, -14, 8.6, 6.2],
      head: [8.4, -21.6, 5.8],
      legs: { back: -6.6, front: 4.4, top: -9.4, w: 2, hoof: "#3E3430" },
      snout: [3.6, 2, 3, 2.4, "#C8B496"],
      nose: [5.6, 1.3, 0.55, OUT3],
      eye: [1, -1, 1.35],
      ears: { kind: "side", size: 0.7 },
      tail: { kind: "short", color: "#5A4A3A" },
      parts: {
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P2(`M${r23(bx + 5.4)},${r23(by - 4)} L${r23(hx - 2.8)},${r23(hy - 0.6)} L${r23(hx + 0.6)},${r23(hy + 3.6)} L${r23(bx + 8.8)},${r23(by + 1.2)} Z`, "#A8906E", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => {
          const d = `M${r23(hx - 0.6)},${r23(hy - hr * 0.8)} Q${r23(hx - 2)},${r23(hy - hr - 6)} ${r23(hx - 7.6)},${r23(hy - hr - 6.4)} Q${r23(hx - 11.4)},${r23(hy - hr - 5.4)} ${r23(hx - 10.6)},${r23(hy - hr - 1.6)}`;
          return thick(d, 2, "#C8B48E") + [0.25, 0.45, 0.65].map((t) => E(hx - 2 - t * 8, hy - hr - 5.2 - Math.sin(t * Math.PI) * 1.2, 1.2, 0.35, "#8A7656", 0)).join("") + P2(`M${r23(hx + hr * 0.43)},${r23(hy + hr * 0.7)} L${r23(hx + hr * 0.17)},${r23(hy + hr * 1.39)} L${r23(hx + hr * 0.7)},${r23(hy + hr * 0.78)} Z`, "#5A4A3A", 0.7);
        }, "head")
      }
    });
    Q.pony = () => ({
      id: "pony",
      size: "TALL",
      fur: "#C07A44",
      furS: "#9E5E30",
      belly: "#E0B08A",
      // chibi : grosse tête, corps dodu, pattes plus courtes, crinière blonde
      body: [-1.6, -13.4, 9, 6.6],
      head: [8.6, -21.4, 6.4],
      headW: 1.05,
      legs: { back: -6.8, front: 4.6, top: -8.8, w: 2.4, hoof: "#3E3430" },
      snout: [4.2, 2.8, 3.6, 2.8, "#E8C9A8"],
      nose: [6.6, 2, 0.55, OUT3],
      eye: [0.8, -1.2, 1.5],
      ears: { kind: "pointy", size: 0.75, inner: "#E8B0A0" },
      tail: { kind: "horse", color: "#F2D28A" },
      parts: {
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P2(`M${r23(bx + 5)},${r23(by - 4.4)} L${r23(hx - 3.4)},${r23(hy - 1)} L${r23(hx + 0.6)},${r23(hy + 4.2)} L${r23(bx + 9.4)},${r23(by + 1.4)} Z`, "#C07A44", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr, bx, by }) => thick(`M${r23(hx - 1)},${r23(hy - hr * 0.9)} Q${r23(hx - 6)},${r23(hy - 2)} ${r23(bx + 4.6)},${r23(by - 5.2)}`, 2.6, "#F2D28A") + P2(`M${r23(hx - 0.4)},${r23(hy - hr * 0.95)} Q${r23(hx + 2.6)},${r23(hy - hr * 0.7)} ${r23(hx + 2)},${r23(hy - 1.4)} Q${r23(hx)},${r23(hy - 2.4)} ${r23(hx - 2)},${r23(hy - hr * 0.5)} Z`, "#F2D28A", 0.8), "head")
      }
    });
    Q.camel = () => ({
      id: "camel",
      size: "TALL",
      fur: "#D8AE70",
      furS: "#B88E52",
      belly: "#EBCB98",
      // chibi : grosse tête au bout du long cou, corps rond, pattes plus courtes
      body: [-1.6, -15.4, 8.8, 6],
      head: [10.2, -24.2, 4.8],
      headW: 1.2,
      legs: { back: -6.8, front: 4.4, top: -11.4, w: 1.8, hoof: "#8A6A44" },
      snout: [4.4, 1.3, 2.6, 2.1, "#E8C48E"],
      nose: [6.4, 0.6, 0.45, OUT3],
      eye: [0.8, -1, 1.25],
      ears: { kind: "round", size: 0.6 },
      tail: { kind: "tuft", color: "#8A6A44" },
      parts: {
        back: /* @__PURE__ */ __name(({ bx, by }) => E(bx - 0.6, by - 5.6, 5, 4.4, "#D8AE70"), "back"),
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => thick(`M${r23(bx + 6.4)},${r23(by - 1)} Q${r23(bx + 11)},${r23(by - 2)} ${r23(hx - 1.6)},${r23(hy + 1.6)}`, 3, "#D8AE70"), "neck")
      }
    });
    Q.chameleon = () => ({
      id: "chameleon",
      size: "SMALL",
      fur: "#7CC46A",
      furS: "#5AA04C",
      belly: "#C8EE9A",
      // chibi : la tête plus grosse, le grand œil en tourelle
      body: [-0.6, -6, 5.4, 3.2],
      head: [5, -7, 3.6],
      headW: 1.15,
      restDrop: 0.4,
      headDrop: 0.6,
      legs: { back: -2.8, front: 2.6, top: -3.4, w: 1.1, paw: "#5AA04C" },
      eye: [0.7, -0.5, 1.3],
      blush: false,
      ears: {},
      tail: { kind: "spiral" },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => [-3, -0.4, 2.2].map((x) => `<path d="M${r23(bx + x)},${r23(by - 3)} L${r23(bx + x + 0.8)},${r23(by + 2)}" stroke="#F2C94C" stroke-width="0.8"/>`).join(""), "coat"),
        behindHead: /* @__PURE__ */ __name(({ hx, hy }) => P2(`M${r23(hx - 2.6)},${r23(hy - 1.6)} L${r23(hx - 1.4)},${r23(hy - 4.4)} L${r23(hx + 1)},${r23(hy - 2.4)} Z`, "#7CC46A", 0.8), "behindHead"),
        face: /* @__PURE__ */ __name(({ hx, hy, mode }) => E(hx + 0.7, hy - 0.5, 2.1, 2.1, "#5AA04C", 0.7) + P2(`M${r23(hx + 2.2)},${r23(hy + 1.5)} Q${r23(hx + 3.5)},${r23(hy + 1.7)} ${r23(hx + 4.2)},${r23(hy + 0.8)}`, "none", 0.5), "face")
      }
    });
    Q.salamander = () => ({
      id: "salamander",
      size: "SMALL",
      fur: "#E8584A",
      furS: "#B83E34",
      belly: "#F6A060",
      // chibi : la tête plus grosse et ronde
      body: [-0.6, -3.2, 5.6, 2.2],
      head: [5, -4, 3.2],
      headW: 1.12,
      restDrop: 0.4,
      headDrop: 0.5,
      legs: { back: -3, front: 2.6, top: -1.6, w: 1, paw: "#B83E34" },
      eye: [0.7, -0.9, 1.05],
      ears: {},
      tail: { kind: "lizard", w: 1.6 },
      parts: { coat: /* @__PURE__ */ __name(({ bx, by }) => spots([[bx - 3, by - 1, 0.9, 0.7], [bx, by - 1.4, 0.8, 0.6], [bx + 2.6, by - 0.8, 0.7, 0.6]], "#F2C94C"), "coat") }
    });
    Q.tortoise = () => ({
      id: "tortoise",
      size: "SMALL",
      fur: "#B8B07A",
      furS: "#9A9260",
      belly: "#D8D0A0",
      // chibi : la tête plus grosse et ronde sous sa carapace
      body: [-0.6, -3.4, 5.8, 2.4],
      head: [5.8, -5, 3.1],
      headW: 1.12,
      restDrop: 0.4,
      headDrop: 0.4,
      legs: { back: -3.2, front: 2.6, top: -1.6, w: 1.6, paw: "#9A9260" },
      eye: [0.7, -0.6, 1.08],
      ears: {},
      tail: { kind: "short", color: "#B8B07A" },
      parts: {
        // carapace bombée à écailles
        body: /* @__PURE__ */ __name(({ bx, by }) => {
          const d = `M${r23(bx - 6.6)},${r23(by + 1.4)} Q${r23(bx - 6)},${r23(by - 7)} ${r23(bx)},${r23(by - 7.2)} Q${r23(bx + 6)},${r23(by - 7)} ${r23(bx + 6.6)},${r23(by + 1.4)} Z`;
          return P2(d, "#7E9A4A") + clip(`sh${Math.round(by * 10)}`, d, [[-3.4, -3.6], [0, -5], [3.4, -3.6], [-1.6, -1], [1.8, -1]].map(([x, y]) => `<path d="M${r23(bx + x - 1.6)},${r23(by + y)} l1.6,-1.2 l1.6,1.2 l0,1.6 l-1.6,1.2 l-1.6,-1.2 Z" fill="#9AB85E" stroke="${OUT3}" stroke-width="0.5"/>`).join("")) + P2(d, "none") + P2(`M${r23(bx - 6.6)},${r23(by + 1.4)} L${r23(bx + 6.6)},${r23(by + 1.4)}`, "none", 0.9);
        }, "body")
      }
    });
    Q.otter = () => ({
      id: "otter",
      size: "SMALL",
      fur: "#8A5A36",
      furS: "#6E4428",
      belly: "#E8D2B0",
      // chibi : grosse tête ronde au museau blanc, corps fuselé
      body: [-0.8, -4.6, 6.2, 3.2],
      head: [5.2, -6.8, 4],
      restDrop: 0.6,
      legs: { back: -3.4, front: 2.6, top: -2.4, w: 1.5, paw: "#6E4428" },
      snout: [2.2, 1.4, 2.3, 1.6, "#E8D2B0"],
      nose: [3.9, 0.5, 0.55, OUT3],
      eye: [0.7, -1, 1.15],
      ears: { kind: "round", size: 0.6, inner: "#6E4428" },
      tail: { kind: "otter" },
      parts: { face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.25, hy + hr * 0.38, hr * 0.75, hr * 0.56, "#E8D2B0", 0) + L([hx + hr * 0.8, hy + hr * 0.38], [hx + hr * 1.38, hy + hr * 0.2], OUT3, 0.35) + L([hx + hr * 0.8, hy + hr * 0.5], [hx + hr * 1.38, hy + hr * 0.58], OUT3, 0.35), "face") }
    });
    var CHATS = {
      roux: { fur: "#E8A050", furS: "#C8803A", belly: "#FFF2E0", rayures: true },
      noir: { fur: "#45454F", furS: "#30303A", belly: "#5A5A66", rayures: false, moustache: "#D8D8E2", iris: "#E8C850" },
      gris: { fur: "#A2A2AC", furS: "#7A7A86", belly: "#ECECF2", rayures: true },
      blanc: { fur: "#F6F2EA", furS: "#D8D0C2", belly: "#FFFFFF", rayures: false, taches: ["#E8A050", "#45454F"] }
    };
    Q.cat = (v) => ({
      id: "cat" + (v || ""),
      size: "SMALL",
      ...CHATS[v || "roux"],
      // chibi : grosse tête ronde, corps souple, pattes fines ; petites oreilles sur le dessus du crâne, queue en S
      body: [-1.2, -6.4, 5.6, 3.3],
      head: [4.8, -10.8, 4.4],
      restDrop: 2.2,
      legs: { back: -3.6, front: 2.6, top: -3.8, w: 1.4, paw: "#FFF2E0" },
      snout: [2.2, 1.5, 1.8, 1.25, "#FFF2E0"],
      nose: [3.3, 0.7, 0.4, "#E88A90"],
      eye: [1, -0.7, 1.2],
      ears: { kind: "chat", inner: "#F2B0B0" },
      tail: { kind: "chat", w: 1.3 },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => {
          const C2 = CHATS[v || "roux"];
          if (C2.taches) return E(bx - 1.6, by - 2.2, 2.2, 1.6, C2.taches[0], 0) + E(bx + 2, by - 2.6, 1.4, 1.1, C2.taches[1], 0);
          return C2.rayures ? [-3, -0.6, 1.8].map((x) => `<path d="M${r23(bx + x)},${r23(by - 3.6)} q0.6,1.6 0,3" fill="none" stroke="${C2.furS}" stroke-width="0.9"/>`).join("") : "";
        }, "coat"),
        face: /* @__PURE__ */ __name(({ hx, hy }) => {
          const m = CHATS[v || "roux"].moustache || OUT3;
          return L([hx + 3.2, hy + 1.5], [hx + 5.6, hy + 1], m, 0.35) + L([hx + 3.2, hy + 2], [hx + 5.6, hy + 2.4], m, 0.35);
        }, "face")
      }
    });
    var CHIENS = {
      beige: { fur: "#E0B880", furS: "#C49A62", belly: "#FFF2DE", oreille: "#A8784A" },
      noir: { fur: "#3E3E48", furS: "#2C2C34", belly: "#F4F2EE", oreille: "#26262E", museau: "#F4F2EE", iris: "#C8924A" },
      brun: { fur: "#8E5E38", furS: "#704828", belly: "#EAD0AC", oreille: "#5A3A22" },
      roux: { fur: "#D47C3E", furS: "#B0602C", belly: "#FFE8D2", oreille: "#9A4C22" }
    };
    Q.dog = (v) => ({
      id: "dog" + (v || ""),
      size: "MID",
      ...(({ oreille, museau, ...r }) => r)(CHIENS[v || "beige"]),
      // chibi : grosse tête, oreilles tombantes, pattes courtes
      body: [-1.2, -7.6, 6.6, 4.6],
      head: [6, -12, 5.6],
      restDrop: 1.4,
      legs: { back: -4, front: 3.4, top: -4, w: 2.1, paw: "#FFF2DE" },
      snout: [3.4, 2, 2.8, 2.1, CHIENS[v || "beige"].museau || CHIENS[v || "beige"].belly],
      nose: [5.6, 1.2, 0.68, OUT3],
      eye: [1.1, -1.1, 1.35],
      ears: { kind: "hang", size: 1, color: CHIENS[v || "beige"].oreille },
      tail: { kind: "thin", up: 5, w: 1.4 },
      parts: { neck: /* @__PURE__ */ __name(({ hx, hy, hr }) => P2(`M${r23(hx - hr * 0.82)},${r23(hy + hr * 0.55)} Q${r23(hx - hr * 0.22)},${r23(hy + hr * 1.1)} ${r23(hx + hr * 0.36)},${r23(hy + hr * 0.82)}`, "none", 0).replace('stroke="none"', 'stroke="#E0483C" stroke-width="1.4" stroke-linecap="round"') + E(hx - hr * 0.1, hy + hr * 1.04, 0.7, 0.7, "#F2C94C", 0.5), "neck") }
    });
    Q.frog = () => ({
      id: "frog",
      size: "SMALL",
      fur: "#7CC46A",
      furS: "#5AA04C",
      belly: "#E8F2B0",
      // chibi : toute ronde, grosse tête, les yeux sur deux bosses
      body: [-0.4, -3.8, 5.2, 3.8],
      head: [2.4, -7.6, 4.4],
      headW: 1.15,
      restDrop: 0,
      legs: { back: -3, front: 2.6, top: -1.6, w: 1.4, paw: "#5AA04C" },
      eye: [1.2, -3.1, 1.3],
      blush: true,
      ears: {},
      tail: {},
      parts: {
        behindHead: /* @__PURE__ */ __name(({ hx, hy }) => E(hx - 1.9, hy - 3.3, 2.1, 2.1, "#7CC46A") + E(hx + 1.9, hy - 3.3, 2.1, 2.1, "#7CC46A"), "behindHead"),
        face: /* @__PURE__ */ __name(({ hx, hy }) => P2(`M${r23(hx - 1.6)},${r23(hy + 1.2)} Q${r23(hx + 1.8)},${r23(hy + 3)} ${r23(hx + 4.4)},${r23(hy + 0.5)}`, "none", 0.6), "face"),
        head: /* @__PURE__ */ __name(({ hx, hy, mode }) => eye(hx - 1.9, hy - 3.3, 1.12, mode), "head")
      }
    });
    module.exports = { BOX, K: K2, quad, Q, eye, heartIcon, limb, thick, stroke, line, hoof, paw, oreilleRenard, oreilleChat, petPose, blob, zed, toes };
    function beakOf(b, hx, hy, hr) {
      const x = hx + hr * 0.85, y = hy + (b.dy || 0.4), L0 = b.len || 2.4;
      switch (b.kind) {
        case "long":
          return P2(`M${r23(x - 0.4)},${r23(y - 0.9)} L${r23(x + L0)},${r23(y + 0.2)} L${r23(x - 0.4)},${r23(y + 0.9)} Z`, b.color, 0.8);
        case "big":
          return P2(`M${r23(x - 0.8)},${r23(y - 2.4)} Q${r23(x + L0 * 0.7)},${r23(y - 2.8)} ${r23(x + L0)},${r23(y + 0.6)} Q${r23(x + L0 * 0.5)},${r23(y + 1)} ${r23(x - 0.6)},${r23(y + 1.6)} Z`, b.color, 0.9) + `<path d="M${r23(x + L0 - 1.2)},${r23(y - 0.6)} L${r23(x + L0)},${r23(y + 0.6)}" stroke="${b.tip || OUT3}" stroke-width="1.2"/><path d="M${r23(x - 0.6)},${r23(y - 0.2)} Q${r23(x + L0 * 0.5)},${r23(y - 0.6)} ${r23(x + L0 * 0.95)},${r23(y + 0.2)}" fill="none" stroke="${OUT3}" stroke-width="0.5"/>`;
        case "puffin":
          return P2(`M${r23(x - 0.6)},${r23(y - 2.2)} Q${r23(x + L0)},${r23(y - 1.4)} ${r23(x + L0)},${r23(y + 0.4)} Q${r23(x + L0 * 0.6)},${r23(y + 1.8)} ${r23(x - 0.6)},${r23(y + 1.8)} Z`, "#F07A3A", 0.9) + P2(`M${r23(x - 0.6)},${r23(y - 2.2)} L${r23(x + 0.6)},${r23(y - 2)} L${r23(x + 0.6)},${r23(y + 1.7)} L${r23(x - 0.6)},${r23(y + 1.8)} Z`, "#3E6FB8", 0) + `<path d="M${r23(x + 1.4)},${r23(y - 1.5)} Q${r23(x + 2.2)},${r23(y)} ${r23(x + 1.4)},${r23(y + 1.5)}" fill="none" stroke="#F2C94C" stroke-width="0.6"/>`;
        default:
          return P2(`M${r23(x - 0.4)},${r23(y - 0.9)} L${r23(x + L0)},${r23(y + 0.1)} L${r23(x - 0.4)},${r23(y + 1)} Z`, b.color || "#F2B33B", 0.8);
      }
    }
    __name(beakOf, "beakOf");
    function bird2(c, pose) {
      const walk = pose === "marche1" || pose === "marche2";
      const rest = pose === "repos" || pose === "clignement";
      const ph = pose === "marche2" ? -1 : 1;
      const lg = c.legs;
      const drop = rest ? -lg.top * 0.85 : 0;
      const bob = pose === "marche2" ? -0.4 : 0;
      const [bx, by0, brx, bry] = c.body;
      const by = by0 + drop + bob;
      const [hx, hy0, hr] = c.head;
      const hy = hy0 + drop + bob + (walk ? ph * 0.3 : 0);
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const ctx = { pose, rest, walk, bx, by, hx, hy, hr, ph, mode };
      let s = E(bx, -0.2, brx * 0.9, 1.3, "rgba(40,55,20,.18)", 0);
      if (!rest) for (const [i, x] of lg.xs.entries()) {
        const dx = walk ? (i ? -ph : ph) * 1 : 0;
        s += limb([x, by + bry * 0.7], [x + dx, -0.6], lg.w || 0.7, lg.color) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 1.6, OUT3) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 0.7, lg.color);
      }
      s += c.parts?.back ? c.parts.back(ctx) : "";
      const t = c.tail || {};
      const tx = bx - brx * 0.85, ty = by - bry * 0.1;
      if (t.kind === "fan") s += P2(`M${r23(tx + 1)},${r23(ty + 1)} L${r23(tx - (t.len || 3.6))},${r23(ty - (t.up || 4.6))} Q${r23(tx - (t.len || 3.6) + 1.6)},${r23(ty - (t.up || 4.6) - 1.2)} ${r23(tx + 1.4)},${r23(ty - 1.4)} Z`, t.color || c.wing);
      if (t.kind === "long") s += P2(`M${r23(tx + 1)},${r23(ty - 0.6)} L${r23(tx - (t.len || 4))},${r23(ty + 0.6)} L${r23(tx + 1)},${r23(ty + 1.8)} Z`, t.color || c.wing);
      const bd = `M${r23(bx - brx)},${r23(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
      s += P2(bd, c.color) + clip(`b${c.id}${pose}`, bd, `<rect x="${r23(bx - brx - 1)}" y="${r23(by - bry - 1)}" width="${r23(brx * 2 + 2)}" height="${r23(bry * 2 + 2)}" fill="${tone(c.color, 0.86)}"/><ellipse cx="${r23(bx - brx * 0.1)}" cy="${r23(by - bry * 0.16)}" rx="${r23(brx * 0.98)}" ry="${r23(bry * 0.9)}" fill="${c.color}"/><ellipse cx="${r23(bx + brx * 0.35)}" cy="${r23(by + bry * 0.4)}" rx="${r23(brx * 0.75)}" ry="${r23(bry * 0.75)}" fill="${c.belly || c.color}"/>` + (c.parts?.coat ? c.parts.coat(ctx) : "")) + P2(bd, "none");
      const wingUp = walk && ph < 0 ? -0.6 : 0;
      s += P2(`M${r23(bx - brx * 0.6)},${r23(by - bry * 0.35 + wingUp)} Q${r23(bx + brx * 0.2)},${r23(by - bry * 0.75 + wingUp)} ${r23(bx + brx * 0.45)},${r23(by - bry * 0.05)} Q${r23(bx)},${r23(by + bry * 0.65)} ${r23(bx - brx * 0.95)},${r23(by + bry * 0.25)} Z`, c.wing, 0.9);
      s += c.parts?.body ? c.parts.body(ctx) : "";
      if (c.neck) s += thick(c.neck(ctx), c.neckW || 2.4, c.headColor || c.color);
      s += c.parts?.behindHead ? c.parts.behindHead(ctx) : "";
      const hcol = c.headColor || c.color, hd = `M${r23(hx - hr)},${r23(hy)} a${r23(hr)},${r23(hr)} 0 1,0 ${r23(2 * hr)},0 a${r23(hr)},${r23(hr)} 0 1,0 ${r23(-2 * hr)},0 Z`;
      s += P2(hd, hcol) + clip(`b${c.id}${pose}h`, hd, `<rect x="${r23(hx - hr - 1)}" y="${r23(hy - hr - 1)}" width="${r23(hr * 2 + 2)}" height="${r23(hr * 2 + 2)}" fill="${tone(hcol, 0.88)}"/><ellipse cx="${r23(hx - hr * 0.12)}" cy="${r23(hy - hr * 0.14)}" rx="${r23(hr * 0.97)}" ry="${r23(hr * 0.92)}" fill="${hcol}"/>`) + P2(hd, "none");
      s += c.parts?.face ? c.parts.face(ctx) : "";
      s += beakOf(c.beak, hx, hy, hr);
      const [edx, edy, er] = c.eye;
      s += eye(hx + edx, hy + edy, er, mode);
      if (c.blush !== false) s += E(hx + edx - er * 0.2, hy + edy + er * 1.5, er * 0.8, er * 0.4, "#F7A8B0", 0);
      s += c.parts?.head ? c.parts.head(ctx) : "";
      if (pose === "joie") s += heartIcon(hx, Math.max(hy - hr - 2.4, BOX[c.size][1] + 2), 1.2);
      return s;
    }
    __name(bird2, "bird");
    var B = {};
    B.hen = (v) => {
      const col = { blanche: "#FFFFFF", rousse: "#C8642E", noire: "#3A3A42", grise: "#B4B4B8" }[v || "rousse"];
      const wing = { blanche: "#E6E2DA", rousse: "#A84E22", noire: "#2A2A32", grise: "#8E8E94" }[v || "rousse"];
      return {
        id: "hen" + (v || ""),
        size: "SMALL",
        color: col,
        wing,
        belly: v === "noire" ? "#4A4A54" : v === "rousse" ? "#E08A4E" : col,
        // chibi : grosse tête ronde sur un corps dodu
        body: [-0.6, -5.8, 4.8, 4.2],
        head: [3.2, -10.6, 3.7],
        beak: { kind: "cone", len: 1.9, color: "#F2B33B" },
        eye: [0.9, -0.5, 0.98],
        legs: { xs: [-1.4, 0.8], top: -2, color: "#F2B33B" },
        tail: { kind: "fan", len: 3, up: 5, color: v === "noire" ? "#2A6A5A" : wing },
        parts: {
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => P2(`M${r23(hx - 1.4)},${r23(hy - hr + 0.6)} Q${r23(hx - 1.2)},${r23(hy - hr - 1.6)} ${r23(hx - 0.2)},${r23(hy - hr - 0.4)} Q${r23(hx + 0.4)},${r23(hy - hr - 2)} ${r23(hx + 1.2)},${r23(hy - hr - 0.2)} Q${r23(hx + 1.8)},${r23(hy - hr - 1.2)} ${r23(hx + 1.6)},${r23(hy - hr + 0.8)} Z`, "#E8483C", 0.7) + E(hx + hr * 0.9, hy + hr * 0.62, 0.75, 1.05, "#E8483C", 0.6), "head"),
          coat: /* @__PURE__ */ __name(({ bx, by }) => v === "grise" ? [[-2, -1], [0.6, -2], [2, 0.6], [-1, 1.4]].map(([x, y]) => E(bx + x, by + y, 0.5, 0.5, "#FFFFFF", 0)).join("") : "", "coat")
        }
      };
    };
    B.chick = () => ({
      id: "chick",
      size: "SMALL",
      color: "#FFE16A",
      wing: "#F6C93E",
      belly: "#FFF0A0",
      body: [-0.3, -3.4, 3.2, 2.9],
      head: [1.6, -6.8, 3],
      beak: { kind: "cone", len: 1.2, color: "#F29A3B" },
      eye: [0.75, -0.4, 0.86],
      legs: { xs: [-0.8, 0.8], top: -1.2, color: "#F29A3B", w: 0.6 },
      tail: {},
      parts: { head: /* @__PURE__ */ __name(({ hx, hy, hr }) => P2(`M${r23(hx - 0.4)},${r23(hy - hr + 0.2)} Q${r23(hx - 0.6)},${r23(hy - hr - 1.4)} ${r23(hx + 0.6)},${r23(hy - hr - 0.6)}`, "none", 0.6), "head") }
    });
    B.heron = () => ({
      id: "heron",
      size: "TALL",
      color: "#A8B4C2",
      wing: "#7E8C9E",
      belly: "#E8EEF4",
      headColor: "#E8EEF4",
      // chibi : grosse tête ronde au bout du long cou
      body: [-1, -17, 6, 4],
      head: [4.4, -30, 3.3],
      beak: { kind: "long", len: 4.8, color: "#F2C94C", dy: 0.5 },
      eye: [0.7, -0.4, 1],
      legs: { xs: [-1.6, 0.6], top: -13, color: "#C8A85A", w: 0.8 },
      tail: { kind: "long", len: 3.4 },
      neck: /* @__PURE__ */ __name(({ bx, by, hx, hy }) => `M${r23(bx + 4)},${r23(by - 2)} Q${r23(bx + 9)},${r23(by - 6)} ${r23(hx - 1)},${r23(hy + 6)} Q${r23(hx - 2.4)},${r23(hy + 3)} ${r23(hx)},${r23(hy + 1)}`, "neck"),
      neckW: 2.2,
      parts: {
        // la calotte noire passe sous l'œil, l'aigrette par-dessus la tête
        face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.05, hy - hr * 0.55, hr * 0.78, hr * 0.36, "#3A3A48", 0), "face"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => thick(`M${r23(hx - hr * 0.6)},${r23(hy - hr * 0.42)} Q${r23(hx - hr * 1.7)},${r23(hy - hr * 0.6)} ${r23(hx - hr * 2.2)},${r23(hy + hr * 0.25)}`, 0.6, "#3A3A48"), "head")
      }
    });
    B.puffin = () => ({
      id: "puffin",
      size: "SMALL",
      color: "#2E2E38",
      wing: "#22222A",
      belly: "#FFFFFF",
      // chibi : grosse tête ronde sur un petit corps
      body: [-0.4, -5.6, 3.8, 4.4],
      head: [1.6, -10.8, 4],
      beak: { kind: "puffin", len: 2.6 },
      eye: [0.75, -0.5, 0.95],
      legs: { xs: [-1, 0.8], top: -1.8, color: "#F07A3A", w: 0.9 },
      tail: { kind: "long", len: 2 },
      parts: {
        face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + 0.6, hy + 0.2, hr * 0.85, hr * 0.8, "#F4F4F4", 0), "face"),
        // Bosco est bougon : un sourcil froncé
        head: /* @__PURE__ */ __name(({ hx, hy, hr, mode }) => mode === "open" ? `<path d="M${r23(hx - hr * 0.1)},${r23(hy - hr * 0.6)} L${r23(hx + hr * 0.58)},${r23(hy - hr * 0.4)}" stroke="${OUT3}" stroke-width="0.75" stroke-linecap="round"/>` : "", "head")
      }
    });
    B.toucan = () => ({
      id: "toucan",
      size: "SMALL",
      color: "#2A2A30",
      wing: "#1E1E24",
      belly: "#2A2A30",
      // chibi : grosse tête ronde, son grand bec
      body: [-1.4, -7.2, 4, 4.8],
      head: [1.2, -11.6, 3.6],
      beak: { kind: "big", len: 6, color: "#F6A23B", tip: "#E8483C", dy: 0.6 },
      eye: [0.5, -0.7, 0.95],
      blush: false,
      legs: { xs: [-2, 0], top: -2.6, color: "#5C8FD8", w: 0.8 },
      tail: { kind: "long", len: 3.6 },
      parts: { face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.21, hy + hr * 0.57, hr * 0.79, hr * 0.71, "#FFF4C8", 0) + E(hx + 0.5, hy - 0.75, 1.65, 1.55, "#7CD0E8", 0), "face") }
    });
    B.crow = () => ({
      id: "crow",
      size: "SMALL",
      color: "#2E2E38",
      wing: "#3E4A6A",
      belly: "#3A3A46",
      // chibi : grosse tête ronde sur un corps dodu
      body: [-0.6, -6.2, 4.4, 3.8],
      head: [3, -10.2, 3.5],
      beak: { kind: "long", len: 3, color: "#5A5A64" },
      eye: [0.75, -0.5, 0.95],
      legs: { xs: [-1.4, 0.6], top: -2.4, color: "#4A4A52" },
      tail: { kind: "long", len: 3.6 },
      parts: { body: /* @__PURE__ */ __name(({ bx, by }) => `<path d="M${r23(bx - 2)},${r23(by - 2.4)} Q${r23(bx)},${r23(by - 3.4)} ${r23(bx + 2)},${r23(by - 2.2)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>`, "body") }
    });
    B.bird = () => ({
      id: "bird",
      size: "SMALL",
      color: "#5C9CE0",
      wing: "#4A84C8",
      belly: "#FFE16A",
      headColor: "#FFFFFF",
      // chibi : grosse tête ronde sur un corps dodu
      body: [-0.2, -4, 3.2, 3],
      head: [2.3, -7.5, 3],
      beak: { kind: "cone", len: 1.1, color: "#3A3A44" },
      eye: [0.8, -0.25, 0.85],
      legs: { xs: [-0.6, 0.8], top: -1.4, color: "#7E7E8A", w: 0.55 },
      tail: { kind: "long", len: 2.6, color: "#4A84C8" },
      parts: { head: /* @__PURE__ */ __name(({ hx, hy, hr }) => P2(`M${r23(hx - hr)},${r23(hy - 0.4)} Q${r23(hx - hr * 0.6)},${r23(hy - hr)} ${r23(hx + hr * 0.8)},${r23(hy - hr * 0.55)} Q${r23(hx)},${r23(hy - hr * 0.35)} ${r23(hx - hr)},${r23(hy - 0.4)} Z`, "#5C9CE0", 0) + `<path d="M${r23(hx - hr * 0.7)},${r23(hy + hr * 0.09)} L${r23(hx + hr * 0.52)},${r23(hy - hr * 0.17)}" stroke="#2A3A5A" stroke-width="0.5"/>`, "head") }
    });
    B.gull = () => ({
      id: "gull",
      size: "SMALL",
      color: "#FFFFFF",
      wing: "#A8B4C2",
      belly: "#FFFFFF",
      // chibi : grosse tête ronde sur un corps dodu
      body: [-0.8, -6.2, 4.6, 3.9],
      head: [3.2, -11, 3.5],
      beak: { kind: "long", len: 2.6, color: "#F2C94C" },
      eye: [0.85, -0.5, 0.95],
      legs: { xs: [-1.6, 0.6], top: -2.6, color: "#F2B33B" },
      tail: { kind: "long", len: 3, color: "#3A3A44" },
      parts: { head: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.85 + 2.1, hy + 0.7, 0.4, 0.35, "#E8483C", 0), "head") }
    });
    var GULL_POSES = {
      envol1: { h: 4.4, ailes: "milieuHaut", pattes: "pliees", ombre: 1 },
      envol2: { h: 9, ailes: "haut", pattes: "pendantes", ombre: 0.7 },
      envol3: { h: 13, ailes: "bas", pattes: "repliees", ombre: 0.45 },
      vol1: { h: 16, ailes: "haut", pattes: "repliees" },
      vol2: { h: 16.6, ailes: "milieu", pattes: "repliees" },
      vol3: { h: 17, ailes: "bas", pattes: "repliees" },
      vol4: { h: 16.4, ailes: "milieuHaut", pattes: "repliees" },
      plane: { h: 16, ailes: "plane", pattes: "repliees" }
    };
    var AILES = {
      haut: [[-3.6, -13.4], [-1.4, -14]],
      milieuHaut: [[-8, -8.4], [-5.8, -9.6]],
      milieu: [[-10.8, -1.4], [-9.2, -3.6]],
      bas: [[-5, 8.4], null],
      plane: [[-11.4, -3.6], [-9.6, -5.6]]
    };
    function gullFly(pose) {
      const c = B.gull(), g = GULL_POSES[pose], y = -g.h;
      const [near, far] = AILES[g.ailes];
      const sh = [0.6, y - 1.6];
      const aile = /* @__PURE__ */ __name(([dx, dy], col, k) => {
        const tip = [sh[0] + dx * k, sh[1] + dy * k], L0 = Math.hypot(dx * k, dy * k), ux = dx * k / L0, uy = dy * k / L0;
        let n = [-uy, ux];
        if (n[0] < 0 || Math.abs(n[0]) < 0.2 && n[1] > 0) n = [-n[0], -n[1]];
        const w = 2.6, at = /* @__PURE__ */ __name((t, o) => [sh[0] + dx * k * t + n[0] * o, sh[1] + dy * k * t + n[1] * o], "at");
        const a = at(0, w), b = at(0, -w * 0.8), c1 = at(0.5, w * 1.5), c2 = at(0.62, -w * 0.9);
        const bez = /* @__PURE__ */ __name((p0, c3, p12, t) => [0, 1].map((i) => (1 - t) ** 2 * p0[i] + 2 * t * (1 - t) * c3[i] + t * t * p12[i]), "bez");
        const d = `M${r23(a[0])},${r23(a[1])} Q${r23(c1[0])},${r23(c1[1])} ${r23(tip[0])},${r23(tip[1])} Q${r23(c2[0])},${r23(c2[1])} ${r23(b[0])},${r23(b[1])} Z`;
        const p1 = bez(a, c1, tip, 0.6), p2 = bez(tip, c2, b, 0.42);
        const sp = [p1[0] + (tip[0] - p1[0]) * 0.35 + (p2[0] - p1[0]) * 0.3, p1[1] + (tip[1] - p1[1]) * 0.35 + (p2[1] - p1[1]) * 0.3];
        return P2(d, col, 0.9) + clip(`gv${pose}${k}`, d, P2(`M${r23(p1[0])},${r23(p1[1])} L${r23(tip[0] + ux * 2)},${r23(tip[1] + uy * 2)} L${r23(p2[0])},${r23(p2[1])} Z`, "#2A2A32", 0)) + E(sp[0], sp[1], 0.5, 0.45, "#FFFFFF", 0) + P2(d, "none", 0.9);
      }, "aile");
      let s = g.ombre ? E(0, -0.2, 4.6 * g.ombre, 1.2 * g.ombre, "rgba(40,55,20,.18)", 0) : "";
      const leg = /* @__PURE__ */ __name((x, to) => limb([x, y + 2.4], to, 0.65, "#F2B33B"), "leg");
      if (g.pattes === "pliees") s += leg(-1.4, [-1.8, -0.6]) + leg(0.6, [0.4, -0.6]) + line([-2.6, -0.4], [-0.8, -0.4], 1.5, OUT3) + line([-0.4, -0.4], [1.4, -0.4], 1.5, OUT3);
      if (g.pattes === "pendantes") s += leg(-1.2, [-1.6, y + 6]) + leg(0.6, [0.4, y + 6.2]);
      if (g.pattes === "repliees") s += leg(-1, [-5, y + 3]) + leg(0.4, [-4.4, y + 3.6]);
      if (far) s += aile(far, tone(c.wing, 0.86), 0.92);
      s += P2(`M${r23(-3.8)},${r23(y - 0.6)} L${r23(-8.4)},${r23(y - 0.2 + (pose === "plane" ? -0.6 : 0))} L${r23(-8)},${r23(y + 1.4)} L${r23(-3.8)},${r23(y + 1.6)} Z`, "#F4F4F4") + P2(`M${r23(-7.4)},${r23(y - 0.3)} L${r23(-8.4)},${r23(y - 0.2)} L${r23(-8)},${r23(y + 1.4)} L${r23(-7.2)},${r23(y + 1.3)} Z`, "#3A3A44", 0);
      const bd = `M${r23(-5)},${r23(y)} a5,3.2 0 1,0 10,0 a5,3.2 0 1,0 -10,0 Z`;
      s += P2(bd, c.color) + clip(`gv${pose}`, bd, `<ellipse cx="0.6" cy="${r23(y + 1.6)}" rx="5" ry="1.8" fill="${tone(c.color, 0.9)}"/>`) + P2(bd, "none");
      const hx = 4.8, hy = y - 2.4, hr = 3.1, hd = `M${r23(hx - hr)},${r23(hy)} a${hr},${hr} 0 1,0 ${r23(2 * hr)},0 a${hr},${hr} 0 1,0 ${r23(-2 * hr)},0 Z`;
      s += P2(hd, c.color) + clip(`gv${pose}h`, hd, `<ellipse cx="${r23(hx + 0.3)}" cy="${r23(hy + hr * 0.5)}" rx="${r23(hr)}" ry="${r23(hr * 0.6)}" fill="${tone(c.color, 0.9)}"/>`) + P2(hd, "none");
      s += beakOf(c.beak, hx, hy, hr) + E(hx + hr * 0.85 + 2.1, hy + 0.7, 0.4, 0.35, "#E8483C", 0);
      s += eye(hx + 0.8, hy - 0.5, 0.9, "open") + E(hx + 0.6, hy + 0.9, 0.7, 0.35, "#F7A8B0", 0);
      if (near) s += aile(near, c.wing, 1);
      return s;
    }
    __name(gullFly, "gullFly");
    BOX.GULL_FLY = box2(-14, -28, 28, 30);
    module.exports.bird = bird2;
    module.exports.B = B;
    module.exports.gullFly = gullFly;
    Object.assign(BOX, {
      BUTTERFLY: box2(-6, -9, 12, 9),
      FIREFLY: box2(-5, -5, 10, 10),
      BEE: box2(-5, -7, 10, 8),
      OWL: box2(-6, -14, 12, 15),
      TICTAC: box2(-6, -10, 12, 11),
      KOI: box2(-10, -4, 20, 8),
      FISH: box2(-16, -28, 32, 32),
      DOLPHIN: box2(-26, -22, 52, 36),
      WHALE_BACK: box2(-50, -18, 100, 27),
      WHALE_FLUKE: box2(-26, -30, 52, 38),
      BOWL: box2(-6, -10, 12, 11),
      JELLY: box2(-8, -12, 16, 16)
    });
    var glowDot2 = /* @__PURE__ */ __name((x, y, r, rgb, a = 0.45) => {
      const id3 = `lueur-bete_${[x, y, r, a].map(r23).join("_")}_${rgb}`.replace(/,/g, "-").replace(/\./g, "p");
      return `<defs><radialGradient id="${id3}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r23(Math.min(0.9, a * 1.7))}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r)}" fill="url(#${id3})"/>`;
    }, "glowDot");
    var water = /* @__PURE__ */ __name((x, y, w) => `<path d="M${r23(x - w)},${r23(y)} Q${r23(x - w / 2)},${r23(y - 1.2)} ${x},${r23(y)} Q${r23(x + w / 2)},${r23(y + 1.2)} ${r23(x + w)},${r23(y)}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.85"/>`, "water");
    var splash = /* @__PURE__ */ __name((x, y, k = 1) => [[-3, -2.6], [0, -3.6], [3, -2.4]].map(([dx, dy]) => E(x + dx * k, y + dy * k, 0.7 * k, 0.9 * k, "#BFE6FF", 0.5)).join(""), "splash");
    function butterfly3(v, pose) {
      const col = { jaune: ["#F6D04A", "#E8A83A", "#FFE9A8"], bleu: ["#6AB4F0", "#3E7FC1", "#D2E8FC"], lune: ["#CFF2D8", "#8ACB9E"] }[v];
      const open = pose === "vol2" ? 0.45 : pose === "repos" ? 0.25 : 1;
      const y = pose === "repos" ? -3.6 : -5;
      const wing = /* @__PURE__ */ __name((m) => `<g transform="translate(0 ${y}) scale(${r23(m * open)} 1)">${P2("M0,0 Q2.6,-5.4 5.6,-3.6 Q6.6,-1 2.4,0.4 Q5.2,1.6 4,3.6 Q1.6,4.4 0,1 Z", col[0])}${E(3.4, -2.6, 0.9, 0.7, col[1], 0)}${v === "lune" ? E(3, -2.4, 0.5, 0.5, "#FFFFFF", 0) : ""}</g>`, "wing");
      if (pose === "repos") {
        const fl = [0, 72, 144, 216, 288].map((a) => E(Math.cos(a * Math.PI / 180) * 1.6, -1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.2, 0.8, "#F7C6D9", 0.5)).join("") + E(0, -1.4, 0.8, 0.6, "#F2C94C", 0.4);
        return '<g transform="translate(0 -1.3)">' + limb([0, -1.2], [0, 0], 0.6, "#6CAE5A") + fl + P2("M0,-2.6 Q-1.4,-8.6 2.6,-9.6 Q4.6,-6.4 0.6,-2.4 Z", col[0], 0.7) + E(2, -7, 0.8, 0.6, col[1], 0) + (v === "lune" ? limb([-0.6, -2.4], [0.6, -4.2], 1.1, "#EDE5D2") + stroke("M1.2,-5.4 Q2,-6.6 3,-6.8", 0.35, OUT3) + stroke("M1.7,-6.1 l0.3,0.4 M2.3,-6.6 l0.2,0.45", 0.3, OUT3) + E(1, -4.9, 1.05, 0.95, "#F4EEDF", 0.7) + eye(1.35, -5, 0.38, "open") + E(1.05, -4.3, 0.3, 0.16, "#F7A8B0", 0) : limb([-0.6, -2.4], [0.6, -4.2], 1, "#4A3A30") + stroke("M1.2,-5.5 Q2,-6.8 3,-6.9", 0.35, OUT3) + E(3, -6.9, 0.3, 0.3, OUT3, 0) + E(1, -4.9, 1, 0.92, col[2], 0.7) + eye(1.35, -5, 0.38, "open") + E(1.05, -4.3, 0.3, 0.16, "#F7A8B0", 0)) + "</g>";
      }
      let s = wing(-1) + wing(1);
      if (v === "lune") {
        const feather = /* @__PURE__ */ __name((m) => stroke(`M${r23(m * 0.4)},${r23(y - 3.6)} Q${r23(m * 1.2)},${r23(y - 5.2)} ${r23(m * 2)},${r23(y - 5.6)}`, 0.4, OUT3) + [0.35, 0.65].map((k) => stroke(`M${r23(m * (0.4 + 1.6 * k))},${r23(y - 3.6 - 2 * k)} l${r23(m * 0.5)},0.3`, 0.3, OUT3)).join(""), "feather");
        s += feather(-1) + feather(1) + E(0, y + 0.4, 1, 2.4, "#EDE5D2", 0.7) + L([-0.7, y + 0.6], [0.7, y + 0.6], "#C9BFA8", 0.35) + L([-0.6, y + 1.6], [0.6, y + 1.6], "#C9BFA8", 0.35) + E(0, y - 2.5, 1.45, 1.3, "#F4EEDF", 0.7) + eye(-0.55, y - 2.55, 0.42, pose === "joie" ? "joy" : "open") + eye(0.55, y - 2.55, 0.42, pose === "joie" ? "joy" : "open") + E(-0.95, y - 1.85, 0.32, 0.17, "#F7A8B0", 0) + E(0.95, y - 1.85, 0.32, 0.17, "#F7A8B0", 0);
      } else {
        const m = pose === "joie" ? "joy" : "open";
        s += stroke(`M-0.3,${r23(y - 3.2)} Q-1,${r23(y - 4.8)} -1.8,${r23(y - 5.2)} M0.3,${r23(y - 3.2)} Q1,${r23(y - 4.8)} 1.8,${r23(y - 5.2)}`, 0.4, OUT3) + E(-1.8, y - 5.2, 0.32, 0.32, OUT3, 0) + E(1.8, y - 5.2, 0.32, 0.32, OUT3, 0) + E(0, y + 0.5, 0.8, 2.2, "#4A3A30", 0.6) + E(0, y - 2.4, 1.3, 1.15, col[2], 0.6) + E(-0.45, y - 2.95, 0.5, 0.28, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.6" fill=') + eye(-0.5, y - 2.45, 0.38, m) + eye(0.5, y - 2.45, 0.38, m) + E(-0.9, y - 1.8, 0.3, 0.16, "#F7A8B0", 0) + E(0.9, y - 1.8, 0.3, 0.16, "#F7A8B0", 0);
      }
      if (pose === "joie") s += heartIcon(4.6, y - 4.4, 0.9);
      return s;
    }
    __name(butterfly3, "butterfly");
    function firefly(pose) {
      const on = pose !== "vol2";
      let s = on ? glowDot2(-1.6, -3, 4.4, "255,236,150", 0.4) : glowDot2(-1.6, -3, 2.6, "255,236,150", 0.25);
      s += E(-1.6, -3, 1.8, 1.4, on ? "#FFF3A0" : "#E8D880", 0.7) + E(0.6, -3.4, 1.4, 1.2, "#4A3A30", 0.7);
      s += stroke("M1.6,-4.9 Q1.3,-5.7 0.5,-5.8 M2.6,-5 Q3,-5.7 3.9,-5.75", 0.35, OUT3);
      s += E(2.1, -3.9, 1.35, 1.25, "#F2B48A", 0.6) + E(1.6, -4.5, 0.5, 0.3, "#FFD8BC", 0) + eye(2.55, -4, 0.52, pose === "joie" ? "joy" : "open") + E(2.3, -3.05, 0.42, 0.22, "#F7A8B0", 0);
      s += P2("M-0.4,-4 Q-1.6,-6.6 -3.4,-5.4 Q-2,-4.4 -0.4,-3.8 Z", "#E8F2FA", 0.5).replace("fill=", 'fill-opacity="0.8" fill=');
      if (pose === "joie") s += heartIcon(3.2, -6, 0.8);
      return `<g transform="translate(0 1)">${s}</g>`;
    }
    __name(firefly, "firefly");
    function bee3(pose, meca = false) {
      const flap = pose === "vol2" ? 0.4 : 1;
      const y = pose === "repos" ? -2.8 : -4.2;
      let s = "";
      s += `<g transform="translate(-0.4 ${y - 1.6}) scale(1 ${flap})">${P2("M0,0 Q-2.2,-3.8 0.4,-4 Q1.6,-2.4 0.6,0 Z", meca ? "#D8EEF6" : "#E8F2FA", 0.5).replace("fill=", 'fill-opacity="0.85" fill=')}</g>`;
      s += E(0, y, 3, 2.2, meca ? "#D4A84A" : "#F6C83E");
      s += clip(`bee${meca ? "m" : ""}${pose}`, `M-3,${y} a3,2.2 0 1,0 6,0 a3,2.2 0 1,0 -6,0 Z`, [-1.2, 0.6].map((x) => `<rect x="${x}" y="${y - 3}" width="0.9" height="6" fill="${meca ? "#8E6E2C" : "#3A2A24"}"/>`).join(""));
      s += E(0, y, 3, 2.2, "none");
      if (meca) {
        s += E(2.7, y - 0.8, 1.95, 1.8, "#B8C0C8", 0.8) + E(2.1, y - 1.5, 0.7, 0.45, "#E2E8EE", 0) + eye(3.2, y - 0.95, 0.72, pose === "joie" ? "joy" : "open") + E(2.8, y + 0.35, 0.55, 0.3, "#F7A8B0", 0) + E(1.5, y - 2.1, 0.28, 0.28, "#F0D58A", 0.3);
      } else {
        s += stroke(`M2.3,${r23(y - 2.3)} Q2.1,${r23(y - 3.7)} 1.2,${r23(y - 4)} M3.1,${r23(y - 2.4)} Q3.5,${r23(y - 3.6)} 4.4,${r23(y - 3.8)}`, 0.35, OUT3);
        s += E(2.7, y - 0.8, 1.9, 1.8, "#FFE07A", 0.8) + E(2.1, y - 1.55, 0.65, 0.4, "#FFF2C0", 0) + eye(3.25, y - 0.95, 0.72, pose === "joie" ? "joy" : "open") + E(2.85, y + 0.35, 0.55, 0.3, "#F7A8B0", 0);
      }
      if (meca) s += limb([-1, y - 2.2], [-1.6, y - 4], 0.5, "#C9A24A") + E(-2.4, y - 4.4, 1, 0.6, "#C9A24A", 0.5) + E(-0.8, y - 4.4, 1, 0.6, "#C9A24A", 0.5) + E(0.9, y + 0.6, 0.3, 0.3, "#F0D58A", 0);
      else s += P2(`M-3.2,${r23(y + 0.4)} L-4.2,${r23(y + 0.8)} L-3.2,${r23(y + 1.2)} Z`, "#3A2A24", 0);
      if (pose === "joie") s += meca ? heartIcon(2.6, y - 4, 0.8) : heartIcon(2.8, y - 4.9, 0.8);
      return `<g transform="translate(0 ${pose === "repos" ? 1.2 : 1.6})">${s}</g>`;
    }
    __name(bee3, "bee");
    function beeFriend(pose) {
      const flap = pose === "vol2" ? 0.4 : pose === "repos" ? 0.55 : 1;
      const y = pose === "repos" ? -2.8 : -4.2;
      const glass = /* @__PURE__ */ __name((d) => P2(d, "#F6DDE6", 0.5).replace("fill=", 'fill-opacity="0.85" fill='), "glass");
      let s = "";
      s += `<g transform="translate(-0.6 ${y - 1.6}) scale(1 ${flap})">${glass("M0,0 Q-2.6,-4 0.2,-4.4 Q1.8,-2.6 0.6,0 Z")}${glass("M-0.6,0.2 Q-3.6,-2.2 -2.6,-3.4 Q-1,-2.8 -0.2,0 Z")}</g>`;
      s += limb([-0.8, y - 2], [-1.4, y - 3.8], 0.5, "#C9A24A") + heartIcon(-1.6, y - 4.6, 0.75).replace("#F27A8A", "#E2C26A");
      s += E(0, y, 2.9, 2.4, "#D98B5F");
      s += clip(`amie${pose}`, `M-2.9,${y} a2.9,2.4 0 1,0 5.8,0 a2.9,2.4 0 1,0 -5.8,0 Z`, [-1.3, 0.4].map((x) => `<rect x="${x}" y="${y - 3}" width="0.85" height="6" fill="#A85A3A"/>`).join("") + `<ellipse cx="-0.6" cy="${y - 1.3}" rx="1.4" ry="0.6" fill="#FFFFFF" fill-opacity="0.45"/>`);
      s += E(0, y, 2.9, 2.4, "none") + E(-2, y + 0.8, 0.28, 0.28, "#F0D58A", 0) + E(1.2, y + 1.5, 0.28, 0.28, "#F0D58A", 0);
      s += P2(`M-2.8,${r23(y + 0.2)} L-3.9,${r23(y + 0.6)} L-2.8,${r23(y + 1)} Z`, "#C9A24A", 0.5);
      const hx = 2.7, hy = y - 0.7;
      s += stroke(`M${hx - 0.2},${r23(hy - 1.3)} Q${hx - 0.6},${r23(hy - 3)} ${hx - 1.6},${r23(hy - 3.2)}`, 0.35, OUT3) + stroke(`M${hx + 0.4},${r23(hy - 1.3)} Q${hx + 1},${r23(hy - 2.8)} ${hx + 1.8},${r23(hy - 2.8)}`, 0.35, OUT3);
      s += E(hx - 1.7, hy - 3.2, 0.4, 0.4, "#E2C26A", 0.3) + [0, 72, 144, 216, 288].map((a) => E(hx + 1.8 + Math.cos(a * Math.PI / 180) * 0.55, hy - 2.8 + Math.sin(a * Math.PI / 180) * 0.55, 0.42, 0.42, "#F7C6D9", 0.25)).join("") + E(hx + 1.8, hy - 2.8, 0.25, 0.25, "#F2C94C", 0);
      s += E(hx, hy, 1.95, 1.8, "#EBB08A", 0.8) + E(hx - 0.6, hy - 0.75, 0.7, 0.42, "#F6CFB4", 0);
      s += eye(hx + 0.5, hy - 0.15, 0.72, pose === "joie" ? "joy" : "open") + (pose === "joie" ? "" : L([hx + 1.05, hy - 0.85], [hx + 1.5, hy - 1.25], OUT3, 0.3));
      s += E(hx + 0.1, hy + 1, 0.6, 0.32, "#F7A8B0", 0);
      if (pose === "joie") s += heartIcon(2.8, y - 4.6, 0.8);
      return `<g transform="translate(0 ${pose === "repos" ? 1.2 : 1.6})">${s}</g>`;
    }
    __name(beeFriend, "beeFriend");
    function owl(pose) {
      const tilt = pose === "marche1" ? -6 : pose === "marche2" ? 6 : 0;
      const m = pose === "clignement" || pose === "repos" ? "blink" : pose === "joie" ? "joy" : "open";
      let s = limb([-5, -0.6], [5, -0.6], 0.9, "#7E5530");
      s += `<g transform="rotate(${tilt} 0 -8)">`;
      s += E(0, -7.2, 5.2, 6.4, "#A8784A") + E(0, -5.6, 3.4, 4, "#F2DEC0", 0);
      s += [-1.6, 0, 1.6].map((x) => P2(`M${x - 0.6},-5 L${x},-4.2 L${x + 0.6},-5`, "none", 0.4)).join("") + [-1, 1].map((x) => P2(`M${x - 0.6},-3.4 L${x},-2.6 L${x + 0.6},-3.4`, "none", 0.4)).join("");
      s += P2("M-4.4,-11 L-4.8,-14.6 L-2.4,-12 Z", "#A8784A", 0.8) + P2("M4.4,-11 L4.8,-14.6 L2.4,-12 Z", "#A8784A", 0.8);
      s += E(-2, -9.6, 2, 2, "#FFF4E0", 0.7) + E(2, -9.6, 2, 2, "#FFF4E0", 0.7) + eye(-2, -9.6, 1.2, m) + eye(2, -9.6, 1.2, m);
      s += P2("M-0.6,-8.4 L0.6,-8.4 L0,-6.8 Z", "#F2B33B", 0.6) + `</g>`;
      s += E(-1.4, -0.8, 0.9, 0.5, "#F2B33B", 0.5) + E(1.4, -0.8, 0.9, 0.5, "#F2B33B", 0.5);
      if (pose === "joie") s += heartIcon(4.6, -14, 0.9);
      return s;
    }
    __name(owl, "owl");
    function koi(v, pose) {
      const [base, spot] = { orange: ["#F08A3A", "#FFFFFF"], blanc: ["#FFFFFF", "#E8483C"], or: ["#F2C04B", "#FFF4C8"] }[v];
      const sw = pose === "nage2" ? -1 : 1;
      let s = `<ellipse cx="0" cy="0" rx="11" ry="3.6" fill="#7FC4E8" fill-opacity="0.25"/>`;
      s += P2(`M-6,0 Q${-9},${-2.8 * sw} ${-10.4},${-3 * sw} Q${-9.6},0 ${-10.4},${3 * sw} Q${-9},${2.8 * sw} -6,0 Z`.replace(/-?\d+\.?\d*e?-?\d*/g, (n) => r23(+n)), base, 0.8);
      s += P2(`M-6.4,0 Q-4,${r23(-2.6 + sw * 0.3)} 1.6,-2.2 Q6.6,-1.4 7.4,0 Q6.6,1.4 1.6,2.2 Q-4,${r23(2.6 + sw * 0.3)} -6.4,0 Z`, base);
      s += E(-1, -0.6, 1.6, 1, spot, 0) + E(3.6, 0.6, 1.2, 0.8, spot, 0) + eye(5.4, -1, 0.58, "open") + eye(5.4, 1, 0.58, "open");
      s += P2("M1.6,-2.1 Q0.4,-4.6 -1.4,-4.2 Q-0.4,-3 0,-2.2 Z", base, 0.6) + P2("M1.6,2.1 Q0.4,4.6 -1.4,4.2 Q-0.4,3 0,2.2 Z", base, 0.6);
      if (pose === "joie") s += E(9.4, -1.6, 0.7, 0.7, "#E8F6FF", 0.4) + E(11, -3.4, 0.45, 0.45, "#E8F6FF", 0.4) + heartIcon(10.6, 2.2, 0.8);
      return s;
    }
    __name(koi, "koi");
    function fish(v, n) {
      const [col, colS, fin] = { sardine: ["#A8C4D8", "#6E8CA8", "#8AAAC4"], dorade: ["#F2C27A", "#E8906A", "#F29A8A"], volant: ["#7EAEE0", "#4A7AB8", "#BFE0FF"] }[v];
      const y = n ? -20 : -12, rot = n ? -10 : -40;
      let s = water(0, -0.6, 10) + (n ? "" : splash(-2, -1.4, 1.4));
      s += `<g transform="translate(0 ${y}) rotate(${rot})">`;
      if (v === "volant") s += P2("M0,-1 Q-2,-9 -5,-10 Q-3,-4 -2,0 Z", fin, 0.7) + P2("M0,1 Q-2,8 -4.4,8.6 Q-2.6,3.6 -2,0.6 Z", fin, 0.7);
      s += P2("M-6,0 L-10,-3.4 L-9.2,0 L-10,3.4 Z", colS, 0.8);
      s += E(0, 0, 6.6, v === "dorade" ? 3.8 : 2.6, col);
      s += P2(`M-5.4,0.8 Q0,${v === "dorade" ? 3.6 : 2.4} 5.4,0.8`, "none", 0).replace('stroke="none"', `stroke="${colS}" stroke-width="1"`);
      s += P2("M-1,-2.4 L1,-4 L2.2,-2 Z", fin, 0.6) + eye(3.8, -0.5, 1.05, "open") + E(3.4, 0.9, 0.8, 0.4, "#F7A8B0", 0);
      s += "</g>";
      return s;
    }
    __name(fish, "fish");
    function dolphin(n) {
      const pos = [[-8, -10, -35], [0, -16.2, 0], [8, -10, 35]][n];
      let s = water(0, -0.6, 22) + (n !== 1 ? splash(n ? 12 : -12, -1.4, 1.6) : "");
      s += `<g transform="translate(${pos[0]} ${pos[1]}) rotate(${pos[2]})">`;
      s += P2("M-11,0 L-17,-4 L-15.6,0 L-17,4 Z", "#5A8AC0", 0.9);
      s += P2("M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z", "#7EAEE0");
      s += clip(`dol${n}`, "M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z", '<ellipse cx="2" cy="4.4" rx="12" ry="3" fill="#E8F2FA"/>');
      s += P2("M-1,-5.8 L-4,-10.4 L3,-5.8 Z", "#5A8AC0", 0.9) + P2("M1,2.6 L-2,6.4 L4,3.4 Z", "#5A8AC0", 0.8);
      s += eye(8.8, -2, 1.3, "open") + P2("M11.4,0.6 Q13,1.4 14.6,0.6", "none", 0.6) + E(8.1, 0.5, 1.1, 0.55, "#F7A8B0", 0);
      s += "</g>";
      return s;
    }
    __name(dolphin, "dolphin");
    function whaleBack(n) {
      let s = `<ellipse cx="0" cy="-1" rx="56" ry="4" fill="#5E8EC0" fill-opacity="0.25"/>`;
      s += P2("M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z", "#4A6E9E") + clip(`wb${n}`, "M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z", '<ellipse cx="-6" cy="-10.8" rx="40" ry="3.4" fill="#6A8EBE"/>' + [-20, -6, 10].map((x) => `<ellipse cx="${x}" cy="-6.4" rx="2" ry="1.2" fill="#3A5A86"/>`).join(""));
      s += eye(30, -5.4, 1.6, "open") + E(28.6, -2.8, 1.7, 0.8, "#F7A8B0", 0) + P2("M34,-3.6 Q38,-2.4 42,-3.6", "none", 0.7);
      s += water(-40, -0.4, 10) + water(40, -0.4, 10);
      const h = n ? 7.4 : 5;
      s += [-3, 0, 3].map((dx, i) => thick(`M${16 + dx * 0.3},-11.6 Q${16 + dx},${r23(-11.6 - h * 0.6)} ${16 + dx * 2.2},${r23(-11.6 - h + i % 2)}`, 1.4, "#E8F6FF")).join("") + E(16, -11.6 - h, 3, 1.6, "#E8F6FF", 0.7);
      return s;
    }
    __name(whaleBack, "whaleBack");
    function whaleFluke(n) {
      const y = n ? -8 : -18;
      let s = `<ellipse cx="0" cy="-1" rx="28" ry="3.4" fill="#5E8EC0" fill-opacity="0.25"/>` + water(0, -0.6, 22);
      s += P2(`M-3,0 Q-2,${y + 8} 0,${y + 4} Q2,${y + 8} 3,0 Z`, "#4A6E9E", 0.9);
      s += P2(`M0,${y + 5} Q-10,${y + 5} -19,${y - 6} Q-17,${y - 7} -14,${y - 5} Q-9,${y - 2} -5,${y - 1} Q-2,${y - 1} 0,${y + 1} Q2,${y - 1} 5,${y - 1} Q9,${y - 2} 14,${y - 5} Q17,${y - 7} 19,${y - 6} Q10,${y + 5} 0,${y + 5} Z`, "#4A6E9E") + P2(`M-15,${y - 4} Q-9,${y} -3,${y + 1}`, "none", 0).replace('stroke="none"', 'stroke="#6A8EBE" stroke-width="1" stroke-linecap="round"');
      s += [-14, -6, 6, 14].map((x, i) => E(x, y + 2 + i % 2 * 2, 0.6, 1, "#BFE6FF", 0.4)).join("") + splash(0, -1.2, 1.6);
      return s;
    }
    __name(whaleFluke, "whaleFluke");
    function bowl(v, n) {
      let s = P2("M-4.6,-10.4 L4.6,-10.4 L4.2,-9.4 Q7.4,-6.6 6.4,-3 Q5.2,0 0,0 Q-5.2,0 -6.4,-3 Q-7.4,-6.6 -4.2,-9.4 Z", "#E6F4FA", 0.9).replace("fill=", 'fill-opacity="0.75" fill=');
      s += P2("M-6.2,-5.6 Q0,-4.6 6.2,-5.6 Q6.4,-3.6 5.6,-2.4 Q3.8,-0.6 0,-0.6 Q-3.8,-0.6 -5.6,-2.4 Q-6.4,-3.6 -6.2,-5.6 Z", "#9ED4F0", 0).replace("fill=", 'fill-opacity="0.7" fill=');
      if (v === "bulle") {
        const x = n ? 1 : -1;
        s += `<g transform="translate(${x} -3.2) scale(${n ? -1 : 1} 1)">${P2("M-1.9,0 L-3.7,-1.4 L-3.2,0 L-3.7,1.4 Z", "#F08A3A", 0.5)}${E(0, 0, 2.3, 1.8, "#F6A04A", 0.6)}${E(-0.4, -0.7, 1, 0.45, "#FFC78A", 0)}${P2("M-0.6,0.4 Q0.2,1.6 0.9,0.6 Z", "#F08A3A", 0.4)}${eye(1.05, -0.35, 0.62, "open")}${E(0.75, 0.55, 0.45, 0.22, "#F7A8B0", 0)}</g>` + E(2.6, -7 - n, 0.5, 0.5, "#FFFFFF", 0.4);
      }
      s += `<path d="M-4.4,-8.6 Q-5.6,-6 -4.8,-3.6" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.9"/>`;
      return s;
    }
    __name(bowl, "bowl");
    function jelly(n) {
      const k = n ? 1 : 0.9;
      let s = glowDot2(0, -8, 7.6, "210,180,255", 0.45);
      s += [-3, -1, 1, 3].map((x, i) => stroke(`M${x},-7 Q${x + (i % 2 ? 1.4 : -1.4) * (n ? 1 : -1)},-3 ${x},${n ? 0 : -1.6}`, 0.7, "#C8A8F0")).join("");
      s += `<g transform="translate(0 -8) scale(${n ? 1 : 1.1} ${k})">${P2("M-5.4,1 Q-5.4,-6 0,-6.2 Q5.4,-6 5.4,1 Q2.8,0 0,1 Q-2.8,0 -5.4,1 Z", "#E6D4FF")}${E(-1.6, -3.4, 1.4, 0.9, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.6" fill=')}${eye(-1.8, -1.6, 0.7, "open")}${eye(1.8, -1.6, 0.7, "open")}${E(0, -0.4, 0.6, 0.35, "#F7A8B0", 0)}</g>`;
      return s;
    }
    __name(jelly, "jelly");
    Object.assign(module.exports, { butterfly: butterfly3, firefly, bee: bee3, beeFriend, owl, koi, fish, dolphin, whaleBack, whaleFluke, bowl, jelly });
  }
});

// atelier/lot_m.js
var require_lot_m = __commonJS({
  "atelier/lot_m.js"(exports, module) {
    var { OUT: OUT3, P: P2, E, L, clip, r2: r23 } = require_troupe2();
    var Bt = require_betes();
    var halo = /* @__PURE__ */ __name((x, y, r, rgb = "255,240,170", a = 0.5) => [1, 0.7, 0.45].map((k, i) => `<circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r * k)}" fill="rgba(${rgb},${r23(a * (0.35 + i * 0.3))})"/>`).join(""), "halo");
    var etincelle = /* @__PURE__ */ __name((x, y, s = 1, fill = "#FFF6C8", line = "#E8C860") => `<path d="M${r23(x)},${r23(y - 1.6 * s)} L${r23(x + 0.4 * s)},${r23(y - 0.4 * s)} L${r23(x + 1.6 * s)},${r23(y)} L${r23(x + 0.4 * s)},${r23(y + 0.4 * s)} L${r23(x)},${r23(y + 1.6 * s)} L${r23(x - 0.4 * s)},${r23(y + 0.4 * s)} L${r23(x - 1.6 * s)},${r23(y)} L${r23(x - 0.4 * s)},${r23(y - 0.4 * s)} Z" fill="${fill}" stroke="${line}" stroke-width="${r23(0.35 * s)}"/>`, "etincelle");
    var ombre = /* @__PURE__ */ __name((rx, ry, x = 0, y = 0) => `<ellipse cx="${r23(x)}" cy="${r23(y)}" rx="${r23(rx)}" ry="${r23(ry)}" fill="rgba(40,55,20,.18)"/>`, "ombre");
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "trait");
    var graine = /* @__PURE__ */ __name((s) => () => {
      s = s * 16807 % 2147483647;
      return s / 2147483647;
    }, "graine");
    var BRUME = { clair: "#E4E9F1", corps: "#CCD4E1", dessous: "#AEB8CA", trait: "rgba(59,71,99,.45)" };
    var bouffee = /* @__PURE__ */ __name((x, y, r, a = 0.92) => `<g opacity="${a}"><circle cx="${r23(x)}" cy="${r23(y)}" r="${r23(r)}" fill="${BRUME.corps}" stroke="${BRUME.trait}" stroke-width="1.1"/><path d="M${r23(x - r * 0.86)},${r23(y + r * 0.2)} Q${r23(x)},${r23(y + r * 1.1)} ${r23(x + r * 0.86)},${r23(y + r * 0.2)} Q${r23(x)},${r23(y + r * 0.62)} ${r23(x - r * 0.86)},${r23(y + r * 0.2)} Z" fill="${BRUME.dessous}"/><circle cx="${r23(x - r * 0.32)}" cy="${r23(y - r * 0.34)}" r="${r23(r * 0.28)}" fill="${BRUME.clair}"/></g>`, "bouffee");
    var echarpe = /* @__PURE__ */ __name((x, y, w, f, a = 0.6) => {
      const o = [0, 1.2, -1.2][f];
      const d = `M${r23(x - w)},${r23(y + 3)} Q${r23(x - w / 2)},${r23(y - 3 + o)} ${r23(x)},${r23(y + 1)} Q${r23(x + w / 2)},${r23(y + 5 - o)} ${r23(x + w)},${r23(y - 1)}`;
      return `<g opacity="${a}">${trait(d, BRUME.dessous, 9)}${trait(d, BRUME.corps, 6.5)}${trait(d, BRUME.clair, 2.2)}</g>`;
    }, "echarpe");
    function brumeAuPied(n, f, k = 1) {
      const a = 40 * n, b = 20 * n, rnd = graine(7 + n * 31);
      let back = "", front = "";
      const tour = [[-a, 0, 0, -b], [0, -b, a, 0], [a, 0, 0, b], [0, b, -a, 0]];
      tour.forEach(([x0, y0, x1, y1], e) => {
        const nb = 1 + n * 2;
        for (let i = 0; i <= nb; i++) {
          const t = (i + 0.3 + rnd() * 0.4) / (nb + 1), j = rnd();
          const x = x0 + (x1 - x0) * t + Math.sin((f + i) * 2.1) * 1.6, y = y0 + (y1 - y0) * t;
          const r = (e < 2 ? 5 + n * 1.6 : 6.5 + n * 2.2) * (0.75 + j * 0.6) * (0.55 + 0.45 * k);
          const s = bouffee(x, y - r * 0.45 - Math.cos((f + i) * 1.7) * 0.8, r, (e < 2 ? 0.6 : 0.9) * k);
          if (e < 2) back += s;
          else front += s;
        }
      });
      return { back, front };
    }
    __name(brumeAuPied, "brumeAuPied");
    function embrume(n, f) {
      const a = 40 * n, h = 34 + 40 * n;
      const { back, front } = brumeAuPied(n, f);
      const voile = `<path d="M${-a},0 L0,${-20 * n} L${a},0 L0,${20 * n} Z" fill="rgba(200,208,222,.35)"/>`;
      return voile + back + echarpe(-a * 0.05, -h * 0.62, a * 0.55, f, 0.5) + echarpe(a * 0.05, -h * 0.32, a * 0.75, (f + 1) % 3, 0.6) + front;
    }
    __name(embrume, "embrume");
    function guerison(n, f) {
      const a = 40 * n, h = 34 + 40 * n, k = [0.65, 0.35, 0][f];
      const { back, front } = brumeAuPied(n, f, k || 0.01);
      let s = k ? back + front : "";
      const rnd = graine(91 + n);
      const nb = 4 + 3 * n;
      for (let i = 0; i < nb; i++) {
        const x = (rnd() * 2 - 1) * a * 0.8, y0 = -rnd() * h * 0.5;
        s += etincelle(x, y0 - f * 12 - rnd() * 8, 1.6 + rnd() * 1.4);
      }
      return s + (f === 2 ? halo(0, -h * 0.4, a * 0.6, "255,240,170", 0.25) : "");
    }
    __name(guerison, "guerison");
    function nuage(f) {
      const dy = [0, -1.5, -0.5][f];
      const d = `M-15,${r23(-6 + dy)} Q-17,${r23(-15 + dy)} -9,${r23(-16 + dy)} Q-7,${r23(-24 + dy)} 1,${r23(-22 + dy)} Q7,${r23(-28 + dy)} 12,${r23(-20 + dy)} Q19,${r23(-18 + dy)} 16,${r23(-9 + dy)} Q16,${r23(-4 + dy)} 9,${r23(-4 + dy)} L-10,${r23(-4 + dy)} Q-16,${r23(-3 + dy)} -15,${r23(-6 + dy)} Z`;
      const gouttes = [[-7, 0], [1, 2], [8, -1]].map(([x, y], i) => E(x + (f === i ? 0 : 0.4), y + dy + (f + i) % 3 * 0.8, 1, 1.4, BRUME.dessous, 0.7)).join("");
      return gouttes + P2(d, BRUME.corps, 1.2).replace(OUT3, "#4A5470") + clip(`nuage${f}`, d, `<rect x="-18" y="${r23(-11 + dy)}" width="36" height="9" fill="${BRUME.dessous}"/>`) + P2(d, "none", 1.2).replace(OUT3, "#4A5470") + L([-8, -17 + dy], [-4, -19.5 + dy], BRUME.clair, 1.6) + E(-2.5, -12 + dy, 1, 1.3, "#4A5470", 0) + E(4.5, -12.4 + dy, 1, 1.3, "#4A5470", 0) + P2(`M-0.6,${r23(-8.6 + dy)} Q1,${r23(-9.8 + dy)} 2.6,${r23(-8.6 + dy)}`, "none", 0.8).replace(OUT3, "#4A5470");
    }
    __name(nuage, "nuage");
    function reparerIcone() {
      return bouffee(12, 21, 8, 1) + `<g transform="rotate(-40 18 14)"><rect x="16.6" y="9" width="3" height="18" rx="1.2" fill="#B07A48" stroke="${OUT3}" stroke-width="1.2"/><rect x="11" y="5" width="14" height="6.4" rx="1.4" fill="#9AA4B4" stroke="${OUT3}" stroke-width="1.2"/><rect x="12.4" y="6" width="5" height="1.6" rx="0.6" fill="#D6DCE6"/></g>` + etincelle(25.5, 22, 2.2);
    }
    __name(reparerIcone, "reparerIcone");
    var POULES = [["#D9773A", "#B85E2C"], ["#F6F1E6", "#D8D0C0"], ["#3A3436", "#262224"]];
    function cage(etat, f = 0) {
      const ouverte = etat === "ouverte";
      const jx = ouverte ? 0 : [0, 0.8][f];
      const w = 22, d = 11, h = 24;
      const bois = "#B98A55", boisS = "#94693E", boisH = "#D2A672", corde = "#D8C08A";
      const g = /* @__PURE__ */ __name((s2) => `<g transform="translate(${jx} 0)">${s2}</g>`, "g");
      const L0 = `M${-w},0 L0,${d} L0,${d - h} L${-w},${-h} Z`, R0 = `M0,${d} L${w},0 L${w},${-h} L0,${d - h} Z`, T0 = `M${-w},${-h} L0,${d - h} L${w},${-h} L0,${-d - h} Z`;
      let s = ombre(30, 11, 2, 2);
      s += P2(`M${-w},${-h} L0,${-d - h} L${w},${-h} L${w},0 L0,${d} L${-w},0 Z`, "#5A4632", 0);
      if (!ouverte) {
        s += clip(`cg${etat}${f}`, `${L0} ${R0}`, POULES.map(([c, cs], i) => {
          const x = -13 + i * 12, y = -8 - (i === 1 ? 3 : 0) - (f && i !== 1 ? 1.2 : 0);
          return E(x, y + 6, 6.4, 5, cs, 0.9) + E(x + 1, y, 4, 3.8, c, 0.9) + P2(`M${x},${y - 3.6} Q${x + 1},${y - 6.4} ${x + 2.2},${y - 3.8} Q${x + 3.2},${y - 5.4} ${x + 3.8},${y - 3.2} Z`, "#D8443A", 0.7) + E(x + 2.4, y - 0.6, 0.6, 0.7, "#2A2420", 0) + P2(`M${x + 4.6},${y + 0.2} L${x + 6.4},${y + 0.9} L${x + 4.6},${y + 1.6} Z`, "#F2B640", 0.6);
        }).join(""));
      }
      const barres = /* @__PURE__ */ __name((x0, y0, x1, y1, nb) => Array.from({ length: nb }, (_, i) => {
        const t = (i + 1) / (nb + 1);
        const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
        return L([x, y - 1], [x, y - h + 1], OUT3, 2.6) + L([x, y - 1], [x, y - h + 1], boisH, 1.2);
      }).join(""), "barres");
      const cadre = /* @__PURE__ */ __name((pts3) => P2(`M${pts3.map((p) => p.join(",")).join(" L")} Z`, "none", 1.2), "cadre");
      s += barres(-w, 0, 0, d, 4);
      if (!ouverte) s += barres(0, d, w, 0, 4);
      s += [[[-w, 0], [0, d]], [[0, d], [w, 0]]].map(([a, b2]) => L([a[0], a[1] - 1.4], [b2[0], b2[1] - 1.4], OUT3, 4) + L([a[0], a[1] - 1.4], [b2[0], b2[1] - 1.4], bois, 2.4) + L([a[0], a[1] - h + 1.4], [b2[0], b2[1] - h + 1.4], OUT3, 4) + L([a[0], a[1] - h + 1.4], [b2[0], b2[1] - h + 1.4], bois, 2.4)).join("");
      s += P2(T0, bois, 1.2) + [0.25, 0.5, 0.75].map((t) => L([-w + w * t, -h + d * t], [w * t, -h - d + d * t], boisS, 0.8)).join("") + L([-w + 3, -h], [-4, -h - d + 2], boisH, 1);
      s += cadre([[-w, 0], [0, d], [w, 0], [w, -h], [0, -d - h], [-w, -h]]) + L([0, d], [0, d - h], OUT3, 1.2);
      if (ouverte) {
        s += P2(`M0,${d} L${w},0 L${w + 8},8 L8,${d + 8} Z`, boisS, 1.1) + [0.25, 0.5, 0.75].map((t) => L([w * t, d - d * t], [8 + w * t, d + 8 - d * t], OUT3, 0.8)).join("");
        s += P2(`M8,${d - 12} q3,-3 6,0 q-3,1 -6,0 Z`, "#F6F1E6", 0.6) + P2(`M-6,${d + 6} q3,-2.6 6,0 q-3,0.8 -6,0 Z`, "#D9773A", 0.6);
      } else {
        s += `<rect x="${w * 0.5 - 1.6}" y="${d * 0.5 - h * 0.55}" width="3.2" height="4" rx="0.8" fill="#8E8A80" stroke="${OUT3}" stroke-width="0.8"/>`;
      }
      s += P2(`M-6,${-h - d + 1} q6,-7 12,0`, "none", 2.6) + trait(`M-6,${-h - d + 1} q6,-7 12,0`, corde, 1.2);
      s = g(s);
      const rocher = /* @__PURE__ */ __name((x, y, rx, ry) => P2(`M${x - rx},${y} Q${x - rx},${y - ry * 1.4} ${x},${y - ry * 1.5} Q${x + rx},${y - ry * 1.3} ${x + rx},${y} Q${x},${y + ry * 0.5} ${x - rx},${y} Z`, "#9A958C", 1.2) + P2(`M${x + rx * 0.2},${y - ry * 1.3} Q${x + rx * 0.9},${y - ry * 1.1} ${x + rx},${y} Q${x + rx * 0.5},${y + ry * 0.2} ${x + rx * 0.3},${y + ry * 0.1} Z`, "#7E7A72", 0) + L([x - rx * 0.6, y - ry * 0.8], [x - rx * 0.2, y - ry * 1.2], "#BDB8AE", 1.2), "rocher");
      s = rocher(-30, 4, 13, 10) + s + rocher(26, 8, 11, 8) + rocher(-14, 14, 9, 6);
      s += trait("M-34,-4 q-4,6 1,10 q3,3 -1,8", "#4E7A3A", 2);
      if (!ouverte && f) s += P2("M30,-26 q3,-3 6,0 q-3,1 -6,0 Z", "#F6F1E6", 0.6) + P2("M-32,-22 q2.6,-2.6 5.2,0 q-2.6,0.8 -5.2,0 Z", "#D9773A", 0.6);
      return s;
    }
    __name(cage, "cage");
    var OEUF = "M0,0.6 C-5.2,0.6 -5.6,-6.4 -3.4,-9.4 C-1.8,-11.8 1.8,-11.8 3.4,-9.4 C5.6,-6.4 5.2,0.6 0,0.6 Z";
    var oeufCorps = /* @__PURE__ */ __name((id3, w) => P2(OEUF, "#F8EEDA", 0) + clip(id3, OEUF, '<ellipse cx="3.6" cy="-3" rx="4.2" ry="7" fill="#E6D4B2"/><ellipse cx="0" cy="1.4" rx="6" ry="2.4" fill="#E6D4B2"/>') + P2(OEUF, "none", w) + E(-1.9, -7.4, 0.9, 1.6, "#FFFFFF", 0) + E(2.2, -4.6, 0.35, 0.35, "#CDB894", 0) + E(-0.8, -3.2, 0.3, 0.3, "#CDB894", 0), "oeufCorps");
    var oeuf = /* @__PURE__ */ __name(() => ombre(6, 2.2, 1, 1) + oeufCorps("oeuf", 1.1), "oeuf");
    var oeufIcone = /* @__PURE__ */ __name(() => `<g transform="translate(16 27.5) scale(2.1)">${oeufCorps("oeufi", 0.62)}</g>` + etincelle(24.5, 8.5, 2), "oeufIcone");
    function crabe2(pose) {
      const walk = pose === "marche1" || pose === "marche2", n = pose === "marche2" ? 1 : 0;
      const joie = pose === "joie";
      const C2 = "#E8734A", CS = "#C85A36", CH = "#F6A27E", V = "#F6C7A0";
      const y = -5.4 - (walk && n ? 0.5 : 0);
      let s = ombre(8, 1.8, 0, 0.2);
      for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
        const lift = walk && (i + n + (side > 0 ? 1 : 0)) % 2 ? -1.2 : 0;
        const x0 = side * (3 + i * 1.2), x1 = side * (6.4 + i * 1.4), x2 = side * (7.6 + i * 1.5);
        s += P2(`M${r23(x0)},${r23(y + 1)} L${r23(x1)},${r23(y - 0.6 + lift)} L${r23(x2)},${r23(0 + lift * 0.4)}`, "none", 2.4) + trait(`M${r23(x0)},${r23(y + 1)} L${r23(x1)},${r23(y - 0.6 + lift)} L${r23(x2)},${r23(0 + lift * 0.4)}`, CS, 1);
      }
      const pince = /* @__PURE__ */ __name((side) => {
        const up2 = joie ? -6 : walk ? -1.2 * (n ? 1 : -1) * side * 0.5 : 0;
        const bx = side * 8.6, by = y - 3.4 + up2;
        return P2(`M${r23(side * 4.4)},${r23(y - 1)} Q${r23(side * 6.6)},${r23(y - 2.4 + up2 / 2)} ${r23(bx)},${r23(by + 1.4)}`, "none", 2.6) + trait(`M${r23(side * 4.4)},${r23(y - 1)} Q${r23(side * 6.6)},${r23(y - 2.4 + up2 / 2)} ${r23(bx)},${r23(by + 1.4)}`, C2, 1.2) + E(bx, by, 2.6, 2.2, C2, 1) + P2(`M${r23(bx + side * 0.6)},${r23(by - 2)} L${r23(bx + side * 2.4)},${r23(by - 3.6)} L${r23(bx + side * 1.8)},${r23(by - 0.8)} Z`, C2, 0.9) + L([bx - side * 0.8, by - 0.8], [bx - side * 0.2, by - 1.6], CH, 0.8);
      }, "pince");
      s += pince(-1) + pince(1);
      const shell2 = `M-6.4,${r23(y + 1.6)} Q-7,${r23(y - 4.2)} 0,${r23(y - 4.6)} Q7,${r23(y - 4.2)} 6.4,${r23(y + 1.6)} Q0,${r23(y + 3.6)} -6.4,${r23(y + 1.6)} Z`;
      s += P2(shell2, C2) + clip(`crabe${pose}`, shell2, `<path d="M-8,${r23(y + 0.6)} Q0,${r23(y + 2.8)} 8,${r23(y + 0.6)} L8,${r23(y + 4)} L-8,${r23(y + 4)} Z" fill="${V}"/><ellipse cx="4" cy="${r23(y - 1)}" rx="3" ry="4" fill="${CS}" opacity="0.6"/>`) + P2(shell2, "none") + L([-4.4, y - 2.6], [-2, y - 3.6], CH, 1);
      const eyeMode = pose === "clignement" ? "blink" : joie ? "joy" : "open";
      for (const side of [-1, 1]) {
        const ex = side * 1.9, ey = y - 7.4;
        s += L([side * 1.4, y - 4], [ex, ey + 1.2], OUT3, 1.6) + L([side * 1.4, y - 4], [ex, ey + 1.2], CS, 0.6) + E(ex, ey, 1.5, 1.6, "#FFFFFF", 0.8) + Bt.eye(ex + 0.1, ey + 0.1, 0.95, eyeMode);
      }
      s += joie ? P2(`M-1.4,${r23(y - 0.4)} Q0,${r23(y + 1)} 1.4,${r23(y - 0.4)}`, "none", 0.7) + Bt.heartIcon(0, y - 12.6, 1.3) : P2(`M-1,${r23(y)} Q0,${r23(y + 0.6)} 1,${r23(y)}`, "none", 0.6);
      return s;
    }
    __name(crabe2, "crabe");
    function fleurs(f) {
      const tiges = [[-9, 2, -15, "#F4E9C8"], [0, -2, -20, "#FFFFFF"], [9, 3, -14, "#F8D9E0"], [-2, 7, -11, "#F4E9C8"]];
      let s = ombre(16, 5, 0, 2);
      s += P2("M-14,4 Q-12,-4 -9,3 Q-8,-6 -4,3 Q-2,-5 1,3 Q3,-6 6,3 Q8,-4 11,4 Q14,-2 15,5 Q0,9 -14,4 Z", "#6FA84E", 1.1) + trait("M-8,4 Q-4,-1 0,4 Q4,0 8,5", "#5A8E3E", 1);
      const ouv = [0, 0.4, 0.75, 1][f];
      for (const [x, y, top, col] of tiges) {
        const hx = x + (top + 18) * 0.15, hy = y + top;
        s += P2(`M${x},${y} Q${r23(x + 1.4)},${r23(y + top / 2)} ${r23(hx)},${r23(hy)}`, "none", 2.4) + trait(`M${x},${y} Q${r23(x + 1.4)},${r23(y + top / 2)} ${r23(hx)},${r23(hy)}`, "#5E9A42", 1.1);
        if (!ouv) {
          s += E(hx, hy - 1.6, 1.8, 2.8, "#8DC46A", 0.9) + trait(`M${r23(hx - 0.6)},${r23(hy - 3.8)} Q${hx},${r23(hy - 5)} ${r23(hx + 0.6)},${r23(hy - 3.8)}`, col, 1.2);
          continue;
        }
        const r = 1.6 + 2.6 * ouv;
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
          const px = hx + Math.cos(a) * r * 0.75, py = hy + Math.sin(a) * r * 0.55;
          s += `<ellipse cx="${r23(px)}" cy="${r23(py)}" rx="${r23(r * 0.55)}" ry="${r23(r * 0.4 + 0.4)}" fill="${col}" stroke="${OUT3}" stroke-width="0.8" transform="rotate(${r23(a * 180 / Math.PI + 90)} ${r23(px)} ${r23(py)})"/>`;
        }
        s += E(hx, hy, 1.2 + ouv * 0.4, 1 + ouv * 0.3, "#F2C640", 0.7);
      }
      if (f === 3) s = halo(0, -10, 20, "255,232,150", 0.3) + s + etincelle(-13, -22, 1.4) + etincelle(12, -25, 1.2) + etincelle(3, -30, 1);
      return s;
    }
    __name(fleurs, "fleurs");
    function lucioles(f) {
      const nb = 9, rnd = graine(1234);
      const pts3 = Array.from({ length: nb }, (_, i) => ({ a: i / nb * Math.PI * 2 + rnd() * 0.5, rx: 8 + rnd() * 9, ry: 3 + rnd() * 4, h: 18 + rnd() * 14, s: 0.9 + rnd() * 0.5 }));
      let s = `<ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(255,236,150,.18)"/>` + halo(0, -26, 22, "255,236,150", 0.22);
      for (const p of pts3) {
        const a = p.a + f * Math.PI / 8;
        const x = Math.cos(a) * p.rx, y = -p.h + Math.sin(a) * p.ry;
        const on = (Math.round(p.a * 10) + f) % 4 !== 0;
        s += halo(x, y, on ? 5 * p.s : 3.4 * p.s, "255,236,150", on ? 0.5 : 0.3) + E(x, y, 1.3 * p.s, 1.1 * p.s, on ? "#FFF3A0" : "#E8D880", 0);
      }
      return s;
    }
    __name(lucioles, "lucioles");
    var OR = { clair: "#FFF6C8", vif: "#F6D25A", base: "#E8B23A", ambre: "#E8A93A", trait: "#9A6A1A" };
    function etoileD(x, y, r1, r2_, n, rot) {
      const pts3 = [];
      for (let i = 0; i < n * 2; i++) {
        const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2_ : r1;
        pts3.push(`${r23(x + Math.cos(a) * r)},${r23(y + Math.sin(a) * r)}`);
      }
      return `M${pts3.join(" L")} Z`;
    }
    __name(etoileD, "etoileD");
    function eclat(f) {
      const k = [1, 1.12, 1, 0.9][f % 4], rot = f * 11.25;
      let s = halo(0, 0, 11 * k, "255,226,130", 0.42);
      s += P2(etoileD(0, 0, 8 * k, 2.3 * k, 4, rot - 90), OR.vif, 0.9).replace(`stroke="${OUT3}"`, `stroke="${OR.trait}"`);
      s += P2(etoileD(0, 0, 4.8 * k, 1.6 * k, 4, rot - 45), OR.clair, 0);
      s += E(0, 0, 1.9 * k, 1.9 * k, "#FFFFFF", 0);
      for (let i = 0; i < 3; i++) {
        const a = f * Math.PI / 4 + i * Math.PI * 2 / 3;
        s += etincelle(Math.cos(a) * 9, Math.sin(a) * 5.4, 0.75);
      }
      return s;
    }
    __name(eclat, "eclat");
    function arrivee(f) {
      let s = "";
      const col = /* @__PURE__ */ __name((w, a, top) => `<path d="M${-w},0 L${-w},${top + w} Q${-w},${top} 0,${top} Q${w},${top} ${w},${top + w} L${w},0 Z" fill="rgba(255,230,140,${a})"/>`, "col");
      if (f === 0) {
        s += halo(0, -30, 24, "255,226,130", 0.5);
        s += P2(etoileD(0, -30, 15, 3.4, 4, -90), OR.vif, 0.9).replace(`stroke="${OUT3}"`, `stroke="${OR.trait}"`) + P2(etoileD(0, -30, 9, 2.4, 4, -45), OR.clair, 0) + E(0, -30, 3.2, 3.2, "#FFFFFF", 0);
      }
      if (f === 1 || f === 2) {
        const big2 = f === 2;
        s += `<ellipse cx="0" cy="0" rx="${big2 ? 22 : 15}" ry="${big2 ? 6.8 : 4.8}" fill="none" stroke="${OR.vif}" stroke-width="${big2 ? 1.2 : 1.8}" opacity="${big2 ? 0.55 : 0.9}"/>`;
        s += col(big2 ? 13 : 10, big2 ? 0.32 : 0.26, -66) + col(big2 ? 7 : 5, big2 ? 0.38 : 0.3, -62);
        s += halo(0, -30, big2 ? 20 : 16, "255,236,160", big2 ? 0.32 : 0.42);
      }
      if (f === 3) s += col(11, 0.14, -66) + col(5, 0.16, -60);
      const SP = [[-9, -14], [8, -22], [-6, -36], [10, -44], [-11, -52], [4, -60], [-2, -68], [12, -64]];
      const from = [0, 0, 2, 4, 5][f], to = [3, 5, 7, 8, 8][f];
      SP.slice(from, to).forEach(([x, y], i) => {
        s += etincelle(x, y - f * 2, [1.3, 1.1, 0.9][i % 3] * (f === 4 ? 0.7 : 1));
      });
      return s;
    }
    __name(arrivee, "arrivee");
    var SCEAUX = [
      ["mercure", "Mercure ☿ (Aster)", "M8 2.5a4 4 0 0 0 8 0M16 9.5a4 4 0 1 1-8 0a4 4 0 1 1 8 0M12 13.5v8M8.8 18h6.4"],
      ["saturne", "Saturne ♄ (Galet)", "M9 2.5v12M5.8 5.6h6.4M9 11.5c1.6-2.8 6.6-2.6 6.6 1.6c0 2.6-3 3.6-3 6.2c0 1.2.8 2.2 2.2 2.2"],
      ["lune", "Lune ☾ (Ondin)", "M15.5 3.2a8.8 8.8 0 1 0 0 17.6a7.2 7.2 0 1 1 0-17.6z"],
      ["venus", "Vénus ♀ (Sylve et Mélisse)", "M17 8.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M12 13.5v8.5M8.5 18.2h7"],
      ["mars", "Mars ♂ (Cannelle)", "M14.5 14.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M13.2 10.8L20 4M14.6 4H20v5.4"],
      ["jupiter", "Jupiter ♃ (Rivet)", "M5.5 7c1.4-2.6 5.6-3 6.6-.4c1 2.6-2 6.4-6.4 10.4h13.6M16 11.5v10"],
      ["soleil", "Soleil ☉ (Brume)", "M20 12a8 8 0 1 1-16 0a8 8 0 1 1 16 0M13.7 12a1.7 1.7 0 1 1-3.4 0a1.7 1.7 0 1 1 3.4 0"]
    ];
    function sceau(i, allume, f = 0) {
      const d = SCEAUX[i][2], k = 0.6;
      const sig = /* @__PURE__ */ __name((color, w, extra = "") => `<path d="${d}" transform="translate(${-12 * k} ${-12 * k}) scale(${k})" fill="none" stroke="${color}" stroke-width="${r23(w / k)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "sig");
      let s = "";
      if (allume) {
        s += halo(0, 0, f ? 15 : 13, "255,220,120", f ? 0.48 : 0.4);
        s += E(0, 0, 9.6, 9.6, OR.ambre) + E(-0.8, -0.9, 7.4, 7.4, OR.vif, 0) + `<circle cx="0" cy="0" r="7.8" fill="none" stroke="${OR.trait}" stroke-width="0.6"/>`;
        s += sig("rgb(255,248,210)", 3.4, ' opacity="0.6"') + sig("#FFFBEA", 1.5);
        s += f ? etincelle(8.6, -8.4, 1) + etincelle(-9.4, 6.4, 0.7) : etincelle(-8.2, -8.8, 0.8);
      } else {
        s += E(0, 0, 9.6, 9.6, "#B2A282") + E(-0.8, -0.9, 7.4, 7.4, "#C6B898", 0) + `<circle cx="0" cy="0" r="7.8" fill="none" stroke="#8E7E60" stroke-width="0.6"/>`;
        s += sig("#7A6A4E", 1.5);
      }
      return s;
    }
    __name(sceau, "sceau");
    module.exports = { embrume, guerison, nuage, reparerIcone, cage, oeuf, oeufIcone, crabe: crabe2, fleurs, lucioles, eclat, arrivee, SCEAUX, sceau };
  }
});

// atelier/lot_m_liste.js
var require_lot_m_liste = __commonJS({
  "atelier/lot_m_liste.js"(exports, module) {
    var M2 = require_lot_m();
    var n3 = /* @__PURE__ */ __name((f, k = 3) => Array.from({ length: k }, (_, i) => () => f(i)), "n3");
    var GROUPES = [];
    for (const n of [1, 2, 3]) {
      const a = 40 * n, h = 34 + 40 * n, base = [-a - 14, -h - 14, 2 * a + 28, h + 20 * n + 26];
      GROUPES.push({ dir: "decor/embrume", nom: `embrume_${n}x${n}`, base, images: n3((f) => M2.embrume(n, f)) });
      GROUPES.push({ dir: "decor/embrume", nom: `embrume_${n}x${n}_guerison`, base, images: n3((f) => M2.guerison(n, f)) });
    }
    GROUPES.push(
      { dir: "decor/embrume", nom: "embrume_nuage", base: [-24, -34, 48, 40], images: n3((f) => M2.nuage(f)) },
      { dir: "decor/embrume", nom: "reparer_icone", base: [0, 0, 32, 32], images: [() => M2.reparerIcone()] },
      { dir: "decor/camp/poules", nom: "cage_poules_coincee", base: [-50, -50, 100, 72], images: [() => M2.cage("coincee", 0), () => M2.cage("coincee", 1)] },
      { dir: "decor/camp/poules", nom: "cage_poules_ouverte", base: [-50, -50, 100, 72], images: [() => M2.cage("ouverte", 0)] },
      { dir: "decor/camp/poules", nom: "oeuf", base: [-10, -14, 20, 17], images: [() => M2.oeuf()] },
      { dir: "decor/camp/poules", nom: "oeuf_icone", base: [0, 0, 32, 32], images: [() => M2.oeufIcone()] },
      { dir: "decor/signes", nom: "fleurs_ouverture", base: [-30, -40, 60, 50], images: n3((f) => M2.fleurs(f), 4) },
      { dir: "decor/signes", nom: "lucioles_rassemblees", base: [-30, -52, 60, 58], images: n3((f) => M2.lucioles(f), 4) },
      { dir: "decor/souvenir", nom: "eclat", base: [-14, -14, 28, 28], images: n3((f) => M2.eclat(f), 4) },
      { dir: "decor/souvenir", nom: "arrivee", base: [-24, -72, 48, 76], images: n3((f) => M2.arrivee(f), 5) }
    );
    for (const [i, [cle]] of M2.SCEAUX.entries()) {
      GROUPES.push({ dir: "decor/souvenir", nom: `sceau_${cle}_eteint`, base: [-15, -15, 30, 30], images: [() => M2.sceau(i, false)] });
      GROUPES.push({ dir: "decor/souvenir", nom: `sceau_${cle}_allume`, base: [-15, -15, 30, 30], images: [0, 1].map((f) => () => M2.sceau(i, true, f)) });
    }
    var POSES_CRABE = ["marche1", "marche2", "repos", "clignement", "joie"];
    var CRABE = { dir: "animaux/mer/crabe", base: [-14, -22, 28, 24], poses: POSES_CRABE, dessin: /* @__PURE__ */ __name((p) => M2.crabe(p), "dessin") };
    module.exports = { GROUPES, CRABE };
  }
});

// atelier/noms_betes.js
var require_noms_betes = __commonJS({
  "atelier/noms_betes.js"(exports, module) {
    var hyph = /* @__PURE__ */ __name((s) => s.replace(/_/g, "-"), "hyph");
    var SANS_SENS = /* @__PURE__ */ new Set(["hibou", "meduse", "papillon_bleu", "papillon_jaune", "papillon_lune"]);
    function nomBete(rel) {
      const parts = rel.split("/");
      const base = parts.pop().replace(/\.svg$/, "");
      const [top, a, b] = parts;
      const out = /* @__PURE__ */ __name((dirs, name) => [...dirs, name + ".svg"].join("/"), "out");
      if (top === "animaux") {
        const sujet = b;
        const rest = base.slice(sujet.length + 1);
        if (!base.startsWith(sujet + "_")) throw new Error("bête inattendue : " + rel);
        const S2 = hyph(sujet);
        const m = rest.match(/^(?:(avant|dos)_)?([a-z]+?)(\d+)?$/);
        if (!m) throw new Error("bête inattendue : " + rel);
        const [, vue, pose, n] = m;
        if (pose === "image" && a === "familiers") return out([top, a, S2], n ? `${S2}_${n}` : S2);
        const v = vue || (SANS_SENS.has(sujet) || a === "familiers" && sujet.startsWith("bocal") ? "face" : "profil");
        const p = pose === "image" ? "nage" : pose;
        return out([top, a, S2], [S2, v, p, n].filter(Boolean).join("_"));
      }
      if (top === "egares") {
        const m = base.match(/^([a-z-]+)_(avant|dos)_([a-z]+?)(\d+)?$/);
        if (!m || m[1] !== a) throw new Error("égaré inattendu : " + rel);
        return out([top, a], [m[1], m[2], m[3], m[4]].filter(Boolean).join("_"));
      }
      return null;
    }
    __name(nomBete, "nomBete");
    function vitesseBete(id3, pose) {
      const [top, a] = id3.split("/");
      if (top === "animaux") return pose === "vol" ? 120 : pose === "assis" ? 500 : pose === "dodo" ? 800 : pose === "nage" && /mer|familiers/.test(a) ? 420 : 260;
      if (top === "egares") return { marche: 240, fuite: 160, bouderie: [500, 700], luciole: [300, 200, 200, 1e3], brume: [220, 220, 900] }[pose];
      return void 0;
    }
    __name(vitesseBete, "vitesseBete");
    module.exports = { nomBete, vitesseBete };
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
function snowPan(A, B, C2, D, k = 0.8, glacons = false) {
  const n = Math.max(3, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 9));
  const low = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, kk = k + (i % 2 ? 0.06 : -0.04);
    return lerp(lerp(A, D, kk), lerp(B, C2, kk), t);
  });
  const up2 = [[A[0], A[1] - 1.6], [B[0], B[1] - 1.6]];
  let d = `M${fmt(up2[0][0])},${fmt(up2[0][1])} L${fmt(up2[1][0])},${fmt(up2[1][1])} L${fmt(low[n][0])},${fmt(low[n][1])}`;
  for (let i = n - 1; i >= 0; i--) {
    const p = low[i], q = low[i + 1], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 1.4];
    d += ` Q${fmt(m[0])},${fmt(m[1])} ${fmt(p[0])},${fmt(p[1])}`;
  }
  d += " Z";
  const sh = low.map(([x, y]) => [x, y + 1.2]);
  let o = `<polyline points="${pts(sh)}" fill="none" stroke="${NEIGE.shade}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="${NEIGE.light}"${EDGE}/>`;
  if (glacons) {
    const m = Math.max(2, Math.round(Math.hypot(C2[0] - D[0], C2[1] - D[1]) / 7));
    for (let i = 0; i < m; i++) {
      const t = (i + 0.5) / m, [x, y] = lerp(D, C2, t), l = 2.6 + i * 7 % 3 * 0.9;
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
function cylinder(u, v, z0, z1, r, colors, id3, edge = EDGE) {
  const [x0, y0] = P(u, v, z0);
  const [, y1] = P(u, v, z1);
  const rx = r * TW * Math.SQRT1_2;
  const ry = r * TH * Math.SQRT1_2;
  const side = `M${fmt(x0 - rx)},${fmt(y1)} L${fmt(x0 - rx)},${fmt(y0)} A${fmt(rx)},${fmt(ry)} 0 0 0 ${fmt(x0 + rx)},${fmt(y0)} L${fmt(x0 + rx)},${fmt(y1)} Z`;
  return `<defs><linearGradient id="${id3}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs><path d="${side}" fill="url(#${id3})"${edge}/><ellipse cx="${fmt(x0)}" cy="${fmt(y1)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${colors.top}"${edge}/>`;
}
__name(cylinder, "cylinder");
function boulder(u, v, ru, rv, h, colors, seed = 0, jag = 0.25, peak = 0.6, edge = EDGE) {
  const n = 8;
  const rnd = /* @__PURE__ */ __name((k) => {
    const x = Math.sin(seed * 91.7 + k * 47.3) * 43758.5453;
    return x - Math.floor(x);
  }, "rnd");
  const ring = /* @__PURE__ */ __name((scale, back, z) => Array.from({ length: n }, (_, k) => {
    const a = k / n * Math.PI * 2 + rnd(k) * 0.45;
    const r = (1 - jag * rnd(k + 10)) * scale;
    return [u + Math.cos(a) * ru * r - ru * back, v + Math.sin(a) * rv * r - rv * back, z * (0.85 + 0.3 * rnd(k + 20 + z))];
  }), "ring");
  const rings = [ring(1, 0, 0), ring(0.5 + peak * 0.45, 0.04, h * 0.55), ring(peak, 0.1, h)];
  let out = "";
  for (let level = 0; level < 2; level++) {
    const lo = rings[level], hi = rings[level + 1];
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n;
      const nu = (lo[k][0] + lo[j][0]) / 2 - u, nv = (lo[k][1] + lo[j][1]) / 2 - v;
      if (nu + nv <= 0) continue;
      const w = Math.min(1, Math.max(0, 0.5 + 0.7 * (nu - nv) / Math.hypot(nu, nv)));
      const side = mixHex(colors.left, colors.right, w);
      out += face([lo[k], lo[j], hi[j], hi[k]], level ? mixHex(side, colors.top, 0.35) : side, edge);
    }
  }
  return out + face(rings[2], colors.top, edge);
}
__name(boulder, "boulder");
function mixHex(a, b, k) {
  const ca = parseInt(a.slice(1), 16), cb = parseInt(b.slice(1), 16);
  const ch = /* @__PURE__ */ __name((s) => Math.round((ca >> s & 255) * (1 - k) + (cb >> s & 255) * k), "ch");
  return `#${(ch(16) << 16 | ch(8) << 8 | ch(0)).toString(16).padStart(6, "0")}`;
}
__name(mixHex, "mixHex");
function shadow(u, v, r, opacity = 0.22) {
  return disc(u + 0.12, v + 0.02, 0, r, `rgba(40,55,20,${opacity})`);
}
__name(shadow, "shadow");
function sprite(body, box2) {
  const { x, y, w, h } = box2;
  return {
    box: box2,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">${body}</svg>`
  };
}
__name(sprite, "sprite");

// atelier/port/src/world/palette.js
var WOOD = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
var WOOD_DARK = { top: "#A9703F", left: "#8B5631", right: "#6A3F22" };
var STONE = { top: "#E6E1D4", left: "#C3BBA9", right: "#9B927F" };
var WALL = { top: "#FCF4E2", left: "#F3E4C4", right: "#D8C39B" };
var BRICK = { top: "#E08A62", left: "#C66B47", right: "#A05035" };
var ROOF_RED = { front: "#E06E52", back: "#B9503B" };
var THATCH = { front: "#EBC46F", back: "#C99A45" };
var LEAVES = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
var GLASS = "#FFE6A3";
var BUILDING_BOX = { x: -76, y: -124, w: 152, h: 168 };
var PROP_BOX = { x: -40, y: -92, w: 80, h: 112 };
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
var BLUE_ROOF = { front: "#6FA3D9", back: "#4C7FB5" };
var SLATE_ROOF = { front: "#7D8AA0", back: "#5C6880" };

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
function garland(site, level, n, hang, rope2 = "#5A4632") {
  const g = garlandGeo(site, level);
  let out = g.poles.map((p) => pole(p.u, p.v, g.poleH)).join("") + (g.backPole ? pole(g.backPole[0], g.backPole[1], 44) : "");
  g.poles.forEach((p, side) => {
    const { d, points } = chain(g.high, p.top, 12 + half(level) * 6, n);
    out += `<path d="${d}" fill="none" stroke="${rope2}" stroke-width="0.7"/>`;
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
  return (T, level, f) => {
    const w = (f === 0 ? 3.2 : 1.3) * s;
    const edge = ' stroke="rgba(60,40,30,.55)" stroke-width="0.4"';
    return ell(-w * 0.75, -1.4 * s, w, 2.2 * s, color, edge) + ell(w * 0.75, -1.4 * s, w, 2.2 * s, color, edge) + ell(-w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"') + ell(w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"') + dot(-w * 0.8, -1.6 * s, 0.6 * s, "rgba(255,255,255,.7)") + dot(w * 0.8, -1.6 * s, 0.6 * s, "rgba(255,255,255,.7)") + ln([0, -2.4 * s], [0, 2 * s], "#3A2A1E", 0.8);
  };
}
__name(butterfly, "butterfly");
function gull(T, level, f) {
  const up2 = f === 0;
  const y = up2 ? -3.6 : 1.6;
  const d = `M-9,${f2(y)} Q-4.5,${f2(up2 ? -4.6 : -0.6)} 0,0 Q4.5,${f2(up2 ? -4.6 : -0.6)} 9,${f2(y)}`;
  return `<path d="${d}" fill="none" stroke="#5A6878" stroke-width="2.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>` + ell(0, 0.4, 2.2, 1.4, "#FFFFFF", ' stroke="#5A6878" stroke-width="0.4"') + dot(1.9, 0.3, 0.6, "#F2A23C");
}
__name(gull, "gull");
function dragonfly(T, level, f) {
  const w = f === 0 ? 4.2 : 2.6;
  return ell(-w * 0.6, -0.8, w * 0.6, 1, "rgba(200,240,255,.75)", ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"') + ell(w * 0.6, -0.8, w * 0.6, 1, "rgba(200,240,255,.75)", ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"') + ln([-0.2, -1.6], [0.6, 3.4], "#2F8FA8", 1.2) + dot(-0.3, -1.8, 0.9, "#1F6F86");
}
__name(dragonfly, "dragonfly");
var bee = /* @__PURE__ */ __name((T, level, f) => ell(0, 0, 2.3, 1.6, "#F2C04B", ' stroke="#3A2A1E" stroke-width="0.4"') + ln([-0.4, -1.4], [-0.4, 1.4], "#3A2A1E", 0.8) + ln([0.8, -1.4], [0.8, 1.4], "#3A2A1E", 0.8) + ell(-0.3, -2.1, f === 0 ? 1.7 : 0.8, 1, "rgba(255,255,255,.9)"), "bee");
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
function roseBush(T) {
  const [x, y] = T.p(0, 0, 0);
  const colors = ["#F28AB2", "#FFFFFF", "#E2574C", "#F7A8C8", "#FFD45E"];
  let out = T.shadow(0, 0, 0.22) + ell(x, y - 6, 10, 7, "#4F8F3A") + ell(x - 4, y - 8, 6.5, 5, "#6DB04F") + ell(x + 4, y - 9, 6, 4.5, "#7EC45B") + ell(x - 1, y - 12, 5, 3.6, "#8FCB6B");
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
      draw: /* @__PURE__ */ __name((T, level) => SUNFLOWERS.map(([u, v], k) => sunflower(...P(u * half(level), v * half(level)), (level >= 4 ? 40 : 30) + k % 2 * 6, level >= 4 ? 1.2 : 1)).join(""), "draw")
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
      draw: /* @__PURE__ */ __name((T) => {
        const [x, y] = T.p(0, 0, 0);
        let out = T.shadow(0, 0, 0.3) + oreRock(x - 7, y + 1, 1, 1) + oreRock(x + 7, y + 2, 0.8, 2);
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
      draw: /* @__PURE__ */ __name((T, level, f, n) => {
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
var lavaBubble = /* @__PURE__ */ __name((T, level, f, n) => {
  const [x, y] = T.p(0, 0, 0);
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
      draw: /* @__PURE__ */ __name((T, level) => {
        const h = half(level);
        const [pu, pv] = [LAVA_POOL[0] * h, LAVA_POOL[1] * h];
        return CRACKS.map((crack) => {
          const pts3 = crackPath(crack, level);
          return `<polyline points="${pts3}" fill="none" stroke="#3A1A10" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts3}" fill="none" stroke="#FF7A2A" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts3}" fill="none" stroke="#FFD45E" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>`;
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
var fairy = /* @__PURE__ */ __name((T, level, f) => {
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
      draw: /* @__PURE__ */ __name((T, level) => MUSHROOMS.map(([u, v], k) => mushroom(...P(u * half(level), v * half(level)), (level >= 4 ? 1.2 : 1) * (k % 3 ? 0.85 : 1.1), k)).join(""), "draw")
    },
    {
      at: [0, 0],
      frame: /* @__PURE__ */ __name((level) => frameOf(FAIRY.map((_, k) => fairyAt(k, level)).flatMap(([x, y]) => [[x, y - 11], [x, y + 4]]), 4), "frame"),
      draw: /* @__PURE__ */ __name((T, level) => FAIRY.map((_, k) => fairyLantern(fairyAt(k, level))).join(""), "draw"),
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
    { at: [0, 0], back: true, frame: footprintFrame, draw: /* @__PURE__ */ __name((T, level) => petalCarpet(level, false), "draw") },
    { at: [0, 0], frame: footprintFrame, draw: /* @__PURE__ */ __name((T, level) => petalCarpet(level, true), "draw") },
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
      draw: /* @__PURE__ */ __name((T, level) => {
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
      draw: /* @__PURE__ */ __name((T, level, f, n) => {
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
      draw: /* @__PURE__ */ __name((T) => {
        const pad = /* @__PURE__ */ __name((du, dv, s) => {
          const [x, y] = T.p(du, dv, 0.6);
          return `<path d="M${f2(x)},${f2(y)} L${f2(x + 3.4 * s)},${f2(y - 1.2 * s)} A${f2(3.6 * s)},${f2(1.9 * s)} 0 1 1 ${f2(x + 3.4 * s)},${f2(y + 1.2 * s)} Z" fill="#6DB04F" stroke="#4F8F3A" stroke-width="0.4"/>`;
        }, "pad");
        const lotus = /* @__PURE__ */ __name((du, dv) => {
          const [x, y] = T.p(du, dv, 1.2);
          return ell(x - 1.4, y - 1, 1.3, 2.1, "#F7A8C8", ' transform="rotate(-25 ' + f2(x - 1.4) + " " + f2(y - 1) + ')"') + ell(x + 1.4, y - 1, 1.3, 2.1, "#F7A8C8", ' transform="rotate(25 ' + f2(x + 1.4) + " " + f2(y - 1) + ')"') + ell(x, y - 1.6, 1.2, 2.3, "#FCD3E1") + dot(x, y - 0.4, 0.8, "#FFD45E");
        }, "lotus");
        return T.disc(0, 0, 0, 0.36, "#B9B2A2") + T.disc(0, 0, 0.3, 0.32, "#5AAED7") + T.disc(-0.04, -0.03, 0.4, 0.2, "#86C6E6") + pad(-0.14, 0.08, 1) + pad(0.12, -0.12, 0.9) + pad(0.06, 0.16, 0.8) + pad(-0.18, -0.12, 0.75) + lotus(-0.1, 0.06) + lotus(0.14, -0.1);
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
    draw: /* @__PURE__ */ __name((T, level) => garland("ponton", level, 7, pennant, "#3A2A1E"), "draw"),
    motion: /* @__PURE__ */ __name((t) => [Math.sin(t * 2.2) * 6e-3, -Math.sin(t * 2.2) * 6e-3, Math.sin(t * 1.7) * 0.5], "motion")
  }]
};
var perchedGull = /* @__PURE__ */ __name((T, level, f) => {
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
var sparks = /* @__PURE__ */ __name((T, level, f, n) => {
  const [x, y] = chimneyAt(level);
  let out = dot(x, y - 1, 4, "rgba(255,170,60,.35)") + dot(x, y - 1, 2, "rgba(255,230,150,.7)");
  for (let k = 0; k < 16; k++) {
    const p = (f / n + k / 16) % 1;
    const vx = (rand(k) - 0.5) * 46;
    const up2 = 38 + rand(k + 9) * 14;
    const at = /* @__PURE__ */ __name((q) => [x + vx * q, y - up2 * q + 34 * q * q], "at");
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
  const pts3 = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = turn + i / (teeth * 2) * Math.PI * 2;
    const rr = i % 2 ? r : r * 1.22;
    pts3.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92]);
  }
  return `<polygon points="${pts3.map(xy2).join(" ")}" fill="#F2C04B" stroke="#A8782A" stroke-width="0.6" stroke-linejoin="round"/>` + dot(x, y, r * 0.55, "#FFE08A") + dot(x, y, r * 0.22, "#A8782A");
}
__name(gearPath, "gearPath");
var gears = /* @__PURE__ */ __name((T, level, f, n) => {
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
    draw: /* @__PURE__ */ __name((T, level) => garland("foyer", level, 5, lampion), "draw"),
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
      draw: /* @__PURE__ */ __name((T, level) => ivyTrellis(level), "draw")
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
var gradient = /* @__PURE__ */ __name((id3, from, to) => `<defs><linearGradient id="${id3}" x1="0" x2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`, "gradient");
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
    face: /* @__PURE__ */ __name((pts3, fill, extra) => face(pts3.map(([a, b, z]) => [u + a, v + b, z]), fill, extra), "face"),
    shadow: /* @__PURE__ */ __name((du, dv, r, o = 0.22, z = 0) => disc(u + du + 0.1, v + dv + 0.02, z, r, `rgba(40,55,20,${o})`), "shadow"),
    pebble: /* @__PURE__ */ __name((du, dv, s, color) => pebble(u + du, v + dv, s, color), "pebble"),
    id: /* @__PURE__ */ __name((name) => `${prefix}-${name}`, "id")
  };
}
__name(tools, "tools");
function wheel(T, du, dv, zc, r, axis, { rim = WOOD_DARK.right, spokes = 6, turn = 0, width = 1.6 } = {}) {
  const pt = /* @__PURE__ */ __name((a) => axis === "u" ? T.p(du + r * Math.cos(a), dv, zc + 32 * r * Math.sin(a)) : T.p(du, dv + r * Math.cos(a), zc + 32 * r * Math.sin(a)), "pt");
  const ring = Array.from({ length: 20 }, (_, k) => pt(k / 20 * Math.PI * 2));
  const c = T.p(du, dv, zc);
  let out = `<polygon points="${ring.map(xy3).join(" ")}" fill="rgba(0,0,0,.08)" stroke="${rim}" stroke-width="${width}" stroke-linejoin="round"/>`;
  for (let k = 0; k < spokes; k++) out += ln2(c, pt(turn + k / spokes * Math.PI * 2), rim, 0.8);
  return out + dot2(c[0], c[1], 1.3, rim);
}
__name(wheel, "wheel");
function bucket(T, du, dv, z, h, r0, r1, colors, name, water = true) {
  const [x, y] = T.p(du, dv, z);
  const top = y - h;
  return `<defs><linearGradient id="${T.id(name)}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs><path d="M${f22(x - r1)},${f22(top)} L${f22(x - r0)},${f22(y)} A${f22(r0)},${f22(r0 / 2)} 0 0 0 ${f22(x + r0)},${f22(y)} L${f22(x + r1)},${f22(top)} Z" fill="url(#${T.id(name)})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x - r1 * 0.96)},${f22(top + h * 0.3)} A${f22(r1 * 0.96)},${f22(r1 / 2)} 0 0 0 ${f22(x + r1 * 0.96)},${f22(top + h * 0.3)}" fill="none" stroke="#3C2819" stroke-width="0.9"/><path d="M${f22(x - r0 * 1.04)},${f22(y - h * 0.22)} A${f22(r0 * 1.04)},${f22(r0 / 2)} 0 0 0 ${f22(x + r0 * 1.04)},${f22(y - h * 0.22)}" fill="none" stroke="#3C2819" stroke-width="0.9"/>` + ell2(x, top, r1, r1 / 2, colors.top, ` stroke="${OUT}" stroke-width="0.6"`) + (water ? ell2(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#4C9CC8") + ell2(x - r1 * 0.25, top, r1 * 0.3, r1 * 0.12, "rgba(255,255,255,.55)") : ell2(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#3A2A1E"));
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
function bee2(x, y, up2) {
  const w = up2 ? -1.2 : 0.4;
  return `<ellipse cx="${f22(x - 1.2)}" cy="${f22(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up2 ? -25 : -5} ${f22(x - 1.2)} ${f22(y - 2 + w)})"/><ellipse cx="${f22(x + 1.2)}" cy="${f22(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up2 ? 25 : 5} ${f22(x + 1.2)} ${f22(y - 2 + w)})"/>` + ell2(x, y, 2.5, 1.7, "#FFD24E", ' stroke="#3C2819" stroke-width="0.4"') + `<rect x="${f22(x - 0.9)}" y="${f22(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/><rect x="${f22(x + 0.7)}" y="${f22(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/>`;
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
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 4);
      const [hx, hy] = [x + 4.2, y - 27];
      return ell2(x + 1, y + 1, 7.4, 2.6, "#5A3822") + `<path d="M${f22(x - 6.5)},${f22(y + 0.8)} q2,-3.8 6.4,-3.8 q4.6,0 6.4,3.4 Z" fill="#6B4329"/><path d="M${f22(x - 3.4)},${f22(y - 7.4)} L${f22(x + 3.2)},${f22(y - 8.4)} L${f22(x + 3)},${f22(y - 1.4)} Q${f22(x)},${f22(y + 1.4)} ${f22(x - 3)},${f22(y - 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="M${f22(x - 3.4)},${f22(y - 7.4)} L${f22(x - 3)},${f22(y - 0.6)} L${f22(x - 1.8)},${f22(y - 0.2)} L${f22(x - 2)},${f22(y - 7.6)} Z" fill="${IRON.top}"/><path d="M${f22(x + 0.4)},${f22(y - 8)} L${f22(x + 3.2)},${f22(y - 8.4)} L${f22(x + 3)},${f22(y - 1.4)} Q${f22(x + 1.6)},${f22(y)} ${f22(x + 0.6)},${f22(y)} Z" fill="${IRON.right}" opacity=".55"/><rect x="${f22(x - 1.1)}" y="${f22(y - 11)}" width="2.6" height="3.4" rx="0.6" fill="${IRON.right}" transform="rotate(8 ${f22(x)} ${f22(y - 9)})"/>` + ln2([x + 0.3, y - 10.5], [hx, hy + 3.4], WOOD.right, 2) + ln2([x + 0.1, y - 10.5], [hx - 0.4, hy + 3.4], WOOD.top, 0.7) + ln2([hx - 3, hy - 0.4], [hx + 3, hy - 1.6], WOOD.right, 1.9) + ln2([hx - 3, hy - 0.4], [hx - 0.5, hy + 3.6], WOOD.right, 1.2) + ln2([hx + 3, hy - 1.6], [hx + 0.6, hy + 3.4], WOOD.right, 1.2) + `<path d="M${f22(x - 4.4)},${f22(y + 1.2)} q4.4,-2.6 8.8,0 Z" fill="#7A4E30"/>` + dot2(x + 6.6, y - 0.2, 1.2, "#6B4329") + dot2(x - 6.8, y + 1.6, 0.9, "#7A4E30");
    }, "draw")
  }]
};
var arrosoir = {
  layers: [{
    at: [0.76, 0.76],
    frame: [-14, -26, 36, 32],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 4);
      const green = { top: "#B4DDB8", left: "#73B884", right: "#4A8A5B" };
      return ell2(x + 2, y + 1.2, 9, 2.6, "rgba(40,55,20,.25)") + `<path d="M${f22(x + 4)},${f22(y - 4)} L${f22(x + 13.5)},${f22(y - 14.6)} L${f22(x + 14.6)},${f22(y - 13.4)} L${f22(x + 5)},${f22(y - 2)} Z" fill="${green.right}"/><ellipse cx="${f22(x + 14.8)}" cy="${f22(y - 15)}" rx="2.8" ry="1.8" fill="${COPPER.left}" stroke="${COPPER.right}" stroke-width="0.6" transform="rotate(-42 ${f22(x + 14.8)} ${f22(y - 15)})"/>` + [[-0.8, -0.6], [0.5, 0.4], [-0.2, 0.9], [0.9, -0.5]].map(([dx, dy]) => dot2(x + 14.8 + dx, y - 15 + dy, 0.35, COPPER.right)).join("") + T.cyl(0, 0, 4, 15, 0.085, green, "can") + `<path d="M${f22(x - 3.8)},${f22(y - 5.6)} A3.85,1.92 0 0 0 ${f22(x + 3.8)},${f22(y - 5.6)}" fill="none" stroke="${green.right}" stroke-width="0.9"/>` + ell2(x, y - 15, 2.6, 1.2, "#2F4A36") + `<path d="M${f22(x - 3.4)},${f22(y - 14)} C${f22(x - 3.6)},${f22(y - 22.5)} ${f22(x + 3.6)},${f22(y - 22.5)} ${f22(x + 3.4)},${f22(y - 14.6)}" stroke="${green.right}" stroke-width="1.6" fill="none"/><path d="M${f22(x - 3.9)},${f22(y - 12.6)} q-3.6,0.6 -3.4,4.2 q0.2,2.6 3.2,2.6" stroke="${green.right}" stroke-width="1.4" fill="none"/>` + ln2([x - 2.2, y - 13.2], [x - 2.2, y - 6.4], "rgba(255,255,255,.4)", 1.1);
    }, "draw")
  }]
};
var poulailler = {
  layers: [{
    at: { 1: [0.7, -0.78], 2: [0.68, -0.62] },
    frame: [-24, -48, 48, 56],
    back: true,
    draw: /* @__PURE__ */ __name((T) => {
      const legs = [[-0.12, -0.09], [0.12, -0.09], [-0.12, 0.09], [0.12, 0.09]].map(([a, b]) => T.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 0, 8, WOOD_DARK)).join("");
      return T.shadow(0, 0, 0.2, 0.2) + ell2(...T.p(0, 0.04, 0), 9, 3.4, STRAW.left) + ell2(...T.p(0.02, 0.06, 0), 5, 1.8, STRAW.top) + legs + T.box(-0.15, -0.12, 0.15, 0.12, 8, 22, BARN) + planksLeft(T.u - 0.15, T.u + 0.15, T.v + 0.12, 8, 22, 4.5) + planksRight(T.u + 0.15, T.v - 0.12, T.v + 0.12, 8, 22, 4.5) + T.box(0.13, 0.1, 0.155, 0.125, 8, 22, WALL, "") + T.box(-0.155, 0.1, -0.13, 0.125, 8, 22, WALL, "") + T.box(0.13, -0.125, 0.155, -0.1, 8, 22, WALL, "") + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.12, 17], [-0.02, 0.12, 17]], "#3A2A1E") + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.32, 0], [-0.02, 0.32, 0]], WOOD.top, EDGE) + [0.17, 0.22, 0.27].map((k) => ln2(T.p(-0.02, k, 9 * (1 - (k - 0.12) / 0.2)), T.p(0.08, k, 9 * (1 - (k - 0.12) / 0.2)), WOOD.right, 0.7)).join("") + T.face([[0.15, -0.07, 14], [0.15, 0, 14], [0.15, 0, 19], [0.15, -0.07, 19]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"') + T.box(0.15, 0.01, 0.22, 0.11, 10, 16, BARN) + T.face([[0.15, 0.01, 18], [0.22, 0.01, 16], [0.22, 0.11, 16], [0.15, 0.11, 18]], "#7C7F89", EDGE) + T.gable(-0.15, -0.12, 0.15, 0.12, 22, 9, { front: "#8F939D", back: "#6D717B", gable: BARN.right }, 0.04);
    }, "draw")
  }, {
    at: [0.1, 0.72],
    frame: [-30, -26, 64, 38],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const flock = [
        { du: 0, dv: 0, k: 0, color: "#C98B4E", wing: "#A86A33" },
        { du: -0.3, dv: 0.22, k: 2.1, color: "#FFFDF8", wing: "#E9DFCB" },
        { du: 0.32, dv: -0.26, k: 4.2, color: "#FFFDF8", wing: "#E9DFCB" }
      ];
      const hens = flock.map(({ du, dv, k, color, wing }, i) => {
        const a = f / n * Math.PI * 2 + k;
        const [x, y] = T.p(du + Math.sin(a) * 0.05, dv + Math.cos(a) * 0.03, 0);
        const peck = (f + i * 3) % n === 2 || (f + i * 3) % n === 3 ? 1 : 0;
        return hen(x, y, { flip: Math.cos(a) < 0, peck, step: f % 2 ? 1 : -1, color, wing });
      }).join("");
      const [cx, cy] = T.p(0.14 + wave(f, n, 0.04, 1), 0.12, 0);
      return hens + chick(cx, cy, f % 4 === 1 ? 1.2 : 0);
    }, "draw")
  }]
};
var ruche = {
  layers: [{
    at: [-0.86, 0.86],
    frame: [-18, -40, 40, 46],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      let rings = "";
      for (let k = 0; k < 5; k++) rings += ell2(x, y - 11 - k * 4, 9.6 - k * 1.5, 3.4, k % 2 ? STRAW.left : STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.7"`);
      const lavender = [[-9, 2], [-11, -1], [8, 3], [10, 0]].map(([dx, dy]) => ln2([x + dx, y + dy], [x + dx - 0.6, y + dy - 6], "#6FA35A", 0.7) + ell2(x + dx - 0.6, y + dy - 7, 0.9, 2, "#A98ADB")).join("");
      return T.shadow(0, 0, 0.16, 0.22) + lavender + T.box(-0.1, -0.08, -0.07, 0.08, 0, 7, WOOD_DARK) + T.box(0.07, -0.08, 0.1, 0.08, 0, 7, WOOD_DARK) + T.box(-0.14, -0.11, 0.14, 0.11, 7, 9, WOOD) + rings + ell2(x, y - 31, 3, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f22(x - 6)},${f22(y - 12)} q6,3 12,0" stroke="rgba(150,105,40,.5)" stroke-width="0.6" fill="none"/><path d="M${f22(x - 2.8)},${f22(y - 9.4)} a2.8,2.4 0 0 1 5.6,0 Z" fill="#3A2A1E"/>`;
    }, "draw")
  }, {
    at: [-0.86, 0.86],
    frame: [-22, -48, 46, 40],
    n: 8,
    fps: 10,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 22);
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
    draw: /* @__PURE__ */ __name((T) => {
      const rim = [[-0.16, -0.12], [0.12, -0.12], [0.12, 0.12], [-0.16, 0.12]].map(([a, b]) => T.p(a, b, 14));
      const base = [[-0.11, -0.085], [0.08, -0.085], [0.08, 0.085], [-0.11, 0.085]].map(([a, b]) => T.p(a, b, 7));
      const [sx, sy] = T.p(-0.02, 0, 14.5);
      const handle = /* @__PURE__ */ __name((s) => ln2(T.p(-0.15, 0.1 * s, 12.5), T.p(-0.38, 0.11 * s, 9), WOOD.right, 1.7) + ln2(T.p(-0.15, 0.1 * s, 13.1), T.p(-0.38, 0.11 * s, 9.6), WOOD.top, 0.6), "handle");
      const leg = /* @__PURE__ */ __name((s) => ln2(T.p(-0.08, 0.07 * s, 7.4), T.p(-0.1, 0.08 * s, 0), DARK_IRON.right, 1.3), "leg");
      return T.shadow(-0.06, 0, 0.22, 0.2) + handle(-1) + leg(-1) + ln2(T.p(0.06, -0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1) + poly2(rim, "#3A2A1E") + ell2(sx, sy, 7.6, 3.2, "#6B4329") + ell2(sx - 1.6, sy - 0.8, 4.6, 1.8, "#7A4E30") + carrot(sx - 6, sy - 1.4, -12) + carrot(sx - 4, sy + 0.8, 8) + carrot(sx + 4.6, sy + 1.2, 196) + dot2(sx + 2.6, sy - 2.2, 3.2, "#79BE5C") + `<path d="M${f22(sx + 0.4)},${f22(sy - 2.6)} q2.2,-2.4 4.4,0 M${f22(sx + 1)},${f22(sy - 1.2)} q1.6,-1.4 3.2,0" stroke="#A6D98A" stroke-width="0.7" fill="none"/>` + dot2(sx - 1.4, sy - 2.6, 1.3, "#E86A8A") + dot2(sx + 0.4, sy + 1.2, 1.2, "#E86A8A") + poly2([base[3], base[2], rim[2], rim[3]], RED_PAINT.left, ` stroke="${OUT}" stroke-width="0.6"`) + poly2([base[1], base[2], rim[2], rim[1]], RED_PAINT.right, ` stroke="${OUT}" stroke-width="0.6"`) + `<polyline points="${[rim[1], rim[2], rim[3]].map(xy3).join(" ")}" fill="none" stroke="${RED_PAINT.top}" stroke-width="1.2" stroke-linejoin="round"/>` + wheel(T, 0.18, 0, 5, 0.06, "u", { rim: "#3D3A36", spokes: 6, width: 1.9 }) + ln2(T.p(0.06, 0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1) + leg(1) + handle(1);
    }, "draw")
  }]
};
var CROW = { body: "#33303A", breast: "#4A4652", wing: "#22202A", flip: true };
var flying = /* @__PURE__ */ __name((x, y, up2) => `<path d="M${f22(x - 4.4)},${f22(y + (up2 ? -2 : 1))} Q${f22(x - 2)},${f22(y - (up2 ? 2.6 : 0.4))} ${f22(x)},${f22(y)} Q${f22(x + 2)},${f22(y - (up2 ? 2.6 : 0.4))} ${f22(x + 4.4)},${f22(y + (up2 ? -2 : 1))}" stroke="${CROW.body}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(x, y + 0.2, 1, CROW.body), "flying");
var epouvantail = {
  layers: [{
    at: [-0.88, 0.2],
    frame: [-26, -54, 52, 60],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const sway = wave(f, n, 1);
      const sy = y - 27;
      const tuft3 = /* @__PURE__ */ __name((cx, cy, s) => [-1, 0, 1].map((k) => ln2([cx, cy + k * 1.1], [cx + s * (3 + Math.abs(k) * 0.4), cy + k * 1.9 + sway * 0.8], STRAW.right, 0.8)).join(""), "tuft");
      const legTuft = /* @__PURE__ */ __name((cx) => [-1, 0, 1].map((k) => ln2([cx + k * 0.8, y - 6], [cx + k * 1.6, y - 2.8], STRAW.right, 0.8)).join(""), "legTuft");
      const crow = f >= 2 && f <= 6 ? bird(x + 9.4, sy - 0.4, { ...CROW, peck: f === 4 ? 1 : 0 }) : flying(x + (f === 7 ? 17 : f === 0 ? 20 : 14), sy - (f === 7 ? 9 : f === 0 ? 14 : 6), f !== 0);
      return ell2(x + 1, y + 0.4, 6, 1.8, "rgba(40,55,20,.25)") + `<rect x="${f22(x - 1)}" y="${f22(y - 40)}" width="2.2" height="40" fill="${WOOD_DARK.left}"/><rect x="${f22(x + 0.2)}" y="${f22(y - 40)}" width="1" height="40" fill="${WOOD_DARK.right}"/>` + legTuft(x - 2.4) + legTuft(x + 2.4) + `<path d="M${f22(x - 4.4)},${f22(y - 16)} L${f22(x + 4.4)},${f22(y - 16)} L${f22(x + 4)},${f22(y - 6)} L${f22(x + 0.8)},${f22(y - 6)} L${f22(x)},${f22(y - 11)} L${f22(x - 0.8)},${f22(y - 6)} L${f22(x - 4)},${f22(y - 6)} Z" fill="#5C83C2" stroke="${OUT}" stroke-width="0.5"/><rect x="${f22(x + 1.3)}" y="${f22(y - 13.4)}" width="2.2" height="2.4" fill="#E2C66E" transform="rotate(8 ${f22(x + 2.4)} ${f22(y - 12.2)})"/><rect x="${f22(x - 13)}" y="${f22(sy - 0.4)}" width="26" height="4" rx="1.6" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(x - 5)},${f22(sy)} L${f22(x + 5)},${f22(sy)} L${f22(x + 4.6)},${f22(y - 15)} L${f22(x - 4.6)},${f22(y - 15)} Z" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/>` + [-10, -7, -2.6, 0, 2.6, 7, 10].map((dx) => ln2([x + dx, sy + (Math.abs(dx) > 5 ? 0 : 0.6)], [x + dx, Math.abs(dx) > 5 ? sy + 3.4 : y - 15.4], "rgba(110,30,25,.5)", 0.6)).join("") + [sy + 1.8, sy + 6, sy + 9.4].map((ly, k) => ln2([x - (k ? 4.8 : 12.6), ly], [x + (k ? 4.8 : 12.6), ly], "rgba(255,214,120,.55)", 0.6)).join("") + ln2([x - 4.7, y - 16], [x + 4.7, y - 16], "#C9A16A", 1.1) + tuft3(x - 13, sy + 1.6, -1) + tuft3(x + 13, sy + 1.6, 1) + ln2([x - 2.4, sy - 0.6], [x + 2.4, sy - 0.6], "#C9A16A", 1) + ell2(x, sy - 5, 4.6, 5, "#E7C99A", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(x - 2.8)},${f22(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6 M${f22(x + 1.2)},${f22(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6" stroke="#3A2A1E" stroke-width="0.7"/><path d="M${f22(x - 2.6)},${f22(sy - 3)} q2.6,1.8 5.2,0" stroke="#3A2A1E" stroke-width="0.6" fill="none" stroke-dasharray="0.9 0.6"/><g transform="rotate(${f22(-6 + sway * 3)} ${f22(x)} ${f22(sy - 9)})">` + ell2(x, sy - 8.6, 8.6, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f22(x - 4.4)},${f22(sy - 9)} q0.4,-5.4 4.4,-5.4 q4,0 4.4,5.4 Z" fill="${STRAW.left}" stroke="${STRAW.right}" stroke-width="0.6"/><path d="M${f22(x - 4.3)},${f22(sy - 10.6)} q4.3,1.4 8.6,0" stroke="#C8504A" stroke-width="1.3" fill="none"/></g>` + crow;
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 9);
      return T.shadow(0, 0, 0.16, 0.22) + T.box(-0.11, -0.09, 0.11, 0.09, 0, 6, STONE) + T.box(-0.07, -0.06, 0.08, 0.06, 6, 9, STONE) + T.pebble(0.15, 0.08, 2.2) + T.pebble(-0.14, 0.12, 1.8) + ln2([x - 1, y - 1], [x - 10, y - 21], WOOD.right, 2.3) + ln2([x - 1.4, y - 1], [x - 10.4, y - 21], WOOD.top, 0.7) + ln2([x - 8.6, y - 18], [x - 10.4, y - 21.6], "#5E3A22", 2.8) + `<path d="M${f22(x - 9)},${f22(y + 1)} Q${f22(x - 2)},${f22(y - 7)} ${f22(x + 7)},${f22(y + 2)}" stroke="${DARK_IRON.left}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${f22(x - 8.6)},${f22(y)} Q${f22(x - 2)},${f22(y - 7.6)} ${f22(x + 6.4)},${f22(y + 1)}" stroke="${IRON.top}" stroke-width="1" fill="none" stroke-linecap="round"/><rect x="${f22(x - 3.2)}" y="${f22(y - 5.6)}" width="3.6" height="3.4" rx="0.8" fill="${DARK_IRON.right}" transform="rotate(-25 ${f22(x - 1.4)} ${f22(y - 4)})"/>` + T.box(0.02, 0, 0.1, 0.06, 6, 9, STONE) + `<path d="M${f22(x + 3)},${f22(y + 1.5)} l2,-1.2 l1.2,1.4 Z" fill="${STONE.right}"/>`;
    }, "draw")
  }]
};
var wagonnet = {
  layers: [{
    at: [0.76, 0.8],
    frame: [-24, -28, 48, 36],
    draw: /* @__PURE__ */ __name((T) => {
      let track = "";
      for (const du of [-0.18, 0, 0.18]) track += T.box(du - 0.025, -0.13, du + 0.025, 0.13, 0, 1.4, WOOD_DARK);
      track += ln2(T.p(-0.24, -0.07, 1.4), T.p(0.24, -0.07, 1.4), "#7C8894", 1.2) + ln2(T.p(-0.24, 0.07, 1.4), T.p(0.24, 0.07, 1.4), "#7C8894", 1.2);
      const l0 = T.p(-0.13, 0.085, 5);
      const r0 = T.p(0.13, 0.085, 5);
      const l1 = T.p(-0.17, 0.115, 15);
      const r1 = T.p(0.17, 0.115, 15);
      const top = [T.p(-0.17, -0.115, 15), T.p(0.17, -0.115, 15), r1, l1];
      const ore = [[-0.08, -0.02, 2.8, IRON], [0.04, -0.05, 2.6, IRON], [0, 0.04, 3, STONE], [0.09, 0.03, 2.2, IRON], [-0.1, 0.05, 2.2, STONE]].map(([a, b, s, c]) => stone(...T.p(a, b, 16), s, c)).join("");
      const [gx, gy] = T.p(0.02, -0.01, 19);
      return T.shadow(0, 0, 0.2, 0.2) + track + wheel(T, -0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + wheel(T, 0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + poly2([l0, r0, r1, l1], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`) + poly2([r0, T.p(0.13, -0.085, 5), T.p(0.17, -0.115, 15), r1], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON.top}" stroke-width="0.9"`) + ore + `<path d="M${f22(gx)},${f22(gy - 2)} l1.6,2 l-1.6,2 l-1.6,-2 Z" fill="#F2C04B"/>` + dot2(gx - 0.4, gy - 0.6, 0.5, "#FFFFFF") + [0.25, 0.5, 0.75].map((k) => dot2(l1[0] + (r1[0] - l1[0]) * k, l1[1] + (r1[1] - l1[1]) * k + 1.6, 0.55, IRON.right)).join("") + wheel(T, -0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 }) + wheel(T, 0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 });
    }, "draw")
  }]
};
var LANTERN_AT = [-0.86, 0.5];
var lanterneMine = {
  light: /* @__PURE__ */ __name(() => [LANTERN_AT[0] + 0.2, LANTERN_AT[1], 24, 22], "light"),
  layers: [{
    at: LANTERN_AT,
    frame: [-12, -44, 34, 50],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, 0, 0.08, 0.2) + T.pebble(-0.04, 0.06, 2.4) + T.pebble(0.05, 0.05, 2) + T.box(-0.025, -0.025, 0.025, 0.025, 0, 37, WOOD_DARK) + T.box(-0.02, -0.018, 0.24, 0.018, 34, 37, WOOD) + ln2(T.p(0, 0, 25), T.p(0.11, 0, 35), WOOD_DARK.right, 1.4) + ln2(T.p(0.2, 0, 34), T.p(0.2, 0, 32), "#3D3A36", 1), "draw")
  }, {
    at: LANTERN_AT,
    frame: [-2, -40, 24, 26],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [hx, hy] = T.p(0.2, 0, 32);
      return `<g transform="rotate(${f22(wave(f, n, 7))} ${f22(hx)} ${f22(hy)})">` + ln2([hx, hy], [hx, hy + 3], "#3D3A36", 0.8) + `<path d="M${f22(hx - 3.2)},${f22(hy + 5)} L${f22(hx - 1.6)},${f22(hy + 3)} L${f22(hx + 1.6)},${f22(hy + 3)} L${f22(hx + 3.2)},${f22(hy + 5)} Z" fill="#3D3A36"/><rect x="${f22(hx - 3)}" y="${f22(hy + 5)}" width="6" height="7.4" fill="#FFE08A"/><rect x="${f22(hx + 0.4)}" y="${f22(hy + 5)}" width="2.6" height="7.4" fill="#E9BF4E"/>` + ell2(hx - 0.4, hy + 8.6, 1.3, 1.9, "#FFFDF0") + `<path d="M${f22(hx - 3)},${f22(hy + 5)} v7.4 M${f22(hx)},${f22(hy + 5)} v7.4 M${f22(hx + 3)},${f22(hy + 5)} v7.4" stroke="#3D3A36" stroke-width="0.7"/><rect x="${f22(hx - 3.6)}" y="${f22(hy + 12.2)}" width="7.2" height="1.6" rx="0.5" fill="#3D3A36"/></g>`;
    }, "draw")
  }]
};
var rails = {
  layers: [{
    at: [-0.35, 0.88],
    frame: [-18, -16, 36, 26],
    draw: /* @__PURE__ */ __name((T) => {
      let out = "";
      for (const dv of [-0.06, 0.04]) out += T.box(-0.15, dv - 0.02, 0.15, dv + 0.02, 0, 1.5, WOOD_DARK);
      out += ln2(T.p(-0.1, -0.08, 1.5), T.p(-0.1, 0.06, 1.5), "#7C8894", 1.2) + ln2(T.p(0.1, -0.08, 1.5), T.p(0.1, 0.06, 1.5), "#7C8894", 1.2);
      return out + T.box(-0.14, 0.06, -0.1, 0.1, 0, 9, WOOD_DARK) + T.box(0.1, 0.06, 0.14, 0.1, 0, 9, WOOD_DARK) + T.box(-0.15, 0.05, 0.15, 0.09, 6, 10, { top: "#F2EDE2", left: "#E2574C", right: "#B13A31" }) + [-0.07, 0.03].map((du) => T.face([[du, 0.09, 6], [du + 0.04, 0.09, 6], [du + 0.04, 0.09, 10], [du, 0.09, 10]], "#FFFDF8")).join("");
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const turn = f / n * (Math.PI / 2);
      const top = [T.p(-0.1, -0.13, 13), T.p(0.1, -0.13, 13), T.p(0.1, 0.13, 13), T.p(-0.1, 0.13, 13)];
      const ore = [[-0.03, -0.06, 2.4, IRON], [0.03, 0, 2.6, STONE], [-0.02, 0.06, 2.2, IRON]].map(([a, b, s, c]) => stone(...T.p(a, b, 14), s, c)).join("");
      return T.shadow(0, 0, 0.14, 0.2, 1.5) + T.box(-0.075, -0.1, 0.075, 0.1, 4, 6, DARK_IRON) + T.face([[-0.075, 0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [-0.1, 0.13, 13]], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`) + T.face([[0.075, -0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [0.1, -0.13, 13]], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON.top}" stroke-width="0.9"`) + ore + wheel(T, 0.09, -0.06, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn }) + wheel(T, 0.09, 0.07, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn });
    }, "draw")
  }]
};
var casque = {
  layers: [{
    at: [-0.1, 0.94],
    frame: [-20, -32, 40, 38],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 12);
      const [rx, ry] = T.p(0.17, 0.06, 0);
      const [gx, gy] = T.p(-0.03, 0.15, 4);
      return T.shadow(0, 0, 0.16, 0.2) + T.box(-0.09, -0.08, 0.09, 0.08, 0, 12, WOOD) + ln2(T.p(-0.08, 0.08, 1), T.p(0.08, 0.08, 11), WOOD_DARK.right, 1.1) + ln2(T.p(0.09, -0.07, 1), T.p(0.09, 0.07, 11), WOOD_DARK.right, 1.1) + [0, 1, 2].map((k) => ell2(rx, ry - k * 1.4, 4.8 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ln2([rx + 4, ry - 3], [rx + 7, ry - 1], "#C9A16A", 1.1) + ell2(gx, gy, 2.8, 3.6, CAST.left, ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 0.8, gy - 1, 1, 1.6, CAST.top) + `<rect x="${f22(gx - 0.8)}" y="${f22(gy - 5.4)}" width="1.6" height="1.8" fill="#8B5631"/>` + gradient(T.id("hat"), "#FFD866", "#D9952A") + ell2(x, y + 0.4, 8.6, 2.8, "rgba(60,40,25,.5)") + ell2(x, y - 0.4, 8.2, 2.8, "#D99A2B", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(x - 6)},${f22(y - 0.8)} C${f22(x - 6.4)},${f22(y - 10.4)} ${f22(x + 6.4)},${f22(y - 10.4)} ${f22(x + 6)},${f22(y - 0.8)} Z" fill="url(#${T.id("hat")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x + 0.4)},${f22(y - 7.8)} q0.6,3.6 0.4,7" stroke="#C88A20" stroke-width="1.6" fill="none"/><rect x="${f22(x - 5.8)}" y="${f22(y - 6.6)}" width="3.8" height="3.6" rx="0.8" fill="${DARK_IRON.left}"/>` + ell2(x - 4.6, y - 4.8, 1.5, 1.5, "#FFF3B8") + dot2(x - 5, y - 5.3, 0.5, "#FFFFFF");
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x - 2;
      const cy = y - 10;
      const [hx, hy] = T.p(0.13, 0.1, 0);
      const prism = /* @__PURE__ */ __name((px, py, h, w, c) => poly2([[px - w, py], [px - w, py - h], [px, py - h - w], [px, py]], c.left) + poly2([[px, py], [px, py - h - w], [px + w, py - h], [px + w, py]], c.right), "prism");
      const twinkle = [[-4, -4], [3, -2], [-1, 3]].map(([dx, dy], k) => star(cx + dx, cy + dy, 1.8, "#FFFFFF", Math.max(0, wave(f, n, 1, k * 2.1)))).join("");
      return ell2(x + 1, y + 0.6, 15, 4.4, "rgba(40,55,20,.24)") + gradient(T.id("shell"), STONE.left, STONE.right) + `<path d="M${f22(cx - 12)},${f22(cy + 2)} Q${f22(cx - 13)},${f22(cy - 9)} ${f22(cx - 2)},${f22(cy - 11)} Q${f22(cx + 11)},${f22(cy - 12)} ${f22(cx + 12.4)},${f22(cy)} Q${f22(cx + 12)},${f22(cy + 9)} ${f22(cx)},${f22(cy + 10)} Q${f22(cx - 11)},${f22(cy + 10)} ${f22(cx - 12)},${f22(cy + 2)} Z" fill="url(#${T.id("shell")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(cx - 8.6)},${f22(cy)} Q${f22(cx - 8)},${f22(cy - 7.6)} ${f22(cx + 1)},${f22(cy - 7.2)} Q${f22(cx + 9.6)},${f22(cy - 6.6)} ${f22(cx + 9)},${f22(cy + 0.6)} Q${f22(cx + 8)},${f22(cy + 7)} ${f22(cx)},${f22(cy + 6.8)} Q${f22(cx - 8.4)},${f22(cy + 6)} ${f22(cx - 8.6)},${f22(cy)} Z" fill="#3B2550" stroke="#D9D2C6" stroke-width="1"/>` + crystals(cx + 0.6, cy - 0.2, 7.8, 6.2, 16, 0.2) + prism(cx - 2.4, cy + 4, 6, 1.6, { left: "#C8A4F7", right: "#8A5CD4" }) + prism(cx + 1, cy + 4.6, 8.4, 2, { left: "#DCC6FF", right: "#9A6AE0" }) + prism(cx + 4, cy + 4, 5, 1.4, { left: "#B98CF2", right: "#7F52C8" }) + twinkle + ell2(hx, hy - 1, 7.4, 3.8, STONE.right, ` stroke="${OUT}" stroke-width="0.5"`) + ell2(hx, hy - 1.8, 6.6, 3.2, "#E9E2D6") + ell2(hx, hy - 1.8, 5.8, 2.7, "#4A2E66") + crystals(hx, hy - 1.8, 5.4, 2.4, 12, 0.5);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const b = wave(f, n, 0.7);
      const glowing = 0.55 + wave(f, n, 0.45, 1);
      const sw = wave(f, n, 0.014);
      const rune2 = `rgba(130,235,255,${f22(glowing)})`;
      const moss = /* @__PURE__ */ __name((du, dv, z, r) => T.disc(du, dv, z, r, "#6DB64C") + T.disc(du - 8e-3, dv - 8e-3, z + 0.6, r * 0.6, "#8FCB6A"), "moss");
      const arm = /* @__PURE__ */ __name((u0, u1, s) => T.box(u0, -0.05 + s, u1, 0.05 + s, 9 + b, 25 + b, ROCK) + T.box(u0 - 0.015, -0.065 + s, u1 + 0.015, 0.065 + s, 1 + b, 10 + b, ROCK), "arm");
      const shoulder = /* @__PURE__ */ __name((du, k) => {
        const [px, py] = T.p(du, 0, 26 + b);
        return stone(px, py, 4.6 + k, ROCK);
      }, "shoulder");
      const eye = /* @__PURE__ */ __name((du) => {
        const [ex, ey] = T.p(du, 0.07, 30 + b);
        return ell2(ex, ey, 1.5, 1, rune2) + dot2(ex, ey, 0.5, "#F2FFFF");
      }, "eye");
      const ring = Array.from({ length: 16 }, (_, k) => T.p(Math.cos(k / 16 * Math.PI * 2) * 0.06, 0.09, 17 + b + Math.sin(k / 16 * Math.PI * 2) * 4.6));
      return T.shadow(0, 0, 0.28, 0.24) + T.pebble(0.26, 0.14, 2.4) + T.pebble(-0.24, 0.18, 1.8) + arm(-0.25, -0.155, sw) + T.box(-0.11, -0.05, -0.02, 0.05, 0, 9, ROCK) + T.box(0.02, -0.05, 0.11, 0.05, 0, 9, ROCK) + T.box(-0.15, -0.09, 0.15, 0.09, 8 + b, 27 + b, ROCK) + ln2(T.p(-0.12, 0.09, 24 + b), T.p(-0.07, 0.09, 20 + b), "rgba(60,50,40,.35)", 0.6) + ln2(T.p(0.15, -0.05, 12 + b), T.p(0.15, 0.03, 17 + b), "rgba(60,50,40,.35)", 0.6) + `<polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="rgba(130,235,255,${f22(glowing * 0.35)})" stroke-width="2.4"/><polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="${rune2}" stroke-width="0.9"/>` + ln2(T.p(0, 0.09, 12 + b), T.p(0, 0.09, 22 + b), rune2, 0.9) + ln2(T.p(-0.04, 0.09, 14 + b), T.p(0.04, 0.09, 20 + b), rune2, 0.8) + shoulder(-0.13, 0) + T.box(-0.065, -0.05, 0.065, 0.07, 26 + b, 34 + b, ROCK) + eye(-0.032) + eye(0.028) + ln2(T.p(-0.03, 0.07, 27.4 + b), T.p(0.025, 0.07, 27 + b), "rgba(60,50,40,.45)", 0.7) + shoulder(0.14, 0.4) + arm(0.155, 0.25, -sw) + moss(-0.03, 0, 34 + b, 0.05) + moss(0.17, 0, 25 + b, 0.035) + moss(-0.11, -0.04, 27 + b, 0.035) + dot2(...T.p(-0.02, 0.01, 35.4 + b), 0.9, "#F7A8C8");
    }, "draw")
  }]
};
var hache = {
  layers: [{
    at: [-0.42, 0.84],
    frame: [-24, -32, 46, 38],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 9);
      const log2 = /* @__PURE__ */ __name((a, b, z) => T.box(a, b, a + 0.2, b + 0.065, z, z + 4.6, BARK) + ell2(...T.p(a + 0.2, b + 0.032, z + 2.3), 1.1, 1.6, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T.shadow(-0.1, 0.04, 0.2, 0.2) + log2(-0.36, -0.06, 0) + log2(-0.36, 0.01, 0) + log2(-0.36, 0.08, 0) + log2(-0.34, -0.025, 4.6) + log2(-0.34, 0.045, 4.6) + T.cyl(0, 0, 0, 9, 0.11, STUMP, "block") + ell2(x, y, 3.4, 1.7, "none", ' stroke="#B98552" stroke-width="0.6"') + ell2(x, y, 1.4, 0.7, "none", ' stroke="#B98552" stroke-width="0.5"') + [-3, 0, 3].map((dx) => ln2([x + dx, y + 1.6], [x + dx + 0.4, y + 8], "rgba(60,40,25,.5)", 0.6)).join("") + ln2([x + 0.6, y - 1.6], [x + 9.5, y - 17], WOOD.right, 2) + ln2([x + 0.3, y - 1.8], [x + 9.2, y - 17.2], WOOD.top, 0.6) + `<path d="M${f22(x - 3.2)},${f22(y + 0.6)} L${f22(x + 3.6)},${f22(y - 1.2)} L${f22(x + 2.6)},${f22(y - 4.8)} L${f22(x - 2.2)},${f22(y - 4.6)} Q${f22(x - 4.4)},${f22(y - 2)} ${f22(x - 3.2)},${f22(y + 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="M${f22(x - 3.2)},${f22(y + 0.6)} Q${f22(x - 4.4)},${f22(y - 2)} ${f22(x - 2.2)},${f22(y - 4.6)}" stroke="${IRON.top}" stroke-width="0.8" fill="none"/>` + [[6, 3], [-5, 4], [8, 1], [3, 5]].map(([dx, dy]) => `<path d="M${f22(x + dx)},${f22(y + 9 + dy)} l1.6,-0.6 l0.4,0.9 Z" fill="#E7C08A"/>`).join("");
    }, "draw")
  }]
};
var scie = {
  layers: [{
    at: [0.78, -0.74],
    frame: [-26, -34, 52, 40],
    draw: /* @__PURE__ */ __name((T) => {
      const leg = /* @__PURE__ */ __name((du, s) => ln2(T.p(du, -0.09 * s, 0), T.p(du, 0.09 * s, 14), WOOD_DARK.right, 2), "leg");
      const [b0x, b0y] = T.p(0.02, -0.13, 15);
      const [b1x, b1y] = T.p(0.02, 0.13, 15);
      const teeth = Array.from({ length: 9 }, (_, k) => `${k ? "L" : "M"}${f22(b0x + (b1x - b0x) * k / 8)},${f22(b0y + (b1y - b0y) * k / 8 + (k % 2 ? 1 : 0))}`).join(" ");
      const [dx, dy] = T.p(0.03, 0.02, 0);
      return T.shadow(0, 0, 0.24, 0.18) + ell2(dx, dy, 6, 2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + leg(-0.15, 1) + leg(-0.15, -1) + T.box(-0.26, -0.055, 0.24, 0.055, 12, 19, BARK) + ell2(...T.p(0.24, 0, 15.5), 1.6, 2.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + leg(0.15, 1) + leg(0.15, -1) + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>` + ln2([b0x, b0y], [b1x, b1y], IRON.left, 1.4) + ln2([b0x, b0y], [b0x + 1.5, b0y - 14], WOOD.right, 1.6) + ln2([b1x, b1y], [b1x + 1.5, b1y - 14], WOOD.right, 1.6) + ln2([b0x + 0.8, b0y - 7], [b1x + 0.8, b1y - 7], WOOD.left, 1.2) + ln2([b0x + 1.5, b0y - 14], [b1x + 1.5, b1y - 14], "#C9A16A", 0.7, ' stroke-dasharray="1 0.8"') + T.cyl(-0.3, 0.12, 0, 4, 0.06, STUMP, "round1") + T.cyl(-0.22, 0.16, 0, 3, 0.05, STUMP, "round2");
    }, "draw")
  }]
};
var nichoir = {
  layers: [{
    at: [0.86, 0.12],
    frame: [-14, -54, 28, 60],
    draw: /* @__PURE__ */ __name((T) => {
      const [hx, hy] = T.p(0, 0.065, 41);
      return T.shadow(0, 0, 0.08, 0.2) + T.pebble(0.04, 0.04, 2.2) + T.box(-0.02, -0.02, 0.02, 0.02, 0, 35, WOOD_DARK) + T.box(-0.07, -0.065, 0.07, 0.065, 35, 46, { top: "#FBF3DF", left: "#F3E4C4", right: "#D8C39B" }) + dot2(hx, hy, 2, "#3A2A1E") + ln2([hx, hy + 4], [hx - 2.4, hy + 5.2], WOOD_DARK.right, 1) + T.gable(-0.07, -0.065, 0.07, 0.065, 46, 8, { front: "#6FA3D9", back: "#4C7FB5", gable: "#D8C39B" }, 0.03) + `<path d="M${f22(hx - 4)},${f22(hy - 4)} l1.4,-1 l1.4,1" stroke="#F7A8C8" stroke-width="0.8" fill="none"/>`;
    }, "draw")
  }, {
    at: [0.75, 0.42],
    frame: [-26, -18, 52, 24],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [x1, y1] = T.p(-0.14, 0.05, 0);
      const [x2, y2] = T.p(0.2, -0.12, 0);
      return bird(x1 + (f >= 4 ? 2 : 0), y1, { body: "#8B6A4E", breast: "#E8743F", wing: "#6F5238", flip: f >= 4, hop: f === 3 || f === 7 ? 2.6 : 0, peck: f === 1 || f === 5 ? 1 : 0, flap: f === 3 || f === 7 ? 1 : 0 }) + bird(x2, y2, { body: "#5E92C8", breast: "#F2D35A", wing: "#456F9C", flip: f % 4 >= 2, hop: f === 6 ? 2.4 : 0, peck: f === 0 || f === 2 ? 1 : 0, flap: f === 6 ? 1 : 0 });
    }, "draw")
  }]
};
var charrette = {
  layers: [{
    at: { 1: [0.62, 0.78], 2: [0.25, 0.84] },
    frame: [-30, -34, 62, 42],
    draw: /* @__PURE__ */ __name((T) => {
      const log2 = /* @__PURE__ */ __name((dv, z) => T.box(-0.22, dv - 0.035, 0.1, dv + 0.035, z, z + 5, BARK) + ell2(...T.p(0.1, dv, z + 2.5), 1.2, 1.8, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T.shadow(-0.04, 0, 0.3, 0.18) + wheel(T, -0.08, -0.13, 9, 0.12, "u", { rim: "#5E3A22", spokes: 8, width: 2 }) + ln2(T.p(0.1, -0.09, 10), T.p(0.42, -0.09, 1), WOOD.right, 1.6) + T.box(-0.24, -0.12, 0.12, 0.12, 9, 12, WOOD) + log2(-0.07, 12) + log2(0, 12) + log2(0.07, 12) + log2(-0.035, 17) + log2(0.035, 17) + T.box(-0.24, 0.115, 0.12, 0.13, 12, 17, WOOD_DARK) + [-0.2, -0.04, 0.1].map((du) => T.box(du, 0.11, du + 0.025, 0.135, 9, 18, WOOD_DARK)).join("") + ln2(T.p(0.1, 0.09, 10), T.p(0.42, 0.09, 1), WOOD.right, 1.6) + ln2(T.p(0.1, 0.09, 10.6), T.p(0.42, 0.09, 1.6), WOOD.top, 0.6) + wheel(T, -0.08, 0.14, 9, 0.12, "u", { rim: "#4A2E1A", spokes: 8, width: 2.2 }) + T.disc(-0.08, 0.15, 9, 0.02, "#C9A16A");
    }, "draw")
  }]
};
var passePartout = {
  layers: [{
    at: [0.9, 0.62],
    frame: [-30, -32, 58, 40],
    draw: /* @__PURE__ */ __name((T) => {
      const [b0x, b0y] = T.p(0.1, -0.24, 13);
      const [b1x, b1y] = T.p(0.1, 0.26, 13);
      const sag = 2.4;
      const blade = `M${f22(b0x)},${f22(b0y)} Q${f22((b0x + b1x) / 2)},${f22((b0y + b1y) / 2 + sag)} ${f22(b1x)},${f22(b1y)} L${f22(b1x)},${f22(b1y + 3)} Q${f22((b0x + b1x) / 2)},${f22((b0y + b1y) / 2 + sag + 5)} ${f22(b0x)},${f22(b0y + 3)} Z`;
      const teeth = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        const tx = b0x + (b1x - b0x) * t;
        const ty = b0y + (b1y - b0y) * t + 3 + (sag + 2) * 4 * t * (1 - t);
        return `${k ? "L" : "M"}${f22(tx)},${f22(ty + (k % 2 ? 1.2 : 0))}`;
      }).join(" ");
      const grip = /* @__PURE__ */ __name((gx, gy) => ln2([gx, gy + 1], [gx, gy - 8], WOOD.right, 2) + ln2([gx - 0.4, gy + 1], [gx - 0.4, gy - 8], WOOD.top, 0.6) + ln2([gx - 2.2, gy - 7], [gx + 2.2, gy - 7], WOOD_DARK.right, 1.4), "grip");
      const [dx, dy] = T.p(0.05, 0.14, 0);
      return T.shadow(0, 0, 0.3, 0.18) + T.box(-0.17, -0.09, -0.11, 0.09, 0, 3, WOOD_DARK) + T.box(0.11, -0.09, 0.17, 0.09, 0, 3, WOOD_DARK) + T.box(-0.34, -0.065, 0.3, 0.065, 3, 12, BARK) + ell2(...T.p(0.3, 0, 7.5), 2.2, 3.4, "none", ' stroke="#C9935E" stroke-width="0.6"') + ell2(...T.p(0.3, 0, 7.5), 0.9, 1.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + [5.4, 8.2, 10.4].map((z, k) => ln2(T.p(-0.32 + k * 0.05, 0.065, z), T.p(0.26 - k * 0.04, 0.065, z + 0.3), "rgba(60,35,20,.3)", 0.6)).join("") + ln2(T.p(-0.3, -0.03, 12), T.p(0.26, -0.03, 12), "rgba(255,230,190,.35)", 0.8) + T.face([[0.05, 0.065, 12], [0.15, 0.065, 12], [0.1, 0.065, 7.4]], "#F1D3A1") + T.face([[0.05, -0.065, 12], [0.15, -0.065, 12], [0.15, 0.065, 12], [0.05, 0.065, 12]], "#E7C08A") + ell2(dx, dy, 6.4, 2.2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + `<path d="${blade}" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/><path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>` + ln2([b0x + 3, b0y + 0.8], [b1x - 3, b1y + 0.8], "rgba(255,255,255,.5)", 0.6) + grip(b0x, b0y) + grip(b1x, b1y);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [sx, sy] = T.p(0, 0, 8);
      const hop = f === 6 ? 2.6 : f === 7 ? 1 : 0;
      const nib = f % 2 && f < 6 ? 0.6 : 0;
      const tail = wave(f, n, 1.2);
      const x = sx - 1;
      const y = sy - 0.6 - hop;
      return T.shadow(0, 0, 0.13, 0.22) + T.cyl(0, 0, 0, 8, 0.1, STUMP, "stump") + ell2(sx, sy, 3, 1.4, "none", ' stroke="#B98552" stroke-width="0.6"') + ell2(sx, sy, 1.2, 0.6, "none", ' stroke="#B98552" stroke-width="0.5"') + acorn(...T.p(0.16, 0.06, 1.6)) + acorn(...T.p(0.1, 0.16, 1.6), 0.9) + `<path d="M${f22(x - 2)},${f22(y - 2)} C${f22(x - 9)},${f22(y - 2)} ${f22(x - 10 + tail)},${f22(y - 12)} ${f22(x - 6 + tail)},${f22(y - 17)} C${f22(x - 3 + tail)},${f22(y - 20)} ${f22(x + 1.4 + tail)},${f22(y - 16)} ${f22(x - 1 + tail * 0.6)},${f22(y - 13)} C${f22(x - 4)},${f22(y - 10)} ${f22(x - 4)},${f22(y - 5)} ${f22(x + 0.5)},${f22(y - 3)} Z" fill="#D9743A" stroke="#A9521F" stroke-width="0.5"/><path d="M${f22(x - 4)},${f22(y - 4)} C${f22(x - 8)},${f22(y - 6)} ${f22(x - 7 + tail)},${f22(y - 13)} ${f22(x - 4.6 + tail)},${f22(y - 15.6)}" stroke="#F2A266" stroke-width="1" fill="none"/>` + ell2(x + 0.6, y - 4.6, 3.6, 4.6, "#E0823F", ' stroke="rgba(120,50,20,.35)" stroke-width="0.5"') + ell2(x + 2, y - 4, 1.8, 3.2, "#F6D7B0") + ell2(x - 0.6, y - 1.6, 2.8, 1.8, "#C8662E") + dot2(x + 2.6, y - 10 + nib * 0.4, 2.8, "#E0823F") + `<path d="M${f22(x + 1.2)},${f22(y - 12)} l0.2,-3.2 l1.8,2.6 Z" fill="#C8662E"/>` + ln2([x + 1.4, y - 15.2], [x + 1, y - 16.4], "#A9521F", 0.6) + ell2(x + 3.8, y - 9 + nib * 0.4, 1.6, 1.2, "#F6D7B0") + dot2(x + 3.4, y - 10.8 + nib * 0.4, 0.65, "#1E1A17") + dot2(x + 5.2, y - 9.4 + nib * 0.4, 0.5, "#5E3A22") + acorn(x + 4.4, y - 6.6 + nib, 0.9) + ell2(x + 3.4, y - 6 + nib, 1, 0.8, "#C8662E") + ell2(x + 5.2, y - 6.2 + nib, 1, 0.8, "#C8662E");
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      return ell2(x + 3, y + 1.4, 8, 2.4, "rgba(110,190,230,.45)") + ell2(x + 1.6, y + 0.6, 6.4, 2, "rgba(40,55,20,.2)") + bucket(T, 0, 0, 0, 10, 5, 6.6, COPPER, "cb") + `<path d="M${f22(x - 6.6)},${f22(y - 10)} Q${f22(x)},${f22(y - 20)} ${f22(x + 6.6)},${f22(y - 10)}" stroke="${COPPER.right}" stroke-width="1" fill="none"/>` + dot2(x - 6.6, y - 10, 0.8, COPPER.right) + dot2(x + 6.6, y - 10, 0.8, COPPER.right) + ln2([x - 3.6, y - 7.6], [x - 3.2, y - 2.2], "rgba(255,240,220,.5)", 1);
    }, "draw")
  }]
};
var poulie = {
  layers: [{
    at: { 1: [0.44, 0], 2: [0.84, 0.32] },
    frame: [-22, -50, 40, 56],
    draw: /* @__PURE__ */ __name((T, level) => {
      if (level === 1) {
        return wheel(T, 0.02, 0, 32.5, 0.2, "v", { rim: WOOD_DARK.right, spokes: 8, width: 1.8 }) + ln2(T.p(0.02, 0, 32.5), T.p(0.1, 0, 32.5), IRON.right, 1.4) + ln2(T.p(0.1, 0, 32.5), T.p(0.1, 0, 26), WOOD.right, 1.6);
      }
      const [px, py] = T.p(-0.22, 0, 33);
      return T.shadow(0, 0, 0.08, 0.2) + T.box(-0.05, -0.05, 0.05, 0.05, 0, 3, STONE) + T.box(-0.022, -0.022, 0.022, 0.022, 3, 40, WOOD_DARK) + T.box(-0.26, -0.018, 0.02, 0.018, 37, 40, WOOD) + ln2(T.p(0, 0, 28), T.p(-0.1, 0, 38), WOOD_DARK.right, 1.3) + wheel(T, -0.22, 0, 34, 0.05, "u", { rim: IRON.right, spokes: 4, width: 1.2 }) + ln2([px + 1.6, py], [px + 1.6, py + 14], "#8A6A4A", 0.7) + bucket(T, -0.22, 0, 17, 6, 3, 3.8, PAIL, "hb");
    }, "draw")
  }]
};
var abreuvoir = {
  layers: [{
    at: [-0.78, 0.66],
    frame: [-24, -18, 48, 26],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, 0, 0.2, 0.18) + T.box(-0.18, -0.075, 0.18, 0.075, 0, 7, STONE) + T.face([[-0.15, -0.05, 6.4], [0.15, -0.05, 6.4], [0.15, 0.05, 6.4], [-0.15, 0.05, 6.4]], "#5AAED7") + ln2(T.p(-0.1, -0.02, 6.4), T.p(0.04, -0.02, 6.4), "rgba(255,255,255,.6)", 0.8) + [[-0.16, 0.08], [0.1, 0.08], [0.19, 0]].map(([a, b]) => {
      const [x, y] = T.p(a, b, 0);
      return `<path d="M${f22(x - 2)},${f22(y)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`;
    }).join(""), "draw")
  }, {
    at: [-0.5, 0.74],
    frame: [-22, -28, 38, 32],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T) => {
      const [sx, sy] = T.p(0, 0.05, 16);
      const [kx, ky] = T.p(0, 0, 29);
      return T.shadow(0, 0.06, 0.16, 0.18) + T.box(-0.12, -0.1, 0.12, 0.1, 0, 3, STONE) + T.cyl(0, 0, 3, 25, 0.055, CAST, "body") + T.cyl(0, 0, 25, 27, 0.075, CAST, "cap") + dot2(kx, ky, 1.6, CAST.left) + `<path d="M${f22(sx - 1.6)},${f22(sy - 1)} L${f22(sx - 7)},${f22(sy + 1.4)} L${f22(sx - 7)},${f22(sy + 3.4)} L${f22(sx - 1.6)},${f22(sy + 1.6)} Z" fill="${CAST.right}"/>` + bucket(T, 0, 0.24, 0, 7, 3.4, 4.4, PAIL, "pb");
    }, "draw")
  }, {
    at: PUMP_AT,
    frame: [-12, -40, 32, 46],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [px, py] = T.p(0, 0, 27);
      const a = wave(f, n, 1);
      const [sx, sy] = T.p(0, 0.05, 16);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x;
      const cy = y - 17 + wave(f, n, 1.2);
      const ripple = f % 3 / 3;
      const jet = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        return dot2(x + (k - 1) * 3 * t, y - 1 - Math.sin(t * Math.PI) * 5, 0.8, `rgba(150,215,245,${f22(1 - t * 0.6)})`);
      }).join("");
      return ell2(x, y + 0.4, 7.6, 2.8, "rgba(110,190,230,.45)") + ell2(x, y + 0.2, 4.8, 1.7, "#5AAED7") + ell2(x, y + 0.2, 3 + ripple * 5, 1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T.pebble(-0.13, 0.04, 2) + T.pebble(0.11, 0.08, 1.8) + T.pebble(0.05, -0.11, 1.5) + [[-8, 1], [7, 2]].map(([dx, dy]) => `<path d="M${f22(x + dx - 2)},${f22(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("") + jet + ell2(cx, cy + 8, 5, 1.4, "rgba(255,240,180,.3)") + `<g transform="rotate(${f22(wave(f, n, 6, 1))} ${f22(cx)} ${f22(cy)})"><path d="M${f22(cx - 7)},${f22(cy - 6)} Q${f22(cx - 3)},${f22(cy - 2)} ${f22(cx)},${f22(cy + 2)} M${f22(cx + 7)},${f22(cy - 6)} Q${f22(cx + 3)},${f22(cy - 2)} ${f22(cx)},${f22(cy + 2)} L${f22(cx)},${f22(cy + 6)}" stroke="${WOOD.right}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f22(cx - 6.6)},${f22(cy - 6.4)} Q${f22(cx - 3)},${f22(cy - 2.6)} ${f22(cx - 0.4)},${f22(cy + 1.4)}" stroke="${WOOD.top}" stroke-width="0.5" fill="none"/>` + leaf(cx + 4.6, cy - 3.8, -50, 0.28) + "</g>";
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const reed = /* @__PURE__ */ __name((dx, dy, k) => ln2([x + dx, y + dy], [x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 9 - k % 2 * 2], "#6FA35A", 0.8) + ell2(x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 8 - k % 2 * 2, 0.9, 2.2, "#8B5631"), "reed");
      const swimmers = [[0, 1.1, true], [0.8, 0.6, false], [1.4, 0.6, false]].map(([lag, s, adult]) => {
        const a = f / n * Math.PI * 2 - lag;
        return { y: y - 0.6 + Math.sin(a) * 3, svg: duck(x + Math.cos(a) * 8, y - 0.6 + Math.sin(a) * 3, s, Math.sin(a) > 0, adult) };
      }).sort((p, q) => p.y - q.y).map((p) => p.svg).join("");
      return ell2(x, y + 0.6, 16, 7.4, "#79BE5C") + ell2(x, y, 14, 6.2, "#5AAED7") + ell2(x - 3.6, y - 2, 6, 1.8, "rgba(255,255,255,.3)") + reed(-10, -3, 0) + reed(-8, -4.6, 1) + reed(8.6, -4.2, 2) + reed(10.8, -2.8, 3) + swimmers + T.pebble(0.22, 0.1, 1.8) + T.pebble(-0.16, 0.2, 1.6) + [[-12, 4], [11, 4.4]].map(([dx, dy]) => `<path d="M${f22(x + dx - 2)},${f22(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("");
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
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [wx, wy] = T.p(0, 0, 6);
      const [x, y] = T.p(0, 0, 17);
      const marble = T.id("marble");
      const [ux, uy] = [x - 5.4, y - 14.6];
      const ripple = f % 4 / 4;
      return T.shadow(0, 0, 0.24, 0.22) + T.cyl(0, 0, 0, 6, 0.22, MARBLE, "basin") + T.disc(0, 0, 6, 0.19, "#7CC8EC") + ell2(wx - 3, wy - 1, 4, 1, "rgba(255,255,255,.45)") + T.box(-0.06, -0.06, 0.06, 0.06, 6, 17, MARBLE) + gradient(marble, "#FFFFFF", "#C9C5D6") + `<path d="M${f22(x - 3.6)},${f22(y - 13)} L${f22(x + 3.4)},${f22(y - 13)} Q${f22(x + 5.4)},${f22(y - 5)} ${f22(x + 5.2)},${f22(y)} L${f22(x - 5)},${f22(y)} Q${f22(x - 5.4)},${f22(y - 6)} ${f22(x - 3.6)},${f22(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>` + [-2, 0.6, 3].map((dx) => `<path d="M${f22(x + dx * 0.6)},${f22(y - 12)} q${f22(dx * 0.3)},6 ${f22(dx * 0.8)},11.6" stroke="rgba(120,110,140,.3)" stroke-width="0.5" fill="none"/>`).join("") + `<path d="M${f22(x - 3)},${f22(y - 20)} L${f22(x + 3)},${f22(y - 20)} L${f22(x + 3.4)},${f22(y - 13)} L${f22(x - 3.6)},${f22(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/><path d="M${f22(x + 2.8)},${f22(y - 19.4)} q2.6,3 0.6,6.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + dot2(x, y - 23, 2.7, "#F4F2F8") + dot2(x + 1.6, y - 24.6, 1.6, "#E4E1EC") + `<path d="M${f22(x + 2)},${f22(y - 23)} q1.4,3 0.4,5" stroke="#DAD6E4" stroke-width="1" fill="none"/><path d="M${f22(x - 2.6)},${f22(y - 19.4)} q-2.8,1.6 -2.4,4.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/><g transform="rotate(-38 ${f22(ux)} ${f22(uy)})">${ell2(ux, uy, 2.6, 3.2, "#E4E1EC", ' stroke="rgba(90,80,110,.4)" stroke-width="0.5"')}<rect x="${f22(ux - 1.3)}" y="${f22(uy - 4.8)}" width="2.6" height="1.8" fill="#DAD6E4"/></g><path d="M${f22(ux - 3.6)},${f22(uy - 2)} Q${f22(ux - 6)},${f22(uy + 2)} ${f22(ux - 5.4)},${f22(wy - 1)}" stroke="rgba(170,225,255,.45)" stroke-width="3" fill="none"/><path d="M${f22(ux - 3.6)},${f22(uy - 2)} Q${f22(ux - 6)},${f22(uy + 2)} ${f22(ux - 5.4)},${f22(wy - 1)}" stroke="#E8F7FF" stroke-width="1.2" fill="none" stroke-dasharray="2.2 1.4" stroke-dashoffset="${f22(-f * 0.9)}"/>` + ell2(ux - 5.4, wy - 0.6, 1.6 + ripple * 4, 0.6 + ripple * 1.4, "none", ` stroke="rgba(255,255,255,${f22(0.85 - ripple * 0.75)})" stroke-width="0.6"`);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const c = CANNE[Math.min(level, 2)];
      const [bx, by] = T.p(0, 0, 10);
      const [tx, ty] = T.p(...c.tip);
      const dip = f === 5 || f === 6 ? 1.8 : wave(f, n, 0.5);
      const [ox, oy] = T.p(c.bob[0], c.bob[1], 0);
      const ripple = f % 4 / 4;
      const [px, py] = T.p(c.pail[0], c.pail[1], 10);
      return ell2(ox, oy + 0.6, 3 + ripple * 5, 1.1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.7"`) + `<path d="M${f22(tx)},${f22(ty)} Q${f22((tx + ox) / 2 + 2)},${f22((ty + oy) / 2 + 2)} ${f22(ox)},${f22(oy - 1 + dip)}" stroke="rgba(255,255,255,.8)" stroke-width="0.5" fill="none"/>` + dot2(ox, oy - 1.4 + dip, 1.9, "#E2463A") + `<path d="M${f22(ox - 1.9)},${f22(oy - 1.4 + dip)} a1.9,1.9 0 0 0 3.8,0 Z" fill="#FFFDF8"/>` + ln2([ox, oy - 3.2 + dip], [ox, oy - 4.8 + dip], "#3D3A36", 0.6) + bucket(T, c.pail[0], c.pail[1], 10, 6, 3.4, 4.2, PAIL, "pail", false) + `<path d="M${f22(px - 1)},${f22(py - 6.4)} l${f22(-2.4 + f % 2 * 1.2)},-3.4 l2.6,0.8 Z" fill="#9FB8C8"/>` + ell2(px + 1, py - 6.2, 2, 0.9, "#C7D6E0") + T.box(-0.02, -0.02, 0.02, 0.02, 10, 15, WOOD_DARK) + `<path d="M${f22(bx)},${f22(by - 3)} Q${f22((bx + tx) / 2 - 1.5)},${f22((by + ty) / 2 - 3)} ${f22(tx)},${f22(ty)}" stroke="${WOOD_DARK.right}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(bx + (tx - bx) * 0.18, by - 3 + (ty - by) * 0.16, 1.4, "#3D3A36");
    }, "draw")
  }]
};
var filet = {
  layers: [{
    at: { 1: [0.34, -0.06], 2: [0.6, -0.04] },
    frame: [-18, -24, 36, 28],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 10);
      const heap = `M${f22(x - 11)},${f22(y + 1)} Q${f22(x - 10)},${f22(y - 6)} ${f22(x - 4)},${f22(y - 7)} Q${f22(x + 1)},${f22(y - 11)} ${f22(x + 6)},${f22(y - 6)} Q${f22(x + 11)},${f22(y - 4)} ${f22(x + 10)},${f22(y + 1.5)} Q${f22(x)},${f22(y + 4.5)} ${f22(x - 11)},${f22(y + 1)} Z`;
      let mesh = "";
      for (let k = -14; k <= 14; k += 2.6) mesh += ln2([x + k - 6, y + 4], [x + k + 4, y - 11], "rgba(120,85,45,.55)", 0.5) + ln2([x + k + 6, y + 4], [x + k - 4, y - 11], "rgba(120,85,45,.55)", 0.5);
      const floats = [[-9, 0], [-4, 2.6], [2, 3], [8, 0.6]].map(([dx, dy], k) => ell2(x + dx, y + dy, 2, 1.4, k % 2 ? "#FFFDF8" : "#F08A3A", ` stroke="${OUT}" stroke-width="0.5"`)).join("");
      return ell2(x + 1, y + 2.6, 12, 3, "rgba(40,30,20,.22)") + `<defs><clipPath id="${T.id("net")}"><path d="${heap}"/></clipPath></defs><path d="${heap}" fill="#D9BC8C" stroke="#A88350" stroke-width="0.8"/><g clip-path="url(#${T.id("net")})">${mesh}<path d="M${f22(x - 8)},${f22(y - 1)} q7,-4 15,0" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none"/></g><path d="M${f22(x - 1)},${f22(y - 5.4)} q3,-2 6,0 q-3,2 -6,0 Z M${f22(x + 5)},${f22(y - 5.4)} l2,-1.6 l0,3.2 Z" fill="#B8CCD8"/>` + dot2(x + 0.6, y - 5.6, 0.4, "#2A2420") + floats;
    }, "draw")
  }]
};
var casier = {
  layers: [{
    at: [-0.84, 0.46],
    frame: [-18, -24, 40, 30],
    draw: /* @__PURE__ */ __name((T) => {
      const slatL = [-0.07, -0.025, 0.02, 0.065].map((du) => T.face([[du, 0.08, 0], [du + 0.022, 0.08, 0], [du + 0.022, 0.08, 12], [du, 0.08, 12]], WOOD.top, EDGE)).join("");
      const slatR = [-0.05, 0, 0.05].map((dv) => T.face([[0.1, dv, 0], [0.1, dv + 0.022, 0], [0.1, dv + 0.022, 12], [0.1, dv, 12]], WOOD.left, EDGE)).join("");
      const [bx, by] = T.p(0.2, 0.16, 0);
      const [rx, ry] = T.p(0.1, 0.06, 6);
      return T.shadow(0, 0, 0.14, 0.2) + T.box(-0.1, -0.08, 0.1, 0.08, 0, 12, { top: "rgba(58,42,30,.85)", left: "rgba(58,42,30,.85)", right: "rgba(40,28,20,.85)" }, "") + T.face([[-0.03, 0.08, 3], [0.04, 0.08, 3], [0.04, 0.08, 9], [-0.03, 0.08, 9]], "rgba(200,170,120,.5)") + slatL + slatR + T.box(-0.1, -0.08, 0.1, 0.08, 11, 12.5, WOOD) + [-0.04, 0.03].map((du) => T.face([[du, -0.08, 12.5], [du + 0.025, -0.08, 12.5], [du + 0.025, 0.08, 12.5], [du, 0.08, 12.5]], WOOD_DARK.top)).join("") + `<path d="M${f22(rx)},${f22(ry)} Q${f22(bx - 4)},${f22(by - 1)} ${f22(bx - 2)},${f22(by - 1)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + ell2(bx, by - 1.6, 3.4, 2.4, "#E2463A", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(bx - 3.4)},${f22(by - 1.6)} h6.8" stroke="#FFFDF8" stroke-width="1.4"/>`;
    }, "draw")
  }, {
    at: [-0.66, 0.84],
    frame: [-10, -12, 20, 15],
    n: 4,
    fps: 7,
    motion: /* @__PURE__ */ __name((t) => [0, Math.sin(t * 0.7) * 0.1, 0], "motion"),
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const rim = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.1, -0.1, 4), T.p(0.09, -0.1, 4)];
      const side = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.16, 0, 0), T.p(-0.08, 0.07, 0), T.p(0.06, 0.07, 0), T.p(0.18, 0, 0.4)];
      const phase = f / n * Math.PI * 2;
      const oar2 = /* @__PURE__ */ __name((s) => {
        const lock = T.p(0, 0.1 * s, 6);
        const lift = Math.sin(phase) > 0 ? 3 : 0;
        const blade = T.p(Math.cos(phase) * 0.09, 0.27 * s, lift);
        return ln2(lock, blade, WOOD_DARK.right, 1.2) + ell2(blade[0], blade[1], 2.6, 1, WOOD.left, ` transform="rotate(-26 ${f22(blade[0])} ${f22(blade[1])})"`) + (lift ? "" : ell2(blade[0], blade[1] + 1.4, 3.6, 1.1, "none", ' stroke="rgba(255,255,255,.7)" stroke-width="0.6"'));
      }, "oar");
      const [rx, ry] = T.p(-0.03, 0, 6);
      const lean = Math.cos(phase) * 1.2;
      return ell2(...T.p(0.01, 0.01, 0), 15, 3.4, "rgba(30,70,110,.25)") + oar2(-1) + poly2(rim, WOOD_DARK.top, ` stroke="${OUT}" stroke-width="0.7"`) + T.face([[-0.02, -0.1, 4], [0.03, -0.1, 4], [0.03, 0.1, 4], [-0.02, 0.1, 4]], WOOD.top) + `<path d="M${f22(rx - 3.2 + lean)},${f22(ry - 1)} L${f22(rx + 3.2 + lean)},${f22(ry - 1)} L${f22(rx + 2.6 + lean)},${f22(ry - 9)} L${f22(rx - 2.6 + lean)},${f22(ry - 9)} Z" fill="#5C83C2"/>` + ln2([rx - 2.4 + lean, ry - 7.4], [rx - 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + ln2([rx + 2.4 + lean, ry - 7.4], [rx + 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + dot2(rx + lean, ry - 11.2, 2.6, "#F1C9A5") + ell2(rx + lean, ry - 12.6, 5, 1.4, "#E9BF4E") + `<path d="M${f22(rx - 2.6 + lean)},${f22(ry - 12.8)} q2.6,-3.4 5.2,0 Z" fill="#E9BF4E"/>` + ln2([rx - 2.6 + lean, ry - 12.9], [rx + 2.6 + lean, ry - 12.9], "#C8504A", 0.8) + poly2(side, WOOD.left, ` stroke="${OUT}" stroke-width="0.7"`) + `<polyline points="${[T.p(0.19, 0, 2.4), T.p(0.08, 0.085, 2.2), T.p(-0.09, 0.085, 2.2), T.p(-0.18, 0, 2.6)].map(xy3).join(" ")}" fill="none" stroke="#3C2819" stroke-width="0.6"/>` + oar2(1);
    }, "draw")
  }]
};
var harpon = {
  layers: [{
    at: [0.5, -0.92],
    frame: [-26, -30, 52, 36],
    draw: /* @__PURE__ */ __name((T) => {
      const post2 = /* @__PURE__ */ __name((du) => T.box(du - 0.016, -0.016, du + 0.016, 0.016, 0, 14, WOOD_DARK) + ln2(T.p(du, 0, 14), T.p(du - 0.03, 0, 17.4), WOOD_DARK.right, 1.2) + ln2(T.p(du, 0, 14), T.p(du + 0.03, 0, 17.4), WOOD_DARK.right, 1.2), "post");
      const tip = T.p(0.32, 0, 15.6);
      const neck = T.p(0.22, 0, 15.2);
      const [cx, cy] = T.p(-0.14, 0.15, 0);
      const [fx, fy] = T.p(0.12, 0.14, 0);
      const [ex, ey] = T.p(-0.3, 0, 15.6);
      return T.shadow(0, 0.04, 0.26, 0.16) + post2(-0.15) + post2(0.13) + ln2(T.p(-0.3, 0, 15.6), neck, WOOD.right, 1.6) + ln2(T.p(-0.3, 0, 16.2), neck, WOOD.top, 0.5) + poly2([T.p(0.22, 0, 16.4), tip, T.p(0.22, 0, 14)], IRON.left, ` stroke="${IRON.right}" stroke-width="0.5"`) + ln2(T.p(0.25, 0, 15.4), T.p(0.2, 0, 19), IRON.right, 1) + ln2(T.p(0.25, 0, 15.2), T.p(0.21, 0, 12), IRON.right, 1) + `<path d="M${f22(ex)},${f22(ey)} C${f22(ex - 4)},${f22(ey + 5)} ${f22(cx - 7)},${f22(cy - 5)} ${f22(cx - 3)},${f22(cy - 2)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + [0, 1, 2].map((k) => ell2(cx, cy - k * 1.3, 5 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ell2(fx, fy - 2, 3, 2.2, "#D9A877", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(fx, fy - 2.6, 2, 1.1, "#E7C08A");
    }, "draw")
  }]
};
var pelican = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-22, -48, 40, 54],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
      const [px, py] = T.p(0, 0, 14);
      const up2 = f === 2 || f === 3;
      const pouch = f === 4 || f === 5 ? 1 : 0;
      const stretch = f === 6;
      const hx = px - 3.6;
      const hy = py - 17 - (up2 ? 2 : 0);
      const tipX = up2 ? hx - 2 : hx - 10;
      const tipY = up2 ? hy - 9 : hy + 3;
      const ripple = f % 4 / 4;
      return ell2(x, y + 0.4, 5 + ripple * 4, 1.6 + ripple * 1.2, "none", ` stroke="rgba(255,255,255,${f22(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T.cyl(0, 0, 0, 14, 0.06, WOOD, "post") + ell2(...T.p(0, 0, 9), 3.6, 1.6, "none", ' stroke="#C9A16A" stroke-width="1.2"') + ln2([px - 1.6, py - 3], [px - 1.8, py], "#E8A13A", 1) + ln2([px + 1, py - 3], [px + 1.2, py], "#E8A13A", 1) + `<path d="M${f22(px + 4)},${f22(py - 6)} l4,1.4 l-3.4,1.6 Z" fill="#D9D4CA"/>` + (stretch ? `<path d="M${f22(px + 1)},${f22(py - 9)} q5,-9 11,-8 q-3,3 -4,7 Z" fill="#E9E4DA" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/><path d="M${f22(px + 10)},${f22(py - 16.6)} q1.4,-0.4 2,0.6 l-2.6,1.8 Z" fill="#3D3A36"/>` : "") + ell2(px - 0.4, py - 6.4, 6.4, 4.6, "#F4F1EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.5"') + ell2(px + 0.6, py - 6.6, 4.8, 2.8, "#DEDAD0") + `<path d="M${f22(px + 3.6)},${f22(py - 5.4)} l2.4,0.6 l-2.2,1.2 Z" fill="#3D3A36"/><path d="M${f22(px - 4)},${f22(py - 9)} Q${f22(px - 7)},${f22(py - 13)} ${f22(hx + 0.4)},${f22(hy + 1.6)}" stroke="#F4F1EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + dot2(hx, hy, 2.8, "#F4F1EA") + `<path d="M${f22(hx + 0.6)},${f22(hy - 2.6)} q2.4,-1.6 3.4,0.4" stroke="#F2D35A" stroke-width="1" fill="none"/><path d="M${f22(hx - 1.6)},${f22(hy + 0.6)} Q${f22((hx + tipX) / 2)},${f22((hy + tipY) / 2 + 3 + pouch * 4)} ${f22(tipX)},${f22(tipY + 0.6)} L${f22(tipX + 0.4)},${f22(tipY)} Z" fill="#F2B04A" stroke="#C88A20" stroke-width="0.5"/>` + ln2([hx - 1.4, hy - 0.4], [tipX, tipY], "#E8A13A", 1.4) + (f === 2 ? `<path d="M${f22(tipX - 0.6)},${f22(tipY - 0.6)} l-2,-1.8 l0.6,2.6 Z" fill="#9FB8C8"/>` : "") + dot2(hx - 0.6, hy - 0.8, 0.6, "#2A2420");
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T) => {
      const legs = [[-0.14, -0.065], [0.14, -0.065], [-0.14, 0.065], [0.14, 0.065]].map(([a, b]) => T.box(a - 0.016, b - 0.016, a + 0.016, b + 0.016, 0, 11, WOOD_DARK)).join("");
      const [x, y] = T.p(0, 0, 14);
      const curl = /* @__PURE__ */ __name((dx, dy, w) => `<path d="M${f22(x + dx)},${f22(y + dy - 1)} a1.2,1 0 1 1 1.2,1" stroke="#E7C08A" stroke-width="${w}" fill="none"/>`, "curl");
      return T.shadow(0, 0, 0.22, 0.18) + legs + T.box(-0.13, -0.05, 0.13, 0.05, 3, 4.5, WOOD_DARK) + T.box(-0.1, -0.035, 0.06, 0.035, 4.5, 7, { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" }) + T.box(-0.17, -0.08, 0.17, 0.08, 11, 14, { top: "#EBC08A", left: WOOD.left, right: WOOD.right }) + T.box(0.13, 0.05, 0.19, 0.1, 9, 15.5, DARK_IRON) + ln2(T.p(0.16, 0.1, 12), T.p(0.16, 0.18, 12), IRON.top, 0.9) + T.box(-0.08, -0.03, 0, 0.01, 14, 16.5, WOOD) + T.face([[-0.05, -0.03, 16.5], [-0.035, -0.03, 16.5], [-0.035, 0.01, 18], [-0.05, 0.01, 18]], IRON.right) + ln2([x + 2, y - 0.6], [x + 9, y - 3.6], WOOD.right, 1.3) + `<rect x="${f22(x + 1)}" y="${f22(y - 2.6)}" width="3.6" height="2.2" rx="0.4" fill="${DARK_IRON.left}" transform="rotate(-22 ${f22(x + 2.8)} ${f22(y - 1.5)})"/>` + curl(-8, 1, 0.6) + curl(-5, 3, 0.6) + curl(4, 2.2, 0.6) + curl(-10, 15, 0.7) + curl(6, 16, 0.7) + curl(11, 14, 0.7);
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
    draw: /* @__PURE__ */ __name((T) => {
      const steel = { top: "#9AA6B2", left: "#6E7A86", right: "#4F5A64" };
      const [hx, hy] = T.p(-0.13, 0.11, 0);
      const [bx, by] = T.p(0, 0.12, 0);
      return T.shadow(0, 0, 0.17, 0.2) + T.cyl(0, 0, 0, 9, 0.12, STUMP, "stump") + [-4, -1, 2, 5].map((dx) => ln2([bx + dx, by - 1], [bx + dx * 0.95, by - 8], "rgba(60,40,25,.5)", 0.6)).join("") + T.box(-0.07, -0.05, 0.07, 0.05, 9, 11, DARK_IRON) + T.box(-0.035, -0.03, 0.035, 0.03, 11, 15, DARK_IRON) + T.box(-0.11, -0.05, 0.08, 0.05, 15, 18.5, steel) + T.face([[0.08, 0.05, 15], [0.18, 0, 17.4], [0.08, 0.05, 18.5]], steel.left, EDGE) + T.face([[0.08, -0.05, 18.5], [0.18, 0, 17.6], [0.08, 0.05, 18.5]], steel.top, EDGE) + T.face([[0.08, -0.05, 15], [0.18, 0, 17.4], [0.08, -0.05, 18.5]], steel.right) + ln2(T.p(-0.09, -0.02, 18.6), T.p(0.06, -0.02, 18.6), "rgba(255,255,255,.55)", 0.7) + ln2([hx, hy - 1], [hx + 3, hy - 12], WOOD.right, 1.5) + `<rect x="${f22(hx + 0.4)}" y="${f22(hy - 15)}" width="5.6" height="3" rx="0.6" fill="${DARK_IRON.left}" transform="rotate(16 ${f22(hx + 3)} ${f22(hy - 13.5)})"/>`;
    }, "draw")
  }, {
    at: ENCLUME,
    frame: [-12, -30, 24, 20],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(-0.02, 0, 18.6);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const open = 4 + wave(f, n, 3);
      const shape = [[0, -0.1], [0.055, -0.065], [0.085, 0.01], [0.075, 0.09], [0.03, 0.135], [-0.03, 0.135], [-0.075, 0.09], [-0.085, 0.01], [-0.055, -0.065]].map(([a, b]) => [a * 1.45, b * 1.45]);
      const z0 = 8;
      const lower = shape.map(([a, b]) => T.p(a, b, z0));
      const upper = shape.map(([a, b]) => T.p(a, b, z0 + open));
      const vis = [1, 2, 3, 4, 5, 6, 7];
      const leather = [...vis.map((i) => lower[i]), ...vis.slice().reverse().map((i) => upper[i])];
      const pleats = vis.map((i) => ln2([lower[i][0], lower[i][1] - open * 0.5], [upper[i][0], upper[i][1] + open * 0.2], "rgba(60,30,15,.45)", 0.5)).join("");
      const puff2 = f >= 1 && f <= 3;
      const [nx, ny] = T.p(0, -0.24, 8.5);
      const [cx, cy] = T.p(0, 0.04, z0 + open);
      return T.shadow(0, 0.02, 0.14, 0.2) + T.box(-0.08, 0.06, -0.05, 0.09, 0, z0, WOOD_DARK) + T.box(0.05, 0.06, 0.08, 0.09, 0, z0, WOOD_DARK) + T.box(-0.02, -0.1, 0.02, -0.07, 0, z0, WOOD_DARK) + poly2(lower, WOOD_DARK.left) + poly2(leather, "#8B5631", ' stroke="#5E3A22" stroke-width="0.5"') + pleats + poly2(upper, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`) + dot2(cx, cy, 1.1, "#5E3A22") + ln2(T.p(-0.03, 0.19, z0 + open), T.p(-0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln2(T.p(0.03, 0.19, z0 + open), T.p(0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln2(T.p(0, -0.13, z0 + 0.8), [nx, ny], DARK_IRON.right, 2.4) + ln2(T.p(0, -0.13, z0 + 1.4), [nx, ny - 0.6], DARK_IRON.top, 0.6) + (puff2 ? dot2(nx - 2 - f, ny - 1.6 - f * 0.6, 1 + f * 0.5, `rgba(255,255,255,${f22(0.5 - f * 0.12)})`) + dot2(nx - 1, ny - 2.4, 0.6, "#FFB347") : "");
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
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const zr = 10 + LIFT[f] * 9;
      const [ax, ay] = T.p(0, 0, 9.2);
      const [sx, sy] = T.p(0, 0, 38);
      const strike = f === 0;
      return T.shadow(0, 0, 0.2, 0.2) + T.box(-0.14, -0.13, 0.14, 0.13, 0, 3, STONE) + T.box(-0.035, -0.12, 0.035, -0.08, 3, 29, DARK_IRON) + T.box(-0.06, -0.05, 0.06, 0.05, 3, 7, DARK_IRON) + T.box(-0.045, -0.035, 0.045, 0.035, 7, 9, IRON) + `<rect x="${f22(ax - 3.4)}" y="${f22(ay - 1.4)}" width="6.8" height="1.8" rx="0.8" fill="${strike ? "#FFB347" : "#E2463A"}"/>` + T.box(-0.04, -0.04, 0.04, 0.04, zr, zr + 7, IRON) + ln2(T.p(0, 0, zr + 7), T.p(0, 0, 29), IRON.top, 1.4) + T.box(-0.035, 0.08, 0.035, 0.12, 3, 29, DARK_IRON) + T.box(-0.05, -0.13, 0.05, 0.13, 29, 32, DARK_IRON) + T.cyl(0, 0, 32, 38, 0.06, COPPER, "steam") + dot2(sx, sy, 1.1, COPPER.right) + ln2(T.p(0.04, -0.06, 36), T.p(0.04, -0.1, 22), COPPER.right, 1.1) + dot2(...T.p(0, 0.12, 22), 1.8, "#F2EDE2") + ln2(T.p(0, 0.12, 22), T.p(0.01, 0.12, 23.2), "#E2463A", 0.6) + (f >= 1 && f <= 4 ? [0, 1].map((k) => dot2(sx + 3 + k * 3 + f, sy - 2 - k * 3 - f, 1.6 + f * 0.5, `rgba(255,255,255,${f22(0.7 - f * 0.12)})`)).join("") : "") + (strike ? [[-7, -4], [6, -5], [-4, -8], [8, -1], [-9, 0]].map(([dx, dy], k) => dot2(ax + dx, ay + dy, 0.9, k % 2 ? "#FFE07A" : "#F7A23B")).join("") : "");
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const step = wave(f, n, 1);
      const bob = Math.abs(step) * 0.8;
      const [hx, hy] = T.p(0, 0, 24.5 + bob);
      const [bx, by] = T.p(0, 0, 15 + bob);
      const turn = Math.cos(f / n * Math.PI * 2);
      const [kx, ky] = T.p(-0.13, -0.13, 17 + bob);
      const blink = f === 5;
      const leg = /* @__PURE__ */ __name((du, dv, lift) => T.box(du - 0.022, dv - 0.022, du + 0.022, dv + 0.022, lift, 9 + bob, DARK_IRON) + T.box(du - 0.03, dv - 0.03, du + 0.04, dv + 0.04, lift, lift + 2, BRASS), "leg");
      const arm = /* @__PURE__ */ __name((sx, s) => `<g transform="rotate(${f22(step * 24 * s)} ${f22(sx)} ${f22(by - 4)})">${ln2([sx, by - 4], [sx + s * 0.6, by + 3], DARK_IRON.left, 1.6)}${dot2(sx + s * 0.6, by + 3.6, 1.4, BRASS.left)}</g>`, "arm");
      return T.shadow(0, 0, 0.12, 0.22) + ln2(T.p(-0.06, -0.06, 17 + bob), [kx, ky], DARK_IRON.right, 1.2) + ell2(kx - 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`) + ell2(kx + 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.top, ` stroke="${BRASS.right}" stroke-width="0.5"`) + leg(-0.03, 0.03, Math.max(0, step) * 2) + leg(0.03, -0.03, Math.max(0, -step) * 2) + arm(bx - 5.6, -1) + T.cyl(0, 0, 9 + bob, 21 + bob, 0.08, BRASS, "body") + [-3, 0, 3].map((dx) => dot2(bx + dx, by + 4.4, 0.5, BRASS.right)).join("") + dot2(bx, by - 1, 2.2, "#F2EDE2") + ln2([bx, by - 1], [bx + 1.2, by - 2], "#3D3A36", 0.5) + `<circle cx="${f22(bx)}" cy="${f22(by - 1)}" r="2.2" fill="none" stroke="${BRASS.right}" stroke-width="0.6"/>` + arm(bx + 5.6, 1) + T.cyl(0, 0, 21 + bob, 27 + bob, 0.055, BRASS, "head") + ell2(hx, hy - 2.6, 3.6, 1.8, BRASS.top) + ln2([hx, hy - 3.6], [hx, hy - 8], DARK_IRON.right, 0.7) + dot2(hx, hy - 8.4, 1.1, f % 4 < 2 ? "#7FE0FF" : "#E2463A") + (blink ? ln2([hx - 2.4, hy + 1], [hx - 0.8, hy + 1], "#3D3A36", 0.7) + ln2([hx + 0.8, hy + 1], [hx + 2.4, hy + 1], "#3D3A36", 0.7) : dot2(hx - 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx + 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx - 1.9, hy + 0.7, 0.4, "#FFFFFF") + dot2(hx + 1.3, hy + 0.7, 0.4, "#FFFFFF")) + ln2([hx - 1.4, hy + 3.4], [hx + 1.4, hy + 3.4], BRASS.right, 0.6);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 22);
      const [fx, fy] = T.p(0, 0, 9);
      const fire = 0.75 + wave(f, n, 0.25);
      const rx = 0.11 * TW * Math.SQRT1_2;
      const [gx, gy] = [x, y - 17];
      const [qx, qy] = T.p(0.24, 0.1, 0);
      const bubbles = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        return dot2(gx - 2 + k * 2, gy + 2 - t * 4, 0.6 + t * 0.4, `rgba(255,250,220,${f22(1 - t)})`);
      }).join("");
      return T.shadow(0, 0, 0.24, 0.22) + T.box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE) + T.cyl(0, 0, 3, 22, 0.11, GOLD, "tower") + [8, 15].map((z) => {
        const [lx, ly] = T.p(0, 0, z);
        return `<path d="M${f22(lx - rx)},${f22(ly)} A${f22(rx)},${f22(rx / 2)} 0 0 0 ${f22(lx + rx)},${f22(ly)}" stroke="${GOLD.right}" stroke-width="1" fill="none"/>`;
      }).join("") + `<path d="M${f22(fx - 3.4)},${f22(fy + 3.6)} L${f22(fx - 3.4)},${f22(fy - 1)} A3.4,3.6 0 0 1 ${f22(fx + 3.4)},${f22(fy - 1)} L${f22(fx + 3.4)},${f22(fy + 3.6)} Z" fill="#4A1E10" stroke="${GOLD.right}" stroke-width="0.8"/>` + ell2(fx, fy + 2, 2.4, 2.6, "#F28A3A", ` opacity="${f22(fire)}"`) + ell2(fx, fy + 2.6, 1.3, 1.6, "#FFE07A", ` opacity="${f22(fire)}"`) + gradient(T.id("dome"), GOLD.left, GOLD.right) + `<path d="M${f22(x - rx)},${f22(y)} C${f22(x - rx)},${f22(y - 11)} ${f22(x + rx)},${f22(y - 11)} ${f22(x + rx)},${f22(y)} A${f22(rx)},${f22(rx / 2)} 0 0 1 ${f22(x - rx)},${f22(y)} Z" fill="url(#${T.id("dome")})" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(x - rx * 0.6)},${f22(y - 5)} Q${f22(x - rx * 0.3)},${f22(y - 8)} ${f22(x)},${f22(y - 8.4)}" stroke="rgba(255,255,255,.6)" stroke-width="1" fill="none"/><path d="M${f22(gx + 2)},${f22(gy - 4)} Q${f22(gx + 10)},${f22(gy - 12)} ${f22(qx + 1)},${f22(qy - 9)}" stroke="rgba(230,245,255,.8)" stroke-width="1.6" fill="none"/><path d="M${f22(gx + 2)},${f22(gy - 4)} Q${f22(gx + 10)},${f22(gy - 12)} ${f22(qx + 1)},${f22(qy - 9)}" stroke="rgba(120,150,180,.45)" stroke-width="0.4" fill="none"/><path d="M${f22(gx - 5)},${f22(gy + 1)} A5,5 0 0 0 ${f22(gx + 5)},${f22(gy + 1)} Z" fill="#FFC94A"/>` + bubbles + `<circle cx="${f22(gx)}" cy="${f22(gy)}" r="5" fill="rgba(220,240,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="0.7"/><rect x="${f22(gx - 1.2)}" y="${f22(gy - 8)}" width="2.4" height="3.4" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + dot2(gx - 2, gy - 2, 0.9, "rgba(255,255,255,.8)") + ell2(qx, qy - 3.4, 3.6, 3.6, "rgba(220,240,255,.3)", ' stroke="rgba(255,255,255,.85)" stroke-width="0.6"') + `<path d="M${f22(qx - 3.4)},${f22(qy - 2.6)} A3.6,3.6 0 0 0 ${f22(qx + 3.4)},${f22(qy - 2.6)} Z" fill="#FFC94A"/><rect x="${f22(qx - 0.9)}" y="${f22(qy - 9.4)}" width="1.8" height="2.6" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + (f % 4 === 1 ? dot2(qx + 1, qy - 7 + (f >> 2) * 2, 0.6, "#FFC94A") : "") + star(gx + 7, gy - 3, 1.6, "#FFF2B0", Math.max(0, wave(f, n, 1))) + star(x - rx - 2, y - 2, 1.4, "#FFF2B0", Math.max(0, wave(f, n, 1, 3)));
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
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 7);
      const rx = 7.6;
      const ry = 3.8;
      const log2 = /* @__PURE__ */ __name((a, b, z) => T.box(a, b, a + 0.045, b + 0.16, z, z + 3.4, BARK), "log");
      const [px, py] = T.p(0.14, 0.17, 0);
      const joint = "rgba(120,110,95,.4)";
      return T.shadow(0, 0, 0.22, 0.2) + T.box(-0.15, -0.15, 0.15, 0.15, 0, 7, STONE) + ln2(T.p(-0.15, 0.15, 3.5), T.p(0.15, 0.15, 3.5), joint, 0.6) + [-0.08, 0.02, 0.11].map((du, k) => ln2(T.p(du, 0.15, k % 2 ? 0 : 3.5), T.p(du, 0.15, k % 2 ? 3.5 : 7), joint, 0.6)).join("") + `<defs><linearGradient id="${T.id("dome")}" x1="0" x2="1"><stop offset="0" stop-color="#E3B486"/><stop offset="1" stop-color="#A9724A"/></linearGradient></defs><path d="M${f22(x - rx)},${f22(y)} C${f22(x - rx)},${f22(y - OVEN_H * 1.3)} ${f22(x + rx)},${f22(y - OVEN_H * 1.3)} ${f22(x + rx)},${f22(y)} A${rx},${ry} 0 0 1 ${f22(x - rx)},${f22(y)} Z" fill="url(#${T.id("dome")})" stroke="${OUT}" stroke-width="0.7"/><path d="M${f22(x - rx * 0.8)},${f22(y - 4)} Q${f22(x)},${f22(y - 1)} ${f22(x + rx * 0.8)},${f22(y - 4)} M${f22(x - rx * 0.55)},${f22(y - 8.4)} Q${f22(x)},${f22(y - 6.4)} ${f22(x + rx * 0.55)},${f22(y - 8.4)}" stroke="rgba(110,60,30,.35)" stroke-width="0.6" fill="none"/>` + T.cyl(0.02, -0.04, 7 + OVEN_H * 0.9, 7 + OVEN_H * 0.9 + 5, 0.028, { top: "#5E3A2A", left: "#B87E52", right: "#8C5A34" }, "flue") + `<path d="M${f22(x - 5.6)},${f22(y + 1.8)} L${f22(x - 5.6)},${f22(y - 2.4)} A2.6,2.8 0 0 1 ${f22(x - 0.6)},${f22(y - 2.4)} L${f22(x - 0.6)},${f22(y + 2.6)} Z" fill="#3A1E14" stroke="#7A4E30" stroke-width="0.8"/>` + log2(0.18, -0.12, 0) + log2(0.235, -0.12, 0) + log2(0.205, -0.12, 3.4) + ln2([px, py], [px - 9, py - 16], WOOD.right, 1.2) + `<ellipse cx="${f22(px + 1.4)}" cy="${f22(py + 0.6)}" rx="3" ry="1.4" fill="${WOOD.left}" transform="rotate(-30 ${f22(px + 1.4)} ${f22(py + 0.6)})"/>`;
    }, "draw")
  }, {
    at: OVEN_AT,
    frame: [-14, -54, 30, 58],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 7);
      const [cx, cy] = T.p(0.02, -0.04, 7 + OVEN_H * 0.9 + 5);
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
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, -0.5, 0.06, 0.2) + T.shadow(0, 0.5, 0.06, 0.2) + T.box(-0.025, -0.525, 0.025, -0.475, 0, 22, WOOD_DARK) + T.box(-0.025, 0.475, 0.025, 0.525, 0, 22, WOOD_DARK) + ln2(T.p(0, -0.5, 22), T.p(0, -0.5, 24), WOOD_DARK.right, 1.4) + ln2(T.p(0, 0.5, 22), T.p(0, 0.5, 24), WOOD_DARK.right, 1.4), "draw")
  }, {
    at: HAMMOCK_AT,
    frame: [-20, -26, 42, 34],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const a = T.p(0, -0.47, 18);
      const b = T.p(0, 0.47, 18);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const wag = wave(f, n, 3.2);
      const pant = f % 2 ? 0.8 : 0;
      const [gx, gy] = T.p(0.14, -0.1, 0);
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
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 16);
      const k = f / n;
      const glass = `M${f22(x - 4.4)},${f22(y - 20)} C${f22(x - 4.6)},${f22(y - 14)} ${f22(x - 0.6)},${f22(y - 12)} ${f22(x - 0.6)},${f22(y - 10)} C${f22(x - 0.6)},${f22(y - 8)} ${f22(x - 4.6)},${f22(y - 6)} ${f22(x - 4.4)},${f22(y)} L${f22(x + 4.4)},${f22(y)} C${f22(x + 4.6)},${f22(y - 6)} ${f22(x + 0.6)},${f22(y - 8)} ${f22(x + 0.6)},${f22(y - 10)} C${f22(x + 0.6)},${f22(y - 12)} ${f22(x + 4.6)},${f22(y - 14)} ${f22(x + 4.4)},${f22(y - 20)} Z`;
      const top = y - 11 - (1 - k) * 7;
      const pile = 1 + k * 6;
      const post2 = /* @__PURE__ */ __name((dx) => `<rect x="${f22(x + dx - 0.6)}" y="${f22(y - 21)}" width="1.2" height="21" fill="${WOOD_DARK.left}"/>`, "post");
      return T.shadow(0, 0, 0.13, 0.22) + T.cyl(0, 0, 0, 2, 0.06, WOOD_DARK, "foot") + T.box(-0.012, -0.012, 0.012, 0.012, 2, 12, WOOD_DARK) + T.cyl(0, 0, 12, 14, 0.12, WOOD, "table") + T.cyl(0, 0, 14, 16, 0.09, WOOD_DARK, "base") + post2(-5.2) + post2(5.2) + `<defs><clipPath id="${T.id("glass")}"><path d="${glass}"/></clipPath></defs><g clip-path="url(#${T.id("glass")})"><rect x="${f22(x - 5)}" y="${f22(top)}" width="10" height="${f22(y - 10 - top)}" fill="#F2C66E"/><path d="M${f22(x - 5)},${f22(y)} L${f22(x - 5)},${f22(y - pile * 0.4)} Q${f22(x)},${f22(y - pile * 1.6)} ${f22(x + 5)},${f22(y - pile * 0.4)} L${f22(x + 5)},${f22(y)} Z" fill="#E9B65A"/>` + (k < 1 ? ln2([x, y - 10], [x, y - pile], "#F2C66E", 0.7) : "") + `</g><path d="${glass}" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.85)" stroke-width="0.6"/>` + ln2([x - 3, y - 18], [x - 2, y - 14], "rgba(255,255,255,.7)", 0.8) + ln2([x - 3, y - 2], [x - 2.4, y - 5], "rgba(255,255,255,.6)", 0.7) + post2(0) + T.cyl(0, 0, 36, 38, 0.09, WOOD_DARK, "cap") + dot2(...T.p(0, 0, 39), 1, WOOD.top);
    }, "draw")
  }]
};
var hibou = {
  layers: [{
    at: [-0.92, 0.36],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, level, f) => {
      const [ox, oy] = T.p(0, 0, 25);
      const turn = f === 2 || f === 3 ? 1.6 : f === 5 ? -1.2 : 0;
      const blink = f === 6;
      const feather = "#9C6B43";
      const eye = /* @__PURE__ */ __name((dx) => blink ? `<path d="M${f22(ox + dx - 1.6)},${f22(oy - 14)} q1.6,1 3.2,0" stroke="#3A2A1E" stroke-width="0.7" fill="none"/>` : dot2(ox + dx, oy - 14, 1.8, "#F2C04B") + dot2(ox + dx + turn * 0.3, oy - 14, 0.9, "#1E1A17") + dot2(ox + dx - 0.5, oy - 14.6, 0.35, "#FFFFFF"), "eye");
      return T.shadow(0, 0, 0.1, 0.2) + T.pebble(0.05, 0.05, 1.8) + T.box(-0.02, -0.02, 0.02, 0.02, 0, 23, WOOD_DARK) + T.box(-0.015, -0.12, 0.015, 0.12, 23, 25, WOOD) + `<path d="M${f22(ox - 2)},${f22(oy - 2)} l-1,4 l2,-1 l1,2 l1,-2 l2,1 l-1,-4 Z" fill="#7A4E30"/>` + ell2(ox, oy - 6.4, 5, 6.4, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + ell2(ox + 0.4, oy - 5.6, 3.2, 4.6, "#E7C99A") + [[-1, -7.4], [1.4, -6.4], [-0.4, -4.4], [1.8, -3.6]].map(([dx, dy]) => `<path d="M${f22(ox + dx - 0.7)},${f22(oy + dy)} l0.7,0.7 l0.7,-0.7" stroke="#B98552" stroke-width="0.5" fill="none"/>`).join("") + ell2(ox - 3.8, oy - 6, 1.8, 4.6, "#7A4E30") + ell2(ox + 4, oy - 6, 1.6, 4.4, "#8B5631") + [-1.6, 0, 1.6].map((dx) => ln2([ox + dx, oy - 1], [ox + dx, oy + 0.6], "#E8A13A", 0.7)).join("") + `<g transform="translate(${f22(turn)} 0)">` + ell2(ox, oy - 14, 5.4, 4.6, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + `<path d="M${f22(ox - 4.6)},${f22(oy - 16.4)} l-0.6,-3.6 l2.6,2 Z M${f22(ox + 4.6)},${f22(oy - 16.4)} l0.6,-3.6 l-2.6,2 Z" fill="${feather}"/>` + ell2(ox - 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + ell2(ox + 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + eye(-2) + eye(2) + `<path d="M${f22(ox - 0.7)},${f22(oy - 12.6)} l0.7,1.6 l0.7,-1.6 Z" fill="#5E3A22"/></g>`;
    }, "draw")
  }]
};
var GRIMOIRE_AT = [0.88, 0.95];
var grimoire = {
  light: /* @__PURE__ */ __name(() => [GRIMOIRE_AT[0], GRIMOIRE_AT[1], 24, 22, "200,160,255"], "light"),
  layers: [{
    at: GRIMOIRE_AT,
    frame: [-14, -22, 28, 28],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, 0, 0.1, 0.2) + T.box(-0.07, -0.07, 0.07, 0.07, 0, 3, STONE) + T.cyl(0, 0, 3, 13, 0.035, STONE, "col") + T.box(-0.06, -0.06, 0.06, 0.06, 13, 15, STONE) + T.disc(0, 0, 15, 0.045, "rgba(200,160,255,.55)") + T.disc(0, 0, 15, 0.025, "rgba(240,225,255,.8)"), "draw")
  }, {
    at: GRIMOIRE_AT,
    frame: [-22, -50, 44, 36],
    n: 8,
    fps: 5,
    motion: /* @__PURE__ */ __name((t) => [0, 0, Math.sin(t * 1.4) * 1.6], "motion"),
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [x, y] = T.p(0, 0, 25);
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

// atelier/port/src/world/annexSprites.js
var TAU = Math.PI * 2;
var CLAY = { top: "#E8A884", left: "#D58C66", right: "#B06A47" };
var COAL = { top: "#55555C", left: "#36363C", right: "#222227" };
var TEAL_ROOF = { left: "#6FB3AE", right: "#4A8C88", back: "#3E7672" };
var MUD = "#8C6A46";
var SOIL_TOP = "#7A4E30";
var LEAF = "#5FA04A";
var LEAF_LIGHT = "#8FCB6A";
var GLASS_FACES = { top: "rgba(225,243,255,.5)", left: "rgba(196,228,246,.42)", right: "rgba(160,205,232,.5)" };
var GLASS_EDGE = ' stroke="rgba(255,255,255,.85)" stroke-width="0.9" stroke-linejoin="round"';
var patch = /* @__PURE__ */ __name((T, r, fill, extra = EDGE) => T.face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra), "patch");
var post = /* @__PURE__ */ __name((T, du, dv, z0, z1, colors = WOOD_DARK, w = 0.022) => T.box(du - w, dv - w, du + w, dv + w, z0, z1, colors), "post");
var rail = /* @__PURE__ */ __name((T, a, b, z) => ln2(T.p(a[0], a[1], z), T.p(b[0], b[1], z), WOOD_DARK.right, 2.2) + ln2(T.p(a[0], a[1], z + 0.6), T.p(b[0], b[1], z + 0.6), WOOD.top, 1), "rail");
var puff = /* @__PURE__ */ __name((x, y, r, o) => `<circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r)}" fill="rgba(236,232,226,${f22(o)})"/>`, "puff");
function log(T, du, v0, v1, z, r, wood = STUMP) {
  const a = T.p(du, v0, z);
  const b = T.p(du, v1, z);
  return poly2([[a[0], a[1] - r], [b[0], b[1] - r], [b[0], b[1] + r], [a[0], a[1] + r]], WOOD.left, ` stroke="${OUT}" stroke-width="0.6"`) + ln2([a[0], a[1] - r * 0.45], [b[0], b[1] - r * 0.45], "rgba(255,255,255,.18)", r * 0.5) + ell2(b[0], b[1], r * 0.92, r, wood.top, ` stroke="${WOOD.right}" stroke-width="0.7"`) + ell2(b[0], b[1], r * 0.5, r * 0.55, "none", ` stroke="rgba(150,92,48,.55)" stroke-width="0.5"`) + dot2(b[0], b[1], r * 0.14, "rgba(150,92,48,.7)");
}
__name(log, "log");
var logEnd = /* @__PURE__ */ __name((x, y, r) => `<circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r)}" fill="${STUMP.top}" stroke="${WOOD.right}" stroke-width="0.6"/><circle cx="${f22(x)}" cy="${f22(y)}" r="${f22(r * 0.5)}" fill="none" stroke="rgba(150,92,48,.45)" stroke-width="0.4"/>`, "logEnd");
function stumpAt(T, du, dv, h, r, name) {
  const [x, y] = T.p(du, dv, h);
  return T.shadow(du, dv, r * 1.3, 0.2) + T.cyl(du, dv, 0, h, r, { top: STUMP.top, left: "#9A6235", right: "#6E4222" }, name) + ell2(x, y, r * 18, r * 9, "none", ` stroke="rgba(150,92,48,.5)" stroke-width="0.5"`);
}
__name(stumpAt, "stumpAt");
function sapling(x, y, s, dx = 0) {
  return ln2([x, y], [x + dx * 0.4, y - 9 * s], "#7A5A3A", 1.3 * s) + `<circle cx="${f22(x + dx + 0.5)}" cy="${f22(y - 11 * s)}" r="${f22(5 * s)}" fill="#4F8F3A"/><circle cx="${f22(x + dx)}" cy="${f22(y - 11.6 * s)}" r="${f22(4.6 * s)}" fill="#7EC45B"/><circle cx="${f22(x + dx - 1.6 * s)}" cy="${f22(y - 13.2 * s)}" r="${f22(2 * s)}" fill="#B3E386"/>`;
}
__name(sapling, "sapling");
function butterfly2(x, y, open, color) {
  const w = open ? 2.8 : 1;
  return `<ellipse cx="${f22(x - w * 0.6)}" cy="${f22(y)}" rx="${f22(w)}" ry="2.2" fill="${color}" opacity=".92"/><ellipse cx="${f22(x + w * 0.6)}" cy="${f22(y)}" rx="${f22(w)}" ry="2.2" fill="${color}" opacity=".92"/>` + ln2([x, y - 1.6], [x, y + 1.6], "#3D3A36", 0.7);
}
__name(butterfly2, "butterfly");
function pig(x, y, flip, step) {
  const s = flip ? -1 : 1;
  const X = /* @__PURE__ */ __name((dx) => x + s * dx, "X");
  const legs = [[-3.6, step], [-1.6, -step], [2, -step], [3.8, step]].map(([dx, k]) => ln2([X(dx), y - 2.6], [X(dx + k * 0.5), y], "#D88C8E", 1.4)).join("");
  return ell2(x, y + 0.4, 6.6, 1.8, "rgba(40,55,20,.22)") + legs + ell2(x, y - 4.6, 6.6, 4, "#F4B2B0", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - s * 1, y - 6.2, 4, 1.6, "rgba(255,255,255,.35)") + `<path d="M${f22(X(-6.4))},${f22(y - 5.6)} q${s * -2.2},-1.6 ${s * -1},-3 q${s * 1.4},0.2 ${s * 0.4},1.4" stroke="#D88C8E" stroke-width="0.8" fill="none"/>` + dot2(X(5.6), y - 5.4, 3.3, "#F4B2B0") + `<path d="M${f22(X(4.4))},${f22(y - 8.2)} l${s * 1.6},-2.6 l${s * 1},2.2 Z" fill="#E59496"/>` + ell2(X(8.2), y - 4.8, 1.6, 1.4, "#E58A8F", ` stroke="${OUT}" stroke-width="0.4"`) + dot2(X(8), y - 5, 0.35, "#7A3A3E") + dot2(X(8.6), y - 4.6, 0.35, "#7A3A3E") + dot2(X(6.2), y - 6.4, 0.5, "#2A2024");
}
__name(pig, "pig");
function sheep(x, y, flip, graze) {
  const s = flip ? -1 : 1;
  const X = /* @__PURE__ */ __name((dx) => x + s * dx, "X");
  const wool = [[-3.6, -5.4, 3], [-0.6, -6.6, 3.4], [2.6, -5.6, 3], [-1.8, -3.8, 2.8], [1.4, -3.8, 2.8]].map(([dx, dy, r]) => `<circle cx="${f22(X(dx))}" cy="${f22(y + dy)}" r="${f22(r)}" fill="#F7F3EA" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/>`).join("");
  const hy = graze ? -1.8 : -6.4;
  return ell2(x, y + 0.4, 6, 1.7, "rgba(40,55,20,.22)") + [-3, -1, 1.6, 3.4].map((dx) => ln2([X(dx), y - 2.4], [X(dx), y], "#3A3234", 1.2)).join("") + wool + ell2(X(5.6), y + hy, 2.1, 2.6, "#3A3234") + ell2(X(4.6), y + hy - 1.8, 1.4, 0.7, "#3A3234") + dot2(X(6.4), y + hy - 0.6, 0.45, "#FFFFFF");
}
__name(sheep, "sheep");
function fishTop(x, y, a, base, spot) {
  const c = Math.cos(a), s = Math.sin(a);
  const R = /* @__PURE__ */ __name((dx, dy) => [x + dx * c - dy * s * 0.55, y + dx * s * 0.55 + dy * c * 0.55], "R");
  const tail = [R(-4.6, 0), R(-7.2, -2), R(-7.2, 2)];
  return poly2(tail, base) + `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="4.2" ry="1.7" fill="${base}" transform="rotate(${f22(Math.atan2(s * 0.55, c) * 180 / Math.PI)} ${f22(x)} ${f22(y)})"/>` + (spot ? `<circle cx="${f22(R(1, 0)[0])}" cy="${f22(R(1, 0)[1])}" r="1.1" fill="${spot}"/><circle cx="${f22(R(-2, 0.4)[0])}" cy="${f22(R(-2, 0.4)[1])}" r="0.9" fill="${spot}"/>` : "");
}
__name(fishTop, "fishTop");
var CROP_COLS = [-0.31, -0.155, 0, 0.155, 0.31];
var CROP_ROWS = [-0.28, -0.14, 0, 0.14, 0.28];
function crop(kind, x, y, f, n, k) {
  const sway = wave(f, n, 1.5, k * 0.9);
  if (kind === 0) {
    return [-1.4, 0, 1.4].map((o, i) => {
      const tx = x + o + sway * (0.8 + i * 0.15);
      const ty = y - 10.5 - (i === 1 ? 1.4 : 0);
      return ln2([x + o * 0.4, y], [tx, ty], "#C9A23E", 0.8) + `<ellipse cx="${f22(tx)}" cy="${f22(ty - 1.6)}" rx="1.15" ry="2.7" fill="#EBC85E" stroke="#B68A2E" stroke-width="0.4" transform="rotate(${f22(sway * 6)} ${f22(tx)} ${f22(ty)})"/>`;
    }).join("");
  }
  if (kind === 1) {
    return ell2(x, y, 1.7, 0.9, "#F08A3A", ' stroke="#C8622A" stroke-width="0.4"') + [-2.2, -0.8, 0.8, 2.2].map((o, i) => `<path d="M${f22(x)},${f22(y - 0.4)} q${f22(o * 0.6 + sway * 0.4)},-3 ${f22(o + sway * 0.6)},-${f22(6.4 + i % 2 * 1.4)}" stroke="${i % 2 ? LEAF_LIGHT : LEAF}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join("");
  }
  if (k % 2) {
    return `<circle cx="${f22(x - 2)}" cy="${f22(y - 2.4)}" r="2.4" fill="${LEAF}"/><circle cx="${f22(x + 1.8 + sway * 0.3)}" cy="${f22(y - 3)}" r="2.6" fill="${LEAF_LIGHT}"/><path d="M${f22(x - 3)},${f22(y - 1)} q2,-3 5,-1" stroke="#4F8F3A" stroke-width="0.6" fill="none"/>`;
  }
  return ell2(x, y + 0.2, 4.6, 1.3, "rgba(40,55,20,.25)") + ell2(x, y - 2.6, 4.6, 3.3, "#F08A3A", ' stroke="#C8622A" stroke-width="0.5"') + ell2(x, y - 2.6, 1.6, 3.2, "none", ' stroke="rgba(200,98,42,.7)" stroke-width="0.5"') + ell2(x - 1.6, y - 3.6, 1.4, 0.8, "rgba(255,255,255,.3)") + ln2([x, y - 5.6], [x + 1, y - 7.4], "#6A8A3A", 1.2);
}
__name(crop, "crop");
var champ = {
  layers: [{
    frame: [-34, -30, 68, 48],
    n: 6,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n, variant) => {
      const kind = variant % 3;
      let out = patch(T, 0.45, "#8A5A36") + patch(T, 0.41, "#9B6A42", "");
      for (const dv of CROP_ROWS) out += ln2(T.p(-0.4, dv, 0), T.p(0.4, dv, 0), "#6E4528", 2.6) + ln2(T.p(-0.4, dv - 0.03, 0.6), T.p(0.4, dv - 0.03, 0.6), "#B07E54", 1);
      out += post(T, 0.44, -0.44, 0, 8, WOOD) + post(T, -0.44, 0.44, 0, 8, WOOD);
      const plants = [];
      CROP_ROWS.forEach((dv, r) => CROP_COLS.forEach((du, c) => plants.push({ du, dv, k: r * 5 + c })));
      plants.sort((a, b) => a.du + a.dv - (b.du + b.dv));
      for (const p of plants) {
        const [x, y] = T.p(p.du, p.dv, 0);
        out += crop(kind, x, y, f, n, p.k);
      }
      out += post(T, 0.44, 0.44, 0, 8, WOOD) + ln2(T.p(0.44, -0.44, 7), T.p(0.44, 0.44, 7), "rgba(235,225,200,.8)", 0.5) + ln2(T.p(-0.44, 0.44, 7), T.p(0.44, 0.44, 7), "rgba(235,225,200,.8)", 0.5);
      const [px, ey] = T.p(-0.44, 0.44, 8), ex = px + 1.4, sw = wave(f, n, 0.8);
      return out + ln2([ex - 5.2, ey - 4], [ex + 5.2, ey - 4.6], WOOD.right, 1.2) + `<path d="M${f22(ex - 3.4)},${f22(ey - 6)} L${f22(ex + 3.4)},${f22(ey - 6.4)} L${f22(ex + 2.6)},${f22(ey + 1.6)} L${f22(ex - 2.6)},${f22(ey + 1.8)} Z" fill="#6FA3D9" stroke="${OUT}" stroke-width="0.5"/>` + ln2([ex - 2.8, ey - 2], [ex + 2.8, ey - 2.3], "#E2574C", 0.8) + [-1, 1].map((s) => `<path d="M${f22(ex + s * 5.2)},${f22(ey - 4.4 + (s > 0 ? -0.3 : 0))} l${f22(s * 1.4)},${f22(1.6 + sw * s * 0.4)} M${f22(ex + s * 5.2)},${f22(ey - 4.4)} l${f22(s * 1.8)},${f22(0.4 + sw * s * 0.3)}" stroke="${STRAW.left}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join("") + `<circle cx="${f22(ex)}" cy="${f22(ey - 9)}" r="2.6" fill="#E8D8B0" stroke="${OUT}" stroke-width="0.5"/>` + dot2(ex - 0.9, ey - 9.4, 0.4, "#3D3A36") + dot2(ex + 0.9, ey - 9.4, 0.4, "#3D3A36") + `<path d="M${f22(ex - 1)},${f22(ey - 8)} q1,0.8 2,0" stroke="#3D3A36" stroke-width="0.4" fill="none"/>` + ell2(ex, ey - 11, 5, 1.4, STRAW.top, ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(ex - 2.4)},${f22(ey - 11)} Q${f22(ex)},${f22(ey - 15)} ${f22(ex + 2.4)},${f22(ey - 11)} Z" fill="${STRAW.left}" stroke="${OUT}" stroke-width="0.5"/>` + ln2([ex - 2.3, ey - 11.6], [ex + 2.3, ey - 11.6], "#E2574C", 0.7);
    }, "draw")
  }]
};
var PIGEON = { body: "#9AA0AE", breast: "#C8B4CA", wing: "#7A8090" };
var grenier = {
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 2,
    draw: /* @__PURE__ */ __name((T, f) => {
      const staddle = /* @__PURE__ */ __name((du, dv) => T.cyl(du, dv, 0, 5, 0.035, STONE, `pad${du}${dv}`) + T.disc(du, dv, 5, 0.065, STONE.top, EDGE), "staddle");
      const [rx, ry] = T.p(0, 0, 36);
      const pigeon = f >= 1 && f <= 4 ? bird(rx + 3, ry + 1, { ...PIGEON, peck: f === 3 ? 1 : 0, flap: f === 1 ? 1 : 0 }) : "";
      const [gx, gy] = T.p(0, 0, 0);
      let out = ell2(gx, gy + 1, 31, 12.6, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 21, 7.6, "#ADD27A") + [[-22, 4], [20, 7], [-8, 10]].map(([dx, dy]) => ln2([gx + dx, gy + dy], [gx + dx + 3, gy + dy - 0.6], "#E2C66E", 0.7)).join("") + T.shadow(0, 0, 0.36, 0.2) + staddle(-0.2, -0.17) + staddle(0.2, -0.17) + staddle(-0.2, 0.17) + staddle(0.2, 0.17) + T.box(-0.27, -0.23, 0.27, 0.23, 6, 25, BARN) + planksLeft(T.u - 0.27, T.u + 0.27, T.v + 0.23, 6, 25, 4.2) + planksRight(T.u + 0.27, T.v - 0.23, T.v + 0.23, 6, 25, 4.2) + T.face([[-0.07, 0.23, 7], [0.09, 0.23, 7], [0.09, 0.23, 20], [-0.07, 0.23, 20]], "#4A2E1A") + T.face([[-0.05, 0.23, 7], [0.07, 0.23, 7], [0.07, 0.23, 11], [-0.05, 0.23, 11]], STRAW.left) + ln2(T.p(-0.07, 0.23, 20), T.p(0.09, 0.23, 7), WALL.top, 1) + ln2(T.p(-0.07, 0.23, 7), T.p(0.09, 0.23, 20), WALL.top, 1) + [9, 18].map((z) => ln2(T.p(-0.09, 0.231, z), T.p(-0.04, 0.231, z), DARK_IRON.right, 1)).join("") + T.face([[0.27, -0.05, 15], [0.27, 0.05, 15], [0.27, 0.05, 21], [0.27, -0.05, 21]], "#3A2418", ` stroke="${WALL.top}" stroke-width="0.8"`) + T.gable(-0.27, -0.23, 0.27, 0.23, 25, 12, { front: THATCH.front, back: THATCH.back, gable: BARN.right }, 0.06) + [-0.15, 0, 0.15].map((du) => ln2(T.p(du, 0.2, 26), T.p(du + 0.03, 0.04, 34), "rgba(150,105,40,.45)", 0.7)).join("");
      for (let k = 0; k < 7; k++) {
        const a = T.p(-0.33 + k * 0.094, 0.29, 25), b = T.p(-0.33 + (k + 1) * 0.094, 0.29, 25);
        out += `<path d="M${f22(a[0])},${f22(a[1])} Q${f22((a[0] + b[0]) / 2)},${f22((a[1] + b[1]) / 2 + 2.6)} ${f22(b[0])},${f22(b[1])}" stroke="${OUT}" stroke-width="0.6" fill="${THATCH.back}"/>`;
      }
      out += ln2(T.p(-0.05, 0.27, 0), T.p(-0.05, 0.23, 8), WOOD.right, 1) + ln2(T.p(0.05, 0.27, 0), T.p(0.05, 0.23, 8), WOOD.right, 1) + [2, 4.6, 7].map((z) => ln2(T.p(-0.05, 0.27 - z * 5e-3, z), T.p(0.05, 0.27 - z * 5e-3, z), WOOD.top, 0.8)).join("") + T.box(0.18, 0.28, 0.36, 0.4, 0, 7, STRAW) + ln2(T.p(0.27, 0.4, 0), T.p(0.27, 0.4, 7), "#9A7A3A", 0.6) + ln2(T.p(0.36, 0.34, 0), T.p(0.36, 0.34, 7), "#9A7A3A", 0.6);
      const sack = /* @__PURE__ */ __name((du, dv) => {
        const [sx, sy] = T.p(du, dv, 0);
        return ell2(sx + 1, sy + 0.4, 4.6, 1.4, "rgba(40,55,20,.22)") + `<path d="M${f22(sx - 3.6)},${f22(sy)} C${f22(sx - 4.4)},${f22(sy - 4)} ${f22(sx - 3)},${f22(sy - 7)} ${f22(sx - 1.4)},${f22(sy - 7.6)} L${f22(sx + 1.6)},${f22(sy - 7.6)} C${f22(sx + 3)},${f22(sy - 7)} ${f22(sx + 4.4)},${f22(sy - 4)} ${f22(sx + 3.6)},${f22(sy)} Z" fill="#E2CFA0" stroke="${OUT}" stroke-width="0.5"/>` + ln2([sx - 1.6, sy - 7], [sx + 1.6, sy - 7], "#8A6A3A", 0.8) + ell2(sx, sy - 7.8, 1.4, 0.5, "#E8C860");
      }, "sack");
      out += sack(-0.34, 0.26) + sack(-0.24, 0.36);
      const [mx, my] = T.p(-0.18, 0.4, 0), peek = f % 3 === 0 ? 0 : 1.4;
      out += ell2(mx + peek, my - 1.2, 1.8, 1.2, "#9A9094", ` stroke="${OUT}" stroke-width="0.4"`) + dot2(mx + peek + 1.2, my - 2.4, 0.8, "#C8B4BA") + dot2(mx + peek + 1.8, my - 1.2, 0.35, "#2A2024") + dot2(mx + peek + 2.6, my - 1, 0.3, "#E58A8F") + `<path d="M${f22(mx + peek - 1.6)},${f22(my - 1)} q-2,0.6 -2.6,-1.6" stroke="#9A9094" stroke-width="0.4" fill="none"/>`;
      return out + pigeon;
    }, "draw")
  }]
};
var enclos = {
  layers: [{
    frame: [-36, -42, 72, 60],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const R = 0.43;
      const corners = [[-R, -R], [R, -R], [R, R], [-R, R]];
      const sideRails = /* @__PURE__ */ __name((a2, b) => [a2, [(a2[0] + b[0]) / 2, (a2[1] + b[1]) / 2], b].map((p) => post(T, p[0], p[1], 0, 11)).join("") + rail(T, a2, b, 4.5) + rail(T, a2, b, 8.6), "sideRails");
      const back = sideRails(corners[3], corners[0]) + sideRails(corners[0], corners[1]);
      const front = sideRails(corners[1], corners[2]) + sideRails(corners[2], corners[3]);
      const a = f / n * TAU;
      const [px, py] = T.p(0.13 + Math.cos(a) * 0.12, 0.12 + Math.sin(a) * 0.08, 0);
      const pigBody = pig(px, py, Math.sin(a) > 0, f % 2 ? 1 : -1);
      const [sx, sy] = T.p(-0.16, -0.12, 0);
      const sheepBody = sheep(sx, sy, false, f % 4 < 2);
      const beasts = Math.sin(a) * 0.08 + 0.12 > -0.12 ? sheepBody + pigBody : pigBody + sheepBody;
      const tuft3 = /* @__PURE__ */ __name((du, dv, c) => {
        const [tx, ty] = T.p(du, dv, 0);
        return [-1.6, -0.5, 0.6, 1.6].map((o, i) => ln2([tx + o * 0.4, ty], [tx + o, ty - (3.2 + i % 2 * 1.4)], i % 2 ? "#8FB85A" : "#6F9A44", 0.7)).join("") + (c ? dot2(tx + 0.6, ty - 4.6, 0.9, c) : "");
      }, "tuft");
      const [hx, hy] = T.p(-0.3, -0.3, 0);
      const shine = f % n / n;
      return patch(T, 0.45, "#A9B86A", "") + patch(T, 0.38, "#B79E6E", "") + [[-0.47, 0.1, "#F2C04B"], [0.1, 0.47, "#FFFFFF"], [0.47, -0.2, null], [-0.2, 0.47, "#E89AC0"]].map(([du, dv, c]) => tuft3(du, dv, c)).join("") + back + T.box(-0.38, -0.36, -0.22, -0.24, 0, 6, STRAW) + [1.5, 3, 4.5].map((z) => ln2(T.p(-0.38, -0.24, z), T.p(-0.22, -0.24, z), "rgba(160,120,50,.5)", 0.5)).join("") + ln2(T.p(-0.38, -0.24, 2), T.p(-0.22, -0.24, 2), "#8A6A3A", 0.6) + ln2(T.p(-0.38, -0.24, 4.6), T.p(-0.22, -0.24, 4.6), "#8A6A3A", 0.6) + [[-6, 1], [-3, 2.4], [2, 1.6]].map(([dx, dy]) => ln2([hx + dx, hy + dy + 4], [hx + dx + 2, hy + dy + 3], "#E2C66E", 0.6)).join("") + T.disc(0.16, -0.14, 0, 0.13, MUD) + T.disc(0.12 + shine * 0.06, -0.16, 0.2, 0.05, "rgba(255,255,255,.22)") + [[0.02, -0.04], [0.3, -0.06], [0.2, 0]].map(([du, dv]) => dot2(...T.p(du, dv, 0), 0.8, MUD)).join("") + T.box(-0.3, 0.12, -0.22, 0.32, 0, 4, WOOD_DARK) + T.face([[-0.29, 0.14, 4], [-0.23, 0.14, 4], [-0.23, 0.3, 4], [-0.29, 0.3, 4]], "#4C9CC8") + beasts + front;
    }, "draw")
  }]
};
var VEINS = [
  { rock: { top: "#DAD7CF", left: "#ADA99F", right: "#86827A" }, vein: "#FFFFFF", ore: "#F4F1E8" },
  { rock: { top: "#D9C3A8", left: "#B49678", right: "#8C6F55" }, vein: "#E8873A", ore: "#F2A35A" },
  { rock: { top: "#BAC1CD", left: "#8F98A7", right: "#6B7383" }, vein: "#7FC7F0", ore: "#B6E6FF" }
];
var filon = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, f, n, variant) => {
      const look = VEINS[variant % 3];
      const kind = variant % 3;
      const [x, y] = T.p(-0.04, -0.02, 0);
      const [cx0, cy0] = T.p(0, 0, 0);
      let out = ell2(cx0, cy0 + 1, 31, 12.6, "#C9BFAE", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(cx0 - 4, cy0, 21, 7.6, "#D6CDBE") + [[-22, 5], [18, 8], [-6, 10], [24, 0], [10, -7]].map(([dx, dy], i) => ell2(cx0 + dx, cy0 + dy, 1.2 + i % 2 * 0.4, 0.8, look.rock.left, ` stroke="${OUT}" stroke-width="0.3"`)).join("");
      const veins = [[[-12, -5], [-7, -9], [-2, -7], [2, -11]], [[-6, -2], [-1, -5], [5, -3]], [[4, -8], [9, -6]]].map((pts3) => `<polyline points="${pts3.map(([a, b]) => `${f22(x + a)},${f22(y + b)}`).join(" ")}" fill="none" stroke="${look.vein}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`).join("");
      const nuggets = [[-7, -9], [3, -4], [-11, -4], [2, -11], [8, -7]].map(([a, b], k) => poly2([[x + a, y + b - 1.7], [x + a + 1.7, y + b], [x + a, y + b + 1.5], [x + a - 1.6, y + b]], k % 2 ? look.ore : look.vein, ` stroke="${OUT}" stroke-width="0.3"`)).join("");
      out += T.shadow(0.02, 0, 0.4, 0.22) + boulder(T.u - 0.04, T.v - 0.02, 0.32, 0.28, 17, look.rock, 3 + variant, 0.22, 0.78) + veins + nuggets;
      const [tx, ty] = T.p(-0.08, -0.06, 15);
      if (kind === 1) {
        out += [[-5, 1, 2.6], [-1, -1, 3.2], [3.4, 0.6, 2.4], [1, 2, 2]].map(([dx, dy, r]) => ell2(tx + dx, ty + dy, r, r * 0.7, "#5FAE7A", ` stroke="${OUT}" stroke-width="0.4"`) + ell2(tx + dx - r * 0.3, ty + dy - r * 0.25, r * 0.4, r * 0.25, "#9FE0B0")).join("") + [[-3, 1.4], [2, -0.6]].map(([dx, dy]) => ell2(tx + dx, ty + dy, 1.4, 1, "#E8873A", ` stroke="${OUT}" stroke-width="0.3"`)).join("");
      } else {
        const big2 = kind === 2 ? 1.35 : 1;
        const c = kind === 2 ? { l: "#9ED8F6", r: "#5FA8D8" } : { l: "#FFFFFF", r: "#D8DCE4" };
        out += [[-5, 1, 7, -1.6, 1.8], [0, -1, 10, 0.6, 2.2], [4.4, 1.2, 6, 2, 1.6]].map(([dx, dy, h, lean, w]) => {
          const bx = tx + dx, by = ty + dy, H = h * big2, W = w * big2;
          return poly2([[bx - W, by], [bx, by + W * 0.45], [bx + W, by], [bx + lean, by - H]], c.l, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + poly2([[bx, by + W * 0.45], [bx + W, by], [bx + lean, by - H]], c.r) + ln2([bx - W * 0.4, by - H * 0.15], [bx + lean * 0.7 - W * 0.1, by - H * 0.75], "rgba(255,255,255,.85)", 0.6);
        }).join("");
      }
      out += boulder(T.u - 0.06, T.v + 0.32, 0.1, 0.09, 5, look.rock, 7 + variant, 0.25, 0.85) + ln2(T.p(0.4, 0.04, 0), T.p(0.3, -0.06, 15), WOOD.right, 1.8) + ln2(T.p(0.4, 0.04, 0.6), T.p(0.3, -0.06, 15.6), WOOD.top, 0.6) + `<path d="M${f22(T.p(0.24, -0.04, 13)[0])},${f22(T.p(0.24, -0.04, 13)[1])} Q${f22(T.p(0.3, -0.06, 18)[0])},${f22(T.p(0.3, -0.06, 18)[1] - 2)} ${f22(T.p(0.38, -0.1, 13)[0])},${f22(T.p(0.38, -0.1, 13)[1])}" stroke="${IRON.right}" stroke-width="2" fill="none" stroke-linecap="round"/>` + T.pebble(-0.36, 0.26, 0.55, look.rock) + T.pebble(-0.18, 0.38, 0.42, look.rock);
      out += [0.17, 0.29].map((v) => ln2(T.p(0.16, v, 0.4), T.p(0.5, v, 0.4), DARK_IRON.left, 0.9)).join("") + [0.2, 0.3, 0.4].map((u) => ln2(T.p(u, 0.14, 0.2), T.p(u, 0.32, 0.2), WOOD_DARK.left, 1.2)).join("") + T.box(0.25, 0.17, 0.43, 0.29, 1.6, 7, WOOD_DARK) + ln2(T.p(0.25, 0.29, 4.4), T.p(0.43, 0.29, 4.4), DARK_IRON.right, 0.8) + ln2(T.p(0.43, 0.29, 4.4), T.p(0.43, 0.17, 4.4), DARK_IRON.right, 0.8) + [[0.29, 0.29], [0.39, 0.29]].map(([u, v]) => {
        const [wx, wy] = T.p(u, v, 1.6);
        return ell2(wx, wy, 1.4, 1.8, DARK_IRON.right, ` stroke="${OUT}" stroke-width="0.4"`) + dot2(wx, wy, 0.4, IRON.top);
      }).join("") + [[0.3, 0.21], [0.37, 0.24], [0.33, 0.25], [0.39, 0.2], [0.34, 0.21]].map(([u, v], i) => {
        const [ox, oy] = T.p(u, v, 7.6 + (i === 4 ? 1.6 : 0));
        return poly2([[ox - 1.8, oy], [ox - 0.6, oy - 1.6], [ox + 1.6, oy - 0.8], [ox + 1, oy + 0.6]], i % 2 ? look.ore : look.rock.left, ` stroke="${OUT}" stroke-width="0.4"`);
      }).join("");
      const glints = [[-7, -9], [3, -4], [2, -11], [-11, -4], [8, -7], [-2, -7]];
      const [gx, gy] = glints[f % glints.length];
      return out + star(x + gx, y + gy, 2.6 + f % 2, "#FFFFFF", 0.95);
    }, "draw")
  }]
};
var depot = {
  layers: [{
    frame: [-34, -50, 68, 68],
    n: 6,
    fps: 2,
    draw: /* @__PURE__ */ __name((T, f) => {
      const PALE = { top: "#ECE6D8", left: "#CFC6B2", right: "#A69C88" };
      const block2 = /* @__PURE__ */ __name((du, dv, z, k) => {
        const c = k % 2 ? PALE : STONE;
        const [mx, my] = T.p(du, dv + 0.09, z + 3.2);
        return { d: du + dv + z * 1e-3, svg: T.box(du - 0.1, dv - 0.09, du + 0.1, dv + 0.09, z, z + 6.5, c) + ln2(T.p(du - 0.1, dv + 0.09, z + 3.2), T.p(du + 0.1, dv + 0.09, z + 3.2), "rgba(120,110,95,.35)", 0.5) + ln2([mx - 3, my - 1.4], [mx - 1.6, my + 0.4], "rgba(120,110,95,.45)", 0.5) + ln2([mx + 1.4, my - 1], [mx + 2.6, my + 0.6], "rgba(120,110,95,.45)", 0.5) + ln2(T.p(du - 0.06, dv - 0.04, z + 6.5), T.p(du + 0.04, dv - 0.06, z + 6.5), "rgba(255,255,255,.6)", 0.7) };
      }, "block");
      const stack = [
        block2(-0.11, -0.1, 3, 0),
        block2(0.11, -0.1, 3, 1),
        block2(-0.11, 0.1, 3, 1),
        block2(0.11, 0.1, 3, 0),
        block2(0, -0.1, 9.5, 0),
        block2(0, 0.1, 9.5, 1),
        block2(0, 0, 16, 1)
      ].sort((a, b) => a.d - b.d || 0).map((b) => b.svg).join("");
      const [bx, by] = T.p(0, 0, 22.5);
      const hop = f === 2 ? 1.6 : 0;
      const [gx, gy] = T.p(0, 0, 0);
      let out = ell2(gx, gy + 1, 30, 14, "#D8CFBC", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 20, 8, "#E4DCCB") + [[-22, 4, 1.4], [18, 8, 1.2], [-8, 10, 1], [24, -2, 1.1], [-26, -3, 0.9]].map(([dx, dy, r]) => ell2(gx + dx, gy + dy, r * 1.4, r, "#A69C88", ` stroke="${OUT}" stroke-width="0.4"`)).join("") + T.shadow(0, 0, 0.4, 0.2) + post(T, -0.32, -0.3, 0, 14, WOOD, 0.016) + post(T, -0.18, -0.36, 0, 14, WOOD, 0.016) + T.face([[-0.33, -0.31, 8], [-0.17, -0.37, 8], [-0.17, -0.37, 15], [-0.33, -0.31, 15]], "#3D4148", EDGE) + [9.6, 11.2, 12.8].map((z) => ln2(T.p(-0.31, -0.32, z), T.p(-0.22, -0.355, z), "rgba(255,255,255,.7)", 0.4)).join("") + ln2(T.p(-0.3, -0.32, 9), T.p(-0.24, -0.345, 13.4), "rgba(255,255,255,.7)", 0.4) + T.box(-0.3, -0.26, 0.3, 0.26, 0, 3, WOOD_DARK) + [-0.18, 0, 0.18].map((du) => ln2(T.p(du, 0.26, 3), T.p(du, -0.26, 3), WOOD.top, 0.8)).join("") + stack + bird(bx + 1, by - hop, { body: "#8B6A4A", breast: "#D8C2A0", wing: "#6E5236", peck: f === 4 ? 1 : 0 });
      const [px, py] = T.p(-0.32, 0.2, 0);
      out += ln2([px, py], [px + 4, py - 15], WOOD.right, 1.6) + ln2([px + 0.6, py - 0.4], [px + 4.4, py - 14.6], WOOD.top, 0.6) + `<path d="M${f22(px - 1.6)},${f22(py - 13)} Q${f22(px + 4)},${f22(py - 17.6)} ${f22(px + 10)},${f22(py - 14)} Q${f22(px + 4.4)},${f22(py - 15.4)} ${f22(px - 1.6)},${f22(py - 13)} Z" fill="${IRON}" stroke="${OUT}" stroke-width="0.6"/>`;
      out += T.box(0.26, 0.2, 0.44, 0.4, 0, 2, WOOD) + ln2(T.p(0.44, 0.2, 1), T.p(0.48, 0.22, 3), WOOD.right, 1.2) + ln2(T.p(0.44, 0.4, 1), T.p(0.48, 0.42, 3), WOOD.right, 1.2) + T.box(0.28, 0.22, 0.36, 0.3, 2, 7, STONE) + T.box(0.33, 0.3, 0.42, 0.38, 2, 6, PALE) + ln2(T.p(0.3, 0.3, 4.4), T.p(0.42, 0.38, 4.2), "#C9A86A", 0.9) + ln2(T.p(0.5, 0.3, 3), T.p(0.56, 0.24, 6), "#C9A86A", 0.7) + [[0.18, 0.34], [0.08, 0.4], [0.22, 0.44]].map(([du, dv]) => {
        const [x, y] = T.p(du, dv, 0);
        return poly2([[x - 1.2, y], [x, y - 1.4], [x + 1.4, y - 0.2]], PALE.left, ` stroke="${OUT}" stroke-width="0.4"`);
      }).join("");
      return out;
    }, "draw")
  }]
};
var taille = {
  light: /* @__PURE__ */ __name(() => [-0.33, -0.3, 25, 14], "light"),
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const [bx, by] = T.p(0.18, -0.1, 9);
      let out = ell2(x, y + 1, 31, 12.6, "#E6D8BC", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 21, 7.6, "#EFE4CC") + [[-20, 4], [14, 8], [22, 0], [-6, 10], [6, 3], [10, -3]].map(([dx, dy], i) => poly2([[x + dx - 1.2, y + dy], [x + dx, y + dy - 1.2], [x + dx + 1.4, y + dy - 0.2]], i % 2 ? "#D6CEBF" : "#F2EEE6", ` stroke="${OUT}" stroke-width="0.3"`)).join("") + T.shadow(0, 0, 0.34, 0.18);
      const [lx, ly] = T.p(-0.33, -0.23, 20.4);
      out += post(T, -0.33, -0.3, 0, 24) + ln2(T.p(-0.33, -0.3, 24), T.p(-0.33, -0.22, 24), WOOD_DARK.right, 1.2) + ln2(T.p(-0.33, -0.23, 24), [lx, ly - 1.6], "#3D3A36", 0.5) + poly2([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + `<rect x="${f22(lx - 1.8)}" y="${f22(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>` + ell2(lx, ly + 2, 1, 1.2, "#FFF3C4") + poly2([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + T.box(-0.34, -0.36, -0.12, -0.18, 0, 7, STONE) + T.box(-0.3, -0.33, -0.18, -0.21, 7, 12, STONE) + ln2(T.p(-0.34, -0.18, 3.5), T.p(-0.12, -0.18, 3.5), "rgba(120,110,95,.4)", 0.5);
      const [ox, oy] = T.p(-0.22, -0.25, 12);
      out += `<g transform="translate(${f22(ox)} ${f22(oy)}) scale(.62) translate(${f22(-ox)} ${f22(-oy)})">` + ell2(ox, oy - 4, 3.4, 4.2, "#EDE7DB", ` stroke="${OUT}" stroke-width="0.5"`) + poly2([[ox - 3, oy - 7], [ox - 2.2, oy - 9.6], [ox - 1, oy - 7.6]], "#EDE7DB", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + poly2([[ox + 1, oy - 7.6], [ox + 2.2, oy - 9.6], [ox + 3, oy - 7]], "#EDE7DB", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + `<circle cx="${f22(ox - 1.2)}" cy="${f22(oy - 5.8)}" r="1.1" fill="none" stroke="#9B927F" stroke-width="0.5"/><circle cx="${f22(ox + 1.2)}" cy="${f22(oy - 5.8)}" r="1.1" fill="none" stroke="#9B927F" stroke-width="0.5"/>` + poly2([[ox - 0.5, oy - 5], [ox + 0.5, oy - 5], [ox, oy - 4]], "#B7AE9D") + `<path d="M${f22(ox - 2)},${f22(oy - 2.4)} q2,1.2 4,0" stroke="#B7AE9D" stroke-width="0.5" fill="none"/></g>`;
      out += [[-0.3, 0.04], [0, 0.04], [-0.3, 0.22], [0, 0.22]].map(([a, b]) => post(T, a, b, 0, 10, WOOD_DARK, 0.018)).join("") + ln2(T.p(-0.3, 0.22, 3), T.p(0, 0.22, 3), WOOD_DARK.right, 1) + T.box(-0.32, 0.02, 0.02, 0.24, 10, 12.5, WOOD) + ln2(T.p(-0.2, 0.12, 13), T.p(-0.08, 0.16, 13), WOOD.right, 1.6) + T.box(-0.24, 0.09, -0.18, 0.15, 12.5, 16, WOOD_DARK) + [-0.06, -0.02, 0.02].map((u, i) => ln2(T.p(u - 0.04, 0.04 + i * 0.03, 12.8), T.p(u + 0.04, 0.08 + i * 0.03, 12.8), i % 2 ? IRON.left : IRON.right, 0.9) + dot2(...T.p(u - 0.04, 0.04 + i * 0.03, 12.8), 0.7, WOOD.left)).join("");
      out += T.box(0.08, -0.2, 0.28, 0, 0, 9, STONE) + [[0.1, 0, 3], [0.2, 0, 6.4], [0.28, -0.1, 4.4]].map(([u, v, z]) => {
        const [cx, cy] = T.p(u, v, z);
        return ln2([cx - 1.4, cy - 1], [cx + 1, cy + 0.8], "rgba(120,110,95,.5)", 0.5);
      }).join("") + T.box(0.11, -0.17, 0.25, -0.03, 9, 15, { top: "#EDE7DB", left: "#D6CEBF", right: "#B7AE9D" }) + `<path d="M${f22(bx - 7)},${f22(by - 6)} C${f22(bx - 7)},${f22(by - 12)} ${f22(bx - 3)},${f22(by - 13)} ${f22(bx)},${f22(by - 13)} C${f22(bx + 3)},${f22(by - 13)} ${f22(bx + 7)},${f22(by - 12)} ${f22(bx + 7)},${f22(by - 6)} Z" fill="#F2EEE6" stroke="${OUT}" stroke-width="0.5"/><rect x="${f22(bx - 1.6)}" y="${f22(by - 16)}" width="3.2" height="4" fill="#E9E3D8"/><ellipse cx="${f22(bx)}" cy="${f22(by - 19.4)}" rx="3.4" ry="4.4" fill="#F7F4EE" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(bx - 3.4)},${f22(by - 20.4)} q3.4,-5.6 6.8,0 q-1.2,-2 -3.4,-2.2 q-2.2,0.2 -3.4,2.2 Z" fill="#DCD5C8"/><path d="M${f22(bx + 0.6)},${f22(by - 19.6)} l1.2,2 l-1.2,0.3" stroke="#B9B0A0" stroke-width="0.5" fill="none"/>` + dot2(bx - 1.2, by - 19.8, 0.35, "#9B927F") + dot2(bx + 1.6, by - 19.8, 0.35, "#9B927F") + `<path d="M${f22(bx - 1.2)},${f22(by - 17.2)} q1.2,0.8 2.4,0" stroke="#B9B0A0" stroke-width="0.4" fill="none"/>` + ln2([bx - 6, by - 7.4], [bx - 4, by - 9.6], "rgba(155,146,127,.5)", 0.5) + ln2([bx + 4.4, by - 9.6], [bx + 6, by - 7.6], "rgba(155,146,127,.5)", 0.5);
      out += [0, 1, 2].map((k) => {
        const p = (f + k * 2) % n / n;
        return puff(bx + 6 + k * 2 + p * 4, by - 10 - p * 8, 1.4 + p * 2.4, 0.55 * (1 - p));
      }).join("") + T.pebble(0.32, 0.18, 0.35, STONE) + T.pebble(0.2, 0.3, 0.3, STONE);
      return out;
    }, "draw")
  }]
};
var coupe = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n, variant) => {
      const kind = variant % 3;
      const [x, y] = T.p(0, 0, 0);
      const fern = /* @__PURE__ */ __name((du, dv, s, ph) => {
        const [fx, fy] = T.p(du, dv, 0);
        return [-1, 0, 1].map((i) => {
          const a = i * 0.7 + wave(f, n, 0.08, ph);
          const ex = fx + Math.sin(a) * 7 * s, ey = fy - Math.cos(a) * 6 * s;
          let d = `M${f22(fx)},${f22(fy)} Q${f22((fx + ex) / 2 - i)},${f22((fy + ey) / 2 - 1)} ${f22(ex)},${f22(ey)}`;
          for (let j = 1; j < 4; j++) {
            const t = j / 4, px = fx + (ex - fx) * t, py = fy + (ey - fy) * t;
            d += ` M${f22(px)},${f22(py)} l${f22(-1.6 * s)},${f22(0.6 * s)} M${f22(px)},${f22(py)} l${f22(1.6 * s)},${f22(0.4 * s)}`;
          }
          return `<path d="${d}" stroke="${i ? "#5E8C3A" : "#7FAE4E"}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
        }).join("");
      }, "fern");
      const shroom = /* @__PURE__ */ __name((sx, sy, s) => ln2([sx, sy], [sx, sy - 2.4 * s], "#F2E8D4", 1.2 * s) + `<path d="M${f22(sx - 2.2 * s)},${f22(sy - 2.2 * s)} Q${f22(sx)},${f22(sy - 5 * s)} ${f22(sx + 2.2 * s)},${f22(sy - 2.2 * s)} Z" fill="#D9473A" stroke="${OUT}" stroke-width="0.4"/>` + dot2(sx - 0.8 * s, sy - 3.2 * s, 0.4 * s, "#FFFFFF") + dot2(sx + 0.8 * s, sy - 3.6 * s, 0.35 * s, "#FFFFFF"), "shroom");
      let out = ell2(x, y + 1, 31, 12.6, "#8FB45E", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 3, y, 21, 7.6, "#A7C66E") + [[-20, 4, "#D9963A"], [16, 8, "#C8642E"], [22, -2, "#E2B347"], [-8, 9, "#C8642E"], [6, -8, "#D9963A"]].map(([dx, dy, c], i) => `<path d="M${x + dx},${y + dy} q1.6,-1.6 3.2,0 q-1.6,1.4 -3.2,0 Z" fill="${c}" transform="rotate(${i * 40} ${x + dx + 1.6} ${y + dy})"/>`).join("") + T.shadow(0, 0, 0.34, 0.16);
      for (const [du, dv] of [[-0.3, 0.22], [0.26, 0.3], [-0.1, -0.32], [0.32, -0.12]]) out += dot2(...T.p(du, dv, 0), 0.9, "#E7C08A");
      if (kind === 0) {
        out += fern(-0.4, -0.12, 0.9, 0) + log(T, -0.14, -0.26, 0.2, 3.6, 3.6) + log(T, 0.02, -0.26, 0.2, 3.6, 3.6) + log(T, 0.18, -0.26, 0.2, 3.6, 3.6) + log(T, -0.06, -0.24, 0.18, 10.4, 3.5) + log(T, 0.1, -0.24, 0.18, 10.4, 3.5) + log(T, 0.02, -0.22, 0.16, 17, 3.4) + [[-0.12, -0.1, 6.6], [0.08, -0.06, 13.4], [0.2, 0.02, 6.4]].map(([du, dv, z]) => {
          const [mx, my] = T.p(du, dv, z);
          return ell2(mx, my, 2.6, 1, "#7E9A52") + ell2(mx - 0.6, my - 0.3, 1.2, 0.5, "#9DB86A");
        }).join("") + stumpAt(T, 0.3, 0.28, 5, 0.07, "st0");
        const [hx, hy] = T.p(0.3, 0.28, 5);
        out += ln2([hx + 0.6, hy - 1], [hx + 5.4, hy - 8.6], WOOD.right, 1.4) + poly2([[hx - 2.4, hy + 0.4], [hx + 1.6, hy - 2.2], [hx + 2.4, hy - 0.4], [hx - 1, hy + 1.6]], IRON.left, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`);
        const hop = f === 2 ? 1.5 : 0;
        const [rx, ry] = T.p(0.02, 0.16, 20.6);
        out += `<g transform="translate(${f22(rx - 2)} ${f22(ry)}) scale(.7) translate(${f22(2 - rx)} ${f22(-ry)})">` + bird(rx - 2, ry - hop, { body: "#8B5A3C", breast: "#E86A3A", wing: "#6E4428", peck: f === 4 ? 1 : 0 }) + "</g>";
      } else if (kind === 1) {
        out += fern(0.38, -0.3, 0.8, 1) + fern(-0.42, 0.04, 0.9, 2) + stumpAt(T, -0.2, -0.14, 6, 0.09, "st1") + stumpAt(T, 0.18, -0.2, 4, 0.08, "st2") + stumpAt(T, 0.06, 0.2, 5, 0.085, "st3");
        const [s1x, s1y] = T.p(-0.2, -0.04, 1.5), [s3x, s3y] = T.p(0.14, 0.26, 1);
        out += shroom(s1x + 3, s1y, 0.9) + shroom(s1x + 5.6, s1y + 0.8, 0.7) + shroom(s3x + 2, s3y, 0.8);
        const sway = wave(f, n, 1.4);
        out += sapling(...T.p(-0.24, 0.2, 0), 0.9, sway) + sapling(...T.p(0.28, 0.06, 0), 0.75, wave(f, n, 1.2, 1.7));
        const [lx, ly] = T.p(-0.02 + f % 3 * 0.04, 0.42, 0), up2 = f % 2 ? 2.4 : 0;
        out += ell2(lx, ly + 0.4, 3.6, 1, "rgba(40,55,20,.22)") + ell2(lx, ly - 2.6 - up2, 3.6, 2.6, "#C8B49A", ` stroke="${OUT}" stroke-width="0.5"`) + dot2(lx - 3.4, ly - 3 - up2, 1.2, "#FFFFFF") + `<circle cx="${f22(lx + 3)}" cy="${f22(ly - 4.8 - up2)}" r="2" fill="#C8B49A" stroke="${OUT}" stroke-width="0.5"/><ellipse cx="${f22(lx + 2.2)}" cy="${f22(ly - 8.2 - up2)}" rx="0.9" ry="2.4" fill="#C8B49A" stroke="${OUT}" stroke-width="0.4" transform="rotate(-12 ${f22(lx + 2.2)} ${f22(ly - 8.2 - up2)})"/><ellipse cx="${f22(lx + 3.6)}" cy="${f22(ly - 8)}" rx="0.9" ry="2.4" fill="#C8B49A" stroke="${OUT}" stroke-width="0.4" transform="rotate(14 ${f22(lx + 3.6)} ${f22(ly - 8)}) translate(0 ${f22(-up2)})"/>` + dot2(lx + 3.8, ly - 5 - up2, 0.4, "#2A2024") + dot2(lx + 4.9, ly - 4.4 - up2, 0.35, "#E58A8F");
      } else {
        out += fern(-0.4, 0.2, 0.9, 1.4);
        const legs = [-0.16, 0.16].map((dv) => ln2(T.p(-0.12, dv, 0), T.p(0.12, dv, 14), WOOD_DARK.right, 1.6) + ln2(T.p(0.12, dv, 0), T.p(-0.12, dv, 14), WOOD_DARK.right, 1.6)).join("");
        out += T.disc(0.18, 0.2, 0, 0.1, "#E9C990") + legs + log(T, 0, -0.3, 0.26, 14, 3.8);
        const s = Math.sin(f / n * TAU) * 0.08;
        const [ax, ay] = T.p(0.03, 0.1 + s, 15), [bx, by] = T.p(0.03, 0.34 + s, 22);
        out += poly2([[ax - 1, ay + 1.6], [bx - 1, by - 0.4], [bx + 1, by - 2.4], [ax + 1, ay - 0.4]], "#D4DAE2", ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + `<path d="M${f22(bx - 1)},${f22(by - 0.6)} l2.6,-4 l2,2.2 l-2.4,3.4 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>` + [0.2, 0.35, 0.5, 0.65, 0.8].map((t) => {
          const px = ax - 1 + (bx - ax) * t, py = ay + 1.6 + (by - 0.4 - ay - 1.6) * t;
          return ln2([px, py], [px + 0.5, py + 0.9], IRON.right, 0.5);
        }).join("") + [0, 1, 2].map((i) => {
          const t = (f + i * 2) % n / n;
          const [dx, dy] = T.p(0.04, 0.1, 13 - t * 12);
          return dot2(dx + i - 1, dy, 0.6, "#E7C08A");
        }).join("");
        out += [[0.3, -0.24, 0], [0.36, -0.12, 0], [0.33, -0.18, 2.4]].map(([du, dv, z]) => {
          const [rx, ry] = T.p(du, dv, z);
          return ell2(rx, ry - 1.2, 2.8, 1.4, "#E7C08A", ` stroke="${WOOD.right}" stroke-width="0.6"`) + ell2(rx, ry - 1.2, 1.4, 0.7, "none", ` stroke="rgba(150,92,48,.5)" stroke-width="0.4"`);
        }).join("");
      }
      return out;
    }, "draw")
  }]
};
var remise = {
  light: /* @__PURE__ */ __name(() => [0.22, 0.27, 16, 14], "light"),
  layers: [{
    frame: [-36, -60, 72, 78],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 33, 13.6, "#B89A6E", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 22, 8, "#C8AC80") + [[-20, 6], [8, 10], [22, 4], [14, 11], [-8, 10]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join("") + T.shadow(0, 0, 0.38, 0.2);
      let pile = "";
      for (let row = 0; row < 5; row++) {
        for (let k = 0; k < 6; k++) {
          const du = -0.24 + k * 0.095 + row % 2 * 0.045;
          if (du > 0.27) continue;
          const [px, py] = T.p(du, 0.08, 2.6 + row * 4.4);
          pile += logEnd(px, py, 2.4) + ((row + k) % 4 === 0 ? `<path d="M${f22(px - 1.6)},${f22(py - 1.6)} l3.2,3.2" stroke="rgba(150,92,48,.5)" stroke-width="0.4"/>` : "");
        }
      }
      out += T.box(-0.33, -0.3, 0.33, -0.25, 0, 26, WOOD) + planksLeft(T.u - 0.33, T.u + 0.33, T.v - 0.25, 0, 26, 4.6) + T.box(-0.33, -0.25, -0.28, 0.2, 0, 24, WOOD) + pile;
      out += post(T, 0.3, 0.24, 0, 31) + post(T, -0.3, 0.24, 0, 31) + T.face([[-0.38, -0.34, 27], [0.38, -0.34, 27], [0.38, 0.3, 32], [-0.38, 0.3, 32]], "#A9703F", EDGE);
      for (const t of [0.2, 0.4, 0.6, 0.8]) {
        const v = -0.34 + 0.64 * t, z = 27 + 5 * t;
        out += ln2(T.p(-0.38, v, z), T.p(0.38, v, z), "rgba(90,55,25,.45)", 0.6);
        for (let i = 0; i < 7; i++) {
          const u = -0.34 + i * 0.11 + (Math.round(t * 5) % 2 ? 0.055 : 0);
          if (u < 0.36) out += ln2(T.p(u, v, z), T.p(u, v + 0.128, z + 1), "rgba(90,55,25,.3)", 0.5);
        }
      }
      out += [[-0.26, 0.2, 2.6], [-0.14, 0.26, 1.8], [0.24, -0.1, 1.6]].map(([u, v, r]) => {
        const [mx, my] = T.p(u, v, 27 + 5 * ((v + 0.34) / 0.64));
        return ell2(mx, my, r * 1.4, r * 0.7, "#7E9A52") + ell2(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, "#9DB86A");
      }).join("") + T.face([[0.38, -0.34, 27], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [0.38, -0.34, 25.4]], "#7A4E2C", EDGE) + T.face([[-0.38, 0.3, 32], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [-0.38, 0.3, 30.4]], "#8B5A32", EDGE);
      const [lx, ly] = T.p(0.22, 0.27, 17.6);
      out += ln2(T.p(0.22, 0.27, 30.4), [lx, ly - 1.6], "#3D3A36", 0.5) + poly2([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + `<rect x="${f22(lx - 1.8)}" y="${f22(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>` + ln2([lx, ly], [lx, ly + 4], DARK_IRON.left, 0.4) + ell2(lx, ly + 2, 1, 1.2, "#FFF3C4") + poly2([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      const [gx, gy] = T.p(-0.3, 0.38, 0);
      out += ell2(gx, gy + 0.4, 7, 1.8, "rgba(40,55,20,.22)") + [-2, -1, 0, 1, 2].map((i) => ln2([gx - 6, gy - 2.4 + i * 0.6], [gx + 6, gy - 3.4 + i * 0.7], i % 2 ? "#8A6A40" : "#A07A4A", 1)).join("") + ln2([gx - 1, gy - 5], [gx - 0.6, gy - 0.4], "#C9A46A", 1.1) + ln2([gx + 2.4, gy - 5.4], [gx + 2.8, gy - 0.8], "#C9A46A", 1.1);
      out += `<g transform="translate(${f22(gx + 1)} ${f22(gy - 4.6)}) scale(.65) translate(${f22(-gx - 1)} ${f22(-gy + 4.6)})">` + bird(gx + 1, gy - 4.6, { body: "#8B6A4A", breast: "#E2703A", wing: "#6E5236" }) + "</g>";
      out += stumpAt(T, 0.24, 0.38, 6, 0.06, "bil");
      const [hx, hy] = T.p(0.24, 0.38, 6);
      out += ln2([hx + 0.6, hy - 1], [hx + 6, hy - 9], WOOD.right, 1.4) + ln2([hx + 0.9, hy - 1.2], [hx + 6.2, hy - 9.2], WOOD.top, 0.5) + poly2([[hx - 2.4, hy + 0.4], [hx + 1.6, hy - 2.2], [hx + 2.4, hy - 0.4], [hx - 1, hy + 1.6]], IRON.left, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + ln2([hx - 2, hy + 0.6], [hx - 0.6, hy + 1.4], IRON.top, 0.5) + log(T, 0.06, 0.32, 0.42, 1.8, 1.8) + log(T, -0.06, 0.34, 0.44, 1.8, 1.8) + [[0.34, 0.3], [0.14, 0.46]].map(([du, dv]) => {
        const [cx, cy] = T.p(du, dv, 0);
        return poly2([[cx - 2.2, cy], [cx, cy - 2.6], [cx + 2.2, cy - 0.4], [cx + 0.4, cy + 0.6]], STUMP.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }).join("");
      return out;
    }, "draw")
  }]
};
var pepiniere = {
  light: /* @__PURE__ */ __name(() => [0, 0, 12, 20, "255,236,170"], "light"),
  layers: [{
    frame: [-36, -60, 72, 78],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const pots = [];
      for (const z of [3, 11]) {
        for (const du of [-0.18, -0.06, 0.06, 0.18]) {
          const [x, y] = T.p(du, -0.08, z);
          pots.push(`<path d="M${f22(x - 2)},${f22(y - 3)} L${f22(x - 1.5)},${f22(y)} L${f22(x + 1.5)},${f22(y)} L${f22(x + 2)},${f22(y - 3)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/><circle cx="${f22(x)}" cy="${f22(y - 5)}" r="2.1" fill="${du * 10 % 2 ? LEAF_LIGHT : LEAF}"/><circle cx="${f22(x - 1)}" cy="${f22(y - 5.6)}" r="0.9" fill="#B3E386"/>` + ln2([x + 1.2, y - 2.6], [x + 1.8, y - 6.4], "#E8DCC0", 0.5) + `<rect x="${f22(x + 1.1)}" y="${f22(y - 7.6)}" width="1.6" height="1.2" fill="#F4ECDC"/>`);
        }
      }
      const g = f / n * 1.4 - 0.2;
      const glint = g > 0 && g < 1 ? T.face([[-0.28 + g * 0.5, 0.26, 2], [-0.22 + g * 0.5, 0.26, 2], [-0.12 + g * 0.5, 0.26, 21], [-0.18 + g * 0.5, 0.26, 21]], "rgba(255,255,255,.55)") : "";
      const [gx, gy] = T.p(0, 0, 0);
      return ell2(gx, gy + 1, 32, 13, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 22, 8, "#ADD27A") + ell2(...T.p(-0.3, 0.36, 0), 7, 2.6, "#8A6A46") + T.shadow(0, 0, 0.38, 0.18) + T.box(-0.3, -0.26, 0.3, 0.26, 0, 3, STONE) + T.box(-0.25, -0.16, 0.25, -0.02, 9, 10.5, WOOD) + pots.join("") + box(T.u - 0.3, T.v - 0.26, T.u + 0.3, T.v + 0.26, 3, 22, GLASS_FACES, GLASS_EDGE) + [-0.1, 0.1].map((du) => ln2(T.p(du, 0.26, 3), T.p(du, 0.26, 22), "rgba(255,255,255,.85)", 0.9)).join("") + ln2(T.p(0.3, 0, 3), T.p(0.3, 0, 22), "rgba(255,255,255,.85)", 0.9) + glint + gable(T.u - 0.3, T.v - 0.26, T.u + 0.3, T.v + 0.26, 22, 10, { front: "rgba(210,236,252,.55)", back: "rgba(180,215,238,.6)", gable: "rgba(160,205,232,.5)" }, 0.03, GLASS_EDGE) + T.face([[-0.05, 0.26, 3], [0.06, 0.26, 3], [0.06, 0.26, 16], [-0.05, 0.26, 16]], "rgba(160,205,232,.35)", GLASS_EDGE) + bucket(T, 0.34, 0.32, 0, 6, 3, 3.6, { top: "#9ACB8A", left: "#7DB46E", right: "#5D9A50" }, "arr", false) + ln2(T.p(0.3, 0.3, 5), T.p(0.22, 0.34, 9), "#5D9A50", 1.1) + (() => {
        const [kx, ky] = T.p(0.4, 0.06, 0);
        return ell2(kx + 1, ky + 0.4, 4.6, 1.4, "rgba(40,55,20,.22)") + `<path d="M${f22(kx - 3.6)},${f22(ky)} C${f22(kx - 4.4)},${f22(ky - 4)} ${f22(kx - 3)},${f22(ky - 7)} ${f22(kx - 1.4)},${f22(ky - 7.6)} L${f22(kx + 1.6)},${f22(ky - 7.6)} C${f22(kx + 3)},${f22(ky - 7)} ${f22(kx + 4.4)},${f22(ky - 4)} ${f22(kx + 3.6)},${f22(ky)} Z" fill="#B88A5A" stroke="${OUT}" stroke-width="0.5"/>` + ell2(kx, ky - 7.6, 1.8, 0.7, "#5A3A22") + ln2([kx - 2, ky - 4], [kx + 2, ky - 3.6], "#7FAE4E", 1.2) + dot2(kx, ky - 4.6, 0.8, "#E2574C") + poly2([[kx - 6.4, ky + 0.6], [kx - 4.6, ky + 0.6], [kx - 4.8, ky - 2.2], [kx - 6.2, ky - 2.2]], IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + ln2([kx - 5.5, ky - 2.2], [kx - 5.2, ky - 5.6], WOOD.right, 1.1);
      })() + [[-0.22, 0.36], [-0.32, 0.3]].map(([a, b]) => {
        const [x, y] = T.p(a, b, 0);
        return `<path d="M${f22(x - 2.4)},${f22(y - 3.4)} L${f22(x - 1.8)},${f22(y)} L${f22(x + 1.8)},${f22(y)} L${f22(x + 2.4)},${f22(y - 3.4)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/>${sapling(x, y - 3, 0.45, wave(f, n, 0.6, a * 9))}`;
      }).join("");
    }, "draw")
  }]
};
var citerne = {
  layers: [{
    frame: [-30, -62, 60, 78],
    n: 6,
    fps: 6,
    draw: /* @__PURE__ */ __name((T, f, n, variant) => {
      const kind = variant % 3;
      const [x, y] = T.p(0, 0, 0);
      const tuft3 = /* @__PURE__ */ __name((du, dv) => {
        const [tx, ty] = T.p(du, dv, 0);
        return [-1.6, -0.5, 0.6, 1.6].map((o, i) => ln2([tx + o * 0.4, ty], [tx + o, ty - (3.4 + i % 2 * 1.4)], i % 2 ? "#8FB85A" : "#6F9A44", 0.7)).join("");
      }, "tuft");
      let out = ell2(x, y + 1, 27, 11.4, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 3, y, 18, 7, "#ADD27A") + ell2(...T.p(0.22, 0.3, 0), 7.4, 2.8, "rgba(90,120,60,.35)") + ell2(...T.p(0.22, 0.32, 0), 5, 1.6, "rgba(110,180,220,.5)") + tuft3(-0.38, 0.1) + tuft3(0.36, -0.3) + T.shadow(0, 0, 0.32, 0.2);
      let spout;
      if (kind === 0) {
        out += [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([a, b]) => post(T, a, b, 0, 12, WOOD_DARK, 0.02)).join("") + ln2(T.p(-0.14, 0.14, 1), T.p(0.14, 0.14, 11), WOOD_DARK.right, 0.9) + ln2(T.p(0.14, 0.14, 1), T.p(-0.14, 0.14, 11), WOOD_DARK.right, 0.9) + ln2(T.p(0.14, 0.14, 1), T.p(0.14, -0.14, 11), WOOD_DARK.right, 0.9) + ln2(T.p(0.14, -0.14, 1), T.p(0.14, 0.14, 11), WOOD_DARK.right, 0.9) + T.box(-0.17, -0.17, 0.17, 0.17, 12, 14, WOOD) + T.cyl(0, 0, 14, 38, 0.2, { top: "#C99560", left: WOOD.left, right: WOOD.right }, "tonneau");
        const [cx, cy] = T.p(0, 0, 14);
        for (let i = 1; i < 6; i++) {
          const a = i / 6 * Math.PI;
          out += ln2([cx + 9 * Math.cos(a), cy + 4.5 * Math.sin(a)], [cx + 9 * Math.cos(a), cy + 4.5 * Math.sin(a) - 24], "rgba(90,55,30,.35)", 0.5);
        }
        out += [17, 26, 35].map((z) => {
          const [hx, hy] = T.p(0, 0, z);
          return `<path d="M${f22(hx - 9)},${f22(hy)} A9,4.5 0 0 0 ${f22(hx + 9)},${f22(hy)}" stroke="${DARK_IRON.right}" stroke-width="1.3" fill="none"/>`;
        }).join("");
        const [lx, ly] = T.p(0, 0, 38);
        out += ell2(lx, ly, 7.4, 3.7, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`) + ln2([lx - 5, ly - 0.4], [lx + 5, ly + 0.4], "rgba(90,55,30,.4)", 0.5) + `<path d="M${f22(lx - 2.6)},${f22(ly)} q2.6,-3 5.2,0" stroke="${WOOD_DARK.right}" stroke-width="1" fill="none"/>`;
        spout = T.p(0.1, 0.18, 16);
        out += ln2(T.p(0.06, 0.12, 17), spout, IRON.right, 1.8) + ln2([spout[0] - 1, spout[1] - 2.6], [spout[0] + 1.4, spout[1] - 2.6], IRON.left, 1.2);
        const [kx, ky] = T.p(-0.1, 0.17, 35);
        out += `<path d="M${f22(kx)},${f22(ky - 1.6)} q1.4,0 1.2,1.6" stroke="${DARK_IRON.right}" stroke-width="0.6" fill="none"/>` + ln2([kx + 1.2, ky], [kx + 0.6, ky + 8], WOOD_DARK.right, 1) + ell2(kx + 0.5, ky + 9.6, 2.2, 1.4, IRON.left, ` stroke="${OUT}" stroke-width="0.5"`);
      } else if (kind === 1) {
        out += T.cyl(0, -0.04, 0, 16, 0.24, STONE, "cuve");
        const [cx, cy] = T.p(0, -0.04, 0), R = 10.9;
        [5.3, 10.6].forEach((z, i) => {
          out += `<path d="M${f22(cx - R)},${f22(cy - z)} A${R},${R / 2} 0 0 0 ${f22(cx + R)},${f22(cy - z)}" stroke="rgba(120,110,95,.45)" stroke-width="0.6" fill="none"/>`;
        });
        for (const [z0, off] of [[0, 0], [5.3, 0.5], [10.6, 0]]) for (let j = 0; j < 4; j++) {
          const a = (j + 0.5 + off) / 4.5 * Math.PI;
          if (a < Math.PI) out += ln2([cx + R * Math.cos(a), cy - z0 + R / 2 * Math.sin(a)], [cx + R * Math.cos(a), cy - z0 - 5.3 + R / 2 * Math.sin(a)], "rgba(120,110,95,.4)", 0.5);
        }
        out += ell2(...T.p(-0.18, 0.1, 2), 3.4, 1.4, "#7E9A52") + ell2(...T.p(0.04, 0.2, 1.6), 2.6, 1, "#9DB86A") + T.disc(0, -0.04, 16, 0.2, WOOD.top, EDGE) + [-0.08, 0, 0.08].map((o) => ln2(T.p(-0.14, -0.04 + o, 16.4), T.p(0.14, -0.04 + o, 16.4), "rgba(90,55,30,.45)", 0.6)).join("");
        const lever = Math.sin(f / n * TAU) * 4;
        out += T.box(0.12, 0.1, 0.18, 0.16, 0, 26, IRON) + ln2(T.p(0.12, 0.16, 2), T.p(0.12, 0.16, 25), "rgba(255,255,255,.3)", 0.6) + T.box(0.11, 0.09, 0.19, 0.17, 26, 27.6, DARK_IRON) + `<path d="M${f22(T.p(0.15, 0.13, 27)[0])},${f22(T.p(0.15, 0.13, 27)[1])} Q${f22(T.p(0.06, 0.18, 31)[0])},${f22(T.p(0.06, 0.18, 31)[1] - lever * 0.5)} ${f22(T.p(-0.04, 0.22, 30)[0])},${f22(T.p(-0.04, 0.22, 30)[1] - lever)}" stroke="${IRON.right}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` + dot2(T.p(-0.04, 0.22, 30)[0], T.p(-0.04, 0.22, 30)[1] - lever, 1.2, WOOD.left);
        spout = T.p(0.15, 0.2, 18);
        out += ln2(T.p(0.15, 0.15, 19), spout, IRON.right, 1.9);
      } else {
        const [dx0, dy0] = T.p(0, -0.02, 26);
        out += T.box(-0.24, -0.24, 0.22, 0.2, 0, 4, STONE) + T.cyl(0, -0.02, 4, 26, 0.23, COPPER, "cuivre") + [9, 18].map((z) => {
          const [hx, hy] = T.p(0, -0.02, z);
          return `<path d="M${f22(hx - 10.4)},${f22(hy)} A10.4,5.2 0 0 0 ${f22(hx + 10.4)},${f22(hy)}" stroke="#8A4A22" stroke-width="0.6" fill="none"/>` + [-7, 0, 7].map((dx) => dot2(hx + dx, hy + 4.6 - Math.abs(dx) * 0.3, 0.6, "#8A4A22")).join("");
        }).join("") + [[-5, 8, 2.4], [4, 15, 1.8], [-1, 20, 1.4]].map(([dx, dz, r]) => {
          const [hx, hy] = T.p(0, -0.02, 4);
          return ell2(hx + dx, hy - dz, r, r * 0.6, "rgba(110,190,160,.55)");
        }).join("") + ln2(T.p(-0.1, 0.14, 6), T.p(-0.1, 0.14, 24), "rgba(255,255,255,.35)", 1.6) + `<path d="M${f22(dx0 - 10.4)},${f22(dy0)} C${f22(dx0 - 10.4)},${f22(dy0 - 10)} ${f22(dx0 + 10.4)},${f22(dy0 - 10)} ${f22(dx0 + 10.4)},${f22(dy0)} A10.4,5.2 0 0 1 ${f22(dx0 - 10.4)},${f22(dy0)} Z" fill="${COPPER.top}" stroke="${OUT}" stroke-width="0.5"/>` + ell2(dx0 - 3, dy0 - 5, 3, 1.4, "rgba(255,255,255,.35)") + T.cyl(0, -0.02, 33, 36, 0.03, COPPER, "bouchon");
        spout = T.p(0.1, 0.17, 10);
        const [vx, vy] = T.p(0.2, 0.06, 15);
        out += ln2(T.p(0.06, 0.12, 11), spout, COPPER.right, 1.9) + ln2(T.p(0.16, 0.06, 15), [vx, vy], DARK_IRON.right, 1.2) + `<circle cx="${f22(vx + 1.6)}" cy="${f22(vy)}" r="2.2" fill="none" stroke="#C9302A" stroke-width="1"/>` + ln2([vx - 0.6, vy], [vx + 3.8, vy], "#C9302A", 0.6) + ln2([vx + 1.6, vy - 2.2], [vx + 1.6, vy + 2.2], "#C9302A", 0.6);
      }
      const [bx, by] = T.p(0.2, 0.3, 0);
      out += bucket(T, 0.2, 0.3, 0, 7, 3.4, 4.2, { top: "#B98552", left: WOOD.left, right: WOOD.right }, "seau");
      const p = f % n / n;
      out += dot2(spout[0] + 0.5, spout[1] + 1 + p * (by - 7 - spout[1]), 1, "#7FC2EA");
      if (f % 3 === 0) out += ell2(bx, by - 6.6, 2.4, 0.9, "none", ' stroke="rgba(255,255,255,.75)" stroke-width="0.5"');
      return out;
    }, "draw")
  }]
};
var reservoir = {
  layers: [{
    frame: [-32, -78, 64, 96],
    n: 6,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 30, 12.6, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 20, 7.6, "#ADD27A") + [[-22, 4], [20, 8], [-10, 9]].map(([dx, dy]) => ell2(x + dx, y + dy, 1.6, 1, "#B8B0A0", ` stroke="${OUT}" stroke-width="0.4"`)).join("") + ell2(...T.p(0.36, 0.3, 0), 7, 2.4, "rgba(110,180,220,.55)") + T.shadow(0, 0, 0.36, 0.2);
      out += [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]].map(([a, b]) => T.box(a - 0.04, b - 0.04, a + 0.04, b + 0.04, 0, 23, STONE) + [5, 11, 17].map((z) => ln2(T.p(a - 0.04, b + 0.04, z), T.p(a + 0.04, b + 0.04, z), "rgba(120,110,95,.4)", 0.5)).join("")).join("");
      const arch = /* @__PURE__ */ __name((p0, p1) => {
        const [ax, ay] = p0, [bx2, by2] = p1;
        return `<path d="M${f22(ax)},${f22(ay)} Q${f22((ax + bx2) / 2)},${f22((ay + by2) / 2 - 9)} ${f22(bx2)},${f22(by2)}" stroke="${OUT}" stroke-width="4.4" fill="none"/><path d="M${f22(ax)},${f22(ay)} Q${f22((ax + bx2) / 2)},${f22((ay + by2) / 2 - 9)} ${f22(bx2)},${f22(by2)}" stroke="${STONE.left}" stroke-width="2.8" fill="none"/>`;
      }, "arch");
      out += arch(T.p(-0.13, 0.19, 17), T.p(0.13, 0.19, 17)) + arch(T.p(0.21, 0.11, 17), T.p(0.21, -0.11, 17)) + T.box(-0.24, -0.22, 0.24, 0.22, 23, 26, STONE);
      out += T.cyl(0, 0, 26, 47, 0.27, STONE, "cuve-r");
      const R = 12.2;
      [26, 31, 36, 41].forEach((z, i) => {
        const [cx, cy] = T.p(0, 0, z);
        if (i) out += `<path d="M${f22(cx - R)},${f22(cy)} A${R},${R / 2} 0 0 0 ${f22(cx + R)},${f22(cy)}" stroke="rgba(120,110,95,.45)" stroke-width="0.6" fill="none"/>`;
        for (let j = 0; j < 5; j++) {
          const a = (j + 0.5 + i % 2 * 0.5) / 5.5 * Math.PI;
          if (a >= Math.PI) continue;
          const px = cx + R * Math.cos(a), py = cy + R / 2 * Math.sin(a);
          out += ln2([px, py], [px, py - 5], "rgba(120,110,95,.4)", 0.5);
        }
      });
      out += [[-0.2, 0.12, 27, 3], [0.06, 0.24, 27, 2.4], [0.24, 0.02, 33, 1.8]].map(([u, v, z, r]) => {
        const [mx, my] = T.p(u, v, z);
        return ell2(mx, my, r * 1.3, r * 0.6, "#7E9A52") + ell2(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, "#9DB86A");
      }).join("");
      const [wx, wy] = T.p(0, 0, 47);
      out += ell2(wx, wy, R + 1.4, (R + 1.4) / 2, STONE.top, ` stroke="${OUT}" stroke-width="0.7"`) + ell2(wx, wy + 0.4, R - 1.4, (R - 1.4) / 2, "#4C9CC8", ` stroke="${STONE.right}" stroke-width="0.6"`) + [0, 1, 2].map((i) => {
        const a = k * TAU + i * 2.1;
        return ell2(wx + Math.cos(a) * 5.6, wy + 0.4 + Math.sin(a) * 1.8, 2.4, 0.6, "rgba(255,255,255,.6)");
      }).join("");
      out += ln2(T.p(-0.12, 0.31, 0), T.p(-0.12, 0.28, 48), WOOD.right, 1.2) + ln2(T.p(0, 0.31, 0), T.p(0, 0.28, 48), WOOD.right, 1.2) + [5, 12, 19, 26, 33, 40].map((z) => ln2(T.p(-0.12, 0.31 - z * 6e-4, z), T.p(0, 0.31 - z * 6e-4, z), WOOD.top, 0.9)).join("");
      const [ox, oy] = T.p(0.36, 0.1, 30);
      const [tx, ty] = T.p(0.36, 0.3, 5);
      out += ln2(T.p(0.26, 0.05, 30), [ox, oy], DARK_IRON.right, 1.8) + ln2(T.p(0.26, 0.05, 30.4), [ox, oy - 0.4], IRON.top, 0.5) + `<path d="M${f22(ox)},${f22(oy + 0.6)} Q${f22(ox + 1.6)},${f22(oy + 6)} ${f22(tx)},${f22(ty)}" stroke="#7FC2EA" stroke-width="1.4" fill="none" stroke-dasharray="3 2" stroke-dashoffset="${f22(-k * 10)}"/>` + T.box(0.26, 0.2, 0.46, 0.4, 0, 5, STONE) + T.face([[0.28, 0.22, 5], [0.44, 0.22, 5], [0.44, 0.38, 5], [0.28, 0.38, 5]], "#4C9CC8") + `<ellipse cx="${f22(tx)}" cy="${f22(ty)}" rx="${f22(1.6 + k * 4)}" ry="${f22(0.8 + k * 2)}" fill="none" stroke="rgba(255,255,255,${f22(0.8 * (1 - k))})" stroke-width="0.6"/>`;
      const [bx, by] = T.p(0.45, 0.24, 5);
      return out + `<g transform="translate(${f22(bx)} ${f22(by)}) scale(.7) translate(${f22(-bx)} ${f22(-by)})">` + bird(bx, by, { body: "#5E8CC8", breast: "#F2D25A", wing: "#3E6AA0", flip: true, peck: f % 2 }) + "</g>";
    }, "draw")
  }]
};
var eolienne = {
  layers: [{
    frame: [-34, -108, 68, 126],
    n: 8,
    fps: 8,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const top = 64;
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 30, 12.6, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 20, 7.6, "#ADD27A") + [[-18, 6, "#F2C04B"], [-14, 8, "#FFFFFF"], [16, 7, "#E89AC0"], [22, 3, "#F2C04B"], [8, 10, "#FFFFFF"], [-24, 1, "#E89AC0"]].map(([dx, dy, c]) => ln2([x + dx, y + dy], [x + dx, y + dy - 2.6], "#6F8C46", 0.5) + dot2(x + dx, y + dy - 2.8, 0.9, c)).join("") + T.shadow(0, 0, 0.38, 0.18);
      const legs = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]];
      const ringAt = /* @__PURE__ */ __name((z) => {
        const k2 = 1 - z / top * 0.75;
        return legs.map(([a, b]) => T.p(a * k2, b * k2, z));
      }, "ringAt");
      out += legs.map(([a, b]) => ln2(T.p(a, b, 0), T.p(a * 0.25, b * 0.25, top), WOOD_DARK.right, 1.7)).join("");
      const zs = [0, 12, 26, 40, 52];
      zs.forEach((z, i) => {
        const r = ringAt(z);
        if (i) out += ln2(r[0], r[1], WOOD.left, 0.9) + ln2(r[1], r[3], WOOD.left, 1) + ln2(r[3], r[2], WOOD.left, 1) + ln2(r[2], r[0], WOOD.left, 0.9);
        if (i < zs.length - 1) {
          const s = ringAt(zs[i + 1]);
          out += ln2(r[2], s[3], "rgba(110,74,44,.8)", 0.6) + ln2(r[3], s[2], "rgba(110,74,44,.8)", 0.6) + ln2(r[1], s[3], "rgba(110,74,44,.8)", 0.6) + ln2(r[3], s[1], "rgba(110,74,44,.8)", 0.6);
        }
      });
      out += ln2(T.p(-0.17, 0.23, 0), T.p(-0.06, 0.1, 57), WOOD.right, 0.9) + ln2(T.p(-0.23, 0.17, 0), T.p(-0.1, 0.06, 57), WOOD.right, 0.9) + [6, 14, 22, 30, 38, 46, 54].map((z) => {
        const k2 = z / 57;
        return ln2(T.p(-0.17 + 0.11 * k2, 0.23 - 0.13 * k2, z), T.p(-0.23 + 0.13 * k2, 0.17 - 0.11 * k2, z), WOOD.top, 0.7);
      }).join("") + T.box(-0.11, -0.11, 0.11, 0.11, 57, 58.6, WOOD) + [[-0.11, 0.11], [0.11, 0.11], [0.11, -0.11]].map(([a, b]) => ln2(T.p(a, b, 58.6), T.p(a, b, 62), WOOD_DARK.right, 0.8)).join("") + ln2(T.p(-0.11, 0.11, 62), T.p(0.11, 0.11, 62), WOOD.top, 0.8) + ln2(T.p(0.11, 0.11, 62), T.p(0.11, -0.11, 62), WOOD.top, 0.8);
      const k = f / n;
      out += ln2(T.p(0, 0, 4), T.p(0, 0, top), IRON.right, 0.9) + T.box(-0.04, -0.04, 0.04, 0.04, 0, 9, DARK_IRON) + ln2(T.p(0, 0.04, 7), T.p(-0.1, 0.16, 6.6), DARK_IRON.left, 1.6) + ln2(T.p(0.06, 0, 9), T.p(0.12, 0, 11 + Math.sin(k * TAU) * 1.4), DARK_IRON.right, 1);
      const [sx, sy] = T.p(-0.1, 0.16, 6.2), [wx, wy] = T.p(-0.14, 0.2, 4);
      out += `<path d="M${f22(sx)},${f22(sy)} L${f22(wx)},${f22(wy)}" stroke="#7FC2EA" stroke-width="1.2" stroke-dasharray="1.6 1.2" stroke-dashoffset="${f22(-k * 6)}"/>` + T.box(-0.34, 0.12, -0.04, 0.34, 0, 4, WOOD_DARK) + T.face([[-0.32, 0.14, 4], [-0.06, 0.14, 4], [-0.06, 0.32, 4], [-0.32, 0.32, 4]], "#4C9CC8") + ln2(T.p(-0.34, 0.34, 2), T.p(-0.04, 0.34, 2), "rgba(40,25,15,.35)", 0.6) + `<ellipse cx="${f22(wx)}" cy="${f22(wy)}" rx="${f22(1.4 + k * 3.4)}" ry="${f22(0.7 + k * 1.7)}" fill="none" stroke="rgba(255,255,255,${f22(0.8 * (1 - k))})" stroke-width="0.6"/>` + ell2(...T.p(-0.24, 0.26, 4), 2.6, 0.6, "rgba(255,255,255,.55)");
      const [mx, my] = T.p(-0.46, 0.34, 0);
      out += sheep(mx, my, false, f % 4 < 2);
      const [hx, hy] = T.p(0.02, 0.08, top + 6);
      out += T.box(-0.05, -0.05, 0.05, 0.05, top, top + 3, WOOD) + poly2([T.p(-0.02, -0.04, top + 7), T.p(-0.3, -0.34, top + 12), T.p(-0.3, -0.34, top + 2)], "#F4ECDC", ` stroke="${OUT}" stroke-width="0.5"`) + star(...T.p(-0.22, -0.25, top + 7), 2.4, "#E2574C") + ln2(T.p(0, 0, top + 6), T.p(-0.24, -0.28, top + 7), WOOD_DARK.right, 1.2);
      const turn = k * (TAU / 12);
      const pt = /* @__PURE__ */ __name((a, r) => [hx + Math.cos(a) * r * 0.82, hy + Math.sin(a) * r], "pt");
      for (let i = 0; i < 12; i++) {
        const a = turn + i / 12 * TAU;
        out += poly2([pt(a - 0.12, 4), pt(a - 0.16, 19), pt(a + 0.16, 19), pt(a + 0.12, 4)], i % 2 ? "#F4ECDC" : "#E2574C", ` stroke="${OUT}" stroke-width="0.4"`);
      }
      out += `<ellipse cx="${f22(hx)}" cy="${f22(hy)}" rx="${f22(19.4 * 0.82)}" ry="19.4" fill="none" stroke="${OUT}" stroke-width="1.6"/><ellipse cx="${f22(hx)}" cy="${f22(hy)}" rx="${f22(19.4 * 0.82)}" ry="19.4" fill="none" stroke="${IRON.left}" stroke-width="0.8"/><ellipse cx="${f22(hx)}" cy="${f22(hy)}" rx="${f22(10 * 0.82)}" ry="10" fill="none" stroke="rgba(60,40,25,.45)" stroke-width="0.6"/>` + dot2(hx, hy, 2.6, DARK_IRON.right) + dot2(hx - 0.7, hy - 0.8, 0.8, IRON.top);
      return out;
    }, "draw")
  }]
};
var FISH = [["#F08A3A", "#FFFFFF"], ["#C7D0DA", "#8E9AA8"], ["#5A8FD8", "#F2C04B"]];
var vivier = {
  layers: [{
    frame: [-34, -30, 68, 48],
    n: 8,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, f, n, variant) => {
      const [base, spot] = FISH[variant % 3];
      const [cx, cy] = T.p(0, 0, 0);
      const k8 = f / n;
      let out = ell2(cx, cy + 1, 32, 13, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(cx - 4, cy, 24, 9, "#ADD27A") + ell2(cx + 1, cy + 1.2, 24, 12.4, "rgba(40,55,20,.2)") + ell2(cx, cy, 21, 10.6, "#3E86B5") + ell2(cx - 2, cy - 1, 17, 7.6, "#5FAFD6") + ell2(cx + 1, cy + 0.6, 9, 4, "#4C9CC8") + [[-8, -3], [6, 2]].map(([dx, dy], i) => ln2([cx + dx - 3 + (i ? -k8 : k8) * 2, cy + dy], [cx + dx + 2 + (i ? -k8 : k8) * 2, cy + dy - 0.4], "rgba(255,255,255,.55)", 0.7)).join("");
      out += [0, 1, 2].map((k) => {
        const a = k8 * TAU + k * TAU / 3;
        return fishTop(cx + Math.cos(a) * 10, cy + Math.sin(a) * 4.6, a + Math.PI / 2, base, k === 1 ? null : spot);
      }).join("") + ell2(cx + Math.cos(k8 * TAU) * 10, cy + Math.sin(k8 * TAU) * 4.6, 3 + f % 2, 1.2, "none", ' stroke="rgba(255,255,255,.5)" stroke-width="0.5"');
      const pad = /* @__PURE__ */ __name((px, py, r) => ell2(px, py, r, r / 2, "#5FA04A", ` stroke="#3E7A34" stroke-width="0.4"`) + poly2([[px, py], [px + r, py - r * 0.18], [px + r * 0.9, py + r * 0.14]], "#3E86B5"), "pad");
      out += pad(cx + 9, cy - 3, 4) + dot2(cx + 7.6, cy - 4.2, 1.2, "#F6A8C8") + dot2(cx + 7.6, cy - 4.2, 0.5, "#FFE08A") + pad(cx - 7, cy + 3.6, 3.4);
      const jump = f === 5 ? 1.6 : 0;
      out += ell2(cx - 7.4, cy + 2.4 - jump, 2.2, 1.5, "#7FBF4A", ` stroke="${OUT}" stroke-width="0.4"`) + dot2(cx - 8.6, cy + 1.2 - jump, 0.9, "#7FBF4A") + dot2(cx - 6.4, cy + 1.2 - jump, 0.9, "#7FBF4A") + dot2(cx - 8.6, cy + 1.1 - jump, 0.4, "#2A2024") + dot2(cx - 6.4, cy + 1.1 - jump, 0.4, "#2A2024") + `<path d="M${f22(cx - 8.4)},${f22(cy + 2.6 - jump)} q0.9,0.6 1.8,0" stroke="#3E7A34" stroke-width="0.4" fill="none"/>`;
      for (let k = 0; k < 14; k++) {
        const a = k / 14 * TAU;
        out += ell2(cx + Math.cos(a) * 21, cy + Math.sin(a) * 10.6, 3.6, 2.4, k % 2 ? STONE.left : STONE.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      out += [[-17, -6, 0], [-14, -7, 1], [-19.4, -5, 2], [18, -4, 3]].map(([dx, dy, i]) => {
        const s = wave(f, n, 0.8, i);
        return ln2([cx + dx, cy + dy], [cx + dx + s, cy + dy - 10 - i % 2 * 2], i % 2 ? LEAF_LIGHT : LEAF, 0.9) + ell2(cx + dx + s, cy + dy - 11 - i % 2 * 2, 0.9, 2.2, "#7A4E2C", ` stroke="${OUT}" stroke-width="0.3"`);
      }).join("") + [-1.6, 1.6].map((o) => `<path d="M${f22(cx - 16)},${f22(cy - 6)} q${f22(o)},-4 ${f22(o * 2)},-7" stroke="${LEAF}" stroke-width="0.8" fill="none"/>`).join("");
      const la = k8 * TAU, [dx2, dy2] = [cx + Math.cos(la) * 8, cy - 12 + Math.sin(la * 2) * 2];
      out += ln2([dx2 - 3, dy2], [dx2 + 3, dy2], "#3A7AB8", 0.9) + [-1, 1].map((s) => ell2(dx2 + 0.6, dy2 + s * (f % 2 ? 1.2 : 0.6), 1.6, 0.5, "rgba(220,240,255,.85)")).join("") + dot2(dx2 + 3, dy2, 0.6, "#3A7AB8");
      return out;
    }, "draw")
  }]
};
var fumoir = {
  light: /* @__PURE__ */ __name(() => [0, 0.2, 5, 11, "255,140,70"], "light"),
  layers: [{
    frame: [-34, -82, 68, 100],
    n: 8,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 31, 13, "#B89A6E", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 21, 8, "#C8AC80") + [[-16, 8], [12, 9], [20, 3], [-24, 3]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join("") + T.shadow(0, 0, 0.38, 0.2);
      const [lx, ly] = T.p(-0.44, 0.12, 0);
      out += [[-3.6, -2.2], [0, -2.2], [3.6, -2.2], [-1.8, -5.6], [1.8, -5.6]].map(([dx, dy]) => logEnd(lx + dx, ly + dy, 1.9)).join("");
      out += T.box(-0.24, -0.22, 0.18, 0.2, 0, 22, WOOD_DARK) + planksLeft(T.u - 0.24, T.u + 0.18, T.v + 0.2, 0, 22, 4) + planksRight(T.u + 0.18, T.v - 0.22, T.v + 0.2, 0, 22, 4) + [-0.16, 0.1].map((u) => ln2(T.p(u, 0.2, 0.5), T.p(u, 0.2, 21.5), WOOD.left, 1.2)).join("") + [-0.12, 0.08].map((v) => ln2(T.p(0.18, v, 0.5), T.p(0.18, v, 21.5), WOOD_DARK.left, 1.2)).join("") + T.face([[-0.06, 0.2, 0], [0.06, 0.2, 0], [0.06, 0.2, 14], [-0.06, 0.2, 14]], "#2E1E14", ` stroke="${OUT}" stroke-width="0.6"`) + T.face([[-0.04, 0.2, 1], [0.04, 0.2, 1], [0.04, 0.2, 4], [-0.04, 0.2, 4]], f % 2 ? "#FF9A4A" : "#E8743A") + dot2(...T.p(-0.02, 0.2, 2.4), 0.6, "#FFE08A") + dot2(...T.p(0.02, 0.2, 2), 0.5, "#FFD070") + T.face([[0.18, -0.08, 13], [0.18, 0.02, 13], [0.18, 0.02, 18], [0.18, -0.08, 18]], "#2E1E14", ` stroke="${OUT}" stroke-width="0.5"`) + ln2(T.p(0.18, -0.03, 13), T.p(0.18, -0.03, 18), WOOD.left, 0.7);
      out += T.gable(-0.24, -0.22, 0.18, 0.2, 22, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.05);
      for (const t of [0.33, 0.66]) out += ln2(T.p(-0.29, 0.25 * t, 33 - 11 * t), T.p(0.23, 0.25 * t, 33 - 11 * t), "rgba(40,48,66,.5)", 0.6);
      out += T.box(-0.06, -0.05, 0.04, 0.05, 31, 37, WOOD_DARK) + T.gable(-0.06, -0.05, 0.04, 0.05, 37, 3, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.03) + ln2(T.p(-0.06, 0.05, 33), T.p(0.04, 0.05, 33), "rgba(0,0,0,.4)", 0.6) + ln2(T.p(-0.06, 0.05, 35), T.p(0.04, 0.05, 35), "rgba(0,0,0,.4)", 0.6);
      const [vx, vy] = T.p(-0.01, 0, 39);
      out += [0, 1, 2].map((i) => {
        const p = (f + i * (n / 3)) % n / n;
        return puff(vx - 2 + p * 6 + Math.sin(p * 6 + i) * 2, vy - 4 - p * 26, 2.6 + p * 4.6, 0.7 * (1 - p));
      }).join("");
      const [wx, wy] = T.p(0.18, -0.03, 18);
      out += [0, 0.5].map((o) => {
        const p = (f / n + o) % 1;
        return puff(wx + 2 + p * 5, wy - 1 - p * 8, 1.2 + p * 1.8, 0.5 * (1 - p));
      }).join("");
      out += post(T, 0.36, -0.18, 0, 20, WOOD, 0.018) + post(T, 0.36, 0.18, 0, 20, WOOD, 0.018) + ln2(T.p(0.36, -0.18, 19), T.p(0.36, 0.18, 19), WOOD.right, 1.4) + ln2(T.p(0.36, -0.18, 19.6), T.p(0.36, 0.18, 19.6), WOOD.top, 0.5);
      [[-0.12, "#E2B860", "#B8862E"], [-0.04, "#C7D0DA", "#7E8A98"], [0.04, "#E2B860", "#B8862E"], [0.12, "#C7D0DA", "#7E8A98"]].forEach(([dv, c, d], i) => {
        const [fx, fy] = T.p(0.36, dv, 19), s = wave(f, n, 1.2, i * 0.9);
        out += ln2([fx, fy], [fx + s * 0.3, fy + 2], "#8A6A40", 0.5) + `<g transform="rotate(${f22(s * 6)} ${f22(fx)} ${f22(fy)})"><path d="M${f22(fx)},${f22(fy + 2)} q2.6,4 0,8.6 q-2.6,-4.6 0,-8.6 Z" fill="${c}" stroke="${d}" stroke-width="0.5"/>` + ln2([fx - 0.8, fy + 5], [fx + 0.8, fy + 5], "rgba(0,0,0,.18)", 0.4) + dot2(fx + 0.6, fy + 3.6, 0.45, "#2A2024") + poly2([[fx, fy + 10.4], [fx - 2, fy + 13], [fx + 2, fy + 13]], d) + "</g>";
      });
      const [cx, cy] = T.p(0.5, 0.2, 0), look = f % 4 === 0 ? -0.6 : 0;
      out += ell2(cx, cy + 0.4, 4, 1.2, "rgba(40,55,20,.22)") + `<path d="M${f22(cx + 2.6)},${f22(cy - 0.6)} q4,0.4 3.4,-3.4" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${f22(cx + 2.6)},${f22(cy - 0.6)} q4,0.4 3.4,-3.4" stroke="#9AA0A8" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${f22(cx - 3.4)},${f22(cy)} Q${f22(cx - 3.8)},${f22(cy - 6.4)} ${f22(cx)},${f22(cy - 7)} Q${f22(cx + 3.8)},${f22(cy - 6.4)} ${f22(cx + 3.4)},${f22(cy)} Z" fill="#9AA0A8" stroke="${OUT}" stroke-width="0.5"/>` + [-1.4, 0, 1.4].map((o) => ln2([cx + o - 0.4, cy - 5.6], [cx + o, cy - 4.2], "#6E747C", 0.5)).join("") + ell2(cx - 0.6, cy - 1.6, 1.6, 2.4, "#E8E4DC") + `<circle cx="${f22(cx)}" cy="${f22(cy - 9 + look)}" r="2.6" fill="#9AA0A8" stroke="${OUT}" stroke-width="0.5"/>` + poly2([[cx - 2.4, cy - 10 + look], [cx - 2.2, cy - 12.8 + look], [cx - 0.6, cy - 11.2 + look]], "#9AA0A8", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + poly2([[cx + 0.8, cy - 11.4 + look], [cx + 2.4, cy - 12.8 + look], [cx + 2.6, cy - 10 + look]], "#9AA0A8", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + dot2(cx - 0.9, cy - 9.6 + look, 0.5, "#2A2024") + dot2(cx + 0.9, cy - 9.6 + look, 0.5, "#2A2024") + dot2(cx, cy - 8.4 + look, 0.35, "#E58A8F");
      const [bx, by] = T.p(-0.16, 0.42, 0);
      return out + ell2(bx + 1, by + 0.5, 6, 1.8, "rgba(40,55,20,.22)") + [[-2, -5.4, "#C7D0DA"], [1.6, -5.8, "#E2B860"], [0, -6.6, "#C7D0DA"]].map(([dx, dy, c]) => ell2(bx + dx, by + dy, 2.6, 1, c, ` stroke="${OUT}" stroke-width="0.4"`)).join("") + `<path d="M${f22(bx - 5.4)},${f22(by - 5)} L${f22(bx - 4.2)},${f22(by)} Q${f22(bx)},${f22(by + 1.6)} ${f22(bx + 4.2)},${f22(by)} L${f22(bx + 5.4)},${f22(by - 5)} Q${f22(bx)},${f22(by - 3)} ${f22(bx - 5.4)},${f22(by - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(bx - 4.8)},${f22(by - 2.4)} Q${f22(bx)},${f22(by - 0.6)} ${f22(bx + 4.8)},${f22(by - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`;
    }, "draw")
  }]
};
var huitres = {
  layers: [{
    frame: [-34, -34, 68, 50],
    n: 6,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 32, 13, "#EAD7A8", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y - 1, 22, 8, "#F2E2BA") + `<path d="M${x - 22},${y - 1} Q${x - 18},${y - 9} ${x - 2},${y - 9} Q${x + 18},${y - 9} ${x + 22},${y - 1} Q${x + 14},${y + 7} ${x - 4},${y + 6} Q${x - 20},${y + 6} ${x - 22},${y - 1} Z" fill="#8FC8E0" stroke="#C9B58A" stroke-width="1.2"/>` + ln2([x - 14, y - 4 + k * 2], [x - 6, y - 4 + k * 2], "rgba(255,255,255,.7)", 0.8) + ln2([x + 6, y + 1 - k * 2], [x + 14, y + 1 - k * 2], "rgba(255,255,255,.6)", 0.7) + [[-0.2, -0.08], [0.32, 0.22]].map(([du, dv], i) => {
        const [sx, sy] = T.p(du, dv, 0);
        return ell2(sx, sy, 1.6, 1, "#F7EEDC", ` stroke="${OUT}" stroke-width="0.4"`) + (i ? `<path d="M${f22(sx - 1.2)},${f22(sy)} l1.2,-1.2 l1.2,1.2" stroke="#C9A06A" stroke-width="0.4" fill="none"/>` : "");
      }).join("") + T.shadow(0, 0, 0.36, 0.12);
      const table = /* @__PURE__ */ __name((dv) => {
        let o = [[-0.32, dv - 0.08], [0.32, dv - 0.08], [-0.32, dv + 0.08], [0.32, dv + 0.08]].map(([a, b], i) => {
          const [rx, ry] = T.p(a, b, 0);
          const t = (k + i * 0.25) % 1;
          return `<ellipse cx="${f22(rx)}" cy="${f22(ry)}" rx="${f22(1.4 + t * 2.6)}" ry="${f22(0.7 + t * 1.3)}" fill="none" stroke="rgba(255,255,255,${f22(0.7 * (1 - t))})" stroke-width="0.5"/>` + post(T, a, b, 0, 8, WOOD_DARK, 0.015);
        }).join("") + T.box(-0.34, dv - 0.1, 0.34, dv + 0.1, 8, 9, WOOD);
        for (const du of [-0.22, 0, 0.22]) {
          o += T.box(du - 0.09, dv - 0.07, du + 0.09, dv + 0.07, 9, 11.4, { top: "#8FA58C", left: "#6F876E", right: "#566C56" });
          for (let i = 1; i < 4; i++) o += ln2(T.p(du - 0.09 + i * 0.045, dv - 0.07, 11.4), T.p(du - 0.09 + i * 0.045, dv + 0.07, 11.4), "rgba(40,60,40,.45)", 0.4) + ln2(T.p(du - 0.09 + i * 0.045, dv + 0.07, 9), T.p(du - 0.09 + i * 0.045, dv + 0.07, 11.4), "rgba(40,60,40,.45)", 0.4);
          o += ln2(T.p(du - 0.09, dv, 11.4), T.p(du + 0.09, dv, 11.4), "rgba(40,60,40,.45)", 0.4) + [[-0.05, -0.03], [0.02, 0.03], [0.05, -0.04], [-0.02, 0.01]].map(([a, b]) => {
            const [ox, oy] = T.p(du + a, dv + b, 11.6);
            return ell2(ox, oy, 1.1, 0.6, "#B8BEC2", ` stroke="${OUT}" stroke-width="0.3"`);
          }).join("");
        }
        return o + [-0.3, -0.06, 0.18].map((du, i) => {
          const [ax, ay] = T.p(du, dv + 0.1, 8);
          const s = wave(f, n, 0.6, i);
          return `<path d="M${f22(ax)},${f22(ay)} q${f22(0.6 + s)},2.4 ${f22(s)},4.6 M${f22(ax + 2)},${f22(ay)} q${f22(-0.6 + s)},2 ${f22(0.4 + s)},3.4" stroke="#4E8A4A" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
        }).join("");
      }, "table");
      out += table(-0.18) + table(0.12);
      out += [[-0.4, 0.28], [-0.3, 0.4], [-0.44, 0.14]].map(([a, b]) => {
        const [sx, sy] = T.p(a, b, 0);
        return [-1.6, 0, 1.6].map((o, i) => `<path d="M${f22(sx + o * 0.4)},${f22(sy)} l${f22(o * 0.5)},-${2.4 + i % 2} l${f22(o * 0.3)},-2" stroke="${i % 2 ? "#8FB85A" : "#6E9C5A"}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join("");
      }).join("");
      const [bx, by] = T.p(0.22, 0.34, 0);
      out += ell2(bx + 1, by + 0.4, 6.6, 2, "rgba(40,55,20,.2)") + ell2(bx, by - 1.6, 5.6, 2.6, "#B08850", ` stroke="${OUT}" stroke-width="0.6"`) + ell2(bx, by - 3.2, 5, 2.2, "#C9A06A") + [-3, 0, 3].map((o) => ln2([bx + o, by - 3.6], [bx + o * 1.05, by + 0.6], "rgba(120,85,40,.45)", 0.5)).join("") + [[-3, -4.4], [1, -5], [3.4, -3.6], [-0.6, -3]].map(([a, b]) => ell2(bx + a, by + b, 2.2, 1.3, "#9AA2A8", ` stroke="${OUT}" stroke-width="0.3"`) + ell2(bx + a, by + b - 0.2, 1.4, 0.7, "#F1EEE6")).join("") + dot2(bx + 1, by - 5.2, 0.9, "#FFFFFF") + (f % 3 === 0 ? star(bx + 1, by - 5.4, 3.2, "#FFFFFF", 0.95) : "");
      const [cx, cy] = T.p(-0.12 + k * 0.2, 0.42 - k * 0.2, 0);
      const st = f % 2 ? 0.6 : -0.6;
      return out + ell2(cx, cy + 0.4, 3.4, 0.9, "rgba(40,55,20,.2)") + [-1, 1].map((s) => [0.8, 1.8, 2.8].map((d) => ln2([cx + s * d * 0.6, cy - 1], [cx + s * (d * 0.6 + 1.4), cy + 0.4 + (d === 1.8 ? st : -st) * 0.6], "#C2402E", 0.5)).join("")).join("") + ell2(cx, cy - 1.6, 3, 1.8, "#E2583E", ` stroke="${OUT}" stroke-width="0.5"`) + [-1, 1].map((s) => ln2([cx + s * 2.2, cy - 2.2], [cx + s * 3.4, cy - 3.6], "#C2402E", 0.6) + ell2(cx + s * 3.8, cy - 4.2, 1.2, 0.9, "#E2583E", ` stroke="${OUT}" stroke-width="0.4"`)).join("") + [-0.8, 0.8].map((s) => ln2([cx + s, cy - 3], [cx + s, cy - 4.2], "#C2402E", 0.4) + dot2(cx + s, cy - 4.4, 0.5, "#2A2024")).join("");
    }, "draw")
  }]
};
var jardin = {
  layers: [{
    frame: [-32, -48, 64, 64],
    n: 8,
    fps: 6,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [gx, gy] = T.p(0, 0, 0);
      let out = ell2(gx, gy + 1, 30, 12.4, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 20, 7.4, "#ADD27A") + [[-0.38, 0.3], [-0.24, 0.4], [-0.08, 0.46]].map(([du, dv]) => {
        const [px, py] = T.p(du, dv, 0);
        return ell2(px, py, 3, 1.5, "#C9C2B4", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(px - 0.6, py - 0.4, 1.6, 0.6, "#DDD7CB");
      }).join("") + T.shadow(0, 0, 0.36, 0.2);
      out += T.box(-0.32, -0.2, 0.32, 0.2, 0, 9, WOOD) + planksLeft(T.u - 0.32, T.u + 0.32, T.v + 0.2, 0, 9, 4.5) + planksRight(T.u + 0.32, T.v - 0.2, T.v + 0.2, 0, 9, 4.5) + [[-0.32, 0.2], [0.32, 0.2], [0.32, -0.2]].map(([a, b]) => post(T, a, b, 0, 10.4, WOOD_DARK, 0.022)).join("") + T.face([[-0.29, -0.17, 9], [0.29, -0.17, 9], [0.29, 0.17, 9], [-0.29, 0.17, 9]], SOIL_TOP) + [[-0.1, -0.02], [0.14, 0], [0.02, 0.12]].map(([du, dv]) => dot2(...T.p(du, dv, 9), 0.5, "#5A3A22")).join("");
      const herbs = [];
      for (const [du, dv, kind] of [[-0.22, -0.1, 0], [-0.08, -0.1, 1], [0.08, -0.1, 2], [0.22, -0.1, 3], [-0.22, 0.08, 1], [-0.08, 0.08, 3], [0.08, 0.08, 0], [0.22, 0.08, 2]]) {
        const [x, y] = T.p(du, dv, 9);
        const sw = wave(f, n, 0.6, du * 9);
        if (kind === 0) herbs.push([-2.4, -1.2, 0, 1.2, 2.4].map((o, i) => ln2([x + o * 0.4, y], [x + o + sw, y - 7 - i % 2 * 1.4], "#6FA35A", 0.7) + ell2(x + o + sw, y - 8.2 - i % 2 * 1.4, 0.8, 2.2, i % 2 ? "#9A7ACF" : "#B79AE6")).join(""));
        else if (kind === 1) herbs.push([[-1.8, -2], [1.8, -2.4], [0, -4], [-0.6, -1.2], [1.2, -3.6]].map(([dx, dy], i) => `<path d="M${f22(x + dx)},${f22(y + dy + 1.6)} q-2,-1.6 0,-3.4 q2,1.6 0,3.4 Z" fill="${i % 2 ? LEAF_LIGHT : LEAF}" stroke="#3F6E3A" stroke-width="0.3"/>`).join(""));
        else if (kind === 2) herbs.push([-2.4, -1.2, 0, 1.2, 2.4].map((o) => {
          const ex2 = x + o + sw, ey2 = y - 7;
          return ln2([x, y], [ex2, ey2], "#3F6E3A", 0.8) + [0.3, 0.55, 0.8].map((t) => ln2([x + (ex2 - x) * t, y + (ey2 - y) * t], [x + (ex2 - x) * t + 1, y + (ey2 - y) * t - 0.6], "#5E8C4A", 0.5)).join("");
        }).join(""));
        else herbs.push(`<ellipse cx="${f22(x)}" cy="${f22(y - 1.6)}" rx="3.2" ry="2" fill="#7AA866" stroke="#4E7A3E" stroke-width="0.3"/>` + [-1.6, -0.4, 0.8, 1.8].map((o, i) => dot2(x + o, y - 2.4 - i % 2 * 0.8, 0.55, "#E6D2F2")).join(""));
      }
      out += herbs.join("");
      const [tx, ty] = T.p(0, 0, 9);
      out += poly2([[tx - 1, ty], [tx + 1, ty], [tx + 0.6, ty - 3], [tx - 0.6, ty - 3]], IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + ln2([tx, ty - 3], [tx + 0.6, ty - 7], WOOD.right, 1.3);
      const [ex, ey] = T.p(-0.12 + f % n * 6e-3, 0.2, 9);
      out += `<path d="M${f22(ex - 2.6)},${f22(ey)} q2.6,-0.6 5,0 q0.6,0.3 1.2,-1.2" stroke="#C8B48A" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="${f22(ex)}" cy="${f22(ey - 1.8)}" r="1.9" fill="#C8864A" stroke="${OUT}" stroke-width="0.4"/><path d="M${f22(ex)},${f22(ey - 1.8)} m-0.9,0 a0.9,0.9 0 1 1 0.9,0.9" stroke="#8A5226" stroke-width="0.4" fill="none"/>` + ln2([ex + 3.6, ey - 1.2], [ex + 3.8, ey - 2.8], "#C8B48A", 0.4) + dot2(ex + 3.8, ey - 2.9, 0.35, "#3D3A36");
      const [sx, sy] = T.p(0.34, 0.26, 0);
      out += ln2([sx, sy], [sx, sy - 12], WOOD.right, 1.2) + poly2([[sx - 5, sy - 15], [sx + 5, sy - 13], [sx + 5, sy - 9], [sx - 5, sy - 11]], WALL.top, ` stroke="${OUT}" stroke-width="0.5"`) + ln2([sx - 3, sy - 12.4], [sx + 3, sy - 11], "#6FA35A", 0.8) + dot2(sx + 3.4, sy - 11.2, 0.7, "#A98ADB");
      const [ax, ay] = T.p(0.42, -0.04, 0);
      out += ell2(ax, ay + 0.4, 4.4, 1.2, "rgba(40,55,20,.22)") + `<path d="M${f22(ax - 3.4)},${f22(ay)} L${f22(ax - 3)},${f22(ay - 6)} L${f22(ax + 3)},${f22(ay - 6)} L${f22(ax + 3.4)},${f22(ay)} Z" fill="#7FA8B8" stroke="${OUT}" stroke-width="0.5"/>` + ell2(ax, ay - 6, 3, 1, "#9CC4D2", ` stroke="${OUT}" stroke-width="0.4"`) + `<path d="M${f22(ax + 3)},${f22(ay - 2)} L${f22(ax + 7.6)},${f22(ay - 7)}" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${f22(ax + 3)},${f22(ay - 2)} L${f22(ax + 7.6)},${f22(ay - 7)}" stroke="#7FA8B8" stroke-width="0.9" stroke-linecap="round"/>` + ell2(ax + 8, ay - 7.4, 1.2, 0.8, "#9CC4D2", ` stroke="${OUT}" stroke-width="0.4"`) + `<path d="M${f22(ax - 2.4)},${f22(ay - 6)} q2.4,-4.4 4.8,0" stroke="${OUT}" stroke-width="1.4" fill="none"/><path d="M${f22(ax - 2.4)},${f22(ay - 6)} q2.4,-4.4 4.8,0" stroke="#7FA8B8" stroke-width="0.7" fill="none"/>`;
      const fly = /* @__PURE__ */ __name((k) => {
        const a = f / n * TAU + k * 2.6;
        const [x, y] = T.p(Math.cos(a) * 0.22, Math.sin(a) * 0.16, 20 + Math.sin(a * 2) * 4);
        return butterfly2(x, y, (f + k) % 2 === 0, k ? "#F2C04B" : "#F6A8C8");
      }, "fly");
      return out + fly(0) + fly(1);
    }, "draw")
  }]
};
var four = {
  light: /* @__PURE__ */ __name(() => [-0.04, 0.24, 13, 17, "255,150,70", true], "light"),
  layers: [{
    frame: [-34, -70, 68, 88],
    n: 6,
    fps: 6,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [gx, gy] = T.p(0, 0, 0);
      const [cx, cy] = T.p(0, -0.02, 9);
      const dome = `<path d="M${f22(cx - 17)},${f22(cy)} C${f22(cx - 17)},${f22(cy - 24)} ${f22(cx + 17)},${f22(cy - 24)} ${f22(cx + 17)},${f22(cy)} A17,8.5 0 0 1 ${f22(cx - 17)},${f22(cy)} Z" fill="url(#${T.id("dome")})" stroke="${OUT}" stroke-width="0.6"/>`;
      const [mx, my] = T.p(-0.04, 0.2, 9);
      const flick = [0.8, 1, 0.9, 1.1, 0.85, 1][f];
      const [chx, chy] = T.p(0.08, -0.12, 27);
      let out = ell2(gx, gy + 1, 31, 12.6, "#C8AC80", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 21, 7.6, "#D6BC90") + ell2(...T.p(-0.2, 0.42, 0), 5, 1.6, "rgba(255,255,255,.45)") + [[-0.1, 0.46], [-0.06, 0.48], [-0.13, 0.5]].map(([du, dv]) => dot2(...T.p(du, dv, 0), 0.5, "#E2B060")).join("") + T.shadow(0, 0, 0.38, 0.2) + `<defs><radialGradient id="${T.id("dome")}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${CLAY.top}"/><stop offset="0.6" stop-color="${CLAY.left}"/><stop offset="1" stop-color="${CLAY.right}"/></radialGradient></defs>`;
      out += T.box(-0.3, -0.26, 0.3, 0.26, 0, 9, STONE) + ln2(T.p(-0.3, 0.26, 4.5), T.p(0.3, 0.26, 4.5), "rgba(120,110,95,.4)", 0.6) + ln2(T.p(0.3, -0.26, 4.5), T.p(0.3, 0.26, 4.5), "rgba(120,110,95,.4)", 0.6) + [-0.18, 0.02, 0.2].map((u) => ln2(T.p(u, 0.26, 0.4), T.p(u, 0.26, 4.4), "rgba(120,110,95,.35)", 0.5)).join("") + [-0.08, 0.12].map((u) => ln2(T.p(u, 0.26, 4.6), T.p(u, 0.26, 8.6), "rgba(120,110,95,.35)", 0.5)).join("") + T.cyl(0.08, -0.12, 18, 30, 0.045, BRICK, "chem") + dome + [[-10, -6], [-4, -14], [6, -12], [11, -5], [0, -8]].map(([dx, dy]) => `<path d="M${f22(cx + dx - 2)},${f22(cy + dy)} q2,-1.2 4,0" stroke="rgba(150,80,50,.35)" stroke-width="0.6" fill="none"/>`).join("") + `<path d="M${f22(mx - 5)},${f22(my - 6)} Q${f22(mx)},${f22(my - 16)} ${f22(mx + 5)},${f22(my - 6)} Z" fill="rgba(50,30,20,.35)"/><path d="M${f22(mx - 6)},${f22(my)} L${f22(mx - 6)},${f22(my - 6)} A6,6 0 0 1 ${f22(mx + 6)},${f22(my - 6)} L${f22(mx + 6)},${f22(my)} Z" fill="#2E1A10" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(mx - 7.4)},${f22(my)} L${f22(mx - 7.4)},${f22(my - 6)} A7.4,7.4 0 0 1 ${f22(mx + 7.4)},${f22(my - 6)} L${f22(mx + 7.4)},${f22(my)}" stroke="${STONE.top}" stroke-width="1.4" fill="none"/>` + ell2(mx, my - 2.6, 4.6 * flick, 3 * flick, "#F2862A") + ell2(mx, my - 2, 3 * flick, 1.8 * flick, "#FFD24E");
      out += [0, 1].map((k) => {
        const p = (f + k * 3) % n / n;
        return puff(chx + p * 5, chy - 6 - p * 18, 2 + p * 3.6, 0.6 * (1 - p));
      }).join("");
      const [px, py] = T.p(0.34, 0.08, 0);
      out += ln2([px, py], [px - 3, py - 22], WOOD.right, 1.3) + ln2([px + 0.3, py - 0.2], [px - 2.7, py - 22.2], WOOD.top, 0.4) + `<path d="M${f22(px - 3.6)},${f22(py - 21)} l-2.4,-7 q2.4,-1.6 4.8,0 l-0.8,7 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>`;
      out += T.box(-0.32, 0.28, -0.08, 0.4, 0, 2, WOOD) + [-0.26, -0.15].map((du) => {
        const [x, y] = T.p(du, 0.34, 2);
        return ell2(x, y - 2, 4, 2.4, "#D8A050", ` stroke="#9A6A2E" stroke-width="0.4"`) + ln2([x - 2, y - 2.6], [x + 1, y - 3.4], "#F2D28A", 0.6) + ln2([x - 0.4, y - 1.8], [x + 2.4, y - 2.6], "#F2D28A", 0.6) + ell2(x - 1, y - 3.2, 1.6, 0.6, "rgba(255,255,255,.5)");
      }).join("");
      const [bx, by] = T.p(0.12, 0.42, 0);
      out += ell2(bx + 1, by + 0.4, 6, 1.6, "rgba(40,55,20,.2)") + [[-2, -5.6], [2, -5.8], [0, -7]].map(([dx, dy]) => ell2(bx + dx, by + dy, 2.6, 1.8, "#C88A3E", ` stroke="#8A5A24" stroke-width="0.4"`) + ln2([bx + dx - 1, by + dy - 0.6], [bx + dx + 1, by + dy - 1], "#F2D28A", 0.5)).join("") + `<path d="M${f22(bx - 5.4)},${f22(by - 5)} L${f22(bx - 4.2)},${f22(by)} Q${f22(bx)},${f22(by + 1.6)} ${f22(bx + 4.2)},${f22(by)} L${f22(bx + 5.4)},${f22(by - 5)} Q${f22(bx)},${f22(by - 3)} ${f22(bx - 5.4)},${f22(by - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(bx - 4.8)},${f22(by - 2.4)} Q${f22(bx)},${f22(by - 0.6)} ${f22(bx + 4.8)},${f22(by - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>` + log(T, 0.3, 0.14, 0.32, 2.2, 2.2) + log(T, 0.36, 0.1, 0.3, 2.2, 2.2) + log(T, 0.33, 0.12, 0.31, 6.2, 2.2);
      const [sx, sy] = T.p(-0.08, 0.48, 0);
      return out + `<g transform="translate(${f22(sx)} ${f22(sy)}) scale(.7) translate(${f22(-sx)} ${f22(-sy)})">` + bird(sx, sy, { body: "#8B6A4A", breast: "#D8C2A0", wing: "#6E5236", peck: f % 3 === 1 ? 1 : 0, flip: true }) + "</g>";
    }, "draw")
  }]
};
var belvedere = {
  light: /* @__PURE__ */ __name(() => [0, 0, 29, 15], "light"),
  layers: [{
    frame: [-38, -92, 76, 110],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const pts3 = Array.from({ length: 6 }, (_, k) => {
        const a = k / 6 * TAU + TAU / 12;
        return [Math.cos(a) * 0.27, Math.sin(a) * 0.27];
      });
      const back = pts3.filter(([a, b]) => a + b < 0);
      const front = pts3.filter(([a, b]) => a + b >= 0);
      const column2 = /* @__PURE__ */ __name(([a, b]) => T.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 5, 32, { top: "#FFFFFF", left: "#F4F0E8", right: "#D6CFC2" }), "column");
      const eave = pts3.map(([a, b]) => [a * 1.3, b * 1.3, 32]);
      const apex = [0, 0, 50];
      const [gx, gy] = T.p(0, 0, 0);
      let out = ell2(gx, gy + 1, 34, 14, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 24, 9, "#ADD27A") + T.face([[0.26, 0.36, 0], [0.36, 0.26, 0], [0.52, 0.42, 0], [0.42, 0.52, 0]], "#DCD3C2", ` stroke="rgba(60,40,25,.4)" stroke-width="0.4"`) + T.shadow(0, 0, 0.42, 0.18) + T.cyl(0, 0, 0, 5, 0.36, STONE, "terrasse") + T.box(0.2, 0.2, 0.34, 0.34, 0, 2.4, STONE);
      out += back.map(column2).join("") + T.box(-0.12, -0.04, 0.12, 0.04, 5, 9, WOOD) + T.box(-0.12, -0.06, 0.12, -0.04, 9, 14, WOOD) + ln2(T.p(-0.1, -0.05, 12), T.p(0.1, -0.05, 12), "rgba(90,55,25,.4)", 0.5);
      const rail2 = /* @__PURE__ */ __name((p, q) => {
        let o = ln2(T.p(p[0], p[1], 12), T.p(q[0], q[1], 12), "#F4F0E8", 1.6) + ln2(T.p(p[0], p[1], 12.4), T.p(q[0], q[1], 12.4), "#FFFFFF", 0.6);
        for (let s = 1; s < 5; s++) {
          const u = p[0] + (q[0] - p[0]) * s / 5, v = p[1] + (q[1] - p[1]) * s / 5;
          o += ln2(T.p(u, v, 5), T.p(u, v, 12), "#D6CFC2", 0.9);
        }
        return o;
      }, "rail");
      const fr = pts3.map((p, k) => [p, pts3[(k + 1) % 6]]).filter(([p, q]) => (p[0] + p[1] + q[0] + q[1]) / 2 >= -0.05);
      out += fr.filter(([p, q]) => !((p[0] + q[0]) / 2 > 0.1 && (p[1] + q[1]) / 2 > 0.1)).map(([p, q]) => rail2(p, q)).join("") + front.map(column2).join("");
      const [rx, ry] = T.p(pts3[2][0], pts3[2][1], 5);
      out += `<path d="M${f22(rx)},${f22(ry)} q2,-5 -0.6,-9 q-2,-4 1,-9 q2,-4 -0.4,-8" stroke="#4E8A3A" stroke-width="0.9" fill="none"/>` + [[0.6, -4], [-1.2, -8], [1, -12.6], [-0.6, -17], [0.8, -21]].map(([dx, dy], i) => ell2(rx + dx, ry + dy, 1.4, 0.9, "#5FA04A") + (i % 2 ? "" : dot2(rx + dx + 0.8, ry + dy - 0.6, 1, "#F07AA0"))).join("");
      out += [[-0.3, 0.16], [0.32, -0.12]].map(([u, v], i) => {
        const [px, py] = T.p(u, v, 5);
        return `<path d="M${f22(px - 2.2)},${f22(py - 3)} L${f22(px - 1.6)},${f22(py)} L${f22(px + 1.6)},${f22(py)} L${f22(px + 2.2)},${f22(py - 3)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/>` + dot2(px, py - 4.4, 2, LEAF) + [-1, 0.6, 1.4].map((o, j) => dot2(px + o, py - 5 - j % 2, 0.8, i ? "#F2C04B" : "#E2574C")).join("");
      }).join("");
      for (let k = 0; k < 6; k++) {
        const p = eave[k], q = eave[(k + 1) % 6];
        const nu = (p[0] + q[0]) / 2, nv = (p[1] + q[1]) / 2;
        if (nu + nv <= 0) continue;
        out += T.face([p, q, apex], nu > nv ? TEAL_ROOF.right : TEAL_ROOF.left, EDGE);
        for (let s = 0; s < 4; s++) {
          const a = T.p(p[0] + (q[0] - p[0]) * s / 4, p[1] + (q[1] - p[1]) * s / 4, 32), b = T.p(p[0] + (q[0] - p[0]) * (s + 1) / 4, p[1] + (q[1] - p[1]) * (s + 1) / 4, 32);
          out += `<path d="M${f22(a[0])},${f22(a[1])} Q${f22((a[0] + b[0]) / 2)},${f22((a[1] + b[1]) / 2 + 2.2)} ${f22(b[0])},${f22(b[1])}" stroke="${OUT}" stroke-width="0.6" fill="#3E7672"/>`;
        }
        out += ln2(T.p(p[0], p[1], 32), T.p(0, 0, 50), "rgba(30,60,58,.6)", 0.9);
      }
      const [tx, ty] = T.p(0, 0, 56);
      out += dot2(...T.p(0, 0, 51), 1.8, "#E2B347") + dot2(...T.p(0, 0, 51.6), 0.6, "#FFF3C4") + ln2(T.p(0, 0, 50), [tx, ty], DARK_IRON.right, 1) + poly2([[tx, ty], [tx + 9, ty + 1.8 + wave(f, n, 1.2)], [tx + 0.4, ty + 4]], "#E2574C");
      const [lx, ly] = T.p(0, 0, 30);
      out += ln2(T.p(0, 0, 32), [lx, ly - 1.6], "#3D3A36", 0.5) + poly2([[lx - 2, ly], [lx + 2, ly], [lx + 1.4, ly - 1.4], [lx - 1.4, ly - 1.4]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + `<rect x="${f22(lx - 1.6)}" y="${f22(ly)}" width="3.2" height="3.6" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>` + ell2(lx, ly + 1.8, 0.9, 1.1, "#FFF3C4");
      return out;
    }, "draw")
  }]
};
function coalPile(x, y) {
  let lumps = "";
  for (let k = 0; k < 26; k++) {
    const a = k * 137.5 % 360 * (Math.PI / 180);
    const r = Math.sqrt((k + 0.5) / 26);
    const lx = x + Math.cos(a) * r * 15;
    const ly = y - 3 + Math.sin(a) * r * 6 - (1 - r) * 9;
    const s = 2.2 + k * 7 % 5 * 0.35;
    lumps += poly2([[lx - s, ly], [lx - s * 0.3, ly - s * 0.8], [lx + s, ly - s * 0.3], [lx + s * 0.4, ly + s * 0.6]], k % 3 ? COAL.left : COAL.right, ` stroke="${OUT}" stroke-width="0.3"`) + poly2([[lx - s * 0.6, ly - s * 0.2], [lx - s * 0.2, ly - s * 0.75], [lx + s * 0.6, ly - s * 0.35]], COAL.top);
  }
  return `<path d="M${f22(x - 18)},${f22(y)} C${f22(x - 16)},${f22(y - 14)} ${f22(x + 16)},${f22(y - 14)} ${f22(x + 18)},${f22(y)} A18,7 0 0 1 ${f22(x - 18)},${f22(y)} Z" fill="${COAL.right}"/>` + lumps;
}
__name(coalPile, "coalPile");
var charbon = {
  light: /* @__PURE__ */ __name(() => [0, 0.1, 3, 12, "255,110,50"], "light"),
  layers: [{
    frame: [-32, -42, 64, 58],
    n: 6,
    fps: 4,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const k = f / n, glow = 0.5 + 0.5 * Math.sin(k * TAU);
      const EARTH = { light: "#8E7A60", mid: "#76634C", dark: "#5A4A38" };
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 30, 12.6, "#5E544A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 3, y, 20, 7.4, "#6C6157") + [[-6, 9, 2.2], [17, 7, 1.8], [24, -5, 1.4]].map(([dx, dy, r]) => ell2(x + dx, y + dy, r * 1.6, r * 0.7, "#7E746A")).join("");
      const [lx, ly] = T.p(0.36, -0.34, 0);
      out += ell2(lx, ly + 0.6, 8, 2.4, "rgba(20,15,10,.3)") + [[-4.2, -2.2], [0, -2.2], [4.2, -2.2], [-2.1, -5.8], [2.1, -5.8], [0, -9.4]].map(([dx, dy]) => logEnd(lx + dx, ly + dy, 2.1)).join("");
      const [cx, cy] = T.p(-0.04, -0.06, 0), rx = 15.4, top = cy - 22;
      out += T.shadow(-0.04, -0.06, 0.3, 0.25) + `<path d="M${f22(cx - rx)},${f22(cy - 1)} A${rx},6.6 0 0 0 ${f22(cx + rx)},${f22(cy - 1)} L${f22(cx + rx)},${f22(cy - 4)} A${rx},6.6 0 0 1 ${f22(cx - rx)},${f22(cy - 4)} Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.6"/>`;
      for (let i = 0; i < 9; i++) {
        const t = -0.88 + i * 0.22;
        out += logEnd(cx + t * rx, cy - 2.4 + Math.sqrt(1 - t * t) * 6.4, 1.7);
      }
      const dome = `M${f22(cx - rx + 0.6)},${f22(cy - 3)} C${f22(cx - rx)},${f22(cy - 17)} ${f22(cx - 8)},${f22(top)} ${f22(cx)},${f22(top)} C${f22(cx + 8)},${f22(top)} ${f22(cx + rx)},${f22(cy - 17)} ${f22(cx + rx - 0.6)},${f22(cy - 3)} Q${f22(cx)},${f22(cy + 2.4)} ${f22(cx - rx + 0.6)},${f22(cy - 3)} Z`;
      out += `<path d="${dome}" fill="${EARTH.mid}" stroke="${OUT}" stroke-width="0.7"/><path d="M${f22(cx + 3)},${f22(top + 0.4)} C${f22(cx + 10)},${f22(top + 2)} ${f22(cx + rx)},${f22(cy - 15)} ${f22(cx + rx - 0.6)},${f22(cy - 3)} Q${f22(cx + 8)},${f22(cy + 0.6)} ${f22(cx + 4)},${f22(cy + 0.4)} Q${f22(cx + 8)},${f22(cy - 10)} ${f22(cx + 3)},${f22(top + 0.4)} Z" fill="${EARTH.dark}" opacity="0.7"/><path d="M${f22(cx - 9)},${f22(cy - 14)} q3,-5 8,-6.4" stroke="${EARTH.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + [[-8, -6, 1], [6, -9, 0.9], [-2, -15, 0.8], [10, -3, 0.8], [-11, -11, 0.7], [1, -5, 0.7]].map(([dx, dy, s]) => [-1.6, -0.5, 0.6, 1.6].map((o, i) => `<path d="M${f22(cx + dx + o * 0.5)},${f22(cy + dy)} q${f22(o * 0.4)},${f22(-2 * s)} ${f22(o * 1.1)},${f22(-(3.4 + i % 2 * 1.2) * s)}" stroke="${i % 2 ? "#9DB86A" : "#6F8C46"}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join("")).join("") + [[-4, -4], [2, -12], [8, -15], [-7, -17]].map(([dx, dy]) => ln2([cx + dx - 1.4, cy + dy], [cx + dx + 1.4, cy + dy + 0.4], "rgba(40,30,20,.45)", 0.5)).join("");
      for (const [dx, dy, o] of [[-3, -20.4, 0], [5, -18.6, 0.33], [-9, -15.4, 0.66]]) {
        out += ell2(cx + dx, cy + dy, 1.4, 0.7, "#2A2018");
        for (const p of [0, 0.5]) {
          const t = (k + o + p) % 1;
          out += puff(cx + dx + t * 3 + Math.sin(t * 5) * 1.2, cy + dy - 2 - t * 13, 1.6 + t * 2.6, 0.7 * (1 - t));
        }
      }
      const [gx, gy] = T.p(0, 0.1, 0);
      out += `<path d="M${f22(gx - 3.6)},${f22(gy)} L${f22(gx - 3.6)},${f22(gy - 3.4)} Q${f22(gx)},${f22(gy - 6.6)} ${f22(gx + 3.6)},${f22(gy - 3.4)} L${f22(gx + 3.6)},${f22(gy)} Z" fill="#2A1A12" stroke="${OUT}" stroke-width="0.6"/>` + ell2(gx, gy - 1.4, 2.6, 1.4, `rgba(255,${f22(110 + 60 * glow)},40,${f22(0.7 + 0.3 * glow)})`) + dot2(gx - 1, gy - 1.2, 0.6, "#FFE08A") + dot2(gx + 1.2, gy - 1, 0.5, "#FFD070") + [[-1, 0], [2, 2], [0.4, 4]].map(([dx, o]) => {
        const t = (f + o) % n / n;
        return t < 0.6 ? dot2(gx + dx + t * 2, gy - 6 - t * 8, 0.55, "#FF9A40") : "";
      }).join("");
      const b0 = [cx + 17, cy + 5], b1 = [cx + 9, cy - 17], dxr = 3.2;
      out += ln2(b0, b1, WOOD.right, 1.4) + ln2([b0[0] + dxr, b0[1] + 0.6], [b1[0] + dxr, b1[1] + 0.6], WOOD.right, 1.4) + [0.15, 0.35, 0.55, 0.75].map((t) => ln2([b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t], [b0[0] + (b1[0] - b0[0]) * t + dxr, b0[1] + (b1[1] - b0[1]) * t + 0.6], WOOD.top, 1)).join("");
      const [sx, sy] = T.p(-0.42, 0.24, 0);
      out += ell2(sx + 1, sy + 0.4, 5, 1.6, "rgba(20,15,10,.3)") + `<path d="M${f22(sx - 4.6)},${f22(sy)} C${f22(sx - 5.6)},${f22(sy - 5)} ${f22(sx - 3.8)},${f22(sy - 8.6)} ${f22(sx - 1.9)},${f22(sy - 9.8)} L${f22(sx + 2)},${f22(sy - 9.8)} C${f22(sx + 3.9)},${f22(sy - 8.6)} ${f22(sx + 5.6)},${f22(sy - 5)} ${f22(sx + 4.6)},${f22(sy)} Z" fill="#C9A46A" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(sx - 2)},${f22(sy - 9.8)} q2,-2.2 4,0" fill="${COAL.top}" stroke="${OUT}" stroke-width="0.4"/>` + ln2([sx - 2.2, sy - 9], [sx + 2.2, sy - 9], "#7A5A2A", 0.9) + ln2([sx - 2.6, sy - 5], [sx - 1.4, sy - 1.6], "rgba(138,106,58,.6)", 0.5) + ln2([sx + 2, sy - 6], [sx + 2.6, sy - 2.6], "rgba(138,106,58,.6)", 0.5);
      const [px, py] = T.p(-0.18, 0.4, 0);
      out += ell2(px, py + 0.6, 10, 3, "rgba(20,15,10,.3)") + `<g transform="translate(${f22(px)} ${f22(py)}) scale(.55) translate(${f22(-px)} ${f22(-py)})">${coalPile(px, py)}</g>` + ln2([px + 3, py - 3], [px + 7, py - 15], WOOD.right, 1.3) + ln2([px + 5.6, py - 15.4], [px + 8.6, py - 14.6], WOOD.right, 1.3) + poly2([[px + 1.6, py - 1], [px + 4.4, py - 0.2], [px + 4.6, py - 3.6], [px + 2.4, py - 4.2]], IRON.left, ` stroke="${OUT}" stroke-width="0.5"`) + [[-4, -4], [2, -5.6], [-1, -2.6]].map(([dx, dy], i) => dot2(px + dx, py + dy, 0.55, (i + f) % 3 === 0 ? "#FFFFFF" : "#C6D4EA")).join("");
      return out;
    }, "draw")
  }]
};
var hangar = {
  light: /* @__PURE__ */ __name(() => [0.02, 0.18, 21, 15], "light"),
  layers: [{
    frame: [-38, -66, 76, 84],
    draw: /* @__PURE__ */ __name((T) => {
      const crate2 = /* @__PURE__ */ __name((du, dv, z, s) => T.box(du - s, dv - s, du + s, dv + s, z, z + s * 64, WOOD) + ln2(T.p(du - s, dv + s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7) + ln2(T.p(du + s, dv - s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7), "crate");
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 34, 14.4, "#B89A6E", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 23, 8.6, "#C8AC80") + [[-22, 4, 0.5], [14, 9, -0.4], [24, 1, 0.3], [-6, 11, -0.6]].map(([dx, dy, a]) => ln2([x + dx, y + dy], [x + dx + 4, y + dy + a * 4], "#E2C66E", 0.7)).join("") + T.shadow(0, 0, 0.42, 0.2);
      out += T.box(-0.34, -0.28, 0.34, -0.23, 0, 26, WOOD) + planksLeft(T.u - 0.34, T.u + 0.34, T.v - 0.23, 0, 26, 4.6) + [-0.22, 0.04, 0.26].map((du) => ln2(T.p(du, -0.23, 2), T.p(du, -0.23, 24), "rgba(70,40,20,.18)", 0.6)).join("");
      out += T.box(-0.3, -0.22, 0.3, -0.08, 9, 11, WOOD) + post(T, -0.28, -0.1, 0, 9, WOOD_DARK, 0.015) + post(T, 0.28, -0.1, 0, 9, WOOD_DARK, 0.015) + ln2(T.p(-0.28, -0.1, 3), T.p(0.28, -0.1, 3), WOOD_DARK.right, 1) + T.box(-0.24, -0.12, -0.16, -0.08, 11, 14, DARK_IRON) + ln2(T.p(-0.2, -0.06, 12.4), T.p(-0.2, -0.02, 12.4), IRON.top, 0.9) + T.box(-0.08, -0.2, 0.2, -0.13, 11, 12.2, { top: "#E4C08A", left: WOOD.left, right: WOOD.right });
      const [sx, sy] = T.p(0.12, -0.04, 0);
      out += [[-4, 0], [-1, 1.6], [3, 0.4], [6, 2]].map(([dx, dy]) => `<path d="M${f22(sx + dx)},${f22(sy + dy)} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join("");
      const [wx, wy] = T.p(0, -0.15, 11.2);
      out += poly2([[wx - 6, wy + 1.6], [wx + 3, wy - 1.2], [wx + 3.6, wy + 1], [wx - 5.4, wy + 2.6]], "#D4DAE2", ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + `<path d="M${f22(wx + 3)},${f22(wy - 1.4)} l3,-1 l0.8,2.4 l-3,1 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>` + ln2([wx - 9, wy - 1.6], [wx - 4, wy - 3.6], WOOD.right, 1.2) + poly2([[wx - 4.8, wy - 5], [wx - 3, wy - 2.2], [wx - 1.8, wy - 2.8], [wx - 3.6, wy - 5.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      out += [[-0.32, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.32, 0.26]].map(([a, b]) => post(T, a, b, 0, 26, WOOD_DARK, 0.025)).join("") + ln2(T.p(0.32, 0.26, 19), T.p(0.32, 0.12, 26), WOOD_DARK.right, 1.1) + ln2(T.p(-0.32, 0.26, 19), T.p(-0.18, 0.26, 26), WOOD_DARK.right, 1.1) + ln2(T.p(0.32, 0.26, 19), T.p(0.18, 0.26, 26), WOOD_DARK.right, 1.1) + T.gable(-0.34, -0.28, 0.34, 0.28, 26, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD.right }, 0.06);
      const a0 = -0.4, b0 = 0.4, vm = 0, v1 = 0.34;
      for (const t of [0.25, 0.5, 0.75]) {
        const v = vm + (v1 - vm) * t, z = 37 - 11 * t;
        out += ln2(T.p(a0, v, z), T.p(b0, v, z), "rgba(40,48,66,.55)", 0.6);
        for (let i = 0; i < 8; i++) {
          const u = a0 + 0.05 + i * 0.1 + (t === 0.5 ? 0.05 : 0);
          if (u < b0 - 0.02) out += ln2(T.p(u, v, z), T.p(u, v + (v1 - vm) * 0.25, z - 11 * 0.25), "rgba(40,48,66,.35)", 0.5);
        }
      }
      out += ln2(T.p(a0, 0, 37), T.p(b0, 0, 37), "#4A5468", 1.8) + ln2(T.p(a0, 5e-3, 37.6), T.p(b0, 5e-3, 37.6), "#A4B0C4", 0.6) + [[-0.26, 0.24, 1.8], [-0.2, 0.28, 1.2], [0.22, 0.1, 1.1]].map(([u, v, r]) => {
        const [mx, my] = T.p(u, v, 37 - 11 * (v / v1));
        return ell2(mx, my, r * 1.4, r * 0.7, "#7E9A52") + ell2(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, "#9DB86A");
      }).join("");
      const [rx, ry] = T.p(0.32, 0.26, 15);
      out += ln2([rx, ry - 4.6], [rx + 2.6, ry - 3.4], "#3D3A36", 0.6) + `<circle cx="${f22(rx + 3)}" cy="${f22(ry)}" r="3.2" fill="none" stroke="#8A6A3A" stroke-width="2"/><circle cx="${f22(rx + 3)}" cy="${f22(ry)}" r="3.2" fill="none" stroke="#C9A46A" stroke-width="1.1"/>`;
      const [lx, ly] = T.p(0.02, 0.18, 23);
      out += ln2(T.p(0.02, 0.18, 27), [lx, ly], "#3D3A36", 0.5) + poly2([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + `<rect x="${f22(lx - 1.8)}" y="${f22(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>` + ln2([lx, ly], [lx, ly + 4], DARK_IRON.left, 0.4) + ell2(lx, ly + 2, 1, 1.2, "#FFF3C4") + poly2([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      out += T.cyl(0.04, 0.38, 0, 11, 0.06, { top: "#B98552", left: WOOD.left, right: WOOD.right }, "tonneau") + [3, 8].map((z) => {
        const [bx, by] = T.p(0.04, 0.38, z);
        return `<path d="M${f22(bx - 3.9)},${f22(by)} A3.9,1.9 0 0 0 ${f22(bx + 3.9)},${f22(by)}" fill="none" stroke="${DARK_IRON.right}" stroke-width="0.8"/>`;
      }).join("");
      const [kx, ky] = T.p(0.4, 0.16, 0);
      out += `<path d="M${f22(kx - 4)},${f22(ky)} C${f22(kx - 5)},${f22(ky - 4.6)} ${f22(kx - 3.4)},${f22(ky - 7.6)} ${f22(kx - 1.6)},${f22(ky - 8.6)} L${f22(kx + 1.8)},${f22(ky - 8.6)} C${f22(kx + 3.6)},${f22(ky - 7.6)} ${f22(kx + 5)},${f22(ky - 4.6)} ${f22(kx + 4)},${f22(ky)} Z" fill="#D8C08E" stroke="${OUT}" stroke-width="0.5"/>` + ln2([kx - 1.8, ky - 8], [kx + 1.8, ky - 8], "#8A6A3A", 0.9);
      out += crate2(0.28, 0.36, 0, 0.07) + crate2(0.16, 0.38, 0, 0.06) + crate2(0.26, 0.34, 9, 0.055);
      const [cx, cy] = T.p(0.26, 0.34, 12.6);
      out += `<path d="M${f22(cx - 4.4)},${f22(cy - 1)} q-1.6,2.2 2.4,2.6 q5,0.4 6.4,-1" stroke="${OUT}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${f22(cx - 4.4)},${f22(cy - 1)} q-1.6,2.2 2.4,2.6 q5,0.4 6.4,-1" stroke="#E08A3A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + ell2(cx, cy - 2.4, 4.6, 2.6, "#F2A65A", ` stroke="${OUT}" stroke-width="0.5"`) + [-2, 0, 2].map((o) => `<path d="M${f22(cx + o - 0.6)},${f22(cy - 4.8)} q0.6,1.2 0,2.4" stroke="#D07A34" stroke-width="0.6" fill="none"/>`).join("") + `<circle cx="${f22(cx + 3.4)}" cy="${f22(cy - 3.2)}" r="2.2" fill="#F2A65A" stroke="${OUT}" stroke-width="0.5"/>` + poly2([[cx + 1.8, cy - 4.6], [cx + 2.2, cy - 6.6], [cx + 3.4, cy - 5.2]], "#F2A65A", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + poly2([[cx + 3.8, cy - 5.2], [cx + 5, cy - 6.6], [cx + 5.2, cy - 4.4]], "#F2A65A", ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`) + `<path d="M${f22(cx + 2.4)},${f22(cy - 3.2)} q0.5,0.5 1,0 M${f22(cx + 3.9)},${f22(cy - 3)} q0.5,0.5 1,0" stroke="#3D2A1E" stroke-width="0.4" fill="none"/>` + dot2(cx + 4, cy - 2.2, 0.35, "#E58A8F") + `<text x="${f22(cx + 5)}" y="${f22(cy - 7)}" font-family="sans-serif" font-size="2.6" font-weight="700" fill="#5A6A80">z</text>`;
      return out + (() => {
        const T2 = tools(T.u - 0.38, T.v + 0.24, "roue");
        return wheelOf(T2);
      })();
    }, "draw")
  }]
};
function wheelOf(T) {
  const [cx, cy] = T.p(0, 0, 8);
  let out = `<ellipse cx="${f22(cx)}" cy="${f22(cy)}" rx="5.6" ry="8.4" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.8" transform="rotate(-18 ${f22(cx)} ${f22(cy)})"/>`;
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU;
    out += ln2([cx, cy], [cx + Math.cos(a) * 5, cy + Math.sin(a) * 7.6], WOOD.right, 0.8);
  }
  return out + dot2(cx, cy, 1.4, DARK_IRON.right);
}
__name(wheelOf, "wheelOf");
var fourneau = {
  light: /* @__PURE__ */ __name(() => [-0.02, 0.3, 12, 24, "255,130,50", true], "light"),
  layers: [{
    frame: [-36, -122, 72, 140],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const pulse = [0.85, 1, 0.92, 1.08, 0.9, 1, 0.95, 1.05][f];
      const hot = /* @__PURE__ */ __name((o) => `rgba(255,${f22(120 + 60 * (pulse - 0.85) / 0.23)},40,${o})`, "hot");
      let out = ell2(x, y + 1, 33, 13.6, "#A08A70", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 22, 8, "#B09A7E") + [[-24, 3], [22, 6], [-12, 10], [26, -2]].map(([dx, dy]) => ell2(x + dx, y + dy, 1.6, 1, "#5A4A44", ` stroke="${OUT}" stroke-width="0.3"`)).join("") + T.shadow(0, 0, 0.42, 0.22);
      out += T.box(-0.32, -0.32, 0.32, 0.32, 0, 10, STONE) + ln2(T.p(-0.32, 0.32, 5), T.p(0.32, 0.32, 5), "rgba(120,110,95,.4)", 0.5) + ln2(T.p(0.32, 0.32, 5), T.p(0.32, -0.32, 5), "rgba(120,110,95,.4)", 0.5);
      const tiers = [[0.27, 10, 24], [0.23, 24, 38], [0.2, 38, 52], [0.17, 52, 64]];
      for (const [r, z0, z1] of tiers) {
        out += T.box(-r, -r, r, r, z0, z1, BRICK);
        for (let z = z0 + 3.5; z < z1; z += 3.5) out += ln2(T.p(-r, r, z), T.p(r, r, z), "rgba(90,40,25,.35)", 0.5) + ln2(T.p(r, -r, z), T.p(r, r, z), "rgba(90,40,25,.35)", 0.5);
        for (let z = z0; z < z1; z += 7) out += T.box(r - 0.035, r - 0.035, r + 4e-3, r + 4e-3, z, Math.min(z + 3.5, z1), { top: "#EDE6DA", left: "#E2D8C8", right: "#C8BCA8" }, ' stroke="rgba(60,40,25,.45)" stroke-width="0.4"');
        out += ln2(T.p(-r - 5e-3, r + 5e-3, z1 - 1), T.p(r + 5e-3, r + 5e-3, z1 - 1), DARK_IRON.right, 1.2) + ln2(T.p(r + 5e-3, r + 5e-3, z1 - 1), T.p(r + 5e-3, -r - 5e-3, z1 - 1), DARK_IRON.right, 1.2);
      }
      out += T.box(-0.19, -0.19, 0.19, 0.19, 64, 67, STONE);
      const [mx, my] = T.p(-0.02, 0.27, 10);
      const [ax, ay] = T.p(-0.02, 0.32, 0), [bx, by] = T.p(-0.04, 0.42, 0), [cx, cy] = T.p(-0.16, 0.46, 0);
      out += `<path d="M${f22(mx - 6.4)},${f22(my)} L${f22(mx - 6.4)},${f22(my - 8)} A6.4,6 0 0 1 ${f22(mx + 6.4)},${f22(my - 8)} L${f22(mx + 6.4)},${f22(my)} Z" fill="#2A140C" stroke="${OUT}" stroke-width="0.6"/>` + ell2(mx, my - 4, 5 * pulse, 3.6 * pulse, "#F2862A") + ell2(mx, my - 3.4, 3.2 * pulse, 2 * pulse, "#FFD24E") + `<path d="M${f22(mx)},${f22(my - 1)} L${f22(ax)},${f22(ay)} Q${f22(bx + 2)},${f22(by - 1)} ${f22(bx)},${f22(by)} L${f22(cx)},${f22(cy)}" stroke="#3A2A20" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f22(mx)},${f22(my - 1)} L${f22(ax)},${f22(ay)} Q${f22(bx + 2)},${f22(by - 1)} ${f22(bx)},${f22(by)} L${f22(cx)},${f22(cy)}" stroke="${hot(1)}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + [[-0.22, 0.42], [-0.1, 0.48]].map(([u, v]) => T.face([[u - 0.05, v - 0.03, 0.4], [u + 0.05, v - 0.03, 0.4], [u + 0.05, v + 0.03, 0.4], [u - 0.05, v + 0.03, 0.4]], "#3A2A20", ` stroke="${OUT}" stroke-width="0.5"`) + T.face([[u - 0.035, v - 0.018, 0.5], [u + 0.035, v - 0.018, 0.5], [u + 0.035, v + 0.018, 0.5], [u - 0.035, v + 0.018, 0.5]], hot(0.95))).join("");
      const lev = f % 2 ? 2 : 0;
      out += T.box(0.3, -0.06, 0.42, 0.1, 3, 5, WOOD) + poly2([T.p(0.3, -0.04, 6), T.p(0.42, -0.04, 9 + lev), T.p(0.42, 0.08, 9 + lev), T.p(0.3, 0.08, 6)], "#7A4A2A", ` stroke="${OUT}" stroke-width="0.5"`) + [0.34, 0.38].map((u) => ln2(T.p(u, 0.08, 6.4 + (u - 0.3) * 25 * (lev ? 1.25 : 1)), T.p(u, -0.04, 6.4 + (u - 0.3) * 25 * (lev ? 1.25 : 1)), "rgba(40,20,10,.4)", 0.5)).join("") + ln2(T.p(0.3, 0.02, 7), T.p(0.27, 0.02, 14), IRON.right, 1.6) + ln2(T.p(0.42, 0.02, 9 + lev), T.p(0.5, 0.02, 15 + lev * 1.5), WOOD.right, 1.3);
      out += boulder(T.u + 0.2, T.v + 0.36, 0.1, 0.08, 5, { top: "#B07A62", left: "#8A5A46", right: "#643E30" }, 5, 0.4, 0.5) + boulder(T.u + 0.36, T.v + 0.2, 0.08, 0.07, 4, { top: "#55555C", left: "#36363C", right: "#222227" }, 9, 0.45, 0.5) + [[0.36, 0.2, 4.6], [0.33, 0.24, 3]].map(([u, v, z]) => dot2(...T.p(u, v, z), 0.5, "#C6D4EA")).join("");
      const [gx, gy] = T.p(0, 0, 66);
      out += [0, 1, 2].map((k) => {
        const p = (f + k * 3) % n / n;
        return puff(gx - 3 + p * 8, gy - 4 - p * 30, 3 + p * 5, 0.65 * (1 - p));
      }).join("") + [0, 1, 2, 3].map((k) => {
        const p = (f * 1.3 + k * 2) % n / n;
        return dot2(gx + Math.sin(k * 2.3 + p * 3) * 6, gy - 2 - p * 22, 0.9, p < 0.7 ? "#FFC24A" : "#FF7A3A");
      }).join("");
      return out;
    }, "draw")
  }]
};
var HOUSE_LOOKS = [
  { roof: ROOF_RED, door: "#3E6E9C" },
  { roof: BLUE_ROOF, door: "#C9473A" },
  { roof: THATCH, door: "#4F8A3A" },
  { roof: SLATE_ROOF, door: "#B5772F" }
];
var maison = {
  light: /* @__PURE__ */ __name(() => [0.27, 0.06, 13, 12], "light"),
  layers: [{
    frame: [-34, -78, 68, 96],
    n: 6,
    fps: 3,
    draw: /* @__PURE__ */ __name((T, f, n, variant = 0) => {
      const look = HOUSE_LOOKS[variant % HOUSE_LOOKS.length];
      const [chx, chy] = T.p(-0.12, -0.1, 36);
      const smoke = [0, 1].map((k) => {
        const p = (f + k * 3) % n / n;
        return puff(chx + p * 5, chy - 4 - p * 16, 1.8 + p * 3.2, 0.55 * (1 - p));
      }).join("");
      const pane = /* @__PURE__ */ __name((pts3, fill) => T.face(pts3, fill, ` stroke="${WOOD_DARK.right}" stroke-width="0.9"`), "pane");
      const [gx, gy] = T.p(0, 0, 0);
      return ell2(gx, gy + 1, 31, 12.6, "#9CC46A", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(gx - 4, gy, 21, 7.6, "#ADD27A") + [[0.02, 0.32], [0.06, 0.42], [0.1, 0.52]].map(([du, dv]) => {
        const [px, py] = T.p(du, dv, 0);
        return ell2(px, py, 2.8, 1.4, "#C9C2B4", ` stroke="${OUT}" stroke-width="0.4"`);
      }).join("") + [[0.32, 0.12, "#E8566A"], [0.34, -0.04, "#F2C04B"], [-0.32, 0.26, "#B48AE0"]].map(([du, dv, c]) => {
        const [fx, fy] = T.p(du, dv, 0);
        return [-1.4, 0, 1.4].map((o, i) => ln2([fx + o * 0.4, fy], [fx + o, fy - 3.4 - i % 2], "#6F9A44", 0.6) + dot2(fx + o, fy - 3.8 - i % 2, 0.8, c)).join("");
      }).join("") + T.shadow(0, 0, 0.36, 0.2) + T.box(-0.26, -0.22, 0.26, 0.22, 0, 4, STONE) + T.box(-0.07, 0.22, 0.09, 0.28, 0, 2, STONE) + T.box(-0.24, -0.2, 0.24, 0.2, 4, 21, WALL) + pane([[-0.05, 0.2, 4], [0.07, 0.2, 4], [0.07, 0.2, 15], [-0.05, 0.2, 15]], look.door) + dot2(...T.p(0.05, 0.2, 9.5), 0.6, "#F2C04B") + pane([[0.24, -0.06, 10], [0.24, 0.07, 10], [0.24, 0.07, 16], [0.24, -0.06, 16]], GLASS) + ln2(T.p(0.24, 5e-3, 10), T.p(0.24, 5e-3, 16), WOOD_DARK.right, 0.7) + [[-0.11, -0.065], [0.075, 0.12]].map(([v0, v1]) => T.face([[0.241, v0, 10], [0.241, v1, 10], [0.241, v1, 16], [0.241, v0, 16]], look.door, ` stroke="${WOOD_DARK.right}" stroke-width="0.5"`)).join("") + pane([[-0.16, 0.2, 10], [-0.1, 0.2, 10], [-0.1, 0.2, 15], [-0.16, 0.2, 15]], GLASS) + T.box(-0.18, 0.2, -0.08, 0.25, 8, 10, WOOD) + [-0.165, -0.13, -0.095].map((du, k) => dot2(...T.p(du, 0.23, 11.2), 1.3, ["#E8566A", "#F2C04B", "#B48AE0"][k])).join("") + T.cyl(-0.12, -0.1, 24, 36, 0.035, BRICK, "chem") + T.gable(-0.27, -0.23, 0.27, 0.23, 21, 11, { front: look.roof.front, back: look.roof.back, gable: WALL.right }, 0.05) + [0.33, 0.66].map((t) => ln2(T.p(-0.32, 0.28 * t, 32 - 11 * t), T.p(0.32, 0.28 * t, 32 - 11 * t), "rgba(40,30,20,.3)", 0.6)).join("") + ln2(T.p(-0.32, 0, 32), T.p(0.32, 0, 32), "rgba(40,30,20,.45)", 1.2) + smoke;
    }, "draw")
  }]
};
var ICE_BLOCK = { top: "#E9F8FF", left: "#BFE7F7", right: "#8CCBE8" };
var SNOWY = { top: "#FFFFFF", left: "#EEF4FA", right: "#CFDDEA" };
var SALT = { top: "#FFFFFF", left: "#EDE6DE", right: "#CFC4B6" };
var glaciere = {
  layers: [{
    frame: [-34, -50, 68, 64],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 30, 12.7, SNOWY.top, ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x + 4, y + 3, 22, 7, SNOWY.left) + [[-20, 8], [-15, 10], [-10, 8.6]].map(([dx2, dy2]) => ell2(x + dx2, y + dy2, 1.6, 0.9, SNOWY.right)).join("") + T.shadow(0, 0, 0.38, 0.16);
      out += `<path d="M${x - 22},${y} A22,22 0 0 1 ${x + 22},${y} Q${x},${y + 9} ${x - 22},${y} Z" fill="${STONE.left}" stroke="${OUT}" stroke-width="0.8"/>`;
      for (const [r, n] of [[0, 9], [5.5, 8], [11, 7]]) {
        const w = Math.sqrt(484 - r * r), y0 = y - r;
        for (let k = 0; k < n; k++) {
          const x0 = x - w + (k + 0.08) * (2 * w / n) + (r / 5.5 % 2 ? w / n / 2 : 0), x1 = Math.min(x0 + 2 * w / n * 0.86, x + w);
          if (x0 >= x + w - 1) continue;
          const sag = ((xx) => (1 - ((xx - x) / w) ** 2) * 3.4)((x0 + x1) / 2);
          out += `<path d="M${f22(x0)},${f22(y0 + sag)} Q${f22((x0 + x1) / 2)},${f22(y0 + sag - 5.6)} ${f22(x1)},${f22(y0 + sag)} Q${f22((x0 + x1) / 2)},${f22(y0 + sag + 1.2)} ${f22(x0)},${f22(y0 + sag)} Z" fill="${k % 3 ? STONE.top : STONE.left}" stroke="${STONE.right}" stroke-width="0.6"/>`;
        }
      }
      out += `<path d="M${x + 6},${y + 4} Q${x + 16},${y - 4} ${x + 18},${y - 13} A22,22 0 0 1 ${x + 22},${y} Q${x + 14},${y + 5} ${x + 6},${y + 4} Z" fill="${STONE.right}" opacity="0.55"/>`;
      let cap = `M${x - 15},${y - 16} A22,22 0 0 1 ${x + 15},${y - 16}`;
      for (let k = 0; k < 6; k++) {
        const xa = x + 15 - k * 5, xb = xa - 5;
        cap += ` Q${f22((xa + xb) / 2)},${f22(y - 12.4 + (k % 2 ? 1 : -0.6))} ${f22(xb)},${f22(y - 16 + Math.abs(xb - x) * 0.02)}`;
      }
      out += `<path d="${cap} Z" fill="${SNOWY.top}" stroke="${OUT}" stroke-width="0.6"/><path d="M${x - 8},${y - 19.4} q5,-2.4 10,-1.6" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/>` + [[-11, 3], [-4, 4.6], [3, 3.4], [9, 4]].map(([dx2, l]) => poly2([[x + dx2 - 1, y - 14.6], [x + dx2 + 1, y - 14.6], [x + dx2, y - 14.6 + l]], ICE_BLOCK.left, ` stroke="${OUT}" stroke-width="0.4"`)).join("");
      const [dx, dy] = T.p(0.02, 0.34, 0);
      out += `<path d="M${dx - 7},${dy} L${dx - 7},${dy - 10.4} A7,5.6 0 0 1 ${dx + 7},${dy - 10.4} L${dx + 7},${dy} Z" fill="${WOOD.right}" stroke="${OUT}" stroke-width="0.6"/><path d="M${dx - 5.4},${dy} L${dx - 5.4},${dy - 9.6} A5.4,4.4 0 0 1 ${dx + 5.4},${dy - 9.6} L${dx + 5.4},${dy} Z" fill="#3A3E4A"/>` + ell2(dx, dy - 4, 3.4, 2.4, "rgba(160,220,255,.45)");
      out += T.box(0.24, 0.22, 0.4, 0.38, 0, 8, ICE_BLOCK) + T.box(0.28, 0.26, 0.38, 0.36, 8, 14, ICE_BLOCK) + T.box(-0.42, 0.2, -0.28, 0.34, 0, 7, ICE_BLOCK) + ln2(T.p(0.26, 0.38, 6), T.p(0.3, 0.38, 2), "rgba(255,255,255,.85)", 0.8) + ln2(T.p(-0.4, 0.34, 5.4), T.p(-0.36, 0.34, 1.6), "rgba(255,255,255,.85)", 0.8) + star(...T.p(0.33, 0.31, 16), 2.2, "#FFFFFF", 0.9);
      return out;
    }, "draw")
  }]
};
var metier = {
  layers: [{
    frame: [-34, -52, 68, 66],
    n: 4,
    fps: 2,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const sway = wave(f, n, 1);
      const heather = /* @__PURE__ */ __name((du, dv, s) => {
        const [hx, hy] = T.p(du, dv, 0);
        return [-2.4, -0.8, 0.8, 2.4].map((o, i) => ln2([hx + o * 0.5 * s, hy], [hx + o * s, hy - (4 + i % 2 * 1.6) * s], "#6F8C46", 0.7)).join("") + [[-2.2, -4.4], [-0.6, -5.8], [1, -4.8], [2.4, -5.2], [0, -3.6]].map(([dx, dy], i) => dot2(hx + dx * s, hy + dy * s, 0.9 * s, i % 2 ? "#B57BC4" : "#D49ADB")).join("");
      }, "heather");
      let out = ell2(x, y + 1, 31, 12.7, "#B9B47C", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 21, 8, "#C8C48E") + heather(-0.44, -0.06, 1) + heather(-0.12, -0.44, 0.9) + T.shadow(0, 0, 0.36, 0.18);
      const [ax, ay] = T.p(0.42, -0.36, 15), [bx, by] = T.p(0.42, 0, 15);
      out += post(T, 0.42, -0.36, 0, 16, WOOD_DARK, 0.012) + post(T, 0.42, 0, 0, 16, WOOD_DARK, 0.012) + `<path d="M${f22(ax)},${f22(ay)} Q${f22((ax + bx) / 2)},${f22((ay + by) / 2 + 2.4)} ${f22(bx)},${f22(by)}" stroke="#7A5A2A" stroke-width="0.6" fill="none"/>` + [[0.25, "#E2574C"], [0.5, "#6FA3D9"], [0.75, "#F2C04B"]].map(([t, c], i) => {
        const sx = ax + (bx - ax) * t, sy = ay + (by - ay) * t + Math.sin(t * Math.PI) * 2.4, d = sway * (0.6 + i * 0.2);
        return `<path d="M${f22(sx - 1.4)},${f22(sy)} Q${f22(sx - 2 + d)},${f22(sy + 5)} ${f22(sx + d)},${f22(sy + 7.4)} Q${f22(sx + 2 + d)},${f22(sy + 5)} ${f22(sx + 1.4)},${f22(sy)}" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + ln2([sx - 1, sy + 0.6], [sx + 1, sy + 0.6], "rgba(0,0,0,.25)", 0.5);
      }).join("");
      out += post(T, -0.24, -0.16, 0, 24, WOOD_DARK, 0.025) + post(T, 0.24, -0.16, 0, 24, WOOD_DARK, 0.025) + post(T, -0.3, 0.02, 0, 22, WOOD, 0.018) + post(T, 0.1, 0.02, 0, 22, WOOD, 0.018);
      const rows = ["#E2574C", "#F4ECDC", "#6FA3D9", "#F2C04B"];
      for (let k = 0; k < 4; k++) out += T.face([[-0.28, 0.02, 6 + k * 1.75], [0.08, 0.02, 6 + k * 1.75], [0.08, 0.02, 7.75 + k * 1.75], [-0.28, 0.02, 7.75 + k * 1.75]], rows[(k + f) % rows.length], ` stroke="rgba(60,40,25,.35)" stroke-width="0.3"`);
      for (let i = 0; i <= 10; i++) {
        const u = -0.27 + i * 0.034;
        out += ln2(T.p(u, 0.02, 20.4), T.p(u, 0.02, 13), "rgba(250,245,230,.95)", 0.4);
      }
      const zl = 16.6 + (f % 2 ? 1.2 : -1.2);
      out += ln2(T.p(-0.29, 0.02, zl), T.p(0.09, 0.02, zl), WOOD_DARK.right, 1.3) + ln2(T.p(-0.32, 0.02, 21), T.p(0.12, 0.02, 21), WOOD.right, 2.2) + ln2(T.p(-0.32, 0.02, 21.6), T.p(0.12, 0.02, 21.6), WOOD.top, 0.6) + ln2(T.p(-0.32, 0.03, 5.4), T.p(0.12, 0.03, 5.4), "#C9564A", 3) + ln2(T.p(-0.32, 0.03, 6.2), T.p(0.12, 0.03, 6.2), "rgba(255,255,255,.3)", 0.6);
      const su = [-0.23, -0.1, 0.03, -0.1][f];
      const [nx, ny] = T.p(su, 0.05, 13.2);
      out += ln2(T.p(-0.28, 0.02, 13.2), [nx, ny], "#E2574C", 0.5) + `<path d="M${f22(nx - 3.4)},${f22(ny)} Q${f22(nx)},${f22(ny - 1.6)} ${f22(nx + 3.4)},${f22(ny)} Q${f22(nx)},${f22(ny + 1.2)} ${f22(nx - 3.4)},${f22(ny)} Z" fill="${WOOD.top}" stroke="${OUT}" stroke-width="0.5"/>` + dot2(nx, ny - 0.2, 0.6, "#E2574C");
      out += post(T, -0.24, 0.16, 0, 24, WOOD_DARK, 0.025) + post(T, 0.24, 0.16, 0, 24, WOOD_DARK, 0.025) + T.gable(-0.3, -0.22, 0.3, 0.22, 24, 10, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.06);
      for (const t of [0.33, 0.66]) out += ln2(T.p(-0.36, 0.28 * t, 34 - 10 * t), T.p(0.36, 0.28 * t, 34 - 10 * t), "rgba(110,40,30,.45)", 0.7);
      for (let i = 0; i < 7; i++) {
        const u = -0.31 + i * 0.1;
        out += ln2(T.p(u, 0, 34), T.p(u, 0.28, 24), "rgba(110,40,30,.25)", 0.5);
      }
      out += ln2(T.p(-0.36, 0, 34), T.p(0.36, 0, 34), "#8A3A2C", 1.6) + ln2(T.p(-0.36, 4e-3, 34.6), T.p(0.36, 4e-3, 34.6), "rgba(255,220,200,.6)", 0.5);
      out += [[-0.14, 0.22], [-0.06, 0.22], [-0.14, 0.3], [-0.06, 0.3]].map(([u, v]) => post(T, u, v, 0, 4.6, WOOD_DARK, 8e-3)).join("") + T.box(-0.16, 0.2, -0.04, 0.32, 4.6, 5.8, WOOD);
      const [kx, ky] = T.p(-0.34, 0.28, 0);
      const ball = /* @__PURE__ */ __name((dx, dy, c) => dot2(kx + dx, ky + dy, 2.6, c) + `<path d="M${f22(kx + dx - 2)},${f22(ky + dy - 1)} q2,-1.2 4,0.6 M${f22(kx + dx - 1.6)},${f22(ky + dy + 0.6)} q2,-1 3.4,0.6" stroke="rgba(0,0,0,.2)" stroke-width="0.5" fill="none"/>`, "ball");
      out += ell2(kx + 1, ky + 0.6, 7, 2.2, "rgba(40,55,20,.22)") + ball(-2.4, -5.4, "#6FA3D9") + ball(2.2, -5.6, "#F2C04B") + ball(0, -7.2, "#E2574C") + `<path d="M${f22(kx - 6)},${f22(ky - 5)} L${f22(kx - 4.8)},${f22(ky)} Q${f22(kx)},${f22(ky + 1.8)} ${f22(kx + 4.8)},${f22(ky)} L${f22(kx + 6)},${f22(ky - 5)} Q${f22(kx)},${f22(ky - 2.8)} ${f22(kx - 6)},${f22(ky - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/><path d="M${f22(kx - 5.4)},${f22(ky - 2.4)} Q${f22(kx)},${f22(ky - 0.4)} ${f22(kx + 5.4)},${f22(ky - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`;
      const [tx, ty] = T.p(-0.28, 0.04, 8);
      return out + `<path d="M${f22(kx)},${f22(ky - 8)} Q${f22((kx + tx) / 2)},${f22(ky - 3 + sway)} ${f22(tx)},${f22(ty)}" stroke="#E2574C" stroke-width="0.5" fill="none"/>`;
    }, "draw")
  }]
};
var hutte = {
  layers: [{
    frame: [-34, -56, 68, 70],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      const R = { light: "#E2CD88", mid: "#C9AE62", dark: "#9E8440", line: "rgba(110,80,30,.45)" };
      let out = ell2(x, y + 1, 28, 12, "#8C7A52", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 3, y, 19, 7, "#9C8A60") + ell2(x + 15, y + 6, 8, 3, "#7FB2C8", ` stroke="${OUT}" stroke-width="0.4"`) + ell2(x + 13.6, y + 5.4, 3, 1, "rgba(255,255,255,.6)") + `<path d="M${f22(x + 17)},${f22(y + 6)} a2.6,1 0 1 1 0.8,0.8 Z" fill="#6FAE4E" stroke="${OUT}" stroke-width="0.4"/>` + [[-24, 2], [-21, 5], [22, -2]].map(([dx2, dy2]) => ln2([x + dx2, y + dy2], [x + dx2 - 1, y + dy2 - 12], "#5E8C3A", 1) + ell2(x + dx2 - 1, y + dy2 - 12.6, 1, 2.4, "#8A5A2E", ` stroke="${OUT}" stroke-width="0.3"`)).join("") + T.shadow(0, 0, 0.32, 0.2);
      const wr = 15, wh = 18;
      out += `<path d="M${x - wr},${y} L${x - wr},${y - wh} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - wh} L${x + wr},${y} A${wr},${wr * 0.5} 0 0 1 ${x - wr},${y} Z" fill="${R.mid}" stroke="${OUT}" stroke-width="0.7"/><path d="M${x + 4},${y + wr * 0.48} L${x + 4},${y - wh + wr * 0.48} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - wh} L${x + wr},${y} A${wr},${wr * 0.5} 0 0 1 ${x + 4},${y + wr * 0.48} Z" fill="${R.dark}"/>`;
      for (let k = 1; k < 10; k++) {
        const t = -1 + k / 10 * 2, bx = x + t * wr, by = y + Math.sqrt(1 - t * t) * wr * 0.5;
        out += ln2([bx, by], [bx, by - wh], R.line, 0.6);
      }
      for (const z of [5, 11]) out += `<path d="M${x - wr},${y - z} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - z}" fill="none" stroke="#7A5A2A" stroke-width="1"/>`;
      const [dx, dy] = T.p(0.02, 0.24, 0);
      out += `<path d="M${f22(dx - 4.4)},${f22(dy)} L${f22(dx - 4.4)},${f22(dy - 9)} Q${f22(dx)},${f22(dy - 13)} ${f22(dx + 4.4)},${f22(dy - 9)} L${f22(dx + 4.4)},${f22(dy)} Z" fill="#3E2C1C" stroke="${OUT}" stroke-width="0.5"/>` + [-3, -1.5, 0, 1.5, 3].map((o) => ln2([dx + o, dy - 10.6 + Math.abs(o) * 0.4], [dx + o * 1.1, dy - 4], R.light, 0.7)).join("");
      const top = y - wh - 22, rr = wr + 5;
      const frange = /* @__PURE__ */ __name((y0, r, c) => {
        let d = `M${f22(x - r)},${f22(y0)}`;
        for (let k = 0; k < 8; k++) {
          const x0 = x - r + k / 8 * 2 * r, x1 = x - r + (k + 1) / 8 * 2 * r, cy = y0 + Math.sqrt(Math.max(0, 1 - (((x0 + x1) / 2 - x) / r) ** 2)) * r * 0.5;
          d += ` Q${f22((x0 + x1) / 2)},${f22(cy + 3.4)} ${f22(x1)},${f22(y0 + Math.sqrt(Math.max(0, 1 - ((x1 - x) / r) ** 2)) * r * 0.5)}`;
        }
        return `<path d="${d} L${x},${f22(top)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
      }, "frange");
      out += frange(y - wh + 1, rr, R.mid) + `<path d="M${x + 3},${f22(top + 2)} L${f22(x + rr)},${f22(y - wh + 1)} Q${f22(x + rr * 0.6)},${f22(y - wh + rr * 0.42)} ${f22(x + 4)},${f22(y - wh + rr * 0.5)} Z" fill="${R.dark}" opacity="0.8"/>` + frange(y - wh - 7, rr - 5, R.light) + frange(y - wh - 14, rr - 10, R.mid) + [-0.6, -0.3, 0, 0.3, 0.6].map((t) => ln2([x + t * rr * 0.9, y - wh + 2], [x + t * 4, top + 6], R.line, 0.5)).join("") + ell2(x, top + 1, 3, 1.6, "#7A5A2A", ` stroke="${OUT}" stroke-width="0.5"`) + ln2([x, top + 1], [x + 1, top - 4], R.dark, 1.6) + ln2([x, top + 1], [x - 2, top - 3], R.dark, 1.2);
      const bundle = /* @__PURE__ */ __name((du, dv) => {
        const [bx, by] = T.p(du, dv, 0);
        return [-2, -0.7, 0.7, 2].map((d) => ln2([bx + d, by], [bx + d * 0.4, by - 14], d < 0 ? R.mid : R.light, 1.4)).join("") + ln2([bx - 2.6, by - 6], [bx + 2.6, by - 6], "#7A5A2A", 1.2) + ell2(bx, by - 14.6, 1.6, 0.9, R.dark);
      }, "bundle");
      return out + bundle(-0.1, 0.38) + bundle(0.38, -0.08);
    }, "draw")
  }]
};
var saline = {
  layers: [{
    frame: [-36, -40, 72, 52],
    n: 6,
    fps: 2,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const LEVEE = { top: "#DCCBA6", left: "#C2AC84", right: "#9E8864" };
      const [x, y] = T.p(0, 0, 0);
      const oyat = /* @__PURE__ */ __name((du, dv, s, ph) => {
        const [ox, oy] = T.p(du, dv, 0);
        return [-3, -1.5, 0, 1.6, 3].map((o, i) => `<path d="M${f22(ox + o * 0.4)},${f22(oy)} q${f22(o * 0.5)},${f22(-5 * s)} ${f22(o * 1.3 + wave(f, n, 0.7, ph + i * 0.5))},${f22(-(8 + i % 2 * 2.5) * s)}" stroke="${i % 2 ? "#B7C27A" : "#8FA45A"}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`).join("");
      }, "oyat");
      let out = ell2(x, y - 1, 33, 12, "#EAD6A2", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 5, y - 3, 22, 7, "#F3E4BC") + [[-20, 5, 1], [24, 2, 0.9], [8, 9, 0.8]].map(([dx, dy, r]) => ell2(x + dx, y + dy, r * 1.6, r, "#CDB27A")).join("") + oyat(-0.46, -0.02, 0.9, 0);
      const [hx, hy] = T.p(-0.36, -0.34, 0);
      out += T.shadow(-0.36, -0.34, 0.13, 0.18) + `<g transform="translate(${f22(hx)} ${f22(hy)}) scale(.72) translate(${f22(-hx)} ${f22(-hy)})">` + ln2([hx + 4, hy - 10], [hx + 9.6, hy - 27], WOOD.right, 1.7) + ln2([hx + 7.6, hy - 27.6], [hx + 11.6, hy - 26.4], WOOD.right, 1.7) + `<path d="M${hx - 15},${hy + 1} Q${hx - 9},${hy - 12} ${hx - 1},${hy - 21.6} Q${hx + 1},${hy - 23.2} ${hx + 3},${hy - 21.4} Q${hx + 10},${hy - 12} ${hx + 15},${hy + 1} Q${hx},${hy + 6} ${hx - 15},${hy + 1} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.7"/><path d="M${hx + 3},${hy - 21.4} Q${hx + 10},${hy - 12} ${hx + 15},${hy + 1} Q${hx + 9},${hy + 4} ${hx + 4},${hy + 4.6} Q${hx + 6.6},${hy - 8} ${hx + 3},${hy - 21.4} Z" fill="#DDE5EE"/>` + [[-9, -4], [-5, -10], [1, -6], [-11, -1], [6, -2], [-2, -15], [-6, 1]].map(([dx, dy]) => ln2([hx + dx, hy + dy], [hx + dx + 1.4, hy + dy + 0.6], "rgba(140,160,185,.55)", 0.5)).join("") + `<path d="M${hx - 6},${hy - 14} q2,-2.6 4.4,-4.6" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.9"/>` + (([sx, sy]) => star(hx + sx, hy + sy, 2.4, "#FFFFFF", 0.5 + 0.5 * Math.abs(wave(f, n))) + star(hx + sx, hy + sy, 1.2, "#BFE6FF", 0.9))([[-5, -12], [3, -17], [8, -5]][f % 3]) + "</g>";
      const [bx, by] = T.p(-0.36, 0.14, 0);
      out += `<g transform="translate(${f22(bx)} ${f22(by)}) scale(.8) translate(${f22(-bx)} ${f22(-by)})">` + ell2(bx + 1, by + 0.6, 7, 2.4, "rgba(40,55,20,.2)") + `<path d="M${bx - 6},${by - 8} L${bx - 4.6},${by} Q${bx},${by + 2} ${bx + 4.6},${by} L${bx + 6},${by - 8} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/>` + [2.6, 5.2].map((d) => `<path d="M${f22(bx - 6 + d * 0.27)},${f22(by - 8 + d)} Q${bx},${f22(by - 6 + d)} ${f22(bx + 6 - d * 0.27)},${f22(by - 8 + d)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`).join("") + [-3, 0, 3].map((o) => ln2([bx + o * 1.1, by - 7], [bx + o * 0.9, by + 0.8], "rgba(120,85,40,.5)", 0.5)).join("") + ell2(bx, by - 8, 6, 2.2, "#A87C40", ` stroke="${OUT}" stroke-width="0.6"`) + `<path d="M${bx - 5.2},${by - 8.4} Q${bx - 1},${by - 14.4} ${bx + 5.2},${by - 8.4} Q${bx},${by - 6.6} ${bx - 5.2},${by - 8.4} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.5"/>` + ln2([bx - 10, by + 2.4], [bx + 1.4, by - 16], WOOD.right, 1.3) + ln2([bx - 9.6, by + 2], [bx + 1.6, by - 15.6], WOOD.top, 0.5) + ln2([bx - 14, by + 3.6], [bx - 6, by + 1.2], WOOD_DARK.right, 2.2) + "</g>";
      out += T.shadow(0.08, 0.08, 0.34, 0.12) + T.box(-0.2, -0.2, 0.36, 0.36, 0, 2.4, LEVEE);
      const a = 0.12, z = 1.1;
      [[-0.06, -0.06, "#7CC6EA"], [0.22, -0.06, "#A8DDE8"], [-0.06, 0.22, "#F1C3CB"], [0.22, 0.22, "#F4EFE6"]].forEach(([u, v, c], k) => {
        out += T.face([[u - a, v - a, 2.4], [u + a, v - a, 2.4], [u + a, v - a, z], [u - a, v - a, z]], LEVEE.left) + T.face([[u - a, v - a, 2.4], [u - a, v + a, 2.4], [u - a, v + a, z], [u - a, v - a, z]], LEVEE.right) + T.face([[u - a, v - a, z], [u + a, v - a, z], [u + a, v + a, z], [u - a, v + a, z]], c, ` stroke="rgba(60,40,25,.35)" stroke-width="0.4"`);
        if (k < 3) {
          const t = (f + k * 2) % n / n, dv = -a * 0.6 + t * a * 1.2;
          out += ln2(T.p(u - a * 0.55, v + dv, z), T.p(u + a * 0.15, v + dv, z), "rgba(255,255,255,.8)", 0.8) + ln2(T.p(u - a * 0.1, v + dv + a * 0.35, z), T.p(u + a * 0.4, v + dv + a * 0.35, z), "rgba(255,255,255,.45)", 0.6);
        } else {
          out += [[-0.06, -0.05], [0.05, -0.06], [-0.05, 0.05], [0.06, 0.04], [0, -0.02]].map(([du, dv]) => {
            const [cx, cy] = T.p(u + du, v + dv, z);
            return poly2([[cx - 1.1, cy], [cx, cy - 0.6], [cx + 1.1, cy], [cx, cy + 0.6]], "#FFFFFF");
          }).join("");
          const [mx, my] = T.p(u + 0.01, v + 0.01, z);
          out += `<path d="M${f22(mx - 4.4)},${f22(my + 0.6)} Q${f22(mx - 0.6)},${f22(my - 5.6)} ${f22(mx + 4.4)},${f22(my + 0.6)} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.5"/>` + star(mx + 1, my - 3.6, 1.6, "#FFFFFF", f % 2 ? 1 : 0.4);
        }
      });
      const [gx, gy] = T.p(0.33, -0.17, 2.4);
      const pk = f === 3 ? 1 : 0, hxg = gx + 4.2 + pk * 1.4, hyg = gy - 9.6 + pk * 4.6;
      out += `<g transform="translate(${f22(gx)} ${f22(gy)}) scale(.62) translate(${f22(-gx)} ${f22(-gy)})">` + ell2(gx, gy + 0.4, 4.6, 1.2, "rgba(40,55,20,.2)") + ln2([gx - 0.8, gy - 3], [gx - 1, gy], "#E8923A", 0.7) + ln2([gx + 1, gy - 3], [gx + 1.2, gy], "#E8923A", 0.7) + `<path d="M${f22(gx - 6.4)},${f22(gy - 6.2)} Q${f22(gx - 3)},${f22(gy - 9.4)} ${f22(gx + 2)},${f22(gy - 8.6)} Q${f22(gx + 5)},${f22(gy - 7.6)} ${f22(gx + 3.6)},${f22(gy - 4.4)} Q${f22(gx)},${f22(gy - 2.4)} ${f22(gx - 3.6)},${f22(gy - 4)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(gx - 7.6)},${f22(gy - 6.6)} Q${f22(gx - 3)},${f22(gy - 9.2)} ${f22(gx + 2)},${f22(gy - 7.4)} Q${f22(gx - 1)},${f22(gy - 4.6)} ${f22(gx - 5)},${f22(gy - 5)} Z" fill="#AEB8C4" stroke="${OUT}" stroke-width="0.4"/><path d="M${f22(gx - 7.6)},${f22(gy - 6.6)} l2.4,0.1 l-0.8,1.3 Z" fill="#2E3238"/>` + ln2([gx + 2.4, gy - 7.4], [hxg - 0.6, hyg + 1], OUT, 3.4) + ln2([gx + 2.4, gy - 7.4], [hxg - 0.6, hyg + 1], "#FFFFFF", 2.4) + `<circle cx="${f22(hxg)}" cy="${f22(hyg)}" r="2.2" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/><path d="M${f22(hxg + 1.8)},${f22(hyg - 0.5)} l3,0.8 l-3,0.8 Z" fill="#F2C443" stroke="${OUT}" stroke-width="0.3"/>` + dot2(hxg + 4, hyg + 0.6, 0.45, "#E2463A") + dot2(hxg + 0.7, hyg - 0.6, 0.5, "#2A2420") + "</g>";
      return out + oyat(0.45, -0.4, 0.8, 1.6) + oyat(-0.44, 0.38, 1, 3);
    }, "draw")
  }]
};
var serre = {
  light: /* @__PURE__ */ __name(() => [0, 0, 16, 18, "190,255,170"], "light"),
  layers: [{
    frame: [-36, -58, 72, 72],
    n: 6,
    fps: 2,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const GF = { top: "rgba(225,243,255,.3)", left: "rgba(196,228,246,.24)", right: "rgba(160,205,232,.34)" };
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      const leaf3 = /* @__PURE__ */ __name((lx, ly, s, a, c) => `<g transform="translate(${f22(lx)} ${f22(ly)}) rotate(${a}) scale(${s})"><path d="M0,0 Q-6,-3 -6,-9 Q-5,-14 0,-15 Q5,-14 6,-9 Q6,-3 0,0 Z" fill="${c}" stroke="${OUT}" stroke-width="0.5"/><path d="M0,0 L0,-14 M0,-5 L-4.6,-7 M0,-9 L-4.4,-11.4 M0,-5 L4.6,-7 M0,-9 L4.4,-11.4" stroke="rgba(20,60,30,.5)" stroke-width="0.6" fill="none"/></g>`, "leaf");
      let out = ell2(x, y + 1, 32, 12.7, "#6E8A48", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 22, 8, "#7E9C54") + leaf3(x - 24, y - 2, 0.9, -40, "#3E8A48") + leaf3(x - 20, y + 1, 0.7, -10, "#5FAE5A") + T.shadow(0, 0, 0.42, 0.16) + T.box(-0.3, -0.24, 0.3, 0.24, 0, 3, STONE);
      const [px, py] = T.p(0, 0, 3);
      out += ln2([px - 6, py], [px - 7, py - 16], "#8A6A3A", 1.6) + [[-20, -24, "#3E8A48"], [8, -24, "#5FAE5A"], [-14, -14, "#5FAE5A"], [2, -12, "#3E8A48"]].map(([dx, dy, c], i) => `<path d="M${f22(px - 7)},${f22(py - 16)} Q${f22(px - 7 + dx * 0.4)},${f22(py - 16 + dy * 0.6)} ${f22(px - 7 + dx * 0.9)},${f22(py - 16 + dy * 0.35 + i % 2 * 2)} Q${f22(px - 7 + dx * 0.5)},${f22(py - 16 + dy * 0.2)} ${f22(px - 7)},${f22(py - 16)} Z" fill="${c}" stroke="#2E6A38" stroke-width="0.4"/>`).join("") + [-2, 10].map((dx, i) => `<path d="M${px + dx},${py} q-6,-10 -12,-12 q6,0 12,6 q0,-12 6,-18 q-2,10 0,18 q6,-8 12,-8 q-6,4 -12,14 Z" fill="${i ? "#3E8A48" : "#5FAE5A"}"/>`).join("") + [[-12, -8], [6, -16], [14, -8]].map(([dx, dy]) => ell2(px + dx, py + dy, 2.2, 2.8, "#F2B23C", ` stroke="#8A5A14" stroke-width="0.4"`)).join("") + [[-2, -6], [12, -14]].map(([dx, dy]) => [0, 72, 144, 216, 288].map((a) => ell2(px + dx + Math.cos(a * Math.PI / 180) * 1.6, py + dy + Math.sin(a * Math.PI / 180) * 1.6, 1.4, 1.4, "#E2463A")).join("") + dot2(px + dx, py + dy, 0.8, "#FFD24E")).join("");
      out += T.box(-0.3, -0.24, 0.3, 0.24, 3, 22, GF, GLASS_EDGE);
      for (let i = 1; i < 4; i++) out += ln2(T.p(-0.3 + i * 0.15, 0.24, 3), T.p(-0.3 + i * 0.15, 0.24, 22), DARK_IRON.left, 0.8);
      for (let i = 1; i < 4; i++) out += ln2(T.p(0.3, -0.24 + i * 0.12, 3), T.p(0.3, -0.24 + i * 0.12, 22), DARK_IRON.left, 0.8);
      out += ln2(T.p(-0.3, 0.24, 13), T.p(0.3, 0.24, 13), DARK_IRON.left, 0.7) + ln2(T.p(0.3, 0.24, 13), T.p(0.3, -0.24, 13), DARK_IRON.left, 0.7) + [[-0.27, -0.18], [0.03, 0.12]].map(([u0, u1]) => ln2(T.p(u0, 0.24, 6), T.p(u1, 0.24, 20), "rgba(255,255,255,.55)", 1.2)).join("") + ln2(T.p(0.3, 0.16, 6), T.p(0.3, 0.04, 19), "rgba(255,255,255,.45)", 1.2);
      out += T.face([[-0.1, 0.241, 3], [0.03, 0.241, 3], [0.03, 0.241, 15], [-0.1, 0.241, 15]], "rgba(200,236,250,.25)", ` stroke="${DARK_IRON.right}" stroke-width="1"`) + dot2(...T.p(0.015, 0.241, 9), 0.7, "#E2B347");
      out += [[-0.24, 0.24, 18], [-0.16, 0.24, 9], [0.18, 0.24, 17], [0.3, -0.08, 10], [0.3, 0.1, 19]].map(([u, v, z]) => dot2(...T.p(u, v, z), 0.55, "rgba(255,255,255,.75)")).join("") + (([gx, gy]) => dot2(gx, gy, 0.8, "rgba(255,255,255,.9)") + ln2([gx, gy - 0.6], [gx, gy - 3], "rgba(255,255,255,.5)", 0.5))(T.p(0.21, 0.24, 20 - k * 12));
      out += T.gable(-0.3, -0.24, 0.3, 0.24, 22, 10, { front: "rgba(210,236,250,.42)", back: "rgba(190,220,240,.4)", gable: "rgba(170,210,235,.34)" }, 0.02, GLASS_EDGE);
      for (let i = 1; i < 6; i++) out += ln2(T.p(-0.32 + i * 0.107, 0, 32), T.p(-0.32 + i * 0.107, 0.26, 22), DARK_IRON.left, 0.6);
      out += ln2(T.p(-0.32, 0, 32), T.p(0.32, 0, 32), DARK_IRON.right, 1.4) + T.face([[-0.2, 0.02, 31.2], [-0.06, 0.02, 31.2], [-0.06, 0.1, 33.6], [-0.2, 0.1, 33.6]], "rgba(220,240,255,.7)", ` stroke="${DARK_IRON.right}" stroke-width="0.7"`);
      const [vx, vy] = T.p(-0.13, 0.06, 33);
      out += [0, 0.5].map((o) => {
        const t = (k + o) % 1;
        return puff(vx + t * 3, vy - 2 - t * 9, 1.8 + t * 2.4, 0.65 * (1 - t));
      }).join("");
      const [ex, ey] = T.p(0.32, 0, 32);
      out += ln2([ex, ey], [ex, ey - 4], DARK_IRON.right, 0.9) + dot2(ex, ey - 4.6, 1.1, "#E2B347");
      const [qx, qy] = T.p(0.16, 0, 32), bob = f % 3 === 1 ? 1 : 0;
      out += ln2([qx - 0.6, qy], [qx - 0.8, qy - 1.6], "#3D3A36", 0.6) + ln2([qx + 0.8, qy], [qx + 0.8, qy - 1.6], "#3D3A36", 0.6) + `<path d="M${f22(qx - 1.6)},${f22(qy - 2)} L${f22(qx - 4.6)},${f22(qy + 3)} L${f22(qx - 2.6)},${f22(qy + 3.4)} L${f22(qx - 0.4)},${f22(qy - 1.4)} Z" fill="#3FA0D8" stroke="${OUT}" stroke-width="0.4"/>` + ell2(qx, qy - 4, 2.6, 3.2, "#E2463A", ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f22(qx - 2.4)},${f22(qy - 4.6)} Q${f22(qx - 3)},${f22(qy - 1.6)} ${f22(qx - 1)},${f22(qy - 1)} Q${f22(qx)},${f22(qy - 3)} ${f22(qx - 2.4)},${f22(qy - 4.6)} Z" fill="#5FBF5A" stroke="${OUT}" stroke-width="0.4"/><circle cx="${f22(qx + 1)}" cy="${f22(qy - 7.4 + bob)}" r="2" fill="#E2463A" stroke="${OUT}" stroke-width="0.5"/>` + ell2(qx + 1.6, qy - 7.4 + bob, 1, 1.2, "#FFF3C4") + `<path d="M${f22(qx + 2.6)},${f22(qy - 8.2 + bob)} q1.8,0.2 1.4,2 q-0.6,-0.8 -1.4,-0.6 Z" fill="#3D3A36"/>` + dot2(qx + 1.7, qy - 7.8 + bob, 0.45, "#2A2024");
      return out + leaf3(x + 22, y + 4, 0.9, 30, "#3E8A48") + leaf3(x + 26, y, 0.7, 60, "#5FAE5A");
    }, "draw")
  }]
};
var fonderie = {
  light: /* @__PURE__ */ __name(() => [-0.1, 0.05, 8, 26, "255,120,50", true], "light"),
  layers: [{
    frame: [-36, -54, 72, 68],
    n: 6,
    fps: 6,
    draw: /* @__PURE__ */ __name((T, f, n) => {
      const k = f / n, flick = Math.sin(k * TAU);
      const ROCK3 = { top: "#6E667A", left: "#4A4555", right: "#312D39" };
      const lava = /* @__PURE__ */ __name((o) => `rgba(255,${f22(118 + 52 * flick)},40,${o})`, "lava");
      const [x, y] = T.p(0, 0, 0);
      let out = ell2(x, y + 1, 31, 12.7, "#6A6070", ` stroke="${OUT}" stroke-width="0.5"`) + ell2(x - 4, y, 21, 8, "#7A7080") + [[-14, 6, 1.2], [20, 5, 1], [-2, 10, 0.9], [26, -1, 0.8]].map(([dx, dy, r]) => ell2(x + dx, y + dy, r * 1.6, r, "#544A5A")).join("");
      for (const d of [`M${x - 26},${y + 3} l6,-2 l4,2 l5,-1`, `M${x + 8},${y + 9} l5,-3 l6,1`, `M${x + 17},${y - 5} l4,2 l6,-1.4`]) {
        out += `<path d="${d}" stroke="${lava(0.25)}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${lava(0.95)}" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      const [ox, oy] = T.p(0.44, -0.2, 0);
      out += ell2(ox + 1, oy + 0.6, 10, 3.4, "rgba(20,15,25,.35)") + [[-6, 0, 5], [5, 0.6, 4.6], [0, -3.6, 5.4], [-2, 1.6, 4]].map(([dx, dy, r]) => poly2([[ox + dx - r, oy + dy], [ox + dx - r * 0.5, oy + dy - r * 1.1], [ox + dx + r * 0.4, oy + dy - r * 1.3], [ox + dx + r, oy + dy - r * 0.3], [ox + dx + r * 0.7, oy + dy + r * 0.3]], "#2A2733", ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + ln2([ox + dx - r * 0.4, oy + dy - r * 0.9], [ox + dx + r * 0.2, oy + dy - r * 1.1], "rgba(190,160,255,.75)", 0.7)).join("") + star(ox + 1, oy - 9, 1.8, "#E4D6FF", f % 3 === 1 ? 1 : 0.25);
      const [cx, cy] = T.p(-0.2, -0.18, 6);
      const cb = 10, ct = 6.4, ch = 25;
      out += poly2([[cx - cb, cy], [cx - ct, cy - ch], [cx + ct, cy - ch], [cx + cb, cy]], ROCK3.left, ` stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"`) + poly2([[cx + 1.6, cy], [cx + 1, cy - ch], [cx + ct, cy - ch], [cx + cb, cy]], ROCK3.right);
      for (let r = 1; r < 5; r++) {
        const yy = cy - r * (ch / 5), w = cb - (cb - ct) * (r / 5);
        out += ln2([cx - w, yy], [cx + w, yy], "rgba(20,16,26,.7)", 0.6);
        const off = r % 2 ? -w * 0.3 : w * 0.25;
        out += ln2([cx + off, yy], [cx + off, yy + ch / 5], "rgba(20,16,26,.6)", 0.5);
      }
      out += ln2([cx - cb + 1.4, cy - 1], [cx - ct + 1, cy - ch + 1], "rgba(255,255,255,.14)", 1.2) + ell2(cx, cy - ch, ct + 1.6, 2.2, ROCK3.top, ` stroke="${OUT}" stroke-width="0.6"`) + ell2(cx, cy - ch, ct - 0.6, 1.2, "#1C1820") + puff(cx + 1 + k * 3, cy - ch - 4 - k * 6, 2.6 + k * 2, 0.75 * (1 - k)) + puff(cx - 2 + (k + 0.5) % 1 * 4, cy - ch - 4 - (k + 0.5) % 1 * 6, 2.2 + (k + 0.5) % 1 * 2, 0.6 * (1 - (k + 0.5) % 1)) + [[3, 0], [-2, 2], [1, 4]].map(([dx, o]) => {
        const t = (f + o) % n / n;
        return dot2(cx + dx + t * 2, cy - ch - 2 - t * 12, 0.7, t < 0.5 ? "#FFD070" : "#FF8A3A");
      }).join("");
      const [bx, by] = T.p(-0.46, 0.14, 0);
      const open = 0.5 + 0.5 * Math.cos(k * TAU);
      const hx = bx + 8, hy = by - 6, top = by - 9 - open * 4;
      out += ell2(bx, by + 0.4, 9, 2.4, "rgba(20,15,25,.3)") + T.box(-0.5, 0.12, -0.42, 0.2, 0, 3, ROCK3) + ln2([hx, hy], [hx + 6, hy + 0.6], DARK_IRON.right, 1.6) + poly2([[hx, hy], [bx - 8, top], [bx - 8, by - 4]], "#8A5A36", ` stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"`) + [0.35, 0.65].map((t) => ln2([hx + (bx - 8 - hx) * t, hy + (top - hy) * t], [hx + (bx - 8 - hx) * t, hy + (by - 4 - hy) * t], "rgba(60,35,20,.55)", 0.6)).join("") + ln2([hx, hy], [bx - 9, top], WOOD.right, 1.8) + ln2([hx, hy], [bx - 9, by - 4], WOOD.right, 1.8) + ln2([bx - 9, top], [bx - 12, top - 1.6], WOOD.right, 1.4);
      const [fx, fy] = T.p(-0.12, -0.04, 0);
      out += T.shadow(-0.12, -0.04, 0.24, 0.25) + `<path d="M${fx - 13},${fy} L${fx - 13},${fy - 7} A13,5.6 0 0 1 ${fx + 13},${fy - 7} L${fx + 13},${fy} A13,5.6 0 0 1 ${fx - 13},${fy} Z" fill="${ROCK3.left}" stroke="${OUT}" stroke-width="0.7"/><path d="M${fx + 4},${fy + 5.3} L${fx + 4},${fy - 1.7} A13,5.6 0 0 0 ${fx + 13},${fy - 7} L${fx + 13},${fy} A13,5.6 0 0 1 ${fx + 4},${fy + 5.3} Z" fill="${ROCK3.right}"/>` + [[-9, -3.4], [-3, -1.6], [3, -2], [9, -3.6], [-6, 1.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${fx + dx - 2.6},${fy + dy} q2.6,-2 5.2,0" stroke="rgba(20,16,26,.7)" stroke-width="0.6" fill="none"/>`).join("") + ell2(fx, fy - 7, 13, 5.6, ROCK3.top, ` stroke="${OUT}" stroke-width="0.7"`) + ell2(fx, fy - 7, 10, 4, "#2A1410") + ell2(fx, fy - 7.2, 8.4, 3.2, lava(1)) + [[-5, 0.6], [-1.4, -1.2], [2.6, 0.8], [5.4, -0.6], [0.4, 1.4]].map(([dx, dy], i) => dot2(fx + dx, fy - 7 + dy, 1.3, i % 2 ? "#3A1A12" : "#FFE08A")).join("") + `<path d="M${fx - 5},${fy - 7} Q${fx - 7},${fy - 15} ${fx - 1},${f22(fy - 21 - flick * 3)} Q${fx + 1},${fy - 15} ${fx + 2},${fy - 9} Q${fx + 4},${fy - 14} ${fx + 4},${f22(fy - 17 + flick * 2)} Q${fx + 8},${fy - 11} ${fx + 5},${fy - 7} Z" fill="#F59A3C" stroke="#C8521E" stroke-width="0.5"/><path d="M${fx - 2.6},${fy - 7} Q${fx - 3.6},${fy - 12} ${fx - 0.6},${f22(fy - 15 - flick * 2)} Q${fx + 1.6},${fy - 11} ${fx + 2.6},${fy - 7} Z" fill="#FFE08A"/>`;
      const [ax, ay] = T.p(0.3, 0.2, 7);
      out += T.shadow(0.3, 0.2, 0.13, 0.22) + T.box(0.22, 0.12, 0.38, 0.28, 0, 7, ROCK3) + `<path d="M${ax - 7},${ay - 2} L${ax + 4},${ay - 2} Q${ax + 11},${ay - 2.4} ${ax + 12},${ay - 5} Q${ax + 7},${ay - 5.6} ${ax + 5},${ay - 6} L${ax - 7},${ay - 6} Z" fill="${DARK_IRON.left}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + poly2([[ax - 4, ay - 2], [ax + 2, ay - 2], [ax + 1, ay + 1], [ax - 3, ay + 1]], DARK_IRON.right, ` stroke="${OUT}" stroke-width="0.5"`) + ln2([ax - 6, ay - 5.6], [ax + 6, ay - 5.6], IRON.top, 0.8) + `<path d="M${ax - 5},${ay - 6.6} Q${ax},${ay - 8.4} ${ax + 6},${ay - 7} Q${ax},${ay - 5.8} ${ax - 5},${ay - 6.6} Z" fill="${lava(1)}" stroke="#8A3412" stroke-width="0.4"/>` + ell2(ax, ay - 7, 6, 2, lava(0.25 + 0.2 * flick));
      const [mx, my] = T.p(0.42, 0.18, 0);
      out += ln2([mx - 1, my], [mx + 4, my - 9], WOOD.right, 1.4) + poly2([[mx + 1.6, my - 9.6], [mx + 6.4, my - 8], [mx + 6, my - 10.6], [mx + 2.4, my - 12]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.5"`);
      out += bucket(T, -0.2, 0.4, 0, 6, 3.6, 4.6, { top: "#B98552", left: WOOD.left, right: WOOD.right }, "seau");
      const [sx, sy] = T.p(-0.2, 0.4, 6);
      out += [0, 0.5].map((o) => {
        const t = (k + o) % 1;
        return puff(sx - 1 + t * 3, sy - 3 - t * 9, 1.6 + t * 1.8, 0.7 * (1 - t));
      }).join("");
      return out + [[0, 0.46, 0], [0.12, 0.48, 1], [-0.42, 0.36, 2]].map(([du, dv, i]) => {
        const [ex, ey] = T.p(du, dv, 0);
        return ell2(ex, ey + 0.4, 2.6, 0.8, "rgba(20,15,25,.3)") + poly2([[ex - 2, ey], [ex + 2, ey], [ex + (i - 1) * 0.8, ey - 6.4]], "#2A2733", ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + ln2([ex - 0.4, ey - 1], [ex + (i - 1) * 0.5, ey - 5], "rgba(190,160,255,.7)", 0.6);
      }).join("");
    }, "draw")
  }]
};
var ANNEX_SPRITES = {
  champ,
  grenier,
  enclos,
  filon,
  depot,
  taille,
  coupe,
  remise,
  pepiniere,
  citerne,
  reservoir,
  eolienne,
  vivier,
  fumoir,
  huitres,
  jardin,
  four,
  belvedere,
  charbon,
  hangar,
  fourneau,
  maison,
  glaciere,
  metier,
  hutte,
  saline,
  serre,
  fonderie
};
function annexLight(id3) {
  const annex = ANNEX_SPRITES[id3];
  return annex && annex.light ? annex.light() : null;
}
__name(annexLight, "annexLight");

// atelier/decor_liste.mjs
var import_crafts = __toESM(require_crafts(), 1);
var import_landmarks = __toESM(require_landmarks(), 1);
var import_deco = __toESM(require_deco(), 1);
var import_decor2 = __toESM(require_decor2(), 1);
var { C } = import_crafts.default;
var { LM, LAND } = import_landmarks.default;
var { PROP } = import_deco.default;
var { up, big, G, S, SIGN_TEXT, SIGN_FRAME, M, silhouette } = import_decor2.default;
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var CRAFTS = {
  cloture: "Clôture",
  massif: "Massif de fleurs",
  muret: "Muret",
  lanterne: "Lanterne",
  banc: "Banc",
  epouvantail: "Épouvantail",
  nichoir: "Nichoir",
  girouette: "Girouette",
  fontaine: "Fontaine",
  brasero: "Brasero",
  pergola: "Pergola",
  statue: "Statue",
  arche: "Arche fleurie",
  etal: "Étal du marché",
  kiosque: "Kiosque",
  cadran: "Cadran solaire",
  bassin: "Bassin",
  longuevue: "Longue-vue",
  igloo: "Igloo (cimes)",
  sculpture: "Sculpture de glace (cimes)",
  parc: "Parc à moutons (landes)",
  cairn: "Cairn aux rubans (landes)",
  passerelle: "Passerelle de roseaux (marais)",
  heron: "Héron de bois (marais)",
  tente: "Tente nomade (dunes)",
  cadransel: "Cadran de sel (dunes)",
  hamac: "Hamac (jungle)",
  totem: "Totem (jungle)",
  obelisque: "Obélisque d'obsidienne (volcan)",
  bassinchaud: "Bassin chaud (volcan)"
};
var LIEUX = {
  grotte: "Grotte de glace",
  lac: "Lac gelé",
  col: "Col du Vent",
  menhirs: "Cercle de menhirs",
  menhirs_fleuri: "Cercle de menhirs (fleuri)",
  arche: "Arche des falaises",
  saule: "Saule millénaire",
  pilotis: "Cabane sur pilotis",
  oasis: "Source de l'oasis",
  pyramide: "Pyramide ensablée",
  arbre: "Arbre-géant",
  cascade: "Grande cascade",
  geyser: "Geyser",
  cratere: "Lac de lave"
};
var GISEMENTS = { glace: "Cristaux de glace", laine: "Moutons à tondre", roseau: "Roseaux", sel: "Croûte de sel", fruits: "Arbre à fruits", obsidienne: "Éclats d'obsidienne" };
var ANNEXES = {
  champ: "Champ",
  grenier: "Grenier",
  enclos: "Enclos",
  filon: "Filon",
  depot: "Dépôt de pierres",
  taille: "Atelier de taille",
  coupe: "Coupe de bois",
  remise: "Remise à bois",
  pepiniere: "Pépinière",
  citerne: "Citerne",
  reservoir: "Réservoir",
  eolienne: "Éolienne",
  vivier: "Vivier",
  fumoir: "Fumoir",
  huitres: "Parc à huîtres",
  jardin: "Jardin d'herbes",
  four: "Four à pain",
  belvedere: "Belvédère",
  charbon: "Charbonnière",
  hangar: "Hangar",
  fourneau: "Haut-fourneau",
  maison: "Maison",
  glaciere: "Glacière (cimes)",
  metier: "Métier à tisser (landes)",
  hutte: "Hutte de roseaux (marais)",
  saline: "Saline (dunes)",
  serre: "Serre tropicale (jungle)",
  fonderie: "Forge d'obsidienne (volcan)"
};
var VARIANTS = {
  champ: ["ble", "carottes", "citrouilles"],
  filon: ["quartz", "cuivre", "cristaux"],
  coupe: ["rondins", "souches", "chevalet"],
  citerne: ["tonneau", "pompe", "cuivre"],
  vivier: ["orange", "argent", "bleu_or"],
  maison: ["toit_rouge", "toit_bleu", "chaume", "ardoise"]
};
var ENSEIGNES = { bois: "Planche de bois", ardoise: "Ardoise", fer: "Fer forgé", laiton: "Plaque de laiton", fleurie: "Fleurie", lanterne: "Lanternes" };
var ILOTS = {
  ponton: "Ponton d'amarrage",
  pont: "Pont de planches",
  barque_volante: "Barque volante du passeur",
  bateau_visiteur: "Bateau des visiteurs",
  voilier: "Voilier du Ponton",
  bouteille: "Bouteille à la mer",
  panneau_quartier: "Panneau de quartier (cadenas)",
  epave_radeau: "Épave : radeau",
  epave_bateau: "Épave : caboteur",
  epave_barque: "Épave : barque de graines"
};
var VLABEL = { ble: "blé", bleu_or: "bleu-or", toit_rouge: "toit rouge", toit_bleu: "toit bleu", rayee: "rayée", bout_avant: "bout avant", bout_arriere: "bout arrière" };
var vl = /* @__PURE__ */ __name((v) => VLABEL[v] || v, "vl");
var VIEW = { voilier: [-62, -70, 96, 92], ponton: [-58, -36, 116, 70] };
function inventaire() {
  const items = [];
  const add = /* @__PURE__ */ __name((it) => items.push({ ms: 380, cell: true, meta: {}, ...it }), "add");
  for (const [id3, c] of Object.entries(C)) add({ cat: "creations", dir: "creations", base: id3, label: CRAFTS[id3], frame: PROP, frames: Array.from({ length: c.n }, (_, f) => c.draw(f)), ms: id3 === "girouette" ? 300 : 420 });
  for (const [id3, l] of Object.entries(LM)) add({ cat: "lieux", dir: "lieux", base: id3, label: LIEUX[id3], frame: LAND, frames: Array.from({ length: l.n }, (_, f) => l.draw(f)), ms: 520, meta: { echelle_jeu: id3 === "cascade" ? 1 : 1.35 } });
  for (const [id3, g] of Object.entries(G)) {
    add({ cat: "gisements", dir: "gisements", base: `${id3}_pret`, label: `${GISEMENTS[id3]} — prêt`, frame: big(g.frames[0]), frames: [0, 1].map((f) => up(g.draw(false, f))), ms: 450 });
    add({ cat: "gisements", dir: "gisements", base: `${id3}_ramasse`, label: `${GISEMENTS[id3]} — ramassé`, frame: big(g.frames[1]), frames: [up(g.draw(true, 0))] });
    for (const [k, t] of [[1, 0.35], [2, 0.7]]) add({ cat: "gisements", dir: "gisements", base: `${id3}_repousse${k}`, label: `${GISEMENTS[id3]} — repousse (${k}/2)`, frame: big(g.frames[0]), frames: [0, 1].map((f) => up(g.draw(false, f, t))), ms: 450 });
  }
  for (const [id3, a] of Object.entries(ANNEX_SPRITES)) {
    const l = a.layers[0];
    const light = annexLight(id3);
    const vs = VARIANTS[id3] || [null];
    vs.forEach((vn, v) => {
      const n = l.n || 1;
      add({
        cat: "annexes",
        dir: `annexes/${id3}`,
        base: vn ? `${id3}_${vn}` : id3,
        label: ANNEXES[id3] + (vn ? ` — ${vl(vn)}` : ""),
        frame: big(l.frame),
        frames: Array.from({ length: n }, (_, f) => up(l.draw(tools(0, 0, `${id3}-${v}`), f, n, v))),
        ms: l.fps ? Math.round(1e3 / l.fps) : 0,
        meta: { variante_jeu: v, ips: l.fps || 0, ...light ? { lumiere: { u: light[0], v: light[1], z: r2(light[2] * 1.25), rayon: r2(light[3] * 1.25), couleur: light[4] || "chaude", vacille: !!light[5] } } : {} }
      });
    });
  }
  for (const [id3, s] of Object.entries(S)) add({ cat: "enseignes", dir: "enseignes", base: id3, label: ENSEIGNES[id3], frame: big(SIGN_FRAME), frames: Array.from({ length: s.n }, (_, f) => up(s.draw(f))), ms: id3 === "fer" ? 200 : id3 === "laiton" ? 900 : 260, cell: false, meta: { cadre_du_nom: SIGN_TEXT[id3] } });
  for (const [id3, m] of Object.entries(M)) {
    for (const v of m.variants || [null]) {
      const frames = Array.from({ length: m.n }, (_, f) => up(m.draw(f, v || void 0)));
      const base = v ? `${id3}_${v}` : id3;
      const cell = /ponton|pont|panneau/.test(id3);
      add({ cat: "ilots", dir: "ilots", base, label: ILOTS[id3] + (v ? ` — ${vl(v)}` : ""), frame: big(m.frame), frames, ms: id3 === "bouteille" ? 700 : 300, cell, view: VIEW[id3] });
      if (id3 === "pont") add({ cat: "ilots", dir: "ilots", base: `${base}_v`, label: `${ILOTS[id3]} — ${vl(v)} (le long de v)`, frame: big(m.frame), frames: frames.map((b) => `<g transform="scale(-1 1)">${b}</g>`), cell });
    }
    if (/^epave/.test(id3)) add({ cat: "ilots", dir: "ilots", base: `${id3}_silhouette`, label: `${ILOTS[id3]} (silhouette du prologue)`, frame: big(m.frame), frames: [silhouette(up(m.draw(0)))], cell: false });
  }
  return items;
}
__name(inventaire, "inventaire");

// atelier/port/src/world/sprites.js
var f23 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var SHELTER_FIRE = [0.5, 0.36];
var CABIN_CHIMNEY = [0.3, -0.27];
function flameFrames(u = 0, v = 0, s = 1, outlined = false) {
  const [x, y] = P(u, v, 4);
  const shapes = [
    [[0, -22], [7, -6], [0, 0], [-7, -6]],
    [[2, -24], [7, -7], [0, 0], [-6, -5]],
    [[-2, -21], [6, -5], [0, 0], [-7, -7]]
  ].map((shape) => shape.map(([dx, dy]) => [dx * s, dy * s]));
  const tongue = /* @__PURE__ */ __name(([tip, r, base, l], k, fill, extra = "") => `<path d="M${f23(x + base[0] * k)},${f23(y + base[1] * k)} C${f23(x + (r[0] + 3 * s) * k)},${f23(y + r[1] * k)} ${f23(x + (tip[0] + 2 * s) * k)},${f23(y + (tip[1] + 8 * s) * k)} ${f23(x + tip[0] * k)},${f23(y + tip[1] * k)} C${f23(x + (tip[0] - 2 * s) * k)},${f23(y + (tip[1] + 8 * s) * k)} ${f23(x + (l[0] - 3 * s) * k)},${f23(y + l[1] * k)} ${f23(x + base[0] * k)},${f23(y + base[1] * k)} Z" fill="${fill}"${extra}/>`, "tongue");
  if (outlined) {
    const sparks2 = [[[5, -27], [-6, -18]], [[-4, -30], [7, -21]], [[3, -32], [-7, -25]]];
    return shapes.map((sh, i) => sprite(
      tongue(sh, 1, "#EE6A3A", ' stroke="#3C2819" stroke-width="0.8" stroke-linejoin="round"') + tongue(sh, 0.78, "#F7A23B") + tongue(sh, 0.5, "#FFE07A") + sparks2[i].map(([dx, dy], j) => `<circle cx="${f23(x + dx * s)}" cy="${f23(y + dy * s)}" r="${f23((j ? 0.8 : 1.1) * s)}" fill="#FFD27A"/>`).join(""),
      { x: x - 20, y: y - 36, w: 40, h: 44 }
    ));
  }
  return shapes.map(([tip, r, base, l]) => sprite(
    `<path d="M${x + base[0]},${y + base[1]} C${x + r[0] + 3 * s},${y + r[1]} ${x + tip[0] + 2 * s},${y + tip[1] + 8 * s} ${x + tip[0]},${y + tip[1]} C${x + tip[0] - 2 * s},${y + tip[1] + 8 * s} ${x + l[0] - 3 * s},${y + l[1]} ${x + base[0]},${y + base[1]} Z" fill="#F7A23B"/><path d="M${x},${y} C${x + 4 * s},${y - 4 * s} ${x + tip[0] * 0.5 + 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x + tip[0] * 0.5},${y + tip[1] * 0.55} C${x + tip[0] * 0.5 - 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x - 4 * s},${y - 4 * s} ${x},${y} Z" fill="#FFE07A"/>`,
    { x: x - 20, y: y - 36, w: 40, h: 44 }
  ));
}
__name(flameFrames, "flameFrames");
var LIGHTS = {
  foyer: [[[0, 0, 10, 54]], [[SHELTER_FIRE[0], SHELTER_FIRE[1], 8, 40]], [[0.55, -0.07, 14, 22]]],
  atelier: [[[0.85, -0.05, 6, 30]]]
};
var SMOKE = {
  foyer: [[0, 0, 24], [SHELTER_FIRE[0], SHELTER_FIRE[1], 18], [CABIN_CHIMNEY[0], CABIN_CHIMNEY[1], 62]],
  atelier: [[0.55, -0.05, 44]]
};

// atelier/camp.mjs
var import_torche = __toESM(require_torche(), 1);
var { torche } = import_torche.default;
var K_CAMP = 1.25;
var OUT2 = "#3C2819";
var f24 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var pts2 = /* @__PURE__ */ __name((list) => list.map(([x, y]) => `${f24(x)},${f24(y)}`).join(" "), "pts");
var ln3 = /* @__PURE__ */ __name((a, b, color, w = 1) => `<line x1="${f24(a[0])}" y1="${f24(a[1])}" x2="${f24(b[0])}" y2="${f24(b[1])}" stroke="${color}" stroke-width="${f24(w)}" stroke-linecap="round"/>`, "ln");
var tk = /* @__PURE__ */ __name((a, b, color, w) => ln3(a, b, OUT2, w + 1.44) + ln3(a, b, color, w), "tk");
var pathTk = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${OUT2}" stroke-width="${f24(w + 1.44)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${f24(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "pathTk");
var ell3 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f24(x)}" cy="${f24(y)}" rx="${f24(rx)}" ry="${f24(ry)}" fill="${fill}"${extra}/>`, "ell");
var iso = /* @__PURE__ */ __name((list) => list.map((p) => P(...p)), "iso");
var uid = 0;
var id = /* @__PURE__ */ __name((p) => `${p}${uid++}`, "id");
var DRIFT = { top: "#DCCBAA", left: "#C2AF8C", right: "#9E8C6C" };
var CRATE = { top: "#D2A574", left: "#B8875A", right: "#94683F" };
var CANVAS = { light: "#EDE4CD", mid: "#D9CDB0", dark: "#B9AA88", seam: "#B3A27C" };
var SAND = { light: "#F1E3B8", mid: "#E2CF9A", dark: "#C9B47E" };
var ROPE = "#C9A66B";
var IRON2 = { top: "#6E7178", left: "#55585F", right: "#3F4248" };
function crate(u, v, s, h, z0 = 0, c = CRATE) {
  const u0 = u - s, u1 = u + s, v0 = v - s, v1 = v + s;
  return box(u0, v0, u1, v1, z0, z0 + h, c) + planksLeft(u0, u1, v1, z0, z0 + h, h / 3) + planksRight(u1, v0, v1, z0, z0 + h, h / 3) + ln3(P(u0 + 0.02, v1, z0 + 1), P(u1 - 0.02, v1, z0 + h - 1), "rgba(70,40,20,.45)", 0.9) + ln3(P(u1, v1 - 0.02, z0 + 1), P(u1, v0 + 0.02, z0 + h - 1), "rgba(40,20,10,.4)", 0.9);
}
__name(crate, "crate");
function plank(a, b, w, t = 2, c = DRIFT, z0 = 0) {
  const du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv) || 1, nu = -dv / l * w / 2, nv = du / l * w / 2;
  const q = [[a[0] + nu, a[1] + nv], [b[0] + nu, b[1] + nv], [b[0] - nu, b[1] - nv], [a[0] - nu, a[1] - nv]];
  const front = nu + nv > 0 ? [q[0], q[1]] : [q[3], q[2]];
  return face([[front[0][0], front[0][1], z0], [front[1][0], front[1][1], z0], [front[1][0], front[1][1], z0 + t], [front[0][0], front[0][1], z0 + t]], c.left, EDGE) + face(q.map(([x, y]) => [x, y, z0 + t]), c.top, EDGE);
}
__name(plank, "plank");
var stick = /* @__PURE__ */ __name((u, v, z0, u2, v2, z1, w = 2, color = DRIFT.left) => tk(P(u, v, z0), P(u2, v2, z1), color, w), "stick");
var rope = /* @__PURE__ */ __name((a, b, sag = 3, w = 0.8, color = ROPE) => pathTk(`M${f24(a[0])},${f24(a[1])} Q${f24((a[0] + b[0]) / 2)},${f24((a[1] + b[1]) / 2 + sag)} ${f24(b[0])},${f24(b[1])}`, color, w), "rope");
var stone2 = /* @__PURE__ */ __name((u, v, s, c = STONE) => {
  const [x, y] = P(u, v, 0);
  return ell3(x + s * 0.1, y + s * 0.15, s + 0.4, s * 0.66 + 0.4, OUT2) + pebble(u, v, s, c);
}, "stone");
var dune = /* @__PURE__ */ __name((u, v, ru, rv, h) => {
  const [x, y] = P(u, v, 0);
  const rx = (ru + rv) * 22, ry = (ru + rv) * 11;
  return ell3(x, y, rx, ry, SAND.mid) + ell3(x - rx * 0.15, y - h * 0.3 - ry * 0.12, rx * 0.72, ry * 0.62, SAND.light);
}, "dune");
var KELP = { lame: "#86913F", ombre: "#66702E", nerf: "#B4BE6A", flot: "#B79D4C" };
function ruban(a, c, b, w, vagues, fond = KELP.lame) {
  const at = /* @__PURE__ */ __name((t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]], "at");
  const N2 = 18, g = [], d = [];
  for (let i = 0; i <= N2; i++) {
    const t = i / N2, p = at(t), q = at(Math.min(1, t + 0.02)), r = at(Math.max(0, t - 0.02));
    const tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1, nx = -ty / l, ny = tx / l;
    const e = w * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1))) * (t > 0.97 ? 0.4 : 1) * (1 + 0.2 * Math.sin(t * Math.PI * vagues));
    g.push([p[0] + nx * e, (p[1] + ny * e) * 0.6]);
    d.push([p[0] - nx * e * 0.85, (p[1] - ny * e * 0.85) * 0.6]);
  }
  const contour = "M" + [...g, ...d.reverse()].map(([x, y]) => `${f24(x)},${f24(y)}`).join(" L") + " Z";
  const nerf = "M" + Array.from({ length: 9 }, (_, i) => at(0.05 + i * 0.1)).map(([x, y]) => `${f24(x)},${f24(y * 0.6)}`).join(" L");
  return `<path d="${contour}" fill="${fond}" stroke="${OUT2}" stroke-width="0.5" stroke-linejoin="round"/><path d="${nerf}" fill="none" stroke="${KELP.nerf}" stroke-width="0.45" stroke-linecap="round" stroke-linejoin="round"/>`;
}
__name(ruban, "ruban");
var kelp = /* @__PURE__ */ __name((u, v, rot = 0) => {
  const [x, y] = P(u, v, 0);
  const flot = /* @__PURE__ */ __name((fx, fy) => ell3(fx, fy, 0.85, 0.55, KELP.flot, ` stroke="${OUT2}" stroke-width="0.45"`) + ell3(fx - 0.3, fy - 0.2, 0.35, 0.2, "rgba(255,245,200,.7)"), "flot");
  return `<g transform="translate(${f24(x)} ${f24(y)}) rotate(${rot})">${ell3(0.4, 0.8, 8, 2, "rgba(70,60,30,.16)")}` + ruban([-7.5, 2], [-1, -5], [7.5, -1], 3, 6, KELP.ombre) + ruban([-6, -3.5], [0, 4.5], [7, 3.4], 2.5, 5) + flot(-3.6, -0.4) + flot(1.4, -1.6) + flot(3.8, 1.6) + `</g>`;
}, "kelp");
function driftFire(u = 0, v = 0, s = 1, n = 0) {
  let o = shadow(u, v, 0.4 * s, 0.18) + disc(u, v, 0, 0.2 * s, "#4A3020") + disc(u, v, 0.4, 0.13 * s, "#C9622E");
  const [cx, cy] = P(u, v, 0.6);
  o += [[-2.6, -0.6], [1.8, 0.4], [0.2, 1.4], [-0.6, -1.4]].map(([dx, dy]) => ell3(cx + dx * s, cy + dy * s, 0.8 * s, 0.5 * s, "#FFB347")).join("");
  const logs = [[[-0.34, 0.06], [0.02, -0.01]], [[0.26, -0.26], [0.01, 0]], [[0.06, 0.34], [0, 0.01]], [[-0.18, -0.3], [0, 0]]];
  for (const [a, b] of logs) {
    const A = P(u + a[0] * s, v + a[1] * s, 1), B = P(u + b[0] * s, v + b[1] * s, 7.5 * s);
    o += tk(A, B, DRIFT.left, 2.6 * s) + ln3([A[0] + (B[0] - A[0]) * 0.62, A[1] + (B[1] - A[1]) * 0.62], B, "#3A2A20", 2.4 * s);
  }
  o += plank([u - 0.42 * s, v + 0.24 * s], [u - 0.14 * s, v + 0.36 * s], 0.09 * s, 1.8, DRIFT) + stone2(u + 0.34 * s, v + 0.18 * s, 2.6 * s);
  const flame = flameFrames(u, v, 0.8 * s)[n % 3].svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  return o + flame;
}
__name(driftFire, "driftFire");
var HULL = { white: "#ECE8DE", white2: "#E4DFD3", dark: "#BDB7AA", red: "#B8483A", redD: "#8E352B", navy: "#2E4E8C", glass: "#5E7A9E", deck: "#C49C6E", cabin: "#F4F0E6", cabinS: "#D6D0C2", roof: "#DCD6C8", funnel: "#F2C04B", funnelS: "#D4A23A", band: "#3E5A8C" };
var SWALLOW = "M-3.2,-0.6 Q-1.6,-1.8 0,-0.2 Q1.6,-1.8 3.2,-0.6 Q1.4,-0.4 0.6,0.6 L1.4,2.4 L0,1.4 L-1.4,2.4 L-0.6,0.6 Q-1.4,-0.4 -3.2,-0.6 Z";
var lifebuoy = /* @__PURE__ */ __name((x, y, r, flat = 0.5) => ell3(x, y, r + 1.3, r * flat + 1.3, OUT2) + `<ellipse cx="${f24(x)}" cy="${f24(y)}" rx="${f24(r)}" ry="${f24(r * flat)}" fill="none" stroke="${HULL.cabin}" stroke-width="${f24(r * 0.5)}"/><ellipse cx="${f24(x)}" cy="${f24(y)}" rx="${f24(r)}" ry="${f24(r * flat)}" fill="none" stroke="#D8483A" stroke-width="${f24(r * 0.5)}" stroke-dasharray="${f24(r * 0.79)} ${f24(r * 0.79)}"/>` + ell3(x, y, r * 0.72, r * flat * 0.72, "none", ` stroke="${OUT2}" stroke-width="0.6"`), "lifebuoy");
function hirondelle() {
  const Z = /* @__PURE__ */ __name((u) => 20 + (u + 1.25) * 2.4, "Z");
  const D = /* @__PURE__ */ __name((u, v) => Z(u) - v * 10, "D");
  const side = [[-1.25, 0.44], [-0.9, 0.48], [-0.2, 0.5], [0.5, 0.47], [1, 0.34], [1.35, 0.16], [1.58, 0]];
  const far = side.slice(0, -1).reverse().map(([u, v]) => [u, -v]);
  const hullAt = /* @__PURE__ */ __name((u) => {
    for (let i = 0; i < side.length - 1; i++) {
      const [ua, va] = side[i], [ub, vb] = side[i + 1];
      if (u >= ua && u <= ub) return va + (vb - va) * (u - ua) / (ub - ua);
    }
    return 0;
  }, "hullAt");
  const onSide = /* @__PURE__ */ __name((u, z) => {
    const v = hullAt(u), d = D(u, v);
    return [u, v * (0.84 + 0.16 * Math.min(1, z / d)), z];
  }, "onSide");
  const band = /* @__PURE__ */ __name((ua, ub, z0, z1, fill) => face([onSide(ua, z0), onSide(ub, z0), onSide(ub, Math.min(z1, D(ub, hullAt(ub)))), onSide(ua, Math.min(z1, D(ua, hullAt(ua))))], fill), "band");
  let o = shadow(0.15, 0.15, 1.45, 0.2);
  o += dune(-0.3, -0.72, 0.85, 0.3, 4) + dune(0.9, -0.5, 0.5, 0.25, 3);
  for (let i = 0; i < side.length - 1; i++) {
    const [ua, va] = side[i], [ub, vb] = side[i + 1];
    o += face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb, D(ub, vb)], [ua, va, D(ua, va)]], i % 2 ? HULL.white2 : HULL.white, EDGE);
    o += band(ua, ub, 0, 6.5, HULL.red) + band(ua, ub, D(ua, va) - 4.2, D(ua, va) - 2.6, HULL.navy);
  }
  for (const [ua, va, ub, vb] of [[1, -0.34, 1.35, -0.16], [1.35, -0.16, 1.58, 0]]) {
    o += face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb, D(ub, vb)], [ua, va, D(ua, va)]], HULL.dark, EDGE) + face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb * 0.86, 6.5], [ua, va * 0.86, 6.5]], HULL.redD);
  }
  o += `<polyline points="${pts2([P(1, -0.34 * 0.84, 6.5), P(1.35, -0.16 * 0.86, 6.5), P(1.58, 0, 6.5)])}" fill="none" stroke="rgba(40,25,10,.45)" stroke-width="0.7"/>`;
  o += `<polyline points="${pts2(side.map(([u]) => P(...onSide(u, 6.5))))}" fill="none" stroke="rgba(40,25,10,.45)" stroke-width="0.7"/>`;
  o += `<polygon points="${pts2([[-1.25, 0], [-1.25, 4], [-1.16, 6], [-1.22, 10.5], [-1.12, 13], [-1.2, 17], [-1.13, 19.6], [-1.25, 23]].map(([u, z]) => P(...onSide(u, Math.min(z, D(u, hullAt(u)))))))}" fill="#2E2218"${EDGE}/>`;
  o += ln3(P(...onSide(-1.2, 8.6)), P(...onSide(-1.25, 8.6)), "#6E6A62", 1) + ln3(P(...onSide(-1.17, 15.4)), P(...onSide(-1.25, 15.4)), "#6E6A62", 1);
  for (const u of [-0.98, -0.74, -0.5, 0.06, 0.3, 0.54, 0.78]) {
    const [x, y] = P(...onSide(u, D(u, hullAt(u)) - 9.4));
    o += ln3([x + 0.4, y + 2.6], [x + 0.9, y + 7.4], "rgba(160,90,40,.35)", 1.1) + ell3(x, y, 2.3, 2.5, "#C9A24A", ` stroke="${OUT2}" stroke-width="0.6"`) + ell3(x, y, 1.5, 1.7, HULL.glass) + ell3(x - 0.5, y - 0.6, 0.5, 0.5, "#FFFFFF", ' opacity=".8"');
  }
  const gash = [[-0.38, 7.5], [-0.16, 5.6], [0, 10], [-0.08, 14.6], [-0.22, 12.4], [-0.34, 15.2]];
  o += `<polygon points="${pts2(gash.map(([u, z]) => P(...onSide(u, z))))}" fill="#2E2218"${EDGE}/>`;
  o += ln3(P(...onSide(-0.3, 11.6)), P(...onSide(-0.12, 11.2)), "#6E6A62", 1.2);
  for (const [u, z, dx, dy] of [[-0.16, 5.8, 2, 1.6], [0, 10, 2.2, -0.6], [-0.34, 15, -1.6, -1.8]]) {
    const [x, y] = P(...onSide(u, z));
    o += `<path d="M${f24(x)},${f24(y)} l${dx},${dy} l${f24(-dx * 0.4)},${f24(dy * 0.9 + 1)} Z" fill="${HULL.white2}"${EDGE}/>`;
  }
  {
    const [x, y] = P(...onSide(1.02, 15));
    o += `<g transform="translate(${f24(x)} ${f24(y)}) matrix(1.5 -0.55 0 1.5 0 0)"><path d="${SWALLOW}" fill="${HULL.navy}"/></g>`;
  }
  {
    const [x, y] = P(...onSide(1.3, 19.6));
    o += ell3(x, y, 1.9, 1.5, "#2E2218", EDGE) + tk([x, y + 1.2], [x + 0.6, y + 9], IRON2.left, 1.4) + pathTk(`M${f24(x - 2.6)},${f24(y + 8)} Q${f24(x + 0.6)},${f24(y + 11.6)} ${f24(x + 3.8)},${f24(y + 8)}`, IRON2.top, 1.2) + tk([x - 1.4, y + 3], [x + 2.6, y + 3], IRON2.left, 1);
  }
  const us = Array.from({ length: 15 }, (_, i) => -1.2 + i * (2.7 / 14));
  const tOf = /* @__PURE__ */ __name((u) => Math.sin((u + 1.2) / 2.7 * Math.PI), "tOf");
  const inner = us.map((u) => P(u, hullAt(u) * 0.96, 0.5 + 4.5 * Math.sqrt(tOf(u))));
  const outer = us.slice().reverse().map((u, i) => P(u + 0.03, hullAt(u) + tOf(u) * (0.22 + 0.06 * Math.sin(i * 1.9)) + 0.01, 0));
  o += `<polygon points="${pts2([...inner, ...outer])}" fill="${SAND.light}" stroke="${OUT2}" stroke-width="0.6" stroke-linejoin="round"/><polyline points="${pts2(us.slice(2, -2).map((u, i) => P(u + 0.04, hullAt(u) + 0.1 + 0.03 * Math.sin(i * 2.3), 1.6)))}" fill="none" stroke="${SAND.dark}" stroke-width="0.9" opacity="0.6"/>`;
  o += pathTk(`M${pts2([P(...onSide(0.42, 9))])} Q${pts2([P(...onSide(0.5, 5))])} ${pts2([P(...onSide(0.46, 1.4))])}`, "#5C8A45", 1);
  const stern = [[-1.25, -0.3], [-1.16, -0.18], [-1.27, -0.06], [-1.14, 0.08], [-1.24, 0.2], [-1.15, 0.32]];
  const deck = [...side.slice(1), ...far.slice(0, -1), [-0.9, -0.48], ...stern, [-1.25, 0.44]].map(([u, v]) => P(u, v, D(u, v)));
  o += `<polygon points="${pts2(deck)}" fill="${HULL.deck}"${EDGE}/>`;
  for (const k of [-0.32, -0.16, 0, 0.16, 0.32]) {
    const ue = 1.12 - Math.abs(k) * 1.2;
    o += ln3(P(-1.12, k, D(-1.12, k)), P(ue, k, D(ue, k)), "rgba(90,60,30,.35)", 0.7);
  }
  const hole = [[-1.12, -0.22], [-0.96, -0.3], [-0.9, -0.1], [-0.98, 0.1], [-1.1, 0.06]];
  o += `<polygon points="${pts2(hole.map(([u, v]) => P(u, v, D(u, v))))}" fill="#2E2218"${EDGE}/>`;
  for (const [u, v, du] of [[-0.96, -0.22, 0.08], [-0.94, 0.02, 0.09]]) o += ln3(P(u, v, D(u, v)), P(u - du, v, D(u, v) + 1.4), "#B08A5A", 2) + ln3(P(u, v, D(u, v)), P(u - du, v, D(u, v) + 1.4), OUT2, 0.5);
  const rail2 = /* @__PURE__ */ __name((list, broken = []) => {
    let r = "";
    const ok = /* @__PURE__ */ __name((u) => !broken.some(([a, b]) => u > a && u < b), "ok");
    for (const [u, v] of list) if (ok(u)) r += tk(P(u, v, D(u, v)), P(u, v, D(u, v) + 5.2), HULL.cabin, 0.8);
    let run = [];
    const flush = /* @__PURE__ */ __name(() => {
      if (run.length > 1) r += pathTk("M" + pts2(run.map(([u, v]) => P(u, v, D(u, v) + 5.2))).split(" ").join(" L"), HULL.cabin, 1);
      run = [];
    }, "flush");
    for (const p of list) {
      if (ok(p[0])) run.push(p);
      else flush();
    }
    flush();
    return r;
  }, "rail");
  const along = /* @__PURE__ */ __name((pts0, n) => Array.from({ length: n + 1 }, (_, i) => {
    const u = pts0[0] + (pts0[1] - pts0[0]) * i / n;
    return u;
  }), "along");
  o += rail2(along([-1, 1.3], 13).map((u) => [u, -hullAt(u) * 0.94]));
  const cu0 = -0.78, cu1 = -0.08, cv0 = -0.26, cv1 = 0.2, H = 13;
  o += face([[cu0, cv1, D(cu0, cv1)], [cu1, cv1, D(cu1, cv1)], [cu1, cv1, D(cu1, cv1) + H], [cu0, cv1, D(cu0, cv1) + H]], HULL.cabin, EDGE);
  o += face([[cu1, cv0, D(cu1, cv0)], [cu1, cv1, D(cu1, cv1)], [cu1, cv1, D(cu1, cv1) + H], [cu1, cv0, D(cu1, cv0) + H]], HULL.cabinS, EDGE);
  o += face([[cu0 - 0.03, cv0 - 0.03, D(cu0, cv0) + H], [cu1 + 0.04, cv0 - 0.03, D(cu1, cv0) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H], [cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H]], HULL.roof, EDGE) + face([[cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H - 1.6], [cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H - 1.6]], HULL.navy, EDGE);
  for (const [i, u] of [-0.72, -0.6, -0.48].entries()) {
    const q = [[u, cv1, D(u, cv1) + 5], [u + 0.08, cv1, D(u + 0.08, cv1) + 5], [u + 0.08, cv1, D(u + 0.08, cv1) + 10], [u, cv1, D(u, cv1) + 10]];
    o += face(q, i === 1 ? "#3E4E66" : HULL.glass, EDGE);
    if (i === 1) o += `<polyline points="${pts2([P(u + 0.02, cv1, D(u, cv1) + 9.4), P(u + 0.05, cv1, D(u, cv1) + 7.2), P(u + 0.03, cv1, D(u, cv1) + 5.6)])}" fill="none" stroke="#DCE6F0" stroke-width="0.6"/>`;
    else o += ln3(P(u + 0.015, cv1, D(u, cv1) + 9.2), P(u + 0.045, cv1, D(u, cv1) + 6.4), "rgba(255,255,255,.55)", 0.7);
  }
  o += face([[-0.18, cv1, D(-0.18, cv1)], [-0.12, cv1, D(-0.12, cv1)], [-0.12, cv1, D(-0.12, cv1) + 10.4], [-0.18, cv1, D(-0.18, cv1) + 10.4]], HULL.navy, EDGE);
  for (const v of [-0.18, -0.04, 0.1]) o += face([[cu1, v, D(cu1, v) + 5.6], [cu1, v + 0.08, D(cu1, v + 0.08) + 5.6], [cu1, v + 0.08, D(cu1, v + 0.08) + 10.4], [cu1, v, D(cu1, v) + 10.4]], "#4E6A8E", EDGE);
  {
    const fu = -0.5, fv = -0.04, z0 = D(fu, fv) + H, h = 15, r = 6.2;
    const [bx, by] = P(fu, fv, z0), [tx, ty] = P(fu, fv + 0.09, z0 + h);
    const at = /* @__PURE__ */ __name((k) => [bx + (tx - bx) * k, by + (ty - by) * k], "at");
    const body = /* @__PURE__ */ __name((k0, k1, fill) => {
      const [ax, ay] = at(k0), [cx, cy] = at(k1);
      return `<path d="M${f24(ax - r)},${f24(ay)} L${f24(cx - r)},${f24(cy)} A${r},${f24(r * 0.5)} 0 0 0 ${f24(cx + r)},${f24(cy)} L${f24(ax + r)},${f24(ay)} A${r},${f24(r * 0.5)} 0 0 1 ${f24(ax - r)},${f24(ay)} Z" fill="${fill}"/>`;
    }, "body");
    o += body(0, 1, HULL.funnel) + body(0.5, 0.72, HULL.band) + body(0.88, 1, "#2E2E36");
    const [sx, sy] = at(0.61);
    o += `<g transform="translate(${f24(sx - 1)} ${f24(sy + 1)}) scale(0.62)"><path d="${SWALLOW}" fill="#F4EEDF"/></g>`;
    o += `<path d="M${f24(bx + r * 0.25)},${f24(by + r * 0.48)} L${f24(tx + r * 0.25)},${f24(ty + r * 0.48)} L${f24(tx + r)},${f24(ty)} L${f24(bx + r)},${f24(by)} Z" fill="rgba(60,30,10,.16)"/>`;
    o += `<path d="M${f24(bx - r)},${f24(by)} L${f24(tx - r)},${f24(ty)} M${f24(bx + r)},${f24(by)} L${f24(tx + r)},${f24(ty)} M${f24(bx - r)},${f24(by)} A${r},${f24(r * 0.5)} 0 0 0 ${f24(bx + r)},${f24(by)}" fill="none" stroke="${OUT2}" stroke-width="0.8"/>`;
    o += ell3(tx, ty, r, r * 0.5, "#4A3A30", EDGE) + ell3(tx, ty + 0.4, r * 0.7, r * 0.32, "#1E1814");
  }
  {
    const [x, y] = P(-0.29, cv1 + 0.01, D(-0.29, cv1) + 7.4);
    o += `<g transform="translate(${f24(x)} ${f24(y)}) rotate(-12)">${lifebuoy(0, 0, 3.4, 0.95)}</g>`;
  }
  const [m0x, m0y] = P(1.04, 0, D(1.04, 0)), [m1x, m1y] = P(1.04, 0.07, D(1.04, 0) + 26);
  o += tk([m0x, m0y], [m1x, m1y], HULL.cabin, 1.6) + tk([m1x - 4, m1y + 5], [m1x + 4, m1y + 5.6], HULL.cabin, 1) + ell3(m1x, m1y - 1.2, 1.8, 2, "#FFD15A", EDGE);
  const [fx, fy] = (() => {
    const [x, y] = P(-0.5, 0.05, D(-0.5, -0.04) + H + 12.6);
    return [x + 5.4, y + 1];
  })();
  const garland2 = /* @__PURE__ */ __name((a, b, sag, n) => {
    let g = `<path d="M${f24(a[0])},${f24(a[1])} Q${f24((a[0] + b[0]) / 2)},${f24((a[1] + b[1]) / 2 + sag * 2)} ${f24(b[0])},${f24(b[1])}" fill="none" stroke="#3A3A40" stroke-width="0.7"/>`;
    const cols = ["#F2584A", "#FFD15A", "#5EA8E8", "#7EC45B"];
    for (let i = 1; i < n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * (a[0] + b[0]) / 2 + t * t * b[0], y = (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * ((a[1] + b[1]) / 2 + sag * 2) + t * t * b[1];
      g += ell3(x, y + 1, 1.1, 1.4, i % 5 === 3 ? "#5A5450" : cols[i % 4], ` stroke="${OUT2}" stroke-width="0.4"`);
    }
    return g;
  }, "garland");
  o += garland2([m1x, m1y + 4], [fx, fy], 8, 9) + garland2([m1x, m1y + 5], P(1.3, 0.16, D(1.3, 0.16) + 5), 4, 4);
  o += rail2(along([-1, 1.32], 13).map((u) => [u, hullAt(u)]), [[0.05, 0.5]]);
  {
    const a = P(0.04, hullAt(0.04), D(0.04, hullAt(0.04)) + 5.2), b = P(...onSide(0.1, D(0.1, hullAt(0.1)) - 5));
    o += pathTk(`M${pts2([a])} Q${f24(a[0] + 3.2)},${f24(a[1] + 1)} ${pts2([b])}`, HULL.cabin, 1);
  }
  o += kelp(-0.35, 1.25, 8) + kelp(1.05, 0.72, -14);
  {
    const [x, y] = P(0.62, 1.08, 0.6);
    o += lifebuoy(x, y, 4.6, 0.5);
  }
  {
    const c = [[-0.72, 0.98], [-0.42, 0.86], [-0.34, 1.06], [-0.64, 1.18]];
    o += face(c.map(([u, v]) => [u, v, 1.2]), "#F4F0E6", EDGE);
    for (const k of [0.2, 0.47, 0.74]) {
      const a = [c[0][0] + (c[1][0] - c[0][0]) * k, c[0][1] + (c[1][1] - c[0][1]) * k], b = [c[3][0] + (c[2][0] - c[3][0]) * k, c[3][1] + (c[2][1] - c[3][1]) * k], d = 0.05;
      o += face([[a[0], a[1], 1.2], [a[0] + d * 0.9, a[1] - d * 0.4, 1.2], [b[0] + d * 0.9, b[1] - d * 0.4, 1.2], [b[0], b[1], 1.2]], "#D8483A");
    }
    o += stick(-0.7, 1.02, 1.2, -0.66, 1, 7.6, 1.4, WOOD.left) + stick(-0.4, 0.9, 1.2, -0.44, 0.92, 7.2, 1.4, WOOD.left) + tk(P(-0.66, 1, 7.6), P(-0.44, 0.92, 7.2), WOOD.top, 1.2);
  }
  {
    const vu = 1.14, vv = 0.98;
    o += shadow(vu, vv, 0.16, 0.16) + box(vu - 0.1, vv - 0.07, vu + 0.1, vv + 0.07, 0, 7, { top: "#B0743E", left: "#96602F", right: "#7A4C24" });
    o += face([[vu - 0.02, vv + 0.07, 0], [vu + 0.02, vv + 0.07, 0], [vu + 0.02, vv + 0.07, 7], [vu - 0.02, vv + 0.07, 7]], "#5A3A1C") + face([[vu - 0.02, vv - 0.07, 7], [vu + 0.02, vv - 0.07, 7], [vu + 0.02, vv + 0.07, 7], [vu - 0.02, vv + 0.07, 7]], "#5A3A1C");
    const [x1, y1] = P(vu - 0.06, vv + 0.07, 3.6), [x2, y2] = P(vu + 0.06, vv + 0.07, 4.4);
    o += ell3(x1, y1, 1.6, 1.4, "#F2C04B", EDGE) + ell3(x2, y2, 1.4, 1.2, "#5EA8E8", EDGE);
    const [hx, hy] = P(vu, vv, 7);
    o += pathTk(`M${f24(hx - 2.4)},${f24(hy)} Q${f24(hx)},${f24(hy - 3)} ${f24(hx + 2.4)},${f24(hy)}`, "#5A3A1C", 0.8);
  }
  o += crate(-1, 0.98, 0.12, 8);
  id("hirt");
  return o;
}
__name(hirondelle, "hirondelle");
var GRAINS = Array.from({ length: 22 }, (_, i) => {
  const a = i * 2.39996, r = 0.34 + 0.52 * (i * 7 % 11 / 10);
  return [0.02 + Math.cos(a) * r, 0.05 + Math.sin(a) * r, i];
});
function tuft(u, v, k = 1) {
  const [x, y] = P(u, v, 0);
  const brin = /* @__PURE__ */ __name((dx, h, c) => `<path d="M${f24(x + dx)},${f24(y)} Q${f24(x + dx * 1.6)},${f24(y - h * 0.6)} ${f24(x + dx * 2.4)},${f24(y - h)}" fill="none" stroke="${c}" stroke-width="${f24(1.1 * k)}" stroke-linecap="round"/>`, "brin");
  return ell3(x, y + 0.3, 3 * k, 1.1 * k, "rgba(60,80,30,.25)") + brin(-1.2 * k, 4.4 * k, LEAVES.dark) + brin(1.1 * k, 4 * k, LEAVES.dark) + brin(0, 5.4 * k, LEAVES.mid) + brin(-0.5 * k, 3.4 * k, LEAVES.mid);
}
__name(tuft, "tuft");
function ground(kind = "sable") {
  let o = shadow(0, 0.05, 1.02, 0.16) + disc(0.02, 0.05, 0, 0.92, kind === "sable" ? "rgba(232,212,160,.55)" : "rgba(150,120,80,.22)");
  if (kind === "sable") {
    o += disc(-0.06, -0.02, 0, 0.62, "rgba(246,234,200,.35)");
    for (const [u, v, i] of GRAINS) {
      const [x, y] = P(u, v, 0);
      o += ell3(x, y, i % 3 ? 0.55 : 0.8, i % 3 ? 0.3 : 0.42, i % 2 ? "rgba(170,140,90,.55)" : "rgba(255,250,235,.7)");
    }
    for (const [u, v] of [[-0.62, 0.38], [0.5, 0.58]]) {
      const [x, y] = P(u, v, 0);
      o += `<path d="M${f24(x - 6)},${f24(y)} Q${f24(x - 3)},${f24(y - 1.2)} ${f24(x)},${f24(y)} T${f24(x + 6)},${f24(y)}" fill="none" stroke="rgba(190,160,105,.55)" stroke-width="0.6" stroke-linecap="round"/>`;
    }
    return o;
  }
  o += disc(-0.06, -0.02, 0, 0.66, "rgba(196,164,112,.22)");
  for (const [u, v, i] of GRAINS) {
    const [x, y] = P(u, v, 0);
    o += ell3(x, y, i % 3 ? 0.7 : 1.1, i % 3 ? 0.36 : 0.5, i % 2 ? "rgba(110,80,50,.4)" : "rgba(230,215,180,.45)");
  }
  o += pebble(-0.74, 0.3, 1.5) + pebble(0.66, 0.6, 1.2);
  return o + tuft(-0.82, -0.12) + tuft(0.86, 0.02, 0.9) + tuft(-0.3, 0.86, 0.8) + tuft(0.34, 0.9);
}
__name(ground, "ground");
function oar(u, v, h, lean = 0.06) {
  const a = P(u, v, 0), b = P(u + lean, v, h);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  const c = [b[0] - ux * 2, b[1] - uy * 2], t = [b[0] + ux * 11, b[1] + uy * 11];
  const blade = `M${f24(c[0] - 2.6)},${f24(c[1])} Q${f24(t[0] - 4)},${f24(t[1] + 4)} ${f24(t[0])},${f24(t[1])} Q${f24(t[0] + 4)},${f24(t[1] + 4)} ${f24(c[0] + 2.6)},${f24(c[1])} Z`;
  return tk(a, b, WOOD.left, 2.2) + `<path d="${blade}" fill="${WOOD.top}"${EDGE}/>` + ln3(c, [t[0], t[1] + 2], "rgba(90,55,25,.35)", 0.7);
}
__name(oar, "oar");
function barrelLying(u, v, len = 0.36, r = 7) {
  const a = P(u - len / 2, v, r), b = P(u + len / 2, v, r);
  const body = `M${f24(a[0])},${f24(a[1] - r)} L${f24(b[0])},${f24(b[1] - r)} A${f24(r * 0.55)},${r} 0 0 1 ${f24(b[0])},${f24(b[1] + r)} L${f24(a[0])},${f24(a[1] + r)} Z`;
  let o = shadow(u, v, len * 0.7, 0.18) + `<path d="${body}" fill="#A8825A"${EDGE}/>`;
  for (const k of [0.22, 0.5, 0.78]) {
    const p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    o += `<path d="M${f24(p[0])},${f24(p[1] - r)} A${f24(r * 0.55)},${r} 0 0 1 ${f24(p[0])},${f24(p[1] + r)}" fill="none" stroke="#5E4630" stroke-width="1"/>`;
  }
  return o + ell3(a[0], a[1], r * 0.55, r, "#C9A274", EDGE) + ell3(a[0], a[1], r * 0.32, r * 0.62, "#A8825A");
}
__name(barrelLying, "barrelLying");
var coil = /* @__PURE__ */ __name((u, v, r = 0.13) => {
  const [x, y] = P(u, v, 1);
  const rx = r * 45, ry = r * 22.6;
  return ell3(x, y + 1, rx + 0.6, ry + 0.6, OUT2) + [1, 0.72, 0.46].map((k, i) => ell3(x, y - i * 0.6, rx * k, ry * k, i % 2 ? "#B08850" : ROPE, ` stroke="${OUT2}" stroke-width="0.5"`)).join("");
}, "coil");
function canvasHeap(u, v, ru, rv, h, seed = 3) {
  const [x, y] = P(u, v, 0), rx = (ru + rv) * 32, ry = (ru + rv) * 16, k = seed % 2 ? 1 : -1;
  const d = `M${f24(x - rx)},${f24(y)} Q${f24(x - rx * 0.95)},${f24(y - h * 0.9)} ${f24(x - rx * 0.4)},${f24(y - h)} Q${f24(x - rx * 0.1)},${f24(y - h * 1.25)} ${f24(x + rx * 0.25)},${f24(y - h * 0.95)} Q${f24(x + rx * 0.7)},${f24(y - h * 1.05)} ${f24(x + rx * 0.9)},${f24(y - h * 0.4)} Q${f24(x + rx * 1.05)},${f24(y + ry * 0.2)} ${f24(x + rx * 0.6)},${f24(y + ry * 0.7)} Q${f24(x)},${f24(y + ry * 1.05)} ${f24(x - rx * 0.6)},${f24(y + ry * 0.7)} Q${f24(x - rx * 1.02)},${f24(y + ry * 0.4)} ${f24(x - rx)},${f24(y)} Z`;
  const cid = id("heap");
  const corner = `M${f24(x + rx * 0.5 * k)},${f24(y + ry * 0.6)} L${f24(x + rx * 1.15 * k)},${f24(y + ry * 1.2)} L${f24(x + rx * 0.2 * k)},${f24(y + ry * 0.95)} Z`;
  return `<path d="${corner}" fill="${CANVAS.mid}"${EDGE}/><path d="${d}" fill="${CANVAS.light}"${EDGE}/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><ellipse cx="${f24(x + rx * 0.75)}" cy="${f24(y - h * 0.3)}" rx="${f24(rx * 0.6)}" ry="${f24(h * 1.2)}" fill="${CANVAS.dark}" opacity="0.55"/><ellipse cx="${f24(x - rx * 0.3)}" cy="${f24(y - h * 0.9)}" rx="${f24(rx * 0.3)}" ry="${f24(h * 0.18)}" fill="#FFFFFF" opacity="0.35"/></g><path d="M${f24(x - rx * 0.55)},${f24(y - h * 0.55)} Q${f24(x - rx * 0.2)},${f24(y - h * 0.2)} ${f24(x + rx * 0.1)},${f24(y - h * 0.5)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.8" stroke-linecap="round"/><path d="M${f24(x + rx * 0.2)},${f24(y - h * 0.15)} Q${f24(x + rx * 0.45)},${f24(y + ry * 0.2)} ${f24(x + rx * 0.7)},${f24(y - h * 0.1)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.8" stroke-linecap="round"/><path d="M${f24(x - rx * 0.8)},${f24(y - h * 0.2)} Q${f24(x - rx * 0.2)},${f24(y + ry * 0.1)} ${f24(x + rx * 0.5)},${f24(y + ry * 0.35)}" fill="none" stroke="${CANVAS.seam}" stroke-width="0.7" stroke-dasharray="1.6 1.2"/>`;
}
__name(canvasHeap, "canvasHeap");
var shell = /* @__PURE__ */ __name((u, v) => {
  const [x, y] = P(u, v, 0);
  const eventail = `M${f24(x - 0.7)},${f24(y + 0.4)} L${f24(x - 2.6)},${f24(y - 1)} Q${f24(x - 2.8)},${f24(y - 3.2)} ${f24(x)},${f24(y - 3.6)} Q${f24(x + 2.8)},${f24(y - 3.2)} ${f24(x + 2.6)},${f24(y - 1)} L${f24(x + 0.7)},${f24(y + 0.4)} Z`;
  return ell3(x + 0.3, y + 0.5, 2.6, 0.8, "rgba(70,60,30,.18)") + `<path d="${eventail}" fill="#F6E2D0" stroke="${OUT2}" stroke-width="0.5" stroke-linejoin="round"/>` + [-1.6, -0.55, 0.55, 1.6].map((d) => ln3([x + d * 0.3, y + 0.1], [x + d, y - 2.9 + Math.abs(d) * 0.35], "#D9A98C", 0.4)).join("") + `<path d="M${f24(x - 1.3)},${f24(y + 0.6)} L${f24(x - 0.6)},${f24(y - 0.2)} L${f24(x + 0.6)},${f24(y - 0.2)} L${f24(x + 1.3)},${f24(y + 0.6)} Z" fill="#EBC9B2" stroke="${OUT2}" stroke-width="0.45" stroke-linejoin="round"/>`;
}, "shell");
function sailPanel(corners, c = CANVAS, seams = 2) {
  const q = iso(corners);
  let o = `<polygon points="${pts2(q)}" fill="${c.light}"${EDGE}/>`;
  for (let i = 1; i <= seams; i++) {
    const k = i / (seams + 1);
    const a = [q[0][0] + (q[1][0] - q[0][0]) * k, q[0][1] + (q[1][1] - q[0][1]) * k], b = [q[3][0] + (q[2][0] - q[3][0]) * k, q[3][1] + (q[2][1] - q[3][1]) * k];
    o += `<path d="M${f24(a[0])},${f24(a[1])} L${f24(b[0])},${f24(b[1])}" stroke="${c.seam}" stroke-width="0.7" stroke-dasharray="1.6 1.2" fill="none"/>`;
  }
  return o;
}
__name(sailPanel, "sailPanel");
var flag = /* @__PURE__ */ __name((x, y, n = 0) => `<path d="M${f24(x)},${f24(y)} Q${f24(x + 6)},${f24(y + (n ? 2 : -1))} ${f24(x + 12)},${f24(y + 1)} L${f24(x + 9)},${f24(y + 3.4)} L${f24(x + 12)},${f24(y + 6)} Q${f24(x + 6)},${f24(y + (n ? 7 : 4.4))} ${f24(x)},${f24(y + 5.6)} Z" fill="#C8463A"${EDGE}/>`, "flag");
function asterDebris() {
  let o = ground("sable");
  o += oar(-0.62, -0.5, 30) + canvasHeap(-0.18, -0.42, 0.26, 0.2, 10, 5);
  o += crate(0.36, -0.36, 0.17, 13) + crate(0.34, -0.38, 0.12, 9, 13) + crate(0.66, -0.06, 0.12, 9);
  {
    const a = P(0.27, -0.4, 22.6), b = P(0.42, -0.36, 22.6);
    o += tk(a, b, "#C9A24A", 2.2) + ln3([a[0], a[1] - 0.6], [b[0], b[1] - 0.6], "#F0D58A", 0.6);
  }
  o += coil(-0.42, 0.22) + barrelLying(0.12, 0.34, 0.34, 6.5);
  o += kelp(-0.7, 0.62, 12) + kelp(0.6, 0.66, -10) + shell(-0.1, 0.72) + shell(0.36, 0.74) + stone2(0.78, 0.38, 2.6);
  return o;
}
__name(asterDebris, "asterDebris");
function asterShelter() {
  let o = ground("sable");
  const A = [-0.56, -0.18], B = [0.5, -0.22], hA = 34, hB = 26;
  o += sailPanel([[-0.62, -0.66, 0], [0.56, -0.7, 0], [B[0], B[1], hB], [A[0], A[1], hA]], { light: CANVAS.mid, seam: CANVAS.dark }, 2);
  o += `<polyline points="${pts2(iso([[A[0], A[1], hA], [B[0], B[1], hB]]))}" fill="none" stroke="${OUT2}" stroke-width="2.2" stroke-linecap="round"/><polyline points="${pts2(iso([[A[0], A[1], hA], [B[0], B[1], hB]]))}" fill="none" stroke="${CANVAS.light}" stroke-width="1" stroke-linecap="round"/>`;
  for (const u of [-0.3, 0.05, 0.36]) o += stone2(u, -0.64 - u * 0.03, 2.6);
  o += `<polygon points="${pts2(iso([[-0.56, -0.2, 0], [0.5, -0.24, 0], [0.42, 0.02, 0], [-0.5, 0.06, 0]]))}" fill="rgba(60,40,25,.14)"/>`;
  o += plank([-0.36, 0.02], [0.28, -0.02], 0.34, 2.4, { top: CANVAS.light, left: CANVAS.dark }) + plank([-0.3, 0.06], [0.02, 0.04], 0.26, 4, { top: "#C8463A", left: "#9A2F28" });
  {
    const a = P(0.12, -0.12, 3), b = P(0.24, -0.08, 3);
    o += tk(a, b, "#C9A24A", 2) + ln3([a[0], a[1] - 0.5], [b[0], b[1] - 0.5], "#F0D58A", 0.5);
  }
  o += stick(A[0], A[1], 0, A[0] + 0.02, A[1], hA, 2.2, WOOD.left) + stick(B[0], B[1], 0, B[0], B[1] + 0.01, hB, 2, DRIFT.left);
  {
    const t = P(A[0] + 0.02, A[1], hA);
    o += `<path d="M${f24(t[0] - 2.6)},${f24(t[1])} Q${f24(t[0] - 3)},${f24(t[1] - 9)} ${f24(t[0])},${f24(t[1] - 12)} Q${f24(t[0] + 3)},${f24(t[1] - 9)} ${f24(t[0] + 2.6)},${f24(t[1])} Z" fill="${WOOD.top}"${EDGE}/>`;
  }
  o += rope(P(A[0], A[1], hA - 1), P(-0.88, 0.42, 1), 3, 0.6) + rope(P(B[0], B[1], hB - 1), P(0.84, 0.36, 1), 3, 0.6);
  o += stick(-0.88, 0.42, 0, -0.86, 0.42, 5, 1.6, WOOD_DARK.left) + stick(0.84, 0.36, 0, 0.86, 0.36, 5, 1.6, WOOD_DARK.left);
  o += crate(0.76, -0.4, 0.13, 10) + crate(0.66, 0.06, 0.11, 8) + barrelLying(-0.04, 0.6, 0.3, 6) + coil(-0.6, 0.56) + kelp(0.4, 0.8, -10) + shell(0.18, 0.84);
  return o;
}
__name(asterShelter, "asterShelter");
function asterCabin(n = 0) {
  let o = ground("sable");
  const u0 = -0.6, u1 = 0.2, v0 = -0.66, v1 = 0.02, h = 20;
  o += stick(0.56, -0.62, 0, 0.56, -0.62, 50, 2.4, WOOD_DARK.left) + stick(0.44, -0.62, 40, 0.68, -0.62, 40, 1.6, WOOD_DARK.left);
  {
    const t = P(0.56, -0.62, 50);
    o += flag(t[0] + 1, t[1] - 1, n);
  }
  o += rope(P(0.56, -0.62, 46), P(0.9, -0.3, 1), 3, 0.6);
  o += box(u0, v0, u1, v1, 0, h, CRATE) + planksLeft(u0, u1, v1, 0, h, 4) + planksRight(u1, v0, v1, 0, h, 4);
  o += face([[-0.36, v1, 7], [-0.12, v1, 7], [-0.12, v1, 11], [-0.36, v1, 11]], "#9C7148", EDGE);
  o += face([[u1, -0.5, 4], [u1, -0.3, 4], [u1, -0.3, 8], [u1, -0.5, 8]], "#A97E52", EDGE);
  o += face([[-0.06, v1, 0], [0.12, v1, 0], [0.12, v1, 15], [-0.06, v1, 15]], "#2E2218", EDGE);
  o += face([[-0.06, v1, 15], [0.04, v1, 15], [0.03, v1, 4], [-0.06, v1, 2]], CANVAS.light, EDGE);
  o += face([[u1, -0.18, 11], [u1, -0.06, 11], [u1, -0.06, 16], [u1, -0.18, 16]], "#2E2218", EDGE);
  o += gable(u0, v0, u1, v1, h, 12, { front: CANVAS.light, back: CANVAS.mid, gable: CANVAS.dark }, 0.1);
  for (const k of [0.33, 0.66]) {
    const u = u0 - 0.1 + (u1 - u0 + 0.2) * k;
    o += ln3(P(u, (v0 + v1) / 2, h + 12), P(u, v1 + 0.1, h), CANVAS.seam, 0.7);
  }
  o += rope(P(u0 - 0.06, v1 + 0.1, h - 1), P(u0 - 0.2, v1 + 0.24, 0), 1, 0.6) + rope(P(u1 + 0.06, v1 + 0.1, h - 1), P(u1 + 0.24, v1 + 0.26, 0), 1, 0.6);
  o += stick(-0.5, 0.06, 0, -0.44, 0.04, 26, 2, WOOD.left);
  o += crate(0.56, 0.2, 0.12, 9) + coil(-0.62, 0.48) + cylinder(0.36, 0.52, 0, 12, 0.11, { top: "#C9A274", left: "#A8825A", right: "#7A5A3E" }, id("ast")) + kelp(0.7, 0.74, -10);
  return o;
}
__name(asterCabin, "asterCabin");
function hullWall(pts3, h0, h1) {
  let o = "";
  const n = pts3.length - 1;
  for (let i = 0; i < n; i++) {
    const [ua, va] = pts3[i], [ub, vb] = pts3[i + 1];
    const ha = h0 + (h1 - h0) * Math.sin(i / n * Math.PI), hb = h0 + (h1 - h0) * Math.sin((i + 1) / n * Math.PI);
    const jag = i % 2 ? -2.4 : 1.6, top = Math.min(ha, hb + jag);
    o += face([[ua, va, 0], [ub, vb, 0], [ub, vb, hb + jag], [ua, va, ha]], i % 2 ? HULL.white2 : HULL.white, EDGE);
    o += face([[ua, va, 0], [ub, vb, 0], [ub, vb, 4.6], [ua, va, 4.6]], HULL.red);
    o += face([[ua, va, top - 5], [ub, vb, top - 5], [ub, vb, top - 3.6], [ua, va, top - 3.6]], HULL.navy);
    o += ln3(P(ua, va, ha * 0.5), P(ub, vb, hb * 0.5), "rgba(40,25,10,.3)", 0.6);
  }
  return o;
}
__name(hullWall, "hullWall");
function cannelleKitchen(n = 0) {
  let o = ground("sable");
  const curve = [[-0.78, -0.2], [-0.66, -0.52], [-0.4, -0.72], [-0.06, -0.8], [0.3, -0.76], [0.6, -0.58]];
  o += stick(-0.5, -0.66, 0, -0.52, -0.66, 30, 2.4, "#7E8088") + stick(0.18, -0.8, 0, 0.18, -0.8, 27, 2.4, "#7E8088");
  o += hullWall(curve, 10, 24);
  {
    const [x, y] = P(0.1, -0.785, 7.8);
    o += ln3([x + 0.4, y + 2.6], [x + 0.9, y + 7.2], "rgba(160,90,40,.35)", 1.1) + ell3(x, y, 2.3, 2.5, "#C9A24A", ` stroke="${OUT2}" stroke-width="0.6"`) + ell3(x, y, 1.5, 1.7, HULL.glass) + ell3(x - 0.5, y - 0.6, 0.5, 0.5, "#FFFFFF", ' opacity=".8"');
  }
  o += [[-0.6, -0.58, 10], [0.4, -0.7, 14]].map(([u, v, z]) => {
    const [x, y] = P(u, v, z);
    return ell3(x, y, 1, 0.7, "#D9D2C2", ` stroke="${OUT2}" stroke-width="0.4"`);
  }).join("");
  {
    const a = P(-0.5, -0.64, 26), b = P(0.18, -0.78, 23);
    o += rope(a, b, 4, 0.5);
    for (const t of [0.25, 0.5, 0.75]) {
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + 4 * Math.sin(t * Math.PI) - 0.4;
      o += ln3([x, y], [x, y + 2], OUT2, 0.5) + `<path d="M${f24(x)},${f24(y + 2)} q2.2,2.6 0,6 q-2.2,-3.4 0,-6 Z M${f24(x - 1.4)},${f24(y + 9.2)} L${f24(x)},${f24(y + 7.6)} L${f24(x + 1.4)},${f24(y + 9.2)} Z" fill="#9FB4C2" stroke="${OUT2}" stroke-width="0.5"/>`;
    }
  }
  o += driftFire(0.04, -0.06, 0.66, n);
  const top = P(0.04, -0.06, 40);
  for (const [u, v] of [[-0.3, -0.26], [0.34, -0.22], [0.06, 0.28]]) o += tk(P(u, v, 0), top, DRIFT.left, 2);
  o += ln3(top, P(0.04, -0.06, 25), OUT2, 0.9);
  {
    const [x, y] = P(0.04, -0.06, 19);
    o += `<path d="M${f24(x - 6.6)},${f24(y - 5)} L${f24(x - 6)},${f24(y + 2)} Q${f24(x)},${f24(y + 5.6)} ${f24(x + 6)},${f24(y + 2)} L${f24(x + 6.6)},${f24(y - 5)} Z" fill="${IRON2.left}"${EDGE}/>` + ell3(x, y - 5, 6.6, 2.6, IRON2.top, EDGE) + ell3(x, y - 5, 5.2, 1.8, "#C9934E") + `<path d="M${f24(x - 6.4)},${f24(y - 5)} Q${f24(x)},${f24(y - 14)} ${f24(x + 6.4)},${f24(y - 5)}" fill="none" stroke="${OUT2}" stroke-width="0.8"/><path d="M${f24(x + 2.4)},${f24(y + 0.6)} l1.4,1.6 l1.2,-0.8" fill="none" stroke="${OUT2}" stroke-width="0.6"/>`;
  }
  o += crate(-0.5, 0.24, 0.13, 9) + crate(0.56, 0.18, 0.13, 9);
  {
    const a = P(0.46, 0.12, 9.6), b = P(0.66, 0.24, 9.6);
    o += tk(a, b, "#C27C45", 1.4) + ell3(b[0] + 2.4, b[1] + 0.6, 3, 1.8, "#C27C45", EDGE) + ell3(b[0] + 2.4, b[1] + 0.4, 2, 1.1, "#8F5530");
  }
  o += cylinder(-0.2, 0.58, 0, 9, 0.1, { top: "#C9CED6", left: "#AEB4BC", right: "#868C94" }, id("cas")) + kelp(0.5, 0.74, -8) + shell(-0.62, 0.66);
  return o;
}
__name(cannelleKitchen, "cannelleKitchen");
function gear(u, v, r, z = 0, rot = 0) {
  const [x, y] = P(u, v, z);
  const ptsG = Array.from({ length: 16 }, (_, i) => {
    const a = i * Math.PI / 8 + rot, rr = i % 2 ? r * 0.76 : r;
    return [x + Math.cos(a) * rr * 1.4, y + Math.sin(a) * rr * 0.7];
  });
  return `<polygon points="${pts2(ptsG)}" fill="${IRON2.top}"${EDGE}/>` + ell3(x, y, r * 0.55, r * 0.28, IRON2.right) + ell3(x, y, r * 0.2, r * 0.1, OUT2);
}
__name(gear, "gear");
function screwTin(u, v, z = 0) {
  const [x, y] = P(u, v, z);
  return box(u - 0.08, v - 0.06, u + 0.08, v + 0.06, z, z + 4, { top: "#C9CED6", left: "#AEB4BC", right: "#868C94" }) + [[-3, -4.6], [-1, -4.8], [1.2, -4.4], [3, -4.8]].map(([dx, dy]) => ell3(x + dx, y + dy, 0.8, 0.5, "#D9C27A", ` stroke="${OUT2}" stroke-width="0.4"`)).join("");
}
__name(screwTin, "screwTin");
function brokenClock(u, v) {
  const [x, y] = P(u, v, 0);
  return `<path d="M${f24(x - 5)},${f24(y)} L${f24(x - 5)},${f24(y - 12)} Q${f24(x)},${f24(y - 18)} ${f24(x + 5)},${f24(y - 12)} L${f24(x + 5)},${f24(y)} Z" fill="#8A5A36"${EDGE}/>` + ell3(x, y - 10, 3.4, 3.4, "#F4EEDF", EDGE) + ln3([x, y - 10], [x + 1.6, y - 12], OUT2, 0.6) + ln3([x, y - 10], [x - 1, y - 8], OUT2, 0.6) + `<path d="M${f24(x - 2.6)},${f24(y - 12.4)} L${f24(x - 0.6)},${f24(y - 9.6)} L${f24(x + 0.8)},${f24(y - 11)} L${f24(x + 2.4)},${f24(y - 8.6)}" fill="none" stroke="${OUT2}" stroke-width="0.45"/>`;
}
__name(brokenClock, "brokenClock");
function patch2(q4) {
  const q = iso(q4), cx = q.reduce((a, p) => a + p[0], 0) / 4, cy = q.reduce((a, p) => a + p[1], 0) / 4;
  const inset = q.map(([x, y]) => [x + (cx - x) * 0.2, y + (cy - y) * 0.2]);
  return `<polygon points="${pts2(q)}" fill="#F4EDDA" stroke="${CANVAS.seam}" stroke-width="0.5" stroke-linejoin="round"/><polygon points="${pts2(inset)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.4" stroke-dasharray="0.9 0.7"/>`;
}
__name(patch2, "patch");
function wallSaw(u, v0, v1) {
  const at = /* @__PURE__ */ __name((k, z) => P(u, v0 + (v1 - v0) * k, z), "at");
  const a = at(0.5, 12.6), b = at(0.78, 12.6), c = at(0.78, 9.4), d = at(0.5, 8.4), [nx, ny] = at(0.64, 13.2);
  const dents = Array.from({ length: 6 }, (_, i) => {
    const t = (i + 0.5) / 6, x = d[0] + (c[0] - d[0]) * t, y = d[1] + (c[1] - d[1]) * t;
    return `M${f24(x - 0.5)},${f24(y)} L${f24(x)},${f24(y + 0.8)} L${f24(x + 0.5)},${f24(y)}`;
  }).join(" ");
  const h = at(0.82, 11.2);
  return `<path d="${dents}" fill="#8E949C" stroke="${OUT2}" stroke-width="0.35"/><polygon points="${pts2([a, b, c, d])}" fill="#C9CED6"${EDGE}/>` + ln3([a[0] + 0.8, a[1] + 0.9], [b[0] - 0.6, b[1] + 0.9], "#EEF1F4", 0.5) + `<rect x="${f24(h[0] - 1.8)}" y="${f24(h[1] - 2.4)}" width="3.8" height="4.8" rx="1.1" fill="${WOOD.left}"${EDGE}/>` + ell3(h[0] + 0.3, h[1], 0.7, 1.2, WOOD_DARK.right) + ell3(nx, ny, 0.6, 0.6, IRON2.right, ` stroke="${OUT2}" stroke-width="0.35"`);
}
__name(wallSaw, "wallSaw");
function hammerLying(u, v, z) {
  const a = P(u - 0.07, v + 0.02, z), b = P(u + 0.07, v - 0.02, z);
  return tk(a, b, "#A8743F", 1.1) + `<g transform="translate(${f24(b[0])} ${f24(b[1])}) rotate(-62)"><rect x="-2.6" y="-1.1" width="5.2" height="2.2" rx="0.5" fill="${IRON2.left}"${EDGE}/></g>`;
}
__name(hammerLying, "hammerLying");
function ropeHung(u, v, z) {
  const [x, y] = P(u, v, z);
  return ell3(x, y + 3.2, 2.6, 3.4, "none", ` stroke="${OUT2}" stroke-width="2.3"`) + ell3(x, y + 3.2, 2.6, 3.4, "none", ` stroke="${ROPE}" stroke-width="1.1"`) + ell3(x + 0.3, y + 3.6, 1.7, 2.5, "none", ` stroke="${OUT2}" stroke-width="1.6"`) + ell3(x + 0.3, y + 3.6, 1.7, 2.5, "none", ` stroke="#B08850" stroke-width="0.7"`) + pathTk(`M${f24(x - 1)},${f24(y - 0.4)} L${f24(x + 1)},${f24(y + 0.4)}`, ROPE, 0.6);
}
__name(ropeHung, "ropeHung");
function oilCan(u, v) {
  const [x, y] = P(u, v, 0);
  return ell3(x + 0.6, y + 0.3, 3.4, 1.4, "rgba(40,55,20,.22)") + `<path d="M${f24(x - 2.6)},${f24(y)} L${f24(x - 2.6)},${f24(y - 3.4)} Q${f24(x)},${f24(y - 5.4)} ${f24(x + 2.6)},${f24(y - 3.4)} L${f24(x + 2.6)},${f24(y)} Q${f24(x)},${f24(y + 1.2)} ${f24(x - 2.6)},${f24(y)} Z" fill="#C9A24A"${EDGE}/>` + ell3(x, y - 3.6, 2.6, 1, "#E3C46E", ` stroke="${OUT2}" stroke-width="0.5"`) + tk([x + 0.4, y - 4.6], [x + 4.6, y - 8.2], "#A8873A", 0.6) + ell3(x - 1.2, y - 2.2, 0.5, 1, "#F2DC9A") + `<path d="M${f24(x + 5)},${f24(y - 7)} q0.6,1 0,1.6 q-0.6,-0.6 0,-1.6 Z" fill="#3A3A44"/>`;
}
__name(oilCan, "oilCan");
function wrenchLying(u, v) {
  const a = P(u - 0.1, v + 0.03, 0.5), b = P(u + 0.1, v - 0.03, 0.5);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, r = 2.3, c = [b[0] + ux * r * 0.8, b[1] + uy * r * 0.8];
  const ang = Math.atan2(uy, ux), p1 = [c[0] + Math.cos(ang + 0.75) * r, c[1] + Math.sin(ang + 0.75) * r * 0.7], p2 = [c[0] + Math.cos(ang - 0.75) * r, c[1] + Math.sin(ang - 0.75) * r * 0.7];
  const C2 = `M${f24(p1[0])},${f24(p1[1])} A${r},${f24(r * 0.7)} 0 1 1 ${f24(p2[0])},${f24(p2[1])}`;
  return ell3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1, 6, 1.4, "rgba(40,55,20,.2)") + tk(a, b, "#AEB4BC", 1.5) + ln3([a[0] + 1, a[1] - 0.5], [b[0] - 1.5, b[1] - 0.5], "#E4E8EC", 0.5) + pathTk(C2, "#C9CED6", 1.5);
}
__name(wrenchLying, "wrenchLying");
function rivetDebris() {
  let o = ground("sable");
  o += stick(-0.4, -0.5, 0, -0.32, -0.52, 22, 2.2, WOOD.left) + canvasHeap(-0.1, -0.42, 0.42, 0.3, 14, 7) + canvasHeap(-0.46, -0.3, 0.2, 0.16, 7, 2);
  o += brokenClock(0.48, -0.44) + gear(0.2, -0.02, 4.6, 0, 0.2) + gear(0.42, 0.06, 3.2, 0, 0.6) + gear(0.56, 0.24, 2.4, 0, 0.1);
  o += screwTin(-0.28, 0.18) + [[-0.06, 0.34], [0.08, 0.4], [-0.16, 0.46]].map(([u, v]) => {
    const [x, y] = P(u, v, 0);
    return ell3(x, y, 2.6, 1.2, "#B8C0C8", EDGE) + ell3(x - 0.6, y - 0.4, 1, 0.4, "#E4E8EC");
  }).join("");
  o += kelp(-0.7, 0.5, 10) + shell(0.66, 0.6) + stone2(0.78, 0.2, 2.4);
  return o;
}
__name(rivetDebris, "rivetDebris");
function rivetShelter() {
  let o = ground("sable");
  const u0 = -0.7, u1 = 0.2, v0 = -0.72, v1 = -0.06;
  o += gable(u0, v0, u1, v1, 0, 30, { front: CANVAS.light, back: CANVAS.mid, gable: "#2E2218" }, 0.06);
  o += ell3(...P(0.12, -0.38, 0.6), 7, 2.6, "#C8463A", EDGE).replace('<ellipse cx="', '<ellipse cx="');
  for (const k of [0.33, 0.66]) {
    const u = u0 + (u1 - u0) * k;
    o += ln3(P(u, (v0 + v1) / 2, 30), P(u, v1 + 0.06, 0), CANVAS.seam, 0.7);
  }
  o += stick(u0 - 0.14, (v0 + v1) / 2, 30, u1 + 0.16, (v0 + v1) / 2, 30, 2.2, WOOD.left);
  {
    const t = P(u1 + 0.16, (v0 + v1) / 2, 30);
    o += `<path d="M${f24(t[0] - 1.2)},${f24(t[1] - 2.6)} Q${f24(t[0] + 6)},${f24(t[1] - 1.4)} ${f24(t[0] + 9)},${f24(t[1] + 2)} Q${f24(t[0] + 5)},${f24(t[1] + 3.6)} ${f24(t[0] - 1.2)},${f24(t[1] + 2.6)} Z" fill="${WOOD.top}"${EDGE}/>`;
  }
  o += crate(0.18, 0.28, 0.12, 12) + crate(0.66, 0.06, 0.12, 12);
  o += face([[0.02, 0.06, 12], [0.8, -0.16, 12], [0.82, 0.08, 12], [0.04, 0.32, 12]], WOOD.top, EDGE) + face([[0.04, 0.32, 12], [0.82, 0.08, 12], [0.82, 0.08, 14], [0.04, 0.32, 14]], WOOD.left, EDGE).replace(/points="[^"]*"/, (m) => m);
  o += gear(0.5, 0, 3, 12.5, 0.3) + screwTin(0.24, 0.12).replace(/(<polygon[^>]*>)/, "$1");
  {
    const a = P(0.34, 0.18, 13), b = P(0.48, 0.14, 13);
    o += tk(a, b, "#A8743F", 1.2) + `<rect x="${f24(b[0] - 0.6)}" y="${f24(b[1] - 3)}" width="2.4" height="5" rx="0.6" fill="${IRON2.left}"${EDGE}/>`;
  }
  o += brokenClock(-0.6, 0.36) + kelp(0.6, 0.66, -10);
  return o;
}
__name(rivetShelter, "rivetShelter");
function rivetCabin() {
  let o = ground("sable");
  const u0 = -0.7, u1 = 0.4, v0 = -0.74, v1 = -0.14;
  o += face([[u0, v0, 0], [u1, v0, 0], [u1, v0, 22], [u0, v0, 22]], WOOD_DARK.left, EDGE) + planksLeft(u0, u1, v0, 0, 22, 5);
  o += face([[u0, v0, 0], [u0, v1, 0], [u0, v1, 30], [u0, v0, 22]], WOOD_DARK.right, EDGE);
  o += wallSaw(u0 + 0.01, v0, v1);
  o += brokenClock(0.2, v0 + 0.06).replace("#8A5A36", "#A87650");
  o += box(-0.6, v0 + 0.06, 0.1, v0 + 0.26, 0, 11, WOOD) + planksLeft(-0.6, 0.1, v0 + 0.26, 0, 11, 3.6);
  o += box(-0.2, v0 + 0.1, -0.06, v0 + 0.2, 11, 15, IRON2) + gear(-0.4, v0 + 0.16, 2.6, 11.2, 0.4) + hammerLying(0, v0 + 0.18, 11.4);
  o += stick(u1, v1, 0, u1, v1, 30, 2.8, DRIFT.left) + stick(u0 + 0.02, v1, 0, u0 + 0.02, v1, 30, 2.8, DRIFT.left) + ropeHung(u0 + 0.02, v1 + 0.01, 19);
  o += face([[u0 - 0.06, v1 + 0.08, 31], [u1 + 0.08, v1 + 0.08, 31], [u1 + 0.08, v1 + 0.08, 29.4], [u0 - 0.06, v1 + 0.08, 29.4]], CANVAS.dark, EDGE);
  o += face([[u0 - 0.06, v1 + 0.08, 31], [u1 + 0.08, v1 + 0.08, 31], [u1 + 0.08, v0 - 0.04, 23], [u0 - 0.06, v0 - 0.04, 23]], CANVAS.light, EDGE);
  for (const k of [0.25, 0.5, 0.75]) {
    const u = u0 + (u1 - u0) * k;
    o += ln3(P(u, v1 + 0.08, 31), P(u, v0 - 0.04, 23), CANVAS.seam, 0.7);
  }
  o += patch2([[-0.12, -0.24, 29.9], [0.1, -0.24, 29.9], [0.1, -0.44, 27.6], [-0.12, -0.44, 27.6]]);
  for (const u of [u0 + 0.02, u1]) {
    const [x, y] = P(u, v1, 29);
    o += pathTk(`M${f24(x - 1.8)},${f24(y + 0.6)} L${f24(x + 1.8)},${f24(y - 0.4)} M${f24(x - 1.8)},${f24(y + 1.8)} L${f24(x + 1.8)},${f24(y + 0.8)}`, ROPE, 0.6);
  }
  o += crate(0.62, 0.12, 0.13, 10) + gear(0.62, 0.12, 2.8, 10.4, 0.2) + gear(0.1, 0.24, 3.6, 0, 0.5) + screwTin(-0.3, 0.3) + kelp(-0.66, 0.6, 10);
  o += oilCan(0.34, 0.42) + wrenchLying(-0.08, 0.5);
  return o;
}
__name(rivetCabin, "rivetCabin");
var WATER = { deep: "#6FB8D2", mid: "#8FCDE0", light: "#CFEFF7" };
function pool2(u, v, r, n = 0) {
  let o = disc(u, v, 0, r + 0.06, "#7A6A54") + disc(u, v, 0.5, r, WATER.deep, EDGE) + disc(u - r * 0.15, v - r * 0.15, 0.6, r * 0.62, WATER.mid);
  const [x, y] = P(u, v, 0.8);
  o += ell3(x + (n ? 2 : -1), y, (n ? 6 : 4) * r * 2.4, (n ? 3 : 2) * r * 2.4, "none", ` stroke="${WATER.light}" stroke-width="0.7"`);
  const ring = Array.from({ length: 7 }, (_, k) => {
    const a = k / 7 * Math.PI * 2 + 0.3;
    return [u + Math.cos(a) * (r + 0.05), v + Math.sin(a) * (r + 0.05), k];
  }).sort((p, q) => p[0] + p[1] - q[0] - q[1]);
  for (const [pu, pv, k] of ring) o += stone2(pu, pv, 2.6 + k % 3 * 0.6, k % 2 ? STONE : { top: "#D9DCC8", left: "#B7BCA4", right: "#8E947E" });
  return o;
}
__name(pool2, "pool");
var jarAt = /* @__PURE__ */ __name((u, v, z = 0, lying = false) => {
  const [x, y] = P(u, v, z);
  return lying ? `<g transform="translate(${f24(x)} ${f24(y - 2.2)}) rotate(78)">${`<rect x="-2" y="-2.8" width="4" height="5.2" rx="1.2" fill="#D6ECF2" fill-opacity="0.8" stroke="${OUT2}" stroke-width="0.7"/><rect x="-1.4" y="-3.8" width="2.8" height="1.4" rx="0.4" fill="#B07E4C" stroke="${OUT2}" stroke-width="0.6"/>`}</g>` : `<rect x="${f24(x - 2)}" y="${f24(y - 5.6)}" width="4" height="5.6" rx="1.2" fill="#D6ECF2" fill-opacity="0.8" stroke="${OUT2}" stroke-width="0.7"/><rect x="${f24(x - 1.4)}" y="${f24(y - 7)}" width="2.8" height="1.6" rx="0.4" fill="#B07E4C" stroke="${OUT2}" stroke-width="0.6"/>` + ln3([x - 1.1, y - 4.6], [x - 1.1, y - 1.4], "#FFFFFF", 0.6);
}, "jarAt");
var bigLeaf = /* @__PURE__ */ __name((x, y, l, rot, c = "#6FAE4E", cs = "#4F8F3A") => `<g transform="translate(${f24(x)} ${f24(y)}) rotate(${rot})"><path d="M0,${f24(-l / 2)} Q${f24(l * 0.32)},0 0,${f24(l / 2)} Q${f24(-l * 0.32)},0 0,${f24(-l / 2)} Z" fill="${c}" stroke="${OUT2}" stroke-width="0.6"/><path d="M0,${f24(-l / 2 + 1)} L0,${f24(l / 2 - 1)}" stroke="${cs}" stroke-width="0.6"/></g>`, "bigLeaf");
var leafPile = /* @__PURE__ */ __name((u, v, r, cols = ["#9AB85A", "#7EA548", "#C9B25A"]) => {
  const [x, y] = P(u, v, 2);
  let o = ell3(x, y + 1, r * 30 + 1, r * 15 + 1, OUT2);
  for (let i = 0; i < 9; i++) {
    const a = i * 2.4;
    o += ell3(x + Math.cos(a) * r * 18 * (i % 3 / 3 + 0.4), y + Math.sin(a) * r * 8 * (i % 3 / 3 + 0.4) - 1, r * 13, r * 7, cols[i % 3]);
  }
  return o;
}, "leafPile");
function boatHull(u, v, len, half2, h, flipped = false, c = { out: "#B07A45", side: "#8A5A32", inside: "#6E4A2C", rim: "#C99A62" }) {
  const N2 = 9, side = Array.from({ length: N2 }, (_, i) => {
    const t = i / (N2 - 1), uu = u - len / 2 + len * t;
    return [uu, half2 * Math.sin(t * Math.PI) ** 0.7];
  });
  const near = side.map(([uu, vv]) => [uu, v + vv]), far = side.map(([uu, vv]) => [uu, v - vv]).reverse();
  let o = shadow(u, v, len * 0.55, 0.18);
  if (!flipped) {
    o += `<polygon points="${pts2([...near.map(([a, b]) => P(a, b, h)), ...far.map(([a, b]) => P(a, b, h))])}" fill="${c.inside}"${EDGE}/>`;
    o += `<polygon points="${pts2([...near.map(([a, b]) => P(a, b, h)), ...near.slice().reverse().map(([a, b]) => P(a, v + (b - v) * 0.55, 0))])}" fill="${c.side}"${EDGE}/>`;
    o += `<polyline points="${pts2(near.map(([a, b]) => P(a, v + (b - v) * 0.8, h * 0.45)))}" fill="none" stroke="rgba(40,25,10,.35)" stroke-width="0.8"/>`;
    o += face([[u - 0.04, v - half2 * 0.9, h - 1], [u + 0.04, v - half2 * 0.9, h - 1], [u + 0.04, v + half2 * 0.9, h - 1], [u - 0.04, v + half2 * 0.9, h - 1]], c.rim, EDGE);
    o += `<polyline points="${pts2(near.map(([a, b]) => P(a, b, h)))}" fill="none" stroke="${OUT2}" stroke-width="2.2"/><polyline points="${pts2(near.map(([a, b]) => P(a, b, h)))}" fill="none" stroke="${c.rim}" stroke-width="1"/>`;
  } else {
    const top = side.map(([uu]) => [uu, v]);
    o += `<polygon points="${pts2([...near.map(([a, b]) => P(a, b, 0)), ...top.slice().reverse().map(([a, b], i) => P(a, b, h * Math.sin((N2 - 1 - i) / (N2 - 1) * Math.PI) ** 0.5))])}" fill="${c.out}"${EDGE}/>`;
    for (const k of [0.33, 0.66]) o += `<polyline points="${pts2(side.map(([a, vv], i) => P(a, v + vv * k, h * (1 - k * 0.6) * Math.sin(i / (N2 - 1) * Math.PI) ** 0.5)))}" fill="none" stroke="rgba(40,25,10,.4)" stroke-width="0.8"/>`;
    o += `<polyline points="${pts2(top.map(([a, b], i) => P(a, b, h * Math.sin(i / (N2 - 1) * Math.PI) ** 0.5)))}" fill="none" stroke="${OUT2}" stroke-width="2.4"/><polyline points="${pts2(top.map(([a, b], i) => P(a, b, h * Math.sin(i / (N2 - 1) * Math.PI) ** 0.5)))}" fill="none" stroke="${c.side}" stroke-width="1.1"/>`;
  }
  return o;
}
__name(boatHull, "boatHull");
function seedBed(u, v, s, sprouts = 3) {
  let o = box(u - s, v - s * 0.7, u + s, v + s * 0.7, 0, 2, { top: "#946240", left: "#784C2E", right: "#5E3A22" });
  for (let r = 0; r < 3; r++) {
    const vv = v - s * 0.45 + r * s * 0.45;
    o += ln3(P(u - s * 0.85, vv, 2), P(u + s * 0.85, vv, 2), "rgba(50,30,15,.45)", 0.8);
    for (let k = 0; k < sprouts; k++) {
      const [x, y] = P(u - s * 0.6 + k * (s * 1.2) / Math.max(1, sprouts - 1), vv, 2);
      o += ln3([x, y], [x, y - 3], "#5F8F3C", 0.8) + ell3(x - 1.2, y - 3, 1.2, 0.7, "#7EC45B", ` stroke="${OUT2}" stroke-width="0.35"`) + ell3(x + 1.2, y - 3.4, 1.2, 0.7, "#7EC45B", ` stroke="${OUT2}" stroke-width="0.35"`);
    }
  }
  return o;
}
__name(seedBed, "seedBed");
var seedTin = /* @__PURE__ */ __name((u, v, z = 0) => box(u - 0.07, v - 0.05, u + 0.07, v + 0.05, z, z + 4, { top: "#9AA2AD", left: "#6E7480", right: "#545A65" }) + (() => {
  const [x, y] = P(u, v + 0.05, z + 2);
  return `<rect x="${f24(x - 0.8)}" y="${f24(y - 1)}" width="1.6" height="1.6" rx="0.3" fill="#F2C94C" stroke="${OUT2}" stroke-width="0.4"/>`;
})(), "seedTin");
var seedsSpill = /* @__PURE__ */ __name((u, v) => {
  const [x, y] = P(u, v, 0);
  return [[0, 0, "#C9A45A"], [3, 1, "#8A5A2E"], [-3, 1.4, "#E2C27A"], [1.4, 2.4, "#7FA65A"], [-1.6, -1, "#C9A45A"], [4.6, -0.6, "#8A5A2E"]].map(([dx, dy, c]) => ell3(x + dx, y + dy, 1.1, 0.8, c, ` stroke="${OUT2}" stroke-width="0.35"`)).join("");
}, "seedsSpill");
function ondinDebris(n = 0) {
  let o = ground("terre");
  o += boulder(-0.44, -0.5, 0.42, 0.36, 22, STONE, 4, 0.18, 0.72) + (() => {
    const [x, y] = P(-0.4, -0.5, 21);
    return ell3(x, y, 7, 2.6, "#8DAE6A") + ell3(x + 3, y + 1, 3, 1.2, "#A9C27A");
  })();
  o += leafPile(-0.18, -0.12, 0.3, ["#8DAE6A", "#7A9C58", "#A9C27A"]);
  o += pool2(0.36, 0.08, 0.26, n);
  o += jarAt(0, 0.36, 0, true) + stick(-0.06, -0.3, 0, -0.16, -0.38, 18, 1.4, "#A8743F") + stone2(-0.6, 0.4, 3) + stone2(0.7, 0.56, 2.4);
  return o;
}
__name(ondinDebris, "ondinDebris");
function ondinShelter(n = 0) {
  let o = ground("terre");
  o += boulder(-0.52, -0.58, 0.38, 0.32, 20, STONE, 4, 0.18, 0.72) + (() => {
    const [x, y] = P(-0.48, -0.58, 19);
    return ell3(x, y, 6, 2.4, "#8DAE6A");
  })();
  o += leafPile(-0.24, -0.22, 0.28, ["#8DAE6A", "#7A9C58", "#A9C27A"]);
  o += stick(-0.56, -0.02, 0, -0.56, -0.02, 20, 1.8, "#8A6440") + stick(0.08, -0.12, 0, 0.08, -0.12, 20, 1.8, "#8A6440") + stick(-0.62, -0.02, 20, 0.14, -0.12, 20, 1.6, "#8A6440");
  {
    const a = P(-0.56, -0.02, 20), b = P(0.08, -0.12, 20);
    for (let i = 0; i < 6; i++) {
      const t = i / 5, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      o += bigLeaf(x - 4, y - 7, 15, -64 + i * 3, i % 2 ? "#6FAE4E" : "#7EBA58");
    }
  }
  o += pool2(0.4, 0.12, 0.24, n);
  for (let i = 0; i < 4; i++) {
    const u = 0.38 - i * 0.12, v = 0.38 + i * 0.1;
    o += disc(u, v, 0, 0.06, WATER.mid) + stone2(u - 0.06, v + 0.05, 1.8) + stone2(u + 0.06, v - 0.05, 1.8);
  }
  o += box(0.56, -0.42, 0.78, -0.28, 0, 3, STONE) + jarAt(0.6, -0.36, 3) + jarAt(0.68, -0.33, 3) + jarAt(0.75, -0.3, 3);
  return o;
}
__name(ondinShelter, "ondinShelter");
function ondinCabin(n = 0) {
  let o = ground("terre");
  const cu = -0.32, cv = -0.38;
  o += cylinder(cu, cv, 0, 18, 0.36, { top: "#BDB5A3", left: "#B4AC9A", right: "#8C8474" }, id("ond"));
  {
    const [x, y] = P(cu, cv, 0);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 0.9 + 0.12 + r % 2 * 0.25;
      const xx = x - Math.cos(a) * 16, yy = y - r * 4.4 - 2 + Math.sin(a) * 7.6;
      o += `<path d="M${f24(xx - 2.2)},${f24(yy)} q2.2,-1.6 4.4,0" fill="none" stroke="rgba(70,60,45,.45)" stroke-width="0.7"/>`;
    }
  }
  o += face([[cu - 0.08, cv + 0.36, 0], [cu + 0.1, cv + 0.34, 0], [cu + 0.1, cv + 0.34, 12], [cu - 0.08, cv + 0.36, 12]], "#2E2218", EDGE);
  {
    const [x, y] = P(cu, cv, 18);
    o += `<path d="M${f24(x - 19)},${f24(y + 1)} Q${f24(x - 10)},${f24(y - 12)} ${f24(x)},${f24(y - 15)} Q${f24(x + 10)},${f24(y - 12)} ${f24(x + 19)},${f24(y + 1)} Q${f24(x)},${f24(y + 9)} ${f24(x - 19)},${f24(y + 1)} Z" fill="#7EA548"${EDGE}/>` + ell3(x - 5, y - 7, 6, 2.6, "#9DC066") + ell3(x + 8, y - 2, 4, 1.8, "#6E9440") + [[-12, -1], [-4, 3], [6, 3.4], [13, 0]].map(([dx, dy]) => ell3(x + dx, y + dy, 1.4, 0.9, "#5C8A45")).join("");
  }
  o += pool2(0.38, 0.14, 0.24, n);
  o += stick(0.66, -0.2, 0, 0.66, -0.2, 26, 1.8, "#8A6440") + stick(0.66, -0.2, 26, 0.6, -0.2, 31, 1.4, "#8A6440") + stick(0.66, -0.2, 26, 0.74, -0.2, 31, 1.4, "#8A6440");
  {
    const a = P(0.66, -0.2, 26), b = P(0.5, 0, 12);
    o += ln3(a, b, ROPE, 0.8) + cylinder(0.5, 0, 6, 12, 0.06, { top: "#5E4630", left: "#A8743F", right: "#7E5530" }, id("ond"));
  }
  o += jarAt(0.1, 0.42) + jarAt(0.18, 0.46) + stone2(-0.66, 0.36, 2.8);
  return o;
}
__name(ondinCabin, "ondinCabin");
function raft(u, v, broken = true) {
  let o = shadow(u, v, 0.45, 0.16);
  for (let i = 0; i < 5; i++) {
    const vv = v - 0.2 + i * 0.1, du = broken && i === 3 ? 0.18 : 0;
    o += plank([u - 0.36, vv], [u + 0.36 - du, vv], 0.09, 3.2, DRIFT);
  }
  for (const uu of [u - 0.22, u + 0.18]) o += ln3(P(uu, v - 0.24, 3.4), P(uu, v + 0.24, 3.4), ROPE, 1.2) + ln3(P(uu, v - 0.24, 3.4), P(uu, v + 0.24, 3.4), OUT2, 0.3);
  return o;
}
__name(raft, "raft");
function sylveDebris() {
  let o = ground("terre");
  o += raft(0.12, -0.3) + plank([0.5, 0.08], [0.72, 0.24], 0.08, 2.6, DRIFT);
  o += stick(-0.66, 0.14, 1, -0.26, 0.36, 1, 1.8, "#A8743F") + (() => {
    const [x, y] = P(-0.24, 0.37, 1);
    return `<path d="M${f24(x)},${f24(y)} Q${f24(x + 6)},${f24(y - 1)} ${f24(x + 8)},${f24(y + 2)} Q${f24(x + 5)},${f24(y + 4)} ${f24(x)},${f24(y + 2)} Z" fill="${WOOD.top}"${EDGE}/>`;
  })();
  o += leafPile(-0.42, -0.22, 0.34) + kelp(0.6, 0.6, -6) + stone2(0.74, -0.3, 2.6);
  {
    const [x, y] = P(-0.36, -0.2, 7);
    o += `<path d="M${f24(x - 5)},${f24(y + 1)} Q${f24(x - 1)},${f24(y - 1.6)} ${f24(x + 4)},${f24(y - 1)} Q${f24(x)},${f24(y + 1.4)} ${f24(x - 5)},${f24(y + 1)} Z" fill="#3E7FC1" stroke="${OUT2}" stroke-width="0.55"/>` + ln3([x - 3.6, y + 0.6], [x + 2.6, y - 0.8], "#9CC4EC", 0.4);
  }
  o += mushroom2(-0.74, 0, 0.85);
  return o;
}
__name(sylveDebris, "sylveDebris");
function sylveShelter() {
  let o = ground("terre");
  o += cylinder(-0.5, -0.56, 0, 12, 0.16, { top: "#C9A274", left: "#8A6440", right: "#6A4A30" }, id("syl"));
  {
    const [x, y] = P(-0.5, -0.56, 12);
    o += ell3(x, y, 6, 3, "none", ` stroke="#8A6440" stroke-width="0.7"`) + ell3(x, y, 3, 1.5, "none", ` stroke="#8A6440" stroke-width="0.6"`);
  }
  o += leafPile(-0.5, -0.12, 0.26);
  for (let i = 0; i < 4; i++) {
    const u = -0.38 + i * 0.18;
    o += face([[u, -0.5, 13], [u + 0.15, -0.5, 13], [u + 0.15 + 0.06, 0.06, 0], [u + 0.06, 0.06, 0]], i % 2 ? DRIFT.top : DRIFT.left, EDGE);
  }
  o += tk(P(-0.42, -0.36, 9.2), P(0.36, -0.32, 8.6), "#7A5634", 1.1) + tk(P(-0.36, -0.1, 4.4), P(0.42, -0.06, 3.6), "#7A5634", 1);
  for (const [t, z, n, r0] of [[-0.5, 13, 7, 70], [-0.28, 8, 6, 82], [-0.06, 3.4, 5, 94]]) {
    const a = P(-0.38 + (t + 0.5) * 0.1, t, z), b = P(0.36 + (t + 0.5) * 0.1, t + 0.04, z - 1);
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k;
      o += bigLeaf(x, y + 2, 11, r0 + i % 3 * 12, (i + n) % 2 ? "#6FAE4E" : "#86C06A");
    }
  }
  o += mushroom2(-0.7, -0.7, 0.75) + mushroom2(-0.76, -0.6, 1);
  {
    const [x, y] = P(-0.46, -0.56, 12);
    o += `<path d="M${f24(x + 1)},${f24(y)} Q${f24(x + 2.4)},${f24(y - 5)} ${f24(x + 6.4)},${f24(y - 8)} Q${f24(x + 5)},${f24(y - 3)} ${f24(x + 2)},${f24(y + 0.6)} Z" fill="#3E7FC1" stroke="${OUT2}" stroke-width="0.6"/>` + ln3([x + 2.4, y - 2], [x + 5.2, y - 6.4], "#9CC4EC", 0.4);
  }
  o += raft(0.48, 0.36) + kelp(-0.66, 0.5, 8);
  return o;
}
__name(sylveShelter, "sylveShelter");
function mushroom2(u, v, k = 1) {
  const [x, y] = P(u, v, 0);
  return ell3(x + 0.6 * k, y + 0.4 * k, 2.6 * k, 0.9 * k, "rgba(40,55,20,.22)") + `<rect x="${f24(x - 0.9 * k)}" y="${f24(y - 3.4 * k)}" width="${f24(1.8 * k)}" height="${f24(3.4 * k)}" rx="${f24(0.6 * k)}" fill="#F4ECDA" stroke="${OUT2}" stroke-width="0.5"/><path d="M${f24(x - 2.8 * k)},${f24(y - 3 * k)} Q${f24(x - 2.6 * k)},${f24(y - 6.4 * k)} ${f24(x)},${f24(y - 6.6 * k)} Q${f24(x + 2.6 * k)},${f24(y - 6.4 * k)} ${f24(x + 2.8 * k)},${f24(y - 3 * k)} Q${f24(x)},${f24(y - 2.2 * k)} ${f24(x - 2.8 * k)},${f24(y - 3 * k)} Z" fill="#D9503F" stroke="${OUT2}" stroke-width="0.55"/>` + ell3(x - 1.1 * k, y - 4.8 * k, 0.55 * k, 0.4 * k, "#FFF6EA") + ell3(x + 1.2 * k, y - 4.2 * k, 0.45 * k, 0.35 * k, "#FFF6EA") + ell3(x + 0.1 * k, y - 5.9 * k, 0.4 * k, 0.3 * k, "#FFF6EA");
}
__name(mushroom2, "mushroom");
function sylveCabin() {
  let o = ground("terre");
  o += shadow(-0.68, 0.02, 0.3, 0.18) + box(-0.72, -0.02, -0.64, 0.06, 0, 22, WOOD_DARK);
  {
    const [x, y] = P(-0.68, 0.02, 0);
    o += [[-8, -30, 10], [7, -32, 10.5], [0, -42, 12]].map(([dx, dy, r]) => `<circle cx="${f24(x + dx + r * 0.08)}" cy="${f24(y + dy + r * 0.1)}" r="${f24(r + 0.7)}" fill="${OUT2}"/>`).join("") + [[-8, -30, 10], [7, -32, 10.5], [0, -42, 12]].map(([dx, dy, r]) => `<circle cx="${f24(x + dx)}" cy="${f24(y + dy)}" r="${f24(r)}" fill="${LEAVES.mid}"/><circle cx="${f24(x + dx - r * 0.3)}" cy="${f24(y + dy - r * 0.32)}" r="${f24(r * 0.45)}" fill="${LEAVES.light}"/>`).join("");
  }
  const cu = -0.18, cv = -0.3;
  o += cylinder(cu, cv, 0, 16, 0.34, { top: "#B08A5A", left: "#B08A5A", right: "#86683E" }, id("syl"));
  {
    const [x, y] = P(cu, cv, 0);
    for (let k = 0; k < 9; k++) {
      const a = k / 8 * Math.PI;
      const xx = x - Math.cos(a) * 15.4, yy = y + Math.sin(a) * 7.7;
      o += ln3([xx, yy], [xx, yy - 16], "#6E5230", 1);
    }
    for (let r = 1; r < 4; r++) o += `<path d="M${f24(x - 15.4)},${f24(y - r * 4)} A15.4,7.7 0 0 0 ${f24(x + 15.4)},${f24(y - r * 4)}" fill="none" stroke="#C9A274" stroke-width="1.1"/>`;
  }
  o += face([[cu - 0.06, cv + 0.34, 0], [cu + 0.12, cv + 0.32, 0], [cu + 0.12, cv + 0.32, 11], [cu - 0.06, cv + 0.34, 11]], "#2E2218", EDGE);
  {
    const [x, y] = P(cu, cv, 16);
    o += `<path d="M${f24(x - 18)},${f24(y + 2)} Q${f24(x - 8)},${f24(y - 14)} ${f24(x)},${f24(y - 18)} Q${f24(x + 8)},${f24(y - 14)} ${f24(x + 18)},${f24(y + 2)} Q${f24(x)},${f24(y + 9)} ${f24(x - 18)},${f24(y + 2)} Z" fill="#5E9E4A"${EDGE}/>`;
    for (let i = 0; i < 8; i++) o += bigLeaf(x - 13 + i * 3.7, y - 2 - Math.sin(i / 7 * Math.PI) * 9, 9, 100 + i * 6, i % 2 ? "#6FAE4E" : "#86C06A");
  }
  o += [0, 1, 2].map((i) => stick(0.4, 0.2 + i * 0.04, 2 + i, 0.72, 0.1 + i * 0.04, 2 + i, 1.6, "#8A6440")).join("") + ln3(P(0.56, 0.12, 3), P(0.56, 0.24, 3), ROPE, 1);
  {
    const [x, y] = P(cu, cv, 32);
    o += `<path d="M${f24(x + 2)},${f24(y)} Q${f24(x + 4)},${f24(y - 6)} ${f24(x + 9)},${f24(y - 9)} Q${f24(x + 7)},${f24(y - 3)} ${f24(x + 3)},${f24(y + 1)} Z" fill="#3E7FC1" stroke="${OUT2}" stroke-width="0.6"/>`;
  }
  return o;
}
__name(sylveCabin, "sylveCabin");
function crystal(u, v, k = 1) {
  const [x, y] = P(u, v, 0);
  const prisme = /* @__PURE__ */ __name((dx, h, w, c) => `<path d="M${f24(x + dx - w)},${f24(y)} L${f24(x + dx - w)},${f24(y - h * 0.7)} L${f24(x + dx)},${f24(y - h)} L${f24(x + dx + w)},${f24(y - h * 0.7)} L${f24(x + dx + w)},${f24(y)} Z" fill="${c}" stroke="${OUT2}" stroke-width="0.5" stroke-linejoin="round"/>`, "prisme");
  return ell3(x, y - 2 * k, 5 * k, 3.4 * k, "#8FE3E8", ' opacity=".25"') + prisme(-1.6 * k, 4.4 * k, 1.1 * k, "#6CC7D2") + prisme(1.5 * k, 3.6 * k, 1 * k, "#5AB4C2") + prisme(0, 6 * k, 1.3 * k, "#9BE6EC") + ln3([x - 0.5 * k, y - 1 * k], [x - 0.5 * k, y - 4.6 * k], "#E6FBFC", 0.45);
}
__name(crystal, "crystal");
function galetNook() {
  let o = ground("terre");
  o += boulder(-0.3, -0.5, 0.64, 0.44, 24, STONE, 7, 0.16, 0.8);
  {
    const a = P(-0.14, -0.2, 22), m = P(-0.08, -0.14, 11), b = P(-0.1, -0.1, 1);
    const d = `M${f24(a[0])},${f24(a[1])} L${f24(m[0] - 2.4)},${f24(m[1])} L${f24(m[0] + 1)},${f24(m[1] + 5)} L${f24(b[0])},${f24(b[1])}`;
    o += `<path d="${d}" fill="none" stroke="#8FE3E8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.28"/><path d="${d}" fill="none" stroke="#3C3A36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8FE3E8" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  {
    const [x, y] = P(-0.34, -0.56, 24);
    o += `<path d="M${f24(x - 9)},${f24(y + 1)} Q${f24(x - 6)},${f24(y - 3.4)} ${f24(x - 1)},${f24(y - 2.4)} Q${f24(x + 4)},${f24(y - 4)} ${f24(x + 8)},${f24(y - 0.6)} Q${f24(x + 3)},${f24(y + 2.6)} ${f24(x - 2)},${f24(y + 1.6)} Q${f24(x - 6)},${f24(y + 3)} ${f24(x - 9)},${f24(y + 1)} Z" fill="#8DB35E" stroke="${OUT2}" stroke-width="0.55"/>` + ell3(x - 3, y - 1.4, 2.6, 0.9, "#B5D486");
  }
  for (const [u, v, z] of [[-0.6, -0.3, 12], [-0.44, -0.18, 6], [0.06, -0.4, 16]]) {
    const [x, y] = P(u, v, z);
    o += ell3(x, y, 1.6, 1, "#C9C27A") + ell3(x + 1.4, y + 0.6, 0.9, 0.6, "#B8B26A");
  }
  o += crystal(-0.84, -0.06, 0.7) + crystal(-0.78, 0.04, 1);
  const arc = /* @__PURE__ */ __name((k) => {
    const a = Math.PI * 0.14 + k / 6 * Math.PI * 0.72;
    return [-0.12 + Math.cos(a) * 0.44, -0.2 + Math.sin(a) * 0.34];
  }, "arc");
  const row1 = Array.from({ length: 7 }, (_, k) => arc(k)).sort((p, q) => p[0] + p[1] - q[0] - q[1]);
  for (const [u, v] of row1) o += stone2(u, v, 4.4, STONE);
  for (let k = 0; k < 6; k++) {
    const [u1, v1] = arc(k), [u2, v2] = arc(k + 1);
    const [x, y] = P((u1 + u2) / 2, (v1 + v2) / 2, 5);
    o += ell3(x + 0.4, y + 0.6, 4.2, 2.8, OUT2) + ell3(x, y, 3.8, 2.5, k % 2 ? "#D9D3C4" : "#C3BBA9") + ell3(x - 1.2, y - 0.8, 1.6, 0.9, "#E9E4D8");
  }
  o += box(0.4, 0.2, 0.66, 0.4, 0, 10, { top: "#C9C4BA", left: "#A9A49A", right: "#86817A" }) + box(0.5, 0.5, 0.68, 0.64, 0, 7, STONE);
  {
    const a = P(0.44, 0.26, 10.6), b = P(0.62, 0.32, 10.6);
    o += tk(a, b, "#A8743F", 1.4) + `<rect x="${f24(b[0] - 0.4)}" y="${f24(b[1] - 3.4)}" width="4.6" height="4" rx="1" fill="#A8743F"${EDGE}/>`;
  }
  o += stick(0.44, 0.34, 10.6, 0.52, 0.38, 10.6, 1, "#B8C0C8") + stone2(-0.66, 0.42, 3) + stone2(0.76, -0.2, 2.6);
  return o;
}
__name(galetNook, "galetNook");
function seedSack(u, v) {
  const [x, y] = P(u, v, 0);
  const sac = `M${f24(x - 7)},${f24(y)} Q${f24(x - 8)},${f24(y - 6)} ${f24(x - 2)},${f24(y - 7)} Q${f24(x + 3)},${f24(y - 7.4)} ${f24(x + 5)},${f24(y - 4)} L${f24(x + 7)},${f24(y - 1)} Q${f24(x + 1)},${f24(y + 2.6)} ${f24(x - 7)},${f24(y)} Z`;
  return ell3(x + 1, y + 0.6, 9, 2.6, "rgba(40,55,20,.22)") + `<path d="${sac}" fill="#C8A86E"${EDGE}/>` + [-4, -1, 2].map((d) => `<path d="M${f24(x + d)},${f24(y - 6.4)} Q${f24(x + d - 0.6)},${f24(y - 3)} ${f24(x + d + 0.4)},${f24(y + 0.6)}" fill="none" stroke="#A88A52" stroke-width="0.45"/>`).join("") + `<path d="M${f24(x - 6.6)},${f24(y - 3.6)} Q${f24(x - 2)},${f24(y - 4.6)} ${f24(x + 3.4)},${f24(y - 2.4)}" fill="none" stroke="#A88A52" stroke-width="0.45"/><path d="M${f24(x + 4.4)},${f24(y - 4.6)} L${f24(x + 5.6)},${f24(y - 3.4)} L${f24(x + 4.6)},${f24(y - 2.8)} L${f24(x + 6.4)},${f24(y - 1.6)}" fill="none" stroke="${OUT2}" stroke-width="0.6"/>` + pathTk(`M${f24(x - 6.4)},${f24(y - 4.4)} q-1.6,-1 -2.6,0.2`, "#E2D2A8", 0.5) + [[8, -0.6, "#C9A45A"], [9.6, 0.4, "#8A5A2E"], [8.4, 1.2, "#E2C27A"], [10.8, -0.2, "#7FA65A"], [11.6, 1, "#C9A45A"]].map(([dx, dy, c]) => ell3(x + dx, y + dy, 0.9, 0.6, c, ` stroke="${OUT2}" stroke-width="0.3"`)).join("");
}
__name(seedSack, "seedSack");
function sprout(u, v, k = 1) {
  const [x, y] = P(u, v, 0);
  return ell3(x, y + 0.2, 1.8 * k, 0.6 * k, "rgba(90,70,40,.35)") + ln3([x, y], [x, y - 3.4 * k], "#5E9E3A", 0.8) + bigLeaf(x - 1.5 * k, y - 3.8 * k, 3.2 * k, -55, "#86C06A") + bigLeaf(x + 1.5 * k, y - 3.8 * k, 3.2 * k, 55, "#6FAE4E");
}
__name(sprout, "sprout");
function melisseDebris() {
  let o = ground("terre");
  o += boatHull(0, -0.3, 0.9, 0.24, 9) + seedsSpill(-0.16, -0.3).replace(/<ellipse/g, "<ellipse");
  {
    const [x, y] = P(0.02, -0.3, 9);
    o += [[-6, 0, "#C9A45A"], [-2, 1, "#8A5A2E"], [3, -0.4, "#E2C27A"], [6, 1, "#7FA65A"]].map(([dx, dy, c]) => ell3(x + dx, y + dy, 1.6, 1.1, c, ` stroke="${OUT2}" stroke-width="0.35"`)).join("");
  }
  o += seedSack(-0.5, 0.06) + seedsSpill(0.2, 0.2) + seedsSpill(-0.3, 0.3) + seedTin(0.46, 0.06);
  o += plank([-0.64, 0.4], [-0.3, 0.6], 0.07, 2, WOOD) + stone2(0.7, 0.5, 2.6);
  o += sprout(0.06, 0.34, 1) + sprout(-0.18, 0.46, 0.8) + sprout(0.34, 0.34, 0.9);
  return o;
}
__name(melisseDebris, "melisseDebris");
function melisseShelter() {
  let o = ground("terre");
  o += stone2(-0.42, -0.42, 4) + stone2(0.36, -0.46, 4);
  o += boatHull(0, -0.44, 0.96, 0.22, 12, true);
  {
    const [x, y] = P(-0.02, -0.24, 0);
    o += ell3(x, y, 16, 4, "#2E2218", ' opacity=".55"') + ell3(x - 2, y, 10, 2.6, "#8DAE6A");
  }
  o += seedBed(0.1, 0.36, 0.26, 3) + stick(-0.2, 0.22, 0, -0.2, 0.22, 9, 1.2, "#8A6440") + stick(0.42, 0.18, 0, 0.42, 0.18, 9, 1.2, "#8A6440");
  o += seedTin(-0.56, 0.24);
  return o;
}
__name(melisseShelter, "melisseShelter");
function melisseCabin() {
  let o = ground("terre");
  const u0 = -0.62, u1 = 0.1, v0 = -0.7, v1 = -0.18, h = 18;
  o += box(u0, v0, u1, v1, 0, h, { top: "#C99A62", left: "#B07A45", right: "#8A5A32" }) + planksLeft(u0, u1, v1, 0, h, 3.6) + planksRight(u1, v0, v1, 0, h, 3.6);
  o += face([[-0.18, v1, 0], [0, v1, 0], [0, v1, 13], [-0.18, v1, 13]], "#2E2218", EDGE);
  o += gable(u0, v0, u1, v1, h, 13, { front: THATCH.front, back: THATCH.back, gable: "#B07A45" }, 0.1);
  o += face([[u1, -0.62, 9], [u1, -0.3, 9], [u1 + 0.06, -0.3, 9], [u1 + 0.06, -0.62, 9]], WOOD.top, EDGE);
  for (const [v, c] of [[-0.56, "#E2C27A"], [-0.46, "#7FA65A"], [-0.36, "#C9A45A"]]) {
    const [x, y] = P(u1 + 0.04, v, 9);
    o += `<rect x="${f24(x - 1.8)}" y="${f24(y - 5)}" width="3.6" height="5" rx="1" fill="${c}" stroke="${OUT2}" stroke-width="0.6"/><rect x="${f24(x - 1.3)}" y="${f24(y - 6.2)}" width="2.6" height="1.4" rx="0.4" fill="#B07E4C" stroke="${OUT2}" stroke-width="0.5"/>`;
  }
  o += seedBed(-0.3, 0.3, 0.24, 3) + seedBed(0.4, 0.06, 0.2, 2);
  {
    const [x, y] = P(0.74, -0.16, 0);
    o += ln3([x, y], [x, y - 24], "#5F8F3C", 1.6) + ell3(x - 3, y - 10, 3, 1.4, "#7EC45B", ` stroke="${OUT2}" stroke-width="0.4"`) + Array.from({ length: 10 }, (_, k) => {
      const a = k / 10 * Math.PI * 2;
      return ell3(x + Math.cos(a) * 4, y - 26 + Math.sin(a) * 4, 2.2, 1.2, "#F2C94C", ` stroke="${OUT2}" stroke-width="0.4" transform="rotate(${f24(a * 180 / Math.PI)} ${f24(x + Math.cos(a) * 4)} ${f24(y - 26 + Math.sin(a) * 4)})"`);
    }).join("") + ell3(x, y - 26, 2.8, 2.8, "#8A5A2E", EDGE);
  }
  o += seedTin(-0.66, 0);
  return o;
}
__name(melisseCabin, "melisseCabin");
function tent() {
  const u0 = -0.5, u1 = 0.36, v0 = -0.4, v1 = 0.3, vm = (v0 + v1) / 2;
  let o = ground("terre");
  o += stick(-0.84, -0.05, 0, -0.82, -0.05, 4, 1.4, WOOD_DARK.left) + rope(P(u0 - 0.06, vm, 30), P(-0.84, -0.05, 1), 2, 0.6);
  o += stick(u0 - 0.06, vm, 0, u0 - 0.06, vm, 30, 1.6, WOOD_DARK.left);
  o += gable(u0, v0, u1, v1, 0, 26, { front: "#E6D3A8", back: "#CDB68A", gable: "#2E2218" }, 0.05);
  for (const k of [0.33, 0.66]) {
    const u = u0 + (u1 - u0) * k;
    o += ln3(P(u, vm, 26), P(u, v1 + 0.05, 0), "#B39A6C", 0.7);
  }
  {
    const [x, y] = P(u1 - 0.04, -0.02, 0);
    o += `<rect x="${f24(x - 3.6)}" y="${f24(y - 6)}" width="7.2" height="6" rx="1.6" fill="#8C6A46"${EDGE}/>` + ln3([x - 2, y - 6], [x - 1, y - 8.6], OUT2, 0.6) + ln3([x + 2, y - 6], [x + 1, y - 8.6], OUT2, 0.6);
  }
  o += face([[u1 + 0.05, v0 + 0.02, 0], [u1 + 0.05, vm, 26], [u1 + 0.2, v0 - 0.02, 2]], "#D9C496", EDGE) + face([[u1 + 0.05, v1 - 0.02, 0], [u1 + 0.05, vm, 26], [u1 + 0.22, v1 + 0.04, 2]], "#E6D3A8", EDGE);
  o += stick(u1 + 0.06, vm, 0, u1 + 0.06, vm, 30, 1.6, WOOD_DARK.left);
  o += rope(P(u1 + 0.06, vm, 30), P(0.8, -0.05, 1), 2, 0.6) + stick(0.8, -0.05, 0, 0.82, -0.05, 4, 1.4, WOOD_DARK.left);
  {
    const t = P(u1 + 0.06, vm, 30);
    o += `<path d="M${f24(t[0])},${f24(t[1])} L${f24(t[0] + 8)},${f24(t[1] + 2)} L${f24(t[0])},${f24(t[1] + 4.4)} Z" fill="#6FA3D9"${EDGE}/>`;
  }
  return o;
}
__name(tent, "tent");
function hammock(n = 0) {
  let o = ground("terre");
  const a = [-0.52, -0.22], b = [0.5, 0.02], zTop = 24, zEnd = 18, sag = 9, w0 = 0.15, sway = n ? 0.05 : 0;
  const N2 = 14;
  const at = /* @__PURE__ */ __name((t, dv, dz = 0) => {
    const s = Math.sin(Math.PI * t);
    return P(a[0] + (b[0] - a[0]) * (0.16 + 0.68 * t), a[1] + (b[1] - a[1]) * (0.16 + 0.68 * t) + dv + sway * s, zEnd - sag * s + dz);
  }, "at");
  const wid = /* @__PURE__ */ __name((t) => w0 * Math.pow(Math.sin(Math.PI * t), 0.55), "wid");
  const curve = /* @__PURE__ */ __name((dvf, dzf = () => 0) => Array.from({ length: N2 + 1 }, (_, i) => {
    const t = i / N2;
    return at(t, dvf(t), dzf(t));
  }), "curve");
  const far = curve((t) => -wid(t)), near = curve((t) => wid(t)), belly = curve((t) => 0, (t) => -4.2 * Math.sin(Math.PI * t));
  const d = /* @__PURE__ */ __name((q) => q.map(([x, y], i) => `${i ? "L" : "M"}${f24(x)},${f24(y)}`).join(" "), "d");
  o += stick(a[0], a[1], 0, a[0], a[1], zTop + 2, 2.4, WOOD.left);
  o += rope(P(a[0], a[1], zTop), at(0, 0), 0.6, 0.7);
  o += shadow((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.12, 0.34, 0.14);
  o += `<path d="${d(near)} ${d([...belly].reverse()).replace("M", "L")} Z" fill="${CANVAS.dark}"${EDGE}/>`;
  o += `<path d="${d(far)} ${d([...near].reverse()).replace("M", "L")} Z" fill="${CANVAS.light}"${EDGE}/>`;
  o += `<path d="${d(curve((t) => -wid(t) * 0.4, () => -2.4))}" fill="none" stroke="${CANVAS.mid}" stroke-width="1.6" stroke-linecap="round"/>`;
  o += `<path d="${d(curve((t) => wid(t) * 0.82))}" fill="none" stroke="#C8463A" stroke-width="1.3" stroke-linecap="round"/>`;
  for (const t of [0, 1]) {
    const [x, y] = at(t, 0);
    o += ell3(x, y, 1.6, 1.2, CANVAS.mid, EDGE);
  }
  o += rope(at(1, 0), P(b[0], b[1], zTop), 0.6, 0.7);
  o += stick(b[0], b[1], 0, b[0], b[1], zTop + 2, 2.4, WOOD.left);
  return o;
}
__name(hammock, "hammock");
function clothesline(n = 0) {
  const a = [-0.3, 0.3], b = [0.3, -0.3], w = n ? 1.6 : 0;
  let o = shadow(0, 0, 0.42, 0.12);
  o += stick(a[0], a[1], 0, a[0], a[1], 26, 1.8, DRIFT.left) + stick(b[0], b[1], 0, b[0], b[1], 26, 1.8, DRIFT.left);
  const A = P(a[0], a[1], 23), B = P(b[0], b[1], 23), sag = 4;
  o += rope(A, B, sag * 2, 0.6);
  const at = /* @__PURE__ */ __name((t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + sag * 4 * t * (1 - t)], "at");
  {
    const [x, y] = at(0.24);
    o += `<path d="M${f24(x - 5)},${f24(y)} L${f24(x + 5)},${f24(y)} L${f24(x + 7 + w)},${f24(y + 3.4)} L${f24(x + 4.4 + w * 0.6)},${f24(y + 4.4)} L${f24(x + 4.2 + w)},${f24(y + 12)} L${f24(x - 4.2 + w)},${f24(y + 12)} L${f24(x - 4.4 + w * 0.6)},${f24(y + 4.4)} L${f24(x - 7 + w)},${f24(y + 3.4)} Z" fill="#F2C04B"${EDGE}/>` + ln3([x, y + 1], [x + w * 0.8, y + 11.4], "#CC9A2F", 0.6) + `<path d="M${f24(x - 1.8)},${f24(y)} L${f24(x)},${f24(y + 2.2)} L${f24(x + 1.8)},${f24(y)}" fill="none" stroke="${OUT2}" stroke-width="0.5"/>`;
  }
  {
    const [x, y] = at(0.55);
    o += `<path d="M${f24(x - 4)},${f24(y)} L${f24(x + 4)},${f24(y)} L${f24(x + 4.4 + w)},${f24(y + 12)} L${f24(x + 1 + w)},${f24(y + 12)} L${f24(x + w * 0.5)},${f24(y + 4)} L${f24(x - 1 + w)},${f24(y + 12)} L${f24(x - 4.4 + w)},${f24(y + 12)} Z" fill="#6FA3D9"${EDGE}/>` + ln3([x - 3.4 + w, y + 10.6], [x - 1.6 + w, y + 10.6], "#4F82B8", 0.6);
  }
  {
    const [x, y] = at(0.8);
    o += `<path d="M${f24(x - 3.2)},${f24(y)} L${f24(x + 3.2)},${f24(y)} L${f24(x + 3.4 + w)},${f24(y + 6.4)} L${f24(x + 1 + w)},${f24(y + 5.6)} L${f24(x - 1 + w)},${f24(y + 6.8)} L${f24(x - 3.4 + w)},${f24(y + 6.2)} Z" fill="#F4EEDF"${EDGE}/>`;
  }
  for (const t of [0.24, 0.55, 0.8]) for (const dx of [-2.6, 2.6]) {
    const [x, y] = at(t);
    o += `<rect x="${f24(x + dx - 0.7)}" y="${f24(y - 1.6)}" width="1.4" height="2.8" rx="0.4" fill="#A8743F" stroke="${OUT2}" stroke-width="0.4"/>`;
  }
  return o;
}
__name(clothesline, "clothesline");
function rainBarrel() {
  let o = shadow(0, 0.02, 0.22, 0.18);
  o += stick(-0.2, -0.16, 0, -0.2, -0.16, 30, 1.5, DRIFT.left) + stick(0.16, -0.22, 0, 0.16, -0.22, 28, 1.5, DRIFT.left);
  o += cylinder(0, 0, 0, 16, 0.15, { top: "#4E7E9C", left: "#A8825A", right: "#7A5A3E" }, id("ton"));
  for (const z of [4, 12]) {
    const [x, y] = P(0, 0, z);
    o += `<path d="M${f24(x - 6.8)},${f24(y)} A6.8,3.4 0 0 0 ${f24(x + 6.8)},${f24(y)}" fill="none" stroke="#5E4630" stroke-width="1.1"/>`;
  }
  {
    const [x, y] = P(0, 0, 16);
    o += ell3(x - 1.6, y - 0.2, 2.6, 0.9, "#8FCDE0") + ell3(x + 0.6, y + 0.4, 1.4, 0.5, "none", ' stroke="#BFE6F0" stroke-width="0.5"');
  }
  const t1 = P(-0.2, -0.16, 28), t2 = P(0.16, -0.22, 26), l1 = P(-0.17, 0.1, 22), l2 = P(0.15, 0.04, 21.4), bec = P(0, -0.01, 19);
  o += `<path d="M${f24(t1[0])},${f24(t1[1])} Q${f24((t1[0] + t2[0]) / 2)},${f24((t1[1] + t2[1]) / 2 + 2.4)} ${f24(t2[0])},${f24(t2[1])} L${f24(l2[0])},${f24(l2[1])} Q${f24(bec[0] + 2)},${f24(bec[1] + 1.4)} ${f24(bec[0])},${f24(bec[1] + 1.6)} Q${f24(bec[0] - 2)},${f24(bec[1] + 1.4)} ${f24(l1[0])},${f24(l1[1])} Z" fill="${CANVAS.light}"${EDGE}/>`;
  o += `<path d="M${f24(t1[0] + 1)},${f24(t1[1] + 1.2)} Q${f24(bec[0] - 1.6)},${f24(bec[1] - 2.4)} ${f24(bec[0])},${f24(bec[1] + 1)} Q${f24(bec[0] + 1.6)},${f24(bec[1] - 2.4)} ${f24(t2[0] - 1)},${f24(t2[1] + 1.2)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.7"/>`;
  for (const [l, r] of [[l1, P(-0.11, 0.1, 13)], [l2, P(0.12, 0.08, 13)]]) o += ln3(l, r, ROPE, 0.5) + ell3(l[0], l[1], 0.9, 0.7, ROPE, ` stroke="${OUT2}" stroke-width="0.35"`);
  o += `<path d="M${f24(bec[0])},${f24(bec[1] + 2.6)} q-1.1,1.6 0,2.4 q1.1,-0.8 0,-2.4 Z" fill="#8FCDE0" stroke="${OUT2}" stroke-width="0.4"/>`;
  return o;
}
__name(rainBarrel, "rainBarrel");
function logLying(u0, v0, u1, v1, r, c = { bark: WOOD.left, dark: WOOD.right, end: "#E7C08A", ring: "#C99A62" }) {
  const L = Math.hypot(u1 - u0, v1 - v0), nu = -(v1 - v0) / L, nv = (u1 - u0) / L, k = r / 32;
  const ring = /* @__PURE__ */ __name((u, v, rr = 1) => Array.from({ length: 24 }, (_, i) => {
    const a = i / 24 * Math.PI * 2;
    return P(u + nu * Math.cos(a) * k * rr, v + nv * Math.cos(a) * k * rr, r + Math.sin(a) * r * rr);
  }), "ring");
  const all = [...ring(u0, v0), ...ring(u1, v1)].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = /* @__PURE__ */ __name((o2, a, b) => (a[0] - o2[0]) * (b[1] - o2[1]) - (a[1] - o2[1]) * (b[0] - o2[0]), "cross");
  const lo = [], hi = [];
  for (const p of all) {
    while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (const p of [...all].reverse()) {
    while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop();
    hi.push(p);
  }
  const hull = [...lo.slice(0, -1), ...hi.slice(0, -1)];
  const [fu, fv] = u1 + v1 >= u0 + v0 ? [u1, v1] : [u0, v0], [bu, bv] = fu === u1 ? [u0, v0] : [u1, v1];
  let o = `<polygon points="${pts2(hull)}" fill="${c.bark}"${EDGE}/>`;
  for (const t of [0.3, 0.62]) {
    const a = P(bu + (fu - bu) * t, bv + (fv - bv) * t, r * 1.7), b = P(bu + (fu - bu) * (t + 0.2), bv + (fv - bv) * (t + 0.2), r * 1.62);
    o += ln3(a, b, c.dark, 0.7);
  }
  {
    const a = P(bu + (fu - bu) * 0.1, bv + (fv - bv) * 0.1, r * 0.5), b = P(bu + (fu - bu) * 0.85, bv + (fv - bv) * 0.85, r * 0.45);
    o += ln3(a, b, c.dark, 0.9);
  }
  o += `<polygon points="${pts2(ring(fu, fv))}" fill="${c.end}"${EDGE}/><polygon points="${pts2(ring(fu, fv, 0.55))}" fill="none" stroke="${c.ring}" stroke-width="0.6"/><polygon points="${pts2(ring(fu, fv, 0.2))}" fill="${c.ring}"/>`;
  return o;
}
__name(logLying, "logLying");
var logSeats = /* @__PURE__ */ __name(() => shadow(0, 0.02, 0.4, 0.18) + cylinder(-0.2, -0.08, 0, 9, 0.12, { top: "#E7C08A", left: WOOD.left, right: WOOD.right }, id("ron")) + (() => {
  const [x, y] = P(-0.2, -0.08, 9);
  return ell3(x, y, 3, 1.5, "none", ` stroke="#C99A62" stroke-width="0.6"`) + ell3(x, y, 0.9, 0.45, "#C99A62") + ln3([x + 1.4, y + 0.5], [x + 3.6, y + 1.4], "#B07A45", 0.5);
})() + logLying(0, 0.12, 0.34, 0.22, 4.2), "logSeats");
function net() {
  const a = [-0.34, 0.22], b = [0.3, -0.24];
  let o = shadow(0, 0.02, 0.42, 0.14);
  o += stick(a[0], a[1], 0, a[0], a[1], 25, 1.8, DRIFT.left) + stick(b[0], b[1], 0, b[0], b[1], 25, 1.8, DRIFT.left);
  const A = P(a[0], a[1], 22), B = P(b[0], b[1], 22), A0 = P(a[0], a[1], 4), B0 = P(b[0], b[1], 4);
  const top = /* @__PURE__ */ __name((t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + 12 * t * (1 - t)], "top");
  const bot = /* @__PURE__ */ __name((t) => [A0[0] + (B0[0] - A0[0]) * t, A0[1] + (B0[1] - A0[1]) * t + 1.6 * Math.sin(t * 9)], "bot");
  const N2 = 12, T = Array.from({ length: N2 + 1 }, (_, i) => i / N2);
  const outline2 = [...T.map(top), ...[...T].reverse().map(bot)];
  o += `<polygon points="${pts2(outline2)}" fill="rgba(176,136,80,.16)"/>`;
  const lerp3 = /* @__PURE__ */ __name((p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k], "lerp");
  for (let i = -3; i <= 9; i++) for (const dir of [1, -1]) {
    const t0 = i / 6, t1 = t0 + dir * 0.34;
    const seg = [];
    for (let k = 0; k <= 10; k++) {
      const kk = k / 10, t = t0 + (t1 - t0) * kk;
      if (t < 0 || t > 1) continue;
      seg.push(lerp3(top(t), bot(t), kk));
    }
    if (seg.length > 1) o += `<polyline points="${pts2(seg)}" fill="none" stroke="#9E7A46" stroke-width="0.55"/>`;
  }
  o += `<polyline points="${pts2(T.map(top))}" fill="none" stroke="${OUT2}" stroke-width="1.6"/><polyline points="${pts2(T.map(top))}" fill="none" stroke="${ROPE}" stroke-width="0.7"/>`;
  {
    const [x, y] = P(-0.02, 0.06, 0);
    o += `<path d="M${f24(x - 12)},${f24(y + 1)} Q${f24(x - 8)},${f24(y - 4)} ${f24(x - 2)},${f24(y - 2.6)} Q${f24(x + 4)},${f24(y - 5)} ${f24(x + 10)},${f24(y - 1)} Q${f24(x + 6)},${f24(y + 3.4)} ${f24(x - 2)},${f24(y + 3)} Q${f24(x - 8)},${f24(y + 3.6)} ${f24(x - 12)},${f24(y + 1)} Z" fill="#B8955E"${EDGE}/>` + [[-8, 0.4, 4], [-3, -0.6, 5], [3, -1, 4], [7, 0.4, 3]].map(([dx, dy, l]) => `<path d="M${f24(x + dx - l / 2)},${f24(y + dy)} q${f24(l / 2)},-1.4 ${f24(l)},0" fill="none" stroke="#8C6A3E" stroke-width="0.5"/>`).join("") + ell3(x + 6, y + 0.6, 1.6, 1.1, "#E2A85A", EDGE);
  }
  for (const t of [0.16, 0.38, 0.62, 0.84]) {
    const [x, y] = top(t);
    o += ell3(x, y + 0.4, 2, 1.4, "#E2A85A", EDGE);
  }
  return o;
}
__name(net, "net");
function strawBed() {
  const u0 = -0.32, u1 = 0.3, v0 = -0.15, v1 = 0.15, h = 4.4;
  const q = /* @__PURE__ */ __name((pA, pB, bul) => {
    const m = [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2 + bul];
    return `Q${f24(m[0])},${f24(m[1])} ${f24(pB[0])},${f24(pB[1])}`;
  }, "q");
  const T = [P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)], B = [P(u1, v0, 0), P(u1, v1, 0), P(u0, v1, 0)];
  let o = shadow(0, 0.02, 0.4, 0.16);
  o += `<path d="M${f24(T[3][0])},${f24(T[3][1])} ${q(T[3], T[2], 1.2)} L${f24(B[1][0])},${f24(B[1][1])} ${q(B[1], B[2], 1.6)} Z" fill="#D8BE78"${EDGE}/>`;
  o += `<path d="M${f24(T[2][0])},${f24(T[2][1])} ${q(T[2], T[1], 1)} L${f24(B[0][0])},${f24(B[0][1])} ${q(B[0], B[1], 1.4)} Z" fill="#B99A55"${EDGE}/>`;
  o += `<path d="M${f24(T[0][0])},${f24(T[0][1])} ${q(T[0], T[1], -1)} ${q(T[1], T[2], 0.6)} ${q(T[2], T[3], 1.2)} ${q(T[3], T[0], -0.6)} Z" fill="#E8CF8A"${EDGE}/>`;
  for (const k of [0.3, 0.6]) {
    const [x, y] = P(u0 + (u1 - u0) * k, 0, h + 0.4);
    o += ell3(x, y, 0.7, 0.4, "#B99A55");
  }
  for (const [u, v, z, dx, dy] of [[-0.3, 0.15, 3, -2.6, 1.4], [-0.08, 0.16, 1.6, -1, 2.4], [0.16, 0.16, 2.2, 1.6, 2], [0.3, 0.02, 3, 2.6, 0.4], [0.3, -0.1, 1.4, 2.2, -0.8], [-0.33, -0.06, 4.2, -2.4, -1]]) {
    const [x, y] = P(u, v, z);
    o += ln3([x, y], [x + dx, y + dy], "#C9A85C", 0.6) + ln3([x + 0.6, y], [x + dx * 0.7 + 0.8, y + dy * 0.8 - 0.4], "#E8CF8A", 0.5);
  }
  const c0 = -0.06, c1 = 0.31, hc = h + 0.7, va = v0 - 0.015, vb = v1 + 0.015;
  const scallop = /* @__PURE__ */ __name((pA, pB, n, dip) => {
    let d = "";
    for (let i = 1; i <= n; i++) {
      const t0 = (i - 1) / n, t1 = i / n, m = [pA[0] + (pB[0] - pA[0]) * (t0 + t1) / 2, pA[1] + (pB[1] - pA[1]) * (t0 + t1) / 2 + dip];
      const e = [pA[0] + (pB[0] - pA[0]) * t1, pA[1] + (pB[1] - pA[1]) * t1];
      d += ` Q${f24(m[0])},${f24(m[1])} ${f24(e[0])},${f24(e[1])}`;
    }
    return d;
  }, "scallop");
  const TL = P(c0, va, hc), TR = P(c1, va, hc), BR = P(c1, vb, hc), BL = P(c0, vb, hc);
  const hBR = P(c1 + 0.012, vb + 0.012, 1.4), hBL = P(c0, vb + 0.012, 1.8), hTR = P(c1 + 0.012, va, 2.2);
  o += `<path d="M${f24(BR[0])},${f24(BR[1])} L${f24(TR[0])},${f24(TR[1])} L${f24(hTR[0])},${f24(hTR[1])}${scallop(hTR, hBR, 2, 1.4)} Z" fill="#62789A"${EDGE}/>`;
  o += `<path d="M${f24(BL[0])},${f24(BL[1])} L${f24(BR[0])},${f24(BR[1])} L${f24(hBR[0])},${f24(hBR[1])}${scallop(hBR, hBL, 3, 1.6)} Z" fill="#7F96B2"${EDGE}/>`;
  for (const k of [0.33, 0.66]) {
    const p1 = P(c1 - (c1 - c0) * k, vb, hc - 0.4), p2 = P(c1 - (c1 - c0) * k + 0.01, vb + 0.012, 2.4);
    o += ln3(p1, p2, "#6A82A2", 0.6);
  }
  o += `<path d="M${f24(TL[0])},${f24(TL[1])} Q${f24((TL[0] + TR[0]) / 2)},${f24((TL[1] + TR[1]) / 2 - 1)} ${f24(TR[0])},${f24(TR[1])} L${f24(BR[0])},${f24(BR[1])} L${f24(BL[0])},${f24(BL[1])} Q${f24((BL[0] + TL[0]) / 2 - 0.6)},${f24((BL[1] + TL[1]) / 2)} ${f24(TL[0])},${f24(TL[1])} Z" fill="#93A9C2"${EDGE}/>`;
  for (const [ka, kb, bow] of [[0.32, 0.5, 1.2], [0.62, 0.78, -1]]) {
    const p1 = P(c0 + (c1 - c0) * ka, va + 0.04, hc), p2 = P(c0 + (c1 - c0) * kb, vb - 0.04, hc);
    o += `<path d="M${f24(p1[0])},${f24(p1[1])} Q${f24((p1[0] + p2[0]) / 2 + bow)},${f24((p1[1] + p2[1]) / 2)} ${f24(p2[0])},${f24(p2[1])}" fill="none" stroke="#7F96B2" stroke-width="0.7" stroke-linecap="round"/>`;
  }
  {
    const f0 = P(c0, va, hc + 0.5), f1 = P(c0 + 0.08, va, hc + 0.5), f2_ = P(c0 + 0.08, vb, hc + 0.5), f3 = P(c0, vb, hc + 0.5);
    o += `<path d="M${f24(f0[0])},${f24(f0[1])} L${f24(f1[0])},${f24(f1[1])} Q${f24((f1[0] + f2_[0]) / 2 + 0.6)},${f24((f1[1] + f2_[1]) / 2)} ${f24(f2_[0])},${f24(f2_[1])} L${f24(f3[0])},${f24(f3[1])} Z" fill="#B7C6D8"${EDGE}/><path d="M${f24(f0[0] + 1.2)},${f24(f0[1] + 0.9)} L${f24(f3[0] + 1.2)},${f24(f3[1] - 0.2)}" fill="none" stroke="#C8463A" stroke-width="0.7" stroke-dasharray="1.4 1"/>`;
  }
  {
    const [x, y] = P(u0 + 0.1, 0, h + 2.6);
    o += ell3(x, y, 6.4, 3.4, "#E6DCC3", EDGE) + `<path d="M${f24(x - 4)},${f24(y - 1.6)} Q${f24(x - 1)},${f24(y + 0.4)} ${f24(x + 3)},${f24(y - 2)}" fill="none" stroke="#C2B494" stroke-width="0.6"/>` + ell3(x + 5.4, y - 1.4, 1.4, 1, "#C2B494", EDGE);
  }
  return o;
}
__name(strawBed, "strawBed");
var torch = /* @__PURE__ */ __name((n = 0) => `<g transform="scale(${1 / K_CAMP})">${torche("allumee", n)}</g>`, "torch");
function sos() {
  const toUV = /* @__PURE__ */ __name((sx, sy) => [(sx / 32 + sy / 16) / 2, (sy / 16 - sx / 32) / 2], "toUV");
  const W = 10, H = 7.6, gap = 4.4;
  const S2 = [[1, 0.12], [0.55, 0], [0.05, 0.16], [0.08, 0.42], [0.5, 0.52], [0.94, 0.62], [0.96, 0.88], [0.48, 1], [0, 0.88]];
  const O = Array.from({ length: 17 }, (_, k) => {
    const a = k / 16 * Math.PI * 2 - Math.PI / 2;
    return [0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5];
  });
  const sample = /* @__PURE__ */ __name((poly3, x02) => {
    const q = poly3.map(([a, b]) => [x02 + a * W, b * H]);
    const out = [q[0]];
    let carry = 0;
    for (let i = 1; i < q.length; i++) {
      const [ax, ay] = q[i - 1], [bx, by] = q[i], L = Math.hypot(bx - ax, by - ay);
      let d = 2.6 - carry;
      while (d <= L) {
        out.push([ax + (bx - ax) * d / L, ay + (by - ay) * d / L]);
        d += 2.6;
      }
      carry = L - (d - 2.6);
    }
    return out;
  }, "sample");
  const x0 = -(3 * W + 2 * gap) / 2, y0 = -H / 2;
  const dots = [...sample(S2, x0), ...sample(O, x0 + W + gap).slice(0, -1), ...sample(S2, x0 + 2 * (W + gap))].map(([x, y]) => [x, y + y0]);
  let o = disc(0, 0, 0, 0.62, "rgba(232,212,160,.55)");
  dots.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => {
    const [u, v] = toUV(x, y);
    o += stone2(u, v, 1.15 + i % 3 * 0.12);
  });
  return o;
}
__name(sos, "sos");
var crateStack = /* @__PURE__ */ __name(() => shadow(0, 0, 0.3, 0.16) + crate(-0.06, -0.06, 0.15, 12) + crate(0.2, 0.14, 0.12, 9) + crate(-0.04, -0.08, 0.11, 8, 12) + (() => {
  const [x, y] = P(0.2, 0.26, 4.6);
  return `<g transform="translate(${f24(x)} ${f24(y)}) matrix(1 0.5 0 1 0 0)"><path d="M-3.2,-0.6 Q-1.6,-1.8 0,-0.2 Q1.6,-1.8 3.2,-0.6 Q1.4,-0.4 0.6,0.6 L1.4,2.4 L0,1.4 L-1.4,2.4 L-0.6,0.6 Q-1.4,-0.4 -3.2,-0.6 Z" fill="#F4EEDF" opacity=".85"/></g>`;
})(), "crateStack");
function workbench() {
  const z = 11, t = 2.2, zt = z + t;
  const u0 = -0.46, u1 = 0.46, v0 = -0.17, v1 = 0.17;
  let o = shadow(0, 0, 0.55, 0.18);
  o += crate(-0.27, 0, 0.13, z) + crate(0.27, 0, 0.13, z);
  o += face([[u0, v1, z], [u1, v1, z], [u1, v1, zt], [u0, v1, zt]], HULL.cabinS, EDGE) + face([[u1, v0, z], [u1, v1, z], [u1, v1, zt], [u1, v0, zt]], HULL.dark, EDGE) + face([[u0, v0, zt], [u1, v0, zt], [u1, v1, zt], [u0, v1, zt]], HULL.cabin, EDGE);
  for (const [a, b] of [[-0.4, -0.04], [0.04, 0.4]]) {
    o += face([[a, -0.11, zt], [b, -0.11, zt], [b, 0.11, zt], [a, 0.11, zt]], "#EAE5D9", ' stroke="rgba(60,40,20,.4)" stroke-width="0.6" stroke-linejoin="round"') + ln3(P(a + 0.01, 0.105, zt), P(b - 0.01, 0.105, zt), "rgba(255,255,255,.9)", 0.7);
  }
  for (const [u, v, k] of [[-0.43, 0.13, 1], [0.12, -0.15, 0.8], [0.44, 0.06, 0.7]]) o += face([[u, v, zt], [u + 0.05 * k, v - 0.01, zt], [u + 0.04 * k, v + 0.03 * k, zt], [u - 0.01, v + 0.025 * k, zt]], HULL.deck);
  for (const u of [-0.3, 0.3]) o += face([[u - 0.04, v0 + 0.01, zt], [u + 0.04, v0 + 0.01, zt], [u + 0.04, v0 + 0.04, zt], [u - 0.04, v0 + 0.04, zt]], "#C9A24A", EDGE);
  {
    const [x, y] = P(-0.02, v1, z + t / 2);
    o += ell3(x, y, 1.6, 1.1, "#C9A24A", EDGE) + tk([x - 0.4, y + 0.6], [x - 2.2, y + 2.4], "#C9A24A", 0.9) + ell3(x - 2.6, y + 2.8, 1.5, 1.1, "#E2C26A", EDGE);
  }
  o += disc(0.22, 0, zt, 0.085, "#C9A24A", EDGE) + disc(0.22, 0, zt, 0.06, HULL.glass, EDGE);
  {
    const [x, y] = P(0.2, -0.02, zt);
    o += ln3([x - 1.2, y - 1], [x + 0.4, y - 1.4], "rgba(255,255,255,.75)", 0.7);
  }
  {
    const [x, y] = P(0.37, 0, zt);
    o += ell3(x, y, 2.2, 1.3, "#C9A24A", EDGE) + `<polyline points="${pts2([[x - 0.8, y - 0.6], [x + 0.8, y - 0.6], [x - 0.3, y + 0.7]])}" fill="none" stroke="${OUT2}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  o += gear(-0.3, -0.03, 2.8, zt + 0.4, 0.3);
  {
    const a = P(-0.2, 0.08, zt + 1), b = P(-0.06, -0.08, zt + 1);
    o += tk(a, b, "#A8743F", 1.2) + `<rect x="${f24(b[0] - 1.4)}" y="${f24(b[1] - 3)}" width="2.8" height="5.4" rx="0.6" fill="${IRON2.left}"${EDGE}/>`;
  }
  o += screwTin(0.12, 0.36);
  for (const [u, v] of [[-0.14, 0.3], [-0.04, 0.4], [0.5, 0.22]]) {
    const [x, y] = P(u, v, 0);
    o += ell3(x, y, 1, 0.6, "#B8C0C8", ` stroke="${OUT2}" stroke-width="0.4"`);
  }
  return o;
}
__name(workbench, "workbench");
function soupBowl(n = 0) {
  let o = shadow(0, 0, 0.42, 0.16);
  const [sx, sy] = P(0, 0, 0);
  o += ell3(sx, sy + 0.4, 19.6, 9.6, OUT2) + ell3(sx, sy, 18.8, 8.8, STONE.right) + ell3(sx - 0.4, sy - 2.2, 18.2, 8.2, STONE.top, EDGE) + ell3(sx - 6, sy - 3.6, 5, 1.6, "rgba(255,255,255,.35)");
  {
    const [x2, y] = P(0.26, -0.04, 3), g = id("bolg"), fl = [0, 0.6, -0.5][n % 3], h = [4.2, 4.8, 3.8][n % 3];
    o += `<defs><radialGradient id="${g}"><stop offset="0" stop-color="#FFD98A" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f24(x2)}" cy="${f24(y - 9)}" rx="14" ry="12" fill="url(#${g})"/>`;
    o += `<rect x="${f24(x2 - 1.5)}" y="${f24(y - 6.4)}" width="3" height="6.4" rx="0.8" fill="#F4ECD6"${EDGE}/>` + ell3(x2, y - 6.4, 1.5, 0.6, "#E6DCC4", EDGE) + ln3([x2, y - 6.6], [x2, y - 7.6], OUT2, 0.5);
    o += `<path d="M${f24(x2 - 1)},${f24(y - 7.4)} Q${f24(x2 - 1.2 + fl)},${f24(y - 7.4 - h * 0.6)} ${f24(x2 + fl)},${f24(y - 7.4 - h)} Q${f24(x2 + 1.2 + fl)},${f24(y - 7.4 - h * 0.6)} ${f24(x2 + 1)},${f24(y - 7.4)} Z" fill="#FFB347"${EDGE}/>` + ell3(x2 + fl * 0.4, y - 8.4, 0.5, 1, "#FFF3B0");
  }
  const [x, y0] = P(-0.02, 0.06, 3), rx = 8, ry = 4, yr = y0 - 7;
  o += `<path d="M${f24(x - rx)},${f24(yr)} C${f24(x - rx)},${f24(yr + 5.6)} ${f24(x - rx * 0.45)},${f24(yr + 7.6)} ${f24(x)},${f24(yr + 7.6)} C${f24(x + rx * 0.45)},${f24(yr + 7.6)} ${f24(x + rx)},${f24(yr + 5.6)} ${f24(x + rx)},${f24(yr)} Z" fill="#A8743F"${EDGE}/><path d="M${f24(x + rx * 0.2)},${f24(yr + 7.4)} C${f24(x + rx * 0.6)},${f24(yr + 7)} ${f24(x + rx)},${f24(yr + 5.2)} ${f24(x + rx)},${f24(yr)} L${f24(x + rx * 0.62)},${f24(yr + 1)} Z" fill="rgba(70,40,20,.22)"/>` + ln3([x - rx * 0.7, yr + 2.6], [x - rx * 0.5, yr + 5], "rgba(255,255,255,.3)", 0.8);
  o += ell3(x, yr, rx, ry, "#C9935A", EDGE) + ell3(x, yr + 0.5, rx * 0.8, ry * 0.7, "#E8A04A", ` stroke="${OUT2}" stroke-width="0.5"`);
  o += `<path d="M${f24(x - 2.4)},${f24(yr + 0.6)} Q${f24(x - 0.6)},${f24(yr - 0.8)} ${f24(x + 0.8)},${f24(yr + 0.4)} Q${f24(x + 1.6)},${f24(yr + 1.4)} ${f24(x + 0.2)},${f24(yr + 1.4)}" fill="none" stroke="#FFF2D6" stroke-width="0.8" stroke-linecap="round"/>` + [[-3.6, 0.2], [2.8, -0.4], [-1, 1.6]].map(([dx, dy]) => ell3(x + dx, yr + 0.5 + dy, 0.6, 0.35, "#6E9E50")).join("");
  o += tk([x + 2.4, yr + 0.4], [x + 9.6, yr - 5.4], "#C9935A", 1.1) + ell3(x + 2, yr + 0.6, 1.6, 0.9, "#C9935A", EDGE);
  {
    const [x2, y] = P(-0.12, 0.26, 3);
    o += pathTk(`M${f24(x2 + 3)},${f24(y + 1.6)} Q${f24(x2 + 1)},${f24(y + 0.4)} ${f24(x2 - 1)},${f24(y - 1.2)}`, "#5C8A45", 0.6) + [0, 72, 144, 216, 288].map((a) => ell3(x2 - 1 + Math.cos(a * Math.PI / 180) * 1.6, y - 1.2 + Math.sin(a * Math.PI / 180) * 0.9, 1.1, 0.7, "#FFFFFF", ` stroke="${OUT2}" stroke-width="0.35"`)).join("") + ell3(x2 - 1, y - 1.2, 0.8, 0.55, "#F2C94C", ` stroke="${OUT2}" stroke-width="0.35"`);
  }
  for (const [i, dx] of [-3, 0.4, 3.6].entries()) {
    const ph = (n + i) % 3 - 1, top = yr - 13 - i % 2 * 3;
    o += `<path d="M${f24(x + dx)},${f24(yr - 1.4)} Q${f24(x + dx + 2.4 * ph)},${f24(yr - 5)} ${f24(x + dx)},${f24(yr - 8.4)} Q${f24(x + dx - 2.4 * ph)},${f24(yr - 11.4)} ${f24(x + dx + 0.6 * ph)},${f24(top)}" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" opacity="${[0.75, 0.6, 0.7][i]}"/>`;
  }
  return o;
}
__name(soupBowl, "soupBowl");
var CAMP = {
  hirondelle: { frame: { x: -88, y: -100, w: 176, h: 150 }, n: 1, label: "Épave de l'Hirondelle", step: "T1", draw: /* @__PURE__ */ __name(() => hirondelle(), "draw") },
  aster_debris: { frame: BUILDING_BOX, n: 1, label: "Aster · débris", step: "T2", draw: /* @__PURE__ */ __name(() => asterDebris(), "draw") },
  aster_abri: { frame: BUILDING_BOX, n: 1, label: "Aster · abri", step: "I", draw: /* @__PURE__ */ __name(() => asterShelter(), "draw") },
  aster_cabanon: { frame: BUILDING_BOX, n: 2, label: "Aster · cabanon", step: "II", draw: /* @__PURE__ */ __name((n) => asterCabin(n), "draw") },
  cannelle_debris: { frame: BUILDING_BOX, n: 3, label: "Cannelle · cuisine de l'épave", step: "T3", draw: /* @__PURE__ */ __name((n) => cannelleKitchen(n), "draw") },
  rivet_debris: { frame: BUILDING_BOX, n: 1, label: "Rivet · débris", step: "T4", draw: /* @__PURE__ */ __name(() => rivetDebris(), "draw") },
  rivet_abri: { frame: BUILDING_BOX, n: 1, label: "Rivet · abri", step: "I", draw: /* @__PURE__ */ __name(() => rivetShelter(), "draw") },
  rivet_cabanon: { frame: BUILDING_BOX, n: 1, label: "Rivet · cabanon", step: "II", draw: /* @__PURE__ */ __name(() => rivetCabin(), "draw") },
  ondin_debris: { frame: BUILDING_BOX, n: 2, label: "Ondin · débris", step: "T5", draw: /* @__PURE__ */ __name((n) => ondinDebris(n), "draw") },
  ondin_abri: { frame: BUILDING_BOX, n: 2, label: "Ondin · abri", step: "I", draw: /* @__PURE__ */ __name((n) => ondinShelter(n), "draw") },
  ondin_cabanon: { frame: BUILDING_BOX, n: 2, label: "Ondin · cabanon", step: "II", draw: /* @__PURE__ */ __name((n) => ondinCabin(n), "draw") },
  sylve_debris: { frame: BUILDING_BOX, n: 1, label: "Sylve · débris", step: "I", draw: /* @__PURE__ */ __name(() => sylveDebris(), "draw") },
  sylve_abri: { frame: BUILDING_BOX, n: 1, label: "Sylve · abri", step: "I", draw: /* @__PURE__ */ __name(() => sylveShelter(), "draw") },
  sylve_cabanon: { frame: BUILDING_BOX, n: 1, label: "Sylve · cabanon", step: "II", draw: /* @__PURE__ */ __name(() => sylveCabin(), "draw") },
  galet_debris: { frame: BUILDING_BOX, n: 1, label: "Galet · muret de la Fissure", step: "II", draw: /* @__PURE__ */ __name(() => galetNook(), "draw") },
  melisse_debris: { frame: BUILDING_BOX, n: 1, label: "Mélisse · débris", step: "III", draw: /* @__PURE__ */ __name(() => melisseDebris(), "draw") },
  melisse_abri: { frame: BUILDING_BOX, n: 1, label: "Mélisse · abri", step: "III", draw: /* @__PURE__ */ __name(() => melisseShelter(), "draw") },
  melisse_cabanon: { frame: BUILDING_BOX, n: 1, label: "Mélisse · cabanon", step: "III", draw: /* @__PURE__ */ __name(() => melisseCabin(), "draw") },
  tente: { frame: BUILDING_BOX, n: 1, label: "Tente de voyageur", step: "IV", draw: /* @__PURE__ */ __name(() => tent(), "draw") },
  hamac: { frame: BUILDING_BOX, n: 2, label: "Hamac", step: "IV", draw: /* @__PURE__ */ __name((n) => hammock(n), "draw") },
  etendoir: { frame: PROP_BOX, n: 2, label: "Étendoir", step: "T3", draw: /* @__PURE__ */ __name((n) => clothesline(n), "draw") },
  tonneau: { frame: PROP_BOX, n: 1, label: "Tonneau d'eau de pluie", step: "T5", draw: /* @__PURE__ */ __name(() => rainBarrel(), "draw") },
  rondins: { frame: PROP_BOX, n: 1, label: "Rondins", step: "T3", draw: /* @__PURE__ */ __name(() => logSeats(), "draw") },
  filet: { frame: PROP_BOX, n: 1, label: "Filet tendu", step: "T2", draw: /* @__PURE__ */ __name(() => net(), "draw") },
  paillasse: { frame: PROP_BOX, n: 1, label: "Paillasse", step: "T5", draw: /* @__PURE__ */ __name(() => strawBed(), "draw") },
  torche: { frame: PROP_BOX, n: 3, label: "Torche de bois flotté", step: "I", draw: /* @__PURE__ */ __name((n) => torch(n), "draw") },
  sos: { frame: PROP_BOX, n: 1, label: "SOS en galets", step: "T2", draw: /* @__PURE__ */ __name(() => sos(), "draw") },
  caisses: { frame: PROP_BOX, n: 1, label: "Pile de caisses", step: "T2", draw: /* @__PURE__ */ __name(() => crateStack(), "draw") },
  etabli: { frame: PROP_BOX, n: 1, label: "Établi de Rivet", step: "T4", draw: /* @__PURE__ */ __name(() => workbench(), "draw") },
  bol: { frame: PROP_BOX, n: 3, label: "Bol de soupe « pour la Dame »", step: "III", draw: /* @__PURE__ */ __name((n) => soupBowl(n), "draw") }
};
for (const a of Object.values(CAMP)) {
  const dessin = a.draw;
  a.draw = (n) => {
    uid = 0;
    return dessin(n);
  };
}

// atelier/ruines.mjs
var uid2 = 0;
var id2 = /* @__PURE__ */ __name((p) => `r${p}${uid2++}`, "id");
var ANC = { top: "#DDD6C6", left: "#C1B9A7", right: "#9A9281" };
var ANC_DARK = { top: "#C9C1AF", left: "#ABA290", right: "#857D6D" };
var ROCK2 = { top: "#A9A59B", left: "#8F8B82", right: "#6E6A62" };
var MOSS = "#8FAE5A";
var IVY = "#5E8F3C";
var IVY_LIGHT = "#7FB04F";
var GLOW = "120,235,215";
var lerp2 = /* @__PURE__ */ __name((a, b, t) => a + (b - a) * t, "lerp");
var GLYPHS = [
  "M0,0 m-1.6,0 a1.6,1.6 0 1 1 1.6,1.6 a2.6,2.6 0 1 1 -2.6,-2.6",
  "M0,3 L0,-3 M0,-0.8 L2,-2.8 M0,1.2 L-2,-0.8",
  "M-2.4,0 Q0,-2.4 2.4,0 Q0,2.4 -2.4,0 Z M0,0 m-0.5,0 a0.5,0.5 0 1 0 1,0 a0.5,0.5 0 1 0 -1,0",
  "M-2,-2.6 L0.6,-0.4 L-0.8,0.4 L2,2.6"
];
function rune(x, y, k, o = 0, s = 1, skew = 0) {
  const d = GLYPHS[k % GLYPHS.length];
  const m = `matrix(${s} ${f24(0.5 * skew * s)} 0 ${s} ${f24(x)} ${f24(y)})`;
  const carved = `<path d="${d}" fill="none" stroke="rgba(70,58,44,.55)" stroke-width="${f24(1.1 / s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lit2 = o > 0.02 ? `<path d="${d}" fill="none" stroke="rgba(${GLOW},${f24(o * 0.35)})" stroke-width="${f24(3 / s)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="rgba(${GLOW},${f24(o)})" stroke-width="${f24(0.9 / s)}" stroke-linecap="round" stroke-linejoin="round"/>` : "";
  return `<g transform="${m}">${carved}${lit2}</g>`;
}
__name(rune, "rune");
var tuft2 = /* @__PURE__ */ __name((x, y, s = 1, c = "#7FA048") => `<path d="M${f24(x - 3 * s)},${f24(y)} Q${f24(x - 2 * s)},${f24(y - 4 * s)} ${f24(x - 3.4 * s)},${f24(y - 6 * s)} M${f24(x)},${f24(y)} Q${f24(x + 0.6 * s)},${f24(y - 5 * s)} ${f24(x - 0.4 * s)},${f24(y - 7.4 * s)} M${f24(x + 3 * s)},${f24(y)} Q${f24(x + 2.2 * s)},${f24(y - 4 * s)} ${f24(x + 3.8 * s)},${f24(y - 5.6 * s)}" fill="none" stroke="${c}" stroke-width="${f24(1.1 * s)}" stroke-linecap="round"/>`, "tuft");
var leaf2 = /* @__PURE__ */ __name((x, y, r, rot, c = IVY) => `<g transform="translate(${f24(x)} ${f24(y)}) rotate(${rot})"><path d="M0,${f24(-r)} Q${f24(r * 0.9)},${f24(-r * 0.2)} 0,${f24(r)} Q${f24(-r * 0.9)},${f24(-r * 0.2)} 0,${f24(-r)} Z" fill="${c}" stroke="${OUT2}" stroke-width="0.4"/></g>`, "leaf");
function ivy(a, b, n = 6, seed = 1) {
  const pt = /* @__PURE__ */ __name((t) => [lerp2(a[0], b[0], t) + Math.sin(t * 9 + seed) * 2.2, lerp2(a[1], b[1], t)], "pt");
  let d = `M${f24(a[0])},${f24(a[1])}`;
  for (let i = 1; i <= 12; i++) {
    const [x, y] = pt(i / 12);
    d += ` L${f24(x)},${f24(y)}`;
  }
  let o = `<path d="${d}" fill="none" stroke="#4E6E32" stroke-width="0.8" stroke-linecap="round"/>`;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, [x, y] = pt(t);
    o += leaf2(x + (i % 2 ? 2 : -2), y, 1.9, i % 2 ? 40 : -40, i % 3 ? IVY : IVY_LIGHT);
  }
  return o;
}
__name(ivy, "ivy");
var mossPad = /* @__PURE__ */ __name((x, y, rx, ry) => ell3(x, y, rx, ry, MOSS, ` stroke="${OUT2}" stroke-width="0.4"`) + ell3(x - rx * 0.25, y - ry * 0.25, rx * 0.45, ry * 0.4, "#A9C46E"), "mossPad");
function block(u0, v0, u1, v1, z0, z1, c = ANC, course = 6) {
  let o = box(u0, v0, u1, v1, z0, z1, c);
  for (let z = z0 + course, k = 0; z < z1 - 1; z += course, k++) {
    o += ln3(P(u0, v1, z), P(u1, v1, z), "rgba(90,75,55,.35)", 0.6) + ln3(P(u1, v1, z), P(u1, v0, z), "rgba(60,50,35,.35)", 0.6);
  }
  for (let z = z0, k = 0; z < z1 - 2; z += course, k++) {
    const t = k % 2 ? 0.35 : 0.7, zt = Math.min(z + course, z1);
    o += ln3(P(lerp2(u0, u1, t), v1, z), P(lerp2(u0, u1, t), v1, zt), "rgba(90,75,55,.3)", 0.6);
    o += ln3(P(u1, lerp2(v0, v1, 1 - t), z), P(u1, lerp2(v0, v1, 1 - t), zt), "rgba(60,50,35,.3)", 0.6);
  }
  return o;
}
__name(block, "block");
function fallenBlock(u, v, s, h) {
  return shadow(u, v, s * 1.3, 0.2) + block(u - s, v - s * 0.7, u + s, v + s * 0.7, 0, h, ANC_DARK, 99) + mossPad(...P(u - s * 0.2, v - s * 0.1, h), 3, 1.4);
}
__name(fallenBlock, "fallenBlock");
function column(u, v, z0, z1, r, top = "flat", seed = 1) {
  const [x0, y0] = P(u, v, z0), rx = r * 64 * Math.SQRT1_2, ry = r * 32 * Math.SQRT1_2;
  let o = cylinder(u, v, z0, z1, r, ANC, id2("col"));
  for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) o += ln3([x0 + rx * k, y0 + ry * Math.sqrt(1 - k * k) - 1], [x0 + rx * k, y0 - (z1 - z0) + ry * Math.sqrt(1 - k * k) + (top === "broken" ? 3 : 1)], k < 0 ? "rgba(255,255,255,.28)" : "rgba(60,50,35,.28)", 0.8);
  if (top === "broken") {
    const yT = y0 - (z1 - z0);
    const jag = Array.from({ length: 10 }, (_, i) => {
      const a = Math.PI + i / 9 * Math.PI, h = Math.abs(Math.sin(i * 1.7 + seed)) * 1.2 + (i < 4 ? 1.8 : i < 6 ? 0.9 : 0);
      return [x0 + Math.cos(a) * rx, yT + Math.sin(a) * ry - h];
    });
    const front = `M${f24(x0 - rx)},${f24(yT)} A${f24(rx)},${f24(ry)} 0 0 0 ${f24(x0 + rx)},${f24(yT)}`;
    o += `<path d="${front} L${pts2([...jag].reverse()).split(" ").join(" L")} Z" fill="${ANC.top}"${EDGE}/>`;
    o += `<path d="M${pts2(jag.slice(2, 7)).split(" ").join(" L")}" fill="none" stroke="rgba(60,50,35,.35)" stroke-width="0.6"/>`;
  } else if (top === "cap") {
    o += cylinder(u, v, z1, z1 + 3, r * 1.25, ANC, id2("ech"));
    o += box(u - r * 1.25, v - r * 1.25, u + r * 1.25, v + r * 1.25, z1 + 3, z1 + 6, ANC);
  }
  return o;
}
__name(column, "column");
var outline = /* @__PURE__ */ __name((list, closed = false) => `<path d="M${pts2(list.map((p) => P(...p))).split(" ").join(" L")}${closed ? " Z" : ""}" fill="none" stroke="${OUT2}" stroke-width="0.72" stroke-linejoin="round" stroke-linecap="round"/>`, "outline");
var JOINT = "rgba(90,75,55,.32)";
var JOINT_D = "rgba(55,45,32,.32)";
function wallU(a0, seg, v0, th, hs, c = ANC, course = 6) {
  const v1 = v0 + th, parts = [];
  hs.forEach((h, i) => {
    if (!h) return;
    const a = a0 + i * seg, b = a + seg, hp = i ? hs[i - 1] : 0, hn = i < hs.length - 1 ? hs[i + 1] : 0;
    let d = face([[a, v1, 0], [b, v1, 0], [b, v1, h], [a, v1, h]], c.left);
    for (let z = course; z < h - 1; z += course) d += ln3(P(a, v1, z), P(b, v1, z), JOINT, 0.6);
    for (let z = 0, k = 0; z < h - 1; z += course, k++) for (let uj = a0 + (k % 2 ? 0.06 : 0.12); uj < b - 0.01; uj += 0.13) if (uj > a + 0.01) d += ln3(P(uj, v1, z), P(uj, v1, Math.min(z + course, h)), JOINT, 0.6);
    if (hn < h) {
      const q = [[b, v1, hn], [b, v1, h], [b, v0, h], [b, v0, hn]];
      d += face(q, c.right) + outline(q, true);
      for (let z = Math.ceil(hn / course) * course; z < h - 1; z += course) if (z > hn) d += ln3(P(b, v1, z), P(b, v0, z), JOINT_D, 0.6);
    }
    const top = [[a, v0, h], [b, v0, h], [b, v1, h], [a, v1, h]];
    d += face(top, c.top) + outline(top, true) + outline([[a, v1, 0], [b, v1, 0]]);
    if (hp < h) d += outline([[a, v1, hp], [a, v1, h]]);
    parts.push({ k: (a + b) / 2 + v0 + th / 2, d });
  });
  return parts;
}
__name(wallU, "wallU");
function wallV(b0, seg, u0, th, hs, c = ANC, course = 6) {
  const u1 = u0 + th, parts = [];
  hs.forEach((h, i) => {
    if (!h) return;
    const a = b0 + i * seg, b = a + seg, hp = i ? hs[i - 1] : 0, hn = i < hs.length - 1 ? hs[i + 1] : 0;
    let d = face([[u1, a, 0], [u1, b, 0], [u1, b, h], [u1, a, h]], c.right);
    for (let z = course; z < h - 1; z += course) d += ln3(P(u1, a, z), P(u1, b, z), JOINT_D, 0.6);
    for (let z = 0, k = 0; z < h - 1; z += course, k++) for (let vj = b0 + (k % 2 ? 0.06 : 0.12); vj < b - 0.01; vj += 0.13) if (vj > a + 0.01) d += ln3(P(u1, vj, z), P(u1, vj, Math.min(z + course, h)), JOINT_D, 0.6);
    if (hn < h) {
      const q = [[u0, b, hn], [u1, b, hn], [u1, b, h], [u0, b, h]];
      d += face(q, c.left) + outline(q, true);
      for (let z = Math.ceil(hn / course) * course; z < h - 1; z += course) if (z > hn) d += ln3(P(u0, b, z), P(u1, b, z), JOINT, 0.6);
    }
    const top = [[u0, a, h], [u1, a, h], [u1, b, h], [u0, b, h]];
    d += face(top, c.top) + outline(top, true) + outline([[u1, a, 0], [u1, b, 0]]);
    if (hp < h) d += outline([[u1, a, hp], [u1, a, h]]);
    parts.push({ k: u0 + th / 2 + (a + b) / 2, d });
  });
  return parts;
}
__name(wallV, "wallV");
function ruinHouse() {
  const u0 = -0.82, v0 = -0.82, th = 0.14, seg = 0.14;
  let o = shadow(0, 0.05, 1.02, 0.14) + disc(0.02, 0.05, 0, 0.92, "rgba(150,170,110,.28)");
  const parts = [...wallU(u0 + th, seg, v0, th, [38, 34, 36, 27, 22, 13, 8, 4]), ...wallV(v0, seg, u0, th, [42, 36, 38, 0, 0, 34, 24, 15, 7])];
  {
    const a = v0 + 3 * seg, b = v0 + 5 * seg;
    const [x, y] = P(u0 + th, (a + b) / 2, 28.4);
    parts.push({ k: u0 + th / 2 + (a + b) / 2, d: box(u0, a, u0 + th, b, 25, 31.6, ANC_DARK) + rune(x, y, 0, 0, 0.9, -1) });
  }
  parts.push({ k: u0 + v0 + 4 * seg - 0.01, d: face([[u0, v0 + 3 * seg, 0.4], [u0 + th + 0.05, v0 + 3 * seg, 0.4], [u0 + th + 0.05, v0 + 5 * seg, 0.4], [u0, v0 + 5 * seg, 0.4]], ANC_DARK.top, EDGE) });
  parts.sort((p, q) => p.k - q.k).forEach((p) => {
    o += p.d;
  });
  o += mossPad(...P(u0 + th + 1.5 * seg, v0 + th / 2, 34), 2.6, 1.2) + mossPad(...P(u0 + th / 2, v0 + 1.5 * seg, 36), 2.4, 1.1) + mossPad(...P(u0 + th + 4.5 * seg, v0 + th / 2, 22), 2.2, 1);
  o += ivy(P(u0 + th + 0.3, v0 + th, 0), P(u0 + th + 0.36, v0 + th, 30), 7, 2) + ivy(P(u0 + th, v0 + 7.5 * seg, 0), P(u0 + th, v0 + 7.2 * seg, 14), 4, 5);
  for (const [u, v, s] of [[-0.42, -0.4, 0.13], [-0.14, -0.44, 0.12], [-0.44, -0.1, 0.12], [-0.12, -0.12, 0.13], [0.16, -0.38, 0.11], [-0.4, 0.2, 0.1], [0.14, 0.02, 0.1]]) {
    o += face([[u - s, v - s, 0], [u + s, v - s, 0], [u + s, v + s, 0], [u - s, v + s, 0]], u + v < -0.5 ? ANC_DARK.top : ANC.top, ` stroke="rgba(90,75,55,.5)" stroke-width="0.6"`);
  }
  for (const [u, v] of [[-0.28, -0.26], [0.02, -0.3], [-0.3, 0.06], [0, 0.04], [0.28, -0.2]]) o += tuft2(...P(u, v, 0), 0.7);
  {
    const [x, y] = P(u0 + th + 0.12, v0 + th + 0.12, 0);
    o += tk([x, y], [x + 1, y - 14], WOOD_DARK.left, 1.2) + ell3(x - 3, y - 16, 6, 5, IVY, EDGE) + ell3(x + 4, y - 18, 5.4, 4.6, IVY_LIGHT, EDGE) + ell3(x, y - 22, 5, 4.2, "#8FC060", EDGE);
  }
  o += fallenBlock(0.28, 0.22, 0.14, 7);
  const front = [...wallU(u0, seg, 0.6, th, [6, 4, 7, 3, 0, 5], ANC, 99), ...wallV(v0 + th, seg, 0.6, th, [5, 7, 3, 0, 4], ANC, 99)];
  front.sort((p, q) => p.k - q.k).forEach((p) => {
    o += p.d;
  });
  for (const [u, v] of [[0.7, 0.3], [-0.2, 0.76], [0.4, 0.74]]) o += tuft2(...P(u, v, 0), 0.8);
  return o;
}
__name(ruinHouse, "ruinHouse");
function colonnade() {
  let o = shadow(0, 0.05, 1.02, 0.14) + disc(0.02, 0.05, 0, 0.92, "rgba(150,170,110,.28)");
  o += block(-0.86, -0.62, 0.5, 0.2, 0, 4, ANC_DARK, 99) + block(-0.78, -0.54, 0.42, 0.12, 4, 8, ANC, 99);
  for (const u of [-0.48, -0.18, 0.12]) o += ln3(P(u, -0.54, 8), P(u, 0.12, 8), "rgba(90,75,55,.35)", 0.6);
  for (const v of [-0.32, -0.1]) o += ln3(P(-0.78, v, 8), P(0.42, v, 8), "rgba(90,75,55,.35)", 0.6);
  o += `<path d="M${pts2([P(0.2, -0.3, 8), P(0.26, -0.22, 8), P(0.24, -0.12, 8), P(0.32, -0.04, 8)]).split(" ").join(" L")}" fill="none" stroke="rgba(60,50,35,.5)" stroke-width="0.7"/>`;
  {
    const [x, y] = P(-0.2, 0.2, 2);
    o += rune(x, y, 1, 0, 0.8, 1) + rune(x + 9, y + 4.5, 3, 0, 0.8, 1);
  }
  const cols = [[-0.62, -0.38, 46, "cap"], [-0.28, -0.2, 30, "broken"], [0.06, -0.02, 12, "broken"], [0.28, 0, 0, ""]];
  for (const [u, v, h, top] of cols) {
    o += box(u - 0.11, v - 0.11, u + 0.11, v + 0.11, 8, 11, ANC);
    if (h) o += column(u, v, 11, 11 + h, 0.08, top, u * 10);
  }
  o += box(-0.92, -0.46, -0.42, -0.3, 63, 69, ANC_DARK);
  o += face([[-0.42, -0.46, 63], [-0.42, -0.3, 63], [-0.42, -0.3, 65.4], [-0.39, -0.36, 67.2], [-0.41, -0.41, 69], [-0.42, -0.46, 69]], ANC.top, EDGE);
  o += mossPad(...P(-0.7, -0.38, 69), 3, 1.3);
  o += ivy(P(-0.62 + 0.06, -0.38 + 0.08, 11), P(-0.62 + 0.04, -0.38 + 0.08, 50), 7, 3);
  o += shadow(0.3, 0.52, 0.5, 0.18);
  o += logLying(-0.1, 0.46, 0.12, 0.5, 5.6, { bark: ANC.left, dark: "rgba(60,50,35,.3)", end: ANC.top, ring: ANC_DARK.left });
  o += logLying(0.2, 0.52, 0.42, 0.6, 5.6, { bark: ANC.left, dark: "rgba(60,50,35,.3)", end: ANC.top, ring: ANC_DARK.left });
  o += logLying(0.52, 0.68, 0.7, 0.76, 5.6, { bark: ANC.left, dark: "rgba(60,50,35,.3)", end: ANC.top, ring: ANC_DARK.left });
  o += box(0.64, 0.28, 0.84, 0.48, 0, 4, ANC_DARK) + mossPad(...P(0.74, 0.38, 4), 2.6, 1.2);
  for (const [u, v] of [[0, 0.66], [0.46, 0.4], [0.7, 0.86], [-0.5, 0.4], [0.62, 0.02]]) o += tuft2(...P(u, v, 0), 0.9);
  return o;
}
__name(colonnade, "colonnade");
function runeStone(n = 0) {
  const o0 = n ? 0.95 : 0;
  let o = shadow(0, 0.02, 0.34, 0.2);
  const a = P(-0.28, 0.1, 0), b = P(0.24, 0.1, 0), c = P(0.24, -0.06, 0);
  const H = 38, Hb = 31;
  o += `<path d="M${f24(a[0])},${f24(a[1])} L${f24(b[0])},${f24(b[1])} L${f24(b[0] - 1)},${f24(b[1] - Hb)} Q${f24((a[0] + b[0]) / 2 + 1)},${f24((a[1] + b[1]) / 2 - H - 6)} ${f24(a[0] + 1.2)},${f24(a[1] - Hb + 2)} Z" fill="${ANC_DARK.left}"${EDGE}/>`;
  o += `<path d="M${f24(b[0])},${f24(b[1])} L${f24(c[0])},${f24(c[1])} L${f24(c[0] - 0.8)},${f24(c[1] - Hb + 1)} Q${f24(c[0] - 2)},${f24(c[1] - Hb - 4)} ${f24(b[0] - 1)},${f24(b[1] - Hb)} Z" fill="${ANC_DARK.right}"${EDGE}/>`;
  o += `<path d="M${f24(a[0] + 1.2)},${f24(a[1] - Hb + 2)} Q${f24((a[0] + b[0]) / 2 + 1)},${f24((a[1] + b[1]) / 2 - H - 6)} ${f24(b[0] - 1)},${f24(b[1] - Hb)} Q${f24(c[0] - 2)},${f24(c[1] - Hb - 4)} ${f24(c[0] - 4)},${f24(c[1] - Hb - 6)} Q${f24((a[0] + c[0]) / 2)},${f24((a[1] + c[1]) / 2 - H - 10)} ${f24(a[0] + 1.2)},${f24(a[1] - Hb + 2)} Z" fill="${ANC_DARK.top}"${EDGE}/>`;
  if (n) {
    const [x, y] = P(0, 0.08, 18);
    o += ell3(x, y, 16, 20, `rgba(${GLOW},.16)`);
  }
  const at = /* @__PURE__ */ __name((t, z) => [lerp2(a[0], b[0], t), lerp2(a[1], b[1], t) - z], "at");
  [[0.3, 25, 0], [0.62, 25.2, 2], [0.26, 16, 1], [0.56, 16.2, 3], [0.82, 16.4, 0], [0.34, 7, 2], [0.68, 7.2, 1]].forEach(([t, z, k]) => {
    const [x, y] = at(t, z);
    o += rune(x, y, k, o0, 0.72, 1);
  });
  {
    const [x, y] = [lerp2(b[0], c[0], 0.5), lerp2(b[1], c[1], 0.5) - 18];
    o += rune(x, y, 1, o0 * 0.8, 0.7, -1);
  }
  o += ell3(...at(0.8, 29), 2.2, 1.2, "rgba(200,210,150,.9)") + ell3(...at(0.14, 12), 1.6, 1, "rgba(160,190,110,.85)");
  o += tuft2(...P(-0.18, 0.12, 0), 0.9) + tuft2(...P(0.14, 0.14, 0), 0.8) + tuft2(...P(0.2, 0, 0), 0.7);
  if (n) for (const [dx, dy, r] of [[-8, -40, 1], [6, -46, 0.8], [10, -32, 0.7]]) o += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="rgba(${GLOW},.85)"/>`;
  return o;
}
__name(runeStone, "runeStone");
var brokenColumn = /* @__PURE__ */ __name(() => shadow(0, 0, 0.24, 0.2) + block(-0.15, -0.15, 0.15, 0.15, 0, 6, ANC_DARK, 99) + (() => {
  const [x, y] = P(0, 0.15, 3);
  return rune(x, y, 0, 0, 0.75, 1);
})() + column(0, 0, 6, 30, 0.09, "broken", 2) + ivy(P(-0.04, 0.08, 6), P(-0.06, 0.08, 26), 5, 4) + box(0.16, 0.12, 0.3, 0.24, 0, 4, ANC) + tuft2(...P(-0.16, 0.18, 0), 0.8) + tuft2(...P(0.2, -0.12, 0), 0.7), "brokenColumn");
function lighthouseKey(n = 0) {
  let o = shadow(0, 0, 0.34, 0.18);
  o += boulder(0.02, -0.3, 0.2, 0.12, 12, ANC_DARK, 5, 0.2, 0.7);
  const q = [[-0.2, -0.1, 0], [0.2, -0.1, 0], [0.2, -0.24, 17], [-0.2, -0.24, 17]];
  o += face([[0.2, -0.1, 0], [0.2, -0.24, 17], [0.2, -0.27, 15.6], [0.2, -0.12, -0.6]], ANC_DARK.right, EDGE);
  o += face(q, "#8F8676", EDGE) + face([[-0.2, -0.24, 17], [0.2, -0.24, 17], [0.2, -0.27, 15.6], [-0.2, -0.27, 15.6]], ANC.top, EDGE);
  {
    const [x, y] = P(0, -0.17, 8.4);
    o += rune(x, y, 0, n ? 0.75 : 0.3, 0.95, 0);
  }
  o += ell3(...P(-0.12, -0.14, 4), 1.6, 0.9, "rgba(160,190,110,.85)") + ell3(...P(0.12, -0.2, 12), 1.2, 0.7, "rgba(160,190,110,.85)");
  o += face([[-0.18, -0.1, 0], [0.18, -0.1, 0], [0.18, 0.16, 0], [-0.18, 0.16, 0]], "#6B5A42", EDGE);
  o += face([[-0.18, -0.1, 0], [0.18, -0.1, 0], [0.18, -0.04, 0], [-0.18, -0.04, 0]], "#4E4030");
  {
    const [x, y] = P(0, 0.04, 0.4);
    const k = /* @__PURE__ */ __name((st, w) => `<circle cx="-6" cy="0" r="3.2" fill="none" stroke="${st}" stroke-width="${w}"/><path d="M-2.8,0 L7.4,0 M5,0 L5,3.2 M7.4,0 L7.4,2.6" fill="none" stroke="${st}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "k");
    o += `<g transform="translate(${f24(x)} ${f24(y)}) rotate(-10)">${k(OUT2, 3)}${k("#C99A44", 1.5)}<circle cx="-6" cy="0" r="1.3" fill="#6B5A42"/><circle cx="-7.6" cy="-1.6" r="0.7" fill="#7FB0A0"/><circle cx="2" cy="-0.2" r="0.55" fill="#7FB0A0"/><path d="M-1.6,-0.6 L4,-0.6" stroke="#F0CF7A" stroke-width="0.5"/></g>`;
    if (n) o += ell3(x, y, 11, 5, "rgba(255,230,150,.25)") + `<path d="M${f24(x + 6)},${f24(y - 9)} l1,2.6 l2.6,1 l-2.6,1 l-1,2.6 l-1,-2.6 l-2.6,-1 l2.6,-1 Z" fill="#FFF6D0" stroke="${OUT2}" stroke-width="0.3"/>`;
  }
  for (const [u, v] of [[-0.2, 0.18], [0.2, 0.12], [0.06, 0.2]]) {
    const [x, y] = P(u, v, 0);
    o += ell3(x, y, 2.4, 1.2, "#8A7454", ` stroke="${OUT2}" stroke-width="0.4"`);
  }
  o += tuft2(...P(-0.26, 0.2, 0), 0.8) + tuft2(...P(0.28, 0.06, 0), 0.7) + tuft2(...P(-0.3, -0.06, 0), 0.7);
  return o;
}
__name(lighthouseKey, "lighthouseKey");
function deadLighthouse(n = 0) {
  const Z0 = 16, Z1 = 112, R0 = 18, R1 = 12.5;
  const y = /* @__PURE__ */ __name((z) => -z, "y"), rAt = /* @__PURE__ */ __name((z) => lerp2(R0, R1, (z - Z0) / (Z1 - Z0)), "rAt");
  let o = shadow(0, 0.05, 0.9, 0.16);
  o += boulder(-0.52, -0.42, 0.34, 0.28, 13, ROCK2, 4, 0.3, 0.48) + boulder(0.38, -0.54, 0.28, 0.24, 11, ROCK2, 7, 0.3, 0.48);
  o += boulder(0, 0, 0.68, 0.62, Z0 + 2, ROCK2, 2, 0.18, 0.8);
  const g = id2("tour");
  o += `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${ANC.left}"/><stop offset=".55" stop-color="${mixHex(ANC.left, ANC.right, 0.5)}"/><stop offset="1" stop-color="${ANC.right}"/></linearGradient></defs>`;
  o += `<path d="M${-R1},${y(Z1)} L${-R0},${y(Z0)} A${R0},${R0 / 2} 0 0 0 ${R0},${y(Z0)} L${R1},${y(Z1)} Z" fill="url(#${g})"${EDGE}/>`;
  for (let z = Z0 + 8, k = 0; z < Z1 - 2; z += 8, k++) {
    const r = rAt(z);
    o += `<path d="M${f24(-r)},${f24(y(z))} A${f24(r)},${f24(r / 2)} 0 0 0 ${f24(r)},${f24(y(z))}" fill="none" stroke="rgba(80,65,45,.3)" stroke-width="0.7"/>`;
    for (const th of k % 2 ? [0.22, 0.5, 0.78] : [0.36, 0.64]) {
      const a = Math.PI * (1 - th), xx = Math.cos(a) * r, yy = y(z) + Math.sin(a) * r / 2;
      o += ln3([xx, yy], [xx * rAt(z - 8) / r, yy + 8], "rgba(80,65,45,.26)", 0.6);
    }
  }
  o += `<path d="M7,${y(96)} L9.4,${y(88)} L7.6,${y(82)} L10.6,${y(72)} L9,${y(64)} L11.6,${y(56)}" fill="none" stroke="#4A3F33" stroke-width="0.9" stroke-linejoin="round"/>`;
  for (const [x, z] of [[-4, 52], [-2.6, 84]]) o += `<path d="M${x - 1.4},${y(z)} L${x - 1.4},${y(z + 8)} Q${x},${y(z + 10)} ${x + 1.4},${y(z + 8)} L${x + 1.4},${y(z)} Z" fill="#2E2A26"${EDGE}/>`;
  o += `<path d="M-7,${y(Z0) + 7.6} L-7,${y(Z0 + 13)} Q-1,${y(Z0 + 20)} 5,${y(Z0 + 13)} L5,${y(Z0) + 8.8} Q-1,${y(Z0) + 10.4} -7,${y(Z0) + 7.6} Z" fill="${WOOD_DARK.right}"${EDGE}/>`;
  o += ln3([-6.4, y(Z0 + 4)], [4.4, y(Z0 + 11)], WOOD.left, 1.6) + ln3([-6.4, y(Z0 + 11)], [4.4, y(Z0 + 4)], WOOD.left, 1.6);
  o += `<path d="M-8.6,${y(Z0 + 19)} Q-1,${y(Z0 + 23.4)} 6.6,${y(Z0 + 19)} L6.6,${y(Z0 + 15.6)} Q-1,${y(Z0 + 20)} -8.6,${y(Z0 + 15.6)} Z" fill="${ANC_DARK.left}"${EDGE}/>`;
  o += rune(-1, y(Z0 + 19.2), 0, n ? 0.5 : 0.25, 0.75, 0);
  o += ivy([-15, y(Z0) + 4], [-12.6, y(56)], 9, 1);
  for (const [x, z0, z1] of [[-8, Z1 - 2, Z1 - 22], [3, Z1 - 2, Z1 - 30], [9.6, Z1 - 2, Z1 - 16]]) o += `<path d="M${x},${y(z0)} q0.8,${(z0 - z1) * 0.4} -0.4,${z0 - z1}" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.2" stroke-linecap="round"/>`;
  const RG = R1 + 6, yG = y(Z1);
  for (const k of [-0.75, -0.25, 0.25, 0.75]) {
    const x = k * R1, yy = yG + Math.sqrt(1 - k * k) * R1 / 2;
    o += `<path d="M${f24(x - 1.6)},${f24(yy)} L${f24(x + 1.6)},${f24(yy)} L${f24(x)},${f24(yy + 5)} Z" fill="${ANC_DARK.right}"${EDGE}/>`;
  }
  o += `<path d="M${-RG},${yG} L${-RG},${yG + 3} A${RG},${RG / 2} 0 0 0 ${RG},${yG + 3} L${RG},${yG} Z" fill="${ANC_DARK.left}"${EDGE}/>` + ell3(0, yG, RG, RG / 2, ANC.top, EDGE);
  const post2 = /* @__PURE__ */ __name((a, broken) => {
    const x = Math.cos(a) * (RG - 1.4), yy = yG + Math.sin(a) * (RG - 1.4) / 2;
    return broken ? tk([x, yy], [x + 1.6, yy - 3.4], "#4E5A5E", 0.7) : tk([x, yy], [x, yy - 7], "#4E5A5E", 0.7);
  }, "post");
  for (let i = 0; i < 6; i++) o += post2(Math.PI + i / 5 * Math.PI, false);
  o += `<path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 1 ${RG - 1.4},${yG - 7}" fill="none" stroke="${OUT2}" stroke-width="1.9"/><path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 1 ${RG - 1.4},${yG - 7}" fill="none" stroke="#4E5A5E" stroke-width="0.8"/>`;
  const RL = 9.4, ZL0 = Z1, ZL1 = Z1 + 20, yL0 = y(ZL0), yL1 = y(ZL1);
  o += box(-0.17, -0.17, 0.17, 0.17, ZL0, ZL0 + 3, ANC_DARK);
  o += `<path d="M${-RL},${yL1} L${-RL},${yL0 - 3} A${RL},${RL / 2} 0 0 0 ${RL},${yL0 - 3} L${RL},${yL1} Z" fill="#3B4E57"${EDGE}/>`;
  o += ell3(0, yL0 - 12, 5, 6.4, "#8E9AA0", EDGE) + ell3(0, yL0 - 12, 3.2, 4.2, "none", ' stroke="#6E7A80" stroke-width="0.6"') + ell3(0, yL0 - 12, 1.4, 2, "#6E7A80");
  o += `<path d="M${-RL + 1},${yL1 + 2} L${-RL + 1},${yL0 - 4} L-4.4,${yL0 - 2.2} L-4.4,${yL1 + 4} Z" fill="rgba(140,170,180,.75)"/>`;
  o += `<path d="M4.6,${yL1 + 4} L4.6,${yL0 - 2.2} L${RL - 1},${yL0 - 4} L${RL - 1},${yL1 + 2} Z" fill="rgba(110,140,150,.8)"/>`;
  o += `<path d="M-4.4,${yL1 + 4} L4.6,${yL1 + 4} L4.6,${yL1 + 9} L2,${yL1 + 7} L0.4,${yL1 + 11} L-1.6,${yL1 + 8} L-4.4,${yL1 + 10} Z" fill="rgba(140,170,180,.75)"/>`;
  o += ln3([-RL + 2.6, yL1 + 4], [-5.6, yL1 + 9], "rgba(255,255,255,.6)", 0.8);
  for (const k of [-1, -0.47, 0.47, 1]) {
    const x = k * (RL - 0.2), yy = yL0 - 3 + Math.sqrt(Math.max(0, 1 - k * k)) * RL / 2;
    o += ln3([x, yL1], [x, yy], "#2B2420", 1.1);
  }
  const gd = id2("dome"), RD = RL + 1.6;
  o += `<defs><linearGradient id="${gd}" x1="0" x2="1"><stop offset="0" stop-color="#7FAE9C"/><stop offset="1" stop-color="#4F7A6C"/></linearGradient></defs>`;
  o += `<path d="M${-RD},${yL1} Q${-RD},${yL1 - 13} 0,${yL1 - 14} Q${RD},${yL1 - 13} ${RD},${yL1} A${RD},${RD / 2} 0 0 1 ${-RD},${yL1} Z" fill="url(#${gd})"${EDGE}/>`;
  o += `<path d="M1.4,${yL1 - 9.6} L3.2,${yL1 - 11} L4.4,${yL1 - 9.4} L6.6,${yL1 - 9} L6.8,${yL1 - 6.4} L8.2,${yL1 - 4.4} L6.6,${yL1 - 2.6} L7,${yL1 - 0.8} L4.4,${yL1 - 1.6} L2.6,${yL1 - 0.4} L2.2,${yL1 - 3.2} L0.6,${yL1 - 5} L1.8,${yL1 - 6.8} Z" fill="#26302E"${EDGE}/><path d="M2.6,${yL1 - 10.6} Q5.2,${yL1 - 7} 5.4,${yL1 - 1.2}" fill="none" stroke="${OUT2}" stroke-width="1.7"/><path d="M2.6,${yL1 - 10.6} Q5.2,${yL1 - 7} 5.4,${yL1 - 1.2}" fill="none" stroke="#6E9C8C" stroke-width="0.7"/><path d="M0.8,${yL1 - 5.2} Q4.6,${yL1 - 5.8} 8,${yL1 - 4.6}" fill="none" stroke="${OUT2}" stroke-width="1.5"/><path d="M0.8,${yL1 - 5.2} Q4.6,${yL1 - 5.8} 8,${yL1 - 4.6}" fill="none" stroke="#6E9C8C" stroke-width="0.6"/>`;
  o += ell3(0, yL1 + 0.2, RD, RD / 2.4, "none", ' stroke="#3E6458" stroke-width="0.8"');
  o += tk([0, yL1 - 14], [0.4, yL1 - 19], "#4E5A5E", 0.8) + tk([0.4, yL1 - 19], [3.4, yL1 - 20.6], "#4E5A5E", 0.7);
  for (let i = 0; i < 7; i++) {
    const a = i / 6 * Math.PI;
    if (i === 5) continue;
    o += post2(a, i === 4);
  }
  o += `<path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 0 ${f24(Math.cos(Math.PI * 0.62) * (RG - 1.4))},${f24(yG - 7 + Math.sin(Math.PI * 0.62) * (RG - 1.4) / 2)}" fill="none" stroke="${OUT2}" stroke-width="1.9"/><path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 0 ${f24(Math.cos(Math.PI * 0.62) * (RG - 1.4))},${f24(yG - 7 + Math.sin(Math.PI * 0.62) * (RG - 1.4) / 2)}" fill="none" stroke="#4E5A5E" stroke-width="0.8"/>`;
  const perched = /* @__PURE__ */ __name((x, yy, flip = 1) => `<g transform="translate(${f24(x)} ${f24(yy)}) scale(${flip} 1)"><path d="M-3.4,0 Q-3,-3 0,-3.2 Q2.6,-3.4 3.6,-1.4 L1.6,0.4 Q-1,1.2 -3.4,0 Z" fill="#FBF8F0" stroke="${OUT2}" stroke-width="0.45"/><path d="M-3.6,-0.8 Q-1,-2.2 1.4,-1 L-0.6,0.4 Z" fill="#AEB6BC" stroke="${OUT2}" stroke-width="0.35"/><circle cx="2" cy="-2.4" r="0.5" fill="${OUT2}"/><path d="M3.4,-1.8 L5,-1.4 L3.4,-1 Z" fill="#F2A23C"/><path d="M-0.4,0.6 L-0.4,2.4 M1,0.6 L1,2.4" stroke="#F2A23C" stroke-width="0.6"/></g>`, "perched");
  o += perched(-RG + 3, yG - 9.4) + perched(-3, yG + RG / 2 - 9.6, -1);
  o += boulder(-0.52, 0.36, 0.3, 0.24, 10, ROCK2, 9, 0.32, 0.44) + boulder(0.5, 0.26, 0.28, 0.24, 9, ROCK2, 11, 0.32, 0.44) + boulder(-0.16, 0.56, 0.2, 0.15, 6, ROCK2, 15, 0.32, 0.42) + boulder(0.14, 0.64, 0.24, 0.17, 7, ROCK2, 13, 0.32, 0.44);
  for (const [u, v] of [[-0.24, 0.66], [0.66, 0.5], [-0.78, 0.1]]) o += tuft2(...P(u, v, 0), 0.8, "#8FA65A");
  for (const [u, v, z] of [[-0.54, 0.34, 10], [0.48, 0.24, 9], [0.24, -0.3, 18], [-0.34, 0.12, 18], [0.14, 0.62, 7]]) {
    const [x, yy] = P(u, v, z);
    o += ell3(x, yy, 1.6, 0.8, "rgba(255,255,255,.85)");
  }
  const fly = /* @__PURE__ */ __name((x, yy, up2, s = 1) => `<path d="M${f24(x - 6 * s)},${f24(yy + (up2 ? -3 : 1.6) * s)} Q${f24(x - 3 * s)},${f24(yy + (up2 ? -3.4 : -1) * s)} ${f24(x)},${f24(yy)} Q${f24(x + 3 * s)},${f24(yy + (up2 ? -3.4 : -1) * s)} ${f24(x + 6 * s)},${f24(yy + (up2 ? -3 : 1.6) * s)}" fill="none" stroke="${OUT2}" stroke-width="${f24(1.6 * s)}" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f24(x - 6 * s)},${f24(yy + (up2 ? -3 : 1.6) * s)} Q${f24(x - 3 * s)},${f24(yy + (up2 ? -3.4 : -1) * s)} ${f24(x)},${f24(yy)} Q${f24(x + 3 * s)},${f24(yy + (up2 ? -3.4 : -1) * s)} ${f24(x + 6 * s)},${f24(yy + (up2 ? -3 : 1.6) * s)}" fill="none" stroke="#FBF8F0" stroke-width="${f24(0.7 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`, "fly");
  o += n ? fly(-30, -150, false) + fly(28, -128, true, 0.8) + fly(-40, -100, true, 0.7) : fly(-26, -146, true) + fly(32, -132, false, 0.8) + fly(-42, -106, false, 0.7);
  return o;
}
__name(deadLighthouse, "deadLighthouse");
var RUINES = {
  ruine_maison: { frame: BUILDING_BOX, n: 1, label: "Maison en ruine des Anciens", step: "III", draw: /* @__PURE__ */ __name(() => ruinHouse(), "draw") },
  colonnade: { frame: BUILDING_BOX, n: 1, label: "Colonnade des Anciens", step: "III", draw: /* @__PURE__ */ __name(() => colonnade(), "draw") },
  pierre_runes: { frame: PROP_BOX, n: 2, label: "Pierre à runes (jour, nuit)", step: "III", draw: /* @__PURE__ */ __name((n) => runeStone(n), "draw") },
  colonne_brisee: { frame: PROP_BOX, n: 1, label: "Colonne brisée", step: "III", draw: /* @__PURE__ */ __name(() => brokenColumn(), "draw") },
  cle_du_phare: { frame: PROP_BOX, n: 2, label: "La clé du phare sous sa pierre", step: "VI", draw: /* @__PURE__ */ __name((n) => lighthouseKey(n), "draw") },
  phare_eteint: { frame: { x: -72, y: -176, w: 144, h: 208 }, n: 2, label: "Le phare éteint des Anciens", step: "VI", draw: /* @__PURE__ */ __name((n) => deadLighthouse(n), "draw") }
};
for (const a of Object.values(RUINES)) {
  const dessin = a.draw;
  a.draw = (n) => {
    uid2 = 0;
    return dessin(n);
  };
}

// atelier/generateur_decor.mjs
var import_lot_m_liste = __toESM(require_lot_m_liste(), 1);
var import_noms_betes = __toESM(require_noms_betes(), 1);

// bibliotheque/svg/decor/camp/camp.json
var camp_default = {
  _lisez_moi: [
    "Décor iso du camp des naufragés, au trait de la troupe, à l'échelle du jeu × 1,25 (case de 80 × 40). Ancre (0, 0) au centre de l'emprise au sol : coins, tente, hamac et épave sur 2 × 2 cases (cadre BUILDING_BOX ; l'épave un peu plus large), objets sur une case (PROP_BOX). Quand un dessin dépasse un peu, le cadre est élargi, l'ancre ne bouge pas : prendre le cadre noté ici.",
    "Coins des maîtres : débris (à l'arrivée), abri, cabanon ; Cannelle (la cuisine de l'épave) et Galet (le muret de la Fissure) n'ont que des débris, leur bâtiment prend vite le relais. Les maîtres quittent le look du naufragé au souvenir retrouvé (lib/personnages/naufrages/), mais leur coin reste leur toit jusqu'aux maisons.",
    "etape : quand l'objet apparaît (codes de STEPS) ; images et ms : animation en boucle (le feu à la vitesse du jeu, 9 images/s). Les étapes sont une proposition tirée de HISTOIRE.md."
  ],
  etapes: {
    T1: "tutoriel, étape 1 — la Grève, la nuit (Brume allume le feu)",
    T2: "tutoriel, étape 2 — Aster repêche les caisses",
    T3: "tutoriel, étape 3 — Cannelle derrière l'épave",
    T4: "tutoriel, étape 4 — Rivet sous une voile échouée",
    T5: "tutoriel, étape 5 — Ondin à La Source ; fin : « Le Campement »",
    I: "acte I — veillée I, « Le Camp des naufragés » (Sylve arrive)",
    II: "acte II — veillée II, « Le Hameau » (Galet arrive)",
    III: "acte III — veillée III, « Le Village » (Mélisse arrive)",
    IV: "acte IV — la première barque de voyageurs"
  },
  objets: {
    hirondelle: {
      nom: "Épave de l'Hirondelle",
      categorie: "epave",
      etape: "T1",
      cadre: [
        -110,
        -125,
        220,
        187.5
      ],
      images: 1,
      fichiers: [
        "epave/hirondelle_1.svg"
      ]
    },
    aster_debris: {
      nom: "Aster · débris",
      categorie: "coins",
      etape: "T2",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/aster/aster_debris_1.svg"
      ],
      maitre: "Aster",
      etat: "débris"
    },
    aster_abri: {
      nom: "Aster · abri",
      categorie: "coins",
      etape: "I",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/aster/aster_abri_1.svg"
      ],
      maitre: "Aster",
      etat: "abri"
    },
    aster_cabanon: {
      nom: "Aster · cabanon",
      categorie: "coins",
      etape: "II",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 2,
      ms: 500,
      fichiers: [
        "coins/aster/aster_cabanon_1.svg",
        "coins/aster/aster_cabanon_2.svg"
      ],
      maitre: "Aster",
      etat: "cabanon",
      suite: "jusqu'aux maisons du Foyer (annexes) : l'intégration choisira le moment"
    },
    cannelle_debris: {
      nom: "Cannelle · cuisine de l'épave",
      categorie: "coins",
      etape: "T3",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 3,
      ms: 111,
      fichiers: [
        "coins/cannelle/cannelle_debris_1.svg",
        "coins/cannelle/cannelle_debris_2.svg",
        "coins/cannelle/cannelle_debris_3.svg"
      ],
      maitre: "Cannelle",
      etat: "débris",
      suite: "jusqu'à l'Abri (Foyer II, acte II)"
    },
    rivet_debris: {
      nom: "Rivet · débris",
      categorie: "coins",
      etape: "T4",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/rivet/rivet_debris_1.svg"
      ],
      maitre: "Rivet",
      etat: "débris"
    },
    rivet_abri: {
      nom: "Rivet · abri",
      categorie: "coins",
      etape: "I",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/rivet/rivet_abri_1.svg"
      ],
      maitre: "Rivet",
      etat: "abri"
    },
    rivet_cabanon: {
      nom: "Rivet · cabanon",
      categorie: "coins",
      etape: "II",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/rivet/rivet_cabanon_1.svg"
      ],
      maitre: "Rivet",
      etat: "cabanon",
      suite: "jusqu'aux maisons du Foyer (annexes) : l'intégration choisira le moment"
    },
    ondin_debris: {
      nom: "Ondin · débris",
      categorie: "coins",
      etape: "T5",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 2,
      ms: 600,
      fichiers: [
        "coins/ondin/ondin_debris_1.svg",
        "coins/ondin/ondin_debris_2.svg"
      ],
      maitre: "Ondin",
      etat: "débris"
    },
    ondin_abri: {
      nom: "Ondin · abri",
      categorie: "coins",
      etape: "I",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 2,
      ms: 600,
      fichiers: [
        "coins/ondin/ondin_abri_1.svg",
        "coins/ondin/ondin_abri_2.svg"
      ],
      maitre: "Ondin",
      etat: "abri"
    },
    ondin_cabanon: {
      nom: "Ondin · cabanon",
      categorie: "coins",
      etape: "II",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 2,
      ms: 600,
      fichiers: [
        "coins/ondin/ondin_cabanon_1.svg",
        "coins/ondin/ondin_cabanon_2.svg"
      ],
      maitre: "Ondin",
      etat: "cabanon",
      suite: "jusqu'aux maisons du Foyer (annexes) : l'intégration choisira le moment"
    },
    sylve_debris: {
      nom: "Sylve · débris",
      categorie: "coins",
      etape: "I",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/sylve/sylve_debris_1.svg"
      ],
      maitre: "Sylve",
      etat: "débris"
    },
    sylve_abri: {
      nom: "Sylve · abri",
      categorie: "coins",
      etape: "I",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/sylve/sylve_abri_1.svg"
      ],
      maitre: "Sylve",
      etat: "abri"
    },
    sylve_cabanon: {
      nom: "Sylve · cabanon",
      categorie: "coins",
      etape: "II",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/sylve/sylve_cabanon_1.svg"
      ],
      maitre: "Sylve",
      etat: "cabanon",
      suite: "jusqu'aux maisons du Foyer (annexes) : l'intégration choisira le moment"
    },
    galet_debris: {
      nom: "Galet · muret de la Fissure",
      categorie: "coins",
      etape: "II",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/galet/galet_debris_1.svg"
      ],
      maitre: "Galet",
      etat: "débris",
      suite: "jusqu'à la Carrière I (acte II)"
    },
    melisse_debris: {
      nom: "Mélisse · débris",
      categorie: "coins",
      etape: "III",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/melisse/melisse_debris_1.svg"
      ],
      maitre: "Mélisse",
      etat: "débris"
    },
    melisse_abri: {
      nom: "Mélisse · abri",
      categorie: "coins",
      etape: "III",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/melisse/melisse_abri_1.svg"
      ],
      maitre: "Mélisse",
      etat: "abri"
    },
    melisse_cabanon: {
      nom: "Mélisse · cabanon",
      categorie: "coins",
      etape: "III",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "coins/melisse/melisse_cabanon_1.svg"
      ],
      maitre: "Mélisse",
      etat: "cabanon",
      suite: "jusqu'aux maisons du Foyer (annexes) : l'intégration choisira le moment"
    },
    tente: {
      nom: "Tente de voyageur",
      categorie: "voyageurs",
      etape: "IV",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "voyageurs/tente_1.svg"
      ]
    },
    hamac: {
      nom: "Hamac",
      categorie: "voyageurs",
      etape: "IV",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 2,
      ms: 900,
      fichiers: [
        "voyageurs/hamac_1.svg",
        "voyageurs/hamac_2.svg"
      ]
    },
    etendoir: {
      nom: "Étendoir",
      categorie: "objets",
      etape: "T3",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 2,
      ms: 600,
      fichiers: [
        "objets/etendoir_1.svg",
        "objets/etendoir_2.svg"
      ]
    },
    tonneau: {
      nom: "Tonneau d'eau de pluie",
      categorie: "objets",
      etape: "T5",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/tonneau_1.svg"
      ]
    },
    rondins: {
      nom: "Rondins",
      categorie: "objets",
      etape: "T3",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/rondins_1.svg"
      ]
    },
    filet: {
      nom: "Filet tendu",
      categorie: "objets",
      etape: "T2",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/filet_1.svg"
      ]
    },
    paillasse: {
      nom: "Paillasse",
      categorie: "objets",
      etape: "T5",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/paillasse_1.svg"
      ]
    },
    torche: {
      nom: "Torche de bois flotté",
      categorie: "objets",
      etape: "I",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 3,
      ms: 111,
      fichiers: [
        "objets/torche_1.svg",
        "objets/torche_2.svg",
        "objets/torche_3.svg"
      ]
    },
    sos: {
      nom: "SOS en galets",
      categorie: "objets",
      etape: "T2",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/sos_1.svg"
      ]
    },
    caisses: {
      nom: "Pile de caisses",
      categorie: "objets",
      etape: "T2",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/caisses_1.svg"
      ]
    },
    etabli: {
      nom: "Établi de Rivet",
      categorie: "objets",
      etape: "T4",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "objets/etabli_1.svg"
      ]
    },
    bol: {
      nom: "Bol de soupe « pour la Dame »",
      categorie: "objets",
      etape: "III",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 3,
      ms: 400,
      fichiers: [
        "objets/bol_1.svg",
        "objets/bol_2.svg",
        "objets/bol_3.svg"
      ]
    }
  }
};

// bibliotheque/svg/decor/ruines/ruines.json
var ruines_default = {
  _lisez_moi: [
    "Ce qui reste des Anciens, en iso au trait de la troupe, à l'échelle du jeu × 1,25 (case de 80 × 40). Ancre (0, 0) au centre de l'emprise : ruines sur 2 × 2 cases (BUILDING_BOX), petits objets sur une case (PROP_BOX), phare sur son îlot (cadre propre). Quand un dessin dépasse un peu, le cadre est élargi, l'ancre ne bouge pas : prendre le cadre noté ici.",
    "Le Cercle de menhirs existe déjà (lib/decor/lieux/menhirs_*). Les runes reprennent sa spirale et sa lueur turquoise.",
    "etape : quand l'objet apparaît (proposition tirée de HISTOIRE.md)."
  ],
  etapes: {
    III: "acte III — Mélisse trouve les premières ruines, Galet lit leurs runes (« Nous aussi, nous étions des naufragés »)",
    VI: "acte VI — l'Îlot aux Mouettes et le phare éteint ; la baguette d'Ondin trouve la clé du phare parmi les ruines"
  },
  objets: {
    ruine_maison: {
      nom: "Maison en ruine des Anciens",
      etape: "III",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "ruine_maison_1.svg"
      ]
    },
    colonnade: {
      nom: "Colonnade des Anciens",
      etape: "III",
      cadre: [
        -95,
        -155,
        190,
        210
      ],
      images: 1,
      fichiers: [
        "colonnade_1.svg"
      ]
    },
    pierre_runes: {
      nom: "Pierre à runes (jour, nuit)",
      etape: "III",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 2,
      ms: 1200,
      note: "image 1 : le jour (runes gravées) ; image 2 : à la nuit tombée (elles luisent) — à alterner selon l'heure plutôt qu'en boucle",
      fichiers: [
        "pierre_runes_1.svg",
        "pierre_runes_2.svg"
      ]
    },
    colonne_brisee: {
      nom: "Colonne brisée",
      etape: "III",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 1,
      fichiers: [
        "colonne_brisee_1.svg"
      ]
    },
    cle_du_phare: {
      nom: "La clé du phare sous sa pierre",
      etape: "VI",
      cadre: [
        -50,
        -115,
        100,
        140
      ],
      images: 2,
      ms: 600,
      note: "« J'ai laissé la clé du phare sous une pierre » (bouteille d'Héliane) ; image 2 : la clé brille",
      fichiers: [
        "cle_du_phare_1.svg",
        "cle_du_phare_2.svg"
      ]
    },
    phare_eteint: {
      nom: "Le phare éteint des Anciens",
      etape: "VI",
      cadre: [
        -90,
        -220,
        180,
        260
      ],
      images: 2,
      ms: 700,
      note: "éteint jusqu'à l'acte VII : le Phare de Brume (Foyer VII, lib/batiments/) prend sa place ; les mouettes volent (2 images)",
      fichiers: [
        "phare_eteint_1.svg",
        "phare_eteint_2.svg"
      ]
    }
  }
};

// bibliotheque/svg/decor/embrume/embrume.json
var embrume_default = {
  _lisez_moi: [
    "Le bâtiment embrumé (HISTOIRE.md § 6.15) : quand un égaré l'atteint, il ne produit plus jusqu'à sa réparation. Le jeu grise le bâtiment (filtre CSS, par exemple grayscale(.8)) et pose par-dessus le calque de brume de son emprise : brume au pied, voile, deux écharpes de brume en travers. Ancre (0, 0) au centre de l'emprise, comme les bâtiments (case de 80 × 40, échelle du jeu × 1,25).",
    "embrume_<n>x<n> : 3 images en boucle (~400 ms) ; embrume_<n>x<n>_guerison : 3 images, une fois (~180 ms, la dernière ~600 ms), à la réparation ou au passage d'Anya, puis on retire le filtre ; embrume_nuage : 3 images en boucle (~500 ms), le petit nuage grognon à poser au-dessus du bâtiment comme une bulle de production (ancre : son pied) ; reparer_icone : 32 × 32, pour le bouton « Réparer » de la fiche."
  ],
  calques: {
    "1x1": {
      nom: "Brume du bâtiment embrumé, emprise 1 × 1",
      cadre: [
        -54,
        -88,
        108,
        120
      ],
      ms_par_image: 400,
      fichiers: [
        "embrume_1x1_1.svg",
        "embrume_1x1_2.svg",
        "embrume_1x1_3.svg"
      ]
    },
    "1x1_guerison": {
      nom: "Guérison du bâtiment embrumé, emprise 1 × 1",
      cadre: [
        -54,
        -88,
        108,
        120
      ],
      ms_par_image: [
        180,
        180,
        600
      ],
      fichiers: [
        "embrume_1x1_guerison_1.svg",
        "embrume_1x1_guerison_2.svg",
        "embrume_1x1_guerison_3.svg"
      ]
    },
    "2x2": {
      nom: "Brume du bâtiment embrumé, emprise 2 × 2",
      cadre: [
        -94,
        -128,
        188,
        180
      ],
      ms_par_image: 400,
      fichiers: [
        "embrume_2x2_1.svg",
        "embrume_2x2_2.svg",
        "embrume_2x2_3.svg"
      ]
    },
    "2x2_guerison": {
      nom: "Guérison du bâtiment embrumé, emprise 2 × 2",
      cadre: [
        -94,
        -128,
        188,
        180
      ],
      ms_par_image: [
        180,
        180,
        600
      ],
      fichiers: [
        "embrume_2x2_guerison_1.svg",
        "embrume_2x2_guerison_2.svg",
        "embrume_2x2_guerison_3.svg"
      ]
    },
    "3x3": {
      nom: "Brume du bâtiment embrumé, emprise 3 × 3",
      cadre: [
        -134,
        -168,
        268,
        240
      ],
      ms_par_image: 400,
      fichiers: [
        "embrume_3x3_1.svg",
        "embrume_3x3_2.svg",
        "embrume_3x3_3.svg"
      ]
    },
    "3x3_guerison": {
      nom: "Guérison du bâtiment embrumé, emprise 3 × 3",
      cadre: [
        -134,
        -168,
        268,
        240
      ],
      ms_par_image: [
        180,
        180,
        600
      ],
      fichiers: [
        "embrume_3x3_guerison_1.svg",
        "embrume_3x3_guerison_2.svg",
        "embrume_3x3_guerison_3.svg"
      ]
    },
    nuage: {
      nom: "Petit nuage du bâtiment embrumé",
      cadre: [
        -24,
        -34,
        48,
        40
      ],
      ms_par_image: 500,
      fichiers: [
        "embrume_nuage_1.svg",
        "embrume_nuage_2.svg",
        "embrume_nuage_3.svg"
      ]
    },
    reparer: {
      nom: "Icône « Réparer »",
      cadre: [
        0,
        0,
        32,
        32
      ],
      fichiers: [
        "reparer_icone.svg"
      ]
    }
  }
};

// bibliotheque/svg/decor/camp/poules/poules.json
var poules_default = {
  _lisez_moi: [
    "Étape 8 du tutoriel : la cage aux poules de la cuisine du navire, coincée sous les rochers de la Grève (2 images en boucle, ~300 ms : elle remue, les poules s'agitent) ; touchée, elle s'ouvre (cage_poules_ouverte) et les trois poules sortent (poule-rousse, poule-blanche, poule-noire des bêtes orientées).",
    "L'œuf : posé au sol près de la poule qui l'a pondu, et son icône 32 × 32 (bulle de production, fiche de la bête). Ancre (0, 0) au centre de la case, échelle du jeu × 1,25."
  ],
  poules: {
    cage_coincee: {
      nom: "Cage aux poules du navire, coincée sous les rochers",
      cadre: [
        -50,
        -50,
        100,
        72
      ],
      ms_par_image: 300,
      fichiers: [
        "cage_poules_coincee_1.svg",
        "cage_poules_coincee_2.svg"
      ]
    },
    cage_ouverte: {
      nom: "Cage aux poules du navire, ouverte",
      cadre: [
        -50,
        -50,
        100,
        72
      ],
      fichiers: [
        "cage_poules_ouverte.svg"
      ]
    },
    oeuf: {
      nom: "Œuf",
      cadre: [
        -10,
        -14,
        20,
        17.5
      ],
      fichiers: [
        "oeuf.svg"
      ]
    },
    oeuf_icone: {
      nom: "Œuf (icône)",
      cadre: [
        0,
        0,
        32,
        32
      ],
      fichiers: [
        "oeuf_icone.svg"
      ]
    }
  }
};

// bibliotheque/svg/decor/signes/signes.json
var signes_default = {
  _lisez_moi: [
    "Les signes d'Anya qui erre (HISTOIRE.md § 6.14, § 17) : là où elle passe, les fleurs s'ouvrent (4 images, une fois : ~600, 300, 300 ms, la dernière reste) et les lucioles se rassemblent (4 images en boucle, ~220 ms). Les bêtes tournées du même côté n'ont pas de dessin : le jeu tourne les bêtes déjà là. Ancre (0, 0) au centre de la case, échelle du jeu × 1,25."
  ],
  signes: {
    fleurs: {
      nom: "Signe d'Anya : des fleurs qui s'ouvrent",
      cadre: [
        -30,
        -40,
        60,
        50.5
      ],
      ms_par_image: [
        600,
        300,
        300,
        1500
      ],
      fichiers: [
        "fleurs_ouverture_1.svg",
        "fleurs_ouverture_2.svg",
        "fleurs_ouverture_3.svg",
        "fleurs_ouverture_4.svg"
      ]
    },
    lucioles: {
      nom: "Signe d'Anya : des lucioles rassemblées",
      cadre: [
        -30,
        -52,
        60,
        58
      ],
      ms_par_image: 220,
      fichiers: [
        "lucioles_rassemblees_1.svg",
        "lucioles_rassemblees_2.svg",
        "lucioles_rassemblees_3.svg",
        "lucioles_rassemblees_4.svg"
      ]
    }
  }
};

// bibliotheque/svg/decor/souvenir/souvenir.json
var souvenir_default = {
  _lisez_moi: [
    "Le souvenir retrouvé (HISTOIRE.md § 14) : un éclat doré part du Grimoire vers le naufragé ; à l'arrivée, une gerbe de lumière l'enveloppe ; son sceau s'allume au-dessus de sa tête ; il se lève, outil en main.",
    "eclat : 4 images en boucle (~90 ms), ancre au centre de l'éclat ; le jeu le fait glisser du Grimoire jusqu'à la poitrine du naufragé.",
    "arrivee : 5 images, une fois (~120, 160, 200, 220, 260 ms), ancre aux pieds du naufragé, posée par-dessus lui ; le jeu remplace le naufragé (pose endormi) par le maître (pose « action », l'outil en main) sous l'éclair de l'image 1.",
    "sceaux : un par chapitre, ancre au centre ; éteint (1 image), allumé (2 images en boucle, ~500 ms), posé au-dessus de la tête du maître (centre ~8 au-dessus du haut de sa tête) ; cadre : celui de l'allumé, cadre_eteint : celui de l'éteint. Sigles de src/book/grimoire.js."
  ],
  souvenir: {
    eclat: {
      nom: "L'éclat doré du souvenir (du Grimoire au naufragé)",
      cadre: [
        -14,
        -14,
        28,
        28
      ],
      ms_par_image: 90,
      fichiers: [
        "eclat_1.svg",
        "eclat_2.svg",
        "eclat_3.svg",
        "eclat_4.svg"
      ]
    },
    arrivee: {
      nom: "La gerbe de lumière sur le naufragé",
      cadre: [
        -24.5,
        -78,
        49.5,
        86.5
      ],
      ms_par_image: [
        120,
        160,
        200,
        220,
        260
      ],
      fichiers: [
        "arrivee_1.svg",
        "arrivee_2.svg",
        "arrivee_3.svg",
        "arrivee_4.svg",
        "arrivee_5.svg"
      ]
    },
    sceau_mercure: {
      nom: "Sceau de Mercure ☿ (Aster)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_mercure_eteint.svg"
        ],
        allume: [
          "sceau_mercure_allume_1.svg",
          "sceau_mercure_allume_2.svg"
        ]
      }
    },
    sceau_saturne: {
      nom: "Sceau de Saturne ♄ (Galet)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_saturne_eteint.svg"
        ],
        allume: [
          "sceau_saturne_allume_1.svg",
          "sceau_saturne_allume_2.svg"
        ]
      }
    },
    sceau_lune: {
      nom: "Sceau de Lune ☾ (Ondin)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_lune_eteint.svg"
        ],
        allume: [
          "sceau_lune_allume_1.svg",
          "sceau_lune_allume_2.svg"
        ]
      }
    },
    sceau_venus: {
      nom: "Sceau de Vénus ♀ (Sylve et Mélisse)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_venus_eteint.svg"
        ],
        allume: [
          "sceau_venus_allume_1.svg",
          "sceau_venus_allume_2.svg"
        ]
      }
    },
    sceau_mars: {
      nom: "Sceau de Mars ♂ (Cannelle)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_mars_eteint.svg"
        ],
        allume: [
          "sceau_mars_allume_1.svg",
          "sceau_mars_allume_2.svg"
        ]
      }
    },
    sceau_jupiter: {
      nom: "Sceau de Jupiter ♃ (Rivet)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_jupiter_eteint.svg"
        ],
        allume: [
          "sceau_jupiter_allume_1.svg",
          "sceau_jupiter_allume_2.svg"
        ]
      }
    },
    sceau_soleil: {
      nom: "Sceau de Soleil ☉ (Brume)",
      cadre: [
        -15.5,
        -15.5,
        31,
        31
      ],
      cadre_eteint: [
        -15,
        -15,
        30,
        30
      ],
      ms_par_image: 500,
      fichiers: {
        eteint: [
          "sceau_soleil_eteint.svg"
        ],
        allume: [
          "sceau_soleil_allume_1.svg",
          "sceau_soleil_allume_2.svg"
        ]
      }
    }
  }
};

// bibliotheque/svg/animaux/mer/crabe/crabe.json
var crabe_default = {
  _lisez_moi: [
    "Le crabe de la Grève (étape 8) : de face, il marche de côté vers la droite (le miroir pour la gauche). Poses des bêtes de profil : marche1, marche2 (~260 ms), repos, clignement, joie (touché : pinces en l'air, un cœur). Ancre (0, 0) au sol sous le crabe.",
    "Noms rangés à l'assemblage (README, catalogue.json) : <sujet>_<vue>_<pose>_<n>.svg, vues face, avant (l'ancien « trois_quarts »), dos, profil ; les chemins ci-dessous suivent ces noms."
  ],
  betes: {
    crabe: {
      nom: "Crabe de la Grève",
      cadre: [
        -14,
        -22,
        28,
        24.5
      ],
      fichiers: [
        "crabe_profil_marche_1.svg",
        "crabe_profil_marche_2.svg",
        "crabe_profil_repos.svg",
        "crabe_profil_clignement.svg",
        "crabe_profil_joie.svg"
      ]
    }
  }
};

// atelier/generateur_decor.mjs
var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r22(cadre[2])}" height="${r22(cadre[3])}" viewBox="${cadre.map(r22).join(" ")}">${body}</svg>`, "svgOf");
var inv = null;
var tout = /* @__PURE__ */ __name(() => inv ??= inventaire(), "tout");
var fichier = /* @__PURE__ */ __name((it, n) => `decor/${it.dir}/${it.frames.length > 1 ? `${it.base}_${n}` : it.base}.svg`, "fichier");
var vitesse = /* @__PURE__ */ __name((it) => it.frames.length > 1 && it.ms ? it.ms : null, "vitesse");
function decors() {
  const out = {};
  for (const it of tout()) (out[it.cat] ??= {})[it.base] = { nom: it.label, images: it.frames.length, cadre: it.frame.map(r22), ms_par_image: vitesse(it), ...it.meta };
  return out;
}
__name(decors, "decors");
function decor(categorie, nom, n = 1) {
  const its = tout().filter((i) => i.cat === categorie);
  if (!its.length) throw new Error(`catégorie inconnue : ${categorie} (${[...new Set(tout().map((i) => i.cat))].join(", ")})`);
  const it = its.find((i) => i.base === nom);
  if (!it) throw new Error(`${categorie} : ${nom} inconnu (${its.map((i) => i.base).join(", ")})`);
  if (!(n >= 1 && n <= it.frames.length)) throw new Error(`${nom} : image ${n} (de 1 à ${it.frames.length})`);
  const cadre = it.frame.map(r22);
  return { svg: svgOf(it.frame, it.frames[n - 1]), cadre, ms_par_image: vitesse(it) };
}
__name(decor, "decor");
var K = 1.25;
var isoSvg = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r22(cadre[2])}" height="${r22(cadre[3])}" viewBox="${cadre.join(" ")}"><g transform="scale(${K})">${body}</g></svg>`, "isoSvg");
var piece = /* @__PURE__ */ __name((table, index, quoi) => (objet, n = 1) => {
  const a = table[objet], e = index.objets[objet];
  if (!a || !e) throw new Error(`${quoi} inconnu : ${objet} (${Object.keys(table).join(", ")})`);
  if (!(n >= 1 && n <= a.n)) throw new Error(`${objet} : image ${n} (de 1 à ${a.n})`);
  return { svg: isoSvg(e.cadre, a.draw(n - 1)), cadre: e.cadre, ms_par_image: a.n > 1 ? e.ms ?? null : null };
}, "piece");
var camp = piece(CAMP, camp_default, "objet du camp");
var ruine = piece(RUINES, ruines_default, "ruine");
var CAMP_ET_RUINES = { camp: camp_default.objets, ruines: ruines_default.objets };
var meta = /* @__PURE__ */ new Map();
var lire = /* @__PURE__ */ __name((dir, json) => {
  const walk = /* @__PURE__ */ __name((v) => {
    if (!v || typeof v !== "object") return;
    if (v.cadre && v.fichiers) {
      const f = v.fichiers, ms = v.ms_par_image ?? null;
      if (Array.isArray(f)) f.forEach((x) => meta.set(`${dir}/${x}`, { cadre: v.cadre, ms }));
      else for (const [etat, xs] of Object.entries(f)) xs.forEach((x) => meta.set(`${dir}/${x}`, { cadre: etat === "eteint" && v.cadre_eteint ? v.cadre_eteint : v.cadre, ms: etat === "eteint" ? null : ms }));
    } else Object.values(v).forEach(walk);
  }, "walk");
  walk(json);
}, "lire");
lire("decor/embrume", embrume_default);
lire("decor/camp/poules", poules_default);
lire("decor/signes", signes_default);
lire("decor/souvenir", souvenir_default);
lire("animaux/mer/crabe", crabe_default);
var plat = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r22(cadre[2])}" height="${r22(cadre[3])}" viewBox="${cadre.join(" ")}">${body}</svg>`, "plat");
var fichierElement = /* @__PURE__ */ __name((g, n) => `${g.dir}/${g.images.length > 1 ? `${g.nom}_${n}` : g.nom}.svg`, "fichierElement");
var ELEMENTS = import_lot_m_liste.default.GROUPES.map((g) => g.nom);
function element(nom, n = 1) {
  const g = import_lot_m_liste.default.GROUPES.find((x) => x.nom === nom);
  if (!g) throw new Error(`élément inconnu : ${nom} (${ELEMENTS.join(", ")})`);
  if (!(n >= 1 && n <= g.images.length)) throw new Error(`${nom} : image ${n} (de 1 à ${g.images.length})`);
  const m = meta.get(fichierElement(g, n));
  return { svg: plat(m.cadre, g.images[n - 1]()), cadre: m.cadre, ms_par_image: g.images.length > 1 ? m.ms : null };
}
__name(element, "element");
var fichierCrabe = /* @__PURE__ */ __name((p) => import_noms_betes.default.nomBete(`${import_lot_m_liste.default.CRABE.dir}/crabe_${p}.svg`), "fichierCrabe");
function crabe(pose) {
  if (!import_lot_m_liste.default.CRABE.poses.includes(pose)) throw new Error(`crabe : pose ${pose} (${import_lot_m_liste.default.CRABE.poses.join(", ")})`);
  const m = meta.get(fichierCrabe(pose));
  return { svg: plat(m.cadre, import_lot_m_liste.default.CRABE.dessin(pose)), cadre: m.cadre, ms_par_image: /\d$/.test(pose) ? import_noms_betes.default.vitesseBete("animaux/mer/crabe", "marche") : null };
}
__name(crabe, "crabe");
function liste() {
  return [
    ...tout().flatMap((it) => it.frames.map((_, k) => ({ fichier: fichier(it, k + 1), fonction: "decor", args: [it.cat, it.base, k + 1] }))),
    ...Object.entries(camp_default.objets).flatMap(([k, e]) => e.fichiers.map((f, i) => ({ fichier: `decor/camp/${f}`, fonction: "camp", args: [k, i + 1] }))),
    ...Object.entries(ruines_default.objets).flatMap(([k, e]) => e.fichiers.map((f, i) => ({ fichier: `decor/ruines/${f}`, fonction: "ruine", args: [k, i + 1] }))),
    ...import_lot_m_liste.default.GROUPES.flatMap((g) => g.images.map((_, i) => ({ fichier: fichierElement(g, i + 1), fonction: "element", args: [g.nom, i + 1] }))),
    ...import_lot_m_liste.default.CRABE.poses.map((p) => ({ fichier: fichierCrabe(p), fonction: "crabe", args: [p] }))
  ];
}
__name(liste, "liste");
export {
  CAMP_ET_RUINES,
  ELEMENTS,
  camp,
  crabe,
  decor,
  decors,
  element,
  liste,
  ruine
};
