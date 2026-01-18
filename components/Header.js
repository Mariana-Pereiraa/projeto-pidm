import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/themes';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoCircle}>
        <Ionicons name="restaurant-outline" size={40} color="#D8B0C8" />
      </View>
      <Text style={styles.title}>CHEF EM CASA</Text>
      <Text style={styles.subtitle}>
        DESCUBRA RECEITAS INCRÍVEIS COM OS INGREDIENTES QUE VOCÊ TEM
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  subtitle: { textAlign: 'center', color: colors.darkGray, fontSize: 12, paddingHorizontal: 20 },
});