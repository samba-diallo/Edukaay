/**
 * Client API pour l'application mobile EduKaay
 *
 * Configure une instance Axios partagee par tous les ecrans.
 * Le token JWT est automatiquement injecte dans chaque requete
 * via un intercepteur de requete Axios.
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * URL de base de l'API backend.
 * Developpement  : http://localhost:5000/api
 * Production     : definir EXPO_PUBLIC_API_URL dans le fichier .env de l'app Expo.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Instance Axios configuree avec :
 * - URL de base vers le backend EduKaay
 * - En-tete Content-Type JSON par defaut
 * - Delai d'expiration de 15 secondes
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * Intercepteur de requete :
 * Recupere le token JWT depuis AsyncStorage et l'ajoute
 * a l'en-tete Authorization de chaque requete sortante.
 */
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('edukaay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
