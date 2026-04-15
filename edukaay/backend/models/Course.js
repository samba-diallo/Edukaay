/**
 * Modèle Cours (Course)
 * Représente une offre de cours proposée par un tuteur
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Titre du cours (ex: "Mathématiques Terminale S")',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description détaillée du contenu et de la méthodologie',
  },
  matiere: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Matière principale (maths, français, arabe, etc.)',
  },
  niveau: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Niveau ciblé (primaire, collège, lycée, université)',
  },
  curriculum: {
    type: DataTypes.ENUM('francais', 'franco_arabe', 'anglophone'),
    defaultValue: 'francais',
    comment: 'Type de curriculum suivi',
  },
  tarifHoraire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Tarif horaire en XOF (Franc CFA)',
  },
  modalite: {
    type: DataTypes.ENUM('en_ligne', 'domicile', 'les_deux'),
    defaultValue: 'les_deux',
    comment: 'Mode de prestation du cours',
  },
  villeDisponible: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ville pour les cours à domicile',
  },
  tuteurId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Référence vers le tuteur proposant ce cours',
  },
  type: {
    type: DataTypes.ENUM('tutorat', 'contenu'),
    defaultValue: 'tutorat',
    comment: 'tutorat = séance avec tuteur | contenu = cours structuré (vidéo/PDF)',
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de la vidéo du cours (YouTube, Vimeo, hébergement propre)',
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL du PDF du cours',
  },
  chapitre: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Nom du chapitre (ex: "Chapitre 1 : Les équations")',
  },
  ordre: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Ordre dans la séquence pédagogique',
  },
  estActif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  noteMoyenne: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    comment: 'Note moyenne calculée à partir des avis',
  },
  nombreAvis: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'cours',
  timestamps: true,
});

module.exports = Course;
