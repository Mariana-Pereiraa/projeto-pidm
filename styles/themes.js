import React, { createContext, useState, useContext, useEffect } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const { isDark, toggleTheme } = context;

  const colors = {
    primary: '#C887B2',
    secondary: '#2196F3',

    background: isDark ? '#2D1424' : '#FDF7FA', 

    surface: isDark ? '#ca97ae' : '#EAEAEA',

    text: isDark ? '#FDF7FA' : '#333333',
    darkGray: isDark ? '#B68BA6' : '#888888',

    border: isDark ? '#4A263D' : '#EEEEEE',

    switchTrack: {
      false: '#DBC2D1',
      true: '#C887B2',
    },
    switchThumb: isDark ? '#FDF7FA' : '#FFFFFF',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 5,
    },
  });

  return { styles, colors, isDark, toggleTheme };
};