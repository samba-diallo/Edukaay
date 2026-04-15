/**
 * Tests unitaires — Controleur Cours
 *
 * Couvre : creerCours, rechercherCours, getCoursParId
 */

jest.mock('../../models', () => ({
  Course: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  User: {},
  Review: {},
}));

const { creerCours, rechercherCours, getCoursParId } = require('../../controllers/courseController');
const { Course } = require('../../models');
const { Op } = require('sequelize');

function creerReqRes(body = {}, params = {}, query = {}, user = null) {
  const req = { body, params, query, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

// ---------------------------------------------------------------------------
// CREER COURS
// ---------------------------------------------------------------------------
describe('creerCours()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cree un cours et l\'associe au tuteur connecte', async () => {
    const coursMock = {
      id: 'cours-1',
      titre: 'Mathematiques Terminale',
      tuteurId: 'tuteur-1',
    };
    Course.create.mockResolvedValue(coursMock);

    const { req, res } = creerReqRes(
      {
        titre: 'Mathematiques Terminale',
        description: 'Revision complète du programme',
        matiere: 'Mathématiques',
        niveau: 'Terminale',
        tarifHoraire: 5000,
        modalite: 'en_ligne',
      },
      {}, {}, { id: 'tuteur-1' }
    );

    await creerCours(req, res);

    expect(Course.create).toHaveBeenCalledWith(
      expect.objectContaining({ tuteurId: 'tuteur-1' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    Course.create.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes({}, {}, {}, { id: 'tuteur-1' });

    await creerCours(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// RECHERCHER COURS
// ---------------------------------------------------------------------------
describe('rechercherCours()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne tous les cours actifs sans filtres', async () => {
    Course.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    const { req, res } = creerReqRes({}, {}, {});

    await rechercherCours(req, res);

    const whereClause = Course.findAndCountAll.mock.calls[0][0].where;
    expect(whereClause.estActif).toBe(true);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ total: 0 }));
  });

  it('applique le filtre matiere si fourni', async () => {
    Course.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    const { req, res } = creerReqRes({}, {}, { matiere: 'Physique' });

    await rechercherCours(req, res);

    const whereClause = Course.findAndCountAll.mock.calls[0][0].where;
    expect(whereClause.matiere).toBe('Physique');
  });

  it('applique le filtre de tarif min/max', async () => {
    Course.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    const { req, res } = creerReqRes({}, {}, { minTarif: '2000', maxTarif: '8000' });

    await rechercherCours(req, res);

    const whereClause = Course.findAndCountAll.mock.calls[0][0].where;
    expect(whereClause.tarifHoraire).toBeDefined();
  });

  it('calcule correctement le nombre de pages', async () => {
    Course.findAndCountAll.mockResolvedValue({ rows: [], count: 45 });

    const { req, res } = creerReqRes({}, {}, { limit: '10' });

    await rechercherCours(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalPages: 5 })
    );
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    Course.findAndCountAll.mockRejectedValue(new Error('Timeout'));

    const { req, res } = creerReqRes();

    await rechercherCours(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// GET COURS PAR ID
// ---------------------------------------------------------------------------
describe('getCoursParId()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne le cours avec le profil du tuteur et les avis', async () => {
    const coursMock = { id: 'cours-1', titre: 'SVT Seconde', noteMoyenne: 4.5 };
    Course.findByPk.mockResolvedValue(coursMock);

    const { req, res } = creerReqRes({}, { id: 'cours-1' });

    await getCoursParId(req, res);

    expect(res.json).toHaveBeenCalledWith({ cours: coursMock });
  });

  it('retourne 404 si le cours n\'existe pas', async () => {
    Course.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({}, { id: 'inexistant' });

    await getCoursParId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    Course.findByPk.mockRejectedValue(new Error('Erreur'));

    const { req, res } = creerReqRes({}, { id: 'cours-1' });

    await getCoursParId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
