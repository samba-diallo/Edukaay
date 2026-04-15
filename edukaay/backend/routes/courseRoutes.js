/**
 * Routes Cours
 * Endpoints pour créer, rechercher et consulter des cours
 */
const express = require('express');
const router = express.Router();
const { creerCours, rechercherCours, getCoursParId } = require('../controllers/courseController');
const { authentifier, autoriser } = require('../middleware/auth');

router.get('/', rechercherCours);
router.get('/:id', getCoursParId);
router.post('/', authentifier, autoriser('tuteur'), creerCours);

module.exports = router;
