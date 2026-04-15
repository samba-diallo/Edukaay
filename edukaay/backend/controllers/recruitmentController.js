/**
 * Contrôleur Recrutement Tuteurs
 * Gère les candidatures pour devenir tuteur sur EduKaay
 */
const { TutorApplication } = require('../models');

/**
 * Soumet une candidature tuteur (accessible sans compte)
 * @param {Object} req - body: {prenom, nom, dateNaissance, telephone, email, niveauEtude, matieres, message}
 *                       file: document PDF (optionnel)
 */
async function soumettreCandidat(req, res) {
  try {
    const { prenom, nom, dateNaissance, telephone, email, niveauEtude, matieres, message } = req.body;

    if (!prenom || !nom || !dateNaissance || !telephone || !email || !niveauEtude || !matieres) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
    }

    // Vérifie si une candidature existe déjà pour cet email
    const existing = await TutorApplication.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Une candidature existe déjà pour cet email.' });
    }

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const candidature = await TutorApplication.create({
      prenom,
      nom,
      dateNaissance,
      telephone,
      email,
      niveauEtude,
      matieres,
      message: message || null,
      documentUrl,
      statut: 'en_attente',
    });

    res.status(201).json({
      message: 'Candidature soumise avec succès. Nous vous contacterons dans les 48h.',
      id: candidature.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la soumission', details: error.message });
  }
}

/**
 * Liste toutes les candidatures (admin uniquement)
 * Filtre optionnel par statut : ?statut=en_attente|approuvee|rejetee
 */
async function listerCandidatures(req, res) {
  try {
    const { statut } = req.query;
    const where = statut ? { statut } : {};

    const candidatures = await TutorApplication.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ total: candidatures.length, candidatures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération', details: error.message });
  }
}

/**
 * Valide ou rejette une candidature (admin uniquement)
 * @param {Object} req - params.id, body: {statut: 'approuvee'|'rejetee', noteAdmin}
 */
async function traiterCandidature(req, res) {
  try {
    const { statut, noteAdmin } = req.body;

    if (!['approuvee', 'rejetee'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide. Valeurs acceptées : approuvee, rejetee' });
    }

    const candidature = await TutorApplication.findByPk(req.params.id);
    if (!candidature) {
      return res.status(404).json({ error: 'Candidature non trouvée' });
    }

    candidature.statut = statut;
    if (noteAdmin) candidature.noteAdmin = noteAdmin;
    await candidature.save();

    res.json({
      message: `Candidature ${statut === 'approuvee' ? 'approuvée' : 'rejetée'} avec succès.`,
      candidature,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du traitement', details: error.message });
  }
}

module.exports = { soumettreCandidat, listerCandidatures, traiterCandidature };
