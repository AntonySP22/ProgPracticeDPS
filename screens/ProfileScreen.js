import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../services/firebase';
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('El Salvador');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.uid);
          setUsername(parsedData.nombre || '');
          setEmail(parsedData.email || '');
          setProfileImage(parsedData.profileImage || null);

          // Cargar datos adicionales de Firestore
          if (parsedData.uid) {
            const userDoc = await db.collection('users').doc(parsedData.uid).get();
            if (userDoc.exists) {
              const firestoreData = userDoc.data();
              setBio(firestoreData.bio || '');

              if (firestoreData.profileImage &&
                (firestoreData.profileImage.startsWith('http') ||
                  firestoreData.profileImage.startsWith('https'))) {
                setProfileImage(firestoreData.profileImage);
              }
            }
          }
        } else {
         
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUserId(currentUser.uid);
            setEmail(currentUser.email || '');

            // Cargar datos desde Firestore
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
              const firestoreData = userDoc.data();
              setUsername(firestoreData.nombre || '');
              setBio(firestoreData.bio || '');

              if (firestoreData.profileImage &&
                (firestoreData.profileImage.startsWith('http') ||
                  firestoreData.profileImage.startsWith('https'))) {
                setProfileImage(firestoreData.profileImage);
              }
            }
          } else {
            // Usuario no autenticado
            Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
            navigation.navigate('Login');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar tus datos');
      }
    };

    loadUserData();
  }, []);


  const pickImage = async () => {
  try {
    // Verificar autenticación
    if (!userId || !auth.currentUser) {
      Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
      navigation.navigate('Login');
      return;
    }

    // Solicitar permisos
    console.log('Solicitando permisos de galería...');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado', 
        'Necesitamos acceso a tu galería para cambiar la foto de perfil.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Abrir selector de imágenes
    console.log('Abriendo selector de imágenes...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      maxWidth: 500, 
      maxHeight: 500
    });

    // Procesar resultado
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      console.log('Imagen seleccionada, URI:', selectedImage.uri.substring(0, 30) + '...');
      
      // Verificar tamaño antes de subir
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
        Alert.alert(
          'Imagen demasiado grande',
          'Por favor selecciona una imagen más pequeña (menos de 5MB)',
          [{ text: 'Entendido' }]
        );
        return;
      }
      
      // Iniciar proceso de subida
      setImageUploading(true);
      setUploadProgress(0);

      try {
       
        const imageUrl = await uploadImage(selectedImage.uri);
        console.log('Imagen procesada correctamente:', imageUrl.substring(0, 30) + '...');
        setProfileImage(imageUrl);
        
        await syncUserData(imageUrl);
        
        Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada');
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        Alert.alert('Error', 'No se pudo subir la imagen. Se usará un avatar predeterminado.');
        const fallbackUrl = 'https://firebasestorage.googleapis.com/v0/b/progpractice-b4a2a.appspot.com/o/avatars%2Fdefault.png?alt=media';
        setProfileImage(fallbackUrl);
        await syncUserData(fallbackUrl);
      } finally {
        setImageUploading(false);
      }
    }
  } catch (error) {
    console.error('Error al seleccionar imagen:', error);
    Alert.alert('Error', 'No se pudo acceder a la galería de imágenes.');
    setImageUploading(false);
  }
};



  const uploadImage = async (uri) => {
  try {
    if (!userId) {
      console.error('No hay user ID disponible');
      throw new Error("Usuario no autenticado");
    }
    
    console.log('Preparando subida de imagen. User ID:', userId);
    console.log('URI:', uri.substring(0, 30) + '...');
    
    console.log('Obteniendo blob de la imagen...');
    let blob;
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      blob = await response.blob();
      console.log('Blob creado, tamaño:', blob.size, 'bytes');
    } catch (blobError) {
      console.error('Error al crear blob:', blobError);
      throw new Error('No se pudo procesar la imagen seleccionada');
    }
    
    // Crear nombre de archivo único
    const timestamp = Date.now();
    const filename = `profile_${userId}_${timestamp}.jpg`;
    const fullPath = `profile_images/${filename}`;
    console.log('Ruta de destino:', fullPath);
    
    
    const useLocalUri = true; //subir a Firebase
    
    if (useLocalUri) {
      console.log(' Usando URI local para mostrar la imagen');
      setUploadProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(40);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(60);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(100);
      
      
      if (userId) {
        try {
          await db.collection('users').doc(userId).update({
            localImageUri: uri,
            profileImage: uri, 
            lastUpdated: new Date()
          });
          console.log('✓ URI guardada en Firestore');
        } catch (firestoreError) {
          console.error('Error al guardar en Firestore:', firestoreError);
        }
      }
      
      return uri;
    } else {
      
      try {
        const storageRef = storage.ref().child(fullPath);
        console.log('Iniciando subida a Firebase...');
        
        const uploadTask = storageRef.put(blob);
        
        
        uploadTask.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso: ${progress.toFixed(2)}%`);
          setUploadProgress(progress);
        });
        
       
        await uploadTask;
        console.log('Subida completada');
        
        // Obtener URL
        const downloadURL = await storageRef.getDownloadURL();
        console.log('URL obtenida:', downloadURL.substring(0, 30) + '...');
        return downloadURL;
      } catch (uploadError) {
        console.error('Error en la subida a Firebase:', uploadError);
        throw uploadError;
      }
    }
  } catch (error) {
    console.error('Error general en uploadImage:', error);
    return 'https://firebasestorage.googleapis.com/v0/b/progpractice-b4a2a.appspot.com/o/avatars%2Fdefault.png?alt=media';
  }
};

// 3. Función para sincronizar datos 
const syncUserData = async (imageUrl) => {
  console.log('Sincronizando datos de usuario con imagen:', imageUrl.substring(0, 30) + '...');
  
  try {
    const storedUserData = await AsyncStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      const updatedData = {
        ...parsedData,
        profileImage: imageUrl 
      };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      console.log('✓ Datos sincronizados en AsyncStorage');
    } else {
      console.warn('No se encontraron datos en AsyncStorage para sincronizar');
    }
  } catch (error) {
    console.error('Error sincronizando datos:', error);
  }
};


  // Función para guardar el perfil
  const handleSaveProfile = async () => {
  if (!username.trim()) {
    Alert.alert('Campo requerido', 'El nombre de usuario es obligatorio');
    return;
  }

  try {
    setIsLoading(true);

    // Preparar datos a actualizar
    const dataToUpdate = {
      nombre: username.trim(),
      bio: bio.trim(),
      lastUpdated: new Date()
    };

    if (profileImage) {
      dataToUpdate.profileImage = profileImage;
    }

    // Actualizar datos en Firestore
    if (userId) {
      await db.collection('users').doc(userId).update(dataToUpdate);

      // Actualizar AsyncStorage
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          const updatedData = {
            ...parsedData,
            nombre: username.trim(),
            profileImage: profileImage
          };
          await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          console.log('Datos actualizados en AsyncStorage después de guardar perfil');
        }
      } catch (storageError) {
        console.error('Error con AsyncStorage:', storageError);
      }

      Alert.alert('¡Éxito!', 'Tu perfil ha sido actualizado');
    } else {
      throw new Error('ID de usuario no disponible');
    }
  } catch (error) {
    console.error('Error al guardar perfil:', error);
    Alert.alert('Error', 'No se pudo guardar tu perfil');
  } finally {
    setIsLoading(false);
  }
};

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userData');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header y menú igual... */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar..."
            placeholderTextColor="#FFFFFF"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('CoursesScreen')}>
              <Text style={styles.menuItemText}>Cursos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
              <Text style={styles.menuItemText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('ProfileScreen')}>
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('HelpScreen')}>
              <Text style={styles.menuItemText}>Ayuda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>INFORMACIÓN PERSONAL</Text>

        {/* Sección de imagen de perfil con progreso */}
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
              source={profileImage ? { uri: profileImage } : require('../assets/usuario.png')}
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
  header: {
    height: 120,
    width: '100%',
    backgroundColor: '#B297F1',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  menuButton: {
    marginLeft: 10,
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#052659',
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