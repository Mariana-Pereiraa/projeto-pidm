import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar({ onNavigate, currentScreen }) {
  const getStyle = (screenName) => ({
    color: currentScreen === screenName ? '#FFF' : '#E0E0E0',
    fontWeight: currentScreen === screenName ? 'bold' : 'normal'
  });

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.navItem}>
        <Ionicons name="home-outline" size={24} color={getStyle('Home').color} />
        <Text style={[styles.navText, { color: getStyle('Home').color }]}>HOME</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Favorites')} style={styles.navItem}>
        <Ionicons name="heart-outline" size={24} color={getStyle('Favorites').color} />
        <Text style={[styles.navText, { color: getStyle('Favorites').color }]}>FAVORITES</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Settings')} style={styles.navItem}>
        <Ionicons name="settings-outline" size={24} color={getStyle('Settings').color} />
        <Text style={[styles.navText, { color: getStyle('Settings').color }]}>SETTINGS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: { 
    flexDirection: 'row', 
    height: 70, 
    backgroundColor: '#C887B2', 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4 }
});