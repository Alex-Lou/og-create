// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_personnages.mjs : ne pas modifier à la main.
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
    function memo2(fn, max = 4096) {
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
    __name(memo2, "memo");
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
    var mix = memo2((a, b, k) => {
      const p = /* @__PURE__ */ __name((c) => [0, 2, 4].map((i) => parseInt(c.slice(1 + i, 3 + i), 16)), "p"), A2 = p(a), B = p(b);
      return "#" + A2.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    });
    var ton = memo2((c, k) => {
      const [h, s, l] = hsl(c);
      if (k >= 1) return hex([h, s, l + (1 - l) * (k - 1)]);
      return mix(hex([h, s, l * k]), NUIT, Math.min(0.28, (1 - k) * 1.1));
    });
    var delave = memo2((c, k = 1) => {
      const [h, s, l] = hsl(c);
      return mix(hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]), PASTEL, 0.3 * k);
    });
    var clarte = /* @__PURE__ */ __name((c) => hsl(c)[2], "clarte");
    var enPersonnage = /* @__PURE__ */ __name((svg) => svg.replaceAll(ENCRE_KIT, ENCRE), "enPersonnage");
    var BANDES = [
      [15, 350, 0.35],
      [40, 6, 0.3],
      [62, 28, 0.3],
      [100, 165, 0.45],
      [160, 172, 0.4],
      [200, 186, 0.3],
      [240, 232, 0.3],
      [275, 262, 0.3],
      [315, 300, 0.35],
      [345, 328, 0.35],
      [360, 350, 0.35]
    ];
    var vers = /* @__PURE__ */ __name((h, cible, k) => {
      const d = (cible - h + 540) % 360 - 180;
      return (h + d * k + 360) % 360;
    }, "vers");
    var fondu = memo2((c) => {
      const [h, s, l] = hsl(c);
      if (s < 0.12) return hex([255, Math.max(s, 0.1), l]);
      if (h >= 15 && h < 62 && s < 0.55) return hex([vers(h, l > 0.7 ? 300 : 330, 0.5), s * 0.8, l]);
      if (h >= 62 && h < 100) return hex([vers(h, 165, 0.4), s * 0.85, l]);
      const [, cible, k] = BANDES.find(([fin]) => h < fin);
      return hex([vers(h, cible, k), Math.min(1, s * 1.04), l]);
    });
    var GARDER = /^(skin|lid|under|nose|hair|grey|stubble|beard|white|brow|eye|iris|cheek|mouth|tongue|freckle|lip|hand|vein|scar|mole|teeth|rim|brass|steel|copper|silver|iron|gem|glass|gold|glow|firefly|star|moon)/i;
    var HEXA = /#[0-9A-Fa-f]{6}\b/g;
    var UNE = /^#[0-9A-Fa-f]{6}$/;
    var fonduTexte = /* @__PURE__ */ __name((s) => s.replace(HEXA, (m) => fondu(m.toUpperCase())), "fonduTexte");
    function fondre(x, garder = GARDER) {
      if (typeof x === "string") return fonduTexte(x);
      if (typeof x === "function") return (...a) => fondre(x(...a), garder);
      if (Array.isArray(x)) return x.map((v) => fondre(v, garder));
      if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).map(([k, v]) => garder.test(k) ? [k, v] : [UNE.test(k) ? fonduTexte(k) : k, fondre(v, garder)]));
      return x;
    }
    __name(fondre, "fondre");
    module.exports = { ENCRE, ENCRE_KIT, NUIT, PASTEL, memo: memo2, hsl, hex, mix, ton, delave, clarte, enPersonnage, fondu, fondre, GARDER };
  }
});

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
      const reprise = r22(1 - Math.abs(Math.cos(n / 8 * Math.PI * 2)) + descente(cc, v));
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
        return c.jambe ? c.jambe(c, r22(os.cheville[0]), r22(os.cheville[1]), dir, 0) : dessinJambe(c, hanche, os, dir, 0, avant);
      }
      if (c.jambe) return c.jambe(c, x, y, dir, tilt);
      tilt = tilt ? r22(tilt * 0.25) : 0;
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
      const A2 = arc(k0, 1), B = arc(k1, -1);
      return {
        d: `M${pt(A2.p)} Q${pt(A2.c)} ${pt(A2.q)} L${pt(B.p)} Q${pt(B.c)} ${pt(B.q)} Z`,
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
        s += T2.arm({ ...c, bras: null, cuff: null }, a, g.b, coude, g.main, "derriere") + `<path d="${r.d}" fill="${OUT}" stroke="${OUT}" stroke-width="${r22(W * 2)}" stroke-linejoin="round"/><path d="${r.d}" fill="${c.cuff}"/>`;
      }
      if (partie === "derriere") return s;
      return s + (g.main != null ? g.main : T2.poing(c, g.b));
    }
    __name(brasDuKit, "brasDuKit");
    function avecOs(c) {
      const brasL = [0, 1].map((i) => Math.hypot(c.hands[i][0] - c.shoulders[i][0], c.hands[i][1] - c.shoulders[i][1]));
      const dessin2 = c.bras;
      const bras = dessin2 ? (cc, a, b, elbow, main, partie) => {
        const g = poserBras(cc, a, b, elbow, main);
        return dessin2(cc, a, g.b, g.elbow || void 0, g.main, partie);
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
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var st = /* @__PURE__ */ __name((w = W) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "P");
    var E = /* @__PURE__ */ __name((cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r22(cx)}" cy="${r22(cy)}" rx="${r22(rx)}" ry="${r22(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`, "E");
    var L = /* @__PURE__ */ __name((a, b, color, w) => `<line x1="${r22(a[0])}" y1="${r22(a[1])}" x2="${r22(b[0])}" y2="${r22(b[1])}" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round"/>`, "L");
    var limb = /* @__PURE__ */ __name((a, b, w, fill) => L(a, b, OUT, w + W * 2) + L(a, b, fill, w), "limb");
    var clip = /* @__PURE__ */ __name((id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, "clip");
    var IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 };
    var lerp = /* @__PURE__ */ __name((a, b, k) => Array.isArray(a) ? a.map((v, i) => r22(v + (b[i] - v) * k)) : r22(a + (b - a) * k), "lerp");
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
      if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45);
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
      const loinG = view === "se" && c.brasLointain === "gauche";
      const dosG = view === "ne" && c.brasLointain === "gauche";
      const ecart = loinG || dosG ? 1.3 : 0, ecartD = dosG ? 1.3 : 0;
      const shL = [c.shoulders[0][0] - ecart, c.shoulders[0][1]], shR = [c.shoulders[1][0] + ecartD, c.shoulders[1][1]];
      const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4;
      const handL = [r22(c.hands[0][0] - ecart + swing * bal), r22(c.hands[0][1] + swing * balY)];
      const handR = [r22(c.hands[1][0] + ecartD - swing * bal), r22(c.hands[1][1] - swing * balY)];
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
    module.exports = { OUT, W, r2: r22, st, P, E, L, limb, clip, pivotPied, eyes, expression, visageVide, EXPRS, TRAITS, dechirure, filPendant, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
  }
});

// atelier/troupe.js
var require_troupe2 = __commonJS({
  "atelier/troupe.js"(exports, module) {
    module.exports = require_troupe();
  }
});

// personnages/avatar_choix.js
var require_avatar_choix = __commonJS({
  "personnages/avatar_choix.js"(exports, module) {
    var { hsl, hex, mix, ton: tone, delave, clarte } = require_couleurs();
    var nuancier = /* @__PURE__ */ __name((list) => Object.fromEntries(list.map(([k, c]) => [k, c])), "nuancier");
    var noms = /* @__PURE__ */ __name((list) => Object.fromEntries(list.map(([k, , n]) => [k, n])), "noms");
    var PEAU = [
      ["nacre", "#FDE8D7", "Nacre"],
      ["porcelaine", "#F9D3B0", "Porcelaine"],
      ["rosee", "#F6C8B1", "Rosée"],
      ["peche", "#F5C99D", "Pêche"],
      ["doree", "#F1C290", "Dorée"],
      ["miel", "#EDB98B", "Miel"],
      ["sable", "#E0AA76", "Sable"],
      ["ocre", "#D49A64", "Ocre"],
      ["cannelle", "#CD8A5A", "Cannelle"],
      ["bronze", "#B87A48", "Bronze"],
      ["cuivre", "#A6693E", "Cuivre"],
      ["cacao", "#905938", "Cacao"],
      ["acajou", "#7F4B30", "Acajou"],
      ["ebene", "#6D432E", "Ébène"],
      ["ombre", "#5E3926", "Terre d'ombre"],
      ["nuit", "#4C2D1E", "Nuit"]
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
      ["blanc", "#F0E9F3", "Blanc"],
      ["creme", "#E7D9E2", "Crème"],
      ["sable", "#BCA3AB", "Sable"],
      ["caramel", "#B46C64", "Caramel"],
      ["cuir", "#52303E", "Cuir"],
      ["charbon", "#44445E", "Charbon"],
      ["noir", "#242030", "Noir"],
      ["rosepale", "#F8C3D4", "Rose pâle"],
      ["rose", "#EB82A3", "Rose"],
      ["framboise", "#CE4278", "Framboise"],
      ["corail", "#EF6E5A", "Corail"],
      ["rouge", "#CC4245", "Rouge"],
      ["bordeaux", "#6C2A45", "Bordeaux"],
      ["abricot", "#F7A260", "Abricot"],
      ["soleil", "#F6C059", "Soleil"],
      ["menthe", "#76CEB0", "Menthe"],
      ["olive", "#607A55", "Olive"],
      ["foret", "#407A5B", "Forêt"],
      ["ciel", "#6EA9DE", "Ciel"],
      ["lagon", "#3AACAD", "Lagon"],
      ["jean", "#425A92", "Jean"],
      ["marine", "#2D3767", "Marine"],
      ["lavande", "#A387DB", "Lavande"],
      ["prune", "#7A3964", "Prune"]
    ];
    var METAUX = [["or", "#E2B34A", "Or"], ["argent", "#C9CED6", "Argent"], ["orrose", "#E6A88E", "Or rose"], ["cuivre", "#C77A4A", "Cuivre"], ["sombre", "#4A3A30", "Écaille sombre"]];
    var LEVRES = [["naturelles", null, "Naturelles"], ["rose", "#E07A8A", "Rosées"], ["corail", "#E8705A", "Corail"], ["framboise", "#C8466E", "Framboise"], ["nude", "#C98B7A", "Nude"], ["prune", "#8E3E5E", "Prune"], ["rouge", "#C8303A", "Rouges"]];
    var TEINTURES = [
      ["nacre", "#F2E4F2", "Nacre", "rare", "boutique"],
      ["opale", "#BDE7E4", "Opale", "rare", "coffre"],
      ["or", "#E6B450", "Or", "epique", "coffre"],
      ["argent", "#C7CBDC", "Argent", "rare", "boutique"],
      ["rubis", "#B51F44", "Rubis", "epique", "coffre"],
      ["saphir", "#2E4EAE", "Saphir", "epique", "boutique"],
      ["emeraude", "#1C8060", "Émeraude", "epique", "coffre"],
      ["amethyste", "#7E3EB0", "Améthyste", "rare", "coffre"],
      ["onyx", "#181424", "Onyx", "rare", "boutique"],
      ["aurore", "#FAB5B0", "Aurore", "legendaire", "coffre"]
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
      genre: { femme: "Femme", homme: "Homme" },
      taille: { petite: "Petite", moyenne: "Moyenne", grande: "Grande" },
      silhouette: { fine: "Fine", moyenne: "Moyenne", large: "Large", ronde: "Ronde" },
      visage: { rond: "Rond", ovale: "Ovale", coeur: "En cœur", carre: "Carré", anguleux: "Anguleux", large: "Large" },
      formeYeux: { ronds: "Ronds", amande: "En amande", grands: "Grands", rieurs: "Rieurs", paisibles: "Paisibles" },
      cils: { sans: "Sans", legers: "Légers", recourbes: "Recourbés" },
      sourcils: { fins: "Fins", epais: "Épais", doux: "Doux" },
      barbe: { sans: "Sans", malRase: "Mal rasé", courte: "Barbe courte", collier: "Collier", bouc: "Bouc", pleine: "Barbe pleine" },
      moustache: { sans: "Sans", fine: "Fine", epaisse: "Chevron", guidon: "Guidon", gauloise: "Gauloise" },
      bouche: { douce: "Douce", sourire: "Souriante", malice: "Malicieuse", serieuse: "Sérieuse" },
      // l'expression générale du visage, au repos, partout (choix de l'auteur, 15 oct. : « un visage neutre par défaut, c'est
      // au joueur de choisir son expression ») ; les gestes gardent leurs mimiques (troupe.js : frame, c.repos)
      expression: { neutre: "Neutre", content: "Joie", soulage: "Soulagement", triste: "Tristesse", surpris: "Surprise", gene: "Gêne", fache: "Colère" },
      rousseur: { non: "Sans", legere: "Quelques-unes", oui: "Taches de rousseur", dense: "Beaucoup", nez: "Sur le nez" },
      menton: { doux: "Doux", fin: "Fin", court: "Court", fort: "Fort", fendu: "Fendu" },
      age: { jeune: "Jeune", adulte: "Adulte", mur: "Mûr", age: "Âgé" },
      cicatrice: { sans: "Sans", sourcil: "Au sourcil", joue: "Sur la joue", nez: "Sur le nez", levre: "À la lèvre" },
      joues: { roses: "Roses", discretes: "Discrètes", sans: "Sans" },
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
        rasee: "Rasée",
        degrade: "Dégradé",
        banane: "Banane",
        raie: "Raie sur le côté",
        herisse: "Hérissée",
        boucleeCourte: "Bouclée courte",
        chignonHomme: "Chignon d'homme",
        pixie: "Pixie",
        demiQueue: "Demi-queue",
        tresseCote: "Tresse sur le côté",
        puffs: "Puffs",
        locksLongues: "Locks longues"
      },
      meches: { sans: "Une couleur", pointes: "Pointes colorées", meches: "Mèches" },
      haut: { tshirt: "T-shirt", debardeur: "Débardeur", polo: "Polo", mariniere: "Marinière", chemise: "Chemise", pull: "Pull", colRoule: "Col roulé", sweat: "Sweat à capuche", gilet: "Gilet", veste: "Veste ouverte" },
      // la robe d'une pièce remplace le haut (le choix du haut est gardé : il revient si l'on change de bas)
      bas: { pantalon: "Pantalon", short: "Short", bermuda: "Bermuda", salopette: "Salopette", jupe: "Jupe", jupePlissee: "Jupe plissée", robe: "Robe chasuble", robeEntiere: "Robe", robeLongue: "Robe longue" },
      formeChaussures: { souliers: "Souliers", baskets: "Baskets", bottines: "Bottines", bottes: "Bottes", sandales: "Sandales", ballerines: "Ballerines", sabots: "Sabots" },
      // un habit d'une couleur, ou en dégradé de sa couleur vers une seconde (du haut au bas de la pièce)
      motifHaut: { uni: "Uni", degrade: "Dégradé", raye: "Rayé", pois: "À pois" },
      motifBas: { uni: "Uni", degrade: "Dégradé", raye: "Rayé", pois: "À pois" }
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
    var SOURCES = { gratuit: 0, boutique: 1, coffre: 2 };
    var parOrdre = /* @__PURE__ */ __name((o) => Object.fromEntries(Object.entries(o).sort(([, a], [, b]) => Object.keys(EMPLACEMENTS).indexOf(a.emplacement) - Object.keys(EMPLACEMENTS).indexOf(b.emplacement) || SOURCES[a.source] - SOURCES[b.source] || (a.prix || 0) - (b.prix || 0))), "parOrdre");
    var A2 = /* @__PURE__ */ __name((nom, emplacement, zones, defaut, rarete, source, garde, saison) => ({ nom, emplacement, zones, defaut, rarete, source, ...prix(rarete, source), garde, ...saison ? { saison } : {} }), "A");
    var ACCESSOIRES = parOrdre({
      bonnet: A2("Bonnet", "tete", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false),
      paille: A2("Chapeau de paille", "tete", ["tissu"], ["rouge"], "commun", "gratuit", false),
      casquette: A2("Casquette", "tete", ["tissu"], ["ciel"], "commun", "gratuit", false),
      bandana: A2("Bandana", "tete", ["tissu"], ["rouge"], "commun", "gratuit", true),
      couronneFleurs: A2("Couronne de fleurs", "tete", ["tissu"], ["rose"], "commun", "gratuit", false),
      beret: A2("Béret", "tete", ["tissu"], ["bordeaux"], "commun", "boutique", false),
      oreillesChat: A2("Oreilles de chat", "tete", ["tissu"], ["noir"], "rare", "boutique", false),
      oreillesLapin: A2("Oreilles de lapin", "tete", ["tissu"], ["blanc"], "rare", "coffre", false),
      diademe: A2("Diadème", "tete", ["metal"], ["or"], "legendaire", "coffre", false),
      noeud: A2("Nœud", "cheveux", ["tissu"], ["rose"], "commun", "gratuit", true),
      barrettes: A2("Barrettes", "cheveux", ["tissu"], ["soleil"], "commun", "gratuit", true),
      fleur: A2("Fleur", "cheveux", ["tissu"], ["corail"], "commun", "boutique", true),
      etoile: A2("Barrette étoile", "cheveux", ["metal"], ["or"], "rare", "coffre", true),
      lunettesRondes: A2("Lunettes rondes", "visage", ["metal"], ["sombre"], "commun", "gratuit", true),
      lunettesCarrees: A2("Lunettes carrées", "visage", ["tissu"], ["noir"], "commun", "gratuit", true),
      lunettesPapillon: A2("Lunettes papillon", "visage", ["tissu"], ["framboise"], "commun", "boutique", true),
      lunettesSoleil: A2("Lunettes de soleil", "visage", ["tissu"], ["noir"], "commun", "boutique", false),
      tricorne: A2("Tricorne", "tete", ["tissu"], ["noir"], "commun", "gratuit", false),
      hautForme: A2("Haut-de-forme", "tete", ["tissu"], ["noir"], "commun", "gratuit", false),
      monocle: A2("Monocle", "visage", ["metal"], ["or"], "commun", "gratuit", true),
      cravate: A2("Cravate", "cou", ["tissu"], ["rouge"], "commun", "gratuit", true),
      medaille: A2("Médaille", "cou", ["tissu", "metal"], ["rouge", "or"], "commun", "gratuit", true),
      cicatrice: A2("Cicatrice", "joues", ["tissu"], ["rosepale"], "commun", "gratuit", true),
      pipe: A2("Pipe", "main", ["tissu", "metal"], ["caramel", "argent"], "commun", "gratuit", false),
      canne: A2("Canne", "main", ["tissu", "metal"], ["noir", "or"], "commun", "gratuit", false),
      lunettesCoeur: A2("Lunettes cœur", "visage", ["tissu"], ["rose"], "rare", "coffre", false),
      coeurs: A2("Petits cœurs", "joues", ["tissu"], ["rose"], "commun", "gratuit", false),
      etoiles: A2("Petites étoiles", "joues", ["tissu"], ["soleil"], "commun", "boutique", false),
      pansement: A2("Pansement", "joues", ["tissu"], ["creme"], "commun", "gratuit", true),
      puces: A2("Puces", "oreilles", ["metal"], ["or"], "commun", "gratuit", true),
      anneaux: A2("Anneaux", "oreilles", ["metal"], ["or"], "commun", "gratuit", true),
      pendantsEtoile: A2("Pendants étoile", "oreilles", ["metal"], ["argent"], "rare", "boutique", true),
      foulard: A2("Foulard", "cou", ["tissu"], ["soleil"], "commun", "gratuit", true),
      echarpe: A2("Écharpe rayée", "cou", ["tissu", "tissu"], ["rouge", "creme"], "commun", "boutique", true),
      perles: A2("Collier de perles", "cou", ["metal"], ["argent"], "rare", "coffre", true),
      coquillage: A2("Pendentif coquillage", "cou", ["metal"], ["or"], "commun", "gratuit", true),
      papillon: A2("Nœud papillon", "cou", ["tissu"], ["rouge"], "commun", "boutique", true),
      sacDos: A2("Sac à dos", "dos", ["tissu"], ["abricot"], "commun", "gratuit", false),
      besace: A2("Besace", "dos", ["tissu"], ["caramel"], "commun", "gratuit", false),
      cape: A2("Cape", "dos", ["tissu"], ["bordeaux"], "rare", "boutique", false),
      ailes: A2("Ailes en tissu", "dos", ["tissu"], ["lavande"], "epique", "coffre", false),
      peluche: A2("Peluche", "main", ["tissu"], ["caramel"], "rare", "boutique", false),
      panier: A2("Panier fleuri", "main", ["tissu"], ["rose"], "commun", "boutique", false),
      ombrelle: A2("Ombrelle", "main", ["tissu"], ["rosepale"], "epique", "coffre", false),
      // les tenues de saison (la mer les prend : elles servent sur l'île, une fois la saison venue)
      manteau: A2("Manteau d'hiver", "dessus", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false, "hiver"),
      cire: A2("Ciré", "dessus", ["tissu"], ["soleil"], "commun", "gratuit", false, "pluie"),
      bottesPluie: A2("Bottes de pluie", "pieds", ["tissu"], ["rouge"], "commun", "gratuit", false, "pluie"),
      bottesFourrees: A2("Bottes fourrées", "pieds", ["tissu", "tissu"], ["caramel", "creme"], "commun", "gratuit", false, "hiver"),
      moufles: A2("Moufles", "mains", ["tissu", "tissu"], ["rouge", "creme"], "commun", "gratuit", false, "hiver"),
      cacheOreilles: A2("Cache-oreilles", "tete", ["tissu", "tissu"], ["rouge", "rouge"], "commun", "gratuit", false, "hiver"),
      chale: A2("Châle", "dessus", ["tissu", "tissu"], ["prune", "creme"], "commun", "gratuit", false, "hiver"),
      pelerine: A2("Pèlerine", "dessus", ["tissu", "tissu"], ["marine", "creme"], "commun", "gratuit", false, "hiver"),
      etole: A2("Étole de fourrure", "dessus", ["tissu"], ["creme"], "commun", "gratuit", false, "hiver")
    });
    var GENRES = {
      coupe: {
        femme: [
          "carre",
          "milongue",
          "longue",
          "ondulee",
          "queue",
          "queueCote",
          "couettes",
          "chignon",
          "deuxChignons",
          "couronne",
          "tresses",
          "bouclee",
          "pixie",
          "demiQueue",
          "tresseCote",
          "puffs",
          "locksLongues"
        ],
        homme: ["courte", "meche", "bataille", "degrade", "banane", "raie", "herisse", "boucleeCourte", "chignonHomme", "rasee"]
      },
      bas: { femme: ["jupe", "jupePlissee", "robe", "robeEntiere", "robeLongue"] },
      formeChaussures: { femme: ["ballerines"] },
      visage: { femme: ["coeur"], homme: ["carre", "anguleux", "large"] },
      menton: { homme: ["fin", "court", "fort", "fendu"] },
      levres: { femme: ["rose", "corail", "framboise", "nude", "prune", "rouge"] },
      joues: { femme: ["roses"] },
      barbe: { homme: ["malRase", "courte", "collier", "bouc", "pleine"] },
      moustache: { homme: ["fine", "epaisse", "guidon", "gauloise"] },
      accessoires: {
        femme: [
          "couronneFleurs",
          "oreillesChat",
          "oreillesLapin",
          "diademe",
          "noeud",
          "barrettes",
          "fleur",
          "etoile",
          "lunettesPapillon",
          "lunettesCoeur",
          "coeurs",
          "etoiles",
          "puces",
          "anneaux",
          "pendantsEtoile",
          "perles",
          "coquillage",
          "ailes",
          "peluche",
          "panier",
          "ombrelle",
          "chale",
          "etole"
        ],
        homme: ["tricorne", "hautForme", "monocle", "cravate", "papillon", "medaille", "cicatrice", "pipe", "canne"]
      }
    };
    var GENRE_DE = Object.fromEntries(Object.entries(GENRES).map(([cle, g]) => [cle, Object.fromEntries(Object.entries(g).flatMap(([genre, vals]) => vals.map((v) => [v, genre])))]));
    var genreDe = /* @__PURE__ */ __name((cle, valeur) => (GENRE_DE[cle] || {})[valeur] || null, "genreDe");
    var pourGenre = /* @__PURE__ */ __name((cle, valeur, genre) => {
      const g = genreDe(cle, valeur);
      return !g || g === genre;
    }, "pourGenre");
    var DEFAUT_GENRE = {
      femme: { coupe: "milongue", joues: "roses", barbe: "sans", moustache: "sans", visage: "rond", cils: "legers", sourcils: "fins" },
      homme: { visage: "carre", coupe: "courte", cils: "sans", levres: "naturelles", joues: "sans", bas: "pantalon", sourcils: "epais" }
    };
    var LIES_AU_CORPS = ["cils", "sourcils"];
    for (const [id, a] of Object.entries(ACCESSOIRES)) {
      const g = genreDe("accessoires", id);
      if (g) a.genre = g;
    }
    function selonGenre(o) {
      const out = { ...o, accessoires: { ...o.accessoires || {} } };
      for (const cle of LIES_AU_CORPS) out[cle] = DEFAUT_GENRE[out.genre][cle];
      for (const cle of Object.keys(GENRES)) {
        if (cle === "accessoires") continue;
        if (!pourGenre(cle, out[cle], out.genre)) out[cle] = DEFAUT_GENRE[out.genre][cle];
      }
      for (const [place, a] of Object.entries(out.accessoires)) if (a && !pourGenre("accessoires", a.id, out.genre)) delete out.accessoires[place];
      return out;
    }
    __name(selonGenre, "selonGenre");
    function auGenre(o) {
      const out = { ...o, accessoires: { ...o.accessoires || {} } };
      for (const cle of Object.keys(GENRES)) {
        if (cle === "accessoires") continue;
        if (!pourGenre(cle, out[cle], out.genre)) out[cle] = DEFAUT_GENRE[out.genre][cle] ?? DEFAUT[cle];
      }
      for (const [place, a] of Object.entries(out.accessoires)) if (a && !pourGenre("accessoires", a.id, out.genre)) delete out.accessoires[place];
      return out;
    }
    __name(auGenre, "auGenre");
    var CHOIX = {
      genre: "formes",
      menton: "formes",
      age: "formes",
      cicatrice: "formes",
      taille: "formes",
      silhouette: "formes",
      peau: "peau",
      visage: "formes",
      yeux: "yeux",
      formeYeux: "formes",
      cils: "formes",
      sourcils: "formes",
      barbe: "formes",
      moustache: "formes",
      bouche: "formes",
      expression: "formes",
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
      motifHaut: "formes",
      couleurHaut2: "tissus",
      bas: "formes",
      couleurBas: "tissus",
      motifBas: "formes",
      couleurBas2: "tissus",
      chaussures: "tissus",
      formeChaussures: "formes"
    };
    var DEFAUT = {
      genre: "femme",
      menton: "doux",
      age: "adulte",
      cicatrice: "sans",
      taille: "moyenne",
      silhouette: "moyenne",
      peau: "peche",
      visage: "rond",
      yeux: "brun",
      formeYeux: "ronds",
      cils: "sans",
      sourcils: "fins",
      barbe: "sans",
      moustache: "sans",
      bouche: "douce",
      expression: "neutre",
      levres: "naturelles",
      rousseur: "non",
      joues: "roses",
      grain: "non",
      coupe: "milongue",
      cheveux: "brun",
      meches: "sans",
      couleurMeches: "blond",
      haut: "tshirt",
      couleurHaut: "corail",
      motifHaut: "uni",
      couleurHaut2: "soleil",
      bas: "pantalon",
      couleurBas: "jean",
      motifBas: "uni",
      couleurBas2: "marine",
      chaussures: "cuir",
      formeChaussures: "souliers",
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
      if (o.genre !== "homme") {
        o.barbe = "sans";
        o.moustache = "sans";
      }
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
    var naufrageChoix = /* @__PURE__ */ __name((o) => ({ ...o, accessoires: Object.fromEntries(Object.entries(o.accessoires || {}).filter(([, a]) => a)) }), "naufrageChoix");
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
      const genre = r() < 0.5 ? "homme" : "femme";
      const de = /* @__PURE__ */ __name((cle) => cles(FORMES[cle]).filter((v) => pourGenre(cle, v, genre)), "de");
      const bas = un(de("bas")), couleurBas = un(tissus.filter(loin));
      const o = {
        genre,
        taille: un(cles(FORMES.taille)),
        silhouette: un(cles(FORMES.silhouette)),
        peau: un(cles(NUANCIERS.peau)),
        visage: un(de("visage")),
        yeux: un(cles(NUANCIERS.yeux)),
        formeYeux: un(cles(FORMES.formeYeux)),
        cils: un(genre === "homme" ? ["sans"] : de("cils")),
        sourcils: genre === "homme" ? un(["epais", "fins"]) : un(cles(FORMES.sourcils)),
        barbe: genre === "homme" && r() < 0.35 ? un(["malRase", "courte", "collier", "bouc", "pleine"]) : "sans",
        moustache: genre === "homme" && r() < 0.25 ? un(["fine", "epaisse", "guidon", "gauloise"]) : "sans",
        bouche: un(cles(FORMES.bouche)),
        levres: genre === "femme" && r() < 0.3 ? un(cles(NUANCIERS.levres).slice(1)) : "naturelles",
        age: un(["jeune", "adulte", "adulte", "adulte", "mur", "age"]),
        menton: genre === "homme" ? un(["doux", "fin", "court", "fort", "fendu"]) : "doux",
        cicatrice: r() < 0.1 ? un(["sourcil", "joue", "nez", "levre"]) : "sans",
        rousseur: r() < 0.25 ? un(["legere", "oui", "dense", "nez"]) : "non",
        joues: un(de("joues")),
        grain: r() < 0.15 ? un(["joue", "levre"]) : "non",
        coupe: un(de("coupe").concat(["locks"])),
        cheveux: r() < 0.8 ? un(naturels) : un(fantaisie),
        meches: r() < 0.2 ? un(["pointes", "meches"]) : "sans",
        couleurMeches: un(cles(NUANCIERS.cheveux)),
        haut,
        couleurHaut,
        bas,
        couleurBas,
        chaussures: un(["cuir", "caramel", "noir", "blanc", "creme", "rouge", "jean", "rose"]),
        formeChaussures: un(de("formeChaussures")),
        accessoires: {}
      };
      const permis = Object.entries(ACCESSOIRES).filter(([id, a]) => !a.saison && (!gratuit || a.source === "gratuit") && pourGenre("accessoires", id, genre));
      const nb = Math.floor(r() * 3);
      for (let i = 0; i < nb; i++) {
        const [id, a] = un(permis);
        if (o.accessoires[a.emplacement]) continue;
        o.accessoires[a.emplacement] = { id, couleurs: a.zones.map((z) => z === "metal" ? un(cles(NUANCIERS.metaux)) : un(tissus)) };
      }
      return verifier(o);
    }
    __name(auHasard, "auHasard");
    var TENUES = [
      [["blanc", "creme"], ["marine", "jean"], ["blanc", "cuir"], ["rouge", "soleil"], "argent"],
      [["lavande", "rosepale"], ["charbon", "marine"], ["blanc", "noir"], ["menthe", "creme"], "argent"],
      [["lagon", "menthe"], ["creme", "sable"], ["cuir", "caramel"], ["corail", "abricot"], "or"],
      [["foret", "olive"], ["sable", "cuir"], ["cuir", "noir"], ["soleil", "creme"], "or"],
      [["prune", "bordeaux"], ["charbon", "noir"], ["noir", "cuir"], ["rosepale", "creme"], "argent"],
      [["corail", "abricot"], ["jean", "marine"], ["blanc", "creme"], ["ciel", "creme"], "or"],
      [["ciel", "blanc"], ["marine", "sable"], ["blanc", "cuir"], ["soleil", "rouge"], "argent"],
      [["charbon", "noir"], ["jean", "charbon"], ["blanc", "noir"], ["framboise", "lagon"], "argent"],
      [["rose", "rosepale"], ["creme", "jean"], ["blanc", "rosepale"], ["lavande", "menthe"], "orrose"],
      [["soleil", "abricot"], ["olive", "marine"], ["cuir", "caramel"], ["creme", "foret"], "or"],
      [["caramel", "sable"], ["creme", "marine"], ["cuir", "noir"], ["lagon", "creme"], "cuivre"],
      [["rouge", "framboise"], ["noir", "charbon"], ["noir", "blanc"], ["creme", "soleil"], "or"]
    ];
    var SOBRES = ["bonnet", "paille", "casquette", "bandana", "beret", "lunettesRondes", "lunettesCarrees", "foulard", "echarpe", "coquillage", "puces", "anneaux", "sacDos", "besace"];
    var NATURELS_YEUX = ["brun", "chocolat", "noisette", "ambre", "olive", "vert", "eau", "azur", "bleu", "grisbleu", "gris"];
    var ROUX = ["auburn", "roux", "cuivre", "venitien"];
    function assorti(n, { gratuit = true } = {}) {
      const r = graine(n);
      const un = /* @__PURE__ */ __name((list) => list[Math.floor(r() * list.length) % list.length], "un");
      const cles = /* @__PURE__ */ __name((obj) => Object.keys(obj), "cles");
      const genre = r() < 0.5 ? "homme" : "femme";
      const de = /* @__PURE__ */ __name((cle) => cles(FORMES[cle]).filter((v) => pourGenre(cle, v, genre)), "de");
      const age = un(["jeune", "adulte", "adulte", "adulte", "mur", "mur", "age"]);
      const naturels = CHEVEUX.slice(0, 13).map(([k]) => k).filter((k) => k !== "gris" && k !== "blanc");
      const fantaisie = ["poudre", "lilas", "ciel", "menthe", "corail"];
      const cheveux = age === "age" ? r() < 0.85 ? un(["gris", "blanc", "blanc"]) : un(naturels) : age === "mur" ? r() < 0.3 ? "gris" : un(naturels) : r() < 0.06 ? un(fantaisie) : un(naturels);
      const [hauts, bass, pieds, accents, metal] = un(TENUES);
      const couleurHaut = un(hauts), accent = un(accents);
      const motif = r();
      const motifHaut = motif < 0.8 ? "uni" : motif < 0.9 ? "raye" : "degrade";
      const couleurHaut2 = motifHaut === "degrade" ? hauts.find((c) => c !== couleurHaut) || accent : accent;
      const couleurBas = un(bass);
      const barbu = genre === "homme" && age !== "jeune";
      const o = {
        genre,
        age,
        taille: un(cles(FORMES.taille)),
        silhouette: un(cles(FORMES.silhouette)),
        peau: un(cles(NUANCIERS.peau)),
        visage: un(de("visage")),
        yeux: r() < 0.95 ? un(NATURELS_YEUX) : un(["violet", "emeraude"]),
        formeYeux: un(cles(FORMES.formeYeux)),
        cils: genre === "homme" ? "sans" : un(de("cils")),
        sourcils: genre === "homme" ? un(["epais", "fins", "doux"]) : un(["fins", "doux"]),
        barbe: barbu && r() < 0.3 ? un(["malRase", "courte", "collier", "pleine"]) : "sans",
        moustache: barbu && r() < 0.15 ? un(["fine", "epaisse", "gauloise"]) : "sans",
        bouche: un(["douce", "douce", "sourire", "malice"]),
        expression: "neutre",
        levres: genre === "femme" && r() < 0.25 ? un(["rose", "corail", "nude", "framboise"]) : "naturelles",
        menton: genre === "homme" ? un(["doux", "fin", "court", "fort"]) : "doux",
        cicatrice: r() < 0.05 ? un(["sourcil", "joue"]) : "sans",
        rousseur: r() < (ROUX.includes(cheveux) ? 0.5 : 0.12) ? un(["legere", "oui", "nez"]) : "non",
        joues: un(de("joues")),
        grain: r() < 0.08 ? "joue" : "non",
        coupe: un(de("coupe").concat(["locks"])),
        cheveux,
        meches: "sans",
        couleurMeches: cheveux,
        haut: un(cles(FORMES.haut)),
        couleurHaut,
        motifHaut,
        couleurHaut2,
        bas: un(de("bas")),
        couleurBas,
        motifBas: "uni",
        couleurBas2: couleurBas,
        chaussures: un(pieds),
        formeChaussures: un(de("formeChaussures")),
        accessoires: {}
      };
      const permis = SOBRES.map((id) => [id, ACCESSOIRES[id]]).filter(([id, a]) => (!gratuit || a.source === "gratuit") && pourGenre("accessoires", id, genre));
      const nb = r() < 0.4 ? 0 : r() < 0.85 ? 1 : 2;
      for (let i = 0; i < nb; i++) {
        const [id, a] = un(permis);
        if (o.accessoires[a.emplacement]) continue;
        o.accessoires[a.emplacement] = { id, couleurs: a.zones.map((z, k) => z === "metal" ? metal : k ? "creme" : accent) };
      }
      return verifier(o);
    }
    __name(assorti, "assorti");
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
      assorti,
      TENUES,
      graine,
      GENRES,
      DEFAUT_GENRE,
      LIES_AU_CORPS,
      genreDe,
      pourGenre,
      selonGenre,
      auGenre,
      hsl,
      hex,
      mix,
      tone,
      delave,
      clarte
    };
  }
});

// personnages/jambe.js
var require_jambe = __commonJS({
  "personnages/jambe.js"(exports, module) {
    var { OUT, W, r2: r22, shoe, clip } = require_troupe();
    var pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
    function reperes(c, x, y) {
      const g = x < 24 ? -1 : 1;
      const hw = c.k.hw, bas = c.legW / 2;
      const haut = Math.max(bas + 0.6, Math.min((hw - 0.7) / 2, bas * 2.05));
      return { g, top: [24 + g * (0.35 + haut), c.hip - 0.4], haut, cheville: [x, y + 1.2], bas };
    }
    __name(reperes, "reperes");
    function bords(r, t) {
      const { g, top, haut, cheville, bas } = r;
      const lerp = /* @__PURE__ */ __name((a, b) => a + (b - a) * t, "lerp");
      const cx = lerp(top[0], cheville[0]), cy = lerp(top[1], cheville[1]);
      const h = lerp(haut, bas), bombe = Math.sin(Math.PI * Math.min(1, t * 1.25)) * 0.55;
      return { dehors: [cx + g * (h + bombe), cy], dedans: [cx - g * h, cy], milieu: [cx, cy], h };
    }
    __name(bords, "bords");
    function forme(r, t0, t1, ourlet = 0) {
      const n = 8, D = [], I = [];
      for (let i = 0; i <= n; i++) {
        const b = bords(r, t0 + (t1 - t0) * i / n);
        D.push(b.dehors);
        I.push(b.dedans);
      }
      const fin = bords(r, t1);
      const bas = ourlet ? ` Q${pt([fin.milieu[0], fin.milieu[1] + ourlet])} ${pt(I[n])}` : ` L${pt(I[n])}`;
      return `M${pt(D[0])} ${D.slice(1).map((p) => `L${pt(p)}`).join(" ")}${bas} ${I.slice(0, -1).reverse().map((p) => `L${pt(p)}`).join(" ")} Z`;
    }
    __name(forme, "forme");
    function anglePied(c, r, x, y) {
      const [lx, rx] = c.legX[c.view || "front"], x0 = r.g < 0 ? lx : rx, deg = Math.atan2(x - r.top[0], y + 1.2 - r.top[1]) * 180 / Math.PI;
      const deg0 = Math.atan2(x0 - r.top[0], c.ground + 1.2 - r.top[1]) * 180 / Math.PI;
      return r22(Math.max(-20, Math.min(20, -(deg - deg0))));
    }
    __name(anglePied, "anglePied");
    function jambe(c, x, y, dir, tilt = 0) {
      let X = x, Y = y, rot;
      if (tilt) {
        const a = tilt * Math.PI / 180, px = x - (dir < 0 ? 3 : -3), py = y + 4.5, ax = x - px, ay = y + 0.6 - py;
        X = r22(px + ax * Math.cos(a) - ay * Math.sin(a));
        Y = r22(py + ax * Math.sin(a) + ay * Math.cos(a) - 0.6);
        rot = tilt;
      }
      const r = reperes(c, X, Y);
      if (!tilt) rot = anglePied(c, r, X, Y);
      const d = forme(r, 0, 1);
      const droit = r.g > 0 ? "dehors" : "dedans", k = r.g > 0 ? -1 : 1;
      const bandeOmbre = [0, 0.5, 1].map((t) => bords(r, t)[droit]);
      const ombre = `<path d="M${bandeOmbre.map(pt).join(" L")}" fill="none" stroke="${c.legS}" stroke-width="2.2" stroke-linecap="round" transform="translate(${r22(k * 0.9)} 0)"/>`;
      const id = `${c.uid}jb${Math.round(x * 10)}${Math.round(y * 10)}`;
      const pied = c.foot ? c.foot(c, X, Y, dir, rot) : shoe(c, X, Y, dir, rot);
      return `<path d="${d}" fill="${c.leg}"/>` + clip(id, d, ombre) + `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>` + (tilt ? pied : auSol(rot, dir, pied));
    }
    __name(jambe, "jambe");
    function auSol(tilt, dir, pied) {
      if (!tilt) return pied;
      const a = tilt * Math.PI / 180, dy = 4.9, pointe = dir < 0 ? 1.4 : 0;
      const drop = Math.max(...[-(3.4 + pointe), 3.4].map((dx) => dx * Math.sin(a) + dy * Math.cos(a) - dy));
      return drop > 0.01 ? `<g transform="translate(0 ${r22(-drop)})">${pied}</g>` : pied;
    }
    __name(auSol, "auSol");
    function jambeCourte(c, x, frayed = false, y) {
      if (y == null) y = c.ground;
      const r0 = reperes(c, x, y), r = { ...r0, haut: r0.haut + 0.45, bas: r0.bas + 0.45 };
      const t1 = Math.min(0.92, (c.shortLen + 0.4) / (r.cheville[1] - r.top[1]));
      const ourlet = 1.1;
      const d = forme(r, 0, t1, ourlet);
      const fin = bords(r, t1), droit = r.g > 0 ? "dehors" : "dedans", k = r.g > 0 ? -1 : 1;
      const ombre = `<path d="M${[0, t1 / 2, t1].map((t) => pt(bords(r, t)[droit])).join(" L")}" fill="none" stroke="${c.basS}" stroke-width="2" stroke-linecap="round" transform="translate(${r22(k * 0.8)} 0)"/>`;
      const id = `${c.uid}jc${Math.round(x * 10)}${frayed ? "f" : ""}`;
      let s = `<path d="${d}" fill="${c.bas}"/>` + clip(id, d, ombre) + `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`;
      const a = fin.dehors, b = fin.dedans, m = [fin.milieu[0], fin.milieu[1] + ourlet];
      const surArc = /* @__PURE__ */ __name((t, dy) => {
        const u = 1 - t;
        return [u * u * a[0] + 2 * u * t * m[0] + t * t * b[0], u * u * a[1] + 2 * u * t * m[1] + t * t * b[1] + dy];
      }, "surArc");
      if (frayed) s += `<path d="M${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => pt(surArc(t, i % 2 ? 1 : 0))).join(" L")}" fill="none" stroke="${OUT}" stroke-width=".8" stroke-linejoin="round"/>`;
      else s += `<path d="M${pt(surArc(0.08, -1.1))} Q${pt([m[0], m[1] - 1.1])} ${pt(surArc(0.92, -1.1))}" fill="none" stroke="${c.basS}" stroke-width=".6"/>`;
      return s;
    }
    __name(jambeCourte, "jambeCourte");
    function jambeRetroussee(c, x, y, cuff, pied) {
      const r = reperes(c, x, y), long = r.cheville[1] - r.top[1];
      const haut = Math.min(4, long * 0.3), t0 = Math.max(0, 1 - (haut + 0.6) / long), tr = Math.max(0, 1 - haut / long);
      const ep = haut < 3.6 ? 1.45 : 1.8;
      const mollet = forme(r, t0, 1);
      const id = `${c.uid}jr${Math.round(x * 10)}${Math.round(y * 10)}`;
      let s = `<path d="${mollet}" fill="${c.skin}"/>` + clip(id, mollet, `<path d="M${[t0, 1].map((t) => pt(bords(r, t)[r.g > 0 ? "dehors" : "dedans"])).join(" L")}" fill="none" stroke="${c.skinS || c.skin}" stroke-width="1.6" transform="translate(${r.g > 0 ? -0.7 : 0.7} 0)"/>`) + `<path d="${mollet}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`;
      s += pied;
      const b = bords(r, tr), m = [b.milieu[0], b.milieu[1] + 0.9];
      const arc = `M${pt([b.dehors[0] + r.g * 0.2, b.dehors[1]])} Q${pt(m)} ${pt([b.dedans[0] - r.g * 0.2, b.dedans[1]])}`;
      s += `<path d="${arc}" fill="none" stroke="${OUT}" stroke-width="${r22(ep + W * 2)}" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${cuff}" stroke-width="${ep}" stroke-linecap="round"/><path d="M${pt([b.dehors[0] - r.g * 0.6, b.dehors[1] - 0.3])} Q${pt([m[0], m[1] - 0.3])} ${pt([b.dedans[0] + r.g * 0.6, b.dedans[1] - 0.3])}" fill="none" stroke="#FFFFFF" stroke-width=".45" opacity=".4"/>`;
      return s;
    }
    __name(jambeRetroussee, "jambeRetroussee");
    function tigeJambe(c, x, y, haut, marge = 0.7) {
      const r0 = reperes(c, x, y), r = { ...r0, haut: r0.haut + marge, bas: r0.bas + marge };
      const long = r.cheville[1] - r.top[1], t0 = Math.max(0.05, 1 - (haut + 1.2) / long);
      const b = bords(r, t0), m = [b.milieu[0], b.milieu[1] + 0.7];
      const n = 6, D = [], I = [];
      for (let i = 0; i <= n; i++) {
        const e = bords(r, t0 + (1 - t0) * i / n);
        D.push(e.dehors);
        I.push(e.dedans);
      }
      const d = `M${pt(D[0])} ${D.slice(1).map((q) => `L${pt(q)}`).join(" ")} L${pt(I[n])} ${I.slice(0, -1).reverse().map((q) => `L${pt(q)}`).join(" ")} Q${pt(m)} ${pt(D[0])} Z`;
      const droite = r.g > 0 ? D : I, gauche = r.g > 0 ? I : D;
      return {
        d,
        ouverture: `M${pt(D[0])} Q${pt(m)} ${pt(I[0])}`,
        droit: "M" + droite.map(pt).join(" L"),
        gauche: "M" + gauche.slice(1, -1).map((q) => pt([q[0] + 0.9, q[1]])).join(" L")
      };
    }
    __name(tigeJambe, "tigeJambe");
    module.exports = { jambe, jambeCourte, jambeRetroussee, tigeJambe, reperes };
  }
});

// personnages/tour.js
var require_tour = __commonJS({
  "personnages/tour.js"(exports, module) {
    var r22 = /* @__PURE__ */ __name((v) => Math.round(v * 100) / 100, "r2");
    var TETE = { cx: 24, cy: 19.5, rx: 13, theta: 18, thetaMasse: 12 };
    function rayons(silhouette, t) {
      const Y0 = -40, PASY = 0.2, N = 600, S = new Float64Array(N);
      for (const d of silhouette) {
        for (const s of cheminD(d)) {
          let cur = s.debut;
          const pts = [cur];
          for (const seg of s.segs) {
            const lon = dist(cur, seg[0]) + dist(seg[0], seg[1]) + dist(seg[1], seg[2]);
            for (const [, , p] of coupe(cur, seg, Math.max(1, Math.ceil(lon / 0.5)))) pts.push(p);
            cur = seg[2];
          }
          if (s.ferme) pts.push(s.debut);
          for (let i = 1; i < pts.length; i++) {
            const [a, b] = [pts[i - 1], pts[i]], ya = Math.min(a[1], b[1]), yb = Math.max(a[1], b[1]);
            for (let k = Math.max(0, Math.ceil((ya - Y0) / PASY)); k < N && Y0 + k * PASY <= yb; k++) {
              const y = Y0 + k * PASY, u = yb - ya < 1e-9 ? 0 : (y - a[1]) / (b[1] - a[1]);
              const x = a[0] + (b[0] - a[0]) * Math.max(0, Math.min(1, u));
              S[k] = Math.max(S[k], Math.abs(x - t.cx));
            }
          }
        }
      }
      const R2 = new Float64Array(N);
      for (let k = 0; k < N; k++) {
        let m = 0;
        for (let j = Math.max(0, k - 3); j <= Math.min(N - 1, k + 3); j++) m = Math.max(m, S[j]);
        const y = Y0 + k * PASY, v = Math.max(0, Math.min(1, (y - (t.cy - 5)) / 6)), ramp = v * v * (3 - 2 * v);
        R2[k] = Math.max(m, t.rx * ramp);
      }
      return (y) => {
        const k = Math.round((y - Y0) / PASY);
        return k < 0 || k >= N ? 0 : R2[k];
      };
    }
    __name(rayons, "rayons");
    function tourne(x, y, mode, t) {
      const R2 = t.rayon(y);
      if (R2 <= 0) return x;
      const u = (x - t.cx) / R2;
      if (u <= -1 || u >= 1) return x;
      const phi = Math.asin(u) * 180 / Math.PI;
      const v = 1 - (phi / 90) ** 2;
      const p = mode === "traits" ? phi - t.theta * (1 - (phi / 90) ** 4) : mode === "barbe" ? phi - t.thetaMasse * v - (t.theta - t.thetaMasse) * v * v : phi - t.thetaMasse * v;
      return t.cx + R2 * Math.sin(p * Math.PI / 180);
    }
    __name(tourne, "tourne");
    function lire(svg) {
      const racine = { tag: "#", attrs: [], kids: [] }, pile = [racine];
      const reste = svg.replace(/<(\/?)([a-zA-Z]+)((?:\s+[a-zA-Z][a-zA-Z0-9:-]*="[^"]*")*)\s*(\/?)>/g, "");
      if (reste.trim()) throw new Error(`tour : dessin illisible près de « ${reste.trim().slice(0, 60)} »`);
      for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[a-zA-Z][a-zA-Z0-9:-]*="[^"]*")*)\s*(\/?)>/g)) {
        const [, fin, tag, att, auto] = m;
        if (fin) {
          pile.pop();
          continue;
        }
        const n = { tag, attrs: [...att.matchAll(/([a-zA-Z][a-zA-Z0-9:-]*)="([^"]*)"/g)].map((a) => [a[1], a[2]]), kids: [] };
        pile[pile.length - 1].kids.push(n);
        if (!auto) pile.push(n);
      }
      return racine;
    }
    __name(lire, "lire");
    var attr = /* @__PURE__ */ __name((n, k) => {
      const a = n.attrs.find(([x]) => x === k);
      return a ? a[1] : null;
    }, "attr");
    var ecrire = /* @__PURE__ */ __name((n) => n.tag === "#" ? n.kids.map(ecrire).join("") : `<${n.tag}${n.attrs.map(([k, v]) => ` ${k}="${v}"`).join("")}${n.kids.length ? `>${n.kids.map(ecrire).join("")}</${n.tag}>` : "/>"}`, "ecrire");
    var ID = [1, 0, 0, 1, 0, 0];
    var mul = /* @__PURE__ */ __name((m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]], "mul");
    var app = /* @__PURE__ */ __name((m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]], "app");
    function matrice(tr) {
      let m = ID;
      for (const [, f, args] of (tr || "").matchAll(/(\w+)\(([^)]*)\)/g)) {
        const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
        if (f === "translate") m = mul(m, [1, 0, 0, 1, a[0], a[1] || 0]);
        else if (f === "scale") m = mul(m, [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0]);
        else if (f === "rotate") {
          const t = a[0] * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), [x, y] = [a[1] || 0, a[2] || 0];
          m = mul(m, [1, 0, 0, 1, x, y]);
          m = mul(m, [cs, sn, -sn, cs, 0, 0]);
          m = mul(m, [1, 0, 0, 1, -x, -y]);
        } else if (f === "matrix") m = mul(m, a);
        else throw new Error(`tour : transformation inconnue ${f}`);
      }
      return m;
    }
    __name(matrice, "matrice");
    function arcCubiques(p0, rx, ry, rot, grand, sens, p1) {
      if (!rx || !ry) return [[p0, p1, p1]];
      const phi = rot * Math.PI / 180, cs = Math.cos(phi), sn = Math.sin(phi);
      const dx = (p0[0] - p1[0]) / 2, dy = (p0[1] - p1[1]) / 2;
      const x1 = cs * dx + sn * dy, y1 = -sn * dx + cs * dy;
      rx = Math.abs(rx);
      ry = Math.abs(ry);
      const l = x1 * x1 / (rx * rx) + y1 * y1 / (ry * ry);
      if (l > 1) {
        rx *= Math.sqrt(l);
        ry *= Math.sqrt(l);
      }
      const num = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1, den = rx * rx * y1 * y1 + ry * ry * x1 * x1;
      const k = (grand === sens ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
      const cxp = k * rx * y1 / ry, cyp = -k * ry * x1 / rx;
      const cx = cs * cxp - sn * cyp + (p0[0] + p1[0]) / 2, cy = sn * cxp + cs * cyp + (p0[1] + p1[1]) / 2;
      const ang = /* @__PURE__ */ __name((ux, uy, vx, vy) => {
        const a2 = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
        return a2;
      }, "ang");
      const t0 = ang(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry);
      let dt = ang((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry);
      if (!sens && dt > 0) dt -= 2 * Math.PI;
      else if (sens && dt < 0) dt += 2 * Math.PI;
      const n = Math.ceil(Math.abs(dt) / (Math.PI / 2)), h = dt / n, a = 4 / 3 * Math.tan(h / 4);
      const pt = /* @__PURE__ */ __name((t) => [cx + rx * Math.cos(t) * cs - ry * Math.sin(t) * sn, cy + rx * Math.cos(t) * sn + ry * Math.sin(t) * cs], "pt");
      const de = /* @__PURE__ */ __name((t) => [-rx * Math.sin(t) * cs - ry * Math.cos(t) * sn, -rx * Math.sin(t) * sn + ry * Math.cos(t) * cs], "de");
      const out = [];
      for (let i = 0; i < n; i++) {
        const ta = t0 + i * h, tb = ta + h, A2 = pt(ta), B = i === n - 1 ? p1 : pt(tb), da = de(ta), db = de(tb);
        out.push([[A2[0] + a * da[0], A2[1] + a * da[1]], [B[0] - a * db[0], B[1] - a * db[1]], B]);
      }
      return out;
    }
    __name(arcCubiques, "arcCubiques");
    function cheminD(d) {
      const toks = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g) || [];
      const subs = [];
      let i = 0, cmd = null, cur = [0, 0], start = [0, 0], sub = null, prevC = null, prevQ = null;
      const num = /* @__PURE__ */ __name(() => +toks[i++], "num");
      const ligne = /* @__PURE__ */ __name((p) => {
        sub.segs.push([cur, p, p]);
        cur = p;
      }, "ligne");
      while (i < toks.length) {
        if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
        const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), o = rel ? cur : [0, 0];
        const pt = /* @__PURE__ */ __name(() => {
          const x = num(), y = num();
          return [o[0] + x, o[1] + y];
        }, "pt");
        let c = null, q = null;
        if (C === "M") {
          cur = start = pt();
          sub = { debut: cur, segs: [], ferme: false };
          subs.push(sub);
          cmd = rel ? "l" : "L";
        } else if (C === "Z") {
          if (sub) {
            sub.ferme = true;
            cur = start;
            sub = { debut: cur, segs: [], ferme: false };
            subs.push(sub);
          }
        } else if (C === "L") ligne(pt());
        else if (C === "H") {
          const x = num();
          ligne([rel ? cur[0] + x : x, cur[1]]);
        } else if (C === "V") {
          const y = num();
          ligne([cur[0], rel ? cur[1] + y : y]);
        } else if (C === "C") {
          const a = pt(), b = pt(), p = pt();
          sub.segs.push([a, b, p]);
          c = b;
          cur = p;
        } else if (C === "S") {
          const a = prevC ? [2 * cur[0] - prevC[0], 2 * cur[1] - prevC[1]] : cur, b = pt(), p = pt();
          sub.segs.push([a, b, p]);
          c = b;
          cur = p;
        } else if (C === "Q" || C === "T") {
          const k = C === "Q" ? pt() : prevQ ? [2 * cur[0] - prevQ[0], 2 * cur[1] - prevQ[1]] : cur, p = pt();
          sub.segs.push([[cur[0] + 2 / 3 * (k[0] - cur[0]), cur[1] + 2 / 3 * (k[1] - cur[1])], [p[0] + 2 / 3 * (k[0] - p[0]), p[1] + 2 / 3 * (k[1] - p[1])], p]);
          q = k;
          cur = p;
        } else if (C === "A") {
          const rx = num(), ry = num(), rot = num(), grand = num(), sens = num(), p = pt();
          sub.segs.push(...arcCubiques(cur, rx, ry, rot, grand, sens, p));
          cur = p;
        } else throw new Error(`tour : commande inconnue ${cmd}`);
        prevC = c;
        prevQ = q;
      }
      return subs.filter((s) => s.segs.length);
    }
    __name(cheminD, "cheminD");
    var K = 0.5523;
    function ellipseD(cx, cy, rx, ry) {
      const p = /* @__PURE__ */ __name((x, y) => [cx + x, cy + y], "p");
      return [{ debut: p(rx, 0), ferme: true, segs: [
        [p(rx, ry * K), p(rx * K, ry), p(0, ry)],
        [p(-rx * K, ry), p(-rx, ry * K), p(-rx, 0)],
        [p(-rx, -ry * K), p(-rx * K, -ry), p(0, -ry)],
        [p(rx * K, -ry), p(rx, -ry * K), p(rx, 0)]
      ] }];
    }
    __name(ellipseD, "ellipseD");
    function rectD(x, y, w, h, rx) {
      if (!rx) return cheminD(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`);
      rx = Math.min(rx, w / 2, h / 2);
      return cheminD(`M${x + rx},${y} L${x + w - rx},${y} A${rx},${rx} 0 0,1 ${x + w},${y + rx} L${x + w},${y + h - rx} A${rx},${rx} 0 0,1 ${x + w - rx},${y + h} L${x + rx},${y + h} A${rx},${rx} 0 0,1 ${x},${y + h - rx} L${x},${y + rx} A${rx},${rx} 0 0,1 ${x + rx},${y} Z`);
    }
    __name(rectD, "rectD");
    var GEO = { path: ["d"], ellipse: ["cx", "cy", "rx", "ry"], circle: ["cx", "cy", "r"], rect: ["x", "y", "width", "height", "rx", "ry"], line: ["x1", "y1", "x2", "y2"] };
    function forme(n) {
      const v = /* @__PURE__ */ __name((k) => +(attr(n, k) || 0), "v");
      if (n.tag === "path") return cheminD(attr(n, "d"));
      if (n.tag === "ellipse") return ellipseD(v("cx"), v("cy"), v("rx"), v("ry"));
      if (n.tag === "circle") return ellipseD(v("cx"), v("cy"), v("r"), v("r"));
      if (n.tag === "rect") return rectD(v("x"), v("y"), v("width"), v("height"), v("rx") || v("ry"));
      return [{ debut: [v("x1"), v("y1")], ferme: false, segs: [[[v("x1"), v("y1")], [v("x2"), v("y2")], [v("x2"), v("y2")]]] }];
    }
    __name(forme, "forme");
    var PAS = 1.6;
    function coupe(p0, [a, b, p], n) {
      const out = [];
      let q0 = p0, A2 = a, B = b, Q2 = p;
      for (let i = n; i > 1; i--) {
        const t = 1 / i, lp = /* @__PURE__ */ __name((u, v) => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t], "lp");
        const ab = lp(q0, A2), bc = lp(A2, B), cd = lp(B, Q2), abc = lp(ab, bc), bcd = lp(bc, cd), m = lp(abc, bcd);
        out.push([ab, abc, m]);
        q0 = m;
        A2 = bcd;
        B = cd;
      }
      out.push([A2, B, Q2]);
      return out;
    }
    __name(coupe, "coupe");
    var dist = /* @__PURE__ */ __name((u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]), "dist");
    function deformer(subs, m, mode, t, dx = null) {
      const w = /* @__PURE__ */ __name((q) => {
        const [x, y] = app(m, q);
        return [r22(dx === null ? tourne(x, y, mode, t) : x + dx), r22(y)];
      }, "w");
      return subs.map((s) => {
        let cur = s.debut, d = `M${w(cur).join(",")}`;
        for (const seg of s.segs) {
          const lon = dist(cur, seg[0]) + dist(seg[0], seg[1]) + dist(seg[1], seg[2]);
          const plat = dist(cur, seg[0]) + dist(seg[1], seg[2]) < 1e-6;
          const morceaux = coupe(cur, seg, Math.max(1, Math.ceil(lon / PAS)));
          for (const [a, b, p] of morceaux) d += plat ? ` L${w(p).join(",")}` : ` C${w(a).join(",")} ${w(b).join(",")} ${w(p).join(",")}`;
          cur = seg[2];
        }
        return d + (s.ferme ? " Z" : "");
      }).join(" ");
    }
    __name(deformer, "deformer");
    function boite(subs, m) {
      let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
      for (const s of subs) for (const q of [s.debut, ...s.segs.flat()]) {
        const [x, y] = app(m, q);
        a = Math.min(a, x);
        b = Math.max(b, x);
        c = Math.min(c, y);
        d = Math.max(d, y);
      }
      return { x: (a + b) / 2, y: (c + d) / 2, w: b - a, h: d - c };
    }
    __name(boite, "boite");
    var PETIT = 5;
    function noeud(n, m, mode, t) {
      if (n.tag === "g" || n.tag === "#") {
        const tr2 = attr(n, "transform"), md = attr(n, "data-tour") || mode, mm2 = tr2 ? mul(m, matrice(tr2)) : m;
        const kids = n.kids.map((k) => noeud(k, mm2, md, t)).filter(Boolean);
        if (n.tag === "#") return { ...n, kids };
        const attrs = n.attrs.filter(([k]) => k !== "transform" && k !== "data-tour");
        return attrs.length ? { tag: "g", attrs, kids } : { tag: "#", attrs: [], kids };
      }
      if (n.tag === "clipPath") return { ...n, kids: n.kids.map((k) => noeud(k, m, mode, t)).filter(Boolean) };
      if (!GEO[n.tag]) return n;
      const tr = attr(n, "transform"), mm = tr ? mul(m, matrice(tr)) : m;
      const subs = forme(n), bt = boite(subs, mm);
      if (mode === "oreille" && bt.x < t.cx) return null;
      const bloc = mode === "oreille" || mode === "masse" && Math.max(bt.w, bt.h) <= PETIT ? tourne(bt.x, bt.y, "masse", t) - bt.x : null;
      const garde = n.attrs.filter(([k]) => !GEO[n.tag].includes(k) && k !== "transform");
      if (n.tag === "line" && !attr(n, "fill")) garde.unshift(["fill", "none"]);
      return { tag: "path", attrs: [["d", deformer(subs, mm, mode, t, bloc)], ...garde], kids: [] };
    }
    __name(noeud, "noeud");
    function tourner(svg, silhouette, opts = {}) {
      const t = { ...TETE, ...opts };
      t.rayon = rayons(silhouette, t);
      return ecrire(noeud(lire(svg), ID, "masse", t));
    }
    __name(tourner, "tourner");
    var groupe = /* @__PURE__ */ __name((actif, nom, s) => actif && s ? `<g data-tour="${nom}">${s}</g>` : s, "groupe");
    module.exports = { tourner, groupe, tourne, TETE };
  }
});

// personnages/avatar_accessoires.js
var require_avatar_accessoires = __commonJS({
  "personnages/avatar_accessoires.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, r2: r22, shoe } = require_troupe();
    var { tone, mix } = require_avatar_choix();
    var { tigeJambe } = require_jambe();
    var { groupe } = require_tour();
    var sx = /* @__PURE__ */ __name((d, k) => k ? d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`) : d, "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(48 - x)},${y}`), "mirror");
    var decale = /* @__PURE__ */ __name((v) => v === "se" ? -1.4 : 0, "decale");
    var nuque = /* @__PURE__ */ __name((v) => v === "se" ? 0.6 : 0, "nuque");
    var reflet = /* @__PURE__ */ __name((c) => tone(c, 1.45), "reflet");
    var fleurette = /* @__PURE__ */ __name((x, y, r, col, coeur2 = "#F2C04B") => [0, 1, 2, 3, 4].map((i) => {
      const a = i / 5 * Math.PI * 2 - Math.PI / 2;
      return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.78, r * 0.78, col, 0.55);
    }).join("") + E(x, y, r * 0.55, r * 0.55, coeur2, 0.5), "fleurette");
    var feuille = /* @__PURE__ */ __name((x, y, rot, s = 1) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot}) scale(${s})">${P("M0,0 Q1.3,-1.1 2.8,0 Q1.3,1.1 0,0 Z", "#7EB45A", 0.5)}</g>`, "feuille");
    var etoile = /* @__PURE__ */ __name((x, y, r, col, w = 0.6) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = i / 10 * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        return `${r22(x + Math.cos(a) * rr)},${r22(y + Math.sin(a) * rr)}`;
      });
      return P(`M${pts.join(" L")} Z`, col, w);
    }, "etoile");
    var coeur = /* @__PURE__ */ __name((x, y, s, col, w = 0.5) => P(`M${r22(x)},${r22(y + s * 0.9)} C${r22(x - s * 1.5)},${r22(y)} ${r22(x - s * 0.9)},${r22(y - s * 1.1)} ${r22(x)},${r22(y - s * 0.35)} C${r22(x + s * 0.9)},${r22(y - s * 1.1)} ${r22(x + s * 1.5)},${r22(y)} ${r22(x)},${r22(y + s * 0.9)} Z`, col, w), "coeur");
    var scintille = /* @__PURE__ */ __name((x, y, s, col) => P(`M${r22(x)},${r22(y - s)} Q${r22(x + s * 0.18)},${r22(y - s * 0.18)} ${r22(x + s)},${r22(y)} Q${r22(x + s * 0.18)},${r22(y + s * 0.18)} ${r22(x)},${r22(y + s)} Q${r22(x - s * 0.18)},${r22(y + s * 0.18)} ${r22(x - s)},${r22(y)} Q${r22(x - s * 0.18)},${r22(y - s * 0.18)} ${r22(x)},${r22(y - s)} Z`, col, 0.45), "scintille");
    function reperes(c) {
      const [[x0, y0], [x1]] = c.shoulders, dy = c.dy || 0, e = (x1 - x0) / 2;
      const k = c.k || { sw: e + 0.5, hw: e + 2.2, b: 0, ...c.porte };
      const hanche = r22(c.hip - dy);
      return { cou: r22(y0 - dy - 3.2), e, sw: k.sw, hw: k.hw, b: k.b, hanche, ourlet: c.coatHem !== void 0 ? c.coatHem : r22(hanche + (c.ground - c.hip) * 0.45) };
    }
    __name(reperes, "reperes");
    function capucheRabattue(uid, view, R2, col, S) {
      const { cou: y, e } = R2, a = r22(24 - e + 0.4), b = r22(24 + e - 0.4);
      if (view !== "ne") return P(`M${a},${r22(y + 0.8)} Q24,${r22(y - 3.8)} ${b},${r22(y + 0.8)} L${b},${r22(y + 3)} L${a},${r22(y + 3)} Z`, S);
      const d = `M${a},${r22(y + 2.2)} Q24,${r22(y + 6.8)} ${b},${r22(y + 2.2)} L${r22(24 + e + 0.6)},${r22(y + 7.8)} Q24,${r22(y + 11.4)} ${r22(24 - e - 0.6)},${r22(y + 7.8)} Z`;
      return P(d, col) + clip(`${uid}cap`, d, `<rect x="27.2" y="${r22(y)}" width="16" height="14" fill="${S}"/>`) + P(d, "none") + P(`M${r22(24 - e + 1.6)},${r22(y + 6.6)} Q24,${r22(y + 9.6)} ${r22(24 + e - 1.6)},${r22(y + 6.6)}`, "none", 0.7);
    }
    __name(capucheRabattue, "capucheRabattue");
    function bonnet(c, { view }, [col, revers]) {
      const k = view === "se" ? -0.8 : 0, X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const dome = `M${X(10.4)},15.6 Q${X(9.8)},5.6 ${X(24)},5.4 Q${XD(38.2)},5.6 ${XD(37.6)},15.6 Z`;
      const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${XD(38)},12.8 L${XD(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
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
    function cacheOreilles(c, { view, tour }, [col]) {
      const muffs = view === "se" ? [[35.4, 22.6]] : view === "ne" ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
      return groupe(tour, "oreille", muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P(`M${r22(x - 1.7)},${r22(y + 1.3)} Q${x},${r22(y + 2.6)} ${r22(x + 1.7)},${r22(y + 1.3)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`) + E(x - 0.7, y - 1.2, 0.9, 0.8, "#FFFFFF", 0)).join(""));
    }
    __name(cacheOreilles, "cacheOreilles");
    function paille(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), ne = view === "ne";
      const PA = "#F2D27E", PS = "#D9AE52", PT = "#B88A3A", PH = "#FFF2C2";
      const calotte = `M${X(14.8)},14 Q${X(14.4)},5.2 ${X(24)},4.9 Q${XD(33.6)},5.2 ${XD(33.2)},14 Z`;
      const bord = `M${X(6.4)},14.6 Q${X(6.8)},11.6 ${X(14.8)},11.8 Q${X(24)},10.6 ${XD(33.2)},11.8 Q${XD(41.2)},11.6 ${XD(41.6)},14.6 Q${XD(40)},17.8 ${X(24)},17.8 Q${X(8)},17.8 ${X(6.4)},14.6 Z`;
      const rangs = /* @__PURE__ */ __name((y0, y1, pas) => Array.from({ length: Math.round((y1 - y0) / pas) }, (_, i) => `M${X(4)},${r22(y0 + i * pas)} L${X(44)},${r22(y0 + i * pas)}`).join(" "), "rangs");
      let s = `<ellipse cx="${X(24)}" cy="17" rx="13" ry="1.6" fill="${c.hairS || "#000"}" opacity=".35"/>`;
      s += P(bord, PA) + clip(`${c.uid}pb${view}`, bord, `<path d="${rangs(12, 18, 1.2)}" stroke="${PS}" stroke-width=".35" fill="none"/><rect x="${X(28)}" y="10" width="16" height="9" fill="${PS}" opacity=".45"/>`) + P(bord, "none") + `<path d="M${X(8)},14.8 Q${X(24)},16.6 ${X(40)},14.8" stroke="${PT}" stroke-width=".5" fill="none"/>`;
      s += P(calotte, PA) + clip(`${c.uid}pc${view}`, calotte, `<path d="${rangs(5.6, 14, 1.1)}" stroke="${PS}" stroke-width=".35" fill="none"/><rect x="${X(27.4)}" y="4" width="8" height="11" fill="${PS}" opacity=".55"/><rect x="${X(14)}" y="10.6" width="20" height="2.4" fill="${col}"/><rect x="${X(14)}" y="12.4" width="20" height=".6" fill="${tone(col, 0.7)}"/>`) + P(calotte, "none") + L([X(17.2), 8.4], [X(20.6), 6.6], PH, 0.9);
      const nx = ne ? 16 : 31.2;
      if (view !== "se" || true) s += P(`M${X(nx)},11.8 l-1.8,-1.2 l0,2.6 Z M${X(nx)},11.8 l1.8,-1.2 l0,2.6 Z`, col, 0.5) + E(+X(nx), 11.8, 0.7, 0.7, tone(col, 0.8), 0.4);
      return s;
    }
    __name(paille, "paille");
    function casquette(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.72), H = tone(col, 1.35);
      const dome = `M${X(11.4)},15.8 Q${X(11.2)},5.4 ${X(24)},5.2 Q${XD(36.8)},5.4 ${XD(36.6)},15.8 Q${X(24)},14.4 ${X(11.4)},15.8 Z`;
      const coutures = view === "ne" ? `M${X(24)},5.4 L${X(24)},14.8 M${X(18)},6.6 Q${X(16.6)},10.6 ${X(16.8)},15 M${X(30)},6.6 Q${X(31.4)},10.6 ${X(31.2)},15` : `M${X(24)},5.4 L${X(24)},14.6 M${X(19)},6.2 Q${X(17)},10.4 ${X(17.2)},14.8 M${X(29)},6.2 Q${X(31)},10.4 ${X(30.8)},14.8`;
      let s = P(dome, col) + clip(`${c.uid}cq${view}`, dome, `<rect x="${X(27)}" y="4" width="12" height="13" fill="${S}" opacity=".7"/><path d="${coutures}" stroke="${S}" stroke-width=".5" fill="none"/>` + (view === "ne" ? `<path d="M${X(19)},15.6 Q${X(24)},11.6 ${X(29)},15.6 Z" fill="${c.hair || "#543435"}"/><path d="M${X(17)},15.6 L${X(31)},15.6" stroke="${S}" stroke-width="1.2"/>` : "")) + P(dome, "none") + E(+X(24), 5.3, 1.1, 0.75, S, 0.6) + L([X(15.4), 9.4], [X(19.6), 7.2], H, 0.9);
      if (view === "front") {
        const v = `M${X(14.2)},15.2 Q${X(24)},12.8 ${X(33.8)},15.2 Q${X(34.6)},17.6 ${X(24)},18.6 Q${X(13.4)},17.6 ${X(14.2)},15.2 Z`;
        s += P(v, col) + clip(`${c.uid}cv${view}`, v, `<path d="M${X(12)},16.4 Q${X(24)},18.8 ${X(36)},16.4 L${X(36)},20 L${X(12)},20 Z" fill="${S}"/>`) + P(v, "none") + `<path d="M${X(16)},15.6 Q${X(24)},13.6 ${X(32)},15.6" stroke="${H}" stroke-width=".45" fill="none" stroke-dasharray=".8 .6"/>`;
      } else if (view === "se") {
        const v = `M${X(12.4)},14.6 Q${X(7)},13.2 ${X(5.4)},15.6 Q${X(6.4)},17.6 ${X(12)},17.2 L${X(19)},16.2 Q${X(16)},14.6 ${X(12.4)},14.6 Z`;
        s += P(v, col) + clip(`${c.uid}cv${view}`, v, `<rect x="${X(4)}" y="16" width="16" height="3" fill="${S}"/>`) + P(v, "none") + `<path d="M${X(7)},15.4 Q${X(10)},14.6 ${X(13.6)},15.2" stroke="${H}" stroke-width=".45" fill="none" stroke-dasharray=".8 .6"/>`;
      }
      return s;
    }
    __name(casquette, "casquette");
    function bandana(c, { view }, [col]) {
      const ne = view === "ne", k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.74), H = tone(col, 1.3);
      const d = ne ? `M${X(11)},18.2 Q${X(10.6)},5.8 ${X(24)},5.6 Q${X(37.4)},5.8 ${X(37)},18.2 Q${X(24)},15.6 ${X(11)},18.2 Z` : `M${X(11.2)},17 Q${X(11)},5.8 ${X(24)},5.6 Q${XD(37)},5.8 ${XD(36.8)},17 Q${X(24)},13.6 ${X(11.2)},17 Z`;
      const pois = [[15.6, 9.6], [20.4, 7.4], [26.4, 7.6], [31.6, 9.8], [18, 12.6], [24, 11], [29.8, 12.8], [14.4, 14.6], [33.6, 14.6]];
      let s = P(d, col) + clip(`${c.uid}bd${view}`, d, `<rect x="${X(27.6)}" y="4" width="12" height="16" fill="${S}" opacity=".7"/>` + pois.map(([x, y]) => E(+X(x), y, 0.75, 0.62, "#F6F0FA", 0)).join("") + `<path d="M${X(12.6)},${ne ? 16.4 : 15} Q${X(24)},${ne ? 13.6 : 12} ${X(35.4)},${ne ? 16.4 : 15}" stroke="${S}" stroke-width=".55" fill="none"/>`) + P(d, "none") + L([X(15.6), 8.4], [X(20.4), 6.6], H, 0.9);
      if (ne) s += P(`M${X(23.2)},17 Q${X(21.2)},20.6 ${X(21.6)},24 Q${X(22.8)},22.8 ${X(23.8)},23.4 Q${X(23.4)},20.2 ${X(24.4)},17.2 Z`, S, 0.7) + P(`M${X(24.8)},17 Q${X(27.4)},20 ${X(27.6)},23.4 Q${X(26.4)},22.6 ${X(25.4)},23 Q${X(25.4)},20 ${X(23.6)},17.4 Z`, S, 0.7) + E(+X(24), 16.8, 2, 1.4, col, 0.7) + L([X(23.2), 16.4], [X(24.4), 16.2], H, 0.5);
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
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD"), S = tone(col, 0.72), H = tone(col, 1.35);
      const ne = view === "ne";
      const feutre = ne ? `M${X(11.2)},13.6 Q${X(9.6)},5.6 ${X(22.6)},4.4 Q${X(36.4)},3.6 ${X(38.6)},9.6 Q${X(39.6)},13 ${X(36)},13.6 Q${X(24)},11 ${X(11.2)},13.6 Z` : `M${X(11.6)},13 Q${X(9.8)},5.4 ${X(22.4)},4.2 Q${XD(36.4)},3.4 ${XD(38.8)},9 Q${XD(39.8)},12.4 ${XD(36.2)},13 Q${X(24)},10.6 ${X(11.6)},13 Z`;
      const bande = ne ? `M${X(12.2)},13.4 Q${X(24)},11.2 ${X(35.8)},13.4 L${X(35.6)},15 Q${X(24)},12.8 ${X(12.4)},15 Z` : `M${X(12.6)},12.8 Q${X(24)},10.8 ${XD(35.8)},12.8 L${XD(35.6)},14.4 Q${X(24)},12.4 ${X(12.8)},14.4 Z`;
      return '<g transform="translate(0 1.3)">' + P(bande, S, 0.8) + P(feutre, col) + clip(`${c.uid}br${view}`, feutre, `<path d="M${X(8)},10.4 Q${X(24)},7.8 ${X(42)},10 L${X(42)},16 L${X(8)},16 Z" fill="${S}"/><ellipse cx="${X(20)}" cy="6.4" rx="6" ry="1.8" fill="${H}" opacity=".55"/>`) + P(feutre, "none") + P(`M${X(24.2)},4.6 Q${X(24.4)},3.2 ${X(25.8)},3`, "none", 1.2).replace(`stroke="${OUT}"`, `stroke="${S}"`) + "</g>";
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
      return P(`M${x},${y} Q${r22(x - 4.4)},${r22(y - 3.6)} ${r22(x - 4.4)},${r22(y + 0.2)} Q${r22(x - 3.8)},${r22(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${x},${y} Q${r22(x + 4.4)},${r22(y - 3.6)} ${r22(x + 4.4)},${r22(y + 0.2)} Q${r22(x + 3.8)},${r22(y + 2.8)} ${x},${y} Z`, col, 0.8) + P(`M${r22(x - 0.6)},${r22(y + 0.6)} L${r22(x - 1.8)},${r22(y + 3.8)} L${r22(x - 0.4)},${r22(y + 3.2)} Z M${r22(x + 0.6)},${r22(y + 0.6)} L${r22(x + 1.8)},${r22(y + 3.8)} L${r22(x + 0.4)},${r22(y + 3.2)} Z`, d, 0.6) + E(x, y, 1.15, 1.25, d, 0.7) + L([x - 3.2, y - 1], [x - 1.8, y - 1.6], tone(col, 1.35), 0.6);
    }
    __name(noeud, "noeud");
    function barrettes(c, { view }, [col]) {
      const [x, y] = PIN[view];
      const one = /* @__PURE__ */ __name((dx, dy) => `<rect x="${r22(x + dx - 2.2)}" y="${r22(y + dy - 0.65)}" width="4.4" height="1.3" rx="0.65" fill="${col}" stroke="${OUT}" stroke-width="0.6" transform="rotate(-28 ${r22(x + dx)} ${r22(y + dy)})"/>`, "one");
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
    var branches = /* @__PURE__ */ __name((view, col, tour) => (view === "se" ? P("M27.9,22.2 L34.4,21.4", "none", 0.8) : P(tour ? "M31.7,22.2 L35.8,21.6" : "M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6", "none", 0.8)).replace(`stroke="${OUT}"`, `stroke="${col}"`), "branches");
    var deDos = /* @__PURE__ */ __name((col) => P("M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${col}"`), "deDos");
    function lunettes(forme) {
      return (c, { view, tour }, [col]) => {
        if (view === "ne") return deDos(forme === "rondes" ? col : tone(col, 0.7));
        const [[x1, y], [x2]] = VERRES[view];
        const se = view === "se", f = se ? 0.86 : 1;
        const frame = forme === "rondes" ? col : tone(col, 0.9);
        const glass = forme === "soleil" ? `fill="${tone(col, 0.45)}" fill-opacity="0.9"` : forme === "coeur" ? `fill="${mix(col, "#FFFFFF", 0.3)}" fill-opacity="0.55"` : 'fill="rgba(200,230,255,.25)"';
        const lens = /* @__PURE__ */ __name((x, w) => {
          if (forme === "rondes" || forme === "soleil") return `<circle cx="${x}" cy="${y}" r="${r22(3.1 * w)}" ${glass} stroke="${frame}" stroke-width="${forme === "soleil" ? 1 : 0.9}"/>`;
          if (forme === "carrees") return `<rect x="${r22(x - 3.2 * w)}" y="${r22(y - 2.4)}" width="${r22(6.4 * w)}" height="4.8" rx="1.1" ${glass} stroke="${frame}" stroke-width="1"/>`;
          if (forme === "papillon") {
            const o = x < 24 - (se ? 1.4 : 0) ? -1 : 1;
            return `<path d="M${r22(x - 3.2 * w * o)},${r22(y - 1.2)} Q${x},${r22(y - 2.6)} ${r22(x + 3.4 * w * o)},${r22(y - 2.8)} Q${r22(x + 3 * w * o)},${r22(y + 2.6)} ${x},${r22(y + 2.4)} Q${r22(x - 3 * w * o)},${r22(y + 2.2)} ${r22(x - 3.2 * w * o)},${r22(y - 1.2)} Z" ${glass} stroke="${frame}" stroke-width="1"/>`;
          }
          return coeur(x, y + 0.2, 3 * w, mix(col, "#FFFFFF", 0.3), 1).replace(`fill="${mix(col, "#FFFFFF", 0.3)}"`, glass).replace(`stroke="${OUT}"`, `stroke="${frame}"`);
        }, "lens");
        let s = lens(x1, 1) + lens(x2, f) + P(se ? "M20.1,22.4 Q21.2,21.6 22.9,22.4" : "M22.5,22.4 Q24,21.4 25.5,22.4", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${frame}"`) + branches(view, frame, tour);
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
      return `<g transform="rotate(-24 ${x} ${y})"><rect x="${r22(x - 2.4)}" y="${r22(y - 0.95)}" width="4.8" height="1.9" rx="0.9" fill="${col}" stroke="${OUT}" stroke-width="0.6"/><rect x="${r22(x - 0.8)}" y="${r22(y - 0.75)}" width="1.6" height="1.5" rx="0.3" fill="${tone(col, 0.88)}"/>` + [-1.7, 1.5].map((d) => E(x + d, y - 0.25, 0.16, 0.16, tone(col, 0.7), 0) + E(x + d + 0.2, y + 0.35, 0.16, 0.16, tone(col, 0.7), 0)).join("") + "</g>";
    }
    __name(pansement, "pansement");
    var LOBES = { front: [[11.8, 24.6], [36.2, 24.6]], se: [[35.1, 25]] };
    function boucles(forme) {
      return (c, { view }, [col]) => {
        if (view === "ne" || !c.oreillesVisibles) return "";
        return LOBES[view].map(([x, y]) => {
          if (forme === "puces") return E(x, y, 0.75, 0.75, col, 0.5) + E(x - 0.25, y - 0.25, 0.22, 0.22, reflet(col), 0);
          if (forme === "anneaux") return `<circle cx="${x}" cy="${r22(y + 1)}" r="1.25" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r22(y + 1)}" r="1.25" fill="none" stroke="${col}" stroke-width="0.6"/>`;
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
      const y = reperes(c).cou, uid = c.uid, Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      const band = `M15.2,${Y(-0.4)} Q24,${Y(4.6)} 32.8,${Y(-0.4)} L33.6,${Y(3.2)} Q24,${Y(9)} 14.4,${Y(3.2)} Z`;
      const rayures = /* @__PURE__ */ __name((id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${8 + i * 6}" y="${Y(-10)}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${Y(5)})"/>`).join("")), "rayures");
      let s = "";
      if (view === "ne") {
        const pan3 = `M28,${Y(3.4)} L31.2,${Y(2.8)} L32.6,${Y(13)} L29.2,${Y(13.4)} Z`;
        s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, "none");
        return s + P(pan3, col) + clip(`${uid}p${view}`, pan3, [6, 9.4].map((d) => `<rect x="27" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan3, "none") + [0.7, 1.6, 2.5].map((d) => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join("");
      }
      const ex = view === "se" ? 24.6 : 27.4;
      const pan2 = `M${ex},${Y(3.6)} L${r22(ex + 3)},${Y(3.2)} L${r22(ex + 3.6)},${Y(13.4)} L${r22(ex + 0.2)},${Y(13.8)} Z`;
      s += P(pan2, col) + clip(`${uid}p${view}`, pan2, [6.2, 9.6].map((d) => `<rect x="${r22(ex - 1)}" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join("")) + P(pan2, "none") + [0.7, 1.6, 2.5].map((d) => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join("");
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
      const shell = `M${o},${r22(y + 2.4)} L${r22(o - 2.2)},${r22(y - 0.4)} Q${o},${r22(y - 2.6)} ${r22(o + 2.2)},${r22(y - 0.4)} Z`;
      return P(`M${o - 6},31.4 Q${o},37.8 ${o + 6},31.4`, "none", 0.5) + P(shell, col, 0.6) + [-1.1, 0, 1.1].map((d) => L([o, y + 2.1], [o + d * 1.4, y - 1.1], tone(col, 0.7), 0.4)).join("");
    }
    __name(coquillage, "coquillage");
    function papillon(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = 32.8;
      return P(`M${o},${y} L${r22(o - 3.2)},${r22(y - 1.8)} L${r22(o - 3.2)},${r22(y + 1.8)} Z M${o},${y} L${r22(o + 3.2)},${r22(y - 1.8)} L${r22(o + 3.2)},${r22(y + 1.8)} Z`, col, 0.7) + E(o, y, 0.95, 1.05, tone(col, 0.8), 0.6);
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
      const bag = `M${r22(bx - 3.6)},42.6 L${r22(bx + 3.6)},42.6 L${r22(bx + 3.4)},48 Q${bx},48.8 ${r22(bx - 3.4)},48 Z`;
      return limb(strap[0], strap[1], 1.3, d) + P(bag, col) + P(`M${r22(bx - 3.6)},42.6 L${r22(bx + 3.6)},42.6 L${r22(bx + 3.5)},45.2 Q${bx},46.4 ${r22(bx - 3.5)},45.2 Z`, d, 0.8) + E(bx, 45.4, 0.6, 0.6, "#E8C46A", 0.5);
    }
    __name(besace, "besace");
    function cape(c, ctx, [col]) {
      const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
      if (ctx.couche === "derriere" && view !== "ne") {
        const p = `M${r22(24 - sw - 0.6)},31.4 Q24,29.6 ${r22(24 + sw + 0.6)},31.4 L${r22(24 + hw + 4.2)},52.6 Q24,54.6 ${r22(24 - hw - 4.2)},52.6 Z`;
        return P(p, col) + clip(`${c.uid}cp${view}`, p, `<rect x="0" y="28" width="48" height="30" fill="${d}" opacity="0.55"/>`) + P(p, "none");
      }
      if (ctx.couche === "cou" && view !== "ne") {
        const o = milieu(view);
        return P(`M${r22(o - 5.4)},31 Q${o},33.4 ${r22(o + 5.4)},31`, "none", 1.6).replace(`stroke="${OUT}"`, `stroke="${d}"`) + E(o, 32.6, 1.1, 1.1, "#E8C46A", 0.6);
      }
      if (ctx.couche === "surBras" && view === "ne") {
        const p = `M${r22(24 - sw - 1.2)},31.2 Q24,29.2 ${r22(24 + sw + 1.2)},31.2 Q${r22(24 + sw + 3.4)},34 ${r22(24 + hw + 4.4)},52.6 Q24,54.8 ${r22(24 - hw - 4.4)},52.6 Q${r22(24 - sw - 3.4)},34 ${r22(24 - sw - 1.2)},31.2 Z`;
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
      const basket = `M${r22(x - 4)},${y} L${r22(x + 4)},${y} L${r22(x + 3.2)},${r22(y + 4.4)} Q${x},${r22(y + 5.2)} ${r22(x - 3.2)},${r22(y + 4.4)} Z`;
      return P(`M${r22(x - 3.4)},${r22(y + 0.2)} Q${x},${r22(y - 6.6)} ${r22(x + 3.4)},${r22(y + 0.2)}`, "none", 1.6).replace(`stroke="${OUT}"`, 'stroke="#74493B"') + fleurette(x - 2, y - 0.6, 1.05, col) + fleurette(x + 1.6, y - 0.9, 1.1, mix(col, "#FFFFFF", 0.5)) + feuille(x - 0.2, y - 0.4, -60, 0.9) + P(basket, "#9D6E57") + clip(`${c.uid}pn${ctx.view}`, basket, [1.4, 2.8].map((d) => L([x - 4, y + d], [x + 4, y + d], "#7E5442", 0.5)).join("") + [-2, 0, 2].map((d) => L([x + d, y], [x + d * 0.85, y + 5], "#7E5442", 0.5)).join("")) + P(basket, "none");
    }
    __name(panier, "panier");
    function ombrelle(c, ctx, [col], h) {
      const [x, y] = h, tip = [Math.min(x + 3, 38.6), y - 17.4];
      const canopy = "M-7,0 Q-6.7,-6.2 0,-6.7 Q6.7,-6.2 7,0 Q5.25,-1.2 3.5,0 Q1.75,-1.2 0,0 Q-1.75,-1.2 -3.5,0 Q-5.25,-1.2 -7,0 Z";
      const ribs = [-3.5, 0, 3.5].map((d) => L([d * 0.5, -6.3], [d, -0.2], tone(col, 0.82), 0.5)).join("");
      return limb([x, y + 0.4], tip, 0.7, "#74493B") + `<g transform="translate(${r22(tip[0])} ${r22(tip[1] + 1.6)}) rotate(16)">${P(canopy, col)}${ribs}${E(0, -6.9, 0.6, 0.6, tone(col, 0.8), 0.5)}</g>`;
    }
    __name(ombrelle, "ombrelle");
    var balance = /* @__PURE__ */ __name((ctx) => ctx.sway || 0, "balance");
    function pan(c, ctx) {
      const { sw, hw, b, cou: y, hanche, ourlet: H } = reperes(c), w = balance(ctx);
      const mx = (sw + hw) / 2 + b + 0.6;
      return `M${r22(24 - sw - 0.5)},${r22(y + 1.6)} Q24,${r22(y - 1.2)} ${r22(24 + sw + 0.5)},${r22(y + 1.6)} Q${r22(24 + mx)},${r22(y + 8.8)} ${r22(24 + hw + 0.9)},${r22(hanche + 0.9)} L${r22(24 + hw + 2.4 + w)},${H} Q${r22(24 + w)},${r22(H + 1.8)} ${r22(24 - hw - 2.4 + w)},${H} L${r22(24 - hw - 0.9)},${r22(hanche + 0.9)} Q${r22(24 - mx)},${r22(y + 8.8)} ${r22(24 - sw - 0.5)},${r22(y + 1.6)} Z`;
    }
    __name(pan, "pan");
    function panPeint(c, ctx, id, col, S, reflets = "") {
      const { view } = ctx, d = pan(c, ctx), { sw, cou: y, ourlet: H } = reperes(c);
      const ombre = `<rect x="${view === "se" ? 25.4 : 27.2}" y="${r22(y - 1.8)}" width="16" height="30" fill="${S}"/><path d="M6,${r22(H - 1.6)} Q24,${r22(H + 1.4)} 42,${r22(H - 1.6)} L42,${r22(H + 4)} L6,${r22(H + 4)} Z" fill="${S}"/>`;
      const clair = view === "ne" ? "" : `<rect x="${r22(24 - sw + 0.6)}" y="${r22(y + 3.6)}" width="1.3" height="10" rx="0.6" fill="${tone(col, 1.28)}"/>`;
      return P(d, col) + clip(`${c.uid}${id}${view}`, d, ombre + clair + reflets) + P(d, "none");
    }
    __name(panPeint, "panPeint");
    function poches(c, { view }, S) {
      const { hw, hanche } = reperes(c), se = view === "se";
      const one = /* @__PURE__ */ __name((x, l) => P(`M${r22(x)},${r22(hanche + 1.1)} L${r22(x + l)},${r22(hanche + 1.1)} L${r22(x + l - 0.2)},${r22(hanche + 2.7)} L${r22(x + 0.2)},${r22(hanche + 2.7)} Z`, S, 0.6), "one");
      return one(24 - hw - 0.4 - (se ? 0.6 : 0), 4.4) + one(24 + hw - (se ? 3.4 : 4), se ? 3 : 4.4);
    }
    __name(poches, "poches");
    function colFourrure(o, view, col, y) {
      const S = tone(col, 0.86), Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      if (view === "ne") {
        return P(`M15.4,${Y(0)} Q24,${Y(3.2)} 32.6,${Y(0)} L33.2,${Y(2.4)} Q24,${Y(6.2)} 14.8,${Y(2.4)} Z`, col, 0.9) + P(`M17.4,${Y(2.8)} Q24,${Y(5.2)} 30.6,${Y(2.8)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
      }
      const pts = Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        return [(1 - t) ** 2 * (o + 8.4) + 2 * t * (1 - t) * o + t * t * (o - 8.4), (1 - t) ** 2 * (y + 1.8) + 2 * t * (1 - t) * (y + 8.4) + t * t * (y + 1.8)];
      });
      let d = `M${r22(o - 6.8)},${Y(-0.2)} Q${o},${Y(3)} ${r22(o + 6.8)},${Y(-0.2)} L${r22(pts[0][0])},${r22(pts[0][1])}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        d += ` Q${r22((x0 + x1) / 2)},${r22((y0 + y1) / 2 + 1.5)} ${r22(x1)},${r22(y1)}`;
      }
      d += " Z";
      return P(d, col, 0.9) + P(`M${r22(o - 5)},${Y(3.4)} Q${o},${Y(6.4)} ${r22(o + 5)},${Y(3.4)}`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
    }
    __name(colFourrure, "colFourrure");
    var BOIS = "#A7826D";
    function manteau(c, ctx, [col, fourrure]) {
      if (ctx.couche !== "dessus") return "";
      const { view } = ctx, { cou: y, ourlet: H } = reperes(c), S = tone(col, 0.8), w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      let s = panPeint(c, ctx, "mt", col, S);
      if (view === "ne") {
        s += P(`M24,${Y(3)} L${r22(24 + w * 0.6)},${r22(H - 3.6)}`, "none", 0.5) + P(`M${r22(24 + w * 0.6)},${r22(H - 3.6)} L${r22(24 + w)},${r22(H + 0.6)}`, "none", 0.8) + `<rect x="19.2" y="${Y(10.8)}" width="9.6" height="1.8" rx="0.8" fill="${S}" stroke="${OUT}" stroke-width="0.7"/>` + E(20.5, y + 11.7, 0.55, 0.55, BOIS, 0.45) + E(27.5, y + 11.7, 0.55, 0.55, BOIS, 0.45);
        return s + colFourrure(24, view, fourrure, y);
      }
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      s += P(`M${r22(o + 1.2)},${Y(3.6)} L${r22(o + 1.2 + w)},${r22(H + 0.8)}`, "none", 0.8);
      for (const d of [6.2, 9.6, 13]) {
        const yy = y + d, x = o + 1.2 + w * (yy - sh) / (H - sh);
        s += L([x - 2.6, yy], [x + 2.6, yy], tone(col, 0.55), 0.55) + `<rect x="${r22(x - 1.5)}" y="${r22(yy - 0.55)}" width="3" height="1.1" rx="0.55" fill="${BOIS}" stroke="${OUT}" stroke-width="0.5"/>`;
      }
      return s + poches(c, ctx, S) + colFourrure(o, view, fourrure, y);
    }
    __name(manteau, "manteau");
    function cire(c, ctx, [col]) {
      const { view } = ctx, S = tone(col, 0.82), R2 = reperes(c);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R2, col, S);
      if (ctx.couche !== "dessus") return "";
      const { cou: y, ourlet: H, sw, hw, hanche } = R2, w = balance(ctx), Y = /* @__PURE__ */ __name((d) => r22(y + d), "Y");
      const gl = "rgba(255,255,255,.55)";
      const reflets = view === "ne" ? L([24 - sw + 2.2, y + 4.2], [24 - sw + 1.8, y + 8.8], gl, 0.9) : L([24 - sw + 3, y + 4.6], [24 - sw + 2.6, y + 9.2], gl, 0.9) + L([24 - hw + 0.6, hanche + 2.5], [24 - hw + 0.2 + w, hanche + 4.9], gl, 0.8);
      let s = panPeint(c, ctx, "cr", col, S, reflets);
      if (view === "ne") return s + P(`M24,${Y(9.2)} L${r22(24 + w)},${r22(H + 0.6)}`, "none", 0.5) + capucheRabattue(c.uid, view, R2, col, S);
      const o = view === "se" ? 21.6 : 24, sh = y + 3.2;
      if ((c.o.accessoires.dessus || {}).ouvert) {
        const coin = `M${r22(o - 2.6)},${Y(2)} L${r22(o + 2.6)},${Y(2)} L${r22(o + 3 + w)},${r22(H + 2)} L${r22(o - 3 + w)},${r22(H + 2)} Z`;
        s = `<clipPath id="${c.uid}cro${view}"><path d="M0,0 L48,0 L48,64 L0,64 Z ${coin}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c.uid}cro${view})">${s}</g>`;
        s += P(`M${r22(o - 2.6)},${Y(2)} L${r22(o - 3 + w)},${r22(H + 0.4)} M${r22(o + 2.6)},${Y(2)} L${r22(o + 3 + w)},${r22(H + 0.4)}`, "none");
        s += [6, 10, 14].map((d) => y + d).filter((yy) => yy < H - 2).map((yy) => E(o - 4.2 + w * (yy - sh) / (H - sh), yy, 0.55, 0.55, tone(col, 0.5), 0.4)).join("");
        s += P(`M${r22(o - 6.4)},${Y(0.8)} L${r22(o - 2.4)},${Y(4.4)} L${r22(o - 3.6)},${Y(5.8)} Z`, col, 0.8) + P(`M${r22(o + 6.4)},${Y(0.8)} L${r22(o + 2.4)},${Y(4.4)} L${r22(o + 3.6)},${Y(5.8)} Z`, S, 0.8);
        return s + poches(c, ctx, S);
      }
      s += P(`M${r22(o + 0.8)},${Y(3)} L${r22(o + 0.8 + w)},${r22(H + 0.8)}`, "none", 0.9);
      s += [5.6, 9.2, 12.8, 16.4].map((d) => y + d).filter((yy) => yy < H - 1.4).map((yy) => E(o + 2.2 + w * (yy - sh) / (H - sh), yy, 0.6, 0.6, tone(col, 0.5), 0.4)).join("");
      s += P(`M${r22(o - 5.2)},${Y(0.4)} L${r22(o + 0.4)},${Y(4.6)} L${r22(o - 1.6)},${Y(6)} Z`, col, 0.8) + P(`M${r22(o + 5.2)},${Y(0.4)} L${r22(o + 0.4)},${Y(4.6)} L${r22(o + 2.4)},${Y(6)} Z`, S, 0.8);
      return s + poches(c, ctx, S);
    }
    __name(cire, "cire");
    function chale(c, { view }, [col, frange]) {
      const { cou: y, e } = reperes(c), uid = c.uid, Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      const S = tone(col, 0.82), L0 = r22(24 - e - 3.6), R0 = r22(24 + e + 3.6);
      const tricot = /* @__PURE__ */ __name(() => [0, 1, 2, 3, 4, 5].map((i) => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join("") + [0, 1, 2, 3, 4, 5].map((i) => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join(""), "tricot");
      if (view === "ne") {
        const d2 = `M${L0},${Y(5.4)} Q${r22(24 - e - 1)},${Y(0.4)} 24,${Y(-0.2)} Q${r22(24 + e + 1)},${Y(0.4)} ${R0},${Y(5.4)} Q${r22(R0 + 0.2)},${Y(8.4)} ${r22(R0 - 1.2)},${Y(9.6)} L24,${Y(17.6)} L${r22(L0 + 1.2)},${Y(9.6)} Q${r22(L0 - 0.2)},${Y(8.4)} ${L0},${Y(5.4)} Z`;
        return P(d2, col) + clip(`${uid}ch${view}`, d2, tricot() + `<rect x="25.6" y="${Y(-2)}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P(d2, "none") + [-1.6, -0.5, 0.6, 1.7].map((dx) => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join("");
      }
      const o = view === "se" ? 22 : 24;
      const d = `M${r22(o - 5.6)},${Y(0.6)} L${o},${Y(8.6)} L${r22(o + 5.6)},${Y(0.6)} Q${r22(R0 - 2.4)},${Y(1.4)} ${R0},${Y(4.6)} Q${r22(R0 + 0.6)},${Y(7.6)} ${r22(R0 - 0.2)},${Y(10)} Q${r22(o + 6)},${Y(11.4)} ${r22(o + 1.6)},${Y(10.2)} L${o},${Y(11.6)} L${r22(o - 1.6)},${Y(10.2)} Q${r22(o - 6)},${Y(11.4)} ${r22(L0 + 0.2)},${Y(10)} Q${r22(L0 - 0.6)},${Y(7.6)} ${L0},${Y(4.6)} Q${r22(L0 + 2.4)},${Y(1.4)} ${r22(o - 5.6)},${Y(0.6)} Z`;
      let s = P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${r22(o + 3.4)}" y="${Y(-2)}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none");
      const pan2 = /* @__PURE__ */ __name((dx, sg) => `M${r22(o + dx)},${Y(10.4)} L${r22(o + dx + sg * 2.4)},${Y(10.6)} L${r22(o + dx + sg * 2.8)},${Y(15)} L${r22(o + dx + sg * 0.4)},${Y(15.2)} Z`, "pan");
      s += P(pan2(0.2, 1), S) + P(pan2(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
      return s + [0.6, 1.5, 2.4].map((t) => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join("");
    }
    __name(chale, "chale");
    function pelerine(c, ctx, [col, bord]) {
      const { view } = ctx, R2 = reperes(c), { cou: y, e } = R2, S = tone(col, 0.8);
      if (ctx.couche === "derriere") return view === "ne" ? "" : capucheRabattue(c.uid, view, R2, col, S);
      const L0 = r22(24 - e - 3.8), R0 = r22(24 + e + 3.8), B = r22(y + 10.6), Y = /* @__PURE__ */ __name((d2) => r22(y + d2), "Y");
      const d = `M${r22(24 - e - 0.4)},${Y(0.8)} Q24,${Y(-1.4)} ${r22(24 + e + 0.4)},${Y(0.8)} Q${r22(R0 - 0.6)},${Y(3)} ${R0},${B} Q24,${r22(B + 3.4)} ${L0},${B} Q${r22(L0 + 0.6)},${Y(3)} ${r22(24 - e - 0.4)},${Y(0.8)} Z`;
      let s = P(d, col) + clip(`${c.uid}pl${view}`, d, `<rect x="${view === "se" ? 25.4 : 27.2}" y="${Y(-2)}" width="18" height="18" fill="${S}"/><path d="M0,${r22(B - 1.2)} Q24,${r22(B + 2.2)} 48,${r22(B - 1.2)} L48,${r22(B + 6)} L0,${r22(B + 6)} Z" fill="${bord}"/>` + [-10, -6, -2, 2, 6, 10].map((x) => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join("")) + P(d, "none");
      if (view === "ne") s += capucheRabattue(`${c.uid}pl`, view, R2, col, S);
      return s;
    }
    __name(pelerine, "pelerine");
    function etole(c, { view }, [col]) {
      const { cou: y, e } = reperes(c), S = tone(col, 0.84), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6, B = y + (view === "ne" ? 9.4 : 7.6), n = 6;
      const festons = /* @__PURE__ */ __name((x0, x1, yb) => {
        let d2 = "";
        const l = (x1 - x0) / n;
        for (let i = n - 1; i >= 0; i--) d2 += ` Q${r22(x0 + l * (i + 0.5))},${r22(yb + 1.6)} ${r22(x0 + l * i)},${r22(yb)}`;
        return d2;
      }, "festons");
      const d = `M${r22(24 - e - 0.4)},${r22(y + 0.6)} Q24,${r22(y - 1.8)} ${r22(24 + e + 0.4)},${r22(y + 0.6)} Q${r22(R0 - 0.6)},${r22(y + 2)} ${r22(R0)},${r22(B)}${festons(L0, R0, B)} Q${r22(L0 + 0.6)},${r22(y + 2)} ${r22(24 - e - 0.4)},${r22(y + 0.6)} Z`;
      const touffes = [-9, -5, -1, 3, 7, 10].map((dx, i) => `<path d="M${r22(24 + dx - 1)},${r22(y + 3 + i % 2 * 2)} q1,1.2 2,0" fill="none" stroke="${S}" stroke-width="0.6" stroke-linecap="round"/>`).join("");
      return P(d, col, 0.9) + clip(`${c.uid}et${view}`, d, touffes + `<rect x="${view === "se" ? 25.6 : 27.4}" y="${r22(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P(d, "none", 0.9);
    }
    __name(etole, "etole");
    function botte(fourree) {
      return (c, ctx, [col, fourrure], [x, y, dir, tilt]) => {
        const w = c.legW + 1.4, top = Math.max(y - 5.4, c.hip + 0.4), S = tone(col, 0.76);
        if (c.jambe) return botteSurJambe(c, fourree, col, fourrure, S, x, y, dir, tilt, y - top);
        let s = `<rect x="${r22(x - w / 2)}" y="${r22(top)}" width="${r22(w)}" height="${r22(y - top + 1.6)}" rx="1.3" fill="${col}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r22(x + w / 2 - 1.8)}" y="${r22(top + 0.8)}" width="1.1" height="${r22(y - top)}" rx="0.5" fill="${S}"/>`;
        if (!fourree) {
          s += `<rect x="${r22(x - w / 2 + 0.9)}" y="${r22(top + 1.8)}" width="0.9" height="${r22(Math.max(0.8, y - top - 2.4))}" rx="0.45" fill="rgba(255,255,255,.6)"/><rect x="${r22(x - w / 2)}" y="${r22(top)}" width="${r22(w)}" height="1.5" rx="0.7" fill="${tone(col, 0.82)}" stroke="${OUT}" stroke-width="0.8"/>`;
        }
        s += shoe({ ...c, uid: `${c.uid}b`, shoe: col, shoeS: tone(col, 0.68), shoeH: fourree ? tone(col, 1.22) : "rgba(255,255,255,.75)" }, x, y, dir, tilt);
        if (fourree) {
          const a = x - w / 2 - 0.8, b = x + w / 2 + 0.8, t0 = top - 1.2, t1 = top + 1.6, l = (b - a) / 3;
          let d = `M${r22(a)},${r22(t1)} Q${r22(a - 0.3)},${r22(t0 + 0.5)} ${r22(a + 0.9)},${r22(t0)} Q${r22(x)},${r22(t0 - 0.6)} ${r22(b - 0.9)},${r22(t0)} Q${r22(b + 0.3)},${r22(t0 + 0.5)} ${r22(b)},${r22(t1)}`;
          for (let i = 2; i >= 0; i--) d += ` Q${r22(a + l * (i + 0.5))},${r22(t1 + 1.1)} ${r22(a + l * i)},${r22(t1)}`;
          s += P(`${d} Z`, fourrure, 0.8) + [0.3, 0.7].map((f) => P(`M${r22(a + (b - a) * f - 0.7)},${r22(t0 + 1)} q0.7,0.9 1.4,0`, "none", 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(fourrure, 0.82)}"`)).join("");
        }
        return s;
      };
    }
    __name(botte, "botte");
    function botteSurJambe(c, fourree, col, fourrure, S, x, y, dir, tilt, haut) {
      const T2 = tigeJambe(c, x, y, haut, 0.7), id = `${c.uid}bt${Math.round(x * 10)}${Math.round(y * 10)}`;
      let s = P(T2.d, col, 0) + clip(id, T2.d, `<path d="${T2.droit}" fill="none" stroke="${S}" stroke-width="2.2" transform="translate(-0.9 0)"/>`) + (fourree ? "" : `<path d="${T2.gauche}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width=".9" stroke-linecap="round"/>`) + P(T2.d, "none", 1.1);
      if (!fourree) s += `<path d="${T2.ouverture}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${T2.ouverture}" fill="none" stroke="${tone(col, 0.82)}" stroke-width="1.2" stroke-linecap="round"/>`;
      s += shoe({ ...c, uid: `${c.uid}b`, shoe: col, shoeS: tone(col, 0.68), shoeH: fourree ? tone(col, 1.22) : "rgba(255,255,255,.75)" }, x, y, dir, tilt);
      if (fourree) s += `<path d="${T2.ouverture}" fill="none" stroke="${OUT}" stroke-width="4.2" stroke-linecap="round"/><path d="${T2.ouverture}" fill="none" stroke="${fourrure}" stroke-width="2.6" stroke-linecap="round"/><path d="${T2.ouverture}" fill="none" stroke="${tone(fourrure, 0.82)}" stroke-width=".5" stroke-dasharray=".6 1.1" stroke-linecap="round" transform="translate(0 .5)"/>`;
      return s;
    }
    __name(botteSurJambe, "botteSurJambe");
    var PORTE = {
      manteau: /* @__PURE__ */ __name(([col, fourrure]) => ({ sleeve: col, cuff: fourrure, sleeves: void 0 }), "manteau"),
      cire: /* @__PURE__ */ __name(([col]) => ({ sleeve: col, cuff: tone(col, 0.82), sleeves: void 0 }), "cire"),
      moufles: /* @__PURE__ */ __name(([col, revers], c) => ({ hand: col, moufle: true, ...c.sleeves ? {} : { cuff: revers } }), "moufles")
    };
    function tricorne(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), S = tone(col, 0.7), H = tone(col, 1.35), galon = mix(col, "#F2D58A", 0.75);
      const XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const calotte = `M${X(12.2)},14 Q${X(11.4)},5 ${X(24)},4.8 Q${XD(36.6)},5 ${XD(35.8)},14 Z`;
      const bord = view === "ne" ? `M${X(8.6)},12.4 Q${X(10.6)},11 ${X(13)},12.2 Q${X(24)},9.4 ${X(35)},12.2 Q${X(37.4)},11 ${X(39.4)},12.4 Q${X(37)},16.4 ${X(24)},16 Q${X(11)},16.4 ${X(8.6)},12.4 Z` : `M${X(8.4)},12.6 Q${X(10.4)},11 ${X(12.8)},12.2 Q${X(18)},9.2 ${X(24)},10.2 Q${X(30)},9.2 ${X(35.2)},12.2 Q${X(37.6)},11 ${X(39.6)},12.6 Q${X(38)},15.6 ${X(31.4)},15.4 Q${X(26.6)},15.6 ${X(24)},17.8 Q${X(21.4)},15.6 ${X(16.6)},15.4 Q${X(10)},15.6 ${X(8.4)},12.6 Z`;
      const liseret = view === "ne" ? `M${X(9.4)},12.6 Q${X(11)},11.8 ${X(13)},12.8 Q${X(24)},10.2 ${X(35)},12.8 Q${X(37)},11.8 ${X(38.6)},12.6` : `M${X(9.2)},12.7 Q${X(10.8)},11.7 ${X(12.9)},12.8 Q${X(18)},10 ${X(24)},11 Q${X(30)},10 ${X(35.1)},12.8 Q${X(37.2)},11.7 ${X(38.8)},12.7`;
      return P(calotte, S) + clip(`${c.uid}tc${view}`, calotte, `<ellipse cx="${X(20)}" cy="7.4" rx="5" ry="2.2" fill="${col}"/>`) + P(calotte, "none") + P(bord, col) + clip(`${c.uid}tb${view}`, bord, `<rect x="${X(27)}" y="8" width="14" height="10" fill="${S}" opacity=".8"/>`) + P(bord, "none") + `<path d="${liseret}" fill="none" stroke="${galon}" stroke-width=".9" stroke-linecap="round"/>` + L([X(14.6), 11.6], [X(19), 10.4], H, 0.8) + (view === "ne" ? "" : E(X(24), 13.2, 1.2, 1.2, galon, 0.6));
    }
    __name(tricorne, "tricorne");
    function hautForme(c, { view }, [col]) {
      const k = decale(view), X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), S = tone(col, 0.68), H = tone(col, 1.45), ruban = tone(col, 0.5);
      const XD = /* @__PURE__ */ __name((x) => r22(x + nuque(view)), "XD");
      const tube = `M${X(13)},14.6 Q${X(13.6)},9 ${X(14.4)},4.6 Q${X(24)},3.7 ${XD(33.6)},4.6 Q${XD(34.4)},9 ${XD(35)},14.6 Z`;
      const dessus = `M${X(14.4)},4.6 Q${X(24)},3.7 ${XD(33.6)},4.6 Q${X(24)},6.1 ${X(14.4)},4.6 Z`;
      const bord = `M${X(8.8)},14.6 Q${X(9.6)},12.4 ${X(12.6)},13.8 Q${X(24)},15.8 ${XD(35.4)},13.8 Q${XD(38.4)},12.4 ${XD(39.2)},14.6 Q${XD(37.6)},17.9 ${X(24)},17.9 Q${X(10.4)},17.9 ${X(8.8)},14.6 Z`;
      return P(tube, col) + clip(`${c.uid}hf${view}`, tube, `<rect x="${X(28)}" y="3" width="8" height="13" fill="${S}"/><rect x="${X(12)}" y="11" width="24" height="3.2" fill="${ruban}"/><rect x="${X(17.4)}" y="5" width="1.6" height="6" fill="${H}" opacity=".7"/>`) + P(tube, "none") + P(dessus, S, 0.6) + P(bord, col) + clip(`${c.uid}hb${view}`, bord, `<rect x="${X(28)}" y="12" width="12" height="7" fill="${S}"/>`) + P(bord, "none") + L([X(11), 14.6], [X(15.4), 15.5], H, 0.6);
    }
    __name(hautForme, "hautForme");
    function monocle(c, { view }, [col]) {
      if (view === "ne") return "";
      const se = view === "se";
      const x = se ? 25.2 : 28.6, y = 22.6, H = tone(col, 1.45), S = tone(col, 0.7);
      const chaine = se ? `M${r22(x + 0.6)},25.5 Q${r22(x + 1.8)},28.6 ${r22(x + 1)},32` : `M${r22(x + 1.4)},25.4 Q${r22(x + 3)},28.4 ${r22(x + 2.2)},32.2`;
      return `<path d="${chaine}" fill="none" stroke="${S}" stroke-width=".5" stroke-dasharray=".7 .45" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3.1" fill="rgba(210,236,255,.28)" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="3.1" fill="none" stroke="${col}" stroke-width=".7"/><path d="M${r22(x - 2.2)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y - 2.1)} ${r22(x - 0.2)},${r22(y - 2.4)}" fill="none" stroke="#FFFFFF" stroke-width=".55" opacity=".85" stroke-linecap="round"/>` + E(x + 1.6, y + 1.7, 0.35, 0.35, H, 0);
    }
    __name(monocle, "monocle");
    function cravate(c, { view }, [col]) {
      if (view === "ne") return "";
      const o = milieu(view), y = reperes(c).cou + 3.4, S = tone(col, 0.72), H = tone(col, 1.3), raie = mix(col, "#FFFFFF", 0.45);
      const noeud2 = `M${r22(o - 1.6)},${r22(y)} L${r22(o + 1.6)},${r22(y)} L${r22(o + 1.1)},${r22(y + 2.2)} L${r22(o - 1.1)},${r22(y + 2.2)} Z`;
      const lame = `M${r22(o - 1.1)},${r22(y + 2)} L${r22(o + 1.1)},${r22(y + 2)} L${r22(o + 2)},${r22(y + 9.6)} L${o},${r22(y + 11.4)} L${r22(o - 2)},${r22(y + 9.6)} Z`;
      return P(lame, col) + clip(`${c.uid}cv${view}`, lame, `<rect x="${o}" y="${r22(y)}" width="3" height="12" fill="${S}"/>` + [3.6, 6.4, 9.2].map((d) => `<path d="M${r22(o - 3)},${r22(y + d)} L${r22(o + 3)},${r22(y + d - 1.6)}" stroke="${raie}" stroke-width=".55"/>`).join("")) + P(lame, "none") + P(noeud2, S) + L([o - 0.8, y + 0.5], [o - 0.1, y + 0.4], H, 0.45);
    }
    __name(cravate, "cravate");
    function medaille(c, { view }, [col, metal]) {
      if (view === "ne") return "";
      const o = milieu(view) + (view === "se" ? -1.2 : -2.6), y = reperes(c).cou + 5, H = tone(metal, 1.45), S = tone(metal, 0.7);
      const ruban = `M${r22(o - 1.3)},${r22(y)} L${r22(o + 1.3)},${r22(y)} L${r22(o + 1)},${r22(y + 3.2)} L${r22(o - 1)},${r22(y + 3.2)} Z`;
      return P(ruban, col, 0.6) + `<rect x="${r22(o - 0.3)}" y="${r22(y)}" width=".6" height="3.2" fill="${mix(col, "#FFFFFF", 0.55)}"/>` + E(o, y + 5, 2, 2, metal, 0.8) + E(o, y + 5, 1.35, 1.35, S, 0) + etoile(o, y + 5, 1.15, H, 0) + E(o - 0.8, y + 4.2, 0.45, 0.35, "#FFFFFF", 0);
    }
    __name(medaille, "medaille");
    function cicatrice(c, { view }, [col]) {
      if (view === "ne") return "";
      const [x, y] = view === "se" ? [15.6, 21.2] : [18.6, 21];
      const pale = mix(col, "#FFFFFF", 0.25), S = tone(col, 0.7);
      return `<path d="M${r22(x - 1.2)},${r22(y - 3.4)} L${r22(x + 1.4)},${r22(y + 3)}" stroke="${S}" stroke-width="1.15" stroke-linecap="round"/><path d="M${r22(x - 1.2)},${r22(y - 3.4)} L${r22(x + 1.4)},${r22(y + 3)}" stroke="${pale}" stroke-width=".55" stroke-linecap="round"/>` + [-1.6, 0, 1.6].map((d) => L([x + d * 0.4 - 0.9, y + d + 0.35], [x + d * 0.4 + 0.9, y + d - 0.35], S, 0.4)).join("");
    }
    __name(cicatrice, "cicatrice");
    function pipe(c, ctx, [col, metal], h) {
      const [x, y] = [h[0] + 0.6, h[1] - 1.2], S = tone(col, 0.7), H = tone(col, 1.35);
      const fourneau = `M${r22(x + 0.4)},${r22(y - 3.4)} L${r22(x + 3.6)},${r22(y - 3.4)} Q${r22(x + 3.8)},${r22(y + 0.4)} ${r22(x + 2)},${r22(y + 0.6)} Q${r22(x + 0.2)},${r22(y + 0.4)} ${r22(x + 0.4)},${r22(y - 3.4)} Z`;
      return `<path d="M${r22(x + 0.6)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y + 0.2)} ${r22(x - 3.2)},${r22(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M${r22(x + 0.6)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y + 0.2)} ${r22(x - 3.2)},${r22(y - 1.6)}" fill="none" stroke="${metal}" stroke-width=".85" stroke-linecap="round"/>` + P(fourneau, col, 0.8) + clip(`${c.uid}pp${ctx.view}`, fourneau, `<rect x="${r22(x + 2.2)}" y="${r22(y - 4)}" width="2" height="5" fill="${S}"/>`) + E(x + 2, y - 3.4, 1.5, 0.5, "#40262A", 0.5) + E(x + 2, y - 3.5, 0.8, 0.25, "#E8743A", 0) + L([x + 0.9, y - 2.6], [x + 0.9, y - 0.8], H, 0.45) + `<path d="M${r22(x + 2)},${r22(y - 4.4)} Q${r22(x + 1)},${r22(y - 6)} ${r22(x + 2.2)},${r22(y - 7.4)} Q${r22(x + 3.2)},${r22(y - 8.8)} ${r22(x + 2.2)},${r22(y - 10)}" fill="none" stroke="#E8EEF2" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`;
    }
    __name(pipe, "pipe");
    function canne(c, ctx, [col, metal], h) {
      const [x, y] = h, S = tone(col, 0.7), H = tone(col, 1.45);
      const fut = `M${r22(x + 0.2)},${r22(y - 1)} L${r22(x + 3)},${r22(y + 9.6)}`;
      return `<path d="${fut}" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="${fut}" stroke="${col}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r22(x + 0.5)},${r22(y - 0.6)} L${r22(x + 2.9)},${r22(y + 8.6)}" stroke="${H}" stroke-width=".35" stroke-linecap="round" opacity=".8"/><path d="M${r22(x + 0.2)},${r22(y - 1)} Q${r22(x - 0.6)},${r22(y - 4)} ${r22(x - 3)},${r22(y - 3.4)} Q${r22(x - 4.4)},${r22(y - 2.8)} ${r22(x - 4)},${r22(y - 1.4)}" fill="none" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="M${r22(x + 0.2)},${r22(y - 1)} Q${r22(x - 0.6)},${r22(y - 4)} ${r22(x - 3)},${r22(y - 3.4)} Q${r22(x - 4.4)},${r22(y - 2.8)} ${r22(x - 4)},${r22(y - 1.4)}" fill="none" stroke="${S}" stroke-width="1.1" stroke-linecap="round"/>` + E(x + 0.3, y - 0.6, 0.9, 0.55, metal, 0.5) + E(x + 3, y + 9.8, 0.8, 0.5, metal, 0.5);
    }
    __name(canne, "canne");
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
      tricorne: { tete: tricorne },
      hautForme: { tete: hautForme },
      monocle: { visage: monocle },
      cravate: { cou: cravate },
      medaille: { cou: medaille },
      cicatrice: { joues: cicatrice },
      pipe: { main: pipe },
      canne: { main: canne },
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

// personnages/manche.js
var require_manche = __commonJS({
  "personnages/manche.js"(exports, module) {
    var { OUT, W, E, L, r2: r22 } = require_troupe();
    var { ton } = require_couleurs();
    var pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
    var add = /* @__PURE__ */ __name((p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k], "add");
    var unit = /* @__PURE__ */ __name((a, b) => {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    }, "unit");
    var trait = /* @__PURE__ */ __name((d, color, w, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "trait");
    function couper(pts, len) {
      const out = [pts[0]];
      let reste = len;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (reste <= l) {
          out.push(add(a, unit(a, b), reste));
          return out;
        }
        out.push(b);
        reste -= l;
      }
      return out;
    }
    __name(couper, "couper");
    var longueur = /* @__PURE__ */ __name((pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0), "longueur");
    function bords(pts, h0, h1) {
      const tot = longueur(pts) || 1, G = [], D = [];
      let fait = 0;
      pts.forEach((p, i) => {
        if (i) fait += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
        const h = h0 + (h1 - h0) * fait / tot;
        const u0 = i ? unit(pts[i - 1], p) : unit(p, pts[1]), u1 = i < pts.length - 1 ? unit(p, pts[i + 1]) : u0;
        const n0 = [-u0[1], u0[0]], n1 = [-u1[1], u1[0]];
        const cross = u0[0] * u1[1] - u0[1] * u1[0], dot = u0[0] * u1[0] + u0[1] * u1[1];
        if (Math.abs(cross) < 0.05 && dot > 0) {
          const m = unit([0, 0], [n0[0] + n1[0], n0[1] + n1[1]]);
          G.push(add(p, m, h));
          D.push(add(p, m, -h));
          return;
        }
        const k = cross > 0 ? 1 : -1;
        const mi = unit([0, 0], [n0[0] + n1[0], n0[1] + n1[1]]), cosHalf = Math.max(0.2, Math.sqrt((1 + dot) / 2));
        const creux = add(p, mi, k * Math.min(h / cosHalf, h * 1.4));
        const a0 = Math.atan2(-k * n0[1], -k * n0[0]), a1 = Math.atan2(-k * n1[1], -k * n1[0]);
        let da = a1 - a0;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        const arcPts = Array.from({ length: 6 }, (_, j) => {
          const t = a0 + da * j / 5;
          return [p[0] + Math.cos(t) * h, p[1] + Math.sin(t) * h];
        });
        if (k > 0) {
          G.push(creux);
          D.push(...arcPts);
        } else {
          D.push(creux);
          G.push(...arcPts);
        }
      });
      return { G, D };
    }
    __name(bords, "bords");
    function croise(p, d, q, e) {
      const det = d[0] * e[1] - d[1] * e[0];
      if (Math.abs(det) < 1e-6) return null;
      const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / det;
      return add(p, d, t);
    }
    __name(croise, "croise");
    function racineLevee(a, sgn, manche, G, D, ht) {
      const sw = Math.abs(a[0] - 24) + 0.5, dy = a[1] - 34;
      const epaule = /* @__PURE__ */ __name((x) => {
        const t = (x - 24 + sw) / (2 * sw);
        return (1 - t) ** 2 * 32.6 + 2 * t * (1 - t) * 30 + t * t * 32.6 + dy;
      }, "epaule");
      const u0 = unit(manche[0], manche[1]), n0 = [-u0[1], u0[0]];
      const haut = n0[1] < 0 ? G : D, bas = haut === G ? D : G;
      const long0 = Math.hypot(manche[1][0] - manche[0][0], manche[1][1] - manche[0][1]);
      const surBord = /* @__PURE__ */ __name((bord, k) => add(bord[0], u0, Math.min(k, long0 - 0.4)), "surBord");
      const xT = 24 + sgn * (sw - 3), T2 = [xT, epaule(xT)], pente = (epaule(xT + sgn * 0.5) - T2[1]) / 0.5;
      const Ua = surBord(haut, 2.4);
      const Cu = croise(T2, [sgn, pente * sgn], Ua, u0) || add(T2, [sgn, 0], 1.5);
      const A2 = [24 + sgn * (sw + 0.15), 36.8 + dy], La = surBord(bas, 3);
      let Cl = croise(A2, [sgn * 0.12, -1], La, u0);
      if (!Cl || Math.hypot(Cl[0] - A2[0], Cl[1] - A2[1]) > 4) Cl = [(A2[0] + La[0]) / 2, (A2[1] + La[1]) / 2];
      const suite = /* @__PURE__ */ __name((list) => list.slice(1).map((q) => `L${pt(q)}`).join(" "), "suite");
      return {
        forme: /* @__PURE__ */ __name((fin, u, bombe) => `M${pt(T2)} Q${pt(Cu)} ${pt(Ua)} ${suite(haut)} Q${pt(add(fin, u, bombe))} ${pt(bas[bas.length - 1])} ${bas.slice(1, -1).reverse().map((q) => `L${pt(q)}`).join(" ")} L${pt(La)} Q${pt(Cl)} ${pt(A2)} L${pt(a)} Z`, "forme"),
        dessus: `M${pt(T2)} Q${pt(Cu)} ${pt(Ua)} ${suite(haut)}`,
        dessous: `M${pt(bas[bas.length - 1])} ${bas.slice(1, -1).reverse().map((q) => `L${pt(q)}`).join(" ")} L${pt(La)} Q${pt(Cl)} ${pt(A2)}`,
        emmanchure: `M${pt(T2)} Q${pt(add(add(a, u0, 1.1), [sgn, 0], 0.4))} ${pt(A2)}`
      };
    }
    __name(racineLevee, "racineLevee");
    function bras(c, a, b, elbow, main, partie = "tout") {
      const sgn = a[0] < 24 ? -1 : 1;
      const w = c.armW, ht = w / 2 + 0.75;
      const nu = !!c.brasNu || c.sleeve === c.skin;
      const dx = ht * 0.5;
      const ul = unit(a, elbow || b), leve = ul[1] < -0.2 || ul[1] < 0.45 && ul[0] * sgn > 0.2;
      const s0 = leve ? a : [a[0] - sgn * (dx - 0.5), a[1] - 1.4 - 0.3 + Math.sqrt(ht * ht - dx * dx)];
      const brut = elbow ? [s0, elbow, b] : [s0, b];
      const tot = longueur(brut);
      const sansMain = main === "";
      const genre = nu ? "nu" : c.sleeves || "longue";
      const finManche = genre === "nu" ? tot - 1.2 : genre === "longue" ? tot - (sansMain ? 0.4 : 2.3) : genre === "court" ? Math.min(tot * 0.42, 7.2) : tot - Math.min(c.sleeveCut || 5, tot * 0.62);
      const manche = couper(brut, finManche);
      const hh = genre === "court" ? ht + 0.35 : genre === "longue" ? w / 2 + (sansMain ? 0.85 : 0.4) : genre === "nu" ? w / 2 - 0.1 : w / 2 + 0.45;
      const { G, D } = bords(manche, ht, hh);
      const fin = manche[manche.length - 1], u = unit(manche[manche.length - 2], fin);
      const bombe = hh * 0.5;
      const nrm = [-u[1], u[0]];
      const arc = /* @__PURE__ */ __name((k = 0, w0 = hh) => [add(add(fin, nrm, w0), u, -k), add(fin, u, bombe - k), add(add(fin, nrm, -w0), u, -k)], "arc");
      const arcD = /* @__PURE__ */ __name((k, w0) => {
        const [p, q, e] = arc(k, w0);
        return `M${pt(p)} Q${pt(q)} ${pt(e)}`;
      }, "arcD");
      const lev = leve ? racineLevee(a, sgn, manche, G, D, ht) : null;
      const forme = lev ? lev.forme(fin, u, bombe) : `M${pt(G[0])} ${G.slice(1).map((p) => `L${pt(p)}`).join(" ")} Q${pt(add(fin, u, bombe))} ${pt(D[D.length - 1])} ${D.slice(0, -1).reverse().map((p) => `L${pt(p)}`).join(" ")} A${r22(ht)} ${r22(ht)} 0 0 0 ${pt(G[0])} Z`;
      const gDehors = (G[0][0] - s0[0]) * sgn > 0;
      const Dh = gDehors ? G : D, Dd = gDehors ? D : G;
      const ligne = /* @__PURE__ */ __name((list) => "M" + list.map(pt).join(" L"), "ligne");
      const u0 = unit(brut[0], brut[1]), sommet = add(s0, u0, -ht);
      const tissu = nu ? c.skin : c.sleeve, ombre = ton(tissu, 0.8);
      let s = "";
      const derriere = partie !== "devant", devant = partie !== "derriere";
      const avantBras = genre !== "longue" && genre !== "nu";
      const fw = w * 0.8;
      if (derriere && avantBras) {
        const fd = ligne([add(fin, u, -1.6), b]);
        s += trait(fd, OUT, fw + W * 2) + trait(fd, c.skin, fw);
      }
      if (derriere) {
        s += `<path d="${forme}" fill="${tissu}"/>`;
        const gaucheG = G[0][0] < D[0][0];
        const dedansDe = /* @__PURE__ */ __name((cote, k) => {
          const e = bords(manche, ht - k, hh - k);
          return cote === "gauche" === gaucheG ? e.G : e.D;
        }, "dedansDe");
        if (!nu && manche.length >= 2) {
          s += trait(ligne(dedansDe("gauche", 0.75).slice(0, -1)), "#FFFFFF", 0.6, ' opacity=".32"');
          s += trait(ligne(dedansDe("droite", 0.9).slice(0, -1)), ombre, 0.9, ' opacity=".55"');
        }
        if (elbow && finManche > Math.hypot(elbow[0] - s0[0], elbow[1] - s0[1]) + 1) {
          const ue = unit(s0, elbow), uf = unit(elbow, b), dedans = unit([0, 0], [uf[0] - ue[0], uf[1] - ue[1]]);
          s += trait(`M${pt(add(add(elbow, ue, -1.4), dedans, w * 0.22))} Q${pt(add(elbow, dedans, w * 0.42))} ${pt(add(add(elbow, uf, 1.4), dedans, w * 0.22))}`, ombre, 0.55, ' opacity=".85"');
        }
        const arcDehors = `M${pt(sommet)} A${r22(ht)} ${r22(ht)} 0 0 ${gDehors ? 0 : 1} ${pt(Dh[0])}`;
        const arcDedans = `M${pt(sommet)} A${r22(ht)} ${r22(ht)} 0 0 ${gDehors ? 1 : 0} ${pt(Dd[0])}`;
        if (lev) {
          s += trait(lev.dessus, OUT, W) + trait(lev.dessous, OUT, W);
          s += trait(lev.emmanchure, ombre, 0.55, ' opacity=".85"');
        } else {
          s += trait(arcDehors + " " + ligne(Dh).replace("M", "L"), OUT, W);
          s += trait(arcDedans, ombre, 0.5, ' opacity=".8"');
        }
        if (!lev) s += trait(ligne([add(Dd[0], u0, 0.6), ...Dd.slice(1)]), OUT, W);
        if (genre === "torn") {
          const dents = [];
          for (let i = 0; i <= 8; i++) {
            const t = i / 8, x = -hh + 2 * hh * t, y = bombe * (1 - (2 * t - 1) ** 2) + (i % 2 ? 1.1 : -0.2) * (i && i < 8 ? 1 : 0);
            dents.push(add(add(fin, nrm, -x), u, y));
          }
          s += `<path d="M${dents.map(pt).join(" L")} L${pt(add(add(fin, nrm, hh), u, -1.5))} L${pt(add(add(fin, nrm, -hh), u, -1.5))} Z" fill="${tissu}"/>`;
          s += trait(ligne(dents), OUT, 0.85);
        } else if (!nu) {
          if (genre === "longue" && c.cuff) {
            const [a0, q0, e0] = arc(sansMain ? 2.4 : 1.7), [a1, q1, e1] = arc(0);
            s += `<path d="M${pt(a0)} Q${pt(q0)} ${pt(e0)} L${pt(e1)} Q${pt(q1)} ${pt(a1)} Z" fill="${c.cuff}" stroke="${OUT}" stroke-width="${r22(W * 0.7)}" stroke-linejoin="round"/>`;
          } else if (genre === "court") {
            if (c.cuff) s += trait(arcD(0.5), c.cuff, 1);
            s += trait(arcD(1.25, hh - 0.45), ombre, 0.45, ' opacity=".8"');
          }
          s += trait(arcD(0), OUT, W);
          if (sansMain && genre === "longue") {
            const [a1, q1, e1] = arc(0);
            s += `<path d="M${pt(a1)} Q${pt(q1)} ${pt(e1)} Q${pt(add(fin, u, bombe * 0.15))} ${pt(a1)} Z" fill="${ton(c.cuff || tissu, 0.55)}" stroke="${OUT}" stroke-width="${r22(W * 0.6)}" stroke-linejoin="round"/>`;
          }
        }
        if (avantBras) s += trait(`M${pt(add(add(fin, nrm, fw / 2), u, bombe * 0.6 + 0.2))} Q${pt(add(fin, u, bombe + 1.1))} ${pt(add(add(fin, nrm, -fw / 2), u, bombe * 0.6 + 0.2))}`, "rgba(0,0,0,.22)", 0.6);
        if (genre === "roll") {
          const hb = 1.25, mi = arcD(hb * 0.5, hh - 0.3);
          s += trait(mi, OUT, hb + W * 2) + trait(mi, c.cuff || tissu, hb);
          s += trait(arcD(hb * 0.75, hh - 0.9), "#FFFFFF", 0.45, ' opacity=".45"');
        }
      }
      if (!devant) return s;
      if (c.bandage && avantBras) {
        const screenLeft = a[0] < 24, charLeft = c.view === "ne" ? screenLeft : !screenLeft;
        if (c.bandage === "left" === charLeft) {
          const ub = unit(fin, b), at = /* @__PURE__ */ __name((k) => add(b, ub, -k), "at"), nb = [-ub[1], ub[0]], wb = fw + 0.7;
          s += trait(ligne([at(2.2), at(4.4)]), OUT, wb + W * 2) + trait(ligne([at(2.2), at(4.4)]), "#F4EEDF", wb);
          for (const k of [2.9, 3.7]) {
            const p = at(k);
            s += L(add(p, nb, wb * 0.48), add(add(p, nb, -wb * 0.48), ub, 0.5), "#C9BFA8", 0.45);
          }
          const t = at(4), e = add(add(t, nb, 2.2), ub, -0.4);
          s += L(t, e, OUT, 1.5) + L(t, e, "#F4EEDF", 0.7);
        }
      }
      return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : ""));
    }
    __name(bras, "bras");
    module.exports = { bras, REGLE: "manche" };
  }
});

// personnages/avatar.js
var require_avatar = __commonJS({
  "personnages/avatar.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, pivotPied, expression, arm, shoe, bareFoot, r2: r22, lerp, TRAITS, dechirure, filPendant } = require_troupe();
    var choix = require_avatar_choix();
    var { verifier, couleur, couleursAccessoire, tone, mix, hsl, clarte } = choix;
    var { couche, PORTE, capucheRabattue, reperes } = require_avatar_accessoires();
    var { bras } = require_manche();
    var { jambe, jambeCourte, tigeJambe } = require_jambe();
    var { tourner, groupe } = require_tour();
    var { avecOs } = require_membres();
    var TAILLE = { petite: 3.2, moyenne: 0, grande: -2 };
    var CORPS = {
      fine: { sw: 7.6, hw: 9.2, b: 0, arm: 3.4, legW: 5 },
      moyenne: { sw: 8.5, hw: 10.2, b: 0, arm: 3.8, legW: 5.4 },
      large: { sw: 10, hw: 11, b: 0, arm: 4.3, legW: 5.9 },
      ronde: { sw: 8.9, hw: 11.2, b: 1.8, arm: 4.1, legW: 6 }
    };
    function torso(k, hem = 46.6, dechire = null, dos = false) {
      const mx = (k.sw + k.hw) / 2 + k.b, my = (32.6 + hem) / 2;
      const bas = dechire ? dechirure([24 + k.hw, hem], [24, hem + 3], [24 - k.hw, hem], dechire).d : `Q24,${r22(hem + 3)} ${r22(24 - k.hw)},${hem}`;
      if (dos) {
        const e = k.sw + 1.1, y1 = 35.4;
        return `M${r22(24 - k.sw + 2.4)},31.5 Q24,30 ${r22(24 + k.sw - 2.4)},31.5 Q${r22(24 + e)},31.4 ${r22(24 + e)},${y1} Q${r22(24 + mx + 0.4)},${r22((y1 + hem) / 2)} ${r22(24 + k.hw)},${hem} ${bas} Q${r22(24 - mx - 0.4)},${r22((y1 + hem) / 2)} ${r22(24 - e)},${y1} Q${r22(24 - e)},31.4 ${r22(24 - k.sw + 2.4)},31.5 Z`;
      }
      return `M${r22(24 - k.sw)},32.6 Q24,30 ${r22(24 + k.sw)},32.6 Q${r22(24 + mx)},${r22(my)} ${r22(24 + k.hw)},${hem} ${bas} Q${r22(24 - mx)},${r22(my)} ${r22(24 - k.sw)},32.6 Z`;
    }
    __name(torso, "torso");
    var FACE = { front: { fx: 24, rx: 11.6 }, se: { fx: 22.6, rx: 11.2 } };
    function menton(d, fx, genre) {
      if (!genre || genre === "doux") return d;
      const [kx, dy] = { fin: [0.7, 0.6], fort: [1.06, 0.5], fendu: [1.05, 0.4], court: [1.03, -0.9] }[genre];
      return d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => {
        const t = Math.max(0, Math.min(1, (+y - 25.4) / 7));
        return t ? `${r22(fx + (+x - fx) * (1 + (kx - 1) * t))},${r22(+y + dy * t)}` : m;
      });
    }
    __name(menton, "menton");
    function faceD(v, forme = "rond", chin) {
      const { fx, rx } = FACE[v];
      const a = r22(fx - rx), b = r22(fx + rx);
      const low = forme === "ovale" ? `C${a},28.4 ${r22(fx - 4.8)},33.4 ${fx},33.4 C${r22(fx + 4.8)},33.4 ${b},28.4 ${b},21.6` : forme === "coeur" ? `C${a},27 ${r22(fx - 4)},32.4 ${fx},33.6 C${r22(fx + 4)},32.4 ${b},27 ${b},21.6` : forme === "carre" ? `C${a},28.6 ${r22(fx - 6.9)},32.3 ${fx},32.3 C${r22(fx + 6.9)},32.3 ${b},28.6 ${b},21.6` : forme === "anguleux" ? `C${a},27.2 ${r22(fx - 4.2)},31.1 ${r22(fx - 2.2)},31.9 Q${fx},32.6 ${r22(fx + 2.2)},31.9 C${r22(fx + 4.2)},31.1 ${b},27.2 ${b},21.6` : forme === "large" ? `C${a},29.2 ${r22(fx - 7.1)},32.6 ${fx},32.6 C${r22(fx + 7.1)},32.6 ${b},29.2 ${b},21.6` : chin && chin !== "doux" ? `C${a},29.4 ${r22(fx - 6.4)},32.4 ${fx},32.4 C${r22(fx + 6.4)},32.4 ${b},29.4 ${b},21.6` : `a${rx},10.4 0 1,0 ${r22(2 * rx)},0`;
      return `M${a},21.6 ${menton(low, fx, chin)} a${rx},10.4 0 1,0 ${r22(-2 * rx)},0 Z`;
    }
    __name(faceD, "faceD");
    var sousMoustache = /* @__PURE__ */ __name((o) => o.moustache !== "sans" || o.barbe === "pleine", "sousMoustache");
    function barbe(c, view, face, genre) {
      const { fx, rx } = FACE[view];
      const bas = sousMoustache(c.o) ? 1 : 0;
      const se = view === "se", mx = se ? 20.8 : 24;
      const a = r22(fx - rx), b = r22(fx + rx);
      const H = c.cheveux, S = tone(H, 0.7), HI = tone(H, 1.32), D = tone(H, 0.48);
      const id = `${c.uid}barb${view}`;
      const contour = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="${D}" stroke-width="0.75" stroke-linejoin="round"/>`, "contour");
      if (genre === "malRase") {
        const d = `M${a},22.6 C${r22(a + 1)},27.4 ${r22(mx - 4)},28.6 ${mx},29.2 C${r22(mx + 4)},28.6 ${r22(b - 1)},27.4 ${b},22.6 L${b},36 L${a},36 Z`;
        return clip(id, face, `<path d="${d}" fill="${S}" opacity=".32"/><path d="M${a},29 Q${mx},34.6 ${b},29 L${b},36 L${a},36 Z" fill="${S}" opacity=".22"/>`);
      }
      if (genre === "bouc") {
        const y = bas * 0.8, Y = /* @__PURE__ */ __name((v) => r22(v + y), "Y");
        const t2 = `M${r22(mx - 2.5)},${Y(29.1)} Q${r22(mx - 2.7)},${Y(28.1)} ${mx},${Y(28.3)} Q${r22(mx + 2.7)},${Y(28.1)} ${r22(mx + 2.5)},${Y(29.1)} Q${r22(mx + 2.4)},${Y(32.8)} ${mx},${Y(33.9)} Q${r22(mx - 2.4)},${Y(32.8)} ${r22(mx - 2.5)},${Y(29.1)} Z`;
        return `<path d="${t2}" fill="${H}"/>` + clip(`${id}b`, t2, `<rect x="${r22(mx - 3)}" y="${Y(31.6)}" width="6" height="3" fill="${S}"/>`) + `<path d="M${r22(mx - 0.9)},${Y(29.8)} Q${r22(mx - 1)},${Y(31.6)} ${r22(mx - 0.4)},${Y(33)} M${r22(mx + 0.9)},${Y(29.8)} Q${r22(mx + 1)},${Y(31.6)} ${r22(mx + 0.4)},${Y(33)}" fill="none" stroke="${S}" stroke-width=".5" stroke-linecap="round"/>` + L([mx - 1.5, 29.3 + y], [mx - 0.5, 29.1 + y], HI, 0.6) + contour(t2);
      }
      const { t, dy, yi: yi0 } = { collier: { t: 0.8, dy: 0.9, yi: 30.2 }, courte: { t: 1.3, dy: 1.9, yi: 29.4 }, pleine: { t: 1.3, dy: 2.4, yi: 29.2 } }[genre];
      const yi = yi0 + bas * 0.9;
      const tg = se ? t * 0.75 : t;
      const interieur = `M${r22(a + tg)},19 C${r22(a + tg)},23.4 ${r22(a + tg + 1.4)},26.6 ${r22(mx - 3.4)},28.2 Q${mx},${yi + 0.8} ${r22(mx + 3.4)},28.2 C${r22(b - t - 1.4)},26.6 ${r22(b - t)},23.4 ${r22(b - t)},19`;
      const yb = 32.2 + dy;
      const dessous = genre === "pleine" ? ` C${b},30.6 ${r22(mx + 7)},${r22(yb - 2)} ${r22(mx + 4.6)},${r22(yb - 0.6)} Q${r22(mx + 3.4)},${r22(yb + 0.7)} ${r22(mx + 1.7)},${r22(yb - 0.3)} Q${mx},${r22(yb + 1.4)} ${r22(mx - 1.7)},${r22(yb - 0.3)} Q${r22(mx - 3.4)},${r22(yb + 0.7)} ${r22(mx - 4.6)},${r22(yb - 0.6)} C${r22(mx - 7)},${r22(yb - 2)} ${a},30.6 ` : ` C${b},30.4 ${r22(mx + 6)},${r22(yb)} ${mx},${r22(yb)} C${r22(mx - 6)},${r22(yb)} ${a},30.4 `;
      const forme = interieur + ` L${b},19 L${b},24.4` + dessous + `${a},24.4 L${a},19 Z`;
      const meches2 = genre === "collier" ? "" : (genre === "pleine" ? [[-4.6, 29.6, -3.8, 32.8], [-2.2, 31, -1.8, 33.8], [2.2, 31, 1.8, 33.8], [4.6, 29.6, 3.8, 32.8], [0, 31.4, 0, 34.2]] : [[-3.8, 29.6, -3, 32.6], [0, 30.6, 0, 33.4], [3.8, 29.6, 3, 32.6]]).map(([x0, y0, x1, y1]) => `M${r22(mx + x0)},${y0} Q${r22(mx + (x0 + x1) / 2 + (x0 > 0 ? 0.4 : -0.4))},${r22((y0 + y1) / 2)} ${r22(mx + x1)},${y1}`).join(" ");
      return `<path d="${forme}" fill="${H}"/>` + clip(id, forme, `<path d="M${r22(a - 1)},31 Q${mx},${r22(yb + 3)} ${r22(b + 1)},31 L${r22(b + 1)},40 L${r22(a - 1)},40 Z" fill="${S}"/>` + (meches2 ? `<path d="${meches2}" fill="none" stroke="${S}" stroke-width=".55" stroke-linecap="round"/>` : "") + `<path d="M${r22(a + tg + 0.6)},25.4 Q${r22(a + tg + 1.4)},28 ${r22(mx - 4.4)},29.6" fill="none" stroke="${HI}" stroke-width=".6" stroke-linecap="round" opacity=".8"/>`) + contour(forme);
    }
    __name(barbe, "barbe");
    function moustache(c, view, genre) {
      const se = view === "se";
      const mx = se ? 20.8 : 24, my = 26.2;
      const H = c.cheveux, S = tone(H, 0.66), HI = tone(H, 1.3);
      const aile = /* @__PURE__ */ __name((k) => {
        const w = (genre === "fine" ? 2.6 : genre === "guidon" ? 2.8 : genre === "gauloise" ? 3.6 : 3) * (se && k < 0 ? 0.78 : 1);
        const X = /* @__PURE__ */ __name((v) => r22(mx + k * v), "X");
        if (genre === "fine") return `M${X(0.2)},${r22(my - 0.3)} Q${X(w * 0.6)},${r22(my - 0.6)} ${X(w)},${r22(my + 0.3)} Q${X(w * 0.55)},${r22(my + 0.1)} ${X(0.2)},${r22(my + 0.25)} Z`;
        if (genre === "guidon") return `M${X(0.2)},${r22(my - 0.4)} Q${X(w * 0.6)},${r22(my - 0.7)} ${X(w)},${r22(my + 0.1)} Q${X(w + 1.1)},${r22(my - 0.2)} ${X(w + 0.9)},${r22(my - 1.5)} Q${X(w + 0.4)},${r22(my - 0.6)} ${X(w * 0.85)},${r22(my + 0.55)} Q${X(w * 0.5)},${r22(my + 0.3)} ${X(0.2)},${r22(my + 0.35)} Z`;
        if (genre === "gauloise") return `M${X(0.2)},${r22(my - 0.9)} Q${X(w * 0.7)},${r22(my - 1.2)} ${X(w)},${r22(my + 0.6)} Q${X(w + 0.3)},${r22(my + 2.4)} ${X(w - 0.2)},${r22(my + 3)} Q${X(w - 1.2)},${r22(my + 1.4)} ${X(w * 0.45)},${r22(my + 0.7)} Q${X(0.4)},${r22(my + 0.6)} ${X(0.2)},${r22(my + 0.5)} Z`;
        return `M${X(0.2)},${r22(my - 0.9)} Q${X(w * 0.7)},${r22(my - 1.1)} ${X(w)},${r22(my + 0.7)} Q${X(w * 0.55)},${r22(my + 0.6)} ${X(0.2)},${r22(my + 0.55)} Z`;
      }, "aile");
      const d = aile(-1) + " " + aile(1);
      const poils = genre === "fine" ? "" : [-1, 1].map((k) => [0.8, 1.6, 2.4, 3.2].map((v, i) => `<path d="M${r22(mx + k * v)},${r22(my - 0.6)} q${r22(k * 0.6)},${r22(0.5)} ${r22(k * 0.9)},${r22(1.2 + (genre === "gauloise" ? i * 0.3 : 0))}" stroke="${i % 2 ? S : tone(H, 0.5)}" stroke-width=".35" stroke-linecap="round" fill="none" opacity=".75"/>`).join("")).join("");
      return P(d, H, 0) + clip(`${c.uid}mst${view}`, d, `<rect x="${mx - 6}" y="${r22(my + 0.15)}" width="12" height="4" fill="${S}"/>` + poils) + L([mx - 1.8, my - 0.3], [mx - 0.8, my - 0.5], HI, 0.5) + L([mx + 0.8, my - 0.5], [mx + 1.8, my - 0.3], HI, 0.5) + P(d, "none", 0.55);
    }
    __name(moustache, "moustache");
    var BACK = {
      front: "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z",
      se: "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z",
      ne: "M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.2,27 34.6,28.8 Q24,31 13.4,28.8 Q10.8,27 11,21 Z"
    };
    var BOB = {
      front: "M10.6,21.6 C10.2,11.6 15.4,6.6 24,6.6 C32.6,6.6 37.8,11.6 37.4,21.6 Q37.9,27.2 36.9,29.7 Q35.8,31.3 33.6,30.9 L14.4,30.9 Q12.2,31.3 11.1,29.7 Q10.1,27.2 10.6,21.6 Z",
      se: "M11.4,21.6 C11,11.6 15.8,6.8 24.4,6.8 C33,6.8 38.6,11.6 38.2,21.6 Q38.7,27.2 37.7,29.7 Q36.6,31.3 34.4,30.9 L15,30.9 Q12.8,31.3 11.9,29.7 Q10.9,27.2 11.4,21.6 Z"
    };
    var BANGS = {
      front: "M12,19.4 Q11.6,9.6 24,9.2 Q36.4,9.6 36.2,18.6 Q33.4,13.8 28.4,13.4 Q25.4,15.6 21.6,15.2 Q17.4,15 14.6,17.4 Q12.8,18.6 12,19.4 Z",
      se: "M11.4,19.4 Q11,9.6 23,9 Q35,9.4 35.4,18 Q32.6,13.6 27.6,13.2 Q24.6,15.4 20.6,15 Q16.6,14.8 13.8,17.2 Q12.2,18.4 11.4,19.4 Z"
    };
    var sx = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
    var mirror = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(48 - x)},${y}`), "mirror");
    var FRANGE = {
      // carré : frange droite, coupée net au-dessus des sourcils
      carre: "M12.2,19 C11.6,12.4 16,9.2 24,9.2 C32,9.2 36.4,12.4 35.8,19 Q35.3,17.3 34,16.7 Q32.7,17.6 31.3,16.9 Q29.7,17.8 28.1,16.9 Q26.3,17.8 24.5,16.9 Q22.7,17.8 20.9,16.9 Q19.2,17.8 17.6,16.9 Q16.1,17.6 14.6,16.7 Q12.9,17.1 12.2,19 Z",
      // mèche : une grande mèche qui part du sommet et retombe sur le côté du front
      meche: "M12.4,18.4 Q10.8,8.4 22.4,7.4 Q31,6.4 35,9.8 Q37.2,12.4 36,18 Q34.6,14.4 31.4,13.4 Q25.4,12.6 20.4,14.2 Q15.8,15.6 12.4,18.4 Z",
      // en bataille : frange en pointes
      bataille: "M12.2,19.2 Q11.6,9.6 24,9.2 Q36.4,9.6 36,18.8 L33.8,15 L32.2,17.4 L29.8,13.6 L27.6,16.6 L25,13.4 L22.6,16.8 L20.2,13.8 L17.8,17 L15.6,14.4 L14,17.6 Z"
    };
    FRANGE.deuxChignons = FRANGE.carre;
    var COURTES = /* @__PURE__ */ new Set(["courte", "meche", "degrade", "banane", "raie", "herisse", "boucleeCourte", "chignonHomme", "pixie"]);
    var TONDUES = /* @__PURE__ */ new Set(["degrade", "herisse", "boucleeCourte", "chignonHomme"]);
    var COURT_BACK = {
      front: "M12.2,17.8 C11.8,10.6 16.2,6.6 24,6.6 C31.8,6.6 36.2,10.6 35.8,17.8 Q35.4,19 34.6,19 L13.4,19 Q12.6,19 12.2,17.8 Z",
      se: "M12.8,17.8 C12.2,10.6 16.4,6.8 24,6.8 C32.2,6.8 37.2,10.6 36.8,17.8 Q36.4,19 35.6,19 L14,19 Q13.2,19 12.8,17.8 Z"
    };
    var COURT_DOS = "M11.2,19.6 C10.8,11 15.4,6.2 24,6.2 C32.6,6.2 37.2,11 36.8,19.6 Q36.6,23.8 34.2,26.2 Q30.8,27.8 27.6,27.4 Q25.8,29 24,29.4 Q22.2,29 20.4,27.4 Q17.2,27.8 13.8,26.2 Q11.4,23.8 11.2,19.6 Z";
    var TONDU_DOS = "M11.6,18.4 C11.2,10.6 15.6,6.2 24,6.2 C32.4,6.2 36.8,10.6 36.4,18.4 Q35.6,21.8 32,23 Q28,23.8 24,23.8 Q20,23.8 16,23 Q12.4,21.8 11.6,18.4 Z";
    var MECHE_DOS = "M11.2,19.6 C10.8,11 15.2,6.2 23,6 C30.4,5.6 35.8,8 37.4,12.8 Q38.2,16.2 36.8,19.6 Q36.6,23.8 34.2,26.2 Q30.8,27.8 27.6,27.4 Q25.8,29 24,29.4 Q22.2,29 20.4,27.4 Q17.2,27.8 13.8,26.2 Q11.4,23.8 11.2,19.6 Z";
    var RAIE_DOS = "M11.2,19.6 C10.8,11 15.4,6.2 24,6.2 C32.6,6.2 37.2,11 36.8,19.6 Q36.8,24.2 35,26.4 Q30,28 24,28 Q18,28 13,26.4 Q11.2,24.2 11.2,19.6 Z";
    var BANANE_DOS = "M11.4,19.4 C11,9.6 15.4,4.6 24,4.4 C32.6,4.6 37,9.6 36.6,19.4 Q36.2,23.4 33.4,25.2 Q28.6,26.6 24,26.6 Q19.4,26.6 14.6,25.2 Q11.8,23.4 11.4,19.4 Z";
    var BATAILLE_DOS = "M11.2,19.6 C10.6,12 13.6,7.4 18.6,6.4 L18.2,5.2 L21.2,6 L23.6,4.8 L25.4,6 L28.4,5.2 L28.8,6.8 Q35.4,8.4 36.8,15 L38.6,16.6 L36.9,18.6 Q37.2,22.6 35.6,24.8 L37.2,27.2 L34.4,27 Q33.2,28.6 31.2,28 L31.6,30.4 L29,28.8 Q27.4,30.2 26,29.4 L24.6,31.2 L23.4,29.4 Q21.6,30.4 20,28.8 L17.4,30.4 L17.4,27.8 Q15,28.4 13.8,26.6 L11,27.2 L12.4,24.8 Q11,22.6 11.2,19.6 Z";
    var HERISSE_DOS = "M11.6,18.4 C11.4,13 12.6,10 14.4,8.6 L13.6,6.2 L16.6,7.2 L17.4,4.8 L19.8,6.2 L21.6,4.4 L23.4,6 L25.4,4.2 L26.8,6 L29.2,4.6 L30,6.8 L32.8,5.8 L32.8,8 L35.6,8.4 Q36.8,12.6 36.4,18.4 Q35.6,21.8 32,23 Q28,23.8 24,23.8 Q20,23.8 16,23 Q12.4,21.8 11.6,18.4 Z";
    var PIXIE_DOS = "M11,19.6 C10.6,10.8 15.4,6 24,6 C32.6,6 37.4,10.8 37,19.6 Q37,24 35.6,26.4 Q34.6,29.6 32.4,31.2 Q32.2,28.4 30.6,27.6 Q27.6,28.6 24,28.4 Q20.4,28.6 17.4,27.6 Q15.8,28.4 15.6,31.2 Q13.4,29.6 12.4,26.4 Q11,24 11,19.6 Z";
    var CRANE_DOS = "M11.6,19.4 C11.2,10.8 15.6,7.4 24,7.4 C32.4,7.4 36.8,10.8 36.4,19.4 Q36.3,24.4 33.4,27.8 Q31.4,29.8 29.6,30.6 L29.8,34.4 L18.2,34.4 L18.4,30.6 Q16.6,29.8 14.6,27.8 Q11.7,24.4 11.6,19.4 Z";
    var TEMPE = "M12.4,19.6 Q12.1,15.2 14.2,12.6 L15.6,15.2 Q14.4,17 14.2,19.6 Z";
    FRANGE.degrade = "M13.4,18.2 Q12.6,8.6 24,7.8 Q35.4,8.6 34.6,18.2 Q33.8,13.8 30.4,12.6 Q24,11.2 17.6,12.6 Q14.2,13.8 13.4,18.2 Z";
    FRANGE.banane = "M13,18.8 Q12.2,10.2 17.4,8.4 Q19.6,4.6 26.6,4.8 Q33.2,5.2 33.8,8.6 Q36,10.6 35.2,18.8 Q34.2,14.4 30.8,13.2 Q27.2,11.6 22.8,12.6 Q17.2,13.4 14.6,15.4 Q13.4,16.6 13,18.8 Z";
    FRANGE.raie = "M12.4,19.2 Q11.8,9 21.6,8.2 L22.8,8.4 Q34.2,8.4 35.8,18.8 Q34,13.2 28.2,12.4 Q24.4,12.2 21.8,10.8 Q19.8,13.2 15.8,14.6 Q13.2,16.4 12.4,19.2 Z";
    FRANGE.herisse = "M13.2,18.4 Q12.6,10.8 14.6,9.4 L13.8,6.8 L17.4,8.2 L18.4,5.6 L21.4,7.6 L23.6,5 L25.8,7.4 L29,5.4 L29.8,8 L33.4,6.8 L33.4,9.4 Q35.4,10.8 34.8,18.4 Q33.8,13.4 29.6,12.8 Q24,11.8 18.4,12.8 Q14.2,13.4 13.2,18.4 Z";
    FRANGE.chignonHomme = "M13,19 Q12.2,8.8 24,8.2 Q35.8,8.8 35,19 Q34,13.6 29.2,12.6 Q24,11.8 18.8,12.6 Q14,13.6 13,19 Z";
    FRANGE.boucleeCourte = FRANGE.degrade;
    FRANGE.courte = "M12.8,18.2 Q12,8.6 24,8 Q36,8.6 35.2,18.2 Q34.6,15 32.8,13.6 L31.2,14.6 L30,12.6 L28.2,13.8 L26.8,12 L25,13.4 L23.4,11.8 L21.8,13.4 L20,12.2 L18.6,14 L16.8,12.8 L15.6,14.8 Q13.6,15.4 12.8,18.2 Z";
    var SENS_FRANGE_COURTE = "M17.6,13 Q19,10 22.4,9 M22.6,12.4 Q24,9.4 27.4,9.2 M27.8,12.8 Q30,10.6 32.6,12";
    FRANGE.pixie = "M12.8,18.4 C12,10.6 16.4,7.4 24,7.4 C31.6,7.4 36.2,10.8 35.4,17 Q35,19 33.6,19.8 Q32.6,16.2 29.4,14.8 Q24.4,12.8 19.6,13.4 Q17,13.8 16,12.6 Q14,14.8 12.8,18.4 Z";
    FRANGE.tresseCote = FRANGE.pixie;
    FRANGE.demiQueue = "M12.4,19 C11.6,11 16.4,7.6 24,7.6 C31.6,7.6 36.4,11 35.6,19 Q35,14.4 31.6,12.4 Q28,10.8 24,10.8 Q20,10.8 16.4,12.4 Q13,14.4 12.4,19 Z";
    FRANGE.puffs = "M12.8,18.6 C12,10.8 16.4,8 24,8 C31.6,8 36,10.8 35.2,18.6 Q34.2,14 31,12.6 Q27.6,11.4 24,11.4 Q20.4,11.4 17,12.6 Q13.8,14 12.8,18.6 Z";
    var SENS_NOUVELLES = {
      pixie: "M17.2,10.6 Q24,9.8 30.6,13.6 Q32.8,15.2 33.4,18 M19.8,9.2 Q27,9.2 32.6,12.8 M16.6,12.2 Q15,13.6 14.2,16",
      demiQueue: "M16.4,14 Q18,10.6 22.2,9 M24,10.6 L24,8.2 M31.6,14 Q30,10.6 25.8,9",
      puffs: "M17,13.4 Q16.2,10.8 15.2,9 M31,13.4 Q31.8,10.8 32.8,9 M24,11.2 L24,8.6"
    };
    SENS_NOUVELLES.tresseCote = SENS_NOUVELLES.pixie;
    var DUVET_PUFFS = "M13.6,16.4 Q15,15.4 15.2,16.8 Q15.2,17.8 16.4,17.4 M34.4,16.4 Q33,15.4 32.8,16.8 Q32.8,17.8 31.6,17.4";
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
    var bouclette = /* @__PURE__ */ __name((x, y, r, c) => `<path d="M${r22(x - r)},${r22(y - r * 0.1)} Q${r22(x - r * 0.9)},${r22(y + r * 0.95)} ${x},${r22(y + r)} Q${r22(x + r * 0.9)},${r22(y + r * 0.95)} ${r22(x + r)},${r22(y - r * 0.1)}" fill="none" stroke="${tone(c.hair, 0.68)}" stroke-width=".6" stroke-linecap="round"/><path d="M${r22(x - r * 0.7)},${r22(y - r * 0.55)} Q${x},${r22(y - r * 1.05)} ${r22(x + r * 0.7)},${r22(y - r * 0.55)}" fill="none" stroke="${tone(c.hair, 1.22)}" stroke-width=".5" stroke-linecap="round"/>`, "bouclette");
    function curls(cx, cy, rx, ry, n, bumps = 1.9) {
      let d = "";
      for (let i = 0; i <= n; i++) {
        const t = i / n * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
        if (i === 0) {
          d += `M${r22(x)},${r22(y)}`;
          continue;
        }
        const tm = (i - 0.5) / n * Math.PI * 2 - Math.PI / 2;
        d += ` Q${r22(cx + Math.cos(tm) * (rx + bumps))},${r22(cy + Math.sin(tm) * (ry + bumps))} ${r22(x)},${r22(y)}`;
      }
      return d + " Z";
    }
    __name(curls, "curls");
    function tresse(p0, p1, p2, n, w, c, bout = true) {
      const at = /* @__PURE__ */ __name((t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * t * (1 - t) * p1[k] + t * t * p2[k]), "at");
      const axe = /* @__PURE__ */ __name((t) => {
        const d = [0, 1].map((k) => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k]));
        return Math.atan2(-d[0], d[1]) * 180 / Math.PI;
      }, "axe");
      const long = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]) * (1 + Math.hypot(p1[0] - (p0[0] + p2[0]) / 2, p1[1] - (p0[1] + p2[1]) / 2) / 40), h = long / n;
      let s = "";
      for (let i = n - 1; i >= 0; i--) {
        const t = (i + 0.5) / n, [x, y] = at(t), side = i % 2 ? 1 : -1, wi = r22(w * (1 - 0.3 * t)), hy = r22(h * 0.66);
        const ecu = `M${-wi},${r22(-hy * 0.35)} Q${-wi},${r22(hy * 0.7)} 0,${hy} Q${wi},${r22(hy * 0.7)} ${wi},${r22(-hy * 0.35)} Q${r22(wi * 0.9)},${-hy} 0,${-hy} Q${r22(-wi * 0.9)},${-hy} ${-wi},${r22(-hy * 0.35)} Z`;
        s += `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(axe(t))})">` + P(ecu, i % 2 ? tone(c.cheveux, 0.92) : c.hair, 0.65) + P(`M${r22(-side * wi * 0.62)},${r22(-hy * 0.62)} Q${r22(-side * wi * 0.1)},${r22(hy * 0.1)} ${r22(side * wi * 0.16)},${r22(hy * 0.86)}`, "none", 0.42) + L([side * wi * 0.42, -hy * 0.5], [side * wi * 0.5, -hy * 0.05], c.hairH, 0.55) + "</g>";
      }
      if (!bout) return s;
      const [bx, by] = at(1), a = axe(1);
      return s + `<g transform="translate(${r22(bx)} ${r22(by + 0.3)}) rotate(${r22(a)})">` + P("M-1.1,0.2 Q-1.9,1.8 -1.5,3 Q-0.8,2.2 -0.3,2.4 Q0,3.6 0.4,3.6 Q0.7,2.4 1.4,2.8 Q1.8,1.6 1.1,0.2 Z", c.hair, 0.7) + E(0, 0, r22(w * 0.6), 0.9, c.tie, 0.7) + L([-0.6, -0.4], [0.2, -0.5], tone(c.tie, 1.35), 0.5) + "</g>";
    }
    __name(tresse, "tresse");
    function lock(p0, p1, p2, w, c, bague = false) {
      const at = /* @__PURE__ */ __name((t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * t * (1 - t) * p1[k] + t * t * p2[k]), "at");
      const nrm = /* @__PURE__ */ __name((t) => {
        const d2 = [0, 1].map((k) => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k])), l = Math.hypot(d2[0], d2[1]);
        return [-d2[1] / l, d2[0] / l];
      }, "nrm");
      const pt = /* @__PURE__ */ __name((t, k) => {
        const [x, y] = at(t), [nx, ny] = nrm(t), wi = w * Math.min(1, 0.5 + t * 3.5) * (1 - 0.3 * t) * k;
        return [x + nx * wi, y + ny * wi];
      }, "pt");
      const f = /* @__PURE__ */ __name(([x, y]) => `${r22(x)},${r22(y)}`, "f"), ts = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1];
      const w1 = r22(w * 0.7);
      const d = `M${ts.map((t) => f(pt(t, 1))).join(" L")} A${w1},${w1} 0 0,1 ${f(pt(1, -1))} L${ts.slice().reverse().map((t) => f(pt(t, -1))).join(" L")} Z`;
      const travers = /* @__PURE__ */ __name((t, k = 0.75) => `M${f(pt(t, k))} Q${f(at(t + 0.035))} ${f(pt(t, -k))}`, "travers");
      return P(d, c.hair, 0.6) + `<path d="${[0.42, 0.7].map((t) => travers(t)).join(" ")}" fill="none" stroke="${c.hairS}" stroke-width=".55" stroke-linecap="round"/>` + L(pt(0.16, -0.4), pt(0.4, -0.4), c.hairH, 0.55) + (bague ? P(`M${f(pt(0.6, 1.08))} L${f(pt(0.68, 1.08))} L${f(pt(0.68, -1.08))} L${f(pt(0.6, -1.08))} Z`, "#E2B64A", 0.5) : "");
    }
    __name(lock, "lock");
    var LOCK_G = [[[12.6, 15.6], [10.4, 24], [11.2, 33.2], 1.65, false], [[15, 16.8], [13.6, 24.6], [14.4, 31], 1.5, true]];
    var LOCKS = {
      front: LOCK_G.concat(LOCK_G.map(([a, b, e, w, g]) => [[48 - a[0], a[1]], [48 - b[0], b[1]], [48 - e[0], e[1]], w, !g])),
      se: [[[12.6, 16.6], [10.8, 24], [11.4, 31.4], 1.5, false], [[33.8, 16], [36.6, 25], [36.6, 33.6], 1.65, true]]
    };
    var allonge = /* @__PURE__ */ __name((l, k) => l.map(([a, b, e, w, g]) => [a, [b[0], b[1] + k * 0.5], [e[0], e[1] + k], w, g]), "allonge");
    var LOCKS_LONGUES = {
      front: allonge(LOCKS.front, 5.4).concat([[[11.6, 19], [9.4, 28], [9.8, 36], 1.45, false], [[36.4, 19], [38.6, 28], [38.2, 36], 1.45, false]]),
      se: allonge(LOCKS.se, 5.4).concat([[[35.8, 18.4], [38.4, 27], [38.4, 36.4], 1.45, false]])
    };
    var LOCKS_DERRIERE = [[12.4, 22, 35.4], [35.6, 22, 35.4]];
    var LOCKS_DOS = [[13, 34.6], [16.6, 37.4], [20.3, 38.6], [24, 37.6], [27.7, 38.8], [31.4, 37.2], [35, 34.4]];
    var dosLock = /* @__PURE__ */ __name((c, [x, y1], i) => {
      const y0 = 6.4 + ((x - 24) / 13) ** 2 * 14.6 + 5.4;
      return lock([x, y0], [x + (x - 24) * 0.12, (y0 + y1) / 2], [x + (x - 24) * 0.06, y1], 1.75, c, i === 1 || i === 5);
    }, "dosLock");
    var LOCKS_HAUT = "M17.4,10.4 Q16.4,13.4 16.8,16.6 M21.6,9.6 Q21,12.6 21.4,15.4 M26.4,9.8 Q26.8,12.4 26.4,14.4 M31,11 Q32,13.4 32.4,15.6";
    function pointesBas(xd, xg, y, n, v = 1.6) {
      const w = (xd - xg) / n, mid = (xd + xg) / 2, half = (xd - xg) / 2;
      const prof = /* @__PURE__ */ __name((x) => y + v * (1 - ((x - mid) / half) ** 2), "prof");
      let d = "";
      for (let i = 0; i < n; i++) {
        const x0 = xd - w * i, x1 = x0 - w, xm = x0 - w / 2, yt = prof(xm) + 1;
        d += ` Q${r22(x0 - w * 0.12)},${r22(yt - 0.3)} ${r22(xm - w * 0.06)},${r22(yt)} Q${r22(x1 + w * 0.3)},${r22(yt - 0.6)} ${r22(x1)},${r22(prof(x1) - 0.5)}`;
      }
      return d;
    }
    __name(pointesBas, "pointesBas");
    var MILONGUE = {
      front: "M10.6,21.6 Q9.8,7 24,6.6 Q38.2,7 37.4,21.6 Q37.6,28.6 39.6,32.6 Q37,33.8 35.2,32.2 L12.8,32.2 Q11,33.8 8.4,32.6 Q10.4,28.6 10.6,21.6 Z",
      se: "M11.2,21.6 Q10.2,7 24,6.8 Q38.8,7 38.2,21.6 Q38.4,28.6 40.4,32.6 Q37.8,33.8 36,32.2 L13.6,32.2 Q11.8,33.8 9.4,32.6 Q11,28.6 11.2,21.6 Z",
      ne: "M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z"
    };
    var MECHE_LONGUE = "M14.4,15 Q9.6,22 10.6,31.4 Q11,33.6 12.2,34.8 Q12.6,32.6 14.2,31.2 Q13.4,22 15.6,17.6 Z";
    var MECHE_MILONGUE = "M14.4,15 Q10,21.6 11,28.4 Q10.4,30.4 9.2,31.4 Q12.2,31.4 13.8,29.6 Q13.4,22 15.6,17.6 Z";
    var MECHE_ONDULEE = "M14.4,15 Q9.8,18.6 11.2,22.6 Q12.6,26.4 10.4,30 Q9.2,33.2 11.6,35.6 Q12.4,33.2 14,31.8 Q15.6,28.4 13.6,24.8 Q12.6,21.4 15.6,17.6 Z";
    var QUEUE_COTE = "M32.4,27.4 C36.8,27.6 38.6,30.6 38.1,34.4 C37.6,38.2 35.4,40.8 33.2,42.4 Q33.6,40.2 33,39 Q32,40.4 30.8,41 C32.6,38 33.8,35 33.4,32.4 Q33.1,30.2 32.2,29.4 Z";
    var QUEUE_COTE_SENS = "M34.4,30 Q36.6,34 34.4,39.6 M33.6,31.8 Q34.6,35.4 32.4,39.4";
    var SENS_FRANGE = {
      defaut: "M24.6,9.8 Q19.4,11.4 16,16.6 M26.4,9.8 Q23,12.4 21.8,15 M28.2,10 Q32,11.6 34.4,16",
      carre: "M17.4,11.2 Q16.8,13.8 17.6,16.4 M22.6,10 Q22,13.4 22.6,16.6 M27.2,10.2 Q27.8,13.4 27.2,16.6 M31.4,11.4 Q32,13.8 31.2,16.4",
      meche: "M30.6,9.2 Q25.2,10.4 21,15 M27.4,8.4 Q21.6,10.2 16.2,16.8",
      bataille: "M18,12.6 L17.8,16.4 M22.6,12 L22.6,16.2 M27.4,12.4 L27.6,16 M31.8,13.2 L32.2,16.6",
      degrade: "M18.4,12.4 Q21,9.4 24,8.8 M24,12 Q25.4,9.2 29.6,9.6 M29.6,12.6 Q31.6,11 33.2,13.4",
      banane: "M15.4,14.4 Q17,8.6 22.6,6.4 M20.6,12.6 Q22.6,7.6 28.2,6.4 M25.6,12.2 Q28.4,8 32.6,7.6 M30.4,13 Q32.6,10.6 34.4,12.6",
      raie: "M21.8,9.2 Q18,10.8 15.2,15.4 M21.8,9.4 Q26.6,9.2 31,11.2 M24.8,9.6 Q30.6,10.6 34.4,16",
      herisse: "M17.6,12.4 L17.8,9.2 M21.2,12 L21.4,8 M24.4,11.8 L24,7.2 M27.6,12 L27.6,8 M31,12.6 L31.2,9.4",
      chignonHomme: "M17.4,12.6 Q19.4,9.6 22.4,8.8 M24,12 L24,8.6 M30.6,12.6 Q28.6,9.6 25.6,8.8"
    };
    var sensFrange = /* @__PURE__ */ __name((coupe) => coupe === "locks" || coupe === "locksLongues" ? LOCKS_HAUT : SENS_NOUVELLES[coupe] ? SENS_NOUVELLES[coupe] : coupe === "carre" || coupe === "deuxChignons" ? SENS_FRANGE.carre : coupe === "boucleeCourte" ? SENS_FRANGE.degrade : coupe === "courte" ? SENS_FRANGE_COURTE : SENS_FRANGE[coupe] || SENS_FRANGE.defaut, "sensFrange");
    var TIRES = "M11.2,19.6 C10.8,11 15.4,6.2 24,6.2 C32.6,6.2 37.2,11 36.8,19.6 Q36.6,23.8 34.4,26.4 Q31.6,28.4 28.2,28.2 Q26,28.6 24,29.6 Q22,28.6 19.8,28.2 Q16.4,28.4 13.6,26.4 Q11.4,23.8 11.2,19.6 Z";
    var TIRES_PLEIN = "M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.2,29.8 36.2,32.6 Q24,35 11.8,32.6 Q10.8,29.8 11,21 Z";
    var RAIE = "M24,7.4 L24,29.4";
    var DOS = {
      courte: { forme: COURT_DOS, sens: "M23.4,9.6 Q18.6,15 17.8,26.4 M25.2,9.4 Q24.6,18 24,28 M27,9.8 Q31,15.6 30.8,26.4" },
      meche: { forme: MECHE_DOS, sens: "M13.4,15.6 Q20.6,8.4 33.4,9.6 M12.6,20.4 Q21,13.4 36,15.8 M14.4,25 Q22,19.4 35.4,21.6 M19.6,27.6 Q25,24.4 31.6,26" },
      degrade: { forme: TONDU_DOS, sens: "M22,9.6 Q19.4,14 18.6,24 M24,9 L24,25.6 M26,9.6 Q28.6,14 29.4,24" },
      banane: { forme: BANANE_DOS, sens: "M21.6,5.6 Q19.4,10 20.6,15.4 M26.4,5.6 Q28.6,10 27.4,15.4 M14,19.6 Q17.4,16.4 21.4,17.4 M34,19.6 Q30.6,16.4 26.6,17.4" },
      raie: { forme: RAIE_DOS, sens: "M19.4,6.6 Q18.8,9.4 18.8,12.4 M18.8,12.4 Q14.6,15.4 13.6,22 M20,9 Q28.4,10 33.6,17.6 M19.6,14 Q26.4,17.4 30.8,25.4" },
      herisse: { forme: HERISSE_DOS, sens: "M16.8,8.6 L18.6,13.6 M21.6,5.8 L22.2,12 M25.4,5.6 L25,12 M29.4,6.2 L28.2,13 M32.8,8 L30.8,14 M18,17.6 Q24,19.8 30,17.6" },
      boucleeCourte: { forme: TONDU_DOS, sens: "M22,10 Q20,15 19.4,24 M26,10 Q28,15 28.6,24" },
      chignonHomme: { forme: TONDU_DOS, sens: "M16.4,22.6 Q17,14 21.6,10 M24,26.6 Q23.6,17 24,10.4 M31.6,22.6 Q31,14 26.4,10" },
      bataille: {
        forme: BATAILLE_DOS,
        sens: "M20.4,7.4 Q17.4,12 16.6,20.6 M24.2,5.6 Q24.8,14 24.4,26.6 M28.4,7.4 Q32.6,12 32.6,20.6 M15.4,22.4 L13.6,26.2 M33,22.4 L35,26.4 M20.6,24.6 L19.4,28.6 M28,24.6 L29.4,28.6"
      },
      carre: {
        forme: "M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.9,27.6 37.6,30.6 Q37.2,33 34.6,33.2 Q29.4,33.9 24,33.7 Q18.6,33.9 13.4,33.2 Q10.8,33 10.4,30.6 Q10.1,27.6 10.8,21 Z",
        sens: "M21.6,9.8 Q16.6,17 16.4,29.6 M24.4,9.4 Q24.9,19 24.2,30.8 M27.4,9.8 Q32,17 32,29.6 M18.4,12.4 Q13.4,19 13.4,29.4 M30.4,12.4 Q35,19 34.8,29.4",
        detail: "M11.8,30.4 Q17.6,32.4 24,32.2 Q30.4,32.4 36.2,30.4"
        // le bas du carré, qui rentre
      },
      milongue: {
        forme: "M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z",
        sens: "M21.4,9.8 Q16.6,18 15.8,32 M24.6,9.4 Q25.2,20 24.4,33.4 M27.8,9.8 Q32.6,18 32.6,32"
      },
      longue: {
        forme: "M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.7,28 36.9,32 Q37.8,35.4 37,38.4" + pointesBas(37, 11, 38.4, 7) + " Q10.2,35.4 11.1,32 Q10.3,28 11,21 Z",
        sens: "M21.4,9.8 Q16.4,20 16.8,38.6 M24.4,9.4 Q25.4,22 24,40.4 M27.6,9.8 Q32.4,20 31.4,38.6 M18.6,12 Q13.4,22 14.2,37.6 M30,12 Q35,22 34,37.6"
      },
      ondulee: {
        forme: "M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q38.8,25.4 37,29.2 Q39,33.2 37,37 Q35.8,40.6 32.2,40.2 Q28.2,42 24,40.6 Q19.8,42 15.8,40.2 Q12.2,40.6 11,37 Q9,33.2 11,29.2 Q9.2,25.4 11,21 Z",
        sens: "M21.2,9.8 Q17.4,15 18.8,21.6 Q20,28 17.2,34.6 Q16.2,37.6 17.6,39.6 M24.6,9.4 Q26,16 24,23 Q22.4,30 24.8,39.8 M28,9.8 Q31.6,15 29.6,21.6 Q28.2,28 31,34.6 Q32,37.6 30.6,39.6"
      },
      queue: { forme: TIRES, sens: "M14.4,25.4 Q15.4,17.6 21.6,14.2 M33.6,25.4 Q32.6,17.6 26.4,14.2 M19.6,28.6 Q20.4,20 23,15.4 M28.4,28.6 Q27.6,20 25,15.4" },
      queueCote: { forme: TIRES, sens: "M25.4,7.8 Q18.6,10.8 14.8,26.6 M30.2,9.4 Q21.6,12.6 15,26.8 M34.6,14.2 Q24.6,17.2 15.2,27 M36.4,21.6 Q27,23.4 15.4,27" },
      couettes: { forme: TIRES, sens: RAIE + " M23.2,10.6 Q16.4,12.2 12.6,19.2 M23.2,17.2 Q17,17.4 12.6,19.6 M23,24.6 Q16.8,24.2 12.6,20 M24.8,10.6 Q31.6,12.2 35.4,19.2 M24.8,17.2 Q31,17.4 35.4,19.6 M25,24.6 Q31.2,24.2 35.4,20" },
      chignon: { forme: TIRES, sens: "M15.4,26.6 Q15.6,17.6 20.6,11.8 M24,29.4 Q23.4,20 24,13.4 M32.6,26.6 Q32.4,17.6 27.4,11.8" },
      chignonBas: { forme: TIRES, sens: "M16.6,12 Q17.4,20 21.4,24.6 M24,10 Q24.4,18 24,23.6 M31.4,12 Q30.6,20 26.6,24.6" },
      deuxChignons: { forme: TIRES, sens: RAIE + " M23.2,25.6 Q18.6,20 17.4,13.2 M23,18 Q19.8,15 18.6,12.4 M24.8,25.6 Q29.4,20 30.6,13.2 M25,18 Q28.2,15 29.4,12.4" },
      couronne: { forme: TIRES, sens: "M20.6,8.2 Q16.6,12 15.4,17.6 M24,7.4 L24,21.6 M27.4,8.2 Q31.4,12 32.6,17.6 M17.6,24.6 Q17.4,27.4 18.2,30.6 M30.4,24.6 Q30.6,27.4 29.8,30.6" },
      tresses: { forme: TIRES, sens: RAIE + " M23.2,10.6 Q16.8,15 15.6,27.2 M23,18.4 Q18.4,21.4 15.8,27.4 M16.4,11.6 Q12.6,18.6 15.4,27.2 M24.8,10.6 Q31.2,15 32.4,27.2 M25,18.4 Q29.6,21.4 32.2,27.4 M31.6,11.6 Q35.4,18.6 32.6,27.2" },
      pixie: { forme: PIXIE_DOS, sens: "M20.4,9.6 Q15.8,16 15.8,29.4 M24,9.2 Q25,18 24,27.6 M27.6,9.6 Q32.6,16 32.2,29.4 M17.8,12.6 Q13.4,18 13.4,25.4 M30.2,12.6 Q34.6,18 34.6,25.4" },
      demiQueue: {
        forme: "M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z",
        sens: "M14.4,18.6 Q16,14.6 21.6,13.4 M33.6,18.6 Q32,14.6 26.4,13.4 M17.4,9.8 Q19.6,11.4 22,13 M30.6,9.8 Q28.4,11.4 26,13 M15.4,22.4 Q14.6,27.4 15.4,32 M32.6,22.4 Q33.4,27.4 32.6,32 M19.6,26.6 Q19.4,29.6 19.8,32.8 M28.4,26.6 Q28.6,29.6 28.2,32.8"
      },
      tresseCote: { forme: TIRES, sens: "M25.4,7.8 Q18.6,10.8 14.8,26.6 M30.2,9.4 Q21.6,12.6 15,26.8 M34.6,14.2 Q24.6,17.2 15.2,27 M36.4,21.6 Q27,23.4 15.4,27" },
      puffs: { forme: TIRES, sens: "M14.6,24.6 Q14.6,17 16.2,11.6 M19.6,28.4 Q19.8,18 17.6,11.2 M33.4,24.6 Q33.4,17 31.8,11.6 M28.4,28.4 Q28.2,18 30.4,11.2 M24,28.6 L24,9.6" },
      locksLongues: { forme: TIRES_PLEIN, sens: "M17.4,10.4 Q15.4,18 15.8,27.6 M21,8.8 Q20,18 20.4,29.2 M24.4,8.4 Q24.6,18 24.4,29.6 M28,8.8 Q29,18 28.4,29.2 M31.4,10.6 Q33.2,18 32.6,27.6" },
      locks: { forme: TIRES_PLEIN, sens: "M17.4,10.4 Q15.4,18 15.8,27.6 M21,8.8 Q20,18 20.4,29.2 M24.4,8.4 Q24.6,18 24.4,29.6 M28,8.8 Q29,18 28.4,29.2 M31.4,10.6 Q33.2,18 32.6,27.6" }
    };
    var COUVRE_HAUT = /* @__PURE__ */ new Set(["bonnet", "paille", "casquette", "bandana", "beret", "tricorne", "hautForme"]);
    var OREILLES_CACHEES = { front: /* @__PURE__ */ new Set(["longue", "carre", "milongue", "ondulee", "demiQueue"]), se: /* @__PURE__ */ new Set(["carre", "milongue", "demiQueue"]) };
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
      locks: [22, 38],
      degrade: [9, 16],
      banane: [4, 14],
      raie: [9, 17],
      herisse: [5, 14],
      boucleeCourte: [8, 14],
      chignonHomme: [5, 16],
      pixie: [10, 19.6],
      demiQueue: [21, 33.4],
      tresseCote: [26, 43],
      puffs: [9, 1],
      locksLongues: [24, 42]
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
      locks: [24, 40],
      degrade: [18, 28],
      banane: [18, 28],
      raie: [18, 28],
      herisse: [16, 28],
      boucleeCourte: [16, 28],
      chignonHomme: [10, 28],
      pixie: [22, 30.6],
      demiQueue: [26, 34],
      tresseCote: [26, 40],
      puffs: [12, 2],
      locksLongues: [26, 44]
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
      if (view === "ne") return tresse([11.8, 14.6], [24, 30.4], [36.2, 14.6], 9, 2.1, c, false);
      const k = view === "se" ? -1.2 : 0;
      return tresse([12.4 + k, 17.6], [24 + k, 0.8], [35.6 + k, 17.6], 9, 2, c, false);
    }
    __name(couronneTresse, "couronneTresse");
    function hairBehindBody(c0, view) {
      const { h: c } = peinture(c0, view);
      const coupe = c.o.coupe;
      if (view === "ne") return "";
      if (coupe === "longue") return P(view === "se" ? "M36.4,22 Q37.6,34 35.4,39" + pointesBas(35.4, 13.4, 39, 6) + " Q11,34 12.4,22 Z" : "M36.4,22 Q37.8,34 35.6,39.2" + pointesBas(35.6, 12.4, 39.2, 6) + " Q10.2,34 11.6,22 Z", c.hairS);
      if (coupe === "locks" || coupe === "locksLongues") return LOCKS_DERRIERE.map(([x, y0, y1]) => lock([view === "se" ? x + 0.6 : x, y0], [x + (x - 24) * 0.06, (y0 + y1) / 2], [x, coupe === "locks" ? y1 : y1 + 6], 1.7, c)).join("");
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
        s += xs.map((x) => E(x, 8.8, 3.7, 3.4, H) + P(`M${r22(x - 1.9)},8.8 Q${x},6.2 ${r22(x + 1.9)},8.6`, "none", 0.55)).join("");
      }
      if (coupe === "queue") {
        const q = "M31.4,9.6 C36.6,6.6 42,9.8 41.8,16.4 C41.6,21.8 39.8,26 37.4,30.4 Q37.4,27.6 36.8,26 Q36,28.2 34.6,29.2 C36.2,25 37.2,21 36.8,17.4 C36.4,14 34.8,12.4 32.6,12.6 Z";
        const k = view === "se" ? 0.6 : 0;
        s += P(sx(q, k), H) + clip(`${c.uid}qf${view}`, sx(q, k), `<path d="${sx("M44,17 Q38,20 34,30 L44,32 Z", k)}" fill="${S}"/>`) + P(sx(q, k), "none") + P(sx("M35.4,10.6 Q39.8,12.6 39.4,19 Q39,23.4 37.6,26.6 M34.6,12.8 Q37.6,15.4 37.4,20.4", k), "none", 0.5) + L([35.6 + k, 9.6], [38.6 + k, 10.4], c.hairH, 0.9) + E(32.8 + k, 11.6, 1.7, 1.5, c.tie, 0.85) + L([32.2 + k, 11], [33.2 + k, 10.8], tone(c.tie, 1.35), 0.5);
      }
      if (coupe === "puffs" && !c.couvert && !c.oreillesPortees) {
        const k = view === "se" ? -0.8 : 0;
        s += puff(c, `${c.uid}pf1${view}`, 14.2 + k, 9.6, 4.8, 16.4 + k, 11.6) + puff(c, `${c.uid}pf2${view}`, 33.8 + k, 9.6, 4.8, 31.6 + k, 11.6);
      }
      if (coupe === "demiQueue" && !c.couvert) {
        const k = view === "se" ? 0.8 : 0, q = "M25,8.8 C25.6,5.8 30.4,4.8 32.8,6.8 Q31.2,6.6 30.4,7.6 Q31.8,8 32.4,9.4 Q29.4,8.2 27.2,9.8 Z";
        s += P(sx(q, k), c.hair) + P(sx("M27,7.8 Q29,6.2 31.4,6.4", k), "none", 0.45) + E(25.8 + k, 8.8, 1.6, 1.2, c.tie, 0.75);
      }
      if (coupe === "tresses" && view === "se") s += tresse([13.4, 24.6], [12, 32.4], [13.8, 40.2], 5, 2.6, c);
      if (coupe === "bouclee") {
        const cl = curls(view === "se" ? 23.6 : 24, 17.6, 15.4, 11.6, 14);
        s += P(cl, H) + clip(`${c.uid}cb${view}`, cl, `<rect x="4" y="22" width="40" height="14" fill="${S}"/>`) + P(cl, "none");
      }
      return s;
    }
    __name(hairBack, "hairBack");
    function puff(c, id, x, y, r, bx, by) {
      const cl = curls(x, y, r, r * 0.92, 9, 1.1);
      return P(cl, c.hair) + clip(id, cl, `<ellipse cx="${r22(x + r * 0.3)}" cy="${r22(y + r * 0.7)}" rx="${r22(r * 1.2)}" ry="${r22(r * 0.7)}" fill="${c.hairS}"/>`) + P(cl, "none") + bouclette(r22(x - r * 0.3), r22(y - r * 0.1), r * 0.36, c) + bouclette(r22(x + r * 0.35), r22(y + r * 0.25), r * 0.32, c) + L([x - r * 0.6, y - r * 0.55], [x - r * 0.15, y - r * 0.8], c.hairH, 0.9) + E(bx, by, 1.5, 1, c.tie, 0.7);
    }
    __name(puff, "puff");
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
            s += P(`M${r22(bx)},${r22(by)} Q${r22(bx + m * len * 0.55 * Math.sin(t2))},${r22(by - len * 0.8 * Math.cos(t2) - 0.15)} ${r22(bx + m * len * Math.sin(t2 + 0.25))},${r22(by - len * Math.cos(t2 + 0.25))}`, "none", 0.6);
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
      else if (ctx.expr === "content" && !ctx.open) d = `M${r22(mx - 1.7)},${my} Q${mx},${r22(my + 1.6)} ${r22(mx + 1.7)},${my}`;
      else if (ctx.expr === "triste") d = `M${r22(mx - 1.4)},${r22(my + 1.1)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.4)},${r22(my + 1.1)}`;
      return d ? `<path d="${d}" fill="none" stroke="${tone(c.levres, 0.82)}" stroke-width="1.15" stroke-linecap="round"/>` : "";
    }
    __name(levres, "levres");
    function nuque(c) {
      const d = "M19.6,24.6 L28.4,24.6 L28.6,30 Q29,32.2 31.4,33.6 L16.6,33.6 Q19,32.2 19.4,30 Z";
      return P(d, c.skinS) + clip(`${c.uid}nq`, d, E(24, 26.4, 5.4, 2.6, tone(c.skin, 0.74), 0) + L([26.8, 27.6], [27.4, 31.6], tone(c.skin, 0.8), 0.9));
    }
    __name(nuque, "nuque");
    function rousseur(genre, se, fr, quelques, col) {
      if (genre === "non") return "";
      const nx = se ? 20.6 : 24;
      const nez = [[nx - 1.6, 24.6], [nx - 0.6, 24.2], [nx + 0.6, 24.2], [nx + 1.6, 24.6], [nx - 1.1, 25.3], [nx + 1.1, 25.3]];
      const pts = genre === "nez" ? nez : genre === "legere" ? fr.filter((p, i) => quelques.includes(i)) : genre === "dense" ? fr.concat(nez, fr.map(([x, y]) => [x + 0.9, y + 0.7])) : fr;
      return pts.map(([x, y], i) => E(x, y, i % 3 ? 0.36 : 0.44, i % 3 ? 0.34 : 0.42, col, 0)).join("");
    }
    __name(rousseur, "rousseur");
    function rides(age, se, col) {
      if (age !== "mur" && age !== "age") return "";
      const t = /* @__PURE__ */ __name((d, w = 0.5) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`, "t");
      const yeux = se ? [[13.4, -1], [28.4, 1]] : [[15.4, -1], [32.6, 1]];
      let s = yeux.map(([x, k]) => t(`M${r22(x)},${22.2} l${r22(k * 1.1)},-0.6 M${r22(x)},${23.2} l${r22(k * 1.2)},0.1 M${r22(x)},${24.1} l${r22(k * 1)},0.7`, 0.42)).join("");
      const mx = se ? 21.4 : 24;
      s += t(`M${r22(mx - 3.4)},16.4 Q${mx},15.6 ${r22(mx + 3.4)},16.4`, 0.45);
      if (age === "age") {
        s += t(`M${r22(mx - 2.6)},17.6 Q${mx},17 ${r22(mx + 2.6)},17.6`, 0.4) + t(`M${r22(mx - 3.6)},25.2 Q${r22(mx - 4.4)},26.8 ${r22(mx - 3.6)},28.4 M${r22(mx + 3.6)},25.2 Q${r22(mx + 4.4)},26.8 ${r22(mx + 3.6)},28.4`, 0.5);
      }
      return s;
    }
    __name(rides, "rides");
    function cicatrice(ou, se, peau) {
      if (!ou || ou === "sans") return "";
      const P0 = {
        sourcil: se ? [15.8, 19.4, 17, 22.2] : [18.2, 19.2, 19.6, 22.2],
        joue: se ? [14.2, 25.4, 16.4, 27.4] : [30.4, 25, 32.6, 27.2],
        nez: se ? [19.6, 23.4, 21.4, 24.6] : [23, 23.2, 25, 24.4],
        levre: se ? [22, 27.6, 22.8, 29.6] : [25.6, 27.4, 26.4, 29.6]
      }[ou];
      const [x0, y0, x1, y1] = P0, pale = mix(peau, "#FFFFFF", 0.35), S = tone(peau, 0.66);
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, nx = -(y1 - y0) * 0.22, ny = (x1 - x0) * 0.22;
      return `<path d="M${x0},${y0} L${x1},${y1}" stroke="${S}" stroke-width="1" stroke-linecap="round"/><path d="M${x0},${y0} L${x1},${y1}" stroke="${pale}" stroke-width=".48" stroke-linecap="round"/><path d="M${r22(mx - nx)},${r22(my - ny)} L${r22(mx + nx)},${r22(my + ny)}" stroke="${S}" stroke-width=".38" stroke-linecap="round"/>`;
    }
    __name(cicatrice, "cicatrice");
    function head(c0, ctx) {
      const { view } = ctx;
      if (view === "se" && !ctx.tour) {
        const sil = [];
        const s2 = head(c0, { ...ctx, view: "front", tour: sil });
        return tourner(s2, sil);
      }
      const gr = /* @__PURE__ */ __name((nom, x) => groupe(ctx.tour, nom, x), "gr");
      const { h: c, defs } = peinture(c0, view);
      const o = c.o, H = c.hair, S = c.hairS, HI = c0.hairH;
      const coupe = o.coupe, couvert = c0.couvert;
      const avecMeches = o.meches === "meches" && coupe !== "rasee";
      let s = defs + (ctx.sway ? `<g transform="translate(${r22(-ctx.sway * 1.2)} 0)">${hairBack(c, view)}</g>` : hairBack(c, view));
      if (view === "ne") {
        const longs = coupe === "longue" || coupe === "ondulee" || coupe === "milongue";
        const ombre = /* @__PURE__ */ __name((forme) => clip(`${c.uid}h`, forme, `<rect x="8" y="4" width="34" height="40" fill="${S}"/><ellipse cx="22.4" cy="${longs ? 21 : 18.4}" rx="13.8" ry="${longs ? 16.4 : 12.8}" fill="${H}"/>`), "ombre");
        if (coupe === "rasee") {
          const tete = CRANE_DOS;
          const duvet = "M8,4 L40,4 L40,27.4 Q34.6,29.6 31,28.6 Q27.6,30.4 24,29.8 Q20.4,30.4 17,28.6 Q13.4,29.6 8,27.4 Z";
          s += P(tete, c.skin) + clip(`${c.uid}rz`, tete, `<path d="M8,31.6 Q24,34.4 40,31.6 L40,40 L8,40 Z" fill="${c.skinS}"/><path d="${duvet}" fill="${c.buzz}"/>` + P("M14,28.8 Q17.4,30 20.4,29.4 M27.6,29.4 Q30.6,30 34,28.8", "none", 0.45) + [[17.4, 12], [21.4, 10.4], [26.6, 10.6], [30.6, 12.4], [19, 17], [24, 16.2], [29, 17.2], [16.4, 21.4], [31.6, 21.4]].map(([x, y]) => L([x, y], [x + 0.4, y + 1], c.buzzS, 0.5)).join("") + L([17, 10.6], [21.4, 8.8], tone(c.buzz, 1.25), 1.1)) + P(tete, "none");
          s += E(11.8, 21.6, 1.5, 2.1, c.skin) + E(36.2, 21.6, 1.5, 2.1, c.skin);
          return s + couche(c0, "cheveux", ctx) + couche(c0, "tete", ctx);
        }
        const tiree = DOS[coupe] && DOS[coupe].forme === TIRES;
        if (COURTES.has(coupe) || tiree) {
          const tete = CRANE_DOS;
          s += P(tete, c.skin) + clip(`${c.uid}nq`, tete, `<path d="M8,31 Q24,34 40,31 L40,40 L8,40 Z" fill="${c.skinS}"/>` + (TONDUES.has(coupe) ? `<path d="M8,4 L40,4 L40,30.4 Q24,32.4 8,30.4 Z" fill="${c.buzz}"/>` : tiree ? "" : `<path d="M10,25 Q24,31.6 38,25 L38,29.6 Q24,32 10,29.6 Z" fill="${c.buzz}" opacity=".7"/>`)) + P(tete, "none");
        }
        s += COURTES.has(coupe) || tiree ? E(11.8, 21.6, 1.55, 2.15, c.skin) + E(36.2, 21.6, 1.55, 2.15, c.skin) : E(12.6, 23, 1.6, 2.2, c.skin) + E(35.4, 23, 1.6, 2.2, c.skin);
        if (coupe === "bouclee") {
          const bas = curls(24, 27.8, 13.4, 6, 10, 1.7);
          s += P(bas, S) + P(bas, "none");
          const cl = curls(24, 17.6, 15.4, 11.6, 14);
          s += P(cl, H) + ombre(cl) + P(cl, "none") + [
            [18, 10.8, 3.4],
            [24, 9.4, 3.6],
            [30, 10.8, 3.4],
            [14.6, 16.2, 3.3],
            [20.6, 15.2, 3.6],
            [27.4, 15.2, 3.6],
            [33.4, 16.2, 3.3],
            [17.4, 21.4, 3.6],
            [24, 20.8, 3.8],
            [30.6, 21.4, 3.6],
            [14.6, 25.8, 3.2],
            [20.8, 26.2, 3.4],
            [27.2, 26.2, 3.4],
            [33.4, 25.8, 3.2]
          ].map(([x, y, r]) => {
            const d = curls(x, y, r, r * 0.86, 7, 0.8);
            return P(d, H, 0.6) + P(`M${r22(x - r * 0.5)},${r22(y + r * 0.3)} Q${x},${r22(y + r * 0.75)} ${r22(x + r * 0.5)},${r22(y + r * 0.3)}`, "none", 0.4) + L([x - r * 0.45, y - r * 0.35], [x - r * 0.05, y - r * 0.5], HI, 0.7);
          }).join("") + L([16.4, 11], [20.6, 9], HI, 1.2);
          if (avecMeches) s += meches(c0, view, cl, "M17,10 Q15.4,17 17,25 M24,8.4 Q24.6,17 23.8,27 M31,10 Q32.6,17 31,25");
          return s + couche(c0, "cheveux", ctx) + couche(c0, "tete", ctx);
        }
        const SOUS_CHAPEAU = { chignon: "chignonBas", herisse: "degrade", banane: "courte", bataille: "courte" };
        const dos = DOS[couvert && SOUS_CHAPEAU[coupe] || coupe];
        if (coupe === "couettes") s += P(COUETTE, c.hair) + P(mirror(COUETTE), c.hair) + P("M8.6,22.4 Q8,25.4 8.4,27.6 M39.4,22.4 Q40,25.4 39.6,27.6", "none", 0.5);
        if (coupe === "queueCote") s += P(mirror(QUEUE_COTE), H) + P(mirror(QUEUE_COTE_SENS), "none", 0.5);
        s += P(dos.forme, H) + ombre(dos.forme) + P(dos.forme, "none") + clip(`${c.uid}hs`, dos.forme, P(dos.sens + (dos.detail ? " " + dos.detail : ""), "none", 0.55)) + L([16.4, 10.6], [21.6, 8.6], HI, 1.3);
        if (avecMeches) s += meches(c0, view, dos.forme, dos.sens);
        if (coupe === "locks" || coupe === "locksLongues") s += [0, 2, 4, 6, 1, 3, 5].map((i) => {
          const [x, y] = LOCKS_DOS[i];
          return dosLock(c, [x, coupe === "locks" ? y : y + 5.6], i);
        }).join("");
        if (coupe === "bataille" && !couvert) s += P(EPIS.ne[0], H, 0) + P(EPIS.ne[1], "none", 1) + L([16.6, 7.4], [21.4, 6.6], HI, 1.1);
        if (coupe === "boucleeCourte" && !couvert) {
          const cl = curls(24, 14.4, 12.8, 8.6, 13, 1.6);
          s += P(cl, H) + ombre(cl) + P(cl, "none") + [[18.4, 12.4], [24, 10.6], [29.6, 12.4], [21, 17.4], [27, 17.4]].map(([x, y]) => bouclette(x, y, 2.2, c0)).join("") + L([16.6, 9.6], [21, 8], HI, 1.1);
        }
        if (coupe === "chignonHomme" && !couvert) s += E(24, 10.2, 3.2, 2.7, H) + P("M21.6,9.6 Q24,7.6 26.4,9.6", "none", 0.55) + E(24, 12.6, 1.6, 0.8, c.tie, 0.6) + L([22.2, 8.4], [23.8, 7.6], HI, 0.9);
        if (coupe === "queue") {
          const queue = "M22.4,13.4 C18,15.4 17.8,22.4 19.4,27.6 C20.6,31.4 20.6,35 22.4,38.8 Q23,36.6 24.2,35.8 Q24.8,37.8 26.6,39.2 C26.8,35.6 28.8,31.4 29.2,26.4 C29.6,21 29.4,15.4 25.6,13.4 Z";
          s += P(queue, H) + clip(`${c.uid}qd`, queue, `<path d="M25.4,12 Q31,22 26,40 L32,40 L32,12 Z" fill="${S}"/>`) + P(queue, "none") + P("M22.6,16.4 Q20.4,22.4 21.6,28.6 Q22.4,32.4 22.8,35.6 M25.2,16.2 Q26.8,22.6 25.6,29 Q25,33 25.6,36.6", "none", 0.5) + L([21.4, 16.6], [20.6, 21.4], c.hairH, 0.9) + E(24, 13.6, 2.7, 1.6, c.tie, 0.85) + L([22.8, 13.1], [24.4, 12.8], tone(c.tie, 1.35), 0.5);
        }
        if (coupe === "demiQueue" && !couvert) {
          const q = "M22.2,13.2 C19.4,15.4 19.8,20.6 21.4,24.6 Q22.8,27 24,27.6 Q25.2,27 26.6,24.6 C28.2,20.6 28.6,15.4 25.8,13.2 Z";
          s += P(q, H) + clip(`${c.uid}dq`, q, `<rect x="24.4" y="12" width="5" height="17" fill="${S}"/>`) + P(q, "none") + P("M23,16.4 Q22.4,21 23.4,25.4 M25.2,16.4 Q25.8,21 24.8,25.4", "none", 0.45) + E(24, 13.4, 2.4, 1.4, c.tie, 0.8) + L([22.8, 12.9], [24.2, 12.7], tone(c.tie, 1.35), 0.5);
        }
        if (coupe === "tresseCote") s += tresse([14.4, 28.4], [12.2, 32.6], [12.8, 40.6], 5, 2.9, c) + E(14.8, 27.2, 1.6, 1.3, c.tie, 0.8);
        if (coupe === "puffs" && !couvert && !c0.oreillesPortees) s += puff(c, `${c.uid}pf1ne`, 14.6, 9.6, 4.8, 17, 12) + puff(c, `${c.uid}pf2ne`, 33.4, 9.6, 4.8, 31, 12);
        if (coupe === "queueCote") s += E(15, 27.2, 1.6, 1.4, c.tie, 0.8);
        if (coupe === "couettes") s += E(11.8, 19.6, 1.5, 1.3, c.tie, 0.8) + E(36.2, 19.6, 1.5, 1.3, c.tie, 0.8);
        if (coupe === "chignon") {
          s += couvert ? E(24, 25.4, 3.8, 3.2, H) + P("M21.2,24.6 Q24,23 26.8,24.6", "none", 0.55) : E(24, 9.6, 5.2, 4.2, H) + P("M20.4,9.4 Q24,6.6 27.6,9.4", "none", 0.6) + L([20.8, 7.8], [23.4, 6.8], HI, 1.1);
        }
        if (coupe === "deuxChignons" && !couvert && !c0.oreillesPortees) s += [16.8, 31.2].map((x) => E(x, 10.4, 3.7, 3.4, H) + P(`M${r22(x - 1.9)},10.4 Q${x},7.8 ${r22(x + 1.9)},10.2`, "none", 0.55)).join("");
        if (coupe === "couronne" && !couvert) s += couronneTresse(c, view);
        if (coupe === "tresses") s += tresse([15.4, 28.8], [14.2, 35], [15.4, 41.6], 5, 2.8, c) + tresse([32.6, 28.8], [33.8, 35], [32.6, 41.6], 5, 2.8, c) + E(15.6, 27.6, 1.6, 1.3, c.tie, 0.8) + E(32.4, 27.6, 1.6, 1.3, c.tie, 0.8);
        return s + couche(c0, "cheveux", ctx) + couche(c0, "tete", ctx);
      }
      const se = view === "se";
      const face = faceD(view, o.visage, o.genre === "homme" ? o.menton : "doux");
      const back = coupe === "carre" ? BOB[view] : coupe === "milongue" || coupe === "demiQueue" ? MILONGUE[view] : COURTES.has(coupe) || coupe === "puffs" ? COURT_BACK[view] : BACK[view];
      if (coupe === "chignonHomme" && !couvert) s += E(se ? 25 : 24, 7.4, 3.2, 2.4, H) + P(`M${se ? 22.8 : 21.8},7.2 Q${se ? 25 : 24},5.6 ${se ? 27.2 : 26.2},7.2`, "none", 0.55);
      if (ctx.tour) ctx.tour.push(face, ...coupe === "rasee" ? [] : coupe === "bouclee" ? [curls(24, 17.6, 15.4, 11.6, 14)] : [back]);
      if (coupe !== "rasee" && coupe !== "bouclee") s += P(back, H) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="10" fill="${S}"/>`) + P(back, "none");
      const oreilles = !OREILLES_CACHEES[view].has(coupe);
      if (oreilles) s += gr("oreille", se ? E(35, 23.2, 1.5, 2.1, c.skin) : E(11.8, 22.8, 1.5, 2.1, c.skin) + E(36.2, 22.8, 1.5, 2.1, c.skin));
      const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]] : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
      const quelques = se ? [0, 1, 3] : [0, 1, 3, 4];
      const cheeks = se ? [[15.2, 1.8], [28.2, 1.5]] : [[16.6, 1.9], [31.4, 1.9]];
      const fk = couvert && (coupe === "banane" || coupe === "herisse") ? "degrade" : coupe;
      const frange = coupe === "rasee" || coupe === "bouclee" ? null : FRANGE[fk] ? se ? sx(FRANGE[fk], -1) : FRANGE[fk] : BANGS[view];
      s += P(face, c.skin);
      s += clip(`${c.uid}f`, face, (frange ? `<path d="${frange}" fill="${c.skinS}" transform="translate(0 1.4)"/>` : "") + gr("traits", (o.joues === "sans" && ctx.expr !== "gene" ? "" : cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.1, c.cheek, 0)).join("")) + rousseur(o.rousseur, se, fr, quelques, c.freckle)));
      s += P(face, "none");
      let traits = "";
      if (o.genre === "homme" && o.menton === "fendu") {
        const mx = view === "se" ? 20.8 : 24;
        traits += `<path d="M${mx},31.9 Q${r22(mx + 0.25)},32.5 ${mx},33.1" fill="none" stroke="${c.skinS}" stroke-width=".7" stroke-linecap="round"/>`;
      }
      traits += rides(o.age, se, tone(c0.skin, 0.72));
      s += gr("traits", traits);
      const mst = o.moustache !== "sans" ? o.moustache : o.barbe === "pleine" ? "gauloise" : null;
      s += gr("barbe", (o.barbe !== "sans" ? barbe(c0, view, face, o.barbe) : "") + (mst ? moustache(c0, view, mst) : ""));
      traits = "";
      if (o.grain !== "non") {
        const [x, y] = GRAIN[o.grain][view];
        traits += E(x, y, 0.45, 0.45, c.mole, 0);
      }
      if (o.genre === "homme") {
        const nx = se ? 20.4 : 24;
        traits += `<path d="M${r22(nx + 0.4)},23.8 Q${r22(nx + 1)},25.1 ${r22(nx - 0.2)},25.4" fill="none" stroke="${c.skinS}" stroke-width=".7" stroke-linecap="round"/>`;
      }
      s += gr("traits", traits) + gr("oreille", couche({ ...c0, oreillesVisibles: oreilles }, "oreilles", ctx)) + gr("traits", couche(c0, "joues", ctx));
      if (coupe === "rasee") {
        const cap = se ? "M11.8,19.6 Q11.6,8.4 23,7.8 Q34.8,8.2 35.4,19 Q33,14.2 23.2,13.8 Q14.6,14 11.8,19.6 Z" : "M12.4,19.8 Q12.2,8.2 24,7.8 Q35.8,8.2 35.6,19.8 Q33.4,13.8 24,13.6 Q14.6,13.8 12.4,19.8 Z";
        if (ctx.tour) ctx.tour.push(cap);
        s += P(cap, c.buzz, 0.9) + L(se ? [15.4, 11.4] : [17, 11], se ? [21.4, 9.6] : [23, 9.4], tone(c.buzz, 1.25), 1);
      } else if (coupe === "bouclee") {
        const k = se ? -1 : 0;
        const rang = [[13.8, 15.2, 2.7], [34.2, 15.2, 2.7], [18.4, 11.4, 3.3], [29.6, 11.4, 3.3], [24, 9.8, 3.4]];
        const top = rang.map(([x, y, r]) => curls(x + k, y, r, r * 0.86, 7, 0.8)).join(" ");
        s += rang.map(([x, y, r], i) => {
          const d = curls(x + k, y, r, r * 0.86, 7, 0.8);
          return P(d, H, 0.65) + P(`M${r22(x + k - r * 0.5)},${r22(y + r * 0.3)} Q${r22(x + k)},${r22(y + r * 0.75)} ${r22(x + k + r * 0.5)},${r22(y + r * 0.3)}`, "none", 0.4) + L([x + k - r * 0.45, y - r * 0.35], [x + k - r * 0.05, y - r * 0.5], HI, 0.7);
        }).join("") + L(se ? [16, 10.6] : [17, 10.4], se ? [18.6, 9.2] : [19.6, 9], HI, 1);
        if (avecMeches) s += meches(c, view, top, sx("M17,9 Q16.6,11.6 17.4,14 M24,7.4 Q24.4,10 24,12.6 M31,9 Q31.4,11.6 30.6,14", k));
      } else {
        if (coupe === "bataille" && !couvert) s += P(se ? sx(EPIS.front[0], -1) : EPIS.front[0], H, 0) + P(se ? sx(EPIS.front[1], -1) : EPIS.front[1], "none", 1);
        if (TONDUES.has(coupe)) s += se ? P(sx(mirror(TEMPE), -0.6), c.buzz, 0.5) : P(TEMPE, c.buzz, 0.5) + P(mirror(TEMPE), c.buzz, 0.5);
        else if (coupe === "pixie") {
          const m = "M12.8,17 Q12,20.4 13.4,22.8 Q13.6,20.4 14.4,18.2 Z";
          s += se ? P(sx(mirror(m), -0.6), H, 0.5) : P(m, H, 0.5) + P(mirror(m), H, 0.5);
        } else if (COURTES.has(coupe)) {
          const fav = "M12.6,17 Q12.5,18.8 12.9,20 L13.7,20 Q13.6,18.6 14.1,16.8 Z";
          s += se ? P(sx(mirror(fav), -0.6), H, 0.5) : P(fav, H, 0.5) + P(mirror(fav), H, 0.5);
        }
        const sens = se ? sx(sensFrange(coupe), -1) : sensFrange(coupe);
        s += P(frange, H) + clip(`${c.uid}sf`, frange, P(sens, "none", 0.5)) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], HI, 1.3);
        if (avecMeches) s += meches(c, view, frange, sens);
        if (coupe === "boucleeCourte" && !couvert) {
          const top = curls(se ? 23 : 24, 10.4, 10.2, 3.4, 10, 1.3);
          s += P(top, H) + L(se ? [16.2, 8.6] : [17.6, 8.4], se ? [20.6, 7.2] : [22, 7], HI, 1);
        }
        const long = { longue: MECHE_LONGUE, milongue: MECHE_MILONGUE, ondulee: MECHE_ONDULEE, demiQueue: MECHE_MILONGUE }[coupe];
        if (long) s += se ? P(sx(mirror(long), -0.6), H) : P(long, H) + P(mirror(long), H);
        if (coupe === "carre") {
          const lk = "M14.4,15.2 Q10.4,19.6 10.7,26.4 Q10.9,29.8 13.3,30.9 Q15,31.4 15.9,30.2 Q13.8,28.8 13.8,24.6 Q13.8,20.2 16,17.6 Z";
          s += se ? P(sx(mirror(lk), -0.4), H) : P(lk, H) + P(mirror(lk), H);
        }
        if (coupe === "queueCote") s += P(se ? sx(QUEUE_COTE, 0.4) : QUEUE_COTE, H) + P(se ? sx(QUEUE_COTE_SENS, 0.4) : QUEUE_COTE_SENS, "none", 0.5) + E(se ? 34.6 : 34.2, 28.4, 1.6, 1.4, c.tie, 0.8);
        if (coupe === "couronne" && !couvert) s += couronneTresse(c, view);
        if (coupe === "tresses") s += se ? tresse([35.6, 25], [37, 32.4], [35.6, 40.2], 5, 2.8, c) : tresse([12, 25], [10.6, 32.4], [12.6, 40.6], 5, 2.8, c) + tresse([36, 25], [37.4, 32.4], [35.4, 40.6], 5, 2.8, c);
        if (coupe === "couettes") s += couettes(c, view);
        if (coupe === "puffs") s += `<path d="${se ? sx(DUVET_PUFFS, -1) : DUVET_PUFFS}" fill="none" stroke="${H}" stroke-width=".55" stroke-linecap="round"/>`;
        if (coupe === "tresseCote") {
          const k = se ? 0.4 : 0;
          s += P(sx("M33.4,17.8 Q37.6,18.6 38.2,23.4 Q38.4,26.8 36.6,28.8 Q35,29.2 34.2,28.2 Q35.4,25.6 34.8,22.4 Q34.4,19.6 33.4,17.8 Z", k), H, 0.6) + P(sx("M34.6,19.6 Q36.8,22.2 36.2,27.4", k), "none", 0.5) + tresse([35.6 + k, 29.6], [37.6 + k, 35.6], [33.8 + k, 43], 5, 2.8, c) + E(35.6 + k, 28.9, 1.6, 1.3, c.tie, 0.8) + L([34.8 + k, 28.5], [35.8 + k, 28.3], tone(c.tie, 1.35), 0.5);
        }
        if (coupe === "locks" || coupe === "locksLongues") s += (coupe === "locks" ? LOCKS : LOCKS_LONGUES)[view].map(([a, b, e, w, g]) => lock(a, b, e, w, c, g)).join("");
      }
      s += couche(c0, "cheveux", ctx);
      const brow = { fins: [1, -4.1], epais: [1.6, -4.2], doux: [0.95, -3.7] }[o.sourcils];
      const homme = o.genre === "homme";
      const [ex0, ey0] = YEUX[o.formeYeux], ex = ex0 * (homme ? 0.94 : 1), ey = r22(ey0 * (homme ? 0.88 : 1) * (o.age === "jeune" ? 1.08 : 1));
      const eyes = se ? [[17.2, 22.6, r22(1.55 * ex)], [25.2, 22.6, r22(1.35 * ex)]] : [[19.4, 22.6, r22(1.6 * ex)], [28.6, 22.6, r22(1.6 * ex)]];
      const mouth = [se ? 20.8 : 24, 27 + (sousMoustache(o) ? 1 : 0)];
      traits = expression({
        eyes,
        ry: ey,
        eyeColor: c.eye,
        restEyes: o.formeYeux === "paisibles" ? "sleepy" : void 0,
        brow: tone(c0.hair, 0.55),
        browY: brow[1] - Math.max(0, ey - 2.35) * 0.6,
        browW: brow[0],
        ...TRAITS[homme ? "homme" : "femme"],
        lashes: o.cils !== "sans",
        mouth,
        mw: homme ? 1.9 : 1.55,
        mouthC: "#7A3B30",
        tongue: "#E07A72",
        neutral: homme ? (mx, my) => etirer(BOUCHE[o.bouche](mx, my), mx, my, 1.15, 0.75) : BOUCHE[o.bouche],
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
          traits += `<path d="M${r22(x - rx - 0.5)},${r22(t + 0.5)} Q${x},${r22(t - 0.7)} ${r22(x + rx + 0.5)},${r22(t + 0.5)} L${r22(x + rx + 0.5)},${r22(y + ey + 0.7)} L${r22(x - rx - 0.5)},${r22(y + ey + 0.7)} Z" fill="${c.skin}"/>` + P(`M${r22(x - rx - 0.3)},${r22(t + 0.4)} Q${x},${r22(t - 0.6)} ${r22(x + rx + 0.3)},${r22(t + 0.4)}`, "none", 0.8);
        }
      }
      if (open && o.formeYeux === "amande") {
        const cx = (eyes[0][0] + eyes[1][0]) / 2;
        for (const [x, y, rx] of eyes) {
          const m = cx > x ? -1 : 1;
          traits += P(`M${r22(x - m * rx * 0.9)},${r22(y - ey * 0.55)} Q${r22(x - m * rx * 0.1)},${r22(y - ey * 1.45)} ${r22(x + m * (rx + 0.7))},${r22(y - ey * 0.5)}`, "none", 0.7);
        }
      }
      traits += cils(c0, eyes, ey, ctx) + levres(c0, ctx, mouth[0], mouth[1]);
      traits += cicatrice(o.cicatrice, se, c0.skin);
      s += gr("traits", traits + couche(c0, "visage", ctx)) + couche(c0, "tete", ctx);
      return s;
    }
    __name(head, "head");
    var YEUX = { ronds: [1, 2.35], amande: [1.12, 1.95], grands: [1.16, 2.75], rieurs: [1, 2.35], paisibles: [1, 2.35] };
    var BOUCHE = {
      // (la douce, celle du défaut : calme, à peine courbée ; le visage neutre ne sourit pas, choix de l'auteur, 15 oct.)
      douce: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.55)} Q${mx},${r22(my + 1.05)} ${r22(mx + 1.3)},${r22(my + 0.55)}`, "douce"),
      sourire: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 2)},${r22(my)} Q${mx},${r22(my + 1.9)} ${r22(mx + 2)},${r22(my)}`, "sourire"),
      malice: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.5)},${r22(my + 0.7)} Q${r22(mx + 0.3)},${r22(my + 1.3)} ${r22(mx + 1.7)},${r22(my - 0.2)}`, "malice"),
      serieuse: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.7)} Q${mx},${r22(my + 1)} ${r22(mx + 1.3)},${r22(my + 0.7)}`, "serieuse")
    };
    var etirer = /* @__PURE__ */ __name((d, mx, my, kx, ky) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(mx + (+x - mx) * kx)},${r22(my + (+y - my) * ky)}`), "etirer");
    var GRAIN = { joue: { front: [31, 27.2], se: [26.8, 27] }, levre: { front: [26.4, 28.6], se: [23, 28.6] } };
    function skirt(c, view, sway, top, hem) {
      const { hw } = c.k;
      const a = hw + 0.2, b = hw + 2.4 + (hem - top) * 0.1;
      const tear = c.dechire ? dechirure([24 + b + sway, hem], [24 + sway, hem + 1.8], [24 - b + sway, hem], c.dechire + 11 + (view === "ne" ? 3 : 0)) : null;
      const d = `M${r22(24 - a)},${top} L${r22(24 + a)},${top} L${r22(24 + b + sway)},${hem} ${tear ? tear.d : `Q${r22(24 + sway)},${r22(hem + 1.8)} ${r22(24 - b + sway)},${hem}`} Z`;
      const ombre = view === "se" ? `M${r22(24 + a - 2.9)},${top} L48,${top} L48,${hem + 3} L${r22(24 + b - 3.4 + sway)},${hem + 3} Z` : `M27.2,${top} L48,${top} L48,${hem + 3} L${r22(28.2 + sway)},${hem + 3} Z`;
      const pleats = [-0.45, 0.1].map((t) => L([24 + t * a, top + 2.4], [24 + t * b * 1.1 + sway, hem + 0.4], c.basS, 0.6)).join("");
      const mo = c.o.motifBas === "raye" || c.o.motifBas === "pois" ? motif(c.o.motifBas, c.bas2, c.uid, 14) : "";
      return P(d, c.bas) + clip(`${c.uid}sk`, d, mo + `<path d="${ombre}" fill="${c.basS}"/>` + pleats + L([24 - a + 1, top + 1], [24 - b + 1.6 + sway, hem - 0.4], c.basH, 0.9)) + P(d, "none") + (tear ? tear.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("") : "");
    }
    __name(skirt, "skirt");
    function shortLeg(c, x, frayed = false, y) {
      if (c.jambe) return jambeCourte(c, x, frayed, y);
      const w = c.legW + 1.8, y0 = c.hip - 0.4, y1 = c.hip + c.shortLen;
      let s = `<rect x="${r22(x - w / 2)}" y="${r22(y0)}" width="${r22(w)}" height="${r22(y1 - y0)}" rx="1.2" fill="${c.bas}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r22(x + w / 2 - 1.9)}" y="${r22(y0 + 0.6)}" width="1.2" height="${r22(y1 - y0 - 1.2)}" rx="0.5" fill="${c.basS}"/>`;
      s += frayed ? P(`M${r22(x - w / 2 + 0.2)},${r22(y1 - 0.2)} L${r22(x - w / 4)},${r22(y1 + 1.2)} L${x},${r22(y1 + 0.2)} L${r22(x + w / 4)},${r22(y1 + 1.4)} L${r22(x + w / 2 - 0.2)},${r22(y1 - 0.2)}`, "none", 0.8) : L([x - w / 2 + 0.7, y1 - 1.2], [x + w / 2 - 0.7, y1 - 1.2], c.basS, 0.6);
      return s;
    }
    __name(shortLeg, "shortLeg");
    var FAMILLE_HAUT = { polo: "tshirt", debardeur: "tshirt", colRoule: "pull", gilet: "veste" };
    var FAMILLE_BAS = { bermuda: "short", jupePlissee: "jupe", robeLongue: "robe" };
    var familleHaut = /* @__PURE__ */ __name((h) => FAMILLE_HAUT[h] || h, "familleHaut");
    var familleBas = /* @__PURE__ */ __name((b) => FAMILLE_BAS[b] || b, "familleBas");
    function motif(genre, col, uid, dy = 0) {
      if (genre === "raye") return [30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60].map((y) => `<rect x="0" y="${r22(y + dy)}" width="48" height="1.3" fill="${col}"/>`).join("");
      if (genre === "pois") return Array.from({ length: 60 }, (_, i) => {
        const x = 6 + i % 10 * 4 + Math.floor(i / 10) % 2 * 2, y = 30 + dy + Math.floor(i / 10) * 4.4;
        return E(x, y, 0.75, 0.75, col, 0);
      }).join("");
      return "";
    }
    __name(motif, "motif");
    function chaussure(c, forme, x, y, dir, tilt) {
      const S = c.shoeS, H = c.shoeH, toe = dir < 0 ? 1.4 : 0;
      const pivot = /* @__PURE__ */ __name((s2) => tilt ? `<g transform="rotate(${tilt} ${pivotPied(c, x, y, dir)})">${s2}</g>` : s2, "pivot");
      const tigeRegle = /* @__PURE__ */ __name((h) => {
        const T2 = tigeJambe(c, x, y, h, 0.45), id = `${c.uid}tj${Math.round(x * 10)}${Math.round(y * 10)}`;
        return P(T2.d, c.shoe, 0) + clip(id, T2.d, `<path d="${T2.droit}" fill="none" stroke="${S}" stroke-width="2" transform="translate(-0.8 0)"/>`) + P(T2.d, "none") + `<path d="${T2.ouverture}" fill="none" stroke="${S}" stroke-width=".6" transform="translate(0 .9)"/>`;
      }, "tigeRegle");
      const tige = /* @__PURE__ */ __name((h) => {
        if (c.jambe) return tigeRegle(h);
        const w = c.legW + 0.8, d = `M${r22(x - w / 2)},${r22(y - h)} L${r22(x + w / 2)},${r22(y - h)} L${r22(x + w / 2 + 0.2)},${r22(y + 1.4)} L${r22(x - w / 2 - 0.2)},${r22(y + 1.4)} Z`;
        return P(d, c.shoe) + clip(`${c.uid}tg${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<rect x="${r22(x + w / 2 - 1.6)}" y="${r22(y - h)}" width="2" height="${r22(h + 2)}" fill="${S}"/>`) + P(d, "none") + `<path d="M${r22(x - w / 2 + 0.2)},${r22(y - h + 0.9)} L${r22(x + w / 2 - 0.2)},${r22(y - h + 0.9)}" stroke="${S}" stroke-width=".6"/>`;
      }, "tige");
      if (forme === "sandales") {
        const pied = `M${r22(x - 2.3)},${r22(y)} L${r22(x + 2.3)},${r22(y)} Q${r22(x + 2.9)},${r22(y + 3.4)} ${r22(x + 1.4)},${r22(y + 4.3)} L${r22(x - 1.4 - toe)},${r22(y + 4.3)} Q${r22(x - 3.1 - toe)},${r22(y + 3.8)} ${r22(x - 2.3)},${r22(y)} Z`;
        const brides = [[-0.2, 1], [2.1, 0.95]].map(([y0, h]) => `<rect x="0" y="${r22(y + y0)}" width="48" height="${h}" fill="${c.shoe}"/>` + L([0, y + y0 + h], [48, y + y0 + h], OUT, 0.45)).join("");
        const semelle = `M${r22(x - 1.6 - toe)},${r22(y + 4.3)} Q${r22(x - toe / 2)},${r22(y + 4.95)} ${r22(x + 1.6)},${r22(y + 4.3)}`;
        return pivot(bareFoot(c, x, y, dir) + clip(`${c.uid}sd${Math.round(x * 10)}${Math.round(y * 10)}`, pied, brides) + P(pied, "none", 0.9) + `<path d="${semelle}" fill="none" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="${semelle}" fill="none" stroke="${S}" stroke-width=".6" stroke-linecap="round"/>`);
      }
      if (forme === "ballerines") {
        const d = `M${r22(x - 2.8)},${r22(y + 1.6)} Q${x},${r22(y + 2.6)} ${r22(x + 2.8)},${r22(y + 1.6)} L${r22(x + 3)},${r22(y + 3.8)} Q${r22(x - 0.4)},${r22(y + 5.2)} ${r22(x - 3 - toe)},${r22(y + 3.9)} Z`;
        return pivot(bareFoot(c, x, y, 0).replace(/<line[^>]*>/g, "") + P(d, c.shoe) + E(x - 0.6, y + 2.4, 0.9, 0.55, H, 0.4) + P(`M${r22(x - 1.2)},${r22(y + 2)} l-.9,-.6 l0,1.2 Z M${r22(x - 1.2)},${r22(y + 2)} l.9,-.6 l0,1.2 Z`, S, 0.35));
      }
      let s = shoe(c, x, y, dir, 0);
      if (forme === "baskets") {
        const d = `M${r22(x - 3)},${r22(y)} L${r22(x + 3)},${r22(y)} L${r22(x + 3.3)},${r22(y + 3.6)} Q${r22(x - 0.4)},${r22(y + 5.4)} ${r22(x - 3.3 - toe)},${r22(y + 3.8)} Z`;
        const bord = `M${r22(x - 3.6 - toe)},${r22(y + 2)} Q${r22(x - 0.4)},${r22(y + 3.5)} ${r22(x + 3.6)},${r22(y + 1.8)}`;
        s += clip(`${c.uid}bk${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${bord} L${r22(x + 3.6)},${r22(y + 6)} L${r22(x - 3.6 - toe)},${r22(y + 6)} Z" fill="#F4EEFA"/><path d="${bord}" fill="none" stroke="${OUT}" stroke-width=".55"/>`) + P(d, "none") + (dir <= 0 ? `<path d="M${r22(x - 1.4)},${r22(y + 0.8)} l2.4,.4 M${r22(x - 1.4)},${r22(y + 1.9)} l2.4,.4" stroke="#F4EEFA" stroke-width=".6"/>` : "");
      }
      if (forme === "sabots") s += `<path d="M${r22(x - 3.4 - toe)},${r22(y + 4)} L${r22(x + 3.4)},${r22(y + 3.8)} L${r22(x + 3.4)},${r22(y + 5.5)} L${r22(x - 3.4 - toe)},${r22(y + 5.5)} Z" fill="#876055" stroke="${OUT}" stroke-width=".8"/>`;
      if (forme === "bottines") s = tige(3.2) + s;
      if (forme === "bottes") s = tige(7.4) + s;
      return pivot(s);
    }
    __name(chaussure, "chaussure");
    function body(c, ctx) {
      const { view, n, walk } = ctx;
      const k = c.k, bas = familleBas(c.o.bas), vrai = c.o.haut;
      const robeE = bas === "robeEntiere", haut = robeE ? null : familleHaut(c.o.haut);
      const ne = view === "ne", se = view === "se";
      const tucked = bas === "jupe" || bas === "salopette" || bas === "robe" || robeE;
      const hem = tucked ? 44.8 : 46.6;
      const seed = c.dechire && !tucked ? c.dechire + (ne ? 3 : se ? 7 : 0) : null;
      const T2 = torso(k, hem, seed, ne && c.brasLointain === "gauche");
      const top = robeE ? c.bas : c.top, topS = robeE ? c.basS : c.topS, topH = robeE ? c.basH : c.topH;
      const o = se ? 21.6 : 24;
      const sway = (ctx.sway || 0) * (c.os ? 0.3 : 1);
      const mxT = (k.sw + k.hw) / 2 + k.b, myT = (32.6 + hem) / 2;
      const ombre = /* @__PURE__ */ __name((y0, h, fill, extra = "") => se ? `<path d="M${r22(24 + k.sw - 2.6)},${y0} L${r22(24 + k.sw - 2.6)},32 Q${r22(24 + mxT - 2.9)},${r22(myT)} ${r22(24 + k.hw - 3.2)},${r22(y0 + h)} L48,${r22(y0 + h)} L48,${y0} Z" fill="${fill}"${extra}/>` : `<rect x="27.2" y="${y0}" width="14" height="${h}" fill="${fill}"${extra}/>`, "ombre");
      let s = "";
      if (bas === "jupe") s += skirt(c, view, sway, 43.6, c.skirtHem);
      if (bas === "robe" || robeE) s += skirt(c, view, sway, 43.6, c.robeHem);
      if (bas === "short") s += `<rect x="21.6" y="44.4" width="4.8" height="4.6" fill="${c.bas}"/>`;
      const mar = haut === "mariniere";
      s += P(T2, mar ? c.base : top);
      let inner = mar ? [35.2, 38, 40.8, 43.6, 46.4].map((y) => `<rect x="8" y="${y}" width="32" height="1.3" fill="${c.stripe}"/>`).join("") + ombre(30, 22, "rgba(10,4,24,.13)") : ombre(30, 22, topS) + `<path d="M8,${hem - 0.6} Q24,${hem + 2.4} 40,${hem - 0.6} L40,52 L8,52 Z" fill="${topS}"/><rect x="${r22(24 - k.sw + 0.1)}" y="34" width="1.3" height="10" rx="0.6" fill="${topH}"/>`;
      if (haut === "pull" || haut === "sweat") inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>` + (haut === "pull" ? [17, 20, 23, 26, 29, 32].map((x) => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join("") : "");
      const under = bas === "robe" || bas === "salopette" ? c.bas : c.tee;
      if (haut === "veste" && !ne) {
        inner += `<path d="M${o - 3.4},31.6 L${o + 3.4},31.6 L${o + 3},49 L${o - 3},49 Z" fill="${under}"/>` + L([o - 3.3, 32], [o - 2.9, 48.8], OUT, 0.8) + L([o + 3.3, 32], [o + 2.9, 48.8], OUT, 0.8);
      }
      if (haut === "sweat" && !ne) {
        const pk = `M${o - 5.2},40.6 L${o + 5.2},40.6 L${o + 6.4},${hem - 1.4} L${o - 6.4},${hem - 1.4} Z`;
        inner += P(pk, tone(top, 0.92), 0.7) + P(`M${o - 5.2},40.6 Q${o - 5.4},43 ${o - 6.4},${hem - 1.4} M${o + 5.2},40.6 Q${o + 5.4},43 ${o + 6.4},${hem - 1.4}`, "none", 0.6);
      }
      if (!robeE && !mar && (c.o.motifHaut === "raye" || c.o.motifHaut === "pois")) inner = inner.replace(/^/, motif(c.o.motifHaut, c.top2, c.uid));
      if (vrai === "gilet") inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>` + [17, 20, 23, 26, 29, 32].map((x) => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join("");
      const dosRond = ne && c.brasLointain === "gauche";
      if (dosRond && vrai === "debardeur" && !robeE) {
        const em = /* @__PURE__ */ __name((sg) => {
          const x0 = 24 + sg * (k.sw - 2.8), x1 = 24 + sg * (k.hw + 1.4);
          return `M${r22(x0)},30 L${r22(x0)},31.4 Q${r22(x0 + sg * 0.4)},37 ${r22(x1)},38.8 L${24 + sg * 24},38.8 L${24 + sg * 24},30 Z`;
        }, "em");
        const bord = /* @__PURE__ */ __name((sg) => {
          const x0 = 24 + sg * (k.sw - 2.8), x1 = 24 + sg * (k.hw + 1.4);
          return `M${r22(x0)},31.4 Q${r22(x0 + sg * 0.4)},37 ${r22(x1)},38.8`;
        }, "bord");
        inner += P(em(-1), c.skin, 0) + P(em(1), c.skin, 0) + P(bord(-1), "none", 0.8) + P(bord(1), "none", 0.8);
      }
      s += clip(`${c.uid}t`, T2, inner) + P(T2, "none");
      if (seed) s += dechirure([24 + k.hw, hem], [24, hem + 3], [24 - k.hw, hem], seed).tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
      if (c.o.bas === "jupePlissee") s += [-6, -3, 0, 3, 6].map((d) => L([24 + d * 0.9, 44.6], [24 + d * 1.25 + (ctx.sway || 0), c.skirtHem - 0.2], c.basS, 0.55)).join("");
      if (ne) {
        s += P("M24,33.8 L24,47.4", "none", 0.5);
        if (haut === "chemise" || haut === "veste") s += P("M17.6,31.4 Q24,34.4 30.4,31.4 L30,33.6 Q24,36.2 18,33.6 Z", topS, 0.8);
        if (haut === "sweat" && !c.o.accessoires.dessus) s += capucheRabattue(c.uid, view, reperes(c), top, topS);
        if (robeE) s += P("M17.6,31.4 Q24,34 30.4,31.4 L30,33.2 Q24,35.8 18,33.2 Z", "#F4EEFA", 0.8);
      } else if (robeE) {
        s += P(`M${o - 0.3},32.6 Q${o - 4.4},30.8 ${o - 5.4},32.8 Q${o - 4.6},35.8 ${o - 0.5},34.4 Z`, "#F4EEFA", 0.8) + P(`M${o + 0.3},32.6 Q${o + 4.4},30.8 ${o + 5.4},32.8 Q${o + 4.6},35.8 ${o + 0.5},34.4 Z`, "#F4EEFA", 0.8);
      } else if (haut === "chemise") {
        s += P(`M${o - 4.6},31.2 L${o},34.8 L${o - 1.6},36.4 Z`, "#F4EEFA", 0.8) + P(`M${o + 4.6},31.2 L${o},34.8 L${o + 1.6},36.4 Z`, "#F4EEFA", 0.8);
        s += L([o, 35], [o + (se ? -0.4 : 0), hem + 1], OUT, 0.6) + [38.4, 41.8, 45].filter((y) => y < hem).map((y) => E(o + 1, y, 0.55, 0.55, "#F4EEFA", 0.5)).join("");
      } else if (haut === "pull") {
        s += P(`M${o - 4},31.4 Q${o},34.6 ${o + 4},31.4 L${o + 4},32.8 Q${o},36 ${o - 4},32.8 Z`, topS, 0.8);
      } else if (haut === "veste") {
        s += P(`M${o - 3.4},31.6 L${o - 1.2},36.4 L${o - 4.6},34 Z`, topS, 0.8) + P(`M${o + 3.4},31.6 L${o + 1.2},36.4 L${o + 4.6},34 Z`, topS, 0.8);
      } else if (mar) {
        s += P(`M${o - 5.4},31.8 Q${o},33.4 ${o + 5.4},31.8`, "none", 0.8);
      } else if (vrai === "polo") {
        s += P(`M${o - 4.2},31.2 L${o},33.6 L${o - 1.8},35.4 Z`, tone(top, 0.92), 0.8) + P(`M${o + 4.2},31.2 L${o},33.6 L${o + 1.8},35.4 Z`, tone(top, 0.92), 0.8) + L([o, 33.8], [o, 38.4], OUT, 0.55) + E(o + 0.9, 35.4, 0.5, 0.5, "#F4EEFA", 0.45) + E(o + 0.9, 37.4, 0.5, 0.5, "#F4EEFA", 0.45);
      } else if (vrai === "debardeur") {
        s += P(`M${o - 3.8},31.2 Q${o},37 ${o + 3.8},31.2 Z`, c.skin, 0.8);
      } else if (haut === "tshirt") {
        s += P(`M${o - 3.2},31.4 Q${o},34.4 ${o + 3.2},31.4`, "none", 0.8);
      }
      if (vrai === "colRoule") s += P(`M${o - 4.2},29.4 L${o + 4.2},29.4 L${o + 4.6},33.4 Q${o},34.6 ${o - 4.6},33.4 Z`, top, 0.8) + [-2.4, -0.8, 0.8, 2.4].map((d) => L([o + d, 29.8], [o + d * 1.08, 33.4], topS, 0.45)).join("");
      if (vrai === "gilet" && !ne) s += [36.6, 39.8, 43].map((y) => E(o + 3.6, y, 0.55, 0.55, topH, 0.45)).join("");
      if (bas === "salopette") {
        s += P(`M${r22(24 - k.hw + 0.2)},43.2 L${r22(24 + k.hw - 0.2)},43.2 L${r22(24 + k.hw)},46.6 Q24,48 ${r22(24 - k.hw)},46.6 Z`, c.bas) + P(`M${r22(24 - k.hw + 1)},43.4 L${r22(24 - k.hw + 1.4)},46.2`, "none", 0.5);
        if (haut !== "veste" || ne) s += bretelles(c, view, o, true);
      }
      if (robeE) {
        const band = "M0,42.4 L48,42.4 L48,44.4 L0,44.4 Z";
        s += clip(`${c.uid}rc`, T2, P(band, c.basS, 0.6)) + P(T2, "none");
        if (ne) {
          s += P("M24,43.4 L22.6,47.6 L24.2,47 L25,47.8 Z", c.basS, 0.6) + P("M24,43.4 L25.6,47.4 L24.4,46.8 Z", c.basS, 0.6) + E(21.6, 42.9, 2.1, 1.25, c.basS, 0.7) + E(26.4, 42.9, 2.1, 1.25, c.basS, 0.7) + E(24, 43.3, 0.95, 0.95, c.bas, 0.6);
        }
      }
      if (bas === "robe" && (haut !== "veste" || ne)) {
        const d = ne ? "M0,40.2 Q24,41.6 48,40.2 L48,50 L0,50 Z" : `M${o - 6.6},36.6 Q${o},37.8 ${o + 6.6},36.6 L${r22(o + k.hw + 1.6)},45.8 L${r22(o - k.hw - 1.6)},45.8 Z`;
        s += clip(`${c.uid}rb`, T2, P(d, c.bas) + ombre(36, 12, c.basS, ' opacity="0.7"')) + P(T2, "none") + bretelles(c, view, o, false);
      }
      return s + couche(c, "dessus", ctx);
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
        const dessous = familleBas(c.o.bas) === "robe" || c.o.bas === "salopette";
        s += P(`M${o - 6.4},31 Q${o},35.6 ${o + 6.4},31 L${o + 8.2},32.6 Q${o},39 ${o - 8.2},32.6 Z`, c.topS, 0.9);
        if (!dessous) s += [-1.8, 1.8].map((d) => L([o + d, 35.2], [o + d * 1.2, 40], OUT, 1.5) + L([o + d, 35.2], [o + d * 1.2, 40], c.tee, 0.6) + E(o + d * 1.2, 40.3, 0.6, 0.6, c.tee, 0.5)).join("");
      }
      return s + couche(c, "cou", ctx);
    }
    __name(neck, "neck");
    function book(x, y) {
      return P(`M${x - 6},${y} L${x + 6},${y} L${x + 6},${y + 6.4} L${x - 6},${y + 6.4} Z`, "#7A4E2C", 0.9) + P(`M${x - 5.2},${y - 0.6} Q${x - 2.6},${y - 1.6} ${x},${y} Q${x + 2.6},${y - 1.6} ${x + 5.2},${y - 0.6} L${x + 5.2},${y + 5.4} Q${x + 2.6},${y + 4.6} ${x},${y + 5.8} Q${x - 2.6},${y + 4.6} ${x - 5.2},${y + 5.4} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.8], OUT, 0.6) + [1.6, 2.8, 4].map((d) => L([x - 4.2, y + d], [x - 1.2, y + d], "#C9B98F", 0.45) + L([x + 1.2, y + d], [x + 4.2, y + d], "#C9B98F", 0.45)).join("");
    }
    __name(book, "book");
    function pose({ pose: pose2, n, k }) {
      const dy = this.dy, e = this.k.sw - 8.5;
      const [shL, shR] = this.shoulders;
      if (pose2 === "salut" && this.os) return { open: true, right: arm(this, shR, [r22(shR[0] + 5.4 + k * 1.6), r22(shR[1] - 7.6 + k * 0.5)], [r22(shR[0] + 5.6), r22(shR[1] - 1)]) };
      if (pose2 === "salut") return { open: true, right: arm(this, shR, lerp([37.4 + e * 0.64, 25.4 + dy], [38.8 + e * 0.64, 27.4 + dy], k)) };
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
    __name(pose, "pose");
    var up = /* @__PURE__ */ __name((f, dy) => dy ? (cc, ctx, act) => {
      const s = f(cc, ctx, act);
      return s ? `<g transform="translate(0 ${dy})">${s}</g>` : "";
    } : f, "up");
    function avatar(choixAvatar = {}, opts = {}) {
      const o = choix.auGenre(verifier(choixAvatar));
      const k0 = CORPS[o.silhouette], dy = TAILLE[o.taille];
      const k = o.genre === "homme" ? { ...k0, sw: r22(k0.sw + 1.6), hw: r22(k0.hw - 0.6), arm: r22(k0.arm + 0.3) } : { ...k0, sw: r22(k0.sw - 0.3), hw: r22(k0.hw + 0.4) };
      const skin = couleur("peau", o.peau);
      const hair = { mur: mix(couleur("cheveux", o.cheveux), "#CFCBC6", 0.22), age: mix(couleur("cheveux", o.cheveux), "#DAD7D2", 0.62) }[o.age] || couleur("cheveux", o.cheveux), meche = couleur("cheveux", o.couleurMeches);
      const top = couleur("tissus", o.couleurHaut);
      const bas = couleur("tissus", o.couleurBas);
      const shoeC = couleur("tissus", o.chaussures);
      const fb = familleBas(o.bas);
      const nues = fb === "short" || fb === "jupe" || fb === "robe" || o.bas === "robeEntiere";
      const sp = (k.hw - 10.2) * 0.45;
      const legLen = 56.5 - (44.5 + dy);
      const robe = o.bas === "robeEntiere";
      const mar = !robe && o.haut === "mariniere";
      const claires = clarte(top) > 0.8;
      const base = mar ? claires ? "#2D3767" : "#ECE4F4" : top;
      const [hh, hs] = hsl(hair);
      const acc = Object.fromEntries(Object.entries(o.accessoires).map(([place, a]) => [place, couleursAccessoire(a)]));
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
        eye: couleur("yeux", o.yeux),
        cheek: o.joues === "roses" ? "#F29E9A" : tone("#F29E9A", 1.18),
        freckle: tone(skin, 0.7),
        levres: o.levres === "naturelles" ? null : couleur("levres", o.levres),
        top,
        topS: tone(top, 0.82),
        topH: tone(top, 1.28),
        tee: "#ECE4F4",
        base,
        stripe: top,
        bas,
        basS: tone(bas, 0.78),
        basH: tone(bas, 1.25),
        sleeve: robe ? bas : base,
        armW: k.arm,
        cuff: robe ? "#F4EEFA" : { pull: tone(top, 0.82), sweat: tone(top, 0.82), veste: tone(top, 0.82), chemise: "#F4EEFA", mariniere: top, colRoule: tone(top, 0.82), gilet: tone(top, 0.82), polo: tone(top, 0.92) }[o.haut] || null,
        sleeves: robe || o.haut === "tshirt" || o.haut === "polo" || mar ? "court" : void 0,
        top2: couleur("tissus", o.couleurHaut2),
        bas2: couleur("tissus", o.couleurBas2),
        leg: nues ? skin : bas,
        legS: nues ? tone(skin, 0.88) : tone(bas, 0.78),
        legW: nues ? k.legW - 0.9 : k.legW,
        hip: r22(44.5 + dy),
        ground: 56.5,
        skirtHem: r22(44.5 + legLen * 0.6),
        robeHem: r22(44.5 + legLen * (o.bas === "robeLongue" ? 0.9 : 0.66)),
        shortLen: r22(legLen * (o.bas === "bermuda" ? 0.84 : 0.64)),
        coatHem: r22(44.5 + legLen * 0.45),
        shoe: shoeC,
        shoeS: tone(shoeC, 0.72),
        shoeH: tone(shoeC, 1.25),
        legX: { front: [20.5 - sp, 27.5 + sp], se: [20 - sp, 27.6 + sp], ne: [21 - sp, 28 + sp] },
        shoulders: [[24 - (k.sw - 0.5), 34 + dy], [24 + (k.sw - 0.5), 34 + dy]],
        hands: [[24 - (k.hw - 0.4 + k.b * 0.6), 45.2 + dy], [24 + (k.hw - 0.4 + k.b * 0.6), 45.2 + dy]],
        backItems: up((cc, ctx) => (ctx.view === "ne" ? nuque(cc) : "") + (ctx.sway ? `<g transform="translate(${r22(-ctx.sway * 1.6)} 0)">${hairBehindBody(cc, ctx.view)}</g>` : hairBehindBody(cc, ctx.view)) + couche(cc, "derriere", ctx), dy),
        overArms: up((cc, ctx) => couche(cc, "surBras", ctx), dy),
        body: up(body, dy),
        neck: up(neck, dy),
        head: up(head, dy),
        pose,
        // les bras habillés et les jambes : les règles canoniques (manche.js, jambe.js)
        bras,
        jambe,
        // de trois quarts, le bras gauche est le bras lointain (la tête et le corps se tournent vers la gauche de l'écran)
        brasLointain: "gauche",
        // l'expression du visage au repos (troupe.js : frame)
        repos: o.expression
      };
      c.degrades = {};
      if (o.motifHaut === "degrade" && top !== bas) c.degrades[top.toUpperCase()] = [couleur("tissus", o.couleurHaut2), r22(31 + dy), r22(47 + dy)];
      if (o.motifBas === "degrade" && !c.degrades[bas.toUpperCase()]) c.degrades[bas.toUpperCase()] = [couleur("tissus", o.couleurBas2), r22(44 + dy), 60];
      if (o.haut === "debardeur" && !robe) Object.assign(c, { sleeve: skin, cuff: null, sleeves: void 0, brasNu: true });
      if (o.formeChaussures && o.formeChaussures !== "souliers") c.foot = (cc, x, y, dir, tilt) => (fb === "short" ? shortLeg(cc, x, false, y) : "") + chaussure(cc, o.formeChaussures, x, y, dir, tilt);
      else if (fb === "short") c.foot = (cc, x, y, dir, tilt) => shortLeg(cc, x, false, y) + shoe(cc, x, y, dir, tilt);
      for (const place of ["dessus", "mains"]) {
        const a = o.accessoires[place];
        if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](acc[place], c));
      }
      if (o.accessoires.pieds) c.foot = (cc, x, y, dir, tilt) => (fb === "short" ? shortLeg(cc, x, false, y) : "") + couche(cc, "pieds", {}, [x, y, dir, tilt]);
      if (o.accessoires.main) {
        c.hold = (cc, hand, ctx) => couche(cc, "main", ctx, hand);
        c.hold.derriereDeDos = true;
      }
      return opts.os === false ? c : avecOs(c);
    }
    __name(avatar, "avatar");
    module.exports = { avatar, shortLeg, familleHaut, familleBas, ...choix };
  }
});

// atelier/tenues.js
var require_tenues = __commonJS({
  "atelier/tenues.js"(exports, module) {
    var { couche, habiller } = require_avatar_accessoires();
    var { OUT, P, L, clip, r2: r22 } = require_troupe();
    var { tone } = require_avatar_choix();
    var { fondre } = require_couleurs();
    var HIVER = fondre({
      aster: { tete: ["bonnet", ["#3E5A8C", "#F1E6CC"]], cou: ["echarpe", ["#C8463A", "#F1E6CC"]], mains: ["moufles", ["#3E5A8C", "#F1E6CC"]], sansFoulard: true },
      rivet: { tete: ["cacheOreilles", ["#C8463A", "#C8463A"]], cou: ["echarpe", ["#E8A23A", "#F1E6CC"]], mains: ["moufles", ["#C8463A", "#F1E6CC"]] },
      cannelle: { dessus: ["chale", ["#7A3E5E", "#F1E6CC"]], mains: ["moufles", ["#C8463A", "#F1E6CC"]] },
      ondin: { cou: ["echarpe", ["#F2C04B", "#3E78C8"]], mains: ["moufles", ["#F2C04B", "#3E78C8"]], pieds: ["bottesFourrees", ["#5E3A22", "#F1E6CC"]] },
      sylve: { dessus: ["etole", ["#E8DCC4"]], mains: ["moufles", ["#6E7A44", "#E8DCC4"]], pieds: ["bottesFourrees", ["#8A6A44", "#E8DCC4"]] },
      galet: { dessus: ["pelerine", ["#6E5A8A", "#E8DCC4"]], mains: ["moufles", ["#C8463A", "#F1E6CC"]] },
      melisse: { cou: ["echarpe", ["#E3C27A", "#5A4A8A"]], mains: ["moufles", ["#5A4A8A", "#E3C27A"]] }
    });
    var slug = /* @__PURE__ */ __name((s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(), "slug");
    function enHiver(m) {
      const { sansFoulard, ...t } = HIVER[slug(m.name)];
      const c = habiller(m, Object.fromEntries(Object.entries(t).map(([place, [id, couleurs]]) => [place, { id, couleurs }])), "hv");
      if (sansFoulard) c.neck = (cc, ctx) => couche(cc, "cou", ctx);
      return c;
    }
    __name(enHiver, "enHiver");
    function capuche(uid, view, [col, bord]) {
      const S = tone(col, 0.82), k = view === "se" ? -0.8 : 0, X = /* @__PURE__ */ __name((x) => r22(x + k), "X"), reflet = "rgba(255,255,255,.55)";
      const out = `M${X(9.4)},24 Q${X(8.6)},4.8 ${X(24)},4.6 Q${X(39.4)},4.8 ${X(38.6)},24 Q${X(38.4)},30.8 ${X(34.8)},33 Q${X(24)},34.6 ${X(13.2)},33 Q${X(9.6)},30.8 ${X(9.4)},24 Z`;
      if (view === "ne") {
        return P(out, col) + clip(`${uid}cp${view}`, out, `<rect x="27" y="2" width="16" height="34" fill="${S}"/>` + L([20, 8], [19, 20], reflet, 0.9)) + P(out, "none") + P("M24,4.8 Q24.6,18 24,33.6", "none", 0.6) + P("M14,30.6 Q24,33.6 34,30.6", "none", 0.6);
      }
      const fx = view === "se" ? 22.6 : 24, rx = view === "se" ? 10.4 : 10.8, ry = 9.8, cy = 22.4;
      const trou = `M${r22(fx - rx)},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0 Z`;
      const d = `${out} ${trou}`;
      return `<path d="${d}" fill="${col}" fill-rule="evenodd"/><clipPath id="${uid}cp${view}"><path d="${d}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${uid}cp${view})"><rect x="${X(30)}" y="2" width="14" height="34" fill="${S}"/>${L([X(14), 11], [X(17.6), 7.4], reflet, 1)}</g><path d="${d}" fill="none" fill-rule="evenodd" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><ellipse cx="${fx}" cy="${cy}" rx="${r22(rx + 0.5)}" ry="${r22(ry + 0.5)}" fill="none" stroke="${OUT}" stroke-width="2.6"/><ellipse cx="${fx}" cy="${cy}" rx="${r22(rx + 0.5)}" ry="${r22(ry + 0.5)}" fill="none" stroke="${bord}" stroke-width="1.3"/>`;
    }
    __name(capuche, "capuche");
    var PLUIE = fondre({
      aster: { capuche: ["#F2C04B", "#FFE49A"], bottes: "#C8463A" },
      ondin: { capuche: ["#3D7CC9", "#A9CBEF"], bottes: "#F2C04B" },
      rivet: { cire: "#E8873A", bottes: "#3E5A8C" },
      cannelle: { cire: "#4E8F5A", bottes: "#C8463A" },
      sylve: { cire: "#6FA3D9", bottes: "#F2C04B", sansCape: true },
      galet: { cire: "#C0453A", bottes: "#2E2A2A" },
      melisse: { cire: "#5A4A8A", bottes: "#7EC4A0" }
    });
    function sousLaPluie(m) {
      const t = PLUIE[slug(m.name)];
      const objets = { pieds: { id: "bottesPluie", couleurs: [t.bottes] } };
      if (t.cire) objets.dessus = { id: "cire", couleurs: [t.cire], ouvert: true };
      const c = habiller(m, objets, "pl");
      if (t.capuche) {
        const f = /* @__PURE__ */ __name((cc, ctx, nom) => nom === "tete" ? capuche(cc.uid, ctx.view, t.capuche) : "", "f");
        f.capuche = true;
        c.coiffe = f;
      }
      if (t.sansCape) c.noCape = true;
      return c;
    }
    __name(sousLaPluie, "sousLaPluie");
    module.exports = { enHiver, HIVER, sousLaPluie, PLUIE };
  }
});

// atelier/naufrage.js
var require_naufrage = __commonJS({
  "atelier/naufrage.js"(exports, module) {
    var { OUT, P, E, L, clip, bareFoot, shoe, r2: r22 } = require_troupe2();
    var { jambeRetroussee } = require_jambe();
    var { delave: fade } = require_couleurs();
    var recolor = /* @__PURE__ */ __name((str, map) => str.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => map[m.toUpperCase()] || m), "recolor");
    var CANVAS = { cloth: "#E6DCC3", shade: "#C9BB98", seam: "#B3A27C", rope: "#B08850", ropeS: "#86663A" };
    var cord = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r22(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`, "cord");
    var pts = /* @__PURE__ */ __name((a) => a.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L"), "pts");
    function tatter(x, y, color, w = 2.2, s = 1, band = null) {
      const m = Math.round(x * 10) % 2 ? 1 : -1, X = /* @__PURE__ */ __name((t) => r22(x + m * t), "X");
      const bottom = `L${X(-w)},${r22(y - 0.1)} Q${X(-w * 0.74)},${r22(y + 1.9 * s)} ${X(-w * 0.22)},${r22(y + 3.1 * s)} Q${X(w * 0.06)},${r22(y + 3.7 * s)} ${X(w * 0.3)},${r22(y + 2.5 * s)} L${X(w * 0.52)},${r22(y + 1.2 * s)} Q${X(w * 0.76)},${r22(y + 1.9 * s)} ${X(w)},${r22(y + 0.3 * s)}`;
      const d = `M${X(-w)},${r22(y - 1)} ${bottom} L${X(w)},${r22(y - 1)} Z`;
      const id = `tt${Math.round(x * 10)}${Math.round(y * 10)}`;
      const raie = band ? `<clipPath id="${id}"><path d="${d}"/></clipPath><rect x="${r22(x - w - 1)}" y="${r22(y + 0.7 * s)}" width="${r22(2 * w + 2)}" height="${r22(0.95 * s)}" fill="${band}" clip-path="url(#${id})"/>` : "";
      const tip = [x + m * -w * 0.12, y + 3.4 * s];
      return `<path d="${d}" fill="${color}"/>` + raie + `<path d="M${X(-w * 0.62)},${r22(y + 1.5 * s)} Q${X(-w * 0.2)},${r22(y + 2.3 * s)} ${X(w * 0.24)},${r22(y + 1.9 * s)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round" opacity=".28"/><path d="M${bottom.slice(1)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/><path d="M${r22(tip[0])},${r22(tip[1])} q${r22(m * 0.45)},0.8 ${r22(-m * 0.1)},1.7" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`;
    }
    __name(tatter, "tatter");
    function hole(x, y, r, color) {
      const a = Array.from({ length: 9 }, (_, i) => {
        const t = i / 9 * Math.PI * 2, k = [1, 0.86, 1, 0.9, 1, 0.84, 0.98, 0.9, 1][i];
        return [x + Math.cos(t) * r * k, y + Math.sin(t) * r * 0.72 * k];
      });
      return `<path d="M${pts(a)} Z" fill="${color}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/><path d="M${r22(x + r * 0.2)},${r22(y + r * 0.66)} q0.3,0.8 -0.2,1.5" fill="none" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round"/>`;
    }
    __name(hole, "hole");
    var rip = /* @__PURE__ */ __name((x, y, len = 2.6) => `<path d="M${r22(x - len / 2)},${r22(y)} L${r22(x - len / 6)},${r22(y + 0.7)} L${r22(x + len / 6)},${r22(y - 0.5)} L${r22(x + len / 2)},${r22(y + 0.3)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`, "rip");
    function weed(path, leaves = []) {
      return cord(path, 1.7, "#5C8A45") + `<path d="${path}" fill="none" stroke="#86B562" stroke-width="0.5" stroke-linecap="round" stroke-dasharray="1.2 1.6"/>` + leaves.map(([x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + P("M0,0 Q1.6,2 0,4.4 Q-1.6,2 0,0 Z", "#6E9E50", 0.7) + L([0, 0.6], [0, 3.6], "#4E7A3A", 0.4) + "</g>").join("");
    }
    __name(weed, "weed");
    var smudge = /* @__PURE__ */ __name((x, y, color = "#8A6A50") => `<ellipse cx="${r22(x)}" cy="${r22(y)}" rx="1.8" ry="0.85" fill="${color}" opacity="0.6" transform="rotate(-14 ${r22(x)} ${r22(y)})"/><ellipse cx="${r22(x + 1.7)}" cy="${r22(y + 0.7)}" rx="0.55" ry="0.4" fill="${color}" opacity="0.55"/>`, "smudge");
    function rolledFoot(cuff, cuffS) {
      return (c, x, y, dir, tilt) => {
        if (c.jambe) return jambeRetroussee(c, x, y, cuff, bareFoot(c, x, y, dir, tilt));
        const w = c.legW;
        const shin = `<rect x="${r22(x - w / 2 + 0.3)}" y="${r22(y - 3.2)}" width="${r22(w - 0.6)}" height="4.2" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/><rect x="${r22(x - w / 2 + 0.85)}" y="${r22(y - 2.6)}" width="${r22(w - 1.7)}" height="3.8" fill="${c.skin}"/>`;
        const band = `<rect x="${r22(x - w / 2 - 0.5)}" y="${r22(y - 4.6)}" width="${r22(w + 1)}" height="2" rx="0.8" fill="${cuff}" stroke="${OUT}" stroke-width="1"/>` + L([x - w / 2 + 0.2, y - 3.4], [x + w / 2 - 0.2, y - 3.4], cuffS, 0.5);
        return shin + bareFoot(c, x, y, dir, tilt) + band;
      };
    }
    __name(rolledFoot, "rolledFoot");
    function cape(sh, view, uid, cloth = CANVAS, extra = "") {
      const [[x0, y], [x1]] = sh;
      const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      const k = view === "se" ? -1.6 : 0;
      if (view === "ne") {
        const d = `M${r22(cx - hw + 1)},${r22(y - 3.4)} Q${cx},${r22(y - 1.4)} ${r22(cx + hw - 1)},${r22(y - 3.4)} Q${r22(cx + hw + 2.8)},${r22(y - 2.4)} ${r22(cx + hw + 3)},${r22(y + 2)} L${r22(cx + hw + 2.6)},${r22(y + 8)} L${r22(cx + hw + 0.4)},${r22(y + 6.8)} L${r22(cx + 5)},${r22(y + 9)} L${r22(cx + 2)},${r22(y + 7.4)} L${r22(cx - 1.6)},${r22(y + 9.2)} L${r22(cx - 4.6)},${r22(y + 7.2)} L${r22(cx - hw + 0.4)},${r22(y + 8.6)} L${r22(cx - hw - 2.6)},${r22(y + 7.6)} L${r22(cx - hw - 3)},${r22(y + 2)} Q${r22(cx - hw - 2.8)},${r22(y - 2.4)} ${r22(cx - hw + 1)},${r22(y - 3.4)} Z`;
        return P(d, cloth.cloth) + clip(`${uid}vo`, d, extra + `<rect x="${r22(cx + 3)}" y="${r22(y - 6)}" width="14" height="20" fill="${cloth.shade}" opacity="0.8"/><path d="M${r22(cx - hw - 4)},${r22(y + 3.4)} Q${cx},${r22(y + 5)} ${r22(cx + hw + 4)},${r22(y + 3.4)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, "none");
      }
      const far = view === "se" ? 0.75 : 1;
      const panel = /* @__PURE__ */ __name((m, f) => {
        const X = /* @__PURE__ */ __name((u) => r22(cx + k + m * u * f), "X");
        return `M${X(1.4)},${r22(y - 3.6)} Q${X(hw + 1.6)},${r22(y - 4)} ${X(hw + 2.8)},${r22(y + 1.2)} L${X(hw + 2.6)},${r22(y + 7)} L${X(hw + 1)},${r22(y + 5.9)} L${X(hw - 0.6)},${r22(y + 7.4)} L${X(hw - 2.2)},${r22(y + 5.8)} L${X(4.4)},${r22(y + 6.6)} Q${X(3.6)},${r22(y + 2.8)} ${X(0.7)},${r22(y + 0.6)} Z`;
      }, "panel");
      const L1 = panel(-1, 1), R1 = panel(1, far);
      const shadeR = `<rect x="${r22(cx + k + 2)}" y="${r22(y - 6)}" width="16" height="20" fill="${cloth.shade}" opacity="0.8"/>`;
      const seam = /* @__PURE__ */ __name((m) => `<path d="M${r22(cx + k + m * (hw + 2))},${r22(y + 1.6)} L${r22(cx + k + m * 4.4)},${r22(y + 3.8)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`, "seam");
      let s = P(L1, cloth.cloth) + clip(`${uid}vl`, L1, extra + seam(-1)) + P(L1, "none");
      s += P(R1, cloth.cloth) + clip(`${uid}vr`, R1, extra + shadeR + seam(far)) + P(R1, "none");
      const kx = cx + k;
      s += cord(`M${r22(kx - 1.6)},${r22(y + 0.4)} L${r22(kx - 2.4)},${r22(y + 4.4)}`, 0.8, cloth.rope) + cord(`M${r22(kx + 1.4)},${r22(y + 0.4)} L${r22(kx + 2)},${r22(y + 4)}`, 0.8, cloth.rope);
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
        // la lumière (troupe.lumiere) cherche les couleurs principales : les délavées, comme dans le dessin
        ...Object.fromEntries(["top", "bas", "base", "coat", "hair", "buzz", "hand"].filter((k) => typeof c[k] === "string").map((k) => [k, map[c[k].toUpperCase()] || c[k]])),
        teintes: (c.teintes || []).map((x) => map[x.toUpperCase()] || x),
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
          for (const [x, y, col, w, k, band] of spec.tatters && spec.tatters[v] || []) s += tatter(x + sway, ctx.seatDy ? Math.min(y, 63.5 - ctx.seatDy - 3.7 * (k ?? 1) - 0.45) : y, F(col), w, k, band ? F(band) : null);
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

// personnages/aster.js
var require_aster = __commonJS({
  "personnages/aster.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var { fondre } = require_couleurs();
    var relevee = /* @__PURE__ */ __name((c) => !!(c.coiffe && c.coiffe.capuche), "relevee");
    var C = fondre({
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
    });
    function spyglass(x, y, rot, len = 9) {
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})"><rect x="-1.5" y="${-len / 2}" width="3" height="${len}" rx="0.8" fill="${C.brass}" stroke="${OUT}" stroke-width="0.9"/><rect x="-1.1" y="${-len / 2 + 0.6}" width="0.8" height="${len - 1.2}" rx="0.4" fill="${C.brassH}"/><rect x="-1.95" y="${-len / 2 - 0.4}" width="3.9" height="2.1" rx="0.6" fill="${C.brassS}" stroke="${OUT}" stroke-width="0.8"/><line x1="-1.5" y1="0.8" x2="1.5" y2="0.8" stroke="${C.brassS}" stroke-width="0.7"/></g>`;
    }
    __name(spyglass, "spyglass");
    function heldGlass(x, y, rot, ext) {
      const seg = [[2.2, 1.15, C.brassS], [1.2 + 3 * ext, 1.5, C.brass], [4.8, 1.9, C.brass]];
      let s = "", x0 = 0;
      for (const [len, h, fill] of seg) {
        s += `<rect x="${r22(x0 - len)}" y="${-h}" width="${r22(len)}" height="${2 * h}" rx="0.5" fill="${fill}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x0 - len + 0.5)}" y="${r22(-h + 0.4)}" width="${r22(Math.max(len - 1, 0.2))}" height="0.6" rx="0.3" fill="${C.brassH}"/>`;
        x0 -= len;
      }
      s += `<rect x="${r22(x0 - 1.6)}" y="-2.35" width="2" height="4.7" rx="0.6" fill="${C.brassS}" stroke="${OUT}" stroke-width="0.9"/>`;
      return `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">${s}</g>`;
    }
    __name(heldGlass, "heldGlass");
    var twinkle = /* @__PURE__ */ __name((x, y, r) => P(`M${x},${r22(y - r)} Q${r22(x + r * 0.2)},${r22(y - r * 0.2)} ${r22(x + r)},${y} Q${r22(x + r * 0.2)},${r22(y + r * 0.2)} ${x},${r22(y + r)} Q${r22(x - r * 0.2)},${r22(y + r * 0.2)} ${r22(x - r)},${y} Q${r22(x - r * 0.2)},${r22(y - r * 0.2)} ${x},${r22(y - r)} Z`, "#FFF6C8", 0.6), "twinkle");
    var COAT = "M15.5,32.5 Q24,29.8 32.5,32.5 L35,47.5 Q24,51 13,47.5 Z";
    var aster = {
      name: "Aster",
      uid: "as",
      teintes: [C.hair, C.coat, C.scarf, C.brass],
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
        let s = P(COAT, C.coat);
        s += clip(`${c.uid}c`, COAT, `<rect x="${shadeX}" y="30" width="10" height="22" fill="${C.coatS}"/><path d="M13,47 Q24,50.2 35,47 L35,52 L13,52 Z" fill="${C.coatS}"/><rect x="14.6" y="34" width="1.4" height="12" rx="0.7" fill="${C.coatH}"/>`);
        s += P(COAT, "none");
        if (view === "ne") {
          s += P("M24,34 L24,49.4", "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s;
        }
        const o = view === "front" ? 24 : 21.5;
        s += P(`M${o},33.2 L${o + (view === "se" ? -0.6 : 0)},49.6`, "none", 0.9);
        for (const y of [37, 41, 45]) s += E(o + 1.6, y, 0.75, 0.75, C.coatS, 0.6);
        s += P(`M${view === "se" ? 15.8 : 16.2},42.5 L${view === "se" ? 19.2 : 20},42.3`, "none", 0.8);
        if (pose !== "action") s += spyglass(29.4, 44.8, -14);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") {
          return P("M16.5,31 Q24,34.6 31.5,31 L32,34 Q24,37.6 16,34 Z", C.scarf) + P("M28.5,34.6 L31.4,41.2 L28.4,41.6 L27,35.4 Z", C.scarf) + P("M29,36 L30.6,40.4", "none", 0.6);
        }
        const kx = view === "se" ? 18.2 : 20.5;
        return P("M16.5,31 Q24,34.8 31.5,31 L32,34 Q24,38 16,34 Z", C.scarf) + P("M17.4,33.6 Q24,36.8 30.8,33.4", "none", 0.6) + P(`M${kx},35.2 L${kx - 2},42 L${kx + 1.2},41.4 L${kx + 1.6},36 Z`, C.scarf) + E(kx + 0.6, 35.6, 1.9, 1.5, C.scarfS, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const tufts = P("M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z", C.hair) + P("M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z", C.hair);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z";
          s += (c.coiffe ? "" : tufts) + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="32" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M17,11 Q24,7.6 31,11", "none", 0.8) + P("M19.6,12.6 Q18.8,20 20.4,27.6", "none", 0.6) + P("M24.4,11.8 Q25.2,19.4 24.2,28.4", "none", 0.6);
          s += L([18, 9.6], [23.4, 8.8], C.hairH, 1.3);
          if (!relevee(c)) s += P("M14.6,11.6 Q6.6,10.8 6.4,19 Q8.6,16.8 12.6,17.8 Z", C.hair) + E(13.4, 13.4, 1.5, 1.4, C.scarf, 0.9);
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          return s;
        }
        const se = view === "se";
        const back = se ? "M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z" : "M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z";
        const fx = se ? 22.6 : 24;
        const face = `M${fx - (se ? 11.2 : 11.6)},21.6 a${se ? 11.2 : 11.6},10.4 0 1,0 ${2 * (se ? 11.2 : 11.6)},0 a${se ? 11.2 : 11.6},10.4 0 1,0 ${-2 * (se ? 11.2 : 11.6)},0 Z`;
        const bangs = se ? "M11.6,19 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L32.6,14.8 L31,18.6 L27.6,13.8 L24.4,18 L21.4,13.6 L18.2,17.8 L15.6,14.2 L13.4,19.4 Z" : "M12,18.6 Q13,8 24,8 Q35,8 36,18.6 L33,15 L31,19 L28,14 L25,18.4 L22,14 L19,18 L16,14.4 L14,19.2 Z";
        if (!relevee(c)) s += P("M33.4,11.6 Q41.4,10.8 41.6,19 Q39.4,16.8 35.4,17.8 Z", C.hair) + E(34.6, 13.4, 1.5, 1.4, C.scarf, 0.9);
        if (!c.coiffe) s += tufts;
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="25" width="32" height="8" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]] : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
        const cheeks = se ? [[15.2, 1.9], [28.2, 1.5]] : [[16.6, 2], [31.4, 2]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.15, C.cheek, 0)).join("") + fr.map(([x, y]) => E(x, y, 0.38, 0.38, C.freckle, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], C.hairH, 1.3);
        if (c.coiffe) s += c.coiffe(c, ctx, "tete");
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.35,
          brow: "#6B2620",
          browY: -4.1,
          browW: 1.05,
          ...TRAITS.femme,
          mouth: [se ? 20.8 : 24, 27],
          mw: 1.7,
          mouthC: C.mouth,
          tongue: "#E07A72",
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.4)} Q${r22(mx + 0.3)},${r22(my + 1.2)} ${r22(mx + 1.6)},${my}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 12.6 : 13.4, 12.4],
          anger: [40, 6.8],
          zz: [36.4, 5.8]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
        }
        const ext = n === 0 ? 0 : 1;
        const near = arm(this, [15.4, 33.2], [12.6, 24.8], [10.2, 31.4]);
        const hip = arm(this, [32, 34], [32.6, 42.8], [37.4, 38.4]);
        return { expr: "neutre", eyeMode: "wink", left: "", right: hip, over: heldGlass(16.4, 22.8, 4, ext) + near + (ext ? twinkle(2.8, 18.6, 1.9) : "") };
      }
    };
    module.exports = aster;
  }
});

// personnages/refonte/lorena_bras.js
var require_lorena_bras = __commonJS({
  "personnages/refonte/lorena_bras.js"(exports, module) {
    var { OUT, W, E, r2: r22 } = require_troupe();
    var { poserBras, anneau, ligneBras, pointLigne, sousLigne, longueurLigne } = require_membres();
    var pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt");
    var trait = /* @__PURE__ */ __name((d, color, w, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "trait");
    var mix = /* @__PURE__ */ __name((x, y, t) => "#" + [16, 8, 0].map((k) => Math.round((parseInt(x.slice(1), 16) >> k & 255) * (1 - t) + (parseInt(y.slice(1), 16) >> k & 255) * t).toString(16).padStart(2, "0")).join("").toUpperCase(), "mix");
    var forme = /* @__PURE__ */ __name((pts, fill, w = 0.6) => `<path d="M${pts.map(pt).join(" L")} Z" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`, "forme");
    function fabriquerBras({ pal, marks }) {
      return /* @__PURE__ */ __name(function bras(c, a, b, elbow, main, partie = "tout") {
        ({ b, elbow, main } = poserBras(c, a, b, elbow, main));
        const K = pal(c), M = marks(c), t = c.tenue || "cire";
        const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
        const pts = sousLigne(ligne, tot - 1.1, 0), len = tot - 1.1;
        const ici = /* @__PURE__ */ __name((k) => {
          const { p, u: [ux, uy] } = pointLigne(pts, k);
          let nx = -uy, ny = ux;
          if (nx > 0) {
            nx = -nx;
            ny = -ny;
          }
          return { p, ux, uy, nx, ny };
        }, "ici");
        const off = /* @__PURE__ */ __name((k, o, dk = 0) => {
          const { p, ux, uy, nx, ny } = ici(k);
          return [p[0] + nx * o + ux * dk, p[1] + ny * o + uy * dk];
        }, "off");
        const chemin = /* @__PURE__ */ __name((list) => "M" + list.map(pt).join(" L"), "chemin");
        const view = c.view || "front", gauche = a[0] < 24;
        const droit = (view === "ne" ? !gauche : gauche) !== !!c.miroir;
        const ombre = !gauche;
        const w = c.armW, fw = w * 0.8;
        const chemise = t === "chemise";
        const tissu = ombre ? chemise ? K.shirtS : K.coatS : c.sleeve;
        const arrachee = c.sleeves === "torn", retroussee = !arrachee && (c.sleeves === "roll" || M.wrist && droit);
        const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : len;
        const coupe = arrachee ? Math.min(4.4, avb * 0.5) : retroussee ? Math.min(5.8, avb * 0.55) : 0;
        const bande = arrachee ? c.bandage && c.bandage === "right" === droit : retroussee && M.wrist && droit;
        const dManche = chemin(sousLigne(pts, len, coupe));
        const long = /* @__PURE__ */ __name((k0, k1, o) => chemin(sousLigne(pts, k0, k1).map((q, i, l) => {
          const k = k0 + (k1 - k0) * i / Math.max(1, l.length - 1), { nx, ny } = ici(k);
          return [q[0] + nx * o, q[1] + ny * o];
        })), "long");
        let s = "";
        if (partie !== "devant") {
          s += trait(dManche, OUT, w + W * 2) + trait(dManche, tissu, w);
          const haut = elbow ? len - avb : len - (Math.max(coupe, 2) + 1.5), kA = len - haut * 0.18, kB = len - haut * 0.7;
          s += ombre ? trait(long(kA, kB, -w * 0.32), K.rim, 0.6, ' opacity=".75"') : trait(long(kA, kB, w * 0.22), chemise ? "#FFFFFF" : K.coatH, 0.85, ' opacity=".8"');
          if (elbow) {
            const k = avb;
            s += trait(`M${pt(off(k, w * 0.15))} Q${pt(off(k, 0, 0.9))} ${pt(off(k, -w * 0.3))}`, OUT, 0.42, ' opacity=".35"');
          } else if (!coupe) {
            const side = gauche ? -1 : 1;
            s += trait(`M${pt(off(len * 0.5, side * -w * 0.42))} L${pt(off(len * 0.5, side * -w * 0.08, 0.8))}`, OUT, 0.4, ' opacity=".3"');
          }
          if (!coupe) {
            const poignet = mix(tissu, OUT, 0.22), r = anneau(pts, 3.6, 1.6, w / 2), [bx, by] = r.bombe;
            s += `<path d="${r.d}" fill="${poignet}"/>` + trait(r.bord(3.6), OUT, 0.45);
            if (t === "cire" || t === "ouvert") {
              const P4 = /* @__PURE__ */ __name((dk, o) => {
                const q = off(2.8, o, dk);
                return [q[0] + bx * 0.85, q[1] + by * 0.85];
              }, "P4");
              s += forme([P4(-0.55, w * 0.55), P4(0.55, w * 0.55), P4(0.55, -w * 0.15), P4(-0.55, -w * 0.15)], c.sleeve, 0.45);
            } else {
              const m = off(2.7, w * 0.18);
              s += E(m[0] + bx * 0.9, m[1] + by * 0.9, 0.42, 0.42, t === "vareuse" ? K.brass : "#F7F2E6", 0.35);
            }
          }
        }
        if (partie === "derriere") return s;
        if (coupe) {
          const h = w / 2 + 0.5;
          const fd = chemin(sousLigne(pts, coupe, 0));
          s += trait(fd, OUT, fw + W * 2) + trait(fd, c.skin, fw);
          if (bande) {
            const hh = fw / 2 + 0.25;
            for (const k of [2.6, 3.7]) {
              const P2 = /* @__PURE__ */ __name((dk, o) => off(k + dk, o), "P2"), bom = hh * 0.3 * ici(k).uy, { ux, uy } = ici(k);
              const A1 = P2(0.45 + 0.35, hh), A2 = P2(0.45 - 0.35, -hh), B2 = P2(-0.45 - 0.35, -hh), B1 = P2(-0.45 + 0.35, hh);
              const ctl = /* @__PURE__ */ __name((p, q2) => [(p[0] + q2[0]) / 2 + ux * bom * 2, (p[1] + q2[1]) / 2 + uy * bom * 2], "ctl");
              s += `<path d="M${pt(A1)} Q${pt(ctl(A1, A2))} ${pt(A2)} L${pt(B2)} Q${pt(ctl(B1, B2))} ${pt(B1)} Z" fill="${K.cloth}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>`;
            }
            const q = off(3.1, -hh), sx = ici(3.1).nx > 0 ? 1 : -1;
            s += forme([q, [q[0] - sx * 0.5, q[1] + 1.6], [q[0] - sx * 1.05, q[1] + 0.9]], K.cloth, 0.4);
          }
          if (retroussee) {
            const hw = w / 2 + 0.45, r = anneau(pts, coupe + 0.75, coupe - 0.55, hw, 0);
            s += `<path d="${r.d}" fill="${tissu}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` + trait(anneau(pts, coupe + 0.1, coupe + 0.1, hw * 0.8, 0).bord(coupe + 0.1), mix(tissu, OUT, 0.35), 0.45);
          } else {
            const dents = [1, 0.6, 0.2, -0.2, -0.6, -1].map((v, i) => off(coupe, v * h, [0.3, 1.1, 0.4, 0.8, 0.2, 0.6][i]));
            s += forme([off(coupe, h, -0.8), ...dents, off(coupe, -h, -0.8)], tissu, 0.55);
          }
        }
        return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin));
      }, "bras");
    }
    __name(fabriquerBras, "fabriquerBras");
    module.exports = { fabriquerBras, poserBras };
  }
});

// personnages/refonte/lorena_refonte.js
var require_lorena_refonte = __commonJS({
  "personnages/refonte/lorena_refonte.js"(exports, module) {
    var { P, E, L, clip, dechirure, drop, zee, shoe, r2: r22, OUT } = require_troupe();
    var AST = { coat: "#F2C04B", coatS: "#CC9A2F", scarf: "#C8463A", scarfS: "#9A2F28" };
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var recolor = /* @__PURE__ */ __name((s, map) => s.replace(/#[0-9A-Fa-f]{6}\b/g, (m) => map[m.toUpperCase()] || m), "recolor");
    var aster = require_aster();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var relevee = /* @__PURE__ */ __name((c) => !!(c.coiffe && c.coiffe.capuche), "relevee");
    var { fabriquerBras } = require_lorena_bras();
    var { jambe } = require_membres();
    var { fondre } = require_couleurs();
    var C = fondre({
      skin: "#F2C9A0",
      skinS: "#D9A47E",
      lid: "#EDBF97",
      under: "#C98D7A",
      hair: "#A8442F",
      hairS: "#7E2D22",
      hairH: "#E07F5A",
      rim: "#9FE3DA",
      coat: "#EBB943",
      coatS: "#C08B2C",
      coatH: "#FFE49A",
      salt: "#FFF8E8",
      scarf: "#C8463A",
      scarfS: "#9A2F28",
      brass: "#C9A24A",
      brassS: "#8E6E2C",
      brassH: "#F0D58A",
      iris: "#3F7A74",
      irisL: "#8CC9BC",
      eye: "#241B18",
      brow: "#5A1F18",
      cheek: "#EE9C8E",
      freckle: "#B9714F",
      mouth: "#7A3B30",
      cloth: "#E6D4AE",
      clothS: "#B8A27A",
      rope: "#B48F5A",
      ropeS: "#7C5E36",
      patch: "#8D7A5A",
      patch2: "#5E7FA0",
      shirt: "#F1E9D6",
      shirtS: "#D3C6A8",
      stripe: "#2F4F7A",
      mud: "#6B5138"
    });
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
    function eye(id, x, y, k, e) {
      const rx = (e.wide ? 2.1 : 1.95) * (e.rk || 1), ry = e.wide ? 2.8 : 2.6;
      const under = E(x, y + ry + 0.25, 1.9, 0.75, C.under, 0).replace("/>", ` opacity="${r22(0.3 * e.under)}"/>`);
      const flick = /* @__PURE__ */ __name((yy, w = 0.6) => P(`M${r22(x - k * rx)},${r22(yy)} l${r22(-k * 0.7)},-0.5`, "none", w), "flick");
      if (e.mode === "closed") return under + P(`M${r22(x - rx)},${r22(y + 0.4)} Q${x},${r22(y + 1.8)} ${r22(x + rx)},${r22(y + 0.4)}`, "none", 1) + flick(y + 0.4);
      if (e.mode === "joy") return under + P(`M${r22(x - rx)},${r22(y + 1)} Q${x},${r22(y - 1.5)} ${r22(x + rx)},${r22(y + 1)}`, "none", 1.1) + flick(y + 1);
      if (e.mode === "squeeze") return P(`M${r22(x - k * 1.5)},${r22(y - 1.4)} L${r22(x + k * 1.2)},${r22(y + 0.1)} L${r22(x - k * 1.5)},${r22(y + 1.5)}`, "none", 1.1);
      if (e.mode === "shut") return P(`M${r22(x - rx)},${r22(y + 0.3)} Q${x},${r22(y - 0.3)} ${r22(x + rx)},${r22(y + 0.5)}`, "none", 1.1) + P(`M${r22(x - k * 0.6)},${r22(y - 1.6)} l${r22(k * 0.9)},0.7 M${r22(x - k * 0.2)},${r22(y + 1.8)} l${r22(k * 0.9)},-0.5`, "none", 0.5);
      const [lx, ly] = e.look;
      const top = y - ry + e.lid * 2 * ry;
      const tin = top + (e.tilt || 0), tout = top - (e.tilt || 0) * 0.6;
      const xin = x + k * (rx + 0.25), xout = x - k * (rx + 0.35);
      const lidLine = `M${r22(xout)},${r22(tout + 1.6)} Q${x},${r22(Math.min(tin, tout) - 1.2)} ${r22(xin)},${r22(tin + 1.6)}`;
      const bot = y + ry - (e.low || 0) * 2 * ry;
      const ix = x + lx, iy = y + ly;
      const [irx, iry, pr] = e.small ? [0.95, 1.2, 0.38] : [1.45, 1.8, 0.66];
      let inner = E(x, y, rx, ry, e.small ? "#FFFFFF" : C.eye, 0) + E(ix, iy + 0.55, irx, iry, C.iris, e.small ? 0.5 : 0) + (e.small ? "" : P(`M${r22(ix - 1.2)},${r22(iy + 1)} Q${r22(ix)},${r22(iy + 2.5)} ${r22(ix + 1.2)},${r22(iy + 1)} Q${r22(ix)},${r22(iy + 1.7)} ${r22(ix - 1.2)},${r22(iy + 1)} Z`, C.irisL, 0)) + E(ix, iy + 0.35, pr, pr * 1.1, C.eye, 0) + E(ix - k * 0.55 * (e.small ? 0.6 : 1), Math.max(iy - 0.85, top + 0.7), e.small ? 0.36 : 0.72, e.small ? 0.36 : 0.72, "#FFFFFF", 0) + (e.small ? "" : E(ix + k * 0.45, iy + 1.15, 0.28, 0.28, "#FFFFFF", 0));
      if (e.sparkle) inner += P(`M${r22(ix + k * 0.5)},${r22(iy - 0.2)} l0.25,0.6 l0.6,0.25 l-0.6,0.25 l-0.25,0.6 l-0.25,-0.6 l-0.6,-0.25 l0.6,-0.25 Z`, "#FFFFFF", 0);
      if (e.wet) inner += P(`M${r22(x - rx)},${r22(y + 1.2)} Q${x},${r22(y + 1.9)} ${r22(x + rx)},${r22(y + 1.2)} L${r22(x + rx)},${r22(y + ry + 0.5)} L${r22(x - rx)},${r22(y + ry + 0.5)} Z`, "#CDEFF0", 0).replace("/>", ' opacity=".55"/>');
      if (e.lid > 0 || e.tilt) inner += P(`${lidLine} L${r22(xin)},${r22(y - ry - 2)} L${r22(xout)},${r22(y - ry - 2)} Z`, C.lid, 0);
      if (e.low) inner += P(`M${r22(x - rx - 0.5)},${r22(bot + 0.2)} Q${x},${r22(bot - 0.8)} ${r22(x + rx + 0.5)},${r22(bot + 0.2)} L${r22(x + rx + 0.5)},${r22(y + ry + 1)} L${r22(x - rx - 0.5)},${r22(y + ry + 1)} Z`, C.lid, 0);
      let s = under;
      s += clip(id, `M${r22(x - rx)},${y} a${rx},${ry} 0 1,0 ${r22(2 * rx)},0 a${rx},${ry} 0 1,0 ${r22(-2 * rx)},0 Z`, inner);
      if (e.small) s += E(x, y, rx, ry, "none", 0.7);
      s += P(lidLine, "none", 0.95);
      s += P(`M${r22(xout + k * 0.1)},${r22(tout + 1.55)} l${r22(-k * 0.7)},${r22(-0.6)}`, "none", 0.65);
      if (e.low) s += P(`M${r22(x - rx * 0.7)},${r22(bot + 0.05)} Q${x},${r22(bot - 0.6)} ${r22(x + rx * 0.7)},${r22(bot + 0.05)}`, "none", 0.45);
      return s;
    }
    __name(eye, "eye");
    function brow(x, y, k, b, split, sc = 1) {
      const [bi, bo, arch] = b, hw = 2.4 * sc;
      const xi = x + k * hw, xo = x - k * hw, yi = y + bi, yo = y + bo, mx = x, my = (yi + yo) / 2 + arch;
      let s = P(`M${r22(xi)},${r22(yi - 0.5)} Q${r22(mx)},${r22(my - 0.55)} ${r22(xo)},${r22(yo)} Q${r22(mx)},${r22(my + 0.35)} ${r22(xi)},${r22(yi + 0.55)} Z`, C.brow, 0);
      if (split) s += L([x - k * 0.35, (yi + yo) / 2 - 1], [x - k * 0.05, (yi + yo) / 2 + 1], C.skin, 0.55) + L([x - k * 0.5, (yi + yo) / 2 - 1.9], [x - k * 0.3, (yi + yo) / 2 - 1], "#B5473A", 0.4);
      return s;
    }
    __name(brow, "brow");
    function mouth(kind, mx, my, id) {
      const line = /* @__PURE__ */ __name((d) => P(d, "none", 0.85), "line");
      const lip = L([mx - 0.5, my + 1.4], [mx + 0.5, my + 1.4], C.skinS, 0.45);
      const open = /* @__PURE__ */ __name((d, tongue = true, teeth = false) => P(d, C.mouth, 0.85) + clip(id, d, (tongue ? E(mx, my + 2.1, 1.3, 0.85, "#D9786C", 0) : "") + (teeth ? `<rect x="${r22(mx - 2.5)}" y="${r22(my - 0.6)}" width="5" height="1.05" fill="#FFFFFF"/>` : "")), "open");
      switch (kind) {
        case "firm":
          return line(`M${r22(mx - 1.5)},${r22(my + 0.3)} L${r22(mx + 1.4)},${r22(my + 0.2)}`) + line(`M${r22(mx + 1.4)},${r22(my + 0.2)} l0.35,0.45`);
        case "wave":
          return P(`M${r22(mx - 1.4)},${r22(my + 0.6)} Q${r22(mx - 0.7)},${r22(my + 0.05)} ${mx},${r22(my + 0.45)} Q${r22(mx + 0.7)},${r22(my + 0.85)} ${r22(mx + 1.4)},${r22(my + 0.35)}`, "none", 0.75);
        case "half":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.15)} Q${r22(mx + 0.2)},${r22(my + 1)} ${r22(mx + 1.6)},${r22(my - 0.45)}`) + line(`M${r22(mx + 1.6)},${r22(my - 0.45)} l0.2,-0.3`);
        case "smirk":
          return line(`M${r22(mx - 1.2)},${r22(my + 0.45)} Q${r22(mx + 0.4)},${r22(my + 0.6)} ${r22(mx + 1.7)},${r22(my - 0.5)}`) + lip;
        case "side":
          return line(`M${r22(mx - 0.4)},${r22(my + 0.5)} Q${r22(mx + 0.6)},${r22(my + 0.3)} ${r22(mx + 1.7)},${r22(my + 0.1)}`) + L([mx + 0.2, my + 1.4], [mx + 1, my + 1.3], C.skinS, 0.45);
        case "bite":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.3)} L${r22(mx + 1.4)},${r22(my + 0.3)}`) + P(`M${r22(mx - 0.7)},${r22(my + 0.3)} L${r22(mx - 0.6)},${r22(my + 1)} L${r22(mx + 0.1)},${r22(my + 1)} L${r22(mx + 0.2)},${r22(my + 0.3)} Z`, "#FFFFFF", 0.45);
        case "soft":
          return line(`M${r22(mx - 1.3)},${r22(my + 0.15)} Q${mx},${r22(my + 1)} ${r22(mx + 1.3)},${r22(my + 0.15)}`);
        case "laugh":
          return open(`M${r22(mx - 2)},${r22(my - 0.2)} Q${mx},${r22(my - 0.6)} ${r22(mx + 2)},${r22(my - 0.2)} Q${r22(mx + 1.6)},${r22(my + 3.4)} ${mx},${r22(my + 3.4)} Q${r22(mx - 1.6)},${r22(my + 3.4)} ${r22(mx - 2)},${r22(my - 0.2)} Z`, true, true);
        case "wow":
          return open(`M${r22(mx - 1.2)},${r22(my + 0.1)} Q${mx},${r22(my - 0.3)} ${r22(mx + 1.2)},${r22(my + 0.1)} Q${r22(mx + 1)},${r22(my + 2)} ${mx},${r22(my + 2)} Q${r22(mx - 1)},${r22(my + 2)} ${r22(mx - 1.2)},${r22(my + 0.1)} Z`);
        case "shout":
          return open(`M${r22(mx - 1.9)},${r22(my - 0.3)} L${r22(mx + 1.9)},${r22(my - 0.5)} Q${r22(mx + 1.8)},${r22(my + 3.6)} ${mx},${r22(my + 3.6)} Q${r22(mx - 1.8)},${r22(my + 3.6)} ${r22(mx - 1.9)},${r22(my - 0.3)} Z`, true, true);
        case "fear":
          return open(`M${r22(mx - 1.6)},${r22(my + 0.6)} Q${r22(mx - 0.8)},${r22(my - 0.1)} ${mx},${r22(my + 0.4)} Q${r22(mx + 0.8)},${r22(my - 0.1)} ${r22(mx + 1.6)},${r22(my + 0.6)} L${r22(mx + 1.2)},${r22(my + 1.9)} Q${mx},${r22(my + 1.5)} ${r22(mx - 1.2)},${r22(my + 1.9)} Z`, false, true);
        case "sob":
          return open(`M${r22(mx - 1.5)},${r22(my + 1.6)} Q${mx},${r22(my - 0.4)} ${r22(mx + 1.5)},${r22(my + 1.6)} Q${mx},${r22(my + 2.4)} ${r22(mx - 1.5)},${r22(my + 1.6)} Z`, false);
        case "pout":
          return P(`M${r22(mx - 1)},${r22(my + 0.5)} Q${mx},${r22(my - 0.2)} ${r22(mx + 1)},${r22(my + 0.5)} Q${mx},${r22(my + 1.2)} ${r22(mx - 1)},${r22(my + 0.5)} Z`, "#C9665B", 0.75);
        case "chatter":
          return P(`M${r22(mx - 1.7)},${r22(my + 0.1)} L${r22(mx + 1.7)},${r22(my + 0.1)} L${r22(mx + 1.5)},${r22(my + 1.4)} L${r22(mx - 1.5)},${r22(my + 1.4)} Z`, "#FFFFFF", 0.8) + P(`M${r22(mx - 1.4)},${r22(my + 0.75)} l0.7,-0.35 l0.7,0.35 l0.7,-0.35 l0.7,0.35`, "none", 0.4).replace(`stroke="${OUT}"`, 'stroke="#9A8A84"');
        case "sleep":
          return E(mx + 0.2, my + 0.7, 0.55, 0.65, C.mouth, 0.75);
        case "down":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.9)} Q${mx},${r22(my + 0.1)} ${r22(mx + 1.4)},${r22(my + 0.9)}`);
        case "teeth":
          return P(`M${r22(mx - 1.7)},${r22(my + 0.2)} L${r22(mx + 1.7)},${r22(my + 0.05)} L${r22(mx + 1.4)},${r22(my + 1.3)} L${r22(mx - 1.4)},${r22(my + 1.4)} Z`, "#FFFFFF", 0.8) + L([mx - 1.4, my + 0.75], [mx + 1.4, my + 0.7], "#C9B8B0", 0.35);
        case "o":
          return E(mx, my + 0.7, 0.85, 1.05, C.mouth, 0.85);
        case "open":
          return P(`M${r22(mx - 1.1)},${r22(my + 0.3)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.1)},${r22(my + 0.3)} Q${mx},${r22(my + 1.4)} ${r22(mx - 1.1)},${r22(my + 0.3)} Z`, C.mouth, 0.8);
        case "press":
          return line(`M${r22(mx - 1.5)},${r22(my + 0.6)} Q${mx},${r22(my + 0.1)} ${r22(mx + 1.5)},${r22(my + 0.6)}`) + L([mx - 0.6, my + 1.5], [mx + 0.6, my + 1.5], C.skinS, 0.45);
        default:
          return line(`M${r22(mx - 1.4)},${r22(my + 0.35)} Q${r22(mx + 0.1)},${r22(my + 0.1)} ${r22(mx + 1.4)},${r22(my + 0.4)}`) + lip;
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
        if (x === "stream") s += `<g transform="translate(${r22(X2(18.1) - 18.1)} 0)">${P("M17.6,24.4 Q16.8,28 17.6,31.4 L18.6,31.2 Q18,28 18.6,24.6 Z", "#A9DCFF", 0.5)}</g><g transform="translate(${r22(X2(29.9) - 29.9)} 0)">${P("M29.4,24.6 Q30,28 29.4,31.2 L30.4,31.4 Q31.2,28 30.4,24.4 Z", "#A9DCFF", 0.5)}</g>`;
        if (x === "zz") s += n ? zee(37, 5.8, 2) + zee(39.4, 2.6, 2.4) : zee(36.4, 6.6, 1.8) + zee(39, 3.4, 2.2);
        if (x === "cold") s += E(X2(24.4), 25.6, 1.2, 0.8, "#9CC8E8", 0).replace("/>", ' opacity=".7"/>') + E(X2(16.8), 26.4, 2.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + E(X2(31.2), 26.4, 2.2 * (X2(31.2) - X2(24)) / 7.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + P("M9.6,17.6 q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4 M7.8,18.6 q-0.6,0.9 0,1.8 M38.4,17.6 q0.8,1.2 0,2.4 q-0.8,1.2 0,2.4 M40.2,18.6 q0.6,0.9 0,1.8", "none", 0.6);
        if (x === "vein") {
          const a = n ? 0.6 : 0.5, b = n ? 2 : 1.7, cx = 39.6, cy = 7.4;
          const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r22(cx + i * a)},${r22(cy + j * b)} Q${r22(cx + i * a)},${r22(cy + j * a)} ${r22(cx + i * b)},${r22(cy + j * a)}`).join(" ");
          s += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
        }
      }
      return s;
    }
    __name(extras, "extras");
    var wind = /* @__PURE__ */ __name((a, b, fill, w, dur = "1.7s", begin = "0s") => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"><animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>`, "wind");
    var MARKS = { hem: "torn", salt: 1, dirt: 0, patch: true, rope: true, plaster: true, wrist: true, wet: false };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => ({ ...C, ...c.pal || {} }), "pal");
    var THREAD = "#EFE3C4";
    var seam = /* @__PURE__ */ __name((d, w = 0.45) => `<path d="${d}" fill="none" stroke="${THREAD}" stroke-width="${w}" stroke-dasharray=".9 .7" stroke-linecap="round"/>`, "seam");
    function suitOurlet(x0, x1, y0, yc, off, amp = 0) {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, u = 1 - t, x = x0 + (x1 - x0) * t;
        const y = u * u * y0 + 2 * u * t * yc + t * t * y0 - off + Math.sin(t * Math.PI * 7) * amp;
        pts.push(`${r22(x)},${r22(y)}`);
      }
      return "M" + pts.join(" L");
    }
    __name(suitOurlet, "suitOurlet");
    var spyglass = /* @__PURE__ */ __name((K, [x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-1.5" y="-4.5" width="3" height="9" rx="0.8" fill="${K.brass}" stroke="${OUT}" stroke-width="0.9"/><rect x="-1.1" y="-3.9" width="0.8" height="7.8" rx="0.4" fill="${K.brassH}"/><rect x="-1.95" y="-4.9" width="3.9" height="2.1" rx="0.6" fill="${K.brassS}" stroke="${OUT}" stroke-width="0.8"/><path d="M0.6,1.4 l0.5,0.9" stroke="${K.brassS}" stroke-width="0.5"/></g>`, "spyglass");
    var ropeBand = /* @__PURE__ */ __name((K, d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.rope}" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.ropeS}" stroke-width="1.7" stroke-dasharray=".5 1.1"/>`, "ropeBand");
    var patch = /* @__PURE__ */ __name((K, [x, y]) => {
      const d = `M${x},${y} L${r22(x + 3.4)},${r22(y - 0.2)} L${r22(x + 3.6)},${r22(y + 3.2)} L${r22(x + 0.2)},${r22(y + 3.4)} Z`;
      return `<g transform="rotate(-8 ${r22(x + 1.8)} ${r22(y + 1.6)})">${P(d, K.patch, 0.6)}${seam(`M${r22(x + 0.6)},${r22(y + 0.5)} L${r22(x + 2.9)},${r22(y + 0.35)} L${r22(x + 3.05)},${r22(y + 2.65)} L${r22(x + 0.75)},${r22(y + 2.8)} Z`, 0.4)}</g>`;
    }, "patch");
    var plis = /* @__PURE__ */ __name((hemY) => `<path d="M17.8,38.2 Q16.9,${r22((38.2 + hemY) / 2)} 17.4,${r22(hemY - 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".32" stroke-linecap="round"/><path d="M30.2,38.4 Q31.1,${r22((38.4 + hemY) / 2)} 30.6,${r22(hemY - 0.4)}" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".32" stroke-linecap="round"/>`, "plis");
    var TORSE = {
      front: { o: 24, shade: 27.5, patch: [16, 34], rope: "M16.6,32.6 Q22.6,36.6 30.4,41.6", glass: [30, 45.6, -12], poches: [[15.4, 19.4], [28.6, 32.6]] },
      se: { o: 21.5, shade: 26, patch: [15.2, 34], rope: "M15.8,32.8 Q21.2,36.6 28.8,41.6", glass: [29.4, 45.2, -14], poches: [[14.8, 18.4], [26.8, 29.8]] },
      ne: { o: 24, shade: 27.5, patch: [27.6, 39.4], rope: "M31.4,32.6 Q25.4,36.6 17.6,41.6", glass: [17.4, 45.4, 12], poches: [] }
    };
    function torse(c, ctx, K, M) {
      const t = c.tenue || "cire", u = c.uid, view = ctx.view, V = TORSE[view] || TORSE.front, o = V.o, dx = o - 24;
      const dos = view === "ne";
      const court = t === "vareuse" || t === "chemise";
      const sw = r22((ctx.sway || 0) * 0.3);
      const x0 = court ? 14 : 13, x1 = court ? 34 : 35, hy = court ? 45.4 : 47.5, hc = court ? 48 : 51;
      const torn = dechirure([x1, hy], [24 + sw, hc], [x0, hy], court ? 5 : 3);
      const OUTLINE = `M15.5,32.5 Q24,29.8 32.5,32.5 L${x1},${hy} ` + (M.hem === "torn" ? torn.d : `Q${r22(24 + sw)},${hc} ${x0},${hy}`) + " Z";
      const ourlet = /* @__PURE__ */ __name((off) => suitOurlet(x0, x1, hy, hc, off), "ourlet");
      const shade = `<rect x="${V.shade}" y="30" width="12" height="24" fill="${K.coatS}"/><path d="${ourlet(1.6)} L${x1},54 L${x0},54 Z" fill="${K.coatS}"/>`;
      const shine = `<rect x="14.6" y="34" width="1.4" height="${r22(hy - 38)}" rx="0.7" fill="${K.coatH}"/><rect x="${r22(x1 - 0.2)}" y="33" width="1.2" height="16" fill="${K.rim}" opacity=".7"/>`;
      const salt = M.salt ? `<path d="${suitOurlet(x0, x1, hy, hc, 2.3, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r22(0.75 * M.salt)}"/><path d="${suitOurlet(x0, x1, hy, hc, 4.6, 0.3)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r22(0.4 * M.salt)}"/>` : "";
      const dust = M.dirt ? `<path d="${suitOurlet(x0, x1, hy, hc, 2.6, 0.18)} L${x1},54 L${x0},54 Z" fill="${K.mud}" opacity="${r22(0.3 * M.dirt)}"/>` : "";
      const mended = M.hem === "mended" ? seam(ourlet(1)) : "";
      const fabric = shade + shine + plis(hy) + salt + dust + mended;
      let s = "";
      if (t === "chemise" && !dos) {
        const SH = `M16,32.5 Q24,30 32,32.5 L${x1 - 1},${hy + 0.2} Q24,${hc - 0.4} ${x0 + 1},${hy + 0.2} Z`;
        s += P(SH, K.shirt) + clip(`${u}sh`, SH, `<rect x="${r22(o + 1.6)}" y="30" width="1.6" height="18" fill="${K.shirtS}" opacity=".7"/>` + salt + dust) + P(SH, "none");
        s += P(`M${o},33.6 L${o},44.4`, "none", 0.55) + P(`M${r22(o - 2.4)},32.2 L${r22(o - 1.2)},35 L${o},33.4 Z`, K.shirt, 0.6) + P(`M${r22(o + 2.4)},32.2 L${r22(o + 1.2)},35 L${o},33.4 Z`, K.shirtS, 0.6);
        const VL = `M16,32.6 Q${r22(o - 5)},31.6 ${r22(o - 2.8)},32.4 L${r22(o - 1.8)},${hy + 0.4} Q${r22((15.2 + o - 1.8) / 2)},${hy + 1} 15.2,${hy} Z`;
        const VR = `M32,32.6 Q${r22(o + 5)},31.6 ${r22(o + 2.8)},32.4 L${r22(o + 1.8)},${hy + 0.4} Q${r22((32.8 + o + 1.8) / 2)},${hy + 1} 32.8,${hy} Z`;
        s += P(VL, K.coat) + clip(`${u}gl`, VL, `<rect x="16.2" y="34" width="1.2" height="8" rx="0.6" fill="${K.coatH}"/><rect x="${V.shade}" y="30" width="12" height="18" fill="${K.coatS}"/>` + plis(hy) + salt + dust + mended) + P(VL, "none");
        s += P(VR, K.coat) + clip(`${u}gr`, VR, `<rect x="${r22(o)}" y="30" width="12" height="18" fill="${K.coatS}"/>` + plis(hy) + salt + dust + mended) + P(VR, "none");
        s += seam(`M${r22(o - 3)},33 L${r22(o - 2.1)},${hy - 0.4}`, 0.35) + seam(`M${r22(o + 3)},33 L${r22(o + 2.1)},${hy - 0.4}`, 0.35);
        for (const y of [37.2, 40.6]) s += E(o - 2.3, y, 0.55, 0.55, K.brass, 0.45);
      } else if (t === "chemise") {
        const DV = `M15.6,32.8 Q24,31 32.4,32.8 L32.8,${hy} Q24,${hy + 1} 15.2,${hy} Z`;
        s += P(DV, K.coat) + clip(`${u}gd`, DV, fabric) + P(DV, "none");
        s += seam(`M24,33.6 L24,${hy - 0.6}`, 0.35) + P("M19.6,40.4 L28.4,40.4 L28.4,41.6 L19.6,41.6 Z", K.coatS, 0.5) + P("M23.1,40.1 L24.9,40.1 L24.9,41.9 L23.1,41.9 Z", "none", 0.45).replace('fill="none"', `fill="${K.brass}"`);
      } else {
        s += P(OUTLINE, K.coat) + clip(`${u}c`, OUTLINE, fabric) + P(OUTLINE, "none");
        if (M.hem === "torn") for (const [x, y] of torn.tips) s += P(`M${r22(x)},${r22(y - 0.2)} q0.45,0.8 -0.1,1.7`, "none", 0.45);
        if (dos) {
          if (t === "vareuse") {
            s += P(`M24,41.6 L24,${r22(hy + 1.6)}`, "none", 0.7) + P("M18.4,40.6 L29.6,40.6 L29.6,42.2 L18.4,42.2 Z", K.coatS, 0.55);
            for (const x of [19.6, 28.4]) s += E(x, 41.4, 0.55, 0.55, K.brass, 0.4);
          } else {
            s += `<path d="M15.8,36.2 Q24,37.8 32.2,36.2" fill="none" stroke="${OUT}" stroke-width="0.5" opacity=".45"/>` + P(`M24,37.4 L24,${r22(hy + 1.6)}`, "none", 0.7);
            if (!relevee(c)) s += capucheRabattue(u, "ne", reperes(c), K.coat, K.coatS);
          }
        } else if (t === "ouvert") {
          const MA = `M${r22(o - 3)},32.2 Q${o},31.4 ${r22(o + 3)},32.2 L${r22(o + 3.4)},${hy + 1.6} Q${o},${hy + 2.4} ${r22(o - 3.4)},${hy + 1.6} Z`;
          const raies = [34.4, 36.8, 39.2, 41.6, 44, 46.4].map((y) => `<path d="M${r22(o - 5)},${y} Q${o},${r22(y + 0.9)} ${r22(o + 5)},${y}" fill="none" stroke="${K.stripe}" stroke-width="1.1"/>`).join("");
          s += P(MA, K.shirt) + clip(`${u}ma`, MA, raies + `<path d="M${r22(o + 1.8)},31 L${r22(o + 3.4)},31 L${r22(o + 3.6)},${hy + 3} L${r22(o + 1.4)},${hy + 3} Z" fill="${OUT}" opacity=".16"/>` + salt) + P(MA, "none");
          s += `<g transform="translate(${dx} 0)">${P("M21,32.2 Q18.4,34.6 18.8,38.6 L21.8,36 Z", K.coatS, 0.7)}${P("M27,32.2 Q29.6,34.6 29.2,38.6 L26.2,36 Z", K.coatS, 0.7)}</g>`;
        } else if (t === "vareuse") {
          s += `<g transform="translate(${dx} 0)">${P("M20.2,32 L23.6,38.4 L22.4,38.6 L18.8,34.6 Z", K.coatS, 0.7)}${P("M27.8,32 L24.4,38.4 L25.6,38.6 L29.2,34.6 Z", K.coatS, 0.7)}${P(`M24,38.4 L24,${r22(hy + 1.6)}`, "none", 0.7)}</g>`;
          for (const y of [39.8, 42.8]) for (const x of [22 + dx, 26.6 + dx]) s += E(x, y, 0.62, 0.62, K.brass, 0.45) + E(x - 0.2, y - 0.2, 0.2, 0.2, K.brassH, 0);
          for (const [a, b] of V.poches) s += P(`M${a},41.6 L${b},41.4 L${b + 0.1},42.9 L${a + 0.2},43.1 Z`, K.coatS, 0.55);
        } else {
          const sl = view === "se" ? -0.6 : 0;
          s += P(`M${o},33.2 L${r22(o + sl)},${r22(hy + 1.9)}`, "none", 0.9);
          for (const y of [37, 41, 45]) s += `<rect x="${r22(o + 0.8 + sl * (y - 33) / 15)}" y="${y - 0.45}" width="2" height="0.9" rx="0.45" fill="${K.rope}" stroke="${OUT}" stroke-width="0.5"/>`;
        }
        if (M.hem === "mended") {
          const px = dos ? 27.2 : view === "se" ? 14.2 : 16.4;
          s += reflet(o, P(`M${px},${r22(hy - 4.4)} L${r22(px + 3.6)},${r22(hy - 4.6)} L${r22(px + 3.8)},${r22(hy - 1.4)} L${r22(px + 0.2)},${r22(hy - 1.2)} Z`, K.patch2, 0.55) + seam(`M${r22(px + 0.55)},${r22(hy - 3.9)} L${r22(px + 3.1)},${r22(hy - 4.05)} L${r22(px + 3.25)},${r22(hy - 1.85)} L${r22(px + 0.7)},${r22(hy - 1.7)} Z`, 0.38), !!c.miroir);
        }
      }
      if (t === "chemise") s += `<path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${OUT}" stroke-width="2.3"/><path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${K.rope}" stroke-width="1.3"/><path d="M15.4,43.4 Q24,45.2 32.6,43.4" fill="none" stroke="${K.ropeS}" stroke-width="1.3" stroke-dasharray=".5 1"/>`;
      const mir = !!c.miroir;
      if (M.patch) s += reflet(o, patch(K, V.patch), mir);
      if ((ctx.pose !== "action" || c.geste) && !c.sansLongueVue) s += reflet(o, spyglass(K, V.glass), mir);
      if (M.rope) s += reflet(o, ropeBand(K, V.rope), mir);
      if (M.wet) {
        s += [[16.4, 0], [22.6, 0.55], [31.2, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 2)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 2)};${r22(hy + 9)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("");
      }
      return s;
    }
    __name(torse, "torse");
    function pied(c, x, y, dir, tilt) {
      const M = marks(c), K = pal(c);
      let s = "";
      const a = r22(x - c.legW / 2 + 0.55), b = r22(x + c.legW / 2 - 0.55);
      if (M.dirt) s += `<path d="M${a},${r22(y + 0.6)} L${a},${r22(y - 1.4)} Q${r22(x - 1.2)},${r22(y - 2.8)} ${r22(x - 0.2)},${r22(y - 1.6)} Q${r22(x + 0.8)},${r22(y - 0.6)} ${b},${r22(y - 2.2)} L${b},${r22(y + 0.6)} Z" fill="${K.mud}" opacity="${r22(0.5 * M.dirt)}"/>` + E(x - 0.9, y - 3.5, 0.32, 0.32, K.mud, 0).replace("/>", ` opacity="${r22(0.55 * M.dirt)}"/>`);
      s += shoe(c, x, y, dir, tilt);
      if (M.dirt) s += `<path d="M${r22(x - 2.8)},${r22(y + 3.2)} Q${r22(x - 1)},${r22(y + 2.2)} ${r22(x + 0.6)},${r22(y + 3.6)} Q${r22(x - 1)},${r22(y + 4.6)} ${r22(x - 2.8)},${r22(y + 3.2)} Z" fill="${K.mud}" opacity="${r22(0.8 * M.dirt)}"/>` + E(x + 1.6, y + 1.4, 0.42, 0.42, K.mud, 0).replace("/>", ` opacity="${r22(0.8 * M.dirt)}"/>`) + E(x + 2.3, y + 2.4, 0.26, 0.26, K.mud, 0).replace("/>", ` opacity="${r22(0.8 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var lorena = {
      ...aster,
      name: "Lorena",
      uid: "lo",
      sleeve: C.coat,
      teintes: [C.hair, C.coat, C.scarf, C.brass, C.rope],
      foot: pied,
      // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      // ses manches, dans toutes les vues et tous les gestes (lorena_bras.js)
      bras: fabriquerBras({ pal, marks }),
      // la capuche rabattue du ciré (rien pour la vareuse ni la chemise), aux couleurs de la palette
      backItems(c, ctx) {
        const K = pal(c), t = c.tenue || "cire";
        if (ctx.view === "ne" || t === "vareuse" || t === "chemise" || relevee(c)) return "";
        return recolor(aster.backItems(c, ctx), { [AST.coat]: K.coat, [AST.coatS]: K.coatS });
      },
      // le foulard, à la couleur de l'état (l'eau le fonce)
      neck(c, ctx) {
        const K = pal(c);
        return recolor(aster.neck(c, ctx), { [AST.scarf]: K.scarf, [AST.scarfS]: K.scarfS });
      },
      body(c, ctx) {
        return torse(c, ctx, pal(c), marks(c));
      },
      head(c, ctx) {
        if (ctx.view === "ne") return teteDeDos(c, ctx);
        const V = VUES2[ctx.view] || VUES2.front, X2 = V.X;
        const name = ALIAS[ctx.expr] || ctx.expr;
        const ex = ctx.eyeMode === "wink" ? EXPR.visee : ctx.blink && name === "veille" ? EXPR.cligne : EXPR[name] || EXPR.veille;
        const C2 = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`;
        let s = "";
        const mir = !!c.miroir;
        if (!relevee(c)) s += queue(C2, mir);
        if (!c.coiffe) s += epis(C2, mir);
        s += P(V.back, C2.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24" width="32" height="9" fill="${C2.hairS}"/><path d="M35.4,10 Q38.6,18 36.4,30 L40,30 L40,10 Z" fill="${C2.rim}" opacity=".85" transform="translate(${V.hdx} 0)"/>`) + P(V.back, "none");
        if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, C2.skin) + P(`M${r22(V.ear[0] + 0.1)},${r22(V.ear[1] - 1)} Q${r22(V.ear[0] + 0.8)},${V.ear[1]} ${r22(V.ear[0] + 0.1)},${r22(V.ear[1] + 1)}`, "none", 0.5);
        const fr = [[17.6, 24.9], [18.8, 25.6], [16.6, 25.4], [29.4, 25.6], [28.4, 25]];
        s += P(V.face, C2.skin);
        s += clip(`${id}f`, V.face, `<path d="${V.bangs}" fill="${C2.skinS}" transform="translate(0 1.4)"/><g transform="translate(${V.dx} 0)"><path d="M33.4,14 Q36.6,22 32.4,31.6 L37,31.6 L37,14 Z" fill="${C2.rim}" opacity=".55"/><path d="M31.8,13 Q35,21 31.2,31 L33.6,31 Q37,21 33.6,13 Z" fill="${C2.skinS}" opacity=".45"/></g>` + E(X2(16.8), 26.6, 1.8, 1, C2.cheek, 0).replace("/>", ' opacity=".55"/>') + E(X2(31.2), 26.6, 1.8 * V.rk[1], 1, C2.cheek, 0).replace("/>", ' opacity=".55"/>') + fr.map(([x, y]) => E(X2(x), y, 0.36, 0.36, C2.freckle, 0)).join(""));
        s += P(V.face, "none");
        const joue = mir ? [X2(16.8), V.rk[0]] : [X2(31.2), V.rk[1]];
        if (M.plaster) s += `<g transform="translate(${r22(joue[0])} 27.2) scale(${mir ? -joue[1] : joue[1]} 1) translate(-31.2 -27.2)"><g transform="rotate(-24 31.2 27.2)">${P("M29.2,26.4 L33.2,26.4 Q33.6,26.4 33.6,26.8 L33.6,27.6 Q33.6,28 33.2,28 L29.2,28 Q28.8,28 28.8,27.6 L28.8,26.8 Q28.8,26.4 29.2,26.4 Z", C2.cloth, 0.5)}${P("M30.5,26.4 L31.9,26.4 L31.9,28 L30.5,28 Z", C2.clothS, 0)}</g></g>`;
        s += `<g transform="translate(${V.nose} 0)">${P("M24.3,24.9 Q25,25.6 24.5,26 Q24.1,25.9 24,25.6 Z", C2.skinS, 0)}</g>`;
        s += mouth(ex.mouth, V.mouth, 27.6, `${id}m`);
        s += P(V.bangs, C2.hair);
        s += clip(`${id}b`, V.bangs, `<g transform="translate(${V.dx * 0.7} 0)"><path d="M15,12.4 Q24,8.4 33,12.4 L31.7,13 L30.4,12 L29,13 L27.4,11.8 L25.8,12.8 L24,11.6 L22.4,12.8 L20.8,11.8 L19.2,13 L17.8,12 L16.4,13 Z" fill="${C2.hairH}" opacity=".85"/></g><path d="M11,17 Q24,13.6 37,17 L37,20 L11,20 Z" fill="${C2.hairS}" opacity=".45"/>`);
        s += P(V.bangs, "none");
        if (M.salt) s += E(X2(18.6), 10.8, 0.35, 0.35, C2.salt, 0) + E(X2(28.8), 10.4, 0.3, 0.3, C2.salt, 0) + E(X2(31.4), 13.2, 0.28, 0.28, C2.salt, 0);
        if (M.dirt) s += reflet(X2(24), `<ellipse cx="${X2(18.2)}" cy="28.3" rx="1.3" ry="0.6" fill="${C2.mud}" opacity="${r22(0.5 * M.dirt)}" transform="rotate(-14 ${X2(18.2)} 28.3)"/><ellipse cx="${X2(19.7)}" cy="28.9" rx="0.4" ry="0.3" fill="${C2.mud}" opacity="${r22(0.45 * M.dirt)}"/>`, mir);
        if (c.coiffe) s += c.coiffe(c, ctx, "tete");
        if (M.wet && !relevee(c)) s += gouttesQueue(mir);
        s += brow(X2(19.4), 18.6, 1, ex.browL || ex.brow, !mir, V.rk[0]) + brow(X2(28.6), 18.6, -1, ex.browR || ex.brow, mir, V.rk[1]);
        s += eye(`${id}e0`, X2(19.4), 22.7, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }) + eye(`${id}e1`, X2(28.6), 22.7, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] });
        s += extras(ex.extras, ctx.n % 2, X2);
        return s;
      }
    };
    var QUEUE = [
      ["M33.6,11.4 Q40.6,9.2 44.2,13 Q41.6,13 41,15.6 Q38.6,14 36,16.8 Q35.6,13.4 33.6,11.4 Z", "M33.6,11.4 Q40.4,10.2 43.4,15.4 Q40.8,14.6 40.2,17.2 Q38,15.2 36,16.8 Q35.6,13.4 33.6,11.4 Z", "hair", 1, "0s"],
      ["M34.4,14.4 Q38.8,15.4 40.4,19.6 Q38.2,18 35.8,18.4 Z", "M34.4,14.4 Q38.4,16.4 39.2,21 Q37.4,18.8 35.8,18.4 Z", "hairS", 0.9, "-.4s"]
    ];
    var miroir = /* @__PURE__ */ __name((d) => d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (m, x, y) => `${r22(48 - +x)},${y}`), "miroir");
    function queue(C2, dos = false) {
      const f = dos ? miroir : (d) => d;
      return QUEUE.map(([a, b, col, w, begin]) => wind(f(a), f(b), C2[col], w, "1.7s", begin)).join("") + E(dos ? 13.4 : 34.6, 13.4, 1.4, 1.3, C2.scarf, 0.9);
    }
    __name(queue, "queue");
    var epis = /* @__PURE__ */ __name((C2, mir) => {
      const f = mir ? miroir : (d) => d;
      return wind(f("M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z"), f("M23.4,7.8 Q27.8,2.4 34.8,5 Q30.2,5.4 27.8,8.8 Z"), C2.hair, 1, "1.7s", "-.2s") + P(f("M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z"), C2.hair);
    }, "epis");
    var gouttesQueue = /* @__PURE__ */ __name((dos) => [[41.4, 16, 0], [39.8, 20, 0.8]].map(([x0, y, d]) => {
      const x = dos ? r22(48 - x0) : x0;
      return `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 7}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`;
    }).join(""), "gouttesQueue");
    function teteDeDos(c, ctx) {
      const C2 = pal(c), M = marks(c), id = `${c.uid}ne${ctx.expr}`;
      const back = "M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z";
      const mir = !!c.miroir;
      let s = (c.coiffe ? "" : epis(C2, mir)) + E(mir ? 35.4 : 12.6, 23, 1.6, 2.2, C2.skin);
      s += P(back, C2.hair) + clip(`${id}h`, back, `<rect x="8" y="4" width="34" height="32" fill="${C2.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C2.hair}"/><path d="M15,12.6 Q24,8.6 33,12.6 L31.7,13.2 L30.4,12.2 L29,13.2 L27.4,12 L25.8,13 L24,11.8 L22.4,13 L20.8,12 L19.2,13.2 L17.8,12.2 L16.4,13.2 Z" fill="${C2.hairH}" opacity=".85"/><path d="M35.6,10 Q38.8,20 35.8,32 L40,32 L40,10 Z" fill="${C2.rim}" opacity=".85"/>`) + P(back, "none");
      s += P("M17,11 Q24,7.6 31,11", "none", 0.8) + P("M19.6,12.6 Q18.8,20 20.4,27.6", "none", 0.6) + P("M24.4,11.8 Q25.2,19.4 24.2,28.4", "none", 0.6) + P("M28.8,12.8 Q30,20 28.6,27.4", "none", 0.5);
      if (M.salt) s += E(18.8, 10.6, 0.35, 0.35, C2.salt, 0) + E(27.6, 9.8, 0.3, 0.3, C2.salt, 0) + E(31.2, 14, 0.28, 0.28, C2.salt, 0);
      if (!relevee(c)) s += queue(C2, !mir);
      if (M.wet && !relevee(c)) s += gouttesQueue(!mir);
      if (c.coiffe) s += c.coiffe(c, ctx, "tete");
      const ex = EXPR[ALIAS[ctx.expr] || ctx.expr] || EXPR.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var VUES2 = {
      front: {
        X: /* @__PURE__ */ __name((x) => x, "X"),
        dx: 0,
        hdx: 0,
        rk: [1, 1],
        nose: 0,
        mouth: 24,
        ear: null,
        face: "M12.4,21.6 C12.4,15 17.6,11.2 24,11.2 C30.4,11.2 35.6,15 35.6,21.6 C35.6,27 31.8,31 27,32 Q24,32.7 21,32 C16.2,31 12.4,27 12.4,21.6 Z",
        back: "M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z",
        bangs: "M12,18.8 Q12.6,8 24,7.8 Q35.4,8 36,18.4 L34.3,15.4 L33.4,19.8 L30.6,14.2 L28.8,18.9 L25.8,13.6 L24.3,19.4 L21.7,14 L19.6,18.5 L17.3,14.6 L15.4,19.7 L14.1,16.4 Z"
      },
      se: {
        X: /* @__PURE__ */ __name((x) => r22(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), "X"),
        dx: -1.8,
        hdx: 0.4,
        rk: [0.95, 0.82],
        nose: -4,
        mouth: 20.9,
        ear: [35, 23.2],
        face: "M11.4,21.6 C11.4,15 16.4,11.2 22.6,11.2 C28.8,11.2 33.8,15 33.8,21.6 C33.8,27.2 30,31.2 25.2,32.1 Q21.6,32.8 18.8,31.6 C14.4,30 11.4,26.4 11.4,21.6 Z",
        back: "M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z",
        bangs: "M11.6,19.2 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L33.2,15 L32,18.8 L29.2,13.8 L27.4,18.4 L24.6,13.4 L22.6,19.2 L20.2,13.8 L18.2,18.4 L16,14.4 L14.2,19.6 L12.9,16.6 Z"
      }
    };
    module.exports = { lorena, EXPR, C, MARKS };
  }
});

// personnages/refonte/lorena_tenues.js
var require_lorena_tenues = __commonJS({
  "personnages/refonte/lorena_tenues.js"(exports, module) {
    var { castaway, weed, fade, CANVAS } = require_naufrage();
    var { lorena, C } = require_lorena_refonte();
    var { fondre } = require_couleurs();
    var PALETTES = fondre({
      signal: { nom: "Jaune signal", coat: C.coat, coatS: C.coatS, coatH: C.coatH },
      rouille: { nom: "Rouille", coat: "#C9673A", coatS: "#9A4626", coatH: "#F2A57A" },
      algue: { nom: "Algue", coat: "#8C9A4A", coatS: "#66712F", coatH: "#C9D486" },
      quart: { nom: "Bleu de quart", coat: "#3E5F86", coatS: "#2B4565", coatH: "#7FA3C9" },
      nuit: { nom: "Laine de nuit", coat: "#2F4058", coatS: "#1F2C3E", coatH: "#5E7A9C" },
      toile: { nom: "Toile brute", coat: "#9C8656", coatS: "#73603A", coatH: "#CDB98A" }
    });
    var TENUES = {
      cire: { nom: "Le ciré", tenue: "cire", palette: "signal" },
      ouvert: { nom: "Ciré ouvert, marinière", tenue: "ouvert", palette: "signal" },
      vareuse: { nom: "La vareuse de quart", tenue: "vareuse", palette: "nuit" },
      chemise: { nom: "Chemise et gilet", tenue: "chemise", palette: "toile", sleeve: C.shirt, cuff: C.shirtS }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, des actes plus tard", marks: { hem: "clean", salt: 0, dirt: 0, patch: false, rope: false, plaster: false, wrist: false } },
      poussiere: { nom: "Un peu sale", quand: "une journée de chantier", marks: { hem: "clean", salt: 0.3, dirt: 0.75, patch: false, rope: true, plaster: false, wrist: false } },
      rafistolee: { nom: "Rafistolée", quand: "recousue au camp", marks: { hem: "mended", salt: 0.3, dirt: 0.25, patch: true, rope: true, plaster: false, wrist: false } },
      rescapee: { nom: "Rescapée", quand: "les premiers jours", marks: { hem: "torn", salt: 1, dirt: 0.5, patch: true, rope: true, plaster: true, wrist: true } },
      naufragee: { nom: "Naufragée", quand: "sortie de l'eau", marks: { hem: "torn", salt: 1, dirt: 0.3, patch: true, rope: true, plaster: true, wrist: false }, naufrage: true },
      trempee: { nom: "Trempée", quand: "sous l'averse, au bord de l'eau", marks: { hem: "torn", salt: 0.4, dirt: 0.3, patch: true, rope: true, plaster: true, wrist: true, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    function habiller(tenueId = "cire", paletteId = null, etatId = "rescapee") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      let pal = { ...pp };
      delete pal.nom;
      let base = { leg: lorena.leg, legS: lorena.legS, hair: C.hair, hairS: C.hairS };
      if (E.sombre) {
        pal = Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, assombrir(v, E.sombre)]));
        for (const k of ["hair", "hairS", "hairH", "scarf", "scarfS", "shirt", "shirtS"]) pal[k] = assombrir(C[k], E.sombre);
        base = { leg: assombrir(lorena.leg, E.sombre), legS: assombrir(lorena.legS, E.sombre) };
      }
      const K = { ...C, ...pal };
      const c = {
        ...lorena,
        uid: `lo${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        sleeve: T2.sleeve ? E.sombre ? assombrir(T2.sleeve, E.sombre) : T2.sleeve : K.coat,
        cuff: T2.cuff ? E.sombre ? assombrir(T2.cuff, E.sombre) : T2.cuff : null,
        leg: base.leg,
        legS: base.legS,
        teintes: [K.hair, K.coat, K.scarf, K.brass, K.rope, K.shirt]
      };
      if (!E.naufrage) return c;
      const salee = Object.fromEntries(Object.entries(K).filter(([k]) => /^(coat|coatS|coatH|shirt|shirtS|scarf|scarfS|stripe)$/.test(k)).map(([k, v]) => [k, fade(v, 0.6)]));
      c.pal = { ...pal, ...salee };
      c.sleeve = T2.sleeve ? fade(T2.sleeve, 0.6) : salee.coat;
      c.teintes = [K.hair, salee.coat, salee.scarf, K.brass, K.rope, salee.shirt];
      return castaway(c, {
        fade: [c.leg, c.legS],
        k: 0.6,
        skinS: C.skinS,
        leg: "roll",
        sleeves: "torn",
        bandage: "right",
        cape: CANVAS,
        capeExtra: /* @__PURE__ */ __name((view) => `<rect x="0" y="${view === "ne" ? 39.2 : 38.6}" width="48" height="1.15" fill="#C8463A" opacity="0.9"/><circle cx="${view === "ne" ? 30.4 : view === "se" ? 15.2 : 16.4}" cy="${view === "ne" ? 36.6 : 36.4}" r="0.75" fill="none" stroke="#B08A3A" stroke-width="0.55"/>`, "capeExtra"),
        head: /* @__PURE__ */ __name(() => weed("M18.4,7.4 Q12.8,8.2 11.8,13.2 Q11,17.4 12.4,20.4", [[11.6, 13.4, 30]]), "head")
      });
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/gestes_os.js
var require_gestes_os = __commonJS({
  "personnages/refonte/gestes_os.js"(exports, module) {
    var { E, r2: r22, arm } = require_troupe();
    var G = /* @__PURE__ */ __name(() => require_gestes().dessins, "G");
    var kit = /* @__PURE__ */ __name((c, nom, ctx) => G()[nom].call({ ...c, os: false }, ctx), "kit");
    var longueur = /* @__PURE__ */ __name((c, sh) => c.brasL ? c.brasL[sh[0] < 24 ? 0 : 1] : 11, "longueur");
    function vers(c, sh, p, k = 0.96) {
      const Lm = longueur(c, sh) * k, dx = p[0] - sh[0], dy = p[1] - sh[1], d = Math.hypot(dx, dy) || 1;
      return d <= Lm ? [r22(p[0]), r22(p[1])] : [r22(sh[0] + dx / d * Lm), r22(sh[1] + dy / d * Lm)];
    }
    __name(vers, "vers");
    function prise(c, sh, t, l, pref) {
      const Lm = longueur(c, sh) * 0.96;
      const pt = /* @__PURE__ */ __name((q) => [t[0] + (l[0] - t[0]) * q, t[1] + (l[1] - t[1]) * q], "pt");
      let best = null, bd = 1e9, near = null, nd = 1e9;
      for (let i = 0; i <= 50; i++) {
        const q = i / 50, p2 = pt(q), d = Math.hypot(p2[0] - sh[0], p2[1] - sh[1]);
        if (d < nd) {
          nd = d;
          near = p2;
        }
        if (d <= Lm && Math.abs(q - pref) < bd) {
          bd = Math.abs(q - pref);
          best = p2;
        }
      }
      const p = best || near;
      return [r22(p[0]), r22(p[1])];
    }
    __name(prise, "prise");
    function aPortee(c, t, l, mains, ancre) {
      const tient = /* @__PURE__ */ __name((t2, l2) => mains.map(([sh, q]) => prise(c, sh, t2, l2, q)), "tient");
      const ok = /* @__PURE__ */ __name((t2, l2, h2) => h2.every((p, i) => Math.hypot(p[0] - mains[i][0][0], p[1] - mains[i][0][1]) <= longueur(c, mains[i][0]) * 0.96 + 0.01), "ok");
      if (ancre) {
        for (let k = 0; k <= 20; k++) for (const sg of k ? [1, -1] : [1]) {
          const r = sg * k * 2 * Math.PI / 180, dx = t[0] - l[0], dy = t[1] - l[1];
          const t2 = [r22(l[0] + dx * Math.cos(r) - dy * Math.sin(r)), r22(l[1] + dx * Math.sin(r) + dy * Math.cos(r))], h2 = tient(t2, l);
          if (ok(t2, l, h2)) return { t: t2, l, h: h2 };
        }
        return { t, l, h: tient(t, l) };
      }
      let T2 = t, Lb = l, h = tient(T2, Lb);
      for (let k = 0; k < 8 && !ok(T2, Lb, h); k++) {
        let mx = 0, my = 0;
        h.forEach((p, i) => {
          const sh = mains[i][0], d = Math.hypot(p[0] - sh[0], p[1] - sh[1]), m = longueur(c, sh) * 0.96;
          if (d > m) {
            mx += (sh[0] - p[0]) / d * (d - m);
            my += (sh[1] - p[1]) / d * (d - m);
          }
        });
        T2 = [r22(T2[0] + mx), r22(T2[1] + my)];
        Lb = [r22(Lb[0] + mx), r22(Lb[1] + my)];
        h = tient(T2, Lb);
      }
      return { t: T2, l: Lb, h };
    }
    __name(aPortee, "aPortee");
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin), "poing");
    function applaudir(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view !== "se") return kit(this, "applaudir", ctx);
      const y = a[1] + 6.2, x = (a[0] + b[0]) / 2 - 3.4, g = n ? 0.7 : 2.6;
      const hl = vers(this, a, [x - g, y]), hr = vers(this, b, [x + g, y - 0.4]);
      return {
        expr: "rire",
        right: arm(this, b, hr, [b[0] - 1.6, b[1] + 6.8], D.tranche(this, [hr[0], hr[1] - 0.5], -1, 0.95)),
        left: arm(this, a, hl, [a[0] - 1.4, a[1] + 6.8], D.tranche(this, [hl[0], hl[1] - 0.5], 1)),
        over: n ? D.eclat((hl[0] + hr[0]) / 2, y - 3.8) : ""
      };
    }
    __name(applaudir, "applaudir");
    function pecher(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G(), d = n ? 1.6 : 0;
      if (view === "front") {
        const talon = [a[0] + 4, a[1] + 10.4], scion = [Math.min(45.6, b[0] + 13.6), a[1] - 8 + d];
        const ha = prise(this, a, talon, scion, 0.12), hb = prise(this, b, talon, scion, 0.36);
        return { expr: "content", left: D.canne(talon, scion, [Math.min(43, b[0] + 11), 54.4], 1, n) + arm(this, a, ha, [a[0] - 0.6, a[1] + 7]), right: arm(this, b, hb, [b[0] + 1.6, b[1] + 6.2]) };
      }
      if (view === "se") {
        const talon = [b[0] - 4.6, b[1] + 10.4], scion = [Math.max(2.4, a[0] - 13.6), a[1] - 8 + d];
        const hb = prise(this, b, talon, scion, 0.12), ha = prise(this, a, talon, scion, 0.38);
        return { expr: "content", right: arm(this, b, hb, [b[0] - 0.6, b[1] + 7.6]), left: D.canne(talon, scion, [Math.max(5, a[0] - 11), 54.4], -1, n) + arm(this, a, ha, [a[0] - 1, a[1] + 6]) };
      }
      return kit(this, "pecher", ctx);
    }
    __name(pecher, "pecher");
    function piocher(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      const se = view === "se", mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
      if (view === "ne") return kit(this, "piocher", ctx);
      const k = se ? 1 : -1, p = se ? [8.6, 61] : [39.4, 61];
      const m = [mid, a[1] + 9.4];
      const h = n ? [p[0] - k * 0.4, p[1] - 4.6] : se ? [Math.max(5, a[0] - 8), a[1] - 13] : [Math.min(43, b[0] + 8), a[1] - 13];
      const [near, far] = se ? [a, b] : [b, a];
      const o = aPortee(this, m, h, [[near, 0.22], [far, 0]], !!n), [hN, hF] = o.h;
      const outil = D.pioche(o.t, o.l, n ? se ? 1 : -1 : se ? -1 : 1);
      return { expr: n ? "rire" : "content", under: D.pierre(...p), left: "", right: "", over: outil + arm(this, far, hF, [far[0] + (se ? 2.4 : -2.4), far[1] + 6.4]) + arm(this, near, hN, [near[0] + (se ? -2.6 : 2.6), near[1] + 5.4]) + (n ? D.eclats(o.l[0] + k * 0.6, o.l[1] + 0.4) : "") };
    }
    __name(piocher, "piocher");
    function cueillir(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") {
        const hp2 = vers(this, b, [b[0] + 2.4, b[1] + 9.4]), pan2 = D.panier(hp2, n ? 4 : 3);
        if (!n) {
          const h2 = vers(this, a, [a[0] - 7.4, a[1] - 3.6]);
          return { left: arm(this, a, h2, [a[0] - 5.6, a[1] + 2.6]) + D.fruit(h2[0] - 0.3, h2[1] - 2), right: arm(this, b, hp2, [b[0] + 3, b[1] + 5]) + pan2 };
        }
        return { left: "", right: arm(this, b, hp2, [b[0] + 3, b[1] + 5]) + pan2, under: arm(this, a, vers(this, a, [24 + 1, a[1] + 8]), [a[0] - 2.4, a[1] + 6]) };
      }
      const se = view === "se", [pS, qS] = se ? [a, b] : [b, a], s = se ? -1 : 1;
      const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
      const hp = vers(this, qS, [mid - s * 1.8, qS[1] + 8.4]), pan = D.panier(hp, n ? 4 : 3);
      const tient = arm(this, qS, hp, [qS[0] - s * 2.6, qS[1] + 5.4]) + pan;
      if (!n) {
        const h2 = vers(this, pS, [pS[0] + s * 7.4, pS[1] - 3.6]);
        return { expr: "content", [se ? "right" : "left"]: tient, [se ? "left" : "right"]: arm(this, pS, h2, [pS[0] + s * 5.6, pS[1] + 2.6]) + D.fruit(h2[0] + s * 0.3, h2[1] - 2) };
      }
      const h = vers(this, pS, [hp[0] + s * 2.4, hp[1] + 0.4]);
      return { expr: "rire", [se ? "right" : "left"]: tient, [se ? "left" : "right"]: "", over: arm(this, pS, h, [pS[0] + s * 2, pS[1] + 7.2]) };
    }
    __name(cueillir, "cueillir");
    function arroser(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view !== "ne") return kit(this, "arroser", ctx);
      const h = vers(this, b, [b[0] + 1.4, b[1] + 6.4]), ar = D.arrosoir(h, 1, 40), sol = a[1] + 18;
      return { left: "", right: "", under: D.pousse(ar.bout[0] - 0.6, sol, n) + ar.svg + D.pluie(ar.bout, sol - 1, 1, n) + arm(this, a, vers(this, a, [24, a[1] + 8]), [a[0] - 1.6, a[1] + 6]), over: arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(arroser, "arroser");
    function becher(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") return kit(this, "becher", ctx);
      const se = view === "se", s = se ? -1 : 1, mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
      const [near, far] = se ? [a, b] : [b, a];
      const sol = 61;
      const [t, l] = n ? [[mid + s * 1.6, a[1] + 4.6], [mid + s * 7.6, sol - 6.4]] : [[mid + s * 0.8, a[1] + 1.6], [mid + s * 3.4, sol + 1.4]];
      const o = aPortee(this, t, l, [[near, 0], [far, 0.32]], !n), [hN, hF] = o.h;
      const outil = D.beche(o.t, o.l, !!n) + (n ? "" : D.terre(o.l[0], sol));
      return { expr: n ? "rire" : "content", under: n ? D.terre(o.l[0] + s * 0.8, sol) : "", left: "", right: "", over: outil + arm(this, far, hF, [far[0] - s * 2.2, far[1] + 7]) + arm(this, near, [hN[0], hN[1] + 0.4], [near[0] + s * 2.4, near[1] + 4]) };
    }
    __name(becher, "becher");
    function semer(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") return kit(this, "semer", ctx);
      const se = view === "se", s = se ? -1 : 1, [p, q] = se ? [a, b] : [b, a];
      const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
      const hs = vers(this, q, [mid - s * 1.4, q[1] + 9.6]), sac = arm(this, q, hs, [q[0] - s * 2.6, q[1] + 5.4]) + D.sacGraines([hs[0] + s * 1.4, hs[1] + 0.6]);
      const [cs, cp] = se ? ["right", "left"] : ["left", "right"];
      if (!n) {
        const h2 = vers(this, p, [hs[0] + s * 2.2, hs[1] - 0.6]);
        return { expr: "content", [cs]: sac, [cp]: "", over: arm(this, p, h2, [p[0] + s * 0.6, p[1] + 7.6]) };
      }
      const h = vers(this, p, [p[0] + s * 6.4, p[1] + 5]);
      return { expr: "content", [cs]: sac, [cp]: arm(this, p, h, [p[0] + s * 4.6, p[1] + 4]), over: D.graines(h[0], h[1] + 1, s) };
    }
    __name(semer, "semer");
    function recolter(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") return kit(this, "recolter", ctx);
      const s = view === "front" ? 1 : -1, p = s > 0 ? b : a, x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol = 61;
      const h = vers(this, p, n ? [x(2.6), sol - 7.4] : [x(5.4), p[1] + 3.4]);
      const outil = D.faucille(h, s, n ? 60 : -20) + arm(this, p, h, n ? [x(2.4), p[1] + 7] : [x(4.6), p[1] + 6]);
      const bx = n ? h[0] + s * 4.4 : x(7);
      return { expr: n ? "rire" : "content", under: D.touffe(bx, sol, n), [s > 0 ? "right" : "left"]: outil };
    }
    __name(recolter, "recolter");
    function scier(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") return kit(this, "scier", ctx);
      const se = view === "se", s = se ? -1 : 1, [p, q] = se ? [a, b] : [b, a];
      const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0), sol = 61, top = r22(Math.min(53, (this.hip || 45) + 1.2));
      const cx = mid + s * 3.4, c = cx + s * 2.6;
      const hq = vers(this, q, [cx - s * 3.4, top - 2.2]);
      const h = vers(this, p, n ? [c - s * 2.4, top - 4.2] : [c - s * 5.4, top - 7.6]);
      return {
        expr: "content",
        left: "",
        right: "",
        over: D.chevalet(cx, sol, c, n, sol - top) + arm(this, q, hq, [q[0] + s * 0.6, q[1] + 8]) + D.scie(h, [c, top - 1.4]) + arm(this, p, h, [p[0] + s * 2.4, p[1] + 6])
      };
    }
    __name(scier, "scier");
    function tailler(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view === "ne") return kit(this, "tailler", ctx);
      const s = view === "front" ? 1 : -1, p = s > 0 ? b : a, sol = 61, cy = sol - 5;
      const h = vers(this, p, [p[0] + s * 1.8, cy - 9.4]);
      const bx = h[0] + s * 5.4, c = [bx - s * 1.8, cy - 8];
      return { expr: n ? "rire" : "content", under: D.buisson(bx, sol, s, n), [s > 0 ? "right" : "left"]: arm(this, p, h, [p[0] + s * 3.4, p[1] + 5]) + D.secateur(h, c, !n) };
    }
    __name(tailler, "tailler");
    function ecrire(ctx) {
      const { view, n } = ctx, [a, b] = this.shoulders, D = G();
      if (view !== "se") return kit(this, "ecrire", ctx);
      const y = a[1] + 3.6, x = (a[0] + b[0]) / 2 - 2, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1];
      const tient = vers(this, a, [x - 4.4, y + 5.8]), hw = vers(this, b, [p[0] + 1.6, p[1] + 2.2]);
      return { expr: "content", left: arm(this, a, tient, [a[0] - 2.4, a[1] + 6.4]), right: "", over: D.carnet(x, y, n ? 2 : 1) + arm(this, b, hw, [b[0] + 1.6, b[1] + 7.4]) + D.crayon([hw[0] - 1.6, hw[1] - 2.2], 0.55, -0.83) };
    }
    __name(ecrire, "ecrire");
    module.exports = { vers, prise, aPortee, applaudir, pecher, piocher, cueillir, arroser, becher, semer, recolter, scier, tailler, ecrire, poing };
  }
});

// atelier/gestes.js
var require_gestes = __commonJS({
  "atelier/gestes.js"(exports, module) {
    var { OUT, P, E, L, limb, zee, r2: r22, frame, arm } = require_troupe2();
    var { enPersonnage } = require_couleurs();
    var CADRE_PARAPLUIE = [0, -18, 48, 82];
    var CADRE_COUCHE = [0, 0, 64, 48];
    var OS = /* @__PURE__ */ __name(() => require_gestes_os(), "OS");
    var trait = /* @__PURE__ */ __name((d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "trait");
    var lueur = /* @__PURE__ */ __name((x, y, r, a = 0.5) => [1, 0.66, 0.4].map((k, i) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r * k)}" fill="rgba(255,214,120,${r22(a * (0.3 + i * 0.3))})"/>`).join(""), "lueur");
    function lanterne(h, n = 0) {
      return `<g transform="translate(${r22(h[0])} ${r22(h[1])}) scale(1.3) translate(${r22(-h[0])} ${r22(-h[1])})">${petiteLanterne(h, n)}</g>`;
    }
    __name(lanterne, "lanterne");
    function petiteLanterne(h, n) {
      const [x, y0] = h, y = y0 + 1.4;
      const flamme = n % 2 ? "M0,-1.6 Q1,0 0,1.2 Q-1,0 0,-1.6 Z" : "M0,-1.9 Q0.8,0.1 0,1.2 Q-0.9,-0.1 0,-1.9 Z";
      return P(`M${r22(x - 1.6)},${r22(y + 1.4)} Q${x},${r22(y - 1.8)} ${r22(x + 1.6)},${r22(y + 1.4)}`, "none", 0.8) + lueur(x, y + 4.6, 4.6, 0.55) + P(`M${r22(x - 2.6)},${r22(y + 2.6)} L${r22(x + 2.6)},${r22(y + 2.6)} L${r22(x + 1.8)},${r22(y + 1.2)} L${r22(x - 1.8)},${r22(y + 1.2)} Z`, "#5A4A3A", 0.8) + `<rect x="${r22(x - 2.1)}" y="${r22(y + 2.6)}" width="4.2" height="4.8" rx="0.6" fill="#FFE7A0" stroke="${OUT}" stroke-width="0.8"/><g transform="translate(${x} ${r22(y + 5.1)})">${P(flamme, "#F2A63A", 0.5)}</g>` + L([x - 2.1, y + 5], [x + 2.1, y + 5], "#5A4A3A", 0.5) + `<rect x="${r22(x - 2.6)}" y="${r22(y + 7.3)}" width="5.2" height="1.3" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.8"/>`;
    }
    __name(petiteLanterne, "petiteLanterne");
    function parapluie(h, col = "#D9443A") {
      const [x, y] = h, cx = x - 5, cy = -3.6;
      const r = 15, dark = "#8E2A24";
      const toile = `M${r22(cx - r)},${r22(cy + 2.4)} Q${r22(cx - r)},${r22(cy - 9.6)} ${r22(cx)},${r22(cy - 10.4)} Q${r22(cx + r)},${r22(cy - 9.6)} ${r22(cx + r)},${r22(cy + 2.4)}` + [0.75, 0.5, 0.25, 0].map((k) => ` Q${r22(cx + r * (k + 0.125) * 2 - r)},${r22(cy + 0.8)} ${r22(cx + r * k * 2 - r)},${r22(cy + 2.4)}`).join("") + " Z";
      const pans = [-0.5, 0, 0.5].map((k) => trait(`M${r22(cx)},${r22(cy - 10.2)} Q${r22(cx + r * k * 0.9)},${r22(cy - 6)} ${r22(cx + r * k * 1.5)},${r22(cy + 2.2)}`, dark, 0.6)).join("");
      return limb([x, y + 1], [cx, cy + 1.6], 0.8, "#7A5A3A") + P(`M${r22(x)},${r22(y + 1)} q0,3 -2.4,3`, "none", 1.2) + P(toile, col) + `<path d="M${r22(cx + r * 0.25)},${r22(cy - 9)} Q${r22(cx + r * 0.8)},${r22(cy - 6)} ${r22(cx + r)},${r22(cy + 2.4)} L${r22(cx + r * 0.5)},${r22(cy + 2.4)} Q${r22(cx + r * 0.4)},${r22(cy - 4)} ${r22(cx + r * 0.25)},${r22(cy - 9)} Z" fill="${dark}" opacity="0.35"/>` + pans + P(toile, "none") + E(cx, cy - 11, 0.8, 0.8, "#7A5A3A", 0.6) + L([cx - r * 0.6, cy - 6.6], [cx - r * 0.25, cy - 8.6], "rgba(255,255,255,.55)", 0.9);
    }
    __name(parapluie, "parapluie");
    function valise(h, col = "#9A5A34") {
      const [x, y] = h;
      return P(`M${r22(x - 1.4)},${r22(y + 2.6)} Q${x},${r22(y + 0.2)} ${r22(x + 1.4)},${r22(y + 2.6)}`, "none", 1) + `<rect x="${r22(x - 4.4)}" y="${r22(y + 2.4)}" width="8.8" height="6.6" rx="1.2" fill="${col}" stroke="${OUT}" stroke-width="1"/><rect x="${r22(x + 1.2)}" y="${r22(y + 2.6)}" width="3" height="6.2" fill="rgba(60,40,25,.2)"/>` + [-2.4, 2].map((d) => L([x + d, y + 2.6], [x + d, y + 8.8], "#5A3A24", 0.7)).join("") + `<rect x="${r22(x - 1.2)}" y="${r22(y + 4.8)}" width="2.4" height="1.8" rx="0.3" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.5"/>`;
    }
    __name(valise, "valise");
    var avecLanterne = /* @__PURE__ */ __name((c) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h, ctx) => lanterne([h[0], Math.min(h[1], 49)], ctx.n), "hold"), holdOver: false }), "avecLanterne");
    var avecParapluie = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => parapluie(h, col), "hold"), holdOver: true }), "avecParapluie");
    var avecValise = /* @__PURE__ */ __name((c, col) => ({ ...c, hold: /* @__PURE__ */ __name((cc, h) => valise(h, col), "hold"), holdOver: false }), "avecValise");
    var ZEDS = /<path d="M([-\d.]+),([-\d.]+) L([-\d.]+),\2 L\1,([-\d.]+) L\3,\4" fill="none"[^>]*\/>/g;
    function couche(c, n = 0, couverture = { fond: "#C98F5A", motif: "#E8C07A" }) {
      const corps = frame(c, "front", "repos", 0, "endormi").replace(ZEDS, "");
      const souffle = n ? -0.5 : 0;
      const couv = `M31,${r22(9.6 + souffle)} Q46,${r22(7.6 + souffle)} 60.6,10.4 Q62.8,24 60.6,37.6 Q46,40.4 31,${r22(38.4 - souffle)} Q28.6,24 31,${r22(9.6 + souffle)} Z`;
      return enPersonnage(`<ellipse cx="32" cy="26" rx="29" ry="14" fill="rgba(40,55,20,.16)"/>` + E(9, 24, 7.6, 11, "#F4EEDF", 1.1) + L([4.6, 18], [6.4, 15.6], "#FFFFFF", 1) + `<g transform="translate(32 24) scale(0.95) translate(-32 -24)"><g transform="translate(0 48) rotate(-90)">${corps}</g></g>` + P(couv, couverture.fond, 1.2) + [16, 24, 32].map((y) => L([33, y + souffle * 0.5], [59.2, y], couverture.motif, 1.1)).join("") + P(`M31,${r22(9.6 + souffle)} Q28.6,24 31,${r22(38.4 - souffle)} L34.6,${r22(38.2 - souffle)} Q32.4,24 34.6,${r22(9.8 + souffle)} Z`, couverture.motif, 0.9) + (n ? zee(30.6, 6.4, 2) + zee(34, 2.4, 2.6) : zee(30, 7.4, 1.8) + zee(33, 3.6, 2.4)));
    }
    __name(couche, "couche");
    function paume(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.85 * s, h = 2.5 * s;
      return E(x + k * w * 0.95, y + 0.5 * s, 0.95 * s, 1.35 * s, f, 0.9) + P(`M${r22(x - w)},${r22(y + h * 0.55)} L${r22(x - w)},${r22(y - h * 0.35)} Q${r22(x - w)},${r22(y - h)} ${r22(x)},${r22(y - h)} Q${r22(x + w)},${r22(y - h)} ${r22(x + w)},${r22(y - h * 0.35)} L${r22(x + w)},${r22(y + h * 0.55)} Q${r22(x)},${r22(y + h * 1.05)} ${r22(x - w)},${r22(y + h * 0.55)} Z`, f, 0.9) + (c.moufle ? "" : [-0.6, 0.6].map((d) => L([x + d * s, y - h + 0.35], [x + d * s, y - h * 0.35], OUT, 0.42)).join(""));
    }
    __name(paume, "paume");
    function tranche(c, [x, y], k, s = 1) {
      const f = c.hand || c.skin, w = 1.3 * s, h = 2.5 * s;
      return P(`M${r22(x - w)},${r22(y + h * 0.6)} L${r22(x - w)},${r22(y - h * 0.4)} Q${r22(x - w)},${r22(y - h)} ${r22(x)},${r22(y - h)} Q${r22(x + w)},${r22(y - h)} ${r22(x + w)},${r22(y - h * 0.4)} L${r22(x + w)},${r22(y + h * 0.6)} Q${r22(x)},${r22(y + h)} ${r22(x - w)},${r22(y + h * 0.6)} Z`, f, 0.9) + E(x + k * w * 0.9, y + 0.6 * s, 0.8 * s, 1.1 * s, f, 0.8);
    }
    __name(tranche, "tranche");
    var ouverte = /* @__PURE__ */ __name((c, [x, y], k, s, a) => `<g transform="rotate(${a} ${r22(x)} ${r22(y)})">${paume(c, [x, y - 0.5], k, s)}</g>`, "ouverte");
    function tendre({ view, n }) {
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
          // (les bras tendus vers l'avant, presque droits, le coude à peine fléchi ; seule la main se relève : repliés en U,
          // les bras épais faisaient un tube plié où l'ourlet d'une manche roulée ou déchirée dessinait une boucle)
          left: arm(this, a, [a[0] - 8.2 - w, a[1] + 6.2], [a[0] - 4, a[1] + 5.4], ouverte(this, [a[0] - 8.2 - w, a[1] + 6.2], 1, 1.12, -14)),
          right: arm(this, b, [b[0] - 11 - w, b[1] + 5.8], [b[0] - 5.6, b[1] + 5.6], ouverte(this, [b[0] - 11 - w, b[1] + 5.8], 1, 1.06, -14))
        };
      }
      return {
        left: "",
        right: "",
        under: arm(this, a, [a[0] + 3.6, a[1] + 4.6 - w], [a[0] - 2.6, a[1] + 5.8]) + arm(this, b, [b[0] + 2.4, b[1] + 4.6 - w], [b[0] + 2, b[1] + 7.2], tranche(this, [b[0] + 2.5, b[1] + 4 - w], 1, 0.95))
      };
    }
    __name(tendre, "tendre");
    var avecMainsTendues = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}mt`, pose: tendre }), "avecMainsTendues");
    var eclat = /* @__PURE__ */ __name((x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => {
      const p = [x + dx * 1.2, y + dy * 1.2], q = [x + dx * 2.4, y + dy * 2.4];
      return L(p, q, OUT, 1.45) + L(p, q, "#FFF6CC", 0.55);
    }).join(""), "eclat");
    function applaudir({ view, n }) {
      if (this.os) return OS().applaudir.call(this, arguments[0]);
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
    __name(applaudir, "applaudir");
    var avecApplaudir = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ap`, pose: applaudir }), "avecApplaudir");
    function canne(b, t, f, k, plonge) {
      const len = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / len, uy = (t[1] - b[1]) / len;
      const at = /* @__PURE__ */ __name((d) => [b[0] + ux * d, b[1] + uy * d], "at");
      const m = at(len * 0.62), g = at(3.2), r = at(5.4), rk = [r[0] - uy * k * 1.5, r[1] + ux * k * 1.5];
      const [x, y] = f, yb = y + (plonge ? 0.7 : 0);
      return L(b, m, OUT, 2.4) + L(m, t, OUT, 1.8) + L(b, m, "#D8AE6E", 1.15) + L(m, t, "#D8AE6E", 0.65) + [0.3, 0.5].map((q) => L(at(len * q - 0.35), at(len * q + 0.35), "#A8794A", 0.9)).join("") + L(b, g, OUT, 2.8) + L(b, g, "#7A4E2A", 1.6) + L(r, rk, OUT, 1) + E(rk[0], rk[1], 1.15, 1.15, "#9AA2AD", 0.6) + E(rk[0] - 0.3, rk[1] - 0.3, 0.4, 0.4, "#E2E8EE", 0) + trait(`M${r22(t[0])},${r22(t[1])} Q${r22(t[0] + (x - t[0]) * 0.2 + (plonge ? 0 : 0.8))},${r22((t[1] + yb) / 2)} ${r22(x)},${r22(yb - 1.5)}`, OUT, 0.35) + E(x, y + 1.2, 4.2, 1.35, "rgba(120,190,226,.55)", 0) + (plonge ? E(x, y + 1.2, 3.6, 1.1, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.45"') : "") + E(x, y + 1.2, 2.4, 0.75, "none", 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.5"') + `<g transform="translate(0 ${plonge ? 0.7 : 0})">${E(x, y, 1.65, 1.65, "#FFFFFF", 0.7)}${P(`M${r22(x - 1.65)},${r22(y)} A1.65,1.65 0 0 1 ${r22(x + 1.65)},${r22(y)} Z`, "#E2463A", 0)}${E(x, y, 1.65, 1.65, "none", 0.7)}${E(x - 0.6, y - 0.7, 0.45, 0.3, "#FFFFFF", 0)}${L([x, y - 1.65], [x, y - 2.5], OUT, 0.5)}</g>`;
    }
    __name(canne, "canne");
    function pecher({ view, n }) {
      if (this.os) return OS().pecher.call(this, arguments[0]);
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
    var avecPecher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pe`, pose: pecher }), "avecPecher");
    function pioche(m, h, k = 1) {
      const len = Math.hypot(h[0] - m[0], h[1] - m[1]), ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b], "pt");
      const fer = [pt(0.4, -5.6), pt(1.6, -2.6), pt(1.9, 0), pt(1.6, 2.4), pt(0.6, 6.2), pt(-0.6, 2.4), pt(-1.1, 0), pt(-0.6, -2.6)];
      const d = `M${fer.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L")} Z`;
      return L(m, h, OUT, 3.4) + L(m, h, "#B07A45", 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], "#C99A62", 0.5) + P(d, "#A9B1BB", 1) + L(pt(0.9, -4), pt(1.2, -1.2), "#E2E8EE", 0.6) + E(h[0], h[1], 1.1, 1.1, "#6E747E", 0.7);
    }
    __name(pioche, "pioche");
    var eclats = /* @__PURE__ */ __name((x, y) => [[-3.6, -2.6, 0.9], [-1.6, -4.6, 0.7], [2.6, -3.4, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, "#9A8E80", 0.5)).join("") + [[0, -1], [0.7, -0.7], [-0.7, -0.7]].map(([dx, dy]) => L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], OUT, 1.4) + L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], "#FFF2B0", 0.6)).join("") + E(x, y + 0.6, 4.4, 1.2, "rgba(110,90,70,.35)", 0), "eclats");
    var pierre = /* @__PURE__ */ __name((x, y) => E(x, y - 0.2, 4.6, 1.3, "rgba(40,55,20,.22)", 0) + P(`M${r22(x - 4.2)},${r22(y)} Q${r22(x - 4.6)},${r22(y - 3.6)} ${r22(x - 1)},${r22(y - 4.4)} Q${r22(x + 3.4)},${r22(y - 4.8)} ${r22(x + 4.2)},${r22(y - 1.4)} Q${r22(x + 4.4)},${r22(y + 0.2)} ${r22(x)},${r22(y + 0.3)} Z`, "#A79E92") + P(`M${r22(x - 2.8)},${r22(y - 2.6)} Q${r22(x - 1.6)},${r22(y - 3.8)} ${r22(x + 0.4)},${r22(y - 3.8)}`, "none", 0).replace('stroke="none"', 'stroke="#D2CBC0" stroke-width="0.8" stroke-linecap="round"') + P(`M${r22(x + 1.4)},${r22(y - 4.2)} L${r22(x + 0.8)},${r22(y - 2.4)} L${r22(x + 1.6)},${r22(y - 1.2)}`, "none", 0.5), "pierre");
    var surLigne = /* @__PURE__ */ __name((m, h, q) => {
      const l = Math.hypot(h[0] - m[0], h[1] - m[1]);
      return [m[0] + (h[0] - m[0]) * q / l, m[1] + (h[1] - m[1]) * q / l];
    }, "surLigne");
    function piocher({ view, n }) {
      if (this.os) return OS().piocher.call(this, arguments[0]);
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
    var avecPiocher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}pi`, pose: piocher }), "avecPiocher");
    var fruit = /* @__PURE__ */ __name((x, y, s = 1, col = "#E2463A") => E(x, y, 1.45 * s, 1.35 * s, col, 0.7) + E(x - 0.5 * s, y - 0.45 * s, 0.4 * s, 0.3 * s, "#FFFFFF", 0).replace("fill=", 'fill-opacity="0.7" fill=') + L([x, y - 1.2 * s], [x + 0.3 * s, y - 2.1 * s], OUT, 0.5) + P(`M${r22(x + 0.3 * s)},${r22(y - 1.9 * s)} q1.2,-0.9 1.9,-0.1 q-1,0.7 -1.9,0.1 Z`, "#6FB24E", 0.4), "fruit");
    function panier([x, y], n = 3) {
      const by = y + 5, w = 5.4;
      const anse = `M${r22(x - w * 0.8)},${r22(by)} Q${r22(x)},${r22(y - 2.6)} ${r22(x + w * 0.8)},${r22(by)}`;
      const corps = `M${r22(x - w)},${r22(by)} L${r22(x - w * 0.78)},${r22(by + 5)} Q${r22(x)},${r22(by + 6.2)} ${r22(x + w * 0.78)},${r22(by + 5)} L${r22(x + w)},${r22(by)} Q${r22(x)},${r22(by + 1.3)} ${r22(x - w)},${r22(by)} Z`;
      const fruits = [[-2.6, -0.1, "#E2463A"], [2.6, 0, "#E2463A"], [0, -0.5, "#F2A63A"], [-1.2, -1.5, "#C9343A"]].slice(0, n).map(([dx, dy, c]) => fruit(x + dx, by + dy, 0.85, c)).join("");
      return P(anse, "none", 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"`) + P(anse, "none", 0).replace('stroke="none"', 'stroke="#C99A5A" stroke-width="1" stroke-linecap="round"') + E(x, by, w, 1.3, "#7A5A30", 0.8) + fruits + P(corps, "#C99A5A") + [2, 3.6].map((d) => `<path d="M${r22(x - w * 0.93 + d * 0.05)},${r22(by + d)} Q${r22(x)},${r22(by + d + 1.1)} ${r22(x + w * 0.93 - d * 0.05)},${r22(by + d)}" fill="none" stroke="#A67A40" stroke-width="0.5"/>`).join("") + [-2.8, 0, 2.8].map((d) => L([x + d, by + 1.2], [x + d * 0.85, by + 5.4], "#A67A40", 0.45)).join("") + `<path d="M${r22(x - w)},${r22(by)} Q${r22(x)},${r22(by + 2.6)} ${r22(x + w)},${r22(by)}" fill="none" stroke="${OUT}" stroke-width="2.3" stroke-linecap="round"/><path d="M${r22(x - w)},${r22(by)} Q${r22(x)},${r22(by + 2.6)} ${r22(x + w)},${r22(by)}" fill="none" stroke="#E2B878" stroke-width="1" stroke-linecap="round"/>`;
    }
    __name(panier, "panier");
    function cueillir({ view, n }) {
      if (this.os) return OS().cueillir.call(this, arguments[0]);
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
    var avecCueillir = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}cu`, pose: cueillir }), "avecCueillir");
    function arrosoir(h, k = 1, a = 0) {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      const pt = /* @__PURE__ */ __name((x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c], "pt");
      const d = /* @__PURE__ */ __name((ps) => `M${ps.map(([x, y]) => pt(x, y).map(r22).join(",")).join(" L")} Z`, "d");
      const corps = d([[-4.2, 2.4], [3.6, 2.4], [3.9, 9.4], [-4.5, 9.4]]);
      const bec = d([[3.4, 7.6], [9, 2.4], [9.5, 3.2], [3.8, 9.2]]);
      const pomme = pt(9.7, 2.6), bout = pt(10.4, 3.4);
      const anse = `M${pt(-3.2, 2.6).map(r22)} Q${pt(-0.4, -3.4).map(r22)} ${pt(2.4, 2.6).map(r22)}`;
      const t = /* @__PURE__ */ __name((dd, col, w) => trait(dd, col, w), "t");
      return {
        svg: t(anse, OUT, 2.6) + t(anse, "#3F7A57", 1.2) + P(bec, "#4E8F6A", 0.9) + E(pomme[0], pomme[1], 1.6, 1.6, "#3F7A57", 0.8) + E(pomme[0], pomme[1], 0.7, 0.7, "#9CC9A8", 0) + P(corps, "#4E8F6A") + L(pt(-4.3, 5), pt(3.7, 5), "#6FB08A", 1) + L(pt(-3, 3.6), pt(-3.2, 8.4), "#A6D4B4", 0.7),
        bout
      };
    }
    __name(arrosoir, "arrosoir");
    var pluie = /* @__PURE__ */ __name(([x, y], sol, k, n) => [0, 1, 2].map((i) => {
      const q = (i + 0.4 + (n ? 0.5 : 0)) / 3, gx = x + k * 1.2 * q, gy = y + (sol - y) * q;
      return gy < sol - 1 ? P(`M${r22(gx)},${r22(gy - 1.2)} Q${r22(gx + 1.1)},${r22(gy + 0.3)} ${r22(gx)},${r22(gy + 0.9)} Q${r22(gx - 1.1)},${r22(gy + 0.3)} ${r22(gx)},${r22(gy - 1.4)} Z`, "#8FD3F2", 0.4) : "";
    }).join(""), "pluie");
    var pousse = /* @__PURE__ */ __name((x, y, n) => E(x, y, 4.4, 1.2, "#6B4A2E", 0.6) + E(x - 0.6, y - 0.2, 2.2, 0.5, "#8A6440", 0) + L([x, y], [x, y - 3.6], OUT, 1.4) + L([x, y], [x, y - 3.6], "#6FB24E", 0.6) + P(`M${r22(x)},${r22(y - 3.2)} q-2.4,${n ? -1.6 : -0.6} -3.4,${n ? -0.2 : 0.8} q1.8,0.8 3.4,-0.8 Z`, "#7CC25A", 0.5) + P(`M${r22(x)},${r22(y - 3.4)} q2.4,${n ? -1.6 : -0.6} 3.4,${n ? -0.2 : 0.8} q-1.8,0.8 -3.4,-0.8 Z`, "#7CC25A", 0.5), "pousse");
    function arroser({ view, n }) {
      if (this.os) return OS().arroser.call(this, arguments[0]);
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
    var avecArroser = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ar`, pose: arroser }), "avecArroser");
    function beche(t, l, motte = false) {
      const len = Math.hypot(l[0] - t[0], l[1] - t[1]), ux = (l[0] - t[0]) / len, uy = (l[1] - t[1]) / len, nx = -uy, ny = ux;
      const pt = /* @__PURE__ */ __name((a, b) => [l[0] - ux * a + nx * b, l[1] - uy * a + ny * b], "pt");
      const haut = pt(7, 0);
      const lame = [pt(7, -2.8), pt(7, 2.8), pt(0.8, 2.6), pt(0, 1.2), pt(0, -1.2), pt(0.8, -2.6)];
      const d = `M${lame.map((p) => p.map(r22).join(",")).join(" L")} Z`;
      const mt = motte ? (() => {
        const [mx, my] = pt(4, 0);
        return E(mx - nx * 0.4, my - 1.6, 3, 1.9, "#7A5434", 0.8) + E(mx - 0.8, my - 2.2, 1, 0.6, "#9A7048", 0);
      })() : "";
      return L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], OUT, 3) + L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], "#B07A45", 1.3) + L(t, haut, OUT, 3.2) + L(t, haut, "#B07A45", 1.5) + L(t, surLigne(t, haut, len * 0.5), "#C99A62", 0.5) + P(d, "#A9B1BB", 1) + L(pt(6, -1.6), pt(1.4, -1.6), "#E2E8EE", 0.7) + mt;
    }
    __name(beche, "beche");
    var terre = /* @__PURE__ */ __name((x, y) => E(x, y, 5, 1.4, "rgba(40,55,20,.22)", 0) + P(`M${r22(x - 4.6)},${r22(y + 0.4)} Q${r22(x - 3.4)},${r22(y - 2.6)} ${r22(x)},${r22(y - 2.4)} Q${r22(x + 3.6)},${r22(y - 2.4)} ${r22(x + 4.6)},${r22(y + 0.4)} Z`, "#7A5434", 0.8) + E(x - 2.2, y - 1.4, 1.1, 0.7, "#9A7048", 0) + E(x + 2, y - 1, 0.9, 0.6, "#5E3F26", 0) + E(x + 5.6, y - 0.2, 0.9, 0.7, "#7A5434", 0.5), "terre");
    function becher({ view, n }) {
      if (this.os) return OS().becher.call(this, arguments[0]);
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61;
        const [t2, l2] = n ? [[x(2), a[1] + 6], [x(10), sol2 - 6.4]] : [[x(5.4), a[1] + 1], [x(6.6), sol2 + 1.4]];
        const haut = [t2[0], t2[1] + 0.6], bas = surLigne(t2, l2, n ? 6.4 : 9.4);
        const outil = beche(t2, l2, !!n) + (n ? "" : terre(x(6.6), sol2));
        const main = arm(this, p, haut, [x(n ? 2.4 : 4.4), p[1] + 3.4]), autre = arm(this, q, bas, [q[0] + s * 2.4, q[1] + 7.6]);
        const sous = n ? terre(x(7.4), sol2) : "";
        const [cote, loin] = s > 0 ? ["right", "left"] : ["left", "right"];
        return { expr: n ? "rire" : "content", under: sous, [cote]: outil + main, [loin]: autre };
      }
      const sol = a[1] + 18;
      const [t, l] = n ? [[b[0] + 1, a[1] + 4], [b[0] + 8, sol - 5]] : [[b[0] + 3.6, a[1] - 1], [b[0] + 4.8, sol + 1.4]];
      return { expr: n ? "rire" : void 0, left: "", right: "", under: (n ? terre(b[0] + 5, sol) : "") + beche(t, l, !!n) + (n ? "" : terre(b[0] + 4.8, sol)) + arm(this, a, surLigne(t, l, 8), [a[0] - 1.6, a[1] + 6]), over: arm(this, b, [t[0], t[1] + 0.6], [b[0] + 3, b[1] + 3]) };
    }
    __name(becher, "becher");
    var avecBecher = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}be`, pose: becher }), "avecBecher");
    var sacGraines = /* @__PURE__ */ __name(([x, y]) => P(`M${r22(x - 3.4)},${r22(y)} Q${r22(x - 4.4)},${r22(y + 6)} ${r22(x)},${r22(y + 6.6)} Q${r22(x + 4.4)},${r22(y + 6)} ${r22(x + 3.4)},${r22(y)} Z`, "#D8C49A") + E(x, y, 3.4, 1.1, "#6E5434", 0.8) + [[-1.4, -0.3], [0.2, -0.6], [1.6, -0.2]].map(([dx, dy]) => E(x + dx, y + dy, 0.6, 0.4, "#E8C66A", 0)).join("") + `<path d="M${r22(x - 3.4)},${r22(y)} Q${r22(x)},${r22(y + 1.4)} ${r22(x + 3.4)},${r22(y)}" fill="none" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/><path d="M${r22(x - 3.4)},${r22(y)} Q${r22(x)},${r22(y + 1.4)} ${r22(x + 3.4)},${r22(y)}" fill="none" stroke="#EDE0BE" stroke-width="0.8" stroke-linecap="round"/>` + L([x - 1.6, y + 3], [x - 1.2, y + 5.4], "#B8A274", 0.5), "sacGraines");
    var graines = /* @__PURE__ */ __name((x, y, k) => [[2, 1.6], [3.6, 3.4], [2.6, 5.4], [5, 5.8], [4.2, 8], [6.2, 8.6]].map(([dx, dy], i) => {
      const gx = x + k * dx * 0.75, gy = y + dy * 1.5;
      return E(gx, gy, 0.75, 0.55, "#E8C66A", 0.45).replace("/>", ` transform="rotate(${i * 37 % 90 - 45} ${r22(gx)} ${r22(gy)})"/>`);
    }).join(""), "graines");
    function semer({ view, n }) {
      if (this.os) return OS().semer.call(this, arguments[0]);
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const hs2 = [q[0] - s * 1.6, q[1] + 10], sac2 = arm(this, q, hs2, [q[0] - s * 2.6, q[1] + 5.4]) + sacGraines([hs2[0] + s * 1.4, hs2[1] + 0.6]);
        if (!n) {
          const h3 = [hs2[0] + s * 1.8, hs2[1] - 0.6];
          return { expr: "content", [s > 0 ? "left" : "right"]: sac2, [s > 0 ? "right" : "left"]: arm(this, p, h3, [p[0] + s * 0.4, p[1] + 8]) };
        }
        const h2 = [p[0] + s * 6.4, p[1] + 5];
        return { expr: "content", [s > 0 ? "left" : "right"]: sac2, [s > 0 ? "right" : "left"]: arm(this, p, h2, [p[0] + s * 4.6, p[1] + 4]), over: graines(h2[0], h2[1] + 1, s) };
      }
      const hs = [a[0] - 1.4, a[1] + 10];
      const sac = arm(this, a, hs, [a[0] - 2.4, a[1] + 5.4]) + sacGraines([hs[0] - 1, hs[1] + 0.6]);
      if (!n) return { left: sac, right: "", under: arm(this, b, [24 + 2, b[1] + 9], [b[0] - 0.6, b[1] + 7]) };
      const h = [b[0] + 6, b[1] + 4];
      return { left: sac, right: arm(this, b, h, [b[0] + 4.4, b[1] + 3.4]), over: graines(h[0], h[1] + 1, 1) };
    }
    __name(semer, "semer");
    var avecSemer = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}se`, pose: semer }), "avecSemer");
    function faucille(h, k = 1, a = 0) {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      const pt = /* @__PURE__ */ __name((x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c].map(r22).join(","), "pt");
      const lame = `M${pt(0, -2.4)} Q${pt(1.4, -9.4)} ${pt(7.6, -7.8)} Q${pt(9.4, -7)} ${pt(9.2, -5.6)} Q${pt(6.6, -7)} ${pt(3.6, -6)} Q${pt(1.6, -5)} ${pt(1.2, -2.2)} Z`;
      const manche = `M${pt(0, 3)} L${pt(0, -2.6)}`;
      return trait(manche, OUT, 3) + trait(manche, "#B07A45", 1.5) + P(lame, "#A9B1BB", 0.9) + trait(`M${pt(1.2, -4.6)} Q${pt(2.4, -7.4)} ${pt(6, -7.4)}`, "#E2E8EE", 0.6);
    }
    __name(faucille, "faucille");
    var epi = /* @__PURE__ */ __name((x, y, dx, hy) => L([x, y], [x + dx, y - hy], OUT, 1.2) + L([x, y], [x + dx, y - hy], "#D9B04A", 0.5) + E(x + dx * 1.08, y - hy - 1.2, 0.85, 1.7, "#E8C66A", 0.5), "epi");
    var touffe = /* @__PURE__ */ __name((x, y, n) => E(x, y, 4.6, 1.2, "rgba(40,55,20,.22)", 0) + (n ? [-2.4, -0.8, 0.8, 2.4].map((d) => L([x + d, y], [x + d * 1.1, y - 1.6], "#B89A40", 0.7)).join("") + [[-1.6, -6, 30], [1.8, -7.6, -40], [3.4, -5, 70]].map(([dx, dy, r]) => L([x + dx - 0.8, y + dy], [x + dx + 0.8, y + dy], "#D9B04A", 0.6).replace("/>", ` transform="rotate(${r} ${r22(x + dx)} ${r22(y + dy)})"/>`)).join("") : [[-2.4, -0.8, 8], [-0.8, -0.2, 9.2], [0.8, 0.3, 8.6], [2.4, 0.9, 7.6]].map(([d, dx, hy]) => epi(x + d, y, dx, hy)).join("")), "touffe");
    function recolter({ view, n }) {
      if (this.os) return OS().recolter.call(this, arguments[0]);
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, p = s > 0 ? b : a;
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61;
        const h2 = n ? [x(2.6), sol2 - 7.4] : [x(5.4), p[1] + 3.4];
        const outil = faucille(h2, s, n ? 60 : -20) + arm(this, p, h2, n ? [x(2.4), p[1] + 7] : [x(4.6), p[1] + 6]);
        return { expr: n ? "rire" : "content", under: touffe(x(7), sol2, n), [s > 0 ? "right" : "left"]: outil };
      }
      const sol = a[1] + 18, h = n ? [b[0] + 2, sol - 6] : [b[0] + 5, b[1] + 1];
      return { expr: n ? "rire" : void 0, right: "", under: touffe(b[0] + 6, sol, n), over: faucille(h, 1, n ? 60 : -20) + arm(this, b, h, [b[0] + 3.6, b[1] + 4]) };
    }
    __name(recolter, "recolter");
    var avecRecolter = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}rc`, pose: recolter }), "avecRecolter");
    function scie(h, c) {
      const len = Math.hypot(c[0] - h[0], c[1] - h[1]), ux = (c[0] - h[0]) / len, uy = (c[1] - h[1]) / len, nx = -uy, ny = ux;
      const k = nx * (c[0] > h[0] ? 1 : -1) < 0 || ny < 0 ? -1 : 1;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b * k, h[1] + uy * a + ny * b * k], "pt");
      const L2 = len + 2.4, lame = [pt(1.4, -1.6), pt(L2, -0.8), pt(L2, 0.8), pt(1.4, 1.4)];
      const dents = Array.from({ length: 6 }, (_, i) => {
        const q = 2.4 + i * (L2 - 3) / 6;
        return `${pt(q, 1.2).map(r22)} ${pt(q + 0.6, 1.9).map(r22)}`;
      }).join(" L");
      return P(`M${lame.map((p) => p.map(r22).join(",")).join(" L")} Z`, "#B8C0C9", 0.9) + P(`M${pt(2.4, 1.2).map(r22)} L${dents} L${pt(L2, 0.8).map(r22)} Z`, "#8E96A0", 0.5) + L(pt(2.6, -0.6), pt(L2 - 1, -0.3), "#E2E8EE", 0.6) + E(h[0], h[1], 2.1, 2.1, "#B07A45", 0.9) + E(h[0] - ux * 0.3, h[1] - uy * 0.3, 0.8, 0.8, "#5E3F26", 0);
    }
    __name(scie, "scie");
    function chevalet(x, y, c, n, haut = 8) {
      const top = y - haut, pied = /* @__PURE__ */ __name((dx) => L([x + dx - 3, y], [x + dx + 3, top + 2], OUT, 2.2) + L([x + dx - 3, y], [x + dx + 3, top + 2], "#9A6A3E", 1) + L([x + dx + 3, y], [x + dx - 3, top + 2], OUT, 2.2) + L([x + dx + 3, y], [x + dx - 3, top + 2], "#9A6A3E", 1), "pied");
      const buche = `<rect x="${r22(x - 5.4)}" y="${r22(top - 1.6)}" width="10.8" height="3.6" rx="1.6" fill="#B07A45" stroke="${OUT}" stroke-width="0.9"/>` + E(x + 5.2, top + 0.2, 1.2, 1.7, "#E2B878", 0.8) + E(x + 5.2, top + 0.2, 0.5, 0.8, "#C99A62", 0) + L([x - 4, top - 0.4], [x + 2, top - 0.4], "#C99A62", 0.5);
      const entaille = L([c, top - 1.6], [c, top - 1.6 + (n ? 2.4 : 1.2)], "#5E3F26", 0.8);
      const sciure = E(c, y - 0.2, 2.4, 0.6, "#E8CFA0", 0.4) + (n ? [[0.6, 3], [-0.4, 5], [0.8, 6.6]] : [[0.2, 4]]).map(([dx, dy]) => E(c + dx, top + dy, 0.5, 0.4, "#E8CFA0", 0)).join("");
      return E(x, y, 6, 1.2, "rgba(40,55,20,.22)", 0) + pied(-1.6) + buche + entaille + sciure;
    }
    __name(chevalet, "chevalet");
    function scier({ view, n }) {
      if (this.os) return OS().scier.call(this, arguments[0]);
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b];
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61, top2 = sol2 - 8, c2 = x(6.4);
        const h2 = n ? [x(3.2), top2 - 4.2] : [x(-0.4), top2 - 8.6];
        const tient = arm(this, q, [x(1.6) - s * 3.6, top2 - 2.2], [q[0] + s * 0.6, q[1] + 8]);
        return { expr: "content", under: chevalet(x(7.4), sol2, c2, n), [s > 0 ? "left" : "right"]: tient, [s > 0 ? "right" : "left"]: scie(h2, [c2, top2 - 1.4]) + arm(this, p, h2, [x(n ? 2.4 : 1.6), p[1] + 6]) };
      }
      const sol = a[1] + 18, top = sol - 8, c = b[0] + 5.4, h = n ? [b[0] + 2.6, top - 3.4] : [b[0] - 0.4, top - 7];
      return { right: "", under: chevalet(b[0] + 6, sol, c, n), over: scie(h, [c, top - 1.4]) + arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(scier, "scier");
    var avecScier = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}sc`, pose: scier }), "avecScier");
    function secateur(h, c, ouvert) {
      const len = Math.hypot(c[0] - h[0], c[1] - h[1]), ux = (c[0] - h[0]) / len, uy = (c[1] - h[1]) / len, nx = -uy, ny = ux;
      const pt = /* @__PURE__ */ __name((a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b], "pt");
      const e = ouvert ? 1.6 : 0.3, axe = pt(1.6, 0);
      const lame = /* @__PURE__ */ __name((s) => P(`M${axe.map(r22)} L${pt(5.4, s * e * 1.4).map(r22)} L${pt(5, s * (e * 1.4 + 0.9)).map(r22)} Z`, "#B8C0C9", 0.7), "lame");
      const poignee = /* @__PURE__ */ __name((s) => L(pt(-2.6, s * 1), axe, OUT, 2.4) + L(pt(-2.6, s * 1), axe, "#D9443A", 1.1), "poignee");
      return poignee(1) + poignee(-1) + lame(1) + lame(-1) + E(axe[0], axe[1], 0.6, 0.6, "#6E747E", 0.5);
    }
    __name(secateur, "secateur");
    function buisson(x, y, k, n) {
      const cy = y - 5, b0 = [x - k * 1, cy - 3.6], b1 = [x - k * 2.6, cy - 11];
      const feuille = /* @__PURE__ */ __name((fx, fy) => E(fx, fy, 1.1, 0.7, "#7CC25A", 0.4), "feuille");
      const ronds = [[-3.2, 1, 3], [3.2, 1, 3], [0, -1.6, 3.6], [-1.8, 2.4, 2.8], [1.8, 2.4, 2.8]];
      const touffu = ronds.map(([dx, dy, r]) => E(x + dx, cy + dy, r + 0.5, r + 0.5, OUT, 0)).join("") + ronds.map(([dx, dy, r]) => E(x + dx, cy + dy, r, r, "#4E9A4A", 0)).join("") + [[-2.8, -0.4], [1.2, -3], [3, 1.4], [-1.2, 2.4], [0.4, 0]].map(([dx, dy]) => feuille(x + dx, cy + dy)).join("");
      const tige = /* @__PURE__ */ __name((p0, p1) => L(p0, p1, OUT, 1.6) + L(p0, p1, "#7A5434", 0.8), "tige");
      if (!n) return E(x, y, 6.4, 1.3, "rgba(40,55,20,.22)", 0) + tige(b0, b1) + feuille(b1[0] - k * 0.8, b1[1] + 1.6) + feuille(b1[0] + k * 0.9, b1[1] + 3.4) + touffu;
      const t0 = [x + k * 1.4, cy - 4.4], t1 = [x + k * 4.6, cy - 1.4];
      return E(x, y, 6.4, 1.3, "rgba(40,55,20,.22)", 0) + tige(b0, [x - k * 1.5, cy - 6]) + touffu + tige(t0, t1) + feuille(t1[0] + k * 0.4, t1[1] - 1.2) + feuille(t0[0] + k * 1.6, t0[1] + 0.4);
    }
    __name(buisson, "buisson");
    function tailler({ view, n }) {
      if (this.os) return OS().tailler.call(this, arguments[0]);
      const [a, b] = this.shoulders;
      if (view === "front" || view === "se") {
        const s = view === "front" ? 1 : -1, p = s > 0 ? b : a;
        const x = /* @__PURE__ */ __name((dx) => p[0] + s * dx, "x"), sol2 = 61, bx2 = x(7.2), cy2 = sol2 - 5;
        const h2 = [x(1.8), cy2 - 9.4], c2 = [bx2 - s * 1.8, cy2 - 8];
        return { expr: n ? "rire" : "content", under: buisson(bx2, sol2, s, n), [s > 0 ? "right" : "left"]: arm(this, p, h2, [x(3.4), p[1] + 5]) + secateur(h2, c2, !n) };
      }
      const sol = a[1] + 18, bx = b[0] + 5.2, cy = sol - 5, h = [b[0] + 0.8, cy - 9.4], c = [bx - 1.8, cy - 8];
      return { expr: n ? "rire" : void 0, right: "", under: buisson(bx, sol, 1, n), over: secateur(h, c, !n) + arm(this, b, h, [b[0] + 3, b[1] + 4]) };
    }
    __name(tailler, "tailler");
    var avecTailler = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ta`, pose: tailler }), "avecTailler");
    function caisse(x, y, w = 11, h = 8.4) {
      const g = x - w / 2, d = x + w / 2, t = y - h, p = 2.2;
      const face = `M${r22(g)},${r22(y)} L${r22(d)},${r22(y)} L${r22(d)},${r22(t)} L${r22(g)},${r22(t)} Z`;
      const dessus = `M${r22(g)},${r22(t)} L${r22(g + p)},${r22(t - p * 0.7)} L${r22(d + p)},${r22(t - p * 0.7)} L${r22(d)},${r22(t)} Z`;
      const cote = `M${r22(d)},${r22(y)} L${r22(d + p)},${r22(y - p * 0.7)} L${r22(d + p)},${r22(t - p * 0.7)} L${r22(d)},${r22(t)} Z`;
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
    var avecPorter = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}po`, pose: porter }), "avecPorter");
    function marteau(m, t) {
      const len = Math.hypot(t[0] - m[0], t[1] - m[1]), ux = (t[0] - m[0]) / len, uy = (t[1] - m[1]) / len, nx = -uy, ny = ux;
      const q = /* @__PURE__ */ __name((a, b) => [t[0] + ux * a + nx * b, t[1] + uy * a + ny * b], "q");
      const tete = [q(-1.3, -3.2), q(1.3, -3.2), q(1.3, 2.2), q(0.4, 3.6), q(-0.4, 3.6), q(-1.3, 2.2)];
      return L(m, t, OUT, 3.2) + L(m, t, "#C99A62", 1.4) + L(m, [m[0] + ux * 2.4, m[1] + uy * 2.4], "#7A4E2A", 1.6) + P(`M${tete.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L")} Z`, "#8E96A0", 0.9) + L(q(-0.7, -2.6), q(-0.7, 1.4), "#C9CFD6", 0.5);
    }
    __name(marteau, "marteau");
    var planche = /* @__PURE__ */ __name((g, d, y, cx) => `<rect x="${r22(g)}" y="${r22(y - 1.5)}" width="${r22(d - g)}" height="3" rx="0.6" fill="#D2A574" stroke="${OUT}" stroke-width="0.9"/>` + L([g + 1, y - 0.3], [d - 1, y - 0.3], "#B8875A", 0.45) + L([g + 2, y + 0.7], [d - 3, y + 0.7], "#B8875A", 0.4) + L([cx, y - 1.4], [cx, y - 3.4], OUT, 1.3) + L([cx, y - 1.4], [cx, y - 3.4], "#C9CFD6", 0.5) + E(cx, y - 3.5, 0.9, 0.35, "#8E96A0", 0.5), "planche");
    var tac = /* @__PURE__ */ __name((x, y) => [[-1, -0.6], [0, -1.1], [1, -0.6]].map(([dx, dy]) => {
      const p = [x + dx * 1.6, y + dy * 1.6], q = [x + dx * 3, y + dy * 3];
      return L(p, q, OUT, 1.4) + L(p, q, "#FFF2B0", 0.6);
    }).join(""), "tac");
    function reparer({ view, n }) {
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
    __name(reparer, "reparer");
    var avecReparer = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}re`, pose: reparer }), "avecReparer");
    function onde(x, y, dx, dy, n) {
      const k = n ? 1.2 : 1;
      const anneau = /* @__PURE__ */ __name((r, o) => {
        const e = /* @__PURE__ */ __name((color, w) => `<ellipse cx="${r22(x + dx * o)}" cy="${r22(y + dy * o)}" rx="${r22(r)}" ry="${r22(r * 0.9)}" fill="none" stroke="${color}" stroke-width="${w}"/>`, "e");
        return e(OUT, 1.5) + e("#EAF6FF", 0.7);
      }, "anneau");
      const etoile = /* @__PURE__ */ __name((sx, sy, s) => `<path d="M${r22(sx)},${r22(sy - s)} Q${r22(sx + s * 0.2)},${r22(sy - s * 0.2)} ${r22(sx + s)},${r22(sy)} Q${r22(sx + s * 0.2)},${r22(sy + s * 0.2)} ${r22(sx)},${r22(sy + s)} Q${r22(sx - s * 0.2)},${r22(sy + s * 0.2)} ${r22(sx - s)},${r22(sy)} Q${r22(sx - s * 0.2)},${r22(sy - s * 0.2)} ${r22(sx)},${r22(sy - s)} Z" fill="#FFF2B0" stroke="${OUT}" stroke-width="0.4"/>`, "etoile");
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
    var avecRepousser = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}rp`, pose: repousser }), "avecRepousser");
    function carnet(x, y, lignes) {
      return P(`M${r22(x - 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y + 6)} L${r22(x - 5.4)},${r22(y + 6)} Z`, "#3E5A8C", 0.9) + P(`M${r22(x - 4.7)},${r22(y - 0.5)} Q${r22(x - 2.3)},${r22(y - 1.3)} ${r22(x)},${r22(y)} Q${r22(x + 2.3)},${r22(y - 1.3)} ${r22(x + 4.7)},${r22(y - 0.5)} L${r22(x + 4.7)},${r22(y + 5.1)} Q${r22(x + 2.3)},${r22(y + 4.4)} ${r22(x)},${r22(y + 5.4)} Q${r22(x - 2.3)},${r22(y + 4.4)} ${r22(x - 4.7)},${r22(y + 5.1)} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.4], OUT, 0.55) + L([x + 3.4, y + 5.2], [x + 3.6, y + 7.4], "#D9443A", 0.7) + [1.4, 2.5, 3.6].map((d) => L([x - 3.9, y + d], [x - 1, y + d], "#8A7A6A", 0.4)).join("") + [1.4, 2.5, 3.6].slice(0, lignes).map((d) => `<path d="M${r22(x + 1)},${r22(y + d)} q0.5,-0.4 1,0 t1,0 t1,0" fill="none" stroke="#3E5A8C" stroke-width="0.4"/>`).join("");
    }
    __name(carnet, "carnet");
    function crayon(p, ux, uy) {
      const l = 6, q = [p[0] + ux * l, p[1] + uy * l], t = [p[0] + ux * 1.2, p[1] + uy * 1.2];
      return L(t, q, OUT, 2.2) + L(t, q, "#F2C04B", 1) + L(p, t, OUT, 1.1) + L(p, [p[0] + ux * 0.6, p[1] + uy * 0.6], "#3A3A44", 0.5) + L([q[0] - ux * 0.9, q[1] - uy * 0.9], q, "#F2A0B0", 1);
    }
    __name(crayon, "crayon");
    function ecrire({ view, n }) {
      if (this.os) return OS().ecrire.call(this, arguments[0]);
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
    __name(ecrire, "ecrire");
    var avecEcrire = /* @__PURE__ */ __name((c) => ({ ...c, uid: `${c.uid}ec`, pose: ecrire }), "avecEcrire");
    module.exports = { lanterne, parapluie, valise, avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, ZEDS, paume, tranche, tendre, avecMainsTendues, applaudir, avecApplaudir, pecher, avecPecher, piocher, avecPiocher, cueillir, avecCueillir, arroser, avecArroser, becher, avecBecher, semer, avecSemer, recolter, avecRecolter, scier, avecScier, tailler, avecTailler, porter, avecPorter, reparer, avecReparer, repousser, avecRepousser, ecrire, avecEcrire };
    module.exports.dessins = { applaudir, pecher, piocher, becher, arroser, semer, recolter, scier, tailler, ecrire, tranche, paume, eclat, canne, pioche, eclats, pierre, fruit, panier, arrosoir, pluie, pousse, beche, terre, sacGraines, graines, faucille, touffe, scie, chevalet, secateur, buisson, carnet, crayon };
  }
});

// atelier/dormeurs.js
var require_dormeurs = __commonJS({
  "atelier/dormeurs.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, arm, zee, r2: r22 } = require_troupe2();
    function boulder(x, y, w, h, uid) {
      const d = `M${x},${r22(y + h)} Q${r22(x - w * 0.04)},${r22(y + h * 0.35)} ${r22(x + w * 0.3)},${r22(y + h * 0.08)} Q${r22(x + w * 0.55)},${r22(y - h * 0.06)} ${r22(x + w * 0.8)},${r22(y + h * 0.12)} Q${r22(x + w * 1.04)},${r22(y + h * 0.4)} ${r22(x + w)},${r22(y + h)} Z`;
      return P(d, "#B4AEA2") + clip(`${uid}rk`, d, `<rect x="${r22(x + w * 0.62)}" y="${y - 2}" width="${w}" height="${h + 4}" fill="#958F84"/><ellipse cx="${r22(x + w * 0.32)}" cy="${r22(y + h * 0.22)}" rx="${r22(w * 0.16)}" ry="${r22(h * 0.07)}" fill="#CDC8BE"/><path d="M${r22(x + w * 0.15)},${r22(y + h * 0.55)} q3,-1.4 6,0.4" fill="none" stroke="#958F84" stroke-width="0.6"/>` + E(x + w * 0.8, y + h * 0.3, 1.6, 1, "#9DAE7C", 0)) + P(d, "none");
    }
    __name(boulder, "boulder");
    function cleft(uid) {
      const gap = "M12.6,62 L13.6,30 L16.4,16 L19.8,6.4 L23.4,2.6 L26.6,7.6 L30.4,16.4 L34.6,30 L36,62 Z";
      const left = "M1.4,62 L2.4,38 Q3,28.6 6.4,22.6 L10.6,12.4 L15.4,3.4 Q17.8,1.6 19.4,4.6 L21.4,9.6 L17.4,18.6 L15.8,34 L17.4,62 Z";
      const right = "M31,62 L32.4,44 L31.4,30 L28.4,18.4 Q29.2,11.8 32.6,12.6 L37.4,17.6 Q43.4,23.4 44.8,33.4 L46.6,62 Z";
      const rock = /* @__PURE__ */ __name((d, id, shade) => P(d, "#ABA59A") + clip(id, d, shade + '<path d="M0,40 q4,-1.2 8,0.4 M34,50 q3.4,-1 7,0.4 M4,52 q3,-0.8 6,0.4" fill="none" stroke="#8E897F" stroke-width="0.6"/>' + E(9, 29, 2.2, 1.1, "#9DAE7C", 0)) + P(d, "none"), "rock");
      return P(gap, "#46423C") + clip(`${uid}gp`, gap, '<path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="5" stroke-linecap="round" opacity="0.18"/><path d="M23.4,5 L21.6,12 L25.2,20 L22.6,30 L25.4,40 L24,62" fill="none" stroke="#8FE3E8" stroke-width="0.8" stroke-linecap="round" opacity="0.75"/>') + P(gap, "none") + rock(left, `${uid}cl`, '<rect x="13" y="0" width="12" height="64" fill="#8E897F"/><path d="M6.4,26 L12.6,12 L14.4,13 L8.4,27 Z" fill="#C2BDB2"/>') + rock(right, `${uid}cr`, '<rect x="38" y="10" width="12" height="54" fill="#8E897F"/><path d="M29.6,16 L33,13.8 L34.6,15.4 L31.2,17.6 Z" fill="#C2BDB2"/>');
    }
    __name(cleft, "cleft");
    function crate(x, y, w, h, uid) {
      const d = `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
      return P(d, "#B8875A") + clip(`${uid}cr`, d, `<rect x="${r22(x + w * 0.68)}" y="${y}" width="${w}" height="${h}" fill="#94683F"/>` + [0.33, 0.66].map((k) => `<line x1="${x}" y1="${r22(y + h * k)}" x2="${x + w}" y2="${r22(y + h * k)}" stroke="${OUT}" stroke-width="0.6"/>`).join("") + `<rect x="${x}" y="${y}" width="${w}" height="1.6" fill="#D2A578"/>`) + P(d, "none") + L([x + 1.4, y + 1.4], [x + w - 1.4, y + h - 1.4], OUT, 0.7) + E(x + 2.2, y + h * 0.5, 0.4, 0.4, "#5E5650", 0) + E(x + w - 2.2, y + h * 0.5, 0.4, 0.4, "#5E5650", 0);
    }
    __name(crate, "crate");
    function jar(x, y, rot = 0) {
      const d = `M${r22(x - 1.6)},${r22(y - 1.6)} L${r22(x + 1.6)},${r22(y - 1.6)} Q${r22(x + 2.1)},${r22(y - 1.2)} ${r22(x + 2)},${y} L${r22(x + 1.9)},${r22(y + 1.9)} Q${x},${r22(y + 2.6)} ${r22(x - 1.9)},${r22(y + 1.9)} L${r22(x - 2)},${y} Q${r22(x - 2.1)},${r22(y - 1.2)} ${r22(x - 1.6)},${r22(y - 1.6)} Z`;
      return `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="#D6ECF2" fill-opacity="0.75" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(x - 1.1)},${r22(y - 0.6)} L${r22(x - 1.1)},${r22(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r22(x - 1.3)}" y="${r22(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.7"/></g>`;
    }
    __name(jar, "jar");
    function rod(a, b) {
      const j = [a[0] + (b[0] - a[0]) * 0.72, a[1] + (b[1] - a[1]) * 0.72];
      return limb(a, j, 1.2, "#A8743F") + limb(j, b, 1.1, "#A8743F") + limb(j, [b[0] + 2.6, b[1] + 1.2], 1.1, "#A8743F") + `<g transform="rotate(-30 ${r22(b[0] + 2.6)} ${r22(b[1] + 1.2)})">${E(b[0] + 3.6, b[1] + 1.2, 1.3, 0.65, "#7BB661", 0.6)}</g>`;
    }
    __name(rod, "rod");
    function mallet(a, b) {
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90;
      return limb(a, b, 1.2, "#A8743F") + `<g transform="rotate(${r22(ang)} ${r22(b[0])} ${r22(b[1])})"><rect x="${r22(b[0] - 2.4)}" y="${r22(b[1] - 0.6)}" width="4.8" height="2.8" rx="0.9" fill="#A8743F" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(b[0] + 0.9)}" y="${r22(b[1] - 0.2)}" width="1.1" height="2" rx="0.4" fill="#7E5530"/></g>`;
    }
    __name(mallet, "mallet");
    function spyglass(x, y, rot) {
      return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-1.5" y="-4.5" width="3" height="9" rx="0.8" fill="#C9A24A" stroke="${OUT}" stroke-width="0.9"/><rect x="-1.1" y="-3.9" width="0.8" height="7.8" rx="0.4" fill="#F0D58A"/><rect x="-1.95" y="-4.9" width="3.9" height="2.1" rx="0.6" fill="#8E6E2C" stroke="${OUT}" stroke-width="0.8"/></g>`;
    }
    __name(spyglass, "spyglass");
    var tin = /* @__PURE__ */ __name((x, y) => `<rect x="${r22(x - 4)}" y="${r22(y - 2)}" width="8" height="4" rx="0.8" fill="#B8C0C8" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x - 3.2)}" y="${r22(y - 1.4)}" width="6.4" height="1.6" rx="0.5" fill="#6E7680"/>` + [[-2.2, -0.9], [-0.6, -1], [1, -0.8], [2.4, -1]].map(([dx, dy]) => E(x + dx, y + dy, 0.55, 0.45, "#D9C27A", 0.4)).join(""), "tin");
    var screw = /* @__PURE__ */ __name((x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">${L([x, y], [x + 2.2, y], OUT, 1.3)}${L([x, y], [x + 2.2, y], "#B8C0C8", 0.6)}${E(x, y, 0.75, 0.75, "#D9C27A", 0.5)}</g>`, "screw");
    var snore = /* @__PURE__ */ __name((x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#CFEFFF" fill-opacity="0.7" stroke="${OUT}" stroke-width="0.6"/><path d="M${r22(x - r * 0.5)},${r22(y - r * 0.2)} Q${r22(x - r * 0.4)},${r22(y - r * 0.6)} ${r22(x)},${r22(y - r * 0.65)}" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round"/>`, "snore");
    function soles(c, xs, y, stub = true) {
      let s = "";
      for (const [i, x] of xs.entries()) {
        const bare = !!c.foot && (!c.bareSide || c.bareSide === "right" === (i === 0));
        if (stub && c.leg !== c.skin) s += `<rect x="${r22(x - c.legW / 2)}" y="${r22(y - 6)}" width="${c.legW}" height="4.6" rx="1.4" fill="${c.leg}" stroke="${OUT}" stroke-width="1.1"/>`;
        else if (stub) s += `<rect x="${r22(x - c.legW / 2 + 0.3)}" y="${r22(y - 5.4)}" width="${r22(c.legW - 0.6)}" height="4" rx="1.4" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/>`;
        if (bare) {
          s += E(x, y, 2.5, 3, c.skin) + E(x + 0.5, y + 1.3, 1.5, 1.1, c.skinS || c.skin, 0);
          for (const [dx, dy, r] of [[-1.6, -2.6, 0.62], [-0.5, -3, 0.66], [0.6, -3, 0.62], [1.6, -2.6, 0.55]]) s += E(x + dx, y + dy, r, r, c.skin, 0.55);
        } else {
          s += E(x, y, 2.6, 3.1, c.shoeS) + E(x, y - 0.9, 1.7, 1.4, c.shoe, 0) + L([x - 1.6, y + 1.3], [x + 1.6, y + 1.3], c.shoe, 0.6);
        }
      }
      return s;
    }
    __name(soles, "soles");
    function seated(c, n, o) {
      const id = `${c.uid}dort${n}`;
      const cc = { ...c, uid: id };
      const ctx = { view: "front", pose: "repos", n, ph: 0, id, walk: false, expr: o.expr || "endormi", eyeMode: null, open: false, blink: false };
      const dy = o.dy;
      const sh = c.shoulders.map(([x, y]) => [x, y + dy]);
      let s = o.back ? o.back(cc, sh) : "";
      s += `<g transform="translate(0 ${dy})">${c.backItems && !o.noBackItems ? c.backItems(cc, ctx) : ""}${c.body(cc, ctx)}${c.neck ? c.neck(cc, ctx) : ""}</g>`;
      s += o.legs ? o.legs(cc) : soles(cc, o.feet, o.footY);
      s += o.lap ? o.lap(cc, sh) : "";
      s += o.arms(cc, sh);
      s += c.overArms ? `<g transform="translate(0 ${dy})">${c.overArms(cc, ctx)}</g>` : "";
      const head = c.head(cc, ctx, {}) + (c.overHead ? c.overHead(cc, ctx) : "") + (o.face ? o.face(cc, n) : "");
      s += `<g transform="translate(${o.hx || 0} ${r22(dy + (o.hy || 0))}) rotate(${o.tilt} 24 ${o.pivot || 31})">${head}</g>`;
      s += o.front ? o.front(cc, sh) : "";
      return s;
    }
    __name(seated, "seated");
    var POSES = {
      Ondin: {
        dy: 5.6,
        tilt: 13,
        hy: 0.6,
        feet: [19.4, 28.6],
        footY: 59.4,
        back: /* @__PURE__ */ __name((cc) => boulder(9, 24, 37, 38, cc.uid) + rod([39.6, 61], [43.2, 40.6]), "back"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [21.4, 53.8], [13.2, 50.6]) + arm(cc, r, [26.6, 53.8], [35, 50.6]), "arms"),
        face: /* @__PURE__ */ __name((cc, n) => snore(27.6, 27.6 + 4.4, n ? 2.3 : 1.1), "face"),
        front: /* @__PURE__ */ __name(() => jar(8.6, 60.2, 78), "front")
      },
      Galet: {
        dy: 6.4,
        tilt: -6,
        hy: 1.4,
        feet: [20.4, 27.6],
        footY: 59.6,
        back: /* @__PURE__ */ __name((cc) => cleft(cc.uid), "back"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [21.6, 54.4], [13.4, 51.6]) + mallet([36.6, 56.6], [39.8, 61]) + arm(cc, r, [36.6, 56.4], [36.4, 50.4]), "arms"),
        front: /* @__PURE__ */ __name(() => "", "front")
      },
      Aster: {
        dy: 9,
        tilt: -11,
        hy: 0.4,
        feet: [19.6, 28.4],
        footY: 59.6,
        back: /* @__PURE__ */ __name((cc) => crate(7, 30, 34, 24, cc.uid), "back"),
        lap: /* @__PURE__ */ __name(() => spyglass(24, 53.4, 78), "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [20.2, 53.6], [13.4, 50.4]) + arm(cc, r, [27.8, 53.6], [34.6, 50.4]), "arms")
      },
      Cannelle: {
        dy: 5.2,
        tilt: 10,
        hy: 0.4,
        feet: [19.6, 28.4],
        footY: 60,
        noBackItems: true,
        lap: /* @__PURE__ */ __name((cc) => limb([15.6, 55.6], [32.6, 43.6], 1.5, "#C27C45") + `<g transform="rotate(-30 33.6 42.4)">${E(33.6, 42.4, 3.3, 2.6, "#C27C45")}${E(33.6, 41.9, 2.3, 1.4, "#8F5530", 0)}${E(32.4, 43.3, 0.8, 0.45, "#EAA46C", 0)}</g>`, "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [26.4, 50.6], [12.6, 49.4]) + arm(cc, r, [30.4, 46.2], [36.4, 50.4]), "arms")
      },
      Rivet: {
        dy: 8.6,
        tilt: -14,
        hy: 1.2,
        feet: [19.6, 28.4],
        footY: 59.6,
        lap: /* @__PURE__ */ __name(() => tin(24, 54.2), "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [19.8, 54.4], [13.4, 50.6]) + arm(cc, r, [28.2, 54.4], [34.6, 50.6]), "arms"),
        front: /* @__PURE__ */ __name(() => screw(8.6, 60.4, -20) + screw(37.6, 61.2, 30) + screw(41.4, 59.2, 70), "front")
      },
      Mélisse: {
        dy: 6.2,
        tilt: 6,
        hy: 8.4,
        pivot: 34,
        feet: [19.6, 28.4],
        footY: 60.4,
        lap: /* @__PURE__ */ __name(() => "", "lap"),
        arms: /* @__PURE__ */ __name((cc, [l, r]) => {
          const box = `<rect x="16.4" y="46.4" width="15.2" height="8.4" rx="1" fill="#6E7480" stroke="${OUT}" stroke-width="1"/><rect x="27.2" y="47" width="3.6" height="7.4" fill="#545A65"/><rect x="15.8" y="44.8" width="16.4" height="2.6" rx="0.6" fill="#9AA2AD" stroke="${OUT}" stroke-width="0.9"/>` + [[17.6, 48.6], [30.4, 48.6], [17.6, 53], [30.4, 53]].map(([x, y]) => E(x, y, 0.45, 0.45, "#9AA2AD", 0)).join("") + `<rect x="23" y="47.6" width="2" height="2" rx="0.4" fill="#F2C94C" stroke="${OUT}" stroke-width="0.6"/>`;
          return box + arm(cc, l, [28.4, 45.2], [12.8, 46]) + arm(cc, r, [19.6, 45.4], [35.2, 46.2]);
        }, "arms")
      }
    };
    function stripZ(str, [x, y], n) {
      const zz = n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
      return str.replace(zz, "");
    }
    __name(stripZ, "stripZ");
    function sylveCurled(c, n) {
      const id = `${c.uid}dort${n}`;
      const cc = { ...c, uid: id };
      const ctx = { view: "se", pose: "repos", n, ph: 0, id, walk: false, expr: "endormi", eyeMode: null, open: false, blink: false };
      const leaf = c.nauMound ? [c.nauMound.fill, c.nauMound.shade, c.nauMound.hi] : ["#5E9E4A", "#467A37", "#86C06A"];
      const mound = "M20,46 Q16.6,33.4 29,27.8 Q41,22.6 51.4,29.2 Q60,35 57.6,46 Q55.8,47.6 53.8,46.2 Q52.2,48 50.2,46.4 Q48.4,48 46.4,46.4 Q44.4,48 42.4,46.4 Q40.4,48 38.4,46.4 Q36.4,48 34.4,46.4 Q32.4,48 30.4,46.4 Q28.4,48 26.4,46.4 Q24.2,48 22.2,46.2 Q20.6,47.4 20,46 Z";
      const rows = [33, 38, 43].map((y) => `<path d="M14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y} Q40,${y + 2} 42,${y} Q44,${y + 2} 46,${y} Q48,${y + 2} 50,${y} Q52,${y + 2} 54,${y} Q56,${y + 2} 58,${y} Q60,${y + 2} 62,${y}" fill="none" stroke="${leaf[1]}" stroke-width="0.7"/>`).join("");
      let s = `<ellipse cx="38.6" cy="46.2" rx="20.6" ry="2.2" fill="#0A0418" opacity="0.12"/>`;
      s += P(mound, leaf[0]) + clip(`${id}m`, mound, `<rect x="41" y="20" width="24" height="30" fill="${leaf[1]}"/>${c.nauMound ? "" : rows}<ellipse cx="33" cy="30.8" rx="8" ry="2" fill="${leaf[2]}"/>`) + P(mound, "none");
      if (c.nauMound) {
        s += `<path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"/><path d="M36.2,25.4 Q38.6,36 37.4,46.4" fill="none" stroke="#E6DCC3" stroke-width="2" stroke-linecap="round"/>`;
        for (const [x, y, r] of [[30, 27.4, -60], [44.6, 26.6, 50], [50.4, 30.4, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${r})">${P("M0,0 Q1.4,1.9 0,3.8 Q-1.4,1.9 0,0 Z", c.nauMound.leaf, 0.7)}</g>`;
      }
      for (const [x, y, rot] of [[57.6, 42.6, -20], [59.8, 44.8, -8]]) {
        s += `<g transform="rotate(${rot} ${x} ${y})">${E(x, y, 1.9, 2.4, c.skin)}${E(x + 0.4, y + 1, 1.1, 0.9, c.skinS || c.skin, 0)}` + [[-1.2, -2, 0.5], [-0.3, -2.4, 0.52], [0.6, -2.3, 0.48], [1.3, -1.9, 0.42]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r, c.skin, 0.5)).join("") + "</g>";
      }
      const head = stripZ(c.head(cc, ctx, {}), [3.6, 11.4], n) + (c.overHead ? c.overHead(cc, ctx) : "");
      s += `<g transform="translate(1.8 12.6) rotate(-24 24 31) scale(0.92)">${head}</g>`;
      s += n ? zee(30.6, 9, 2) + zee(33.4, 5.2, 2.6) : zee(30, 10, 1.8) + zee(32.6, 6.6, 2.4);
      return `<g transform="translate(0 -1.2)">${s}</g>`;
    }
    __name(sylveCurled, "sylveCurled");
    function sleepFrame(c, n) {
      const key = c.name;
      if (key === "Sylve") return sylveCurled(c, n);
      return seated(c, n, POSES[key]);
    }
    __name(sleepFrame, "sleepFrame");
    var isCurled = /* @__PURE__ */ __name((c) => c.name === "Sylve", "isCurled");
    module.exports = { sleepFrame, isCurled, POSES, stripZ, boulder, cleft, crate, jar, rod, mallet, spyglass, tin, screw, snore, soles, seated };
  }
});

// personnages/refonte/lorena_poses.js
var require_lorena_poses = __commonJS({
  "personnages/refonte/lorena_poses.js"(exports, module) {
    var { OUT, E, P, L, r2: r22, arm, frame } = require_troupe();
    var { paume } = require_gestes();
    function index(c, [x, y], dx, dy) {
      const f = c.hand || c.skin, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const tip = [x + ux * 3.4, y + uy * 3.4], base = [x + ux * 1.2, y + uy * 1.2];
      return `<path d="M${r22(base[0])},${r22(base[1])} L${r22(tip[0])},${r22(tip[1])}" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/><path d="M${r22(base[0])},${r22(base[1])} L${r22(tip[0])},${r22(tip[1])}" fill="none" stroke="${f}" stroke-width="1.3" stroke-linecap="round"/>` + E(x, y, 2, 2, f) + L([x - uy * 0.9 + ux * 0.4, y + ux * 0.9 + uy * 0.4], [x - uy * 0.2 + ux * 1.1, y + ux * 0.2 + uy * 1.1], OUT, 0.45);
    }
    __name(index, "index");
    function visiereMain(c, [x, y], k, ang) {
      const f = c.hand || c.skin, X = /* @__PURE__ */ __name((v) => r22(x - k * v), "X"), Y = /* @__PURE__ */ __name((v) => r22(y + v), "Y");
      const main = P(`M${X(-0.6)},${Y(-1.7)} Q${X(2.2)},${Y(-2.5)} ${X(4.6)},${Y(-1.7)} Q${X(6.1)},${Y(-1)} ${X(5.6)},${Y(0.3)} Q${X(5)},${Y(1.4)} ${X(2.6)},${Y(1.6)} L${X(0.4)},${Y(1.8)} Q${X(-1.3)},${Y(0)} ${X(-0.6)},${Y(-1.7)} Z`, f, 0.9) + E(x - k * 1.4, y + 1.7, 1.05, 0.8, f, 0.75) + `<path d="M${X(3.4)},${Y(-1.5)} Q${X(4.4)},${Y(-0.5)} ${X(3.6)},${Y(0.6)} M${X(4.6)},${Y(-1.4)} Q${X(5.4)},${Y(-0.5)} ${X(4.8)},${Y(0.5)}" fill="none" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round"/>`;
      return `<g transform="rotate(${r22(k * ang)} ${r22(x)} ${r22(y)})">${main}</g>`;
    }
    __name(visiereMain, "visiereMain");
    function paumeCiel(c, [x, y], k) {
      const f = c.hand || c.skin;
      return P(`M${r22(x - 2.2)},${r22(y - 0.6)} Q${x},${r22(y + 0.4)} ${r22(x + 2.2)},${r22(y - 0.6)} Q${r22(x + 2.1)},${r22(y + 1.9)} ${x},${r22(y + 2)} Q${r22(x - 2.1)},${r22(y + 1.9)} ${r22(x - 2.2)},${r22(y - 0.6)} Z`, f, 0.9) + E(x + k * 2.2, y - 0.4, 0.8, 1, f, 0.75) + L([x - 1.2, y + 0.9], [x + 1.2, y + 0.9], OUT, 0.35);
    }
    __name(paumeCiel, "paumeCiel");
    var eclats = /* @__PURE__ */ __name((x, y, n) => [[-0.75, -0.65], [0, -1], [0.75, -0.65]].map(([a, b]) => {
      const k = n ? 1.12 : 1, p = [x + a * 1.6 * k, y + b * 1.6 * k], q = [x + a * 3.8 * k, y + b * 3.8 * k];
      return L(p, q, OUT, 1.7) + L(p, q, "#FFF6CC", 0.7);
    }).join(""), "eclats");
    function atteint(c, a, dx, dy, k = 0.95) {
      const g = a[0] < 24, h = c.hands[g ? 0 : 1], e = c.shoulders[g ? 0 : 1], L2 = Math.hypot(h[0] - e[0], h[1] - e[1]), d = Math.hypot(dx, dy) || 1;
      return [r22(a[0] + dx / d * L2 * k), r22(a[1] + dy / d * L2 * k)];
    }
    __name(atteint, "atteint");
    var POSES = {
      // les poings sur les hanches, coudes sortis : fière, décidée ; l'image 2, le menton relevé d'un rien (les coudes s'ouvrent)
      poings: {
        nom: "Poings sur les hanches",
        expr: "decidee",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, o = n ? 0.4 : 0;
          if (view === "se") return { left: arm(this, a, [14.6, 42.8], [9.8 - o, 38.2]), right: arm(this, b, [30.4, 42.8], [34.8 + o, 38]) };
          return { left: arm(this, a, [15.2, 42.8], [10.2 - o, 38.4]), right: arm(this, b, [32.8, 42.8], [37.8 + o, 38.4]) };
        }
      },
      // les bras croisés : méfiante, ou elle boude ; l'image 2, les doigts tapotent le bras
      croises: {
        nom: "Bras croisés",
        expr: "mefiante",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, t = n ? 0.5 : 0, d = view === "se" ? -1.6 : 0;
          const hd = atteint(this, b, -9.8 + d, 4.4, 0.97), hg = atteint(this, a, 9.8 + d, 4.6 - t, 0.97);
          const dessous = arm(this, b, hd, [b[0] + 1.4 + d * 0.6, b[1] + 6.8], "");
          const dessus = arm(this, a, hg, [a[0] - 1.4 + d, a[1] + 6.8], E(hg[0], hg[1], 1.9, 1.9, this.hand || this.skin));
          return { left: "", right: dessous, over: dessus };
        }
      },
      // la main en visière, elle scrute le large ; l'autre poing sur la hanche ; l'image 2, la main glisse d'un cran
      visiere: {
        nom: "Main en visière",
        expr: "veille",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, s = n ? 0.5 : 0;
          if (view === "se") {
            const h2 = atteint(this, a, -6.2 + s * 0.4, -10, 0.98);
            return { left: "", right: arm(this, b, [30.4, 42.8], [34.8, 38]), over: arm(this, a, h2, [a[0] - 6.4, a[1] - 3.2], visiereMain(this, h2, -1, 62)) };
          }
          const h = atteint(this, b, 2.6 - s * 0.4, -10, 0.98);
          return { left: arm(this, a, [15.2, 42.8], [10.2, 38.4]), right: "", over: arm(this, b, h, [b[0] + 5.2, b[1] - 4.2], visiereMain(this, h, 1, 38)) };
        }
      },
      // elle montre du doigt, l'ordre lancé : « Là ! » ; l'image 2, le bras se tend un peu plus
      pointe: {
        nom: "Montre du doigt",
        expr: "cri",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, k = n ? 0.8 : 0;
          if (view === "se") {
            const h2 = [8.4 - k, 30.4];
            return { left: arm(this, a, h2, [12.6, 35.2], index(this, h2, -1, -0.35)), right: arm(this, b, [27.6, 42.6], [32.6, 39]) };
          }
          const h = [39.4 + k, 30.2];
          return { left: arm(this, a, [17.6, 42.4], [11.2, 39.4]), right: arm(this, b, h, [35.6, 35.6], index(this, h, 1, -0.4)) };
        }
      },
      // le sursaut : les bras s'écartent, les mains ouvertes, un petit bond ; les traits de surprise au-dessus de la tête
      sursaut: {
        nom: "Sursaut",
        expr: "surprise",
        images: 2,
        bond: [0, -0.9],
        fn({ view, n }) {
          const [a, b] = this.shoulders, u = n ? 1 : 0, d = view === "se" ? -1.2 : 0;
          const l = [9.6 + d, 30.4 - u], r = [38.4 + d, 30.4 - u];
          return {
            left: arm(this, a, l, [11.8 + d, 36.4], paume(this, [l[0], l[1] - 0.4], 1)),
            right: arm(this, b, r, [36.2 + d, 36.4], paume(this, [r[0], r[1] - 0.4], -1)),
            over: eclats(39.4, 9.4, n)
          };
        }
      },
      // les mains sur la tête : la panique, le désespoir ; l'image 2, les mains serrent un peu plus
      tete: {
        nom: "Mains aux tempes",
        expr: "peur",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, s = n ? 0.4 : 0, d = view === "se" ? -1 : 0;
          const l = atteint(this, a, -3.2 + s + d, -9.6, 0.96), r = atteint(this, b, 3.2 - s + d, -9.6, 0.96);
          return {
            left: "",
            right: "",
            over: arm(this, a, l, [a[0] - 6, a[1] - 3], paume(this, l, 1, 1.05)) + arm(this, b, r, [b[0] + 6, b[1] - 3], paume(this, r, -1, 1.05))
          };
        }
      },
      // elle grelotte : les bras serrés croisés devant elle, les mains se frottent ; quatre images, les mains vont et viennent
      frisson: {
        nom: "Grelotte",
        expr: "froid",
        images: 4,
        fn({ view, n }) {
          const [a, b] = this.shoulders, f = [0, 0.6, 0, -0.6][n % 4], d = view === "se" ? -1.4 : 0;
          const hd = atteint(this, b, -9.4 + d, 4.6 + f, 0.95), hg = atteint(this, a, 9.4 + d, 4.4 - f, 0.95);
          const dessous = arm(this, b, hd, [b[0] - 1.2, b[1] + 8.4], E(hd[0], hd[1], 1.9, 1.9, this.hand || this.skin));
          const dessus = arm(this, a, hg, [a[0] + 1.2, a[1] + 8.4], E(hg[0], hg[1], 1.9, 1.9, this.hand || this.skin));
          return { left: "", right: dessous, over: dessus };
        }
      },
      // la joie : les deux bras au ciel, poings fermés, elle saute ; quatre images (prend son élan, saute, en l'air, retombe)
      joie: {
        nom: "Joie",
        expr: "rire",
        images: 4,
        bond: /* @__PURE__ */ __name((n) => [0, [0, -0.6, -1.1, -0.4][n % 4]], "bond"),
        fn({ view, n }) {
          const [a, b] = this.shoulders, u = [0, 1, 1.6, 0.8][n % 4], d = view === "se" ? -1.2 : 0;
          return {
            left: arm(this, a, atteint(this, a, -4.6 + d * 0.5 - u * 0.4, -10, 0.92 + u * 0.05)),
            right: arm(this, b, atteint(this, b, 4.6 + d * 0.5 + u * 0.4, -10, 0.92 + u * 0.05))
          };
        }
      },
      // le haussement d'épaules : les paumes ouvertes vers le ciel, « que veux-tu » ; l'image 2, les mains montent
      hausse: {
        nom: "Haussement d'épaules",
        expr: "ironique",
        images: 2,
        fn({ view, n }) {
          const [a, b] = this.shoulders, u = n ? 0.8 : 0, d = view === "se" ? -1 : 0;
          const l = [10.2 + d, 38.8 - u], r = [37.8 + d, 38.8 - u];
          return {
            left: arm(this, a, l, [13.4 + d, 41.6], paumeCiel(this, l, -1)),
            right: arm(this, b, r, [34.6 + d, 41.6], paumeCiel(this, r, 1))
          };
        }
      }
    };
    function poser(c, nom) {
      const p = POSES[nom];
      if (!p) throw new Error(`pose inconnue : ${nom}`);
      return {
        ...c,
        uid: `${c.uid}${nom.slice(0, 3)}`,
        geste: nom,
        pose(ctx) {
          if (ctx.view === "ne") return { expr: p.expr };
          return { expr: p.expr, ...p.fn.call(this, ctx) };
        }
      };
    }
    __name(poser, "poser");
    function dessinerPose(c, nom, view, n, expr) {
      const p = POSES[nom], s = frame(poser(c, nom), view, "action", n, expr);
      const bond = typeof p.bond === "function" ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
      return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
    }
    __name(dessinerPose, "dessinerPose");
    module.exports = { POSES, poser, dessinerPose, index };
  }
});

// personnages/refonte/lorena_anims.js
var require_lorena_anims = __commonJS({
  "personnages/refonte/lorena_anims.js"(exports, module) {
    var { frame, IMAGES, E, P, L, OUT, r2: r22, arm } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES, dessinerPose } = require_lorena_poses();
    var DIRECTIONS = {
      face: { nom: "De face", vue: "front", miroir: false },
      bas_gauche: { nom: "Vers le bas, à gauche", vue: "se", miroir: false },
      bas_droite: { nom: "Vers le bas, à droite", vue: "se", miroir: true },
      haut_droite: { nom: "Vers le haut, à droite", vue: "ne", miroir: false },
      haut_gauche: { nom: "Vers le haut, à gauche", vue: "ne", miroir: true }
    };
    var MOUVANTES = ["bas_gauche", "bas_droite", "haut_droite", "haut_gauche"];
    var TOUTES = ["face", ...MOUVANTES];
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    function carnet(x, y, lignes) {
      return P(`M${r22(x - 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y)} L${r22(x + 5.4)},${r22(y + 6)} L${r22(x - 5.4)},${r22(y + 6)} Z`, "#3E5A8C", 0.9) + P(`M${r22(x - 4.7)},${r22(y - 0.5)} Q${r22(x - 2.3)},${r22(y - 1.3)} ${r22(x)},${r22(y)} Q${r22(x + 2.3)},${r22(y - 1.3)} ${r22(x + 4.7)},${r22(y - 0.5)} L${r22(x + 4.7)},${r22(y + 5.1)} Q${r22(x + 2.3)},${r22(y + 4.4)} ${r22(x)},${r22(y + 5.4)} Q${r22(x - 2.3)},${r22(y + 4.4)} ${r22(x - 4.7)},${r22(y + 5.1)} Z`, "#FBF4E2", 0.8) + L([x, y], [x, y + 5.4], OUT, 0.55) + L([x + 3.4, y + 5.2], [x + 3.6, y + 7.4], "#D9443A", 0.7) + [1.4, 2.5, 3.6].map((d) => L([x - 3.9, y + d], [x - 1, y + d], "#8A7A6A", 0.4)).join("") + [1.4, 2.5, 3.6].slice(0, lignes).map((d) => `<path d="M${r22(x + 1)},${r22(y + d)} q0.5,-0.4 1,0 t1,0 t1,0" fill="none" stroke="#3E5A8C" stroke-width="0.4"/>`).join("");
    }
    __name(carnet, "carnet");
    function crayon(p, ux, uy) {
      const l = 6, q = [p[0] + ux * l, p[1] + uy * l], t = [p[0] + ux * 1.2, p[1] + uy * 1.2];
      return L(t, q, OUT, 2.2) + L(t, q, "#F2C04B", 1) + L(p, t, OUT, 1.1) + L(p, [p[0] + ux * 0.6, p[1] + uy * 0.6], "#3A3A44", 0.5) + L([q[0] - ux * 0.9, q[1] - uy * 0.9], q, "#F2A0B0", 1);
    }
    __name(crayon, "crayon");
    function ecrireTroisQuarts({ n }) {
      const [a, b] = this.shoulders, y = a[1] + 3.6, x = 22, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1], h = [p[0] + 1.6, p[1] + 2.2];
      const tient = arm(this, a, [x - 4.4, y + 5.8], [a[0] - 2.4, a[1] + 6.4]);
      const ecrit = arm(this, b, h, [b[0] + 1.6, b[1] + 7.4]);
      return { expr: "content", left: tient, right: "", over: carnet(x, y, n ? 2 : 1) + ecrit + crayon(p, 0.55, -0.83) };
    }
    __name(ecrireTroisQuarts, "ecrireTroisQuarts");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: "Elle attend, écoute, regarde autour d'elle.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.1, dirs: MOUVANTES, contexte: "Elle se déplace sur l'île.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.065,
        dirs: MOUVANTES,
        contexte: "L'urgence : la brume avance, un appel, une créature.",
        // la marche, pliée et pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au
        // contact du pied
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "decidee");
          const up = [0, -0.45, -0.7, -0.45, 0, -0.45, -0.7, -0.45][n % 8];
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 5, `<g transform="translate(0 ${up})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.13,
        dirs: MOUVANTES,
        contexte: "Elle arrive, freine, puis se pose.",
        // le dernier pas, le buste en arrière ; les bras qui freinent ; le corps qui se tasse ; le repos
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 5, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "veille")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.22, dirs: ["face"], contexte: "Elle salue le joueur, de loin.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e), "img") },
      dodo: {
        nom: "Dodo, assise",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        contexte: "La nuit, au camp : adossée à une caisse repêchée, la longue-vue sur les genoux.",
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, sansLongueVue: true }, n, D.POSES.Aster), "img")
      },
      dodoCouche: {
        nom: "Dodo, couchée",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, sous la couverture (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#3E5F86", motif: "#C8463A" }), "img")
      },
      longuevue: { nom: "Travail : la longue-vue", images: IMAGES.action, dt: 0.45, dirs: ["bas_gauche", "bas_droite"], contexte: "Au Ponton : elle scrute le large.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "action", n, e), "img") },
      peche: { nom: "Travail : la pêche", images: 2, dt: 0.5, dirs: TOUTES, contexte: "Au Ponton : elle pêche.", img: /* @__PURE__ */ __name((c, v, n, e) => frame({ ...G.avecPecher(c), geste: "pecher" }, v, "action", n, e || "veille"), "img") },
      porter: { nom: "Travail : porter une caisse", images: 2, dt: 0.4, dirs: TOUTES, contexte: "Au camp : elle rapporte ce que la mer a rendu.", img: /* @__PURE__ */ __name((c, v, n, e) => frame({ ...G.avecPorter(c), geste: "porter" }, v, "action", n, e || "decidee"), "img") },
      journal: { nom: "Travail : le journal de bord", images: 2, dt: 0.5, dirs: TOUTES, contexte: "Le soir : elle tient son journal de bord.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(v === "se" ? { ...c, uid: `${c.uid}ec`, geste: "ecrire", pose: ecrireTroisQuarts } : { ...G.avecEcrire(c), geste: "ecrire" }, v, "action", n, e || "concentree"), "img") }
    };
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: ["face", "bas_gauche", "bas_droite"], pose: true, contexte: "Dialogue, réaction (quête, coffre, surprise, froid, victoire).", img: /* @__PURE__ */ __name((c, v, n, e) => dessinerPose(c, k, v, n, e), "img") };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// atelier/aster2.js
var require_aster2 = __commonJS({
  "atelier/aster2.js"(exports, module) {
    module.exports = require_aster();
  }
});

// personnages/cannelle.js
var require_cannelle = __commonJS({
  "personnages/cannelle.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { fondre } = require_couleurs();
    var C = fondre({
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
    });
    function ladle(a, b, tilt = 0) {
      return limb(a, b, 1.5, C.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], C.copperH, 0.5) + `<g transform="rotate(${tilt} ${r22(b[0])} ${r22(b[1])})">${E(b[0], b[1], 3.3, 2.6, C.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, C.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, C.copperH, 0)}</g>`;
    }
    __name(ladle, "ladle");
    var DRESS = /* @__PURE__ */ __name((sway) => `M15.2,33 Q24,30.2 32.8,33 Q${r22(37 + sway)},42 ${r22(37.6 + sway)},53.6 Q${r22(24 + sway)},57.2 ${r22(10.4 + sway)},53.6 Q${r22(11 + sway)},42 15.2,33 Z`, "DRESS");
    var cannelle = {
      name: "Cannelle",
      uid: "ca",
      teintes: [C.hair, C.dress, C.apron, C.copper],
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
        let s = P(d, C.dress) + clip(`${c.uid}d`, d, `<rect x="${view === "se" ? 27.6 : 29.4}" y="30" width="12" height="30" fill="${C.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${C.dressS}"/><rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${C.dressH}"/>`) + P(d, "none");
        if (view === "ne") {
          s += P("M17,40.4 Q24,41.6 31,40.4", "none", 0.8);
          s += P("M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z", C.apron, 0.9) + P("M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z", C.apron, 0.9);
          s += P("M23.4,41.6 L21.6,47.4 L23.4,47 Z", C.apron, 0.8) + P("M24.6,41.6 L26.4,47.4 L24.6,47 Z", C.apron, 0.8) + E(24, 41, 1.3, 1.1, C.apronS, 0.8);
          s += ladle([33, 50.4], [11.6, 26.2], 25);
          return s;
        }
        const k = view === "se" ? -2 : 0;
        const ap = `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2 Q${r22(33.2 + k + sway)},47 ${r22(33 + k + sway)},53.4 Q${r22(24 + k + sway)},55.6 ${r22(15 + k + sway)},53.4 Q${r22(14.8 + k + sway)},47 ${17.6 + k},40.2 Z`;
        s += P(ap, C.apron) + clip(`${c.uid}a`, ap, `<rect x="${28 + k}" y="34" width="8" height="24" fill="${C.apronS}"/>` + E(21 + k, 46.6, 1.3, 0.85, C.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, C.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, C.stain, 0)) + P(ap, "none");
        s += P(`M${17.6 + k},40.2 L${30.4 + k},40.2`, "none", 0.8);
        s += P(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, C.apron, 0.8);
        s += limb([31.4, 33.8], [16.8, 47.2], 1.15, C.strap);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P("M19.8,25 L28.2,25 L28.4,31.95 Q24,31.25 19.6,31.95 Z", C.skinS, 0) + P("M19.6,31.95 Q24,31.25 28.4,31.95", "none");
        return P("M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z", C.apron, 0.9);
      },
      head(c, ctx) {
        const { view } = ctx;
        const spoon = limb([26.6, 9.2], [31.2, 4], 1.1, C.spoon) + `<g transform="rotate(40 32 3.2)">${E(32, 3.2, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.9, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
        const bun = E(24, 8.6, 5.4, 4.3, C.hair) + P("M20.4,8.2 Q24,5.6 27.6,8.2", "none", 0.6);
        let s = "";
        if (view === "ne") {
          const back2 = "M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.8,30 35.8,32.8 Q32.6,34 28.6,32.8 Q27,28.4 24,28.4 Q21,28.4 19.4,32.8 Q15.4,34 12.2,32.8 Q11.2,30 12,22 Z";
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.6" cy="19.8" rx="13.8" ry="12.4" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M16.6,31.6 Q15.8,21.4 20.6,14.4", "none", 0.6) + P("M24,26.4 Q23.4,21 24,15.4", "none", 0.6) + P("M31.4,31.6 Q32.2,21.4 27.4,14.4", "none", 0.6);
          const curl = /* @__PURE__ */ __name((d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.hair}" stroke-width="0.7" stroke-linecap="round"/>`, "curl");
          s += curl("M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31");
          s += L([14.6, 17.6], [16.8, 13.6], C.hairH, 1.2);
          s += limb([26.6, 9.6], [31.2, 3.8], 1.1, C.spoon) + `<g transform="rotate(40 32 3)">${E(32, 3, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.7, 0.5, 0.8, "#F2F4F7", 0)}</g>`;
          s += E(24, 10.4, 5.4, 4.4, C.hair) + P("M20.4,10.4 Q24,7.6 27.6,10.4", "none", 0.6) + L([21, 8.8], [23.6, 7.9], C.hairH, 1.1);
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
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        const cheeks = se ? [[15.6, 2.2], [28.6, 1.8]] : [[16.4, 2.6], [31.6, 2.6]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.8, r * (ctx.expr === "gene" ? 1.25 : 1), ctx.expr === "gene" ? 2 : 1.6, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L(se ? [14.6, 12.6] : [15.8, 12.6], se ? [19.4, 10.6] : [21, 10.6], C.hairH, 1.2);
        const outer = se ? [[14.6, 1]] : [[16.2, -1], [31.8, 1]];
        for (const [x, d] of outer) s += L([x, 23.4], [x + (d < 0 ? -1 : 1) * 1.1, 24.1], C.nose, 0.5);
        const nx = se ? 20.8 : 24;
        s += P(se ? `M${nx + 0.4},24.2 Q${nx - 1.4},25.6 ${nx + 0.6},26` : `M${nx - 0.9},25.5 Q${nx},26.3 ${nx + 0.9},25.5`, "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${C.nose}"`);
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.4], [25.2, 22.8, 1.25]] : [[19.4, 22.8, 1.45], [28.6, 22.8, 1.45]],
          ry: 2.1,
          brow: C.brow,
          browY: -4.4,
          browW: 0.95,
          ...TRAITS.femme,
          mouth: [se ? 21 : 24, 27.8],
          mw: 2.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.7)},${r22(my + 0.3)} Q${mx},${r22(my + 1.4)} ${r22(mx + 1.7)},${r22(my + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 26.8,
          temple: [se ? 12.8 : 13.6, 13.4],
          anger: [38, 11],
          zz: [35.8, 6.2]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [33, 35], lerp([38.6, 26.4], [40, 28.4], k)) };
        }
        const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6];
        const bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
        const elbow = [9.6, 40.6];
        const left = arm(this, [15, 35], [14.8, 44.4], elbow);
        const right = ladle([hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand);
        return { expr: "rire", left, right };
      }
    };
    module.exports = cannelle;
  }
});

// atelier/cannelle.js
var require_cannelle2 = __commonJS({
  "atelier/cannelle.js"(exports, module) {
    module.exports = require_cannelle();
  }
});

// personnages/rivet.js
var require_rivet = __commonJS({
  "personnages/rivet.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { fondre } = require_couleurs();
    var C = fondre({
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
    });
    var pencil = /* @__PURE__ */ __name((a, b) => limb(a, b, 1.4, C.pencil) + E(b[0], b[1], 0.95, 0.95, C.eraser, 0.8), "pencil");
    var glint = /* @__PURE__ */ __name((d, w) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round"/>`, "glint");
    var lens = /* @__PURE__ */ __name((x, y, r) => E(x, y, r, r, C.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, C.glass, 0.6) + glint(`M${r22(x - r * 0.42)},${r22(y - r * 0.1)} Q${r22(x - r * 0.36)},${r22(y - r * 0.4)} ${r22(x - r * 0.08)},${r22(y - r * 0.44)}`, 0.5), "lens");
    function gear(x, y, r, rot) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 + rot * Math.PI / 180;
        const rr = i % 2 ? r * 0.76 : r;
        pts.push(`${r22(x + rr * Math.cos(a))},${r22(y + rr * Math.sin(a))}`);
      }
      return P(`M${pts.join(" L")} Z`, C.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, C.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, OUT, 0);
    }
    __name(gear, "gear");
    var screwdriver = /* @__PURE__ */ __name((a, b) => limb([a[0] + (b[0] - a[0]) * 0.35, a[1] + (b[1] - a[1]) * 0.35], b, 0.6, C.steel) + limb(a, [a[0] + (b[0] - a[0]) * 0.4, a[1] + (b[1] - a[1]) * 0.4], 1.6, C.red), "screwdriver");
    var TORSO = "M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z";
    var APRON = /* @__PURE__ */ __name((k) => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${32.2 + k},52 Q${24 + k},53.8 ${15.8 + k},52 L${17.4 + k},40 Z`, "APRON");
    var rivet = {
      name: "Rivet",
      uid: "ri",
      teintes: [C.hair, C.shirt, C.leather, C.grey],
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
        let s = P(TORSO, C.shirt) + clip(`${c.uid}t`, TORSO, `<rect x="${view === "se" ? 26.4 : 27.6}" y="30" width="10" height="20" fill="${C.shirtS}"/>`) + P(TORSO, "none");
        if (view === "ne") {
          s += limb([18.2, 32.8], [29, 41.2], 1.5, C.leather) + limb([29.8, 32.8], [19, 41.2], 1.5, C.leather);
          s += P("M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z", C.leather, 0.8) + P("M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z", C.leather, 0.8) + limb([23.6, 41.8], [22.4, 45.4], 0.9, C.leather) + limb([24.4, 41.8], [25.8, 45.2], 0.9, C.leather) + E(24, 41.4, 1, 0.9, C.leatherS, 0.8);
          return s;
        }
        const k = view === "se" ? -1.8 : 0;
        const ap = APRON(k);
        s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], C.leatherS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], C.leatherS, 1.2);
        s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, C.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, C.red);
        s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${C.wood}" stroke="${OUT}" stroke-width="0.6"/>`;
        s += P(ap, C.leather) + clip(`${c.uid}a`, ap, `<rect x="${27.6 + k}" y="34" width="8" height="22" fill="${C.leatherS}"/><rect x="${18.4 + k}" y="35.8" width="1" height="15" rx="0.5" fill="${C.leatherH}"/>`) + P(ap, "none");
        s += `<rect x="${19.2 + k}" y="43.2" width="9.6" height="5.6" rx="0.8" fill="${C.leatherS}" stroke="${OUT}" stroke-width="0.8"/><path d="M${20 + k},44.2 L${28 + k},44.2" stroke="${C.leatherH}" stroke-width="0.5" stroke-dasharray="0.8 0.6"/>` + L([24 + k, 43.4], [24 + k, 48.6], OUT, 0.5);
        s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${C.leatherS}" stroke="${OUT}" stroke-width="0.7"/>` + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, C.pencil);
        for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += E(x + k, y, 0.45, 0.45, C.brass, 0.4);
        s += L([17.4 + k, 40.6], [30.6 + k, 40.6], C.leatherS, 0.8);
        return s;
      },
      neck(c, { view }) {
        if (view === "ne") return P("M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z", C.skinS, 0) + P("M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z", C.collar, 0.8);
        const k = view === "se" ? -1.6 : 0;
        return P(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, C.collar, 0.8) + P(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, C.collar, 0.8);
      },
      head(c, ctx, act) {
        const { view } = ctx;
        const cowlick = P("M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z", C.grey, 0.9) + L([23.4, 7], [24.2, 4.2], C.greyS, 0.5);
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z";
          s += cowlick + E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="4" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M17.6,15 Q16.8,21 18.4,28.6", "none", 0.6) + P("M24.6,15 Q25.4,21 24.2,28.4", "none", 0.6) + P("M31,16.4 Q32,22 30.6,29.2", "none", 0.6) + L([16.6, 10.2], [21.6, 8.6], C.hairH, 1.2);
          s += P("M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z", C.strap, 0.8) + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${C.brass}" stroke="${OUT}" stroke-width="0.6"/>`;
          s += c.coiffe ? c.coiffe(c, ctx, "cheveux") + c.coiffe(c, ctx, "tete") : pencil([15.4, 20.6], [9.2, 19.2]);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z" : "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z");
        const grey = sx("M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z");
        s += cowlick + P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        s += se ? E(35, 23.2, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([33.4, 20.8], [39.2, 19.2])) : E(11.8, 22.8, 1.5, 2.1, C.skin) + E(36.2, 22.8, 1.5, 2.1, C.skin) + (c.coiffe ? "" : pencil([14, 20.8], [7.8, 19.4]) + pencil([34, 20.8], [40.2, 19.4]));
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.5 : 1.05, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + P(grey, C.grey, 0.8) + L([15 + k, 12.6], [20 + k, 11], C.hairH, 1.2) + L([26.4 + k, 12.2], [29.4 + k, 12.6], "#F2EFEA", 0.9);
        if (c.coiffe) s += c.coiffe(c, ctx, "cheveux");
        s += P(se ? "M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z" : "M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z", C.strap, 0.8);
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
          ...TRAITS.homme,
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.8,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : absorbé, un demi-sourire (il pense déjà à autre chose)
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.6)} L${r22(mx + 0.7)},${r22(my + 0.6)} Q${r22(mx + 1.3)},${r22(my + 0.6)} ${r22(mx + 1.6)},${r22(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.2,
          temple: [se ? 13 : 13.6, 20.4],
          anger: [40.6, 7.4],
          zz: [37, 8.4]
        }, ctx);
        return s;
      },
      pose({ pose, n, k, view }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
        }
        const [x, y] = [view === "se" ? 25.2 : 28.6, 22.8];
        const eye = n === 0 ? E(x, y, 2.3, 3, "#2A2420", 0) + E(x + 0.8, y - 1.3, 0.9, 0.9, "#FFFFFF", 0) + E(x - 0.7, y + 1.3, 0.45, 0.45, "#FFFFFF", 0) : P(`M${x - 2.6},${y + 1.2} Q${x},${y - 2} ${x + 2.6},${y + 1.2}`, "none", 1.4);
        const loupe = L([31.4, 13.6], [31, 19.4], C.brassS, 0.9) + E(x, y, 3.6, 3.6, C.brass, 0.9) + E(x, y, 2.9, 2.9, C.skin, 0) + eye + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${C.glass}" fill-opacity="0.35"/>` + glint(`M${r22(x - 1.8)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y - 1.8)} ${r22(x - 0.4)},${r22(y - 2.1)}`, 0.6) + E(x, y, 2.9, 2.9, "none", 0.8);
        const g = gear(36.2, 25, 2.8, n ? 22.5 : 0) + (n ? L([39.8, 21], [41.2, 19.6], OUT, 0.6) + L([40.6, 24.2], [42.4, 23.8], OUT, 0.6) + L([37.8, 20.6], [38.2, 18.8], OUT, 0.6) : "");
        const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
        const left = arm(this, [16, 34], [14.4, 45]) + screwdriver([14.4, 44.2], [12.8, 50.2]);
        if (view === "ne") return { expr: n ? "rire" : "neutre", left, right: "", over: g + right };
        return { expr: n ? "rire" : "neutre", lensDown: true, left, right: "", over: loupe + g + right };
      }
    };
    module.exports = rivet;
  }
});

// atelier/rivet.js
var require_rivet2 = __commonJS({
  "atelier/rivet.js"(exports, module) {
    module.exports = require_rivet();
  }
});

// personnages/ondin.js
var require_ondin = __commonJS({
  "personnages/ondin.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, bareFoot, r2: r22, lerp, TRAITS } = require_troupe();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var { fondre } = require_couleurs();
    var relevee = /* @__PURE__ */ __name((c) => !!(c.coiffe && c.coiffe.capuche), "relevee");
    var C = fondre({
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
    });
    var HY = 4.4;
    var cord = /* @__PURE__ */ __name((d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, "cord");
    var drop = /* @__PURE__ */ __name((x, y, r) => P(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, C.water, 0.6), "drop");
    function rod(h, side = 1) {
      const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.6, h[1] + 9];
      return limb(h, j, 1.1, C.wood) + limb(j, b, 1.1, C.wood) + limb(j, tip, 1.2, C.wood) + `<g transform="rotate(${side * -35} ${r22(b[0])} ${r22(b[1])})">${E(b[0] + side * 1.1, b[1], 1.3, 0.65, C.leaf, 0.6)}</g>`;
    }
    __name(rod, "rod");
    function jar(x, y) {
      const d = `M${r22(x - 1.6)},${r22(y - 1.6)} L${r22(x + 1.6)},${r22(y - 1.6)} Q${r22(x + 2.1)},${r22(y - 1.2)} ${r22(x + 2)},${y} L${r22(x + 1.9)},${r22(y + 1.9)} Q${x},${r22(y + 2.6)} ${r22(x - 1.9)},${r22(y + 1.9)} L${r22(x - 2)},${y} Q${r22(x - 2.1)},${r22(y - 1.2)} ${r22(x - 1.6)},${r22(y - 1.6)} Z`;
      return `<path d="${d}" fill="${C.glass}" fill-opacity="0.65" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(x - 1.1)},${r22(y - 0.6)} L${r22(x - 1.1)},${r22(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r22(x - 1.3)}" y="${r22(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${C.cork}" stroke="${OUT}" stroke-width="0.7"/>`;
    }
    __name(jar, "jar");
    var COAT = "M15.8,37.4 Q24,35 32.2,37.4 L35,52.4 Q24,55 13,52.4 Z";
    var CAP = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z";
    var CAP_DOS = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.8,14.6 Q24,18 11.2,14.6 Q11.4,14.1 12,13.8 Z";
    function cap(uid, d = CAP) {
      const stripes = [20, 28, 36, 44].map((x) => `<path d="M${x},0 L${x + 2.6},0 L${x - 5.4},22 L${x - 8},22 Z" fill="${C.cream}"/>`).join("");
      return P(d, C.cap) + clip(`${uid}k`, d, `<rect x="8" y="0" width="38" height="22" fill="${C.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${C.cap}"/>${stripes}`) + P(d, "none") + E(41.6, 24.4, 2.2, 2.2, C.cream) + E(42.2, 25.2, 0.8, 0.7, "#DCCDB5", 0);
    }
    __name(cap, "cap");
    var ondin = {
      name: "Ondin",
      uid: "on",
      teintes: [C.hair, C.coat, C.cap, C.lining],
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
        let s = P(COAT, C.coat) + clip(`${c.uid}c`, COAT, `<rect x="${se ? 26.2 : 27.8}" y="34" width="10" height="22" fill="${C.coatS}"/><path d="M12,52 Q24,54.8 36,52 L36,57 L12,57 Z" fill="${C.coatS}"/><rect x="14.6" y="39" width="1.3" height="11" rx="0.65" fill="${C.coatH}"/>`) + P(COAT, "none");
        if (view === "ne") {
          s += P(`M24,${relevee(c) ? 38 : 42.4} L24,53.8`, "none", 0.7);
          if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
          return s + cord("M13.9,46.4 Q24,48.6 34.1,46.4", 1.1, C.rope);
        }
        const k = se ? -1.6 : 0;
        s += P(`M${17 + k},37.2 Q${21 + k},37.4 ${24 + k},40.2 L${20.6 + k},42 Z`, C.coatS, 0.8) + P(`M${31 + k},37.2 Q${27 + k},37.4 ${24 + k},40.2 L${27.4 + k},42 Z`, C.coatS, 0.8);
        s += P(`M${24 + k},40 L${24 + k + (se ? -0.6 : 0)},53.8`, "none", 0.9);
        for (const y of [42.6, 50.4]) s += `<rect x="${r22(24.5 + k)}" y="${y - 0.5}" width="2.4" height="1" rx="0.5" fill="${C.wood}" stroke="${OUT}" stroke-width="0.5"/>`;
        s += cord("M13.9,45.6 Q24,47.6 34.1,45.6", 1.1, C.rope);
        s += cord(`M${20.2 + k},47 L${19.4 + k},49.6`, 0.8, C.rope) + cord(`M${20.8 + k},47 L${21.4 + k},49.4`, 0.8, C.rope) + E(20.5 + k, 46.9, 1.1, 0.9, C.rope, 0.7);
        s += L([27.6 + k, 47.1], [27.6 + k, 48.4], OUT, 0.6) + jar(27.6 + k, 50.6);
        return s;
      },
      // de dos : la nuque (dans l'ombre) entre les boucles, rentrée sous le col du ciré
      neck(c, { view }) {
        if (view !== "ne") return "";
        return P("M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z", C.skinS, 0) + P("M19.6,36.55 Q24,35.85 28.4,36.55", "none");
      },
      head(c, ctx) {
        const { view } = ctx;
        let s = "";
        if (view === "ne") {
          const back2 = "M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 L35.6,33.2 L34,32 L33,34 L31.4,32.4 L30,34 L28.6,32.4 L27.2,33.8 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.8 L19.4,32.4 L18,34 L16.6,32.4 L15,34 L14,32 L12.4,33.2 L12,31 Q10.6,28 11,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          if (!relevee(c)) {
            s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${C.hair}"/>`) + P(back2, "none");
            s += P("M18.4,19 Q17.8,25.4 19.2,31.4", "none", 0.6) + P("M28.8,19 Q29.8,25.4 28.6,31.4", "none", 0.6);
          }
          if (c.coiffe) s += c.coiffe(c, ctx, "tete");
          else s += `<g transform="translate(48 0) scale(-1 1)">${cap(c.uid, CAP_DOS)}</g>` + P("M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z", C.cream, 0.9);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const back = se ? "M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.6,26.4 35.6,27.2 L14,27.2 Q12.2,26.4 12,21.6 Z" : "M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q36.8,25.4 35,26.6 L13,26.6 Q11.2,25.4 11.4,21 Z";
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.4,15.8 31.6,15.8 Q30,18 27.6,17.6 Q26.4,15.4 24,15.6 Q21.6,15.4 20.4,17.6 Q18,18 16.4,15.8 Q13.6,15.8 12,19.4 Z");
        if (!c.coiffe) s += (se ? "" : P("M11.8,17.4 Q8.4,18 8.8,21.2 Q10.2,19.6 11.8,19.8 Z", C.hair)) + P(sx("M36.2,17.4 Q39.6,18 39.2,21.2 Q37.8,19.6 36.2,19.8 Z"), C.hair);
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15, 2], [28.2, 1.6]] : [[16.4, 2.2], [31.6, 2.2]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 26.6, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.6 : 1.2, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L([16.4 + k, 14.6], [21.2 + k, 13.9], C.hairH, 1);
        s += c.coiffe ? c.coiffe(c, ctx, "tete") : `<g transform="translate(${k} 0)">${cap(c.uid)}${P("M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z", C.cream, 0.9)}</g>`;
        s += expression({
          // (les yeux un peu plus bas, choix de l'auteur, 12 oct. : ils étaient trop hauts sous le bonnet)
          eyes: se ? [[17.2, 23.3, 1.65], [25.2, 23.3, 1.45]] : [[19.4, 23.3, 1.7], [28.6, 23.3, 1.7]],
          ry: 2.5,
          brow: C.brow,
          browY: -4.3,
          browW: 1,
          ...TRAITS.garcon,
          // au repos : les yeux mi-clos (la brume le tient encore), une toute petite bouche
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 0.9)},${r22(my + 0.4)} Q${mx},${r22(my + 1.1)} ${r22(mx + 0.9)},${r22(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 26.6,
          temple: [se ? 13.4 : 12.4, 23.2],
          anger: [8.4, 8.6],
          zz: [6.6, 6.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, left: rod(this.hands[0], -1) + arm(this, this.shoulders[0], this.hands[0]), right: arm(this, [31.6, 38.8], lerp([36.6, 30.6], [38, 32.6], k)) };
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
    module.exports = ondin;
  }
});

// atelier/ondin.js
var require_ondin2 = __commonJS({
  "atelier/ondin.js"(exports, module) {
    module.exports = require_ondin();
  }
});

// personnages/sylve.js
var require_sylve = __commonJS({
  "personnages/sylve.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, bareFoot, r2: r22, lerp, TRAITS, dechirure, filPendant } = require_troupe();
    var { fondre } = require_couleurs();
    var C = fondre({
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
    });
    var leaf = /* @__PURE__ */ __name((x, y, len, w, rot, fill = C.leaf) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">` + P(`M0,0 Q${w},${r22(len / 2)} 0,${len} Q${-w},${r22(len / 2)} 0,0 Z`, fill, 0.7) + L([0, 0.6], [0, len - 0.8], C.leafS, 0.4) + "</g>", "leaf");
    var vine = /* @__PURE__ */ __name((d, w = 1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.vine}" stroke-width="${w}" stroke-linecap="round"/>`, "vine");
    var twig = /* @__PURE__ */ __name((a, b, f) => L(a, b, OUT, 1.6) + L(f[0], f[1], OUT, 1.3) + L(a, b, C.twig, 0.8) + L(f[0], f[1], C.twig, 0.6), "twig");
    var feather = /* @__PURE__ */ __name((x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">` + P("M0,0 Q1.8,-5.2 7,-8.2 Q5.8,-3 0.8,0.6 Z", C.feather, 0.8) + L([2.4, -3.4], [3.8, -2.2], C.featherS, 0.6) + L([3.8, -5.2], [5, -4], C.featherS, 0.6) + P("M5.6,-7.2 Q6.6,-7.8 7,-8.2 Q6.8,-7 6.2,-6.2 Z", "#FFFFFF", 0) + "</g>", "feather");
    var note = /* @__PURE__ */ __name((x, y) => `<g transform="rotate(-12 ${x} ${y})">${E(x, y, 1.1, 0.8, OUT, 0)}${L([x + 0.95, y], [x + 0.95, y - 3.6], OUT, 0.6)}<path d="M${r22(x + 0.95)},${r22(y - 3.6)} Q${r22(x + 2.6)},${r22(y - 3)} ${r22(x + 2.2)},${r22(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>`, "note");
    var CAPE = "M14.4,33 Q24,30.6 33.6,33 L37.6,52.4 Q36.2,54.4 34.6,52.8 Q33.2,55 31.4,53.2 Q29.8,55.2 28,53.4 Q26,55.4 24,53.6 Q22,55.4 20,53.4 Q18.2,55.2 16.6,53.2 Q14.8,55 13.4,52.8 Q11.8,54.4 10.4,52.4 Z";
    var TUNIC_DECHIRE = dechirure([33.4, 48.6], [24, 51.4], [14.6, 49.2], 4);
    var TUNIC = `M16.2,32.6 Q24,30 31.8,32.6 L33.4,48.6 ${TUNIC_DECHIRE.d} Z`;
    function cape(uid, over) {
      const rows = over ? [38.4, 43.4, 48.4].map((y) => `<path d="M10,${y} Q12,${y + 2} 14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y}" fill="none" stroke="${C.leafS}" stroke-width="0.7"/>`).join("") : "";
      return P(CAPE, C.leaf) + clip(`${uid}cp`, CAPE, `<rect x="27" y="30" width="14" height="28" fill="${C.leafS}"/>${rows}<rect x="13.6" y="35" width="1.2" height="15" rx="0.6" fill="${C.leafH}"/>`) + P(CAPE, "none");
    }
    __name(cape, "cape");
    var sylve = {
      name: "Sylve",
      uid: "sy",
      teintes: [C.hair, C.tunic, C.leaf, C.feather],
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
        let s = P(TUNIC, C.tunic) + clip(`${c.uid}t`, TUNIC, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="9" height="22" fill="${C.tunicS}"/>`) + P(TUNIC, "none") + TUNIC_DECHIRE.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
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
          s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="36" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.6" rx="13.4" ry="12.4" fill="${C.hair}"/>`) + P(back, "none");
          s += P("M17,12 Q15.6,22 17.6,32", "none", 0.6) + P("M24.4,11.4 Q25.4,22 23.6,33.6", "none", 0.6) + P("M30.6,12.4 Q32,22 30.4,32", "none", 0.6);
          s += L([16.8, 10], [22, 8.4], C.hairH, 1.2) + L([27, 16], [29.4, 15.4], C.twig, 0.8) + feather(13.4, 14.6, -1);
          return s;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const bangs = sx("M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z");
        s += twig([12.6, 14.2], [8.2, 12.6], [[10.2, 13.2], [9.2, 15]]) + twig([36.2, 21.2], [40.2, 22.6], [[38.4, 21.8], [39.6, 20.2]]);
        s += P(long, C.hair) + clip(`${c.uid}h`, long, `<rect x="8" y="24" width="32" height="12" fill="${C.hairS}"/>`) + P(long, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        const paint = cheeks.map(([x, r]) => [-0.6, 0.6].map((dy) => L([x - r * 0.9, 25.6 + dy * 1.6], [x + r * 0.9, 25.2 + dy * 1.6], C.paint, 0.75)).join("")).join("");
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>` + cheeks.map(([x, r]) => E(x, 27.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + paint);
        s += P(face, "none");
        s += P(sx("M12.6,16.4 Q11.2,24 13.4,30 Q14,24 14.8,18.6 Z"), C.hair, 0.8) + P(sx("M35.4,16.4 Q36.8,24 34.6,30 Q34,24 33.2,18.6 Z"), C.hair, 0.8);
        s += P(bangs, C.hair) + L([15.6 + k, 11.2], [21.6 + k, 9.6], C.hairH, 1.2) + feather(34.4 + k, 14.6);
        s += expression({
          eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]],
          ry: 2.4,
          brow: C.brow,
          browY: -4.1,
          browW: 1.15,
          ...TRAITS.femme,
          mouth: [se ? 20.8 : 24, 27.6],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          // au repos : sur ses gardes, la bouche serrée de travers
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.1)},${r22(my + 0.7)} L${r22(mx + 1.1)},${r22(my + 0.4)}`, "neutral"),
          cheeks,
          cheekY: 27.4,
          temple: [se ? 11.6 : 10.8, 22.4],
          anger: [8.4, 12.6],
          zz: [3.6, 11.4]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [31.8, 34], lerp([37.2, 25.4], [38.6, 27.4], k)) };
        }
        const left = arm(this, [16.2, 34], [22.2, 43.4], [12.6, 40.6]);
        const right = arm(this, [31.8, 34], [25.8, 43.4], [35.4, 40.6]);
        const seedOrSprout = n === 0 ? E(24, 41.4, 1.1, 0.8, C.seed, 0.7) + note(36.4, 25.4) + note(39.6, 19.6) : L([24, 42], [24, 36.4], OUT, 1.8) + L([24, 42], [24, 36.4], C.vine, 0.9) + leaf(24, 37, 3.8, 1.5, 125) + leaf(24, 37, 3.8, 1.5, -125) + note(36.8, 22.4) + note(10.4, 24.6) + note(40.2, 16.8);
        return n === 0 ? { expr: "content", eyeMode: "blink", open: true, left, right, over: seedOrSprout } : { expr: "rire", left, right, over: seedOrSprout };
      }
    };
    module.exports = sylve;
  }
});

// atelier/sylve.js
var require_sylve2 = __commonJS({
  "atelier/sylve.js"(exports, module) {
    module.exports = require_sylve();
  }
});

// personnages/galet.js
var require_galet = __commonJS({
  "personnages/galet.js"(exports, module) {
    var { OUT, P, E, L, limb, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { fondre } = require_couleurs();
    var C = fondre({
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
    });
    var HY = 4.4;
    function mallet(h, rot) {
      return `<g transform="rotate(${rot} ${r22(h[0])} ${r22(h[1])})">` + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, C.wood) + `<rect x="${r22(h[0] - 2.4)}" y="${r22(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${C.wood}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(h[0] + 0.9)}" y="${r22(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${C.woodS}"/></g>`;
    }
    __name(mallet, "mallet");
    var chisel = /* @__PURE__ */ __name((a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, C.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, C.steel), "chisel");
    var SMOCK = "M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z";
    var BEARD = "M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z";
    var galet = {
      name: "Galet",
      uid: "ga",
      teintes: [C.wool, C.beard, C.smock, C.white],
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
        let s = P(SMOCK, C.smock) + clip(`${c.uid}s`, SMOCK, `<rect x="${view === "se" ? 26.2 : 27.8}" y="34" width="9" height="20" fill="${C.smockS}"/>`) + P(SMOCK, "none");
        s += P("M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z", C.belt, 0.8);
        if (view === "ne") return s + P("M24,38 L24,52", "none", 0.6);
        const k = view === "se" ? -1.6 : 0;
        s += `<rect x="${r22(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${C.brass}" stroke="${OUT}" stroke-width="0.6"/>`;
        return s + chisel([30.2 + k, 44.6], [31, 51.4]);
      },
      head(c, ctx) {
        const { view } = ctx;
        const beanie = "M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z";
        const hole = /* @__PURE__ */ __name((x, y) => E(x, y, 1.1, 0.85, "#5E2A15", 0.6) + P(`M${r22(x - 0.6)},${r22(y + 0.3)} Q${x},${r22(y - 1.6)} ${r22(x + 0.7)},${r22(y + 0.2)}`, C.white, 0.5), "hole");
        const woolCap = /* @__PURE__ */ __name((k2 = 0) => `<g transform="translate(${k2} 0)">` + P("M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z", C.wool, 0.8) + P(beanie, C.wool) + clip(`${ctx.id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${C.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${C.wool}"/>`) + P(beanie, "none") + hole(18.4, 9.8) + hole(29.6, 11.6) + P("M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z", C.wool, 0.9) + [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${x},${r22(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r22(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${C.woolS}" stroke-width="0.5"/>`).join("") + L([13, 15.4], [17.8, 14.4], C.woolH, 0.8) + "</g>", "woolCap");
        let s = "";
        if (view === "ne") {
          const back = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z";
          s += E(12.4, 23, 1.7, 2.3, C.skin) + E(35.6, 23, 1.7, 2.3, C.skin);
          const tuft = /* @__PURE__ */ __name((m) => {
            const d = "M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z";
            const g = /* @__PURE__ */ __name((inner) => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`, "g");
            return g(P(d, C.beard) + clip(`${ctx.id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${C.beardS}"/><path d="M8,34.6 Q14,36.4 22,34 L22,40 L8,40 Z" fill="${C.beardS}"/>`) + P(d, "none") + P("M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35", "none", 0.5) + L([12.8, 31], [13.2, 33.2], C.beardH, 0.7));
          }, "tuft");
          s += tuft(1) + tuft(-1);
          s += P(back, C.skin) + clip(`${c.uid}h`, back, `<rect x="27" y="8" width="12" height="22" fill="${C.skinS}"/><path d="M8,24.4 Q24,28.2 40,24.4 L40,34 L8,34 Z" fill="${C.white}"/><path d="M8,28.6 Q24,31.8 40,28.6 L40,34 L8,34 Z" fill="${C.whiteS}"/>`) + P(back, "none");
          s += P("M11.2,24.8 Q24,28.6 36.8,24.8", "none", 0.6) + P("M16,27.4 Q16.6,29 18.2,29.6", "none", 0.5) + P("M30.4,27.4 Q30,29 28.6,29.6", "none", 0.5);
          s += P("M24.6,5.2 Q25.2,2.4 22.8,1.8 Q23,3.6 21.8,5 Z", C.wool, 0.8) + P("M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", C.wool) + P("M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z", C.wool, 0.9) + E(26.6, 9.6, 1.1, 0.85, "#5E2A15", 0.6) + P("M26,9.9 Q26.6,8 27.3,9.8", C.white, 0.5);
          return `<g transform="translate(0 ${HY})">${s}</g>`;
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        s += se ? E(35, 23.2, 1.7, 2.3, C.skin) : E(11.8, 22.8, 1.7, 2.3, C.skin) + E(36.2, 22.8, 1.7, 2.3, C.skin);
        s += P(sx("M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z"), C.white, 0.8) + P(sx("M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z"), C.white, 0.8);
        const cheeks = se ? [[15.2, 1.6], [28.2, 1.3]] : [[16.6, 1.7], [31.4, 1.7]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${C.skinS}"/>` + cheeks.map(([x, r]) => E(x, 25.2, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.9, C.cheek, 0)).join("") + L([15.6 + k, 19.4], [17.6 + k, 19.8], C.skinS, 0.5) + L([30.4 + k, 19.8], [32.4 + k, 19.4], C.skinS, 0.5));
        s += P(face, "none");
        s += woolCap(k);
        const beard = sx(BEARD);
        s += P(beard, C.beard) + clip(`${c.uid}b`, beard, `<rect x="${se ? 26 : 27.6}" y="24" width="10" height="26" fill="${C.beardS}"/>` + [18.6, 21.6, 24.6, 27.4].map((x) => `<path d="M${r22(x + k)},31 Q${r22(x + k - 0.6)},36 ${r22(x + k + 0.4)},41" fill="none" stroke="${C.beardS}" stroke-width="0.5"/>`).join("") + `<rect x="${r22(16.6 + k)}" y="29" width="1.1" height="7" rx="0.5" fill="${C.beardH}"/>`) + P(beard, "none");
        const mx = se ? 20.8 : 24;
        s += P(`M${r22(mx - 4.2)},27.2 Q${r22(mx - 2.4)},25 ${mx},26.2 Q${r22(mx + 2.4)},25 ${r22(mx + 4.2)},27.2 Q${r22(mx + 2.2)},28.4 ${mx},27.4 Q${r22(mx - 2.2)},28.4 ${r22(mx - 4.2)},27.2 Z`, C.beardH, 0.8);
        s += E(se ? 20.4 : 24, 24.6, 1.5, 1.3, C.nose, 0.8) + E(se ? 19.9 : 23.5, 24.2, 0.45, 0.35, "#FFFFFF", 0);
        s += expression({
          // (les yeux un peu plus bas, au milieu du visage, choix de l'auteur, 12 oct. : ils étaient trop hauts sous le bonnet)
          eyes: se ? [[17.2, 22.3, 1.4], [25.2, 22.3, 1.2]] : [[19.4, 22.3, 1.45], [28.6, 22.3, 1.45]],
          ry: 2.1,
          brow: C.white,
          browY: -3.4,
          browW: 1.9,
          ...TRAITS.homme,
          // au repos : les yeux mi-clos sous les sourcils broussailleux, la bouche cachée sous la moustache (« Hm. »)
          restEyes: "sleepy",
          mouth: [mx, 28.2],
          mw: 1.5,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((x, y) => `M${r22(x - 0.8)},${r22(y + 0.3)} L${r22(x + 0.8)},${r22(y + 0.3)}`, "neutral"),
          cheeks,
          cheekY: 25.2,
          temple: [se ? 9.6 : 8.8, 18.6],
          anger: [39.4, 6.6],
          zz: [37.4, 3.4]
        }, ctx);
        return `<g transform="translate(0 ${HY})">${s}</g>`;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          const h = lerp([36.4, 30.8], [37.6, 32.4], k);
          return { open: true, right: mallet(h, 180) + arm(this, [31.6, 38.8], h) };
        }
        const block = P("M3.6,47.8 L13.4,47.8 L13.4,57.4 L3.6,57.4 Z", C.stone) + P("M3.6,47.8 L5.4,45.8 L15.2,45.8 L13.4,47.8 Z", "#C2BDB2", 0.9) + P("M13.4,47.8 L15.2,45.8 L15.2,55.4 L13.4,57.4 Z", C.stoneS, 0.9);
        const rune = n ? `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>` : "";
        const runeLine = `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${n ? "#E9FFFF" : OUT}" stroke-width="${n ? 0.9 : 0.6}" stroke-linecap="round"/>`;
        const left = chisel([14.4, 46.8], [11.4, 49.8]) + arm(this, [16.4, 38.8], [14.6, 46.6], [12.2, 42.4]);
        const sparks = n ? [[10.6, 43.4, 9.2, 41.6], [13.2, 42.6, 13.6, 40.4], [8.6, 45.8, 6.6, 45]].map(([a, b, x, y]) => L([a, b], [x, y], "#F2C94C", 0.8)).join("") + `<g transform="rotate(-12 6.4 41.4)">${E(6.4, 41.4, 1.1, 0.8, OUT, 0)}${L([7.35, 41.4], [7.35, 37.8], OUT, 0.6)}<path d="M7.35,37.8 Q9,38.4 8.6,39.8" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>` : "";
        const right = n === 0 ? mallet([34, 30.4], 160) + arm(this, [31.6, 38.8], [34, 30.4], [37, 36.6]) : mallet([19.6, 44.6], 118) + arm(this, [31.6, 38.8], [19.6, 44.6], [33.4, 46.2]);
        return { expr: n ? "content" : "neutre", left: block + rune + runeLine + left, right: "", over: right + sparks };
      }
    };
    module.exports = galet;
  }
});

// atelier/galet.js
var require_galet2 = __commonJS({
  "atelier/galet.js"(exports, module) {
    module.exports = require_galet();
  }
});

// personnages/melisse.js
var require_melisse = __commonJS({
  "personnages/melisse.js"(exports, module) {
    var { OUT, P, E, L, clip, expression, arm, r2: r22, lerp, TRAITS } = require_troupe();
    var { fondre } = require_couleurs();
    var C = fondre({
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
    });
    var crescent = /* @__PURE__ */ __name((x, y, r, fill = C.moon) => `<path d="M${r22(x)},${r22(y - r)} A${r} ${r} 0 1 0 ${r22(x)},${r22(y + r)} A${r22(r * 0.72)} ${r} 0 1 1 ${r22(x)},${r22(y - r)} Z" fill="${fill}"/>`, "crescent");
    var posy = /* @__PURE__ */ __name((x, y) => [[0, 0, C.lavender], [1.6, -0.6, C.pink], [3, 0.2, C.yellow], [1.2, 1, C.lavender]].map(([dx, dy, f]) => E(x + dx, y + dy, 0.85, 0.85, f, 0.5)).join(""), "posy");
    function box(x, y, open = false) {
      const lid = open ? P(`M${r22(x - 3.7)},${r22(y - 2.2)} L${r22(x + 3.7)},${r22(y - 2.2)} L${r22(x + 2.8)},${r22(y - 5.2)} L${r22(x - 2.8)},${r22(y - 5.2)} Z`, C.ironS, 0.8) : `<rect x="${r22(x - 3.9)}" y="${r22(y - 3)}" width="7.8" height="1.6" rx="0.4" fill="${C.ironH}" stroke="${OUT}" stroke-width="0.8"/>`;
      return `<rect x="${r22(x - 3.7)}" y="${r22(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${C.iron}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x + 1.6)}" y="${r22(y - 1.8)}" width="1.6" height="3.8" fill="${C.ironS}"/>` + lid + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.35, 0.35, C.ironH, 0)).join("") + (open ? "" : `<rect x="${r22(x - 0.6)}" y="${r22(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${C.yellow}" stroke="${OUT}" stroke-width="0.5"/>`);
    }
    __name(box, "box");
    var DRESS = "M16.2,33 Q24,30.4 31.8,33 L34.6,53.6 Q24,56 13.4,53.6 Z";
    var SHAWL = "M15.2,32.6 Q24,29.6 32.8,32.6 L34.2,40.8 L30.4,38.6 Q24,41.6 17.6,38.6 L13.8,40.8 Z";
    var SHAWL_BACK = "M15.2,32.6 Q24,29.6 32.8,32.6 L33.6,36.2 L24,47.4 L14.4,36.2 Z";
    var melisse = {
      name: "Mélisse",
      uid: "me",
      teintes: [C.hair, C.straw, C.shawl, C.dress, C.lavender],
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
        let s = P(DRESS, C.dress) + clip(`${c.uid}d`, DRESS, `<rect x="${view === "se" ? 26.4 : 27.8}" y="30" width="10" height="28" fill="${C.dressS}"/><path d="M12,52.6 Q24,55.2 36,52.6 L36,58 L12,58 Z" fill="${C.dressS}"/>`) + P(DRESS, "none");
        if (c.noShawl) return s;
        const sh = view === "ne" ? SHAWL_BACK : SHAWL;
        const moons = view === "ne" ? [[19.6, 36.2], [24, 41.4], [28.4, 36.2], [24, 34.2]] : [[16.6, 36.4], [31.4, 36.4], [20.4, 35], [27.6, 35]];
        s += P(sh, C.shawl) + clip(`${c.uid}s`, sh, `<rect x="${view === "se" ? 26.6 : 28}" y="28" width="9" height="22" fill="${C.shawlS}"/>` + moons.map(([x, y]) => crescent(x, y, 1)).join("")) + P(sh, "none");
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
        const crown = /* @__PURE__ */ __name((m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">` + P("M15.4,12.2 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.2 Q24,14 15.4,12.2 Z", C.straw) + P("M15.6,9.6 Q24,11.4 32.4,9.6 L32.6,12.2 Q24,14 15.4,12.2 Z", C.band, 0.8) + posy(16.8, 9.8) + L([18, 6], [21.4, 4.6], C.strawH, 1) + "</g>", "crown");
        let s = "";
        if (view === "ne") {
          const back2 = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.6,29.4 35.4,32.2 Q30,33.8 24,33.8 Q18,33.8 12.6,32.2 Q10.4,29.4 11.2,21 Z";
          s += E(12.6, 23, 1.6, 2.2, C.skin);
          s += P(back2, C.hair) + clip(`${c.uid}h`, back2, `<rect x="8" y="8" width="34" height="26" fill="${C.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${C.hair}"/>`) + P(back2, "none");
          s += P("M18,17 Q17.4,24 19,30.6", "none", 0.6) + P("M29.6,17 Q30.4,24 28.8,30.8", "none", 0.6) + P("M24,18 Q24.4,25 23.4,31.4", "none", 0.6);
          for (const [x, y] of [[22.6, 31.8], [20.4, 33.2], [18.2, 34.4]]) s += E(x, y, 1.6, 1.45, C.hair, 0.8);
          s += L([22, 31.2], [21, 31.9], C.hairH, 0.6);
          return s + brim(-1) + crown(-1);
        }
        const se = view === "se";
        const k = se ? -1.4 : 0;
        const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
        const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
        const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
        const back = "M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z";
        const bangs = sx("M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.4 L23,15.2 Q15,15.6 12.4,20 Z");
        s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, "none");
        if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
        const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
        s += P(face, C.skin);
        s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="5.6" fill="${C.skinS}" opacity="0.6"/>` + cheeks.map(([x, r]) => E(x, 26.4, r * (ctx.expr === "gene" ? 1.3 : 1), ctx.expr === "gene" ? 1.4 : 0.95, C.cheek, 0)).join(""));
        s += P(face, "none");
        s += P(bangs, C.hair) + L([16 + k, 15.2], [20.6 + k, 14.4], C.hairH, 0.9);
        s += `<g transform="translate(${k} 0)">${brim()}${crown()}</g>`;
        s += expression({
          eyes: se ? [[17.2, 22.8, 1.5], [25.2, 22.8, 1.3]] : [[19.4, 22.8, 1.55], [28.6, 22.8, 1.55]],
          ry: 2.3,
          brow: C.hairS,
          browY: -4.1,
          browW: 1,
          ...TRAITS.femme,
          // au repos : paupières lourdes et un sourire en coin, mystérieuse et tranquille
          restEyes: "sleepy",
          mouth: [se ? 20.8 : 24, 27.4],
          mw: 1.6,
          mouthC: C.mouth,
          tongue: C.tongue,
          neutral: /* @__PURE__ */ __name((mx, my) => `M${r22(mx - 1.3)},${r22(my + 0.3)} Q${r22(mx + 0.2)},${r22(my + 1.2)} ${r22(mx + 1.4)},${r22(my + 0.1)}`, "neutral"),
          cheeks,
          cheekY: 26.4,
          temple: [se ? 11.6 : 10.8, 22.8],
          anger: [40.4, 6],
          zz: [36.4, 7.6]
        }, ctx);
        return s;
      },
      pose({ pose, n, k }) {
        if (pose === "salut") {
          return { open: true, right: arm(this, [32, 34.4], lerp([37.4, 25.8], [38.8, 27.8], k)) };
        }
        const seeds = n ? [[22.4, 37.2, 0.7], [25.6, 35.6, 0.8], [23.8, 33.6, 0.6], [20.6, 34.4, 0.55], [27.6, 33, 0.5]].map(([x, y, r]) => E(x, y, r * 2.2, r * 2.2, C.glow, 0).replace("fill=", 'fill-opacity="0.45" fill=') + E(x, y, r, r, C.yellow, 0.4)).join("") + crescent(31, 36.6, 1.5, C.glow) : "";
        const left = box(24, 43.6, n === 1) + seeds + arm(this, [16, 34.4], [20.4, 43.4], [12.8, 40.6]);
        const right = arm(this, [32, 34.4], [27.6, 43.4], [35.2, 40.6]);
        return { expr: n ? "content" : "neutre", left, right };
      }
    };
    module.exports = melisse;
  }
});

// atelier/melisse.js
var require_melisse2 = __commonJS({
  "atelier/melisse.js"(exports, module) {
    module.exports = require_melisse();
  }
});

// atelier/naufrages.js
var require_naufrages = __commonJS({
  "atelier/naufrages.js"(exports, module) {
    var { castaway, weed, smudge, cord, fade, CANVAS } = require_naufrage();
    var { OUT, P, E, L, clip, limb, r2: r22, dechirure, filPendant } = require_troupe2();
    var { fondre } = require_couleurs();
    var hem = /* @__PURE__ */ __name((x0, x1, y0, yc) => (x) => {
      const t = (x - x0) / (x1 - x0);
      return r22(y0 + 2 * (yc - y0) * t * (1 - t));
    }, "hem");
    var lock = /* @__PURE__ */ __name((d, color) => cord(d, 1.2, color), "lock");
    var walkSway = /* @__PURE__ */ __name((k) => (ctx) => ctx.walk ? ctx.ph * k : 0, "walkSway");
    var SPECS = fondre({
      // Aster : ciré délavé et déchiré, pantalon retroussé, pieds nus, une voile nouée, une algue dans les cheveux
      Aster: (() => {
        const y = hem(13, 35, 47.5, 51), coatS = "#CC9A2F";
        return {
          fade: ["#F2C04B", "#CC9A2F", "#FFE49A", "#C8463A", "#9A2F28", "#2F5684", "#22416A"],
          k: 0.6,
          skinS: "#DDA982",
          leg: "roll",
          sleeves: "torn",
          // sa voile à elle : la toile d'une voile de bateau, bande de renfort rouge, un œillet de laiton
          cape: CANVAS,
          capeExtra: /* @__PURE__ */ __name((view) => `<rect x="0" y="${view === "ne" ? 39.2 : 38.6}" width="48" height="1.15" fill="#C8463A" opacity="0.9"/><circle cx="${view === "ne" ? 30.4 : view === "se" ? 15.2 : 16.4}" cy="${view === "ne" ? 36.6 : 36.4}" r="0.75" fill="none" stroke="#B08A3A" stroke-width="0.55"/>`, "capeExtra"),
          tatters: { front: [[17, y(17), coatS], [30, y(30), coatS, 1.8]], se: [[16.4, y(16.4), coatS], [29.4, y(29.4), coatS, 1.8]], ne: [[18.6, y(18.6), coatS], [30.4, y(30.4), coatS, 1.8]] },
          holes: { front: [[17.6, 45.2, 1.1, "#9C7424"]], se: [[16.8, 45.2, 1.1, "#9C7424"]], ne: [[27.6, 45.4, 1.1, "#9C7424"]] },
          rips: { front: [[29.6, 44.6]], se: [[28, 44.8]], ne: [[19.4, 44.6]] },
          head: /* @__PURE__ */ __name(({ view }) => view === "ne" ? weed("M27.6,6.6 Q34.6,7.4 36.2,12.6 Q37.4,16.8 35.6,20.6", [[36.6, 13.8, -20]]) : view === "se" ? weed("M18.8,7.6 Q13.6,8.4 12.6,13.2 Q11.8,17.4 13.2,20.2", [[12.4, 13.4, 30]]) + smudge(29.4, 28.6) : weed("M18.4,7.4 Q12.8,8.2 11.8,13.2 Q11,17.4 12.4,20.4", [[11.6, 13.4, 30]]) + smudge(31.4, 28.8), "head")
        };
      })(),
      // Cannelle : robe et tablier délavés et effrangés, jambes et pieds nus, le chignon à moitié défait (mèches grises) ;
      // une couverture rayée jetée sur les épaules, les deux pans croisés sur la poitrine et noués devant
      Cannelle: (() => {
        const y = hem(10.4, 37.6, 53.6, 57.2), ya = hem(15, 33, 53.4, 55.6), dS = "#84402B";
        const B = { cloth: "#93A9C2", shade: "#738AA6", stripe: "#E9EEF3", knot: "#7D94B0" };
        const fringe = /* @__PURE__ */ __name((x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => {
          const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, yy = y0 + (y1 - y0) * t;
          return L([x, yy + 0.3], [x - 0.2, yy + 1.7], B.shade, 0.55);
        }).join(""), "fringe");
        const stripes = /* @__PURE__ */ __name((ys) => ys.map((yy) => `<path d="M0,${yy} Q24,${r22(yy + 1.6)} 48,${yy}" stroke="${B.stripe}" stroke-width="0.85" fill="none"/>`).join(""), "stripes");
        const blanket = /* @__PURE__ */ __name((cc, { view }) => {
          if (view === "ne") {
            const d = "M11.8,36 Q13,32 18.4,31.2 Q24,32.6 29.6,31.2 Q35,32 36.2,36 L36.6,43.6 Q30.4,46.2 24,46.4 Q17.6,46.2 11.4,43.6 Z";
            return fringe(11.8, 43.8, 36.2, 43.8, 9) + P(d, B.cloth) + clip(`${cc.uid}cv`, d, stripes([38.2, 41.2]) + `<rect x="27" y="28" width="14" height="22" fill="${B.shade}" opacity="0.75"/>`) + P(d, "none");
          }
          const k = view === "se" ? -2 : 0, far = view === "se" ? 0.82 : 1;
          const X = /* @__PURE__ */ __name((x) => r22(24 + k + (x - 24) * (x > 24 ? far : 1)), "X");
          const left = `M${X(18.6)},31.4 Q${X(13)},32.4 ${X(11.8)},37.6 L${X(12.2)},44.2 Q${X(17.2)},45.6 ${X(23.4)},44.6 L${X(25.4)},41 Q${X(22.4)},36.2 ${X(21)},32.4 Z`;
          const right = `M${X(29.4)},31.4 Q${X(35)},32.4 ${X(36.2)},37.6 L${X(35.8)},44.2 Q${X(30.8)},45.6 ${X(24.6)},44.6 L${X(22.6)},41 Q${X(25.6)},36.2 ${X(27)},32.4 Z`;
          let o = fringe(X(12.4), 44.4, X(23.2), 44.8, 5) + fringe(X(24.8), 44.8, X(35.6), 44.4, 5);
          o += P(left, B.cloth) + clip(`${cc.uid}cl`, left, stripes([38.6, 41.6])) + P(left, "none");
          o += P(right, B.cloth) + clip(`${cc.uid}cr`, right, stripes([38.6, 41.6]) + `<rect x="${X(24)}" y="28" width="16" height="20" fill="${B.shade}" opacity="0.7"/>`) + P(right, "none");
          const kx = X(24);
          o += P(`M${r22(kx - 0.6)},42 L${r22(kx - 1.8)},45.6 L${r22(kx - 0.4)},45.2 Z`, B.knot, 0.7) + P(`M${r22(kx + 0.6)},42 L${r22(kx + 1.6)},45.4 L${r22(kx + 0.2)},45.2 Z`, B.knot, 0.7);
          o += E(kx, 41.6, 1.9, 1.5, B.knot) + P(`M${r22(kx - 1)},41.2 Q${kx},42 ${r22(kx + 1)},41.2`, "none", 0.5);
          return o;
        }, "blanket");
        return {
          fade: ["#A8553A", "#84402B", "#C46E4E", "#F4E9D8", "#DCCDB5"],
          skinS: "#CF9C72",
          leg: "skin",
          capeFn: blanket,
          sway: walkSway(0.7),
          tatters: { front: [[12.8, y(12.8), dS, 1.8], [35.2, y(35.2), dS, 1.8], [26.4, ya(26.4), "#F4E9D8", 1.5, 0.8]], se: [[12.6, y(12.6), dS, 1.8], [35.4, y(35.4), dS, 1.8], [24.2, ya(26.2), "#F4E9D8", 1.5, 0.8]], ne: [[13.4, y(13.4), dS, 1.8], [22, y(22), dS], [34.6, y(34.6), dS, 1.8]] },
          holes: { front: [[33.6, 50.4, 0.9, "#6A3322"]], se: [[33.8, 50.6, 0.9, "#6A3322"]], ne: [[30.2, 50.8, 1, "#6A3322"]] },
          rips: { front: [[20.6, 50.8, 2.2]], se: [[18.8, 50.8, 2.2]], ne: [[16.6, 50.4, 2.4]] },
          head: /* @__PURE__ */ __name(({ view }) => {
            const hair = "#D9D4CC";
            if (view === "ne") return lock("M14.2,22 Q11.4,26.4 12.8,30.4", hair) + lock("M33.8,22 Q36.4,26 35,29.6", hair) + lock("M26.6,11.6 Q30.6,12.4 31,16.4", hair);
            const k = view === "se" ? -0.6 : 0;
            return lock(`M${12.8 + k},18.4 Q${10.6 + k},22.2 ${12 + k},26`, hair) + (view === "se" ? "" : lock("M35.2,18.4 Q37.4,22.2 36,26", hair)) + lock(`M${27.4 + k},9.4 Q${31.4 + k},9.8 ${32.4 + k},13.2`, hair) + smudge(view === "se" ? 27.8 : 31, 29.4);
          }, "head")
        };
      })(),
      // Rivet : chemise délavée aux manches retroussées, un bandage de chiffon sur l'avant-bras gauche, tablier de cuir
      // éraflé dont la poche à outils est à moitié arrachée, une loupe fêlée, pantalon retroussé, pieds nus, suie sur la joue
      Rivet: (() => {
        const ya = hem(15.8, 32.2, 52, 53.8), yt = hem(14.8, 33.2, 46.6, 48.8);
        const crack = /* @__PURE__ */ __name((x, y, r) => `<path d="M${r22(x - r * 0.55)},${r22(y - r * 0.5)} L${r22(x - r * 0.1)},${r22(y - r * 0.05)} L${r22(x - r * 0.3)},${r22(y + r * 0.45)} M${r22(x - r * 0.1)},${r22(y - r * 0.05)} L${r22(x + r * 0.5)},${r22(y + r * 0.1)}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>`, "crack");
        const pocket = /* @__PURE__ */ __name(({ view }) => {
          if (view === "ne") return "";
          const k = view === "se" ? -1.8 : 0;
          return `<rect x="${r22(24.2 + k)}" y="43.4" width="4.4" height="1.5" rx="0.3" fill="#3E2A1C"/>` + P(`M${r22(24.2 + k)},44.8 L${r22(28.8 + k)},44.8 Q${r22(28.4 + k)},47.6 ${r22(26.9 + k)},49.2 Q${r22(25.2 + k)},47.4 ${r22(24.2 + k)},44.8 Z`, "#73533C", 0.8) + L([25.2 + k, 45.6], [27.8 + k, 45.6], "#B08A68", 0.45);
        }, "pocket");
        return {
          fade: ["#3F8A86", "#2E6B68", "#EFE6D6", "#4A4E5C", "#383B47"],
          map: { "#8A5A36": "#93694A", "#6B4328": "#73533C", "#A87650": "#B08A68" },
          // cuir un peu passé
          skinS: "#C08A62",
          leg: "roll",
          sleeves: "roll",
          sleeveCut: 6.4,
          bandage: "left",
          over: pocket,
          tatters: { front: [[15.4, yt(15.4), "#2E6B68", 1.1, 0.8], [32.6, yt(32.6), "#2E6B68", 1.1, 0.8], [21, ya(21), "#6B4328", 1.5, 0.8]], se: [[15.2, yt(15.2), "#2E6B68", 1.1, 0.8], [32.8, yt(32.8), "#2E6B68", 1.1, 0.8], [19.2, ya(21), "#6B4328", 1.5, 0.8]], ne: [[17.4, yt(17.4), "#3F8A86", 1.6], [24.4, yt(24.4), "#3F8A86", 1.4], [30.6, yt(30.6), "#2E6B68", 1.6]] },
          holes: { ne: [[20.6, 37.8, 1, "#24504E"]] },
          rips: { front: [[28.4, 50.6, 2]], se: [[26.6, 50.6, 2]], ne: [[28.4, 44.6, 2.2]] },
          head: /* @__PURE__ */ __name(({ view, pose }) => {
            if (view === "ne") return "";
            const lens = pose === "action" ? [28.6, 22.8, 2.9] : view === "se" ? [26.6, 10.4, 2.5 * 0.68] : [28.6, 10.8, 2.9 * 0.68];
            return crack(...lens) + smudge(view === "se" ? 27.6 : 30.8, 28.6, "#6E5E54");
          }, "head")
        };
      })(),
      // Ondin : ciré délavé et effrangé, le bout du bonnet arraché (le pompon pend au bout d'un fil), une petite étoile de
      // mer accrochée au ciré, une algue prise dans le bonnet ; bocal vide, baguette sauvée
      Ondin: (() => {
        const y = hem(13, 35, 52.4, 55), cS = "#2E5F9E", HY = 4.4;
        const POM = E(41.6, 24.4, 2.2, 2.2, "#F4EEDF") + E(42.2, 25.2, 0.8, 0.7, "#DCCDB5", 0);
        const hanging = /* @__PURE__ */ __name((k, m, n) => {
          const tip = [24 + (41.8 + k - 24) * m, 23.4], swing = n % 2 ? 0.5 : -0.3;
          const end = [24 + (42.6 + k - 24) * m + swing, 28];
          return `<path d="M${r22(tip[0])},${tip[1]} Q${r22((tip[0] + end[0]) / 2 + 0.6 * m)},${r22(25.8)} ${r22(end[0])},${end[1]}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>` + E(end[0], end[1] + 1.8, 2, 2, "#F4EEDF") + E(end[0] + 0.5 * m, end[1] + 2.5, 0.75, 0.65, "#DCCDB5", 0) + L([tip[0] - 0.8, tip[1] + 0.2], [tip[0] + 0.7, tip[1] + 0.5], OUT, 0.5);
        }, "hanging");
        const star = /* @__PURE__ */ __name((x, yy, r, rot) => {
          const p = Array.from({ length: 10 }, (_, i) => {
            const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.46 : r;
            return `${r22(x + Math.cos(a) * rr)},${r22(yy + Math.sin(a) * rr)}`;
          }).join(" L");
          return `<g transform="rotate(${rot} ${x} ${yy})"><path d="M${p} Z" fill="#F2995A" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + [[0, -0.55], [0.5, 0.1], [-0.5, 0.1], [0, 0.5]].map(([dx, dy]) => E(x + dx * r, yy + dy * r, 0.28, 0.28, "#FFD9B3", 0)).join("") + "</g>";
        }, "star");
        return {
          fade: ["#3D7CC9", "#2E5F9E", "#7DB0E8", "#A9CBEF", "#BFD3F2", "#93AEDB"],
          over: /* @__PURE__ */ __name(({ view }) => view === "ne" ? star(28.2, 43, 2.7, -12) : star(view === "se" ? 21.2 : 21, 42.2, 2.7, 16), "over"),
          tatters: { front: [[16, y(16), cS], [31, y(31), cS, 1.8]], se: [[15.6, y(15.6), cS], [30.2, y(30.2), cS, 1.8]], ne: [[17.4, y(17.4), cS], [30.6, y(30.6), cS, 1.8]] },
          holes: { front: [[17.2, 50.8, 0.9, "#264E82"]], se: [[16.4, 51, 0.9, "#264E82"]], ne: [[28.8, 50.6, 1, "#264E82"]] },
          rips: { front: [[30.4, 50.2, 2]], se: [[28.8, 50.4, 2]], ne: [[18.6, 50.6, 2]] },
          headFix: /* @__PURE__ */ __name((h, { view, n }) => {
            const k = view === "se" ? -1.4 : 0, m = view === "ne" ? -1 : 1;
            return h.split(POM).join("").replace(/<\/g>$/, hanging(k, m, n) + "</g>");
          }, "headFix"),
          head: /* @__PURE__ */ __name(({ view }) => {
            if (view === "ne") return weed(`M31,${6.4 + HY} Q34.6,${7.6 + HY} 35.2,${11.2 + HY} Q35.6,${13.8 + HY} 34.6,${16 + HY}`, [[35.6, 12 + HY, -24]]);
            const k = view === "se" ? -1.4 : 0;
            return weed(`M${18 + k},${5.8 + HY} Q${14.2 + k},${7.2 + HY} ${13.4 + k},${10.8 + HY} Q${13 + k},${13.4 + HY} ${14 + k},${15.8 + HY}`, [[12.8 + k, 11.6 + HY, 30]]) + smudge(view === "se" ? 27.6 : 30.8, 28.4 + HY);
          }, "head")
        };
      })(),
      // Sylve : sa cape de feuilles est perdue (il ne reste que la liane et quelques feuilles flétries), tunique délavée et
      // trouée, une bande de voile nouée en ceinture, de la boue sur la joue
      Sylve: (() => {
        const W1 = { leaf: "#8C9A4E", leafS: "#6E7A3A", vine: "#6E7440" };
        const leafAt = /* @__PURE__ */ __name((x, y, len, w, rot) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot})">` + P(`M0,0 Q${w},${r22(len / 2)} 0,${len} Q${-w},${r22(len / 2)} 0,0 Z`, W1.leaf, 0.7) + L([0, 0.6], [0, len - 0.8], W1.leafS, 0.4) + "</g>", "leafAt");
        const vine = /* @__PURE__ */ __name((d) => cord(d, 1, W1.vine), "vine");
        const remnant = /* @__PURE__ */ __name(({ view }) => view === "ne" ? "" : vine("M15.6,33.4 Q12.2,38 12.6,45.6") + leafAt(12.4, 40.4, 3.2, 1.3, 40) + leafAt(12.8, 45, 3.4, 1.3, 14), "remnant");
        const belt = /* @__PURE__ */ __name(({ view }) => {
          const k = view === "se" ? -1.6 : 0;
          const band = "M15,41.3 Q24,43.1 33,41.3 L33.1,43.5 Q24,45.3 14.9,43.5 Z";
          let o = P(band, "#E6DCC3") + clip(`sybelt${view}`, band, '<rect x="26" y="40" width="10" height="6" fill="#C9BB98"/>') + P(band, "none");
          if (view === "ne") {
            return [[19.2, 43.2, 16], [22.6, 44, 4], [27.6, 43.8, -10]].map(([x, y, r]) => leafAt(x, y, 3.6, 1.4, r)).join("") + o;
          }
          const kx = 19.6 + k;
          o += P(`M${r22(kx - 0.4)},43.6 L${r22(kx - 1.8)},47.8 L${r22(kx - 0.2)},47.6 Z`, "#E6DCC3", 0.7) + P(`M${r22(kx + 0.6)},43.6 L${r22(kx + 1.4)},47.2 L${r22(kx)},47.4 Z`, "#C9BB98", 0.7);
          return o + E(kx, 42.9, 1.5, 1.2, "#D6CBAE", 0.8);
        }, "belt");
        return {
          flags: { noCape: true },
          fade: ["#A88655", "#86683E"],
          map: { "#5E9E4A": W1.leaf, "#467A37": W1.leafS, "#86C06A": "#B1B86C", "#4E7A34": W1.vine },
          overKeep: ["#5E9E4A", "#467A37", "#86C06A", "#4E7A34"],
          // la pousse qui jaillit reste verte
          backItems: /* @__PURE__ */ __name((cc, ctx) => remnant(ctx), "backItems"),
          over: belt,
          holes: { front: [[29.4, 38.2, 0.9, "#6E5530"]], se: [[28, 38.4, 0.9, "#6E5530"]], ne: [[20.4, 40.2, 1, "#6E5530"]] },
          rips: { front: [[18.4, 37.4, 2]], se: [[17, 37.6, 2]], ne: [[28.4, 38.6, 2]] },
          head: /* @__PURE__ */ __name(({ view }) => view === "ne" ? "" : smudge(view === "se" ? 15.4 : 17.4, 29.6, "#7A5E44"), "head")
        };
      })(),
      // Galet : un sac de jute du caboteur porté en poncho (trou pour la tête, bas effiloché, corde à la taille), blouse et
      // pantalon délavés ; il a perdu un sabot : pied droit nu, pantalon retroussé de ce côté
      Galet: /* @__PURE__ */ (() => {
        const HY = 4.4;
        const J = { cloth: "#C2A574", shade: "#9E8456", dot: "#A88C5C", rope: "#7A5A3A" };
        const weave = /* @__PURE__ */ __name((x0, x1, y0, y1) => {
          let o = "";
          for (let yy = y0; yy < y1; yy += 2.2) for (let x = x0 + (Math.round(yy * 10) % 2 ? 1 : 0); x < x1; x += 2.6) o += `<rect x="${r22(x)}" y="${r22(yy)}" width="0.9" height="0.5" fill="${J.dot}" opacity="0.8"/>`;
          return o;
        }, "weave");
        const poncho = /* @__PURE__ */ __name((cc, { view }) => {
          const k = view === "se" ? -1.6 : 0, far = view === "se" ? 0.84 : 1;
          const X = /* @__PURE__ */ __name((x) => r22(24 + k + (x - 24) * (x > 24 ? far : 1)), "X");
          const tear = dechirure([X(12.8), 48.2], [24 + k, 50.4], [X(35.2), 48.2], view === "ne" ? 8 : 6);
          const bottom = `${X(12.8)},48.2 ${tear.d}`;
          const d = view === "ne" ? `M${X(17.4)},36.6 Q${X(13.4)},37.4 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.6)},37.4 ${X(30.6)},36.6 Q24,37.8 ${X(17.4)},36.6 Z` : `M${X(17.6)},37 Q${X(13.6)},37.6 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.4)},37.6 ${X(30.4)},37 Q${24 + k},39.4 ${X(17.6)},37 Z`;
          let o = P(d, J.cloth) + clip(`${cc.uid}pj`, d, weave(10, 38, 38, 50) + `<rect x="${X(28)}" y="34" width="12" height="18" fill="${J.shade}" opacity="0.8"/><path d="M${X(12)},43.2 Q${24 + k},44.6 ${X(36)},43.2" fill="none" stroke="#8A6E44" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, "none");
          o += tear.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
          o += cord(`M${X(12.9)},45.4 Q${24 + k},47.4 ${X(35.3)},45.4`, 0.8, J.rope);
          if (view !== "ne") o += E(X(31.4), 46.1, 1.2, 0.9, J.rope, 0.7) + cord(`M${X(31.2)},46.8 L${X(30.6)},49.6`, 0.6, J.rope) + cord(`M${X(31.8)},46.8 L${X(32.6)},49.2`, 0.6, J.rope);
          return o;
        }, "poncho");
        return {
          fade: ["#6E6458", "#564E44", "#55504A", "#403C37", "#B5562E", "#8E3F20", "#D07448"],
          skinS: "#9C968B",
          leg: "roll",
          bareSide: "right",
          capeFn: poncho,
          tatters: { front: [[16, 51.4, "#6E6458", 1.6], [31.6, 51.5, "#564E44", 1.6]], se: [[15.6, 51.4, "#6E6458", 1.6], [30.6, 51.5, "#564E44", 1.6]], ne: [[17, 51.4, "#6E6458", 1.6], [31.4, 51.5, "#564E44", 1.6]] },
          head: /* @__PURE__ */ __name(() => "", "head")
        };
      })(),
      // Mélisse : robe délavée et déchirée, le châle couleur nuit noué à la taille (la pointe pend dans le dos), le chapeau
      // de paille déchiré au bord, cabossé et effiloché, une algue accrochée au bord ; jambes nues et un sabot perdu
      Melisse: (() => {
        const y = hem(13.4, 34.6, 53.6, 56), dS = "#728560";
        const SH = fade("#2E3A6B"), SHS = fade("#232C52"), MOON = "#F4EEDF";
        const straw = /* @__PURE__ */ __name((x, yy, dx, dy) => L([x, yy], [x + dx, yy + dy], OUT, 1.5) + L([x, yy], [x + dx, yy + dy], "#E3C27A", 0.7), "straw");
        const crescent = /* @__PURE__ */ __name((x, yy, r) => `<path d="M${r22(x)},${r22(yy - r)} A${r} ${r} 0 1 0 ${r22(x)},${r22(yy + r)} A${r22(r * 0.72)} ${r} 0 1 1 ${r22(x)},${r22(yy - r)} Z" fill="${MOON}"/>`, "crescent");
        const shawl = /* @__PURE__ */ __name(({ view }) => {
          const band = "M14.6,43 Q24,45.2 33.4,43 L33.8,46.2 Q24,48.4 14.2,46.2 Z";
          let o = "";
          if (view === "ne") {
            const tri = "M15.2,45.6 Q24,47.6 32.8,45.6 L24.4,55 L23.6,55 Z";
            o += P(tri, SH) + clip(`meltri`, tri, `<rect x="24" y="40" width="12" height="18" fill="${SHS}"/>` + crescent(21.6, 48.6, 0.9) + crescent(25.6, 49.6, 0.9) + crescent(23.8, 52.4, 0.8)) + P(tri, "none") + [23.2, 24.8].map((x) => L([x, 54.8], [x, 56.4], SHS, 0.55)).join("");
          }
          o += P(band, SH) + clip(`melband${view}`, band, `<rect x="27.6" y="40" width="10" height="10" fill="${SHS}"/>` + crescent(18.6, 44.8, 0.8) + crescent(23.4, 45.8, 0.8)) + P(band, "none");
          if (view !== "ne") {
            const k = view === "se" ? -1.4 : 0, kx = 31.4 + k * 0.4;
            o += P(`M${r22(kx - 0.6)},46.4 L${r22(kx - 1.8)},51.4 L${r22(kx - 0.2)},51 Z`, SH, 0.7) + P(`M${r22(kx + 0.6)},46.4 L${r22(kx + 1.6)},50.6 L${r22(kx + 0.2)},50.8 Z`, SHS, 0.7) + E(kx, 45.6, 1.6, 1.3, SHS, 0.8) + [kx - 1.8, kx + 1.6].map((x) => L([x, 51], [x, 52.2], SHS, 0.5)).join("");
          }
          return o;
        }, "shawl");
        const hatDamage = /* @__PURE__ */ __name((k, m) => {
          const X = /* @__PURE__ */ __name((x) => r22(24 + (x - 24) * m + k), "X");
          return `<path d="M${X(11.4)},15.4 L${X(13)},13.4 L${X(14.2)},14.6 L${X(15.6)},12.9" fill="none" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"/>` + P(`M${X(11.4)},15.4 L${X(13)},13.4 L${X(10.6)},12.6 Z`, "#D9C08E", 0.6) + P(`M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2 L${X(20.6)},6.6 Z`, "#A88E5E", 0) + `<path d="M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        }, "hatDamage");
        return {
          flags: { noShawl: true },
          fade: ["#8FA27A", "#728560", "#2E3A6B", "#232C52", "#E3C27A", "#BF9A52", "#F2DCA0", "#7A4A6A", "#A8743F", "#7E5530", "#C9965E"],
          skinS: "#A9704C",
          leg: "skin",
          bareSide: "left",
          over: shawl,
          tatters: { front: [[16, y(16), dS], [31.6, y(31.6), dS, 1.8]], se: [[15.6, y(15.6), dS], [30.8, y(30.8), dS, 1.8]], ne: [[17, y(17), dS], [31, y(31), dS, 1.8]] },
          holes: { front: [[29.6, 38.6, 0.9, "#5C6E4C"]], se: [[28.2, 38.6, 0.9, "#5C6E4C"]], ne: [[19.4, 38.6, 1, "#5C6E4C"]] },
          rips: { front: [[19.6, 50.4, 2.2]], se: [[18.2, 50.4, 2.2]], ne: [[28.6, 50.6, 2.2]] },
          head: /* @__PURE__ */ __name(({ view }) => {
            if (view === "ne") return hatDamage(0, -1) + straw(40.6, 13.6, 2.6, 1.2) + straw(41.2, 12.2, 2.8, -0.4) + weed("M13.6,15.4 Q10.8,18.4 12,22.6", [[11.4, 19.2, 26]]);
            const k = view === "se" ? -1.4 : 0;
            return hatDamage(k, 1) + straw(7.2 + k, 13.4, -2.6, 1) + straw(6.8 + k, 12, -2.8, -0.6) + straw(8.4 + k, 14.8, -1.8, 1.8) + weed(`M${34.4 + k},15.4 Q${37 + k},18.4 ${35.8 + k},22.6`, [[36.6 + k, 19.4, -24]]) + smudge(view === "se" ? 15.6 : 17.6, 29);
          }, "head")
        };
      })()
    });
    var BASE = { Aster: require_aster2(), Cannelle: require_cannelle2(), Rivet: require_rivet2(), Ondin: require_ondin2(), Sylve: require_sylve2(), Galet: require_galet2(), Melisse: require_melisse2() };
    var CAST = Object.entries(BASE).map(([k, c]) => ({ base: c, nau: castaway(c, SPECS[k]) }));
    CAST.find((x) => x.base.name === "Sylve").nau.nauMound = { fill: fade("#A88655"), shade: fade("#86683E"), hi: fade("#C2A274"), leaf: "#8C9A4E" };
    for (const n of ["Galet", "Sylve"]) CAST.find((x) => x.base.name === n).nau.sansDon = true;
    module.exports = { CAST, SPECS };
  }
});

// personnages/refonte/visage.js
var require_visage = __commonJS({
  "personnages/refonte/visage.js"(exports, module) {
    var { P, E, L, clip, drop, zee, r2: r22, OUT } = require_troupe();
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
      const under = E(x, y + ry + 0.25, 1.9, 0.75, K.under, 0).replace("/>", ` opacity="${r22(0.3 * e.under)}"/>`);
      const flick = /* @__PURE__ */ __name((yy, w = 0.6) => P(`M${r22(x - k * rx)},${r22(yy)} l${r22(-k * 0.7)},-0.5`, "none", w), "flick");
      if (e.mode === "closed") return under + P(`M${r22(x - rx)},${r22(y + 0.4)} Q${x},${r22(y + 1.8)} ${r22(x + rx)},${r22(y + 0.4)}`, "none", 1) + flick(y + 0.4);
      if (e.mode === "joy") return under + P(`M${r22(x - rx)},${r22(y + 1)} Q${x},${r22(y - 1.5)} ${r22(x + rx)},${r22(y + 1)}`, "none", 1.1) + flick(y + 1);
      if (e.mode === "squeeze") return P(`M${r22(x - k * 1.5)},${r22(y - 1.4)} L${r22(x + k * 1.2)},${r22(y + 0.1)} L${r22(x - k * 1.5)},${r22(y + 1.5)}`, "none", 1.1);
      if (e.mode === "shut") return P(`M${r22(x - rx)},${r22(y + 0.3)} Q${x},${r22(y - 0.3)} ${r22(x + rx)},${r22(y + 0.5)}`, "none", 1.1) + P(`M${r22(x - k * 0.6)},${r22(y - 1.6)} l${r22(k * 0.9)},0.7 M${r22(x - k * 0.2)},${r22(y + 1.8)} l${r22(k * 0.9)},-0.5`, "none", 0.5);
      const [lx, ly] = e.look;
      const top = y - ry + e.lid * 2 * ry;
      const tin = top + (e.tilt || 0), tout = top - (e.tilt || 0) * 0.6;
      const xin = x + k * (rx + 0.25), xout = x - k * (rx + 0.35);
      const lidLine = `M${r22(xout)},${r22(tout + 1.6)} Q${x},${r22(Math.min(tin, tout) - 1.2)} ${r22(xin)},${r22(tin + 1.6)}`;
      const bot = y + ry - (e.low || 0) * 2 * ry;
      const ix = x + lx, iy = y + ly;
      const [irx, iry, pr] = e.small ? [0.95, 1.2, 0.38] : [1.45, 1.8, 0.66];
      let inner = E(x, y, rx, ry, e.small ? "#FFFFFF" : K.eye, 0) + E(ix, iy + 0.55, irx, iry, K.iris, e.small ? 0.5 : 0) + (e.small ? "" : P(`M${r22(ix - 1.2)},${r22(iy + 1)} Q${r22(ix)},${r22(iy + 2.5)} ${r22(ix + 1.2)},${r22(iy + 1)} Q${r22(ix)},${r22(iy + 1.7)} ${r22(ix - 1.2)},${r22(iy + 1)} Z`, K.irisL, 0)) + E(ix, iy + 0.35, pr, pr * 1.1, K.eye, 0) + E(ix - k * 0.55 * (e.small ? 0.6 : 1), Math.max(iy - 0.85, top + 0.7), e.small ? 0.36 : 0.72, e.small ? 0.36 : 0.72, "#FFFFFF", 0) + (e.small ? "" : E(ix + k * 0.45, iy + 1.15, 0.28, 0.28, "#FFFFFF", 0));
      if (e.sparkle) inner += P(`M${r22(ix + k * 0.5)},${r22(iy - 0.2)} l0.25,0.6 l0.6,0.25 l-0.6,0.25 l-0.25,0.6 l-0.25,-0.6 l-0.6,-0.25 l0.6,-0.25 Z`, "#FFFFFF", 0);
      if (e.wet) inner += P(`M${r22(x - rx)},${r22(y + 1.2)} Q${x},${r22(y + 1.9)} ${r22(x + rx)},${r22(y + 1.2)} L${r22(x + rx)},${r22(y + ry + 0.5)} L${r22(x - rx)},${r22(y + ry + 0.5)} Z`, "#CDEFF0", 0).replace("/>", ' opacity=".55"/>');
      if (e.lid > 0 || e.tilt) inner += P(`${lidLine} L${r22(xin)},${r22(y - ry - 2)} L${r22(xout)},${r22(y - ry - 2)} Z`, K.lid, 0);
      if (e.low) inner += P(`M${r22(x - rx - 0.5)},${r22(bot + 0.2)} Q${x},${r22(bot - 0.8)} ${r22(x + rx + 0.5)},${r22(bot + 0.2)} L${r22(x + rx + 0.5)},${r22(y + ry + 1)} L${r22(x - rx - 0.5)},${r22(y + ry + 1)} Z`, K.lid, 0);
      let s = under;
      s += clip(id, `M${r22(x - rx)},${y} a${rx},${ry} 0 1,0 ${r22(2 * rx)},0 a${rx},${ry} 0 1,0 ${r22(-2 * rx)},0 Z`, inner);
      if (e.small) s += E(x, y, rx, ry, "none", 0.7);
      s += P(lidLine, "none", 0.95);
      s += P(`M${r22(xout + k * 0.1)},${r22(tout + 1.55)} l${r22(-k * 0.7)},${r22(-0.6)}`, "none", 0.65);
      if (e.low) s += P(`M${r22(x - rx * 0.7)},${r22(bot + 0.05)} Q${x},${r22(bot - 0.6)} ${r22(x + rx * 0.7)},${r22(bot + 0.05)}`, "none", 0.45);
      return s;
    }
    __name(eye, "eye");
    function brow(x, y, k, b, split, sc, K) {
      sc = sc || 1;
      const [bi, bo, arch] = b, hw = 2.4 * sc;
      const xi = x + k * hw, xo = x - k * hw, yi = y + bi, yo = y + bo, mx = x, my = (yi + yo) / 2 + arch;
      const t = K.browW || 1;
      let s = P(`M${r22(xi)},${r22(yi - 0.5 * t)} Q${r22(mx)},${r22(my - 0.55 * t)} ${r22(xo)},${r22(yo)} Q${r22(mx)},${r22(my + 0.35 * t)} ${r22(xi)},${r22(yi + 0.55 * t)} Z`, K.brow, 0);
      if (split) s += L([x - k * 0.35, (yi + yo) / 2 - 1], [x - k * 0.05, (yi + yo) / 2 + 1], K.skin, 0.55) + L([x - k * 0.5, (yi + yo) / 2 - 1.9], [x - k * 0.3, (yi + yo) / 2 - 1], "#B5473A", 0.4);
      return s;
    }
    __name(brow, "brow");
    function mouth(kind, mx, my, id, K) {
      const line = /* @__PURE__ */ __name((d) => P(d, "none", 0.85), "line");
      const lip = L([mx - 0.5, my + 1.4], [mx + 0.5, my + 1.4], K.skinS, 0.45);
      const open = /* @__PURE__ */ __name((d, tongue = true, teeth = false) => P(d, K.mouth, 0.85) + clip(id, d, (tongue ? E(mx, my + 2.1, 1.3, 0.85, "#D9786C", 0) : "") + (teeth ? `<rect x="${r22(mx - 2.5)}" y="${r22(my - 0.6)}" width="5" height="1.05" fill="#FFFFFF"/>` : "")), "open");
      switch (kind) {
        case "firm":
          return line(`M${r22(mx - 1.5)},${r22(my + 0.3)} L${r22(mx + 1.4)},${r22(my + 0.2)}`) + line(`M${r22(mx + 1.4)},${r22(my + 0.2)} l0.35,0.45`);
        case "wave":
          return P(`M${r22(mx - 1.4)},${r22(my + 0.6)} Q${r22(mx - 0.7)},${r22(my + 0.05)} ${mx},${r22(my + 0.45)} Q${r22(mx + 0.7)},${r22(my + 0.85)} ${r22(mx + 1.4)},${r22(my + 0.35)}`, "none", 0.75);
        case "half":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.15)} Q${r22(mx + 0.2)},${r22(my + 1)} ${r22(mx + 1.6)},${r22(my - 0.45)}`) + line(`M${r22(mx + 1.6)},${r22(my - 0.45)} l0.2,-0.3`);
        case "smirk":
          return line(`M${r22(mx - 1.2)},${r22(my + 0.45)} Q${r22(mx + 0.4)},${r22(my + 0.6)} ${r22(mx + 1.7)},${r22(my - 0.5)}`) + lip;
        case "side":
          return line(`M${r22(mx - 0.4)},${r22(my + 0.5)} Q${r22(mx + 0.6)},${r22(my + 0.3)} ${r22(mx + 1.7)},${r22(my + 0.1)}`) + L([mx + 0.2, my + 1.4], [mx + 1, my + 1.3], K.skinS, 0.45);
        case "bite":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.3)} L${r22(mx + 1.4)},${r22(my + 0.3)}`) + P(`M${r22(mx - 0.7)},${r22(my + 0.3)} L${r22(mx - 0.6)},${r22(my + 1)} L${r22(mx + 0.1)},${r22(my + 1)} L${r22(mx + 0.2)},${r22(my + 0.3)} Z`, "#FFFFFF", 0.45);
        case "soft":
          return line(`M${r22(mx - 1.3)},${r22(my + 0.15)} Q${mx},${r22(my + 1)} ${r22(mx + 1.3)},${r22(my + 0.15)}`);
        case "laugh":
          return open(`M${r22(mx - 2)},${r22(my - 0.2)} Q${mx},${r22(my - 0.6)} ${r22(mx + 2)},${r22(my - 0.2)} Q${r22(mx + 1.6)},${r22(my + 3.4)} ${mx},${r22(my + 3.4)} Q${r22(mx - 1.6)},${r22(my + 3.4)} ${r22(mx - 2)},${r22(my - 0.2)} Z`, true, true);
        case "wow":
          return open(`M${r22(mx - 1.2)},${r22(my + 0.1)} Q${mx},${r22(my - 0.3)} ${r22(mx + 1.2)},${r22(my + 0.1)} Q${r22(mx + 1)},${r22(my + 2)} ${mx},${r22(my + 2)} Q${r22(mx - 1)},${r22(my + 2)} ${r22(mx - 1.2)},${r22(my + 0.1)} Z`);
        case "shout":
          return open(`M${r22(mx - 1.9)},${r22(my - 0.3)} L${r22(mx + 1.9)},${r22(my - 0.5)} Q${r22(mx + 1.8)},${r22(my + 3.6)} ${mx},${r22(my + 3.6)} Q${r22(mx - 1.8)},${r22(my + 3.6)} ${r22(mx - 1.9)},${r22(my - 0.3)} Z`, true, true);
        case "fear":
          return open(`M${r22(mx - 1.6)},${r22(my + 0.6)} Q${r22(mx - 0.8)},${r22(my - 0.1)} ${mx},${r22(my + 0.4)} Q${r22(mx + 0.8)},${r22(my - 0.1)} ${r22(mx + 1.6)},${r22(my + 0.6)} L${r22(mx + 1.2)},${r22(my + 1.9)} Q${mx},${r22(my + 1.5)} ${r22(mx - 1.2)},${r22(my + 1.9)} Z`, false, true);
        case "sob":
          return open(`M${r22(mx - 1.5)},${r22(my + 1.6)} Q${mx},${r22(my - 0.4)} ${r22(mx + 1.5)},${r22(my + 1.6)} Q${mx},${r22(my + 2.4)} ${r22(mx - 1.5)},${r22(my + 1.6)} Z`, false);
        case "pout":
          return P(`M${r22(mx - 1)},${r22(my + 0.5)} Q${mx},${r22(my - 0.2)} ${r22(mx + 1)},${r22(my + 0.5)} Q${mx},${r22(my + 1.2)} ${r22(mx - 1)},${r22(my + 0.5)} Z`, "#C9665B", 0.75);
        case "chatter":
          return P(`M${r22(mx - 1.7)},${r22(my + 0.1)} L${r22(mx + 1.7)},${r22(my + 0.1)} L${r22(mx + 1.5)},${r22(my + 1.4)} L${r22(mx - 1.5)},${r22(my + 1.4)} Z`, "#FFFFFF", 0.8) + P(`M${r22(mx - 1.4)},${r22(my + 0.75)} l0.7,-0.35 l0.7,0.35 l0.7,-0.35 l0.7,0.35`, "none", 0.4).replace(`stroke="${OUT}"`, 'stroke="#9A8A84"');
        case "sleep":
          return E(mx + 0.2, my + 0.7, 0.55, 0.65, K.mouth, 0.75);
        case "down":
          return line(`M${r22(mx - 1.4)},${r22(my + 0.9)} Q${mx},${r22(my + 0.1)} ${r22(mx + 1.4)},${r22(my + 0.9)}`);
        case "teeth":
          return P(`M${r22(mx - 1.7)},${r22(my + 0.2)} L${r22(mx + 1.7)},${r22(my + 0.05)} L${r22(mx + 1.4)},${r22(my + 1.3)} L${r22(mx - 1.4)},${r22(my + 1.4)} Z`, "#FFFFFF", 0.8) + L([mx - 1.4, my + 0.75], [mx + 1.4, my + 0.7], "#C9B8B0", 0.35);
        case "o":
          return E(mx, my + 0.7, 0.85, 1.05, K.mouth, 0.85);
        case "open":
          return P(`M${r22(mx - 1.1)},${r22(my + 0.3)} Q${mx},${r22(my - 0.1)} ${r22(mx + 1.1)},${r22(my + 0.3)} Q${mx},${r22(my + 1.4)} ${r22(mx - 1.1)},${r22(my + 0.3)} Z`, K.mouth, 0.8);
        case "press":
          return line(`M${r22(mx - 1.5)},${r22(my + 0.6)} Q${mx},${r22(my + 0.1)} ${r22(mx + 1.5)},${r22(my + 0.6)}`) + L([mx - 0.6, my + 1.5], [mx + 0.6, my + 1.5], K.skinS, 0.45);
        default:
          return line(`M${r22(mx - 1.4)},${r22(my + 0.35)} Q${r22(mx + 0.1)},${r22(my + 0.1)} ${r22(mx + 1.4)},${r22(my + 0.4)}`) + lip;
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
        if (x === "stream") s += `<g transform="translate(${r22(X2(18.1) - 18.1)} 0)">${P("M17.6,24.4 Q16.8,28 17.6,31.4 L18.6,31.2 Q18,28 18.6,24.6 Z", "#A9DCFF", 0.5)}</g><g transform="translate(${r22(X2(29.9) - 29.9)} 0)">${P("M29.4,24.6 Q30,28 29.4,31.2 L30.4,31.4 Q31.2,28 30.4,24.4 Z", "#A9DCFF", 0.5)}</g>`;
        if (x === "zz") s += n ? zee(37, 5.8, 2) + zee(39.4, 2.6, 2.4) : zee(36.4, 6.6, 1.8) + zee(39, 3.4, 2.2);
        if (x === "cold") s += E(X2(24.4), 25.6, 1.2, 0.8, "#9CC8E8", 0).replace("/>", ' opacity=".7"/>') + E(X2(16.8), 26.4, 2.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + E(X2(31.2), 26.4, 2.2 * (X2(31.2) - X2(24)) / 7.2, 1.1, "#9CC8E8", 0).replace("/>", ' opacity=".55"/>') + P("M9.6,17.6 q-0.8,1.2 0,2.4 q0.8,1.2 0,2.4 M7.8,18.6 q-0.6,0.9 0,1.8 M38.4,17.6 q0.8,1.2 0,2.4 q-0.8,1.2 0,2.4 M40.2,18.6 q0.6,0.9 0,1.8", "none", 0.6);
        if (x === "vein") {
          const a = n ? 0.6 : 0.5, b = n ? 2 : 1.7, cx = 39.6, cy = 7.4;
          const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r22(cx + i * a)},${r22(cy + j * b)} Q${r22(cx + i * a)},${r22(cy + j * a)} ${r22(cx + i * b)},${r22(cy + j * a)}`).join(" ");
          s += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
        }
      }
      return s;
    }
    __name(extras, "extras");
    var wind = /* @__PURE__ */ __name((a, b, fill, w, dur = "1.7s", begin = "0s") => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"><animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>`, "wind");
    function rides(x, y, k, K, sc = 1) {
      const o = x - k * (K.eyeRx * sc + 0.6);
      return `<path d="M${r22(o)},${r22(y - 0.6)} q${r22(-k * 0.7)},-0.1 ${r22(-k * 1)},-0.6 M${r22(o)},${r22(y + 0.3)} q${r22(-k * 0.7)},0.1 ${r22(-k * 1)},0.5" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".8"/><path d="M${r22(x - K.eyeRx * 0.7 * sc)},${r22(y + K.eyeRy + 0.85)} Q${x},${r22(y + K.eyeRy + 1.45)} ${r22(x + K.eyeRx * 0.7 * sc)},${r22(y + K.eyeRy + 0.85)}" fill="none" stroke="${K.skinS}" stroke-width="0.4" stroke-linecap="round" opacity=".7"/>`;
    }
    __name(rides, "rides");
    module.exports = { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides };
  }
});

// personnages/refonte/tissu.js
var require_tissu = __commonJS({
  "personnages/refonte/tissu.js"(exports, module) {
    var { r2: r22 } = require_troupe();
    var THREAD = "#EFE3C4";
    var seam = /* @__PURE__ */ __name((d, w = 0.45) => `<path d="${d}" fill="none" stroke="${THREAD}" stroke-width="${w}" stroke-dasharray=".9 .7" stroke-linecap="round"/>`, "seam");
    function suitOurlet(x0, x1, y0, yc, off, amp = 0) {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, u = 1 - t, x = x0 + (x1 - x0) * t;
        const y = u * u * y0 + 2 * u * t * yc + t * t * y0 - off + Math.sin(t * Math.PI * 7) * amp;
        pts.push(`${r22(x)},${r22(y)}`);
      }
      return "M" + pts.join(" L");
    }
    __name(suitOurlet, "suitOurlet");
    module.exports = { THREAD, seam, suitOurlet };
  }
});

// personnages/refonte/agathe_refonte.js
var require_agathe_refonte = __commonJS({
  "personnages/refonte/agathe_refonte.js"(exports, module) {
    var { P, E, L, clip, limb, arm, shoe, dechirure, r2: r22, OUT } = require_troupe();
    var cannelle = require_cannelle();
    var { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides } = require_visage();
    var { seam, suitOurlet } = require_tissu();
    var { fabriquerBras } = require_lorena_bras();
    var { jambe } = require_membres();
    var { fondre } = require_couleurs();
    var C = fondre({
      skin: "#E9B98F",
      skinS: "#C99472",
      lid: "#E0AC84",
      under: "#B98A78",
      nose: "#B97A58",
      hair: "#D9D4CC",
      hairS: "#A9A39A",
      hairH: "#F5F2EC",
      brow: "#5E554C",
      browW: 0.7,
      rim: "#9FE3DA",
      eye: "#2A1F1A",
      iris: "#7A5634",
      irisL: "#C9A06A",
      eyeRx: 1.75,
      eyeRy: 2.3,
      dress: "#A8553A",
      dressS: "#84402B",
      dressH: "#C46E4E",
      apron: "#F2E6D2",
      apronS: "#D8C8AE",
      stain: "#C9A27A",
      soot: "#4A4440",
      salt: "#FFF8E8",
      flour: "#FFFFFF",
      mud: "#6B5138",
      check: "#C8463A",
      towel: "#D9E4EE",
      towelS: "#4F78A6",
      patch: "#8D7A5A",
      wool: "#B9A57E",
      woolS: "#8E7B57",
      woolH: "#D8C8A0",
      wood: "#8A5A36",
      copper: "#C27C45",
      copperS: "#8F5530",
      copperH: "#EAA46C",
      strap: "#6B4226",
      strapS: "#4E2F1A",
      spoon: "#C9CED6",
      spoonS: "#9AA2AD",
      herb: "#6E9A4A",
      herbS: "#4E7434",
      cheek: "#EE8C80",
      mouth: "#7A3B30",
      cloth: "#E6D4AE",
      clothS: "#B8A27A"
    });
    var MARKS = { soot: 1, salt: 1, flour: 0, dirt: 0, apron: "torn", wisps: true, herbs: true, wrist: false, wet: false };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      const laine = c.tenue === "laine";
      return { ...K, coat: laine ? K.wool : K.dress, coatS: laine ? K.woolS : K.dressS, coatH: laine ? K.woolH : K.dressH, shirt: K.apron, shirtS: K.apronS, brass: K.copper };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_A = { ...EXPR, veille: X({ brow: [-1, 0.4, -0.6], lid: 0.24, tilt: -0.1, look: [0, 0.3], under: 0.55, mouth: "press" }) };
    function louche(K, a, b, tilt = 0) {
      return limb(a, b, 1.5, K.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], K.copperH, 0.5) + `<g transform="rotate(${tilt} ${r22(b[0])} ${r22(b[1])})">${E(b[0], b[1], 3.3, 2.6, K.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, K.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, K.copperH, 0)}<path d="M${r22(b[0] + 1.2)},${r22(b[1] + 1.4)} q0.8,-0.2 1.1,-1" fill="none" stroke="${K.copperS}" stroke-width="0.5"/></g>`;
    }
    __name(louche, "louche");
    var DRESS = /* @__PURE__ */ __name((sway) => `M15.2,33 Q24,30.2 32.8,33 Q${r22(37 + sway)},42 ${r22(37.6 + sway)},53.6 Q${r22(24 + sway)},57.2 ${r22(10.4 + sway)},53.6 Q${r22(11 + sway)},42 15.2,33 Z`, "DRESS");
    function basDechire(xr, xl, y, qx, qy, seed, mir) {
      if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
      const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
      const pts = m.d.split("L").map((s) => s.trim()).filter(Boolean);
      pts.pop();
      return { d: [...pts.reverse(), `${xl},${y}`].map((p) => `L${p}`).join(" "), tips: m.tips };
    }
    __name(basDechire, "basDechire");
    var carreaux = /* @__PURE__ */ __name((d, K) => `<path d="${d}" fill="none" stroke="${K.check}" stroke-width="1.5"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray=".75 .75"/><path d="${d}" fill="none" stroke="${K.check}" stroke-width="0.5" opacity=".6"/>`, "carreaux");
    function corps(c, ctx, K, M) {
      const view = ctx.view, u = c.uid, t = c.tenue || "robe", mir = !!c.miroir, dos = view === "ne";
      const sway = ctx.walk ? r22(ctx.ph * 0.25) : 0;
      const k = view === "se" ? -2 : 0, axe = 24 + k;
      const d = DRESS(sway);
      const hem = /* @__PURE__ */ __name((off) => suitOurlet(10.4 + sway, 37.6 + sway, 53.6, 57.2, off, 0.22), "hem");
      const shadeX = view === "se" ? 27.6 : 29.4;
      let s = P(d, K.dress) + clip(`${u}d`, d, `<rect x="${shadeX}" y="30" width="12" height="30" fill="${K.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${K.dressS}"/><rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${K.dressH}"/><rect x="${r22(37 + sway)}" y="38" width="1.3" height="15" fill="${K.rim}" opacity=".6"/><path d="M15.6,41 Q14.6,47 14.2,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/><path d="M32.6,41 Q33.6,47 34,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/>` + (M.salt ? `<path d="${hem(2.2)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r22(0.7 * M.salt)}"/><path d="${hem(4.4)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r22(0.35 * M.salt)}"/>` : "") + (M.dirt ? `<path d="${hem(2.6)} L40,60 L8,60 Z" fill="${K.mud}" opacity="${r22(0.3 * M.dirt)}"/>` : "") + (M.flour ? [[12.9, 50.6, -20], [35.1, 50.4, 20]].map(([x, y, a]) => `<path d="M${r22(x - 1.2 + sway)},${y} q0.6,-1.6 1.4,-0.2 q0.5,-1.2 1,0.4 q-0.2,1.6 -1.2,1.4 q-1,0.2 -1.2,-1.6 Z" fill="${K.flour}" opacity="${r22(0.7 * M.flour)}" transform="rotate(${a} ${r22(x + sway)} ${y})"/>`).join("") : "")) + P(d, "none");
      if (t === "laine") {
        const G = "M15.2,33 Q24,30.2 32.8,33 L34.2,44.4 Q24,46.6 13.8,44.4 Z";
        const cotes = [16, 17.6, 19.2, 20.8, 22.4, 25.6, 27.2, 28.8, 30.4, 32].map((x) => `<path d="M${x},32 L${r22(x + (x - 24) * 0.06)},46" stroke="${OUT}" stroke-width="0.35" opacity=".2"/>`).join("");
        s += P(G, K.wool) + clip(`${u}g`, G, `<rect x="${shadeX}" y="30" width="12" height="18" fill="${K.woolS}"/>` + cotes + `<path d="${suitOurlet(13.8, 34.2, 44.4, 46.6, 0.9)}" fill="none" stroke="${K.woolS}" stroke-width="1.8"/><path d="${suitOurlet(13.8, 34.2, 44.4, 46.6, 0.9)}" fill="none" stroke="${K.woolH}" stroke-width="1.8" stroke-dasharray=".4 .6" opacity=".7"/>`) + P(G, "none");
        if (!dos) s += P(`M${axe},33.2 L${axe},45.6`, "none", 0.6);
      }
      if (dos) {
        if (t === "cuisine") s += `<path d="M18.2,32.6 L29.6,40.4 M29.8,32.6 L18.4,40.4" stroke="${OUT}" stroke-width="1.9" stroke-linecap="round"/><path d="M18.2,32.6 L29.6,40.4 M29.8,32.6 L18.4,40.4" stroke="${K.apron}" stroke-width="1" stroke-linecap="round"/>`;
        s += P("M17,40.4 Q24,41.6 31,40.4", "none", 0.8);
        s += P("M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z", K.apron, 0.9) + P("M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z", K.apron, 0.9);
        s += P("M23.4,41.6 L21.6,47.4 L23.4,47 Z", K.apron, 0.8) + P("M24.6,41.6 L26.4,47.4 L24.6,47 Z", K.apron, 0.8) + E(24, 41, 1.3, 1.1, K.apronS, 0.8);
        if ((ctx.pose !== "action" || c.geste) && !c.sansLouche) s += reflet(24, louche(K, [33, 50.4], [11.6, 26.2], 25), mir);
        return s + (ctx.seatDy ? "" : mouillee(M, 53.6));
      }
      const bavette = t === "cuisine";
      const haut = bavette ? `M${20.4 + k},33.6 L${27.6 + k},33.6 L${28.4 + k},40.2` : `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2`;
      const gauche = bavette ? `${19.6 + k},40.2` : `${17.6 + k},40.2`;
      const tb = M.apron === "torn" ? basDechire(r22(33 + k + sway), r22(15 + k + sway), 53.4, r22(24 + k + sway), 55.6, 6, mir) : null;
      const ap = `${haut} Q${r22(33.2 + k + sway)},47 ${r22(33 + k + sway)},53.4 ` + (tb ? tb.d : `Q${r22(24 + k + sway)},55.6 ${r22(15 + k + sway)},53.4`) + ` Q${r22(14.8 + k + sway)},47 ${gauche} Z`;
      const taches = E(21 + k, 46.6, 1.3, 0.85, K.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, K.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, K.stain, 0);
      const suie = M.soot ? `<path d="M${25.6 + k},49.2 q1.4,-0.6 2.6,0.4 q-0.6,1.2 -1.8,1 q-1,-0.2 -0.8,-1.4 Z" fill="${K.soot}" opacity="${r22(0.55 * M.soot)}"/><path d="M${26.2 + k},48.4 l0.6,-1.4 M${27.2 + k},48.6 l0.7,-1.2" stroke="${K.soot}" stroke-width="0.5" opacity="${r22(0.45 * M.soot)}"/>` : "";
      const farine = M.flour ? `<ellipse cx="${20.4 + k}" cy="44.6" rx="2.2" ry="1.4" fill="${K.flour}" opacity="${r22(0.55 * M.flour)}"/><ellipse cx="${23 + k}" cy="51" rx="1.6" ry="0.9" fill="${K.flour}" opacity="${r22(0.45 * M.flour)}"/><ellipse cx="${28.4 + k}" cy="45.4" rx="1" ry="0.7" fill="${K.flour}" opacity="${r22(0.4 * M.flour)}"/>` : "";
      const selT = M.salt ? `<path d="${suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 1.8, 0.2)}" fill="none" stroke="${K.salt}" stroke-width="0.55" opacity="${r22(0.6 * M.salt)}"/>` : "";
      const reprise = M.apron === "mended" ? seam(suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 0.8)) : "";
      const liseres = bavette ? carreaux(suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 0.9), K) + carreaux(`M${20.8 + k},34.4 L${27.2 + k},34.4`, K) : "";
      s += P(ap, K.apron) + clip(`${u}a`, ap, `<rect x="${28 + k}" y="30" width="8" height="28" fill="${K.apronS}"/>` + reflet(axe, taches + suie, mir) + farine + selT + reprise + liseres) + P(ap, "none");
      if (tb) for (const [x, y] of tb.tips) s += P(`M${r22(x)},${r22(y - 0.2)} q0.45,0.8 -0.1,1.7`, "none", 0.45);
      if (M.apron === "mended") s += reflet(axe, P(`M${17.8 + k},49 L${21.2 + k},48.8 L${21.4 + k},52 L${18 + k},52.2 Z`, K.patch, 0.55) + seam(`M${18.3 + k},49.5 L${20.7 + k},49.35 L${20.85 + k},51.55 L${18.45 + k},51.7 Z`, 0.35), mir);
      s += P(`M${gauche.split(",")[0]},40.2 L${r22(30.4 + k - (bavette ? 2 : 0))},40.2`, "none", 0.8) + seam(`M${18 + k + (bavette ? 2 : 0)},41 L${30 + k - (bavette ? 2 : 0)},41`, 0.35);
      if (bavette) s += `<path d="M${20.6 + k},33.8 L${19.4 + k},31.8 M${27.4 + k},33.8 L${28.6 + k},31.8" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${20.6 + k},33.8 L${19.4 + k},31.8 M${27.4 + k},33.8 L${28.6 + k},31.8" stroke="${K.apron}" stroke-width="0.8" stroke-linecap="round"/>`;
      if (bavette) s += reflet(axe, `<g transform="rotate(8 ${18.8 + k} 41)">${P(`M${17 + k},40 L${20.4 + k},40 L${20.2 + k},47.4 Q${18.6 + k},47.9 ${16.8 + k},47.2 Z`, K.towel, 0.6)}<rect x="${17.1 + k}" y="44.4" width="3.2" height="0.7" fill="${K.towelS}"/><rect x="${17.1 + k}" y="45.6" width="3.2" height="0.45" fill="${K.towelS}"/>${P(`M${16.8 + k},40.4 Q${18.6 + k},41.6 ${20.6 + k},40.4`, K.towel, 0.55)}</g>`, mir);
      const herbes = M.herbs ? `<path d="M${26 + k},44 Q${26.4 + k},41.8 ${27.6 + k},40" fill="none" stroke="${K.herbS}" stroke-width="0.6"/>` + [[27.4, 40.4, 40], [26.2, 41.8, -30], [26.8, 42.9, 35]].map(([x, y, rr]) => `<g transform="translate(${x + k} ${y}) rotate(${rr})">${P("M0,0 Q0.9,1 0,2.2 Q-0.9,1 0,0 Z", K.herb, 0.4)}</g>`).join("") : "";
      s += reflet(axe, herbes, mir) + P(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, K.apron, 0.8) + seam(`M${21.3 + k},44.3 L${26.7 + k},44.3`, 0.32);
      s += reflet(24, limb([31.4, 33.8], [16.8, 47.2], 1.15, K.strap) + `<path d="M31,34.4 L17.2,46.6" fill="none" stroke="${K.strapS}" stroke-width="0.35" stroke-dasharray=".7 .6"/>`, mir);
      return s + (ctx.seatDy ? "" : mouillee(M, 53.6));
    }
    __name(corps, "corps");
    var mouillee = /* @__PURE__ */ __name((M, hy) => M.wet ? [[14.4, 0], [24.6, 0.55], [34, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 2.4)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 2.4)};${r22(hy + 8)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouillee");
    function pied(c, x, y, dir, tilt) {
      const M = marks(c), K = pal(c);
      let s = "";
      const a = r22(x - c.legW / 2 + 0.55), b = r22(x + c.legW / 2 - 0.55);
      if (M.dirt) s += `<path d="M${a},${r22(y + 0.6)} L${a},${r22(y - 1.2)} Q${r22(x - 1)},${r22(y - 2.4)} ${r22(x - 0.2)},${r22(y - 1.4)} Q${r22(x + 0.8)},${r22(y - 0.6)} ${b},${r22(y - 1.9)} L${b},${r22(y + 0.6)} Z" fill="${K.mud}" opacity="${r22(0.5 * M.dirt)}"/>`;
      s += shoe(c, x, y, dir, tilt);
      if (M.dirt) s += `<path d="M${r22(x - 2.8)},${r22(y + 3.2)} Q${r22(x - 1)},${r22(y + 2.2)} ${r22(x + 0.6)},${r22(y + 3.6)} Q${r22(x - 1)},${r22(y + 4.6)} ${r22(x - 2.8)},${r22(y + 3.2)} Z" fill="${K.mud}" opacity="${r22(0.8 * M.dirt)}"/>` + E(x + 1.6, y + 1.4, 0.42, 0.42, K.mud, 0).replace("/>", ` opacity="${r22(0.8 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: {
        X: /* @__PURE__ */ __name((x) => x, "X"),
        rk: [1, 1],
        dx: 0,
        mouth: 24,
        ear: null,
        face: "M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.6 30.6,32.6 24,32.6 C17.4,32.6 12.4,28.6 12.4,22.4 Z",
        back: "M12,22 Q11,9 24,9 Q37,9 36,22 Q36,27 33.6,28 L14.4,28 Q12,27 12,22 Z",
        bangs: "M12.6,19.4 Q12.6,9.8 24,9.6 Q35.4,9.8 35.4,19.4 Q32.6,13.8 25,12.8 L24,14.2 L23,12.8 Q15.4,13.8 12.6,19.4 Z"
      },
      se: {
        X: /* @__PURE__ */ __name((x) => r22(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), "X"),
        rk: [0.95, 0.82],
        dx: -1.6,
        mouth: 21,
        ear: [35, 23.4],
        face: "M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.6 29,32.6 22.6,32.6 C16.2,32.6 11.3,28.6 11.3,22.4 Z",
        back: "M12.6,22 Q11.4,9 24,9 Q37.4,9 36.4,22 Q36.4,27 33.8,28 L15,28 Q12.6,27 12.6,22 Z",
        bangs: "M11.8,19.4 Q12,9.8 21.6,9.6 Q35,9.8 35.2,19.4 Q32,13.8 22.6,12.8 L21.6,14.2 L20.6,12.8 Q14.6,13.8 11.8,19.4 Z"
      }
    };
    var meche = /* @__PURE__ */ __name((K, a, b, begin) => wind(a, b, "none", 1.7, "1.9s", begin) + wind(a, b, "none", 0.7, "1.9s", begin).replace(`stroke="${OUT}"`, `stroke="${K.hair}"`), "meche");
    var cuillere = /* @__PURE__ */ __name((K, dy = 0) => limb([26.6, 9.2 + dy], [31.2, 4 + dy * 0.7], 1.1, K.spoon) + `<g transform="rotate(40 32 ${r22(3.2 + dy * 0.7)})">${E(32, 3.2 + dy * 0.7, 1.3, 1.75, K.spoon, 0.9)}${E(31.7, 2.9 + dy * 0.7, 0.5, 0.8, "#F2F4F7", 0)}</g>`, "cuillere");
    function tete(c, ctx) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return teteDeDos(c, ctx, K, M, mir, id);
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X;
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_A.cligne : EXPR_A[name] || EXPR_A.veille;
      let s = reflet(24, cuillere(K), mir);
      s += E(24, 8.6, 5.4, 4.3, K.hair) + P("M20.4,8.2 Q24,5.6 27.6,8.2", "none", 0.6) + P("M21.4,10.4 Q24,8.8 26.8,10.2", "none", 0.45) + L([20.6, 7.2], [22.8, 6.1], K.hairH, 1);
      if (M.wisps) s += reflet(24, meche(K, "M20.2,7.6 Q17.2,6.2 15.8,8.4", "M20.2,7.6 Q17,6.8 16,9.4", "0s"), mir);
      s += P(V.back, K.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24" width="32" height="6" fill="${K.hairS}"/><path d="M34.6,12 Q37.6,19 35.8,27 L39,27 L39,12 Z" fill="${K.rim}" opacity=".8"/>`) + P(V.back, "none");
      if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r22(V.ear[0] + 0.1)},${r22(V.ear[1] - 1)} Q${r22(V.ear[0] + 0.8)},${V.ear[1]} ${r22(V.ear[0] + 0.1)},${r22(V.ear[1] + 1)}`, "none", 0.5);
      s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${V.bangs}" fill="${K.skinS}" transform="translate(0 1.4)"/><g transform="translate(${V.dx} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".5"/><path d="M31.8,13.6 Q35,21.6 31.2,31.4 L33.6,31.4 Q37,21.6 33.6,13.6 Z" fill="${K.skinS}" opacity=".45"/></g>` + E(Xv(16.4), 26.8, 2.5 * V.rk[0], 1.5, K.cheek, 0).replace("/>", ' opacity=".6"/>') + E(Xv(31.6), 26.8, 2.5 * V.rk[1], 1.5, K.cheek, 0).replace("/>", ' opacity=".6"/>')) + P(V.face, "none");
      s += P(V.bangs, K.hair) + clip(`${id}b`, V.bangs, `<path d="M11,17.6 Q24,14 37,17.6 L37,20 L11,20 Z" fill="${K.hairS}" opacity=".5"/>`) + P(V.bangs, "none") + L([Xv(15.8), 12.6], [Xv(21), 10.6], K.hairH, 1.2);
      if (M.wisps) s += reflet(Xv(24), meche(K, `M${Xv(17.4)},14.4 Q${Xv(15.2)},16.4 ${Xv(15.4)},19.6`, `M${Xv(17.4)},14.4 Q${Xv(14.8)},16.8 ${Xv(15)},20.2`, "-.6s"), mir);
      if (M.soot) s += reflet(Xv(24), `<ellipse cx="${Xv(17.4)}" cy="28.6" rx="1.7" ry="0.75" fill="${K.soot}" opacity="${r22(0.45 * M.soot)}" transform="rotate(-12 ${Xv(17.4)} 28.6)"/><ellipse cx="${Xv(19.2)}" cy="29.3" rx="0.45" ry="0.35" fill="${K.soot}" opacity="${r22(0.4 * M.soot)}"/><ellipse cx="${Xv(27.6)}" cy="15.6" rx="1.3" ry="0.55" fill="${K.soot}" opacity="${r22(0.35 * M.soot)}" transform="rotate(8 ${Xv(27.6)} 15.6)"/>`, mir);
      if (M.flour) s += `<ellipse cx="${Xv(29.6)}" cy="17.2" rx="1.2" ry="0.5" fill="${K.flour}" opacity="${r22(0.6 * M.flour)}"/>`;
      s += ctx.view === "se" ? P("M21.2,24.2 Q19.4,25.6 21.4,26", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) : P("M23.1,25.4 Q24,26.4 24.9,25.4", "none", 0.8).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.35, 0.25, "#F6D3B4", 0);
      s += rides(Xv(19.4), 22.8, 1, K, V.rk[0]) + rides(Xv(28.6), 22.8, -1, K, V.rk[1]);
      s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
      s += brow(Xv(19.4), 18.4, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.4, -1, ex.browR || ex.brow, false, V.rk[1], K);
      s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return s;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[28.6, 11, 0], [15.6, 20.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    function teteDeDos(c, ctx, K, M, mir, id) {
      const back = "M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.8,30 35.8,32.8 Q32.6,34 28.6,32.8 Q27,28.4 24,28.4 Q21,28.4 19.4,32.8 Q15.4,34 12.2,32.8 Q11.2,30 12,22 Z";
      let s = P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.6" cy="19.8" rx="13.8" ry="12.4" fill="${K.hair}"/><path d="M35.2,12 Q38,20 35.6,32 L39,32 L39,12 Z" fill="${K.rim}" opacity=".8"/>`) + P(back, "none");
      s += P("M16.6,31.6 Q15.8,21.4 20.6,14.4", "none", 0.6) + P("M24,26.4 Q23.4,21 24,15.4", "none", 0.6) + P("M31.4,31.6 Q32.2,21.4 27.4,14.4", "none", 0.6);
      const curl = `<path d="M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31" fill="none" stroke="${K.hair}" stroke-width="0.7" stroke-linecap="round"/>`;
      s += reflet(24, curl, mir) + L([14.6, 17.6], [16.8, 13.6], K.hairH, 1.2);
      s += reflet(24, cuillere(K, 0.4), !mir);
      s += E(24, 10.4, 5.4, 4.4, K.hair) + P("M20.4,10.4 Q24,7.6 27.6,10.4", "none", 0.6) + L([21, 8.8], [23.6, 7.9], K.hairH, 1.1);
      if (M.wisps) s += reflet(24, meche(K, "M27.6,10.6 Q30.6,9.6 31.8,12", "M27.6,10.6 Q30.8,10.4 31.4,13.2", "0s") + meche(K, "M33.6,22.4 Q35.6,25.4 34.6,28.6", "M33.6,22.4 Q36,25.8 35,29.2", "-.6s"), mir);
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_A[ALIAS[ctx.expr] || ctx.expr] || EXPR_A.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var agathe = {
      ...cannelle,
      name: "Agathe",
      uid: "ag",
      teintes: [C.hair, C.dress, C.apron, C.copper],
      sleeve: C.dress,
      cuff: null,
      sleeves: "roll",
      foot: pied,
      // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      // ses manches (lorena_bras.js) : retroussées aux coudes (en laine, longues, au bord-côte), à l'ombre du côté droit
      bras: fabriquerBras({ pal, marks }),
      // la louche dans le dos (de face et de trois quarts : le cuilleron sur son épaule gauche), sauf quand elle la tient
      backItems(c, ctx) {
        if (ctx.view === "ne" || ctx.pose === "action" && !c.geste || c.sansLouche) return "";
        return reflet(24, louche(pal(c), [15, 50], [37.6, 26.4], -25), !!c.miroir);
      },
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      neck(c, ctx) {
        const K = pal(c);
        if (ctx.view === "ne") return P("M19.8,25 L28.2,25 L28.4,31.95 Q24,31.25 19.6,31.95 Z", K.skinS, 0) + P("M19.6,31.95 Q24,31.25 28.4,31.95", "none");
        return P("M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z", c.tenue === "laine" ? K.woolH : K.apron, 0.9);
      },
      head(c, ctx) {
        return tete(c, ctx);
      },
      // le salut et l'action (elle brandit la louche, décidée : on ne touche pas au camp) : les gestes de cannelle.js, avec sa
      // louche cabossée
      pose(ctx) {
        const a = cannelle.pose.call(this, ctx);
        if (ctx.pose === "salut" || !a) return a;
        const K = pal(this), n = ctx.n;
        const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6], bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
        return { ...a, expr: "decidee", right: louche(K, [hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand) };
      }
    };
    module.exports = { agathe, C, MARKS, EXPR: EXPR_A, pal, marks, louche, reflet };
  }
});

// personnages/refonte/agathe_tenues.js
var require_agathe_tenues = __commonJS({
  "personnages/refonte/agathe_tenues.js"(exports, module) {
    var { castaway, fade } = require_naufrage();
    var { SPECS } = require_naufrages();
    var { agathe, C } = require_agathe_refonte();
    var { r2: r22 } = require_troupe();
    var { fondre, fondu } = require_couleurs();
    var PALETTES = fondre({
      cannelle: { nom: "Cannelle", dress: C.dress, dressS: C.dressS, dressH: C.dressH },
      prune: { nom: "Prune", dress: "#7E4A62", dressS: "#5E3348", dressH: "#A26F87" },
      olive: { nom: "Olive", dress: "#7D7A3E", dressS: "#5C5A2A", dressH: "#A6A262" },
      indigo: { nom: "Indigo", dress: "#3F5578", dressS: "#2C3D59", dressH: "#6F86AA" },
      ocre: { nom: "Ocre", dress: "#B8853A", dressS: "#8C6226", dressH: "#DCAA60" },
      brique: { nom: "Brique", dress: "#9C3E34", dressS: "#742A23", dressH: "#C2625A" }
    });
    var TENUES = {
      robe: { nom: "La robe et son tablier", tenue: "robe", palette: "cannelle", sleeves: "roll" },
      cuisine: { nom: "Le grand tablier de cuisine", tenue: "cuisine", palette: "cannelle", sleeves: "roll" },
      // le gilet de laine : manches longues jusqu'au poignet (lorena_bras.js : le poignet et son bouton)
      laine: { nom: "Le gilet de laine", tenue: "laine", palette: "cannelle", sleeves: null }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, des actes plus tard", marks: { soot: 0, salt: 0, flour: 0, dirt: 0, apron: "clean", wisps: false, herbs: true } },
      poussiere: { nom: "Un peu sale", quand: "une journée en cuisine", marks: { soot: 0.6, salt: 0, flour: 1, dirt: 0.3, apron: "clean", wisps: true, herbs: true } },
      rafistolee: { nom: "Rafistolée", quand: "recousue au camp", marks: { soot: 0.3, salt: 0.3, flour: 0, dirt: 0.25, apron: "mended", wisps: true, herbs: true } },
      rescapee: { nom: "Rescapée", quand: "les premiers jours", marks: { soot: 1, salt: 1, flour: 0, dirt: 0.5, apron: "torn", wisps: true, herbs: true } },
      naufragee: { nom: "Naufragée", quand: "sur les rochers, deux nuits à regarder le feu", marks: { soot: 0.5, salt: 1, flour: 0, dirt: 0.3, apron: "torn", wisps: true, herbs: false }, naufrage: true },
      trempee: { nom: "Trempée", quand: "sous l'averse, au bord de l'eau", marks: { soot: 0.3, salt: 0.4, flour: 0, dirt: 0.4, apron: "torn", wisps: true, herbs: true, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["dress", "dressS", "dressH", "apron", "apronS", "wool", "woolS", "woolH", "hair", "hairS", "hairH", "towel", "stain"];
    var AXE_TABLIER = { front: 24, se: 22, ne: 24 };
    var retourner = /* @__PURE__ */ __name((parVue, tablier) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map((it) => {
      const axe = tablier(it) ? AXE_TABLIER[v] : 24;
      return [Math.round((2 * axe - it[0]) * 100) / 100, ...it.slice(1)];
    })])), "retourner");
    function habiller(tenueId = "robe", paletteId = null, etatId = "rescapee") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      let pal = { ...pp };
      delete pal.nom;
      if (E.sombre) pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(pal[k] || C[k], E.sombre)]));
      const K = { ...C, ...pal };
      const laine = T2.tenue === "laine";
      const c = {
        ...agathe,
        uid: `ag${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        sleeves: T2.sleeves,
        sleeve: laine ? K.wool : K.dress,
        teintes: [K.hair, K.dress, K.apron, K.copper]
      };
      if (!E.naufrage) return c;
      const teintes = ["dress", "dressS", "dressH", "apron", "apronS", "wool", "woolS", "woolH"];
      const salee = Object.fromEntries(teintes.map((k) => [k, fade(K[k], 0.6)]));
      c.pal = { ...pal, ...salee };
      c.sleeve = laine ? salee.wool : salee.dress;
      c.teintes = [K.hair, salee.dress, salee.apron, K.copper];
      const S = SPECS.Cannelle, dS = salee.dressS;
      const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, col === fondu("#84402B") ? dS : salee.apron, ...r])]));
      const spec = { ...S, sway: /* @__PURE__ */ __name((ctx) => ctx.walk ? r22(ctx.ph * 0.25) : 0, "sway"), fade: [], k: 0.6, tatters, holes: Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, w]) => [x, y, w, assombrir(dS, 0.8)])])), head: void 0 };
      const droite = castaway(c, spec);
      const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters, (it) => it[2] === salee.apron), holes: retourner(spec.holes, () => false), rips: retourner(spec.rips, () => true) });
      return { ...droite, leg: "#E8B88E", body: /* @__PURE__ */ __name((cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), "body") };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/agathe_gestes.js
var require_agathe_gestes = __commonJS({
  "personnages/refonte/agathe_gestes.js"(exports, module) {
    var { OUT, E, P, L, limb, r2: r22, arm } = require_troupe();
    var { paume } = require_gestes();
    var { pal, louche } = require_agathe_refonte();
    var FONTE = "#4A3A33";
    var FONTE_S = "#2C221E";
    var FONTE_H = "#6A5248";
    var BORD = "#5E4A40";
    var SOUPE = "#D9A441";
    var SOUPE_S = "#B9832C";
    var SOUPE_H = "#F2CF7A";
    var BOIS = "#A8743F";
    var BOIS_S = "#7E522A";
    var BOIS_H = "#C9945C";
    var PIERRE = "#B4AEA2";
    var PIERRE_S = "#8F877A";
    var GRAIN = "#E3BE5A";
    function volute(x, y, n, k = 1) {
      const up = n % 4 * 1.3, d = `M${r22(x)},${r22(y - up)} q${r22(1.2 * k)},-1.2 0,-2.4 q${r22(-1.2 * k)},-1.2 0,-2.4`;
      const op = r22([0.95, 0.85, 0.65, 0.4][n % 4]);
      return `<g opacity="${op}"><path d="${d}" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round"/></g>`;
    }
    __name(volute, "volute");
    function marmite(x, y, w, n, uid, entree = null) {
      const ry = w * 0.3, h = w * 0.95, by = y + h;
      const corps = `M${r22(x - w)},${r22(y)} C${r22(x - w)},${r22(y + h * 0.95)} ${r22(x - w * 0.45)},${r22(by)} ${r22(x)},${r22(by)} C${r22(x + w * 0.45)},${r22(by)} ${r22(x + w)},${r22(y + h * 0.95)} ${r22(x + w)},${r22(y)} Z`;
      const f = n % 2 ? [[-1.6, 2.6], [0.4, 3.4], [2, 2.2]] : [[-1.8, 2.2], [0.2, 3], [1.8, 2.8]];
      let s = f.map(([dx, hh]) => P(`M${r22(x + dx - 1.1)},${r22(by + 2.4)} Q${r22(x + dx - 1)},${r22(by + 2.4 - hh * 0.6)} ${r22(x + dx)},${r22(by + 2.4 - hh)} Q${r22(x + dx + 1)},${r22(by + 2.4 - hh * 0.6)} ${r22(x + dx + 1.1)},${r22(by + 2.4)} Z`, "#FF9A3C", 0.6) + P(`M${r22(x + dx - 0.5)},${r22(by + 2.4)} Q${r22(x + dx - 0.4)},${r22(by + 2.4 - hh * 0.4)} ${r22(x + dx)},${r22(by + 2.4 - hh * 0.6)} Q${r22(x + dx + 0.4)},${r22(by + 2.4 - hh * 0.4)} ${r22(x + dx + 0.5)},${r22(by + 2.4)} Z`, "#FFD25A", 0)).join("");
      s += [-1, 1].map((k) => E(x + k * w * 0.62, by + 1.6, w * 0.34, 1.6, PIERRE, 0.8) + E(x + k * w * 0.62 + w * 0.12, by + 2.1, w * 0.2, 0.8, PIERRE_S, 0)).join("");
      s += [-1, 1].map((k) => `<path d="M${r22(x + k * w)},${r22(y + 1)} q${r22(k * 1.6)},0.2 ${r22(k * 1.2)},1.8 q${r22(-k * 0.4)},0.8 ${r22(-k * 1.2)},0.5" fill="none" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="M${r22(x + k * w)},${r22(y + 1)} q${r22(k * 1.6)},0.2 ${r22(k * 1.2)},1.8 q${r22(-k * 0.4)},0.8 ${r22(-k * 1.2)},0.5" fill="none" stroke="${FONTE_H}" stroke-width="0.6" stroke-linecap="round"/>`).join("");
      s += P(corps, FONTE) + `<clipPath id="${uid}mc"><path d="${corps}"/></clipPath><g clip-path="url(#${uid}mc)"><rect x="${r22(x + w * 0.35)}" y="${r22(y - 1)}" width="${r22(w)}" height="${r22(h + 2)}" fill="${FONTE_S}"/><path d="M${r22(x - w * 0.72)},${r22(y + 1.2)} Q${r22(x - w * 0.7)},${r22(y + h * 0.6)} ${r22(x - w * 0.4)},${r22(y + h * 0.82)}" fill="none" stroke="${FONTE_H}" stroke-width="0.9" stroke-linecap="round"/><ellipse cx="${r22(x)}" cy="${r22(by + 0.4)}" rx="${r22(w * 0.6)}" ry="1.4" fill="#FF9A3C" opacity="${n % 2 ? 0.4 : 0.3}"/></g>` + P(corps, "none");
      s += E(x, y, w + 0.5, ry + 0.5, BORD, 0.9) + E(x, y + 0.15, w - 0.5, ry - 0.25, SOUPE, 0.5) + `<path d="M${r22(x - w + 0.7)},${r22(y)} Q${r22(x)},${r22(y - ry + 0.3)} ${r22(x + w - 0.7)},${r22(y)} Q${r22(x)},${r22(y - ry + 1)} ${r22(x - w + 0.7)},${r22(y)} Z" fill="${SOUPE_S}"/>` + E(x - w * 0.35, y + 0.5, w * 0.22, 0.35, SOUPE_H, 0);
      const bulles = n % 2 ? [[0.3, 0.2, 0.55], [-0.45, 0.5, 0.35]] : [[0.5, 0.6, 0.4], [-0.2, 0.3, 0.5]];
      s += bulles.map(([dx, dy, rr]) => E(x + dx * w, y + dy, rr, rr * 0.8, SOUPE_H, 0.35)).join("");
      if (entree) s += E(entree[0], entree[1], 1.5, 0.5, "none", 0.45);
      return s;
    }
    __name(marmite, "marmite");
    var manche = /* @__PURE__ */ __name((K, h, e) => limb([h[0] + (h[0] - e[0]) * 0.12, h[1] + (h[1] - e[1]) * 0.12], e, 1.5, K.copper) + L([h[0], h[1]], [h[0] + (e[0] - h[0]) * 0.6, h[1] + (e[1] - h[1]) * 0.6], K.copperH, 0.5), "manche");
    function mancheDevant(K, h, e, y0) {
      const t = (y0 - h[1]) / (e[1] - h[1]);
      if (!(t > 0 && t < 1)) return "";
      const q = [h[0] + (e[0] - h[0]) * t, h[1] + (e[1] - h[1]) * t];
      return limb(q, e, 1.5, K.copper);
    }
    __name(mancheDevant, "mancheDevant");
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin), "poing");
    function bol(x, y, plein, n) {
      const d = `M${r22(x - 3.4)},${r22(y)} Q${r22(x - 3.2)},${r22(y + 3.4)} ${r22(x)},${r22(y + 3.5)} Q${r22(x + 3.2)},${r22(y + 3.4)} ${r22(x + 3.4)},${r22(y)} Z`;
      return P(d, BOIS, 0.8) + P(`M${r22(x + 1)},${r22(y + 0.4)} Q${r22(x + 2.6)},${r22(y + 2.8)} ${r22(x + 0.4)},${r22(y + 3.3)} Q${r22(x + 3)},${r22(y + 3)} ${r22(x + 3.2)},${r22(y + 0.4)} Z`, BOIS_S, 0) + L([x - 2.6, y + 1], [x - 2, y + 2.4], BOIS_H, 0.6) + E(x, y, 3.5, 0.95, BOIS_H, 0.8) + (plein ? E(x, y + 0.1, 2.8, 0.6, SOUPE, 0.4) + E(x - 0.8, y, 0.8, 0.22, SOUPE_H, 0) : E(x, y + 0.15, 2.8, 0.6, BOIS_S, 0)) + (plein ? volute(x + 1, y - 0.8, n, 1) : "");
    }
    __name(bol, "bol");
    var grains = /* @__PURE__ */ __name((pts) => pts.map(([x, y, a]) => `<ellipse cx="${r22(x)}" cy="${r22(y)}" rx="0.55" ry="0.38" fill="${GRAIN}" stroke="${OUT}" stroke-width="0.3" transform="rotate(${a} ${r22(x)} ${r22(y)})"/>`).join(""), "grains");
    function giron(c, x, y, k = 1) {
      const K = pal(c);
      const d = `M${r22(x - 0.6 * k)},${r22(y - 1)} Q${r22(x + 4.4 * k)},${r22(y - 2.4)} ${r22(x + 8.4 * k)},${r22(y - 0.6)} Q${r22(x + 7.8 * k)},${r22(y + 3.6)} ${r22(x + 3.6 * k)},${r22(y + 3.8)} Q${r22(x + 0.4 * k)},${r22(y + 3)} ${r22(x - 0.6 * k)},${r22(y - 1)} Z`;
      return P(d, K.apron, 0.8) + P(`M${r22(x + 4 * k)},${r22(y + 3.6)} Q${r22(x + 7.4 * k)},${r22(y + 3.2)} ${r22(x + 8.2 * k)},${r22(y - 0.4)} Q${r22(x + 6.4 * k)},${r22(y + 1.6)} ${r22(x + 4 * k)},${r22(y + 3.6)} Z`, K.apronS, 0) + E(x + 4.2 * k, y - 1.3, 3.2, 0.7, K.apronS, 0.5) + grains([[x + 3 * k, y - 1.5, 20], [x + 4.6 * k, y - 1.2, -30], [x + 5.8 * k, y - 1.6, 60]]) + P(`M${r22(x + 1.6 * k)},${r22(y + 0.4)} Q${r22(x + 3.4 * k)},${r22(y + 1.6)} ${r22(x + 4.4 * k)},${r22(y + 3.4)}`, "none", 0.4);
    }
    __name(giron, "giron");
    function touiller({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), o = [[1.6, 0], [0, 0.7], [-1.6, 0], [0, -0.6]][n % 4];
      if (view === "ne") {
        const w = n % 2 ? 0.5 : 0;
        return {
          expr: "veille",
          left: "",
          right: "",
          // (derrière le buste : l'avant-bras, devant elle, est caché ; les coudes sortent sur les côtés, celui qui touille va
          // et vient)
          under: arm(this, a, [a[0] + 2.4, a[1] + 9], [a[0] - 6, a[1] + 5.8]) + arm(this, b, [b[0] - 2.4 + o[0] * 0.5, b[1] + 9 + o[1]], [b[0] + 6 + o[0] * 0.6, b[1] + 5.6 + o[1] * 0.8]),
          over: volute(9.6, 33 + w, n, 1) + volute(38.8, 32.4 - w, (n + 2) % 4, -1)
        };
      }
      if (view === "se") {
        const h2 = [17.4 + o[0], 45.2 + o[1]], e2 = [14.4 + o[0] * 0.5, 52.6 + o[1] * 0.3], m2 = [14.4, 52.4, 7];
        return {
          expr: "veille",
          right: arm(this, b, [30.4, 42.8], [34.8, 38]),
          left: arm(this, a, h2, [10.6, 41.6], manche(K, h2, e2) + poing(this, h2)),
          over: marmite(m2[0], m2[1], m2[2], n, this.uid, e2) + mancheDevant(K, h2, e2, m2[1] - m2[2] * 0.3 - 0.5) + volute(9.4, 47.8, n, 1) + volute(19.8, 47.2, (n + 2) % 4, -1)
        };
      }
      const h = [28.6 + o[0], 45.2 + o[1]], e = [25.6 + o[0] * 0.5, 52 + o[1] * 0.3], m = [24, 51.8, 8];
      return {
        expr: "veille",
        left: arm(this, a, [15.2, 42.8], [10.2, 38.4]),
        right: arm(this, b, h, [36.8, 41.6], manche(K, h, e) + poing(this, h)),
        over: marmite(m[0], m[1], m[2], n, this.uid, e) + mancheDevant(K, h, e, m[1] - m[2] * 0.3 - 0.5) + volute(17.6, 48.6, n, 1) + volute(31.6, 48, (n + 2) % 4, -1)
      };
    }
    __name(touiller, "touiller");
    function gouter({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["veille", "concentree", "pensive", "triste"][i];
      if (view === "ne") return { expr };
      const k = se ? -1 : 1, bx = se ? 19.6 : 27.2, mx = se ? 21 : 24;
      const sh = se ? a : b;
      if (i === 0 || i === 3) {
        const h2 = se ? [11.4, 41.6] : [36.4, 41.6], bw2 = se ? [13.6, 33.4] : [34.2, 33.4];
        const lo = i === 3 ? se ? [11, 44.6] : [36.8, 44.6] : h2, bwl = i === 3 ? se ? [12.6, 36.6] : [35.4, 36.6] : bw2;
        const geste = louche(K, [lo[0] - k * 0.4, lo[1] + 3], bwl, k * 15) + arm(this, sh, lo, [sh[0] + k * 4.4, sh[1] + 4.6]);
        return se ? { expr, left: geste, right: arm(this, b, [30.4, 42.8], [34.8, 38]) } : { expr, right: geste, left: arm(this, a, [15.2, 42.8], [10.2, 38.4]) };
      }
      const bw = [bx + (se ? -0.6 : 0), 31.2], h = se ? [13.2, 37.4] : [33.2, 37.4];
      const dessous = se ? [21.2 + 0.4 * (i - 1), 35.6] : [mx + 1.6, 35.6];
      const autre = se ? b : a;
      return {
        expr,
        left: "",
        right: "",
        over: arm(this, autre, dessous, se ? [33.6, 41.6] : [14.8, 41.6], paume(this, [dessous[0], dessous[1] + 0.6], se ? 1 : -1, 0.85)) + louche(K, h, bw, k * -10) + arm(this, sh, h, [sh[0] + k * 4.8, sh[1] + 6])
      };
    }
    __name(gouter, "gouter");
    function servir({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["veille", "veille", "pensive", "tendresse"][i];
      if (view === "ne") return { expr };
      const d = se ? -2.6 : 0;
      const bolP = i === 3 ? [20.6 + d * 1.6, 41] : [19.4 + d, 43.2];
      const mainBol = [bolP[0] - 0.6, bolP[1] + 3.4];
      const bras1 = arm(this, a, mainBol, [a[0] - 3.8, a[1] + 6.6], poing(this, mainBol) + bol(bolP[0], bolP[1], i >= 2, n));
      const L4 = [
        { h: [34.6 + d, 45], bw: [37.4 + d, 52.2], t: 0 },
        { h: [33.4 + d, 39.6], bw: [29.4 + d, 35.6], t: -15 },
        { h: [32.2 + d, 38.8], bw: [bolP[0] + 2.2, bolP[1] - 3.6], t: -60 },
        { h: [35.4 + d, 45.4], bw: [37.6 + d, 52.4], t: 0 }
      ][i];
      const coule = i === 2 ? `<path d="M${r22(bolP[0] + 0.8)},${r22(bolP[1] - 2.6)} Q${r22(bolP[0] + 0.4)},${r22(bolP[1] - 1.2)} ${r22(bolP[0] + 0.5)},${r22(bolP[1] - 0.2)}" fill="none" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="M${r22(bolP[0] + 0.8)},${r22(bolP[1] - 2.6)} Q${r22(bolP[0] + 0.4)},${r22(bolP[1] - 1.2)} ${r22(bolP[0] + 0.5)},${r22(bolP[1] - 0.2)}" fill="none" stroke="${SOUPE}" stroke-width="0.7" stroke-linecap="round"/>` : "";
      const bras2 = louche(K, [L4.h[0] - 0.8, L4.h[1] + (i === 2 ? -0.6 : 2.6)], L4.bw, L4.t) + arm(this, b, L4.h, [b[0] + 3.6, b[1] + 6.4]);
      if (se) return { expr, right: i === 0 || i === 3 ? bras2 : "", left: bras1, over: (i === 1 || i === 2 ? bras2 : "") + coule };
      return { expr, left: bras1, right: "", over: bras2 + coule };
    }
    __name(servir, "servir");
    function grain({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4;
      const expr = ["veille", "veille", "tendresse", "tendresse"][i];
      if (view === "ne") {
        const H2 = [[b[0] + 0.6, b[1] + 9], [b[0] + 4.6, b[1] + 1.6], [b[0] + 8.6, b[1] + 4.6], [b[0] + 7, b[1] + 9]][i];
        const vol2 = i === 2 ? grains([[43.4, 37.6, 10], [44.6, 39.8, -40], [42.6, 41.2, 70], [45.2, 36.4, 30]]) : i === 3 ? grains([[42.8, 50.6, 0], [44.4, 54.4, 50], [41.6, 57.4, -30], [45.4, 58.8, 20], [43.2, 60.8, 80]]) : "";
        return { expr, right: arm(this, b, H2, i === 0 ? null : [b[0] + 3.8, b[1] + 6.2], i === 2 ? paume(this, [H2[0] + 0.4, H2[1]], -1, 0.9) : null), over: vol2 };
      }
      const se = view === "se";
      if (se) {
        const tient2 = [26.4, 44];
        const H2 = [[22.4, 43.4], [16.6, 37], [8.4, 38.8], [9.6, 44.2]][i];
        const vol2 = i === 2 ? grains([[4.6, 37.4, 10], [3.2, 39.8, -40], [5.6, 41.6, 70], [2.8, 36.2, 30]]) : i === 3 ? grains([[5, 50.6, 0], [3.2, 54.4, 50], [6.2, 57.6, -30], [2.4, 58.8, 20], [4.6, 61, 80]]) : "";
        return {
          expr,
          right: "",
          left: arm(this, a, H2, i === 0 ? [13.4, 42.6] : [10.4, 40.4], i === 2 ? paume(this, [H2[0] - 0.4, H2[1]], 1, 0.9) : null),
          over: arm(this, b, tient2, [32.6, 42.2], giron(this, tient2[0], tient2[1], -1) + poing(this, tient2)) + vol2
        };
      }
      const tient = [17.4, 44.2];
      const H = [[24.6, 42.6], [33.4, 37.6], [40.6, 39.4], [39.6, 45]][i];
      const vol = i === 2 ? grains([[43.4, 37.4, 10], [44.8, 39.8, -40], [42.6, 41.6, 70], [45.4, 36.2, 30]]) : i === 3 ? grains([[42.8, 50.6, 0], [44.6, 54.4, 50], [41.8, 57.6, -30], [45.6, 58.8, 20], [43.4, 61, 80]]) : "";
      return {
        expr,
        left: arm(this, a, tient, [10.8, 41.4], poing(this, tient) + giron(this, tient[0], tient[1], 1)),
        right: "",
        over: arm(this, b, H, i === 0 ? [34.4, 43.4] : [37.4, 40.6], i === 2 ? paume(this, [H[0] + 0.4, H[1]], -1, 0.9) : null) + vol
      };
    }
    __name(grain, "grain");
    var GESTES = { touiller, gouter, servir, grain };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, sansLouche: nom !== "grain" || c.sansLouche, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, marmite, bol, volute };
  }
});

// personnages/refonte/agathe_anims.js
var require_agathe_anims = __commonJS({
  "personnages/refonte/agathe_anims.js"(exports, module) {
    var { frame, IMAGES, E, arm } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES, dessinerPose } = require_lorena_poses();
    var { avec } = require_agathe_gestes();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: "Elle attend, soucieuse : elle pense à Pierrot.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.11, dirs: MOUVANTES, contexte: "Elle va de la marmite au poulailler, d'un pas lourd.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.07,
        dirs: MOUVANTES,
        contexte: "L'urgence : une poule échappée, la brume, un cri au camp.",
        // la marche, pliée et pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au
        // contact du pied (elle court en petits pas, le rebond plus court que celui de Lorena)
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "inquiete");
          const up = [0, -0.15, -0.25, -0.15, 0, -0.15, -0.25, -0.15][n % 8] + (avant(v) ? 0.7 : 0);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${up})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.13,
        dirs: MOUVANTES,
        contexte: "Elle arrive, freine, puis se pose (et souffle).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "epuisee")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.22, dirs: ["face"], contexte: "Elle salue le joueur, de loin.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e || "sourire"), "img") },
      touiller: { nom: "Travail : touiller la marmite", images: 4, dt: 0.22, dirs: TOUTES, contexte: "Au feu : la marmite (le mini-jeu : « on touille »).", img: metier("touiller") },
      gouter: { nom: "Travail : goûter", images: 4, dt: 0.5, dirs: DEVANT, contexte: "Elle goûte, attend… rien : le goût perdu (acte V).", img: metier("gouter") },
      servir: { nom: "Travail : servir", images: 4, dt: 0.36, dirs: DEVANT, contexte: "Le soir, elle sert la soupe (et le bol « pour la Dame »).", img: metier("servir") },
      grain: { nom: "Travail : le grain aux poules", images: 4, dt: 0.26, dirs: TOUTES, contexte: "Le matin : ses trois poules et Amiral.", img: metier("grain") },
      brandir: { nom: "Brandir la louche", images: IMAGES.action, dt: 0.4, dirs: TOUTES, contexte: "La défense du camp, la nuit : sa louche contre les égarés.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "action", n, e), "img") },
      dodo: {
        nom: "Dodo, assise",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        contexte: "La nuit, près du feu : la louche serrée contre elle.",
        // (assise, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre, avec une marge pour
        // les fils qui pendent au bout ; la robe trempée ne goutte plus)
        // (la main gauche serre la louche près du cuilleron, la droite posée sur ses genoux : à portée de ses bras)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Cannelle.dy + 1.2 }), "body") }, n, {
          ...D.POSES.Cannelle,
          arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [21.4, 49.6], [13.8, 48.6]) + arm(cc, r, [30.4, 46.2], [36.4, 50.4]), "arms")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couchée",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, sous la couverture rayée (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#93A9C2", motif: "#E9EEF3" }), "img")
      }
    };
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: DEVANT, pose: true, contexte: "Dialogue, réaction (quête, surprise, froid, victoire).", img: /* @__PURE__ */ __name((c, v, n, e) => dessinerPose(c, k, v, n, e), "img") };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/refonte/nathan_refonte.js
var require_nathan_refonte = __commonJS({
  "personnages/refonte/nathan_refonte.js"(exports, module) {
    var { P, E, L, clip, limb, r2: r22, OUT, lerp, arm, shoe } = require_troupe();
    var rivet = require_rivet();
    var { EXPR, ALIAS, X, eye, brow, mouth, extras, wind } = require_visage();
    var { seam, suitOurlet } = require_tissu();
    var { fabriquerBras, poserBras } = require_lorena_bras();
    var { jambe, anneau, ligneBras, pointLigne, longueurLigne } = require_membres();
    var { fondre } = require_couleurs();
    var C = fondre({
      skin: "#DDA57C",
      skinS: "#C08A62",
      lid: "#D2966E",
      under: "#A87A68",
      nose: "#B37452",
      stubble: "#6E5240",
      hair: "#6B4A32",
      hairS: "#4F3524",
      hairH: "#8C6646",
      grey: "#CFCAC2",
      greyS: "#A8A29A",
      greyH: "#F2EFEA",
      brow: "#3B271B",
      browW: 1.05,
      rim: "#9FE3DA",
      eye: "#241C18",
      iris: "#8C6A3C",
      irisL: "#D8B47C",
      eyeRx: 1.85,
      eyeRy: 2.5,
      shirt: "#3F8A86",
      shirtS: "#2E6B68",
      shirtH: "#62A9A4",
      collar: "#EFE6D6",
      collarS: "#D3C7B2",
      leather: "#8A5A36",
      leatherS: "#6B4328",
      leatherH: "#A87650",
      forge: "#5E3E28",
      forgeS: "#452C1C",
      forgeH: "#7E5638",
      vest: "#5A4636",
      vestS: "#40322A",
      vestH: "#7A6352",
      lining: "#9C3E34",
      brass: "#C9A24A",
      brassS: "#8E6E2C",
      brassH: "#F0D58A",
      glass: "#CFEAF0",
      glassT: "#BFE3C6",
      strap: "#4A3426",
      steel: "#B8C0C8",
      steelS: "#8A949E",
      red: "#C8463A",
      wood: "#E2C28E",
      pencil: "#F2C94C",
      pencilS: "#C99A2E",
      eraser: "#EE8F8F",
      garter: "#3A3330",
      glove: "#9A6A42",
      gloveS: "#74502F",
      cheek: "#EE9C8C",
      mouth: "#7A3B30",
      scar: "#E49A86",
      scarH: "#F6C7B6",
      grease: "#3E3632",
      soot: "#4A4440",
      salt: "#FFF8E8",
      dust: "#E8D6AE",
      mud: "#6B5138",
      patch: "#C9B48A",
      cloth: "#E6D4AE",
      clothS: "#B8A27A"
    });
    var MARKS = { grease: 1, soot: 0.5, salt: 1, dust: 0, dirt: 0.4, crack: true, pocket: "torn", patch: false, wrist: false, wet: false };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      return { ...K, coat: K.shirt, coatS: K.shirtS, coatH: K.shirtH };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_N = {
      ...EXPR,
      veille: X({ brow: [0.25, -0.1, -0.3], browR: [-0.35, -0.5, -0.45], lid: 0.16, tilt: 0, look: [0, 0.15], under: 0.4, mouth: "flat" }),
      // concentré : les lèvres pincées (la lèvre mordue de la troupe lui faisait une dent de lapin)
      concentree: { ...EXPR.concentree, mouth: "press" },
      // il examine de près ce qu'il tient à sa gauche (à droite de l'écran) : un œil plissé, le regard de ce côté
      examine: X({ brow: [0.9, -0.2, 0], browR: [-0.6, -1.1, -0.7], lid: 0.3, tilt: 0.3, low: 0.12, look: [0.6, -0.1], mouth: "press" })
    };
    var oeil = /* @__PURE__ */ __name((...a) => eye(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, ""), "oeil");
    function crayon(K, a, b) {
      const t = 0.78, v = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return limb(a, b, 1.4, K.pencil) + L(a, v, K.pencilS, 0.35) + limb(v, [v[0] + (b[0] - a[0]) * 0.08, v[1] + (b[1] - a[1]) * 0.08], 1.45, K.brass) + E(b[0], b[1], 0.95, 0.95, K.eraser, 0.8);
    }
    __name(crayon, "crayon");
    var reflet0 = /* @__PURE__ */ __name((d, w) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round"/>`, "reflet0");
    function loupe(K, x, y, r, teinte = false, fele = false) {
      let s = E(x, y, r, r, K.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, teinte ? K.glassT : K.glass, 0.6) + reflet0(`M${r22(x - r * 0.42)},${r22(y - r * 0.1)} Q${r22(x - r * 0.36)},${r22(y - r * 0.4)} ${r22(x - r * 0.08)},${r22(y - r * 0.44)}`, 0.5) + E(x + r * 0.84, y - r * 0.1, 0.22, 0.22, K.brassS, 0) + E(x - r * 0.84, y + r * 0.1, 0.22, 0.22, K.brassS, 0);
      if (fele) {
        const q = r * 0.6;
        s += `<path d="M${r22(x - q * 0.9)},${r22(y - q * 0.7)} L${r22(x - q * 0.1)},${r22(y - q * 0.05)} L${r22(x - q * 0.35)},${r22(y + q * 0.75)} M${r22(x - q * 0.1)},${r22(y - q * 0.05)} L${r22(x + q * 0.85)},${r22(y + q * 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      return s;
    }
    __name(loupe, "loupe");
    function cle(K, x, y, a = 0) {
      const anneau2 = `<circle cx="${x}" cy="${r22(y + 3.2)}" r="0.9" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r22(y + 3.2)}" r="0.9" fill="none" stroke="${K.brass}" stroke-width="0.5"/>`;
      return `<g transform="rotate(${a} ${x} ${y})">${L([x, y], [x, y + 2.3], OUT, 0.45)}${anneau2}${limb([x, y + 4.1], [x, y + 6.2], 0.55, K.brass)}${E(x - 0.6, y + 6.5, 0.55, 0.45, K.brass, 0.4)}${E(x + 0.6, y + 6.5, 0.55, 0.45, K.brass, 0.4)}${E(x, y + 7, 0.5, 0.45, K.brass, 0.4)}</g>`;
    }
    __name(cle, "cle");
    var rivetL = /* @__PURE__ */ __name((K, x, y) => E(x, y, 0.48, 0.48, K.brass, 0.4) + E(x - 0.15, y - 0.15, 0.16, 0.16, K.brassH, 0), "rivetL");
    var roussi = /* @__PURE__ */ __name((K, x, y, s = 1) => E(x, y, 1.5 * s, 1 * s, K.leatherS, 0).replace("/>", ' opacity=".9"/>') + E(x + 0.2 * s, y, 0.9 * s, 0.55 * s, "#2E2018", 0).replace("/>", ' opacity=".75"/>') + L([x - 0.6 * s, y - 0.2 * s], [x - 1.4 * s, y - 0.7 * s], "#2E2018", 0.3) + L([x + 0.8 * s, y + 0.3 * s], [x + 1.5 * s, y + 0.8 * s], "#2E2018", 0.3), "roussi");
    var TORSE = "M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z";
    var BAS = /* @__PURE__ */ __name((off) => suitOurlet(14.8, 33.2, 46.6, 48.8, off), "BAS");
    var TABLIER = /* @__PURE__ */ __name((k, bas) => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${r22(32.2 + k + (bas - 52) * 0.12)},${bas} Q${24 + k},${r22(bas + 1.8)} ${r22(15.8 + k - (bas - 52) * 0.12)},${bas} L${17.4 + k},40 Z`, "TABLIER");
    function corps(c, ctx, K, M) {
      const view = ctx.view, u = c.uid, t = c.tenue || "atelier", mir = !!c.miroir, dos = view === "ne";
      const k = view === "se" ? -1.8 : 0, axe = 24 + k;
      const shadeX = view === "se" ? 26.4 : 27.6;
      let s = P(TORSE, K.shirt) + clip(`${u}t`, TORSE, `<rect x="${shadeX}" y="30" width="10" height="20" fill="${K.shirtS}"/><rect x="16.6" y="34" width="1.2" height="11" rx="0.6" fill="${K.shirtH}" opacity=".8"/><rect x="32.3" y="34" width="1.1" height="12" fill="${K.rim}" opacity=".55"/><path d="M19.2,37 Q18.6,41.6 18.6,46" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/><path d="M29.4,37 Q30,41.6 30.2,46.4" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>` + (M.salt ? `<path d="${BAS(1.6)}" fill="none" stroke="${K.salt}" stroke-width="0.6" opacity="${r22(0.6 * M.salt)}"/>` : "") + (M.dust ? [[17.4, 44.6], [30.8, 43.8], [19.6, 39]].map(([x, y]) => E(x, y, 1.1, 0.5, K.dust, 0).replace("/>", ` opacity="${r22(0.7 * M.dust)}"/>`)).join("") : "")) + P(TORSE, "none");
      if (dos) {
        if (t === "gilet") return s + gilet(c, ctx, K, M, mir);
        const lw = t === "forge" ? 1.9 : 1.5, cuir2 = t === "forge" ? K.forge : K.leather;
        s += limb([18.2, 32.8], [29, 41.2], lw, cuir2) + limb([29.8, 32.8], [19, 41.2], lw, cuir2);
        s += `<path d="M18.6,33.4 L28.6,41 M29.4,33.4 L19.4,41" fill="none" stroke="${K.leatherH}" stroke-width="0.3" stroke-dasharray=".6 .5" opacity=".8"/>`;
        if (t === "forge") s += `<rect x="22.6" y="35.6" width="2.8" height="2.2" rx="0.4" fill="none" stroke="${OUT}" stroke-width="1.3"/><rect x="22.6" y="35.6" width="2.8" height="2.2" rx="0.4" fill="none" stroke="${K.brass}" stroke-width="0.55"/>`;
        s += P("M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z", cuir2, 0.8) + P("M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z", cuir2, 0.8) + limb([23.6, 41.8], [22.4, 45.4], 0.9, cuir2) + limb([24.4, 41.8], [25.8, 45.2], 0.9, cuir2) + E(24, 41.4, 1, 0.9, K.leatherS, 0.8);
        s += reflet(24, cle(K, 15.6, 41.6, 8), mir);
        return s + mouille(M, 47.6, ctx);
      }
      if (t === "gilet") return s + gilet(c, ctx, K, M, mir);
      const forge = t === "forge", bas = forge && !ctx.seatDy ? 55.4 : 52;
      const cuir = forge ? K.forge : K.leather, cuirS = forge ? K.forgeS : K.leatherS, cuirH = forge ? K.forgeH : K.leatherH;
      const ap = TABLIER(k, bas);
      s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], cuirS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], cuirS, 1.2);
      if (!forge) {
        s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, K.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, K.red);
        s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${K.wood}" stroke="${OUT}" stroke-width="0.6"/>` + [40.2, 41.2, 42.2].map((y) => L([25.7 + k, y], [26.3 + k, y], OUT, 0.3)).join("");
      }
      const taches = roussi(K, 18.6 + k, forge ? 50.6 : 49.2, 1) + (forge ? roussi(K, 27.6 + k, 53, 0.8) + roussi(K, 21.4 + k, 38.2, 0.6) : "") + (M.grease ? `<path d="M${27.4 + k},46.8 q1.2,-0.8 2.2,0 q-0.2,1.4 -1.2,1.4 q-1.2,0 -1,-1.4 Z" fill="${K.grease}" opacity="${r22(0.5 * M.grease)}"/><path d="M${28.2 + k},45.8 l0.5,-1.3 M${29.1 + k},46 l0.6,-1.1" stroke="${K.grease}" stroke-width="0.45" opacity="${r22(0.45 * M.grease)}"/>` : "") + (M.soot ? E(22.6 + k, bas - 2.4, 2.2, 0.9, K.soot, 0).replace("/>", ` opacity="${r22(0.4 * M.soot)}"/>`) : "");
      const sciure = M.dust ? [[20.4, 46.4], [26.6, 50], [22, 50.6], [28.4, 42.6]].map(([x, y]) => E(x + k, y, 0.9, 0.45, K.dust, 0).replace("/>", ` opacity="${r22(0.85 * M.dust)}"/>`)).join("") : "";
      const sel = M.salt ? `<path d="${suitOurlet(15.8 + k, 32.2 + k, bas, bas + 1.8, 1.4, 0.15)}" fill="none" stroke="${K.salt}" stroke-width="0.55" opacity="${r22(0.6 * M.salt)}"/>` : "";
      s += P(ap, cuir) + clip(`${u}a`, ap, `<rect x="${27.6 + k}" y="34" width="9" height="24" fill="${cuirS}"/><rect x="${18.4 + k}" y="35.8" width="1" height="${bas - 37}" rx="0.5" fill="${cuirH}"/><path d="M${19.6 + k},48 l2.4,0.6 M${25.4 + k},38.4 l1.6,-0.5 M${28.6 + k},49.4 l1.4,0.8" stroke="${cuirH}" stroke-width="0.35" opacity=".7"/>` + reflet(axe, taches, mir) + sciure + sel) + P(ap, "none");
      s += seam(`M${19.3 + k},35.9 L${28.7 + k},35.9 L${29.8 + k},40.2 L${r22(31.4 + k + (bas - 52) * 0.12)},${r22(bas - 0.8)}`, 0.3) + seam(`M${18.2 + k},40.2 L${r22(16.6 + k - (bas - 52) * 0.12)},${r22(bas - 0.8)}`, 0.3);
      if (!forge) {
        const pk = `M${19.2 + k},43.2 L${28.8 + k},43.2 L${28.8 + k},48 Q${28.8 + k},48.8 ${28 + k},48.8 L${20 + k},48.8 Q${19.2 + k},48.8 ${19.2 + k},48 Z`;
        s += P(pk, cuirS, 0.8) + seam(`M${20 + k},44.2 L${28 + k},44.2`, 0.35) + L([22.4 + k, 43.4], [22.4 + k, 48.6], OUT, 0.5) + L([25.6 + k, 43.4], [25.6 + k, 48.6], OUT, 0.5);
        s += [[20.8, 43.2, "brush"], [24, 43.2, "pliers"]].map(([x, y, o]) => o === "brush" ? limb([x + k, y], [x + k - 0.3, y - 2.4], 0.7, K.wood) + E(x + k - 0.35, y - 2.8, 0.55, 0.7, K.hairS, 0.4) : limb([x + k - 0.3, y], [x + k - 0.6, y - 2.2], 0.45, K.steel) + limb([x + k + 0.3, y], [x + k + 0.6, y - 2.2], 0.45, K.steel)).join("");
        if (M.pocket === "torn") {
          s += reflet(axe, `<rect x="${25.6 + k}" y="43.4" width="3.2" height="1.4" fill="#2E2018"/>` + P(`M${25.6 + k},44.8 L${28.8 + k},44.8 Q${28.6 + k},47.4 ${27.4 + k},49.2 Q${26.2 + k},47.6 ${25.6 + k},44.8 Z`, cuirS, 0.8) + `<path d="M${28.8 + k},44.6 q0.5,0.8 0.1,1.6 M${25.6 + k},44.6 q-0.4,0.9 0,1.5" fill="none" stroke="${K.cloth}" stroke-width="0.3"/>`, mir);
        } else if (M.pocket === "mended") {
          s += reflet(axe, [44.4, 45.6, 46.8, 48].map((y) => L([28.4 + k, y], [29.4 + k, y + 0.3], K.cloth, 0.4)).join(""), mir);
        }
        s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${cuirS}" stroke="${OUT}" stroke-width="0.7"/>` + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, K.pencil) + E(23.45 + k, 34.45, 0.45, 0.45, K.eraser, 0.35);
      } else {
        s += `<rect x="${19.4 + k}" y="44" width="9.2" height="5.4" rx="0.6" fill="${cuirS}" stroke="${OUT}" stroke-width="0.8"/>` + seam(`M${20.1 + k},44.8 L${27.9 + k},44.8`, 0.32) + limb([24.6 + k, 44.2], [25.6 + k, 39.6], 0.55, K.steelS) + limb([25.4 + k, 44.2], [26.8 + k, 39.8], 0.55, K.steelS);
      }
      for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += rivetL(K, x + k, y);
      s += L([17.4 + k, 40.6], [30.6 + k, 40.6], cuirS, 0.8);
      s += reflet(axe, cle(K, 30.2 + k, 40.8, -6), mir);
      return s + mouille(M, forge ? bas : 48.4, ctx);
    }
    __name(corps, "corps");
    function gilet(c, ctx, K, M, mir) {
      const view = ctx.view, k = view === "se" ? -1.6 : 0, u = c.uid;
      if (view === "ne") {
        const G = "M15.6,32.8 Q24,30.6 32.4,32.8 L33.4,46.4 Q24,48.4 14.6,46.4 Z";
        return P(G, K.lining) + clip(`${u}gd`, G, `<rect x="27.6" y="30" width="10" height="20" fill="${OUT}" opacity=".25"/><path d="M15,39 Q24,41 33,39" stroke="#FFFFFF" stroke-width="0.4" opacity=".3" fill="none"/>`) + P(G, "none") + `<rect x="18.4" y="41.2" width="11.2" height="1.6" rx="0.4" fill="${K.vestS}" stroke="${OUT}" stroke-width="0.6"/><rect x="23" y="40.9" width="2" height="2.2" rx="0.3" fill="none" stroke="${K.brass}" stroke-width="0.5"/>` + mouille(M, 47.6, ctx);
      }
      const Gl = `M${16 + k},32.6 Q${19.6 + k},31.6 ${21.8 + k},32.6 L${24 + k},39.6 L${24 + k},47.8 Q${19 + k},47.6 ${14.8 + k},46.6 Z`;
      const Gr = `M${32 + k},32.6 Q${28.4 + k},31.6 ${26.2 + k},32.6 L${24 + k},39.6 L${24 + k},47.8 Q${29 + k},47.6 ${33.2 + k},46.6 Z`;
      let s = "";
      for (const [d, droite] of [[Gl, false], [Gr, true]]) {
        s += P(d, K.vest) + clip(`${u}g${droite ? "r" : "l"}`, d, (droite ? `<rect x="${27.6 + k}" y="30" width="10" height="20" fill="${K.vestS}"/>` : `<rect x="${16.4 + k}" y="34" width="1" height="11" rx="0.5" fill="${K.vestH}"/>`) + `<path d="M${(droite ? 31.6 : 16.4) + k},34 L${(droite ? 32.4 : 15.6) + k},46" stroke="${OUT}" stroke-width="0.3" opacity=".25"/>`) + P(d, "none");
      }
      s += P(`M${22.6 + k},33.4 L${25.4 + k},33.4 L${24.6 + k},37.8 L${24 + k},38.6 L${23.4 + k},37.8 Z`, K.vestS, 0.7);
      s += [40.8, 42.8, 44.8, 46.6].map((y) => rivetL(K, 24.3 + k, y).replace(/rx="0.48" ry="0.48"/, 'rx="0.55" ry="0.55"')).join("");
      s += L([17.6 + k, 42], [21.2 + k, 41.8], OUT, 0.7) + L([26.8 + k, 41.8], [30.4 + k, 42], OUT, 0.7);
      s += reflet(24 + k, `<path d="M${24.6 + k},42.8 Q${27 + k},44.8 ${29 + k},41.8" fill="none" stroke="${OUT}" stroke-width="1"/><path d="M${24.6 + k},42.8 Q${27 + k},44.8 ${29 + k},41.8" fill="none" stroke="${K.brassH}" stroke-width="0.45" stroke-dasharray=".5 .3"/>` + E(29.2 + k, 41.2, 1.15, 1.15, K.brass, 0.7) + E(29.2 + k, 41.2, 0.7, 0.7, "#FFF8E8", 0.3) + L([29.2 + k, 41.2], [29.2 + k, 40.7], OUT, 0.25), mir);
      s += reflet(24 + k, limb([19.2 + k, 37.4], [19.8 + k, 34.8], 0.8, K.pencil) + E(19.85 + k, 34.6, 0.45, 0.45, K.eraser, 0.35) + L([18 + k, 37.6], [20.8 + k, 37.4], OUT, 0.6), mir);
      if (M.grease) s += reflet(24 + k, `<ellipse cx="${18.6 + k}" cy="45.2" rx="1.2" ry="0.6" fill="${K.grease}" opacity="${r22(0.45 * M.grease)}"/>`, mir);
      return s + mouille(M, 48.4, ctx);
    }
    __name(gilet, "gilet");
    var mouille = /* @__PURE__ */ __name((M, hy, ctx) => M.wet && !ctx.seatDy ? [[16.6, 0], [24.4, 0.55], [31.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 1.4)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 1.4)};${r22(hy + 7)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouille");
    var brasBase = fabriquerBras({ pal, marks });
    function bras(c, a, b, elbow, main, partie = "tout") {
      const K = pal(c);
      let s = brasBase(c, a, b, elbow, main, partie);
      const geo = poserBras(c, a, b, elbow, main);
      b = geo.b;
      elbow = geo.elbow;
      const view = c.view || "front", gauche = a[0] < 24;
      const droit = (view === "ne" ? !gauche : gauche) !== !!c.miroir;
      const w = c.armW;
      const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
      const band = /* @__PURE__ */ __name((k, half, col, wd, courbe = 0) => `<path d="${anneau(ligne, k + wd / 2, k - wd / 2, half, courbe).d}" fill="${col}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>`, "band");
      const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : 0;
      if (partie !== "devant" && c.sleeves !== "torn" && !c.sansBrassard) {
        const k = elbow ? tot - (tot - avb) * 0.55 : tot * 0.64;
        s += band(k, w / 2 + 0.2, K.garter, 0.85);
        const m = pointLigne(ligne, k).p;
        s += E(m[0], m[1], 0.45, 0.45, K.steel, 0.35);
      }
      if (partie === "derriere") return s;
      const len = elbow ? avb : tot;
      const nu = c.sleeves === "torn" || c.sleeves === "roll";
      const coupe = c.sleeves === "torn" ? Math.min(4.4, len * 0.5) : Math.min(5.8, len * 0.55);
      const bande = c.sleeves === "torn" && c.bandage && c.bandage === "right" === droit;
      if (nu && !droit && !bande && len > 3.5) {
        const { p, u: [ux, uy] } = pointLigne(ligne, coupe * 0.62), ang = r22(Math.atan2(uy, ux) * 180 / Math.PI);
        s += `<g transform="rotate(${ang} ${r22(p[0])} ${r22(p[1])})"><path d="M${r22(p[0] - 1.1)},${r22(p[1] - 0.6)} Q${r22(p[0] - 0.2)},${r22(p[1] - 1.1)} ${r22(p[0] + 1)},${r22(p[1] - 0.5)} Q${r22(p[0] + 1.3)},${r22(p[1] + 0.4)} ${r22(p[0] + 0.3)},${r22(p[1] + 0.7)} Q${r22(p[0] - 0.9)},${r22(p[1] + 0.6)} ${r22(p[0] - 1.1)},${r22(p[1] - 0.6)} Z" fill="${K.scar}"/><path d="M${r22(p[0] - 0.5)},${r22(p[1] - 0.4)} q0.5,-0.2 0.9,0" fill="none" stroke="${K.scarH}" stroke-width="0.35" stroke-linecap="round"/></g>`;
      }
      if (c.gants && main == null) {
        s += band(1.8, w / 2 + 0.55, K.glove, 1.3, 0.3) + E(b[0], b[1], 2.15, 2.15, K.glove, 0.9) + E(b[0] - 0.6, b[1] - 0.6, 0.7, 0.5, "#B98858", 0);
      }
      return s;
    }
    __name(bras, "bras");
    function pied(c, x, y, dir, tilt, genou) {
      const M = marks(c), K = pal(c);
      let s = "";
      const gx = x - c.legW / 2 + 0.5, gw = c.legW - 1;
      const g = genou || [x, (c.hip + y) / 2];
      const droite = ((c.view || "front") === "ne" ? x > 24 : x < 24) !== !!c.miroir;
      if (M.patch && droite) s += `<rect x="${r22(g[0] - gw / 2)}" y="${r22(g[1] - 1.5)}" width="${r22(gw)}" height="3" rx="0.5" fill="${K.patch}" stroke="${OUT}" stroke-width="0.5"/>` + seam(`M${r22(g[0] - gw / 2 + 0.4)},${r22(g[1] - 1.1)} L${r22(g[0] + gw / 2 - 0.4)},${r22(g[1] - 1.1)}`, 0.3);
      if (M.dirt) s += `<rect x="${r22(gx)}" y="${r22(y - 1.6)}" width="${r22(gw)}" height="2.2" fill="${K.mud}" opacity="${r22(0.5 * M.dirt)}"/>`;
      if (M.salt) s += L([gx, y - 2.6], [gx + gw, y - 2.8], K.salt, 0.45).replace("/>", ` opacity="${r22(0.6 * M.salt)}"/>`);
      s += shoe(c, x, y, dir, tilt);
      if (dir <= 0 && !tilt) s += L([x - 1, y + 0.9], [x + 0.4, y + 0.6], c.shoeH, 0.35) + L([x - 1, y + 1.7], [x + 0.6, y + 1.4], c.shoeH, 0.35);
      if (M.dirt) s += E(x - 1.6, y + 3.6, 1.6, 0.7, K.mud, 0).replace("/>", ` opacity="${r22(0.8 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: {
        X: /* @__PURE__ */ __name((x) => x, "X"),
        rk: [1, 1],
        k: 0,
        mouth: 24,
        face: "M12.4,21.6 C12.4,14.4 17.4,11.2 24,11.2 C30.6,11.2 35.6,14.4 35.6,21.6 C35.6,27.4 31.2,32 24,32 C16.8,32 12.4,27.4 12.4,21.6 Z",
        back: "M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z",
        strap: "M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z",
        big: [[19.4, 10.8, 2.9], [28.6, 10.8, 2.9]],
        small: [[17.4, 8.6, 1.9], [30.6, 8.6, 1.9]],
        ears: [[11.8, 22.8], [36.2, 22.8]],
        pencils: [[[14, 20.8], [7.8, 19.4]], [[34, 20.8], [40.2, 19.4]]]
      },
      // (de trois quarts : l'axe du visage, nez et bouche, passe à 21, côté profil ; l'œil proche, côté oreille, garde sa
      // taille, l'œil lointain se resserre vers le profil ; les yeux gardent l'écart du kit. Choix de l'auteur, 15 oct. :
      // resserrés au milieu à la façon du kit, puis avec un grand nez en crochet, ses traits faisaient un visage serré et
      // mal proportionné.)
      se: {
        X: /* @__PURE__ */ __name((x) => r22(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), "X"),
        rk: [0.86, 1],
        k: -1.4,
        mouth: 21,
        axe: 21,
        face: "M11.4,21.6 C11.4,14.4 16.2,11.2 22.6,11.2 C29,11.2 33.8,14.4 33.8,21.6 C33.8,27.4 29.6,32 22.6,32 C15.6,32 11.4,27.4 11.4,21.6 Z",
        back: "M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z",
        strap: "M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z",
        big: [[17.8, 10.8, 2.8], [26.6, 10.4, 2.5]],
        small: [[16, 8.6, 1.8], [28.4, 8.2, 1.6]],
        ears: [[35, 23.2]],
        pencils: [[[33.4, 20.8], [39.2, 19.2]]]
      }
    };
    var EPI = ["M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z", "M22.6,8.4 Q22,3.8 26.2,2.8 Q24.8,5 26.6,8 Z"];
    var epi = /* @__PURE__ */ __name((K, begin = "0s") => wind(EPI[0], EPI[1], K.grey, 0.9, "2.1s", begin) + L([23.4, 7], [24.2, 4.2], K.greyS, 0.5), "epi");
    function tete(c, ctx, act = {}) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return teteDeDos(c, ctx, K, M, mir, id);
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X, k = V.k, ax = Xv(24);
      const sx = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "sx");
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_N.cligne : EXPR_N[name] || EXPR_N.veille;
      let s = epi(K) + P(V.back, K.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24.6" width="32" height="6" fill="${K.hairS}"/><path d="M35,12 Q38,19 36,27 L39,27 L39,12 Z" fill="${K.rim}" opacity=".7"/>`) + P(V.back, "none");
      for (const [x, y] of V.ears) s += E(x, y, 1.5, 2.1, K.skin) + P(`M${r22(x + (x > 24 ? -0.2 : 0.2))},${r22(y - 1)} Q${r22(x + (x > 24 ? 0.6 : -0.6))},${y} ${r22(x + (x > 24 ? -0.1 : 0.1))},${r22(y + 1)}`, "none", 0.45);
      if (!c.coiffe) for (const [a, b] of V.pencils) s += crayon(K, a, b);
      const barbe = `M${r22(Xv(14))},25.6 Q${r22(Xv(16))},31.6 ${ax},32.4 Q${r22(Xv(32))},31.6 ${r22(Xv(34))},25.6 Q${r22(Xv(32.6))},29.8 ${ax},30.6 Q${r22(Xv(15.4))},29.8 ${r22(Xv(14))},25.6 Z`;
      const poils = [[16.6, 28.4], [18.4, 29.8], [20.6, 30.6], [27.4, 30.6], [29.6, 29.8], [31.4, 28.4], [22.6, 30.9], [25.4, 30.9]].map(([x, y]) => E(Xv(x), y, 0.18, 0.18, K.stubble, 0).replace("/>", ' opacity=".55"/>')).join("");
      const bangs = sx("M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z");
      const grey = sx("M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z");
      const bx = 24 + k;
      s += P(V.face, K.skin) + clip(`${id}f`, V.face, reflet(bx, `<path d="${bangs}" fill="${K.skinS}" transform="translate(0 1.4)"/>`, mir) + `<path d="${barbe}" fill="${K.stubble}" opacity=".16"/>` + poils + `<g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".45"/><path d="M31.8,13 Q35,21 31.2,30.8 L33.6,30.8 Q37,21 33.6,13 Z" fill="${K.skinS}" opacity=".4"/></g>` + E(Xv(16.6), 26.2, 1.9 * V.rk[0], 1.05, K.cheek, 0).replace("/>", ' opacity=".55"/>') + E(Xv(31.4), 26.2, 1.9 * V.rk[1], 1.05, K.cheek, 0).replace("/>", ' opacity=".55"/>')) + P(V.face, "none");
      s += reflet(bx, P(bangs, K.hair) + clip(`${id}b`, bangs, `<rect x="8" y="15.6" width="32" height="4" fill="${K.hairS}" opacity=".5"/>`) + P(bangs, "none") + L([15 + k, 12.6], [20 + k, 11], K.hairH, 1.2) + P(grey, K.grey, 0.8) + L([26.4 + k, 12.2], [29.4 + k, 12.6], K.greyH, 0.9) + L([27.4 + k, 14.4], [29.6 + k, 16.2], K.greyS, 0.4), mir);
      if (c.coiffe) s += c.coiffe(c, ctx, "cheveux");
      s += P(V.strap, K.strap, 0.8);
      const lunettes = V.big.map(([x, y, r], i) => {
        if (act.lensDown && i === 1) return "";
        const [sx0, sy0, sr] = V.small[i];
        return loupe(K, x, y, r, false, i === (mir ? 0 : 1) && M.crack) + L([x, y], [sx0, sy0], K.brassS, 0.6) + loupe(K, sx0, sy0, sr, true);
      }).join("") + L([V.big[0][0] + V.big[0][2] - 0.2, V.big[0][1]], [V.big[1][0] - V.big[1][2] + 0.2, V.big[1][1]], K.brassS, 0.9);
      s += lunettes;
      if (c.coiffe) s += c.coiffe(c, ctx, "tete");
      if (M.grease) s += reflet(ax, `<ellipse cx="${Xv(30.8)}" cy="28.6" rx="1.6" ry="0.7" fill="${K.grease}" opacity="${r22(0.45 * M.grease)}" transform="rotate(-14 ${Xv(30.8)} 28.6)"/><ellipse cx="${Xv(20.6)}" cy="16.2" rx="0.9" ry="0.55" fill="${K.grease}" opacity="${r22(0.35 * M.grease)}"/>`, mir);
      if (M.soot) s += E(ctx.view === "se" ? 20.4 : 23.6, 24.6, 0.9, 0.5, K.soot, 0).replace("/>", ` opacity="${r22(0.3 * M.soot)}"/>`);
      if (M.dust) s += E(Xv(27), 15, 1.4, 0.5, K.dust, 0).replace("/>", ` opacity="${r22(0.8 * M.dust)}"/>`);
      s += ctx.view === "se" ? P(`M${r22(V.axe + 0.2)},24.5 Q${r22(V.axe - 0.8)},25.4 ${r22(V.axe + 0.3)},25.8`, "none", 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(V.axe + 0.5, 24.9, 0.25, 0.32, "#F2C6A2", 0) : P("M23.3,25.2 Q24,26 24.8,25.3", "none", 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.1, 24.7, 0.28, 0.36, "#F2C6A2", 0);
      s += mouth(ex.mouth, V.mouth, 27.2, `${id}m`, K);
      s += brow(Xv(19.4), 18.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
      s += oeil(`${id}e0`, Xv(19.4), 22.6, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K);
      if (!act.lensDown) s += oeil(`${id}e1`, Xv(28.6), 22.6, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return s;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[14.2, 19.8, 0], [32.2, 18, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    function teteDeDos(c, ctx, K, M, mir, id) {
      const back = "M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z";
      let s = epi(K) + E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
      s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="4" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${K.hair}"/><path d="M35.4,10 Q38.4,19 36.4,30 L39,30 L39,10 Z" fill="${K.rim}" opacity=".7"/>`) + P(back, "none");
      s += P("M17.6,15 Q16.8,21 18.4,28.6", "none", 0.6) + P("M24.6,15 Q25.4,21 24.2,28.4", "none", 0.6) + P("M31,16.4 Q32,22 30.6,29.2", "none", 0.6) + L([16.6, 10.2], [21.6, 8.6], K.hairH, 1.2);
      s += reflet(24, P("M13.4,12.6 Q15.4,8.8 19.6,8.2 Q16.6,10.4 15.6,14.4 Q14.8,16.6 13.2,17.2 Q12.6,14.8 13.4,12.6 Z", K.grey, 0.7) + L([14.6, 11.8], [16.8, 9.6], K.greyH, 0.7), mir);
      s += P("M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z", K.strap, 0.8) + seam("M12,13.4 Q24,16.8 36,13.4", 0.25) + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${K.brass}" stroke="${OUT}" stroke-width="0.6"/>` + L([24, 14.8], [24, 16.4], K.brassS, 0.4);
      if (c.coiffe) s += c.coiffe(c, ctx, "cheveux") + c.coiffe(c, ctx, "tete");
      else s += crayon(K, [15.4, 20.6], [9.2, 19.2]) + crayon(K, [32.6, 20.6], [38.8, 19.2]);
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_N[ALIAS[ctx.expr] || ctx.expr] || EXPR_N.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    function rouage(K, x, y, r, rot) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 + rot * Math.PI / 180, rr = i % 2 ? r * 0.76 : r;
        pts.push(`${r22(x + rr * Math.cos(a))},${r22(y + rr * Math.sin(a))}`);
      }
      return P(`M${pts.join(" L")} Z`, K.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, K.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, OUT, 0) + [0, 1, 2].map((i) => {
        const a = (i * 120 + rot) * Math.PI / 180;
        return E(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, 0.32, 0.32, K.steelS, 0);
      }).join("");
    }
    __name(rouage, "rouage");
    function loupeOeil(K, view, n) {
      const [x, y] = [view === "se" ? 25.4 : 28.6, 22.6];
      const grossi = n === 0 ? E(x, y + 0.2, 2.2, 2.7, K.eye, 0) + E(x, y + 0.9, 1.7, 2, K.iris, 0) + E(x, y + 0.7, 0.8, 0.9, K.eye, 0) + E(x + 0.8, y - 0.9, 0.85, 0.85, "#FFFFFF", 0) + E(x - 0.6, y + 1.4, 0.4, 0.4, "#FFFFFF", 0) : P(`M${x - 2.4},${y + 1} Q${x},${y - 1.8} ${x + 2.4},${y + 1}`, "none", 1.3);
      return L([view === "se" ? 27.8 : 31.4, 13.6], [view === "se" ? 27.8 : 31, 19.4], K.brassS, 0.9) + E(x, y, 3.6, 3.6, K.brass, 0.9) + E(x, y, 2.9, 2.9, K.skin, 0) + grossi + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${K.glass}" fill-opacity="0.35"/>` + reflet0(`M${r22(x - 1.8)},${r22(y - 0.6)} Q${r22(x - 1.6)},${r22(y - 1.8)} ${r22(x - 0.4)},${r22(y - 2.1)}`, 0.6) + E(x, y, 2.9, 2.9, "none", 0.8) + E(x + 3.3, y - 1.2, 0.3, 0.3, K.brassS, 0) + E(x - 3.3, y + 1.2, 0.3, 0.3, K.brassS, 0);
    }
    __name(loupeOeil, "loupeOeil");
    var nathan = {
      ...rivet,
      name: "Nathan",
      uid: "na",
      teintes: [C.hair, C.shirt, C.leather, C.grey],
      sleeve: C.shirt,
      cuff: null,
      sleeves: "roll",
      foot: pied,
      // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      bras,
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      neck(c, { view }) {
        const K = pal(c);
        if (view === "ne") return P("M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z", K.skinS, 0) + P("M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z", K.collar, 0.8) + L([19.4, 32.5], [28.6, 32.5], K.collarS, 0.35);
        const k = view === "se" ? -1.6 : 0;
        return E(24 + k, 32.6, 1.6, 1.2, K.skinS, 0) + P(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, K.collar, 0.8) + P(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, K.collar, 0.8) + L([21 + k, 32.4], [22.2 + k, 33.6], K.collarS, 0.4) + L([27 + k, 32.4], [25.8 + k, 33.6], K.collarS, 0.4);
      },
      head(c, ctx, act) {
        return tete(c, ctx, act || {});
      },
      // le salut, et l'action : la loupe baissée sur l'œil, un rouage levé ; image 2, le rouage tourne, il s'émerveille
      // (« Attends… Non. Si. ») ; le tournevis dans l'autre main
      pose({ pose, n, k, view }) {
        const K = pal(this);
        if (pose === "salut") return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
        const g = rouage(K, 36.2, 25, 2.8, n ? 22.5 : 0) + (n ? L([39.8, 21], [41.2, 19.6], OUT, 0.6) + L([40.6, 24.2], [42.4, 23.8], OUT, 0.6) + L([37.8, 20.6], [38.2, 18.8], OUT, 0.6) : "");
        const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
        const tournevis = limb([14.4 + (12.8 - 14.4) * 0.35, 44.2 + (50.2 - 44.2) * 0.35], [12.8, 50.2], 0.6, K.steel) + limb([14.4, 44.2], [13.76, 46.6], 1.6, K.red);
        const left = arm(this, [16, 34], [14.4, 45]) + tournevis;
        const expr = n ? "emerveillee" : "concentree";
        if (view === "ne") return { expr, left, right: "", over: g + right };
        return { expr, lensDown: true, left, right: "", over: loupeOeil(K, view, n) + g + right };
      }
    };
    module.exports = { nathan, C, MARKS, EXPR: EXPR_N, pal, marks, reflet, rouage, crayon, cle };
  }
});

// personnages/refonte/nathan_tenues.js
var require_nathan_tenues = __commonJS({
  "personnages/refonte/nathan_tenues.js"(exports, module) {
    var { castaway, fade } = require_naufrage();
    var { SPECS } = require_naufrages();
    var { nathan, C } = require_nathan_refonte();
    var { fondre, fondu } = require_couleurs();
    var PALETTES = fondre({
      sarcelle: { nom: "Sarcelle", shirt: C.shirt, shirtS: C.shirtS, shirtH: C.shirtH },
      bordeaux: { nom: "Bordeaux", shirt: "#8A3A3A", shirtS: "#682828", shirtH: "#B0605A" },
      moutarde: { nom: "Moutarde", shirt: "#B38A2E", shirtS: "#87661E", shirtH: "#D8B25A" },
      indigo: { nom: "Indigo", shirt: "#3E5578", shirtS: "#2B3D59", shirtH: "#6E86AA" },
      ardoise: { nom: "Ardoise", shirt: "#5E6B78", shirtS: "#434E5A", shirtH: "#8794A2" },
      bouteille: { nom: "Vert bouteille", shirt: "#3E6E4A", shirtS: "#2B5134", shirtH: "#6A9A74" }
    });
    var TENUES = {
      atelier: { nom: "L'atelier : chemise et tablier de cuir", tenue: "atelier", palette: "sarcelle" },
      gilet: { nom: "Le gilet d'horloger", tenue: "gilet", palette: "sarcelle" },
      forge: { nom: "La forge : grand tablier et gants", tenue: "forge", palette: "ardoise", gants: true }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au Faubourg, des actes plus tard", marks: { grease: 0, soot: 0, salt: 0, dust: 0, dirt: 0, crack: false, pocket: "clean", patch: false } },
      poussiere: { nom: "Un peu sale", quand: "une journée à l'établi", marks: { grease: 0.8, soot: 0.3, salt: 0, dust: 1, dirt: 0.3, crack: false, pocket: "clean", patch: false } },
      rafistole: { nom: "Rafistolé", quand: "recousu au camp ; la loupe reste fêlée", marks: { grease: 0.4, soot: 0.2, salt: 0.3, dust: 0.3, dirt: 0.2, crack: true, pocket: "mended", patch: true } },
      rescape: { nom: "Rescapé", quand: "les premiers jours", marks: { grease: 1, soot: 0.5, salt: 1, dust: 0, dirt: 0.4, crack: true, pocket: "torn", patch: false } },
      naufrage: { nom: "Naufragé", quand: "sous sa voile, à trier ses vis", marks: { grease: 0.6, soot: 0.3, salt: 1, dust: 0, dirt: 0.3, crack: true, pocket: "torn", patch: false }, naufrage: true },
      trempe: { nom: "Trempé", quand: "sous l'averse, au bord de l'eau", marks: { grease: 0.5, soot: 0.2, salt: 0.4, dust: 0, dirt: 0.4, crack: true, pocket: "torn", patch: false, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["shirt", "shirtS", "shirtH", "collar", "collarS", "leather", "leatherS", "leatherH", "forge", "forgeS", "forgeH", "vest", "vestS", "vestH", "lining", "hair", "hairS", "hairH", "grey", "greyS", "greyH", "glove", "gloveS"];
    var AXE_TABLIER = { front: 24, se: 22.2, ne: 24 };
    var retourner = /* @__PURE__ */ __name((parVue, tablier) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map((it) => {
      const axe = tablier(it, v) ? AXE_TABLIER[v] : 24;
      return [Math.round((2 * axe - it[0]) * 100) / 100, ...it.slice(1)];
    })])), "retourner");
    function habiller(tenueId = "atelier", paletteId = null, etatId = "rescape") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      let pal = { ...pp };
      delete pal.nom;
      if (E.sombre) pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(pal[k] || C[k], E.sombre)]));
      const K = { ...C, ...pal };
      const c = {
        ...nathan,
        uid: `na${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        gants: !!T2.gants,
        sleeve: K.shirt,
        leg: E.sombre ? assombrir(nathan.leg, E.sombre) : nathan.leg,
        legS: E.sombre ? assombrir(nathan.legS, E.sombre) : nathan.legS,
        teintes: [K.hair, K.shirt, K.leather, K.grey]
      };
      if (!E.naufrage) return c;
      const delave = ["shirt", "shirtS", "shirtH", "collar", "collarS", "vest", "vestS", "vestH"];
      const passe = ["leather", "leatherS", "leatherH", "forge", "forgeS", "forgeH"];
      const salee = { ...Object.fromEntries(delave.map((k) => [k, fade(K[k], 0.6)])), ...Object.fromEntries(passe.map((k) => [k, fade(K[k], 0.3)])) };
      c.pal = { ...pal, ...salee };
      c.sleeve = salee.shirt;
      c.leg = fade(nathan.leg, 0.6);
      c.legS = fade(nathan.legS, 0.6);
      c.teintes = [K.hair, salee.shirt, salee.leather, K.grey];
      const S = SPECS.Rivet;
      const recol = /* @__PURE__ */ __name((col) => col === fondu("#6B4328") ? salee.leatherS : col === fondu("#3F8A86") ? salee.shirt : salee.shirtS, "recol");
      const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, recol(col), ...r])]));
      const holes = Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, w]) => [x, y, w, assombrir(salee.shirtS, 0.8)])]));
      const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, holes, sleeves: "torn", bandage: "left", over: void 0, head: void 0 };
      const droite = castaway(c, spec);
      const gauche = castaway(c, {
        ...spec,
        tatters: retourner(spec.tatters, (it) => it[2] === salee.leatherS),
        holes: retourner(spec.holes, () => false),
        rips: retourner(spec.rips, (it, v) => v !== "ne")
      });
      return { ...droite, body: /* @__PURE__ */ __name((cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), "body") };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/nathan_gestes.js
var require_nathan_gestes = __commonJS({
  "personnages/refonte/nathan_gestes.js"(exports, module) {
    var { OUT, E, P, L, limb, clip, r2: r22, arm } = require_troupe();
    var { pal, rouage } = require_nathan_refonte();
    var ACIER = "#5E646C";
    var ACIER_S = "#3E434A";
    var ACIER_H = "#8A929C";
    var BOIS = "#8A5A36";
    var SOUCHE = "#9C7A52";
    var SOUCHE_S = "#7A5C3A";
    var FER = "#FF8A3C";
    var FER_H = "#FFD25A";
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.gants ? pal(c).glove : c.hand || c.skin) + (c.gants ? E(h[0] - 0.6, h[1] - 0.6, 0.7, 0.5, "#B98858", 0) : ""), "poing");
    function paume(c, [x, y], k) {
      const f = c.gants ? pal(c).glove : c.hand || c.skin;
      return P(`M${r22(x - 2.2)},${r22(y - 0.6)} Q${x},${r22(y + 0.4)} ${r22(x + 2.2)},${r22(y - 0.6)} Q${r22(x + 2.1)},${r22(y + 1.9)} ${x},${r22(y + 2)} Q${r22(x - 2.1)},${r22(y + 1.9)} ${r22(x - 2.2)},${r22(y - 0.6)} Z`, f, 0.9) + E(x + k * 2.2, y - 0.4, 0.8, 1, f, 0.75) + L([x - 1.2, y + 0.9], [x + 1.2, y + 0.9], OUT, 0.35);
    }
    __name(paume, "paume");
    var clic = /* @__PURE__ */ __name((x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => L([x + dx * 1.2, y + dy * 1.2], [x + dx * 2.6, y + dy * 2.6], OUT, 1.5) + L([x + dx * 1.2, y + dy * 1.2], [x + dx * 2.6, y + dy * 2.6], "#FFF6CC", 0.6)).join(""), "clic");
    var etincelles = /* @__PURE__ */ __name((x, y, n) => (n % 2 ? [[-3.6, -2.4], [-1.6, -4], [2.4, -3.6], [4, -1.6], [0.6, -4.6]] : [[-3.2, -3.2], [-0.4, -4.4], [1.8, -4], [3.6, -2.6], [-4.2, -1]]).map(([dx, dy], i) => L([x + dx * 0.45, y + dy * 0.45], [x + dx, y + dy], i % 2 ? FER : FER_H, 0.7) + E(x + dx * 1.15, y + dy * 1.15, 0.28, 0.28, FER_H, 0)).join(""), "etincelles");
    function mecanisme(c, x, y, n) {
      const K = pal(c);
      return E(x, y, 2.9, 2.7, K.brass, 0.9) + E(x + 0.8, y + 0.7, 1.9, 1.6, K.brassS, 0) + rouage(K, x - 0.6, y - 0.4, 1.5, n * 22.5) + E(x + 1.6, y - 1.4, 0.32, 0.32, K.steel, 0.3) + E(x - 1.8, y + 1.4, 0.32, 0.32, K.steel, 0.3) + E(x + 1.3, y + 0.9, 0.4, 0.4, OUT, 0);
    }
    __name(mecanisme, "mecanisme");
    function tournevis(c, h, t, tour) {
      const K = pal(c), m = [h[0] + (t[0] - h[0]) * 0.42, h[1] + (t[1] - h[1]) * 0.42];
      const lo = [h[0] - (t[0] - h[0]) * 0.18, h[1] - (t[1] - h[1]) * 0.18];
      return limb(m, t, 0.6, K.steel) + limb(lo, m, 1.6, K.red) + L([lo[0] + (m[0] - lo[0]) * (0.3 + tour * 0.3), lo[1] + (m[1] - lo[1]) * (0.3 + tour * 0.3)], [lo[0] + (m[0] - lo[0]) * (0.5 + tour * 0.3), lo[1] + (m[1] - lo[1]) * (0.5 + tour * 0.3)], "#F08A80", 0.5);
    }
    __name(tournevis, "tournevis");
    function enclume(x, y, uid, chaud = true) {
      const t = `M${r22(x - 6.6)},${r22(y)} Q${r22(x - 9)},${r22(y - 0.2)} ${r22(x - 9.4)},${r22(y - 1.6)} Q${r22(x - 7.4)},${r22(y - 1.8)} ${r22(x - 5.4)},${r22(y - 2)} L${r22(x + 5.6)},${r22(y - 2)} L${r22(x + 5.6)},${r22(y + 0.6)} L${r22(x + 3.4)},${r22(y + 1.2)} L${r22(x + 3)},${r22(y + 3.4)} L${r22(x + 4.6)},${r22(y + 4.8)} L${r22(x - 4.6)},${r22(y + 4.8)} L${r22(x - 3)},${r22(y + 3.4)} L${r22(x - 3.4)},${r22(y + 1.2)} Z`;
      const souche = `M${r22(x - 5.4)},${r22(y + 4.6)} L${r22(x + 5.4)},${r22(y + 4.6)} L${r22(x + 5.8)},${r22(y + 10.2)} Q${x},${r22(y + 11.2)} ${r22(x - 5.8)},${r22(y + 10.2)} Z`;
      return P(souche, SOUCHE) + clip(`${uid}so`, souche, `<rect x="${r22(x + 2)}" y="${r22(y + 4)}" width="5" height="8" fill="${SOUCHE_S}"/><path d="M${r22(x - 3.6)},${r22(y + 6)} L${r22(x - 3.4)},${r22(y + 9.6)} M${r22(x - 0.6)},${r22(y + 6.2)} L${r22(x - 0.4)},${r22(y + 10)}" stroke="${SOUCHE_S}" stroke-width="0.4"/>`) + P(souche, "none") + P(t, ACIER) + clip(`${uid}en`, t, `<rect x="${r22(x + 1.6)}" y="${r22(y - 3)}" width="6" height="9" fill="${ACIER_S}"/><rect x="${r22(x - 5.4)}" y="${r22(y - 2)}" width="11" height="0.7" fill="${ACIER_H}"/>`) + P(t, "none") + (chaud ? P(`M${r22(x - 2.8)},${r22(y - 2)} L${r22(x + 2)},${r22(y - 2.3)} L${r22(x + 2.2)},${r22(y - 3.2)} L${r22(x - 2.6)},${r22(y - 3)} Z`, FER, 0.6) + L([x - 1.8, y - 2.6], [x + 1.2, y - 2.8], FER_H, 0.45) : "");
    }
    __name(enclume, "enclume");
    function marteau(h, t) {
      const len = Math.hypot(t[0] - h[0], t[1] - h[1]) || 1, ux = (t[0] - h[0]) / len, uy = (t[1] - h[1]) / len;
      const lo = [h[0] - ux * 1.4, h[1] - uy * 1.4], nx = -uy, ny = ux;
      const tete = `M${r22(t[0] + nx * 2.2 - ux * 1.1)},${r22(t[1] + ny * 2.2 - uy * 1.1)} L${r22(t[0] + nx * 2.2 + ux * 1.1)},${r22(t[1] + ny * 2.2 + uy * 1.1)} L${r22(t[0] - nx * 1.6 + ux * 1.1)},${r22(t[1] - ny * 1.6 + uy * 1.1)} L${r22(t[0] - nx * 1.6 - ux * 1.1)},${r22(t[1] - ny * 1.6 - uy * 1.1)} Z`;
      return limb(lo, t, 1.2, BOIS) + P(tete, ACIER, 0.8) + L([t[0] + nx * 1.6 - ux * 0.6, t[1] + ny * 1.6 - uy * 0.6], [t[0] - nx * 1 - ux * 0.6, t[1] - ny * 1 - uy * 0.6], ACIER_H, 0.4);
    }
    __name(marteau, "marteau");
    var pince = /* @__PURE__ */ __name((h, t) => limb(h, t, 0.55, ACIER_S) + limb([h[0], h[1] + 0.6], [t[0], t[1] + 0.5], 0.55, ACIER_S), "pince");
    function tictac(c, x, y, { vole = false, n = 0, arret = false, k = 1, cle = 0 } = {}) {
      const K = pal(c), id = `${c.uid}tt${n}${vole ? "v" : ""}${arret ? "a" : ""}`;
      const corps = `M${r22(x - 2.3)},${y} a2.3,1.7 0 1,0 4.6,0 a2.3,1.7 0 1,0 -4.6,0 Z`;
      const aile = /* @__PURE__ */ __name((dx, dy, a) => `<ellipse cx="${r22(x + dx)}" cy="${r22(y + dy)}" rx="1.1" ry="2" fill="#E2F2F8" fill-opacity="0.85" stroke="${OUT}" stroke-width="0.45" transform="rotate(${a} ${r22(x + dx)} ${r22(y + dy)})"/>`, "aile");
      let s = "";
      s += vole ? n % 2 ? aile(-0.6, -2.2, -30) + aile(0.6, -2.4, 20) : aile(-1.2, -1.6, -60) + aile(0.2, -2.6, -5) : aile(-0.4, -1.8, -40);
      s += P(corps, K.brass) + clip(id, corps, [-1, 0.4].map((dx) => `<rect x="${r22(x + dx * k)}" y="${r22(y - 2)}" width="0.8" height="4" fill="${K.brassS}"/>`).join("")) + P(corps, "none");
      s += `<g transform="rotate(${cle} ${r22(x - k * 1.6)} ${r22(y - 1.6)})">${limb([x - k * 1.2, y - 1.2], [x - k * 1.6, y - 2.4], 0.4, K.brass)}${E(x - k * 2.2, y - 2.8, 0.75, 0.45, K.brass, 0.4)}${E(x - k * 1, y - 2.9, 0.75, 0.45, K.brass, 0.4)}</g>`;
      const hx = x + k * 2.4, hy = y - 0.6;
      s += E(hx, hy, 1.55, 1.45, K.steel, 0.7) + E(hx - k * 0.4, hy - 0.6, 0.5, 0.3, "#E2E8EE", 0) + E(hx - k * 0.7, hy - 1, 0.22, 0.22, K.brassH, 0.25);
      s += arret ? P(`M${r22(hx + k * 0.1 - 0.5)},${r22(hy - 0.5)} l1,1 M${r22(hx + k * 0.1 + 0.5)},${r22(hy - 0.5)} l-1,1`, "none", 0.45) : E(hx + k * 0.3, hy, 0.62, 0.7, OUT, 0) + E(hx + k * 0.12, hy - 0.25, 0.25, 0.25, "#FFFFFF", 0);
      s += P(`M${r22(x - k * 2.3)},${r22(y + 0.2)} L${r22(x - k * 3.2)},${r22(y + 0.5)} L${r22(x - k * 2.3)},${r22(y + 0.8)} Z`, OUT, 0);
      return s;
    }
    __name(tictac, "tictac");
    function visser({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, d = view === "se" ? -1.8 : 0;
      const expr = ["concentree", "concentree", "concentree", "sourire"][i];
      if (view === "ne") {
        const o = [0, 0.6, 0, 0.6][i];
        return { expr, left: "", right: "", under: arm(this, a, [a[0] + 3, a[1] + 7.6], [a[0] - 5, a[1] + 5.6]) + arm(this, b, [b[0] - 3, b[1] + 7.2 - o], [b[0] + 5.6, b[1] + 5.2 - o]), over: i === 3 ? clic(38.4, 30) : "" };
      }
      const m = [21.6 + d, 39], tient = [20.6 + d, 41.8];
      const h = [[27.8, 39.6], [27.6, 39.2], [27.8, 39.6], [28.2, 40.2]][i].map((v, j) => j ? v : v + d);
      const t = [m[0] + 1.3, m[1] + 0.9];
      const gauche = arm(this, a, tient, [a[0] - 4.2, a[1] + 6.4], mecanisme(this, m[0], m[1], i) + poing(this, tient));
      const droite = arm(this, b, h, [b[0] + 3.6, b[1] + 8], tournevis(this, h, t, i % 2) + poing(this, h));
      const over = i === 3 ? clic(m[0] + 1.4, m[1] - 3.2) : "";
      if (view === "se") return { expr, right: "", left: gauche, over: droite + over };
      return { expr, left: gauche, right: droite, over };
    }
    __name(visser, "visser");
    function forger({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, frappe = i % 2 === 1;
      const expr = frappe ? "decidee" : "concentree";
      if (view === "ne") {
        if (!frappe) return { expr, left: "", under: arm(this, a, [a[0] + 3, a[1] + 8.6], [a[0] - 4.6, a[1] + 6]), right: marteau([b[0] + 3.2, b[1] - 4.4], [b[0] + 6.6, b[1] - 11.2]) + arm(this, b, [b[0] + 3.2, b[1] - 4.4], [b[0] + 5.6, b[1] + 3]) };
        return { expr, left: "", right: "", under: arm(this, a, [a[0] + 3, a[1] + 8.6], [a[0] - 4.6, a[1] + 6]) + arm(this, b, [b[0] - 3, b[1] + 9], [b[0] + 5.4, b[1] + 5]), over: etincelles(8.6, 50, n) + etincelles(39.4, 50.4, n + 1) };
      }
      const se = view === "se", x = se ? 18 : 24, y = 52, d = se ? -1.8 : 0;
      const pinceMain = se ? b : a, marteauMain = se ? a : b;
      const tient = se ? [24.8, 42.2] : [18.2, 44.8];
      const pinceD = pince([tient[0] + (se ? -1 : 1), tient[1] + 0.4], [x - 1.8, y - 2.8]);
      const brasPince = arm(this, pinceMain, tient, se ? [b[0] + 2.4, b[1] + 7.4] : [a[0] - 3.6, a[1] + 7.4], pinceD + poing(this, tient));
      const H = frappe ? se ? [18, 43.6] : [x + 4.6, y - 7.4] : se ? [a[0] - 2.6 + d, a[1] - 3.6] : [b[0] + 2.6 + d, b[1] - 3.6];
      const tete = frappe ? [x + 0.4, y - 4.4] : se ? [a[0] - 3.6 + d, a[1] - 11.2] : [b[0] + 3.6 + d, b[1] - 11.2];
      const brasMarteau = marteau(H, tete) + arm(this, marteauMain, H, frappe ? se ? [a[0] - 4.4, a[1] + 6.4] : [b[0] + 4.4 + d, b[1] + 6.4] : se ? [a[0] - 5.4, a[1] + 3] : [b[0] + 5.4 + d, b[1] + 3]);
      const over = enclume(x, y, this.uid, true) + brasPince + brasMarteau + (frappe ? etincelles(x + 0.4, y - 3.4, n) : "");
      return { expr, left: "", right: "", over };
    }
    __name(forger, "forger");
    function remonter({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, d = view === "se" ? -1.8 : 0;
      const expr = ["concentree", "concentree", "sourire", "ironique"][i];
      if (view === "ne") return { expr };
      const main = [20.6 + d, 41.4];
      const gauche = arm(this, a, main, [a[0] - 4, a[1] + 6.6], paume(this, main, 1));
      let tt = "", droite;
      if (i < 2) {
        tt = tictac(this, main[0] + 0.2, main[1] - 2.4, { k: -1, cle: i ? 90 : 0 });
        const h = [main[0] + 4.6, main[1] - 4.8];
        droite = arm(this, b, h, [b[0] + 4.4, b[1] + 7.4]);
      } else {
        droite = arm(this, b, [b[0] + 1.6 + d, b[1] + 11]);
        tt = i === 2 ? tictac(this, 40.4 + d, 13.6, { vole: true, n, k: -1 }) + L([36.4 + d, 19.4], [37.8 + d, 17.6], OUT, 0.5) + L([38.4 + d, 20.4], [39.4 + d, 18.6], OUT, 0.5) : tictac(this, main[0] + 0.6, main[1] - 5.6, { arret: true, k: 1 }) + L([main[0] - 1.6, main[1] - 9.4], [main[0] - 1.6, main[1] - 8], OUT, 0.5) + L([main[0] + 2.6, main[1] - 9.6], [main[0] + 2.6, main[1] - 8.2], OUT, 0.5);
      }
      if (view === "se") return { expr, right: i < 2 ? "" : droite, left: gauche, over: (i < 2 ? droite : "") + tt };
      return { expr, left: gauche, right: droite, over: tt };
    }
    __name(remonter, "remonter");
    var boite = /* @__PURE__ */ __name((x, y) => `<rect x="${r22(x - 4)}" y="${r22(y - 2)}" width="8" height="4" rx="0.8" fill="#B8C0C8" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(x - 3.2)}" y="${r22(y - 1.4)}" width="6.4" height="1.6" rx="0.5" fill="#6E7680"/>` + L([x, y - 1.4], [x, y + 0.2], OUT, 0.4) + [[-2.2, -0.9], [-1.1, -1.1], [1, -0.8], [2.2, -1]].map(([dx, dy]) => E(x + dx, y + dy, 0.55, 0.45, "#D9C27A", 0.4)).join(""), "boite");
    var vis = /* @__PURE__ */ __name((x, y, a) => `<g transform="rotate(${a} ${r22(x)} ${r22(y)})">${L([x, y], [x + 2, y], OUT, 1.2)}${L([x, y], [x + 2, y], "#B8C0C8", 0.55)}${E(x, y, 0.7, 0.7, "#D9C27A", 0.45)}</g>`, "vis");
    function trier({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, d = view === "se" ? -1.8 : 0;
      const expr = ["veille", "examine", "concentree", "sourire"][i];
      if (view === "ne") return { expr };
      if (view === "se") {
        const bx2 = 24.6, by2 = 42.6, tient2 = [bx2 + 1.4, by2 + 2.2];
        const fond = arm(this, b, tient2, [b[0] + 2.4, b[1] + 7.4], boite(bx2, by2) + poing(this, tient2));
        const H2 = [[bx2 - 1.8, by2 - 1.8], [11.4, 25.6], [bx2 - 2.4, by2 - 2.6], [a[0] - 1.6, a[1] + 11]][i];
        const v2 = i === 0 ? vis(H2[0] + 1, H2[1] - 1.6, -120) : i === 1 ? vis(H2[0] + 0.6, H2[1] - 2.4, -80) : i === 2 ? vis(H2[0] + 1, H2[1] - 1.4, 100) : "";
        const proche = arm(this, a, H2, i === 3 ? null : i === 1 ? [a[0] - 6, a[1] + 3.4] : [a[0] - 4.6, a[1] + 6.4]) + v2;
        return { expr: i === 1 ? "mefiante" : expr, right: "", left: "", over: fond + proche + (i === 3 ? clic(bx2 - 0.4, by2 - 3.4) : "") };
      }
      const bx = 21 + d, by = 42.4, tient = [bx - 1.4, by + 2.2];
      const gauche = arm(this, a, tient, [a[0] - 4, a[1] + 7], boite(bx, by) + poing(this, tient));
      const H = [[bx + 1.8, by - 1.8], [38.4 + d, 27.6], [bx + 2.4, by - 2.6], [b[0] + 1.6 + d, b[1] + 11]][i];
      const v = i === 0 ? vis(H[0] - 1, H[1] - 1.6, -60) : i === 1 ? vis(H[0] - 0.6, H[1] - 2.4, -100) : i === 2 ? vis(H[0] - 1, H[1] - 1.4, 80) : "";
      const droite = arm(this, b, H, i === 3 ? null : i === 1 ? [b[0] + 6.4 + d, b[1] + 3.4] : [b[0] + 4.6 + d, b[1] + 6.4]) + v;
      const over = i === 3 ? clic(bx + 0.4, by - 3.4) : "";
      return { expr, left: gauche, right: droite, over };
    }
    __name(trier, "trier");
    var GESTES = { visser, forger, remonter, trier };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, tictac, enclume, marteau };
  }
});

// personnages/refonte/nathan_anims.js
var require_nathan_anims = __commonJS({
  "personnages/refonte/nathan_anims.js"(exports, module) {
    var { frame, IMAGES, E, arm, r2: r22 } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES, dessinerPose } = require_lorena_poses();
    var { avec } = require_nathan_gestes();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: "Il attend, ailleurs : il pense déjà à autre chose.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.1, dirs: MOUVANTES, contexte: "Il va de l'établi au camp, le nez en l'air.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.065,
        dirs: MOUVANTES,
        contexte: "L'urgence : une clôture qui cède, la brume, Tic-Tac qui file.",
        // la marche, pliée et pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au
        // contact du pied
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "inquiete");
          const up = [0, -0.3, -0.5, -0.3, 0, -0.3, -0.5, -0.3][n % 8] + (avant(v) ? 0.8 : 0.3);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 5, `<g transform="translate(0 ${r22(up)})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.13,
        dirs: MOUVANTES,
        contexte: "Il arrive, freine, puis se pose (« Attends… Non. Si. »).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "pensive")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.22, dirs: ["face"], contexte: "Il salue le joueur, de loin.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e || "sourire"), "img") },
      loupe: { nom: "Travail : la loupe", images: IMAGES.action, dt: 0.45, dirs: TOUTES, contexte: "Il examine un rouage à la loupe ; il tourne : eurêka.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "action", n, e), "img") },
      visser: { nom: "Travail : visser", images: 4, dt: 0.24, dirs: TOUTES, contexte: "À l'établi : créer (le puzzle, l'assemblage) ; « clic ».", img: metier("visser") },
      forger: { nom: "Travail : forger", images: 4, dt: 0.2, dirs: TOUTES, contexte: "Au Faubourg, sa forge : le marteau, l'enclume, le fer rougi.", img: metier("forger") },
      remonter: { nom: "Travail : remonter Tic-Tac", images: 4, dt: 0.4, dirs: DEVANT, contexte: "Tic-Tac s'envole… et s'arrête au mauvais moment.", img: metier("remonter") },
      trier: { nom: "Travail : trier ses vis", images: 4, dt: 0.45, dirs: DEVANT, contexte: "Son arrivée : il trie ses vis, sous sa voile.", img: metier("trier") },
      dodo: {
        nom: "Dodo, assis",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        contexte: "La nuit, au camp : sa boîte de vis sur les genoux, des vis tombées par terre.",
        // (assis, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre, avec une marge pour
        // les fils qui pendent au bout ; la chemise trempée ne goutte plus)
        // (les mains de chaque côté de la boîte, à portée de ses bras, membres.js)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Rivet.dy + 1.2 }), "body") }, n, {
          ...D.POSES.Rivet,
          arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [19.4, 52.8], [13.4, 50.4]) + arm(cc, r, [28.6, 52.8], [34.6, 50.4]), "arms")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couché",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, sous une couverture rapiécée (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#7A6250", motif: "#C9A24A" }), "img")
      }
    };
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: DEVANT, pose: true, contexte: "Dialogue, réaction (quête, surprise, froid, victoire).", img: /* @__PURE__ */ __name((c, v, n, e) => dessinerPose(c, k, v, n, e), "img") };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/refonte/leo_gestes.js
var require_leo_gestes = __commonJS({
  "personnages/refonte/leo_gestes.js"(exports, module) {
    var { OUT, E, P, L, r2: r22, limb, arm } = require_troupe();
    var { pal, marks, baguette, bocal, goutte, HY } = require_leo_refonte();
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin), "poing");
    function fourche(K, hl, hr, tip) {
      const j = [(hl[0] + hr[0]) / 2 + (tip[0] - (hl[0] + hr[0]) / 2) * 0.18, (hl[1] + hr[1]) / 2 + (tip[1] - (hl[1] + hr[1]) / 2) * 0.18];
      return limb(hl, j, 1.1, K.wood) + limb(hr, j, 1.1, K.wood) + limb(j, tip, 1.25, K.wood) + L([j[0] + (tip[0] - j[0]) * 0.45 - 0.2, j[1] + (tip[1] - j[1]) * 0.45], [j[0] + (tip[0] - j[0]) * 0.6 - 0.1, j[1] + (tip[1] - j[1]) * 0.6], K.bark, 0.45) + `<g transform="rotate(-30 ${r22(hl[0] + 0.6)} ${r22(hl[1] - 0.6)})">${P(`M${r22(hl[0] + 0.6)},${r22(hl[1] - 0.6)} q-1.3,-1.1 -2.6,0 q1.3,1.1 2.6,0 Z`, K.leaf, 0.5)}</g>`;
    }
    __name(fourche, "fourche");
    var fremit = /* @__PURE__ */ __name((tip, fort) => [-1, 1].map((s) => L([tip[0] + s * 1.2, tip[1] - 0.6], [tip[0] + s * (fort ? 2.6 : 2), tip[1] - (fort ? 1.6 : 1.1)], OUT, 0.5)).join(""), "fremit");
    var jaillit = /* @__PURE__ */ __name((K, x, y) => E(x, y + 0.4, 3.4, 0.9, K.water, 0.5) + goutte(x - 2.2, y - 3.4, 0.9) + goutte(x + 2.4, y - 2.8, 0.8) + goutte(x + 0.2, y - 5, 0.7), "jaillit");
    var cle = /* @__PURE__ */ __name((x, y) => E(x - 1.6, y - 0.6, 1.2, 1.2, "none", 0.8) + L([x - 0.5, y - 0.4], [x + 2.6, y - 0.2], OUT, 1.6) + L([x - 0.5, y - 0.4], [x + 2.6, y - 0.2], "#C9A24A", 0.8) + L([x + 1.8, y - 0.2], [x + 1.8, y + 0.8], OUT, 0.8) + L([x + 2.5, y - 0.2], [x + 2.5, y + 0.6], OUT, 0.8) + [[0, -1], [0.75, -0.65], [-0.75, -0.65]].map(([dx, dy]) => L([x + 0.8 + dx * 1.6, y - 2 + dy * 1.6], [x + 0.8 + dx * 2.8, y - 2 + dy * 2.8], "#F2C94C", 0.55)).join(""), "cle");
    function sourcier({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["veille", "concentree", "concentree", "reveil"][i];
      const hl = se ? [18.8, 45.2] : [21.2, 45.4], hr = se ? [24, 45.6] : [26.8, 45.4];
      const leve = se ? [12.4, 37.4] : [37.4, 34.4], sol = se ? [12.2, 57.6] : [24.6, 56.6];
      const tip = i === 3 ? sol : [leve[0] + (i === 2 ? se ? -0.4 : 0.5 : 0), leve[1] + (i === 2 ? 0.4 : 0)];
      if (view === "ne") {
        const u = i === 3 ? 1 : 0;
        return {
          expr,
          left: "",
          right: "",
          under: arm(this, a, [a[0] + 2.8, a[1] + 4.4 + u * 1.2], [a[0] - 3.6, a[1] + 5]) + arm(this, b, [b[0] - 2.8, b[1] + 4.4 + u * 1.2], [b[0] + 3.6, b[1] + 5]),
          over: i === 3 ? goutte(10.6, 57.4, 0.9) + goutte(37.6, 57, 0.9) : ""
        };
      }
      const tiges = fourche(K, hl, hr, tip) + (i === 1 || i === 2 ? fremit(tip, i === 2) : "") + (i === 3 ? jaillit(K, sol[0], sol[1] + 3) : "");
      return { expr, left: "", right: "", over: arm(this, a, hl, [a[0] - 2.4, a[1] + 5.4]) + arm(this, b, hr, [b[0] + 2.4, b[1] + 5.4]) + tiges + poing(this, hl) + poing(this, hr) };
    }
    __name(sourcier, "sourcier");
    function chercher({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["concentree", "concentree", "pensive", "emerveillee"][i];
      const h = se ? [19.2, 44.2] : [20.6, 44.4];
      const rot = [-55, 40, -10, 0][i];
      const trouve = se ? [12.4, 58] : [19.4, 58.4];
      const g = arm(this, b, this.hands[1]);
      if (view === "ne") {
        const hd = [b[0] - 2.8, b[1] + 4.4];
        return { expr, left: arm(this, a, this.hands[0]), right: "", under: (i === 3 ? "" : baguette(K, hd, 1, -rot)) + arm(this, b, hd, [b[0] + 3.6, b[1] + 5]), over: i === 3 ? cle(31.6, 57) : "" };
      }
      const tige = i === 3 ? fourche(K, h, [h[0] + 1.6, h[1] + 0.4], [trouve[0] + 0.6, trouve[1] - 3.4]) : baguette(K, h, -1, rot);
      return { expr, left: "", right: g, over: (i === 3 ? cle(trouve[0], trouve[1]) : "") + tige + arm(this, a, h, [a[0] - 2.2, a[1] + 5.6]) };
    }
    __name(chercher, "chercher");
    function bulle({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), M = marks(this), i = n % 4, se = view === "se";
      const revenu = M.bulle;
      const expr = revenu ? ["veille", "tendresse", "sourire", "tendresse"][i] : ["veille", "triste", "pensive", "veille"][i];
      const x = se ? 20.4 : 24, y = [46.4, 41.2, 41, 43.2][i];
      if (view === "ne") return { expr, left: "", right: "", under: arm(this, a, [x - 2.6, y + 0.4], [a[0] - 2.4, a[1] + 5]) + arm(this, b, [x + 2.6, y + 0.4], [b[0] + 2.4, b[1] + 5]) };
      const verre = bocal(K, x, y, revenu) + (revenu && i === 2 ? E(x + 0.6, y - 4.2, 0.45, 0.45, "#FFFFFF", 0.3) + E(x + 1.4, y - 6, 0.32, 0.32, "#FFFFFF", 0.25) : "");
      return { expr, left: "", right: "", over: verre + arm(this, a, [x - 2.6, y + 0.4], [a[0] - 2.6, a[1] + 5.2]) + arm(this, b, [x + 2.6, y + 0.4], [b[0] + 2.6, b[1] + 5.2]) };
    }
    __name(bulle, "bulle");
    var croissant = /* @__PURE__ */ __name((x, y, r) => P(`M${r22(x)},${r22(y - r)} A${r},${r} 0 1,0 ${r22(x)},${r22(y + r)} A${r22(r * 0.75)},${r22(r * 0.85)} 0 1,1 ${r22(x)},${r22(y - r)} Z`, "#F7E9A8", 0.7), "croissant");
    function lune({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["pensive", "emerveillee", "tendresse", "emerveillee"][i];
      const lever = [0, 1, 1, 0.8][i];
      const h = [r22(a[0] - 2.6 - lever * 1.4), r22(a[1] - 4 - lever * 3.6)];
      const paume = P(`M${r22(h[0] - 1.8)},${r22(h[1] + 0.4)} Q${r22(h[0] - 1.6)},${r22(h[1] - 1.8)} ${r22(h[0] + 0.2)},${r22(h[1] - 2.2)} Q${r22(h[0] + 1.8)},${r22(h[1] - 1.6)} ${r22(h[0] + 1.6)},${r22(h[1] + 0.6)} Q${h[0]},${r22(h[1] + 1.8)} ${r22(h[0] - 1.8)},${r22(h[1] + 0.4)} Z`, this.hand || this.skin, 0.8);
      const ciel = croissant(6.4, 6.6, 2.6) + (i % 2 ? E(9.8, 3.4, 0.45, 0.45, "#FFFFFF", 0) : E(3.4, 10.4, 0.4, 0.4, "#FFFFFF", 0));
      const bx = se ? 18.4 : 21.4, by = 27 + HY;
      const chut = [[0, 0], [-1.4, -1.6], [-2.8, -3.4]].slice(0, i).map(([dx, dy], j) => E(bx + dx, by + dy, r22(0.4 - j * 0.06), r22(0.4 - j * 0.06), "#FFFFFF", 0.3)).join("");
      const droite = baguette(K, this.hands[1], 1) + arm(this, b, this.hands[1]);
      if (view === "ne") return { expr, left: arm(this, a, h, [a[0] - 3.4, a[1] - 1.4], paume), right: droite, over: ciel };
      return { expr, left: arm(this, a, h, [a[0] - 3.4, a[1] - 1.4], paume), right: droite, over: ciel + chut };
    }
    __name(lune, "lune");
    function bailler({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["epuisee", "baille", "endormie", "reveil"][i];
      const droite = baguette(K, this.hands[1], 1, i === 2 ? 14 : 0) + arm(this, b, this.hands[1]);
      const bouche = se ? [20.6, 33.4] : [23.4, 33.6];
      if (i === 1) return { expr, left: "", right: droite, over: arm(this, a, bouche, [a[0] - 3, a[1] + 3]) };
      if (view === "ne") return { expr, left: arm(this, a, this.hands[0]), right: droite };
      if (i === 3) return { expr, left: arm(this, a, [a[0] - 4.6, a[1] + 6.8], [a[0] - 3.2, a[1] + 3.2]), right: baguette(K, [b[0] + 4.6, b[1] + 6.8], 1, -20) + arm(this, b, [b[0] + 4.6, b[1] + 6.8], [b[0] + 3.2, b[1] + 3.2]) };
      return { expr, left: arm(this, a, this.hands[0]), right: droite };
    }
    __name(bailler, "bailler");
    var GESTES = { sourcier, chercher, bulle, lune, bailler };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, fourche, cle };
  }
});

// personnages/refonte/leo_refonte.js
var require_leo_refonte = __commonJS({
  "personnages/refonte/leo_refonte.js"(exports, module) {
    var { P, E, L, clip, limb, r2: r22, OUT, lerp, arm, bareFoot } = require_troupe();
    var ondin = require_ondin();
    var { EXPR, ALIAS, X, eye: oeilTroupe, brow, mouth, extras } = require_visage();
    var eye = /* @__PURE__ */ __name((...a) => oeilTroupe(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, ""), "eye");
    var { seam, suitOurlet } = require_tissu();
    var { fabriquerBras } = require_lorena_bras();
    var { jambe } = require_membres();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var { fondre } = require_couleurs();
    var HY = 4.4;
    var C = fondre({
      skin: "#F5CFA8",
      skinS: "#E0AE86",
      lid: "#F1C7A0",
      under: "#D9A786",
      cheek: "#F29C94",
      eye: "#231B18",
      iris: "#3F7FB8",
      irisL: "#A6D4F2",
      eyeRx: 1.9,
      eyeRy: 2.55,
      brow: "#B8862E",
      browW: 0.75,
      mouth: "#7A3B30",
      hair: "#E2B45A",
      hairS: "#B98A3A",
      hairH: "#F6D58E",
      hairD: "#9C7230",
      coat: "#3D7CC9",
      coatS: "#2E5F9E",
      coatH: "#7DB0E8",
      lining: "#A9CBEF",
      rim: "#BFE6F6",
      cap: "#BFD3F2",
      capS: "#93AEDB",
      cream: "#F4EEDF",
      creamS: "#DCCDB5",
      pyj: "#9FC3E8",
      pyjS: "#7EA4CC",
      pyjStripe: "#F4EEDF",
      knit: "#C26B3A",
      knitS: "#994F27",
      knitH: "#DE8A55",
      rope: "#D8C08A",
      ropeS: "#B49A62",
      wood: "#A8743F",
      woodS: "#7E5530",
      bark: "#8A5E34",
      leaf: "#7BB661",
      leafS: "#5A9446",
      glass: "#D6ECF2",
      cork: "#B07E4C",
      water: "#A9DCFF",
      fish: "#F08A3E",
      fishS: "#C8642A",
      salt: "#FFF8E8",
      sand: "#E8D3A2",
      sandS: "#C9B07A",
      mud: "#7A5E40",
      weed: "#5E9A62",
      weedS: "#3F7646",
      patch: "#8FB4DE",
      cloth: "#E6D4AE"
    });
    var MARKS = { salt: 0.6, sand: 0.8, dirt: 0.2, weed: true, patch: false, wet: false, bulle: false, wrist: false, pompon: "entier" };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      const t = c.tenue || "cire";
      const [m, mS, mH] = t === "pyjama" ? [K.pyj, K.pyjS, K.pyj] : t === "tricot" ? [K.knit, K.knitS, K.knitH] : [K.coat, K.coatS, K.coatH];
      return { ...K, coat: m, coatS: mS, coatH: mH, shirt: m, shirtS: mS };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_L = {
      ...EXPR,
      veille: X({ brow: [-0.35, 0.2, -0.55], lid: 0.34, tilt: -0.06, look: [0.15, -0.3], under: 0.35, mouth: "soft" }),
      reveil: X({ brow: [-1.3, -1, -0.9], lid: 0, wide: true, look: [0, 0], under: 0.4, mouth: "o" }),
      // le bâillement : les yeux fermés, la bouche grande ouverte (une bouche à lui, dessinée par tete)
      baille: X({ brow: [-0.8, 0.4, -0.3], mode: "closed", under: 0.6, mouth: "yawn" }),
      concentree: { ...EXPR.concentree, mouth: "press" }
    };
    function baguette(K, h, side = 1, rot = 0) {
      const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.4, h[1] + 9.4];
      const s = limb(h, j, 1.1, K.wood) + limb(j, b, 1.1, K.wood) + limb(j, tip, 1.25, K.wood) + L([j[0] - side * 0.15, j[1] + 2.2], [j[0] - side * 0.05, j[1] + 3.2], K.bark, 0.45) + L([tip[0] + side * 0.05, tip[1] - 2.6], [tip[0] + side * 0.15, tip[1] - 1.6], K.bark, 0.45) + E(j[0] + side * 0.35, j[1] + 4.6, 0.32, 0.32, K.bark, 0) + `<g transform="rotate(${side * -35} ${r22(b[0])} ${r22(b[1])})">${P(`M${r22(b[0])},${r22(b[1])} Q${r22(b[0] + side * 1.3)},${r22(b[1] - 1.1)} ${r22(b[0] + side * 2.6)},${r22(b[1])} Q${r22(b[0] + side * 1.3)},${r22(b[1] + 1.1)} ${r22(b[0])},${r22(b[1])} Z`, K.leaf, 0.55)}${L([b[0] + side * 0.3, b[1]], [b[0] + side * 2.1, b[1]], K.leafS, 0.35)}</g>`;
      return rot ? `<g transform="rotate(${rot} ${r22(h[0])} ${r22(h[1])})">${s}</g>` : s;
    }
    __name(baguette, "baguette");
    function bocal(K, x, y, bulle) {
      const d = `M${r22(x - 1.6)},${r22(y - 1.6)} L${r22(x + 1.6)},${r22(y - 1.6)} Q${r22(x + 2.1)},${r22(y - 1.2)} ${r22(x + 2)},${y} L${r22(x + 1.9)},${r22(y + 1.9)} Q${x},${r22(y + 2.6)} ${r22(x - 1.9)},${r22(y + 1.9)} L${r22(x - 2)},${y} Q${r22(x - 2.1)},${r22(y - 1.2)} ${r22(x - 1.6)},${r22(y - 1.6)} Z`;
      let s = `<path d="${d}" fill="${K.glass}" fill-opacity="0.6"/>`;
      if (bulle) {
        s += clip(`${x}b${y}`.replace(/\./g, ""), d, `<rect x="${r22(x - 2.2)}" y="${r22(y - 0.6)}" width="4.4" height="3.4" fill="${K.water}" opacity=".75"/>` + P(`M${r22(x - 1)},${r22(y + 0.9)} Q${r22(x - 0.1)},${r22(y + 0.1)} ${r22(x + 0.7)},${r22(y + 0.9)} Q${r22(x - 0.1)},${r22(y + 1.7)} ${r22(x - 1)},${r22(y + 0.9)} Z`, K.fish, 0.4) + P(`M${r22(x + 0.6)},${r22(y + 0.9)} L${r22(x + 1.4)},${r22(y + 0.4)} L${r22(x + 1.4)},${r22(y + 1.4)} Z`, K.fishS, 0.35) + E(x - 0.5, y + 0.8, 0.18, 0.18, OUT, 0)) + E(x - 0.6, y - 0.9, 0.32, 0.32, "#FFFFFF", 0.25);
      }
      s += `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/><path d="M${r22(x - 1.1)},${r22(y - 0.6)} L${r22(x - 1.1)},${r22(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/><rect x="${r22(x - 1.3)}" y="${r22(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${K.cork}" stroke="${OUT}" stroke-width="0.7"/>` + L([x - 1.5, y - 1.7], [x + 1.5, y - 1.7], K.ropeS, 0.45);
      return s;
    }
    __name(bocal, "bocal");
    var corde = /* @__PURE__ */ __name((K, d, w = 1.1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r22(w + 1.4)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.rope}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.ropeS}" stroke-width="${r22(w * 0.45)}" stroke-dasharray=".5 .9" stroke-linecap="round"/>`, "corde");
    var goutte = /* @__PURE__ */ __name((x, y, r) => P(`M${r22(x)},${r22(y - r * 1.7)} Q${r22(x + r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y + r)} Q${r22(x - r * 1.5)},${r22(y + r * 0.2)} ${r22(x)},${r22(y - r * 1.7)} Z`, C.water, 0.6), "goutte");
    var forme = /* @__PURE__ */ __name((sw) => `M15.6,37.4 Q24,35 32.4,37.4 L35.2,52.4 Q${r22(24 + sw)},55.2 12.8,52.4 Z`, "forme");
    var ourlet = /* @__PURE__ */ __name((off, sw = 0, amp = 0) => suitOurlet(12.8, 35.2, 52.4, 55.2 + sw * 0, off, amp), "ourlet");
    var PULL = /* @__PURE__ */ __name((sw) => `M15.4,37.4 Q24,35.2 32.6,37.4 L33.6,50.4 Q${r22(24 + sw)},52.2 14.4,50.4 Z`, "PULL");
    function corps(c, ctx, K, M) {
      const view = ctx.view, u = c.uid, t = c.tenue || "cire", mir = !!c.miroir, dos = view === "ne";
      const k = view === "se" ? -1.6 : 0, axe = 24 + k, o = 24 + k;
      const shadeX = view === "se" ? 26.2 : 27.8;
      const sw = r22((ctx.sway || 0) * 0.3);
      if (t === "tricot") return pull(c, ctx, K, M, k, sw);
      if (t === "pyjama") return pyjama(c, ctx, K, M, k, sw);
      const COAT = forme(sw);
      let s = P(COAT, K.coat) + clip(`${u}c`, COAT, `<rect x="${shadeX}" y="34" width="10" height="22" fill="${K.coatS}"/><path d="${ourlet(1.6)} L36,57 L12,57 Z" fill="${K.coatS}"/><rect x="15" y="39" width="1.3" height="11" rx="0.65" fill="${K.coatH}"/><rect x="16.8" y="40.6" width="0.6" height="4" rx="0.3" fill="#FFFFFF" opacity=".55"/><rect x="34.4" y="40" width="1" height="12" fill="${K.rim}" opacity=".55"/><path d="M19.6,41 Q19,46.6 18,52.6 M29.2,41.4 Q29.8,47 30.6,53" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>` + (M.salt ? `<path d="${ourlet(2.3, 0, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r22(0.75 * M.salt)}"/><path d="${ourlet(4.6, 0, 0.3)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r22(0.4 * M.salt)}"/>` : "") + (M.sand ? [[17.6, 52.6, 1.4], [22.8, 53.8, 1], [30.4, 53, 1.2]].map(([x, y, r]) => E(x + k, y, r, r * 0.45, K.sand, 0).replace("/>", ` opacity="${r22(0.8 * M.sand)}"/>`)).join("") : "") + (M.dirt ? `<path d="${ourlet(2.2, 0, 0.18)} L36,57 L12,57 Z" fill="${K.mud}" opacity="${r22(0.3 * M.dirt)}"/>` : "")) + P(COAT, "none");
      if (dos) {
        s += `<path d="M15.8,40.4 Q24,42 32.2,40.4" fill="none" stroke="${OUT}" stroke-width="0.5" opacity=".45"/>` + P("M24,41.6 L24,54.6", "none", 0.7);
        s += capucheRabattue(u, "ne", reperes(c), K.coat, K.coatS);
        s += corde(K, "M13.9,46.6 Q24,48.8 34.1,46.6");
        return s + mouille(M, 54.6, ctx);
      }
      s += P(`M${17 + k},37.2 Q${21 + k},37.2 ${24 + k},40.4 L${20.4 + k},42.2 Q${17.6 + k},40.4 ${17 + k},37.2 Z`, K.coatS, 0.8) + P(`M${31 + k},37.2 Q${27 + k},37.2 ${24 + k},40.4 L${27.6 + k},42.2 Q${30.4 + k},40.4 ${31 + k},37.2 Z`, K.coatS, 0.8) + L([18.6 + k, 38.2], [20.4 + k, 39.6], K.coatH, 0.45);
      const pente = view === "se" ? -0.6 : 0;
      s += P(`M${o},40.2 L${r22(o + pente)},54.8`, "none", 0.9);
      for (const y of [43.2, 49.6]) {
        const x = o + pente * (y - 40) / 14;
        s += L([x - 1.6, y], [x + 0.6, y], K.ropeS, 0.6) + `<rect x="${r22(x + 0.2)}" y="${r22(y - 0.55)}" width="2.6" height="1.1" rx="0.55" fill="${K.wood}" stroke="${OUT}" stroke-width="0.5"/>` + L([x + 0.6, y - 0.2], [x + 2.2, y - 0.2], "#C99A62", 0.3);
      }
      if (M.patch) s += reflet(axe, P(`M${15.6 + k},48.6 L${19.4 + k},48.4 L${19.6 + k},51.8 L${15.8 + k},52 Z`, K.patch, 0.55) + seam(`M${16.1 + k},49.1 L${18.9 + k},48.95 L${19.05 + k},51.3 L${16.3 + k},51.45 Z`, 0.35), mir);
      s += reflet(axe, P(`M${28.6 + k},48.6 L${32.8 + k},48.4 L${33.4 + k},52.6 Q${31 + k},53.4 ${29 + k},52.8 Z`, K.coat, 0.6) + P(`M${28.4 + k},48.4 L${33 + k},48.2 L${33.1 + k},49.8 L${28.6 + k},50 Z`, K.coatS, 0.55), mir);
      s += corde(K, "M13.9,45.8 Q24,47.8 34.1,45.8");
      s += reflet(axe, corde(K, `M${20.2 + k},47 L${19.2 + k},50.2`, 0.8) + corde(K, `M${20.8 + k},47 L${21.6 + k},49.8`, 0.8) + E(20.5 + k, 46.9, 1.15, 0.95, K.rope, 0.7) + L([19.9 + k, 46.6], [21.1 + k, 47.2], K.ropeS, 0.4) + (c.geste === "bulle" ? "" : L([27.8 + k, 47.2], [27.8 + k, 48.6], OUT, 0.6) + bocal(K, 27.8 + k, 50.8, M.bulle)), mir);
      return s + mouille(M, 54.6, ctx);
    }
    __name(corps, "corps");
    function pyjama(c, ctx, K, M, k, sw) {
      const u = c.uid, dos = ctx.view === "ne", o = 24 + k;
      const VESTE = `M15.6,37.4 Q24,35.2 32.4,37.4 L33.4,49.6 Q${r22(24 + sw)},51.2 14.6,49.6 Z`;
      const raies = [16.6, 19.4, 22.2, 25, 27.8, 30.6, 33.4].map((x) => `<path d="M${r22(x + k * 0.4)},36 Q${r22(x + (x - 24) * 0.06 + k * 0.4)},43 ${r22(x + (x - 24) * 0.12 + k * 0.4)},51" fill="none" stroke="${K.pyjStripe}" stroke-width="1"/>`).join("");
      let s = P(VESTE, K.pyj) + clip(`${u}pj`, VESTE, raies + `<rect x="${ctx.view === "se" ? 26.2 : 27.8}" y="34" width="10" height="20" fill="${K.pyjS}" opacity=".55"/><rect x="15.2" y="39" width="1.1" height="9" rx="0.55" fill="#FFFFFF" opacity=".35"/>` + (M.sand ? E(18 + k, 48.8, 1.3, 0.5, K.sand, 0).replace("/>", ` opacity="${r22(0.6 * M.sand)}"/>`) : "")) + P(VESTE, "none");
      if (dos) return s + P("M24,38 L24,50.6", "none", 0.5) + mouille(M, 50.8, ctx);
      s += P(`M${19.4 + k},37 Q${21.8 + k},38.6 ${24 + k},38.4 L${23 + k},40.2 Q${20.6 + k},39.6 ${19.4 + k},37 Z`, K.pyjStripe, 0.6) + P(`M${28.6 + k},37 Q${26.2 + k},38.6 ${24 + k},38.4 L${25 + k},40.2 Q${27.4 + k},39.6 ${28.6 + k},37 Z`, K.pyjStripe, 0.6) + P(`M${o},39.6 L${o},50.4`, "none", 0.6);
      for (const y of [42, 45.2, 48.4]) s += E(o + 0.9, y, 0.5, 0.5, "#F7F2E6", 0.35);
      s += reflet(24 + k, P(`M${28.2 + k},40.6 L${31.2 + k},40.4 L${31.4 + k},43.2 L${28.4 + k},43.4 Z`, K.pyj, 0.5) + L([28.2 + k, 40.6], [31.2 + k, 40.4], K.pyjStripe, 0.5), !!c.miroir);
      return s + mouille(M, 50.8, ctx);
    }
    __name(pyjama, "pyjama");
    function pull(c, ctx, K, M, k, sw) {
      const u = c.uid, dos = ctx.view === "ne", mir = !!c.miroir, axe = 24 + k;
      const PL = PULL(sw);
      const mailles = [39.6, 42.2, 44.8, 47.4].map((y) => [16.6, 19.4, 22.2, 25, 27.8, 30.6].map((x) => `<path d="M${r22(x - 0.6 + k)},${r22(y - 0.45)} L${r22(x + k)},${r22(y + 0.35)} L${r22(x + 0.6 + k)},${r22(y - 0.45)}" fill="none" stroke="${K.knitS}" stroke-width="0.32" opacity=".75"/>`).join("")).join("");
      let s = P(PL, K.knit) + clip(`${u}tr`, PL, mailles + `<rect x="${ctx.view === "se" ? 26.2 : 27.8}" y="34" width="10" height="20" fill="${K.knitS}" opacity=".7"/><rect x="15.2" y="39" width="1.2" height="9" rx="0.6" fill="${K.knitH}" opacity=".8"/><path d="M14,48.6 Q24,50.4 34,48.6 L34,53 L14,53 Z" fill="${K.knitS}"/>` + [15.6, 17.6, 19.6, 21.6, 23.6, 25.6, 27.6, 29.6, 31.6].map((x) => L([x + k * 0.3, 49.2 + Math.abs(x - 24) * -0.02], [x + k * 0.3, 51.6], K.knit, 0.5)).join("") + (M.sand ? E(19 + k, 49.6, 1.3, 0.5, K.sand, 0).replace("/>", ` opacity="${r22(0.6 * M.sand)}"/>`) : "")) + P(PL, "none");
      s += P(`M18.6,36.4 Q24,34.6 29.4,36.4 L29,38.4 Q24,36.8 19,38.4 Z`, K.knitS, 0.7) + [20, 22, 24, 26, 28].map((x) => L([x, 36.4 - (1 - Math.abs(x - 24) / 6) * 0.6], [x, 37.8 - (1 - Math.abs(x - 24) / 6) * 0.6], K.knit, 0.45)).join("");
      if (dos) return s + mouille(M, 51.4, ctx);
      if (M.patch) s += reflet(axe, P(`M${29 + k},42.4 L${31.6 + k},42.2 L${31.8 + k},44.8 L${29.2 + k},45 Z`, K.cream, 0.5) + [42.9, 43.7, 44.4].map((y) => L([29.3 + k, y], [31.5 + k, y - 0.1], K.creamS, 0.35)).join(""), mir);
      s += corde(K, "M14.4,46.6 Q24,48.4 33.6,46.6") + (c.geste === "bulle" ? "" : reflet(axe, L([27.8 + k, 47.6], [27.8 + k, 48.8], OUT, 0.6) + bocal(K, 27.8 + k, 51, M.bulle), mir));
      return s + mouille(M, 51.4, ctx);
    }
    __name(pull, "pull");
    var mouille = /* @__PURE__ */ __name((M, hy, ctx) => M.wet && !ctx.seatDy ? [[15.6, 0], [24.4, 0.55], [32.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 1)};${r22(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouille");
    var bras = fabriquerBras({ pal, marks });
    function pied(c, x, y, dir, tilt) {
      const M = marks(c), K = pal(c);
      let s = bareFoot(c, x, y, dir, tilt);
      if (c.tenue === "pyjama") s = `<rect x="${r22(x - c.legW / 2 - 0.2)}" y="${r22(y - 1.6)}" width="${r22(c.legW + 0.4)}" height="1.4" fill="${K.pyjStripe}" stroke="${OUT}" stroke-width="0.4"/>` + s;
      if (M.sand) s += [[-1.4, 4.2, 0.9], [0.8, 4.4, 0.7], [1.8, 3.6, 0.5]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.55, K.sand, 0).replace("/>", ` opacity="${r22(0.85 * M.sand)}"/>`)).join("");
      if (M.dirt) s += E(x - 0.6, y + 3.9, 1.8, 0.75, K.mud, 0).replace("/>", ` opacity="${r22(0.7 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: { X: /* @__PURE__ */ __name((x) => x, "X"), rk: [1, 1], k: 0, axe: 24, fx: 24, rx: 11.6 },
      se: { X: /* @__PURE__ */ __name((x) => r22(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), "X"), rk: [0.86, 1], k: -1.4, axe: 21, fx: 22.6, rx: 11.2 }
    };
    var decaler = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "decaler");
    var CAP = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z";
    var CAP_DOS = "M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.8,14.6 Q24,18 11.2,14.6 Q11.4,14.1 12,13.8 Z";
    function bonnet(K, id, d = CAP, arrache = false) {
      const raies = [[19, 4.2], [25.6, 3.6], [31.6, 5], [36.8, 9.2]].map(([x, y], i) => `<path d="M${x},${y} Q${r22(x - 3.6 + i * 1.6)},${r22(y + 5)} ${r22(x - 6.4 + i * 3.4)},${r22(13 + i * 0.4)} L${r22(x - 4.4 + i * 3.4)},${r22(13.4 + i * 0.4)} Q${r22(x - 1.6 + i * 1.6)},${r22(y + 5)} ${r22(x + 2.2)},${r22(y - 0.2)} Z" fill="${K.cream}"/>`).join("") + '<path d="M38.6,13.4 Q40.8,17.6 40.6,21.6 L41.6,21.4 Q41.8,17 39.8,12.8 Z" fill="' + K.cream + '"/>';
      const pompon = E(41.6, 24.4, 2.2, 2.2, K.cream) + [[0, -1.6], [1.5, -0.6], [1.2, 1.3], [-1.3, 1.1], [-1.6, -0.7]].map(([dx, dy]) => E(41.6 + dx * 0.9, 24.4 + dy * 0.9, 0.55, 0.45, K.creamS, 0)).join("") + E(41, 23.6, 0.6, 0.5, "#FFFFFF", 0);
      const balance = '<animateTransform attributeName="transform" type="rotate" dur="2.6s" repeatCount="indefinite" values="0 37 13;3.5 37 13;0 37 13" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
      return P(d, K.cap) + clip(`${id}k`, d, `<rect x="8" y="0" width="38" height="26" fill="${K.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${K.cap}"/>${raies}<path d="M14.6,10.6 Q18.6,6.4 24.6,5.6" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity=".55"/>`) + P(d, "none") + (arrache ? pendu(K) : `<g>${balance}${pompon}</g>`);
    }
    __name(bonnet, "bonnet");
    function pendu(K) {
      const balance = '<animateTransform attributeName="transform" type="rotate" dur="2.2s" repeatCount="indefinite" values="-4 41.8 23.4;5 41.8 23.4;-4 41.8 23.4" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
      return L([41, 23.6], [42.6, 23.9], OUT, 0.5) + L([41.4, 23.2], [41.2, 24.4], OUT, 0.4) + `<g>${balance}<path d="M41.8,23.4 Q42.6,25.6 42.4,27.8" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>${E(42.4, 29.6, 2, 2, K.cream)}${E(42.9, 30.3, 0.75, 0.65, K.creamS, 0)}</g>`;
    }
    __name(pendu, "pendu");
    var revers = /* @__PURE__ */ __name((K, d, nb = 9, y0 = 11.6, y1 = 14.2) => P(d, K.cream, 0.9) + Array.from({ length: nb }, (_, i) => 14.4 + i * (19.2 / (nb - 1))).map((x) => L([x, y0 + 0.5 + Math.abs(x - 24) * 0.06], [x, y1 - 0.5 + Math.abs(x - 24) * 0.04], K.creamS, 0.28)).join(""), "revers");
    var FRANGE = "M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.6,16.4 32.4,16.6 Q31.6,18.6 29.2,18.2 Q28.4,15.8 26,16.2 Q24.6,17.8 22.4,17 Q21.2,15.6 19.2,16.6 Q18.4,18.6 16,18 Q14.4,16.4 12,19.4 Z";
    function vrilles(K, pts) {
      return pts.map(([x, y, k]) => `<path d="M${r22(x)},${r22(y)} q${r22(k * 0.9)},-0.9 ${r22(k * 1.6)},0.1 q${r22(k * 0.4)},0.9 ${r22(-k * 0.5)},1.1" fill="none" stroke="${K.hairS}" stroke-width="0.5" stroke-linecap="round"/>`).join("");
    }
    __name(vrilles, "vrilles");
    var algue = /* @__PURE__ */ __name((K) => P("M11.6,17.6 Q9.4,19.4 10.4,21.6 Q9,23.4 10.2,25.4 Q9.4,27 10.6,28.6 Q11.4,27.4 11.2,26.2 Q12.4,24.6 11.4,23 Q12.6,21.2 11.6,19.8 Q12.8,18.8 12.6,17.8 Z", K.weed, 0.6) + `<path d="M11.2,18.6 Q10.4,20.4 11,22.4 Q10.2,24.2 10.8,26.4" fill="none" stroke="${K.weedS}" stroke-width="0.4"/>` + E(10.6, 21.4, 0.45, 0.3, "#9CCB8E", 0), "algue");
    function tete(c, ctx) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return `<g transform="translate(0 ${HY})">${teteDeDos(c, ctx, K, M, mir, id)}</g>`;
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X, k = V.k, se = ctx.view === "se";
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_L.cligne : EXPR_L[name] || EXPR_L.veille;
      const face = `M${V.fx - V.rx},21.6 a${V.rx},10.4 0 1,0 ${2 * V.rx},0 a${V.rx},10.4 0 1,0 ${-2 * V.rx},0 Z`;
      let s = "";
      const back = se ? "M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.8,25.8 36.2,27.6 Q35,28.6 34.2,27.4 L14,27.2 Q12.2,26.4 12,21.6 Z" : "M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q37.2,25.4 35.6,27 Q34.4,28.2 33.4,26.8 L14.6,26.8 Q13.6,28.2 12.4,27 Q10.8,25.4 11.4,21 Z";
      s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${K.hairS}"/>` + vrilles(K, [[12.6, 24.8, 1], [34.4, 24.8, -1]])) + P(back, "none");
      if (!se) s += P("M11.8,17.4 Q8.2,18.4 8.8,21.6 Q9.6,23.2 11.2,22.6 Q10.4,20.6 11.8,19.8 Z", K.hair, 0.8);
      s += P(decaler("M36.2,17.4 Q39.8,18.4 39.2,21.6 Q38.4,23.2 36.8,22.6 Q37.6,20.6 36.2,19.8 Z", k), K.hair, 0.8);
      if (se) s += E(35, 23.6, 1.5, 2.1, K.skin) + P("M35.3,22.5 Q34.5,23.6 35.2,24.7", "none", 0.45);
      s += P(face, K.skin) + clip(`${id}f`, face, `<path d="${decaler(FRANGE, k)}" fill="${K.skinS}" transform="translate(0 1.4)"/><g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".35"/></g>` + E(Xv(16.4), 26.6, 2.2 * V.rk[0], 1.25, K.cheek, 0).replace("/>", ' opacity=".55"/>') + E(Xv(31.6), 26.6, 2.2 * V.rk[1], 1.25, K.cheek, 0).replace("/>", ' opacity=".55"/>') + (M.salt ? E(Xv(30.6), 23.2, 0.9, 0.4, K.salt, 0).replace("/>", ` opacity="${r22(0.6 * M.salt)}"/>`) : "")) + P(face, "none");
      const frange = decaler(FRANGE, k);
      s += P(frange, K.hair) + clip(`${id}fr`, frange, L([15.8 + k, 14.8], [21 + k, 13.9], K.hairH, 1) + L([26.4 + k, 13.8], [30.8 + k, 14.6], K.hairH, 0.7) + vrilles(K, [[17.2 + k, 16.6, 1], [23 + k, 15.8, 1], [28 + k, 16.2, -1], [32.6 + k, 16.8, -1]])) + P(frange, "none");
      if (M.weed) s += reflet(24, `<g transform="translate(${se ? 1.4 : 0} 0)">${algue(K)}</g>`, mir);
      s += c.coiffe ? c.coiffe(c, ctx, "tete") : `<g transform="translate(${k} 0)">${bonnet(K, id, CAP, M.pompon === "arrache")}${revers(K, "M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z", 9, 10.6, 13.6)}</g>`;
      s += eye(`${id}e0`, Xv(19.4), 23.3, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 23.3, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += brow(Xv(19.4), 19.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 19.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
      const nx = se ? V.axe - 0.4 : 24;
      s += P(`M${r22(nx - 0.7)},26 Q${nx},26.6 ${r22(nx + 0.7)},26`, "none", 0.5) + E(nx - 0.3, 25.3, 0.35, 0.25, "#FFFFFF", 0).replace("/>", ' opacity=".6"/>');
      s += ex.mouth === "yawn" ? P(`M${r22(V.axe - 1.4)},28.4 Q${V.axe},26.8 ${r22(V.axe + 1.4)},28.4 Q${r22(V.axe + 1.5)},31.6 ${V.axe},31.8 Q${r22(V.axe - 1.5)},31.6 ${r22(V.axe - 1.4)},28.4 Z`, K.mouth, 0.8) + E(V.axe, 30.6, 0.9, 0.6, "#D9786C", 0) : mouth(ex.mouth, V.axe, 27.8, `${id}m`, K);
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return `<g transform="translate(0 ${HY})">${s}</g>`;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[13.2, 27.6, 0], [35.6, 27.6, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    function teteDeDos(c, ctx, K, M, mir, id) {
      const back = "M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 Q35.6,33.4 34,32.2 Q33.2,34.4 31.4,32.8 Q30.2,34.6 28.6,32.8 Q27.4,34.2 26,32.6 Q25,30 24,29.6 Q23,30 22,32.6 Q20.6,34.2 19.4,32.8 Q17.8,34.6 16.6,32.8 Q14.8,34.4 14,32.2 Q12.4,33.4 12,31 Q10.6,28 11,21 Z";
      let s = E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
      s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${K.hair}"/>` + vrilles(K, [[15, 26.6, 1], [19.6, 28.2, 1], [26.6, 28.2, -1], [31.4, 26.6, -1], [17.4, 21.6, 1], [29.6, 21.6, -1]]) + L([14.6, 17.4], [16.4, 22.6], K.hairH, 0.8)) + P(back, "none");
      s += P("M18.4,19 Q17.8,25.4 19.2,31.4", "none", 0.5) + P("M28.8,19 Q29.8,25.4 28.6,31.4", "none", 0.5);
      if (M.weed) s += reflet(24, `<g transform="translate(48 0) scale(-1 1)">${algue(K)}</g>`, mir);
      s += c.coiffe ? c.coiffe(c, ctx, "tete") : `<g transform="translate(48 0) scale(-1 1)">${bonnet(K, id, CAP_DOS, M.pompon === "arrache")}</g>` + revers(K, "M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z", 9, 13.6, 16.6);
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_L[ALIAS[ctx.expr] || ctx.expr] || EXPR_L.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var leo = {
      ...ondin,
      name: "Léo",
      uid: "le",
      teintes: [C.hair, C.coat, C.cap, C.lining],
      sleeve: C.coat,
      cuff: null,
      sleeves: "roll",
      foot: pied,
      // ses jambes : la cuisse et le tibia (membres.js), nues sous le ciré
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      bras,
      // la baguette ne quitte pas sa main droite (repos et marche)
      hold(c, h) {
        return baguette(pal(c), h, 1);
      },
      // derrière le corps : la capuche rabattue de son ciré, qui dépasse derrière le cou (de face, de trois quarts)
      backItems(c, ctx) {
        const K = pal(c);
        if (ctx.view === "ne" || (c.tenue || "cire") !== "cire") return "";
        return capucheRabattue(c.uid, ctx.view, reperes(c), K.coat, K.coatS);
      },
      // de dos : la nuque, rentrée sous le col (dans l'ombre des boucles)
      neck(c, ctx) {
        if (ctx.view !== "ne") return "";
        return P("M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z", C.skinS, 0) + P("M19.6,36.55 Q24,35.85 28.4,36.55", "none");
      },
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      head(c, ctx) {
        return tete(c, ctx);
      },
      // le salut : il agite la main droite (la baguette passe dans la gauche), réveillé un instant ; l'action : la
      // sourcellerie (leo_gestes.js)
      pose(ctx) {
        const { pose, k } = ctx;
        if (pose === "salut") {
          const [a, b] = this.shoulders;
          const h = lerp([r22(b[0] + 5.2), r22(b[1] - 7.8)], [r22(b[0] + 6.6), r22(b[1] - 7.2)], k);
          return { expr: "sourire", left: baguette(pal(this), this.hands[0], -1) + arm(this, a, this.hands[0]), right: arm(this, b, h, [r22(b[0] + 5.6), r22(b[1] - 1)]) };
        }
        return require_leo_gestes().GESTES.sourcier.call(this, ctx);
      }
    };
    module.exports = { leo, C, MARKS, EXPR: EXPR_L, pal, marks, reflet, baguette, bocal, corde, goutte, HY };
  }
});

// personnages/refonte/leo_tenues.js
var require_leo_tenues = __commonJS({
  "personnages/refonte/leo_tenues.js"(exports, module) {
    var { castaway, fade } = require_naufrage();
    var { SPECS } = require_naufrages();
    var { leo, C } = require_leo_refonte();
    var { fondre, fondu } = require_couleurs();
    var PALETTES = fondre({
      bleu: { nom: "Bleu ciré", m: C.coat, mS: C.coatS, mH: C.coatH },
      jaune: { nom: "Jaune ciré", m: "#E8B83A", mS: "#C0902A", mH: "#F6D77A" },
      vert: { nom: "Vert d'eau", m: "#4FA58E", mS: "#3A806E", mH: "#86C9B6" },
      corail: { nom: "Corail", m: "#E0705A", mS: "#B85444", mH: "#F2A08C" },
      ciel: { nom: "Bleu ciel", m: C.pyj, mS: C.pyjS, mH: "#C8DDF2" },
      cannelle: { nom: "Cannelle", m: C.knit, mS: C.knitS, mH: C.knitH }
    });
    var TENUES = {
      cire: { nom: "Le ciré trop grand", tenue: "cire", palette: "bleu", sleeves: "roll", cles: ["coat", "coatS", "coatH"] },
      pyjama: { nom: "Le pyjama rayé", tenue: "pyjama", palette: "ciel", sleeves: null, cles: ["pyj", "pyjS", null], jambes: true },
      tricot: { nom: "Le pull de Tatie", tenue: "tricot", palette: "cannelle", sleeves: null, cles: ["knit", "knitS", "knitH"] }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, des actes plus tard : Bulle est revenu", marks: { salt: 0, sand: 0, dirt: 0, weed: false, patch: false, bulle: true } },
      source: { nom: "Un peu sale", quand: "une journée à La Source", marks: { salt: 0, sand: 0.3, dirt: 0.8, weed: false, patch: false } },
      rafistole: { nom: "Rafistolé", quand: "recousu au camp", marks: { salt: 0.2, sand: 0.3, dirt: 0.2, weed: false, patch: true } },
      rescape: { nom: "Rescapé", quand: "à son arrivée : la vague l'a posé sur sa planche, endormi", marks: { salt: 1, sand: 1, dirt: 0, weed: true, patch: false } },
      naufrage: { nom: "Naufragé", quand: "le naufrage de l'Hirondelle", marks: { salt: 1, sand: 0.6, dirt: 0.2, weed: true, patch: false, pompon: "arrache" }, naufrage: true },
      trempe: { nom: "Trempé", quand: "la pluie, ou un plongeon à La Source", marks: { salt: 0.2, sand: 0.2, dirt: 0.3, weed: false, patch: false, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["coat", "coatS", "coatH", "pyj", "pyjS", "knit", "knitS", "knitH", "cap", "capS", "cream", "creamS", "hair", "hairS", "hairH", "rope", "ropeS"];
    var retourner = /* @__PURE__ */ __name((parVue) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(([x, ...r]) => [Math.round((48 - x) * 100) / 100, ...r])])), "retourner");
    var miroirDe = /* @__PURE__ */ __name((fn) => (cc, ctx) => {
      const s = fn(cc, ctx), axe = ctx.view === "se" ? 22.4 : 24;
      return cc.miroir ? `<g transform="translate(${2 * axe} 0) scale(-1 1)">${s}</g>` : s;
    }, "miroirDe");
    function habiller(tenueId = "cire", paletteId = null, etatId = "rescape") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      const [km, kS, kH] = T2.cles;
      let pal = { [km]: pp.m, [kS]: pp.mS, ...kH ? { [kH]: pp.mH } : {} };
      if (E.sombre) pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(pal[k] || C[k], E.sombre)]));
      const K = { ...C, ...pal };
      const peau = E.sombre ? [assombrir(leo.leg, 0.94), assombrir(leo.legS, 0.94)] : [leo.leg, leo.legS];
      const [jambe, jambeS] = T2.jambes ? [K.pyj, K.pyjS] : peau;
      const c = {
        ...leo,
        uid: `le${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        sleeves: T2.sleeves,
        sleeve: K[km],
        leg: jambe,
        legS: jambeS,
        teintes: [K.hair, K[km], K.cap, K.lining]
      };
      if (!E.naufrage) return c;
      const delave = ["coat", "coatS", "coatH", "pyj", "pyjS", "knit", "knitS", "knitH", "cap", "capS", "cream", "creamS"];
      const salee = Object.fromEntries(delave.map((k) => [k, fade(K[k], 0.6)]));
      c.pal = { ...pal, ...salee };
      c.sleeve = salee[km];
      if (T2.jambes) {
        c.leg = salee.pyj;
        c.legS = salee.pyjS;
      }
      c.teintes = [K.hair, salee[km], salee.cap, K.lining];
      const S = SPECS.Ondin;
      const ton = /* @__PURE__ */ __name((col) => col === fondu("#264E82") ? fade(K[kS], 0.5) : salee[kS], "ton");
      const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, ton(col), ...r])]));
      const holes = Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, r, col]) => [x, y, r, ton(col)])]));
      const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, holes, over: miroirDe(S.over), head: void 0, headFix: void 0 };
      const droite = castaway(c, spec);
      const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters), holes: retourner(spec.holes), rips: retourner(S.rips) });
      return { ...droite, body: /* @__PURE__ */ __name((cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), "body"), foot: /* @__PURE__ */ __name((cc, ...a) => (cc.miroir ? gauche : droite).foot(cc, ...a), "foot") };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/leo_anims.js
var require_leo_anims = __commonJS({
  "personnages/refonte/leo_anims.js"(exports, module) {
    var { frame, IMAGES, E, arm, r2: r22 } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES } = require_lorena_poses();
    var { avec } = require_leo_gestes();
    var { HY } = require_leo_refonte();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var ZEDS_FIN = /(?:<path d="M[\d.]+,[\d.]+ L[\d.]+,[\d.]+ L[\d.]+,[\d.]+ L[\d.]+,[\d.]+" fill="none"[^>]*\/>){4}$/;
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.6, dirs: TOUTES, contexte: "Il attend, à moitié endormi ; il regarde la lune.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.11, dirs: MOUVANTES, contexte: "Il va à La Source, à petits pas pieds nus.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.065,
        dirs: MOUVANTES,
        contexte: "L'urgence : la baguette qui tire, la brume, Bulle.",
        // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit (un enfant : plus haut que
        // Robby), la poussière au contact du pied
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "decidee");
          const up = [0, -0.45, -0.7, -0.45, 0, -0.45, -0.7, -0.45][n % 8] + (avant(v) ? 0.6 : 0.2);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r22(up)})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.13,
        dirs: MOUVANTES,
        contexte: "Il arrive, freine, puis se pose (et bâille).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "epuisee")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.22, dirs: ["face"], contexte: "Il agite la main, réveillé un instant.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e), "img") },
      sourcier: { nom: "Travail : la baguette de sourcier", images: 4, dt: 0.32, dirs: TOUTES, contexte: "À La Source : la baguette frémit, tremble, plonge ; l'eau jaillit (« Là ! Ça tire ! »).", img: metier("sourcier") },
      chercher: { nom: "Travail : chercher ce qui est perdu", images: 4, dt: 0.4, dirs: TOUTES, contexte: "La baguette trouve aussi les choses perdues (la clé du phare, acte VI).", img: metier("chercher") },
      bulle: { nom: "Bulle, dans son bocal", images: 4, dt: 0.5, dirs: DEVANT, contexte: "Il regarde Bulle nager ; ou le bocal vide (« Bulle est retourné dans la mer. »).", img: metier("bulle") },
      lune: { nom: "Parler à la lune", images: 4, dt: 0.55, dirs: TOUTES, contexte: "La nuit : la lune lui parle, il lui chuchote.", img: metier("lune") },
      bailler: { nom: "Bâiller", images: 4, dt: 0.5, dirs: TOUTES, contexte: "La brume le tient encore : il s'endort debout, puis sursaute.", img: metier("bailler") },
      dodo: {
        nom: "Dodo, assis",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        contexte: "La nuit, à La Source : assis contre un rocher, le bocal renversé, une bulle au nez.",
        // (assis, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre ; le ciré trempé ne
        // goutte plus) ; (les mains à portée de ses bras courts, posées sur ses genoux ; la baguette, contre le rocher)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Ondin.dy }), "body") }, n, {
          ...D.POSES.Ondin,
          arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [20.6, 53.6], [13.4, 50.8]) + arm(cc, r, [27.4, 53.6], [34.6, 50.8]), "arms")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couché",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, au camp, sous une couverture bleue rayée de crème (cadre couché 64 × 48).",
        // (couché, le pompon de son bonnet monte juste sous les « z » : ils partent un peu plus à droite, au-dessus de la couverture)
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#3E5A8C", motif: "#F4EEDF" }).replace(ZEDS_FIN, (z) => `<g transform="translate(4.6 0)">${z}</g>`), "img")
      }
    };
    var decale = /* @__PURE__ */ __name((s) => s ? `<g transform="translate(0 ${HY})">${s}</g>` : s, "decale");
    function poserLeo(c, nom) {
      const p = POSES[nom];
      return {
        ...c,
        uid: `${c.uid}${nom.slice(0, 3)}`,
        geste: nom,
        pose(ctx) {
          if (ctx.view === "ne") return { expr: p.expr };
          if (nom === "joie") {
            const [a, b] = this.shoulders, u = [0, 1, 1.6, 0.8][ctx.n % 4];
            return { expr: p.expr, left: arm(this, a, [r22(a[0] - 7.6 - u * 0.4), r22(a[1] - 5.6 - u * 0.6)]), right: arm(this, b, [r22(b[0] + 7.6 + u * 0.4), r22(b[1] - 5.6 - u * 0.6)]) };
          }
          const r = p.fn.call({ ...this, shoulders: this.shoulders.map(([x, y]) => [x, y - HY]), hands: this.hands.map(([x, y]) => [x, y - HY]) }, ctx);
          return { expr: p.expr, left: decale(r.left), right: decale(r.right), over: decale(r.over), under: decale(r.under) };
        }
      };
    }
    __name(poserLeo, "poserLeo");
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = {
        nom: p.nom,
        images: p.images,
        dt: p.images === 4 ? 0.22 : 0.45,
        dirs: DEVANT,
        pose: true,
        contexte: "Dialogue, réaction (quête, surprise, froid, victoire).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = frame(poserLeo(c, k), v, "action", n, e);
          const bond = typeof p.bond === "function" ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
          return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
        }, "img")
      };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/refonte/maerys_gestes.js
var require_maerys_gestes = __commonJS({
  "personnages/refonte/maerys_gestes.js"(exports, module) {
    var { OUT, E, P, L, r2: r22, limb, arm } = require_troupe();
    var { pal, marks, feuille, liane } = require_maerys_refonte();
    var coudesDeDos = /* @__PURE__ */ __name((c, e) => {
      const [a, b] = c.shoulders;
      return arm(c, a, [r22(a[0] + e[0]), r22(a[1] + e[1])], void 0, "", "epaule") + arm(c, b, [r22(b[0] - e[0]), r22(b[1] + e[1])], void 0, "", "epaule");
    }, "coudesDeDos");
    var brasLeves = /* @__PURE__ */ __name((c, dx, dy) => {
      const [a, b] = c.shoulders;
      return arm(c, a, [r22(a[0] + dx), r22(a[1] + dy)], void 0, "", "epaule") + arm(c, b, [r22(b[0] - dx), r22(b[1] + dy)], void 0, "", "epaule");
    }, "brasLeves");
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin), "poing");
    var note = /* @__PURE__ */ __name((x, y, a = -12, mir = false) => `<g transform="${mir ? `translate(${r22(2 * x)} 0) scale(-1 1) ` : ""}rotate(${mir ? -a : a} ${r22(x)} ${r22(y)})">${E(x, y, 1.05, 0.78, OUT, 0)}${L([x + 0.9, y], [x + 0.9, y - 3.4], OUT, 0.55)}<path d="M${r22(x + 0.9)},${r22(y - 3.4)} Q${r22(x + 2.5)},${r22(y - 2.8)} ${r22(x + 2.1)},${r22(y - 1.5)}" fill="none" stroke="${OUT}" stroke-width="0.55" stroke-linecap="round"/></g>`, "note");
    function paume(c, [x, y], k) {
      const f = c.hand || c.skin;
      return E(x + k * 1.75, y + 0.6, 0.85, 1.25, f, 0.8) + P(`M${r22(x - 1.7)},${r22(y + 1.4)} L${r22(x - 1.7)},${r22(y - 0.9)} Q${r22(x - 1.7)},${r22(y - 2.5)} ${x},${r22(y - 2.5)} Q${r22(x + 1.7)},${r22(y - 2.5)} ${r22(x + 1.7)},${r22(y - 0.9)} L${r22(x + 1.7)},${r22(y + 1.4)} Q${x},${r22(y + 2.6)} ${r22(x - 1.7)},${r22(y + 1.4)} Z`, f, 0.85) + [-0.6, 0.6].map((d) => L([x + d, y - 2.1], [x + d, y - 1], OUT, 0.4)).join("");
    }
    __name(paume, "paume");
    function chanter({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), M = marks(this), i = n % 4, se = view === "se";
      const don = M.don !== false;
      const expr = don ? ["chante", "chante", "emerveillee", "rire"][i] : ["chante", "chante", "pensive", "triste"][i];
      const nt = view === "ne" ? [[36.4, 12.6], [39.6, 7.4], [33.2, 4.6]].map(([x, y]) => [this.miroir ? 48 - x : x, y]) : [[35.6, 27.2], [42.2, 24.6], [41.6, 16.4]];
      const notes = nt.slice(0, i === 0 ? 1 : i === 1 ? 2 : 3).map(([x, y], j) => note(x, y - i % 2 * 0.6, j % 2 ? 10 : -12, !!this.miroir)).join("");
      if (view === "ne") {
        return { expr, left: coudesDeDos(this, [-1.8, 6.6]), right: "", over: notes };
      }
      const cx = se ? 22.2 : 24, hy = 39.4;
      const hl = [cx - 2.4, hy], hr = [cx + 2.4, hy];
      const coupe = P(`M${r22(cx - 4.3)},${r22(hy - 0.9)} Q${r22(cx - 4.1)},${r22(hy + 3)} ${cx},${r22(hy + 3.3)} Q${r22(cx + 4.1)},${r22(hy + 3)} ${r22(cx + 4.3)},${r22(hy - 0.9)} Q${cx},${r22(hy + 0.5)} ${r22(cx - 4.3)},${r22(hy - 0.9)} Z`, this.hand || this.skin, 0.85) + P(`M${r22(cx - 3.4)},${r22(hy - 0.6)} Q${r22(cx - 2)},${r22(hy - 1.4)} ${r22(cx - 0.8)},${r22(hy - 0.2)}`, "none", 0.45) + P(`M${r22(cx + 3.4)},${r22(hy - 0.6)} Q${r22(cx + 2)},${r22(hy - 1.4)} ${r22(cx + 0.8)},${r22(hy - 0.2)}`, "none", 0.45) + L([cx, hy + 0.6], [cx, hy + 2.6], OUT, 0.4);
      const graine = E(cx, hy - 0.2, 1, 0.75, K.twig, 0.6) + E(cx - 0.3, hy - 0.45, 0.3, 0.2, "#C9A27A", 0);
      const h = don ? [0, 0, 2.6, 4.4][i] : 0;
      const tige = h ? L([cx, hy - 0.4], [cx, hy - 0.4 - h], OUT, 1.5) + L([cx, hy - 0.4], [cx, hy - 0.4 - h], K.vine, 0.75) + feuille(cx, hy - 0.2 - h, i === 3 ? 3.4 : 2.2, i === 3 ? 1.4 : 1, 125, K.leaf, K.leafS) + feuille(cx, hy - 0.2 - h, i === 3 ? 3.4 : 2.2, i === 3 ? 1.4 : 1, -125, K.leafH, K.leafS) : "";
      return {
        expr,
        left: "",
        right: "",
        over: arm(this, a, hl, [a[0] - 3.4, a[1] + 3.8], "") + arm(this, b, hr, [b[0] + 3.4, b[1] + 3.8], "") + coupe + graine + tige + notes
      };
    }
    __name(chanter, "chanter");
    function rougeGorge(x, y, vol, m = 1) {
      const s = (vol ? `<path d="M-0.4,-0.6 Q-2.6,-3.8 -4.2,-2.4 Q-2.6,-1.4 -1.2,0.2 Z" fill="#7A5A3E" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` : "") + P("M-2.6,0.6 L-4.4,1.6 L-4,0.2 Z", "#6E4E34", 0.5) + E(0, 0, 2.6, 2.1, "#8A6A48", 0.7) + P("M0.4,-1.2 Q2.8,-0.6 2.2,1.2 Q1.2,2.2 0,1.6 Q0.6,0.2 0.4,-1.2 Z", "#E2783A", 0) + E(1.6, -1.6, 1.3, 1.2, "#8A6A48", 0.7) + P("M1.6,-1.2 Q2.8,-1 2.6,0 Q1.8,0.4 1.4,-0.4 Z", "#E2783A", 0) + E(2, -1.9, 0.32, 0.32, OUT, 0) + P("M2.8,-1.7 L3.8,-1.5 L2.8,-1.2 Z", "#4A3A2A", 0.3) + (vol ? `<path d="M0,-0.6 Q-1,-4.4 -3,-3.8 Q-1.8,-2 -0.6,0 Z" fill="#9A7A56" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` : P("M-1.8,-0.2 Q-0.4,-1 0.8,0.2 Q-0.4,0.8 -1.8,-0.2 Z", "#7A5A3E", 0.45)) + (vol ? "" : L([0.4, 2], [0.2, 2.9], OUT, 0.45) + L([1, 2], [1.1, 2.9], OUT, 0.45));
      return `<g transform="translate(${r22(x)} ${r22(y)}) scale(${m} 1)">${s}</g>`;
    }
    __name(rougeGorge, "rougeGorge");
    function oiseau({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, dos = view === "ne";
      const expr = ["emerveillee", "sourire", "tendresse", "rire"][i];
      const s = dos ? b : a, d = dos ? 1 : -1;
      const lever = [0.6, 1, 1, 1][i];
      const h = [r22(s[0] + d * 3.4), r22(s[1] - 4.2 - lever * 2.4)];
      const doigt = poing(this, h) + L([h[0] + d * 1.2, h[1] - 0.6], [h[0] + d * 3.4, h[1] - 1.2], OUT, 1.5) + L([h[0] + d * 1.2, h[1] - 0.6], [h[0] + d * 3.2, h[1] - 1.15], this.hand || this.skin, 0.75);
      const leve = arm(this, s, h, [r22(s[0] + d * 4.6), r22(s[1] + 0.8)], doigt);
      const repos = dos ? arm(this, a, this.hands[0]) : arm(this, b, this.hands[1]);
      const perche = [h[0] + d * 2.6, h[1] - 3.6];
      const [bx, by, vol] = [[d > 0 ? 42 : 6, 8, true], [perche[0] + d * 2.4, perche[1] - 3.2, true], [...perche, false], [...perche, false]][i];
      const bete = rougeGorge(bx, by, vol, -d) + (i === 3 ? note(perche[0] + d * 3.6, perche[1] - 5.2, d > 0 ? 12 : -12, !!this.miroir) : "");
      return dos ? { expr, left: repos, right: "", over: leve + bete } : { expr, left: "", right: repos, over: leve + bete };
    }
    __name(oiseau, "oiseau");
    function cachee({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, se = view === "se";
      const expr = ["genee", "cachee", "cachee", "rire"][i];
      if (view === "ne") {
        return { expr, left: "", right: "", over: brasLeves(this, -3.6, -5.6) };
      }
      const [xg, xd] = se ? [17.2, 25.2] : [19.4, 28.6];
      const yG = [24.4, 27.4, 27.6, 24.4][i], yD = [24.4, 24.4, 27.6, 24.4][i];
      const g = [xg, yG], dr = [xd, yD];
      return {
        expr,
        left: "",
        right: "",
        over: arm(this, a, g, [a[0] - 2.6, a[1] + 2.6], paume(this, g, 1)) + arm(this, b, dr, [b[0] + 2.6, b[1] + 2.6], paume(this, dr, -1))
      };
    }
    __name(cachee, "cachee");
    function lanterne(h, n, fort) {
      return `<g transform="translate(${r22(h[0])} ${r22(h[1])}) scale(1.3) translate(${r22(-h[0])} ${r22(-h[1])})">${petiteLanterne(h, n, fort)}</g>`;
    }
    __name(lanterne, "lanterne");
    function petiteLanterne(h, n, fort) {
      const [x, y0] = h, y = y0 + 1;
      const lu = [[[-0.9, 4.4], [0.8, 5.6], [0.2, 3.4]], [[0.7, 4.2], [-0.8, 5.2], [0.4, 6.2]], [[-0.4, 3.8], [1, 4.8], [-1, 6]], [[0.9, 3.6], [-0.6, 4.6], [0.3, 5.8]]][n % 4];
      const halo = `<circle cx="${x}" cy="${r22(y + 4.8)}" r="${fort ? 6 : 4.6}" fill="#EEF7A8" opacity=".3"><animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values=".24;.38;.24" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></circle><circle cx="${x}" cy="${r22(y + 4.8)}" r="${fort ? 3.9 : 3.1}" fill="#F7FBC8" opacity=".45"/>`;
      return halo + P(`M${r22(x - 1.5)},${r22(y + 1.2)} Q${x},${r22(y - 1.8)} ${r22(x + 1.5)},${r22(y + 1.2)}`, "none", 0.75) + P(`M${r22(x - 2.5)},${r22(y + 2.5)} L${r22(x + 2.5)},${r22(y + 2.5)} L${r22(x + 1.6)},${r22(y + 1.1)} L${r22(x - 1.6)},${r22(y + 1.1)} Z`, "#5A4A3A", 0.75) + `<rect x="${r22(x - 2)}" y="${r22(y + 2.5)}" width="4" height="4.8" rx="0.6" fill="#EAF6D2" stroke="${OUT}" stroke-width="0.75"/>` + E(x, y + 4.9, 1.6, 1.9, "#DDF0A0", 0).replace("/>", ' opacity=".9"/>') + lu.map(([dx, dy]) => E(x + dx, y + dy, 0.42, 0.42, "#FBFFD0", 0.25)).join("") + L([x - 0.7, y + 2.9], [x - 0.7, y + 6.9], "#FFFFFF", 0.4).replace("/>", ' opacity=".7"/>') + `<rect x="${r22(x - 2.5)}" y="${r22(y + 7.2)}" width="5" height="1.2" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.75"/>`;
    }
    __name(petiteLanterne, "petiteLanterne");
    var lucioles = /* @__PURE__ */ __name((x, y) => [[-4.6, -2], [4.2, -3.4], [-2.4, -6.2], [5.2, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.45, 0.45, "#FBFFD0", 0.3) + E(x + dx, y + dy, 1, 1, "#E9F5B0", 0).replace("/>", ' opacity=".35"/>')).join(""), "lucioles");
    function lanternePose({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, dos = view === "ne";
      const expr = ["veille", "emerveillee", "emerveillee", "sourire"][i];
      const s = dos ? b : a, d = dos ? 1 : -1;
      const h = i === 0 ? dos ? this.hands[1] : this.hands[0] : [r22(s[0] + d * 4.2), r22(s[1] + 0.6 - (i === 2 ? 0.6 : 0))];
      const lum = lanterne([h[0], h[1] + 0.4], i, i > 0);
      const tient = lum + arm(this, s, h, i === 0 ? void 0 : [r22(s[0] + d * 3), r22(s[1] + 5.4)]);
      const repos = dos ? arm(this, a, this.hands[0]) : arm(this, b, this.hands[1]);
      const autour = i === 2 ? lucioles(h[0], h[1] + 3) : "";
      return dos ? { expr, left: repos, right: i ? "" : tient, over: (i ? tient : "") + autour } : { expr, left: tient, right: repos, over: autour };
    }
    __name(lanternePose, "lanternePose");
    function fagot(K, [x, y], rot = -24, long = 1) {
      const br = [[-0.9, 0, 9.4], [0.4, -0.5, 10.4], [1.4, 0.4, 8.6], [-0.2, 0.9, 9.8]].map(([dx, dy, l0]) => [dx, dy, l0 * long]).map(([dx, dy, l]) => limb([x - l / 2, y + dy + dx * 0.2], [x + l / 2, y + dy - dx * 0.2], 1.05, K.twig)).join("");
      const q = 3.6 * long, noeuds = L([x + q, y - 0.4], [x + q + 1, y - 1.8], OUT, 1.1) + L([x + q, y - 0.4], [x + q + 1, y - 1.8], K.twig, 0.5) + L([x - q * 0.84, y + 0.6], [x - q * 0.84 - 1.2, y + 1.8], OUT, 1) + L([x - q * 0.84, y + 0.6], [x - q * 0.84 - 1.2, y + 1.8], K.twig, 0.45);
      return `<g transform="rotate(${rot} ${r22(x)} ${r22(y)})">${br}${noeuds}${liane(K, `M${r22(x - 0.4)},${r22(y - 2.2)} Q${r22(x + 0.6)},${r22(y)} ${r22(x - 0.2)},${r22(y + 2.6)}`, 0.7)}</g>`;
    }
    __name(fagot, "fagot");
    var branche = /* @__PURE__ */ __name((K, h, rot) => `<g transform="rotate(${rot} ${r22(h[0])} ${r22(h[1])})">${limb([h[0] - 4.4, h[1]], [h[0] + 4.6, h[1]], 1.1, K.twig)}${limb([h[0] + 2, h[1]], [h[0] + 4, h[1] - 2], 0.8, K.twig)}${feuille(h[0] + 4.4, h[1] - 2.2, 2.2, 0.9, 200, K.wither, K.witherS)}</g>`, "branche");
    function bois({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se", dos = view === "ne";
      const expr = ["pensive", "concentree", "sourire", "tendresse"][i];
      const cx = se ? 22.2 : 24;
      if (dos) {
        return { expr, left: coudesDeDos(this, [-1.8, 6.8]), right: "", under: fagot(K, [24, 41.4], -12, 2.6) };
      }
      if (i < 2) {
        const f2 = [r22(b[0] + 0.4), 45.6], hg = [r22(b[0] - 1.6), 46.4];
        const hb = i === 0 ? [r22(a[0] - 1.4), r22(a[1] + 9)] : [r22(a[0] + 2.8), r22(a[1] + 6.2)];
        return {
          expr,
          left: "",
          right: "",
          over: fagot(K, f2, 14) + arm(this, b, hg, [b[0] + 2.6, b[1] + 5.6]) + branche(K, hb, i === 0 ? -70 : -20) + arm(this, a, hb, i === 0 ? void 0 : [a[0] - 2.8, a[1] + 5]) + poing(this, hb)
        };
      }
      const f = [cx, 41.4 + (i === 3 ? 0.6 : 0)];
      return {
        expr,
        left: "",
        right: "",
        over: fagot(K, f, i === 3 ? -16 : -20, 1.5) + arm(this, a, [cx - 2.8, f[1] + 2.4], [a[0] - 3.2, a[1] + 4.6]) + arm(this, b, [cx + 3.2, f[1] + 0.4], [b[0] + 3.2, b[1] + 4.6]) + (i === 3 ? feuille(cx + 8.2, 50.6, 2.4, 1, 70, K.wither, K.witherS) : "")
      };
    }
    __name(bois, "bois");
    var GESTES = { chanter, oiseau, cachee, lanterne: lanternePose, bois };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, rougeGorge, lanterne, fagot, note, paume };
  }
});

// personnages/refonte/maerys_refonte.js
var require_maerys_refonte = __commonJS({
  "personnages/refonte/maerys_refonte.js"(exports, module) {
    var { P, E, L, clip, r2: r22, OUT, W, lerp, arm, bareFoot, dechirure, filPendant } = require_troupe();
    var sylve = require_sylve();
    var { EXPR, ALIAS, X, eye, brow, mouth, extras } = require_visage();
    var { seam, suitOurlet } = require_tissu();
    var { jambe, poserBras, anneau, ligneBras, pointLigne, sousLigne, longueurLigne } = require_membres();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var { hole, rip, cord } = require_naufrage();
    var { fondre } = require_couleurs();
    var C = fondre({
      skin: "#E8B88E",
      skinS: "#CC9A70",
      skinH: "#F6D3B0",
      lid: "#DFA982",
      under: "#B9856E",
      nose: "#B97A58",
      cheek: "#EE9C8C",
      eye: "#241B18",
      iris: "#6B8A3A",
      irisL: "#B5D27E",
      eyeRx: 1.8,
      eyeRy: 2.45,
      brow: "#2E1F18",
      browW: 0.95,
      mouth: "#7A3B30",
      hair: "#4A3328",
      hairS: "#33231B",
      hairH: "#7A5642",
      rim: "#9FE3DA",
      tunic: "#A88655",
      tunicS: "#86683E",
      tunicH: "#C2A274",
      robe: "#8FA86A",
      robeS: "#6F8A4E",
      robeH: "#B2C78E",
      thread: "#F2E6C8",
      moss: "#5F7F3E",
      mossS: "#45602A",
      mossH: "#86A75A",
      lichen: "#C9D9A0",
      bark: "#7A5636",
      barkS: "#5A3E26",
      leaf: "#5E9E4A",
      leafS: "#467A37",
      leafH: "#86C06A",
      vine: "#4E7A34",
      vineS: "#3A5E26",
      wither: "#8C9A4E",
      witherS: "#6E7A3A",
      twig: "#8A6440",
      feather: "#3E7FC1",
      featherS: "#1F3F66",
      featherH: "#9CC8EE",
      paint: "#3F8F4A",
      mud: "#6B5138",
      salt: "#FFF8E8",
      canvas: "#E6DCC3",
      canvasS: "#C9BB98",
      patch: "#B07E4C"
    });
    var MARKS = { dirt: 0.5, moss: 0.6, twigs: 2, salt: 0, patch: false, cape: "entiere", wet: false, don: true };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      const t = c.tenue || "cape";
      const [m, mS, mH] = t === "robe" ? [K.robe, K.robeS, K.robeH] : t === "mousse" ? [K.moss, K.mossS, K.mossH] : [K.tunic, K.tunicS, K.tunicH];
      return { ...K, coat: m, coatS: mS, coatH: mH };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_M = {
      ...EXPR,
      veille: X({ brow: [0.35, -0.1, -0.25], lid: 0.16, tilt: 0.08, look: [-0.35, 0.05], under: 0.35, mouth: "side" }),
      chante: X({ brow: [-0.7, -0.3, -0.6], mode: "closed", under: 0.3, mouth: "o" }),
      cachee: X({ brow: [-1.2, -0.6, -0.6], lid: 0, wide: true, look: [0.45, 0.15], under: 0.3, mouth: "press" })
    };
    var feuille = /* @__PURE__ */ __name((x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)})">` + P(`M0,0 Q${r22(w)},${r22(len * 0.45)} 0,${r22(len)} Q${r22(-w)},${r22(len * 0.45)} 0,0 Z`, fill, 0.6) + L([0, 0.5], [0, len - 0.7], nerv, 0.35) + "</g>", "feuille");
    var liane = /* @__PURE__ */ __name((K, d, w = 1) => cord(d, w, K.vine) + `<path d="${d}" fill="none" stroke="${K.leafH}" stroke-width="${r22(w * 0.35)}" stroke-linecap="round" stroke-dasharray=".8 1.4" opacity=".7"/>`, "liane");
    var brindille = /* @__PURE__ */ __name((K, a, b, f) => L(a, b, OUT, 1.5) + L(f[0], f[1], OUT, 1.2) + L(a, b, K.twig, 0.75) + L(f[0], f[1], K.twig, 0.55), "brindille");
    var plume = /* @__PURE__ */ __name((K, x, y, m = 1, rot = 0) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${rot}) scale(${m} 1)">` + P("M0,0 Q1.6,-4.8 6.6,-7.8 Q5.6,-2.8 0.8,0.6 Z", K.feather, 0.75) + L([1.2, -1.6], [2.6, -1], K.featherS, 0.55) + L([2.4, -3.4], [3.8, -2.4], K.featherS, 0.55) + L([3.8, -5.2], [4.9, -4.2], K.featherS, 0.55) + L([0.9, -1.4], [4.2, -5.6], K.featherH, 0.35) + P("M5.4,-6.9 Q6.2,-7.5 6.6,-7.8 Q6.4,-6.6 5.9,-6 Z", "#FFFFFF", 0) + "</g>", "plume");
    function basDechire(xr, xl, y, qx, qy, seed, mir) {
      if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
      const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
      const pts = m.d.split("L").map((s) => s.trim()).filter(Boolean);
      pts.pop();
      return { d: [...pts.reverse(), `${xl},${y}`].map((p) => `L${p}`).join(" "), tips: m.tips };
    }
    __name(basDechire, "basDechire");
    function capeForme(sw, dos) {
      const n = 7, x0 = dos ? 35.2 : 37.2, x1 = dos ? 12.8 : 10.8, y = 51.4;
      let d = dos ? `M16.6,33.2 Q24,31.4 31.4,33.2 Q33.6,41 ${r22(x0 + sw)},${y}` : `M14.8,33.4 Q24,31 33.2,33.4 Q36.4,42 ${r22(x0 + sw)},${y}`;
      const tips = [];
      for (let i = 0; i < n; i++) {
        const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n, m = (a + b) / 2, t = (i + 0.5) / n;
        const yy = y + 1.4 * Math.sin(Math.PI * t), ty = yy + 2.2 + i % 2 * 0.5;
        d += ` Q${r22(a - 0.9 + sw)},${r22(yy + 1.6)} ${r22(m + sw)},${r22(ty)} Q${r22(b + 0.9 + sw)},${r22(yy + 1.6)} ${r22(b + sw)},${r22(y + 1.4 * Math.sin(Math.PI * (i + 1) / n))}`;
        tips.push([m + sw, ty]);
      }
      return { d: d + (dos ? " Q14.4,41 16.6,33.2 Z" : " Q11.6,42 14.8,33.4 Z"), tips };
    }
    __name(capeForme, "capeForme");
    function cape(c, ctx, K, dos) {
      const sw = r22((ctx.sway || 0) * 0.4), { d, tips } = capeForme(sw, dos), u = `${c.uid}cp${dos ? "d" : ""}`;
      const shadeX = ctx.view === "se" ? 26.6 : 28;
      const rangs = dos ? [37.6, 42.2, 46.8].map((y, j) => {
        let p = `M10,${y}`;
        for (let x = 10; x < 38; x += 3.4) p += ` Q${r22(x + 1.7)},${r22(y + 2.1)} ${r22(x + 3.4)},${y}`;
        return `<path d="${p}" fill="none" stroke="${K.leafS}" stroke-width="0.6" transform="translate(${j % 2 ? 1.7 : 0} 0)"/>`;
      }).join("") + [39.4, 44, 48.6].map((y) => [14.4, 21.2, 28, 34.8].map((x) => L([x + 1.7, y - 0.6], [x + 1.7, y + 0.9], K.leafS, 0.35)).join("")).join("") : "";
      let s = P(d, K.leaf) + clip(u, d, `<rect x="${shadeX}" y="30" width="14" height="28" fill="${K.leafS}"/>` + rangs + `<rect x="12.6" y="36" width="1.2" height="14" rx="0.6" fill="${K.leafH}"/>`) + P(d, "none");
      s += tips.map(([x, y]) => L([x, y - 2.2], [x, y - 0.6], K.leafS, 0.35)).join("");
      return s;
    }
    __name(cape, "cape");
    var resteDeCape = /* @__PURE__ */ __name((K, k) => liane(K, `M${15.6 + k},33.8 Q${12.2 + k},38.4 ${12.6 + k},45.8`, 0.9) + feuille(12.4 + k, 40.6, 3.2, 1.3, 40, K.wither, K.witherS) + feuille(12.8 + k, 45.2, 3.4, 1.3, 14, K.wither, K.witherS), "resteDeCape");
    function tunique(c, ctx, K, M, k, mir) {
      const u = c.uid, sw = r22((ctx.sway || 0) * 0.3);
      const tb = basDechire(r22(33.8 + sw), r22(14.2 + sw), 49, r22(24 + sw), 51.6, 4, mir);
      const d = `M15.8,33 Q24,30.6 32.2,33 L${r22(33.8 + sw)},49 ${tb.d} Z`;
      const trame = [36, 38.4, 40.8, 43.2, 45.6, 48].map((y, i) => `<path d="M14,${y} L34,${y}" stroke="${K.coatS}" stroke-width="0.25" stroke-dasharray="${i % 2 ? ".6 1.4" : "1 1.1"}" opacity=".55"/>`).join("");
      let s = P(d, K.coat) + clip(`${u}t`, d, trame + `<rect x="${ctx.view === "se" ? 26.4 : 27.8}" y="30" width="9" height="24" fill="${K.coatS}"/><rect x="16.6" y="36" width="1.2" height="11" rx="0.6" fill="${K.coatH}"/><path d="M19.8,37.6 Q19.2,43 18.6,49 M28.6,37.6 Q29.2,43 29.8,49" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".25"/>` + salete(K, M, 14, 34, 49, 51.6, k)) + P(d, "none");
      s += tb.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
      return s;
    }
    __name(tunique, "tunique");
    function robe(c, ctx, K, M, k) {
      const u = c.uid, sw = r22((ctx.sway || 0) * 0.3);
      const d = `M15.6,33 Q24,30.6 32.4,33 Q35.4,43 ${r22(36 + sw)},52.8 Q${r22(24 + sw)},55.2 ${r22(12 + sw)},52.8 Q12.6,43 15.6,33 Z`;
      const ourlet = /* @__PURE__ */ __name((off) => suitOurlet(12 + sw, 36 + sw, 52.8, 55.2, off), "ourlet");
      const brode = `<path d="${ourlet(2.2)}" fill="none" stroke="${K.thread}" stroke-width="0.4" opacity=".9"/>` + [14.6, 18.2, 21.8, 25.4, 29, 32.6].map((x, i) => {
        const t = (x - 12) / 24, y = (1 - t) * (1 - t) * 52.8 + 2 * (1 - t) * t * 55.2 + t * t * 52.8 - 2.2, m = i % 2 ? 1 : -1;
        return `<path d="M${r22(x + sw)},${r22(y)} q${r22(m * 0.5)},-1 ${r22(m * 1.3)},-0.9 q-0.3,0.8 ${r22(-m * 1.3)},0.9 Z" fill="${K.thread}" opacity=".9"/>`;
      }).join("");
      let s = P(d, K.coat) + clip(`${u}r`, d, `<rect x="${ctx.view === "se" ? 26.4 : 28.2}" y="30" width="12" height="28" fill="${K.coatS}"/><path d="${ourlet(0.9)} L38,58 L10,58 Z" fill="${K.coatS}"/><rect x="15.4" y="37" width="1.3" height="13" rx="0.65" fill="${K.coatH}"/><path d="M19.6,44 Q18.6,48.6 17.6,53.6 M28.8,44 Q29.8,48.6 30.8,53.6" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>` + brode + salete(K, M, 12, 36, 52.8, 55.2, k)) + P(d, "none");
      if (ctx.view !== "ne") {
        const o = 24 + k;
        s += P(`M${r22(o - 3.4)},32.4 Q${o},35.2 ${r22(o + 3.4)},32.4`, "none", 0.6) + `<path d="M${r22(o - 0.9)},34.6 L${r22(o + 0.9)},36.4 M${r22(o + 0.9)},34.6 L${r22(o - 0.9)},36.4" stroke="${K.thread}" stroke-width="0.45" stroke-linecap="round"/>` + E(o, 37, 0.45, 0.4, K.thread, 0.3);
      }
      return s;
    }
    __name(robe, "robe");
    function manteau(c, ctx, K, M, k) {
      const u = c.uid, sw = r22((ctx.sway || 0) * 0.3);
      const h0 = r22(53.4 - (ctx.seatDy ? Math.max(0, 57.6 + ctx.seatDy - 63.2) : 0));
      let bas = "";
      const n = 9, x0 = 36.4, x1 = 11.6;
      for (let i = 0; i < n; i++) {
        const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n, t = (i + 0.5) / n, y = h0 + 1.6 * Math.sin(Math.PI * t);
        bas += ` Q${r22((a + b) / 2 + sw)},${r22(y + 1.9 + i % 2 * 0.4)} ${r22(b + sw)},${r22(h0 + 1.6 * Math.sin(Math.PI * (i + 1) / n))}`;
      }
      const d = `M15.4,33 Q24,30.4 32.6,33 Q35.6,43 ${r22(36.4 + sw)},${h0}${bas} Q12.4,43 15.4,33 Z`;
      const taches = [[18.4, 38.6, 1.6], [29.6, 41.4, 1.3], [21.6, 47.6, 1.8], [31.4, 50.2, 1.2], [16.4, 51, 1.1], [26.4, 36.2, 1]].map(([x, y, r]) => E(x + k, y, r, r * 0.7, K.mossS, 0).replace("/>", ' opacity=".55"/>')).join("");
      const lichen = [[19.6, 41.2], [27.4, 45.2], [17.4, 46.4], [30.6, 37.4], [24.6, 50.6]].map(([x, y]) => E(x + k, y, 0.55, 0.42, K.lichen, 0) + E(x + k + 0.7, y + 0.4, 0.3, 0.25, K.lichen, 0)).join("");
      let s = P(d, K.coat) + clip(`${u}m`, d, taches + `<rect x="${ctx.view === "se" ? 26.6 : 28.4}" y="30" width="12" height="28" fill="${K.coatS}" opacity=".85"/><rect x="15.2" y="37" width="1.4" height="13" rx="0.7" fill="${K.coatH}"/>` + lichen + salete(K, M, 11.6, 36.4, h0, h0 + 1.6, k)) + P(d, "none");
      s += [[13.6, 44, -1], [35, 46.6, 1], [14.8, 38.4, -1]].map(([x, y, m]) => L([x, y], [x + m * 0.9, y + 0.5], OUT, 0.4)).join("");
      if (ctx.view === "ne") return s + capucheRabattue(u, "ne", reperes(c), K.coat, K.coatS);
      const o = 24 + k, pente = ctx.view === "se" ? -0.6 : 0;
      s += P(`M${o},34.6 L${r22(o + pente)},54.6`, "none", 0.8);
      for (const y of [38.6, 44.4]) {
        const x = o + pente * (y - 34) / 20;
        s += L([x - 1.4, y], [x + 0.6, y], K.vine, 0.6) + `<rect x="${r22(x + 0.2)}" y="${r22(y - 0.6)}" width="2.6" height="1.2" rx="0.55" fill="${K.bark}" stroke="${OUT}" stroke-width="0.5"/>` + L([x + 0.6, y - 0.25], [x + 2.2, y - 0.25], K.barkS, 0.3);
      }
      s += P(`M${r22(17 + k)},33.2 Q${r22(20.6 + k)},33.6 ${o},36.4 Q${r22(27.4 + k)},33.6 ${r22(31 + k)},33.2 Q${o},31.6 ${r22(17 + k)},33.2 Z`, K.coatH, 0.7);
      return s;
    }
    __name(manteau, "manteau");
    function salete(K, M, x0, x1, y0, yc, k) {
      let s = "";
      if (M.dirt) s += `<path d="${suitOurlet(x0, x1, y0, yc, 2.4, 0.3)} L40,60 L8,60 Z" fill="${K.mud}" opacity="${r22(0.35 * M.dirt)}"/>` + [[19 + k, 44.6, 1], [27.6 + k, 47.2, 0.8]].map(([x, y, r]) => E(x, y, r, r * 0.6, K.mud, 0).replace("/>", ` opacity="${r22(0.4 * M.dirt)}"/>`)).join("");
      if (M.moss) s += [[17.6 + k, 40.6], [29.8 + k, 44.4], [22.4 + k, 48.4]].map(([x, y]) => E(x, y, 0.8, 0.55, K.leafS, 0).replace("/>", ` opacity="${r22(0.8 * M.moss)}"/>`) + E(x + 0.5, y - 0.2, 0.35, 0.3, K.leafH, 0).replace("/>", ` opacity="${r22(0.8 * M.moss)}"/>`)).join("");
      if (M.salt) s += `<path d="${suitOurlet(x0, x1, y0, yc, 1.8, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.65" opacity="${r22(0.7 * M.salt)}"/>`;
      return s;
    }
    __name(salete, "salete");
    function corps(c, ctx, K, M) {
      const view = ctx.view, t = c.tenue || "cape", mir = !!c.miroir, dos = view === "ne";
      const k = view === "se" ? -1.6 : 0, axe = 24 + k;
      let s = t === "robe" ? robe(c, ctx, K, M, k) : t === "mousse" ? manteau(c, ctx, K, M, k) : tunique(c, ctx, K, M, k, mir);
      if (M.cape === "perdue") {
        const [hx, hy, rx, ry] = dos ? [20.4, 40.2, 28.4, 38.6] : view === "se" ? [28, 38.4, 17, 37.6] : [29.4, 38.2, 18.4, 37.4];
        s += reflet(axe, hole(hx, hy, 0.9, K.coatS) + rip(rx, ry, 2), mir && !dos);
      }
      if (M.patch) {
        const px = dos ? 15.8 : 28.4 + k;
        s += reflet(dos ? 24 : axe, P(`M${px},44.6 L${r22(px + 3.6)},44.4 L${r22(px + 3.8)},47.8 L${r22(px + 0.2)},48 Z`, K.patch, 0.55) + seam(`M${r22(px + 0.5)},45.1 L${r22(px + 3.1)},44.95 L${r22(px + 3.25)},47.3 L${r22(px + 0.65)},47.45 Z`, 0.35), mir);
      }
      if (dos && t === "cape" && M.cape !== "perdue") s += cape(c, ctx, K, true);
      if (t !== "mousse") s += ceinture(c, ctx, K, M, k, axe, mir, t === "robe" ? 0.8 : 0);
      if (dos) s += basDeDos(K, `${c.uid}${ctx.view}`);
      return s + mouillee(M, t === "robe" ? 54.4 : t === "mousse" ? 55.2 : 50.6, ctx);
    }
    __name(corps, "corps");
    function ceinture(c, ctx, K, M, k, axe, mir, dy) {
      const dos = ctx.view === "ne";
      if (M.cape === "perdue") {
        const band = `M15,${41.3 + dy} Q24,${43.1 + dy} 33,${41.3 + dy} L33.1,${43.5 + dy} Q24,${45.3 + dy} 14.9,${43.5 + dy} Z`;
        let o2 = P(band, K.canvas) + clip(`${c.uid}vb`, band, `<rect x="26" y="40" width="10" height="7" fill="${K.canvasS}"/>`) + P(band, "none");
        if (dos) return o2;
        const kx2 = 19.6 + k;
        o2 += reflet(axe, P(`M${r22(kx2 - 0.4)},${43.6 + dy} L${r22(kx2 - 1.8)},${47.8 + dy} L${r22(kx2 - 0.2)},${47.6 + dy} Z`, K.canvas, 0.7) + P(`M${r22(kx2 + 0.6)},${43.6 + dy} L${r22(kx2 + 1.4)},${47.2 + dy} L${r22(kx2)},${47.4 + dy} Z`, K.canvasS, 0.7) + E(kx2, 42.9 + dy, 1.5, 1.2, K.canvasS, 0.8), mir);
        return o2;
      }
      let o = liane(K, `M15.2,${42.4 + dy} Q24,${44.2 + dy} 32.8,${42.4 + dy}`, 1);
      if (dos) return o + reflet(24, E(29.6, 43.4 + dy, 1.1, 0.9, K.vine, 0.7), mir);
      const kx = 19.4 + k;
      o += reflet(axe, E(kx, 43.4 + dy, 1.2, 1, K.vine, 0.7) + liane(K, `M${r22(kx - 0.3)},${44.2 + dy} Q${r22(kx - 1.2)},${46.2 + dy} ${r22(kx - 0.8)},${48 + dy}`, 0.7) + feuille(kx + 0.8, 43.8 + dy, 3, 1.15, -18, K.leaf, K.leafS) + feuille(kx - 0.4, 44 + dy, 2.6, 1, 22, K.leafH, K.leafS), mir);
      return o;
    }
    __name(ceinture, "ceinture");
    var mouillee = /* @__PURE__ */ __name((M, hy, ctx) => M.wet && !ctx.seatDy ? [[15.2, 0], [24.4, 0.55], [32.8, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 1)};${r22(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouillee");
    function bras(c, a, b, elbow, main, partie = "tout") {
      if (partie === "epaule") elbow = null;
      else ({ b, elbow, main } = poserBras(c, a, b, elbow, main));
      const K = pal(c), M = marks(c), t = c.tenue || "cape";
      const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
      const pts = sousLigne(ligne, tot - 1.1, 0), len = tot - 1.1;
      const ici = /* @__PURE__ */ __name((k) => {
        const { p, u: [ux, uy] } = pointLigne(pts, k);
        let nx = -uy, ny = ux;
        if (nx > 0) {
          nx = -nx;
          ny = -ny;
        }
        return { p, ux, uy, nx, ny };
      }, "ici");
      const off = /* @__PURE__ */ __name((k, o, dk = 0) => {
        const { p, ux, uy, nx, ny } = ici(k);
        return [p[0] + nx * o + ux * dk, p[1] + ny * o + uy * dk];
      }, "off");
      const pt = /* @__PURE__ */ __name((q) => `${r22(q[0])},${r22(q[1])}`, "pt"), chemin = /* @__PURE__ */ __name((l) => "M" + l.map(pt).join(" L"), "chemin");
      const trait = /* @__PURE__ */ __name((d, color, w2, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r22(w2)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "trait");
      const long = /* @__PURE__ */ __name((k0, k1, o) => chemin(sousLigne(pts, k0, k1).map((q, i, l) => {
        const kk = k0 + (k1 - k0) * i / Math.max(1, l.length - 1), { nx, ny } = ici(kk);
        return [q[0] + nx * o, q[1] + ny * o];
      })), "long");
      const gauche = a[0] < 24, ombre = !gauche, w = c.armW;
      const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : len;
      let s = "";
      if (partie !== "devant") {
        if (t !== "mousse") {
          const dn = chemin(pts);
          s += trait(dn, OUT, w + W * 2) + trait(dn, c.skin, w);
          if (!ombre) s += trait(long(len - 1.2, Math.max(len * 0.35, 2.4), w * 0.24), K.skinH, 0.7, ' opacity=".7"');
        }
        if (t === "robe" || t === "mousse") {
          const fin = t === "robe" ? Math.max(len - 4.4, 1) : 0;
          const tissu = ombre ? K.coatS : K.coat, dm = chemin(sousLigne(pts, len, fin));
          const large = t === "robe" ? w + 0.9 : w + 0.3;
          s += trait(dm, OUT, large + W * 2) + trait(dm, tissu, large);
          if (t === "robe") {
            const r = anneau(pts, fin + 0.9, fin, large / 2, 0.3);
            s += `<path d="${r.d}" fill="${K.coatS}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>` + trait(r.bord(fin + 0.45), K.thread, 0.35, ' stroke-dasharray=".5 .5"');
            if (!ombre) s += trait(long(len - 0.6, fin + 1.6, large * 0.22), K.coatH, 0.7, ' opacity=".8"');
          } else {
            const haut = elbow ? len - avb : len * 0.6;
            s += ombre ? trait(long(len - haut * 0.18, len - haut * 0.7, -large * 0.32), K.rim, 0.55, ' opacity=".6"') : trait(long(len - haut * 0.18, len - haut * 0.7, large * 0.22), K.coatH, 0.8, ' opacity=".8"');
            if (elbow) s += trait(`M${pt(off(avb, large * 0.15))} Q${pt(off(avb, 0, 0.9))} ${pt(off(avb, -large * 0.3))}`, OUT, 0.42, ' opacity=".35"');
            const r = anneau(pts, 3, 1.3, large / 2 + 0.25, 0.3);
            s += `<path d="${r.d}" fill="${K.coatH}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
            s += [-0.55, 0, 0.55].map((v) => {
              const q = off(1.4, v * large);
              return E(q[0], q[1], 0.5, 0.45, K.coatH, 0.4);
            }).join("");
          }
        }
      }
      if (partie === "derriere" || partie === "epaule") return s;
      if (t !== "mousse" && M.cape !== "perdue") {
        const r = anneau(pts, 3.7, 2.6, w / 2 + 0.15, 0.3), f = off(3.2, w * 0.55), { ux, uy } = ici(3.2);
        s += `<path d="${r.d}" fill="${K.vine}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` + feuille(f[0], f[1], 2.2, 0.85, Math.atan2(uy, ux) * 180 / Math.PI - 90 + (gauche ? 40 : -40), K.leaf, K.leafS);
      }
      return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin));
    }
    __name(bras, "bras");
    function pied(c, x, y, dir, tilt) {
      const M = marks(c), K = pal(c);
      let s = bareFoot(c, x, y, dir, tilt);
      if (M.dirt) s += E(x - 0.4, y + 3.8, 2, 0.8, K.mud, 0).replace("/>", ` opacity="${r22(0.7 * M.dirt)}"/>`) + E(x + 1.4, y + 1.2, 0.5, 0.45, K.mud, 0).replace("/>", ` opacity="${r22(0.6 * M.dirt)}"/>`);
      if (M.moss) s += E(x + 1, y + 3.4, 0.6, 0.4, K.leafS, 0).replace("/>", ` opacity="${r22(0.8 * M.moss)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: {
        X: /* @__PURE__ */ __name((x) => x, "X"),
        rk: [1, 1],
        k: 0,
        mouth: 24,
        ear: null,
        face: "M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.4 30.6,32.4 24,32.4 C17.4,32.4 12.4,28.4 12.4,22.4 Z"
      },
      se: {
        X: /* @__PURE__ */ __name((x) => r22(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), "X"),
        rk: [0.95, 0.82],
        k: -1.6,
        mouth: 21,
        ear: [34.6, 23.6],
        face: "M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.4 29,32.4 22.6,32.4 C16.2,32.4 11.3,28.4 11.3,22.4 Z"
      }
    };
    var decaler = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "decaler");
    var MASSE = "M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,30.4 L36.6,29.2 L36.4,33.4 L34.4,31.2 L33.4,34.6 L31.6,31.4 L16.4,31.4 L14.6,34.6 L13.6,31.2 L11.6,33.4 L11.4,29.2 L9.4,30.4 Z";
    var FRANGE = "M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z";
    var MECHE_G = "M12.8,16 Q10.4,23.2 11.2,31 L12.4,28.6 L13.2,31.6 Q13.2,24.8 14.6,18.4 Z";
    var MECHE_D = "M35.2,16 Q37.6,23.2 36.8,31 L35.6,28.6 L34.8,31.6 Q34.8,24.8 33.4,18.4 Z";
    var meches = /* @__PURE__ */ __name((K, k) => [MECHE_G, MECHE_D].map((d) => P(decaler(d, k), K.hair, 0.8)).join("") + L([12.4 + k, 19.4], [11.9 + k, 26.6], K.hairH, 0.5).replace("/>", ' opacity=".7"/>') + L([35.6 + k, 19.4], [36.1 + k, 26.6], K.hairS, 0.5), "meches");
    var MECHE_AVANT = "M31.2,15.6 Q30,23.4 31,31.6 L32.4,29.2 L33.2,32.4 L34.4,29.8 L35.4,31.8 Q35.8,23 34.8,14.8 Z";
    var mecheAvant = /* @__PURE__ */ __name((K) => P(MECHE_AVANT, K.hair, 0.8) + L([32.2, 18.6], [31.8, 27.4], K.hairH, 0.5).replace("/>", ' opacity=".7"/>'), "mecheAvant");
    var brindilles = /* @__PURE__ */ __name((K, n, k) => (n >= 1 ? brindille(K, [36.2 + k, 21.2], [40.2 + k, 22.6], [[38.4 + k, 21.8], [39.6 + k, 20.2]]) : "") + (n >= 2 ? brindille(K, [12.6 + k, 14.2], [8.2 + k, 12.6], [[10.2 + k, 13.2], [9.2 + k, 15]]) : ""), "brindilles");
    function tete(c, ctx) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return teteDeDos(c, ctx, K, M, mir, id);
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X, k = V.k, se = ctx.view === "se", axe = 24 + k;
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_M.cligne : EXPR_M[name] || EXPR_M.veille;
      let s = "";
      s += reflet(axe, brindilles(K, M.twigs, k), mir);
      const masse = decaler(MASSE, k);
      s += P(masse, K.hair) + clip(`${id}h`, masse, `<rect x="8" y="24" width="34" height="12" fill="${K.hairS}"/><path d="M${r22(35.4 + k)},12 Q${r22(38.6 + k)},20 ${r22(37.6 + k)},31 L41,31 L41,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(masse, "none");
      s += meches(K, k);
      if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r22(V.ear[0] + 0.1)},${r22(V.ear[1] - 1)} Q${r22(V.ear[0] + 0.8)},${V.ear[1]} ${r22(V.ear[0] + 0.1)},${r22(V.ear[1] + 1)}`, "none", 0.5);
      const frange = decaler(FRANGE, k);
      const traits = [[16.6, 1], [31.4, -1]].map(([x]) => [26.2, 27.6].map((y) => L([Xv(x - 1.7), y + 0.2], [Xv(x + 1.5), y - 0.2], K.paint, 0.7)).join("")).join("");
      s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${frange}" fill="${K.skinS}" transform="translate(0 1.4)"/><g transform="translate(${k} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".4"/></g>` + E(Xv(16.4), 27, 2.3 * V.rk[0], 1.3, K.cheek, 0).replace("/>", ' opacity=".5"/>') + E(Xv(31.6), 27, 2.3 * V.rk[1], 1.3, K.cheek, 0).replace("/>", ' opacity=".5"/>') + traits + (M.dirt ? reflet(Xv(24), `<ellipse cx="${Xv(18)}" cy="29.6" rx="1.5" ry="0.6" fill="${K.mud}" opacity="${r22(0.45 * M.dirt)}" transform="rotate(-12 ${Xv(18)} 29.6)"/>`, mir) : "") + (M.salt ? E(Xv(30.4), 16.4, 0.9, 0.4, K.salt, 0).replace("/>", ` opacity="${r22(0.6 * M.salt)}"/>`) : "")) + P(V.face, "none");
      if (se) s += mecheAvant(K);
      s += P(frange, K.hair) + clip(`${id}fr`, frange, `<path d="M10,17 Q24,13.4 38,17 L38,21 L10,21 Z" fill="${K.hairS}" opacity=".45"/>`) + P(frange, "none") + L([15.6 + k, 11.2], [21.6 + k, 9.6], K.hairH, 1.1) + L([26.4 + k, 10], [29.4 + k, 10.8], K.hairH, 0.6);
      s += reflet(axe, plume(K, 34 + k, 14.8, 1, -6), mir);
      s += se ? P("M20.6,25.3 Q21.3,26 22.2,25.5", "none", 0.65).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) : P("M23.2,25.4 Q24,26.2 24.8,25.4", "none", 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.32, 0.22, "#F6D3B4", 0);
      s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
      s += brow(Xv(19.4), 18.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
      s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return s;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[13.4, 31.4, 0], [35, 31.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    var DOS = "M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,31 L36.4,29.6 L36.6,33.6 L34,31.6 L33.2,34.8 L30.8,32.4 L29.4,35.2 L27.2,32.8 L24.6,35.6 L22.4,32.8 L20,35.2 L18.4,32.4 L15.8,34.8 L14.8,31.6 L12,33.6 L11.6,29.6 L9.4,31 Z";
    var COUPE = 33.6;
    function chevelureDeDos(K, id) {
      return P(DOS, K.hair) + clip(`${id}h`, DOS, `<rect x="8" y="6" width="34" height="36" fill="${K.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.6" ry="12.6" fill="${K.hair}"/><path d="M35.2,12 Q38.4,22 36.6,36 L40,36 L40,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(DOS, "none") + P("M17,12.4 Q15.6,22 17.2,32", "none", 0.55) + P("M24.4,11.6 Q25.4,22 24,33.2", "none", 0.55) + P("M30.8,12.6 Q32.2,22 30.8,32", "none", 0.55);
    }
    __name(chevelureDeDos, "chevelureDeDos");
    var basDeDos = /* @__PURE__ */ __name((K, id) => clip(`${id}cb`, `M0,${COUPE - 2.4} L48,${COUPE - 2.4} L48,64 L0,64 Z`, chevelureDeDos(K, `${id}b`)), "basDeDos");
    function teteDeDos(c, ctx, K, M, mir, id) {
      let s = reflet(24, brindilles(K, M.twigs, 0), !mir);
      s += clip(`${id}ch`, `M0,0 L48,0 L48,${COUPE} L0,${COUPE} Z`, chevelureDeDos(K, `${id}a`));
      s += L([16.8, 10], [22, 8.4], K.hairH, 1.1) + L([27, 16], [29.4, 15.4], K.twig, 0.8);
      s += reflet(24, plume(K, 34, 14.8, 1, -6), !mir);
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_M[ALIAS[ctx.expr] || ctx.expr] || EXPR_M.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var maerys = {
      ...sylve,
      name: "Maerys",
      uid: "my",
      teintes: [C.hair, C.tunic, C.leaf, C.feather],
      skin: C.skin,
      skinS: C.skinS,
      sleeve: C.skin,
      cuff: null,
      sleeves: null,
      leg: C.skin,
      legS: C.skinS,
      foot: pied,
      // ses jambes : la cuisse et le tibia (membres.js), nues
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      bras,
      // derrière le corps : la cape de feuilles (de face et de trois quarts), ou ce qu'il en reste ; la capuche rabattue du
      // manteau de mousse
      backItems(c, ctx) {
        const K = pal(c), M = marks(c), t = c.tenue || "cape", k = ctx.view === "se" ? -1.6 : 0;
        if (ctx.view === "ne") return "";
        if (t === "mousse") return capucheRabattue(c.uid, ctx.view, reperes(c), K.coat, K.coatS);
        if (t !== "cape") return "";
        if (M.cape === "perdue") return reflet(24 + k, resteDeCape(K, k), !!c.miroir);
        return k ? `<g transform="translate(${k} 0)">${cape(c, ctx, K, false)}</g>` : cape(c, ctx, K, false);
      },
      // le col de feuilles qui noue la cape (de face et de trois quarts) ; de dos, la nuque sous les cheveux
      neck(c, ctx) {
        const K = pal(c), M = marks(c);
        if (ctx.view === "ne" || (c.tenue || "cape") !== "cape" || M.cape === "perdue") return "";
        const k = ctx.view === "se" ? -1.6 : 0;
        return [18.2, 21, 24, 27, 29.8].map((x, i) => feuille(x + k, 32.2, 4, 1.55, [38, 16, 0, -16, -38][i], i % 2 ? K.leafS : K.leaf, i % 2 ? K.vineS : K.leafS)).join("") + liane(K, `M${17.6 + k},32.6 Q${24 + k},34.8 ${30.4 + k},32.6`, 0.6);
      },
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      head(c, ctx) {
        return tete(c, ctx);
      },
      // le salut : farouche, elle lève la main ouverte à hauteur du visage, un petit signe ; l'action : le chant
      // aux graines (maerys_gestes.js)
      pose(ctx) {
        const { pose, k } = ctx;
        if (pose === "salut") {
          const [a, b] = this.shoulders;
          const h = lerp([r22(b[0] + 3.6), r22(b[1] - 8.2)], [r22(b[0] + 5), r22(b[1] - 7.6)], k);
          return { expr: "sourire", left: arm(this, a, this.hands[0]), right: "", over: arm(this, b, h, [r22(b[0] + 5), r22(b[1] - 0.4)], require_maerys_gestes().paume(this, h, -1)) };
        }
        return require_maerys_gestes().GESTES.chanter.call(this, ctx);
      }
    };
    module.exports = { maerys, C, MARKS, EXPR: EXPR_M, pal, marks, reflet, feuille, liane, plume, brindille };
  }
});

// personnages/refonte/maerys_tenues.js
var require_maerys_tenues = __commonJS({
  "personnages/refonte/maerys_tenues.js"(exports, module) {
    var { fade } = require_naufrage();
    var { maerys, C } = require_maerys_refonte();
    var { fondre } = require_couleurs();
    var PALETTES = fondre({
      lin: { nom: "Lin", m: C.tunic, mS: C.tunicS, mH: C.tunicH },
      sauge: { nom: "Sauge", m: C.robe, mS: C.robeS, mH: C.robeH },
      mousse: { nom: "Mousse", m: C.moss, mS: C.mossS, mH: C.mossH },
      ecorce: { nom: "Écorce", m: "#8E5A3C", mS: "#6C412A", mH: "#B07A58" },
      bruyere: { nom: "Bruyère", m: "#8A6A8C", mS: "#6A4E6C", mH: "#AE90B0" },
      automne: { nom: "Automne", m: "#C0743E", mS: "#97562A", mH: "#DE9A62" }
    });
    var TENUES = {
      cape: { nom: "La cape de feuilles", tenue: "cape", palette: "lin", cles: ["tunic", "tunicS", "tunicH"] },
      robe: { nom: "La robe d'Agathe", tenue: "robe", palette: "sauge", cles: ["robe", "robeS", "robeH"] },
      mousse: { nom: "Le manteau de mousse", tenue: "mousse", palette: "mousse", cles: ["moss", "mossS", "mossH"] }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, apprivoisée", marks: { dirt: 0, moss: 0, twigs: 0, salt: 0, patch: false } },
      sale: { nom: "Un peu sale", quand: "une journée dans les bois", marks: { dirt: 1, moss: 0.8, twigs: 2, salt: 0, patch: false } },
      rafistole: { nom: "Rafistolée", quand: "recousue au camp", marks: { dirt: 0.2, moss: 0.2, twigs: 1, salt: 0, patch: true } },
      sauvage: { nom: "Sauvage", quand: "quand on la découvre, cachée à La Lisière depuis des années", marks: { dirt: 0.5, moss: 0.6, twigs: 2, salt: 0, patch: false } },
      naufrage: { nom: "Naufragée", quand: "le jour où son radeau s'est brisé, il y a des années", marks: { dirt: 0.3, moss: 0.2, twigs: 1, salt: 1, patch: false, cape: "perdue", don: false }, naufrage: true },
      trempe: { nom: "Trempée", quand: "la pluie, sous les arbres", marks: { dirt: 0.3, moss: 0.3, twigs: 1, salt: 0, patch: false, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["tunic", "tunicS", "tunicH", "robe", "robeS", "robeH", "moss", "mossS", "mossH", "leaf", "leafS", "leafH", "vine", "vineS", "hair", "hairS", "hairH", "canvas", "canvasS"];
    var DELAVE = ["tunic", "tunicS", "tunicH", "robe", "robeS", "robeH", "moss", "mossS", "mossH", "vine", "vineS", "leaf", "leafS", "leafH"];
    function habiller(tenueId = "cape", paletteId = null, etatId = "sauvage") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      const [km, kS, kH] = T2.cles;
      let pal = { [km]: pp.m, [kS]: pp.mS, [kH]: pp.mH };
      const K = /* @__PURE__ */ __name(() => ({ ...C, ...pal }), "K");
      if (E.sombre) {
        const k0 = K();
        pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(k0[k], E.sombre)]));
      }
      if (E.naufrage) {
        const k0 = K();
        pal = { ...pal, ...Object.fromEntries(DELAVE.map((k) => [k, fade(k0[k], 0.6)])) };
      }
      const k1 = K();
      const peau = E.sombre ? [assombrir(maerys.leg, 0.94), assombrir(maerys.legS, 0.94)] : [maerys.leg, maerys.legS];
      return {
        ...maerys,
        uid: `my${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        leg: peau[0],
        legS: peau[1],
        teintes: [k1.hair, k1[km], k1.leaf, k1.feather]
      };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/maerys_anims.js
var require_maerys_anims = __commonJS({
  "personnages/refonte/maerys_anims.js"(exports, module) {
    var { frame, IMAGES, E, P, clip, arm, r2: r22 } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES } = require_lorena_poses();
    var { avec } = require_maerys_gestes();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var X = /* @__PURE__ */ __name((x) => r22(24 + (x - 24) * 1.4), "X");
    var larges = /* @__PURE__ */ __name((d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${X(+x)},${y}`), "larges");
    function tronc(uid) {
      const d = larges("M10.4,63.4 Q11.8,56 12.2,44 Q12.4,34 12.6,26.4 L15.4,23.4 L17.8,25.6 L20.8,21.8 L23.6,24.6 L27,20.8 L29.6,24.2 L32.4,22.4 L35.4,26.2 Q35.6,34 35.8,44 Q36.2,56 37.6,63.4 Z");
      return P(d, "#7A5636") + clip(`${uid}tr`, d, `<rect x="${X(27.4)}" y="18" width="18" height="48" fill="#5A3E26"/><path d="${larges("M12.6,26.4 L15.4,23.4 L17.8,25.6 L20.8,21.8 L23.6,24.6 L27,20.8 L29.6,24.2 L32.4,22.4 L35.4,26.2 L35.4,27.6 L32.4,24.2 L29.6,26 L27,22.8 L23.6,26.4 L20.8,23.8 L17.8,27.2 L15.4,25.2 L12.6,28 Z")}" fill="#C9A27A"/>` + ["M16.4,30 Q15.6,40 16.6,52", "M21.2,29 Q22,38 20.8,48", "M29.6,29 Q30.6,40 29.4,50", "M33,31 Q32.4,40 33.4,48"].map((p) => `<path d="${larges(p)}" fill="none" stroke="#4A3220" stroke-width="0.55" opacity=".7"/>`).join("") + `<rect x="${X(12.6)}" y="28" width="1.4" height="24" rx="0.7" fill="#9A7652"/>` + E(24.6, 33, 1.6, 2.2, "#5A3E26", 0.5) + E(24.4, 32.7, 0.7, 1, "#3E2A1A", 0) + [[14.2, 36, 2.2], [33.2, 30.4, 1.8], [15, 48, 1.6]].map(([x, y, r]) => E(X(x), y, r, r * 0.7, "#6E9A4A", 0)).join("")) + P(d, "none") + P("M7.8,63.4 Q5.4,62.4 3.4,62.9 Q5,60.4 9.4,59.4 Z", "#7A5636", 0.8) + P("M40.2,63.4 Q42.6,62.2 44.6,62.7 Q43,60.2 38.6,59.2 Z", "#5A3E26", 0.8);
    }
    __name(tronc, "tronc");
    function queueDeMousse(n) {
      const d = n ? "M35.6,58.2 Q41.4,57.4 43,52.6 Q43.8,49.4 41.8,48.4 Q40.4,51.8 37.6,53.8 Q35.6,55 35.2,56.4 Z" : "M35.6,58.2 Q41.6,58.4 43.6,54.4 Q44.8,51.4 43,50 Q41.2,53 38,54.6 Q35.8,55.6 35.2,56.6 Z";
      const bout = n ? "M43,52.6 Q43.8,49.4 41.8,48.4 Q41.2,50.2 41.6,51.6 Z" : "M43.6,54.4 Q44.8,51.4 43,50 Q42.2,51.8 42.6,53.2 Z";
      return P(d, "#D2692E", 0.8) + `<path d="${d}" fill="none" stroke="#A84E20" stroke-width="0.4" opacity=".5" transform="translate(0.4 0.6)"/>` + P(bout, "#F4EEDF", 0.6);
    }
    __name(queueDeMousse, "queueDeMousse");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: "Elle attend, sur ses gardes : le regard de côté, prête à filer.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.11, dirs: MOUVANTES, contexte: "Elle va pieds nus, sans bruit, de La Lisière au Bosquet.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.06,
        dirs: MOUVANTES,
        contexte: "Elle file comme une bête des bois : un feu, une bête perdue, la brume.",
        // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit (légère, elle bondit plus
        // haut qu'Agathe), la poussière au contact du pied
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "decidee");
          const up = [0, -0.4, -0.65, -0.4, 0, -0.4, -0.65, -0.4][n % 8] + (avant(v) ? 0.6 : 0.2);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r22(up)})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.13,
        dirs: MOUVANTES,
        contexte: "Elle arrive, freine, puis se pose, aux aguets.",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "mefiante")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.24, dirs: ["face"], contexte: "Un petit signe de la main, farouche, puis de moins en moins (les cœurs).", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e), "img") },
      chanter: { nom: "Travail : chanter aux graines", images: 4, dt: 0.42, dirs: TOUTES, contexte: "Au Bosquet : elle chante à la graine, la pousse sort (naufragée : son don oublié, rien ne pousse).", img: metier("chanter") },
      oiseau: { nom: "Parler aux bêtes", images: 4, dt: 0.4, dirs: TOUTES, contexte: "Un rouge-gorge se pose sur son doigt et chante (le Bestiaire, plus tard).", img: metier("oiseau") },
      cachee: { nom: "Se cacher", images: 4, dt: 0.36, dirs: TOUTES, contexte: "Farouche : le joueur s'approche trop tôt (avant d'être apprivoisée).", img: metier("cachee") },
      lanterne: { nom: "La lanterne des Anciens", images: 4, dt: 0.5, dirs: TOUTES, contexte: "La première lanterne de La Lisière (acte I) : la lumière avant le feu.", img: metier("lanterne") },
      bois: { nom: "Travail : le bois mort", images: 4, dt: 0.42, dirs: TOUTES, contexte: "Quand le bois manque : elle rapporte le bois mort (on ne coupe pas ses arbres).", img: metier("bois") },
      dodo: {
        nom: "Dodo, assise",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        contexte: "La nuit, à La Lisière : adossée à un vieux chêne ; la queue rousse de Mousse dépasse.",
        // (assise, le corps descend ; la tunique trempée ne goutte plus) ; (les mains posées sur ses genoux)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: 8.4 }), "body") }, n, {
          dy: 8.4,
          tilt: 9,
          hy: 0.6,
          feet: [19.6, 28.4],
          footY: 59.6,
          back: /* @__PURE__ */ __name((cc) => tronc(cc.uid), "back"),
          arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [20.4, 53.4], [13.4, 50.4]) + arm(cc, r, [27.6, 53.4], [34.6, 50.4]), "arms"),
          front: /* @__PURE__ */ __name(() => queueDeMousse(n), "front")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couchée",
        images: 2,
        dt: 1.1,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, au camp, sous une couverture vert mousse (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#4E6E3A", motif: "#C9D9A0" }), "img")
      }
    };
    var LEVEES = /* @__PURE__ */ new Set(["joie", "sursaut", "visiere", "tete", "pointe"]);
    function poserMaerys(c, nom) {
      const p = POSES[nom];
      return {
        ...c,
        uid: `${c.uid}${nom.slice(0, 3)}`,
        geste: nom,
        pose(ctx) {
          if (ctx.view === "ne") return { expr: p.expr };
          const r = p.fn.call(this, ctx);
          if (!LEVEES.has(nom)) return { expr: p.expr, ...r };
          return { expr: p.expr, left: "", right: "", under: r.under, over: (r.left || "") + (r.right || "") + (r.over || "") };
        }
      };
    }
    __name(poserMaerys, "poserMaerys");
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = {
        nom: p.nom,
        images: p.images,
        dt: p.images === 4 ? 0.2 : 0.42,
        dirs: DEVANT,
        pose: true,
        contexte: "Dialogue, réaction (quête, surprise, froid, victoire).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = frame(poserMaerys(c, k), v, "action", n, e);
          const bond = typeof p.bond === "function" ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
          return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
        }, "img")
      };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/refonte/robby_gestes.js
var require_robby_gestes = __commonJS({
  "personnages/refonte/robby_gestes.js"(exports, module) {
    var { OUT, E, P, L, r2: r22, arm } = require_troupe();
    var { pal, maillet, ciseau } = require_robby_refonte();
    var PIERRE = "#A9A49A";
    var PIERRE_S = "#86817A";
    var PIERRE_H = "#C2BDB2";
    var GLOW = "#8FE3E8";
    var CRISTAL = "#9FD8F0";
    var poing = /* @__PURE__ */ __name((c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin), "poing");
    var rune = /* @__PURE__ */ __name((x, y, s, allumee) => {
      const d = `M${r22(x - 2 * s)},${r22(y - 2.3 * s)} L${x},${r22(y + 2.3 * s)} L${r22(x + 2 * s)},${r22(y - 2.3 * s)} M${x},${r22(y - 2.7 * s)} L${x},${r22(y + 3.1 * s)}`;
      return (allumee ? `<path d="${d}" fill="none" stroke="${GLOW}" stroke-width="${r22(2.4 * s)}" stroke-linecap="round" opacity="0.55"/>` : "") + `<path d="${d}" fill="none" stroke="${allumee ? "#E9FFFF" : OUT}" stroke-width="${r22((allumee ? 0.9 : 0.6) * s)}" stroke-linecap="round"/>`;
    }, "rune");
    var chant = /* @__PURE__ */ __name((x, y, k, n) => [1.6, 2.8].map((r, i) => `<path d="M${r22(x + k * r)},${r22(y - r * 0.8)} Q${r22(x + k * r * 1.35)},${y} ${r22(x + k * r)},${r22(y + r * 0.8)}" fill="none" stroke="${OUT}" stroke-width="1.3" stroke-linecap="round" opacity="${i === n % 2 ? 1 : 0.5}"/><path d="M${r22(x + k * r)},${r22(y - r * 0.8)} Q${r22(x + k * r * 1.35)},${y} ${r22(x + k * r)},${r22(y + r * 0.8)}" fill="none" stroke="#E9FFFF" stroke-width="0.5" stroke-linecap="round" opacity="${i === n % 2 ? 1 : 0.5}"/>`).join("") + `<g transform="rotate(-12 ${r22(x + k * 4.6)} ${r22(y - 3.4)})">${E(x + k * 4.6, y - 3.4, 0.9, 0.65, OUT, 0)}${L([x + k * 4.6 + 0.8, y - 3.4], [x + k * 4.6 + 0.8, y - 6.4], OUT, 0.5)}</g>`, "chant");
    var etincelles = /* @__PURE__ */ __name((x, y, k = 1) => [[0, -1], [0.75, -0.65], [-0.75, -0.65]].map(([dx, dy]) => L([x + dx * k * 1.2, y + dy * 1.2], [x + dx * k * 2.8, y + dy * 2.8], OUT, 1.3) + L([x + dx * k * 1.2, y + dy * 1.2], [x + dx * k * 2.8, y + dy * 2.8], "#F2C94C", 0.55)).join(""), "etincelles");
    var bloc = /* @__PURE__ */ __name((x, y, w = 9.8, h = 9.6) => P(`M${x},${r22(y - h)} L${r22(x + w)},${r22(y - h)} L${r22(x + w)},${y} L${x},${y} Z`, PIERRE) + P(`M${x},${r22(y - h)} L${r22(x + 1.8)},${r22(y - h - 2)} L${r22(x + w + 1.8)},${r22(y - h - 2)} L${r22(x + w)},${r22(y - h)} Z`, PIERRE_H, 0.9) + P(`M${r22(x + w)},${r22(y - h)} L${r22(x + w + 1.8)},${r22(y - h - 2)} L${r22(x + w + 1.8)},${r22(y - 2)} L${r22(x + w)},${y} Z`, PIERRE_S, 0.9) + L([x + 1.2, y - 2], [x + 3, y - 1.6], PIERRE_S, 0.4) + L([x + w - 2.6, y - h + 1.6], [x + w - 1.2, y - h + 2.4], PIERRE_S, 0.4), "bloc");
    function tailler({ view, n }) {
      const [, b] = this.shoulders, K = pal(this), i = n % 4, frappe = i % 2 === 1;
      const allumee = i === 3 && !this.sansDon;
      const expr = allumee ? "tendresse" : frappe ? "decidee" : "concentree";
      const [a] = this.shoulders;
      if (view === "ne") {
        if (!frappe) return { expr, left: "", under: arm(this, a, [a[0] + 4.6, a[1] + 7.6], [a[0] - 3.4, a[1] + 5.4]), right: maillet(K, [b[0] + 2.6, b[1] - 8.6], 160) + arm(this, b, [b[0] + 2.6, b[1] - 8.6], [b[0] + 5.4, b[1] - 2]) };
        return { expr, left: "", right: "", under: arm(this, a, [a[0] + 4.6, a[1] + 7.6], [a[0] - 3.4, a[1] + 5.4]) + arm(this, b, [b[0] - 4.8, b[1] + 6], [b[0] + 3.6, b[1] + 6.4]), over: etincelles(9.4, 52, 1) + etincelles(38.6, 52, -1) + (allumee ? chant(40.6, 46.4, 1, n) : "") };
      }
      const se = view === "se", d = se ? -4.4 : 0;
      const B = [17 + d, 62], tete = [20.2 + d, 45.6], pointe = [21.9 + d, 53.4], tient = [20.4 + d, 47.2];
      const ciseauBras = ciseau(K, tete, pointe) + arm(this, a, tient, [a[0] - 3, a[1] + 6], E(tient[0], tient[1], 2.1, 2.1, this.hand || this.skin));
      const H = frappe ? [26.8 + d * 0.4, 44.8] : [b[0] + 2.6, b[1] - 8.6];
      const rot = frappe ? r22(Math.atan2(-(tete[0] - H[0]), tete[1] - H[1]) * 180 / Math.PI) : 160;
      const marteau = maillet(K, H, rot) + arm(this, b, H, frappe ? [b[0] + 2, b[1] + 6.4] : [b[0] + 5.4, b[1] - 2]);
      const over = bloc(B[0], B[1], 11, 6.6) + rune(B[0] + 5.6, B[1] - 3.2, 0.62, allumee) + ciseauBras + marteau + (frappe ? etincelles(pointe[0], pointe[1] - 0.4, 1) : "") + (allumee ? chant(B[0] + 13.4, B[1] - 9, 1, n) : "");
      return { expr, left: "", right: "", over };
    }
    __name(tailler, "tailler");
    function pioche(m, h, k = 1) {
      const len = Math.hypot(h[0] - m[0], h[1] - m[1]) || 1, ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
      const pt = /* @__PURE__ */ __name((q, w) => [h[0] + ux * q + nx * w, h[1] + uy * q + ny * w], "pt");
      const fer = [pt(0.4, -5.4), pt(1.5, -2.6), pt(1.8, 0), pt(1.5, 2.4), pt(0.6, 5.8), pt(-0.6, 2.4), pt(-1, 0), pt(-0.6, -2.6)];
      return L(m, h, OUT, 3.4) + L(m, h, "#B07A45", 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], "#C99A62", 0.5) + P(`M${fer.map((p) => `${r22(p[0])},${r22(p[1])}`).join(" L")} Z`, "#A9B1BB", 1) + L(pt(0.9, -3.8), pt(1.2, -1.2), "#E2E8EE", 0.6) + E(h[0], h[1], 1.1, 1.1, "#6E747E", 0.7);
    }
    __name(pioche, "pioche");
    var roche = /* @__PURE__ */ __name((x, y, cristal) => E(x, y - 0.2, 5, 1.3, "rgba(40,55,20,.22)", 0) + P(`M${r22(x - 4.6)},${r22(y)} Q${r22(x - 5)},${r22(y - 4)} ${r22(x - 1.2)},${r22(y - 5)} Q${r22(x + 3.6)},${r22(y - 5.4)} ${r22(x + 4.6)},${r22(y - 1.6)} Q${r22(x + 4.8)},${r22(y + 0.2)} ${x},${r22(y + 0.3)} Z`, PIERRE) + P(`M${r22(x + 1.4)},${r22(y - 4.8)} L${r22(x + 0.6)},${r22(y - 2.6)} L${r22(x + 1.6)},${r22(y - 1.2)}`, "none", 0.5) + (cristal ? P(`M${r22(x + 0.2)},${r22(y - 3.6)} L${r22(x + 1)},${r22(y - 5.6)} L${r22(x + 1.8)},${r22(y - 3.6)} L${r22(x + 1)},${r22(y - 2.6)} Z`, CRISTAL, 0.6) + L([x + 0.7, y - 4.6], [x + 1, y - 5.2], "#FFFFFF", 0.4) + [[-1, -1], [1, -1.2], [2.6, -0.4]].map(([dx, dy]) => L([x + 1 + dx * 1.2, y - 4.4 + dy * 1.2], [x + 1 + dx * 2.2, y - 4.4 + dy * 2.2], CRISTAL, 0.5)).join("") : ""), "roche");
    var eclats = /* @__PURE__ */ __name((x, y) => [[-3.4, -2.6, 0.9], [-1.4, -4.4, 0.7], [2.6, -3.2, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, "#9A8E80", 0.5)).join(""), "eclats");
    function piocher({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, frappe = i % 2 === 1, cristal = i === 3;
      const expr = cristal ? "emerveillee" : frappe ? "decidee" : "concentree";
      const se = view === "se";
      const m = se ? [23.6, 43.6] : [23, 43.6];
      const p = se ? [8.6, 62] : [39.4, 62];
      const tete = frappe ? se ? [12.4, 57] : [35.6, 57] : se ? [9, 33] : [37.2, 32.6];
      const l = Math.hypot(tete[0] - m[0], tete[1] - m[1]), u = [(tete[0] - m[0]) / l, (tete[1] - m[1]) / l];
      const haut = [r22(m[0] + u[0] * 1.6), r22(m[1] + u[1] * 1.6)];
      const bas = se ? arm(this, b, m, [b[0] + 2.4, b[1] + 6]) : arm(this, a, m, [a[0] - 2.4, a[1] + 6]);
      const dessus = se ? arm(this, a, haut, [a[0] - 2.4, a[1] + 5.6]) : arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]);
      if (view === "ne") {
        if (!frappe) return { expr, left: "", right: "", under: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]), over: pioche(haut, [37.2, 32.6], -1) };
        return { expr, left: "", right: "", under: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]), over: eclats(9.4, 60) + eclats(39.6, 60.4) };
      }
      return { expr, under: roche(...p, cristal), left: "", right: "", over: pioche(m, tete, se ? 1 : -1) + bas + dessus + (frappe ? eclats(tete[0], tete[1]) : "") };
    }
    __name(piocher, "piocher");
    function ecouter({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["veille", "tendresse", "tendresse", "pensive"][i];
      if (view === "ne") return { expr };
      const oreille = se ? [35.4, 30.4] : [35.2, 30.4];
      const H = [[35.4, 38.2], oreille, oreille, [35.2, 40.2]][i];
      const caillou = /* @__PURE__ */ __name((x, y) => P(`M${r22(x - 2)},${r22(y + 0.6)} Q${r22(x - 2.4)},${r22(y - 1.6)} ${r22(x - 0.2)},${r22(y - 2)} Q${r22(x + 2)},${r22(y - 2.2)} ${r22(x + 2.2)},${r22(y - 0.2)} Q${r22(x + 2)},${r22(y + 1.6)} ${x},${r22(y + 1.6)} Q${r22(x - 1.6)},${r22(y + 1.6)} ${r22(x - 2)},${r22(y + 0.6)} Z`, PIERRE, 0.8) + L([x - 1, y - 1], [x + 0.4, y - 1.4], PIERRE_H, 0.5) + (this.sansDon ? "" : rune(x + 0.2, y, 0.32, i === 1 || i === 2)), "caillou");
      const droite = arm(this, b, H, i === 0 || i === 3 ? [b[0] + 4.2, b[1] + 5] : [b[0] + 6.4, b[1] + 1.6], caillou(H[0] - 0.8, H[1] - 1.4) + poing(this, H));
      const gauche = maillet(K, [14.8, 48.2], -8) + arm(this, a, [14.8, 48.2]);
      return { expr, left: gauche, right: "", over: droite + ((i === 1 || i === 2) && !this.sansDon ? chant(oreille[0] + 1.6, oreille[1] - 4.6, 1, n) : "") };
    }
    __name(ecouter, "ecouter");
    function porter({ view, n }) {
      const [a, b] = this.shoulders, i = n % 2, dy = i ? 0.5 : 0;
      const expr = "decidee";
      const bx = view === "ne" ? 25.4 : 26.4, by = 37.8 + dy;
      const pierreB = bloc(bx, by, 9.4, 6);
      const K = pal(this), gauche = maillet(K, [a[0] - 1.6, a[1] + 9.4], -8) + arm(this, a, [a[0] - 1.6, a[1] + 9.4]);
      if (view === "ne") return { expr, left: gauche, right: arm(this, b, [b[0] + 2, b[1] - 6.4 + dy], [b[0] + 4.6, b[1] + 1.4]), over: pierreB };
      return { expr, left: gauche, right: "", over: pierreB + arm(this, b, [b[0] + 3.2, b[1] - 6 + dy], [b[0] + 5, b[1] + 1.8]) };
    }
    __name(porter, "porter");
    function lire({ view, n }) {
      const [a] = this.shoulders, i = n % 4, d = 0;
      const expr = ["pensive", "concentree", "concentree", "emerveillee"][i];
      if (view === "ne") return { expr };
      const pierre = `M${1 + d},62 L${1.6 + d},36 Q${2 + d},30.6 ${6.4 + d},29.6 Q${10.8 + d},30.4 ${11.4 + d},36 L${12 + d},62 Z`;
      const lignes = [`M${4 + d},36 L${8.6 + d},36`, `M${6.3 + d},34.4 L${6.3 + d},44`, `M${4 + d},44 L${6.3 + d},40 L${8.6 + d},44`, `M${4.4 + d},48 L${8.2 + d},48`];
      const allume = this.sansDon ? -1 : i;
      let s = P(pierre, PIERRE) + `<path d="M${8.8 + d},31.6 Q${11 + d},36 ${11.2 + d},62 L${12 + d},62 L${11.4 + d},36 Q${10.8 + d},30.4 ${8.8 + d},31.6 Z" fill="${PIERRE_S}"/>` + P(pierre, "none") + E(4.6 + d, 55, 1.6, 0.8, "#9DAE7C", 0);
      s += lignes.map((l, j) => j <= allume ? `<path d="${l}" fill="none" stroke="${GLOW}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><path d="${l}" fill="none" stroke="#E9FFFF" stroke-width="0.6" stroke-linecap="round"/>` : `<path d="${l}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>`).join("");
      const h = [9.6 + d, 41.2];
      const main = P(`M${r22(h[0] - 1.4)},${r22(h[1] - 2.6)} L${r22(h[0] + 1.2)},${r22(h[1] - 2.6)} Q${r22(h[0] + 1.8)},${h[1]} ${r22(h[0] + 1.2)},${r22(h[1] + 2)} L${r22(h[0] - 1.4)},${r22(h[1] + 2)} Z`, this.hand || this.skin, 0.8) + [-0.6, 0.2].map((dd) => L([h[0] - 1.2, h[1] + dd], [h[0] + 0.6, h[1] + dd], OUT, 0.35)).join("");
      return { expr, left: s + arm(this, a, h, [a[0] - 4.6, a[1] + 1.4], main), right: null };
    }
    __name(lire, "lire");
    var GESTES = { tailler, piocher, ecouter, porter, lire };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, bloc, rune };
  }
});

// personnages/refonte/robby_refonte.js
var require_robby_refonte = __commonJS({
  "personnages/refonte/robby_refonte.js"(exports, module) {
    var { P, E, L, clip, limb, r2: r22, OUT, lerp, arm, shoe } = require_troupe();
    var galet = require_galet();
    var { EXPR, ALIAS, X, eye, mouth, extras, wind, rides } = require_visage();
    var { seam, suitOurlet } = require_tissu();
    var { fabriquerBras, poserBras } = require_lorena_bras();
    var { jambe } = require_membres();
    var { fondre } = require_couleurs();
    var HY = 4.4;
    var C = fondre({
      skin: "#B9B3A8",
      skinS: "#9C968B",
      lid: "#ABA59A",
      under: "#857F75",
      nose: "#A39C90",
      noseH: "#D2CDC4",
      eye: "#2A2622",
      iris: "#6F8A96",
      irisL: "#B5C9D0",
      eyeRx: 1.75,
      eyeRy: 2.25,
      brow: "#EEEAE0",
      mouth: "#5A3028",
      wool: "#B5562E",
      woolS: "#8E3F20",
      woolH: "#D07448",
      darn: "#C9B48A",
      beard: "#A3B48A",
      beardS: "#7F9068",
      beardH: "#C4D1AC",
      lichen: "#C9D27A",
      lichenB: "#9FB4AC",
      white: "#EEEAE0",
      whiteS: "#C9C3B6",
      hairB: "#D2CDC2",
      smock: "#6E6458",
      smockS: "#564E44",
      smockH: "#887E70",
      belt: "#4A3A2C",
      brass: "#C9A24A",
      apron: "#7A5A3E",
      apronS: "#5E442E",
      apronH: "#96745A",
      coat: "#5C6A72",
      coatS: "#46525A",
      coatH: "#7A8890",
      fleece: "#E6DCC8",
      fleeceS: "#C8BCA4",
      toggle: "#8A5A36",
      wood: "#A8743F",
      woodS: "#7E5530",
      steel: "#B8C0C8",
      steelS: "#8A949E",
      stone: "#A9A49A",
      stoneS: "#86817A",
      glow: "#8FE3E8",
      cheek: "#E3A396",
      rim: "#9FE3DA",
      dust: "#E4E0D6",
      moss: "#7E9A52",
      salt: "#FFF8E8",
      mud: "#6B5138",
      patch: "#8A7E66",
      cloth: "#E6D4AE",
      clothS: "#B8A27A"
    });
    var MARKS = { dust: 1, moss: 0.6, salt: 0.3, dirt: 0.4, bonnet: "troue", patch: true, wrist: false, wet: false };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      const veste = c.tenue === "pelisse";
      return { ...K, coat: veste ? K.coat : K.smock, coatS: veste ? K.coatS : K.smockS, coatH: veste ? K.coatH : K.smockH, shirt: K.smock, shirtS: K.smockS };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_R = {
      ...EXPR,
      veille: X({ brow: [0.4, 0.15, -0.1], lid: 0.3, tilt: 0.12, look: [0, 0.2], under: 0.7, mouth: "flat" }),
      concentree: { ...EXPR.concentree, mouth: "press" }
    };
    var oeil = /* @__PURE__ */ __name((...a) => eye(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, ""), "oeil");
    function sourcil(x, y, k, b, sc, K) {
      const [bi, bo, arch] = b, hw = 2.7 * sc;
      const p = /* @__PURE__ */ __name((t) => {
        const xx = x + k * hw * (1 - 2 * t), yy = y + bi + (bo - bi) * t + arch * (1 - (2 * t - 1) ** 2);
        return [xx, yy];
      }, "p");
      const haut = [0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const [xx, yy] = p(t);
        return [xx, yy - (i % 2 ? 1.25 : 1.05) * sc];
      });
      const [xo, yo] = p(1), [x6, y6] = p(0.62), [x8, y8] = p(0.84);
      const bas2 = [[xo - k * 0.2, yo + 1.4], [p(0.92)[0], p(0.92)[1] + 0.5], [x8, y8 + 1.3], [p(0.72)[0], p(0.72)[1] + 0.45], [x6, y6 + 1], [p(0.45)[0], p(0.45)[1] + 0.55], [p(0.15)[0], p(0.15)[1] + 0.6], [p(0)[0], p(0)[1] + 0.4]];
      const pts = [...haut, ...bas2];
      const d = "M" + pts.map(([a, c]) => `${r22(a)},${r22(c)}`).join(" L") + " Z";
      const [xm, ym] = p(0.5);
      return P(d, K.brow, 0.55) + L([xm - k * 1.2, ym - 0.2], [xm + k * 1.4, ym + 0.3], K.whiteS, 0.4) + L([x8 + k * 0.3, y8 + 0.1], [x8 - k * 0.2, y8 + 0.9], K.whiteS, 0.35);
    }
    __name(sourcil, "sourcil");
    function maillet(K, h, rot) {
      return `<g transform="rotate(${rot} ${r22(h[0])} ${r22(h[1])})">` + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, K.wood) + [0.6, 1.4].map((dy) => L([h[0] - 0.6, h[1] + dy], [h[0] + 0.6, h[1] + dy + 0.3], K.belt, 0.45)).join("") + `<rect x="${r22(h[0] - 2.4)}" y="${r22(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${K.wood}" stroke="${OUT}" stroke-width="0.9"/><rect x="${r22(h[0] + 0.9)}" y="${r22(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${K.woodS}"/>` + L([h[0] - 2, h[1] + 7.6], [h[0] + 1.6, h[1] + 7.6], "#C99A62", 0.4) + "</g>";
    }
    __name(maillet, "maillet");
    var ciseau = /* @__PURE__ */ __name((K, a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, K.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, K.steel) + E(a[0], a[1], 0.95, 0.6, K.woodS, 0.5), "ciseau");
    var BLOUSE = "M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z";
    var bas = /* @__PURE__ */ __name((off) => suitOurlet(14, 34, 51, 53.2, off), "bas");
    var pieces = /* @__PURE__ */ __name((K, k) => [[18.2 + k, 41.6, 3.4, 2.8, -4], [29.4 + k, 49.4, 2.8, 2.2, 6]].map(([x, y, w, h, a]) => `<g transform="rotate(${a} ${x} ${y})">${P(`M${r22(x - w / 2)},${r22(y - h / 2)} L${r22(x + w / 2)},${r22(y - h / 2)} L${r22(x + w / 2)},${r22(y + h / 2)} L${r22(x - w / 2)},${r22(y + h / 2)} Z`, K.patch, 0.5)}${seam(`M${r22(x - w / 2 + 0.4)},${r22(y - h / 2 + 0.4)} L${r22(x + w / 2 - 0.4)},${r22(y - h / 2 + 0.4)} L${r22(x + w / 2 - 0.4)},${r22(y + h / 2 - 0.4)} L${r22(x - w / 2 + 0.4)},${r22(y + h / 2 - 0.4)} Z`, 0.3)}</g>`).join(""), "pieces");
    var poudre = /* @__PURE__ */ __name((K, M, pts) => M.dust ? pts.map(([x, y, rx, ry]) => E(x, y, rx, ry, K.dust, 0).replace("/>", ` opacity="${r22(0.7 * M.dust)}"/>`)).join("") : "", "poudre");
    function corps(c, ctx, K, M) {
      const view = ctx.view, u = c.uid, t = c.tenue || "blouse", mir = !!c.miroir, dos = view === "ne";
      const k = view === "se" ? -1.6 : 0, axe = 24 + k;
      const shadeX = view === "se" ? 26.2 : 27.8;
      const veste = t === "pelisse";
      const tissu = veste ? K.coat : K.smock, tissuS = veste ? K.coatS : K.smockS, tissuH = veste ? K.coatH : K.smockH;
      let s = P(BLOUSE, tissu) + clip(`${u}s`, BLOUSE, `<rect x="${shadeX}" y="34" width="9" height="20" fill="${tissuS}"/><rect x="16.2" y="39" width="1.1" height="10" rx="0.5" fill="${tissuH}" opacity=".8"/><rect x="33" y="40" width="1" height="11" fill="${K.rim}" opacity=".5"/><path d="M19.4,40 Q19,45 18.6,50.6 M29,40 Q29.4,45 29.8,50.8" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>` + (M.salt ? `<path d="${bas(1.6)}" fill="none" stroke="${K.salt}" stroke-width="0.6" opacity="${r22(0.6 * M.salt)}"/>` : "") + (M.dirt ? `<path d="${bas(1.8)} L36,56 L12,56 Z" fill="${K.mud}" opacity="${r22(0.3 * M.dirt)}"/>` : "") + (!dos && !veste && M.patch ? reflet(axe, pieces(K, k), mir) : "") + (dos && M.patch && !veste ? reflet(24, `<g transform="rotate(5 28.6 42)">${P("M26.8,40.6 L30.4,40.6 L30.4,43.4 L26.8,43.4 Z", K.patch, 0.5)}${seam("M27.2,41 L30,41 L30,43 L27.2,43 Z", 0.3)}</g>`, mir) : "") + poudre(K, M, [[20.6 + k, 44.4, 1.6, 0.6], [26.4 + k, 42.2, 1.1, 0.5], [30.6 + k, 46.6, 1, 0.45], [17.4 + k, 49.6, 1.2, 0.5]])) + P(BLOUSE, "none");
      if (veste) s += pelisse(c, ctx, K, M);
      s += P("M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z", K.belt, 0.8) + seam("M15.2,47.4 Q24,49.4 32.8,47.4", 0.28);
      if (dos) {
        s += P("M24,38 L24,52", "none", 0.6);
        if (t === "carrier") s += `<path d="M18.4,37.4 L29.6,46.6 M29.6,37.4 L18.4,46.6" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M18.4,37.4 L29.6,46.6 M29.6,37.4 L18.4,46.6" stroke="${K.apron}" stroke-width="0.9" stroke-linecap="round"/>`;
        return s + reflet(24, ciseau(K, [17.8, 44.6], [17, 51.4]), mir) + mouille(M, 52.6, ctx);
      }
      if (t === "carrier") {
        const ap = `M${18.8 + k},39.4 L${29.2 + k},39.4 L${30.2 + k},46.4 L${32.4 + k},55 Q${24 + k},56.6 ${15.6 + k},55 L${17.8 + k},46.4 Z`;
        s += L([19.2 + k, 39.6], [18.4 + k, 37.2], K.apronS, 1.1) + L([28.8 + k, 39.6], [29.6 + k, 37.2], K.apronS, 1.1);
        s += P(ap, K.apron) + clip(`${u}a`, ap, `<rect x="${27.6 + k}" y="38" width="8" height="20" fill="${K.apronS}"/>` + [[20.4, 47, 1.6], [25.6, 51.4, 1.2], [27.4, 44.2, 1], [21.8, 52.4, 1.4]].map(([x, y, l]) => L([x + k, y], [x + k + l, y + 0.4], K.apronH, 0.4)).join("") + poudre(K, M, [[22 + k, 49.6, 2, 0.8], [26.6 + k, 53.4, 1.4, 0.6]])) + P(ap, "none") + seam(`M${19.4 + k},40.2 L${28.6 + k},40.2`, 0.3);
      }
      s += `<rect x="${r22(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${K.brass}" stroke="${OUT}" stroke-width="0.6"/>` + L([24 + k, 46.9], [24 + k, 48.3], K.belt, 0.4);
      s += reflet(axe, ciseau(K, [30.2 + k, 44.6], [31, 51.4]), mir);
      return s + mouille(M, 52.6, ctx);
    }
    __name(corps, "corps");
    function pelisse(c, ctx, K, M) {
      const view = ctx.view, k = view === "se" ? -1.6 : 0, u = c.uid;
      if (view === "ne") return P("M16.6,36.2 Q24,33.4 31.4,36.2 Q32.4,38.6 30.6,39.6 Q24,38 17.4,39.6 Q15.6,38.6 16.6,36.2 Z", K.fleece, 0.8) + clip(`${u}pf`, "M16.6,36.2 Q24,33.4 31.4,36.2 Q32.4,38.6 30.6,39.6 Q24,38 17.4,39.6 Q15.6,38.6 16.6,36.2 Z", [18.4, 21.4, 24.4, 27.4, 30].map((x) => E(x, 37.8, 1, 0.7, K.fleeceS, 0)).join(""));
      let s = "";
      for (const [d, droite] of [[`M${15.6 + k},37.4 Q${19.6 + k},36.4 ${21.6 + k},37.6 L${22.4 + k},52.6 Q${17.6 + k},52.4 ${14 + k},51 Z`, false], [`M${32.4 + k},37.4 Q${28.4 + k},36.4 ${26.4 + k},37.6 L${25.6 + k},52.6 Q${30.4 + k},52.4 ${34 + k},51 Z`, true]]) {
        s += P(d, K.coat) + clip(`${u}p${droite ? "r" : "l"}`, d, (droite ? `<rect x="${27.6 + k}" y="34" width="9" height="20" fill="${K.coatS}"/>` : `<rect x="${16.2 + k}" y="39" width="1.1" height="10" rx="0.5" fill="${K.coatH}"/>`) + poudre(K, M, [[(droite ? 30 : 18.4) + k, 44, 1, 0.45]])) + P(d, "none");
      }
      const col = `M${16.4 + k},36.6 Q${20.4 + k},35.2 ${22.4 + k},38.8 L${21.6 + k},43.4 Q${19.6 + k},40.6 ${17 + k},39.6 Z`;
      for (const m of [false, true]) {
        const g = /* @__PURE__ */ __name((inner) => m ? `<g transform="translate(${r22(2 * (24 + k))} 0) scale(-1 1)">${inner}</g>` : inner, "g");
        s += g(P(col, K.fleece, 0.8) + clip(`${u}mouton${m ? "r" : "l"}`, col, [[18, 37.6], [20.2, 37.6], [21.4, 40.2], [19.2, 39.6]].map(([x, y]) => E(x + k, y, 0.9, 0.65, K.fleeceS, 0)).join("")));
      }
      s += [42.6, 46.4].map((y) => limb([22.2 + k, y], [25.8 + k, y], 0.55, K.belt) + limb([23.2 + k, y], [24.8 + k, y], 0.9, K.toggle)).join("");
      return s;
    }
    __name(pelisse, "pelisse");
    var mouille = /* @__PURE__ */ __name((M, hy, ctx) => M.wet && !ctx.seatDy ? [[15.6, 0], [24.4, 0.55], [32.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 1)};${r22(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouille");
    var brasBase = fabriquerBras({ pal, marks });
    function bras(c, a, b, elbow, main, partie = "tout") {
      const M = marks(c);
      let s = brasBase(c, a, b, elbow, main, partie);
      const m = poserBras(c, a, b, elbow, main).b;
      if (partie !== "derriere" && main == null && M.dust) s += E(m[0] - 0.5, m[1] - 0.6, 0.9, 0.55, C.dust, 0).replace("/>", ` opacity="${r22(0.6 * M.dust)}"/>`);
      return s;
    }
    __name(bras, "bras");
    function pied(c, x, y, dir, tilt, genou) {
      const M = marks(c), K = pal(c);
      let s = "";
      const gx = x - c.legW / 2 + 0.4, gw = c.legW - 0.8;
      const g = genou || [x, (c.hip + y) / 2];
      if (c.tenue === "carrier" && dir <= 0) s += `<rect x="${r22(g[0] - gw / 2 - 0.3)}" y="${r22(g[1] - 1.3)}" width="${r22(gw + 0.6)}" height="2.6" rx="0.8" fill="${K.apron}" stroke="${OUT}" stroke-width="0.6"/>` + L([g[0] - gw / 2, g[1]], [g[0] + gw / 2, g[1]], K.belt, 0.4);
      if (M.dust) s += E(g[0], g[1] + 0.1, gw / 2, 0.6, K.dust, 0).replace("/>", ` opacity="${r22(0.5 * M.dust)}"/>`);
      if (M.dirt) s += `<rect x="${r22(gx)}" y="${r22(y - 1.4)}" width="${r22(gw)}" height="2" fill="${K.mud}" opacity="${r22(0.5 * M.dirt)}"/>`;
      s += shoe(c, x, y, dir, tilt);
      if (M.dirt) s += E(x - 1.6, y + 3.6, 1.6, 0.7, K.mud, 0).replace("/>", ` opacity="${r22(0.8 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: { X: /* @__PURE__ */ __name((x) => x, "X"), rk: [1, 1], k: 0, axe: 24, ears: [[11.8, 22.8], [36.2, 22.8]], fx: 24, rx: 11.6, kb: 0 },
      se: { X: /* @__PURE__ */ __name((x) => r22(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), "X"), rk: [0.86, 1], k: -1.4, axe: 21, ears: [[35, 23.2]], fx: 22.6, rx: 11.2, kb: -2.2 }
    };
    var BARBE = "M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z";
    var decaler = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "decaler");
    var QUEUE = ["M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z", "M21.8,5.2 Q21.8,2.2 24.2,2 Q23.6,3.8 24.6,5 Z"];
    function bonnet(c, ctx, K, M, k, mir, id) {
      const beanie = "M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z";
      const trou = /* @__PURE__ */ __name((x, y) => E(x, y, 1.1, 0.85, "#5E2A15", 0.6) + P(`M${r22(x - 0.6)},${r22(y + 0.3)} Q${x},${r22(y - 1.6)} ${r22(x + 0.7)},${r22(y + 0.2)}`, K.white, 0.5), "trou");
      const reprise = /* @__PURE__ */ __name((x, y) => E(x, y, 1.4, 1.1, K.darn, 0.5) + [-0.6, 0, 0.6].map((d) => L([x + d, y - 0.9], [x + d, y + 0.9], K.woolS, 0.3)).join("") + [-0.4, 0.4].map((d) => L([x - 1.1, y + d], [x + 1.1, y + d], K.woolS, 0.3)).join(""), "reprise");
      const mailles = [7.6, 10.2, 12.6].map((y) => [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${r22(x - 0.6)},${r22(y - 0.4)} L${x},${r22(y + 0.3)} L${r22(x + 0.6)},${r22(y - 0.4)}" fill="none" stroke="${K.woolS}" stroke-width="0.3" opacity=".7"/>`).join("")).join("");
      let s = `<g transform="translate(${k} 0)">` + wind(QUEUE[0], QUEUE[1], K.wool, 0.8, "2.3s") + P(beanie, K.wool) + clip(`${id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${K.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${K.wool}"/>` + mailles + (M.moss ? E(26, 6.4, 3.4, 1.2, K.moss, 0).replace("/>", ` opacity="${r22(0.5 * M.moss)}"/>`) + E(29, 6.8, 1, 0.5, K.lichen, 0).replace("/>", ` opacity="${r22(0.7 * M.moss)}"/>`) : "") + poudre(K, M, [[16.4, 8.6, 1.6, 0.6]])) + P(beanie, "none");
      const tg = [29.6, 11.6], td = [18.4, 9.8];
      s += reflet(24, M.bonnet === "reprise" ? reprise(...tg) : trou(...tg), mir) + reflet(24, trou(...td), mir);
      s += P("M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z", K.wool, 0.9) + [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${x},${r22(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r22(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${K.woolS}" stroke-width="0.5"/>`).join("") + L([13, 15.4], [17.8, 14.4], K.woolH, 0.8) + "</g>";
      return s;
    }
    __name(bonnet, "bonnet");
    function tete(c, ctx) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return `<g transform="translate(0 ${HY})">${teteDeDos(c, ctx, K, M, mir, id)}</g>`;
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X, k = V.k;
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_R.cligne : EXPR_R[name] || EXPR_R.veille;
      const face = `M${V.fx - V.rx},21.6 a${V.rx},10.4 0 1,0 ${2 * V.rx},0 a${V.rx},10.4 0 1,0 ${-2 * V.rx},0 Z`;
      let s = "";
      for (const [x, y] of V.ears) {
        const o = x > 24 ? 1 : -1;
        s += E(x, y, 1.8, 2.5, K.skin) + P(`M${r22(x - o * 0.3)},${r22(y - 1.3)} Q${r22(x + o * 0.6)},${y} ${r22(x - o * 0.2)},${r22(y + 1.3)}`, "none", 0.45) + L([x - o * 0.4, y - 0.2], [x - o * 0.1, y + 0.6], K.white, 0.5);
      }
      s += P(decaler("M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z", k), K.white, 0.8) + P(decaler("M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z", k), K.white, 0.8) + L([k + 10.8, 18.4], [k + 11.6, 20.4], K.whiteS, 0.35) + L([k + 37.2, 18.4], [k + 36.4, 20.4], K.whiteS, 0.35);
      s += P(face, K.skin) + clip(`${id}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${K.skinS}"/><g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".45"/><path d="M31.8,13 Q35,21 31.2,30.8 L33.6,30.8 Q37,21 33.6,13 Z" fill="${K.skinS}" opacity=".45"/></g>` + E(Xv(16.6), 25.2, 1.8 * V.rk[0], 0.95, K.cheek, 0).replace("/>", ' opacity=".55"/>') + E(Xv(31.4), 25.2, 1.8 * V.rk[1], 0.95, K.cheek, 0).replace("/>", ' opacity=".55"/>') + L([Xv(15.6), 19.4], [Xv(17.6), 19.8], K.skinS, 0.5) + L([Xv(30.4), 19.8], [Xv(32.4), 19.4], K.skinS, 0.5) + poudre(K, M, [[Xv(15.4), 23.4, 1, 0.45]])) + P(face, "none");
      s += bonnet(c, ctx, K, M, k, mir, id);
      s += rides(Xv(19.4), 22.3, 1, K, V.rk[0]) + rides(Xv(28.6), 22.3, -1, K, V.rk[1]);
      s += oeil(`${id}e0`, Xv(19.4), 22.3, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + oeil(`${id}e1`, Xv(28.6), 22.3, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += sourcil(Xv(19.4), 18.4, 1, ex.browL || ex.brow, V.rk[0], K) + sourcil(Xv(28.6), 18.4, -1, ex.browR || ex.brow, V.rk[1], K);
      const ax = V.axe, kb = V.kb;
      const ouverte = ["laugh", "wow", "shout", "fear", "sob", "o", "open", "teeth", "chatter"].includes(ex.mouth);
      const barbe = decaler(BARBE, kb);
      s += P(barbe, K.beard) + clip(`${id}b`, barbe, `<rect x="${r22(27.6 + kb)}" y="24" width="10" height="26" fill="${K.beardS}"/>` + [18.6, 21.6, 24.6, 27.4, 30].map((x) => `<path d="M${r22(x + kb)},30.6 Q${r22(x + kb - 0.6)},36 ${r22(x + kb + 0.4)},41.6" fill="none" stroke="${K.beardS}" stroke-width="0.5"/>`).join("") + `<rect x="${r22(16.6 + kb)}" y="29" width="1.1" height="7" rx="0.5" fill="${K.beardH}"/>` + [[19.6, 33.4, 1, K.lichen], [26.4, 37.2, 0.8, K.lichenB], [22.2, 40.4, 0.7, K.lichen], [28.8, 31.8, 0.6, K.lichenB]].map(([x, y, r, col]) => E(x + kb, y, r, r * 0.75, col, 0).replace("/>", ` opacity="${r22(0.5 + 0.4 * M.moss)}"/>`)).join("") + poudre(K, M, [[21 + kb, 36, 1.2, 0.5], [27 + kb, 43, 0.9, 0.4]])) + P(barbe, "none");
      const mx = ax;
      const moust = `M${r22(mx - 4.4)},27.6 Q${r22(mx - 2.6)},25 ${mx},26.2 Q${r22(mx + 2.6)},25 ${r22(mx + 4.4)},27.6 Q${r22(mx + 3.4)},29.2 ${r22(mx + 1.6)},28.2 Q${r22(mx + 0.8)},29 ${mx},28 Q${r22(mx - 0.8)},29 ${r22(mx - 1.6)},28.2 Q${r22(mx - 3.4)},29.2 ${r22(mx - 4.4)},27.6 Z`;
      if (ouverte) s += mouth(ex.mouth, ax, 28.6, `${id}m`, K);
      s += `<g transform="translate(0 ${ouverte ? -0.9 : 0})">` + P(moust, K.beardH, 0.8) + L([mx - 3, 27.2], [mx - 1.4, 27.6], K.beardS, 0.4) + L([mx + 3, 27.2], [mx + 1.4, 27.6], K.beardS, 0.4) + "</g>";
      const nx = ctx.view === "se" ? ax - 0.6 : 24;
      s += E(nx, 24.6, 1.6, 1.35, K.nose, 0.8) + E(nx - 0.5, 24.1, 0.5, 0.38, K.noseH, 0) + P(`M${r22(nx + 0.4)},25.4 q0.5,0.2 0.9,-0.1`, "none", 0.35);
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return `<g transform="translate(0 ${HY})">${s}</g>`;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[20.2, 44.4, 0], [26.6, 46.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    function teteDeDos(c, ctx, K, M, mir, id) {
      const back = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z";
      let s = "";
      const touffe = /* @__PURE__ */ __name((m) => {
        const d = "M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z";
        const g = /* @__PURE__ */ __name((inner) => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`, "g");
        return g(P(d, K.beard) + clip(`${id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${K.beardS}"/>` + E(14.6, 32.4, 0.7, 0.5, K.lichen, 0).replace("/>", ' opacity=".6"/>')) + P(d, "none") + P("M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35", "none", 0.5) + L([12.8, 31], [13.2, 33.2], K.beardH, 0.7));
      }, "touffe");
      s += touffe(1) + touffe(-1);
      const cheveux = "M11.2,17.6 Q24,20.6 36.8,17.6 Q37.4,24 35.6,27.8 Q34.6,29.6 33,28.8 Q32,30.6 30.2,29.6 Q28.8,31 27,30 Q25.6,31.2 24,30.2 Q22.4,31.2 21,30 Q19.2,31 17.8,29.6 Q16,30.6 15,28.8 Q13.4,29.6 12.4,27.8 Q10.6,24 11.2,17.6 Z";
      s += P(back, K.skinS) + clip(`${id}h`, back, `<path d="M15,30.4 Q24,32.6 33,30.4" fill="none" stroke="${K.skin}" stroke-width="0.5"/><path d="M18,31.6 Q24,33 30,31.6" fill="none" stroke="${K.skin}" stroke-width="0.4"/>`) + P(back, "none");
      s += P(cheveux, K.hairB) + clip(`${id}c`, cheveux, `<rect x="27.4" y="16" width="12" height="16" fill="${K.whiteS}"/>` + [14.6, 18, 21.4, 24.6, 27.8, 31, 34].map((x, j) => `<path d="M${x},${r22(19.4 + j % 2 * 0.6)} Q${r22(x + (x < 24 ? -0.5 : 0.5))},24.4 ${r22(x + (x < 24 ? 0.2 : -0.2))},28.6" fill="none" stroke="${K.whiteS}" stroke-width="0.45"/>`).join("") + L([13.4, 20.4], [13.8, 25.6], "#FFFFFF", 0.7) + [16.4, 19.8, 23, 26.2].map((x) => L([x, 19.8], [x + 0.3, 24.6], K.white, 0.6)).join("")) + P(cheveux, "none");
      s += [[11.6, 1], [36.4, -1]].map(([x, o]) => E(x, 23, 1.7, 2.4, K.skin) + P(`M${r22(x + o * 0.4)},21.8 Q${r22(x - o * 0.5)},23 ${r22(x + o * 0.3)},24.2`, "none", 0.45) + L([x + o * 0.3, 22.4], [x + o * 0.1, 23.6], K.white, 0.5)).join("");
      s += wind(decaler(QUEUE[0], 0).replace("M21.8,5.2", "M24.6,5.2"), QUEUE[1].replace("M21.8,5.2", "M24.6,5.2"), K.wool, 0.8, "2.3s") + P("M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", K.wool) + clip(`${id}bw`, "M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", `<rect x="27" y="2" width="12" height="18" fill="${K.woolS}"/>` + [8.4, 11.2].map((y) => [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${r22(x - 0.6)},${r22(y - 0.4)} L${x},${r22(y + 0.3)} L${r22(x + 0.6)},${r22(y - 0.4)}" fill="none" stroke="${K.woolS}" stroke-width="0.3" opacity=".7"/>`).join("")).join("") + (M.moss ? E(22, 6.6, 3.2, 1.1, K.moss, 0).replace("/>", ` opacity="${r22(0.5 * M.moss)}"/>`) : "")) + P("M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z", "none") + P("M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z", K.wool, 0.9) + [14, 17, 20, 23, 26, 29, 32, 35].map((x) => `<path d="M${x},${r22(15.2 + (1 - Math.abs(x - 24) / 13) * 2.4)} L${x},${r22(17.6 + (1 - Math.abs(x - 24) / 13) * 2.4)}" stroke="${K.woolS}" stroke-width="0.5"/>`).join("");
      const tg = [17.6, 9.8];
      s += reflet(24, M.bonnet === "reprise" ? E(tg[0], tg[1], 1.4, 1.1, K.darn, 0.5) + [-0.6, 0, 0.6].map((d) => L([tg[0] + d, tg[1] - 0.9], [tg[0] + d, tg[1] + 0.9], K.woolS, 0.3)).join("") : E(tg[0], tg[1], 1.1, 0.85, "#5E2A15", 0.6) + P(`M${tg[0] - 0.6},${tg[1] + 0.3} Q${tg[0]},${tg[1] - 1.6} ${tg[0] + 0.7},${tg[1] + 0.2}`, K.white, 0.5), mir);
      s += E(29.4, 10.6, 1.1, 0.85, "#5E2A15", 0.6) + P("M28.8,10.9 Q29.4,9 30.1,10.8", K.white, 0.5);
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_R[ALIAS[ctx.expr] || ctx.expr] || EXPR_R.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var robby = {
      ...galet,
      name: "Robby",
      uid: "rb",
      teintes: [C.wool, C.beard, C.smock, C.white],
      sleeve: C.smock,
      cuff: null,
      foot: pied,
      // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      bras,
      // le maillet ne quitte pas sa main droite
      hold(c, h) {
        return maillet(pal(c), h, -8);
      },
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      head(c, ctx) {
        return tete(c, ctx);
      },
      // le salut : il lève le maillet en guise de bonjour (« Hm. ») ; l'action : la rune (robby_gestes.js, tailler)
      pose(ctx) {
        const { pose, k } = ctx;
        if (pose === "salut") {
          const h = lerp([36.4, 30.8], [37.6, 32.4], k);
          return { expr: "veille", right: maillet(pal(this), h, 180) + arm(this, [31.6, 38.8], h) };
        }
        return require_robby_gestes().GESTES.tailler.call(this, ctx);
      }
    };
    module.exports = { robby, C, MARKS, EXPR: EXPR_R, pal, marks, reflet, maillet, ciseau, HY };
  }
});

// personnages/refonte/robby_tenues.js
var require_robby_tenues = __commonJS({
  "personnages/refonte/robby_tenues.js"(exports, module) {
    var { castaway, fade } = require_naufrage();
    var { SPECS } = require_naufrages();
    var { robby, C } = require_robby_refonte();
    var { fondre, fondu } = require_couleurs();
    var PALETTES = fondre({
      rouille: { nom: "Rouille", wool: C.wool, woolS: C.woolS, woolH: C.woolH },
      moutarde: { nom: "Moutarde", wool: "#B88A2E", woolS: "#8C661E", woolH: "#DAB05A" },
      chauffe: { nom: "Bleu de chauffe", wool: "#3E5F86", woolS: "#2B4565", woolH: "#6E8EB4" },
      lichen: { nom: "Lichen", wool: "#7A8A4A", woolS: "#5A6834", woolH: "#A2B270" },
      ardoise: { nom: "Ardoise", wool: "#5E646C", woolS: "#43484E", woolH: "#868C94" },
      bordeaux: { nom: "Bordeaux", wool: "#8A3A3A", woolS: "#682828", woolH: "#B0605A" }
    });
    var TENUES = {
      blouse: { nom: "La blouse de tailleur", tenue: "blouse", palette: "rouille", sleeves: null },
      carrier: { nom: "Le tablier de carrier", tenue: "carrier", palette: "moutarde", sleeves: "roll" },
      pelisse: { nom: "La pelisse de la Lande", tenue: "pelisse", palette: "ardoise", sleeves: null }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, des actes plus tard", marks: { dust: 0, moss: 0, salt: 0, dirt: 0, bonnet: "reprise", patch: false } },
      poussiere: { nom: "Un peu sale", quand: "une journée à la Carrière", marks: { dust: 1, moss: 0, salt: 0, dirt: 0.4, bonnet: "reprise", patch: false } },
      rafistole: { nom: "Rafistolé", quand: "recousu au camp", marks: { dust: 0.5, moss: 0.2, salt: 0.1, dirt: 0.2, bonnet: "reprise", patch: true } },
      ermite: { nom: "L'ermite de la fissure", quand: "à son arrivée : des années seul", marks: { dust: 1, moss: 0.8, salt: 0.3, dirt: 0.5, bonnet: "troue", patch: true } },
      naufrage: { nom: "Naufragé", quand: "le naufrage de son caboteur, il y a longtemps", marks: { dust: 0.4, moss: 0.6, salt: 1, dirt: 0.3, bonnet: "troue", patch: true }, naufrage: true },
      trempe: { nom: "Trempé", quand: "l'orage sur La Colline", marks: { dust: 0.3, moss: 0.6, salt: 0.2, dirt: 0.5, bonnet: "troue", patch: true, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["wool", "woolS", "woolH", "smock", "smockS", "smockH", "apron", "apronS", "apronH", "coat", "coatS", "coatH", "fleece", "fleeceS", "beard", "beardS", "beardH", "white", "whiteS", "hairB", "brow"];
    var retourner = /* @__PURE__ */ __name((parVue) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(([x, ...r]) => [Math.round((48 - x) * 100) / 100, ...r])])), "retourner");
    var ponchoMiroir = /* @__PURE__ */ __name((capeFn) => (cc, ctx) => {
      const s = capeFn(cc, ctx), axe = ctx.view === "se" ? 22.4 : 24;
      return cc.miroir ? `<g transform="translate(${2 * axe} 0) scale(-1 1)">${s}</g>` : s;
    }, "ponchoMiroir");
    function habiller(tenueId = "blouse", paletteId = null, etatId = "ermite") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      let pal = { ...pp };
      delete pal.nom;
      if (E.sombre) pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(pal[k] || C[k], E.sombre)]));
      const K = { ...C, ...pal };
      const veste = T2.tenue === "pelisse";
      const c = {
        ...robby,
        uid: `rb${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        sleeves: T2.sleeves,
        sleeve: veste ? K.coat : K.smock,
        leg: E.sombre ? assombrir(robby.leg, E.sombre) : robby.leg,
        legS: E.sombre ? assombrir(robby.legS, E.sombre) : robby.legS,
        teintes: [K.wool, K.beard, K.smock, K.white]
      };
      if (!E.naufrage) return c;
      const delave = ["wool", "woolS", "woolH", "smock", "smockS", "smockH", "coat", "coatS", "coatH", "apron", "apronS", "apronH"];
      const salee = Object.fromEntries(delave.map((k) => [k, fade(K[k], 0.6)]));
      c.pal = { ...pal, ...salee };
      c.sleeve = veste ? salee.coat : salee.smock;
      c.leg = fade(robby.leg, 0.6);
      c.legS = fade(robby.legS, 0.6);
      c.teintes = [salee.wool, K.beard, salee.smock, K.white];
      c.sansDon = true;
      const S = SPECS.Galet;
      const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, col === fondu("#6E6458") ? salee.smock : salee.smockS, ...r])]));
      const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, capeFn: ponchoMiroir(S.capeFn), head: void 0 };
      const droite = castaway(c, spec);
      const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters), bareSide: S.bareSide === "right" ? "left" : "right" });
      return { ...droite, body: /* @__PURE__ */ __name((cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), "body"), foot: /* @__PURE__ */ __name((cc, ...a) => (cc.miroir ? gauche : droite).foot(cc, ...a), "foot") };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/robby_anims.js
var require_robby_anims = __commonJS({
  "personnages/refonte/robby_anims.js"(exports, module) {
    var { frame, IMAGES, E, arm, r2: r22 } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES } = require_lorena_poses();
    var { avec } = require_robby_gestes();
    var { HY } = require_robby_refonte();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.6, dirs: TOUTES, contexte: "Il attend, bourru : « Hm. »", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.13, dirs: MOUVANTES, contexte: "Il va de la fissure à la Carrière, à son rythme (celui de Basalte).", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.08,
        dirs: MOUVANTES,
        contexte: "L'urgence : l'orage, un éboulement, la brume.",
        // la marche, pliée et pressée, à petits pas : bras qui pompent, le buste penché en avant, le corps qui rebondit à
        // peine (75 ans), la poussière au contact du pied
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "decidee");
          const up = [0, -0.2, -0.35, -0.2, 0, -0.2, -0.35, -0.2][n % 8] + (avant(v) ? 0.6 : 0.2);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r22(up)})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.14,
        dirs: MOUVANTES,
        contexte: "Il arrive, freine, puis se pose (et souffle : « Hm. »).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "epuisee")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.24, dirs: ["face"], contexte: "Il lève le maillet en guise de bonjour (« Il dit bonjour. Je crois. »).", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e), "img") },
      tailler: { nom: "Travail : tailler la rune", images: 4, dt: 0.3, dirs: TOUTES, contexte: "À la Carrière : il grave une rune ; au dernier coup, la pierre chante.", img: metier("tailler") },
      piocher: { nom: "Travail : piocher", images: 4, dt: 0.24, dirs: TOUTES, contexte: "À la mine (le gisement) ; au dernier coup, un éclat de cristal.", img: metier("piocher") },
      ecouter: { nom: "Travail : écouter la pierre", images: 4, dt: 0.55, dirs: DEVANT, contexte: "Il cherche « la pierre qui chante » de sa grand-mère.", img: metier("ecouter") },
      porter: { nom: "Travail : porter un bloc", images: 2, dt: 0.4, dirs: TOUTES, contexte: "Il rapporte un bloc de la Carrière, sur l'épaule.", img: metier("porter") },
      lire: { nom: "Travail : lire la rune des Anciens", images: 4, dt: 0.5, dirs: DEVANT, contexte: "Aux pierres des Anciens : la rune s'éclaire sous sa paume (actes III et VI).", img: metier("lire") },
      dodo: {
        nom: "Dodo, assis",
        images: 2,
        dt: 1.2,
        dirs: ["face"],
        contexte: "La nuit, dans sa fissure de La Colline, le maillet posé à côté.",
        // (assis, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre, avec une marge pour
        // les fils qui pendent au bout ; la blouse trempée ne goutte plus)
        // (les mains à portée de ses bras courts : l'une sur le genou, l'autre posée près du maillet, couché à côté)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Galet.dy + 1.2 }), "body") }, n, {
          ...D.POSES.Galet,
          arms: /* @__PURE__ */ __name((cc, [l, r]) => arm(cc, l, [20.4, 53.4], [13.4, 51]) + D.mallet([34.8, 54.4], [38.4, 59.6]) + arm(cc, r, [34.4, 53.8], [36.4, 49.8]), "arms")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couché",
        images: 2,
        dt: 1.2,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, sous une couverture de laine grise (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#7E7A70", motif: "#B5562E" }), "img")
      }
    };
    var decale = /* @__PURE__ */ __name((s) => s ? `<g transform="translate(0 ${HY})">${s}</g>` : s, "decale");
    function poserRobby(c, nom) {
      const p = POSES[nom];
      return {
        ...c,
        uid: `${c.uid}${nom.slice(0, 3)}`,
        geste: nom,
        pose(ctx) {
          if (ctx.view === "ne") return { expr: p.expr };
          if (nom === "joie") {
            const [a, b] = this.shoulders, u = [0, 1, 1.6, 0.8][ctx.n % 4];
            return { expr: p.expr, left: arm(this, a, [r22(a[0] - 7.6 - u * 0.4), r22(a[1] - 5.6 - u * 0.6)]), right: arm(this, b, [r22(b[0] + 7.6 + u * 0.4), r22(b[1] - 5.6 - u * 0.6)]) };
          }
          const r = p.fn.call({ ...this, shoulders: this.shoulders.map(([x, y]) => [x, y - HY]), hands: this.hands.map(([x, y]) => [x, y - HY]) }, ctx);
          return { expr: p.expr, left: decale(r.left), right: decale(r.right), over: decale(r.over), under: decale(r.under) };
        }
      };
    }
    __name(poserRobby, "poserRobby");
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = {
        nom: p.nom,
        images: p.images,
        dt: p.images === 4 ? 0.22 : 0.45,
        dirs: DEVANT,
        pose: true,
        contexte: "Dialogue, réaction (quête, surprise, froid, victoire).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = frame(poserRobby(c, k), v, "action", n, e);
          const bond = typeof p.bond === "function" ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
          return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
        }, "img")
      };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/refonte/maggy_gestes.js
var require_maggy_gestes = __commonJS({
  "personnages/refonte/maggy_gestes.js"(exports, module) {
    var { OUT, E, P, L, r2: r22, limb, arm } = require_troupe();
    var { pal, boite, croissant, feuille } = require_maggy_refonte();
    var coudesDeDos = /* @__PURE__ */ __name((c, e) => {
      const [a, b] = c.shoulders;
      return arm(c, a, [r22(a[0] + e[0]), r22(a[1] + e[1])], void 0, "", "epaule") + arm(c, b, [r22(b[0] - e[0]), r22(b[1] + e[1])], void 0, "", "epaule");
    }, "coudesDeDos");
    var boiteAuBras = /* @__PURE__ */ __name((c, view) => {
      const K = pal(c), a = c.shoulders[0];
      if (view === "ne") return arm(c, a, [15.8, 42], [13.2, 40.2]);
      const k = view === "se" ? -1.6 : 0;
      return boite(K, 21.8 + k, 43.6) + arm(c, a, [19.8 + k, 43.4], [13, 41]);
    }, "boiteAuBras");
    var graine = /* @__PURE__ */ __name((x, y, r = 0.7) => `<circle cx="${r22(x)}" cy="${r22(y)}" r="${r22(r * 2.3)}" fill="#F6E7A0" opacity=".4"/>` + E(x, y, r, r, "#F2C94C", 0.4), "graine");
    function boitePose({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === "se";
      const expr = ["veille", "sourire", "tendresse", "sourire"][i];
      const k = se ? -1.6 : 0;
      const envol = i < 2 ? "" : (i === 2 ? [[22.8, 39.6, 0.6], [25.6, 38.6, 0.7], [24.2, 37.2, 0.5]] : [[30.6, 36.4, 0.65], [34.6, 32.2, 0.6], [37.6, 27.4, 0.55], [40.4, 22.8, 0.5]]).map(([x2, y, r]) => graine(x2 + k, y, r)).join("") + (i === 3 ? `<g opacity=".9">${croissant(42 + k, 17.6, 1.5, "#F6E7A0")}</g>` : "");
      if (view === "ne") return { expr, left: "", right: "", under: coudesDeDos(this, [-3, 8.6]), over: i < 2 ? "" : [[6.6, 28], [41.4, 26.4], [8.4, 19.4], [39.4, 17.8]].slice(0, i === 2 ? 2 : 4).map(([x2, y]) => graine(x2, y - (i === 3 ? 2 : 0), 0.6)).join("") };
      const x = se ? 22.4 : 24;
      return { expr, left: "", right: "", over: boite(K, x, 43.6, i > 0) + arm(this, a, [x - 3.6, 43.4], [a[0] - 3, a[1] + 5.2]) + arm(this, b, [x + 3.6, 43.4], [b[0] + 3, b[1] + 5.2]) + envol };
    }
    __name(boitePose, "boitePose");
    var terreQuiLuit = /* @__PURE__ */ __name((x, y, fort) => `<circle cx="${x}" cy="${r22(y - 0.6)}" r="${fort ? 3.4 : 2.2}" fill="#F6E7A0" opacity="${fort ? 0.45 : 0.25}"/>` + P(`M${r22(x - 2.6)},${r22(y + 0.6)} Q${x},${r22(y - 1.8)} ${r22(x + 2.6)},${r22(y + 0.6)} Z`, "#6B5138", 0.6) + (fort ? croissant(x + 0.2, y - 0.9, 0.7, "#F6E7A0") : E(x, y - 0.4, 0.5, 0.5, "#F2C94C", 0.3)), "terreQuiLuit");
    function semer({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, dos = view === "ne";
      const expr = ["pensive", "veille", "lune", "sourire"][i];
      const s = dos ? a : b, d = dos ? -1 : 1;
      const sol = [r22(s[0] + d * 6.4), 59.4];
      const h = i === 0 ? dos ? [r22(s[0] + 3), r22(s[1] + 8)] : [24.8 + (view === "se" ? -1.6 : 0), 42.4] : [r22(s[0] + d * 4.6), r22(s[1] + 8.6)];
      const main = arm(this, s, h, i === 0 ? [r22(s[0] + d * 2.8), r22(s[1] + 5.6)] : [r22(s[0] + d * 3.4), r22(s[1] + 4.4)]) + (i === 1 ? graine(h[0], h[1] + 1.8, 0.45) : "");
      const tombe = i === 2 ? graine(sol[0] - d * 0.6, (h[1] + sol[1]) / 2 + 2, 0.5) + L([sol[0] - d * 0.6, h[1] + 3.6], [sol[0] - d * 0.6, (h[1] + sol[1]) / 2], "#F6E7A0", 0.4).replace("/>", ' opacity=".7"/>') : "";
      const terre = i >= 2 ? terreQuiLuit(sol[0], sol[1], i === 3) : "";
      const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
      return dos ? { expr, left: main, right: repos, under: terre, over: tombe } : { expr, left: repos, right: main, under: terre, over: tombe };
    }
    __name(semer, "semer");
    function arrosoir(K, h, a, m) {
      const corps = `M-3.6,1.4 L3.4,1.4 L3.8,7.6 Q0,8.6 -4,7.6 Z`;
      const s = P(corps, K.iron, 0.8) + `<path d="M0.8,1.6 L1.4,7.8" stroke="${K.ironS}" stroke-width="1.4"/>` + L([-3, 2.6], [2.8, 2.6], K.ironH, 0.5) + `<path d="M-3,1.4 Q0,-2.2 3,1.4" fill="none" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M-3,1.4 Q0,-2.2 3,1.4" fill="none" stroke="${K.ironS}" stroke-width="0.8" stroke-linecap="round"/>` + limb([-3.6, 5.6], [-8.6, 1.6], 0.9, K.iron) + `<g transform="rotate(-38 -9 1.3)">${E(-9, 1.3, 0.9, 1.4, K.ironH, 0.6)}</g>`;
      return `<g transform="translate(${r22(h[0])} ${r22(h[1])}) rotate(${r22(a)}) scale(${m} 1)">${s}</g>`;
    }
    __name(arrosoir, "arrosoir");
    var pluieFine = /* @__PURE__ */ __name((x, y, sol, n, fort) => Array.from({ length: fort ? 4 : 2 }, (_, j) => {
      const q = (j + 0.5 + n % 2 * 0.4) / (fort ? 4 : 2), gx = x + (j % 2 ? 0.6 : -0.6) + q * 0.6, gy = y + (sol - y) * q;
      return P(`M${r22(gx)},${r22(gy - 0.9)} Q${r22(gx + 0.7)},${r22(gy + 0.2)} ${r22(gx)},${r22(gy + 0.7)} Q${r22(gx - 0.7)},${r22(gy + 0.2)} ${r22(gx)},${r22(gy - 0.9)} Z`, "#8FD3F2", 0.35);
    }).join(""), "pluieFine");
    function arroser({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, dos = view === "ne";
      const expr = ["veille", "lune", "lune", "sourire"][i];
      const s = dos ? a : b, d = dos ? -1 : 1;
      const h = [r22(s[0] + d * 4.2), r22(s[1] + 7.4 - (i === 1 || i === 2 ? 1.2 : 0))];
      const pente = [0, 28, 34, 8][i] * d;
      const can = arrosoir(K, h, pente, -d);
      const rad = pente * Math.PI / 180, bx = 9 * d, by = 1.3;
      const pomme = [h[0] + bx * Math.cos(rad) - by * Math.sin(rad), h[1] + bx * Math.sin(rad) + by * Math.cos(rad)];
      const eau = i === 1 || i === 2 ? pluieFine(pomme[0] + d * 0.4, pomme[1] + 1, 61, n, i === 2) : "";
      const tient = can + arm(this, s, h, [r22(s[0] + d * 3.4), r22(s[1] + 5)]);
      const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
      return dos ? { expr, left: tient, right: repos, over: eau } : { expr, left: repos, right: "", over: tient + eau };
    }
    __name(arroser, "arroser");
    function buissonDHerbes(K, x, y, pris) {
      let s = "";
      for (const [dx, h, r] of [[-2.8, 11.6, -12], [-1, 14.2, -4], [1, 13.2, 5], [2.8, 10.8, 14]].slice(0, pris ? 3 : 4)) {
        const tx = x + dx + Math.sin(r * Math.PI / 180) * h, ty = y - h;
        s += L([x + dx, y], [tx, ty], K.stem, 0.6) + [0, 1, 2].map((j) => E(tx - Math.sin(r * Math.PI / 180) * j * 1.1, ty + j * 1.1, 0.55, 0.75, j % 2 ? K.lavS : K.lavender, 0.3)).join("");
      }
      s += [[-3.6, -1.6, 40], [-1.8, -3, 10], [0.6, -2.6, -20], [2.8, -1.8, -45], [-0.4, -4.8, 0], [-2.4, -6.4, 25], [1.8, -6, -25]].map(([dx, dy, rr]) => feuille(x + dx, y + dy, 2.8, 1.15, rr + 180, "#9AAE8E", "#6E8A64")).join("");
      return E(x, y + 0.4, 5, 1.1, "rgba(40,55,20,.18)", 0) + s;
    }
    __name(buissonDHerbes, "buissonDHerbes");
    function panier(K, [x, y], plein) {
      const by = y + 3;
      const corps = `M${r22(x - 3.8)},${r22(by)} L${r22(x - 3)},${r22(by + 3.6)} Q${x},${r22(by + 4.4)} ${r22(x + 3)},${r22(by + 3.6)} L${r22(x + 3.8)},${r22(by)} Q${x},${r22(by + 0.9)} ${r22(x - 3.8)},${r22(by)} Z`;
      return (plein ? L([x - 1.6, by + 0.2], [x - 2.4, by - 2.6], K.stem, 0.6) + E(x - 2.4, by - 2.8, 0.5, 0.7, K.lavender, 0.3) + L([x + 0.8, by], [x + 1.6, by - 2.2], K.stem, 0.6) + E(x + 1.6, by - 2.4, 0.5, 0.7, K.lavS, 0.3) : "") + `<path d="M${r22(x - 3)},${r22(by)} Q${x},${r22(y - 2.4)} ${r22(x + 3)},${r22(by)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${r22(x - 3)},${r22(by)} Q${x},${r22(y - 2.4)} ${r22(x + 3)},${r22(by)}" fill="none" stroke="${K.woodH}" stroke-width="0.7" stroke-linecap="round"/>` + P(corps, K.woodH, 0.8) + [by + 1.4, by + 2.6].map((yy) => `<path d="M${r22(x - 3.3)},${r22(yy)} Q${x},${r22(yy + 0.8)} ${r22(x + 3.3)},${r22(yy)}" fill="none" stroke="${K.wood}" stroke-width="0.4"/>`).join("");
    }
    __name(panier, "panier");
    function herbes({ view, n }) {
      const [a, b] = this.shoulders, K = pal(this), i = n % 4, dos = view === "ne";
      const expr = ["concentree", "veille", "lune", "sourire"][i];
      const s = dos ? b : a, d = dos ? 1 : -1, o = dos ? a : b, e = -d;
      const bx = r22(24 + d * 16.4), buisson = buissonDHerbes(K, bx, 61.4, i > 0);
      const hp = [r22(o[0] + e * 1.6), r22(o[1] + 9.6)];
      const h = [[r22(s[0] + d * 6.2), r22(s[1] + 9.2)], [r22(s[0] + d * 5.6), r22(s[1] + 8.4)], [r22(24 + d * 2.4 + (view === "se" ? -1.6 : 0)), 31.6], [r22(hp[0] - e * 1.4), r22(hp[1] + 0.6)]][i];
      const brin = i === 1 || i === 2 ? L([h[0], h[1]], [h[0] + d * 0.6, h[1] - 3.4], K.stem, 0.6) + [0, 1].map((j) => E(h[0] + d * 0.6, h[1] - 3.4 + j * 1, 0.5, 0.7, K.lavender, 0.3)).join("") : "";
      const cueille = arm(this, s, h, i === 2 ? [r22(s[0] + d * 2.6), r22(s[1] + 4.6)] : [r22(s[0] + d * 3.2), r22(s[1] + 4.8)]) + brin;
      const tientPanier = panier(K, hp, i === 3) + arm(this, o, hp, [r22(o[0] + e * 2.4), r22(o[1] + 5)]);
      if (dos) return { expr, left: tientPanier, right: cueille, under: buisson };
      return i === 2 ? { expr, left: "", right: tientPanier, under: buisson, over: cueille } : { expr, left: cueille, right: tientPanier, under: buisson };
    }
    __name(herbes, "herbes");
    function papillon(x, y, ouvert, m = 1, s = 1) {
      const ailes = ouvert ? P("M0,0 Q-3.6,-3.6 -4.6,-0.6 Q-4.2,1.6 -1,0.8 Z", "#8E7EB4", 0.6) + P("M0,0 Q3.6,-3.6 4.6,-0.6 Q4.2,1.6 1,0.8 Z", "#7A6AA0", 0.6) + P("M0,0.4 Q-2.8,2.8 -2.2,3.6 Q-0.8,3.4 0,1 Z", "#7A6AA0", 0.55) + P("M0,0.4 Q2.8,2.8 2.2,3.6 Q0.8,3.4 0,1 Z", "#6A5A90", 0.55) + croissant(-2.8, -0.8, 0.7, "#F4EEDF") + croissant(2.8, -0.8, 0.7, "#F4EEDF") : P("M0,0 Q-1.6,-3.8 -2.6,-1 Q-2.2,0.8 -0.4,0.6 Z", "#8E7EB4", 0.6) + P("M0,0 Q1.6,-3.8 2.6,-1 Q2.2,0.8 0.4,0.6 Z", "#7A6AA0", 0.6) + croissant(-1.3, -1.6, 0.5, "#F4EEDF");
      const corps = E(0, 0.8, 0.75, 1.7, "#5A4A78", 0.5) + L([-0.2, -0.6], [-1.4, -2.6], OUT, 0.4) + L([0.2, -0.6], [1.4, -2.6], OUT, 0.4) + [-1, 1].map((k) => L([k * 1.4, -2.6], [k * 1.9, -2.4], OUT, 0.3)).join("");
      return `<g transform="translate(${r22(x)} ${r22(y)}) scale(${r22(m * s)} ${s})">${ailes}${corps}</g>`;
    }
    __name(papillon, "papillon");
    function lunette({ view, n }) {
      const [a, b] = this.shoulders, i = n % 4, dos = view === "ne";
      const expr = ["veille", "leve", "tendresse", "tendresse"][i];
      const pose = dos ? [12.2, 8.6] : [view === "se" ? 34.4 : 36.4, 8.8];
      const [x, y, ouvert] = [[dos ? 4.8 : 43, 30, true], [dos ? 7.4 : 40.4, 20, false], [pose[0], pose[1] - 1, true], [pose[0], pose[1] - 1, false]][i];
      const bete = papillon(x, y, ouvert, dos ? 1 : -1, 1);
      const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
      return dos ? { expr, left: arm(this, a, this.hands[0]), right: repos, over: bete } : { expr, left: repos, right: arm(this, b, this.hands[1]), over: bete };
    }
    __name(lunette, "lunette");
    var GESTES = { boite: boitePose, semer, arroser, herbes, lunette };
    var avec = /* @__PURE__ */ __name((c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] }), "avec");
    module.exports = { GESTES, avec, papillon, arrosoir, panier, graine };
  }
});

// personnages/refonte/maggy_refonte.js
var require_maggy_refonte = __commonJS({
  "personnages/refonte/maggy_refonte.js"(exports, module) {
    var { P, E, L, clip, r2: r22, OUT, lerp, arm, shoe, bareFoot, dechirure, filPendant } = require_troupe();
    var melisse = require_melisse();
    var { EXPR, ALIAS, X, eye, brow, mouth, extras } = require_visage();
    var { seam, suitOurlet } = require_tissu();
    var { fabriquerBras } = require_lorena_bras();
    var { jambe } = require_membres();
    var { capucheRabattue, reperes } = require_avatar_accessoires();
    var { hole, rip } = require_naufrage();
    var { fondre } = require_couleurs();
    var C = fondre({
      skin: "#C68A62",
      skinS: "#A9704C",
      lid: "#B97E58",
      under: "#8E5E44",
      nose: "#8E5A3E",
      cheek: "#E08A7A",
      eye: "#1E1620",
      iris: "#6E6A9E",
      irisL: "#B9B4E0",
      eyeRx: 1.8,
      eyeRy: 2.4,
      brow: "#1C1620",
      browW: 0.9,
      mouth: "#6A3028",
      hand: "#BA8A64",
      handDirt: "#7A5A40",
      hair: "#2B2230",
      hairS: "#1C1620",
      hairH: "#5A4A66",
      rim: "#9FE3DA",
      straw: "#E3C27A",
      strawS: "#BF9A52",
      strawH: "#F2DCA0",
      band: "#7A4A6A",
      bandS: "#5A3450",
      lavender: "#A88BD0",
      lavS: "#7E64A8",
      pink: "#E89AB0",
      yellow: "#F2C94C",
      stem: "#6E8A4A",
      shawl: "#2E3A6B",
      shawlS: "#232C52",
      shawlH: "#46578E",
      moon: "#F4EEDF",
      dress: "#8FA27A",
      dressS: "#728560",
      dressH: "#AABB94",
      apron: "#E6DCC3",
      apronS: "#C9BB98",
      apronH: "#F4EEDF",
      cape: "#6A4A6E",
      capeS: "#4E3452",
      capeH: "#9A7A9E",
      wood: "#A8743F",
      woodS: "#7E5530",
      woodH: "#C9965E",
      stock: "#5A4A44",
      stockS: "#463A35",
      iron: "#6E7480",
      ironS: "#545A65",
      ironH: "#9AA2AD",
      brass: "#C9A24A",
      glow: "#F6E7A0",
      mud: "#6B5138",
      salt: "#FFF8E8",
      leaf: "#5E9E4A",
      leafS: "#467A37",
      twig: "#8A6440",
      weed: "#5E9A62",
      patch: "#B07E4C"
    });
    var MARKS = { dirt: 0.3, ronces: true, salt: 0, patch: false, wet: false, naufrage: false };
    var marks = /* @__PURE__ */ __name((c) => ({ ...MARKS, ...c.marks || {} }), "marks");
    var pal = /* @__PURE__ */ __name((c) => {
      const K = { ...C, ...c.pal || {} };
      return { ...K, coat: K.dress, coatS: K.dressS, coatH: K.dressH, shirt: K.dress, shirtS: K.dressS };
    }, "pal");
    var reflet = /* @__PURE__ */ __name((axe, s, oui) => oui ? `<g transform="translate(${r22(2 * axe)} 0) scale(-1 1)">${s}</g>` : s, "reflet");
    var EXPR_G = {
      ...EXPR,
      veille: X({ brow: [-0.15, 0.1, -0.45], lid: 0.4, tilt: -0.02, look: [0.15, 0.1], under: 0.35, mouth: "half" }),
      essoufflee: X({ brow: [-1, 0.35, -0.2], lid: 0.08, tilt: -0.3, look: [-0.45, 0], under: 0.6, mouth: "open", extras: ["sweat"] }),
      lune: X({ brow: [-0.5, 0, -0.5], mode: "closed", under: 0.3, mouth: "soft" }),
      // le regard levé, doux (Lunette sur son chapeau)
      leve: X({ brow: [-0.6, -0.4, -0.6], lid: 0.08, look: [0.35, -0.75], under: 0.3, mouth: "soft" })
    };
    var croissant = /* @__PURE__ */ __name((x, y, r, fill) => `<path d="M${r22(x)},${r22(y - r)} A${r} ${r} 0 1 0 ${r22(x)},${r22(y + r)} A${r22(r * 0.72)} ${r} 0 1 1 ${r22(x)},${r22(y - r)} Z" fill="${fill}"/>`, "croissant");
    var feuille = /* @__PURE__ */ __name((x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(rot)})">` + P(`M0,0 Q${r22(w)},${r22(len * 0.45)} 0,${r22(len)} Q${r22(-w)},${r22(len * 0.45)} 0,0 Z`, fill, 0.55) + L([0, 0.5], [0, len - 0.7], nerv, 0.3) + "</g>", "feuille");
    function boite(K, x, y, open = false) {
      const lid = open ? P(`M${r22(x - 3.7)},${r22(y - 2.2)} L${r22(x + 3.7)},${r22(y - 2.2)} L${r22(x + 2.9)},${r22(y - 5.4)} L${r22(x - 2.9)},${r22(y - 5.4)} Z`, K.ironS, 0.75) + croissant(x, y - 3.9, 0.8, K.ironH) + E(x, y - 1.6, 2.8, 0.8, K.glow, 0).replace("/>", ' opacity=".85"/>') : `<rect x="${r22(x - 3.9)}" y="${r22(y - 3)}" width="7.8" height="1.6" rx="0.45" fill="${K.ironH}" stroke="${OUT}" stroke-width="0.75"/>`;
      return `<rect x="${r22(x - 3.7)}" y="${r22(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${K.iron}" stroke="${OUT}" stroke-width="0.85"/><rect x="${r22(x + 1.6)}" y="${r22(y - 1.8)}" width="1.7" height="3.8" fill="${K.ironS}"/>` + L([x - 3, y + 1.6], [x - 1.2, y + 1.6], K.ironH, 0.4) + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.33, 0.33, K.ironH, 0)).join("") + lid + (open ? "" : croissant(x - 1.4, y - 2.25, 0.55, K.ironS) + `<rect x="${r22(x - 0.6)}" y="${r22(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${K.brass}" stroke="${OUT}" stroke-width="0.45"/>`);
    }
    __name(boite, "boite");
    var ROBE = /* @__PURE__ */ __name((sw) => `M16.2,33 Q24,30.4 31.8,33 Q34.2,43 ${r22(34.8 + sw)},53.4 Q${r22(24 + sw)},55.8 ${r22(13.2 + sw)},53.4 Q13.8,43 16.2,33 Z`, "ROBE");
    function robe(c, ctx, K, M, k, mir) {
      const u = c.uid, sw = r22((ctx.sway || 0) * 0.3);
      const tb = M.naufrage ? basDechire(r22(34.8 + sw), r22(13.2 + sw), 53.4, r22(24 + sw), 55.8, 7, mir) : null;
      const d = tb ? `M16.2,33 Q24,30.4 31.8,33 Q34.2,43 ${r22(34.8 + sw)},53.4 ${tb.d} Q13.8,43 16.2,33 Z` : ROBE(sw);
      const ourlet = /* @__PURE__ */ __name((off) => suitOurlet(13.2 + sw, 34.8 + sw, 53.4, 55.8, off), "ourlet");
      let s = P(d, K.dress) + clip(`${u}r`, d, `<rect x="${ctx.view === "se" ? 26.4 : 28}" y="30" width="12" height="28" fill="${K.dressS}"/><path d="${ourlet(1)} L38,58 L10,58 Z" fill="${K.dressS}"/><rect x="15.6" y="37" width="1.3" height="14" rx="0.65" fill="${K.dressH}"/><path d="M19.8,40 Q19,46.6 18.2,53.8 M28.6,40 Q29.4,46.6 30.2,53.8" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>` + (M.dirt ? `<path d="${ourlet(2.4)} L38,58 L10,58 Z" fill="${K.mud}" opacity="${r22(0.35 * M.dirt)}"/>` : "") + (M.salt ? `<path d="${ourlet(1.8)}" fill="none" stroke="${K.salt}" stroke-width="0.65" opacity="${r22(0.7 * M.salt)}"/>` : "")) + P(d, "none");
      if (tb) s += tb.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join("");
      if (M.ronces && !M.naufrage) s += reflet(24 + k, rip(30.4 + k, 51.6, 1.4), mir);
      return s;
    }
    __name(robe, "robe");
    function basDechire(xr, xl, y, qx, qy, seed, mir) {
      if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
      const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
      const pts = m.d.split("L").map((s) => s.trim()).filter(Boolean);
      pts.pop();
      return { d: [...pts.reverse(), `${xl},${y}`].map((p) => `L${p}`).join(" "), tips: m.tips };
    }
    __name(basDechire, "basDechire");
    function tablier(c, ctx, K, M, k, mir) {
      const u = c.uid, dos = ctx.view === "ne", sw = r22((ctx.sway || 0) * 0.3), axe = 24 + k;
      if (dos) {
        return P("M17.4,41.6 Q24,42.8 30.6,41.6", "none", 0.8) + P("M24,42.2 Q19.6,38.8 18.8,41.8 Q19.6,44.8 24,42.2 Z", K.apron, 0.8) + P("M24,42.2 Q28.4,38.8 29.2,41.8 Q28.4,44.8 24,42.2 Z", K.apron, 0.8) + P("M23.4,42.8 L21.8,48.4 L23.4,48 Z", K.apron, 0.7) + P("M24.6,42.8 L26.2,48.4 L24.6,48 Z", K.apron, 0.7) + E(24, 42.2, 1.2, 1, K.apronS, 0.7) + `<path d="M18.6,33.2 L29.4,41 M29.4,33.2 L18.6,41" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M18.6,33.2 L29.4,41 M29.4,33.2 L18.6,41" stroke="${K.apron}" stroke-width="0.9" stroke-linecap="round"/>`;
      }
      const d = `M${20 + k},34.4 L${28 + k},34.4 L${28.8 + k},40.6 Q${r22(33.6 + k + sw)},46 ${r22(33.4 + k + sw)},52 Q${r22(24 + k + sw)},54 ${r22(14.6 + k + sw)},52 Q${r22(14.4 + k + sw)},46 ${19.2 + k},40.6 Z`;
      let s = P(d, K.apron) + clip(`${u}t`, d, `<rect x="${28 + k}" y="30" width="10" height="26" fill="${K.apronS}"/>` + (M.dirt ? [[19.6 + k, 49.2, 2], [27 + k, 50.6, 1.6], [23.4 + k, 45.4, 1.1]].map(([x, y, r]) => E(x, y, r, r * 0.6, K.mud, 0).replace("/>", ` opacity="${r22(0.45 * M.dirt)}"/>`)).join("") : "")) + P(d, "none");
      s += `<path d="M${20.6 + k},34.6 L${19.6 + k},32 M${27.4 + k},34.6 L${28.4 + k},32" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${20.6 + k},34.6 L${19.6 + k},32 M${27.4 + k},34.6 L${28.4 + k},32" stroke="${K.apron}" stroke-width="0.8" stroke-linecap="round"/>`;
      s += P(`M${19.2 + k},40.6 L${28.8 + k},40.6`, "none", 0.7) + seam(`M${19.6 + k},41.3 L${28.4 + k},41.3`, 0.32);
      const poches = P(`M${16.6 + k},45.2 L${22 + k},45.2 L${21.8 + k},49.6 Q${19.2 + k},50.4 ${16.8 + k},49.6 Z`, K.apron, 0.6) + seam(`M${17.1 + k},45.8 L${21.5 + k},45.8`, 0.3) + P(`M${26 + k},45.2 L${31.4 + k},45.2 L${31.2 + k},49.6 Q${28.6 + k},50.4 ${26.2 + k},49.6 Z`, K.apron, 0.6) + seam(`M${26.5 + k},45.8 L${30.9 + k},45.8`, 0.3) + L([18.4 + k, 45.4], [17.4 + k, 41.6], OUT, 1.6) + L([18.4 + k, 45.4], [17.4 + k, 41.6], K.wood, 0.8) + P(`M${16.6 + k},42.4 L${18.2 + k},41 L${17.6 + k},39.2 Q${16.4 + k},39.6 ${16.6 + k},42.4 Z`, K.ironH, 0.5) + `<rect x="${27.4 + k}" y="42.6" width="2.6" height="3.2" rx="0.3" fill="${K.yellow}" stroke="${OUT}" stroke-width="0.45" transform="rotate(8 ${28.7 + k} 44.2)"/>` + E(28.6 + k, 43.8, 0.5, 0.5, K.leaf, 0);
      s += reflet(axe, poches, mir);
      if (M.patch) s += reflet(axe, P(`M${19.4 + k},50.4 L${22.6 + k},50.2 L${22.8 + k},52.8 L${19.6 + k},53 Z`, K.patch, 0.5) + seam(`M${19.8 + k},50.8 L${22.2 + k},50.65 L${22.35 + k},52.4 L${19.95 + k},52.55 Z`, 0.3), mir);
      return s;
    }
    __name(tablier, "tablier");
    function corps(c, ctx, K, M) {
      const view = ctx.view, t = c.tenue || "chale", mir = !!c.miroir, dos = view === "ne";
      const k = view === "se" ? -1.6 : 0, axe = 24 + k;
      let s = robe(c, ctx, K, M, k, mir);
      if (!dos) s += P(`M${r22(axe - 3.6)},32.6 Q${axe},35 ${r22(axe + 3.6)},32.6`, "none", 0.55);
      if (t === "tablier") s += tablier(c, ctx, K, M, k, mir);
      if (M.patch && t !== "tablier") {
        const px = dos ? 15.6 : 28.6 + k;
        s += reflet(dos ? 24 : axe, P(`M${px},46.4 L${r22(px + 3.4)},46.2 L${r22(px + 3.6)},49.4 L${r22(px + 0.2)},49.6 Z`, K.patch, 0.5) + seam(`M${r22(px + 0.45)},46.85 L${r22(px + 2.95)},46.7 L${r22(px + 3.1)},48.95 L${r22(px + 0.6)},49.1 Z`, 0.3), mir);
      }
      if (M.naufrage) {
        s += reflet(axe, hole(dos ? 20.4 : 29.6 + k, 44.6, 0.9, K.dressS), mir && !dos);
        s += `<path d="M15,43.2 Q24,45.4 33,43.2 L33,45.6 Q24,47.8 15,45.6 Z" fill="${K.shawl}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>` + (dos ? P("M22.4,46.6 L24,53 L25.6,46.6 Z", K.shawl, 0.7) + L([24, 52.6], [24, 54], K.shawlS, 0.5) : reflet(axe, E(19.6 + k, 44.6, 1.4, 1.1, K.shawlS, 0.7) + P(`M${19 + k},45.6 L${17.8 + k},50.2 L${19.6 + k},49.8 Z`, K.shawl, 0.65), mir));
      }
      return s + mouillee(M, t === "tablier" ? 54.8 : 54.8, ctx);
    }
    __name(corps, "corps");
    var mouillee = /* @__PURE__ */ __name((M, hy, ctx) => M.wet && !ctx.seatDy ? [[15.4, 0], [24.4, 0.55], [33, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r22(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r22(hy + 1)};${r22(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join("") : "", "mouillee");
    var CHALE = "M14.8,32.6 Q24,29.4 33.2,32.6 L34.6,41.2 L30.6,38.8 Q24,42 17.4,38.8 L13.4,41.2 Z";
    var CHALE_DOS = "M14.8,32.6 Q24,29.4 33.2,32.6 L34,36.4 L24,48.2 L14,36.4 Z";
    function chale(c, ctx, K, M) {
      const u = c.uid, dos = ctx.view === "ne", mir = !!c.miroir, k = ctx.view === "se" ? -1.2 : 0;
      const d = dos ? CHALE_DOS : CHALE;
      const lunes = (dos ? [[19.6, 36.2], [24, 42], [28.4, 36.2], [24, 34.4]] : [[16.4, 36.6], [31.6, 36.6], [20.2, 35], [27.8, 35]]).map(([x, y]) => croissant(x, y, 1, K.moon)).join("") + (dos ? [[21.8, 39.2], [26.2, 39.2], [24, 37.4]] : [[18.2, 37.6], [29.8, 37.6], [24, 33.8]]).map(([x, y]) => P(`M${x},${r22(y - 0.6)} L${r22(x + 0.18)},${r22(y - 0.18)} L${r22(x + 0.6)},${y} L${r22(x + 0.18)},${r22(y + 0.18)} L${x},${r22(y + 0.6)} L${r22(x - 0.18)},${r22(y + 0.18)} L${r22(x - 0.6)},${y} L${r22(x - 0.18)},${r22(y - 0.18)} Z`, K.moon, 0)).join("");
      let s = P(d, K.shawl) + clip(`${u}ch`, d, `<rect x="${ctx.view === "se" ? 26.6 : 28}" y="28" width="10" height="22" fill="${K.shawlS}"/>` + lunes + `<path d="M15.6,33.6 Q24,30.8 32.4,33.6" fill="none" stroke="${K.shawlH}" stroke-width="0.6" opacity=".7"/>`) + P(d, "none");
      const fr = dos ? [[22.4, 46.6], [24, 48.2], [25.6, 46.6]] : [[13.6, 41], [14.8, 40.4], [33.2, 40.4], [34.4, 41]];
      s += fr.map(([x, y]) => L([x, y], [x, y + 1.7], K.shawlS, 0.55)).join("");
      if (M.ronces) {
        const a = dos ? [30.6, 38.4] : [17.6, 38.4];
        s += reflet(24, rip(a[0], a[1], 1.6) + `<path d="M${a[0] + 0.4},${a[1] + 0.4} q0.9,1.4 -0.2,2.2 q-0.8,-0.6 0.2,-2.2" fill="none" stroke="${K.shawlS}" stroke-width="0.4"/>` + feuille(a[0] + 1.6, a[1] - 1.6, 2.2, 0.85, 30, K.leaf, K.leafS), mir && !dos);
      }
      return k && !dos ? `<g transform="translate(${k} 0)">${s}</g>` : s;
    }
    __name(chale, "chale");
    function pelerine(c, ctx, K) {
      const u = c.uid, dos = ctx.view === "ne", k = ctx.view === "se" ? -1.4 : 0, axe = 24 + k;
      const d = `M14.6,32.8 Q24,29.4 33.4,32.8 Q35.4,36.8 35.8,40.6 Q24,43.2 12.2,40.6 Q12.6,36.8 14.6,32.8 Z`;
      let s = P(d, K.cape) + clip(`${u}pl`, d, `<rect x="${ctx.view === "se" ? 26.6 : 28.4}" y="28" width="10" height="20" fill="${K.capeS}"/><path d="M15.6,34.8 Q14.6,37.6 14.2,40" fill="none" stroke="${K.capeH}" stroke-width="1" stroke-linecap="round" opacity=".75"/><path d="M17.4,35.4 Q16.9,36.8 16.7,38.2" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round" opacity=".5"/><path d="${suitOurlet(12.2, 35.8, 40.6, 43.2, 0.8)}" fill="none" stroke="${K.capeS}" stroke-width="1.2"/>`) + P(d, "none");
      if (dos) return s + capucheRabattue(u, "ne", reperes(c), K.cape, K.capeS) + P("M24,33 L24,41.6", "none", 0.5);
      s += P(`M${axe},34.6 L${axe},41.8`, "none", 0.7);
      for (const y of [35.8, 38.8]) s += L([axe - 1.4, y], [axe + 1.4, y], K.capeS, 0.8) + E(axe + 1.4, y, 0.5, 0.5, K.brass, 0.35);
      return s;
    }
    __name(pelerine, "pelerine");
    var bras = fabriquerBras({ pal, marks });
    function pied(c, x, y, dir, tilt) {
      const M = marks(c), K = pal(c);
      const droit = (c.view === "ne" ? x >= 24 : x < 24) !== !!c.miroir;
      let s = M.naufrage && droit ? bareFoot({ ...c, skin: K.skin, skinS: K.skinS }, x, y, dir, tilt) : shoe(c, x, y, dir, tilt);
      if (!(M.naufrage && droit)) s += L([x - 1.6, y + 1.4], [x + 1.2, y + 1.2], K.woodH, 0.4).replace("/>", ' opacity=".7"/>');
      if (M.dirt) s += E(x - 0.4, y + 3.8, 2, 0.8, K.mud, 0).replace("/>", ` opacity="${r22(0.7 * M.dirt)}"/>`);
      return s;
    }
    __name(pied, "pied");
    var VUES2 = {
      front: {
        X: /* @__PURE__ */ __name((x) => x, "X"),
        rk: [1, 1],
        k: 0,
        mouth: 24,
        ear: null,
        face: "M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.4 30.6,32.4 24,32.4 C17.4,32.4 12.4,28.4 12.4,22.4 Z"
      },
      se: {
        X: /* @__PURE__ */ __name((x) => r22(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), "X"),
        rk: [0.95, 0.82],
        k: -1.6,
        mouth: 21,
        ear: [34.6, 23.4],
        face: "M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.4 29,32.4 22.6,32.4 C16.2,32.4 11.3,28.4 11.3,22.4 Z"
      }
    };
    var decaler = /* @__PURE__ */ __name((d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r22(+x + k)},${y}`), "decaler");
    var MASSE = "M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z";
    var FRANGE = "M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.6 L23,15.2 Q15,15.6 12.4,20 Z";
    function chapeau(K, M, id, dos, mir) {
      const bord = `M6.4,12.6 a17.6,4.4 0 1,0 35.2,0 a17.6,4.4 0 1,0 -35.2,0 Z`;
      const tresse2 = [3.4, 2.2, 1].map((rr) => `<ellipse cx="24" cy="12.6" rx="${r22(17.6 - (3.4 - rr) * 3.4)}" ry="${r22(4.4 - (3.4 - rr) * 0.9)}" fill="none" stroke="${K.strawS}" stroke-width="0.35" stroke-dasharray=".8 .7" opacity=".8"/>`).join("");
      let s = P(bord, K.straw) + clip(`${id}hb`, bord, `<ellipse cx="22" cy="11.2" rx="16" ry="3.4" fill="${K.strawH}"/><rect x="31" y="6" width="12" height="12" fill="${K.strawS}" opacity=".8"/>` + tresse2) + P(bord, "none");
      if (M.naufrage) s += reflet(24, P("M36.4,15.4 L37.6,17.8 L38.6,15.6 L39.8,16.6 L39.4,14.4 Z", "#E6DCC3", 0.5) + `<path d="M36.6,15.8 Q35.8,18.6 36.8,21" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M36.6,15.8 Q35.8,18.6 36.8,21" fill="none" stroke="${K.weed}" stroke-width="0.8" stroke-linecap="round"/>`, mir);
      const calotte = "M15.4,12.4 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.4 Q24,14.2 15.4,12.4 Z";
      s += P(calotte, K.straw) + clip(`${id}hc`, calotte, `<rect x="27.4" y="2" width="8" height="12" fill="${K.strawS}" opacity=".8"/>` + [6.2, 8].map((y) => `<path d="M15,${y} Q24,${y + 1.4} 33,${y}" fill="none" stroke="${K.strawS}" stroke-width="0.35" stroke-dasharray=".8 .7"/>`).join("")) + P(calotte, "none");
      s += P("M15.6,9.8 Q24,11.6 32.4,9.8 L32.6,12.4 Q24,14.2 15.4,12.4 Z", K.band, 0.75) + L([16.2, 11.2], [21, 12.2], K.bandS, 0.5);
      s += L([18, 6], [21.4, 4.6], K.strawH, 1);
      const bouquet = L([16.4, 11.6], [15.6, 7.8], K.stem, 0.5) + L([17.4, 11.6], [17.4, 7.4], K.stem, 0.5) + [7.8, 8.6, 9.4].map((y) => E(15.6 + (9.4 - y) * 0.1, y, 0.45, 0.6, K.lavender, 0.3)).join("") + [7.4, 8.2].map((y) => E(17.4, y, 0.42, 0.55, K.lavS, 0.3)).join("") + E(18.8, 10.6, 1, 1, K.pink, 0.5) + E(18.6, 10.4, 0.35, 0.35, "#F6C6D4", 0) + E(20.6, 11, 0.75, 0.75, K.yellow, 0.45) + feuille(17.6, 11.6, 2, 0.8, -60, K.leaf, K.leafS);
      s += reflet(24, bouquet, dos ? !mir : mir);
      if (M.ronces) s += reflet(24, feuille(33.8, 13.6, 2.6, 1, -40, K.leaf, K.leafS) + L([30.4, 13.8], [34.6, 15.6], OUT, 1.2) + L([30.4, 13.8], [34.6, 15.6], K.twig, 0.55) + L([33.2, 15], [33.8, 16.6], K.twig, 0.45), dos ? !mir : mir);
      return M.ronces && !M.naufrage ? `<g transform="rotate(-5 24 9)">${s}</g>` : s;
    }
    __name(chapeau, "chapeau");
    function natte(K, M, [p0, p1, p2], w0, w1, nb, bout) {
      const at = /* @__PURE__ */ __name((t) => {
        const u = 1 - t;
        return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
      }, "at");
      const tan = /* @__PURE__ */ __name((t) => {
        const u = 1 - t;
        return [2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])];
      }, "tan");
      let s = "";
      for (let i = nb - 1; i >= 0; i--) {
        const t = (i + 0.5) / nb, [x, y] = at(t), [tx, ty] = tan(t), a = Math.atan2(ty, tx) * 180 / Math.PI - 90;
        const w = w0 + (w1 - w0) * t, m = i % 2 ? 1 : -1, len = Math.hypot(tx, ty) / nb * 0.78;
        const lobe = `M${r22(-w * 0.5)},${r22(-len * 0.55)} Q${r22(w * 0.55)},${r22(-len * 0.9)} ${r22(w * 0.5)},${r22(len * 0.25)} Q${r22(w * 0.2)},${r22(len * 0.95)} ${r22(-w * 0.35)},${r22(len * 0.6)} Q${r22(-w * 0.62)},${r22(len * 0.1)} ${r22(-w * 0.5)},${r22(-len * 0.55)} Z`;
        s += `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(a)}) translate(${r22(m * w * 0.12)} 0) rotate(${m * 24}) scale(${m} 1)">` + P(lobe, K.hair, 0.65) + `<path d="M${r22(-w * 0.28)},${r22(-len * 0.35)} Q${r22(w * 0.12)},${r22(-len * 0.5)} ${r22(w * 0.3)},${r22(len * 0.05)}" fill="none" stroke="${K.hairH}" stroke-width="0.45" stroke-linecap="round" opacity=".85"/><path d="M${r22(-w * 0.32)},${r22(len * 0.42)} Q${r22(0)},${r22(len * 0.7)} ${r22(w * 0.3)},${r22(len * 0.35)}" fill="none" stroke="${K.hairS}" stroke-width="0.5" stroke-linecap="round"/></g>`;
      }
      if (bout) {
        const [x, y] = at(1), [tx, ty] = tan(1), a = Math.atan2(ty, tx) * 180 / Math.PI - 90;
        s += `<g transform="translate(${r22(x)} ${r22(y)}) rotate(${r22(a)})">` + P("M-0.9,0.2 Q-1.3,1.6 -0.8,2.6 L-0.3,1.8 L0.1,2.9 L0.5,1.8 L1,2.5 Q1.3,1.4 0.9,0.2 Z", K.hair, 0.6) + `<rect x="-1.1" y="-0.7" width="2.2" height="1.1" rx="0.45" fill="${K.band}" stroke="${OUT}" stroke-width="0.45"/>` + E(1.4, -0.4, 0.75, 0.75, K.pink, 0.4) + E(1.3, -0.5, 0.25, 0.25, "#F6C6D4", 0) + "</g>";
      }
      if (M.ronces) {
        const [x1, y1] = at(0.35), [x2, y2] = at(0.7);
        s += `<path d="M${r22(x1 + 1)},${r22(y1)} q1.6,1 1,3" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r22(x1 + 1)},${r22(y1)} q1.6,1 1,3" fill="none" stroke="${K.hair}" stroke-width="0.5" stroke-linecap="round"/><path d="M${r22(x2 - 1)},${r22(y2)} q-1.4,0.9 -1,2.6" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r22(x2 - 1)},${r22(y2)} q-1.4,0.9 -1,2.6" fill="none" stroke="${K.hair}" stroke-width="0.5" stroke-linecap="round"/>`;
      }
      return s;
    }
    __name(natte, "natte");
    var tresse = /* @__PURE__ */ __name((K, M, k) => natte(K, M, [[33 + k, 25.4], [32.4 + k, 33.2], [30.4 + k, 44.4]], 3.4, 2.2, 8, true), "tresse");
    function tete(c, ctx) {
      const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
      if (ctx.view === "ne") return teteDeDos(c, ctx, K, M, mir, id);
      const V = VUES2[ctx.view] || VUES2.front, Xv = V.X, k = V.k, se = ctx.view === "se", axe = 24 + k;
      const name = ALIAS[ctx.expr] || ctx.expr;
      const ex = ctx.blink && name === "veille" ? EXPR_G.cligne : EXPR_G[name] || EXPR_G.veille;
      const masse = decaler(MASSE, k), frange = decaler(FRANGE, k);
      let s = P(masse, K.hair) + clip(`${id}h`, masse, `<rect x="8" y="24" width="34" height="6" fill="${K.hairS}"/><path d="M${r22(35 + k)},13 Q${r22(37.8 + k)},20 ${r22(36 + k)},28 L40,28 L40,13 Z" fill="${K.rim}" opacity=".45"/>`) + P(masse, "none");
      if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r22(V.ear[0] + 0.1)},${r22(V.ear[1] - 1)} Q${r22(V.ear[0] + 0.8)},${V.ear[1]} ${r22(V.ear[0] + 0.1)},${r22(V.ear[1] + 1)}`, "none", 0.5);
      s += reflet(axe, tresse(K, M, k), mir);
      s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${frange}" fill="${K.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="6" fill="${K.skinS}" opacity=".55"/><g transform="translate(${k} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".35"/></g>` + E(Xv(16.4), 26.8, 2.3 * V.rk[0], 1.3, K.cheek, 0).replace("/>", ' opacity=".5"/>') + E(Xv(31.6), 26.8, 2.3 * V.rk[1], 1.3, K.cheek, 0).replace("/>", ' opacity=".5"/>') + (M.ronces ? reflet(Xv(24), `<path d="M${Xv(15.4)},25.4 l1.6,0.9 M${Xv(15.8)},26.4 l1.2,0.6" stroke="#B5473A" stroke-width="0.4" stroke-linecap="round"/>`, mir) : "") + (M.salt ? E(Xv(30.4), 17, 0.9, 0.4, K.salt, 0).replace("/>", ` opacity="${r22(0.6 * M.salt)}"/>`) : "")) + P(V.face, "none");
      s += P(frange, K.hair) + clip(`${id}fr`, frange, `<path d="M10,17.6 Q24,14.4 38,17.6 L38,21 L10,21 Z" fill="${K.hairS}" opacity=".45"/>`) + P(frange, "none") + L([16 + k, 15.4], [20.6 + k, 14.6], K.hairH, 0.8) + L([27.4 + k, 14.6], [31.4 + k, 15.4], K.hairH, 0.6);
      s += se ? P("M20.6,25.3 Q21.3,26 22.2,25.5", "none", 0.65).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) : P("M23.2,25.4 Q24,26.2 24.8,25.4", "none", 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.32, 0.22, "#D9A47E", 0);
      s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
      s += brow(Xv(19.4), 18.8, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.8, -1, ex.browR || ex.brow, false, V.rk[1], K);
      s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
      s += `<g transform="translate(${k} 0)">${chapeau(K, M, id, false, mir)}</g>`;
      s += extras(ex.extras, ctx.n % 2, Xv);
      if (M.wet) s += gouttes(mir);
      return s;
    }
    __name(tete, "tete");
    var gouttes = /* @__PURE__ */ __name((mir) => reflet(24, [[8.4, 14.4, 0], [39.6, 14.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(""), mir), "gouttes");
    function teteDeDos(c, ctx, K, M, mir, id) {
      const back = "M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.6,29.4 35.4,32.2 Q30,33.8 24,33.8 Q18,33.8 12.6,32.2 Q10.4,29.4 11.2,21 Z";
      let s = E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
      s += reflet(24, natte(K, M, [[24.2, 30.6], [21.2, 35.8], [15.4, 36.6]], 3.6, 3, 5, false), mir);
      s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="8" width="34" height="27" fill="${K.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${K.hair}"/><path d="M35.4,12 Q38.2,22 35.6,32 L39,32 L39,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(back, "none");
      s += P("M18,17 Q17.4,24 19.4,31", "none", 0.55) + P("M29.6,17 Q30.4,24 28.6,31.2", "none", 0.55) + P("M24,18 Q24.4,25 24,31.8", "none", 0.55);
      s += `<g transform="translate(48 0) scale(-1 1)">${chapeau(K, M, `${id}d`, true, mir)}</g>`;
      if (M.wet) s += gouttes(!mir);
      const ex = EXPR_G[ALIAS[ctx.expr] || ctx.expr] || EXPR_G.veille;
      return s + extras(ex.extras, ctx.n % 2, (v) => v, true);
    }
    __name(teteDeDos, "teteDeDos");
    var maggy = {
      ...melisse,
      name: "Maggy",
      uid: "mg",
      teintes: [C.hair, C.straw, C.shawl, C.dress, C.lavender],
      sleeve: C.dress,
      cuff: null,
      sleeves: null,
      hand: C.hand,
      leg: C.stock,
      legS: C.stockS,
      shoe: C.wood,
      shoeS: C.woodS,
      shoeH: C.woodH,
      foot: pied,
      jambeOs: jambe,
      // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
      bras,
      // la boîte à graines serrée contre elle, au creux de son bras droit (à gauche de l'écran) : ce bras ne balance pas
      restLeft(c, ctx) {
        const K = pal(c), a = c.shoulders[0];
        if (ctx.view === "ne") return arm(c, a, [15.8, 42], [13.2, 40.2]);
        const k = ctx.view === "se" ? -1.6 : 0;
        return boite(K, 21.8 + k, 43.6) + arm(c, a, [19.8 + k, 43.4], [13, 41]);
      },
      // derrière le corps : la capuche rabattue de la pèlerine (de face, de trois quarts)
      backItems(c, ctx) {
        const K = pal(c);
        if (ctx.view === "ne" || (c.tenue || "chale") !== "pluie") return "";
        return capucheRabattue(c.uid, ctx.view, reperes(c), K.cape, K.capeS);
      },
      body(c, ctx) {
        return corps(c, ctx, pal(c), marks(c));
      },
      // de dos, la nuque sous les cheveux
      neck(c, ctx) {
        if (ctx.view !== "ne") return "";
        return P("M19.8,30.4 L28.2,30.4 L28.4,32.95 Q24,32.25 19.6,32.95 Z", C.skinS, 0);
      },
      // par-dessus le haut des bras : le châle (sauf naufragée : noué à la taille), ou la pèlerine
      overArms(c, ctx) {
        const K = pal(c), M = marks(c), t = c.tenue || "chale";
        if (t === "pluie") return pelerine(c, ctx, K);
        if (t === "chale" && !M.naufrage) return chale(c, ctx, K, M);
        return "";
      },
      head(c, ctx) {
        return tete(c, ctx);
      },
      // le salut : la main gauche levée, lentement (la boîte reste dans l'autre bras) ; l'action : ouvrir la boîte
      // (maggy_gestes.js)
      pose(ctx) {
        const { pose, k } = ctx;
        if (pose === "salut") {
          const [, b] = this.shoulders;
          const h = lerp([r22(b[0] + 4.2), r22(b[1] - 8.2)], [r22(b[0] + 5.2), r22(b[1] - 7.8)], k);
          return { expr: "sourire", right: "", over: arm(this, b, h, [r22(b[0] + 5), r22(b[1] - 0.6)]) };
        }
        return require_maggy_gestes().GESTES.boite.call(this, ctx);
      }
    };
    module.exports = { maggy, C, MARKS, EXPR: EXPR_G, pal, marks, reflet, boite, croissant, feuille };
  }
});

// personnages/refonte/maggy_tenues.js
var require_maggy_tenues = __commonJS({
  "personnages/refonte/maggy_tenues.js"(exports, module) {
    var { fade } = require_naufrage();
    var { maggy, C } = require_maggy_refonte();
    var { fondre } = require_couleurs();
    var PALETTES = fondre({
      sauge: { nom: "Sauge", m: C.dress, mS: C.dressS, mH: C.dressH },
      lavande: { nom: "Lavande", m: "#9A8AB8", mS: "#7A6A98", mH: "#BCAED6" },
      ocre: { nom: "Ocre", m: "#C49A4A", mS: "#9C7634", mH: "#DDBA74" },
      rose: { nom: "Rose thé", m: "#C98A86", mS: "#A66A66", mH: "#E2AEAA" },
      aubergine: { nom: "Aubergine", m: C.cape, mS: C.capeS, mH: C.capeH },
      mousse: { nom: "Mousse", m: "#6E8A5A", mS: "#546E44", mH: "#92AA7E" }
    });
    var TENUES = {
      chale: { nom: "Le châle de nuit", tenue: "chale", palette: "sauge", sleeves: null, cles: ["dress", "dressS", "dressH"] },
      tablier: { nom: "Le tablier du Potager", tenue: "tablier", palette: "lavande", sleeves: "roll", cles: ["dress", "dressS", "dressH"] },
      pluie: { nom: "La pèlerine de pluie", tenue: "pluie", palette: "aubergine", sleeves: null, cles: ["cape", "capeS", "capeH"] }
    };
    var ETATS = {
      propre: { nom: "Propre", quand: "au village, un jour sans jardin", marks: { dirt: 0, ronces: false, salt: 0, patch: false } },
      terreuse: { nom: "Terreuse", quand: "une journée au Potager", marks: { dirt: 1, ronces: false, salt: 0, patch: false } },
      rafistole: { nom: "Rafistolée", quand: "recousue au camp", marks: { dirt: 0.3, ronces: false, salt: 0, patch: true } },
      poursuivie: { nom: "Poursuivie", quand: "son arrivée : elle sort de la forêt, quelqu'un la suivait", marks: { dirt: 0.4, ronces: true, salt: 0, patch: false } },
      naufrage: { nom: "Naufragée", quand: "le jour où sa barque de graines s'est brisée, sur une autre côte", marks: { dirt: 0.2, ronces: false, salt: 1, patch: false, naufrage: true }, naufrage: true },
      trempe: { nom: "Trempée", quand: "l'averse sur le Potager", marks: { dirt: 0.4, ronces: false, salt: 0, patch: false, wet: true }, sombre: 0.82 }
    };
    function assombrir(hex, k) {
      const n = parseInt(hex.slice(1), 16);
      return "#" + [n >> 16, n >> 8 & 255, n & 255].map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    __name(assombrir, "assombrir");
    var MOUILLE = ["dress", "dressS", "dressH", "shawl", "shawlS", "shawlH", "apron", "apronS", "cape", "capeS", "capeH", "straw", "strawS", "strawH", "hair", "hairS", "hairH", "band", "bandS"];
    var DELAVE = ["dress", "dressS", "dressH", "shawl", "shawlS", "shawlH", "apron", "apronS", "cape", "capeS", "capeH", "straw", "strawS", "strawH", "band", "bandS"];
    function habiller(tenueId = "chale", paletteId = null, etatId = "poursuivie") {
      const T2 = TENUES[tenueId], E = ETATS[etatId];
      if (!T2) throw new Error(`tenue inconnue : ${tenueId}`);
      if (!E) throw new Error(`état inconnu : ${etatId}`);
      const pp = PALETTES[paletteId || T2.palette];
      if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
      const [km, kS, kH] = T2.cles;
      let pal = { [km]: pp.m, [kS]: pp.mS, [kH]: pp.mH };
      const K = /* @__PURE__ */ __name(() => ({ ...C, ...pal }), "K");
      if (E.sombre) {
        const k0 = K();
        pal = Object.fromEntries(MOUILLE.map((k) => [k, assombrir(k0[k], E.sombre)]));
      }
      if (E.naufrage) {
        const k0 = K();
        pal = { ...pal, ...Object.fromEntries(DELAVE.map((k) => [k, fade(k0[k], 0.6)])) };
      }
      const k1 = K();
      const hand = E.marks.dirt >= 0.8 ? C.handDirt : C.hand;
      return {
        ...maggy,
        uid: `mg${tenueId.slice(0, 2)}${(paletteId || T2.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
        tenue: T2.tenue,
        pal,
        marks: E.marks,
        sleeves: T2.sleeves,
        hand,
        sleeve: k1.dress,
        leg: E.sombre ? assombrir(C.stock, 0.9) : C.stock,
        legS: E.sombre ? assombrir(C.stockS, 0.9) : C.stockS,
        teintes: [k1.hair, k1.straw, k1.shawl, k1.dress, k1.lavender, k1.cape]
      };
    }
    __name(habiller, "habiller");
    module.exports = { habiller, TENUES, PALETTES, ETATS };
  }
});

// personnages/refonte/maggy_anims.js
var require_maggy_anims = __commonJS({
  "personnages/refonte/maggy_anims.js"(exports, module) {
    var { frame, IMAGES, E, arm, r2: r22 } = require_troupe();
    var G = require_gestes();
    var D = require_dormeurs();
    var { marcher } = require_membres();
    var { POSES } = require_lorena_poses();
    var { avec } = require_maggy_gestes();
    var { boite, pal } = require_maggy_refonte();
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
    var poussiere = /* @__PURE__ */ __name((x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, "#EFE4CC", 0.5)).join(""), "poussiere");
    var pencher = /* @__PURE__ */ __name((deg, s) => deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s, "pencher");
    var avant = /* @__PURE__ */ __name((vue) => vue === "se" ? -1 : vue === "ne" ? 1 : 0, "avant");
    function freiner({ view }) {
      const [a, b] = this.shoulders, k = avant(view);
      return { expr: "surprise", left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
    }
    __name(freiner, "freiner");
    var metier = /* @__PURE__ */ __name((nom, e) => (c, v, n, x) => frame(avec(c, nom), v, "action", n, x || e), "metier");
    var ANIMS = {
      repos: { nom: "Repos", images: IMAGES.repos, dt: 0.6, dirs: TOUTES, contexte: "Elle attend, calme absolu : rien ne la presse.", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "repos", n, e), "img") },
      marche: { nom: "Marche", images: IMAGES.marche, dt: 0.12, dirs: MOUVANTES, contexte: "Elle va du Potager à la lisière, lentement, en sabots.", img: /* @__PURE__ */ __name((c, v, n, e) => marcher(c, v, n, e), "img") },
      course: {
        nom: "Course",
        images: IMAGES.marche,
        dt: 0.07,
        dirs: MOUVANTES,
        contexte: "Rare : son arrivée (on la poursuivait), une averse sur les semis.",
        // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au contact du
        // pied (en sabots : le rebond plus court) ; (penchée, le grand chapeau monte : le corps descend d'autant)
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = marcher({ ...c, course: true }, v, n, e || "essoufflee");
          const up = [0, -0.2, -0.35, -0.2, 0, -0.2, -0.35, -0.2][n % 8] + (avant(v) ? 0.8 : 0.2);
          const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : "";
          return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r22(up)})">${s}</g>`);
        }, "img")
      },
      arret: {
        nom: "Arrêt",
        images: 4,
        dt: 0.14,
        dirs: MOUVANTES,
        contexte: "Elle arrive, freine, puis se pose (et sourit en coin).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || "surprise"));
          if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: "freiner", pose: freiner }, v, "action", 0, e));
          if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, "repos", 0, e || "essoufflee")}</g>`;
          return frame(c, v, "repos", 0, e || "veille");
        }, "img")
      },
      salut: { nom: "Salut", images: IMAGES.salut, dt: 0.28, dirs: ["face"], contexte: "Elle lève la main, lentement : « Chaque chose en sa lune. »", img: /* @__PURE__ */ __name((c, v, n, e) => frame(c, v, "salut", n, e), "img") },
      boite: { nom: "La boîte à graines", images: 4, dt: 0.5, dirs: TOUTES, contexte: "Elle ouvre sa boîte : des graines lumineuses s'envolent, comme de petites lunes.", img: metier("boite") },
      semer: { nom: "Travail : semer à la lune", images: 4, dt: 0.45, dirs: TOUTES, contexte: "Au Potager : une graine dans la terre, la terre luit.", img: metier("semer") },
      arroser: { nom: "Travail : arroser", images: 4, dt: 0.36, dirs: TOUTES, contexte: "Au Potager : l'arrosoir de fer, la pluie fine.", img: metier("arroser") },
      herbes: { nom: "Travail : cueillir les herbes", images: 4, dt: 0.45, dirs: TOUTES, contexte: "Les herbes des potions d'Agathe : elle cueille, respire, met au panier.", img: metier("herbes") },
      lunette: { nom: "Lunette", images: 4, dt: 0.5, dirs: TOUTES, contexte: "Lunette, son papillon de nuit, se pose sur son chapeau.", img: metier("lunette") },
      dodo: {
        nom: "Dodo, assise",
        images: 2,
        dt: 1.2,
        dirs: ["face"],
        contexte: "La nuit, au Potager : assise, la boîte sur les genoux, endormie dessus sous son grand chapeau.",
        // (assise, le corps descend ; la robe trempée ne goutte plus) ; la boîte sur les genoux, les bras croisés dessus ; la
        // tête penchée, le chapeau qui la cache à moitié (dormeurs.js, POSES.Mélisse)
        img: /* @__PURE__ */ __name((c, v, n) => D.seated({ ...c, restLeft: void 0, body: /* @__PURE__ */ __name((cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES["Mélisse"].dy }), "body") }, n, {
          ...D.POSES["Mélisse"],
          // (la boîte, à l'échelle de ses genoux : deux fois la boîte qu'elle serre au repos, vue de plus près)
          arms: /* @__PURE__ */ __name((cc, [l, r]) => `<g transform="translate(24 50.4) scale(2) translate(-24 -50.4)">${boite(pal(cc), 24, 50.4)}</g>` + arm(cc, l, [27.8, 46.2], [12.8, 46]) + arm(cc, r, [20.2, 46.4], [35.2, 46.2]), "arms")
        }), "img")
      },
      dodoCouche: {
        nom: "Dodo, couchée",
        images: 2,
        dt: 1.2,
        dirs: ["face"],
        cadre: G.CADRE_COUCHE,
        contexte: "La nuit, au camp, sous une couverture couleur nuit (cadre couché 64 × 48).",
        img: /* @__PURE__ */ __name((c, v, n) => G.couche(c, n, c.couverture || { fond: "#2E3A6B", motif: "#F4EEDF" }), "img")
      }
    };
    var LEVEES = /* @__PURE__ */ new Set(["joie", "sursaut", "visiere", "tete", "pointe"]);
    function poserMaggy(c, nom) {
      const p = POSES[nom];
      return {
        ...c,
        uid: `${c.uid}${nom.slice(0, 3)}`,
        geste: nom,
        pose(ctx) {
          if (ctx.view === "ne") return { expr: p.expr };
          const r = p.fn.call(this, ctx);
          if (!LEVEES.has(nom)) return { expr: p.expr, ...r };
          return { expr: p.expr, left: "", right: "", under: r.under, over: (r.left || "") + (r.right || "") + (r.over || "") };
        }
      };
    }
    __name(poserMaggy, "poserMaggy");
    for (const [k, p] of Object.entries(POSES)) {
      ANIMS[`pose_${k}`] = {
        nom: p.nom,
        images: p.images,
        dt: p.images === 4 ? 0.2 : 0.42,
        dirs: DEVANT,
        pose: true,
        contexte: "Dialogue, réaction (quête, surprise, froid, victoire).",
        img: /* @__PURE__ */ __name((c, v, n, e) => {
          const s = frame(poserMaggy(c, k), v, "action", n, e);
          const bond = typeof p.bond === "function" ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
          return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
        }, "img")
      };
    }
    function dessiner(c, anim, direction, n, expr) {
      const A2 = ANIMS[anim], d = DIRECTIONS[direction];
      if (!A2) throw new Error(`animation inconnue : ${anim}`);
      if (!d) throw new Error(`direction inconnue : ${direction}`);
      const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
      const s = A2.img(cc, d.vue, n % A2.images, expr);
      const w = A2.cadre ? A2.cadre[2] : 48;
      return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
    }
    __name(dessiner, "dessiner");
    module.exports = { ANIMS, DIRECTIONS, dessiner };
  }
});

// personnages/portraits.js
var require_portraits = __commonJS({
  "personnages/portraits.js"(exports, module) {
    var T2 = require_troupe();
    var G = null;
    var { ENCRE: OUT } = require_couleurs();
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 0.7) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var thin = /* @__PURE__ */ __name((s, k) => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${f(w * k)}"`), "thin");
    var IR = "pi";
    var SKIN = "#F2C9A0";
    var lash = /* @__PURE__ */ __name((x, y, rx, ry, k) => G && G.lashes === false ? P(`M${f(x - rx - 0.1)},${f(y - ry * 0.35)} Q${f(x)},${f(y - ry - 0.6)} ${f(x + rx + 0.1)},${f(y - ry * 0.35)}`, "none", 0.5) : P(`M${f(x - rx - 0.25)},${f(y - ry * 0.3)} Q${f(x)},${f(y - ry - 0.8)} ${f(x + rx + 0.25)},${f(y - ry * 0.3)}`, "none", 0.8) + P(`M${f(x - k * (rx + 0.15))},${f(y - ry * 0.45)} L${f(x - k * (rx + 0.95))},${f(y - ry * 0.85)}`, "none", 0.6), "lash");
    var shine = /* @__PURE__ */ __name((x, y, rx, ry) => E(x + 0.45, y - ry * 0.4, 0.68, 0.74, WHITE) + E(x - 0.5, y + ry * 0.45, 0.3, 0.3, WHITE) + P(`M${f(x - rx * 0.62)},${f(y + ry * 0.5)} Q${f(x)},${f(y + ry * 0.95)} ${f(x + rx * 0.62)},${f(y + ry * 0.5)}`, "none", 0).replace('fill="none"', `fill="none" stroke="#B88468" stroke-width="0.45" opacity=".85"`), "shine");
    var iris = /* @__PURE__ */ __name((x, y, rx, ry) => E(x, y, rx, ry, `url(#${IR})`), "iris");
    var EYE = {
      open: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => iris(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + shine(x + (o.dx || 0), y + (o.dy || 0), rx, ry) + lash(x, y, rx, ry, k), "open"),
      blink: /* @__PURE__ */ __name((x, y, rx, ry, k) => P(`M${f(x - rx - 0.25)},${f(y + 0.3)} Q${f(x)},${f(y + 1.7)} ${f(x + rx + 0.25)},${f(y + 0.3)}`, "none", 0.8) + (G && G.lashes === false ? "" : P(`M${f(x - k * (rx + 0.2))},${f(y + 0.3)} L${f(x - k * (rx + 0.9))},${f(y - 0.2)}`, "none", 0.6)), "blink"),
      joy: /* @__PURE__ */ __name((x, y, rx) => P(`M${f(x - rx - 0.3)},${f(y + 1)} Q${f(x)},${f(y - 1.5)} ${f(x + rx + 0.3)},${f(y + 1)}`, "none", 0.85), "joy"),
      big: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + iris(x + (o.dx || 0), y + 0.2, rx * 0.6, ry * 0.55) + E(x + (o.dx || 0) + 0.3, y - 0.4, 0.32, 0.34, WHITE), "big"),
      tiny: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => E(x, y, rx + 0.4, ry + 0.25, WHITE, 0.6) + E(x + (o.dx || 0), y + 0.3, 0.42, 0.52, OUT), "tiny"),
      squeeze: /* @__PURE__ */ __name((x, y, rx, ry, k) => P(`M${f(x - k * 1.4)},${f(y - 1.5)} L${f(x + k * 1.2)},${y} L${f(x - k * 1.4)},${f(y + 1.5)}`, "none", 0.85), "squeeze"),
      lid: /* @__PURE__ */ __name((x, y, rx, ry, k, o) => {
        const top = y - 0.6, yl = f(top + (k > 0 ? o.tO : o.tI)), yr = f(top + (k > 0 ? o.tI : o.tO));
        const d = `M${f(x - rx)},${yl} L${f(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${f(x - rx)},${yl} Z`;
        return `<path d="${d}" fill="url(#${IR})"/>` + E(x + 0.45, y + 0.7, 0.42, 0.42, WHITE) + (o.glint ? E(x - 0.4, y + 0.2, 0.28, 0.28, WHITE) : "") + P(`M${f(x - rx - 0.45)},${f(yl - (yr - yl) * 0.12)} L${f(x + rx + 0.45)},${f(yr + (yr - yl) * 0.12)}`, "none", 0.85);
      }, "lid"),
      sleepy: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const top = y + 0.3;
        return `<path d="M${f(x - rx)},${f(top)} Q${x},${f(top - 0.9)} ${f(x + rx)},${f(top)} A${rx} ${f(ry * 0.85)} 0 0 1 ${f(x - rx)},${f(top)} Z" fill="url(#${IR})"/>` + E(x + 0.4, top + 0.9, 0.34, 0.34, WHITE) + P(`M${f(x - rx - 0.5)},${f(top + 0.3)} Q${x},${f(top - 1.1)} ${f(x + rx + 0.5)},${f(top + 0.3)}`, "none", 0.85) + (o.cerne ? P(`M${f(x - rx * 0.8)},${f(y + ry + 0.5)} Q${x},${f(y + ry + 1.3)} ${f(x + rx * 0.8)},${f(y + ry + 0.5)}`, "none", 0).replace('fill="none"', 'fill="none" stroke="#A47C9C" stroke-width="0.55" opacity=".8"') : "");
      }, "sleepy"),
      star: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const r = ry * 1.05 * (o.s || 1);
        let d = "";
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r;
          d += `${i ? "L" : "M"}${f(x + q * Math.cos(a))},${f(y + q * Math.sin(a))}`;
        }
        return P(d + " Z", "#FFD54A", 0.6) + E(x - r * 0.25, y - r * 0.3, r * 0.18, r * 0.14, WHITE);
      }, "star"),
      heart: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        const s = 1.15 * (o.s || 1);
        return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${P("M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z", "#F0607A", 0.55)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`;
      }, "heart"),
      spiral: /* @__PURE__ */ __name((x, y, rx, ry, k, o = {}) => {
        let d = "";
        for (let i = 0; i <= 28; i++) {
          const a = i * 0.42 + (o.rot || 0), r = 0.1 + i * 0.065;
          d += `${i ? "L" : "M"}${f(x + r * Math.cos(a))},${f(y + r * 1.2 * Math.sin(a))}`;
        }
        return E(x, y, rx + 0.3, ry + 0.15, WHITE, 0.6) + P(d, "none", 0.55);
      }, "spiral"),
      line: /* @__PURE__ */ __name((x, y, rx, ry, k) => P(`M${f(x - rx - 0.2)},${f(y + 0.2 - k * 0.3)} L${f(x + rx + 0.2)},${f(y + 0.2 + k * 0.3)}`, "none", 0.85), "line")
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
      degoute: [0.9, -0.3, 0.3],
      // soulagé : rassuré et reconnaissant (le soulagement, FACS AU1 : le bout intérieur des sourcils relevé), sans éclat
      soulage: [-0.8, 0.2, -0.5]
    };
    function sourcils(e) {
      const g = G, cx = (g.eyes[0][0] + g.eyes[1][0]) / 2, [bi, bo, a0] = BROW[e], arch = a0 + (g.browArch || 0);
      return g.eyes.map(([x, y, rx], i) => {
        const k = cx > x ? 1 : -1, hw = rx + 0.5 + (g.browLen || 0), by = y + g.browY + (g.browLift || 0);
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
      degoute: [["line"], ["sleepy"]],
      soulage: ["blink"]
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
      return P(d, g.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + depth * 0.5, hw * 0.6, depth * 0.3, g.tongue)}${dents ? `<rect x="${f(mx - hw)}" y="${f(my - 0.4)}" width="${f(2 * hw)}" height="0.75" fill="${WHITE}"/>` : ""}</g>` + P(d, "none", 0.75);
    }
    __name(ouverte, "ouverte");
    function bouche(e, t) {
      const g = G, [mx, my] = g.mouth, w = g.mw, line = /* @__PURE__ */ __name((d, wd = 0.75) => P(d, "none", wd), "line");
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
          return P(`M${f(mx - 1.7)},${f(my + 1.3)} Q${mx},${f(my - 0.4)} ${f(mx + 1.7)},${f(my + 1.3)} Q${mx},${f(my + 0.7)} ${f(mx - 1.7)},${f(my + 1.3)} Z`, g.mouthC, 0.75);
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
          return P(d + " Z", g.mouthC, 0.7) + E(mx, my + 2, 0.7, 0.5, g.tongue);
        }
        case "boude":
          return P(`M${f(mx - 0.2)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my - 0.1)} ${f(mx + 1.1)},${f(my + 0.7)} Q${f(mx + 0.5)},${f(my + 1.4)} ${f(mx - 0.2)},${f(my + 0.7)} Z`, g.mouthC, 0.65);
        case "determine":
          return P(`M${f(mx - w - 0.2)},${f(my)} Q${mx},${f(my + 0.5)} ${f(mx + w + 0.2)},${f(my - 0.3)} Q${f(mx + 0.2)},${f(my + 2.2)} ${f(mx - w - 0.2)},${f(my)} Z`, WHITE, 0.7) + line(`M${f(mx - w)},${f(my + 0.35)} Q${mx},${f(my + 0.9)} ${f(mx + w)},${f(my + 0.1)}`, 0.4);
        case "emerveille":
          return ouverte(mx, my, w + 0.7, w * 1.6 + 1.5, true);
        case "adore":
          return line(`M${f(mx - 1.6)},${f(my + 0.2)} Q${f(mx - 0.8)},${f(my + 1.3)} ${mx},${f(my + 0.3)} Q${f(mx + 0.8)},${f(my + 1.3)} ${f(mx + 1.6)},${f(my + 0.2)}`, 0.7);
        case "crocodile": {
          const s = 0.3 * Math.sin(8 * Math.PI * t), d = `M${f(mx - 2.3)},${f(my + 0.1)} L${f(mx + 2.3)},${f(my + 0.1)} Q${f(mx + 1.9)},${f(my + 3.9 + s)} ${mx},${f(my + 4 + s)} Q${f(mx - 1.9)},${f(my + 3.9 + s)} ${f(mx - 2.3)},${f(my + 0.1)} Z`, id = `${IR}m${MC++}`;
          return P(d, G.mouthC, 0.75) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${E(mx, my + 3.4, 1.4, 1, G.tongue)}<rect x="${f(mx - 2.3)}" y="${f(my - 0.2)}" width="4.6" height="0.8" fill="${WHITE}"/></g>` + P(d, "none", 0.75);
        }
        case "pensif":
          return line(`M${f(mx - 0.4)},${f(my + 0.7)} Q${f(mx + 0.4)},${f(my + 0.5)} ${f(mx + 1.1)},${f(my + 0.2)}`, 0.7);
        case "malicieux":
          return line(`M${f(mx - 1.4)},${f(my + 0.4)} Q${f(mx + 0.2)},${f(my + 1.3)} ${f(mx + 1.7)},${f(my - 0.4)}`) + P(`M${f(mx - 0.3)},${f(my + 0.85)} Q${f(mx + 0.25)},${f(my + 2.5 + 0.2 * Math.sin(2 * Math.PI * t))} ${f(mx + 0.9)},${f(my + 0.6)} Z`, G.tongue, 0.55);
        case "fier":
          return line(`M${f(mx - w - 0.4)},${f(my - 0.2)} Q${mx},${f(my + 1.8)} ${f(mx + w + 0.4)},${f(my - 0.2)}`, 0.75) + line(`M${f(mx + w + 0.2)},${f(my - 0.6)} L${f(mx + w + 0.6)},${f(my + 0.1)}`, 0.5);
        case "fatigue":
          return E(mx, my + 0.8, 0.85, 0.45 + 0.25 * Math.max(0, Math.sin(2 * Math.PI * t)), g.mouthC, 0.6);
        case "soulage":
          return line(`M${f(mx - w * 0.72)},${f(my + 0.1)} Q${mx},${f(my + w * 0.62)} ${f(mx + w * 0.72)},${f(my + 0.1)}`);
        case "degoute":
          return line(`M${f(mx - 1.8)},${f(my + 1.1)} Q${f(mx - 0.9)},${f(my + 0.1)} ${mx},${f(my + 0.8)} Q${f(mx + 0.9)},${f(my + 1.5)} ${f(mx + 1.8)},${f(my + 0.5)}`, 0.7) + P(`M${f(mx + 0.1)},${f(my + 0.9)} Q${f(mx + 0.6)},${f(my + 2.2)} ${f(mx + 1.1)},${f(my + 1.1)} Z`, G.tongue, 0.5);
      }
      return "";
    }
    __name(bouche, "bouche");
    var drop = /* @__PURE__ */ __name((x, y, r, fill = "#A9DCFF", o = 1) => `<g opacity="${f(o)}">${P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y + r)} Q${f(x - r * 1.5)},${f(y + r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, fill, 0.55)}${E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE)}</g>`, "drop");
    var eclat = /* @__PURE__ */ __name((x, y, r, o = 1) => r < 0.1 ? "" : `<path d="M${x},${f(y - r)} Q${f(x + r * 0.18)},${f(y - r * 0.18)} ${f(x + r)},${y} Q${f(x + r * 0.18)},${f(y + r * 0.18)} ${x},${f(y + r)} Q${f(x - r * 0.18)},${f(y + r * 0.18)} ${f(x - r)},${y} Q${f(x - r * 0.18)},${f(y - r * 0.18)} ${x},${f(y - r)} Z" fill="#FFF3B0" stroke="${OUT}" stroke-width="0.4" opacity="${f(o)}"/>`, "eclat");
    var coeur = /* @__PURE__ */ __name((x, y, s, o) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" opacity="${f(o)}">${P("M0,1.9 C-2.6,0.2 -2.4,-2.2 -1,-2.2 C-0.3,-2.2 0,-1.6 0,-1.2 C0,-1.6 0.3,-2.2 1,-2.2 C2.4,-2.2 2.6,0.2 0,1.9 Z", "#F0607A", 0.6)}${E(-1, -1.3, 0.4, 0.3, WHITE)}</g>`, "coeur");
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
          return E(g.cheeks[1][0] - 0.4, g.cheekY - 0.2, 2.6, 1.8, "#F08A8A").replace("/>", ' opacity=".7"/>') + E(g.cheeks[1][0] - 1, g.cheekY - 0.8, 0.7, 0.4, WHITE).replace("/>", ' opacity=".7"/>') + `<g opacity="${f(1 - u)}" transform="translate(${f(ax - 1 + u * 2)} ${f(ay + 2 - u * 2)}) scale(${f(0.6 + u * 0.6)})">${P("M-2,0.6 a1.2,1.2 0 0 1 0.6,-2 a1.5,1.5 0 0 1 2.8,0 a1.2,1.2 0 0 1 0.6,2 Z", "#F4F2EA", 0.5)}</g>`;
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
            return P(d, "#B8E4FF", 0.55) + `<path d="M${f(x0 + s * 0.2)},${f(y0 + 1)} Q${f(x0 + s * 0.7)},${f(y0 + 5)} ${f(x0 + s * 1.5)},${f(y0 + 9.4)}" fill="none" stroke="${WHITE}" stroke-width="0.45" stroke-linecap="round" stroke-dasharray="1.4 2.2" stroke-dashoffset="${f(-t * 7.2)}" opacity=".9"/>`;
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
        // soulagé : les joues roses
        case "soulage":
          return G.cheeks.map(([x, rx]) => E(x, G.cheekY, rx * 1.25, 1.3, "#F08A8A").replace("/>", ' opacity=".45"/>')).join("");
        case "degoute":
          return traits(ex0 - 1.6, ex1 + 1.6, 15.8, 19, "#7AA858", 6) + E(G.mouth[0], G.mouth[1] + 4, 0, 0, "none");
      }
      return "";
    }
    __name(signes, "signes");
    var BX = 37.5;
    var BY = 10.5;
    var contour = /* @__PURE__ */ __name((d, fill, w = 0.7) => `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${f(w + 1.6)}" stroke-linejoin="round" stroke-linecap="round"/>` + P(d, fill, w), "contour");
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
        return `<g transform="translate(${BX} ${BY})"><circle cx="0" cy="-2.4" r="5" fill="#FFF3B0" opacity="${f(o * 0.6)}"/>${contour("M0,-6.4 Q3.2,-6.4 3.2,-3.2 Q3.2,-1.6 1.6,-0.4 L1.4,1 L-1.4,1 L-1.6,-0.4 Q-3.2,-1.6 -3.2,-3.2 Q-3.2,-6.4 0,-6.4 Z", "#FFD54A")}${P("M-1.3,1.6 L1.3,1.6 L1,2.8 L-1,2.8 Z", "#B8B0A0", 0.55)}${E(-1, -4.2, 0.6, 0.9, WHITE)}${[[-5.4, -3.2, -7.2, -3.2], [5.4, -3.2, 7.2, -3.2], [-3.8, -7.4, -5, -8.6], [3.8, -7.4, 5, -8.6], [0, -8, 0, -9.8]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#F2B230" stroke-width="0.7" stroke-linecap="round" opacity="${f(o + 0.2)}"/>`).join("")}</g>`;
      }, "ampoule"),
      orage: /* @__PURE__ */ __name((t) => {
        const flash = Math.floor(t * 8) % 4 === 1;
        return `<g transform="translate(${f(BX - 1 + 0.4 * Math.sin(2 * Math.PI * t))} ${BY})">${contour("M-4,-1 Q-6,-1 -6,-3 Q-6,-5 -4,-5 Q-3.6,-7.6 -1,-7.6 Q1,-7.6 1.6,-6 Q2.4,-6.8 3.6,-6.4 Q5.4,-5.8 5,-4 Q6.6,-3.6 6.2,-2 Q5.8,-1 4.6,-1 Z", "#8A8EA8", 0.6)}${P("M0.4,-1 L-1.2,2.2 L0.4,2.2 L-0.6,5.2 L2,1.2 L0.4,1.2 L1.6,-1 Z", flash ? "#FFF6A0" : "#F2C94C", 0.5)}</g>`;
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
    function dessin2(c, e, uid, fixe) {
      G = null;
      MC = 0;
      IR = `${uid}i`;
      SKIN = c.skin || "#F2C9A0";
      const base = thin(T2.frame({ ...c, uid }, "front", "repos", 0, "vide"), 0.6);
      G = T2.visageVide();
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
    __name(dessin2, "dessin");
    var VB = [5, 0, 38, 38];
    function recadrer() {
      const cx = (G.eyes[0][0] + G.eyes[1][0]) / 2, ey = G.eyes[0][1];
      VB = [f(cx - 19), f(ey - 22.6), 38, 38];
      BX = VB[0] + 32.5;
      BY = VB[1] + 10.5;
    }
    __name(recadrer, "recadrer");
    var EXPRESSIONS_PORTRAIT = Object.keys(YEUX);
    var NOMS_EXPRESSIONS = { neutre: "Neutre", content: "Content", rire: "Rire", surpris: "Surpris", triste: "Triste", fache: "Fâché", gene: "Gêné", endormi: "Endormi", emu: "Ému aux larmes", effraye: "Effrayé", boude: "Boudeur", determine: "Déterminé", emerveille: "Émerveillé (yeux en étoiles)", adore: "Adore (yeux en cœurs)", etourdi: "Étourdi (yeux en spirale)", crocodile: "Gros chagrin", pensif: "Pensif", malicieux: "Malicieux", fier: "Fier", fatigue: "Fatigué", degoute: "Dégoûté", soulage: "Soulagé (rassuré, reconnaissant)" };
    var NOMS_BULLES = { exclamation: "Exclamation (!)", question: "Question (?)", points: "Points de suspension (…)", note: "Note de musique", ampoule: "Ampoule (une idée)", orage: "Nuage d'orage" };
    var BULLES_PORTRAIT = Object.keys(BULLES);
    var HD = 4;
    var TAILLE = 96;
    var svgOf2 = /* @__PURE__ */ __name((cadre, corps, hd) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TAILLE * hd}" height="${TAILLE * hd}" viewBox="${cadre.join(" ")}">${corps}</svg>`, "svgOf");
    function portrait(c, expr = "neutre", { fixe = false, hd = HD, uid } = {}) {
      if (!YEUX[expr]) throw new Error(`expression inconnue : ${expr} (${EXPRESSIONS_PORTRAIT.join(", ")})`);
      const corps = dessin2(c, expr, uid || `${c.uid || "p"}${expr}`, fixe), cadre = VB.slice();
      return { svg: svgOf2(cadre, corps, hd), cadre, corps };
    }
    __name(portrait, "portrait");
    function bulle(cle, { fixe = false, hd = HD } = {}) {
      if (!BULLES[cle]) throw new Error(`bulle inconnue : ${cle} (${BULLES_PORTRAIT.join(", ")})`);
      BX = 32.5;
      BY = 10.5;
      const corps = fixe ? BULLES[cle](0.3) : phases(BULLES[cle]), cadre = [0, 0, 38, 38];
      return { svg: svgOf2(cadre, corps, hd), cadre, corps };
    }
    __name(bulle, "bulle");
    function signesSur(g, e, { fixe = false, uid = "p", peau = "#F2C9A0" } = {}) {
      if (!YEUX[e]) throw new Error(`expression inconnue : ${e} (${EXPRESSIONS_PORTRAIT.join(", ")})`);
      G = { lashes: true, ...g };
      MC = 0;
      IR = `${uid}i`;
      SKIN = peau;
      let y = "";
      if (MOUVANTS.includes(e) && e !== "effraye") {
        const cache = G.eyes.map(([x, yy, rx]) => E(x, yy, rx + 0.9, G.ry + 0.7, peau)).join("");
        y = cache + (fixe ? yeux(e, 0, false) : phases((t) => yeux(e, t, false)));
      }
      const s = fixe ? signes(e, 0.2) : phases((t) => signes(e, t));
      const bouge = BOUGE[e] && !fixe ? `<animateTransform attributeName="transform" type="translate" values="${BOUGE[e][0]}" dur="${BOUGE[e][1]}" repeatCount="indefinite"/>` : "";
      return { dessus: y + s, bouge };
    }
    __name(signesSur, "signesSur");
    module.exports = { portrait, bulle, signesSur, EXPRESSIONS_PORTRAIT, BULLES_PORTRAIT, NOMS_EXPRESSIONS, NOMS_BULLES, HD_PORTRAIT: HD, TAILLE_PORTRAIT: TAILLE };
  }
});

// atelier/troupe_refonte.js
var require_troupe_refonte = __commonJS({
  "atelier/troupe_refonte.js"(exports, module) {
    var { frame } = require_troupe2();
    var { enPersonnage } = require_couleurs();
    var MODULES = {
      lorena: [require_lorena_tenues(), require_lorena_anims()],
      agathe: [require_agathe_tenues(), require_agathe_anims()],
      nathan: [require_nathan_tenues(), require_nathan_anims()],
      leo: [require_leo_tenues(), require_leo_anims()],
      maerys: [require_maerys_tenues(), require_maerys_anims()],
      robby: [require_robby_tenues(), require_robby_anims()],
      maggy: [require_maggy_tenues(), require_maggy_anims()]
    };
    var MODULES_REFONTE = {
      lorena: require_lorena_refonte(),
      agathe: require_agathe_refonte(),
      nathan: require_nathan_refonte(),
      leo: require_leo_refonte(),
      maerys: require_maerys_refonte(),
      robby: require_robby_refonte(),
      maggy: require_maggy_refonte()
    };
    var MAITRES = [
      { name: "Aster", refonte: "lorena", naufrage: "naufragee", action: ["avant_longuevue", "se", "longuevue"], travail: "peche" },
      { name: "Cannelle", refonte: "agathe", naufrage: "naufragee", action: ["face_louche", "front", "touiller"], travail: "touiller" },
      { name: "Rivet", refonte: "nathan", naufrage: "naufrage", action: ["face_loupe", "front", "loupe"], travail: "visser" },
      { name: "Ondin", refonte: "leo", naufrage: "naufrage", action: ["face_baguette", "front", "sourcier"], travail: "sourcier" },
      { name: "Sylve", refonte: "maerys", naufrage: "naufrage", action: ["face_chant", "front", "chanter"], travail: "chanter", sansDon: true },
      { name: "Galet", refonte: "robby", naufrage: "naufrage", action: ["face_rune", "front", "tailler"], travail: "tailler", sansDon: true },
      { name: "Mélisse", refonte: "maggy", naufrage: "naufrage", action: ["face_graines", "front", "boite"], travail: "semer", pluie: "pluie" }
    ];
    var DIR = { front: "face", se: "bas_gauche", ne: "haut_droite" };
    var deux = /* @__PURE__ */ __name((N) => N >= 4 ? [1, 3] : [0, 1], "deux");
    function refondu(m, etat, naufrage2) {
      const [T2, A2] = MODULES[m.refonte];
      const c = { ...T2.habiller(void 0, null, etat), name: m.name, action: [m.action[0], m.action[1]] };
      const anim = /* @__PURE__ */ __name((nom, v, n, expr, cc = c) => enPersonnage(A2.dessiner(cc, nom, DIR[v], n, expr)), "anim");
      const joue = /* @__PURE__ */ __name((nom, v) => {
        const X = A2.ANIMS[nom];
        return X && X.dirs.includes(DIR[v]) ? X : null;
      }, "joue");
      c.refonte = {
        module: m.refonte,
        // le repos, la marche, le salut : les siens (le salut n'a que la face : les autres vues gardent celui du kit) ; cc : le
        // même corps dans une autre tenue (l'hiver, la pluie du kit : tenues.js)
        a: /* @__PURE__ */ __name((nom, v, n, expr, cc) => joue(nom, v) ? anim(nom, v, n, expr, cc) : null, "a"),
        // sa tenue de pluie, s'il en a une (Maggy) : sinon, le ciré du kit (tenues.js, sousLaPluie)
        pluie: /* @__PURE__ */ __name(() => m.pluie ? { ...T2.habiller(m.pluie, null, etat), name: m.name } : null, "pluie"),
        // le geste du métier (travail), deux images, dans les trois vues ; l'action (le fichier nommé), deux images
        travail: /* @__PURE__ */ __name((v) => {
          const X = joue(m.travail, v);
          return X ? deux(X.images).map((n) => anim(m.travail, v, n)) : null;
        }, "travail"),
        action: /* @__PURE__ */ __name(() => {
          const X = A2.ANIMS[m.action[2]];
          return deux(X.images).map((n) => anim(m.action[2], m.action[1], n));
        }, "action"),
        // le sommeil : assis (dort, le cadre 48 × 64) et couché sous sa couverture (couche, le cadre 64 × 48 ; la couverture
        // du kit, troupe_liste.js : la sienne au village, la voile pour le naufragé)
        dort: /* @__PURE__ */ __name((n) => anim("dodo", "front", n), "dort"),
        couche: /* @__PURE__ */ __name((n, couverture) => anim("dodoCouche", "front", n, void 0, { ...c, couverture }), "couche")
      };
      if (naufrage2 && m.sansDon) c.sansDon = true;
      return c;
    }
    __name(refondu, "refondu");
    var image2 = /* @__PURE__ */ __name((c, v, pose, n, expr, cc) => c.refonte && c.refonte.a(pose, v, n, expr, cc) || frame(cc || c, v, pose, n, expr), "image");
    var CAST_REFONTE2 = MAITRES.map((m) => ({ base: refondu(m, "propre", false), nau: refondu(m, m.naufrage, true) }));
    var P = require_portraits();
    var HUMEURS = {
      neutre: "veille",
      content: "sourire",
      rire: "rire",
      surpris: "surprise",
      triste: "triste",
      fache: "colere",
      gene: "genee",
      endormi: "endormie",
      emu: "tendresse",
      effraye: "peur",
      boude: "boude",
      determine: "decidee",
      emerveille: "emerveillee",
      adore: "tendresse",
      etourdi: "douleur",
      crocodile: "sanglot",
      pensif: "pensive",
      malicieux: "clin",
      fier: "ironique",
      fatigue: "epuisee",
      degoute: "mefiante",
      soulage: "soulagee"
    };
    var YEUX = { lorena: 22.7, agathe: 22.8, nathan: 22.6, leo: 27.7, maerys: 22.8, robby: 26.7, maggy: 22.8 };
    var geometrie = /* @__PURE__ */ __name((ey) => ({ eyes: [[19.4, ey, 1.7], [28.6, ey, 1.7]], ry: 2.3, mouth: [24, ey + 4.9], mw: 1.7, cheeks: [[16.8, 1.9], [31.2, 1.9]], cheekY: ey + 3.9, temple: [13.4, ey - 10.2], anger: [40, ey - 15.8], zz: [36.4, ey - 16.8] }), "geometrie");
    var r22 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
    var affiner = /* @__PURE__ */ __name((s, k) => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${r22(w * k)}"`), "affiner");
    var cligne = /* @__PURE__ */ __name((ouverts, fermes) => `<g><animate attributeName="opacity" values="1;0;1" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${ouverts}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${fermes}</g>`, "cligne");
    function portrait(c, humeur = "neutre", { fixe = false } = {}) {
      const x = HUMEURS[humeur];
      if (!x) throw new Error(`humeur inconnue : ${humeur} (${Object.keys(HUMEURS).join(", ")})`);
      const m = c.refonte.module, ey = YEUX[m], uid = `${m}p${humeur}`;
      const buste = /* @__PURE__ */ __name((e) => affiner(frame({ ...c, uid: `${uid}${e}` }, "front", "repos", 0, e), 0.6), "buste");
      const peau = c.pal && c.pal.skin || MODULES_REFONTE[m].C.skin;
      const { dessus, bouge } = P.signesSur(geometrie(ey), humeur, { fixe, uid, peau });
      const ferme = /* @__PURE__ */ __name(() => buste("cligne").replace(/id="/g, 'id="f').replace(/url\(#/g, "url(#f").replace(/href="#/g, 'href="#f'), "ferme");
      const corps = (x === "veille" && !fixe ? cligne(buste(x), ferme()) : buste(x)) + dessus;
      const cadre = [5, r22(ey - 22.6), 38, 38], cote = P.TAILLE_PORTRAIT * P.HD_PORTRAIT;
      return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}" viewBox="${cadre.join(" ")}"><g>${bouge}${corps}</g></svg>`, cadre };
    }
    __name(portrait, "portrait");
    module.exports = { CAST_REFONTE: CAST_REFONTE2, MAITRES, DIR, image: image2, HUMEURS, portrait };
  }
});

// atelier/assis.js
var require_assis = __commonJS({
  "atelier/assis.js"(exports, module) {
    var { arm, leg, limb, r2: r22 } = require_troupe2();
    var { enPersonnage } = require_couleurs();
    var KNEE = 53;
    var SEAT = 53.6;
    var dyOf = /* @__PURE__ */ __name((c) => r22(KNEE - c.hip), "dyOf");
    function assisPieces(c, view, n, expr, geste) {
      const id = `${c.uid}${view}assis${geste ? geste.name : ""}${n}`;
      const cc = { ...c, uid: id, view };
      const ctx = { view, pose: "repos", n, ph: 0, id, walk: false, expr: expr || "neutre", eyeMode: null, open: false, blink: !geste && n === 1 };
      const dy = dyOf(c);
      ctx.seatDy = dy;
      const knee = KNEE;
      const dir = view === "se" ? -1 : view === "ne" ? 1 : 0;
      const up = /* @__PURE__ */ __name((s) => s ? `<g transform="translate(0 ${dy})">${s}</g>` : "", "up");
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
      let corps = up(c.backItems ? c.backItems(cc, ctx) : "");
      corps += act && act.under ? act.under : "";
      corps += legs;
      corps += up(c.body(cc, ctx));
      if (view !== "front") corps += armR;
      corps += up(c.neck ? c.neck(cc, ctx) : "");
      const dessus = up(c.overArms ? c.overArms(cc, ctx) : "");
      const tete = up(c.head(cc, ctx, act || {})) + up(c.overHead ? c.overHead(cc, ctx) : "") + (act && act.over ? act.over : "");
      return {
        corps: enPersonnage(corps),
        brasG: enPersonnage(armL),
        brasD: view === "front" ? enPersonnage(armR) : "",
        dessus: enPersonnage(dessus),
        tete: enPersonnage(tete),
        epaules: sh,
        cou: [24, r22(sh[0][1] - 1)]
      };
    }
    __name(assisPieces, "assisPieces");
    function assis(c, view, n, expr, geste) {
      const p = assisPieces(c, view, n, expr, geste);
      return p.corps + p.brasG + p.brasD + p.dessus + p.tete;
    }
    __name(assis, "assis");
    module.exports = { assis, assisPieces, dyOf, SEAT };
  }
});

// atelier/troupe_liste.js
var require_troupe_liste = __commonJS({
  "atelier/troupe_liste.js"(exports, module) {
    var { frame, IMAGES } = require_troupe2();
    var A2 = require_avatar();
    var G = require_gestes();
    var { assis } = require_assis();
    var { fondre } = require_couleurs();
    var STD = [0, 0, 48, 64];
    var VUE = { front: "face", se: "avant", ne: "dos" };
    var slug = /* @__PURE__ */ __name((s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), "slug");
    function poses2(c, { travail = false, lanterne = false, couche = true, valise = null, couverture, parapluie = "#D9443A" } = {}) {
      const out = [];
      const tenir = valise ? G.avecValise(c, valise) : c;
      const R2 = c.refonte;
      const de = /* @__PURE__ */ __name((nom, v, n, kit) => R2 && R2.a(nom, v, n) || kit(), "de");
      for (const v of ["front", "se", "ne"]) {
        out.push([`${VUE[v]}_marche`, v, STD, [...Array(IMAGES.marche).keys()].map((n) => de("marche", v, n, () => frame(tenir, v, "marche", n)))]);
        out.push([`${VUE[v]}_repos`, v, STD, [...Array(IMAGES.repos).keys()].map((n) => de("repos", v, n, () => frame(tenir, v, "repos", n)))]);
        out.push([`${VUE[v]}_salut`, v, STD, [...Array(IMAGES.salut).keys()].map((n) => de("salut", v, n, () => frame(c, v, "salut", n)))]);
        if (travail) out.push([`${VUE[v]}_travail`, v, STD, R2 && R2.travail(v) || [0, 1].map((n) => frame(c, v, "action", n))]);
        out.push([`${VUE[v]}_assis`, v, STD, [0, 1].map((n) => assis(c, v, n))]);
        out.push([`${VUE[v]}_mains-tendues`, v, STD, [0, 1].map((n) => frame(G.avecMainsTendues(c), v, "action", n))]);
        out.push([`${VUE[v]}_assis-mains-tendues`, v, STD, [0, 1].map((n) => assis(c, v, n, null, G.tendre))]);
        out.push([`${VUE[v]}_applaudir`, v, STD, [0, 1].map((n) => frame(G.avecApplaudir(c), v, "action", n))]);
        out.push([`${VUE[v]}_assis-applaudir`, v, STD, [0, 1].map((n) => assis(c, v, n, null, G.applaudir))]);
        out.push([`${VUE[v]}_pecher`, v, STD, [0, 1].map((n) => frame(G.avecPecher(c), v, "action", n))]);
        out.push([`${VUE[v]}_piocher`, v, STD, [0, 1].map((n) => frame(G.avecPiocher(c), v, "action", n))]);
        out.push([`${VUE[v]}_cueillir`, v, STD, [0, 1].map((n) => frame(G.avecCueillir(c), v, "action", n))]);
        out.push([`${VUE[v]}_arroser`, v, STD, [0, 1].map((n) => frame(G.avecArroser(c), v, "action", n))]);
        out.push([`${VUE[v]}_becher`, v, STD, [0, 1].map((n) => frame(G.avecBecher(c), v, "action", n))]);
        out.push([`${VUE[v]}_semer`, v, STD, [0, 1].map((n) => frame(G.avecSemer(c), v, "action", n))]);
        out.push([`${VUE[v]}_recolter`, v, STD, [0, 1].map((n) => frame(G.avecRecolter(c), v, "action", n))]);
        out.push([`${VUE[v]}_scier`, v, STD, [0, 1].map((n) => frame(G.avecScier(c), v, "action", n))]);
        out.push([`${VUE[v]}_tailler`, v, STD, [0, 1].map((n) => frame(G.avecTailler(c), v, "action", n))]);
        out.push([`${VUE[v]}_porter`, v, STD, [0, 1].map((n) => frame(G.avecPorter(c), v, "action", n))]);
        out.push([`${VUE[v]}_reparer`, v, STD, [0, 1].map((n) => frame(G.avecReparer(c), v, "action", n))]);
        out.push([`${VUE[v]}_assis-reparer`, v, STD, [0, 1].map((n) => assis(c, v, n, null, G.reparer))]);
        out.push([`${VUE[v]}_repousser`, v, STD, [0, 1].map((n) => frame(G.avecRepousser(c), v, "action", n))]);
        out.push([`${VUE[v]}_ecrire`, v, STD, [0, 1].map((n) => frame(G.avecEcrire(c), v, "action", n))]);
        out.push([`${VUE[v]}_assis-ecrire`, v, STD, [0, 1].map((n) => assis(c, v, n, null, G.ecrire))]);
      }
      if (lanterne) {
        const l = G.avecLanterne(c), u = G.avecParapluie(c, parapluie);
        for (const v of ["se", "ne"]) {
          out.push([`${VUE[v]}_lanterne`, v, STD, [...Array(IMAGES.marche).keys()].map((n) => frame(l, v, "marche", n))]);
          out.push([`${VUE[v]}_parapluie`, v, G.CADRE_PARAPLUIE, [...Array(IMAGES.marche).keys()].map((n) => frame(u, v, "marche", n))]);
        }
      }
      if (couche) out.push(["couche", "front", G.CADRE_COUCHE, [0, 1].map((n) => R2 ? R2.couche(n, couverture) : G.couche(c, n, couverture))]);
      return out;
    }
    __name(poses2, "poses");
    var COUVERTURES = fondre({
      aster: { fond: "#2F5684", motif: "#F2C04B" },
      cannelle: { fond: "#B9503B", motif: "#F4EEDC" },
      rivet: { fond: "#7A4E2C", motif: "#C4A06A" },
      ondin: { fond: "#3E78C8", motif: "#EAF2FA" },
      sylve: { fond: "#4E7A36", motif: "#9DBE6A" },
      galet: { fond: "#6E7466", motif: "#B6B39E" },
      melisse: { fond: "#5A4A8A", motif: "#E3C27A" }
    });
    var VOILE = { fond: "#D9CFB8", motif: "#B3A588" };
    var MOODS = {
      Aster: ["content", "surpris", "triste"],
      // sûre d'elle, le large, et sa culpabilité
      Cannelle: ["rire", "triste", "fache"],
      // la bonne humeur, l'inquiétude pour Ondin, elle gronde
      Rivet: ["content", "surpris", "fache"],
      // absorbé, « Si ! Si ! », la pièce qui résiste
      Ondin: ["endormi", "surpris", "content"],
      // il dort debout, réveillé d'un coup, rêveur
      Sylve: ["fache", "gene", "content"],
      // sur ses gardes, farouche, un sourire rare
      Galet: ["fache", "triste", "content"],
      // « Hm. », la mémoire des Anciens, un sourire dans la barbe
      "Mélisse": ["content", "rire", "triste"]
      // tranquille, les lunes, le chagrin caché
    };
    var sansMain = /* @__PURE__ */ __name((o) => {
      const acc = { ...o.accessoires };
      delete acc.main;
      return { ...o, accessoires: acc };
    }, "sansMain");
    var VOYAGE = [
      { haut: "veste", bas: "pantalon", tete: "paille", dos: "sacDos" },
      { haut: "chemise", bas: "jupe", tete: "beret", dos: "besace" },
      { haut: "pull", bas: "pantalon", tete: "bonnet", dos: "sacDos" },
      { haut: "veste", bas: "robe", tete: "paille", dos: "besace" },
      { haut: "sweat", bas: "pantalon", tete: "casquette", dos: "sacDos" },
      { haut: "chemise", bas: "pantalon", tete: "beret", dos: "besace" },
      { haut: "veste", bas: "jupe", tete: "bonnet", dos: "sacDos" },
      { haut: "mariniere", bas: "pantalon", tete: "casquette", dos: "besace" }
    ];
    var VALISES = ["#9A5A34", "#3E5A8C", "#7A3A3A", "#5E7A4A"];
    var ARRIVANTS = VOYAGE.map((t, j) => {
      const i = j + 1, base = sansMain(A2.auHasard(5e3 + i * 11, { gratuit: false }));
      const choix = A2.verifier({ ...base, haut: t.haut, bas: t.bas, accessoires: { ...base.accessoires, tete: { id: t.tete }, dos: { id: t.dos } } });
      return { i, cle: `arrivant-${String(i).padStart(2, "0")}`, choix, uid: `e${i}`, opts: { couche: false, valise: VALISES[j % VALISES.length] } };
    });
    module.exports = { STD, VUE, slug, poses: poses2, COUVERTURES, VOILE, MOODS, ARRIVANTS };
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
    var MIROIR_KIT = /^(personnages\/maitres\/[a-z]+|personnages\/naufrages\/[a-z]+|personnages\/avatar\/avatar-\d+(?:-naufrage)?|personnages\/epilogue\/arrivant-\d+|vivants\/(anya|passeur))\/[a-z0-9-]+_avant_/;
    function miroir(svg) {
      const m = svg.match(/^(<svg[^>]*viewBox="([^"]+)"[^>]*>)([\s\S]*)(<\/svg>\s*)$/);
      if (!m) throw new Error("SVG inattendu pour le miroir");
      const [x, , w] = m[2].trim().split(/[\s,]+/).map(Number);
      return `${m[1]}<g transform="translate(${2 * x + w} 0) scale(-1 1)">${m[3]}</g>${m[4]}`;
    }
    __name(miroir, "miroir");
    var ANYA_MS = { eveil: [700, 900], repos: [1100, 900, 1100, 180], expr: [1100, 900, 1100, 180], marche: 130, benediction: 400, murmure: 420, apparaitre: 260, disparaitre: 260, foudre: [120, 500, 500] };
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

// atelier/generateur_personnages.mjs
var import_troupe = __toESM(require_troupe2(), 1);
var import_avatar = __toESM(require_avatar(), 1);
var import_tenues = __toESM(require_tenues(), 1);
var import_troupe_refonte = __toESM(require_troupe_refonte(), 1);
var import_troupe_liste = __toESM(require_troupe_liste(), 1);
var import_noms_personnages = __toESM(require_noms_personnages(), 1);
var r2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "r2");
var svgOf = /* @__PURE__ */ __name((vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(" ")}">${body}</svg>`, "svgOf");
var VUES = /* @__PURE__ */ new Set(["face", "avant", "dos", "profil"]);
var n2 = [0, 1];
var nR = [...Array(import_troupe.default.IMAGES.repos).keys()];
var nM = [...Array(import_troupe.default.IMAGES.marche).keys()];
function posesMaitre(base, c, naufrage2) {
  const R2 = c.refonte;
  const s = import_troupe_liste.default.slug(base.name);
  const avecLanterne = !naufrage2 || s === "aster" || s === "rivet";
  const don = !(naufrage2 && c.sansDon);
  const out = import_troupe_liste.default.poses(c, naufrage2 ? { travail: don, lanterne: avecLanterne, couverture: import_troupe_liste.default.VOILE, parapluie: "#8E8A80" } : { travail: true, lanterne: true, couverture: import_troupe_liste.default.COUVERTURES[s] }).map(([pose, , vb, images]) => [pose, vb, images]);
  if (don) out.push([base.action[0], import_troupe_liste.default.STD, R2.action()]);
  for (const x of import_troupe.default.EXPRS) out.push([`expr_${x}`, import_troupe_liste.default.STD, nR.map((n) => (0, import_troupe_refonte.image)(c, "front", "repos", n, x))]);
  out.push(["dort", import_troupe_liste.default.STD, n2.map((n) => R2.dort(n))]);
  for (const x of import_troupe_liste.default.MOODS[base.name]) out.push([`avant_marche_${x}`, import_troupe_liste.default.STD, nM.map((n) => (0, import_troupe_refonte.image)(c, "se", "marche", n, x))]);
  if (!naufrage2) {
    for (const [saison, h] of [["hiver", import_tenues.default.enHiver(base)], ["pluie", R2.pluie() || import_tenues.default.sousLaPluie(base)]]) {
      for (const v of ["front", "se", "ne"]) {
        out.push([`${import_troupe_liste.default.VUE[v]}_repos_${saison}`, import_troupe_liste.default.STD, nR.map((n) => (0, import_troupe_refonte.image)(c, v, "repos", n, void 0, h))]);
        out.push([`${import_troupe_liste.default.VUE[v]}_marche_${saison}`, import_troupe_liste.default.STD, nM.map((n) => (0, import_troupe_refonte.image)(c, v, "marche", n, void 0, h))]);
      }
    }
  }
  return out;
}
__name(posesMaitre, "posesMaitre");
var memo = /* @__PURE__ */ __name((f) => {
  let v;
  return () => v ??= f();
}, "memo");
var GROUPES = { maitre: {}, naufrage: {}, arrivant: {} };
for (const { base, nau } of import_troupe_refonte.CAST_REFONTE) {
  const s = import_troupe_liste.default.slug(base.name);
  GROUPES.maitre[s] = { dossier: `maitres/${s}`, prefixe: s, poses: memo(() => posesMaitre(base, base, false)) };
  GROUPES.naufrage[s] = { dossier: `naufrages/${s}`, prefixe: `${s}-naufrage`, poses: memo(() => posesMaitre(base, nau, true)) };
}
for (const [groupe, liste2, dossier] of [["arrivant", import_troupe_liste.default.ARRIVANTS, "epilogue"]]) {
  for (const p of liste2) GROUPES[groupe][p.i] = { dossier: `${dossier}/${p.cle}`, prefixe: p.cle, choix: p.choix, poses: memo(() => import_troupe_liste.default.poses(import_avatar.default.avatar(p.choix, { uid: p.uid }), p.opts).map(([pose, , vb, images]) => [pose, vb, images])) };
}
var PERSONNAGES = Object.fromEntries(Object.entries(GROUPES).map(([g, t]) => [g, Object.fromEntries(Object.entries(t).map(([k, p]) => [k, p.choix ? { choix: p.choix } : {}]))]));
var prendre = /* @__PURE__ */ __name((groupe, qui) => {
  const p = GROUPES[groupe][qui];
  if (!p) throw new Error(`${groupe} inconnu : ${qui} (${Object.keys(GROUPES[groupe]).join(", ")})`);
  return p;
}, "prendre");
function poses(groupe, qui) {
  return Object.fromEntries(prendre(groupe, qui).poses().map(([pose, , images]) => [pose, images.length]));
}
__name(poses, "poses");
function dessin(groupe, qui, pose, n) {
  const p = prendre(groupe, qui);
  const e = p.poses().find(([x]) => x === pose);
  if (!e) throw new Error(`pose inconnue : ${pose} (${p.poses().map(([x]) => x).join(", ")})`);
  const [, vb, images] = e;
  if (!(n >= 1 && n <= images.length)) throw new Error(`image ${n} : de 1 à ${images.length}`);
  const fichier = `personnages/${p.dossier}/${p.prefixe}_${pose}_${n}.svg`;
  let svg = svgOf(vb, images[n - 1]);
  if (import_noms_personnages.default.MIROIR_KIT.test(fichier)) svg = import_noms_personnages.default.miroir(svg);
  const mots = pose.split("_"), laPose = VUES.has(mots[0]) ? mots[1] : mots[0];
  const id = fichier.replace(/_\d+\.svg$/, "");
  return { fichier, svg, cadre: vb, ms_par_image: images.length > 1 ? import_noms_personnages.default.vitessePersonnage(id, laPose) ?? null : null };
}
__name(dessin, "dessin");
var sans = /* @__PURE__ */ __name(({ fichier, ...r }) => r, "sans");
var maitre = /* @__PURE__ */ __name((nom, pose, n = 1) => sans(dessin("maitre", nom, pose, n)), "maitre");
var naufrage = /* @__PURE__ */ __name((nom, pose, n = 1) => sans(dessin("naufrage", nom, pose, n)), "naufrage");
var arrivant = /* @__PURE__ */ __name((numero, pose, n = 1) => sans(dessin("arrivant", numero, pose, n)), "arrivant");
function liste() {
  const out = [];
  for (const [g, t] of Object.entries(GROUPES)) for (const [k, p] of Object.entries(t)) {
    const qui = g === "arrivant" ? +k : k;
    for (const [pose, , images] of p.poses()) for (let n = 1; n <= images.length; n++) out.push({ fichier: `personnages/${p.dossier}/${p.prefixe}_${pose}_${n}.svg`, fonction: g, args: [qui, pose, n] });
  }
  return out;
}
__name(liste, "liste");
export {
  PERSONNAGES,
  arrivant,
  liste,
  maitre,
  naufrage,
  poses
};
