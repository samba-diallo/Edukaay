/**
 * Index des modèles - Définit les associations entre les entités
 */
const User = require('./User');
const Course = require('./Course');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');
const Scholarship = require('./Scholarship');
const TutorApplication = require('./TutorApplication');

// --- Associations ---

// Un tuteur propose plusieurs cours
User.hasMany(Course, { foreignKey: 'tuteurId', as: 'coursProposés' });
Course.belongsTo(User, { foreignKey: 'tuteurId', as: 'tuteur' });

// Réservations
User.hasMany(Booking, { foreignKey: 'etudiantId', as: 'reservationsEtudiant' });
User.hasMany(Booking, { foreignKey: 'tuteurId', as: 'reservationsTuteur' });
Course.hasMany(Booking, { foreignKey: 'coursId', as: 'reservations' });
Booking.belongsTo(User, { foreignKey: 'etudiantId', as: 'etudiant' });
Booking.belongsTo(User, { foreignKey: 'tuteurId', as: 'tuteur' });
Booking.belongsTo(Course, { foreignKey: 'coursId', as: 'cours' });

// Paiements
Booking.hasOne(Payment, { foreignKey: 'reservationId', as: 'paiement' });
Payment.belongsTo(Booking, { foreignKey: 'reservationId', as: 'reservation' });
User.hasMany(Payment, { foreignKey: 'payeurId', as: 'paiementsEffectues' });
User.hasMany(Payment, { foreignKey: 'beneficiaireId', as: 'paiementsRecus' });

// Avis
User.hasMany(Review, { foreignKey: 'etudiantId', as: 'avisDonnes' });
User.hasMany(Review, { foreignKey: 'tuteurId', as: 'avisRecus' });
Course.hasMany(Review, { foreignKey: 'coursId', as: 'avis' });
Review.belongsTo(User, { foreignKey: 'etudiantId', as: 'etudiant' });
Review.belongsTo(User, { foreignKey: 'tuteurId', as: 'tuteur' });

// Bourses
User.hasMany(Scholarship, { foreignKey: 'donateurId', as: 'dons' });
User.hasMany(Scholarship, { foreignKey: 'beneficiaireId', as: 'boursesRecues' });

// Candidatures tuteurs — lien optionnel vers le compte créé
User.hasOne(TutorApplication, { foreignKey: 'userId', as: 'candidature' });
TutorApplication.belongsTo(User, { foreignKey: 'userId', as: 'compte' });

module.exports = { User, Course, Booking, Payment, Review, Scholarship, TutorApplication };
