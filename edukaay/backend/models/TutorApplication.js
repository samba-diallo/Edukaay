/**
 * Modèle Candidature Tuteur (TutorApplication)
 * Gère les demandes pour devenir tuteur sur la plateforme
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TutorApplication = sequelize.define('TutorApplication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  niveauEtude: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Niveau d\'étude actuel ou obtenu',
  },
  matieres: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Matières que le candidat souhaite enseigner (texte libre)',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lettre de motivation ou informations complémentaires',
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL du document PDF (diplôme, CV, etc.) uploadé',
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'approuvee', 'rejetee'),
    defaultValue: 'en_attente',
    comment: 'Statut de la candidature — géré par l\'admin',
  },
  noteAdmin: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Note interne de l\'administrateur',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Lien vers le compte créé si la candidature est approuvée',
  },
}, {
  tableName: 'candidatures_tuteurs',
  timestamps: true,
});

module.exports = TutorApplication;
