/**
 * Écran des réservations
 * Affiche les cours réservés par l'utilisateur
 */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';

const STATUT_COULEURS = {
  en_attente: '#F59E0B',
  confirmee: '#10B981',
  en_cours: '#3B82F6',
  terminee: '#6B7280',
  annulee: '#EF4444',
};

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [seancesAValider, setSeancesAValider] = useState([]);
  const [actionEnCours, setActionEnCours] = useState(null);

  useEffect(() => {
    chargerReservations();
    chargerSeancesAValider();
  }, []);

  async function chargerReservations() {
    try {
      const response = await api.get('/bookings/mes-reservations');
      setReservations(response.data.reservations || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function chargerSeancesAValider() {
    try {
      const response = await api.get('/bookings/a-valider');
      setSeancesAValider(response.data.reservations || []);
    } catch {
      // Silencieux si non connecté
    }
  }

  async function validerSeance(id, decision) {
    setActionEnCours(id);
    try {
      await api.patch(`/bookings/${id}/valider-famille`, { decision });
      setSeancesAValider(prev => prev.filter(s => s.id !== id));
      Alert.alert(
        decision === 'confirmee' ? 'Séance confirmée' : 'Signalement enregistré',
        decision === 'confirmee'
          ? 'Merci, la séance a été validée.'
          : 'Votre signalement a été envoyé à l\'équipe EduKaay.',
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de traiter cette action.');
    } finally {
      setActionEnCours(null);
    }
  }

  const renderSeanceAValider = ({ item }) => (
    <View style={styles.validationCard}>
      <View style={styles.validationHeader}>
        <Text style={styles.validationIcon}>⏳</Text>
        <Text style={styles.validationLabel}>Séance à valider</Text>
      </View>
      <Text style={styles.courseTitle}>{item.cours?.titre || 'Cours'}</Text>
      <Text style={styles.tuteurNom}>
        Tuteur : {item.tuteur?.prenom} {item.tuteur?.nom}
      </Text>
      <Text style={styles.price}>{parseInt(item.montantTotal).toLocaleString()} XOF</Text>
      <View style={styles.validationActions}>
        <TouchableOpacity
          style={[styles.btnConfirmer, actionEnCours === item.id && styles.btnDisabled]}
          onPress={() => validerSeance(item.id, 'confirmee')}
          disabled={actionEnCours === item.id}
        >
          <Text style={styles.btnConfirmerText}>✓ Confirmer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnSignaler, actionEnCours === item.id && styles.btnDisabled]}
          onPress={() => validerSeance(item.id, 'contestee')}
          disabled={actionEnCours === item.id}
        >
          <Text style={styles.btnsignalerText}>⚠ Signaler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReservation = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.courseTitle}>{item.cours?.titre || 'Cours'}</Text>
        <View style={[styles.badge, { backgroundColor: STATUT_COULEURS[item.statut] + '20' }]}>
          <Text style={[styles.badgeText, { color: STATUT_COULEURS[item.statut] }]}>
            {STATUT_LABELS[item.statut]}
          </Text>
        </View>
      </View>
      <Text style={styles.date}>
        {new Date(item.dateSeance).toLocaleDateString('fr-FR', {
          weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
        })}
      </Text>
      <Text style={styles.price}>{parseInt(item.montantTotal).toLocaleString()} XOF</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Séances à valider */}
      {seancesAValider.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Séances à valider ({seancesAValider.length})
            </Text>
          </View>
          <FlatList
            data={seancesAValider}
            keyExtractor={(item) => `val_${item.id}`}
            renderItem={renderSeanceAValider}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Toutes les réservations */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mes réservations</Text>
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={renderReservation}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune réservation pour le moment</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  sectionHeader: { marginBottom: 8, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A' },
  // Validation
  validationCard: {
    backgroundColor: '#FFF8E7', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#D4AF37',
  },
  validationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  validationIcon: { fontSize: 16 },
  validationLabel: { fontSize: 12, fontWeight: '700', color: '#D4AF37' },
  tuteurNom: { fontSize: 13, color: '#666', marginTop: 2 },
  validationActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnConfirmer: {
    flex: 1, backgroundColor: '#10B981', paddingVertical: 10,
    borderRadius: 12, alignItems: 'center',
  },
  btnConfirmerText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnSignaler: {
    flex: 1, backgroundColor: '#FEE2E2', paddingVertical: 10,
    borderRadius: 12, alignItems: 'center',
  },
  btnsignalerText: { color: '#DC2626', fontWeight: 'bold', fontSize: 14 },
  btnDisabled: { opacity: 0.5 },
  // Réservations classiques
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  date: { fontSize: 14, color: '#666', marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#0F7B6C', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
