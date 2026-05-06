# 🔧 GUIDE TECHNIQUE DÉTAILLÉ - EDUKAAY

---

## 📋 TABLE DES MATIÈRES

1. [Contrôleurs Détaillés](#contrôleurs-détaillés)
2. [Services Métier](#services-métier)
3. [Configuration & Setup](#configuration--setup)
4. [Intégration Paiements](#intégration-paiements)
5. [Socket.IO en Détail](#socketio-en-détail)
6. [Base de Données](#base-de-données)
7. [Erreurs Courantes & Solutions](#erreurs-courantes--solutions)
8. [Optimisations Performance](#optimisations-performance)

---

## 🎮 CONTRÔLEURS DÉTAILLÉS

### 1. **userController.js**

#### `inscription(req, res)`
```javascript
// POST /api/users/inscription
INPUTS:   { prenom, nom, email, telephone, motDePasse, role }
OUTPUTS:  { message, token, utilisateur }
ERRORS:   400 (email exists), 400 (invalid email), 500 (db error)

LOGIQUE:
1. Valider format email (regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
2. Valider telephone (format international +221...)
3. Valider motDePasse (min 8 chars, uppercase, numeric)
4. Chercher email en BD (SELECT * FROM utilisateurs WHERE email = ?)
   ├─ Si existe: return 400
   ├─ Si non: continuer
5. Hash motDePasse avec bcryptjs.hash(pwd, 12)
6. INSERT INTO utilisateurs (prenom, nom, email, telephone, motDePasse, role=default)
7. jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' })
8. RETURN { message, token, user data }

DB HOOK (beforeCreate):
- Automatiquement hash pwd avec bcryptjs avant INSERT
```

#### `connexion(req, res)`
```javascript
// POST /api/users/connexion
INPUTS:   { email, motDePasse }
OUTPUTS:  { message, token, utilisateur }
ERRORS:   401 (invalid credentials), 500 (db error)

LOGIQUE:
1. Valider inputs non-vides
2. SELECT * FROM utilisateurs WHERE email = ?
   ├─ Si NULL: return 401 "Email ou motDePasse incorrect"
3. Comparer motDePasse avec bcryptjs.compare(pwd, hash)
   ├─ Si mismatch: return 401
4. Vérifier estActif === true
   ├─ Si false: return 401 "Compte désactivé"
5. Générer JWT token
6. Optionnel: UPDATE last_login = NOW()
7. RETURN { message, token, user data (sans pwd) }

SÉCURITÉ:
- Pas révéler si email existe ou pas (unified error message)
- Limiter tentatives (via middleware rate-limit)
- Logger tentatives échouées (audit)
```

#### `getProfil(req, res)`
```javascript
// GET /api/users/profil
AUTH:     ✅ JWT required (via authentifier middleware)
OUTPUTS:  { utilisateur }
ERRORS:   401 (unauthorized), 404 (user not found)

LOGIQUE:
1. req.user attaché par authentifier middleware
2. SELECT * FROM utilisateurs WHERE id = req.user.id
3. RETURN user (excl. motDePasse)

INCLUDE IF TUTEUR:
- coursProposés (via association)
- noteMoyenne (calculée)
- nombreAvis
- seancesTotal
- gainTotal (ce mois/année)
```

#### `updateProfil(req, res)`
```javascript
// PUT /api/users/profil
AUTH:     ✅ JWT required
INPUTS:   { prenom?, nom?, bio?, avatar?, niveauEtude?, ville? }
OUTPUTS:  { message, utilisateur }
ERRORS:   400 (validation), 401, 500

LOGIQUE:
1. Valider champs (trim, max length)
2. UPDATE utilisateurs SET ... WHERE id = req.user.id
3. Si avatar fourni:
   ├─ Upload vers S3
   ├─ Sauver URL
4. RETURN user mis à jour

RESTRICTIONS:
- Ne pas pouvoir changer email (seulement via verification)
- Ne pas pouvoir changer role (seulement admin)
- Ne pas pouvoir changer motDePasse (route différente)
```

#### `listerTuteurs(req, res)`
```javascript
// GET /api/users/tuteurs
AUTH:     ❌ Public
QUERY:    { sort, page=1, limit=20 }
OUTPUTS:  { tuteurs, total, pages }

LOGIQUE:
1. SELECT * FROM utilisateurs WHERE role='tuteur' AND estActif=true
2. Inclure:
   ├─ coursProposés (count)
   ├─ noteMoyenne (JOIN avis, AVG(note))
   ├─ nombreAvis
   ├─ seancesTerminees (count of bookings with status='terminee')
3. Sort options:
   ├─ 'populaire': BY nombreAvis DESC
   ├─ 'note': BY noteMoyenne DESC
   ├─ 'recent': BY createdAt DESC
   ├─ 'tarif_asc': BY avgTarif ASC
4. Pagination: LIMIT 20 OFFSET (page-1)*20
5. RETURN { tuteurs, pagination info }
```

---

### 2. **courseController.js**

#### `creerCours(req, res)`
```javascript
// POST /api/courses
AUTH:     ✅ JWT + role='tuteur'
INPUTS:   { titre, description, matiere, niveau, curriculum, tarifHoraire, 
            modalite, villeDisponible, type='tutorat', videoUrl? }
OUTPUTS:  { message, cours }

LOGIQUE:
1. Valider tous les inputs (non-vides, formats valides)
2. Valider tarifHoraire > 0 ET <= 100000
3. Si type='contenu' et pas videoUrl: return 400
4. INSERT INTO cours (...)
   ├─ tuteurId = req.user.id
   ├─ estActif = true
   ├─ noteMoyenne = NULL
   ├─ nombreAvis = 0
5. Si videoUrl fourni: valider URL (https://)
6. RETURN cours créé

VALIDATION MATIERE:
- Allowed: ['maths', 'francais', 'anglais', 'arabe', 'histoire', 'sciences', 
           'physique', 'chimie', 'biologie', 'svt', 'informatique', 'sport', ...]
```

#### `rechercherCours(req, res)`
```javascript
// GET /api/courses?matiere=...&niveau=...&...
AUTH:     ❌ Public
QUERY PARAMS:
  - matiere: string (filter)
  - niveau: string (filter)
  - modalite: enum (filter)
  - ville: string (filter)
  - minTarif, maxTarif: decimal (range)
  - q: string (full text search)
  - page: int = 1
  - limit: int = 20
  - sort: 'populaire'|'note'|'recent'|'tarif_asc'|'tarif_desc'

OUTPUTS:  { cours[], total, page, totalPages }

LOGIQUE:
1. Construire WHERE clause dynamiquement:
   WHERE estActif=true 
   AND (matiere=? OR matiere IS NULL)
   AND (niveau=? OR niveau IS NULL)
   AND (modalite IN (...) OR modalite IS NULL)
   ...

2. Si minTarif/maxTarif:
   AND tarifHoraire >= minTarif AND tarifHoraire <= maxTarif

3. Si q (full text search):
   AND (titre ILIKE '%q%' OR description ILIKE '%q%')

4. ORDER BY (selon sort):
   - 'note': noteMoyenne DESC, nombreAvis DESC
   - 'populaire': nombreAvis DESC
   - 'recent': createdAt DESC
   - 'tarif_asc': tarifHoraire ASC
   
5. LIMIT limit OFFSET (page-1)*limit

6. Include relations:
   - tuteur: { id, prenom, nom, avatar, ville, noteMoyenne }
   - COUNT avis

PERFORMANCE:
- Index DB sur: matiere, niveau, modalite, tuteurId
- Cache results 5 min (Redis future)
```

#### `getCoursParId(req, res)`
```javascript
// GET /api/courses/:id
AUTH:     ❌ Public
OUTPUTS:  { cours }
ERRORS:   404 (not found)

LOGIQUE:
1. SELECT * WHERE id = req.params.id
2. Include:
   ├─ tuteur: full profile (excl. pwd)
   ├─ avis[]: JOIN Review avec étudiant profile
   └─ noteMoyenne, nombreAvis
3. Si pas trouvé: return 404
4. RETURN cours avec all details
```

---

### 3. **bookingController.js**

#### `creerReservation(req, res)`
```javascript
// POST /api/bookings
AUTH:     ✅ JWT required
INPUTS:   { coursId, dateSeance, dureeMinutes=60, modalite, adresse?, notes? }
OUTPUTS:  { message, reservation }

LOGIQUE:
1. Vérifier utilisateur est 'etudiant'
2. SELECT * FROM cours WHERE id=coursId
   ├─ Si not found: 404
3. Valider dateSeance:
   ├─ Must be future (> NOW())
   ├─ Format: ISO 8601
   ├─ Pas dans le passé
4. Valider dureeMinutes (15, 30, 60, 90, 120 min)
5. Valider modalite matches course.modalite
6. Si modalite='domicile': verify adresse not empty
7. Calculer montantTotal = (tarifHoraire / 60) * dureeMinutes
8. INSERT INTO reservations:
   ├─ etudiantId = req.user.id
   ├─ tuteurId = cours.tuteurId
   ├─ coursId
   ├─ dateSeance
   ├─ dureeMinutes
   ├─ statut = 'en_attente'
   ├─ modalite
   ├─ montantTotal
   └─ adresse (if applicable)
9. Si modalite='en_ligne': générer lien Zoom
   ├─ Appeler Zoom API
   ├─ Sauver lienVideoConference
10. Socket.IO: io.to(tuteurId).emit('nouvelle_reservation', {...})
11. RETURN reservation

VALIDATIONS SUPPLÉMENTAIRES:
- Pas de double-booking à la même heure pour tuteur
- Pas de réservation trop longue (max 4h)
- Pas de réservation dans > 60 jours (futures setting)
```

#### `mesReservations(req, res)`
```javascript
// GET /api/bookings/mes-reservations
AUTH:     ✅ JWT required
QUERY:    { statut?, modalite?, page=1, limit=20, sort='recent' }
OUTPUTS:  { reservations[], pagination }

LOGIQUE:
1. Si role='tuteur':
   WHERE tuteurId = req.user.id
2. Si role='etudiant':
   WHERE etudiantId = req.user.id
3. Optionnel filter:
   ├─ statut: 'en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'
   ├─ modalite
4. Sort options:
   ├─ 'recent': ORDER BY dateSeance DESC
   ├─ 'prochain': ORDER BY dateSeance ASC (upcoming first)
5. Include relations:
   ├─ cours: { titre, matiere, tarifHoraire }
   ├─ etudiant: { id, prenom, nom }
   ├─ tuteur: { id, prenom, nom }
   ├─ payment: { statut, montant }
6. RETURN reservations avec context

OPTIMISATION:
- Ne loader que les réservations du dernier 1 an
- Chercher dans cache (Redis) d'abord
```

#### `mettreAJourStatut(req, res)`
```javascript
// PATCH /api/bookings/:id/statut
AUTH:     ✅ JWT required
INPUTS:   { statut: 'en_attente'|'confirmee'|'en_cours'|'terminee'|'annulee' }
OUTPUTS:  { message, reservation }

LOGIQUE:
1. SELECT * FROM reservations WHERE id = req.params.id
   ├─ Si not found: 404
2. Vérifier authorization:
   ├─ Si statut='confirmee': req.user.id MUST be tuteurId
   ├─ Si statut='annulee': req.user.id MUST be etudiantId ou tuteurId
   ├─ Sinon: 403 Forbidden
3. Valider state transition:
   ├─ 'en_attente' → 'confirmee' (tuteur)
   ├─ 'en_attente' → 'annulee' (anyone)
   ├─ 'confirmee' → 'en_cours' (anyone)
   ├─ 'confirmee' → 'annulee' (anyone)
   ├─ 'en_cours' → 'terminee' (tuteur)
   ├─ Autres transitions: 403
4. UPDATE reservations SET statut=? WHERE id=?
5. Si statut='confirmee':
   ├─ Vérifier dateSeance dans future
   ├─ Générer lienVideoConference if modalite='en_ligne'
6. Si statut='annulee':
   ├─ Vérifier moti annulation
   ├─ Notifier l'autre partie
   ├─ Si paiement déjà fait: initier remboursement
7. Socket.IO: notifier étudiant et tuteur
8. RETURN reservation avec nouveau statut

STATE MACHINE:
        en_attente
         ↙    ↘
  (tuteur)  (anyone)
     ↓        ↓
 confirmee  annulee
     ↙
(anyone)
     ↓
  en_cours
     ↓
(tuteur)
     ↓
  terminee
```

#### `terminerSeance(req, res)`
```javascript
// PATCH /api/bookings/:id/terminer
AUTH:     ✅ JWT + must be tuteur
INPUTS:   { notes?: string }
OUTPUTS:  { message, reservation }

LOGIQUE:
1. Vérifier req.user.id === booking.tuteurId
2. Vérifier booking.statut = 'en_cours'
3. Vérifier dateSeance <= NOW() + 5min (seance doit être passée)
4. UPDATE reservations:
   ├─ statut = 'terminee'
   ├─ noteSupplémentaire = notes (if provided)
   ├─ updatedAt = NOW()
5. Socket.IO: emit 'seance_terminee' to étudiant
6. Envoyer notification: "Classe terminée, validez la séance dans 48h"
7. Créer tâche cron (future): if pas validé après 48h, assume validée
8. RETURN reservation

TRANSITION:
en_cours →(tuteur) terminee
(En attente de familyValidation)
```

#### `validerSeanceFamille(req, res)`
```javascript
// PATCH /api/bookings/:id/valider-famille
AUTH:     ✅ JWT (étudiant/parent)
INPUTS:   { validee: boolean, note?: string }
OUTPUTS:  { message, reservation, paiement }

LOGIQUE:
1. Vérifier req.user.id === booking.etudiantId
2. Vérifier booking.statut = 'terminee'
3. Vérifier timespan: createdAt <= 48h depuis terminalion
4. UPDATE reservations:
   ├─ familyValidationStatus = (validee ? 'confirmee' : 'contestee')
   ├─ familyValidationNote = note
5. Si validee = true:
   ├─ Créer Payment automatiquement
   ├─ Initier paiement (future: auto-debit)
   ├─ Envoyer email tuteur: "Paiement confirmé, crédité dans 24-48h"
6. Si validee = false (contestée):
   ├─ Notifier admin
   ├─ Créer ticket support automatique
   ├─ Admin arbitre: refund ou maintain payment
7. Socket.IO: notifier tuteur du résultat
8. RETURN reservation, paiement (if created)

FLOW:
terminee →(étudiant) confirmee/contestee
           → auto creation Payment
           → Tuteur peut retirer argent
```

---

### 4. **paymentController.js**

#### `initierPaiement(req, res)`
```javascript
// POST /api/payments/initier
AUTH:     ✅ JWT + (etudiant ou parent)
INPUTS:   { reservationId, methodePaiement: 'wave'|'orange_money'|'mtn_momo'|'bourse' }
OUTPUTS:  { message, paiement, urlRedirection? }

LOGIQUE:
1. SELECT * FROM reservations WHERE id=reservationId
   ├─ Si not found: 404
   ├─ Si etudiantId != req.user.id: 403
2. Vérifier booking.statut = 'confirmee' ou 'terminee'
3. Chercher Payment existant pour cette reservation:
   ├─ Si trouvé et statut='reussi': return 400 "Déjà payé"
4. Vérifier méthodePaiement valide
5. Si methodePaiement = 'bourse':
   ├─ Chercher bourses disponibles
   ├─ Vérifier montantRestant >= booking.montantTotal
   ├─ Déduire montant de bourse
   ├─ Créer Payment avec statut='reussi' immédiatement
   ├─ RETURN { paiement, statut='reussi' }
   └─ EXIT

6. Créer enregistrement Payment:
   ├─ reservationId
   ├─ payeurId = req.user.id
   ├─ beneficiaireId = booking.tuteurId
   ├─ montant = booking.montantTotal
   ├─ commission = montant * 0.15
   ├─ methodePaiement
   ├─ statut = 'en_attente'
   ├─ referenceExterne = NULL (sera set au webhook)

7. Appeler paymentService.traiterPaiement():
   ├─ Méthode: methodePaiement
   ├─ Montant
   ├─ Numéro téléphone du payeur
   ├─ Reference interne (Payment.id)

8. Service retourne:
   ├─ referenceExterne (id chez prestataire)
   ├─ urlRedirection (Cashless page)

9. UPDATE Payment:
   ├─ referenceExterne = ...

10. RETURN {
      paiement: { id, statut, montant, commission, ... },
      urlRedirection: "https://wave.com/pay/...",
      instructions: "Vous allez être redirigé..."
    }

ERREURS:
- 404: Booking not found
- 403: Not authorized
- 400: Already paid / Invalid method
- 500: Payment service error
```

#### `webhookPaiement(req, res)`
```javascript
// POST /api/payments/webhook
AUTH:     ❌ No auth (signature verification instead)
INPUTS:   { reference, statut, transactionId, signature? }
OUTPUTS:  { message }

LOGIQUE:
1. Vérifier signature webhook (HMAC-SHA256 avec shared secret)
   └─ Sécurité: prevent spoofing
2. SELECT * FROM paiements WHERE id=reference
   ├─ Si not found: return 400 bad_reference
3. UPDATE Payment SET:
   ├─ statut = (statut='success' ? 'reussi' : 'echoue')
   ├─ referenceExterne = transactionId
   ├─ updatedAt = NOW()
4. Si statut='reussi':
   ├─ SELECT * FROM reservations WHERE id=payment.reservationId
   ├─ UPDATE reservations SET statut='confirmee'
   ├─ Socket.IO: emit 'paiement_reussi' to étudiant
   ├─ Email: Confirmation paiement
   ├─ Tuteur: "Argent crédité dans 48h"
5. Si statut='echoue':
   ├─ Email: "Paiement échoué"
   ├─ Propose réessayer
6. UPDATE logs_transactions (audit trail)
7. RETURN { message: 'Webhook processed' }

IDEMPOTENCY:
- Vérifier si paiement déjà traité (check updatedAt)
- Retourner 200 OK même si déjà traité (webhook retry)
```

---

### 5. **recruitmentController.js**

#### `soumettreCandidat(req, res)`
```javascript
// POST /api/recruitment/postuler
AUTH:     ❌ Public
INPUTS:   { nom, email, telephone, experiences, qualifications, specialites, document? }
FILE:     document (PDF, optional, max 5MB)
OUTPUTS:  { message, candidature }

LOGIQUE:
1. Valider inputs:
   ├─ nom: non-vide, max 100 chars
   ├─ email: valide, unique (pas déjà tuteur)
   ├─ telephone: format international
   ├─ experiences: min 50 chars
   ├─ qualifications: min 50 chars
   ├─ specialites: non-vide (CSV ou array)

2. Si document:
   ├─ Vérifier: PDF, max 5MB
   ├─ Upload vers S3/Cloudinary
   ├─ Sauver URL

3. INSERT INTO candidatures_tuteurs:
   ├─ nom, email, telephone
   ├─ experiences, qualifications, specialites
   ├─ document (URL)
   ├─ statut = 'en_attente'
   ├─ createdAt = NOW()

4. Envoyer email à candidat:
   "Candidature reçue! Admin vous reviendra dans 48-72h"

5. Envoyer email à admin:
   "Nouvelle candidature tuteur de {nom}"

6. RETURN { message: 'Candidature soumise', candidature }

SPAM PROTECTION:
- Rate limit: 1 candidature par IP par jour
- Check pas email déjà candidat
- Vérifier email format réel (MX record check - future)
```

#### `listerCandidatures(req, res)`
```javascript
// GET /api/recruitment/candidatures
AUTH:     ✅ JWT + role='admin'
QUERY:    { statut='en_attente'|'approuvee'|'rejetee', page=1, limit=20 }
OUTPUTS:  { candidatures[], total, pages }

LOGIQUE:
1. SELECT * FROM candidatures_tuteurs
   ├─ WHERE statut = req.query.statut (if provided)
   ├─ ORDER BY createdAt DESC
   ├─ LIMIT page*limit OFFSET (page-1)*limit

2. Include:
   ├─ Document PDF preview link (if uploaded)
   ├─ Temps depuis submission

3. RETURN candidatures avec metadata

OPTIMIZATION:
- Pagination obligatoire
- Cache 1h (invalidate on approval/rejection)
```

#### `traiterCandidature(req, res)`
```javascript
// PATCH /api/recruitment/candidatures/:id
AUTH:     ✅ JWT + role='admin'
INPUTS:   { statut: 'approuvee'|'rejetee', noteAdmin?: string }
OUTPUTS:  { message, candidature, newUser? }

LOGIQUE:
1. SELECT * FROM candidatures_tuteurs WHERE id=req.params.id
   ├─ Si not found: 404
   ├─ Si statut != 'en_attente': 400 "Already processed"

2. UPDATE candidature SET:
   ├─ statut = req.body.statut
   ├─ noteAdmin = req.body.noteAdmin
   ├─ trainedBy = req.user.id (admin ID)
   ├─ trainingDate = NOW()

3. Si statut = 'approuvee':
   ├─ CREER User automatiquement:
   │  ├─ prenom: (extract from nom if possible)
   │  ├─ nom: candidature.nom
   │  ├─ email: candidature.email
   │  ├─ telephone: candidature.telephone
   │  ├─ role: 'tuteur'
   │  ├─ estVerifie: true ✅
   │  ├─ motDePasse: crypto.randomString(16) [temp]
   │  └─ bio: candidature.qualifications
   ├─ Envoyer email au nouveau tuteur:
   │  ├─ Sujet: "Bienvenue chez EduKaay!"
   │  ├─ Inclure lien reset password
   │  ├─ Instructions d'activation

4. Si statut = 'rejetee':
   ├─ Envoyer email au candidat:
   │  ├─ Sujet: "Candidature - Feedback"
   │  ├─ Raison: noteAdmin

5. RETURN { message, candidature, newUser (if created) }

AUTO-ACTIVATION:
- Tuteur doit reset password au 1er login
- Peut alors créer cours immédiatement
```

---

## 🔧 SERVICES MÉTIER

### **paymentService.js**

```javascript
// Abstraction layer pour différents prestataires

async function traiterPaiement({ methode, montant, telephone, reference }) {
  // Router vers la bonne méthode
  switch(methode) {
    case 'wave': return initierWave(...);
    case 'orange_money': return initierOrangeMoney(...);
    case 'mtn_momo': return initierMTNMomo(...);
  }
}

// Wave API Integration
async function initierWave(montant, telephone, reference) {
  const response = await axios.post(
    `${process.env.WAVE_BASE_URL}/checkout/sessions`,
    {
      amount: montant,
      currency: 'XOF',
      client_reference: reference,
      success_url: `${process.env.FRONTEND_URL}/paiement/succes?ref=${reference}`,
      error_url: `${process.env.FRONTEND_URL}/paiement/echec?ref=${reference}`,
      webhook_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    referenceExterne: response.data.id,
    urlRedirection: response.data.wave_launch_url,
  };
}

// Orange Money Web Payment
async function initierOrangeMoney(montant, telephone, reference) {
  // Step 1: Get auth token
  const authResponse = await axios.post(
    `${process.env.OM_BASE_URL}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.OM_CLIENT_ID,
      client_secret: process.env.OM_CLIENT_SECRET,
    }
  );

  const accessToken = authResponse.data.access_token;

  // Step 2: Create payment
  const payResponse = await axios.post(
    `${process.env.OM_BASE_URL}/webpayment`,
    {
      merchant_key: process.env.OM_CLIENT_ID,
      currency: 'XOF',
      order_id: reference,
      amount: montant,
      return_url: `${process.env.FRONTEND_URL}/paiement/succes`,
      notif_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    referenceExterne: payResponse.data.order_id,
    urlRedirection: payResponse.data.payment_url,
  };
}

// MTN MoMo - Sandbox
async function initierMTNMomo(montant, telephone, reference) {
  // Implémentation similaire
  // Sandbox vs Production handling
}
```

---

## ⚙️ CONFIGURATION & SETUP

### `.env.example`

```bash
# ===============================
# ENVIRONNEMENT
# ===============================
NODE_ENV=development
PORT=3001

# ===============================
# BASE DE DONNÉES
# ===============================
DB_NAME=edukaay
DB_USER=postgres
DB_PASSWORD=your_secure_password_change_this
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# Pool de connexion
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# ===============================
# AUTHENTIFICATION JWT
# ===============================
JWT_SECRET=your_super_secret_key_minimum_32_chars_change_this_in_prod
JWT_EXPIRES_IN=7d

# ===============================
# FRONTEND
# ===============================
FRONTEND_URL=http://localhost:3000
FRONTEND_PRODUCTION_URL=https://www.edukaay.com

# ===============================
# PAIEMENTS - WAVE
# ===============================
WAVE_BASE_URL=https://api.sandbox.wave.com
WAVE_API_KEY=your_wave_api_key_here
WAVE_WEBHOOK_SECRET=your_wave_webhook_secret

# ===============================
# PAIEMENTS - ORANGE MONEY
# ===============================
OM_BASE_URL=https://api.sandbox.orange.com
OM_CLIENT_ID=your_orange_client_id
OM_CLIENT_SECRET=your_orange_client_secret
OM_WEBHOOK_SECRET=your_orange_webhook_secret

# ===============================
# PAIEMENTS - MTN MOMO
# ===============================
MTN_MOMO_KEY=your_mtn_api_key
MTN_MOMO_ENVIRONMENT=sandbox  # ou 'production'
MTN_MOMO_WEBHOOK_SECRET=your_mtn_webhook_secret

# ===============================
# VISIOCONFÉRENCE - ZOOM
# ===============================
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id

# ===============================
# STOCKAGE - AWS S3
# ===============================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=edukaay-uploads
AWS_S3_BASE_URL=https://edukaay-uploads.s3.amazonaws.com

# Alternative: Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===============================
# EMAIL
# ===============================
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=noreply@edukaay.com
ADMIN_EMAIL=admin@edukaay.com

# ===============================
# LOGGING & MONITORING
# ===============================
LOG_LEVEL=debug  # ou 'info', 'warn', 'error'
SENTRY_DSN=your_sentry_dsn_for_error_tracking

# ===============================
# REDIS (Caching - Optional)
# ===============================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# ===============================
# CONFIGURATION MÉTIER
# ===============================
COMMISSION_RATE=0.15  # 15% commission EduKaay
TAX_RATE=0.00  # Future: taxes éventuelles

# Durée confirmation réservation (heures)
BOOKING_CONFIRMATION_TIMEOUT=24

# Festival de bourses (%)
SCHOLARSHIP_DISTRIBUTION_RATE=0.10

# ===============================
# FEATURES FLAG
# ===============================
FEATURE_SMS_OTP=false
FEATURE_2FA=false
FEATURE_AI_CHATBOT=true
FEATURE_GROUP_STUDY=false
```

### Installation & Setup

```bash
# 1. Clone repo
git clone https://github.com/your-org/edukaay.git
cd edukaay

# 2. Backend setup
cd backend
cp .env.example .env
# ✏️ Remplir les variables

# 3. Install dependencies
npm install

# 4. Base de données
# Option A: Local PostgreSQL
createdb edukaay
psql -U postgres -d edukaay < schema.sql

# Option B: Script d'init
npm run init-db

# 5. Start dev server
npm run dev
# Should see: "Serveur EduKaay démarré sur le port 3001"

# ===============================

# 6. Frontend setup
cd ../frontend
npm install
npm run dev
# Should see: "ready - started server on 0.0.0.0:3000"

# ===============================

# 7. Mobile setup (optional)
cd ../mobile
npm install
expo start
# Scan QR code avec phone
```

---

## 🔌 INTÉGRATION PAIEMENTS

### Wave Integration Flow

```
┌─────────────────┐
│   Mobile/Web    │
│  EduKaay App    │
└────────┬────────┘
         │ POST /api/payments/initier
         │ { reservationId, methode: 'wave' }
         ↓
┌─────────────────┐
│  Backend        │
│  EduKaay        │
│                 │
│ 1. Create       │
│    Payment      │
│ 2. Call Wave API│
└────────┬────────┘
         │ POST Wave Sandbox
         │ /checkout/sessions
         ↓
┌─────────────────┐
│  Wave           │
│  Payment        │
│  Gateway        │
│                 │
│ Returns:        │
│ - URL redirect  │
│ - Session ID    │
└────────┬────────┘
         │ Redirect
         ↓
┌─────────────────┐
│  User redirected│
│  to Wave page   │
│                 │
│  Enters number  │
│  & code         │
└────────┬────────┘
         │ HTTPGET /return_url
         ↓
┌─────────────────┐
│  Frontend       │
│  Success page   │
│  /paiement/     │
│  succes         │
└─────────────────┘
         ↑
         │ Async Webhook
         │ POST /webhook
┌─────────────────┐
│  Backend        │
│  - Update       │
│    Payment      │
│  - Update       │
│    Booking      │
│  - Notify user  │
└─────────────────┘
```

### Webhook Signature Verification

```javascript
const crypto = require('crypto');

function verifyWaveSignature(req) {
  const signature = req.headers['x-wave-signature'];
  const body = JSON.stringify(req.body);
  
  const computed = crypto
    .createHmac('sha256', process.env.WAVE_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computed)
  );
}

// Middleware
app.post('/api/payments/webhook', (req, res, next) => {
  if (!verifyWaveSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  next();
});
```

---

## 🔌 SOCKET.IO EN DÉTAIL

### Événements Temps Réel

```javascript
// ===== CONNECTION =====
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // ===== LECTURES =====
  
  // Étudiant rejoint salle d'attente
  socket.on('rejoindre_salle_attente', (salleId) => {
    socket.join(`attente_${salleId}`);
    console.log(`${socket.id} joined waiting room ${salleId}`);
  });
  
  // Tuteur notifié de nouvelle réservation
  socket.emit('nouvelle_reservation', {
    reservationId: 'uuid...',
    etudiantNom: 'Ahmed',
    coursNom: 'Maths',
    dateSeance: '2026-04-25 15:30',
    montant: 2500,
  });
  
  // ===== CONFIRMATION =====
  
  // Tuteur confirme réservation
  socket.on('confirmer_reservation', (data) => {
    // Backend process...
    io.to(`etudiant_${data.etudiantId}`)
      .emit('tuteur_confirme', {
        tuteurNom: 'Dr. Sidy',
        lienZoom: 'https://zoom.us/...',
        heureDebut: '15:30',
      });
  });
  
  // ===== CHAT EN DIRECT =====
  
  socket.on('message_cours', (message) => {
    const { coursId, text, from } = message;
    io.to(`cours_${coursId}`)
      .emit('nouveau_message', {
        from,
        text,
        timestamp: new Date(),
        avatar: 'url...',
      });
  });
  
  // ===== NOTIFICATION PAIEMENT =====
  
  socket.on('paiement_confirme', () => {
    io.to(`tuteur_${tuteurId}`)
      .emit('argent_recu', {
        montant: 2500,
        etudiant: 'Ahmed',
        avantCommission: 2375, // 2500 - 15%
      });
  });
  
  // ===== TERMINALION SÉANCE =====
  
  socket.on('seance_termine', (bookingId) => {
    io.to(`etudiant_${etudiantId}`)
      .emit('seance_termine', {
        message: 'Seance terminée. Validez-la dans 48h',
        courseDetails: {...},
      });
  });
  
  // ===== NOTIFICATIONS BROADCAST =====
  
  socket.on('envoyer_notification', (data) => {
    io.to(`user_${data.targetUserId}`)
      .emit('notification', {
        type: 'info|success|warning|error',
        message: data.message,
        link: data.link,
      });
  });
  
  // ===== DÉCONNEXION =====
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

### Rooms Organization

```
├── global
│   └── emit à tous les utilisateurs
│
├── user_[userId]
│   └── notifications personnelles
│
├── tuteur_[tuteurId]
│   └── notifications pour tuteur
│
├── etudiant_[etudiantId]
│   └── notifications pour étudiant
│
├── attente_[salleId]
│   └── utilisateurs en attente
│
└── cours_[coursId]
    └── chat en direct durant cours
```

---

## 💾 BASE DE DONNÉES

### Schéma Détaillé

```sql
-- ===== UTILISATEURS =====
CREATE TABLE utilisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  motDePasse VARCHAR(255) NOT NULL,
  role ENUM('etudiant', 'tuteur', 'parent', 'admin') DEFAULT 'etudiant',
  avatar VARCHAR(500),
  bio TEXT,
  niveauEtude VARCHAR(100),
  ville VARCHAR(100) DEFAULT 'Dakar',
  estVerifie BOOLEAN DEFAULT FALSE,
  estActif BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  -- Indices pour performances
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_estActif (estActif),
  INDEX idx_ville (ville)
);

-- ===== COURS =====
CREATE TABLE cours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  matiere VARCHAR(100) NOT NULL,
  niveau VARCHAR(100) NOT NULL,
  curriculum ENUM('francais', 'franco_arabe', 'anglophone') DEFAULT 'francais',
  tarifHoraire DECIMAL(10,2) NOT NULL CHECK (tarifHoraire > 0),
  modalite ENUM('en_ligne', 'domicile', 'les_deux') DEFAULT 'les_deux',
  villeDisponible VARCHAR(100),
  tuteurId UUID NOT NULL,
  type ENUM('tutorat', 'contenu') DEFAULT 'tutorat',
  videoUrl VARCHAR(500),
  noteMoyenne DECIMAL(3,2) DEFAULT NULL,
  nombreAvis INT DEFAULT 0,
  estActif BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (tuteurId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_tuteurId (tuteurId),
  INDEX idx_matiere (matiere),
  INDEX idx_niveau (niveau),
  INDEX idx_estActif (estActif)
);

-- ===== RÉSERVATIONS =====
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiantId UUID NOT NULL,
  tuteurId UUID NOT NULL,
  coursId UUID NOT NULL,
  dateSeance TIMESTAMP NOT NULL,
  dureeMinutes INT DEFAULT 60,
  statut ENUM('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee') DEFAULT 'en_attente',
  modalite ENUM('en_ligne', 'domicile') NOT NULL,
  adresse VARCHAR(500),
  montantTotal DECIMAL(10,2) NOT NULL,
  lienVideoConference VARCHAR(500),
  notes TEXT,
  familyValidationStatus ENUM('en_attente', 'confirmee', 'contestee'),
  familyValidationNote TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (etudiantId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (tuteurId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (coursId) REFERENCES cours(id) ON DELETE CASCADE,
  INDEX idx_etudiantId (etudiantId),
  INDEX idx_tuteurId (tuteurId),
  INDEX idx_dateSeance (dateSeance),
  INDEX idx_statut (statut)
);

-- ===== PAIEMENTS =====
CREATE TABLE paiements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservationId UUID NOT NULL,
  payeurId UUID NOT NULL,
  beneficiaireId UUID NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) DEFAULT 0,
  methodePaie ENUM('wave', 'orange_money', 'mtn_momo', 'bourse', 'carte_bancaire'),
  statut ENUM('en_attente', 'reussi', 'echoue', 'rembourse') DEFAULT 'en_attente',
  referenceExterne VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (payeurId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (beneficiaireId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_reservationId (reservationId),
  INDEX idx_statut (statut),
  INDEX idx_dateCreation (createdAt)
);

-- ===== AVIS =====
CREATE TABLE avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiantId UUID NOT NULL,
  tuteurId UUID NOT NULL,
  coursId UUID NOT NULL,
  note INT NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (etudiantId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (tuteurId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (coursId) REFERENCES cours(id) ON DELETE CASCADE,
  INDEX idx_tuteurId (tuteurId),
  INDEX idx_coursId (coursId)
);

-- ===== BOURSES =====
CREATE TABLE bourses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donateurId UUID,
  donateurNom VARCHAR(255) NOT NULL,
  donateurEmail VARCHAR(255) NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  montantRestant DECIMAL(10,2) NOT NULL,
  beneficiaireId UUID,
  message TEXT,
  statut ENUM('actif', 'epuise', 'expire') DEFAULT 'actif',
  methodePaiement ENUM('wave', 'orange_money', 'mtn_momo', 'carte_bancaire', 'virement'),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (donateurId) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  FOREIGN KEY (beneficiaireId) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  INDEX idx_statut (statut),
  INDEX idx_montantRestant (montantRestant)
);

-- ===== CANDIDATURES TUTEURS =====
CREATE TABLE candidatures_tuteurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  experiences TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  specialites VARCHAR(500) NOT NULL,
  document VARCHAR(500),
  statut ENUM('en_attente', 'approuvee', 'rejetee') DEFAULT 'en_attente',
  noteAdmin TEXT,
  traitePar UUID,
  traiteeA TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (userId) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  FOREIGN KEY (traitePar) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  INDEX idx_statut (statut),
  INDEX idx_email (email),
  INDEX idx_createdAt (createdAt)
);
```

---

## ❌ ERREURS COURANTES & SOLUTIONS

### 1. "Token invalide ou expiré"

**Cause:** JWT token expired ou signature mismatch

**Debug:**
```javascript
// Frontend
console.log(localStorage.getItem('edukaay_token'));
// Decode token online: jwt.io

// Backend
jwt.verify(token, process.env.JWT_SECRET);
// Check JWT_SECRET matches
```

**Fix:**
- Frontend: localStorage.removeItem('edukaay_token'), redirect to login
- Backend: Vérifier JWT_SECRET est identique

---

### 2. "CORS error: No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend et backend sur domaines différents

**Fix:**
```javascript
// backend/app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,  // Must match exactly
  credentials: true,
}));
```

---

### 3. "Email existant"

**Cause:** User already registered

**Fix:**
- Check email en lowercase: `email.toLowerCase()`
- Ou proposer "Oublié mot de passe?" au lieu de réinscrire

---

### 4. "Payment webhook not received"

**Cause:** 
- Webhook URL not reachable
- Signature verification failed
- Firewall blocks incoming requests

**Debug:**
```bash
# Test webhook locally
ngrok http 3001

# Update Wave/Orange with ngrok URL
# https://abc123.ngrok.io/api/payments/webhook

# Check logs
curl -X POST http://localhost:3001/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"reference":"test","statut":"success"}'
```

---

### 5. "Database connection refused"

**Cause:** PostgreSQL not running

**Fix:**
```bash
# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check running
psql -U postgres -c "SELECT 1"
```

---

## ⚡ OPTIMISATIONS PERFORMANCE

### Query Optimization

```javascript
// ❌ Bad: N+1 queries
const courses = await Course.findAll();
for (let course of courses) {
  course.tutor = await User.findByPk(course.tutorId);  // 100 queries!
}

// ✅ Good: Single query with eager load
const courses = await Course.findAll({
  include: [{ model: User, as: 'tuteur' }],
});
```

### Caching Strategy

```javascript
// Redis cache
const redis = require('redis');
const client = redis.createClient();

async function getCourses(filters) {
  const key = `courses:${JSON.stringify(filters)}`;
  
  // Check cache
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  // Query DB
  const courses = await Course.findAll({ where: filters });
  
  // Cache 5 minutes
  await client.setEx(key, 300, JSON.stringify(courses));
  
  return courses;
}
```

### Database Indexes

```sql
-- Add indexes for common queries
CREATE INDEX idx_courses_matiere_niveau 
ON cours(matiere, niveau);

CREATE INDEX idx_reservations_etudiant_date 
ON reservations(etudiantId, dateSeance);

CREATE INDEX idx_paiements_tuteur_statut 
ON paiements(beneficiaireId, statut);

-- Check index usage
EXPLAIN ANALYZE 
SELECT * FROM cours WHERE matiere='maths' AND niveau='lycee';
```

### API Response Compression

```javascript
// gzip responses
const compression = require('compression');
app.use(compression());
```

### Pagination

```javascript
// Always paginate large datasets
GET /api/courses?page=1&limit=20

// Never: SELECT * FROM courses (without LIMIT)
```

---

**Document généré pour Claude - Guide technique détaillé**
**Dernière mise à jour:** 19 Avril 2026
