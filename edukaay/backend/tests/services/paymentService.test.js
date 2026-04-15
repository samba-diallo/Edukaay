/**
 * Tests unitaires — Service de Paiement
 *
 * Couvre : traiterPaiement() et le routage vers les bons fournisseurs.
 * Les appels HTTP (axios) sont mockes pour ne pas appeler de vraies API.
 */

jest.mock('axios');
const axios = require('axios');
const { traiterPaiement } = require('../../services/paymentService');

beforeAll(() => {
  // Variables d'environnement minimales pour les tests
  process.env.WAVE_BASE_URL = 'https://api.wave.test';
  process.env.WAVE_API_KEY = 'wave_key_test';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.OM_BASE_URL = 'https://api.om.test';
  process.env.OM_CLIENT_ID = 'om_id_test';
  process.env.OM_CLIENT_SECRET = 'om_secret_test';
  process.env.MTN_BASE_URL = 'https://api.mtn.test';
  process.env.MTN_SUBSCRIPTION_KEY = 'mtn_sub_test';
  process.env.MTN_API_KEY = 'mtn_key_test';
});

beforeEach(() => jest.clearAllMocks());

// ---------------------------------------------------------------------------
// ROUTAGE DES METHODES DE PAIEMENT
// ---------------------------------------------------------------------------
describe('traiterPaiement() — routage', () => {
  it('rejette une methode de paiement non supportee', async () => {
    await expect(
      traiterPaiement({ methode: 'bitcoin', montant: 5000, telephone: '+221700000000', reference: 'ref-1' })
    ).rejects.toThrow('non supportée');
  });
});

// ---------------------------------------------------------------------------
// WAVE
// ---------------------------------------------------------------------------
describe('traiterPaiement() avec Wave', () => {
  it('retourne la reference externe et l\'URL de redirection', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        id: 'wave_session_abc',
        wave_launch_url: 'https://wave.sn/pay/abc',
      },
    });

    const resultat = await traiterPaiement({
      methode: 'wave',
      montant: 5000,
      telephone: '+221771234567',
      reference: 'resa-1',
    });

    expect(resultat.referenceExterne).toBe('wave_session_abc');
    expect(resultat.urlRedirection).toBe('https://wave.sn/pay/abc');
  });

  it('leve une erreur si l\'API Wave echoue', async () => {
    axios.post.mockRejectedValueOnce(new Error('Reseau inaccessible'));

    await expect(
      traiterPaiement({ methode: 'wave', montant: 5000, telephone: '+221700000000', reference: 'ref-1' })
    ).rejects.toThrow('Wave');
  });
});

// ---------------------------------------------------------------------------
// MTN MOMO
// ---------------------------------------------------------------------------
describe('traiterPaiement() avec MTN MoMo', () => {
  it('retourne la reference du paiement comme referenceExterne', async () => {
    axios.post.mockResolvedValueOnce({ data: { status: 202 } });

    const resultat = await traiterPaiement({
      methode: 'mtn_momo',
      montant: 3000,
      telephone: '+22361234567',
      reference: 'resa-mtn-1',
    });

    expect(resultat.referenceExterne).toBe('resa-mtn-1');
  });

  it('leve une erreur si l\'API MTN echoue', async () => {
    axios.post.mockRejectedValueOnce(new Error('API indisponible'));

    await expect(
      traiterPaiement({ methode: 'mtn_momo', montant: 3000, telephone: '+22300000000', reference: 'ref-1' })
    ).rejects.toThrow('MTN');
  });
});

// ---------------------------------------------------------------------------
// ORANGE MONEY
// ---------------------------------------------------------------------------
describe('traiterPaiement() avec Orange Money', () => {
  it('retourne le pay_token et l\'URL de paiement', async () => {
    // Appel 1 : obtenir le token d'acces OAuth
    axios.post.mockResolvedValueOnce({ data: { access_token: 'om_access_tok' } });
    // Appel 2 : initier le paiement
    axios.post.mockResolvedValueOnce({
      data: {
        pay_token: 'om_pay_token_xyz',
        payment_url: 'https://orange.sn/pay/xyz',
      },
    });

    const resultat = await traiterPaiement({
      methode: 'orange_money',
      montant: 4000,
      telephone: '+221771234567',
      reference: 'resa-om-1',
    });

    expect(resultat.referenceExterne).toBe('om_pay_token_xyz');
    expect(resultat.urlRedirection).toBe('https://orange.sn/pay/xyz');
  });

  it('leve une erreur si l\'authentification Orange Money echoue', async () => {
    axios.post.mockRejectedValueOnce(new Error('401 Unauthorized'));

    await expect(
      traiterPaiement({ methode: 'orange_money', montant: 4000, telephone: '+221700000000', reference: 'ref-1' })
    ).rejects.toThrow('Orange Money');
  });
});
