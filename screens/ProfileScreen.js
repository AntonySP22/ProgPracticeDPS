import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../services/firebase';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('El Salvador');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Check for locally stored image first
        const localImageUri = await AsyncStorage.getItem('localProfileImage');
        if (localImageUri) {
          setProfileImage(localImageUri);
        }
        
        // Get user data from AsyncStorage
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserId(parsedData.uid);
          setUsername(parsedData.nombre || '');
          setEmail(parsedData.email || '');
          setBio(parsedData.bio || '');
          
          // Use the locally stored image if available, otherwise use stored one
          if (!localImageUri && parsedData.profileImage) {
            setProfileImage(parsedData.profileImage);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets[0].uri) {
        // Set the image directly to state (for immediate visual feedback)
        setProfileImage(result.assets[0].uri);
        
        // Save the image URI to AsyncStorage
        await AsyncStorage.setItem('localProfileImage', result.assets[0].uri);
        
        // Update local userData with the image path
        if (userId) {
          await AsyncStorage.setItem('userData', JSON.stringify({
            ...(userData || {}),
            profileImage: result.assets[0].uri
          }));
        }
        
        Alert.alert('Éxito', 'La imagen de perfil ha sido actualizada localmente');
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo cambiar la imagen de perfil');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`profileImages/${userId}/${Date.now()}`);
      
      const uploadTask = fileRef.put(blob);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            console.log('Upload progress: ', progress);
          },
          (error) => {
            console.error('Error subiendo imagen:', error);
            reject(error);
          },
          async () => {
            const downloadUrl = await fileRef.getDownloadURL();
            resolve(downloadUrl);
          }
        );
      });
    } catch (error) {
      console.error('Error preparando imagen para subir:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Intenta nuevamente.');
      return null;
    }
  };

  const syncUserData = async (imageUrl) => {
    try {
      await db.collection('users').doc(userId).update({
        profileImage: imageUrl
      });
      
      // Actualizar AsyncStorage
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        userData.profileImage = imageUrl;
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error sincronizando datos:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      Alert.alert('Error', 'No hay usuario conectado');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update local user data
      const updatedUserData = {
        uid: userId,
        nombre: username,
        email: email,
        bio: bio,
        profileImage: profileImage,
        country: country
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      Alert.alert('Perfil actualizado', 'Tus cambios han sido guardados localmente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userData');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Guardando cambios...</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>INFORMACIÓN PERSONAL</Text>

        <View style={styles.profileContainer}>
          {imageUploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#B297F1" />
              {uploadProgress > 0 && (
                <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
              )}
            </View>
          ) : (
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/usuario.jpg')}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity style={styles.changeButton} onPress={pickImage} disabled={imageUploading}>
            <Text style={styles.changeText}>{imageUploading ? 'Subiendo...' : 'Cambiar foto'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Dirección de correo electrónico</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#E5E5E5' }]}
            placeholder="correo@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={false}
          />

          <Text style={styles.label}>Biografía</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Descríbete..."
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Text style={styles.label}>País</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#E5E5E5' }]}
            value={country}
            editable={false}
          />

          <TouchableOpacity
            style={[styles.saveButton, (isLoading || imageUploading) && { opacity: 0.7 }]}
            onPress={handleSaveProfile}
            disabled={isLoading || imageUploading}
          >
            <Text style={styles.saveText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={28} color="#B297F1" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Icon name="person" size={28} color="#B297F1" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
  header: {
    height: 120,
    width: '100%',
    backgroundColor: '#B297F1',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: '#B297F1',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#052659',
    marginTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
  },
  changeButton: {
    backgroundColor: '#B297F1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#B297F1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    height: 70,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    color: '#B297F1',
    marginTop: 4,
  },
});

export default ProfileScreen;