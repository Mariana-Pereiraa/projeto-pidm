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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function RegisterScreen({ onBackToLogin }) {
  const { colors, isDark } = useTheme();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [verSenha, setVerSenha] = useState(true);
  const [verConfirmar, setVerConfirmar] = useState(true);

const handleFirebaseRegister = async () => {
  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim();

  if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
    alert("All fields are required!");
    return;
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(emailLimpo)) {
    alert("Invalid email! Use the format: name@example.com");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("Passwords do not match!");
    return;
  }

  if (senha.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
    
    await updateProfile(userCredential.user, {
      displayName: nomeLimpo
    });
    
    alert("Account created successfully! Chef " + nomeLimpo + ", welcome.");
    onBackToLogin(); 
    
  } catch (error) {
    console.log("Error Firebase:", error.code);

    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already in use.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Invalid email address.");
    } else {
      alert("Registration failed: " + error.message);
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
          <Text style={[styles.title, { color: colors.primary }]}>CHEF AT HOME</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>SIGN UP</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="NAME"
            placeholderTextColor={colors.darkGray}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={[
              styles.input, { 
              backgroundColor: colors.surface, 
              color: colors.text, 
              borderColor: colors.border 
            }]}
            placeholder="EMAIL"
            placeholderTextColor={colors.darkGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.inputPassword, { color: colors.text }]}
              placeholder="PASSWORD"
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
              placeholder="CONFIRM PASSWORD"
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
            onPress={handleFirebaseRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>CADASTRAR</Text>
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
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  registerButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});