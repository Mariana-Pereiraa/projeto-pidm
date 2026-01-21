import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../styles/themes'; 
import { auth } from '../../services/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

// TELAS
import HomeScreen from '../../screens/HomeScreen';
import FavoriteScreen from '../../screens/FavoriteScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import EditProfileScreen from '../../screens/EditProfileScreen'; // 1. IMPORTAR A NOVA TELA

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

        // Mantém a tela se for uma das internas, senão vai para Home
        setCurrentScreen(prev => 
          (prev === 'Favorites' || prev === 'Settings' || prev === 'EditProfile') ? prev : 'Home'
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

    // LÓGICA DE RENDERIZAÇÃO DAS TELAS LOGADAS
    switch (currentScreen) {
      case 'Home': 
        return <HomeScreen />;
      case 'Favorites': 
        return <FavoriteScreen />;
      case 'Settings': 
        // 2. PASSAR A FUNÇÃO QUE MUDA O ESTADO PARA 'EditProfile'
        return <SettingsScreen onEditProfile={() => setCurrentScreen('EditProfile')} />;
      case 'EditProfile': 
        // 3. ADICIONAR O CASE PARA A NOVA TELA
        return <EditProfileScreen onBack={() => setCurrentScreen('Settings')} />;
      default: 
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.main}>
        {renderScreen()}
      </View>
      
      {/* A Navbar continua funcionando normalmente. 
          Se você estiver na EditProfile, ela continuará visível 
          ou você pode esconder se preferir.
      */}
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