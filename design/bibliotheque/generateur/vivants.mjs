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

// personnages/couleurs.js
var require_couleurs = __commonJS({
  "personnages/couleurs.js"(exports, module) {
    var ENCRE = "#0A0418";
    var ENCRE_KIT = "#3C2819";
    var NUIT = "#2A1650";
    var PASTEL = "#B4A8DC";
    function memo(fn, max = 4096) {
      const cache = /* @__PURE__ */ new Map();
      return (...args) => {
        const cle = args.join("|");
        let v = cache.get(cle);
        if (v === void 0) {
          if (cache.size >= max) cache.clear();
          v = fn(...args);
          cache.set(cle, v);
        }
        return v;
      };
    }
    __name(memo, "memo");
    function hsl(c) {
      const n = parseInt(c.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
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
    var mix = memo((a, b, k) => {
      const p = /* @__PURE__ */ __name((c) => [0, 2, 4].map((i) => parseInt(c.slice(1 + i, 3 + i), 16)), "p"), A = p(a), B = p(b);
      return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    });
    var ton = memo((c, k) => {
      const [h, s, l] = hsl(c);
      if (k >= 1) return hex([h, s, l + (1 - l) * (k - 1)]);
      return mix(hex([h, s, l * k]), NUIT, Math.min(0.28, (1 - k) * 1.1));
    });
    var delave = memo((c, k = 1) => {
      const [h, s, l] = hsl(c);
      return mix(hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]), PASTEL, 0.3 * k);
    });
    var clarte = /* @__PURE__ */ __name((c) => hsl(c)[2], "clarte");
    var enPersonnage = /* @__PURE__ */ __name((svg) => svg.replaceAll(ENCRE_KIT, ENCRE), "enPersonnage");
    module.exports = { ENCRE, ENCRE_KIT, NUIT, PASTEL, memo, hsl, hex, mix, ton, delave, clarte, enPersonnage };
  }
});

// personnages/refonte/membres.js
var require_membres = __commonJS({
  "personnages/refonte/membres.js"(exports, module) {
    var { OUT, W, r2, shoe, frame } = require_troupe();
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
      const L = c.brasL ? c.brasL[g ? 0 : 1] : Math.hypot(repos[0] - ep[0], repos[1] - ep[1]);
      const s = coude ? cote(a, b, coude) : cote(a, b, [a[0] + (g ? -10 : 10), a[1] + 2]);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d >= L * DROIT) {
        const m = d > L ? [a[0] + (b[0] - a[0]) / d * L, a[1] + (b[1] - a[1]) / d * L] : b;
        return { coude: null, main: m, decalage: [m[0] - b[0], m[1] - b[1]] };
      }
      const r = ik(a, b, L * 0.5, L * 0.5, s);
      return { coude: r.plie ? r.milieu : null, main: r.bout, decalage: [r.bout[0] - b[0], r.bout[1] - b[1]] };
    }
    __name(bras2os, "bras2os");
    var CUISSE = [16, 9, 0, -8, -16, -11, 1, 12];
    var LEVE = [0, 0, 0, 0, 0, 1.2, 1.9, 0.8];
    var BRAS = [-14, -10, 0, 10, 14, 10, 0, -10];
    var DEVANT = { se: [-0.62, 0.42], ne: [0.62, -0.42], front: [0, 0.3] };
    var phaseJambe = /* @__PURE__ */ __name((c, gauche, view) => (c.marcheN + (gauche === (view !== "ne") ? 0 : 4)) % 8, "phaseJambe");
    function osJambe(c, hanche, i, view) {
      const L = c.ground - c.hip, F = DEVANT[view] || DEVANT.front;
      const a = CUISSE[i] * Math.PI / 180;
      const au = L * Math.sin(a), av = L * Math.cos(a) - LEVE[i];
      const P = /* @__PURE__ */ __name((u, v) => [hanche[0] + u * F[0], hanche[1] + v + u * F[1]], "P");
      const ch = P(au, av), g = [(hanche[0] + ch[0]) / 2, (hanche[1] + ch[1]) / 2];
      return { genou: g, cheville: ch, plie: false, haut: av + LEVE[i] + au * F[1] };
    }
    __name(osJambe, "osJambe");
    function descente(c, view) {
      const L = c.ground - c.hip;
      return L - Math.max(...[true, false].map((g) => osJambe(c, [0, 0], phaseJambe(c, g, view), view).haut));
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
      const reprise = r2(1 - Math.abs(Math.cos(n / 8 * Math.PI * 2)) + descente(cc, v));
      return reprise ? `<g transform="translate(0 ${reprise})">${s}</g>` : s;
    }
    __name(marcher, "marcher");
    function jambe(c, x, y, dir, tilt) {
      const view = c.view || "front", [lx, rx] = c.legX[view], base = x < 24 ? lx : rx;
      const avant = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const L = c.ground - c.hip;
      const hanche = [base, c.hip];
      if (c.marcheN != null) {
        const os = osJambe(c, hanche, phaseJambe(c, x < 24, view), view);
        return c.jambe ? c.jambe(c, r2(os.cheville[0]), r2(os.cheville[1]), dir, 0) : dessinJambe(c, hanche, os, dir, 0, avant);
      }
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
      tilt = tilt ? r2(tilt * 0.25) : 0;
      if (Math.abs(x - base) > 2.5) hanche[0] = x;
      const pivot = [x - (dir < 0 ? 3 : -3), y + 4.5], t = (tilt || 0) * Math.PI / 180;
      const cheville = tilt ? [pivot[0] + (x - pivot[0]) * Math.cos(t) - (y - pivot[1]) * Math.sin(t), pivot[1] + (x - pivot[0]) * Math.sin(t) + (y - pivot[1]) * Math.cos(t)] : [x, y];
      const s = avant ? cote(hanche, cheville, [hanche[0] + avant * 10, (hanche[1] + cheville[1]) / 2]) : 1;
      const r = avant ? ik(hanche, cheville, L * 0.5, L * 0.5, s) : { bout: [cheville[0], Math.min(cheville[1], c.ground)], milieu: [(base + cheville[0]) / 2, (c.hip + Math.min(cheville[1], c.ground)) / 2], plie: false };
      return dessinJambe(c, hanche, { genou: r.milieu, cheville: r.bout, plie: r.plie, pied: [x + (r.bout[0] - cheville[0]), y + (r.bout[1] - cheville[1])] }, dir, tilt, avant);
    }
    __name(jambe, "jambe");
    function dessinJambe(c, hanche, os, dir, tilt, avant) {
      const k = os.genou, [fx, fy] = os.cheville, [px, py] = os.pied || os.cheville;
      const plie = os.plie != null ? os.plie : Math.abs((k[0] - hanche[0]) * (fy - hanche[1]) - (k[1] - hanche[1]) * (fx - hanche[0])) > 1.2;
      const w = c.legW, pt = /* @__PURE__ */ __name((p) => `${r2(p[0])},${r2(p[1])}`, "pt");
      const len = Math.hypot(fx - k[0], fy - k[1]) || 1, bas = [fx + (fx - k[0]) / len * 1.2, fy + (fy - k[1]) / len * 1.2];
      const d = `M${pt(hanche)} L${pt(k)} L${pt(bas)}`;
      const bord = /* @__PURE__ */ __name((p, q, o2) => {
        const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = (q[1] - p[1]) / l, ny = -(q[0] - p[0]) / l, sx = nx < 0 ? -1 : 1;
        return [[p[0] + nx * o2 * sx, p[1] + ny * o2 * sx], [q[0] + nx * o2 * sx, q[1] + ny * o2 * sx]];
      }, "bord");
      const o = w / 2 - 0.85, [h1, k1] = bord(hanche, k, o), [k2, b2] = bord(k, [fx, fy], o);
      let out = `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + W * 2)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c.leg}" stroke-width="${r2(w)}" stroke-linejoin="round"/><path d="M${pt([h1[0], h1[1] + 0.6])} L${pt(k1)} L${pt(k2)} L${pt(b2)}" fill="none" stroke="${c.legS}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (plie) {
        const n = [k[0] - avant * 0.2, k[1]];
        out += `<path d="M${r2(n[0] - avant * 0.9)},${r2(n[1] - 0.5)} Q${r2(n[0] + avant * 0.4)},${r2(n[1])} ${r2(n[0] - avant * 0.9)},${r2(n[1] + 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".35"/>`;
      }
      const angle = r2(-Math.atan2(fx - hanche[0], fy - hanche[1]) * 180 / Math.PI);
      const cs = c.foot ? { ...c, jambeSeg: { hanche, cheville: [fx, fy], angle } } : c;
      return out + (c.foot ? c.foot(cs, px, py, dir, tilt, k) : shoe(c, px, py, dir, tilt));
    }
    __name(dessinJambe, "dessinJambe");
    function poserBras(c, a, b, elbow, main) {
      if (c.marcheN != null && !c.course && !elbow && main == null) {
        const m = brasMarche(c, a);
        return { b: [r2(m.main[0]), r2(m.main[1])], elbow: m.coude ? [r2(m.coude[0]), r2(m.coude[1])] : null, main };
      }
      if (c.course && !elbow && main == null) {
        const g = a[0] < 24, rest = c.hands[g ? 0 : 1], dx2 = b[0] - rest[0], dy2 = b[1] - rest[1];
        elbow = [r2(a[0] + (g ? -1.6 : 1.6) - dx2 * 0.5), r2(a[1] + 5.2 - dy2 * 0.35)];
        b = [r2(rest[0] + dx2 * 1.6 + (g ? 2.4 : -2.4)), r2(a[1] + 7 + dy2 * 1.4)];
      }
      const r = bras2os(c, a, b, elbow);
      const [dx, dy] = r.decalage;
      if (main != null && (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02)) main = `<g transform="translate(${r2(dx)} ${r2(dy)})">${main}</g>`;
      return { b: [r2(r.main[0]), r2(r.main[1])], elbow: r.coude ? [r2(r.coude[0]), r2(r.coude[1])] : null, main };
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
      return pts.map((q) => [r2(q[0]), r2(q[1])]);
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
      const pt = /* @__PURE__ */ __name((q) => `${r2(q[0])},${r2(q[1])}`, "pt");
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
      const g = poserBras(c, a, b, elbow, main), T2 = require_troupe();
      const ligne = ligneBras(a, g.elbow, g.b);
      let milieu = ligne.slice(1, -1);
      if (c.sleeves || c.bandage) milieu = milieu.filter((q) => dist(q, g.b) > 6.5);
      const coude = milieu.length ? milieu : void 0;
      if (!c.cuff || c.sleeves || c.bandage) return T2.arm({ ...c, bras: null }, a, g.b, coude, g.main, partie);
      let s = "";
      if (partie !== "devant") {
        const r = anneau(ligne, 2.5, 0.9, c.armW / 2 + 0.1);
        s += T2.arm({ ...c, bras: null, cuff: null }, a, g.b, coude, g.main, "derriere") + `<path d="${r.d}" fill="${OUT}" stroke="${OUT}" stroke-width="${r2(W * 2)}" stroke-linejoin="round"/><path d="${r.d}" fill="${c.cuff}"/>`;
      }
      if (partie === "derriere") return s;
      return s + (g.main != null ? g.main : T2.poing(c, g.b));
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
    var { ENCRE_KIT: OUT, hsl, ton, enPersonnage } = require_couleurs();
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
    function dechirure(a, q, b, seed = 1) {
      const r = /* @__PURE__ */ __name((i) => {
        const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
        return v - Math.floor(v);
      }, "r");
      const tongues = [[0.24 + r(1) * 0.08, 2.5 + r(2) * 0.6, 0.11], [0.66 + r(3) * 0.08, 1.7 + r(4) * 0.5, 0.085]];
      const notches = [[0.45 + r(5) * 0.06, 0.55, 0.035], [0.88 - r(6) * 0.04, 0.5, 0.03]];
      const N = 40, pts = [], tips = [];
      for (let i = 1; i <= N; i++) {
        const t = i / N, u = 1 - t;
        const x = u * u * a[0] + 2 * u * t * q[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * q[1] + t * t * b[1];
        let dy = (r(10 + i) - 0.5) * 0.3 * (i < N ? 1 : 0);
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
        const p = pts[Math.round(c * N) - 1];
        tips.push(p);
      }
      return { d: pts.map(([x, y]) => `L${r2(x)},${r2(y)}`).join(" "), tips };
    }
    __name(dechirure, "dechirure");
    var filPendant = /* @__PURE__ */ __name((x, y, m = 1) => `<path d="M${r2(x)},${r2(y - 0.2)} q${r2(m * 0.45)},0.8 ${r2(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width=".45" stroke-linecap="round"/>`, "filPendant");
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
      const [bi, bo, a0] = BROW[expr], arch = a0 + (g.browArch || 0);
      for (const [x, y, rx] of g.eyes) {
        const k = cx > x ? 1 : -1, hw = rx + 0.45 + (g.browLen || 0), by = y + g.browY + (g.browLift || 0);
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
      else if (expr === "soulage") {
        s += line(`M${r2(mx - w * 0.72)},${r2(my + 0.1)} Q${mx},${r2(my + w * 0.62)} ${r2(mx + w * 0.72)},${r2(my + 0.1)}`);
        for (const [x, rx] of g.cheeks) s += E(x, g.cheekY, rx * 1.2, 1.2, "#F08A8A", 0).replace("/>", ' opacity=".45"/>');
      }
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
    var pivotPied = /* @__PURE__ */ __name((c, x, y, dir) => c.jambe ? `${r2(x)} ${r2(y + 0.6)}` : `${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)}`, "pivotPied");
    function shoe(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 3)},${r2(y)} L${r2(x + 3)},${r2(y)} L${r2(x + 3.3)},${r2(y + 3.6)} Q${r2(x - 0.4)},${r2(y + 5.4)} ${r2(x - 3.3 - toe)},${r2(y + 3.8)} Z`;
      const sole = `M${r2(x - 3.4 - toe)},${r2(y + 3.3)} Q${r2(x - 0.4)},${r2(y + 5)} ${r2(x + 3.4)},${r2(y + 3.1)} L${r2(x + 3.4)},${r2(y + 5.6)} L${r2(x - 3.4 - toe)},${r2(y + 5.6)} Z`;
      const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, "none") + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${body}</g>` : body;
    }
    __name(shoe, "shoe");
    function bareFoot(c, x, y, dir, tilt = 0) {
      const toe = dir < 0 ? 1.4 : 0;
      const d = `M${r2(x - 2.3)},${r2(y)} L${r2(x + 2.3)},${r2(y)} Q${r2(x + 2.9)},${r2(y + 3.4)} ${r2(x + 1.4)},${r2(y + 4.3)} L${r2(x - 1.4 - toe)},${r2(y + 4.3)} Q${r2(x - 3.1 - toe)},${r2(y + 3.8)} ${r2(x - 2.3)},${r2(y)} Z`;
      let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
      return tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${s}</g>` : s;
    }
    __name(bareFoot, "bareFoot");
    function leg(c, x, y, dir, tilt) {
      if (c.jambeOs) return c.jambeOs(c, x, y, dir, tilt);
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
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
      if (c.bras) return c.bras(c, a, b, elbow, main, partie);
      const pts = enfoncer(elbow ? Array.isArray(elbow[0]) ? [a, ...elbow, b] : [a, elbow, b] : [a, b]);
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
      if (c.os && pose === "marche" && c.marcheN == null) return require_membres().marcher(c, view, n, expr);
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
      const loinG = view === "se" && c.brasLointain === "gauche";
      const dosG = view === "ne" && c.brasLointain === "gauche";
      const ecart = loinG || dosG ? 1.3 : 0, ecartD = dosG ? 1.3 : 0;
      const shL = [c.shoulders[0][0] - ecart, c.shoulders[0][1]], shR = [c.shoulders[1][0] + ecartD, c.shoulders[1][1]];
      const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4;
      const handL = [r2(c.hands[0][0] - ecart + swing * bal), r2(c.hands[0][1] + swing * balY)];
      const handR = [r2(c.hands[1][0] + ecartD - swing * bal), r2(c.hands[1][1] - swing * balY)];
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
      let haut = (loinG ? armLeft : dosG ? armLeft + armRight : "") + c.body(cc, ctx) + menton;
      if (view !== "front" && !dosG) haut += armRight;
      haut += c.neck ? c.neck(cc, ctx) : "";
      if (view === "front") haut += armLeft + armRight;
      else if (!loinG && !dosG) haut += armLeft;
      haut += c.overArms ? c.overArms(cc, ctx) : "";
      haut += c.head(cc, ctx, act || {});
      haut += c.overHead ? c.overHead(cc, ctx) : "";
      haut += c.holdOver ? held : "";
      haut += act && act.over ? act.over : "";
      s += legs.join("") + (breath ? `<g transform="translate(0 ${breath})">${haut}</g>` : haut);
      const { defs, table } = lumiere(c, id);
      return enPersonnage(defs + `<g transform="translate(0 ${bob})">${peindre(s, table)}</g>`);
    }
    __name(frame, "frame");
    var svg = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`, "svg");
    var POSES = [["face_repos", "front", "repos", IMAGES.repos], ["avant_marche", "se", "marche", IMAGES.marche], ["dos_marche", "ne", "marche", IMAGES.marche], ["face_salut", "front", "salut", IMAGES.salut]];
    module.exports = { OUT, W, r2, st, P, E, L, limb, clip, pivotPied, eyes, expression, visageVide, EXPRS, TRAITS, dechirure, filPendant, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
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
    var { P, E, L, zee, r2 } = require_troupe2();
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
    var WHITE = "#FFFFFF";
    function oeil(cx, cy, rx, ry, haut = null, bas = 0, reflet = 1) {
      const lid = /* @__PURE__ */ __name((x) => haut ? cy - ry + haut.k * 2 * ry + (haut.pente || 0) * (x - cx) : -Infinity, "lid");
      const sol = /* @__PURE__ */ __name((x) => cy + ry - bas * 2 * ry - bas * ry * 0.7 * (1 - ((x - cx) / rx) ** 2), "sol");
      const pts = [];
      for (let i = 0; i < 28; i++) {
        const t = i / 28 * Math.PI * 2, x = cx + rx * Math.cos(t);
        let y = cy + ry * Math.sin(t);
        y = Math.min(Math.max(y, lid(x)), Math.max(sol(x), lid(x)));
        pts.push([x, y]);
      }
      let s = `<path d="M${pts.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" L")} Z" fill="${NAVY}"/>`;
      const hx = cx - rx * 0.3, hr = rx * 0.4 * reflet, hy = Math.max(cy - ry * 0.42, lid(hx) + hr + 0.15);
      if (hy + hr < sol(hx)) s += E(hx, hy, hr, hr * 1.1, WHITE, 0);
      const px = cx + rx * 0.36, py = Math.min(cy + ry * 0.42, sol(px) - 0.4);
      if (py > lid(px) + 0.3) s += E(px, py, rx * 0.2 * reflet, rx * 0.2 * reflet, WHITE, 0);
      return s;
    }
    __name(oeil, "oeil");
    var ferme = /* @__PURE__ */ __name((cx, cy, w, joie) => `<path d="M${r2(cx - w)},${r2(cy + (joie ? 0.5 : -0.3))} Q${r2(cx)},${r2(cy + (joie ? -1.5 : 1.3))} ${r2(cx + w)},${r2(cy + (joie ? 0.5 : -0.3))}" fill="none" stroke="${NAVY}" stroke-width="0.85" stroke-linecap="round"/>`, "ferme");
    var goutte = /* @__PURE__ */ __name((x, y, r, fill) => `<path d="M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z" fill="${fill}" stroke="${NAVY}" stroke-width="0.4"/>` + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0), "goutte");
    var joues = /* @__PURE__ */ __name((x, ey, a = 1) => E(x - 5.2, ey + 2.6, 1.5, 0.85, "#F7A8B0", 0).replace("fill=", `fill-opacity="${a}" fill=`) + E(x + 5.2, ey + 2.6, 1.5, 0.85, "#F7A8B0", 0).replace("fill=", `fill-opacity="${a}" fill=`), "joues");
    function faceOf(x, y, r, n, expr) {
      const ey = y - r * 0.05, dx = 3.1, rx = 1.45, ry = 2;
      const deux = /* @__PURE__ */ __name((fn) => fn(x - dx, -1) + fn(x + dx, 1), "deux");
      switch (expr) {
        case "content":
          return joues(x, ey) + deux((cx) => oeil(cx, ey + 0.2, rx * 1.04, ry, null, 0.17, 1.1));
        case "rire":
          return joues(x, ey) + deux((cx) => ferme(cx, ey, 1.5, true));
        case "surpris":
          return deux((cx) => oeil(cx, ey - 0.4, rx * 1.15, ry * 1.2, null, 0, 1.15));
        case "triste":
          return deux((cx, c) => oeil(cx, ey + 0.2, rx, ry, { k: 0.32, pente: -0.5 * c * -1 }, 0, 1.1)) + goutte(x - dx - 0.8, ey + 3.2 + n % 2 * 1.1, 0.85, "#A9DCFF");
        case "gene":
          return joues(x, ey, 1) + deux((cx, c) => oeil(cx + 0.5, ey + 0.45, rx * 0.95, ry * 0.92, { k: 0.34, pente: 0.22 * c }, 0)) + goutte(x + r + 2.4, y - r * 0.9 + n % 2 * 0.8, 1.3, "#A9DCFF");
        case "endormi":
          return deux((cx) => ferme(cx, ey + 0.4, 1.4, false)) + (n % 2 ? zee(x + 7, y - r * 2, 2) + zee(x + 10, y - r * 2.5, 2.6) : zee(x + 6.4, y - r * 1.8, 1.8) + zee(x + 9.2, y - r * 2.3, 2.4));
        case "cligne":
          return deux((cx) => ferme(cx, ey + 0.4, 1.4, false));
        case "curieuse":
          return deux((cx, c) => oeil(cx - 0.55, ey - 0.15, rx * (c < 0 ? 1.06 : 0.98), ry * (c < 0 ? 1.06 : 0.98)));
        default:
          return n === 3 ? deux((cx) => ferme(cx, ey + 0.4, 1.4, false)) : deux((cx) => oeil(cx, ey, rx, ry));
      }
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
    module.exports = { STAGES, brumeFrame, brumeEyes, svgB, flamePath };
  }
});

