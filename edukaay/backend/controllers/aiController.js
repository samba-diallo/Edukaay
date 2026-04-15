/**
 * Contrôleur Module IA — STRUCTURE UNIQUEMENT
 *
 * Prêt pour intégration future :
 * - Chatbot multilingue (Français + Wolof)
 * - Assistant de navigation
 * - Interaction vocale
 *
 * Aucun modèle IA n'est intégré à ce stade.
 * Ces endpoints retournent des réponses simulées pour valider l'architecture.
 */

/**
 * POST /api/ai/chat
 * Reçoit un message et retourne une réponse simulée
 * @param {Object} req - body: {message, langue?: 'fr'|'wo', sessionId?}
 */
async function chat(req, res) {
  try {
    const { message, langue = 'fr', sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
    }

    // Structure de réponse — à connecter à un vrai LLM (Claude, GPT, etc.)
    const reponse = {
      sessionId: sessionId || `session_${Date.now()}`,
      langue,
      message: message.trim(),
      reponse: getReponseSimulee(message, langue),
      timestamp: new Date().toISOString(),
      source: 'stub', // Remplacer par 'claude' ou 'gpt' lors de l'intégration
    };

    res.json(reponse);
  } catch (error) {
    res.status(500).json({ error: 'Erreur du module IA', details: error.message });
  }
}

/**
 * POST /api/ai/voice
 * Reçoit un message vocal (transcription) et retourne une réponse
 * @param {Object} req - body: {transcription, langue?: 'fr'|'wo'}
 */
async function voice(req, res) {
  try {
    const { transcription, langue = 'fr' } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'La transcription est requise.' });
    }

    res.json({
      transcription,
      langue,
      reponse: getReponseSimulee(transcription, langue),
      audioUrl: null, // À générer avec un TTS lors de l'intégration
      timestamp: new Date().toISOString(),
      source: 'stub',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur du module vocal', details: error.message });
  }
}

/**
 * Réponses simulées par mots-clés — remplacera par vrai LLM
 * @param {string} message
 * @param {string} langue
 * @returns {string}
 */
function getReponseSimulee(message, langue) {
  const msg = message.toLowerCase();
  const isFr = langue === 'fr';

  if (msg.includes('tuteur') || msg.includes('professeur')) {
    return isFr
      ? 'Pour trouver un tuteur, rendez-vous dans la section "Trouver un cours" et filtrez par matière et niveau.'
      : 'Ngir gëna jënd tëgëlkat bi, dem ci "Cours yi" wàcc ci dëkk ak njànk bi.';
  }

  if (msg.includes('réserver') || msg.includes('réservation') || msg.includes('résa')) {
    return isFr
      ? 'Pour réserver une séance, choisissez un tuteur, sélectionnez une date et payez via Mobile Money.'
      : 'Ngir yëgël say jëfandikoo yi, tann sa tëgëlkat, tànn bés bu neex la, te fay ak Mobile Money.';
  }

  if (msg.includes('payer') || msg.includes('paiement') || msg.includes('wave') || msg.includes('orange')) {
    return isFr
      ? 'EduKaay accepte Wave, Orange Money et MTN MoMo. Le paiement est sécurisé et instantané.'
      : 'EduKaay jëfandikoo Wave, Orange Money ak MTN MoMo. Diggante wi dafa suur te gaaw.';
  }

  if (msg.includes('bourse') || msg.includes('aide')) {
    return isFr
      ? 'Notre programme de bourses diaspora permet de financer des cours pour des étudiants défavorisés.'
      : 'Sa burs bu diaspora bi mën a jëfandiku ngir jënd jàng yi ci xaleyi yu yàgg.';
  }

  return isFr
    ? 'Bonjour ! Je suis l\'assistant EduKaay. Comment puis-je vous aider aujourd\'hui ?'
    : 'Salaam ! Man mooy asistaan bi EduKaay. Ana lëkk ma la wëy tey?';
}

module.exports = { chat, voice };
