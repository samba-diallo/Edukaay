/**
 * FICHIER : models/User.js
 * OBJECTIF : Definir le modele de donnees pour les utilisateurs
 * 
 * Ce fichier utilise Sequelize ORM pour definir une table "utilisateurs" qui stocke tous
 * les utilisateurs de la plateforme EduKaay. Un utilisateur peut avoir l'un de ces roles :
 * - etudiant : Cherche des cours et reserve des seances
 * - tuteur : Propose des cours et enseigne
 * - parent : Parent qui paye pour les etudes de son enfant
 * - admin : Administre la plateforme
 * 
 * Securite : Les mots de passe sont AUTOMATIQUEMENT haches avant d'etre stockes en base
 * de donnees grace a bcryptjs avec 12 rounds de salt. Personne n'a acces au mot de passe
 * en clair, seulement au hash.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');  // Librairie pour hasher les mots de passe de maniere securisee

const User = sequelize.define('User', {
  // CHAMPS DE BASE
  
  id: {
    type: DataTypes.UUID,           // Identifiant unique qui ne peut jamais se repeter
    defaultValue: DataTypes.UUIDV4, // Genere automatiquement une valeur unique
    primaryKey: true,               // Clé primaire - permet d'identifier chaque utilisateur
  },
  
  // INFORMATIONS PERSONNELLES
  
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire - ne peut pas etre vide
    comment: 'Prénom de l\'utilisateur - exemple : Jean',
  },
  
  nom: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire
    comment: 'Nom de famille - exemple : Dupont',
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire
    unique: true,                  // Garantit que chaque email n'existe qu'une seule fois
    validate: { isEmail: true },   // Valide que le format est un email valide
    comment: 'Email de connexion - doit etre unique et valide',
  },
  
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire
    comment: 'Numéro de téléphone au format international - exemple : +221701234567',
  },
  
  // SECURITE / AUTHENTIFICATION
  
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire - ne jamais laisser vide
    comment: 'Mot de passe HACHE avec bcryptjs - JAMAIS stocke en clair',
  },
  
  // ROLE ET ACCES
  
  role: {
    type: DataTypes.ENUM('etudiant', 'tuteur', 'parent', 'admin'), // Peut seulement avoir ces 4 valeurs
    defaultValue: 'etudiant',      // Par defaut, nouvel utilisateur = etudiant
    comment: 'Rôle de l\'utilisateur qui determine ses permissions sur la plateforme',
  },
  
  // PROFIL UTILISATEUR
  
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel - peut etre null
    comment: 'URL de la photo de profil stockee sur un serveur (AWS S3 ou similaire)',
  },
  
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,               // Optionnel - utile surtout pour les tuteurs
    comment: 'Description personnelle du tuteur - competences, experience, methodologie',
  },
  
  niveauEtude: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel
    comment: 'Niveau scolaire actuel : primaire, collège, lycée ou université',
  },
  
  ville: {
    type: DataTypes.STRING,
    defaultValue: 'Dakar',         // Par defaut Dakar au Senegal
    comment: 'Ville de residence - important pour les cours a domicile',
  },
  
  // VERIFICATION / STATUT
  
  estVerifie: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,           // Faux par defaut - sera true apres verification KYC
    comment: 'Indique si la piece d\'identite a ete verifiee par l\'admin',
  },
  
  estActif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,            // Vrai par defaut
    comment: 'Faux si l\'utilisateur a suivi un ban ou a supprime son compte',
  },
}, {
  tableName: 'utilisateurs',      // Nom de la table en base de donnees
  timestamps: true,               // Ajoute createdAt et updatedAt automatiquement
  
  hooks: {
    /**
     * HOOK : beforeCreate
     * Execute AUTOMATIQUEMENT avant d'inserer un nouvel utilisateur en BD
     * Fonction : Hasher le mot de passe pour ne JAMAIS le stocker en clair
     * 
     * Exemple : motDePasse "secret123" devient un hash comme :
     * $2a$12$abcdef1234567890...une longue chaine aleatoire...
     * 
     * @param {Object} user - Instance utilisateur a creer
     */
    beforeCreate: async (user) => {
      if (user.motDePasse) {
        user.motDePasse = await bcrypt.hash(user.motDePasse, 12);  // 12 rounds = tres securise
      }
    },
    
    /**
     * HOOK : beforeUpdate
     * Execute avant de modifier un utilisateur existant
     * Fonction : Si le mot de passe a change, le hasher aussi
     * 
     * @param {Object} user - Instance utilisateur a modifier
     */
    beforeUpdate: async (user) => {
      if (user.changed('motDePasse')) {  // Verifier que le mot de passe a vraiment ete modifie
        user.motDePasse = await bcrypt.hash(user.motDePasse, 12);
      }
    },
  },
});

/**
 * METHODE : verifierMotDePasse
 * Utilite : Comparer le mot de passe saisi par l'utilisateur avec le hash en base
 * 
 * Exemple d'utilisation :
 * const user = await User.findByPk(id);
 * const motDePasseValide = await user.verifierMotDePasse("monMotDePasse");
 * if (motDePasseValide) { authentifier l'utilisateur }
 * 
 * @param {string} motDePasse - Le mot de passe en clair saisi par l'utilisateur
 * @returns {Promise<boolean>} true si le mot de passe est correct, false sinon
 */
User.prototype.verifierMotDePasse = async function (motDePasse) {
  return bcrypt.compare(motDePasse, this.motDePasse);  // bcrypt compare de maniere securisee
};

module.exports = User;
