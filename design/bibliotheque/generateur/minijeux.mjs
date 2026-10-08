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
    module.exports = { ROCHE, GEMMES, PIECES, bloc, trou, eclate, pioche, etincelles, onde, gemme, gemmeAnimee, apparait, eclatCouleur, lueur, signe };
  }
});

// atelier/generateur_minijeux.mjs
var import_minijeu_filon = __toESM(require_minijeu_filon(), 1);
var HD = 4;
var JEUX = { filon: import_minijeu_filon.default.PIECES };
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
  JEUX,
  liste,
  minijeu
};
