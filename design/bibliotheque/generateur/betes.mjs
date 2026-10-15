// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_betes.mjs : ne pas modifier à la main.
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

// personnages/refonte/membres.js
var require_membres = __commonJS({
  "personnages/refonte/membres.js"(exports, module) {
    var { OUT, W, r2: r22, shoe, frame } = require_troupe();
    function ik(a, t, l1, l2, s) {
      const dx = t[0] - a[0], dy = t[1] - a[1], d = Math.hypot(dx, dy) || 1e-6;
      const dd = Math.min(l1 + l2 - 1e-4, Math.max(Math.abs(l1 - l2) + 1e-4, d));
      const ux = dx / d, uy = dy / d;
      const x = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
      return { milieu: [a[0] + ux * x - uy * h * s, a[1] + uy * x + ux * h * s], bout: [a[0] + ux * dd, a[1] + uy * dd], plie: h > 0.2, tendu: d >= l1 + l2 - 1e-3 };
    }
    __name(ik, "ik");
    var cote = /* @__PURE__ */ __name((a, t, p) => (t[0] - a[0]) * (p[1] - a[1]) - (t[1] - a[1]) * (p[0] - a[0]) >= 0 ? 1 : -1, "cote");
    var DROIT = 0.88;
    function bras2os(c, a, b, coude) {
      const g = a[0] < 24, repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1];
      const L2 = c.brasL ? c.brasL[g ? 0 : 1] : Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
      const s = coude ? cote(a, b, coude) : cote(a, b, [a[0] + (g ? -10 : 10), a[1] + 2]);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d >= L2 * DROIT) {
        const m = d > L2 ? [a[0] + (b[0] - a[0]) / d * L2, a[1] + (b[1] - a[1]) / d * L2] : b;
        return { coude: null, main: m, decalage: [m[0] - b[0], m[1] - b[1]] };
      }
      const r = ik(a, b, L2 * 0.5, L2 * 0.5, s);
      return { coude: r.plie ? r.milieu : null, main: r.bout, decalage: [r.bout[0] - b[0], r.bout[1] - b[1]] };
    }
    __name(bras2os, "bras2os");
    var CUISSE = [16, 9, 0, -8, -16, -11, 1, 12];
    var LEVE = [0, 0, 0, 0, 0, 1.2, 1.9, 0.8];
    var BRAS = [-14, -10, 0, 10, 14, 10, 0, -10];
    var DEVANT = { se: [-0.62, 0.42], ne: [0.62, -0.42], front: [0, 0.3] };
    var phaseJambe = /* @__PURE__ */ __name((c, gauche, view) => (c.marcheN + (gauche === (view !== "ne") ? 0 : 4)) % 8, "phaseJambe");
    function osJambe(c, hanche, i, view) {
      const L2 = c.ground - c.hip, F = DEVANT[view] || DEVANT.front;
      const a = CUISSE[i] * Math.PI / 180;
      const au = L2 * Math.sin(a), av = L2 * Math.cos(a) - LEVE[i];
      const P = /* @__PURE__ */ __name((u, v) => [hanche[0] + u * F[0], hanche[1] + v + u * F[1]], "P");
      const ch = P(au, av), g = [(hanche[0] + ch[0]) / 2, (hanche[1] + ch[1]) / 2];
      return { genou: g, cheville: ch, plie: false, haut: av + LEVE[i] + au * F[1] };
    }
    __name(osJambe, "osJambe");
    function descente(c, view) {
      const L2 = c.ground - c.hip;
      return L2 - Math.max(...[true, false].map((g) => osJambe(c, [0, 0], phaseJambe(c, g, view), view).haut));
    }
    __name(descente, "descente");
    function brasMarche(c, a) {
      const view = c.view || "front", g = a[0] < 24, F = DEVANT[view] || DEVANT.front;
      const repos = c.hands[g ? 0 : 1], ep = c.shoulders[g ? 0 : 1], La = Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
      const i = (phaseJambe(c, g, view) + 4) % 8, al = BRAS[i] * Math.PI / 180;
      const ox = (repos[0] - ep[0]) / La, oy = Math.sqrt(Math.max(0, 1 - ox * ox));
      const u = La * Math.sin(al), dx = u * F[0], k = La * Math.cos(al);
      const versBuste = g ? dx > 0 : dx < 0;
      let hx = ox * k + (versBuste ? 0 : dx), hy = oy * k + u * F[1];
      const d = Math.hypot(hx, hy);
      if (d > La) {
        hx *= La / d;
        hy *= La / d;
      }
      return { coude: null, main: [a[0] + hx, a[1] + hy] };
    }
    __name(brasMarche, "brasMarche");
    function marcher(c, v, n, e) {
      const cc = { ...c, marcheN: n, view: v };
      const s = frame({ ...c, marcheN: n }, v, "marche", n, e);
      const reprise = r22(1 - Math.abs(Math.cos(n / 8 * Math.PI * 2)) + descente(cc, v));
      return reprise ? `<g transform="translate(0 ${reprise})">${s}</g>` : s;
    }
    __name(marcher, "marcher");
    function jambe(c, x, y, dir, tilt) {
      const view = c.view || "front", [lx, rx] = c.legX[view], base = x < 24 ? lx : rx;
      const avant = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const L2 = c.ground - c.hip;
      const hanche = [base, c.hip];
      if (c.marcheN != null) {
        const os = osJambe(c, hanche, phaseJambe(c, x < 24, view), view);
        return c.jambe ? c.jambe(c, r22(os.cheville[0]), r22(os.cheville[1]), dir, 0) : dessinJambe(c, hanche, os, dir, 0, avant);
      }
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
      tilt = tilt ? r22(tilt * 0.25) : 0;
      if (Math.abs(x - base) > 2.5) hanche[0] = x;
      const pivot = [x - (dir < 0 ? 3 : -3), y + 4.5], t = (tilt || 0) * Math.PI / 180;
      const cheville = tilt ? [pivot[0] + (x - pivot[0]) * Math.cos(t) - (y - pivot[1]) * Math.sin(t), pivot[1] + (x - pivot[0]) * Math.sin(t) + (y - pivot[1]) * Math.cos(t)] : [x, y];
      const s = avant ? cote(hanche, cheville, [hanche[0] + avant * 10, (hanche[1] + cheville[1]) / 2]) : 1;
      const r = avant ? ik(hanche, cheville, L2 * 0.5, L2 * 0.5, s) : { bout: [cheville[0], Math.min(cheville[1], c.ground)], milieu: [(base + cheville[0]) / 2, (c.hip + Math.min(cheville[1], c.ground)) / 2], plie: false };
      return dessinJambe(c, hanche, { genou: r.milieu, cheville: r.bout, plie: r.plie, pied: [x + (r.bout[0] - cheville[0]), y + (r.bout[1] - cheville[1])] }, dir, tilt, avant);
    }
    __name(jambe, "jambe");
    function dessinJambe(c, hanche, os, dir, tilt, avant) {
      const k = os.genou, [fx, fy] = os.cheville, [px, py] = os.pied || os.cheville;
      const plie = os.plie != null ? os.plie : Math.abs((k[0] - hanche[0]) * (fy - hanche[1]) - (k[1] - hanche[1]) * (fx - hanche[0])) > 1.2;
      const w = c.legW, pt = /* @__PURE__ */ __name((p) => `${r22(p[0])},${r22(p[1])}`, "pt");
      const len = Math.hypot(fx - k[0], fy - k[1]) || 1, bas = [fx + (fx - k[0]) / len * 1.2, fy + (fy - k[1]) / len * 1.2];
      const d = `M${pt(hanche)} L${pt(k)} L${pt(bas)}`;
      const bord = /* @__PURE__ */ __name((p, q, o2) => {
        const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = (q[1] - p[1]) / l, ny = -(q[0] - p[0]) / l, sx = nx < 0 ? -1 : 1;
        return [[p[0] + nx * o2 * sx, p[1] + ny * o2 * sx], [q[0] + nx * o2 * sx, q[1] + ny * o2 * sx]];
      }, "bord");
      const o = w / 2 - 0.85, [h1, k1] = bord(hanche, k, o), [k2, b2] = bord(k, [fx, fy], o);
      let out = `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r22(w + W * 2)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c.leg}" stroke-width="${r22(w)}" stroke-linejoin="round"/><path d="M${pt([h1[0], h1[1] + 0.6])} L${pt(k1)} L${pt(k2)} L${pt(b2)}" fill="none" stroke="${c.legS}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (plie) {
        const n = [k[0] - avant * 0.2, k[1]];
        out += `<path d="M${r22(n[0] - avant * 0.9)},${r22(n[1] - 0.5)} Q${r22(n[0] + avant * 0.4)},${r22(n[1])} ${r22(n[0] - avant * 0.9)},${r22(n[1] + 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".35"/>`;
      }
      const angle = r22(-Math.atan2(fx - hanche[0], fy - hanche[1]) * 180 / Math.PI);
      const cs = c.foot ? { ...c, jambeSeg: { hanche, cheville: [fx, fy], angle } } : c;
      return out + (c.foot ? c.foot(cs, px, py, dir, tilt, k) : shoe(c, px, py, dir, tilt));
    }
    __name(dessinJambe, "dessinJambe");
    function poserBras(c, a, b, elbow, main) {
      if (c.marcheN != null && !c.course && !elbow && main == null) {
        const m = brasMarche(c, a);
        return { b: [r22(m.main[0]), r22(m.main[1])], elbow: m.coude ? [r22(m.coude[0]), r22(m.coude[1])] : null, main };
      }
      if (c.course && !elbow && main == null) {
        const g = a[0] < 24, rest = c.hands[g ? 0 : 1], dx2 = b[0] - rest[0], dy2 = b[1] - rest[1];
        elbow = [r22(a[0] + (g ? -1.6 : 1.6) - dx2 * 0.5), r22(a[1] + 5.2 - dy2 * 0.35)];
        b = [r22(rest[0] + dx2 * 1.6 + (g ? 2.4 : -2.4)), r22(a[1] + 7 + dy2 * 1.4)];
      }
      const r = bras2os(c, a, b, elbow);
      const [dx, dy] = r.decalage;
      if (main != null && (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02)) main = `<g transform="translate(${r22(dx)} ${r22(dy)})">${main}</g>`;
      return { b: [r22(r.main[0]), r22(r.main[1])], elbow: r.coude ? [r22(r.coude[0]), r22(r.coude[1])] : null, main };
    }
    __name(poserBras, "poserBras");
    var BOMBE = 0.7;
    var dist = /* @__PURE__ */ __name((p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]), "dist");
    function ligneBras(a, coude, b) {
      const pts = [a];
      const quad = /* @__PURE__ */ __name((p, q, r, n) => {
        for (let i = 1; i <= n; i++) {
          const t = i / n, u = 1 - t;
          pts.push([u * u * p[0] + 2 * u * t * q[0] + t * t * r[0], u * u * p[1] + 2 * u * t * q[1] + t * t * r[1]]);
        }
      }, "quad");
      const vers = /* @__PURE__ */ __name((p, q, k) => {
        const d = dist(p, q) || 1;
        return [p[0] + (q[0] - p[0]) / d * k, p[1] + (q[1] - p[1]) / d * k];
      }, "vers");
      if (coude) {
        const rr = Math.min(2.4, 0.42 * Math.min(dist(a, coude), dist(coude, b)));
        const p1 = vers(coude, a, rr), p2 = vers(coude, b, rr);
        pts.push(p1);
        quad(p1, coude, p2, 5);
        pts.push(b);
      } else {
        const d = dist(a, b) || 1, nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d, sg = nx * (a[0] - 24) >= 0 ? 1 : -1;
        const bow = Math.min(BOMBE, d * 0.07);
        quad(a, [(a[0] + b[0]) / 2 + nx * sg * bow * 2, (a[1] + b[1]) / 2 + ny * sg * bow * 2], b, 8);
      }
      return pts.map((q) => [r22(q[0]), r22(q[1])]);
    }
    __name(ligneBras, "ligneBras");
    var longueurLigne = /* @__PURE__ */ __name((pts) => pts.slice(1).reduce((t, q, i) => t + dist(pts[i], q), 0), "longueurLigne");
    function pointLigne(pts, k) {
      let reste = Math.max(0, k);
      for (let i = pts.length - 1; i > 0; i--) {
        const q = pts[i], p = pts[i - 1], d = dist(p, q) || 1e-6;
        if (reste <= d || i === 1) {
          const t = Math.min(1, reste / d);
          return { p: [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t], u: [(q[0] - p[0]) / d, (q[1] - p[1]) / d] };
        }
        reste -= d;
      }
      return { p: pts[0], u: [0, 1] };
    }
    __name(pointLigne, "pointLigne");
    function sousLigne(pts, k0, k1) {
      const out = [pointLigne(pts, k0).p];
      let acc = 0;
      for (let i = pts.length - 1; i > 0; i--) {
        acc += dist(pts[i - 1], pts[i]);
        if (acc > k1 && acc < k0) out.splice(1, 0, pts[i - 1]);
      }
      out.push(pointLigne(pts, k1).p);
      return out;
    }
    __name(sousLigne, "sousLigne");
    function anneau(ligne, k0, k1, half, courbe = 0.3) {
      const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
      const arc = /* @__PURE__ */ __name((k, sens) => {
        const { p: m, u: [ux, uy] } = pointLigne(ligne, k), nx = -uy, ny = ux, bombe = half * courbe * uy;
        return { p: [m[0] + nx * half * sens, m[1] + ny * half * sens], q: [m[0] - nx * half * sens, m[1] - ny * half * sens], c: [m[0] + ux * bombe * 2, m[1] + uy * bombe * 2], bombe: [ux * bombe, uy * bombe] };
      }, "arc");
      const A = arc(k0, 1), B = arc(k1, -1);
      return {
        d: `M${pt(A.p)} Q${pt(A.c)} ${pt(A.q)} L${pt(B.p)} Q${pt(B.c)} ${pt(B.q)} Z`,
        bord: /* @__PURE__ */ __name((k) => {
          const e = arc(k, 1);
          return `M${pt(e.p)} Q${pt(e.c)} ${pt(e.q)}`;
        }, "bord"),
        bombe: arc((k0 + k1) / 2, 1).bombe
      };
    }
    __name(anneau, "anneau");
    function brasDuKit(c, a, b, elbow, main, partie = "tout") {
      const g = poserBras(c, a, b, elbow, main), T = require_troupe();
      const ligne = ligneBras(a, g.elbow, g.b);
      let milieu = ligne.slice(1, -1);
      if (c.sleeves || c.bandage) milieu = milieu.filter((q) => dist(q, g.b) > 6.5);
      const coude = milieu.length ? milieu : void 0;
      if (!c.cuff || c.sleeves || c.bandage) return T.arm({ ...c, bras: null }, a, g.b, coude, g.main, partie);
      let s = "";
      if (partie !== "devant") {
        const r = anneau(ligne, 2.5, 0.9, c.armW / 2 + 0.1);
        s += T.arm({ ...c, bras: null, cuff: null }, a, g.b, coude, g.main, "derriere") + `<path d="${r.d}" fill="${OUT}" stroke="${OUT}" stroke-width="${r22(W * 2)}" stroke-linejoin="round"/><path d="${r.d}" fill="${c.cuff}"/>`;
      }
      if (partie === "derriere") return s;
      return s + (g.main != null ? g.main : T.poing(c, g.b));
    }
    __name(brasDuKit, "brasDuKit");
    function avecOs(c) {
      const brasL = [0, 1].map((i) => Math.hypot(c.hands[i][0] - c.shoulders[i][0], c.hands[i][1] - c.shoulders[i][1]));
      const dessin = c.bras;
      const bras = dessin ? (cc, a, b, elbow, main, partie) => {
        const g = poserBras(cc, a, b, elbow, main);
        return dessin(cc, a, g.b, g.elbow || void 0, g.main, partie);
      } : brasDuKit;
      const o = { ...c, bras, jambeOs: jambe, os: true, brasL };
      if (c.hold) {
        const hold = /* @__PURE__ */ __name((cc, h, ctx) => c.hold(cc, poserBras(cc, cc.shoulders[1], h).b, ctx), "hold");
        Object.assign(hold, c.hold);
        o.hold = hold;
      }
      return o;
    }
    __name(avecOs, "avecOs");
    module.exports = { ik, cote, bras2os, jambe, marcher, brasMarche, poserBras, avecOs, anneau, ligneBras, pointLigne, sousLigne, longueurLigne };
  }
});

// personnages/troupe.js
var require_troupe = __commonJS({
  "personnages/troupe.js"(exports, module) {
    var OUT = "#3C2819";
    var W = 1.1;
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L2 = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L2(a, b, OUT, w + W * 2) + L2(a, b, fill, w), "limb");
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
    function dechirure(a, q, b, seed = 1) {
      const r = /* @__PURE__ */ __name((i) => {
        const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
        return v - Math.floor(v);
      }, "r");
      const tongues = [[0.24 + r(1) * 0.08, 2.5 + r(2) * 0.6, 0.11], [0.66 + r(3) * 0.08, 1.7 + r(4) * 0.5, 0.085]];
      const notches = [[0.45 + r(5) * 0.06, 0.55, 0.035], [0.88 - r(6) * 0.04, 0.5, 0.03]];
      const N2 = 40, pts = [], tips = [];
      for (let i = 1; i <= N2; i++) {
        const t = i / N2, u = 1 - t;
        const x = u * u * a[0] + 2 * u * t * q[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * q[1] + t * t * b[1];
        let dy = (r(10 + i) - 0.5) * 0.3 * (i < N2 ? 1 : 0);
        for (const [c, len, w] of tongues) {
          const z = Math.abs(t - c) / w;
          if (z < 1) dy += len * (1 - z * z) ** 1.6;
        }
        for (const [c, dep, w] of notches) {
          const z = Math.abs(t - c) / w;
          if (z < 1) dy -= dep * (1 - z);
        }
        pts.push([x, y + dy]);
      }
      for (const [c] of tongues) {
        const p = pts[Math.round(c * N2) - 1];
        tips.push(p);
      }
      return { d: pts.map(([x, y]) => `L${r22(x)},${r22(y)}`).join(" "), tips };
    }
    __name(dechirure, "dechirure");
    var filPendant = /* @__PURE__ */ __name((x, y, m = 1) => `<path d="M${r22(x)},${r22(y - 0.2)} q${r22(m * 0.45)},0.8 ${r22(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width=".45" stroke-linecap="round"/>`, "filPendant");
    var TRAITS = {
      homme: { browArch: 0.45, browLift: 0.35, browLen: 0.35, lashes: false },
      garcon: { browArch: 0.25, browLift: 0.15, browLen: 0.15, lashes: false },
      femme: { browArch: -0.2, browLift: -0.25, browLen: -0.15, lashes: true }
    };
    var EXPRS = ["neutre", "content", "rire", "surpris", "triste", "fache", "gene", "endormi"];
    var BROW = {
      neutre: [0, 0.1, -0.6],
      content: [-0.3, -0.2, -0.7],
      rire: [-0.6, -0.4, -0.8],
      surpris: [-1.4, -1.1, -1],
      triste: [-1.1, 0.6, 0],
      fache: [1.1, -0.6, 0],
      gene: [-0.7, 0.3, -0.2],
      endormi: [0.4, 0.4, -0.3],
      // soulagé (hors de la liste commune, pour une scène : 10_aster) : le bout intérieur des sourcils relevé (le
      // soulagement, FACS AU1), les yeux qui se ferment doucement, un petit sourire bouche fermée, les joues roses
      soulage: [-0.8, 0.2, -0.5]
    };
    var EYEMODE = { rire: "joy", endormi: "blink", surpris: "big", gene: "squeeze", triste: "sad", fache: "angry", soulage: "blink" };
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
      const [bi, bo, a0] = BROW[expr], arch = a0 + (g.browArch || 0);
      for (const [x, y, rx] of g.eyes) {
        const k = cx > x ? 1 : -1, hw = rx + 0.45 + (g.browLen || 0), by = y + g.browY + (g.browLift || 0);
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
      else if (expr === "soulage") {
        s += line(`M${r22(mx - w * 0.72)},${r22(my + 0.1)} Q${mx},${r22(my + w * 0.62)} ${r22(mx + w * 0.72)},${r22(my + 0.1)}`);
        for (const [x, rx] of g.cheeks) s += E(x, g.cheekY, rx * 1.2, 1.2, "#F08A8A", 0).replace("/>", ' opacity=".45"/>');
      }
      if (expr === "gene") {
        for (const [x, rx] of g.cheeks) for (const d of [-0.5, 0, 0.5]) s += L2([x + d * rx * 1.2 - 0.35, g.cheekY + 0.55], [x + d * rx * 1.2 + 0.35, g.cheekY - 0.55], "#D9605A", 0.45);
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
    var pivotPied = /* @__PURE__ */ __name((c, x, y, dir) => c.jambe ? `${r22(x)} ${r22(y + 0.6)}` : `${r22(x - (dir < 0 ? 3 : -3))} ${r22(y + 4.5)}`, "pivotPied");
    function shoe(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 3)},${r22(y)} L${r22(x + 3)},${r22(y)} L${r22(x + 3.3)},${r22(y + 3.6)} Q${r22(x - 0.4)},${r22(y + 5.4)} ${r22(x - 3.3 - toe)},${r22(y + 3.8)} Z`;
      const sole = `M${r22(x - 3.4 - toe)},${r22(y + 3.3)} Q${r22(x - 0.4)},${r22(y + 5)} ${r22(x + 3.4)},${r22(y + 3.1)} L${r22(x + 3.4)},${r22(y + 5.6)} L${r22(x - 3.4 - toe)},${r22(y + 5.6)} Z`;
      const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r22(x - 2.3)},${r22(y)} L${r22(x + 2.3)},${r22(y)} Q${r22(x + 2.9)},${r22(y + 3.4)} ${r22(x + 1.4)},${r22(y + 4.3)} L${r22(x - 1.4 - toe)},${r22(y + 4.3)} Q${r22(x - 3.1 - toe)},${r22(y + 3.8)} ${r22(x - 2.3)},${r22(y)} Z`;
      let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L2([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      if (c.jambeOs) return c.jambeOs(c, x, y, dir, tilt);
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
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
      if (c.bras) return c.bras(c, a, b, elbow, main, partie);
      const pts = enfoncer(elbow ? Array.isArray(elbow[0]) ? [a, ...elbow, b] : [a, elbow, b] : [a, b]);
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
            s += L2([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], "#C9BFA8", 0.45);
          }
          const t = at(4);
          s += L2(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT, 1.5) + L2(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], "#F4EEDF", 0.7);
        }
      }
      return s + (main != null ? main : poing(c, b));
    }
    __name(armOf, "armOf");
    function frame(c, view, pose, n, expr) {
      if (c.os && pose === "marche" && c.marcheN == null) return require_membres().marcher(c, view, n, expr);
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
      ctx.expr = expr || act && act.expr || (pose === "salut" ? "content" : c.repos || "neutre");
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
    module.exports = { OUT, W, r2: r22, st, P, E, L: L2, limb, clip, pivotPied, eyes, expression, visageVide, EXPRS, TRAITS, dechirure, filPendant, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// atelier/betes3.js
var require_betes3 = __commonJS({
  "atelier/betes3.js"(exports, module) {
    var { OUT, P, E, clip, r2: r22 } = require_troupe2();
    var Bt2 = require_betes();
    var { eye, heartIcon, limb, thick, stroke, line, hoof, paw, oreilleRenard, oreilleChat, toes, legShape, cloven, contact, tache } = Bt2;
    var SH = "rgba(40,55,20,.18)";
    var DEPTH = 0.62;
    var rot = /* @__PURE__ */ __name((x, y, cx, cy, a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
    }, "rot");
    function ear3(c, e, hx, hy, hr, side, far, back, pose) {
      const col = far ? c.headCS || c.furS : c.headC || c.fur, inner = e.inner || "#F2C6C0";
      const k = e.size || 1, sx = side;
      const g = /* @__PURE__ */ __name((body) => `<g transform="translate(${r22(hx)} ${r22(hy)}) scale(${sx} 1)">${body}</g>`, "g");
      const showIn = !back && !far;
      switch (e.kind) {
        case "pointy": {
          const x = hr * 0.48, y = -hr * 0.62;
          return g(P(`M${r22(x - hr * 0.42 * k)},${r22(y + 0.5)} L${r22(x + hr * 0.12 * k)},${r22(y - hr * 1 * k)} L${r22(x + hr * 0.46 * k)},${r22(y + hr * 0.18)} Z`, col, 0.9) + (showIn ? P(`M${r22(x - hr * 0.2 * k)},${r22(y + 0.2)} L${r22(x + hr * 0.1 * k)},${r22(y - hr * 0.66 * k)} L${r22(x + hr * 0.26 * k)},${r22(y + hr * 0.08)} Z`, inner, 0) : ""));
        }
        // chat : sur le dessus du crâne, penchée vers l'extérieur, derrière la tête (headQ3) ; celle du fond plus étroite
        case "chat":
          return g(oreilleChat(hr * 0.48, -hr * 0.66, hr * 0.34 * k * (far && !back ? 0.84 : 1), hr * 0.6 * k, 14, col, back ? null : inner, `oc3${c.id}${pose}${far ? "f" : "n"}`));
        // renard : derrière la tête (headQ3), penchée vers l'extérieur ; de face, celle du fond plus étroite (vue en biais)
        case "fox":
          return g(oreilleRenard(e, hr * 0.46, -hr * 0.56, hr * k * (far ? 0.94 : 1), 18, col, !back, `oe3${c.id}${back ? "d" : "a"}${pose}${far ? "f" : "n"}`, (e.w || 1) * (far && !back ? 0.82 : 1)));
        case "round":
          return g(E(hr * 0.55, -hr * 0.78, hr * 0.36 * k, hr * 0.36 * k, col, 0.9) + (showIn ? E(hr * 0.55, -hr * 0.78, hr * 0.19 * k, hr * 0.19 * k, inner, 0) : ""));
        case "side": {
          const x = hr * 0.72, y = -hr * 0.42;
          return g(P(`M${r22(x)},${r22(y - hr * 0.18)} Q${r22(x + hr * 0.7 * k)},${r22(y - hr * 0.5)} ${r22(x + hr * 1.12 * k)},${r22(y - hr * 0.08)} Q${r22(x + hr * 0.66 * k)},${r22(y + hr * 0.42)} ${r22(x)},${r22(y + hr * 0.22)} Z`, col, 0.9) + (showIn ? E(x + hr * 0.6 * k, y, hr * 0.28 * k, hr * 0.12, inner, 0) : ""));
        }
        case "flop": {
          const x = hr * 0.42, y = -hr * 0.72;
          return g(P(`M${r22(x - hr * 0.3)},${r22(y + 0.4)} L${r22(x + hr * 0.18)},${r22(y - hr * 0.5 * k)} L${r22(x + hr * 0.62 * k)},${r22(y + hr * 0.42)} Z`, col, 0.9));
        }
        case "hang": {
          const h = /* @__PURE__ */ __name((x, y) => `${r22(x * hr)},${r22(y * hr)}`, "h");
          const col2 = far ? mixDark(e.color || c.furS) : e.color || c.furS;
          return g(P(`M${h(0.5, -0.8)} Q${h(1.12, -0.92)} ${h(1.16, -0.1 + 0.2 * (k - 1))} Q${h(1.2, 0.5 * k)} ${h(0.96, 0.54 * k)} Q${h(0.76, 0.42 * k)} ${h(0.76, -0.24)} Z`, col2, 0.9) + (showIn ? `<path d="M${h(0.86, -0.5)} Q${h(1.02, -0.1)} ${h(0.98, 0.34 * k)}" fill="none" stroke="${mixDark(e.color || c.furS)}" stroke-width="0.6" stroke-linecap="round"/>` : ""));
        }
        case "long": {
          const x = hr * 0.36, y = -hr * 0.66;
          return g(`<g transform="rotate(${r22(12 + (far ? 8 : 0))} ${r22(x)} ${r22(y)})">${P(`M${r22(x - hr * 0.3)},${r22(y)} Q${r22(x - hr * 0.5)},${r22(y - hr * 2.2 * k)} ${r22(x + hr * 0.02)},${r22(y - hr * 2.3 * k)} Q${r22(x + hr * 0.5)},${r22(y - hr * 2.2 * k)} ${r22(x + hr * 0.3)},${r22(y)} Z`, col, 0.9)}${showIn ? E(x, y - hr * 1.2 * k, hr * 0.14, hr * 0.8 * k, inner, 0) : ""}</g>`);
        }
        default:
          return "";
      }
    }
    __name(ear3, "ear3");
    function quad3(c, view, pose) {
      if (c.trois) return c.trois(c, view, pose);
      const se = view === "avant";
      const walk = pose === "marche1" || pose === "marche2";
      const rest = pose === "repos" || pose === "clignement";
      const ph = pose === "marche2" ? -1 : 1;
      const lg = c.legs;
      const drop = rest ? c.restDrop ?? -lg.top * 0.75 : 0;
      const bob = pose === "marche2" ? -0.4 : 0;
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const [bx0, by0, brx, bry] = c.body;
      const [hx0, hy0, hr0] = c.head;
      const t3 = c.t3 || {};
      const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
      const Lh = brx * (t3.len ?? 0.78), W = t3.wid ?? Math.max(bry * 0.5, lg.w + 0.6);
      const by = by0 + drop + bob;
      const ang = Math.atan2(F[1], F[0]) * (t3.tilt ?? 0.55);
      const rx = Lh + W * 0.35, ry = bry * (t3.tall ?? 1.04);
      const egg = (se ? 1 : -1) * (t3.egg ?? 0.12);
      const reach = (hx0 - bx0) * (t3.reach ?? 0.62);
      const hr = hr0 * (se ? 1.04 : 0.98);
      const hx = F[0] * reach * (se ? 1 : 0.9) + (t3.hdx || 0), hy = by + (hy0 - by0) * (se ? 1 : 0.82) + F[1] * reach * 0.55 + (se ? 0.8 : 0.6) + (rest ? drop * ((c.headDrop ?? 0.8) - 1) : 0) + (t3.hdy || 0);
      const ctx = { pose, view, se, rest, walk, ph, mode, by, hx, hy, hr, rx, ry, ang, F, S, Lh, W, drop, egg };
      ctx.at = (u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang);
      const fa = Lh * (t3.feet ?? 0.72), sw = W * 0.78;
      const swing = walk ? 1.4 : 0;
      const legs = [];
      for (const front of [true, false]) for (const near of [true, false]) {
        const a = front ? fa : -fa, s2 = near ? sw : -sw;
        const diag = front === near ? 1 : -1;
        const st = swing * ph * diag;
        const sx = F[0] * (a + st) + S[0] * s2, sy = (F[1] * a + S[1] * s2) * DEPTH + F[1] * st * 0.35;
        const hx_ = F[0] * a * 0.9 + S[0] * s2 * 0.7, hy_ = by + ry * 0.5 + (F[1] * a + S[1] * s2) * DEPTH * 0.9;
        legs.push({ front, near, foot: [sx, sy - 0.6], hip: [hx_, hy_] });
      }
      const legSvg = /* @__PURE__ */ __name((l) => {
        if (rest) return "";
        const col = l.near ? lg.color || c.fur : lg.colorS || c.furS;
        const [fx, fy] = l.foot;
        if (lg.shape) {
          const sh = lg.shape, w0 = lg.w * (l.front ? sh.arm ?? 1.15 : sh.haunch ?? 1.5), w1 = lg.w * (sh.foot ?? 0.78);
          const hip = [l.hip[0], l.hip[1] - (l.front ? sh.armUp ?? 0.6 : sh.hipUp ?? 1.2)];
          const end = lg.hoof ? (lg.cloven ? cloven : hoof)(fx, fy + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(fx + F[0] * 0.3, fy + 0.2, lg.w * 0.72, lg.paw) : "";
          return (l.near ? contact(fx + 0.2, lg.w * 0.75) : "") + legShape(hip, [fx, fy], w0, w1, l.front ? -(sh.knee ?? 0.3) * 0.6 : (sh.hock ?? 0.8) * 0.7, col, l.near) + end;
        }
        const shine = l.near ? line([l.hip[0] - lg.w * 0.2, l.hip[1] + 1.2], [fx - lg.w * 0.2, fy - 1.6], lg.w * 0.26, "rgba(255,255,255,.35)") : "";
        return limb(l.hip, [fx, fy], lg.w, col) + shine + (lg.hoof ? hoof(fx, fy + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(fx + F[0] * 0.3, fy + 0.2, lg.w * 0.72, lg.paw) : "");
      }, "legSvg");
      let s = "";
      {
        const [cx, cy] = [0, 0.2];
        s += `<ellipse cx="${cx}" cy="${cy}" rx="${r22(rx * 0.95)}" ry="${r22(Math.max(2.2, W * 0.95))}" fill="${SH}" transform="rotate(${r22(ang * 180 / Math.PI)} ${cx} ${cy})"/>`;
      }
      for (const l of legs.filter((l2) => !l2.near).sort((a, b) => a.foot[1] - b.foot[1])) s += legSvg(l);
      if (lg.shape && !rest) for (const l of legs.filter((l2) => l2.near).sort((a, b) => a.foot[1] - b.foot[1])) s += legSvg(l);
      const head = headQ3(c, ctx);
      if (!se) s += head;
      const tl = tail3(c, ctx);
      if (se) s += tl;
      s += c.p3?.back ? c.p3.back(ctx) : "";
      const bodyPath = (() => {
        const pts = [];
        for (let i = 0; i < 36; i++) {
          const t = i / 36 * Math.PI * 2;
          pts.push(rot(Math.cos(t) * rx, by + Math.sin(t) * ry * (1 + egg * Math.cos(t)), 0, by, ang));
        }
        return "M" + pts.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L") + " Z";
      })();
      const id = `q3${c.id}${view}${pose}`;
      s += P(bodyPath, c.fur) + clip(
        id,
        bodyPath,
        // ventre (dessous du corps) et flanc éloigné plus sombre, reflet sur le dos
        `<ellipse cx="${r22(F[0] * 0.5)}" cy="${r22(by + ry * 0.92)}" rx="${r22(rx * 0.95)}" ry="${r22(ry * 0.5)}" fill="${c.belly || c.furS}"/><ellipse cx="${r22(-S[0] * W * 1.1)}" cy="${r22(by - S[1] * W * 0.4)}" rx="${r22(rx * 0.7)}" ry="${r22(ry * 1.1)}" fill="${c.furS}" opacity="0.45"/>` + (c.p3?.coat ? c.p3.coat(ctx) : "") + `<path d="M${r22(-rx * 0.55)},${r22(by - ry * 0.6 + F[1] * -rx * 0.3)} Q0,${r22(by - ry * 0.98)} ${r22(rx * 0.45)},${r22(by - ry * 0.7 + F[1] * rx * 0.3)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`
      ) + P(bodyPath, "none");
      if (rest) for (const l of legs.filter((l2) => l2.near)) {
        const [fx, fy] = l.foot;
        s += E(fx * 0.8, Math.min(fy, by + ry) - 0.4, lg.w * 0.95, 1, lg.color || c.fur, 0.9) + (lg.cloven ? cloven(fx * 0.8 + lg.w * 0.5, Math.min(fy, by + ry) - 0.2, lg.w * 0.4, lg.hoof) : "");
      }
      else if (!lg.shape) for (const l of legs.filter((l2) => l2.near).sort((a, b) => a.foot[1] - b.foot[1])) s += legSvg(l);
      s += c.p3?.body ? c.p3.body(ctx) : "";
      if (!se) s += tl;
      if (se) s += head;
      if (pose === "joie" && se) s += heartIcon(hx + hr * 0.1, hy - hr * 2 - 1.4 - (t3.heartUp || 0));
      return s;
    }
    __name(quad3, "quad3");
    function tail3(c, ctx) {
      if (c.p3?.tail) return c.p3.tail(ctx);
      const t = c.tail || {};
      const { se, by, rx, ry, ang, walk, ph } = ctx;
      const [x, y] = se ? ctx.at(-0.9, -0.45) : ctx.at(-0.86, -0.2);
      const w = walk ? ph * 0.8 : 0;
      const k = se ? -1 : 0.35;
      switch (t.kind) {
        case "tuft":
          return thick(`M${r22(x + 0.6)},${r22(y)} Q${r22(x + k * 2.4)},${r22(y + 0.8)} ${r22(x + k * 2.4 + w)},${r22(y + 5.4)}`, 0.8, c.fur) + E(x + k * 2.4 + w, y + 6, 1.1, 1.5, t.color || c.furS, 0.8);
        case "puff":
          return E(x + (se ? -0.6 : 0.6), y + (se ? 0 : 1), t.r || 1.8, t.r || 1.8, t.color || c.belly || "#FFFFFF", 0.9);
        case "curly": {
          const [cx, cy] = ctx.at(-1, 0.05);
          const d = se ? `M${r22(cx + 0.8)},${r22(cy)} q-1.8,0.2 -1.8,-1.4 q0.2,-1.2 1.2,-0.6 q0.6,0.8 -0.4,1.3` : `M${r22(x + 0.4)},${r22(y)} q-1.8,0.4 -1.6,2 q0.4,1.4 1.6,0.6 q0.8,-1 -0.4,-1.6`;
          return stroke(d, 2.4, OUT) + stroke(d, 0.9, c.fur);
        }
        case "short":
          return se ? P(`M${r22(x + 0.6)},${r22(y)} L${r22(x - 1.8)},${r22(y - 2.6 + w * 0.4)} L${r22(x + 0.8)},${r22(y + 1.2)} Z`, t.color || c.fur, 0.9) : P(`M${r22(x - 0.6)},${r22(y)} L${r22(x + 0.2)},${r22(y - 2.8 + w * 0.4)} L${r22(x + 1.2)},${r22(y + 0.2)} Z`, t.color || c.fur, 0.9);
        case "thin": {
          const up = t.up || 5;
          const d = se ? `M${r22(x + 0.6)},${r22(y + 0.4)} Q${r22(x - 3.2)},${r22(y - 0.4)} ${r22(x - 2.8 + w)},${r22(y - up)}` : `M${r22(x)},${r22(y + 0.6)} Q${r22(x - 2.2)},${r22(y - 1)} ${r22(x - 1.2 + w)},${r22(y - up)}`;
          return thick(d, t.w || 1.2, t.color || c.fur);
        }
        case "bushy": {
          const L0 = (t.len || 9) * (se ? 0.85 : 0.9), up = t.up ?? 0.4;
          const tip = se ? [x - L0 * 0.8, y - L0 * up - 1 + w] : [x - L0 * 0.55, y - L0 * up - 2 + w];
          const d = `M${r22(x + 1)},${r22(y - 1.2)} Q${r22((x + tip[0]) / 2)},${r22(Math.min(y, tip[1]) - 3)} ${r22(tip[0])},${r22(tip[1])} Q${r22((x + tip[0]) / 2 - 0.6)},${r22(y + 3.2 + w * 0.5)} ${r22(x + 1.2)},${r22(y + 1.8)} Z`;
          return P(d, c.fur) + clip(`t3${c.id}${ctx.view}${ph}${walk}`, d, `<circle cx="${r22(tip[0])}" cy="${r22(tip[1])}" r="${r22(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P(d, "none");
        }
        case "horse":
          return thick(`M${r22(x)},${r22(y - 0.6)} Q${r22(x + k * 3)},${r22(y + 1.4)} ${r22(x + k * 2.4 + w)},${r22(y + 8)}`, 2.2, t.color) + stroke(`M${r22(x + k * 0.6)},${r22(y + 1.2)} Q${r22(x + k * 2.6)},${r22(y + 4)} ${r22(x + k * 2.4 + w)},${r22(y + 7)}`, 0.5, OUT);
        // queues basses (salamandre, loutre) : de dos, elles viennent vers nous, en bas à gauche
        case "lizard":
          return se ? thick(`M${r22(x + 1)},${r22(y + 0.8)} Q${r22(x - 3.6)},${r22(y + 2.4)} ${r22(x - 5.6 + w)},${r22(-2.9)}`, t.w || 1.8, c.fur) : thick(`M${r22(x + 1.2)},${r22(y + 1)} Q${r22(x - 2.4)},${r22(y + 2.6)} ${r22(x - 4.4 + w)},${r22(1.6)}`, t.w || 1.8, c.fur);
        case "spiral":
          return thick(`M${r22(x + 1)},${r22(y + 0.6)} Q${r22(x - 3.6)},${r22(y + 1)} ${r22(x - 4)},${r22(y + 3.6)} Q${r22(x - 3.8)},${r22(y + 5.8)} ${r22(x - 2)},${r22(y + 5.2)} Q${r22(x - 1.4)},${r22(y + 3.8)} ${r22(x - 2.6)},${r22(y + 3.6)}`, 1.4, c.fur);
        case "otter": {
          const kd = se ? -1 : -0.75, dy = se ? 3.6 : 5.4;
          return P(`M${r22(x + 1)},${r22(y - 1)} Q${r22(x + kd * 4)},${r22(y + 0.6)} ${r22(x + kd * 6 + w)},${r22(y + dy)} Q${r22(x + kd * 3)},${r22(y + dy - 0.4)} ${r22(x + 1.4)},${r22(y + 1.8)} Z`, c.fur);
        }
        default:
          return "";
      }
    }
    __name(tail3, "tail3");
    function headQ3(c, ctx) {
      const { se, hx, hy, hr, mode } = ctx;
      const e = c.ears || {};
      const derriere = e.kind === "fox" || e.kind === "chat";
      let s = "";
      if (se) {
        s += ear3(c, e, hx, hy, hr, 1, true, false, ctx.pose);
        if (derriere) s += ear3(c, e, hx, hy, hr, -1, false, false, ctx.pose);
        s += c.p3?.neck ? c.p3.neck(ctx) : neck3(c, ctx);
        s += c.p3?.behindHead ? c.p3.behindHead(ctx) : "";
        s += E(hx, hy, hr * (c.headW || 1), hr, c.headC || c.fur);
        s += c.p3?.face ? c.p3.face(ctx) : "";
        const truffe = ["pointy", "hang", "long", "round", "fox", "chat"].includes(e.kind);
        const sx = hx + hr * 0.3, sy = hy + hr * 0.44;
        if (c.snout) {
          const [, , srx, sry, col] = c.snout;
          s += truffe ? E(sx, sy, srx * 0.98, sry * 0.82, col || c.belly, 0.9) : E(sx, sy - hr * 0.02, srx * 0.92, sry * 1.02, col || c.belly, 0.9);
        }
        if (c.nose) {
          const [, , nr, col] = c.nose;
          if (truffe) {
            const nx = sx + hr * 0.08, ny = sy - (c.snout ? c.snout[3] * 0.38 : 0), w = nr * 1.5, h = nr * 1.15;
            s += P(`M${r22(nx - w)},${r22(ny - h * 0.5)} Q${r22(nx)},${r22(ny - h * 0.85)} ${r22(nx + w)},${r22(ny - h * 0.5)} Q${r22(nx + w * 0.4)},${r22(ny + h * 0.75)} ${r22(nx)},${r22(ny + h * 0.75)} Q${r22(nx - w * 0.4)},${r22(ny + h * 0.75)} ${r22(nx - w)},${r22(ny - h * 0.5)} Z`, col || OUT, 0.5) + `<path d="M${r22(nx)},${r22(ny + h * 0.7)} L${r22(nx)},${r22(ny + h * 1.5)} M${r22(nx - w * 1.1)},${r22(ny + h * 1.3)} Q${r22(nx - w * 0.5)},${r22(ny + h * 2)} ${r22(nx)},${r22(ny + h * 1.5)} Q${r22(nx + w * 0.5)},${r22(ny + h * 2)} ${r22(nx + w * 1.1)},${r22(ny + h * 1.3)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`;
          } else s += E(hx + hr * 0.42, hy + hr * 0.28, nr * 1.2, nr * 0.9, col || OUT, 0.6);
        }
        const [, edy, er] = c.eye;
        if (c.iris && mode === "open") s += E(hx - hr * 0.34, hy + edy * 0.9, er * 1.1, er * 1.32, c.iris, 0.5) + E(hx + hr * 0.4, hy + edy * 0.9 - 0.2, er * 0.97, er * 1.16, c.iris, 0.5);
        s += eye(hx - hr * 0.34, hy + edy * 0.9, er, mode) + eye(hx + hr * 0.4, hy + edy * 0.9 - 0.2, er * 0.88, mode);
        if (c.blush !== false) s += E(hx - hr * 0.52, hy + edy + er * 1.6, er * 0.85, er * 0.42, "#F7A8B0", 0);
        if (!derriere) s += ear3(c, e, hx, hy, hr, -1, false, false, ctx.pose);
        s += c.p3?.head ? c.p3.head(ctx) : "";
      } else {
        s += c.p3?.neck ? c.p3.neck(ctx) : neck3(c, ctx);
        s += ear3(c, e, hx, hy, hr, 1, true, true, ctx.pose);
        if (derriere) s += ear3(c, e, hx, hy, hr, -1, false, true, ctx.pose);
        s += c.p3?.behindHead ? c.p3.behindHead(ctx) : "";
        s += E(hx, hy, hr * (c.headW || 1), hr, c.headC || c.fur);
        s += E(hx - hr * 0.2, hy + hr * 0.35, hr * 0.7, hr * 0.45, c.headCS || c.furS, 0).replace("fill=", 'opacity="0.45" fill=');
        if (!derriere) s += ear3(c, e, hx, hy, hr, -1, false, true, ctx.pose);
        s += c.p3?.head ? c.p3.head(ctx) : "";
      }
      return s;
    }
    __name(headQ3, "headQ3");
    function neck3(c, ctx) {
      const { se, by, rx, ry, ang, hx, hy, hr } = ctx;
      const [nx, ny] = rot(rx * 0.62, by - ry * 0.35, 0, by, ang);
      const dist = Math.hypot(hx - nx, hy - ny);
      if (dist < hr * 0.7) return "";
      const w = hr * (c.t3?.neckW ?? 1.25);
      return thick(`M${r22(nx)},${r22(ny)} L${r22(hx - (se ? 0.4 : 0))},${r22(hy + hr * 0.2)}`, w, c.fur);
    }
    __name(neck3, "neck3");
    function bird3(c, view, pose) {
      const se = view === "avant";
      const walk = pose === "marche1" || pose === "marche2";
      const rest = pose === "repos" || pose === "clignement";
      const ph = pose === "marche2" ? -1 : 1;
      const lg = c.legs;
      const drop = rest ? -lg.top * 0.85 : 0;
      const bob = pose === "marche2" ? -0.4 : 0;
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const [bx0, by0, brx, bry] = c.body;
      const [hx0, hy0, hr0] = c.head;
      const t3 = c.t3 || {};
      const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
      const by = by0 + drop + bob;
      const rx = brx * ((se ? null : t3.lenDos) ?? t3.len ?? 0.82), ry = bry * (t3.tall ?? 1.02), ang = Math.atan2(F[1], F[0]) * 0.35;
      const egg = (se ? 1 : -1) * 0.1;
      const reach = (hx0 - bx0) * (se ? 0.6 : 0.5);
      const hr = hr0 * (se ? 1.04 : 0.98);
      const hx = F[0] * reach, hy = by + (hy0 - by0) + F[1] * reach * 0.5 + (se ? 0.5 : 0.4) + (walk ? ph * 0.3 : 0);
      const ctx = { pose, view, se, rest, walk, ph, mode, by, hx, hy, hr, rx, ry, ang, F, S, drop, egg };
      ctx.at = (u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang);
      const bodyPath = (() => {
        const pts = [];
        for (let i = 0; i < 36; i++) {
          const t = i / 36 * Math.PI * 2;
          pts.push(rot(Math.cos(t) * rx, by + Math.sin(t) * ry * (1 + egg * Math.cos(t)), 0, by, ang));
        }
        return "M" + pts.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L") + " Z";
      })();
      let s = `<ellipse cx="0" cy="0.2" rx="${r22(rx * 0.95)}" ry="${r22(Math.max(1.4, rx * 0.4))}" fill="${SH}"/>`;
      const legOf = /* @__PURE__ */ __name((near) => {
        if (rest) return "";
        const sw = (lg.spread ?? 1.2) * (near ? 1 : -1), st = walk ? (near ? ph : -ph) * 0.9 : 0;
        const fx = S[0] * sw + F[0] * st, fy = (S[1] * sw + F[1] * st) * 0.62;
        const top = [S[0] * sw * 0.7, by + ry * (near ? 0.9 : 0.7) + S[1] * sw * 0.5];
        const col = near ? lg.color : mixDark(lg.color);
        const toe = /* @__PURE__ */ __name((dx, dy) => stroke(`M${r22(fx)},${r22(fy - 0.5)} l${r22(dx)},${r22(dy)}`, 1.5, OUT) + stroke(`M${r22(fx)},${r22(fy - 0.5)} l${r22(dx)},${r22(dy)}`, 0.6, col), "toe");
        return (lg.fine ? contact(fx + 0.3, 1.3) : "") + limb(top, [fx, fy - 0.5], (lg.w || 0.7) * (lg.fine ? 0.8 : 1), col) + toe(F[0] * 1.4, F[1] * 1.4 + 0.2) + toe(F[0] * 0.6 - S[0] * 0.8, 0.4) + toe(F[0] * 0.6 + S[0] * 0.8, 0.5) + (lg.fine ? toe(-F[0] * 0.9, -F[1] * 0.9 + 0.1) : "");
      }, "legOf");
      s += legOf(false);
      const tail = /* @__PURE__ */ __name(() => {
        const t = c.tail || {};
        const [tx, ty] = ctx.at(-0.88, -0.1);
        const L0 = t.len || 3.6, up = t.up ?? 4.6, col = t.color || c.wing;
        if (t.kind === "fan") {
          if (se) return P(`M${r22(tx + 1.2)},${r22(ty + 1)} L${r22(tx - L0 * 0.6)},${r22(ty - up)} Q${r22(tx + 0.6)},${r22(ty - up - 1.4)} ${r22(tx + 2)},${r22(ty - 1.2)} Z`, col);
          const [qx, qy] = ctx.at(-0.55, -0.35);
          return P(`M${r22(qx + 1.8)},${r22(qy + 1.6)} L${r22(qx - 1.6)},${r22(qy - up * 0.75)} Q${r22(qx - 0.2)},${r22(qy - up - 0.8)} ${r22(qx + 1)},${r22(qy - up * 0.7)} Q${r22(qx + 2.2)},${r22(qy - up * 0.95)} ${r22(qx + 3)},${r22(qy - up * 0.45)} L${r22(qx + 3.2)},${r22(qy + 1)} Z`, col) + `<path d="M${r22(qx + 1.4)},${r22(qy + 0.6)} L${r22(qx - 0.2)},${r22(qy - up * 0.6)} M${r22(qx + 2.2)},${r22(qy + 0.4)} L${r22(qx + 1.6)},${r22(qy - up * 0.6)}" stroke="${OUT}" stroke-width="0.4" opacity="0.6"/>`;
        }
        if (t.kind === "sickle") {
          const sway = walk ? ph * 0.35 : 0;
          if (se) return Bt2.faucilles(tx + 1.4, ty - 0.2, t.colors, 0.95, 1, sway);
          const [qx, qy] = ctx.at(-0.5, -0.4);
          return [[-3.2, -5, 3.3, 1, -1], [-0.4, -6.4, 3.6, 0, -0.4], [2.2, -4.8, 3.1, 1, 0.8]].map(([dx, dy, w, i, b]) => Bt2.legShape([qx, qy + 1.4], [qx + dx + sway, qy + dy], w, 0.6, b, t.colors[i], false, 0.75)).join("");
        }
        if (t.kind === "long") return se ? P(`M${r22(tx + 1.4)},${r22(ty - 0.8)} L${r22(tx - L0 * 0.8)},${r22(ty - L0 * 0.25)} L${r22(tx + 1.2)},${r22(ty + 1.6)} Z`, col) : P(`M${r22(tx + 1.2)},${r22(ty)} L${r22(tx - L0 * 0.45)},${r22(ty + L0 * 0.55)} L${r22(tx + 2.4)},${r22(ty + 1.4)} Z`, col);
        return "";
      }, "tail");
      const head = headB3(c, ctx);
      if (se) s += tail();
      if (!se) s += head;
      const id = `b3${c.id}${view}${pose}`;
      s += P(bodyPath, c.color) + clip(id, bodyPath, (se ? `<ellipse cx="${r22(rx * 0.35)}" cy="${r22(by + ry * 0.35)}" rx="${r22(rx * 0.72)}" ry="${r22(ry * 0.78)}" fill="${c.belly || c.color}"/>` : `<ellipse cx="${r22(-rx * 0.2)}" cy="${r22(by + ry * 0.75)}" rx="${r22(rx * 0.7)}" ry="${r22(ry * 0.45)}" fill="${c.belly || c.color}" opacity="0.7"/>`) + (c.p3?.coat ? c.p3.coat(ctx) : "")) + P(bodyPath, "none");
      {
        const wingUp = walk && ph < 0 ? -0.5 : 0;
        const [ax, ay] = se ? ctx.at(-0.25, -0.1) : ctx.at(0.35, 0.05);
        const d = se ? `M${r22(ax + rx * 0.45)},${r22(ay - ry * 0.3 + wingUp)} Q${r22(ax - rx * 0.1)},${r22(ay - ry * 0.55 + wingUp)} ${r22(ax - rx * 0.62)},${r22(ay - ry * 0.05)} Q${r22(ax - rx * 0.55)},${r22(ay + ry * 0.55)} ${r22(ax + rx * 0.2)},${r22(ay + ry * 0.45)} Q${r22(ax + rx * 0.5)},${r22(ay + ry * 0.1)} ${r22(ax + rx * 0.45)},${r22(ay - ry * 0.3 + wingUp)} Z` : `M${r22(ax - rx * 0.3)},${r22(ay - ry * 0.4 + wingUp)} Q${r22(ax + rx * 0.25)},${r22(ay - ry * 0.55 + wingUp)} ${r22(ax + rx * 0.5)},${r22(ay - ry * 0.05)} Q${r22(ax + rx * 0.42)},${r22(ay + ry * 0.5)} ${r22(ax - rx * 0.05)},${r22(ay + ry * 0.48)} Q${r22(ax - rx * 0.38)},${r22(ay + ry * 0.05)} ${r22(ax - rx * 0.3)},${r22(ay - ry * 0.4 + wingUp)} Z`;
        if (c.wingKind === "plume") s += se ? Bt2.ailePlume(ctx.at(0.4, -0.2).map((n, k) => n + (k ? wingUp : 0)), ctx.at(-0.78, 0.05), ry * 0.72, c.wing, `ap3${c.id}${view}${pose}`) : (() => {
          const ts = [-1.15, -0.8, -0.45, -0.1, 0.25, 0.6, 0.95], f = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1] + wingUp)}`, "f");
          const out = ts.map((t) => ctx.at(Math.cos(t) * 1.02, Math.sin(t) * 1.02)), inn = ts.slice().reverse().map((t, i) => ctx.at(Math.cos(t) * (0.55 + i % 2 * 0.08), Math.sin(t) * 0.8));
          const d2 = `M${f(out[0])} ` + out.slice(1).map((q) => `L${f(q)}`).join(" ") + " " + inn.map((q, i) => i % 2 ? `Q${f(inn[i - 1])} ${f(q)}` : `L${f(q)}`).join(" ") + " Z";
          return P(d2, c.wing, 0.9) + stroke(`M${f(ctx.at(Math.cos(-0.9) * 0.88, Math.sin(-0.9) * 0.88))} Q${f(ctx.at(0.9, 0))} ${f(ctx.at(Math.cos(0.8) * 0.8, Math.sin(0.8) * 0.8))}`, 0.8, tone3(c.wing, 1.25)) + [-0.3, 0.2, 0.6].map((t) => stroke(`M${f(ctx.at(Math.cos(t) * 0.92, Math.sin(t) * 0.92))} L${f(ctx.at(Math.cos(t) * 0.68, Math.sin(t) * 0.78))}`, 0.45, "rgba(60,40,25,.55)")).join("");
        })();
        else s += P(d, c.wing, 0.9);
      }
      s += c.p3?.body ? c.p3.body(ctx) : "";
      s += legOf(true);
      if (!se) s += tail();
      if (se) s += head;
      if (pose === "joie" && se) s += heartIcon(hx, hy - hr - 2.4, 1.2);
      return s;
    }
    __name(bird3, "bird3");
    function tone3(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      const f = /* @__PURE__ */ __name((v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, "0"), "f");
      return `#${f(n >> 16)}${f(n >> 8 & 255)}${f(n & 255)}`;
    }
    __name(tone3, "tone3");
    function mixDark(hex) {
      const n = parseInt(hex.slice(1), 16);
      const f = /* @__PURE__ */ __name((v) => Math.round(v * 0.78).toString(16).padStart(2, "0"), "f");
      return `#${f(n >> 16)}${f(n >> 8 & 255)}${f(n & 255)}`;
    }
    __name(mixDark, "mixDark");
    function beak3(b, ctx) {
      const { se, hx, hy, hr } = ctx;
      const L0 = b.len || 2.4, col = b.color || "#F2B33B";
      if (!se && b.kind === "big") {
        const x2 = hx + hr * 0.7, y2 = hy + 0.4;
        return P(`M${r22(x2 - 0.6)},${r22(y2 - 1.9)} Q${r22(x2 + L0 * 0.4)},${r22(y2 - 2)} ${r22(x2 + L0 * 0.62)},${r22(y2 - 0.6)} Q${r22(x2 + L0 * 0.3)},${r22(y2 + 0.8)} ${r22(x2 - 0.4)},${r22(y2 + 1.3)} Z`, col, 0.8) + `<path d="M${r22(x2 + L0 * 0.5)},${r22(y2 - 1)} L${r22(x2 + L0 * 0.62)},${r22(y2 - 0.6)}" stroke="${b.tip || OUT}" stroke-width="1"/>`;
      }
      if (!se) {
        const x2 = hx + hr * 0.82, y2 = hy + (b.dy || 0.4) * 0.6;
        return P(`M${r22(x2 - 0.6)},${r22(y2 - 0.8)} L${r22(x2 + L0 * 0.55)},${r22(y2 - 0.5)} L${r22(x2 - 0.4)},${r22(y2 + 0.7)} Z`, b.kind === "puffin" ? "#F07A3A" : col, 0.8);
      }
      const x = hx + hr * 0.45, y = hy + hr * 0.22 + (b.dy || 0) * 0.5;
      const tip = [x + L0 * 0.7, y + L0 * 0.42];
      switch (b.kind) {
        case "long": {
          const L1 = L0 * 0.9, dx = 0.9, dy = 0.44, nx = -0.44, ny = 0.9, w = 0.75;
          const bx = hx + hr * 0.45, by_ = hy + hr * 0.2, tx = bx + dx * L1, ty = by_ + dy * L1;
          return P(`M${r22(bx - nx * w)},${r22(by_ - ny * w)} L${r22(tx)},${r22(ty)} L${r22(bx + nx * w)},${r22(by_ + ny * w)} Z`, col, 0.5) + `<path d="M${r22(bx)},${r22(by_)} L${r22(tx - dx * 0.3)},${r22(ty - dy * 0.3)}" stroke="${OUT}" stroke-width="0.3"/>`;
        }
        case "big":
          return P(`M${r22(x - 1)},${r22(y - 2)} Q${r22(tip[0])},${r22(tip[1] - 3)} ${r22(tip[0])},${r22(tip[1])} Q${r22(x + L0 * 0.3)},${r22(y + 2.2)} ${r22(x - 0.8)},${r22(y + 1.4)} Z`, col, 0.9) + `<path d="M${r22(tip[0] - 1)},${r22(tip[1] - 1.2)} L${r22(tip[0])},${r22(tip[1])}" stroke="${b.tip || OUT}" stroke-width="1.2"/><path d="M${r22(x - 0.6)},${r22(y)} Q${r22(x + L0 * 0.4)},${r22(y + 0.2)} ${r22(tip[0] - 0.2)},${r22(tip[1] - 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
        case "puffin":
          return P(`M${r22(x - 0.8)},${r22(y - 2)} Q${r22(tip[0] + 0.4)},${r22(y - 1)} ${r22(tip[0])},${r22(tip[1])} Q${r22(x + L0 * 0.3)},${r22(y + 2.4)} ${r22(x - 0.8)},${r22(y + 1.8)} Z`, "#F07A3A", 0.9) + P(`M${r22(x - 0.8)},${r22(y - 2)} L${r22(x + 0.4)},${r22(y - 1.7)} L${r22(x + 0.4)},${r22(y + 1.9)} L${r22(x - 0.8)},${r22(y + 1.8)} Z`, "#3E6FB8", 0) + `<path d="M${r22(x + 1.2)},${r22(y - 1.2)} Q${r22(x + 2)},${r22(y + 0.4)} ${r22(x + 1.4)},${r22(y + 1.8)}" fill="none" stroke="#F2C94C" stroke-width="0.6"/>`;
        default: {
          const L1 = Math.max(2.5, L0 * 1.15), dx = 0.84, dy = 0.54, nx = -0.54, ny = 0.84, w = Math.max(1.3, L0 * 0.5);
          const bx = hx + hr * 0.42, by_ = hy + hr * 0.22, tx = bx + dx * L1, ty = by_ + dy * L1;
          return P(`M${r22(bx - nx * w)},${r22(by_ - ny * w)} L${r22(tx)},${r22(ty)} L${r22(bx + nx * w)},${r22(by_ + ny * w)} Z`, col, 0.5) + `<path d="M${r22(bx)},${r22(by_)} L${r22(tx - dx * 0.2)},${r22(ty - dy * 0.2)}" stroke="${OUT}" stroke-width="0.3"/>`;
        }
      }
    }
    __name(beak3, "beak3");
    function headB3(c, ctx) {
      const { se, hx, hy, hr, mode } = ctx;
      let s = "";
      if (c.neck3) s += c.neck3(ctx);
      s += c.p3?.behindHead ? c.p3.behindHead(ctx) : "";
      s += E(hx, hy, hr, hr, c.headColor || c.color);
      if (se) {
        s += c.p3?.face ? c.p3.face(ctx) : "";
        const [, edy, er] = c.eye;
        s += eye(hx - hr * 0.3, hy + edy, er, mode) + eye(hx + hr * 0.36, hy + edy - 0.25, er * 0.85, mode);
        if (c.blush !== false) s += E(hx - hr * 0.45, hy + edy + er * 1.5, er * 0.8, er * 0.4, "#F7A8B0", 0);
        s += beak3(c.beak, ctx);
      } else {
        s += E(hx - hr * 0.15, hy + hr * 0.3, hr * 0.7, hr * 0.45, "#000000", 0).replace("fill=", 'opacity="0.08" fill=');
        s += beak3(c.beak, ctx);
      }
      s += c.p3?.head ? c.p3.head(ctx) : "";
      return s;
    }
    __name(headB3, "headB3");
    var P3 = {};
    P3.cow = (c) => {
      const patch = c.tail.color;
      const corne = /* @__PURE__ */ __name((b, t, col, k = 1) => {
        const dx = t[0] - b[0], dy = t[1] - b[1], L0 = Math.hypot(dx, dy), nx = -dy / L0 * k, ny = dx / L0 * k, w = 1.25;
        const m = [b[0] + dx * 0.5 + nx * 1, b[1] + dy * 0.5 + ny * 1];
        return P(`M${r22(b[0] - nx * w)},${r22(b[1] - ny * w)} Q${r22(m[0] - nx * w * 0.9)},${r22(m[1] - ny * w * 0.9)} ${r22(t[0])},${r22(t[1])} Q${r22(m[0] + nx * w * 0.35)},${r22(m[1] + ny * w * 0.35)} ${r22(b[0] + nx * w)},${r22(b[1] + ny * w)} Z`, col, 0.9) + `<path d="M${r22(t[0] - dx * 0.06)},${r22(t[1] - dy * 0.06)} L${r22(t[0] - dx * 0.22)},${r22(t[1] - dy * 0.22)}" stroke="#C9B48E" stroke-width="0.7" stroke-linecap="round"/>`;
      }, "corne");
      return {
        // taches irrégulières : sur la croupe, au milieu du flanc proche, une près du poitrail
        coat: /* @__PURE__ */ __name((x) => (x.se ? [[-0.45, -0.3, 0.34, 0.38, 1], [0.2, 0.15, 0.24, 0.28, 2], [-0.8, 0.35, 0.15, 0.2, 3]] : [[0.4, -0.3, 0.32, 0.36, 1], [-0.25, 0.1, 0.27, 0.32, 2], [0.85, 0.3, 0.13, 0.17, 3]]).map(([u, v, ru, rv, k]) => {
          const [px, py] = x.at(u, v);
          return tache(px, py, ru * x.rx, rv * x.ry, k, patch);
        }).join(""), "coat"),
        face: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? tache(hx + hr * 0.12, hy - hr * 0.62, hr * 0.42, hr * 0.28, 4, patch) : tache(hx - hr * 0.1, hy - hr * 0.48, hr * 0.44, hr * 0.32, 4, patch), "face"),
        // les cornes derrière le crâne (il cache leur base), en V, chacune se recourbe vers l'extérieur puis vers le haut
        behindHead: /* @__PURE__ */ __name(({ hx, hy, hr }) => corne([hx - hr * 0.42, hy - hr * 0.72], [hx - hr * 0.95, hy - hr - 2.6], "#E8DABA", -1) + corne([hx + hr * 0.42, hy - hr * 0.76], [hx + hr * 0.95, hy - hr - 2.6], "#F2E6C8"), "behindHead"),
        // de trois quarts avant : les deux naseaux et la bouche sur le mufle, les cils
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr, mode }) => se ? E(hx + hr * 0.12, hy + hr * 0.44, 0.5, 0.7, "#B5625C", 0) + E(hx + hr * 0.5, hy + hr * 0.4, 0.45, 0.62, "#B5625C", 0) + stroke(`M${r22(hx + hr * 0.08)},${r22(hy + hr * 0.72)} Q${r22(hx + hr * 0.3)},${r22(hy + hr * 0.86)} ${r22(hx + hr * 0.52)},${r22(hy + hr * 0.7)}`, 0.5, OUT) + (mode === "open" ? stroke(`M${r22(hx - hr * 0.5)},${r22(hy + c.eye[1] * 0.9 - c.eye[2] * 1.05)} l-0.65,-0.65 M${r22(hx + hr * 0.24)},${r22(hy + c.eye[1] * 0.9 - c.eye[2] * 1.05)} l0.5,-0.7`, 0.42, OUT) : "") : "", "head"),
        // la queue en corde qui pend le long de la croupe, son toupet
        tail: /* @__PURE__ */ __name((x) => {
          const w = x.walk ? x.ph * 0.7 : 0, [a, b] = x.se ? x.at(-0.92, -0.35) : x.at(-0.86, -0.25), k = x.se ? -1 : 0.5;
          const ex = a + k * 1.6 + w, ey = b + 6;
          return thick(`M${r22(a + 0.3)},${r22(b)} Q${r22(a + k * 2.2)},${r22(b + 2.4)} ${r22(ex)},${r22(ey)}`, 0.75, c.fur) + P(`M${r22(ex - 0.9)},${r22(ey - 0.6)} Q${r22(ex - 1.5)},${r22(ey + 1.6)} ${r22(ex + 0.1)},${r22(ey + 2.6)} Q${r22(ex + 1.4)},${r22(ey + 1.4)} ${r22(ex + 0.8)},${r22(ey - 0.6)} Z`, patch, 0.8);
        }, "tail"),
        // le pis, sous le ventre, entre les pattes arrière
        back: /* @__PURE__ */ __name((x) => {
          if (x.rest) return "";
          const [px, py] = x.at(-0.3, 0.88), y0 = py;
          return P(`M${r22(px - 2.2)},${r22(y0)} Q${r22(px - 2.2)},${r22(y0 + 2.3)} ${r22(px)},${r22(y0 + 2.4)} Q${r22(px + 2.2)},${r22(y0 + 2.3)} ${r22(px + 2.2)},${r22(y0)} Z`, "#F6BDB6", 0.8) + E(px - 1, y0 + 2.5, 0.36, 0.55, "#E89A94", 0.5) + E(px + 1.1, y0 + 2.5, 0.36, 0.55, "#E89A94", 0.5);
        }, "back")
      };
    };
    P3.sheep = (c) => {
      const wool = c.fur, woolS = c.furS;
      const cloud = /* @__PURE__ */ __name((x) => {
        let o = "";
        for (let i = 0; i < 12; i++) {
          const t = i / 12 * Math.PI * 2;
          const [px, py] = x.at(Math.cos(t) * 0.92, Math.sin(t) * 0.86);
          o += E(px, py, 2.5, 2.3, wool, 0.9);
        }
        const [cx, cy] = x.at(0, 0);
        return o + `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(x.rx * 0.95)}" ry="${r22(x.ry * 0.9)}" fill="${wool}" transform="rotate(${r22(x.ang * 180 / Math.PI)} ${r22(cx)} ${r22(cy)})"/>` + E(cx - 1.4, cy - x.ry * 0.5, 3, 1.3, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.45" fill=') + E(cx + 0.6, cy + x.ry * 0.55, x.rx * 0.6, 1.3, woolS, 0).replace("fill=", 'fill-opacity="0.55" fill=');
      }, "cloud");
      return {
        body: cloud,
        // la touffe de laine sur le front (de dos : sur la nuque)
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? E(hx - hr * 0.05, hy - hr * 0.8, hr * 0.55, hr * 0.38, wool, 0.9) + E(hx + hr * 0.42, hy - hr * 0.88, hr * 0.32, hr * 0.28, wool, 0.9) + E(hx - hr * 0.55, hy - hr * 0.7, hr * 0.3, hr * 0.26, wool, 0.9) + stroke(`M${r22(hx + hr * 0.1)},${r22(hy + hr * 0.3)} q0.35,0.15 0.5,0.55 M${r22(hx + hr * 0.52)},${r22(hy + hr * 0.26)} q-0.35,0.15 -0.45,0.55`, 0.5, "#1E1A1E") + stroke(`M${r22(hx + hr * 0.12)},${r22(hy + hr * 0.66)} Q${r22(hx + hr * 0.32)},${r22(hy + hr * 0.78)} ${r22(hx + hr * 0.52)},${r22(hy + hr * 0.64)}`, 0.42, "#1E1A1E") : E(hx, hy - hr * 0.55, hr * 0.7, hr * 0.5, wool, 0.9) + E(hx + hr * 0.3, hy - hr * 0.9, hr * 0.36, hr * 0.3, wool, 0.9), "head")
      };
    };
    P3.pig = (c) => {
      const tach = c.id.endsWith("tachete");
      return {
        coat: /* @__PURE__ */ __name((x) => tach ? (x.se ? [[-0.4, -0.25, 0.3, 0.32, 1], [0.3, 0.2, 0.2, 0.24, 2], [-0.8, 0.3, 0.13, 0.15, 3]] : [[0.4, -0.2, 0.28, 0.32, 1], [-0.3, 0.15, 0.24, 0.28, 2]]).map(([u, v, ru, rv, k]) => {
          const [px, py] = x.at(u, v);
          return Bt2.tache(px, py, ru * x.rx, rv * x.ry, k, "#8A5A5A");
        }).join("") : "", "coat"),
        face: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => tach && se ? Bt2.tache(hx - hr * 0.42, hy - hr * 0.38, hr * 0.3, hr * 0.26, 4, "#8A5A5A") : "", "face"),
        // les deux oreilles sur le haut du crâne, qui retombent vers l'avant ; le groin rond de face, deux narines
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => {
          const o = /* @__PURE__ */ __name((sx, k) => Bt2.oreilleCochon(hx + sx * hr * 0.3, hy - hr * 0.78, k, sx, c.fur, se ? "#EE9EA6" : null), "o");
          return (se ? E(hx + hr * 0.32, hy + hr * 0.4, hr * 0.42, hr * 0.34, "#F29EA0", 0.9) + E(hx + hr * 0.2, hy + hr * 0.4, 0.42, 0.58, "#B8686A", 0) + E(hx + hr * 0.46, hy + hr * 0.38, 0.4, 0.55, "#B8686A", 0) + stroke(`M${r22(hx + hr * 0.12)},${r22(hy + hr * 0.84)} Q${r22(hx + hr * 0.32)},${r22(hy + hr * 0.94)} ${r22(hx + hr * 0.52)},${r22(hy + hr * 0.82)}`, 0.45, OUT) : "") + o(-1, se ? 1.05 : 1) + o(1, se ? 0.95 : 1);
        }, "head")
      };
    };
    P3.goat = (c) => {
      const corne = /* @__PURE__ */ __name((bx, by, sx, k, col) => {
        const t = [bx + sx * 1.6 * k, by - 4.4 * k], m = [bx + sx * 0.2 * k, by - 3.4 * k];
        return P(`M${r22(bx - 1)},${r22(by + 0.3)} Q${r22(m[0] - sx * 1.1)},${r22(m[1])} ${r22(t[0])},${r22(t[1])} Q${r22(m[0] + sx * 0.9)},${r22(m[1] + 0.2)} ${r22(bx + 1)},${r22(by - 0.1)} Z`, col, 0.85) + [0.35, 0.6].map((u) => `<path d="M${r22(bx + (m[0] - bx) * u - 0.8)},${r22(by + (m[1] - by) * u)} L${r22(bx + (m[0] - bx) * u + 0.8)},${r22(by + (m[1] - by) * u - 0.3)}" stroke="rgba(60,40,25,.45)" stroke-width="0.45" stroke-linecap="round"/>`).join("");
      }, "corne");
      return {
        behindHead: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? corne(hx + hr * 0.38, hy - hr * 0.78, 1, 0.9, "#A8987C") + corne(hx - hr * 0.32, hy - hr * 0.76, -1, 1, "#C8B898") : corne(hx + hr * 0.3, hy - hr * 0.7, 1, 0.95, "#C8B898") + corne(hx - hr * 0.35, hy - hr * 0.7, -1, 0.95, "#C8B898"), "behindHead"),
        // barbiche en deux mèches, naseaux et bouche, cils
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr, mode }) => se ? P(`M${r22(hx + hr * 0.02)},${r22(hy + hr * 0.82)} Q${r22(hx - hr * 0.06)},${r22(hy + hr * 1.3)} ${r22(hx + hr * 0.12)},${r22(hy + hr * 1.62)} Q${r22(hx + hr * 0.26)},${r22(hy + hr * 1.3)} ${r22(hx + hr * 0.36)},${r22(hy + hr * 1.5)} Q${r22(hx + hr * 0.5)},${r22(hy + hr * 1.1)} ${r22(hx + hr * 0.52)},${r22(hy + hr * 0.8)} Z`, c.furS, 0.75) + E(hx + hr * 0.14, hy + hr * 0.42, 0.42, 0.6, "#4A3C34", 0) + E(hx + hr * 0.46, hy + hr * 0.38, 0.38, 0.55, "#4A3C34", 0) + stroke(`M${r22(hx + hr * 0.1)},${r22(hy + hr * 0.66)} Q${r22(hx + hr * 0.3)},${r22(hy + hr * 0.78)} ${r22(hx + hr * 0.5)},${r22(hy + hr * 0.64)}`, 0.45, OUT) + (mode === "open" ? stroke(`M${r22(hx - hr * 0.5)},${r22(hy + c.eye[1] * 0.9 - c.eye[2] * 1.05)} l-0.6,-0.6`, 0.42, OUT) : "") : "", "head")
      };
    };
    P3.cat = (c) => ({
      // rayures en travers du dos (chats tigrés) ; taches rousse et noire (blanc taché)
      coat: /* @__PURE__ */ __name((x) => c.taches ? (() => {
        const [a1, b1] = x.at(-0.3, -0.6), [a2, b2] = x.at(0.25, -0.7);
        return E(a1, b1, 2, 1.4, c.taches[0], 0) + E(a2, b2, 1.3, 1, c.taches[1], 0);
      })() : !c.rayures ? "" : [-0.55, -0.15, 0.25].map((u) => {
        const [a1, b1] = x.at(u, -0.95), [a2, b2] = x.at(u + 0.08, -0.25);
        return `<path d="M${r22(a1)},${r22(b1)} Q${r22((a1 + a2) / 2 + 0.8)},${r22((b1 + b2) / 2)} ${r22(a2)},${r22(b2)}" fill="none" stroke="${c.furS}" stroke-width="0.9"/>`;
      }).join(""), "coat"),
      // la queue monte en S, le bout recourbé vers l'avant : au fond de trois quarts avant, sur la croupe de dos
      tail: /* @__PURE__ */ __name((x) => {
        const w = x.walk ? x.ph * 0.8 : 0, tw = (c.tail || {}).w || 1.3;
        if (x.se) {
          const [a2, b2] = x.at(-0.9, -0.45);
          return thick(`M${r22(a2 + 0.6)},${r22(b2 + 0.4)} C${r22(a2 - 3)},${r22(b2 - 0.2)} ${r22(a2 - 4 + w * 0.4)},${r22(b2 - 4)} ${r22(a2 - 3 + w)},${r22(b2 - 6.8)} Q${r22(a2 - 2.4 + w)},${r22(b2 - 8.2)} ${r22(a2 - 1.2 + w)},${r22(b2 - 7.6)}`, tw, c.fur);
        }
        const [a, b] = x.at(-0.86, -0.2);
        return thick(`M${r22(a)},${r22(b + 0.6)} C${r22(a - 1.6)},${r22(b - 1)} ${r22(a - 2.4 + w * 0.4)},${r22(b - 4.4)} ${r22(a - 1.6 + w)},${r22(b - 7)} Q${r22(a - 1 + w)},${r22(b - 8.4)} ${r22(a + 0.2 + w)},${r22(b - 7.8)}`, tw, c.fur);
      }, "tail"),
      // moustaches des deux côtés du museau
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? [[-1, 0.3], [-1, 0.75], [1, 0.25], [1, 0.7]].map(([d, dy]) => {
        const x0 = hx + hr * 0.3 + d * hr * 0.42, y0 = hy + hr * 0.4 + dy * 0.4;
        return `<path d="M${r22(x0)},${r22(y0)} L${r22(x0 + d * hr * 0.55)},${r22(y0 + (dy - 0.5) * 1.6)}" stroke="${c.moustache || OUT}" stroke-width="0.35"/>`;
      }).join("") : "", "head")
    });
    P3.dog = (c) => {
      const band = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1.3" stroke-linecap="round"/>`, "band");
      return {
        // le collier rouge et sa médaille, au cou : la tête le cache en partie
        neck: /* @__PURE__ */ __name((x) => {
          const { se, hx, hy, hr } = x;
          return neck3(c, x) + (se ? band(`M${r22(hx - hr * 0.75)},${r22(hy + hr * 0.62)} Q${r22(hx + hr * 0.05)},${r22(hy + hr * 1.3)} ${r22(hx + hr * 0.8)},${r22(hy + hr * 0.58)}`) + E(hx + hr * 0.05, hy + hr * 1.32, 0.7, 0.7, "#F2C94C", 0.5) : band(`M${r22(hx - hr * 0.85)},${r22(hy + hr * 0.4)} Q${r22(hx)},${r22(hy + hr * 1.05)} ${r22(hx + hr * 0.8)},${r22(hy + hr * 0.45)}`));
        }, "neck")
      };
    };
    P3.hen = (c) => ({
      // la crête à quatre lobes sur le dessus de la tête, les deux barbillons sous le bec ; la poule grise a des mouchetures
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => {
        const y0 = hy - hr + 0.7;
        const comb = `M${r22(hx - 1.9)},${r22(y0 + 0.4)} Q${r22(hx - 2.3)},${r22(y0 - 1.4)} ${r22(hx - 1.5)},${r22(y0 - 1.5)} Q${r22(hx - 1.2)},${r22(y0 - 2.6)} ${r22(hx - 0.5)},${r22(y0 - 2.2)} Q${r22(hx - 0.1)},${r22(y0 - 2.9)} ${r22(hx + 0.5)},${r22(y0 - 2)} Q${r22(hx + 1.2)},${r22(y0 - 2.3)} ${r22(hx + 1.4)},${r22(y0 - 1.4)} Q${r22(hx + 2)},${r22(y0 - 0.8)} ${r22(hx + 1.5)},${r22(y0 + 0.5)} Z`;
        return P(comb, "#E8483C", 0.7) + (se ? E(hx + hr * 0.42, hy + hr * 0.98, 0.6, 0.95, "#E8483C", 0.6) + E(hx + hr * 0.78, hy + hr * 0.92, 0.5, 0.82, "#D63A30", 0.6) : "");
      }, "head"),
      coat: /* @__PURE__ */ __name((x) => c.id === "hengrise" ? [[-0.5, -0.3], [0.1, -0.55], [0.45, 0.1], [-0.2, 0.35]].map(([u, v]) => {
        const [px, py] = x.at(u, v);
        return E(px, py, 0.5, 0.5, "#FFFFFF", 0);
      }).join("") : "", "coat")
    });
    P3.chick = () => ({ head: /* @__PURE__ */ __name(({ hx, hy, hr }) => P(`M${r22(hx - 0.3)},${r22(hy - hr + 0.2)} Q${r22(hx - 0.5)},${r22(hy - hr - 1.4)} ${r22(hx + 0.7)},${r22(hy - hr - 0.6)}`, "none", 0.6), "head") });
    P3.deer = (c) => {
      c.t3 = { ...c.t3 || {}, heartUp: 3.4 };
      const antler = /* @__PURE__ */ __name((d) => thick(d, 0.9, "#E6D2A8"), "antler");
      return {
        // taches blanches sur le dos
        coat: /* @__PURE__ */ __name((x) => [[-0.5, -0.65], [-0.15, -0.75], [0.2, -0.68], [-0.32, -0.4], [0.05, -0.45]].map(([u, v]) => {
          const [px, py] = x.at(u, v);
          return E(px, py, 0.8, 0.55, "#FFF4E0", 0);
        }).join(""), "coat"),
        // les bois : deux ramures en V, chacune avec un andouiller
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => {
          const one = /* @__PURE__ */ __name((sx, k) => {
            const bx = hx + sx * hr * 0.32, by = hy - hr * 0.85;
            return antler(`M${r22(bx)},${r22(by)} Q${r22(bx + sx * 1.2 * k)},${r22(by - 3)} ${r22(bx + sx * 0.6 * k)},${r22(by - 5.6)} M${r22(bx + sx * 0.9 * k)},${r22(by - 2.6)} L${r22(bx + sx * 3 * k)},${r22(by - 3.6)}`);
          }, "one");
          return se ? one(1, 0.9) + one(-1, 1) : one(1, 1) + one(-1, 0.95);
        }, "head")
      };
    };
    P3.fox = (c) => ({
      // joues et menton blancs ; de dos, le bout blanc de la queue suffit
      face: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? E(hx + hr * 0.28, hy + hr * 0.5, hr * 0.62, hr * 0.42, c.belly, 0) : "", "face")
    });
    P3.kit = P3.fox;
    P3.fennec = P3.fox;
    P3.snowFox = () => ({});
    P3.hedgehog = (c) => ({
      // le dôme de piquants : une demi-ellipse hérissée posée sur le dos, de la croupe jusque derrière la tête
      body: /* @__PURE__ */ __name((x) => {
        const [cx, cy] = x.at(-0.22, 0.25), a = x.rx * 1.08, b = x.ry * 1.55, n = 17;
        const pt = /* @__PURE__ */ __name((t, k) => rot(cx + Math.cos(t) * a * k, cy - Math.sin(t) * b * k, cx, cy, x.ang), "pt");
        let d = "";
        for (let i = 0; i <= n; i++) {
          const t = Math.PI * (0.02 + i / n * 0.96);
          const [px, py] = pt(Math.PI - t, i % 2 ? 0.8 : 1);
          d += `${i ? "L" : "M"}${r22(px)},${r22(py)} `;
        }
        const [ex, ey] = pt(0, 0.62), [sx, sy] = pt(Math.PI, 0.7);
        d += `L${r22(ex)},${r22(ey + 1)} Q${r22(cx)},${r22(cy + 2.2)} ${r22(sx)},${r22(sy + 1)} Z`;
        const hl = [0.35, 0.55, 0.75].map((t) => {
          const [p1x, p1y] = pt(Math.PI * t, 0.45), [p2x, p2y] = pt(Math.PI * t, 0.72);
          return `M${r22(p1x)},${r22(p1y)} L${r22(p2x)},${r22(p2y)}`;
        }).join(" ");
        return P(d, "#8A6440") + stroke(hl, 0.6, "#B88A5A");
      }, "body")
    });
    P3.squirrel = (c) => ({
      // (dessiné à part : ecureuil3 ; ces pièces ne servent plus qu'aux autres appels)
      tail: /* @__PURE__ */ __name((x) => {
        const [tx, ty] = x.se ? x.at(-0.85, -0.3) : x.at(-0.8, -0.1);
        const w = x.walk ? x.ph * 0.6 : 0;
        const d = `M${r22(tx + 1)},${r22(ty - 1)} C${r22(tx - 4)},${r22(ty - 1)} ${r22(tx - 6.5 + w)},${r22(ty - 8)} ${r22(tx - 3.5 + w)},${r22(ty - 11.5)} C${r22(tx - 1.5 + w)},${r22(ty - 13.5)} ${r22(tx + 1.8 + w)},${r22(ty - 12)} ${r22(tx + 1.2 + w)},${r22(ty - 9.4)} C${r22(tx - 0.4 + w)},${r22(ty - 10.8)} ${r22(tx - 2.8 + w)},${r22(ty - 10)} ${r22(tx - 2.8 + w)},${r22(ty - 7.4)} C${r22(tx - 2.8)},${r22(ty - 4.4)} ${r22(tx - 0.4)},${r22(ty - 2.6)} ${r22(tx + 1.4)},${r22(ty + 1)} Z`;
        return P(d, c.fur) + clip(`sq${x.view}${x.pose}`, d, `<ellipse cx="${r22(tx - 2 + w)}" cy="${r22(ty - 11)}" rx="3.4" ry="2.6" fill="${c.tail.tip}"/>`) + P(d, "none") + stroke(`M${r22(tx - 1.2)},${r22(ty - 3)} Q${r22(tx - 3.6 + w)},${r22(ty - 6.6)} ${r22(tx - 3.2 + w)},${r22(ty - 9.6)}`, 0.6, c.furS);
      }, "tail"),
      // le gland tenu au repos, sous le menton
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr, rest }) => rest && se ? E(hx + hr * 0.15, hy + hr * 1.2, 1.3, 1.5, "#A8743F", 0.7) + E(hx + hr * 0.15, hy + hr * 0.92, 1.4, 0.7, "#7E5530", 0.6) : "", "head")
    });
    P3.otter = (c) => ({
      face: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? E(hx + hr * 0.25, hy + hr * 0.45, hr * 0.72, hr * 0.5, c.belly, 0) : "", "face"),
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? [[-1, 0.3], [-1, 0.7], [1, 0.25], [1, 0.65]].map(([d, dy]) => {
        const x0 = hx + hr * 0.25 + d * hr * 0.45, y0 = hy + hr * 0.5 + dy * 0.4;
        return `<path d="M${r22(x0)},${r22(y0)} L${r22(x0 + d * hr * 0.5)},${r22(y0 + (dy - 0.5) * 1.4)}" stroke="${OUT}" stroke-width="0.35"/>`;
      }).join("") : "", "head")
    });
    P3.ibex = (c) => {
      c.t3 = { ...c.t3 || {}, heartUp: 4.4 };
      const hornC = "#C8B48E";
      const horn = /* @__PURE__ */ __name((bx, by, sx, k) => {
        const d = `M${r22(bx)},${r22(by)} Q${r22(bx + sx * 1.2 * k)},${r22(by - 6 * k)} ${r22(bx - sx * 3.6 * k)},${r22(by - 6.6 * k)} Q${r22(bx - sx * 6.4 * k)},${r22(by - 5.8 * k)} ${r22(bx - sx * 6 * k)},${r22(by - 2.6 * k)}`;
        return thick(d, 1.8, hornC) + [0.3, 0.5, 0.7].map((t) => E(bx - sx * (t * 6 - 1) * k, by - 6.2 * k + Math.abs(t - 0.5) * 2, 1, 0.32, "#8A7656", 0)).join("");
      }, "horn");
      return {
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? horn(hx + hr * 0.3, hy - hr * 0.82, -1, 0.85) + horn(hx - hr * 0.25, hy - hr * 0.8, 1, 1) + P(`M${r22(hx + hr * 0.15)},${r22(hy + hr * 0.82)} L${r22(hx + hr * 0.02)},${r22(hy + hr * 1.55)} L${r22(hx + hr * 0.52)},${r22(hy + hr * 0.86)} Z`, "#5A4A3A", 0.7) : horn(hx - hr * 0.3, hy - hr * 0.78, 1, 1) + horn(hx + hr * 0.3, hy - hr * 0.8, 1, 0.9), "head")
      };
    };
    P3.pony = (c) => {
      c.t3 = { ...c.t3 || {}, reach: 0.78, hdy: -2.6, neckW: 1.1 };
      const mane = "#F2D28A";
      return {
        // la crinière le long du cou, la mèche sur le front
        neck: /* @__PURE__ */ __name((x) => {
          const { se, by, rx, ry, ang, hx, hy, hr } = x;
          const [nx, ny] = rot(rx * 0.62, by - ry * 0.35, 0, by, ang);
          const base = neck3(c, x);
          const m = se ? thick(`M${r22(hx - hr * 0.55)},${r22(hy - hr * 0.6)} Q${r22((hx + nx) / 2 - 2.2)},${r22((hy + ny) / 2 - 1)} ${r22(nx - 1.4)},${r22(ny - 0.4)}`, 2.4, mane) : thick(`M${r22(hx - hr * 0.2)},${r22(hy - hr * 0.7)} Q${r22((hx + nx) / 2 - 1.2)},${r22((hy + ny) / 2 - 1.4)} ${r22(nx - 0.6)},${r22(ny - 0.8)}`, 2.6, mane);
          return base + m;
        }, "neck"),
        head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => se ? P(`M${r22(hx - hr * 0.35)},${r22(hy - hr * 0.95)} Q${r22(hx + hr * 0.2)},${r22(hy - hr * 1.1)} ${r22(hx + hr * 0.3)},${r22(hy - hr * 0.35)} Q${r22(hx)},${r22(hy - hr * 0.55)} ${r22(hx - hr * 0.45)},${r22(hy - hr * 0.5)} Z`, mane, 0.8) : thick(`M${r22(hx - hr * 0.15)},${r22(hy - hr * 0.85)} Q${r22(hx - hr * 0.75)},${r22(hy)} ${r22(hx - hr * 1.1)},${r22(hy + hr * 1.3)}`, 2.6, mane), "head")
      };
    };
    P3.camel = (c) => (c.t3 = { ...c.t3 || {}, reach: 0.84, hdy: -2.4 }, {
      // la bosse sur le dos
      back: /* @__PURE__ */ __name((x) => {
        const [px, py] = x.at(-0.08, -0.85);
        return E(px, py, x.rx * 0.5, x.ry * 0.62, c.fur);
      }, "back"),
      // le long cou en S, du poitrail à la tête
      neck: /* @__PURE__ */ __name((x) => {
        const { se, hx, hy, hr } = x;
        const [nx, ny] = x.at(0.75, -0.2);
        return thick(`M${r22(nx)},${r22(ny)} Q${r22(nx + (se ? 3.4 : 2.6))},${r22(ny - 1)} ${r22(hx - hr * 0.3)},${r22(hy + hr * 0.5)}`, 3, c.fur);
      }, "neck")
    });
    P3.tortoise = (c) => ({
      // la carapace bombée à écailles, qui couvre le dos
      body: /* @__PURE__ */ __name((x) => {
        const [cx, cy] = x.at(-0.1, 0.35), a = x.rx * 1.14, b = x.ry * 2.6;
        const pts = [];
        for (let i = 0; i <= 20; i++) {
          const t = Math.PI * (i / 20);
          pts.push(rot(cx + Math.cos(t) * a, cy - Math.sin(t) * b, cx, cy, x.ang));
        }
        const d = "M" + pts.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L") + ` Q${r22(cx)},${r22(cy + 1.6)} ${r22(pts[0][0])},${r22(pts[0][1])} Z`;
        const sc = [[-0.45, -0.45], [0, -0.68], [0.45, -0.45], [-0.22, -0.15], [0.25, -0.15]].map(([u, v]) => {
          const [px, py] = rot(cx + u * a, cy + v * b, cx, cy, x.ang);
          return `<path d="M${r22(px - 1.6)},${r22(py)} l1.6,-1.1 l1.6,1.1 l0,1.5 l-1.6,1.1 l-1.6,-1.1 Z" fill="#9AB85E" stroke="${OUT}" stroke-width="0.5"/>`;
        }).join("");
        return P(d, "#7E9A4A") + clip(`sh3${x.view}${x.pose}`, d, sc) + P(d, "none");
      }, "body")
    });
    P3.frog = (c) => ({
      // deux gros yeux sur le dessus de la tête
      behindHead: /* @__PURE__ */ __name(() => "", "behindHead"),
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr, mode }) => se ? E(hx - hr * 0.5, hy - hr * 0.62, 1.8, 1.8, c.fur) + E(hx + hr * 0.45, hy - hr * 0.7, 1.65, 1.65, c.fur) + eye(hx - hr * 0.5, hy - hr * 0.62, 0.95, mode) + eye(hx + hr * 0.45, hy - hr * 0.7, 0.85, mode) + P(`M${r22(hx - hr * 0.6)},${r22(hy + hr * 0.25)} Q${r22(hx)},${r22(hy + hr * 0.7)} ${r22(hx + hr * 0.7)},${r22(hy + hr * 0.2)}`, "none", 0.6) : E(hx - hr * 0.45, hy - hr * 0.6, 1.8, 1.8, c.fur) + E(hx + hr * 0.45, hy - hr * 0.65, 1.7, 1.7, c.fur), "head")
    });
    P3.salamander = (c) => ({ coat: /* @__PURE__ */ __name((x) => [[-0.5, -0.4], [0, -0.55], [0.45, -0.35]].map(([u, v]) => {
      const [px, py] = x.at(u, v);
      return E(px, py, 0.85, 0.65, "#F2C94C", 0);
    }).join(""), "coat") });
    P3.chameleon = (c) => ({
      coat: /* @__PURE__ */ __name((x) => [-0.5, -0.05, 0.4].map((u) => {
        const [a1, b1] = x.at(u, -0.95), [a2, b2] = x.at(u + 0.1, 0.4);
        return `<path d="M${r22(a1)},${r22(b1)} L${r22(a2)},${r22(b2)}" stroke="#F2C94C" stroke-width="0.8"/>`;
      }).join(""), "coat"),
      // la crête de la tête
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => P(`M${r22(hx - hr * 0.6)},${r22(hy - hr * 0.5)} L${r22(hx - hr * 0.2)},${r22(hy - hr * 1.45)} L${r22(hx + hr * 0.35)},${r22(hy - hr * 0.7)} Z`, c.fur, 0.8), "head")
    });
    P3.heron = (c) => ({
      // le long cou en S (avant le corps de dos, après lui de trois quarts avant), la calotte noire et sa plume
      behindHead: /* @__PURE__ */ __name((x) => {
        const { se, hx, hy, hr } = x;
        const [nx, ny] = x.at(0.55, -0.6);
        const d = se ? `M${r22(nx)},${r22(ny)} Q${r22(nx + 4.4)},${r22(ny - 4)} ${r22(hx - 0.6)},${r22(hy + 6)} Q${r22(hx - 2)},${r22(hy + 3)} ${r22(hx)},${r22(hy + 1)}` : `M${r22(nx)},${r22(ny)} Q${r22(nx + 3)},${r22(ny - 4.4)} ${r22(hx - 0.4)},${r22(hy + 6)} Q${r22(hx - 1.6)},${r22(hy + 3)} ${r22(hx)},${r22(hy + 1)}`;
        return thick(d, 2.2, c.headColor);
      }, "behindHead"),
      // de trois quarts avant, la calotte passe sous les yeux ; de dos, il n'y a pas d'yeux
      face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx - hr * 0.05, hy - hr * 0.55, hr * 0.82, hr * 0.38, "#3A3A48", 0), "face"),
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => (se ? "" : E(hx - hr * 0.05, hy - hr * 0.45, hr * 0.85, hr * 0.45, "#3A3A48", 0)) + thick(`M${r22(hx - hr * 0.6)},${r22(hy - hr * 0.4)} Q${r22(hx - hr * 1.8)},${r22(hy - hr * 0.6)} ${r22(hx - hr * 2.3)},${r22(hy + hr * 0.3)}`, 0.6, "#3A3A48"), "head")
    });
    P3.puffin = (c) => ({
      // le masque blanc ; Bosco est bougon : un sourcil froncé
      face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.1, hy + hr * 0.1, hr * 0.82, hr * 0.78, "#F4F4F4", 0), "face"),
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr, mode }) => se && mode === "open" ? `<path d="M${r22(hx - hr * 0.55)},${r22(hy - hr * 0.55)} L${r22(hx - hr * 0.05)},${r22(hy - hr * 0.42)}" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>` : "", "head")
    });
    P3.toucan = (c) => ({ face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.05, hy + hr * 0.55, hr * 0.7, hr * 0.55, "#FFF4C8", 0) + E(hx - hr * 0.3, hy - hr * 0.15, hr * 0.42, hr * 0.4, "#7CD0E8", 0) + E(hx + hr * 0.38, hy - hr * 0.22, hr * 0.32, hr * 0.32, "#7CD0E8", 0), "face") });
    P3.crow = (c) => ({ body: /* @__PURE__ */ __name((x) => {
      const [ax, ay] = x.at(-0.4, -0.55), [bx, by] = x.at(0.3, -0.5);
      return `<path d="M${r22(ax)},${r22(ay)} Q${r22((ax + bx) / 2)},${r22(Math.min(ay, by) - 1)} ${r22(bx)},${r22(by)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>`;
    }, "body") });
    P3.bird = (c) => ({
      // la calotte bleue de la mésange, son trait noir à travers l'œil
      head: /* @__PURE__ */ __name(({ se, hx, hy, hr }) => P(`M${r22(hx - hr)},${r22(hy - 0.3)} Q${r22(hx - hr * 0.6)},${r22(hy - hr * 1.02)} ${r22(hx + hr * 0.75)},${r22(hy - hr * 0.6)} Q${r22(hx)},${r22(hy - hr * 0.36)} ${r22(hx - hr)},${r22(hy - 0.3)} Z`, "#5C9CE0", 0) + (se ? `<path d="M${r22(hx - hr * 0.75)},${r22(hy - 0.1)} L${r22(hx - hr * 0.1)},${r22(hy - 0.35)} M${r22(hx + hr * 0.6)},${r22(hy - 0.45)} L${r22(hx + hr * 0.9)},${r22(hy - 0.4)}" stroke="#2A3A5A" stroke-width="0.5"/>` : ""), "head")
    });
    P3.gull = () => ({});
    function petPose3(c, view, pose) {
      if (c.id.startsWith("cat")) return chatPose3(c, view, pose);
      const se = view === "avant", n = /2$/.test(pose) ? 1 : 0;
      const [, , brx, bry] = c.body, hr0 = c.head[2], lg = c.legs, tw = (c.tail || {}).w || 1.3;
      const hr = hr0 * (se ? 1.04 : 0.98);
      const tete = /* @__PURE__ */ __name((hx2, hy2, mode) => headQ3(c, { pose: pose + view, view, se, hx: hx2, hy: hy2, hr, mode, by: hy2 + hr * 0.2, rx: hx2 / 0.62, ry: 0, ang: 0 }), "tete");
      let s = "";
      if (/^assis/.test(pose)) {
        if (se) {
          const hx02 = -brx * 0.35, hy02 = -bry * 0.95, hrx2 = brx * 0.6, hry2 = bry * 0.95;
          const cx2 = brx * 0.25, cy3 = -bry * 1.55, crx2 = brx * 0.45, cry2 = bry * 1.1;
          s += E(0, 0.2, brx * 0.95, Math.max(2.2, bry * 0.7), SH, 0);
          s += limb([cx2 + crx2 * 0.45, cy3], [cx2 + crx2 * 0.45, -1.6], lg.w, c.furS) + paw(cx2 + crx2 * 0.45 + 0.3, -1.4, lg.w * 0.7, lg.paw || c.belly);
          s += Bt2.blob(c, `p3${c.id}${view}${pose}b`, hx02, hy02, hrx2, hry2, c.p3?.coat ? "" : "");
          s += Bt2.blob(c, `p3${c.id}${view}${pose}c`, cx2, cy3, crx2, cry2);
          s += thick(`M${r22(hx02 - hrx2 * 0.9)},${r22(-1.6)} Q${r22(hx02 - hrx2 * 0.2)},0.9 ${r22(cx2 + crx2 * 0.2)},${r22(n ? -1.6 : 0.2)}`, tw, c.fur);
          s += limb([cx2 - crx2 * 0.3, cy3], [cx2 - crx2 * 0.3, -0.9], lg.w, c.fur) + paw(cx2 - crx2 * 0.3 + 0.3, -0.7, lg.w * 0.7, lg.paw || c.belly);
          s += tete(cx2 + crx2 * 0.2, cy3 - cry2 - hr * 0.25, "open");
          return s;
        }
        const hx0 = -brx * 0.15, hy0 = -bry * 0.95, hrx = brx * 0.66, hry = bry * 1;
        const cx = brx * 0.2, cy2 = -bry * 1.65, crx = brx * 0.46, cry = bry * 1.1;
        s += E(0, 0.2, brx * 0.95, Math.max(2.2, bry * 0.7), SH, 0);
        s += Bt2.blob(c, `p3${c.id}${view}${pose}c`, cx, cy2, crx, cry);
        s += tete(cx + crx * 0.25, cy2 - cry - hr * 0.15, "open");
        s += Bt2.blob(c, `p3${c.id}${view}${pose}b`, hx0, hy0, hrx, hry);
        s += E(hx0 - hrx * 0.6, -0.8, lg.w * 1, 0.9, c.fur, 0.9) + E(hx0 + hrx * 0.5, -0.8, lg.w * 1, 0.9, c.fur, 0.9);
        s += thick(`M${r22(hx0 + hrx * 0.1)},${r22(-1)} Q${r22(hx0 + hrx * 0.9)},0.9 ${r22(hx0 + hrx * 1.35)},${r22(n ? -3 : -1.2)}`, tw, c.fur);
        return s;
      }
      const ry = bry * 0.82 * (n ? 1.06 : 1), rx = brx * 1, cy = -ry;
      s += E(0, 0.2, rx * 1.05, Math.max(2.2, ry * 0.8), SH, 0);
      if (se) {
        const hx2 = rx * 0.55, hy2 = -hr * 0.85;
        s += Bt2.blob(c, `p3${c.id}${view}${pose}b`, -rx * 0.15, cy, rx, ry);
        s += thick(`M${r22(-rx * 1.05)},${r22(-1.2)} Q${r22(-rx * 0.3)},1.4 ${r22(rx * 0.3)},0.3`, tw, c.fur);
        s += E(hx2 - hr * 0.4, -0.5, lg.w * 1.05, 0.9, c.fur, 0.9) + E(hx2 + hr * 0.45, -0.7, lg.w * 1.05, 0.9, c.fur, 0.9);
        s += tete(hx2, hy2, "blink");
        return s + Bt2.zed(hx2 + hr * 0.8, hy2 - hr * 1.5, 0.8) + (n ? Bt2.zed(hx2 + hr * 1.25, hy2 - hr * 2.2, 1.05) : "");
      }
      const hx = rx * 0.5, hy = cy - ry * 0.55 - hr * 0.3;
      s += tete(hx, hy, "blink");
      s += Bt2.blob(c, `p3${c.id}${view}${pose}b`, -rx * 0.1, cy, rx, ry);
      s += thick(`M${r22(-rx * 0.95)},${r22(-ry * 0.7)} Q${r22(-rx * 0.6)},0.8 ${r22(rx * 0.2)},0.4`, tw, c.fur);
      return s + Bt2.zed(hx + hr * 0.8, hy - hr * 1.4, 0.8) + (n ? Bt2.zed(hx + hr * 1.25, hy - hr * 2.1, 1.05) : "");
    }
    __name(petPose3, "petPose3");
    function chatPose3(c, view, pose) {
      const se = view === "avant", n = /2$/.test(pose) ? 1 : 0;
      const hr = c.head[2] * (se ? 1.04 : 0.98), lg = c.legs, tw = (c.tail || {}).w || 1.3, pc = lg.paw || c.belly;
      const tete = /* @__PURE__ */ __name((hx2, hy2, mode) => headQ3(c, { pose: pose + view, view, se, hx: hx2, hy: hy2, hr, mode, by: hy2 + hr * 0.2, rx: hx2 / 0.62, ry: 0, ang: 0 }), "tete");
      const pelage = /* @__PURE__ */ __name((pts) => c.taches ? E(pts[0][0], pts[0][1], 2, 1.4, c.taches[0], 0) + E(pts[1][0], pts[1][1], 1.3, 1, c.taches[1], 0) : !c.rayures ? "" : pts.map(([x, y]) => `<path d="M${r22(x - 1.4)},${r22(y - 0.6)} Q${r22(x)},${r22(y + 0.5)} ${r22(x + 1.4)},${r22(y - 0.6)}" fill="none" stroke="${c.furS}" stroke-width="0.9"/>`).join(""), "pelage");
      const corps = /* @__PURE__ */ __name((id, d, dedans) => P(d, c.fur) + clip(id, d, `<rect x="-7" y="-12" width="14" height="13" fill="${c.furS}"/><ellipse cx="-0.8" cy="-5.6" rx="5.4" ry="5.6" fill="${c.fur}"/>` + dedans) + P(d, "none"), "corps");
      const cuisse = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`, "cuisse");
      let s = "";
      if (/^assis/.test(pose)) {
        const d = "M-4.7,-0.6 C-5.7,-5.4 -3.1,-9.4 0.3,-9.8 C3.7,-9.4 6.3,-5.4 5.3,-0.6 Z";
        s += E(0.3, 0.2, 6.2, 2.2, SH, 0);
        if (se) {
          s += corps(`c3${c.id}${view}${pose}`, d, E(0.8, -5.4, 2.1, 3.3, c.belly || c.furS, 0) + pelage([[-3.4, -6], [-3.8, -3.8], [4.2, -4]]));
          s += cuisse("M-1.9,-0.8 Q-1.6,-4.4 -4.3,-5.2") + cuisse("M3.1,-0.8 Q2.8,-4.4 5.3,-5.2");
          s += E(-3.3, -0.85, lg.w * 1.15, 0.9, c.fur, 0.9) + toes(-3.1, -0.9, lg.w * 0.95) + E(4.3, -0.85, lg.w * 1.15, 0.9, c.fur, 0.9) + toes(4.5, -0.9, lg.w * 0.95);
          s += limb([-0.5, -5.4], [-0.5, -1], lg.w, c.fur) + paw(-0.2, -0.8, lg.w * 0.7, pc) + limb([1.9, -5.4], [1.9, -1], lg.w, c.fur) + paw(2.2, -0.8, lg.w * 0.7, pc);
          s += thick(n ? "M-4.6,-1.6 Q-2,1.3 2.8,0.5 Q4.6,0.1 5,-1.8" : "M-4.6,-1.6 Q-2,1.2 3.6,0.4", tw, c.fur);
          s += tete(0.6, -12.6, "open");
          return s;
        }
        s += corps(`c3${c.id}${view}${pose}`, d, pelage([[0.3, -8], [0, -6], [0.3, -4]]));
        s += cuisse("M-2.3,-0.8 Q-2.4,-4.2 -4.5,-5") + cuisse("M2.9,-0.8 Q3,-4.2 5.1,-5");
        s += E(-3.6, -0.8, lg.w * 1.05, 0.9, c.fur, 0.9) + E(4.2, -0.8, lg.w * 1.05, 0.9, c.fur, 0.9);
        s += thick(n ? "M0.4,-1.2 Q3.4,1.2 5.8,-0.2 Q7,-0.9 6.9,-2.8" : "M0.4,-1.2 Q3.6,1.2 6.6,-0.4", tw, c.fur);
        s += tete(0.4, -12.4, "open");
        return s;
      }
      const rx = 6.4, ry = 3.9 * (n ? 1.06 : 1), cx = -0.6, cy = -ry;
      s += E(0, 0.2, rx * 1.05, Math.max(2.2, ry * 0.8), SH, 0);
      if (se) {
        const hx2 = 2.6, hy2 = -hr * 0.9;
        s += Bt2.blob(c, `c3${c.id}${view}${pose}`, cx, cy, rx, ry, pelage([[cx - 3, cy - 1.6], [cx - 0.6, cy - 2.6], [cx - 4.6, cy]]));
        s += thick(`M${r22(cx - rx * 1.02)},-1.4 Q${r22(cx)},1.6 ${r22(hx2 + 1.6)},0.4`, tw, c.fur);
        s += tete(hx2, hy2, "blink");
        s += E(hx2 - hr * 0.45, -0.6, lg.w * 1.05, 0.9, c.fur, 0.9) + toes(hx2 - hr * 0.4, -0.65, lg.w * 0.9) + E(hx2 + hr * 0.5, -0.7, lg.w * 1.05, 0.9, c.fur, 0.9) + toes(hx2 + hr * 0.55, -0.75, lg.w * 0.9);
        return s + Bt2.zed(hx2 + hr * 0.8, hy2 - hr * 1.6, 0.8) + (n ? Bt2.zed(hx2 + hr * 1.25, hy2 - hr * 2.3, 1.05) : "");
      }
      const hx = 2.4, hy = cy - ry * 0.55 - hr * 0.2;
      s += tete(hx, hy, "blink");
      s += Bt2.blob(c, `c3${c.id}${view}${pose}`, cx, cy, rx, ry, pelage([[cx - 2, cy - 2], [cx + 0.6, cy - 2.6], [cx + 2.8, cy - 2]]));
      s += thick(`M${r22(cx - rx * 0.98)},-1.2 Q${r22(cx + 0.6)},1.6 ${r22(cx + rx * 0.95)},-0.6`, tw, c.fur);
      return s + Bt2.zed(hx + hr * 0.8, hy - hr * 1.5, 0.8) + (n ? Bt2.zed(hx + hr * 1.25, hy - hr * 2.2, 1.05) : "");
    }
    __name(chatPose3, "chatPose3");
    function ecureuil3(c, view, pose) {
      const se = view === "avant", rest = pose === "repos" || pose === "clignement", walk = pose === "marche1" || pose === "marche2";
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const { panache, oreilleEcureuil, ovale, bez, GLAND } = Bt2;
      const fur = c.fur, furS = c.furS, belly = c.belly, pin = tone3(furS, 0.6);
      const lean = pose === "marche1" ? 1 : 0, up = pose === "joie" ? -0.3 : 0;
      const [bx, by] = [0.2 + lean * 0.6, -5.4 + lean * 0.7 + up], [hx, hy] = [1.6 + lean * 1.2, -10.4 + lean * 1.4 + up * 1.4], hr = 3.9;
      const id = `ec3${view}${pose}`;
      let s = `<ellipse cx="0.2" cy="0" rx="5" ry="1.8" fill="${SH}"/>`;
      const q = pose === "marche2" ? 0.05 : rest ? -0.06 : 0;
      const main = /* @__PURE__ */ __name(([x, y], col) => E(x, y, 0.95, 0.75, col, 0.8) + toes(x + 0.1, y - 0.2, 0.8), "main");
      const pied = /* @__PURE__ */ __name(([x, y], col) => contact(x, 1.6) + E(x, y, 1.15, 1.5, col, 0.8) + toes(x + 0.1, y + 0.5, 0.8), "pied");
      const tete = /* @__PURE__ */ __name(() => {
        let h = oreilleEcureuil(hx + (se ? 1.7 : 1.5), hy - hr * 0.68, 0.95, 14, se ? furS : fur, se ? null : null, pin) + oreilleEcureuil(hx - (se ? 1.5 : 1.6), hy - hr * 0.7, 1.05, -12, fur, se ? "#F2C6C0" : null, pin);
        const hd = `M${r22(hx - hr)},${r22(hy)} a${hr},${hr} 0 1,0 ${2 * hr},0 a${hr},${hr} 0 1,0 ${-2 * hr},0 Z`;
        h += P(hd, fur) + clip(`${id}h`, hd, `<rect x="${r22(hx - hr - 1)}" y="${r22(hy - hr - 1)}" width="${r22(hr * 2 + 2)}" height="${r22(hr * 2 + 2)}" fill="${furS}"/>` + E(hx - hr * 0.12, hy - hr * 0.14, hr * 0.97, hr * 0.92, fur, 0) + (se ? E(hx + hr * 0.2, hy + hr * 0.6, hr * 0.78, hr * 0.48, belly, 0) : E(hx - hr * 0.1, hy + hr * 0.45, hr * 0.7, hr * 0.42, furS, 0).replace("fill=", 'opacity="0.45" fill='))) + P(hd, "none");
        if (!se) return h;
        h += E(hx + hr * 0.22, hy + hr * 0.36, 1.7, 1.2, belly, 0.8) + E(hx + hr * 0.26, hy + hr * 0.12, 0.6, 0.45, OUT, 0.4) + stroke(`M${r22(hx + hr * 0.26)},${r22(hy + hr * 0.22)} l0,0.5 M${r22(hx + hr * 0.02)},${r22(hy + hr * 0.48)} q0.42,0.45 0.86,0 q0.42,0.45 0.86,0`, 0.42, OUT);
        h += eye(hx - hr * 0.34, hy - hr * 0.2, 1.12, mode) + eye(hx + hr * 0.62, hy - hr * 0.26, 1, mode) + E(hx - hr * 0.55, hy + hr * 0.25, 0.9, 0.48, "#F7A8B0", 0) + E(hx + hr * 0.82, hy + hr * 0.2, 0.6, 0.4, "#F7A8B0", 0);
        return h;
      }, "tete");
      const base = se ? [-2.2, -3] : [-2, -2.8];
      const ligne = (se ? [...bez(base, [-6.6, -3.6], [-7.2, -10.6], [-4.6, -14], 9), ...bez([-4.6, -14], [-2.6, -16.8], [0.4, -16.4], [-0.2, -13.8], 6).slice(1)] : [...bez(base, [-6.6, -3.2], [-7.4, -10], [-4.8, -13.2], 9), ...bez([-4.8, -13.2], [-3.2, -15.8], [-0.6, -15.6], [-1.2, -13], 6).slice(1)]).map(([x, y]) => {
        const a = q, cx = base[0], cy = base[1], co = Math.cos(a), si = Math.sin(a);
        return [cx + (x - cx) * co - (y - cy) * si, cy + (x - cx) * si + (y - cy) * co];
      });
      const w = ligne.map((_, i) => 1.1 + Math.sin(Math.min(1, i / 8) * Math.PI / 2) * 2.1 - Math.max(0, i - 10) * 0.18);
      const queue = panache(ligne, w, fur, c.tail.tip, furS, `${id}q`);
      if (se) s += queue;
      else s += tete();
      const pieds = se ? [[2.4 + lean * 0.4, -1], [-0.4 - lean * 0.4, -0.5]] : [[1.8, -1.3], [-0.8, -0.6]];
      s += pied(pieds[0], furS);
      const bd = ovale(bx, by, 3.4, 4, se ? -0.12 - lean * 0.35 : 0.12);
      s += P(bd, fur) + clip(`${id}b`, bd, `<path d="${ovale(bx - 1.2, by + 0.5, 3.4, 4.3)}" fill="${furS}"/><path d="${ovale(bx + 0.2, by - 0.3, 3.2, 3.9)}" fill="${fur}"/>` + (se ? E(bx + 1, by + 0.6, 1.9, 3, belly, 0) : "")) + P(bd, "none");
      const cuisse = /* @__PURE__ */ __name((x, y, k) => {
        const d = ovale(x, y, 2.3 * k, 2 * k, -0.2);
        return P(d, fur) + clip(`${id}c${x}`, d, `<path d="${ovale(x - 0.6, y + 0.6, 2.3 * k, 2 * k)}" fill="${furS}"/><path d="${ovale(x + 0.2, y - 0.2, 2.1 * k, 1.8 * k)}" fill="${fur}"/>`) + P(d, "none");
      }, "cuisse");
      s += cuisse(se ? -1.4 : 2, -2.6, 1) + (se ? "" : cuisse(-1.6, -2.4, 0.95));
      s += pied(pieds[1], fur);
      if (se) {
        s += tete();
        const mains = rest ? [[hx - 0.6, hy + hr + 0.6], [hx + 1.6, hy + hr + 0.5]] : pose === "joie" ? [[hx - 2.2, hy + hr - 0.4], [hx + 2.8, hy + hr - 0.6]] : lean ? [[3.4, -0.8], [4.6, -1.1]] : [[1, -6.6], [2.4, -6.4]];
        if (rest) s += GLAND(hx + 0.5, hy + hr + 0.2);
        s += main(mains[0], fur) + main(mains[1], fur);
      } else s += queue;
      if (pose === "joie" && se) s += heartIcon(hx + 0.4, hy - hr - 4.8);
      return s;
    }
    __name(ecureuil3, "ecureuil3");
    var with3 = /* @__PURE__ */ __name((c) => {
      const k = Object.keys(P3).find((n) => c.id.startsWith(n));
      if (!k || c.p3) return c;
      const p3 = P3[k](c);
      return { ...c, p3 };
    }, "with3");
    module.exports = { ecureuil3, petPose3: /* @__PURE__ */ __name((c, view, pose) => petPose3(with3(c), view, pose), "petPose3"), quad3: /* @__PURE__ */ __name((c, view, pose) => quad3(with3(c), view, pose), "quad3"), bird3: /* @__PURE__ */ __name((c, view, pose) => bird3(with3(c), view, pose), "bird3"), ear3 };
  }
});

// atelier/betes.js
var require_betes = __commonJS({
  "atelier/betes.js"(exports, module) {
    var { OUT, P, E, L: L2, clip, r2: r22 } = require_troupe2();
    var K = 1.25;
    var box = /* @__PURE__ */ __name((x, y, w, h) => [x * K, y * K, w * K, h * K], "box");
    var BOX = { SMALL: box(-12, -18, 24, 20), MID: box(-16, -24, 32, 26), TALL: box(-16, -34, 32, 36), BIG: box(-24, -46, 48, 48) };
    var EYE = "#2A2420";
    var tone = /* @__PURE__ */ __name((hex, k) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, "0")).join("").toUpperCase(), "tone");
    var heartIcon = /* @__PURE__ */ __name((x, y, s = 1.4) => P(`M${r22(x)},${r22(y + s * 1.1)} C${r22(x - s * 1.8)},${r22(y - s * 0.1)} ${r22(x - s * 0.9)},${r22(y - s * 1.4)} ${r22(x)},${r22(y - s * 0.5)} C${r22(x + s * 0.9)},${r22(y - s * 1.4)} ${r22(x + s * 1.8)},${r22(y - s * 0.1)} ${r22(x)},${r22(y + s * 1.1)} Z`, "#F27A8A", 0.6), "heartIcon");
    var line = /* @__PURE__ */ __name((a, b, w, color) => `<path d="M${r22(a[0])},${r22(a[1])} L${r22(b[0])},${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "line");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => line(a, b, w + 2.2, OUT) + line(a, b, w, fill), "limb");
    var stroke = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"/>`, "stroke");
    var thick = /* @__PURE__ */ __name((d, w, fill) => stroke(d, w + 2.2, OUT) + stroke(d, w, fill), "thick");
    function eye(x, y, r, mode) {
      if (mode === "blink") return P(`M${r22(x - r)},${r22(y)} Q${x},${r22(y + r * 0.9)} ${r22(x + r)},${r22(y)}`, "none", 0.8);
      if (mode === "joy") return P(`M${r22(x - r)},${r22(y + r * 0.4)} Q${x},${r22(y - r * 0.9)} ${r22(x + r)},${r22(y + r * 0.4)}`, "none", 0.9);
      return E(x, y, r * 0.86, r * 1.12, EYE, 0) + E(x + r * 0.3, y - r * 0.44, r * 0.38, r * 0.38, "#FFFFFF", 0) + E(x - r * 0.3, y + r * 0.5, r * 0.17, r * 0.17, "#FFFFFF", 0);
    }
    __name(eye, "eye");
    var hoof = /* @__PURE__ */ __name((x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + E(x - rx * 0.35, y - 0.2, rx * 0.3, 0.22, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.45" fill='), "hoof");
    var toes = /* @__PURE__ */ __name((x, y, rx) => [0.15, 0.55].map((k) => line([x + rx * k, y + 0.05], [x + rx * k, y + 0.75], 0.42, OUT)).join(""), "toes");
    var paw = /* @__PURE__ */ __name((x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + toes(x, y - 0.1, rx), "paw");
    var cloven = /* @__PURE__ */ __name((x, y, rx, col) => hoof(x, y, rx, col) + line([x + rx * 0.12, y - 0.85], [x + rx * 0.2, y + 0.55], 0.4, "#2A2220"), "cloven");
    var contact = /* @__PURE__ */ __name((x, w) => E(x, -0.1, w, 0.55, "rgba(40,55,20,.24)", 0), "contact");
    var f2p = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "f2p");
    function legShape(a, b, w0, w1, bend, fill, shine, sw = 1.05) {
      const dx = b[0] - a[0], dy = b[1] - a[1], L0 = Math.hypot(dx, dy) || 1, nx = -dy / L0, ny = dx / L0;
      const m = [a[0] + dx * 0.5 + nx * bend, a[1] + dy * 0.5 + ny * bend], wm = w0 * 0.45 + w1 * 0.55;
      const off = /* @__PURE__ */ __name((q, w, k) => [q[0] + nx * w * 0.5 * k, q[1] + ny * w * 0.5 * k], "off");
      const d = `M${f2p(off(a, w0, 1))} Q${f2p(off(m, wm, 1))} ${f2p(off(b, w1, 1))} L${f2p(off(b, w1, -1))} Q${f2p(off(m, wm, -1))} ${f2p(off(a, w0, -1))} A${r22(w0 / 2)},${r22(w0 / 2)} 0 0,1 ${f2p(off(a, w0, 1))} Z`;
      return P(d, fill, sw) + (shine ? `<path d="M${f2p(off(a, w0 * 0.55, -1))} Q${f2p(off(m, wm * 0.5, -1))} ${f2p(off(b, w1 * 0.4, -1))}" fill="none" stroke="#FFFFFF" stroke-width="${r22(w1 * 0.24)}" stroke-linecap="round" opacity="0.4"/>` : "");
    }
    __name(legShape, "legShape");
    function tache(cx, cy, rx, ry, seed, col) {
      const n = 7, pts = [];
      for (let i = 0; i < n; i++) {
        const t = i / n * Math.PI * 2, k = 1 + 0.2 * Math.sin(seed * 3.1 + i * 2.3) + 0.08 * Math.cos(seed + i * 4.1);
        pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
      }
      let d = `M${f2p([(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2])}`;
      for (let i = 1; i <= n; i++) {
        const p = pts[i % n], q = pts[(i + 1) % n];
        d += ` Q${f2p(p)} ${f2p([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])}`;
      }
      return `<path d="${d} Z" fill="${col}"/>`;
    }
    __name(tache, "tache");
    function quad(c, pose) {
      if (c.profil) return c.profil(c, pose);
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
      const leg = /* @__PURE__ */ __name((x, dx, near, back) => {
        if (rest) return "";
        const foot = [x + dx, -(lg.paw ? 0.9 : 0.6)];
        if (lg.shape) {
          const sh = lg.shape, col = near ? lg.color || c.fur : lg.colorS || c.furS;
          const w0 = lg.w * (back ? sh.haunch ?? 1.5 : sh.arm ?? 1.15), w1 = lg.w * (sh.foot ?? 0.78);
          const hip = [x - (back ? 0.4 : 0), top - (back ? sh.hipUp ?? 1.2 : sh.armUp ?? 0.6)];
          const end = lg.hoof ? (lg.cloven ? cloven : hoof)(foot[0], foot[1] + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? back && sh.longFoot ? E(foot[0] + 0.9, foot[1] + 0.25, lg.w * sh.longFoot, 0.85, lg.paw, 0.8) + toes(foot[0] + 0.9 + lg.w * 0.4, foot[1] + 0.1, lg.w * 0.7) : paw(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, lg.paw) : "";
          return (near ? contact(foot[0] + 0.2, lg.w * 0.75) : "") + legShape(hip, foot, w0, w1, back ? sh.hock ?? 0.8 : -(sh.knee ?? 0.3), col, near) + end;
        }
        const shine = near ? line([x - lg.w * 0.2, top + 1.2], [foot[0] - lg.w * 0.2, foot[1] - 1.6], lg.w * 0.26, "rgba(255,255,255,.35)") : "";
        return limb([x, top], foot, lg.w, near ? lg.color || c.fur : lg.colorS || c.furS) + shine + (lg.hoof ? hoof(foot[0], foot[1] + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, lg.paw) : "");
      }, "leg");
      s += leg(lg.back + 1.4, -a, false, true) + leg(lg.front + 1.4, a, false, false);
      if (lg.shape && !rest) s += leg(lg.back, a, true, true) + leg(lg.front, -a, true, false);
      s += c.parts?.back ? c.parts.back(ctx) : "";
      s += tail(c, ctx);
      const bd = `M${r22(bx - brx)},${r22(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
      s += P(bd, c.fur) + clip(`q${c.id}${pose}b`, bd, `<rect x="${r22(bx - brx - 1)}" y="${r22(by - bry - 1)}" width="${r22(brx * 2 + 2)}" height="${r22(bry * 2 + 2)}" fill="${c.furS}"/><ellipse cx="${r22(bx - brx * 0.1)}" cy="${r22(by - bry * 0.16)}" rx="${r22(brx * 0.98)}" ry="${r22(bry * 0.9)}" fill="${c.fur}"/><ellipse cx="${bx}" cy="${r22(by + bry * 0.95)}" rx="${r22(brx * 0.9)}" ry="${r22(bry * 0.45)}" fill="${c.belly || c.furS}"/>` + (c.parts?.coat ? c.parts.coat(ctx) : "") + `<path d="M${r22(bx - brx * 0.6)},${r22(by - bry * 0.62)} Q${bx},${r22(by - bry * 0.95)} ${r22(bx + brx * 0.4)},${r22(by - bry * 0.7)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(bd, "none");
      if (rest) for (const px of [bx - brx * 0.55, bx + brx * 0.6]) {
        s += E(px, -0.9, lg.w * 0.9, 1, lg.color || c.fur, 0.9);
        if (lg.hoof) s += (lg.cloven ? cloven : hoof)(px + lg.w * 0.55, -0.7, lg.w * 0.42, lg.hoof);
        else s += toes(px + lg.w * 0.15, -0.9, lg.w * 0.9);
      }
      else if (!lg.shape) s += leg(lg.back, a, true, true) + leg(lg.front, -a, true, false);
      s += c.parts?.body ? c.parts.body(ctx) : "";
      s += headQuad(c, ctx);
      if (pose === "joie") s += heartIcon(hx + hr * 0.2, Math.max(hy - hr * 2 - 1.4, BOX[c.size][1] + 2));
      return s;
    }
    __name(quad, "quad");
    function blob(c, id, cx, cy, rx, ry, coat) {
      const d = `M${r22(cx - rx)},${r22(cy)} a${r22(rx)},${r22(ry)} 0 1,0 ${r22(2 * rx)},0 a${r22(rx)},${r22(ry)} 0 1,0 ${r22(-2 * rx)},0 Z`;
      return P(d, c.fur) + clip(id, d, `<rect x="${r22(cx - rx - 1)}" y="${r22(cy - ry - 1)}" width="${r22(rx * 2 + 2)}" height="${r22(ry * 2 + 2)}" fill="${c.furS}"/><ellipse cx="${r22(cx - rx * 0.1)}" cy="${r22(cy - ry * 0.16)}" rx="${r22(rx * 0.98)}" ry="${r22(ry * 0.9)}" fill="${c.fur}"/><ellipse cx="${r22(cx)}" cy="${r22(cy + ry * 0.95)}" rx="${r22(rx * 0.9)}" ry="${r22(ry * 0.45)}" fill="${c.belly || c.furS}"/>` + (coat || "")) + P(d, "none");
    }
    __name(blob, "blob");
    var zed = /* @__PURE__ */ __name((x, y, k) => `<path d="M${r22(x)},${r22(y)} h${r22(1.8 * k)} l${r22(-1.8 * k)},${r22(2 * k)} h${r22(1.8 * k)}" fill="none" stroke="#7E8CB0" stroke-width="${r22(0.55 * k + 0.2)}" stroke-linecap="round" stroke-linejoin="round"/>`, "zed");
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
        s += thick(`M${r22(hx0 - hrx * 0.95)},${r22(-1.4)} Q${r22(hx0 - hrx * 0.5)},0.3 ${r22(hx0 + hrx * 0.75)},${r22(n ? -2.6 : -0.7)}`, tw, c.fur);
        s += patte(cx2 + crx * 0.4, true) + E(hx0 + hrx * 0.55, -0.85, lg.w * 1.05, 0.9, c.fur, 0.9) + toes(hx0 + hrx * 0.62, -0.9, lg.w * 0.9);
        s += headQuad(c, { pose, hx: cx2 + crx * 0.55, hy: cy2 - cry - hr * 0.3, hr, mode: "open", bx: cx2, by: cy2 });
        return s;
      }
      const cx = bx - brx * 0.1, ry = bry * 0.8 * (n ? 1.06 : 1), cy = -ry, rx = brx * 1.08;
      const hx = cx + rx * 0.82, hy = -hr * 0.92;
      s += E(cx + rx * 0.2, -0.2, rx * 1.05, 1.4, "rgba(40,55,20,.18)", 0);
      s += blob(c, `pp${c.id}${pose}b`, cx, cy, rx, ry, c.parts?.coat ? c.parts.coat({ bx: cx, by: cy + ry * 0.5 }) : "");
      s += thick(`M${r22(cx - rx * 0.95)},${r22(-1.6)} Q${r22(cx - rx * 0.3)},0.4 ${r22(cx + rx * 0.5)},${r22(-0.8)}`, tw, c.fur);
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
        s += P(d, c.fur) + clip(`cp${c.id}${pose}`, d, `<rect x="-7" y="-12" width="13" height="13" fill="${c.furS}"/><ellipse cx="-1.4" cy="-5.6" rx="5.6" ry="5.4" fill="${c.fur}"/>` + E(3.6, -5.2, 1.5, 3.2, c.belly || c.furS, 0) + coat(-1.6, -4.2) + `<path d="M-3.6,-6.6 Q-1.4,-9 1.4,-9.6" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(d, "none");
        s += `<path d="M-0.4,-0.8 Q0.6,-5 -3.2,-6.4" fill="none" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
        s += E(0.4, -0.85, lg.w * 1.15, 0.9, c.fur, 0.9) + toes(0.6, -0.9, lg.w * 0.95);
        s += limb([2.9, -6], [3, -0.9], lg.w, c.fur) + paw(3.4, -0.7, lg.w * 0.7, pc);
        s += thick(n ? "M-5,-1.4 Q-1,1.6 3.8,0 Q5.4,-0.6 5.6,-2.6" : "M-5,-1.4 Q-1,1.4 5,-0.4", tw, c.fur);
        s += headQuad(c, { pose, hx: 2.6, hy: -13.4, hr, mode: "open", bx: 0, by: -5 });
        return s;
      }
      const rx = 6.6, ry = 3.8 * (n ? 1.06 : 1), cx = -1.2, cy = -ry, hx = 4, hy = -hr * 0.95;
      s += E(cx + 1, -0.2, rx * 1.05, 1.4, "rgba(40,55,20,.18)", 0);
      s += blob(c, `cp${c.id}${pose}`, cx, cy, rx, ry, coat(cx, cy + ry * 0.5));
      s += thick(`M${r22(cx - rx * 0.92)},-1.6 Q${r22(cx + 1)},1.3 ${r22(hx + 1.4)},-0.4`, tw, c.fur);
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
          return thick(`M${x},${y} Q${r22(x - 2.4)},${r22(y + 2)} ${r22(x - 2 + w)},${r22(y + 6)}`, 0.8, c.fur) + E(x - 2 + w, y + 6.6, 1.1, 1.5, t.color || c.furS, 0.8);
        case "puff":
          return E(x + 0.4, y, t.r || 1.8, t.r || 1.8, t.color || c.belly || "#FFFFFF", 0.9);
        // la vache : une corde qui pend le long de la croupe, un toupet au bout qui se balance
        case "rope": {
          const ex = x - 0.5 + w * 0.7, ey = by + c.body[3] * 1.05;
          return thick(`M${r22(x + 0.4)},${r22(y)} Q${r22(x - 2.2)},${r22(y + 2.4)} ${r22(ex)},${r22(ey)}`, 0.75, c.fur) + P(`M${r22(ex - 0.9)},${r22(ey - 0.6)} Q${r22(ex - 1.5)},${r22(ey + 1.6)} ${r22(ex + 0.1)},${r22(ey + 2.6)} Q${r22(ex + 1.4)},${r22(ey + 1.4)} ${r22(ex + 0.8)},${r22(ey - 0.6)} Z`, t.color || c.furS, 0.8);
        }
        case "curly":
          return stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 2.4, OUT) + stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 0.9, c.fur);
        case "short":
          return P(`M${x + 0.6},${y - 0.6} L${r22(x - 2.2)},${r22(y - 3 + w * 0.5)} L${r22(x + 0.4)},${r22(y + 1)} Z`, t.color || c.fur, 0.9);
        case "bushy": {
          const L0 = t.len || 9, up = t.up ?? 0.4;
          const tip = [x - L0, y - L0 * up + w];
          const d = `M${r22(x + 1)},${r22(y - 1.4)} Q${r22(x - L0 * 0.5)},${r22(y - L0 * up - 3.6 + w)} ${r22(tip[0])},${r22(tip[1])} Q${r22(x - L0 * 0.4)},${r22(y + 2.6 + w * 0.5)} ${r22(x + 1)},${r22(y + 1.6)} Z`;
          return P(d, c.fur) + clip(`t${c.id}${ph}${walk}`, d, `<circle cx="${r22(tip[0])}" cy="${r22(tip[1])}" r="${r22(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P(d, "none");
        }
        case "horse":
          return thick(`M${x},${y - 1} Q${r22(x - 3)},${r22(y + 1)} ${r22(x - 2.4 + w)},${r22(y + 8)}`, 2.2, t.color) + stroke(`M${r22(x - 1)},${r22(y + 1)} Q${r22(x - 2.6)},${r22(y + 4)} ${r22(x - 2.4 + w)},${r22(y + 7)}`, 0.5, OUT);
        // le chat : la queue monte en S, le bout recourbé vers l'avant
        case "chat":
          return thick(`M${r22(x + 0.4)},${r22(y)} C${r22(x - 3.4)},${r22(y - 0.4)} ${r22(x - 4.6 + w * 0.4)},${r22(y - 4.6)} ${r22(x - 3.6 + w)},${r22(y - 7.4)} Q${r22(x - 3 + w)},${r22(y - 8.8)} ${r22(x - 1.8 + w)},${r22(y - 8.2)}`, t.w || 1.3, c.fur);
        case "thin":
          return thick(`M${x},${y} Q${r22(x - 3.6)},${r22(y - 1)} ${r22(x - 3.4 + w)},${r22(y - (t.up || 5))}`, t.w || 1.2, t.color || c.fur);
        case "lizard":
          return thick(`M${x + 1},${y + 0.6} Q${r22(x - 4)},${r22(y + 2)} ${r22(x - 6.2 + w)},${r22(-0.9)}`, t.w || 1.8, c.fur);
        case "spiral":
          return thick(`M${x + 1},${y + 0.6} Q${r22(x - 4)},${r22(y + 1)} ${r22(x - 4.6)},${r22(y + 4)} Q${r22(x - 4.4)},${r22(y + 6.4)} ${r22(x - 2.4)},${r22(y + 5.6)} Q${r22(x - 1.6)},${r22(y + 4.2)} ${r22(x - 3)},${r22(y + 4)}`, 1.4, c.fur);
        case "otter":
          return P(`M${x + 1},${y - 1.2} Q${r22(x - 4)},${r22(y + 0.4)} ${r22(x - 6.4 + w)},${r22(y + 3.4)} Q${r22(x - 3.2)},${r22(y + 3)} ${r22(x + 1)},${r22(y + 1.6)} Z`, c.fur);
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
      const hw = hr * (c.headW || 1), hd = `M${r22(hx - hw)},${r22(hy)} a${r22(hw)},${r22(hr)} 0 1,0 ${r22(2 * hw)},0 a${r22(hw)},${r22(hr)} 0 1,0 ${r22(-2 * hw)},0 Z`;
      s += P(hd, c.headC || c.fur) + clip(`q${c.id}${ctx.pose}h`, hd, `<rect x="${r22(hx - hw - 1)}" y="${r22(hy - hr - 1)}" width="${r22(hw * 2 + 2)}" height="${r22(hr * 2 + 2)}" fill="${c.headCS || c.furS}"/><ellipse cx="${r22(hx - hw * 0.12)}" cy="${r22(hy - hr * 0.14)}" rx="${r22(hw * 0.97)}" ry="${r22(hr * 0.92)}" fill="${c.headC || c.fur}"/>`) + P(hd, "none");
      s += c.parts?.face ? c.parts.face(ctx) : "";
      if (c.snout) {
        const [dx, dy, rx, ry, col] = c.snout;
        s += E(hx + dx, hy + dy, rx, ry, col || c.belly, 0.9);
      }
      if (c.nose) {
        const [dx, dy, r, col] = c.nose;
        s += E(hx + dx, hy + dy, r * 1.1, r * 0.85, col || OUT, 0.6);
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
    function oreilleRenard(e, x, y, u, a, col, dedans, id, w = 1) {
      const forme = /* @__PURE__ */ __name((b2, h2, d2, dy) => `M${r22(x - b2)},${r22(y + dy + d2)} C${r22(x - b2 * 1.06)},${r22(y + dy - h2 * 0.42)} ${r22(x - b2 * 0.34)},${r22(y + dy - h2 * 0.9)} ${r22(x)},${r22(y + dy - h2)} C${r22(x + b2 * 0.34)},${r22(y + dy - h2 * 0.9)} ${r22(x + b2 * 1.06)},${r22(y + dy - h2 * 0.42)} ${r22(x + b2)},${r22(y + dy + d2)} Z`, "forme");
      const b = u * 0.52 * w, h = u * 1.08, d = forme(b, h, u * 0.5, 0);
      const bout = e.tip ? `<rect x="${r22(x - b - 1)}" y="${r22(y - h - 1)}" width="${r22(2 * b + 2)}" height="${r22(h * 0.3 + 1)}" fill="${e.tip}"/>` : "";
      const creux = dedans ? `<path d="${forme(b * 0.56, h * 0.7, u * 0.3, u * 0.08)}" fill="${e.inner || "#F2C6C0"}"/>` : "";
      return `<g transform="rotate(${r22(a)} ${r22(x)} ${r22(y)})">${P(d, col)}${bout || creux ? clip(id, d, creux + bout) : ""}${P(d, "none")}</g>`;
    }
    __name(oreilleRenard, "oreilleRenard");
    function oreilleChat(x, y, b, h, a, col, dedans, id) {
      const forme = /* @__PURE__ */ __name((b2, h2, dy) => `M${r22(x - b2)},${r22(y + h2 * 0.45)} L${r22(x - b2 * 0.28)},${r22(y + dy - h2 * 0.9)} Q${r22(x)},${r22(y + dy - h2 * 1.06)} ${r22(x + b2 * 0.28)},${r22(y + dy - h2 * 0.9)} L${r22(x + b2)},${r22(y + h2 * 0.45)} Z`, "forme");
      const d = forme(b, h, 0);
      return `<g transform="rotate(${r22(a)} ${r22(x)} ${r22(y)})">${P(d, col)}${dedans ? clip(id, d, `<path d="${forme(b * 0.52, h * 0.66, h * 0.1)}" fill="${dedans}"/>`) : ""}${P(d, "none")}</g>`;
    }
    __name(oreilleChat, "oreilleChat");
    function ear(c, e, hx, hy, hr, far, pose) {
      const col = far ? c.headCS || c.furS : c.headC || c.fur, inner = e.inner || "#F2C6C0";
      const o = far ? -hr * 0.5 : 0;
      const k = e.size || 1;
      switch (e.kind) {
        case "pointy": {
          const x = hx - hr * 0.2 + o, y = hy - hr * 0.75;
          return P(`M${r22(x - hr * 0.42 * k)},${r22(y + 0.4)} L${r22(x + hr * 0.05)},${r22(y - hr * 1.05 * k)} L${r22(x + hr * 0.5 * k)},${r22(y + 0.2)} Z`, col, 0.9) + (far ? "" : P(`M${r22(x - hr * 0.2 * k)},${r22(y)} L${r22(x + hr * 0.05)},${r22(y - hr * 0.7 * k)} L${r22(x + hr * 0.28 * k)},${r22(y)} Z`, inner, 0));
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
          return `<g transform="rotate(${r22((far ? -25 : -10) + (e.tilt || 0))} ${r22(x)} ${r22(y)})">${P(`M${r22(x)},${r22(y)} Q${r22(x - hr * 0.9 * k)},${r22(y - hr * 0.55)} ${r22(x - hr * 1.3 * k)},${r22(y)} Q${r22(x - hr * 0.8 * k)},${r22(y + hr * 0.4)} ${r22(x)},${r22(y + hr * 0.25)} Z`, col, 0.9)}${far ? "" : E(x - hr * 0.75 * k, y, hr * 0.32 * k, hr * 0.14, inner, 0)}</g>`;
        }
        case "flop": {
          const x = hx - hr * 0.1 + o * 0.6, y = hy - hr * 0.8;
          return P(`M${r22(x - hr * 0.4)},${r22(y + 0.6)} L${r22(x + hr * 0.1)},${r22(y - hr * 0.6 * k)} L${r22(x + hr * 0.75 * k)},${r22(y + hr * 0.25)} Z`, col, 0.9);
        }
        case "hang": {
          const x = hx - hr * 0.5 + o * 0.5, y = hy - hr * 0.6;
          return P(`M${r22(x + hr * 0.3)},${r22(y)} Q${r22(x - hr * 0.5)},${r22(y - hr * 0.1)} ${r22(x - hr * 0.35)},${r22(y + hr * 1.1 * k)} Q${r22(x + hr * 0.1)},${r22(y + hr * 1.2 * k)} ${r22(x + hr * 0.5)},${r22(y + hr * 0.3)} Z`, far ? c.furS : e.color || c.furS, 0.9);
        }
        case "long": {
          const x = hx - hr * 0.3 + o, y = hy - hr * 0.7;
          return `<g transform="rotate(${far ? -28 : -12} ${r22(x)} ${r22(y)})">${P(`M${r22(x - hr * 0.3)},${r22(y)} Q${r22(x - hr * 0.5)},${r22(y - hr * 2.2 * k)} ${r22(x + hr * 0.05)},${r22(y - hr * 2.3 * k)} Q${r22(x + hr * 0.5)},${r22(y - hr * 2.2 * k)} ${r22(x + hr * 0.3)},${r22(y)} Z`, col, 0.9)}${far ? "" : E(x, y - hr * 1.2 * k, hr * 0.14, hr * 0.8 * k, inner, 0)}</g>`;
        }
        default:
          return "";
      }
    }
    __name(ear, "ear");
    var spots = /* @__PURE__ */ __name((list, col) => list.map(([x, y, rx, ry]) => E(x, y, rx, ry, col, 0)).join(""), "spots");
    var Q = {};
    Q.cow = (v) => {
      const patch = v === "rousse" ? "#B8643A" : "#3E3A3A";
      const corne = /* @__PURE__ */ __name((b, t, col) => {
        const dx = t[0] - b[0], dy = t[1] - b[1], L0 = Math.hypot(dx, dy), nx = -dy / L0, ny = dx / L0, w = 1.35;
        const m = [b[0] + dx * 0.5 - nx * 1.1, b[1] + dy * 0.5 - ny * 1.1];
        const d = `M${r22(b[0] - nx * w)},${r22(b[1] - ny * w)} Q${r22(m[0] - nx * w * 0.9)},${r22(m[1] - ny * w * 0.9)} ${r22(t[0])},${r22(t[1])} Q${r22(m[0] + nx * w * 0.35)},${r22(m[1] + ny * w * 0.35)} ${r22(b[0] + nx * w)},${r22(b[1] + ny * w)} Z`;
        return P(d, col, 0.9) + `<path d="M${r22(t[0] - dx * 0.06)},${r22(t[1] - dy * 0.06)} L${r22(t[0] - dx * 0.2 - nx * 0.25)},${r22(t[1] - dy * 0.2 - ny * 0.25)}" stroke="#C9B48E" stroke-width="0.7" stroke-linecap="round"/>`;
      }, "corne");
      return {
        id: "cow" + (v || ""),
        size: "MID",
        fur: "#FFFFFF",
        furS: "#E2DED6",
        belly: "#F2EEE6",
        // chibi : grosse tête ronde, corps dodu, pattes courtes et trapues aux cuisses rondes, sabots fendus
        body: [-2, -9.8, 9.4, 6.6],
        head: [8.4, -14.6, 6.9],
        headW: 1.02,
        legs: { back: -6.6, front: 4.2, top: -6.2, w: 3.3, hoof: "#5A5250", cloven: true, shape: { haunch: 1.2, arm: 1.1, hock: 0.6, knee: 0.2, foot: 0.9, hipUp: 2.4, armUp: 2 } },
        snout: [4.2, 2.6, 3.7, 2.8, "#F6BDB6"],
        eye: [1.3, -1.4, 1.55],
        ears: { kind: "side", size: 0.82, tilt: 22, inner: "#F6BDB6" },
        tail: { kind: "rope", color: patch },
        parts: {
          coat: /* @__PURE__ */ __name(({ bx, by }) => tache(bx - 4, by - 2.4, 3.8, 2.8, 1, patch) + tache(bx + 4, by + 0.6, 3, 2.3, 2, patch) + tache(bx - 7.8, by + 1.6, 1.9, 1.7, 3, patch), "coat"),
          face: /* @__PURE__ */ __name(({ hx, hy, hr }) => tache(hx - hr * 0.3, hy - hr * 0.46, hr * 0.42, hr * 0.32, 4, patch), "face"),
          // les deux cornes, derrière la tête (le crâne cache leur base) : celle du fond plus sombre
          behindHead: /* @__PURE__ */ __name(({ hx, hy, hr }) => corne([hx - hr * 0.62, hy - hr * 0.72], [hx - hr * 0.42, hy - hr - 3.4], "#DCCDAA") + corne([hx - hr * 0.1, hy - hr * 0.84], [hx + hr * 0.3, hy - hr - 3.6], "#F2E6C8"), "behindHead"),
          // le naseau et la bouche sur le mufle, les cils
          head: /* @__PURE__ */ __name(({ hx, hy, mode }) => {
            const [sx, sy, srx] = [hx + 4.2, hy + 2.6, 3.7];
            const [ex, ey, er] = [hx + 1.3, hy - 1.4, 1.55];
            return `<ellipse cx="${r22(sx + srx * 0.5)}" cy="${r22(sy - 0.5)}" rx="0.62" ry="0.9" fill="#B5625C" transform="rotate(-20 ${r22(sx + srx * 0.5)} ${r22(sy - 0.5)})"/>` + stroke(`M${r22(sx + 0.6)},${r22(sy + 1.4)} Q${r22(sx + 1.6)},${r22(sy + 2)} ${r22(sx + 2.8)},${r22(sy + 1.3)}`, 0.5, OUT) + (mode === "open" ? stroke(`M${r22(ex - er * 0.55)},${r22(ey - er * 0.95)} l-0.7,-0.7 M${r22(ex - er * 0.05)},${r22(ey - er * 1.12)} l-0.35,-0.85`, 0.45, OUT) : "");
          }, "head"),
          // le pis, rose, entre les pattes arrière et le ventre (les pattes proches passent devant)
          back: /* @__PURE__ */ __name(({ bx, by, rest }) => {
            if (rest) return "";
            const x = bx - 1.4, y0 = by + 6.6 * 0.82;
            return P(`M${r22(x - 2.3)},${r22(y0)} Q${r22(x - 2.3)},${r22(y0 + 2.4)} ${r22(x)},${r22(y0 + 2.5)} Q${r22(x + 2.3)},${r22(y0 + 2.4)} ${r22(x + 2.3)},${r22(y0)} Z`, "#F6BDB6", 0.8) + E(x - 1, y0 + 2.6, 0.38, 0.6, "#E89A94", 0.5) + E(x + 1.1, y0 + 2.6, 0.38, 0.6, "#E89A94", 0.5);
          }, "back")
        }
      };
    };
    Q.sheep = (v) => {
      const wool = v === "noir" ? "#5A5458" : "#F8F4EC", woolS = v === "noir" ? "#443F43" : "#DCD5C8", face = v === "noir" ? "#2E2A2E" : "#5E5660";
      const boucle = v === "noir" ? "#3A3539" : "#D2CABC";
      const puffs = /* @__PURE__ */ __name((cx, cy, rx, ry) => {
        let s = "";
        for (let i = 0; i < 10; i++) {
          const a = i / 10 * Math.PI * 2;
          s += E(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 2.6, 2.4, wool, 0.9);
        }
        s += E(cx, cy, rx + 0.4, ry + 0.2, wool, 0) + E(cx - 1.6, cy - 2.6, 3, 1.4, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.4" fill=') + E(cx + 1, cy + 2.6, rx * 0.7, 1.4, woolS, 0).replace("fill=", 'fill-opacity="0.6" fill=');
        return s + [[-4, -1.6], [-1, -3], [2.4, -1.4], [-2.6, 1.6], [1, 1.2], [4.2, 0.8]].map(([x, y]) => stroke(`M${r22(cx + x - 0.8)},${r22(cy + y + 0.3)} q0.2,-1.1 1.1,-0.9 q0.7,0.3 0.3,0.9`, 0.5, boucle)).join("");
      }, "puffs");
      return {
        id: "sheep" + (v || ""),
        size: "MID",
        fur: wool,
        furS: woolS,
        belly: woolS,
        headC: face,
        headCS: face,
        // chibi : grosse tête, nuage de laine dodu, pattes fines en volume aux sabots fendus ; un regard clair dans le
        // visage sombre, un mufle plus clair
        body: [-1.4, -9.4, 7.8, 5.6],
        head: [7.8, -13.6, 5.6],
        legs: { back: -5.2, front: 3.6, top: -5.4, w: 2.1, hoof: "#1E1A1E", cloven: true, color: face, colorS: v === "noir" ? "#1E1A1E" : "#463F48", shape: { haunch: 1.2, arm: 1.1, hock: 0.5, knee: 0.15, foot: 0.9, hipUp: 2, armUp: 1.6 } },
        snout: [3.4, 2, 2.8, 2.1, v === "noir" ? "#4A444A" : "#7A7078"],
        eye: [1.1, -0.9, 1.35],
        iris: "#F2ECE4",
        ears: { kind: "side", size: 0.86, tilt: 18, inner: "#E8A8B0" },
        tail: { kind: "puff", color: wool, r: 2 },
        parts: {
          body: /* @__PURE__ */ __name(({ bx, by }) => puffs(bx, by, 7.4, 5.4), "body"),
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx - 1.2, hy - hr * 0.78, 2.4, 1.8, wool, 0.9) + E(hx + 0.6, hy - hr * 0.95, 1.6, 1.3, wool, 0.9) + E(hx - 2.6, hy - hr * 0.55, 1.5, 1.3, wool, 0.9) + `<ellipse cx="${r22(hx + 5.1)}" cy="${r22(hy + 1.2)}" rx="0.45" ry="0.65" fill="#1E1A1E" transform="rotate(-25 ${r22(hx + 5.1)} ${r22(hy + 1.2)})"/>` + stroke(`M${r22(hx + 3.4)},${r22(hy + 3)} Q${r22(hx + 4.2)},${r22(hy + 3.6)} ${r22(hx + 5)},${r22(hy + 2.8)}`, 0.45, "#1E1A1E"), "head")
        }
      };
    };
    function oreilleCochon(x, y, k, sx, col, dedans) {
      const d = `M${r22(x - sx * 1.6 * k)},${r22(y + 0.8 * k)} Q${r22(x - sx * 0.4 * k)},${r22(y - 2.2 * k)} ${r22(x + sx * 1.4 * k)},${r22(y - 2.4 * k)} Q${r22(x + sx * 2.8 * k)},${r22(y - 2.2 * k)} ${r22(x + sx * 2.6 * k)},${r22(y - 0.6 * k)} Q${r22(x + sx * 2)},${r22(y + 0.6 * k)} ${r22(x + sx * 1.2 * k)},${r22(y + 1 * k)} Z`;
      return P(d, col, 0.85) + (dedans ? `<path d="M${r22(x - sx * 0.6 * k)},${r22(y + 0.2 * k)} Q${r22(x + sx * 0.2 * k)},${r22(y - 1.5 * k)} ${r22(x + sx * 1.4 * k)},${r22(y - 1.6 * k)} Q${r22(x + sx * 2 * k)},${r22(y - 1.2 * k)} ${r22(x + sx * 1.6 * k)},${r22(y - 0.2 * k)} Z" fill="${dedans}"/>` : "") + stroke(`M${r22(x + sx * 1.5 * k)},${r22(y - 2.3 * k)} Q${r22(x + sx * 2.4 * k)},${r22(y - 1.6 * k)} ${r22(x + sx * 2.5 * k)},${r22(y - 0.7 * k)}`, 0.45, "rgba(60,40,25,.4)");
    }
    __name(oreilleCochon, "oreilleCochon");
    Q.pig = (v) => {
      const tach = v === "tachete", patch = "#8A5A5A";
      return {
        id: "pig" + (v || ""),
        size: "MID",
        fur: "#F6BCBC",
        furS: "#E39C9E",
        belly: "#FAD2D0",
        // chibi : tout rond, grosse tête, petites pattes en volume aux sabots fendus, oreilles qui retombent sur le front
        body: [-1.4, -8.8, 8.6, 6.4],
        head: [7.4, -12.8, 6.4],
        legs: { back: -5.2, front: 3.8, top: -4.4, w: 2.8, hoof: "#C77A7C", cloven: true, shape: { haunch: 1.2, arm: 1.1, hock: 0.5, knee: 0.15, foot: 0.92, hipUp: 2, armUp: 1.6 } },
        snout: [5.6, 1.4, 2.2, 2.5, "#F29EA0"],
        eye: [1.4, -1.6, 1.4],
        blush: true,
        ears: {},
        tail: { kind: "curly" },
        parts: {
          coat: /* @__PURE__ */ __name(({ bx, by }) => tach ? tache(bx - 3, by - 2, 3, 2.3, 1, patch) + tache(bx + 4, by + 0.4, 2.1, 1.9, 2, patch) + tache(bx - 6.6, by + 1.6, 1.5, 1.3, 3, patch) : "", "coat"),
          face: /* @__PURE__ */ __name(({ hx, hy, hr }) => tach ? tache(hx - hr * 0.4, hy - hr * 0.32, hr * 0.32, hr * 0.26, 4, patch) : "", "face"),
          // l'oreille du fond, derrière le crâne ; la proche, sur le front, après le visage
          behindHead: /* @__PURE__ */ __name(({ hx, hy, hr }) => oreilleCochon(hx - hr * 0.55, hy - hr * 0.62, 1.05, 1, "#E39C9E", null), "behindHead"),
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + 5.1, hy + 1.6, 0.42, 0.66, "#B8686A", 0) + E(hx + 6.2, hy + 1.6, 0.42, 0.66, "#B8686A", 0) + stroke(`M${r22(hx + 3.2)},${r22(hy + 3.6)} Q${r22(hx + 4)},${r22(hy + 4.3)} ${r22(hx + 4.8)},${r22(hy + 3.7)}`, 0.5, OUT) + oreilleCochon(hx - hr * 0.18, hy - hr * 0.74, 1.15, 1, "#F6BCBC", "#EE9EA6"), "head")
        }
      };
    };
    function corneChevre(b, k, col) {
      const t = [b[0] - 3.4 * k, b[1] - 3.4 * k], m = [b[0] + 0.4 * k, b[1] - 4.2 * k];
      const at = /* @__PURE__ */ __name((u) => [(1 - u) ** 2 * b[0] + 2 * u * (1 - u) * m[0] + u * u * t[0], (1 - u) ** 2 * b[1] + 2 * u * (1 - u) * m[1] + u * u * t[1]], "at");
      const nrm = /* @__PURE__ */ __name((u) => {
        const dx = 2 * (1 - u) * (m[0] - b[0]) + 2 * u * (t[0] - m[0]), dy = 2 * (1 - u) * (m[1] - b[1]) + 2 * u * (t[1] - m[1]), L0 = Math.hypot(dx, dy) || 1;
        return [-dy / L0, dx / L0];
      }, "nrm");
      const d = `M${f2p([b[0] - 1.3, b[1] + 0.2])} Q${f2p([m[0] - 1.3, m[1] + 1.5])} ${f2p(t)} Q${f2p([m[0] + 1.1, m[1] - 1.3])} ${f2p([b[0] + 1.3, b[1] - 0.2])} Z`;
      const ann = [0.28, 0.48, 0.66].map((u) => {
        const p = at(u), n = nrm(u), w = 1.15 * (1 - u * 0.55);
        return `<path d="M${f2p([p[0] - n[0] * w, p[1] - n[1] * w])} L${f2p([p[0] + n[0] * w, p[1] + n[1] * w])}" stroke="rgba(60,40,25,.45)" stroke-width="0.45" stroke-linecap="round"/>`;
      }).join("");
      return P(d, col, 0.85) + ann;
    }
    __name(corneChevre, "corneChevre");
    Q.goat = (v) => {
      const fur = v === "brune" ? "#9A6A44" : "#F4F0E8", furS = v === "brune" ? "#7A5232" : "#D8D2C6", museau = v === "brune" ? "#B48660" : "#EDE6DA";
      return {
        id: "goat" + (v || ""),
        size: "MID",
        fur,
        furS,
        belly: v === "brune" ? "#C49A72" : "#FFFFFF",
        // chibi : grosse tête, corps court, pattes courtes en volume, sabots fendus ; deux cornes en sabre, une barbiche
        body: [-1.6, -10.2, 8, 5.6],
        head: [8, -15.6, 6],
        legs: { back: -5.8, front: 3.8, top: -6.6, w: 2.5, hoof: "#4A3C34", cloven: true, shape: { haunch: 1.25, arm: 1.1, hock: 0.7, knee: 0.2, foot: 0.88, hipUp: 2.2, armUp: 1.8 } },
        snout: [3.8, 2.2, 3, 2.4, museau],
        eye: [1.1, -1.2, 1.35],
        ears: { kind: "side", size: 0.82, tilt: 12, inner: "#F2C6C0" },
        tail: { kind: "short", color: furS },
        parts: {
          neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P(`M${r22(bx + 5.4)},${r22(by - 3.6)} L${r22(hx - 2.6)},${r22(hy - 1)} L${r22(hx + 0.6)},${r22(hy + 3.4)} L${r22(bx + 8.4)},${r22(by + 1)} Z`, fur, 0.9), "neck"),
          // les deux cornes, derrière le crâne : celle du fond plus sombre et en retrait
          behindHead: /* @__PURE__ */ __name(({ hx, hy, hr }) => corneChevre([hx - hr * 0.55, hy - hr * 0.72], 0.95, "#A8987C") + corneChevre([hx - hr * 0.05, hy - hr * 0.84], 1.05, "#C8B898"), "behindHead"),
          // la barbiche en deux mèches sous le menton, le naseau et la bouche, les cils
          head: /* @__PURE__ */ __name(({ hx, hy, hr, mode }) => {
            const [sx, sy] = [hx + 3.8, hy + 2.2], [ex, ey, er] = [hx + 1.1, hy - 1.2, 1.35];
            return P(`M${r22(hx + hr * 0.3)},${r22(hy + hr * 0.78)} Q${r22(hx + hr * 0.2)},${r22(hy + hr * 1.3)} ${r22(hx + hr * 0.36)},${r22(hy + hr * 1.62)} Q${r22(hx + hr * 0.5)},${r22(hy + hr * 1.3)} ${r22(hx + hr * 0.58)},${r22(hy + hr * 1.5)} Q${r22(hx + hr * 0.72)},${r22(hy + hr * 1.1)} ${r22(hx + hr * 0.78)},${r22(hy + hr * 0.78)} Z`, furS, 0.75) + `<ellipse cx="${r22(sx + 1.6)}" cy="${r22(sy - 0.7)}" rx="0.5" ry="0.75" fill="#4A3C34" transform="rotate(-25 ${r22(sx + 1.6)} ${r22(sy - 0.7)})"/>` + stroke(`M${r22(sx + 0.2)},${r22(sy + 1.2)} Q${r22(sx + 1.2)},${r22(sy + 1.8)} ${r22(sx + 2.2)},${r22(sy + 1)}`, 0.45, OUT) + (mode === "open" ? stroke(`M${r22(ex - er * 0.55)},${r22(ey - er * 0.95)} l-0.6,-0.6`, 0.42, OUT) : "");
          }, "head")
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
      nose: [5.9, 1.4, 0.6, OUT],
      eye: [1.1, -1.1, 1.4],
      ears: { kind: "side", size: 1 },
      tail: { kind: "puff", color: "#FFFFFF", r: 1.6 },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => spots([[bx - 4, by - 3.4, 0.8, 0.6], [bx - 1, by - 4, 0.8, 0.6], [bx + 2, by - 3.6, 0.8, 0.6], [bx - 2.6, by - 1.8, 0.7, 0.5], [bx + 0.6, by - 2, 0.7, 0.5]], "#FFF4E0"), "coat"),
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P(`M${r22(bx + 5)},${r22(by - 4)} L${r22(hx - 2.8)},${r22(hy - 0.4)} L${r22(hx + 0.6)},${r22(hy + 3.6)} L${r22(bx + 8.6)},${r22(by + 1)} Z`, "#C98A50", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => thick(`M${r22(hx - 1.4)},${r22(hy - hr * 0.85)} Q${r22(hx - 2.6)},${r22(hy - hr - 3)} ${r22(hx - 1.4)},${r22(hy - hr - 5.6)} M${r22(hx - 2.2)},${r22(hy - hr - 2.6)} L${r22(hx - 4.6)},${r22(hy - hr - 3.8)}`, 0.9, "#E6D2A8"), "head")
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
      nose: [6.4, 1.3, 0.62, OUT],
      eye: [1.2, -1.2, 1.35],
      ears: { kind: "fox", size: 1.1, inner: "#FFF1E2", tip: "#4A3020" },
      tail: { kind: "bushy", len: 10, up: 0.3, tip: "#FFFFFF" },
      parts: { face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.2917, hy + hr * 0.3333, hr * 0.5417, hr * 0.4167, "#FFF4E6", 0), "face") }
    });
    Q.kit = () => ({ ...Q.fox(), id: "kit", size: "SMALL", body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.6, 4.8], legs: { back: -3, front: 2.4, top: -3, w: 1.4, paw: "#3A2A24" }, snout: [2.6, 1.8, 2.2, 1.4, "#FFF4E6"], nose: [4.6, 1.1, 0.5, OUT], eye: [1.1, -0.8, 1.3], tail: { kind: "bushy", len: 7, up: 0.5, tip: "#FFFFFF" } });
    Q.snowFox = () => ({ ...Q.fox(), id: "snowFox", fur: "#F6F8FC", furS: "#C9D4E2", belly: "#FFFFFF", ears: { kind: "fox", size: 0.78, inner: "#F4D8DC" }, tail: { kind: "bushy", len: 10, up: 0.4, tip: "#DCE6F2" }, nose: [5.2, 0.9, 0.55, "#3A3A48"], parts: {} });
    Q.fennec = () => ({ ...Q.fox(), id: "fennec", size: "SMALL", fur: "#EDCB94", furS: "#CFA870", belly: "#FFF6E6", body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.4, 4.6], legs: { back: -3, front: 2.4, top: -3, w: 1.2, paw: "#CFA870" }, snout: [2.6, 1.7, 2.1, 1.35, "#FFF6E6"], nose: [4.4, 1, 0.5, OUT], eye: [1.1, -0.8, 1.3], ears: { kind: "fox", size: 1.45, w: 1.15, inner: "#F6D2C8" }, tail: { kind: "bushy", len: 7, up: 0.3, tip: "#5A4232" }, parts: {} });
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
      nose: [4.5, 0.6, 0.55, OUT],
      eye: [0.7, -0.7, 1.05],
      ears: { kind: "round", size: 0.7 },
      tail: {},
      parts: {
        // dôme de piquants
        body: /* @__PURE__ */ __name(({ bx, by }) => {
          let d = `M${r22(bx + 3.6)},${r22(by + 2.6)}`;
          for (let i = 0; i <= 10; i++) {
            const a = Math.PI * (0.05 + i * 0.09);
            const r = i % 2 ? 6.4 : 8;
            d += ` L${r22(bx - 0.6 - Math.cos(a) * r)},${r22(by + 1.6 - Math.sin(a) * r * 0.9)}`;
          }
          d += ` L${r22(bx - 6.6)},${r22(by + 3.2)} Z`;
          return P(d, "#8A6440") + stroke(`M${r22(bx - 3)},${r22(by - 2)} L${r22(bx - 2)},${r22(by - 4)} M${r22(bx)},${r22(by - 2.4)} L${r22(bx + 0.6)},${r22(by - 4.6)}`, 0.6, "#B88A5A");
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
      nose: [3.9, 0.8, 0.42, OUT],
      eye: [1, -0.9, 1.25],
      ears: { kind: "pointy", size: 0.9, inner: "#F2C6C0" },
      tail: { kind: "bushy", len: 7.6, up: 1.55, tip: "#E07E44" },
      profil: /* @__PURE__ */ __name((c, pose) => ecureuil(c, pose), "profil"),
      trois: /* @__PURE__ */ __name((c, view, pose) => require_betes3().ecureuil3(c, view, pose), "trois"),
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
      nose: [5.6, 1.3, 0.55, OUT],
      eye: [1, -1, 1.35],
      ears: { kind: "side", size: 0.7 },
      tail: { kind: "short", color: "#5A4A3A" },
      parts: {
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P(`M${r22(bx + 5.4)},${r22(by - 4)} L${r22(hx - 2.8)},${r22(hy - 0.6)} L${r22(hx + 0.6)},${r22(hy + 3.6)} L${r22(bx + 8.8)},${r22(by + 1.2)} Z`, "#A8906E", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => {
          const d = `M${r22(hx - 0.6)},${r22(hy - hr * 0.8)} Q${r22(hx - 2)},${r22(hy - hr - 6)} ${r22(hx - 7.6)},${r22(hy - hr - 6.4)} Q${r22(hx - 11.4)},${r22(hy - hr - 5.4)} ${r22(hx - 10.6)},${r22(hy - hr - 1.6)}`;
          return thick(d, 2, "#C8B48E") + [0.25, 0.45, 0.65].map((t) => E(hx - 2 - t * 8, hy - hr - 5.2 - Math.sin(t * Math.PI) * 1.2, 1.2, 0.35, "#8A7656", 0)).join("") + P(`M${r22(hx + hr * 0.43)},${r22(hy + hr * 0.7)} L${r22(hx + hr * 0.17)},${r22(hy + hr * 1.39)} L${r22(hx + hr * 0.7)},${r22(hy + hr * 0.78)} Z`, "#5A4A3A", 0.7);
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
      nose: [6.6, 2, 0.55, OUT],
      eye: [0.8, -1.2, 1.5],
      ears: { kind: "pointy", size: 0.75, inner: "#E8B0A0" },
      tail: { kind: "horse", color: "#F2D28A" },
      parts: {
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => P(`M${r22(bx + 5)},${r22(by - 4.4)} L${r22(hx - 3.4)},${r22(hy - 1)} L${r22(hx + 0.6)},${r22(hy + 4.2)} L${r22(bx + 9.4)},${r22(by + 1.4)} Z`, "#C07A44", 0.9), "neck"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr, bx, by }) => thick(`M${r22(hx - 1)},${r22(hy - hr * 0.9)} Q${r22(hx - 6)},${r22(hy - 2)} ${r22(bx + 4.6)},${r22(by - 5.2)}`, 2.6, "#F2D28A") + P(`M${r22(hx - 0.4)},${r22(hy - hr * 0.95)} Q${r22(hx + 2.6)},${r22(hy - hr * 0.7)} ${r22(hx + 2)},${r22(hy - 1.4)} Q${r22(hx)},${r22(hy - 2.4)} ${r22(hx - 2)},${r22(hy - hr * 0.5)} Z`, "#F2D28A", 0.8), "head")
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
      nose: [6.4, 0.6, 0.45, OUT],
      eye: [0.8, -1, 1.25],
      ears: { kind: "round", size: 0.6 },
      tail: { kind: "tuft", color: "#8A6A44" },
      parts: {
        back: /* @__PURE__ */ __name(({ bx, by }) => E(bx - 0.6, by - 5.6, 5, 4.4, "#D8AE70"), "back"),
        neck: /* @__PURE__ */ __name(({ hx, hy, bx, by }) => thick(`M${r22(bx + 6.4)},${r22(by - 1)} Q${r22(bx + 11)},${r22(by - 2)} ${r22(hx - 1.6)},${r22(hy + 1.6)}`, 3, "#D8AE70"), "neck")
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
        coat: /* @__PURE__ */ __name(({ bx, by }) => [-3, -0.4, 2.2].map((x) => `<path d="M${r22(bx + x)},${r22(by - 3)} L${r22(bx + x + 0.8)},${r22(by + 2)}" stroke="#F2C94C" stroke-width="0.8"/>`).join(""), "coat"),
        behindHead: /* @__PURE__ */ __name(({ hx, hy }) => P(`M${r22(hx - 2.6)},${r22(hy - 1.6)} L${r22(hx - 1.4)},${r22(hy - 4.4)} L${r22(hx + 1)},${r22(hy - 2.4)} Z`, "#7CC46A", 0.8), "behindHead"),
        face: /* @__PURE__ */ __name(({ hx, hy, mode }) => E(hx + 0.7, hy - 0.5, 2.1, 2.1, "#5AA04C", 0.7) + P(`M${r22(hx + 2.2)},${r22(hy + 1.5)} Q${r22(hx + 3.5)},${r22(hy + 1.7)} ${r22(hx + 4.2)},${r22(hy + 0.8)}`, "none", 0.5), "face")
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
          const d = `M${r22(bx - 6.6)},${r22(by + 1.4)} Q${r22(bx - 6)},${r22(by - 7)} ${r22(bx)},${r22(by - 7.2)} Q${r22(bx + 6)},${r22(by - 7)} ${r22(bx + 6.6)},${r22(by + 1.4)} Z`;
          return P(d, "#7E9A4A") + clip(`sh${Math.round(by * 10)}`, d, [[-3.4, -3.6], [0, -5], [3.4, -3.6], [-1.6, -1], [1.8, -1]].map(([x, y]) => `<path d="M${r22(bx + x - 1.6)},${r22(by + y)} l1.6,-1.2 l1.6,1.2 l0,1.6 l-1.6,1.2 l-1.6,-1.2 Z" fill="#9AB85E" stroke="${OUT}" stroke-width="0.5"/>`).join("")) + P(d, "none") + P(`M${r22(bx - 6.6)},${r22(by + 1.4)} L${r22(bx + 6.6)},${r22(by + 1.4)}`, "none", 0.9);
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
      nose: [3.9, 0.5, 0.55, OUT],
      eye: [0.7, -1, 1.15],
      ears: { kind: "round", size: 0.6, inner: "#6E4428" },
      tail: { kind: "otter" },
      parts: { face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.25, hy + hr * 0.38, hr * 0.75, hr * 0.56, "#E8D2B0", 0) + L2([hx + hr * 0.8, hy + hr * 0.38], [hx + hr * 1.38, hy + hr * 0.2], OUT, 0.35) + L2([hx + hr * 0.8, hy + hr * 0.5], [hx + hr * 1.38, hy + hr * 0.58], OUT, 0.35), "face") }
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
      legs: { back: -3.6, front: 2.6, top: -3.8, w: 1.9, paw: "#FFF2E0", shape: { haunch: 1.3, arm: 1.05, hock: 0.5, knee: 0.12, foot: 0.95, hipUp: 1.6, armUp: 1.2 } },
      snout: [2.2, 1.5, 1.8, 1.25, "#FFF2E0"],
      nose: [3.3, 0.7, 0.4, "#E88A90"],
      eye: [1, -0.7, 1.2],
      ears: { kind: "chat", inner: "#F2B0B0" },
      tail: { kind: "chat", w: 1.3 },
      parts: {
        coat: /* @__PURE__ */ __name(({ bx, by }) => {
          const C = CHATS[v || "roux"];
          if (C.taches) return E(bx - 1.6, by - 2.2, 2.2, 1.6, C.taches[0], 0) + E(bx + 2, by - 2.6, 1.4, 1.1, C.taches[1], 0);
          return C.rayures ? [-3, -0.6, 1.8].map((x) => `<path d="M${r22(bx + x)},${r22(by - 3.6)} q0.6,1.6 0,3" fill="none" stroke="${C.furS}" stroke-width="0.9"/>`).join("") : "";
        }, "coat"),
        face: /* @__PURE__ */ __name(({ hx, hy }) => {
          const m = CHATS[v || "roux"].moustache || OUT;
          return L2([hx + 3.2, hy + 1.5], [hx + 5.6, hy + 1], m, 0.35) + L2([hx + 3.2, hy + 2], [hx + 5.6, hy + 2.4], m, 0.35);
        }, "face"),
        // la bouche en « w » sous la truffe
        head: /* @__PURE__ */ __name(({ hx, hy, mode }) => stroke(`M${r22(hx + 2.4)},${r22(hy + 2.1)} q0.45,0.5 0.9,0 q0.45,0.5 0.9,0`, 0.4, OUT) + (mode === "joy" ? E(hx + 3.3, hy + 2.6, 0.45, 0.5, "#F27A8A", 0.4) : ""), "head")
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
      legs: { back: -4, front: 3.4, top: -4, w: 2.5, paw: "#FFF2DE", shape: { haunch: 1.25, arm: 1.05, hock: 0.5, knee: 0.12, foot: 0.98, hipUp: 1.6, armUp: 1.2 } },
      snout: [3.4, 2, 2.8, 2.1, CHIENS[v || "beige"].museau || CHIENS[v || "beige"].belly],
      nose: [5.6, 1.2, 0.68, OUT],
      eye: [1.1, -1.1, 1.35],
      ears: { kind: "hang", size: 1, color: CHIENS[v || "beige"].oreille },
      tail: { kind: "thin", up: 5, w: 1.4 },
      parts: {
        neck: /* @__PURE__ */ __name(({ hx, hy, hr }) => P(`M${r22(hx - hr * 0.82)},${r22(hy + hr * 0.55)} Q${r22(hx - hr * 0.22)},${r22(hy + hr * 1.1)} ${r22(hx + hr * 0.36)},${r22(hy + hr * 0.82)}`, "none", 0).replace('stroke="none"', 'stroke="#E0483C" stroke-width="1.4" stroke-linecap="round"') + E(hx - hr * 0.1, hy + hr * 1.04, 0.7, 0.7, "#F2C94C", 0.5), "neck"),
        // le reflet sur la truffe, la bouche ; dans la joie, la langue qui pend
        head: /* @__PURE__ */ __name(({ hx, hy, mode }) => E(hx + 5.35, hy + 0.9, 0.28, 0.2, "#FFFFFF", 0).replace("fill=", 'opacity="0.8" fill=') + stroke(`M${r22(hx + 5.5)},${r22(hy + 1.9)} L${r22(hx + 5.5)},${r22(hy + 2.6)} M${r22(hx + 4.2)},${r22(hy + 2.9)} Q${r22(hx + 4.9)},${r22(hy + 3.4)} ${r22(hx + 5.5)},${r22(hy + 2.6)}`, 0.45, OUT) + (mode === "joy" ? P(`M${r22(hx + 4.4)},${r22(hy + 3)} Q${r22(hx + 4.3)},${r22(hy + 4.6)} ${r22(hx + 5)},${r22(hy + 4.7)} Q${r22(hx + 5.6)},${r22(hy + 4.5)} ${r22(hx + 5.4)},${r22(hy + 2.9)} Z`, "#F27A8A", 0.6) : ""), "head")
      }
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
        face: /* @__PURE__ */ __name(({ hx, hy }) => P(`M${r22(hx - 1.6)},${r22(hy + 1.2)} Q${r22(hx + 1.8)},${r22(hy + 3)} ${r22(hx + 4.4)},${r22(hy + 0.5)}`, "none", 0.6), "face"),
        head: /* @__PURE__ */ __name(({ hx, hy, mode }) => eye(hx - 1.9, hy - 3.3, 1.12, mode), "head")
      }
    });
    module.exports = { oreilleCochon, BOX, K, quad, Q, eye, heartIcon, limb, thick, stroke, line, hoof, paw, oreilleRenard, oreilleChat, petPose, blob, zed, toes, legShape, cloven, contact, tache };
    function beakOf(b, hx, hy, hr) {
      const x = hx + hr * 0.85, y = hy + (b.dy || 0.4), L0 = b.len || 2.4;
      switch (b.kind) {
        case "long":
          return P(`M${r22(x - 0.4)},${r22(y - 0.9)} L${r22(x + L0)},${r22(y + 0.2)} L${r22(x - 0.4)},${r22(y + 0.9)} Z`, b.color, 0.8);
        case "big":
          return P(`M${r22(x - 0.8)},${r22(y - 2.4)} Q${r22(x + L0 * 0.7)},${r22(y - 2.8)} ${r22(x + L0)},${r22(y + 0.6)} Q${r22(x + L0 * 0.5)},${r22(y + 1)} ${r22(x - 0.6)},${r22(y + 1.6)} Z`, b.color, 0.9) + `<path d="M${r22(x + L0 - 1.2)},${r22(y - 0.6)} L${r22(x + L0)},${r22(y + 0.6)}" stroke="${b.tip || OUT}" stroke-width="1.2"/><path d="M${r22(x - 0.6)},${r22(y - 0.2)} Q${r22(x + L0 * 0.5)},${r22(y - 0.6)} ${r22(x + L0 * 0.95)},${r22(y + 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
        case "puffin":
          return P(`M${r22(x - 0.6)},${r22(y - 2.2)} Q${r22(x + L0)},${r22(y - 1.4)} ${r22(x + L0)},${r22(y + 0.4)} Q${r22(x + L0 * 0.6)},${r22(y + 1.8)} ${r22(x - 0.6)},${r22(y + 1.8)} Z`, "#F07A3A", 0.9) + P(`M${r22(x - 0.6)},${r22(y - 2.2)} L${r22(x + 0.6)},${r22(y - 2)} L${r22(x + 0.6)},${r22(y + 1.7)} L${r22(x - 0.6)},${r22(y + 1.8)} Z`, "#3E6FB8", 0) + `<path d="M${r22(x + 1.4)},${r22(y - 1.5)} Q${r22(x + 2.2)},${r22(y)} ${r22(x + 1.4)},${r22(y + 1.5)}" fill="none" stroke="#F2C94C" stroke-width="0.6"/>`;
        default:
          return P(`M${r22(x - 0.4)},${r22(y - 0.9)} L${r22(x + L0)},${r22(y + 0.1)} L${r22(x - 0.4)},${r22(y + 1)} Z`, b.color || "#F2B33B", 0.8);
      }
    }
    __name(beakOf, "beakOf");
    function faucilles(x, y, cols, up = 1, k = 1, sway = 0) {
      return [[-5.4, -2.4, 2.8, 1], [-4.6, -5.4, 3.1, 0], [-2.4, -6.6, 2.6, 1]].map(([dx, dy, w, i]) => legShape([x, y], [x + dx * k + sway, y + dy * up], w, 0.6, -1.3 * k, cols[i % cols.length], false, 0.75) + stroke(`M${r22(x - dx * 0.05 * k)},${r22(y)} Q${r22(x + dx * 0.55 * k + 0.6 * k)},${r22(y + dy * up * 0.45)} ${r22(x + dx * 0.85 * k + sway)},${r22(y + dy * up * 0.88)}`, 0.35, "rgba(255,255,255,.45)")).join("");
    }
    __name(faucilles, "faucilles");
    function ailePlume(a, b, h, col, id) {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const pt = /* @__PURE__ */ __name((t, v) => [a[0] + dx * t, a[1] + dy * t + h * v], "pt");
      const f = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "f");
      const [p0, p1, p2, p3, p4, p5] = [pt(0, -0.1), pt(0.55, -0.42), pt(1, 0), pt(0.78, 0.55), pt(0.5, 0.78), pt(0.15, 0.62)];
      const d = `M${f(p0)} Q${f(pt(0.25, -0.62))} ${f(p1)} Q${f(pt(0.85, -0.35))} ${f(p2)} Q${f(pt(0.98, 0.42))} ${f(p3)} Q${f(pt(0.7, 0.86))} ${f(p4)} Q${f(pt(0.36, 0.95))} ${f(p5)} Q${f(pt(-0.08, 0.55))} ${f(p0)} Z`;
      const light = tone(col, 1.22);
      return P(d, col, 0.9) + clip(id, d, `<path d="M${f(pt(-0.1, -0.2))} Q${f(pt(0.4, -0.75))} ${f(pt(1.1, -0.1))} L${f(pt(1.1, 0.18))} Q${f(pt(0.45, -0.25))} ${f(pt(-0.1, 0.25))} Z" fill="${light}"/>`) + [[0.62, 0.05, 0.9, 0.4], [0.42, 0.25, 0.66, 0.66], [0.22, 0.3, 0.38, 0.72]].map(([t0, v0, t1, v1]) => stroke(`M${f(pt(t0, v0))} Q${f(pt((t0 + t1) / 2 + 0.06, (v0 + v1) / 2))} ${f(pt(t1, v1))}`, 0.45, "rgba(60,40,25,.55)")).join("");
    }
    __name(ailePlume, "ailePlume");
    function bird(c, pose) {
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
        if (lg.fine) {
          const col = i ? lg.color : tone(lg.color, 0.86), fx = x + dx;
          const toe = /* @__PURE__ */ __name((x1, y1) => stroke(`M${r22(fx)},-0.5 L${r22(x1)},${r22(y1)}`, 1.6, OUT) + stroke(`M${r22(fx)},-0.5 L${r22(x1)},${r22(y1)}`, 0.7, col), "toe");
          s += contact(fx + 0.4, 1.4) + limb([x, by + bry * 0.55], [fx, -0.6], lg.w || 0.75, col) + toe(fx - 1, -0.3) + toe(fx + 1.6, -0.3) + toe(fx + 0.8, 0.05) + [0.35, 0.6].map((t2) => line([x + (fx - x) * t2 - 0.4, by + bry * 0.55 + (-0.6 - by - bry * 0.55) * t2], [x + (fx - x) * t2 + 0.4, by + bry * 0.55 + (-0.6 - by - bry * 0.55) * t2 + 0.2], 0.3, "rgba(60,40,25,.6)")).join("");
        } else s += limb([x, by + bry * 0.7], [x + dx, -0.6], lg.w || 0.7, lg.color) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 1.6, OUT) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 0.7, lg.color);
      }
      s += c.parts?.back ? c.parts.back(ctx) : "";
      const t = c.tail || {};
      const tx = bx - brx * 0.85, ty = by - bry * 0.1;
      if (t.kind === "fan") s += P(`M${r22(tx + 1)},${r22(ty + 1)} L${r22(tx - (t.len || 3.6))},${r22(ty - (t.up || 4.6))} Q${r22(tx - (t.len || 3.6) + 1.6)},${r22(ty - (t.up || 4.6) - 1.2)} ${r22(tx + 1.4)},${r22(ty - 1.4)} Z`, t.color || c.wing);
      if (t.kind === "long") s += P(`M${r22(tx + 1)},${r22(ty - 0.6)} L${r22(tx - (t.len || 4))},${r22(ty + 0.6)} L${r22(tx + 1)},${r22(ty + 1.8)} Z`, t.color || c.wing);
      if (t.kind === "sickle") s += faucilles(tx + 1.2, ty - 0.4, t.colors, 0.95, 1, walk ? ph * 0.4 : 0);
      const bd = `M${r22(bx - brx)},${r22(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
      s += P(bd, c.color) + clip(`b${c.id}${pose}`, bd, `<rect x="${r22(bx - brx - 1)}" y="${r22(by - bry - 1)}" width="${r22(brx * 2 + 2)}" height="${r22(bry * 2 + 2)}" fill="${tone(c.color, 0.86)}"/><ellipse cx="${r22(bx - brx * 0.1)}" cy="${r22(by - bry * 0.16)}" rx="${r22(brx * 0.98)}" ry="${r22(bry * 0.9)}" fill="${c.color}"/><ellipse cx="${r22(bx + brx * 0.35)}" cy="${r22(by + bry * 0.4)}" rx="${r22(brx * 0.75)}" ry="${r22(bry * 0.75)}" fill="${c.belly || c.color}"/>` + (c.parts?.coat ? c.parts.coat(ctx) : "")) + P(bd, "none");
      const wingUp = walk && ph < 0 ? -0.6 : 0;
      if (c.wingKind === "plume") s += ailePlume([bx + brx * 0.42, by - bry * 0.2 + wingUp], [bx - brx * 0.92, by + bry * 0.12 + wingUp], bry * 0.78, c.wing, `ap${c.id}${pose}`);
      else s += P(`M${r22(bx - brx * 0.6)},${r22(by - bry * 0.35 + wingUp)} Q${r22(bx + brx * 0.2)},${r22(by - bry * 0.75 + wingUp)} ${r22(bx + brx * 0.45)},${r22(by - bry * 0.05)} Q${r22(bx)},${r22(by + bry * 0.65)} ${r22(bx - brx * 0.95)},${r22(by + bry * 0.25)} Z`, c.wing, 0.9);
      s += c.parts?.body ? c.parts.body(ctx) : "";
      if (c.neck) s += thick(c.neck(ctx), c.neckW || 2.4, c.headColor || c.color);
      s += c.parts?.behindHead ? c.parts.behindHead(ctx) : "";
      const hcol = c.headColor || c.color, hd = `M${r22(hx - hr)},${r22(hy)} a${r22(hr)},${r22(hr)} 0 1,0 ${r22(2 * hr)},0 a${r22(hr)},${r22(hr)} 0 1,0 ${r22(-2 * hr)},0 Z`;
      s += P(hd, hcol) + clip(`b${c.id}${pose}h`, hd, `<rect x="${r22(hx - hr - 1)}" y="${r22(hy - hr - 1)}" width="${r22(hr * 2 + 2)}" height="${r22(hr * 2 + 2)}" fill="${tone(hcol, 0.88)}"/><ellipse cx="${r22(hx - hr * 0.12)}" cy="${r22(hy - hr * 0.14)}" rx="${r22(hr * 0.97)}" ry="${r22(hr * 0.92)}" fill="${hcol}"/>`) + P(hd, "none");
      s += c.parts?.face ? c.parts.face(ctx) : "";
      s += beakOf(c.beak, hx, hy, hr);
      const [edx, edy, er] = c.eye;
      s += eye(hx + edx, hy + edy, er, mode);
      if (c.blush !== false) s += E(hx + edx - er * 0.2, hy + edy + er * 1.5, er * 0.8, er * 0.4, "#F7A8B0", 0);
      s += c.parts?.head ? c.parts.head(ctx) : "";
      if (pose === "joie") s += heartIcon(hx, Math.max(hy - hr - 2.4, BOX[c.size][1] + 2), 1.2);
      return s;
    }
    __name(bird, "bird");
    var B = {};
    B.hen = (v) => {
      const col = { blanche: "#FFFFFF", rousse: "#C8642E", noire: "#3A3A42", grise: "#B4B4B8" }[v || "rousse"];
      const wing = { blanche: "#E6E2DA", rousse: "#A84E22", noire: "#2A2A32", grise: "#8E8E94" }[v || "rousse"];
      const queue = v === "noire" ? ["#2E7A66", "#22584C"] : v === "blanche" ? ["#F4F1EA", "#DCD7CC"] : v === "grise" ? ["#8E8E96", "#AEAEB4"] : ["#9A4520", "#C2622E"];
      return {
        id: "hen" + (v || ""),
        size: "SMALL",
        color: col,
        wing,
        wingKind: "plume",
        belly: v === "noire" ? "#4A4A54" : v === "rousse" ? "#E08A4E" : col,
        // chibi : grosse tête ronde sur un corps dodu, une aile à plumes, une queue en faucilles, des pattes écailleuses
        body: [-0.6, -6.6, 4.8, 4.2],
        head: [3.2, -11.4, 3.7],
        t3: { lenDos: 1.02 },
        beak: { kind: "cone", len: 1.9, color: "#F2B33B" },
        eye: [0.9, -0.5, 0.98],
        legs: { xs: [-1.4, 0.8], top: -2.6, color: "#F2B33B", fine: true, w: 1.15 },
        tail: { kind: "sickle", colors: queue },
        parts: {
          // la crête à quatre lobes, les deux barbillons, l'oreillon clair
          head: /* @__PURE__ */ __name(({ hx, hy, hr }) => {
            const y0 = hy - hr + 0.7;
            const lobes = [[-1.5, 1.5], [-0.5, 2.2], [0.5, 2], [1.4, 1.4]].map(([dx, h], k) => `${k ? "Q" : "M"}${k ? `${r22(hx + dx - 0.5)},${r22(y0 - h - 0.6)} ` : ""}${r22(hx + dx)},${r22(y0 - h)}`).join(" ");
            return P(`M${r22(hx - 1.9)},${r22(y0 + 0.4)} Q${r22(hx - 2.3)},${r22(y0 - 1.4)} ${r22(hx - 1.5)},${r22(y0 - 1.5)} Q${r22(hx - 1.2)},${r22(y0 - 2.6)} ${r22(hx - 0.5)},${r22(y0 - 2.2)} Q${r22(hx - 0.1)},${r22(y0 - 2.9)} ${r22(hx + 0.5)},${r22(y0 - 2)} Q${r22(hx + 1.2)},${r22(y0 - 2.3)} ${r22(hx + 1.4)},${r22(y0 - 1.4)} Q${r22(hx + 2)},${r22(y0 - 0.8)} ${r22(hx + 1.5)},${r22(y0 + 0.5)} Z`, "#E8483C", 0.7) + E(hx + hr * 0.82, hy + hr * 0.66, 0.62, 0.95, "#E8483C", 0.6) + E(hx + hr * 1.08, hy + hr * 0.58, 0.5, 0.8, "#D63A30", 0.6) + (lobes ? "" : "");
          }, "head"),
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
      // tout rond, grands yeux, une houppette de trois plumes, le duvet ébouriffé sur la poitrine, des pattes fines
      body: [-0.3, -3.6, 3.2, 2.9],
      head: [1.6, -7, 3],
      beak: { kind: "cone", len: 1.2, color: "#F29A3B" },
      eye: [0.75, -0.4, 0.98],
      legs: { xs: [-0.8, 0.8], top: -1.4, color: "#F29A3B", w: 0.75, fine: true },
      tail: {},
      parts: {
        // la houppette : trois plumes en éventail, la plus haute au milieu
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => [[-1.1, -1.6, -0.9], [1.1, -1.5, 0.9], [0, -2.4, 0.2]].map(([dx, dy, c]) => P(`M${r22(hx + dx * 0.35 - 0.55)},${r22(hy - hr + 0.6)} Q${r22(hx + dx * 0.7 + c * 0.3 - 0.6)},${r22(hy - hr + dy * 0.6)} ${r22(hx + dx + c * 0.4)},${r22(hy - hr + dy)} Q${r22(hx + dx * 0.7 + c * 0.3 + 0.6)},${r22(hy - hr + dy * 0.45)} ${r22(hx + dx * 0.35 + 0.55)},${r22(hy - hr + 0.6)} Z`, "#FFE16A", 0.55)).join(""), "head"),
        // le duvet : trois mèches sur la poitrine
        body: /* @__PURE__ */ __name(({ bx, by }) => [[1.6, 0.6], [2.2, 1.4], [1.2, 1.8]].map(([x, y]) => stroke(`M${r22(bx + x)},${r22(by + y)} q0.5,-0.2 0.7,0.4`, 0.4, "#E8B830")).join(""), "body")
      }
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
      neck: /* @__PURE__ */ __name(({ bx, by, hx, hy }) => `M${r22(bx + 4)},${r22(by - 2)} Q${r22(bx + 9)},${r22(by - 6)} ${r22(hx - 1)},${r22(hy + 6)} Q${r22(hx - 2.4)},${r22(hy + 3)} ${r22(hx)},${r22(hy + 1)}`, "neck"),
      neckW: 2.2,
      parts: {
        // la calotte noire passe sous l'œil, l'aigrette par-dessus la tête
        face: /* @__PURE__ */ __name(({ hx, hy, hr }) => E(hx + hr * 0.05, hy - hr * 0.55, hr * 0.78, hr * 0.36, "#3A3A48", 0), "face"),
        head: /* @__PURE__ */ __name(({ hx, hy, hr }) => thick(`M${r22(hx - hr * 0.6)},${r22(hy - hr * 0.42)} Q${r22(hx - hr * 1.7)},${r22(hy - hr * 0.6)} ${r22(hx - hr * 2.2)},${r22(hy + hr * 0.25)}`, 0.6, "#3A3A48"), "head")
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
        head: /* @__PURE__ */ __name(({ hx, hy, hr, mode }) => mode === "open" ? `<path d="M${r22(hx - hr * 0.1)},${r22(hy - hr * 0.6)} L${r22(hx + hr * 0.58)},${r22(hy - hr * 0.4)}" stroke="${OUT}" stroke-width="0.75" stroke-linecap="round"/>` : "", "head")
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
      parts: { body: /* @__PURE__ */ __name(({ bx, by }) => `<path d="M${r22(bx - 2)},${r22(by - 2.4)} Q${r22(bx)},${r22(by - 3.4)} ${r22(bx + 2)},${r22(by - 2.2)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>`, "body") }
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
      parts: { head: /* @__PURE__ */ __name(({ hx, hy, hr }) => P(`M${r22(hx - hr)},${r22(hy - 0.4)} Q${r22(hx - hr * 0.6)},${r22(hy - hr)} ${r22(hx + hr * 0.8)},${r22(hy - hr * 0.55)} Q${r22(hx)},${r22(hy - hr * 0.35)} ${r22(hx - hr)},${r22(hy - 0.4)} Z`, "#5C9CE0", 0) + `<path d="M${r22(hx - hr * 0.7)},${r22(hy + hr * 0.09)} L${r22(hx + hr * 0.52)},${r22(hy - hr * 0.17)}" stroke="#2A3A5A" stroke-width="0.5"/>`, "head") }
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
        const bez2 = /* @__PURE__ */ __name((p0, c3, p12, t) => [0, 1].map((i) => (1 - t) ** 2 * p0[i] + 2 * t * (1 - t) * c3[i] + t * t * p12[i]), "bez");
        const d = `M${r22(a[0])},${r22(a[1])} Q${r22(c1[0])},${r22(c1[1])} ${r22(tip[0])},${r22(tip[1])} Q${r22(c2[0])},${r22(c2[1])} ${r22(b[0])},${r22(b[1])} Z`;
        const p1 = bez2(a, c1, tip, 0.6), p2 = bez2(tip, c2, b, 0.42);
        const sp = [p1[0] + (tip[0] - p1[0]) * 0.35 + (p2[0] - p1[0]) * 0.3, p1[1] + (tip[1] - p1[1]) * 0.35 + (p2[1] - p1[1]) * 0.3];
        return P(d, col, 0.9) + clip(`gv${pose}${k}`, d, P(`M${r22(p1[0])},${r22(p1[1])} L${r22(tip[0] + ux * 2)},${r22(tip[1] + uy * 2)} L${r22(p2[0])},${r22(p2[1])} Z`, "#2A2A32", 0)) + E(sp[0], sp[1], 0.5, 0.45, "#FFFFFF", 0) + P(d, "none", 0.9);
      }, "aile");
      let s = g.ombre ? E(0, -0.2, 4.6 * g.ombre, 1.2 * g.ombre, "rgba(40,55,20,.18)", 0) : "";
      const leg = /* @__PURE__ */ __name((x, to) => limb([x, y + 2.4], to, 0.65, "#F2B33B"), "leg");
      if (g.pattes === "pliees") s += leg(-1.4, [-1.8, -0.6]) + leg(0.6, [0.4, -0.6]) + line([-2.6, -0.4], [-0.8, -0.4], 1.5, OUT) + line([-0.4, -0.4], [1.4, -0.4], 1.5, OUT);
      if (g.pattes === "pendantes") s += leg(-1.2, [-1.6, y + 6]) + leg(0.6, [0.4, y + 6.2]);
      if (g.pattes === "repliees") s += leg(-1, [-5, y + 3]) + leg(0.4, [-4.4, y + 3.6]);
      if (far) s += aile(far, tone(c.wing, 0.86), 0.92);
      s += P(`M${r22(-3.8)},${r22(y - 0.6)} L${r22(-8.4)},${r22(y - 0.2 + (pose === "plane" ? -0.6 : 0))} L${r22(-8)},${r22(y + 1.4)} L${r22(-3.8)},${r22(y + 1.6)} Z`, "#F4F4F4") + P(`M${r22(-7.4)},${r22(y - 0.3)} L${r22(-8.4)},${r22(y - 0.2)} L${r22(-8)},${r22(y + 1.4)} L${r22(-7.2)},${r22(y + 1.3)} Z`, "#3A3A44", 0);
      const bd = `M${r22(-5)},${r22(y)} a5,3.2 0 1,0 10,0 a5,3.2 0 1,0 -10,0 Z`;
      s += P(bd, c.color) + clip(`gv${pose}`, bd, `<ellipse cx="0.6" cy="${r22(y + 1.6)}" rx="5" ry="1.8" fill="${tone(c.color, 0.9)}"/>`) + P(bd, "none");
      const hx = 4.8, hy = y - 2.4, hr = 3.1, hd = `M${r22(hx - hr)},${r22(hy)} a${hr},${hr} 0 1,0 ${r22(2 * hr)},0 a${hr},${hr} 0 1,0 ${r22(-2 * hr)},0 Z`;
      s += P(hd, c.color) + clip(`gv${pose}h`, hd, `<ellipse cx="${r22(hx + 0.3)}" cy="${r22(hy + hr * 0.5)}" rx="${r22(hr)}" ry="${r22(hr * 0.6)}" fill="${tone(c.color, 0.9)}"/>`) + P(hd, "none");
      s += beakOf(c.beak, hx, hy, hr) + E(hx + hr * 0.85 + 2.1, hy + 0.7, 0.4, 0.35, "#E8483C", 0);
      s += eye(hx + 0.8, hy - 0.5, 0.9, "open") + E(hx + 0.6, hy + 0.9, 0.7, 0.35, "#F7A8B0", 0);
      if (near) s += aile(near, c.wing, 1);
      return s;
    }
    __name(gullFly, "gullFly");
    BOX.GULL_FLY = box(-14, -28, 28, 30);
    var ovale = /* @__PURE__ */ __name((cx, cy, rx, ry, a = 0) => {
      const pts = [];
      for (let i = 0; i < 32; i++) {
        const t = i / 32 * Math.PI * 2;
        pts.push(rot2(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, cx, cy, a));
      }
      return "M" + pts.map(f2p).join(" L") + " Z";
    }, "ovale");
    var rot2 = /* @__PURE__ */ __name((x, y, cx, cy, a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
    }, "rot2");
    var bez = /* @__PURE__ */ __name((p0, p1, p2, p3, n) => Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1), u = 1 - t;
      return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
    }), "bez");
    function panache(ligne, w, col, clair, sombre, id) {
      const n = ligne.length, G2 = [], D = [];
      ligne.forEach((p, i) => {
        const a = ligne[Math.max(0, i - 1)], b = ligne[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], L0 = Math.hypot(tx, ty) || 1;
        G2.push([p[0] - ty / L0 * w[i], p[1] + tx / L0 * w[i]]);
        D.push([p[0] + ty / L0 * w[i], p[1] - tx / L0 * w[i]]);
      });
      const fest = /* @__PURE__ */ __name((pts, k) => pts.slice(1).map((q, i) => {
        const p = pts[i], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], c = ligne[pts === G2 ? i : n - 2 - i] || m, o = [m[0] + (m[0] - c[0]) * 0.16 * k, m[1] + (m[1] - c[1]) * 0.16 * k];
        return `Q${f2p(o)} ${f2p(q)}`;
      }).join(" "), "fest");
      const Dr = D.slice().reverse(), bout = ligne[n - 1], fin = w[n - 1];
      const d = `M${f2p(G2[0])} ${fest(G2, 1)} A${r22(fin)},${r22(fin)} 0 0,1 ${f2p(Dr[0])} ${fest(Dr, 0.35)} Z`;
      const raie = "M" + ligne.slice(1, -1).map(f2p).join(" L");
      return P(d, col, 0.95) + clip(id, d, `<path d="${"M" + D.map(f2p).join(" L")}" fill="none" stroke="${sombre}" stroke-width="${r22(Math.max(...w) * 0.9)}" stroke-linejoin="round" opacity="0.55"/><path d="${raie}" fill="none" stroke="${clair}" stroke-width="${r22(Math.max(...w) * 0.55)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>` + E(bout[0], bout[1], fin * 0.9, fin * 0.9, clair, 0).replace("fill=", 'opacity="0.6" fill=')) + P(d, "none", 0.95);
    }
    __name(panache, "panache");
    function oreilleEcureuil(x, y, k, a, col, dedans, pinceau) {
      const d = `M${r22(x - 1.4 * k)},${r22(y + 0.6)} Q${r22(x - 1.6 * k)},${r22(y - 2.4 * k)} ${r22(x - 0.1 * k)},${r22(y - 3.4 * k)} Q${r22(x + 1.5 * k)},${r22(y - 2.3 * k)} ${r22(x + 1.4 * k)},${r22(y + 0.6)} Z`;
      const tip = [x - 0.1 * k, y - 3.4 * k];
      return `<g transform="rotate(${r22(a)} ${r22(x)} ${r22(y)})">` + P(d, col, 0.9) + (dedans ? `<path d="M${r22(x - 0.7 * k)},${r22(y + 0.2)} Q${r22(x - 0.8 * k)},${r22(y - 1.8 * k)} ${r22(x - 0.1 * k)},${r22(y - 2.4 * k)} Q${r22(x + 0.7 * k)},${r22(y - 1.7 * k)} ${r22(x + 0.7 * k)},${r22(y + 0.2)} Z" fill="${dedans}"/>` : "") + [-0.6, 0, 0.6].map((dx) => stroke(`M${r22(tip[0])},${r22(tip[1] + 0.4)} q${r22(dx * 0.7)},-0.9 ${r22(dx * 1.1)},-1.6`, 0.55, pinceau)).join("") + "</g>";
    }
    __name(oreilleEcureuil, "oreilleEcureuil");
    var GLAND = /* @__PURE__ */ __name((x, y) => E(x, y + 0.5, 1.1, 1.35, "#B98552", 0.7) + P(`M${r22(x - 1.35)},${r22(y - 0.1)} Q${r22(x)},${r22(y - 1.6)} ${r22(x + 1.35)},${r22(y - 0.1)} Z`, "#7E5530", 0.7) + line([x, y - 1.1], [x + 0.3, y - 1.8], 0.45, "#5A3A1E"), "GLAND");
    function ecureuil(c, pose) {
      const walk = pose === "marche1" || pose === "marche2", rest = pose === "repos" || pose === "clignement";
      const mode = pose === "clignement" ? "blink" : pose === "joie" ? "joy" : "open";
      const S = {
        marche1: { b: [1, -4.6, -0.62], h: [4.2, -8.8], m: [[4.6, -0.7], [3.9, -0.6]], pied: -1.6, q: 0.22 },
        marche2: { b: [0.2, -5.4, -0.3], h: [2.7, -10.4], m: [[3, -4.6], [2.5, -5]], pied: 0.2, q: 0 },
        repos: { b: [0, -5.6, -0.14], h: [2.2, -10.8], m: [[3.4, -7.2], [2.9, -7.6]], pied: 0.4, q: -0.08 },
        joie: { b: [0.1, -5.8, -0.18], h: [2.4, -11.1], m: [[3.6, -8.6], [3.1, -9.2]], pied: 0.4, q: -0.05 }
      }[rest ? "repos" : pose];
      const [bx, by, ba] = S.b, [hx, hy] = S.h, hr = 3.9, fur = c.fur, furS = c.furS, belly = c.belly;
      let s = E(-0.4, -0.15, 5.2, 1.2, "rgba(40,55,20,.18)", 0);
      const base = [-3.2, -2.4];
      const ligne = [...bez(base, [-7.4, -3.2], [-7.8, -10.4], [-5, -13.8], 9), ...bez([-5, -13.8], [-2.8, -16.8], [0.4, -16.6], [-0.3, -14], 6).slice(1)].map(([x, y]) => rot2(x, y, base[0], base[1], S.q + (walk && pose === "marche2" ? 0.04 : 0)));
      const w = ligne.map((_, i) => 1.1 + Math.sin(Math.min(1, i / 8) * Math.PI / 2) * 2.1 - Math.max(0, i - 10) * 0.18);
      s += panache(ligne, w, fur, c.tail.tip, furS, `ec${pose}q`);
      const main = /* @__PURE__ */ __name(([x, y], col) => E(x, y, 0.95, 0.75, col, 0.8) + toes(x + 0.1, y - 0.2, 0.8), "main");
      s += main(S.m[1], furS);
      const bd = ovale(bx, by, 3.2, 4.1, ba);
      const [vx, vy] = rot2(bx + 1.6, by + 0.6, bx, by, ba);
      s += P(bd, fur) + clip(`ec${pose}b`, bd, `<path d="${ovale(bx - 1.2, by + 0.4, 3.2, 4.4, ba)}" fill="${furS}"/><path d="${ovale(bx + 0.2, by - 0.3, 3, 4, ba)}" fill="${fur}"/>` + E(vx, vy, 1.7, 3, belly, 0)) + P(bd, "none");
      const [cx, cy] = rot2(bx - 1, by + 2.3, bx, by, ba * 0.5);
      s += contact(S.pied + 0.6, 2.2) + E(S.pied + 0.6, -0.75, 2.6, 0.85, furS, 0.8) + toes(S.pied + 2.4, -0.85, 0.9);
      const cd = ovale(cx, cy, 2.5, 2.1, -0.3);
      s += P(cd, fur) + clip(`ec${pose}c`, cd, `<path d="${ovale(cx - 0.6, cy + 0.7, 2.5, 2.1, -0.3)}" fill="${furS}"/><path d="${ovale(cx + 0.2, cy - 0.2, 2.3, 1.9, -0.3)}" fill="${fur}"/>`) + P(cd, "none");
      s += oreilleEcureuil(hx - 1.6, hy - hr * 0.62, 0.95, -18, furS, null, tone(furS, 0.6));
      s += oreilleEcureuil(hx - 0.3, hy - hr * 0.66, 1.08, -6, fur, "#F2C6C0", tone(furS, 0.6));
      const hd = `M${r22(hx - hr)},${r22(hy)} a${hr},${hr} 0 1,0 ${2 * hr},0 a${hr},${hr} 0 1,0 ${-2 * hr},0 Z`;
      s += P(hd, fur) + clip(`ec${pose}h`, hd, `<rect x="${r22(hx - hr - 1)}" y="${r22(hy - hr - 1)}" width="${r22(hr * 2 + 2)}" height="${r22(hr * 2 + 2)}" fill="${furS}"/>` + E(hx - hr * 0.12, hy - hr * 0.14, hr * 0.97, hr * 0.92, fur, 0) + E(hx + hr * 0.5, hy + hr * 0.55, hr * 0.62, hr * 0.45, belly, 0)) + P(hd, "none");
      s += E(hx + hr * 0.78, hy + hr * 0.18, 1.55, 1.15, belly, 0.8) + E(hx + hr * 1.12, hy - hr * 0.02, 0.5, 0.42, OUT, 0.4) + stroke(`M${r22(hx + hr * 0.82)},${r22(hy + hr * 0.42)} q0.5,0.4 1,0.05`, 0.45, OUT);
      s += eye(hx + hr * 0.3, hy - hr * 0.22, 1.18, mode) + E(hx + hr * 0.12, hy + hr * 0.32, 0.95, 0.5, "#F7A8B0", 0);
      if (rest) s += GLAND(hx + hr * 0.62, hy + hr * 0.95);
      s += main(S.m[0], fur);
      if (pose === "joie") s += heartIcon(hx + 0.6, Math.max(hy - hr - 4.6, BOX[c.size][1] + 2));
      return s;
    }
    __name(ecureuil, "ecureuil");
    module.exports.ecureuil = ecureuil;
    module.exports.panache = panache;
    module.exports.oreilleEcureuil = oreilleEcureuil;
    module.exports.ovale = ovale;
    module.exports.bez = bez;
    module.exports.GLAND = GLAND;
    module.exports.bird = bird;
    module.exports.faucilles = faucilles;
    module.exports.ailePlume = ailePlume;
    module.exports.B = B;
    module.exports.gullFly = gullFly;
    Object.assign(BOX, {
      BUTTERFLY: box(-6, -9, 12, 9),
      FIREFLY: box(-5, -5, 10, 10),
      BEE: box(-5, -7, 10, 8),
      OWL: box(-6, -14, 12, 15),
      TICTAC: box(-6, -10, 12, 11),
      KOI: box(-10, -4, 20, 8),
      FISH: box(-16, -28, 32, 32),
      DOLPHIN: box(-26, -22, 52, 36),
      WHALE_BACK: box(-50, -18, 100, 27),
      WHALE_FLUKE: box(-26, -30, 52, 38),
      BOWL: box(-6, -10, 12, 11),
      JELLY: box(-8, -12, 16, 16)
    });
    var glowDot = /* @__PURE__ */ __name((x, y, r, rgb, a = 0.45) => {
      const id = `lueur-bete_${[x, y, r, a].map(r22).join("_")}_${rgb}`.replace(/,/g, "-").replace(/\./g, "p");
      return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r22(Math.min(0.9, a * 1.7))}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r)}" fill="url(#${id})"/>`;
    }, "glowDot");
    var water = /* @__PURE__ */ __name((x, y, w) => `<path d="M${r22(x - w)},${r22(y)} Q${r22(x - w / 2)},${r22(y - 1.2)} ${x},${r22(y)} Q${r22(x + w / 2)},${r22(y + 1.2)} ${r22(x + w)},${r22(y)}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.85"/>`, "water");
    var splash = /* @__PURE__ */ __name((x, y, k = 1) => [[-3, -2.6], [0, -3.6], [3, -2.4]].map(([dx, dy]) => E(x + dx * k, y + dy * k, 0.7 * k, 0.9 * k, "#BFE6FF", 0.5)).join(""), "splash");
    function butterfly(v, pose) {
      const col = { jaune: ["#F6D04A", "#E8A83A", "#FFE9A8"], bleu: ["#6AB4F0", "#3E7FC1", "#D2E8FC"], lune: ["#CFF2D8", "#8ACB9E"] }[v];
      const open = pose === "vol2" ? 0.45 : pose === "repos" ? 0.25 : 1;
      const y = pose === "repos" ? -3.6 : -5;
      const wing = /* @__PURE__ */ __name((m) => `<g transform="translate(0 ${y}) scale(${r22(m * open)} 1)">${P("M0,0 Q2.6,-5.4 5.6,-3.6 Q6.6,-1 2.4,0.4 Q5.2,1.6 4,3.6 Q1.6,4.4 0,1 Z", col[0])}${E(3.4, -2.6, 0.9, 0.7, col[1], 0)}${v === "lune" ? E(3, -2.4, 0.5, 0.5, "#FFFFFF", 0) : ""}</g>`, "wing");
      if (pose === "repos") {
        const fl = [0, 72, 144, 216, 288].map((a) => E(Math.cos(a * Math.PI / 180) * 1.6, -1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.2, 0.8, "#F7C6D9", 0.5)).join("") + E(0, -1.4, 0.8, 0.6, "#F2C94C", 0.4);
        return '<g transform="translate(0 -1.3)">' + limb([0, -1.2], [0, 0], 0.6, "#6CAE5A") + fl + P("M0,-2.6 Q-1.4,-8.6 2.6,-9.6 Q4.6,-6.4 0.6,-2.4 Z", col[0], 0.7) + E(2, -7, 0.8, 0.6, col[1], 0) + (v === "lune" ? limb([-0.6, -2.4], [0.6, -4.2], 1.1, "#EDE5D2") + stroke("M1.2,-5.4 Q2,-6.6 3,-6.8", 0.35, OUT) + stroke("M1.7,-6.1 l0.3,0.4 M2.3,-6.6 l0.2,0.45", 0.3, OUT) + E(1, -4.9, 1.05, 0.95, "#F4EEDF", 0.7) + eye(1.35, -5, 0.38, "open") + E(1.05, -4.3, 0.3, 0.16, "#F7A8B0", 0) : limb([-0.6, -2.4], [0.6, -4.2], 1, "#4A3A30") + stroke("M1.2,-5.5 Q2,-6.8 3,-6.9", 0.35, OUT) + E(3, -6.9, 0.3, 0.3, OUT, 0) + E(1, -4.9, 1, 0.92, col[2], 0.7) + eye(1.35, -5, 0.38, "open") + E(1.05, -4.3, 0.3, 0.16, "#F7A8B0", 0)) + "</g>";
      }
      let s = wing(-1) + wing(1);
      if (v === "lune") {
        const feather = /* @__PURE__ */ __name((m) => stroke(`M${r22(m * 0.4)},${r22(y - 3.6)} Q${r22(m * 1.2)},${r22(y - 5.2)} ${r22(m * 2)},${r22(y - 5.6)}`, 0.4, OUT) + [0.35, 0.65].map((k) => stroke(`M${r22(m * (0.4 + 1.6 * k))},${r22(y - 3.6 - 2 * k)} l${r22(m * 0.5)},0.3`, 0.3, OUT)).join(""), "feather");
        s += feather(-1) + feather(1) + E(0, y + 0.4, 1, 2.4, "#EDE5D2", 0.7) + L2([-0.7, y + 0.6], [0.7, y + 0.6], "#C9BFA8", 0.35) + L2([-0.6, y + 1.6], [0.6, y + 1.6], "#C9BFA8", 0.35) + E(0, y - 2.5, 1.45, 1.3, "#F4EEDF", 0.7) + eye(-0.55, y - 2.55, 0.42, pose === "joie" ? "joy" : "open") + eye(0.55, y - 2.55, 0.42, pose === "joie" ? "joy" : "open") + E(-0.95, y - 1.85, 0.32, 0.17, "#F7A8B0", 0) + E(0.95, y - 1.85, 0.32, 0.17, "#F7A8B0", 0);
      } else {
        const m = pose === "joie" ? "joy" : "open";
        s += stroke(`M-0.3,${r22(y - 3.2)} Q-1,${r22(y - 4.8)} -1.8,${r22(y - 5.2)} M0.3,${r22(y - 3.2)} Q1,${r22(y - 4.8)} 1.8,${r22(y - 5.2)}`, 0.4, OUT) + E(-1.8, y - 5.2, 0.32, 0.32, OUT, 0) + E(1.8, y - 5.2, 0.32, 0.32, OUT, 0) + E(0, y + 0.5, 0.8, 2.2, "#4A3A30", 0.6) + E(0, y - 2.4, 1.3, 1.15, col[2], 0.6) + E(-0.45, y - 2.95, 0.5, 0.28, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.6" fill=') + eye(-0.5, y - 2.45, 0.38, m) + eye(0.5, y - 2.45, 0.38, m) + E(-0.9, y - 1.8, 0.3, 0.16, "#F7A8B0", 0) + E(0.9, y - 1.8, 0.3, 0.16, "#F7A8B0", 0);
      }
      if (pose === "joie") s += heartIcon(4.6, y - 4.4, 0.9);
      return s;
    }
    __name(butterfly, "butterfly");
    function firefly(pose) {
      const on = pose !== "vol2";
      let s = on ? glowDot(-1.6, -3, 4.4, "255,236,150", 0.4) : glowDot(-1.6, -3, 2.6, "255,236,150", 0.25);
      s += E(-1.6, -3, 1.8, 1.4, on ? "#FFF3A0" : "#E8D880", 0.7) + E(0.6, -3.4, 1.4, 1.2, "#4A3A30", 0.7);
      s += stroke("M1.6,-4.9 Q1.3,-5.7 0.5,-5.8 M2.6,-5 Q3,-5.7 3.9,-5.75", 0.35, OUT);
      s += E(2.1, -3.9, 1.35, 1.25, "#F2B48A", 0.6) + E(1.6, -4.5, 0.5, 0.3, "#FFD8BC", 0) + eye(2.55, -4, 0.52, pose === "joie" ? "joy" : "open") + E(2.3, -3.05, 0.42, 0.22, "#F7A8B0", 0);
      s += P("M-0.4,-4 Q-1.6,-6.6 -3.4,-5.4 Q-2,-4.4 -0.4,-3.8 Z", "#E8F2FA", 0.5).replace("fill=", 'fill-opacity="0.8" fill=');
      if (pose === "joie") s += heartIcon(3.2, -6, 0.8);
      return `<g transform="translate(0 1)">${s}</g>`;
    }
    __name(firefly, "firefly");
    function bee(pose, meca = false) {
      const flap = pose === "vol2" ? 0.4 : 1;
      const y = pose === "repos" ? -2.8 : -4.2;
      let s = "";
      s += `<g transform="translate(-0.4 ${y - 1.6}) scale(1 ${flap})">${P("M0,0 Q-2.2,-3.8 0.4,-4 Q1.6,-2.4 0.6,0 Z", meca ? "#D8EEF6" : "#E8F2FA", 0.5).replace("fill=", 'fill-opacity="0.85" fill=')}</g>`;
      s += E(0, y, 3, 2.2, meca ? "#D4A84A" : "#F6C83E");
      s += clip(`bee${meca ? "m" : ""}${pose}`, `M-3,${y} a3,2.2 0 1,0 6,0 a3,2.2 0 1,0 -6,0 Z`, [-1.2, 0.6].map((x) => `<rect x="${x}" y="${y - 3}" width="0.9" height="6" fill="${meca ? "#8E6E2C" : "#3A2A24"}"/>`).join(""));
      s += E(0, y, 3, 2.2, "none");
      if (meca) {
        s += E(2.7, y - 0.8, 1.95, 1.8, "#B8C0C8", 0.8) + E(2.1, y - 1.5, 0.7, 0.45, "#E2E8EE", 0) + eye(3.2, y - 0.95, 0.72, pose === "joie" ? "joy" : "open") + E(2.8, y + 0.35, 0.55, 0.3, "#F7A8B0", 0) + E(1.5, y - 2.1, 0.28, 0.28, "#F0D58A", 0.3);
      } else {
        s += stroke(`M2.3,${r22(y - 2.3)} Q2.1,${r22(y - 3.7)} 1.2,${r22(y - 4)} M3.1,${r22(y - 2.4)} Q3.5,${r22(y - 3.6)} 4.4,${r22(y - 3.8)}`, 0.35, OUT);
        s += E(2.7, y - 0.8, 1.9, 1.8, "#FFE07A", 0.8) + E(2.1, y - 1.55, 0.65, 0.4, "#FFF2C0", 0) + eye(3.25, y - 0.95, 0.72, pose === "joie" ? "joy" : "open") + E(2.85, y + 0.35, 0.55, 0.3, "#F7A8B0", 0);
      }
      if (meca) s += limb([-1, y - 2.2], [-1.6, y - 4], 0.5, "#C9A24A") + E(-2.4, y - 4.4, 1, 0.6, "#C9A24A", 0.5) + E(-0.8, y - 4.4, 1, 0.6, "#C9A24A", 0.5) + E(0.9, y + 0.6, 0.3, 0.3, "#F0D58A", 0);
      else s += P(`M-3.2,${r22(y + 0.4)} L-4.2,${r22(y + 0.8)} L-3.2,${r22(y + 1.2)} Z`, "#3A2A24", 0);
      if (pose === "joie") s += meca ? heartIcon(2.6, y - 4, 0.8) : heartIcon(2.8, y - 4.9, 0.8);
      return `<g transform="translate(0 ${pose === "repos" ? 1.2 : 1.6})">${s}</g>`;
    }
    __name(bee, "bee");
    function beeFriend(pose) {
      const flap = pose === "vol2" ? 0.4 : pose === "repos" ? 0.55 : 1;
      const y = pose === "repos" ? -2.8 : -4.2;
      const glass = /* @__PURE__ */ __name((d) => P(d, "#F6DDE6", 0.5).replace("fill=", 'fill-opacity="0.85" fill='), "glass");
      let s = "";
      s += `<g transform="translate(-0.6 ${y - 1.6}) scale(1 ${flap})">${glass("M0,0 Q-2.6,-4 0.2,-4.4 Q1.8,-2.6 0.6,0 Z")}${glass("M-0.6,0.2 Q-3.6,-2.2 -2.6,-3.4 Q-1,-2.8 -0.2,0 Z")}</g>`;
      s += limb([-0.8, y - 2], [-1.4, y - 3.8], 0.5, "#C9A24A") + heartIcon(-1.6, y - 4.6, 0.75).replace("#F27A8A", "#E2C26A");
      s += E(0, y, 2.9, 2.4, "#D98B5F");
      s += clip(`amie${pose}`, `M-2.9,${y} a2.9,2.4 0 1,0 5.8,0 a2.9,2.4 0 1,0 -5.8,0 Z`, [-1.3, 0.4].map((x) => `<rect x="${x}" y="${y - 3}" width="0.85" height="6" fill="#A85A3A"/>`).join("") + `<ellipse cx="-0.6" cy="${y - 1.3}" rx="1.4" ry="0.6" fill="#FFFFFF" fill-opacity="0.45"/>`);
      s += E(0, y, 2.9, 2.4, "none") + E(-2, y + 0.8, 0.28, 0.28, "#F0D58A", 0) + E(1.2, y + 1.5, 0.28, 0.28, "#F0D58A", 0);
      s += P(`M-2.8,${r22(y + 0.2)} L-3.9,${r22(y + 0.6)} L-2.8,${r22(y + 1)} Z`, "#C9A24A", 0.5);
      const hx = 2.7, hy = y - 0.7;
      s += stroke(`M${hx - 0.2},${r22(hy - 1.3)} Q${hx - 0.6},${r22(hy - 3)} ${hx - 1.6},${r22(hy - 3.2)}`, 0.35, OUT) + stroke(`M${hx + 0.4},${r22(hy - 1.3)} Q${hx + 1},${r22(hy - 2.8)} ${hx + 1.8},${r22(hy - 2.8)}`, 0.35, OUT);
      s += E(hx - 1.7, hy - 3.2, 0.4, 0.4, "#E2C26A", 0.3) + [0, 72, 144, 216, 288].map((a) => E(hx + 1.8 + Math.cos(a * Math.PI / 180) * 0.55, hy - 2.8 + Math.sin(a * Math.PI / 180) * 0.55, 0.42, 0.42, "#F7C6D9", 0.25)).join("") + E(hx + 1.8, hy - 2.8, 0.25, 0.25, "#F2C94C", 0);
      s += E(hx, hy, 1.95, 1.8, "#EBB08A", 0.8) + E(hx - 0.6, hy - 0.75, 0.7, 0.42, "#F6CFB4", 0);
      s += eye(hx + 0.5, hy - 0.15, 0.72, pose === "joie" ? "joy" : "open") + (pose === "joie" ? "" : L2([hx + 1.05, hy - 0.85], [hx + 1.5, hy - 1.25], OUT, 0.3));
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
      s += [-1.6, 0, 1.6].map((x) => P(`M${x - 0.6},-5 L${x},-4.2 L${x + 0.6},-5`, "none", 0.4)).join("") + [-1, 1].map((x) => P(`M${x - 0.6},-3.4 L${x},-2.6 L${x + 0.6},-3.4`, "none", 0.4)).join("");
      s += P("M-4.4,-11 L-4.8,-14.6 L-2.4,-12 Z", "#A8784A", 0.8) + P("M4.4,-11 L4.8,-14.6 L2.4,-12 Z", "#A8784A", 0.8);
      s += E(-2, -9.6, 2, 2, "#FFF4E0", 0.7) + E(2, -9.6, 2, 2, "#FFF4E0", 0.7) + eye(-2, -9.6, 1.2, m) + eye(2, -9.6, 1.2, m);
      s += P("M-0.6,-8.4 L0.6,-8.4 L0,-6.8 Z", "#F2B33B", 0.6) + `</g>`;
      s += E(-1.4, -0.8, 0.9, 0.5, "#F2B33B", 0.5) + E(1.4, -0.8, 0.9, 0.5, "#F2B33B", 0.5);
      if (pose === "joie") s += heartIcon(4.6, -14, 0.9);
      return s;
    }
    __name(owl, "owl");
    function koi(v, pose) {
      const [base, spot] = { orange: ["#F08A3A", "#FFFFFF"], blanc: ["#FFFFFF", "#E8483C"], or: ["#F2C04B", "#FFF4C8"] }[v];
      const sw = pose === "nage2" ? -1 : 1;
      let s = `<ellipse cx="0" cy="0" rx="11" ry="3.6" fill="#7FC4E8" fill-opacity="0.25"/>`;
      s += P(`M-6,0 Q${-9},${-2.8 * sw} ${-10.4},${-3 * sw} Q${-9.6},0 ${-10.4},${3 * sw} Q${-9},${2.8 * sw} -6,0 Z`.replace(/-?\d+\.?\d*e?-?\d*/g, (n) => r22(+n)), base, 0.8);
      s += P(`M-6.4,0 Q-4,${r22(-2.6 + sw * 0.3)} 1.6,-2.2 Q6.6,-1.4 7.4,0 Q6.6,1.4 1.6,2.2 Q-4,${r22(2.6 + sw * 0.3)} -6.4,0 Z`, base);
      s += E(-1, -0.6, 1.6, 1, spot, 0) + E(3.6, 0.6, 1.2, 0.8, spot, 0) + eye(5.4, -1, 0.58, "open") + eye(5.4, 1, 0.58, "open");
      s += P("M1.6,-2.1 Q0.4,-4.6 -1.4,-4.2 Q-0.4,-3 0,-2.2 Z", base, 0.6) + P("M1.6,2.1 Q0.4,4.6 -1.4,4.2 Q-0.4,3 0,2.2 Z", base, 0.6);
      if (pose === "joie") s += E(9.4, -1.6, 0.7, 0.7, "#E8F6FF", 0.4) + E(11, -3.4, 0.45, 0.45, "#E8F6FF", 0.4) + heartIcon(10.6, 2.2, 0.8);
      return s;
    }
    __name(koi, "koi");
    function fish(v, n) {
      const [col, colS, fin] = { sardine: ["#A8C4D8", "#6E8CA8", "#8AAAC4"], dorade: ["#F2C27A", "#E8906A", "#F29A8A"], volant: ["#7EAEE0", "#4A7AB8", "#BFE0FF"] }[v];
      const y = n ? -20 : -12, rot = n ? -10 : -40;
      let s = water(0, -0.6, 10) + (n ? "" : splash(-2, -1.4, 1.4));
      s += `<g transform="translate(0 ${y}) rotate(${rot})">`;
      if (v === "volant") s += P("M0,-1 Q-2,-9 -5,-10 Q-3,-4 -2,0 Z", fin, 0.7) + P("M0,1 Q-2,8 -4.4,8.6 Q-2.6,3.6 -2,0.6 Z", fin, 0.7);
      s += P("M-6,0 L-10,-3.4 L-9.2,0 L-10,3.4 Z", colS, 0.8);
      s += E(0, 0, 6.6, v === "dorade" ? 3.8 : 2.6, col);
      s += P(`M-5.4,0.8 Q0,${v === "dorade" ? 3.6 : 2.4} 5.4,0.8`, "none", 0).replace('stroke="none"', `stroke="${colS}" stroke-width="1"`);
      s += P("M-1,-2.4 L1,-4 L2.2,-2 Z", fin, 0.6) + eye(3.8, -0.5, 1.05, "open") + E(3.4, 0.9, 0.8, 0.4, "#F7A8B0", 0);
      s += "</g>";
      return s;
    }
    __name(fish, "fish");
    function dolphin(n) {
      const pos = [[-8, -10, -35], [0, -16.2, 0], [8, -10, 35]][n];
      let s = water(0, -0.6, 22) + (n !== 1 ? splash(n ? 12 : -12, -1.4, 1.6) : "");
      s += `<g transform="translate(${pos[0]} ${pos[1]}) rotate(${pos[2]})">`;
      s += P("M-11,0 L-17,-4 L-15.6,0 L-17,4 Z", "#5A8AC0", 0.9);
      s += P("M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z", "#7EAEE0");
      s += clip(`dol${n}`, "M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z", '<ellipse cx="2" cy="4.4" rx="12" ry="3" fill="#E8F2FA"/>');
      s += P("M-1,-5.8 L-4,-10.4 L3,-5.8 Z", "#5A8AC0", 0.9) + P("M1,2.6 L-2,6.4 L4,3.4 Z", "#5A8AC0", 0.8);
      s += eye(8.8, -2, 1.3, "open") + P("M11.4,0.6 Q13,1.4 14.6,0.6", "none", 0.6) + E(8.1, 0.5, 1.1, 0.55, "#F7A8B0", 0);
      s += "</g>";
      return s;
    }
    __name(dolphin, "dolphin");
    function whaleBack(n) {
      let s = `<ellipse cx="0" cy="-1" rx="56" ry="4" fill="#5E8EC0" fill-opacity="0.25"/>`;
      s += P("M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z", "#4A6E9E") + clip(`wb${n}`, "M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z", '<ellipse cx="-6" cy="-10.8" rx="40" ry="3.4" fill="#6A8EBE"/>' + [-20, -6, 10].map((x) => `<ellipse cx="${x}" cy="-6.4" rx="2" ry="1.2" fill="#3A5A86"/>`).join(""));
      s += eye(30, -5.4, 1.6, "open") + E(28.6, -2.8, 1.7, 0.8, "#F7A8B0", 0) + P("M34,-3.6 Q38,-2.4 42,-3.6", "none", 0.7);
      s += water(-40, -0.4, 10) + water(40, -0.4, 10);
      const h = n ? 7.4 : 5;
      s += [-3, 0, 3].map((dx, i) => thick(`M${16 + dx * 0.3},-11.6 Q${16 + dx},${r22(-11.6 - h * 0.6)} ${16 + dx * 2.2},${r22(-11.6 - h + i % 2)}`, 1.4, "#E8F6FF")).join("") + E(16, -11.6 - h, 3, 1.6, "#E8F6FF", 0.7);
      return s;
    }
    __name(whaleBack, "whaleBack");
    function whaleFluke(n) {
      const y = n ? -8 : -18;
      let s = `<ellipse cx="0" cy="-1" rx="28" ry="3.4" fill="#5E8EC0" fill-opacity="0.25"/>` + water(0, -0.6, 22);
      s += P(`M-3,0 Q-2,${y + 8} 0,${y + 4} Q2,${y + 8} 3,0 Z`, "#4A6E9E", 0.9);
      s += P(`M0,${y + 5} Q-10,${y + 5} -19,${y - 6} Q-17,${y - 7} -14,${y - 5} Q-9,${y - 2} -5,${y - 1} Q-2,${y - 1} 0,${y + 1} Q2,${y - 1} 5,${y - 1} Q9,${y - 2} 14,${y - 5} Q17,${y - 7} 19,${y - 6} Q10,${y + 5} 0,${y + 5} Z`, "#4A6E9E") + P(`M-15,${y - 4} Q-9,${y} -3,${y + 1}`, "none", 0).replace('stroke="none"', 'stroke="#6A8EBE" stroke-width="1" stroke-linecap="round"');
      s += [-14, -6, 6, 14].map((x, i) => E(x, y + 2 + i % 2 * 2, 0.6, 1, "#BFE6FF", 0.4)).join("") + splash(0, -1.2, 1.6);
      return s;
    }
    __name(whaleFluke, "whaleFluke");
    function bowl(v, n) {
      let s = P("M-4.6,-10.4 L4.6,-10.4 L4.2,-9.4 Q7.4,-6.6 6.4,-3 Q5.2,0 0,0 Q-5.2,0 -6.4,-3 Q-7.4,-6.6 -4.2,-9.4 Z", "#E6F4FA", 0.9).replace("fill=", 'fill-opacity="0.75" fill=');
      s += P("M-6.2,-5.6 Q0,-4.6 6.2,-5.6 Q6.4,-3.6 5.6,-2.4 Q3.8,-0.6 0,-0.6 Q-3.8,-0.6 -5.6,-2.4 Q-6.4,-3.6 -6.2,-5.6 Z", "#9ED4F0", 0).replace("fill=", 'fill-opacity="0.7" fill=');
      if (v === "bulle") {
        const x = n ? 1 : -1;
        s += `<g transform="translate(${x} -3.2) scale(${n ? -1 : 1} 1)">${P("M-1.9,0 L-3.7,-1.4 L-3.2,0 L-3.7,1.4 Z", "#F08A3A", 0.5)}${E(0, 0, 2.3, 1.8, "#F6A04A", 0.6)}${E(-0.4, -0.7, 1, 0.45, "#FFC78A", 0)}${P("M-0.6,0.4 Q0.2,1.6 0.9,0.6 Z", "#F08A3A", 0.4)}${eye(1.05, -0.35, 0.62, "open")}${E(0.75, 0.55, 0.45, 0.22, "#F7A8B0", 0)}</g>` + E(2.6, -7 - n, 0.5, 0.5, "#FFFFFF", 0.4);
      }
      s += `<path d="M-4.4,-8.6 Q-5.6,-6 -4.8,-3.6" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.9"/>`;
      return s;
    }
    __name(bowl, "bowl");
    function jelly(n) {
      const k = n ? 1 : 0.9;
      let s = glowDot(0, -8, 7.6, "210,180,255", 0.45);
      s += [-3, -1, 1, 3].map((x, i) => stroke(`M${x},-7 Q${x + (i % 2 ? 1.4 : -1.4) * (n ? 1 : -1)},-3 ${x},${n ? 0 : -1.6}`, 0.7, "#C8A8F0")).join("");
      s += `<g transform="translate(0 -8) scale(${n ? 1 : 1.1} ${k})">${P("M-5.4,1 Q-5.4,-6 0,-6.2 Q5.4,-6 5.4,1 Q2.8,0 0,1 Q-2.8,0 -5.4,1 Z", "#E6D4FF")}${E(-1.6, -3.4, 1.4, 0.9, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.6" fill=')}${eye(-1.8, -1.6, 0.7, "open")}${eye(1.8, -1.6, 0.7, "open")}${E(0, -0.4, 0.6, 0.35, "#F7A8B0", 0)}</g>`;
      return s;
    }
    __name(jelly, "jelly");
    Object.assign(module.exports, { butterfly, firefly, bee, beeFriend, owl, koi, fish, dolphin, whaleBack, whaleFluke, bowl, jelly });
  }
});

// atelier/egares_voile.js
var require_egares_voile = __commonJS({
  "atelier/egares_voile.js"(exports, module) {
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var TRAIT = "#3B4763";
    var BRUN = "#3C2819";
    var LUNE = "#E6EEFF";
    function Dessin(pref) {
      let n = 0;
      const defs = [];
      const id = /* @__PURE__ */ __name(() => `${pref}${n++}`, "id");
      const stops = /* @__PURE__ */ __name((list) => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ""}/>`).join(""), "stops");
      return {
        lin(list, x1, y1, x2, y2) {
          const i = id();
          defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${r22(x1)}" y1="${r22(y1)}" x2="${r22(x2)}" y2="${r22(y2)}">${stops(list)}</linearGradient>`);
          return `url(#${i})`;
        },
        rad(list, cx, cy, r, fx = cx, fy = cy) {
          const i = id();
          defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${r22(cx)}" cy="${r22(cy)}" r="${r22(r)}" fx="${r22(fx)}" fy="${r22(fy)}">${stops(list)}</radialGradient>`);
          return `url(#${i})`;
        },
        // découpe : « inner » seulement à l'intérieur de d
        clip(d, inner) {
          const i = id();
          defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`);
          return `<g clip-path="url(#${i})">${inner}</g>`;
        },
        // fondu vers le bas : plein au-dessus de y0, effacé sous y1 (le bas qui s'effiloche)
        fondu(y0, y1, inner, x = -40, w = 80) {
          const g = this.lin([[0, "#FFFFFF"], [1, "#FFFFFF", 0]], 0, y0, 0, y1);
          const i = id();
          defs.push(`<mask id="${i}" maskUnits="userSpaceOnUse" x="${x}" y="-120" width="${w}" height="140"><rect x="${x}" y="-120" width="${w}" height="140" fill="${g}"/></mask>`);
          return `<g mask="url(#${i})">${inner}</g>`;
        },
        def(xml) {
          defs.push(xml);
        },
        id,
        out(body) {
          return `<defs>${defs.join("")}</defs>${body}`;
        }
      };
    }
    __name(Dessin, "Dessin");
    var path = /* @__PURE__ */ __name((d, fill, stroke = "none", w = 0, extra = "") => `<path d="${d}" fill="${fill}"${stroke !== "none" ? ` stroke="${stroke}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"` : ""}${extra}/>`, "path");
    var line = /* @__PURE__ */ __name((d, color, w, a = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` stroke-opacity="${r22(a)}"` : ""}/>`, "line");
    var ell = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}"${extra}/>`, "ell");
    var hash = /* @__PURE__ */ __name((a, b) => {
      const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }, "hash");
    function effile(a, c1, c2, b, w0, w1) {
      const pt = /* @__PURE__ */ __name((t) => {
        const u = 1 - t;
        return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
      }, "pt");
      const N2 = 12, left = [], right = [];
      for (let i = 0; i <= N2; i++) {
        const t = i / N2, p = pt(t), q = pt(Math.min(1, t + 0.01)), o = pt(Math.max(0, t - 0.01));
        const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
        left.push([p[0] - dy / l * w, p[1] + dx / l * w]);
        right.push([p[0] + dy / l * w, p[1] - dx / l * w]);
      }
      const pts = [...left, ...right.reverse()];
      return "M" + pts.map(([x, y]) => `${r22(x)},${r22(y)}`).join(" L") + " Z";
    }
    __name(effile, "effile");
    function sol(D, rx) {
      return ell(0, 0.4, rx, rx * 0.22, D.rad([[0, "#141A2C", 0.4], [0.7, "#1C2438", 0.16], [1, "#1C2438", 0]], 0, 0.4, rx));
    }
    __name(sol, "sol");
    function volutes(list, phase = 0) {
      return list.map(([x, y, s, flip], i) => {
        const k = flip ? -s : s, w = 0.45 + 0.2 * Math.sin((phase + i * 0.3) * Math.PI * 2);
        return line(`M${r22(x)},${r22(y)} q${r22(2.2 * k)},${r22(-1.8 * s)} ${r22(4 * k)},${r22(-0.4 * s)} q${r22(1.1 * k)},${r22(1.1 * s)} ${r22(-0.5 * k)},${r22(1.7 * s)} q${r22(-1 * k)},${r22(0.2 * s)} ${r22(-1 * k)},${r22(-0.7 * s)}`, "#B7C4DA", w * s, 0.45);
      }).join("");
    }
    __name(volutes, "volutes");
    function lueur(D, x, y, r = 0.8, couleur = "#E4EEFF") {
      return ell(x, y, r * 3, r * 2.4, D.rad([[0, couleur, 0.4], [1, couleur, 0]], x, y, r * 3)) + ell(x, y, r, r * 0.7, couleur);
    }
    __name(lueur, "lueur");
    var chaud = /* @__PURE__ */ __name((D, x, y, r, a = 0.34) => ell(x, y, r, r, D.rad([[0, "#FFC27A", a], [0.5, "#FFB067", a * 0.3], [1, "#FFB067", 0]], x, y, r)), "chaud");
    var brumeDe = /* @__PURE__ */ __name((D, x0, y0, x1, y1, clair = "#C8D3E6", mi = "#8D9EBF", fond = "#4F5F82") => D.lin([[0, clair], [0.45, mi], [1, fond]], x0, y0, x1, y1), "brumeDe");
    var contreJour = /* @__PURE__ */ __name((d, a = 1) => line(d, LUNE, 2.4, 0.16 * a) + line(d, LUNE, 0.75, 0.8 * a), "contreJour");
    function corps(D, d, fill, top, bottom, inner = "") {
      return D.fondu(bottom - 9, bottom + 0.5, `<g opacity="0.93">${path(d, fill, TRAIT, 0.85)}${D.clip(d, inner)}</g>`);
    }
    __name(corps, "corps");
    var POSES = {
      avant: ["marche1", "marche2", "repos", "bouderie1", "bouderie2", "fuite1", "fuite2", "luciole1", "luciole2", "luciole3", "luciole4", "brume1", "brume2", "brume3"],
      dos: ["marche1", "marche2", "repos", "fuite1", "fuite2"]
    };
    var poseOf = /* @__PURE__ */ __name((pose) => ({ kind: pose.replace(/\d$/, ""), n: +(pose.match(/\d$/) || [0])[0] }), "poseOf");
    function aura(D, cx, cy, rx, ry, a = 1) {
      return ell(cx, cy, rx, ry, D.rad([[0, "#A9BEE4", 0.2 * a], [0.6, "#8FA6D0", 0.08 * a], [1, "#8FA6D0", 0]], cx, cy, Math.max(rx, ry)));
    }
    __name(aura, "aura");
    function poussieres(D, list, a = 1) {
      return list.map(([x, y, r]) => ell(x, y, r * 2.4, r * 2.4, D.rad([[0, "#DCE7FF", 0.55 * a], [1, "#DCE7FF", 0]], x, y, r * 2.4)) + ell(x, y, r * 0.5, r * 0.5, "#F2F6FF", ` opacity="${r22(0.8 * a)}"`)).join("");
    }
    __name(poussieres, "poussieres");
    var etincelle = /* @__PURE__ */ __name((x, y, s = 1, a = 1) => path(`M${r22(x)},${r22(y - 1.8 * s)} L${r22(x + 0.35 * s)},${r22(y - 0.35 * s)} L${r22(x + 1.8 * s)},${r22(y)} L${r22(x + 0.35 * s)},${r22(y + 0.35 * s)} L${r22(x)},${r22(y + 1.8 * s)} L${r22(x - 0.35 * s)},${r22(y + 0.35 * s)} L${r22(x - 1.8 * s)},${r22(y)} L${r22(x - 0.35 * s)},${r22(y - 0.35 * s)} Z`, "#FFF4CF", "none", 0, a < 1 ? ` opacity="${r22(a)}"` : ""), "etincelle");
    var halo = /* @__PURE__ */ __name((D, x, y, r, a = 1) => ell(x, y, r, r, D.rad([[0, "#FFF1C4", 0.85 * a], [0.25, "#FFD88A", 0.55 * a], [0.6, "#FFB65C", 0.18 * a], [1, "#FFB65C", 0]], x, y, r)), "halo");
    function montee(D, n, x0, y0, w) {
      let s = "";
      for (let i = 0; i < 6; i++) {
        const x = x0 + (hash(i, 31) - 0.5) * w, y = y0 - n * 6 - hash(i, 33) * 14 - i * 1.5, k = 0.7 + hash(i, 35) * 0.6;
        s += line(`M${r22(x)},${r22(y)} q${r22(2 * k)},${r22(-2.4 * k)} ${r22(0.6 * k)},${r22(-4.6 * k)} q${r22(-1.2 * k)},${r22(-1.6 * k)} ${r22(0.4 * k)},${r22(-3 * k)}`, "#C3CFE3", 0.8 * k, r22((0.6 - n * 0.12) * (1 - i * 0.08)));
      }
      return s;
    }
    __name(montee, "montee");
    function finir(D, P, c, o) {
      const { kind, n } = P;
      const [ax, ay, arx, ary] = o.aura;
      let s = sol(D, o.sol || 12);
      if (kind === "luciole" && n >= 3) {
        s += aura(D, ax, ay, arx, ary, 0.5) + o.lumiere(n) + poussieres(D, [[ax - 8, ay - 10, 0.9], [ax + 9, ay - 16, 0.7], [ax - 3, ay - 24, 0.6]], n === 3 ? 0.9 : 0.5);
        return D.out(s);
      }
      const pale = kind === "luciole" && n === 2 ? 0.36 : kind === "brume" ? [1, 0.68, 0.34, 0][n] : 1;
      const svA = kind === "brume" ? pale : 1;
      s += aura(D, ax, ay, arx, ary, kind === "brume" ? 1 - n * 0.25 : 1);
      let g = "";
      if (pale > 0) g += pale < 1 ? `<g opacity="${r22(pale)}">${c.b}</g>` : c.b;
      if (svA > 0) {
        if (kind === "luciole") g += halo(D, o.glow[0], o.glow[1], (o.halo || [16, 20])[n === 1 ? 0 : 1], n === 1 ? 0.75 : 1);
        g += svA < 1 ? `<g opacity="${r22(svA)}">${c.sv}</g>` : c.sv;
      }
      if (pale > 0 && c.f) g += pale < 1 ? `<g opacity="${r22(pale)}">${c.f}</g>` : c.f;
      if (kind === "luciole") g += etincelle(o.glow[0] - 5, o.glow[1] - 4, 0.7, 0.9) + etincelle(o.glow[0] + 5, o.glow[1] + 2, 0.55, 0.8) + (n === 2 ? etincelle(o.glow[0] + 1, o.glow[1] - 8, 0.6, 0.85) : "");
      s += `<g transform="${o.t}">${g}</g>`;
      if (kind === "brume") s += (o.montee === false ? "" : montee(D, n, ax, ay + ary * 0.4, arx * 1.4)) + o.voile(n);
      s += poussieres(D, o.motes || [[ax - arx * 0.8, ay - ary * 0.3, 0.7], [ax + arx * 0.75, ay - ary * 0.55, 0.55], [ax - arx * 0.3, ay - ary * 0.95, 0.5]], kind === "brume" ? 1 - n * 0.3 : 0.85);
      return D.out(s);
    }
    __name(finir, "finir");
    var tf = /* @__PURE__ */ __name((bob = 0, lean = 0, flip = false) => `translate(0 ${r22(bob)}) rotate(${r22(lean)} 0 0)${flip ? " scale(-1 1)" : ""}`, "tf");
    var SN_CORPS = "M-2,-56 C4,-57 9.5,-52 11.5,-46.5 C12.3,-44 11.6,-42 10.2,-40.6 C12.6,-38 13.6,-33.5 13.2,-28 C12.8,-21 12.6,-15 13.4,-9 C11.8,-6.6 10,-4.6 8.2,-5.8 C7,-3 4.8,-1.8 3.2,-3.8 C1.8,-1.4 -0.6,-0.6 -2.2,-3 C-4,-1 -7,-1.2 -8,-4 C-10.5,-2 -14.5,-2.6 -16.5,-4.4 C-13.5,-5.4 -12.5,-7.5 -12.4,-10 C-12.6,-18 -12.2,-28 -11,-36 C-10,-45 -7.5,-53 -2,-56 Z";
    var snMain = /* @__PURE__ */ __name((lift) => ({ hx: r22(13.5 + 4.5 * lift), hy: r22(-33 - 11 * lift) }), "snMain");
    function snEtiquette(D, tx, ty, rot, lumiere = 0) {
      const carton = lumiere ? D.lin([[0, "#FFF8E2"], [0.5, "#FFE3A0"], [1, "#FFC069"]], -3, -4.8, 3, 4.6) : D.lin([[0, "#F8ECCE"], [0.6, "#EAD5A6"], [1, "#CDB07A"]], -3, -4.8, 3, 4.6);
      return `<g transform="translate(${r22(tx)} ${r22(ty)}) rotate(${r22(rot)})">` + path("M-3,-3.4 L-1.6,-4.8 L1.6,-4.8 L3,-3.4 L3,4.6 L-3,4.6 Z", carton, BRUN, 0.65) + line("M-2.6,-3.3 L-1.5,-4.4 L1.5,-4.4 L2.6,-3.3", "#FFFFFF", 0.4, 0.6) + (lumiere ? "" : path("M-2.2,-1.4 C-1.4,0.4 -2,2.2 -1,4 L-0.2,4 C-1,2.2 -0.4,0.6 -1,-1.4 Z", "#33476E", "none", 0, ' opacity="0.45"') + line("M0.5,-1.6 C1.4,0.2 0.7,1.8 1.6,3.8", "#2B3A5A", 0.45, 0.45) + line("M-1.6,-2.1 C-0.4,-2.4 0.8,-1.9 1.8,-2.2", "#2B3A5A", 0.42, 0.4)) + ell(0, -3.2, 0.95, 0.95, "#C9A050", ` stroke="${BRUN}" stroke-width="0.4"`) + ell(-0.25, -3.45, 0.3, 0.3, "#FFF0B8") + ell(0, -3.2, 0.36, 0.36, "#4A3218") + "</g>";
    }
    __name(snEtiquette, "snEtiquette");
    function sansNom(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, -4, 1, 0],
        marche1: [-0.8, 3, 0.35, 0.2],
        marche2: [0.3, 4, 0.3, 0.7],
        bouderie1: [0, -9, 0, 0.3],
        bouderie2: [0.2, -5, 0, 0.5],
        fuite1: [-1, 12, 0, 0.1],
        fuite2: [0.4, 15, 0, 0.6],
        luciole1: [-0.5, -1, 0.6, 0.3],
        luciole2: [-1, -1, 0.6, 0.4],
        brume1: [0, -2, 0.4, 0.3],
        brume2: [-1, -2, 0.4, 0.5],
        brume3: [-2, -2, 0.4, 0.7]
      }[pose] || [0, -4, 1, 0];
      const [bob, lean, lift, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += corps(
        D,
        SN_CORPS,
        brumeDe(D, -10, -54, 12, -12),
        -56,
        0,
        ell(dos ? -2 : 10, -20, 10, 24, D.rad([[0, "#121829", 0.55], [1, "#121829", 0]], dos ? -2 : 10, -20, 13)) + ell(-4, -50, 7, 5, D.rad([[0, "#E2EAF7", 0.35], [1, "#E2EAF7", 0]], -4, -50, 7)) + [[-6.5, -44, -8, -6, 0.5], [-2.5, -40, -3.5, -3, 0.45], [2, -38, 1.5, -4, 0.4], [6.5, -35, 7.5, -6, 0.35], [10, -33, 11, -9, 0.3]].map(([x0, y0, x1, y1, a], i) => line(`M${x0},${y0} C${r22(x0 - 1.2)},${r22(y0 + 12)} ${r22(x1 + 1.2)},${r22(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r22(x0 + 0.7)},${y0} C${r22(x0 - 0.5)},${r22(y0 + 12)} ${r22(x1 + 1.9)},${r22(y1 - 12)} ${r22(x1 + 0.7)},${y1}`, LUNE, 0.45, a * (i < 2 ? 0.7 : 0.35))).join("") + (dos ? line("M3,-55 C5,-48 6,-40 5.5,-30", TRAIT, 0.6, 0.55) + line("M3.7,-55 C5.7,-48 6.7,-40 6.2,-30", LUNE, 0.45, 0.35) : line("M-1,-53 C3,-49.5 4.6,-45 4,-40.6", TRAIT, 0.5, 0.45))
      );
      c.b += contreJour("M-2,-56 C-7.5,-53 -10,-45 -11,-36 C-12.2,-28 -12.6,-18 -12.4,-10");
      if (dos) {
        c.sv += line("M12.8,-30 C14.6,-27 14.2,-23 15,-20", "#C23A2C", 0.5) + chaud(D, 13, -26, 7, 0.22);
      } else {
        const creux = "M10.4,-40.8 C6.4,-41 3.6,-43.2 3.6,-47 C3.8,-50.2 6.8,-51.8 9.6,-50.2 C11.2,-47 11.4,-43.4 10.4,-40.8 Z";
        c.b += path(creux, D.rad([[0, "#070A14"], [0.65, "#141A2C"], [1, "#2A3450"]], 7.4, -45.4, 5.2), TRAIT, 0.6);
        c.b += P.kind === "bouderie" && P.n === 2 ? "" : lueur(D, 6.3, -46.4, 0.62) + lueur(D, 8.8, -45.8, 0.58);
        const { hx: hx2, hy: hy2 } = snMain(lift);
        c.b += path(`M9.6,-37.2 C12.4,-38.6 ${r22(hx2 - 3.6)},${r22(hy2 + 3.4)} ${r22(hx2 - 1)},${r22(hy2 - 0.4)} L${r22(hx2 + 1)},${r22(hy2 + 1.6)} C${r22(hx2 - 0.4)},${r22(hy2 + 5)} ${r22(hx2 - 2)},${r22(hy2 + 7.6)} ${r22(hx2 - 3)},${r22(hy2 + 11)} C${r22(hx2 - 4.6)},${r22(hy2 + 8.6)} 13,-31 11.2,-30 Z`, brumeDe(D, 9, -46, 17, -26), TRAIT, 0.8) + line(`M10.4,-36.6 C12.6,-37.4 ${r22(hx2 - 3.4)},${r22(hy2 + 3.6)} ${r22(hx2 - 1.4)},${r22(hy2 + 1)}`, LUNE, 0.55, 0.45);
        const tx = hx2 + 2.6, ty = hy2 - 6;
        c.sv += chaud(D, tx, ty + 2, 16, 0.38) + line("M10.6,-47 C11.5,-44.4 11,-42 10.2,-40.6", "#FFC27A", 0.7, 0.55 * lift);
        c.sv += snEtiquette(D, tx, ty, -16 + 22 * (1 - lift));
        c.sv += line(`M${r22(tx)},${r22(ty - 3.2)} C${r22(tx - 3)},${r22(ty - 0.6)} ${r22(hx2 - 1.4)},${r22(hy2 - 2.6)} ${r22(hx2)},${r22(hy2 - 0.4)}`, "#C23A2C", 0.5);
        for (const [dx, dy, len] of [[-0.6, 0, 5.6], [0.3, 0.6, 5.2], [1, 1, 4]]) c.f += path(effile([hx2 + dx, hy2 + dy], [hx2 + dx + 1.2, hy2 + dy - 1.6], [hx2 + dx + 2, hy2 + dy - len * 0.6], [hx2 + dx + 1.8 + dx, hy2 + dy - len], 1.1, 0.35), "#CBD6E8", TRAIT, 0.45);
        if (P.kind === "bouderie") c.f += path(`M2,-40 C8,-38 ${r22(hx2 + 1)},${r22(hy2 + 2)} ${r22(hx2 + 2)},${r22(hy2 + 7)} C${r22(hx2)},${r22(hy2 + 12)} 8,-22 3,-20 Z`, brumeDe(D, 2, -40, 18, -20, "#C8D3E6", "#93A3C2", "#5E6F92"), TRAIT, 0.75) + line(`M3,-39.2 C8,-37 ${r22(hx2)},${r22(hy2 + 2.4)} ${r22(hx2 + 1.4)},${r22(hy2 + 6.4)}`, LUNE, 0.45, 0.45);
      }
      c.b += volutes([[-15, -3.4, 1.1], [3, -1.5, 0.9, true], [-5, 0.5, 0.8], [9, -3.5, 0.7, true]], phase);
      const { hx, hy } = snMain(lift);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -30, 18, 30],
        sol: 12,
        glow: [hx + 2.6, hy - 5],
        lumiere: /* @__PURE__ */ __name((k) => {
          const { hx: x0, hy: y0 } = snMain(0.6);
          const x = x0 + 2.6, y = y0 - 6 - (k === 4 ? 18 : 0);
          return halo(D, x, y, k === 4 ? 14 : 18) + `<g opacity="${k === 4 ? 0.85 : 1}">${snEtiquette(D, x, y, k === 4 ? 8 : -10, 1)}</g>` + (k === 4 ? [[0, 6, 0.8], [-1.2, 11, 0.6], [0.8, 15, 0.45]].map(([dx, dy, a]) => etincelle(x + dx, y + dy, 0.6, a)).join("") : etincelle(x - 6, y - 5, 0.8) + etincelle(x + 6, y + 3, 0.6));
        }, "lumiere"),
        // les lettres de brume illisibles qui se dispersent
        voile: /* @__PURE__ */ __name((n) => [[-6, -44], [3, -50], [-2, -36], [6, -40], [-9, -30], [1, -26], [8, -32], [-4, -52]].map(([x, y], i) => {
          const dx = x * (0.4 + n * 0.35), dy = y - n * 5 - hash(i, 41) * 4, k = 0.8 + hash(i, 43) * 0.5;
          const glyphe = [`M0,0 q1,-1.6 2,0 t2,0`, `M0,0 l0.8,-2 l0.8,2 m-1.3,-0.8 l1,0`, `M0,-1 c1,-1 2,1 1,1.6 c-0.8,0.4 -1.6,-0.6 -0.6,-1.2`, `M0,0 l1.6,-1.8 m-1.8,0 l2,2`][i % 4];
          return `<g transform="translate(${r22(dx)} ${r22(dy)}) scale(${r22(k)})">` + line(glyphe, "#DCE5F4", 0.5, r22(0.75 - n * 0.18)) + "</g>";
        }).join(""), "voile")
      });
    }
    __name(sansNom, "sansNom");
    var DO_CORPS = "M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4 C-11.6,-2 -9.8,-4.2 -8.2,-1.6 C-6.2,-3.4 -4.2,-0.6 -2.2,-2.6 C-0.2,-0.4 2.4,-2.8 4.4,-0.8 C6.4,-3 8.4,-1.2 10.4,-3.4 C11,-11 11.6,-19 10,-27 C9,-32 7,-35.5 5,-37.5 Z";
    var RUNES = ["M0,-0.7 l0,1.4 m-0.6,-0.7 l1.2,0", "M-0.5,-0.7 l1,0.7 l-1,0.7", "M-0.6,0.6 l0.6,-1.3 l0.6,1.3", "M0,-0.7 a0.6,0.6 0 1,0 0.1,0"];
    function doTablette(D, x, y, rot, signe = 0, lumiere = false) {
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)})">` + path("M-4.6,-5.6 Q-4.8,-6.4 -3.8,-6.4 L3.8,-6.4 Q4.8,-6.4 4.6,-5.6 L4.4,5.4 Q4.4,6.2 3.6,6.2 L-3.6,6.2 Q-4.4,6.2 -4.4,5.4 Z", lumiere ? D.lin([[0, "#FFF2C8"], [0.5, "#FFD27E"], [1, "#F2A04A"]], -4, -6, 4, 6) : D.lin([[0, "#E6A862"], [0.55, "#C47E3C"], [1, "#8E521F"]], -4, -6, 4, 6), BRUN, 0.7) + path("M-3.4,-5 L3.4,-5 L3.3,4.6 L-3.3,4.6 Z", "none", "#7A4418", 0.42, ' stroke-opacity="0.5"') + line("M-3.8,-5.9 L3.6,-5.9", "#FAD49A", 0.5, 0.75) + (lumiere ? "" : ell(-2.6, 3.4, 0.5, 0.3, "#9A5A26", ' opacity="0.5"') + ell(1.8, -2, 0.4, 0.25, "#9A5A26", ' opacity="0.4"')) + (signe ? ell(0, 0, 4, 4, D.rad([[0, "#FFF0B0", 0.7 * signe], [1, "#FFD27A", 0]], 0, 0, 4)) + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#FFF6D0", 0.7, r22(Math.min(1, signe * 1.2))) + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#9A4E14", 0.3, r22(signe * 0.6)) : "") + "</g>";
    }
    __name(doTablette, "doTablette");
    function dormeur(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const dort = P.kind === "dort";
      const prm = {
        repos: [0, 0, 1, 0],
        marche1: [-0.6, 3, 1, 0.2],
        marche2: [0.2, 5, 0.85, 0.7],
        bouderie1: [0, -6, 0.3, 0.3],
        bouderie2: [0.3, -3, 0.2, 0.5],
        fuite1: [-0.8, 11, 0.6, 0.1],
        fuite2: [0.3, 13, 0.5, 0.6],
        luciole1: [0, 0, 0.4, 0.3],
        luciole2: [-0.6, 0, 0.4, 0.4],
        brume1: [0, 0, 0.6, 0.3],
        brume2: [0.4, 0, 0.6, 0.5],
        brume3: [0.8, 0, 0.6, 0.7],
        dort1: [0, 9, 0, 0.2],
        dort2: [0.5, 9.5, 0, 0.5]
      }[pose] || [0, 0, 1, 0];
      const [bob, lean, reach, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += corps(
        D,
        DO_CORPS,
        brumeDe(D, -12, -46, 10, -10, "#C1CBDD", "#8796B5", "#4D5C7D"),
        -46,
        0,
        ell(dos ? -3 : 8, -16, 10, 22, D.rad([[0, "#10172A", 0.55], [1, "#10172A", 0]], dos ? -3 : 8, -16, 13)) + ell(-8, -40, 7, 6, D.rad([[0, "#E0E8F5", 0.3], [1, "#E0E8F5", 0]], -8, -40, 7)) + line("M-13.3,-9 C-6,-7 3,-7.2 10.6,-9.2", "#D9E2F0", 0.45, 0.35) + line("M-13.4,-6.4 C-6,-4.4 3,-4.7 10.5,-6.6", "#D9E2F0", 0.45, 0.28) + [[-11, -7.8], [-7.4, -6.9], [-3, -6.5], [1.2, -6.6], [5.6, -7.2], [8.6, -7.8]].map(([x, yy], i) => line(RUNES[i % 4].replace("M", `M${r22(x)},${r22(yy)} m`), "#D9E2F0", 0.4, [0.4, 0.3, 0.1, 0.35, 0.05, 0.3][i])).join("") + [[-9, -38, -10.5, -6, 0.45], [-4.5, -40, -5.5, -3, 0.4], [1, -38, 0.6, -3, 0.35], [6, -32, 6.8, -5, 0.3]].map(([x0, y0, x1, y1, a]) => line(`M${x0},${y0} C${r22(x0 - 1.5)},${r22(y0 + 12)} ${r22(x1 + 1)},${r22(y1 - 12)} ${x1},${y1}`, TRAIT, 0.55, a) + line(`M${r22(x0 + 0.7)},${y0} C${r22(x0 - 0.8)},${r22(y0 + 12)} ${r22(x1 + 1.7)},${r22(y1 - 12)} ${r22(x1 + 0.7)},${y1}`, LUNE, 0.4, a * 0.6)).join("") + (dos ? line("M2,-45 C1,-36 0.6,-24 1,-8", TRAIT, 0.6, 0.5) + line("M2.6,-45 C1.6,-36 1.2,-24 1.6,-8", LUNE, 0.45, 0.35) : "")
      );
      c.b += contreJour("M-1,-46 C-8,-46 -13.5,-40 -14.2,-30 C-14.8,-21 -13.4,-12 -13.6,-4");
      if (!dort) {
        const bx = r22(11 + 5.5 * reach), by = r22(-31 - 4.6 * reach);
        c.b += path(`M5,-36.5 C8.5,-38.6 ${r22(bx - 3)},${r22(by - 2.6)} ${bx},${r22(by - 1.6)} L${r22(bx + 0.3)},${r22(by + 1.6)} C${r22(bx - 3)},${r22(by + 2.4)} 9,-32 7.4,-30 Z`, brumeDe(D, 5, -40, 16, -30, "#C1CBDD", "#8F9DBB", "#5B6A8B"), TRAIT, 0.8);
        c.b += line(`M5.6,-36.6 C8.6,-38 ${r22(bx - 3)},${r22(by - 2.2)} ${r22(bx - 0.4)},${r22(by - 1.3)}`, LUNE, 0.5, 0.45);
        for (const [dx, len, k] of [[0, 5.4, 0], [0.7, 6.2, 1], [1.4, 5, 2]]) c.b += path(effile([bx + dx * 0.5, by - 0.6 + dx * 0.5], [bx + 1.4 + dx * 0.4, by + 0.8], [bx + 1.8 + dx * 0.3, by + len * 0.5], [bx + 1 + dx * 0.6 - k * 0.2, by + len], 1.15, 0.3), "#B4C0D6", TRAIT, 0.45);
      }
      const hood = "M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4 C12.4,-49.6 13.8,-45 12.6,-40.6 C11.8,-37.6 9.6,-36 7.6,-35.8 C6.8,-39.4 4,-41.6 0.4,-41.8 C-1.2,-41.8 -2.6,-42.6 -3.4,-44 Z";
      let tete = path(hood, brumeDe(D, -3, -53, 12, -36, "#C4CEE0", "#8E9CBA", "#55648A"), TRAIT, 0.85) + contreJour("M-3.4,-44 C-3,-50.6 3.4,-53.6 8.6,-51.4", 0.9);
      if (!dos) {
        const visage = "M7.2,-36.4 C6.4,-39.6 6.8,-43.6 9,-45.6 C11.2,-45.4 12.6,-42.6 12.2,-39.8 C11.8,-37.6 9.8,-36.2 7.2,-36.4 Z";
        tete += path(visage, D.rad([[0, "#A9B4C9"], [0.7, "#7C88A2"], [1, "#56627E"]], 10.8, -41.4, 5.6), TRAIT, 0.6) + D.clip(visage, ell(9.8, -44.4, 4.6, 2.2, D.rad([[0, "#0F1526", 0.55], [1, "#0F1526", 0]], 9.8, -44.4, 4.6))) + line("M9.2,-42.2 C9.9,-41.8 10.8,-41.8 11.6,-42.4", TRAIT, 0.65) + line("M9.5,-41.75 l-0.15,0.55 m0.85,-0.4 l-0.05,0.55 m0.85,-0.55 l0.05,0.5", TRAIT, 0.3, 0.7) + line("M7.6,-38 C8.6,-37.6 9.8,-37.6 10.8,-38.2", "#5A6683", 0.35, 0.5) + line("M10.6,-45.2 l-0.6,1.4 l0.8,0.8 l-0.4,1", "#EEF3FF", 0.35, 0.8);
      } else tete += line("M2,-52 C4,-49 4.6,-44 4,-40", TRAIT, 0.55, 0.5);
      tete += line("M2,-50.6 l1.2,1.6 l-0.5,1.3 l1,1.1", "#EEF3FF", 0.4, 0.75) + line("M-1,-37 l1,1.4 l-0.6,1.2", "#EEF3FF", 0.35, 0.6);
      c.b += dort ? `<g transform="rotate(16 4 -40) translate(1 2)">${tete}</g>` : tete;
      if (!dos) {
        const signe = dort ? P.n === 1 ? 0.8 : 0.15 : P.kind === "luciole" ? 1 : 0;
        const [tx, ty, tr] = dort ? [6.4, -33.4, -24] : [3.4, -27.4, -14];
        c.sv += chaud(D, tx, ty, 14, 0.34) + line("M10.6,-38.4 C11.6,-37.4 12.2,-36.4 12.4,-35", "#FFC27A", 0.55, 0.5);
        c.sv += doTablette(D, tx, ty, tr, signe);
        if (!dort) c.sv += line("M-1.6,-35.4 L8.4,-20.6", BRUN, 1.4) + line("M-1.6,-35.4 L8.4,-20.6", "#D9B26A", 0.75) + line("M-1.2,-35 L1.1,-31.6", "#F6DFA4", 0.35);
        const bras = dort ? [["M-3.6,-31.6 C0,-27.6 4,-26 9.8,-26.4 L10,-23.6 C4,-23 -1,-25.4 -5,-28.4 Z", 9.8, -26.2]] : [["M-3.6,-30.6 C-0.6,-25.8 3.8,-23.2 8.2,-23.8 L8.6,-21 C3.8,-20.2 -1.4,-22.8 -5,-27.4 Z", 8.2, -23.4]];
        for (const [d, fx, fy] of bras) {
          c.f += path(d, brumeDe(D, -4, -38, 12, -20, "#C1CBDD", "#8F9DBB", "#5B6A8B"), TRAIT, 0.8);
          for (const [dx, dy] of [[0, 0], [0.4, 1.3]]) c.f += path(effile([fx + dx, fy + dy], [fx + 1.4 + dx, fy - 1 + dy], [fx + 2 + dx, fy - 2.2 + dy], [fx + 1.6 + dx, fy - 4 + dy], 1.1, 0.35), "#B4C0D6", TRAIT, 0.45);
        }
      }
      c.b += volutes([[-12.5, -2.4, 1.1], [2, -0.6, 0.9, true], [7.5, -1.8, 0.8]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [-1, -26, 18, 26],
        sol: 13,
        glow: [3.4, -27.4],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -30 - (k === 4 ? 18 : 0);
          return halo(D, 1, y, k === 4 ? 13 : 17) + `<g transform="translate(1 ${y}) scale(${k === 4 ? 1.2 : 1.6})">` + line("M-1.6,-2.4 C0,-3 1.4,-1.6 0.2,-0.4 C-1,0.8 0.4,2.2 1.8,1.6 M-0.4,-0.6 l2,0.6", "#FFF6D0", 0.9) + "</g>" + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(1 + dx, y + dy, 0.6, a)).join("") : etincelle(-5, y - 5, 0.8) + etincelle(6, y + 3, 0.6) + `<g opacity="0.35">${doTablette(D, 1, -22, -8)}</g>`);
        }, "lumiere"),
        // l'argile qui s'effrite en écailles de brume
        voile: /* @__PURE__ */ __name((n) => [[-8, -30], [-3, -42], [5, -34], [9, -24], [-11, -18], [2, -14]].map(([x, y], i) => {
          const dy = y - n * 6 - hash(i, 51) * 3, dx = x * (1 + n * 0.25);
          return path(`M${r22(dx)},${r22(dy)} l1.2,-0.6 l0.6,1 l-1.2,0.7 Z`, "#9FAEC8", TRAIT, 0.3, ` opacity="${r22(0.8 - n * 0.22)}"`);
        }).join(""), "voile")
      });
    }
    __name(dormeur, "dormeur");
    var NO_CORPS = "M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12 C-8.6,-11 -6.6,-12.2 -5,-11 L4.6,-11 C6.4,-12.2 8.4,-11 9.8,-12.2 C10.4,-18 10.8,-26 9.8,-32 C9,-38 6.8,-41.8 3.4,-43 Z";
    function noBouee(D, cx, cy, rx, ry, lumiere = false) {
      const arc = /* @__PURE__ */ __name((a0, a1, rr = 1, sweep = 1) => `M${r22(cx + Math.cos(a0) * rx * rr)},${r22(cy + Math.sin(a0) * ry * rr)} A${r22(rx * rr)},${r22(ry * rr)} 0 0 ${sweep} ${r22(cx + Math.cos(a1) * rx * rr)},${r22(cy + Math.sin(a1) * ry * rr)}`, "arc");
      let s = "";
      if (lumiere) {
        s += ell(cx, cy, rx, ry, "none", ` stroke="#FFD888" stroke-width="5" stroke-opacity="0.35"`) + ell(cx, cy, rx, ry, "none", ` stroke="#FFF2C6" stroke-width="2.2"`);
        return s;
      }
      for (let i = 0; i < 6; i++) {
        const a0 = i / 6 * Math.PI, a1 = (i + 1) / 6 * Math.PI;
        s += line(arc(a0, a1), BRUN, 3.4) + line(arc(a0, a1), i % 2 ? "#F2EDE2" : "#CF3A2E", 2.5);
      }
      s += line(arc(0.15, Math.PI - 0.15, 1.08), "#FFFFFF", 0.5, 0.6) + line(arc(0.08, Math.PI - 0.08, 0.9), "#5A1A12", 0.4, 0.35);
      const id = D.id();
      D.def(`<path id="${id}" d="${arc(Math.PI * 0.83, Math.PI * 0.2, 1, 0)}"/>`);
      s += `<text font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="1.45" letter-spacing="0.15" fill="#22304E" opacity="0.85"><textPath href="#${id}">L’HIRONDE</textPath></text>`;
      return s;
    }
    __name(noBouee, "noBouee");
    function noye(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, -3, 1, 0, 0],
        marche1: [-0.6, 3, 0, 0.2, 1],
        marche2: [0.2, 4, 0, 0.7, 2],
        bouderie1: [0, -7, 0, 0.3, 0],
        bouderie2: [0.3, -4, 0, 0.5, 0],
        fuite1: [-0.8, 11, 0, 0.1, 1],
        fuite2: [0.3, 13, 0, 0.6, 2],
        luciole1: [0, -1, 0, 0.3, 0],
        luciole2: [-0.6, -1, 0, 0.4, 0],
        brume1: [0.8, 0, 0, 0.3, 0],
        brume2: [2, 0, 0, 0.5, 0],
        brume3: [3, 0, 0, 0.7, 0]
      }[pose] || [0, -3, 0, 0, 0];
      const [bob, lean, look, phase, step] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += [[-14, 0.6], [-11.5, 1.1], [-9, 0.4], [-16.6, 1], [-12.8, -0.2], [-18.4, 0.5]].map(([x, yy], i) => ell(x, yy, 0.5 + 0.25 * (i % 2), 0.28, "#EEF2F8", ` opacity="${r22(0.6 - i * 0.07)}"`)).join("");
      const jambe = /* @__PURE__ */ __name((x, k) => {
        const lift = step && step === 1 === (k === 0) ? 1.6 : 0, fw = step ? k === 0 ? step === 1 ? 1.2 : -1 : step === 1 ? -1 : 1.2 : 0;
        return path(`M${r22(x - 2.2)},-12 L${r22(x + 2.2)},-12 L${r22(x + 2.4 + fw)},${r22(-3 - lift)} C${r22(x + 3.6 + fw)},${r22(-2.4 - lift)} ${r22(x + 3.8 + fw)},${r22(-0.6 - lift)} ${r22(x + 2.4 + fw)},${r22(-0.4 - lift)} L${r22(x - 2.2 + fw)},${r22(-0.4 - lift)} Z`, D.lin([[0, "#7F90B0"], [1, "#4C5B7C"]], 0, -12, 0, 0), TRAIT, 0.75);
      }, "jambe");
      c.b += D.fondu(-6, 0.5, jambe(-4.6, 0) + jambe(3.2, 1));
      c.b += corps(
        D,
        NO_CORPS,
        brumeDe(D, -10, -43, 10, -10, "#C6D2E5", "#8598BA", "#47587C"),
        -43,
        -9,
        ell(dos ? -2 : 7, -24, 9, 16, D.rad([[0, "#0F1628", 0.55], [1, "#0F1628", 0]], dos ? -2 : 7, -24, 11)) + line("M-7.6,-38 C-8.8,-31 -8.8,-22 -8,-13", LUNE, 1.1, 0.5) + line("M-6.9,-36 C-7.9,-30 -7.9,-24 -7.3,-18", "#FFFFFF", 0.45, 0.65) + line("M-2.6,-40 C-3,-32 -3,-22 -2.8,-12", LUNE, 0.55, 0.3) + (dos ? line("M0.4,-42 C0.6,-32 0.6,-22 0.4,-12", TRAIT, 0.6, 0.45) : line("M3,-40 C3.5,-32 3.6,-22 3.3,-12", TRAIT, 0.6, 0.45) + line("M3.7,-39 C4.2,-32 4.3,-24 4,-15", LUNE, 0.42, 0.3) + [-35, -29.5, -24].map((v) => ell(2.4, v, 0.45, 0.45, "#56668A")).join("")) + line("M7,-37 C8,-30 8.4,-22 8.6,-13", TRAIT, 0.5, 0.35)
      );
      c.b += contreJour("M-4.4,-43 C-8.8,-41.6 -10.8,-35 -10.6,-27 C-10.4,-21 -10.6,-16 -10.2,-12");
      c.b += path("M-5.4,-43.6 C-6.2,-46.4 -3.6,-47.8 -0.8,-46.8 L0.8,-43.4 Z", brumeDe(D, -6, -48, 1, -43), TRAIT, 0.7) + path("M6.2,-43.4 C7,-46.2 4.6,-47.6 2,-46.6 L1.4,-43.2 Z", brumeDe(D, 1, -48, 7, -43, "#AEBCD4", "#7D8FB2", "#4C5C80"), TRAIT, 0.7);
      c.b += path("M5.8,-39.6 C9.2,-37 10.8,-31.4 10.6,-25.6 L7.6,-25 C7.8,-30 6.8,-33.6 4.8,-35.6 Z", brumeDe(D, 5, -40, 11, -24, "#C6D2E5", "#8598BA", "#55678C"), TRAIT, 0.8);
      for (const [dx, len] of [[0, 4.4], [0.9, 5], [1.8, 3.8]]) c.b += path(effile([8 + dx * 0.9, -25.2], [8.4 + dx, -23.6], [8.6 + dx * 0.9, -22.6 + len * 0.3], [8.2 + dx * 0.9, -25.2 + len], 1.05, 0.28), "#B6C4DA", TRAIT, 0.42);
      for (const [x, yy, k] of [[9.2, -18.6, 1], [10, -14.6, 0.8], [9, -10.8, 0.65], [9.8, -7, 0.5], [9.2, -3.6, 0.45]]) c.b += path(`M${x},${r22(yy - 1.5 * k)} Q${r22(x + 0.9 * k)},${r22(yy - 0.2 * k)} ${x},${r22(yy + 0.5 * k)} Q${r22(x - 0.9 * k)},${r22(yy - 0.2 * k)} ${x},${r22(yy - 1.5 * k)} Z`, "#D2E4F5", TRAIT, 0.3, ' opacity="0.75"');
      c.sv += chaud(D, 0.6, -20.6, 12, 0.3) + (dos ? noBouee(D, -0.2, -20.6, 9.4, 3.2).replace(/<text[\s\S]*<\/text>/, "") : noBouee(D, -0.2, -20.6, 9.4, 3.2));
      const tx = r22(1 - 2.4 * look);
      let t = "";
      if (!dos) {
        t += path("M-3.2,-47.6 C-3.6,-43.6 -2.4,-40.4 0.8,-39.4 C3.8,-40.2 5,-43.6 4.6,-47.6 Z", D.lin([[0, "#1B2236"], [0.45, "#6E7C9A"], [1, "#A3B0C8"]], 0, -48, 0, -39.4), TRAIT, 0.65);
        if (look < 0.5) t += ell(-0.9, -44.2, 1.5, 1.1, D.rad([[0, "#05080F", 0.85], [1, "#05080F", 0]], -0.9, -44.2, 1.5)) + ell(2.5, -44, 1.4, 1.05, D.rad([[0, "#05080F", 0.85], [1, "#05080F", 0]], 2.5, -44, 1.4)) + lueur(D, -0.8, -44.1, 0.22, "#C8DBF5") + lueur(D, 2.5, -43.9, 0.2, "#C8DBF5");
        else t += ell(-2.4, -44.2, 1.2, 0.9, D.rad([[0, "#05080F", 0.8], [1, "#05080F", 0]], -2.4, -44.2, 1.2)) + lueur(D, -2.5, -44.1, 0.28, "#DCEBFF");
      }
      for (const [x, len, sw, cc] of [[-3.8, 8, -0.8, "#2E4450"], [-2.2, 6, 0.6, "#3C5660"], [4.4, 7, 0.9, "#2E4450"], [5.4, 9, 0.4, "#4B6B5E"]]) t += path(effile([x, -47.6], [x + sw, -45], [x - sw, -43], [x + sw * 0.6, -47.6 + len], 1.1, 0.25), cc, "none", 0, ' opacity="0.9"');
      t += path("M-8.4,-46.6 C-5,-50 6.4,-50.4 10.4,-46 C9,-44.6 6.8,-45.4 5.2,-46.8 L-3.8,-47 C-5.6,-45.6 -7.4,-45.4 -8.4,-46.6 Z", D.lin([[0, "#B6C3DA"], [1, "#62759A"]], 0, -50, 0, -45), TRAIT, 0.8);
      t += path("M-4.2,-47.2 C-4.2,-53 4.8,-53.8 5.2,-47 Z", D.lin([[0, "#CAD5E8"], [1, "#7F92B4"]], 0, -53.6, 0, -47), TRAIT, 0.8);
      t += line("M-3.4,-50 C-2,-52.6 2,-53 3.8,-51.4", LUNE, 0.65, 0.75) + line("M-7.6,-46.8 C-3,-49.4 5,-49.6 9.4,-46.4", LUNE, 0.45, 0.55);
      t += path("M9.8,-46 Q10.4,-44.8 9.9,-44.2 Q9.3,-44.8 9.8,-46 Z", "#D2E4F5", "none", 0, ' opacity="0.8"');
      c.f += `<g transform="translate(${tx} 0)">${t}</g>`;
      c.b += volutes([[-10.5, -2.4, 1.1], [3, -0.6, 0.9, true], [8, -2, 0.8]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -26, 17, 28],
        sol: 11,
        glow: [-0.2, -20.6],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -24 - (k === 4 ? 22 : 0), s = k === 4 ? 0.7 : 1;
          return halo(D, 0, y, k === 4 ? 13 : 18) + noBouee(D, 0, y, 9 * s, 3.2 * s, true) + (k === 4 ? [[0, 5, 0.9], [0.6, 9, 0.7], [-0.4, 13, 0.5], [0.3, 17, 0.35]].map(([dx, dy, a]) => etincelle(dx, y + dy, 0.55, a)).join("") : etincelle(-9, y - 4, 0.8) + etincelle(9, y + 2, 0.6));
        }, "lumiere"),
        // il se fond en eau (une flaque qui s'étale), puis en vapeur
        voile: /* @__PURE__ */ __name((n) => {
          let s = ell(0, 0.2, 6 + n * 4, 1.4 + n * 0.6, D.rad([[0, "#BFD6EE", 0.55], [1, "#BFD6EE", 0]], 0, 0.2, 6 + n * 4));
          s += [[-6, -4], [5, -6], [-2, -9], [3, -2]].map(([x, y], i) => path(`M${x},${r22(y - n * 2 - 1.5)} Q${x + 0.8},${r22(y - n * 2)} ${x},${r22(y - n * 2 + 0.6)} Q${x - 0.8},${r22(y - n * 2)} ${x},${r22(y - n * 2 - 1.5)} Z`, "#D2E4F5", TRAIT, 0.3, ` opacity="${r22(n < 3 ? 0.8 : 0.3)}"`)).join("");
          return s;
        }, "voile")
      });
    }
    __name(noye, "noye");
    var RA_NOEUD = "M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25 C2.2,-28.4 6.6,-27.4 7.4,-23.8 C11,-23.6 12.8,-19.6 11,-16.4 C12.4,-12.6 8.4,-10 4.2,-11.4 C2,-9.2 -3.6,-9.4 -5.4,-11.4 C-9.2,-10.6 -13.2,-12.4 -11.6,-15.4 Z";
    function raBourgeon(D) {
      return chaud(D, 0.5, -28, 12, 0.4) + `<g transform="translate(0 2)">` + path(effile([0, -27.6], [0.3, -29.6], [0.7, -31], [0.4, -32.8], 1.3, 0.8), "#6FA24A", BRUN, 0.4) + path("M0.4,-32.4 C-1.6,-33.6 -1.4,-36.6 0.6,-37.4 C2.4,-36.4 2.4,-33.6 0.4,-32.4 Z", D.lin([[0, "#C2F290"], [1, "#5FA43C"]], -1, -37, 2, -33), BRUN, 0.55) + line("M0.5,-33 C0.3,-34.4 0.5,-35.8 0.7,-36.8", "#E4FFC8", 0.3, 0.7) + path("M0.6,-32.6 C2.6,-33 4.4,-31.8 4.6,-30.6 C3,-30.2 1.6,-31 0.6,-32.6 Z", D.lin([[0, "#A6E07F"], [1, "#4E8C32"]], 1, -33, 4.6, -30.6), BRUN, 0.45) + ell(-1.9, -29.7, 1.45, 1.45, D.rad([[0, "#FF8576"], [0.6, "#D8312A"], [1, "#961C18"]], -2.3, -30.1, 1.7), ` stroke="${BRUN}" stroke-width="0.45"`) + ell(-2.3, -30.2, 0.42, 0.3, "#FFFFFF", ' opacity="0.85"') + line("M-1.6,-28.3 L-0.3,-27.9", BRUN, 0.4) + "</g>";
    }
    __name(raBourgeon, "raBourgeon");
    function racine(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const terre = P.kind === "terre" ? P.n : 0;
      const prm = {
        repos: [0, 0, 0, 0],
        marche1: [-0.5, 1, 1, 0.2],
        marche2: [0, 2, -1, 0.7],
        bouderie1: [0, 0, -4, 0.3],
        bouderie2: [0.2, 0, -2, 0.5],
        fuite1: [-0.6, 1, 6, 0.1],
        fuite2: [0, 2, 7, 0.6],
        luciole1: [0, 0, 0, 0.3],
        luciole2: [-0.4, 0, 0, 0.4],
        brume1: [0.6, 0, 0, 0.3],
        brume2: [1.2, 0, 0, 0.5],
        brume3: [1.8, 0, 0, 0.7]
      }[pose] || [0, 0, 0, 0];
      const [bob, step, lean, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      c.b += D.fondu(-55, -20, path("M-5.5,-21 C-6.2,-34 -5.2,-46 -3.6,-56 L4,-56 C5.4,-46 6.4,-34 5.6,-21 Z", D.lin([[0, "#AFC0DA", 0], [0.5, "#AFC0DA", 0.12], [1, "#AFC0DA", 0.22]], 0, -56, 0, -21)));
      c.b += line("M-5.5,-23 C-6.2,-34 -5.2,-46 -3.6,-55", LUNE, 0.45, 0.2) + line("M5.6,-23 C6.4,-34 5.4,-46 4,-55", LUNE, 0.45, 0.12);
      const pattes = [[-17, -1.4, -8, -16, 0], [16, -0.6, 8, -15.6, 1], [-11.5, 0.6, -5.4, -13.6, 1], [11, 1, 5.2, -13.2, 0], [-5, 1.6, -2.4, -12, 0], [4.6, 1.8, 2.6, -11.8, 1]];
      pattes.forEach(([x, yy, ax, ay, ph], i) => {
        const up = step && (i + ph + (step > 1 ? 1 : 0)) % 2 === 0 ? 2.4 : 0, fw = up ? 1.6 * Math.sign(x) * 0.4 + 1.2 : 0;
        const bx = x + fw, by = yy - up, dir = x > 0 ? 1 : -1;
        c.b += path(effile([ax, ay], [ax + dir * 5.5, ay - 9 + hash(i, 1) * 2], [bx - dir * (1 + hash(i, 2) * 1.5), by - 13], [bx, by], i < 2 ? 3.2 : 3.7, 0.3), i < 2 ? "#6E7FA0" : "#8796B4", TRAIT, 0.7);
        const kx = ax + (bx - ax) * 0.55, ky = ay - 7.4 + hash(i, 3);
        c.b += ell(kx, ky, 1.1, 0.8, i < 2 ? "#7486A6" : "#93A2BF", ` stroke="${TRAIT}" stroke-width="0.4"`);
        c.b += line(`M${r22(ax)},${r22(ay - 0.8)} C${r22(ax + dir * 4)},${r22(ay - 8.6)} ${r22(kx - dir * 1)},${r22(ky - 1.4)} ${r22(kx + dir * 0.6)},${r22(ky - 0.9)}`, LUNE, 0.4, i % 2 ? 0.25 : 0.45);
      });
      c.b += path(RA_NOEUD, D.lin([[0, "#B8C5DA"], [0.45, "#8494B2"], [1, "#4C5B7C"]], -10, -28, 9, -10), TRAIT, 0.85);
      c.b += D.clip(RA_NOEUD, [[-9, -24, -7, -12], [-4.4, -27.4, -2.6, -11], [1.6, -27.6, 2.6, -11.6], [6.2, -25, 7.4, -13]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r22(x0 + 1.8)},${r22((y0 + y1) / 2)} ${r22(x1 - 1.6)},${r22((y0 + y1) / 2 + 2)} ${x1},${y1}`, TRAIT, 0.55, 0.5) + line(`M${r22(x0 - 0.6)},${y0} C${r22(x0 + 1.2)},${r22((y0 + y1) / 2)} ${r22(x1 - 2.2)},${r22((y0 + y1) / 2 + 2)} ${r22(x1 - 0.6)},${y1}`, LUNE, 0.35, 0.3)).join("") + ell(dos ? -4 : 6, -13, 8, 7, D.rad([[0, "#0E1426", 0.55], [1, "#0E1426", 0]], dos ? -4 : 6, -13, 8)));
      c.b += contreJour("M-11.6,-15.4 C-13.4,-19.4 -10.6,-23.6 -6.8,-22.6 C-6,-26.4 -1.6,-27.6 0.6,-25");
      for (let i = 0; i < 11; i++) c.b += ell(-7.6 + i * 1.35 + hash(i, 1) * 0.6, -23.6 - Math.sin(i / 10 * Math.PI) * 2 + hash(i, 2) * 0.7, 0.8 + hash(i, 4) * 0.3, 0.55, i % 3 ? "#D2DCEA" : "#E8EEF7", ' opacity="0.9"');
      if (!dos) {
        c.b += path("M-1.8,-17 C-2,-19.6 2,-20.6 3.6,-18.6 C4.4,-16.6 2.4,-15 0.6,-15.2 C-0.8,-15.4 -1.8,-16 -1.8,-17 Z", D.rad([[0, "#05080F"], [1, "#1E2740"]], 0.8, -17.6, 3.4), TRAIT, 0.6);
        if (!(P.kind === "bouderie" && P.n === 2)) c.b += lueur(D, 0, -17.6, 0.36, "#D8E6FF") + lueur(D, 2, -17.4, 0.34, "#D8E6FF");
      }
      for (const [x, yy, k] of [[-10.4, -14.4, 1], [-11.6, -12, 0.7], [9.2, -11.8, 0.85]]) {
        c.b += ell(x, yy, 3.6 * k, 3.2 * k, D.rad([[0, "#BFF3FF", 0.42], [1, "#BFF3FF", 0]], x, yy, 3.6 * k));
        c.b += line(`M${x},${yy} l0,${r22(1.6 * k)}`, "#DDE6F2", 0.65 * k) + path(`M${r22(x - 1.6 * k)},${r22(yy + 0.2)} Q${x},${r22(yy - 1.9 * k)} ${r22(x + 1.6 * k)},${r22(yy + 0.2)} Z`, "#EAF6FB", TRAIT, 0.4) + ell(x - 0.4 * k, yy - 0.7 * k, 0.5 * k, 0.25 * k, "#FFFFFF", ' opacity="0.8"');
      }
      c.sv += raBourgeon(D);
      c.b += volutes([[-15.5, -1.2, 0.8], [14.5, -0.4, 0.8, true], [-3, 1.8, 0.7], [6, 1.4, 0.6, true]], phase);
      const fleur = /* @__PURE__ */ __name((k, y) => {
        let s = halo(D, 0.5, y, k === 4 ? 12 : 16);
        for (let i = 0; i < 5; i++) {
          const a = i / 5 * Math.PI * 2 - Math.PI / 2;
          s += `<g transform="translate(0.5 ${r22(y)}) rotate(${r22(a * 180 / Math.PI + 90)})">` + path("M0,0 C-1.6,-1.6 -1.4,-4.2 0,-4.8 C1.4,-4.2 1.6,-1.6 0,0 Z", "#FFF3CC", "#F2B860", 0.35, ' opacity="0.95"') + "</g>";
        }
        return s + ell(0.5, y, 1.1, 1.1, "#FFD27A");
      }, "fleur");
      if (terre) {
        const down = [0, 8, 18, 30][terre];
        const motte = `M-15,1 C-11,${r22(-2 - terre)} -6,${r22(-3.4 - terre * 1.2)} 0,${r22(-3.6 - terre * 1.2)} C6,${r22(-3.4 - terre * 1.2)} 11,${r22(-2 - terre)} 15,1 Z`;
        let s = sol(D, 14) + aura(D, 0, -16 + down * 0.6, 16, 14, 1 - terre * 0.25);
        const vu = D.clip("M-30,-80 L30,-80 L30,0.6 L-30,0.6 Z", `<g transform="translate(0 ${down})">${c.b}${c.sv}</g>`);
        s += vu;
        if (terre === 3) s += `<g transform="translate(0 21)">${raBourgeon(D)}</g>`;
        s += path(motte, D.lin([[0, "#6E6A6E"], [1, "#3E3B42"]], 0, -6, 0, 1), TRAIT, 0.7);
        s += [[-10, -1.6], [-5, -3], [2, -3.6], [7, -2.6], [12, -1]].map(([x, y], i) => ell(x, y - terre * 0.6, 1 + hash(i, 61) * 0.6, 0.7, "#5A5660", ` stroke="${TRAIT}" stroke-width="0.35"`)).join("");
        s += [[-8, -6], [6, -7], [-2, -9]].map(([x, y], i) => ell(x + (hash(i, 63) - 0.5) * 3, y - terre * 1.5, 0.7, 0.5, "#6A6670", ` opacity="${r22(0.9 - terre * 0.2)}"`)).join("");
        s += line(`M-14,0 C-10,${r22(-2.2 - terre)} -5,${r22(-3.4 - terre * 1.2)} 0,${r22(-3.6 - terre * 1.2)}`, LUNE, 0.45, 0.35);
        return D.out(s);
      }
      return finir(D, P, c, {
        t: tf(bob, lean, P.kind === "bouderie" && P.n === 2),
        aura: [0, -18, 19, 20],
        sol: 15,
        glow: [0, -29],
        motes: [[-14, -22, 0.6], [13, -26, 0.5], [-4, -40, 0.55]],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -24 - (k === 4 ? 20 : 0);
          return (k === 3 ? `<g opacity="0.3">${raBourgeon(D)}</g>` : "") + fleur(k, y) + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.5 + dx, y + dy, 0.55, a)).join("") : etincelle(-6, y - 4, 0.8) + etincelle(7, y + 2, 0.6));
        }, "lumiere"),
        // la mousse qui tombe en flocons de brume
        voile: /* @__PURE__ */ __name((n) => [[-8, -24], [-3, -27], [3, -27], [8, -24], [-12, -14], [11, -12]].map(([x, y], i) => ell(x * (1 + n * 0.2), y - n * 5 - hash(i, 71) * 3, 0.8, 0.55, "#D2DCEA", ` opacity="${r22(0.85 - n * 0.22)}"`)).join(""), "voile")
      });
    }
    __name(racine, "racine");
    var ES_CORPS = "M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3 C-7,-1.2 -4,-2.8 -1,-0.8 C2,-2.8 5,-1 8,-3 C9.6,-13 10.8,-26 10.2,-38 C9.8,-48 7.6,-56 2.6,-58 Z";
    var feuille = /* @__PURE__ */ __name((k, fill, extra = "") => path(`M0,${r22(-k * 1.45)} C${r22(k * 1.05)},${r22(-k * 0.5)} ${r22(k * 0.85)},${r22(k * 0.9)} 0,${r22(k * 1.5)} C${r22(-k * 0.85)},${r22(k * 0.9)} ${r22(-k * 1.05)},${r22(-k * 0.5)} 0,${r22(-k * 1.45)} Z`, fill, TRAIT, 0.4, extra) + line(`M0,${r22(-k * 1.25)} L0,${r22(k * 1.3)}`, TRAIT, 0.3, 0.55) + line(`M0,${r22(-k * 0.2)} l${r22(k * 0.5)},${r22(-k * 0.4)} M0,${r22(k * 0.5)} l${r22(-k * 0.5)},${r22(-k * 0.4)}`, TRAIT, 0.25, 0.45), "feuille");
    var ES_FEUILLES = (() => {
      const out = [];
      for (let i = 0; out.length < 34 && i < 400; i++) {
        const fx = -10 + hash(i, 3) * 20, fy = -56 + hash(i, 5) * 54;
        if (Math.abs(fx) > 9.6 - (fy < -48 ? 3 : 0)) continue;
        if (out.some(([x, yy]) => Math.hypot(x - fx, yy - fy) < 3.6)) continue;
        out.push([fx, fy, -50 + hash(i, 7) * 100, 2.1 + hash(i, 9) * 1.3]);
      }
      return out.sort((a, b) => a[1] - b[1]);
    })();
    var esMasque = /* @__PURE__ */ __name((D, a = 1) => {
      const m = "M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z";
      return path(m, D.lin([[0, "#E6EAF0"], [0.55, "#C3CAD7"], [1, "#949DB1"]], -4, -66, 5, -51), TRAIT, 0.85, a < 1 ? ` opacity="${r22(a)}"` : "") + D.clip(m, [[-3, -63, -2.4, -54], [2.6, -64, 3.2, -53.5], [-0.2, -65.4, 0.4, -61], [0.6, -55, 0.2, -51.4]].map(([x0, y0, x1, y1]) => line(`M${x0},${y0} C${r22(x0 + 0.8)},${r22((y0 + y1) / 2)} ${r22(x1 - 0.6)},${r22((y0 + y1) / 2 + 1)} ${x1},${y1}`, "#7E879B", 0.4, 0.6)).join("") + ell(4.6, -57, 4, 8, D.rad([[0, "#2A3247", 0.35], [1, "#2A3247", 0]], 4.6, -57, 6))) + line("M-5,-63.6 C-5.4,-58 -4,-53 0.2,-50.6", LUNE, 0.6, 0.6 * a);
    }, "esMasque");
    function esGraine(D, pouls, y = -38) {
      return chaud(D, 0.3, y, 10 + 6 * pouls, 0.26 + 0.2 * pouls) + ell(0.3, y, 2 + 0.3 * pouls, 2.5 + 0.3 * pouls, D.rad([[0, "#FFE9AE"], [0.45, "#F4A33C"], [1, "#A85A16"]], -0.2, y - 0.8, 2.9), ` stroke="${BRUN}" stroke-width="0.5"`) + ell(-0.4, y - 1, 0.55, 0.8, "#FFF6D8", ' opacity="0.85"');
    }
    __name(esGraine, "esGraine");
    function esprit(pref, view, pose) {
      const D = Dessin(pref);
      const P = poseOf(pose);
      const dos = view === "dos";
      const prm = {
        repos: [0, 0, 0, 0.6, 0],
        marche1: [-0.7, 2, 0, 0.3, 0.2],
        marche2: [0.2, 3, 0, 0.9, 0.7],
        bouderie1: [0, -3, 1, 0.4, 0.3],
        bouderie2: [0.2, -4, 0.6, 0.3, 0.5],
        fuite1: [-1, 9, 0, 0.9, 0.1],
        fuite2: [0.3, 11, 0, 1, 0.6],
        luciole1: [0, 0, 0.3, 1, 0.3],
        luciole2: [-0.6, 0, 0.3, 1, 0.4],
        brume1: [0, 0, 0, 0.5, 0.3],
        brume2: [0, 0, 0, 0.4, 0.5],
        brume3: [0, 0, 0, 0.3, 0.7]
      }[pose] || [0, 0, 0, 0.6, 0];
      const [bob, lean, bow, pouls, phase] = prm;
      const c = { b: "", sv: "", f: "" };
      const sway = P.kind === "marche" || P.kind === "fuite" ? P.n === 1 ? 1.4 : -1 : 0;
      c.b += D.fondu(-14, 0, path(`M-5,-24 C-11,-16 ${r22(-17 + sway)},-8 ${r22(-24 + sway * 1.6)},-2.4 C-17,-0.8 -10,-1.2 -4,-2.2 Z`, D.lin([[0, "#7D8EAF", 0.75], [1, "#7D8EAF", 0.05]], -4, 0, -24, 0), "none"));
      for (let i = 0; i < 9; i++) {
        const x = -8 - i * 1.9 - hash(i, 11) * 1.5 + sway * (i / 9), yy = -2.2 - hash(i, 13) * 3 - Math.max(0, 6 - i) * 0.6, k = 1.6 + hash(i, 15) * 0.8;
        c.b += `<g transform="translate(${r22(x)} ${r22(yy)}) rotate(${r22(hash(i, 17) * 180)})" opacity="${r22(0.75 - i * 0.07)}">` + feuille(k, ["#8C9DBE", "#7486A8", "#A3B2CC"][i % 3]) + "</g>";
      }
      c.b += corps(
        D,
        ES_CORPS,
        brumeDe(D, -10, -58, 10, -10, "#BBC8DE", "#8394B5", "#48587C"),
        -58,
        0,
        ES_FEUILLES.map(([fx, fy, a, k], i) => `<g transform="translate(${r22(fx)} ${r22(fy)}) rotate(${r22(a + (dos ? 30 : 0))})">` + feuille(k, ["#A1B0CC", "#8B9CBD", "#B4C1D8", "#7A8BAD", "#95A5C4"][i % 5]) + line(`M${r22(-k * 0.6)},${r22(-k * 0.6)} C${r22(-k * 0.3)},${r22(-k * 1.1)} 0,${r22(-k * 1.3)} 0,${r22(-k * 1.3)}`, LUNE, 0.3, 0.45) + "</g>").join("") + ell(dos ? -2 : 7, -24, 9, 26, D.rad([[0, "#0E1528", 0.55], [1, "#0E1528", 0]], dos ? -2 : 7, -24, 12))
      );
      c.b += contreJour("M-2.6,-58 C-7.6,-56 -10,-48 -10.6,-38 C-11.4,-26 -10.8,-13 -10,-3");
      for (const [x0, y0, flip] of [[-8.6, -47, -1], [8.4, -47, 1]]) {
        const x1 = x0 + flip * 3.4 + (P.kind === "fuite" ? -flip * 2 : 0), y1 = y0 + 19;
        c.b += path(effile([x0, y0], [x0 + flip * 2.8, y0 + 6], [x1 - flip * 0.4, y1 - 7], [x1, y1], 1.9, 0.9), "#7B8BAA", TRAIT, 0.55);
        for (const [dx, dy] of [[-1.2, 4.6], [0.3, 5.6], [1.6, 4.2]]) c.b += path(effile([x1, y1], [x1 + flip * dx * 0.3, y1 + dy * 0.4], [x1 + flip * dx * 0.8, y1 + dy * 0.7], [x1 + flip * dx, y1 + dy], 0.8, 0.15), "#7B8BAA", TRAIT, 0.35);
      }
      if (dos) c.sv += chaud(D, 0.3, -38, 8 + 4 * pouls, 0.16 + 0.12 * pouls);
      else c.sv += ell(0.3, -38, 3.6, 3.4, D.rad([[0, "#120A06", 0.8], [1, "#26304A", 0.15]], 0.3, -38, 3.6)) + esGraine(D, pouls);
      let t = "";
      const bois = /* @__PURE__ */ __name((k) => {
        const tige = effile([1 + 2.4 * k, -63], [1 + 5 * k, -68], [1 + 6.4 * k, -73], [1 + 10.4 * k, -77.4], 1.6, 0.35);
        const branches = [effile([1 + 5 * k, -68.4], [1 + 6.6 * k, -69.4], [1 + 8.6 * k, -71], [1 + 10 * k, -73.4], 1, 0.25), effile([1 + 7 * k, -73.6], [1 + 6.8 * k, -75.4], [1 + 7.2 * k, -77], [1 + 7.6 * k, -79], 0.9, 0.2), effile([1 + 3.6 * k, -66], [1 + 2.8 * k, -68], [1 + 2.8 * k, -70], [1 + 3 * k, -71.4], 0.9, 0.2)];
        return [tige, ...branches].map((d) => path(d, "#8696B3", TRAIT, 0.45)).join("") + line(`M${r22(1 + 2.4 * k)},-63.4 C${r22(1 + 5 * k)},-68.4 ${r22(1 + 6.4 * k)},-73.4 ${r22(1 + 10 * k)},-77.2`, LUNE, 0.35, k < 0 ? 0.6 : 0.3);
      }, "bois");
      t += bois(-1) + bois(1);
      t += line("M7.4,-72.6 q0.5,2 -0.1,3.6", "#5C6680", 0.4);
      t += [[-0.8, 0, 0.9], [0.8, 0.2, 0.85], [0, 1, 0.95], [-0.3, -0.8, 0.8], [0.9, 0.9, 0.7]].map(([dx, dy, k]) => ell(7.2 + dx, -68.6 + dy, 0.95 * k, 0.6 * k, "#AE9FB6", ` stroke="${TRAIT}" stroke-width="0.25" opacity="0.85"`)).join("") + ell(7.2, -68.5, 0.45, 0.45, "#8C7F6C");
      const detourne = P.kind === "bouderie" && P.n === 2;
      if (dos || detourne) {
        t += path("M-5.2,-64 C-5.6,-58 -4.2,-52.5 0.4,-50.2 C5,-52.5 6.4,-58 6,-64 C3,-66.4 -2.2,-66.4 -5.2,-64 Z", brumeDe(D, -5, -66, 6, -50, "#AEBBD3", "#7F90B1", "#4E5E82"), TRAIT, 0.8) + [[-2, -61, 30], [2.4, -59, -40], [0, -55, 10]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) rotate(${a})">` + feuille(2, ["#94A4C2", "#8798B9", "#A5B3CD"][i]) + "</g>").join("");
        if (detourne) t += `<g transform="translate(9 -2) rotate(28 0 -57)">${esMasque(D, 0.85)}</g>`;
      } else {
        t += esMasque(D);
        t += path("M-3,-60.4 C-2.6,-61.6 -0.8,-61.6 -0.6,-60 C-0.8,-58.4 -2.6,-58.4 -3,-60.4 Z", "#0C111E") + path("M1.9,-60.2 C2.3,-61.4 4,-61.4 4.2,-59.8 C4,-58.2 2.3,-58.2 1.9,-60.2 Z", "#0C111E");
        t += lueur(D, -1.8, -59.7, 0.5, "#CFF7DA") + lueur(D, 3.05, -59.5, 0.48, "#CFF7DA");
        t += ell(0.4, -52.6, 6, 4, D.rad([[0, "#FFC27A", 0.22 + 0.16 * pouls], [1, "#FFC27A", 0]], 0.4, -51, 6));
      }
      c.f += `<g transform="rotate(${r22(bow * 14)} 0 -52)">${t}</g>`;
      c.b += volutes([[-8.5, -2, 1.1], [2, -0.4, 0.9, true], [7, -2, 0.9]], phase);
      return finir(D, P, c, {
        t: tf(bob, lean),
        aura: [-2, -36, 18, 40],
        sol: 14,
        glow: [0.3, -38],
        motes: [[-15, -40, 0.7], [13, -50, 0.55], [-6, -72, 0.5]],
        lumiere: /* @__PURE__ */ __name((k) => {
          const y = -38 - (k === 4 ? 22 : 0);
          return (k === 3 ? `<g transform="translate(-8 14) rotate(-24 0 -57)">${esMasque(D, 0.55)}</g>` : "") + halo(D, 0.3, y, k === 4 ? 13 : 18) + esGraine(D, 1, y) + (k === 4 ? [[0, 6, 0.8], [-1, 10, 0.55], [1, 14, 0.4]].map(([dx, dy, a]) => etincelle(0.3 + dx, y + dy, 0.55, a)).join("") : etincelle(-6, y - 5, 0.8) + etincelle(7, y + 3, 0.6));
        }, "lumiere"),
        // il s'effeuille : les feuilles s'envolent et se dispersent
        voile: /* @__PURE__ */ __name((n) => ES_FEUILLES.filter((_, i) => i % 3 === 0).map(([fx, fy, a, k], i) => {
          const dx = fx * (1 + n * 0.5) + (hash(i, 81) - 0.5) * n * 6, dy = fy - n * 4 - hash(i, 83) * n * 3;
          return `<g transform="translate(${r22(dx)} ${r22(dy)}) rotate(${r22(a + n * 60)})" opacity="${r22(0.85 - n * 0.2)}">` + feuille(k * 0.9, ["#A1B0CC", "#8B9CBD", "#B4C1D8"][i % 3]) + "</g>";
        }).join(""), "voile")
      });
    }
    __name(esprit, "esprit");
    var EGARES_VOILE = [
      ["fantome", "Le Sans-Nom", sansNom, []],
      ["zombie", "Le Dormeur", dormeur, ["dort1", "dort2"]],
      ["noye-de-l-hirondelle", "Le Noyé de l'Hirondelle", noye, [], "noye"],
      ["racine-errante", "La Racine errante", racine, ["terre1", "terre2", "terre3"], "racine"],
      ["esprit-sylvestre", "L'Esprit sylvestre revenant", esprit, [], "esprit"]
    ];
    module.exports = { POSES, EGARES_VOILE, sansNom, dormeur, noye, racine, esprit, effile, TRAIT, BRUN, LUNE, Dessin, path, line, ell, hash, sol, volutes, lueur, chaud, brumeDe, contreJour, poseOf, finir, tf, halo, etincelle };
  }
});

// atelier/betes_brume.js
var require_betes_brume = __commonJS({
  "atelier/betes_brume.js"(exports, module) {
    var V = require_egares_voile();
    var { Dessin, path, line, ell, hash, effile, sol, volutes, lueur, chaud, brumeDe, contreJour, poseOf, finir, tf, halo, etincelle, TRAIT, BRUN } = V;
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var tourne = /* @__PURE__ */ __name(([x, y], cx, cy, a) => {
      const k = a * Math.PI / 180, c = Math.cos(k), s = Math.sin(k);
      return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
    }, "tourne");
    var LOIN = "#617398";
    var LUMIERE = ["#FFFBEA", "#FFE7A8", "#FFC46E"];
    function tache(D, cx, cy, rx, ry, seed, cols, rot = 0, lum = false) {
      const c = lum ? LUMIERE : cols, n = 8, pts = [];
      for (let i = 0; i < n; i++) {
        const t = i / n * Math.PI * 2, k = 1 + 0.16 * Math.sin(seed * 3.1 + i * 2.3) + 0.07 * Math.cos(seed + i * 4.1);
        pts.push(tourne([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k], cx, cy, rot));
      }
      const mid = /* @__PURE__ */ __name((a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], "mid");
      let d = `M${mid(pts[n - 1], pts[0]).map(r22).join(",")}`;
      for (let i = 0; i < n; i++) d += ` Q${pts[i].map(r22).join(",")} ${mid(pts[i], pts[(i + 1) % n]).map(r22).join(",")}`;
      const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], cx - rx, cy - ry, cx + rx * 0.6, cy + ry);
      let poils = "";
      for (let i = 0; i < 4; i++) {
        const x = cx + (hash(seed, i) - 0.5) * rx * 1.1, y = cy + (hash(seed, i + 9) - 0.6) * ry * 0.9;
        poils += line(`M${r22(x)},${r22(y)} q${r22(rx * 0.25)},${r22(-ry * 0.12)} ${r22(rx * 0.45)},${r22(ry * 0.05)}`, lum ? "#FFFFFF" : c[0], 0.35, 0.7);
      }
      return path(d, fill, lum ? "#E8B860" : BRUN, 0.5) + poils;
    }
    __name(tache, "tache");
    function patte(D, [x, y], sw, w0, w1, arr, fill, pied = 0) {
      const fx = x + sw, h = -y;
      const c1 = arr ? [x + 1.8 + sw * 0.15, y + h * 0.35] : [x + sw * 0.3, y + h * 0.5];
      const c2 = arr ? [fx - 2.2, -h * 0.42] : [fx - 0.6, -h * 0.22];
      return path(effile([x, y], c1, c2, [fx, 0], w0, w1), fill, TRAIT, 0.6) + (pied ? path(effile([fx - 0.4, -0.3], [fx + pied * 0.3, -0.5], [fx + pied * 0.7, -0.4], [fx + pied, -0.15], w1 * 1.2, w1 * 0.6), fill, TRAIT, 0.5) : "");
    }
    __name(patte, "patte");
    function patteBasse(D, [x, y], sw, dir, w, fill) {
      const ex = x + dir * 1.6 + sw * 0.5, fx = x + sw;
      return path(effile([x, y], [ex, y - 1.2], [ex + dir * 0.4, -0.8], [fx + dir * 0.6, 0], w, w * 0.55), fill, TRAIT, 0.55) + line(`M${r22(fx - 0.6 + dir * 0.6)},-0.1 l${r22(dir * 1.2)},-0.25 M${r22(fx + dir * 0.6)},-0.1 l${r22(dir * 1)},0.2`, TRAIT, 0.45, 0.8);
    }
    __name(patteBasse, "patteBasse");
    function yeux(D, mode, pres, loin) {
      if (mode === "aucun") return "";
      if (mode === "clos") return [pres, loin].filter(Boolean).map(([x, y, r], i) => line(`M${r22(x - r * 1.1)},${r22(y)} q${r22(r * 1.1)},${r22(r * 0.7)} ${r22(r * 2.2)},0`, "#C9D6EE", i ? 0.35 : 0.45, 0.85)).join("");
      return lueur(D, pres[0], pres[1], pres[2]) + (loin ? lueur(D, loin[0], loin[1], loin[2]) : "");
    }
    __name(yeux, "yeux");
    function masse(D, d, box, ombre = [], extra = "") {
      const [x0, y0, x1, y1] = box;
      const fill = brumeDe(D, x0, y0, x1, y1);
      let inner = ombre.map(([cx, cy, rx, ry]) => ell(cx, cy, rx, ry, D.rad([[0, "#2E3B5C", 0.45], [1, "#2E3B5C", 0]], cx, cy, Math.max(rx, ry)))).join("");
      const w = x1 - x0, h = y1 - y0;
      for (let i = 0; i < 6; i++) {
        const x = x0 + w * (0.1 + 0.15 * i + 0.05 * hash(i, x0)), y = y0 + h * (0.25 + 0.45 * hash(i, y0 + 3));
        inner += line(`M${r22(x)},${r22(y)} q${r22(w * 0.07)},${r22(-h * 0.08)} ${r22(w * 0.14)},${r22(h * 0.02)}`, "#DCE5F5", 0.3, 0.2);
      }
      inner += ell((x0 + x1) / 2, y1, w * 0.6, h * 0.45, D.rad([[0, "#3A4970", 0.35], [1, "#3A4970", 0]], (x0 + x1) / 2, y1, w * 0.6));
      return `<g opacity="0.94">${path(d, fill, TRAIT, 0.75) + D.clip(d, inner + extra)}</g>`;
    }
    __name(masse, "masse");
    function etat(view, pose) {
      const P = poseOf(pose), { kind, n } = P, dos = view === "dos";
      const a = kind === "marche" || kind === "fuite" ? n === 1 ? 1 : -1 : 0;
      const tete = { marche: 0, fuite: 8, repos: -12, bouderie: 20, luciole: -14, brume: -6 }[kind];
      const yeuxMode = dos || kind === "bouderie" && n === 2 ? "aucun" : kind === "bouderie" || kind === "luciole" && n === 1 ? "clos" : "ouverts";
      return {
        P,
        kind,
        n,
        dos,
        a,
        tete: tete + (dos ? -6 : 0),
        yeux: yeuxMode,
        couchees: kind === "fuite" || kind === "bouderie",
        bob: kind === "marche" ? n === 2 ? -0.5 : 0 : kind === "fuite" ? n === 1 ? -0.9 : 0.3 : kind === "bouderie" ? 0.5 : 0,
        lean: (dos ? -4 : 0) + (kind === "fuite" ? 4 : 0) + (kind === "bouderie" && n === 1 ? 2 : 0),
        flip: kind === "bouderie" && n === 2,
        phase: (n || 0) * 0.37
      };
    }
    __name(etat, "etat");
    function ecarts(E, pas) {
      if (E.kind === "fuite") return E.n === 1 ? [pas * 1.6, pas * 1.1, -pas * 1.6, -pas * 1.1] : [-pas * 0.6, -pas * 0.3, pas * 0.7, pas * 0.4];
      return [E.a * pas, -E.a * pas, -E.a * pas, E.a * pas];
    }
    __name(ecarts, "ecarts");
    function bete(S) {
      return (pref, view, pose) => {
        const D = Dessin(pref), E = etat(view, pose);
        const [pf, lf, pa, la] = ecarts(E, S.pas);
        const sw = { pres: { av: pf, ar: pa }, loin: { av: lf, ar: la } };
        const jambe = /* @__PURE__ */ __name((p, fill) => {
          const s = sw[p.pres ? "pres" : "loin"][p.arr ? "ar" : "av"];
          return S.basse ? patteBasse(D, p.r, s, p.arr ? -1 : 1, p.w[0], fill) : patte(D, p.r, s, p.w[0], p.w[1], p.arr, fill, p.pied);
        }, "jambe");
        const fillPres = brumeDe(D, -10, -16, 6, 0);
        const loin = S.pattes.filter((p) => !p.pres).map((p) => jambe(p, LOIN)).join("");
        const pres = S.pattes.filter((p) => p.pres).map((p) => jambe(p, fillPres)).join("");
        const [cx, cy] = S.cou;
        const rot = r22(E.tete * (S.rot ?? 1));
        const teteT = `translate(${cx} ${cy}) rotate(${rot})`;
        const glow = S.tacheTete ? tourne([cx + S.glow[0], cy + S.glow[1]], cx, cy, rot) : S.glow;
        const tacheDe = /* @__PURE__ */ __name((lum) => S.tacheTete ? `<g transform="${teteT}">${S.tache(D, lum)}</g>` : S.clipTache === false ? S.tache(D, lum) : D.clip(S.corps, S.tache(D, lum)), "tacheDe");
        const b = D.fondu(S.fondu[0], S.fondu[1], `<g opacity="0.88">${loin}</g>` + S.queue(D, E) + (S.couD ? masse(D, S.couD, S.boite) : "") + masse(D, S.corps, S.boite, S.ombres) + contreJour(S.dosLigne, 0.75) + volutes(S.volutes, E.phase), -40, 80);
        const sv = chaud(D, glow[0], glow[1], S.chaud || 6, 0.3) + tacheDe(false);
        const f = D.fondu(S.fondu[0], S.fondu[1], pres + (S.devant ? S.devant(D, E) : ""), -40, 80) + `<g transform="${teteT}">${S.tete(D, E)}</g>`;
        const [ax, ay, arx, ary] = S.aura;
        return finir(D, E.P, { b, sv, f }, {
          t: S.saut && E.kind === "fuite" ? tf(E.n === 1 ? -2.6 : 0, E.n === 1 ? -16 : 3, E.flip) : tf(E.bob, E.lean, E.flip),
          aura: S.aura,
          sol: S.sol,
          glow,
          halo: [S.aura[2] * 0.75, S.aura[2] * 0.95],
          montee: false,
          lumiere: /* @__PURE__ */ __name((k) => {
            const up = k === 4 ? -16 : 0, s = k === 4 ? 0.75 : 1;
            return halo(D, glow[0], glow[1] + up, k === 4 ? 10 : 13) + `<g transform="translate(${r22(glow[0])} ${r22(glow[1] + up)}) scale(${s}) translate(${r22(-glow[0])} ${r22(-glow[1])})">${tacheDe(true)}</g>` + (k === 4 ? line(`M${r22(glow[0])},${r22(glow[1] - 3)} q-1.5,7 0.8,${r22(14)}`, "#FFE7A8", 0.6, 0.35) : "") + etincelle(glow[0] - 5, glow[1] + up - 3, 0.6) + etincelle(glow[0] + 4.5, glow[1] + up + 2.5, 0.45);
          }, "lumiere"),
          // elle retourne au Voile : des touffes de brume qui se détachent et montent
          voile: /* @__PURE__ */ __name((n) => {
            let s = "";
            for (let i = 0; i < 6; i++) {
              const x = ax + (hash(i, 61) - 0.5) * arx * 1.6 - n * 1.5, y = ay + (hash(i, 63) - 0.3) * ary - n * 4 - i * 0.8, k = 0.6 + hash(i, 65) * 0.5;
              s += path(effile([x, y], [x + 1.2 * k, y - 1 * k], [x + 2.4 * k, y - 0.4 * k], [x + 3.4 * k, y - 1.4 * k], 1.1 * k, 0.15), "#C3CFE3", "none", 0, ` opacity="${r22(0.75 - n * 0.18)}"`);
            }
            return s;
          }, "voile"),
          motes: [[ax - arx * 0.9, ay - ary * 0.4, 0.5], [ax + arx * 0.8, ay - ary * 0.7, 0.4], [ax - arx * 0.2, ay - ary * 1.1, 0.35]]
        });
      };
    }
    __name(bete, "bete");
    var lapin = bete({
      corps: "M4.6,-11.2 C1,-13 -5,-13.4 -8.6,-11 C-11,-9.4 -11.2,-6.2 -9.6,-4.4 C-8.6,-3.4 -6.8,-3.2 -5.8,-3.8 C-3.5,-4.8 0,-5 2.6,-5.2 C3.6,-5.4 5.6,-5.6 7.4,-6.6 C7.6,-7.2 7.6,-7.8 7.4,-8.2 C7.4,-9.4 6.4,-10.4 4.6,-11.2 Z",
      boite: [-11, -13.4, 7.6, -3.4],
      ombres: [[-1, -4.6, 7, 1.8], [-8, -5, 3, 2.6]],
      dosLigne: "M-10.2,-8 C-9.6,-11.6 -5,-13.2 0,-12.6",
      pattes: [
        { r: [-8.4, -4.8], arr: true, pres: false, w: [2.2, 0.8], pied: 2.2 },
        { r: [4.6, -5.8], arr: false, pres: false, w: [1.4, 0.6] },
        { r: [-7.8, -4.4], arr: true, pres: true, w: [2.6, 0.9], pied: 2.6 },
        { r: [5.4, -5.6], arr: false, pres: true, w: [1.6, 0.7] }
      ],
      pas: 2.4,
      cou: [5.4, -10.8],
      tete: /* @__PURE__ */ __name((D, E) => {
        const ar = E.couchees ? 42 : 0;
        const oreille = /* @__PURE__ */ __name((dx, dy, fill, pointe) => {
          const t = /* @__PURE__ */ __name((p) => tourne([p[0] + dx, p[1] + dy], 1.2 + dx, -3.2 + dy, -ar).map(r22).join(","), "t");
          const d2 = `M${t([0.2, -2.8])} C${t([-1.8, -6])} ${t([-3.8, -10])} ${t([-3.4, -13.8])} C${t([-1.4, -11.8])} ${t([1.4, -7.2])} ${t([2.2, -3.6])} Z`;
          const bout = `M${t([-2.6, -11.2])} C${t([-3.4, -12.2])} ${t([-3.5, -13])} ${t([-3.4, -13.8])} C${t([-2.6, -13.1])} ${t([-1.8, -12.2])} ${t([-1.3, -11.4])} Z`;
          return path(d2, fill, TRAIT, 0.6) + (pointe ? path(bout, "#2B3654", "none", 0, ' opacity="0.75"') + line(`M${t([0.6, -3.6])} C${t([-1, -6.4])} ${t([-2, -9])} ${t([-2.4, -11])}`, "#3A4970", 0.5, 0.5) : "");
        }, "oreille");
        const d = "M-1.4,-0.6 C-1,-3.4 2.6,-4.6 5,-3.4 C6.6,-2.6 7.4,-1.2 7,-0.2 C6.4,0.8 4.6,1.4 2.6,1.4 C0.6,1.4 -1.6,0.8 -1.4,-0.6 Z";
        return oreille(1.5, -0.3, LOIN, false) + masse(D, d, [-1.5, -4.6, 7.4, 1.4], [[2.6, 1.2, 4, 1.2]]) + ell(6.9, -0.7, 0.4, 0.32, "#2E3B5C", ' opacity="0.7"') + (E.dos ? "" : line("M6.6,-0.1 q-0.4,0.9 -1.4,1", "#2E3B5C", 0.35, 0.5)) + yeux(D, E.yeux, [3.3, -2.3, 0.62], [5.2, -2.9, 0.38]) + oreille(0, 0, brumeDe(D, -4, -14, 2, -3), true) + contreJour("M-1,-1.8 C0,-3.8 2.6,-4.4 4.4,-3.8", 0.7);
      }, "tete"),
      queue: /* @__PURE__ */ __name((D, E) => masse(D, "M-9.8,-9.6 c-1.8,-0.4 -2.8,0.8 -2.2,2 c0.6,1 1.8,1 2.5,0.2 Z", [-12.2, -10, -9.4, -7]), "queue"),
      tache: /* @__PURE__ */ __name((D, lum) => tache(D, 5, -8.4, 2.2, 2.4, 3, ["#F2A868", "#C8682E", "#8A401C"], 10, lum), "tache"),
      glow: [5, -8.4],
      chaud: 7,
      fondu: [-3.6, 0.6],
      volutes: [[-10, -1.2, 0.8, false], [2.4, -0.8, 0.7, true], [-3, -0.4, 0.6, false]],
      aura: [-1, -10, 13, 11],
      sol: 11
    });
    var BQ = "M5,-16.2 C1,-16.6 -4,-16 -8,-15.6 C-10.2,-15.4 -11.2,-13.4 -10.6,-11.6 C-10.2,-10.2 -9.6,-9.4 -8.4,-9 C-5,-8.8 -1,-8.6 2.8,-9 C4.6,-9.2 6.6,-9.8 7.4,-11 C8,-12.2 7.8,-13.6 7.2,-14.4 C6.6,-15.4 6,-16 5,-16.2 Z";
    var bouquetin = bete({
      corps: BQ,
      boite: [-11, -16.6, 8, -8.6],
      ombres: [[-1, -8.6, 8, 1.8], [6.2, -10, 2.2, 2], [-9.4, -10.4, 2, 2]],
      dosLigne: "M-10.6,-12.4 C-10,-15.4 -6,-16 -1,-16.3",
      couD: "M3.6,-15.8 C5,-18.4 7.6,-20.6 9.6,-21.6 C11.2,-20.6 11.6,-19 11,-17.6 C10,-15.6 9,-13.8 7.8,-12.4 Z",
      pattes: [
        { r: [-8.6, -10], arr: true, pres: false, w: [2.4, 0.8] },
        { r: [5, -10], arr: false, pres: false, w: [1.9, 0.8] },
        { r: [-8.2, -9.6], arr: true, pres: true, w: [2.8, 0.9] },
        { r: [5.8, -9.8], arr: false, pres: true, w: [2.2, 0.9] }
      ],
      pas: 2.2,
      cou: [10.4, -21],
      tete: /* @__PURE__ */ __name((D, E) => {
        const ar = E.couchees ? 14 : 0;
        const corne = /* @__PURE__ */ __name((dx, w, fill) => {
          const a = [-0.4 + dx, -1.4], c1 = tourne([-0.2 + dx, -7.8], a[0], a[1], ar), c2 = tourne([-5.8 + dx, -10.6], a[0], a[1], ar), b = tourne([-9, -6 + dx * 0.2], a[0], a[1], ar);
          let s = path(effile(a, c1, c2, b, w, 0.45), fill, TRAIT, 0.6);
          for (let i = 1; i < 8; i++) {
            const t = i / 8, u = 1 - t;
            const p = [0, 1].map((j) => u * u * u * a[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * b[j]);
            s += line(`M${r22(p[0] - 0.55 * (1 - t * 0.6))},${r22(p[1] - 0.3)} l${r22(1.1 * (1 - t * 0.6))},0.6`, TRAIT, 0.32, 0.6);
          }
          return s;
        }, "corne");
        const d = "M-1.6,-1.6 C-0.2,-2.8 2.2,-2.2 3.2,-0.4 C4,1.2 4.6,3 4,4 C3.4,4.8 2,4.4 1.2,3.4 C0.2,2.2 -1.6,1 -2,-0.2 C-2.2,-0.8 -2,-1.3 -1.6,-1.6 Z";
        return corne(1.3, 1.6, LOIN) + masse(D, d, [-2.2, -2.8, 4.6, 4.6], [[2.4, 3.2, 2, 1.6]]) + ell(3.7, 3.4, 0.35, 0.28, "#2E3B5C", ' opacity="0.7"') + yeux(D, E.yeux, [0.9, -0.1, 0.5], [2.3, -0.7, 0.3]) + path(effile([-1.2, -0.6], [-2.6, -1.3], [-3.7, -0.5], [-4.5, 0.3], 1.3, 0.3), brumeDe(D, -4, -1, 0, 1), TRAIT, 0.5) + corne(0, 2, brumeDe(D, -8, -10, 0, -1)) + contreJour("M-1.4,-1.6 C-0.2,-2.6 1.6,-2.4 2.6,-1.2", 0.7);
      }, "tete"),
      queue: /* @__PURE__ */ __name((D, E) => masse(D, "M-10.2,-14.6 c-1.4,-0.8 -2.3,0 -1.8,1.1 c0.3,0.8 1.2,0.9 1.9,0.3 Z", [-12, -15.4, -9.6, -12.8]), "queue"),
      tacheTete: true,
      clipTache: false,
      // la barbiche châtaigne, longue, en mèches
      tache: /* @__PURE__ */ __name((D, lum) => {
        const c = lum ? LUMIERE : ["#E8A86A", "#A8622E", "#5E3216"];
        const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], 1, 3, 3, 9);
        return path("M2.2,3.2 C3.4,3.4 4,4 3.8,5 C3.6,6.4 2.8,7.8 1.4,9 C1.6,8 1.4,7.4 1,7.2 C0.8,7.8 0.4,8.2 -0.2,8.4 C0.4,7.2 0.6,6 0.8,5 C1,4 1.4,3.3 2.2,3.2 Z", fill, lum ? "#E8B860" : BRUN, 0.45) + line("M2.4,4.2 q0,2.2 -0.8,4 M1.4,4.6 q-0.1,1.6 -0.6,3", lum ? "#FFFFFF" : c[0], 0.3, 0.75);
      }, "tache"),
      glow: [2, 6],
      chaud: 7,
      fondu: [-4, 0.6],
      volutes: [[-9.4, -1.4, 0.8, false], [3, -0.8, 0.8, true], [-2.4, -0.4, 0.6, false]],
      aura: [0, -13, 14, 13],
      sol: 12
    });
    var poney = bete({
      corps: "M4.6,-15.4 C1,-15.6 -4,-15 -8,-15.4 C-10.8,-15.6 -12.2,-13.4 -11.8,-11.4 C-11.4,-9.6 -10.4,-8.6 -9,-8.4 C-5,-7.6 0,-7.6 3.4,-8.2 C5.4,-8.4 7.4,-9.4 8,-11 C8.4,-12.4 8,-13.8 7.4,-14.4 C6.6,-15.2 5.6,-15.6 4.6,-15.4 Z",
      boite: [-12, -15.8, 8.4, -7.6],
      ombres: [[-1.6, -7.8, 8.6, 2.2], [-10, -9.4, 2.6, 2.4], [6.4, -9.6, 2.4, 2]],
      dosLigne: "M-11.6,-12.6 C-11,-15.4 -7,-15.6 -2,-15.2",
      couD: "M3,-15 C4.2,-18.6 7,-21.4 10,-22.4 C12,-21.2 12.6,-19 12,-17 C11.2,-14.8 10.2,-12.6 8.2,-10.6 Z",
      pattes: [
        { r: [-9.4, -9.2], arr: true, pres: false, w: [3, 1.4] },
        { r: [5.2, -9.4], arr: false, pres: false, w: [2.6, 1.3] },
        { r: [-9, -8.8], arr: true, pres: true, w: [3.6, 1.6] },
        { r: [6, -9.2], arr: false, pres: true, w: [3, 1.5] }
      ],
      pas: 2.2,
      cou: [11, -21.6],
      tete: /* @__PURE__ */ __name((D, E) => {
        const ar = E.couchees ? 30 : 0;
        const oreille = /* @__PURE__ */ __name((x, fill) => {
          const t = tourne([x - 0.8, -5], x, -1.8, -ar);
          return path(effile([x, -1.6], [x - 0.2, -2.8], [t[0] + 0.2, t[1] + 1], t, 1.5, 0.3), fill, TRAIT, 0.5);
        }, "oreille");
        const d = "M-2.6,-1.6 C-0.8,-3.2 2.4,-2.6 4,-0.2 C5.2,1.6 6.2,3.8 5.6,5 C4.8,6.2 2.8,6 1.6,5 C0,3.6 -2.6,1.6 -3,0 C-3.2,-0.6 -3,-1.2 -2.6,-1.6 Z";
        return oreille(0.6, LOIN) + masse(D, d, [-3, -3, 6, 6], [[3.6, 4.6, 2.4, 1.6]]) + ell(4.6, 4.6, 0.45, 0.35, "#2E3B5C", ' opacity="0.6"') + yeux(D, E.yeux, [0.9, 0.3, 0.55], [2.1, -0.4, 0.32]) + oreille(-0.8, brumeDe(D, -2, -5, 1, -1)) + contreJour("M-2.4,-1.8 C-0.6,-3 2,-2.4 3.2,-0.8", 0.7);
      }, "tete"),
      queue: /* @__PURE__ */ __name((D, E) => {
        const s = E.kind === "fuite" ? -3 : E.a * 0.8;
        return path(effile([-11.4, -13.4], [-14 + s * 0.3, -12], [-14.4 + s, -7], [-13 + s, -2.2], 3.2, 0.5), brumeDe(D, -15, -13, -11, -2), TRAIT, 0.6) + line(`M-12.4,-11.8 q-1.4,3 -0.8,${r22(7.4)}`, "#DCE5F5", 0.35, 0.35) + line(`M-13,-10.6 q-0.8,3 -0.2,${r22(6)}`, "#3A4970", 0.35, 0.4);
      }, "queue"),
      clipTache: false,
      // la crinière : une masse qui suit l'encolure, ses mèches qui tombent sur le côté, et le toupet
      tache: /* @__PURE__ */ __name((D, lum) => {
        const c = lum ? LUMIERE : ["#EEA866", "#B8642C", "#76381A"];
        const fill = D.lin([[0, c[0]], [0.5, c[1]], [1, c[2]]], 4, -23, 8, -13);
        const d = "M11.6,-23.2 C8.6,-23 5.6,-21 3.8,-17.8 C3,-16.4 2.2,-15.4 1.2,-14.6 C2.6,-14.2 3.6,-14.6 4.2,-15.2 C4.4,-14 5,-13.2 5.8,-12.6 C5.8,-14 6.1,-15.2 6.6,-16.2 C7,-15 7.6,-14.4 8.4,-14 C8.1,-15.6 8.3,-17 8.9,-18.1 C9.3,-17.1 9.9,-16.6 10.6,-16.4 C10.2,-17.8 10.4,-19.3 11.2,-20.4 C11.8,-21.3 12,-22.4 11.6,-23.2 Z";
        let s = path(d, fill, lum ? "#E8B860" : BRUN, 0.5);
        for (const [x, y, dx, dy] of [[9.6, -21.4, -1.6, 4], [7.6, -20.2, -1.2, 4.6], [5.8, -18.4, -0.8, 4.4], [4.2, -16.6, -0.6, 2.8]]) s += line(`M${x},${y} q${r22(dx * 0.2)},${r22(dy * 0.5)} ${dx},${dy}`, lum ? "#FFFFFF" : c[0], 0.35, 0.7);
        s += path("M11.4,-23 C13.2,-23.6 14.4,-22.4 14.4,-20.6 C13.8,-21.4 13,-21.6 12.4,-21.4 C12.8,-20.6 12.8,-19.6 12.4,-19 C11.8,-20.2 11.2,-21.6 11.4,-23 Z", fill, lum ? "#E8B860" : BRUN, 0.45);
        return s;
      }, "tache"),
      glow: [7, -18.6],
      chaud: 8,
      fondu: [-4, 0.6],
      volutes: [[-10, -1.4, 0.9, false], [3, -0.8, 0.8, true], [-3, -0.4, 0.7, false]],
      aura: [0, -12, 15, 13],
      sol: 12.5
    });
    var GR = "M-6.6,-2.4 C-7.2,-4.8 -5.6,-7 -3,-7.4 C-0.6,-7.8 2.2,-7.6 4.2,-7.2 C6.4,-6.8 8.4,-5.6 9,-4 C9.4,-2.8 8.6,-1.8 7,-1.6 C3,-1.2 -2,-1.2 -5,-1.4 C-6,-1.6 -6.4,-1.9 -6.6,-2.4 Z";
    var grenouille = bete({
      corps: GR,
      boite: [-7.2, -7.8, 9.4, -1.2],
      ombres: [[1, -1.2, 7.6, 1.6]],
      dosLigne: "M-6.8,-4 C-6.2,-6.6 -3.4,-7.4 0.6,-7.6",
      pattes: [
        { r: [5.6, -2.8], arr: false, pres: false, w: [1.1, 0.5] },
        { r: [6.4, -2.6], arr: false, pres: true, w: [1.3, 0.6] }
      ],
      pas: 0.7,
      cou: [4.6, -7],
      rot: 0.15,
      saut: true,
      tete: /* @__PURE__ */ __name((D, E) => {
        const bosse = /* @__PURE__ */ __name((x, y, r, fill) => ell(x, y, r, r * 0.8, fill, ` stroke="${TRAIT}" stroke-width="0.5"`), "bosse");
        return bosse(1.4, -1.1, 1.1, LOIN) + bosse(-0.2, -0.7, 1.35, brumeDe(D, -1.6, -2, 1.4, 0.4)) + yeux(D, E.yeux, [-0.1, -0.9, 0.6], [1.5, -1.3, 0.4]) + (E.dos ? "" : line("M3.6,3.4 C2.4,3 0.6,2.6 -1,2.4", "#2E3B5C", 0.45, 0.6) + ell(3.4, 1.6, 0.25, 0.2, "#2E3B5C", ' opacity="0.6"'));
      }, "tete"),
      // la cuisse repliée sur le flanc, le pied posé devant (au saut : la patte qui se détend)
      queue: /* @__PURE__ */ __name((D, E) => {
        const saut = E.kind === "fuite" && E.n === 1, k = E.kind === "fuite" ? 0 : E.a * 0.5;
        if (saut) return path(effile([-5.6, -3.2], [-8.4, -3.8], [-10.4, -2.6], [-12.4, -1.2], 2.4, 0.7), LOIN, TRAIT, 0.5);
        return path(effile([-5.8, -2.6], [-8.6 + k, -3.6], [-9 + k, -0.8], [-6.4 + k, -0.5], 2.2, 0.9), LOIN, TRAIT, 0.5);
      }, "queue"),
      tache: /* @__PURE__ */ __name((D, lum) => tache(D, -1.6, -6.8, 3, 1.3, 11, ["#E4F07A", "#86B83C", "#3E7A26"], 2, lum), "tache"),
      glow: [-1.6, -6.6],
      chaud: 6,
      devant: /* @__PURE__ */ __name((D, E) => grenouilleDevant(D, E), "devant"),
      fondu: [-1.2, 0.8],
      volutes: [[-7.4, -0.6, 0.6, false], [4.6, -0.4, 0.5, true]],
      aura: [0, -5, 11, 7],
      sol: 9.5
    });
    var grenouilleDevant = /* @__PURE__ */ __name((D, E) => {
      const saut = E.kind === "fuite" && E.n === 1, k = E.kind === "fuite" ? 0 : E.a * 0.5;
      const fill = brumeDe(D, -14, -7, 2, 0);
      const doigts = /* @__PURE__ */ __name((x, y, dir) => line(`M${r22(x)},${r22(y)} l${r22(dir * 1.3)},-0.45 M${r22(x)},${r22(y)} l${r22(dir * 1.4)},0.15 M${r22(x)},${r22(y)} l${r22(dir * 1)},0.6`, TRAIT, 0.4, 0.8), "doigts");
      const main = doigts(6.6 + k * 0.4, -0.1, 1);
      if (saut) return path(effile([-5, -3.2], [-8, -3.4], [-10.4, -2.2], [-12.8, -1.2], 2.6, 0.9), fill, TRAIT, 0.5) + path(effile([-12.6, -1.3], [-13.6, -1], [-14.4, -0.8], [-15.2, -0.6], 1, 0.5), fill, TRAIT, 0.4) + doigts(-15.2, -0.6, -1);
      return path(effile([0.2, -2], [-1.2, -1.6], [-2.4, -1.1], [-3.6, -0.8], 1.4, 1), fill, TRAIT, 0.45) + masse(D, "M-6.4,-2.8 C-6.8,-5.2 -4.4,-6.2 -2,-5.2 C0,-4.4 1.2,-2.8 0.4,-2 C-0.6,-1.2 -3.2,-1.2 -5.2,-1.4 C-5.9,-1.6 -6.3,-2.1 -6.4,-2.8 Z", [-7, -6, 1, -1.2], [[-3, -1.6, 3, 1.2]]) + path(effile([-3.6, -0.8], [-1, -0.7], [1.2, -0.5], [3 + k, -0.3], 1.1, 0.5), fill, TRAIT, 0.45) + doigts(3 + k, -0.3, 1) + main;
    }, "grenouilleDevant");
    var fennec = bete({
      corps: "M3.4,-9.8 C0,-10.4 -3.6,-10.2 -6,-9.6 C-7.6,-9.2 -8,-7.6 -7.4,-6.4 C-7,-5.6 -6.2,-5.2 -5.4,-5.2 C-3,-5.2 0,-5 2.2,-5.2 C3.6,-5.4 5.2,-6.2 5.6,-7.4 C5.9,-8.4 5.2,-9.4 3.4,-9.8 Z",
      boite: [-8, -10.4, 6, -5],
      ombres: [[-1, -5, 6, 1.4], [-6.6, -6, 1.6, 1.6]],
      dosLigne: "M-7.6,-7.6 C-7,-9.8 -3,-10.4 1,-10.1",
      pattes: [
        { r: [-6.4, -6], arr: true, pres: false, w: [1.8, 0.55] },
        { r: [3.6, -6], arr: false, pres: false, w: [1.2, 0.55] },
        { r: [-6, -5.6], arr: true, pres: true, w: [2.1, 0.6] },
        { r: [4.2, -5.8], arr: false, pres: true, w: [1.4, 0.6] }
      ],
      pas: 2,
      cou: [4.6, -9.4],
      tete: /* @__PURE__ */ __name((D, E) => {
        const d = "M-1.6,-0.6 C-0.6,-3 2.4,-3.2 3.6,-1.6 C4.6,-0.6 6.4,0 6.9,0.6 C6,1.4 3.4,1.6 1.6,1.6 C0,1.6 -1.8,0.8 -1.6,-0.6 Z";
        const ar = E.couchees ? 40 : 0;
        const t = tourne([1.6, -10.4], 1.8, -2.6, -ar);
        const oreille = path(`M0.6,-2.4 C${r22(t[0] - 1.6)},${r22(t[1] + 3)} ${r22(t[0] - 0.6)},${r22(t[1] + 0.6)} ${r22(t[0])},${r22(t[1])} C${r22(t[0] + 1.2)},${r22(t[1] + 2.4)} 3.8,-4.6 3,-2.4 Z`, LOIN, TRAIT, 0.55);
        return oreille + masse(D, d, [-2, -3.4, 7, 1.8], [[3, 1.4, 3, 1]]) + ell(6.8, 0.5, 0.45, 0.35, "#2E3B5C", ' opacity="0.7"') + (E.dos ? "" : line("M6.6,0.9 q-1.6,0.6 -3.2,0.3", "#2E3B5C", 0.3, 0.5)) + yeux(D, E.yeux, [2.4, -1.2, 0.55], [3.9, -1.6, 0.33]) + contreJour("M-1.2,-1.4 C0,-2.8 2,-3 3.2,-2", 0.7);
      }, "tete"),
      queue: /* @__PURE__ */ __name((D, E) => {
        const s = E.kind === "fuite" ? -2.4 : E.a * 0.6;
        return masse(D, `M-6.8,-8.4 C-9.2,-9 -11.8,-7.8 ${r22(-12.8 + s)},${r22(-4.8 + s * 0.3)} C${r22(-13 + s)},${r22(-3 + s * 0.3)} -11.8,-2.8 -10.8,-3.8 C-9.6,-5 -8.2,-6 -6.8,-6.2 Z`, [-13.2, -9, -6.4, -2.8], [[-10, -3.4, 3, 1.4]]) + ell(-12.3 + s, -3.6 + s * 0.3, 1, 0.9, "#2B3654", ' opacity="0.6"');
      }, "queue"),
      tacheTete: true,
      clipTache: false,
      // l'oreille près, de la couleur du sable, l'intérieur rosé
      tache: /* @__PURE__ */ __name((D, lum) => {
        const fill = lum ? D.lin([[0, LUMIERE[0]], [0.5, LUMIERE[1]], [1, LUMIERE[2]]], -2, -11, 1, -2) : D.lin([[0, "#F8E2B0"], [0.55, "#E2B26A"], [1, "#B07434"]], -2, -11, 1, -2);
        const d = "M-1.2,-2.2 C-3.4,-5.4 -3.6,-8.6 -2.6,-11.2 C-0.6,-9.6 1.4,-6.6 1.6,-2.8 Z";
        return path(d, fill, lum ? "#E8B860" : BRUN, 0.55) + path("M-0.8,-3.2 C-2.2,-5.6 -2.4,-7.8 -2.1,-9.4 C-0.9,-8 0.4,-6 0.6,-3.4 Z", lum ? "#FFFFFF" : "#E3A096", "none", 0, ' opacity="0.65"') + line("M-1.4,-4 q-0.6,-1.6 -0.6,-3.4 M-0.4,-4 q-0.3,-1.2 -0.4,-2.6", lum ? "#FFFFFF" : "#FBEBCB", 0.3, 0.8);
      }, "tache"),
      glow: [-0.9, -6.2],
      chaud: 6,
      fondu: [-3, 0.6],
      volutes: [[-7, -1, 0.7, false], [2.4, -0.6, 0.6, true]],
      aura: [-1, -8, 11, 10],
      sol: 9
    });
    var CA = "M-6,-6 C-6,-10 -2,-12.2 2,-11.6 C5,-11.2 7,-9.6 7.4,-7.6 C7.6,-6 6.6,-5 5,-4.6 C2,-4 -2.5,-4 -4.6,-4.4 C-5.6,-4.7 -6,-5.2 -6,-6 Z";
    var cameleon = bete({
      corps: CA,
      boite: [-6.4, -12.2, 7.6, -4],
      ombres: [[0, -4, 6.4, 1.6]],
      dosLigne: "M-5.8,-8 C-4.6,-11.2 -1,-12.2 2.4,-11.6",
      basse: true,
      pattes: [
        { r: [-3.6, -4.8], arr: true, pres: false, w: [1.3] },
        { r: [4.2, -5], arr: false, pres: false, w: [1.2] },
        { r: [-3, -4.6], arr: true, pres: true, w: [1.6] },
        { r: [4.8, -4.8], arr: false, pres: true, w: [1.5] }
      ],
      pas: 1.2,
      cou: [6.6, -8.2],
      rot: 0.5,
      tete: /* @__PURE__ */ __name((D, E) => {
        const d = "M-1.2,-2.4 C0,-5.8 3.4,-5.6 5,-2.6 C5.9,-1.1 5.8,0.8 4.3,1.4 C2.5,2.1 0.1,1.7 -1,0.6 C-1.6,-0.4 -1.6,-1.4 -1.2,-2.4 Z";
        const oeil = E.yeux === "aucun" ? "" : ell(2.4, -0.7, 1.5, 1.4, brumeDe(D, 1, -2, 4, 1), ` stroke="${TRAIT}" stroke-width="0.5"`) + line("M1.2,-0.4 a1.3,1.2 0 0 1 2.4,-0.6", "#3A4970", 0.3, 0.6) + yeux(D, E.yeux, [2.8, -0.8, 0.55]);
        return masse(D, d, [-1.6, -5.6, 6, 2], [[3, 1.4, 3, 1]]) + line("M0,-3.6 C1.2,-5.2 3,-5 3.9,-3.6", TRAIT, 0.4, 0.55) + oeil + line("M3.4,1 q1,0.2 1.8,-0.2", "#2E3B5C", 0.4, 0.6);
      }, "tete"),
      queue: /* @__PURE__ */ __name((D, E) => {
        const k = E.kind === "fuite" ? 1.2 : 1 + E.a * 0.06;
        const spire = `M${r22(-10.6 * k)},-1.6 C${r22(-10.2 * k)},0 ${r22(-8 * k)},-0.2 ${r22(-8 * k)},-1.6 C${r22(-8 * k)},-2.8 ${r22(-9.6 * k)},-2.8 ${r22(-9.4 * k)},-1.8`;
        let crete = "";
        for (let i = 0; i < 7; i++) {
          const x = -4.6 + i * 1.3, y = -9.4 - Math.sin((i + 0.5) / 7 * Math.PI) * 2.6;
          crete += `M${r22(x)},${r22(y + 0.6)} l0.6,-0.9 l0.6,0.9`;
        }
        return path(crete, "#8D9EBF", TRAIT, 0.4) + path(effile([-5.6, -6.4], [-9, -6], [-11 * k, -4], [-10.6 * k, -1.6], 2.4, 1.3), brumeDe(D, -11, -7, -5, -1), TRAIT, 0.6) + line(spire, TRAIT, 1.3) + line(spire, "#8D9EBF", 0.6);
      }, "queue"),
      tache: /* @__PURE__ */ __name((D, lum) => tache(D, 0.2, -8.2, 5.4, 0.95, 17, ["#A6F2BC", "#2FAE74", "#0E6A55"], -9, lum), "tache"),
      glow: [0.4, -8.2],
      chaud: 6,
      fondu: [-2.2, 0.6],
      volutes: [[-6, -0.6, 0.6, false], [3, -0.5, 0.6, true]],
      aura: [-1, -7, 11, 8],
      sol: 9.5
    });
    var SA = "M-14.6,-2.2 C-12,-2.6 -10,-4.2 -6.6,-4.8 C-2.6,-5.6 2,-6 6,-5.8 C8.8,-5.7 11.6,-5 12.6,-3.8 C13,-3 12.2,-2.2 10.6,-2.1 C7,-1.9 2,-2.1 -2,-2.1 C-6,-2.1 -9,-1.6 -12,-1.7 C-13.2,-1.8 -14.2,-1.9 -14.6,-2.2 Z";
    var salamandre = bete({
      corps: SA,
      boite: [-14.6, -6, 12.8, -1.6],
      ombres: [[0, -1.8, 9, 1]],
      dosLigne: "M-9,-4.3 C-5,-5.4 -1,-5.8 4,-5.9",
      basse: true,
      pattes: [
        { r: [-3.4, -2.6], arr: true, pres: false, w: [1.2] },
        { r: [6, -2.8], arr: false, pres: false, w: [1.2] },
        { r: [-2.8, -2.4], arr: true, pres: true, w: [1.5] },
        { r: [6.6, -2.6], arr: false, pres: true, w: [1.4] }
      ],
      pas: 1.4,
      cou: [10.6, -4.4],
      rot: 0.25,
      tete: /* @__PURE__ */ __name((D, E) => yeux(D, E.yeux, [-0.2, -0.6, 0.55], [1, -1, 0.34]) + (E.dos ? "" : line("M2,1.6 C0.6,1.4 -0.6,1.2 -1.6,1.4", "#2E3B5C", 0.35, 0.55)), "tete"),
      queue: /* @__PURE__ */ __name((D, E) => "", "queue"),
      tache: /* @__PURE__ */ __name((D, lum) => tache(D, 2.4, -5.4, 2.8, 1.1, 23, ["#FFD070", "#F07A28", "#A43812"], -2, lum), "tache"),
      glow: [2.4, -5],
      chaud: 6,
      fondu: [-1.4, 0.8],
      volutes: [[-11, -0.6, 0.6, false], [2, -0.4, 0.5, true]],
      aura: [-1, -4, 14, 5],
      sol: 12.5
    });
    var BETES_BRUME = [
      ["tempere", "Lapin de brume (tempéré)", lapin],
      ["cimes", "Bouquetin de brume (les Cimes)", bouquetin],
      ["landes", "Poney de brume (les Landes)", poney],
      ["marais", "Grenouille de brume (le Marais)", grenouille],
      ["dunes", "Fennec de brume (les Dunes)", fennec],
      ["jungle", "Caméléon de brume (la Jungle)", cameleon],
      ["volcan", "Salamandre de brume (le Volcan)", salamandre]
    ];
    module.exports = { BETES_BRUME };
  }
});

// atelier/coq.js
var require_coq = __commonJS({
  "atelier/coq.js"(exports, module) {
    var { OUT, P, E, clip, r2: r22 } = require_troupe2();
    var Bt2 = require_betes();
    var { eye, limb, stroke, contact, bez } = Bt2;
    var SH = "rgba(40,55,20,.18)";
    var f2p = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "f2p");
    var rot = /* @__PURE__ */ __name((x, y, cx, cy, a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
    }, "rot");
    var C = {
      crete: ["#FF8A70", "#E8433A", "#B82A28"],
      camail: ["#FFD67E", "#F4A63E", "#DB7428"],
      plumeCamail: "#C25E22",
      dos: ["#EC8E4C", "#C85E2C", "#913E1C"],
      poitrail: ["#BE6638", "#9C4A2A", "#74331E"],
      aile: "#8C3A1C",
      barre: "#2D6550",
      queue: ["#4BA57A", "#2C6E52", "#16211D"],
      couverture: ["#5DB488", "#33785A", "#1F3D33"],
      reflet: "#9CEBC8",
      irise: "#A894EC",
      bec: ["#FFD474", "#F2B33B", "#D08A22"],
      patte: "#F2B33B",
      patteLoin: "#C98E2A",
      tete: ["#FFCB66", "#F2A23E", "#D9782C"],
      joue: "#F7A8B0",
      oreillon: "#FFF6EA",
      note: "#F2C94C",
      bouche: "#C9373A"
    };
    var defs = /* @__PURE__ */ __name((inner) => `<defs>${inner}</defs>`, "defs");
    var lin = /* @__PURE__ */ __name((id, [x1, y1, x2, y2], stops, user = false) => `<linearGradient id="${id}"${user ? ' gradientUnits="userSpaceOnUse"' : ""} x1="${r22(x1)}" y1="${r22(y1)}" x2="${r22(x2)}" y2="${r22(y2)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, [cx, cy, r], stops) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var url = /* @__PURE__ */ __name((id) => `url(#${id})`, "url");
    function ruban(p0, p1, p2, p3, w0, w1, fill, sw = 0.75, n = 12) {
      const pts = bez(p0, p1, p2, p3, n), L2 = [], R = [];
      pts.forEach((q, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
        const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
        const t = i / (n - 1), w = (w0 + (w1 - w0) * Math.pow(t, 0.85)) / 2;
        L2.push([q[0] - dy / m * w, q[1] + dx / m * w]);
        R.push([q[0] + dy / m * w, q[1] - dx / m * w]);
      });
      return P(`M${L2.map(f2p).join(" L")} L${R.reverse().map(f2p).join(" L")} Z`, fill, sw);
    }
    __name(ruban, "ruban");
    var tige = /* @__PURE__ */ __name((p0, p1, p2, p3, w, col, t1 = 0.85, op = 1) => {
      const pts = bez(p0, p1, p2, p3, 8).slice(0, Math.max(2, Math.round(8 * t1)));
      return `<path d="M${pts.map(f2p).join(" L")}" fill="none" stroke="${col}" stroke-width="${r22(w)}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ""}/>`;
    }, "tige");
    function ovale(cx, cy, rx, ry, ang, egg = 0.08) {
      const pts = [];
      for (let i = 0; i < 30; i++) {
        const t = i / 30 * Math.PI * 2;
        pts.push(rot(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry * (1 + egg * Math.cos(t)), cx, cy, ang));
      }
      return `M${pts.map(f2p).join(" L")} Z`;
    }
    __name(ovale, "ovale");
    function queue(o, k, up, sway, g, lenK = 1) {
      const [x, y] = o, X = /* @__PURE__ */ __name((dx) => x - dx * k * lenK, "X"), Y = /* @__PURE__ */ __name((dy) => y - dy * up, "Y");
      const plumes = [
        // [p1, p2, p3 (décalages depuis la racine), largeur, dégradé] : la grande faucille au fond, une couverture,
        // la seconde faucille, deux couvertures devant
        [[1, 8.6], [8, 11.2], [8.8 + sway, 4], 3.3, "q"],
        [[2.4, 4.6], [5.6, 6.2], [6.9 + sway * 0.6, 1.4], 2.5, "c"],
        [[0.2, 6.6], [5.9, 8.8], [7.2 + sway * 0.8, 2.2], 3, "q"],
        [[1.4, 2.4], [4.4, 3], [5.6 + sway * 0.5, -0.2], 2.3, "c"]
      ];
      let s = "";
      for (const [a, b, c2, w, gr] of plumes) {
        const p0 = [x, y], p1 = [X(a[0]), Y(a[1])], p2 = [X(b[0]), Y(b[1])], p3 = [X(c2[0]), Y(c2[1])];
        s += ruban(p0, p1, p2, p3, w, 0.2, url(`${g}${gr}`), 0.8);
        if (gr === "q") s += tige(p0, p1, p2, p3, 0.5, C.reflet, 0.62, 0.55) + tige(p0, [p1[0], p1[1] + 0.4], [p2[0], p2[1] + 0.5], p3, 0.3, C.irise, 0.45, 0.6);
        else s += tige(p0, p1, p2, p3, 0.3, "rgba(255,255,255,.35)", 0.7);
      }
      return s;
    }
    __name(queue, "queue");
    var queueDefs = /* @__PURE__ */ __name((g, sens) => lin(`${g}q`, sens, [[0, C.queue[2]], [0.35, C.queue[1]], [0.7, C.queue[0]], [1, C.queue[2]]]) + lin(`${g}c`, sens, [[0, C.couverture[2]], [0.5, C.couverture[1]], [1, C.couverture[0]]]), "queueDefs");
    function patte(hip, foot, col, D = [1, 0.12], N2 = [0, 0.35]) {
      const [fx, fy] = foot;
      const toe = /* @__PURE__ */ __name((dx, dy) => stroke(`M${r22(fx)},${r22(fy - 0.5)} l${r22(dx)},${r22(dy)}`, 1.7, OUT) + stroke(`M${r22(fx)},${r22(fy - 0.5)} l${r22(dx)},${r22(dy)}`, 0.75, col), "toe");
      const at = /* @__PURE__ */ __name((t) => [hip[0] + (fx - hip[0]) * t, hip[1] + (fy - 0.6 - hip[1]) * t], "at");
      const sp = at(0.72);
      return contact(fx + 0.4 * D[0], 1.5) + limb(hip, [fx, fy - 0.6], 1.2, col) + P(`M${f2p([sp[0] - 0.3 * D[0], sp[1] - 0.25])} L${f2p([sp[0] - 1.1 * D[0], sp[1] + 0.05 - 0.6 * D[1]])} L${f2p([sp[0] - 0.3 * D[0], sp[1] + 0.35])} Z`, col, 0.5) + [0.45, 0.6, 0.85].map((t) => {
        const q = at(t);
        return stroke(`M${r22(q[0] - 0.4)},${r22(q[1])} L${r22(q[0] + 0.4)},${r22(q[1] + 0.16)}`, 0.24, "rgba(60,40,25,.4)");
      }).join("") + toe(D[0] * 1.5 - N2[0], D[1] * 1.5 - N2[1] + 0.25) + toe(D[0] * 1.9, D[1] * 1.9 + 0.45) + toe(D[0] * 1.4 + N2[0], D[1] * 1.4 + N2[1] + 0.55) + toe(-D[0] * 1, -D[1] * 1 - 0.05);
    }
    __name(patte, "patte");
    function crete(hx, hy, hr, k, g, sq = 1) {
      const top = /* @__PURE__ */ __name((dx) => hy - Math.sqrt(Math.max(0, hr * hr - dx * dx)) + 1.6, "top");
      const X = /* @__PURE__ */ __name((dx) => hx + dx * k * sq, "X");
      const creux = [[2.7, 1.6], [1.5, 2.85], [0.3, 3.3], [-0.9, 3.3], [-2.1, 2.85], [-3.2, 1.8]];
      const V = /* @__PURE__ */ __name(([dx, h]) => [X(dx), top(dx) - h], "V");
      let d = `M${f2p([X(2.85), top(2.85) + 0.6])} L${f2p(V(creux[0]))}`;
      for (let i = 1; i < creux.length; i++) d += ` A${r22(0.7 * sq)},1.1 0 1,0 ${f2p(V(creux[i]))}`;
      d += ` Q${f2p([X(-3.8), top(-3.2) - 1.3])} ${f2p([X(-3.6), top(-3.2) + 0.2])} L${f2p([X(-2.8), top(-2.8) + 0.8])} Z`;
      const hi = [1, 2, 3].map((i) => {
        const [a, b] = [V(creux[i]), V(creux[i + 1])];
        return E((a[0] + b[0]) / 2 + 0.08 * k, (a[1] + b[1]) / 2 - 0.75, 0.24 * sq + 0.06, 0.42, "rgba(255,224,208,.75)", 0);
      }).join("");
      return P(d, url(`${g}cr`), 0.7) + clip(`${g}crc`, d, hi) + P(d, "none", 0.7);
    }
    __name(crete, "crete");
    var creteDef = /* @__PURE__ */ __name((g) => lin(`${g}cr`, [0, 0, 0, 1], [[0, C.crete[0]], [0.45, C.crete[1]], [1, C.crete[2]]]), "creteDef");
    var barbillons = /* @__PURE__ */ __name((x, y, sw, g) => E(x - 0.45 + sw * 0.6, y - 0.35, 0.45, 0.75, C.crete[2], 0.55) + E(x + sw, y - 0.15, 0.58, 0.95, url(`${g}cr`), 0.65) + E(x - 0.12 + sw, y - 0.5, 0.18, 0.3, "rgba(255,220,200,.7)", 0), "barbillons");
    var note = /* @__PURE__ */ __name((x, y, k = 1) => E(x, y, 0.75 * k, 0.55 * k, C.note, 0.5) + stroke(`M${r22(x + 0.65 * k)},${r22(y - 0.1)} L${r22(x + 0.65 * k)},${r22(y - 2.6 * k)} Q${r22(x + 1.5 * k)},${r22(y - 2.2 * k)} ${r22(x + 1.6 * k)},${r22(y - 1.3 * k)}`, 0.5, OUT), "note");
    var notes = /* @__PURE__ */ __name((x, y) => note(x, y, 1) + note(x + 2.2, y - 1.6, 0.85), "notes");
    function bec(x0, y0, ouvert, g) {
      if (ouvert) return P(`M${f2p([x0, y0 - 0.2])} L${f2p([x0 + 2.2, y0 - 1.05])} L${f2p([x0 + 1.9, y0 + 1.15])} Z`, C.bouche, 0.5) + P(`M${f2p([x0 - 0.3, y0 - 1.05])} Q${f2p([x0 + 1.3, y0 - 1.75])} ${f2p([x0 + 2.45, y0 - 1.25])} L${f2p([x0 + 0.25, y0 - 0.15])} Z`, url(`${g}be`), 0.7) + P(`M${f2p([x0 + 0.1, y0 + 0.2])} L${f2p([x0 + 2.05, y0 + 1.3])} Q${f2p([x0 + 0.9, y0 + 1.6])} ${f2p([x0 - 0.25, y0 + 1.05])} Z`, url(`${g}be`), 0.7);
      return P(`M${f2p([x0 - 0.3, y0 - 1.05])} Q${f2p([x0 + 1.5, y0 - 1.15])} ${f2p([x0 + 2.4, y0 + 0.45])} Q${f2p([x0 + 1.3, y0 + 1.15])} ${f2p([x0 - 0.25, y0 + 1])} Z`, url(`${g}be`), 0.75) + stroke(`M${f2p([x0 + 0.05, y0 + 0.2])} L${f2p([x0 + 1.95, y0 + 0.42])}`, 0.32, OUT) + E(x0 + 0.55, y0 - 0.45, 0.17, 0.12, OUT, 0);
    }
    __name(bec, "bec");
    var becDef = /* @__PURE__ */ __name((g) => lin(`${g}be`, [0, 0, 0, 1], [[0, C.bec[0]], [0.55, C.bec[1]], [1, C.bec[2]]]), "becDef");
    function camail(a, b, c, d, n, g, k = 1, sw = 0.85) {
      let edge = "";
      for (let i = 1; i <= n; i++) {
        const t0 = (i - 0.5) / n, t1 = i / n;
        const tip = [b[0] + (c[0] - b[0]) * t0, b[1] + (c[1] - b[1]) * t0 + 1.35];
        const v = [b[0] + (c[0] - b[0]) * t1, b[1] + (c[1] - b[1]) * t1];
        edge += ` Q${f2p([tip[0] - 0.25 * k, tip[1] - 0.5])} ${f2p(tip)} Q${f2p([tip[0] + 0.15 * k, tip[1] - 0.6])} ${f2p(v)}`;
      }
      const dd = `M${f2p(a)} Q${f2p([(a[0] + b[0]) / 2 - 0.9 * k, (a[1] + b[1]) / 2])} ${f2p(b)}${edge} Q${f2p([(c[0] + d[0]) / 2 + 0.7 * k, (c[1] + d[1]) / 2])} ${f2p(d)} Z`;
      const lines = [0.2, 0.45, 0.7].map((t) => {
        const tip = [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t + 0.9];
        const top = [a[0] + (d[0] - a[0]) * t, a[1] + (d[1] - a[1]) * t + 1.2];
        return stroke(`M${f2p(top)} Q${f2p([(top[0] + tip[0]) / 2 + 0.3 * k, (top[1] + tip[1]) / 2])} ${f2p(tip)}`, 0.32, C.plumeCamail);
      }).join("");
      return P(dd, url(`${g}ca`), sw) + clip(`${g}cac`, dd, lines) + P(dd, "none", sw);
    }
    __name(camail, "camail");
    var camailDef = /* @__PURE__ */ __name((g) => lin(`${g}ca`, [0, 0, 0, 1], [[0, C.camail[0]], [0.5, C.camail[1]], [1, C.camail[2]]]), "camailDef");
    var selle = /* @__PURE__ */ __name((o, k, g) => [[-0.2, 1, 2.1, 2.6], [0.6, 1.3, 2.6, 3.4], [1.4, 1.6, 2.9, 3.9]].map(([dx, a, b, c]) => ruban([o[0] - dx * k, o[1]], [o[0] - (dx + a) * k, o[1] + 0.6], [o[0] - (dx + b) * k, o[1] + 1.6], [o[0] - (dx + c) * k, o[1] + 3.1], 0.95, 0.15, url(`${g}ca`), 0.55, 10)).join(""), "selle");
    var corpsDefs = /* @__PURE__ */ __name((g) => rad(`${g}co`, ["35%", "28%", "75%"], [[0, C.dos[0]], [0.55, C.dos[1]], [1, C.dos[2]]]) + rad(`${g}po`, ["40%", "30%", "70%"], [[0, C.poitrail[0]], [0.6, C.poitrail[1]], [1, C.poitrail[2]]]) + rad(`${g}te`, ["38%", "30%", "72%"], [[0, C.tete[0]], [0.6, C.tete[1]], [1, C.tete[2]]]), "corpsDefs");
    function corps(d, g, poitrail, reflet) {
      return P(d, url(`${g}co`), 1.05) + clip(`${g}cb`, d, poitrail + reflet) + P(d, "none", 1.05);
    }
    __name(corps, "corps");
    function aile(a, b, h, g) {
      const dx = b[0] - a[0], dy = b[1] - a[1], pt = /* @__PURE__ */ __name((t, v) => [a[0] + dx * t, a[1] + dy * t + h * v], "pt");
      return Bt2.ailePlume(a, b, h, C.aile, `${g}ai`) + stroke(`M${f2p(pt(0.12, 0.22))} Q${f2p(pt(0.45, 0.42))} ${f2p(pt(0.8, 0.34))}`, 0.95, C.barre) + stroke(`M${f2p(pt(0.18, 0.12))} Q${f2p(pt(0.45, 0.3))} ${f2p(pt(0.72, 0.24))}`, 0.3, C.reflet).replace("/>", ' opacity="0.6"/>');
    }
    __name(aile, "aile");
    function profil2(pose) {
      const g = `coq-profil-${pose}-`;
      const walk = pose === "marche1" || pose === "marche2", chant = pose === "joie";
      const ph = pose === "marche2" ? -1 : 1, bob = pose === "marche2" ? -0.35 : 0;
      const mode = pose === "clignement" ? "blink" : chant ? "joy" : "open";
      const bx = -0.9, by = -6.7 + bob, brx = 5.3, bry = 4.7, ang = -0.12;
      const hr = 3.6;
      const [hx, hy] = chant ? [3, -13.5 + bob] : [3.55, -12.7 + bob + (walk ? ph * 0.3 : 0)];
      const tilt = chant ? -24 : 0;
      const body = ovale(bx, by, brx, bry, ang);
      let s = defs(corpsDefs(g) + queueDefs(g, [1, 1, 0, 0]) + creteDef(g) + becDef(g) + camailDef(g));
      s += E(bx + 0.5, -0.15, 5, 1.25, SH, 0);
      for (const [i, x] of [[1, bx - 0.6], [0, bx + 1.2]]) {
        const dx = walk ? (i ? -ph : ph) * 1.15 : 0, lift = walk && (i ? -ph : ph) < 0 ? -0.35 : 0;
        s += patte([x, by + bry * 0.55], [x + dx + 0.2, lift], i ? C.patteLoin : C.patte);
      }
      s += queue([bx - brx * 0.7, by - bry * 0.42], 1, 1, walk ? ph * 0.45 : 0, g, 0.92);
      if (chant) s += P(`M${f2p([bx + 1.6, by - 2.6])} Q${f2p([bx - 1.4, by - 6.4])} ${f2p([bx - 4.6, by - 4.4])} Q${f2p([bx - 2.2, by - 3.6])} ${f2p([bx - 0.4, by - 2])} Z`, tone(C.aile, 0.78), 0.8);
      const breast = `<ellipse cx="${r22(bx + brx * 0.55)}" cy="${r22(by + bry * 0.25)}" rx="${r22(brx * 0.62)}" ry="${r22(bry * 0.95)}" fill="${url(`${g}po`)}"/>`;
      const shine = stroke(`M${f2p([bx - brx * 0.55, by - bry * 0.55])} Q${f2p([bx - brx * 0.1, by - bry * 1])} ${f2p([bx + brx * 0.35, by - bry * 0.95])}`, 0.55, "rgba(255,230,190,.55)");
      s += corps(body, g, breast, shine);
      s += selle([bx - brx * 0.25, by - bry * 0.88], 1, g);
      const wa = [bx + brx * 0.38, by - bry * 0.22], wb = [bx - brx * 0.82, by + bry * 0.2];
      const wing = aile(wa, wb, bry * 0.82, g);
      s += chant ? `<g transform="rotate(-14 ${r22(wa[0])} ${r22(wa[1])})">${wing}</g>` : wing;
      s += camail([hx - hr * 0.98, hy + 0.5], [bx - 0.4, by - bry * 0.62], [bx + brx * 0.9, by - bry * 0.32], [hx + hr * 0.5, hy + hr * 0.9], 5, g);
      let h = crete(hx, hy, hr, 1, g);
      h += E(hx, hy, hr, hr, url(`${g}te`), 1.05);
      h += stroke(`M${f2p([hx - hr * 0.72, hy - hr * 0.2])} Q${f2p([hx - hr * 0.55, hy - hr * 0.7])} ${f2p([hx - hr * 0.1, hy - hr * 0.78])}`, 0.5, "rgba(255,240,210,.7)");
      h += E(hx + 0.75, hy + 1.05, 0.85, 0.42, C.joue, 0);
      const x0 = hx + hr * 0.84, y0 = hy + 0.3;
      h += barbillons(x0 + 0.35, y0 + 2, walk ? -ph * 0.2 : 0, g);
      h += bec(x0, y0, chant, g);
      h += eye(hx + 0.95, hy - 0.55, 1.02, mode);
      s += tilt ? `<g transform="rotate(${tilt} ${r22(hx)} ${r22(hy)})">${h}</g>` : h;
      if (chant) s += notes(hx + 5.2, hy - 0.6);
      return s;
    }
    __name(profil2, "profil");
    var tone = /* @__PURE__ */ __name((hex, k) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, "0")).join("").toUpperCase(), "tone");
    function trois(view, pose) {
      const se = view === "avant";
      const g = `coq-${view}-${pose}-`;
      const walk = pose === "marche1" || pose === "marche2", chant = se && pose === "joie";
      const ph = pose === "marche2" ? -1 : 1, bob = pose === "marche2" ? -0.35 : 0;
      const mode = pose === "clignement" ? "blink" : chant ? "joy" : "open";
      const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
      const by = -6.7 + bob, rx = 4.7, ry = 4.8, ang = se ? -0.05 : -0.22, egg = se ? 0.1 : -0.1;
      const at = /* @__PURE__ */ __name((u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang), "at");
      const hr = se ? 3.65 : 3.5;
      const [hx, hy] = chant ? [2.3, -13.4 + bob] : se ? [2.6, -12.5 + bob + (walk ? ph * 0.3 : 0)] : [2.2, -12.9 + bob + (walk ? ph * 0.3 : 0)];
      const body = (() => {
        const pts = [];
        for (let i = 0; i < 30; i++) {
          const t = i / 30 * Math.PI * 2;
          pts.push(at(Math.cos(t), Math.sin(t)));
        }
        return `M${pts.map(f2p).join(" L")} Z`;
      })();
      const D = se ? [0.86, 0.42] : [0.82, -0.32], N2 = se ? [-0.55, 0.3] : [0.55, 0.3];
      const leg = /* @__PURE__ */ __name((near) => {
        const sw = 1.25 * (near ? 1 : -1), st = walk ? (near ? ph : -ph) * 0.9 : 0;
        const fx = S[0] * sw + F[0] * st, fy = Math.min(0.5, (S[1] * sw + F[1] * st) * 0.62) + (walk && (near ? ph : -ph) < 0 ? -0.3 : 0);
        const hip = [S[0] * sw * 0.6, by + ry * (near ? 0.62 : 0.5) + S[1] * sw * 0.4];
        return patte(hip, [fx, fy], near ? C.patte : C.patteLoin, D, N2);
      }, "leg");
      let s = defs(corpsDefs(g) + queueDefs(g, se ? [1, 1, 0, 0] : [1, 1, 0, 0]) + creteDef(g) + becDef(g) + camailDef(g));
      s += `<ellipse cx="0" cy="0.2" rx="${r22(rx * 1.1)}" ry="1.6" fill="${SH}"/>`;
      s += leg(false);
      const head = /* @__PURE__ */ __name(() => {
        let h = crete(hx - (se ? 0.3 : -0.2), hy + (se ? 0 : 0.25), hr, 1, g, se ? 0.8 : 0.7);
        h += E(hx, hy, hr, hr, url(`${g}te`), 1.05);
        if (se) {
          h += stroke(`M${f2p([hx - hr * 0.78, hy - hr * 0.15])} Q${f2p([hx - hr * 0.62, hy - hr * 0.62])} ${f2p([hx - hr * 0.25, hy - hr * 0.72])}`, 0.5, "rgba(255,240,210,.7)");
          h += E(hx - hr * 0.48, hy + 0.75, 0.8, 0.4, C.joue, 0) + E(hx + hr * 0.6, hy + 0.5, 0.6, 0.32, C.joue, 0);
          h += eye(hx - hr * 0.32, hy - 0.45, 1, mode) + eye(hx + hr * 0.36, hy - 0.7, 0.85, mode);
          const bx0 = hx + hr * 0.4, by0 = hy + hr * 0.22, L1 = 2.7, w = 1.35;
          const dir = chant ? [0.9, -0.42] : [0.84, 0.54], nrm = [-dir[1], dir[0]], tip = [bx0 + dir[0] * L1, by0 + dir[1] * L1];
          h += E(bx0 - 0.3 + (walk ? -ph * 0.15 : 0), by0 + 1.75, 0.48, 0.78, C.crete[2], 0.55) + E(bx0 + 1.1 + (walk ? -ph * 0.15 : 0), by0 + 2.05, 0.55, 0.85, url(`${g}cr`), 0.6);
          if (chant) {
            const low = [bx0 + 0.6 * L1, by0 + 0.75 * L1];
            h += P(`M${f2p([bx0 + nrm[0] * w * 0.2, by0 + nrm[1] * w * 0.2])} L${f2p(tip)} L${f2p(low)} Z`, C.bouche, 0.5) + P(`M${f2p([bx0 - nrm[0] * w, by0 - nrm[1] * w])} L${f2p(tip)} L${f2p([bx0 + nrm[0] * 0.2, by0 + nrm[1] * 0.2])} Z`, C.bec[1], 0.55) + P(`M${f2p([bx0 + 0.1, by0 + 0.35])} L${f2p(low)} L${f2p([bx0 - 0.3, by0 + w])} Z`, C.bec[1], 0.55);
          } else h += P(`M${f2p([bx0 - nrm[0] * w, by0 - nrm[1] * w])} L${f2p(tip)} L${f2p([bx0 + nrm[0] * w, by0 + nrm[1] * w])} Z`, C.bec[1], 0.55) + stroke(`M${f2p([bx0, by0])} L${f2p([tip[0] - dir[0] * 0.3, tip[1] - dir[1] * 0.3])}`, 0.3, OUT) + stroke(`M${f2p([bx0 - nrm[0] * w * 0.6, by0 - nrm[1] * w * 0.6])} L${f2p([bx0 + dir[0] * 1.2 - nrm[0] * 0.5, by0 + dir[1] * 1.2 - nrm[1] * 0.5])}`, 0.35, C.bec[0]);
        } else {
          const nuque = `M${f2p([hx - hr, hy])} a${r22(hr)},${r22(hr)} 0 1,0 ${r22(2 * hr)},0 a${r22(hr)},${r22(hr)} 0 1,0 ${r22(-2 * hr)},0 Z`;
          h += clip(`${g}nq`, nuque, `<ellipse cx="${r22(hx + hr * 0.35)}" cy="${r22(hy + hr * 0.55)}" rx="${r22(hr * 0.95)}" ry="${r22(hr * 0.7)}" fill="${C.camail[2]}" opacity="0.45"/>`) + P(nuque, "none", 1.05);
          h += E(hx + hr * 0.92, hy + 1.2, 0.6, 0.95, C.crete[2], 0.55);
          h += P(`M${f2p([hx + hr * 0.8, hy - 0.4])} L${f2p([hx + hr * 0.8 + 1.7, hy + 0.1])} L${f2p([hx + hr * 0.84, hy + 0.85])} Z`, C.bec[1], 0.55);
          h += stroke(`M${f2p([hx - hr * 0.75, hy - hr * 0.1])} Q${f2p([hx - hr * 0.6, hy - hr * 0.6])} ${f2p([hx - hr * 0.2, hy - hr * 0.7])}`, 0.5, "rgba(255,240,210,.6)");
        }
        return chant ? `<g transform="rotate(-20 ${r22(hx)} ${r22(hy)})">${h}</g>` : h;
      }, "head");
      const tail = /* @__PURE__ */ __name(() => queue(se ? at(-0.8, -0.5) : at(-0.72, -0.15), 1, se ? 1 : 0.95, walk ? ph * 0.4 : 0, g, se ? 0.82 : 0.72), "tail");
      if (se) s += tail();
      if (chant) {
        const a = at(0.2, -0.75), b = at(1.25, -0.95);
        s += P(`M${f2p(a)} Q${f2p([b[0] - 0.4, b[1] - 2.4])} ${f2p([b[0] + 1.2, b[1] - 0.6])} Q${f2p([b[0], b[1] + 0.9])} ${f2p(at(0.6, -0.2))} Z`, tone(C.aile, 0.8), 0.8);
      }
      const pc = se ? at(0.42, 0.18) : at(0.1, 0.65);
      const breast = `<ellipse cx="${r22(pc[0])}" cy="${r22(pc[1])}" rx="${r22(rx * (se ? 0.72 : 0.6))}" ry="${r22(ry * (se ? 0.85 : 0.45))}" fill="${url(`${g}po`)}"${se ? "" : ' opacity="0.75"'}/>`;
      const sh0 = at(-0.6, -0.55), sh1 = at(-0.1, -0.98), sh2 = at(0.35, -0.92);
      s += corps(body, g, breast, stroke(`M${f2p(sh0)} Q${f2p(sh1)} ${f2p(sh2)}`, 0.55, "rgba(255,230,190,.55)"));
      s += selle(se ? at(-0.4, -0.85) : at(-0.3, -0.8), 1, g);
      {
        const wingUp = walk && ph < 0 ? -0.5 : 0;
        const wing = se ? aile(at(0.35, -0.2).map((n, k) => n + (k ? wingUp : 0)), at(-0.8, 0.08), ry * 0.74, g) : aile(at(0.55, -0.3).map((n, k) => n + (k ? wingUp : 0)), at(-0.45, 0.3), ry * 0.7, g);
        const a = se ? at(0.35, -0.2) : at(0.55, -0.3);
        s += chant ? `<g transform="rotate(16 ${r22(a[0])} ${r22(a[1])})">${wing}</g>` : wing;
      }
      s += se ? camail([hx - hr * 0.95, hy + 0.5], at(-0.25, -0.88), at(0.78, -0.5), [hx + hr * 0.75, hy + hr * 0.75], 5, g) : camail([hx - hr * 0.92, hy + 0.2], at(-0.2, -0.95), at(0.7, -0.72), [hx + hr * 0.9, hy + 0.7], 5, g);
      s += head();
      s += leg(true);
      if (!se) s += tail();
      if (chant) s += notes(hx + 4.6, hy - 1.4);
      return s;
    }
    __name(trois, "trois");
    var ICONE_K = 1.85;
    var ICONE_O = [16.26, 14.66];
    function icone() {
      const g = "coq-icone-", k = 1 / ICONE_K, hr = 3.45;
      let s = defs(corpsDefs(g) + queueDefs(g, [1, 1, 0, 0]) + creteDef(g) + becDef(g) + camailDef(g));
      const epaules = `M${f2p([-5.6, 8.2])} Q${f2p([-5.8, 4.4])} ${f2p([-1.2, 4.1])} Q${f2p([4.4, 4])} ${f2p([5, 8.2])} Z`;
      let b = P(epaules, url(`${g}co`), 1.3 * k) + clip(`${g}icp`, epaules, `<ellipse cx="2.6" cy="7.6" rx="3" ry="2.6" fill="${url(`${g}po`)}"/>`) + P(epaules, "none", 1.3 * k);
      b += camail([-hr * 0.95, 0.6], [-4.3, 5.2], [3.8, 5.4], [hr * 0.6, hr * 0.85], 5, g, 1, 1.3 * k);
      b += crete(0, 0, hr, 1, g);
      b += E(0, 0, hr, hr, url(`${g}te`), 1.3 * k);
      b += stroke(`M${f2p([-hr * 0.72, -hr * 0.2])} Q${f2p([-hr * 0.55, -hr * 0.7])} ${f2p([-hr * 0.1, -hr * 0.78])}`, 0.42, "rgba(255,240,210,.75)");
      b += E(0.75, 1.05, 0.85, 0.42, C.joue, 0);
      const x0 = hr * 0.84, y0 = 0.3;
      b += barbillons(x0 + 0.35, y0 + 2, 0, g);
      b += bec(x0, y0, false, g);
      b += eye(0.95, -0.55, 1.02, "open");
      return s + `<g transform="translate(${ICONE_O.join(" ")}) scale(${ICONE_K})">${b}</g>`;
    }
    __name(icone, "icone");
    module.exports = { profil: profil2, trois, icone, C, ruban, queue };
  }
});

// atelier/betes_liste.js
var require_betes_liste = __commonJS({
  "atelier/betes_liste.js"(exports, module) {
    var Bt2 = require_betes();
    var V = require_egares_voile();
    var B = require_betes_brume();
    var Coq = require_coq();
    var WALK = ["marche1", "marche2", "repos", "clignement", "joie"];
    var FLY = ["vol1", "vol2", "repos", "joie"];
    var q = /* @__PURE__ */ __name((id, v) => {
      const c = Bt2.Q[id](v);
      return [c.size, WALK, (p) => Bt2.quad(c, p)];
    }, "q");
    var b = /* @__PURE__ */ __name((id, v) => {
      const c = Bt2.B[id](v);
      return [c.size, WALK, (p) => Bt2.bird(c, p)];
    }, "b");
    var PET = ["assis1", "assis2", "dodo1", "dodo2"];
    var pet = /* @__PURE__ */ __name((id, v) => {
      const c = Bt2.Q[id](v);
      return [c.size, [...WALK, ...PET], (p) => PET.includes(p) ? Bt2.petPose(c, p) : Bt2.quad(c, p)];
    }, "pet");
    var PROFILS2 = [
      ["ferme", "poule_rousse", "Poule rousse", ...b("hen", "rousse")],
      ["ferme", "poule_blanche", "Poule blanche", ...b("hen", "blanche")],
      ["ferme", "poule_noire", "Poule noire", ...b("hen", "noire")],
      ["ferme", "poule_grise", "Poule grise", ...b("hen", "grise")],
      ["ferme", "poussin", "Poussin", ...b("chick")],
      ["ferme", "coq", "Coq", "SMALL", WALK, (p) => Coq.profil(p)],
      ["ferme", "vache", "Vache", ...q("cow")],
      ["ferme", "vache_rousse", "Vache rousse", ...q("cow", "rousse")],
      ["ferme", "mouton", "Mouton", ...q("sheep")],
      ["ferme", "mouton_noir", "Mouton noir", ...q("sheep", "noir")],
      ["ferme", "cochon", "Cochon", ...q("pig")],
      ["ferme", "cochon_tachete", "Cochon tacheté", ...q("pig", "tachete")],
      ["ferme", "chevre", "Chèvre", ...q("goat")],
      ["ferme", "chevre_brune", "Chèvre brune", ...q("goat", "brune")],
      ["ferme", "chat", "Chat", ...pet("cat")],
      ["ferme", "chien", "Chien", ...pet("dog")],
      ["ferme", "chat_noir", "Chat noir", ...pet("cat", "noir")],
      ["ferme", "chat_gris", "Chat gris tigré", ...pet("cat", "gris")],
      ["ferme", "chat_blanc", "Chat blanc taché", ...pet("cat", "blanc")],
      ["ferme", "chien_noir", "Chien noir et blanc", ...pet("dog", "noir")],
      ["ferme", "chien_brun", "Chien brun", ...pet("dog", "brun")],
      ["ferme", "chien_roux", "Chien roux", ...pet("dog", "roux")],
      ["bois", "cerf", "Cerf", ...q("deer")],
      ["bois", "renard", "Renard", ...q("fox")],
      ["bois", "lapin", "Lapin", ...q("rabbit")],
      ["bois", "herisson", "Hérisson", ...q("hedgehog")],
      ["bois", "ecureuil", "Écureuil", ...q("squirrel")],
      ["bois", "loutre", "Loutre", ...q("otter")],
      ["eau", "heron", "Héron", ...b("heron")],
      ...["orange", "blanc", "or"].map((v) => ["eau", `koi_${v}`, `Koï ${v}`, "KOI", ["nage1", "nage2", "joie"], (p) => Bt2.koi(v, p)]),
      ["climat", "renard_polaire", "Renard polaire (cimes)", ...q("snowFox")],
      ["climat", "bouquetin", "Bouquetin (cimes)", ...q("ibex")],
      ["climat", "macareux", "Macareux (landes)", ...b("puffin")],
      ["climat", "poney", "Poney (landes)", ...q("pony")],
      ["climat", "grenouille", "Grenouille (marais)", ...q("frog")],
      ["climat", "tortue", "Tortue (marais)", ...q("tortoise")],
      ["climat", "fennec", "Fennec (dunes)", ...q("fennec")],
      ["climat", "chameau", "Chameau (dunes)", ...q("camel")],
      ["climat", "cameleon", "Caméléon (jungle)", ...q("chameleon")],
      ["climat", "toucan", "Toucan (jungle)", ...b("toucan")],
      ["climat", "salamandre", "Salamandre (volcan)", ...q("salamander")],
      ["climat", "corbeau", "Corbeau (volcan)", ...b("crow")],
      ["bestiaire", "mesange", "Mésange", ...b("bird")],
      ...["jaune", "bleu", "lune"].map((v) => ["bestiaire", `papillon_${v}`, `Papillon ${v}`, "BUTTERFLY", FLY, (p) => Bt2.butterfly(v, p)]),
      ["bestiaire", "luciole", "Luciole", "FIREFLY", ["vol1", "vol2", "joie"], (p) => Bt2.firefly(p)],
      ["bestiaire", "abeille", "Abeille", "BEE", FLY, (p) => Bt2.bee(p)],
      ["bestiaire", "hibou", "Hibou (de face)", "OWL", WALK, (p) => Bt2.owl(p)],
      ["bestiaire", "meduse", "Méduse", "JELLY", ["0", "1"], (p) => Bt2.jelly(+p)],
      ["familiers", "tictac", "Tic-Tac (abeille mécanique de Rivet)", "TICTAC", FLY, (p) => Bt2.bee(p, true)],
      ["familiers", "amie_tictac", "L'amie de Tic-Tac (Rivet la fabrique quand on écrit Abeille)", "TICTAC", FLY, (p) => Bt2.beeFriend(p)],
      ["familiers", "mousse", "Mousse (renardeau de Sylve)", ...q("kit")],
      ["familiers", "bocal_vide", "Bocal d'Ondin (vide)", "BOWL", ["0"], () => Bt2.bowl("vide", 0)],
      ["familiers", "bocal_bulle", "Bocal d'Ondin (Bulle revenu)", "BOWL", ["0", "1"], (p) => Bt2.bowl("bulle", +p)],
      ["mer", "dauphin", "Dauphin", "DOLPHIN", ["0", "1", "2"], (p) => Bt2.dolphin(+p)],
      ["mer", "baleine_dos", "Baleine (dos qui souffle)", "WHALE_BACK", ["0", "1"], (p) => Bt2.whaleBack(+p)],
      ["mer", "baleine_queue", "Baleine (queue)", "WHALE_FLUKE", ["0", "1"], (p) => Bt2.whaleFluke(+p)],
      ...["sardine", "dorade", "volant"].map((v) => ["mer", `poisson_${v}`, `Poisson ${v === "volant" ? "volant" : v}`, "FISH", ["0", "1"], (p) => Bt2.fish(v, +p)]),
      ["mer", "mouette", "Mouette", ...b("gull")],
      ["mer", "mouette_vol", "Mouette en vol (envol, vol, plané)", "GULL_FLY", ["envol1", "envol2", "envol3", "vol1", "vol2", "vol3", "vol4", "plane"], (p) => Bt2.gullFly(p)]
    ];
    var AVANT = ["marche1", "marche2", "repos", "clignement", "joie"];
    var DOS = ["marche1", "marche2", "repos"];
    var q3 = /* @__PURE__ */ __name((id, v) => ({ c: Bt2.Q[id](v), bird: false }), "q3");
    var b3 = /* @__PURE__ */ __name((id, v) => ({ c: Bt2.B[id](v), bird: true }), "b3");
    var pet3 = /* @__PURE__ */ __name((id, v) => ({ c: Bt2.Q[id](v), bird: false, pet: true }), "pet3");
    var ORIENTEES2 = [
      ["ferme", "poule_rousse", "Poule rousse", b3("hen", "rousse")],
      ["ferme", "poule_blanche", "Poule blanche", b3("hen", "blanche")],
      ["ferme", "poule_noire", "Poule noire", b3("hen", "noire")],
      ["ferme", "poule_grise", "Poule grise", b3("hen", "grise")],
      ["ferme", "poussin", "Poussin", b3("chick")],
      ["ferme", "coq", "Coq", { c: { id: "coq", size: "SMALL" }, bird: true, dessin: Coq.trois, profil: Coq.profil, cadre: [-15, -22.5, 30, 25.5] }],
      ["ferme", "vache", "Vache", q3("cow")],
      ["ferme", "vache_rousse", "Vache rousse", q3("cow", "rousse")],
      ["ferme", "mouton", "Mouton", q3("sheep")],
      ["ferme", "mouton_noir", "Mouton noir", q3("sheep", "noir")],
      ["ferme", "cochon", "Cochon", q3("pig")],
      ["ferme", "cochon_tachete", "Cochon tacheté", q3("pig", "tachete")],
      ["ferme", "chevre", "Chèvre", q3("goat")],
      ["ferme", "chevre_brune", "Chèvre brune", q3("goat", "brune")],
      ["ferme", "chat", "Chat", pet3("cat")],
      ["ferme", "chien", "Chien", pet3("dog")],
      ["ferme", "chat_noir", "Chat noir", pet3("cat", "noir")],
      ["ferme", "chat_gris", "Chat gris tigré", pet3("cat", "gris")],
      ["ferme", "chat_blanc", "Chat blanc taché", pet3("cat", "blanc")],
      ["ferme", "chien_noir", "Chien noir et blanc", pet3("dog", "noir")],
      ["ferme", "chien_brun", "Chien brun", pet3("dog", "brun")],
      ["ferme", "chien_roux", "Chien roux", pet3("dog", "roux")],
      ["bois", "cerf", "Cerf", q3("deer")],
      ["bois", "renard", "Renard", q3("fox")],
      ["bois", "lapin", "Lapin", q3("rabbit")],
      ["bois", "herisson", "Hérisson", q3("hedgehog")],
      ["bois", "ecureuil", "Écureuil", q3("squirrel")],
      ["bois", "loutre", "Loutre", q3("otter")],
      ["eau", "heron", "Héron", b3("heron")],
      ["climat", "renard_polaire", "Renard polaire (cimes)", q3("snowFox")],
      ["climat", "bouquetin", "Bouquetin (cimes)", q3("ibex")],
      ["climat", "macareux", "Macareux (landes)", b3("puffin")],
      ["climat", "poney", "Poney (landes)", q3("pony")],
      ["climat", "grenouille", "Grenouille (marais)", q3("frog")],
      ["climat", "tortue", "Tortue (marais)", q3("tortoise")],
      ["climat", "fennec", "Fennec (dunes)", q3("fennec")],
      ["climat", "chameau", "Chameau (dunes)", q3("camel")],
      ["climat", "cameleon", "Caméléon (jungle)", q3("chameleon")],
      ["climat", "toucan", "Toucan (jungle)", b3("toucan")],
      ["climat", "salamandre", "Salamandre (volcan)", q3("salamander")],
      ["climat", "corbeau", "Corbeau (volcan)", b3("crow")],
      ["bestiaire", "mesange", "Mésange", b3("bird")],
      ["familiers", "mousse", "Mousse (renardeau de Sylve)", q3("kit")],
      ["mer", "mouette", "Mouette", b3("gull")]
    ];
    var EGARES2 = [
      ...V.EGARES_VOILE.map(([sujet, nom, dessin, plus, cle]) => [sujet, nom, (v, p) => dessin(`${cle || sujet}-${v}-${p}-`, v, p), null, cle || sujet, plus]),
      ...B.BETES_BRUME.map(([climat, nom, dessin]) => {
        const sujet = nom.split(" (")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ /g, "-");
        return [sujet, nom, (v, p) => dessin(`${sujet}-${v}-${p}-`, v, p), climat, sujet, []];
      })
    ];
    var ICONES2 = [["ferme", "coq", () => Coq.icone()]];
    module.exports = { WALK, FLY, PET, PROFILS: PROFILS2, AVANT, DOS, ORIENTEES: ORIENTEES2, EGARES: EGARES2, ICONES: ICONES2 };
  }
});

// atelier/noms_betes.js
var require_noms_betes = __commonJS({
  "atelier/noms_betes.js"(exports, module) {
    var hyph2 = /* @__PURE__ */ __name((s) => s.replace(/_/g, "-"), "hyph");
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
        const S = hyph2(sujet);
        const m = rest.match(/^(?:(avant|dos)_)?([a-z]+?)(\d+)?$/);
        if (!m) throw new Error("bête inattendue : " + rel);
        const [, vue, pose, n] = m;
        if (pose === "image" && a === "familiers") return out([top, a, S], n ? `${S}_${n}` : S);
        if (pose === "icone" && !vue && !n) return out([top, a, S], `${S}_icone`);
        const v = vue || (SANS_SENS.has(sujet) || a === "familiers" && sujet.startsWith("bocal") ? "face" : "profil");
        const p = pose === "image" ? "nage" : pose;
        return out([top, a, S], [S, v, p, n].filter(Boolean).join("_"));
      }
      if (top === "egares") {
        const m = base.match(/^([a-z-]+)_(avant|dos)_([a-z]+?)(\d+)?$/);
        if (!m || m[1] !== a) throw new Error("égaré inattendu : " + rel);
        return out([top, a], [m[1], m[2], m[3], m[4]].filter(Boolean).join("_"));
      }
      return null;
    }
    __name(nomBete, "nomBete");
    function vitesseBete(id, pose) {
      const [top, a] = id.split("/");
      if (top === "animaux") return pose === "vol" ? 120 : pose === "assis" ? 500 : pose === "dodo" ? 800 : pose === "nage" && /mer|familiers/.test(a) ? 420 : 260;
      if (top === "egares") return { marche: 240, fuite: 160, bouderie: [500, 700], luciole: [300, 200, 200, 1e3], brume: [220, 220, 900], dort: 1400, terre: 260 }[pose];
      return void 0;
    }
    __name(vitesseBete, "vitesseBete");
    module.exports = { nomBete, vitesseBete };
  }
});

// atelier/generateur_betes.mjs
var import_betes = __toESM(require_betes(), 1);
var import_betes3 = __toESM(require_betes3(), 1);
var import_egares_voile = __toESM(require_egares_voile(), 1);
var import_betes_liste = __toESM(require_betes_liste(), 1);
var import_noms_betes = __toESM(require_noms_betes(), 1);

// bibliotheque/svg/animaux/orientees.json
var orientees_default = {
  _lisez_moi: [
    "Les bêtes qui marchent, dans les directions de la troupe : avant = trois quarts avant (la bête vient vers le bas à droite), dos = trois quarts dos (elle s'éloigne vers le haut à droite) ; le miroir horizontal donne le bas à gauche et le haut à gauche. Le profil (lot B) reste pour aller tout droit à gauche ou à droite.",
    "Ancre (0, 0) au sol sous le milieu de la bête, comme le profil. Le cadre est celui du profil, élargi juste ce qu'il faut (les pieds avant descendent un peu sous l'ancre, la tête avance) : prendre le cadre noté ici.",
    "Images : avant marche1, marche2, repos, clignement, joie (cœur) ; dos marche1, marche2, repos (on ne voit pas le visage). Marche à 260 ms par image, comme le profil.",
    "Les chats et les chiens ont aussi assis1, assis2 (la queue enroulée au sol, son bout se lève ; 500 ms) et dodo1, dodo2 (roulés en boule, ils respirent, un « z » de plus ; 800 ms), dans les deux vues.",
    "Noms rangés à l'assemblage (README, catalogue.json) : <sujet>_<vue>_<pose>_<n>.svg, vues face, avant (l'ancien « trois_quarts »), dos, profil ; les chemins ci-dessous suivent ces noms."
  ],
  betes: {
    "poule-rousse": {
      nom: "Poule rousse",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25.5
      ],
      fichiers: {
        avant: [
          "ferme/poule-rousse/poule-rousse_avant_marche_1.svg",
          "ferme/poule-rousse/poule-rousse_avant_marche_2.svg",
          "ferme/poule-rousse/poule-rousse_avant_repos.svg",
          "ferme/poule-rousse/poule-rousse_avant_clignement.svg",
          "ferme/poule-rousse/poule-rousse_avant_joie.svg"
        ],
        dos: [
          "ferme/poule-rousse/poule-rousse_dos_marche_1.svg",
          "ferme/poule-rousse/poule-rousse_dos_marche_2.svg",
          "ferme/poule-rousse/poule-rousse_dos_repos.svg"
        ]
      }
    },
    "poule-blanche": {
      nom: "Poule blanche",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25.5
      ],
      fichiers: {
        avant: [
          "ferme/poule-blanche/poule-blanche_avant_marche_1.svg",
          "ferme/poule-blanche/poule-blanche_avant_marche_2.svg",
          "ferme/poule-blanche/poule-blanche_avant_repos.svg",
          "ferme/poule-blanche/poule-blanche_avant_clignement.svg",
          "ferme/poule-blanche/poule-blanche_avant_joie.svg"
        ],
        dos: [
          "ferme/poule-blanche/poule-blanche_dos_marche_1.svg",
          "ferme/poule-blanche/poule-blanche_dos_marche_2.svg",
          "ferme/poule-blanche/poule-blanche_dos_repos.svg"
        ]
      }
    },
    "poule-noire": {
      nom: "Poule noire",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25.5
      ],
      fichiers: {
        avant: [
          "ferme/poule-noire/poule-noire_avant_marche_1.svg",
          "ferme/poule-noire/poule-noire_avant_marche_2.svg",
          "ferme/poule-noire/poule-noire_avant_repos.svg",
          "ferme/poule-noire/poule-noire_avant_clignement.svg",
          "ferme/poule-noire/poule-noire_avant_joie.svg"
        ],
        dos: [
          "ferme/poule-noire/poule-noire_dos_marche_1.svg",
          "ferme/poule-noire/poule-noire_dos_marche_2.svg",
          "ferme/poule-noire/poule-noire_dos_repos.svg"
        ]
      }
    },
    "poule-grise": {
      nom: "Poule grise",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25.5
      ],
      fichiers: {
        avant: [
          "ferme/poule-grise/poule-grise_avant_marche_1.svg",
          "ferme/poule-grise/poule-grise_avant_marche_2.svg",
          "ferme/poule-grise/poule-grise_avant_repos.svg",
          "ferme/poule-grise/poule-grise_avant_clignement.svg",
          "ferme/poule-grise/poule-grise_avant_joie.svg"
        ],
        dos: [
          "ferme/poule-grise/poule-grise_dos_marche_1.svg",
          "ferme/poule-grise/poule-grise_dos_marche_2.svg",
          "ferme/poule-grise/poule-grise_dos_repos.svg"
        ]
      }
    },
    poussin: {
      nom: "Poussin",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "ferme/poussin/poussin_avant_marche_1.svg",
          "ferme/poussin/poussin_avant_marche_2.svg",
          "ferme/poussin/poussin_avant_repos.svg",
          "ferme/poussin/poussin_avant_clignement.svg",
          "ferme/poussin/poussin_avant_joie.svg"
        ],
        dos: [
          "ferme/poussin/poussin_dos_marche_1.svg",
          "ferme/poussin/poussin_dos_marche_2.svg",
          "ferme/poussin/poussin_dos_repos.svg"
        ]
      }
    },
    coq: {
      nom: "Coq",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        25.5
      ],
      fichiers: {
        avant: [
          "ferme/coq/coq_avant_marche_1.svg",
          "ferme/coq/coq_avant_marche_2.svg",
          "ferme/coq/coq_avant_repos.svg",
          "ferme/coq/coq_avant_clignement.svg",
          "ferme/coq/coq_avant_joie.svg"
        ],
        dos: [
          "ferme/coq/coq_dos_marche_1.svg",
          "ferme/coq/coq_dos_marche_2.svg",
          "ferme/coq/coq_dos_repos.svg"
        ]
      }
    },
    vache: {
      nom: "Vache",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        35
      ],
      fichiers: {
        avant: [
          "ferme/vache/vache_avant_marche_1.svg",
          "ferme/vache/vache_avant_marche_2.svg",
          "ferme/vache/vache_avant_repos.svg",
          "ferme/vache/vache_avant_clignement.svg",
          "ferme/vache/vache_avant_joie.svg"
        ],
        dos: [
          "ferme/vache/vache_dos_marche_1.svg",
          "ferme/vache/vache_dos_marche_2.svg",
          "ferme/vache/vache_dos_repos.svg"
        ]
      }
    },
    "vache-rousse": {
      nom: "Vache rousse",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        35
      ],
      fichiers: {
        avant: [
          "ferme/vache-rousse/vache-rousse_avant_marche_1.svg",
          "ferme/vache-rousse/vache-rousse_avant_marche_2.svg",
          "ferme/vache-rousse/vache-rousse_avant_repos.svg",
          "ferme/vache-rousse/vache-rousse_avant_clignement.svg",
          "ferme/vache-rousse/vache-rousse_avant_joie.svg"
        ],
        dos: [
          "ferme/vache-rousse/vache-rousse_dos_marche_1.svg",
          "ferme/vache-rousse/vache-rousse_dos_marche_2.svg",
          "ferme/vache-rousse/vache-rousse_dos_repos.svg"
        ]
      }
    },
    mouton: {
      nom: "Mouton",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/mouton/mouton_avant_marche_1.svg",
          "ferme/mouton/mouton_avant_marche_2.svg",
          "ferme/mouton/mouton_avant_repos.svg",
          "ferme/mouton/mouton_avant_clignement.svg",
          "ferme/mouton/mouton_avant_joie.svg"
        ],
        dos: [
          "ferme/mouton/mouton_dos_marche_1.svg",
          "ferme/mouton/mouton_dos_marche_2.svg",
          "ferme/mouton/mouton_dos_repos.svg"
        ]
      }
    },
    "mouton-noir": {
      nom: "Mouton noir",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/mouton-noir/mouton-noir_avant_marche_1.svg",
          "ferme/mouton-noir/mouton-noir_avant_marche_2.svg",
          "ferme/mouton-noir/mouton-noir_avant_repos.svg",
          "ferme/mouton-noir/mouton-noir_avant_clignement.svg",
          "ferme/mouton-noir/mouton-noir_avant_joie.svg"
        ],
        dos: [
          "ferme/mouton-noir/mouton-noir_dos_marche_1.svg",
          "ferme/mouton-noir/mouton-noir_dos_marche_2.svg",
          "ferme/mouton-noir/mouton-noir_dos_repos.svg"
        ]
      }
    },
    cochon: {
      nom: "Cochon",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "ferme/cochon/cochon_avant_marche_1.svg",
          "ferme/cochon/cochon_avant_marche_2.svg",
          "ferme/cochon/cochon_avant_repos.svg",
          "ferme/cochon/cochon_avant_clignement.svg",
          "ferme/cochon/cochon_avant_joie.svg"
        ],
        dos: [
          "ferme/cochon/cochon_dos_marche_1.svg",
          "ferme/cochon/cochon_dos_marche_2.svg",
          "ferme/cochon/cochon_dos_repos.svg"
        ]
      }
    },
    "cochon-tachete": {
      nom: "Cochon tacheté",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "ferme/cochon-tachete/cochon-tachete_avant_marche_1.svg",
          "ferme/cochon-tachete/cochon-tachete_avant_marche_2.svg",
          "ferme/cochon-tachete/cochon-tachete_avant_repos.svg",
          "ferme/cochon-tachete/cochon-tachete_avant_clignement.svg",
          "ferme/cochon-tachete/cochon-tachete_avant_joie.svg"
        ],
        dos: [
          "ferme/cochon-tachete/cochon-tachete_dos_marche_1.svg",
          "ferme/cochon-tachete/cochon-tachete_dos_marche_2.svg",
          "ferme/cochon-tachete/cochon-tachete_dos_repos.svg"
        ]
      }
    },
    chevre: {
      nom: "Chèvre",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "ferme/chevre/chevre_avant_marche_1.svg",
          "ferme/chevre/chevre_avant_marche_2.svg",
          "ferme/chevre/chevre_avant_repos.svg",
          "ferme/chevre/chevre_avant_clignement.svg",
          "ferme/chevre/chevre_avant_joie.svg"
        ],
        dos: [
          "ferme/chevre/chevre_dos_marche_1.svg",
          "ferme/chevre/chevre_dos_marche_2.svg",
          "ferme/chevre/chevre_dos_repos.svg"
        ]
      }
    },
    "chevre-brune": {
      nom: "Chèvre brune",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "ferme/chevre-brune/chevre-brune_avant_marche_1.svg",
          "ferme/chevre-brune/chevre-brune_avant_marche_2.svg",
          "ferme/chevre-brune/chevre-brune_avant_repos.svg",
          "ferme/chevre-brune/chevre-brune_avant_clignement.svg",
          "ferme/chevre-brune/chevre-brune_avant_joie.svg"
        ],
        dos: [
          "ferme/chevre-brune/chevre-brune_dos_marche_1.svg",
          "ferme/chevre-brune/chevre-brune_dos_marche_2.svg",
          "ferme/chevre-brune/chevre-brune_dos_repos.svg"
        ]
      }
    },
    chat: {
      nom: "Chat",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "ferme/chat/chat_avant_marche_1.svg",
          "ferme/chat/chat_avant_marche_2.svg",
          "ferme/chat/chat_avant_repos.svg",
          "ferme/chat/chat_avant_clignement.svg",
          "ferme/chat/chat_avant_joie.svg",
          "ferme/chat/chat_avant_assis_1.svg",
          "ferme/chat/chat_avant_assis_2.svg",
          "ferme/chat/chat_avant_dodo_1.svg",
          "ferme/chat/chat_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chat/chat_dos_marche_1.svg",
          "ferme/chat/chat_dos_marche_2.svg",
          "ferme/chat/chat_dos_repos.svg",
          "ferme/chat/chat_dos_assis_1.svg",
          "ferme/chat/chat_dos_assis_2.svg",
          "ferme/chat/chat_dos_dodo_1.svg",
          "ferme/chat/chat_dos_dodo_2.svg"
        ]
      }
    },
    chien: {
      nom: "Chien",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/chien/chien_avant_marche_1.svg",
          "ferme/chien/chien_avant_marche_2.svg",
          "ferme/chien/chien_avant_repos.svg",
          "ferme/chien/chien_avant_clignement.svg",
          "ferme/chien/chien_avant_joie.svg",
          "ferme/chien/chien_avant_assis_1.svg",
          "ferme/chien/chien_avant_assis_2.svg",
          "ferme/chien/chien_avant_dodo_1.svg",
          "ferme/chien/chien_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chien/chien_dos_marche_1.svg",
          "ferme/chien/chien_dos_marche_2.svg",
          "ferme/chien/chien_dos_repos.svg",
          "ferme/chien/chien_dos_assis_1.svg",
          "ferme/chien/chien_dos_assis_2.svg",
          "ferme/chien/chien_dos_dodo_1.svg",
          "ferme/chien/chien_dos_dodo_2.svg"
        ]
      }
    },
    "chat-noir": {
      nom: "Chat noir",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "ferme/chat-noir/chat-noir_avant_marche_1.svg",
          "ferme/chat-noir/chat-noir_avant_marche_2.svg",
          "ferme/chat-noir/chat-noir_avant_repos.svg",
          "ferme/chat-noir/chat-noir_avant_clignement.svg",
          "ferme/chat-noir/chat-noir_avant_joie.svg",
          "ferme/chat-noir/chat-noir_avant_assis_1.svg",
          "ferme/chat-noir/chat-noir_avant_assis_2.svg",
          "ferme/chat-noir/chat-noir_avant_dodo_1.svg",
          "ferme/chat-noir/chat-noir_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chat-noir/chat-noir_dos_marche_1.svg",
          "ferme/chat-noir/chat-noir_dos_marche_2.svg",
          "ferme/chat-noir/chat-noir_dos_repos.svg",
          "ferme/chat-noir/chat-noir_dos_assis_1.svg",
          "ferme/chat-noir/chat-noir_dos_assis_2.svg",
          "ferme/chat-noir/chat-noir_dos_dodo_1.svg",
          "ferme/chat-noir/chat-noir_dos_dodo_2.svg"
        ]
      }
    },
    "chat-gris": {
      nom: "Chat gris tigré",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "ferme/chat-gris/chat-gris_avant_marche_1.svg",
          "ferme/chat-gris/chat-gris_avant_marche_2.svg",
          "ferme/chat-gris/chat-gris_avant_repos.svg",
          "ferme/chat-gris/chat-gris_avant_clignement.svg",
          "ferme/chat-gris/chat-gris_avant_joie.svg",
          "ferme/chat-gris/chat-gris_avant_assis_1.svg",
          "ferme/chat-gris/chat-gris_avant_assis_2.svg",
          "ferme/chat-gris/chat-gris_avant_dodo_1.svg",
          "ferme/chat-gris/chat-gris_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chat-gris/chat-gris_dos_marche_1.svg",
          "ferme/chat-gris/chat-gris_dos_marche_2.svg",
          "ferme/chat-gris/chat-gris_dos_repos.svg",
          "ferme/chat-gris/chat-gris_dos_assis_1.svg",
          "ferme/chat-gris/chat-gris_dos_assis_2.svg",
          "ferme/chat-gris/chat-gris_dos_dodo_1.svg",
          "ferme/chat-gris/chat-gris_dos_dodo_2.svg"
        ]
      }
    },
    "chat-blanc": {
      nom: "Chat blanc taché",
      groupe: "ferme",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "ferme/chat-blanc/chat-blanc_avant_marche_1.svg",
          "ferme/chat-blanc/chat-blanc_avant_marche_2.svg",
          "ferme/chat-blanc/chat-blanc_avant_repos.svg",
          "ferme/chat-blanc/chat-blanc_avant_clignement.svg",
          "ferme/chat-blanc/chat-blanc_avant_joie.svg",
          "ferme/chat-blanc/chat-blanc_avant_assis_1.svg",
          "ferme/chat-blanc/chat-blanc_avant_assis_2.svg",
          "ferme/chat-blanc/chat-blanc_avant_dodo_1.svg",
          "ferme/chat-blanc/chat-blanc_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chat-blanc/chat-blanc_dos_marche_1.svg",
          "ferme/chat-blanc/chat-blanc_dos_marche_2.svg",
          "ferme/chat-blanc/chat-blanc_dos_repos.svg",
          "ferme/chat-blanc/chat-blanc_dos_assis_1.svg",
          "ferme/chat-blanc/chat-blanc_dos_assis_2.svg",
          "ferme/chat-blanc/chat-blanc_dos_dodo_1.svg",
          "ferme/chat-blanc/chat-blanc_dos_dodo_2.svg"
        ]
      }
    },
    "chien-noir": {
      nom: "Chien noir et blanc",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/chien-noir/chien-noir_avant_marche_1.svg",
          "ferme/chien-noir/chien-noir_avant_marche_2.svg",
          "ferme/chien-noir/chien-noir_avant_repos.svg",
          "ferme/chien-noir/chien-noir_avant_clignement.svg",
          "ferme/chien-noir/chien-noir_avant_joie.svg",
          "ferme/chien-noir/chien-noir_avant_assis_1.svg",
          "ferme/chien-noir/chien-noir_avant_assis_2.svg",
          "ferme/chien-noir/chien-noir_avant_dodo_1.svg",
          "ferme/chien-noir/chien-noir_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chien-noir/chien-noir_dos_marche_1.svg",
          "ferme/chien-noir/chien-noir_dos_marche_2.svg",
          "ferme/chien-noir/chien-noir_dos_repos.svg",
          "ferme/chien-noir/chien-noir_dos_assis_1.svg",
          "ferme/chien-noir/chien-noir_dos_assis_2.svg",
          "ferme/chien-noir/chien-noir_dos_dodo_1.svg",
          "ferme/chien-noir/chien-noir_dos_dodo_2.svg"
        ]
      }
    },
    "chien-brun": {
      nom: "Chien brun",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/chien-brun/chien-brun_avant_marche_1.svg",
          "ferme/chien-brun/chien-brun_avant_marche_2.svg",
          "ferme/chien-brun/chien-brun_avant_repos.svg",
          "ferme/chien-brun/chien-brun_avant_clignement.svg",
          "ferme/chien-brun/chien-brun_avant_joie.svg",
          "ferme/chien-brun/chien-brun_avant_assis_1.svg",
          "ferme/chien-brun/chien-brun_avant_assis_2.svg",
          "ferme/chien-brun/chien-brun_avant_dodo_1.svg",
          "ferme/chien-brun/chien-brun_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chien-brun/chien-brun_dos_marche_1.svg",
          "ferme/chien-brun/chien-brun_dos_marche_2.svg",
          "ferme/chien-brun/chien-brun_dos_repos.svg",
          "ferme/chien-brun/chien-brun_dos_assis_1.svg",
          "ferme/chien-brun/chien-brun_dos_assis_2.svg",
          "ferme/chien-brun/chien-brun_dos_dodo_1.svg",
          "ferme/chien-brun/chien-brun_dos_dodo_2.svg"
        ]
      }
    },
    "chien-roux": {
      nom: "Chien roux",
      groupe: "ferme",
      cadre: [
        -20,
        -30,
        40,
        34
      ],
      fichiers: {
        avant: [
          "ferme/chien-roux/chien-roux_avant_marche_1.svg",
          "ferme/chien-roux/chien-roux_avant_marche_2.svg",
          "ferme/chien-roux/chien-roux_avant_repos.svg",
          "ferme/chien-roux/chien-roux_avant_clignement.svg",
          "ferme/chien-roux/chien-roux_avant_joie.svg",
          "ferme/chien-roux/chien-roux_avant_assis_1.svg",
          "ferme/chien-roux/chien-roux_avant_assis_2.svg",
          "ferme/chien-roux/chien-roux_avant_dodo_1.svg",
          "ferme/chien-roux/chien-roux_avant_dodo_2.svg"
        ],
        dos: [
          "ferme/chien-roux/chien-roux_dos_marche_1.svg",
          "ferme/chien-roux/chien-roux_dos_marche_2.svg",
          "ferme/chien-roux/chien-roux_dos_repos.svg",
          "ferme/chien-roux/chien-roux_dos_assis_1.svg",
          "ferme/chien-roux/chien-roux_dos_assis_2.svg",
          "ferme/chien-roux/chien-roux_dos_dodo_1.svg",
          "ferme/chien-roux/chien-roux_dos_dodo_2.svg"
        ]
      }
    },
    cerf: {
      nom: "Cerf",
      groupe: "bois",
      cadre: [
        -20,
        -42.5,
        40,
        47.5
      ],
      fichiers: {
        avant: [
          "bois/cerf/cerf_avant_marche_1.svg",
          "bois/cerf/cerf_avant_marche_2.svg",
          "bois/cerf/cerf_avant_repos.svg",
          "bois/cerf/cerf_avant_clignement.svg",
          "bois/cerf/cerf_avant_joie.svg"
        ],
        dos: [
          "bois/cerf/cerf_dos_marche_1.svg",
          "bois/cerf/cerf_dos_marche_2.svg",
          "bois/cerf/cerf_dos_repos.svg"
        ]
      }
    },
    renard: {
      nom: "Renard",
      groupe: "bois",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "bois/renard/renard_avant_marche_1.svg",
          "bois/renard/renard_avant_marche_2.svg",
          "bois/renard/renard_avant_repos.svg",
          "bois/renard/renard_avant_clignement.svg",
          "bois/renard/renard_avant_joie.svg"
        ],
        dos: [
          "bois/renard/renard_dos_marche_1.svg",
          "bois/renard/renard_dos_marche_2.svg",
          "bois/renard/renard_dos_repos.svg"
        ]
      }
    },
    lapin: {
      nom: "Lapin",
      groupe: "bois",
      cadre: [
        -15,
        -22.5,
        30,
        26.5
      ],
      fichiers: {
        avant: [
          "bois/lapin/lapin_avant_marche_1.svg",
          "bois/lapin/lapin_avant_marche_2.svg",
          "bois/lapin/lapin_avant_repos.svg",
          "bois/lapin/lapin_avant_clignement.svg",
          "bois/lapin/lapin_avant_joie.svg"
        ],
        dos: [
          "bois/lapin/lapin_dos_marche_1.svg",
          "bois/lapin/lapin_dos_marche_2.svg",
          "bois/lapin/lapin_dos_repos.svg"
        ]
      }
    },
    herisson: {
      nom: "Hérisson",
      groupe: "bois",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "bois/herisson/herisson_avant_marche_1.svg",
          "bois/herisson/herisson_avant_marche_2.svg",
          "bois/herisson/herisson_avant_repos.svg",
          "bois/herisson/herisson_avant_clignement.svg",
          "bois/herisson/herisson_avant_joie.svg"
        ],
        dos: [
          "bois/herisson/herisson_dos_marche_1.svg",
          "bois/herisson/herisson_dos_marche_2.svg",
          "bois/herisson/herisson_dos_repos.svg"
        ]
      }
    },
    ecureuil: {
      nom: "Écureuil",
      groupe: "bois",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "bois/ecureuil/ecureuil_avant_marche_1.svg",
          "bois/ecureuil/ecureuil_avant_marche_2.svg",
          "bois/ecureuil/ecureuil_avant_repos.svg",
          "bois/ecureuil/ecureuil_avant_clignement.svg",
          "bois/ecureuil/ecureuil_avant_joie.svg"
        ],
        dos: [
          "bois/ecureuil/ecureuil_dos_marche_1.svg",
          "bois/ecureuil/ecureuil_dos_marche_2.svg",
          "bois/ecureuil/ecureuil_dos_repos.svg"
        ]
      }
    },
    loutre: {
      nom: "Loutre",
      groupe: "bois",
      cadre: [
        -15,
        -22.5,
        30,
        26.5
      ],
      fichiers: {
        avant: [
          "bois/loutre/loutre_avant_marche_1.svg",
          "bois/loutre/loutre_avant_marche_2.svg",
          "bois/loutre/loutre_avant_repos.svg",
          "bois/loutre/loutre_avant_clignement.svg",
          "bois/loutre/loutre_avant_joie.svg"
        ],
        dos: [
          "bois/loutre/loutre_dos_marche_1.svg",
          "bois/loutre/loutre_dos_marche_2.svg",
          "bois/loutre/loutre_dos_repos.svg"
        ]
      }
    },
    heron: {
      nom: "Héron",
      groupe: "eau",
      cadre: [
        -20,
        -42.5,
        40,
        45.5
      ],
      fichiers: {
        avant: [
          "eau/heron/heron_avant_marche_1.svg",
          "eau/heron/heron_avant_marche_2.svg",
          "eau/heron/heron_avant_repos.svg",
          "eau/heron/heron_avant_clignement.svg",
          "eau/heron/heron_avant_joie.svg"
        ],
        dos: [
          "eau/heron/heron_dos_marche_1.svg",
          "eau/heron/heron_dos_marche_2.svg",
          "eau/heron/heron_dos_repos.svg"
        ]
      }
    },
    "renard-polaire": {
      nom: "Renard polaire (cimes)",
      groupe: "climat",
      cadre: [
        -20,
        -30,
        40,
        34.5
      ],
      fichiers: {
        avant: [
          "climat/renard-polaire/renard-polaire_avant_marche_1.svg",
          "climat/renard-polaire/renard-polaire_avant_marche_2.svg",
          "climat/renard-polaire/renard-polaire_avant_repos.svg",
          "climat/renard-polaire/renard-polaire_avant_clignement.svg",
          "climat/renard-polaire/renard-polaire_avant_joie.svg"
        ],
        dos: [
          "climat/renard-polaire/renard-polaire_dos_marche_1.svg",
          "climat/renard-polaire/renard-polaire_dos_marche_2.svg",
          "climat/renard-polaire/renard-polaire_dos_repos.svg"
        ]
      }
    },
    bouquetin: {
      nom: "Bouquetin (cimes)",
      groupe: "climat",
      cadre: [
        -20,
        -42.5,
        40,
        47.5
      ],
      fichiers: {
        avant: [
          "climat/bouquetin/bouquetin_avant_marche_1.svg",
          "climat/bouquetin/bouquetin_avant_marche_2.svg",
          "climat/bouquetin/bouquetin_avant_repos.svg",
          "climat/bouquetin/bouquetin_avant_clignement.svg",
          "climat/bouquetin/bouquetin_avant_joie.svg"
        ],
        dos: [
          "climat/bouquetin/bouquetin_dos_marche_1.svg",
          "climat/bouquetin/bouquetin_dos_marche_2.svg",
          "climat/bouquetin/bouquetin_dos_repos.svg"
        ]
      }
    },
    macareux: {
      nom: "Macareux (landes)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "climat/macareux/macareux_avant_marche_1.svg",
          "climat/macareux/macareux_avant_marche_2.svg",
          "climat/macareux/macareux_avant_repos.svg",
          "climat/macareux/macareux_avant_clignement.svg",
          "climat/macareux/macareux_avant_joie.svg"
        ],
        dos: [
          "climat/macareux/macareux_dos_marche_1.svg",
          "climat/macareux/macareux_dos_marche_2.svg",
          "climat/macareux/macareux_dos_repos.svg"
        ]
      }
    },
    poney: {
      nom: "Poney (landes)",
      groupe: "climat",
      cadre: [
        -20,
        -42.5,
        40,
        47.5
      ],
      fichiers: {
        avant: [
          "climat/poney/poney_avant_marche_1.svg",
          "climat/poney/poney_avant_marche_2.svg",
          "climat/poney/poney_avant_repos.svg",
          "climat/poney/poney_avant_clignement.svg",
          "climat/poney/poney_avant_joie.svg"
        ],
        dos: [
          "climat/poney/poney_dos_marche_1.svg",
          "climat/poney/poney_dos_marche_2.svg",
          "climat/poney/poney_dos_repos.svg"
        ]
      }
    },
    grenouille: {
      nom: "Grenouille (marais)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "climat/grenouille/grenouille_avant_marche_1.svg",
          "climat/grenouille/grenouille_avant_marche_2.svg",
          "climat/grenouille/grenouille_avant_repos.svg",
          "climat/grenouille/grenouille_avant_clignement.svg",
          "climat/grenouille/grenouille_avant_joie.svg"
        ],
        dos: [
          "climat/grenouille/grenouille_dos_marche_1.svg",
          "climat/grenouille/grenouille_dos_marche_2.svg",
          "climat/grenouille/grenouille_dos_repos.svg"
        ]
      }
    },
    tortue: {
      nom: "Tortue (marais)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        26.5
      ],
      fichiers: {
        avant: [
          "climat/tortue/tortue_avant_marche_1.svg",
          "climat/tortue/tortue_avant_marche_2.svg",
          "climat/tortue/tortue_avant_repos.svg",
          "climat/tortue/tortue_avant_clignement.svg",
          "climat/tortue/tortue_avant_joie.svg"
        ],
        dos: [
          "climat/tortue/tortue_dos_marche_1.svg",
          "climat/tortue/tortue_dos_marche_2.svg",
          "climat/tortue/tortue_dos_repos.svg"
        ]
      }
    },
    fennec: {
      nom: "Fennec (dunes)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "climat/fennec/fennec_avant_marche_1.svg",
          "climat/fennec/fennec_avant_marche_2.svg",
          "climat/fennec/fennec_avant_repos.svg",
          "climat/fennec/fennec_avant_clignement.svg",
          "climat/fennec/fennec_avant_joie.svg"
        ],
        dos: [
          "climat/fennec/fennec_dos_marche_1.svg",
          "climat/fennec/fennec_dos_marche_2.svg",
          "climat/fennec/fennec_dos_repos.svg"
        ]
      }
    },
    chameau: {
      nom: "Chameau (dunes)",
      groupe: "climat",
      cadre: [
        -20,
        -42.5,
        40,
        47.5
      ],
      fichiers: {
        avant: [
          "climat/chameau/chameau_avant_marche_1.svg",
          "climat/chameau/chameau_avant_marche_2.svg",
          "climat/chameau/chameau_avant_repos.svg",
          "climat/chameau/chameau_avant_clignement.svg",
          "climat/chameau/chameau_avant_joie.svg"
        ],
        dos: [
          "climat/chameau/chameau_dos_marche_1.svg",
          "climat/chameau/chameau_dos_marche_2.svg",
          "climat/chameau/chameau_dos_repos.svg"
        ]
      }
    },
    cameleon: {
      nom: "Caméléon (jungle)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "climat/cameleon/cameleon_avant_marche_1.svg",
          "climat/cameleon/cameleon_avant_marche_2.svg",
          "climat/cameleon/cameleon_avant_repos.svg",
          "climat/cameleon/cameleon_avant_clignement.svg",
          "climat/cameleon/cameleon_avant_joie.svg"
        ],
        dos: [
          "climat/cameleon/cameleon_dos_marche_1.svg",
          "climat/cameleon/cameleon_dos_marche_2.svg",
          "climat/cameleon/cameleon_dos_repos.svg"
        ]
      }
    },
    toucan: {
      nom: "Toucan (jungle)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "climat/toucan/toucan_avant_marche_1.svg",
          "climat/toucan/toucan_avant_marche_2.svg",
          "climat/toucan/toucan_avant_repos.svg",
          "climat/toucan/toucan_avant_clignement.svg",
          "climat/toucan/toucan_avant_joie.svg"
        ],
        dos: [
          "climat/toucan/toucan_dos_marche_1.svg",
          "climat/toucan/toucan_dos_marche_2.svg",
          "climat/toucan/toucan_dos_repos.svg"
        ]
      }
    },
    salamandre: {
      nom: "Salamandre (volcan)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        26.5
      ],
      fichiers: {
        avant: [
          "climat/salamandre/salamandre_avant_marche_1.svg",
          "climat/salamandre/salamandre_avant_marche_2.svg",
          "climat/salamandre/salamandre_avant_repos.svg",
          "climat/salamandre/salamandre_avant_clignement.svg",
          "climat/salamandre/salamandre_avant_joie.svg"
        ],
        dos: [
          "climat/salamandre/salamandre_dos_marche_1.svg",
          "climat/salamandre/salamandre_dos_marche_2.svg",
          "climat/salamandre/salamandre_dos_repos.svg"
        ]
      }
    },
    corbeau: {
      nom: "Corbeau (volcan)",
      groupe: "climat",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "climat/corbeau/corbeau_avant_marche_1.svg",
          "climat/corbeau/corbeau_avant_marche_2.svg",
          "climat/corbeau/corbeau_avant_repos.svg",
          "climat/corbeau/corbeau_avant_clignement.svg",
          "climat/corbeau/corbeau_avant_joie.svg"
        ],
        dos: [
          "climat/corbeau/corbeau_dos_marche_1.svg",
          "climat/corbeau/corbeau_dos_marche_2.svg",
          "climat/corbeau/corbeau_dos_repos.svg"
        ]
      }
    },
    mesange: {
      nom: "Mésange",
      groupe: "bestiaire",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "bestiaire/mesange/mesange_avant_marche_1.svg",
          "bestiaire/mesange/mesange_avant_marche_2.svg",
          "bestiaire/mesange/mesange_avant_repos.svg",
          "bestiaire/mesange/mesange_avant_clignement.svg",
          "bestiaire/mesange/mesange_avant_joie.svg"
        ],
        dos: [
          "bestiaire/mesange/mesange_dos_marche_1.svg",
          "bestiaire/mesange/mesange_dos_marche_2.svg",
          "bestiaire/mesange/mesange_dos_repos.svg"
        ]
      }
    },
    mousse: {
      nom: "Mousse (renardeau de Sylve)",
      groupe: "familiers",
      cadre: [
        -15,
        -22.5,
        30,
        26
      ],
      fichiers: {
        avant: [
          "familiers/mousse/mousse_avant_marche_1.svg",
          "familiers/mousse/mousse_avant_marche_2.svg",
          "familiers/mousse/mousse_avant_repos.svg",
          "familiers/mousse/mousse_avant_clignement.svg",
          "familiers/mousse/mousse_avant_joie.svg"
        ],
        dos: [
          "familiers/mousse/mousse_dos_marche_1.svg",
          "familiers/mousse/mousse_dos_marche_2.svg",
          "familiers/mousse/mousse_dos_repos.svg"
        ]
      }
    },
    mouette: {
      nom: "Mouette",
      groupe: "mer",
      cadre: [
        -15,
        -22.5,
        30,
        25
      ],
      fichiers: {
        avant: [
          "mer/mouette/mouette_avant_marche_1.svg",
          "mer/mouette/mouette_avant_marche_2.svg",
          "mer/mouette/mouette_avant_repos.svg",
          "mer/mouette/mouette_avant_clignement.svg",
          "mer/mouette/mouette_avant_joie.svg"
        ],
        dos: [
          "mer/mouette/mouette_dos_marche_1.svg",
          "mer/mouette/mouette_dos_marche_2.svg",
          "mer/mouette/mouette_dos_repos.svg"
        ]
      }
    }
  }
};

// bibliotheque/svg/egares/egares.json
var egares_default = {
  _lisez_moi: [
    "Les égarés (HISTOIRE.md § 6.15, § 7.2) : la nuit, le Voile (une brume morte, sans voix, qui efface les noms, les mots, les visages) laisse sortir les égarés. Chacun est un morceau que le Voile a effacé et qui cherche ce qu'il était. Ils ne font pas de mal : leur tristesse et leur étrangeté suffisent.",
    "Le niveau attendu (demande de l'auteur du 14 oct., version 2) : mystérieux et poétiques, beaux et un peu inquiétants, jamais mignons ni comiques. Petits mais pas des bébés : environ deux têtes et demie, à l'échelle d'un habitant (l'Esprit un tiers plus grand), des silhouettes élancées ou voûtées qu'on reconnaît en ombre chinoise, des mains aux doigts longs. Le visage épuré : deux lueurs pâles, ou des yeux clos ; l'expression passe par la posture. Des volumes et des matières, un contre-jour de lune bleu-argent sur les bords, des ombres profondes, une palette froide, désaturée et riche.",
    "La règle du souvenir (les cinq égarés du Voile) : le corps est en brume (bleus-gris translucides, trait bleu nuit #3B4763, le bas qui s'effiloche en volutes). Un seul détail garde ses couleurs chaudes d'avant : le souvenir, net, saturé, au trait brun #3C2819 ; il pose sur l'égaré le seul reflet chaud de la silhouette. Dans les poses luciole, c'est le souvenir qui s'allume et s'envole : luciole1, il s'apaise, le souvenir luit ; luciole2, le corps pâlit ; luciole3, il ne reste que le souvenir, devenu lumière ; luciole4, elle s'élève.",
    "Vues des bêtes orientées : avant = il vient vers le bas à droite, dos = il s'éloigne vers le haut à droite ; le miroir horizontal donne les deux autres directions. Ancre (0, 0) au sol sous l'égaré ; prendre le cadre noté ici.",
    "Poses (avant) : marche1, marche2 (~240 ms) ; repos ; bouderie1, bouderie2 (repoussé : il se détourne, avec dignité ; ~500 ms, puis brume) ; fuite1, fuite2 (devant Anya, ~160 ms) ; luciole1 à luciole4 (~200 ms, une fois) ; brume1 à brume3 (il retourne au Voile, ~220 ms, une fois). Poses (dos) : marche1, marche2, repos, fuite1, fuite2.",
    "Poses nouvelles : le Dormeur (zombie), dort1 et dort2 (une clôture l'arrête et l'endort : debout, le front baissé contre sa tablette, il respire lentement, un mot à demi formé luit puis s'éteint ; ~1400 ms, en boucle) ; la Racine errante (racine), terre1 à terre3 (elle passe sous la clôture : elle s'enfonce en soulevant la terre jusqu'à ce qu'il ne reste que le bourgeon ; ~260 ms ; le jeu les joue à l'envers quand elle ressort). Le Noyé de l'Hirondelle (noye) et l'Esprit sylvestre revenant (esprit) : le jeu joue brume à l'envers quand le Noyé sort de l'eau (il se fond en eau, puis en vapeur) et quand l'Esprit revient (il s'effeuille, puis se recompose) : brume1 à brume3 se lisent dans les deux sens.",
    "Les égarés du Voile : le Sans-Nom (fantome ; un nom, celui d'un passager de l'Hirondelle : son étiquette de bagage, l'encre a coulé), le Dormeur (zombie ; les mots d'un Ancien : une tablette d'argile cuite, vide, et un stylet), le Noyé de l'Hirondelle (noye ; la nuit du naufrage : la bouée « L'HIRONDE… »), la Racine errante (racine ; le nom d'un arbre : un bourgeon vivant et sa baie), l'Esprit sylvestre revenant (esprit ; la voix d'Anya : une graine d'ambre qui bat comme un cœur). Ils viennent de partout. Les bêtes de brume (betes_brume.js) : une par climat (celui du morceau d'île d'où vient la nuit) ; ailleurs (le cœur, tempéré), le lapin de brume. Même règle, même niveau : un corps de brume, deux lueurs pâles pour les yeux, et une seule tache de pelage qui garde sa couleur d'avant (au trait brun) et devient la luciole : la tache rousse du poitrail (le lapin), la barbiche châtaigne (le bouquetin), la crinière alezane (le poney), la tache vert-or du dos (la grenouille), une oreille couleur de sable (le fennec), la bande émeraude du flanc (le caméléon), la tache orange-feu du dos (la salamandre).",
    "Noms rangés à l'assemblage (README, catalogue.json) : <sujet>_<vue>_<pose>_<n>.svg, vues face, avant (l'ancien « trois_quarts »), dos, profil ; les chemins ci-dessous suivent ces noms."
  ],
  egares: {
    fantome: {
      nom: "Le Sans-Nom",
      cadre: [
        -29,
        -80,
        64.5,
        84
      ],
      fichiers: {
        avant: {
          marche1: "fantome/fantome_avant_marche_1.svg",
          marche2: "fantome/fantome_avant_marche_2.svg",
          repos: "fantome/fantome_avant_repos.svg",
          bouderie1: "fantome/fantome_avant_bouderie_1.svg",
          bouderie2: "fantome/fantome_avant_bouderie_2.svg",
          fuite1: "fantome/fantome_avant_fuite_1.svg",
          fuite2: "fantome/fantome_avant_fuite_2.svg",
          luciole1: "fantome/fantome_avant_luciole_1.svg",
          luciole2: "fantome/fantome_avant_luciole_2.svg",
          luciole3: "fantome/fantome_avant_luciole_3.svg",
          luciole4: "fantome/fantome_avant_luciole_4.svg",
          brume1: "fantome/fantome_avant_brume_1.svg",
          brume2: "fantome/fantome_avant_brume_2.svg",
          brume3: "fantome/fantome_avant_brume_3.svg"
        },
        dos: {
          marche1: "fantome/fantome_dos_marche_1.svg",
          marche2: "fantome/fantome_dos_marche_2.svg",
          repos: "fantome/fantome_dos_repos.svg",
          fuite1: "fantome/fantome_dos_fuite_1.svg",
          fuite2: "fantome/fantome_dos_fuite_2.svg"
        }
      }
    },
    zombie: {
      nom: "Le Dormeur",
      cadre: [
        -21,
        -64,
        45,
        68
      ],
      fichiers: {
        avant: {
          marche1: "zombie/zombie_avant_marche_1.svg",
          marche2: "zombie/zombie_avant_marche_2.svg",
          repos: "zombie/zombie_avant_repos.svg",
          bouderie1: "zombie/zombie_avant_bouderie_1.svg",
          bouderie2: "zombie/zombie_avant_bouderie_2.svg",
          fuite1: "zombie/zombie_avant_fuite_1.svg",
          fuite2: "zombie/zombie_avant_fuite_2.svg",
          luciole1: "zombie/zombie_avant_luciole_1.svg",
          luciole2: "zombie/zombie_avant_luciole_2.svg",
          luciole3: "zombie/zombie_avant_luciole_3.svg",
          luciole4: "zombie/zombie_avant_luciole_4.svg",
          brume1: "zombie/zombie_avant_brume_1.svg",
          brume2: "zombie/zombie_avant_brume_2.svg",
          brume3: "zombie/zombie_avant_brume_3.svg",
          dort1: "zombie/zombie_avant_dort_1.svg",
          dort2: "zombie/zombie_avant_dort_2.svg"
        },
        dos: {
          marche1: "zombie/zombie_dos_marche_1.svg",
          marche2: "zombie/zombie_dos_marche_2.svg",
          repos: "zombie/zombie_dos_repos.svg",
          fuite1: "zombie/zombie_dos_fuite_1.svg",
          fuite2: "zombie/zombie_dos_fuite_2.svg"
        }
      }
    },
    noye: {
      nom: "Le Noyé de l'Hirondelle",
      cadre: [
        -21,
        -62,
        43.5,
        66.5
      ],
      fichiers: {
        avant: {
          marche1: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_marche_1.svg",
          marche2: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_marche_2.svg",
          repos: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_repos.svg",
          bouderie1: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_bouderie_1.svg",
          bouderie2: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_bouderie_2.svg",
          fuite1: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_fuite_1.svg",
          fuite2: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_fuite_2.svg",
          luciole1: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_luciole_1.svg",
          luciole2: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_luciole_2.svg",
          luciole3: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_luciole_3.svg",
          luciole4: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_luciole_4.svg",
          brume1: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_brume_1.svg",
          brume2: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_brume_2.svg",
          brume3: "noye-de-l-hirondelle/noye-de-l-hirondelle_avant_brume_3.svg"
        },
        dos: {
          marche1: "noye-de-l-hirondelle/noye-de-l-hirondelle_dos_marche_1.svg",
          marche2: "noye-de-l-hirondelle/noye-de-l-hirondelle_dos_marche_2.svg",
          repos: "noye-de-l-hirondelle/noye-de-l-hirondelle_dos_repos.svg",
          fuite1: "noye-de-l-hirondelle/noye-de-l-hirondelle_dos_fuite_1.svg",
          fuite2: "noye-de-l-hirondelle/noye-de-l-hirondelle_dos_fuite_2.svg"
        }
      }
    },
    racine: {
      nom: "La Racine errante",
      cadre: [
        -21,
        -58,
        42,
        63
      ],
      fichiers: {
        avant: {
          marche1: "racine-errante/racine-errante_avant_marche_1.svg",
          marche2: "racine-errante/racine-errante_avant_marche_2.svg",
          repos: "racine-errante/racine-errante_avant_repos.svg",
          bouderie1: "racine-errante/racine-errante_avant_bouderie_1.svg",
          bouderie2: "racine-errante/racine-errante_avant_bouderie_2.svg",
          fuite1: "racine-errante/racine-errante_avant_fuite_1.svg",
          fuite2: "racine-errante/racine-errante_avant_fuite_2.svg",
          luciole1: "racine-errante/racine-errante_avant_luciole_1.svg",
          luciole2: "racine-errante/racine-errante_avant_luciole_2.svg",
          luciole3: "racine-errante/racine-errante_avant_luciole_3.svg",
          luciole4: "racine-errante/racine-errante_avant_luciole_4.svg",
          brume1: "racine-errante/racine-errante_avant_brume_1.svg",
          brume2: "racine-errante/racine-errante_avant_brume_2.svg",
          brume3: "racine-errante/racine-errante_avant_brume_3.svg",
          terre1: "racine-errante/racine-errante_avant_terre_1.svg",
          terre2: "racine-errante/racine-errante_avant_terre_2.svg",
          terre3: "racine-errante/racine-errante_avant_terre_3.svg"
        },
        dos: {
          marche1: "racine-errante/racine-errante_dos_marche_1.svg",
          marche2: "racine-errante/racine-errante_dos_marche_2.svg",
          repos: "racine-errante/racine-errante_dos_repos.svg",
          fuite1: "racine-errante/racine-errante_dos_fuite_1.svg",
          fuite2: "racine-errante/racine-errante_dos_fuite_2.svg"
        }
      }
    },
    esprit: {
      nom: "L'Esprit sylvestre revenant",
      cadre: [
        -29,
        -82,
        56,
        86.5
      ],
      fichiers: {
        avant: {
          marche1: "esprit-sylvestre/esprit-sylvestre_avant_marche_1.svg",
          marche2: "esprit-sylvestre/esprit-sylvestre_avant_marche_2.svg",
          repos: "esprit-sylvestre/esprit-sylvestre_avant_repos.svg",
          bouderie1: "esprit-sylvestre/esprit-sylvestre_avant_bouderie_1.svg",
          bouderie2: "esprit-sylvestre/esprit-sylvestre_avant_bouderie_2.svg",
          fuite1: "esprit-sylvestre/esprit-sylvestre_avant_fuite_1.svg",
          fuite2: "esprit-sylvestre/esprit-sylvestre_avant_fuite_2.svg",
          luciole1: "esprit-sylvestre/esprit-sylvestre_avant_luciole_1.svg",
          luciole2: "esprit-sylvestre/esprit-sylvestre_avant_luciole_2.svg",
          luciole3: "esprit-sylvestre/esprit-sylvestre_avant_luciole_3.svg",
          luciole4: "esprit-sylvestre/esprit-sylvestre_avant_luciole_4.svg",
          brume1: "esprit-sylvestre/esprit-sylvestre_avant_brume_1.svg",
          brume2: "esprit-sylvestre/esprit-sylvestre_avant_brume_2.svg",
          brume3: "esprit-sylvestre/esprit-sylvestre_avant_brume_3.svg"
        },
        dos: {
          marche1: "esprit-sylvestre/esprit-sylvestre_dos_marche_1.svg",
          marche2: "esprit-sylvestre/esprit-sylvestre_dos_marche_2.svg",
          repos: "esprit-sylvestre/esprit-sylvestre_dos_repos.svg",
          fuite1: "esprit-sylvestre/esprit-sylvestre_dos_fuite_1.svg",
          fuite2: "esprit-sylvestre/esprit-sylvestre_dos_fuite_2.svg"
        }
      }
    },
    "lapin-de-brume": {
      nom: "Lapin de brume (tempéré)",
      climat: "tempere",
      cadre: [
        -16,
        -36,
        32,
        40
      ],
      fichiers: {
        avant: {
          marche1: "lapin-de-brume/lapin-de-brume_avant_marche_1.svg",
          marche2: "lapin-de-brume/lapin-de-brume_avant_marche_2.svg",
          repos: "lapin-de-brume/lapin-de-brume_avant_repos.svg",
          bouderie1: "lapin-de-brume/lapin-de-brume_avant_bouderie_1.svg",
          bouderie2: "lapin-de-brume/lapin-de-brume_avant_bouderie_2.svg",
          fuite1: "lapin-de-brume/lapin-de-brume_avant_fuite_1.svg",
          fuite2: "lapin-de-brume/lapin-de-brume_avant_fuite_2.svg",
          luciole1: "lapin-de-brume/lapin-de-brume_avant_luciole_1.svg",
          luciole2: "lapin-de-brume/lapin-de-brume_avant_luciole_2.svg",
          luciole3: "lapin-de-brume/lapin-de-brume_avant_luciole_3.svg",
          luciole4: "lapin-de-brume/lapin-de-brume_avant_luciole_4.svg",
          brume1: "lapin-de-brume/lapin-de-brume_avant_brume_1.svg",
          brume2: "lapin-de-brume/lapin-de-brume_avant_brume_2.svg",
          brume3: "lapin-de-brume/lapin-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "lapin-de-brume/lapin-de-brume_dos_marche_1.svg",
          marche2: "lapin-de-brume/lapin-de-brume_dos_marche_2.svg",
          repos: "lapin-de-brume/lapin-de-brume_dos_repos.svg",
          fuite1: "lapin-de-brume/lapin-de-brume_dos_fuite_1.svg",
          fuite2: "lapin-de-brume/lapin-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "bouquetin-de-brume": {
      nom: "Bouquetin de brume (les Cimes)",
      climat: "cimes",
      cadre: [
        -16,
        -40.5,
        41,
        44.5
      ],
      fichiers: {
        avant: {
          marche1: "bouquetin-de-brume/bouquetin-de-brume_avant_marche_1.svg",
          marche2: "bouquetin-de-brume/bouquetin-de-brume_avant_marche_2.svg",
          repos: "bouquetin-de-brume/bouquetin-de-brume_avant_repos.svg",
          bouderie1: "bouquetin-de-brume/bouquetin-de-brume_avant_bouderie_1.svg",
          bouderie2: "bouquetin-de-brume/bouquetin-de-brume_avant_bouderie_2.svg",
          fuite1: "bouquetin-de-brume/bouquetin-de-brume_avant_fuite_1.svg",
          fuite2: "bouquetin-de-brume/bouquetin-de-brume_avant_fuite_2.svg",
          luciole1: "bouquetin-de-brume/bouquetin-de-brume_avant_luciole_1.svg",
          luciole2: "bouquetin-de-brume/bouquetin-de-brume_avant_luciole_2.svg",
          luciole3: "bouquetin-de-brume/bouquetin-de-brume_avant_luciole_3.svg",
          luciole4: "bouquetin-de-brume/bouquetin-de-brume_avant_luciole_4.svg",
          brume1: "bouquetin-de-brume/bouquetin-de-brume_avant_brume_1.svg",
          brume2: "bouquetin-de-brume/bouquetin-de-brume_avant_brume_2.svg",
          brume3: "bouquetin-de-brume/bouquetin-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "bouquetin-de-brume/bouquetin-de-brume_dos_marche_1.svg",
          marche2: "bouquetin-de-brume/bouquetin-de-brume_dos_marche_2.svg",
          repos: "bouquetin-de-brume/bouquetin-de-brume_dos_repos.svg",
          fuite1: "bouquetin-de-brume/bouquetin-de-brume_dos_fuite_1.svg",
          fuite2: "bouquetin-de-brume/bouquetin-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "poney-de-brume": {
      nom: "Poney de brume (les Landes)",
      climat: "landes",
      cadre: [
        -18,
        -43.5,
        37,
        47.5
      ],
      fichiers: {
        avant: {
          marche1: "poney-de-brume/poney-de-brume_avant_marche_1.svg",
          marche2: "poney-de-brume/poney-de-brume_avant_marche_2.svg",
          repos: "poney-de-brume/poney-de-brume_avant_repos.svg",
          bouderie1: "poney-de-brume/poney-de-brume_avant_bouderie_1.svg",
          bouderie2: "poney-de-brume/poney-de-brume_avant_bouderie_2.svg",
          fuite1: "poney-de-brume/poney-de-brume_avant_fuite_1.svg",
          fuite2: "poney-de-brume/poney-de-brume_avant_fuite_2.svg",
          luciole1: "poney-de-brume/poney-de-brume_avant_luciole_1.svg",
          luciole2: "poney-de-brume/poney-de-brume_avant_luciole_2.svg",
          luciole3: "poney-de-brume/poney-de-brume_avant_luciole_3.svg",
          luciole4: "poney-de-brume/poney-de-brume_avant_luciole_4.svg",
          brume1: "poney-de-brume/poney-de-brume_avant_brume_1.svg",
          brume2: "poney-de-brume/poney-de-brume_avant_brume_2.svg",
          brume3: "poney-de-brume/poney-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "poney-de-brume/poney-de-brume_dos_marche_1.svg",
          marche2: "poney-de-brume/poney-de-brume_dos_marche_2.svg",
          repos: "poney-de-brume/poney-de-brume_dos_repos.svg",
          fuite1: "poney-de-brume/poney-de-brume_dos_fuite_1.svg",
          fuite2: "poney-de-brume/poney-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "grenouille-de-brume": {
      nom: "Grenouille de brume (le Marais)",
      climat: "marais",
      cadre: [
        -17,
        -31.5,
        33,
        37
      ],
      fichiers: {
        avant: {
          marche1: "grenouille-de-brume/grenouille-de-brume_avant_marche_1.svg",
          marche2: "grenouille-de-brume/grenouille-de-brume_avant_marche_2.svg",
          repos: "grenouille-de-brume/grenouille-de-brume_avant_repos.svg",
          bouderie1: "grenouille-de-brume/grenouille-de-brume_avant_bouderie_1.svg",
          bouderie2: "grenouille-de-brume/grenouille-de-brume_avant_bouderie_2.svg",
          fuite1: "grenouille-de-brume/grenouille-de-brume_avant_fuite_1.svg",
          fuite2: "grenouille-de-brume/grenouille-de-brume_avant_fuite_2.svg",
          luciole1: "grenouille-de-brume/grenouille-de-brume_avant_luciole_1.svg",
          luciole2: "grenouille-de-brume/grenouille-de-brume_avant_luciole_2.svg",
          luciole3: "grenouille-de-brume/grenouille-de-brume_avant_luciole_3.svg",
          luciole4: "grenouille-de-brume/grenouille-de-brume_avant_luciole_4.svg",
          brume1: "grenouille-de-brume/grenouille-de-brume_avant_brume_1.svg",
          brume2: "grenouille-de-brume/grenouille-de-brume_avant_brume_2.svg",
          brume3: "grenouille-de-brume/grenouille-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "grenouille-de-brume/grenouille-de-brume_dos_marche_1.svg",
          marche2: "grenouille-de-brume/grenouille-de-brume_dos_marche_2.svg",
          repos: "grenouille-de-brume/grenouille-de-brume_dos_repos.svg",
          fuite1: "grenouille-de-brume/grenouille-de-brume_dos_fuite_1.svg",
          fuite2: "grenouille-de-brume/grenouille-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "fennec-de-brume": {
      nom: "Fennec de brume (les Dunes)",
      climat: "dunes",
      cadre: [
        -16.5,
        -40,
        32.5,
        44
      ],
      fichiers: {
        avant: {
          marche1: "fennec-de-brume/fennec-de-brume_avant_marche_1.svg",
          marche2: "fennec-de-brume/fennec-de-brume_avant_marche_2.svg",
          repos: "fennec-de-brume/fennec-de-brume_avant_repos.svg",
          bouderie1: "fennec-de-brume/fennec-de-brume_avant_bouderie_1.svg",
          bouderie2: "fennec-de-brume/fennec-de-brume_avant_bouderie_2.svg",
          fuite1: "fennec-de-brume/fennec-de-brume_avant_fuite_1.svg",
          fuite2: "fennec-de-brume/fennec-de-brume_avant_fuite_2.svg",
          luciole1: "fennec-de-brume/fennec-de-brume_avant_luciole_1.svg",
          luciole2: "fennec-de-brume/fennec-de-brume_avant_luciole_2.svg",
          luciole3: "fennec-de-brume/fennec-de-brume_avant_luciole_3.svg",
          luciole4: "fennec-de-brume/fennec-de-brume_avant_luciole_4.svg",
          brume1: "fennec-de-brume/fennec-de-brume_avant_brume_1.svg",
          brume2: "fennec-de-brume/fennec-de-brume_avant_brume_2.svg",
          brume3: "fennec-de-brume/fennec-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "fennec-de-brume/fennec-de-brume_dos_marche_1.svg",
          marche2: "fennec-de-brume/fennec-de-brume_dos_marche_2.svg",
          repos: "fennec-de-brume/fennec-de-brume_dos_repos.svg",
          fuite1: "fennec-de-brume/fennec-de-brume_dos_fuite_1.svg",
          fuite2: "fennec-de-brume/fennec-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "cameleon-de-brume": {
      nom: "Caméléon de brume (la Jungle)",
      climat: "jungle",
      cadre: [
        -16,
        -33,
        32,
        37
      ],
      fichiers: {
        avant: {
          marche1: "cameleon-de-brume/cameleon-de-brume_avant_marche_1.svg",
          marche2: "cameleon-de-brume/cameleon-de-brume_avant_marche_2.svg",
          repos: "cameleon-de-brume/cameleon-de-brume_avant_repos.svg",
          bouderie1: "cameleon-de-brume/cameleon-de-brume_avant_bouderie_1.svg",
          bouderie2: "cameleon-de-brume/cameleon-de-brume_avant_bouderie_2.svg",
          fuite1: "cameleon-de-brume/cameleon-de-brume_avant_fuite_1.svg",
          fuite2: "cameleon-de-brume/cameleon-de-brume_avant_fuite_2.svg",
          luciole1: "cameleon-de-brume/cameleon-de-brume_avant_luciole_1.svg",
          luciole2: "cameleon-de-brume/cameleon-de-brume_avant_luciole_2.svg",
          luciole3: "cameleon-de-brume/cameleon-de-brume_avant_luciole_3.svg",
          luciole4: "cameleon-de-brume/cameleon-de-brume_avant_luciole_4.svg",
          brume1: "cameleon-de-brume/cameleon-de-brume_avant_brume_1.svg",
          brume2: "cameleon-de-brume/cameleon-de-brume_avant_brume_2.svg",
          brume3: "cameleon-de-brume/cameleon-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "cameleon-de-brume/cameleon-de-brume_dos_marche_1.svg",
          marche2: "cameleon-de-brume/cameleon-de-brume_dos_marche_2.svg",
          repos: "cameleon-de-brume/cameleon-de-brume_dos_repos.svg",
          fuite1: "cameleon-de-brume/cameleon-de-brume_dos_fuite_1.svg",
          fuite2: "cameleon-de-brume/cameleon-de-brume_dos_fuite_2.svg"
        }
      }
    },
    "salamandre-de-brume": {
      nom: "Salamandre de brume (le Volcan)",
      climat: "volcan",
      cadre: [
        -16.5,
        -30,
        32.5,
        37
      ],
      fichiers: {
        avant: {
          marche1: "salamandre-de-brume/salamandre-de-brume_avant_marche_1.svg",
          marche2: "salamandre-de-brume/salamandre-de-brume_avant_marche_2.svg",
          repos: "salamandre-de-brume/salamandre-de-brume_avant_repos.svg",
          bouderie1: "salamandre-de-brume/salamandre-de-brume_avant_bouderie_1.svg",
          bouderie2: "salamandre-de-brume/salamandre-de-brume_avant_bouderie_2.svg",
          fuite1: "salamandre-de-brume/salamandre-de-brume_avant_fuite_1.svg",
          fuite2: "salamandre-de-brume/salamandre-de-brume_avant_fuite_2.svg",
          luciole1: "salamandre-de-brume/salamandre-de-brume_avant_luciole_1.svg",
          luciole2: "salamandre-de-brume/salamandre-de-brume_avant_luciole_2.svg",
          luciole3: "salamandre-de-brume/salamandre-de-brume_avant_luciole_3.svg",
          luciole4: "salamandre-de-brume/salamandre-de-brume_avant_luciole_4.svg",
          brume1: "salamandre-de-brume/salamandre-de-brume_avant_brume_1.svg",
          brume2: "salamandre-de-brume/salamandre-de-brume_avant_brume_2.svg",
          brume3: "salamandre-de-brume/salamandre-de-brume_avant_brume_3.svg"
        },
        dos: {
          marche1: "salamandre-de-brume/salamandre-de-brume_dos_marche_1.svg",
          marche2: "salamandre-de-brume/salamandre-de-brume_dos_marche_2.svg",
          repos: "salamandre-de-brume/salamandre-de-brume_dos_repos.svg",
          fuite1: "salamandre-de-brume/salamandre-de-brume_dos_fuite_1.svg",
          fuite2: "salamandre-de-brume/salamandre-de-brume_dos_fuite_2.svg"
        }
      }
    }
  }
};

// atelier/generateur_betes.mjs
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var svgOf = /* @__PURE__ */ __name((cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(" ")}">${body}</svg>`, "svgOf");
var hyph = /* @__PURE__ */ __name((s) => s.replace(/_/g, "-"), "hyph");
var vitesse = /* @__PURE__ */ __name((rel) => {
  const m = rel.match(/^(.*)_([a-z]+)_\d+\.svg$/);
  return m ? import_noms_betes.default.vitesseBete(m[1], m[2]) ?? null : null;
}, "vitesse");
var suffixe = /* @__PURE__ */ __name((p) => /^\d+$/.test(p) ? `image${+p + 1}` : p, "suffixe");
var PROFILS = Object.fromEntries(import_betes_liste.default.PROFILS.map(([groupe, dossier, nom, taille, poses, dessin]) => {
  const [x, y, w, h] = import_betes.default.BOX[taille];
  return [hyph(dossier), { nom, groupe, dossier, cadre: [x, y, w, h], poses, dessin }];
}));
var ORIENTEES = Object.fromEntries(import_betes_liste.default.ORIENTEES.map(([groupe, dossier, nom, { c, bird, pet, dessin }]) => [hyph(dossier), { nom, groupe, dossier, cadre: orientees_default.betes[hyph(dossier)].cadre, fiche: c, oiseau: bird, compagnie: !!pet, dessin }]));
var posesOrientee = /* @__PURE__ */ __name((b, vue) => [...vue === "avant" ? import_betes_liste.default.AVANT : import_betes_liste.default.DOS, ...b.compagnie ? import_betes_liste.default.PET : []], "posesOrientee");
var ICONES = Object.fromEntries(import_betes_liste.default.ICONES.map(([groupe, dossier, dessin]) => [hyph(dossier), { groupe, dossier, dessin }]));
var EGARES = Object.fromEntries(import_betes_liste.default.EGARES.map(([dossier, nom, dessin, , cle, plus]) => [cle, { nom, cadre: egares_default.egares[cle].cadre, dessin, dossier, poses: { avant: [...import_egares_voile.default.POSES.avant, ...plus], dos: import_egares_voile.default.POSES.dos } }]));
var BETES = {
  profil: Object.fromEntries(Object.entries(PROFILS).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: b.poses }])),
  orientees: Object.fromEntries(Object.entries(ORIENTEES).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: { avant: posesOrientee(b, "avant"), dos: posesOrientee(b, "dos") } }])),
  egares: Object.fromEntries(Object.entries(EGARES).map(([k, b]) => [k, { nom: b.nom, cadre: b.cadre, poses: b.poses }])),
  icones: Object.keys(ICONES)
};
var prendre = /* @__PURE__ */ __name((table, quoi, nom) => {
  const b = table[nom];
  if (!b) throw new Error(`${quoi} : ${nom} (${Object.keys(table).join(", ")})`);
  return b;
}, "prendre");
var dans = /* @__PURE__ */ __name((liste2, quoi, x) => {
  if (!liste2.includes(x)) throw new Error(`${quoi} inconnue : ${x} (${liste2.join(", ")})`);
}, "dans");
var fichierProfil = /* @__PURE__ */ __name((b, pose) => import_noms_betes.default.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${suffixe(pose)}.svg`), "fichierProfil");
var fichierOrientee = /* @__PURE__ */ __name((b, vue, pose) => import_noms_betes.default.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${vue}_${pose}.svg`), "fichierOrientee");
var fichierEgare = /* @__PURE__ */ __name((b, vue, pose) => import_noms_betes.default.nomBete(`egares/${b.dossier}/${b.dossier}_${vue}_${pose}.svg`), "fichierEgare");
function profil(bete, pose) {
  const b = prendre(PROFILS, "bête inconnue", bete);
  dans(b.poses, "pose", pose);
  const f = fichierProfil(b, pose);
  const ms = vitesse(f) ?? (/^\d+$/.test(pose) && b.poses.length > 1 ? import_noms_betes.default.vitesseBete(f) ?? null : null);
  return { svg: svgOf(b.cadre, b.dessin(pose)), cadre: b.cadre, ms_par_image: ms };
}
__name(profil, "profil");
function orientee(bete, vue, pose) {
  const b = prendre(ORIENTEES, "bête inconnue", bete);
  dans(["avant", "dos"], "vue", vue);
  dans(posesOrientee(b, vue), "pose", pose);
  const corps = b.dessin ? b.dessin(vue, pose) : (import_betes_liste.default.PET.includes(pose) ? import_betes3.default.petPose3 : b.oiseau ? import_betes3.default.bird3 : import_betes3.default.quad3)(b.fiche, vue, pose);
  return { svg: svgOf(b.cadre, corps), cadre: b.cadre, ms_par_image: vitesse(fichierOrientee(b, vue, pose)) };
}
__name(orientee, "orientee");
var ICONE = [0, 0, 32, 32];
function iconeBete(bete) {
  const b = prendre(ICONES, "icône inconnue", bete);
  return { svg: svgOf(ICONE, b.dessin()), cadre: ICONE, ms_par_image: null };
}
__name(iconeBete, "iconeBete");
function egare(sujet, vue, pose) {
  const b = prendre(EGARES, "égaré inconnu", sujet);
  dans(Object.keys(b.poses), "vue", vue);
  dans(b.poses[vue], "pose", pose);
  return { svg: svgOf(b.cadre, b.dessin(vue, pose)), cadre: b.cadre, ms_par_image: vitesse(fichierEgare(b, vue, pose)) };
}
__name(egare, "egare");
function liste() {
  const out = [];
  for (const [k, b] of Object.entries(PROFILS)) for (const p of b.poses) out.push({ fichier: fichierProfil(b, p), fonction: "profil", args: [k, p] });
  for (const [k, b] of Object.entries(ORIENTEES)) for (const v of ["avant", "dos"]) for (const p of posesOrientee(b, v)) out.push({ fichier: fichierOrientee(b, v, p), fonction: "orientee", args: [k, v, p] });
  for (const [k, b] of Object.entries(ICONES)) out.push({ fichier: import_noms_betes.default.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_icone.svg`), fonction: "iconeBete", args: [k] });
  for (const [k, b] of Object.entries(EGARES)) for (const [v, poses] of Object.entries(b.poses)) for (const p of poses) out.push({ fichier: fichierEgare(b, v, p), fonction: "egare", args: [k, v, p] });
  return out;
}
__name(liste, "liste");
export {
  BETES,
  egare,
  iconeBete,
  liste,
  orientee,
  profil
};
