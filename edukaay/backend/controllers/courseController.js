/**
 * Contrôleur Cours
 * Gère la création, la recherche et la gestion des cours
 */
const { Course, User, Review } = require('../models');
const { Op } = require('sequelize');

/**
 * Crée un nouveau cours (tuteurs uniquement)
 * @param {Object} req - Requête contenant les détails du cours
 * @param {Object} res - Réponse Express
 */
async function creerCours(req, res) {
  try {
    const { titre, description, matiere, niveau, curriculum, tarifHoraire, modalite, villeDisponible } = req.body;

    const cours = await Course.create({
      titre,
      description,
      matiere,
      niveau,
      curriculum,
      tarifHoraire,
      modalite,
      villeDisponible,
      tuteurId: req.user.id,
    });

    res.status(201).json({ message: 'Cours créé avec succès', cours });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du cours', details: error.message });
  }
}

/**
 * Recherche des cours avec filtres
 * @param {Object} req - Query params: {matiere, niveau, modalite, ville, minTarif, maxTarif, q, page, limit}
 * @param {Object} res - Réponse Express
 */
async function rechercherCours(req, res) {
  try {
    const { matiere, niveau, modalite, ville, minTarif, maxTarif, q, page = 1, limit = 20 } = req.query;
    const where = { estActif: true };

    if (matiere) where.matiere = matiere;
    if (niveau) where.niveau = niveau;
    if (modalite) where.modalite = modalite;
    if (ville) where.villeDisponible = ville;
    if (minTarif || maxTarif) {
      where.tarifHoraire = {};
      if (minTarif) where.tarifHoraire[Op.gte] = parseFloat(minTarif);
      if (maxTarif) where.tarifHoraire[Op.lte] = parseFloat(maxTarif);
    }
    if (q) {
      where[Op.or] = [
        { titre: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const { rows, count } = await Course.findAndCountAll({
      where,
      include: [{ model: User, as: 'tuteur', attributes: ['id', 'prenom', 'nom', 'avatar', 'ville'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['noteMoyenne', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      cours: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche de cours' });
  }
}

/**
 * Récupère un cours par son ID avec le profil du tuteur
 * @param {Object} req - Paramètre req.params.id
 * @param {Object} res - Réponse Express
 */
async function getCoursParId(req, res) {
  try {
    const cours = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: 'tuteur', attributes: { exclude: ['motDePasse'] } },
        { model: Review, as: 'avis', include: [{ model: User, as: 'etudiant', attributes: ['prenom', 'nom', 'avatar'] }] },
      ],
    });

    if (!cours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.json({ cours });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
  }
}

module.exports = { creerCours, rechercherCours, getCoursParId };
