import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export default function IngredientInput({ value, onChangeText, onAdd }) {
  return (
    <View style={styles.ingredientsSection}>
      <Text style={styles.label}>MEUS INGREDIENTES</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ex: tomate, queijo, leite..."
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.primary, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', width: '100%' },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, height: 45, backgroundColor: colors.lightGray, borderRadius: 5, paddingHorizontal: 15 },
  addButton: { width: 45, height: 45, backgroundColor: colors.primary, borderRadius: 5, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 24 },
});