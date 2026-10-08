// Assemblé par design/atelier/build_bundle.js à partir de design/atelier/generateur_minijeux.mjs : ne pas modifier à la main.
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

// atelier/minijeu_filon.js
var require_minijeu_filon = __commonJS({
  "atelier/minijeu_filon.js"(exports, module) {
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
    var ROCHE = {
      1: { clair: "#E2D2B4", corps: "#C8B48E", ombre: "#A08A66", fonce: "#7A6648", grain: "#B09A74", nom: "tendre (1 coup)" },
      2: { clair: "#C4BDB2", corps: "#A39A8E", ombre: "#7E766C", fonce: "#5C554D", grain: "#8E867A", nom: "dur (2 coups)" },
      3: { clair: "#8E8C96", corps: "#6C6A76", ombre: "#4E4C58", fonce: "#36343E", grain: "#5A5866", nom: "très dur (3 coups)" }
    };
    var FORME = "M5,3 L27,3 Q29.5,3 29.5,5.5 L29.5,26.5 Q29.5,29 27,29 L5,29 Q2.5,29 2.5,26.5 L2.5,5.5 Q2.5,3 5,3 Z";
    var defsRoche = /* @__PURE__ */ __name((h, id) => {
      const r = ROCHE[h];
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${r.clair}"/><stop offset=".55" stop-color="${r.corps}"/><stop offset="1" stop-color="${r.ombre}"/></linearGradient><clipPath id="${id}c"><path d="${FORME}"/></clipPath></defs>`;
    }, "defsRoche");
    function texture(h, id) {
      const r = ROCHE[h], g = rnd(h * 97 + 13);
      let s = "";
      for (const y of [10.5, 17.5, 23.5].slice(0, h === 1 ? 2 : 3)) s += `<path d="M2,${f(y + g())} q4,-1.2 8,0 t8,0 t8,0 t8,0" fill="none" stroke="${r.ombre}" stroke-width="0.7" opacity=".55"/>`;
      for (let i = 0; i < 9; i++) s += E(4 + g() * 24, 6 + g() * 20, 0.5 + g() * 0.6, 0.4 + g() * 0.4, r.grain);
      for (let i = 0; i < 2; i++) {
        const x = 7 + g() * 18, y = 9 + g() * 14;
        s += E(x, y, 1.6, 1.1, r.clair, 0.5) + E(x - 0.5, y - 0.4, 0.5, 0.3, WHITE);
      }
      if (h === 3) for (let i = 0; i < 6; i++) {
        const x = 5 + g() * 22, y = 6 + g() * 20;
        s += `<path d="M${f(x)},${f(y - 0.9)} L${f(x + 0.3)},${f(y)} L${f(x)},${f(y + 0.9)} L${f(x - 0.3)},${f(y)} Z" fill="#E8E4F4" opacity=".9"/>`;
      }
      if (h === 2) s += `<path d="M3,21 Q10,17 16,19 T29,14" fill="none" stroke="${r.clair}" stroke-width="1.1" opacity=".7"/>`;
      return `<g clip-path="url(#${id}c)">${s}</g>`;
    }
    __name(texture, "texture");
    var FISSURES = {
      1: "M17,11 L15.4,14.2 L17.2,16 L15,19.6 M15.4,14.2 L12.4,13.2",
      2: "M17,11 L15.4,14.2 L17.2,16 L15,19.6 L16.4,23.4 M15.4,14.2 L12.4,13.2 L9.6,15.4 M17.2,16 L21,15.2 L23.4,18 M15,19.6 L11.6,21.4 M17,11 L19.6,8.4 L22,9.2"
    };
    var fissures = /* @__PURE__ */ __name((n) => n ? `<path d="${FISSURES[n]}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/><path d="${FISSURES[n]}" fill="none" stroke="${WHITE}" stroke-width="0.4" opacity=".45" transform="translate(0.5 0.5)"/>` : "", "fissures");
    function bloc(h, crack = 0, id = `r${h}${crack}`) {
      const r = ROCHE[h];
      return defsRoche(h, id) + `<path d="${FORME}" fill="url(#${id})"/>` + texture(h, id) + `<path d="M5.5,4.6 L26,4.6" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".5"/><path d="M4,27.6 L28,27.6" stroke="${r.fonce}" stroke-width="1.2" stroke-linecap="round" opacity=".4"/><path d="${FORME}" fill="none"${st(1.1)}/>` + fissures(crack);
    }
    __name(bloc, "bloc");
    var trou = /* @__PURE__ */ __name((id) => `<defs><radialGradient id="${id}" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#2E2824"/><stop offset="1" stop-color="#14100E"/></radialGradient></defs><path d="${FORME}" fill="url(#${id})"/><path d="M3.4,9 Q3,4 6,3.6 L26,3.6 Q29,4 28.6,9 Q22,6.4 16,6.4 Q10,6.4 3.4,9 Z" fill="#4A403A"/>${E(9, 25, 1.4, 0.7, "#3A322C")}${E(22, 26, 1, 0.5, "#3A322C")}<path d="${FORME}" fill="none"${st(1.1)}/>`, "trou");
    var ECLATS = [["M3,3 L16,3 L14.5,13 L3,15 Z", -1, -1], ["M16,3 L29,3 L29,14 L17,15 L14.5,13 Z", 1, -1], ["M3,15 L14.5,13 L17,15 L14,29 L3,29 Z", -1, 1], ["M17,15 L29,14 L29,29 L14,29 Z", 1, 1]];
    function eclate(h, k, id) {
      const r = ROCHE[h], t = (k + 1) / 4;
      let s = defsRoche(h, id);
      const g = rnd(31);
      for (let i = 0; i < 7; i++) {
        const a = g() * 6.3, d = 4 + t * 9;
        s += E(16 + Math.cos(a) * d, 17 + Math.sin(a) * d * 0.7 + t * 2, 2.6 + t * 3, 2 + t * 2.4, "#D8CCB6").replace("/>", ` opacity="${f(0.75 * (1 - t * 0.85))}"/>`);
      }
      ECLATS.forEach(([d, sx, sy], i) => {
        const dx = sx * (2 + t * 9), dy = sy * (1 + t * 6) + t * t * 9, rot = sx * t * 50, o = 1 - Math.max(0, t - 0.5) * 1.6;
        s += `<g transform="translate(${f(dx)} ${f(dy)}) rotate(${f(rot)} 16 16)" opacity="${f(o)}"><path d="${d}" fill="url(#${id})"${st(0.9)}/></g>`;
      });
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI * (0.1 + 0.8 * i / 5), d = 6 + t * 12;
        s += E(16 + Math.cos(a) * d, 15 + Math.sin(a) * d + t * t * 14, 1, 0.8, r.ombre, 0.5).replace("/>", ` opacity="${f(1 - t * 0.7)}"/>`);
      }
      return s;
    }
    __name(eclate, "eclate");
    function pioche(k) {
      const ang = [-55, -20, 12][k];
      const tete = "M-9,-1.6 Q0,-5 9,-1.6 Q9.6,-0.8 8.6,-0.4 Q0,-2.6 -8.6,-0.4 Q-9.6,-0.8 -9,-1.6 Z";
      let s = `<g transform="translate(24 27) rotate(${ang})"><rect x="-1.2" y="-18" width="2.4" height="19" rx="1.1" fill="#B07A4A"${st(0.8)}/><rect x="-0.5" y="-17" width="0.7" height="16" rx="0.35" fill="#D8A878"/><g transform="translate(0 -18)">${P(tete, "#A8B0BA", 0.8)}<path d="M-7,-1.6 Q0,-3.8 7,-1.6" fill="none" stroke="#E2E8EE" stroke-width="0.6"/>${E(0, -1.6, 1.6, 1.2, "#8A6A4A", 0.6)}</g></g>`;
      if (k === 1) s += `<path d="M6,6 Q2,14 6,22" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><path d="M9,4 Q4,13 8,23" fill="none" stroke="${WHITE}" stroke-width="0.8" stroke-linecap="round" opacity=".5"/>`;
      return s;
    }
    __name(pioche, "pioche");
    function etincelles(k, fort) {
      const t = (k + 1) / 3, n = fort ? 9 : 6, g = rnd(7);
      let s = "";
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (g() - 0.5) * 2.6, l0 = 1.5 + t * 10, l1 = l0 + (fort ? 6 : 4.5) * (1 - t * 0.5);
        s += `<path d="M${f(16 + Math.cos(a) * l0)},${f(13 + Math.sin(a) * l0)} L${f(16 + Math.cos(a) * l1)},${f(13 + Math.sin(a) * l1)}" stroke="#FFD24A" stroke-width="${f(1.4 * (1 - t * 0.5))}" stroke-linecap="round" opacity="${f(1 - t * 0.6)}"/><circle cx="${f(16 + Math.cos(a) * l1)}" cy="${f(13 + Math.sin(a) * l1 + t * t * 3)}" r="${f(0.5 * (1 - t * 0.4))}" fill="#FFF6C8" opacity="${f(1 - t * 0.5)}"/>`;
      }
      if (k === 0) s += `<circle cx="16" cy="13" r="${fort ? 3.4 : 2.6}" fill="#FFF6C8" opacity=".9"/>`;
      return s;
    }
    __name(etincelles, "etincelles");
    var onde = /* @__PURE__ */ __name((k) => {
      const t = (k + 1) / 3;
      return `<rect x="${f(16 - 8 - t * 7)}" y="${f(16 - 8 - t * 7)}" width="${f(16 + t * 14)}" height="${f(16 + t * 14)}" rx="${f(4 + t * 4)}" fill="none" stroke="#FFF0C8" stroke-width="${f(2.2 * (1 - t * 0.7))}" opacity="${f(0.85 * (1 - t * 0.8))}"/>`;
    }, "onde");
    var GEMMES = {
      quartz: { clair: "#FFFFFF", corps: "#E4EEF4", ombre: "#A8C0CE", eclat: "#E8F4FF", nom: "quartz" },
      amethyste: { clair: "#E8D4FF", corps: "#B07AE8", ombre: "#6E3EA8", eclat: "#D8B8FF", nom: "améthyste" },
      rubis: { clair: "#FFC4C4", corps: "#E84A5A", ombre: "#A0202E", eclat: "#FF9AA8", nom: "rubis" },
      diamant: { clair: "#FFFFFF", corps: "#D8F4FF", ombre: "#8ED0F0", eclat: "#FFFFFF", nom: "diamant" }
    };
    function gemme(k, id) {
      const c = GEMMES[k];
      const grad = `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${c.clair}"/><stop offset=".5" stop-color="${c.corps}"/><stop offset="1" stop-color="${c.ombre}"/></linearGradient></defs>`;
      let s = grad;
      if (k === "quartz" || k === "amethyste") {
        s += P("M6,26 Q16,22.6 26,26 Q25,28.6 16,28.8 Q7,28.6 6,26 Z", "#8E8478", 0.9);
        for (const [x, h, a, w] of [[11, 13, -16, 3.4], [21, 12, 18, 3.2], [16, 18, 0, 4.2]]) {
          s += `<g transform="translate(${x} 26) rotate(${a})">${P(`M${-w},0 L${-w},${-h + w} L0,${-h} L${w},${-h + w} L${w},0 Z`, `url(#${id})`, 0.9)}${P(`M0,${-h} L0,0`, "none", 0).replace('fill="none"', `fill="none" stroke="${c.ombre}" stroke-width="0.6"`)}<path d="M${f(-w + 0.8)},${f(-h + w + 0.6)} L${f(-w + 0.8)},-1.4" stroke="${WHITE}" stroke-width="0.9" stroke-linecap="round" opacity=".8"/></g>`;
        }
      } else if (k === "rubis") {
        s += P("M16,5 L24.6,10 L26,17.4 L20.6,26 L11.4,26 L6,17.4 L7.4,10 Z", `url(#${id})`, 1);
        s += `<path d="M16,5 L16,11 M24.6,10 L20.4,13 M7.4,10 L11.6,13 M6,17.4 L11.6,13 L20.4,13 L26,17.4 M11.6,13 L13.4,26 M20.4,13 L18.6,26 M16,11 L11.6,13 M16,11 L20.4,13" fill="none" stroke="${c.ombre}" stroke-width="0.6"/>`;
        s += P("M11.6,13 L20.4,13 L18.6,19 L13.4,19 Z", c.clair, 0).replace("/>", ' opacity=".55"/>') + `<path d="M9,10.6 L12.6,9" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round"/>`;
      } else {
        s += P("M6,12 L10.6,6 L21.4,6 L26,12 L16,27.4 Z", `url(#${id})`, 1);
        s += `<path d="M6,12 L26,12 M10.6,6 L13,12 L16,6 L19,12 L21.4,6 M13,12 L16,27.4 L19,12" fill="none" stroke="${c.ombre}" stroke-width="0.6"/>`;
        s += P("M13,12 L19,12 L16,20 Z", "#FFE8F4", 0).replace("/>", ' opacity=".7"/>') + P("M6,12 L13,12 L16,27.4 Z", "#E8F8D8", 0).replace("/>", ' opacity=".35"/>') + P("M19,12 L26,12 L16,27.4 Z", "#FFF0C8", 0).replace("/>", ' opacity=".35"/>');
        s += `<path d="M11.4,8.2 L13.6,7.4" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round"/>`;
      }
      return s;
    }
    __name(gemme, "gemme");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFFFF") => `<path d="M${x},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${y} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${x},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${y} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${x},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var brille = /* @__PURE__ */ __name((x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="scale" additive="sum" values="0.4;1.1;0.4;0.4" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`, "brille");
    var gemmeAnimee = /* @__PURE__ */ __name((k, id) => gemme(k, id) + brille(11, 9, 2.6, 2.4, 0) + brille(22, 15, 1.8, 2.4, 1.1), "gemmeAnimee");
    function apparait(k, i, id) {
      const c = GEMMES[k], sc = [0.35, 1.18, 0.96, 1][i], dy = [5, -2, 0.5, 0][i], ray = [0.5, 1, 0.7, 0.35][i];
      let s = "";
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4 + i * 0.12, l = 9 + ray * 6;
        s += `<path d="M${f(16 + Math.cos(a - 0.1) * 5)},${f(16 + Math.sin(a - 0.1) * 5)} L${f(16 + Math.cos(a) * l)},${f(16 + Math.sin(a) * l)} L${f(16 + Math.cos(a + 0.1) * 5)},${f(16 + Math.sin(a + 0.1) * 5)} Z" fill="${c.eclat}" opacity="${f(0.55 * ray)}"/>`;
      }
      s += `<circle cx="16" cy="16" r="${f(7 + ray * 4)}" fill="${c.eclat}" opacity="${f(0.3 * ray)}"/>`;
      return s + `<g transform="translate(16 ${f(16 + dy)}) scale(${sc}) translate(-16 -16)">${gemme(k, id)}</g>` + (i === 1 ? etoile(24, 7, 2.6) + etoile(8, 10, 1.6) : "");
    }
    __name(apparait, "apparait");
    function eclatCouleur(k, i) {
      const c = GEMMES[k], t = (i + 1) / 4;
      let s = "";
      const cols = k === "diamant" ? ["#FF9AA8", "#FFD86A", "#9AE8A0", "#8AC8FF", "#C8A0FF", "#FFFFFF"] : [c.corps, c.clair, c.eclat];
      for (let j = 0; j < 10; j++) {
        const a = j * Math.PI / 5 + 0.3, d = 4 + t * 18, r = 2.3 * (1 - t * 0.5);
        s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d)}) rotate(${f(j * 36 + t * 90)})" opacity="${f(1 - t * 0.75)}">${P(`M0,${f(-r * 1.4)} L${f(r)},0 L0,${f(r * 1.4)} L${f(-r)},0 Z`, cols[j % cols.length], 0.4)}</g>`;
      }
      if (i < 2) s += etoile(16, 16, 7 - i * 2, "#FFFBE8");
      return s;
    }
    __name(eclatCouleur, "eclatCouleur");
    var lueur = /* @__PURE__ */ __name((allumee) => allumee ? `<defs><radialGradient id="lf"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".75"/><stop offset=".6" stop-color="#FFC84A" stop-opacity=".35"/><stop offset="1" stop-color="#FFC84A" stop-opacity="0"/></radialGradient></defs><rect x="0" y="0" width="32" height="32" fill="url(#lf)"><animate attributeName="opacity" values=".55;1;.55" dur="1.6s" repeatCount="indefinite"/></rect><path d="M2,18 Q9,13 16,16 T30,12" fill="none" stroke="#FFE7A0" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;-12" dur="1.2s" repeatCount="indefinite"/></path>` : `<path d="M2,18 Q9,13 16,16 T30,12" fill="none" stroke="#9AA4B8" stroke-width="1" stroke-linecap="round" stroke-dasharray="1.5 3" opacity=".6"/>`, "lueur");
    var signe = /* @__PURE__ */ __name((n) => [[25.5, 26, 3], [20.5, 27.4, 2.2], [27.6, 21.2, 2]].slice(0, n).map(([x, y, r], i) => `<g transform="translate(${x} ${y})"><path d="M0,${-r} Q${f(r * 0.18)},${f(-r * 0.18)} ${r},0 Q${f(r * 0.18)},${f(r * 0.18)} 0,${r} Q${f(-r * 0.18)},${f(r * 0.18)} ${-r},0 Q${f(-r * 0.18)},${f(-r * 0.18)} 0,${-r} Z" fill="#FFE07A" stroke="${OUT}" stroke-width="0.5"><animateTransform attributeName="transform" type="scale" values="1;0.6;1" dur="1.4s" begin="${f(i * 0.45)}s" repeatCount="indefinite"/></path></g>`).join(""), "signe");
    var BLOC = [0, 0, 32, 32];
    var LARGE = [-8, -8, 48, 48];
    var DURETES = { 1: "tendre", 2: "dur", 3: "tres-dur" };
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null) => PIECES.push({ id, nom, cadre, dessin, suite, ms }), "piece");
    for (const h of [1, 2, 3]) for (let c = 0; c < h; c++) piece(`bloc-${DURETES[h]}_${c ? `fissure-${c}` : "neuf"}`, `Bloc ${ROCHE[h].nom}${c ? `, après ${c} coup${c > 1 ? "s" : ""}` : ""}`, BLOC, () => bloc(h, c, `fl${h}${c}`));
    piece("trou", "Le trou d'un bloc cassé", BLOC, () => trou("fltr"));
    for (const h of [1, 2, 3]) for (let k = 0; k < 4; k++) piece(`eclatement-${DURETES[h]}_${k + 1}`, `Le bloc ${ROCHE[h].nom.split(" (")[0]} qui éclate`, LARGE, () => eclate(h, k, `fle${h}${k}`), `eclatement-${DURETES[h]}`, 70);
    for (let k = 0; k < 3; k++) piece(`pioche_${k + 1}`, "La pioche (levée, l'élan, le coup)", BLOC, () => pioche(k), "pioche", 90);
    for (const [fort, nom] of [[false, "dur"], [true, "tres-dur"]]) for (let k = 0; k < 3; k++) piece(`etincelles-${nom}_${k + 1}`, `Les étincelles d'un bloc ${nom === "dur" ? "dur" : "très dur"}`, LARGE, () => etincelles(k, fort), `etincelles-${nom}`, 70);
    for (let k = 0; k < 3; k++) piece(`onde_${k + 1}`, "L'onde du bloc cassé", LARGE, () => onde(k), "onde", 80);
    var LE = { quartz: "Le ", amethyste: "L'", rubis: "Le ", diamant: "Le " };
    var DU = { quartz: "du ", amethyste: "de l'", rubis: "du ", diamant: "du " };
    for (const g of Object.keys(GEMMES)) {
      piece(g, `${GEMMES[g].nom[0].toUpperCase()}${GEMMES[g].nom.slice(1)} (son éclat passe, en boucle)`, BLOC, () => gemmeAnimee(g, `flg${g}`));
      for (let k = 0; k < 4; k++) piece(`apparition-${g}_${k + 1}`, `${LE[g]}${GEMMES[g].nom} qui apparaît`, BLOC, () => apparait(g, k, `fla${g}${k}`), `apparition-${g}`, 110);
      for (let k = 0; k < 4; k++) piece(`eclats-${g}_${k + 1}`, `Les éclats de couleur ${DU[g]}${GEMMES[g].nom}`, LARGE, () => eclatCouleur(g, k), `eclats-${g}`, 70);
    }
    piece("lueur_allumee", "La lueur du filon, suivi (en boucle)", BLOC, () => lueur(true));
    piece("lueur_eteinte", "La lueur du filon, perdu", BLOC, () => lueur(false));
    for (const n of [1, 2, 3]) piece(`signe-${n}`, `Le signe ✦ : ${n} pierre${n > 1 ? "s" : ""} tout près (en boucle)`, BLOC, () => signe(n));
    var TITRE = "Le Filon (la Carrière)";
    var FOND = "#4A4440";
    var LISEZ_MOI = "Le Filon : un bloc de la paroi a un cadre de 32 × 32 ; les effets qui débordent du bloc (éclatement, étincelles, onde, éclats de couleur) ont un cadre de 48 × 48 centré sur le bloc (à poser 1,5 fois plus grand que le bloc). Pièces fixes : les blocs et leurs fissures, le trou. Boucles animées dans le SVG (SMIL) : l'éclat des pierres, la lueur du filon, le signe ✦. Suites d'images à enchaîner une fois, au coup : le bloc qui éclate, la pioche, les étincelles, l'onde, la pierre qui apparaît, ses éclats de couleur. Améliorations : le fond de la paroi selon la profondeur (48 × 48, se répète) et sa crête (48 × 14, se répète en largeur) ; les pioches de bois et d'or et leur coup (48 × 48) ; six trouvailles (fossiles, objets des Anciens) et leur apparition ; l'écran de bilan (le coffret 64 × 48 de 0 à 4 pierres, les étoiles).";
    module.exports = { TITRE, FOND, LISEZ_MOI, ROCHE, GEMMES, PIECES, bloc, trou, eclate, pioche, etincelles, onde, gemme, gemmeAnimee, apparait, eclatCouleur, lueur, signe };
  }
});

