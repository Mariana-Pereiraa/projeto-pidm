import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { useTheme } from '../styles/themes';

export default function EditProfileScreen({ onBack }) {
  const { colors, isDark } = useTheme();
  
  const [nome, setNome] = useState(auth.currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL);
  const [loading, setLoading] = useState(false);

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Access denied", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, 
      aspect: [1, 1],      
      quality: 0.7,        
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoURL(result.assets[0].uri); 
    }
  };

  const salvarAlteracoes = async () => {
    if (!nome.trim()) {
      Alert.alert("Error", "Name is required.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: nome.trim(),
        photoURL: photoURL 
      });

      await auth.currentUser.reload();

      Alert.alert("Sucess", "Profile updated successfully!", [
        { text: "OK", onPress: () => setTimeout(() => onBack(), 500) }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Settings</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primary }]}>EDIT PROFILE</Text>

      <View style={styles.photoContainer}>
        <TouchableOpacity onPress={escolherFoto} activeOpacity={0.8} disabled={loading}>
          <View style={[styles.imageWrapper, { borderColor: colors.primary }]}>
            {photoURL ? (
              <Image 
                key={photoURL} 
                source={{ uri: photoURL }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={[styles.placeholder, { backgroundColor: colors.surface }]}>
                <Ionicons name="person" size={50} color={colors.darkGray} />
              </View>
            )}

            <View style={[styles.cameraBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[styles.photoInstructions, { color: colors.darkGray }]}>
          Tap to change the photo
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={[styles.label, { color: colors.primary }]}>USERNAME</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.surface, 
            color: colors.text, 
            borderColor: colors.border,
            borderWidth: isDark ? 1 : 0.5
          }]}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor={isDark ? "#FFFFFF" : "#888"}
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={salvarAlteracoes}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>SAVE CHANGES</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 50, 
    paddingBottom: 30 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  backText: { 
    fontSize: 16, 
    marginLeft: 8, 
    fontWeight: '500' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  photoContainer: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  imageWrapper: { 
    width: 120,
    height: 120, 
    borderRadius: 60, 
    borderWidth: 3, 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 60,
    overflow: 'hidden',
    resizeMode: 'cover'
  },
  placeholder: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cameraBadge: { 
    position: 'absolute', 
    bottom: -5,
    right: -5,
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  photoInstructions: { 
    marginTop: 15, 
    fontSize: 12 
  },
  inputSection: { 
    width: '100%', 
    marginBottom: 40 
  },
  label: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    marginLeft: 4 
  },
  input: { 
    height: 50,
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 16 
  },
  saveButton: { 
    height: 55, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  saveButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});