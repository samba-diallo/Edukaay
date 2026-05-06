# 📖 GUIDE DES CAS D'USAGE ET FLUX UTILISATEUR - EDUKAAY

---

## 👥 PERSONAS

### 1. **Ahmed** - Étudiant de 16 ans (Lycée)
- 🎯 Cherche un tuteur en mathématiques
- 📱 Utilise l'appli mobile
- 💰 Paie via Wave avec l'argent de poche
- 🗓️ Disponible les mercredi et samedi

### 2. **Fatima** - Mère de famille
- 👨‍👩‍👧 Cherche tuteurs pour ses 3 enfants
- 💻 Utilise le site web
- 💳 Veut payer via Orange Money
- 🧠 Préfère cours à domicile

### 3. **Dr. Sidy** - Tuteur qualifié
- 🏫 Professeur de mathématiques retraité
- 👨‍💼 Cherche revenus supplémentaires
- 📊 Propose 5 cours différents
- ✅ Vérification KYC complétée

### 4. **Marie** - Immigrée au Canada
- 🌍 Part de la diaspora africaine
- 💰 Veut financer études de cousine au Sénégal
- 📱 Envoie don via Wave

### 5. **Admin Khadim**
- 🔐 Gère la plateforme EduKaay
- ✅ Vérifie tuteurs
- 🛡️ Modère contenus
- 📊 Analyse metrics

---

## 🎬 USER FLOWS DÉTAILLÉS

### FLOW 1: Inscription Étudiant & Première Connexion

**Titre:** Un nouvel étudiant s'inscrit et réserve sa première séance

**Préconditions:**
- Application web accessible
- Backend fonctionnel
- PostgreSQL en ligne

**Acteurs:** Ahmed (étudiant nouveau)

**Scenario principal:**

