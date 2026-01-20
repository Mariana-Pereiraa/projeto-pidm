import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen({ onBackToLogin }) {
  const { colors, isDark } = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [verSenha, setVerSenha] = useState(true);
  const [verConfirmar, setVerConfirmar] = useState(true);

  const handleFirebaseRegister = async () => {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      
      Alert.alert("Sucesso!", "Sua conta foi criada com sucesso!");

      onBackToLogin(); 
      
    } catch (error) {
      console.log(error.code);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Erro", "Este e-mail já está sendo usado por outra conta.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Erro", "O formato do e-mail é inválido.");
      } else {
        Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons 
              name="restaurant-outline" 
              size={60} 
              color={isDark ? colors.background : "#FFFFFF"} 
            />
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>CHEF EM CASA</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>CADASTRO</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="NOME"
            placeholderTextColor={colors.darkGray}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="E-MAIL"
            placeholderTextColor={colors.darkGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.inputPassword, { color: colors.text }]}
              placeholder="SENHA"
              placeholderTextColor={colors.darkGray}
              secureTextEntry={verSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setVerSenha(!verSenha)} style={styles.eyeIcon}>
              <Ionicons name={verSenha ? "eye-outline" : "eye-off-outline"} size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.inputPassword, { color: colors.text }]}
              placeholder="CONFIRMAR SENHA"
              placeholderTextColor={colors.darkGray}
              secureTextEntry={verConfirmar}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)} style={styles.eyeIcon}>
              <Ionicons name={verConfirmar ? "eye-outline" : "eye-off-outline"} size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={handleFirebaseRegister}
          >
            <Text style={styles.registerButtonText}>CADASTRAR-SE</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: { alignItems: 'center', marginBottom: 25 },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', letterSpacing: 1.5 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  form: { width: '100%' },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  inputPassword: { flex: 1, height: '100%', paddingHorizontal: 15 },
  eyeIcon: { paddingRight: 15 },
  registerButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  registerButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});