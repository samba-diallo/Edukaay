/**
 * Modèle Utilisateur (User)
 * Représente les étudiants, tuteurs et administrateurs de la plateforme
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Prénom de l\'utilisateur',
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom de famille',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Numéro de téléphone (format international +221...)',
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('etudiant', 'tuteur', 'parent', 'admin'),
    defaultValue: 'etudiant',
    comment: 'Rôle sur la plateforme',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de la photo de profil',
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description du profil (surtout pour les tuteurs)',
  },
  niveauEtude: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Niveau d\'étude actuel (primaire, collège, lycée, université)',
  },
  ville: {
    type: DataTypes.STRING,
    defaultValue: 'Dakar',
    comment: 'Ville de résidence',
  },
  estVerifie: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Vérification d\'identité effectuée',
  },
  estActif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'utilisateurs',
  timestamps: true,
  hooks: {
    /**
     * Hache le mot de passe avant la création
     * @param {Object} user - Instance utilisateur
     */
    beforeCreate: async (user) => {
      if (user.motDePasse) {
        user.motDePasse = await bcrypt.hash(user.motDePasse, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('motDePasse')) {
        user.motDePasse = await bcrypt.hash(user.motDePasse, 12);
      }
    },
  },
});

/**
 * Vérifie si le mot de passe fourni correspond au hash stocké
 * @param {string} motDePasse - Mot de passe en clair
 * @returns {Promise<boolean>} Vrai si le mot de passe correspond
 */
User.prototype.verifierMotDePasse = async function (motDePasse) {
  return bcrypt.compare(motDePasse, this.motDePasse);
};

module.exports = User;