// atelier/anya.js
var require_anya = __commonJS({
  "atelier/anya.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, r2, IMAGES, lerp, lumiere, peindre, TRAITS } = require_troupe2();
    var { enPersonnage } = require_couleurs();
    var C = {
      skin: "#EFE6CF",
      skinS: "#D6CBB0",
      vein: "#E8B84A",
      hair: "#D8DEE9",
      hairS: "#9FA9BE",
      hairH: "#F6F8FC",
      // la chevelure argentée (choix de l'auteur, 16 oct. ; verte à l'origine)
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
      s += `<defs><radialGradient id="${uid}g"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="${r2(0.6 * glowK)}"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="62" rx="${r2(40 * Math.min(1, glowK))}" ry="${r2(62 * Math.min(1, glowK))}" fill="url(#${uid}g)"/>`;
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
          ...TRAITS.femme,
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
      return enPersonnage(defs + peindre(s, table));
    }
    __name(anyaFrame, "anyaFrame");
    var POSES_A = [["face_repos", "front", "repos", IMAGES.repos], ["avant_marche", "se", "marche", IMAGES.marche], ["dos_marche", "ne", "marche", IMAGES.marche], ["face_benediction", "front", "salut", IMAGES.salut], ["face_eveil", "front", "action", 2]];
    var EXPR_OF = { repos: "neutre", marche: "neutre", salut: "content", action: "content" };
    var svgA = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${128 * scale}" viewBox="0 0 80 128">${body}</svg>`, "svgA");
    module.exports = { anyaFrame, POSES_A, EXPR_OF, svgA, SAISONS_A };
  }
});

