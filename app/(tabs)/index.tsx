import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoriteScreen';
import Navbar from './src/components/Navbar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  // Função para renderizar a tela selecionada
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Favorites':
        return <FavoritesScreen />;
      case 'Settings':
        // Tela temporária de Settings
        return (
          <View style={styles.center}>
            <Text>Configurações em breve...</Text>
          </View>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.main}>
          {renderScreen()}
        </View>
        
        <Navbar onNavigate={setCurrentScreen} currentScreen={currentScreen} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  main: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});