// atelier/minijeu_filon_plus.js
var require_minijeu_filon_plus = __commonJS({
  "atelier/minijeu_filon_plus.js"(exports, module) {
    var FI = require_minijeu_filon();
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
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var brille = /* @__PURE__ */ __name((x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`, "brille");
    var L = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "L");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var COUCHES = {
      surface: { haut: "#8A6A48", bas: "#6E5238", strate: "#A88A64", nom: "en surface : terre et racines" },
      milieu: { haut: "#6A645C", bas: "#4E4944", strate: "#8A847A", nom: "au milieu : roche à strates" },
      profond: { haut: "#3E3A4A", bas: "#2A2734", strate: "#5A5670", nom: "tout au fond : roche sombre et cristaux" }
    };
    function fond(c, anim = true) {
      const k = COUCHES[c], g = rnd(c.length * 31 + 7);
      let s = `<defs><linearGradient id="fp${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.haut}"/><stop offset="1" stop-color="${k.bas}"/></linearGradient></defs><rect x="0" y="0" width="48" height="48" fill="url(#fp${c})"/>`;
      for (const y of [9, 21, 34, 44]) s += `<path d="M0,${y} q6,-1.6 12,0 t12,0 t12,0 t12,0" fill="none" stroke="${k.strate}" stroke-width="1" opacity=".5"/>`;
      for (let i = 0; i < 10; i++) s += E(2 + g() * 44, 2 + g() * 44, 0.6 + g() * 1.2, 0.4 + g() * 0.8, k.strate).replace("/>", ' opacity=".55"/>');
      if (c === "surface") for (const [x, y, l] of [[6, 2, 14], [30, 6, 10], [42, 0, 18]]) s += `<path d="M${x},${y} q2,${f(l / 2)} -1,${l} q-1,3 1,5" fill="none" stroke="#C8A070" stroke-width="1.1" stroke-linecap="round" opacity=".8"/><path d="M${x},${f(y + l / 2)} l3,2" stroke="#C8A070" stroke-width="0.7" opacity=".7"/>`;
      if (c === "milieu") s += [[10, 28], [36, 14]].map(([x, y]) => P(`M${x - 3},${y + 2} L${x - 1},${y - 2} L${x + 2},${y - 1} L${x + 3},${y + 2} Z`, "#7E786E", 0.6)).join("");
      if (c === "profond") {
        for (const [x, y, col] of [[12, 30, "#9A7AE8"], [38, 12, "#6AC8E8"], [30, 40, "#E87AB0"]]) {
          s += `<g transform="translate(${x} ${y})">${P("M-2,2 L-2,-2 L0,-4 L2,-2 L2,2 Z", col, 0.6)}${P("M2,2 L4,-1 L5,1 L4,3 Z", col, 0.5)}<path d="M-1.2,-1.6 L-1.2,1.4" stroke="${WHITE}" stroke-width="0.5" opacity=".8"/></g>`;
          s += `<circle cx="${x}" cy="${y}" r="6" fill="${col}" opacity=".18">${anim ? `<animate attributeName="opacity" values=".08;.3;.08" dur="${f(1.8 + x / 30)}s" repeatCount="indefinite"/>` : ""}</circle>`;
        }
      }
      return s;
    }
    __name(fond, "fond");
    function crete() {
      let s = `<path d="M0,6 Q6,3.6 12,5.4 T24,5.4 T36,5.4 T48,6 L48,14 L0,14 Z" fill="#8A6A48"/><path d="M0,6 Q6,3.6 12,5.4 T24,5.4 T36,5.4 T48,6" fill="none"${st(0.9)}/>`;
      for (let x = 1; x < 48; x += 2.6) s += `<path d="M${f(x)},${f(5.6)} q${f(0.6 + x % 3 * 0.2)},-3 ${f(1.4)},-${f(3.4 + x % 5 * 0.4)}" fill="none" stroke="#5FA548" stroke-width="1.2" stroke-linecap="round"/>`;
      s += [[8, 2.4, "#FFF4F0"], [27, 2, "#F2C04B"], [41, 2.6, "#F7A6C0"]].map(([x, y, c]) => [0, 1, 2, 3, 4].map((i) => {
        const a = i * 1.257;
        return E(x + Math.cos(a) * 0.9, y + Math.sin(a) * 0.9, 0.7, 0.7, c);
      }).join("") + E(x, y, 0.5, 0.5, "#E2A030")).join("");
      for (const [x, l] of [[5, 6], [19, 4], [33, 7], [45, 5]]) s += `<path d="M${x},8 q-1,${f(l / 2)} 0.6,${l}" fill="none" stroke="#C8A070" stroke-width="0.9" stroke-linecap="round"/>`;
      return s;
    }
    __name(crete, "crete");
    var METAUX = {
      bois: { tete: "#C8925A", clair: "#E8C090", manche: "#A8804A", nom: "de bois" },
      fer: { tete: "#A8B0BA", clair: "#E2E8EE", manche: "#B07A4A", nom: "de fer" },
      or: { tete: "#F2C94C", clair: "#FFF2B8", manche: "#8A4A2A", nom: "d'or" }
    };
    function pioche(m, k) {
      const c = METAUX[m], ang = [-55, -20, 12][k];
      const tete = "M-9,-1.6 Q0,-5 9,-1.6 Q9.6,-0.8 8.6,-0.4 Q0,-2.6 -8.6,-0.4 Q-9.6,-0.8 -9,-1.6 Z";
      let s = `<g transform="translate(24 27) rotate(${ang})"><rect x="-1.2" y="-18" width="2.4" height="19" rx="1.1" fill="${c.manche}"${st(0.8)}/><rect x="-0.5" y="-17" width="0.7" height="16" rx="0.35" fill="${WHITE}" opacity=".3"/>`;
      if (m === "or") s += `<rect x="-1.5" y="-6" width="3" height="2" rx="0.5" fill="#F2C94C"${st(0.5)}/>`;
      s += `<g transform="translate(0 -18)">${P(tete, c.tete, 0.8)}<path d="M-7,-1.6 Q0,-3.8 7,-1.6" fill="none" stroke="${c.clair}" stroke-width="0.6"/>${m === "or" ? E(0, -1.8, 1.4, 1.2, "#E8504A", 0.5) : E(0, -1.6, 1.6, 1.2, "#8A6A4A", 0.6)}</g></g>`;
      if (k === 1) s += `<path d="M6,6 Q2,14 6,22" fill="none" stroke="${m === "or" ? "#FFE07A" : WHITE}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`;
      if (m === "or" && k !== 1) s += etoile(k ? 8 : 14, k ? 10 : 4, 1.8);
      return s;
    }
    __name(pioche, "pioche");
    function coup(m, k) {
      const t = (k + 1) / 3;
      if (m === "fer") return FI.etincelles(k, true);
      let s = "";
      if (m === "bois") for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * 0.5, d = 4 + t * 14;
        s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(13 + Math.sin(a) * d + t * t * 6)}) rotate(${f(i * 60 + t * 120)}) scale(1.9)" opacity="${f(1 - t * 0.6)}">${P("M-1.6,-0.6 Q0,-1.4 1.6,-0.6 Q0,0.6 -1.6,-0.6 Z", "#E8C090", 0.4)}</g>`;
      }
      if (m === "or") {
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i - 4.5) * 0.3, d = 2 + t * 14;
          s += etoile(16 + Math.cos(a) * d, 13 + Math.sin(a) * d + t * t * 4, f(1.8 * (1 - t * 0.5)), i % 2 ? "#FFE07A" : "#FFFBE8");
        }
        if (k === 0) s += `<circle cx="16" cy="13" r="4" fill="#FFF2B8" opacity=".9"/>`;
      }
      return s;
    }
    __name(coup, "coup");
    var TROUVAILLES = {
      ammonite: { nom: "ammonite (fossile)", eclat: "#F2E0C0" },
      arete: { nom: "arête de poisson (fossile)", eclat: "#F4ECD8" },
      coquillage: { nom: "coquillage ancien", eclat: "#FFE0D8" },
      rune: { nom: "pierre runique (des Anciens)", eclat: "#B8F0EA" },
      cle: { nom: "clé des Anciens", eclat: "#FFF0B8" },
      piece: { nom: "pièce des Anciens", eclat: "#FFF0B8" }
    };
    function trouvaille(k) {
      switch (k) {
        case "ammonite": {
          let d = "M16,16";
          for (let i = 1; i <= 40; i++) {
            const a = i * 0.32, r = 0.4 + i * 0.27;
            d += ` L${f(16 + Math.cos(a) * r)},${f(16 + Math.sin(a) * r)}`;
          }
          return P("M16,4.6 A11.4,11.4 0 1 1 15.9,4.6 Z", "#D8C4A0", 1) + `<path d="${d}" fill="none" stroke="#A88A60" stroke-width="1.1" stroke-linecap="round"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = i * 0.785;
            return `<path d="M${f(16 + Math.cos(a) * 8)},${f(16 + Math.sin(a) * 8)} L${f(16 + Math.cos(a) * 11)},${f(16 + Math.sin(a) * 11)}" stroke="#B8A07A" stroke-width="0.6"/>`;
          }).join("") + `<path d="M8.4,10 Q10.6,7 14,6" fill="none" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`;
        }
        case "arete":
          return `<g transform="translate(16 16) scale(0.88) translate(-16 -16)">` + P("M3,16 Q8,12 24,14 Q29,15 29.6,16 Q29,17 24,18 Q8,20 3,16 Z", "#C8B490", 1) + `<path d="M5,16 L27,16" stroke="#8A7650" stroke-width="1.1"/>` + [8, 11, 14, 17, 20, 23].map((x) => `<path d="M${x},16 Q${x + 1.4},12.6 ${x + 2.6},11 M${x},16 Q${x + 1.4},19.4 ${x + 2.6},21" fill="none" stroke="#F4ECD8" stroke-width="1.1" stroke-linecap="round"/><path d="M${x},16 Q${x + 1.4},12.6 ${x + 2.6},11 M${x},16 Q${x + 1.4},19.4 ${x + 2.6},21" fill="none" stroke="#8A7650" stroke-width="0.4" stroke-linecap="round"/>`).join("") + E(26.4, 15.2, 1.1, 1.1, "#5A4A30") + P("M3,16 L0.6,12.6 L1.4,16 L0.6,19.4 Z", "#C8B490", 0.7) + "</g>";
        case "coquillage":
          return P("M16,27 Q4,22 4.6,12 Q6,5.6 16,5 Q26,5.6 27.4,12 Q28,22 16,27 Z", "#F4C6B4", 1) + [-8, -4.6, -1.6, 1.6, 4.6, 8].map((dx) => `<path d="M16,26 Q${16 + dx * 1.1},16 ${16 + dx * 1.3},6.6" fill="none" stroke="#D8907E" stroke-width="0.8"/>`).join("") + P("M12,27 L20,27 L18.6,29.4 L13.4,29.4 Z", "#E8A898", 0.8) + `<path d="M8,11 Q10,7.6 14,6.6" fill="none" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;
        case "rune":
          return P("M8,28 Q5,16 9,7 Q16,3.6 23,7 Q27,16 24,28 Q16,30 8,28 Z", "#8A8A9A", 1) + P("M10,26 Q8,16 11,9 Q16,6.4 21,9 Q24,16 22,26 Q16,27.6 10,26 Z", "#9E9EAE", 0) + `<path d="M16,10 L16,24 M16,14 L20,11 M16,18 L12,15 M13,22 L19,22" fill="none" stroke="#4FC8C0" stroke-width="1.6" stroke-linecap="round"/><path d="M16,10 L16,24 M16,14 L20,11 M16,18 L12,15 M13,22 L19,22" fill="none" stroke="#B8F0EA" stroke-width="0.6" stroke-linecap="round"/>`;
        case "cle":
          return `<g transform="translate(16 16) scale(0.82) rotate(-35) translate(-16 -16)">${E(16, 8, 5.4, 5.4, "#E2B44E", 1)}${E(16, 8, 2.4, 2.4, "#5A3A24", 0.8)}${P("M14.6,12.6 L17.4,12.6 L17.4,26 L14.6,26 Z", "#E2B44E", 1)}${P("M17.4,20 L21,20 L21,22.4 L17.4,22.4 Z M17.4,24 L20,24 L20,26 L17.4,26 Z", "#E2B44E", 0.8)}<path d="M12.6,5.6 Q14,4 16,3.8" fill="none" stroke="#FFF2B8" stroke-width="1" stroke-linecap="round"/>${E(16, 8, 0.8, 0.8, "#4FC8C0")}</g>`;
        case "piece":
          return E(16, 17, 11, 10.4, "#C8962A", 1) + E(16, 16, 11, 10.4, "#F2C94C", 1) + E(16, 16, 8, 7.6, "none").replace('fill="none"', 'fill="none" stroke="#C8962A" stroke-width="0.8"') + `<path d="M10,16 Q11,11 16,11 Q21,11 22,16 Q18,15 16,19 Q14,15 10,16 Z" fill="#E2A030" stroke="#B8862A" stroke-width="0.6"/>` + E(16, 13.6, 0.9, 0.9, "#4FC8C0") + `<path d="M9,10.6 Q11,8 14,7.4" fill="none" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>`;
      }
      return "";
    }
    __name(trouvaille, "trouvaille");
    var trouvailleAnimee = /* @__PURE__ */ __name((k) => trouvaille(k) + brille(9, 9, 2.4, 2.6, 0) + brille(24, 20, 1.6, 2.6, 1.2), "trouvailleAnimee");
    function apparait(k, i) {
      const c = TROUVAILLES[k], sc = [0.35, 1.18, 0.96, 1][i], dy = [5, -2, 0.5, 0][i], ray = [0.5, 1, 0.7, 0.35][i];
      let s = "";
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4 + i * 0.12, l = 9 + ray * 6;
        s += `<path d="M${f(16 + Math.cos(a - 0.1) * 5)},${f(16 + Math.sin(a - 0.1) * 5)} L${f(16 + Math.cos(a) * l)},${f(16 + Math.sin(a) * l)} L${f(16 + Math.cos(a + 0.1) * 5)},${f(16 + Math.sin(a + 0.1) * 5)} Z" fill="${c.eclat}" opacity="${f(0.55 * ray)}"/>`;
      }
      return s + `<g transform="translate(16 ${f(16 + dy)}) scale(${sc}) translate(-16 -16)">${trouvaille(k)}</g>` + (i === 1 ? etoile(25, 6, 2.4) : "");
    }
    __name(apparait, "apparait");
    var ALV = [11.6, 25.2, 38.8, 52.4];
    function coffret(n, anim = true) {
      const p = `cf${n}`;
      let s = `<defs>${lin(p + "b", [[0, "#D89A60"], [0.5, "#B07A4A"], [1, "#7E5230"]])}${lin(p + "c", [[0, "#9A6440"], [1, "#6A3E22"]])}${rad(p + "v", [[0, "#B85068"], [0.6, "#8A3A4A"], [1, "#5A2030"]], 0.5, 0.3, 0.8)}${lin(p + "o", [[0, "#FFF2B8"], [0.5, "#F2C94C"], [1, "#B8862A"]])}${rad(p + "a", [[0, "#3A0E1A"], [0.7, "#5A2030"], [1, "#8A3A4A"]], 0.5, 0.35, 0.7)}</defs>`;
      s += E(32, 45.6, 29, 2.2, "rgba(60,40,20,.22)");
      s += P("M5,22 L9,4.4 Q32,0.4 55,4.4 L59,22 Z", `url(#${p}c)`, 1.1);
      s += P("M9.4,21 L12.4,7.6 Q32,4.4 51.6,7.6 L54.6,21 Z", `url(#${p}v)`, 0.8) + L("M12.4,7.6 Q32,4.4 51.6,7.6", `url(#${p}o)`, 1.1);
      s += `<defs><clipPath id="${p}q"><path d="M9.4,21 L12.4,7.6 Q32,4.4 51.6,7.6 L54.6,21 Z"/></clipPath></defs><g clip-path="url(#${p}q)">`;
      for (let k = -4; k <= 8; k++) s += L(`M${f(k * 7)},24 L${f(k * 7 + 16)},2 M${f(k * 7 + 16)},24 L${f(k * 7)},2`, "#5A2030", 0.45, ' opacity=".55"');
      for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
        const x = 4 + c * 7 + r % 2 * 3.5, y = 23.2 - r * 7.3 - 2.6;
        s += E(x, y, 0.75, 0.7, "#E890A8", 0.3);
      }
      s += "</g>" + L("M12.4,7.6 Q32,4.4 51.6,7.6", `url(#${p}o)`, 1.1);
      s += L("M10,6.4 Q32,1.8 54,6.4", "#C8925A", 0.8, ' opacity=".8"');
      s += P("M3,20.6 L61,20.6 L59.4,30.4 L4.6,30.4 Z", `url(#${p}v)`, 1);
      for (const x of ALV) s += E(x, 26.2, 6, 3.3, `url(#${p}o)`, 0.6) + E(x, 26.4, 4.9, 2.5, `url(#${p}a)`);
      const gem = ["quartz", "amethyste", "rubis", "diamant"];
      for (let i = 0; i < n; i++) {
        const x = ALV[i];
        s += `<defs><clipPath id="${p}k${i}"><path d="M${x - 7},-2 L${x + 7},-2 L${x + 7},26.6 Q${x},29.8 ${x - 7},26.6 Z"/></clipPath></defs>`;
        s += `<g clip-path="url(#${p}k${i})"><g transform="translate(${x} 27.6) scale(0.5) translate(-16 -27)">${FI.gemme(gem[i], `${p}g${i}`)}</g></g>`;
        s += E(x, 27.8, 5.2, 1.2, "rgba(40,10,20,.35)");
        s += `<path d="M${x - 6},26.2 Q${x},30.4 ${x + 6},26.2" fill="none" stroke="${OUT}" stroke-width="0.6"/><path d="M${x - 5.5},26.5 Q${x},29.8 ${x + 5.5},26.5" fill="none" stroke="#FFE8A0" stroke-width="1"/>`;
        s += anim ? brille(x + 4, 15.6 - i % 2 * 2, 2, 2.2, i * 0.5) : etoile(x + 4, 15.6 - i % 2 * 2, 2);
      }
      s += P("M3,30 L61,30 L59.6,42.6 Q32,45.6 4.4,42.6 Z", `url(#${p}b)`, 1.1);
      s += L("M6,35 q3,-0.8 6,0 t6,0 t6,0 M38,37.6 q3,-0.8 6,0 t6,0 t6,0 M8,40.6 q3,-0.6 6,0 t6,0", "#8A5A32", 0.5, ' opacity=".7"');
      s += P("M2.6,29 L61.4,29 L61.2,32 L2.8,32 Z", `url(#${p}o)`, 0.8) + L("M4,29.9 L60,29.9", "#FFFBE0", 0.6, ' opacity=".8"');
      for (const [x, sx] of [[4.4, 1], [59.6, -1]]) s += `<g transform="translate(${x} 42.4) scale(${sx} 1)">${P("M0,0 L0,-5 Q0.6,-1 5,0.6 Q2,1.8 0,0 Z", `url(#${p}o)`, 0.6)}${E(1, -1, 0.5, 0.5, "#FFFBE0")}</g>`;
      s += `<g transform="translate(32 37.4)">${P("M-5.6,-4 L5.6,-4 L5.6,1 Q5.6,4.4 0,6.4 Q-5.6,4.4 -5.6,1 Z", `url(#${p}o)`, 0.8)}${P("M0,-2.4 L2.4,0.6 L0,3.6 L-2.4,0.6 Z", "#E8506A", 0.5)}${E(-0.7, -0.4, 0.6, 0.4, WHITE)}</g>`;
      return s;
    }
    __name(coffret, "coffret");
    var etoileBilan = /* @__PURE__ */ __name((pleine, k = 2) => {
      const sc = [0.4, 1.12, 1][k];
      const d = "M16,3 L19.6,11.6 L29,12.4 L21.8,18.4 L24,27.6 L16,22.8 L8,27.6 L10.2,18.4 L3,12.4 L12.4,11.6 Z";
      return pleine ? `<g transform="translate(16 16) scale(${sc}) translate(-16 -16)">${P(d, "#FFD24A", 1.1)}<path d="M12.4,11.6 L16,4.6" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/></g>` + (k === 1 ? [0, 1, 2, 3, 4, 5].map((i) => {
        const a = i * 1.047;
        return `<path d="M${f(16 + Math.cos(a) * 13)},${f(16 + Math.sin(a) * 13)} L${f(16 + Math.cos(a) * 15.6)},${f(16 + Math.sin(a) * 15.6)}" stroke="#FFE07A" stroke-width="1.4" stroke-linecap="round"/>`;
      }).join("") : "") : P(d, "#8A8478", 1).replace("/>", ' opacity=".55"/>');
    }, "etoileBilan");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var BLOC = [0, 0, 32, 32];
    var LARGE = [-8, -8, 48, 48];
    for (const c of Object.keys(COUCHES)) piece(`fond-${c}`, `Le fond de la paroi, ${COUCHES[c].nom} (se répète${c === "profond" ? " ; les cristaux luisent" : ""})`, [0, 0, 48, 48], () => fond(c));
    piece("crete", "La crête en haut de la paroi (se répète en largeur)", [0, 0, 48, 14], crete);
    for (const m of ["bois", "or"]) {
      for (let k = 0; k < 3; k++) piece(`pioche-${m}_${k + 1}`, `La pioche ${METAUX[m].nom} (levée, l'élan, le coup)`, BLOC, () => pioche(m, k), `pioche-${m}`, 90);
      for (let k = 0; k < 3; k++) piece(`coup-${m}_${k + 1}`, `Le coup de la pioche ${METAUX[m].nom} (${m === "bois" ? "copeaux" : "pluie d'étoiles"})`, LARGE, () => coup(m, k), `coup-${m}`, 70);
    }
    for (const k of Object.keys(TROUVAILLES)) {
      const nom = TROUVAILLES[k].nom, Nom = nom[0].toUpperCase() + nom.slice(1);
      piece(k, `${Nom} (son éclat passe, en boucle)`, BLOC, () => trouvailleAnimee(k));
      for (let i = 0; i < 4; i++) piece(`apparition-${k}_${i + 1}`, `${Nom.replace(/ \(.*/, "")} qui apparaît`, BLOC, () => apparait(k, i), `apparition-${k}`, 110);
    }
    for (let n = 0; n <= 4; n++) piece(`coffret_${n}`, `Le coffret du bilan, ${n} pierre${n > 1 ? "s" : ""}${n ? " (elles brillent, en boucle)" : ""}`, [0, 0, 64, 48], () => coffret(n));
    piece("etoile_vide", "Une étoile du bilan, vide", BLOC, () => etoileBilan(false));
    for (let k = 0; k < 3; k++) piece(`etoile-gagnee_${k + 1}`, "Une étoile du bilan gagnée (elle claque)", BLOC, () => etoileBilan(true, k), "etoile-gagnee", 140);
    module.exports = { COUCHES, METAUX, TROUVAILLES, PIECES, fond, crete, pioche, coup, trouvaille, trouvailleAnimee, apparait, coffret, etoileBilan };
  }
});

