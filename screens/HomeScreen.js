import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export default function HomeScreen() {
  const [ingrediente, setIngrediente] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState([]);

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

  return (
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
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>ENCONTRAR RECEITAS</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
});
