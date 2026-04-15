# EduKaay - Marketplace de Tutorat pour l'Afrique de l'Ouest

Plateforme connectant étudiants et tuteurs qualifiés au Sénégal et en Afrique de l'Ouest, avec paiement Mobile Money et programme de bourses diaspora.

## Structure du projet

```
edukaay/
├── backend/          # API Node.js + Express + PostgreSQL
├── frontend/         # Application web Next.js + Tailwind CSS
├── mobile/           # Application mobile React Native (Expo)
└── docs/             # Documentation
```

## Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## Installation

### Backend
```bash
cd backend
cp .env.example .env     # Configurer les variables d'environnement
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev              # Accessible sur http://localhost:3000
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## Variables d'environnement

Voir `backend/.env.example` pour la liste complète des variables requises :
- Base de données PostgreSQL
- Clés JWT
- APIs Mobile Money (Wave, Orange Money, MTN MoMo)

## Stack technique

| Couche     | Technologie                          |
|------------|--------------------------------------|
| Frontend   | Next.js 14, React 18, Tailwind CSS   |
| Backend    | Node.js, Express, Sequelize ORM      |
| Base de données | PostgreSQL                      |
| Mobile     | React Native (Expo)                  |
| Paiements  | Wave, Orange Money, MTN MoMo         |
| Auth       | JWT + SMS OTP                        |

## Licence

Propriétaire - EduKaay © 2026