// atelier/minijeu_filon_saisons.js
var require_minijeu_filon_saisons = __commonJS({
  "atelier/minijeu_filon_saisons.js"(exports, module) {
    var FI = require_minijeu_filon();
    var FP = require_minijeu_filon_plus();
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var L = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "L");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var FORME = "M5,3 L27,3 Q29.5,3 29.5,5.5 L29.5,26.5 Q29.5,29 27,29 L5,29 Q2.5,29 2.5,26.5 L2.5,5.5 Q2.5,3 5,3 Z";
    var goutte = /* @__PURE__ */ __name((p, x, y, r) => P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.1)},${f(y - r * 0.2)} ${f(x + r)},${f(y + r * 0.3)} Q${f(x + r)},${f(y + r)} ${f(x)},${f(y + r)} Q${f(x - r)},${f(y + r)} ${f(x - r)},${f(y + r * 0.3)} Q${f(x - r * 1.1)},${f(y - r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, `url(#${p}g)`, 0.5) + E(x - r * 0.35, y - r * 0.15, r * 0.25, r * 0.38, WHITE), "goutte");
    var defGoutte = /* @__PURE__ */ __name((p) => rad(p + "g", [[0, "#DFF6FF"], [0.5, "#7EC8F0"], [1, "#3E8AC0"]], 0.4, 0.4, 0.7), "defGoutte");
    function lanterne(allumee, anim = true) {
      const p = allumee ? "lta" : "lte";
      let s = `<defs>${lin(p + "m", [[0, "#F2D07A"], [0.5, "#C89A3A"], [1, "#8A6020"]], 1, 0)}${rad(p + "v", allumee ? [[0, "#FFFBE0"], [0.45, "#FFE08A"], [1, "#F2A84A"]] : [[0, "#A8A49C"], [1, "#6E6A64"]], 0.5, 0.55, 0.65)}${rad(p + "h", [[0, "#FFE8A0"], [1, "#FFE8A0"]], 0.5, 0.5, 0.5)}${lin(p + "f", [[0, "#FFF2B8"], [0.5, "#FFB040"], [1, "#E8642A"]])}</defs>`;
      if (allumee) s += `<circle cx="16" cy="17" r="14" fill="#FFD27A" opacity=".2">${anim ? '<animate attributeName="r" values="12.5;14.5;12.5" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".16;.28;.16" dur="1.2s" repeatCount="indefinite"/>' : ""}</circle>`;
      s += L("M12.4,4.6 Q16,0.4 19.6,4.6", OUT, 2.2) + L("M12.4,4.6 Q16,0.4 19.6,4.6", `url(#${p}m)`, 1.1);
      s += P("M10.6,8.6 Q11,5.4 16,5 Q21,5.4 21.4,8.6 Z", `url(#${p}m)`, 0.9) + E(16, 5, 1.2, 0.9, `url(#${p}m)`, 0.6);
      s += P("M10.6,9 L21.4,9 L20.6,23.6 L11.4,23.6 Z", `url(#${p}v)`, 1);
      if (allumee) s += `<g transform-origin="16 20.4">${anim ? '<animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.12;1.06 0.94;1 1" dur="0.7s" repeatCount="indefinite"/>' : ""}${P("M16,11.6 Q19.8,16 18.2,19.8 Q16,21.8 13.8,19.8 Q12.2,16 16,11.6 Z", `url(#${p}f)`, 0.6)}${E(16, 18.4, 1.1, 1.6, "#FFFBE0")}</g>`;
      else s += P("M15.2,17 L16.8,17 L16.6,21 L15.4,21 Z", "#E8E0D0", 0.5) + L("M16,15.6 q1.4,-2 0,-3.6 q-1.4,-1.8 0,-3.4", "#E2DED6", 0.9, ' opacity=".8"');
      s += L("M13.6,9.4 L13.2,23.2 M18.4,9.4 L18.8,23.2", `url(#${p}m)`, 1.1) + L("M11.8,10.4 L11.6,21", WHITE, 1, ' opacity=".55"');
      s += P("M9.8,23.4 L22.2,23.4 L21.4,27 Q16,28 10.6,27 Z", `url(#${p}m)`, 0.9) + L("M11,24.6 L21,24.6", "#FFF2B8", 0.7, ' opacity=".8"');
      return s;
    }
    __name(lanterne, "lanterne");
    function halo(k) {
      const a = [0.5, 1, 1, 0.4][k], r = [10, 15, 16, 17][k], p = `ha${k}`;
      let s = `<defs>${rad(p, [[0, "#FFF6C8"], [0.6, "#FFE08A"], [1, "#FFD24A"]], 0.5, 0.5, 0.5)}</defs>`;
      s += `<circle cx="16" cy="16" r="${r}" fill="url(#${p})" opacity="${f(0.4 * a)}"/>`;
      s += `<path d="${FORME}" fill="none" stroke="#FFD24A" stroke-width="2.6" opacity="${f(a)}"/><path d="${FORME}" fill="none" stroke="#FFFBE8" stroke-width="1" opacity="${f(a)}"/>`;
      return s + (k === 1 ? etoile(28, 4, 2.8) + etoile(4, 27, 2.2) : "") + (k === 2 ? etoile(27, 26, 2.2) + etoile(6, 5, 1.6) : "");
    }
    __name(halo, "halo");
    function humide(anim = true) {
      const p = "hu";
      let s = `<defs>${defGoutte(p)}${rad(p + "t", [[0, "#3E6A8A"], [1, "#2A4A6A"]], 0.4, 0.35, 0.7)}</defs>`;
      s += [[9, 10, 4.6, 3.2], [21, 19, 5.2, 3.6], [12, 23.4, 3.2, 2.2]].map(([x, y, rx, ry]) => E(x, y, rx, ry, `url(#${p}t)`).replace("/>", ' opacity=".32"/>') + L(`M${f(x - rx * 0.6)},${f(y - ry * 0.4)} Q${x},${f(y - ry * 0.9)} ${f(x + rx * 0.5)},${f(y - ry * 0.5)}`, "#DFF6FF", 0.7, ' opacity=".6"')).join("");
      s += goutte(p, 22.4, 8, 1.5) + goutte(p, 7.6, 18, 1.2) + goutte(p, 26, 24, 1);
      const chute = `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 9" keyTimes="0;0.6;1" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.8s" repeatCount="indefinite"/>' : ""}${goutte(p, 16, 25.6, 1.4)}</g>`;
      return s + chute;
    }
    __name(humide, "humide");
    function boue(coup) {
      const p = `bo${coup}`;
      let s = `<defs>${lin(p, [[0, "#9A7652"], [0.5, "#7A5A3A"], [1, "#4E3824"]])}${rad(p + "b", [[0, "#C8A078"], [0.6, "#8A6A48"], [1, "#5A4430"]], 0.35, 0.3, 0.8)}<clipPath id="${p}c"><path d="${FORME}"/></clipPath></defs><path d="${FORME}" fill="url(#${p})"/>`;
      s += `<g clip-path="url(#${p}c)">` + P("M2,10 Q8,13.4 13,10.4 Q18,7.4 23,11 Q27,13.4 30,10.6 L30,2 L2,2 Z", "#B8916A", 0).replace("/>", ' opacity=".75"/>') + L("M2,10 Q8,13.4 13,10.4 Q18,7.4 23,11 Q27,13.4 30,10.6", "#E8C89A", 0.8, ' opacity=".7"');
      s += [[9, 18, 2.4], [21, 21.6, 3], [14, 25.6, 1.8], [24.4, 14.6, 1.6]].map(([x, y, r]) => E(x, y, r, r * 0.75, `url(#${p}b)`, 0.6) + E(x - r * 0.35, y - r * 0.35, r * 0.35, r * 0.22, "#F2DCB8")).join("");
      s += L("M5,22 Q8,20.6 10,22.4 M18,27 Q20,25.6 22,27", "#3A2818", 0.6, ' opacity=".6"') + "</g>";
      s += L("M6,5 L14,5", "#F2DCB8", 1.1, ' opacity=".7"') + `<path d="${FORME}" fill="none"${st(1.1)}/>`;
      if (coup) s += L("M10,12.6 Q16,16.6 22,12.6 M16,15.4 L15.4,19 L16.6,22.4", "#2A1A0E", 1.2) + L("M10.6,13.6 Q16,17 21.4,13.6", "#C8A078", 0.4, ' opacity=".6"');
      return s;
    }
    __name(boue, "boue");
    function inonde(k) {
      const t = (k + 1) / 4, p = `in${k}`;
      let s = `<defs>${defGoutte(p)}${rad(p + "r", [[0, "#DFF6FF"], [0.7, "#7EC8F0"], [1, "#3E8AC0"]], 0.5, 0.5, 0.5)}</defs>`;
      if (k < 2) s += `<circle cx="16" cy="16" r="${f(5 + t * 10)}" fill="url(#${p}r)" opacity="${f(0.6 - t * 0.35)}"/><circle cx="16" cy="16" r="${f(5 + t * 10)}" fill="none" stroke="${WHITE}" stroke-width="1" opacity="${f(0.8 - t * 0.4)}"/>`;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let j = 0; j < 2; j++) {
        const d = 4 + t * 11 + j * 3;
        s += `<g opacity="${f(1 - t * 0.55)}">${goutte(p, 16 + dx * d + dy * (j ? 2 : -2), 16 + dy * d + dx * (j ? 2 : -2), f(1.9 - j * 0.5))}</g>`;
      }
      return s;
    }
    __name(inonde, "inonde");
    function eboule(k) {
      if (k === 0) return `<g transform="translate(-1.2 0) rotate(-3 16 16)">${FI.bloc(1, 0, "eb0")}</g>` + L("M-2,8 l-3,-1 M-2,20 l-3,1 M34,10 l3,-1 M34,22 l3,1", OUT, 1.1) + [[6, -2], [24, -4]].map(([x, y]) => E(x, y, 1, 0.8, "#C8B48E", 0.4)).join("");
      if (k === 1) return `<g transform="translate(1.2 1) rotate(3 16 16)">${FI.bloc(1, 2, "eb1")}</g>` + [[10, -3], [20, -5], [28, -1]].map(([x, y]) => E(x, y, 1.2, 0.9, "#C8B48E", 0.4)).join("");
      const t = (k - 1) / 2, p = `eb${k}`, R = FI.ROCHE[1];
      let s = `<defs>${lin(p, [[0, R.clair], [0.55, R.corps], [1, R.ombre]], 0.4, 1)}${rad(p + "p", [[0, "#F2E6CE"], [1, "#E2D2B4"]], 0.5, 0.5, 0.5)}</defs>`;
      for (let i = 0; i < 4; i++) s += E(4 + i * 8, 34 - t * 4, 5.4 + t * 2, 3.2, `url(#${p}p)`).replace("/>", ` opacity="${f(0.7 * (1 - t * 0.6))}"/>`);
      [[8, 10, -1, 1], [22, 9, 1, 0.9], [10, 22, -0.6, 1.1], [22, 22, 0.8, 0.8], [16, 16, 0, 1.2]].forEach(([x, y, dx, sc], i) => {
        s += `<g transform="translate(${f(x + dx * t * 6)} ${f(y + t * 9 + i)}) rotate(${f(i * 40 + t * 90)}) scale(${sc})" opacity="${f(1 - t * 0.45)}">${P("M-4,-3 Q-1,-4.4 3,-3.6 L4.4,2 Q1,4.4 -2,3.6 Z", `url(#${p})`, 0.8)}${L("M-3,-2.4 L1.6,-3", R.clair, 0.8, ' opacity=".9"')}${E(1, 1, 0.6, 0.4, R.grain)}</g>`;
      });
      return s;
    }
    __name(eboule, "eboule");
    function perdue(g, k) {
      const p = `pp${g}${k}`;
      let s = `<defs>${rad(p + "p", [[0, "#C8BEAA"], [1, "#8E8476"]], 0.5, 0.4, 0.6)}</defs><g transform="translate(0 ${k * 3}) rotate(${k * 8} 16 16)" opacity="${f(1 - k * 0.22)}">${FI.gemme(g, p)}`;
      if (k >= 1) s += `<g opacity="${f(0.22 * k)}">${FI.gemme(g, p + "x").replace(/fill="url\(#[^)]+\)"/g, `fill="url(#${p}p)"`).replace(/<defs>.*?<\/defs>/, "")}</g>`;
      if (k >= 2) s += L("M14,8 L17,14 L14.6,19 L17.4,25", OUT, 1.1) + L("M14.6,8.4 L17.4,14", WHITE, 0.4, ' opacity=".6"');
      s += "</g>";
      if (k >= 1) s += [[8, 24 + k * 2], [24, 22 + k * 2]].map(([x, y]) => E(x, y, 2 + k, 1.2, "#D8CCB4").replace("/>", ` opacity="${f(0.6 - k * 0.12)}"/>`)).join("");
      return s;
    }
    __name(perdue, "perdue");
    function page() {
      let s = `<defs>${lin("alC", [[0, "#8A4A2A"], [1, "#5E2E1A"]])}${rad("alP", [[0, "#FFF8E6"], [0.7, "#F4E8C8"], [1, "#E2D0A4"]], 0.5, 0.45, 0.75)}${lin("alS", [[0, "#F27A6A"], [1, "#B8302E"]])}${lin("alA", [[0, "#F2D07A"], [0.5, "#C89A3A"], [1, "#8A6020"]], 1, 0)}</defs>`;
      s += P("M1,3 Q56,-1 111,3 L111,78 Q56,82 1,78 Z", "url(#alC)", 1.2);
      s += P("M6,5 Q57,2.6 108,5 L108,76 Q57,78.4 6,76 Z", "url(#alP)", 0.8);
      s += L("M10,8 L10,73", "#E2D0A4", 0.6, ' stroke-dasharray="1.6 1.6"');
      s += [18, 40, 62].map((y) => `${E(5, y, 3.4, 2.2, "url(#alA)", 0.8)}${L(`M3,${y - 0.8} L6.4,${y - 1}`, "#FFF2B8", 0.6)}`).join("");
      s += [[108, 5, -1, 1], [108, 76, -1, -1]].map(([x, y, sx, sy]) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${P("M0,0 L7,0 L0,7 Z", "url(#alA)", 0.6)}${L("M1,1 L4.4,1", "#FFF2B8", 0.6)}</g>`).join("");
      s += P("M90,0 L98,0 L98,14 L94,11 L90,14 Z", "url(#alS)", 0.8) + L("M91.4,1 L91.4,11", WHITE, 0.6, ' opacity=".5"');
      return s;
    }
    __name(page, "page");
    var CASES = [[8, 8], [36, 8], [64, 8], [8, 42], [36, 42], [64, 42]].map(([x, y]) => [x + 4, y + 2]);
    function caseAlbum(k, etat) {
      const p = `ca${k}${etat}`;
      let s = `<defs>${lin(p, [[0, "#FFFBEE"], [1, "#F2E4C0"]])}</defs>`;
      if (etat === "vide") {
        s += `<rect x="3" y="3" width="26" height="26" rx="2" fill="#EADCB8" stroke="#B89E70" stroke-width="0.8" stroke-dasharray="2 1.4"/>`;
        s += `<g opacity=".25" transform="translate(16 16) scale(0.72) translate(-16 -16)">${FP.trouvaille(k).replace(/fill="(#[0-9A-Fa-f]{6}|url\([^)]+\))"/g, 'fill="#5A4A38"').replace(/stroke="#[0-9A-Fa-f]{6}"/g, 'stroke="#5A4A38"')}</g>`;
        return s;
      }
      s += `<rect x="3.6" y="4.2" width="26" height="26" rx="2" fill="#5A4030" opacity=".25"/><rect x="3" y="3" width="26" height="26" rx="2" fill="url(#${p})"${st(0.8)}/>`;
      s += `<g transform="translate(16 16) scale(0.78) translate(-16 -16)">${FP.trouvaille(k)}</g>`;
      s += [[3, 3, 0], [29, 3, 90], [29, 29, 180], [3, 29, 270]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P("M-0.4,-0.4 L4,-0.4 L-0.4,4 Z", "#E2CCA0", 0.4)}</g>`).join("");
      if (etat === "nouvelle") s += `<rect x="2.4" y="2.4" width="27.2" height="27.2" rx="2.4" fill="none" stroke="#FFD24A" stroke-width="1.8"/><rect x="2.4" y="2.4" width="27.2" height="27.2" rx="2.4" fill="none" stroke="#FFFBE8" stroke-width="0.6"/>` + etoile(28.6, 3.4, 3.2) + etoile(4.6, 27.6, 2.2);
      return s;
    }
    __name(caseAlbum, "caseAlbum");
    function medaillon(m, choisi) {
      const p = `md${m}${choisi ? "c" : ""}`;
      let s = `<defs>${lin(p + "r", choisi ? [[0, "#FFF2B8"], [0.5, "#FFD24A"], [1, "#C8901E"]] : [[0, "#E2C890"], [0.5, "#B89A5A"], [1, "#7A6038"]])}${rad(p + "f", choisi ? [[0, "#FFFDF2"], [0.7, "#FFF2C4"], [1, "#F2D88A"]] : [[0, "#D8C8A4"], [1, "#A8946E"]], 0.4, 0.35, 0.75)}</defs>`;
      s += E(16, 16.8, 14, 14, "#3C2819").replace("/>", ' opacity=".2"/>') + E(16, 16, 14, 14, `url(#${p}r)`, 1.1) + E(16, 16, 11.2, 11.2, `url(#${p}f)`, 0.8);
      s += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = i * Math.PI / 4 + Math.PI / 8;
        return E(16 + Math.cos(a) * 12.6, 16 + Math.sin(a) * 12.6, 0.7, 0.7, choisi ? "#FFFBE0" : "#E8D8A8", 0.3);
      }).join("");
      s += `<g transform="translate(16 16) scale(0.74) translate(-15.7 -21.15)">${FP.pioche(m, 0)}</g>`;
      s += L("M7.6,10 Q9.6,6.6 13.4,5.4", WHITE, 1.2, ' opacity=".6"');
      if (choisi) s += etoile(26.4, 5.6, 2.6) + etoile(5.6, 25.6, 1.8);
      else s += E(16, 16, 14, 14, "#3C2819").replace("/>", ' opacity=".15"/>');
      return s;
    }
    __name(medaillon, "medaillon");
    function change(m, k) {
      const sc = [0.4, 1.2, 0.95, 1][k];
      let s = `<g transform="translate(16 16) scale(${sc}) rotate(${[-90, 15, -6, 0][k]}) translate(-16 -16)">${medaillon(m, true)}</g>`;
      if (k === 1) s += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = i * 0.785;
        return L(`M${f(16 + Math.cos(a) * 17.6)},${f(16 + Math.sin(a) * 17.6)} L${f(16 + Math.cos(a) * 21.6)},${f(16 + Math.sin(a) * 21.6)}`, "#FFE07A", 1.8);
      }).join("") + etoile(-4, 2, 2.4) + etoile(36, 30, 2);
      if (k === 2) s += etoile(30, 0, 2.2) + etoile(0, 32, 1.8);
      return s;
    }
    __name(change, "change");
    function monte(h, k) {
      const dy = [24, 12, -2, 0][k], p = `mo${h}${k}`;
      let s = `<defs><clipPath id="${p}c"><rect x="-4" y="-4" width="40" height="36"/></clipPath>${rad(p + "p", [[0, "#F2E6CE"], [1, "#D8C8A8"]], 0.5, 0.5, 0.5)}</defs><g clip-path="url(#${p}c)"><g transform="translate(0 ${dy})">${FI.bloc(h, 0, p + "b")}</g></g>`;
      if (k < 3) s += [6, 16, 26].map((x) => E(x, 31, 3.4 + k, 1.8, `url(#${p}p)`).replace("/>", ` opacity="${f(0.8 - k * 0.22)}"/>`)).join("") + [[4, 27 - k * 3], [28, 26 - k * 3]].map(([x, y]) => E(x, y, 0.9, 0.7, "#C8B48E", 0.3)).join("");
      if (k === 2) s += etoile(28, 4, 1.8);
      return s;
    }
    __name(monte, "monte");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var BLOC = [0, 0, 32, 32];
    var LARGE = [-8, -8, 48, 48];
    var DURETES = { 1: "tendre", 2: "dur", 3: "tres-dur" };
    piece("lanterne", "La lanterne allumée (la flamme danse, en boucle)", BLOC, () => lanterne(true));
    piece("lanterne_eteinte", "La lanterne éteinte (une charge utilisée)", BLOC, () => lanterne(false));
    for (let k = 0; k < 4; k++) piece(`halo_${k + 1}`, "Le halo de la lanterne sur un bloc voisin du filon (1 seconde)", LARGE, () => halo(k), "halo", 250);
    piece("humide", "Le bloc humide (par-dessus le bloc ; une goutte tombe, en boucle)", BLOC, () => humide());
    piece("boue", "La boue (2 coups)", BLOC, () => boue(0));
    piece("boue_fissure-1", "La boue, après 1 coup", BLOC, () => boue(1));
    for (let k = 0; k < 4; k++) piece(`inondation_${k + 1}`, "La poche d'eau qui crève", LARGE, () => inonde(k), "inondation", 80);
    for (let k = 0; k < 4; k++) piece(`eboulement_${k + 1}`, "Un bloc de la colonne qui s'éboule", LARGE, () => eboule(k), "eboulement", 90);
    for (const g of Object.keys(FI.GEMMES)) for (let k = 0; k < 4; k++) piece(`perdue-${g}_${k + 1}`, `La pierre perdue dans l'éboulement (${FI.GEMMES[g].nom})`, BLOC, () => perdue(g, k), `perdue-${g}`, 110);
    piece("album", "La page de l'album des trouvailles (six cases)", [0, 0, 112, 80], page);
    for (const k of Object.keys(FP.TROUVAILLES)) for (const etat of ["vide", "plein", "nouvelle"]) piece(`album-${k}${etat === "plein" ? "" : "_" + etat}`, `Une case de l'album : ${FP.TROUVAILLES[k].nom}${etat === "vide" ? ", à trouver" : etat === "nouvelle" ? ", nouvelle" : ""}`, BLOC, () => caseAlbum(k, etat));
    for (const m of ["bois", "fer", "or"]) {
      piece(`outil-${m}`, `Le médaillon de la pioche ${FP.METAUX[m].nom}`, BLOC, () => medaillon(m, false));
      piece(`outil-${m}_choisi`, `Le médaillon de la pioche ${FP.METAUX[m].nom}, choisi`, BLOC, () => medaillon(m, true));
      for (let k = 0; k < 4; k++) piece(`outil-change-${m}_${k + 1}`, `On prend la pioche ${FP.METAUX[m].nom}`, LARGE, () => change(m, k), `outil-change-${m}`, 80);
    }
    for (const h of [1, 2, 3]) for (let k = 0; k < 4; k++) piece(`monte-${DURETES[h]}_${k + 1}`, `Un bloc ${FI.ROCHE[h].nom.split(" (")[0]} qui monte (la rangée qui apparaît en bas)`, BLOC, () => monte(h, k), `monte-${DURETES[h]}`, 70);
    var LISEZ_MOI = "Nouvelle version (design/conception/minijeux_grille.md) : la lanterne et le bloc humide, la boue, la pierre perdue, le médaillon d'un outil et le bloc qui monte ont le cadre d'un bloc (32 × 32) ; le bloc humide se pose par-dessus le bloc. Le halo, la poche qui crève, l'éboulement et le changement d'outil : 48 × 48 centrés sur le bloc. L'album : la page (112 × 80) et, par-dessus, six cases (32 × 32) en x = 12, 40, 68 et y = 10, 44.";
    module.exports = { PIECES, LISEZ_MOI, lanterne, halo, humide, boue, inonde, eboule, perdue, page, CASES, caseAlbum, medaillon, change, monte };
  }
});

// atelier/minijeu_peche.js
var require_minijeu_peche = __commonJS({
  "atelier/minijeu_peche.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${x},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${y} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${x},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${y} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${x},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var POISSONS = {
      gardon: { dos: "#6E8EB0", corps: "#B8CCE0", ventre: "#F2F6FA", nageoire: "#E8604A", nom: "gardon" },
      truite: { dos: "#6E8A52", corps: "#A8BE7A", ventre: "#F4EED8", nageoire: "#9AAE6A", raie: "#F0909A", nom: "truite" },
      dore: { dos: "#E2A030", corps: "#FFD25A", ventre: "#FFF4C0", nageoire: "#F28A3A", nom: "doré" }
    };
    function poisson(sorte, k, id) {
      const c = POISSONS[sorte], a = Math.sin(k / 4 * 2 * Math.PI), bend = a * 1.2;
      const corps = `M33,12 Q32,4.6 22,4.4 Q12,4.6 8.6,${f(10 + bend * 0.3)} Q8,12 8.6,${f(14 + bend * 0.3)} Q12,19.6 22,19.6 Q32,19.4 33,12 Z`;
      const g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.dos}"/><stop offset=".5" stop-color="${c.corps}"/><stop offset="1" stop-color="${c.ventre}"/></linearGradient><clipPath id="${id}c"><path d="${corps}"/></clipPath></defs>`;
      let s = g;
      s += `<g transform="rotate(${f(a * 16)} 9 12)">${P("M9.6,12 Q5,7 1.6,5.2 Q3.4,12 1.6,18.8 Q5,17 9.6,12 Z", c.nageoire, 0.9)}<path d="M4.6,9 L8,11.4 M4.6,15 L8,12.6" stroke="${OUT}" stroke-width="0.4" opacity=".5"/></g>`;
      s += P(`M17,5.4 Q21,${f(0.8 + a * 0.4)} 26,4.8 Z`, c.nageoire, 0.8);
      s += P(corps, `url(#${id})`, 1);
      s += `<g clip-path="url(#${id}c)">` + [14, 18, 22, 26].map((x) => `<path d="M${x},7 q2,3 0,6 q2,3 0,6" fill="none" stroke="${WHITE}" stroke-width="0.5" opacity=".45"/>`).join("") + (c.raie ? `<path d="M9,12.4 Q20,10 33,11.4" fill="none" stroke="${c.raie}" stroke-width="2.4" opacity=".75"/>` + [[15, 8], [20, 7.2], [25, 8.4], [18, 15.4], [24, 15.8]].map(([x, y]) => E(x, y, 0.6, 0.6, "#4E6A3A")).join("") : "") + `<path d="M10,8 Q20,5.6 30,7.4" fill="none" stroke="${WHITE}" stroke-width="1" opacity=".55"/></g>`;
      s += `<g transform="rotate(${f(-a * 22)} 24 16.4)">${P("M24,16.4 Q22,20.6 19,20.2 Q21,18 22,16.2 Z", c.nageoire, 0.7)}</g>`;
      s += `<path d="M27.6,8.6 Q25.6,12 27.6,15.4" fill="none" stroke="${c.dos}" stroke-width="0.8"/>`;
      s += E(29.6, 10.4, 2, 2.3, "#2A2420") + E(30.2, 9.5, 0.8, 0.8, WHITE) + E(29.1, 11.4, 0.35, 0.35, WHITE) + E(28.8, 14.2, 1.3, 0.7, "#F29E9A").replace("/>", ' opacity=".7"/>');
      s += `<path d="M32.4,13.2 Q33.3,13.7 32.6,14.4" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/>`;
      if (sorte === "dore") s += etoile(f(14 + k * 3), 6, k % 2 ? 1.6 : 2.2) + etoile(35.5, f(5 + k % 2), k % 2 ? 1.3 : 0.7);
      return s;
    }
    __name(poisson, "poisson");
    function botte(k) {
      const a = Math.sin(k / 4 * 2 * Math.PI);
      let s = `<g transform="rotate(${f(a * 6)} 20 13)">`;
      s += P("M12,3.4 L22,3.4 L22.6,13 Q30,13.4 33.4,16.4 Q34.4,19.6 31,20.2 L11.4,20.2 Q10,20 10.4,17.6 L12,3.4 Z", "#8A5A3A", 1);
      s += P("M10.6,18 L33.6,18.4 Q34,20.4 31,20.6 L11.2,20.6 Q10.2,20.4 10.6,18 Z", "#5A3A24", 0.8);
      s += P("M11.6,3 L22.4,3 L22.4,5 L11.6,5 Z", "#6E4A30", 0.8);
      s += `<path d="M14,8 L20,8 M14,10.6 L20,10.6 M14.4,13 L20.4,13" stroke="#E8D8B8" stroke-width="0.7" stroke-linecap="round"/>`;
      s += `<path d="M24,14.4 Q28,14.6 30.6,16.4" fill="none" stroke="#B07A50" stroke-width="0.9" stroke-linecap="round"/>`;
      s += `<path d="M14,3 Q${f(12 + a * 2)},${-1} ${f(15 + a * 2)},-3.4" fill="none" stroke="#5E9A3C" stroke-width="1.6" stroke-linecap="round"/>`;
      s += `</g><circle cx="${f(17 + k)}" cy="${f(2 - k * 0.6)}" r="${f(0.9 + k * 0.15)}" fill="none" stroke="#DDF2FF" stroke-width="0.6" opacity="${f(1 - k * 0.22)}"/>`;
      return s;
    }
    __name(botte, "botte");
    function ferre(sorte, k, id) {
      if (sorte === "botte") return `<path d="M12,0 L12,8" stroke="#E8E4DC" stroke-width="0.6"/><g transform="translate(12 8) rotate(${k ? 9 : -9}) scale(0.7) translate(-17 -3.4)">${botte(0)}</g>` + [0, 1, 2].map((i) => `<circle cx="${f(9 + i * 3 + k)}" cy="${f(28 + i * 3 + k * 2)}" r="0.8" fill="#BFE6FF"/>`).join("");
      return `<path d="M12,0 L12,5.4" stroke="#E8E4DC" stroke-width="0.6"/><g transform="translate(12 22) rotate(${k ? 98 : 82}) translate(-21 -12)">${poisson(sorte, k ? 1 : 3, id)}</g><path d="M${k ? 3 : 21},12 l${k ? -2 : 2},-1.4 M${k ? 3.4 : 20.6},16 l${k ? -2.4 : 2.4},0" stroke="${WHITE}" stroke-width="0.9" stroke-linecap="round" opacity=".85"/>`;
    }
    __name(ferre, "ferre");
    function bouchon(etat, k) {
      const dy = etat === "flotte" ? [0, 1][k] : [2, 6, 3][k], tilt = etat === "flotte" ? [-4, 4][k] : [0, 12, -8][k];
      let s = "";
      if (etat === "touche") s += [0, 1].map((i) => E(8, 17.4, 4 + k * 2.2 + i * 2.6, 1.2 + k * 0.5 + i * 0.6, "none").replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="0.7" opacity="${f(0.9 - k * 0.2 - i * 0.3)}"`)).join("");
      s += `<g transform="translate(0 ${dy}) rotate(${tilt} 8 14)"><path d="M8,1 L8,7" stroke="${OUT}" stroke-width="1.2" stroke-linecap="round"/><path d="M8,1 L8,7" stroke="#F2C04B" stroke-width="0.5" stroke-linecap="round"/>` + P("M8,6.4 Q12.6,10 12.4,13.6 L3.6,13.6 Q3.4,10 8,6.4 Z", "#E8504A", 0.9) + P("M3.6,13.6 L12.4,13.6 Q12.4,18.4 8,19.4 Q3.6,18.4 3.6,13.6 Z", "#FFFFFF", 0.9) + E(6.4, 10.4, 1, 1.4, WHITE).replace("/>", ' opacity=".7"/>') + `</g>`;
      s += E(8, 17.4 + (etat === "touche" && k === 1 ? 1 : 0), 5.4, 1.1, "#5A9AC8").replace("/>", ' opacity=".35"/>');
      return s;
    }
    __name(bouchon, "bouchon");
    var hamecon = /* @__PURE__ */ __name(() => `<path d="M4,0 L4,7.4 Q4,10.6 6.4,10 Q7.6,9.4 7,7.6" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M4,0 L4,7.4 Q4,10.6 6.4,10 Q7.6,9.4 7,7.6" fill="none" stroke="#C8D0D8" stroke-width="0.7" stroke-linecap="round"/><path d="M7,7.6 L6.2,6.8" stroke="#C8D0D8" stroke-width="0.7"/>`, "hamecon");
    function eclabousse(k) {
      const t = (k + 1) / 4;
      let s = E(16, 21, 6 + t * 8, 1.6 + t * 1.2, "none").replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="${f(1.4 - t)}" opacity="${f(1 - t * 0.7)}"`);
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI * (0.12 + 0.76 * i / 6), d = 3 + t * 11, h = Math.sin(t * Math.PI) * 9;
        const x = 16 + Math.cos(a) * d, y = 20 + Math.sin(a) * h * (i % 2 ? 0.7 : 1);
        s += P(`M${f(x)},${f(y - 2)} Q${f(x + 1.4)},${f(y + 0.2)} ${f(x)},${f(y + 1.2)} Q${f(x - 1.4)},${f(y + 0.2)} ${f(x)},${f(y - 2)} Z`, "#BFE6FF", 0.6).replace("/>", ` opacity="${f(1 - t * 0.6)}"/>`);
      }
      if (k < 2) s += P(`M10,20 Q12,${f(12 - k * 3)} 16,${f(10 - k * 4)} Q20,${f(12 - k * 3)} 22,20 Z`, "#DDF2FF", 0.7).replace("/>", ' opacity=".9"/>');
      return s;
    }
    __name(eclabousse, "eclabousse");
    var ronds = /* @__PURE__ */ __name((k) => [0, 1].map((i) => E(16, 6, 4 + k * 4 + i * 4, 1.4 + k * 1.2 + i * 1.1, "none").replace('fill="none"', `fill="none" stroke="#DDF2FF" stroke-width="0.8" opacity="${f(0.9 - k * 0.25 - i * 0.3)}"`)).join(""), "ronds");
    var bulles = /* @__PURE__ */ __name((k) => [[4, 16, 1.4, 0], [8, 12, 1, 0.33], [5, 8, 0.8, 0.66]].map(([x, y, r, o]) => {
      const u = (k / 3 + o) % 1;
      return `<circle cx="${f(x + Math.sin(u * 6.3))}" cy="${f(y - u * 10 + 2)}" r="${r}" fill="#DDF2FF" fill-opacity=".35" stroke="#DDF2FF" stroke-width="0.6" opacity="${f(1 - u * 0.6)}"/><circle cx="${f(x + Math.sin(u * 6.3) - r * 0.35)}" cy="${f(y - u * 10 + 2 - r * 0.35)}" r="${f(r * 0.3)}" fill="${WHITE}"/>`;
    }).join(""), "bulles");
    function couloir(k) {
      let s = `<defs><linearGradient id="pe${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC4E8"/><stop offset="1" stop-color="#4C94C8"/></linearGradient></defs><rect x="0" y="0" width="64" height="20" fill="url(#pe${k})"/>`;
      for (const [y, a, o] of [[4, 1, 0], [10, 0.8, 0.5], [16, 1, 0.25]]) {
        const dx = (k / 3 + o) % 1 * 16;
        let d = "";
        for (let x = -16; x < 80; x += 16) d += `M${f(x + dx)},${y} q4,-${a} 8,0 `;
        s += `<path d="${d}" fill="none" stroke="#D8F0FF" stroke-width="0.8" stroke-linecap="round" opacity=".7"/>`;
      }
      return s + `<rect x="0" y="0" width="64" height="1.4" fill="#2E6E9E" opacity=".35"/><rect x="0" y="18.6" width="64" height="1.4" fill="#2E6E9E" opacity=".45"/>`;
    }
    __name(couloir, "couloir");
    function ponton() {
      let s = "";
      for (let i = 0; i < 4; i++) {
        const x = i * 16;
        s += `<rect x="${x}" y="2" width="16" height="11" fill="${i % 2 ? "#C69460" : "#B98552"}"/><path d="M${x + 2},6 q6,-1 12,0 M${x + 3},10 q5,1 10,0" fill="none" stroke="#8A5A32" stroke-width="0.5" opacity=".7"/>` + E(x + 2.4, 4.4, 0.6, 0.6, "#5A3A24") + E(x + 13.6, 4.4, 0.6, 0.6, "#5A3A24");
      }
      return s + `<path d="M0,2 L64,2 M0,13 L64,13 M16,2 L16,13 M32,2 L32,13 M48,2 L48,13" stroke="${OUT}" stroke-width="0.9"/><rect x="0" y="13" width="64" height="3" fill="#7A5230"/><path d="M0,2.8 L64,2.8" stroke="#E2B880" stroke-width="0.7" opacity=".7"/>`;
    }
    __name(ponton, "ponton");
    function seau(plein) {
      let s = P("M3.4,9 L20.6,9 L18.6,22 Q12,23.4 5.4,22 Z", "#A8B4C0", 1) + `<path d="M4.6,13 L19.4,13 M5.2,18 L18.8,18" stroke="#7C8C99" stroke-width="0.8"/><path d="M6,10.4 L7,20" stroke="${WHITE}" stroke-width="1" opacity=".5" stroke-linecap="round"/>`;
      s += E(12, 9, 8.6, 2, plein ? "#5A9AC8" : "#4E5C68", 1);
      if (plein) {
        const prise = /* @__PURE__ */ __name((x, y, rot, miroir, sorte, id) => `<g transform="translate(${x} ${y}) scale(${miroir ? -0.4 : 0.4} 0.4) rotate(${rot}) translate(-21 -12)">${poisson(sorte, 1, id)}</g>`, "prise");
        s += `<clipPath id="sqc"><rect x="3.4" y="-2" width="17.2" height="11.4"/></clipPath><g clip-path="url(#sqc)">${prise(9.4, 6.4, -64, false, "truite", "sq1")}${prise(14.8, 6, -66, true, "dore", "sq2")}</g>`;
        s += E(9.4, 9.3, 1.7, 0.45, "none").replace('fill="none"', 'fill="none" stroke="#DDF2FF" stroke-width="0.4"') + E(14.8, 9.3, 1.7, 0.45, "none").replace('fill="none"', 'fill="none" stroke="#DDF2FF" stroke-width="0.4"');
      }
      return s + `<path d="M3.6,9 Q12,-1 20.4,9" fill="none" stroke="${OUT}" stroke-width="1.4"/><path d="M3.6,9 Q12,-1 20.4,9" fill="none" stroke="#C8D0D8" stroke-width="0.6"/>`;
    }
    __name(seau, "seau");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var NOMS = { gardon: "Le gardon", truite: "La truite", dore: "Le doré", botte: "La vieille botte" };
    for (const s of ["gardon", "truite", "dore"]) for (let k = 0; k < 4; k++) piece(`nage-${s}_${k + 1}`, `${NOMS[s]} qui nage`, [0, 0, 40, 24], () => poisson(s, k, `pn${s}${k}`), `nage-${s}`, 120, true);
    for (let k = 0; k < 4; k++) piece(`nage-botte_${k + 1}`, "La vieille botte qui dérive", [0, 0, 40, 24], () => botte(k), "nage-botte", 160, true);
    for (const s of ["gardon", "truite", "dore", "botte"]) for (let k = 0; k < 2; k++) piece(`ferre-${s}_${k + 1}`, `${NOMS[s]} ferré${s === "truite" || s === "botte" ? "e" : ""} au bout de la ligne`, [0, 0, 24, 40], () => ferre(s, k, `pf${s}${k}`), `ferre-${s}`, 140, true);
    for (let k = 0; k < 2; k++) piece(`bouchon-flotte_${k + 1}`, "Le bouchon qui flotte", [0, 0, 16, 24], () => bouchon("flotte", k), "bouchon-flotte", 400, true);
    for (let k = 0; k < 3; k++) piece(`bouchon-touche_${k + 1}`, "Le bouchon qui plonge (ça mord)", [0, 0, 16, 24], () => bouchon("touche", k), "bouchon-touche", 120);
    piece("hamecon", "L'hameçon", [0, 0, 8, 12], hamecon);
    for (let k = 0; k < 4; k++) piece(`eclaboussure_${k + 1}`, "L'éclaboussure", [0, 0, 32, 24], () => eclabousse(k), "eclaboussure", 90);
    for (let k = 0; k < 3; k++) piece(`ronds_${k + 1}`, "Les ronds dans l'eau", [0, 0, 32, 12], () => ronds(k), "ronds", 160);
    for (let k = 0; k < 3; k++) piece(`bulles_${k + 1}`, "Les bulles", [0, 0, 12, 20], () => bulles(k), "bulles", 200, true);
    for (let k = 0; k < 3; k++) piece(`couloir_${k + 1}`, "Le couloir d'eau (se répète en largeur)", [0, 0, 64, 20], () => couloir(k), "couloir", 220, true);
    piece("ponton", "Les planches du ponton (se répètent en largeur)", [0, 0, 64, 16], ponton);
    piece("seau_vide", "Le seau, vide", [0, 0, 24, 24], () => seau(false));
    piece("seau_plein", "Le seau, plein", [0, 0, 24, 24], () => seau(true));
    var TITRE = "La Pêche (le Ponton)";
    var FOND = "#4C94C8";
    var LISEZ_MOI = "La Pêche : le jeu dessine sur un canvas, tout ce qui bouge est en suites d'images (boucle : vrai, à répéter ; sinon une fois). Les prises nagent vers la droite (retourner l'image pour l'autre sens) ; ferrées, elles pendent tête en bas, la ligne en haut au milieu. Le couloir d'eau et le ponton se répètent en largeur.";
    module.exports = { POISSONS, PIECES, TITRE, FOND, LISEZ_MOI, poisson, botte, ferre, bouchon, hamecon, eclabousse, ronds, bulles, couloir, ponton, seau };
  }
});

