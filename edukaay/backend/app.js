/**
 * FICHIER : app.js
 * Objectif : Point d'entree principal de l'API EduKaay - Marketplace de tutorat en Afrique de l'Ouest
 * 
 * Ce fichier initialise le serveur Express et configure tous les middlewares de securite,
 * les routes API, et les connexions en temps reel via Socket.IO pour le chat et les notifications
 * 
 * Les variables d'environnement doivent etre definies dans un fichier .env :
 * - DB_NAME, DB_USER, DB_PASSWORD : Configuration PostgreSQL
 * - JWT_SECRET : Cle pour signer les tokens JWT
 * - FRONTEND_URL : URL du frontend pour CORS
 * - WAVE_API_KEY, ORANGE_MONEY_SECRET, MTN_MOMO_KEY : Cles des APIs de paiement Mobile Money
 */

// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importations des bibliotheques principales
const express = require('express');           // Framework web
const cors = require('cors');                 // Autoriser les requetes cross-origin
const helmet = require('helmet');             // Securiser les headers HTTP
const morgan = require('morgan');             // Logger les requetes
const rateLimit = require('express-rate-limit'); // Limiter le nombre de requetes
const { Server } = require('socket.io');      // Communication bidirectionnelle temps reel
const http = require('http');                 // Module HTTP pour Socket.IO
const path = require('path');                 // Gerer les chemins de fichiers

// Importations des routes API
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Configuration de la base de donnees PostgreSQL via Sequelize ORM
const { sequelize } = require('./config/database');

// Charger les modeles (User, Course, Booking, Payment, etc.) et etablir les relations entre eux
require('./models/index');

const app = express();
const server = http.createServer(app);

// Configuration Socket.IO pour le chat et les notifications en temps réel
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// --- Middlewares globaux ---
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir les fichiers uploadés (documents tuteurs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/** Limitation de débit : 100 requêtes par 15 min par IP */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use('/api/', limiter);

// --- Routes API ---
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

/** Route de vérification de santé */
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', message: 'EduKaay API fonctionne correctement', timestamp: new Date().toISOString() });
});

// --- Gestion des erreurs ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, _req, res, _next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// --- Socket.IO : événements temps réel ---
io.on('connection', (socket) => {
  console.log(`Utilisateur connecté: ${socket.id}`);

  socket.on('rejoindre_salle', (salleId) => {
    socket.join(salleId);
    console.log(`${socket.id} a rejoint la salle ${salleId}`);
  });

  socket.on('message_cours', (data) => {
    io.to(data.salleId).emit('nouveau_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
  });
});

// --- Démarrage du serveur ---
const PORT = process.env.PORT || 3001;

async function demarrerServeur() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
    // Synchroniser les modèles sans modifier les tables existantes
    await sequelize.sync({ force: false, alter: false });
    console.log('Modèles synchronisés.');

    server.listen(PORT, () => {
      console.log(`Serveur EduKaay démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
}

demarrerServeur();

module.exports = { app, io };
