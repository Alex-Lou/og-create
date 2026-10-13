// Les fêtes de l'île (world/fetes.js) : un bâtiment construit ou qui gagne un palier a sa Fête ; le palier IV, son Grand
// moment ; un quartier acheté ou un lieu découvert, une Fête sans élévation ; les petits gestes, Pétille ou Éclat, là
// où on a touché. Le chef d'orchestre range les Fêtes ; une fête de bâtiment qui commence lance son élévation et, pour
// un Grand moment, pose la caméra dessus. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.

import { enqueue, tick, kindOf, DURATION, SMALL_MS, spotlightOf, drawSpotlight, drawFete, drawFeteWords as drawWords, addSmall, smallNow, drawSmall, drawGains, gainsOf } from '@/world/fetes';
import { crestOf } from '@/world/rareSprites';
import { TW, TH } from '../constants';
import { glyph } from '@/book/painter';
import { GLYPH } from '@/game/resources';

export default {
  // Un bâtiment vient de gagner un palier (de from à site.level) : sa fête, à son tour
  celebrate(site, from) {
    const fete = { id: `${site.id}:${site.level}`, kind: kindOf(site.level), site: site.id, from, level: site.level, name: site.name };
    enqueue(this.fetes, fete, performance.now()).forEach(f => this.startFete(f));
  },
  // Une Fête sans bâtiment, à un point du monde (at : { x, y, top }) ; line : la ligne sous le mot
  celebrateAt(id, at, line) {
    enqueue(this.fetes, { id, kind: 'fete', at, line }, performance.now()).forEach(f => this.startFete(f));
  },
  // Une fête commence : le bâtiment s'élève (pas en mouvement réduit), la caméra se pose sur un Grand moment ; en
  // mouvement réduit, l'île se redessine à sa fin (le mot s'efface, la suivante commence)
  startFete(fete) {
    if (this.reduced()) {
      setTimeout(() => this.drawSoon(), DURATION[fete.kind] + 50);
      return;
    }
    if (!fete.site) return;
    this.raises.set(fete.site, { at: fete.start, from: fete.from });
    if (fete.kind === 'grand') {
      const at = this.feteAt(fete);
      if (at) this.glideTo({ x: at.x, y: at.y - at.top * 0.4, s: Math.max(this.cam.s, 1.25) }, 900);
    }
  },
  // Où se tient la fête : le pied du bâtiment et sa hauteur (lus à chaque image : un bâtiment déplacé l'emmène)
  feteAt(fete) {
    if (fete.at) return { ...fete, ...fete.at };
    const site = this.state && this.state.sites.find(s => s.id === fete.site);
    return site ? { ...fete, ...this.siteAt(site) } : null;
  },
  // Le pied d'un bâtiment et sa hauteur : { x, y, top, hw, hh } (hw, hh : les demi-diagonales de son emprise, un peu
  // rentrées : l'échafaudage s'y monte)
  siteAt(site) {
    const c = this.centerOf(site);
    return { x: c.x, y: c.y, top: Math.max(40, -crestOf(site.id, Math.max(1, site.level))[1]), hw: (TW * site.w) / 2 * 0.86, hh: (TH * site.h) / 2 * 0.86 };
  },
  // Les fêtes en cours, à cette image : celles qui finissent s'en vont, la suivante commence
  fetesNow(now) {
    if (!this.fetes) return [];
    tick(this.fetes, now).forEach(f => this.startFete(f));
    return this.fetes.playing.map(f => this.feteAt(f)).filter(Boolean);
  },
  // Un petit geste, Pétille ou Éclat, à un point du monde (at : { x, y, top }) ; gains : ce qu'on gagne
  // ([{ glyph, text }], gainsOf) ou son nom ([{ text }])
  sparkle(kind, at, gains = []) {
    const now = performance.now();
    this.sparks = addSmall(this.sparks, { kind, ...at, gains }, now);
    if (this.reduced()) setTimeout(() => this.drawSoon(), SMALL_MS[kind] + 50);
    this.drawSoon();
  },
  // … sur une case de l'île
  sparkleCell(kind, cell, gains = []) {
    this.sparkle(kind, this.ground(cell.x, cell.y), gains);
  },
  // … sur un point de la page (un toucher)
  sparkleAt(kind, page, gains = []) {
    if (!page || !this.$refs.canvas) return;
    const rect = this.$refs.canvas.getBoundingClientRect();
    this.sparkle(kind, this.toWorld(page.x - rect.left, page.y - rect.top), gains);
  },
  // Ce qu'on gagne (ressources → nombre, écus), à montrer
  gainsOf(stock, coins = 0) {
    return gainsOf({ stock, coins, glyphOf: r => GLYPH[r] || 'ui:spark' });
  },
  // Leur lumière (dans le monde, après la lumière de l'heure) : le projecteur d'un Grand moment, l'éclat des fêtes, les
  // petits gestes
  drawFetes(ctx, fetes, view, now) {
    this.sparks = smallNow(this.sparks, now);
    if (this.reduced()) return;
    for (const f of fetes) drawSpotlight(ctx, f, view, spotlightOf(f, now, this.feteCalm));
    for (const f of fetes) drawFete(ctx, f, now);
    for (const s of this.sparks) drawSmall(ctx, s, now);
  },
  // Leur mot et ce qu'on gagne, par-dessus tout (ils gardent leur taille à l'écran vue de loin, comme les bulles)
  drawFeteWords(ctx, fetes, now) {
    const k = 1 / Math.min(1, this.cam.s);
    const still = this.reduced();
    for (const f of fetes) drawWords(ctx, f, now, k, still);
    for (const s of this.sparks) drawGains(ctx, s, now, this.gainIcon, k, still);
  },
  // L'icône d'un gain (son image se lit une fois : l'île se redessine quand elle arrive)
  gainIcon(ctx, id, x, y, size, alpha) {
    glyph(ctx, id, x, y, size, this.repaintSoon, alpha);
  }
};