// atelier/minijeu_cueillette.js
var require_minijeu_cueillette = __commonJS({
  "atelier/minijeu_cueillette.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var FEUILLES = [[18, 36, 13, "#4E8F3A"], [42, 36, 13, "#4E8F3A"], [30, 25, 15, "#5FA548"], [23, 40, 12, "#68B04F"], [38, 41, 11, "#5FA548"]];
    function buisson(secoue = 0, vide = false) {
      const a = [0, -5, 4, -2][secoue];
      let s = E(30, 52, 22, 5, "rgba(40,60,20,.25)");
      s += `<g transform="rotate(${a} 30 50)">`;
      for (const [x, y, r, c] of FEUILLES) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"${st(1.1)}/>`;
      for (const [x, y, r, c] of FEUILLES) s += `<circle cx="${x}" cy="${y}" r="${f(r - 0.6)}" fill="${c}"/><path d="M${f(x - r * 0.55)},${f(y - r * 0.35)} q${f(r * 0.3)},${f(-r * 0.35)} ${f(r * 0.65)},${f(-r * 0.3)}" fill="none" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".3"/>`;
      for (const [x, y, rot] of [[12, 28, -40], [48, 29, 40], [30, 10.4, 0], [8, 42, -70], [52, 43, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${rot})">${P("M0,3 Q-2.6,-1 0,-4.4 Q2.6,-1 0,3 Z", "#7EC25A", 0.8)}<path d="M0,2.4 L0,-3.4" stroke="#4E8F3A" stroke-width="0.5"/></g>`;
      if (!vide) for (const [x, y] of [[16, 30], [44, 34], [33, 45]]) s += [0, 1, 2, 3, 4].map((i) => {
        const t = i * Math.PI * 0.4;
        return E(x + Math.cos(t) * 1.2, y + Math.sin(t) * 1.2, 0.9, 0.9, "#FFF8F0");
      }).join("") + E(x, y, 0.6, 0.6, "#F2C04B");
      s += `</g>`;
      if (secoue) for (let i = 0; i < 3; i++) s += `<g transform="translate(${10 + i * 18 + secoue * 2} ${f(14 + secoue * 4 + i * 3)}) rotate(${f(secoue * 40 + i * 50)})">${P("M0,2 Q-1.8,-0.6 0,-3 Q1.8,-0.6 0,2 Z", "#7EC25A", 0.6)}</g>`;
      return s;
    }
    __name(buisson, "buisson");
    var buissonVivant = /* @__PURE__ */ __name(() => `<g><animateTransform attributeName="transform" type="rotate" values="-1.2 30 50;1.2 30 50;-1.2 30 50" dur="3.2s" repeatCount="indefinite"/>${buisson(0)}</g>`, "buissonVivant");
    var FRUITS = {
      mure: { nom: "mûre", corps: "#4A2A5A", clair: "#8A5AA8", ombre: "#2A1834", jus: "#7A3A8A" },
      fraise: { nom: "fraise", corps: "#E8404A", clair: "#FF8A8A", ombre: "#A8202A", jus: "#F05A64" },
      myrtille: { nom: "myrtille", corps: "#4A62B8", clair: "#8AA8E8", ombre: "#2A3A7A", jus: "#5A6AC8" },
      cepe: { nom: "cèpe", corps: "#A86A3A", clair: "#D8A070", ombre: "#7A4A24", jus: "#E8C890" }
    };
    function fruit(k, m = 1, tard = false) {
      const c = FRUITS[k], vert = "#9AC86A";
      const col = m < 1 ? vert : tard ? c.ombre : c.corps;
      let s = "";
      if (k === "mure") {
        s += P("M16,6 L16,10", "none", 1) + P("M16,7 Q12,4 10,6.6 Q13,7.8 16,7.6 Z", "#6AA84A", 0.7) + P("M16,7 Q20,4 22,6.6 Q19,7.8 16,7.6 Z", "#6AA84A", 0.7);
        const pts = [[16, 11.6], [12.6, 13.6], [19.4, 13.6], [16, 15.4], [11.6, 17.4], [20.4, 17.4], [14, 18.6], [18, 18.6], [12.8, 21.4], [19.2, 21.4], [16, 22], [14.4, 24.4], [17.6, 24.4], [16, 26.4]];
        for (const [x, y] of pts) s += `<circle cx="${x}" cy="${y}" r="2.3" fill="${col}"${st(0.7)}/>` + E(x - 0.7, y - 0.7, 0.6, 0.6, m < 1 ? "#D8F0B0" : c.clair);
      } else if (k === "fraise") {
        s += P("M16,9 Q24.6,9 24,16 Q23.4,23.6 16,27.6 Q8.6,23.6 8,16 Q7.4,9 16,9 Z", col, 1);
        for (const [x, y] of [[12, 13], [16, 12.4], [20, 13], [11, 17.4], [15, 16.8], [19.4, 17.2], [13, 21.4], [17.4, 21.2], [15.4, 24.6]]) s += `<path d="M${x},${f(y - 0.7)} Q${x + 0.6},${y} ${x},${f(y + 0.7)} Q${x - 0.6},${y} ${x},${f(y - 0.7)} Z" fill="${m < 1 ? "#E8F4C0" : "#FFE07A"}"/>`;
        s += P("M16,10 L11,6.6 L13.4,9.6 L9.6,9.4 L13.6,11.2 L16,9.8 L18.4,11.2 L22.4,9.4 L18.6,9.6 L21,6.6 Z", "#5FA548", 0.8) + P("M16,7 L16,3.6", "none", 1.1) + `<path d="M11,13.4 Q12,11.4 14,11" fill="none" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round" opacity=".6"/>`;
      } else if (k === "myrtille") {
        for (const [x, y, r] of [[11.4, 19, 5.2], [20.8, 18.2, 5.4], [16, 24.4, 5.2]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"${st(0.9)}/><path d="M${f(x - 1.6)},${f(y - r + 1.2)} l1.6,1 l1.6,-1" fill="none" stroke="${m < 1 ? "#5A8A3A" : c.ombre}" stroke-width="0.8" stroke-linecap="round"/>` + E(x - r * 0.4, y - r * 0.2, r * 0.28, r * 0.2, WHITE).replace("/>", ' opacity=".45"/>') + (m >= 1 ? `<circle cx="${x}" cy="${y}" r="${f(r - 0.8)}" fill="#C8D8F8" opacity=".18"/>` : "");
        s += P("M11.4,14 Q14,8 16,6.4 Q18,8 20.8,13 M16,6.4 L16,19.4", "none", 0.9) + P("M16,7.6 Q20,4 23,6 Q20,8.4 16,7.6 Z", "#6AA84A", 0.7);
      } else {
        s += P("M11,18 Q10,26.6 12.6,28 L19.4,28 Q22,26.6 21,18 Z", m < 1 ? "#EEE8D0" : "#F4ECD4", 1) + `<path d="M13,22 Q16,23 19,22 M12.8,25 Q16,26 19.2,25" fill="none" stroke="#D8C8A0" stroke-width="0.6"/>`;
        s += P("M4.6,18.6 Q4,8 16,7.4 Q28,8 27.4,18.6 Q16,21 4.6,18.6 Z", m < 1 ? "#C8A878" : c.corps, 1) + P("M6,18.6 Q16,20.6 26,18.6 Q16,22.4 6,18.6 Z", "#E8D8A8", 0.7);
        s += `<path d="M8.4,13 Q11,9.4 15,9" fill="none" stroke="${c.clair}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` + E(21, 12, 1.2, 0.8, c.clair).replace("/>", ' opacity=".6"/>');
      }
      if (tard) s = `<g filter="none" opacity=".95">${s}</g><path d="M${k === "cepe" ? "9,15 q2,1.2 4,0 M18,15 q2,1.2 4,0" : "12,16 q2,1.2 4,0 M17,21 q2,1.2 4,0"}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" opacity=".6"/>` + P(`M${k === "cepe" ? 14 : 16},28.6 q1.2,1.8 0,2.6 q-1.2,-0.8 0,-2.6 Z`, FRUITS[k].jus, 0.5);
      if (m < 1) s = `<g transform="translate(16 18) scale(${f(0.55 + 0.45 * m)}) translate(-16 -18)">${s}</g>`;
      return s;
    }
    __name(fruit, "fruit");
    var brille = /* @__PURE__ */ __name((x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.12;0.26;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`, "brille");
    var fruitMur = /* @__PURE__ */ __name((k) => `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -0.6;0 0" dur="1.6s" repeatCount="indefinite"/>${fruit(k)}</g>` + brille(9, 9, 2.6, 2, 0) + brille(24, 14, 1.8, 2, 0.9) + (k === "cepe" ? `<circle cx="16" cy="17" r="15" fill="#FFF0B8" opacity=".25"><animate attributeName="opacity" values=".1;.35;.1" dur="1.4s" repeatCount="indefinite"/></circle>` : ""), "fruitMur");
    var fruitTard = /* @__PURE__ */ __name((k) => `<g><animateTransform attributeName="transform" type="rotate" values="-6 16 6;6 16 6;-6 16 6" dur="0.44s" repeatCount="indefinite"/>${fruit(k, 1, true)}</g>`, "fruitTard");
    var murit = /* @__PURE__ */ __name((k, i) => i < 2 ? fruit(k, [0.2, 0.6][i]) : fruit(k) + [0, 1, 2, 3, 4, 5].map((j) => {
      const a = j * Math.PI / 3;
      return `<path d="M${f(16 + Math.cos(a) * 12)},${f(17 + Math.sin(a) * 12)} L${f(16 + Math.cos(a) * 15)},${f(17 + Math.sin(a) * 15)}" stroke="#FFF6C8" stroke-width="1.4" stroke-linecap="round"/>`;
    }).join(""), "murit");
    function tombe(k, i) {
      const dy = [1, 4, 6][i], rot = [14, 40, 0][i], sx = i === 2 ? 1.2 : 1, sy = i === 2 ? 0.75 : 1;
      return `<g transform="translate(16 ${30 + dy - 6}) rotate(${rot}) scale(${f(0.72 * sx)} ${f(0.72 * sy)}) translate(-16 -28)" opacity="${[1, 0.95, 0.75][i]}">${fruit(k, 1, true)}</g>` + (i === 2 ? E(16, 30.4, 6, 1.2, FRUITS[k].jus).replace("/>", ' opacity=".7"/>') : "");
    }
    __name(tombe, "tombe");
    function cueilli(k, i) {
      const c = FRUITS[k], t = (i + 1) / 4;
      let s = "";
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4 + 0.4, d = 5 + t * 12;
        s += `<circle cx="${f(16 + Math.cos(a) * d)}" cy="${f(17 + Math.sin(a) * d + t * t * 4)}" r="${f(1.8 * (1 - t * 0.6))}" fill="${c.jus}" stroke="${OUT}" stroke-width="0.4" opacity="${f(1 - t * 0.7)}"/>`;
      }
      if (i < 3) s += `<g transform="translate(16 ${f(17 - [2, 8, 16][i])}) scale(${[1.15, 1, 0.75][i]}) translate(-16 -17)">${fruit(k)}</g>`;
      s += etoile(f(6 + i), f(8 - i), [2.6, 2, 1.4, 0.8][i]) + etoile(f(26 - i), f(10 - i * 0.6), [1.8, 2.4, 1.6, 1][i]);
      return s;
    }
    __name(cueilli, "cueilli");
    var guepe = /* @__PURE__ */ __name((s = 1) => `<g transform="scale(${s})">${P("M-3.4,0 Q-3.4,-2.6 0,-2.6 Q3.4,-2.6 3.8,0 Q3.4,2.6 0,2.6 Q-3.4,2.6 -3.4,0 Z", "#FFD24A", 0.7)}<path d="M-1.2,-2.5 L-1.2,2.5 M1,-2.5 L1,2.5" stroke="${OUT}" stroke-width="1"/>${P("M3.6,0 L5.2,0", "none", 0.8)}${E(-3.2, -0.4, 1.2, 1.4, OUT)}${E(-3.5, -0.8, 0.4, 0.4, WHITE)}<ellipse cx="-0.6" cy="-3.6" rx="2.2" ry="1.2" fill="#E8F4FF" fill-opacity=".85" stroke="${OUT}" stroke-width="0.5"><animate attributeName="ry" values="1.2;0.4;1.2" dur="0.08s" repeatCount="indefinite"/></ellipse><ellipse cx="1.2" cy="-3.4" rx="1.8" ry="1" fill="#E8F4FF" fill-opacity=".85" stroke="${OUT}" stroke-width="0.5"><animate attributeName="ry" values="0.4;1;0.4" dur="0.08s" repeatCount="indefinite"/></ellipse></g>`, "guepe");
    var nid = /* @__PURE__ */ __name(() => P("M10,10 Q16,6 22,10 Q25,16 22,22 Q16,26 10,22 Q7,16 10,10 Z", "#C8B490", 1) + `<path d="M9,14 Q16,12 23,14 M8.6,18 Q16,16 23.4,18 M10,21.6 Q16,20 22,21.6" fill="none" stroke="#9A8460" stroke-width="0.7"/>` + E(16, 19, 1.8, 2, "#4A3A28", 0.6) + P("M16,6.6 L16,3", "none", 1), "nid");
    function guepes(fige = false) {
      let s = nid();
      [[0, 11, 0.9], [1.4, 9, 0.75], [0.7, 13, 0.8]].forEach(([off, r, sc], i) => {
        const dur = 1.6 + i * 0.3;
        s += fige ? `<g transform="translate(${f(16 + Math.cos(off * 2) * r)} ${f(16 + Math.sin(off * 2) * r * 0.7)})">${guepe(sc)}</g>` : `<g><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${-off}s" path="M${16 + r},16 A${r},${f(r * 0.7)} 0 1 1 ${16 - r},16 A${r},${f(r * 0.7)} 0 1 1 ${16 + r},16"/><g>${guepe(sc)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 0" dur="0.3s" repeatCount="indefinite"/></g></g>`;
      });
      return s;
    }
    __name(guepes, "guepes");
    function pique(i) {
      let s = "";
      if (i === 0) s += P("M16,4 L19,12 L27,12 L20.6,17 L23,25 L16,20 L9,25 L11.4,17 L5,12 L13,12 Z", "#FF6A5A", 0.9).replace("/>", ' opacity=".85"/>');
      s += [0, 1, 2].map((j) => {
        const a = j * 2.1 + i * 0.8;
        return etoile(16 + Math.cos(a) * 9, 10 + Math.sin(a) * 3, 2.4, "#FFE07A");
      }).join("");
      if (i > 0) s += `<circle cx="16" cy="20" r="${2 + i}" fill="#FF8A8A" stroke="${OUT}" stroke-width="0.6"/>` + E(15, 19, 0.8, 0.6, WHITE);
      return s;
    }
    __name(pique, "pique");
    function panier(n) {
      let s = `<path d="M7,14 Q16,1 25,14" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M7,14 Q16,1 25,14" fill="none" stroke="#C8925A" stroke-width="1.2" stroke-linecap="round"/>`;
      if (n > 0) s += `<g transform="translate(4 3) scale(0.42)">${fruit("fraise")}</g><g transform="translate(13 2) scale(0.42)">${fruit("myrtille")}</g>` + (n > 1 ? `<g transform="translate(8 -1) scale(0.42)">${fruit("mure")}</g><g transform="translate(16 -2) scale(0.4)">${fruit("cepe")}</g>` : "");
      s += P("M4,14 L28,14 L25,27 Q16,29 7,27 Z", "#C8925A", 1);
      for (const y of [17.4, 21, 24.4]) s += `<path d="M5,${y} Q16,${y + 1.6} 27,${y}" fill="none" stroke="#9A6A3A" stroke-width="0.8"/>`;
      for (let x = 8; x < 26; x += 3.6) s += `<path d="M${x},14.4 L${f(x - 0.6)},27" stroke="#E2B07A" stroke-width="0.6" opacity=".7"/>`;
      return s + P("M3.4,13 L28.6,13 L28.6,15.4 L3.4,15.4 Z", "#A87A48", 0.9);
    }
    __name(panier, "panier");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var B = [0, 0, 60, 60];
    var F = [0, 0, 32, 32];
    var LA = { mure: "La mûre", fraise: "La fraise", myrtille: "La myrtille", cepe: "Le cèpe" };
    piece("buisson", "Le buisson (il respire, en boucle)", B, buissonVivant);
    for (let k = 1; k <= 3; k++) piece(`buisson-secoue_${k}`, "Le buisson secoué (on cueille)", B, () => buisson(k), "buisson-secoue", 110);
    piece("buisson_vide", "Le buisson vide", B, () => buisson(0, true));
    for (const k of Object.keys(FRUITS)) {
      const e = k === "cepe" ? "" : "e";
      piece(`${k}_mur`, `${LA[k]} à point (${k === "cepe" ? "il luit" : "elle brille"}, en boucle)`, F, () => fruitMur(k));
      piece(`${k}_trop-mur`, `${LA[k]} trop mûr${e} (${k === "cepe" ? "il" : "elle"} tremble, en boucle)`, F, () => fruitTard(k));
      for (let i = 0; i < 3; i++) piece(`murit-${k}_${i + 1}`, `${LA[k]} qui mûrit`, F, () => murit(k, i), `murit-${k}`, 160);
      for (let i = 0; i < 3; i++) piece(`tombe-${k}_${i + 1}`, `${LA[k]} qui tombe`, F, () => tombe(k, i), `tombe-${k}`, 130);
      for (let i = 0; i < 4; i++) piece(`cueilli-${k}_${i + 1}`, `${LA[k]} cueilli${e} (le jus gicle)`, F, () => cueilli(k, i), `cueilli-${k}`, 90);
    }
    piece("guepes", "Les guêpes autour de leur nid (en boucle)", F, () => guepes(false));
    for (let i = 0; i < 3; i++) piece(`piqure_${i + 1}`, "La piqûre", F, () => pique(i), "piqure", 140);
    for (const [n, nom] of [[0, "vide"], [1, "a-moitie"], [2, "plein"]]) piece(`panier_${nom}`, `Le panier, ${["vide", "à moitié", "plein"][n]}`, F, () => panier(n));
    var TITRE = "La Cueillette (le Bosquet)";
    var FOND = "#B8D89A";
    var LISEZ_MOI = "La Cueillette : le buisson a un cadre de 60 × 60 (le bouton) ; un fruit, les guêpes, la piqûre et le panier un cadre de 32 × 32, à poser au milieu du buisson. Boucles animées dans le SVG (SMIL) : le buisson, le fruit mûr, le fruit trop mûr, les guêpes. Suites d'images à enchaîner une fois : le buisson secoué, le fruit qui mûrit, qui tombe, qu'on cueille, la piqûre.";
    module.exports = { FRUITS, PIECES, TITRE, FOND, LISEZ_MOI, buisson, buissonVivant, fruit, fruitMur, fruitTard, murit, tombe, cueilli, guepes, pique, panier };
  }
});

// atelier/minijeu_cueillette_saisons.js
var require_minijeu_cueillette_saisons = __commonJS({
  "atelier/minijeu_cueillette_saisons.js"(exports, module) {
    var CU = require_minijeu_cueillette();
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var L = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "L");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var brille = /* @__PURE__ */ __name((x, y, r, dur, begin) => `<g opacity="0" transform="translate(${f(x)} ${f(y)})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`, "brille");
    function jauge(n, anim = true) {
      const p = `jg${n}`, plein = n === 3;
      let s = `<defs>${lin(p + "o", [[0, "#E8BC84"], [0.5, "#C8925A"], [1, "#8A5A32"]])}${lin(p + "r", [[0, "#FFC4D0"], [0.5, "#F27A94"], [1, "#C84A68"]])}${lin(p + "g", [[0, "#FFF2B8"], [0.5, "#FFD24A"], [1, "#D89A1E"]])}${lin(p + "v", [[0, "#4A3020"], [1, "#6A4628"]])}</defs>`;
      s += P("M5,3 L91,3 Q95,3 95,7 L95,15 Q95,19 91,19 L5,19 Q1,19 1,15 L1,7 Q1,3 5,3 Z", `url(#${p}o)`, 1.2);
      for (let x = 4; x < 94; x += 4) s += L(`M${x},4.4 L${x + 2},8 L${x},11.6 M${x},11 L${x + 2},14.6 L${x},18`, "#9A6A3A", 0.6, ' opacity=".55"');
      s += L("M5,4.6 L91,4.6", "#F6D8A8", 1, ' opacity=".8"');
      for (let i = 0; i < 3; i++) {
        const x = 5 + i * 29.4, w = 26.4;
        const d = `M${x + 3},6.4 L${f(x + w - 3)},6.4 Q${f(x + w)},6.4 ${f(x + w)},9.4 L${f(x + w)},12.6 Q${f(x + w)},15.6 ${f(x + w - 3)},15.6 L${x + 3},15.6 Q${x},15.6 ${x},12.6 L${x},9.4 Q${x},6.4 ${x + 3},6.4 Z`;
        s += P(d, `url(#${p}v)`, 0.8);
        if (i < n) s += P(d, `url(#${p}${plein ? "g" : "r"})`, 0.8) + L(`M${x + 3},8.2 L${f(x + w * 0.55)},8.2`, WHITE, 1.2, ' opacity=".75"') + E(x + w - 4, 12.6, 1.2, 0.9, WHITE).replace("/>", ' opacity=".5"/>');
        else s += L(`M${x + 3},8.2 L${f(x + w * 0.4)},8.2`, WHITE, 0.8, ' opacity=".15"');
      }
      if (plein) s += `<rect x="0.4" y="2.4" width="95.2" height="17.2" rx="4.4" fill="none" stroke="#FFF2B8" stroke-width="1.8">${anim ? '<animate attributeName="stroke-opacity" values="1;.15;1" dur="0.6s" repeatCount="indefinite"/>' : ""}</rect>` + (anim ? brille(92, 3.4, 3, 1.2, 0) + brille(4, 18.6, 2.4, 1.2, 0.6) + brille(48, 3, 2, 1.2, 0.3) : etoile(92, 3.4, 3) + etoile(4, 18.6, 2.4));
      return s;
    }
    __name(jauge, "jauge");
    function panierMini(x, y, s) {
      return `<g transform="translate(${x} ${y}) scale(${s})">${L("M-5,-2 Q0,-9 5,-2", "#8A5A32", 1.4)}${E(-2.4, -3.4, 2, 1.8, "#E8404A", 0.5)}${E(1.6, -3.6, 1.8, 1.6, "#4A62B8", 0.5)}${E(0, -4.8, 1.4, 1.3, "#8A5AA8", 0.4)}${P("M-6.4,-2 L6.4,-2 L5,5 Q0,6.4 -5,5 Z", "url(#dbP)", 0.8)}${L("M-5.6,1 Q0,2 5.6,1", "#8A5A32", 0.5)}${L("M-6.4,-2 L6.4,-2", "#F6D8A8", 1)}</g>`;
    }
    __name(panierMini, "panierMini");
    function double(anim = true) {
      const defs = `<defs>${rad("dbR", [[0, "#FFF2B8"], [0.6, "#FFD24A"], [1, "#D89A1E"]])}${lin("dbP", [[0, "#E8BC84"], [1, "#A8784A"]])}${lin("dbB", [[0, "#F27A94"], [1, "#C84A68"]])}</defs>`;
      const rubans = P("M11,22 L7,31 L10.4,29.4 L12,32 L15,23 Z", "url(#dbB)", 0.8) + P("M21,22 L25,31 L21.6,29.4 L20,32 L17,23 Z", "url(#dbB)", 0.8);
      let r = "";
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        r += E(16 + Math.cos(a) * 10.4, 14 + Math.sin(a) * 10.4, 3.4, 3.4, i % 2 ? "#FFD24A" : "#F2B83A", 0.7);
      }
      r += E(16, 14, 10.2, 10.2, "url(#dbR)", 1) + E(16, 14, 8, 8, "none").replace('fill="none"', 'fill="none" stroke="#D89A1E" stroke-width="0.6" stroke-dasharray="1 1"');
      r += panierMini(12.4, 15.4, 0.62) + panierMini(19.6, 15.4, 0.62) + L("M9.6,8 Q12,5.6 15,5.2", WHITE, 1.1, ' opacity=".8"');
      const bat = anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="0.5s" repeatCount="indefinite"/>' : "";
      return defs + `<g transform="translate(16 15.4) scale(0.86) translate(-16 -15.4)">${rubans}<g transform-origin="16 14">${bat}${r}</g></g>` + etoile(27.6, 4, 2.4) + etoile(4.4, 25, 1.8);
    }
    __name(double, "double");
    function papillon(anim = true, ouvert = 1) {
      const d = `<defs>${lin("ppH", [[0, "#FFF2B8"], [0.5, "#FFD24A"], [1, "#E89A2A"]], 1, 1)}${lin("ppB", [[0, "#FFE07A"], [1, "#E8843A"]], 1, 1)}${lin("ppC", [[0, "#7A4A2A"], [1, "#3C2819"]])}</defs>`;
      const aile = /* @__PURE__ */ __name((sx) => `<g transform="scale(${sx} 1)">${P("M0.6,-1 Q4,-13 12.4,-10.6 Q15.6,-8 13,-3.4 Q10,0.4 0.6,0.6 Z", "url(#ppH)", 0.9)}${P("M0.6,1 Q9,1.6 10.4,6.4 Q10.6,10.4 6.6,10 Q2.6,9 0.6,2.6 Z", "url(#ppB)", 0.9)}${L("M1.4,-0.6 Q6,-4 10,-8.6 M1.4,0 Q7,-2 12,-4", "#D8902A", 0.5, ' opacity=".8"')}${L("M1.4,1.6 Q5,4 8,8", "#C8742A", 0.5, ' opacity=".8"')}${E(9.4, -7.4, 1.8, 1.5, "#FFFBE8", 0.4)}${E(6.6, 6, 1.2, 1, "#FFFBE8", 0.3)}${E(12, -4.6, 0.8, 0.7, "#E8604A")}${L("M3.4,-8 Q6,-11 9.6,-11", WHITE, 0.9, ' opacity=".8"')}</g>`, "aile");
      const ailes = anim ? `<g><animateTransform attributeName="transform" type="scale" values="1 1;0.2 1;1 1" dur="0.36s" repeatCount="indefinite"/>${aile(1)}${aile(-1)}</g>` : `<g transform="scale(${ouvert} 1)">${aile(1)}${aile(-1)}</g>`;
      const corps = P("M-1.4,-5.4 Q0,-7.2 1.4,-5.4 L1.3,6.4 Q0,8.4 -1.3,6.4 Z", "url(#ppC)", 0.6) + L("M-1.2,-1 L1.2,-1 M-1.2,1.6 L1.2,1.6 M-1.1,4 L1.1,4", "#E8C890", 0.4) + E(0, -6.6, 1.8, 1.7, "#5A3A24", 0.6) + E(-0.6, -7, 0.5, 0.5, WHITE) + L("M-0.6,-8 Q-2.4,-11.6 -4.6,-12", OUT, 0.6) + L("M0.6,-8 Q2.4,-11.6 4.6,-12", OUT, 0.6) + E(-4.6, -12, 0.9, 0.9, "#FFD24A", 0.4) + E(4.6, -12, 0.9, 0.9, "#FFD24A", 0.4);
      return d + `<circle cx="16" cy="17" r="13" fill="#FFF2B8" opacity=".25"/><g transform="translate(16 17.4)">${ailes}${corps}</g>` + (anim ? brille(27, 6, 2, 1.6, 0) + brille(5, 27, 1.6, 1.6, 0.8) : etoile(27, 6, 2) + etoile(5, 27, 1.6));
    }
    __name(papillon, "papillon");
    function magie(k) {
      const t = (k + 1) / 4, p = `mg${k}`;
      let s = `<defs>${rad(p, [[0, "#FFF6C8"], [0.7, "#FFE07A"], [1, "#FFD24A"]], 0.5, 0.5, 0.5)}</defs>`;
      s += `<circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="url(#${p})" opacity="${f(0.35 * (1 - t))}"/>`;
      s += `<circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="none" stroke="#FFD24A" stroke-width="${f(3 * (1 - t * 0.6))}" opacity="${f(1 - t * 0.55)}"/><circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="none" stroke="#FFFBE8" stroke-width="${f(1.2 * (1 - t * 0.6))}" opacity="${f(1 - t * 0.55)}"/>`;
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5 + k * 0.25, d = 6 + t * 17, x = 30 + Math.cos(a) * d, y = 34 + Math.sin(a) * d * 0.8;
        s += i % 3 === 2 ? `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(i * 40 + k * 30)})">${P("M0,-2.4 Q1.8,0 0,2.4 Q-1.8,0 0,-2.4 Z", "#FFC4D0", 0.4)}</g>` : etoile(x, y, f(3 * (1 - t * 0.4)), i % 2 ? "#FFE07A" : "#FFFBE8");
      }
      return s;
    }
    __name(magie, "magie");
    var SAISONS = {
      printemps: { touffes: ["#7CC25A", "#8ED06A", "#A0DC7A"], clair: "#C8F0A0", ombre: "#4E9A38", feuille: "#B0E888", fleur: ["#FFD0E0", "#F48AAA"] },
      ete: { touffes: ["#3E8A2E", "#4E9A38", "#5AAA44"], clair: "#8ED06A", ombre: "#2A6A20", feuille: "#7EC25A", fleur: ["#FFFFFF", "#E8E0F0"] },
      automne: { touffes: ["#C8642A", "#D8843A", "#E8A04A"], clair: "#F8D07A", ombre: "#8A3A1A", feuille: "#F2B84A", fleur: null }
    };
    var TOUFFES = [[18, 36, 13], [42, 36, 13], [30, 25, 15], [23, 40, 12], [38, 41, 11]];
    function buissonSaison(k) {
      const c = SAISONS[k], p = `bs${k}`;
      let s = `<defs>${c.touffes.map((col, i) => rad(`${p}${i}`, [[0, c.clair], [0.55, col], [1, c.ombre]], 0.38, 0.3, 0.8)).join("")}</defs>`;
      s += E(30, 53, 22, 4.6, "rgba(40,60,20,.25)");
      for (const [x, y, r] of TOUFFES) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.ombre}"${st(1.2)}/>`;
      TOUFFES.forEach(([x, y, r], i) => {
        s += `<circle cx="${x}" cy="${y}" r="${f(r - 0.6)}" fill="url(#${p}${i % 3})"/>` + L(`M${f(x - r * 0.55)},${f(y - r * 0.35)} q${f(r * 0.3)},${f(-r * 0.35)} ${f(r * 0.65)},${f(-r * 0.3)}`, WHITE, 1.1, ' opacity=".4"');
      });
      for (const [x, y, r] of [[12, 28, -40], [48, 29, 40], [30, 10.4, 0], [8, 42, -70], [52, 43, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${r})">${P("M0,3.4 Q-3,-1 0,-5 Q3,-1 0,3.4 Z", c.feuille, 0.8)}${L("M0,2.6 L0,-4", c.ombre, 0.5)}</g>`;
      if (k === "printemps") for (const [x, y, r] of [[14, 30, 1.6], [24, 21, 1.8], [37, 19, 1.6], [46, 31, 1.7], [26, 40, 1.8], [40, 44, 1.5], [17, 44, 1.5], [31, 31, 1.9]]) s += [0, 1, 2, 3, 4].map((i) => {
        const a = i * Math.PI * 0.4 - Math.PI / 2;
        return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.85, r * 0.85, c.fleur[i % 2 ? 1 : 0], 0.3);
      }).join("") + E(x, y, r * 0.5, r * 0.5, "#FFD24A", 0.3);
      if (k === "ete") s += [[16, 30], [44, 34], [33, 45], [26, 22]].map(([x, y]) => [0, 1, 2, 3, 4].map((i) => {
        const t = i * Math.PI * 0.4;
        return E(x + Math.cos(t) * 1.2, y + Math.sin(t) * 1.2, 0.95, 0.95, c.fleur[0], 0.25);
      }).join("") + E(x, y, 0.6, 0.6, "#F2C04B")).join("") + [[20, 24], [40, 26]].map(([x, y]) => E(x, y, 3.4, 1.6, WHITE).replace("/>", ' opacity=".18"/>')).join("");
      if (k === "automne") s += [[6, 52, 30, "#E8843A"], [52, 54, -20, "#D8642A"], [48, 9, 60, "#F2B84A"], [10, 14, -30, "#E8843A"]].map(([x, y, r, col]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P("M0,3 Q-2.8,-1 0,-4.6 Q2.8,-1 0,3 Z", col, 0.6)}${L("M0,2.4 L0,-3.6", "#8A3A1A", 0.4)}</g>`).join("") + [[22, 26], [38, 36], [28, 44]].map(([x, y]) => E(x, y, 1.4, 1.4, "#C8402A", 0.4) + E(x - 0.4, y - 0.4, 0.4, 0.4, WHITE)).join("");
      return s;
    }
    __name(buissonSaison, "buissonSaison");
    function pie(pose, ailes = 0, fruitK = null, effraye = false) {
      const p = `pi${pose}${ailes}${fruitK || ""}${effraye ? "e" : ""}`;
      let s = `<defs>${lin(p + "n", [[0, "#3A3E5A"], [1, "#14141E"]])}${lin(p + "q", [[0, "#3A7AC8"], [0.5, "#2A9A8A"], [1, "#1E2E4A"]], 1, 0)}${rad(p + "v", [[0, "#FFFFFF"], [1, "#D8E0EC"]], 0.4, 0.3, 0.8)}${lin(p + "a", [[0, "#4A5A8A"], [0.5, "#2A3A6A"], [1, "#18203A"]])}</defs>`;
      s += P("M10,20 Q2,17 -3,13.4 Q-3.6,15.6 -2,17 Q1,20 8,22.6 Z", `url(#${p}q)`, 0.9) + L("M-1.4,15 Q3,18 8,20.6", "#8AD8E8", 0.6, ' opacity=".7"');
      s += P("M7,20 Q7,10.4 18,9.6 Q28,9.4 30.6,16.4 Q31,25 19,26.4 Q8.6,26.6 7,20 Z", `url(#${p}n)`, 1.1);
      s += P("M13.6,21 Q17,15.4 27,16.6 Q29,23 19,25.2 Q14,25 13.6,21 Z", `url(#${p}v)`, 0);
      s += P("M25.6,9.6 Q27,3.6 33,4 Q38.6,5 38.4,10.6 Q37.4,15.6 32,16 Q27,15.6 25.6,9.6 Z", `url(#${p}n)`, 1);
      s += effraye ? L("M31.6,8.6 Q33.6,7.2 35.4,8.6", WHITE, 1.4) + L("M31.6,8.6 Q33.6,7.2 35.4,8.6", OUT, 0.6) + L("M30.8,6 L35,5.2", OUT, 0.7) : E(33.6, 9, 2, 2.2, WHITE, 0.4) + E(34, 9.2, 1.3, 1.5, OUT) + E(34.5, 8.5, 0.5, 0.5, WHITE);
      s += P("M37.6,9 L43.4,10.6 L37.6,12.6 Z", "#4A4A50", 0.8) + L("M38,10.6 L42,10.6", "#7A7A84", 0.5);
      s += L("M28,6.6 Q30,4.4 33,4.4", "#8A9AD8", 0.9, ' opacity=".7"');
      if (fruitK) s += `<g transform="translate(36.2 6.2) scale(0.34)">${CU.fruit(fruitK)}</g>`;
      if (pose) s += L("M16,26 L15,30.6 M21,26 L22,30.6", "#4A4A50", 1.1) + L("M13,30.8 L17,30.8 M20,30.8 L24.4,30.8", "#4A4A50", 0.9);
      const aile = [
        P("M12,15 Q20,10.6 27,14.6 Q23,21.4 12,19.4 Z", `url(#${p}a)`, 0.8) + P("M14.6,15.6 Q19,14 22,15.4 Q18,17.6 14.6,15.6 Z", WHITE, 0) + L("M16,18.4 L25,16.4", "#6A9AE8", 0.6),
        P("M14,13.6 Q14,-0.6 26.6,-2.4 Q26.6,7 22.6,13.6 Z", `url(#${p}a)`, 0.8) + P("M17,6 Q20,1.6 24.4,0.4 L23.4,4 Q20,5 17,6 Z", WHITE, 0) + L("M16.4,10.6 Q19,6 24,4.6", "#6A9AE8", 0.6),
        P("M13,17 Q15,30 25,32 Q26.4,23 22.6,17 Z", `url(#${p}a)`, 0.8) + P("M15.4,20 Q17,25 20.4,27 L21.6,23 Q18.6,22 15.4,20 Z", WHITE, 0) + L("M16,22 L22,29", "#6A9AE8", 0.6)
      ][ailes];
      return s + aile;
    }
    __name(pie, "pie");
    function plumes(k) {
      const t = (k + 1) / 3;
      return [[-1, -1], [1, -0.6], [-0.4, 1], [0.8, 0.8]].map(([dx, dy], i) => `<g transform="translate(${f(18 + dx * t * 14)} ${f(16 + dy * t * 10 + t * 3)}) rotate(${f(i * 80 + t * 90)})" opacity="${f(1 - t * 0.6)}">${P("M0,-3.4 Q1.8,0 0,3.4 Q-1.8,0 0,-3.4 Z", i % 2 ? WHITE : "#2A2E44", 0.5)}${L("M0,-3 L0,3", i % 2 ? "#C8D0DC" : "#6A7AA8", 0.4)}</g>`).join("");
    }
    __name(plumes, "plumes");
    function nidPapier(p) {
      return `<defs>${rad(p, [[0, "#F2E2C0"], [0.6, "#D8C49A"], [1, "#A88A60"]], 0.4, 0.3, 0.8)}</defs>` + L("M16,3 L16,7", "#6A4A2A", 1.4) + P("M9.6,10 Q16,5.4 22.4,10 Q25.6,16 22.4,22.4 Q16,26.6 9.6,22.4 Q6.4,16 9.6,10 Z", `url(#${p})`, 1) + L("M8.6,13.6 Q16,11 23.4,13.6 M7.8,17.4 Q16,15 24.2,17.4 M8.6,21 Q16,19 23.4,21", "#A88A60", 0.7) + L("M10.4,11.4 Q13,9 16,8.6", WHITE, 1, ' opacity=".6"') + E(16, 19.4, 2, 2.2, "#3A2A1A", 0.6) + E(15.6, 19, 0.6, 0.6, "#6A5A40");
    }
    __name(nidPapier, "nidPapier");
    function nidTaille(n, fige = false) {
      const sc = [0.7, 1, 1.35][n];
      const guepes = CU.guepes(fige).replace(/^<path d="M10,10 Q16,6 22,10[^]*?<path d="M16,6\.6 L16,3"[^>]*\/>/, "");
      return `<g transform="translate(30 22) scale(${sc}) translate(-16 -16)">${nidPapier(`nd${n}${fige ? "f" : ""}`)}${guepes}</g>`;
    }
    __name(nidTaille, "nidTaille");
    var perdu = /* @__PURE__ */ __name(() => `<g opacity=".6">${buissonSaison("ete").replace(/url\(#bsete(\d)\)/g, "#8A9A7A").replace(/#2A6A20/g, "#6A7A5E").replace(/#7EC25A/g, "#A8B49A").replace(/<defs>.*?<\/defs>/, "")}</g>` + [[10, 50, 40], [50, 52, -30], [44, 46, 80]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})" opacity=".7">${P("M0,3 Q-2.8,-1 0,-4.6 Q2.8,-1 0,3 Z", "#A8A890", 0.6)}${L("M0,2.4 L0,-3.6", "#6A6A5A", 0.4)}</g>`).join(""), "perdu");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var B = [0, 0, 60, 60];
    var F = [0, 0, 32, 32];
    var PIE = [-4, -4, 52, 40];
    var balance = /* @__PURE__ */ __name((s) => `<g><animateTransform attributeName="transform" type="rotate" values="-1.2 30 50;1.2 30 50;-1.2 30 50" dur="3.2s" repeatCount="indefinite"/>${s}</g>`, "balance");
    for (let n = 0; n <= 3; n++) piece(`jauge_${n}`, `La jauge de panier, ${n} cran${n > 1 ? "s" : ""}${n === 3 ? " (pleine, elle brille en boucle)" : ""}`, [0, 0, 96, 22], () => jauge(n));
    piece("double", "Le « double » (il bat, en boucle ; le jeu dessine le temps)", F, () => double());
    piece("papillon", "Le papillon doré (il bat des ailes, en boucle)", F, () => papillon());
    for (let k = 0; k < 4; k++) piece(`magie_${k + 1}`, "La magie du papillon (vers les buissons voisins)", B, () => magie(k), "magie", 90);
    var SAISON = { printemps: "de printemps, fleuri", ete: "d'été", automne: "d'automne, roux" };
    for (const k of Object.keys(SAISONS)) piece(`buisson-${k}`, `Le buisson ${SAISON[k]} (il se balance, en boucle)`, B, () => balance(buissonSaison(k)));
    for (const [i, a] of [1, 2, 0].entries()) piece(`pie-arrive_${i + 1}`, "La pie qui arrive en volant", PIE, () => pie(0, a), "pie-arrive", 110, true);
    for (const k of Object.keys(CU.FRUITS)) piece(`pie-vole-${k}`, `La pie posée, qui a volé ${k === "cepe" ? "le cèpe" : `la ${{ mure: "mûre", fraise: "fraise", myrtille: "myrtille" }[k]}`}`, PIE, () => pie(1, 0, k));
    for (const [i, a] of [1, 2, 1].entries()) piece(`pie-fuit_${i + 1}`, "La pie qui fuit (elle perd des plumes)", PIE, () => `<g transform="scale(-1 1) translate(-44 0)">${pie(0, a, null, true)}</g>` + (i ? plumes(i - 1) : ""), "pie-fuit", 100);
    for (let n = 0; n < 3; n++) piece(`nid_${n + 1}`, `Le nid de guêpes, taille ${n + 1} (par-dessus le buisson ; les guêpes tournent, en boucle)`, B, () => nidTaille(n));
    piece("buisson-perdu", "Le buisson perdu (5 secondes, sous le nid de taille 3)", B, perdu);
    var LISEZ_MOI = "Nouvelle version (design/conception/minijeux_grille.md) : la jauge de panier (96 × 22) en 4 états ; le « double » et le papillon doré (32 × 32) ; la magie du papillon, les buissons de saison, le nid (par-dessus le buisson) et le buisson perdu ont le cadre d'un buisson (60 × 60). La pie a un cadre de 52 × 40 (de −4 à 48 en x, de −4 à 36 en y) : elle arrive en boucle, se pose avec le fruit volé, puis fuit une fois (retournée, vers la gauche).";
    module.exports = { PIECES, LISEZ_MOI, SAISONS, jauge, double, papillon, magie, pie, plumes, nidTaille, perdu, buissonSaison };
  }
});

// atelier/minijeu_recolte.js
var require_minijeu_recolte = __commonJS({
  "atelier/minijeu_recolte.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var SORTES = {
      stone: { nom: "pierre", fond: ["#E4E0D8", "#C8C2B6"], lueur: "#FFFFFF" },
      wood: { nom: "bois", fond: ["#F2DEC0", "#DDBE92"], lueur: "#FFE8C0" },
      water: { nom: "eau", fond: ["#D8EEFA", "#AED6EE"], lueur: "#E8F8FF" },
      food: { nom: "nourriture", fond: ["#F4EAC0", "#E2CE8A"], lueur: "#FFF4C8" },
      fish: { nom: "poisson", fond: ["#D4EEF0", "#A8D8DC"], lueur: "#E8FCFF" }
    };
    var CARRE = "M6,2.5 L26,2.5 Q29.5,2.5 29.5,6 L29.5,26 Q29.5,29.5 26,29.5 L6,29.5 Q2.5,29.5 2.5,26 L2.5,6 Q2.5,2.5 6,2.5 Z";
    var fond = /* @__PURE__ */ __name((k, id) => {
      const c = SORTES[k];
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.fond[0]}"/><stop offset="1" stop-color="${c.fond[1]}"/></linearGradient></defs><path d="${CARRE}" fill="url(#${id})"${st(1)}/><path d="M6.4,4.4 L25.6,4.4" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/><path d="M5,27.6 L27,27.6" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round" opacity=".15"/>`;
    }, "fond");
    function objet(k) {
      switch (k) {
        case "stone":
          return E(16, 25, 10, 2, "rgba(60,40,20,.15)") + P("M7,24 Q6,17 11,16 Q15,15.6 16.4,19.6 Q17,24.6 12,25 Q8,25.2 7,24 Z", "#A8A298", 1) + P("M15,24.6 Q14.4,17 20,16 Q25.6,15.6 25.6,21 Q25.4,25 20,25.2 Q16,25.2 15,24.6 Z", "#BDB7AC", 1) + P("M10.6,16.6 Q11,9.6 16.4,9.4 Q21.4,9.6 21,15.6 Q20,18.4 15.6,18.2 Q11,18 10.6,16.6 Z", "#CFCAC0", 1) + `<path d="M13,12 Q15,10.6 17,11" fill="none" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".8"/>` + E(19, 20, 0.6, 0.4, "#8E887E") + E(10, 20, 0.6, 0.4, "#8E887E");
        case "wood":
          return E(16, 25.4, 10, 2, "rgba(60,40,20,.15)") + [[16, 21.6], [16, 14.6]].map(([x, y], i) => `<g transform="rotate(${i ? -8 : 6} ${x} ${y})">${P(`M${x - 9},${y - 3} L${x + 7},${y - 3} L${x + 7},${y + 3} L${x - 9},${y + 3} Z`, "#B07A4A", 1)}<path d="M${x - 7},${y - 1} L${x + 5},${y - 1} M${x - 6},${y + 1.2} L${x + 4},${y + 1.2}" stroke="#8A5A32" stroke-width="0.5"/>${E(x + 7, y, 2.4, 3, "#E8C890", 1)}${E(x + 7, y, 1.2, 1.6, "none").replace('fill="none"', 'fill="none" stroke="#B88A50" stroke-width="0.5"')}</g>`).join("") + `<g transform="translate(9 10) rotate(-30)">${P("M0,3 Q-2.6,-1 0,-4.4 Q2.6,-1 0,3 Z", "#7EC25A", 0.8)}</g>`;
        case "water":
          return E(16, 26, 7, 1.6, "rgba(40,90,140,.18)") + P("M16,4.4 Q24.6,14.6 24.4,19 Q24,26 16,26.4 Q8,26 7.6,19 Q7.4,14.6 16,4.4 Z", "#6AB8E8", 1.1) + P("M16,8 Q21.6,15 21.4,19 Q21,23.6 16,23.8 Q11,23.6 10.6,19 Q10.4,15 16,8 Z", "#8ECCF2", 0) + `<path d="M11.6,16 Q12.4,12.6 14.4,10.6" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round"/>` + E(19.4, 20.4, 1.1, 0.8, WHITE).replace("/>", ' opacity=".8"/>');
        case "food":
          return E(16, 26, 10, 1.8, "rgba(60,40,20,.15)") + [-5, -1.5, 2, 5.5].map((dx, i) => `<path d="M${16 + dx * 0.4},22 Q${16 + dx},14 ${16 + dx * 1.4},${8 + i % 2 * 2}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${16 + dx * 0.4},22 Q${16 + dx},14 ${16 + dx * 1.4},${8 + i % 2 * 2}" fill="none" stroke="#E2B44E" stroke-width="0.7" stroke-linecap="round"/>` + [0, 1, 2].map((j) => E(16 + dx * 1.35 - 0.6, 9 + i % 2 * 2 + j * 1.8, 1, 1.4, "#F2C94C", 0.5)).join("")).join("") + P("M8,19 L24,19 L22.4,26.4 Q16,27.6 9.6,26.4 Z", "#C8925A", 1) + `<path d="M8.6,22 Q16,23.4 23.4,22" fill="none" stroke="#9A6A3A" stroke-width="0.7"/>`;
        case "fish":
          return E(16, 26, 9, 1.6, "rgba(40,90,140,.18)") + `<g transform="translate(17.4 16.4) scale(0.8) rotate(-18) translate(-15 -16)">${P("M6.4,16 Q3,12 2,10.4 Q3.4,16 2,21.6 Q3,20 6.4,16 Z", "#E8604A", 0.9)}${P("M27,16 Q26,9.6 17,9.4 Q8.6,9.6 6,16 Q8.6,22.4 17,22.6 Q26,22.4 27,16 Z", "#9CC8E8", 1)}<path d="M8,16 Q17,13.4 26,15" fill="none" stroke="${WHITE}" stroke-width="1" opacity=".6"/>${P("M14,9.8 Q17,6.4 21,9.6 Z", "#E8604A", 0.8)}${E(22.6, 14.4, 1.7, 1.9, "#2A2420")}${E(23.1, 13.7, 0.65, 0.65, WHITE)}${E(21.6, 18, 1.1, 0.6, "#F29E9A").replace("/>", ' opacity=".7"/>')}<path d="M26,17.6 Q26.7,18 26.1,18.6" fill="none" stroke="${OUT}" stroke-width="0.6"/></g>` + P("M26,6 q1.4,2 0,3 q-1.4,-1 0,-3 Z", "#BFE6FF", 0.5);
      }
      return "";
    }
    __name(objet, "objet");
    function tuile(k, id, anim = true) {
      const c = SORTES[k];
      const reflet = anim ? `<g opacity="0">${etoile(24, 8, 2.4, c.lueur === "#FFFFFF" ? "#FFFFFF" : "#FFFBE8")}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.08;0.16;1" dur="4s" begin="${f(k.length * 0.37 % 1 * 4)}s" repeatCount="indefinite"/></g>` : "";
      const souffle = anim ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -0.5;0 0" dur="2.4s" repeatCount="indefinite"/>` : "";
      return fond(k, id) + `<g>${souffle}${objet(k)}</g>` + reflet;
    }
    __name(tuile, "tuile");
    function choisie(k, id, anim = true) {
      const ring = `<path d="${CARRE}" fill="none" stroke="#FFD24A" stroke-width="2.2">${anim ? '<animate attributeName="stroke-opacity" values="1;.45;1" dur="0.8s" repeatCount="indefinite"/>' : ""}</path>`;
      return `<g transform="translate(16 16) scale(1.06) translate(-16 -16.6)">${fond(k, id)}${objet(k)}</g>` + ring + etoile(5, 5, 2) + etoile(27.4, 26.6, 1.6);
    }
    __name(choisie, "choisie");
    function cueillie(k, i, id) {
      const c = SORTES[k], t = (i + 1) / 4;
      let s = "";
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4 + 0.3, d = 6 + t * 12;
        s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d)}) rotate(${j * 45 + i * 30})" opacity="${f(1 - t * 0.8)}">${P("M0,-2 L1.4,0 L0,2 L-1.4,0 Z", c.fond[1], 0.5)}</g>`;
      }
      if (i === 0) s += `<g transform="translate(16 16) scale(1.12) translate(-16 -16)">${fond(k, id)}${objet(k)}</g>`;
      else s += `<g transform="translate(16 ${f(16 - i * 4)}) scale(${f(1 - i * 0.18)}) translate(-16 -16)">${objet(k)}</g>`;
      return s + (i === 1 ? etoile(16, 16, 6) : "");
    }
    __name(cueillie, "cueillie");
    var atterrit = /* @__PURE__ */ __name((k, i, id) => `<g transform="translate(16 29.5) scale(${i ? "0.97 1.04" : "1.08 0.88"}) translate(-16 -29.5)">${fond(k, id)}${objet(k)}</g>` + (i === 0 ? `<path d="M4,30 L1.4,31.4 M28,30 L30.6,31.4" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round" opacity=".6"/>` : ""), "atterrit");
    function chaine(i) {
      const t = (i + 1) / 4;
      let s = `<circle cx="16" cy="16" r="${f(6 + t * 16)}" fill="none" stroke="#FFE07A" stroke-width="${f(2.4 * (1 - t * 0.7))}" opacity="${f(1 - t * 0.7)}"/>`;
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4 + i * 0.2, d = 4 + t * 16;
        s += etoile(16 + Math.cos(a) * d, 16 + Math.sin(a) * d, f(2.6 * (1 - t * 0.5)), j % 2 ? "#FFE07A" : "#FFFBE8");
      }
      return s;
    }
    __name(chaine, "chaine");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var T = [0, 0, 32, 32];
    var LARGE = [-8, -8, 48, 48];
    for (const k of Object.keys(SORTES)) {
      const n = SORTES[k].nom;
      piece(`tuile-${k}`, `La tuile ${n} au repos (elle respire, en boucle)`, T, () => tuile(k, `rt${k}`));
      piece(`choisie-${k}`, `La tuile ${n} choisie (le liseré pulse, en boucle)`, T, () => choisie(k, `rc${k}`));
      for (let i = 0; i < 4; i++) piece(`cueillie-${k}_${i + 1}`, `La tuile ${n} cueillie`, LARGE, () => cueillie(k, i, `rq${k}${i}`), `cueillie-${k}`, 90);
      for (let i = 0; i < 2; i++) piece(`atterrit-${k}_${i + 1}`, `La tuile ${n} qui atterrit`, T, () => atterrit(k, i, `ra${k}${i}`), `atterrit-${k}`, 140);
    }
    for (let i = 0; i < 4; i++) piece(`chaine_${i + 1}`, "L'éclat d'une longue chaîne", LARGE, () => chaine(i), "chaine", 90);
    var TITRE = "La Récolte (le plateau de l'île)";
    var FOND = "#E8D8B4";
    var LISEZ_MOI = "La Récolte : une tuile a un cadre de 32 × 32 ; la tuile cueillie et l'éclat d'une longue chaîne ont un cadre de 48 × 48 centré sur la tuile (1,5 fois sa taille). Les sortes gardent les noms du jeu (stone, wood, water, food, fish). Boucles animées dans le SVG (SMIL) : la tuile au repos, la tuile choisie. Suites d'images à enchaîner une fois : la tuile cueillie, la tuile qui atterrit, l'éclat d'une longue chaîne.";
    module.exports = { SORTES, PIECES, TITRE, FOND, LISEZ_MOI, tuile, choisie, cueillie, atterrit, chaine, objet };
  }
});

