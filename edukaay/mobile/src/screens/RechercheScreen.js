/**
 * Écran de recherche de cours
 * Permet de filtrer et trouver des cours par matière et niveau
 */
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

export default function RechercheScreen() {
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState([]);

  async function lancerRecherche() {
    try {
      const response = await api.get(`/courses?q=${recherche}`);
      setResultats(response.data.cours || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une matière..."
          value={recherche}
          onChangeText={setRecherche}
          onSubmitEditing={lancerRecherche}
        />
        <TouchableOpacity style={styles.searchButton} onPress={lancerRecherche}>
          <Text style={styles.searchButtonText}>Chercher</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={resultats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>{item.titre}</Text>
            <Text style={styles.courseMeta}>{item.matiere} | {item.niveau}</Text>
            <Text style={styles.coursePrice}>{parseInt(item.tarifHoraire).toLocaleString()} XOF/h</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Recherchez un cours pour commencer</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  searchBar: { flexDirection: 'row', padding: 16, gap: 8 },
  searchInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E5E5' },
  searchButton: { backgroundColor: '#0F7B6C', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  searchButtonText: { color: '#FFF', fontWeight: '600' },
  courseCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 16 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  courseMeta: { fontSize: 14, color: '#666', marginTop: 4 },
  coursePrice: { fontSize: 16, fontWeight: 'bold', color: '#0F7B6C', marginTop: 8 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
