/**
 * Routes Avis
 * Endpoints pour publier des avis sur les tuteurs
 */
const express = require('express');
const router = express.Router();
const { creerAvis } = require('../controllers/reviewController');
const { authentifier, autoriser } = require('../middleware/auth');

router.post('/', authentifier, autoriser('etudiant'), creerAvis);

module.exports = router;