// atelier/minijeu_recolte_plus.js
var require_minijeu_recolte_plus = __commonJS({
  "atelier/minijeu_recolte_plus.js"(exports, module) {
    var R = require_minijeu_recolte();
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var CARRE = "M6,2.5 L26,2.5 Q29.5,2.5 29.5,6 L29.5,26 Q29.5,29.5 26,29.5 L6,29.5 Q2.5,29.5 2.5,26 L2.5,6 Q2.5,2.5 6,2.5 Z";
    var fondTuile = /* @__PURE__ */ __name((id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path d="${CARRE}" fill="url(#${id})"${st(1)}/><path d="M6.4,4.4 L25.6,4.4" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`, "fondTuile");
    function gerbe(anim = true) {
      let epis = "";
      for (let i = -3; i <= 3; i++) {
        const x = 16 + i * 2.2, top = 6 + Math.abs(i) * 1.2;
        epis += `<path d="M16,20 Q${f(16 + i * 1.2)},14 ${f(x)},${f(top)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M16,20 Q${f(16 + i * 1.2)},14 ${f(x)},${f(top)}" fill="none" stroke="#E2B44E" stroke-width="0.7" stroke-linecap="round"/>` + [0, 1, 2].map((j) => E(x - i * 0.15, top + j * 1.7, 0.9, 1.3, "#F2C94C", 0.45)).join("");
      }
      const tiges = [-4, -2, 0, 2, 4].map((dx) => `<path d="M16,20 L${16 + dx},27" stroke="#C8962A" stroke-width="1.1" stroke-linecap="round"/>`).join("");
      return fondTuile("rg", "#FFF2C4", "#F2D88A") + `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-3 16 22;3 16 22;-3 16 22" dur="1.8s" repeatCount="indefinite"/>' : ""}${tiges}${epis}</g>` + P("M12.6,19 L19.4,19 L19,22.4 L13,22.4 Z", "#D8443A", 0.8) + P("M16,20.6 L13,25 M16,20.6 L19,25", "none", 0).replace('fill="none"', 'fill="none" stroke="#D8443A" stroke-width="1.4" stroke-linecap="round"');
    }
    __name(gerbe, "gerbe");
    function graine(anim = true) {
      const halo = `<circle cx="16" cy="16" r="12" fill="#FFF2B8" opacity=".5">${anim ? '<animate attributeName="r" values="10;13;10" dur="1.4s" repeatCount="indefinite"/>' : ""}</circle>`;
      const g = P("M16,6 Q23,9 22.6,17 Q22,25 16,26.6 Q10,25 9.4,17 Q9,9 16,6 Z", "#F2C94C", 1.1) + `<path d="M16,7.6 Q19,16 16,25" fill="none" stroke="#C8962A" stroke-width="0.8"/><path d="M12,11 Q13,8.6 15,8" fill="none" stroke="${WHITE}" stroke-width="1.4" stroke-linecap="round"/>`;
      return fondTuile("rd", "#FFF8E0", "#F8E6A8") + halo + `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-8 16 16;8 16 16;-8 16 16" dur="2.2s" repeatCount="indefinite"/>' : ""}${g}</g>` + etoile(24, 7, 2.2) + etoile(7, 24, 1.6);
    }
    __name(graine, "graine");
    var ROC = "M5,26 Q3,16 9,10 Q15,4.6 22,7 Q29,10 28,19 Q28.4,26.4 22,28 Q13,29.4 5,26 Z";
    function rocher(etat) {
      let s = fondTuile("rr" + etat, "#D8D2C6", "#B8B0A2") + P(ROC, "#9A948A", 1.1) + `<path d="M8,14 Q12,9.4 17,9" fill="none" stroke="#C8C2B6" stroke-width="1.6" stroke-linecap="round"/>` + E(20, 21, 2, 1.2, "#7E786E");
      if (etat >= 1) s += `<path d="M16,8 L14.4,13 L17.2,16 L14.6,21 L16.8,27" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
      return s;
    }
    __name(rocher, "rocher");
    function rocherCasse(k) {
      const t = (k + 1) / 3;
      let s = "";
      const morceaux = [["M5,26 Q3,16 9,10 L15,12 L14,20 Z", -1, -0.6], ["M9,10 Q15,4.6 22,7 L18,14 L15,12 Z", 0.2, -1], ["M22,7 Q29,10 28,19 L20,18 L18,14 Z", 1, -0.5], ["M5,26 L14,20 L20,24 L22,28 Q13,29.4 5,26 Z", -0.4, 1], ["M20,18 L28,19 Q28.4,26.4 22,28 L20,24 Z", 1, 0.8]];
      morceaux.forEach(([d, dx, dy]) => {
        s += `<g transform="translate(${f(dx * t * 9)} ${f(dy * t * 6 + t * t * 2)}) rotate(${f(dx * t * 40)} 16 18)" opacity="${f(1 - Math.max(0, t - 0.5) * 1.6)}">${P(d, "#9A948A", 0.9)}</g>`;
      });
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05, d = 6 + t * 14;
        s += E(16 + Math.cos(a) * d, 17 + Math.sin(a) * d * 0.8, 3 + t * 3, 2 + t * 2, "#DDD6C8").replace("/>", ` opacity="${f(0.6 * (1 - t))}"/>`);
      }
      return s + (k === 0 ? etoile(16, 16, 6) : "");
    }
    __name(rocherCasse, "rocherCasse");
    function ronce(n) {
      const k = [0.4, 0.75, 1][n];
      let s = "";
      const tiges = [["M3,28 Q9,20 8,12 Q8,6 14,4", "#7A3A4A"], ["M29,26 Q22,22 23,14 Q24,7 18,5", "#7A3A4A"], ["M6,6 Q12,14 20,16 Q26,18 28,28", "#8A4A5A"]];
      tiges.slice(0, n + 1).forEach(([d, c]) => {
        s += `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="${f(40 * k)} 60"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="${f(40 * k)} 60"/>`;
      });
      const pts = [[7, 20], [9, 10], [23, 20], [21, 9], [14, 14], [24, 22]].slice(0, 2 + n * 2);
      pts.forEach(([x, y], i) => {
        s += `<path d="M${x},${y} l1.6,-1 l-0.4,1.8 Z" fill="#E8E0D0" stroke="${OUT}" stroke-width="0.4"/>`;
        if (i % 2) s += P(`M${x + 1},${y + 1} q2.4,-2.2 4,0 q-2,2 -4,0 Z`, "#5E9A3C", 0.5);
      });
      if (n === 2) s += [[11, 7], [25, 16]].map(([x, y]) => E(x, y, 1.2, 1.2, "#4A2A5A", 0.4) + E(x + 1.4, y + 0.4, 1.1, 1.1, "#4A2A5A", 0.4)).join("");
      return s;
    }
    __name(ronce, "ronce");
    function ronceCoupee(k) {
      const t = (k + 1) / 3;
      let s = "";
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i - 2) * 0.6, d = 4 + t * 12;
        s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d + t * t * 8)}) rotate(${f(i * 70 + t * 160)})" opacity="${f(1 - t * 0.7)}"><path d="M-3,0 L3,0" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="M-3,0 L3,0" stroke="#7A3A4A" stroke-width="1" stroke-linecap="round"/></g>`;
      }
      if (k === 0) s += `<path d="M4,26 L28,6" stroke="${WHITE}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
      return s;
    }
    __name(ronceCoupee, "ronceCoupee");
    function onde(k) {
      const x = 16 + k * 52;
      return `<rect x="0" y="8" width="192" height="16" rx="8" fill="#FFF2B8" opacity="${f(0.35 - k * 0.06)}"/><g transform="translate(${x} 16)">${P("M-10,0 Q0,-9 10,0 Q0,9 -10,0 Z", "#FFE07A", 0.6).replace("/>", ' opacity=".85"/>')}</g>` + [0, 1, 2].map((i) => etoile(x - 14 - i * 10, 16 + (i % 2 ? -4 : 4), 2.4 - i * 0.6)).join("");
    }
    __name(onde, "onde");
    function cascade(k) {
      const t = (k + 1) / 4;
      let s = k < 2 ? etoile(16, 8 - k * 3, 4 - k * 1.2, "#FFE07A") : "";
      for (let i = 0; i < 7; i++) {
        const x = -3 + i * 6.3, y = -2 + t * 30 + i % 3 * 3;
        s += P(`M${f(x)},${f(y - 4.4)} Q${f(x + 2.8)},${f(y)} ${f(x)},${f(y + 2)} Q${f(x - 2.8)},${f(y)} ${f(x)},${f(y - 4.4)} Z`, i % 2 ? "#BFE6FF" : "#FFE07A", 0.4).replace("/>", ` opacity="${f(1 - t * 0.6)}"/>`);
      }
      return s;
    }
    __name(cascade, "cascade");
    var planchette = /* @__PURE__ */ __name(() => `<path d="M12,7 L48,1.4 L84,7" fill="none" stroke="#8A6A4A" stroke-width="0.9"/>` + P("M3,7 L93,7 Q95,7 95,9 L95,41 Q95,43 93,43 L3,43 Q1,43 1,41 L1,9 Q1,7 3,7 Z", "#C8925A", 1.2) + `<path d="M3,16 L93,16 M3,30 L93,30" stroke="#9A6A3A" stroke-width="0.6"/>` + E(12, 7, 1.8, 1.8, "#A8B0BA", 0.8) + E(84, 7, 1.8, 1.8, "#A8B0BA", 0.8), "planchette");
    function caseCommande(k, fait) {
      let s = `<g transform="translate(5 8.4) scale(0.6)">${R.objet(k)}</g>`;
      s += P("M2,32 L26,32 Q27,32 27,33 L27,39.4 Q27,40.4 26,40.4 L2,40.4 Q1,40.4 1,39.4 L1,33 Q1,32 2,32 Z", fait ? "#CDE8B4" : "#F4EBD2", 0.7);
      if (fait) s += `<path d="M21,27.4 l2,2 l4,-4.2" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21,27.4 l2,2 l4,-4.2" fill="none" stroke="#5FA548" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`;
      return s;
    }
    __name(caseCommande, "caseCommande");
    var fil = /* @__PURE__ */ __name((diag, anim = true) => {
      const d = diag ? "M4,28 L28,4" : "M0,16 L32,16";
      return `<path d="${d}" stroke="${OUT}" stroke-width="5" stroke-linecap="round" opacity=".35"/><path d="${d}" stroke="#FFD24A" stroke-width="3" stroke-linecap="round"/><path d="${d}" stroke="#FFF6C8" stroke-width="1" stroke-linecap="round" stroke-dasharray="3 5">${anim ? '<animate attributeName="stroke-dashoffset" values="0;-16" dur=".6s" repeatCount="indefinite"/>' : ""}</path>`;
    }, "fil");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var T = [0, 0, 32, 32];
    var LARGE = [-8, -8, 48, 48];
    piece("gerbe", "La gerbe (chaîne de 6 ; ses épis ondulent, en boucle)", T, () => gerbe());
    piece("graine", "La graine dorée (chaîne de 9 ; elle luit, en boucle)", T, () => graine());
    piece("rocher", "Le rocher", T, () => rocher(0));
    piece("rocher_fendu", "Le rocher fendu", T, () => rocher(1));
    for (let k = 0; k < 3; k++) piece(`rocher-casse_${k + 1}`, "Le rocher qui casse", LARGE, () => rocherCasse(k), "rocher-casse", 110);
    for (let n = 0; n < 3; n++) piece(`ronce_${n + 1}`, "La ronce qui pousse (par-dessus la tuile ; la dernière image reste)", T, () => ronce(n), "ronce", 300);
    for (let k = 0; k < 3; k++) piece(`ronce-coupee_${k + 1}`, "La ronce coupée", T, () => ronceCoupee(k), "ronce-coupee", 110);
    for (let k = 0; k < 4; k++) piece(`onde_${k + 1}`, "L'onde de la gerbe sur sa ligne", [0, 0, 192, 32], () => onde(k), "onde", 90);
    for (let k = 0; k < 4; k++) piece(`cascade_${k + 1}`, "L'éclat d'une cascade", LARGE, () => cascade(k), "cascade", 110);
    piece("fil", "Le fil doré de la chaîne, droit (il brille, en boucle)", T, () => fil(false));
    piece("fil_diagonale", "Le fil doré de la chaîne, en diagonale (il brille, en boucle)", T, () => fil(true));
    piece("commande", "Le panneau de la commande (trois cases)", [0, 0, 96, 44], planchette);
    for (const k of Object.keys(R.SORTES)) for (const fait of [false, true]) piece(`commande-${k}${fait ? "_faite" : ""}`, `Une case de la commande : ${R.SORTES[k].nom}${fait ? ", faite" : ""}`, [0, 0, 30, 44], () => caseCommande(k, fait));
    var LISEZ_MOI = "La Récolte, nouvelle version (design/conception/minijeux_grille.md) : la gerbe, la graine dorée, le rocher et le rocher fendu ont le cadre d'une tuile (32 × 32). La ronce et la ronce coupée se posent par-dessus la tuile qu'elles prennent. Le rocher qui casse et l'éclat d'une cascade : 48 × 48 centrés sur la tuile. L'onde de la gerbe : 192 × 32 sur sa ligne (tournée d'un quart pour sa colonne). Le fil doré : 32 × 32 centré sur le lien entre deux tuiles (droit : tourné d'un quart à la verticale ; en diagonale : retourné pour l'autre sens). La commande : le panneau (96 × 44) et, par-dessus, une case par ressource (30 × 44, en x = 4 + 30 × i) ; le jeu écrit le compte dans l'étiquette.";
    module.exports = { PIECES, LISEZ_MOI, gerbe, graine, rocher, rocherCasse, ronce, ronceCoupee, onde, cascade, planchette, caseCommande, fil };
  }
});

