import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../styles/themes';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  const categorias = ['Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Dessert', 'Snacks', 'Vegan'];
  const favoritos = []; 

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <Text style={[styles.headerTitle, { color: colors.primary }]}>Chef em Casa</Text>
      
      <View style={styles.searchRow}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="heart-outline" size={20} color={colors.primary} style={styles.searchIcon} />
          <TextInput 
            placeholder="Ex: tomate, queijo, leite..." 
            style={[styles.input, { color: colors.text }]} 
            placeholderTextColor={isDark ? "#FFFFFF" : "#888"}
        />
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
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
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryBadge, 
                { 
                  borderColor: colors.primary, 
                  backgroundColor: isDark ? colors.background : 'white' 
                }
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.primary }]}>{cat}</Text>
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
            <Ionicons name="bookmark-outline" size={60} color={colors.darkGray} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Você ainda não tem receitas salvas.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.darkGray }]}>
              Toque no coração em uma receita para salvá-la.
            </Text>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
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
  },
  addButton: {
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
    marginRight: 10,
    justifyContent: 'center',
    height: 30,
  },
  categoryText: {
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
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center'
  }
});