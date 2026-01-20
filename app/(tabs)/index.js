import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../styles/themes'; 
import { auth } from '../../services/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import HomeScreen from '../../screens/HomeScreen';
import FavoriteScreen from '../../screens/FavoriteScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import Navbar from '../../components/NavBar';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isLogged, setIsLogged] = useState(false);
  const [authMode, setAuthMode] = useState('Login');
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await user.reload();
        } catch (error) {
          console.log("Erro ao recarregar perfil:", error);
        }

        setIsLogged(true);

        setCurrentScreen(prev => 
          (prev === 'Favorites' || prev === 'Settings') ? prev : 'Home'
        );
      } else {
        setIsLogged(false);
        setAuthMode('Login');
        setCurrentScreen('Home');
      }
    });

    return () => unsubscribe(); 
  }, []);

  const navegarParaHome = () => {
    setIsLogged(true);
    setCurrentScreen('Home');
  };

  const renderScreen = () => {
    if (!isLogged) {
      if (authMode === 'Login') {
        return (
          <LoginScreen 
            onLogin={navegarParaHome} 
            onGoToRegister={() => setAuthMode('Register')} 
          />
        );
      } else {
        return (
          <RegisterScreen 
            onBackToLogin={() => setAuthMode('Login')} 
            onLogin={navegarParaHome} 
          />
        );
      }
    }

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
      
      {isLogged && (
        <Navbar 
          onNavigate={setCurrentScreen} 
          currentScreen={currentScreen} 
        />
      )}
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