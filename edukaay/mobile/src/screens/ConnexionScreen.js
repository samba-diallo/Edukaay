/**
 * Écran de connexion mobile
 * Formulaire d'authentification adapté au mobile
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ConnexionScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleConnexion() {
    setChargement(true);
    try {
      const response = await api.post('/users/connexion', { email, motDePasse });
      await AsyncStorage.setItem('edukaay_token', response.data.token);
      await AsyncStorage.setItem('edukaay_user', JSON.stringify(response.data.utilisateur));
      navigation.replace('Principal');
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || 'Connexion impossible');
    } finally {
      setChargement(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Edu<Text style={styles.logoAccent}>Kaay</Text></Text>
      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleConnexion} disabled={chargement}>
        <Text style={styles.buttonText}>{chargement ? 'Connexion...' : 'Se connecter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#0F7B6C', textAlign: 'center', marginBottom: 8 },
  logoAccent: { color: '#D4AF37' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E5E5' },
  button: { backgroundColor: '#0F7B6C', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#0F7B6C', fontSize: 14 },
});
