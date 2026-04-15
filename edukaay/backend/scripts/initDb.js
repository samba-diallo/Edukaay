#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données EduKaay
 * Supprime et crée les tables à partir des modèles Sequelize
 * À utiliser: node scripts/initDb.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

// Charger tous les modèles et leurs associations
require('../models/index');

async function initializerDatabase() {
  try {
    console.log('[DB] Connexion a la base de donnees...');
    await sequelize.authenticate();
    console.log('[DB] Connexion reussie.');

    console.log('[DB] Suppression des anciennes tables...');
    // Force recreate tables (attention: cela supprime toutes les donnees!)
    await sequelize.sync({ force: true });
    console.log('[DB] Tables creees avec succes.');

    console.log('[DB] Base de donnees initialisee.');
    process.exit(0);
  } catch (error) {
    console.error('[DB] Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializerDatabase();
