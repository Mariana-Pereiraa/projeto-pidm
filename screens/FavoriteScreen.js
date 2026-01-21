import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';
import RecipeCard from '@/components/RecipeCard';
import { buscarDetalhesReceita } from '@/services/service';

export default function FavoritesScreen() {
  const { styles: globalStyles, colors, isDark } = useTheme();

  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const buscarFavoritos = async () => {
        try {
          const dados = await AsyncStorage.getItem('@favoritos');
          if (dados) {
            setFavorite(JSON.parse(dados));
          }
        } catch (error) {
          console.error('Error loading favorites', error);
        }
      };

      buscarFavoritos();
    }, [])
  );

  const removerFavorito = async (id) => {
    try {
      const novaLista = favorite.filter(item => item.id !== id);
      setFavorite(novaLista);
      await AsyncStorage.setItem('@favoritos', JSON.stringify(novaLista));

      if (receitaSelecionada?.id === id) {
        setModalVisivel(false);
      }
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  const selecionarReceita = async (id) => {
    try {
      setLoading(true);
      const detalhes = await buscarDetalhesReceita(id);
      setReceitaSelecionada(detalhes);
      setModalVisivel(true);
    } catch (error) {
      alert('Error loading recipe details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: 25,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View
        style={[
          globalStyles.header,
          { marginTop: 40, marginBottom: 30 },
        ]}
      >
        <View
          style={[
            globalStyles.logoCircle,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons
            name="heart-outline"
            size={40}
            color={isDark ? '#2D1424' : '#FDF7FA'}
          />
        </View>

        <Text
          style={[
            globalStyles.title,
            { color: colors.primary },
          ]}
        >
          FAVORITES
        </Text>
      </View>

      {loading && (
        <View style={localStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favorite.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Ionicons
              name="heart-dislike-outline"
              size={60}
              color={colors.darkGray}
            />

            <Text
              style={[
                localStyles.emptyText,
                { color: colors.text },
              ]}
            >
              You don t have any favorites yet.
            </Text>

            <Text
              style={[
                localStyles.emptySubtext,
                { color: colors.darkGray },
              ]}
            >
              Tap the heart on a recipe to save it here.
            </Text>
          </View>
        ) : (
          <View style={localStyles.grid}>
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
        transparent
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={localStyles.modalCenteredView}>
          <View
            style={[
              localStyles.modalView,
              {
                backgroundColor: isDark
                  ? colors.background
                  : 'white',
              },
            ]}
          >
            <TouchableOpacity
              style={localStyles.closeButton}
              onPress={() => setModalVisivel(false)}
            >
              <Ionicons
                name="close"
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {receitaSelecionada && (
                <>
                  <Image
                    source={{ uri: receitaSelecionada.image }}
                    style={localStyles.modalImage}
                  />

                  <TouchableOpacity
                    style={[
                      localStyles.modalFavoriteButton,
                      {
                        backgroundColor: isDark
                          ? '#4A263D'
                          : 'rgba(200, 135, 178, 0.1)',
                      },
                    ]}
                    onPress={() =>
                      removerFavorito(receitaSelecionada.id)
                    }
                  >
                    <Ionicons
                      name="heart"
                      size={24}
                      color={colors.primary}
                    />
                    <Text
                      style={{
                        color: colors.primary,
                        marginLeft: 8,
                        fontWeight: 'bold',
                      }}
                    >
                      Remove from Favorites
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[
                      localStyles.modalTitle,
                      { color: colors.primary },
                    ]}
                  >
                    {receitaSelecionada.title?.toUpperCase()}
                  </Text>

                  <Text
                    style={[
                      localStyles.modalSectionTitle,
                      { color: colors.text },
                    ]}
                  >
                    Ingredients
                  </Text>

                  {receitaSelecionada.extendedIngredients?.map(
                    (ing, index) => (
                      <Text
                        key={index}
                        style={[
                          localStyles.modalText,
                          { color: colors.text },
                        ]}
                      >
                        • {ing.original}
                      </Text>
                    )
                  )}

                  <Text
                    style={[
                      localStyles.modalSectionTitle,
                      { color: colors.text },
                    ]}
                  >
                    Instructions
                  </Text>

                  <Text
                    style={[
                      localStyles.modalText,
                      { color: colors.text },
                    ]}
                  >
                    {receitaSelecionada.instructions
                      ?.replace(/<[^>]*>?/gm, '') ||
                      'Instructions not available.'}
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

const localStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  emptyState: {
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
    textAlign: 'center',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
  },

  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },

  modalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 5,
  },

  modalFavoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
});
