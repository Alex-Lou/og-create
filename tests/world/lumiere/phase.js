// Phase du ciel minimale pour les tests d'éclairage (midi, ciel clair), à surcharger au besoin
export const phase = (over = {}) => ({
  tint: '#ffffff',
  night: 0,
  lit: 0,
  sun: { up: 0.6, progress: 0.5 },
  weather: { cover: 0, rain: 0, storm: 0 },
  ...over
});
