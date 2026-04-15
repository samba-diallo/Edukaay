/**
 * FICHIER : models/Payment.js
 * OBJECTIF : Enregistrer toutes les transactions financieres (paiements Mobile Money)
 * 
 * Un paiement (Payment) represente un transfert d'argent d'un etudiant/parent vers un tuteur.
 * Les moyens acceptes sont :
 * - Wave : Plateforme de paiement mobile (https://wave.com)
 * - Orange Money : Service mobile money Orange
 * - MTN MoMo : Service mobile money MTN
 * - Carte bancaire : Paiement classique (futur)
 * 
 * Chaque paiement :
 * 1. Commence en_attente
 * 2. Est envoye a l'API du prestataire (Wave, Orange, etc.)
 * 3. Devient reussi ou echoue
 * 4. L'argent va au tuteur moins la commission EduKaay (10% par exemple)
 * 
 * Securite : Les donnees sensibles (numeros de compte) ne sont JAMAIS stockees,
 * seulement la reference retournee par le prestataire.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  // IDENTIFIANT UNIQUE
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,              // Fait de ce champ l'identifiant unique du paiement
  },
  
  // LIEN AVEC LA RESERVATION
  reservationId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - quel reservation paie-t-on ?
    comment: 'ID de la reservation associee (table reservations)',
  },
  
  // ACTEURS DU PAIEMENT
  payeurId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - qui paie ?
    comment: 'ID de l\'etudiant ou parent qui paie (table utilisateurs)',
  },
  
  beneficiaireId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - qui recoit l'argent ?
    comment: 'ID du tuteur qui reçoit l'argent (table utilisateurs)',
  },
  
  // MONTANTS
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,              // Obligatoire - combien ?
    comment: 'Montant BRUT en XOF (avant commission EduKaay)',
  },
  
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,               // 0 par defaut (peut etre recalculee)
    comment: 'Commission EduKaay prelevee (exemple : 10% du montant)',
  },
  
  // MOYEN DE PAIEMENT
  methodePaiement: {
    type: DataTypes.ENUM('wave', 'orange_money', 'mtn_momo', 'carte_bancaire'),
    allowNull: false,              // Obligatoire - lequel ?
    comment: 'Plateforme de paiement utilisee : Wave, Orange Money, MTN MoMo, ou carte bancaire',
  },
  
  // ETAT DU PAIEMENT
  statut: {
    type: DataTypes.ENUM('en_attente', 'reussi', 'echoue', 'rembourse'),
    defaultValue: 'en_attente',    // Nouveau paiement = en attente de confirmation
    comment: 'Progression : en_attente (envoye au prestataire) -> reussi (argent recu) ou echoue (refused)',
  },
  
  referenceExterne: {
    type: DataTypes.STRING,
    allowNull: true,               // null jusqu'a confirmation du prestataire
    comment: 'Reference/ID retourne par Wave/Orange/MTN - permet de tracer dans leurs systemes',
  },
  
  // PAIEMENT VIA BOURSE / DON
  estBourse: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,           // false = paiement classique etudiant
    comment: 'true si le paiement est finance par une bourse (don diaspora)',
  },
  
  donId: {
    type: DataTypes.UUID,
    allowNull: true,               // null sauf si estBourse = true
    comment: 'ID de la bourse/don qui finance ce paiement (table scholarships)',
  },
}, {
  tableName: 'paiements',       // Nom de la table en BD
  timestamps: true,             // Ajoute createdAt et updatedAt
});

module.exports = Payment;