// personnages/refonte/visage.js
var require_visage = __commonJS({
  "personnages/refonte/visage.js"(exports, module) {
    var { P, E, L, clip, drop, zee, r2, OUT } = require_troupe();
    var BASE = { brow: [0.15, 0.05, -0.4], lid: 0.13, tilt: 0.05, low: 0, look: [0, 0.1], under: 0.6, mouth: "flat", extras: [] };
    var X = /* @__PURE__ */ __name((o) => ({ ...BASE, ...o }), "X");
    var EXPR = {
      // le caractère
      veille: X({}),
      decidee: X({ brow: [0.95, -0.3, -0.05], lid: 0.16, tilt: 0.4, low: 0.1, look: [0, 0], under: 0.45, mouth: "firm" }),
      mefiante: X({ brow: [0.9, -0.2, 0], browR: [-0.6, -1.1, -0.7], lid: 0.32, tilt: 0.3, low: 0.12, look: [-0.55, 0.1], mouth: "side" }),
      pensive: X({ brow: [-0.4, 0.1, -0.3], browL: [-0.9, -0.4, -0.5], lid: 0.2, look: [-0.5, -0.5], mouth: "side" }),
      ironique: X({ brow: [0.2, 0, -0.3], browL: [-1, -1.3, -0.7], lid: 0.28, tilt: 0.1, low: 0.1, look: [0.35, 0], mouth: "smirk" }),
      concentree: X({ brow: [1.1, 0, -0.1], lid: 0.22, tilt: 0.35, low: 0.08, look: [0, 0.25], mouth: "bite" }),
      // la joie
      sourire: X({ brow: [-0.3, -0.15, -0.6], lid: 0.08, tilt: 0, low: 0.27, look: [0, 0], under: 0.4, mouth: "half" }),
      rire: X({ brow: [-0.7, -0.5, -0.8], mode: "joy", under: 0.3, mouth: "laugh", extras: ["blush"] }),
      tendresse: X({ brow: [-0.6, 0, -0.5], mode: "closed", under: 0.3, mouth: "soft", extras: ["blush"] }),
      soulagee: X({ brow: [-1, 0.3, -0.4], mode: "closed", under: 0.6, mouth: "soft", extras: ["sweat"] }),
      emerveillee: X({ brow: [-1.3, -1, -0.9], lid: 0, wide: true, sparkle: true, look: [0, -0.3], under: 0.3, mouth: "wow", extras: ["blush"] }),
      // la peine
      inquiete: X({ brow: [-1.15, 0.4, 0.05], lid: 0.08, tilt: -0.35, look: [0, 0.4], under: 0.7, mouth: "wave" }),
      triste: X({ brow: [-1.3, 0.6, 0.1], lid: 0.25, tilt: -0.4, look: [0, 0.7], under: 0.8, mouth: "down", wet: true, extras: ["tears"] }),
      sanglot: X({ brow: [-1.5, 0.7, 0.2], mode: "squeeze", under: 0.8, mouth: "sob", extras: ["stream", "blush"] }),
      coupable: X({ brow: [-1.2, 0.55, 0.15], lid: 0.32, tilt: -0.3, look: [0.3, 0.6], under: 0.8, mouth: "press", wet: true }),
      genee: X({ brow: [-0.9, 0.3, -0.2], lid: 0.2, tilt: -0.2, look: [-0.6, 0.4], mouth: "wave", extras: ["hatch", "sweat"] }),
      // la peur, la colère
      surprise: X({ brow: [-1.4, -1.1, -0.9], lid: 0, look: [0, -0.1], under: 0.35, mouth: "o", wide: true }),
      peur: X({ brow: [-1.6, -0.2, -0.3], lid: 0, wide: true, small: true, look: [0, 0], mouth: "fear", extras: ["sweat"] }),
      colere: X({ brow: [1.4, -0.65, 0.15], lid: 0.27, tilt: 0.75, low: 0.12, look: [0, -0.1], under: 0.5, mouth: "teeth", extras: ["vein"] }),
      cri: X({ brow: [1.5, -0.8, 0.2], lid: 0.12, tilt: 0.7, low: 0.1, look: [0, 0], mouth: "shout" }),
      boude: X({ brow: [1, 0.1, 0], lid: 0.3, tilt: 0.3, look: [0.6, 0.2], mouth: "pout", extras: ["blush"] }),
      // le corps
      epuisee: X({ brow: [-0.5, 0.35, -0.15], lid: 0.45, tilt: -0.1, low: 0.04, look: [0, 0.35], under: 1, mouth: "open" }),
      endormie: X({ brow: [0.2, 0.3, -0.3], mode: "closed", under: 0.8, mouth: "sleep", extras: ["zz"] }),
      froid: X({ brow: [-1, 0.2, -0.1], lid: 0.2, tilt: -0.15, low: 0.1, look: [0, 0.2], under: 0.7, mouth: "chatter", extras: ["cold"] }),
      douleur: X({ brow: [1.2, -0.2, 0], browR: [-0.6, 0.3, 0], eyeL: { mode: "shut" }, lid: 0.35, tilt: -0.2, low: 0.15, look: [0, 0.2], mouth: "teeth", extras: ["sweat"] }),
      clin: X({ brow: [-0.2, -0.1, -0.5], eyeR: { mode: "joy" }, low: 0.2, look: [0, 0], under: 0.4, mouth: "smirk" }),
      cligne: X({ mode: "closed" }),
      // l'œil à la longue-vue (l'action d'aster.js : ctx.eyeMode « wink ») : l'œil lointain fermé, plissé, le sourcil qui descend
      visee: X({ brow: [0.7, -0.1, -0.2], browR: [1, 0.4, 0], eyeR: { mode: "shut" }, lid: 0.2, low: 0.1, mouth: "firm" })
    };
    var ALIAS = { neutre: "veille", content: "sourire", surpris: "surprise", fache: "colere", gene: "genee", endormi: "endormie" };
    function eye(id, x, y, k, e, K) {
      const rx = (e.wide ? K.eyeRx + 0.15 : K.eyeRx) * (e.rk || 1), ry = e.wide ? K.eyeRy + 0.2 : K.eyeRy;
      const under = E(x, y + ry + 0.25, 1.9, 0.75, K.under, 0).replace("/>", ` opacity="${r2(0.3 * e.under)}"/>`);
      const flick = /* @__PURE__ */ __name((yy, w = 0.6) => P(`M${r2(x - k * rx)},${r2(yy)} l${r2(-k * 0.7)},-0.5`, "none", w), "flick");
      if (e.mode === "closed") return under + P(`M${r2(x - rx)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + rx)},${r2(y + 0.4)}`, "none", 1) + flick(y + 0.4);
      if (e.mode === "joy") return under + P(`M${r2(x - rx)},${r2(y + 1)} Q${x},${r2(y - 1.5)} ${r2(x + rx)},${r2(y + 1)}`, "none", 1.1) + flick(y + 1);
      if (e.mode === "squeeze") return P(`M${r2(x - k * 1.5)},${r2(y - 1.4)} L${r2(x + k * 1.2)},${r2(y + 0.1)} L${r2(x - k * 1.5)},${r2(y + 1.5)}`, "none", 1.1);
      if (e.mode === "shut") return P(`M${r2(x - rx)},${r2(y + 0.3)} Q${x},${r2(y - 0.3)} ${r2(x + rx)},${r2(y + 0.5)}`, "none", 1.1) + P(`M${r2(x - k * 0.6)},${r2(y - 1.6)} l${r2(k * 0.9)},0.7 M${r2(x - k * 0.2)},${r2(y + 1.8)} l${r2(k * 0.9)},-0.5`, "none", 0.5);
      const [lx, ly] = e.look;
      const top = y - ry + e.lid * 2 * ry;
      const tin = top + (e.tilt || 0), tout = top - (e.tilt || 0) * 0.6;
      const xin = x + k * (rx + 0.25), xout = x - k * (rx + 0.35);
      const lidLine = `M${r2(xout)},${r2(tout + 1.6)} Q${x},${r2(Math.min(tin, tout) - 1.2)} ${r2(xin)},${r2(tin + 1.6)}`;
      const bot = y + ry - (e.low || 0) * 2 * ry;
      const ix = x + lx, iy = y + ly;
      const [irx, iry, pr] = e.small ? [0.95, 1.2, 0.38] : [1.45, 1.8, 0.66];
      let inner = E(x, y, rx, ry, e.small ? "#FFFFFF" : K.eye, 0) + E(ix, iy + 0.55, irx, iry, K.iris, e.small ? 0.5 : 0) + (e.small ? "" : P(`M${r2(ix - 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 2.5)} ${r2(ix + 1.2)},${r2(iy + 1)} Q${r2(ix)},${r2(iy + 1.7)} ${r2(ix - 1.2)},${r2(iy + 1)} Z`, K.irisL, 0)) + E(ix, iy + 0.35, pr, pr * 1.1, K.eye, 0) + E(ix - k * 0.55 * (e.small ? 0.6 : 1), Math.max(iy - 0.85, top + 0.7), e.small ? 0.36 : 0.72, e.small ? 0.36 : 0.72, "#FFFFFF", 0) + (e.small ? "" : E(ix + k * 0.45, iy + 1.15, 0.28, 0.28, "#FFFFFF", 0));
      if (e.sparkle) inner += P(`M${r2(ix + k * 0.5)},${r2(iy - 0.2)} l0.25,0.6 l0.6,0.25 l-0.6,0.25 l-0.25,0.6 l-0.25,-0.6 l-0.6,-0.25 l0.6,-0.25 Z`, "#FFFFFF", 0);
      if (e.wet) inner += P(`M${r2(x - rx)},${r2(y + 1.2)} Q${x},${r2(y + 1.9)} ${r2(x + rx)},${r2(y + 1.2)} L${r2(x + rx)},${r2(y + ry + 0.5)} L${r2(x - rx)},${r2(y + ry + 0.5)} Z`, "#CDEFF0", 0).replace("/>", ' opacity=".55"/>');
      if (e.lid > 0 || e.tilt) inner += P(`${lidLine} L${r2(xin)},${r2(y - ry - 2)} L${r2(xout)},${r2(y - ry - 2)} Z`, K.lid, 0);
      if (e.low) inner += P(`M${r2(x - rx - 0.5)},${r2(bot + 0.2)} Q${x},${r2(bot - 0.8)} ${r2(x + rx + 0.5)},${r2(bot + 0.2)} L${r2(x + rx + 0.5)},${r2(y + ry + 1)} L${r2(x - rx - 0.5)},${r2(y + ry + 1)} Z`, K.lid, 0);
      let s = under;
      s += clip(id, `M${r2(x - rx)},${y} a${rx},${ry} 0 1,0 ${r2(2 * rx)},0 a${rx},${ry} 0 1,0 ${r2(-2 * rx)},0 Z`, inner);
      if (e.small) s += E(x, y, rx, ry, "none", 0.7);
      s += P(lidLine, "none", 0.95);
      s += P(`M${r2(xout + k * 0.1)},${r2(tout + 1.55)} l${r2(-k * 0.7)},${r2(-0.6)}`, "none", 0.65);
      if (e.low) s += P(`M${r2(x - rx * 0.7)},${r2(bot + 0.05)} Q${x},${r2(bot - 0.6)} ${r2(x + rx * 0.7)},${r2(bot + 0.05)}`, "none", 0.45);
      return s;
    }
    __name(eye, "eye");
    function brow(x, y, k, b, split, sc, K) {
      sc = sc || 1;
      const [bi, bo, arch] = b, hw = 2.4 * sc;
      const xi = x + k * hw, xo = x - k * hw, yi = y + bi, yo = y + bo, mx = x, my = (yi + yo) / 2 + arch;
      const t = K.browW || 1;
      let s = P(`M${r2(xi)},${r2(yi - 0.5 * t)} Q${r2(mx)},${r2(my - 0.55 * t)} ${r2(xo)},${r2(yo)} Q${r2(mx)},${r2(my + 0.35 * t)} ${r2(xi)},${r2(yi + 0.55 * t)} Z`, K.brow, 0);
      if (split) s += L([x - k * 0.35, (yi + yo) / 2 - 1], [x - k * 0.05, (yi + yo) / 2 + 1], K.skin, 0.55) + L([x - k * 0.5, (yi + yo) / 2 - 1.9], [x - k * 0.3, (yi + yo) / 2 - 1], "#B5473A", 0.4);
      return s;
    }
    __name(brow, "brow");
    function mouth(kind, mx, my, id, K) {
      const line = /* @__PURE__ */ __name((d) => P(d, "none", 0.85), "line");
      const lip = L([mx - 0.5, my + 1.4], [mx + 0.5, my + 1.4], K.skinS, 0.45);
      const open = /* @__PURE__ */ __name((d, tongue = true, teeth = false) => P(d, K.mouth, 0.85) + clip(id, d, (tongue ? E(mx, my + 2.1, 1.3, 0.85, "#D9786C", 0) : "") + (teeth ? `<rect x="${r2(mx - 2.5)}" y="${r2(my - 0.6)}" width="5" height="1.05" fill="#FFFFFF"/>` : "")), "open");
      switch (kind) {
        case "firm":
          return line(`M${r2(mx - 1.5)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.2)}`) + line(`M${r2(mx + 1.4)},${r2(my + 0.2)} l0.35,0.45`);
        case "wave":
          return P(`M${r2(mx - 1.4)},${r2(my + 0.6)} Q${r2(mx - 0.7)},${r2(my + 0.05)} ${mx},${r2(my + 0.45)} Q${r2(mx + 0.7)},${r2(my + 0.85)} ${r2(mx + 1.4)},${r2(my + 0.35)}`, "none", 0.75);
        case "half":
          return line(`M${r2(mx - 1.4)},${r2(my + 0.15)} Q${r2(mx + 0.2)},${r2(my + 1)} ${r2(mx + 1.6)},${r2(my - 0.45)}`) + line(`M${r2(mx + 1.6)},${r2(my - 0.45)} l0.2,-0.3`);
        case "smirk":
          return line(`M${r2(mx - 1.2)},${r2(my + 0.45)} Q${r2(mx + 0.4)},${r2(my + 0.6)} ${r2(mx + 1.7)},${r2(my - 0.5)}`) + lip;
        case "side":
          return line(`M${r2(mx - 0.4)},${r2(my + 0.5)} Q${r2(mx + 0.6)},${r2(my + 0.3)} ${r2(mx + 1.7)},${r2(my + 0.1)}`) + L([mx + 0.2, my + 1.4], [mx + 1, my + 1.3], K.skinS, 0.45);
        case "bite":
          return line(`M${r2(mx - 1.4)},${r2(my + 0.3)} L${r2(mx + 1.4)},${r2(my + 0.3)}`) + P(`M${r2(mx - 0.7)},${r2(my + 0.3)} L${r2(mx - 0.6)},${r2(my + 1)} L${r2(mx + 0.1)},${r2(my + 1)} L${r2(mx + 0.2)},${r2(my + 0.3)} Z`, "#FFFFFF", 0.45);
        case "soft":
          return line(`M${r2(mx - 1.3)},${r2(my + 0.15)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.15)}`);
        case "laugh":
          return open(`M${r2(mx - 2)},${r2(my - 0.2)} Q${mx},${r2(my - 0.6)} ${r2(mx + 2)},${r2(my - 0.2)} Q${r2(mx + 1.6)},${r2(my + 3.4)} ${mx},${r2(my + 3.4)} Q${r2(mx - 1.6)},${r2(my + 3.4)} ${r2(mx - 2)},${r2(my - 0.2)} Z`, true, true);
        case "wow":
          return open(`M${r2(mx - 1.2)},${r2(my + 0.1)} Q${mx},${r2(my - 0.3)} ${r2(mx + 1.2)},${r2(my + 0.1)} Q${r2(mx + 1)},${r2(my + 2)} ${mx},${r2(my + 2)} Q${r2(mx - 1)},${r2(my + 2)} ${r2(mx - 1.2)},${r2(my + 0.1)} Z`);
        case "shout":
          return open(`M${r2(mx - 1.9)},${r2(my - 0.3)} L${r2(mx + 1.9)},${r2(my - 0.5)} Q${r2(mx + 1.8)},${r2(my + 3.6)} ${mx},${r2(my + 3.6)} Q${r2(mx - 1.8)},${r2(my + 3.6)} ${r2(mx - 1.9)},${r2(my - 0.3)} Z`, true, true);
        case "fear":
          return open(`M${r2(mx - 1.6)},${r2(my + 0.6)} Q${r2(mx - 0.8)},${r2(my - 0.1)} ${mx},${r2(my + 0.4)} Q${r2(mx + 0.8)},${r2(my - 0.1)} ${r2(mx + 1.6)},${r2(my + 0.6)} L${r2(mx + 1.2)},${r2(my + 1.9)} Q${mx},${r2(my + 1.5)} ${r2(mx - 1.2)},${r2(my + 1.9)} Z`, false, true);
        case "sob":
          return open(`M${r2(mx - 1.5)},${r2(my + 1.6)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.5)},${r2(my + 1.6)} Q${mx},${r2(my + 2.4)} ${r2(mx - 1.5)},${r2(my + 1.6)} Z`, false);
        case "pout":
          return P(`M${r2(mx - 1)},${r2(my + 0.5)} Q${mx},${r2(my - 0.2)} ${r2(mx + 1)},${r2(my + 0.5)} Q${mx},${r2(my + 1.2)} ${r2(mx - 1)},${r2(my + 0.5)} Z`, "#C9665B", 0.75);
        case "chatter":
          return P(`M${r2(mx - 1.7)},${r2(my + 0.1)} L${r2(mx + 1.7)},${r2(my + 0.1)} L${r2(mx + 1.5)},${r2(my + 1.4)} L${r2(mx - 1.5)},${r2(my + 1.4)} Z`, "#FFFFFF", 0.8) + P(`M${r2(mx - 1.4)},${r2(my + 0.75)} l0.7,-0.35 l0.7,0.35 l0.7,-0.35 l0.7,0.35`, "none", 0.4).replace(`stroke="${OUT}"`, 'stroke="#9A8A84"');
        case "sleep":
          return E(mx + 0.2, my + 0.7, 0.55, 0.65, K.mouth, 0.75);
        case "down":
          return line(`M${r2(mx - 1.4)},${r2(my + 0.9)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.4)},${r2(my + 0.9)}`);
        case "teeth":
          return P(`M${r2(mx - 1.7)},${r2(my + 0.2)} L${r2(mx + 1.7)},${r2(my + 0.05)} L${r2(mx + 1.4)},${r2(my + 1.3)} L${r2(mx - 1.4)},${r2(my + 1.4)} Z`, "#FFFFFF", 0.8) + L([mx - 1.4, my + 0.75], [mx + 1.4, my + 0.7], "#C9B8B0", 0.35);
        case "o":
          return E(mx, my + 0.7, 0.85, 1.05, K.mouth, 0.85);
        case "open":
          return P(`M${r2(mx - 1.1)},${r2(my + 0.3)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.1)},${r2(my + 0.3)} Q${mx},${r2(my + 1.4)} ${r2(mx - 1.1)},${r2(my + 0.3)} Z`, K.mouth, 0.8);
        case "press":
          return line(`M${r2(mx - 1.5)},${r2(my + 0.6)} Q${mx},${r2(my + 0.1)} ${r2(mx + 1.5)},${r2(my + 0.6)}`) + L([mx - 0.6, my + 1.5], [mx + 0.6, my + 1.5], K.skinS, 0.45);
        default:
          return line(`M${r2(mx - 1.4)},${r2(my + 0.35)} Q${r2(mx + 0.1)},${r2(my + 0.1)} ${r2(mx + 1.4)},${r2(my + 0.4)}`) + lip;
      }
    }
    __name(mouth, "mouth");
    function extras(list, n, X2 = (v) => v, dos = false) {
      let s = "";
      for (const x of list) {
        if (dos && x !== "zz" && x !== "sweat" && x !== "vein") continue;
        if (x === "blush") s += E(X2(16.8), 26.4, 2.3, 1.2, "#EE7F78", 0).replace("/>", ' opacity=".5"/>') + E(X2(31.2), 26.4, 2.3 * (X2(31.2) - X2(24)) / 7.2, 1.2, "#EE7F78", 0).replace("/>", ' opacity=".35"/>');
        if (x === "hatch") for (const cx of [X2(16.8), X2(31.2)]) for (const d of [-1, 0, 1]) s += L([cx + d * 1.1 - 0.4, 27.1], [cx + d * 1.1 + 0.4, 25.9], "#D9605A", 0.45);
        if (x === "sweat") s += drop(dos ? 34.8 : X2(13.2), 13.6 + n * 0.8, 1.7, "#A9DCFF");
        if (x === "tears") s += drop(X2(17.2), 27.1 + n * 0.9, 0.9, "#A9DCFF", 0.5);
        if (x === "stream") s += `<g transform="translate(${r2(X2(18.1) - 18.1)} 0)">${P("M17.6,24.4 Q16.8,28 17.6,31.4 L18.6,31.2 Q18,28 18.6,24.6 Z", "#A9DCFF", 0.5)}</g><g transform="translate(${r2(X2(29.9) - 29.9)} 0)">${P("M29.4,24.6 Q30,28 29.4,31.2 L30.4,31.4 Q31.2,28 30.4,24.4 Z", "#A9DCFF", 0.5)}</g>`;
        if (x === "zz") s += n ? zee(37, 5.8, 2) + zee(39.4, 2.6, 2.4) : zee(36.4, 6.6, 1.8) + zee(39, 3.4, 2.2);
        if (x === "cold") s += E(X2(24.4), 25.6, 1.2, 0.8, "#9CC8E8", 0).replace("/>", ' opacity=".7"/>') + E(X2(16.8), 26.4, 2.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + E(X2(31.2), 26.4, 2.2 * (X2(31.2) - X2(24)) / 7.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + P("M9.6,17.6 q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4 M7.8,18.6 q-0.6,0.9 0,1.8 M38.4,17.6 q0.8,1.2 0,2.4 q-0.8,1.2 0,2.4 M40.2,18.6 q0.6,0.9 0,1.8", "none", 0.6);
        if (x === "vein") {
          const a = n ? 0.6 : 0.5, b = n ? 2 : 1.7, cx = 39.6, cy = 7.4;
          const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r2(cx + i * a)},${r2(cy + j * b)} Q${r2(cx + i * a)},${r2(cy + j * a)} ${r2(cx + i * b)},${r2(cy + j * a)}`).join(" ");
          s += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
        }
      }
      return s;
    }
    __name(extras, "extras");
    var wind = /* @__PURE__ */ __name((a, b, fill, w, dur = "1.7s", begin = "0s") => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"><animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>`, "wind");
    function rides(x, y, k, K, sc = 1) {
      const o = x - k * (K.eyeRx * sc + 0.6);
      return `<path d="M${r2(o)},${r2(y - 0.6)} q${r2(-k * 0.7)},-0.1 ${r2(-k * 1)},-0.6 M${r2(o)},${r2(y + 0.3)} q${r2(-k * 0.7)},0.1 ${r2(-k * 1)},0.5" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".8"/><path d="M${r2(x - K.eyeRx * 0.7 * sc)},${r2(y + K.eyeRy + 0.85)} Q${x},${r2(y + K.eyeRy + 1.45)} ${r2(x + K.eyeRx * 0.7 * sc)},${r2(y + K.eyeRy + 0.85)}" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".7"/>`;
    }
    __name(rides, "rides");
    module.exports = { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides };
  }
});

// personnages/refonte/anya_refonte.js
var require_anya_refonte = __commonJS({
  "personnages/refonte/anya_refonte.js"(exports, module) {
    var { P, E, L, clip, r2, OUT } = require_troupe();
    var { EXPR, ALIAS, X, eye, brow, mouth, extras } = require_visage();
    var { ik, ligneBras } = require_membres();
    var C = {
      skin: "#EEF1F7",
      skinS: "#C9D2E4",
      skinH: "#FFFFFF",
      lid: "#DCE2EE",
      under: "#B9C4DA",
      cheek: "#E9C6D6",
      nose: "#B4BED4",
      eye: "#26304A",
      iris: "#7E9CC0",
      irisD: "#3E5276",
      irisR: "#D8F0FF",
      irisO: "#4A5E80",
      irisL: "#E6F6FF",
      eyeRx: 2.3,
      eyeRy: 2.75,
      brow: "#AFC0DA",
      browW: 0.55,
      mouth: "#9C6A82",
      vein: "#BFE6FF",
      star: "#FFFFFF",
      hair: "#CBD5EA",
      hairS: "#8E9CC2",
      hairH: "#F6FAFF",
      hairD: "#6E7CA6",
      antler: "#E8E4DA",
      antlerS: "#B9B2A2",
      blossom: "#FFFFFF",
      blossomC: "#CDE6FF",
      bird: "#7FA9E0",
      birdS: "#4E78B4",
      gown: "#E9EEF8",
      gownS: "#AEBBD6",
      gownH: "#FFFFFF",
      silver: "#D7DEEA",
      silverS: "#9AA6BE",
      gem: "#4FC78A",
      gemS: "#2E8A5C",
      gemH: "#C8FFE0",
      veil: "#E8F0FF",
      glow: "200,225,255",
      mist: "#E6EEFA",
      firefly: "#F4FAFF",
      moss: "#7A8A62",
      mossS: "#5A6A48",
      ivy: "#5E8A6A",
      ivyS: "#3E6A4E",
      bud: "#EADFF2",
      budS: "#B9A8CC"
    };
    var SAISONS = {
      ete: { nom: "Été", cape: "#2E5C66", capeS: "#1E3E48", nerv: "#BFE6FF", hem: "#D7DEEA", plumes: ["#E8F0FF", "#BFD4E8", "#9FC4C8"], orne: "feuilles", feuille: "#5E9A86", fleur: "#FFFFFF", ailes: ["#CFE8FF", "#FFFFFF"] },
      printemps: { nom: "Printemps", cape: "#6E7EB8", capeS: "#4E5C92", nerv: "#FFFFFF", hem: "#F7D6E6", plumes: ["#FFFFFF", "#F7D6E6", "#CFE3C2"], orne: "fleurs", feuille: "#CFE3C2", fleur: "#F7D6E6", ailes: ["#F7D6E6", "#FFFFFF"] },
      automne: { nom: "Automne", cape: "#7A4A4E", capeS: "#58343A", nerv: "#F2D6A8", hem: "#E8C9A0", plumes: ["#F2D3A0", "#C9A27A", "#E8E4DA"], orne: "feuilles", feuille: "#C2703E", fleur: "#F2C94C", ailes: ["#F2C9A0", "#FFF3DC"] },
      hiver: { nom: "Hiver", cape: "#4E6E9E", capeS: "#34507A", nerv: "#FFFFFF", hem: "#FFFFFF", plumes: ["#FFFFFF", "#DDE7F0", "#B9CCDC"], orne: "givre", feuille: "#FFFFFF", fleur: "#FFFFFF", ailes: ["#E8F4FF", "#FFFFFF"] }
    };
    var EXPR_A = {
      ...EXPR,
      veille: X({ brow: [-0.2, 0.15, -0.5], lid: 0.2, tilt: -0.08, look: [0, 0.25], under: 0.15, mouth: "soft" }),
      bienveillante: X({ brow: [-0.4, -0.1, -0.6], lid: 0.2, low: 0.18, look: [0, 0.15], under: 0.2, mouth: "half" }),
      recueillie: X({ brow: [-0.3, 0.2, -0.5], mode: "closed", under: 0.2, mouth: "soft" }),
      parle: X({ brow: [-0.3, -0.2, -0.5], lid: 0.18, look: [0, 0.1], under: 0.2, mouth: "open" })
    };
    var hexRgb = /* @__PURE__ */ __name((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), "hexRgb");
    var rgbHex = /* @__PURE__ */ __name((c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase(), "rgbHex");
    var pierre = /* @__PURE__ */ __name((h, k) => {
      const c = hexRgb(h), g = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) * 0.78 + 30;
      return rgbHex(c.map((v, i) => v + (g + [6, 2, -4][i] - v) * k));
    }, "pierre");
    var fleur = /* @__PURE__ */ __name((x, y, r, petal, coeur) => [0, 72, 144, 216, 288].map((a) => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.72, r * 0.72, petal, 0.45)).join("") + E(x, y, r * 0.5, r * 0.5, coeur, 0.3), "fleur");
    var feuille = /* @__PURE__ */ __name((x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">` + P(`M0,0 Q${r2(w)},${r2(len * 0.45)} 0,${r2(len)} Q${r2(-w)},${r2(len * 0.45)} 0,0 Z`, fill, 0.55) + L([0, 0.6], [0, len - 0.7], nerv, 0.3) + "</g>", "feuille");
    var luciole = /* @__PURE__ */ __name((x, y, k = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.4 * k)}" fill="rgb(220,235,255)" opacity=".35"/>` + E(x, y, 0.75 * k, 0.75 * k, C.firefly, 0.3), "luciole");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill) => P(`M${r2(x)},${r2(y - r)} L${r2(x + r * 0.28)},${r2(y - r * 0.28)} L${r2(x + r)},${r2(y)} L${r2(x + r * 0.28)},${r2(y + r * 0.28)} L${r2(x)},${r2(y + r)} L${r2(x - r * 0.28)},${r2(y + r * 0.28)} L${r2(x - r)},${r2(y)} L${r2(x - r * 0.28)},${r2(y - r * 0.28)} Z`, fill, 0), "etoile");
    var lueur = /* @__PURE__ */ __name((d, col, w = 0.45, o = 0.9) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r2(w * 3)}" stroke-linecap="round" opacity="${r2(o * 0.25)}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`, "lueur");
    var ondule = /* @__PURE__ */ __name((a, b, dur = "5s", begin = "0s") => `<animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`, "ondule");
    var vivant = /* @__PURE__ */ __name((a, b, fill, w, vivante, dur, begin) => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${vivante ? ondule(a, b, dur, begin) : ""}</path>`, "vivant");
    var pt = /* @__PURE__ */ __name((q) => `${r2(q[0])},${r2(q[1])}`, "pt");
    var decaler = /* @__PURE__ */ __name((d, kx, ky = 0) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + kx)},${r2(+y + ky)}`), "decaler");
    var L1 = 13;
    var L2 = 12.4;
    var courbe = /* @__PURE__ */ __name((pts, debut = "M") => {
      let d = `${debut}${pt(pts[0])}`;
      for (let i = 1; i < pts.length - 1; i++) d += ` Q${pt(pts[i])} ${pt([(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2])}`;
      return d + ` L${pt(pts[pts.length - 1])}`;
    }, "courbe");
    function bras(K, a, h, s, { main = "repos", voile = true, vivante = true, nuit = 0 } = {}) {
      const r = ik(a, h, L1, L2, s), e = r.milieu, b = r.bout;
      const pts = ligneBras(a, e, b);
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const tot = cum[cum.length - 1] || 1, tc = L1 / (L1 + L2);
      const larg = /* @__PURE__ */ __name((t) => t < tc ? 3.5 - t / tc * 0.9 : (() => {
        const u = (t - tc) / (1 - tc);
        return u < 0.3 ? 2.6 + u / 0.3 * 0.1 : 2.7 - (u - 0.3) / 0.7 * 1;
      })(), "larg");
      const gauche = [], droite = [];
      pts.forEach((q2, i) => {
        const p = pts[Math.max(0, i - 1)], n = pts[Math.min(pts.length - 1, i + 1)], dx = n[0] - p[0], dy = n[1] - p[1], d = Math.hypot(dx, dy) || 1;
        const w = larg(cum[i] / tot) / 2;
        gauche.push([q2[0] - dy / d * w, q2[1] + dx / d * w]);
        droite.push([q2[0] + dy / d * w, q2[1] - dx / d * w]);
      });
      const bordG = courbe(gauche), bordD = courbe([...droite].reverse());
      const contour = `${bordG} ${bordD.replace(/^M/, "L")} Z`;
      let sv = "";
      if (voile) {
        const sx = b[0] < e[0] ? -1 : b[0] > e[0] + 0.5 ? 1 : a[0] < 40 ? -1 : 1;
        const m = [(e[0] + b[0]) / 2, (e[1] + b[1]) / 2], low = Math.max(b[1], m[1]) + 9;
        const forme = /* @__PURE__ */ __name((f) => `M${pt([e[0] + (b[0] - e[0]) * 0.25, e[1] + (b[1] - e[1]) * 0.25])} Q${pt([m[0] - sx * 2.6, m[1] + 3])} ${pt([m[0] - sx * (3.4 + f), low - 1])} Q${pt([m[0] + sx * 0.4, low + 1.6 + f * 0.6])} ${pt([b[0] + sx * (2.2 - f * 0.4), low - 0.4])} Q${pt([b[0] + sx * 1.2, (b[1] + low) / 2])} ${pt(b)} Z`, "forme");
        const va = forme(0), vb = forme(1);
        sv = `<path d="${va}" fill="${K.veil}" fill-opacity=".42" stroke="${K.silverS}" stroke-width="0.4" stroke-linejoin="round">${vivante ? ondule(va, vb, "4.4s") : ""}</path>`;
      }
      const ombre = `<path d="${courbe(pts.map((q2) => [q2[0] + (a[0] < 40 ? 0.6 : -0.6), q2[1]]))}" fill="none" stroke="${K.skinS}" stroke-width="1" stroke-linecap="round" opacity=".6"/>`;
      const veine = lueur(`M${pt(e)} Q${pt([(e[0] + b[0]) / 2 + 0.4, (e[1] + b[1]) / 2])} ${pt([b[0], b[1] - 0.6])}`, K.vein, 0.3, nuit ? 0 : 0.75);
      const qw = pts[pts.length - 2] || b, aw = Math.atan2(b[1] - qw[1], b[0] - qw[0]) * 180 / Math.PI;
      const poignet = `<g transform="translate(${r2(b[0] + (qw[0] - b[0]) * 0.3)} ${r2(b[1] + (qw[1] - b[1]) * 0.3)}) rotate(${r2(aw + 90)})">${E(0, 0, 1.15, 0.42, K.silver, 0.45)}</g>`;
      const u0 = [pts[1][0] - a[0], pts[1][1] - a[1]], d0 = Math.hypot(u0[0], u0[1]) || 1, ux0 = u0[0] / d0, uy0 = u0[1] / d0;
      const q = /* @__PURE__ */ __name((k, m) => [a[0] + ux0 * k - uy0 * m, a[1] + uy0 * k + ux0 * m], "q"), w0 = larg(0) / 2;
      const manch = `M${pt(q(-1.2, -(w0 + 0.4)))} Q${pt(q(-3.2, 0))} ${pt(q(-1.2, w0 + 0.4))} Q${pt(q(1.6, w0 + 1.2))} ${pt(q(3.6, w0 + 0.7))} Q${pt(q(4.4, 0))} ${pt(q(3.6, -(w0 + 0.7)))} Q${pt(q(1.6, -(w0 + 1.2)))} ${pt(q(-1.2, -(w0 + 0.4)))} Z`;
      const mancheron = P(manch, K.gown, 0.75) + `<path d="M${pt(q(3.6, w0 + 0.7))} Q${pt(q(4.4, 0))} ${pt(q(3.6, -(w0 + 0.7)))}" fill="none" stroke="${K.silverS}" stroke-width="0.6"/>`;
      return sv + `<path d="${contour}" fill="${K.skin}"/><path d="${bordG} ${bordD.replace(/^M/, "L")}" fill="none" stroke="${OUT}" stroke-width="0.75" stroke-linejoin="round"/>` + ombre + veine + mainDe(K, b, qw, main) + poignet + mancheron;
    }
    __name(bras, "bras");
    function mainDe(K, b, e, kind) {
      if (typeof kind === "string" && kind.startsWith("<")) return kind;
      const a = Math.atan2(b[1] - e[1], b[0] - e[0]) * 180 / Math.PI - 90;
      let s;
      if (kind === "paume") {
        s = P("M-1.2,0.6 Q-1.5,-1.4 -1.1,-2.6 L-1.15,-4.6 Q-0.9,-5.3 -0.6,-4.6 L-0.45,-3 L-0.3,-5.3 Q0,-5.9 0.3,-5.3 L0.4,-3 L0.65,-5 Q0.95,-5.5 1.2,-4.9 L1.15,-2.5 Q1.7,-2.4 2.3,-3.2 Q2.6,-2.8 2,-1.6 Q1.5,-0.4 1.2,0.6 Z", K.skin, 0.55);
        return `<g transform="translate(${r2(b[0])} ${r2(b[1] + 0.4)})">${s}</g>`;
      }
      if (kind === "coupe") {
        s = P("M-1.7,-0.6 Q-2.2,2 -0.6,2.9 Q0.6,3.3 1.7,2.4 Q2.4,1.2 1.7,-0.6 Q0.2,0.5 -1.7,-0.6 Z", K.skin, 0.55) + `<path d="M-1,1.4 Q0,2 1,1.3" fill="none" stroke="${K.skinS}" stroke-width="0.3"/>`;
      } else if (kind === "tendue") {
        s = P("M-1,-0.6 Q-1.3,2 -0.8,4.6 Q0,5.6 0.8,4.6 Q1.3,2 1,-0.6 Z", K.skin, 0.55) + L([-0.25, 2.6], [-0.25, 4.6], K.skinS, 0.28) + L([0.3, 2.6], [0.3, 4.6], K.skinS, 0.28);
      } else {
        s = P("M-0.95,-0.6 Q-1.25,1.4 -0.9,2.8 Q-0.7,4.2 0,5.2 Q0.5,4.4 0.8,3 Q1.25,1.4 0.95,-0.6 Z", K.skin, 0.55) + `<path d="M-0.15,2.6 Q0,3.8 0.2,4.6" fill="none" stroke="${K.skinS}" stroke-width="0.28" stroke-linecap="round"/>` + P("M0.85,0.8 Q1.7,1.6 1.4,2.6 Q1,2.4 0.8,1.8 Z", K.skin, 0.45);
      }
      return `<g transform="translate(${r2(b[0])} ${r2(b[1])}) rotate(${r2(a)})">${s}</g>`;
    }
    __name(mainDe, "mainDe");
    function chevelure(K, id, kx, sw, vivante, dos) {
      const X2 = /* @__PURE__ */ __name((x) => r2(x + kx), "X");
      if (!dos) {
        const f2 = /* @__PURE__ */ __name((o) => `M${X2(26.2)},32 Q${X2(25.6)},14.2 ${X2(40)},13.8 Q${X2(54.4)},14.2 ${X2(53.8)},32 L${X2(54.8 + o * 0.4)},58 Q${X2(40)},${r2(61 + o)} ${X2(25.2 - o * 0.4)},58 Z`, "f");
        return vivant(f2(0), f2(1), K.hair, 0.9, vivante, "6s") + clip(`${id}chc`, f2(0), `<rect x="${X2(46)}" y="12" width="12" height="52" fill="${K.hairS}" opacity=".55"/>`);
      }
      const f = /* @__PURE__ */ __name((o) => `M${X2(27.6)},31 Q${X2(27.2)},13.8 ${X2(40)},13.6 Q${X2(52.8)},13.8 ${X2(52.4)},31 Q${X2(52)},37.4 ${X2(48)},40 Q${X2(50 + o * 0.4)},51 ${X2(49.6 + o)},63 Q${X2(49.4 + o + sw)},75 ${X2(47.6 + o * 1.4 + sw * 1.6)},85 Q${X2(46 + sw * 1.6)},81.4 ${X2(44.2 + o + sw * 1.8)},87.6 Q${X2(42.4 + sw * 1.8)},82.6 ${X2(40 + o + sw * 2)},90 Q${X2(37.6 + sw * 1.8)},82.6 ${X2(35.8 + o + sw * 1.8)},87.6 Q${X2(34 + sw * 1.6)},81.4 ${X2(32.4 + o * 1.4 + sw * 1.6)},85 Q${X2(30.6 + o + sw)},75 ${X2(30.4 + o)},63 Q${X2(30 + o * 0.4)},51 ${X2(32)},40 Q${X2(28)},37.4 ${X2(27.6)},31 Z`, "f");
      const a = f(0), b = f(1.2);
      const brins = /* @__PURE__ */ __name((o) => `M${X2(35.4)},40 Q${X2(34 + o)},56 ${X2(34.6 + sw)},72 Q${X2(35 + sw)},80 ${X2(36.4 + sw * 1.6)},85 M${X2(40)},38 Q${X2(40.4 + o)},60 ${X2(40 + sw * 2)},88 M${X2(44.6)},40 Q${X2(46 + o)},56 ${X2(45.4 + sw)},72 Q${X2(45 + sw)},80 ${X2(43.6 + sw * 1.6)},85`, "brins");
      let s = vivant(a, b, K.hair, 0.9, vivante, "6s") + `<clipPath id="${id}chc"><path d="${a}">${vivante ? ondule(a, b, "6s") : ""}</path></clipPath><g clip-path="url(#${id}chc)"><rect x="${X2(45.4)}" y="12" width="16" height="84" fill="${K.hairS}" opacity=".6"/><path d="${brins(0)}" fill="none" stroke="${K.hairS}" stroke-width="0.8" stroke-linecap="round" opacity=".9">${vivante ? ondule(brins(0), brins(1), "5.6s") : ""}</path><path d="M${X2(33.6)},19.6 Q${X2(30.6)},26 ${X2(30.8)},33 M${X2(36.4)},17.4 Q${X2(34.4)},22 ${X2(34)},28 M${X2(33.6)},46 Q${X2(32.8)},58 ${X2(33.2)},70" fill="none" stroke="${K.hairH}" stroke-width="1.2" stroke-linecap="round"/></g>`;
      s += `<path d="M${X2(29.4)},31.4 Q${X2(40)},36.6 ${X2(50.6)},31.4" fill="none" stroke="${K.hairS}" stroke-width="2.4" stroke-linecap="round"/>` + [[30.4, 31.6, -40], [35, 34, -15], [45, 34, 15], [49.6, 31.6, 40]].map(([x, y, r]) => feuille(+X2(x), y, 3, 1.3, r, "#9CC4B4", "#6E9A8A")).join("") + [[32.6, 33, K.blossom], [37.6, 34.8, K.blossomC], [42.4, 34.8, K.blossom], [47.4, 33, K.blossomC]].map(([x, y, c]) => fleur(+X2(x), y, 1.1, c, "#FFE7A3")).join("") + fleur(+X2(37.4), 58, 0.9, K.blossom, "#FFE7A3") + fleur(+X2(43.4), 70, 0.8, K.blossom, "#FFE7A3");
      return s;
    }
    __name(chevelure, "chevelure");
    function mechesDevant(K, X2, sw, vivante) {
      const f = /* @__PURE__ */ __name((sx, o) => {
        const x2 = /* @__PURE__ */ __name((v) => sx < 0 ? X2(v) : X2(80 - v), "x");
        return `M${x2(29.2)},27 Q${x2(25.2)},40 ${x2(25.8)},52 Q${x2(26.6)},62 ${x2(29.4 - o)},72.6 Q${x2(31.4)},64 ${x2(31.8)},54 Q${x2(32.4)},42 ${x2(31.6)},31 Z`;
      }, "f");
      const g = f(-1, sw * 0.6), d = f(1, -sw * 0.6), gb = f(-1, sw * 0.6 + 0.9), db = f(1, -sw * 0.6 - 0.9);
      const x = /* @__PURE__ */ __name((sx, v) => +(sx < 0 ? X2(v) : X2(80 - v)), "x");
      return vivant(g, gb, K.hair, 0.8, vivante, "5s") + vivant(d, db, K.hair, 0.8, vivante, "5s", "-1.2s") + `<path d="M${x(-1, 27.4)},40 Q${x(-1, 27.2)},52 ${x(-1, 29)},64" fill="none" stroke="${K.hairH}" stroke-width="0.7" stroke-linecap="round"/><path d="M${x(1, 27.4)},40 Q${x(1, 27.2)},52 ${x(1, 29)},64" fill="none" stroke="${K.hairS}" stroke-width="0.6" stroke-linecap="round"/>` + [-1, 1].map((sx) => fleur(x(sx, 28.4), 50, 1, K.blossom, K.blossomC) + fleur(x(sx, 29.6), 62, 0.85, K.blossom, K.blossomC)).join("");
    }
    __name(mechesDevant, "mechesDevant");
    function couronne(K, kx, m, nuit, n) {
      const tige = /* @__PURE__ */ __name((d, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.5)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${K.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "tige");
      let s = "";
      for (const sx of [-1, 1]) {
        const Xc = /* @__PURE__ */ __name((x) => r2(40 + kx + sx * (x - 40)), "Xc");
        s += tige(`M${Xc(35)},18 Q${Xc(31)},12 ${Xc(27)},9 Q${Xc(22)},5.4 ${Xc(15)},4.4`, 1.9);
        s += tige(`M${Xc(29.6)},10.4 Q${Xc(29)},6 ${Xc(30.6)},2.2`, 1.3) + tige(`M${Xc(24)},7 Q${Xc(22.6)},3.6 ${Xc(23.4)},1.2`, 1.1) + tige(`M${Xc(26.4)},8.6 Q${Xc(21.6)},10.4 ${Xc(17)},11.2`, 1.1) + tige(`M${Xc(18.6)},4.9 Q${Xc(15.4)},7.6 ${Xc(12.6)},8.2`, 0.9);
        s += `<path d="M${Xc(33.6)},16.4 Q${Xc(30)},12 ${Xc(27)},10" fill="none" stroke="${K.antlerS}" stroke-width="0.5" opacity=".8"/>`;
        s += fleur(+Xc(30.6), 2.4, 1.1, K.blossom, K.blossomC) + fleur(+Xc(23.4), 1.6, 0.95, K.blossom, K.blossomC) + fleur(+Xc(15), 4.4, 1.05, K.blossom, K.blossomC) + fleur(+Xc(12.6), 8.2, 0.85, K.blossom, K.blossomC) + fleur(+Xc(17.2), 11.2, 0.9, K.blossom, K.blossomC) + feuille(+Xc(27.6), 9.2, 2.6, 1, sx * 60, "#9CC4B4", "#6E9A8A") + feuille(+Xc(20.4), 5.8, 2.2, 0.9, sx * 110, "#9CC4B4", "#6E9A8A");
      }
      const bx = 40 + kx + m * 19.6, by = 8.4;
      s += `<g transform="translate(${r2(bx)} ${by}) scale(${-m} 1)">` + E(0, 0, 2.3, 1.9, K.bird, 0.65) + E(0.6, 0.7, 1.2, 0.9, "#FFFFFF", 0) + P("M-2,-0.4 L-3.8,0.4 L-2,0.8 Z", K.birdS, 0.45) + E(1, -0.7, 0.35, 0.35, OUT, 0) + P("M2.1,-0.5 L3.4,-0.2 L2.1,0.2 Z", "#E8C27A", 0.35) + "</g>";
      if (!nuit) s += [[23 + n % 2 * 2, 6], [57 - n % 2 * 2, 3.8]].map(([x, y]) => luciole(x + kx, y, 0.8)).join("");
      const dia = `M${r2(28.4 + kx)},22.4 Q${r2(40 + kx)},17.4 ${r2(51.6 + kx)},22.4`;
      s += `<path d="${dia}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="${dia}" fill="none" stroke="${K.silver}" stroke-width="0.8" stroke-linecap="round"/>`;
      const gx = 40 + kx, gy = 19.6;
      s += (nuit ? "" : `<circle cx="${r2(gx)}" cy="${gy}" r="3.2" fill="#B8FFD8" opacity=".35"/>`) + P(`M${r2(gx)},${r2(gy - 1.9)} L${r2(gx + 1.4)},${gy} L${r2(gx)},${r2(gy + 1.9)} L${r2(gx - 1.4)},${gy} Z`, K.gem, 0.6) + P(`M${r2(gx)},${r2(gy - 1.9)} L${r2(gx + 1.4)},${gy} L${r2(gx)},${gy} Z`, K.gemH, 0) + P(`M${r2(gx - 1.4)},${gy} L${r2(gx)},${r2(gy + 1.9)} L${r2(gx)},${gy} Z`, K.gemS, 0);
      return s;
    }
    __name(couronne, "couronne");
    var FACE = "M28,30.6 C28,22.2 33.4,18.4 40,18.4 C46.6,18.4 52,22.2 52,30.6 C52,37.6 47.2,43.2 40,43.8 C32.8,43.2 28,37.6 28,30.6 Z";
    var pressX = /* @__PURE__ */ __name((d, X2) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${X2(+x)},${y}`), "pressX");
    var VISAGES = {
      front: { kx: 0, X: /* @__PURE__ */ __name((x) => r2(x), "X"), rk: [1, 1] },
      se: { kx: -2, X: /* @__PURE__ */ __name((x) => r2(38 + (x - 40) * (x < 40 ? 0.94 : 0.8)), "X"), rk: [0.95, 0.8] }
    };
    for (const V2 of Object.values(VISAGES)) V2.face = pressX(FACE, V2.X);
    var oreille = /* @__PURE__ */ __name((K, x, y, sx, k = 1) => {
      const X2 = /* @__PURE__ */ __name((dx) => r2(x + sx * dx * k), "X");
      return P(`M${X2(1.2)},${r2(y - 2.6)} Q${X2(-4.4)},${r2(y - 4.2)} ${X2(-9.2)},${r2(y - 6.8)} Q${X2(-6.8)},${r2(y - 1.2)} ${X2(-3)},${r2(y + 2.4)} Q${X2(-1)},${r2(y + 3.6)} ${X2(1.2)},${r2(y + 2.8)} Z`, K.skin, 0.75) + `<path d="M${X2(-0.6)},${r2(y - 0.8)} Q${X2(-4)},${r2(y - 2.2)} ${X2(-7.4)},${r2(y - 5.4)}" fill="none" stroke="${K.skinS}" stroke-width="0.55" stroke-linecap="round"/><path d="M${X2(-1.4)},${r2(y + 1.4)} Q${X2(-3)},${r2(y + 0.8)} ${X2(-4.4)},${r2(y - 0.6)}" fill="none" stroke="${K.skinS}" stroke-width="0.45" stroke-linecap="round" opacity=".8"/>` + E(+X2(-3.2), y + 2.1, 0.45, 0.45, K.silver, 0.3);
    }, "oreille");
    var oreilles = /* @__PURE__ */ __name((K, view) => {
      const V2 = VISAGES[view] || VISAGES.front;
      return oreille(K, +V2.X(28.6), 32.6, 1, view === "se" ? 1.05 : 1) + oreille(K, +V2.X(51.4), 32.6, -1, view === "se" ? 0.72 : 1);
    }, "oreilles");
    function cou(K, kx, nuit) {
      return P(`M${r2(37 + kx)},41 L${r2(36.8 + kx)},45.6 Q${r2(36.2 + kx)},47 ${r2(35 + kx)},47.6 L${r2(45 + kx)},47.6 Q${r2(43.8 + kx)},47 ${r2(43.2 + kx)},45.6 L${r2(43 + kx)},41 Z`, K.skin, 0.75) + E(40 + kx, 43.4, 3, 1.1, K.skinS, 0) + lueur(`M${r2(41.6 + kx)},44.4 Q${r2(41.2 + kx)},45.6 ${r2(42 + kx)},46.8`, K.vein, 0.3, nuit ? 0 : 0.7);
    }
    __name(cou, "cou");
    function tete(c, K, view, expr, n, nuit) {
      const V2 = VISAGES[view] || VISAGES.front, Xv = V2.X, kx = V2.kx, id = `${c.uid}${view}${expr}${n}`;
      const name = ALIAS[expr] || expr;
      const ex = EXPR_A[name] || EXPR_A.veille;
      let s = "";
      s += P(V2.face, K.skin) + clip(`${id}f`, V2.face, `<path d="M26,17 Q40,21.4 54,17 L54,25 Q40,28.2 26,25 Z" fill="${K.skinS}" opacity=".5"/><rect x="${r2(48.4 + kx)}" y="17" width="5" height="28" fill="${K.skinS}" opacity=".45"/>` + E(+Xv(32), 37.2, 2.2 * V2.rk[0], 1.1, K.cheek, 0).replace("/>", ' opacity=".55"/>') + E(+Xv(48), 37.2, 2.2 * V2.rk[1], 1.1, K.cheek, 0).replace("/>", ' opacity=".55"/>') + (nuit ? "" : lueur(`M${Xv(31.4)},39.4 L${Xv(30.4)},37.4 L${Xv(31.4)},35.6`, K.vein, 0.25, 0.8) + etoile(+Xv(31.4), 35.6, 0.65, K.star) + etoile(+Xv(30.4), 37.4, 0.5, K.star) + lueur(`M${Xv(48.6)},39.4 L${Xv(49.6)},37.6`, K.vein, 0.25, 0.7) + etoile(+Xv(49.6), 37.6, 0.5, K.star))) + P(V2.face, "none");
      const fr = pressX("M27.6,30 Q27.2,16.4 40,16 Q52.8,16.4 52.4,30 Q49.4,22.2 42.4,21.4 L40,24.4 L37.6,21.4 Q30.6,22.2 27.6,30 Z", Xv);
      s += P(fr, K.hair, 0.8) + `<path d="${pressX("M29.6,25.6 Q32.2,21.8 36.6,20.8", Xv)}" fill="none" stroke="${K.hairH}" stroke-width="0.9" stroke-linecap="round"/><path d="${pressX("M50.4,25.6 Q47.8,21.8 43.4,20.8", Xv)}" fill="none" stroke="${K.hairS}" stroke-width="0.6" stroke-linecap="round"/>`;
      const ir = `${id}ir`;
      s += `<defs><radialGradient id="${ir}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${K.irisD}"/><stop offset=".5" stop-color="${K.iris}"/><stop offset=".8" stop-color="${K.irisR}"/><stop offset="1" stop-color="${K.irisO}"/></radialGradient></defs>`;
      const k = { ...K, iris: `url(#${ir})` };
      s += eye(`${id}e0`, +Xv(35), 32.4, 1, { ...ex, ...ex.eyeL, rk: V2.rk[0], sparkle: true }, k) + eye(`${id}e1`, +Xv(45), 32.4, -1, { ...ex, ...ex.eyeR, rk: V2.rk[1], sparkle: true }, k);
      s += brow(+Xv(35), 28, 1, ex.browL || ex.brow, false, 0.85 * V2.rk[0], K) + brow(+Xv(45), 28, -1, ex.browR || ex.brow, false, 0.85 * V2.rk[1], K);
      s += view === "se" ? P("M38,34.2 Q36.8,36.6 38.2,37", "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) : P("M39.4,36.6 Q40,37.2 40.6,36.6", "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`);
      s += `<g transform="translate(${r2(40 + kx)} 39.6) scale(0.8) translate(${r2(-(40 + kx))} -39.6)">${mouth(ex.mouth, 40 + kx, 39.6, `${id}m`, K)}</g>`;
      s += extras(ex.extras.filter((x) => x !== "zz"), n % 2, Xv);
      return s;
    }
    __name(tete, "tete");
    var teteDeDos = /* @__PURE__ */ __name((K) => oreille(K, 29.6, 32.6, 1) + oreille(K, 50.4, 32.6, -1), "teteDeDos");
    var plume = /* @__PURE__ */ __name((x, y, rot, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">${P("M0,0 Q2.4,4 0,9 Q-2.4,4 0,0 Z", fill, 0.6)}${L([0, 1], [0, 8], OUT, 0.35)}</g>`, "plume");
    var papillon = /* @__PURE__ */ __name((x, y, open, fill, tache) => `<g transform="translate(${r2(x)} ${r2(y)})">` + [-1, 1].map((m) => P(`M0,0 Q${r2(m * 3.2 * open)},-3.4 ${r2(m * 3.4 * open)},-0.4 Q${r2(m * 2.6 * open)},1.6 0,0.6 Z`, fill, 0.5) + E(m * 2.1 * open, -1, 0.55 * open, 0.55, tache, 0)).join("") + L([0, -1.2], [0, 1.4], OUT, 0.6) + "</g>", "papillon");
    function robe(K, id, kx, sw, vivante, dos) {
      const X2 = /* @__PURE__ */ __name((x) => r2(x + kx), "X");
      const corsage = `M${X2(31.4)},47.4 Q${X2(40)},44.2 ${X2(48.6)},47.4 L${X2(45.4)},63.6 Q${X2(40)},65 ${X2(34.6)},63.6 Z`;
      const jupe = /* @__PURE__ */ __name((o) => `M${X2(34.6)},63.2 Q${X2(40)},64.6 ${X2(45.4)},63.2 L${X2(49.6 + sw * 0.6 + o)},113 Q${X2(45 + sw * 0.8)},116.6 ${X2(40 + sw * 0.8)},114.6 Q${X2(35 + sw * 0.8)},116.6 ${X2(30.4 + sw * 0.6 - o)},113 Z`, "jupe");
      const ja = jupe(0), jb = jupe(0.8);
      let s = vivant(ja, jb, K.gown, 0.85, vivante, "5.2s") + `<clipPath id="${id}jc"><path d="${ja}">${vivante ? ondule(ja, jb, "5.2s") : ""}</path></clipPath><g clip-path="url(#${id}jc)"><rect x="${X2(44)}" y="60" width="12" height="60" fill="${K.gownS}" opacity=".75"/><rect x="${X2(31.6)}" y="64" width="1.8" height="48" fill="${K.gownH}" opacity=".8"/>` + (dos ? "" : `<path d="M${X2(40)},66 Q${X2(38.4)},78 ${X2(40.8)},90 Q${X2(39.2)},101 ${X2(40)},112" fill="none" stroke="${K.silverS}" stroke-width="0.6"/>` + [[38.2, 74], [42, 86], [38.6, 98]].map(([x, y]) => `<path d="M${X2(x)},${r2(y - 1.4)} A1.4,1.4 0 1,0 ${X2(x)},${r2(y + 1.4)} A1,1.4 0 1,1 ${X2(x)},${r2(y - 1.4)} Z" fill="${K.silverS}"/>`).join("") + [[42.2, 70], [37.8, 82], [42.4, 104]].map(([x, y]) => etoile(+X2(x), y, 0.9, K.silver)).join("")) + `<rect x="10" y="100" width="60" height="18" fill="${K.mist}" opacity=".55"/></g>`;
      s += [[34.4, 0], [40, -0.8], [45.6, -1.6]].map(([x, b]) => {
        const pa = `M${X2(x - 3 + sw * 0.8)},114 Q${X2(x + sw)},119.4 ${X2(x + 3 + sw * 0.8)},114 Q${X2(x + sw * 0.9)},116.6 ${X2(x - 3 + sw * 0.8)},114 Z`;
        const pb = decaler(pa, 0.6, 0.5);
        return `<path d="${pa}" fill="${K.mist}" fill-opacity=".6">${vivante ? ondule(pa, pb, "3.6s", `${b}s`) : ""}</path>`;
      }).join("");
      s += P(corsage, K.gown) + clip(`${id}cs`, corsage, `<rect x="${X2(43.6)}" y="44" width="8" height="24" fill="${K.gownS}" opacity=".8"/><rect x="${X2(33.4)}" y="49" width="1.4" height="13" rx="0.7" fill="${K.gownH}"/>`) + P(corsage, "none");
      if (!dos) {
        s += `<path d="M${X2(34.6)},47 Q${X2(40)},48.4 ${X2(40)},53 Q${X2(40)},48.4 ${X2(45.4)},47" fill="none" stroke="${K.silverS}" stroke-width="0.7"/>`;
        s += P(`M${X2(34.4)},62.4 Q${X2(40)},64.2 ${X2(45.6)},62.4 L${X2(45.4)},64.2 Q${X2(40)},66 ${X2(34.6)},64.2 Z`, K.silver, 0.55);
        s += `<path d="M${X2(40)},61.8 A1.6,1.6 0 1,0 ${X2(40)},65 A1.2,1.6 0 1,1 ${X2(40)},61.8 Z" fill="${K.silverS}"/>`;
      }
      return s;
    }
    __name(robe, "robe");
    function manteau(K, S, id, kx, sw, vivante, dos, nuit, n) {
      const X2 = /* @__PURE__ */ __name((x, lo) => r2(x + kx * 0.4 + (lo ? sw : 0)), "X");
      const forme = /* @__PURE__ */ __name((o) => `M${X2(29)},45 Q${X2(40)},40.4 ${X2(51)},45 Q${X2(60)},70 ${X2(65 + o, 1)},112 Q${X2(53, 1)},${r2(118.6 + o * 0.6)} ${X2(40, 1)},117.4 Q${X2(27, 1)},${r2(118.6 + o * 0.6)} ${X2(15 - o, 1)},112 Q${X2(20)},70 ${X2(29)},45 Z`, "forme");
      const ma = forme(0), mb = forme(1);
      const veines = [-1, 1].map((m) => {
        const Y = /* @__PURE__ */ __name((x, lo) => X2(40 + m * (x - 40), lo), "Y");
        let d = `M${Y(30)},50 Q${Y(23)},78 ${Y(18.6, 1)},108`;
        for (const [y, x, dx, dy] of [[60, 26.6, -4.2, 6], [74, 23.6, -5, 7.4], [88, 21.2, -5.2, 7.6], [70, 25, 3.4, 6.4], [84, 22, 3.8, 7]]) d += ` M${Y(x, y > 95)},${y} Q${Y(x + dx * 0.3, y > 95)},${r2(y + dy * 0.7)} ${Y(x + dx, y + dy > 95)},${r2(y + dy)}`;
        return d;
      }).join(" ") + (dos ? ` M${X2(40)},46 L${X2(40, 1)},112` : "");
      const plumes = [16, 20.4, 24.8, 29.2, 33.6, 38, 42.4, 46.8, 51.2, 55.6, 60, 64.4].map((x, i) => plume(+X2(x, 1), 106.4 + i % 2 * 1.6, (i - 5.5) * 4, S.plumes[i % 3])).join("") + [18.6, 23.2, 27.8, 52.2, 56.8, 61.4].map((x, i) => plume(+X2(x, 1), 97 + i % 2 * 1.4, i < 3 ? -8 : 8, S.plumes[(i + 1) % 3])).join("");
      const bord = [[22.4, 60], [19.6, 74], [18, 88], [57.6, 60], [60.4, 74], [62, 88]];
      let orne = bord.map(([x, y], i) => feuille(+X2(x), y, 4, 1.6, (x < 40 ? -30 : 30) + (i % 2 ? 16 : -8), S.feuille, S.capeS)).join("");
      if (S.orne === "fleurs") orne += [[24, 66], [21, 82], [56, 66], [59, 82], [26, 92], [54, 92]].map(([x, y], i) => fleur(+X2(x), y, i % 2 ? 1.1 : 1.4, S.fleur, "#FFE7A3")).join("");
      else if (S.orne === "givre") orne += [[24, 66], [21, 82], [56, 66], [59, 82], [26, 92], [54, 92]].map(([x, y]) => etoile(+X2(x), y, 1.6, "#FFFFFF") + etoile(+X2(x) + 1.6, y + 3, 0.9, "#E8F4FF")).join("");
      else orne += [[24.4, 68], [56, 80], [21, 90]].map(([x, y]) => fleur(+X2(x), y, 1.1, S.fleur, "#FFE7A3")).join("");
      const aile = r2(0.6 + 0.4 * Math.abs(Math.sin((n || 0) % 8 / 8 * Math.PI * 4 + 1)));
      const papillons = dos ? papillon(+X2(30), 84, aile, S.ailes[0], K.irisR) + papillon(+X2(51), 72, r2(1.2 - aile * 0.5), S.ailes[1], K.irisR) + papillon(+X2(46), 96, aile, S.ailes[0], K.irisR) : papillon(+X2(21), 78, aile, S.ailes[0], K.irisR) + papillon(+X2(60), 70, r2(1.2 - aile * 0.5), S.ailes[1], K.irisR) + papillon(+X2(61.6, 1), 100, aile, S.ailes[0], K.irisR);
      const ourlet = `<path d="M${X2(12, 1)},113 Q${X2(40, 1)},121.6 ${X2(68, 1)},113" fill="none" stroke="${S.hem}" stroke-width="2.4"/>`;
      return vivant(ma, mb, S.cape, 0.9, vivante, "6.4s") + `<clipPath id="${id}mc"><path d="${ma}">${vivante ? ondule(ma, mb, "6.4s") : ""}</path></clipPath><g clip-path="url(#${id}mc)"><rect x="${X2(49)}" y="40" width="22" height="84" fill="${S.capeS}" opacity=".85"/>` + (nuit ? "" : lueur(veines, S.nerv, 0.7, 0.85)) + ourlet + plumes + orne + "</g>" + (nuit ? "" : papillons);
    }
    __name(manteau, "manteau");
    function mousse(K, k = 1) {
      return `<g opacity="${r2(k)}">` + [[24, 121.4, 6.4], [33, 122.6, 7], [44, 122.8, 7.4], [55, 121.6, 6.2], [40, 121, 5]].map(([x, y, r]) => E(x, y, r, r * 0.36, K.moss, 0.6)).join("") + [[26, 120.4], [36, 121.4], [47.6, 121.6], [53.4, 120.6]].map(([x, y]) => E(x, y, 1.6, 0.6, K.mossS, 0)).join("") + "</g>";
    }
    __name(mousse, "mousse");
    function lierre(K, eclos = 0, k = 1, dos = false) {
      const tige = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.ivy}" stroke-width="0.9" stroke-linecap="round"/>`, "tige");
      const brins = dos ? ["M17.6,112 Q22,98 21,86 Q20,76 24.4,66", "M62.4,112 Q58,98 59,86 Q60,76 55.6,66", "M28,114 Q40,106 52,114"] : ["M17.6,112 Q22,98 21,86 Q20,76 24.4,66", "M62.4,112 Q58,98 59,86 Q60,76 55.6,66", "M31,112.6 Q40,105.4 49,112.6"];
      let s = brins.map(tige).join("");
      s += [[19.4, 104, -40], [22, 92, 30], [20.8, 80, -30], [60.6, 104, 40], [58, 92, -30], [59.2, 80, 30], [34.4, 109.6, -70], [45.6, 109.6, 70]].map(([x, y, r]) => feuille(x, y, 3.2, 1.3, r, K.ivy, K.ivyS)).join("");
      const boutons = [[22.4, 98], [20.6, 86], [23.6, 70], [57.6, 98], [59.4, 86], [56.4, 70], [40, 107]];
      s += boutons.map(([x, y], i) => {
        const e = Math.max(0, Math.min(1, eclos * 1.4 - i * 0.06));
        return e > 0.05 ? fleur(x, y, 0.6 + 0.7 * e, K.bud, "#FFE7A3") : P(`M${r2(x)},${r2(y - 1.6)} Q${r2(x + 1.2)},${r2(y)} ${r2(x)},${r2(y + 1)} Q${r2(x - 1.2)},${r2(y)} ${r2(x)},${r2(y - 1.6)} Z`, K.bud, 0.45) + `<path d="M${r2(x)},${r2(y - 1.2)} L${r2(x)},${r2(y + 0.6)}" stroke="${K.budS}" stroke-width="0.35"/>`;
      }).join("");
      return `<g opacity="${r2(k)}">${s}</g>`;
    }
    __name(lierre, "lierre");
    function anya2(c, view, o = {}) {
      const S = SAISONS[c.saison || "ete"], nuit = o.pierre >= 0.99, voilee = (o.pierre || 0) > 0;
      const base = { ...C, ...c.pal || {} };
      const K = voilee ? Object.fromEntries(Object.entries(base).map(([k, v]) => [k, typeof v === "string" && v[0] === "#" ? pierre(v, o.pierre) : v])) : base;
      const Sk = voilee ? Object.fromEntries(Object.entries(S).map(([k, v]) => [k, typeof v === "string" && v[0] === "#" ? pierre(v, o.pierre) : Array.isArray(v) ? v.map((x) => pierre(x, o.pierre)) : v])) : S;
      const vivante = !voilee, dos = view === "ne", se = view === "se", mir = !!c.miroir;
      const id = `${c.uid}${view}${o.id || ""}${o.n || 0}`;
      const V2 = VISAGES[se ? "se" : "front"], kx = se ? V2.kx : 0, kb = kx * 0.4, sw = o.sw || 0, lev = o.lev || 0;
      const expr = o.expr || (nuit ? "recueillie" : "veille");
      const glowK = nuit ? 0 : o.glow != null ? o.glow : 1;
      let s = "";
      s += `<ellipse cx="40" cy="123" rx="${r2(14 - lev * 0.6)}" ry="2.2" fill="rgba(30,40,70,${r2(0.22 - lev * 0.012)})"/>`;
      if (glowK) s += `<defs><radialGradient id="${id}gl"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="${r2(0.55 * glowK)}"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="${r2(64 - lev)}" rx="${r2(40 * Math.min(1.1, 0.9 + glowK * 0.15))}" ry="64" fill="url(#${id}gl)"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" values=".8;1;.8" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></ellipse>`;
      s += o.fleurs || "";
      const t = (o.n || 0) % 8 / 8;
      const flies = nuit ? [] : [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (t + i / 6) * Math.PI * 2;
        return { x: 40 + Math.cos(a) * 30, y: 70 + Math.sin(a * 2) * 9 + Math.sin(a) * 30 - lev, back: Math.sin(a) < 0 };
      });
      s += flies.filter((f) => f.back).map((f) => luciole(f.x, f.y)).join("");
      s += o.lierre ? mousse(K, o.lierre) : "";
      let g = "";
      const shL = [31.2 + kb, 48.6], shR = [48.8 + kb * (se ? 1.5 : 1), 48.6];
      const repos = { g: [[38.4 + kb, 69.6], 1, "repos"], d: [[41.6 + kb, 69.6], -1, "repos"] };
      const devant = o.brasDevant !== false;
      const B = { ...repos, ...o.bras || {} };
      const unBras = /* @__PURE__ */ __name(([h, sgn, forme, voile = true], a) => bras(K, a, h, sgn, { main: forme, voile, vivante, nuit }), "unBras");
      if (dos) {
        g += o.under || "";
        g += robe(K, id, 0, sw, vivante, true) + manteau(K, Sk, id, 0, sw, vivante, true, nuit, o.n);
        if (o.lierre) g += lierre(K, o.eclos || 0, o.lierre, true);
        g += unBras(B.g, shL) + unBras(B.d, shR);
        g += teteDeDos(K) + chevelure(K, id, 0, sw, vivante, true) + reflet40(couronne(K, 0, mir ? 1 : -1, nuit, o.n || 0), false);
      } else {
        g += chevelure(K, id, kx, sw, vivante, false) + manteau(K, Sk, id, kx, sw, vivante, false, nuit, o.n);
        g += o.under || "";
        g += robe(K, id, kb, sw, vivante, false) + cou(K, kx * 0.6, nuit);
        if (o.lierre) g += lierre(K, o.eclos || 0, o.lierre);
        if (se) g += unBras(B.d, shR);
        const lesBras = unBras(B.g, shL) + (se ? "" : unBras(B.d, shR));
        g += (devant ? "" : lesBras) + mechesDevant(K, V2.X, sw, vivante) + (devant ? lesBras : "");
        g += oreilles(K, view) + tete(c, K, view, o.blink && expr === "veille" ? "cligne" : expr, o.n || 0, nuit);
        g += couronne(K, kx, mir ? -1 : 1, nuit, o.n || 0);
      }
      g += o.over || "";
      const lean = o.lean ? ` rotate(${r2(o.lean)} 40 90)` : "";
      s += `<g transform="translate(0 ${r2(3.6 - lev)})${lean}">${g}</g>`;
      s += flies.filter((f) => !f.back).map((f) => luciole(f.x, f.y)).join("");
      if (voilee) s += `<defs><radialGradient id="${c.uid || "an"}voile"><stop offset="0" stop-color="#9EA6B4" stop-opacity="${r2(0.3 * o.pierre)}"/><stop offset=".65" stop-color="#9EA6B4" stop-opacity="${r2(0.16 * o.pierre)}"/><stop offset="1" stop-color="#9EA6B4" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="70" rx="38" ry="58" fill="url(#${c.uid || "an"}voile)"/>`;
      return s;
    }
    __name(anya2, "anya");
    var reflet40 = /* @__PURE__ */ __name((s, oui) => oui ? `<g transform="translate(80 0) scale(-1 1)">${s}</g>` : s, "reflet40");
    module.exports = { anya: anya2, C, SAISONS, EXPR: EXPR_A, bras, fleur, luciole, etoile, lueur, pierre, L1, L2 };
  }
});

// personnages/refonte/anya_anims.js
var require_anya_anims = __commonJS({
  "personnages/refonte/anya_anims.js"(exports, module) {
    var { E, P, r2, OUT } = require_troupe();
    var { anya: anya2, fleur, luciole, etoile, lueur } = require_anya_refonte();
    var DIRECTIONS = {
      face: { nom: "De face", vue: "front", miroir: false },
      bas_gauche: { nom: "Vers le bas, à gauche", vue: "se", miroir: false },
      bas_droite: { nom: "Vers le bas, à droite", vue: "se", miroir: true },
      haut_droite: { nom: "Vers le haut, à droite", vue: "ne", miroir: false },
      haut_gauche: { nom: "Vers le haut, à gauche", vue: "ne", miroir: true }
    };
    var MOUVANTES = ["bas_gauche", "bas_droite", "haut_droite", "haut_gauche"];
    var TOUTES = ["face", ...MOUVANTES];
    var DEVANT = ["face", "bas_gauche", "bas_droite"];
    var lerp = /* @__PURE__ */ __name((a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], "lerp");
    var kbOf = /* @__PURE__ */ __name((vue) => vue === "se" ? -0.8 : 0, "kbOf");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    var REPOS = { g: [38.4, 69.6], d: [41.6, 69.6] };
    var image2 = /* @__PURE__ */ __name((c, v, n, o = {}) => anya2(c, v, { n, lev: 2, ...o }), "image");
    var petale = /* @__PURE__ */ __name((x, y, rot, col) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">${P("M0,-1.4 Q1.2,0 0,1.4 Q-1.2,0 0,-1.4 Z", col, 0.4)}</g>`, "petale");
    var oiseau = /* @__PURE__ */ __name((x, y, sx, aile) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${sx} 1)">` + P(`M-0.6,-0.4 Q-2.6,${r2(-2.6 * aile)} -4.2,${r2(-1.4 * aile)} Q-2.4,-0.2 -0.6,0.4 Z`, "#4E78B4", 0.5) + E(0, 0, 2.2, 1.7, "#7FA9E0", 0.6) + E(0.5, 0.6, 1.1, 0.8, "#FFFFFF", 0) + E(1, -0.6, 0.32, 0.32, OUT, 0) + P("M2,-0.4 L3.3,-0.1 L2,0.3 Z", "#E8C27A", 0.35) + "</g>", "oiseau");
    var pousse = /* @__PURE__ */ __name((x, y, k) => `<path d="M${r2(x)},${r2(y)} Q${r2(x - 0.6)},${r2(y - 3 * k)} ${r2(x)},${r2(y - 5.6 * k)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${r2(x)},${r2(y)} Q${r2(x - 0.6)},${r2(y - 3 * k)} ${r2(x)},${r2(y - 5.6 * k)}" fill="none" stroke="#6E9A6A" stroke-width="0.7" stroke-linecap="round"/>` + P(`M${r2(x)},${r2(y - 2.4 * k)} Q${r2(x - 2.6 * k)},${r2(y - 3.6 * k)} ${r2(x - 3 * k)},${r2(y - 2 * k)} Q${r2(x - 1.4 * k)},${r2(y - 1.4 * k)} ${r2(x)},${r2(y - 2.4 * k)} Z`, "#8CC48A", 0.45) + P(`M${r2(x)},${r2(y - 3.4 * k)} Q${r2(x + 2.6 * k)},${r2(y - 4.6 * k)} ${r2(x + 3 * k)},${r2(y - 3 * k)} Q${r2(x + 1.4 * k)},${r2(y - 2.4 * k)} ${r2(x)},${r2(y - 3.4 * k)} Z`, "#8CC48A", 0.45) + (k > 0.6 ? fleur(x, y - 6.2 * k, 0.6 + 0.8 * (k - 0.6) / 0.4, "#FFFFFF", "#FFE7A3") : ""), "pousse");
    var lumiere = /* @__PURE__ */ __name((x, y, r) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 2.2)}" fill="rgb(220,238,255)" opacity=".32"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="#F4FAFF" opacity=".95"/>` + etoile(x, y, r * 1.5, "#FFFFFF"), "lumiere");
    var onde = /* @__PURE__ */ __name((k, y = 66) => `<circle cx="40" cy="${y}" r="${r2(8 + k * 28)}" fill="none" stroke="#DCEEFF" stroke-width="${r2(3 * (1 - k) + 0.6)}" opacity="${r2(0.85 * (1 - k))}"/>`, "onde");
    var fleursSol = /* @__PURE__ */ __name((places, k) => places.map(([x, y, r], i) => k[i] > 0.05 ? fleur(x, y, r * (0.5 + 0.5 * k[i]), i % 2 ? "#FFFFFF" : "#CFE3FF", "#FFE7A3") : "").join(""), "fleursSol");
    var ENCRE = "#3E5A86";
    var GLYPHES = [
      (x) => `<path d="M${r2(x - 1)},-2.2 A2.2,2.2 0 1,0 ${r2(x - 1)},2.2 A1.7,2.2 0 1,1 ${r2(x - 1)},-2.2 Z" fill="${ENCRE}"/>` + E(x + 1.6, -1.4, 0.45, 0.45, ENCRE, 0),
      (x) => `<path d="M${r2(x - 2)},1.6 Q${r2(x)},-3 ${r2(x + 2)},1.6" fill="none" stroke="${ENCRE}" stroke-width="0.7" stroke-linecap="round"/>` + E(x, 2.2, 0.5, 0.5, ENCRE, 0),
      (x) => `<path d="M${r2(x - 1.8)},-1.8 L${r2(x)},0.6 L${r2(x + 1.8)},-1.2 M${r2(x)},0.6 L${r2(x)},2.4" fill="none" stroke="${ENCRE}" stroke-width="0.55" stroke-linecap="round"/>` + [[x - 1.8, -1.8], [x + 1.8, -1.2], [x, 2.4]].map(([a, b]) => E(a, b, 0.45, 0.45, ENCRE, 0)).join(""),
      (x) => `<circle cx="${r2(x)}" cy="0" r="1.7" fill="none" stroke="${ENCRE}" stroke-width="0.6"/>` + E(x, 0, 0.5, 0.5, ENCRE, 0) + `<path d="M${r2(x)},-1.7 L${r2(x)},-3" stroke="${ENCRE}" stroke-width="0.55" stroke-linecap="round"/>`,
      (x) => `<path d="M${r2(x - 2)},-0.4 Q${r2(x - 1)},-2.4 ${r2(x)},-0.4 Q${r2(x + 1)},1.6 ${r2(x + 2)},-0.4" fill="none" stroke="${ENCRE}" stroke-width="0.6" stroke-linecap="round"/>` + E(x, -2.4, 0.4, 0.4, ENCRE, 0) + E(x, 1.8, 0.4, 0.4, ENCRE, 0),
      (x) => etoile(x, -0.2, 1.8, ENCRE) + `<path d="M${r2(x - 2.2)},2.2 L${r2(x + 2.2)},2.2" stroke="${ENCRE}" stroke-width="0.5" stroke-linecap="round"/>`,
      (x) => `<path d="M${r2(x + 1)},-2.2 A2.2,2.2 0 1,1 ${r2(x + 1)},2.2 A1.7,2.2 0 1,0 ${r2(x + 1)},-2.2 Z" fill="${ENCRE}"/><path d="M${r2(x - 1.6)},-2 L${r2(x - 1.6)},2" stroke="${ENCRE}" stroke-width="0.55" stroke-linecap="round"/>`
    ];
    var BULLES = [[0, 2, 4], [3, 1, 6, 5], [6, 4, 0]];
    function bulle(v, k, e = 1) {
      const g = BULLES[v % BULLES.length], w = g.length * 5.6 + 4, x0 = 77 - w, y0 = 34;
      const forme = `M${r2(x0 + 3)},${y0} L${r2(x0 + w - 3)},${y0} Q${r2(x0 + w)},${y0} ${r2(x0 + w)},${y0 + 3} L${r2(x0 + w)},${y0 + 8} Q${r2(x0 + w)},${y0 + 11} ${r2(x0 + w - 3)},${y0 + 11} L${r2(x0 + 6)},${y0 + 11} L${r2(x0 + 1)},${y0 + 14.6} L${r2(x0 + 3)},${y0 + 11} Q${r2(x0)},${y0 + 11} ${r2(x0)},${y0 + 8} L${r2(x0)},${y0 + 3} Q${r2(x0)},${y0} ${r2(x0 + 3)},${y0} Z`;
      const glyphes = g.slice(0, k).map((gi, i) => GLYPHES[gi](x0 + 4.8 + i * 5.6)).join("");
      return `<g transform="translate(${r2(x0)} ${y0 + 14.6}) scale(${r2(e)}) translate(${r2(-x0)} ${-(y0 + 14.6)})"><path d="${forme}" fill="#F4F8FF" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><g transform="translate(0 ${y0 + 5.6})">${glyphes}</g>` + (k >= g.length ? etoile(x0 + w - 1.4, y0 + 1.2, 1.2, "#BFE6FF") : "") + "</g>";
    }
    __name(bulle, "bulle");
    var ANIMS = {
      voile: {
        nom: "Endormie sous le Voile",
        images: 2,
        dt: 1.4,
        dirs: TOUTES,
        etat: "voilee",
        contexte: "Avant la Révélation : au centre du Cercle, la statue grise, la mousse et le lierre, ses fleurs fermées. Le Voile respire.",
        // (la statue ne bouge pas : seules des poussières grises dérivent autour d'elle)
        img: /* @__PURE__ */ __name((c, v, n) => image2(c, v, n, { pierre: 1, lierre: 1, lev: 0, eclos: 0, glow: 0 }) + [[18, 70], [62, 58], [30, 40], [54, 96]].map(([x, y], i) => E(x + (n ? 1.2 : -0.6) * (i % 2 ? 1 : -1), y - n * 2.4, 0.7, 0.7, "#B9BEC8", 0).replace("/>", ' opacity=".6"/>')).join(""), "img")
      },
      eveil: {
        nom: "L'éveil",
        images: 8,
        dt: 0.32,
        dirs: DEVANT,
        etat: "voilee",
        contexte: "La Révélation : le centre du Cercle fleurit, la couleur revient, les fleurs du lierre s'ouvrent ; une onde de lumière, et Anya se lève.",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const pierre = [1, 1, 0.85, 0.6, 0.35, 0.1, 0, 0][n], eclos = [0, 0.2, 0.45, 0.7, 0.9, 1, 1, 1][n];
          const lierre = [1, 1, 1, 1, 0.85, 0.6, 0.3, 0][n], lev = [0, 0, 0.2, 0.6, 1.2, 1.8, 2.2, 2][n];
          const glow = [0, 0, 0.2, 0.5, 0.9, 1.4, 1.2, 1][n];
          const expr = c.expr || (n < 5 ? "recueillie" : n === 5 ? "veille" : "bienveillante");
          const kb = kbOf(v), ouvre = [0, 0, 0, 0, 0, 0.6, 1, 0.3][n];
          const bras = ouvre ? { g: [lerp([REPOS.g[0] + kb, REPOS.g[1]], [18 + kb, 70], ouvre), -1, ouvre > 0.5 ? "paume" : "repos"], d: [lerp([REPOS.d[0] + kb, REPOS.d[1]], [62 + kb, 70], ouvre), 1, ouvre > 0.5 ? "paume" : "repos"] } : void 0;
          const fleurs = fleursSol([[24, 123.4, 1.4], [32, 124.8, 1.2], [48, 124.8, 1.2], [56, 123.4, 1.4], [40, 125.2, 1.5], [17, 122, 1.1], [63, 122, 1.1]], [0, 1, 2, 3, 4, 5, 6].map((i) => Math.max(0, Math.min(1, (n - 1 - i * 0.5) / 2))));
          const s = image2(c, v, n, { pierre, lierre, lev, eclos, glow, expr, bras, fleurs });
          const pet = n >= 4 ? [[22, 20], [58, 30], [34, 8], [66, 50], [14, 44]].map(([x, y], i) => petale(x + (n - 4) * 1.6 * (i % 2 ? 1 : -1), y + (n - 4) * 9, (n * 40 + i * 70) % 360, i % 2 ? "#FFFFFF" : "#F7D6E6")).join("") : "";
          return s + (n === 5 ? onde(0.35) : n === 6 ? onde(0.8) : "") + pet;
        }, "img")
      },
      repos: {
        nom: "Repos",
        images: 4,
        dt: 0.6,
        dirs: TOUTES,
        contexte: "Elle flotte au-dessus du sol, sereine ; sa chevelure, son manteau et ses lucioles bougent sans cesse.",
        img: /* @__PURE__ */ __name((c, v, n) => image2(c, v, n, { lev: [2, 2.5, 2.8, 2.5][n], blink: n === 3 }), "img")
      },
      flotter: {
        nom: "Se déplacer, en flottant",
        images: 8,
        dt: 0.16,
        dirs: MOUVANTES,
        contexte: "Elle glisse au-dessus du sol, penchée vers où elle va ; sa chevelure et son manteau traînent derrière elle, des fleurs s'ouvrent sur son chemin.",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const t = n / 8, k = avant(v), arr = -k;
          const lev = 2.2 + 0.5 * Math.sin(t * Math.PI * 2);
          const fleurs = [0, 1, 2].map((i) => {
            const age = (n + i * 8 / 3) % 8 / 8, x = 40 + arr * (6 + age * 22);
            return age < 0.9 ? fleur(x, 123.6 + i % 2 * 1.2, 0.6 + Math.min(1, age * 3) * 0.8, i % 2 ? "#FFFFFF" : "#CFE3FF", "#FFE7A3") : "";
          }).join("");
          return image2(c, v, n, { lev, sw: r2(arr * (0.9 + 0.2 * Math.sin(t * Math.PI * 4))), lean: k * 3, fleurs });
        }, "img")
      },
      benediction: {
        nom: "La bénédiction",
        images: 4,
        dt: 0.36,
        dirs: DEVANT,
        contexte: "Elle lève la main : une lumière, des pétales qui montent. Sa Bénédiction sur l'île (HISTOIRE.md § 6.14).",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const k = [0.35, 1, 1, 0.5][n], kb = kbOf(v);
          const h = lerp([REPOS.g[0] + kb, REPOS.g[1]], [11.6 + kb, 41], k);
          const over = k > 0.6 ? lumiere(h[0], h[1] - 4.6, 1 + n * 0.3) + [[-2.6, -9], [2.2, -11], [0, -14]].map(([dx, dy], i) => petale(h[0] + dx + (n - 1) * (i - 1), h[1] + dy - (n - 1) * 3, n * 50 + i * 90, i % 2 ? "#FFFFFF" : "#F7D6E6")).join("") + luciole(h[0] + 4, h[1] - 8 - n, 0.8) : "";
          return image2(c, v, n, { lev: 2.4, expr: "bienveillante", bras: { g: [h, -1, k > 0.6 ? "paume" : "repos"] }, over });
        }, "img")
      },
      creer: {
        nom: "Créer",
        images: 4,
        dt: 0.5,
        dirs: DEVANT,
        contexte: "Elle crée : ses mains en coupe, une lumière y naît, une pousse y fleurit, puis un petit oiseau bleu s'envole. Ses créatures n'existent qu'avec elle.",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const kb = kbOf(v), mx = 40 + kb;
          const g = [37.4 + kb, 64.6], d = [42.6 + kb, 64.6];
          let over = "";
          if (n === 1) over = lumiere(mx, 62, 1.6);
          if (n === 2) over = lumiere(mx, 62.8, 1.1) + pousse(mx, 63.2, 1);
          if (n === 3) over = pousse(mx, 63.2, 1) + oiseau(mx + 9, 46, 1, 1) + etoile(mx + 3.4, 55, 0.8, "#FFFFFF") + etoile(mx + 6.2, 50.6, 0.6, "#FFFFFF");
          return image2(c, v, n, { lev: 2.2, expr: n < 2 ? "recueillie" : "bienveillante", bras: { g: [g, 1, "coupe"], d: [d, -1, "coupe"] }, over });
        }, "img")
      },
      parler: {
        nom: "Parler",
        images: 4,
        dt: 0.3,
        dirs: TOUTES,
        contexte: "Elle parle, doucement ; une main ouverte accompagne ses mots (« L'île le sent. »).",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const kb = kbOf(v), k = [0, 0.7, 1, 0.4][n];
          const bras = v === "ne" ? void 0 : { d: [lerp([REPOS.d[0] + kb, REPOS.d[1]], [57 + kb, 64], k), 1, k > 0.5 ? "paume" : "repos"] };
          return image2(c, v, n, { lev: [2, 2.3, 2.5, 2.3][n], expr: n % 2 ? "parle" : "bienveillante", bras });
        }, "img")
      },
      souffler: {
        nom: "Souffler",
        images: 4,
        dt: 0.4,
        dirs: DEVANT,
        contexte: "Elle souffle sur le Grimoire (la Révélation), ou donne son Souffle quand on la croise : ses paumes ouvertes devant elle, elle souffle dessus, un souffle de lumière et de pétales part.",
        img: /* @__PURE__ */ __name((c, v, n) => {
          const kb = kbOf(v), a = avant(v);
          const g = [37.6 + kb, 51.6], d = [42.4 + kb, 51.6];
          const sx = 40 + kb + a * 4, sy = 47;
          const souffle = n >= 2 ? [0, 1, 2, 3, 4].map((i) => {
            const p = (i + (n - 2) * 2.5) / 7;
            const x = sx + (a ? a * p * 26 : (i - 2) * p * 9), y = sy + (a ? (i - 2) * p * 4 : p * 18);
            return i % 2 ? petale(x, y, i * 70 + n * 30, i % 4 ? "#FFFFFF" : "#F7D6E6") : etoile(x, y, 0.9 - p * 0.3, "#FFFFFF");
          }).join("") + lueur(a ? `M${r2(sx)},${sy} Q${r2(sx + a * 12)},${sy - 2} ${r2(sx + a * 24)},${sy + 1}` : `M${r2(sx)},${sy} Q${r2(sx - 3)},${sy + 8} ${r2(sx)},${sy + 16}`, "#DCEEFF", 0.5, n === 2 ? 0.9 : 0.5) : "";
          return image2(c, v, n, { lev: 2.2, expr: n === 1 ? "recueillie" : n === 2 ? "parle" : "bienveillante", bras: { g: [g, 1, "coupe", false], d: [d, -1, "coupe", false] }, over: souffle });
        }, "img")
      },
      murmure: {
        nom: "Le murmure",
        images: 4,
        dt: 0.42,
        dirs: TOUTES,
        contexte: "Rarement, quand on la touche pendant qu'elle flotte : une bulle de son écriture de lune, que personne ne sait lire (trois phrases, c.murmure ; la règle est à brancher).",
        img: /* @__PURE__ */ __name((c, v, n) => image2(c, v, n, { lev: [2.2, 2.5, 2.7, 2.5][n], expr: n % 2 ? "parle" : "bienveillante" }) + bulle(c.murmure || 0, [0, 1, 2, 4][n], n ? 1 : 0.6), "img")
      },
      apparaitre: {
        nom: "Apparaître",
        images: 6,
        dt: 0.26,
        dirs: TOUTES,
        contexte: "Son errance : à l'aube ou au crépuscule, les lucioles se rassemblent et elle se forme en elles, pour un court moment.",
        img: /* @__PURE__ */ __name((c, v, n) => apparition(c, v, n), "img")
      },
      disparaitre: {
        nom: "Disparaître",
        images: 6,
        dt: 0.26,
        dirs: TOUTES,
        contexte: "Elle se défait en lucioles, qui s'éparpillent.",
        img: /* @__PURE__ */ __name((c, v, n) => apparition(c, v, 5 - n), "img")
      }
    };
    var VIS = [0, 0.12, 0.35, 0.65, 1, 1];
    function apparitionSur(corps, k) {
      const vis = VIS[k];
      const flies = [...Array(12).keys()].map((i) => {
        const a = i * 2.4, R2 = 34 * (1 - k / 5) + 6, x = 40 + Math.cos(a) * R2 * 0.8, y = 70 + Math.sin(a) * R2 * 1.3;
        return k < 5 ? luciole(x, y, 0.9) : "";
      }).join("");
      const s = vis ? `<g opacity="${vis}">${corps(vis)}</g>` : "";
      return s + flies + (k === 4 ? onde(0.5, 64) : "");
    }
    __name(apparitionSur, "apparitionSur");
    var apparition = /* @__PURE__ */ __name((c, v, k) => apparitionSur((vis) => image2(c, v, k, { lev: 2.4, glow: vis }), k), "apparition");
    function dessiner(c, anim, direction, n) {
      const A = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}${anim.slice(0, 3)}` };
      const s = A.img(cc, d.vue, n % A.images);
      return d.miroir ? `<g transform="translate(80 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    for (const A of Object.values(ANIMS)) A.etat = A.etat || "eveillee";
    module.exports = { ANIMS, DIRECTIONS, BULLES, dessiner, bulle, apparitionSur };
  }
});

