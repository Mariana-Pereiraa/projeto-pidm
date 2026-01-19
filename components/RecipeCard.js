import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/themes';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 3;

export default function RecipeCard({ title, image, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
    {image ? (
      <Image source={{ uri: image }} style={styles.recipeImage} />
    ) : (
      <View style={styles.imagePlaceholder} />
    )}
    <Text style={styles.title} numberOfLines={2}>{title}</Text>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: cardSize, marginBottom: 15 },
  recipeImage: { 
    width: cardSize, 
    height: cardSize, 
    borderRadius: 12, 
    marginBottom: 5 
  },
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