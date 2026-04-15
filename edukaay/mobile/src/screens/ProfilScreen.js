/**
 * Écran de profil utilisateur
 * Affiche et permet de modifier les informations du profil
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilScreen({ navigation }) {
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    chargerProfil();
  }, []);

  async function chargerProfil() {
    const userData = await AsyncStorage.getItem('edukaay_user');
    if (userData) setUtilisateur(JSON.parse(userData));
  }

  async function deconnexion() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          await AsyncStorage.multiRemove(['edukaay_token', 'edukaay_user']);
          navigation.replace('Connexion');
        },
      },
    ]);
  }

  if (!utilisateur) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{utilisateur.prenom?.[0]}{utilisateur.nom?.[0]}</Text>
        </View>
        <Text style={styles.name}>{utilisateur.prenom} {utilisateur.nom}</Text>
        <Text style={styles.role}>{utilisateur.role === 'tuteur' ? 'Tuteur' : 'Étudiant'}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{utilisateur.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={deconnexion}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#0F7B6C', padding: 24, alignItems: 'center', paddingBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  name: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#D4AF37', fontSize: 14, marginTop: 4, fontWeight: '600' },
  infoSection: { margin: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 16 },
  infoRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#1A1A1A' },
  logoutButton: { margin: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 16 },
});