```
1. Ahmed visite www.edukaay.com
   └─ Voit la page d'accueil avec "S'inscrire comme étudiant"

2. Clique sur le bouton
   └─ Redirigé vers /inscription

3. Remplit le formulaire:
   ├─ Prénom: Ahmed
   ├─ Nom: Diallo
   ├─ Email: ahmed.diallo@gmail.com
   ├─ Téléphone: +221771234567
   ├─ Mot de passe: SecurePass2026!
   └─ Rôle: "etudiant"

4. POST /api/users/inscription
   Backend:
   ├─ Vérifie email n'existe pas ✅
   ├─ Hash le motDePasse avec bcryptjs ✅
   ├─ Crée user en BD ✅
   ├─ Génère JWT token (expire 7j) ✅
   └─ Retourne token + user data

5. Frontend reçoit token
   ├─ Stocke dans localStorage
   ├─ Effectue redirect → /tableau-de-bord
   └─ Affiche "Bienvenue Ahmed!"

6. Ahmed est maintenant connecté et voit:
   ├─ Ses réservations (vide)
   ├─ Menu: Rechercher cours, Mes bourses, Profil
   └─ Widget de chat IA

7. Ahmed clique "Rechercher cours"
   └─ Redirigé vers /cours

8. Formulaire de recherche:
   ├─ Matière: "Mathématiques" (autocomplete)
   ├─ Niveau: "Lycée"
   ├─ Modalité: "En ligne"
   ├─ Prix max: "3000"
   └─ Clique "Rechercher"

9. GET /api/courses?matiere=mathematiques&niveau=lycee&modalite=en_ligne&maxTarif=3000
   Backend cherche cours et retourne liste

10. Résultats affichés:
    ├─ Dr. Sidy - Maths Lycée - 2500 XOF/h - 📊 4.8/5 étoiles (12 avis)
    ├─ Mr. Ndiaye - Maths Tle S - 2000 XOF/h - 📊 4.2/5 (8 avis)
    └─ ... autres cours

11. Ahmed clique sur le cours de Dr. Sidy
    └─ Voit détails:
       ├─ Description complète
       ├─ Bio du tuteur
       ├─ Tous les avis avec commentaires
       ├─ Bouton "Réserver"

12. Clique "Réserver"
    └─ Modal:
       ├─ Choisir date: 2026-04-25
       ├─ Heure: 15:30
       ├─ Durée: 1 heure (60 min)
       ├─ Modalité: En ligne ✅
       └─ Note: "Focuser sur équations différentielles"

13. POST /api/bookings
    Backend:
    ├─ Crée reservation avec statut "en_attente"
    ├─ Calcule montantTotal: 2500 * (60/60) = 2500 XOF
    ├─ Envoie notification temps réel (Socket.IO) au tuteur
    └─ Retourne booking créée

14. Frontend affiche:
    ├─ "Réservation effectuée avec succès!"
    ├─ Détails: Dr. Sidy, 2026-04-25 15:30, 2500 XOF
    ├─ Statut: "En attente de confirmation du tuteur"
    └─ Bouton "Attendre confirmation"

15. Dr. Sidy reçoit notification (app/SMS)
    ├─ Ouvre sa section "Mes réservations en attente"
    ├─ Voir: Ahmed Diallo, Maths, 2600-04-25 15:30
    ├─ Clique "Confirmer"

16. PATCH /api/bookings/{id}/statut
    Backend:
    ├─ Mise à jour statut → "confirmee"
    ├─ Génère lien Zoom automatique
    ├─ Envoie notification à Ahmed
    └─ Sauvegarde lienVideoConference

17. Ahmed reçoit notification:
    ├─ "Tuteur a confirmé! Seance confirmée pour 2026-04-25 15:30"
    ├─ Nouveau statut: "Confirmée ✅"
    ├─ Affiche lien Zoom
    ├─ Bouton "Joindre la séance"

18. **Jour de la séance** 2026-04-25 15:30:
    ├─ Ahmed & Dr. Sidy rejoignent le lien Zoom
    ├─ Cours en direct (1 heure)
    ├─ Tuteur explique équations différentielles

19. À la fin, Dr. Sidy clique "Terminer séance"
    └─ PATCH /api/bookings/{id}/terminer
       ├─ Statut → "terminee"
       ├─ Attente de validation famille
       └─ Notification family: "Classe terminée, confirmez?"

20. Ahmed (ou parent) reçoit demande de confirmation:
    ├─ Modal: "Valider cette séance?"
    ├─ Choix: "Confirmer" ou "Contester"
    ├─ Commentaire optionnel
    ├─ Clique "Confirmer"

21. PATCH /api/bookings/{id}/valider-famille
    Backend:
    ├─ familyValidationStatus → "confirmee"
    ├─ Paiement peut être initié

22. Paiement:
    ├─ Ahmed clique "Payer 2500 XOF"
    ├─ Choisit Wave
    ├─ POST /api/payments/initier
    ├─ Redirigé vers page paiement Wave
    ├─ Saisit code secret
    ├─ Paiement confirmé ✅

23. Webhook reçu:
    ├─ Backend met à jour: Payment statut → "reussi"
    ├─ Booking confirmée pour le tuteur
    ├─ Argent débité d'Ahmed
    ├─ Crédité au compte escrow du tuteur

24. Ahmed peut laisser un avis:
    ├─ Clique "Laisser un avis"
    ├─ Notation: 5 étoiles ⭐⭐⭐⭐⭐
    ├─ Commentaire: "Excellent tuteur, très patient!"
    ├─ POST /api/reviews

25. Note du tuteur mise à jour:
    ├─ Sera en version 1.1
    ├─ noteMoyenne = (4.8 * 12 + 5) / 13 = 4.82

**Résultat:** Ahmed a réservé, payé et évalué sa première séance! 🎉

---

### FLOW 2: Candidature Tuteur & Activation

**Titre:** Un nouveau tuteur soumet sa candidature et devient tuteur actif

**Acteurs:** Dr. Sidy (tuteur candidat), Admin Khadim

**Scenario:**

```
1. Dr. Sidy visite /devenir-tuteur
   └─ Voit formulaire "Candidature Tuteur"

2. Remplit le formulaire:
   ├─ Nom: Sidy Fall
   ├─ Email: sidy.fall@email.com
   ├─ Téléphone: +221771234567
   ├─ Expériences: "20 ans professeur lycée"
   ├─ Qualifications: "Licence Mathématiques, Master en didactique"
   ├─ Spécialités: "Mats, Physique, Chimie"
   └─ Upload CV (PDF)

3. POST /api/recruitment/postuler
   Backend:
   ├─ Crée TutorApplication
   ├─ Stocke document en S3
   ├─ Statut: "en_attente"
   ├─ Envoie email à admin
   └─ Retourne confirmation

4. Dr. Sidy voit: "Candidature reçue! L'admin vous reviendra dans 48h"

5. **Admin Khadim** (Admin Portal - /admin):
   ├─ Voit 3 candidatures en attente
   ├─ Clique sur candidature de Dr. Sidy
   ├─ Vérifie:
   │  ├─ Expériences: ✅ Qualifiée
   │  ├─ Document CV: ✅ Valide
   │  ├─ Email: ✅ Pas d'antécédents suspects
   └─ Clique "APPROUVER"

