/**
 * Contrôleur Réservations
 * Gère la création et le suivi des séances de tutorat
 */
const { Booking, Course, User } = require('../models');

/**
 * Crée une nouvelle réservation
 * @param {Object} req - Requête avec {coursId, dateSeance, dureeMinutes, modalite, adresse, notes}
 * @param {Object} res - Réponse Express
 */
async function creerReservation(req, res) {
  try {
    const { coursId, dateSeance, dureeMinutes, modalite, adresse, notes } = req.body;

    const cours = await Course.findByPk(coursId);
    if (!cours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    const montantTotal = (cours.tarifHoraire / 60) * (dureeMinutes || 60);

    const reservation = await Booking.create({
      etudiantId: req.user.id,
      tuteurId: cours.tuteurId,
      coursId,
      dateSeance,
      dureeMinutes: dureeMinutes || 60,
      modalite,
      adresse,
      montantTotal,
      notes,
    });

    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la réservation', details: error.message });
  }
}

/**
 * Liste les réservations de l'utilisateur connecté
 * @param {Object} req - Requête avec req.user
 * @param {Object} res - Réponse Express
 */
async function mesReservations(req, res) {
  try {
    const { role, id } = req.user;
    const whereClause = role === 'tuteur' ? { tuteurId: id } : { etudiantId: id };

    const reservations = await Booking.findAll({
      where: whereClause,
      include: [
        { model: Course, as: 'cours', attributes: ['titre', 'matiere'] },
        { model: User, as: 'etudiant', attributes: ['prenom', 'nom'] },
        { model: User, as: 'tuteur', attributes: ['prenom', 'nom'] },
      ],
      order: [['dateSeance', 'DESC']],
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
}

/**
 * Confirme ou annule une réservation (tuteur ou étudiant)
 * @param {Object} req - Requête avec req.params.id et req.body.statut
 * @param {Object} res - Réponse Express
 */
async function mettreAJourStatut(req, res) {
  try {
    const { statut } = req.body;
    const reservation = await Booking.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (reservation.tuteurId !== req.user.id && reservation.etudiantId !== req.user.id) {
      return res.status(403).json({ error: 'Action non autorisée' });
    }

    reservation.statut = statut;
    await reservation.save();

    res.json({ message: 'Statut mis à jour', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
}

/**
 * Tuteur marque la séance comme terminée → déclenche la validation famille
 * @param {Object} req - req.params.id = ID de la réservation
 * @param {Object} res
 */
async function terminerSeance(req, res) {
  try {
    const reservation = await Booking.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (reservation.tuteurId !== req.user.id) {
      return res.status(403).json({ error: 'Seul le tuteur peut marquer la séance comme terminée' });
    }

    if (reservation.statut !== 'en_cours' && reservation.statut !== 'confirmee') {
      return res.status(400).json({ error: 'La séance doit être en cours ou confirmée pour être terminée' });
    }

    reservation.statut = 'terminee';
    reservation.familyValidationStatus = 'en_attente';
    await reservation.save();

    res.json({ message: 'Séance marquée comme terminée. En attente de validation famille.', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la clôture de séance', details: error.message });
  }
}

/**
 * Famille / étudiant valide ou conteste une séance terminée
 * @param {Object} req - req.params.id, req.body.decision ('confirmee'|'contestee'), req.body.note
 * @param {Object} res
 */
async function validerSeanceFamille(req, res) {
  try {
    const { decision, note } = req.body;

    if (!['confirmee', 'contestee'].includes(decision)) {
      return res.status(400).json({ error: 'Décision invalide. Valeurs acceptées : confirmee, contestee' });
    }

    const reservation = await Booking.findByPk(req.params.id, {
      include: [
        { model: Course, as: 'cours', attributes: ['titre'] },
        { model: User, as: 'tuteur', attributes: ['prenom', 'nom'] },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (reservation.etudiantId !== req.user.id) {
      return res.status(403).json({ error: 'Seul l\'étudiant ou sa famille peut valider cette séance' });
    }

    if (reservation.statut !== 'terminee') {
      return res.status(400).json({ error: 'La séance doit être terminée pour être validée' });
    }

    if (reservation.familyValidationStatus !== 'en_attente') {
      return res.status(400).json({ error: 'Cette séance a déjà été traitée' });
    }

    reservation.familyValidationStatus = decision;
    if (note) reservation.familyValidationNote = note;
    await reservation.save();

    const message = decision === 'confirmee'
      ? 'Séance confirmée avec succès.'
      : 'Contestation enregistrée. L\'équipe EduKaay vous contactera.';

    res.json({ message, reservation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la validation', details: error.message });
  }
}

/**
 * Liste les séances en attente de validation famille (pour l'étudiant connecté)
 */
async function seancesAValider(req, res) {
  try {
    const reservations = await Booking.findAll({
      where: {
        etudiantId: req.user.id,
        statut: 'terminee',
        familyValidationStatus: 'en_attente',
      },
      include: [
        { model: Course, as: 'cours', attributes: ['titre', 'matiere'] },
        { model: User, as: 'tuteur', attributes: ['prenom', 'nom', 'telephone'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération', details: error.message });
  }
}

module.exports = {
  creerReservation,
  mesReservations,
  mettreAJourStatut,
  terminerSeance,
  validerSeanceFamille,
  seancesAValider,
};
