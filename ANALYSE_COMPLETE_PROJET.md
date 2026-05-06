# 📚 ANALYSE COMPLÈTE DU PROJET EDUKAAY
## Marketplace de Tutorat pour l'Afrique de l'Ouest

---

## 🎯 RÉSUMÉ EXÉCUTIF

**EduKaay** est une plateforme numérique africaine connectant **étudiants** et **tuteurs qualifiés** au Sénégal et en Afrique de l'Ouest. Elle facilite l'accès à l'éducation de qualité avec :
- 🎓 Réservation de séances de tutorat (en ligne ou à domicile)
- 💳 Paiement Mobile Money sécurisé (Wave, Orange Money, MTN MoMo)
- 👥 Programme de bourses financées par la diaspora
- ⭐ Système d'avis et d'évaluation des tuteurs
- 📱 Applications web et mobile

**Stack technique:**
- **Backend:** Node.js + Express + Sequelize ORM + PostgreSQL
- **Frontend:** Next.js 14 + React 18 + Tailwind CSS
- **Mobile:** React Native (Expo)
- **Communication temps réel:** Socket.IO
- **Sécurité:** JWT + bcryptjs + Rate Limiting

---

## 🏗️ ARCHITECTURE GLOBALE

### Vue d'ensemble du système

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENTS                               │
├──────────────────┬──────────────────┬──────────────────┤
│   Frontend Web   │  Mobile App      │   Admin Panel    │
│  (Next.js)       │  (React Native)  │  (Next.js)       │
└────────┬─────────┴────────┬─────────┴────────┬─────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │
                       HTTP/JSON
                            │
         ┌──────────────────┴───────────────────┐
         │                                      │
    ┌────▼────────────────────────────────────┐ │
    │   BACKEND API (Express.js - Port 3001) │ │
    │                                        │ │
    │  ┌──────────────────────────────────┐ │ │
    │  │  Routes & Controllers            │ │ │
    │  │  - Users (Auth)                 │ │ │
    │  │  - Courses (Gestion)            │ │ │
    │  │  - Bookings (Réservations)      │ │ │
    │  │  - Payments (Paiements)         │ │ │
    │  │  - Reviews (Avis)               │ │ │
    │  │  - Scholarships (Bourses)       │ │ │
    │  │  - Recruitment (Recrutement)    │ │ │
    │  │  - Admin (Gestion plateforme)   │ │ │
    │  │  - AI (IA/Chatbot)              │ │ │
    │  └──────────────────────────────────┘ │ │
    │                                        │ │
    │  ┌──────────────────────────────────┐ │ │
    │  │  Middleware                      │ │ │
    │  │  - Authentication (JWT)          │ │ │
    │  │  - Authorization (Roles)         │ │ │
    │  │  - Upload (Fichiers)            │ │ │
    │  │  - Rate Limiting                │ │ │
    │  │  - CORS                         │ │ │
    │  └──────────────────────────────────┘ │ │
    │                                        │ │
    │  ┌──────────────────────────────────┐ │ │
    │  │  Socket.IO (Temps réel)          │ │ │
    │  │  - Chat entre utilisateurs       │ │ │
    │  │  - Notifications                 │ │ │
    │  │  - Salles virtuelles            │ │ │
    │  └──────────────────────────────────┘ │ │
    └────┬─────────────────────────────────┘ │
         │                                    │
    ┌────▼────────────────────────────────┐ │
    │   POSTGRESQL DATABASE (Port 5432)   │ │
    │                                    │ │
    │   Tables:                          │ │
    │   - utilisateurs                   │ │
    │   - cours                          │ │
    │   - reservations                   │ │
    │   - paiements                      │ │
    │   - avis                           │ │
    │   - bourses                        │ │
    │   - candidatures_tuteurs           │ │
    └────────────────────────────────────┘ │
         │                                  │
    ┌────▼──────────────────────────────┐  │
    │  Services Externes                │  │
    │  - Wave API (Paiements)           │  │
    │  - Orange Money API               │  │
    │  - MTN MoMo API                   │  │
    │  - Zoom/Google Meet (Visio)      │  │
    │  - S3/Cloud Storage (Documents)  │  │
    └───────────────────────────────────┘  │
         │                                  │
         └──────────────────────────────────┘