6. PATCH /api/recruitment/candidatures/{id}
   Backend:
   ├─ Statut TutorApplication → "approuvee"
   ├─ CRÉE automatiquement compte User:
   │  ├─ email: sidy.fall@email.com
   │  ├─ prenom: Sidy
   │  ├─ nom: Fall
   │  ├─ role: "tuteur"
   │  ├─ estVerifie: true ✅
   │  └─ motDePasse: random (changeable)
   ├─ Envoie email: "Bienvenue Dr. Sidy! Votre compte tuteur est activé"
   ├─ Inclut lien reset password
   └─ Retourne confirmation

7. Dr. Sidy reçoit email:
   ├─ "Candidature approuvée!"
   ├─ Clique lien "Activer votre compte"

8. Page reset password:
   ├─ Saisit nouveau motDePasse
   ├─ POST /api/users/connexion
   ├─ Reçoit JWT token
   ├─ Redirect → /tableau-de-bord

9. Dashboard tuteur:
   ├─ "Bienvenue Dr. Sidy, tuteur vérifié ✅"
   ├─ Menu:
   │  ├─ Mes cours
   │  ├─ Créer nouveau cours
   │  ├─ Mes réservations
   │  ├─ Mes gains
   │  ├─ Profil
   └─ Statistiques:
      ├─ Total réservations: 0
      ├─ Gain ce mois: 0 XOF
      ├─ Note moyenne: N/A

10. Dr. Sidy clique "Créer nouveau cours"
    └─ Formulaire:
       ├─ Titre: "Mathématiques Terminale S - Équations différentielles"
       ├─ Description: [détails du cours]
       ├─ Matière: "Mathématiques"
       ├─ Niveau: "Lycée"
       ├─ Curriculum: "Français"
       ├─ Tarif horaire: 2500 XOF
       ├─ Modalité: "En ligne et domicile"
       ├─ Ville: "Dakar"
       └─ Clique "Créer cours"

11. POST /api/courses
    Backend:
    ├─ Crée Course avec tuteurId = Dr. Sidy
    ├─ Cours est visible sur la plateforme
    └─ Retourne course créée

12. Dr. Sidy voir ses cours:
    ├─ "Mathématiques Terminale S..." créé ✅
    ├─ Status: "Actif"
    ├─ Réservations: 0
    ├─ Notes: 0

**Résultat:** Dr. Sidy est maintenant tuteur vérifié et peut recevoir des réservations! 🎓

---

### FLOW 3: Don de la Diaspora & Utilisation Bourse

**Titre:** Immigrée envoie don et étudiant utilise la bourse

**Acteurs:** Marie (diaspora), Timothée (étudiant bénéficiaire)

**Scenario:**

```
1. Marie (Canada) visite www.edukaay.com
   └─ Voit section "Soutenir l'éducation en Afrique"

2. Clique "Faire un don"
   ├─ Modal:
   │  ├─ Montant: 50000 XOF
   │  ├─ Message: "Pour l'éducation de nos jeunes!"
   │  ├─ Méthode: Wave
   │  └─ Cible: "Réservé général" (pas d'étudiant spécifique)

3. POST /api/scholarships
   Backend:
   ├─ Prépare donation
   ├─ Initie paiement Wave
   └─ Redirecte vers page paiement

4. Marie saisit code secret Wave
   └─ Paiement confirmé ✅

5. Bourse créée:
   ├─ donateurNom: "Marie Sane"
   ├─ montant: 50000 XOF
   ├─ montantRestant: 50000 XOF
   ├─ statut: "actif"

6. **Timothée** (étudiant):
   ├─ Cherche tuteur en français
   ├─ Trouve cours de Mr. Ba (2000 XOF/h)
   ├─ Réserve 1h pour samedi 15:00

7. Demande paiement affichée:
   ├─ "2000 XOF requis"
   ├─ Bouton "Payer directement" (Wave/Orange)
   ├─ Option NEW: "Utiliser une bourse disponible"

8. Timothée clique "Utiliser bourse"
   └─ Voit bourses disponibles:
      ├─ Bourse générale de Marie - 50000 XOF restants
      └─ Bourse pour études scientifiques - 30000 XOF

9. Sélectionne bourse de Marie
   ├─ Choisit montant à utiliser: 2000 XOF
   ├─ Clique "Utiliser bourse"

10. POST /api/payments (methode = bourse)
    Backend:
    ├─ Déduit 2000 XOF du montantRestant
    ├─ Crée Payment automatiquement
    ├─ montantRestant Marie: 50000 - 2000 = 48000 XOF
    ├─ Paiement marqué "reussi"
    ├─ Booking confirmée automatiquement
    └─ Argent crédité tuteur

11. Timothée reçoit:
    ├─ "Paiement via bourse de Marie Sane - Succès!"
    ├─ Seance confirmée pour samedi

12. Marie (optionnel) reçoit email:
    ├─ "Votre bourse a financé une leçon!"
    ├─ "Timothée apprend le français"
    ├─ "48000 XOF restants"

**Résultat:** Timothée a accès à l'éducation grâce à Marie! ❤️

---

### FLOW 4: Gestion Admin - Modération & Statistiques

**Titre:** Admin supervise la plateforme

**Acteurs:** Admin Khadim

**Scenario:**

```
1. Admin Khadim visite /admin
   ├─ Authentifié via JWT (role = "admin")
   └─ Dashboard principal:
      ├─ Card 1: 247 utilisateurs (150 étudiant, 60 tuteurs, 37 parents)
      ├─ Card 2: 1250 seances ce mois
      ├─ Card 3: 15M XOF en transactions
      ├─ Card 4: 8 candidatures en attente
      └─ Graphique: Croissance mensuelle