// personnages/refonte/cerf_lune.js
var require_cerf_lune = __commonJS({
  "personnages/refonte/cerf_lune.js"(exports, module) {
    var { P, E, clip, r2, OUT } = require_troupe();
    var { fleur, luciole, etoile, lueur } = require_anya_refonte();
    var { ik } = require_membres();
    var C = {
      coat: "#F4F6FA",
      coatS: "#C9D2E4",
      coatD: "#AEB9D0",
      belly: "#FFFFFF",
      antler: "#E8E4DA",
      antlerS: "#B9B2A2",
      antlerH: "#FFFFFF",
      hoof: "#D7DEEA",
      hoofS: "#9AA6BE",
      nose: "#4E566C",
      inner: "#E6D6EA",
      eye: "#26304A",
      iris: "#7E9CC0",
      irisD: "#3E5276",
      irisR: "#D8F0FF",
      irisO: "#4A5E80",
      vein: "#BFE6FF",
      star: "#FFFFFF",
      blossom: "#FFFFFF",
      blossomC: "#CDE6FF",
      moon: "#F6FAFF",
      glow: "200,225,255",
      silver: "#B9C6DC"
    };
    var tige = /* @__PURE__ */ __name((d, w, K) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.5)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${K.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "tige");
    function bois(K, n, kf = 0.78) {
      const fond = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(82.7 + (82.7 - x) * kf)},${y}`), "fond");
      const merrain = [
        ["M78,12.6 C74,4 66,-1 58,-4 C52,-6 47.6,-9 45.6,-13", 2.4],
        ["M70.6,1.2 Q68.4,-4 70,-9.8", 1.6],
        ["M61.4,-2.6 Q58.6,-8 60,-12.8", 1.4],
        ["M66.4,-0.4 Q60.4,2.4 54.6,1.4", 1.2],
        ["M52.4,-6.4 Q47.4,-6.6 44.4,-4.6", 1.1],
        ["M76.4,9 Q72.6,9.6 70.6,7.4", 1.2]
      ];
      let s = "";
      for (const [d, w] of merrain) s += tige(fond(d), w * (kf < 1 ? 0.9 : 1), K);
      for (const [d, w] of merrain) s += tige(d, w, K);
      s += `<path d="M76.8,10 C73.4,3.6 66,-0.6 58.6,-3" fill="none" stroke="${K.antlerH}" stroke-width="0.7" stroke-linecap="round" opacity=".85"/>`;
      const fl = [[70, -9.8, 1.2], [60, -12.8, 1.1], [45.6, -13, 1.1], [44.4, -4.6, 0.95], [54.6, 1.4, 0.9], [70.6, 7.4, 0.85]];
      s += fl.map(([x, y, r]) => fleur(+r2(82.7 + (82.7 - x) * kf), y, r * (kf < 1 ? 0.9 : 1), K.blossom, K.blossomC) + fleur(x, y, r, K.blossom, K.blossomC)).join("");
      s += lueur("M58,-4 Q57,1 58.4,5.6 Q59.4,8.6 58.2,11", K.vein, 0.35, 0.8) + etoile(58.2, 11, 0.8, K.star) + etoile(58.4, 5.6, 0.55, K.star);
      s += [[64 + n % 2 * 2, -6], [104 - n % 2 * 2, -6], [50, -1 + n % 2], [96, 2 - n % 2]].map(([x, y]) => luciole(x, y, 0.8)).join("");
      const cr = "M81.4,-6.6 A4.6,4.6 0 1,0 85.6,1.2 A3.7,3.7 0 1,1 81.4,-6.6 Z";
      s += `<g><animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="0 0;0 -0.9;0 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/><circle cx="82.4" cy="-2" r="6.4" fill="rgb(${C.glow})" opacity=".35"/><path d="${cr}" fill="${K.moon}" stroke="${K.coatS}" stroke-width="0.5"/></g>`;
      return s;
    }
    __name(bois, "bois");
    function oeil(id, x, y, k, blink) {
      if (blink) return `<path d="M${r2(x - k * 2.6)},${r2(y - 0.2)} Q${r2(x)},${r2(y + 1.3)} ${r2(x + k * 2.3)},${r2(y + 0.4)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linecap="round"/>`;
      const X = /* @__PURE__ */ __name((d) => r2(x + k * d), "X"), ir = `${id}ir`;
      const haut = `M${X(-2.6)},${r2(y - 0.6)} C${X(-1.6)},${r2(y - 2.7)} ${X(1.2)},${r2(y - 2.6)} ${X(2.3)},${r2(y + 0.5)}`;
      const amande = `${haut} C${X(1)},${r2(y + 2.1)} ${X(-1.5)},${r2(y + 2)} ${X(-2.6)},${r2(y - 0.6)} Z`;
      return `<defs><radialGradient id="${ir}" cx=".5" cy=".4" r=".62"><stop offset="0" stop-color="${C.irisD}"/><stop offset=".5" stop-color="${C.iris}"/><stop offset=".8" stop-color="${C.irisR}"/><stop offset="1" stop-color="${C.irisO}"/></radialGradient></defs>` + P(amande, "#FFFFFF", 0) + clip(id, amande, E(+X(-0.15), y - 0.15, 1.75, 1.95, `url(#${ir})`, 0) + E(+X(-0.15), y - 0.2, 0.82, 0.95, C.eye, 0) + E(+X(-0.75), y - 0.95, 0.55, 0.55, "#FFFFFF", 0) + etoile(+X(0.55), y + 0.55, 0.42, "#FFFFFF")) + `<path d="${amande}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/><path d="${haut}" fill="none" stroke="${OUT}" stroke-width="1" stroke-linecap="round"/><path d="M${X(-2.55)},${r2(y - 0.65)} l${r2(-k * 1.2)},-0.5" fill="none" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>`;
    }
    __name(oeil, "oeil");
    function tete(K, id, blink, frémit = false) {
      const t = "M72.6,20 C72.6,13.6 78,11 82.6,11 C87.6,11 92.4,13.8 92.4,20 C92.4,24.6 90.6,28 89.6,31.6 C89,35.8 87.8,39.6 84.4,39.8 C81,40 79.6,36.6 78.8,33 C77.6,28.6 72.6,25.6 72.6,20 Z";
      const oreille = /* @__PURE__ */ __name((x, y, sx, k) => `<g transform="translate(${x} ${y}) rotate(${sx * -30}) scale(${k} 1)">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.2},0.7 Q${sx * -5},-1.8 ${sx * -8.4},-0.9 Q${sx * -5},1.8 ${sx * -1.2},1.8 Z`, K.inner, 0)}</g>`, "oreille");
      let s = (frémit ? `<g transform="rotate(-10 73.6 16.6)">${oreille(73.6, 16.6, 1, 1)}</g>` : oreille(73.6, 16.6, 1, 1)) + oreille(91.6, 16.6, -1, 0.85);
      s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="88.4" y="10" width="8" height="32" fill="${K.coatS}" opacity=".55"/>` + E(84.2, 35.6, 4.6, 4, K.belly, 0) + lueur("M82.6,12.4 L82.5,17.2 M80,14.6 L82.5,17.2 L85.2,14.8 M82.5,17.2 L82.6,21", K.vein, 0.35, 0.9) + etoile(82.5, 17.2, 0.8, K.star)) + P(t, "none");
      s += E(84.4, 37.6, 2.7, 1.6, K.nose, 0.5) + E(83.6, 37.1, 0.7, 0.4, "#8A94AE", 0);
      s += P("M82.6,39.8 Q84.4,40.8 86.2,39.8", "none", 0.5);
      s += oeil(`${id}e0`, 77.6, 22.6, 1, blink) + oeil(`${id}e1`, 88, 22.4, -1, blink);
      return s;
    }
    __name(tete, "tete");
    function teteDeDos(K, id, frémit) {
      const t = "M73.6,22 C73.6,14.4 78,11.4 82.6,11.4 C87.4,11.4 91.6,14.4 91.6,22 C91.6,27.4 88.6,31 86,33 L79,33 C76.4,31 73.6,27.4 73.6,22 Z";
      const oreille = /* @__PURE__ */ __name((x, y, sx, k) => `<g transform="translate(${x} ${y}) rotate(${sx * -16}) scale(${k} 1)">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.6},0.4 Q${sx * -5},-1.2 ${sx * -8},-0.9`, "none", 0.45).replace(`stroke="${OUT}"`, `stroke="${K.coatS}"`)}</g>`, "oreille");
      let s = (frémit ? `<g transform="rotate(-10 74.6 17.6)">${oreille(74.6, 17.6, 1, 1)}</g>` : oreille(74.6, 17.6, 1, 1)) + oreille(90.6, 17.6, -1, 0.9);
      s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="87" y="10" width="8" height="26" fill="${K.coatS}" opacity=".55"/>` + lueur("M82.6,14 L82.6,20 M80.2,17 L82.6,20 L85,17", K.vein, 0.35, 0.85) + etoile(82.6, 20, 0.7, K.star)) + P(t, "none");
      return s;
    }
    __name(teteDeDos, "teteDeDos");
    var gorge = /* @__PURE__ */ __name((K) => `<path d="M79.6,38 Q86,41 85.6,50 Q85,58 82.4,64 Q79.6,58 79,50 Q78.6,43 79.6,38 Z" fill="${K.belly}" opacity=".95"/>`, "gorge");
    var dist = /* @__PURE__ */ __name((a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]), "dist");
    var vers = /* @__PURE__ */ __name((p, q, k) => {
      const d = dist(p, q) || 1;
      return [p[0] + (q[0] - p[0]) / d * k, p[1] + (q[1] - p[1]) / d * k];
    }, "vers");
    function ligne(pts, w) {
      const out = [[...pts[0], w[0]]];
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1], b = pts[i], c = pts[i + 1], rr = Math.min(2.6, 0.4 * Math.min(dist(a, b), dist(b, c)));
        const p1 = vers(b, a, rr), p2 = vers(b, c, rr);
        out.push([...p1, w[i]]);
        for (let k = 1; k <= 4; k++) {
          const t = k / 4, u = 1 - t;
          out.push([u * u * p1[0] + 2 * u * t * b[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * b[1] + t * t * p2[1], w[i]]);
        }
      }
      out.push([...pts[pts.length - 1], w[w.length - 1]]);
      const dense = [out[0]];
      for (let i = 1; i < out.length; i++) {
        const a = out[i - 1], b = out[i], n = Math.max(1, Math.round(dist(a, b) / 3));
        for (let k = 1; k <= n; k++) {
          const t = k / n;
          dense.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
        }
      }
      return dense;
    }
    __name(ligne, "ligne");
    function patte(K, id, L, masque = null) {
      const far = L.far, col = far ? K.coatD : K.coat;
      const pts = ligne([L.top, L.joint, L.fet, L.g], L.w);
      const gauche = [], droite = [];
      pts.forEach((q, i) => {
        const p = pts[Math.max(0, i - 1)], n = pts[Math.min(pts.length - 1, i + 1)], d = dist(p, n) || 1, nx = -(n[1] - p[1]) / d, ny = (n[0] - p[0]) / d;
        gauche.push([q[0] + nx * q[2] / 2, q[1] + ny * q[2] / 2]);
        droite.push([q[0] - nx * q[2] / 2, q[1] - ny * q[2] / 2]);
      });
      const pt = /* @__PURE__ */ __name((q) => `${r2(q[0])},${r2(q[1])}`, "pt");
      const bords = `M${gauche.map(pt).join(" L")} L${[...droite].reverse().map(pt).join(" L")}`;
      const contour = `${bords} Z`;
      const ombre = `<path d="M${droite.map((q) => pt([q[0] - 0.9, q[1]])).join(" L")}" fill="none" stroke="${far ? K.coatS : K.coatS}" stroke-width="1.6" stroke-linecap="round" opacity="${far ? 0.5 : 0.8}"/>`;
      const a = Math.atan2(L.g[1] - L.fet[1], L.g[0] - L.fet[0]) * 180 / Math.PI - 90;
      const hw = L.w[3] / 2 + 0.5;
      const sabot = `<g transform="translate(${r2(L.g[0])} ${r2(L.g[1])}) rotate(${r2(L.posé ? 0 : a)})">${P(`M${r2(-hw)},-2.6 L${r2(-hw - 0.4)},0 L${r2(hw + 0.6)},0 L${r2(hw)},-2.6 Z`, far ? K.hoofS : K.hoof, 0.7)}</g>`;
      const corps = `<path d="${contour}" fill="${col}"/>` + clip(id, contour, ombre) + `<path d="${bords}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>`;
      return (masque ? `<g mask="url(#${masque})">${corps}</g>` : corps) + sabot;
    }
    __name(patte, "patte");
    var PATTES_SE = {
      arriereFond: { top: [37.6, 74.6], joint: [31.8, 96.4], fet: [34.4, 108.8], g: [35, 114], w: [9, 4.4, 3.2, 3], far: true, sens: 1, ph: 0.5 },
      avantFond: { top: [68.2, 80], joint: [68.2, 97.4], fet: [68.4, 110.6], g: [68.6, 116.4], w: [7.8, 4.6, 3.2, 3], far: true, sens: -1, ph: 0.75 },
      arriere: { top: [44, 77], joint: [39, 100.6], fet: [42.4, 114], g: [43, 119.4], w: [12.4, 5, 3.6, 3.4], sens: 1, ph: 0 },
      avant: { top: [75.6, 75], joint: [75.8, 97.6], fet: [76.4, 113.6], g: [77, 121], w: [10.4, 5.4, 3.8, 3.6], sens: -1, ph: 0.25 }
    };
    var PATTES_COUCHE_SE = {
      avantFond: { top: [70, 106], joint: [76, 115.6], fet: [69.4, 118.4], g: [64, 118.8], w: [7.6, 4.4, 3.2, 3], far: true },
      arriere: { top: [44, 104], joint: [31.4, 117.6], fet: [41.6, 120.6], g: [49, 121], w: [11.4, 5, 3.6, 3.4] },
      avant: { top: [78, 104], joint: [85.6, 116.4], fet: [78, 119.8], g: [71.4, 120.4], w: [9.4, 5, 3.6, 3.4] }
    };
    var PATTES_COUCHE_FACE = {
      avantG: { top: [54, 106], joint: [52, 115.8], fet: [54.6, 119.6], g: [57.4, 120], w: [9.6, 5.2, 3.8, 3.6] },
      avantD: { top: [70, 106], joint: [72, 115.8], fet: [69.4, 119.6], g: [66.6, 120], w: [9.6, 5.2, 3.8, 3.6] }
    };
    var SALUT = [0, 0.6, 1, 0.6];
    var COUCHE_DY = 30;
    function auPas(L, u, f, A, lift, dy) {
      const l1 = dist(L.top, L.joint), l2 = dist(L.joint, L.g);
      const top = [L.top[0], L.top[1] + dy];
      let g, posé = true, k = 0;
      if (u < 0.6) {
        const p = 1 - 2 * u / 0.6;
        g = [L.g[0] + f[0] * A * p, L.g[1] + f[1] * A * p];
      } else {
        const q = (u - 0.6) / 0.4, e = q * q * (3 - 2 * q), p = -1 + 2 * e;
        k = Math.sin(Math.PI * q);
        g = [L.g[0] + f[0] * A * p, L.g[1] + f[1] * A * p - lift * k];
        posé = false;
      }
      const r = f[0] === 0 ? (() => {
        const k0 = l1 / (l1 + l2);
        return { milieu: [top[0] + (g[0] - top[0]) * k0, top[1] + (g[1] - top[1]) * k0], bout: g };
      })() : ik(top, g, l1, l2, L.sens);
      const j = r.milieu, b = r.bout, d = dist(j, b) || 1, nx = -(b[1] - j[1]) / d, ny = (b[0] - j[0]) / d;
      const back = -0.6 - k * 2.4;
      const fet = [j[0] + (b[0] - j[0]) * 0.76 + nx * back * Math.sign(f[0] || 1), j[1] + (b[1] - j[1]) * 0.76 + ny * back * Math.sign(f[0] || 1)];
      return { ...L, top, joint: j, fet, g: b, posé };
    }
    __name(auPas, "auPas");
    var PATTES_FACE = {
      arriereG: { top: [49.6, 79], joint: [48.8, 98], fet: [49, 110.4], g: [49.2, 115.6], w: [8, 4.4, 3.2, 3], far: true, sens: 1, ph: 0 },
      arriereD: { top: [74.4, 79], joint: [75.2, 98], fet: [75, 110.4], g: [74.8, 115.6], w: [8, 4.4, 3.2, 3], far: true, sens: 1, ph: 0.5 },
      avantG: { top: [53.8, 74], joint: [53.4, 98], fet: [53.6, 113.6], g: [53.8, 121], w: [11, 5.4, 3.9, 3.6], sens: -1, ph: 0.25 },
      avantD: { top: [70.2, 74], joint: [70.6, 98], fet: [70.4, 113.6], g: [70.2, 121], w: [11, 5.4, 3.9, 3.6], sens: -1, ph: 0.75 }
    };
    function teteFace(K, id, blink, frémit) {
      const t = "M52.6,20 C52.6,13.6 57,11 62,11 C67,11 71.4,13.6 71.4,20 C71.4,25 69,28.6 67.6,32 C66.6,36.2 65.4,40 62,40.2 C58.6,40 57.4,36.2 56.4,32 C55,28.6 52.6,25 52.6,20 Z";
      const oreille = /* @__PURE__ */ __name((x, y, sx) => `<g transform="translate(${x} ${y}) rotate(${sx * -30})">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.2},0.7 Q${sx * -5},-1.8 ${sx * -8.4},-0.9 Q${sx * -5},1.8 ${sx * -1.2},1.8 Z`, K.inner, 0)}</g>`, "oreille");
      let s = (frémit ? `<g transform="rotate(-10 53.6 16.6)">${oreille(53.6, 16.6, 1)}</g>` : oreille(53.6, 16.6, 1)) + oreille(70.4, 16.6, -1);
      s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="67" y="10" width="8" height="32" fill="${K.coatS}" opacity=".45"/>` + E(62, 35.6, 4.6, 4.2, K.belly, 0) + lueur("M62,12.4 L62,17.2 M59.4,14.6 L62,17.2 L64.6,14.6 M62,17.2 L62,21", K.vein, 0.35, 0.9) + etoile(62, 17.2, 0.8, K.star)) + P(t, "none");
      s += E(62, 37.8, 2.8, 1.6, K.nose, 0.5) + E(61.2, 37.3, 0.7, 0.4, "#8A94AE", 0) + P("M60.2,40 Q62,41 63.8,40", "none", 0.5);
      s += oeil(`${id}e0`, 56.8, 22.8, 1, blink) + oeil(`${id}e1`, 67.2, 22.8, -1, blink);
      return s;
    }
    __name(teteFace, "teteFace");
    function gorgeFace(K) {
      return `<path d="M57.4,38 Q62,40.6 66.6,38 Q68.6,46 67.4,54 Q65,61 62,64 Q59,61 56.6,54 Q55.4,46 57.4,38 Z" fill="${K.belly}" opacity=".95"/>`;
    }
    __name(gorgeFace, "gorgeFace");
    function vueFace(K, id, pose, n, t, blink, br, bob, nod) {
      const walk = pose === "marche", couche = pose === "couche", k = pose === "salut" ? SALUT[n % 4] : 0;
      const leg = /* @__PURE__ */ __name((key) => {
        if (couche) return { ...PATTES_COUCHE_FACE[key], posé: false };
        const L = PATTES_FACE[key];
        return walk ? auPas(L, (t + L.ph) % 1, [0, 1], 2.4, key.startsWith("avant") ? 4 : 3.2, bob) : { ...L, posé: true };
      }, "leg");
      if (couche) bob = COUCHE_DY;
      let g = `<ellipse cx="62" cy="${couche ? 120 : 118.4}" rx="${couche ? 26 : 22}" ry="4.2" fill="rgba(30,40,70,.2)"/>`;
      if (!couche) g += patte(K, `${id}pa`, leg("arriereG")) + patte(K, `${id}pb`, leg("arriereD"));
      const ventre = "M46.6,78 C46.6,73 53,70.6 62,70.6 C71,70.6 77.4,73 77.4,78 C77.4,83 71,86 62,86 C53,86 46.6,83 46.6,78 Z";
      const cou = `M55,56 C54.6,46 55.8,${r2(38 + k * 4)} 57,${r2(31 + k * 8)} L67,${r2(31 + k * 8)} C68.2,${r2(38 + k * 4)} 69.4,46 69,56 Z`;
      const poitrail = `M47.6,60 C47.6,${r2(52 + br)} 54.6,${r2(48 + br)} 62,${r2(48 + br)} C69.4,${r2(48 + br)} 76.4,${r2(52 + br)} 76.4,60 C78,70 75.4,79 69,83 C65,85.4 59,85.4 55,83 C48.6,79 46,70 47.6,60 Z`;
      let haut = P(ventre, K.coatS) + P(cou, K.coat) + clip(`${id}k`, cou, `<rect x="64.6" y="30" width="6" height="30" fill="${K.coatS}" opacity=".5"/>`) + P(cou, "none");
      haut += P(poitrail, K.coat) + clip(`${id}c`, poitrail, `<ellipse cx="62" cy="86" rx="16" ry="6" fill="${K.coatS}" opacity=".85"/><rect x="71.4" y="48" width="8" height="40" fill="${K.coatS}" opacity=".5"/>` + lueur("M50.4,62 L54,66.4 L51.8,72.6 M73.6,62 L70,66.4 L72.2,72.6", K.vein, 0.35, 0.8) + [[54, 66.4], [51.8, 72.6], [70, 66.4], [72.2, 72.6]].map(([x, y]) => etoile(x, y, 0.7, K.star)).join("")) + P(poitrail, "none");
      g += `<g transform="translate(0 ${bob})">${haut}</g>`;
      g += `<mask id="${id}hors" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="144"><rect x="0" y="0" width="120" height="144" fill="#fff"/><path d="${poitrail}" fill="#000" stroke="#fff" stroke-width="2.4" transform="translate(0 ${bob})"/></mask>`;
      g += patte(K, `${id}pc`, leg("avantG"), `${id}hors`) + patte(K, `${id}pd`, leg("avantD"), `${id}hors`);
      haut = `<g transform="translate(0 ${r2(k * 3)})">${gorgeFace(K)}</g><g transform="translate(0 ${r2(br * 0.6 + nod + k * 8)})"><g transform="translate(-20.7 0)">${bois(K, n, 1)}</g>${teteFace(K, id, blink || k > 0.8, !walk && n % 4 === 2)}</g>`;
      g += `<g transform="translate(0 ${bob})">${haut}</g>`;
      return g;
    }
    __name(vueFace, "vueFace");
    function cerfLune(view = "se", pose = "debout", n = 0, o = {}) {
      const K = C, id = `cl${o.id || ""}${view}${pose}${n}`;
      const walk = pose === "marche", couche = pose === "couche";
      const N = walk ? 8 : 4, t = n % N / N;
      const blink = o.blink != null ? o.blink : !walk && n % 4 === 3;
      const br = walk ? 0 : [0, -0.4, -0.7, -0.4][n % 4];
      let bob = walk ? r2(-0.7 * Math.abs(Math.sin(t * Math.PI * 2))) : 0;
      const nod = walk ? r2(0.9 * Math.sin(t * Math.PI * 4)) : 0;
      let s = "";
      s += `<defs><radialGradient id="${id}gl"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity=".5"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="72" rx="58" ry="70" fill="url(#${id}gl)"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" values=".8;1;.8" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></ellipse>`;
      if (view === "front") return s + `<g transform="translate(-2 20)">${vueFace(K, id, pose, n, t, blink, br, bob, nod)}</g>`;
      const dos = view === "ne";
      const k = pose === "salut" ? SALUT[n % 4] : 0;
      if (couche) bob = COUCHE_DY;
      let g = couche ? `<ellipse cx="56" cy="120.6" rx="34" ry="4.4" fill="rgba(30,40,70,.2)"/>` : `<ellipse cx="58" cy="117.4" rx="29" ry="4" fill="rgba(30,40,70,.2)" transform="rotate(${dos ? -6 : 6} 58 117.4)"/>`;
      const f = dos ? [1, -0.1] : [1, 0.1];
      const leg = /* @__PURE__ */ __name((key) => {
        if (couche) return PATTES_COUCHE_SE[key] && { ...PATTES_COUCHE_SE[key], posé: false };
        const L = PATTES_SE[key];
        return walk ? auPas(L, (t + L.ph) % 1, f, key.startsWith("avant") ? 5.6 : 5, key.startsWith("avant") ? 4.4 : 3.6, bob) : { ...L, posé: true };
      }, "leg");
      if (!couche) g += patte(K, `${id}pa`, leg("arriereFond"));
      g += patte(K, `${id}pb`, leg("avantFond"));
      const qa = walk ? r2(6 * Math.sin(t * Math.PI * 4)) : [0, -14, 0, 0][n % 4];
      const queue = dos ? "M31,57.4 Q23.6,54.8 22.6,60.6 Q23.4,67.2 29.6,65.8 Z" : "M30,59.4 Q24.2,57 23.4,61.8 Q24,66.4 29,65 Z";
      if (!dos) g += `<g transform="translate(0 ${bob}) rotate(${qa} 29.6 62)">${P(queue, K.belly, 0.75)}</g>`;
      const nx = k * 1.6, ny = k * 11;
      const corps = `M${r2(76 + nx)},${r2(27 + ny)} C${r2(70 + nx * 0.6)},${r2(32 + ny * 0.6)} 64,42 60,${r2(50 + br)} C52,${r2(50 + br)} 42,${r2(51 + br)} 36,53.6 C30.4,56.2 28.6,61.6 29.4,67 C30.2,72.8 34.6,77.4 40.6,78.8 C49,80.6 58,80.8 66,80.4 C72,83 80,82 83,76 C86,70 86,62 84,56 C86,50 ${r2(86.6 + nx * 0.6)},${r2(44 + ny * 0.6)} ${r2(85 + nx)},${r2(38 + ny)} Z`;
      let haut = P(corps, K.coat) + clip(
        `${id}c`,
        corps,
        // l'ombre du ventre, le côté loin, la croupe et l'épaule, le cou
        `<ellipse cx="56" cy="88" rx="32" ry="9" fill="${K.coatS}" opacity=".85"/><path d="M32.6,59 Q33.8,70.6 42,78" fill="none" stroke="${K.coatS}" stroke-width="1.3" stroke-linecap="round"/><path d="M66,56 Q72,66 70,80" fill="none" stroke="${K.coatS}" stroke-width="1.3" stroke-linecap="round"/><path d="M64,44 Q70,34 76,29" fill="none" stroke="${K.belly}" stroke-width="2" stroke-linecap="round" opacity=".9"/>` + lueur("M36,64 L43,60 L50,65 L57,60.4 M43,60 L42.4,70 M50,65 L53,72.6", K.vein, 0.4, 0.85) + [[36, 64, 0.8], [43, 60, 1], [50, 65, 0.9], [57, 60.4, 0.8], [42.4, 70, 0.7], [53, 72.6, 0.7]].map(([x, y, r]) => etoile(x, y, r, K.star)).join("") + lueur("M68,48 L72,56 L70,66", K.vein, 0.35, 0.75) + etoile(72, 56, 0.7, K.star) + [[39, 56.4, 1.2], [47, 54.4, 1], [54, 54.6, 1.1], [44, 59.6, 0.8]].map(([x, y, r]) => E(x, y, r, r * 0.7, K.coatS, 0)).join("") + (dos ? E(32.2, 63.4, 5.4, 7.4, K.belly, 0) + `<path d="M36,53.6 C44,51.6 54,51.6 60.6,${r2(50 + br)} C65,43 70,35 75,29" fill="none" stroke="${K.coatS}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>` : "")
      ) + P(corps, "none");
      if (dos) haut += `<g transform="rotate(${qa} 29.6 62)">${P(queue, K.belly, 0.75)}</g>`;
      g += `<g transform="translate(0 ${bob})">${haut}</g>`;
      g += `<mask id="${id}hors" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="144"><rect x="0" y="0" width="120" height="144" fill="#fff"/><path d="${corps}" fill="#000" stroke="#fff" stroke-width="2.4" transform="translate(0 ${bob})"/></mask>`;
      g += patte(K, `${id}pc`, leg("arriere"), `${id}hors`) + patte(K, `${id}pd`, leg("avant"), `${id}hors`);
      const incline = `translate(${r2(nx)} ${r2(br * 0.6 + nod + ny)}) rotate(${r2(k * 6)} 82.6 26)`;
      haut = dos ? `<g transform="${incline}">${teteDeDos(K, id, !walk && n % 4 === 2)}${bois(K, n)}</g>` : `<g transform="translate(${r2(nx * 0.4)} ${r2(ny * 0.4)})">${gorge(K)}</g><g transform="${incline}">${bois(K, n)}${tete(K, id, blink || k > 0.8, !walk && n % 4 === 2)}</g>`;
      g += `<g transform="translate(0 ${bob})">${haut}</g>`;
      return s + `<g transform="translate(-2 20)">${g}</g>`;
    }
    __name(cerfLune, "cerfLune");
    var svgCL = /* @__PURE__ */ __name((body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${120 * scale}" height="${144 * scale}" viewBox="0 0 120 144">${body}</svg>`, "svgCL");
    module.exports = { cerfLune, svgCL, C, PATTES_SE };
  }
});

