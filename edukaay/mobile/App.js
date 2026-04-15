/**
 * Point d'entrée de l'application mobile EduKaay
 * Configure la navigation et le thème
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccueilScreen from './src/screens/AccueilScreen';
import RechercheScreen from './src/screens/RechercheScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import ProfilScreen from './src/screens/ProfilScreen';
import ConnexionScreen from './src/screens/ConnexionScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import CoursDetailScreen from './src/screens/CoursDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** Couleurs EduKaay */
const COULEURS = {
  primary: '#0F7B6C',
  accent: '#D4AF37',
  dark: '#1A1A1A',
  light: '#F5F5F5',
  white: '#FFFFFF',
};

/** Navigation par onglets (utilisateur connecté) */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COULEURS.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerStyle: { backgroundColor: COULEURS.primary },
        headerTintColor: COULEURS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Recherche" component={RechercheScreen} options={{ title: 'Cours' }} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} options={{ title: 'Mes cours' }} />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          title: 'Assistant',
          headerTitle: 'Kaay — Assistant EduKaay',
        }}
      />
      <Tab.Screen name="Profil" component={ProfilScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COULEURS.primary },
          headerTintColor: COULEURS.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Connexion" component={ConnexionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Principal" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="CoursDetail"
          component={CoursDetailScreen}
          options={{ title: 'Détail du cours', headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
