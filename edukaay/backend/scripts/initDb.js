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
    console.log('🔌 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie.');

    console.log('🗑️  Suppression des anciennes tables...');
    // Force recreate tables (attention: cela supprime toutes les données!)
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées avec succès.');

    console.log('🎉 Base de données initialisée!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializerDatabase();
