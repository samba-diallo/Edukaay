/**
 * Middleware d'authentification JWT
 * Vérifie le token et attache l'utilisateur à la requête
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Vérifie le token JWT dans l'en-tête Authorization
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
async function authentifier(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.estActif) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou désactivé' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * Vérifie que l'utilisateur possède l'un des rôles autorisés
 * @param {...string} roles - Rôles autorisés (ex: 'tuteur', 'admin')
 * @returns {Function} Middleware Express
 */
function autoriser(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès interdit pour ce rôle' });
    }
    next();
  };
}

module.exports = { authentifier, autoriser };
