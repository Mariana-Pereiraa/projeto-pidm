import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../styles/themes';
import RecipeCard from '@/components/RecipeCard';
import { buscarDetalhesReceita } from '@/services/service';

export default function FavoritesScreen() {
  const [favorite, setFavorite] = useState([]);
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const categorias = ['Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Dessert', 'Snacks', 'Vegan'];
  const [modalVisivel, setModalVisivel] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const buscarFavoritos = async () => {
        try {
          const dados = await AsyncStorage.getItem('@favoritos');
          if (dados) {
            setFavorite(JSON.parse(dados));
          }
        } catch (error) {
          console.error("Erro ao carregar favoritos", error);
        }
      };
      buscarFavoritos();
    }, [])
  );

  const removerFavorito = async (id) => {
    try{
      const novaLista = favorite.filter(item => item.id !== id);
      setFavorite(novaLista);
      await AsyncStorage.setItem('@favoritos', JSON.stringify(novaLista));
      if(receitaSelecionada?.id === id){
        setModalVisivel(false);
      }
    }catch(error){
      console.error("Erro ao remover favorito", error);
    }
  }

  const selecionarReceita = async (id) => {
    try {
      setLoading(true);
      const detalhes = await buscarDetalhesReceita(id);
      setReceitaSelecionada(detalhes);
      setModalVisivel(true);
    } catch (error) {
      alert('Erro ao carregar detalhes da receita');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <Text style={[styles.headerTitle, { color: colors.primary }]}>Chef em Casa</Text>

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
        {favorite.length === 0 ? (
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
              {favorite.map((item) => (
                <RecipeCard
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  isFavorite={true}
                  onFavoritePress={() => removerFavorito(item.id)}
                  onPress={() => selecionarReceita(item.id)}
                />
              ))}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalCenteredView}>
          <View style={[styles.modalView, { backgroundColor: isDark ? colors.background : 'white' }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisivel(false)}>
              <Ionicons name="close" size={30} color={colors.primary} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {receitaSelecionada && (
                <>
                  <Image source={{ uri: receitaSelecionada.image }} style={styles.modalImage} />
                  
                  <TouchableOpacity 
                    style={styles.modalFavoriteButton}
                    onPress={() => removerFavorito(receitaSelecionada.id)}
                  >
                    <Ionicons name="heart" size={24} color={colors.primary} />
                    <Text style={{color: colors.primary, marginLeft: 8}}>Remover dos Favoritos</Text>
                  </TouchableOpacity>

                  <Text style={[styles.modalTitle, { color: colors.primary }]}>{receitaSelecionada.title?.toUpperCase()}</Text>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>INGREDIENTES</Text>
                  {receitaSelecionada.extendedIngredients?.map((ing, index) => (
                    <Text key={index} style={[styles.modalText, { color: colors.text }]}>• {ing.original}</Text>
                  ))}
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>MODO DE PREPARO</Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {receitaSelecionada.instructions?.replace(/<[^>]*>?/gm, '') || 'Instruções não disponíveis.'}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: '100%',
    paddingHorizontal: 2,
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
  },
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000 
  },
  
  modalCenteredView: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  
  modalView: { 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 20, 
    height: '90%' 
  },
  
  closeButton: { 
    alignSelf: 'flex-end', 
    marginBottom: 10 
  },
  
  modalImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 15, 
    marginBottom: 15 
  },
  
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15 
  },
  
  modalSectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 5 
  },
  
  modalText: { 
    fontSize: 14, 
    lineHeight: 22, 
    marginBottom: 5 
  },
  
  modalFavoriteButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 15, 
    backgroundColor: 'rgba(200, 135, 178, 0.1)' 
  },
});