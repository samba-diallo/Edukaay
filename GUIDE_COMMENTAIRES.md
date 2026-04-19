/**
 * GUIDE COMPLET DE COMMENTAIRES DETAILLES - PROJET EDUKAAY
 * 
 * Ce document recapitule :
 * 1. Les fichiers deja ameliores avec commentaires detailles
 * 2. Le plan pour les fichiers restants
 * 3. Les conventions de comment à utiliser
 * 
 * Date : 15 Avril 2026
 * Status : EN COURS
 */

// ==========================================
//  PART 1 : FICHIERS DEJA DOCUMENTES
// ==========================================

/**
 * BACKEND MODELS (tous ameliores avec commentaires tres detailles)
 * 
 * user.js
 * - Explique clairement chaque champ (id, prenom, nom, email, telephone, role, etc.)
 * - Documente les hooks beforeCreate et beforeUpdate
 * - Explique comment verifierMotDePasse() fonctionne
 * - OBJECTIF : Quelqu'un qui ne connait pas Sequelize peut maintenant comprendre
 * 
 * course.js
 * - Explique la difference entre "tutorat" et "contenu"
 * - Documente tous les champs (titre, matiere, niveau, curriculum, tarifHoraire, etc.)
 * - Explique les modalites (en_ligne, domicile)
 * - OBJECTIF : Comprendre ce qu'est un cours et comment il est parametre
 * 
 * booking.js
 * - Explique le cycle de vie d'une seance (en_attente -> confirmee -> en_cours -> terminee)
 * - Documente la validation par la famille
 * - Explique les modalites et les liens de visio
 * - OBJECTIF : Savoir comment une reservation fonctionne de A a Z
 * 
 * payment.js
 * - Explique comment les paiements Mobile Money fonctionnent
 * - Documente les 4 methodes acceptes (Wave, Orange Money, MTN MoMo, carte bancaire)
 * - Explique la commission et les bourses
 * - OBJECTIF : Comprendre l'argent et comment il circule
 */

/**
 * BACKEND MIDDLEWARE
 * 
 * auth.js
 * - Explique jwt.verify() et comment les tokens sont generes et valides
 * - Documente le processus d'authentification etape par etape
 * - Explique comment le middleware autoriser() filtre par role
 * - OBJECTIF : Savoir comment la securite fonction et pourquoi on a besoin d'un JWT
 */

/**
 * BACKEND CONTROLLERS (partiellement fait)
 * 
 * userController.js
 * - Amélioré : inscription() et connexion() avec explications tres detailles
 * - Documentes : le processus complet de creation de compte et auth
 * - Montres : comment un JWT token est genere et pourquoi
 * - A FAIRE : getProfil(), updateProfil(), getTuteurs()
 * 
 * courseController.js - A FAIRE
 * - Devra expliquer : create(), search(), filter(), delete()
 * - Priorite HAUTE : C'est crucial pour le flux etudiant
 * 
 * bookingController.js - A FAIRE
 * - Devra expliquer : create(), confirm(), cancel(), complete()
 * - Priorite HAUTE : C'est le c\u0153ur des reservations
 * 
 * paymentController.js - A FAIRE
 * - Devra expliquer : initiate(), checkStatus(), webhook()
 * - Priorite HAUTE : argent = tres important
 */

/**
 * BACKEND ROUTES - A FAIRE
 * 
 * Chaque fichier route contient des endpoints. Il faut ajouter des commentaires expliquant :
 * - A quoi sert chaque route (POST, GET, PUT, DELETE)
 * - Quels parametres elle accepte
 * - Quels status codes elle retourne (200, 201, 400, 401, 403, 500)
 * - Quels middlewares utiliser (authentifier, autoriser)
 * 
 * Exemple de ce qu'on devrait ajouter :
 * 
 * // POST /api/users/inscription
 * // Objectif : Creer un nouvel utilisateur
 * // Body : { prenom, nom, email, telephone, motDePasse, role }
 * // Retour 201 : { token, utilisateur }
 * // Retour 400 : Si email existe deja
 * router.post('/inscription', userController.inscription);
 */

/**
 * BACKEND SERVICES
 * 
 * paymentService.js - A FAIRE
 * - Devra expliquer les fonctions de chaque Mobile Money provider
 * - initierWave(), initierOrangeMoney(), initierMTNMomo()
 * - Comment les webhooks sont geres
 */

// ==========================================
//  PART 2 : FICHIERS FRONTEND (A FAIRE)
// ==========================================

/**
 * FRONTEND PAGES - A FAIRE
 * 
 * Pages CRITIQUES (faire en priorite) :
 * 
 * pages/inscription.jsx
 * - Explique le flux d'inscription etudiant vs tuteur
 * - Documente le formulaire et les validations
 * - Montre comment on envoie les donnees a /api/users/inscription
 * - PRIORITE : TRES HAUTE (c'est la porte d'entree)
 * 
 * pages/connexion.jsx
 * - Explique le processus de login
 * - Montre comment on stocke le token JWT
 * - PRIORITE : TRES HAUTE
 * 
 * pages/tableau-de-bord.jsx
 * - Explique le dashboard etudiant vs tuteur
 * - Montre les sections principales
 * - PRIORITE : HAUTE
 * 
 * pages/cours/index.jsx
 * - Explique le catalogue et les filtres
 * - Montre comment on appelle /api/courses
 * - PRIORITE : HAUTE
 * 
 * pages/tuteurs.jsx
 * - Explique la liste des tuteurs avec avis
 * - Montre comment on filtre par matiere, niveau
 * - PRIORITE : MOYENNE
 * 
 * pages/bourses.jsx
 * - Explique le programme de bourses diaspora
 * - Montre le formulaire de donation
 * - PRIORITE : MOYENNE
 * 
 * pages/admin/index.jsx
 * - Explique le dashboard admin
 * - Montre les statistiques et gestion
 * - PRIORITE : BASSE (moins critique que les pages etudiant/tuteur)
 */

