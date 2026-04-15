/**
 * Routes Paiements
 * Endpoints pour initier des paiements et recevoir les webhooks
 */
const express = require('express');
const router = express.Router();
const { initierPaiement, webhookPaiement } = require('../controllers/paymentController');
const { authentifier } = require('../middleware/auth');

router.post('/initier', authentifier, initierPaiement);
router.post('/webhook', webhookPaiement);

module.exports = router;
