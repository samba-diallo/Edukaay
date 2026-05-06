# 📑 INDEX PRINCIPAL - DOCUMENTATION COMPLÈTE EDUKAAY

---

## 🎯 BIENVENUE CLAUDE!

Cette documentation est organisée en **3 documents complémentaires** pour vous donner une compréhension complète du projet **EduKaay**.

---

## 📚 DOCUMENTS DISPONIBLES

### 1️⃣ **ANALYSE_COMPLETE_PROJET.md**
📖 **Pour:** Comprendre l'architecture globale et les concepts

**Sections incluses:**
- ✅ Résumé exécutif & vision du projet
- ✅ Architecture système (diagram)
- ✅ Modèle de données complet (7 entités)
- ✅ Routes API exhaustive
- ✅ Stack technique détaillée
- ✅ Authentification & JWT
- ✅ Frontend & Mobile overview
- ✅ Services externes (APIs paiement)
- ✅ Sécurité & bonnes pratiques
- ✅ Roadmap future

**À lire quand:**
- 🆕 Première approche du projet
- 🤔 Besoin de comprendre pourquoi les décisions tech
- 🔍 Explorer le modèle de données
- 📋 Vérifier les routes API disponibles

---

### 2️⃣ **GUIDE_CAS_USAGE_FLOWS.md**
🎬 **Pour:** Comprendre les workflows utilisateur réels

**Sections incluses:**
- ✅ 5 Personas détaillés
- ✅ FLOW 1: Inscription étudiant & première réservation (25 étapes)
- ✅ FLOW 2: Candidature tuteur & activation
- ✅ FLOW 3: Don diaspora & utilisation bourses
- ✅ FLOW 4: Gestion admin plateforme
- ✅ Diagrammes de flux paiement
- ✅ Gestion d'erreurs & recovery
- ✅ Notifications temps réel
- ✅ FAQ métier

**À lire quand:**
- 👥 Besoin de comprendre les cas utilisateur réels
- 🔄 Tracer le flow complet d'une réservation/paiement
- 🐛 Debugger un scénario compliqué
- 📊 Expliquer la logique métier à quelqu'un

---

### 3️⃣ **GUIDE_TECHNIQUE_DETAILLE.md**
⚙️ **Pour:** Détails d'implémentation & configuration

**Sections incluses:**
- ✅ Contrôleurs détaillés (userController, courseController, etc.)
- ✅ Services métier (paymentService)
- ✅ Configuration complète (.env)
- ✅ Installation & setup guide
- ✅ Intégration paiements (Wave, Orange, MTN)
- ✅ Socket.IO events & rooms
- ✅ Schéma BD SQL complet
- ✅ Erreurs courantes & solutions
- ✅ Optimisations performance

**À lire quand:**
- 👨‍💻 Commencer à développer une feature
- 🔧 Configurer l'environnement local
- 💳 Implémenter une intégration paiement
- 🐛 Debugger une erreur spécifique
- ⚡ Optimiser la performance

---

## 🗺️ QUICK NAVIGATION MAP

```
┌─────────────────────────────────────────────────────────┐
│           BESOIN DE...? → CONSULTER...                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📖 Débuter sur le projet                               │
│    → ANALYSE_COMPLETE_PROJET.md (Intro + Architecture) │
│                                                         │
│ 👨‍💻 Implémenter une feature                            │
│    → GUIDE_TECHNIQUE_DETAILLE.md + ANALYSE             │
│                                                         │
│ 🔄 Tracer un flow utilisateur                         │
│    → GUIDE_CAS_USAGE_FLOWS.md                          │
│                                                         │
│ 🐛 Debugger une erreur                                │
│    → GUIDE_TECHNIQUE_DETAILLE.md (Erreurs courantes)  │
│                                                         │
│ 💳 Implémenter paiements                              │
│    → GUIDE_TECHNIQUE_DETAILLE.md (Paiements section)  │
│                                                         │
│ 🔐 Sécurité & authentification                        │
│    → ANALYSE_COMPLETE_PROJET.md (Sécurité section)    │
│                                                         │
│ ⚙️ Configurer l'environnement                         │
│    → GUIDE_TECHNIQUE_DETAILLE.md (Setup section)      │
│                                                         │
│ 📊 Comprendre les KPIs/Metrics                        │
│    → ANALYSE_COMPLETE_PROJET.md (Fin du doc)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 LEARNING PATH RECOMMANDÉ

### Pour un **nouveau développeur:**

```
JOUR 1: Comprendre le projet
├─ Lire: ANALYSE_COMPLETE_PROJET.md (sections 1-4)
├─ Objectif: Connaître architecture & tech stack
└─ Temps: ~1-2h

