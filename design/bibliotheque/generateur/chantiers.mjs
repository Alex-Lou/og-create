// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_chantiers.mjs : ne pas modifier à la main.
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
  const R = emprise === "3x3" ? 1.5 : 1, hs = emprise === "3x3" ? 1.35 : 1;
  const F = Math.round(5 * hs), W = F + Math.round(26 * hs);
  return { R, hs, F, W, h: Math.round(17 * hs), u0: -0.6 * R, u1: 0.45 * R, v0: -0.6 * R, v1: 0.45 * R, k: 0.9 * R };
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
  const caisse = [[x - 9, y - 9], [x + 6, y - 9], [x + 4, y - 3], [x - 7, y - 3]];
  let s = ell(x, y + 1.6, 12, 3.4, "rgba(40,55,20,.18)");
  s += tk([x + 4, y - 4], [x + 12, y - 1], WOOD.left, 1.3) + tk([x + 3, y - 6], [x + 12.5, y - 3], WOOD.left, 1.3);
  s += tk([x + 3, y - 3], [x + 4, y + 1.2], WOOD_DARK.left, 1);
  s += charge === "terre" ? `<path d="M${f2(x - 9)},${f2(y - 9)} Q${f2(x - 1.5)},${f2(y - 16)} ${f2(x + 6)},${f2(y - 9)} Z" fill="${TERRE.claire}" stroke="${OUT}" stroke-width="0.7"/>` + ell(x - 2, y - 12, 2, 1.1, TERRE.motte) : [[-5, -10.5], [0.5, -11], [-2.2, -13.4]].map(([dx, dy]) => ell(x + dx, y + dy, 3, 2.2, STONE.left, ` stroke="${OUT}" stroke-width="0.6"`) + ell(x + dx - 0.8, y + dy - 0.8, 1.2, 0.7, "#FFFFFF", ' opacity=".55"')).join("");
  s += poly(caisse, "#4F8FC0") + ln([x - 7.6, y - 7.4], [x + 4.8, y - 7.4], "rgba(255,255,255,.4)", 0.8);
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
  const { u0, u1, v0, v1, F, W, R } = g, um = (u0 + u1) / 2, vm = (v0 + v1) / 2, zm = (F + W) / 2;
  let s = face([[u0, v1, F], [u1, v1, F], [u1, v1, W], [u0, v1, W]], WALL.left, EDGE) + face([[u1, v0, F], [u1, v1, F], [u1, v1, W], [u1, v0, W]], WALL.right, EDGE);
  const bois = /* @__PURE__ */ __name((a, b) => ln(P(...a), P(...b), COLOMBAGE, 1.6), "bois");
  s += bois([um, v1, F], [um, v1, W]) + bois([u0, v1, zm], [u1, v1, zm]) + bois([u1, vm, F], [u1, vm, W]) + bois([u1, v0, zm], [u1, v1, zm]);
  s += bois([u0 + 0.04, v1, F + 1], [um - 0.04, v1, zm - 1]) + bois([u1, v0 + 0.04, zm + 1], [u1, vm - 0.04, W - 1]);
  s += doorLeft(um + 0.08 * R, u1 - 0.1 * R, v1, Math.round(zm - F + 4) + F) + windowLeft(u0 + 0.1 * R, um - 0.1 * R, v1, zm + 2, W - 3) + windowRight(u1, vm + 0.08 * R, v1 - 0.1 * R, zm + 2, W - 3);
  s += poutre([u0, v1], [u1, v1], W) + poutre([u1, v0], [u1, v1], W);
  return s;
}
__name(mursDevant, "mursDevant");
function toit(g, n) {
  const { u0, u1, v0, v1, W, h } = g, vm = (v0 + v1) / 2, o = 0.08;
  let s = gable(u0, v0, u1, v1, W, h, { front: "#5A3A28", back: ROOF_RED.back, gable: WALL.right }, o);
  s += ln(P(u1, vm, W), P(u1, vm, W + h - 2), COLOMBAGE, 1.4) + ln(P(u1, v0 + 0.1, W + 1), P(u1, vm, W + h - 2), COLOMBAGE, 1.2);
  const A = /* @__PURE__ */ __name((t, w) => [u0 - o + (u1 - u0 + 2 * o) * t, v1 + o + (vm - v1 - o) * w, W + h * w], "A");
  for (let i = 0; i <= 6; i++) s += ln(P(...A(i / 6, 0)), P(...A(i / 6, 1)), WOOD.top, 1.6) + ln(P(...A(i / 6, 0)), P(...A(i / 6, 1)), "rgba(60,40,25,.5)", 0.4);
  for (let j = 1; j <= 4; j++) s += ln(P(...A(0, j / 5)), P(...A(1, j / 5)), WOOD.left, 1.1);
  const bas = 0.42;
  s += poly([P(...A(0, 0)), P(...A(1, 0)), P(...A(1, bas)), P(...A(0, bas))], ROOF_RED.front);
  for (let j = 1; j <= 3; j++) s += ln(P(...A(0.01, bas * j / 3.4)), P(...A(0.99, bas * j / 3.4)), "rgba(140,50,35,.45)", 0.7);
  for (let i = 1; i < 10; i++) s += ln(P(...A(i / 10, 0)), P(...A(i / 10 + 0.01, bas)), "rgba(140,50,35,.25)", 0.5);
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
function montage(emprise, etape2, n = 0) {
  const g = geo(emprise), { R, k, u0, u1, v0, v1, F, W } = g, i = ETAPES.indexOf(etape2);
  if (i < 0) throw new Error("étape inconnue : " + etape2);
  const hp = 13;
  const coin = [[-k, -k], [k, -k], [k, k], [-k, k]].map(([u, v]) => P(u, v, hp - 1.5));
  const nb = Math.round(4 * R);
  let s = shadow(0, 0, 1.08 * R, 0.1);
  if (i === 0) s += [[-0.3, 0.1, 3], [0.25, -0.35, 2.6], [0.1, 0.4, 2.2]].map(([u, v, r]) => {
    const [x, y] = P(u * R, v * R, 0);
    return ell(x, y, r * 2.2, r, "rgba(150,110,60,.18)");
  }).join("");
  else {
    const blob = Array.from({ length: 28 }, (_, j) => {
      const t = j / 28 * Math.PI * 2, r = 0.74 * R * (1 + 0.07 * Math.sin(t * 3 + 0.6) + 0.04 * Math.sin(t * 5));
      return P(Math.cos(t) * r - 0.06 * R, Math.sin(t) * r - 0.06 * R, 0);
    });
    s += `<polygon points="${pts2(blob)}" fill="rgba(150,105,60,.45)"/>`;
    s += [[-0.3, -0.2, 3.4], [0.2, 0.25, 2.8], [0.38, -0.32, 2.4], [-0.12, 0.42, 2], [0.04, -0.5, 2.2]].map(([u, v, r], j) => {
      const [x, y] = P(u * R, v * R, 0);
      return ell(x, y, r, r * 0.6, j % 2 ? TERRE.motte : TERRE.claire);
    }).join("");
    if (i <= 2) s += pebble(0.3 * R, -0.18 * R, 2.4) + pebble(-0.26 * R, 0.32 * R, 2);
  }
  s += guirlande(coin[0], coin[1], nb, n) + guirlande(coin[3], coin[0], nb, n, 2);
  s += piquet(-k, -k, hp) + piquet(k, -k, hp) + piquet(-k, k, hp);
  if (i >= 2) s += dalle(g);
  if (i >= 4) s += mursFond(g);
  if (i >= 3) s += charpente(g, "fond");
  if (i >= 3) s += charpente(g, "devant");
  if (i === 3) s += seauPendu(P(u1, (v0 + v1) / 2 + 0.06, W - 1.5), 10 + 2 * R, n);
  if (i >= 4) s += mursDevant(g);
  if (i >= 5) s += toit(g, n);
  if (i === 3 || i === 4) s += echelle([u0 + 0.14 * R, v1 + 0.24 * R, 0], [u0 + 0.14 * R, v1 + 0.04, W + 3], Math.round(5 * g.hs));
  if (i >= 4) s += echafaudageDroite(g, n);
  if (i === 4) s += seauPendu(P(u1 + 0.18, v1 - 0.02, W + 4), 14 * g.hs, n);
  const o = R === 1 ? 1 : 1.25, at = /* @__PURE__ */ __name((u, v, f) => gros(u * R, v * R, o, f(u * R, v * R)), "at");
  if (i === 0) s += at(0.2, -0.12, caissePlan);
  if (i === 1) s += at(0.58, -0.24, (u, v) => brouette(u, v, "terre"));
  if (i <= 1) s += trace(g);
  if (i === 2) s += at(0.7, -0.45, (u, v) => pierres(u, v, 3)) + at(0.72, 0.02, (u, v) => brouette(u, v, "pierres")) + at(0.74, 0.44, mortier);
  if (i === 3) s += at(0.7, -0.45, (u, v) => pierres(u, v, 2)) + at(0.72, 0.1, mortier);
  if (i === 5) s += at(0.72, -0.36, tuiles);
  if (i >= 3) s += gros(0.09 * R, 0.72 * R, o, planches(-0.18 * R, 0.36 * R, 0.72 * R, i === 3 ? 3 : 2));
  if (i === 1) s += at(0.3, 0.24, (u, v) => tas(u, v, 1));
  s += at(-0.52, 0.8, panneau);
  s += guirlande(coin[1], coin[2], nb, n, 1) + guirlande(coin[2], coin[3], nb, n, 3) + piquet(k, k, hp);
  if (i === 1) {
    const [x, y] = P(0.3 * R, 0.24 * R, 12 * o);
    s += bouffee(x - 10 + n * 3, y - n * 2.4, 2.4 + n * 0.5, [0.95, 0.75, 0.45][n]);
  }
  if (i === 2) {
    const [x, y] = P(0.7 * R, -0.45 * R, 14 * o);
    s += bouffee(x + 6 - n * 2, y - n * 2.6, 2.2 + n * 0.5, [0.9, 0.7, 0.4][n]);
  }
  return s;
}
__name(montage, "montage");
function devoilement(emprise, n) {
  const { R, hs } = geo(emprise), t = (n + 1) / 4;
  let s = "";
  const tour = 12;
  for (let j = 0; j < tour; j++) {
    const a = j / tour * Math.PI * 2 + 0.26, r = (0.7 + 0.42 * t) * R;
    if (Math.cos(a) + Math.sin(a) < -0.35) continue;
    const [x, y] = P(Math.cos(a) * r, Math.sin(a) * r, 2 + 6 * t);
    s += bouffee(x, y, (4.4 - 1.8 * t) * hs, f2(1.05 - t * 0.85));
  }
  const etoile = /* @__PURE__ */ __name((x, y, r, c) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x + r * 0.18)},${f2(y - r * 0.18)} ${f2(x + r)},${f2(y)} Q${f2(x + r * 0.18)},${f2(y + r * 0.18)} ${f2(x)},${f2(y + r)} Q${f2(x - r * 0.18)},${f2(y + r * 0.18)} ${f2(x - r)},${f2(y)} Q${f2(x - r * 0.18)},${f2(y - r * 0.18)} ${f2(x)},${f2(y - r)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`, "etoile");
  const vol = [[-38, -50], [34, -62], [-12, -84], [46, -30], [-48, -22], [10, -100]];
  vol.forEach(([x, y], j) => {
    if ((j + n) % 2 === 0 || n === 1) s += etoile(x * R * 0.9, y * hs - n * 6, (n === 1 ? 4.6 : 3.4) - j % 3 * 0.6, j % 2 ? "#FFF4C2" : "#FFD36A");
  });
  if (n >= 1) {
    const pet = [[-30, -40, "#F7A8B0"], [24, -52, "#FFFFFF"], [-6, -70, "#F2C04B"], [40, -18, "#B3E386"], [-44, -10, "#F7A8B0"], [14, -86, "#6FA3D9"], [0, -30, "#FFFFFF"]];
    pet.forEach(([x, y, c], j) => {
      const yy = y * hs + (n - 1) * 9 + j, xx = x * R * 0.95 + Math.sin(j + n) * 3;
      s += `<ellipse cx="${f2(xx)}" cy="${f2(yy)}" rx="2.2" ry="1.3" transform="rotate(${(j * 47 + n * 30) % 180} ${f2(xx)} ${f2(yy)})" fill="${c}" stroke="${OUT}" stroke-width="0.45"/>`;
    });
  }
  return s;
}
__name(devoilement, "devoilement");
function echafaudage(emprise, couche, n = 0) {
  const { R, hs } = geo(emprise), e = 0.9 * R, H = Math.round(50 * hs), z1 = Math.round(H * 0.42), z2 = Math.round(H * 0.84);
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
  s += echelle([e + 0.24, 0.1 * R, 0], [e + 0.03, 0.1 * R, z1 + 5], Math.round(4 * hs));
  const [fx, fy] = P(e, e, H), w = [0, 1, -0.6][n % 3];
  s += `<path d="M${f2(fx)},${f2(fy)} L${f2(fx + 8 + w)},${f2(fy + 2.2 - w * 0.4)} L${f2(fx)},${f2(fy + 5)} Z" fill="#F2C04B" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += seauPendu(P(e, -0.35 * R, z2 + 6), 12 * hs, n);
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

// atelier/generateur_chantiers.mjs
var K = 1.25;
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2]}" height="${cadre[3]}" viewBox="${cadre.join(" ")}"><g transform="scale(${K})">${body}</g></svg>`, "svgOf");
var EMPRISES = { "2x2": { nom: "2 × 2 cases", cadre: [-95, -155, 190, 210] }, "3x3": { nom: "3 × 3 cases", cadre: [-140, -250, 280, 330] } };
var PART = { piquets: 0, terrassement: 0.12, fondations: 0.28, charpente: 0.46, murs: 0.64, toit: 0.82 };
var MS = { etape: 220, devoilement: 110, spectacle: 450 };
var IMAGES2 = { etape: 3, devoilement: 4, echafaudage: 3 };
var verifie = /* @__PURE__ */ __name((emprise, n, max) => {
  if (!EMPRISES[emprise]) throw new Error(`emprise inconnue : ${emprise} (2x2 ou 3x3)`);
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
  return EMPRISES[emprise].cadre;
}, "verifie");
function etapeDuMontage(emprise, etape2, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES2.etape);
  if (!ETAPES.includes(etape2)) throw new Error(`étape inconnue : ${etape2} (${ETAPES.join(", ")})`);
  return { svg: svgOf(cadre, montage(emprise, etape2, n - 1)), cadre, ms_par_image: MS.etape };
}
__name(etapeDuMontage, "etapeDuMontage");
function devoilementDuBatiment(emprise, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES2.devoilement);
  return { svg: svgOf(cadre, devoilement(emprise, n - 1)), cadre, ms_par_image: MS.devoilement };
}
__name(devoilementDuBatiment, "devoilementDuBatiment");
function echafaudageDEvolution(emprise, couche, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES2.echafaudage);
  if (couche !== "derriere" && couche !== "devant") throw new Error(`couche inconnue : ${couche} (derriere ou devant)`);
  return { svg: svgOf(cadre, echafaudage(emprise, couche, n - 1)), cadre, ms_par_image: MS.etape };
}
__name(echafaudageDEvolution, "echafaudageDEvolution");
var CULTURES2 = { cultures: CULTURES, etapes: Object.fromEntries(CULTURES.map((c) => [c, etapesDe(c)])), cadre: CADRE.map((v) => v * K), images: IMAGES };
var PART_CULTURE = { bechage: 0, sillons: 0.15, semis: 0.3, pousses: 0.5, croissance: 0.7, mur: 1 };
var MS_CULTURE = { etape: 280, spectacle: 450 };
function etapeDeCulture(culture, etape2, n = 1) {
  if (!CULTURES.includes(culture)) throw new Error(`culture inconnue : ${culture} (${CULTURES.join(", ")})`);
  if (!etapesDe(culture).includes(etape2)) throw new Error(`étape inconnue : ${etape2} (${etapesDe(culture).join(", ")})`);
  if (!(+n >= 1 && +n <= IMAGES)) throw new Error(`image ${n} : de 1 à ${IMAGES}`);
  return { svg: svgOf(CULTURES2.cadre, etape(culture, etape2, n - 1)), cadre: CULTURES2.cadre, ms_par_image: MS_CULTURE.etape };
}
__name(etapeDeCulture, "etapeDeCulture");
function liste() {
  const out = [];
  for (const c of CULTURES) for (const e of etapesDe(c)) for (let n = 1; n <= IMAGES; n++) out.push({ fichier: `decor/cultures/${c}/culture_${c}_${e}_${n}.svg`, fonction: "etapeDeCulture", args: [c, e, n] });
  for (const em of Object.keys(EMPRISES)) {
    const d = `batiments/montage/${em}`;
    for (const e of ETAPES) for (let n = 1; n <= IMAGES2.etape; n++) out.push({ fichier: `${d}/montage_${em}_${e}_${n}.svg`, fonction: "etapeDuMontage", args: [em, e, n] });
    for (let n = 1; n <= IMAGES2.devoilement; n++) out.push({ fichier: `${d}/devoilement_${em}_${n}.svg`, fonction: "devoilementDuBatiment", args: [em, n] });
    for (const c of ["derriere", "devant"]) for (let n = 1; n <= IMAGES2.echafaudage; n++) out.push({ fichier: `${d}/echafaudage_${em}_${c}_${n}.svg`, fonction: "echafaudageDEvolution", args: [em, c, n] });
  }
  return out;
}
__name(liste, "liste");
export {
  CULTURES2 as CULTURES,
  EMPRISES,
  ETAPES,
  IMAGES2 as IMAGES,
  MS,
  MS_CULTURE,
  PART,
  PART_CULTURE,
  devoilementDuBatiment,
  echafaudageDEvolution,
  etapeDeCulture,
  etapeDuMontage,
  liste
};
