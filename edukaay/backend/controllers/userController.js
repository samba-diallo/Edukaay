/**
 * Contrôleur Utilisateur
 * Gère l'inscription, la connexion et la gestion des profils
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Inscrit un nouvel utilisateur
 * @param {Object} req - Requête contenant {prenom, nom, email, telephone, motDePasse, role}
 * @param {Object} res - Réponse Express
 */
async function inscription(req, res) {
  try {
    const { prenom, nom, email, telephone, motDePasse, role } = req.body;

    const existant = await User.findOne({ where: { email } });
    if (existant) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const user = await User.create({ prenom, nom, email, telephone, motDePasse, role });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      utilisateur: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription', details: error.message });
  }
}

/**
 * Connecte un utilisateur existant
 * @param {Object} req - Requête contenant {email, motDePasse}
 * @param {Object} res - Réponse Express
 */
async function connexion(req, res) {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await user.verifierMotDePasse(motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion', details: error.message });
  }
}

/**
 * Récupère le profil de l'utilisateur connecté
 * @param {Object} req - Requête avec req.user défini par le middleware auth
 * @param {Object} res - Réponse Express
 */
async function getProfil(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['motDePasse'] },
    });
    res.json({ utilisateur: user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
}

/**
 * Met à jour le profil de l'utilisateur connecté
 * @param {Object} req - Requête contenant les champs à mettre à jour
 * @param {Object} res - Réponse Express
 */
async function updateProfil(req, res) {
  try {
    const champsAutorisés = ['prenom', 'nom', 'bio', 'avatar', 'niveauEtude', 'ville'];
    const updates = {};
    champsAutorisés.forEach((champ) => {
      if (req.body[champ] !== undefined) updates[champ] = req.body[champ];
    });

    await User.update(updates, { where: { id: req.user.id } });
    const userMaj = await User.findByPk(req.user.id, {
      attributes: { exclude: ['motDePasse'] },
    });

    res.json({ message: 'Profil mis à jour', utilisateur: userMaj });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
}

/**
 * Liste les tuteurs avec filtres optionnels
 * @param {Object} req - Requête avec query params {matiere, ville, page, limit}
 * @param {Object} res - Réponse Express
 */
async function listerTuteurs(req, res) {
  try {
    const { ville, page = 1, limit = 20 } = req.query;
    const where = { role: 'tuteur', estActif: true };
    if (ville) where.ville = ville;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['motDePasse'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      tuteurs: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tuteurs' });
  }
}

module.exports = { inscription, connexion, getProfil, updateProfil, listerTuteurs };
