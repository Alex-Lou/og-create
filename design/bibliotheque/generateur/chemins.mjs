// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_chemins.mjs : ne pas modifier à la main.
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

// atelier/chemins.js
var require_chemins = __commonJS({
  "atelier/chemins.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var rnd = /* @__PURE__ */ __name((s) => {
      let x = s;
      return () => (x = x * 16807 % 2147483647) / 2147483647;
    }, "rnd");
    var CX = 32;
    var CY = 16;
    var LOSANGE = "M32,0 L64,16 L32,32 L0,16 Z";
    var SENS = { ne: [48, 8], se: [48, 24], so: [16, 24], no: [16, 8] };
    var BITS = ["ne", "se", "so", "no"];
    var sensDe = /* @__PURE__ */ __name((m) => BITS.filter((_, i) => m & 1 << i), "sensDe");
    function bras(k) {
      const [x, y] = SENS[k], dx = x - CX, dy = y - CY, L = Math.hypot(dx, dy);
      return { k, L: L + 2, u: [dx / L, dy / L], n: [-dy / L, dx / L] };
    }
    __name(bras, "bras");
    var pt = /* @__PURE__ */ __name((b, t, o) => [CX + b.u[0] * b.L * t + b.n[0] * o, CY + b.u[1] * b.L * t + b.n[1] * o], "pt");
    function bande(m, w) {
      const ss = sensDe(m), place = `M${f(CX - w * 1.3)},${CY} a${f(w * 1.3)},${f(w * 0.72)} 0 1 0 ${f(w * 2.6)},0 a${f(w * 1.3)},${f(w * 0.72)} 0 1 0 ${f(-w * 2.6)},0 Z`;
      if (!ss.length) return `M${f(CX - w * 1.7)},${CY} a${f(w * 1.7)},${f(w * 0.9)} 0 1 0 ${f(w * 3.4)},0 a${f(w * 1.7)},${f(w * 0.9)} 0 1 0 ${f(-w * 3.4)},0 Z`;
      return ss.map((k) => {
        const b = bras(k), [a1, a2] = [pt(b, 0, w), pt(b, 1, w)], [b1, b2] = [pt(b, 0, -w), pt(b, 1, -w)];
        return `M${f(a1[0])},${f(a1[1])} L${f(a2[0])},${f(a2[1])} L${f(b2[0])},${f(b2[1])} L${f(b1[0])},${f(b1[1])} Z`;
      }).join(" ") + " " + place;
    }
    __name(bande, "bande");
    function bords(m, w, pas, g) {
      const ss = sensDe(m), out = [];
      const dedans = /* @__PURE__ */ __name((x, y, sauf) => ss.some((k) => {
        if (k === sauf) return false;
        const b = bras(k), dx = x - CX, dy = y - CY, le = (dx * b.u[0] + dy * b.u[1]) / b.L, pe = dx * b.n[0] + dy * b.n[1];
        return le > -0.05 && le < 1.05 && Math.abs(pe) < w * 0.95;
      }) || ((x - CX) / (1.3 * w)) ** 2 + ((y - CY) / (0.72 * w)) ** 2 < 0.9, "dedans");
      for (const k of ss) {
        const b = bras(k);
        for (let t = 0.42; t < 1.02; t += pas) for (const c of [-1, 1]) {
          const [x, y] = pt(b, t + (g() - 0.5) * 0.04, c * w);
          if (!dedans(x, y, k)) out.push([x, y, c]);
        }
      }
      const ang = { ne: -0.46, se: 0.46, so: Math.PI - 0.46, no: -Math.PI + 0.46 };
      const n = ss.length ? 14 : 12, rx = (ss.length ? 1.3 : 1.7) * w, ry = (ss.length ? 0.72 : 0.9) * w;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI + (i + 0.5) * 2 * Math.PI / n;
        if (ss.some((k) => Math.abs(Math.atan2(Math.sin(a - ang[k]), Math.cos(a - ang[k]))) < 0.62)) continue;
        out.push([CX + Math.cos(a) * rx, CY + Math.sin(a) * ry, 0]);
      }
      return out;
    }
    __name(bords, "bords");
    function herbe(id, seed = 3) {
      const g = rnd(seed * 13 + 5);
      let b = "";
      for (let i = 0; i < 10; i++) {
        const x = 8 + g() * 48, y = 6 + g() * 20;
        b += `<path d="M${f(x)},${f(y)} l-0.6,-2 M${f(x + 1)},${f(y)} l0.4,-2.4" stroke="#5A9A40" stroke-width="0.6" stroke-linecap="round"/>`;
      }
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC868"/><stop offset="1" stop-color="#6EAE50"/></linearGradient><clipPath id="${id}c"><path d="${LOSANGE}"/></clipPath></defs><path d="${LOSANGE}" fill="url(#${id})"/><g clip-path="url(#${id}c)">${b}</g>`;
    }
    __name(herbe, "herbe");
    var caillou = /* @__PURE__ */ __name((x, y, r, c = "#A8A298") => E(x, y, r, r * 0.62, c, 0.45) + E(x - r * 0.3, y - r * 0.22, r * 0.34, r * 0.2, "#E8E4DC"), "caillou");
    var touffe = /* @__PURE__ */ __name((x, y, s = 1) => `<path d="M${f(x - 1.4 * s)},${f(y)} q0.4,-2.2 -0.4,-3.4 M${f(x)},${f(y)} q0.2,-2.8 0.6,-3.8 M${f(x + 1.4 * s)},${f(y)} q-0.2,-2 0.8,-3" fill="none" stroke="#4E8A36" stroke-width="0.8" stroke-linecap="round"/>`, "touffe");
    var fleur = /* @__PURE__ */ __name((x, y, c) => [0, 1, 2, 3, 4].map((i) => {
      const a = i * 1.257;
      return E(x + Math.cos(a) * 0.8, y + Math.sin(a) * 0.5, 0.6, 0.45, c);
    }).join("") + E(x, y, 0.4, 0.3, "#E2A030"), "fleur");
    function chemin2(m, id, v = 0) {
      const g = rnd(m * 7 + 11 + v * 101), ss = sensDe(m);
      let s = herbe(id + "h", m + 1 + v * 17);
      s += `<g clip-path="url(#${id}hc)">`;
      s += `<path d="${bande(m, 6.4)}" fill="#5A9A40" opacity=".5"/><path d="${bande(m, 5.4)}" fill="#BE9868"/><path d="${bande(m, 4.4)}" fill="#D2B080"/>`;
      for (const k of ss) {
        const b = bras(k);
        for (const o of [-2, 2]) {
          const [a, c] = [pt(b, 0.28, o), pt(b, 1, o)];
          s += `<path d="M${f(a[0])},${f(a[1])} L${f(c[0])},${f(c[1])}" stroke="#AE8858" stroke-width="0.9" stroke-linecap="round" opacity=".7"/>`;
        }
      }
      for (let i = 0; i < 7; i++) {
        const k = ss.length ? ss[i % ss.length] : null;
        const [x, y] = k ? pt(bras(k), 0.15 + g() * 0.8, (g() - 0.5) * 6) : [CX + (g() - 0.5) * 8, CY + (g() - 0.5) * 3];
        s += E(x, y, 0.5 + g() * 0.4, 0.3 + g() * 0.2, "#A8865A");
      }
      const bd = bords(m, 5.4, 0.15, g);
      bd.forEach(([x, y], i) => {
        s += caillou(x, y, 0.9 + g() * 0.5, g() < 0.25 ? "#B8B0A0" : "#A8A298");
        if (g() < 0.22) s += touffe(x + (g() - 0.5) * 2, y - 0.5, 0.8);
      });
      const cols = v ? ["#F7A6C0", "#FFF4F0"] : ["#F2C04B", "#FFF4F0"];
      for (let i = 0; i < 2; i++) {
        const p = bd[Math.floor(g() * bd.length)];
        if (p) s += fleur(p[0] + (g() - 0.5) * 3, p[1] - 1.4, cols[i]);
      }
      return s + `</g>`;
    }
    __name(chemin2, "chemin");
    function pave(m, id) {
      const g = rnd(m * 13 + 3), ss = sensDe(m);
      let s = herbe(id + "h", m + 41);
      s += `<g clip-path="url(#${id}hc)"><path d="${bande(m, 6.4)}" fill="#5A9A40" opacity=".5"/><path d="${bande(m, 5.6)}" fill="#8A847A"/>`;
      const pav = /* @__PURE__ */ __name((x, y, r, c) => E(x, y, r, r * 0.6, c, 0.4) + E(x - r * 0.25, y - r * 0.2, r * 0.45, r * 0.22, "#E2DED6").replace("/>", ' opacity=".6"/>'), "pav");
      const tons = ["#C8C2B6", "#BDB7AC", "#D2CCC0", "#B4AEA2"];
      for (const [dx, dy] of [[0, 0], [-3, -1.2], [3, -1.2], [-3, 1.2], [3, 1.2], [-6, 0], [6, 0]]) s += pav(CX + dx, CY + dy, 1.7, tons[Math.floor(g() * 4)]);
      for (const k of ss) {
        const b = bras(k);
        let r = 0;
        for (let t = 0.32; t < 1.02; t += 0.12, r++) for (const o of r % 2 ? [-2.4, 1.2] : [-1.2, 2.4]) {
          const [x, y] = pt(b, t, o);
          s += pav(x, y, 1.6, tons[Math.floor(g() * 4)]);
        }
      }
      bords(m, 5.6, 0.14, g).forEach(([x, y]) => {
        s += caillou(x, y, 1.3, "#9A948A");
      });
      return s + `</g>`;
    }
    __name(pave, "pave");
    function creuse(etape, m, id) {
      const g = rnd(m * 5 + etape * 31 + 7), ss = sensDe(m);
      let s = herbe(id + "h", m + 9);
      if (etape === 0) {
        const bouts = ss.length ? ss.map((k) => pt(bras(k), 0.9, 0)) : [[CX - 7, CY], [CX + 7, CY], [CX, CY - 4], [CX, CY + 4]];
        s += bouts.map(([x, y]) => `<path d="M${f(CX)},${f(CY)} L${f(x)},${f(y)}" stroke="#F4EEDC" stroke-width="0.6" stroke-dasharray="1.6 1"/>`).join("");
        s += [[CX, CY], ...bouts].map(([x, y]) => `<path d="M${f(x)},${f(y + 0.6)} L${f(x)},${f(y - 4.4)}" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x)},${f(y + 0.6)} L${f(x)},${f(y - 4.4)}" stroke="#C8925A" stroke-width="0.7" stroke-linecap="round"/>` + E(x, y - 4.8, 0.85, 0.55, "#E8504A", 0.5)).join("");
        return s;
      }
      s += `<g clip-path="url(#${id}hc)">`;
      if (etape === 1) {
        s += `<path d="${bande(m, 5.4)}" fill="#B4D88A"/>`;
        for (let i = 0; i < 10; i++) {
          const k = ss.length ? ss[i % ss.length] : null;
          const [x, y] = k ? pt(bras(k), 0.1 + g() * 0.85, (g() - 0.5) * 7) : [CX + (g() - 0.5) * 9, CY + (g() - 0.5) * 4];
          s += `<path d="M${f(x)},${f(y)} l0.3,-0.9" stroke="#6EAE50" stroke-width="0.6" stroke-linecap="round"/>`;
        }
        bords(m, 6.6, 0.3, g).slice(0, 4).forEach(([x, y]) => {
          s += P(`M${f(x - 1.8)},${f(y)} Q${f(x)},${f(y - 2)} ${f(x + 1.8)},${f(y)} Z`, "#7EC25A", 0.5);
        });
      }
      if (etape === 2) {
        s += `<path d="${bande(m, 5.4)}" fill="#B4D88A"/>`;
        for (let i = 0; i < 6; i++) {
          const k = ss.length ? ss[i % ss.length] : null;
          const [x, y] = k ? pt(bras(k), 0.2 + i / 6 * 0.75, (g() - 0.5) * 3) : [CX + (g() - 0.5) * 8, CY + (g() - 0.5) * 3];
          s += E(x, y, 2.6, 1.4, "#7A5A38");
        }
        bords(m, 6.2, 0.22, g).forEach(([x, y], i) => {
          if (i % 2) s += P(`M${f(x - 1.9)},${f(y + 0.4)} Q${f(x - 1.4)},${f(y - 1.4)} ${f(x)},${f(y - 1.5)} Q${f(x + 1.6)},${f(y - 1.3)} ${f(x + 1.9)},${f(y + 0.4)} Z`, "#7A5A38", 0.55) + `<path d="M${f(x - 1.6)},${f(y + 0.4)} L${f(x + 1.6)},${f(y + 0.4)}" stroke="#5FA548" stroke-width="0.8" stroke-linecap="round"/>`;
        });
      }
      if (etape === 3) {
        s += `<path d="${bande(m, 5.6)}" fill="#6A4A2C"/><path d="${bande(m, 3.8)}" fill="#8A6440"/>`;
        bords(m, 6.4, 0.2, g).forEach(([x, y], i) => {
          s += P(`M${f(x - 1.7)},${f(y)} Q${f(x - 1.3)},${f(y - 1.7)} ${f(x)},${f(y - 1.7)} Q${f(x + 1.5)},${f(y - 1.5)} ${f(x + 1.7)},${f(y)} Q${f(x)},${f(y + 0.9)} ${f(x - 1.7)},${f(y)} Z`, i % 2 ? "#8A6440" : "#7A5A38", 0.55);
        });
      }
      if (etape === 4) {
        s += `<path d="${bande(m, 5.6)}" fill="#7A5A38"/><path d="${bande(m, 4.2)}" fill="#A88A64"/>`;
        for (let i = 0; i < 14; i++) {
          const k = ss.length ? ss[i % ss.length] : null;
          const [x, y] = k ? pt(bras(k), 0.1 + g() * 0.88, (g() - 0.5) * 6) : [CX + (g() - 0.5) * 9, CY + (g() - 0.5) * 4];
          s += E(x, y, 0.55, 0.35, "#C8BCA8");
        }
        bords(m, 5.4, 0.15, g).forEach(([x, y]) => {
          s += caillou(x, y, 1, "#A8A298");
        });
      }
      return s + `</g>`;
    }
    __name(creuse, "creuse");
    function mottes(k) {
      const t = (k + 1) / 4;
      let s = "";
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI * (0.15 + 0.7 * i / 5), d = 4 + t * 16, h = Math.sin(t * Math.PI) * 14;
        s += P("M-1.6,0 Q-1.2,-1.6 0,-1.6 Q1.4,-1.4 1.6,0 Q0,1 -1.6,0 Z", i % 2 ? "#8A6440" : "#6A4A2C", 0.5).replace("<path", `<path transform="translate(${f(CX + Math.cos(a) * d)} ${f(32 - h * (i % 2 ? 0.8 : 1) + t * t * 6)}) rotate(${f(i * 50 + t * 90)}) scale(${f(1.4 - t * 0.3)})"`).replace("/>", ` opacity="${f(1 - Math.max(0, t - 0.6) * 2)}"/>`);
      }
      return s;
    }
    __name(mottes, "mottes");
    var poussiere = /* @__PURE__ */ __name((k) => {
      const t = (k + 1) / 3;
      return [[-8, 0], [0, -3], [8, 0], [-4, -6], [5, -6]].map(([dx, dy]) => E(CX + dx * (1 + t), 32 + dy * (1 + t * 0.6), 3 + t * 4, 2 + t * 2, "#E2CCA8").replace("/>", ` opacity="${f(0.75 * (1 - t * 0.8))}"/>`)).join("");
    }, "poussiere");
    var cailloux = /* @__PURE__ */ __name((k) => {
      const t = (k + 1) / 3;
      return [[-1, 1], [1, 1.2], [-0.4, 1.6], [0.6, 0.8]].map(([sx, v]) => {
        const x = CX + sx * t * 14, y = 32 - Math.sin(t * Math.PI) * 8 * v + t * t * 4;
        return E(x, y, 1.8, 1.3, "#A8A298", 0.6) + E(x - 0.5, y - 0.45, 0.6, 0.4, WHITE);
      }).join("");
    }, "cailloux");
    function posePierre(k) {
      const y = [24, 31.4, 32][k], sx = k === 1 ? 1.15 : 1, sy = k === 1 ? 0.85 : 1;
      let s = `<g transform="translate(${CX} ${y}) scale(${sx} ${sy})">${caillou(0, 0, 3.2, "#B8B0A0")}</g>`;
      if (k > 0) s += E(CX, 33.6, 5 + k * 2, 1.2 + k * 0.4, "#E2CCA8").replace("/>", ` opacity="${f(0.7 - k * 0.2)}"/>`);
      if (k === 1) s += `<path d="M${CX - 6},30 l-2,-1.4 M${CX + 6},30 l2,-1.4" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
      return s;
    }
    __name(posePierre, "posePierre");
    var NOMS_SENS = { ne: "le nord-est", se: "le sud-est", so: "le sud-ouest", no: "le nord-ouest" };
    var CASE = [0, 0, 64, 32];
    var EFFET = [0, 0, 64, 48];
    var nomSens = /* @__PURE__ */ __name((m) => sensDe(m).join("-") || "seul", "nomSens");
    var vers = /* @__PURE__ */ __name((m) => sensDe(m).length ? `vers ${sensDe(m).map((k) => NOMS_SENS[k]).join(", ")}` : "seul (une petite place)", "vers");
    var fichierDe = /* @__PURE__ */ __name((m, v = 0) => `chemin_${nomSens(m)}${v ? "_b" : ""}`, "fichierDe");
    var PIECES2 = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, masque = null) => PIECES2.push({ id, nom, cadre, dessin, suite, ms, masque }), "piece");
    for (let m = 0; m < 16; m++) piece(fichierDe(m), `Le chemin de terre ${vers(m)}`, CASE, () => chemin2(m, `ch${m}`), null, null, m);
    for (let m = 0; m < 16; m++) piece(fichierDe(m, 1), `Le chemin de terre ${vers(m)}, seconde variante`, CASE, () => chemin2(m, `cb${m}`, 1), null, null, m);
    for (let m = 0; m < 16; m++) piece(`pave_${nomSens(m)}`, `Le chemin pavé ${vers(m)}`, CASE, () => pave(m, `pv${m}`), null, null, m);
    var ETAPES = ["le tracé marqué (piquets et ficelle)", "l'herbe coupée ras", "les mottes soulevées", "la tranchée (terre fraîche, mottes)", "les pierres posées (bordure, gravier)"];
    for (let e = 0; e < 5; e++) for (let m = 0; m < 16; m++) piece(`etape-${e + 1}_${nomSens(m)}`, `Le creusement, étape ${e + 1} : ${ETAPES[e]} ; ${vers(m)}`, CASE, () => creuse(e, m, `cr${e}x${m}`), null, null, m);
    for (let k = 0; k < 4; k++) piece(`mottes_${k + 1}`, "Les mottes du coup de bêche", EFFET, () => mottes(k), "mottes", 90);
    for (let k = 0; k < 3; k++) piece(`poussiere_${k + 1}`, "La poussière du coup de bêche", EFFET, () => poussiere(k), "poussiere", 110);
    for (let k = 0; k < 3; k++) piece(`cailloux_${k + 1}`, "Les cailloux du coup de bêche", EFFET, () => cailloux(k), "cailloux", 110);
    for (let k = 0; k < 3; k++) piece(`pose-pierre_${k + 1}`, "Une pierre de bordure qu'on pose", EFFET, () => posePierre(k), "pose-pierre", 90);
    module.exports = { BITS, PIECES: PIECES2, fichierDe, nomSens, sensDe, herbe, chemin: chemin2, pave, creuse, mottes, poussiere, cailloux, posePierre };
  }
});

// atelier/generateur_chemins.mjs
var import_chemins = __toESM(require_chemins(), 1);
var HD = 4;
var PIECES = import_chemins.default.PIECES.map(({ id, nom, cadre, suite, ms, masque }) => ({ id, nom, cadre, suite, ms, masque }));
var svgOf = /* @__PURE__ */ __name((c, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2] * HD}" height="${c[3] * HD}" viewBox="${c.join(" ")}">${body}</svg>`, "svgOf");
function chemin(id) {
  const p = import_chemins.default.PIECES.find((x) => x.id === id);
  if (!p) throw new Error(`pièce inconnue des chemins : ${id}`);
  return { svg: svgOf(p.cadre, p.dessin()), cadre: p.cadre, ms_par_image: p.ms };
}
__name(chemin, "chemin");
var cheminDeMasque = /* @__PURE__ */ __name((masque, variante = 0) => import_chemins.default.fichierDe(masque & 15, variante ? 1 : 0), "cheminDeMasque");
var paveDeMasque = /* @__PURE__ */ __name((masque) => `pave_${import_chemins.default.nomSens(masque & 15)}`, "paveDeMasque");
var etapeDeMasque = /* @__PURE__ */ __name((etape, masque) => {
  if (!(etape >= 1 && etape <= 6)) throw new Error(`étape ${etape} : de 1 à 6`);
  return etape === 6 ? cheminDeMasque(masque) : `etape-${etape}_${import_chemins.default.nomSens(masque & 15)}`;
}, "etapeDeMasque");
function liste() {
  return import_chemins.default.PIECES.map((p) => ({ fichier: `chemins/${p.id}.svg`, fonction: "chemin", args: [p.id] }));
}
__name(liste, "liste");
export {
  HD,
  PIECES,
  chemin,
  cheminDeMasque,
  etapeDeMasque,
  liste,
  paveDeMasque
};
