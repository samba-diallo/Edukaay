/**
 * Routes Bourses / Dons
 * Endpoints pour gérer les dons de la diaspora
 */
const express = require('express');
const router = express.Router();
const { creerDon, boursesDisponibles } = require('../controllers/scholarshipController');
const { authentifier } = require('../middleware/auth');

router.post('/', authentifier, creerDon);
router.get('/disponibles', authentifier, boursesDisponibles);

module.exports = router;
