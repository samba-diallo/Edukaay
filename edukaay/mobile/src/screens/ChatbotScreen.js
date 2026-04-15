/**
 * Écran Chatbot — Assistant IA EduKaay (Mobile)
 * Structure prête, sans modèle IA intégré pour l'instant
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const COULEURS = {
  primary: '#0F7B6C',
  accent: '#D4AF37',
  bg: '#F5F5F5',
  white: '#FFFFFF',
  gris: '#E5E7EB',
};

const MESSAGES_INITIAUX = [
  {
    id: '0',
    role: 'assistant',
    text: 'Bonjour ! Je suis Kaay, votre assistant EduKaay.\n\nComment puis-je vous aider ?',
  },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState(MESSAGES_INITIAUX);
  const [input, setInput] = useState('');
  const [chargement, setChargement] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const envoyerMessage = async () => {
    const text = input.trim();
    if (!text || chargement) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChargement(true);

    try {
      const res = await api.post('/ai/chat', { message: text, langue: 'fr' });
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.data.reponse || '...',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', text: 'Désolé, je suis temporairement indisponible.' },
      ]);
    } finally {
      setChargement(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowBot]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextBot]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Indicateur de chargement */}
      {chargement && (
        <View style={styles.loadingRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <View style={styles.bubbleBot}>
            <ActivityIndicator size="small" color={COULEURS.primary} />
          </View>
        </View>
      )}

      {/* Suggestions rapides */}
      {messages.length <= 2 && (
        <View style={styles.suggestions}>
          {['Trouver un tuteur', 'Faire une réservation', 'Paiement Mobile Money'].map(s => (
            <TouchableOpacity
              key={s}
              style={styles.suggestionBtn}
              onPress={() => { setInput(s); }}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Posez votre question..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || chargement) && styles.sendBtnDisabled]}
          onPress={envoyerMessage}
          disabled={!input.trim() || chargement}
        >
          <Text style={styles.sendBtnText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COULEURS.bg },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowBot: { justifyContent: 'flex-start' },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COULEURS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { color: COULEURS.white, fontWeight: 'bold', fontSize: 14 },
  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleUser: { backgroundColor: COULEURS.primary, borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: COULEURS.white, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: COULEURS.white },
  bubbleTextBot: { color: '#1A1A1A' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  suggestionBtn: {
    borderWidth: 1, borderColor: COULEURS.primary,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: COULEURS.white,
  },
  suggestionText: { color: COULEURS.primary, fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 12, backgroundColor: COULEURS.white,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    gap: 8,
  },
  input: {
    flex: 1, backgroundColor: COULEURS.bg,
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, maxHeight: 100,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COULEURS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#CCC' },
  sendBtnText: { color: COULEURS.white, fontSize: 20, fontWeight: 'bold' },
});
