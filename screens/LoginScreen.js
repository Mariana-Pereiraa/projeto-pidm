import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/themes';

import { auth } from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ onLogin, onGoToRegister }) {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(true);

  const handleFirebaseLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Login successful:", userCredential.user.email);
      
      onLogin(); 
      
    } catch (error) {
      console.log(error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        Alert.alert("Error", "Incorrect email or password.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email format.");
      } else {
        Alert.alert("Error", "Unable to sign in. Please try again later.");
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
        
        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons 
              name="restaurant-outline" 
              size={60} 
              color={isDark ? colors.background : "#FFFFFF"} 
            />
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>CHEF AT HOME</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="EMAIL"
            placeholderTextColor={colors.darkGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.inputPassword, { color: colors.text }]}
              placeholder="PASSWORD"
              placeholderTextColor={colors.darkGray}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={verSenha}
            />
            <TouchableOpacity onPress={() => setVerSenha(!verSenha)} style={styles.eyeIcon}>
              <Ionicons 
                name={verSenha ? "eye-outline" : "eye-off-outline"} 
                size={22} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={handleFirebaseLogin}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={onGoToRegister}
          >
            <Text style={[styles.registerText, { color: colors.text }]}>
              DON'T HAVE AN ACCOUNT YET?? <Text style={[styles.boldText, { color: colors.primary }]}>SIGN UP</Text>
            </Text>
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
    paddingVertical: 50,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  form: { width: '100%' },
  input: {
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 25,
  },
  inputPassword: { flex: 1, height: '100%', paddingHorizontal: 20 },
  eyeIcon: { paddingRight: 15 },
  loginButton: {
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 15,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  registerLink: { alignItems: 'center' },
  registerText: { fontSize: 12 },
  boldText: { fontWeight: 'bold', textDecorationLine: 'underline' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  line: { flex: 1, height: 1 },
  orText: { marginHorizontal: 15, fontSize: 14 },
  googleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  googleIcon: { width: 30, height: 30 },
});