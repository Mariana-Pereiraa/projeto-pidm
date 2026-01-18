import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/theme';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 3;

export default function RecipeCard({ title, updated }) {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.updated}>{updated}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: cardSize, marginBottom: 15 },
  imagePlaceholder: { 
    width: cardSize, 
    height: cardSize, 
    backgroundColor: '#C887B2', 
    borderRadius: 12, 
    marginBottom: 5 
  },
  title: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  updated: { fontSize: 10, color: '#888' }
});