```

---

## 📊 MODÈLE DE DONNÉES

### 1️⃣ **User (Utilisateurs)**

Gère tous les utilisateurs de la plateforme avec 4 rôles possibles.

**Rôles:**
- 🎓 **etudiant** : Reserve des seances, paie les tuteurs
- 👨‍🏫 **tuteur** : Propose des cours, enseigne les étudiants
- 👨‍👩‍👧 **parent** : Paie pour les études de son enfant
- 🔐 **admin** : Gère la plateforme (verification, modération)

**Champs principaux:**
```javascript
{
  id: UUID (unique),
  prenom: string,
  nom: string,
  email: string (unique),
  telephone: string (format international),
  motDePasse: string (HACHE avec bcryptjs - jamais en clair),
  role: enum ['etudiant', 'tuteur', 'parent', 'admin'],
  avatar: URL (photo de profil),
  bio: text (description pour tuteurs),
  niveauEtude: string (primaire, collège, lycée, université),
  ville: string (default: 'Dakar'),
  estVerifie: boolean (verification KYC par admin),
  estActif: boolean (compte actif/banni),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Sécurité:**
- Mots de passe HACHÉS avec bcryptjs (12 rounds)
- JWT tokens avec expiration 7 jours
- Rate limiting sur les tentatives de connexion
- Vérification KYC pour les tuteurs

---

### 2️⃣ **Course (Cours)**

Represents les offres d'enseignement proposées par les tuteurs.

**Types de cours:**
- **Tutorat** : Seances individuelles en direct (interactif)
- **Contenu** : Cours structurés (vidéos, PDF) autopartenaires

**Champs principaux:**
```javascript
{
  id: UUID,
  titre: string,
  description: text,
  matiere: string (maths, français, anglais, arabe, sciences...),
  niveau: string (primaire, collège, lycée, université),
  curriculum: enum ['francais', 'franco_arabe', 'anglophone'],
  tarifHoraire: decimal (en XOF - Franc CFA),
  modalite: enum ['en_ligne', 'domicile', 'les_deux'],
  villeDisponible: string (pour cours à domicile),
  tuteurId: UUID (relation vers User),
  type: enum ['tutorat', 'contenu'],
  videoUrl: URL (si type=contenu),
  noteMoyenne: decimal (calc. à partir des avis),
  nombreAvis: integer,
  estActif: boolean,
  createdAt: datetime,
  updatedAt: datetime
}
```

**Relations:**
- 1 Tuteur → Plusieurs Cours
- 1 Cours → Plusieurs Réservations/Avis

---

### 3️⃣ **Booking (Réservations)**

Represents une seance de tutorat confirmée à une date/heure specifique.

**Cycle de vie d'une réservation:**
1. **en_attente** : Étudiant demande, tuteur attend pour confirmer
2. **confirmee** : Tuteur accepte, seance confirmée
3. **en_cours** : La seance se déroule actuellement (live)
4. **terminee** : Seance complète, attend validation famille
5. **annulee** : Annulée par étudiant ou tuteur

**Champs principaux:**
```javascript
{
  id: UUID,
  etudiantId: UUID (qui reserve),
  tuteurId: UUID (qui enseigne),
  coursId: UUID (d'apres quel cours),
  dateSeance: datetime (quand et a quelle heure),
  dureeMinutes: integer (60 = 1h, 90 = 1h30),
  statut: enum ['en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'],
  modalite: enum ['en_ligne', 'domicile'],
  adresse: string (si domicile),
  montantTotal: decimal (en XOF),
  lienVideoConference: URL (Zoom/Google Meet si en_ligne),
  notes: text (messages entre etudiant et tuteur),
  familyValidationStatus: enum ['en_attente', 'confirmee', 'contestee'],
  familyValidationNote: text (feedback de la famille),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Workflow complet:**
```
Étudiant réserve
    ↓
Tuteur confirme ou refuse
    ↓ (si confirmé)
Seance se déroule
    ↓
Tuteur marque terminée
    ↓
Famille valide ou conteste
    ↓
Paiement effectué (si validation OK)
```

---

### 4️⃣ **Payment (Paiements)**

Enregistre toutes les transactions financieres (Mobile Money).

**Méthodes acceptées:**
- 💱 Wave (https://wave.com)
- 📱 Orange Money
- 🏦 MTN MoMo
- 💳 Carte bancaire (future)

**Statut de paiement:**
- **en_attente** : Envoyé au prestataire, attente de confirmation
- **reussi** : Argent recu avec succes
- **echoue** : Transaction refusée/échouée
- **rembourse** : Remboursement effectué

**Champs principaux:**
```javascript
{
  id: UUID,
  reservationId: UUID (quelle seance),
  payeurId: UUID (etudiant ou parent qui paie),
  beneficiaireId: UUID (tuteur qui reçoit l'argent),
  montant: decimal (montant BRUT en XOF),
  commission: decimal (commission EduKaay = 15% par défaut),
  methodePaiement: enum ['wave', 'orange_money', 'mtn_momo', 'carte_bancaire'],
  statut: enum ['en_attente', 'reussi', 'echoue', 'rembourse'],
  referenceExterne: string (ID de transaction chez le prestataire),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Flux de paiement:**
```
Étudiant demande paiement
    ↓
API EduKaay initie transaction avec Wave/Orange/MTN
    ↓
Prestataire retourne URL de paiement (Cashless)
    ↓
Utilisateur complète le paiement sur l'app prestataire
    ↓
Prestataire envoie webhook à EduKaay
    ↓
Statut mis à jour (reussi/echoue)
    ↓
Réservation passe en "confirmee" si paiement OK
```

---

### 5️⃣ **Review (Avis)**

Permet aux étudiants de noter et commenter les tuteurs après une seance.

**Champs:**
```javascript
{
  id: UUID,
  etudiantId: UUID (qui laisse l'avis),
  tuteurId: UUID (tuteur évalué),
  coursId: UUID (cours suivi),
  note: integer (1-5 etoiles),
  commentaire: text,
  createdAt: datetime,
  updatedAt: datetime
}
```

**Impact:**
- Calcul automatique de `noteMoyenne` du tuteur et du cours
- Affichage dans le profil du tuteur
- Aide les autres étudiants à choisir

---

### 6️⃣ **Scholarship (Bourses)**

Gère les dons de la diaspora pour financer des cours aux étudiants.

**Statut:**
- **actif** : Fond disponible
- **epuise** : Montant entièrement utilise
- **expire** : Dépassé la date limite

**Champs:**
```javascript
{
  id: UUID,
  donateurId: UUID (optional - si enregistré sur plateforme),
  donateurNom: string,
  donateurEmail: string,
  montant: decimal (montant total du don),
  montantRestant: decimal (ce qui reste à utiliser),
  beneficiaireId: UUID (optional - etudiant ciblé),
  message: text (encouragements du donateur),
  statut: enum ['actif', 'epuise', 'expire'],
  methodePaiement: enum ['wave', 'orange_money', 'mtn_momo', 'carte_bancaire', 'virement'],
  createdAt: datetime,
  updatedAt: datetime
}
```

**User Story:**
1. Diaspora envoie don via Wave/Orange
2. Bourse créée et devient "active"
3. Étudiant eligibles consulte les bourses disponibles
4. Tuteur utilise le fonds pour payer la seance via don
5. Montant déduit du `montantRestant`

---

### 7️⃣ **TutorApplication (Candidatures)**

Gère les candidatures publiques pour devenir tuteur.

**Statut:**
- **en_attente** : Candidature reçue, admin review
- **approuvee** : Candidature acceptée, compte tuteur créé
- **rejetee** : Non conforme aux critères

**Champs:**
```javascript
{
  id: UUID,
  userId: UUID (optional - si candidature convertie en compte),
  nom: string,
  email: string,
  telephone: string,
  experiences: text (experience d'enseignement),
  qualifications: text (diplômes, certifications),
  specialites: string (matieres enseignées),
  document: URL (PDF optionnel - diplome, CV),
  statut: enum ['en_attente', 'approuvee', 'rejetee'],
  noteAdmin: text (feedback de l'admin),
  createdAt: datetime,
  updatedAt: datetime
}
```

---

## 🔐 SYSTÈME D'AUTHENTIFICATION & AUTORISATION

### 1. Authentification JWT

**Flux:**
```
1. User envoie email + password via /api/users/connexion
2. Backend verifie password avec bcryptjs (hash comparison)
3. Token JWT généré : jwt.sign({ id, role }, JWT_SECRET, {expiresIn: '7d'})
4. Token retourné au client (stocké LocalStorage)
5. Client envoie token dans Authorization header de chaque requete
6. Backend verifie token avec jwt.verify()
```

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Middleware `authentifier()`:**
```javascript
- Extrait token du header
- Decode et verifie signature
- Cherche utilisateur en BD
- Verifie que utilisateur est actif (estActif=true)
- Attache req.user au contexte
- Passe au middleware suivant
```

### 2. Autorisation basée sur les rôles

**Middleware `autoriser(...roles)`:**
```javascript
app.get('/admin/users', authentifier, autoriser('admin'), handler);
app.post('/courses', authentifier, autoriser('tuteur'), creerCours);
```

**Rôles et permissions:**

| Action | etudiant | tuteur | parent | admin |
|--------|----------|--------|--------|-------|
| Chercher cours | ✅ | ✅ | ✅ | ✅ |
| Réserver séance | ✅ | ❌ | ✅ | ❌ |
| Créer cours | ❌ | ✅ | ❌ | ❌ |
| Confirmer réservation | ❌ | ✅ | ❌ | ❌ |
| Laisser avis | ✅ | ❌ | ❌ | ❌ |
| Gérer les utilisateurs | ❌ | ❌ | ❌ | ✅ |
| Approuver tuteurs | ❌ | ❌ | ❌ | ✅ |
| Voir tous les paiements | ❌ | ❌ | ❌ | ✅ |

---

## 🛣️ ROUTES API COMPLÈTES

### 🔑 **Users** (`/api/users`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/inscription` | ❌ | - | Créer un compte (etudiant/tuteur/parent) |
| POST | `/connexion` | ❌ | - | Authentifier et récupérer JWT token |
| GET | `/profil` | ✅ | * | Récupérer le profil de l'utilisateur |
| PUT | `/profil` | ✅ | * | Modifier le profil personnel |
| GET | `/tuteurs` | ❌ | - | Lister tous les tuteurs vérifiés |

**Exemple: Inscription**
```bash
POST /api/users/inscription
Content-Type: application/json

{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean@example.com",
  "telephone": "+221701234567",
  "motDePasse": "SecurePass123!",
  "role": "etudiant"
}

Response 201:
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilisateur": {
    "id": "uuid...",
    "prenom": "Jean",
    "email": "jean@example.com",
    "role": "etudiant"
  }
}
```

---

### 📚 **Courses** (`/api/courses`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| GET | `/` | ❌ | - | Rechercher/lister tous les cours (avec filtres) |
| GET | `/:id` | ❌ | - | Détails d'un cours + avis |
| POST | `/` | ✅ | tuteur | Créer un nouveau cours |

**Filtres de recherche:**
```
GET /api/courses?matiere=maths&niveau=lycee&modalite=en_ligne&ville=Dakar&minTarif=1000&maxTarif=5000&q=python&page=1&limit=20
```

**Exemple: Créer un cours**
```bash
POST /api/courses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "titre": "Mathématiques Terminale S - Équations différentielles",
  "description": "Cours approfondi sur les équations différentielles avec exercices pratiques",
  "matiere": "mathematiques",
  "niveau": "lycee",
  "curriculum": "francais",
  "tarifHoraire": 2500,
  "modalite": "en_ligne",
  "villeDisponible": "Dakar"
}

Response 201:
{
  "message": "Cours créé avec succès",
  "cours": { id, titre, ... }
}
```

---

### 📅 **Bookings (Réservations)** (`/api/bookings`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/` | ✅ | etudiant | Créer une réservation |
| GET | `/mes-reservations` | ✅ | * | Lister mes réservations |
| GET | `/a-valider` | ✅ | * | Réservations en attente de validation |
| PATCH | `/:id/statut` | ✅ | * | Changer statut (confirmer/annuler) |
| PATCH | `/:id/terminer` | ✅ | tuteur | Marquer séance comme terminée |
| PATCH | `/:id/valider-famille` | ✅ | etudiant | Valider ou contester seance (famille) |

**Exemple: Créer une réservation**
```bash
POST /api/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "coursId": "uuid...",
  "dateSeance": "2026-04-25T15:30:00Z",
  "dureeMinutes": 60,
  "modalite": "en_ligne",
  "adresse": null,
  "notes": "Focuser sur les équations différentielles"
}

Response 201:
{
  "message": "Réservation créée",
  "reservation": {
    "id": "uuid...",
    "statut": "en_attente",
    "montantTotal": 2500.00,
    ...
  }
}
```

---

### 💳 **Payments (Paiements)** (`/api/payments`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/initier` | ✅ | * | Initier un paiement |
| POST | `/webhook` | ❌ | - | Webhook du prestataire (Wave/Orange) |

**Exemple: Initier un paiement**
```bash
POST /api/payments/initier
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reservationId": "uuid...",
  "methodePaiement": "wave"
}

Response 200:
{
  "message": "Paiement initié",
  "paiement": {
    "id": "uuid...",
    "statut": "en_attente",
    "referenceExterne": "wave_ref_123",
    "urlRedirection": "https://wave.com/pay/..."
  }
}
```

---

### ⭐ **Reviews (Avis)** (`/api/reviews`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/` | ✅ | etudiant | Laisser un avis sur tuteur |

**Exemple: Laisser un avis**
```bash
POST /api/reviews
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "tuteurId": "uuid...",
  "coursId": "uuid...",
  "note": 5,
  "commentaire": "Excellent tuteur, très pédagogue et patient!"
}

Response 201:
{
  "message": "Avis créé",
  "avis": { id, note: 5, ... }
}
```

---

### 💰 **Scholarships (Bourses)** (`/api/scholarships`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/` | ✅ | * | Créer un don/bourse |
| GET | `/disponibles` | ✅ | etudiant | Lister bourses disponibles |

---

### 👥 **Recruitment (Recrutement)** (`/api/recruitment`)

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | `/postuler` | ❌ | - | Soumettre candidature tuteur |
| GET | `/candidatures` | ✅ | admin | Lister toutes les candidatures |
| PATCH | `/candidatures/:id` | ✅ | admin | Approuver/rejeter candidature |

---

### 🔧 **Admin** (`/api/admin`)

Routes exclusives à l'administrateur pour gestion de plateforme (détails dans contrôleur admin).

---

### 🤖 **AI** (`/api/ai`)

Routes pour chatbot intelligent et assistance (IA/Foundry - future).

---

## 🎨 FRONTEND (Next.js)

### Structure des pages

```
frontend/
├── pages/
│   ├── _app.jsx                 # Point d'entrée + Layout global
│   ├── index.jsx                # Accueil (Hero, fonctionnalités)
│   ├── connexion.jsx            # Login
│   ├── inscription.jsx          # Register
│   ├── tableau-de-bord.jsx      # Dashboard (mes réservations)
│   ├── tuteurs.jsx              # Lister tous les tuteurs
│   ├── cours/index.jsx          # Recherche & listing cours
│   ├── bourses.jsx              # Bourses disponibles
│   ├── a-propos.jsx             # À propos d'EduKaay
│   ├── devenir-tuteur.jsx       # Formulaire recrutement
│   └── admin/
│       └── index.jsx            # Dashboard admin
├── components/
│   ├── layout/
│   │   ├── Layout.jsx           # Wrapper global (Header+Footer)
│   │   ├── Header.jsx           # Navigation bar
│   │   └── Footer.jsx           # Pied de page
│   ├── features/
│   │   └── HeroSearch.jsx       # Barre de recherche accueil
│   └── ui/
│       ├── CourseCard.jsx       # Carte d'un cours
│       ├── FeatureCard.jsx      # Carte de fonctionnalité
│       └── ChatbotWidget.jsx    # Widget chatbot IA
├── lib/
│   └── api.js                   # Client Axios avec intercepteurs JWT
├── styles/
│   └── globals.css              # Tailwind CSS
└── ...
```

### Pages principales

**Chaque page suit ce pattern:**
```jsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../lib/api';  // Client API

export default function PageName() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Charger les données de l'API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      // Gerer erreur
    }
  };

  return (
    <>
      <Head>
        <title>Page Title</title>
        <meta name="description" content="..." />
      </Head>
      
      <main>
        {/* Contenu */}
      </main>
    </>
  );
}
```

### Flux d'authentification Frontend

```jsx
// Connexion
1. User remplit email + password
2. POST /api/users/connexion
3. Reçoit JWT token
4. localStorage.setItem('edukaay_token', token)
5. Router.push('/tableau-de-bord')

// Sur chaque requête API
Intercepteur Axios:
- Fetch token depuis localStorage
- Ajouter header: Authorization: Bearer <token>

// Si token expire (401)
- Effacer localStorage
- Rediriger vers /connexion
```

---

## 📱 APPLICATION MOBILE (React Native)

### Structure

```
mobile/
├── App.js                       # Point d'entrée
├── src/
│   ├── screens/
│   │   ├── AccueilScreen.js    # Home
│   │   ├── RechercheScreen.js  # Search courses
│   │   ├── CoursDetailScreen.js # Course detail
│   │   ├── ReservationsScreen.js # My bookings
│   │   ├── ChatbotScreen.js    # AI Chat
│   │   ├── ConnexionScreen.js  # Login
│   │   └── ProfilScreen.js     # Profile
│   └── services/
│       └── api.js              # API client
└── App.json                    # Config Expo
```

### Navigation

- **Bottom Tabs:** Accueil, Recherche, Mes Réservations, Chat, Profil
- **Stack:** Navigation intra-tab (détails cours, etc.)

---

## 🔌 SERVICES EXTERNES

### 1. **Wave API (Paiements)**
- **Base URL:** `https://wave.com/` (+ bearer token)
- **Endpoint:** `POST /checkout/sessions`
- **Params:** amount, currency, client_reference, callbacks
- **Webhook:** Status updates → `/api/payments/webhook`

### 2. **Orange Money Web Payment**
- **Authentification:** OAuth2 + client credentials
- **Endpoint:** `POST /webpayment`
- **Token flow:** Get token → Use token → Call payment API

### 3. **MTN MoMo API**
- **Sandbox:** Test implementation
- **Production:** Live API key

### 4. **Visioconférence**
- Zoom/Google Meet (générer lien automatiquement)

### 5. **Cloud Storage**
- AWS S3 / Cloudinary (upload documents tuteurs)

---

## 🧠 LOGIQUES MÉTIER CLÉS

### A. Cycle de réservation & paiement

```
1. RECHERCHE
   Étudiant recherche cours (filtre: matière, niveau, tarif, ville...)
   └─ Affiche list of courses avec note tuteur

2. RÉSERVATION
   Étudiant clique "Réserver" sur un cours
   └─ Choisit date/heure et modalité (en_ligne ou domicile)
   └─ Statut: "en_attente"

3. CONFIRMATION TUTEUR
   Tuteur reçoit notification
   └─ Confirme ou refuse la réservation
   └─ Si confirme: statut → "confirmee" + lien zoom généré

4. PAIEMENT
   Étudiant clique "Payer"
   └─ Choisit méthode (Wave, Orange, MTN)
   └─ Redirigé vers Cashless prestataire
   └─ Saisit le code secret
   └─ Paiement confirmé

5. SEANCE
   À l'heure, tuteur + étudiant se connectent
   └─ Si en_ligne: Zoom/Meet
   └─ Si domicile: Face à face

6. VALIDATION
   Après seance:
   └─ Tuteur marque "terminee"
   └─ Famille valide ou conteste (48h)
   └─ Si validée: Argent au tuteur - commission EduKaay
   └─ Étudiant peut laisser avis

7. PAIEMENT DU TUTEUR
   À la fin du mois:
   └─ Sommes cumulées versées au tuteur (moins 15% commission)
```

### B. Système de bourses

```
1. DONATEUR (Diaspora)
   Envoie don via Wave/Orange/MTN
   └─ Montant + message d'encouragement
   └─ Bourse créée, statut "active", montantRestant = montant

2. ÉTUDIANT ELIGIBLE
   Consulte les bourses disponibles
   └─ Réserve un cours
   └─ Peut utiliser le fonds de la bourse (au lieu de payer)

3. DÉBLOCAGE
   Montant déduit de montantRestant
   └─ Si montantRestant = 0: statut → "epuise"
```

### C. Vérification & qualité

```
TUTEUR NOUVEAU:
1. Soumet candidature via /api/recruitment/postuler
   └─ Infos: nom, email, téléphone, expériences, qualifications
   └─ Peut uploader PDF (diplôme/CV)
   └─ Statut: "en_attente"

2. ADMIN RÉVISE
   - Vérifie qualifications
   - Accepte ou rejette
   - Laisse feedback

3. SI ACCEPTÉE
   - Compte tuteur créé automatiquement
   - Email d'activation envoyé
   - Peut commencer à proposer des cours

QUALITÉ MAINTENUE:
- Avis/notes visibles (1-5 étoiles)
- Moyenne calculée
- Tuteurs mal notés peuvent être suspendus
```

---

## 🛡️ SÉCURITÉ

### 1. **Authentication**
- JWT tokens avec expiration 7j
- Refresh tokens (future)
- 2FA/SMS OTP (optional)

### 2. **Passwords**
- Hashés avec bcryptjs (12 rounds)
- Validation côté client + server
- Récupération via email

### 3. **Rate Limiting**
- 100 requêtes par 15 min par IP
- Protection contre brute force

### 4. **CORS**
- Whitelist FRONTEND_URL uniquement
- En prod: domaine spécifique

### 5. **HTTPS**
- Certificat SSL/TLS en production
- Connexions sécurisées uniquement

### 6. **SQL Injection**
- Sequelize ORM + parameterized queries
- Pas de string concatenation

### 7. **XSS Protection**
- Helmet.js pour security headers
- Escaped user input
- React sanitization

### 8. **Données sensibles**
- Pas de numeros de compte stockés
- Seulement refs externes (token du prestataire)
- Logs de transaction sécurisés

---

## 📊 TESTS

### Backend Tests (`backend/tests/`)

```
tests/
├── controllers/
│   ├── userController.test.js
│   ├── courseController.test.js
│   ├── bookingController.test.js
│   ├── recruitmentController.test.js
│   └── reviewController.test.js
├── middleware/
│   └── auth.test.js
└── services/
    └── paymentService.test.js
```

### Exécution

```bash
# Lancer tous les tests
npm test

# Avec couverture de code
npm run test:coverage

# Mode watch (reload automatique)
npm run test:watch
```

### Framework
- **Jest** v29.7.0
- **Supertest** v6.3.3 (requests HTTP)

---

## 🚀 DÉPLOIEMENT

### Variables d'environnement `.env`

```bash
# Base de données PostgreSQL
DB_NAME=edukaay
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# APIs Paiement
WAVE_BASE_URL=https://api.sandbox.wave.com
WAVE_API_KEY=wave_key_here
OM_BASE_URL=https://api.orange.com
OM_CLIENT_ID=orange_id
OM_CLIENT_SECRET=orange_secret
MTN_MOMO_KEY=mtn_key_here

# S3 / Cloud Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
```

### Production Stack
- **Backend:** Node.js 18+ + Express on AWS EC2 / Heroku / Railway
- **Frontend:** Deployed on Vercel / Netlify
- **Database:** PostgreSQL on AWS RDS / Managed service
- **Storage:** AWS S3
- **Email:** SendGrid / AWS SES
- **CDN:** CloudFlare

---

## 📈 MÉTRIQUES & MONITORING

### KPIs
- Nombre d'utilisateurs (étudiant/tuteur)
- Séances réservées/complétées par mois
- Montant total des paiements
- Taux de validation seances
- Note moyenne des tuteurs
- Revenue (commissions EduKaay)

### Monitoring
- Application Insights / DataDog
- Error tracking: Sentry
- Logs: CloudWatch / LogRocket
- Uptime: Pingdom / UptimeRobot

---

## 🎯 ROADMAP & FUTURES FEATURES

| Feature | Status | Priority |
|---------|--------|----------|
| Vérification SMS OTP | Planifié | High |
| Refresh tokens | Planifié | High |
| 2FA avec Google Authenticator | Planifié | Medium |
| Intégration AI (chatbot tutoring) | In Progress | High |
| Groupe d'études collaboratif | Planifié | Medium |
| Certifications tuteurs | Planifié | Medium |
| Points de fidélité/gamification | Futur | Low |
| Marketplace de ressources (books, etc.) | Futur | Low |
| Expansion à d'autres pays africains | Futur | High |

---

## 📚 FICHIERS CLÉS

| Fichier | Description |
|---------|-------------|
| `backend/app.js` | Point d'entrée du serveur Express |
| `backend/config/database.js` | Configuration PostgreSQL + Sequelize |
| `backend/models/index.js` | Associations entre modèles |
| `backend/middleware/auth.js` | JWT authentication + authorization |
| `backend/routes/*.js` | Définition des routes API |
| `backend/controllers/*.js` | Logique métier des endpoints |
| `backend/services/paymentService.js` | Intégration APIs de paiement |
| `frontend/lib/api.js` | Client Axios pour API |
| `frontend/pages/*.jsx` | Pages Next.js |
| `frontend/components/**/*.jsx` | Composants React réutilisables |
| `mobile/src/screens/*.js` | Écrans React Native |

---

## 🔧 COMMANDES UTILES

```bash
# Backend
cd backend

# Installation
npm install

# Développement
npm run dev                    # Start avec Nodemon

# Tests
npm test                       # Lancer tests
npm run test:coverage         # Couverture de code
npm run test:watch            # Watch mode

# Base de données
npm run init-db              # Initialize database (script/initDb.js)

# -------

# Frontend
cd frontend

npm install
npm run dev                  # Development server (localhost:3000)
npm run build               # Production build
npm start                   # Production server

# -------

# Mobile
cd mobile

npm install
npx expo start              # Start dev server
npx expo start --android    # Android emulator
npx expo start --ios        # iOS simulator
```

---

## 📞 SUPPORT & DOCUMENTATION

- **Repo:** GitHub (private)
- **Docs:** `/docs/` folder
- **Issues:** GitHub Issues
- **Slack:** Internal channel
- **Email:** support@edukaay.com

---

## ✅ CHECKLIST POUR NOUVEAU DÉVELOPPEUR

- [ ] Clone du repo
- [ ] Installation des dépendances (backend + frontend + mobile)
- [ ] Configuration du `.env`
- [ ] Base de données PostgreSQL lancée
- [ ] `npm run init-db` pour créer les tables
- [ ] `npm run dev` (backend sur port 3001)
- [ ] `npm run dev` (frontend sur port 3000)
- [ ] Test connexion API: `curl http://localhost:3001/api/ping`
- [ ] Lire les tests existants
- [ ] Créer une branche feature (`git checkout -b feature/new-feature`)

---

## 🎓 ARCHITECTURE DÉCISIONS

### Pourquoi PostgreSQL + Sequelize?
- ✅ Relationnel (ACID, intégrité)
- ✅ Scaling vertical/horizontal possible
- ✅ ORM Sequelize pour dev speed
- ✅ Support migrations

### Pourquoi Next.js pour frontend?
- ✅ SSR/SSG pour SEO (important pour marketplace)
- ✅ API routes optionnelles
- ✅ Performance optimale
- ✅ Déploiement simple (Vercel)

### Pourquoi React Native + Expo pour mobile?
- ✅ Code sharing (JS/TS)
- ✅ Fast development
- ✅ OTA updates
- ✅ No native code needed pour MVP

### Pourquoi Socket.IO?
- ✅ Notifications en temps réel
- ✅ Chat entre utilisateurs
- ✅ Fallback HTTP long-polling

---

## 📝 NOTES D'IMPLÉMENTATION

**Version:** 1.0.0
**Date:** Avril 2026
**Serveurs:** Backend (3001), Frontend (3000), Mobile (Expo)
**ORM:** Sequelize 6.35
**Auth:** JWT + bcrypt
**API Pattern:** RESTful
**Code Style:** ESLint + Prettier (à implémenter)
**Documentation:** JSDoc inline + ce document

---

**Document généré pour Claude - Contexte complet du projet EduKaay**
**Dernière mise à jour:** 19 Avril 2026