// atelier/minijeu_arrimage.js
var require_minijeu_arrimage = __commonJS({
  "atelier/minijeu_arrimage.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var C = 16;
    var FORMES = {
      I: [[0, 1], [1, 1], [2, 1], [3, 1]],
      O: [[1, 0], [2, 0], [1, 1], [2, 1]],
      T: [[1, 0], [0, 1], [1, 1], [2, 1]],
      S: [[1, 0], [2, 0], [0, 1], [1, 1]],
      Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
      J: [[0, 0], [0, 1], [1, 1], [2, 1]],
      L: [[2, 0], [0, 1], [1, 1], [2, 1]]
    };
    var tourne = /* @__PURE__ */ __name((cases, r) => {
      let c = cases;
      for (let i = 0; i < r; i++) c = c.map(([x, y]) => [3 - y, x]);
      const mx = Math.min(...c.map((p) => p[0])), my = Math.min(...c.map((p) => p[1]));
      return c.map(([x, y]) => [x - mx, y - my]);
    }, "tourne");
    var SORTES = {
      caisse: { nom: "caisse (bois)", fond: "#C8925A", clair: "#E2B47A", fonce: "#8A5A32" },
      tonneau: { nom: "tonneau (eau)", fond: "#9A6440", clair: "#C08A5E", fonce: "#5E3A22", cercle: "#A8B0BA" },
      sac: { nom: "sac (nourriture)", fond: "#E2CC98", clair: "#F4E4B8", fonce: "#B89E68" },
      lest: { nom: "lest (pierre)", fond: "#A8A298", clair: "#CFCAC0", fonce: "#78726A" }
    };
    function caseDe(sorte, x, y, voisins) {
      const c = SORTES[sorte], X = x * C, Y = y * C;
      let s = `<rect x="${X}" y="${Y}" width="${C}" height="${C}" fill="${c.fond}"/>`;
      if (sorte === "caisse") s += `<path d="M${X},${Y + 5.3} L${X + C},${Y + 5.3} M${X},${Y + 10.7} L${X + C},${Y + 10.7}" stroke="${c.fonce}" stroke-width="0.6"/><path d="M${X + 1},${Y + 1.4} L${X + C - 1},${Y + 1.4}" stroke="${c.clair}" stroke-width="0.8"/>` + [[3, 3], [13, 3], [3, 13], [13, 13]].map(([a, b2]) => E(X + a, Y + b2, 0.6, 0.6, c.fonce)).join("") + `<path d="M${X + 2},${Y + 2} L${X + C - 2},${Y + C - 2}" stroke="${c.fonce}" stroke-width="1.2" opacity=".5"/>`;
      if (sorte === "tonneau") s += `<rect x="${X + 1.5}" y="${Y + 1}" width="${C - 3}" height="${C - 2}" rx="5" fill="${c.clair}" stroke="${c.fonce}" stroke-width="0.7"/><path d="M${X + 1.5},${Y + 4.4} L${X + C - 1.5},${Y + 4.4} M${X + 1.5},${Y + 11.6} L${X + C - 1.5},${Y + 11.6}" stroke="${c.cercle}" stroke-width="1.4"/><path d="M${X + 5.4},${Y + 1.4} L${X + 5.4},${Y + 14.6} M${X + 10.6},${Y + 1.4} L${X + 10.6},${Y + 14.6}" stroke="${c.fonce}" stroke-width="0.5" opacity=".6"/>` + E(X + 4, Y + 7.6, 0.9, 1.6, WHITE).replace("/>", ' opacity=".35"/>');
      if (sorte === "sac") s += `<path d="M${X + 1.5},${Y + 3} Q${X + 8},${Y - 0.6} ${X + C - 1.5},${Y + 3} Q${X + C + 0.6},${Y + 8} ${X + C - 1.5},${Y + 13} Q${X + 8},${Y + C + 0.6} ${X + 1.5},${Y + 13} Q${X - 0.6},${Y + 8} ${X + 1.5},${Y + 3} Z" fill="${c.clair}" stroke="${c.fonce}" stroke-width="0.6"/><path d="M${X + 4},${Y + 5} l1,1 M${X + 9},${Y + 9} l1,1 M${X + 6},${Y + 11} l1,-1 M${X + 11},${Y + 4} l-1,1" stroke="${c.fonce}" stroke-width="0.5"/>` + E(X + 5, Y + 5.4, 1.6, 1, WHITE).replace("/>", ' opacity=".35"/>');
      if (sorte === "lest") s += `<path d="M${X + 1},${Y + 1} L${X + C - 1},${Y + 1} L${X + C - 1},${Y + C - 1} L${X + 1},${Y + C - 1} Z" fill="${c.fond}" stroke="${c.fonce}" stroke-width="0.6"/><path d="M${X + 3},${Y + 6} Q${X + 7},${Y + 4} ${X + 12},${Y + 7} M${X + 4},${Y + 11} Q${X + 8},${Y + 13} ${X + 13},${Y + 10.6}" fill="none" stroke="${c.fonce}" stroke-width="0.6" opacity=".7"/><path d="M${X + 2},${Y + 2.4} L${X + 9},${Y + 2.4}" stroke="${c.clair}" stroke-width="1" stroke-linecap="round"/>`;
      const [h, d, b, g] = voisins;
      let o = "";
      if (!h) o += `M${X},${Y} L${X + C},${Y} `;
      if (!d) o += `M${X + C},${Y} L${X + C},${Y + C} `;
      if (!b) o += `M${X},${Y + C} L${X + C},${Y + C} `;
      if (!g) o += `M${X},${Y} L${X},${Y + C} `;
      return s + (o ? `<path d="${o}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linecap="square"/>` : "");
    }
    __name(caseDe, "caseDe");
    var marqueFragile = /* @__PURE__ */ __name(() => `<g transform="translate(8 8)">${P("M-4,-2 L4,-2 L4,2 L-4,2 Z", "#E8504A", 0.6)}<path d="M-1,-1 L0,0.6 L1,-1" fill="none" stroke="${WHITE}" stroke-width="0.6"/></g>`, "marqueFragile");
    function marchandise(forme, r, sorte, px = 0, py = 0, fragile = false) {
      const cases = tourne(FORMES[forme], r), has = /* @__PURE__ */ __name((x, y) => cases.some(([a, b]) => a === x && b === y), "has");
      let s = cases.map(([x, y]) => caseDe(sorte, px + x, py + y, [has(x, y - 1), has(x + 1, y), has(x, y + 1), has(x - 1, y)])).join("");
      if (fragile) {
        const [x, y] = cases[1];
        s += `<g transform="translate(${(px + x) * C} ${(py + y) * C})">${marqueFragile()}</g>`;
      }
      return s;
    }
    __name(marchandise, "marchandise");
    var ombreCase = /* @__PURE__ */ __name((x = 0, y = 0) => `<rect x="${x * C + 1}" y="${y * C + 1}" width="${C - 2}" height="${C - 2}" rx="2" fill="#FFFFFF" fill-opacity=".12" stroke="#FFFFFF" stroke-width="0.8" stroke-dasharray="2 1.4" opacity=".8"/>`, "ombreCase");
    var ombre = /* @__PURE__ */ __name((forme, r, px, py) => tourne(FORMES[forme], r).map(([x, y]) => ombreCase(px + x, py + y)).join(""), "ombre");
    function cale(anim = true) {
      let s = `<defs><linearGradient id="calefond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E3E26"/><stop offset="1" stop-color="#3E2818"/></linearGradient></defs><rect x="0" y="0" width="128" height="224" fill="url(#calefond)"/>`;
      for (let y = 0; y < 224; y += 9) s += `<path d="M0,${y} L128,${y}" stroke="#2E1E12" stroke-width="0.6" opacity=".7"/><path d="M0,${y + 1} L128,${y + 1}" stroke="#7A5A3A" stroke-width="0.4" opacity=".4"/>`;
      for (const x of [0, 64, 128]) s += `<rect x="${x - 3}" y="0" width="6" height="224" fill="#4A3020" opacity=".55"/>`;
      for (let y = 18; y < 224; y += 36) for (const x of [32, 96]) s += E(x, y, 0.9, 0.9, "#2E1E12");
      const lant = `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-6 64 0;6 64 0;-6 64 0" dur="3s" repeatCount="indefinite"/>' : ""}<path d="M64,0 L64,8" stroke="${OUT}" stroke-width="0.8"/><circle cx="64" cy="20" r="26" fill="#FFD27A" opacity=".12"/>${P("M60,8 L68,8 L69,10 L59,10 Z", "#5A5A5A", 0.6)}${P("M59.4,10 L68.6,10 L67.6,19 L60.4,19 Z", "#FFE8A8", 0.7)}${E(64, 14.6, 1.6, 2.6, "#FFB040")}${P("M59,19 L69,19 L68,21 L60,21 Z", "#5A5A5A", 0.6)}</g>`;
      s += lant;
      return s;
    }
    __name(cale, "cale");
    function maree(niveau, anim = true) {
      const h = 8 + niveau * 64;
      return `<rect x="0" y="${224 - h}" width="128" height="${h}" fill="#3A8AC0" opacity=".38"/><g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;-16 0" dur="1.6s" repeatCount="indefinite"/>' : ""}<path d="M0,${224 - h} q8,-2.4 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0" fill="none" stroke="#BFE8FA" stroke-width="1.2" opacity=".85"/></g>`;
    }
    __name(maree, "maree");
    function arrime(k) {
      if (k === 0) return `<path d="M-2,3 Q64,7 130,3 M-2,13 Q64,9 130,13" fill="none" stroke="#E8D8B0" stroke-width="1.4" stroke-dasharray="2 1"/>`;
      if (k === 1) return `<path d="M0,4 L128,4 M0,12 L128,12" stroke="#E8D8B0" stroke-width="1.8"/><rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity=".35"/>`;
      if (k === 2) return `<rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity=".75"/>` + [8, 40, 72, 104].map((x) => `<path d="M${x},8 l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 Z" fill="#FFFBE8"/>`).join("");
      return [12, 44, 76, 108].map((x, i) => `<g transform="translate(${x + i * 3} ${-4 - i})" opacity=".6"><path d="M0,8 l2,-4 l2,4 l4,2 l-4,2 l-2,4 l-2,-4 l-4,-2 Z" fill="#FFE07A"/></g>`).join("");
    }
    __name(arrime, "arrime");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var CASE = [0, 0, 16, 16];
    piece("cale", "La cale (8 × 14 cases ; la lanterne balance, en boucle)", [0, 0, 128, 224], () => cale());
    for (const k of Object.keys(SORTES)) for (let m = 0; m < 16; m++) piece(`case-${k}_${m}`, `Une case de ${SORTES[k].nom}, voisines ${m}`, CASE, () => caseDe(k, 0, 0, [m & 1, m & 2, m & 4, m & 8]));
    piece("ombre", "L'ombre de pose (une case)", CASE, () => ombreCase());
    piece("fragile", "La marque d'une marchandise fragile (par-dessus une case)", CASE, marqueFragile);
    for (let n = 0; n < 10; n++) piece(`maree_${n}`, `La marée, cran ${n} (par-dessus la cale ; les vaguelettes défilent, en boucle)`, [0, 0, 128, 224], () => maree(n / 9));
    for (let k = 0; k < 4; k++) piece(`arrime_${k + 1}`, "La rangée arrimée (par-dessus la rangée)", [0, 0, 128, 16], () => arrime(k), "arrime", 140);
    var TITRE = "L'Arrimage (la cale du bateau)";
    var FOND = "#3E2818";
    var LISEZ_MOI = "L'Arrimage : une case a un cadre de 16 × 16, la cale 128 × 224 (8 × 14 cases). Une marchandise se compose de 4 cases de sa sorte (caisse, tonneau, sac, lest) : case-<sorte>_<masque>, où le masque dit quelles voisines sont de la même pièce (haut 1, droite 2, bas 4, gauche 8) ; la case n'a de contour que là où la pièce s'arrête. Par-dessus les cases : l'ombre de pose, la marque fragile. La marée (10 crans) se pose par-dessus la cale et les marchandises. La rangée arrimée (128 × 16) se pose par-dessus la rangée ; le jeu la retire à la dernière image.";
    module.exports = { FORMES, SORTES, PIECES, TITRE, FOND, LISEZ_MOI, tourne, caseDe, marchandise, marqueFragile, ombreCase, ombre, cale, maree, arrime };
  }
});

