// Paliers III à VII des bâtiments (lot 4a) : un fichier par bâtiment, chacun exporte la liste de ses paliers
// (à la suite de ceux déjà dessinés dans sprites.js et buildings2.js).
// Palier IV et suivants : emprise de 3 × 3 cases (u, v ∈ [-1.5, 1.5]), cadre BIG_BOX.
import { FOYER_TIERS } from './foyer';
import { CARRIERE_TIERS } from './carriere';
import { BOSQUET_TIERS } from './bosquet';
import { PUITS_TIERS } from './puits';
import { POTAGER_TIERS } from './potager';
import { ATELIER_TIERS } from './atelier';
import { PONTON_TIERS } from './ponton';

export const TIERS = { foyer: FOYER_TIERS, carriere: CARRIERE_TIERS, bosquet: BOSQUET_TIERS, puits: PUITS_TIERS, potager: POTAGER_TIERS, atelier: ATELIER_TIERS, ponton: PONTON_TIERS };
