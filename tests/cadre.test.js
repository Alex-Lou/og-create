// Une pop-up toujours entière à l'écran, jamais sur le HUD (utils/cadre.js) : elle glisse vers l'intérieur, sous le HUD
// du haut, au-dessus de celui du bas ; sans place, en haut de la place libre.
import { describe, expect, it } from 'vitest';
import { placer, MARGE } from '@/utils/cadre';

const ecran = { w: 390, h: 844 };
const boite = (x0, y0, w, h) => ({ x0, y0, x1: x0 + w, y1: y0 + h });
const bouge = (b, { dx, dy }) => boite(b.x0 + dx, b.y0 + dy, b.x1 - b.x0, b.y1 - b.y0);

describe('une pop-up entière à l’écran, hors du HUD', () => {
  it('à sa place, rien ne bouge', () => {
    expect(placer(boite(60, 300, 260, 90), [], ecran)).toEqual({ dx: 0, dy: 0 });
  });

  it('près d’un bord, elle glisse vers l’intérieur, son débord compris (le sceau)', () => {
    const b = placer(boite(250, 300, 200, 90), [], ecran);
    expect(b.dx).toBe(ecran.w - MARGE - 450);
    expect(placer(boite(-30, 300, 200, 90), [], ecran).dx).toBe(MARGE + 30);
  });

  it('plus large que l’écran, elle se cale à gauche (son début se lit)', () => {
    expect(placer(boite(-20, 300, 500, 90), [], ecran).dx).toBe(MARGE + 20);
  });

  it('sur le HUD du haut, elle passe dessous ; sur celui du bas, au-dessus', () => {
    const haut = [{ x0: 10, y0: 10, x1: 380, y1: 95 }];
    const moved = bouge(boite(60, 70, 260, 90), placer(boite(60, 70, 260, 90), haut, ecran));
    expect(moved.y0).toBe(95 + MARGE);
    const bas = [{ x0: 0, y0: 780, x1: 390, y1: 844 }];
    const up = bouge(boite(60, 720, 260, 90), placer(boite(60, 720, 260, 90), bas, ecran));
    expect(up.y1).toBe(780 - MARGE);
  });

  it('un bouton du HUD qui n’est pas en face d’elle ne la repousse pas', () => {
    const colonne = [{ x0: 340, y0: 100, x1: 380, y1: 280 }];
    expect(placer(boite(60, 150, 260, 90), colonne, ecran)).toEqual({ dx: 0, dy: 0 });
  });

  it('elle glisse d’abord de côté, puis évite ce qui est en face à sa nouvelle place', () => {
    const colonne = [{ x0: 340, y0: 100, x1: 380, y1: 280 }];
    const b = boite(250, 150, 200, 90);
    const moved = bouge(b, placer(b, colonne, ecran));
    expect(moved.x1).toBe(ecran.w - MARGE);
    expect(moved.y0).toBe(280 + MARGE);
  });

  it('sans assez de place entre le haut et le bas, elle se tient en haut de la place libre', () => {
    const hud = [{ x0: 0, y0: 0, x1: 390, y1: 400 }, { x0: 0, y0: 450, x1: 390, y1: 844 }];
    const moved = bouge(boite(60, 600, 260, 90), placer(boite(60, 600, 260, 90), hud, ecran));
    expect(moved.y0).toBe(400 + MARGE);
  });
});
