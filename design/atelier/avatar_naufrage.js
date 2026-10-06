// L'avatar en naufragé (HISTOIRE.md § 6.17) : le même dessin que l'avatar (design/personnages/avatar.js), passé par
// la transformation des naufragés (naufrage.js) : habits délavés, lambeaux à l'ourlet, un trou, manches retroussées
// ou arrachées, pantalon retroussé, pieds nus, une algue dans les cheveux, du sable sur la joue. Le chapeau est
// perdu en mer. L'avatar garde ce look jusqu'au Campement (fin du tutoriel), où Cannelle recoud ses habits.
const { avatar, sansChapeau } = require('../personnages/avatar');
const { castaway, weed, smudge } = require('./naufrage');

function avatarNaufrage(choix = {}, opts = {}) {
  const c = avatar(sansChapeau(choix), { ...opts, uid: (opts.uid || 'av') + 'n' });
  const fadeList = [c.top, c.topS, c.topH, c.tee, c.leg, c.legS, c.cuff, c.acc].filter(Boolean);
  const T = c.top;
  return castaway(c, {
    fade: fadeList, leg: 'roll',
    sleeves: c.o.haut === 'tshirt' ? 'roll' : 'torn', sleeveCut: c.o.haut === 'tshirt' ? 6.4 : 5,
    tatters: {
      front: [[17.4, 47.4, T, 2, 1], [29.4, 47.6, T, 2.2, 1.2]],
      se: [[16.6, 47.2, T, 2, 1], [27.2, 47.6, T, 2, 1.1]],
      ne: [[18.4, 47.4, T, 2, 1], [29.6, 47.2, T, 2.1, 1]]
    },
    holes: { front: [[28.4, 39.8, 1.25, c.topS]], se: [[26.8, 40, 1.15, c.topS]], ne: [[20.2, 40.4, 1.2, c.topS]] },
    rips: { front: [[19.6, 43.2, 2.4]], se: [[18.8, 43.4, 2.2]], ne: [[28.4, 43, 2.2]] },
    head: ({ view }) => view === 'ne'
      ? weed('M30.4,10.6 Q33.2,14.4 32,19.4', [[32.4, 15, 24]])
      : view === 'se'
        ? weed('M13.4,11.6 Q15.8,15.2 14.6,20', [[14.8, 15.6, -20]]) + smudge(27.4, 27.6, '#A8885E')
        : weed('M14.2,11.8 Q16.8,15.4 15.6,20.2', [[15.8, 15.8, -20]]) + smudge(30.4, 27.6, '#A8885E')
  });
}

module.exports = { avatarNaufrage };
