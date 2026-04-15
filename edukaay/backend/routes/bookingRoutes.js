/**
 * Routes Réservations
 * Endpoints pour créer et gérer les séances de tutorat
 */
const express = require('express');
const router = express.Router();
const {
  creerReservation,
  mesReservations,
  mettreAJourStatut,
  terminerSeance,
  validerSeanceFamille,
  seancesAValider,
} = require('../controllers/bookingController');
const { authentifier } = require('../middleware/auth');

router.post('/', authentifier, creerReservation);
router.get('/mes-reservations', authentifier, mesReservations);
router.get('/a-valider', authentifier, seancesAValider);
router.patch('/:id/statut', authentifier, mettreAJourStatut);
router.patch('/:id/terminer', authentifier, terminerSeance);
router.patch('/:id/valider-famille', authentifier, validerSeanceFamille);

module.exports = router;
