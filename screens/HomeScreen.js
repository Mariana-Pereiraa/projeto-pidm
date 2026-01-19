import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Modal, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/themes';
import { buscarReceitasPorIngredientes, buscarDetalhesReceita } from '@/services/service';
import RecipeCard from '../components/RecipeCard';

export default function HomeScreen() {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [ingrediente, setIngrediente] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const adicionarIngrediente = () => {
    if (ingrediente.trim().length > 0) {
      setListaIngredientes([...listaIngredientes, ingrediente.trim()]);
      setIngrediente('');
    }
  };

  const removerIngrediente = (index) => {
    const novaLista = [...listaIngredientes];
    novaLista.splice(index, 1);
    setListaIngredientes(novaLista);
  };

  const buscarReceitas = async () => {
    try {
      setLoading(true);
      const resultado = await buscarReceitasPorIngredientes(listaIngredientes);
      setReceitas(resultado);
    } catch (error) {
      alert('Erro ao buscar receitas 😢');
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
    } catch (error) {
      alert('Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="restaurant-outline" size={40} color="black" />
          </View>
          <Text style={styles.title}>CHEF EM CASA</Text>
          <Text style={styles.subtitle}>
            DESCUBRA RECEITAS INCRÍVEIS COM OS INGREDIENTES QUE VOCÊ TEM
          </Text>
        </View>

        <View style={styles.ingredientsSection}>
          <Text style={styles.label}>MEUS INGREDIENTES</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: tomate, queijo, leite..."
              value={ingrediente}
              onChangeText={setIngrediente}
            />
            <TouchableOpacity style={styles.addButton} onPress={adicionarIngrediente}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {listaIngredientes.map((item, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
              <TouchableOpacity onPress={() => removerIngrediente(index)}>
                <Text style={styles.removeTag}> x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {listaIngredientes.length > 0 && (
          <TouchableOpacity
            style={styles.searchButton}
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
            <Text style={styles.label}>RECEITAS ENCONTRADAS</Text>
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
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisivel(false)}
            >
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {receitaSelecionada && (
                <>
                  <Image source={{ uri: receitaSelecionada.image }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{receitaSelecionada.title?.toUpperCase()}</Text>
                  
                  <Text style={styles.modalSectionTitle}>INGREDIENTES</Text>
                  {receitaSelecionada.extendedIngredients?.map((ing, index) => (
                    <Text key={index} style={styles.modalText}>• {ing.original}</Text>
                  ))}

                  <Text style={styles.modalSectionTitle}>MODO DE PREPARO</Text>
                  <Text style={styles.modalText}>
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
  content: {
    padding: 20,
    alignItems: 'center',
    },
    
    header: {
    alignItems: 'center',
    marginBottom: 30,
    },
    
    logoCircle: {
    
    width: 80,
    
    height: 80,
    
    borderRadius: 40,
    
    backgroundColor: colors.primary,
    
    justifyContent: 'center',
    
    alignItems: 'center',
    
    marginBottom: 10,
    
    },
    
    
    
    title: {
    
    fontSize: 18,
    
    fontWeight: 'bold',
    
    color: colors.primary,
    
    marginBottom: 5,
    
    },
    
    
    
    subtitle: {
    
    textAlign: 'center',
    
    color: colors.darkGray,
    
    fontSize: 12,
    
    paddingHorizontal: 20,
    
    },
    
    
    
    label: {
    
    color: colors.primary,
    
    fontWeight: 'bold',
    
    marginBottom: 10,
    
    textAlign: 'center',
    
    width: '100%',
    
    },
    
    
    
    inputRow: {
    
    flexDirection: 'row',
    
    marginBottom: 20,
    
    },
    
    
    
    input: {
    
    flex: 1,
    
    height: 45,
    
    backgroundColor: colors.lightGray,
    
    borderRadius: 5,
    
    paddingHorizontal: 15,
    
    },
    
    
    
    addButton: {
    
    width: 45,
    
    height: 45,
    
    backgroundColor: colors.primary,
    
    borderRadius: 5,
    
    marginLeft: 10,
    
    justifyContent: 'center',
    
    alignItems: 'center',
    
    },
    
    
    
    addButtonText: {
    
    color: 'white',
    
    fontSize: 24,
    
    },
    
    
    
    tagsContainer: {
    
    flexDirection: 'row',
    
    flexWrap: 'wrap',
    
    width: '100%',
    
    marginBottom: 30,
    
    },
    
    
    
    tag: {
    
    flexDirection: 'row',
    
    backgroundColor: colors.lightGray,
    
    padding: 8,
    
    borderRadius: 5,
    
    marginRight: 10,
    
    marginBottom: 10,
    
    },
    
    
    
    tagText: {
    
    color: '#333',
    
    },
    
    
    
    removeTag: {
    
    color: '#666',
    
    fontWeight: 'bold',
    
    },
    
    
    
    searchButton: {
    
    width: '100%',
    
    height: 50,
    
    backgroundColor: colors.primary,
    
    borderRadius: 5,
    
    justifyContent: 'center',
    
    alignItems: 'center',
    
    borderBottomWidth: 4,
    
    borderBottomColor: colors.secondary,
    
    },
    
    
    
    searchButtonText: {
    
    color: 'white',
    
    fontWeight: 'bold',
    
    },
    
    
    
    resultsContainer: {
    
    width: '100%',
    
    marginTop: 20,
    
    },
    
    grid: {
    
    flexDirection: 'row',
    
    flexWrap: 'wrap',
    
    justifyContent: 'space-between',
    
    },

    modalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
    width: '100%',
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
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
    
    });