/**
 * Tests unitaires — Controleur Utilisateur
 *
 * Couvre les fonctions : inscription, connexion, getProfil, updateProfil, listerTuteurs
 * Les modeles Sequelize sont mockes pour isoler la logique metier.
 */

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token_jwt_test'),
}));

const { inscription, connexion, getProfil, updateProfil, listerTuteurs } = require('../../controllers/userController');
const { User } = require('../../models');

/** Fabrique un objet req/res Express simplifie */
function creerReqRes(body = {}, params = {}, query = {}, user = null) {
  const req = { body, params, query, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

// ---------------------------------------------------------------------------
// INSCRIPTION
// ---------------------------------------------------------------------------
describe('inscription()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cree un utilisateur et retourne un token si les donnees sont valides', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 'uuid-1',
      prenom: 'Moussa',
      nom: 'Diallo',
      email: 'moussa@test.com',
      role: 'etudiant',
    });

    const { req, res } = creerReqRes({
      prenom: 'Moussa',
      nom: 'Diallo',
      email: 'moussa@test.com',
      telephone: '+221771234567',
      motDePasse: 'Secret123!',
      role: 'etudiant',
    });

    await inscription(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'token_jwt_test' })
    );
  });

  it('retourne 400 si l\'email est deja utilise', async () => {
    User.findOne.mockResolvedValue({ id: 'existing' });

    const { req, res } = creerReqRes({ email: 'existant@test.com' });

    await inscription(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('email') })
    );
  });

  it('retourne 500 si la base de donnees echoue', async () => {
    User.findOne.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes({ email: 'test@test.com' });

    await inscription(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// CONNEXION
// ---------------------------------------------------------------------------
describe('connexion()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne un token si les identifiants sont corrects', async () => {
    const utilisateurMock = {
      id: 'uuid-1',
      prenom: 'Aminata',
      nom: 'Sow',
      email: 'aminata@test.com',
      role: 'tuteur',
      verifierMotDePasse: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(utilisateurMock);

    const { req, res } = creerReqRes({
      email: 'aminata@test.com',
      motDePasse: 'MotDePasse123!',
    });

    await connexion(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'token_jwt_test' })
    );
  });

  it('retourne 401 si l\'utilisateur est introuvable', async () => {
    User.findOne.mockResolvedValue(null);

    const { req, res } = creerReqRes({
      email: 'inconnu@test.com',
      motDePasse: 'n\'importequoi',
    });

    await connexion(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retourne 401 si le mot de passe est incorrect', async () => {
    const utilisateurMock = {
      id: 'uuid-1',
      verifierMotDePasse: jest.fn().mockResolvedValue(false),
    };
    User.findOne.mockResolvedValue(utilisateurMock);

    const { req, res } = creerReqRes({
      email: 'aminata@test.com',
      motDePasse: 'mauvais_mdp',
    });

    await connexion(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retourne 500 en cas d\'erreur interne', async () => {
    User.findOne.mockRejectedValue(new Error('Timeout DB'));

    const { req, res } = creerReqRes({ email: 'a@b.com', motDePasse: 'x' });

    await connexion(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// GET PROFIL
// ---------------------------------------------------------------------------
describe('getProfil()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne le profil de l\'utilisateur connecte (sans mot de passe)', async () => {
    const utilisateurMock = {
      id: 'uuid-1',
      prenom: 'Cheikh',
      email: 'cheikh@test.com',
    };
    User.findByPk.mockResolvedValue(utilisateurMock);

    const { req, res } = creerReqRes({}, {}, {}, { id: 'uuid-1' });

    await getProfil(req, res);

    expect(res.json).toHaveBeenCalledWith({ utilisateur: utilisateurMock });
  });

  it('retourne 500 si la requete echoue', async () => {
    User.findByPk.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes({}, {}, {}, { id: 'uuid-1' });

    await getProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// UPDATE PROFIL
// ---------------------------------------------------------------------------
describe('updateProfil()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('met a jour uniquement les champs autorises', async () => {
    const utilisateurMaj = { id: 'uuid-1', prenom: 'Ibrahim', ville: 'Dakar' };
    User.update.mockResolvedValue([1]);
    User.findByPk.mockResolvedValue(utilisateurMaj);

    const { req, res } = creerReqRes(
      { prenom: 'Ibrahim', ville: 'Dakar', motDePasse: 'tentative_hack' },
      {}, {}, { id: 'uuid-1' }
    );

    await updateProfil(req, res);

    // Le mot de passe ne doit pas etre transmis a User.update
    const appel = User.update.mock.calls[0][0];
    expect(appel).not.toHaveProperty('motDePasse');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ utilisateur: utilisateurMaj }));
  });
});

// ---------------------------------------------------------------------------
// LISTER TUTEURS
// ---------------------------------------------------------------------------
describe('listerTuteurs()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne une liste paginee de tuteurs', async () => {
    User.findAndCountAll.mockResolvedValue({
      rows: [{ id: 'uuid-t1', prenom: 'Fatou', role: 'tuteur' }],
      count: 1,
    });

    const { req, res } = creerReqRes({}, {}, { page: '1', limit: '10' });

    await listerTuteurs(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 1,
        page: 1,
        totalPages: 1,
      })
    );
  });

  it('filtre par ville si le parametre est fourni', async () => {
    User.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    const { req, res } = creerReqRes({}, {}, { ville: 'Saint-Louis' });

    await listerTuteurs(req, res);

    const whereClause = User.findAndCountAll.mock.calls[0][0].where;
    expect(whereClause.ville).toBe('Saint-Louis');
  });

  it('retourne 500 en cas d\'erreur DB', async () => {
    User.findAndCountAll.mockRejectedValue(new Error('Erreur DB'));

    const { req, res } = creerReqRes();

    await listerTuteurs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
