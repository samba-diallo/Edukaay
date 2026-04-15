/**
 * Tests unitaires — Middleware d'Authentification JWT
 *
 * Couvre : authentifier(), autoriser()
 * Le module jsonwebtoken et le modele User sont mockes.
 */

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authentifier, autoriser } = require('../../middleware/auth');

/** Fabrique req/res/next simplifies */
function creerContexte(headers = {}) {
  const req = { headers, user: null };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

// ---------------------------------------------------------------------------
// AUTHENTIFIER
// ---------------------------------------------------------------------------
describe('authentifier()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle next() et attache req.user si le token est valide', async () => {
    jwt.verify.mockReturnValue({ id: 'uuid-1', role: 'etudiant' });
    User.findByPk.mockResolvedValue({ id: 'uuid-1', estActif: true, role: 'etudiant' });

    const { req, res, next } = creerContexte({
      authorization: 'Bearer token_valide',
    });

    await authentifier(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('uuid-1');
  });

  it('retourne 401 si l\'en-tete Authorization est absent', async () => {
    const { req, res, next } = creerContexte({});

    await authentifier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le format du header n\'est pas Bearer', async () => {
    const { req, res, next } = creerContexte({ authorization: 'Basic dXNlcjpwYXNz' });

    await authentifier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le token JWT est invalide', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('Token invalide'); });

    const { req, res, next } = creerContexte({ authorization: 'Bearer mauvais_token' });

    await authentifier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si l\'utilisateur n\'existe pas en base', async () => {
    jwt.verify.mockReturnValue({ id: 'uuid-ghost', role: 'etudiant' });
    User.findByPk.mockResolvedValue(null);

    const { req, res, next } = creerContexte({ authorization: 'Bearer token_valide' });

    await authentifier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si l\'utilisateur est desactive', async () => {
    jwt.verify.mockReturnValue({ id: 'uuid-1', role: 'etudiant' });
    User.findByPk.mockResolvedValue({ id: 'uuid-1', estActif: false });

    const { req, res, next } = creerContexte({ authorization: 'Bearer token_valide' });

    await authentifier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// AUTORISER
// ---------------------------------------------------------------------------
describe('autoriser()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle next() si le role correspond', () => {
    const middleware = autoriser('admin');
    const req = { user: { role: 'admin' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('retourne 403 si le role ne correspond pas', () => {
    const middleware = autoriser('admin');
    const req = { user: { role: 'etudiant' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepte plusieurs roles autorises', () => {
    const middleware = autoriser('admin', 'tuteur');
    const req = { user: { role: 'tuteur' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
