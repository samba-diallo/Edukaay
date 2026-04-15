/**
 * Tests unitaires — Controleur Recrutement Tuteurs
 *
 * Couvre : soumettreCandidat, listerCandidatures, traiterCandidature
 */

jest.mock('../../models', () => ({
  TutorApplication: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const {
  soumettreCandidat,
  listerCandidatures,
  traiterCandidature,
} = require('../../controllers/recruitmentController');
const { TutorApplication } = require('../../models');

function creerReqRes(body = {}, params = {}, query = {}, user = null, file = null) {
  const req = { body, params, query, user, file };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

/** Donnees valides pour une candidature */
const candidatureValide = {
  prenom: 'Ibrahima',
  nom: 'Fall',
  dateNaissance: '1998-03-15',
  telephone: '+221771234567',
  email: 'ibrahima@test.com',
  niveauEtude: 'Licence',
  matieres: 'Mathematiques, Physique',
};

// ---------------------------------------------------------------------------
// SOUMETTRE CANDIDAT
// ---------------------------------------------------------------------------
describe('soumettreCandidat()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cree une candidature avec les donnees valides', async () => {
    TutorApplication.findOne.mockResolvedValue(null);
    TutorApplication.create.mockResolvedValue({ id: 'cand-1', statut: 'en_attente' });

    const { req, res } = creerReqRes(candidatureValide);

    await soumettreCandidat(req, res);

    expect(TutorApplication.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('enregistre l\'URL du document PDF si un fichier est uploade', async () => {
    TutorApplication.findOne.mockResolvedValue(null);
    TutorApplication.create.mockResolvedValue({ id: 'cand-1' });

    const { req, res } = creerReqRes(
      candidatureValide,
      {}, {}, null,
      { filename: 'cv_ibrahima.pdf' }
    );

    await soumettreCandidat(req, res);

    const appel = TutorApplication.create.mock.calls[0][0];
    expect(appel.documentUrl).toBe('/uploads/cv_ibrahima.pdf');
  });

  it('retourne 409 si l\'email a deja une candidature', async () => {
    TutorApplication.findOne.mockResolvedValue({ id: 'existant' });

    const { req, res } = creerReqRes(candidatureValide);

    await soumettreCandidat(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(TutorApplication.create).not.toHaveBeenCalled();
  });

  it('retourne 400 si des champs obligatoires sont manquants', async () => {
    const { req, res } = creerReqRes({ prenom: 'Ibrahima' }); // champs incomplets

    await soumettreCandidat(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(TutorApplication.create).not.toHaveBeenCalled();
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    TutorApplication.findOne.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes(candidatureValide);

    await soumettreCandidat(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// LISTER CANDIDATURES
// ---------------------------------------------------------------------------
describe('listerCandidatures()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne toutes les candidatures sans filtre', async () => {
    TutorApplication.findAll.mockResolvedValue([
      { id: 'cand-1', statut: 'en_attente' },
      { id: 'cand-2', statut: 'approuvee' },
    ]);

    const { req, res } = creerReqRes({}, {}, {});

    await listerCandidatures(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ total: 2 })
    );
  });

  it('filtre par statut si le parametre est fourni', async () => {
    TutorApplication.findAll.mockResolvedValue([]);

    const { req, res } = creerReqRes({}, {}, { statut: 'en_attente' });

    await listerCandidatures(req, res);

    const whereClause = TutorApplication.findAll.mock.calls[0][0].where;
    expect(whereClause.statut).toBe('en_attente');
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    TutorApplication.findAll.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes();

    await listerCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// TRAITER CANDIDATURE
// ---------------------------------------------------------------------------
describe('traiterCandidature()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('approuve une candidature et enregistre la note admin', async () => {
    const candidatureMock = {
      id: 'cand-1',
      statut: 'en_attente',
      save: jest.fn().mockResolvedValue(true),
    };
    TutorApplication.findByPk.mockResolvedValue(candidatureMock);

    const { req, res } = creerReqRes(
      { statut: 'approuvee', noteAdmin: 'Profil excellent' },
      { id: 'cand-1' }
    );

    await traiterCandidature(req, res);

    expect(candidatureMock.statut).toBe('approuvee');
    expect(candidatureMock.noteAdmin).toBe('Profil excellent');
    expect(candidatureMock.save).toHaveBeenCalled();
  });

  it('rejette une candidature', async () => {
    const candidatureMock = {
      id: 'cand-1',
      statut: 'en_attente',
      save: jest.fn().mockResolvedValue(true),
    };
    TutorApplication.findByPk.mockResolvedValue(candidatureMock);

    const { req, res } = creerReqRes({ statut: 'rejetee' }, { id: 'cand-1' });

    await traiterCandidature(req, res);

    expect(candidatureMock.statut).toBe('rejetee');
  });

  it('retourne 400 si le statut est invalide', async () => {
    const { req, res } = creerReqRes({ statut: 'invalide' }, { id: 'cand-1' });

    await traiterCandidature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(TutorApplication.findByPk).not.toHaveBeenCalled();
  });

  it('retourne 404 si la candidature n\'existe pas', async () => {
    TutorApplication.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({ statut: 'approuvee' }, { id: 'inexistant' });

    await traiterCandidature(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
