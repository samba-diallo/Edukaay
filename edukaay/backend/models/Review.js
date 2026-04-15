/**
 * Modèle Avis (Review)
 * Permet aux étudiants de noter et commenter les tuteurs
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  etudiantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  tuteurId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  coursId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
    comment: 'Note sur 5 étoiles',
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Commentaire de l\'étudiant',
  },
}, {
  tableName: 'avis',
  timestamps: true,
});

module.exports = Review;
