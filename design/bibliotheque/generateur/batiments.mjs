// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_batiments.mjs : ne pas modifier à la main.
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
function setHiver(on) {
  HIVER = !!on;
}
__name(setHiver, "setHiver");
var NEIGE = { light: "#F6FAFD", shade: "#D6E4EE", glace: "#CFE6F2" };
var lerp = /* @__PURE__ */ __name((p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], "lerp");
function snowPan(A, B, C, D, k = 0.8, glacons = false) {
  const n = Math.max(3, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 9));
  const low = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, kk = k + (i % 2 ? 0.06 : -0.04);
    return lerp(lerp(A, D, kk), lerp(B, C, kk), t);
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
var snowCap = /* @__PURE__ */ __name((id, d, x, y, rx, ry) => `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${fmt(x + 1)}" cy="${fmt(y + ry * 0.24)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${NEIGE.shade}"/><ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${NEIGE.light}"${EDGE}/></g>`, "snowCap");
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
function pyramid(u0, v0, u1, v1, z, h, colors, o = 0.06, edge = EDGE) {
  const a = [u0 - o, v0 - o, z];
  const b = [u1 + o, v0 - o, z];
  const c = [u1 + o, v1 + o, z];
  const d = [u0 - o, v1 + o, z];
  const top = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
  const T = P(...top), sn = /* @__PURE__ */ __name((p, q, g) => HIVER ? snowPan(T, T, P(...q), P(...p), 0.72, g) : "", "sn");
  return [
    face([a, b, top], colors.back, edge),
    sn(a, b),
    face([d, a, top], colors.back, edge),
    sn(d, a),
    face([b, c, top], colors.right, edge),
    sn(b, c, true),
    face([c, d, top], colors.left, edge),
    sn(c, d, true)
  ].join("");
}
__name(pyramid, "pyramid");
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
var SOIL = { top: "#946240", left: "#784C2E", right: "#5E3A22" };
var ROOF_RED = { front: "#E06E52", back: "#B9503B" };
var THATCH = { front: "#EBC46F", back: "#C99A45" };
var LEAVES = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
var PINE = { light: "#86C774", mid: "#4F9A4C", dark: "#2F6E3A" };
var GLASS = "#FFE6A3";
var INK = "#4A3426";
var INK_OUT = "#3C2819";
var BUILDING_BOX = { x: -76, y: -124, w: 152, h: 168 };
function pebble(u, v, s, color = STONE) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${x + s * 0.12}" cy="${y + s * 0.18}" rx="${s}" ry="${s * 0.62}" fill="${color.right}"/><ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * 0.66}" fill="${color.left}"/><ellipse cx="${x - s * 0.28}" cy="${y - s * 0.22}" rx="${s * 0.5}" ry="${s * 0.3}" fill="${color.top}"/>`;
}
__name(pebble, "pebble");
function rockBox(u0, v0, u1, v1, z0, z1, c) {
  const h = z1 - z0, du = u1 - u0, dv = v1 - v0;
  const pts2 = /* @__PURE__ */ __name((list) => list.map((q) => P(...q).map((n2) => rnd2(n2)).join(",")).join(" "), "pts2");
  const line2 = /* @__PURE__ */ __name((list, color, w, extra = "") => `<polyline points="${pts2(list)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "line");
  const L = mixHex(c.left, INK_OUT, 0.38), R = mixHex(c.right, INK_OUT, 0.38);
  let out = box(u0, v0, u1, v1, z0, z1, c) + face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z0 + 2.4], [u0, v1, z0 + 2.4]], "rgba(40,30,20,.16)") + face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z0 + 2.4], [u1, v0, z0 + 2.4]], "rgba(40,30,20,.2)");
  const n = Math.floor(h / 14);
  for (let i = 1; i <= n; i++) {
    const z = z0 + h * i / (n + 1), w = i % 2 ? 1.4 : -1.2;
    out += line2([[u0 + du * 0.02, v1, z], [u0 + du * 0.3, v1, z + w], [u0 + du * 0.62, v1, z - w * 0.7], [u1 - du * 0.02, v1, z + w * 0.4]], L, 0.8, ' opacity=".6"') + line2([[u1, v0 + dv * 0.03, z - w * 0.5], [u1, v0 + dv * 0.4, z + w * 0.6], [u1, v0 + dv * 0.75, z - w * 0.3], [u1, v1 - dv * 0.02, z + w * 0.4]], R, 0.8, ' opacity=".6"');
  }
  const e = Math.min(0.035, du * 0.1, dv * 0.1);
  out += line2([[u0 + e, v1 - e, z1], [u1 - e, v1 - e, z1], [u1 - e, v0 + e, z1]], mixHex(c.top, "#FFFFFF", 0.55), 1.1, ' opacity=".9"');
  if (h >= 7) {
    [[0.18, 0.3], [0.47, 0.62], [0.81, 0.4]].forEach(([a, b]) => {
      const [x, y] = P(u0 + du * a, v1, z0 + h * b), [x2, y2] = P(u1, v0 + dv * (1 - a), z0 + h * (1 - b * 0.8));
      out += `<path d="M${rnd2(x - 1.2)},${rnd2(y)} l1.2,-0.8 l1,0.9 Z" fill="${L}" opacity=".55"/><path d="M${rnd2(x2 - 1)},${rnd2(y2)} l1,-0.8 l1.1,0.8 Z" fill="${R}" opacity=".55"/>`;
    });
  }
  if (h >= 20 && du >= 0.3) {
    const cu = u0 + du * 0.7;
    out += line2([[cu, v1, z1], [cu - 0.03, v1, z1 - h * 0.14], [cu + 0.015, v1, z1 - h * 0.26], [cu - 0.02, v1, z1 - h * 0.4]], INK_OUT, 0.9, ' opacity=".75"') + line2([[cu + 0.015, v1, z1 - h * 0.26], [cu + 0.06, v1, z1 - h * 0.32]], INK_OUT, 0.7, ' opacity=".6"');
  }
  if (h >= 20 && dv >= 0.3) {
    const cv = v0 + dv * 0.35;
    out += line2([[u1, cv, z1], [u1, cv + 0.03, z1 - h * 0.12], [u1, cv - 0.01, z1 - h * 0.22], [u1, cv + 0.02, z1 - h * 0.33]], INK_OUT, 0.9, ' opacity=".7"');
  }
  if (h >= 20) {
    const moss = /* @__PURE__ */ __name((a, b, k) => {
      const q = [[-0.05, 0], [0, 0.02], [0.05, 0]].map(([d, dz]) => P(k === "L" ? a + d : u1, k === "L" ? v1 : b + d, z1 + dz * 10));
      const r = [2.2, 2.7, 2];
      return q.map(([x, y], i) => disc2(x, y, r[i] + 0.7, INK_OUT)).join("") + q.map(([x, y], i) => disc2(x, y, r[i], "#6E9E45")).join("") + q.map(([x, y], i) => disc2(x - 0.5, y - 0.6, r[i] * 0.7, "#8CBF5B")).join("") + `<path d="M${rnd2(q[1][0] - 1)},${rnd2(q[1][1] + 2)} q1,3.4 2,0" fill="#6E9E45" stroke="${INK_OUT}" stroke-width="0.6"/>`;
    }, "moss");
    out += (du >= 0.5 ? moss(u0 + du * 0.24, 0, "L") : "") + (dv >= 0.5 ? moss(0, v0 + dv * 0.68, "R") : "");
  }
  return out;
}
__name(rockBox, "rockBox");
function stoneRing(u, v, z0, z1, r, stone2, id, n = 1) {
  const [x, y0] = P(u, v, z0), [, y1] = P(u, v, z1);
  const rx = r * 45.25, ry = r * 22.63;
  const arc = /* @__PURE__ */ __name((yc, k) => `M${rnd2(x - rx * k)},${rnd2(yc)} A${rnd2(rx * k)},${rnd2(ry * k)} 0 0 0 ${rnd2(x + rx * k)},${rnd2(yc)}`, "arc");
  return cylinder(u, v, z0, z1, r, stone2, id) + stoneCourses(u, v, z0, z1, r, n, stone2.top === "#FFFFFF" ? "rgba(120,110,95,.4)" : "rgba(95,85,70,.45)") + `<path d="${arc(y0 - 1.2, 0.99)}" fill="none" stroke="rgba(40,30,20,.2)" stroke-width="2.2"/><path d="${arc(y1, 0.95)}" fill="none" stroke="${mixHex(stone2.top, "#FFFFFF", 0.6)}" stroke-width="1.1"/>`;
}
__name(stoneRing, "stoneRing");
function pool(u, v, z, r, deep = "#4C9CC8", light = "#7CC4E8") {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25, ry = r * 22.63;
  const ripple = /* @__PURE__ */ __name((k2) => `<path d="M${rnd2(x + rx * (0.15 - k2))},${rnd2(y + ry * 0.18)} A${rnd2(rx * k2)},${rnd2(ry * k2)} 0 0 0 ${rnd2(x + rx * (0.15 + k2))},${rnd2(y + ry * 0.18)}" fill="none" stroke="#FFFFFF" stroke-width="0.7" opacity=".6"/>`, "ripple");
  const star2 = /* @__PURE__ */ __name((sx, sy, k2) => `<path d="M${rnd2(sx)},${rnd2(sy - k2)} L${rnd2(sx + k2 * 0.3)},${rnd2(sy - k2 * 0.3)} L${rnd2(sx + k2)},${rnd2(sy)} L${rnd2(sx + k2 * 0.3)},${rnd2(sy + k2 * 0.3)} L${rnd2(sx)},${rnd2(sy + k2)} L${rnd2(sx - k2 * 0.3)},${rnd2(sy + k2 * 0.3)} L${rnd2(sx - k2)},${rnd2(sy)} L${rnd2(sx - k2 * 0.3)},${rnd2(sy - k2 * 0.3)} Z" fill="#FFFFFF"/>`, "star");
  const k = Math.min(2.6, Math.max(1.2, r * 4));
  return `<ellipse cx="${rnd2(x)}" cy="${rnd2(y)}" rx="${rnd2(rx)}" ry="${rnd2(ry)}" fill="${deep}"/><ellipse cx="${rnd2(x)}" cy="${rnd2(y + ry * 0.12)}" rx="${rnd2(rx * 0.92)}" ry="${rnd2(ry * 0.8)}" fill="${mixHex(deep, light, 0.45)}"/><ellipse cx="${rnd2(x - rx * 0.3)}" cy="${rnd2(y - ry * 0.08)}" rx="${rnd2(rx * 0.36)}" ry="${rnd2(ry * 0.3)}" fill="${light}" opacity=".75"/>` + ripple(0.36) + ripple(0.2) + star2(x + rx * 0.5, y - ry * 0.12, k) + star2(x - rx * 0.52, y + ry * 0.36, k * 0.7);
}
__name(pool, "pool");
function cove(u, v, r, light = "#6FC0E4", deep = "#5AAED7") {
  const [x, y] = P(u, v, 0);
  const rx = r * 45.25, ry = r * 22.63;
  const el = /* @__PURE__ */ __name((cx, cy, ax, ay, extra) => `<ellipse cx="${rnd2(cx)}" cy="${rnd2(cy)}" rx="${rnd2(ax)}" ry="${rnd2(ay)}"${extra}/>`, "el");
  const wave2 = /* @__PURE__ */ __name((a, b, k2) => {
    const wx = x + rx * a, wy = y + ry * b;
    return `<path d="M${rnd2(wx - 3 * k2)},${rnd2(wy)} q${rnd2(1.5 * k2)},${rnd2(-1.6 * k2)} ${rnd2(3 * k2)},0 q${rnd2(1.5 * k2)},${rnd2(1.6 * k2)} ${rnd2(3 * k2)},0" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity=".7"/>`;
  }, "wave");
  const star2 = /* @__PURE__ */ __name((sx, sy, k2) => `<path d="M${rnd2(sx)},${rnd2(sy - k2)} L${rnd2(sx + k2 * 0.3)},${rnd2(sy - k2 * 0.3)} L${rnd2(sx + k2)},${rnd2(sy)} L${rnd2(sx + k2 * 0.3)},${rnd2(sy + k2 * 0.3)} L${rnd2(sx)},${rnd2(sy + k2)} L${rnd2(sx - k2 * 0.3)},${rnd2(sy + k2 * 0.3)} L${rnd2(sx - k2)},${rnd2(sy)} L${rnd2(sx - k2 * 0.3)},${rnd2(sy - k2 * 0.3)} Z" fill="#FFFFFF"/>`, "star");
  const k = Math.min(1.6, Math.max(1, r));
  return el(x, y, rx * 1.02, ry * 1.02, ` fill="#EAD9A6" stroke="${INK_OUT}" stroke-width="0.7"`) + el(x, y, rx * 0.93, ry * 0.91, ` fill="${light}"`) + el(x, y - ry * 0.04, rx * 0.8, ry * 0.76, ` fill="${deep}"`) + el(x, y - ry * 0.1, rx * 0.58, ry * 0.48, ` fill="${mixHex(deep, "#2F7FB0", 0.4)}" opacity=".55"`) + el(x, y, rx * 0.87, ry * 0.84, ' fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-dasharray="7 5" opacity=".55"') + [[-0.55, 0.3], [0.5, 0.45], [-0.15, 0.62], [0.62, -0.2], [-0.62, -0.3]].map(([a, b]) => wave2(a, b, k)).join("") + star2(x - rx * 0.4, y + ry * 0.45, 1.8 * k) + star2(x + rx * 0.3, y + ry * 0.7, 1.3 * k);
}
__name(cove, "cove");
function soilBed(u0, v0, u1, v1, h) {
  const du = u1 - u0, dv = v1 - v0;
  const pt = /* @__PURE__ */ __name((q) => P(...q).map((n) => rnd2(n)).join(","), "pt");
  const speck = /* @__PURE__ */ __name((q, rx, c) => {
    const [x, y] = P(...q);
    return `<ellipse cx="${rnd2(x)}" cy="${rnd2(y)}" rx="${rx}" ry="${rnd2(rx * 0.6)}" fill="${c}"/>`;
  }, "speck");
  return box(u0, v0, u1, v1, 0, h, SOIL) + `<polyline points="${pt([u0 + 0.02, v1 - 0.02, h])} ${pt([u1 - 0.02, v1 - 0.02, h])} ${pt([u1 - 0.02, v0 + 0.02, h])}" fill="none" stroke="#B07A50" stroke-width="1" opacity=".9"/>` + [0.12, 0.31, 0.5, 0.66, 0.84].map((a, k) => speck([u0 + du * a, v1, h * (k % 2 ? 0.35 : 0.62)], 1, k % 2 ? "#4E301C" : "#946240")).join("") + [0.2, 0.45, 0.72].map((a, k) => speck([u1, v0 + dv * a, h * (k % 2 ? 0.6 : 0.35)], 0.9, k % 2 ? "#946240" : "#3F2716")).join("") + [[0.08, 0.92], [0.5, 0.95], [0.93, 0.5], [0.95, 0.12]].map(([a, b], k) => speck([u0 + du * a, v0 + dv * b, h], 1.4, k % 2 ? "#7A4E30" : "#A87445")).join("");
}
__name(soilBed, "soilBed");
function furrow(u0, u1, v, w, z) {
  const pt = /* @__PURE__ */ __name((q) => P(...q).map((n) => rnd2(n)).join(","), "pt");
  return face([[u0, v - w, z], [u1, v - w, z], [u1, v + w, z], [u0, v + w, z]], "#6B4329") + `<polyline points="${pt([u0, v - w * 0.4, z])} ${pt([u1, v - w * 0.4, z])}" fill="none" stroke="#5A3820" stroke-width="0.9"/><polyline points="${pt([u0, v + w, z])} ${pt([u1, v + w, z])}" fill="none" stroke="#B07A50" stroke-width="0.9" opacity=".85"/>`;
}
__name(furrow, "furrow");
function leafPair(x, y, rx, ry, d, c1 = "#86CB5E", c2 = "#6DB64C") {
  const leaf2 = /* @__PURE__ */ __name((cx, a, c) => `<g transform="rotate(${a} ${rnd2(cx)} ${rnd2(y - d)})"><ellipse cx="${rnd2(cx)}" cy="${rnd2(y - d)}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${INK_OUT}" stroke-width="0.5"/><line x1="${rnd2(cx - rx * 0.7)}" y1="${rnd2(y - d)}" x2="${rnd2(cx + rx * 0.7)}" y2="${rnd2(y - d)}" stroke="#C8EBA0" stroke-width="0.5" opacity=".8"/></g>`, "leaf");
  return leaf2(x - d, -30, c1) + leaf2(x + d, 30, c2);
}
__name(leafPair, "leafPair");
function shingles(u0, v0, u1, v1, z, h, o = 0.08) {
  if (HIVER) return "";
  const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o, ve = v1 + o;
  const at = /* @__PURE__ */ __name((u, k) => P(u, vm + (ve - vm) * k, z + h * (1 - k)).map((n) => rnd2(n)).join(","), "at");
  return [0.2, 0.4, 0.6, 0.8].map((k, r) => {
    let out = `<polyline points="${at(a, k)} ${at(b, k)}" stroke="rgba(60,35,20,.45)" stroke-width="0.8"/><polyline points="${at(a, k - 0.16)} ${at(b, k - 0.16)}" stroke="rgba(255,235,210,.2)" stroke-width="0.6"/>`;
    for (let u = a + (r % 2 ? 0.07 : 0.14); u < b - 0.03; u += 0.14) out += `<polyline points="${at(u, k - 0.2)} ${at(u, k)}" stroke="rgba(60,35,20,.35)" stroke-width="0.6"/>`;
    return out;
  }).join("");
}
__name(shingles, "shingles");
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
var rnd2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "rnd2");
var disc2 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${rnd2(x)}" cy="${rnd2(y)}" r="${rnd2(r)}" fill="${fill}"/>`, "disc2");
var treeId = /* @__PURE__ */ __name((p, u, v, s) => `${p}${rnd2(u * 100)}_${rnd2(v * 100)}_${rnd2(s * 100)}`.replace(/[.-]/g, (m) => m === "." ? "p" : "m"), "treeId");
function touffe(id, x, y, s, lobes, c) {
  const L = lobes.map(([dx, dy, r, hi2]) => [x + dx * s, y + dy * s, r * s, hi2]);
  const hi = L.filter((l) => l[3] !== 0);
  return L.map(([cx, cy, r]) => disc2(cx, cy, r + 0.9, INK_OUT)).join("") + `<defs><clipPath id="${id}">${L.map(([cx, cy, r]) => disc2(cx, cy, r, "#000")).join("")}</clipPath></defs><g clip-path="url(#${id})">` + L.map(([cx, cy, r]) => disc2(cx, cy, r, c.dark)).join("") + L.map(([cx, cy, r]) => disc2(cx - r * 0.18, cy - r * 0.3, r * 0.86, c.mid)).join("") + hi.map(([cx, cy, r]) => disc2(cx - r * 0.34, cy - r * 0.46, r * 0.46, c.light) + disc2(cx - r * 0.22, cy - r * 0.3, r * 0.46, c.mid)).join("") + hi.map(([cx, cy, r]) => `<path d="M${rnd2(cx + r * 0.05)},${rnd2(cy + r * 0.2)} q${rnd2(r * 0.12)},${rnd2(r * 0.16)} ${rnd2(r * 0.24)},0 q${rnd2(r * 0.12)},${rnd2(r * 0.16)} ${rnd2(r * 0.24)},0" fill="none" stroke="${c.dark}" stroke-width="${rnd2(0.5 + 0.3 * s)}" stroke-linecap="round"/>`).join("") + "</g>";
}
__name(touffe, "touffe");
var backLeaves = /* @__PURE__ */ __name((c) => ({ light: c.mid, mid: mixHex(c.mid, c.dark, 0.55), dark: mixHex(c.dark, "#1E3A22", 0.35) }), "backLeaves");
function treeTrunk(x, y, s, w = 2.4, h = 15) {
  const X = /* @__PURE__ */ __name((dx) => rnd2(x + dx * s), "X"), Y = /* @__PURE__ */ __name((dy) => rnd2(y + dy * s), "Y");
  const d = `M${X(-w - 2.2)},${Y(1.4)} Q${X(-w - 0.2)},${Y(0.2)} ${X(-w)},${Y(-4)} L${X(-w + 0.2)},${Y(-h)} Q${X(-w - 2.6)},${Y(-h - 4)} ${X(-w - 5.2)},${Y(-h - 7)} L${X(-w - 3.2)},${Y(-h - 8.4)} Q${X(-w)},${Y(-h - 5.6)} ${X(0)},${Y(-h - 3.6)} Q${X(w)},${Y(-h - 6)} ${X(w + 3)},${Y(-h - 8.6)} L${X(w + 4.8)},${Y(-h - 6.8)} Q${X(w + 2.2)},${Y(-h - 4)} ${X(w)},${Y(-h)} L${X(w + 0.2)},${Y(-4)} Q${X(w + 0.4)},${Y(0.2)} ${X(w + 2.6)},${Y(1.6)} Q${X(w * 1.1)},${Y(2.6)} ${X(0)},${Y(1.8)} Q${X(-w * 1.1)},${Y(2.6)} ${X(-w - 2.2)},${Y(1.4)} Z`;
  return `<path d="${d}" fill="${WOOD_DARK.left}" stroke="${INK_OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${X(w * 0.25)},${Y(1.6)} L${X(w * 0.4)},${Y(-h)} L${X(w)},${Y(-h)} L${X(w + 0.2)},${Y(-4)} Q${X(w + 0.4)},${Y(0.2)} ${X(w + 2.6)},${Y(1.6)} Q${X(w * 1.1)},${Y(2.6)} ${X(w * 0.25)},${Y(1.6)} Z" fill="${WOOD_DARK.right}"/><path d="M${X(-w * 0.4)},${Y(-4)} q-0.3,-3 0,-6 M${X(w * 0.55)},${Y(-7)} q0.3,-2.6 0,-5" stroke="rgba(40,22,12,.5)" stroke-width="0.6" fill="none" stroke-linecap="round"/>`;
}
__name(treeTrunk, "treeTrunk");
function roundTree(u, v, scale = 1, colors = LEAVES) {
  const s = scale;
  const [x, y] = P(u, v, 0);
  const id = treeId("rt", u, v, s);
  return shadow(u, v, 0.34 * s) + treeTrunk(x, y, s) + touffe(id + "f", x, y, s, [[-8, -34, 9], [6, -37, 10], [14, -27, 7.5], [-15, -26, 7]], backLeaves(colors)) + touffe(id + "a", x, y, s, [[-9, -23, 8.4], [9, -22, 8.4], [0, -29, 9.6], [-1, -18.6, 6.6, 0]], colors);
}
__name(roundTree, "roundTree");
var BLUE_ROOF = { front: "#6FA3D9", back: "#4C7FB5" };
var SLATE_ROOF = { front: "#7D8AA0", back: "#5C6880" };
var WHITE_STONE = { top: "#FFFFFF", left: "#F4F0E8", right: "#D6CFC2" };
var WHITE_WOOD = { top: "#FFFFFF", left: "#F3EFE6", right: "#CFC8BA" };
var ROCKS = {
  "roche-ocre": { top: "#F2CD95", left: "#D9A464", right: "#B07A3F" },
  "roche-granit": { top: "#D3CBD1", left: "#A99FA8", right: "#7F7584" },
  "roche-cristal": STONE
};
var FOLIAGE = {
  printemps: { light: "#D9F2A6", mid: "#A7DB78", dark: "#6FAE4C" },
  automne: { light: "#FFD27A", mid: "#F2994A", dark: "#C8622A" },
  givre: { light: "#FFFFFF", mid: "#D8E8F3", dark: "#A6C1D6" }
};
var SAILS = { "voile-rouge": ["#E2574C", "#B13A31"], "voile-bleue": ["#6FA3D9", "#4C7FB5"], "voile-rayee": ["stripes", "#E2574C"] };
function roofOf(skin2, fallback) {
  if (skin2 === "toit-rouge" || skin2 === "toit-rouge-foyer") return { front: "#E06E52", back: "#B9503B" };
  if (skin2 === "toit-bleu" || skin2 === "toit-bleu-foyer") return BLUE_ROOF;
  if (skin2 === "toit-chaume" || skin2 === "toit-chaume-foyer") return { front: "#EBC46F", back: "#C99A45" };
  if (skin2 === "toit-ardoise") return SLATE_ROOF;
  return fallback;
}
__name(roofOf, "roofOf");
function seasonDots(skin2, x, y, r) {
  if (skin2 === "printemps") {
    return [[-0.5, -0.3], [0.3, -0.5], [0.55, 0.1], [-0.1, 0.2], [-0.6, 0.3]].map(([dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * 0.13}" fill="#F7A8C8"/><circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * 0.05}" fill="#FFE07A"/>`).join("");
  }
  if (skin2 === "givre") return `<path d="M${x - r * 0.8},${y - r * 0.35} Q${x},${y - r * 1.25} ${x + r * 0.8},${y - r * 0.35} Q${x},${y - r * 0.7} ${x - r * 0.8},${y - r * 0.35} Z" fill="#FFFFFF" opacity=".95"/>`;
  return "";
}
__name(seasonDots, "seasonDots");
function crystals(u, v, z, s = 1) {
  const [x, y] = P(u, v, z);
  return `<path d="M${x - 4 * s},${y} L${x - 2 * s},${y - 9 * s} L${x},${y} Z" fill="#B9A0F0"/><path d="M${x - 2 * s},${y - 9 * s} L${x},${y} L${x - 0.5 * s},${y - 1 * s} Z" fill="#8E73E0"/><path d="M${x},${y} L${x + 3 * s},${y - 12 * s} L${x + 6 * s},${y} Z" fill="#9FD3F2"/><path d="M${x + 3 * s},${y - 12 * s} L${x + 6 * s},${y} L${x + 4 * s},${y} Z" fill="#6FAED9"/>`;
}
__name(crystals, "crystals");
var ROOF_KIND = {
  "toit-rouge": "tiles",
  "toit-bleu": "slate",
  "toit-bleu-foyer": "slate",
  "toit-ardoise": "slate",
  "toit-chaume": "thatch",
  "toit-chaume-foyer": "thatch"
};
function roofTexture(skin2, u0, v0, u1, v1, z, h, o = 0.08) {
  if (HIVER) return "";
  const kind = ROOF_KIND[skin2];
  if (!kind) return "";
  const vm = (v0 + v1) / 2;
  const a = u0 - o;
  const b = u1 + o;
  const ve = v1 + o;
  const at = /* @__PURE__ */ __name((u, k) => P(u, vm + (ve - vm) * k, z + h * (1 - k)).map((n) => Math.round(n * 100) / 100).join(","), "at");
  const rows = [0.2, 0.4, 0.6, 0.8, 1];
  let out = "";
  if (kind === "tiles") {
    const n = Math.max(4, Math.round((b - a) / 0.12));
    const du = (b - a) / n;
    for (const k of rows) {
      let d = `M${at(a, k)}`;
      for (let i = 0; i < n; i++) d += ` Q${at(a + (i + 0.5) * du, k + 0.09)} ${at(a + (i + 1) * du, k)}`;
      out += `<path d="${d}" fill="none" stroke="rgba(110,35,20,.45)" stroke-width="0.9"/><polyline points="${at(a, k - 0.06)} ${at(b, k - 0.06)}" stroke="rgba(255,220,200,.25)" stroke-width="0.7"/>`;
    }
  } else if (kind === "slate") {
    const du = 0.15;
    rows.forEach((k, r) => {
      out += `<polyline points="${at(a, k)} ${at(b, k)}" stroke="rgba(25,35,55,.4)" stroke-width="0.8"/>`;
      for (let u = a + (r % 2 ? du / 2 : du); u < b - 0.02; u += du) out += `<polyline points="${at(u, k - 0.2)} ${at(u, k)}" stroke="rgba(25,35,55,.3)" stroke-width="0.6"/>`;
      out += `<polyline points="${at(a, k - 0.17)} ${at(b, k - 0.17)}" stroke="rgba(255,255,255,.18)" stroke-width="0.6"/>`;
    });
  } else {
    for (let k = 0.12; k <= 1.01; k += 0.13) {
      for (let u = a + 0.02; u < b - 0.02; u += 0.055) {
        const j = Math.sin(u * 91 + k * 37) * 0.012;
        out += `<polyline points="${at(u + j, k - 0.11)} ${at(u + j + 0.012, k)}" stroke="rgba(150,105,40,.5)" stroke-width="0.6"/>`;
      }
    }
    out += `<polyline points="${at(a, 1.02)} ${at(b, 1.02)}" stroke="#A97B32" stroke-width="2" stroke-dasharray="1.6 1.4"/>`;
  }
  return out;
}
__name(roofTexture, "roofTexture");
function roofTextureOf(skin2, base, ...geo) {
  return roofTexture(ROOF_KIND[skin2] ? skin2 : base, ...geo);
}
__name(roofTextureOf, "roofTextureOf");
function stoneCourses(u, v, z0, z1, r, n = 2, color = "rgba(120,110,95,.4)") {
  const [x, y] = P(u, v, 0);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const f = /* @__PURE__ */ __name((k) => Math.round(k * 100) / 100, "f");
  let out = "";
  for (let i = 0; i <= n; i++) {
    const z = z0 + (z1 - z0) * i / (n + 1);
    if (i > 0) out += `<path d="M${f(x - rx)},${f(y - z)} A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(y - z)}" fill="none" stroke="${color}" stroke-width="0.7"/>`;
    const top = z0 + (z1 - z0) * (i + 1) / (n + 1);
    for (let a = i % 2 ? 0.35 : 0.7; a < Math.PI - 0.2; a += 0.7) {
      const px = x + rx * Math.cos(a);
      const py = y + ry * Math.sin(a);
      out += `<line x1="${f(px)}" y1="${f(py - z)}" x2="${f(px)}" y2="${f(py - top)}" stroke="${color}" stroke-width="0.6"/>`;
    }
  }
  return out;
}
__name(stoneCourses, "stoneCourses");

// atelier/port/src/world/tiers/kit.js
var BIG_BOX = { x: -112, y: -200, w: 224, h: 264 };
var big = /* @__PURE__ */ __name((body) => sprite(body, BIG_BOX), "big");
var f2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var xy = /* @__PURE__ */ __name(([x, y]) => `${f2(x)},${f2(y)}`, "xy");
var ln = /* @__PURE__ */ __name((a, b, color, w = 1.2, extra = "") => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`, "ln");
var poly = /* @__PURE__ */ __name((points, fill, extra = "") => `<polygon points="${points.map(xy).join(" ")}" fill="${fill}"${extra}/>`, "poly");
var ell = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`, "dot");
var OUT = "#3C2819";
var DARK_STONE = { top: "#B9B2A2", left: "#968E7C", right: "#736B5B" };
var PLASTER = { top: "#FFF8EA", left: "#F6E9CF", right: "#DCC9A6" };
var TIMBER = "#7A4E2C";
var IRON = { top: "#B4BEC8", left: "#8E99A4", right: "#68737E" };
var GOLD = { top: "#FFE08A", left: "#F2C04B", right: "#C8952A" };
function cone(u, v, z, r, h, colors, id) {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const apex = y - h;
  const ty = h > ry ? y - ry * ry / h : y;
  const tx = h > ry ? rx * Math.sqrt(Math.max(0, 1 - ((y - ty) / ry) ** 2)) : rx;
  return `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${colors.light}"/><stop offset="1" stop-color="${colors.dark}"/></linearGradient></defs><path d="M${f2(x)},${f2(apex)} L${f2(x + tx)},${f2(ty)} A${f2(rx)},${f2(ry)} 0 1 1 ${f2(x - tx)},${f2(ty)} Z" fill="url(#${id})" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y)}" fill="none" stroke="rgba(40,30,50,.35)" stroke-width="1.2"/>` + (HIVER ? `<defs><clipPath id="${id}-neige"><path d="M${f2(x)},${f2(apex)} L${f2(x + tx)},${f2(ty)} A${f2(rx)},${f2(ry)} 0 1 1 ${f2(x - tx)},${f2(ty)} Z"/></clipPath></defs><g clip-path="url(#${id}-neige)"><ellipse cx="${f2(x + 1)}" cy="${f2(apex + h * 0.12)}" rx="${f2(rx * 0.8)}" ry="${f2(h * 0.5)}" fill="${NEIGE.shade}"/><ellipse cx="${f2(x)}" cy="${f2(apex)}" rx="${f2(rx * 0.8)}" ry="${f2(h * 0.5)}" fill="${NEIGE.light}"${EDGE}/></g>` : "");
}
__name(cone, "cone");
function tower(u, v, r, z0, z1, { stone: stone2 = STONE, roof = { light: "#86B6E6", dark: "#3F6FA3" }, roofH = 26, id = "t" } = {}) {
  const [x, y] = P(u, v, z1);
  let slits = "";
  for (let k = 0; k < 2; k++) {
    const [sx, sy] = P(u - r * 0.3 + k * r * 0.6, v + r * 0.5, z0 + (z1 - z0) * (0.45 + k * 0.2));
    slits += `<rect x="${f2(sx - 1)}" y="${f2(sy - 3)}" width="2" height="6" rx="1" fill="#3A2A1E"/>`;
  }
  return cylinder(u, v, z0, z1, r, stone2, `${id}-wall`) + `<path d="M${f2(x - r * 45.25)},${f2(y + 3)} A${f2(r * 45.25)},${f2(r * 22.63)} 0 0 0 ${f2(x + r * 45.25)},${f2(y + 3)}" fill="none" stroke="rgba(90,80,65,.35)" stroke-width="0.8"/>` + slits + cone(u, v, z1, r * 1.18, roofH, roof, `${id}-roof`) + ln([x, y - roofH], [x, y - roofH - 7], "#7A5A3A", 1.2) + dot(x, y - roofH - 8, 1.8, GOLD.left);
}
__name(tower, "tower");
function chimney(u, v, z0, z1, s = 0.08, colors = BRICK) {
  const c = s + 0.02, [cx, cy] = P(u, v, z1 + 2.5);
  return box(u - s, v - s, u + s, v + s, z0, z1, colors) + box(u - s - 0.02, v - s - 0.02, u + s + 0.02, v + s + 0.02, z1, z1 + 2.5, DARK_STONE) + (HIVER ? `<path d="M${f2(cx - c * 32 - 1)},${f2(cy)} Q${f2(cx - c * 32)},${f2(cy - c * 16 - 3)} ${f2(cx)},${f2(cy - c * 16 - 3.4)} Q${f2(cx + c * 32)},${f2(cy - c * 16 - 3)} ${f2(cx + c * 32 + 1)},${f2(cy)} Q${f2(cx)},${f2(cy + c * 16 + 0.6)} ${f2(cx - c * 32 - 1)},${f2(cy)} Z" fill="${NEIGE.light}"${EDGE}/>` : "");
}
__name(chimney, "chimney");
function pavedPath(a, b, w = 0.22) {
  const [ua, va] = a;
  const [ub, vb] = b;
  const len = Math.hypot(ub - ua, vb - va);
  const nu = -(vb - va) / len * (w / 2);
  const nv = (ub - ua) / len * (w / 2);
  let out = face([[ua + nu, va + nv, 0.3], [ub + nu, vb + nv, 0.3], [ub - nu, vb - nv, 0.3], [ua - nu, va - nv, 0.3]], "#E2D3B4");
  const n = Math.max(2, Math.round(len / 0.14));
  for (let k = 0; k < n; k++) {
    const t0 = (k + 0.1) / n;
    const t1 = (k + 0.9) / n;
    const side = k % 2 ? 0.5 : 0;
    const p = /* @__PURE__ */ __name((t, s) => [ua + (ub - ua) * t + nu * s, va + (vb - va) * t + nv * s, 0.5], "p");
    out += face([p(t0, -0.85 + side), p(t1, -0.85 + side), p(t1, side - 0.05), p(t0, side - 0.05)], "#F0E4C8", ' stroke="rgba(150,130,100,.35)" stroke-width="0.5"');
  }
  return out;
}
__name(pavedPath, "pavedPath");
function lampPost(u, v, h = 26) {
  const [x, y] = P(u, v, h);
  return box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 0, h, { top: "#3D3A36", left: "#55504A", right: "#3D3A36" }) + `<path d="M${f2(x - 3.4)},${f2(y)} L${f2(x - 2.4)},${f2(y - 6)} L${f2(x + 2.4)},${f2(y - 6)} L${f2(x + 3.4)},${f2(y)} Z" fill="#FFE08A" stroke="#3D3A36" stroke-width="0.8"/><path d="M${f2(x - 3.8)},${f2(y - 6)} L${f2(x)},${f2(y - 9)} L${f2(x + 3.8)},${f2(y - 6)} Z" fill="#3D3A36"/>`;
}
__name(lampPost, "lampPost");
function flowerBed(u, v, r = 0.18, colors = ["#F7A8C8", "#FFD45E", "#FFFFFF", "#E2574C"]) {
  let out = disc(u, v, 0.2, r, "#7FBF5C");
  for (let k = 0; k < 9; k++) {
    const a = k * 2.4;
    const [x, y] = P(u + Math.cos(a) * r * 0.7 * (k % 3 / 3 + 0.4), v + Math.sin(a) * r * 0.7 * (k % 3 / 3 + 0.4), 3);
    out += dot(x, y, 1.6, colors[k % colors.length]) + dot(x, y, 0.6, "#FFF4C0");
  }
  return out;
}
__name(flowerBed, "flowerBed");
function shuttered(ua, ub, vf, z0, z1, shutter = "#5C83C2", glass = "#FFE6A3") {
  const w = (ub - ua) * 0.42;
  return face([[ua, vf, z0], [ub, vf, z0], [ub, vf, z1], [ua, vf, z1]], glass, ' stroke="#FFFFFF" stroke-width="1"') + ln(P((ua + ub) / 2, vf, z0), P((ua + ub) / 2, vf, z1), "#FFFFFF", 0.8) + ln(P(ua, vf, (z0 + z1) / 2), P(ub, vf, (z0 + z1) / 2), "#FFFFFF", 0.8) + face([[ua - w, vf, z0], [ua, vf, z0], [ua, vf, z1], [ua - w, vf, z1]], shutter, EDGE) + face([[ub, vf, z0], [ub + w, vf, z0], [ub + w, vf, z1], [ub, vf, z1]], shutter, EDGE);
}
__name(shuttered, "shuttered");
function windowR(uf, va, vb, z0, z1, glass = "#FFE6A3") {
  return face([[uf, va, z0], [uf, vb, z0], [uf, vb, z1], [uf, va, z1]], glass, ' stroke="#FFFFFF" stroke-width="1"') + ln(P(uf, (va + vb) / 2, z0), P(uf, (va + vb) / 2, z1), "#FFFFFF", 0.8);
}
__name(windowR, "windowR");
function boardsLeft(u0, u1, vf, z0, z1, step = 0.07, color = "rgba(60,35,15,.3)") {
  let out = "";
  for (let u = u0 + step; u < u1 - 0.01; u += step) out += ln(P(u, vf, z0), P(u, vf, z1), color, 0.6);
  return out;
}
__name(boardsLeft, "boardsLeft");
function timberLeft(u0, u1, vf, z0, z1) {
  const n = Math.max(2, Math.round((u1 - u0) / 0.22));
  const du = (u1 - u0) / n;
  let out = ln(P(u0, vf, z0), P(u1, vf, z0), TIMBER, 1.6) + ln(P(u0, vf, z1), P(u1, vf, z1), TIMBER, 1.6);
  for (let k = 0; k <= n; k++) out += ln(P(u0 + k * du, vf, z0), P(u0 + k * du, vf, z1), TIMBER, 1.4);
  for (let k = 0; k < n; k += 2) out += ln(P(u0 + k * du, vf, z0), P(u0 + (k + 1) * du, vf, z1), TIMBER, 1.1) + ln(P(u0 + (k + 1) * du, vf, z0), P(u0 + k * du, vf, z1), TIMBER, 1.1);
  return out;
}
__name(timberLeft, "timberLeft");
function timberRight(uf, v0, v1, z0, z1) {
  const n = Math.max(2, Math.round((v1 - v0) / 0.22));
  const dv = (v1 - v0) / n;
  let out = ln(P(uf, v0, z0), P(uf, v1, z0), TIMBER, 1.6) + ln(P(uf, v0, z1), P(uf, v1, z1), TIMBER, 1.6);
  for (let k = 0; k <= n; k++) out += ln(P(uf, v0 + k * dv, z0), P(uf, v0 + k * dv, z1), TIMBER, 1.4);
  return out;
}
__name(timberRight, "timberRight");
function courseLeft(u0, u1, vf, z0, z1, rows = 3, color = "rgba(90,80,65,.32)") {
  let out = "";
  const dz = (z1 - z0) / rows;
  for (let r = 1; r < rows; r++) out += ln(P(u0, vf, z0 + r * dz), P(u1, vf, z0 + r * dz), color, 0.6);
  for (let r = 0; r < rows; r++) {
    for (let u = u0 + (r % 2 ? 0.07 : 0.14); u < u1 - 0.03; u += 0.14) out += ln(P(u, vf, z0 + r * dz), P(u, vf, z0 + (r + 1) * dz), color, 0.5);
  }
  return out;
}
__name(courseLeft, "courseLeft");
function courseRight(uf, v0, v1, z0, z1, rows = 3, color = "rgba(70,60,45,.32)") {
  let out = "";
  const dz = (z1 - z0) / rows;
  for (let r = 1; r < rows; r++) out += ln(P(uf, v0, z0 + r * dz), P(uf, v1, z0 + r * dz), color, 0.6);
  for (let r = 0; r < rows; r++) {
    for (let v = v0 + (r % 2 ? 0.07 : 0.14); v < v1 - 0.03; v += 0.14) out += ln(P(uf, v, z0 + r * dz), P(uf, v, z0 + (r + 1) * dz), color, 0.5);
  }
  return out;
}
__name(courseRight, "courseRight");
function barrel(u, v, id, h = 12) {
  const [x, y] = P(u, v, 0);
  return disc(u + 0.1, v + 0.02, 0, 0.13, "rgba(40,55,20,.2)") + cylinder(u, v, 0, h, 0.1, { top: "#C9935E", left: WOOD.left, right: WOOD.right }, id) + `<path d="M${f2(x - 7.1)},${f2(y - h * 0.25)} A7.1,3.55 0 0 0 ${f2(x + 7.1)},${f2(y - h * 0.25)} M${f2(x - 7.1)},${f2(y - h * 0.78)} A7.1,3.55 0 0 0 ${f2(x + 7.1)},${f2(y - h * 0.78)}" stroke="#5E3A22" stroke-width="1" fill="none"/>`;
}
__name(barrel, "barrel");
function crate(u, v, s = 0.13, h = 10) {
  const [x, y] = P(u, v + s, h / 2);
  return box(u - s, v - s, u + s, v + s, 0, h, { top: "#E0B47A", left: "#C99359", right: "#A06F3C" }) + ln([x - 6, y - 3], [x + 2, y + 3], "rgba(90,55,25,.5)", 0.8);
}
__name(crate, "crate");
function archLeft(uc, w, vf, z0, h, fill = "#3A2A1E", extra = "") {
  const pts2 = [[uc - w, vf, z0], [uc - w, vf, z0 + h - w * 32]];
  for (let k = 1; k < 12; k++) {
    const a = Math.PI - k / 12 * Math.PI;
    pts2.push([uc + Math.cos(a) * w, vf, z0 + h - w * 32 + Math.sin(a) * w * 32]);
  }
  pts2.push([uc + w, vf, z0 + h - w * 32], [uc + w, vf, z0]);
  return face(pts2, fill, extra);
}
__name(archLeft, "archLeft");
function dormer(u, w, vm, ve, zr, ze, k, roof) {
  const v = vm + (ve - vm) * k;
  const z0 = zr + (ze - zr) * k;
  const h = 11;
  return face([[u - w, v, z0], [u + w, v, z0], [u + w, v, z0 + h], [u - w, v, z0 + h]], PLASTER.left, EDGE) + face([[u - w * 0.6, v, z0 + 1.5], [u + w * 0.6, v, z0 + 1.5], [u + w * 0.6, v, z0 + h - 1.5], [u - w * 0.6, v, z0 + h - 1.5]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"') + face([[u + w, v, z0], [u + w, v - 0.12, z0 + 4], [u + w, v - 0.12, z0 + h], [u + w, v, z0 + h]], PLASTER.right, EDGE) + face([[u - w - 0.03, v + 0.02, z0 + h], [u, v + 0.02, z0 + h + 7], [u, v - 0.14, z0 + h + 7], [u - w - 0.03, v - 0.14, z0 + h]], roof.back, EDGE) + (HIVER ? snowPan(P(u, v - 0.14, z0 + h + 7), P(u, v + 0.02, z0 + h + 7), P(u - w - 0.03, v + 0.02, z0 + h), P(u - w - 0.03, v - 0.14, z0 + h), 0.8) : "") + face([[u + w + 0.03, v + 0.02, z0 + h], [u, v + 0.02, z0 + h + 7], [u, v - 0.14, z0 + h + 7], [u + w + 0.03, v - 0.14, z0 + h]], roof.front, EDGE) + (HIVER ? snowPan(P(u, v - 0.14, z0 + h + 7), P(u, v + 0.02, z0 + h + 7), P(u + w + 0.03, v + 0.02, z0 + h), P(u + w + 0.03, v - 0.14, z0 + h), 0.8) : "");
}
__name(dormer, "dormer");
var bigShadow = /* @__PURE__ */ __name((rx = 82, ry = 38) => `<ellipse cx="8" cy="${f2(P(0, 0, 0)[1] + 6)}" rx="${rx}" ry="${ry}" fill="rgba(40,55,20,.12)"/>`, "bigShadow");

// atelier/port/src/world/sprites.js
var f22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var ln2 = /* @__PURE__ */ __name((a, b, color, w = 1.2) => `<line x1="${f22(a[0])}" y1="${f22(a[1])}" x2="${f22(b[0])}" y2="${f22(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "ln");
var ell2 = /* @__PURE__ */ __name((x, y, rx, ry, fill) => `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${rx}" ry="${ry}" fill="${fill}"/>`, "ell");
function lyingLog(u0, v0, u1, v1, z, r, c = WOOD_DARK) {
  const near = u1 + v1 >= u0 + v0;
  const e = P(near ? u1 : u0, near ? v1 : v0, z + r), g = P(near ? u0 : u1, near ? v0 : v1, z + r);
  const dx = e[0] - g[0], dy = e[1] - g[1], n = Math.hypot(dx, dy) || 1;
  const ang = f22(Math.atan2(dy, dx) * 180 / Math.PI);
  const seg = /* @__PURE__ */ __name((k0, k1, oy, w, col, cap = "butt") => `<line x1="${f22(g[0] + dx * k0)}" y1="${f22(g[1] + dy * k0 + oy)}" x2="${f22(g[0] + dx * k1)}" y2="${f22(g[1] + dy * k1 + oy)}" stroke="${col}" stroke-width="${f22(w)}" stroke-linecap="${cap}"/>`, "seg");
  const k = Math.min(0.45, r * 0.9 / n);
  return seg(0, 1, 0, 2 * r + 1.6, "#3C2819", "round") + seg(0, 1, 0, 2 * r, c.left, "round") + seg(k, 1 - k, -r * 0.45, r * 0.55, c.top) + seg(k, 1 - k, r * 0.5, r * 0.5, c.right) + `<g transform="rotate(${ang} ${f22(e[0])} ${f22(e[1])})"><ellipse cx="${f22(e[0])}" cy="${f22(e[1])}" rx="${f22(r * 0.55)}" ry="${f22(r)}" fill="#E7C08A" stroke="#3C2819" stroke-width="0.7"/><ellipse cx="${f22(e[0])}" cy="${f22(e[1])}" rx="${f22(r * 0.28)}" ry="${f22(r * 0.52)}" fill="none" stroke="#B98552" stroke-width="0.6"/></g>`;
}
__name(lyingLog, "lyingLog");
function ringStone(u, v, s) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${f22(s)}" ry="${f22(s * 0.68)}" fill="${STONE.right}" stroke="#3C2819" stroke-width="0.7"/><ellipse cx="${f22(x - s * 0.12)}" cy="${f22(y - s * 0.16)}" rx="${f22(s * 0.8)}" ry="${f22(s * 0.48)}" fill="${STONE.left}"/><ellipse cx="${f22(x - s * 0.3)}" cy="${f22(y - s * 0.3)}" rx="${f22(s * 0.38)}" ry="${f22(s * 0.2)}" fill="${STONE.top}"/>`;
}
__name(ringStone, "ringStone");
function fireRing(u, v, s = 1) {
  const ring = Array.from({ length: 9 }, (_, k) => {
    const a = k / 9 * Math.PI * 2;
    return { u: u + Math.cos(a) * 0.36 * s, v: v + Math.sin(a) * 0.36 * s, r: 5.2 * s * (0.86 + 0.28 * (k * 37 % 10 / 10)) };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  const back = ring.filter((p) => p.u + p.v < u + v), front = ring.filter((p) => p.u + p.v >= u + v);
  const [x, y] = P(u, v, 0.5);
  const coals = [[-5, 1, "#E2574C"], [4, -1, "#F28A3A"], [-1, 3, "#FFD27A"], [6, 2.5, "#E2574C"], [-6.5, -1.5, "#F28A3A"]].map(([dx, dy, c]) => `<ellipse cx="${f22(x + dx * s)}" cy="${f22(y + dy * s)}" rx="${f22(1.8 * s)}" ry="${f22(1.1 * s)}" fill="${c}"/>`).join("");
  return back.map((p) => ringStone(p.u, p.v, p.r)).join("") + disc(u, v, 0.5, 0.24 * s, "#4A3426") + disc(u, v, 0.5, 0.17 * s, "#6B4A33") + coals + lyingLog(u - 0.24 * s, v + 0.03 * s, u + 0.2 * s, v + 0.03 * s, 0, 2.6 * s, WOOD_DARK) + lyingLog(u + 0.02 * s, v - 0.24 * s, u + 0.02 * s, v + 0.2 * s, 2.4 * s, 2.4 * s, WOOD) + front.map((p) => ringStone(p.u, p.v, p.r)).join("");
}
__name(fireRing, "fireRing");
function seatCloth(skin2) {
  const roof = roofOf(skin2, null);
  if (!roof) return "";
  const thatch = skin2 === "toit-chaume-foyer";
  const [ax, ay] = P(0.47, -0.52, 8.6), [bx, by] = P(0.77, -0.52, 8.6);
  const d = 8;
  const back = `<path d="M${f22(ax - 1)},${f22(ay - 0.4)} Q${f22((ax + bx) / 2 + 1)},${f22((ay + by) / 2 - 4.4)} ${f22(bx + 1)},${f22(by - 0.4)} Z" fill="${roof.back}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  const front = `<path d="M${f22(ax - 1)},${f22(ay - 0.6)} Q${f22((ax + bx) / 2)},${f22((ay + by) / 2 - 2.2)} ${f22(bx + 1)},${f22(by - 0.6)} L${f22(bx - 0.6)},${f22(by + d)} Q${f22((ax + bx) / 2)},${f22((ay + by) / 2 + d + 1.4)} ${f22(ax - 2.2)},${f22(ay + d)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  const at = /* @__PURE__ */ __name((k, t) => [ax - 1 - 1.2 * t + (bx + 1 - (ax - 1) + 0.6 * t) * k, ay - 0.6 + (by - ay) * k + (d + 0.6) * t], "at");
  let deco = "";
  if (thatch) {
    for (let k = 0.18; k < 0.95; k += 0.16) deco += ln2(at(k, 0.1), at(k, 0.92), "rgba(140,95,35,.55)", 0.6);
    for (let t = 0.3; t < 0.95; t += 0.3) deco += ln2(at(0.05, t), at(0.95, t), "rgba(140,95,35,.4)", 0.5);
  } else if (skin2 === "toit-rouge") {
    deco = ln2(at(0.03, 0.62), at(0.97, 0.62), "#FFE3B8", 1.3) + ln2(at(0.03, 0.78), at(0.97, 0.78), "#FFE3B8", 0.6);
  } else {
    for (let k = 0.1; k < 0.95; k += 0.14) deco += ln2(at(k, 1), [at(k, 1)[0] - 0.3, at(k, 1)[1] + 2], "#DCE8F6", 0.7);
    deco += ln2(at(0.04, 0.5), at(0.96, 0.5), "rgba(255,255,255,.55)", 0.9);
  }
  return back + front + deco + ln2(at(0.5, 0.15), at(0.47, 0.85), "rgba(0,0,0,.14)", 1) + ln2(at(0.1, 0.05), at(0.9, 0.05), "rgba(255,255,255,.35)", 0.8);
}
__name(seatCloth, "seatCloth");
function campfire(skin2) {
  const seat = shadow(0.62, -0.5, 0.3, 0.18) + lyingLog(0.42, -0.52, 0.82, -0.52, 0, 4, WOOD) + seatCloth(skin2);
  const [tx, ty] = P(-0.55, 0.55, 9);
  const stump = shadow(-0.55, 0.55, 0.2, 0.18) + cylinder(-0.55, 0.55, 0, 9, 0.14, { top: "#E7C08A", left: WOOD.left, right: WOOD.right }, "stumpg") + `<ellipse cx="${f22(tx)}" cy="${f22(ty)}" rx="3.8" ry="1.9" fill="none" stroke="#B98552" stroke-width="0.6"/><ellipse cx="${f22(tx)}" cy="${f22(ty)}" rx="1.6" ry="0.8" fill="none" stroke="#B98552" stroke-width="0.6"/>`;
  return sprite(shadow(0, 0, 0.6, 0.16) + seat + fireRing(0, 0) + stump, BUILDING_BOX);
}
__name(campfire, "campfire");
var SHELTER_FIRE = [0.5, 0.36];
var BRUSH = { front: "#B5A16A", back: "#8A7446" };
function shelter(skin2) {
  const u0 = -0.72, u1 = 0.24, v0 = -0.86, v1 = -0.04, z = 1, h = 36, o = 0.1;
  const vm = (v0 + v1) / 2;
  const a = u0 - o, b = u1 + o;
  const roof = roofOf(skin2, BRUSH);
  const poles = /* @__PURE__ */ __name((u) => ln2(P(u, v0 - o - 0.04, z - 1), P(u, vm + 0.14, z + h + 9), WOOD_DARK.right, 1.8) + ln2(P(u, v1 + o + 0.04, z - 1), P(u, vm - 0.14, z + h + 9), WOOD_DARK.right, 1.8), "poles");
  const at = /* @__PURE__ */ __name((u, k) => P(u, vm + (v1 + o - vm) * k, z + h * (1 - k)), "at");
  let brush = "";
  if (!skin2) {
    for (let k = 0.16; k < 1; k += 0.2) {
      for (let u = a + 0.04; u < b - 0.04; u += 0.1) {
        const j = Math.sin(u * 53 + k * 29) * 0.03;
        brush += ln2(at(u + j, k - 0.12), at(u + j + 0.05, k + 0.06), k > 0.5 ? "#6E7F3E" : "#7E6A3C", 1.1);
      }
    }
  }
  const [fx, fy] = P(u1 - 0.18, vm + 0.02, 1);
  return sprite(
    shadow(-0.1, -0.3, 1, 0.18) + disc(0.05, 0.1, 0, 0.75, "rgba(150,120,80,.18)") + poles(a) + face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], roof.back, EDGE) + (HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v0 - o, z), P(a, v0 - o, z), 0.9) : "") + face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], "#3B2A1C", EDGE) + ell2(fx, fy, 11, 4.2, "#C9A27A") + ell2(fx - 2, fy - 1, 7, 2.6, "#E3C9A4") + ell2(fx + 6, fy - 4, 4, 3, "#8C5A3C") + face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], roof.front, EDGE) + (HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v1 + o, z), P(a, v1 + o, z), 0.8, true) : brush) + ln2(P(a - 0.06, vm, z + h + 1), P(b + 0.06, vm, z + h + 1), WOOD_DARK.left, 2.2) + poles(b) + shadow(-0.4, 0.42, 0.2, 0.16) + lyingLog(-0.58, 0.42, -0.24, 0.42, 0, 3.4, WOOD) + shadow(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.34, 0.14) + fireRing(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.62),
    BUILDING_BOX
  );
}
__name(shelter, "shelter");
var CABIN_CHIMNEY = [0.3, -0.27];
function hut(skin2) {
  const u0 = -0.55, u1 = 0.55, v0 = -0.45, v1 = 0.45, h = 26;
  const roof = roofOf(skin2, THATCH);
  const thatch = !skin2;
  const [cu, cv] = CABIN_CHIMNEY;
  const logs = Array.from({ length: 7 }, (_, k) => {
    const [x, y] = P(-0.5 + k % 4 * 0.08 + (k >= 4 ? 0.04 : 0), v1 + 0.08, 3 + (k >= 4 ? 5 : 0));
    return `<circle cx="${x}" cy="${y}" r="2.8" fill="${WOOD.top}" stroke="${WOOD_DARK.right}" stroke-width="0.8"/>`;
  }).join("");
  return sprite(
    shadow(0, 0, 0.95) + box(u0, v0, u1, v1, 0, h, WOOD) + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h) + doorLeft(-0.12, 0.16, v1, 17) + windowRight(u1, -0.22, 0.08, 10, 18) + box(cu - 0.09, cv - 0.09, cu + 0.09, cv + 0.09, h, h + 34, STONE) + gable(u0, v0, u1, v1, h, 24, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.12) + roofTexture(skin2, u0, v0, u1, v1, h, 24, 0.12) + (thatch ? `<polyline points="${[P(-0.67, 0.57, h), P(0.67, 0.57, h)].map((p) => p.join(",")).join(" ")}" stroke="#B88A3A" stroke-width="1.6" stroke-dasharray="2 3"/>` : "") + box(-0.56, v1 + 0.02, -0.2, v1 + 0.14, 0, 1.5, WOOD_DARK) + logs,
    BUILDING_BOX
  );
}
__name(hut, "hut");
function fissure(skin2) {
  const rock = ROCKS[skin2] || STONE;
  const crack = [[-0.3, 0], [-0.22, 0], [-0.25, 9], [-0.19, 17], [-0.24, 26], [-0.2, 33], [-0.23, 40], [-0.27, 40], [-0.26, 33], [-0.3, 25], [-0.26, 16], [-0.32, 8]];
  const glint = /* @__PURE__ */ __name((u, z, c) => {
    const [x, y] = P(u, -0.2, z);
    return `<path d="M${f22(x)},${f22(y - 2)} l1.2,2 l-1.2,2 l-1.2,-2 Z" fill="${c}"/>`;
  }, "glint");
  const [px, py] = P(-0.58, 0.18, 0);
  const [sx, sy] = P(0.5, 0.32, 0);
  return sprite(
    shadow(0, -0.2, 1.1, 0.18) + rockBox(-0.95, -0.9, 0.6, -0.2, 0, 40, rock) + rockBox(0.3, -0.2, 0.82, 0.12, 0, 16, rock) + face(crack.map(([u, z]) => [u, -0.2, z]), "#1F1A17") + glint(-0.25, 12, "#F2C04B") + glint(-0.23, 24, skin2 === "roche-cristal" ? "#B9A0F0" : "#FFE9A8") + `<polyline points="${[P(-0.25, -0.2, 40), P(-0.21, -0.4, 40), P(-0.27, -0.6, 40), P(-0.22, -0.9, 40)].map((q) => q.map(f22).join(",")).join(" ")}" stroke="#1F1A17" stroke-width="2" fill="none" stroke-linejoin="round"/>` + (skin2 === "roche-cristal" ? crystals(-0.6, -0.55, 40, 1.1) + crystals(0.3, -0.6, 40) + crystals(0.6, -0.05, 16, 0.8) : "") + pebble(-0.3, 0.02, 3.4, rock) + pebble(-0.14, 0.1, 2.6, rock) + pebble(-0.42, 0.12, 2.2, rock) + pebble(-0.06, -0.04, 2, rock) + ln2([px, py], [px + 6, py - 20], WOOD.right, 2.4) + `<path d="M${f22(px - 5)},${f22(py - 16)} Q${f22(px + 5)},${f22(py - 25)} ${f22(px + 16)},${f22(py - 18)}" stroke="#7C8A96" stroke-width="2.6" fill="none" stroke-linecap="round"/>` + shadow(0.5, 0.32, 0.08, 0.2) + ln2([sx, sy], [sx, sy - 22], WOOD_DARK.left, 1.8) + `<path d="M${f22(sx)},${f22(sy - 21)} q5,1 9,-2 q-3,3 -1,6 q-4,-2 -8,-1 Z" fill="#E2574C"/>`,
    BUILDING_BOX
  );
}
__name(fissure, "fissure");
function quarry(skin2) {
  const rockColor = ROCKS[skin2] || STONE;
  const rock = /* @__PURE__ */ __name((u0, v0, u1, v1, h) => rockBox(u0, v0, u1, v1, 0, h, rockColor), "rock");
  const pick = `<line x1="${P(0.55, 0.3, 0)[0]}" y1="${P(0.55, 0.3, 0)[1]}" x2="${P(0.55, 0.3, 22)[0] - 4}" y2="${P(0.55, 0.3, 22)[1]}" stroke="${WOOD.right}" stroke-width="2.4" stroke-linecap="round"/><path d="M${P(0.55, 0.3, 22)[0] - 13},${P(0.55, 0.3, 22)[1] + 3} Q${P(0.55, 0.3, 22)[0] - 4},${P(0.55, 0.3, 22)[1] - 5} ${P(0.55, 0.3, 22)[0] + 6},${P(0.55, 0.3, 22)[1] + 3}" stroke="#7C8A96" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  let rails2 = "";
  for (let k = 0; k < 6; k++) rails2 += box(-0.5, -0.12 + k * 0.17 - 0.02, -0.2, -0.12 + k * 0.17 + 0.02, 0, 1.5, WOOD_DARK);
  rails2 += ln2(P(-0.45, -0.18, 1.5), P(-0.45, 0.8, 1.5), "#7C8894") + ln2(P(-0.25, -0.18, 1.5), P(-0.25, 0.8, 1.5), "#7C8894");
  const cart2 = shadow(-0.35, 0.6, 0.26, 0.2) + box(-0.5, 0.45, -0.2, 0.72, 2, 12, WOOD_DARK) + disc(-0.47, 0.72, 3, 0.07, "#3D3A36") + disc(-0.23, 0.72, 3, 0.07, "#3D3A36") + pebble(-0.4, 0.55, 3.6, rockColor) + pebble(-0.3, 0.62, 3.2, rockColor);
  return sprite(
    shadow(0, 0, 1.15, 0.18) + rock(-0.9, -0.9, 0.2, -0.2, 40) + rock(0.2, -0.9, 0.85, -0.35, 28) + rock(-0.9, -0.2, -0.55, 0.25, 22) + rock(-0.1, -0.2, 0.4, 0.2, 12) + rockBox(0.45, -0.1, 0.75, 0.15, 0, 9, rockColor) + rockBox(0.5, 0.18, 0.78, 0.42, 0, 7, rockColor) + (skin2 === "roche-cristal" ? crystals(-0.35, -0.55, 40, 1.1) + crystals(0.5, -0.62, 28) + crystals(-0.75, 0.05, 22, 0.8) : "") + rails2 + cart2 + pick,
    BUILDING_BOX
  );
}
__name(quarry, "quarry");
function grove(skin2) {
  const colors = FOLIAGE[skin2] || LEAVES;
  const tree = /* @__PURE__ */ __name((u, v, sc) => {
    const [x, y] = P(u, v, 0);
    return roundTree(u, v, sc, colors) + seasonDots(skin2, x, y - 34 * sc, 12 * sc) + seasonDots(skin2, x - 7 * sc, y - 24 * sc, 10 * sc);
  }, "tree");
  return sprite(tree(-0.45, -0.4, 1.1) + tree(0.45, -0.35, 0.95) + tree(0, 0.4, 1.2), BUILDING_BOX);
}
__name(grove, "grove");
function well(skin2) {
  const roof = roofOf(skin2, ROOF_RED);
  return sprite(
    shadow(0, 0, 0.75) + box(-0.42, -0.06, -0.34, 0.06, 0, 40, WOOD_DARK) + stoneRing(0, 0, 0, 16, 0.36, skin2 === "pierre-blanche" ? WHITE_STONE : STONE, "wellg", 2) + pool(0, 0, 16, 0.26, "#2F5E7A", "#4C8DB0") + box(0.34, -0.06, 0.42, 0.06, 0, 40, WOOD_DARK) + box(-0.38, -0.025, 0.38, 0.025, 31, 34, WOOD) + `<line x1="${P(0, 0, 32)[0]}" y1="${P(0, 0, 32)[1]}" x2="${P(0, 0, 22)[0]}" y2="${P(0, 0, 22)[1]}" stroke="#7A5A3A" stroke-width="1.2"/>` + cylinder(0, 0, 16, 22, 0.08, { top: "#B98552", left: WOOD.left, right: WOOD.right }, "bucketg") + gable(-0.5, -0.28, 0.5, 0.28, 40, 14, { front: roof.front, back: roof.back, gable: WOOD_DARK.right }, 0.06) + roofTextureOf(skin2, "toit-rouge", -0.5, -0.28, 0.5, 0.28, 40, 14, 0.06),
    BUILDING_BOX
  );
}
__name(well, "well");
function gardenFence(skin2) {
  if (skin2 === "cloture-pierre") {
    let wall = "";
    for (let k = 0; k < 6; k++) {
      const u = -0.9 + k * 0.3;
      wall += box(u, -0.96, u + 0.29, -0.86, 0, 7 + k % 2, STONE);
    }
    return wall;
  }
  const wood = skin2 === "cloture-blanche" ? WHITE_WOOD : WOOD;
  let fence = "";
  for (let k = 0; k <= 6; k++) {
    const u = -0.9 + k * 0.3;
    fence += box(u - 0.025, -0.95, u + 0.025, -0.9, 0, 12, wood);
  }
  fence += box(-0.9, -0.94, 0.9, -0.91, 8, 10, wood) + box(-0.9, -0.94, 0.9, -0.91, 3, 5, wood);
  if (skin2 === "cloture-fleurie") {
    for (let k = 0; k < 6; k++) {
      const [x, y] = P(-0.75 + k * 0.3, -0.92, 11);
      fence += `<circle cx="${x}" cy="${y}" r="2.2" fill="${k % 2 ? "#F7A8C8" : "#FFD45E"}"/><circle cx="${x}" cy="${y}" r="0.8" fill="#FFFFFF"/><ellipse cx="${x + 3}" cy="${y + 1.5}" rx="2" ry="1" fill="#6DB64C"/>`;
    }
  }
  return fence;
}
__name(gardenFence, "gardenFence");
function garden(skin2) {
  let rows = "";
  for (let k = 0; k < 4; k++) {
    const v = -0.6 + k * 0.38;
    rows += furrow(-0.78, 0.78, v, 0.07, 4);
  }
  let plants = "";
  for (let k = 0; k < 4; k++) {
    for (let j = 0; j < 5; j++) {
      const u = -0.62 + j * 0.31;
      const v = -0.6 + k * 0.38;
      const [x, y] = P(u, v, 4);
      const carrot2 = (j + k) % 2 === 0;
      plants += carrot2 ? `<path d="M${x},${y} q-3,-7 -5,-9 M${x},${y} q0,-8 0,-11 M${x},${y} q3,-7 5,-9" stroke="#3C2819" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x},${y} q-3,-7 -5,-9 M${x},${y} q0,-8 0,-11 M${x},${y} q3,-7 5,-9" stroke="#5DAA45" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y + 0.5}" rx="2.6" ry="1.4" fill="#F08A3A" stroke="#3C2819" stroke-width="0.5"/>` : leafPair(x, y, 3.4, 2, 3);
    }
  }
  return sprite(shadow(0, 0, 1.15, 0.14) + gardenFence(skin2) + soilBed(-0.85, -0.85, 0.85, 0.85, 4) + rows + plants, BUILDING_BOX);
}
__name(garden, "garden");
function goldenSign(u, v, z) {
  const [x, y] = P(u, v, z);
  return `<line x1="${x}" y1="${y}" x2="${x - 9}" y2="${y + 4.5}" stroke="#5E3A22" stroke-width="1.6"/><path d="M${x - 16},${y + 5} h12 v9 q-6,5 -12,0 Z" fill="#F2C04B" stroke="#8A6A22" stroke-width="1"/><path d="M${x - 13},${y + 8} l3,3 l4,-4" stroke="#8A6A22" stroke-width="1.2" fill="none"/>`;
}
__name(goldenSign, "goldenSign");
function anvil(u, v) {
  const [tx, ty] = P(u, v, 8);
  const [hx, hy] = P(u + 0.11, v, 14.5);
  return shadow(u, v, 0.2, 0.2) + cylinder(u, v, 0, 8, 0.1, { top: "#E7C08A", left: WOOD.left, right: WOOD.right }, "blockg") + `<ellipse cx="${f22(tx)}" cy="${f22(ty)}" rx="3.4" ry="1.7" fill="none" stroke="#B98552" stroke-width="0.6"/>` + box(u - 0.07, v - 0.04, u + 0.05, v + 0.04, 8, 10, IRON_C) + box(u - 0.04, v - 0.025, u + 0.02, v + 0.025, 10, 12, IRON_C) + box(u - 0.1, v - 0.05, u + 0.07, v + 0.05, 12, 15, IRON_C) + `<path d="M${P(u + 0.07, v - 0.05, 15).map(f22).join(",")} L${f22(hx + 6)},${f22(hy + 1.6)} L${P(u + 0.07, v + 0.05, 12).map(f22).join(",")} L${P(u + 0.07, v + 0.05, 15).map(f22).join(",")} Z" fill="${IRON_C.right}" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/><polyline points="${P(u - 0.09, v + 0.045, 15).map(f22).join(",")} ${P(u + 0.06, v + 0.045, 15).map(f22).join(",")}" stroke="#DDE4EA" stroke-width="0.8"/>`;
}
__name(anvil, "anvil");
var IRON_C = { top: "#9AA6B2", left: "#7C8894", right: "#5F6A75" };
function workshop(skin2) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45, h = 28;
  const roof = roofOf(skin2, { front: "#8E6A4A", back: "#6F5038" });
  return sprite(
    shadow(0, 0, 1.15) + box(u0, v0, u1, v1, 0, h, WOOD) + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h) + doorLeft(-0.55, -0.15, v1, 19, WOOD_DARK.right) + gable(u0, v0, u1, v1, h, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1) + (roofTexture(skin2, u0, v0, u1, v1, h, 18, 0.1) || shingles(u0, v0, u1, v1, h, 18, 0.1)) + (skin2 === "enseigne-doree" ? goldenSign(0.05, v1, 24) : "") + box(0.25, -0.4, 0.85, 0.3, 0, 18, BRICK) + courseLeft(0.25, 0.85, 0.3, 0, 18, 3, "rgba(90,40,25,.32)") + courseRight(0.85, -0.4, 0.3, 0, 18, 3, "rgba(70,30,20,.32)") + face([[0.85, -0.18, 2], [0.85, 0.08, 2], [0.85, 0.08, 11], [0.85, -0.18, 11]], "#3A1E14") + face([[0.85, -0.14, 3], [0.85, 0.04, 3], [0.85, 0.04, 7], [0.85, -0.14, 7]], "#F28A3A") + pyramid(0.25, -0.4, 0.85, 0.3, 18, 10, { back: BRICK.right, left: BRICK.left, right: BRICK.right }, 0.02) + cylinder(0.55, -0.05, 26, 44, 0.08, { top: "#5E3A2A", left: BRICK.left, right: BRICK.right }, "kilng") + anvil(0.35, 0.65),
    BUILDING_BOX
  );
}
__name(workshop, "workshop");
function pier() {
  let posts = "";
  for (const u of [-0.7, -0.2, 0.3, 0.8]) {
    posts += box(u - 0.04, 0.12, u + 0.04, 0.2, -4, 7, WOOD_DARK) + box(u - 0.04, -0.2, u + 0.04, -0.12, -4, 7, WOOD_DARK);
  }
  let deck = box(-0.85, -0.25, 0.9, 0.25, 7, 10, WOOD);
  for (let k = 1; k < 9; k++) {
    const u = -0.85 + k * 0.195;
    deck += `<polyline points="${[P(u, -0.25, 10), P(u, 0.25, 10)].map((p) => p.join(",")).join(" ")}" stroke="rgba(90,55,25,.35)" stroke-width="0.8"/>`;
  }
  const water = cove(0, 0.05, 0.92);
  const rope = `<path d="M${P(0.8, 0.2, 9).join(",")} Q${P(0.75, 0.45, 2).join(",")} ${P(0.55, 0.6, 5).join(",")}" stroke="#C9A16A" stroke-width="1.2" fill="none"/>`;
  return sprite(water + posts + deck + box(0.6, -0.15, 0.85, 0.12, 10, 18, WOOD_DARK) + rope, BUILDING_BOX);
}
__name(pier, "pier");
function worksite(stage) {
  const corners = [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]];
  let stakes = "";
  for (const [u, v] of corners) {
    const [tx, ty] = P(u, v, 14);
    stakes += box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 13, WOOD) + `<path d="M${f22(tx - 2.3)},${f22(ty + 1)} L${f22(tx)},${f22(ty - 3)} L${f22(tx + 2.3)},${f22(ty + 1)} Z" fill="${WOOD.top}" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/><path d="M${f22(tx + 0.6)},${f22(ty + 3)} l6,1.6 l-6,2 Z" fill="#E2574C" stroke="#3C2819" stroke-width="0.5" stroke-linejoin="round"/>`;
  }
  const rope = corners.map((c, k) => {
    const d = corners[(k + 1) % 4];
    const a = P(c[0], c[1], 11), b = P(d[0], d[1], 11), m = P((c[0] + d[0]) / 2, (c[1] + d[1]) / 2, 7.5);
    return `M${f22(a[0])},${f22(a[1])} Q${f22(2 * m[0] - (a[0] + b[0]) / 2)},${f22(2 * m[1] - (a[1] + b[1]) / 2)} ${f22(b[0])},${f22(b[1])}`;
  }).join(" ");
  const blob = Array.from({ length: 28 }, (_, k) => {
    const t = k / 28 * Math.PI * 2, r = 0.62 * (1 + 0.07 * Math.sin(t * 3 + 0.6) + 0.04 * Math.sin(t * 5));
    return P(Math.cos(t) * r, Math.sin(t) * r, 0).map(f22).join(",");
  }).join(" ");
  const clod = /* @__PURE__ */ __name((u, v, r, c) => {
    const [x, y] = P(u, v, 0);
    return `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${r}" ry="${f22(r * 0.6)}" fill="${c}"/>`;
  }, "clod");
  const stone2 = /* @__PURE__ */ __name((u, v, r) => {
    const [x, y] = P(u, v, 0);
    return `<ellipse cx="${f22(x)}" cy="${f22(y)}" rx="${r}" ry="${f22(r * 0.66)}" fill="${STONE.right}" stroke="#3C2819" stroke-width="0.6"/><ellipse cx="${f22(x - r * 0.25)}" cy="${f22(y - r * 0.25)}" rx="${f22(r * 0.5)}" ry="${f22(r * 0.3)}" fill="${STONE.top}"/>`;
  }, "stone");
  const [hx, hy] = P(-0.42, 0.55, 0);
  const dug = `<polygon points="${blob}" fill="rgba(150,105,60,.42)"/>` + [[-0.3, -0.2, 4.4], [0.2, 0.25, 3.6], [0.35, -0.3, 3], [-0.15, 0.38, 2.6], [0.05, -0.45, 2.8]].map(([u, v, r], k) => clod(u, v, r, k % 2 ? "#8B5A34" : "#A87445")).join("") + stone2(0.3, -0.2, 2.6) + stone2(-0.25, 0.3, 2.2) + stone2(0.45, 0.1, 1.8);
  const heap = `<path d="M${f22(hx - 13)},${f22(hy + 2)} Q${f22(hx - 9)},${f22(hy - 8)} ${f22(hx)},${f22(hy - 9)} Q${f22(hx + 9)},${f22(hy - 8)} ${f22(hx + 13)},${f22(hy + 2)} Q${f22(hx)},${f22(hy + 6)} ${f22(hx - 13)},${f22(hy + 2)} Z" fill="#A87445" stroke="#3C2819" stroke-width="0.7"/><path d="M${f22(hx - 6)},${f22(hy - 5)} q4,-3 8,-1" stroke="#C99A62" stroke-width="1.2" fill="none" stroke-linecap="round"/>` + clod(-0.36, 0.66, 2, "#8B5A34") + `<path d="M${f22(hx + 2)},${f22(hy - 4)} l4.2,0.8 l-0.6,5.6 q-2,1.6 -4.2,-0.6 Z" fill="#9AA6B2" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/><line x1="${f22(hx + 4)}" y1="${f22(hy - 3.6)}" x2="${f22(hx + 8)}" y2="${f22(hy - 21)}" stroke="#3C2819" stroke-width="2.6" stroke-linecap="round"/><line x1="${f22(hx + 4)}" y1="${f22(hy - 3.6)}" x2="${f22(hx + 8)}" y2="${f22(hy - 21)}" stroke="${WOOD.left}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f22(hx + 5.6)},${f22(hy - 22)} h5" stroke="#3C2819" stroke-width="2.4" stroke-linecap="round"/><path d="M${f22(hx + 5.6)},${f22(hy - 22)} h5" stroke="${WOOD.top}" stroke-width="1.2" stroke-linecap="round"/>`;
  let body = shadow(0, 0, 1.1, 0.1) + dug;
  if (stage >= 2) {
    const post = /* @__PURE__ */ __name((u, v) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 0, 32, WOOD_DARK), "post");
    body += post(-0.6, -0.6) + post(0.1, -0.6) + post(-0.6, -0.1) + box(-0.63, -0.63, 0.13, -0.07, 24, 27, WOOD) + box(-0.63, -0.63, 0.13, -0.57, 30, 32, WOOD_DARK) + post(0.1, -0.1) + [0, 1, 2, 3].map((k) => `<line x1="${P(-0.3, -0.04, 4 + k * 6)[0]}" y1="${P(-0.3, -0.04, 4 + k * 6)[1]}" x2="${P(-0.12, -0.04, 4 + k * 6)[0]}" y2="${P(-0.12, -0.04, 4 + k * 6)[1]}" stroke="${WOOD.left}" stroke-width="1.6"/>`).join("") + `<line x1="${P(-0.3, -0.04, 0)[0]}" y1="${P(-0.3, -0.04, 0)[1]}" x2="${P(-0.3, -0.04, 27)[0]}" y2="${P(-0.3, -0.04, 27)[1]}" stroke="${WOOD.right}" stroke-width="1.8"/><line x1="${P(-0.12, -0.04, 0)[0]}" y1="${P(-0.12, -0.04, 0)[1]}" x2="${P(-0.12, -0.04, 27)[0]}" y2="${P(-0.12, -0.04, 27)[1]}" stroke="${WOOD.right}" stroke-width="1.8"/>` + cylinder(0.32, -0.45, 0, 7, 0.09, { top: "#CFC6B4", left: "#9AA6B2", right: "#6F7A85" }, "mortarg") + (() => {
      const [mx, my] = P(0.32, -0.45, 7);
      return `<path d="M${f22(mx - 1)},${f22(my)} l3.4,-6" stroke="${WOOD.right}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f22(mx - 3)},${f22(my + 0.6)} l4,-1.4 l1,1.6 Z" fill="#7C8A96" stroke="#3C2819" stroke-width="0.5"/>`;
    })();
  }
  body += `<path d="${rope}" stroke="#3C2819" stroke-width="1.7" fill="none" opacity=".55"/><path d="${rope}" stroke="#F2E4C0" stroke-width="0.9" fill="none"/>` + stakes + heap;
  if (stage >= 1) {
    const [sx, sy] = P(0.48, 0.47, 19);
    body += box(-0.4, 0.15, 0.2, 0.32, 0, 3, WOOD) + box(-0.36, 0.17, 0.24, 0.34, 3, 6, WOOD) + box(-0.42, 0.14, 0.18, 0.31, 6, 9, WOOD) + box(0.45, 0.42, 0.5, 0.47, 0, 18, WOOD_DARK) + face([[0.3, 0.47, 14], [0.66, 0.47, 14], [0.66, 0.47, 24], [0.3, 0.47, 24]], "#F3D27A", EDGE) + `<path d="M${f22(sx - 4)},${f22(sy + 3.6)} L${f22(sx - 4)},${f22(sy - 0.4)} L${f22(sx)},${f22(sy - 3.6)} L${f22(sx + 4)},${f22(sy - 0.4)} L${f22(sx + 4)},${f22(sy + 3.6)} Z" fill="none" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round" opacity=".75"/><rect x="${f22(sx - 1)}" y="${f22(sy + 0.8)}" width="2" height="2.8" fill="${INK}" opacity=".75"/>`;
  }
  if (stage >= 2) {
    body += box(0.35, -0.05, 0.62, 0.18, 0, 7, STONE) + box(0.4, -0.02, 0.6, 0.15, 7, 12, STONE);
  }
  return sprite(body, BUILDING_BOX);
}
__name(worksite, "worksite");
function flameFrames(u = 0, v = 0, s = 1, outlined = false) {
  const [x, y] = P(u, v, 4);
  const shapes = [
    [[0, -22], [7, -6], [0, 0], [-7, -6]],
    [[2, -24], [7, -7], [0, 0], [-6, -5]],
    [[-2, -21], [6, -5], [0, 0], [-7, -7]]
  ].map((shape) => shape.map(([dx, dy]) => [dx * s, dy * s]));
  const tongue = /* @__PURE__ */ __name(([tip, r, base, l], k, fill, extra = "") => `<path d="M${f22(x + base[0] * k)},${f22(y + base[1] * k)} C${f22(x + (r[0] + 3 * s) * k)},${f22(y + r[1] * k)} ${f22(x + (tip[0] + 2 * s) * k)},${f22(y + (tip[1] + 8 * s) * k)} ${f22(x + tip[0] * k)},${f22(y + tip[1] * k)} C${f22(x + (tip[0] - 2 * s) * k)},${f22(y + (tip[1] + 8 * s) * k)} ${f22(x + (l[0] - 3 * s) * k)},${f22(y + l[1] * k)} ${f22(x + base[0] * k)},${f22(y + base[1] * k)} Z" fill="${fill}"${extra}/>`, "tongue");
  if (outlined) {
    const sparks2 = [[[5, -27], [-6, -18]], [[-4, -30], [7, -21]], [[3, -32], [-7, -25]]];
    return shapes.map((sh, i) => sprite(
      tongue(sh, 1, "#EE6A3A", ' stroke="#3C2819" stroke-width="0.8" stroke-linejoin="round"') + tongue(sh, 0.78, "#F7A23B") + tongue(sh, 0.5, "#FFE07A") + sparks2[i].map(([dx, dy], j) => `<circle cx="${f22(x + dx * s)}" cy="${f22(y + dy * s)}" r="${f22((j ? 0.8 : 1.1) * s)}" fill="#FFD27A"/>`).join(""),
      { x: x - 20, y: y - 36, w: 40, h: 44 }
    ));
  }
  return shapes.map(([tip, r, base, l]) => sprite(
    `<path d="M${x + base[0]},${y + base[1]} C${x + r[0] + 3 * s},${y + r[1]} ${x + tip[0] + 2 * s},${y + tip[1] + 8 * s} ${x + tip[0]},${y + tip[1]} C${x + tip[0] - 2 * s},${y + tip[1] + 8 * s} ${x + l[0] - 3 * s},${y + l[1]} ${x + base[0]},${y + base[1]} Z" fill="#F7A23B"/><path d="M${x},${y} C${x + 4 * s},${y - 4 * s} ${x + tip[0] * 0.5 + 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x + tip[0] * 0.5},${y + tip[1] * 0.55} C${x + tip[0] * 0.5 - 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x - 4 * s},${y - 4 * s} ${x},${y} Z" fill="#FFE07A"/>`,
    { x: x - 20, y: y - 36, w: 40, h: 44 }
  ));
}
__name(flameFrames, "flameFrames");
function boatSprite(skin2) {
  const [x, y] = P(0.05, 0.5, 0);
  const sail = SAILS[skin2];
  const hull = `<path d="M${x - 22},${y - 6} L${x + 22},${y - 6} Q${x + 18},${y + 5} ${x + 8},${y + 6} L${x - 12},${y + 6} Q${x - 20},${y + 4} ${x - 22},${y - 6} Z" fill="${WOOD.left}" stroke="#3C2819" stroke-width="0.8"/><path d="M${x - 22},${y - 6} L${x + 22},${y - 6} L${x + 19},${y - 2} L${x - 20},${y - 2} Z" fill="#FBF6EA"/>`;
  const mast = `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y - 46}" stroke="${WOOD_DARK.right}" stroke-width="2"/>`;
  const main = sail && sail[0] !== "stripes" ? sail[0] : "#FFFDF8";
  const jib = sail && sail[0] !== "stripes" ? sail[1] : "#F2E4C0";
  const stripes = sail && sail[0] === "stripes" ? [0, 1, 2].map((k) => `<path d="M${x + 1},${y - 40 + k * 10} L${x + 1},${y - 35 + k * 10} L${x + 6 + k * 4.5},${y - 35.5 + k * 10} L${x + 4 + k * 4.5},${y - 40.5 + k * 10} Z" fill="${sail[1]}"/>`).join("") : "";
  const sails = `<path d="M${x + 1},${y - 44} L${x + 1},${y - 10} L${x + 20},${y - 12} Z" fill="${main}" stroke="rgba(60,40,25,.5)" stroke-width="0.8"/>${stripes}<path d="M${x - 1},${y - 38} L${x - 1},${y - 12} L${x - 14},${y - 13} Z" fill="${jib}"/>`;
  return sprite(`<ellipse cx="${x}" cy="${y + 6}" rx="22" ry="5" fill="rgba(30,70,110,.25)"/>` + hull + mast + sails, BUILDING_BOX);
}
__name(boatSprite, "boatSprite");
var BUILDINGS = {
  foyer: [campfire, shelter, hut],
  carriere: [fissure, quarry],
  bosquet: [grove],
  puits: [well],
  potager: [garden],
  atelier: [workshop],
  ponton: [pier],
  chantier: [() => worksite(0), () => worksite(1), () => worksite(2)]
};
var LIGHTS = {
  foyer: [[[0, 0, 10, 54]], [[SHELTER_FIRE[0], SHELTER_FIRE[1], 8, 40]], [[0.55, -0.07, 14, 22]]],
  atelier: [[[0.85, -0.05, 6, 30]]]
};
var SMOKE = {
  foyer: [[0, 0, 24], [SHELTER_FIRE[0], SHELTER_FIRE[1], 18], [CABIN_CHIMNEY[0], CABIN_CHIMNEY[1], 62]],
  atelier: [[0.55, -0.05, 44]]
};

// atelier/port/src/world/buildings2.js
var BLUE_ROOF2 = { front: "#6FA3D9", back: "#4C7FB5" };
var DARK_STONE2 = { top: "#B9B2A2", left: "#968E7C", right: "#736B5B" };
var line = /* @__PURE__ */ __name((a, b, color, width = 1.2, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${extra}/>`, "line");
function dome(u, v, z, r, colors, id) {
  const [x, y] = P(u, v, z);
  const rx = r * TW * Math.SQRT1_2;
  const ry = rx * 0.5;
  const h = rx * 0.95;
  return `<defs><radialGradient id="${id}" cx="0.35" cy="0.3" r="0.9"><stop offset="0" stop-color="${colors.top}"/><stop offset="0.55" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></radialGradient></defs><path d="M${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} A${rx},${h} 0 0 0 ${x - rx},${y} Z" fill="url(#${id})"${EDGE}/>` + (HIVER ? `<defs><clipPath id="${id}-neige"><path d="M${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} A${rx},${h} 0 0 0 ${x - rx},${y} Z"/></clipPath></defs><g clip-path="url(#${id}-neige)"><ellipse cx="${x + 1}" cy="${y - h * 0.9}" rx="${rx * 1.02}" ry="${h * 0.62}" fill="${NEIGE.shade}"/><ellipse cx="${x}" cy="${y - h * 1.02}" rx="${rx * 1.02}" ry="${h * 0.62}" fill="${NEIGE.light}"${EDGE}/></g>` : "");
}
__name(dome, "dome");
function barrel2(u, v, id) {
  const [x, y] = P(u, v, 0);
  return shadow(u, v, 0.14, 0.2) + cylinder(u, v, 0, 13, 0.11, { top: "#C9935E", left: WOOD.left, right: WOOD.right }, id) + `<path d="M${x - 7.8},${y - 3} A7.8,3.9 0 0 0 ${x + 7.8},${y - 3}" stroke="#5E3A22" stroke-width="1" fill="none"/><path d="M${x - 7.8},${y - 10} A7.8,3.9 0 0 0 ${x + 7.8},${y - 10}" stroke="#5E3A22" stroke-width="1" fill="none"/>`;
}
__name(barrel2, "barrel");
function crate2(u, v, s = 0.14, h = 11) {
  return box(u - s, v - s, u + s, v + s, 0, h, WOOD) + line(P(u - s, v + s, 0), P(u + s, v + s, h), "rgba(90,55,25,.45)", 0.9);
}
__name(crate2, "crate");
function mine(skin2) {
  const rockColor = ROCKS[skin2] || STONE;
  const portal = face([[-0.55, -0.2, 0], [-0.15, -0.2, 0], [-0.15, -0.2, 24], [-0.55, -0.2, 24]], "#2A2420");
  const frame = box(-0.6, -0.22, -0.55, -0.16, 0, 26, WOOD_DARK) + box(-0.15, -0.22, -0.1, -0.16, 0, 26, WOOD_DARK) + box(-0.6, -0.22, -0.1, -0.16, 24, 28, WOOD);
  let rails2 = "";
  for (let k = 0; k < 6; k++) {
    const v = -0.1 + k * 0.17;
    rails2 += box(-0.5, v - 0.02, -0.2, v + 0.02, 0, 1.5, WOOD_DARK);
  }
  rails2 += line(P(-0.45, -0.1, 1.5), P(-0.45, 0.8, 1.5), "#7C8894", 1.2) + line(P(-0.25, -0.1, 1.5), P(-0.25, 0.8, 1.5), "#7C8894", 1.2);
  const lantern = box(0.02, -0.25, 0.06, -0.21, 0, 30, WOOD_DARK) + box(-0.02, -0.29, 0.1, -0.17, 30, 38, { top: "#3D3A36", left: "#FFE08A", right: "#E9BF4E" });
  return sprite(
    shadow(0, 0, 1.15, 0.18) + rockBox(-0.95, -0.95, 0.9, -0.2, 0, 44, rockColor) + rockBox(0.3, -0.2, 0.9, 0.3, 0, 26, rockColor) + (skin2 === "roche-cristal" ? crystals(0.1, -0.6, 44, 1.2) + crystals(0.6, 0.05, 26) : "") + portal + frame + rails2 + box(-0.5, 0.45, -0.2, 0.72, 2, 12, WOOD_DARK) + pebble(-0.38, 0.55, 3.4, DARK_STONE2) + pebble(-0.3, 0.62, 3, DARK_STONE2) + lantern + box(0.45, 0.4, 0.75, 0.65, 0, 8, STONE) + pebble(0.75, 0.8, 3),
    BUILDING_BOX
  );
}
__name(mine, "mine");
var KIOSK_Z = 64;
var KIOSK_R = 0.98;
function kioskPost(u, v) {
  return box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, KIOSK_Z, WOOD_DARK) + box(u - 0.05, v - 0.05, u + 0.05, v + 0.05, 0, 3, STONE);
}
__name(kioskPost, "kioskPost");
function kioskRoof(skin2) {
  const thatch = skin2 === "toit-chaume";
  const colors = thatch ? { light: "#F3D27E", dark: "#C4943F", edge: "#A97B32" } : { light: "#86B6E6", dark: "#3F6FA3", edge: "#2E5585" };
  const f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
  const [, cy] = P(0, 0, KIOSK_Z);
  const rx = KIOSK_R * 45.25;
  const ry = KIOSK_R * 22.63;
  const h = 26;
  const apex = cy - h;
  const ty = cy - ry * ry / h;
  const tx = rx * Math.sqrt(Math.max(0, 1 - ((cy - ty) / ry) ** 2));
  const cone2 = `M0,${f(apex)} L${f(tx)},${f(ty)} A${f(rx)},${f(ry)} 0 1 1 ${f(-tx)},${f(ty)} Z`;
  let texture = "";
  if (thatch) {
    for (let a = 0.12; a < Math.PI - 0.1; a += 0.09) {
      const bx = rx * Math.cos(a);
      const by = cy + ry * Math.sin(a);
      const j = Math.sin(a * 53) * 0.04;
      texture += `<line x1="${f(bx * (0.18 + j))}" y1="${f(apex + (by - apex) * (0.18 + j))}" x2="${f(bx * 0.97)}" y2="${f(apex + (by - apex) * 0.97)}" stroke="rgba(140,95,35,.45)" stroke-width="0.6"/>`;
    }
    texture += `<path d="M${f(-rx * 0.62)},${f(cy - ry * 0.05 - h * 0.38)} A${f(rx * 0.62)},${f(ry * 0.62)} 0 0 0 ${f(rx * 0.62)},${f(cy - ry * 0.05 - h * 0.38)}" fill="none" stroke="#B88A3A" stroke-width="1.6" stroke-dasharray="1.6 1.2"/>`;
  } else {
    [0.35, 0.55, 0.75, 0.95].forEach((k, r) => {
      const ey = apex + h * k;
      texture += `<path d="M${f(-rx * k)},${f(ey)} A${f(rx * k)},${f(ry * k)} 0 0 0 ${f(rx * k)},${f(ey)}" fill="none" stroke="rgba(20,40,70,.4)" stroke-width="0.8"/>`;
      for (let a = r % 2 ? 0.3 : 0.55; a < Math.PI - 0.15; a += 0.5) {
        const k0 = k - 0.2;
        texture += `<line x1="${f(rx * k0 * Math.cos(a))}" y1="${f(apex + h * k0 + ry * k0 * Math.sin(a))}" x2="${f(rx * k * Math.cos(a))}" y2="${f(ey + ry * k * Math.sin(a))}" stroke="rgba(20,40,70,.28)" stroke-width="0.6"/>`;
      }
    });
  }
  return `<defs><linearGradient id="kioskg-${skin2}" x1="0" x2="1"><stop offset="0" stop-color="${colors.light}"/><stop offset="1" stop-color="${colors.dark}"/></linearGradient></defs><path d="${cone2}" fill="url(#kioskg-${skin2})" stroke="#3C2819" stroke-width="0.8" stroke-linejoin="round"/>` + texture + `<path d="M${f(-rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 0 ${f(rx)},${f(cy)}" fill="none" stroke="${colors.edge}" stroke-width="${thatch ? 2.6 : 2}" ${thatch ? 'stroke-dasharray="1.8 1.2"' : ""}/><line x1="0" y1="${f(apex)}" x2="0" y2="${f(apex - 7)}" stroke="#7A5A3A" stroke-width="1.4"/><circle cx="0" cy="${f(apex - 8)}" r="2" fill="#E9BF4E" stroke="#8A6A22" stroke-width="0.6"/>`;
}
__name(kioskRoof, "kioskRoof");
function fountain(skin2) {
  const stone2 = skin2 === "pierre-blanche" ? WHITE_STONE : STONE;
  const kiosk2 = skin2 === "toit-bleu" || skin2 === "toit-chaume";
  const r = KIOSK_R * 0.88;
  return sprite(
    shadow(0, 0, kiosk2 ? 1.05 : 0.95) + (kiosk2 ? kioskPost(-r, 0) + kioskPost(0, -r) : "") + stoneRing(0, 0, 0, 10, 0.72, stone2, "fobasin") + pool(0, 0, 10, 0.62) + cylinder(0, 0, 10, 30, 0.08, WALL, "focol") + stoneRing(0, 0, 30, 34, 0.3, stone2, "fobowl", 0) + pool(0, 0, 34, 0.24) + cylinder(0, 0, 34, 42, 0.04, WALL, "fotip") + (kiosk2 ? kioskPost(r, 0) + kioskPost(0, r) + kioskRoof(skin2) : ""),
    BUILDING_BOX
  );
}
__name(fountain, "fountain");
function bigGrove(skin2) {
  const colors = FOLIAGE[skin2];
  const tree = /* @__PURE__ */ __name((u, v, sc, base) => {
    const [x, y] = P(u, v, 0);
    return roundTree(u, v, sc, colors || base) + seasonDots(skin2, x, y - 34 * sc, 12 * sc);
  }, "tree");
  const [px, py] = P(0.5, 0.5, 0);
  const pine2 = shadow(-0.55, 0.45, 0.3) + box(-0.6, 0.4, -0.5, 0.5, 0, 12, WOOD_DARK) + [[-8, 15, 22], [-20, 12, 20], [-31, 9, 18]].map(([dy, w, h], k) => {
    const [x, y] = P(-0.55, 0.45, 0);
    return `<path d="M${x - w},${y + dy} L${x},${y + dy - h} L${x + w},${y + dy} Z" fill="${PINE.dark}"/><path d="M${x - w + 2},${y + dy - 1} L${x},${y + dy - h} L${x + 1},${y + dy - 1} Z" fill="${k === 2 ? PINE.light : PINE.mid}"/>`;
  }).join("");
  const stump = shadow(0.5, 0.5, 0.18, 0.2) + cylinder(0.5, 0.5, 0, 7, 0.13, { top: "#E7C08A", left: WOOD.left, right: WOOD.right }, "bgstump") + `<ellipse cx="${px}" cy="${py - 7}" rx="3.6" ry="1.8" fill="none" stroke="#B98552" stroke-width="0.8"/>` + line([px + 2, py - 8], [px + 9, py - 20], WOOD.right, 1.8) + `<path d="M${px + 6},${py - 23} l7,2 l-2,5 l-6,-3 Z" fill="#9AA6B2"/>`;
  const snowy = skin2 === "givre" ? (() => {
    const [x, y] = P(-0.55, 0.45, 0);
    return `<path d="M${x - 6},${y - 46} L${x},${y - 49} L${x + 6},${y - 46} L${x},${y - 43} Z" fill="#FFFFFF"/>`;
  })() : "";
  return sprite(tree(-0.5, -0.5, 1.15) + tree(0.45, -0.5, 1, { light: "#C7E98F", mid: "#93CC5E", dark: "#5E9A3C" }) + pine2 + snowy + tree(0.05, 0.05, 1.25) + stump, BUILDING_BOX);
}
__name(bigGrove, "bigGrove");
function greenhouseGarden(skin2) {
  let plants = "";
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 2; k++) {
      const [x, y] = P(-0.6 + j * 0.38, 0.25 + k * 0.38, 4);
      plants += leafPair(x, y, 3.6, 2.1, 3) + `<circle cx="${x}" cy="${y - 5}" r="2" fill="#E2574C" stroke="#3C2819" stroke-width="0.5"/>`;
    }
  }
  const glass = "rgba(205,235,245,.55)";
  const sc = P(0.65, 0.05, 0);
  return sprite(
    shadow(0, 0, 1.15, 0.14) + (skin2 ? gardenFence(skin2) : "") + soilBed(-0.85, 0.05, 0.85, 0.85, 4) + plants + box(-0.8, -0.85, 0.3, -0.2, 0, 22, { top: glass, left: glass, right: "rgba(170,205,220,.6)" }, ' stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"') + gable(-0.8, -0.85, 0.3, -0.2, 22, 14, { front: "rgba(220,245,255,.7)", back: "rgba(170,205,220,.7)", gable: glass }, 0.03, ' stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"') + roundTree(-0.4, -0.55, 0.45, { light: "#D7F0A8", mid: "#9ED67B", dark: "#6FA94F" }) + line(sc, [sc[0], sc[1] - 34], WOOD_DARK.right, 2) + line([sc[0] - 12, sc[1] - 24], [sc[0] + 12, sc[1] - 24], WOOD_DARK.right, 2) + `<path d="M${sc[0] - 7},${sc[1] - 26} L${sc[0] + 7},${sc[1] - 26} L${sc[0] + 5},${sc[1] - 12} L${sc[0] - 5},${sc[1] - 12} Z" fill="#5C83C2"/><circle cx="${sc[0]}" cy="${sc[1] - 31}" r="4.4" fill="#F1DC92"/><path d="M${sc[0] - 8},${sc[1] - 34} L${sc[0] + 8},${sc[1] - 34} L${sc[0]},${sc[1] - 41} Z" fill="#B8902F"/>`,
    BUILDING_BOX
  );
}
__name(greenhouseGarden, "greenhouseGarden");
function forge(skin2) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45;
  const roof = roofOf(skin2, ROOF_RED);
  const sign = P(0.15, 0.5, 30);
  return sprite(
    shadow(0, 0, 1.15) + box(u0, v0, u1, v1, 0, 22, STONE) + courseLeft(u0, u1, v1, 0, 22, 3) + courseRight(u1, v0, v1, 0, 22, 3) + doorLeft(-0.55, -0.15, v1, 17, WOOD_DARK.right) + box(u0, v0, u1, v1, 22, 40, WOOD) + planksLeft(u0, u1, v1, 22, 40) + planksRight(u1, v0, v1, 22, 40) + windowLeft(-0.6, -0.35, v1, 27, 36) + windowRight(u1, -0.3, -0.05, 27, 36) + gable(u0, v0, u1, v1, 40, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 40, 18, 0.1) + (skin2 === "enseigne-doree" ? goldenSign(-0.3, v1, 44) : "") + box(0.25, -0.45, 0.88, 0.3, 0, 22, BRICK) + courseLeft(0.25, 0.88, 0.3, 0, 22, 4, "rgba(90,40,25,.32)") + courseRight(0.88, -0.45, 0.3, 0, 22, 4, "rgba(70,30,20,.32)") + face([[0.88, -0.2, 2], [0.88, 0.1, 2], [0.88, 0.1, 13], [0.88, -0.2, 13]], "#3A1E14") + face([[0.88, -0.16, 3], [0.88, 0.06, 3], [0.88, 0.06, 8], [0.88, -0.16, 8]], "#F28A3A") + box(0.45, -0.3, 0.65, -0.1, 22, 58, BRICK) + courseLeft(0.45, 0.65, -0.1, 22, 58, 6, "rgba(90,40,25,.32)") + courseRight(0.65, -0.3, -0.1, 22, 58, 6, "rgba(70,30,20,.32)") + line(sign, [sign[0] + 10, sign[1] + 5], WOOD_DARK.right, 1.6) + `<rect x="${sign[0] + 4}" y="${sign[1] + 6}" width="12" height="10" rx="2" fill="#F3D27A" stroke="#7A4E2C" stroke-width="0.8"/><path d="M${sign[0] + 7},${sign[1] + 14} L${sign[0] + 12},${sign[1] + 9}" stroke="#7A4E2C" stroke-width="1.2" stroke-linecap="round"/><rect x="${sign[0] + 10.4}" y="${sign[1] + 7.2}" width="4.4" height="2.4" rx="0.5" fill="#5F6A75" transform="rotate(-45 ${sign[0] + 12.6} ${sign[1] + 8.4})"/>` + barrel2(0.55, 0.6, "fobar1") + barrel2(0.32, 0.72, "fobar2") + crate2(-0.62, 0.72),
    BUILDING_BOX
  );
}
__name(forge, "forge");
function bigPier() {
  let posts = "";
  for (const u of [-0.75, -0.25, 0.25, 0.75]) posts += box(u - 0.04, 0.12, u + 0.04, 0.2, -4, 7, WOOD_DARK) + box(u - 0.04, -0.2, u + 0.04, -0.12, -4, 7, WOOD_DARK);
  const water = cove(0, 0.05, 0.92);
  return sprite(
    water + posts + box(-0.85, -0.25, 0.9, 0.25, 7, 10, WOOD) + box(0.45, 0.25, 0.75, 0.75, 7, 10, WOOD) + box(-0.75, -0.22, -0.25, 0.2, 10, 30, WOOD_DARK) + planksLeft(-0.75, -0.25, 0.2, 10, 30, 5) + face([[-0.6, 0.2, 10], [-0.42, 0.2, 10], [-0.42, 0.2, 23], [-0.6, 0.2, 23]], "#3A2A1E") + gable(-0.75, -0.22, -0.25, 0.2, 30, 12, { front: BLUE_ROOF2.front, back: BLUE_ROOF2.back, gable: WOOD_DARK.right }, 0.05) + roofTexture("toit-bleu", -0.75, -0.22, -0.25, 0.2, 30, 12, 0.05) + `<path d="M${P(0.1, -0.24, 22).join(",")} Q${P(0.25, -0.24, 12).join(",")} ${P(0.4, -0.24, 22).join(",")}" stroke="#C9A16A" stroke-width="1" fill="rgba(201,161,106,.25)" stroke-dasharray="1.5 1.5"/>` + box(0.08, -0.26, 0.12, -0.22, 10, 26, WOOD_DARK) + box(0.38, -0.26, 0.42, -0.22, 10, 26, WOOD_DARK) + box(0.8, 0.12, 0.84, 0.16, 10, 34, WOOD_DARK) + box(0.76, 0.08, 0.88, 0.2, 34, 41, { top: "#3D3A36", left: "#FFE08A", right: "#E9BF4E" }),
    BUILDING_BOX
  );
}
__name(bigPier, "bigPier");
function fountainFrames() {
  const [x, y] = P(0, 0, 42);
  return [0, 1, 2].map((f) => {
    let out = "";
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2 + f * 0.35;
      const r = 6 + f * 3;
      out += `<circle cx="${x + Math.cos(a) * r}" cy="${y - 4 + f * 3 + Math.sin(a) * r * 0.4}" r="1.3" fill="#BFE6FA"/>`;
    }
    out += `<path d="M${x - 1},${y} L${x},${y - 7 - f} L${x + 1},${y} Z" fill="#DFF4FF"/>`;
    return sprite(out, BUILDING_BOX);
  });
}
__name(fountainFrames, "fountainFrames");
var UPGRADES = { carriere: mine, puits: fountain, bosquet: bigGrove, potager: greenhouseGarden, atelier: forge, ponton: bigPier };

// atelier/port/src/world/brume.js
var WISP = {
  calm: { core: "#FFFFFF", flame: "#BFF0FF", edge: "#5CC8F0", halo: "120,210,255" },
  ready: { core: "#FFFDF2", flame: "#FFE7A3", edge: "#F2B23B", halo: "255,200,90" },
  eye: "#1D3557"
};

// atelier/port/src/world/tiers/foyer.js
var VIOLET = { front: "#9A88CF", back: "#6F5DA6" };
var COPPER = { top: "#F4B07A", left: "#D9844E", right: "#A85C31" };
var MAGIC_GLASS = "#E3D8FA";
var volumeOf = /* @__PURE__ */ __name((roof) => ({ light: roof.front, dark: roof.back, top: roof.front, left: roof.front, right: roof.back }), "volumeOf");
function herbGarden(u0, v0, u1, v1) {
  let tufts = "";
  for (let u = u0 + 0.07; u < u1 - 0.03; u += 0.11) {
    for (let v = v0 + 0.07; v < v1 - 0.03; v += 0.12) {
      const [x, y] = P(u, v, 5);
      const k = Math.round((u * 7 + v * 13) * 10);
      const tint = ["#6DB04F", "#8FCB6B", "#9C82DE", "#5E9446"][(k % 4 + 4) % 4];
      tufts += dot(x, y - 1, 2.6, tint) + dot(x - 1, y - 2.6, 1.2, k % 3 ? "#C6E8A4" : "#F7A8C8");
    }
  }
  return box(u0, v0, u1, v1, 0, 4, WOOD_DARK) + face([[u0 + 0.03, v0 + 0.03, 4], [u1 - 0.03, v0 + 0.03, 4], [u1 - 0.03, v1 - 0.03, 4], [u0 + 0.03, v1 - 0.03, 4]], "#7A5236") + tufts;
}
__name(herbGarden, "herbGarden");
function flaskSign(u, vf, z) {
  const [x, y] = P(u, vf + 0.16, z);
  return ln(P(u, vf, z + 2), [x, y + 2], IRON.right, 1.2) + `<rect x="${f2(x - 5.5)}" y="${f2(y + 3)}" width="11" height="9" rx="1.5" fill="#F3E4C4" stroke="#7A4E2C" stroke-width="1"/><path d="M${f2(x - 1)},${f2(y + 5)} v1.6 l-2.6,3.4 h7.2 l-2.6,-3.4 v-1.6 Z" fill="#7BD88F" stroke="#3E6B2E" stroke-width="0.5"/>`;
}
__name(flaskSign, "flaskSign");
var chimneyOf = /* @__PURE__ */ __name(({ u1, v0 }) => [u1 - 0.32, v0 + 0.24], "chimneyOf");
var WIDE = 1.1;
function alchemistHouse(skin2, rect) {
  const { u0, u1, v0, v1 } = rect;
  const roof = roofOf(skin2, VIOLET);
  const vm = (v0 + v1) / 2;
  const [cu, cv] = chimneyOf(rect);
  const door = (u0 + u1) / 2 + 0.06;
  const wide = u1 - u0 > WIDE;
  return box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, 4, DARK_STONE) + box(u0, v0, u1, v1, 4, 22, STONE) + courseLeft(u0, u1, v1, 4, 22, 4) + courseRight(u1, v0, v1, 4, 22, 4) + box(u0, v0, u1, v1, 22, 42, PLASTER) + timberLeft(u0, u1, v1, 22, 42) + timberRight(u1, v0, v1, 22, 42) + face([[door - 0.12, v1, 4], [door + 0.12, v1, 4], [door + 0.12, v1, 20], [door - 0.12, v1, 20]], "#6A3F6E", ` stroke="${OUT}" stroke-width="0.7"`) + dot(...P(door + 0.08, v1, 12), 1.1, GOLD.left) + shuttered(u0 + 0.12, u0 + 0.3, v1, 9, 17, "#6F5DA6", MAGIC_GLASS) + (wide ? shuttered(u1 - 0.32, u1 - 0.14, v1, 9, 17, "#6F5DA6", MAGIC_GLASS) : "") + shuttered(u0 + 0.14, u0 + 0.32, v1, 28, 37, "#6F5DA6", MAGIC_GLASS) + shuttered(u1 - 0.34, u1 - 0.16, v1, 28, 37, "#6F5DA6", MAGIC_GLASS) + windowR(u1, v0 + 0.2, v0 + 0.4, 28, 37, MAGIC_GLASS) + windowR(u1, v0 + 0.2, v0 + 0.4, 9, 17, MAGIC_GLASS) + flaskSign(u0 + 0.42, v1, 30) + cylinder(cu, cv, 42, 92, 0.07, COPPER, `ah-ch-${f2(u0)}`) + cylinder(cu, cv, 92, 96, 0.1, COPPER, `ah-cap-${f2(u0)}`) + gable(u0, v0, u1, v1, 42, 28, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.12) + roofTextureOf(skin2, "toit-ardoise", u0, v0, u1, v1, 42, 28, 0.12) + dormer(u0 + 0.36, 0.11, vm, v1 + 0.12, 70, 42, 0.62, roof) + (wide ? dormer(u1 - 0.34, 0.11, vm, v1 + 0.12, 70, 42, 0.62, roof) : "");
}
__name(alchemistHouse, "alchemistHouse");
var vaporOf = /* @__PURE__ */ __name((rect) => {
  const [cu, cv] = chimneyOf(rect);
  const [x, y] = P(cu, cv, 98);
  return (f) => sprite([0, 1, 2].map((k) => {
    const t = (f / 4 + k / 3) % 1;
    return dot(x + Math.sin((t + k) * 5) * 3 + t * 6, y - t * 26, 2.4 + t * 4, ["rgba(160,220,200,", "rgba(190,160,240,", "rgba(250,180,220,"][k] + f2(0.75 * (1 - t)) + ")");
  }).join(""), { x: x - 20, y: y - 44, w: 44, h: 50 });
}, "vaporOf");
function laboratory(u, v) {
  const neckStart = P(u, v, 40);
  const neckEnd = P(u + 0.3, v + 0.42, 24);
  return box(u - 0.26, v - 0.26, u + 0.24, v + 0.22, 0, 16, BRICK) + face([[u - 0.14, v + 0.22, 2], [u + 0.1, v + 0.22, 2], [u + 0.1, v + 0.22, 10], [u - 0.14, v + 0.22, 10]], "#3A1E14") + face([[u - 0.1, v + 0.22, 3], [u + 0.06, v + 0.22, 3], [u + 0.06, v + 0.22, 7], [u - 0.1, v + 0.22, 7]], "#F28A3A") + cylinder(u, v, 16, 32, 0.19, COPPER, `lab-cuve-${f2(u)}`) + dome(u, v, 32, 0.19, COPPER, `lab-dome-${f2(u)}`) + `<path d="M${f2(neckStart[0])},${f2(neckStart[1])} C${f2(neckStart[0] + 10)},${f2(neckStart[1] - 8)} ${f2(neckEnd[0] - 3)},${f2(neckEnd[1] - 16)} ${f2(neckEnd[0])},${f2(neckEnd[1] - 3)}" stroke="${COPPER.right}" stroke-width="3" fill="none" stroke-linecap="round"/>` + cylinder(u + 0.3, v + 0.42, 0, 22, 0.11, { top: "#8FB3C4", left: "#6E95A8", right: "#4E7184" }, `lab-cool-${f2(u)}`) + [6, 12, 17].map((z) => {
    const [x, y] = P(u + 0.3, v + 0.42, z);
    return `<path d="M${f2(x - 5.6)},${f2(y)} A5.6,2.8 0 0 0 ${f2(x + 5.6)},${f2(y)}" stroke="${COPPER.left}" stroke-width="1.3" fill="none"/>`;
  }).join("");
}
__name(laboratory, "laboratory");
var HOUSE_IV = { u0: -1.02, u1: 0.42, v0: -0.86, v1: 0.42 };
function alchemistHome(skin2) {
  return big(
    bigShadow(80, 37) + pavedPath([0, 0.5], [0, 1.48], 0.26) + alchemistHouse(skin2, HOUSE_IV) + laboratory(0.8, -0.16) + herbGarden(0.46, 0.5, 0.98, 0.86) + flowerBed(-0.66, 0.86, 0.15, ["#9C82DE", "#FFFFFF", "#F7A8C8"])
  );
}
__name(alchemistHome, "alchemistHome");
var HOUSE_V = { u0: -1.05, u1: 0.22, v0: -0.72, v1: 0.42 };
function towerWindow(u, v, r, z0, z1, glass = MAGIC_GLASS) {
  const [x, y0] = P(u + r * 0.7, v + r * 0.7, z0);
  const h = z1 - z0;
  return `<path d="M${f2(x - 3)},${f2(y0)} v${f2(-h + 3)} a3,3 0 0 1 6,0 v${f2(h - 3)} Z" fill="${glass}" stroke="#FFFFFF" stroke-width="0.9"/>`;
}
__name(towerWindow, "towerWindow");
var quill = /* @__PURE__ */ __name((x, y) => ln([x, y], [x, y - 8], "#7A5A3A", 1.4) + `<path d="M${f2(x)},${f2(y - 8)} q8,-6 10,-16 q-8,3 -10,16 Z" fill="#F7E7B5" stroke="#B8902F" stroke-width="0.8"/>`, "quill");
function balcony(u, v, r, z) {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25, ry = r * 22.63;
  return `<path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y)} L${f2(x + rx)},${f2(y + 3)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(x - rx)},${f2(y + 3)} Z" fill="${DARK_STONE.left}" stroke="${OUT}" stroke-width="0.6"/><path d="M${f2(x - rx)},${f2(y - 7)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y - 7)}" fill="none" stroke="${IRON.right}" stroke-width="1"/>` + [-0.8, -0.4, 0, 0.4, 0.8].map((k) => {
    const px = x + k * rx;
    const py = y + Math.sqrt(1 - k * k) * ry;
    return ln([px, py], [px, py - 7], IRON.right, 0.8);
  }).join("");
}
__name(balcony, "balcony");
var STUDY = { u: 0.66, v: -0.62, r: 0.34, z: 92 };
function studyTower(skin2) {
  const roof = roofOf(skin2, VIOLET);
  const { u, v, r, z } = STUDY;
  const [tx, ty] = P(u, v, z);
  return big(
    bigShadow(84, 39) + pavedPath([-0.2, 0.5], [-0.2, 1.48], 0.26) + tower(u, v, r, 0, z, { stone: STONE, roof: volumeOf(roof), roofH: 40, id: "st-tw" }) + towerWindow(u, v, r, 24, 40) + towerWindow(u, v, r, 52, 70) + balcony(u, v, r + 0.08, 74) + quill(tx, ty - 47) + alchemistHouse(skin2, HOUSE_V) + herbGarden(0.36, 0.42, 0.98, 0.82) + flowerBed(-0.72, 0.86, 0.15, ["#9C82DE", "#FFFFFF", "#F7A8C8"])
  );
}
__name(studyTower, "studyTower");
var HOUSE_VI = { u0: -1.08, u1: -0.02, v0: -0.4, v1: 0.5 };
var GREAT = { u: 0.42, v: -0.62, r: 0.46, z: 112 };
function greatTower(skin2) {
  const roof = roofOf(skin2, VIOLET);
  const { u, v, r, z } = GREAT;
  const [tx, ty] = P(u, v, z);
  return big(
    bigShadow(88, 41) + pavedPath([-0.48, 0.58], [-0.48, 1.48], 0.24) + box(u - 0.62, v - 0.62, u + 0.62, v + 0.62, 0, 6, DARK_STONE) + cylinder(u, v, 6, z, r, STONE, "gt-wall") + [20, 46, 72].map((k) => `<path d="M${f2(P(u, v, k)[0] - r * 45.25)},${f2(P(u, v, k)[1])} A${f2(r * 45.25)},${f2(r * 22.63)} 0 0 0 ${f2(P(u, v, k)[0] + r * 45.25)},${f2(P(u, v, k)[1])}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.8"/>`).join("") + face([[u + 0.22, v + 0.42, 6], [u + 0.42, v + 0.22, 6], [u + 0.42, v + 0.22, 24], [u + 0.22, v + 0.42, 24]], "#6A3F6E", ` stroke="${OUT}" stroke-width="0.7"`) + towerWindow(u, v, r, 34, 50) + towerWindow(u, v, r, 60, 78) + towerWindow(u, v, r, 88, 102) + cylinder(u, v, z, z + 3, r + 0.1, { top: "#B9B2A2", left: "#968E7C", right: "#736B5B" }, "gt-gal") + dome(u, v, z + 3, r, { top: "#FFFFFF", left: roof.front, right: roof.back }, "gt-dome") + `<path d="M${f2(tx - 3)},${f2(ty - 5)} L${f2(tx - 2)},${f2(ty - 36)} L${f2(tx + 5)},${f2(ty - 36)} L${f2(tx + 5)},${f2(ty - 5)} Z" fill="#20304A"/>` + ln([tx, ty - 18], [tx + 28, ty - 44], "#E9C46A", 5.5) + ln([tx, ty - 18], [tx + 28, ty - 44], "#B8902F", 1.4) + `<circle cx="${f2(tx + 29)}" cy="${f2(ty - 45)}" r="3.4" fill="#20304A" stroke="#B8902F" stroke-width="1"/>` + alchemistHouse(skin2, HOUSE_VI) + herbGarden(0.3, 0.42, 0.98, 0.82) + lampPost(-0.2, 0.75, 24)
  );
}
__name(greatTower, "greatTower");
var LIGHT = { u: 0.42, v: -0.5, r0: 0.4, r1: 0.26, z: 132 };
var MIST_STONE = { top: "#FFFFFF", left: "#F4F7FA", right: "#C9D3DC" };
var HOUSE_VII = { u0: -1.08, u1: -0.04, v0: -0.42, v1: 0.48 };
function mistLighthouse(skin2) {
  const roof = roofOf(skin2, VIOLET);
  const { u, v, r0, r1, z } = LIGHT;
  const [bx, by] = P(u, v, 0);
  const [tx, ty] = P(u, v, z);
  const w0 = r0 * 45.25, w1 = r1 * 45.25;
  const band = /* @__PURE__ */ __name((z0, z1) => {
    const k0 = z0 / z, k1 = z1 / z;
    const a = w0 + (w1 - w0) * k0, b = w0 + (w1 - w0) * k1;
    const [, y0] = P(u, v, z0);
    const [, y1] = P(u, v, z1);
    return `<path d="M${f2(bx - a)},${f2(y0)} A${f2(a)},${f2(a / 2)} 0 0 0 ${f2(bx + a)},${f2(y0)} L${f2(bx + b)},${f2(y1)} A${f2(b)},${f2(b / 2)} 0 0 1 ${f2(bx - b)},${f2(y1)} Z" fill="#9FC9E6" opacity=".85"/>`;
  }, "band");
  const mist = [[0.34, 0.3, 22, 7], [0.52, -0.12, 18, 6], [0.06, 0.5, 20, 6]].map(([du, dv, rx, ry]) => {
    const [x, y] = P(u + du, v + dv, 4);
    return ell(x, y, rx, ry, "rgba(232,242,250,.55)") + ell(x - rx * 0.3, y - 2, rx * 0.5, ry * 0.6, "rgba(255,255,255,.5)");
  }).join("");
  const glow = WISP.calm;
  return big(
    bigShadow(88, 41) + pavedPath([-0.52, 0.56], [-0.52, 1.48], 0.24) + box(u - 0.6, v - 0.6, u + 0.6, v + 0.6, 0, 6, DARK_STONE) + `<defs><linearGradient id="pb-g" x1="0" x2="1"><stop offset="0" stop-color="${MIST_STONE.top}"/><stop offset="1" stop-color="${MIST_STONE.right}"/></linearGradient></defs><path d="M${f2(bx - w0)},${f2(by - 6)} L${f2(tx - w1)},${f2(ty)} A${f2(w1)},${f2(w1 / 2)} 0 0 0 ${f2(tx + w1)},${f2(ty)} L${f2(bx + w0)},${f2(by - 6)} A${f2(w0)},${f2(w0 / 2)} 0 0 1 ${f2(bx - w0)},${f2(by - 6)} Z" fill="url(#pb-g)" stroke="${OUT}" stroke-width="0.8"/>` + band(30, 42) + band(78, 90) + face([[u + 0.2, v + 0.36, 6], [u + 0.36, v + 0.2, 6], [u + 0.36, v + 0.2, 24], [u + 0.2, v + 0.36, 24]], "#6A3F6E", ` stroke="${OUT}" stroke-width="0.7"`) + towerWindow(u, v, r0 * 0.82, 52, 66, "#CFE9F7") + towerWindow(u, v, r1 * 1.1, 100, 114, "#CFE9F7") + cylinder(u, v, z, z + 3, r1 + 0.12, { top: "#55504A", left: "#4A4640", right: "#2C2925" }, "pb-gal") + cylinder(u, v, z + 3, z + 22, r1 * 0.8, { top: glow.flame, left: "#E8F8FF", right: "#9FD8F0" }, "pb-lamp") + `<path d="M${f2(tx)},${f2(ty - 6)} C${f2(tx + 6)},${f2(ty - 9)} ${f2(tx + 3)},${f2(ty - 18)} ${f2(tx)},${f2(ty - 23)} C${f2(tx - 3)},${f2(ty - 18)} ${f2(tx - 6)},${f2(ty - 9)} ${f2(tx)},${f2(ty - 6)} Z" fill="${glow.edge}"/><path d="M${f2(tx)},${f2(ty - 8)} C${f2(tx + 3)},${f2(ty - 10)} ${f2(tx + 2)},${f2(ty - 15)} ${f2(tx)},${f2(ty - 18)} C${f2(tx - 2)},${f2(ty - 15)} ${f2(tx - 3)},${f2(ty - 10)} ${f2(tx)},${f2(ty - 8)} Z" fill="${glow.core}"/>` + dot(tx - 1.6, ty - 12, 0.7, WISP.eye) + dot(tx + 1.6, ty - 12, 0.7, WISP.eye) + [-1, 0, 1].map((k) => ln([tx + k * w1 * 0.5, ty - 3], [tx + k * w1 * 0.5, ty - 22], "#3D3A36", 0.7)).join("") + `<path d="M${f2(tx - w1 - 3)},${f2(ty - 22)} L${f2(tx)},${f2(ty - 40)} L${f2(tx + w1 + 3)},${f2(ty - 22)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.7"/><path d="M${f2(tx)},${f2(ty - 40)} L${f2(tx + w1 + 3)},${f2(ty - 22)} L${f2(tx + 4)},${f2(ty - 21)} Z" fill="${roof.back}"/>` + (HIVER ? snowCap("pb-neige", `M${f2(tx - w1 - 3)},${f2(ty - 22)} L${f2(tx)},${f2(ty - 40)} L${f2(tx + w1 + 3)},${f2(ty - 22)} Z`, tx, ty - 40, w1 + 3, 10) : "") + dot(tx, ty - 42, 1.8, GOLD.left) + mist + alchemistHouse(skin2, HOUSE_VII) + herbGarden(0.3, 0.42, 0.98, 0.82) + lampPost(-0.24, 0.76, 24)
  );
}
__name(mistLighthouse, "mistLighthouse");
function beam(f) {
  const { u, v, z } = LIGHT;
  const [tx, ty] = P(u, v, z + 12);
  const a = f / 8 * Math.PI * 2;
  const len = 84;
  const dx = Math.cos(a) * len;
  const dy = Math.sin(a) * len * 0.45;
  const spread2 = 12;
  return sprite(
    `<path d="M${f2(tx)},${f2(ty)} L${f2(tx + dx - Math.sin(a) * spread2)},${f2(ty + dy + Math.cos(a) * spread2 * 0.45)} L${f2(tx + dx + Math.sin(a) * spread2)},${f2(ty + dy - Math.cos(a) * spread2 * 0.45)} Z" fill="${WISP.calm.flame}" opacity="${f2(0.2 + 0.12 * Math.max(0, Math.cos(a - 0.8)))}"/>`,
    { x: tx - 100, y: ty - 50, w: 200, h: 100 }
  );
}
__name(beam, "beam");
var lightsOf = /* @__PURE__ */ __name((rect, extra) => [
  [rect.u0 + 0.21, rect.v1, 13, 14],
  [rect.u0 + 0.23, rect.v1, 32, 14],
  [rect.u1 - 0.25, rect.v1, 32, 14],
  [rect.u1, rect.v0 + 0.3, 32, 14],
  ...rect.u1 - rect.u0 > WIDE ? [[rect.u1 - 0.23, rect.v1, 13, 14]] : [],
  ...extra
], "lightsOf");
var FOYER_TIERS = [
  {
    make: alchemistHome,
    lights: lightsOf(HOUSE_IV, [[0.78, 0.06, 6, 18]]),
    anims: [{ key: "vapor", n: 4, fps: 3, frame: vaporOf(HOUSE_IV) }]
  },
  {
    make: studyTower,
    lights: lightsOf(HOUSE_V, [[STUDY.u + STUDY.r * 0.7, STUDY.v + STUDY.r * 0.7, 32, 14], [STUDY.u + STUDY.r * 0.7, STUDY.v + STUDY.r * 0.7, 61, 14]]),
    anims: [{ key: "vapor", n: 4, fps: 3, frame: vaporOf(HOUSE_V) }]
  },
  {
    make: greatTower,
    lights: lightsOf(HOUSE_VI, [[GREAT.u + GREAT.r * 0.7, GREAT.v + GREAT.r * 0.7, 42, 14], [GREAT.u + GREAT.r * 0.7, GREAT.v + GREAT.r * 0.7, 95, 14], [-0.2, 0.75, 25, 16]]),
    anims: [{ key: "vapor", n: 4, fps: 3, frame: vaporOf(HOUSE_VI) }]
  },
  {
    make: mistLighthouse,
    lights: lightsOf(HOUSE_VII, [[LIGHT.u, LIGHT.v, LIGHT.z + 12, 34], [-0.24, 0.76, 25, 16]]),
    anims: [{ key: "beam", n: 8, fps: 4, frame: beam }, { key: "vapor", n: 4, fps: 3, frame: vaporOf(HOUSE_VII) }]
  }
];

// atelier/port/src/world/tiers/carriere.js
var inner = /* @__PURE__ */ __name((s) => s.svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""), "inner");
var rockOf = /* @__PURE__ */ __name((skin2) => ROCKS[skin2] || STONE, "rockOf");
var ORE = { top: "#8A8F98", left: "#6B7079", right: "#50545C" };
function oreHeap(u, v, s = 1) {
  let out = "";
  [[-0.06, -0.04, 4], [0.05, -0.05, 3.6], [0, 0.03, 4.4], [-0.08, 0.05, 3], [0.08, 0.04, 3.2], [0, -0.01, 3.4, 4]].forEach(([du, dv, r, z = 0]) => {
    const [x, y] = P(u + du * s, v + dv * s, z);
    out += ell(x + r * 0.1, y + r * 0.2, r * s, r * 0.65 * s, ORE.right) + ell(x, y, r * s, r * 0.66 * s, ORE.left) + ell(x - r * 0.3, y - r * 0.25, r * 0.5 * s, r * 0.3 * s, ORE.top);
  });
  [[0, -0.02, 5], [-0.05, 0.03, 2], [0.06, 0.02, 2.5]].forEach(([du, dv, z]) => {
    const [x, y] = P(u + du * s, v + dv * s, z);
    out += `<path d="M${f2(x)},${f2(y - 1.6)} l1.2,1.6 l-1.2,1.6 l-1.2,-1.6 Z" fill="${GOLD.left}"/>`;
  });
  return out;
}
__name(oreHeap, "oreHeap");
function track(u, v0, v1, k = 1) {
  let out = "";
  for (let v = v0 + 0.06; v < v1; v += 0.17 * k) out += box(u - 0.15 * k, v - 0.02, u + 0.15 * k, v + 0.02, 0, 1.5, WOOD_DARK);
  return out + ln(P(u - 0.1 * k, v0, 1.5), P(u - 0.1 * k, v1, 1.5), "#7C8894", 1.2) + ln(P(u + 0.1 * k, v0, 1.5), P(u + 0.1 * k, v1, 1.5), "#7C8894", 1.2);
}
__name(track, "track");
function cart(u, v, k = 1) {
  return box(u - 0.11 * k, v - 0.14 * k, u + 0.11 * k, v + 0.14 * k, 2, 11, { top: "#2E2A26", left: IRON.left, right: IRON.right }) + oreHeap(u, v, 0.7 * k) + `<circle cx="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/><circle cx="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/>`;
}
__name(cart, "cart");
function ventShaft(u, v, z) {
  const [vx, vy] = P(u, v, z);
  return box(u - 0.1, v - 0.08, u + 0.1, v + 0.08, z, z + 6, WOOD_DARK) + ln([vx - 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8) + ln([vx + 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8) + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="4.6" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.4"/>` + dot(vx, vy - 20, 1.2, WOOD_DARK.right);
}
__name(ventShaft, "ventShaft");
function gallery(skin2) {
  const rock = rockOf(skin2);
  return sprite(
    inner(UPGRADES.carriere(skin2)) + ventShaft(0.12, -0.6, 44) + archLeft(-0.35, 0.26, -0.18, 0, 30, rock.left, ` stroke="${OUT}" stroke-width="0.8"`) + archLeft(-0.35, 0.19, -0.175, 0, 25, "#241E1A") + `<rect x="${f2(P(-0.35, -0.17, 29)[0] - 3)}" y="${f2(P(-0.35, -0.17, 29)[1] - 3)}" width="6" height="6" fill="${rock.top}" stroke="${OUT}" stroke-width="0.6"/>` + [[-0.58, 22], [-0.47, 28], [-0.23, 28], [-0.12, 22]].map(([u, z]) => {
      const [x, y] = P(u, -0.16, z);
      return dot(x, y + 2, 1.8, "#FFE08A") + ln([x, y - 1], [x, y + 0.4], "#3D3A36", 0.6);
    }).join("") + ln(P(-0.6, -0.16, 22), P(-0.47, -0.16, 27), "#3D3A36", 0.5) + ln(P(-0.47, -0.16, 27), P(-0.23, -0.16, 27), "#3D3A36", 0.5) + ln(P(-0.23, -0.16, 27), P(-0.1, -0.16, 22), "#3D3A36", 0.5) + oreHeap(0.58, 0.48, 1.2),
    BUILDING_BOX
  );
}
__name(gallery, "gallery");
function minesite(skin2, { portalTall = 36, giant = false } = {}) {
  const rock = rockOf(skin2);
  const cliff = rockBox(-1.45, -1.45, 1.4, -0.3, 0, 62, rock) + rockBox(0.55, -0.3, 1.4, 0.15, 0, 30, rock);
  const portal = giant ? "" : archLeft(-0.53, 0.3, -0.3, 0, portalTall, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`) + archLeft(-0.53, 0.24, -0.295, 0, portalTall - 5, "#1F1A17") + box(-0.86, -0.32, -0.8, -0.26, 0, portalTall, WOOD_DARK) + box(-0.26, -0.32, -0.2, -0.26, 0, portalTall, WOOD_DARK);
  const veins = skin2 === "roche-cristal" ? [[-1.25, -0.3, 34, 1.4], [-0.1, -0.3, 44, 1.2], [0.95, -0.3, 22, 1.25], [1.4, 0, 12, 1.1]].map(([u, v, z, k]) => crystals(u, v, z, k)).join("") + [[-0.95, -1.15, 62, 1.8], [0.35, -1, 62, 1.5], [1.1, -0.1, 30, 1.4]].map(([u, v, z, k]) => crystals(u, v, z, k) + crystals(u + 0.07, v + 0.04, z, k * 0.65)).join("") : "";
  return bigShadow(90, 42) + cliff + veins + portal + track(-0.53, -0.3, 1.18, 1.5) + cart(-0.53, 0.88, 1.2) + oreHeap(-1.05, 0.15, 1.6) + oreHeap(0.15, 0.55, 1.4) + pebble(-1.2, 1.15, 3.2, DARK_STONE) + pebble(0.62, 0.92, 2.6, DARK_STONE);
}
__name(minesite, "minesite");
function headframe(u, v, h, color = WOOD, iron = false) {
  const [bx, by] = P(u, v, 0);
  const [tx, ty] = P(u, v, h);
  const leg = iron ? IRON.right : color.right;
  const w = 15;
  let out = face([[u - 0.14, v - 0.14, 0.4], [u + 0.14, v - 0.14, 0.4], [u + 0.14, v + 0.14, 0.4], [u - 0.14, v + 0.14, 0.4]], "#1F1A17");
  out += ln([bx - w, by], [tx - 3, ty], leg, 2.4) + ln([bx + w, by - 2], [tx + 3, ty], leg, 2.4) + ln([bx, by + 6], [tx, ty], leg, 2.2);
  for (let k = 1; k < 4; k++) {
    const t = k / 4;
    const lx = bx - w + (tx - 3 - bx + w) * t;
    const rx = bx + w + (tx + 3 - bx - w) * t;
    const yy = by + (ty - by) * t;
    out += ln([lx, yy], [rx, yy - 1], leg, 1) + (k < 3 ? ln([lx, yy], [bx + w + (tx + 3 - bx - w) * (t + 0.25), by + (ty - by) * (t + 0.25)], leg, 0.7) : "");
  }
  out += box(u - 0.12, v - 0.05, u + 0.12, v + 0.05, h - 2, h + 2, iron ? IRON : color);
  [[-5, 0], [5, -2]].forEach(([dx, dy]) => {
    out += `<circle cx="${f2(tx + dx)}" cy="${f2(ty - 7 + dy)}" r="6.5" fill="none" stroke="${iron ? "#41484F" : WOOD_DARK.right}" stroke-width="1.6"/>` + dot(tx + dx, ty - 7 + dy, 1.4, iron ? "#41484F" : WOOD_DARK.right) + [0, 1, 2].map((k) => {
      const a = k * 1.05;
      return ln([tx + dx - Math.cos(a) * 6, ty - 7 + dy - Math.sin(a) * 6], [tx + dx + Math.cos(a) * 6, ty - 7 + dy + Math.sin(a) * 6], iron ? "#41484F" : WOOD_DARK.right, 0.6);
    }).join("");
  });
  return out + ln([tx - 5, ty - 1], [bx - 2, by - 2], "#3D3A36", 0.6) + ln([tx + 5, ty - 3], [bx + 2, by - 3], "#3D3A36", 0.6);
}
__name(headframe, "headframe");
function galleries(skin2) {
  return big(
    minesite(skin2) + archLeft(0.12, 0.2, -0.3, 0, 26, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`) + archLeft(0.12, 0.15, -0.295, 0, 22, "#1F1A17") + track(0.12, -0.3, 0.36, 1.2) + cart(0.12, 0.08, 1.1) + ventShaft(-0.95, -0.95, 62) + [0, 1, 2].map((k) => box(0.7, -0.2 + k * 0.1, 1.3, -0.14 + k * 0.1, 30 + (k === 1 ? 4 : 0), 34 + (k === 1 ? 4 : 0), WOOD)).join("") + lampPost(-0.12, 0.02, 30)
  );
}
__name(galleries, "galleries");
function shaftMine(skin2) {
  return big(
    minesite(skin2) + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[0.95, 0.62, 0], [1.38, 0.62, 0], [1.38, 0.62, 22], [0.95, 0.62, 22]], WOOD.left) + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], "#3A2A1E") + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], "#5C6880") + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], "#7D8AA0") + ventShaft(-0.95, -0.95, 62) + headframe(0.5, 0.15, 78, IRON, true) + barrel(1.25, 0.82, "pm-b1") + crate(0.92, 0.85, 0.11, 9)
  );
}
__name(shaftMine, "shaftMine");
var crystalCluster = /* @__PURE__ */ __name((u, v, z, s) => crystals(u, v, z, s) + crystals(u + 0.08, v + 0.04, z, s * 0.7), "crystalCluster");
function crystalMine(skin2) {
  return big(
    minesite(skin2) + [[-1.1, -0.3, 20, 1.3], [-0.05, -0.3, 30, 1.1], [0.35, -0.3, 14, 0.9], [1.4, -0.9, 34, 1.2], [1.4, -0.5, 18, 0.9]].map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join("") + [[-0.9, -1, 62, 1.6], [0.2, -0.9, 62, 1.9], [0.9, -0.7, 62, 1.4], [1, -0.05, 30, 1.2]].map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join("") + headframe(0.5, 0.15, 74, { top: "#B9A0F0", left: "#9C82DE", right: "#7A60C0" }) + crystalCluster(0.12, 0.62, 0, 1.4) + crystalCluster(-1, 0.3, 0, 1.2) + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], "#3A2A1E") + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], "#7A60C0") + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], "#9C82DE")
  );
}
__name(crystalMine, "crystalMine");
function cottage(u0, v0, u1, v1, z, roof, wall = PLASTER) {
  const h = 16;
  const um = (u0 + u1) / 2;
  return box(u0, v0, u1, v1, z, z + h, wall) + face([[um - 0.06, v1, z], [um + 0.04, v1, z], [um + 0.04, v1, z + 10], [um - 0.06, v1, z + 10]], "#7A4E2C") + face([[u1, (v0 + v1) / 2 - 0.05, z + 6], [u1, (v0 + v1) / 2 + 0.05, z + 6], [u1, (v0 + v1) / 2 + 0.05, z + 12], [u1, (v0 + v1) / 2 - 0.05, z + 12]], "#FFE6A3") + box(u0 + 0.06, v0 + 0.04, u0 + 0.13, v0 + 0.11, z + h, z + h + 14, BRICK) + gable(u0, v0, u1, v1, z + h, 11, { front: roof.front, back: roof.back, gable: wall.right }, 0.05) + roofTexture(roof === MINER_ROOF_2 ? "toit-ardoise" : "toit-rouge", u0, v0, u1, v1, z + h, 11, 0.05);
}
__name(cottage, "cottage");
function belfry(u, v, z, roof) {
  const [bx, by] = P(u + 0.1, v + 0.1, z + 30);
  const T = P(u, v, z + 54), sn = /* @__PURE__ */ __name((p, q, g) => HIVER ? snowPan(T, T, P(...q, z + 34), P(...p, z + 34), 0.72, g) : "", "sn");
  return box(u - 0.1, v - 0.1, u + 0.1, v + 0.1, z, z + 34, STONE) + face([[u - 0.05, v + 0.1, z + 24], [u + 0.05, v + 0.1, z + 24], [u + 0.05, v + 0.1, z + 32], [u - 0.05, v + 0.1, z + 32]], "#2E2620") + dot(bx - 4, by + 1, 2.2, GOLD.left) + face([[u - 0.13, v - 0.13, z + 34], [u + 0.13, v - 0.13, z + 34], [u, v, z + 54]], roof.back) + sn([u - 0.13, v - 0.13], [u + 0.13, v - 0.13]) + face([[u - 0.13, v + 0.13, z + 34], [u + 0.13, v + 0.13, z + 34], [u, v, z + 54]], roof.front) + sn([u + 0.13, v + 0.13], [u - 0.13, v + 0.13], true) + face([[u + 0.13, v - 0.13, z + 34], [u + 0.13, v + 0.13, z + 34], [u, v, z + 54]], roof.back) + sn([u + 0.13, v - 0.13], [u + 0.13, v + 0.13], true);
}
__name(belfry, "belfry");
var MINER_ROOF = { front: "#E06E52", back: "#B9503B" };
var MINER_ROOF_2 = { front: "#7D8AA0", back: "#5C6880" };
function miningTown(skin2) {
  return big(
    minesite(skin2) + cottage(-1.35, -1.38, -1, -1.05, 62, MINER_ROOF_2) + belfry(-0.72, -1.15, 62, MINER_ROOF) + cottage(-0.4, -1.4, -0.05, -1.08, 62, MINER_ROOF) + cottage(0.8, -0.24, 1.32, 0.08, 30, MINER_ROOF) + headframe(0.45, 0.12, 72, IRON, true) + cottage(0.72, 0.32, 1.06, 0.66, 0, MINER_ROOF_2) + cottage(1.1, 0.32, 1.42, 0.66, 0, MINER_ROOF) + [[1.4, -0.9, 34, 1], [-0.05, -0.3, 30, 0.9]].map(([u, v, z, k]) => crystals(u, v, z, k)).join("") + lampPost(-0.12, 0.02, 30) + lampPost(0.55, 0.85, 26)
  );
}
__name(miningTown, "miningTown");
var CARRIERE_TIERS = [
  { make: gallery, lights: [[0.04, -0.23, 34, 18], [-0.35, -0.16, 26, 20]] },
  { make: galleries, lights: [[-0.53, -0.3, 18, 24], [0.12, -0.3, 12, 16], [-0.12, 0.02, 31, 16]] },
  { make: shaftMine, lights: [[-0.53, -0.3, 18, 24], [1.15, 0.62, 10, 14]] },
  { make: crystalMine, lights: [[-0.53, -0.3, 18, 24], [-1.1, -0.3, 26, 16], [-0.05, -0.3, 34, 14], [1.4, -0.9, 40, 16], [0.12, 0.62, 8, 16], [-1, 0.3, 8, 14]] },
  {
    make: miningTown,
    lights: [[-0.53, -0.3, 18, 24], [-0.12, 0.02, 31, 16], [0.55, 0.85, 27, 16], [1.06, 0.49, 9, 12], [1.42, 0.49, 9, 12], [1.32, -0.08, 39, 12], [-1, -1.22, 71, 10], [-0.05, -1.24, 71, 10]],
    smoke: [[0.89, -0.17, 62], [0.81, 0.39, 32], [1.19, 0.39, 32]]
  }
];

// atelier/port/src/world/tiers/bosquet.js
var leavesOf = /* @__PURE__ */ __name((skin2) => FOLIAGE[skin2] || LEAVES, "leavesOf");
var LOG = { top: "#A8743F", left: "#8B5631", right: "#F1D3A1" };
var SHINGLE = { front: "#8E6A4A", back: "#6F5038" };
function pine(u, v, s, skin2) {
  const [x, y] = P(u, v, 0);
  const X = /* @__PURE__ */ __name((dx) => f2(x + dx * s), "X"), Y = /* @__PURE__ */ __name((dy) => f2(y + dy * s), "Y");
  let out = shadow(u, v, 0.28 * s) + `<path d="M${X(-2)},${Y(1)} L${X(-1.6)},${Y(-10)} L${X(1.6)},${Y(-10)} L${X(2)},${Y(1)} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.8"/>`;
  [[-6, 17, 20], [-17, 13.6, 19], [-27, 10.4, 18]].forEach(([dy, w, h]) => {
    const top = dy - h;
    let edge = "";
    for (let i = 0; i < 4; i++) {
      const a = -w + 2 * w * i / 4, b = -w + 2 * w * (i + 1) / 4;
      edge += ` Q${X((a + b) / 2)},${Y(dy + 3)} ${X(b)},${Y(dy)}`;
    }
    out += `<path d="M${X(-w)},${Y(dy)}${edge} L${X(0)},${Y(top)} Z" fill="${PINE.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${X(0)},${Y(top)} L${X(w)},${Y(dy)} Q${X(w * 0.75)},${Y(dy + 3)} ${X(w * 0.5)},${Y(dy)} Q${X(w * 0.25)},${Y(dy + 3)} ${X(0.6)},${Y(dy + 0.6)} Z" fill="${PINE.dark}"/><path d="M${X(-1.4)},${Y(top + 3)} L${X(-w * 0.62)},${Y(dy - 1.4)}" stroke="${PINE.light}" stroke-width="${f2(1.4 * s)}" stroke-linecap="round" opacity="0.9"/>`;
    if (skin2 === "givre") out += `<path d="M${X(-w * 0.5)},${Y(top + h * 0.5)} L${X(0)},${Y(top)} L${X(w * 0.5)},${Y(top + h * 0.5)} Q${X(0)},${Y(top + h * 0.38)} ${X(-w * 0.5)},${Y(top + h * 0.5)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/>`;
  });
  return out;
}
__name(pine, "pine");
function oak(u, v, s, skin2) {
  const colors = leavesOf(skin2);
  const [x, y] = P(u, v, 0);
  const id = treeId("ok", u, v, s);
  return shadow(u, v, 0.42 * s) + treeTrunk(x, y, s, 3.4, 18) + touffe(id + "f", x, y, s, [[-9, -50, 10], [8, -52, 11], [19, -40, 9], [-20, -40, 8.5]], backLeaves(colors)) + touffe(id + "m", x, y, s, [[0, -40, 10.5], [0, -30, 8, 0]], colors) + touffe(id + "g", x, y, s, [[-14, -33, 10], [-22, -26, 7], [-7, -25, 7, 0]], colors) + touffe(id + "d", x, y, s, [[13, -32, 10], [21, -25, 7], [6, -24, 7, 0]], colors) + seasonDots(skin2, x - 4 * s, y - 42 * s, 13 * s) + seasonDots(skin2, x + 8 * s, y - 30 * s, 10 * s);
}
__name(oak, "oak");
function logCabin(u0, v0, u1, v1, h, roofH, skin2) {
  const roof = roofOf(skin2, SHINGLE);
  let logs = "";
  for (let z = 2; z < h; z += 4) {
    logs += ln(P(u0, v1, z), P(u1, v1, z), "rgba(70,40,20,.45)", 0.9) + ln(P(u1, v0, z), P(u1, v1, z), "rgba(50,30,15,.45)", 0.9);
    const [ex, ey] = P(u1, v1, z);
    logs += dot(ex + 0.6, ey - 1.6, 1.8, LOG.right);
  }
  return box(u0, v0, u1, v1, 0, h, { top: LOG.top, left: "#9C6A3E", right: "#7E5230" }) + logs + face([[u0 + (u1 - u0) * 0.35, v1, 0], [u0 + (u1 - u0) * 0.6, v1, 0], [u0 + (u1 - u0) * 0.6, v1, h * 0.75], [u0 + (u1 - u0) * 0.35, v1, h * 0.75]], "#4A2E1A") + face([[u1, v0 + (v1 - v0) * 0.3, h * 0.35], [u1, v0 + (v1 - v0) * 0.62, h * 0.35], [u1, v0 + (v1 - v0) * 0.62, h * 0.75], [u1, v0 + (v1 - v0) * 0.3, h * 0.75]], "#FFE6A3", ' stroke="#7E5230" stroke-width="1"') + chimney(u0 + 0.08, v0 + 0.08, h, h + roofH + 6, 0.06, STONE) + gable(u0, v0, u1, v1, h, roofH, { front: roof.front, back: roof.back, gable: "#7E5230" }, 0.07) + (roofTexture(skin2, u0, v0, u1, v1, h, roofH, 0.07) || shingles(u0, v0, u1, v1, h, roofH, 0.07));
}
__name(logCabin, "logCabin");
function logPile(u, v, n = 3, s = 1) {
  let out = "";
  for (let row = 0; row < n; row++) {
    for (let k = 0; k < n - row; k++) {
      const dv = (k - (n - row - 1) / 2) * 0.075 * s;
      out += box(u - 0.16 * s, v + dv - 0.035 * s, u + 0.16 * s, v + dv + 0.035 * s, row * 4.6 * s, row * 4.6 * s + 4.6 * s, LOG) + ell(...P(u + 0.16 * s, v + dv, row * 4.6 * s + 2.3 * s), 1.2 * s, 1.7 * s, "none", ' stroke="#C9935E" stroke-width="0.5"');
    }
  }
  return out;
}
__name(logPile, "logPile");
function plankStack(u, v, layers = 5) {
  let out = "";
  for (let k = 0; k < layers; k++) out += box(u - 0.2, v - 0.1, u + 0.2, v + 0.1, k * 2.2, k * 2.2 + 2, k % 2 ? { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" } : { top: "#E9C58F", left: "#CFA06A", right: "#AD7C48" });
  return out;
}
__name(plankStack, "plankStack");
function clearing(skin2) {
  const colors = leavesOf(skin2);
  const tree = /* @__PURE__ */ __name((u, v, sc) => {
    const [x, y] = P(u, v, 0);
    return roundTree(u, v, sc, colors) + seasonDots(skin2, x, y - 34 * sc, 12 * sc);
  }, "tree");
  return sprite(
    tree(-0.55, -0.55, 1.15) + tree(0.5, -0.6, 1) + pine(-0.6, 0.3, 1, skin2) + logCabin(-0.12, -0.28, 0.42, 0.22, 20, 16, skin2) + logPile(-0.12, 0.48, 3, 0.9) + ell(...P(0.22, 0.42, 0), 7, 3, "#E9C88F"),
    BUILDING_BOX
  );
}
__name(clearing, "clearing");
function oakwood(skin2) {
  return big(
    bigShadow(84, 40) + oak(-0.95, -1, 1.55, skin2) + oak(0.1, -1.1, 1.7, skin2) + oak(0.95, -0.75, 1.4, skin2) + pine(-1.15, 0.2, 1.4, skin2) + logCabin(-0.35, -0.2, 0.45, 0.45, 24, 20, skin2) + logPile(-0.55, 0.75, 4, 1.1) + pavedPath([0.05, 0.5], [0.15, 1.45], 0.2)
  );
}
__name(oakwood, "oakwood");
var SAW_AT = [0, 0.15, 13];
function sawmill(skin2) {
  const roof = roofOf(skin2, SHINGLE);
  const posts = [[-0.7, -0.45], [0.55, -0.45], [-0.7, 0.45], [0.55, 0.45]].map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 34, WOOD_DARK)).join("");
  return big(
    bigShadow(86, 40) + oak(-1, -1.1, 1.45, skin2) + oak(0.35, -1.2, 1.55, skin2) + pine(1.1, -0.95, 1.3, skin2) + box(-0.75, -0.5, 0.6, -0.42, 0, 30, { top: "#C99359", left: "#B07A44", right: "#8E5E30" }) + boardsLeft(-0.75, 0.6, -0.42, 0, 30, 0.09) + posts + box(-0.6, 0.05, 0.45, 0.25, 0, 10, WOOD) + box(-0.55, 0.08, 0.05, 0.22, 10, 17, LOG) + ell(...P(0.05, 0.15, 13.5), 2.6, 3.6, LOG.right, ' stroke="#C9935E" stroke-width="0.6"') + gable(-0.75, -0.5, 0.6, 0.5, 34, 16, { front: roof.front, back: roof.back, gable: "#8E5E30" }, 0.08) + (roofTexture(skin2, -0.75, -0.5, 0.6, 0.5, 34, 16, 0.08) || shingles(-0.75, -0.5, 0.6, 0.5, 34, 16, 0.08)) + plankStack(0.95, 0.3, 6) + plankStack(0.95, 0.75, 4) + logPile(-1.05, 0.55, 4, 1.15) + ell(...P(0.25, 0.5, 0), 12, 4, "#EBCB93") + [[-6, 1], [4, 2], [8, -1]].map(([dx, dy]) => dot(P(0.25, 0.5, 0)[0] + dx, P(0.25, 0.5, 0)[1] + dy, 0.8, "#C9A16A")).join("")
  );
}
__name(sawmill, "sawmill");
var sawBlade = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(...SAW_AT);
  const r = 9;
  let teeth = "";
  for (let k = 0; k < 16; k++) {
    const a = k / 16 * Math.PI * 2 + f / 6 * (Math.PI / 8);
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    teeth += `${k ? "L" : "M"}${f2(x + ca * r * 0.894)},${f2(y + ca * r * 0.447 - sa * r)} `;
    const a2 = a + Math.PI / 16;
    teeth += `L${f2(x + Math.cos(a2) * (r + 1.8) * 0.894)},${f2(y + Math.cos(a2) * (r + 1.8) * 0.447 - Math.sin(a2) * (r + 1.8))} `;
  }
  return `<path d="${teeth}Z" fill="#C7CFD8" stroke="#68737E" stroke-width="0.7"/><ellipse cx="${f2(x)}" cy="${f2(y)}" rx="2.2" ry="2.4" fill="#68737E"/>` + ln([x + Math.cos(f) * 5 * 0.894, y + Math.cos(f) * 5 * 0.447 - Math.sin(f) * 5], [x - Math.cos(f) * 5 * 0.894, y - Math.cos(f) * 5 * 0.447 + Math.sin(f) * 5], "rgba(255,255,255,.7)", 0.8);
})(), { x: -30, y: -50, w: 50, h: 46 }), "sawBlade");
var CRANE = { u: 0.95, v: -0.2 };
function forestry(skin2) {
  const base = sawmill(skin2).svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const [tx, ty] = P(CRANE.u, CRANE.v, 74);
  return big(
    base + box(CRANE.u - 0.12, CRANE.v - 0.12, CRANE.u + 0.12, CRANE.v + 0.12, 0, 6, STONE) + box(CRANE.u - 0.06, CRANE.v - 0.06, CRANE.u + 0.06, CRANE.v + 0.06, 6, 74, { top: WOOD.top, left: "rgba(0,0,0,0)", right: "rgba(0,0,0,0)" }, "") + [[-0.06, 0.06], [0.06, 0.06], [0.06, -0.06]].map(([du, dv]) => ln(P(CRANE.u + du, CRANE.v + dv, 6), P(CRANE.u + du, CRANE.v + dv, 74), WOOD_DARK.right, 2.2)).join("") + [6, 23, 40, 57].map((z) => ln(P(CRANE.u - 0.06, CRANE.v + 0.06, z), P(CRANE.u + 0.06, CRANE.v + 0.06, z + 17), WOOD_DARK.left, 1) + ln(P(CRANE.u + 0.06, CRANE.v + 0.06, z), P(CRANE.u - 0.06, CRANE.v + 0.06, z + 17), WOOD_DARK.left, 1) + ln(P(CRANE.u + 0.06, CRANE.v + 0.06, z), P(CRANE.u + 0.06, CRANE.v - 0.06, z + 17), WOOD_DARK.right, 0.9)).join("") + box(CRANE.u - 0.09, CRANE.v - 0.09, CRANE.u + 0.09, CRANE.v + 0.09, 72, 77, WOOD) + ln([tx, ty - 3], P(-0.1, 0.55, 70), WOOD.right, 3) + ln([tx, ty + 4], P(-0.1, 0.55, 70), WOOD_DARK.right, 1.2) + ln([tx, ty - 3], P(1.25, -0.5, 66), WOOD.right, 2.6) + ln([tx, ty - 14], P(-0.1, 0.55, 71), "#3D3A36", 0.6) + ln([tx, ty - 14], P(1.25, -0.5, 67), "#3D3A36", 0.6) + ln([tx, ty - 3], [tx, ty - 14], WOOD_DARK.right, 1.6) + box(1.18, -0.56, 1.32, -0.44, 58, 66, STONE) + logPile(-1.05, 1.05, 3, 1.2) + logPile(1.15, 0.95, 3, 1)
  );
}
__name(forestry, "forestry");
var swingingLog = /* @__PURE__ */ __name((f) => sprite((() => {
  const [hx, hy] = P(-0.1, 0.55, 70);
  const a = [-6, -2, 2, 6, 2, -2][f];
  return `<g transform="rotate(${a} ${f2(hx)} ${f2(hy)})">` + ln([hx, hy], [hx, hy + 30], "#3D3A36", 0.8) + ln([hx, hy + 30], [hx - 10, hy + 36], "#3D3A36", 0.7) + ln([hx, hy + 30], [hx + 10, hy + 32], "#3D3A36", 0.7) + `<path d="M${f2(hx - 16)},${f2(hy + 38)} L${f2(hx + 14)},${f2(hy + 32)} L${f2(hx + 15)},${f2(hy + 38)} L${f2(hx - 15)},${f2(hy + 44)} Z" fill="${LOG.left}" stroke="#3C2819" stroke-width="0.6"/><ellipse cx="${f2(hx + 14.5)}" cy="${f2(hy + 35)}" rx="2.2" ry="3.2" fill="${LOG.right}" stroke="#C9935E" stroke-width="0.5"/></g>`;
})(), { x: -50, y: -100, w: 70, h: 70 }), "swingingLog");
var MAGIC = { light: "#D6C6FF", mid: "#A98ADB", dark: "#6E57A8" };
function enchanted(skin2) {
  const colors = FOLIAGE[skin2] || MAGIC;
  const [x, y] = P(0.05, -0.25, 0);
  const X = /* @__PURE__ */ __name((dx) => f2(x + dx), "X"), Y = /* @__PURE__ */ __name((dy) => f2(y + dy), "Y");
  const mush = /* @__PURE__ */ __name((u, v, s, cap) => {
    const [mx, my] = P(u, v, 0);
    const M = /* @__PURE__ */ __name((dx, dy) => `${f2(mx + dx * s)},${f2(my + dy * s)}`, "M");
    return `<ellipse cx="${f2(mx)}" cy="${f2(my)}" rx="${f2(5 * s)}" ry="${f2(1.8 * s)}" fill="rgba(40,55,20,.25)"/><path d="M${M(-2.6, 0)} Q${M(-3.2, -5)} ${M(-2, -9)} L${M(2, -9)} Q${M(3.2, -5)} ${M(2.6, 0)} Q${M(0, 1)} ${M(-2.6, 0)} Z" fill="#FFF4E6" stroke="${OUT}" stroke-width="0.7"/><path d="M${M(0.8, -9)} L${M(2, -9)} Q${M(3.2, -5)} ${M(2.6, 0)} Q${M(1.6, 0.5)} ${M(0.9, 0.4)} Q${M(1.8, -5)} ${M(0.8, -9)} Z" fill="#E6D3BC"/><path d="M${M(-9.5, -8)} Q${M(-9, -19.5)} ${M(0, -20)} Q${M(9, -19.5)} ${M(9.5, -8)} Q${M(0, -5.4)} ${M(-9.5, -8)} Z" fill="${cap}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${M(2, -19.6)} Q${M(9, -19)} ${M(9.5, -8)} Q${M(5, -6.6)} ${M(1, -6.2)} Q${M(7, -10)} ${M(2, -19.6)} Z" fill="${mixHex(cap, "#2A1A30", 0.3)}"/><path d="M${M(-8.4, -8.2)} Q${M(0, -6)} ${M(8.4, -8.2)}" stroke="${mixHex(cap, "#2A1A30", 0.45)}" stroke-width="${f2(0.7 * s)}" fill="none"/>` + [[-5, -13, 1.6], [1.5, -16.5, 1.3], [5, -11.5, 1.1], [-1.5, -10.5, 0.9]].map(([dx, dy, r]) => dot(mx + dx * s, my + dy * s, r * s, "#FFFFFF")).join("") + `<path d="M${M(-6.4, -12.6)} Q${M(-5, -17.4)} ${M(-1, -18.4)}" stroke="rgba(255,255,255,.6)" stroke-width="${f2(1 * s)}" fill="none" stroke-linecap="round"/>`;
  }, "mush");
  const win = /* @__PURE__ */ __name((dx, dy) => `<circle cx="${X(dx)}" cy="${Y(dy)}" r="5.4" fill="#C9A16A" stroke="${OUT}" stroke-width="0.8"/><circle cx="${X(dx)}" cy="${Y(dy)}" r="3.8" fill="#FFE6A3"/><path d="M${X(dx - 3.8)},${Y(dy)} H${X(dx + 3.8)} M${X(dx)},${Y(dy - 3.8)} V${Y(dy + 3.8)}" stroke="#8B5631" stroke-width="0.8"/><path d="M${X(dx - 2.6)},${Y(dy - 1.6)} q1,-1.4 2.4,-1.6" stroke="#FFFFFF" stroke-width="0.8" fill="none" stroke-linecap="round" opacity=".8"/><rect x="${X(dx - 6)}" y="${Y(dy + 4.6)}" width="12" height="2" rx="0.8" fill="#A9703F" stroke="${OUT}" stroke-width="0.6"/>`, "win");
  const root = /* @__PURE__ */ __name((ax, ay, bx, by, w) => `<path d="M${X(ax)},${Y(ay - w)} Q${X((ax + bx) / 2)},${Y(ay - w * 0.5 + (by - ay) * 0.3)} ${X(bx)},${Y(by)} Q${X((ax + bx) / 2)},${Y(by + 1.4)} ${X(ax)},${Y(ay + w * 0.4)} Z" fill="#7A4A2A" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${X(ax + (bx - ax) * 0.15)},${Y(ay - w * 0.7)} Q${X((ax + bx) / 2)},${Y(ay - w * 0.3 + (by - ay) * 0.3)} ${X(ax + (bx - ax) * 0.8)},${Y(by - (by - ay) * 0.25)}" stroke="#A9703F" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/>`, "root");
  const trunk = `M${X(-32)},${Y(5)} Q${X(-23)},${Y(2)} ${X(-21)},${Y(-20)} L${X(-15)},${Y(-62)} Q${X(-20)},${Y(-74)} ${X(-34)},${Y(-80)} L${X(-30)},${Y(-86)} Q${X(-16)},${Y(-80)} ${X(-6)},${Y(-74)} L${X(6)},${Y(-74)} Q${X(18)},${Y(-82)} ${X(32)},${Y(-88)} L${X(35)},${Y(-82)} Q${X(22)},${Y(-74)} ${X(15)},${Y(-62)} L${X(21)},${Y(-20)} Q${X(23)},${Y(3)} ${X(33)},${Y(7)} Q${X(18)},${Y(10)} ${X(0)},${Y(8)} Q${X(-18)},${Y(9)} ${X(-32)},${Y(5)} Z`;
  const id = "enc" + (skin2 || "base").replace(/[^a-z]/g, "");
  const back = colors === MAGIC ? { light: MAGIC.mid, mid: mixHex(MAGIC.mid, MAGIC.dark, 0.5), dark: mixHex(MAGIC.dark, "#2A1E4A", 0.3) } : backLeaves(colors);
  return big(
    bigShadow(90, 42) + pine(-1.15, -1, 1.5, skin2) + oak(1.05, -1, 1.4, skin2) + root(-22, -2, -48, 8, 6) + root(22, 0, 49, 10, 6) + `<path d="${trunk}" fill="#8B5631" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${X(3)},${Y(8)} L${X(6)},${Y(-74)} Q${X(18)},${Y(-82)} ${X(32)},${Y(-88)} L${X(35)},${Y(-82)} Q${X(22)},${Y(-74)} ${X(15)},${Y(-62)} L${X(21)},${Y(-20)} Q${X(23)},${Y(3)} ${X(33)},${Y(7)} Q${X(18)},${Y(10)} ${X(3)},${Y(8)} Z" fill="#6A3F22"/><path d="M${X(-18.6)},${Y(-24)} L${X(-13.4)},${Y(-62)} M${X(-16.4)},${Y(-60)} Q${X(-19)},${Y(-70)} ${X(-30)},${Y(-78)}" stroke="#A9703F" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>` + [[-11, -26, -9, -58], [-4, -26, -3, -66], [8, -26, 9, -60]].map(([a, b, c, d]) => `<path d="M${X(a)},${Y(b)} Q${X((a + c) / 2 + (a < 0 ? -2 : 2))},${Y((b + d) / 2)} ${X(c)},${Y(d)}" stroke="rgba(40,20,10,.4)" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join("") + `<ellipse cx="${X(-6)}" cy="${Y(-55)}" rx="2.6" ry="1.8" fill="#5A341C" stroke="${OUT}" stroke-width="0.6"/>` + root(-17, 4, -32, 13, 5) + root(16, 5, 31, 14, 5) + `<ellipse cx="${X(0)}" cy="${Y(3)}" rx="10" ry="3" fill="${STONE.left}" stroke="${OUT}" stroke-width="0.7"/><path d="M${X(-9.6)},${Y(1)} L${X(-9.6)},${Y(-14)} A9.6,9.6 0 0 1 ${X(9.6)},${Y(-14)} L${X(9.6)},${Y(1)} Z" fill="#C9A16A" stroke="${OUT}" stroke-width="0.8"/><path d="M${X(-7.4)},${Y(1)} L${X(-7.4)},${Y(-14)} A7.4,7.4 0 0 1 ${X(7.4)},${Y(-14)} L${X(7.4)},${Y(1)} Z" fill="#7A4A2A"/><path d="M${X(-3.7)},${Y(1)} V${Y(-20.4)} M${X(0)},${Y(1)} V${Y(-21.4)} M${X(3.7)},${Y(1)} V${Y(-20.4)} M${X(-7.4)},${Y(-8)} H${X(7.4)}" stroke="#4E2E18" stroke-width="0.7"/>` + dot(x + 4.8, y - 7, 1.1, GOLD.left) + `<path d="M${X(12)},${Y(-24)} h4 v3" stroke="${OUT}" stroke-width="0.8" fill="none"/><rect x="${X(14)}" y="${Y(-21)}" width="4" height="5.4" rx="1" fill="#FFE6A3" stroke="${OUT}" stroke-width="0.7"/><path d="M${X(13.4)},${Y(-21)} h5.2 l-1,-1.4 h-3.2 Z" fill="#3E3A3A"/>` + win(-12, -38) + win(11, -46) + touffe(id + "f", x, y, 1, [[-22, -100, 22], [22, -102, 23], [0, -122, 20], [-46, -90, 15], [47, -92, 15], [0, -96, 22]], back) + touffe(id + "s", x, y, 1, [[0, -114, 14], [-12, -106, 11], [12, -108, 11]], colors) + touffe(id + "c", x, y, 1, [[0, -88, 13], [-8, -80, 9, 0], [8, -80, 9, 0]], colors) + touffe(id + "g", x, y, 1, [[-34, -76, 18], [-50, -84, 12], [-20, -86, 14], [-26, -64, 11, 0], [-42, -68, 10, 0]], colors) + touffe(id + "d", x, y, 1, [[34, -78, 18], [51, -86, 12], [21, -88, 14], [28, -66, 11, 0], [44, -70, 10, 0]], colors) + `<path d="M${X(-30)},${Y(-70)} Q${X(-15)},${Y(-60)} ${X(0)},${Y(-66)} Q${X(15)},${Y(-60)} ${X(30)},${Y(-72)}" stroke="#5A3A22" stroke-width="0.5" fill="none" opacity=".8"/>` + [[-24, -66], [-12, -63.4], [0, -66], [12, -63.6], [24, -68]].map(([dx, dy]) => `<circle cx="${X(dx)}" cy="${Y(dy + 1.6)}" r="1.8" fill="#FFF2B0" stroke="#C99A3A" stroke-width="0.5"/>`).join("") + mush(-0.8, 0.6, 1.3, "#E2574C") + mush(-0.45, 0.95, 0.9, "#E2574C") + mush(0.75, 0.55, 1.1, "#A98ADB") + mush(1.1, 0.25, 0.8, "#E2574C")
  );
}
__name(enchanted, "enchanted");
var fairyDust = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(0.05, -0.25, 0);
  let out = "";
  for (let k = 0; k < 10; k++) {
    const t = (f / 6 + k / 10) % 1;
    const a = t * Math.PI * 4 + k;
    out += dot(x + Math.cos(a) * (30 + k * 2) * (1 - t * 0.3), y - 20 - t * 110, 1.4 * (1 - t) + 0.4, k % 3 ? "#FFF2B0" : "#D6C6FF");
  }
  return out;
})(), { x: -80, y: -170, w: 160, h: 170 }), "fairyDust");
var BOSQUET_TIERS = [
  { make: clearing, sway: 0.015, smoke: [[-0.04, -0.2, 44]], lights: [[0.42, -0.04, 12, 12]] },
  { make: oakwood, sway: 0.012, smoke: [[-0.27, -0.12, 52]], lights: [[0.45, 0.12, 14, 13]] },
  { make: sawmill, anims: [{ key: "saw", n: 6, fps: 12, frame: sawBlade }] },
  { make: forestry, anims: [{ key: "saw", n: 6, fps: 12, frame: sawBlade }, { key: "log", n: 6, fps: 3, frame: swingingLog, tint: true }] },
  { make: enchanted, lights: [[0.05, -0.25, 12, 22], [-0.07, -0.25, 40, 14], [0.17, -0.25, 48, 14], [-0.8, 0.6, 10, 14], [0.75, 0.55, 10, 14]], anims: [{ key: "dust", n: 6, fps: 5, frame: fairyDust }] }
];

// atelier/port/src/world/tiers/puits.js
var stoneOf = /* @__PURE__ */ __name((skin2) => skin2 === "pierre-blanche" ? WHITE_STONE : STONE, "stoneOf");
var WATER = "#5AAED7";
var KIOSK = ["toit-bleu", "toit-chaume"];
var MARBLE = { top: "#FFFFFF", left: "#F1EEF6", right: "#CFCADB" };
function kiosk(skin2, r, z, h = 28) {
  const thatch = skin2 === "toit-chaume";
  const c = thatch ? { light: "#F3D27E", dark: "#C4943F", edge: "#A97B32" } : { light: "#86B6E6", dark: "#3F6FA3", edge: "#2E5585" };
  const [, cy] = P(0, 0, z);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const apex = cy - h;
  const ty = cy - ry * ry / h;
  const tx = rx * Math.sqrt(Math.max(0, 1 - ((cy - ty) / ry) ** 2));
  let tex = "";
  if (thatch) for (let a = 0.12; a < Math.PI - 0.1; a += 0.08) tex += ln([rx * Math.cos(a) * 0.18, apex + (cy + ry * Math.sin(a) - apex) * 0.18], [rx * Math.cos(a) * 0.97, apex + (cy + ry * Math.sin(a) - apex) * 0.97], "rgba(140,95,35,.45)", 0.6);
  else [0.4, 0.6, 0.8].forEach((k) => {
    tex += `<path d="M${f2(-rx * k)},${f2(apex + h * k)} A${f2(rx * k)},${f2(ry * k)} 0 0 0 ${f2(rx * k)},${f2(apex + h * k)}" fill="none" stroke="rgba(20,40,70,.4)" stroke-width="0.8"/>`;
  });
  const posts = /* @__PURE__ */ __name((front) => [[r * 0.9, 0], [0, r * 0.9], [-r * 0.9, 0], [0, -r * 0.9]].filter(([u, v]) => u + v > 0 === front).map(([u, v]) => box(u - 0.04, v - 0.04, u + 0.04, v + 0.04, 0, z, WOOD_DARK)).join(""), "posts");
  return {
    back: posts(false),
    front: posts(true) + `<defs><linearGradient id="kz-${skin2}" x1="0" x2="1"><stop offset="0" stop-color="${c.light}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient></defs><path d="M0,${f2(apex)} L${f2(tx)},${f2(ty)} A${f2(rx)},${f2(ry)} 0 1 1 ${f2(-tx)},${f2(ty)} Z" fill="url(#kz-${skin2})" stroke="${OUT}" stroke-width="0.8"/>` + tex + `<path d="M${f2(-rx)},${f2(cy)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(rx)},${f2(cy)}" fill="none" stroke="${c.edge}" stroke-width="2.2"/>` + ln([0, apex], [0, apex - 7], "#7A5A3A", 1.4) + dot(0, apex - 8, 2, GOLD.left)
  };
}
__name(kiosk, "kiosk");
function basin(r, h, stone2, white) {
  return stoneRing(0, 0, 0, h, r, stone2, `bs-${Math.round(r * 100)}`) + pool(0, 0, h, r * 0.86, WATER);
}
__name(basin, "basin");
function washhouse(skin2) {
  const stone2 = stoneOf(skin2);
  const roof = roofOf(skin2, ROOF_RED);
  const u0 = -0.62, u1 = 0.52, v0 = -0.47, v1 = 0.37;
  const posts = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]];
  return sprite(
    `<ellipse cx="4" cy="${f2(P(0, 0, 0)[1] + 4)}" rx="56" ry="26" fill="rgba(40,55,20,.14)"/>` + posts.slice(0, 2).map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 32, WOOD_DARK)).join("") + box(-0.55, -0.4, 0.45, 0.3, 0, 8, stone2) + (skin2 === "pierre-blanche" ? courseLeft(-0.55, 0.45, 0.3, 0, 8, 2) : "") + face([[-0.49, -0.34, 7.6], [0.39, -0.34, 7.6], [0.39, 0.24, 7.6], [-0.49, 0.24, 7.6]], WATER) + ln(P(-0.3, -0.1, 7.6), P(0.1, -0.1, 7.6), "rgba(255,255,255,.6)", 0.8) + ln(P(-0.1, 0.08, 7.6), P(0.25, 0.08, 7.6), "rgba(255,255,255,.5)", 0.8) + [-0.4, -0.12, 0.16].map((u) => face([[u, 0.24, 8], [u + 0.2, 0.24, 8], [u + 0.2, 0.32, 11], [u, 0.32, 11]], stone2.top, ` stroke="${OUT}" stroke-width="0.6"`)).join("") + posts.slice(2).map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 32, WOOD_DARK)).join("") + box(u0 - 0.03, v0 - 0.03, u1 + 0.03, v1 + 0.03, 30, 32, WOOD) + gable(u0, v0, u1, v1, 32, 16, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.08) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 32, 16, 0.08) + box(-0.93, -0.63, -0.89, -0.59, 0, 24, WOOD_DARK) + box(-0.93, 0.17, -0.89, 0.21, 0, 24, WOOD_DARK) + ln(P(-0.91, -0.61, 23), P(-0.91, 0.19, 23), "#C9A16A", 0.6),
    BUILDING_BOX
  );
}
__name(washhouse, "washhouse");
var laundry = /* @__PURE__ */ __name((f) => sprite((() => {
  const w = [0, 1, 0, -1][f];
  return [[-0.48, "#FFFFFF", 7], [-0.24, "#9FC7E8", 6], [0, "#F7A8C8", 8]].map(([dv, c, h], k) => {
    const a = P(-0.91, dv - 0.07, 23);
    const b = P(-0.91, dv + 0.07, 23);
    const sw = w * (k % 2 ? -1 : 1) * 1.2;
    return `<path d="M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])} L${f2(b[0] + sw)},${f2(b[1] + h)} Q${f2((a[0] + b[0]) / 2 + sw)},${f2((a[1] + b[1]) / 2 + h + 1.5)} ${f2(a[0] + sw)},${f2(a[1] + h)} Z" fill="${c}" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/>`;
  }).join("");
})(), { x: -50, y: -60, w: 50, h: 50 }), "laundry");
function bigBasin(skin2) {
  const stone2 = stoneOf(skin2);
  const white = skin2 === "pierre-blanche";
  const k = KIOSK.includes(skin2) ? kiosk(skin2, 1.4, 72, 30) : null;
  return big(
    bigShadow(80, 38) + flowerBed(-1.15, -1.1, 0.2) + flowerBed(1.1, 1.1, 0.18, ["#FFD45E", "#FFFFFF", "#A98ADB"]) + (k ? k.back : "") + basin(1, 11, stone2, white) + cylinder(0, 0, 11, 34, 0.1, PLASTER, "bb-col") + stoneRing(0, 0, 30, 35, 0.42, stone2, "bb-v1", 0) + pool(0, 0, 35, 0.35, WATER) + cylinder(0, 0, 35, 50, 0.06, PLASTER, "bb-col2") + stoneRing(0, 0, 48, 52, 0.22, stone2, "bb-v2", 0) + pool(0, 0, 52, 0.17, WATER) + cylinder(0, 0, 52, 60, 0.035, PLASTER, "bb-tip") + (k ? k.front : "")
  );
}
__name(bigBasin, "bigBasin");
var basinJets = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(0, 0, 60);
  let out = `<path d="M${f2(x - 1.2)},${f2(y)} L${f2(x)},${f2(y - 9 - f)} L${f2(x + 1.2)},${f2(y)} Z" fill="#DFF4FF"/>`;
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * Math.PI * 2 + f * 0.3;
    const r = 7 + f * 3;
    out += dot(x + Math.cos(a) * r, y - 2 + f * 3 + Math.sin(a) * r * 0.45, 1.3, "#BFE6FA");
    out += dot(x + Math.cos(a + 0.4) * (14 + f * 2), y + 14 + f * 3 + Math.sin(a + 0.4) * 7, 1.1, "#BFE6FA");
  }
  return out;
})(), { x: -40, y: -90, w: 80, h: 70 }), "basinJets");
function aqueduct(skin2) {
  const stone2 = stoneOf(skin2);
  const white = skin2 === "pierre-blanche";
  const k = KIOSK.includes(skin2) ? kiosk(skin2, 1.15, 62, 26) : null;
  const v0 = -1.32, v1 = -1.06, h = 58;
  let arcade = box(-1.45, v0, 1.42, v1, 0, h, stone2) + courseRight(1.42, v0, v1, 0, h, 7);
  [-1, -0.05, 0.9].forEach((u) => {
    arcade += archLeft(u, 0.32, v1, 0, 42, "#BFD8A8", ` stroke="${OUT}" stroke-width="0.8"`);
  });
  arcade += courseLeft(-1.45, 1.42, v1, 44, h, 2) + box(-1.45, v0 - 0.02, 1.42, v1 + 0.02, h, h + 4, stone2) + face([[-1.4, v0 + 0.04, h + 4.2], [1.38, v0 + 0.04, h + 4.2], [1.38, v1 - 0.04, h + 4.2], [-1.4, v1 - 0.04, h + 4.2]], WATER);
  return big(
    bigShadow(86, 40) + arcade + box(0.3, v1, 0.42, -0.62, h - 2, h + 2, stone2) + face([[0.32, v1, h + 2.2], [0.4, v1, h + 2.2], [0.4, -0.62, h + 2.2], [0.32, -0.62, h + 2.2]], WATER) + (k ? k.back : "") + basin(0.95, 11, stone2, white) + cylinder(0.36, -0.62, 11, h, 0.06, stone2, "aq-pile") + (k ? k.front : "")
  );
}
__name(aqueduct, "aqueduct");
var fall = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(0.36, -0.62, 58);
  const [, by] = P(0.36, -0.62, 11);
  let out = `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x - 4)},${f2((y + by) / 2)} ${f2(x - 2)},${f2(by)} L${f2(x + 2)},${f2(by)} Q${f2(x + 3.4)},${f2((y + by) / 2)} ${f2(x + 3)},${f2(y)} Z" fill="rgba(190,230,250,.85)"/>`;
  for (let k = 0; k < 4; k++) {
    const t = (f / 4 + k / 4) % 1;
    out += ln([x - 1.5 + k % 2 * 3, y + (by - y) * t], [x - 1.5 + k % 2 * 3, y + (by - y) * t + 5], "#FFFFFF", 0.8);
  }
  return out + ell(x, by + 1, 6 + f, 2 + f * 0.4, "none", ' stroke="rgba(255,255,255,.75)" stroke-width="0.8"');
})(), { x: -20, y: -120, w: 60, h: 110 }), "fall");
var WHEEL = { u: 0.32, v: -0.78, z: 24, r: 0.5 };
function watermill(skin2) {
  const stone2 = stoneOf(skin2);
  const roof = roofOf(skin2, ROOF_RED);
  const u0 = -1.35, u1 = 0.18, v0 = -1.35, v1 = -0.25;
  return big(
    bigShadow(86, 40) + box(0.24, -1.45, 0.62, -1.15, 0, 50, stone2) + face([[0.28, -1.45, 50.2], [0.58, -1.45, 50.2], [0.58, -1.15, 50.2], [0.28, -1.15, 50.2]], WATER) + box(u0, v0, u1, v1, 0, 28, stone2) + courseLeft(u0, u1, v1, 0, 28, 4) + courseRight(u1, v0, v1, 0, 28, 4) + box(u0, v0, u1, v1, 28, 50, PLASTER) + timberLeft(u0, u1, v1, 28, 50) + archLeft(-0.6, 0.16, v1, 0, 20, "#4A2E1A", ` stroke="${OUT}" stroke-width="0.7"`) + [-1.15, -0.2].map((u) => face([[u, v1, 34], [u + 0.18, v1, 34], [u + 0.18, v1, 44], [u, v1, 44]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"')).join("") + chimney(-1.05, -1.05, 52, 82) + gable(u0, v0, u1, v1, 50, 26, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.1) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 50, 26, 0.1) + face([[0.22, -0.55, 0.3], [0.62, -0.55, 0.3], [0.62, 0.2, 0.3], [0.22, 0.2, 0.3]], WATER) + basin(0.7, 8, stone2, skin2 === "pierre-blanche")
  );
}
__name(watermill, "watermill");
var millWheel = /* @__PURE__ */ __name((f) => sprite((() => {
  const { u, v, z, r } = WHEEL;
  const pt = /* @__PURE__ */ __name((a, rr) => P(u, v + rr * Math.cos(a), z + 32 * rr * Math.sin(a)), "pt");
  const turn = f / 8 * (Math.PI / 4);
  let out = "";
  const rim = Array.from({ length: 24 }, (_, k) => pt(k / 24 * Math.PI * 2, r));
  out += `<polygon points="${rim.map((p) => p.map(f2).join(",")).join(" ")}" fill="none" stroke="${WOOD_DARK.right}" stroke-width="2.4"/>`;
  const rim2 = Array.from({ length: 24 }, (_, k) => pt(k / 24 * Math.PI * 2, r * 0.82));
  out += `<polygon points="${rim2.map((p) => p.map(f2).join(",")).join(" ")}" fill="none" stroke="${WOOD_DARK.left}" stroke-width="1.2"/>`;
  for (let k = 0; k < 8; k++) {
    const a = turn + k / 8 * Math.PI * 2;
    out += ln(pt(a, 0), pt(a, r * 0.82), WOOD_DARK.left, 1.2);
    const [p0, p1] = [pt(a, r * 0.82), pt(a, r * 1.08)];
    out += ln(p0, p1, WOOD.top, 3);
  }
  const [cx, cy] = P(u, v, z);
  return out + dot(cx, cy, 2.4, "#3D3A36") + `<path d="M${f2(pt(1.9, r)[0])},${f2(pt(1.9, r)[1])} q2,6 0,12" stroke="rgba(190,230,250,.85)" stroke-width="2.4" fill="none"/>`;
})(), { x: -20, y: -90, w: 80, h: 90 }), "millWheel");
function youth(skin2) {
  const k = KIOSK.includes(skin2) ? kiosk(skin2, 1.4, 86, 30) : null;
  const [sx, sy] = P(0, 0, 40);
  return big(
    bigShadow(84, 40) + flowerBed(-1.15, -1.05, 0.22) + flowerBed(1.1, -1.05, 0.2, ["#FFD45E", "#FFFFFF", "#A98ADB"]) + flowerBed(-1.2, 0.3, 0.16, ["#F7A8C8", "#FFFFFF"]) + (skin2 === "pierre-blanche" ? cylinder(0, 0, 0, 4, 1.32, WHITE_STONE, "yj-parvis") + stoneCourses(0, 0, 0, 4, 1.32, 1, "rgba(150,140,170,.4)") + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i + 0.5) * Math.PI / 4;
      return ln(P(Math.cos(a) * 1.04, Math.sin(a) * 1.04, 4), P(Math.cos(a) * 1.3, Math.sin(a) * 1.3, 4), "rgba(150,140,170,.45)", 0.7);
    }).join("") : "") + (k ? k.back : "") + cylinder(0, 0, 0, 12, 1.02, MARBLE, "yj-basin") + stoneCourses(0, 0, 0, 12, 1.02, 1, "rgba(150,140,170,.35)") + `<path d="M${f2(-46.2)},${f2(P(0, 0, 12)[1])} A46.2,23.1 0 0 0 46.2,${f2(P(0, 0, 12)[1])}" fill="none" stroke="${GOLD.left}" stroke-width="2"/>` + pool(0, 0, 12, 0.88, "#5FD3D0", "#A8F0EA") + cylinder(0, 0, 12, 30, 0.16, MARBLE, "yj-ped") + cylinder(0, 0, 30, 33, 0.22, MARBLE, "yj-ped2") + `<path d="M${f2(sx - 4)},${f2(sy + 7)} L${f2(sx - 3)},${f2(sy - 12)} Q${f2(sx)},${f2(sy - 16)} ${f2(sx + 3)},${f2(sy - 12)} L${f2(sx + 4)},${f2(sy + 7)} Z" fill="${MARBLE.left}" stroke="${MARBLE.right}" stroke-width="0.6"/>` + dot(sx, sy - 19, 3.4, MARBLE.top) + `<path d="M${f2(sx - 3)},${f2(sy - 21)} q3,-3 6,0" stroke="${GOLD.left}" stroke-width="1" fill="none"/><path d="M${f2(sx - 3)},${f2(sy - 10)} Q${f2(sx - 16)},${f2(sy - 26)} ${f2(sx - 14)},${f2(sy - 6)} Q${f2(sx - 9)},${f2(sy - 10)} ${f2(sx - 3)},${f2(sy - 4)} Z" fill="#FFFFFF" stroke="${MARBLE.right}" stroke-width="0.6"/><path d="M${f2(sx + 3)},${f2(sy - 10)} Q${f2(sx + 16)},${f2(sy - 26)} ${f2(sx + 14)},${f2(sy - 6)} Q${f2(sx + 9)},${f2(sy - 10)} ${f2(sx + 3)},${f2(sy - 4)} Z" fill="#F4F0FA" stroke="${MARBLE.right}" stroke-width="0.6"/><ellipse cx="${f2(sx + 6)}" cy="${f2(sy - 8)}" rx="3.2" ry="2.4" fill="${GOLD.left}" transform="rotate(30 ${f2(sx + 6)} ${f2(sy - 8)})"/>` + (k ? k.front : "")
  );
}
__name(youth, "youth");
var youthMagic = /* @__PURE__ */ __name((f) => sprite((() => {
  const [sx, sy] = P(0, 0, 40);
  const [, wy] = P(0, 0, 12);
  let out = `<path d="M${f2(sx + 8)},${f2(sy - 7)} Q${f2(sx + 18)},${f2(sy)} ${f2(sx + 16)},${f2(wy)}" stroke="rgba(170,240,234,.9)" stroke-width="2.4" fill="none"/>`;
  out += ell(sx + 16, wy + 1, 5 + f % 3, 2 + f % 3 * 0.4, "none", ' stroke="rgba(255,255,255,.8)" stroke-width="0.8"');
  ["#E2574C", "#F2994A", "#F2C04B", "#6DB04F", "#5C83C2", "#A98ADB"].forEach((c, k) => {
    out += `<path d="M${f2(-62 + k * 2)},${f2(wy - 4)} A${f2(62 - k * 2)},${f2(56 - k * 2)} 0 0 1 ${f2(62 - k * 2)},${f2(wy - 4)}" fill="none" stroke="${c}" stroke-width="2" opacity="${f2(0.18 + 0.06 * Math.sin(f + k))}"/>`;
  });
  for (let k = 0; k < 8; k++) {
    const t = (f / 6 + k / 8) % 1;
    out += dot(Math.cos(k * 2.3) * 38 * (0.4 + t * 0.6), wy - 6 - t * 50, 1.4 * (1 - t) + 0.3, k % 2 ? "#FFF2B0" : "#FFFFFF");
  }
  return out;
})(), { x: -70, y: -140, w: 140, h: 130 }), "youthMagic");
var PUITS_TIERS = [
  { make: washhouse, anims: [{ key: "laundry", n: 4, fps: 3, frame: laundry }] },
  { make: bigBasin, anims: [{ key: "jets", n: 4, fps: 6, frame: basinJets, skip: /* @__PURE__ */ __name((skin2) => KIOSK.includes(skin2), "skip") }] },
  { make: aqueduct, anims: [{ key: "fall", n: 4, fps: 8, frame: fall }] },
  { make: watermill, anims: [{ key: "wheel", n: 8, fps: 8, frame: millWheel, tint: true }], smoke: [[-1.05, -1.05, 84]], lights: [[-1.06, -0.25, 39, 14], [-0.11, -0.25, 39, 14]] },
  { make: youth, anims: [{ key: "magic", n: 6, fps: 6, frame: youthMagic }], lights: [[0, 0, 14, 40], [0, 0, 40, 18]] }
];

// atelier/port/src/world/tiers/potager.js
var FRUIT = { light: "#B3E386", mid: "#7EC45B", dark: "#4F8F3A" };
var BARN = { top: "#E08A70", left: "#C85F46", right: "#A04634" };
var WHEAT = "#E9C55A";
function appleTree(u, v, s) {
  const [x, y] = P(u, v, 0);
  return roundTree(u, v, s, FRUIT) + [[-6, -26], [5, -30], [-2, -38], [8, -22], [-9, -33], [3, -42]].map(([dx, dy]) => dot(x + dx * s, y + dy * s, 1.6 * s, "#E2463A") + dot(x + dx * s - 0.5, y + dy * s - 0.6, 0.5 * s, "#FFB0A0")).join("");
}
__name(appleTree, "appleTree");
function bed(u0, v0, u1, v1, kind = "veg", rows = 3) {
  let out = soilBed(u0, v0, u1, v1, 3);
  const dv = (v1 - v0) / rows;
  for (let r = 0; r < rows; r++) {
    const v = v0 + dv * (r + 0.5);
    out += furrow(u0 + 0.04, u1 - 0.04, v, dv * 0.18, 3.1);
    for (let u = u0 + 0.1; u < u1 - 0.05; u += 0.16) {
      const [x, y] = P(u, v, 3);
      if (kind === "wheat") out += [-2, 0, 2].map((dx) => ln([x + dx, y], [x + dx * 1.4, y - 9], "#D9AE45", 0.9) + ell(x + dx * 1.5, y - 10, 1, 2.2, WHEAT)).join("");
      else if (kind === "flowers") out += ln([x, y], [x, y - 3], "#6DB04F", 0.8) + `<circle cx="${f2(x)}" cy="${f2(y - 4)}" r="2.2" fill="${["#F7A8C8", "#FFD45E", "#A98ADB", "#FFFFFF"][(Math.round((u + v) * 13) % 4 + 4) % 4]}" stroke="${OUT}" stroke-width="0.5"/>` + dot(x, y - 4, 0.7, "#FFE07A");
      else out += leafPair(x, y, 3.2, 1.9, 2.6, "#86CB5E", "#6DB04F") + `<circle cx="${f2(x)}" cy="${f2(y - 4.6)}" r="1.8" fill="${Math.round(u * 10) % 2 ? "#E2463A" : "#F08A3A"}" stroke="${OUT}" stroke-width="0.5"/>`;
    }
  }
  return out;
}
__name(bed, "bed");
function hayBale(u, v) {
  return box(u - 0.12, v - 0.09, u + 0.12, v + 0.09, 0, 9, { top: "#F3DE97", left: "#E2C66E", right: "#F1D88A" }) + ell(...P(u + 0.12, v, 4.5), 2.4, 3.6, "none", ' stroke="#C4A24E" stroke-width="0.6"');
}
__name(hayBale, "hayBale");
function barn(u0, v0, u1, v1, h, skin2) {
  const roof = roofOf(skin2, { front: "#7C7F89", back: "#5E616B" });
  const vm = (v0 + v1) / 2;
  const q = (v1 - v0) * 0.28;
  const brk = h + 12;
  return box(u0, v0, u1, v1, 0, h, BARN) + face([[u1, v0, h], [u1, v0 + q * 0.4, brk], [u1, vm, brk + 12], [u1, v1 - q * 0.4, brk], [u1, v1, h]], BARN.right, ` stroke="${OUT}" stroke-width="0.7"`) + face([[u1, vm - 0.18, 0], [u1, vm + 0.18, 0], [u1, vm + 0.18, h - 3], [u1, vm - 0.18, h - 3]], "#7E3324", ' stroke="#FFFFFF" stroke-width="1.2"') + ln(P(u1, vm - 0.18, 0), P(u1, vm + 0.18, h - 3), "#FFFFFF", 1) + ln(P(u1, vm + 0.18, 0), P(u1, vm - 0.18, h - 3), "#FFFFFF", 1) + face([[u1, vm - 0.07, h + 6], [u1, vm + 0.07, h + 6], [u1, vm + 0.07, h + 12], [u1, vm - 0.07, h + 12]], "#3A2A1E", ' stroke="#FFFFFF" stroke-width="0.8"') + [0.25, 0.5, 0.75].map((k) => ln(P(u0 + (u1 - u0) * k, v1, 1), P(u0 + (u1 - u0) * k, v1, h - 1), "rgba(255,255,255,.55)", 0.9)).join("") + face([[u0 - 0.05, v0 - 0.05, h], [u1 + 0.05, v0 - 0.05, h], [u1 + 0.05, v0 + q * 0.4, brk], [u0 - 0.05, v0 + q * 0.4, brk]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`) + face([[u0 - 0.05, v0 + q * 0.4, brk], [u1 + 0.05, v0 + q * 0.4, brk], [u1 + 0.05, vm, brk + 12], [u0 - 0.05, vm, brk + 12]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`) + (HIVER ? snowPan(P(u0 - 0.05, vm, brk + 12), P(u1 + 0.05, vm, brk + 12), P(u1 + 0.05, v0 + q * 0.4, brk), P(u0 - 0.05, v0 + q * 0.4, brk), 0.95) : "") + face([[u0 - 0.05, vm, brk + 12], [u1 + 0.05, vm, brk + 12], [u1 + 0.05, v1 - q * 0.4, brk], [u0 - 0.05, v1 - q * 0.4, brk]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`) + (HIVER ? snowPan(P(u0 - 0.05, vm, brk + 12), P(u1 + 0.05, vm, brk + 12), P(u1 + 0.05, v1 - q * 0.4, brk), P(u0 - 0.05, v1 - q * 0.4, brk), 0.95) : "") + face([[u0 - 0.05, v1 - q * 0.4, brk], [u1 + 0.05, v1 - q * 0.4, brk], [u1 + 0.05, v1 + 0.05, h], [u0 - 0.05, v1 + 0.05, h]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`) + (HIVER ? snowPan(P(u0 - 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 + 0.05, h), P(u0 - 0.05, v1 + 0.05, h), 0.7, true) : "") + ln(P(u0 - 0.05, v1 - q * 0.4, brk), P(u1 + 0.05, v1 - q * 0.4, brk), "rgba(255,255,255,.25)", 0.8);
}
__name(barn, "barn");
function backFence(skin2, k = 1.5) {
  return `<g transform="scale(${k})">${gardenFence(skin2 || void 0)}</g>`;
}
__name(backFence, "backFence");
function orchard(skin2) {
  return sprite(
    shadow(0, 0, 1.15, 0.14) + (skin2 ? gardenFence(skin2) : "") + appleTree(-0.62, -0.58, 0.95) + appleTree(-0.18, -0.7, 0.85) + appleTree(0.15, -0.3, 0.8) + ln(P(-0.42, -0.42, 0), P(-0.55, -0.55, 30), WOOD.right, 1.2) + ln(P(-0.36, -0.46, 0), P(-0.49, -0.59, 30), WOOD.right, 1.2) + [6, 12, 18, 24].map((z) => ln(P(-0.42 - z / 230, -0.42 - z / 230, z), P(-0.36 - z / 230, -0.46 - z / 230, z), WOOD.right, 0.8)).join("") + box(-0.32, -0.22, -0.16, -0.08, 0, 6, { top: "#B98552", left: "#A06F3C", right: "#8B5631" }) + [[-0.27, -0.17], [-0.22, -0.13], [-0.24, -0.18]].map(([u, v]) => dot(...P(u, v, 7.5), 1.8, "#E2463A")).join("") + bed(-0.85, 0.05, 0.85, 0.85, "veg", 3),
    BUILDING_BOX
  );
}
__name(orchard, "orchard");
function farm(skin2) {
  return big(
    bigShadow(84, 40) + (skin2 ? backFence(skin2) : "") + barn(-1.35, -1.35, -0.25, -0.45, 26, skin2) + appleTree(0.2, -1.1, 1.05) + appleTree(0.65, -0.55, 0.9) + hayBale(0, -0.25) + hayBale(-0.1, -0.05) + hayBale(0.12, -0.05) + bed(-1.3, 0.05, 0.05, 1.35, "veg", 4) + bed(0.2, 0.05, 1.3, 1.35, "wheat", 4) + pavedPath([0.12, -0.3], [0.12, 1.45], 0.14)
  );
}
__name(farm, "farm");
var MILL = { u: -0.8, v: -0.8, h: 62 };
function windmill(skin2) {
  const roof = roofOf(skin2, { front: "#8E6A4A", back: "#6F5038" });
  const { u, v, h } = MILL;
  const [cx, cy] = P(u, v, h);
  return big(
    bigShadow(86, 40) + (skin2 ? backFence(skin2) : "") + `<defs><linearGradient id="wm-tower" x1="0" x2="1"><stop offset="0" stop-color="${STONE.top}"/><stop offset="1" stop-color="${STONE.right}"/></linearGradient></defs><path d="M${f2(P(u, v, 0)[0] - 20)},${f2(P(u, v, 0)[1])} L${f2(cx - 13)},${f2(cy)} L${f2(cx + 13)},${f2(cy)} L${f2(P(u, v, 0)[0] + 20)},${f2(P(u, v, 0)[1])} A20,10 0 0 1 ${f2(P(u, v, 0)[0] - 20)},${f2(P(u, v, 0)[1])} Z" fill="url(#wm-tower)" stroke="${OUT}" stroke-width="0.8"/>` + [14, 28, 42].map((z) => {
      const [x, y] = P(u, v, z);
      const w = 20 - z / h * 7;
      return `<path d="M${f2(x - w)},${f2(y)} A${f2(w)},${f2(w / 2)} 0 0 0 ${f2(x + w)},${f2(y)}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.7"/>`;
    }).join("") + `<path d="M${f2(P(u, v + 0.22, 0)[0] - 4)},${f2(P(u, v + 0.22, 0)[1] - 4)} v-12 a4,4 0 0 1 8,0 v12 Z" fill="#4A2E1A"/><rect x="${f2(P(u, v + 0.18, 34)[0] - 2.5)}" y="${f2(P(u, v + 0.18, 34)[1] - 3)}" width="5" height="6" rx="2" fill="#FFE6A3" stroke="#FFFFFF" stroke-width="0.6"/><path d="M${f2(cx - 16)},${f2(cy + 1)} Q${f2(cx)},${f2(cy - 22)} ${f2(cx + 16)},${f2(cy + 1)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.8"/><path d="M${f2(cx)},${f2(cy - 10)} Q${f2(cx + 8)},${f2(cy - 6)} ${f2(cx + 16)},${f2(cy + 1)} L${f2(cx)},${f2(cy + 1)} Z" fill="${roof.back}"/>` + (HIVER ? snowCap("wm-neige", `M${f2(cx - 16)},${f2(cy + 1)} Q${f2(cx)},${f2(cy - 22)} ${f2(cx + 16)},${f2(cy + 1)} Z`, cx, cy - 11, 15, 6) : "") + bed(-0.25, -1.3, 1.3, -0.15, "wheat", 4) + bed(-1.3, 0.1, 1.3, 1.35, "wheat", 5) + [[-0.35, -0.35], [-0.22, -0.3], [-0.3, -0.22]].map(([a, b], k) => `<path d="M${f2(P(a, b, 0)[0] - 4)},${f2(P(a, b, 0)[1])} q-1,-8 4,-9 q5,1 4,9 Z" fill="${k % 2 ? "#F7F1E1" : "#EFE6D0"}" stroke="rgba(120,100,70,.4)" stroke-width="0.6"/>`).join("")
  );
}
__name(windmill, "windmill");
var millSails = /* @__PURE__ */ __name((f) => sprite((() => {
  const { u, v, h } = MILL;
  const [hx, hy] = P(u + 0.05, v + 0.28, h - 4);
  const turn = f / 8 * (Math.PI / 2);
  let out = "";
  for (let k = 0; k < 4; k++) {
    const a = turn + k * Math.PI / 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const tip = [hx + ca * 34 * -0.85, hy + ca * 34 * 0.42 - sa * 34];
    const side = [-sa * 0.85 * 7, sa * 0.42 * 7 + ca * 7];
    const mid = [hx + ca * 8 * -0.85, hy + ca * 8 * 0.42 - sa * 8];
    out += `<polygon points="${[mid, tip, [tip[0] + side[0], tip[1] + side[1]], [mid[0] + side[0], mid[1] + side[1]]].map((p) => p.map(f2).join(",")).join(" ")}" fill="rgba(250,244,230,.92)" stroke="#8B5631" stroke-width="0.8"/>`;
    out += ln([hx, hy], tip, WOOD_DARK.right, 1.6);
    for (let t = 0.35; t < 1; t += 0.2) out += ln([hx + (tip[0] - hx) * t, hy + (tip[1] - hy) * t], [hx + (tip[0] - hx) * t + side[0], hy + (tip[1] - hy) * t + side[1]], "#B98552", 0.5);
  }
  return out + dot(hx, hy, 2.6, WOOD_DARK.right);
})(), { x: -110, y: -150, w: 110, h: 110 }), "millSails");
function estate(skin2) {
  const roof = roofOf(skin2, ROOF_RED);
  const u0 = -1.38, u1 = -0.45, v0 = -1.38, v1 = -0.55;
  const [sx, sy] = P(0.15, -1.15, 64);
  return big(
    bigShadow(88, 42) + (skin2 ? backFence(skin2) : "") + box(u0, v0, u1, v1, 0, 32, PLASTER) + shuttered(-1.25, -1.08, v1, 8, 18, "#5E9A62") + shuttered(-0.8, -0.63, v1, 8, 18, "#5E9A62") + shuttered(-1.05, -0.88, v1, 22, 30, "#5E9A62") + face([[-0.98, v1, 0], [-0.86, v1, 0], [-0.86, v1, 14], [-0.98, v1, 14]], "#8C4B32") + chimney(-1.2, -1.2, 36, 66) + gable(u0, v0, u1, v1, 32, 22, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.08) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 32, 22, 0.08) + cylinder(0.15, -1.15, 0, 64, 0.22, { top: "#D7DDE3", left: "#C2CAD2", right: "#8E99A4" }, "es-silo") + [12, 26, 40, 54].map((z) => {
      const [x, y] = P(0.15, -1.15, z);
      return `<path d="M${f2(x - 14)},${f2(y)} A14,7 0 0 0 ${f2(x + 14)},${f2(y)}" fill="none" stroke="#7C8894" stroke-width="0.7"/>`;
    }).join("") + `<path d="M${f2(sx - 14)},${f2(sy)} Q${f2(sx)},${f2(sy - 20)} ${f2(sx + 14)},${f2(sy)} Z" fill="#B13A31" stroke="${OUT}" stroke-width="0.8"/>` + (HIVER ? snowCap("es-neige", `M${f2(sx - 14)},${f2(sy)} Q${f2(sx)},${f2(sy - 20)} ${f2(sx + 14)},${f2(sy)} Z`, sx, sy - 10, 13, 5.5) : "") + barn(0.45, -1.35, 1.35, -0.55, 24, skin2) + bed(-1.3, 0.05, -0.05, 1.35, "veg", 4) + bed(0.15, 0.05, 1.3, 1.35, "wheat", 4) + hayBale(-0.2, -0.3) + hayBale(0.05, -0.3) + tractor(0.62, -0.22)
  );
}
__name(estate, "estate");
function tractor(u, v) {
  const [x, y] = P(u, v, 0);
  return ell(x + 2, y + 1, 16, 4, "rgba(40,55,20,.25)") + box(u - 0.16, v - 0.08, u + 0.14, v + 0.08, 6, 14, { top: "#F08A6E", left: "#E2463A", right: "#B13A31" }) + box(u - 0.16, v - 0.08, u - 0.02, v + 0.08, 14, 24, { top: "rgba(220,240,250,.7)", left: "rgba(190,220,235,.6)", right: "rgba(150,190,210,.6)" }, ' stroke="#B13A31" stroke-width="1"') + `<rect x="${f2(P(u + 0.1, v - 0.02, 16)[0] - 1)}" y="${f2(P(u + 0.1, v - 0.02, 16)[1] - 6)}" width="2" height="7" fill="#3D3A36"/><circle cx="${f2(P(u - 0.1, v + 0.09, 8)[0])}" cy="${f2(P(u - 0.1, v + 0.09, 8)[1])}" r="7.5" fill="#2A2724"/><circle cx="${f2(P(u - 0.1, v + 0.09, 8)[0])}" cy="${f2(P(u - 0.1, v + 0.09, 8)[1])}" r="3.4" fill="${GOLD.left}"/><circle cx="${f2(P(u + 0.1, v + 0.09, 4)[0])}" cy="${f2(P(u + 0.1, v + 0.09, 4)[1])}" r="4.2" fill="#2A2724"/><circle cx="${f2(P(u + 0.1, v + 0.09, 4)[0])}" cy="${f2(P(u + 0.1, v + 0.09, 4)[1])}" r="1.8" fill="${GOLD.left}"/>`;
}
__name(tractor, "tractor");
var UNICORN = [0.45, 0.45];
function unicornGarden(skin2) {
  const [ax, ay] = P(-0.35, 0.35, 0);
  const flower = /* @__PURE__ */ __name((u, v, s, c) => {
    const [x, y] = P(u, v, 0);
    return ln([x, y], [x + 2, y - 30 * s], "#5DAA45", 2 * s) + `<ellipse cx="${f2(x - 5 * s)}" cy="${f2(y - 12 * s)}" rx="${f2(5 * s)}" ry="${f2(2 * s)}" fill="#6DB04F" transform="rotate(-25 ${f2(x - 5 * s)} ${f2(y - 12 * s)})"/>` + [0, 1, 2, 3, 4, 5].map((k) => {
      const a = k / 6 * Math.PI * 2;
      return ell(x + 2 + Math.cos(a) * 6 * s, y - 32 * s + Math.sin(a) * 4 * s, 4.6 * s, 3 * s, c);
    }).join("") + dot(x + 2, y - 32 * s, 3.4 * s, "#FFE07A");
  }, "flower");
  return big(
    bigShadow(88, 42) + (skin2 ? backFence(skin2) : "") + bed(-1.3, -1.3, 1.3, -0.4, "flowers", 4) + appleTree(-1.05, -0.95, 1.2).replace(/#E2463A/g, GOLD.left) + flower(0.95, -0.75, 1.4, "#F7A8C8") + flower(1.15, -0.2, 1.1, "#A98ADB") + flower(-1.15, 0, 1.2, "#FFD45E") + ["#E2574C", "#F2994A", "#F2C04B", "#6DB04F", "#5C83C2", "#A98ADB"].map((c, k) => `<path d="M${f2(ax - 22 + k * 2)},${f2(ay)} A${f2(22 - k * 2)},${f2(30 - k * 2)} 0 0 1 ${f2(ax + 22 - k * 2)},${f2(ay)}" fill="none" stroke="${c}" stroke-width="2.2"/>`).join("") + pavedPath([-0.35, -0.3], [-0.35, 1.45], 0.24) + bed(0, 0.85, 1.3, 1.35, "flowers", 2) + flowerBed(-0.95, 0.85, 0.2, ["#F7A8C8", "#FFFFFF", "#A98ADB"])
  );
}
__name(unicornGarden, "unicornGarden");
var unicorn = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(...UNICORN, 0);
  const graze = f >= 2 && f <= 4 ? 1 : 0;
  const tail = [0, 1.5, 2.5, 1.5, 0, -1][f];
  const hx = x - 15 - graze * 2;
  const hy = y - 24 + graze * 9;
  return ell(x, y + 1, 16, 3.6, "rgba(40,55,20,.25)") + [[-9, 0], [-5, 0.8], [6, 0], [10, 0.8]].map(([dx, dy]) => ln([x + dx, y - 12], [x + dx, y + dy], "#F1EEF6", 2.4) + `<rect x="${f2(x + dx - 1.4)}" y="${f2(y + dy - 1)}" width="2.8" height="1.8" fill="${GOLD.left}"/>`).join("") + ["#E2574C", "#F2C04B", "#5C83C2", "#A98ADB"].map((c, k) => `<path d="M${f2(x + 13)},${f2(y - 17)} q${f2(7 + tail)},${f2(4 + k * 1.5)} ${f2(4 + tail)},${f2(13 + k)}" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join("") + ell(x, y - 16, 15, 7.5, "#FFFFFF", ' stroke="rgba(150,140,170,.5)" stroke-width="0.7"') + ell(x + 2, y - 12, 11, 2.6, "#EEEAF6") + `<path d="M${f2(x - 10)},${f2(y - 20)} L${f2(hx + 3)},${f2(hy - 1)} L${f2(hx + 5)},${f2(hy + 5)} L${f2(x - 8)},${f2(y - 12)} Z" fill="#FFFFFF"/>` + ["#E2574C", "#F2C04B", "#5C83C2", "#A98ADB"].map((c, k) => `<path d="M${f2(x - 10 + k * 1.2)},${f2(y - 22 + k * 0.6)} q${f2(-4)},${f2(-2)} ${f2(hx + 6 - x + 10 - k)},${f2(hy - y + 20 + k * 0.4)}" stroke="${c}" stroke-width="1.6" fill="none"/>`).join("") + `<ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="6" ry="4" fill="#FFFFFF" stroke="rgba(150,140,170,.5)" stroke-width="0.7" transform="rotate(${graze ? 35 : 15} ${f2(hx)} ${f2(hy)})"/><path d="M${f2(hx + 1)},${f2(hy - 3)} L${f2(hx - 2 - graze * 4)},${f2(hy - 13 + graze * 3)} L${f2(hx + 3)},${f2(hy - 4)} Z" fill="${GOLD.left}" stroke="${GOLD.right}" stroke-width="0.5"/>` + dot(hx - 1, hy - 1, 0.9, "#2A2420") + `<path d="M${f2(hx + 3)},${f2(hy - 4)} l2,-3 l1,3 Z" fill="#FFFFFF"/>`;
})(), { x: -50, y: -80, w: 90, h: 70 }), "unicorn");
var sparkles = /* @__PURE__ */ __name((f) => sprite((() => {
  let out = "";
  for (let k = 0; k < 9; k++) {
    const t = (f / 6 + k / 9) % 1;
    const [x, y] = P(-1.2 + k * 0.31 % 2.4, -1 + k * 0.53 % 2.2, 10 + t * 50);
    out += `<path d="M${f2(x)},${f2(y - 3)} L${f2(x + 0.8)},${f2(y)} L${f2(x)},${f2(y + 3)} L${f2(x - 0.8)},${f2(y)} Z" fill="${k % 2 ? "#FFF2B0" : "#FFFFFF"}" opacity="${f2(1 - t)}"/>`;
  }
  return out;
})(), { x: -110, y: -130, w: 220, h: 170 }), "sparkles");
var POTAGER_TIERS = [
  { make: orchard },
  { make: farm },
  { make: windmill, anims: [{ key: "sails", n: 8, fps: 6, frame: millSails, tint: true }] },
  { make: estate, smoke: [[-1.2, -1.2, 69]], lights: [[-1.16, -0.55, 13, 14], [-0.71, -0.55, 13, 14]] },
  { make: unicornGarden, anims: [{ key: "unicorn", n: 6, fps: 3, frame: unicorn }, { key: "sparkles", n: 6, fps: 5, frame: sparkles }], lights: [[-1.05, -0.95, 30, 22]] }
];

// atelier/port/src/world/tiers/atelier.js
var COPPER2 = { top: "#F4B07A", left: "#D9844E", right: "#A85C31" };
var MOLTEN = "#FF8A2E";
function molds(u, v) {
  let out = box(u - 0.14, v - 0.1, u + 0.14, v + 0.1, 0, 4, DARK_STONE);
  [-0.08, 0, 0.08].forEach((du, k) => {
    out += face([[u + du - 0.03, v - 0.07, 4.1], [u + du + 0.03, v - 0.07, 4.1], [u + du + 0.03, v + 0.07, 4.1], [u + du - 0.03, v + 0.07, 4.1]], k === 1 ? MOLTEN : GOLD.left);
  });
  return out;
}
__name(molds, "molds");
function furnace(u0, v0, u1, v1, h, chimneyH, k = 1) {
  const vm = (v0 + v1) / 2;
  return box(u0, v0, u1, v1, 0, h, BRICK) + courseLeft(u0, u1, v1, 0, h, Math.round(h / 6), "rgba(90,40,25,.3)") + courseRight(u1, v0, v1, 0, h, Math.round(h / 6), "rgba(70,30,20,.3)") + face([[u1, vm - 0.16 * k, 2], [u1, vm + 0.16 * k, 2], [u1, vm + 0.16 * k, h * 0.55], [u1, vm - 0.16 * k, h * 0.55]], "#3A1E14") + face([[u1, vm - 0.12 * k, 3], [u1, vm + 0.12 * k, 3], [u1, vm + 0.12 * k, h * 0.32], [u1, vm - 0.12 * k, h * 0.32]], MOLTEN) + pyramid(u0, v0, u1, v1, h, 10 * k, { back: BRICK.right, left: BRICK.left, right: BRICK.right }, 0.02) + box((u0 + u1) / 2 - 0.09 * k, vm - 0.09 * k, (u0 + u1) / 2 + 0.09 * k, vm + 0.09 * k, h + 6, h + chimneyH, BRICK) + box((u0 + u1) / 2 - 0.11 * k, vm - 0.11 * k, (u0 + u1) / 2 + 0.11 * k, vm + 0.11 * k, h + chimneyH, h + chimneyH + 3, DARK_STONE);
}
__name(furnace, "furnace");
function foundry(skin2) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45;
  const roof = roofOf(skin2, ROOF_RED);
  const [cx, cy] = P(0.56, -0.08, 26);
  return sprite(
    `<ellipse cx="4" cy="${f2(P(0, 0, 0)[1] + 4)}" rx="58" ry="27" fill="rgba(40,55,20,.14)"/>` + box(u0, v0, u1, v1, 0, 22, STONE) + courseLeft(u0, u1, v1, 0, 22, 3) + courseRight(u1, v0, v1, 0, 22, 3) + doorLeft(-0.55, -0.15, v1, 17, WOOD_DARK.right) + box(u0, v0, u1, v1, 22, 40, WOOD) + planksLeft(u0, u1, v1, 22, 40) + planksRight(u1, v0, v1, 22, 40) + windowLeft(-0.6, -0.35, v1, 27, 36) + windowRight(u1, -0.3, -0.05, 27, 36) + gable(u0, v0, u1, v1, 40, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 40, 18, 0.1) + (skin2 === "enseigne-doree" ? goldenSign(-0.3, v1, 44) : "") + box(0.25, -0.45, 0.88, 0.3, 0, 22, BRICK) + courseLeft(0.25, 0.88, 0.3, 0, 22, 4, "rgba(90,40,25,.3)") + face([[0.88, -0.2, 2], [0.88, 0.1, 2], [0.88, 0.1, 13], [0.88, -0.2, 13]], "#3A1E14") + face([[0.88, -0.16, 3], [0.88, 0.06, 3], [0.88, 0.06, 8], [0.88, -0.16, 8]], MOLTEN) + cylinder(0.56, -0.08, 22, 26, 0.2, { top: "#5E3A2A", left: DARK_STONE.left, right: DARK_STONE.right }, "fd-cru") + `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="7" ry="3.5" fill="${MOLTEN}"/><ellipse cx="${f2(cx - 1.5)}" cy="${f2(cy - 0.6)}" rx="3" ry="1.4" fill="#FFE07A"/>` + box(0.62, -0.42, 0.78, -0.26, 22, 62, BRICK) + box(0.3, -0.42, 0.42, -0.3, 22, 50, BRICK) + face([[0.5, 0.3, 14], [0.56, 0.3, 14], [0.46, 0.5, 5], [0.4, 0.5, 5]], "#5E3A2A") + face([[0.51, 0.3, 14.3], [0.55, 0.3, 14.3], [0.45, 0.5, 5.3], [0.41, 0.5, 5.3]], MOLTEN) + molds(0.42, 0.6),
    BUILDING_BOX
  );
}
__name(foundry, "foundry");
function greatForge(skin2) {
  const u0 = -1.35, u1 = 0.25, v0 = -1.3, v1 = 0.6;
  const roof = roofOf(skin2, ROOF_RED);
  return big(
    bigShadow(86, 40) + box(u0, v0, u1, v1, 0, 34, STONE) + courseLeft(u0, u1, v1, 0, 34, 5) + courseRight(u1, v0, v1, 0, 34, 5) + archLeft(-0.55, 0.3, v1, 0, 30, "#3A2318", ` stroke="${OUT}" stroke-width="0.8"`) + archLeft(-0.55, 0.22, v1 + 5e-3, 0, 24, "#7A2E14") + ell(...P(-0.55, v1, 8), 9, 5, MOLTEN, ' opacity=".7"') + [-1.15, 0].map((u) => archLeft(u + 0.1, 0.08, v1, 14, 14, "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"')).join("") + [-1.05, -0.45].map((v) => face([[u1, v, 14], [u1, v + 0.2, 14], [u1, v + 0.2, 26], [u1, v, 26]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"')).join("") + gable(u0, v0, u1, v1, 34, 26, { front: roof.front, back: roof.back, gable: STONE.right }, 0.1) + roofTextureOf(skin2, "toit-rouge", u0, v0, u1, v1, 34, 26, 0.1) + (skin2 === "enseigne-doree" ? goldenSign(-0.1, v1, 46) : "") + furnace(0.42, -0.72, 1.4, 0.42, 26, 58, 1.5) + barrel(0.62, 0.95, "gf-b1") + crate(-1.12, 1, 0.12, 10) + crate(-0.92, 1.12, 0.1, 8)
  );
}
__name(greatForge, "greatForge");
function manufacture(skin2) {
  const u0 = -1.35, u1 = 0.3, v0 = -1.35, v1 = 0.45;
  const roof = roofOf(skin2, { front: "#8E9AB2", back: "#5C6880" });
  let sheds = "";
  for (let k = 0; k < 3; k++) {
    const a = u0 + (u1 - u0) / 3 * k;
    const b = a + (u1 - u0) / 3;
    sheds += face([[a, v0, 36], [a, v1, 36], [a, v1, 54], [a, v0, 54]], "rgba(200,230,245,.9)", ` stroke="${OUT}" stroke-width="0.7"`) + face([[a, v0, 54], [b, v0, 36], [b, v1, 36], [a, v1, 54]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`) + (HIVER ? snowPan(P(a, v0, 54), P(a, v1, 54), P(b, v1, 36), P(b, v0, 36), 0.8, k === 2) : "") + face([[a, v1, 54], [b, v1, 36], [a, v1, 36]], PLASTER.left, ` stroke="${OUT}" stroke-width="0.7"`);
  }
  return big(
    bigShadow(88, 42) + box(u0, v0, u1, v1, 0, 36, PLASTER) + courseRight(u1, v0, v1, 0, 36, 4, "rgba(150,120,80,.2)") + [-1.2, -0.85, -0.5, -0.15].map((u) => face([[u, v1, 14], [u + 0.22, v1, 14], [u + 0.22, v1, 30], [u, v1, 30]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.9"') + ln(P(u + 0.11, v1, 14), P(u + 0.11, v1, 30), "#FFFFFF", 0.7)).join("") + face([[-0.6, v1, 0], [-0.35, v1, 0], [-0.35, v1, 11], [-0.6, v1, 11]], "#6A3F22", ` stroke="${OUT}" stroke-width="0.7"`) + sheds + (skin2 === "enseigne-doree" ? goldenSign(-0.3, v1, 40) : "") + furnace(0.45, -0.72, 1.4, 0.42, 26, 62, 1.5) + crate(-1.15, 0.85, 0.13, 11) + crate(-0.9, 0.9, 0.11, 9) + crate(-1.1, 0.8, 0.1, 8) + barrel(0.65, 0.95, "mf-b1")
  );
}
__name(manufacture, "manufacture");
var GEAR = { u: -0.55, v: 0.47, z: 30, r: 0.3 };
function factory(skin2) {
  const u0 = -1.35, u1 = 0.3, v0 = -1.35, v1 = 0.45;
  const roof = roofOf(skin2, { front: "#6C7480", back: "#4F5660" });
  return big(
    bigShadow(90, 42) + cylinder(-1.05, -1.05, 40, 112, 0.12, { top: "#4A2A20", left: BRICK.left, right: BRICK.right }, "fc-ch1") + cylinder(-0.45, -1.1, 40, 100, 0.11, { top: "#4A2A20", left: BRICK.left, right: BRICK.right }, "fc-ch2") + box(u0, v0, u1, v1, 0, 40, BRICK) + courseLeft(u0, u1, v1, 0, 40, 8, "rgba(90,40,25,.3)") + courseRight(u1, v0, v1, 0, 40, 8, "rgba(70,30,20,.3)") + [-1.2, -0.95, -0.2, 0.05].map((u) => archLeft(u + 0.08, 0.08, v1, 12, 18, "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"')).join("") + face([[u0 - 0.04, v0 - 0.04, 40], [u1 + 0.04, v0 - 0.04, 40], [u1 + 0.04, v1 + 0.04, 40], [u0 - 0.04, v1 + 0.04, 40]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`) + (HIVER ? snowPan(P(u0 - 0.04, v0 - 0.04, 40), P(u1 + 0.04, v0 - 0.04, 40), P(u1 + 0.04, v1 + 0.04, 40), P(u0 - 0.04, v1 + 0.04, 40), 0.9) : "") + box(u0, v1 - 0.04, u1, v1 + 0.04, 40, 44, DARK_STONE) + ln(P(u1, 0.2, 30), P(0.45, 0.2, 30), COPPER2.right, 3.4) + ln(P(u1, 0.2, 31), P(0.45, 0.2, 31), COPPER2.top, 1) + ln(P(u1, -0.6, 22), P(0.45, -0.6, 22), COPPER2.right, 3) + ln(P(u1, -0.6, 23), P(0.45, -0.6, 23), COPPER2.top, 0.9) + (skin2 === "enseigne-doree" ? goldenSign(-1, v1, 40) : "") + furnace(0.45, -0.72, 1.4, 0.42, 30, 66, 1.5) + barrel(0.65, 0.95, "fc-b1") + barrel(0.88, 1.05, "fc-b2") + crate(-1.15, 0.85, 0.13, 11)
  );
}
__name(factory, "factory");
var gear = /* @__PURE__ */ __name((f) => sprite((() => {
  const { u, v, z, r } = GEAR;
  const pt = /* @__PURE__ */ __name((a, rr) => P(u + rr * Math.cos(a), v, z + 32 * rr * Math.sin(a)), "pt");
  const turn = f / 6 * (Math.PI / 6);
  const teeth = Array.from({ length: 24 }, (_, k) => pt(turn + k / 24 * Math.PI * 2, k % 2 ? r : r * 1.18));
  const [cx, cy] = P(u, v, z);
  let out = `<polygon points="${teeth.map((p) => p.map(f2).join(",")).join(" ")}" fill="${IRON.left}" stroke="#41484F" stroke-width="0.8"/>`;
  const hole = Array.from({ length: 16 }, (_, k) => pt(k / 16 * Math.PI * 2, r * 0.7));
  out += `<polygon points="${hole.map((p) => p.map(f2).join(",")).join(" ")}" fill="${IRON.right}"/>`;
  for (let k = 0; k < 4; k++) out += ln([cx, cy], pt(turn + k / 4 * Math.PI * 2, r * 0.72), IRON.top, 2);
  return out + dot(cx, cy, 2.6, "#41484F");
})(), { x: -50, y: -70, w: 60, h: 50 }), "gear");
var ALEMBIC = { u: 0.9, v: -0.15, z: 26 };
function alchemist(skin2) {
  const roofCone = skin2 === "toit-ardoise" ? { light: "#9AA6BC", dark: "#4F5A72" } : { light: "#B9A0F0", dark: "#5E44A8" };
  const [tx, ty] = P(-0.55, -0.55, 0);
  const stars = [[-8, -96], [6, -104], [-2, -84], [12, -90]].map(([dx, dy]) => `<path d="M${f2(tx + dx)},${f2(ty + dy - 2.4)} L${f2(tx + dx + 0.8)},${f2(ty + dy)} L${f2(tx + dx)},${f2(ty + dy + 2.4)} L${f2(tx + dx - 0.8)},${f2(ty + dy)} Z" fill="${GOLD.top}"/>`).join("");
  return big(
    bigShadow(88, 42) + cylinder(-0.55, -0.55, 0, 80, 0.5, STONE, "al-tower") + [18, 36, 54, 72].map((z) => {
      const [x, y] = P(-0.55, -0.55, z);
      return `<path d="M${f2(x - 22.6)},${f2(y)} A22.6,11.3 0 0 0 ${f2(x + 22.6)},${f2(y)}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.7"/>`;
    }).join("") + [[-0.75, -0.12, 26], [-0.38, -0.14, 48], [-0.62, -0.1, 66]].map(([u, v, z]) => {
      const [x, y] = P(u, v, z);
      return `<path d="M${f2(x - 3.5)},${f2(y + 6)} V${f2(y - 2)} Q${f2(x)},${f2(y - 8)} ${f2(x + 3.5)},${f2(y - 2)} V${f2(y + 6)} Z" fill="#C8F0A0" stroke="#FFFFFF" stroke-width="0.8"/>`;
    }).join("") + archLeft(-0.4, 0.13, -0.06, 0, 18, "#3A2A1E", ` stroke="${OUT}" stroke-width="0.7"`) + cone(-0.55, -0.55, 80, 0.62, 40, roofCone, "al-roof") + stars + ln([tx, ty - 120], [tx, ty - 130], "#7A5A3A", 1.4) + `<path d="M${f2(tx - 4)},${f2(ty - 131)} a4,4 0 1 0 8,0 a3,3 0 1 1 -8,0 Z" fill="${GOLD.left}"/>` + furnace(0.42, -0.72, 1.4, 0.42, 24, 40, 1.5) + cylinder(ALEMBIC.u, ALEMBIC.v, ALEMBIC.z, ALEMBIC.z + 4, 0.3, COPPER2, "al-ring") + `<path d="M${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] - 13)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1])} Q${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] - 15)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 26)} ${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0])},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 28)} Q${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] + 15)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 26)} ${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] + 13)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1])} Z" fill="rgba(200,245,220,.55)" stroke="#FFFFFF" stroke-width="1"/>` + ell(P(ALEMBIC.u, ALEMBIC.v, 30)[0], P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 6, 11, 5, "#6FE08A", ' opacity=".85"') + `<path d="M${f2(P(ALEMBIC.u, ALEMBIC.v, 58)[0])},${f2(P(ALEMBIC.u, ALEMBIC.v, 58)[1])} q-14,-6 -26,8 q-6,8 -2,18" stroke="${COPPER2.right}" stroke-width="2.4" fill="none"/>` + (skin2 === "enseigne-doree" ? goldenSign(-0.05, -0.06, 30) : "") + barrel(0.62, 0.95, "al-b1") + crate(-1.1, 0.9, 0.12, 10)
  );
}
__name(alchemist, "alchemist");
var bubbles = /* @__PURE__ */ __name((f) => sprite((() => {
  const [x, y] = P(ALEMBIC.u, ALEMBIC.v, 30);
  let out = "";
  for (let k = 0; k < 6; k++) {
    const t = (f / 6 + k / 6) % 1;
    out += `<circle cx="${f2(x - 6 + k * 2.3 % 12)}" cy="${f2(y - 6 - t * 18)}" r="${f2(1 + t * 1.6)}" fill="none" stroke="rgba(255,255,255,${f2(0.9 - t * 0.6)})" stroke-width="0.7"/>`;
  }
  const [px, py] = P(ALEMBIC.u - 0.35, ALEMBIC.v + 0.3, 40);
  for (let k = 0; k < 3; k++) {
    const t = (f / 6 + k / 3) % 1;
    out += dot(px - 4 + t * 6, py - t * 22, 2 + t * 4, `rgba(190,150,255,${f2(0.5 * (1 - t))})`);
  }
  return out;
})(), { x: -10, y: -110, w: 80, h: 90 }), "bubbles");
var ATELIER_TIERS = [
  { make: foundry, lights: [[0.88, -0.05, 7, 26], [0.56, -0.08, 28, 18], [0.42, 0.6, 5, 12]], smoke: [[0.7, -0.34, 64], [0.36, -0.36, 52]] },
  { make: greatForge, lights: [[1.4, -0.15, 8, 34], [-0.55, 0.6, 10, 26], [-1.05, 0.6, 20, 14], [0.1, 0.6, 20, 14]], smoke: [[0.91, -0.15, 96]] },
  { make: manufacture, lights: [[1.4, -0.15, 8, 34], [-1.09, 0.45, 22, 14], [-0.74, 0.45, 22, 14], [-0.39, 0.45, 22, 14], [-0.04, 0.45, 22, 14]], smoke: [[0.93, -0.15, 100]] },
  { make: factory, lights: [[1.4, -0.15, 9, 36], [-1.12, 0.45, 20, 14], [-0.87, 0.45, 20, 14], [-0.12, 0.45, 20, 14], [0.13, 0.45, 20, 14]], smoke: [[-1.05, -1.05, 114], [-0.45, -1.1, 102], [0.93, -0.15, 108]], anims: [{ key: "gear", n: 6, fps: 6, frame: gear }] },
  { make: alchemist, lights: [[-0.75, -0.12, 26, 14], [-0.38, -0.14, 48, 14], [-0.62, -0.1, 66, 14], [0.9, -0.15, 36, 24], [1.4, -0.15, 8, 30]], smoke: [[0.91, -0.15, 66]], anims: [{ key: "bubbles", n: 6, fps: 6, frame: bubbles }] }
];

// atelier/port/src/world/tiers/ponton.js
var WATER_LIGHT = "#6FC0E4";
var WATER2 = "#5AAED7";
var DECK = { top: "#E0A96C", left: "#BF8049", right: "#965C30" };
function harbor(k, under = "") {
  let posts = "";
  for (const u of [-0.75, -0.25, 0.25, 0.75]) {
    posts += box(u * k - 0.04, 0.12 * k, u * k + 0.04, 0.2 * k, -4, 7, WOOD_DARK) + box(u * k - 0.04, -0.2 * k, u * k + 0.04, -0.12 * k, -4, 7, WOOD_DARK);
  }
  let planks = "";
  for (let u = -0.85 * k + 0.13; u < 0.9 * k; u += 0.13) planks += ln(P(u, -0.25 * k, 10), P(u, 0.25 * k, 10), "rgba(90,55,25,.35)", 0.8);
  return cove(0, 0.05 * k, 0.92 * k, WATER_LIGHT, WATER2) + under + posts + box(-0.85 * k, -0.25 * k, 0.9 * k, 0.25 * k, 7, 10, DECK) + planks + box(0.45 * k, 0.25 * k, 0.75 * k, 0.75 * k, 7, 10, DECK) + box(0.71 * k, 0.71 * k, 0.75 * k, 0.75 * k, -4, 7, WOOD_DARK) + box(0.45 * k, 0.71 * k, 0.49 * k, 0.75 * k, -4, 7, WOOD_DARK);
}
__name(harbor, "harbor");
function bollard(u, v) {
  return cylinder(u, v, 10, 16, 0.04, { top: "#5A636C", left: "#5A636C", right: "#41484F" }, `bl-${Math.round((u + 2) * 100)}`) + cylinder(u, v, 16, 17.5, 0.055, IRON, `bt-${Math.round((u + 2) * 100)}`);
}
__name(bollard, "bollard");
function ropeCoil(u, v) {
  const [x, y] = P(u, v, 10);
  return [5, 3.6, 2.2].map((r) => ell(x, y - 1, r, r / 2, "none", ' stroke="#C9A16A" stroke-width="1.4"')).join("");
}
__name(ropeCoil, "ropeCoil");
function shipyard() {
  const ribs = [];
  for (let k = 0; k < 6; k++) {
    const u = -0.8 + k * 0.1;
    const w = 0.13 * Math.sin((k + 0.5) / 6 * Math.PI) + 0.04;
    const h = 10 + 12 * Math.sin((k + 0.5) / 6 * Math.PI);
    const [a, b, c] = [P(u, -w, 10 + h), P(u, 0, 13), P(u, w, 10 + h)];
    ribs.push(`<path d="M${f2(a[0])},${f2(a[1])} Q${f2(b[0] - 1)},${f2(b[1] + 4)} ${f2(c[0])},${f2(c[1])}" stroke="${WOOD.right}" stroke-width="1.8" fill="none"/>`);
  }
  return sprite(
    harbor(1) + box(-0.86, -0.06, -0.24, 0.06, 10, 13, WOOD_DARK) + ribs.slice(0, 3).join("") + ln(P(-0.85, 0, 13), P(-0.27, 0, 14), WOOD_DARK.right, 2.6) + face([[-0.84, 0.03, 13], [-0.3, 0.03, 13], [-0.4, 0.12, 22], [-0.75, 0.12, 22]], WOOD.left, ` stroke="${OUT}" stroke-width="0.6"`) + ribs.slice(3).join("") + ln(P(-0.27, 0, 14), P(-0.16, 0, 30), WOOD_DARK.right, 2) + [[-0.88, -0.2], [-0.2, -0.2]].map(([u, v]) => box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 10, 40, WOOD_DARK)).join("") + box(-0.9, -0.22, -0.18, -0.18, 34, 36, WOOD) + ln(P(-0.2, -0.2, 40), P(0.05, 0.05, 44), WOOD.right, 1.8) + ln(P(0.05, 0.05, 44), P(0.05, 0.05, 28), "#3D3A36", 0.6) + box(0, 0, 0.1, 0.1, 24, 28, { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" }) + [0, 1, 2].map((k) => box(0.15, -0.2, 0.42, -0.08, 10 + k * 2.2, 12 + k * 2.2, { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" })).join("") + ropeCoil(0.25, 0.12) + bollard(0.82, 0.18) + box(0.8, 0.12, 0.84, 0.16, 10, 34, WOOD_DARK) + box(0.76, 0.08, 0.88, 0.2, 34, 41, { top: "#3D3A36", left: "#FFE08A", right: "#E9BF4E" }),
    BUILDING_BOX
  );
}
__name(shipyard, "shipyard");
var JETTY = { u: -1.12, v: -1.12, h: 40 };
function jettyLight(lamp = "#FFE08A") {
  const { u, v, h } = JETTY;
  const [tx, ty] = P(u, v, h + 14);
  return box(u - 0.2, v - 0.2, u + 0.2, v + 0.2, 0, 8, STONE) + courseRight(u + 0.2, v - 0.2, v + 0.2, 0, 8, 2) + box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 8, h, { top: "#55504A", left: "#55504A", right: "#3D3A36" }) + box(u - 0.09, v - 0.09, u + 0.09, v + 0.09, h, h + 12, { top: "#3D3A36", left: lamp, right: "#E9BF4E" }) + ln(P(u, v + 0.09, h), P(u, v + 0.09, h + 12), "#3D3A36", 0.8) + `<path d="M${f2(tx - 7)},${f2(ty + 2)} L${f2(tx)},${f2(ty - 8)} L${f2(tx + 7)},${f2(ty + 2)} Z" fill="#E2463A" stroke="${OUT}" stroke-width="0.7"/>` + (HIVER ? snowCap("jl-neige", `M${f2(tx - 7)},${f2(ty + 2)} L${f2(tx)},${f2(ty - 8)} L${f2(tx + 7)},${f2(ty + 2)} Z`, tx, ty - 8, 6, 5) : "") + dot(tx, ty - 9, 1.4, GOLD.left);
}
__name(jettyLight, "jettyLight");
var deckCrate = /* @__PURE__ */ __name((u, v, s = 0.08) => box(u - s, v - s, u + s, v + s, 10, 10 + s * 100, { top: "#E0B47A", left: "#C99359", right: "#A06F3C" }), "deckCrate");
function port(extra = "", lamp = "#FFE08A", under = "") {
  return big(
    harbor(1.5, jettyLight(lamp) + under) + bollard(0.3, 0.33) + bollard(-0.6, 0.33) + ropeCoil(0, -0.2) + ropeCoil(-0.95, 0.15) + deckCrate(-0.4, -0.22) + deckCrate(-0.28, -0.26, 0.06) + extra + box(1.22, 0.2, 1.26, 0.24, 10, 38, WOOD_DARK) + box(1.18, 0.16, 1.3, 0.28, 38, 45, { top: "#3D3A36", left: "#FFE08A", right: "#E9BF4E" })
  );
}
__name(port, "port");
var grandPort = /* @__PURE__ */ __name(() => port(), "grandPort");
function fishMarket() {
  const u0 = -1.2, u1 = -0.3, v0 = -0.34, v1 = 0.34;
  const stalls = [-1.05, -0.75, -0.45].map((u) => box(u - 0.1, 0.12, u + 0.1, 0.26, 10, 18, { top: "#E0B47A", left: "#C99359", right: "#A06F3C" }) + [-0.05, 0, 0.05].map((du) => {
    const [x, y] = P(u + du, 0.19, 18.5);
    return `<path d="M${f2(x - 3)},${f2(y)} q3,-2 6,0 q-3,2 -6,0 Z M${f2(x + 3)},${f2(y)} l1.6,-1.2 l0,2.4 Z" fill="${du ? "#B8CCD8" : "#F08A6E"}"/>`;
  }).join("")).join("");
  const roof = { front: "#FFFFFF", back: "#DDE6EE", gable: "#C9D2DA" };
  let stripes = "";
  for (let k = 0; k < 5; k++) {
    const a = u0 - 0.06 + k * ((u1 - u0 + 0.12) / 5);
    const b = a + (u1 - u0 + 0.12) / 10;
    stripes += face([[a, 0, 44], [b, 0, 44], [b, v1 + 0.06, 32], [a, v1 + 0.06, 32]], BLUE_ROOF.front);
  }
  return [[u0, v0], [u1, v0]].map(([u, v]) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 10, 32, WOOD_DARK)).join("") + stalls + [[u0, v1], [u1, v1]].map(([u, v]) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 10, 32, WOOD_DARK)).join("") + gable(u0, v0, u1, v1, 32, 12, roof, 0.06) + stripes + (HIVER ? snowPan(P(u0 - 0.06, 0, 44), P(u1 + 0.06, 0, 44), P(u1 + 0.06, v1 + 0.06, 32), P(u0 - 0.06, v1 + 0.06, 32), 0.8) : "") + deckCrate(-0.15, 0.1, 0.07);
}
__name(fishMarket, "fishMarket");
var market = /* @__PURE__ */ __name(() => port(fishMarket()), "market");
function steamer() {
  const u0 = -0.72, u1 = 0.42, v = -0.92;
  const hull = [P(u0, v, 4), P(u1 + 0.15, v, 4), P(u1, v + 0.2, 4), P(u0 + 0.05, v + 0.2, 4)];
  const side = [P(u0 + 0.05, v + 0.2, 4), P(u1, v + 0.2, 4), P(u1 + 0.15, v, 4), P(u1 + 0.12, v, -2), P(u1 - 0.02, v + 0.18, -3), P(u0 + 0.08, v + 0.18, -3)];
  return `<polygon points="${side.map((p) => p.map(f2).join(",")).join(" ")}" fill="#2E2A26"/><polygon points="${hull.map((p) => p.map(f2).join(",")).join(" ")}" fill="#C9935E" stroke="${OUT}" stroke-width="0.7"/>` + ln(P(u0 + 0.06, v + 0.2, 1), P(u1, v + 0.2, 1), "#B13A31", 2) + box(u0 + 0.2, v + 0.02, u1 - 0.2, v + 0.18, 4, 16, { top: "#FFFFFF", left: "#F1EEE8", right: "#CFC8BA" }) + [0, 1, 2, 3].map((k) => dot(...P(u0 + 0.28 + k * 0.17, v + 0.18, 10), 1.6, "#FFE6A3")).join("") + cylinder(u0 + 0.62, v + 0.1, 16, 38, 0.07, { top: "#2E2A26", left: "#E2463A", right: "#B13A31" }, "st-funnel") + ln(P(u0 + 0.62, v + 0.1, 30), P(u0 + 0.62, v + 0.1, 32), "#2E2A26", 6) + ln(P(u0 + 0.12, v + 0.1, 4), P(u0 + 0.12, v + 0.1, 34), WOOD_DARK.right, 1.2) + ln(P(u0 + 0.12, v + 0.1, 34), P(u1 + 0.1, v + 0.1, 8), "#3D3A36", 0.5);
}
__name(steamer, "steamer");
var steamPort = /* @__PURE__ */ __name(() => port(fishMarket(), "#FFE08A", steamer()), "steamPort");
var krakenPort = /* @__PURE__ */ __name(() => port(fishMarket() + chest(0.95, -0.12), "#9CFFB0"), "krakenPort");
function chest(u, v) {
  const [x, y] = P(u, v, 18);
  return box(u - 0.1, v - 0.07, u + 0.1, v + 0.07, 10, 18, { top: "#A8743F", left: "#8B5631", right: "#6A3F22" }) + face([[u - 0.1, v - 0.07, 18], [u + 0.1, v - 0.07, 18], [u + 0.1, v + 0.07, 21], [u - 0.1, v + 0.07, 21]], "#C9935E", ` stroke="${OUT}" stroke-width="0.6"`) + ln(P(u - 0.1, v + 0.07, 14), P(u + 0.1, v + 0.07, 14), GOLD.right, 1.2) + dot(x - 6, y + 4, 1.2, GOLD.left) + [[-4, -3], [0, -4], [4, -3]].map(([dx, dy]) => dot(x + dx, y + dy, 1.6, GOLD.left)).join("");
}
__name(chest, "chest");
var KRAKEN = [[-0.9, 0.7, 1], [-0.35, 1.05, 0.8], [0.3, -0.95, 0.9], [0.95, -0.55, 0.7]];
var tentacles = /* @__PURE__ */ __name((f) => sprite((() => {
  let out = "";
  KRAKEN.forEach(([u, v, s], k) => {
    const [x, y] = P(u, v, 0);
    const w = Math.sin(f / 6 * Math.PI * 2 + k * 1.7) * 6 * s;
    const h = 34 * s;
    out += ell(x, y + 1, 8 * s, 3 * s, "rgba(255,255,255,.55)") + `<path d="M${f2(x - 5 * s)},${f2(y)} C${f2(x - 6 * s + w)},${f2(y - h * 0.4)} ${f2(x + w * 1.6)},${f2(y - h * 0.7)} ${f2(x + w * 1.2 + 6 * s)},${f2(y - h)} C${f2(x + w * 1.4 + 2 * s)},${f2(y - h * 0.65)} ${f2(x + 4 * s + w * 0.6)},${f2(y - h * 0.35)} ${f2(x + 5 * s)},${f2(y)} Z" fill="#8E5BB8" stroke="#5E3A82" stroke-width="0.8"/>` + [0.25, 0.45, 0.65].map((t) => dot(x + w * t * 1.3 + (1 - t) * 1, y - h * t, 1.4 * s, "#D6B8F0")).join("");
  });
  const [ex, ey] = P(-0.6, 0.95, 0);
  return out + `<ellipse cx="${f2(ex)}" cy="${f2(ey - 3)}" rx="6" ry="${f2(f === 3 ? 0.6 : 3)}" fill="#F2C04B" stroke="#5E3A82" stroke-width="1"/>` + (f === 3 ? "" : `<ellipse cx="${f2(ex)}" cy="${f2(ey - 3)}" rx="1.4" ry="2.6" fill="#1E1A17"/>`);
})(), { x: -110, y: -60, w: 220, h: 120 }), "tentacles");
var PONTON_TIERS = [
  { make: shipyard, boat: [0.05, 0.5], lights: [[0.82, 0.14, 37, 16]] },
  { make: grandPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 46, 20], [1.24, 0.22, 41, 16]] },
  { make: market, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 46, 20], [1.24, 0.22, 41, 16], [-0.75, 0.2, 30, 18]] },
  { make: steamPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 46, 20], [1.24, 0.22, 41, 16], [-0.25, -0.74, 10, 18]], smoke: [[-0.1, -0.82, 40]] },
  { make: krakenPort, boat: [0.08, 0.75], lights: [[-1.12, -1.12, 46, 22], [1.24, 0.22, 41, 16], [0.95, -0.12, 22, 16], [-0.6, 0.95, 4, 16]], anims: [{ key: "kraken", n: 6, fps: 5, frame: tentacles }] }
];

// atelier/port/src/world/tiers/index.js
var TIERS = { foyer: FOYER_TIERS, carriere: CARRIERE_TIERS, bosquet: BOSQUET_TIERS, puits: PUITS_TIERS, potager: POTAGER_TIERS, atelier: ATELIER_TIERS, ponton: PONTON_TIERS };

// atelier/port/src/world/tints.js
var TINTS = {
  craie: { name: "Craie", all: { s: 0.5, lift: 0.45 } },
  sepia: { name: "Sépia", all: { h: 32, k: 0.15, s: 0.55, lift: 0.05, tone: 0.25 } },
  corail: { name: "Corail", warm: { h: 8, k: 0.5, s: 1.05, lift: 0.08 }, violet: { h: 8, k: 0.5, s: 1.05, lift: 0.08 }, leaf: { h: 160, k: 0.4, s: 0.8 } },
  ocean: { name: "Océan", warm: { h: 206, k: 0.5, s: 0.8 }, violet: { h: 206, k: 0.5, s: 0.8 }, leaf: { h: 165, k: 0.4, s: 0.9 } },
  emeraude: { name: "Émeraude", warm: { h: 150, k: 0.5, s: 0.75 }, violet: { h: 150, k: 0.5, s: 0.75 }, leaf: { h: 140, k: 0.4, s: 1.05, l: 0.9 } },
  lavande: { name: "Lavande", warm: { h: 268, k: 0.5, s: 0.6, lift: 0.15 }, violet: { h: 268, k: 0.5, s: 0.6, lift: 0.15 }, leaf: { h: 120, k: 0.4, s: 0.55 } },
  flamboyant: { name: "Flamboyant", warm: { h: 356, k: 0.35, s: 1.05, l: 0.92 }, violet: { h: 356, k: 0.35, s: 1.05, l: 0.92 }, leaf: { h: 26, k: 0.25, s: 1.1 } },
  sakura: { name: "Sakura", warm: { h: 342, k: 0.25, s: 0.85, lift: 0.12 }, violet: { h: 342, k: 0.25, s: 0.85, lift: 0.12 }, leaf: { h: 335, k: 0.2, s: 0.75, lift: 0.22 } },
  frimas: { name: "Frimas", all: { h: 205, k: 0.1, s: 0.35, lift: 0.38, tone: 0.3 } },
  cristal: { name: "Cristal", warm: { h: 272, k: 0.2, s: 0.9, lift: 0.12 }, violet: { h: 272, k: 0.2, s: 0.9, lift: 0.12 }, leaf: { h: 186, k: 0.2, s: 0.9, lift: 0.12 }, cool: { h: 196, k: 0.5, s: 1.1, lift: 0.1 } },
  "nuit-etoilee": { name: "Nuit étoilée", all: { h: 232, k: 0.12, s: 0.7, l: 0.55, tone: 0.3 } },
  "or-royal": { name: "Or royal", warm: { h: 44, k: 0.3, s: 1.1, lift: 0.04 }, violet: { h: 44, k: 0.3, s: 1.05, lift: 0.04 }, leaf: { h: 150, k: 0.3, s: 0.8, l: 0.75 } }
};
var TINT_IDS = Object.keys(TINTS);
var RARE_TINTS = {
  papillons: { all: { s: 0.7, lift: 0.22 } },
  tournesols: { warm: { h: 46, k: 0.4, s: 1.1, lift: 0.04 }, leaf: { h: 85, k: 0.4, s: 1 } },
  "filon-or": { all: { h: 220, k: 0.1, s: 0.35, l: 0.72, tone: 0.06 } },
  "coeur-lave": { all: { h: 12, k: 0.1, s: 0.45, l: 0.55, tone: 0.14 } },
  fees: { warm: { h: 285, k: 0.5, s: 0.55 }, violet: { h: 285, k: 0.5, s: 0.55 }, leaf: { h: 258, k: 0.35, s: 0.55, lift: 0.1 } },
  petales: { leaf: { h: 345, k: 0.2, s: 0.55, lift: 0.38 }, violet: { h: 340, k: 0.2, s: 0.6, lift: 0.3 } },
  "arc-en-ciel": { all: { s: 0.6, lift: 0.3 } },
  nenuphars: { warm: { h: 165, k: 0.5, s: 0.55, lift: 0.05 }, violet: { h: 165, k: 0.5, s: 0.55, lift: 0.05 }, leaf: { h: 150, k: 0.5, s: 0.9 } },
  pavois: { warm: { h: 212, k: 0.4, s: 0.85 }, violet: { h: 212, k: 0.4, s: 0.85 }, all: { lift: 0.08 } },
  mouettes: { all: { h: 200, k: 0.2, s: 0.45, lift: 0.28, tone: 0.12 } },
  etincelles: { warm: { h: 26, k: 0.4, s: 0.95, l: 0.82 }, violet: { h: 26, k: 0.4, s: 0.95, l: 0.82 }, all: { s: 0.9, l: 0.85 } },
  engrenages: { warm: { h: 44, k: 0.35, s: 0.95, lift: 0.02 }, violet: { h: 44, k: 0.35, s: 0.95, lift: 0.02 } },
  lampions: { warm: { h: 18, k: 0.6, s: 1.15, l: 0.9 }, violet: { h: 340, k: 0.5, s: 1 }, all: { l: 0.92 } },
  lierre: { warm: { h: 70, k: 0.4, s: 0.45, l: 0.85 }, violet: { h: 90, k: 0.4, s: 0.4 }, leaf: { h: 105, k: 0.4, s: 0.9, l: 0.85 } }
};
var clamp = /* @__PURE__ */ __name((n) => Math.max(0, Math.min(1, n)), "clamp");
var toHsl = /* @__PURE__ */ __name((hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const c = max - min;
  if (!c) return [0, 0, l, 0];
  const s = c / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / c + 6) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
  return [h * 60, s, l, c];
}, "toHsl");
var toHex = /* @__PURE__ */ __name((h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${[r, g, b].map((n) => Math.round((n + m) * 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}, "toHex");
var FAMILIES = [["warm", 320, 425, 22], ["leaf", 65, 170, 110], ["cool", 170, 255, 210], ["violet", 255, 320, 285]];
var familyOf = /* @__PURE__ */ __name((h) => FAMILIES.find(([, a, b]) => h >= a && h < b || h + 360 >= a && h + 360 < b), "familyOf");
var isGlow = /* @__PURE__ */ __name((h, l, c) => l > 0.72 && c > 0.28 && h >= 35 && h <= 62, "isGlow");
function applyRule(rule, [h, s, l], center, grey) {
  const off = (h - center + 540) % 360 - 180;
  const nh = rule.h === void 0 ? h : (rule.h + off * (rule.k ?? 0) + 360) % 360;
  const ns = Math.max(clamp(s * (rule.s ?? 1)), (rule.tone || 0) * grey);
  const nl = clamp(l * (rule.l ?? 1));
  return [nh, ns, nl + (1 - nl) * (rule.lift || 0)];
}
__name(applyRule, "applyRule");
function recolor(tint, hex) {
  const [h, s, l, c] = toHsl(hex);
  if (isGlow(h, l, c)) return hex;
  const family = familyOf(h);
  const center = family ? family[3] : 0;
  const grey = 1 - clamp((c - 0.05) / 0.15);
  let hsl = [h, s, l];
  const rule = family && tint[family[0]];
  if (rule && grey < 1) {
    const [nh, ns, nl] = applyRule(rule, hsl, center, grey);
    const w = 1 - grey;
    hsl = [nh, s + (ns - s) * w, l + (nl - l) * w];
  }
  if (tint.all) hsl = applyRule(tint.all, hsl, center, grey);
  return toHex(...hsl);
}
__name(recolor, "recolor");
var memo = /* @__PURE__ */ new Map();
function tintSvg(svg, tintId) {
  const tint = TINTS[tintId] || RARE_TINTS[tintId];
  if (!tint) return svg;
  if (!memo.has(tintId)) memo.set(tintId, /* @__PURE__ */ new Map());
  const seen = memo.get(tintId);
  return svg.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => {
    const key = m.toUpperCase();
    if (key === "#3C2819") return m;
    if (!seen.has(key)) seen.set(key, recolor(tint, key));
    return seen.get(key);
  });
}
__name(tintSvg, "tintSvg");
function tintOf(skin2) {
  if (!skin2) return null;
  if (RARE_TINTS[skin2]) return skin2;
  return TINT_IDS.find((t) => skin2.startsWith(`${t}-`)) || null;
}
__name(tintOf, "tintOf");

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
var crestOf = /* @__PURE__ */ __name((site2, level) => CRESTS[site2][Math.max(1, Math.min(level, 7)) - 1], "crestOf");
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
function garlandGeo(site2, level) {
  const h = half(level);
  const [cx, cy] = crestOf(site2, level);
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
function garlandFrame(site2, level) {
  const g = garlandGeo(site2, level);
  return frameOf([g.high, ...g.poles.map((p) => p.top), ...g.poles.map((p) => p.base)], 10);
}
__name(garlandFrame, "garlandFrame");
function garland(site2, level, n, hang, rope = "#5A4632") {
  const g = garlandGeo(site2, level);
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
  const pts2 = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = turn + i / (teeth * 2) * Math.PI * 2;
    const rr = i % 2 ? r : r * 1.22;
    pts2.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92]);
  }
  return `<polygon points="${pts2.map(xy2).join(" ")}" fill="#F2C04B" stroke="#A8782A" stroke-width="0.6" stroke-linejoin="round"/>` + dot(x, y, r * 0.55, "#FFE08A") + dot(x, y, r * 0.22, "#A8782A");
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
var IRON2 = { top: "#B4BEC8", left: "#8E99A4", right: "#68737E" };
var DARK_IRON = { top: "#77818B", left: "#5A636C", right: "#41484F" };
var COPPER3 = { top: "#F4B07A", left: "#D9844E", right: "#A85C31" };
var STRAW = { top: "#F3DE97", left: "#E2C66E", right: "#C4A24E" };
var STUMP = { top: "#E7C08A", left: WOOD.left, right: WOOD.right };
var BARK = { top: "#A8743F", left: "#8B5631", right: "#F1D3A1" };
var BARN2 = { top: "#E08A70", left: "#C85F46", right: "#A04634" };
var CAST = { top: "#6E9C83", left: "#4F7D66", right: "#355A49" };
var PAIL = { top: "#B98552", left: WOOD.left, right: WOOD.right };
var OUT2 = "#3C2819";
var f23 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f2");
var xy3 = /* @__PURE__ */ __name(([x, y]) => `${f23(x)},${f23(y)}`, "xy");
var ln3 = /* @__PURE__ */ __name((a, b, color, w = 1.2, extra = "") => `<line x1="${f23(a[0])}" y1="${f23(a[1])}" x2="${f23(b[0])}" y2="${f23(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`, "ln");
var poly2 = /* @__PURE__ */ __name((points, fill, extra = "") => `<polygon points="${points.map(xy3).join(" ")}" fill="${fill}"${extra}/>`, "poly");
var ell3 = /* @__PURE__ */ __name((x, y, rx, ry, fill, extra = "") => `<ellipse cx="${f23(x)}" cy="${f23(y)}" rx="${f23(rx)}" ry="${f23(ry)}" fill="${fill}"${extra}/>`, "ell");
var dot2 = /* @__PURE__ */ __name((x, y, r, fill) => `<circle cx="${f23(x)}" cy="${f23(y)}" r="${f23(r)}" fill="${fill}"/>`, "dot");
var wave = /* @__PURE__ */ __name((f, n, amp = 1, phase = 0) => Math.sin(f / n * Math.PI * 2 + phase) * amp, "wave");
var star = /* @__PURE__ */ __name((x, y, r, fill, o = 1) => `<path d="M${f23(x)},${f23(y - r)} Q${f23(x)},${f23(y)} ${f23(x + r)},${f23(y)} Q${f23(x)},${f23(y)} ${f23(x)},${f23(y + r)} Q${f23(x)},${f23(y)} ${f23(x - r)},${f23(y)} Q${f23(x)},${f23(y)} ${f23(x)},${f23(y - r)} Z" fill="${fill}" opacity="${f23(o)}"/>`, "star");
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
function wheel(T, du, dv, zc, r, axis, { rim = WOOD_DARK.right, spokes = 6, turn = 0, width = 1.6 } = {}) {
  const pt = /* @__PURE__ */ __name((a) => axis === "u" ? T.p(du + r * Math.cos(a), dv, zc + 32 * r * Math.sin(a)) : T.p(du, dv + r * Math.cos(a), zc + 32 * r * Math.sin(a)), "pt");
  const ring = Array.from({ length: 20 }, (_, k) => pt(k / 20 * Math.PI * 2));
  const c = T.p(du, dv, zc);
  let out = `<polygon points="${ring.map(xy3).join(" ")}" fill="rgba(0,0,0,.08)" stroke="${rim}" stroke-width="${width}" stroke-linejoin="round"/>`;
  for (let k = 0; k < spokes; k++) out += ln3(c, pt(turn + k / spokes * Math.PI * 2), rim, 0.8);
  return out + dot2(c[0], c[1], 1.3, rim);
}
__name(wheel, "wheel");
function bucket(T, du, dv, z, h, r0, r1, colors, name, water = true) {
  const [x, y] = T.p(du, dv, z);
  const top = y - h;
  return `<defs><linearGradient id="${T.id(name)}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs><path d="M${f23(x - r1)},${f23(top)} L${f23(x - r0)},${f23(y)} A${f23(r0)},${f23(r0 / 2)} 0 0 0 ${f23(x + r0)},${f23(y)} L${f23(x + r1)},${f23(top)} Z" fill="url(#${T.id(name)})" stroke="${OUT2}" stroke-width="0.6"/><path d="M${f23(x - r1 * 0.96)},${f23(top + h * 0.3)} A${f23(r1 * 0.96)},${f23(r1 / 2)} 0 0 0 ${f23(x + r1 * 0.96)},${f23(top + h * 0.3)}" fill="none" stroke="#3C2819" stroke-width="0.9"/><path d="M${f23(x - r0 * 1.04)},${f23(y - h * 0.22)} A${f23(r0 * 1.04)},${f23(r0 / 2)} 0 0 0 ${f23(x + r0 * 1.04)},${f23(y - h * 0.22)}" fill="none" stroke="#3C2819" stroke-width="0.9"/>` + ell3(x, top, r1, r1 / 2, colors.top, ` stroke="${OUT2}" stroke-width="0.6"`) + (water ? ell3(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#4C9CC8") + ell3(x - r1 * 0.25, top, r1 * 0.3, r1 * 0.12, "rgba(255,255,255,.55)") : ell3(x, top + 0.4, r1 * 0.78, r1 * 0.36, "#3A2A1E"));
}
__name(bucket, "bucket");
function stone(x, y, s, c) {
  return ell3(x + s * 0.1, y + s * 0.2, s, s * 0.65, c.right) + ell3(x, y, s, s * 0.66, c.left) + ell3(x - s * 0.3, y - s * 0.25, s * 0.5, s * 0.3, c.top);
}
__name(stone, "stone");
function hen(x, y, { flip = false, peck = 0, step = 0, color = "#FFFDF8", wing = "#E9DFCB" } = {}) {
  const s = flip ? -1 : 1;
  const hx = x + s * (4.6 + peck * 1.8);
  const hy = y - 12.5 + peck * 7;
  const X = /* @__PURE__ */ __name((dx) => f23(x + s * dx), "X");
  const Y = /* @__PURE__ */ __name((dy) => f23(y + dy), "Y");
  return ell3(x, y + 0.3, 5.4, 1.5, "rgba(40,55,20,.25)") + ln3([x - s * 1.2, y - 3], [x - s * 1.6 + step, y], "#E39A33", 1) + ln3([x + s * 1.6, y - 3], [x + s * 2 - step, y], "#E39A33", 1) + `<path d="M${X(-4)},${Y(-7)} L${X(-8.2)},${Y(-13)} L${X(-6.4)},${Y(-7.5)} L${X(-8.8)},${Y(-10)} L${X(-5)},${Y(-5.5)} Z" fill="${wing}"/><path d="M${X(-6.5)},${Y(-7.5)} Q${X(-6)},${Y(-12)} ${X(-1.5)},${Y(-11)} Q${X(2.5)},${Y(-11.5)} ${X(4.6)},${Y(-8.6)} Q${X(5.6)},${Y(-4)} ${X(1)},${Y(-2.6)} Q${X(-4.6)},${Y(-2.2)} ${X(-6.5)},${Y(-7.5)} Z" fill="${color}" stroke="rgba(60,40,25,.5)" stroke-width="0.6"/><path d="M${X(-3.6)},${Y(-7.6)} Q${X(-0.5)},${Y(-10.2)} ${X(2.4)},${Y(-7)} Q${X(-0.4)},${Y(-4.6)} ${X(-3.6)},${Y(-7.6)} Z" fill="${wing}"/><path d="M${X(2.6)},${Y(-9.4)} L${f23(hx - s * 1.4)},${f23(hy + 1.6)} L${f23(hx + s * 1.2)},${f23(hy + 2)} L${X(4.8)},${Y(-7.8)} Z" fill="${color}"/>` + dot2(hx, hy, 2.7, color) + `<path d="M${f23(hx - s * 1.6)},${f23(hy - 2.2)} q${s * 0.5},-2.2 ${s * 1.4},-0.6 q${s * 0.6},-2 ${s * 1.4},-0.2 q${s * 0.9},-1.4 ${s * 1.3},0.4 Z" fill="#E2463A"/><path d="M${f23(hx + s * 2.5)},${f23(hy - 0.6)} l${s * 2.4},0.9 l${-s * 2.4},0.9 Z" fill="#E8A13A"/>` + ell3(hx + s * 1.9, hy + 2, 0.8, 1.2, "#E2463A") + dot2(hx + s * 0.9, hy - 0.5, 0.65, "#2A2420");
}
__name(hen, "hen");
function chick(x, y, hop = 0) {
  return ell3(x, y + 0.2, 2.4, 0.8, "rgba(40,55,20,.22)") + dot2(x, y - 2.6 - hop, 2.3, "#FFE07A") + dot2(x + 1.6, y - 4.6 - hop, 1.5, "#FFE07A") + `<path d="M${f23(x + 3)},${f23(y - 4.8 - hop)} l1.2,0.4 l-1.2,0.4 Z" fill="#E8A13A"/>` + dot2(x + 2, y - 5 - hop, 0.4, "#2A2420");
}
__name(chick, "chick");
function bee2(x, y, up2) {
  const w = up2 ? -1.2 : 0.4;
  return `<ellipse cx="${f23(x - 1.2)}" cy="${f23(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up2 ? -25 : -5} ${f23(x - 1.2)} ${f23(y - 2 + w)})"/><ellipse cx="${f23(x + 1.2)}" cy="${f23(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up2 ? 25 : 5} ${f23(x + 1.2)} ${f23(y - 2 + w)})"/>` + ell3(x, y, 2.5, 1.7, "#FFD24E", ' stroke="#3C2819" stroke-width="0.4"') + `<rect x="${f23(x - 0.9)}" y="${f23(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/><rect x="${f23(x + 0.7)}" y="${f23(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/>`;
}
__name(bee2, "bee");
function bird(x, y, { body, breast, wing, flip = false, hop = 0, peck = 0, flap = 0 }) {
  const s = flip ? -1 : 1;
  const by = y - hop;
  const X = /* @__PURE__ */ __name((dx) => f23(x + s * dx), "X");
  const hx = 2.6 + peck * 0.8;
  const hy = -5.4 + peck * 2.6;
  return ell3(x, y + 0.4, 3.2, 0.9, `rgba(40,55,20,${f23(0.22 - hop * 0.03)})`) + ln3([x - s * 0.6, by - 1.4], [x - s * 0.8, y], "#7A5A3A", 0.6) + ln3([x + s * 0.8, by - 1.4], [x + s * 0.8, y], "#7A5A3A", 0.6) + `<path d="M${X(-3.4)},${f23(by - 3)} L${X(-6.4)},${f23(by - 4.8)} L${X(-5.6)},${f23(by - 2.4)} Z" fill="${body}"/>` + ell3(x, by - 3.4, 3.6, 2.6, body) + ell3(x + s * 1.2, by - 2.9, 2.2, 1.8, breast) + dot2(x + s * hx, by + hy, 2, body) + dot2(x + s * (hx + 0.4), by + hy + 0.8, 1.2, breast) + `<path d="M${X(hx + 1.8)},${f23(by + hy - 0.2)} l${s * 1.8},0.5 l${-s * 1.8},0.6 Z" fill="#3D3A36"/>` + dot2(x + s * (hx + 0.5), by + hy - 0.5, 0.5, "#1E1A17") + `<path d="M${X(-1.8)},${f23(by - 4)} q${-s * 1.6},${f23(-1.2 - flap * 2.4)} ${-s * 3.6},${f23(-0.6 - flap)}" stroke="${wing}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}
__name(bird, "bird");
var pelle = {
  layers: [{
    at: { 1: [0.6, -0.3], 2: [0.42, 0.58] },
    frame: [-12, -32, 26, 38],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 4);
      const [hx, hy] = [x + 4.2, y - 27];
      return ell3(x + 1, y + 1, 7.4, 2.6, "#5A3822") + `<path d="M${f23(x - 6.5)},${f23(y + 0.8)} q2,-3.8 6.4,-3.8 q4.6,0 6.4,3.4 Z" fill="#6B4329"/><path d="M${f23(x - 3.4)},${f23(y - 7.4)} L${f23(x + 3.2)},${f23(y - 8.4)} L${f23(x + 3)},${f23(y - 1.4)} Q${f23(x)},${f23(y + 1.4)} ${f23(x - 3)},${f23(y - 0.6)} Z" fill="${IRON2.left}" stroke="${IRON2.right}" stroke-width="0.6"/><path d="M${f23(x - 3.4)},${f23(y - 7.4)} L${f23(x - 3)},${f23(y - 0.6)} L${f23(x - 1.8)},${f23(y - 0.2)} L${f23(x - 2)},${f23(y - 7.6)} Z" fill="${IRON2.top}"/><path d="M${f23(x + 0.4)},${f23(y - 8)} L${f23(x + 3.2)},${f23(y - 8.4)} L${f23(x + 3)},${f23(y - 1.4)} Q${f23(x + 1.6)},${f23(y)} ${f23(x + 0.6)},${f23(y)} Z" fill="${IRON2.right}" opacity=".55"/><rect x="${f23(x - 1.1)}" y="${f23(y - 11)}" width="2.6" height="3.4" rx="0.6" fill="${IRON2.right}" transform="rotate(8 ${f23(x)} ${f23(y - 9)})"/>` + ln3([x + 0.3, y - 10.5], [hx, hy + 3.4], WOOD.right, 2) + ln3([x + 0.1, y - 10.5], [hx - 0.4, hy + 3.4], WOOD.top, 0.7) + ln3([hx - 3, hy - 0.4], [hx + 3, hy - 1.6], WOOD.right, 1.9) + ln3([hx - 3, hy - 0.4], [hx - 0.5, hy + 3.6], WOOD.right, 1.2) + ln3([hx + 3, hy - 1.6], [hx + 0.6, hy + 3.4], WOOD.right, 1.2) + `<path d="M${f23(x - 4.4)},${f23(y + 1.2)} q4.4,-2.6 8.8,0 Z" fill="#7A4E30"/>` + dot2(x + 6.6, y - 0.2, 1.2, "#6B4329") + dot2(x - 6.8, y + 1.6, 0.9, "#7A4E30");
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
      return ell3(x + 2, y + 1.2, 9, 2.6, "rgba(40,55,20,.25)") + `<path d="M${f23(x + 4)},${f23(y - 4)} L${f23(x + 13.5)},${f23(y - 14.6)} L${f23(x + 14.6)},${f23(y - 13.4)} L${f23(x + 5)},${f23(y - 2)} Z" fill="${green.right}"/><ellipse cx="${f23(x + 14.8)}" cy="${f23(y - 15)}" rx="2.8" ry="1.8" fill="${COPPER3.left}" stroke="${COPPER3.right}" stroke-width="0.6" transform="rotate(-42 ${f23(x + 14.8)} ${f23(y - 15)})"/>` + [[-0.8, -0.6], [0.5, 0.4], [-0.2, 0.9], [0.9, -0.5]].map(([dx, dy]) => dot2(x + 14.8 + dx, y - 15 + dy, 0.35, COPPER3.right)).join("") + T.cyl(0, 0, 4, 15, 0.085, green, "can") + `<path d="M${f23(x - 3.8)},${f23(y - 5.6)} A3.85,1.92 0 0 0 ${f23(x + 3.8)},${f23(y - 5.6)}" fill="none" stroke="${green.right}" stroke-width="0.9"/>` + ell3(x, y - 15, 2.6, 1.2, "#2F4A36") + `<path d="M${f23(x - 3.4)},${f23(y - 14)} C${f23(x - 3.6)},${f23(y - 22.5)} ${f23(x + 3.6)},${f23(y - 22.5)} ${f23(x + 3.4)},${f23(y - 14.6)}" stroke="${green.right}" stroke-width="1.6" fill="none"/><path d="M${f23(x - 3.9)},${f23(y - 12.6)} q-3.6,0.6 -3.4,4.2 q0.2,2.6 3.2,2.6" stroke="${green.right}" stroke-width="1.4" fill="none"/>` + ln3([x - 2.2, y - 13.2], [x - 2.2, y - 6.4], "rgba(255,255,255,.4)", 1.1);
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
      return T.shadow(0, 0, 0.2, 0.2) + ell3(...T.p(0, 0.04, 0), 9, 3.4, STRAW.left) + ell3(...T.p(0.02, 0.06, 0), 5, 1.8, STRAW.top) + legs + T.box(-0.15, -0.12, 0.15, 0.12, 8, 22, BARN2) + planksLeft(T.u - 0.15, T.u + 0.15, T.v + 0.12, 8, 22, 4.5) + planksRight(T.u + 0.15, T.v - 0.12, T.v + 0.12, 8, 22, 4.5) + T.box(0.13, 0.1, 0.155, 0.125, 8, 22, WALL, "") + T.box(-0.155, 0.1, -0.13, 0.125, 8, 22, WALL, "") + T.box(0.13, -0.125, 0.155, -0.1, 8, 22, WALL, "") + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.12, 17], [-0.02, 0.12, 17]], "#3A2A1E") + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.32, 0], [-0.02, 0.32, 0]], WOOD.top, EDGE) + [0.17, 0.22, 0.27].map((k) => ln3(T.p(-0.02, k, 9 * (1 - (k - 0.12) / 0.2)), T.p(0.08, k, 9 * (1 - (k - 0.12) / 0.2)), WOOD.right, 0.7)).join("") + T.face([[0.15, -0.07, 14], [0.15, 0, 14], [0.15, 0, 19], [0.15, -0.07, 19]], "#FFE6A3", ' stroke="#FFFFFF" stroke-width="0.8"') + T.box(0.15, 0.01, 0.22, 0.11, 10, 16, BARN2) + T.face([[0.15, 0.01, 18], [0.22, 0.01, 16], [0.22, 0.11, 16], [0.15, 0.11, 18]], "#7C7F89", EDGE) + T.gable(-0.15, -0.12, 0.15, 0.12, 22, 9, { front: "#8F939D", back: "#6D717B", gable: BARN2.right }, 0.04);
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
      for (let k = 0; k < 5; k++) rings += ell3(x, y - 11 - k * 4, 9.6 - k * 1.5, 3.4, k % 2 ? STRAW.left : STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.7"`);
      const lavender = [[-9, 2], [-11, -1], [8, 3], [10, 0]].map(([dx, dy]) => ln3([x + dx, y + dy], [x + dx - 0.6, y + dy - 6], "#6FA35A", 0.7) + ell3(x + dx - 0.6, y + dy - 7, 0.9, 2, "#A98ADB")).join("");
      return T.shadow(0, 0, 0.16, 0.22) + lavender + T.box(-0.1, -0.08, -0.07, 0.08, 0, 7, WOOD_DARK) + T.box(0.07, -0.08, 0.1, 0.08, 0, 7, WOOD_DARK) + T.box(-0.14, -0.11, 0.14, 0.11, 7, 9, WOOD) + rings + ell3(x, y - 31, 3, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f23(x - 6)},${f23(y - 12)} q6,3 12,0" stroke="rgba(150,105,40,.5)" stroke-width="0.6" fill="none"/><path d="M${f23(x - 2.8)},${f23(y - 9.4)} a2.8,2.4 0 0 1 5.6,0 Z" fill="#3A2A1E"/>`;
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
var carrot = /* @__PURE__ */ __name((x, y, a) => `<g transform="rotate(${a} ${f23(x)} ${f23(y)})"><path d="M${f23(x)},${f23(y - 1.4)} L${f23(x + 7)},${f23(y)} L${f23(x)},${f23(y + 1.4)} Z" fill="#F08A3A" stroke="#C8622A" stroke-width="0.4"/><path d="M${f23(x)},${f23(y)} l-3,-1.8 M${f23(x)},${f23(y)} l-3.4,0.2 M${f23(x)},${f23(y)} l-2.4,1.8" stroke="#5FA04A" stroke-width="0.9" stroke-linecap="round"/></g>`, "carrot");
var brouette = {
  layers: [{
    at: [0.9, -0.05],
    frame: [-24, -28, 46, 34],
    draw: /* @__PURE__ */ __name((T) => {
      const rim = [[-0.16, -0.12], [0.12, -0.12], [0.12, 0.12], [-0.16, 0.12]].map(([a, b]) => T.p(a, b, 14));
      const base = [[-0.11, -0.085], [0.08, -0.085], [0.08, 0.085], [-0.11, 0.085]].map(([a, b]) => T.p(a, b, 7));
      const [sx, sy] = T.p(-0.02, 0, 14.5);
      const handle = /* @__PURE__ */ __name((s) => ln3(T.p(-0.15, 0.1 * s, 12.5), T.p(-0.38, 0.11 * s, 9), WOOD.right, 1.7) + ln3(T.p(-0.15, 0.1 * s, 13.1), T.p(-0.38, 0.11 * s, 9.6), WOOD.top, 0.6), "handle");
      const leg = /* @__PURE__ */ __name((s) => ln3(T.p(-0.08, 0.07 * s, 7.4), T.p(-0.1, 0.08 * s, 0), DARK_IRON.right, 1.3), "leg");
      return T.shadow(-0.06, 0, 0.22, 0.2) + handle(-1) + leg(-1) + ln3(T.p(0.06, -0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1) + poly2(rim, "#3A2A1E") + ell3(sx, sy, 7.6, 3.2, "#6B4329") + ell3(sx - 1.6, sy - 0.8, 4.6, 1.8, "#7A4E30") + carrot(sx - 6, sy - 1.4, -12) + carrot(sx - 4, sy + 0.8, 8) + carrot(sx + 4.6, sy + 1.2, 196) + dot2(sx + 2.6, sy - 2.2, 3.2, "#79BE5C") + `<path d="M${f23(sx + 0.4)},${f23(sy - 2.6)} q2.2,-2.4 4.4,0 M${f23(sx + 1)},${f23(sy - 1.2)} q1.6,-1.4 3.2,0" stroke="#A6D98A" stroke-width="0.7" fill="none"/>` + dot2(sx - 1.4, sy - 2.6, 1.3, "#E86A8A") + dot2(sx + 0.4, sy + 1.2, 1.2, "#E86A8A") + poly2([base[3], base[2], rim[2], rim[3]], RED_PAINT.left, ` stroke="${OUT2}" stroke-width="0.6"`) + poly2([base[1], base[2], rim[2], rim[1]], RED_PAINT.right, ` stroke="${OUT2}" stroke-width="0.6"`) + `<polyline points="${[rim[1], rim[2], rim[3]].map(xy3).join(" ")}" fill="none" stroke="${RED_PAINT.top}" stroke-width="1.2" stroke-linejoin="round"/>` + wheel(T, 0.18, 0, 5, 0.06, "u", { rim: "#3D3A36", spokes: 6, width: 1.9 }) + ln3(T.p(0.06, 0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1) + leg(1) + handle(1);
    }, "draw")
  }]
};
var CROW = { body: "#33303A", breast: "#4A4652", wing: "#22202A", flip: true };
var flying = /* @__PURE__ */ __name((x, y, up2) => `<path d="M${f23(x - 4.4)},${f23(y + (up2 ? -2 : 1))} Q${f23(x - 2)},${f23(y - (up2 ? 2.6 : 0.4))} ${f23(x)},${f23(y)} Q${f23(x + 2)},${f23(y - (up2 ? 2.6 : 0.4))} ${f23(x + 4.4)},${f23(y + (up2 ? -2 : 1))}" stroke="${CROW.body}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(x, y + 0.2, 1, CROW.body), "flying");
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
      const tuft = /* @__PURE__ */ __name((cx, cy, s) => [-1, 0, 1].map((k) => ln3([cx, cy + k * 1.1], [cx + s * (3 + Math.abs(k) * 0.4), cy + k * 1.9 + sway * 0.8], STRAW.right, 0.8)).join(""), "tuft");
      const legTuft = /* @__PURE__ */ __name((cx) => [-1, 0, 1].map((k) => ln3([cx + k * 0.8, y - 6], [cx + k * 1.6, y - 2.8], STRAW.right, 0.8)).join(""), "legTuft");
      const crow = f >= 2 && f <= 6 ? bird(x + 9.4, sy - 0.4, { ...CROW, peck: f === 4 ? 1 : 0 }) : flying(x + (f === 7 ? 17 : f === 0 ? 20 : 14), sy - (f === 7 ? 9 : f === 0 ? 14 : 6), f !== 0);
      return ell3(x + 1, y + 0.4, 6, 1.8, "rgba(40,55,20,.25)") + `<rect x="${f23(x - 1)}" y="${f23(y - 40)}" width="2.2" height="40" fill="${WOOD_DARK.left}"/><rect x="${f23(x + 0.2)}" y="${f23(y - 40)}" width="1" height="40" fill="${WOOD_DARK.right}"/>` + legTuft(x - 2.4) + legTuft(x + 2.4) + `<path d="M${f23(x - 4.4)},${f23(y - 16)} L${f23(x + 4.4)},${f23(y - 16)} L${f23(x + 4)},${f23(y - 6)} L${f23(x + 0.8)},${f23(y - 6)} L${f23(x)},${f23(y - 11)} L${f23(x - 0.8)},${f23(y - 6)} L${f23(x - 4)},${f23(y - 6)} Z" fill="#5C83C2" stroke="${OUT2}" stroke-width="0.5"/><rect x="${f23(x + 1.3)}" y="${f23(y - 13.4)}" width="2.2" height="2.4" fill="#E2C66E" transform="rotate(8 ${f23(x + 2.4)} ${f23(y - 12.2)})"/><rect x="${f23(x - 13)}" y="${f23(sy - 0.4)}" width="26" height="4" rx="1.6" fill="#C8504A" stroke="${OUT2}" stroke-width="0.5"/><path d="M${f23(x - 5)},${f23(sy)} L${f23(x + 5)},${f23(sy)} L${f23(x + 4.6)},${f23(y - 15)} L${f23(x - 4.6)},${f23(y - 15)} Z" fill="#C8504A" stroke="${OUT2}" stroke-width="0.5"/>` + [-10, -7, -2.6, 0, 2.6, 7, 10].map((dx) => ln3([x + dx, sy + (Math.abs(dx) > 5 ? 0 : 0.6)], [x + dx, Math.abs(dx) > 5 ? sy + 3.4 : y - 15.4], "rgba(110,30,25,.5)", 0.6)).join("") + [sy + 1.8, sy + 6, sy + 9.4].map((ly, k) => ln3([x - (k ? 4.8 : 12.6), ly], [x + (k ? 4.8 : 12.6), ly], "rgba(255,214,120,.55)", 0.6)).join("") + ln3([x - 4.7, y - 16], [x + 4.7, y - 16], "#C9A16A", 1.1) + tuft(x - 13, sy + 1.6, -1) + tuft(x + 13, sy + 1.6, 1) + ln3([x - 2.4, sy - 0.6], [x + 2.4, sy - 0.6], "#C9A16A", 1) + ell3(x, sy - 5, 4.6, 5, "#E7C99A", ` stroke="${OUT2}" stroke-width="0.5"`) + `<path d="M${f23(x - 2.8)},${f23(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6 M${f23(x + 1.2)},${f23(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6" stroke="#3A2A1E" stroke-width="0.7"/><path d="M${f23(x - 2.6)},${f23(sy - 3)} q2.6,1.8 5.2,0" stroke="#3A2A1E" stroke-width="0.6" fill="none" stroke-dasharray="0.9 0.6"/><g transform="rotate(${f23(-6 + sway * 3)} ${f23(x)} ${f23(sy - 9)})">` + ell3(x, sy - 8.6, 8.6, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`) + `<path d="M${f23(x - 4.4)},${f23(sy - 9)} q0.4,-5.4 4.4,-5.4 q4,0 4.4,5.4 Z" fill="${STRAW.left}" stroke="${STRAW.right}" stroke-width="0.6"/><path d="M${f23(x - 4.3)},${f23(sy - 10.6)} q4.3,1.4 8.6,0" stroke="#C8504A" stroke-width="1.3" fill="none"/></g>` + crow;
    }, "draw")
  }]
};
var PUMPKIN_AT = [0.58, 0.3];
var leaf = /* @__PURE__ */ __name((x, y, a, s = 1) => `<path d="M0,0 q4,-5 9,-1 q-3,1 -2,4 q-4,-1 -7,-3 Z" fill="#5FA04A" stroke="#3F7A34" stroke-width="${f23(0.5 / s)}" transform="translate(${f23(x)} ${f23(y)}) rotate(${a}) scale(${s})"/>`, "leaf");
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
      const ribs = [[-8.4, 6.4, "#D9682A"], [8.4, 6.4, "#C85A22"], [-4.6, 7.6, "#EF8A3A"], [4.6, 7.6, "#E57A32"], [0, 8.2, "#F7A04A"]].map(([dx, rx, c]) => ell3(x + dx, cy, rx, 9.4, c, ' stroke="#A9481C" stroke-width="0.6"')).join("");
      const carving = `M${f23(x - 6)},${f23(cy - 1.6)} l2.6,-3.8 l2.4,3.8 Z M${f23(x + 1)},${f23(cy - 1.6)} l2.4,-3.8 l2.6,3.8 Z M${f23(x - 6.8)},${f23(cy + 2)} q6.8,6 13.6,0 l-2,0.4 l-1,1.6 l-1.6,-1 l-1.6,1.4 l-1.4,-1.4 l-1.6,1.2 l-1.4,-1.6 l-1.4,1.2 Z`;
      const sparks2 = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        const a = t * Math.PI * 3 + k * 2.1;
        return star(x + Math.cos(a) * (10 + t * 4), cy - 10 - t * 26, 1.4 + (1 - t) * 1.4, k % 2 ? "#FFF2B0" : "#FFD27A", 1 - t);
      }).join("");
      return ell3(x + 2, y + 0.6, 17, 4.6, "rgba(40,55,20,.25)") + leaf(x - 20, y + 1, -8) + leaf(x + 19, y + 2, 188) + leaf(x - 6, y + 4, 30, 0.8) + `<path d="M${f23(x + 16)},${f23(y + 1)} q4,-3 2,-6 q-2,-2 -3,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>` + ribs + `<path d="M${f23(x - 6)},${f23(cy - 6.4)} q6,-3 12,0" stroke="rgba(255,230,180,.45)" stroke-width="1.4" fill="none"/><path d="${carving}" fill="#5A2A10"/><path d="${carving}" fill="#FFD25A" opacity="${f23(lit2)}"/><path d="M${f23(x - 1)},${f23(cy - 8.6)} q-0.6,-4 2.6,-6.4 l1.4,1 q-2.4,2 -1.6,5.4 Z" fill="#6B8E3A" stroke="#4A6A28" stroke-width="0.5"/><path d="M${f23(x + 2.6)},${f23(cy - 14)} q4,-2 3.4,1.6 q-0.6,2.4 -2.6,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>` + leaf(x - 1, cy - 9, -150, 0.7) + sparks2;
    }, "draw")
  }]
};
var pioche = {
  layers: [{
    at: [0.16, 0.8],
    frame: [-16, -34, 34, 40],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 9);
      return T.shadow(0, 0, 0.16, 0.22) + T.box(-0.11, -0.09, 0.11, 0.09, 0, 6, STONE) + T.box(-0.07, -0.06, 0.08, 0.06, 6, 9, STONE) + T.pebble(0.15, 0.08, 2.2) + T.pebble(-0.14, 0.12, 1.8) + ln3([x - 1, y - 1], [x - 10, y - 21], WOOD.right, 2.3) + ln3([x - 1.4, y - 1], [x - 10.4, y - 21], WOOD.top, 0.7) + ln3([x - 8.6, y - 18], [x - 10.4, y - 21.6], "#5E3A22", 2.8) + `<path d="M${f23(x - 9)},${f23(y + 1)} Q${f23(x - 2)},${f23(y - 7)} ${f23(x + 7)},${f23(y + 2)}" stroke="${DARK_IRON.left}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${f23(x - 8.6)},${f23(y)} Q${f23(x - 2)},${f23(y - 7.6)} ${f23(x + 6.4)},${f23(y + 1)}" stroke="${IRON2.top}" stroke-width="1" fill="none" stroke-linecap="round"/><rect x="${f23(x - 3.2)}" y="${f23(y - 5.6)}" width="3.6" height="3.4" rx="0.8" fill="${DARK_IRON.right}" transform="rotate(-25 ${f23(x - 1.4)} ${f23(y - 4)})"/>` + T.box(0.02, 0, 0.1, 0.06, 6, 9, STONE) + `<path d="M${f23(x + 3)},${f23(y + 1.5)} l2,-1.2 l1.2,1.4 Z" fill="${STONE.right}"/>`;
    }, "draw")
  }]
};
var wagonnet = {
  layers: [{
    at: [0.76, 0.8],
    frame: [-24, -28, 48, 36],
    draw: /* @__PURE__ */ __name((T) => {
      let track2 = "";
      for (const du of [-0.18, 0, 0.18]) track2 += T.box(du - 0.025, -0.13, du + 0.025, 0.13, 0, 1.4, WOOD_DARK);
      track2 += ln3(T.p(-0.24, -0.07, 1.4), T.p(0.24, -0.07, 1.4), "#7C8894", 1.2) + ln3(T.p(-0.24, 0.07, 1.4), T.p(0.24, 0.07, 1.4), "#7C8894", 1.2);
      const l0 = T.p(-0.13, 0.085, 5);
      const r0 = T.p(0.13, 0.085, 5);
      const l1 = T.p(-0.17, 0.115, 15);
      const r1 = T.p(0.17, 0.115, 15);
      const top = [T.p(-0.17, -0.115, 15), T.p(0.17, -0.115, 15), r1, l1];
      const ore = [[-0.08, -0.02, 2.8, IRON2], [0.04, -0.05, 2.6, IRON2], [0, 0.04, 3, STONE], [0.09, 0.03, 2.2, IRON2], [-0.1, 0.05, 2.2, STONE]].map(([a, b, s, c]) => stone(...T.p(a, b, 16), s, c)).join("");
      const [gx, gy] = T.p(0.02, -0.01, 19);
      return T.shadow(0, 0, 0.2, 0.2) + track2 + wheel(T, -0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + wheel(T, 0.1, -0.1, 5, 0.055, "u", { rim: "#3D3A36", spokes: 4 }) + poly2([l0, r0, r1, l1], IRON2.left, ` stroke="${OUT2}" stroke-width="0.6"`) + poly2([r0, T.p(0.13, -0.085, 5), T.p(0.17, -0.115, 15), r1], IRON2.right, ` stroke="${OUT2}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON2.top}" stroke-width="0.9"`) + ore + `<path d="M${f23(gx)},${f23(gy - 2)} l1.6,2 l-1.6,2 l-1.6,-2 Z" fill="#F2C04B"/>` + dot2(gx - 0.4, gy - 0.6, 0.5, "#FFFFFF") + [0.25, 0.5, 0.75].map((k) => dot2(l1[0] + (r1[0] - l1[0]) * k, l1[1] + (r1[1] - l1[1]) * k + 1.6, 0.55, IRON2.right)).join("") + wheel(T, -0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 }) + wheel(T, 0.1, 0.1, 5, 0.055, "u", { rim: "#2A2724", spokes: 4 });
    }, "draw")
  }]
};
var LANTERN_AT = [-0.86, 0.5];
var lanterneMine = {
  light: /* @__PURE__ */ __name(() => [LANTERN_AT[0] + 0.2, LANTERN_AT[1], 24, 22], "light"),
  layers: [{
    at: LANTERN_AT,
    frame: [-12, -44, 34, 50],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, 0, 0.08, 0.2) + T.pebble(-0.04, 0.06, 2.4) + T.pebble(0.05, 0.05, 2) + T.box(-0.025, -0.025, 0.025, 0.025, 0, 37, WOOD_DARK) + T.box(-0.02, -0.018, 0.24, 0.018, 34, 37, WOOD) + ln3(T.p(0, 0, 25), T.p(0.11, 0, 35), WOOD_DARK.right, 1.4) + ln3(T.p(0.2, 0, 34), T.p(0.2, 0, 32), "#3D3A36", 1), "draw")
  }, {
    at: LANTERN_AT,
    frame: [-2, -40, 24, 26],
    n: 8,
    fps: 5,
    draw: /* @__PURE__ */ __name((T, level, f, n) => {
      const [hx, hy] = T.p(0.2, 0, 32);
      return `<g transform="rotate(${f23(wave(f, n, 7))} ${f23(hx)} ${f23(hy)})">` + ln3([hx, hy], [hx, hy + 3], "#3D3A36", 0.8) + `<path d="M${f23(hx - 3.2)},${f23(hy + 5)} L${f23(hx - 1.6)},${f23(hy + 3)} L${f23(hx + 1.6)},${f23(hy + 3)} L${f23(hx + 3.2)},${f23(hy + 5)} Z" fill="#3D3A36"/><rect x="${f23(hx - 3)}" y="${f23(hy + 5)}" width="6" height="7.4" fill="#FFE08A"/><rect x="${f23(hx + 0.4)}" y="${f23(hy + 5)}" width="2.6" height="7.4" fill="#E9BF4E"/>` + ell3(hx - 0.4, hy + 8.6, 1.3, 1.9, "#FFFDF0") + `<path d="M${f23(hx - 3)},${f23(hy + 5)} v7.4 M${f23(hx)},${f23(hy + 5)} v7.4 M${f23(hx + 3)},${f23(hy + 5)} v7.4" stroke="#3D3A36" stroke-width="0.7"/><rect x="${f23(hx - 3.6)}" y="${f23(hy + 12.2)}" width="7.2" height="1.6" rx="0.5" fill="#3D3A36"/></g>`;
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
      out += ln3(T.p(-0.1, -0.08, 1.5), T.p(-0.1, 0.06, 1.5), "#7C8894", 1.2) + ln3(T.p(0.1, -0.08, 1.5), T.p(0.1, 0.06, 1.5), "#7C8894", 1.2);
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
      const ore = [[-0.03, -0.06, 2.4, IRON2], [0.03, 0, 2.6, STONE], [-0.02, 0.06, 2.2, IRON2]].map(([a, b, s, c]) => stone(...T.p(a, b, 14), s, c)).join("");
      return T.shadow(0, 0, 0.14, 0.2, 1.5) + T.box(-0.075, -0.1, 0.075, 0.1, 4, 6, DARK_IRON) + T.face([[-0.075, 0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [-0.1, 0.13, 13]], IRON2.left, ` stroke="${OUT2}" stroke-width="0.6"`) + T.face([[0.075, -0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [0.1, -0.13, 13]], IRON2.right, ` stroke="${OUT2}" stroke-width="0.6"`) + poly2(top, "#2E2A26", ` stroke="${IRON2.top}" stroke-width="0.9"`) + ore + wheel(T, 0.09, -0.06, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn }) + wheel(T, 0.09, 0.07, 4, 0.045, "v", { rim: "#2A2724", spokes: 4, turn });
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
      return T.shadow(0, 0, 0.16, 0.2) + T.box(-0.09, -0.08, 0.09, 0.08, 0, 12, WOOD) + ln3(T.p(-0.08, 0.08, 1), T.p(0.08, 0.08, 11), WOOD_DARK.right, 1.1) + ln3(T.p(0.09, -0.07, 1), T.p(0.09, 0.07, 11), WOOD_DARK.right, 1.1) + [0, 1, 2].map((k) => ell3(rx, ry - k * 1.4, 4.8 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ln3([rx + 4, ry - 3], [rx + 7, ry - 1], "#C9A16A", 1.1) + ell3(gx, gy, 2.8, 3.6, CAST.left, ` stroke="${OUT2}" stroke-width="0.5"`) + ell3(gx - 0.8, gy - 1, 1, 1.6, CAST.top) + `<rect x="${f23(gx - 0.8)}" y="${f23(gy - 5.4)}" width="1.6" height="1.8" fill="#8B5631"/>` + gradient(T.id("hat"), "#FFD866", "#D9952A") + ell3(x, y + 0.4, 8.6, 2.8, "rgba(60,40,25,.5)") + ell3(x, y - 0.4, 8.2, 2.8, "#D99A2B", ` stroke="${OUT2}" stroke-width="0.5"`) + `<path d="M${f23(x - 6)},${f23(y - 0.8)} C${f23(x - 6.4)},${f23(y - 10.4)} ${f23(x + 6.4)},${f23(y - 10.4)} ${f23(x + 6)},${f23(y - 0.8)} Z" fill="url(#${T.id("hat")})" stroke="${OUT2}" stroke-width="0.6"/><path d="M${f23(x + 0.4)},${f23(y - 7.8)} q0.6,3.6 0.4,7" stroke="#C88A20" stroke-width="1.6" fill="none"/><rect x="${f23(x - 5.8)}" y="${f23(y - 6.6)}" width="3.8" height="3.6" rx="0.8" fill="${DARK_IRON.left}"/>` + ell3(x - 4.6, y - 4.8, 1.5, 1.5, "#FFF3B8") + dot2(x - 5, y - 5.3, 0.5, "#FFFFFF");
    }, "draw")
  }]
};
var GEODE_AT = [-0.92, 0.82];
var AMETHYST = ["#B98CF2", "#9466DA", "#DCC6FF", "#7F52C8"];
function crystals2(cx, cy, rx, ry, count, seed) {
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
    out += poly2([[bx - px, by - py], [tx, ty], [bx + px, by + py]], AMETHYST[k * 3 % 4]) + ln3([bx, by], [tx, ty], "rgba(255,255,255,.25)", 0.4);
  }
  return out;
}
__name(crystals2, "crystals");
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
      return ell3(x + 1, y + 0.6, 15, 4.4, "rgba(40,55,20,.24)") + gradient(T.id("shell"), STONE.left, STONE.right) + `<path d="M${f23(cx - 12)},${f23(cy + 2)} Q${f23(cx - 13)},${f23(cy - 9)} ${f23(cx - 2)},${f23(cy - 11)} Q${f23(cx + 11)},${f23(cy - 12)} ${f23(cx + 12.4)},${f23(cy)} Q${f23(cx + 12)},${f23(cy + 9)} ${f23(cx)},${f23(cy + 10)} Q${f23(cx - 11)},${f23(cy + 10)} ${f23(cx - 12)},${f23(cy + 2)} Z" fill="url(#${T.id("shell")})" stroke="${OUT2}" stroke-width="0.6"/><path d="M${f23(cx - 8.6)},${f23(cy)} Q${f23(cx - 8)},${f23(cy - 7.6)} ${f23(cx + 1)},${f23(cy - 7.2)} Q${f23(cx + 9.6)},${f23(cy - 6.6)} ${f23(cx + 9)},${f23(cy + 0.6)} Q${f23(cx + 8)},${f23(cy + 7)} ${f23(cx)},${f23(cy + 6.8)} Q${f23(cx - 8.4)},${f23(cy + 6)} ${f23(cx - 8.6)},${f23(cy)} Z" fill="#3B2550" stroke="#D9D2C6" stroke-width="1"/>` + crystals2(cx + 0.6, cy - 0.2, 7.8, 6.2, 16, 0.2) + prism(cx - 2.4, cy + 4, 6, 1.6, { left: "#C8A4F7", right: "#8A5CD4" }) + prism(cx + 1, cy + 4.6, 8.4, 2, { left: "#DCC6FF", right: "#9A6AE0" }) + prism(cx + 4, cy + 4, 5, 1.4, { left: "#B98CF2", right: "#7F52C8" }) + twinkle + ell3(hx, hy - 1, 7.4, 3.8, STONE.right, ` stroke="${OUT2}" stroke-width="0.5"`) + ell3(hx, hy - 1.8, 6.6, 3.2, "#E9E2D6") + ell3(hx, hy - 1.8, 5.8, 2.7, "#4A2E66") + crystals2(hx, hy - 1.8, 5.4, 2.4, 12, 0.5);
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
      const rune = `rgba(130,235,255,${f23(glowing)})`;
      const moss = /* @__PURE__ */ __name((du, dv, z, r) => T.disc(du, dv, z, r, "#6DB64C") + T.disc(du - 8e-3, dv - 8e-3, z + 0.6, r * 0.6, "#8FCB6A"), "moss");
      const arm = /* @__PURE__ */ __name((u0, u1, s) => T.box(u0, -0.05 + s, u1, 0.05 + s, 9 + b, 25 + b, ROCK) + T.box(u0 - 0.015, -0.065 + s, u1 + 0.015, 0.065 + s, 1 + b, 10 + b, ROCK), "arm");
      const shoulder = /* @__PURE__ */ __name((du, k) => {
        const [px, py] = T.p(du, 0, 26 + b);
        return stone(px, py, 4.6 + k, ROCK);
      }, "shoulder");
      const eye = /* @__PURE__ */ __name((du) => {
        const [ex, ey] = T.p(du, 0.07, 30 + b);
        return ell3(ex, ey, 1.5, 1, rune) + dot2(ex, ey, 0.5, "#F2FFFF");
      }, "eye");
      const ring = Array.from({ length: 16 }, (_, k) => T.p(Math.cos(k / 16 * Math.PI * 2) * 0.06, 0.09, 17 + b + Math.sin(k / 16 * Math.PI * 2) * 4.6));
      return T.shadow(0, 0, 0.28, 0.24) + T.pebble(0.26, 0.14, 2.4) + T.pebble(-0.24, 0.18, 1.8) + arm(-0.25, -0.155, sw) + T.box(-0.11, -0.05, -0.02, 0.05, 0, 9, ROCK) + T.box(0.02, -0.05, 0.11, 0.05, 0, 9, ROCK) + T.box(-0.15, -0.09, 0.15, 0.09, 8 + b, 27 + b, ROCK) + ln3(T.p(-0.12, 0.09, 24 + b), T.p(-0.07, 0.09, 20 + b), "rgba(60,50,40,.35)", 0.6) + ln3(T.p(0.15, -0.05, 12 + b), T.p(0.15, 0.03, 17 + b), "rgba(60,50,40,.35)", 0.6) + `<polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="rgba(130,235,255,${f23(glowing * 0.35)})" stroke-width="2.4"/><polygon points="${ring.map(xy3).join(" ")}" fill="none" stroke="${rune}" stroke-width="0.9"/>` + ln3(T.p(0, 0.09, 12 + b), T.p(0, 0.09, 22 + b), rune, 0.9) + ln3(T.p(-0.04, 0.09, 14 + b), T.p(0.04, 0.09, 20 + b), rune, 0.8) + shoulder(-0.13, 0) + T.box(-0.065, -0.05, 0.065, 0.07, 26 + b, 34 + b, ROCK) + eye(-0.032) + eye(0.028) + ln3(T.p(-0.03, 0.07, 27.4 + b), T.p(0.025, 0.07, 27 + b), "rgba(60,50,40,.45)", 0.7) + shoulder(0.14, 0.4) + arm(0.155, 0.25, -sw) + moss(-0.03, 0, 34 + b, 0.05) + moss(0.17, 0, 25 + b, 0.035) + moss(-0.11, -0.04, 27 + b, 0.035) + dot2(...T.p(-0.02, 0.01, 35.4 + b), 0.9, "#F7A8C8");
    }, "draw")
  }]
};
var hache = {
  layers: [{
    at: [-0.42, 0.84],
    frame: [-24, -32, 46, 38],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 9);
      const log = /* @__PURE__ */ __name((a, b, z) => T.box(a, b, a + 0.2, b + 0.065, z, z + 4.6, BARK) + ell3(...T.p(a + 0.2, b + 0.032, z + 2.3), 1.1, 1.6, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T.shadow(-0.1, 0.04, 0.2, 0.2) + log(-0.36, -0.06, 0) + log(-0.36, 0.01, 0) + log(-0.36, 0.08, 0) + log(-0.34, -0.025, 4.6) + log(-0.34, 0.045, 4.6) + T.cyl(0, 0, 0, 9, 0.11, STUMP, "block") + ell3(x, y, 3.4, 1.7, "none", ' stroke="#B98552" stroke-width="0.6"') + ell3(x, y, 1.4, 0.7, "none", ' stroke="#B98552" stroke-width="0.5"') + [-3, 0, 3].map((dx) => ln3([x + dx, y + 1.6], [x + dx + 0.4, y + 8], "rgba(60,40,25,.5)", 0.6)).join("") + ln3([x + 0.6, y - 1.6], [x + 9.5, y - 17], WOOD.right, 2) + ln3([x + 0.3, y - 1.8], [x + 9.2, y - 17.2], WOOD.top, 0.6) + `<path d="M${f23(x - 3.2)},${f23(y + 0.6)} L${f23(x + 3.6)},${f23(y - 1.2)} L${f23(x + 2.6)},${f23(y - 4.8)} L${f23(x - 2.2)},${f23(y - 4.6)} Q${f23(x - 4.4)},${f23(y - 2)} ${f23(x - 3.2)},${f23(y + 0.6)} Z" fill="${IRON2.left}" stroke="${IRON2.right}" stroke-width="0.6"/><path d="M${f23(x - 3.2)},${f23(y + 0.6)} Q${f23(x - 4.4)},${f23(y - 2)} ${f23(x - 2.2)},${f23(y - 4.6)}" stroke="${IRON2.top}" stroke-width="0.8" fill="none"/>` + [[6, 3], [-5, 4], [8, 1], [3, 5]].map(([dx, dy]) => `<path d="M${f23(x + dx)},${f23(y + 9 + dy)} l1.6,-0.6 l0.4,0.9 Z" fill="#E7C08A"/>`).join("");
    }, "draw")
  }]
};
var scie = {
  layers: [{
    at: [0.78, -0.74],
    frame: [-26, -34, 52, 40],
    draw: /* @__PURE__ */ __name((T) => {
      const leg = /* @__PURE__ */ __name((du, s) => ln3(T.p(du, -0.09 * s, 0), T.p(du, 0.09 * s, 14), WOOD_DARK.right, 2), "leg");
      const [b0x, b0y] = T.p(0.02, -0.13, 15);
      const [b1x, b1y] = T.p(0.02, 0.13, 15);
      const teeth = Array.from({ length: 9 }, (_, k) => `${k ? "L" : "M"}${f23(b0x + (b1x - b0x) * k / 8)},${f23(b0y + (b1y - b0y) * k / 8 + (k % 2 ? 1 : 0))}`).join(" ");
      const [dx, dy] = T.p(0.03, 0.02, 0);
      return T.shadow(0, 0, 0.24, 0.18) + ell3(dx, dy, 6, 2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + leg(-0.15, 1) + leg(-0.15, -1) + T.box(-0.26, -0.055, 0.24, 0.055, 12, 19, BARK) + ell3(...T.p(0.24, 0, 15.5), 1.6, 2.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + leg(0.15, 1) + leg(0.15, -1) + `<path d="${teeth}" stroke="${IRON2.right}" stroke-width="0.7" fill="none"/>` + ln3([b0x, b0y], [b1x, b1y], IRON2.left, 1.4) + ln3([b0x, b0y], [b0x + 1.5, b0y - 14], WOOD.right, 1.6) + ln3([b1x, b1y], [b1x + 1.5, b1y - 14], WOOD.right, 1.6) + ln3([b0x + 0.8, b0y - 7], [b1x + 0.8, b1y - 7], WOOD.left, 1.2) + ln3([b0x + 1.5, b0y - 14], [b1x + 1.5, b1y - 14], "#C9A16A", 0.7, ' stroke-dasharray="1 0.8"') + T.cyl(-0.3, 0.12, 0, 4, 0.06, STUMP, "round1") + T.cyl(-0.22, 0.16, 0, 3, 0.05, STUMP, "round2");
    }, "draw")
  }]
};
var nichoir = {
  layers: [{
    at: [0.86, 0.12],
    frame: [-14, -54, 28, 60],
    draw: /* @__PURE__ */ __name((T) => {
      const [hx, hy] = T.p(0, 0.065, 41);
      return T.shadow(0, 0, 0.08, 0.2) + T.pebble(0.04, 0.04, 2.2) + T.box(-0.02, -0.02, 0.02, 0.02, 0, 35, WOOD_DARK) + T.box(-0.07, -0.065, 0.07, 0.065, 35, 46, { top: "#FBF3DF", left: "#F3E4C4", right: "#D8C39B" }) + dot2(hx, hy, 2, "#3A2A1E") + ln3([hx, hy + 4], [hx - 2.4, hy + 5.2], WOOD_DARK.right, 1) + T.gable(-0.07, -0.065, 0.07, 0.065, 46, 8, { front: "#6FA3D9", back: "#4C7FB5", gable: "#D8C39B" }, 0.03) + `<path d="M${f23(hx - 4)},${f23(hy - 4)} l1.4,-1 l1.4,1" stroke="#F7A8C8" stroke-width="0.8" fill="none"/>`;
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
      const log = /* @__PURE__ */ __name((dv, z) => T.box(-0.22, dv - 0.035, 0.1, dv + 0.035, z, z + 5, BARK) + ell3(...T.p(0.1, dv, z + 2.5), 1.2, 1.8, "none", ' stroke="#C9935E" stroke-width="0.5"'), "log");
      return T.shadow(-0.04, 0, 0.3, 0.18) + wheel(T, -0.08, -0.13, 9, 0.12, "u", { rim: "#5E3A22", spokes: 8, width: 2 }) + ln3(T.p(0.1, -0.09, 10), T.p(0.42, -0.09, 1), WOOD.right, 1.6) + T.box(-0.24, -0.12, 0.12, 0.12, 9, 12, WOOD) + log(-0.07, 12) + log(0, 12) + log(0.07, 12) + log(-0.035, 17) + log(0.035, 17) + T.box(-0.24, 0.115, 0.12, 0.13, 12, 17, WOOD_DARK) + [-0.2, -0.04, 0.1].map((du) => T.box(du, 0.11, du + 0.025, 0.135, 9, 18, WOOD_DARK)).join("") + ln3(T.p(0.1, 0.09, 10), T.p(0.42, 0.09, 1), WOOD.right, 1.6) + ln3(T.p(0.1, 0.09, 10.6), T.p(0.42, 0.09, 1.6), WOOD.top, 0.6) + wheel(T, -0.08, 0.14, 9, 0.12, "u", { rim: "#4A2E1A", spokes: 8, width: 2.2 }) + T.disc(-0.08, 0.15, 9, 0.02, "#C9A16A");
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
      const blade = `M${f23(b0x)},${f23(b0y)} Q${f23((b0x + b1x) / 2)},${f23((b0y + b1y) / 2 + sag)} ${f23(b1x)},${f23(b1y)} L${f23(b1x)},${f23(b1y + 3)} Q${f23((b0x + b1x) / 2)},${f23((b0y + b1y) / 2 + sag + 5)} ${f23(b0x)},${f23(b0y + 3)} Z`;
      const teeth = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        const tx = b0x + (b1x - b0x) * t;
        const ty = b0y + (b1y - b0y) * t + 3 + (sag + 2) * 4 * t * (1 - t);
        return `${k ? "L" : "M"}${f23(tx)},${f23(ty + (k % 2 ? 1.2 : 0))}`;
      }).join(" ");
      const grip = /* @__PURE__ */ __name((gx, gy) => ln3([gx, gy + 1], [gx, gy - 8], WOOD.right, 2) + ln3([gx - 0.4, gy + 1], [gx - 0.4, gy - 8], WOOD.top, 0.6) + ln3([gx - 2.2, gy - 7], [gx + 2.2, gy - 7], WOOD_DARK.right, 1.4), "grip");
      const [dx, dy] = T.p(0.05, 0.14, 0);
      return T.shadow(0, 0, 0.3, 0.18) + T.box(-0.17, -0.09, -0.11, 0.09, 0, 3, WOOD_DARK) + T.box(0.11, -0.09, 0.17, 0.09, 0, 3, WOOD_DARK) + T.box(-0.34, -0.065, 0.3, 0.065, 3, 12, BARK) + ell3(...T.p(0.3, 0, 7.5), 2.2, 3.4, "none", ' stroke="#C9935E" stroke-width="0.6"') + ell3(...T.p(0.3, 0, 7.5), 0.9, 1.4, "none", ' stroke="#C9935E" stroke-width="0.5"') + [5.4, 8.2, 10.4].map((z, k) => ln3(T.p(-0.32 + k * 0.05, 0.065, z), T.p(0.26 - k * 0.04, 0.065, z + 0.3), "rgba(60,35,20,.3)", 0.6)).join("") + ln3(T.p(-0.3, -0.03, 12), T.p(0.26, -0.03, 12), "rgba(255,230,190,.35)", 0.8) + T.face([[0.05, 0.065, 12], [0.15, 0.065, 12], [0.1, 0.065, 7.4]], "#F1D3A1") + T.face([[0.05, -0.065, 12], [0.15, -0.065, 12], [0.15, 0.065, 12], [0.05, 0.065, 12]], "#E7C08A") + ell3(dx, dy, 6.4, 2.2, "#EBCB93") + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot2(dx + a, dy + b, 0.5, "#C9A16A")).join("") + `<path d="${blade}" fill="${IRON2.left}" stroke="${IRON2.right}" stroke-width="0.6"/><path d="${teeth}" stroke="${IRON2.right}" stroke-width="0.7" fill="none"/>` + ln3([b0x + 3, b0y + 0.8], [b1x - 3, b1y + 0.8], "rgba(255,255,255,.5)", 0.6) + grip(b0x, b0y) + grip(b1x, b1y);
    }, "draw")
  }]
};
var acorn = /* @__PURE__ */ __name((x, y, s = 1) => ell3(x, y, 1.6 * s, 1.9 * s, "#B98552") + `<path d="M${f23(x - 1.8 * s)},${f23(y - 0.8 * s)} q${f23(1.8 * s)},${f23(-2.2 * s)} ${f23(3.6 * s)},0 Z" fill="#7A4E30"/>` + ln3([x, y - 1.9 * s], [x + 0.4 * s, y - 2.8 * s], "#5E3A22", 0.5), "acorn");
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
      return T.shadow(0, 0, 0.13, 0.22) + T.cyl(0, 0, 0, 8, 0.1, STUMP, "stump") + ell3(sx, sy, 3, 1.4, "none", ' stroke="#B98552" stroke-width="0.6"') + ell3(sx, sy, 1.2, 0.6, "none", ' stroke="#B98552" stroke-width="0.5"') + acorn(...T.p(0.16, 0.06, 1.6)) + acorn(...T.p(0.1, 0.16, 1.6), 0.9) + `<path d="M${f23(x - 2)},${f23(y - 2)} C${f23(x - 9)},${f23(y - 2)} ${f23(x - 10 + tail)},${f23(y - 12)} ${f23(x - 6 + tail)},${f23(y - 17)} C${f23(x - 3 + tail)},${f23(y - 20)} ${f23(x + 1.4 + tail)},${f23(y - 16)} ${f23(x - 1 + tail * 0.6)},${f23(y - 13)} C${f23(x - 4)},${f23(y - 10)} ${f23(x - 4)},${f23(y - 5)} ${f23(x + 0.5)},${f23(y - 3)} Z" fill="#D9743A" stroke="#A9521F" stroke-width="0.5"/><path d="M${f23(x - 4)},${f23(y - 4)} C${f23(x - 8)},${f23(y - 6)} ${f23(x - 7 + tail)},${f23(y - 13)} ${f23(x - 4.6 + tail)},${f23(y - 15.6)}" stroke="#F2A266" stroke-width="1" fill="none"/>` + ell3(x + 0.6, y - 4.6, 3.6, 4.6, "#E0823F", ' stroke="rgba(120,50,20,.35)" stroke-width="0.5"') + ell3(x + 2, y - 4, 1.8, 3.2, "#F6D7B0") + ell3(x - 0.6, y - 1.6, 2.8, 1.8, "#C8662E") + dot2(x + 2.6, y - 10 + nib * 0.4, 2.8, "#E0823F") + `<path d="M${f23(x + 1.2)},${f23(y - 12)} l0.2,-3.2 l1.8,2.6 Z" fill="#C8662E"/>` + ln3([x + 1.4, y - 15.2], [x + 1, y - 16.4], "#A9521F", 0.6) + ell3(x + 3.8, y - 9 + nib * 0.4, 1.6, 1.2, "#F6D7B0") + dot2(x + 3.4, y - 10.8 + nib * 0.4, 0.65, "#1E1A17") + dot2(x + 5.2, y - 9.4 + nib * 0.4, 0.5, "#5E3A22") + acorn(x + 4.4, y - 6.6 + nib, 0.9) + ell3(x + 3.4, y - 6 + nib, 1, 0.8, "#C8662E") + ell3(x + 5.2, y - 6.2 + nib, 1, 0.8, "#C8662E");
    }, "draw")
  }]
};
var STAG_AT = [0.9, -0.3];
var antler = /* @__PURE__ */ __name((x, y, s, c, w = 1.2) => `<path d="M${f23(x)},${f23(y)} q${-1 * s},-5 ${2 * s},-9 q${2 * s},-3 ${1 * s},-7 M${f23(x + 0.5 * s)},${f23(y - 4)} q${-3 * s},-1 ${-4 * s},-4.4 M${f23(x + 1.6 * s)},${f23(y - 8.4)} q${-3 * s},-1 ${-3.6 * s},-4.2 M${f23(x + 2.2 * s)},${f23(y - 10.6)} q${2 * s},-1 ${3 * s},-4.2" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`, "antler");
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
      return ell3(x, y + 0.5, 11, 2.6, "rgba(40,55,20,.24)") + [[-5.4, 0, shade], [3.6, 0, shade], [-3, 0.8, coat], [6, 0.8, coat]].map(([dx, dy, c]) => ln3([x + dx, y - 10], [x + dx, y + dy - 0.6], c, 1.7) + `<rect x="${f23(x + dx - 0.9)}" y="${f23(y + dy - 1)}" width="1.8" height="1.4" fill="#5E4A3A"/>`).join("") + `<path d="M${f23(x + 8.6)},${f23(y - 14.4)} q${f % 2 ? 2.6 : 1.8},${f % 2 ? -1.6 : -2.4} 1.4,-3.6" stroke="${coat}" stroke-width="2" stroke-linecap="round" fill="none"/>` + ell3(x + 0.6, y - 12.6, 9.4, 4.8, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.6"') + ell3(x + 1.4, y - 9.6, 7, 1.6, shade) + `<path d="M${f23(x - 6)},${f23(y - 16)} L${f23(hx + 1)},${f23(hy - 1)} L${f23(hx + 3)},${f23(hy + 2)} L${f23(x - 4.6)},${f23(y - 10.4)} Z" fill="${coat}"/>` + antler(hx + 2.4, hy - 2.2, 1, "rgba(255,236,170,.35)", 3) + antler(hx + 2.4, hy - 2.2, 1, "#C8962E") + ell3(hx, hy, 3.8, 2.5, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.5"') + ell3(hx - 2.6, hy + 0.9, 1.9, 1.4, shade) + dot2(hx - 4.2, hy + 0.6, 0.8, "#5E4A3A") + dot2(hx - 0.6, hy - 0.6, 0.65, "#2A2420") + `<ellipse cx="${f23(hx + 3.2)}" cy="${f23(hy - 1.4)}" rx="2.4" ry="1" fill="${coat}" stroke="rgba(120,105,80,.3)" stroke-width="0.4" transform="rotate(${f === 1 ? -45 : -20} ${f23(hx + 3.2)} ${f23(hy - 1.4)})"/>` + antler(hx + 0.4, hy - 2, -1, "rgba(255,236,170,.35)", 3) + antler(hx + 0.4, hy - 2, -1, "#E9BF4E") + motes;
    }, "draw")
  }]
};
var seauCuivre = {
  layers: [{
    at: [0.3, 0.88],
    frame: [-14, -24, 28, 30],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 0);
      return ell3(x + 3, y + 1.4, 8, 2.4, "rgba(110,190,230,.45)") + ell3(x + 1.6, y + 0.6, 6.4, 2, "rgba(40,55,20,.2)") + bucket(T, 0, 0, 0, 10, 5, 6.6, COPPER3, "cb") + `<path d="M${f23(x - 6.6)},${f23(y - 10)} Q${f23(x)},${f23(y - 20)} ${f23(x + 6.6)},${f23(y - 10)}" stroke="${COPPER3.right}" stroke-width="1" fill="none"/>` + dot2(x - 6.6, y - 10, 0.8, COPPER3.right) + dot2(x + 6.6, y - 10, 0.8, COPPER3.right) + ln3([x - 3.6, y - 7.6], [x - 3.2, y - 2.2], "rgba(255,240,220,.5)", 1);
    }, "draw")
  }]
};
var poulie = {
  layers: [{
    at: { 1: [0.44, 0], 2: [0.84, 0.32] },
    frame: [-22, -50, 40, 56],
    draw: /* @__PURE__ */ __name((T, level) => {
      if (level === 1) {
        return wheel(T, 0.02, 0, 32.5, 0.2, "v", { rim: WOOD_DARK.right, spokes: 8, width: 1.8 }) + ln3(T.p(0.02, 0, 32.5), T.p(0.1, 0, 32.5), IRON2.right, 1.4) + ln3(T.p(0.1, 0, 32.5), T.p(0.1, 0, 26), WOOD.right, 1.6);
      }
      const [px, py] = T.p(-0.22, 0, 33);
      return T.shadow(0, 0, 0.08, 0.2) + T.box(-0.05, -0.05, 0.05, 0.05, 0, 3, STONE) + T.box(-0.022, -0.022, 0.022, 0.022, 3, 40, WOOD_DARK) + T.box(-0.26, -0.018, 0.02, 0.018, 37, 40, WOOD) + ln3(T.p(0, 0, 28), T.p(-0.1, 0, 38), WOOD_DARK.right, 1.3) + wheel(T, -0.22, 0, 34, 0.05, "u", { rim: IRON2.right, spokes: 4, width: 1.2 }) + ln3([px + 1.6, py], [px + 1.6, py + 14], "#8A6A4A", 0.7) + bucket(T, -0.22, 0, 17, 6, 3, 3.8, PAIL, "hb");
    }, "draw")
  }]
};
var abreuvoir = {
  layers: [{
    at: [-0.78, 0.66],
    frame: [-24, -18, 48, 26],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, 0, 0.2, 0.18) + T.box(-0.18, -0.075, 0.18, 0.075, 0, 7, STONE) + T.face([[-0.15, -0.05, 6.4], [0.15, -0.05, 6.4], [0.15, 0.05, 6.4], [-0.15, 0.05, 6.4]], "#5AAED7") + ln3(T.p(-0.1, -0.02, 6.4), T.p(0.04, -0.02, 6.4), "rgba(255,255,255,.6)", 0.8) + [[-0.16, 0.08], [0.1, 0.08], [0.19, 0]].map(([a, b]) => {
      const [x, y] = T.p(a, b, 0);
      return `<path d="M${f23(x - 2)},${f23(y)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`;
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
      return ell3(x, y + 0.4, 9, 2, "rgba(40,55,20,.25)") + [[-5, 0], [-2.4, 0.6], [3, 0], [5.4, 0.6]].map(([dx, dy]) => ln3([x + dx, y - 6], [x + dx, y + dy], "#9C8A78", 1.5) + `<rect x="${f23(x + dx - 0.9)}" y="${f23(y + dy - 0.8)}" width="1.8" height="1.2" fill="#3A2A1E"/>`).join("") + `<path d="M${f23(x + 7.4)},${f23(y - 11)} q2.6,${f23(-2 - tail)} 1.6,${f23(-4 - tail)}" stroke="#FBF6EA" stroke-width="2" stroke-linecap="round" fill="none"/>` + ell3(x + 0.6, y - 9.2, 8.2, 4.6, "#FBF6EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.6"') + ell3(x + 1, y - 6.6, 6.4, 1.8, "#E6DCC8") + `<path d="M${f23(x - 6)},${f23(y - 11)} L${f23(hx + 1.6)},${f23(hy - 1.4)} L${f23(hx + 2.4)},${f23(hy + 2.2)} L${f23(x - 5)},${f23(y - 7)} Z" fill="#FBF6EA"/>` + ell3(hx, hy, 3.7, 2.8, "#FBF6EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.6"') + `<path d="M${f23(hx + 0.6)},${f23(hy - 2.4)} q0.6,-4.4 3.6,-4.8 M${f23(hx - 0.8)},${f23(hy - 2.6)} q-0.2,-4.2 2,-5" stroke="#B8A27E" stroke-width="1.1" fill="none" stroke-linecap="round"/><ellipse cx="${f23(hx + 3.2)}" cy="${f23(hy - 1.2)}" rx="2.2" ry="1" fill="#FBF6EA" transform="rotate(${f === 3 ? -40 : -15} ${f23(hx + 3.2)} ${f23(hy - 1.2)})"/><path d="M${f23(hx - 2)},${f23(hy + 2.4)} l-0.4,2.6 l1.4,-1.8 Z" fill="#D9CCB4"/>` + dot2(hx - 3.2, hy + 0.4, 0.7, "#E9A3A3") + dot2(hx - 0.8, hy - 0.8, 0.65, "#2A2420");
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
      return T.shadow(0, 0.06, 0.16, 0.18) + T.box(-0.12, -0.1, 0.12, 0.1, 0, 3, STONE) + T.cyl(0, 0, 3, 25, 0.055, CAST, "body") + T.cyl(0, 0, 25, 27, 0.075, CAST, "cap") + dot2(kx, ky, 1.6, CAST.left) + `<path d="M${f23(sx - 1.6)},${f23(sy - 1)} L${f23(sx - 7)},${f23(sy + 1.4)} L${f23(sx - 7)},${f23(sy + 3.4)} L${f23(sx - 1.6)},${f23(sy + 1.6)} Z" fill="${CAST.right}"/>` + bucket(T, 0, 0.24, 0, 7, 3.4, 4.4, PAIL, "pb");
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
      return ln3([px - 4, py + 1 + a * 2.4], [px + 15, py + 6.6 - a * 9], CAST.right, 2) + ln3([px - 4, py + 0.4 + a * 2.4], [px + 15, py + 6 - a * 9], CAST.top, 0.6) + dot2(px + 15, py + 6.6 - a * 9, 1.4, CAST.left) + ln3([px - 3, py + 1 + a * 2.4], [px - 3, py + 4], CAST.right, 1) + dot2(px, py + 0.8, 1.2, CAST.top) + (flowing ? `<path d="M${f23(sx - 6.6)},${f23(sy + 3)} q-0.6,4 0,7.6" stroke="#8FD0F0" stroke-width="1.8" fill="none" stroke-linecap="round"/>` + ell3(sx - 6.6, sy + 11.2, 2.4, 0.9, "none", ' stroke="rgba(255,255,255,.75)" stroke-width="0.6"') : "");
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
        return dot2(x + (k - 1) * 3 * t, y - 1 - Math.sin(t * Math.PI) * 5, 0.8, `rgba(150,215,245,${f23(1 - t * 0.6)})`);
      }).join("");
      return ell3(x, y + 0.4, 7.6, 2.8, "rgba(110,190,230,.45)") + ell3(x, y + 0.2, 4.8, 1.7, "#5AAED7") + ell3(x, y + 0.2, 3 + ripple * 5, 1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f23(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T.pebble(-0.13, 0.04, 2) + T.pebble(0.11, 0.08, 1.8) + T.pebble(0.05, -0.11, 1.5) + [[-8, 1], [7, 2]].map(([dx, dy]) => `<path d="M${f23(x + dx - 2)},${f23(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("") + jet + ell3(cx, cy + 8, 5, 1.4, "rgba(255,240,180,.3)") + `<g transform="rotate(${f23(wave(f, n, 6, 1))} ${f23(cx)} ${f23(cy)})"><path d="M${f23(cx - 7)},${f23(cy - 6)} Q${f23(cx - 3)},${f23(cy - 2)} ${f23(cx)},${f23(cy + 2)} M${f23(cx + 7)},${f23(cy - 6)} Q${f23(cx + 3)},${f23(cy - 2)} ${f23(cx)},${f23(cy + 2)} L${f23(cx)},${f23(cy + 6)}" stroke="${WOOD.right}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f23(cx - 6.6)},${f23(cy - 6.4)} Q${f23(cx - 3)},${f23(cy - 2.6)} ${f23(cx - 0.4)},${f23(cy + 1.4)}" stroke="${WOOD.top}" stroke-width="0.5" fill="none"/>` + leaf(cx + 4.6, cy - 3.8, -50, 0.28) + "</g>";
    }, "draw")
  }]
};
function duck(x, y, s, flip, adult) {
  const d = flip ? -1 : 1;
  const X = /* @__PURE__ */ __name((dx) => f23(x + d * dx * s), "X");
  const Y = /* @__PURE__ */ __name((dy) => f23(y + dy * s), "Y");
  const body = adult ? "#FFFDF8" : "#FFE07A";
  const wing = adult ? "#E9DFCB" : "#F2C94E";
  return ell3(x - d * 3 * s, y + 0.4, 4 * s, 1.1 * s, "none", ' stroke="rgba(255,255,255,.65)" stroke-width="0.6"') + `<path d="M${X(-4.6)},${Y(-1.2)} L${X(-6)},${Y(-4.2)} L${X(-3)},${Y(-3)} Z" fill="${wing}"/><path d="M${X(-4.6)},${Y(-1.2)} Q${X(-5)},${Y(-4.6)} ${X(-1)},${Y(-4)} Q${X(3)},${Y(-3.8)} ${X(4)},${Y(-1.4)} Q${X(0)},${Y(0.6)} ${X(-4.6)},${Y(-1.2)} Z" fill="${body}" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/><path d="M${X(-2.6)},${Y(-2.6)} Q${X(-0.4)},${Y(-4.2)} ${X(1.8)},${Y(-2.4)} Q${X(-0.4)},${Y(-1.4)} ${X(-2.6)},${Y(-2.6)} Z" fill="${wing}"/><path d="M${X(1.6)},${Y(-3.4)} L${X(2.2)},${Y(-6.4)} L${X(3.6)},${Y(-6)} L${X(3.4)},${Y(-2.8)} Z" fill="${body}"/>` + dot2(x + d * 2.8 * s, y - 6.6 * s, 2 * s, body) + `<path d="M${X(4.4)},${Y(-6.8)} l${f23(d * 2.6 * s)},${f23(0.6 * s)} l${f23(-d * 2.6 * s)},${f23(0.8 * s)} Z" fill="#F08A3A"/>` + dot2(x + d * 3.4 * s, y - 7.2 * s, 0.5 * s, "#2A2420");
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
      const reed = /* @__PURE__ */ __name((dx, dy, k) => ln3([x + dx, y + dy], [x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 9 - k % 2 * 2], "#6FA35A", 0.8) + ell3(x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 8 - k % 2 * 2, 0.9, 2.2, "#8B5631"), "reed");
      const swimmers = [[0, 1.1, true], [0.8, 0.6, false], [1.4, 0.6, false]].map(([lag, s, adult]) => {
        const a = f / n * Math.PI * 2 - lag;
        return { y: y - 0.6 + Math.sin(a) * 3, svg: duck(x + Math.cos(a) * 8, y - 0.6 + Math.sin(a) * 3, s, Math.sin(a) > 0, adult) };
      }).sort((p, q) => p.y - q.y).map((p) => p.svg).join("");
      return ell3(x, y + 0.6, 16, 7.4, "#79BE5C") + ell3(x, y, 14, 6.2, "#5AAED7") + ell3(x - 3.6, y - 2, 6, 1.8, "rgba(255,255,255,.3)") + reed(-10, -3, 0) + reed(-8, -4.6, 1) + reed(8.6, -4.2, 2) + reed(10.8, -2.8, 3) + swimmers + T.pebble(0.22, 0.1, 1.8) + T.pebble(-0.16, 0.2, 1.6) + [[-12, 4], [11, 4.4]].map(([dx, dy]) => `<path d="M${f23(x + dx - 2)},${f23(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join("");
    }, "draw")
  }]
};
var NAIAD_AT = [-0.9, 0.1];
var MARBLE2 = { top: "#FFFFFF", left: "#ECEAF2", right: "#C3BFD0" };
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
      return T.shadow(0, 0, 0.24, 0.22) + T.cyl(0, 0, 0, 6, 0.22, MARBLE2, "basin") + T.disc(0, 0, 6, 0.19, "#7CC8EC") + ell3(wx - 3, wy - 1, 4, 1, "rgba(255,255,255,.45)") + T.box(-0.06, -0.06, 0.06, 0.06, 6, 17, MARBLE2) + gradient(marble, "#FFFFFF", "#C9C5D6") + `<path d="M${f23(x - 3.6)},${f23(y - 13)} L${f23(x + 3.4)},${f23(y - 13)} Q${f23(x + 5.4)},${f23(y - 5)} ${f23(x + 5.2)},${f23(y)} L${f23(x - 5)},${f23(y)} Q${f23(x - 5.4)},${f23(y - 6)} ${f23(x - 3.6)},${f23(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>` + [-2, 0.6, 3].map((dx) => `<path d="M${f23(x + dx * 0.6)},${f23(y - 12)} q${f23(dx * 0.3)},6 ${f23(dx * 0.8)},11.6" stroke="rgba(120,110,140,.3)" stroke-width="0.5" fill="none"/>`).join("") + `<path d="M${f23(x - 3)},${f23(y - 20)} L${f23(x + 3)},${f23(y - 20)} L${f23(x + 3.4)},${f23(y - 13)} L${f23(x - 3.6)},${f23(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/><path d="M${f23(x + 2.8)},${f23(y - 19.4)} q2.6,3 0.6,6.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + dot2(x, y - 23, 2.7, "#F4F2F8") + dot2(x + 1.6, y - 24.6, 1.6, "#E4E1EC") + `<path d="M${f23(x + 2)},${f23(y - 23)} q1.4,3 0.4,5" stroke="#DAD6E4" stroke-width="1" fill="none"/><path d="M${f23(x - 2.6)},${f23(y - 19.4)} q-2.8,1.6 -2.4,4.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/><g transform="rotate(-38 ${f23(ux)} ${f23(uy)})">${ell3(ux, uy, 2.6, 3.2, "#E4E1EC", ' stroke="rgba(90,80,110,.4)" stroke-width="0.5"')}<rect x="${f23(ux - 1.3)}" y="${f23(uy - 4.8)}" width="2.6" height="1.8" fill="#DAD6E4"/></g><path d="M${f23(ux - 3.6)},${f23(uy - 2)} Q${f23(ux - 6)},${f23(uy + 2)} ${f23(ux - 5.4)},${f23(wy - 1)}" stroke="rgba(170,225,255,.45)" stroke-width="3" fill="none"/><path d="M${f23(ux - 3.6)},${f23(uy - 2)} Q${f23(ux - 6)},${f23(uy + 2)} ${f23(ux - 5.4)},${f23(wy - 1)}" stroke="#E8F7FF" stroke-width="1.2" fill="none" stroke-dasharray="2.2 1.4" stroke-dashoffset="${f23(-f * 0.9)}"/>` + ell3(ux - 5.4, wy - 0.6, 1.6 + ripple * 4, 0.6 + ripple * 1.4, "none", ` stroke="rgba(255,255,255,${f23(0.85 - ripple * 0.75)})" stroke-width="0.6"`);
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
      return ell3(ox, oy + 0.6, 3 + ripple * 5, 1.1 + ripple * 1.8, "none", ` stroke="rgba(255,255,255,${f23(0.8 - ripple * 0.7)})" stroke-width="0.7"`) + `<path d="M${f23(tx)},${f23(ty)} Q${f23((tx + ox) / 2 + 2)},${f23((ty + oy) / 2 + 2)} ${f23(ox)},${f23(oy - 1 + dip)}" stroke="rgba(255,255,255,.8)" stroke-width="0.5" fill="none"/>` + dot2(ox, oy - 1.4 + dip, 1.9, "#E2463A") + `<path d="M${f23(ox - 1.9)},${f23(oy - 1.4 + dip)} a1.9,1.9 0 0 0 3.8,0 Z" fill="#FFFDF8"/>` + ln3([ox, oy - 3.2 + dip], [ox, oy - 4.8 + dip], "#3D3A36", 0.6) + bucket(T, c.pail[0], c.pail[1], 10, 6, 3.4, 4.2, PAIL, "pail", false) + `<path d="M${f23(px - 1)},${f23(py - 6.4)} l${f23(-2.4 + f % 2 * 1.2)},-3.4 l2.6,0.8 Z" fill="#9FB8C8"/>` + ell3(px + 1, py - 6.2, 2, 0.9, "#C7D6E0") + T.box(-0.02, -0.02, 0.02, 0.02, 10, 15, WOOD_DARK) + `<path d="M${f23(bx)},${f23(by - 3)} Q${f23((bx + tx) / 2 - 1.5)},${f23((by + ty) / 2 - 3)} ${f23(tx)},${f23(ty)}" stroke="${WOOD_DARK.right}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(bx + (tx - bx) * 0.18, by - 3 + (ty - by) * 0.16, 1.4, "#3D3A36");
    }, "draw")
  }]
};
var filet = {
  layers: [{
    at: { 1: [0.34, -0.06], 2: [0.6, -0.04] },
    frame: [-18, -24, 36, 28],
    draw: /* @__PURE__ */ __name((T) => {
      const [x, y] = T.p(0, 0, 10);
      const heap = `M${f23(x - 11)},${f23(y + 1)} Q${f23(x - 10)},${f23(y - 6)} ${f23(x - 4)},${f23(y - 7)} Q${f23(x + 1)},${f23(y - 11)} ${f23(x + 6)},${f23(y - 6)} Q${f23(x + 11)},${f23(y - 4)} ${f23(x + 10)},${f23(y + 1.5)} Q${f23(x)},${f23(y + 4.5)} ${f23(x - 11)},${f23(y + 1)} Z`;
      let mesh = "";
      for (let k = -14; k <= 14; k += 2.6) mesh += ln3([x + k - 6, y + 4], [x + k + 4, y - 11], "rgba(120,85,45,.55)", 0.5) + ln3([x + k + 6, y + 4], [x + k - 4, y - 11], "rgba(120,85,45,.55)", 0.5);
      const floats = [[-9, 0], [-4, 2.6], [2, 3], [8, 0.6]].map(([dx, dy], k) => ell3(x + dx, y + dy, 2, 1.4, k % 2 ? "#FFFDF8" : "#F08A3A", ` stroke="${OUT2}" stroke-width="0.5"`)).join("");
      return ell3(x + 1, y + 2.6, 12, 3, "rgba(40,30,20,.22)") + `<defs><clipPath id="${T.id("net")}"><path d="${heap}"/></clipPath></defs><path d="${heap}" fill="#D9BC8C" stroke="#A88350" stroke-width="0.8"/><g clip-path="url(#${T.id("net")})">${mesh}<path d="M${f23(x - 8)},${f23(y - 1)} q7,-4 15,0" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none"/></g><path d="M${f23(x - 1)},${f23(y - 5.4)} q3,-2 6,0 q-3,2 -6,0 Z M${f23(x + 5)},${f23(y - 5.4)} l2,-1.6 l0,3.2 Z" fill="#B8CCD8"/>` + dot2(x + 0.6, y - 5.6, 0.4, "#2A2420") + floats;
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
      return T.shadow(0, 0, 0.14, 0.2) + T.box(-0.1, -0.08, 0.1, 0.08, 0, 12, { top: "rgba(58,42,30,.85)", left: "rgba(58,42,30,.85)", right: "rgba(40,28,20,.85)" }, "") + T.face([[-0.03, 0.08, 3], [0.04, 0.08, 3], [0.04, 0.08, 9], [-0.03, 0.08, 9]], "rgba(200,170,120,.5)") + slatL + slatR + T.box(-0.1, -0.08, 0.1, 0.08, 11, 12.5, WOOD) + [-0.04, 0.03].map((du) => T.face([[du, -0.08, 12.5], [du + 0.025, -0.08, 12.5], [du + 0.025, 0.08, 12.5], [du, 0.08, 12.5]], WOOD_DARK.top)).join("") + `<path d="M${f23(rx)},${f23(ry)} Q${f23(bx - 4)},${f23(by - 1)} ${f23(bx - 2)},${f23(by - 1)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + ell3(bx, by - 1.6, 3.4, 2.4, "#E2463A", ` stroke="${OUT2}" stroke-width="0.5"`) + `<path d="M${f23(bx - 3.4)},${f23(by - 1.6)} h6.8" stroke="#FFFDF8" stroke-width="1.4"/>`;
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
      const legs = [-1, 1].map((s) => [0, 1, 2].map((k) => ln3([x + s * 2.4, y - 2.6 + k * 0.9], [x + s * (5.4 + (f + k) % 2 * 0.8), y - 0.6 + k * 0.8], "#C2412E", 0.7)).join("")).join("");
      return ell3(x, y + 0.2, 5, 1.3, "rgba(40,30,20,.25)") + legs + ell3(x, y - 3.6, 4.4, 2.8, "#E2573F", ' stroke="rgba(120,30,20,.5)" stroke-width="0.5"') + ell3(x - 1.2, y - 4.6, 1.6, 0.8, "#F28A72") + [-1, 1].map((s) => `<path d="M${f23(x + s * 3.6)},${f23(y - 4.6)} q${s * 1.6},${f23(-1.6 - claw)} ${s * 2.6},${f23(-2.4 - claw)}" stroke="#E2573F" stroke-width="1.2" fill="none"/><path d="M${f23(x + s * 6.2)},${f23(y - 7 - claw)} l${s * 1.2},-1.4 l${s * 0.4},1.6 l${-s * 0.8},0.2 Z" fill="#E2573F"/>`).join("") + ln3([x - 1.2, y - 6], [x - 1.4, y - 7.8], "#2A2420", 0.5) + ln3([x + 1.2, y - 6], [x + 1.4, y - 7.8], "#2A2420", 0.5) + dot2(x - 1.4, y - 8, 0.6, "#1E1A17") + dot2(x + 1.4, y - 8, 0.6, "#1E1A17");
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
      const oar = /* @__PURE__ */ __name((s) => {
        const lock = T.p(0, 0.1 * s, 6);
        const lift = Math.sin(phase) > 0 ? 3 : 0;
        const blade = T.p(Math.cos(phase) * 0.09, 0.27 * s, lift);
        return ln3(lock, blade, WOOD_DARK.right, 1.2) + ell3(blade[0], blade[1], 2.6, 1, WOOD.left, ` transform="rotate(-26 ${f23(blade[0])} ${f23(blade[1])})"`) + (lift ? "" : ell3(blade[0], blade[1] + 1.4, 3.6, 1.1, "none", ' stroke="rgba(255,255,255,.7)" stroke-width="0.6"'));
      }, "oar");
      const [rx, ry] = T.p(-0.03, 0, 6);
      const lean = Math.cos(phase) * 1.2;
      return ell3(...T.p(0.01, 0.01, 0), 15, 3.4, "rgba(30,70,110,.25)") + oar(-1) + poly2(rim, WOOD_DARK.top, ` stroke="${OUT2}" stroke-width="0.7"`) + T.face([[-0.02, -0.1, 4], [0.03, -0.1, 4], [0.03, 0.1, 4], [-0.02, 0.1, 4]], WOOD.top) + `<path d="M${f23(rx - 3.2 + lean)},${f23(ry - 1)} L${f23(rx + 3.2 + lean)},${f23(ry - 1)} L${f23(rx + 2.6 + lean)},${f23(ry - 9)} L${f23(rx - 2.6 + lean)},${f23(ry - 9)} Z" fill="#5C83C2"/>` + ln3([rx - 2.4 + lean, ry - 7.4], [rx - 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + ln3([rx + 2.4 + lean, ry - 7.4], [rx + 6 + lean * 2, ry - 3.6], "#F1C9A5", 1.2) + dot2(rx + lean, ry - 11.2, 2.6, "#F1C9A5") + ell3(rx + lean, ry - 12.6, 5, 1.4, "#E9BF4E") + `<path d="M${f23(rx - 2.6 + lean)},${f23(ry - 12.8)} q2.6,-3.4 5.2,0 Z" fill="#E9BF4E"/>` + ln3([rx - 2.6 + lean, ry - 12.9], [rx + 2.6 + lean, ry - 12.9], "#C8504A", 0.8) + poly2(side, WOOD.left, ` stroke="${OUT2}" stroke-width="0.7"`) + `<polyline points="${[T.p(0.19, 0, 2.4), T.p(0.08, 0.085, 2.2), T.p(-0.09, 0.085, 2.2), T.p(-0.18, 0, 2.6)].map(xy3).join(" ")}" fill="none" stroke="#3C2819" stroke-width="0.6"/>` + oar(1);
    }, "draw")
  }]
};
var harpon = {
  layers: [{
    at: [0.5, -0.92],
    frame: [-26, -30, 52, 36],
    draw: /* @__PURE__ */ __name((T) => {
      const post = /* @__PURE__ */ __name((du) => T.box(du - 0.016, -0.016, du + 0.016, 0.016, 0, 14, WOOD_DARK) + ln3(T.p(du, 0, 14), T.p(du - 0.03, 0, 17.4), WOOD_DARK.right, 1.2) + ln3(T.p(du, 0, 14), T.p(du + 0.03, 0, 17.4), WOOD_DARK.right, 1.2), "post");
      const tip = T.p(0.32, 0, 15.6);
      const neck = T.p(0.22, 0, 15.2);
      const [cx, cy] = T.p(-0.14, 0.15, 0);
      const [fx, fy] = T.p(0.12, 0.14, 0);
      const [ex, ey] = T.p(-0.3, 0, 15.6);
      return T.shadow(0, 0.04, 0.26, 0.16) + post(-0.15) + post(0.13) + ln3(T.p(-0.3, 0, 15.6), neck, WOOD.right, 1.6) + ln3(T.p(-0.3, 0, 16.2), neck, WOOD.top, 0.5) + poly2([T.p(0.22, 0, 16.4), tip, T.p(0.22, 0, 14)], IRON2.left, ` stroke="${IRON2.right}" stroke-width="0.5"`) + ln3(T.p(0.25, 0, 15.4), T.p(0.2, 0, 19), IRON2.right, 1) + ln3(T.p(0.25, 0, 15.2), T.p(0.21, 0, 12), IRON2.right, 1) + `<path d="M${f23(ex)},${f23(ey)} C${f23(ex - 4)},${f23(ey + 5)} ${f23(cx - 7)},${f23(cy - 5)} ${f23(cx - 3)},${f23(cy - 2)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>` + [0, 1, 2].map((k) => ell3(cx, cy - k * 1.3, 5 - k * 0.6, 2 - k * 0.2, "none", ' stroke="#C9A16A" stroke-width="1.3"')).join("") + ell3(fx, fy - 2, 3, 2.2, "#D9A877", ` stroke="${OUT2}" stroke-width="0.5"`) + ell3(fx, fy - 2.6, 2, 1.1, "#E7C08A");
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
      return ell3(x, y + 0.4, 5 + ripple * 4, 1.6 + ripple * 1.2, "none", ` stroke="rgba(255,255,255,${f23(0.8 - ripple * 0.7)})" stroke-width="0.6"`) + T.cyl(0, 0, 0, 14, 0.06, WOOD, "post") + ell3(...T.p(0, 0, 9), 3.6, 1.6, "none", ' stroke="#C9A16A" stroke-width="1.2"') + ln3([px - 1.6, py - 3], [px - 1.8, py], "#E8A13A", 1) + ln3([px + 1, py - 3], [px + 1.2, py], "#E8A13A", 1) + `<path d="M${f23(px + 4)},${f23(py - 6)} l4,1.4 l-3.4,1.6 Z" fill="#D9D4CA"/>` + (stretch ? `<path d="M${f23(px + 1)},${f23(py - 9)} q5,-9 11,-8 q-3,3 -4,7 Z" fill="#E9E4DA" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/><path d="M${f23(px + 10)},${f23(py - 16.6)} q1.4,-0.4 2,0.6 l-2.6,1.8 Z" fill="#3D3A36"/>` : "") + ell3(px - 0.4, py - 6.4, 6.4, 4.6, "#F4F1EA", ' stroke="rgba(60,40,25,.5)" stroke-width="0.5"') + ell3(px + 0.6, py - 6.6, 4.8, 2.8, "#DEDAD0") + `<path d="M${f23(px + 3.6)},${f23(py - 5.4)} l2.4,0.6 l-2.2,1.2 Z" fill="#3D3A36"/><path d="M${f23(px - 4)},${f23(py - 9)} Q${f23(px - 7)},${f23(py - 13)} ${f23(hx + 0.4)},${f23(hy + 1.6)}" stroke="#F4F1EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + dot2(hx, hy, 2.8, "#F4F1EA") + `<path d="M${f23(hx + 0.6)},${f23(hy - 2.6)} q2.4,-1.6 3.4,0.4" stroke="#F2D35A" stroke-width="1" fill="none"/><path d="M${f23(hx - 1.6)},${f23(hy + 0.6)} Q${f23((hx + tipX) / 2)},${f23((hy + tipY) / 2 + 3 + pouch * 4)} ${f23(tipX)},${f23(tipY + 0.6)} L${f23(tipX + 0.4)},${f23(tipY)} Z" fill="#F2B04A" stroke="#C88A20" stroke-width="0.5"/>` + ln3([hx - 1.4, hy - 0.4], [tipX, tipY], "#E8A13A", 1.4) + (f === 2 ? `<path d="M${f23(tipX - 0.6)},${f23(tipY - 0.6)} l-2,-1.8 l0.6,2.6 Z" fill="#9FB8C8"/>` : "") + dot2(hx - 0.6, hy - 0.8, 0.6, "#2A2420");
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
      return ell3(x, y + 1, 15 + ripple * 4, 4.4 + ripple * 1.2, "none", ` stroke="rgba(255,255,255,${f23(0.75 - ripple * 0.65)})" stroke-width="0.7"`) + ell3(x + 1, y + 0.6, 13, 3.6, "rgba(30,70,110,.25)") + stone(x - 2, y - 4, 10.6, STONE) + stone(x + 7, y - 1.4, 5.4, STONE) + `<path d="M${f23(x - 9)},${f23(y - 1)} q-1,-4 1,-7 M${f23(x - 7)},${f23(y)} q1,-3 -0.4,-6" stroke="#4E9A5A" stroke-width="1" fill="none"/><path d="M${f23(mx - 3)},${f23(my - 16)} Q${f23(mx - 7 + sway)},${f23(my - 9)} ${f23(mx - 5.6 + sway)},${f23(my - 2)} L${f23(mx - 2)},${f23(my - 3)} Q${f23(mx - 3)},${f23(my - 10)} ${f23(mx + 1)},${f23(my - 15)} Z" fill="${hair}"/><path d="M${f23(mx - 3.4)},${f23(my - 4)} Q${f23(mx + 6)},${f23(my - 3)} ${f23(mx + 8)},${f23(my + 4)} Q${f23(mx + 9.6)},${f23(my + 9)} ${f23(mx + 12)},${f23(my + 10 + flick)} L${f23(mx + 10)},${f23(my + 11 + flick * 0.5)} Q${f23(mx + 6)},${f23(my + 8)} ${f23(mx + 4.6)},${f23(my + 3)} Q${f23(mx + 3)},${f23(my)} ${f23(mx - 3)},${f23(my + 0.4)} Z" fill="${tail}" stroke="#23806F" stroke-width="0.5"/>` + [[1, -1.4], [3.6, -0.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${f23(mx + dx - 1)},${f23(my + dy)} q1,-1 2,0" stroke="#7FDCCB" stroke-width="0.5" fill="none"/>`).join("") + `<path d="M${f23(mx + 12)},${f23(my + 10 + flick)} q3,-3 4.6,-1.6 q-1.6,2.4 -1.4,4.2 q-2,-0.4 -3.2,-2.6 Z" fill="#5FD0BE" stroke="#23806F" stroke-width="0.5"/>` + (flick ? [[15, 2], [17, 5], [13, 6]].map(([dx, dy]) => dot2(mx + dx, my + dy, 0.7, "rgba(220,245,255,.9)")).join("") : "") + `<path d="M${f23(mx - 3.4)},${f23(my - 4)} L${f23(mx - 2.6)},${f23(my - 12)} L${f23(mx + 2.6)},${f23(my - 12)} L${f23(mx + 2.4)},${f23(my - 3.6)} Z" fill="#F6CFAE" stroke="rgba(120,70,40,.3)" stroke-width="0.5"/>` + ell3(mx - 1.2, my - 9.6, 1.4, 1.1, "#F28AA8") + ell3(mx + 1.4, my - 9.6, 1.4, 1.1, "#F28AA8") + `<path d="M${f23(mx + 2.4)},${f23(my - 11.4)} q3,-1 3.4,-5" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/><rect x="${f23(mx + 4.2 + sway * 0.4)}" y="${f23(my - 19)}" width="3" height="1.4" rx="0.4" fill="#F2C04B" transform="rotate(-20 ${f23(mx + 5.7)} ${f23(my - 18.3)})"/><path d="M${f23(mx - 2.4)},${f23(my - 11)} q-2.6,3 -1,5.6" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot2(mx - 3.2, my - 5, 1.6, "#FFFFFF") + dot2(mx - 3.6, my - 5.5, 0.5, "#E8F7FF") + dot2(mx, my - 15, 2.6, "#F6CFAE") + `<path d="M${f23(mx - 2.8)},${f23(my - 15)} Q${f23(mx - 2)},${f23(my - 19.4)} ${f23(mx + 2.8)},${f23(my - 16.4)} Q${f23(mx + 4.4)},${f23(my - 13)} ${f23(mx + 3.6 + sway)},${f23(my - 9)}" stroke="${hair}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${f23(mx - 1.4)},${f23(my - 15.4)} q0.6,0.5 1.2,0" stroke="#5E3A22" stroke-width="0.5" fill="none"/>` + dot2(mx - 0.4, my - 13.4, 0.4, "#E07A7A");
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
      const curl = /* @__PURE__ */ __name((dx, dy, w) => `<path d="M${f23(x + dx)},${f23(y + dy - 1)} a1.2,1 0 1 1 1.2,1" stroke="#E7C08A" stroke-width="${w}" fill="none"/>`, "curl");
      return T.shadow(0, 0, 0.22, 0.18) + legs + T.box(-0.13, -0.05, 0.13, 0.05, 3, 4.5, WOOD_DARK) + T.box(-0.1, -0.035, 0.06, 0.035, 4.5, 7, { top: "#F1D3A1", left: "#D9B07A", right: "#B98552" }) + T.box(-0.17, -0.08, 0.17, 0.08, 11, 14, { top: "#EBC08A", left: WOOD.left, right: WOOD.right }) + T.box(0.13, 0.05, 0.19, 0.1, 9, 15.5, DARK_IRON) + ln3(T.p(0.16, 0.1, 12), T.p(0.16, 0.18, 12), IRON2.top, 0.9) + T.box(-0.08, -0.03, 0, 0.01, 14, 16.5, WOOD) + T.face([[-0.05, -0.03, 16.5], [-0.035, -0.03, 16.5], [-0.035, 0.01, 18], [-0.05, 0.01, 18]], IRON2.right) + ln3([x + 2, y - 0.6], [x + 9, y - 3.6], WOOD.right, 1.3) + `<rect x="${f23(x + 1)}" y="${f23(y - 2.6)}" width="3.6" height="2.2" rx="0.4" fill="${DARK_IRON.left}" transform="rotate(-22 ${f23(x + 2.8)} ${f23(y - 1.5)})"/>` + curl(-8, 1, 0.6) + curl(-5, 3, 0.6) + curl(4, 2.2, 0.6) + curl(-10, 15, 0.7) + curl(6, 16, 0.7) + curl(11, 14, 0.7);
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
      return T.shadow(0, 0, 0.17, 0.2) + T.cyl(0, 0, 0, 9, 0.12, STUMP, "stump") + [-4, -1, 2, 5].map((dx) => ln3([bx + dx, by - 1], [bx + dx * 0.95, by - 8], "rgba(60,40,25,.5)", 0.6)).join("") + T.box(-0.07, -0.05, 0.07, 0.05, 9, 11, DARK_IRON) + T.box(-0.035, -0.03, 0.035, 0.03, 11, 15, DARK_IRON) + T.box(-0.11, -0.05, 0.08, 0.05, 15, 18.5, steel) + T.face([[0.08, 0.05, 15], [0.18, 0, 17.4], [0.08, 0.05, 18.5]], steel.left, EDGE) + T.face([[0.08, -0.05, 18.5], [0.18, 0, 17.6], [0.08, 0.05, 18.5]], steel.top, EDGE) + T.face([[0.08, -0.05, 15], [0.18, 0, 17.4], [0.08, -0.05, 18.5]], steel.right) + ln3(T.p(-0.09, -0.02, 18.6), T.p(0.06, -0.02, 18.6), "rgba(255,255,255,.55)", 0.7) + ln3([hx, hy - 1], [hx + 3, hy - 12], WOOD.right, 1.5) + `<rect x="${f23(hx + 0.4)}" y="${f23(hy - 15)}" width="5.6" height="3" rx="0.6" fill="${DARK_IRON.left}" transform="rotate(16 ${f23(hx + 3)} ${f23(hy - 13.5)})"/>`;
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
      const rot = ` transform="rotate(-8 ${f23(x)} ${f23(y)})"`;
      return `<rect x="${f23(x - 4.6)}" y="${f23(y - 1.6)}" width="9" height="2.2" rx="1" fill="#E2463A"${rot}/><rect x="${f23(x - 3.4)}" y="${f23(y - 1.3)}" width="6.4" height="1.2" rx="0.6" fill="#FFB347" opacity="${f23(heat)}"${rot}/><rect x="${f23(x - 2)}" y="${f23(y - 1.1)}" width="3.4" height="0.7" rx="0.35" fill="#FFF2B0" opacity="${f23(heat)}"${rot}/><path d="M${f23(x - 2)},${f23(y - 4)} q1.4,${f23(-2 - heat)} 0,-5 M${f23(x + 2)},${f23(y - 4)} q-1.4,${f23(-2 - heat)} 0,-5.4" stroke="rgba(255,255,255,${f23(0.18 * heat)})" stroke-width="1" fill="none"/>` + (spark ? [[-5, -6], [4, -8], [7, -4], [-2, -10]].map(([dx, dy], k) => dot2(x + dx * (1 + f * 0.5), y + dy * (1 + f * 0.4), 0.9 - f * 0.3, k % 2 ? "#FFE07A" : "#F7A23B")).join("") : "");
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
      const pleats = vis.map((i) => ln3([lower[i][0], lower[i][1] - open * 0.5], [upper[i][0], upper[i][1] + open * 0.2], "rgba(60,30,15,.45)", 0.5)).join("");
      const puff = f >= 1 && f <= 3;
      const [nx, ny] = T.p(0, -0.24, 8.5);
      const [cx, cy] = T.p(0, 0.04, z0 + open);
      return T.shadow(0, 0.02, 0.14, 0.2) + T.box(-0.08, 0.06, -0.05, 0.09, 0, z0, WOOD_DARK) + T.box(0.05, 0.06, 0.08, 0.09, 0, z0, WOOD_DARK) + T.box(-0.02, -0.1, 0.02, -0.07, 0, z0, WOOD_DARK) + poly2(lower, WOOD_DARK.left) + poly2(leather, "#8B5631", ' stroke="#5E3A22" stroke-width="0.5"') + pleats + poly2(upper, WOOD.top, ` stroke="${OUT2}" stroke-width="0.6"`) + dot2(cx, cy, 1.1, "#5E3A22") + ln3(T.p(-0.03, 0.19, z0 + open), T.p(-0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln3(T.p(0.03, 0.19, z0 + open), T.p(0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln3(T.p(0, -0.13, z0 + 0.8), [nx, ny], DARK_IRON.right, 2.4) + ln3(T.p(0, -0.13, z0 + 1.4), [nx, ny - 0.6], DARK_IRON.top, 0.6) + (puff ? dot2(nx - 2 - f, ny - 1.6 - f * 0.6, 1 + f * 0.5, `rgba(255,255,255,${f23(0.5 - f * 0.12)})`) + dot2(nx - 1, ny - 2.4, 0.6, "#FFB347") : "");
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
      return T.shadow(0, 0, 0.2, 0.2) + T.box(-0.14, -0.13, 0.14, 0.13, 0, 3, STONE) + T.box(-0.035, -0.12, 0.035, -0.08, 3, 29, DARK_IRON) + T.box(-0.06, -0.05, 0.06, 0.05, 3, 7, DARK_IRON) + T.box(-0.045, -0.035, 0.045, 0.035, 7, 9, IRON2) + `<rect x="${f23(ax - 3.4)}" y="${f23(ay - 1.4)}" width="6.8" height="1.8" rx="0.8" fill="${strike ? "#FFB347" : "#E2463A"}"/>` + T.box(-0.04, -0.04, 0.04, 0.04, zr, zr + 7, IRON2) + ln3(T.p(0, 0, zr + 7), T.p(0, 0, 29), IRON2.top, 1.4) + T.box(-0.035, 0.08, 0.035, 0.12, 3, 29, DARK_IRON) + T.box(-0.05, -0.13, 0.05, 0.13, 29, 32, DARK_IRON) + T.cyl(0, 0, 32, 38, 0.06, COPPER3, "steam") + dot2(sx, sy, 1.1, COPPER3.right) + ln3(T.p(0.04, -0.06, 36), T.p(0.04, -0.1, 22), COPPER3.right, 1.1) + dot2(...T.p(0, 0.12, 22), 1.8, "#F2EDE2") + ln3(T.p(0, 0.12, 22), T.p(0.01, 0.12, 23.2), "#E2463A", 0.6) + (f >= 1 && f <= 4 ? [0, 1].map((k) => dot2(sx + 3 + k * 3 + f, sy - 2 - k * 3 - f, 1.6 + f * 0.5, `rgba(255,255,255,${f23(0.7 - f * 0.12)})`)).join("") : "") + (strike ? [[-7, -4], [6, -5], [-4, -8], [8, -1], [-9, 0]].map(([dx, dy], k) => dot2(ax + dx, ay + dy, 0.9, k % 2 ? "#FFE07A" : "#F7A23B")).join("") : "");
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
      const arm = /* @__PURE__ */ __name((sx, s) => `<g transform="rotate(${f23(step * 24 * s)} ${f23(sx)} ${f23(by - 4)})">${ln3([sx, by - 4], [sx + s * 0.6, by + 3], DARK_IRON.left, 1.6)}${dot2(sx + s * 0.6, by + 3.6, 1.4, BRASS.left)}</g>`, "arm");
      return T.shadow(0, 0, 0.12, 0.22) + ln3(T.p(-0.06, -0.06, 17 + bob), [kx, ky], DARK_IRON.right, 1.2) + ell3(kx - 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`) + ell3(kx + 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.top, ` stroke="${BRASS.right}" stroke-width="0.5"`) + leg(-0.03, 0.03, Math.max(0, step) * 2) + leg(0.03, -0.03, Math.max(0, -step) * 2) + arm(bx - 5.6, -1) + T.cyl(0, 0, 9 + bob, 21 + bob, 0.08, BRASS, "body") + [-3, 0, 3].map((dx) => dot2(bx + dx, by + 4.4, 0.5, BRASS.right)).join("") + dot2(bx, by - 1, 2.2, "#F2EDE2") + ln3([bx, by - 1], [bx + 1.2, by - 2], "#3D3A36", 0.5) + `<circle cx="${f23(bx)}" cy="${f23(by - 1)}" r="2.2" fill="none" stroke="${BRASS.right}" stroke-width="0.6"/>` + arm(bx + 5.6, 1) + T.cyl(0, 0, 21 + bob, 27 + bob, 0.055, BRASS, "head") + ell3(hx, hy - 2.6, 3.6, 1.8, BRASS.top) + ln3([hx, hy - 3.6], [hx, hy - 8], DARK_IRON.right, 0.7) + dot2(hx, hy - 8.4, 1.1, f % 4 < 2 ? "#7FE0FF" : "#E2463A") + (blink ? ln3([hx - 2.4, hy + 1], [hx - 0.8, hy + 1], "#3D3A36", 0.7) + ln3([hx + 0.8, hy + 1], [hx + 2.4, hy + 1], "#3D3A36", 0.7) : dot2(hx - 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx + 1.6, hy + 1, 1.1, "#7FE0FF") + dot2(hx - 1.9, hy + 0.7, 0.4, "#FFFFFF") + dot2(hx + 1.3, hy + 0.7, 0.4, "#FFFFFF")) + ln3([hx - 1.4, hy + 3.4], [hx + 1.4, hy + 3.4], BRASS.right, 0.6);
    }, "draw")
  }]
};
var ATHANOR_AT = [-0.4, 0.94];
var GOLD2 = { top: "#FFE08A", left: "#F0B94A", right: "#C48A26" };
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
      const bubbles2 = [0, 1, 2].map((k) => {
        const t = (f / n + k / 3) % 1;
        return dot2(gx - 2 + k * 2, gy + 2 - t * 4, 0.6 + t * 0.4, `rgba(255,250,220,${f23(1 - t)})`);
      }).join("");
      return T.shadow(0, 0, 0.24, 0.22) + T.box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE) + T.cyl(0, 0, 3, 22, 0.11, GOLD2, "tower") + [8, 15].map((z) => {
        const [lx, ly] = T.p(0, 0, z);
        return `<path d="M${f23(lx - rx)},${f23(ly)} A${f23(rx)},${f23(rx / 2)} 0 0 0 ${f23(lx + rx)},${f23(ly)}" stroke="${GOLD2.right}" stroke-width="1" fill="none"/>`;
      }).join("") + `<path d="M${f23(fx - 3.4)},${f23(fy + 3.6)} L${f23(fx - 3.4)},${f23(fy - 1)} A3.4,3.6 0 0 1 ${f23(fx + 3.4)},${f23(fy - 1)} L${f23(fx + 3.4)},${f23(fy + 3.6)} Z" fill="#4A1E10" stroke="${GOLD2.right}" stroke-width="0.8"/>` + ell3(fx, fy + 2, 2.4, 2.6, "#F28A3A", ` opacity="${f23(fire)}"`) + ell3(fx, fy + 2.6, 1.3, 1.6, "#FFE07A", ` opacity="${f23(fire)}"`) + gradient(T.id("dome"), GOLD2.left, GOLD2.right) + `<path d="M${f23(x - rx)},${f23(y)} C${f23(x - rx)},${f23(y - 11)} ${f23(x + rx)},${f23(y - 11)} ${f23(x + rx)},${f23(y)} A${f23(rx)},${f23(rx / 2)} 0 0 1 ${f23(x - rx)},${f23(y)} Z" fill="url(#${T.id("dome")})" stroke="${OUT2}" stroke-width="0.6"/><path d="M${f23(x - rx * 0.6)},${f23(y - 5)} Q${f23(x - rx * 0.3)},${f23(y - 8)} ${f23(x)},${f23(y - 8.4)}" stroke="rgba(255,255,255,.6)" stroke-width="1" fill="none"/><path d="M${f23(gx + 2)},${f23(gy - 4)} Q${f23(gx + 10)},${f23(gy - 12)} ${f23(qx + 1)},${f23(qy - 9)}" stroke="rgba(230,245,255,.8)" stroke-width="1.6" fill="none"/><path d="M${f23(gx + 2)},${f23(gy - 4)} Q${f23(gx + 10)},${f23(gy - 12)} ${f23(qx + 1)},${f23(qy - 9)}" stroke="rgba(120,150,180,.45)" stroke-width="0.4" fill="none"/><path d="M${f23(gx - 5)},${f23(gy + 1)} A5,5 0 0 0 ${f23(gx + 5)},${f23(gy + 1)} Z" fill="#FFC94A"/>` + bubbles2 + `<circle cx="${f23(gx)}" cy="${f23(gy)}" r="5" fill="rgba(220,240,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="0.7"/><rect x="${f23(gx - 1.2)}" y="${f23(gy - 8)}" width="2.4" height="3.4" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + dot2(gx - 2, gy - 2, 0.9, "rgba(255,255,255,.8)") + ell3(qx, qy - 3.4, 3.6, 3.6, "rgba(220,240,255,.3)", ' stroke="rgba(255,255,255,.85)" stroke-width="0.6"') + `<path d="M${f23(qx - 3.4)},${f23(qy - 2.6)} A3.6,3.6 0 0 0 ${f23(qx + 3.4)},${f23(qy - 2.6)} Z" fill="#FFC94A"/><rect x="${f23(qx - 0.9)}" y="${f23(qy - 9.4)}" width="1.8" height="2.6" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>` + (f % 4 === 1 ? dot2(qx + 1, qy - 7 + (f >> 2) * 2, 0.6, "#FFC94A") : "") + star(gx + 7, gy - 3, 1.6, "#FFF2B0", Math.max(0, wave(f, n, 1))) + star(x - rx - 2, y - 2, 1.4, "#FFF2B0", Math.max(0, wave(f, n, 1, 3)));
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
      const log = /* @__PURE__ */ __name((a, b, z) => T.box(a, b, a + 0.045, b + 0.16, z, z + 3.4, BARK), "log");
      const [px, py] = T.p(0.14, 0.17, 0);
      const joint = "rgba(120,110,95,.4)";
      return T.shadow(0, 0, 0.22, 0.2) + T.box(-0.15, -0.15, 0.15, 0.15, 0, 7, STONE) + ln3(T.p(-0.15, 0.15, 3.5), T.p(0.15, 0.15, 3.5), joint, 0.6) + [-0.08, 0.02, 0.11].map((du, k) => ln3(T.p(du, 0.15, k % 2 ? 0 : 3.5), T.p(du, 0.15, k % 2 ? 3.5 : 7), joint, 0.6)).join("") + `<defs><linearGradient id="${T.id("dome")}" x1="0" x2="1"><stop offset="0" stop-color="#E3B486"/><stop offset="1" stop-color="#A9724A"/></linearGradient></defs><path d="M${f23(x - rx)},${f23(y)} C${f23(x - rx)},${f23(y - OVEN_H * 1.3)} ${f23(x + rx)},${f23(y - OVEN_H * 1.3)} ${f23(x + rx)},${f23(y)} A${rx},${ry} 0 0 1 ${f23(x - rx)},${f23(y)} Z" fill="url(#${T.id("dome")})" stroke="${OUT2}" stroke-width="0.7"/><path d="M${f23(x - rx * 0.8)},${f23(y - 4)} Q${f23(x)},${f23(y - 1)} ${f23(x + rx * 0.8)},${f23(y - 4)} M${f23(x - rx * 0.55)},${f23(y - 8.4)} Q${f23(x)},${f23(y - 6.4)} ${f23(x + rx * 0.55)},${f23(y - 8.4)}" stroke="rgba(110,60,30,.35)" stroke-width="0.6" fill="none"/>` + T.cyl(0.02, -0.04, 7 + OVEN_H * 0.9, 7 + OVEN_H * 0.9 + 5, 0.028, { top: "#5E3A2A", left: "#B87E52", right: "#8C5A34" }, "flue") + `<path d="M${f23(x - 5.6)},${f23(y + 1.8)} L${f23(x - 5.6)},${f23(y - 2.4)} A2.6,2.8 0 0 1 ${f23(x - 0.6)},${f23(y - 2.4)} L${f23(x - 0.6)},${f23(y + 2.6)} Z" fill="#3A1E14" stroke="#7A4E30" stroke-width="0.8"/>` + log(0.18, -0.12, 0) + log(0.235, -0.12, 0) + log(0.205, -0.12, 3.4) + ln3([px, py], [px - 9, py - 16], WOOD.right, 1.2) + `<ellipse cx="${f23(px + 1.4)}" cy="${f23(py + 0.6)}" rx="3" ry="1.4" fill="${WOOD.left}" transform="rotate(-30 ${f23(px + 1.4)} ${f23(py + 0.6)})"/>`;
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
        return dot2(cx + 1 + t * 5 + Math.sin(t * 6) * 1.2, cy - 2 - t * 18, 1.8 + t * 3.6, `rgba(236,232,224,${f23(0.6 * (1 - t))})`);
      }).join("");
      return `<ellipse cx="${f23(x - 3.1)}" cy="${f23(y + 0.6)}" rx="1.9" ry="1.6" fill="#F28A3A" opacity="${f23(glow)}"/><ellipse cx="${f23(x - 3.1)}" cy="${f23(y + 1)}" rx="1" ry="0.8" fill="#FFE07A" opacity="${f23(glow)}"/>` + puffs;
    }, "draw")
  }]
};
var HAMMOCK_AT = [0.9, -0.22];
var lit = {
  layers: [{
    at: HAMMOCK_AT,
    frame: [-22, -32, 46, 46],
    draw: /* @__PURE__ */ __name((T) => T.shadow(0, -0.5, 0.06, 0.2) + T.shadow(0, 0.5, 0.06, 0.2) + T.box(-0.025, -0.525, 0.025, -0.475, 0, 22, WOOD_DARK) + T.box(-0.025, 0.475, 0.025, 0.525, 0, 22, WOOD_DARK) + ln3(T.p(0, -0.5, 22), T.p(0, -0.5, 24), WOOD_DARK.right, 1.4) + ln3(T.p(0, 0.5, 22), T.p(0, 0.5, 24), WOOD_DARK.right, 1.4), "draw")
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
      const stripe = /* @__PURE__ */ __name((k, color) => `<path d="M${f23(a[0] + 2)},${f23(a[1] + 1 + k)} Q${f23(mx)},${f23(low - 4 + k * 1.6)} ${f23(b[0] - 2)},${f23(b[1] + 1 + k)}" stroke="${color}" stroke-width="1.1" fill="none"/>`, "stripe");
      const kx = a[0] + (b[0] - a[0]) * 0.2 + swing * 0.4;
      const ky = a[1] + (b[1] - a[1]) * 0.2 + 5;
      return ln3(a, [a[0] - 1.2, a[1] + 2.6], "#C9A16A", 0.7) + ln3(b, [b[0] + 1.2, b[1] + 2.6], "#C9A16A", 0.7) + `<path d="M${f23(a[0])},${f23(a[1] + 2)} Q${f23(mx)},${f23(low + 3)} ${f23(b[0])},${f23(b[1] + 2)} Q${f23(mx)},${f23(low - 6)} ${f23(a[0])},${f23(a[1] + 2)} Z" fill="#F3E4C4" stroke="#C9A16A" stroke-width="0.6"/>` + stripe(0, "#E2574C") + stripe(2.2, "#5C83C2") + stripe(4.2, "#E2574C") + ell3(kx, ky, 3.6, 2, "#FFFDF8", ` stroke="${OUT2}" stroke-width="0.5"`) + `<path d="M${f23(mx + 1)},${f23(low - 4.6)} l3.4,-1.2 l3.4,1.2 l0,1.6 l-3.4,-1 l-3.4,1 Z" fill="#8C4B32"/><path d="M${f23(mx + 1.4)},${f23(low - 4.8)} l3,-1 l3,1" stroke="#FFFDF8" stroke-width="0.6" fill="none"/>`;
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
      return ell3(x, y + 0.4, 9, 2.6, "rgba(40,55,20,.22)") + ell3(x, y - 1, 8.6, 3.2, "#C8504A") + ell3(x - 0.6, y - 1.8, 7.4, 2.4, "#DE6A5E") + [[-8, -0.4], [8, -1], [-6, 1.6], [6, 1.8]].map(([dx, dy]) => dot2(x + dx, y + dy, 0.9, "#F2C04B")).join("") + ell3(x - 0.6, y - 5.4, 6.2 + breath, 3.6 + breath * 0.5, "#F2994A", ' stroke="rgba(120,60,20,.35)" stroke-width="0.5"') + `<path d="M${f23(x - 4)},${f23(y - 8)} q1.4,1.2 1,3 M${f23(x - 1.2)},${f23(y - 8.8)} q1.2,1.4 0.8,3.4 M${f23(x + 1.6)},${f23(y - 8.6)} q1,1.2 0.6,3" stroke="#C8622A" stroke-width="0.9" fill="none"/>` + dot2(x + 4.4, y - 5.2, 3.2, "#F2994A") + `<g transform="rotate(${ear} ${f23(x + 3.4)} ${f23(y - 7.6)})"><path d="M${f23(x + 2.4)},${f23(y - 7.4)} l0.6,-2.8 l1.8,2 Z" fill="#F2994A"/><path d="M${f23(x + 2.8)},${f23(y - 7.6)} l0.4,-1.6 l0.9,1.1 Z" fill="#F7B8B0"/></g><path d="M${f23(x + 5)},${f23(y - 7.8)} l1.4,-2.6 l1.2,2.3 Z" fill="#F2994A"/><path d="M${f23(x + 3.4)},${f23(y - 5.2)} q0.7,0.6 1.4,0 M${f23(x + 5.4)},${f23(y - 5.2)} q0.7,0.6 1.4,0" stroke="#5E3A22" stroke-width="0.6" fill="none"/>` + dot2(x + 6.6, y - 4, 0.5, "#E07A7A") + `<path d="M${f23(x - 6.4)},${f23(y - 3.6)} q-1.4,3.4 3.6,3.8 q4.6,0.2 6.2,-1.4" stroke="#F2994A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${f23(x + 3.4)},${f23(y - 1.2)} q1.6,${f23(-0.6 + flick)} 2.6,${f23(-1.8 + flick)}" stroke="#FFF4E6" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
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
      return ell3(x, y + 0.4, 8, 2, "rgba(40,55,20,.25)") + ell3(gx, gy, 4, 1.6, "#4C7FB5") + ell3(gx, gy - 1, 4, 1.5, "#6FA3D9") + ell3(gx, gy - 1.2, 2.8, 0.9, "#8B5631") + `<path d="M${f23(x - 6)},${f23(y - 3)} q-4,${f23(-2 + wag)} -5,${f23(-6.4 + wag)}" stroke="#B98552" stroke-width="2.4" stroke-linecap="round" fill="none"/>` + ell3(x - 1.6, y - 4.6, 6, 4.4, "#C9935E", ' stroke="rgba(90,50,20,.35)" stroke-width="0.5"') + `<path d="M${f23(x + 0.4)},${f23(y - 8)} Q${f23(x + 4.6)},${f23(y - 7)} ${f23(x + 4.4)},${f23(y)} L${f23(x + 0.6)},${f23(y)} Z" fill="#D9A877"/>` + ln3([x + 1.6, y - 3], [x + 1.6, y - 0.2], "#B98552", 1.8) + ln3([x + 3.6, y - 3], [x + 3.6, y - 0.2], "#B98552", 1.8) + ell3(x + 1.6, y, 1.4, 0.7, "#FFF4E6") + ell3(x + 3.6, y, 1.4, 0.7, "#FFF4E6") + dot2(x + 3, head, 4.4, "#C9935E") + ell3(x + 6.4, head + 1.2, 2.8, 2, "#E7C08A") + dot2(x + 8.8, head + 0.4, 0.95, "#2A2420") + (pant ? `<path d="M${f23(x + 6.6)},${f23(y - 9.4)} q0.6,2.4 1.8,1.4 q0.4,-1 -0.4,-1.8 Z" fill="#E86A7A"/>` : "") + `<path d="M${f23(x + 0.2)},${f23(y - 15.2)} q-3.2,1 -2.2,6.4" stroke="#8B5631" stroke-width="2.6" stroke-linecap="round" fill="none"/>` + dot2(x + 4.6, head - 0.8, 0.7, "#2A2420") + `<path d="M${f23(x + 0.4)},${f23(y - 8.2)} q3,1.4 5.6,0" stroke="#E2463A" stroke-width="1.5" fill="none"/>` + dot2(x + 3.2, y - 7, 0.9, "#F2C04B");
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
      const glass = `M${f23(x - 4.4)},${f23(y - 20)} C${f23(x - 4.6)},${f23(y - 14)} ${f23(x - 0.6)},${f23(y - 12)} ${f23(x - 0.6)},${f23(y - 10)} C${f23(x - 0.6)},${f23(y - 8)} ${f23(x - 4.6)},${f23(y - 6)} ${f23(x - 4.4)},${f23(y)} L${f23(x + 4.4)},${f23(y)} C${f23(x + 4.6)},${f23(y - 6)} ${f23(x + 0.6)},${f23(y - 8)} ${f23(x + 0.6)},${f23(y - 10)} C${f23(x + 0.6)},${f23(y - 12)} ${f23(x + 4.6)},${f23(y - 14)} ${f23(x + 4.4)},${f23(y - 20)} Z`;
      const top = y - 11 - (1 - k) * 7;
      const pile = 1 + k * 6;
      const post = /* @__PURE__ */ __name((dx) => `<rect x="${f23(x + dx - 0.6)}" y="${f23(y - 21)}" width="1.2" height="21" fill="${WOOD_DARK.left}"/>`, "post");
      return T.shadow(0, 0, 0.13, 0.22) + T.cyl(0, 0, 0, 2, 0.06, WOOD_DARK, "foot") + T.box(-0.012, -0.012, 0.012, 0.012, 2, 12, WOOD_DARK) + T.cyl(0, 0, 12, 14, 0.12, WOOD, "table") + T.cyl(0, 0, 14, 16, 0.09, WOOD_DARK, "base") + post(-5.2) + post(5.2) + `<defs><clipPath id="${T.id("glass")}"><path d="${glass}"/></clipPath></defs><g clip-path="url(#${T.id("glass")})"><rect x="${f23(x - 5)}" y="${f23(top)}" width="10" height="${f23(y - 10 - top)}" fill="#F2C66E"/><path d="M${f23(x - 5)},${f23(y)} L${f23(x - 5)},${f23(y - pile * 0.4)} Q${f23(x)},${f23(y - pile * 1.6)} ${f23(x + 5)},${f23(y - pile * 0.4)} L${f23(x + 5)},${f23(y)} Z" fill="#E9B65A"/>` + (k < 1 ? ln3([x, y - 10], [x, y - pile], "#F2C66E", 0.7) : "") + `</g><path d="${glass}" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.85)" stroke-width="0.6"/>` + ln3([x - 3, y - 18], [x - 2, y - 14], "rgba(255,255,255,.7)", 0.8) + ln3([x - 3, y - 2], [x - 2.4, y - 5], "rgba(255,255,255,.6)", 0.7) + post(0) + T.cyl(0, 0, 36, 38, 0.09, WOOD_DARK, "cap") + dot2(...T.p(0, 0, 39), 1, WOOD.top);
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
      const eye = /* @__PURE__ */ __name((dx) => blink ? `<path d="M${f23(ox + dx - 1.6)},${f23(oy - 14)} q1.6,1 3.2,0" stroke="#3A2A1E" stroke-width="0.7" fill="none"/>` : dot2(ox + dx, oy - 14, 1.8, "#F2C04B") + dot2(ox + dx + turn * 0.3, oy - 14, 0.9, "#1E1A17") + dot2(ox + dx - 0.5, oy - 14.6, 0.35, "#FFFFFF"), "eye");
      return T.shadow(0, 0, 0.1, 0.2) + T.pebble(0.05, 0.05, 1.8) + T.box(-0.02, -0.02, 0.02, 0.02, 0, 23, WOOD_DARK) + T.box(-0.015, -0.12, 0.015, 0.12, 23, 25, WOOD) + `<path d="M${f23(ox - 2)},${f23(oy - 2)} l-1,4 l2,-1 l1,2 l1,-2 l2,1 l-1,-4 Z" fill="#7A4E30"/>` + ell3(ox, oy - 6.4, 5, 6.4, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + ell3(ox + 0.4, oy - 5.6, 3.2, 4.6, "#E7C99A") + [[-1, -7.4], [1.4, -6.4], [-0.4, -4.4], [1.8, -3.6]].map(([dx, dy]) => `<path d="M${f23(ox + dx - 0.7)},${f23(oy + dy)} l0.7,0.7 l0.7,-0.7" stroke="#B98552" stroke-width="0.5" fill="none"/>`).join("") + ell3(ox - 3.8, oy - 6, 1.8, 4.6, "#7A4E30") + ell3(ox + 4, oy - 6, 1.6, 4.4, "#8B5631") + [-1.6, 0, 1.6].map((dx) => ln3([ox + dx, oy - 1], [ox + dx, oy + 0.6], "#E8A13A", 0.7)).join("") + `<g transform="translate(${f23(turn)} 0)">` + ell3(ox, oy - 14, 5.4, 4.6, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"') + `<path d="M${f23(ox - 4.6)},${f23(oy - 16.4)} l-0.6,-3.6 l2.6,2 Z M${f23(ox + 4.6)},${f23(oy - 16.4)} l0.6,-3.6 l-2.6,2 Z" fill="${feather}"/>` + ell3(ox - 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + ell3(ox + 2, oy - 13.8, 2.6, 2.4, "#E7C99A") + eye(-2) + eye(2) + `<path d="M${f23(ox - 0.7)},${f23(oy - 12.6)} l0.7,1.6 l0.7,-1.6 Z" fill="#5E3A22"/></g>`;
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
      const lines = /* @__PURE__ */ __name((s) => [0, 1, 2, 3].map((k) => ln3([x + s * 2.4, y - 3.6 + k * 1.3 + k * 0.1], [x + s * 8.4, y - 4.8 + k * 1.3], "rgba(90,70,110,.4)", 0.5)).join(""), "lines");
      const runes = [0, 1, 2].map((k) => {
        const r = (t + k / 3) % 1;
        const rx = x + (k - 1) * 5 + Math.sin(r * 6 + k) * 1.5;
        const ry = y - 8 - r * 14;
        const o = f23(1 - r);
        return k === 0 ? `<circle cx="${f23(rx)}" cy="${f23(ry)}" r="1.4" fill="none" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>` : k === 1 ? `<path d="M${f23(rx - 1.4)},${f23(ry + 1)} l1.4,-2.4 l1.4,2.4 Z" fill="none" stroke="#FFE7A8" stroke-width="0.6" opacity="${o}"/>` : `<path d="M${f23(rx - 1.2)},${f23(ry)} h2.4 M${f23(rx)},${f23(ry - 1.2)} v2.4" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`;
      }).join("");
      return ell3(x, y + 1, 12, 3, "rgba(200,160,255,.22)") + `<path d="M${f23(x)},${f23(y + 1.4)} L${f23(x - 11)},${f23(y - 2)} L${f23(x - 11)},${f23(y - 3.4)} L${f23(x)},${f23(y)} L${f23(x + 11)},${f23(y - 3.4)} L${f23(x + 11)},${f23(y - 2)} Z" fill="#6A3FA0" stroke="#4A2A78" stroke-width="0.5"/><path d="M${f23(x)},${f23(y)} Q${f23(x - 5)},${f23(y - 5)} ${f23(x - 10)},${f23(y - 3.4)} L${f23(x - 10)},${f23(y - 5)} Q${f23(x - 5)},${f23(y - 7)} ${f23(x)},${f23(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/><path d="M${f23(x)},${f23(y)} Q${f23(x + 5)},${f23(y - 5)} ${f23(x + 10)},${f23(y - 3.4)} L${f23(x + 10)},${f23(y - 5)} Q${f23(x + 5)},${f23(y - 7)} ${f23(x)},${f23(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>` + lines(-1) + lines(1) + `<path d="M${f23(x)},${f23(y - 2)} Q${f23((x + ex) / 2)},${f23(Math.min(y - 6, ey - 3))} ${f23(ex)},${f23(ey - 3)} L${f23(ex)},${f23(ey - 1.6)} Q${f23((x + ex) / 2)},${f23(Math.min(y - 4.4, ey - 1.4))} ${f23(x)},${f23(y)} Z" fill="#FFFDF4" stroke="#D8C39B" stroke-width="0.4"/>` + dot2(x - 10.6, y - 2.7, 0.8, "#F2C04B") + dot2(x + 10.6, y - 2.7, 0.8, "#F2C04B") + runes + star(x - 7, y - 10, 1.4, "#FFF2B0", Math.max(0, wave(f, n, 1))) + star(x + 8, y - 12, 1.2, "#FFF2B0", Math.max(0, wave(f, n, 1, 3)));
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
var BIG_FROM = 4;
var spread = /* @__PURE__ */ __name((level) => level >= BIG_FROM ? 1.5 : 1, "spread");
function placeOf(layer, level) {
  const at = layer.at;
  const base = typeof at[0] === "number" ? at : at[Math.min(level, 3)] || at[2] || at[1];
  const k = spread(level);
  return [base[0] * k, base[1] * k];
}
__name(placeOf, "placeOf");
function boxOf(layer, level) {
  const [u, v] = placeOf(layer, level);
  const [sx, sy] = P(u, v, 0);
  const [x, y, w, h] = typeof layer.frame === "function" ? layer.frame(level) : layer.frame;
  return { x: sx + x, y: sy + y, w, h };
}
__name(boxOf, "boxOf");
function bodyOf(id, k, layer, level, f) {
  const [u, v] = placeOf(layer, level);
  const T = tools(u, v, `${id}-${k}`);
  return layer.n ? layer.draw(T, level, f, layer.n) : layer.draw(T, level);
}
__name(bodyOf, "bodyOf");
function itemLayers(id, level, t = 0) {
  const item = SHOP_SPRITES[id];
  if (!item) return [];
  return item.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [mu, mv, dz] = layer.motion ? layer.motion(t, level) : [0, 0, 0];
    const du = mu * spread(level);
    const dv = mv * spread(level);
    return {
      key: `shop-${id}-${level}-${k}-${f}`,
      make: /* @__PURE__ */ __name(() => sprite(bodyOf(id, k, layer, level, f), boxOf(layer, level)), "make"),
      back: Boolean(layer.back),
      offset: [(du - dv) * 64 / 2, (du + dv) * 32 / 2 - dz]
    };
  });
}
__name(itemLayers, "itemLayers");

// atelier/port/src/world/looks.js
var FLAMES = flameFrames(0, 0, 1, true);
var SHELTER_FLAMES = flameFrames(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.75, true);
var FOUNTAIN = fountainFrames();
var KIOSK_SKINS = /* @__PURE__ */ new Set(["toit-bleu", "toit-chaume"]);
var BOAT_AT = [0.05, 0.5];
var FIRST = {
  foyer: [
    { make: BUILDINGS.foyer[0], lights: LIGHTS.foyer[0], smoke: [SMOKE.foyer[0]], fire: true, anims: [{ key: "flame", n: FLAMES.length, fps: 9, frame: /* @__PURE__ */ __name((f) => FLAMES[f], "frame") }] },
    { make: BUILDINGS.foyer[1], lights: LIGHTS.foyer[1], smoke: [SMOKE.foyer[1]], fire: true, anims: [{ key: "flame", n: SHELTER_FLAMES.length, fps: 9, frame: /* @__PURE__ */ __name((f) => SHELTER_FLAMES[f], "frame") }] },
    { make: BUILDINGS.foyer[2], lights: LIGHTS.foyer[2], smoke: [SMOKE.foyer[2]] }
  ],
  carriere: [{ make: BUILDINGS.carriere[0] }, { make: BUILDINGS.carriere[1] }],
  bosquet: [{ make: BUILDINGS.bosquet[0], sway: 0.03 }, { make: UPGRADES.bosquet, sway: 0.03 }],
  puits: [
    { make: BUILDINGS.puits[0] },
    { make: UPGRADES.puits, anims: [{ key: "fountain", n: FOUNTAIN.length, fps: 6, frame: /* @__PURE__ */ __name((f) => FOUNTAIN[f], "frame"), skip: /* @__PURE__ */ __name((skin2) => KIOSK_SKINS.has(skin2), "skip") }] }
  ],
  potager: [{ make: BUILDINGS.potager[0] }, { make: UPGRADES.potager }],
  atelier: [
    { make: BUILDINGS.atelier[0], lights: LIGHTS.atelier[0], smoke: [SMOKE.atelier[0]] },
    { make: UPGRADES.atelier, lights: [[0.88, -0.05, 7, 30]], smoke: [[0.55, -0.2, 58]] }
  ],
  ponton: [{ make: BUILDINGS.ponton[0], boat: BOAT_AT }, { make: UPGRADES.ponton, boat: BOAT_AT, lights: [[0.82, 0.14, 37, 16]] }]
};
var DEFAULTS = { lights: [], smoke: [], anims: [], boat: null, sway: 0, fire: false };
function tinted(make) {
  return (skin2) => {
    const tint = tintOf(skin2);
    if (!tint) return make(skin2);
    const drawn = make();
    return { ...drawn, svg: tintSvg(drawn.svg, tint) };
  };
}
__name(tinted, "tinted");
var withTints = /* @__PURE__ */ __name((look) => ({
  ...DEFAULTS,
  ...look,
  make: tinted(look.make),
  anims: (look.anims || []).map((anim) => anim.tint ? { ...anim, skinned: true, frame: /* @__PURE__ */ __name((f, skin2) => tinted((s) => anim.frame(f, s))(skin2), "frame") } : anim)
}), "withTints");
var LOOKS = Object.fromEntries(Object.entries(FIRST).map(([id, list]) => [id, [...list, ...TIERS[id] || []].map(withTints)]));
var boatOf = tinted(boatSprite);
function lookAt(siteId, level) {
  const list = LOOKS[siteId];
  return list ? list[Math.max(1, Math.min(level, list.length)) - 1] : null;
}
__name(lookAt, "lookAt");
function boatOffset(at) {
  return [(at[0] - BOAT_AT[0] - (at[1] - BOAT_AT[1])) * 32, (at[0] - BOAT_AT[0] + (at[1] - BOAT_AT[1])) * 16];
}
__name(boatOffset, "boatOffset");
function artMake(siteId, level, skin2) {
  const look = lookAt(siteId, level);
  return () => {
    const building = look.make(skin2 || void 0);
    const inner3 = /* @__PURE__ */ __name((s) => s.svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""), "inner");
    let extra = look.anims.filter((a) => !(a.skip && a.skip(skin2))).map((a) => inner3(a.frame(0, skin2))).join("");
    if (look.boat) {
      const [dx, dy] = boatOffset(look.boat);
      extra += `<g transform="translate(${dx} ${dy})">${inner3(boatOf(skin2 || void 0))}</g>`;
    }
    if (!RARE_SPRITES[skin2]) return { box: building.box, svg: building.svg.replace(/<\/svg>$/, `${extra}</svg>`) };
    const parts = itemLayers(skin2, level, 0).map((layer) => ({ ...layer, sprite: layer.make() }));
    const placed = /* @__PURE__ */ __name((side) => parts.filter((p) => p.back === side).map((p) => `<g transform="translate(${p.offset[0]} ${p.offset[1]})">${inner3(p.sprite)}</g>`).join(""), "placed");
    const boxes = [building.box, ...parts.map((p) => ({ ...p.sprite.box, x: p.sprite.box.x + p.offset[0], y: p.sprite.box.y + p.offset[1] }))];
    const x = Math.min(...boxes.map((b) => b.x));
    const y = Math.min(...boxes.map((b) => b.y));
    const box2 = { x, y, w: Math.max(...boxes.map((b) => b.x + b.w)) - x, h: Math.max(...boxes.map((b) => b.y + b.h)) - y };
    return sprite(placed(true) + inner3(building) + extra + placed(false), box2);
  };
}
__name(artMake, "artMake");

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

// atelier/generateur_batiments.mjs
var K = 1.25;
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var up = /* @__PURE__ */ __name((body) => `<g transform="scale(${K})">${body}</g>`, "up");
var inner2 = /* @__PURE__ */ __name((s) => s.svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""), "inner");
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(" ")}">${body}</svg>`, "svgOf");
var SITES = ["foyer", "carriere", "bosquet", "puits", "potager", "atelier", "ponton"];
var BATIMENTS = { paliers: batiments_default.paliers, paliers_hiver: batiments_default.paliers_hiver, chantier: batiments_default.chantier, skins: batiments_default.skins, pieces_rares: batiments_default.pieces_rares, teintes: batiments_default.teintes };
var site = /* @__PURE__ */ __name((s) => {
  if (!SITES.includes(s)) throw new Error(`bâtiment inconnu : ${s} (${SITES.join(", ")})`);
}, "site");
var palierOk = /* @__PURE__ */ __name((lv) => {
  if (!(lv >= 1 && lv <= 7)) throw new Error(`palier ${lv} : de 1 à 7`);
}, "palierOk");
function palier(s, lv, n = 1, hiver = false) {
  site(s);
  palierOk(lv);
  if (typeof hiver !== "boolean") throw new Error(`hiver : ${hiver} (true ou false)`);
  const base = `${s}_palier${lv}${hiver ? "_hiver" : ""}`, e = (hiver ? batiments_default.paliers_hiver : batiments_default.paliers)[base];
  const images = e.fichiers.length;
  if (!(n >= 1 && n <= images)) throw new Error(`${base} : image ${n} (de 1 à ${images})`);
  setHiver(hiver);
  try {
    const look = lookAt(s, lv), b = look.make(void 0);
    let boat = "";
    if (look.boat) {
      const [dx, dy] = boatOffset(look.boat);
      boat = `<g transform="translate(${dx} ${dy})">${inner2(boatOf(void 0))}</g>`;
    }
    const body = up(inner2(b) + look.anims.map((a) => inner2(a.frame((n - 1) % a.n))).join("") + boat);
    return { svg: svgOf(e.cadre, body), cadre: e.cadre, ms_par_image: e.ms_par_image ?? null };
  } finally {
    setHiver(false);
  }
}
__name(palier, "palier");
function chantier(phase) {
  const make = BUILDINGS.chantier[phase - 1];
  if (!make) throw new Error(`chantier : phase ${phase} (1, 2 ou 3)`);
  const cadre = batiments_default.chantier.cadres[phase - 1];
  return { svg: svgOf(cadre, up(inner2(make()))), cadre, ms_par_image: null };
}
__name(chantier, "chantier");
function skin(id, lv) {
  const e = batiments_default.skins[id];
  if (!e) throw new Error(`skin inconnu : ${id} (${Object.keys(batiments_default.skins).join(", ")})`);
  const i = e.fichiers.findIndex((f) => f.endsWith(`_palier${lv}.svg`));
  if (i < 0) throw new Error(`${id} : palier ${lv} (le skin change le dessin aux paliers ${e.fichiers.map((f) => f.match(/palier(\d)/)[1]).join(", ")})`);
  const cadre = e.cadres[i];
  return { svg: svgOf(cadre, up(inner2(artMake(e.batiment, lv, id)()))), cadre, ms_par_image: null };
}
__name(skin, "skin");
function pieceRare(id, lv) {
  const e = batiments_default.pieces_rares[id];
  if (!e) throw new Error(`pièce rare inconnue : ${id} (${Object.keys(batiments_default.pieces_rares).join(", ")})`);
  palierOk(lv);
  const cadre = e.cadres[lv - 1];
  return { svg: svgOf(cadre, up(inner2(artMake(e.batiment, lv, id)()))), cadre, ms_par_image: null };
}
__name(pieceRare, "pieceRare");
function liste() {
  const out = [], f = /* @__PURE__ */ __name((rel) => `batiments/${rel}`, "f");
  for (const hiver of [false, true]) for (const s of SITES) for (let lv = 1; lv <= 7; lv++) {
    const e = (hiver ? batiments_default.paliers_hiver : batiments_default.paliers)[`${s}_palier${lv}${hiver ? "_hiver" : ""}`];
    e.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: "palier", args: [s, lv, k + 1, hiver] }));
  }
  batiments_default.chantier.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: "chantier", args: [k + 1] }));
  for (const [id, e] of Object.entries(batiments_default.skins)) e.fichiers.forEach((x) => out.push({ fichier: f(x), fonction: "skin", args: [id, +x.match(/palier(\d)/)[1]] }));
  for (const [id, e] of Object.entries(batiments_default.pieces_rares)) e.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: "pieceRare", args: [id, k + 1] }));
  return out;
}
__name(liste, "liste");
export {
  BATIMENTS,
  SITES,
  chantier,
  liste,
  palier,
  pieceRare,
  skin
};
