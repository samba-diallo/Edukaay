# EduKaay - Marketplace de Tutorat pour l'Afrique de l'Ouest

Plateforme connectant étudiants et tuteurs qualifiés au Sénégal et en Afrique de l'Ouest, avec paiement Mobile Money et programme de bourses diaspora.

## 🚀 Démarrage rapide

### Cloner le projet (Windows, macOS, Linux)

#### **Option 1: Branche par défaut (`main` - production)**
```bash
# Avec SSH (recommandé)
git clone git@github.com:samba-diallo/Edukaay.git
cd Edukaay

# Ou avec HTTPS
git clone https://github.com/samba-diallo/Edukaay.git
cd Edukaay
```

#### **Option 2: Branche `dev` (développement - code le + récent) ⭐ RECOMMANDÉ**
```bash
# Avec SSH
git clone -b dev git@github.com:samba-diallo/Edukaay.git
cd Edukaay

# Ou avec HTTPS
git clone -b dev https://github.com/samba-diallo/Edukaay.git
cd Edukaay

# Alternative (clone puis checkout)
git clone https://github.com/samba-diallo/Edukaay.git
cd Edukaay
git checkout dev
```

#### **Option 3: N'importe quelle branche ou feature**
```bash
# Remplacer <branch-name> par le nom de la branche
# Exemples: feature/sprint-0-safety-net, feature/auth-hardening, etc.

git clone -b <branch-name> https://github.com/samba-diallo/Edukaay.git
cd Edukaay

# Ou checkout après clone
git clone https://github.com/samba-diallo/Edukaay.git
cd Edukaay
git checkout <branch-name>
```

#### **Lister les branches disponibles (sans cloner)**
```bash
git ls-remote --heads https://github.com/samba-diallo/Edukaay.git
```

**Branches actuelles:**
- `main` — Production (stable, code stable)
- `dev` — Développement (code à jour, nouvelles features)
- `feature/*` — Branches de tâches spécifiques en cours

---

## 📁 Structure du projet

```
edukaay/
├── backend/          # API Node.js + Express + PostgreSQL (port 3001)
├── frontend/         # Application web Next.js 14 + Tailwind (port 3000)
├── mobile/           # Application mobile React Native (Expo)
└── docs/             # Documentation technique
```

Documentation disponible:
- **CLAUDE.md** — Guidelines complètes pour développement
- **ANALYSE_COMPLETE_PROJET.md** — Analyse du projet

## 📋 Prérequis

- **Node.js** >= 18 (télécharger depuis https://nodejs.org/)
- **PostgreSQL** >= 14 (télécharger depuis https://www.postgresql.org/download/)
- **Git** (pour Windows: https://git-scm.com/download/win)
- **npm** ou **yarn**

### Installation sur Windows

1. **Installer Git Bash**
   - Télécharger depuis https://git-scm.com/download/win
   - Utiliser Github Desktop ou Git Bash pour les commandes

2. **Installer Node.js et npm**
   - Télécharger depuis https://nodejs.org/ (LTS)
   - Installer et vérifier : `node --version` et `npm --version` dans PowerShell

3. **Installer PostgreSQL**
   - Télécharger depuis https://www.postgresql.org/download/windows/
   - Installer avec port 5432 (défaut)
   - Mémoriser le mot de passe superuser postgres

## ⚙️ Installation et démarrage

### 1️⃣ Backend

```bash
cd Edukaay/edukaay/backend
cp .env.example .env

# Éditer .env avec vos paramètres PostgreSQL:
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=votre_mot_de_passe
# POSTGRES_DB=edukaay

npm install
npm run dev        # Serveur sur http://localhost:3001
```

### 2️⃣ Frontend

```bash
cd Edukaay/edukaay/frontend
npm install
npm run dev        # Accessible sur http://localhost:3000
```

### 3️⃣ Mobile (optionnel)

```bash
cd Edukaay/edukaay/mobile
npm install
npx expo start     # Scannez le QR code avec l'app Expo Go
```

## 🔧 Variables d'environnement

Voir `backend/.env.example` pour la configuration complète:
- Connexion PostgreSQL
- Clés JWT
- APIs Mobile Money (Wave, Orange Money, MTN MoMo)

## 🏗️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (Pages Router), React 18, Tailwind CSS |
| Backend | Node.js, Express, Sequelize ORM |
| Base de données | PostgreSQL |
| Mobile | React Native (Expo) |
| Auth | JWT + bcrypt (12 rounds) |
| Paiements | Wave, Orange Money, MTN MoMo |
| Real-time | Socket.IO |
| Testing | Jest + Supertest |

## 🤝 Contribution

**Branches:**
- `main` — production (protected)
- `dev` — intégration (branche de travail)
- `feature/*` — tâches spécifiques

**Workflow:**
1. Créer une branche feature depuis `dev`
2. Implémenter la tâche
3. Faire un commit avec Conventional Commits
4. Ouvrir une PR vers `dev`
5. Après review et merge, la branche est supprimée

## 📄 Licence

Propriétaire - EduKaay © 2026
