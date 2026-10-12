// Les fêtes de l'île (world/fetes.js) : un bâtiment construit ou qui gagne un palier a sa Fête ; le palier IV, son Grand
// moment. Le chef d'orchestre les range ; une fête qui commence lance l'élévation du bâtiment et, pour un Grand moment,
// pose la caméra dessus. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.

import { enqueue, tick, kindOf, DURATION, spotlightOf, drawSpotlight, drawFete, drawFeteWords as drawWords } from '@/world/fetes';
import { crestOf } from '@/world/rareSprites';

export default {
  // Un bâtiment vient de gagner un palier (de from à site.level) : sa fête, à son tour
  celebrate(site, from) {
    const fete = { id: `${site.id}:${site.level}`, kind: kindOf(site.level), site: site.id, from, level: site.level, name: site.name };
    enqueue(this.fetes, fete, performance.now()).forEach(f => this.startFete(f));
  },
  // Une fête commence : le bâtiment s'élève (pas en mouvement réduit), la caméra se pose sur un Grand moment ; en
  // mouvement réduit, l'île se redessine à sa fin (le mot s'efface, la suivante commence)
  startFete(fete) {
    if (this.reduced()) {
      setTimeout(() => this.drawSoon(), DURATION[fete.kind] + 50);
      return;
    }
    this.raises.set(fete.site, { at: fete.start, from: fete.from });
    if (fete.kind === 'grand') {
      const at = this.feteAt(fete);
      if (at) this.glideTo({ x: at.x, y: at.y - at.top * 0.4, s: Math.max(this.cam.s, 1.25) }, 900);
    }
  },
  // Où se tient la fête : le pied du bâtiment et sa hauteur (lus à chaque image : un bâtiment déplacé l'emmène)
  feteAt(fete) {
    const site = this.state && this.state.sites.find(s => s.id === fete.site);
    if (!site) return null;
    const c = this.centerOf(site);
    return { ...fete, x: c.x, y: c.y, top: Math.max(40, -crestOf(site.id, site.level)[1]) };
  },
  // Les fêtes en cours, à cette image : celles qui finissent s'en vont, la suivante commence
  fetesNow(now) {
    if (!this.fetes) return [];
    tick(this.fetes, now).forEach(f => this.startFete(f));
    return this.fetes.playing.map(f => this.feteAt(f)).filter(Boolean);
  },
  // Leur lumière (dans le monde, après la lumière de l'heure) : le projecteur d'un Grand moment, puis l'éclat
  drawFetes(ctx, fetes, view, now) {
    if (this.reduced()) return;
    for (const f of fetes) drawSpotlight(ctx, f, view, spotlightOf(f, now, this.feteCalm));
    for (const f of fetes) drawFete(ctx, f, now);
  },
  // Leur mot, par-dessus tout (il garde sa taille à l'écran vue de loin, comme les bulles)
  drawFeteWords(ctx, fetes, now) {
    const k = 1 / Math.min(1, this.cam.s);
    for (const f of fetes) drawWords(ctx, f, now, k, this.reduced());
  }
};
