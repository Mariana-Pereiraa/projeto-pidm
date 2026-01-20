import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  StatusBar,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { auth } from '../services/firebaseConfig';
import { useTheme } from '../styles/themes';
import {
  buscarReceitasPorIngredientes,
  buscarDetalhesReceita,
} from '@/services/service';
import RecipeCard from '../components/RecipeCard';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  const [usuario, setUsuario] = useState({
    nome: "",
    foto: null
  });

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        setUsuario({
          nome: user.displayName || "",
          foto: user.photoURL || null
        });
      }
    }, [])
  );

  const [modalVisivel, setModalVisivel] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [ingrediente, setIngrediente] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const adicionarIngrediente = () => {
    if (!ingrediente.trim()) return;
    setListaIngredientes((prev) => [...prev, ingrediente.trim()]);
    setIngrediente('');
  };

  const removerIngrediente = (index) => {
    setListaIngredientes((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const buscarReceitas = async () => {
    try {
      setLoading(true);
      const resultado = await buscarReceitasPorIngredientes(listaIngredientes);
      setReceitas(resultado);
    } catch {
      alert('Erro ao buscar receitas');
    } finally {
      setLoading(false);
    }
  };

  const selecionarReceita = async (id) => {
    try {
      setLoading(true);
      const detalhes = await buscarDetalhesReceita(id);
      setReceitaSelecionada(detalhes);
      setModalVisivel(true);
    } catch {
      alert('Erro ao carregar detalhes da receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.topBar}>
        <View style={styles.userInfoContainer}>
          {usuario.foto ? (
            <Image 
              key={usuario.foto}
              source={{ uri: usuario.foto }} 
              style={[styles.miniProfilePhoto, { borderColor: colors.primary }]} 
            />
          ) : (
            <View style={[styles.miniPlaceholder, { backgroundColor: colors.surface }]}>
              <Ionicons name="person" size={16} color={colors.primary} />
            </View>
          )}
          <Text style={[styles.welcomeText, { color: colors.primary }]}>
            Olá, Chefe {usuario.nome}!
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons
              name="restaurant-outline"
              size={40}
              color={isDark ? '#2D1424' : '#FDF7FA'}
            />
          </View>

          <Text style={[styles.title, { color: colors.primary }]}>
            CHEF EM CASA
          </Text>

          <Text style={[styles.subtitle, { color: colors.darkGray }]}>
            DESCUBRA RECEITAS INCRÍVEIS COM OS INGREDIENTES QUE VOCÊ TEM
          </Text>
        </View>

        <View style={styles.ingredientsSection}>
          <Text style={[styles.label, { color: colors.primary }]}>
            MEUS INGREDIENTES
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              placeholder="Ex: tomate, queijo, leite..."
              placeholderTextColor={isDark ? "#FFFFFF" : "#888"}
              value={ingrediente}
              onChangeText={setIngrediente}
            />

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={adicionarIngrediente}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {listaIngredientes.map((item, index) => (
            <View
              key={`${item}-${index}`}
              style={[styles.tag, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.tagText, { color: colors.text }]}>
                {item}
              </Text>

              <TouchableOpacity onPress={() => removerIngrediente(index)}>
                <Text style={[styles.removeTag, { color: colors.primary }]}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {listaIngredientes.length > 0 && (
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: colors.primary,
                borderBottomColor: isDark ? '#8A4F75' : colors.secondary,
              },
            ]}
            onPress={buscarReceitas}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'BUSCANDO...' : 'ENCONTRAR RECEITAS'}
            </Text>
          </TouchableOpacity>
        )}

        {receitas.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.label, { marginTop: 20, color: colors.primary }]}>
              RECEITAS ENCONTRADAS
            </Text>

            <View style={styles.grid}>
              {receitas.map((item) => (
                <RecipeCard
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  onPress={() => selecionarReceita(item.id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalCenteredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: isDark ? colors.background : '#FFF' },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisivel(false)}
            >
              <Ionicons name="close" size={30} color={colors.primary} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {receitaSelecionada && (
                <>
                  <Image
                    source={{ uri: receitaSelecionada.image }}
                    style={styles.modalImage}
                  />

                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    {receitaSelecionada.title?.toUpperCase()}
                  </Text>

                  <Text style={[styles.modalSectionTitle, {color: colors.text}]}>
                    INGREDIENTES
                  </Text>

                  {receitaSelecionada.extendedIngredients?.map((ing, index) => (
                    <Text key={index} style={[styles.modalText, {color: colors.text}]}>
                      • {ing.original}
                    </Text>
                  ))}

                  <Text style={[styles.modalSectionTitle, {color: colors.text}]}>
                    MODO DE PREPARO
                  </Text>

                  <Text style={[styles.modalText, {color: colors.text}]}>
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
  container: { flex: 1 },
  topBar: {
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProfilePhoto: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1.5,
    marginRight: 10,
  },
  miniPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 20,
  },
  ingredientsSection: { width: '100%' },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#FFF', fontSize: 24 },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 30,
  },
  tag: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: { fontSize: 14 },
  removeTag: { fontWeight: 'bold', marginLeft: 8 },
  searchButton: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  resultsContainer: { width: '100%' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  closeButton: { alignSelf: 'flex-end', marginBottom: 10 },
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
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 5,
  },
});