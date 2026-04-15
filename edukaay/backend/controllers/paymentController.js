/**
 * Contrôleur Paiements
 * Orchestre les paiements via Mobile Money (Wave, Orange Money, MTN MoMo)
 */
const { Payment, Booking } = require('../models');
const paymentService = require('../services/paymentService');

/** Taux de commission EduKaay (15%) */
const TAUX_COMMISSION = 0.15;

/**
 * Initie un paiement pour une réservation
 * @param {Object} req - Requête avec {reservationId, methodePaiement}
 * @param {Object} res - Réponse Express
 */
async function initierPaiement(req, res) {
  try {
    const { reservationId, methodePaiement } = req.body;

    const reservation = await Booking.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (reservation.etudiantId !== req.user.id) {
      return res.status(403).json({ error: 'Seul l\'étudiant peut payer cette réservation' });
    }

    const montant = parseFloat(reservation.montantTotal);
    const commission = montant * TAUX_COMMISSION;

    // Créer l'enregistrement de paiement
    const paiement = await Payment.create({
      reservationId,
      payeurId: req.user.id,
      beneficiaireId: reservation.tuteurId,
      montant,
      commission,
      methodePaiement,
      statut: 'en_attente',
    });

    // Appeler le service de paiement approprié
    const resultat = await paymentService.traiterPaiement({
      methode: methodePaiement,
      montant,
      telephone: req.user.telephone,
      reference: paiement.id,
    });

    paiement.referenceExterne = resultat.referenceExterne;
    await paiement.save();

    res.json({
      message: 'Paiement initié',
      paiement: { id: paiement.id, statut: paiement.statut, ...resultat },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'initiation du paiement', details: error.message });
  }
}

/**
 * Webhook pour recevoir les notifications de paiement
 * @param {Object} req - Requête contenant la notification du fournisseur
 * @param {Object} res - Réponse Express
 */
async function webhookPaiement(req, res) {
  try {
    const { reference, statut, transactionId } = req.body;

    const paiement = await Payment.findByPk(reference);
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    paiement.statut = statut === 'success' ? 'reussi' : 'echoue';
    paiement.referenceExterne = transactionId;
    await paiement.save();

    // Mettre à jour la réservation si le paiement est réussi
    if (paiement.statut === 'reussi') {
      await Booking.update({ statut: 'confirmee' }, { where: { id: paiement.reservationId } });
    }

    res.json({ message: 'Notification traitée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du traitement de la notification' });
  }
}

module.exports = { initierPaiement, webhookPaiement };