2. Clique "Tuteurs"
   └─ Tableau de tous tuteurs:
      ├─ Avatar | Nom | Email | Note moy. | Seances | Status
      ├─ Dr. Sidy | 4.8 ⭐ | 245 | ✅ Actif
      ├─ Mr. Ndiaye | 3.9 ⭐ | 89 | ✅ Actif
      ├─ Mlle Aïssa | 1.5 ⭐ | 12 | ⚠️ À surveiller
      └─ ...

3. Remarque que Mlle Aïssa a une note très basse
   └─ Clique profil
      ├─ Voit avis négatifs:
      │  ├─ "Tuteur ne s'est pas présenté" (5 fois)
      │  ├─ "Explications confuses"
      │  └─ "Pas de préparation"
      └─ Clique "Actions"

4. Options disponibles:
   ├─ Avertir tuteur (email)
   ├─ Suspendre temporaire (1-7 jours)
   ├─ Bannir définitivement
   └─ Contacter tuteur directement

5. Khadim clique "Avertir"
   └─ Email envoyé à Mlle Aïssa:
      "Votre note moyenne est en baisse. Améliorez votre qualité."

6. Clique "Candidatures en attente"
   └─ 8 nouvelles candidatures:
      ├─ Fatima Sall - Français - Approuvée ✅
      ├─ Moussa Ndiaye - Maths - Approuvée ✅
      ├─ Aissatou Kane - Arabe - REJETER ❌
      │  └─ Raison: "Expérience insuffisante"
      └─ ...

7. Traite les 8 candidatures:
   ├─ Approuve 6
   ├─ Rejette 2 (avec feedback)
   └─ 6 nouveaux tuteurs sont maintenant actifs

8. Clique "Paiements"
   └─ Tableau transactionnel:
      ├─ Date | Montant | Préstataire | Status | Commission
      ├─ 2026-04-19 | 2500 XOF | Wave | ✅ | 375 XOF
      ├─ 2026-04-19 | 5000 XOF | Orange | ✅ | 750 XOF
      ├─ 2026-04-18 | 3000 XOF | MTN | ❌ Échoué | 0 XOF
      └─ ...

9. Filtrage:
   ├─ Période: "Ce mois"
   ├─ Status: "Réussi"
   ├─ Montant min: 1000, max: 10000
   └─ Résultats: 234 paiements, 5.8M XOF

10. Clique "Rapports"
    └─ Génère rapport PDF:
       ├─ Nombre de seances: 1250
       ├─ Montant total: 15M XOF
       ├─ Commission EduKaay: 2.25M XOF (15%)
       ├─ Tuteur moyen gagne: 165K XOF/mois
       ├─ Satisfaction moyenne: 4.6/5
       └─ Téléchargeable

**Résultat:** Admin a full control et visibility sur la plateforme 📊

---

## 🔄 FLUX DE PAIEMENT DÉTAILLÉ

### Étapes du paiement Wave

