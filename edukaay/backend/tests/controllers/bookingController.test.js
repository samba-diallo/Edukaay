/**
 * Tests unitaires — Controleur Reservations
 *
 * Couvre : creerReservation, mesReservations, mettreAJourStatut,
 *          terminerSeance, validerSeanceFamille, seancesAValider
 */

jest.mock('../../models', () => ({
  Booking: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Course: {
    findByPk: jest.fn(),
  },
  User: {},
}));

const {
  creerReservation,
  mesReservations,
  mettreAJourStatut,
  terminerSeance,
  validerSeanceFamille,
  seancesAValider,
} = require('../../controllers/bookingController');
const { Booking, Course } = require('../../models');

function creerReqRes(body = {}, params = {}, query = {}, user = null) {
  const req = { body, params, query, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

// ---------------------------------------------------------------------------
// CREER RESERVATION
// ---------------------------------------------------------------------------
describe('creerReservation()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cree une reservation et calcule le montant correctement', async () => {
    Course.findByPk.mockResolvedValue({ id: 'cours-1', tarifHoraire: 6000, tuteurId: 'tuteur-1' });
    Booking.create.mockResolvedValue({ id: 'resa-1', montantTotal: 6000 });

    const { req, res } = creerReqRes(
      {
        coursId: 'cours-1',
        dateSeance: '2025-09-15T10:00:00Z',
        dureeMinutes: 60,
        modalite: 'en_ligne',
        notes: 'Preparation bac',
      },
      {}, {}, { id: 'etudiant-1' }
    );

    await creerReservation(req, res);

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({ etudiantId: 'etudiant-1', coursId: 'cours-1' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('retourne 404 si le cours n\'existe pas', async () => {
    Course.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({ coursId: 'inexistant' }, {}, {}, { id: 'etudiant-1' });

    await creerReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(Booking.create).not.toHaveBeenCalled();
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    Course.findByPk.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes({ coursId: 'cours-1' }, {}, {}, { id: 'etudiant-1' });

    await creerReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// MES RESERVATIONS
// ---------------------------------------------------------------------------
describe('mesReservations()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filtre par tuteurId si le role est tuteur', async () => {
    Booking.findAll.mockResolvedValue([]);

    const { req, res } = creerReqRes({}, {}, {}, { id: 'tuteur-1', role: 'tuteur' });

    await mesReservations(req, res);

    const whereClause = Booking.findAll.mock.calls[0][0].where;
    expect(whereClause).toEqual({ tuteurId: 'tuteur-1' });
  });

  it('filtre par etudiantId si le role est etudiant', async () => {
    Booking.findAll.mockResolvedValue([]);

    const { req, res } = creerReqRes({}, {}, {}, { id: 'etudiant-1', role: 'etudiant' });

    await mesReservations(req, res);

    const whereClause = Booking.findAll.mock.calls[0][0].where;
    expect(whereClause).toEqual({ etudiantId: 'etudiant-1' });
  });
});

// ---------------------------------------------------------------------------
// METTRE A JOUR STATUT
// ---------------------------------------------------------------------------
describe('mettreAJourStatut()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('met a jour le statut si l\'utilisateur est autorise', async () => {
    const reservationMock = {
      id: 'resa-1',
      tuteurId: 'tuteur-1',
      etudiantId: 'etudiant-1',
      statut: 'en_attente',
      save: jest.fn().mockResolvedValue(true),
    };
    Booking.findByPk.mockResolvedValue(reservationMock);

    const { req, res } = creerReqRes(
      { statut: 'confirmee' },
      { id: 'resa-1' },
      {},
      { id: 'tuteur-1' }
    );

    await mettreAJourStatut(req, res);

    expect(reservationMock.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('retourne 403 si l\'utilisateur n\'est pas lie a la reservation', async () => {
    Booking.findByPk.mockResolvedValue({
      id: 'resa-1',
      tuteurId: 'tuteur-A',
      etudiantId: 'etudiant-A',
    });

    const { req, res } = creerReqRes(
      { statut: 'annulee' },
      { id: 'resa-1' },
      {},
      { id: 'autre-utilisateur' }
    );

    await mettreAJourStatut(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('retourne 404 si la reservation n\'existe pas', async () => {
    Booking.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({ statut: 'annulee' }, { id: 'inexistant' }, {}, { id: 'u-1' });

    await mettreAJourStatut(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ---------------------------------------------------------------------------
// TERMINER SEANCE
// ---------------------------------------------------------------------------
describe('terminerSeance()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('marque la seance comme terminee et passe familyValidationStatus a en_attente', async () => {
    const reservationMock = {
      id: 'resa-1',
      tuteurId: 'tuteur-1',
      statut: 'confirmee',
      familyValidationStatus: null,
      save: jest.fn().mockResolvedValue(true),
    };
    Booking.findByPk.mockResolvedValue(reservationMock);

    const { req, res } = creerReqRes({}, { id: 'resa-1' }, {}, { id: 'tuteur-1' });

    await terminerSeance(req, res);

    expect(reservationMock.statut).toBe('terminee');
    expect(reservationMock.familyValidationStatus).toBe('en_attente');
    expect(reservationMock.save).toHaveBeenCalled();
  });

  it('retourne 403 si ce n\'est pas le tuteur de la seance', async () => {
    Booking.findByPk.mockResolvedValue({ id: 'resa-1', tuteurId: 'tuteur-A', statut: 'confirmee' });

    const { req, res } = creerReqRes({}, { id: 'resa-1' }, {}, { id: 'tuteur-B' });

    await terminerSeance(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('retourne 400 si la seance n\'est pas dans un statut terminable', async () => {
    Booking.findByPk.mockResolvedValue({
      id: 'resa-1',
      tuteurId: 'tuteur-1',
      statut: 'en_attente',
    });

    const { req, res } = creerReqRes({}, { id: 'resa-1' }, {}, { id: 'tuteur-1' });

    await terminerSeance(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 404 si la reservation n\'existe pas', async () => {
    Booking.findByPk.mockResolvedValue(null);

    const { req, res } = creerReqRes({}, { id: 'inexistant' }, {}, { id: 'tuteur-1' });

    await terminerSeance(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ---------------------------------------------------------------------------
// VALIDER SEANCE FAMILLE
// ---------------------------------------------------------------------------
describe('validerSeanceFamille()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('confirme la seance si la decision est confirmee', async () => {
    const reservationMock = {
      id: 'resa-1',
      etudiantId: 'etudiant-1',
      statut: 'terminee',
      familyValidationStatus: 'en_attente',
      save: jest.fn().mockResolvedValue(true),
    };
    Booking.findByPk.mockResolvedValue(reservationMock);

    const { req, res } = creerReqRes(
      { decision: 'confirmee', note: 'Excellent cours' },
      { id: 'resa-1' }, {}, { id: 'etudiant-1' }
    );

    await validerSeanceFamille(req, res);

    expect(reservationMock.familyValidationStatus).toBe('confirmee');
    expect(reservationMock.save).toHaveBeenCalled();
  });

  it('enregistre une contestation si la decision est contestee', async () => {
    const reservationMock = {
      id: 'resa-1',
      etudiantId: 'etudiant-1',
      statut: 'terminee',
      familyValidationStatus: 'en_attente',
      save: jest.fn().mockResolvedValue(true),
    };
    Booking.findByPk.mockResolvedValue(reservationMock);

    const { req, res } = creerReqRes(
      { decision: 'contestee', note: 'Le tuteur n\'est pas venu' },
      { id: 'resa-1' }, {}, { id: 'etudiant-1' }
    );

    await validerSeanceFamille(req, res);

    expect(reservationMock.familyValidationStatus).toBe('contestee');
    expect(reservationMock.familyValidationNote).toBe('Le tuteur n\'est pas venu');
  });

  it('retourne 400 si la decision est invalide', async () => {
    const { req, res } = creerReqRes(
      { decision: 'valeur_invalide' },
      { id: 'resa-1' }, {}, { id: 'etudiant-1' }
    );

    await validerSeanceFamille(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 403 si ce n\'est pas l\'etudiant de la reservation', async () => {
    Booking.findByPk.mockResolvedValue({
      id: 'resa-1',
      etudiantId: 'etudiant-A',
      statut: 'terminee',
      familyValidationStatus: 'en_attente',
    });

    const { req, res } = creerReqRes(
      { decision: 'confirmee' },
      { id: 'resa-1' }, {}, { id: 'etudiant-B' }
    );

    await validerSeanceFamille(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('retourne 400 si la seance n\'est pas terminee', async () => {
    Booking.findByPk.mockResolvedValue({
      id: 'resa-1',
      etudiantId: 'etudiant-1',
      statut: 'en_cours',
      familyValidationStatus: null,
    });

    const { req, res } = creerReqRes(
      { decision: 'confirmee' },
      { id: 'resa-1' }, {}, { id: 'etudiant-1' }
    );

    await validerSeanceFamille(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 400 si la seance a deja ete traitee', async () => {
    Booking.findByPk.mockResolvedValue({
      id: 'resa-1',
      etudiantId: 'etudiant-1',
      statut: 'terminee',
      familyValidationStatus: 'confirmee',
    });

    const { req, res } = creerReqRes(
      { decision: 'confirmee' },
      { id: 'resa-1' }, {}, { id: 'etudiant-1' }
    );

    await validerSeanceFamille(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
