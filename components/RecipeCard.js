import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2;


export default function RecipeCard({ title, image, onPress, isFavorite, onFavoritePress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary }]} />
        )}
        
        <TouchableOpacity style={styles.favoriteBadge} onPress={onFavoritePress}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={18} 
            color={isFavorite ? colors.primary : "white"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: cardSize, marginBottom: 15 },
  imageContainer: {
    width: cardSize,
    height: cardSize * 0.8,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#EEE',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%' },
  favoriteBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
  textContainer: {
    paddingVertical: 5,
    width: '100%',
  },
  title: { fontSize: 13, fontWeight: 'bold' },
});