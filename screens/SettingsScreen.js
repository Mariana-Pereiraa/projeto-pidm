import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function SettingsScreen({ onEditProfile }) {
  const { styles: globalStyles, colors, isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
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
          }} />
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {title === 'Editar perfil' && (
            <Text style={{ color: colors.darkGray, marginRight: 10 }}>
              {auth.currentUser?.displayName || "Definir"}
            </Text>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background, paddingHorizontal: 25 }]}>
      <View style={[globalStyles.header, { marginTop: 40, marginBottom: 30 }]}>
        <View style={[globalStyles.logoCircle, { backgroundColor: colors.primary }]}>
          <Ionicons name="settings-outline" size={40} color={isDark ? "#2D1424" : "#FDF7FA"} />
        </View>
        <Text style={[globalStyles.title, { color: colors.primary }]}>SETTINGS</Text>
      </View>

      <View style={localStyles.section}>
        <Text style={[localStyles.sectionTitle, { color: colors.primary }]}>ACCOUNT</Text>
        {renderSettingItem('person-outline', 'Edit profile', null, 'arrow', onEditProfile)}
      </View>

      <View style={localStyles.section}>
        <Text style={[localStyles.sectionTitle, { color: colors.primary }]}>PREFERENCES</Text>
        {renderSettingItem('moon-outline', 'Dark theme', isDark, 'switch')}
      </View>

      <View style={localStyles.footer}>
        <TouchableOpacity 
          style={[localStyles.logoutButton, { borderColor: colors.primary }]}
          onPress={handleLogout}
        >
          <Text style={[localStyles.logoutText, { color: colors.primary }]}>LOG OUT</Text>
        </TouchableOpacity>
        
        <Text style={[localStyles.version, { color: colors.darkGray }]}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: { 
    width: '100%', 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    marginLeft: 5 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  itemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  itemText: { 
    fontSize: 16, 
    marginLeft: 15 
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end', 
    paddingBottom: 30,
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  logoutText: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  version: { 
    marginTop: 15, 
    fontSize: 12, 
    textAlign: 'center', 
    width: '100%' 
  }
});