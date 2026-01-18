import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  
  const categorias = ['Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Dessert', 'Snacks', 'Vegan'];

  const favoritos = []; 

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>Chef em Casa</Text>
      <View style={styles.searchRow}>
        <View style={styles.inputContainer}>
          <Ionicons name="heart-outline" size={20} color="#C887B2" style={styles.searchIcon} />
          <TextInput 
            placeholder="Ex: tomate, queijo, leite..." 
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categorias.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoritos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>Você ainda não tem receitas salvas.</Text>
            <Text style={styles.emptySubtext}>Toque no coração em uma receita para salvá-la.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7FA',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    color: '#C887B2',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#C887B2',
    width: 45,
    height: 45,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
  },

  categoriesContainer: {
    marginBottom: 20,
    height: 35, 
  },
  categoriesContent: {
    paddingRight: 20, 
  },
  categoryBadge: {
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C887B2',
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 30,
  },
  categoryText: {
    color: '#C887B2',
    fontSize: 13,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center'
  }
});