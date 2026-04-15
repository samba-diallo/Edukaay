# Guide de Configuration - EduKaay

## 🛠️ Configuration de l'Environnement Local

### Prérequis

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Installation

#### 1. **Base de Données PostgreSQL**

Pour créer une base de données PostgreSQL locale:

```bash
# Se connecter à PostgreSQL (en tant qu'utilisateur postgres)
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE edukaay_db;

# Créer un utilisateur (optionnel)
CREATE USER edukaay WITH PASSWORD 'votre_mot_de_passe';
ALTER ROLE edukaay SET client_encoding TO 'utf8';
ALTER ROLE edukaay SET default_transaction_isolation TO 'read committed';
ALTER ROLE edukaay SET default_transaction_deferrable TO on;
ALTER ROLE edukaay SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE edukaay_db TO edukaay;

# Quitter
\q
```

#### 2. **Configurer le Backend**

```bash
cd backend

# Copier le fichier d'exemple en configuration réelle
cp .env.example .env

# Éditer .env avec vos identifiants PostgreSQL
nano .env

# Les variables critiques:
# DB_USER=postgres (ou votre utilisateur)
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=edukaay_db
```

#### 3. **Configurer le Frontend**

```bash
cd ../frontend

# .env.local doit être configuré
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_BASE=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
EOF
```

### Démarrage des Services

#### **Terminal 1 - Backend API**

```bash
cd backend
npm run dev
# Le serveur démarre sur http://localhost:5000
```

#### **Terminal 2 - Frontend Web**

```bash
cd frontend
npm run dev
# Le site démarre sur http://localhost:3000
```

#### **Terminal 3 - Mobile (Optionnel)**

```bash
cd mobile
npm start
# Expo démarre sur http://localhost:19000
```

### Vérification

1. **Backend est prêt?**
   ```bash
   curl http://localhost:5000/api/ping
   # Doit retourner: { "status": "ok" }
   ```

2. **Frontend est prêt?**
   - Ouvrez http://localhost:3000 dans votre navigateur
   - Vous devez voir la page d'accueil EduKaay

3. **Mobile est prêt?**
   - L'Expo Dev Client affiche un QR code
   - Scannez avec votre téléphone pour tester l'app

### Troubleshooting

#### ❌ "ECONNREFUSED" sur le backend

**Cause**: PostgreSQL n'est pas en cours d'exécution

**Solution**:
```bash
# Vérifier le statut
sudo service postgresql status

# Démarrer si arrêté
sudo service postgresql start
```

#### ❌ "Database does not exist"

**Cause**: La base de données n'a pas été créée

**Solution**: Suivez l'étape "Base de Données PostgreSQL" ci-dessus

#### ❌ Port 5000 déjà utilisé

**Solution**: Changer le PORT dans .env du backend
```bash
PORT=5001
# Redémarrer le backend
```

#### ❌ Les variables d'environnement ne sont pas chargées

**Solution**: Vérifier que .env existe et contient les bonnes valeurs
```bash
cat backend/.env
cat frontend/.env.local
```

---

## 📁 Structure du Projet

```
edukaay/
├── backend/              # API Express + Sequelize
│   ├── app.js           # Point d'entrée
│   ├── config/          # Configuration BD
│   ├── models/          # Modèles Sequelize
│   ├── controllers/     # Logique métier
│   ├── routes/          # Définition des routes
│   ├── middleware/      # Authentification, etc.
│   └── services/        # Services métier
├── frontend/            # App Next.js
│   ├── pages/           # Pages React
│   ├── components/      # Composants réutilisables
│   ├── lib/             # Utilitaires (API client)
│   └── styles/          # CSS global
└── mobile/              # App React Native
    └── src/
        ├── screens/     # Écrans principaux
        ├── services/    # Appels API
        └── navigation/  # Configuration navigation
```

---

## 🔐 Sécurité Locale

Pour le développement local:

1. **JWT_SECRET** : Déjà configuré dans .env (à changer en production)
2. **Mots de passe** : Utiliser bcryptjs (déjà implémenté)
3. **CORS** : Configuré pour localhost:3000 (adapter si nécessaire)

---

## 📚 Ressources

- [Documentation Sequelize](https://sequelize.org/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Express.js](https://expressjs.com/)
- [PostgreSQL Setup](https://www.postgresql.org/docs/)

---

Pour toute question, consultez le README.md principal du projet.
