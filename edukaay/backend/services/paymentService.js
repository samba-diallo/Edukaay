/**
 * Service de Paiement
 * Abstraction pour les différents fournisseurs Mobile Money
 * Supporte Wave, Orange Money et MTN MoMo
 */
const axios = require('axios');

/**
 * Traite un paiement selon la méthode choisie
 * @param {Object} options - {methode, montant, telephone, reference}
 * @returns {Promise<Object>} Résultat contenant referenceExterne et urlRedirection
 */
async function traiterPaiement({ methode, montant, telephone, reference }) {
  switch (methode) {
    case 'wave':
      return initierWave(montant, telephone, reference);
    case 'orange_money':
      return initierOrangeMoney(montant, telephone, reference);
    case 'mtn_momo':
      return initierMTNMomo(montant, telephone, reference);
    default:
      throw new Error(`Méthode de paiement non supportée: ${methode}`);
  }
}

/**
 * Initie un paiement via Wave Business API
 * @see https://docs.wave.com/business-api
 * @param {number} montant - Montant en XOF
 * @param {string} telephone - Numéro de téléphone du payeur
 * @param {string} reference - Référence interne du paiement
 * @returns {Promise<Object>} {referenceExterne, urlRedirection}
 */
async function initierWave(montant, telephone, reference) {
  try {
    const response = await axios.post(
      `${process.env.WAVE_BASE_URL}/checkout/sessions`,
      {
        amount: montant,
        currency: 'XOF',
        client_reference: reference,
        success_url: `${process.env.FRONTEND_URL}/paiement/succes?ref=${reference}`,
        error_url: `${process.env.FRONTEND_URL}/paiement/echec?ref=${reference}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      referenceExterne: response.data.id,
      urlRedirection: response.data.wave_launch_url,
    };
  } catch (error) {
    console.error('Erreur Wave:', error.response?.data || error.message);
    throw new Error('Échec de l\'initiation du paiement Wave');
  }
}

/**
 * Initie un paiement via Orange Money Web Payment API
 * @see https://developer.orange.com/apis/om-webpay
 * @param {number} montant - Montant en XOF
 * @param {string} telephone - Numéro de téléphone du payeur
 * @param {string} reference - Référence interne du paiement
 * @returns {Promise<Object>} {referenceExterne, urlRedirection}
 */
async function initierOrangeMoney(montant, telephone, reference) {
  try {
    // Étape 1 : Obtenir un token d'accès
    const authResponse = await axios.post(
      `${process.env.OM_BASE_URL}/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.OM_CLIENT_ID}:${process.env.OM_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Étape 2 : Initier la transaction
    const payResponse = await axios.post(
      `${process.env.OM_BASE_URL}/webpayment`,
      {
        merchant_key: process.env.OM_CLIENT_ID,
        currency: 'XOF',
        order_id: reference,
        amount: montant,
        return_url: `${process.env.FRONTEND_URL}/paiement/succes`,
        cancel_url: `${process.env.FRONTEND_URL}/paiement/echec`,
        notif_url: `${process.env.FRONTEND_URL}/api/payments/webhook`,
      },
      {
        headers: {
          Authorization: `Bearer ${authResponse.data.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      referenceExterne: payResponse.data.pay_token,
      urlRedirection: payResponse.data.payment_url,
    };
  } catch (error) {
    console.error('Erreur Orange Money:', error.response?.data || error.message);
    throw new Error('Échec de l\'initiation du paiement Orange Money');
  }
}

/**
 * Initie un paiement via MTN MoMo Collections API
 * @see https://momodeveloper.mtn.com/api-documentation
 * @param {number} montant - Montant en XOF
 * @param {string} telephone - Numéro de téléphone du payeur
 * @param {string} reference - Référence interne du paiement
 * @returns {Promise<Object>} {referenceExterne}
 */
async function initierMTNMomo(montant, telephone, reference) {
  try {
    const response = await axios.post(
      `${process.env.MTN_BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount: montant.toString(),
        currency: 'XOF',
        externalId: reference,
        payer: { partyIdType: 'MSISDN', partyId: telephone },
        payerMessage: 'Paiement EduKaay',
        payeeNote: `Cours réservation ${reference}`,
      },
      {
        headers: {
          'X-Reference-Id': reference,
          'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
          Authorization: `Bearer ${process.env.MTN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      referenceExterne: reference,
      message: 'Veuillez confirmer le paiement sur votre téléphone',
    };
  } catch (error) {
    console.error('Erreur MTN MoMo:', error.response?.data || error.message);
    throw new Error('Échec de l\'initiation du paiement MTN MoMo');
  }
}

module.exports = { traiterPaiement };
