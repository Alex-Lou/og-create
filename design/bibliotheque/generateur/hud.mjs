// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_hud.mjs : ne pas modifier à la main.
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
    var fondu = memo((c) => {
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
    module.exports = { ENCRE, ENCRE_KIT, NUIT, PASTEL, memo, hsl, hex, mix, ton, delave, clarte, enPersonnage, fondu, fondre, GARDER };
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
      const g = poserBras(c, a, b, elbow, main), T = require_troupe();
      const ligne = ligneBras(a, g.elbow, g.b);
      let milieu = ligne.slice(1, -1);
      if (c.sleeves || c.bandage) milieu = milieu.filter((q) => dist(q, g.b) > 6.5);
      const coude = milieu.length ? milieu : void 0;
      if (!c.cuff || c.sleeves || c.bandage) return T.arm({ ...c, bras: null }, a, g.b, coude, g.main, partie);
      let s = "";
      if (partie !== "devant") {
        const r = anneau(ligne, 2.5, 0.9, c.armW / 2 + 0.1);
        s += T.arm({ ...c, bras: null, cuff: null }, a, g.b, coude, g.main, "derriere") + `<path d="${r.d}" fill="${OUT}" stroke="${OUT}" stroke-width="${r2(W * 2)}" stroke-linejoin="round"/><path d="${r.d}" fill="${c.cuff}"/>`;
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
      const [bi, bo, a0] = ctx.brow || BROW[expr], arch = a0 + (g.browArch || 0);
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

// atelier/hud.js
var require_hud = __commonJS({
  "atelier/hud.js"(exports, module) {
    var { OUT, P, E, clip, r2 } = require_troupe2();
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
    function railOnglets() {
      const w = 88, h = 160, o = rr(-12, 0.7, w + 11.3, h - 1.4, 16);
      return P(o, BOIS.corps, 0) + clip("hra", o, trait(`M${w - 2.4},16 L${w - 2.4},${h - 16}`, BOIS.clair, 1.2) + trait(`M${w - 9},10 L${w - 9},${h - 10}`, BOIS.ombre, 0.8) + trait(`M${w - 10},10 L${w - 10},${h - 10}`, BOIS.clair, 0.6) + trait(`M56,24 L56,${h - 24} M36,18 L36,${h - 18} M16,26 L16,${h - 26}`, BOIS.veine, 0.5)) + P(o, "none", W) + clou(w - 5.6, 9) + clou(w - 5.6, h - 9);
    }
    __name(railOnglets, "railOnglets");
    var bandeau = /* @__PURE__ */ __name(() => plaque("hbd", 72, 40, { r: 14, rebord: 4.4, face: SOMBRE }), "bandeau");
    var panneau = /* @__PURE__ */ __name(() => plaque("hpa", 72, 48, { r: 14, rebord: 4.6, levre: 3.4 }), "panneau");
    var boutonPapier = /* @__PURE__ */ __name((etat) => () => plaque(`hpp${etat[0]}`, 64, 36, { r: 12, rebord: 3.2, levre: 3, clous: false, enfonce: etat === "appuye" ? 2 : 0 }), "boutonPapier");
    function feuille() {
      const w = 120, h = 64, r = 18, reb = 5.2, o = rr(0.7, 0.7, w - 1.4, h + 20, r);
      const f = rr(reb, reb + 0.4, w - 2 * reb, h + 20, r - reb * 0.8);
      return P(o, BOIS.corps, 0) + clip("hfeo", o, trait(`M${r},2.4 L${w - r},2.4`, BOIS.clair, 1.1) + trait(`M${r + 4},${r2(reb * 0.55 + 1.2)} L${w - r - 8},${r2(reb * 0.55 + 1.2)}`, BOIS.veine, 0.5) + trait(`M2.6,${r} L2.6,${h}`, BOIS.veine, 0.5) + trait(`M${w - 2.6},${r} L${w - 2.6},${h}`, BOIS.ombre, 0.6)) + P(o, "none", W) + P(f, PAPIER.corps, 0) + clip("hfef", f, `<rect x="0" y="${r2(reb - 0.6)}" width="${w}" height="3" fill="${PAPIER.ombre}"/>`) + P(f, "none", 1) + clou(r * 0.62, reb * 0.55 + 0.6) + clou(w - r * 0.62, reb * 0.55 + 0.6);
    }
    __name(feuille, "feuille");
    function sceauQuete(pret) {
      const c = 22;
      let s = rond(c, c + 0.8, 20.6, BOIS.ombre, W) + rond(c, c, 20, BOIS.corps, 0) + trait(`M${c - 13},${c - 14} Q${c},${c - 21} ${c + 13},${c - 14}`, BOIS.clair, 1.1) + rond(c, c, 20, "none", W) + rond(c, c + 0.6, 14.4, OR.ombre, 1) + clip(
        pret ? "hsqp" : "hsqr",
        `M${c - 14.4},${c} A14.4,14.4 0 1 1 ${c + 14.4},${c} A14.4,14.4 0 1 1 ${c - 14.4},${c} Z`,
        rond(c, c - 1, 13.6, pret ? OR.clair : OR.corps, 0) + E(c - 4.6, c - 7.4, 6.4, 3.2, "rgba(255,255,255,.55)", 0)
      ) + rond(c, c + 0.6, 14.4, "none", 1);
      if (pret) s += `<path d="M${c - 2.2},${c - 9} L${c + 2.2},${c - 9} L${c + 1.2},${c + 3} L${c - 1.2},${c + 3} Z" fill="${SOMBRE.corps}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + rond(c, c + 6.6, 1.9, SOMBRE.corps, 0.6) + etincelle(36.6, 7.4, 1.5);
      else s += `<path d="M${c},${c - 9} Q${c + 1.4},${c - 1.4} ${c + 8},${c} Q${c + 1.4},${c + 1.4} ${c},${c + 9} Q${c - 1.4},${c + 1.4} ${c - 8},${c} Q${c - 1.4},${c - 1.4} ${c},${c - 9} Z" fill="${OR.fonce}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/><path d="M${c},${c - 6} Q${c + 0.6},${c - 0.6} ${c + 5},${c}" fill="none" stroke="${OR.clair}" stroke-width="0.8" stroke-linecap="round"/>`;
      return s;
    }
    __name(sceauQuete, "sceauQuete");
    var rr4 = /* @__PURE__ */ __name((x, y, w, h, [a, b, c, d]) => `M${r2(x + a)},${r2(y)} L${r2(x + w - b)},${r2(y)} Q${r2(x + w)},${r2(y)} ${r2(x + w)},${r2(y + b)} L${r2(x + w)},${r2(y + h - c)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - c)},${r2(y + h)} L${r2(x + d)},${r2(y + h)} Q${r2(x)},${r2(y + h)} ${r2(x)},${r2(y + h - d)} L${r2(x)},${r2(y + a)} Q${r2(x)},${r2(y)} ${r2(x + a)},${r2(y)} Z`, "rr4");
    var PAPIERS = {
      parchemin: { face: PAPIER.corps, levre: "#E2CDA2", reflet: PAPIER.clair, trait: OUT, filet: OR.ombre, filetA: 0.5, rayons: [16, 16, 16, 16] },
      sombre: { face: "#3A2E47", levre: "#22192C", reflet: "#4B3D5C", trait: "#140C1C", filet: "#B07CD8", filetA: 0.55, rayons: [22, 6, 20, 10] },
      nuit: { face: "#1C2A40", levre: "#101A2A", reflet: "#26364F", trait: "#0A1220", filet: "#C8DCF0", filetA: 0.3, rayons: [22, 22, 22, 22] }
    };
    function bulle(sorte) {
      const p = PAPIERS[sorte], w = 72, h = 60, l = 2.4, k = p.rayons;
      const o = rr4(0.7, 0.7, w - 1.4, h - 1.4, k);
      const f = rr4(0.7, 0.7, w - 1.4, h - 1.4 - l, k);
      return P(o, p.levre, 0) + clip(`hbu${sorte[0]}`, o, `<path d="${f}" fill="${p.face}"/><rect x="0" y="1.4" width="${w}" height="3.2" fill="${p.reflet}" opacity=".85"/>`) + P(o, "none", W).replace(`stroke="${OUT}"`, `stroke="${p.trait}"`) + `<path d="${rr4(4.4, 4.4, w - 8.8, h - 8.8 - l, k.map((r) => Math.max(r - 3.4, 2)))}" fill="none" stroke="${p.filet}" stroke-width=".6" opacity="${p.filetA}"/>`;
    }
    __name(bulle, "bulle");
    function queue(sorte, droite) {
      const p = PAPIERS[sorte];
      const g = /* @__PURE__ */ __name((s) => droite ? `<g transform="translate(16,0) scale(-1,1)">${s}</g>` : s, "g");
      return g(`<path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4 Z" fill="${p.face}"/><path d="M16,10.6 Q9.6,11.2 4.6,13.6 Q9.4,12.4 16,13.4 Z" fill="${p.levre}"/><path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4" fill="none" stroke="${p.trait}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    __name(queue, "queue");
    var FENTE = [[50, 2], [45, 17], [53, 30], [46, 43], [54, 55], [47, 68], [52, 82], [48, 95]];
    var feston = /* @__PURE__ */ __name((cx, cy, r, n, a = 0.06) => {
      let d = "";
      for (let i = 0; i <= n * 2; i++) {
        const t = i / (n * 2) * Math.PI * 2 - Math.PI / 2, rr0 = r * (i % 2 ? 1 + a : 1 - a * 0.4);
        const x = cx + Math.cos(t) * rr0, y = cy + Math.sin(t) * rr0;
        d += i ? i % 2 ? ` Q${r2(x)},${r2(y)}` : ` ${r2(x)},${r2(y)}` : `M${r2(x)},${r2(y)}`;
      }
      return d + " Z";
    }, "feston");
    function sceauCire() {
      const cx = 48, cy = 42, R = 34;
      const defs = `<defs><radialGradient id="hsc-cire" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#EC7A62"/><stop offset=".55" stop-color="#C9483A"/><stop offset="1" stop-color="#8A2C22"/></radialGradient><radialGradient id="hsc-creux" cx=".5" cy=".62" r=".62"><stop offset="0" stop-color="#C9483A"/><stop offset=".8" stop-color="#A9382C"/><stop offset="1" stop-color="#7E261E"/></radialGradient><linearGradient id="hsc-ruban" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A94DC"/><stop offset="1" stop-color="#2E5EA8"/></linearGradient></defs>`;
      let s = defs + E(cx + 3, 90, 30, 4.4, "rgba(60,40,25,.2)", 0);
      for (const m of [-1, 1]) {
        const x0 = cx + m * 6, x1 = cx + m * 22;
        s += P(`M${r2(x0 - 7)},58 L${r2(x1 - 7)},91 L${r2(x1)},86 L${r2(x1 + 7)},92 L${r2(x0 + 7)},60 Z`, "url(#hsc-ruban)", W) + trait(`M${r2(x0 - 2)},62 L${r2(x1 - 2)},86`, "#8FBAEE", 0.9) + trait(`M${r2(x0 + 3)},62 L${r2(x1 + 3.4)},86`, "#244C8C", 0.7);
      }
      const cire = feston(cx, cy, R, 13);
      s += P(`M${cx - 22},${cy + 26} Q${cx - 24},${cy + 36} ${cx - 19},${cy + 37} Q${cx - 15},${cy + 36} ${cx - 16},${cy + 28} Z`, "#B23E31", W) + P(`M${cx + 15},${cy + 29} Q${cx + 15},${cy + 39} ${cx + 19.4},${cy + 39} Q${cx + 23},${cy + 37} ${cx + 21},${cy + 26} Z`, "#B23E31", W);
      s += P(cire, "url(#hsc-cire)", 0) + clip("hscc", cire, E(cx + 10, cy + 12, R * 0.95, R * 0.85, "rgba(110,30,20,.28)", 0)) + P(cire, "none", W);
      s += `<circle cx="${cx}" cy="${cy}" r="${r2(R * 0.74)}" fill="none" stroke="#E87A66" stroke-width="3.4"/>` + trait(`M${cx - 18},${cy + 18} A${R * 0.74},${R * 0.74} 0 0 0 ${cx + 22},${cy + 12}`, "#8E2C22", 3);
      s += E(cx, cy, R * 0.62, R * 0.62, "url(#hsc-creux)", 1) + trait(`M${cx - 16},${cy - 9} A${R * 0.6},${R * 0.6} 0 0 1 ${cx + 16},${cy - 9}`, "#7A241C", 1.6) + trait(`M${cx - 14},${cy + 13} A${R * 0.6},${R * 0.6} 0 0 0 ${cx + 14},${cy + 13}`, "#E8826C", 1.2);
      const etoile = Array.from({ length: 10 }, (_, i) => {
        const a = i * Math.PI / 5 - Math.PI / 2, rr0 = i % 2 ? 6.4 : 14.4;
        return `${r2(cx + Math.cos(a) * rr0)},${r2(cy + 1 + Math.sin(a) * rr0)}`;
      });
      s += `<polygon points="${etoile.join(" ")}" fill="#7E261E" transform="translate(0.8 1.2)"/><polygon points="${etoile.join(" ")}" fill="#E06A56" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>` + trait(`M${cx},${cy - 12.6} L${cx - 3.4},${cy - 4}`, "#FFB8A6", 1.1) + trait(`M${cx - 12.6},${cy - 3.4} L${cx - 5},${cy - 2.6}`, "#FFB8A6", 0.9);
      s += E(cx - 18, cy - 20, 6, 2.6, "rgba(255,220,205,.7)", 0).replace("/>", ` transform="rotate(-35 ${cx - 18} ${cy - 20})"/>`) + rond(cx - 25, cy - 9, 1.4, "rgba(255,230,215,.8)", 0);
      return s;
    }
    __name(sceauCire, "sceauCire");
    function sceauFente() {
      const coupe = /* @__PURE__ */ __name((a, b, y) => [r2(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])), y], "coupe");
      const pts = [coupe(FENTE[0], FENTE[1], 9), ...FENTE.slice(1, -2), coupe(FENTE[5], FENTE[6], 80)];
      const d = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
      return `<defs><linearGradient id="hsf-or" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C0"/><stop offset="1" stop-color="#F2C04B"/></linearGradient></defs>` + trait(d, "rgba(255,214,100,.35)", 7) + trait(d, OUT, 3.2) + trait(d, "url(#hsf-or)", 1.8) + trait(d, "#FFFFFF", 0.6);
    }
    __name(sceauFente, "sceauFente");
    function billet() {
      const w = 96, h = 56, BRUN = "#7A5636";
      const haut = 7, bas = h - 7;
      const bord = /* @__PURE__ */ __name((x, sens) => {
        const pts = [];
        for (let i = 0; i <= 12; i++) {
          const y = haut + (bas - haut) * i / 12;
          pts.push([x + sens * (0.45 * Math.sin(i * 2.3) + 0.3 * Math.sin(i * 5.1 + 1)), y]);
        }
        return pts;
      }, "bord");
      const doux = /* @__PURE__ */ __name((pts) => pts.slice(1, -1).map((p, i) => {
        const q = pts[i + 2];
        return `Q${r2(p[0])},${r2(p[1])} ${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`;
      }).join(" ") + ` L${r2(pts[pts.length - 1][0])},${r2(pts[pts.length - 1][1])}`, "doux");
      const g = bord(3.2, 1), d = bord(w - 3.2, -1).reverse();
      const feuille2 = `M${r2(g[0][0])},${r2(g[0][1])} ${doux(g)} L${r2(d[0][0])},${r2(d[0][1])} ${doux(d)} Z`;
      const defs = '<linearGradient id="hbiV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBD7AE"/><stop offset=".2" stop-color="#FFF7E4"/><stop offset=".55" stop-color="#FBEFD3"/><stop offset=".82" stop-color="#F1DDB3"/><stop offset="1" stop-color="#DCC08E"/></linearGradient><linearGradient id="hbiH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9A46A" stop-opacity=".55"/><stop offset=".1" stop-color="#C9A46A" stop-opacity="0"/><stop offset=".9" stop-color="#C9A46A" stop-opacity="0"/><stop offset="1" stop-color="#B8925A" stop-opacity=".6"/></linearGradient><linearGradient id="hbiR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6DE"/><stop offset=".3" stop-color="#F3E2BC"/><stop offset=".72" stop-color="#D8BC8A"/><stop offset="1" stop-color="#B2905C"/></linearGradient><radialGradient id="hbiT"><stop offset="0" stop-color="#B8894A" stop-opacity=".32"/><stop offset="1" stop-color="#B8894A" stop-opacity="0"/></radialGradient><radialGradient id="hbiS" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF4D8"/><stop offset=".6" stop-color="#E4C995"/><stop offset="1" stop-color="#B8955E"/></radialGradient>';
      const coin = /* @__PURE__ */ __name((cx, cy, sx, sy, k) => [[3.4 + k, 3, 3.2], [9 - k, 5.4 + k, 1.6], [5.6, 9.6 - k, 1.2]].map(([a, b, r]) => `<ellipse cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" rx="${r2(r)}" ry="${r2(r * 0.8)}" fill="url(#hbiT)"/>`).join("") + [[6.4, 2.2, 0.32], [11.5, 7.6, 0.26], [2.6, 11, 0.3], [13.4 - k, 3.4 + k, 0.22]].map(([a, b, r]) => `<circle cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" r="${r}" fill="#B08A55" opacity=".45"/>`).join(""), "coin");
      const rouleau = /* @__PURE__ */ __name((y, dessous) => {
        const cyl = rr(1, y, w - 2, 10, 5);
        const bout = /* @__PURE__ */ __name((x) => E(x, y + 5, 2.6, 4.7, "url(#hbiS)", 0.8).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`) + E(x + 0.2, y + 5, 1.6, 3, "none", 0.45).replace(`stroke="${OUT}"`, 'stroke="#9C784A"') + E(x + 0.35, y + 5.1, 0.7, 1.4, "#C9A874", 0.4).replace(`stroke="${OUT}"`, 'stroke="#9C784A"'), "bout");
        return P(cyl, "url(#hbiR)", 0.9).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`) + `<path d="M6,${r2(y + 2.3)} L${w - 6},${r2(y + 2.3)}" stroke="#FFFDF4" stroke-width=".9" stroke-linecap="round" opacity=".8"/><path d="M5,${r2(dessous ? y + 1.2 : y + 8.9)} L${w - 5},${r2(dessous ? y + 1.2 : y + 8.9)}" stroke="#A8845A" stroke-width=".5" opacity=".7"/>` + bout(3.4) + bout(w - 3.4);
      }, "rouleau");
      return `<defs>${defs}</defs><path d="${feuille2}" fill="url(#hbiV)"/>` + clip("hbiF", feuille2, `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#hbiH)"/><rect x="0" y="${haut}" width="${w}" height="5" fill="#9C7646" opacity=".18"/><rect x="0" y="${haut}" width="${w}" height="2.4" fill="#9C7646" opacity=".16"/><rect x="0" y="${bas - 5}" width="${w}" height="5" fill="#9C7646" opacity=".1"/>` + coin(3, haut + 1, 1, 1, 0) + coin(w - 3, haut + 1, -1, 1, 1) + coin(3, bas - 1, 1, -1, 2) + coin(w - 3, bas - 1, -1, -1, 1)) + `<path d="${feuille2}" fill="none" stroke="${BRUN}" stroke-width=".8" stroke-linejoin="round"/>` + rouleau(1.2, false) + rouleau(h - 11.2, true);
    }
    __name(billet, "billet");
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
      ["point_nouveau", "Point « nouveau »", [14, 14], null, pointNouveau, "une chose à faire sur un onglet (tabbar__dot)"],
      ["rail_onglets", "Rail d'onglets", [88, 160], [22, 22, 22, 0], railOnglets, "la barre des onglets debout à gauche, sur grand écran (tabbar)"],
      ["bandeau", "Bandeau", [72, 40], [14, 18, 17, 18], bandeau, "ce que fait le doigt dans un mode de l'île (world__banner), la bulle d'un appui long (world__tip)"],
      ["panneau", "Panneau", [72, 48], [15, 18, 18, 18], panneau, "le menu d'une pose sur l'île (world__menu)"],
      ...["repos", "appuye"].map((e) => [`bouton_papier_${e}`, `Petit bouton de papier (${e === "repos" ? "au repos" : "appuyé"})`, [64, 36], [12, 14, 14, 14], boutonPapier(e), "le geste secondaire d'un bandeau, d'un menu ou d'une feuille (world__link, world__menu-btn--quiet)"]),
      ["feuille", "Haut d'une feuille", [120, 64], [26, 24, 0, 24], feuille, "la feuille qui monte du bas de l'écran (world__sheet)"],
      ...["repos", "pret"].map((e) => [`sceau_quete_${e}`, `Sceau des quêtes (${e === "repos" ? "au repos" : "quête à prendre"})`, [44, 44], null, () => sceauQuete(e === "pret"), "le médaillon du suivi des quêtes (tracker__seal), l'anneau de progression par-dessus"]),
      ["bulle", "Bulle de dialogue", [72, 60], [20, 20, 22, 20], () => bulle("parchemin"), "les répliques : Brume et les siens sur l'île (guide__bubble), le coach du tutoriel (coach__say), les scènes (ps__bubble)"],
      ["bulle_queue", "Queue d'une bulle", [16, 20], null, () => queue("parchemin", false), "la queue de la bulle, vers celui qui parle (à gauche)"],
      ["bulle_sombre", "Bulle d'un hostile", [72, 60], [24, 22, 24, 22], () => bulle("sombre"), "un hostile parle : bulle sombre, coins irréguliers"],
      ["bulle_sombre_queue", "Queue d'une bulle d'hostile", [16, 20], null, () => queue("sombre", true), "la queue vers l'hostile, à droite (il fait face au joueur)"],
      ["bulle_pensee", "Bulle d'une pensée", [72, 60], [24, 24, 24, 24], () => bulle("nuit"), "une pensée, dans les scènes (ps__bubble.is-thought)"],
      ["billet", "Billet des notifications", [96, 56], [14, 16, 14, 16], billet, "une notification (toast) : un gain, une réussite, une erreur ; son ruban (à la couleur du ton) et son sceau de cire en CSS"],
      ["sceau_cire", "Sceau de cire (Sceau rompu)", [96, 96], null, sceauCire, "le sceau qui tombe, frappe et se fend en deux à l'annonce d'un succès (seal__wax) ; ses deux moitiés : le même dessin découpé le long de la fente (zones : fente)", { fente: FENTE }],
      ["sceau_fente", "Fente du sceau", [96, 96], null, sceauFente, "le trait d'or de la fente, posé sur le sceau juste avant qu'il se coupe (seal__crack)", { fente: FENTE }]
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

// atelier/generateur_hud.mjs
var import_hud = __toESM(require_hud(), 1);
var PIECES = Object.fromEntries(import_hud.default.PIECES.map(([id, nom, taille, tranche, , sert]) => [id, { nom, sert, taille, tranche }]));
var HD = import_hud.default.HD;
function piece(id, hd = import_hud.default.HD) {
  const p = import_hud.default.PIECES.find((x) => x[0] === id);
  if (!p) throw new Error(`pièce inconnue : ${id} (${Object.keys(PIECES).join(", ")})`);
  const [w, h] = p[2], cadre = [0, 0, w, h];
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w * hd}" height="${h * hd}" viewBox="${cadre.join(" ")}">${p[4]()}</svg>`, cadre, ms_par_image: null };
}
__name(piece, "piece");
function liste() {
  return import_hud.default.PIECES.map(([id]) => ({ fichier: `hud/${id}.svg`, fonction: "piece", args: [id] }));
}
__name(liste, "liste");
export {
  HD,
  PIECES,
  liste,
  piece
};
