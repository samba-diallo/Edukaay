/**
 * Routes Module IA
 * Endpoints pour le chatbot et l'interaction vocale
 */
const express = require('express');
const router = express.Router();
const { chat, voice } = require('../controllers/aiController');

// Accessible sans authentification pour faciliter l'adoption
router.post('/chat', chat);
router.post('/voice', voice);

module.exports = router;
