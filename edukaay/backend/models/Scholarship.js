/**
 * Modèle Bourse / Don (Scholarship)
 * Gère les dons de la diaspora pour financer des cours
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Scholarship = sequelize.define('Scholarship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  donateurId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID du donateur (si enregistré sur la plateforme)',
  },
  donateurNom: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom du donateur',
  },
  donateurEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant du don en XOF',
  },
  montantRestant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant restant disponible',
  },
  beneficiaireId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID de l\'étudiant bénéficiaire (si ciblé)',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message d\'encouragement du donateur',
  },
  statut: {
    type: DataTypes.ENUM('actif', 'epuise', 'expire'),
    defaultValue: 'actif',
  },
  methodePaiement: {
    type: DataTypes.ENUM('wave', 'orange_money', 'mtn_momo', 'carte_bancaire', 'virement'),
    allowNull: false,
  },
}, {
  tableName: 'bourses',
  timestamps: true,
});

module.exports = Scholarship;
