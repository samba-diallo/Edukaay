/**
 * Client API pour l'application mobile
 * Configure Axios avec le token d'authentification
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Intercepteur : ajoute le token JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('edukaay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
