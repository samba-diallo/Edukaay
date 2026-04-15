/**
 * FICHIER : middleware/auth.js
 * OBJECTIF : Verifier que les utilisateurs sont authentifies et autorises avant d'acceder aux routes protegees
 * 
 * Ce fichier contient deux middlewares :
 * 1. authentifier() : Verifie que le token JWT est valide
 * 2. autoriser(...roles) : Verifie que l'utilisateur a le bon role
 * 
 * FLUX DE SECURITE :
 * Client envoie requete avec header: Authorization: Bearer <token_jwt>
 *     |
 *     v
 * Middleware authentifier() decode le token et cherche l'utilisateur en BD
 *     |
 *     v
 * Si valide, req.user = utilisateur / Si invalide > erreur 401
 *     |
 *     v (optionnel) Middleware autoriser('tuteur') verifie role
 *     |
 *     v
 * Si bon role > continuer vers controller. Si mauvais role > erreur 403
 */

const jwt = require('jsonwebtoken');  // Librairie pour verifier les tokens JWT
const User = require('../models/User');  // Modele pour chercher l'utilisateur en BD

/**
 * MIDDLEWARE : authentifier
 * Role : Verifier que l'utilisateur a un token JWT valide et y est connecte
 * 
 * Comment utiliser dans une route :
 * router.get('/mon-profil', authentifier, (req, res) => { ... });
 * 
 * Le token doit etre dans le header Authorization de la requete :
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * @param {Object} req - Requete Express avec header Authorization
 * @param {Object} res - Reponse Express
 * @param {Function} next - Fonction pour aller au middleware suivant ou au controller
 * @returns {void} - Si OK, appelle next(). Si erreur, retourne JSON d'erreur
 */
async function authentifier(req, res, next) {
  try {
    // Etape 1 : Recuperer le header Authorization
    const authHeader = req.headers.authorization;
    
    // Verifier que le header existe et commence par "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    // Etape 2 : Extraire le token (enlever "Bearer ") 
    // Format : "Bearer {token}" -> on extrait juste {token}
    const token = authHeader.split(' ')[1];
    
    // Etape 3 : Decoder le token
    // Si token modifie ou expire, jwt.verify() lance une erreur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "user123", role: "tuteur", iat: 1234567890, exp: 1234654290 }
    
    // Etape 4 : Chercher l'utilisateur en base de donnees
    const user = await User.findByPk(decoded.id);

    // Etape 5 : Verifier que l'utilisateur existe ET est actif
    // Un utilisateur bannir a estActif = false
    if (!user || !user.estActif) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou désactivé' });
    }

    // Etape 6 : Attacher l'utilisateur a la requete
    // Les controllers suivants peuvent acceder a req.user
    // Exemple : console.log(req.user.email) dans le controller
    req.user = user;
    
    // Etape 7 : Passer au middleware/controller suivant
    next();
    
  } catch (error) {
    // Gestion des erreurs JWT (token expire, invalide, modifie, etc.)
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * MIDDLEWARE : autoriser
 * Role : Verifier que l'utilisateur connecte a le role autoriser pour cette route
 * 
 * Comment utiliser dans une route :
 * router.post('/creer-cours',
 *   authentifier,
 *   autoriser('tuteur', 'admin'),  // Seulement tuteur et admin peuvent creer des cours
 *   courseController.creer
 * );
 * 
 * @param {...string} roles - Les roles acceptes pour cette route
 * @returns {Function} Middleware Express qui verifie le role
 */
function autoriser(...roles) {
  // Cette fonction RETOURNE un middleware (fonction interne)
  return (req, res, next) => {
    // A ce point, req.user existe car authentifier() a deja ete appele
    
    // Verifier que le role de l'utilisateur est dans la liste des roles acceptes
    if (!roles.includes(req.user.role)) {
      // L'utilisateur n'a pas le bon role
      return res.status(403).json({ error: 'Accès interdit : vous n\'avez pas les permissions pour cette action' });
    }
    
    // Le role est bon, continuer vers le controleur
    next();
  };
}

module.exports = { authentifier, autoriser };