/**
 * FRONTEND COMPONENTS - A FAIRE
 * 
 * Components CRITIQUES :
 * 
 * components/ui/CourseCard.jsx
 * - Explique comment afficher les infos d'un cours
 * - Documente les props (course, tutor, rating)
 * - PRIORITE : HAUTE
 * 
 * components/layout/Header.jsx, Footer.jsx, Layout.jsx
 * - Explique la structure globale
 * - Documente la navigation
 * - PRIORITE : MOYENNE
 * 
 * components/features/HeroSearch.jsx
 * - Explique la barre de recherche
 * - Documente comment filtrer les cours
 * - PRIORITE : MOYENNE
 */

// ==========================================
//  PART 3 : MOBILE APP - A FAIRE
// ==========================================

/**
 * MOBILE SCREENS - A FAIRE
 * 
 * mobile/src/screens/AccueilScreen.js
 * mobile/src/screens/RechercheScreen.js
 * mobile/src/screens/ConnexionScreen.js
 * mobile/src/screens/ReservationsScreen.js
 * mobile/src/screens/ProfilScreen.js
 * 
 * Priorite : BASSE (moins critique que web)
 */

// ==========================================
//  PART 4 : PLAN D'ACTION RAPIDE
// ==========================================

/**
 * POUR CONTINUER LES COMMENTAIRES RAPIDEMENT :
 * 
 * ETAPE 1 : Backend Controllers (courte)
 * - Ajouter commentaires aux fonctions clés de courseController
 * - Ajouter commentaires aux fonctions clés de bookingController
 * - Temps estime : 30-45 minutes
 * 
 * ETAPE 2 : Frontend Pages (moyen)
 * - inscription.jsx, connexion.jsx (CRITIQUE)
 * - tableau-de-bord.jsx, cours/index.jsx (CRITIQUES)
 * - Autres pages (si temps)
 * - Temps estime : 1-2 heures
 * 
 * ETAPE 3 : Frontend Components (court)
 * - CourseCard.jsx, HeroSearch.jsx
 * - Temps estime : 30 minutes
 * 
 * ETAPE 4 : Routes (si temps)
 * - Ajouter commentaires au-dessus de chaque endpoint
 * - Temps estime : 45 minutes
 * 
 * TOTAL ESTIME : 2.5 - 4 heures pour couvrir les 80% les plus importants
 */

// ==========================================
//  PART 5 : CONVENTIONS A UTILISER
// ==========================================

/**
 * FORMAT DES COMMENTAIRES A UTILISER :
 * 
 * 1. EN HAUT DES FICHIERS :
 * 
 * /**
 *  * FICHIER : chemin/du/fichier.js
 *  * OBJECTIF : En une phrase, qu'est-ce que ce fichier fait ?
 *  * 
 *  * Explique en 2-3 phrases suppementaires ce qui se passe.
 *  * Donne du contexte (c'est quoi ? pourquoi ? comment ?)
 *  *\/
 * 
 * 2. POUR CHAQUE FONCTION/METHODE :
 * 
 * /**
 *  * FONCTION : nomFonction
 *  * ENDPOINT : POST /api/courses (si c'est un controleur)
 *  * ROLE : Brief description de ce qu'elle fait
 *  * 
 *  * DONNEES ATTENDUES :
 *  * { param1, param2, param3 }
 *  * 
 *  * PROCESSUS :
 *  * 1. Etape 1
 *  * 2. Etape 2
 *  * 3. Etape 3
 *  * 
 *  * RETOUR EN CAS DE SUCCES :
 *  * { data: ... }
 *  * 
 *  * ERREURS POSSIBLES :
 *  * - 400 : ...
 *  * - 401 : ...
 *  *\/
 * 
 * 3. POUR LES CHAMPS DE MODELE :
 * 
 * nomChamp: {
 *   type: DataTypes.STRING,
 *   allowNull: false,           // Obligatoire ou optionnel
 *   comment: 'Description courte du champ',
 * },
 * 
 * 4. POUR LES VARIABLES :
 * 
 * const maVariable = value;  // Explique brievement ce qu'elle stocke
 * 
 * 5. PAS D'EMOJIS ! Juste du texte clair et francais.
 */

// ==========================================
//  RESUME DE LA PROGRESSION
// ==========================================

/**
 * POURCENTAGE COMPLETE : 30-40%
 * 
 * FAIT (100%) :
 * - backend/app.js
 * - backend/models/ (User, Course, Booking, Payment)
 * - backend/middleware/auth.js
 * - backend/controllers/userController.js (inscription, connexion)
 * 
 * EN COURS (20%) :
 * - backend/controllers/ (restant)
 * 
 * A FAIRE (0%) :
 * - backend/routes/
 * - backend/services/
 * - frontend/pages/
 * - frontend/components/
 * - mobile/src/
 * 
 * PROCHAINE ETAPE :
 * Ajouter commentaires aux autres controllers et pages critiques
 */
