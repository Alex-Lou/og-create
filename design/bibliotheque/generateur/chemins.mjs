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
    var LOSANGE = `M32,0 L64,16 L32,32 L0,16 Z`;
    var SENS = { ne: [48, 8], se: [48, 24], so: [16, 24], no: [16, 8] };
    var BITS = ["ne", "se", "so", "no"];
    var sensDe = /* @__PURE__ */ __name((m) => BITS.filter((_, i) => m & 1 << i), "sensDe");
    function herbe(id, seed = 3) {
      const g = rnd(seed * 13 + 5);
      let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC868"/><stop offset="1" stop-color="#6EAE50"/></linearGradient><clipPath id="${id}c"><path d="${LOSANGE}"/></clipPath></defs><path d="${LOSANGE}" fill="url(#${id})"/>`;
      let b = "";
      for (let i = 0; i < 9; i++) {
        const x = 8 + g() * 48, y = 6 + g() * 20;
        b += `<path d="M${f(x)},${f(y)} l-0.6,-2 M${f(x + 1)},${f(y)} l0.4,-2.4" stroke="#5A9A40" stroke-width="0.6" stroke-linecap="round"/>`;
      }
      return s + `<g clip-path="url(#${id}c)">${b}</g>`;
    }
    __name(herbe, "herbe");
    function bande(m, w) {
      const ss = sensDe(m);
      if (!ss.length) return `M${CX - w * 1.6},${CY} a${w * 1.6},${w * 0.8} 0 1 0 ${w * 3.2},0 a${w * 1.6},${w * 0.8} 0 1 0 ${-w * 3.2},0 Z`;
      return ss.map((k) => {
        const [x, y] = SENS[k], dx = x - CX, dy = y - CY, L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w * 1;
        const ex = x + dx / L * 2, ey = y + dy / L * 2;
        return `M${f(CX + nx)},${f(CY + ny)} L${f(ex + nx)},${f(ey + ny)} L${f(ex - nx)},${f(ey - ny)} L${f(CX - nx)},${f(CY - ny)} Z`;
      }).join(" ") + ` M${CX - w * 1.25},${CY} a${w * 1.25},${w * 0.7} 0 1 0 ${w * 2.5},0 a${w * 1.25},${w * 0.7} 0 1 0 ${-w * 2.5},0 Z`;
    }
    __name(bande, "bande");
    function chemin2(m, id) {
      const g = rnd(m * 7 + 11);
      let s = herbe(id + "h", m + 1);
      s += `<g clip-path="url(#${id}hc)"><path d="${bande(m, 6.2)}" fill="#5A9A40" opacity=".55"/><path d="${bande(m, 5.2)}" fill="#C8A270"/><path d="${bande(m, 3.4)}" fill="#D8B888"/>`;
      for (let i = 0; i < 6; i++) {
        const ss = sensDe(m), k = ss.length ? ss[i % ss.length] : null, t = 0.2 + g() * 0.7;
        const [x, y] = k ? SENS[k] : [CX + (g() - 0.5) * 6, CY];
        const px = CX + (x - CX) * t + (g() - 0.5) * 3, py = CY + (y - CY) * t + (g() - 0.5) * 1.6;
        s += E(px, py, 0.9 + g() * 0.5, 0.5 + g() * 0.3, "#A8865A") + E(px - 0.3, py - 0.2, 0.35, 0.2, "#F0DCC0");
      }
      return s + `</g>`;
    }
    __name(chemin2, "chemin");
    function creuse(etape, id) {
      const m = 1 | 4;
      if (etape === 3) return chemin2(m, id + "c");
      let s = herbe(id + "h", 9);
      if (etape === 0) {
        for (const [x, y] of [[44, 9.6], [20, 22.4]]) s += P(`M${x},${y} L${x},${y - 5}`, "none", 1.4) + `<path d="M${x},${y} L${x},${y - 5}" stroke="#C8925A" stroke-width="0.7" stroke-linecap="round"/>` + E(x, y - 5.4, 0.9, 0.6, "#E8504A", 0.5);
        s += `<path d="M44,5 L20,17.6" stroke="#F4EEDC" stroke-width="0.6" stroke-dasharray="1.6 1"/>`;
        return s;
      }
      s += `<g clip-path="url(#${id}hc)">`;
      if (etape === 1) s += `<path d="${bande(m, 5)}" fill="#7A5A38" opacity=".5"/>` + [[38, 12], [28, 19], [33, 15]].map(([x, y]) => `<path d="M${x},${y} q2,-1 4,0 q-1,1.6 -4,0 Z" fill="#5A9A40" stroke="${OUT}" stroke-width="0.5"/>`).join("");
      if (etape === 2) {
        s += `<path d="${bande(m, 5.4)}" fill="#6A4A2C"/><path d="${bande(m, 3.6)}" fill="#8A6440"/>`;
        s += [[41, 15], [37, 7.6], [24, 24], [19, 16.6], [30, 21], [34, 9]].map(([x, y], i) => P(`M${x - 1.8},${y} Q${x - 1.4},${y - 1.8} ${x},${y - 1.8} Q${x + 1.6},${y - 1.6} ${x + 1.8},${y} Q${x},${y + 1} ${x - 1.8},${y} Z`, i % 2 ? "#8A6440" : "#7A5A38", 0.6)).join("");
      }
      return s + `</g>`;
    }
    __name(creuse, "creuse");
    function mottes(k) {
      const t = (k + 1) / 4;
      let s = "";
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI * (0.15 + 0.7 * i / 5), d = 4 + t * 16, h = Math.sin(t * Math.PI) * 14;
        s += P(`M-1.6,0 Q-1.2,-1.6 0,-1.6 Q1.4,-1.4 1.6,0 Q0,1 -1.6,0 Z`, i % 2 ? "#8A6440" : "#6A4A2C", 0.5).replace("<path", `<path transform="translate(${f(CX + Math.cos(a) * d)} ${f(32 - h * (i % 2 ? 0.8 : 1) + t * t * 6)}) rotate(${f(i * 50 + t * 90)}) scale(${f(1.4 - t * 0.3)})"`).replace("/>", ` opacity="${f(1 - Math.max(0, t - 0.6) * 2)}"/>`);
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
      return [[-1, 1], [1, 1.2], [-0.4, 1.6], [0.6, 0.8]].map(([sx, v], i) => {
        const x = CX + sx * t * 14, y = 32 - Math.sin(t * Math.PI) * 8 * v + t * t * 4;
        return E(x, y, 1.8, 1.3, "#A8A298", 0.6) + E(x - 0.5, y - 0.45, 0.6, 0.4, WHITE);
      }).join("");
    }, "cailloux");
    var NOMS_SENS = { ne: "le nord-est", se: "le sud-est", so: "le sud-ouest", no: "le nord-ouest" };
    var CASE = [0, 0, 64, 32];
    var EFFET = [0, 0, 64, 48];
    var fichierDe = /* @__PURE__ */ __name((m) => `chemin_${sensDe(m).join("-") || "seul"}`, "fichierDe");
    var PIECES2 = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, masque = null) => PIECES2.push({ id, nom, cadre, dessin, suite, ms, masque }), "piece");
    for (let m = 0; m < 16; m++) {
      const ss = sensDe(m);
      piece(fichierDe(m), ss.length ? `Le chemin vers ${ss.map((k) => NOMS_SENS[k]).join(", ")}` : "Le chemin seul (une petite place)", CASE, () => chemin2(m, `ch${m}`), null, null, m);
    }
    var ETAPES = ["le tracé marqué (piquets et ficelle)", "l'herbe arrachée", "la tranchée (terre fraîche, mottes)", "le chemin tassé"];
    for (let e = 0; e < 4; e++) piece(`creuse_${e + 1}`, `Le creusement d'un chemin droit : ${ETAPES[e]}`, CASE, () => creuse(e, `cr${e}`), "creuse", null);
    for (let k = 0; k < 4; k++) piece(`mottes_${k + 1}`, "Les mottes du coup de bêche", EFFET, () => mottes(k), "mottes", 90);
    for (let k = 0; k < 3; k++) piece(`poussiere_${k + 1}`, "La poussière du coup de bêche", EFFET, () => poussiere(k), "poussiere", 110);
    for (let k = 0; k < 3; k++) piece(`cailloux_${k + 1}`, "Les cailloux du coup de bêche", EFFET, () => cailloux(k), "cailloux", 110);
    module.exports = { BITS, PIECES: PIECES2, fichierDe, sensDe, herbe, chemin: chemin2, creuse, mottes, poussiere, cailloux };
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
var cheminDeMasque = /* @__PURE__ */ __name((masque) => import_chemins.default.fichierDe(masque & 15), "cheminDeMasque");
function liste() {
  return import_chemins.default.PIECES.map((p) => ({ fichier: `chemins/${p.id}.svg`, fonction: "chemin", args: [p.id] }));
}
__name(liste, "liste");
export {
  HD,
  PIECES,
  chemin,
  cheminDeMasque,
  liste
};
