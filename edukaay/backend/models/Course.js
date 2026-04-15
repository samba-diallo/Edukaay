/**
 * FICHIER : models/Course.js
 * OBJECTIF : Definir le modele de donnees pour les cours proposes par les tuteurs
 * 
 * Un cours represente une offre d'enseignement avec deux types possibles :
 * 1. Tutorat : Seances individuelles avec un tuteur (interactif)
 * 2. Contenu : Cours structures (videos, PDF) accessibles a tout moment
 * 
 * Chaque cours appartient a UN tuteur qui l'a cree. Les etudiants peuvent :
 * - Parcourir les cours disponibles
 * - Reserver des seances de tutorat
 * - Consulter les contenus de cours
 * - Laisser des avis (notes 1-5 etoiles)
 * 
 * Important : Les cours filtres selon matiere, niveau, curriculum, modalite et ville
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  // IDENTIFIANT
  
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,              // Fait de ce champ l'identifiant unique du cours
  },
  
  // INFORMATIONS DE BASE SUR LE COURS
  
  titre: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire
    comment: 'Titre donne au cours - exemple : "Mathematiques Terminale S - Equations differentielles"',
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,              // Obligatoire - doit expliquer en detail
    comment: 'Description complete : quels sujets sont couverts, methodologie, exemple de contenu',
  },
  
  // CLASSIFICATION DU COURS
  
  matiere: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire - permet de filtrer les cours
    comment: 'Matiere enseignee : maths, francais, arabe, anglais, histoire, sciences, etc.',
  },
  
  niveau: {
    type: DataTypes.STRING,
    allowNull: false,              // Obligatoire
    comment: 'Niveau scolaire cible : primaire, college, lycee, universite ou autre',
  },
  
  curriculum: {
    type: DataTypes.ENUM('francais', 'franco_arabe', 'anglophone'),
    defaultValue: 'francais',      // Francais par defaut
    comment: 'Système d\'education : francais (normal), franco_arabe (bilangue arabe+francais), anglophone',
  },
  
  // INFORMATIONS PRATIQUES
  
  tarifHoraire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,              // Obligatoire - en Franc CFA (XOF)
    comment: 'Prix HORAIRE en XOF (Franc CFA) - exemple : 2500 XOF pour 1 heure',
  },
  
  modalite: {
    type: DataTypes.ENUM('en_ligne', 'domicile', 'les_deux'),
    defaultValue: 'les_deux',      // Par defaut = les deux moyens disponibles
    comment: 'Comment le cours se fait : en_ligne (Zoom), domicile (etudiant ou tuteur), ou les deux',
  },
  
  villeDisponible: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel - si domicile non disponible
    comment: 'Ville ou le tuteur accepte les cours a domicile - exemple : Dakar',
  },
  
  // RELATION AVEC LE TUTEUR
  
  tuteurId: {
    type: DataTypes.UUID,
    allowNull: false,              // Obligatoire - tout cours DOIT appartenir a un tuteur
    comment: 'ID unique du tuteur qui propose ce cours - reference vers la table utilisateurs',
  },
  
  // TYPE DE CONTENU
  
  type: {
    type: DataTypes.ENUM('tutorat', 'contenu'),
    defaultValue: 'tutorat',       // Tutorat par defaut (seances en direct)
    comment: 'tutorat = seances donnees par tuteur | contenu = videos/PDF autopartenaires',
  },
  
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel - seulement si type = contenu
    comment: 'Lien YouTube, Vimeo ou serveur personnel de video - pour contenu type video',
  },
  
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel
    comment: 'Lien vers fichier PDF - supports de cours, exercices, resume',
  },
  
  chapitre: {
    type: DataTypes.STRING,
    allowNull: true,               // Optionnel
    comment: 'Nom du chapitre pour les contenus structures - exemple : "Chapitre 1 : les polynomes"',
  },
  
  ordre: {
    type: DataTypes.INTEGER,
    defaultValue: 0,               // Par defaut = 0
    comment: 'Ordre d\'apparition dans une sequence pédagogique - 0 = premier, 1 = deuxieme, etc.',
  },
  
  // STATUT ET QUALITE
  
  estActif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,            // Vrai par defaut - faux si tuteur l'ha supprime
    comment: 'True = visible aux etudiants | False = archive ou supprime',
  },
  
  noteMoyenne: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,               // 0 si pas d'avis encore
    comment: 'Moyenne des notes etudiants 1-5 : exemple 4.5 = tres bon cours',
  },
  
  nombreAvis: {
    type: DataTypes.INTEGER,
    defaultValue: 0,               // 0 si pas d'avis encore
    comment: 'Nombre total d\'avis recus - plus grand = plus de donnees de qualite',
  },
}, {
  tableName: 'cours',             // Nom de la table en base de donnees
  timestamps: true,               // Ajoute createdAt (date de creation) et updatedAt (derniere modification)
});

module.exports = Course;
