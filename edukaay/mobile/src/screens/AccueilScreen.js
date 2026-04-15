/**
 * Écran d'accueil de l'application mobile
 * Affiche les cours populaires et les catégories
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

export default function AccueilScreen({ navigation }) {
  const [coursPopulaires, setCoursPopulaires] = useState([]);

  useEffect(() => {
    chargerCoursPopulaires();
  }, []);

  async function chargerCoursPopulaires() {
    try {
      const response = await api.get('/courses?limit=5');
      setCoursPopulaires(response.data.cours || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  }

  const categories = [
    { nom: 'Mathématiques', couleur: '#0F7B6C' },
    { nom: 'Français', couleur: '#D4AF37' },
    { nom: 'Anglais', couleur: '#3B82F6' },
    { nom: 'Physique', couleur: '#EF4444' },
    { nom: 'Arabe', couleur: '#8B5CF6' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* En-tête de bienvenue */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Bienvenue sur EduKaay</Text>
        <Text style={styles.heroSubtitle}>Trouvez le tuteur idéal pour réussir</Text>
      </View>

      {/* Catégories */}
      <Text style={styles.sectionTitle}>Catégories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.nom}
            style={[styles.categoryChip, { backgroundColor: cat.couleur + '20' }]}
            onPress={() => navigation.navigate('Recherche', { matiere: cat.nom })}
          >
            <Text style={[styles.categoryText, { color: cat.couleur }]}>{cat.nom}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cours populaires */}
      <Text style={styles.sectionTitle}>Cours populaires</Text>
      {coursPopulaires.map((cours) => (
        <View key={cours.id} style={styles.courseCard}>
          <Text style={styles.courseTitle}>{cours.titre}</Text>
          <Text style={styles.courseSubject}>{cours.matiere} - {cours.niveau}</Text>
          <Text style={styles.coursePrice}>{parseInt(cours.tarifHoraire).toLocaleString()} XOF/h</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  hero: { backgroundColor: '#0F7B6C', padding: 24, paddingTop: 20, paddingBottom: 30 },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  heroSubtitle: { color: '#FFF', fontSize: 16, opacity: 0.9, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 20, marginBottom: 12, color: '#1A1A1A' },
  categoriesRow: { paddingLeft: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  categoryText: { fontWeight: '600', fontSize: 14 },
  courseCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  courseSubject: { fontSize: 14, color: '#666', marginTop: 4 },
  coursePrice: { fontSize: 16, fontWeight: 'bold', color: '#0F7B6C', marginTop: 8 },
});