// atelier/minijeu_arrimage_plus.js
var require_minijeu_arrimage_plus = __commonJS({
  "atelier/minijeu_arrimage_plus.js"(exports, module) {
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var L = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "L");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var brille = /* @__PURE__ */ __name((x, y, r, dur, begin) => `<g opacity="0" transform="translate(${f(x)} ${f(y)})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`, "brille");
    var goutte = /* @__PURE__ */ __name((x, y, r, c = "#9ED8F6") => P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.1)},${f(y - r * 0.2)} ${f(x + r)},${f(y + r * 0.3)} Q${f(x + r)},${f(y + r)} ${f(x)},${f(y + r)} Q${f(x - r)},${f(y + r)} ${f(x - r)},${f(y + r * 0.3)} Q${f(x - r * 1.1)},${f(y - r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, c, 0.5) + E(x - r * 0.35, y - r * 0.1, r * 0.25, r * 0.35, WHITE), "goutte");
    var CORPS = "M-96,50 L-96,40 Q-70,39 -46,35 Q-26,30 -12,20 Q-2,10 8,5 Q20,0 29,6 Q36,12 32,20 Q28,26 21,24 Q15,22 17,16 Q19,12 23,13 Q19,8 13,11 Q6,15 6,26 Q8,40 26,50 Z";
    function vague(k) {
      const id = `vg${k}`;
      let s = `<defs>${lin(id, [[0, "#5EC2EC"], [0.55, "#2E8AC4"], [1, "#1E5E96"]])}${lin(id + "c", [[0, "#C8F0FF"], [1, "#6AC4EC"]])}</defs>`;
      if (k < 3) {
        const x = [10, 50, 90][k], sc = [0.8, 1, 1.04][k];
        s += `<g transform="translate(${x} 3) scale(${sc} 1)">`;
        s += P(CORPS, `url(#${id})`, 1.2);
        s += P("M8,10 Q18,4 26,9 Q30,14 26,19 Q22,22 19,19 Q17,15 21,14 Q18,10 12,13 Q8,17 9,26 Q6,18 8,10 Z", `url(#${id}c)`, 0);
        s += L("M-96,40 Q-70,39 -46,35 Q-26,30 -12,20 Q-2,10 8,5 Q20,0 29,6 Q35,11 32,18", WHITE, 3.2) + L("M-40,33 Q-24,29 -12,20 Q-2,10 8,5", "#DFF6FF", 1.2, ' opacity=".9"');
        s += [[-34, 30, 2.4], [-24, 26, 2], [-14, 19, 2.6], [-5, 12, 2], [4, 7, 1.6], [30, 10, 1.6]].map(([a, b, r]) => E(a, b, r, r * 0.85, WHITE, 0.6) + E(a - r * 0.3, b - r * 0.3, r * 0.3, r * 0.25, "#DFF6FF")).join("");
        s += L("M-30,42 Q-16,36 -8,28", "#9EDCF8", 1.6, ' opacity=".8"') + L("M-20,46 Q-6,40 0,32", "#9EDCF8", 1.1, ' opacity=".6"');
        s += "</g>";
        if (k === 2) s += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = -Math.PI * (0.1 + i * 0.11);
          return goutte(x + 26 + Math.cos(a) * 15, 21 + Math.sin(a) * 13, 2.2 - i % 3 * 0.3, i % 2 ? "#C8F0FF" : "#9ED8F6");
        }).join("") + etoile(x + 30, 4, 3);
        if (k === 1) s += etoile(x + 30, 6, 2.4);
      } else {
        s += [[18, 28, 2.2], [40, 20, 1.8], [62, 32, 2.4], [86, 22, 2], [108, 30, 2.2]].map(([a, b, r], i) => goutte(a, b, r, i % 2 ? "#C8F0FF" : "#9ED8F6")).join("");
        s += `<path d="M0,44 Q8,40 16,44 T32,44 T48,44 T64,44 T80,44 T96,44 T112,44 T128,44 L128,48 L0,48 Z" fill="#DFF6FF" opacity=".75"/>` + L("M0,44 Q8,40 16,44 T32,44 T48,44 T64,44 T80,44 T96,44 T112,44 T128,44", WHITE, 1.4);
        s += [[26, 40], [70, 41], [104, 40]].map(([a, b]) => E(a, b, 1.6, 1.4, WHITE, 0.5)).join("") + etoile(52, 12, 2.4) + etoile(98, 10, 1.8);
      }
      return s;
    }
    __name(vague, "vague");
    function alerte(anim = true) {
      let s = `<defs>${rad("alr", [[0, "#FF8A7A"], [0.6, "#E8504A"], [1, "#B8302E"]])}${lin("alb", [[0, "#E2B47A"], [1, "#9A6440"]])}${lin("alw", [[0, "#5EC2EC"], [1, "#2E7AB4"]])}</defs>`;
      if (anim) s += `<circle cx="16" cy="16" r="13" fill="none" stroke="#FF8A7A" stroke-width="1.6" opacity="0"><animate attributeName="r" values="13;16" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1s" repeatCount="indefinite"/></circle>`;
      let m = E(16, 16, 14, 14, "url(#alb)", 1.2) + E(16, 16, 11.4, 11.4, "url(#alr)", 0.9) + E(16, 16, 8.6, 8.6, "#FFF4EC", 0.7);
      m += `<defs><clipPath id="alc"><circle cx="16" cy="16" r="8.2"/></clipPath></defs><g clip-path="url(#alc)">${P("M6,26 L6,19 Q9,18 11,15 Q13,11 17,10.6 Q21,10.6 22,14 Q22.6,17 20,17.6 Q18,17.8 17.8,16 Q17.8,14.6 19.2,14.6 Q17.4,12.8 15.4,14.4 Q13.6,16.4 15,20 Q17,22.6 24,23 L26,26 Z", "url(#alw)", 0.8)}${L("M7,19 Q9,18 11,15 Q13,11 17,10.6 Q21,10.6 22,14", WHITE, 1.3)}${E(9.6, 17.4, 0.9, 0.8, WHITE)}${E(12.6, 13.4, 0.8, 0.7, WHITE)}</g>`;
      m += L("M8.4,10.6 Q10.6,7.6 14,6.6", WHITE, 1.4, ' opacity=".75"') + [[7, 16], [25, 16], [16, 7.2], [16, 24.8]].map(([x, y]) => E(x, y, 0.7, 0.7, "#F6D4A0", 0.3)).join("");
      return s + `<g transform-origin="16 16">${anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="0.5s" repeatCount="indefinite"/>' : ""}${m}</g>`;
    }
    __name(alerte, "alerte");
    function suivante() {
      let s = `<defs>${lin("suP", [[0, "#C8925A"], [1, "#8A5A32"]])}${rad("suL", [[0, "#FFF0B8"], [0.5, "#E2B44E"], [1, "#9A6A20"]], 0.35, 0.3, 0.8)}${lin("suM", [[0, "#3E7FA8"], [0.6, "#24506E"], [1, "#183A52"]])}</defs>`;
      s += P("M6,2 L42,2 Q46,2 46,6 L46,42 Q46,46 42,46 L6,46 Q2,46 2,42 L2,6 Q2,2 6,2 Z", "url(#suP)", 1.2);
      s += [12, 24, 36].map((y) => L(`M3,${y} L45,${y}`, "#7A4E2A", 0.6, ' opacity=".6"')).join("") + L("M6,4.6 L42,4.6", "#F2D0A0", 1, ' opacity=".7"');
      s += E(24, 24.8, 20.6, 20.6, "#5E3A22").replace("/>", ' opacity=".35"/>');
      s += E(24, 24, 20, 20, "url(#suL)", 1.2) + E(24, 24, 15.6, 15.6, "#8A5A1A", 0.8) + E(24, 24, 14.6, 14.6, "url(#suM)", 0.6);
      s += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = i * Math.PI / 4 + Math.PI / 8, x = 24 + Math.cos(a) * 17.8, y = 24 + Math.sin(a) * 17.8;
        return E(x, y, 1.3, 1.3, "#C89A3A", 0.5) + E(x - 0.4, y - 0.4, 0.45, 0.45, "#FFF6D0");
      }).join("");
      s += `<path d="M10,32 Q14,30 18,32 T26,32 T34,32 T42,32 L42,38 Q24,42 10,38 Z" fill="#3E8AB8" opacity=".55"/>`;
      s += L("M13,18 L21,10", WHITE, 2.2, ' opacity=".35"') + L("M16,21 L25,12", WHITE, 1, ' opacity=".3"') + L("M9.6,24 Q10,16 16,11.4", "#FFF6D0", 1.2, ' opacity=".55"');
      return s;
    }
    __name(suivante, "suivante");
    function miseDeCote(bloquee = false) {
      const p = bloquee ? "mb" : "mc";
      let s = `<defs>${lin(p + "B", [[0, "#E2B47A"], [0.5, "#C08A5A"], [1, "#8A5A32"]])}${lin(p + "I", [[0, "#3A2414"], [1, "#6A4628"]])}${lin(p + "F", [[0, "#D8DEE6"], [1, "#8A949E"]])}${lin(p + "C", [[0, "#F2E2B8"], [1, "#C8AE78"]])}</defs>`;
      s += E(24, 45.4, 20, 2, "rgba(60,40,20,.2)");
      s += P("M4,8 Q4,5 7,5 L41,5 Q44,5 44,8 L44,42 Q44,45 41,45 L7,45 Q4,45 4,42 Z", `url(#${p}B)`, 1.2);
      s += P("M9,10 L39,10 L39,40 L9,40 Z", `url(#${p}I)`, 0.9) + P("M9,10 L39,10 L36,14 L12,14 Z", "#2A180C", 0).replace("/>", ' opacity=".5"/>');
      s += [17, 27].map((y) => L(`M4.6,${y} L8.6,${y} M39.4,${y} L43.4,${y}`, "#8A5A32", 0.8)).join("") + [[6, 24], [42, 24]].map(([x, y]) => L(`M${x},${y - 4} Q${x + 0.6},${y} ${x},${y + 4}`, "#A8784A", 0.5, ' opacity=".7"')).join("");
      s += L("M7,6.6 L41,6.6", "#F6D8A8", 1.1, ' opacity=".8"');
      for (const [x, y, sx, sy] of [[4, 5, 1, 1], [44, 5, -1, 1], [4, 45, 1, -1], [44, 45, -1, -1]]) s += `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${P("M0,3 Q0,0 3,0 L9,0 L9,2.6 L2.6,2.6 L2.6,9 L0,9 Z", `url(#${p}F)`, 0.7)}${E(1.4, 1.4, 0.6, 0.6, "#FFFFFF")}${E(6.6, 1.3, 0.45, 0.45, "#5A626C")}${E(1.3, 6.6, 0.45, 0.45, "#5A626C")}</g>`;
      s += `<g transform="translate(36 8)">${E(0, 0, 7, 3.6, `url(#${p}C)`, 0.9)}${E(0, -0.2, 4.6, 2.2, "none").replace('fill="none"', 'fill="none" stroke="#A88A5A" stroke-width="0.8"')}${E(0, -0.3, 2.2, 1, "#8A6A3A")}${L("M-5,-1.6 Q-2,-3.2 2,-3", WHITE, 0.8, ' opacity=".7"')}${L("M6,1 Q9,4 7,8", `url(#${p}C)`, 1.6)}</g>`;
      if (bloquee) {
        s += P("M9,10 L39,10 L39,40 L9,40 Z", "#1E140C", 0).replace("/>", ' opacity=".55"/>');
        s += `<defs>${lin("mbL", [[0, "#FFE8A0"], [0.5, "#E2B44E"], [1, "#A0741E"]])}</defs><g transform="translate(24 26)">${L("M-4.4,-1 L-4.4,-5 Q-4.4,-9.6 0,-9.6 Q4.4,-9.6 4.4,-5 L4.4,-1", "#A8B0BA", 2.4)}${L("M-4.4,-1 L-4.4,-5 Q-4.4,-9.6 0,-9.6 Q4.4,-9.6 4.4,-5 L4.4,-1", OUT, 0.6, ' opacity=".5"')}${P("M-7,-2 Q-7,-3.4 -5.6,-3.4 L5.6,-3.4 Q7,-3.4 7,-2 L7,6 Q7,8 5,8 L-5,8 Q-7,8 -7,6 Z", "url(#mbL)", 1)}${E(0, 1.6, 1.4, 1.6, OUT)}${P("M-0.6,2.4 L0.6,2.4 L0.9,5 L-0.9,5 Z", OUT, 0)}${L("M-5.4,-1.6 L-2,-1.6", WHITE, 1, ' opacity=".7"')}</g>`;
      }
      return s;
    }
    __name(miseDeCote, "miseDeCote");
    function caisse(x, y, s = 1) {
      return `<g transform="translate(${x} ${y}) scale(${s})">${P("M-6,-6 Q-6,-7 -5,-7 L5,-7 Q6,-7 6,-6 L6,5 Q6,6 5,6 L-5,6 Q-6,6 -6,5 Z", "url(#bcC)", 0.8)}${L("M-6,-2.4 L6,-2.4 M-6,1.8 L6,1.8", "#8A5A32", 0.5)}${L("M-5,-6 L5,5", "#8A5A32", 0.9, ' opacity=".55"')}${L("M-5,-6 L5,-6", "#F6D8A8", 0.8)}</g>`;
    }
    __name(caisse, "caisse");
    function tonneau(x, y, s = 1) {
      return `<g transform="translate(${x} ${y}) scale(${s})">${P("M-5,-7 Q-6.6,-0.5 -5,6 L5,6 Q6.6,-0.5 5,-7 Z", "url(#bcT)", 0.8)}${L("M-5.6,-4 L5.6,-4 M-5.6,3 L5.6,3", "#A8B0BA", 1.3)}${L("M-1.6,-6.6 L-1.6,5.6 M1.8,-6.6 L1.8,5.6", "#5E3A22", 0.4, ' opacity=".7"')}${E(-3, -1, 0.7, 2, WHITE).replace("/>", ' opacity=".35"/>')}</g>`;
    }
    __name(tonneau, "tonneau");
    function sac(x, y, s = 1) {
      return `<g transform="translate(${x} ${y}) scale(${s})">${P("M-6,5 Q-7.4,-2 -3,-5 L-1.6,-7.4 L1.6,-7.4 L3,-5 Q7.4,-2 6,5 Q0,7.4 -6,5 Z", "url(#bcS)", 0.8)}${L("M-3,-5 Q0,-4 3,-5", "#B07A4A", 1)}${L("M-3.6,0 l1,1 M2,2 l1,1 M-1,3.6 l1,-1", "#B89E68", 0.5)}${E(-3, -1.4, 1.4, 0.9, WHITE).replace("/>", ' opacity=".4"/>')}</g>`;
    }
    __name(sac, "sac");
    function lest(x, y, s = 1) {
      return `<g transform="translate(${x} ${y}) scale(${s})">${P("M-6,5 Q-7,-2 -3,-5 Q2,-7 5.6,-3.4 Q7.4,1 5.4,5 Q0,6.6 -6,5 Z", "url(#bcL)", 0.8)}${L("M-3.6,-3 Q-1,-4.6 2,-4", "#E2DED6", 1, ' opacity=".9"')}${E(2, 2, 1.2, 0.8, "#7E786E")}</g>`;
    }
    __name(lest, "lest");
    var FAIT = { caisse, tonneau, sac, lest };
    var RANGS = [
      [["caisse", 20, 52], ["sac", 32, 52], ["tonneau", 44, 52], ["caisse", 93, 52]],
      [["lest", 26, 40.6], ["caisse", 38, 40.6]],
      [["tonneau", 93, 40.6], ["sac", 32, 29.4]],
      [["sac", 93, 29.4]]
    ];
    function bateau(n, anim = true) {
      let d = `<defs>${lin("bcC", [[0, "#E8BC84"], [1, "#B07A4A"]])}${lin("bcT", [[0, "#C08A5E"], [1, "#7A4A2A"]], 1, 0)}${lin("bcS", [[0, "#F6E8C0"], [1, "#D4BC84"]])}${lin("bcL", [[0, "#CFCAC0"], [1, "#8E887E"]])}`;
      d += `${lin("bmer", [[0, "#8FD8F4"], [1, "#3E9AD0"]])}${lin("bcoq", [[0, "#C8885A"], [0.5, "#9A6440"], [1, "#6A3E22"]])}${lin("bvoi", [[0, "#FFFBEE"], [0.7, "#F2E6C8"], [1, "#DCCCA4"]], 1, 0)}${lin("bmat", [[0, "#C8925A"], [1, "#7A4A2A"]], 1, 0)}</defs>`;
      let b = "";
      b += L("M55,10 L14,56 M55,10 L98,56", "#6A4A2A", 0.6, ' opacity=".8"');
      b += `<rect x="53.6" y="8" width="3.2" height="50" rx="1.4" fill="url(#bmat)"${st(0.8)}/>` + P("M50,16 L60,16 L59,19 L51,19 Z", "#8A5A32", 0.8);
      b += `<g>${anim ? '<animateTransform attributeName="transform" type="skewY" values="0;-8;0" dur="1.2s" repeatCount="indefinite"/>' : ""}${P("M56,4 L70,6.6 L56,9.4 Z", "#6EC8D8", 0.7)}${L("M57,5.4 L64,6.6", WHITE, 0.6, ' opacity=".7"')}</g>`.replace("<g>", '<g transform-origin="56 7">');
      b += E(55.2, 7, 1.6, 1.6, "#E2B44E", 0.6);
      b += P("M58,12 Q84,20 82,48 L58,48 Z", "url(#bvoi)", 1.1) + L("M58,22 Q70,25 80,26 M58,34 Q70,36 81,37", "#D4C49A", 0.6) + L("M66,13.6 Q72,30 70,48", "#D4C49A", 0.6);
      b += `<g transform="translate(70 31)">${L("M-4,1 Q-4,-4 1,-4 Q5,-4 5,0 Q5,3 2,3 Q-0.6,3 -0.4,0.6 Q-0.2,-1 1.4,-1", "#4FB0C8", 1.6)}${L("M-7,4.4 L-3,4.4 M-6,6.6 L-1,6.6", "#7EC8D8", 0.9)}</g>`;
      b += L("M60,14 Q76,20 78,30", WHITE, 1, ' opacity=".6"');
      for (const r of RANGS.slice(0, n)) for (const [k, x, y] of r) b += FAIT[k](x, y, 1);
      if (n >= 2) b += L(n >= 3 ? "M13,50 Q32,16 51,50" : "M13,50 Q32,28 51,50", "#E8D8B0", 0.8, ' opacity=".9" stroke-dasharray="1.4 1"');
      b += P("M6,56 Q8,54 12,54 L100,54 Q104,54 106,56 Q104,70 90,74 Q56,79 22,74 Q8,70 6,56 Z", "url(#bcoq)", 1.3);
      b += L("M10,63 Q56,68 102,63", "#6A3E22", 0.7, ' opacity=".7"') + L("M14,69 Q56,74 98,69", "#6A3E22", 0.6, ' opacity=".6"');
      b += P("M6,56 Q8,54 12,54 L100,54 Q104,54 106,56 L105,59 L7,59 Z", "#4FB0C8", 0.9) + L("M12,55.4 L100,55.4", "#B8F0F8", 0.9, ' opacity=".8"');
      b += [30, 46, 66, 82].map((x) => E(x, 64.4, 2.4, 2.4, "#E2B44E", 0.7) + E(x, 64.4, 1.5, 1.5, "#24506E") + E(x - 0.5, 63.9, 0.5, 0.5, WHITE)).join("");
      b += L("M104,56 Q110,52 108,48 Q106,46 104,48", "#E2B44E", 1.6) + L("M104,56 Q110,52 108,48 Q106,46 104,48", OUT, 0.5, ' opacity=".5"');
      if (n === 4) b += anim ? brille(16, 40, 3, 2.2, 0) + brille(96, 30, 2.6, 2.2, 0.7) + brille(44, 22, 2.2, 2.2, 1.3) : etoile(16, 40, 3) + etoile(96, 30, 2.6) + etoile(44, 22, 2.2);
      const tangage = anim ? '<animateTransform attributeName="transform" type="rotate" values="-2 56 66;2 56 66;-2 56 66" dur="2.8s" repeatCount="indefinite"/>' : "";
      const mer = `<path d="M0,70 Q8,67 16,70 T32,70 T48,70 T64,70 T80,70 T96,70 T112,70 L112,88 L0,88 Z" fill="url(#bmer)"/>` + E(56, 76, 40, 3, "#2E6E9A").replace("/>", ' opacity=".35"/>') + `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;-16 0" dur="1.8s" repeatCount="indefinite"/>' : ""}${L("M0,70 Q8,67 16,70 T32,70 T48,70 T64,70 T80,70 T96,70 T112,70 T128,70", WHITE, 1.4)}${L("M4,80 Q10,78 16,80 M40,82 Q46,80 52,82 M76,80 Q82,78 88,80 M108,82 Q114,80 120,82", "#DFF6FF", 0.9, ' opacity=".8"')}</g>`;
      return d + E(56, 84, 44, 2.4, "rgba(30,70,100,.18)") + `<g>${tangage}${b}</g>` + mer;
    }
    __name(bateau, "bateau");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    for (let k = 0; k < 4; k++) piece(`vague_${k + 1}`, "La vague (sur la bande de la rangée du haut)", [0, 0, 128, 48], () => vague(k), "vague", 110);
    piece("alerte-vague", "L'alerte de la vague (elle bat, en boucle)", [0, 0, 32, 32], () => alerte());
    piece("suivante", "La case de la marchandise suivante (un hublot)", [0, 0, 48, 48], suivante);
    piece("mise-de-cote", "La case de mise de côté (une caisse ouverte)", [0, 0, 48, 48], () => miseDeCote(false));
    piece("mise-de-cote_bloquee", "La case de mise de côté, déjà utilisée pour cette marchandise", [0, 0, 48, 48], () => miseDeCote(true));
    for (let n = 0; n <= 4; n++) piece(`bateau_${n}`, `Le bilan : le bateau d'Aster, ${n} rang${n > 1 ? "s" : ""} de cargaison (il tangue, en boucle)`, [0, 0, 112, 88], () => bateau(n));
    var LISEZ_MOI = "Compléments : la vague (128 × 48) se pose sur la bande de la rangée du haut, pendant que le jeu secoue la cale ; l'alerte (32 × 32) la précède. La suivante et la mise de côté (48 × 48) : le jeu pose la marchandise au centre, réduite à 40 % (cases de 6,4 × 6,4, pour que la forme en I tienne dans le hublot). Le bilan : le bateau d'Aster (112 × 88), chargé de 0 à 4 rangs selon le résultat, avec les étoiles du Filon.";
    module.exports = { PIECES, LISEZ_MOI, vague, alerte, suivante, miseDeCote, bateau };
  }
});

