/**
 * Routes Admin
 * Statistiques et gestion de la plateforme (accès admin uniquement)
 */
const express = require('express');
const router = express.Router();
const { getStats, getLitiges, resoudreLitige, getUtilisateurs } = require('../controllers/adminController');
const { authentifier, autoriser } = require('../middleware/auth');

router.use(authentifier, autoriser('admin'));

router.get('/stats', getStats);
router.get('/litiges', getLitiges);
router.patch('/litiges/:id/resoudre', resoudreLitige);
router.get('/utilisateurs', getUtilisateurs);

module.exports = router;
