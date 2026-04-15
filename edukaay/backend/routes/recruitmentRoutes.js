/**
 * Routes Recrutement Tuteurs
 * Candidatures publiques + gestion admin
 */
const express = require('express');
const router = express.Router();
const { soumettreCandidat, listerCandidatures, traiterCandidature } = require('../controllers/recruitmentController');
const { authentifier, autoriser } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public : soumettre une candidature (avec upload PDF optionnel)
router.post('/postuler', upload.single('document'), soumettreCandidat);

// Admin uniquement
router.get('/candidatures', authentifier, autoriser('admin'), listerCandidatures);
router.patch('/candidatures/:id', authentifier, autoriser('admin'), traiterCandidature);

module.exports = router;
