/**
 * FICHIER : models/Booking.js
 * OBJECTIF : Definir le modele pour les reservations/seances entre etudiants et tuteurs
 * 
 * Une reservation (Booking) represente une seance de tutorat confirmee a une date/heure specifique.
 * C'est le premier pas avant le paiement. Les reservations passent par plusieurs etats :
 * 1. en_attente : Etudiant a demande, tuteur n'a pas encore confirme
 * 2. confirmee : Tuteur a accepte, seance aura lieu
 * 3. en_cours : La seance est actuellement en cours (live)
 * 4. terminee : La seance s'est deroulee avec succes
 * 5. annulee : Reservation cancelled par etudiant ou tuteur
 * 
 * Apres qu'une seance soit terminee, la famille de l'etudiant peut valider
 * (attestant que le tuteur a bien donne la lecon)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  // IDENTIFIANT UNIQUE
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,              // Identifie cette reservation de maniere unique
  },
  
  // ACTEURS DE LA RESERVATION
  etudiantId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - qui reserve la seance ?
    comment: 'ID unique de l\'etudiant qui reserve la seance - reference vers la table utilisateurs',
  },
  
  tuteurId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire
    comment: 'ID du tuteur qui donne la seance - reference vers la table utilisateurs',
  },
  
  coursId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - d'apres quel cours ?
    comment: 'ID du cours reserve - reference vers la table cours',
  },
  
  // CALENDRIER ET DUREE
  dateSeance: {
    type: DataTypes.DATE,
    allowNull: false,              // Obligatoire - quand a lieu la seance ?
    comment: 'Date ET heure exacte de la seance - exemple : 2026-04-20 15:30:00',
  },
  
  dureeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,              // 1 heure par defaut
    comment: 'Duree de la seance en minutes - 60 = 1 heure, 90 = 1h30, etc.',
  },
  
  // ETAT DE LA RESERVATION
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'),
    defaultValue: 'en_attente',    // Nouveau booking = en attente de confirmation
    comment: 'Progression de la reservation : en_attente (tuteur doit confirmer) -> confirmee (go) -> en_cours (live) -> terminee (OK)',
  },
  
  // MODE DE PRESTATION
  modalite: {
    type: DataTypes.ENUM('en_ligne', 'domicile'),
    allowNull: false,              // Obligatoire - en ligne ou chez l'etudiant/tuteur ?
    comment: 'en_ligne = par video (Zoom/Meet) | domicile = face a face physique',
  },
  
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,               // Seulement si modalite = domicile
    comment: 'Adresse complete si cours a domicile - exemple : "123 Rue de Dakar, Plateau"',
  },
  
  // TARIFICATION
  montantTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,              // Obligatoire - combien coute cette seance ?
    comment: 'Prix TOTAL en XOF calcule = (tarifHoraire du cours * dureeMinutes / 60)',
  },
  
  // SEANCE EN LIGNE
  lienVideoConference: {
    type: DataTypes.STRING,
    allowNull: true,               // Seulement si modalite = en_ligne
    comment: 'Lien Zoom / Google Meet / autre plateforme visio genere automatiquement',
  },
  
  // NOTES SUPPLEMENTAIRES
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,               // Optionnel - messages entre etudiant et tuteur
    comment: 'Notes speciales : "focuser sur les equations", "apporter cahier", etc.',
  },
  
  // VALIDATION PAR LA FAMILLE (apres terminalion)
  familyValidationStatus: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'contestee'),
    allowNull: true,               // null = pas encore paye / pas encore fini
    comment: 'en_attente = tuteur dit fini, attente de famille | confirmee = famille OK | contestee = famille n\'est pas d\'accord',
  },
  
  familyValidationNote: {
    type: DataTypes.TEXT,
    allowNull: true,               // Seulement si statusFamilial != null
    comment: 'Commentaire famille : "seance bien deroulee" ou "tuteur ne s\'est pas presente"',
  },
}, {
  tableName: 'reservations',      // Nom de la table en BD
  timestamps: true,               // Ajoute createdAt et updatedAt
});

module.exports = Booking;
