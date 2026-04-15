/**
 * Modèle Réservation (Booking)
 * Gère les réservations de séances entre étudiants et tuteurs
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  etudiantId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID de l\'étudiant demandeur',
  },
  tuteurId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID du tuteur',
  },
  coursId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID du cours réservé',
  },
  dateSeance: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Date et heure de la séance',
  },
  dureeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Durée de la séance en minutes',
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'),
    defaultValue: 'en_attente',
  },
  modalite: {
    type: DataTypes.ENUM('en_ligne', 'domicile'),
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Adresse pour les cours à domicile',
  },
  montantTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant total en XOF',
  },
  lienVideoConference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Lien vers la salle de visioconférence',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes ou instructions particulières',
  },
  familyValidationStatus: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'contestee'),
    allowNull: true,
    comment: 'Validation famille après que le tuteur a marqué la séance comme terminée',
  },
  familyValidationNote: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Commentaire de la famille lors de la validation ou contestation',
  },
}, {
  tableName: 'reservations',
  timestamps: true,
});

module.exports = Booking;
