/**
 * Contrôleur Bourses / Dons
 * Gère les dons de la diaspora pour financer les cours d'étudiants défavorisés
 */
const { Scholarship, User } = require('../models');

/**
 * Crée un don / une bourse
 * @param {Object} req - Requête avec {montant, beneficiaireId, message, methodePaiement}
 * @param {Object} res - Réponse Express
 */
async function creerDon(req, res) {
  try {
    const { montant, beneficiaireId, message, methodePaiement } = req.body;

    const don = await Scholarship.create({
      donateurId: req.user ? req.user.id : null,
      donateurNom: req.body.donateurNom || `${req.user.prenom} ${req.user.nom}`,
      donateurEmail: req.body.donateurEmail || req.user.email,
      montant,
      montantRestant: montant,
      beneficiaireId: beneficiaireId || null,
      message,
      methodePaiement,
    });

    res.status(201).json({ message: 'Don enregistré avec succès. Merci pour votre générosité !', don });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du don', details: error.message });
  }
}

/**
 * Liste les bourses disponibles pour un étudiant
 * @param {Object} req - Requête avec req.user
 * @param {Object} res - Réponse Express
 */
async function boursesDisponibles(req, res) {
  try {
    const { Op } = require('sequelize');
    const bourses = await Scholarship.findAll({
      where: {
        statut: 'actif',
        montantRestant: { [Op.gt]: 0 },
        [Op.or]: [
          { beneficiaireId: req.user.id },
          { beneficiaireId: null },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({ bourses });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des bourses' });
  }
}

module.exports = { creerDon, boursesDisponibles };
