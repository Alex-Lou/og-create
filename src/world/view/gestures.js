// Les gestes sur l'île : glisser, pincer, molette, toucher (ce qui est sous le doigt, choix en deux temps). Méthodes de
// WorldView.vue (this : le composant), extraites telles quelles (lot santé).
import { HOLD_MS } from '@/directives/longpress';
import { vibrate } from '@/utils/fx';
import { landmarkScale, landmarkTop } from '@/world/landmarkSprites';
import { askLine } from '@/world/visitors';
import { depositWait, DEPOSIT_NAMES, waitText } from '@/world/finds';
import { ASKS } from '@/world/needs';
import { LABEL } from '@/game/resources';
import { roman } from '@/utils/roman';
import { spriteUrl } from '@/world/spriteCache';
import { BUILDINGS } from '@/world/sprites';
import { artMake } from '@/world/looks';
import { buildingThumb } from '@/world/buildingArt';
import { campInfo } from '@/world/campArt';
import { coach } from '@/game/coach';
import { ROAD_HOLD_MS } from '@/components/World/WorldView/roads';
import { TW, TH, DEPOSIT_SCALE } from './constants';

// Bulle d'info de l'appui long : durée d'affichage ; noms des bêtes, pour elle
const TIP_MS = 3600;
// Toucher en deux temps : ce qui est choisi (contour doré, bulle et bouton) le reste ce temps, puis s'oublie
const PICK_MS = 7000;
const ANIMALS = {
  chicken: ['Poule', 'Elle picore autour du Foyer et dort contre lui la nuit.'],
  butterfly: ['Papillon', 'Il butine les fleurs par beau temps.'],
  bee: ['Abeille', 'Elle butine les fleurs par beau temps.'],
  frog: ['Grenouille', 'Elle saute plus souvent quand il pleut.'],
  pod: ['Dauphins', 'Ils passent au large de temps en temps.'],
  whale: ['Baleine', 'Elle souffle quand on la touche.'],
  perch: ['Mouettes', 'Elles s’envolent puis reviennent sur la plage.']
};
// Un toucher reste un toucher tant que le doigt bouge de moins de 14 px (au-delà : on fait glisser la carte)
const TAP_SLOP = 14;
// Rayon minimal d'une cible au doigt, en pixels d'écran (une cible de 44 px de large, comme le veulent les guides
// tactiles), quel que soit le zoom
const MIN_TOUCH = 22;

