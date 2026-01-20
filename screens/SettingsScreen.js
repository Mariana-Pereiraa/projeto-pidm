import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function SettingsScreen() {
  const { styles, colors, isDark, toggleTheme } = useTheme();

const handleLogout = async () => {
  console.log("Botão clicado! Tentando deslogar agora...");
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    alert("Erro ao sair");
  }
};

  const renderSettingItem = (icon, title, value, type = 'arrow', onPress = null) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={[localStyles.item, { borderBottomColor: colors.border }]}
    >
      <View style={localStyles.itemLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text style={[localStyles.itemText, { color: colors.text }]}>{title}</Text>
      </View>
      
      {type === 'switch' ? (
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={toggleTheme}
          style={{
            width: 50,
            height: 28,
            borderRadius: 15,
            padding: 2,
            backgroundColor: value ? colors.primary : (isDark ? '#4A263D' : '#DBC2D1'),
            justifyContent: 'center',
          }}
        >
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: isDark ? '#FDF7FA' : '#FFFFFF',
            alignSelf: value ? 'flex-end' : 'flex-start',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
          }} />
        </TouchableOpacity>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 40 }]}
    >
      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <Ionicons 
            name="settings-outline" 
            size={40} 
            color={isDark ? "#2D1424" : "#FDF7FA"}
          />
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>CONFIGURAÇÕES</Text>
      </View>

      <View style={localStyles.section}>
        <Text style={[localStyles.sectionTitle, { color: colors.primary }]}>PREFERÊNCIAS</Text>
        {renderSettingItem('moon-outline', 'Modo Escuro', isDark, 'switch')}
      </View>

      <TouchableOpacity 
        style={[localStyles.logoutButton, { borderColor: colors.primary }]}
        activeOpacity={0.6}
        onPress={handleLogout}
      >
        <Text style={[localStyles.logoutText, { color: colors.primary }]}>SAIR DA CONTA</Text>
      </TouchableOpacity>
      
      <Text style={[localStyles.version, { color: colors.darkGray }]}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  section: { width: '100%', marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 16, marginLeft: 15 },
  logoutButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  logoutText: { fontWeight: 'bold', fontSize: 16 },
  version: { marginTop: 30, fontSize: 12, marginBottom: 20, textAlign: 'center', width: '100%' }
});