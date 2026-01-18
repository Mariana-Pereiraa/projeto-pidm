import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../styles/themes'; 

import HomeScreen from '../../screens/HomeScreen';
import FavoriteScreen from '../../screens/FavoriteScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import Navbar from '../../components/NavBar';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const { colors } = useTheme();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Favorites':
        return <FavoriteScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.main}>
        {renderScreen()}
      </View>
      
      <Navbar onNavigate={setCurrentScreen} currentScreen={currentScreen} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  main: { 
    flex: 1 
  }
});