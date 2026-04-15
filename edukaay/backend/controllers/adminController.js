/**
 * Contrôleur Admin
 * Tableau de bord et statistiques pour les administrateurs EduKaay
 */
const { User, Course, Booking, Payment, TutorApplication } = require('../models');
const { Op } = require('sequelize');

/**
 * Retourne les statistiques globales de la plateforme
 */
async function getStats(req, res) {
  try {
    const [
      totalEtudiants,
      totalTuteurs,
      totalCours,
      totalReservations,
      candidaturesEnAttente,
      seancesContestees,
    ] = await Promise.all([
      User.count({ where: { role: 'etudiant', estActif: true } }),
      User.count({ where: { role: 'tuteur', estActif: true } }),
      Course.count({ where: { estActif: true } }),
      Booking.count(),
      TutorApplication.count({ where: { statut: 'en_attente' } }),
      Booking.count({ where: { familyValidationStatus: 'contestee' } }),
    ]);

    // Chiffre d'affaires total (paiements complétés)
    const revenuResult = await Payment.findOne({
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('montant')), 'total'],
      ],
      where: { statut: 'complete' },
      raw: true,
    });
    const revenusTotal = parseFloat(revenuResult?.total || 0);

    res.json({
      stats: {
        etudiants: totalEtudiants,
        tuteurs: totalTuteurs,
        cours: totalCours,
        reservations: totalReservations,
        candidaturesEnAttente,
        seancesContestees,
        revenusTotal,
        commissionPlateforme: revenusTotal * 0.15,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques', details: error.message });
  }
}

/**
 * Liste les litiges/contestations en cours
 */
async function getLitiges(req, res) {
  try {
    const litiges = await Booking.findAll({
      where: { familyValidationStatus: 'contestee' },
      include: [
        { model: require('../models').Course, as: 'cours', attributes: ['titre', 'matiere'] },
        { model: require('../models').User, as: 'etudiant', attributes: ['prenom', 'nom', 'telephone', 'email'] },
        { model: require('../models').User, as: 'tuteur', attributes: ['prenom', 'nom', 'telephone', 'email'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.json({ total: litiges.length, litiges });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des litiges', details: error.message });
  }
}

/**
 * Résout un litige (admin tranche)
 * @param {Object} req - params.id (booking), body: {resolution: 'confirmee'|'annulee', note}
 */
async function resoudreLitige(req, res) {
  try {
    const { resolution, note } = req.body;

    if (!['confirmee', 'annulee'].includes(resolution)) {
      return res.status(400).json({ error: 'Résolution invalide.' });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Réservation non trouvée' });

    booking.familyValidationStatus = resolution;
    if (note) booking.familyValidationNote = `[ADMIN] ${note}`;
    await booking.save();

    res.json({ message: 'Litige résolu.', booking });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la résolution', details: error.message });
  }
}

/**
 * Liste tous les utilisateurs avec filtres (admin)
 */
async function getUtilisateurs(req, res) {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const where = role ? { role } : {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['motDePasse'] },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({ total: count, page: parseInt(page), utilisateurs: rows });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération', details: error.message });
  }
}

module.exports = { getStats, getLitiges, resoudreLitige, getUtilisateurs };
