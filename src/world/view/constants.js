// Constantes de l'île partagées par WorldView.vue et ses modules (src/world/view). Extrait de WorldView.vue (lot
// santé), sans changement.
const TW = 64; // largeur d'une case à l'échelle 1 (unités du monde)
const TH = TW / 2;
// Gisements des trouvailles : un peu plus grands que leur case, pour se voir dans le décor
const DEPOSIT_SCALE = 1.25;

export { TW, TH, DEPOSIT_SCALE };
