/**
 * Écran Détail Cours (Mobile)
 * Affiche un cours structuré avec accès vidéo et PDF
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator, Image,
} from 'react-native';
import api from '../services/api';

const COULEURS = {
  primary: '#0F7B6C',
  accent: '#D4AF37',
  bg: '#F5F5F5',
  white: '#FFFFFF',
};

export default function CoursDetailScreen({ route }) {
  const { coursId } = route.params;
  const [cours, setCours] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerCours();
  }, [coursId]);

  async function chargerCours() {
    try {
      const res = await api.get(`/courses/${coursId}`);
      setCours(res.data.cours || res.data);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
    } finally {
      setChargement(false);
    }
  }

  const ouvrirLien = async (url) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  if (chargement) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COULEURS.primary} />
      </View>
    );
  }

  if (!cours) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: '#999', fontSize: 16 }}>Cours introuvable.</Text>
      </View>
    );
  }

  const estContenu = cours.type === 'contenu';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>
            {estContenu ? 'Cours structuré' : 'Tutorat'}
          </Text>
        </View>
        <Text style={styles.titre}>{cours.titre}</Text>
        <Text style={styles.matiere}>{cours.matiere} · {cours.niveau}</Text>
        {cours.chapitre && (
          <Text style={styles.chapitre}>{cours.chapitre}</Text>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{cours.description}</Text>
      </View>

      {/* Tuteur */}
      {cours.tuteur && (
        <View style={styles.tuteurCard}>
          <View style={styles.tuteurAvatar}>
            <Text style={styles.tuteurAvatarText}>
              {cours.tuteur.prenom?.[0]}{cours.tuteur.nom?.[0]}
            </Text>
          </View>
          <View>
            <Text style={styles.tuteurNom}>
              {cours.tuteur.prenom} {cours.tuteur.nom}
            </Text>
            <Text style={styles.tuteurSous}>Tuteur</Text>
          </View>
        </View>
      )}

      {/* Accès au contenu */}
      {estContenu && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ressources du cours</Text>
          <View style={styles.ressources}>
            {cours.videoUrl ? (
              <TouchableOpacity
                style={[styles.ressourceBtn, styles.ressourceBtnVideo]}
                onPress={() => ouvrirLien(cours.videoUrl)}
              >
                <Text style={styles.ressourceBtnIcon}>▶</Text>
                <View>
                  <Text style={styles.ressourceBtnTitle}>Regarder la vidéo</Text>
                  <Text style={styles.ressourceBtnSous}>Ouvre dans le navigateur</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.ressourceVide}>
                <Text style={styles.ressourceVideText}>Vidéo non disponible</Text>
              </View>
            )}

            {cours.pdfUrl ? (
              <TouchableOpacity
                style={[styles.ressourceBtn, styles.ressourceBtnPdf]}
                onPress={() => ouvrirLien(cours.pdfUrl)}
              >
                <Text style={styles.ressourceBtnIcon}>📄</Text>
                <View>
                  <Text style={styles.ressourceBtnTitle}>Télécharger le PDF</Text>
                  <Text style={styles.ressourceBtnSous}>Support de cours</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.ressourceVide}>
                <Text style={styles.ressourceVideText}>PDF non disponible</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Tarif et réservation */}
      {!estContenu && (
        <View style={styles.tarifSection}>
          <View>
            <Text style={styles.tarifLabel}>Tarif horaire</Text>
            <Text style={styles.tarif}>
              {Number(cours.tarifHoraire).toLocaleString()} FCFA / h
            </Text>
          </View>
          <TouchableOpacity style={styles.reserverBtn}>
            <Text style={styles.reserverBtnText}>Réserver une séance</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  container: { flex: 1, backgroundColor: COULEURS.bg },
  content: { padding: 16, paddingBottom: 32 },
  header: { backgroundColor: COULEURS.white, borderRadius: 20, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  typeTag: { backgroundColor: COULEURS.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 },
  typeTagText: { color: COULEURS.primary, fontSize: 12, fontWeight: '700' },
  titre: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  matiere: { fontSize: 14, color: '#666' },
  chapitre: { fontSize: 13, color: COULEURS.primary, marginTop: 6, fontWeight: '600' },
  section: { backgroundColor: COULEURS.white, borderRadius: 16, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  description: { fontSize: 15, color: '#444', lineHeight: 24 },
  tuteurCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COULEURS.white, borderRadius: 16, padding: 14, marginBottom: 12 },
  tuteurAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COULEURS.primary + '30', alignItems: 'center', justifyContent: 'center' },
  tuteurAvatarText: { color: COULEURS.primary, fontWeight: 'bold', fontSize: 16 },
  tuteurNom: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  tuteurSous: { fontSize: 12, color: '#999' },
  ressources: { gap: 10 },
  ressourceBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, borderWidth: 1 },
  ressourceBtnVideo: { backgroundColor: '#EEF9F7', borderColor: COULEURS.primary + '40' },
  ressourceBtnPdf: { backgroundColor: '#FFF8E7', borderColor: COULEURS.accent + '60' },
  ressourceBtnIcon: { fontSize: 24 },
  ressourceBtnTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  ressourceBtnSous: { fontSize: 12, color: '#888', marginTop: 2 },
  ressourceVide: { padding: 14, borderRadius: 14, backgroundColor: '#F5F5F5', alignItems: 'center' },
  ressourceVideText: { color: '#BBB', fontSize: 14 },
  tarifSection: { backgroundColor: COULEURS.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tarifLabel: { fontSize: 12, color: '#999' },
  tarif: { fontSize: 20, fontWeight: 'bold', color: COULEURS.primary },
  reserverBtn: { backgroundColor: COULEURS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  reserverBtnText: { color: COULEURS.white, fontWeight: 'bold', fontSize: 14 },
});
