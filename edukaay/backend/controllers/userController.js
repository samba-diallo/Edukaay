/**
 * FICHIER : controllers/userController.js
 * OBJECTIF : Gerer l'authentification (inscription/connexion) et la gestion des profils utilisateurs
 * 
 * Ce controler contient les endpoints pour :
 * 1. Inscription : Creer un nouvel utilisateur (etudiant ou tuteur)
 * 2. Connexion : Authentifier un utilisateur existant et gener un JWT token
 * 3. Gestion de profil : Modifier ses informations personnelles
 * 4. Recuperer tuteurs : Lister tous les tuteurs avec leurs avis
 * 
 * C'est le coeur du systeme d'authentification de la plateforme.
 */

const jwt = require('jsonwebtoken');  // Librairie pour creer les JWT tokens
const { User } = require('../models');  // Modele database pour les utilisateurs

/**
 * FONCTION : inscription
 * ENDPOINT : POST /api/users/inscription
 * ROLE : Creer un compte utilisateur (etudiant ou tuteur)
 * 
 * DONNEES ATTENDUES dans req.body :
 * {
 *   prenom: "Jean",
 *   nom: "Dupont",
 *   email: "jean@example.com",
 *   telephone: "+221701234567",
 *   motDePasse: "SecurePass123!",
 *   role: "etudiant" ou "tuteur" ou "parent"
 * }
 * 
 * PROCESSUS :
 * 1. Extraire les donnees du formulaire
 * 2. Verifier que l'email n'existe pas deja
 * 3. Creer le nouvel utilisateur (motDePasse auto-hache)
 * 4. Generer un JWT token valide 7 jours
 * 5. Retourner le token et les infos utilisateur
 * 
 * RETOUR EN CAS DE SUCCES (201) :
 * { message: "Inscription réussie", token: "jwt...", utilisateur: {...} }
 * 
 * ERREURS POSSIBLES :
 * - 400 : Email deja utilise
 * - 500 : Erreur serveur (base de donnees, etc.)
 * 
 * @param {Object} req - Requete Express
 * @param {Object} res - Reponse Express
 */
async function inscription(req, res) {
  try {
    // Etape 1 : Extraire les donnees du formulaire
    const { prenom, nom, email, telephone, motDePasse, role } = req.body;

    // Etape 2 : Verifier que l'email n'existe pas deja
    // findOne recherche le premier utilisateur avec cet email
    const existant = await User.findOne({ where: { email } });
    if (existant) {
      // Email deja utilise -> retourner erreur 400 (Bad Request)
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Etape 3 : Creer le nouvel utilisateur
    // Le middleware beforeCreate() va AUTOMATIQUEMENT hasher le motDePasse
    // Donc le motDePasse en clair n'est JAMAIS stocke en base de donnees
    const user = await User.create({ prenom, nom, email, telephone, motDePasse, role });

    // Etape 4 : Generer un JWT token
    // Le token contient l'ID et le role de l'utilisateur
    // Il sera expire dans 7 jours (ou la valeur de JWT_EXPIRES_IN)
    const token = jwt.sign(
      { id: user.id, role: user.role },      // Donnees du token
      process.env.JWT_SECRET,                 // Secret pour signer
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }  // Expire dans 7 jours
    );

    // Etape 5 : Retourner une reponse positive (201 = Created)
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
    // Gestion des erreurs (validations, base de donnees, etc.)
    res.status(500).json({ error: 'Erreur lors de l\'inscription', details: error.message });
  }
}

/**
 * FONCTION : connexion
 * ENDPOINT : POST /api/users/connexion
 * ROLE : Authentifier un utilisateur avec email et motDePasse, generer JWT token
 * 
 * DONNEES ATTENDUES dans req.body :
 * {
 *   email: "jean@example.com",
 *   motDePasse: "SecurePass123!"
 * }
 * 
 * PROCESSUS :
 * 1. Chercher l'utilisateur par email
 * 2. Verifier que le motDePasse fourni correspond au hash en base
 * 3. Generer un JWT token valide 7 jours
 * 4. Retourner le token et les infos utilisateur
 * 
 * RETOUR EN CAS DE SUCCES (200) :
 * { message: "Connexion réussie", token: "jwt...", utilisateur: {...} }
 * 
 * ERREURS POSSIBLES :
 * - 401 : Email inexistant ou motDePasse incorrect
 * - 500 : Erreur serveur
 * 
 * @param {Object} req - Requete Express
 * @param {Object} res - Reponse Express
 */
async function connexion(req, res) {
  try {
    // Etape 1 : Extraire email et motDePasse du formulaire
    const { email, motDePasse } = req.body;

    // Etape 2 : Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Email n'existe pas -> erreur 401 (Unauthorized)
      // NOTE : On dit "Email ou motDePasse incorrect" (pas "Email inexistant")\n      // car c'est plus securise (evite de confirmer quels emails existent)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Etape 3 : Verifier que le motDePasse est correct
    // user.verifierMotDePasse() utilise bcrypt pour comparer de maniere securisee
    const motDePasseValide = await user.verifierMotDePasse(motDePasse);
    if (!motDePasseValide) {
      // Mot de passe incorrect -> erreur 401
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Etape 4 : Generer un JWT token
    // Meme processus qu'en inscription
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Etape 5 : Retourner la reponse positive (200 = OK)
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
    // Gestion des erreurs
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
