/**
 * Tests unitaires — Controleur Avis
 *
 * Couvre : creerAvis()
 * Verifie les regles metier : cours doit exister, etudiant doit avoir suivi le cours,
 * la note moyenne doit etre recalculee apres un nouvel avis.
 */

jest.mock('../../models', () => ({
  Review: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  Course: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  Booking: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../config/database', () => ({
  sequelize: {
    fn: jest.fn((fn, col) => `${fn}(${col})`),
    col: jest.fn((col) => col),
  },
}));

const { creerAvis } = require('../../controllers/reviewController');
const { Review, Course, Booking } = require('../../models');

function creerReqRes(body = {}, params = {}, user = null) {
  const req = { body, params, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

// ---------------------------------------------------------------------------
// CREER AVIS
// ---------------------------------------------------------------------------
describe('creerAvis()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cree un avis et recalcule la note moyenne du cours', async () => {
    Course.findByPk.mockResolvedValue({ id: 'cours-1', tuteurId: 'tuteur-1' });
    Booking.findOne.mockResolvedValue({ id: 'resa-1', statut: 'terminee' });
    Review.create.mockResolvedValue({ id: 'avis-1', note: 4 });
    Review.findOne.mockResolvedValue({ moyenne: '4.50', total: '3' });
    Course.update.mockResolvedValue([1]);

    const { req, res } = creerReqRes(
      { coursId: 'cours-1', note: 4, commentaire: 'Tres bon tuteur' },
      {},
      { id: 'etudiant-1' }
    );

    await creerAvis(req, res);

    expect(Review.create).toHaveBeenCalledWith(
      expect.objectContaining({ etudiantId: 'etudiant-1', note: 4 })
    );
    expect(Course.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('retourne 404 si le cours n\'existe pas', async () => {
    Course.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({ coursId: 'inexistant', note: 5 }, {}, { id: 'etudiant-1' });

    await creerAvis(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(Review.create).not.toHaveBeenCalled();
  });

  it('retourne 403 si l\'etudiant n\'a pas suivi ce cours', async () => {
    Course.findByPk.mockResolvedValue({ id: 'cours-1', tuteurId: 'tuteur-1' });
    Booking.findOne.mockResolvedValue(null); // Aucune reservation terminee

    const { req, res } = creerReqRes(
      { coursId: 'cours-1', note: 5 },
      {}, { id: 'etudiant-1' }
    );

    await creerAvis(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(Review.create).not.toHaveBeenCalled();
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    Course.findByPk.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes({ coursId: 'cours-1', note: 4 }, {}, { id: 'etudiant-1' });

    await creerAvis(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