JOUR 2: Setup & Configuration
├─ Lire: GUIDE_TECHNIQUE_DETAILLE.md (Configuration section)
├─ Faire: npm install, .env, npm run dev
├─ Tester: curl http://localhost:3001/api/ping
└─ Temps: ~1h

JOUR 3: Workflows utilisateur
├─ Lire: GUIDE_CAS_USAGE_FLOWS.md (Personas + FLOW 1)
├─ Tracer: Une réservation de A à Z
├─ Objectif: Comprendre le métier
└─ Temps: ~1-2h

JOUR 4-5: Premier ticket
├─ Sélectionner: Une issue simple (ex: "Ajouter filtre by ville")
├─ Consulter: GUIDE_TECHNIQUE_DETAILLE.md (Controllers)
├─ Implémenter & tester
├─ Push PR
└─ Temps: ~4-6h

👉 APRÈS: Rejoindre daily team sync & commencer à contribuer!
```

### Pour un **tech lead:**

```
JOUR 1: Architecture globale
├─ Lire: ANALYSE_COMPLETE_PROJET.md (complet)
├─ Review: Stack decisions & trade-offs
└─ Temps: ~2h

JOUR 2: Code review prep
├─ Lire: GUIDE_TECHNIQUE_DETAILLE.md (Controllers & Services)
├─ Comprendre: Patterns, conventions, erreur handling
└─ Temps: ~2h

JOUR 3+: Ongoing
├─ Review PRs utilisant les docs comme référence
├─ Valider que new code suit les patterns
├─ Escalate decisions non-standard → Architecture
└─ Temps: Continu

👉 UTILISER: Ces docs comme **source of truth** pour onboarding
```

---

## 📊 QUICK REFERENCE

### Routes API principales

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/users/inscription` | POST | ❌ | Créer compte |
| `/api/users/connexion` | POST | ❌ | Login |
| `/api/users/profil` | GET | ✅ | Mon profil |
| `/api/courses` | GET | ❌ | Chercher cours |
| `/api/courses` | POST | ✅🎓 | Créer cours (tuteur) |
| `/api/bookings` | POST | ✅ | Réserver seance |
| `/api/bookings/mes-reservations` | GET | ✅ | Mes réservations |
| `/api/payments/initier` | POST | ✅ | Initier paiement |
| `/api/reviews` | POST | ✅🎓 | Laisser avis |
| `/api/recruitment/postuler` | POST | ❌ | Postuler tuteur |
| `/api/admin/*` | * | ✅🔐 | Admin only |

**Légende:** ❌=Public, ✅=Auth required, 🎓=Etudiant/Tuteur, 🔐=Admin only

---

### Modèles de données clés

```
User (4 rôles: etudiant, tuteur, parent, admin)
  ↓
Course (Proposé par tuteur - tutorat ou contenu)
  ↓
Booking (Réservation d'une seance)
  ├─ Statut: en_attente → confirmee → en_cours → terminee
  ├─ Validation famille: en_attente → confirmee/contestee
  └─ Payment lié
  ↓
Payment (Transaction)
  ├─ Méthodes: Wave, Orange Money, MTN MoMo, Bourse
  └─ Statut: en_attente → reussi/echoue
  
Review (Avis après seance) ⭐
  └─ Note 1-5 stars

Scholarship (Don diaspora)
  └─ Peut financer des seances

TutorApplication (Candidature)
  └─ Approuvee → Crée User(tuteur)
```

---

## 🔧 STACK TECHNIQUE SUMMARY

```
FRONTEND        │ BACKEND           │ DATABASE      │ EXTERNAL
────────────────┼───────────────────┼───────────────┼──────────────
Next.js 14      │ Node.js 18+       │ PostgreSQL 14 │ Wave API
React 18        │ Express.js        │ Sequelize ORM │ Orange Money
Tailwind CSS    │ JWT Auth          │ SQL           │ MTN MoMo
React Native    │ bcryptjs Hash     │ Indexes       │ Zoom API
Axios Client    │ Socket.IO (RT)    │ Migrations    │ S3 Storage
                │ Rate Limiting     │               │ SendGrid Email
                │ CORS + Helmet     │               │ Sentry Monitor
```

---

## 📱 PORTS PAR DEFAULT

```
Frontend:     http://localhost:3000
Backend API:  http://localhost:3001
PostgreSQL:   localhost:5432
Redis:        localhost:6379 (optional)
Zoom:         https://zoom.us/... (external)
Wave:         https://wave.com/... (external)
```

---

## 🚀 COMMANDES ESSENTIELLES

