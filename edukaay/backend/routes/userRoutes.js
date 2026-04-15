/**
 * Routes Utilisateur
 * Endpoints pour l'inscription, connexion et gestion de profil
 */
const express = require('express');
const router = express.Router();
const { inscription, connexion, getProfil, updateProfil, listerTuteurs } = require('../controllers/userController');
const { authentifier } = require('../middleware/auth');

router.post('/inscription', inscription);
router.post('/connexion', connexion);
router.get('/profil', authentifier, getProfil);
router.put('/profil', authentifier, updateProfil);
router.get('/tuteurs', listerTuteurs);

module.exports = router;
