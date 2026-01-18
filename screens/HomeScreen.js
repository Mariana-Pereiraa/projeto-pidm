import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes'; 

export default function HomeScreen() {
  const [ingrediente, setIngrediente] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState([]);
  
  const { colors, isDark } = useTheme();

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
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      contentContainerStyle={styles.content}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <Ionicons 
            name="settings-outline" 
            size={40} 
            color={isDark ? "#2D1424" : "#FDF7FA"}
          />
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>CHEF EM CASA</Text>
        <Text style={[styles.subtitle, { color: colors.darkGray }]}>
          DESCUBRA RECEITAS INCRÍVEIS COM OS INGREDIENTES QUE VOCÊ TEM
        </Text>
      </View>

      <View style={styles.ingredientsSection}>
        <Text style={[styles.label, { color: colors.primary }]}>MEUS INGREDIENTES</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Ex: tomate, queijo, leite..."
            placeholderTextColor={isDark ? "#FFFFFF" : "#888"} 
            value={ingrediente}
            onChangeText={setIngrediente}
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]} 
            onPress={adicionarIngrediente}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {listaIngredientes.map((item, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
            <TouchableOpacity onPress={() => removerIngrediente(index)}>
              <Text style={[styles.removeTag, { color: colors.primary }]}> x</Text>
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
              borderBottomColor: isDark ? '#8A4F75' : colors.secondary 
            }
          ]}
          activeOpacity={0.9}
        >
          <Text style={styles.searchButtonText}>ENCONTRAR RECEITAS</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { textAlign: 'center', fontSize: 12, paddingHorizontal: 20 },
  ingredientsSection: { width: '100%' },
  label: { fontWeight: 'bold', marginBottom: 10, textAlign: 'center', width: '100%' },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, height: 45, borderRadius: 5, paddingHorizontal: 15 },
  addButton: { width: 45, height: 45, borderRadius: 5, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 24 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: 30 },
  tag: { flexDirection: 'row', padding: 8, borderRadius: 5, marginRight: 10, marginBottom: 10, alignItems: 'center' },
  tagText: { fontSize: 14 },
  removeTag: { fontWeight: 'bold', marginLeft: 8 },
  searchButton: { width: '100%', height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 4 },
  searchButtonText: { color: 'white', fontWeight: 'bold' },
});