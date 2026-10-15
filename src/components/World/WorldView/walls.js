// L'île : ses murs raccordés et ses portes qui s'ouvrent (choix de l'auteur, 15 oct.). Chaque case de clôture, de
// muret ou de porte se raccorde à ses voisines et aux bâtiments qu'elle touche (world/wallSprites.js : wallMask) ;
// l'aperçu d'un trait ou d'une pose s'y raccorde déjà. Une porte s'ouvre devant qui la passe (un habitant, toujours :
// il a la clé ; un égaré, seulement sans verrou), reste ouverte le temps qu'il passe, puis se referme derrière lui et
// rebondit contre son poteau (un ressort ; en mouvement réduit, elle s'ouvre et se ferme d'un coup). Mixin de
// WorldView.vue.
import { wallMask, wallLayer, drawGateLeaf, leafInFront, WALL_LOOKS, ALONE_U, ALONE_V } from '@/world/wallSprites';
import { drawSprite } from '@/world/spriteCache';

const DOOR = 'porte';
// Qui ouvre une porte : à moins de tant de cases d'elle de part et d'autre de son mur, et de tant le long du mur
const REACH_ACROSS = 1.15;
const REACH_ALONG = 0.6;
// Le ressort du battant : raideur, amortissement ; ce qu'il garde en rebondissant contre son poteau
const STIFF = 70;
const DAMP = 10;
const KNOCK = 0.35;

// L'ouverture d'un battant, une image plus loin : s ({ a, v }), vers target (0 ou 1), en dt secondes
export function swingStep(s, target, dt) {
  s.v += (STIFF * (target - s.a) - DAMP * s.v) * dt;
  s.a += s.v * dt;
  // (refermé trop vite : il cogne son poteau et rebondit un peu)
  if (s.a < 0) {
    s.a = -s.a * KNOCK;
    s.v = -s.v * KNOCK;
  }
  return s;
}

export default {
  computed: {
    // Les cases de mur (« x,y » → création) : posées, et l'aperçu d'une pose ou d'un trait
    wallCells() {
      const cells = new Map();
      for (const c of this.crafted) if (WALL_LOOKS.has(c.craft)) cells.set(`${c.x},${c.y}`, c.craft);
      const ghost = this.craftGhost;
      if (ghost && WALL_LOOKS.has(ghost.craft)) cells.set(`${ghost.x},${ghost.y}`, ghost.craft);
      for (const g of this.lineGhosts) if (WALL_LOOKS.has(g.craft)) cells.set(`${g.x},${g.y}`, g.craft);
      return cells;
    }
  },
  methods: {
    // Une case de mur, déjà placée au centre de sa case (draw/sites.js : drawCraft) : ses demi-travées (une pièce seule
    // reste droite, dans son sens : flip) ; une porte, ses poteaux et son battant, à son ouverture du moment
    drawWall(ctx, craft, repaint) {
      const hold = `craft:${craft.x},${craft.y}`;
      if (craft.craft !== DOOR) {
        const layer = this.wallLayerOf(craft);
        drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, hold);
        return;
      }
      const swing = this.doorSwing.get(`${craft.x},${craft.y}`);
      const open = swing ? swing.a * swing.side : 0;
      const posts = wallLayer(DOOR, 0);
      if (!leafInFront(open)) drawGateLeaf(ctx, craft.locked, open);
      drawSprite(ctx, posts.key, posts.make, 0, 0, repaint, hold);
      if (leafInFront(open)) drawGateLeaf(ctx, craft.locked, open);
    },
    // Le calque d'une clôture ou d'un muret : ses demi-travées
    wallLayerOf(craft) {
      const mask = wallMask(craft.x, craft.y, (x, y) => this.wallCells.has(`${x},${y}`), (x, y) => this.wallAnchors.has(`${x},${y}`));
      return wallLayer(craft.craft, mask || (craft.flip ? ALONE_V : ALONE_U));
    },
    // Les portes, une image plus loin (draw/loop.js) : crowd, ceux qui marchent sur l'île ({ kind, x, y }). Le battant
    // s'ouvre à l'opposé de qui arrive (on le pousse)
    swingDoors(t, crowd) {
      const dt = this.doorClock === null ? 0 : Math.min(0.05, Math.max(0, t - this.doorClock));
      this.doorClock = t;
      const still = this.reduced();
      for (const door of this.crafted) {
        if (door.craft !== DOOR) continue;
        const key = `${door.x},${door.y}`;
        // (la porte va le long de x, ou de y si elle est pivotée : across, l'écart de part et d'autre de son mur)
        let near = null;
        for (const c of crowd) {
          if (c.kind !== 'villager' && !(c.kind === 'stray' && !door.locked)) continue;
          const across = door.flip ? c.x - door.x : c.y - door.y;
          const along = door.flip ? c.y - door.y : c.x - door.x;
          if (Math.abs(across) <= REACH_ACROSS && Math.abs(along) <= REACH_ALONG) {
            near = across;
            break;
          }
        }
        let s = this.doorSwing.get(key);
        if (!s) {
          if (near === null) continue;
          s = { a: 0, v: 0, side: 1 };
          this.doorSwing.set(key, s);
        }
        if (near !== null && s.a < 0.05) s.side = near >= 0 ? -1 : 1;
        const target = near === null ? 0 : 1;
        if (still) {
          s.a = target;
          s.v = 0;
        } else swingStep(s, target, dt);
        if (!target && s.a < 0.01 && Math.abs(s.v) < 0.05) this.doorSwing.delete(key);
      }
      if (this.doorSwing.size) this.drawSoon();
    }
  }
};