```
1. INITIATION
   POST /api/payments/initier
   ├─ Étudiant sélectionne Wave
   ├─ Backend appelle Wave API
   └─ Reçoit URL de paiement

2. REDIRECTION
   Frontend: window.location.href = urlWave
   └─ Utilisateur redirigé vers page Wave Sandbox

3. AUTH UTILISATEUR
   Utilisateur saisit:
   ├─ Numéro de téléphone
   ├─ Code secret
   └─ Confirme paiement

4. WEBHOOK
   Wave → Backend /api/payments/webhook
   ├─ référence: payment_id
   ├─ statut: "success"
   ├─ transactionId: "wave_abc123"

5. BACKEND MET À JOUR
   ├─ Payment.statut = "reussi"
   ├─ Booking.statut = "confirmee"
   ├─ Notification envoyée
   └─ Email de confirmation

6. REDIRECTION UTILISATEUR
   Frontend redirect: /paiement/succes?ref=...
   ├─ Affiche "Paiement réussi!"
   ├─ Détails transaction
   ├─ Bouton "Retour au dashboard"
```

---

## 🎯 CAS D'ERREUR & RECOVERY

### Erreur 1: Réservation mais tuteur refuse

```
1. Étudiant réserve cours
2. Tuteur refuse ou n'accepte pas dans 24h
3. Statut remain "en_attente"
4. Étudiant notifié: "Tuteur n'a pas confirmé"
5. Options:
   ├─ Choisir autre tuteur
   ├─ Proposer nouvelle date au même tuteur
   └─ Annuler réservation
6. Statut mis à jour → "annulee"
```

### Erreur 2: Paiement Wave échoué

```
1. Paiement initié
2. Wave webhook retourne: status = "failed"
3. Payment.statut = "echoue"
4. Booking reste "confirmee" (pas encore payé)
5. Étudiant notifié: "Paiement échoué, veuillez réessayer"
6. Options:
   ├─ Réessayer Wave
   ├─ Essayer Orange Money
   ├─ Utiliser une bourse
   └─ Demander délai de paiement (admin)
```

### Erreur 3: Seance non validée par famille (contestée)

```
1. Tuteur marque seance "terminee"
2. Famille reçoit notification
3. Famille conteste: "Tuteur n'a pas fait le travail"
4. familyValidationStatus = "contestee"
5. Notes dans familyValidationNote
6. Admin notifié pour arbitrage
7. Admin vérifie avec tuteur et étudiant
8. Décision:
   ├─ Remboursement complet à étudiant ← Validation rejetée
   ├─ Paiement au tuteur maintenu ← Validation acceptée
   └─ Paiement partagé ← Accord miparti
```

---

## 📲 NOTIFICATIONS & ÉVÉNEMENTS TEMPS RÉEL

### Socket.IO Events

```javascript
// Tuteur rejoint la salle attente
socket.on('tuteur_rejoint_attente', { tuteurId, nomTuteur });

// Notification: nouvelle réservation pour tuteur
socket.emit('nouvelle_reservation', { 
  etudiant: "Ahmed",
  cours: "Maths",
  date: "2026-04-25 15:30"
});

// Notification: tuteur a confirmé
socket.emit('tuteur_confirme', { 
  lienZoom: "https://zoom.us/...",
  tuteur: "Dr. Sidy"
});

// Notification: paiement réussi
socket.emit('paiement_reussi', { 
  montant: 2500,
  tuteur: "Dr. Sidy"
});

// Chat en direct
socket.on('message_cours', { 
  salleId, 
  message, 
  from: "Ahmed"
});
socket.emit('nouveau_message', { from, message, timestamp });
```

---

## 📊 QUESTIONS MÉTIER FRÉQUENTES

**Q: Combien de temps tuteur a pour confirmer?**
A: Idéalement 24h (à configurer). Au-delà, réservation auto-annulée.

**Q: Commission EduKaay sur paiement?**
A: 15% par défaut (configurable par admin).

**Q: Tuteur peut modifier son tarif?**
A: Oui, mais change seulement pour les futurs cours.

**Q: Multi-seances possibles?**
A: Pas encore. V1.1: packages de 5/10/20 seances avec réduction.

**Q: Tuteur peut refuser un paiement reçu?**
A: Seulement via admin pour contestation. Sinon: paiement capté.

**Q: Taux de conversion Forex?**
A: Fixe 1 XOF = 1 XOF. Futur: rates dynamiques pour devises internationales.

---

**Document généré pour Claude - Cas d'usage & Flux détaillés**
**Dernière mise à jour:** 19 Avril 2026