// atelier/vivants_refonte.js
var require_vivants_refonte = __commonJS({
  "atelier/vivants_refonte.js"(exports, module) {
    var A = require_anya();
    var { IMAGES } = require_troupe2();
    var { bulle, apparitionSur, BULLES } = require_anya_anims();
    var CL = require_cerf_lune();
    var { enPersonnage } = require_couleurs();
    var SAISONS = A.SAISONS_A;
    var suffixe = /* @__PURE__ */ __name((saison) => saison === "ete" ? "" : `_${saison}`, "suffixe");
    var VUE = { face: "front", avant: "se", dos: "ne" };
    var VUE_CERF = { face: "front", avant: "se", dos: "ne" };
    var svgA = /* @__PURE__ */ __name((body) => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="128" viewBox="0 0 80 128">${body}</svg>`, "svgA");
    var repos = /* @__PURE__ */ __name((vue, n, saison, expr = "neutre") => A.anyaFrame(VUE[vue], "repos", n, expr, saison), "repos");
    var POSES = [
      ["repos", ["face", "avant", "dos"], IMAGES.repos, repos],
      ["marche", ["avant", "dos"], IMAGES.marche, (vue, n, saison) => A.anyaFrame(VUE[vue], "marche", n, "neutre", saison)],
      ["benediction", ["face"], IMAGES.salut, (vue, n, saison) => A.anyaFrame(VUE[vue], "salut", n, "content", saison)],
      ["eveil", ["face"], IMAGES.action, (vue, n, saison) => A.anyaFrame(VUE[vue], "action", n, "content", saison)],
      ["apparaitre", ["face", "avant", "dos"], 6, (vue, n, saison) => apparitionSur(() => repos(vue, 0, saison), n)],
      ["disparaitre", ["face", "avant", "dos"], 6, (vue, n, saison) => apparitionSur(() => repos(vue, 0, saison), 5 - n)],
      // (elle dit les glyphes l'un après l'autre ; elle ne cligne pas en parlant : les trois premières images du repos)
      ...BULLES.map((g, i) => [
        `murmure${i + 1}`,
        ["face", "avant", "dos"],
        4,
        (vue, n, saison) => repos(vue, [0, 1, 2, 1][n], saison, "content") + bulle(i, [0, 1, 2, g.length][n], n ? 1 : 0.6)
      ])
    ];
    var EXPR = { neutre: "neutre", content: "content", surpris: "surpris", triste: "triste" };
    function anya2(pose, vue, n, saison = "ete") {
      const p = POSES.find((x) => x[0] === pose);
      if (!p) throw new Error(`pose inconnue : ${pose} (${POSES.map((x) => x[0]).join(", ")})`);
      if (!p[1].includes(vue)) throw new Error(`vue inconnue pour ${pose} : ${vue} (${p[1].join(", ")})`);
      if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(", ")})`);
      if (!(n >= 1 && n <= p[2])) throw new Error(`image ${n} : de 1 à ${p[2]}`);
      return { lib: `vivants/anya/anya_${vue}_${pose}${suffixe(saison)}_${n}.svg`, svg: svgA(enPersonnage(p[3](vue, n - 1, saison))), images: p[2] };
    }
    __name(anya2, "anya");
    function anyaExpression2(expr, n, saison = "ete") {
      if (!EXPR[expr]) throw new Error(`expression inconnue : ${expr} (${Object.keys(EXPR).join(", ")})`);
      if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(", ")})`);
      if (!(n >= 1 && n <= IMAGES.repos)) throw new Error(`image ${n} : de 1 à ${IMAGES.repos}`);
      return { lib: `vivants/anya/anya_expr_${expr}${suffixe(saison)}_${n}.svg`, svg: svgA(repos("face", n - 1, saison, EXPR[expr])), images: IMAGES.repos };
    }
    __name(anyaExpression2, "anyaExpression");
    var CERF = { debout: 4, marche: 8, couche: 4, salut: 4, repos: 1, clignement: 1 };
    var VUES_CERF = ["face", "avant", "dos"];
    function cerf2(vue, pose, n = 1) {
      if (!VUES_CERF.includes(vue)) throw new Error(`vue inconnue : ${vue} (${VUES_CERF.join(", ")})`);
      if (!CERF[pose]) throw new Error(`pose inconnue : ${pose} (${Object.keys(CERF).join(", ")})`);
      const k = CERF[pose];
      if (!(n >= 1 && n <= k)) throw new Error(`image ${n} : de 1 à ${k}`);
      const [p, i] = pose === "repos" ? ["debout", 0] : pose === "clignement" ? ["debout", 3] : [pose, n - 1];
      return { lib: `vivants/cerf/cerf_${vue}_${pose}${k > 1 ? `_${n}` : ""}.svg`, svg: CL.svgCL(CL.cerfLune(VUE_CERF[vue], p, i, { id: "cl" })), images: k };
    }
    __name(cerf2, "cerf");
    function liste2() {
      const out = [];
      for (const [pose, vues, k] of POSES) for (const vue of vues) for (const saison of SAISONS) {
        for (let n = 1; n <= k; n++) out.push(["anya", [pose, vue, n, saison]]);
      }
      for (const saison of SAISONS) for (const x of Object.keys(EXPR)) for (let n = 1; n <= IMAGES.repos; n++) out.push(["anyaExpression", [x, n, saison]]);
      for (const vue of VUES_CERF) for (const [pose, k] of Object.entries(CERF)) for (let n = 1; n <= k; n++) out.push(["cerf", [vue, pose, n]]);
      return out;
    }
    __name(liste2, "liste");
    module.exports = { anya: anya2, anyaExpression: anyaExpression2, cerf: cerf2, liste: liste2, POSES, EXPR, CERF, VUES_CERF, SAISONS };
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
        const m = base.match(/^cerf_(?:(avant|dos|face)_)?([a-z]+)(?:_(\d+))?$/);
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
    var ANYA_MS = { eveil: [700, 900], repos: [1100, 900, 1100, 180], expr: [1100, 900, 1100, 180], marche: 130, benediction: 400, murmure: 420, apparaitre: 260, disparaitre: 260 };
    function vitessePersonnage(id, pose) {
      const [top, a] = id.split("/");
      if (top === "vivants") {
        if (a === "brume") return /expr/.test(id) ? 600 : 220;
        if (a === "cerf-blanc") return { debout: 420, marche: 120, couche: 520, salut: 420 }[pose];
        if (a === "anya") return ANYA_MS[pose.replace(/\d+$/, "")];
        if (pose === "marche") return 100;
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
var import_vivants_refonte = __toESM(require_vivants_refonte(), 1);
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
var STADES = Object.keys(import_brume.default.STAGES);
var EXPR_BRUME = import_troupe.default.EXPRS.filter((x) => x !== "fache");
var POSES_PASSEUR = [...import_troupe.default.POSES, [import_passeur.default.action[0], import_passeur.default.action[1], "action", 2]];
var POSTURES_ANYA = Object.fromEntries(import_vivants_refonte.default.liste().filter(([f, a]) => f === "anya" && a[2] === 1 && a[3] === "ete").map(([, [pose, vue]]) => [`${vue}_${pose}`, import_vivants_refonte.default.anya(pose, vue, 1).images]));
var VIVANTS = {
  brume: { stades: STADES, images: 4, expressions: EXPR_BRUME, images_expression: 2 },
  anya: { postures: POSTURES_ANYA, saisons: import_vivants_refonte.default.SAISONS, expressions: Object.keys(import_vivants_refonte.default.EXPR), images_expression: 4 },
  cerf: { vues: import_vivants_refonte.default.VUES_CERF, poses: import_vivants_refonte.default.CERF },
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
  if (!POSTURES_ANYA[posture]) throw new Error(`posture inconnue : ${posture} (${Object.keys(POSTURES_ANYA).join(", ")})`);
  const [vue, pose] = posture.split("_");
  const { lib, svg, images } = import_vivants_refonte.default.anya(pose, vue, n, saison);
  return rendu(lib, svg, pose, images);
}
__name(anya_, "anya_");
function anyaExpression_(expr, n, saison = "ete") {
  const { lib, svg, images } = import_vivants_refonte.default.anyaExpression(expr, n, saison);
  return rendu(lib, svg, "expr", images);
}
__name(anyaExpression_, "anyaExpression_");
function cerf_(vue, pose, n = 1) {
  const { lib, svg, images } = import_vivants_refonte.default.cerf(vue, pose, n);
  return rendu(lib, svg, pose, images);
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
  for (const [f, a] of import_vivants_refonte.default.liste()) {
    if (f === "anya") ajoute("anya", anya_, [`${a[1]}_${a[0]}`, a[2], a[3]]);
    else if (f === "anyaExpression") ajoute("anyaExpression", anyaExpression_, a);
    else ajoute("cerf", cerf_, a);
  }
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
