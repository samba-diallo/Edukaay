#!/bin/bash

# Script de configuration et démarrage d'EduKaay localement
# Ce script prépare l'environnement et démarre tous les services

set -e

PROJET_PATH="/home/sable/Documents/EduKaay_Projet_Complet/edukaay"
BACKEND_PATH="$PROJET_PATH/backend"
FRONTEND_PATH="$PROJET_PATH/frontend"
MOBILE_PATH="$PROJET_PATH/mobile"

echo "🚀 Démarrage de la configuration EduKaay..."
echo ""

# --- Vérification de PostgreSQL ---
echo "📦 Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Installation requise."
    exit 1
fi

echo "✅ PostgreSQL trouvé"
echo ""

# --- Initialisation de la base de données ---
# Note: Cette étape peut nécessiter l'authentification PostgreSQL
# Les développeurs peuvent configurer leur accès PostgreSQL manuellement

echo "📝 Configuration Backend..."
if [ ! -f "$BACKEND_PATH/.env" ]; then
    echo "création du fichier .env pour le backend..."
    cp "$BACKEND_PATH/.env.example" "$BACKEND_PATH/.env" 2>/dev/null || true
fi

echo "✅ Backend configuré"
echo ""

echo "📝 Configuration Frontend..."
if [ ! -f "$FRONTEND_PATH/.env.local" ]; then
    cat > "$FRONTEND_PATH/.env.local" << EOF
# Configuration Frontend EduKaay
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_BASE=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
EOF
fi

echo "✅ Frontend configuré"
echo ""

# --- Vérification des dépendances ---
echo "📦 Vérification des dépendances..."

if [ ! -d "$BACKEND_PATH/node_modules" ]; then
    echo "Installation des dépendances backend..."
    npm install --prefix "$BACKEND_PATH"
fi

if [ ! -d "$FRONTEND_PATH/node_modules" ]; then
    echo "Installation des dépendances frontend..."
    npm install --prefix "$FRONTEND_PATH"
fi

if [ ! -d "$MOBILE_PATH/node_modules" ]; then
    echo "Installation des dépendances mobile..."
    npm install --prefix "$MOBILE_PATH"
fi

echo "✅ Dépendances vérifiées"
echo ""

echo "🎉 Configuration complète!"
echo ""
echo "Prochaines étapes:"
echo "1. Assurez-vous que PostgreSQL est en cours d'exécution"
echo "2. Configurez votre base de données (voir SETUP.md)"
echo "3. Exécutez les migrations: npm run dev dans le dossier backend"
echo "4. Démarrez le frontend: npm run dev dans le dossier frontend"
echo ""
