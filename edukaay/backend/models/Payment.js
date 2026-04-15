/**
 * Modèle Paiement (Payment)
 * Enregistre les transactions financières via Mobile Money
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reservationId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Réservation associée au paiement',
  },
  payeurId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID de l\'utilisateur qui paie',
  },
  beneficiaireId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID du tuteur bénéficiaire',
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant de la transaction en XOF',
  },
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Commission EduKaay en XOF',
  },
  methodePaiement: {
    type: DataTypes.ENUM('wave', 'orange_money', 'mtn_momo', 'carte_bancaire'),
    allowNull: false,
    comment: 'Méthode de paiement utilisée',
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'reussi', 'echoue', 'rembourse'),
    defaultValue: 'en_attente',
  },
  referenceExterne: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Référence de transaction de l\'API de paiement',
  },
  estBourse: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indique si le paiement est financé par une bourse/don',
  },
  donId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Référence vers le don (si bourse)',
  },
}, {
  tableName: 'paiements',
  timestamps: true,
});

module.exports = Payment;