export default {
  /* ---------- Gestes : glisser, pincer, toucher ---------- */
  point(event) {
    const rect = this.$refs.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  },
  onDown(event) {
    if (!this.state) return;
    this.hideTip();
    // (un doigt posé arrête la caméra qui glisse : l'île est à lui)
    this.stopGlide();
    this.$refs.canvas.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, this.point(event));
    clearTimeout(this.holdTimer);
    if (this.pointers.size === 1 && this.roadMode) {
      // Mode chemin (roads.js) : glisser déplace l'île, toucher pose une case, l'appui long trace d'un trait
      const gesture = { start: this.point(event), moved: 0, at: performance.now() };
      this.gesture = gesture;
      this.holdTimer = setTimeout(() => this.roadHold(gesture), ROAD_HOLD_MS);
    } else if (this.pointers.size === 1) {
      this.gesture = { start: this.point(event), moved: 0, at: performance.now() };
      this.holdTimer = setTimeout(() => this.onHold(), HOLD_MS);
    } else {
      // Un second doigt : pincer (un trait en cours s'arrête là, ce qu'il a tracé reste)
      this.roadEnd();
      this.gesture = { pinch: this.pinchOf(), moved: Infinity };
    }
  },
  // Appui long sans bouger : une autre réaction que le toucher. La fiche de Brume, le menu d'une création, la fiche
  // d'un article posé ; partout ailleurs, une bulle dit ce que c'est et ce que fait un toucher
  onHold() {
    const gesture = this.gesture;
    if (!gesture || !gesture.start || gesture.moved > TAP_SLOP || this.craftPlacing || this.annexPlacing || this.siteMoving || this.busy) return;
    const hit = this.hitAt(gesture.start.x, gesture.start.y);
    // Une création cachée derrière un bâtiment : l'appui long l'atteint quand même (le toucher court reste au bâtiment)
    const behind = hit && hit.site ? this.craftBehind(gesture.start.x, gesture.start.y) : null;
    if (hit && hit.brume) this.questOpen = true;
    else if (hit && hit.craft) this.openCraftMenu(hit.craft);
    else if (behind) this.openCraftMenu(behind);
    else if (hit && hit.item) this.describeItem(hit.site, hit.item);
    else if (hit && hit.annex) this.annexSheet = { x: hit.annex.x, y: hit.annex.y };
    else if (hit && hit.landmark) this.openLog(hit.landmark.id);
    else if (hit && hit.nameSign) this.openNameSign(hit.nameSign);
    else if (hit && hit.animal && this.beastOf(hit.animal.who)) this.openBeast(hit.animal.who.beast);
    else if (hit && hit.animal && this.friendOf(hit.animal.who)) this.openVillager(this.friendOf(hit.animal.who).id);
    else if (hit && hit.animal && (hit.animal.kind === 'vboat' || this.guestOf(hit.animal.who))) this.openVisitor();
    else this.showTip(gesture.start.x, gesture.start.y, this.tipOf(hit));
    gesture.held = true;
    vibrate(12);
    this.draw(performance.now());
  },
  // La création posée sous ce point (sa zone de toucher, comme dans hitAt), même cachée : la plus en avant, ou null
  craftBehind(px, py) {
    const w = this.toWorld(px, py);
    const under = this.crafted.filter(craft => {
      const c = this.ground(craft.x, craft.y);
      return Math.abs(w.x - c.x) < TW * 0.42 && w.y > c.y - TW * 1.1 && w.y < c.y + TH * 0.3;
    });
    return under.sort((p, q) => q.x + q.y - (p.x + p.y))[0] || null;
  },
  pinchOf() {
    const [a, b] = [...this.pointers.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  },
  onMove(event) {
    if (!this.pointers.has(event.pointerId) || !this.gesture) return;
    const prev = this.pointers.get(event.pointerId);
    const p = this.point(event);
    this.pointers.set(event.pointerId, p);
    if (this.pointers.size >= 2 && this.gesture.pinch) {
      const next = this.pinchOf();
      const last = this.gesture.pinch;
      if (last.d > 0) this.zoomAt(next.mx, next.my, next.d / last.d);
      this.cam.x -= (next.mx - last.mx) / this.cam.s;
      this.cam.y -= (next.my - last.my) / this.cam.s;
      this.clampCam();
      this.gesture.pinch = next;
      this.drawSoon();
      return;
    }
    this.gesture.moved = Math.max(this.gesture.moved, Math.hypot(p.x - this.gesture.start.x, p.y - this.gesture.start.y));
    if (this.gesture.road) {
      if (this.roadMode) {
        this.roadMove(this.gesture.road, p.x, p.y);
        this.roadEdge(p);
      }
      return;
    }
    if (this.gesture.moved > TAP_SLOP) {
      clearTimeout(this.holdTimer);
      this.dropPick();
      this.craftMenu = null;
      this.annexConfirm = null;
      this.cam.x -= (p.x - prev.x) / this.cam.s;
      this.cam.y -= (p.y - prev.y) / this.cam.s;
      this.clampCam();
      this.drawSoon();
    }
  },
  onCancel(event) {
    clearTimeout(this.holdTimer);
    this.roadEnd();
    this.pointers.delete(event.pointerId);
    if (!this.pointers.size) this.gesture = null;
  },
  onUp(event) {
    clearTimeout(this.holdTimer);
    this.roadEnd();
    const gesture = this.gesture;
    const p = this.point(event);
    this.pointers.delete(event.pointerId);
    if (this.pointers.size) {
      // Un doigt reste après un pincement : on reprend un glissement sans toucher
      const [rest] = [...this.pointers.values()];
      this.gesture = { start: rest, moved: Infinity };
      return;
    }
    this.gesture = null;
    if (!gesture || gesture.held || gesture.road || gesture.moved > TAP_SLOP || this.busy) return;
    this.tap(p.x, p.y);
  },
  onWheel(event) {
    if (!this.geo) return;
    const p = this.point(event);
    this.zoomAt(p.x, p.y, event.deltaY < 0 ? 1.12 : 0.89);
  },
  // Ce qui est sous le doigt : bulle de production, panneau de quartier, bâtiment, création, annexe, puis case
  hitAt(px, py) {
    const w = this.toWorld(px, py);
    if (this.brumeHit && Math.hypot(w.x - this.brumeHit.x, w.y - this.brumeHit.y) < this.brumeHit.r) return { brume: true };
    const asking = this.needBubbles.find(b => Math.hypot(w.x - b.x, w.y - b.y) < b.r + 2);
    // La bulle pleine d'une bête de ferme se ramasse d'un toucher ; les autres (faim, besoins) ouvrent une fiche
    if (asking) return asking.ready ? { beastBubble: asking } : { asking };
    const bubble = this.bubbles.find(b => Math.abs(w.x - b.x) < b.w / 2 + 6 && Math.abs(w.y - b.y) < b.h / 2 + 8);
    if (bubble) return { bubble };
    // Puis, par rangs : ce qui vit (habitants, bêtes, égarés, la bouteille) dès qu'on touche son dessin ; puis les
    // petites choses posées (enseignes, articles, panneaux des quartiers) ; puis les créations, annexes et le décor
    // qu'on touche ; enfin les bâtiments (leur zone couvre tout leur volume : ils cèdent à ce qui est devant eux ou
    // posé sur leur emprise, un dormeur couché contre son puits par exemple). Dans un même rang, le plus près du doigt
    // (d : 0 en son cœur, 1 à son bord). Une petite cible garde au moins MIN_TOUCH pixels de rayon à l'écran, même
    // dézoomée : ce surplus ne passe qu'au rang des créations, pour ne rien voler à ce qu'on touche vraiment.
    const near = MIN_TOUCH / this.cam.s;
    let best = null;
    const offer = (hit, d, rank, depth = 0) => {
      if (!(d < 1)) return;
      const better = !best || rank < best.rank || (rank === best.rank && (d < best.d - 1e-6 || (d < best.d + 1e-6 && depth > best.depth)));
      if (better) best = { hit, d, rank, depth };
    };
    const round = (hit, h, rank, sy = 1) => {
      const dist = Math.hypot(w.x - h.x, (w.y - h.y) * sy);
      if (dist < h.r) offer(hit, dist / h.r, rank);
      else if (dist < near) offer(hit, dist / near, 2);
    };
    for (const h of [...this.seaHits, ...this.landHits]) round(h.bottle ? { bottle: true } : { animal: h }, h, 0);
    for (const h of this.nameSignHits) round({ nameSign: h.site, at: h }, h, 1, 0.9);
    for (const h of this.itemHits) round({ item: h.item, site: h.site, at: h }, h, 1);
    for (const sg of this.signs) round({ zone: sg.zone, at: sg }, sg, 1, 1.2);
    // Zones de toucher généreuses : tout le volume dessiné du bâtiment, pas seulement sa base
    const volumes = [
      ...this.shownSites().map(site => ({ site, depth: site.x + site.y + site.w, c: this.centerOf(site), r: TW * 0.49 * site.w, h: TW * 0.875 * site.w, below: TH * 0.525 * site.w })),
      ...this.crafted.map(craft => ({ craft, depth: craft.x + craft.y, c: this.ground(craft.x, craft.y), r: TW * 0.42, h: TW * 1.1 })),
      ...(this.state.annexes || []).map(annex => ({ annex, depth: annex.x + annex.y, c: this.ground(annex.x, annex.y), r: TW * 0.44, h: TW * 1.1 })),
      // Le camp des naufragés : la cage coincée sous les rochers s'ouvre ; le reste dit seulement ce qu'il est
      ...(this.state.camp || []).map(item => {
        const c = item.w > 1 ? this.centerOf(item) : this.ground(item.x, item.y);
        const depth = item.x + item.y + (item.w > 1 ? item.w : 0);
        return item.art === 'cage_coincee' ? { cage: item, depth, c, r: TW * 0.5, h: TW * 0.8 } : { campItem: item, depth, c, r: TW * 0.45 * item.w, h: TW * 0.85 * item.w };
      }),
      ...this.groundFinds.map(deposit => ({ deposit, depth: deposit.x + deposit.y, c: this.ground(deposit.x, deposit.y), r: TW * 0.42 * DEPOSIT_SCALE, h: TW * 0.85 * DEPOSIT_SCALE })),
      ...this.shownLandmarks.map(landmark => ({
        landmark, depth: landmark.x + landmark.y, c: this.ground(landmark.x, landmark.y), r: TW * 0.56 * landmarkScale(landmark.id), h: -landmarkTop(landmark.id) * landmarkScale(landmark.id) + 14
      }))
    ];
    for (const o of volumes) {
      const top = o.c.y - o.h;
      const bottom = o.c.y + (o.site ? o.below : TH * 0.3);
      if (!(Math.abs(w.x - o.c.x) < o.r && w.y > top && w.y < bottom)) continue;
      const d = Math.max(Math.abs(w.x - o.c.x) / o.r, Math.abs(w.y - (top + bottom) / 2) / ((bottom - top) / 2));
      offer(o, d, o.site ? 3 : 2, o.depth);
    }
    if (best) return best.hit;
    const tile = this.tileAt(px, py);
    if (!tile || !this.landAt(tile.x, tile.y)) return null;
    const site = this.shownSites().find(s => this.covers(s, tile.x, tile.y));
    if (site) return { site };
    return this.lockedAt(tile.x, tile.y) ? { zone: this.zoneAt(tile.x, tile.y) } : { cell: tile };
  },
  tap(px, py) {
    // Mode chemin : un toucher pose ou retire une case, il ne touche rien d'autre (roads.js)
    if (this.roadMode) {
      this.roadTap(px, py);
      return;
    }
    // Pose ou déplacement d'une annexe ou d'une création : seule compte la case, dorée ou non
    if (this.annexPlacing) {
      this.tapAnnexSpot(px, py);
      return;
    }
    if (this.craftPlacing) {
      this.tapCraftSpot(px, py);
      return;
    }
    if (this.siteMoving) {
      this.tapSiteSpot(px, py);
      return;
    }
    const hit = this.hitAt(px, py);
    this.craftMenu = null;
    // Un égaré, la nuit : un toucher le repousse aussitôt (il boude et retourne dans la brume)
    if (hit && hit.animal && hit.animal.stray) {
      this.dropPick();
      this.repelStray(hit.animal.stray, this.canvasPoint(px, py));
      return;
    }
    // La bulle d'un besoin (faim, soif… ; la faim d'une poule) : un toucher le comble (folk.js, tapNeed)
    if (hit && hit.asking && !hit.asking.visitor) {
      this.dropPick();
      this.tapNeed(hit.asking, px, py);
      return;
    }
    // Toucher en deux temps : ce qui ouvre une fiche ou agit sur le serveur se choisit d'abord (contour doré, bulle et
    // bouton) ; un second toucher dessus, ou le bouton, l'ouvre. Ce qui ne fait que réagir réagit tout de suite.
    const pick = hit ? this.pickOf(hit, px, py) : null;
    if (pick && this.picked && this.picked.key === pick.key) {
      this.runPick();
      return;
    }
    this.dropPick();
    if (!hit) {
      // La mer : des ronds dans l'eau là où le doigt touche (en mouvement réduit, la bulle d'info)
      if (this.reduced()) this.showTip(px, py, this.tipOf(null));
      else {
        const w = this.toWorld(px, py);
        this.ripples.push({ ...this.cellAt(w.x, w.y), at: performance.now() / 1000 });
        vibrate(4);
      }
      this.draw(performance.now());
      return;
    }
    if (pick) {
      // Le visiteur sursaute quand même : on l'a touché
      if (hit.animal && hit.animal.who) this.scare(hit.animal);
      this.choose(pick, px, py);
    } else if (hit.bubble) {
      const sp = this.toScreen(hit.bubble.x, hit.bubble.y);
      this.collect(this.canvasPoint(sp.x, sp.y));
      vibrate(8);
    } else if (hit.beastBubble) {
      const sp = this.toScreen(hit.beastBubble.x, hit.beastBubble.y);
      this.collectBeasts(this.canvasPoint(sp.x, sp.y));
      vibrate(8);
    } else if (hit.brume) {
      this.questAct();
      vibrate(6);
    } else if (hit.animal && hit.animal.who && hit.animal.who.id === 'anya:dame') {
      // Anya : son Souffle, une fois par jour
      this.scare(hit.animal);
      this.breatheAnya(px, py);
      return;
    } else if (hit.animal) {
      // Un habitant parle, une bête de la ferme répond ; les bêtes sauvages sursautent
      const said = this.named(this.village && hit.animal.who ? this.village.say(hit.animal.who, this.phase || this.skyAt(this.skyDate())) : null, hit.animal.who, true);
      if (said) this.showTip(px, py, said);
      if (this.reduced()) {
        if (!said) this.showTip(px, py, this.tipOf(hit));
      } else this.scare(hit.animal);
      return;
    } else if (hit.deposit) {
      // Un gisement qui n'est pas prêt sautille et dit quand il repousse
      this.scared.set(`deposit:${hit.deposit.id}`, { at: performance.now() / 1000 });
      this.showTip(px, py, this.tipOf(hit));
      vibrate(6);
    } else if (hit.campItem) {
      // Un élément du camp des naufragés : ce qu'il est (le reste du décor ne dit rien)
      this.showTip(px, py, this.tipOf(hit));
    }
    this.draw(performance.now());
  },
  // Ce que choisit un premier toucher : { key, action (texte du bouton), info (bulle), ring (contour), bounce, run } ;
  // null pour ce qui ne fait que réagir (bêtes, habitants, mer, Brume, bulles de production, case libre)
  pickOf(hit, px, py) {
    const ring = (x, y, r) => ({ x, y, rx: r, ry: r * 0.55 });
    if (hit.asking && hit.asking.beast) {
      const { asking } = hit;
      return { key: `ask:beast:${asking.beast}`, action: 'Sa fiche', info: this.tipOf(hit), ring: ring(asking.x, asking.y, asking.r + 3), run: () => this.openBeast(asking.beast) };
    }
    if (hit.asking) {
      const { asking } = hit;
      return {
        key: `ask:${asking.visitor ? 'visitor' : asking.id}`, action: 'Sa fiche', info: this.tipOf(hit), ring: ring(asking.x, asking.y, asking.r + 3),
        run: () => (asking.visitor ? this.openVisitor() : this.openVillager(asking.id))
      };
    }
    if (hit.animal && (hit.animal.kind === 'vboat' || this.guestOf(hit.animal.who))) {
      const guest = this.state.visitor;
      return { key: 'visitor', action: 'Sa fiche', info: { title: `${guest.name} · ${guest.role}`, text: askLine(guest) }, ring: ring(hit.animal.x, hit.animal.y, hit.animal.r), run: () => this.openVisitor() };
    }
    // Un camarade ou une bête de la ferme : il parle (ou répond), et sa fiche s'ouvre au second toucher (ou au bouton)
    const friend = hit.animal && this.friendOf(hit.animal.who);
    const beast = hit.animal && !friend && this.beastOf(hit.animal.who);
    if (friend || beast) {
      const { who } = hit.animal;
      const said = this.named(this.village ? this.village.say(who, this.phase || this.skyAt(this.skyDate())) : null, who, true) || this.tipOf(hit);
      // Un dormeur : le second toucher le réveille (on lui parle), sa fiche s'ouvre sur sa première réplique
      if (friend && who.pose === 'sleep') {
        return {
          key: `vil:${friend.id}`, action: 'Le réveiller', info: (this.village && this.named(this.village.describe(who), who)) || said, ring: ring(hit.animal.x, hit.animal.y, hit.animal.r),
          run: () => {
            this.openVillager(friend.id);
            this.talkVillager();
          }
        };
      }
      return {
        key: friend ? `vil:${friend.id}` : `beast:${who.beast}`, action: 'Sa fiche',
        info: said, ring: ring(hit.animal.x, hit.animal.y, hit.animal.r),
        run: () => (friend ? this.openVillager(friend.id) : this.openBeast(who.beast))
      };
    }
    if (hit.bottle) {
      const c = this.ground(this.bottleSpot.x + 0.5, this.bottleSpot.y + 0.5);
      return { key: 'bottle', action: 'L’ouvrir', info: this.tipOf(hit), ring: ring(c.x, c.y, 14), run: () => this.openChest('bouteille') };
    }
    if (hit.item) {
      const { item, site } = hit;
      return {
        key: `item:${site.id}:${item.id}`, action: 'Sa fiche', info: { title: item.name, text: item.effect }, ring: ring(hit.at.x, hit.at.y, hit.at.r),
        bounce: `item:${site.id}:${item.id}`, run: () => this.describeItem(site, item)
      };
    }
    if (hit.nameSign) {
      const site = hit.nameSign;
      return { key: `name-sign:${site.id}`, action: 'La changer', info: this.tipOf(hit), ring: ring(hit.at.x, hit.at.y, hit.at.r), bounce: `name-sign:${site.id}`, run: () => this.openNameSign(site) };
    }
    if (hit.cage) {
      const c = this.ground(hit.cage.x, hit.cage.y);
      return {
        key: 'cage', action: 'L’ouvrir', info: { title: 'La cage aux poules', text: 'Des caquets sous les rochers : les poules de Cannelle ont tenu bon !' },
        ring: ring(c.x, c.y, TW * 0.45), run: () => this.openCage(this.canvasPoint(px, py))
      };
    }
    if (hit.annex) {
      const { annex } = hit;
      const c = this.ground(annex.x, annex.y);
      return { key: `annex:${annex.x},${annex.y}`, action: 'Sa fiche', info: this.annexTip(annex), ring: ring(c.x, c.y, TW * 0.4), bounce: `annex:${annex.x},${annex.y}`, run: () => { this.annexSheet = { x: annex.x, y: annex.y }; } };
    }
    if (hit.craft) {
      const { craft } = hit;
      const c = this.ground(craft.x, craft.y);
      return { key: `craft:${craft.x},${craft.y}`, action: 'La déplacer ou la ranger', info: this.tipOf(hit), ring: ring(c.x, c.y, TW * 0.4), bounce: `craft:${craft.x},${craft.y}`, run: () => this.openCraftMenu(craft) };
    }
    if (hit.landmark) {
      const { landmark } = hit;
      const zone = this.state.map.zones.find(z => z.id === landmark.zone);
      const c = this.ground(landmark.x, landmark.y);
      const toFind = !landmark.found && zone && zone.owned;
      return {
        key: `landmark:${landmark.id}`, action: toFind ? 'Le découvrir' : landmark.found ? 'Sa page du Carnet' : 'Le Carnet', info: this.tipOf(hit),
        ring: ring(c.x, c.y, TW * 0.5 * landmarkScale(landmark.id)), bounce: `landmark:${landmark.id}`,
        run: () => (toFind ? this.findLandmark(landmark, px, py) : this.openLog(landmark.id))
      };
    }
    if (hit.deposit) {
      const { deposit } = hit;
      const zone = this.state.map.zones.find(z => z.id === deposit.zone);
      if (!zone || !zone.owned || depositWait(deposit, this.clock - this.loadedAt)) return null;
      const c = this.ground(deposit.x, deposit.y);
      return { key: `deposit:${deposit.id}`, action: 'Ramasser', info: this.tipOf(hit), ring: ring(c.x, c.y, TW * 0.4 * DEPOSIT_SCALE), bounce: `deposit:${deposit.id}`, run: () => this.gatherDeposit(deposit, px, py) };
    }
    const zoneOf = zone => {
      // (sous la brume épaisse du tutoriel, rien ne se montre d'un quartier que la quête ne vise pas)
      if (!this.signShown(zone)) return null;
      const w = hit.at || this.toWorld(px, py);
      return { key: `zone:${zone.id}`, action: zone.known === false ? 'Préparer l’expédition' : 'Voir le quartier', info: this.tipOf({ zone }), ring: hit.at ? ring(w.x, w.y, w.r) : null, run: () => { this.zone = zone; } };
    };
    if (hit.zone) return zoneOf(hit.zone);
    if (hit.site) {
      const { site } = hit;
      if (site.locked) return zoneOf(this.zoneAt(site.x, site.y));
      const c = this.centerOf(site);
      return {
        key: `site:${site.id}`, action: site.level ? 'Sa fiche' : 'Bâtir', info: this.tipOf(hit), diamond: { x: c.x, y: c.y, w: TW * site.w, h: TH * site.h },
        run: () => { this.site = site; this.siteTab = site.level ? 'overview' : 'evolution'; }
      };
    }
    return null;
  },
  // Premier toucher : la chose est choisie (contour doré, bulle avec son bouton), elle sautille
  choose(pick, px, py) {
    if (pick.bounce) this.scared.set(pick.bounce, { at: performance.now() / 1000 });
    this.picked = pick;
    // (pendant une leçon du tutoriel, la bulle attend le joueur : le coach montre son bouton)
    this.showTip(px, py, { ...pick.info, hint: null, action: pick.action, pick: pick.key }, coach.state.lesson ? 0 : PICK_MS);
    vibrate(6);
  },
  // Second toucher, ou le bouton de la bulle : ce qui est choisi s'ouvre
  runPick() {
    const pick = this.picked;
    this.dropPick();
    if (!pick || this.busy) return;
    vibrate(8);
    pick.run();
  },
  // Le choix s'oublie (toucher ailleurs, la vue bouge) ; sa bulle s'en va avec lui
  dropPick() {
    if (!this.picked) return;
    this.picked = null;
    if (this.tip && this.tip.action) this.hideTip();
  },
  // Contour doré de ce qui est choisi : un trait sombre sous un trait doré, qui bat
  drawPick(ctx, t) {
    const pick = this.picked;
    if (!pick || (!pick.ring && !pick.diamond)) return;
    const k = 1 / Math.min(1, this.cam.s);
    const beat = 0.65 + 0.35 * Math.sin(t * 6);
    ctx.save();
    const path = () => {
      if (pick.diamond) this.diamond(ctx, pick.diamond.x, pick.diamond.y, pick.diamond.w, pick.diamond.h);
      else {
        ctx.beginPath();
        ctx.ellipse(pick.ring.x, pick.ring.y, pick.ring.rx, pick.ring.ry, 0, 0, Math.PI * 2);
      }
    };
    path();
    ctx.lineWidth = 4.2 * k;
    ctx.strokeStyle = 'rgba(58, 42, 30, .55)';
    ctx.stroke();
    path();
    ctx.lineWidth = 2.2 * k;
    ctx.strokeStyle = `rgba(242, 192, 75, ${beat.toFixed(3)})`;
    ctx.stroke();
    ctx.restore();
  },
  // Bulle d'info au-dessus du doigt (en dessous près du haut), qui s'efface seule
  showTip(px, py, info, ms = TIP_MS) {
    if (!info || !this.geo) return;
    clearTimeout(this.tipTimer);
    const below = py < 110;
    this.tip = { ...info, x: Math.max(96, Math.min(this.geo.width - 96, px)), y: below ? py + 18 : py - 16, below };
    if (!ms) return;
    this.tipTimer = setTimeout(() => {
      this.tip = null;
      this.picked = null;
    }, ms);
  },
  hideTip() {
    if (!this.tip) return;
    clearTimeout(this.tipTimer);
    this.tip = null;
  },
  // Ce que dit la bulle pour ce qui est sous le doigt (null : la mer)
  tipOf(hit) {
    if (!hit) return { title: 'La mer', text: 'Dauphins, baleine et méduses passent au large.', hint: 'Toucher : des ronds dans l’eau' };
    if (hit.bottle) return { title: 'Bouteille à la mer', text: 'Un mot signé « H. », et un coffre.', hint: 'Toucher deux fois : l’ouvrir' };
    if (hit.nameSign) {
      const look = this.state.signs.styles.find(st => st.id === hit.nameSign.sign);
      return { title: this.state.signs.name, text: `${look ? look.name : 'Enseigne'} · ${hit.nameSign.name}`, hint: 'Appui long : la changer' };
    }
    if (hit.animal) {
      if (hit.animal.who && this.village) return this.named(this.village.describe(hit.animal.who), hit.animal.who);
      const [title, text] = ANIMALS[hit.animal.kind] || ['Une bête', ''];
      return { title, text, hint: 'Toucher : la faire réagir' };
    }
    if (hit.asking && hit.asking.visitor) return { title: this.state.visitor.name, text: askLine(this.state.visitor), hint: 'Toucher deux fois : sa fiche' };
    if (hit.asking && hit.asking.beast) {
      const beast = this.beastOf({ beast: hit.asking.beast });
      return { title: beast ? beast.name : 'Une bête', text: 'A faim : un peu de nourriture, et sa bulle se remplit.', hint: 'Toucher deux fois : sa fiche' };
    }
    if (hit.beastBubble) {
      const beast = this.beastOf({ beast: hit.beastBubble.beast });
      return { title: beast ? beast.name : 'Une bête', text: `${beast ? beast.ready : ''} ${LABEL.food} dans sa bulle.`, hint: 'Toucher : ramasser toutes les bulles' };
    }
    if (hit.asking) {
      const friend = this.friendAt(hit.asking.id);
      return { title: friend ? friend.name : 'Un habitant', text: ASKS[hit.asking.need], hint: 'Toucher deux fois : sa fiche' };
    }
    if (hit.bubble) {
      const made = Object.entries(hit.bubble.site ? hit.bubble.site.pending || {} : {}).filter(([, n]) => n > 0).map(([k, n]) => `${Math.floor(n)} ${k === 'coins' ? 'écus' : LABEL[k] || k}`);
      return { title: 'Production prête', text: made.join(', ') || 'Ressources et écus à encaisser.', hint: 'Toucher : tout ramasser' };
    }
    if (hit.zone) {
      const zone = hit.zone;
      if (zone.known === false) return { title: 'Terre inconnue', text: 'Une expédition révélera ce qu’elle cache.', hint: 'Toucher deux fois : préparer l’expédition' };
      return { title: zone.name, text: zone.owned ? 'Quartier à toi.' : zone.plan ? `À découvrir : fais naître « ${zone.plan} » dans l’Athanor.` : zone.open ? `Quartier à acheter : ${zone.price} écus.` : `S’ouvre avec le chapitre ${zone.chapter} du Grimoire.`, hint: 'Toucher deux fois : voir le quartier' };
    }
    if (hit.site) {
      const site = hit.site;
      if (site.locked) return { title: site.name, text: 'Dans un quartier encore fermé.', hint: 'Toucher deux fois : voir le quartier' };
      if (!site.level) return { title: `${site.name} · à bâtir`, text: site.next && site.next.effect ? site.next.effect : '', hint: 'Toucher deux fois : ce qu’il faut pour bâtir' };
      const per = site.perHour;
      const text = per ? `Palier ${roman(site.level)} · ${per.amount} ${LABEL[site.produce] || ''} et ${per.coins} écus par heure` : `Palier ${roman(site.level)}${site.effect ? ` · ${site.effect}` : ''}`;
      return { title: site.name, text, hint: 'Toucher deux fois : sa fiche et sa boutique' };
    }
    if (hit.craft) return { title: this.craftName(hit.craft.craft), text: 'Une création d’île, assemblée à l’établi.', hint: 'Appui long : la déplacer ou la ranger' };
    if (hit.deposit) {
      const deposit = hit.deposit;
      const [name, verb] = DEPOSIT_NAMES[deposit.find];
      const zone = this.state.map.zones.find(z => z.id === deposit.zone);
      const wait = depositWait(deposit, this.clock - this.loadedAt);
      // (ce que la mer rend sur la plage de Brumelune va aux réserves ; les trouvailles de climat, au sac)
      const hint = deposit.pickup ? 'Il va dans tes réserves, en haut' : 'Le sac, en haut à gauche : tes trouvailles';
      if (!zone || !zone.owned) return { title: name, text: `Achète ${zone ? zone.name : 'ce quartier'} pour ${verb}.`, hint };
      if (wait) return { title: name, text: deposit.pickup ? `La mer en rapportera dans ${waitText(wait)}.` : `Repousse dans ${waitText(wait)}.`, hint };
      return { title: name, text: `Prêt : touche pour ${verb}${deposit.bonus ? ` (+${deposit.bonus} grâce aux créations de climat)` : ''}.`, hint: 'Toucher deux fois : ramasser' };
    }
    if (hit.landmark) {
      const landmark = hit.landmark;
      const zone = this.state.map.zones.find(z => z.id === landmark.zone);
      if (landmark.found) return { title: landmark.name, text: landmark.effect, hint: 'Appui long : sa page du Carnet' };
      if (zone && zone.owned) return { title: landmark.name, text: 'Un lieu remarquable à découvrir.', hint: 'Toucher deux fois : le découvrir' };
      return { title: landmark.name, text: `Achète ${zone ? zone.name : 'ce quartier'} pour découvrir ce lieu.`, hint: 'Appui long : le Carnet d’explorateur' };
    }
    // Le camp des naufragés : ce qu'est chaque élément ; le décor naturel et l'herbe ne disent rien
    if (hit.campItem) return campInfo(hit.campItem.art);
    return null;
  },
  // Point de l'écran (page) d'un point du canvas
  canvasPoint(x, y) {
    const rect = this.$refs.canvas.getBoundingClientRect();
    return { x: rect.left + x, y: rect.top + y };
  },
  // Vignette d'un bâtiment (son dessin actuel) pour sa fiche : celui de la bibliothèque (sous son skin, sa teinte ou sa
  // pièce rare), sinon celui du jeu
  artOf(site) {
    if (!site.level) return buildingThumb(site.id, 0, this.stageOf(site)) || spriteUrl(`chantier-${this.stageOf(site)}`, BUILDINGS.chantier[this.stageOf(site)]);
    return buildingThumb(site.id, site.level, 0, site.skin || '') || spriteUrl(`art-${site.id}-${site.level}-${site.skin || ''}`, artMake(site.id, site.level, site.skin));
  }
};