// atelier/minijeu_arrimage_regles.js
var require_minijeu_arrimage_regles = __commonJS({
  "atelier/minijeu_arrimage_regles.js"(exports, module) {
    var A = require_minijeu_arrimage();
    var OUT = "#3C2819";
    var WHITE = "#FFFFFF";
    var f = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "f");
    var st = /* @__PURE__ */ __name((w) => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`, "st");
    var P = /* @__PURE__ */ __name((d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ""}/>`, "P");
    var E = /* @__PURE__ */ __name((x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ""}/>`, "E");
    var L = /* @__PURE__ */ __name((d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`, "L");
    var lin = /* @__PURE__ */ __name((id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`, "lin");
    var rad = /* @__PURE__ */ __name((id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`, "rad");
    var etoile = /* @__PURE__ */ __name((x, y, r, fill = "#FFFBE8") => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`, "etoile");
    var C = 16;
    var NOUVELLES = {
      planches: { nom: "planches (bois)", clair: "#F2D29A", fond: "#DDB074", fonce: "#A8784A" },
      filet: { nom: "filet (nourriture)", clair: "#CFE8D8", fond: "#9CC8B0", fonce: "#5E8A76" },
      coffre: { nom: "coffre long (bois)", clair: "#B87A52", fond: "#8A5434", fonce: "#5A3420" }
    };
    function caseNeuve(sorte, voisins, p = `n${sorte}`) {
      const c = NOUVELLES[sorte];
      let s = `<defs>${lin(p, [[0, c.clair], [0.55, c.fond], [1, c.fonce]])}</defs><rect x="0" y="0" width="${C}" height="${C}" fill="url(#${p})"/>`;
      if (sorte === "planches") {
        s += [5.3, 10.7].map((y) => L(`M0,${y} L16,${y}`, c.fonce, 0.7)).join("") + [2.6, 8, 13.4].map((y) => L(`M1,${y} q4,-0.8 7,0 t7,0`, c.fonce, 0.35, ' opacity=".6"')).join("");
        s += L("M0.6,1.2 L15.4,1.2", "#FFF2D0", 0.7, ' opacity=".8"');
        if (!voisins[3]) s += [2.6, 8, 13.4].map((y) => E(2, y, 0.55, 0.55, "#6A6A72")).join("");
        if (!voisins[1]) s += [2.6, 8, 13.4].map((y) => E(14, y, 0.55, 0.55, "#6A6A72")).join("");
      }
      if (sorte === "filet") {
        s += `<defs><clipPath id="${p}c"><rect x="0" y="0" width="16" height="16"/></clipPath></defs><g clip-path="url(#${p}c)">` + [-8, -2, 4, 10, 16].map((x) => L(`M${x},0 L${x + 16},16 M${x + 16},0 L${x},16`, "#E8DCC0", 0.8)).join("") + [-8, -2, 4, 10, 16].map((x) => L(`M${x},0 L${x + 16},16`, c.fonce, 0.3, ' opacity=".6"')).join("") + "</g>";
        s += [[4, 4], [12, 4], [8, 8], [4, 12], [12, 12]].map(([x, y]) => E(x, y, 0.7, 0.7, "#C8B080", 0.3)).join("");
        if (!voisins[0]) s += E(8, 1.6, 2, 1.2, "#E8A84A", 0.5) + E(7.4, 1.2, 0.6, 0.35, WHITE);
      }
      if (sorte === "coffre") {
        s += `<defs>${lin(p + "l", [[0, "#FFE8A0"], [0.5, "#E2B44E"], [1, "#A8782A"]])}</defs><rect x="0" y="6.2" width="16" height="3.6" fill="url(#${p}l)"/>` + L("M0,6.2 L16,6.2 M0,9.8 L16,9.8", OUT, 0.5, ' opacity=".6"') + L("M0,6.9 L16,6.9", "#FFF2C4", 0.5, ' opacity=".8"');
        s += [4, 12].map((x) => E(x, 8, 0.7, 0.7, "#FFF2C4", 0.3)).join("") + L("M1,2.4 L15,2.4 M1,13.6 L15,13.6", c.fonce, 0.5, ' opacity=".7"') + L("M1.2,1 L8,1", "#D89A70", 0.8, ' opacity=".8"');
      }
      const [h, d, b, g] = voisins;
      let o = "";
      if (!h) o += "M0,0 L16,0 ";
      if (!d) o += "M16,0 L16,16 ";
      if (!b) o += "M0,16 L16,16 ";
      if (!g) o += "M0,0 L0,16 ";
      return s + (o ? `<path d="${o}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linecap="square"/>` : "");
    }
    __name(caseNeuve, "caseNeuve");
    var PLACES = [8, 44, 80];
    function quai() {
      const p = "qa";
      let s = `<defs>${lin(p + "p", [[0, "#C8925A"], [1, "#8A5A32"]])}${lin(p + "b", [[0, "#E8C08A"], [1, "#B8864E"]])}${lin(p + "e", [[0, "#5EB0D8"], [1, "#2E7AA8"]])}</defs>`;
      s += `<rect x="0" y="30" width="128" height="10" fill="url(#${p}e)"/>` + L("M0,33 q8,-2 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0", "#BFE8FA", 0.9, ' opacity=".8"');
      s += [6, 42, 78, 114].map((x) => P(`M${x},24 L${x + 6},24 L${x + 6},38 Q${x + 3},39.4 ${x},38 Z`, "#7A4A2A", 0.9)).join("");
      s += P("M1,8 Q1,6 3,6 L125,6 Q127,6 127,8 L127,26 Q127,28 125,28 L3,28 Q1,28 1,26 Z", `url(#${p}p)`, 1.2);
      s += [12.6, 19.4].map((y) => L(`M2,${y} L126,${y}`, "#6A4224", 0.7)).join("") + [30, 64, 98].map((x) => L(`M${x},7 L${x},27`, "#6A4224", 0.6, ' opacity=".7"')).join("") + L("M3,7.4 L125,7.4", "#E8C08A", 0.9, ' opacity=".8"');
      s += [[4, 9], [124, 9], [4, 25], [124, 25]].map(([x, y]) => E(x, y, 0.7, 0.7, "#A8B0BA", 0.3)).join("");
      PLACES.forEach((x, i) => {
        s += P(`M${x},4 L${x + 36},4 L${x + 36},26 L${x},26 Z`, `url(#${p}b)`, 0.9) + [10, 17].map((y) => L(`M${x + 1},${y + 4} L${x + 35},${y + 4}`, "#A8784A", 0.6)).join("") + L(`M${x + 1},5.4 L${x + 35},5.4`, "#FFF2D0", 0.7, ' opacity=".8"');
        s += [...Array(i + 1).keys()].map((j) => E(x + 33 - j * 2.4, 23.4, 0.7, 0.7, "#8A5A32")).join("");
      });
      s += P("M119,0.6 L125,0.6 L125,6 L119,6 Z", "#5A5A62", 0.8) + E(122, 0.8, 3.4, 1.2, "#7A7A84", 0.7);
      return s;
    }
    __name(quai, "quai");
    function quaiChoisie(anim = true) {
      return `<rect x="1" y="1" width="38" height="26" rx="3" fill="none" stroke="#FFD24A" stroke-width="2">${anim ? '<animate attributeName="stroke-opacity" values="1;.35;1" dur="0.8s" repeatCount="indefinite"/>' : ""}</rect><rect x="1" y="1" width="38" height="26" rx="3" fill="none" stroke="#FFFBE8" stroke-width="0.7"/>` + etoile(37, 2, 2.4) + etoile(3, 26, 1.8);
    }
    __name(quaiChoisie, "quaiChoisie");
    function manifeste() {
      const p = "mf";
      let s = `<defs>${rad(p, [[0, "#FFF8E6"], [0.7, "#F4E8C8"], [1, "#E2D0A4"]], 0.5, 0.4, 0.8)}${lin(p + "r", [[0, "#C8925A"], [1, "#8A5A32"]])}</defs>`;
      s += P("M4,6 L52,6 L52,74 Q46,77 40,74 Q34,71 28,74 Q22,77 16,74 Q10,71 4,74 Z", `url(#${p})`, 1);
      s += `<rect x="1" y="2" width="54" height="7" rx="3.5" fill="url(#${p}r)"${st(1)}/>` + L("M3,3.6 L53,3.6", "#E8C08A", 0.8, ' opacity=".8"');
      s += [...Array(6).keys()].map((i) => L(`M6,${f(23.5 + i * 10)} L50,${f(23.5 + i * 10)}`, "#D8C49A", 0.5, ' stroke-dasharray="1.4 1.2"')).join("");
      s += E(44, 66, 5, 5, "#C8402E", 0.8) + E(44, 66, 3.4, 3.4, "#E2604A") + L("M41.6,66.6 Q43,64.6 44.4,66 Q45.6,64.2 47,65.4", "#8A2A1E", 0.8) + E(42.6, 64.4, 0.9, 0.6, WHITE).replace("/>", ' opacity=".6"/>');
      return s;
    }
    __name(manifeste, "manifeste");
    function icone(sorte) {
      if (NOUVELLES[sorte]) return `<g transform="translate(0.6 0.6) scale(0.55)">${caseNeuve(sorte, [0, 0, 0, 0], `ic${sorte}`)}</g>`;
      return `<g transform="translate(0.6 0.6) scale(0.55)">${A.caseDe(sorte, 0, 0, [0, 0, 0, 0])}</g>`;
    }
    __name(icone, "icone");
    var coche = /* @__PURE__ */ __name(() => L("M1.2,5.4 L3.8,8 L8.8,2.2", OUT, 2.4) + L("M1.2,5.4 L3.8,8 L8.8,2.2", "#5FA548", 1.3), "coche");
    function gite() {
      const p = "gi";
      const arc = /* @__PURE__ */ __name((a0, a1, r) => {
        const x0 = 32 + r * Math.cos(a0), y0 = 30 + r * Math.sin(a0), x1 = 32 + r * Math.cos(a1), y1 = 30 + r * Math.sin(a1);
        return `M${f(x0)},${f(y0)} A${r},${r} 0 0 1 ${f(x1)},${f(y1)}`;
      }, "arc");
      const deg = /* @__PURE__ */ __name((d) => (d - 90) * Math.PI / 180, "deg");
      let s = `<defs>${lin(p + "b", [[0, "#C8925A"], [1, "#8A5A32"]])}${rad(p + "f", [[0, "#FFF8E6"], [1, "#F2E2C0"]], 0.5, 0.9, 0.9)}</defs>`;
      s += P("M3,31 A29,29 0 0 1 61,31 L61,34 Q61,35 60,35 L4,35 Q3,35 3,34 Z", `url(#${p}b)`, 1.1) + P("M7,31 A25,25 0 0 1 57,31 Z", `url(#${p}f)`, 0.8);
      for (const [a0, a1, c] of [[-60, -35, "#E8604A"], [-35, -15, "#F2B84A"], [-15, 15, "#7EC25A"], [15, 35, "#F2B84A"], [35, 60, "#E8604A"]]) s += L(arc(deg(a0), deg(a1), 21), c, 3.4);
      for (let d = -60; d <= 60; d += 15) s += L(`M${f(32 + 17.6 * Math.cos(deg(d)))},${f(30 + 17.6 * Math.sin(deg(d)))} L${f(32 + 15.4 * Math.cos(deg(d)))},${f(30 + 15.4 * Math.sin(deg(d)))}`, "#8A6A40", d % 30 ? 0.5 : 0.9);
      s += P("M25,30 L39,30 Q38,34 32,34.4 Q26,34 25,30 Z", "#9A6440", 0.7) + L("M32,30 L32,24.6", "#7A4A2A", 0.8) + P("M32.6,24.8 Q36.4,27 35.6,29.4 L32.6,29.4 Z", "#F4EBD2", 0.5);
      return s;
    }
    __name(gite, "gite");
    var giteAiguille = /* @__PURE__ */ __name(() => P("M31,30 L32,12 L33,30 Z", "#3C2819", 0.4) + L("M32,13 L32,26", "#E8604A", 0.7) + E(32, 30, 2.2, 2.2, "#E2B44E", 0.7) + E(31.4, 29.4, 0.6, 0.6, WHITE), "giteAiguille");
    function sangle(x, k, p) {
      const tension = [0.6, 1, 1][k];
      return `<g transform="translate(${x} 8) scale(1 ${tension}) translate(0 -8)">${P("M-2.2,-1 L2.2,-1 L2.2,17 L-2.2,17 Z", `url(#${p}t)`, 0.7)}${L("M-1.2,-0.6 L-1.2,16.6", "#FFF2D0", 0.5, ' opacity=".7"')}</g>` + P(`M${x - 3},5.4 L${x + 3},5.4 L${x + 3},10.6 L${x - 3},10.6 Z`, `url(#${p}l)`, 0.7) + `<rect x="${x - 1.6}" y="6.8" width="3.2" height="2.4" fill="#5A3420"/>`;
    }
    __name(sangle, "sangle");
    function sanglage(k) {
      const p = `sg${k}`;
      let s = `<defs>${lin(p + "t", [[0, "#E8D8B0"], [1, "#C8B080"]], 1, 0)}${lin(p + "l", [[0, "#FFE8A0"], [0.5, "#E2B44E"], [1, "#A8782A"]])}</defs>`;
      if (k < 2) s += `<rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity="${[0.15, 0.35][k]}"/>`;
      s += [16, 48, 80, 112].map((x) => sangle(x, Math.min(k, 2), p)).join("");
      if (k === 1) s += [[32, 4], [96, 12], [64, 3]].map(([x, y]) => etoile(x, y, 2.6)).join("");
      if (k === 2) s += [8, 40, 72, 104].map((x) => L(`M${x},1.6 L${x + 16},1.6`, "#FFFBE8", 0.9, ' opacity=".6"')).join("");
      return s;
    }
    __name(sanglage, "sanglage");
    var PIECES = [];
    var piece = /* @__PURE__ */ __name((id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle }), "piece");
    var CASE = [0, 0, 16, 16];
    for (const k of Object.keys(NOUVELLES)) for (let m = 0; m < 16; m++) piece(`case-${k}_${m}`, `Une case de ${NOUVELLES[k].nom}, voisines ${m}`, CASE, () => caseNeuve(k, [m & 1, m & 2, m & 4, m & 8], `n${k}${m}`));
    piece("quai", "Le quai et ses trois palettes", [0, 0, 128, 40], quai);
    piece("quai-choisie", "La palette choisie (le liseré pulse, en boucle)", [0, 0, 40, 28], () => quaiChoisie());
    piece("manifeste", "Le manifeste du jour (six lignes)", [0, 0, 56, 80], manifeste);
    for (const k of [...Object.keys(A.SORTES), ...Object.keys(NOUVELLES)]) piece(`icone-${k}`, `L'icône du manifeste : ${(A.SORTES[k] || NOUVELLES[k]).nom}`, [0, 0, 10, 10], () => icone(k));
    piece("coche", "La coche d'une ligne chargée", [0, 0, 10, 10], coche);
    piece("gite", "La jauge de gîte", [0, 0, 64, 36], gite);
    piece("gite-aiguille", "L'aiguille de la jauge (le jeu la tourne autour de 32, 30)", [0, 0, 64, 36], giteAiguille);
    for (let k = 0; k < 2; k++) piece(`sanglage_${k + 1}`, "Les sangles qui se tendent (par-dessus la rangée)", [0, 0, 128, 16], () => sanglage(k), "sanglage", 140);
    piece("sanglee", "La rangée sanglée (reste par-dessus la rangée figée)", [0, 0, 128, 16], () => sanglage(2));
    var LISEZ_MOI = "Les règles (design/conception/minijeux_grille.md, § 6) : trois nouvelles marchandises, case-<sorte>_<masque> comme les autres (planches, filet, coffre). Le quai (128 × 40) se pose au-dessus de la cale ; les palettes commencent en x = 8, 44, 80 (36 de large) ; la palette choisie (40 × 28) se pose en x − 2, y 0. Le manifeste (56 × 80) : sur la ligne i, l'icône (10 × 10) en x = 6, y = 13 + 10 × i, le compte écrit par le jeu à droite, la coche (10 × 10) en x = 42. La jauge de gîte (64 × 36) et son aiguille (même cadre), que le jeu tourne autour de (32, 30). Les sangles (128 × 16) se posent sur la rangée pleine : deux images, puis la rangée sanglée qui reste. La suivante et la mise de côté ne servent plus avec ces règles.";
    module.exports = { NOUVELLES, PLACES, PIECES, LISEZ_MOI, caseNeuve, quai, quaiChoisie, manifeste, icone, coche, gite, giteAiguille, sanglage };
  }
});

// atelier/generateur_minijeux.mjs
var import_minijeu_filon = __toESM(require_minijeu_filon(), 1);
var import_minijeu_filon_plus = __toESM(require_minijeu_filon_plus(), 1);
var import_minijeu_filon_saisons = __toESM(require_minijeu_filon_saisons(), 1);
var import_minijeu_peche = __toESM(require_minijeu_peche(), 1);
var import_minijeu_cueillette = __toESM(require_minijeu_cueillette(), 1);
var import_minijeu_cueillette_saisons = __toESM(require_minijeu_cueillette_saisons(), 1);
var import_minijeu_recolte = __toESM(require_minijeu_recolte(), 1);
var import_minijeu_recolte_plus = __toESM(require_minijeu_recolte_plus(), 1);
var import_minijeu_arrimage = __toESM(require_minijeu_arrimage(), 1);
var import_minijeu_arrimage_plus = __toESM(require_minijeu_arrimage_plus(), 1);
var import_minijeu_arrimage_regles = __toESM(require_minijeu_arrimage_regles(), 1);
var HD = 4;
var MODULES = { filon: import_minijeu_filon.default, peche: import_minijeu_peche.default, cueillette: import_minijeu_cueillette.default, recolte: import_minijeu_recolte.default, arrimage: import_minijeu_arrimage.default };
var PLUS = { filon: [import_minijeu_filon_plus.default, import_minijeu_filon_saisons.default], cueillette: [import_minijeu_cueillette_saisons.default], recolte: [import_minijeu_recolte_plus.default], arrimage: [import_minijeu_arrimage_plus.default, import_minijeu_arrimage_regles.default] };
var JEUX = Object.fromEntries(Object.entries(MODULES).map(([k, m]) => [k, [...m.PIECES, ...(PLUS[k] || []).flatMap((p) => p.PIECES)]]));
var INFOS = Object.fromEntries(Object.entries(MODULES).map(([k, m]) => [k, { titre: m.TITRE, fond: m.FOND, lisez_moi: [m.LISEZ_MOI, ...(PLUS[k] || []).map((p) => p.LISEZ_MOI)].filter(Boolean).join(" ") }]));
var svgOf = /* @__PURE__ */ __name((c, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2] * HD}" height="${c[3] * HD}" viewBox="${c.join(" ")}">${body}</svg>`, "svgOf");
function minijeu(jeu, id) {
  if (!JEUX[jeu]) throw new Error(`mini-jeu inconnu : ${jeu} (${Object.keys(JEUX).join(", ")})`);
  const p = JEUX[jeu].find((x) => x.id === id);
  if (!p) throw new Error(`pièce inconnue du ${jeu} : ${id}`);
  return { svg: svgOf(p.cadre, p.dessin()), cadre: p.cadre, ms_par_image: p.ms };
}
__name(minijeu, "minijeu");
function liste() {
  return Object.entries(JEUX).flatMap(([jeu, pieces]) => pieces.map((p) => ({ fichier: `minijeux/${jeu}/${p.id}.svg`, fonction: "minijeu", args: [jeu, p.id] })));
}
__name(liste, "liste");
export {
  HD,
  INFOS,
  JEUX,
  liste,
  minijeu
};
