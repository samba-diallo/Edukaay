/**
 * Contrôleur Avis
 * Permet aux étudiants de noter les tuteurs après une séance
 */
const { Review, Course, Booking } = require('../models');
const { sequelize } = require('../config/database');

/**
 * Crée un avis pour un cours/tuteur
 * @param {Object} req - Requête avec {coursId, note, commentaire}
 * @param {Object} res - Réponse Express
 */
async function creerAvis(req, res) {
  try {
    const { coursId, note, commentaire } = req.body;

    const cours = await Course.findByPk(coursId);
    if (!cours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    // Vérifier que l'étudiant a bien suivi ce cours
    const reservationExistante = await Booking.findOne({
      where: { etudiantId: req.user.id, coursId, statut: 'terminee' },
    });
    if (!reservationExistante) {
      return res.status(403).json({ error: 'Vous devez avoir suivi ce cours pour donner un avis' });
    }

    const avis = await Review.create({
      etudiantId: req.user.id,
      tuteurId: cours.tuteurId,
      coursId,
      note,
      commentaire,
    });

    // Recalculer la note moyenne du cours
    const stats = await Review.findOne({
      where: { coursId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('note')), 'moyenne'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      ],
      raw: true,
    });

    await Course.update(
      { noteMoyenne: parseFloat(stats.moyenne).toFixed(2), nombreAvis: parseInt(stats.total) },
      { where: { id: coursId } }
    );

    res.status(201).json({ message: 'Avis publié', avis });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la publication de l\'avis', details: error.message });
  }
}

module.exports = { creerAvis };