```bash
# ===== BACKEND =====
cd backend

# Install
npm install

# Variables d'environnement
cp .env.example .env
# ✏️ Éditer .env avec tes valeurs

# Dev
npm run dev                    # Start avec nodemon

# Test
npm test                       # Jest tests
npm run test:coverage         # Coverage report

# Base de données
npm run init-db              # Initialize schema

# ===== FRONTEND =====
cd frontend

npm install
npm run dev                  # http://localhost:3000

# ===== MOBILE =====
cd mobile

npm install
expo start                   # QR code
expo start --android         # Android emulator
expo start --ios             # iOS simulator

# ===== GIT =====
git checkout -b feature/une-nouvelle-feature
# ... faire des commits ...
git push origin feature/une-nouvelle-feature
# ... créer PR ...

# ===== UTILS =====
curl http://localhost:3001/api/ping    # Health check
psql -U postgres -d edukaay            # Direct DB access
```

---

## ❓ FAQ DÉVELOPPEUR

**Q: Où sont stockés les users?**
A: `utilisateurs` table en PostgreSQL

**Q: Comment l'authentification marche?**
A: JWT token généré à la connexion, stocké en localStorage frontend, envoyé en `Authorization` header

**Q: Où configurer les APIs paiement (Wave, Orange)?**
A: Fichier `.env` (voir GUIDE_TECHNIQUE_DETAILLE.md)

**Q: Comment tester localement les webhooks paiement?**
A: Utiliser ngrok: `ngrok http 3001` puis updater URL dans Wave sandbox dashboard

**Q: Peut-on rollback un paiement?**
A: Oui, admin peut initier remboursement (Payment.statut = 'rembourse')

**Q: Comme les tuteurs sont vérifiés?**
A: Admin approuve candidature → Account créé automatiquement avec `estVerifie=true`

**Q: Peut un étudiant réserver plusieurs fois le même cours?**
A: Oui, plusieurs seances peut être réservées (future: packages)

**Q: Comment les bourses marchent?**
A: Donations créent fonds; étudiants utilisent fonds au lieu de payer; montantRestant diminue

---

## 🤝 CONTRIBUTION WORKFLOW

```
1. Read requirements in issue/Slack
2. Check this docs for context
3. Create feature branch
   git checkout -b feature/short-description
4. Implement following code patterns
5. Test locally
6. Push & create PR
7. Request review
8. Address feedback
9. Merge to main
10. Deploy (CI/CD handles)
```

## 📞 CONTACTS & RESOURCES

```
👨‍💼 Tech Lead: [À remplir]
📧 Questions: Slack #engineering
🐛 Bugs: GitHub Issues
📚 Docs: Ces 3 fichiers
🔒 Secrets: .env.example / ask admin
```

---

## 🎉 PROCHAINES ÉTAPES

### ✅ Maintenant que vous avez ces docs:

1. **Choisissez votre rôle:**
   - 👨‍💻 Developer → Lire GUIDE_TECHNIQUE_DETAILLE.md
   - 🎯 Product → Lire GUIDE_CAS_USAGE_FLOWS.md
   - 👔 Tech Lead → Lire tous les 3
   - 🏗️ Architect → Focus sur ANALYSE_COMPLETE_PROJET.md

2. **Setup local environment:**
   - Clone repo
   - Follow GUIDE_TECHNIQUE_DETAILLE.md (Setup section)
   - Verify `npm run dev` works

3. **Trouvez votre 1ère tâche:**
   - Issues labellées `good-first-issue`
   - Utilisez les docs comme référence
   - N'hésitez pas à poser des questions!

4. **Rejoignez le team:**
   - Sync daily avec le team
   - Review code avec ces patterns
   - Contribuer aux améliorations

---

## 📝 VERSIONING & UPDATES

```
Version: 1.0.0 (Documentation)
Date: 19 Avril 2026
Maintenu par: [Team name]
Dernière mise à jour: 19 Avril 2026
```

**❗ Important:** Cette documentation doit rester à jour!
- Après chaque changement majeur d'architecture → Update ANALYSE_COMPLETE_PROJET.md
- Après chaque nouveau endpoint → Update GUIDE_TECHNIQUE_DETAILLE.md
- Après chaque changement de workflow → Update GUIDE_CAS_USAGE_FLOWS.md

---

## 🙏 MERCI!

Vous avez maintenant:
- ✅ **Compréhension complète** du projet EduKaay
- ✅ **Architecture détaillée** avec diagrammes
- ✅ **Workflows utilisateur réels** avec exemples
- ✅ **Détails techniques** pour implémenter
- ✅ **Erreurs courantes** avec solutions
- ✅ **Configuration complète** pour démarrer

**Bon code! 🚀**

---

> Made with ❤️ for EduKaay team  
> Questions? → Slack / Meeting / Issue  
> Found a bug in docs? → Update & PR!

