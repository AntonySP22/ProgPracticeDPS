import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../services/firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import logger from '../services/logger';
import NetInfo from '@react-native-community/netinfo';
import sessionStorage from '../services/sessionStorage';

// Alternativa temporal por si AsyncStorage falla
const tempStorage = {
  userData: null,
  setItem: function(key, value) {
    this.userData = value;
    console.log('Datos guardados en almacenamiento temporal');
    return Promise.resolve();
  },
  getItem: function(key) {
    return Promise.resolve(this.userData);
  }
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        'Campos vacíos',
        'Por favor ingresa usuario y contraseña',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isValidEmail(username)) {
      Alert.alert(
        'Formato de correo inválido',
        'Por favor ingresa una dirección de correo válida (ejemplo@dominio.com)',
        [{ text: 'Entendido' }]
      );
      return;
    }

    
    console.log('Intentando iniciar sesión con:', username);

    
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert(
          'Sin conexión',
          'Por favor verifica tu conexión a internet e intenta nuevamente',
          [{ text: 'Entendido' }]
        );
        return;
      }
      setIsLoading(true);

      if (!auth) {
        throw new Error('Firebase Auth no está inicializado correctamente');
      }


      console.log('Autenticando con Firebase...');
      const userCredential = await auth.signInWithEmailAndPassword(username, password);
      const uid = userCredential.user.uid;
      
      console.log('Inicio de sesión exitoso con UID:', uid);

  
      console.log('Obteniendo datos del usuario...');
      const userDoc = await db.collection('users').doc(uid).get();

      if (userDoc.exists) {
       
        const userData = userDoc.data();
        
        console.log('Datos del usuario obtenidos:', userData);


        const userDataObj = {
          uid,
          email: username,
          nombre: userData.nombre || '',
          profileImage: userData.profileImage || '',
          score: userData.score || 0
        };


        try {
          await sessionStorage.setItem('userData', JSON.stringify(userDataObj));
          console.log('Datos de usuario guardados correctamente en sessionStorage');
        } catch (error) {
          console.error('Error al guardar datos de usuario:', error);
        }
        
        navigation.navigate('Home');
      } else {
        // El usuario no existe en Firestore
        console.log('Usuario no encontrado en Firestore');
        await auth.signOut();
        Alert.alert(
          'Cuenta incompleta',
          'Tu cuenta no está registrada correctamente. Por favor regístrate de nuevo.',
          [
            {
              text: 'Registrarme',
              onPress: () => navigation.navigate('SignUp')
            },
            {
              text: 'Cancelar',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error.message);
      
      
      let errorInfo;
      try {
        errorInfo = logger.authError(error);
      } catch (loggerError) {
        console.error('Error en logger:', loggerError);
        errorInfo = {
          title: 'Error de inicio de sesión',
          message: 'No se pudo iniciar sesión. Por favor verifica tus credenciales e intenta nuevamente.'
        };
      }

  
      Alert.alert(
        errorInfo.title,
        errorInfo.message,
        [{ text: 'Entendido' }]
      );
    } finally {
    
      setIsLoading(false);
    }
  };


  const handleForgotPassword = () => {
    navigation.navigate('PasswordScreen');
  };

  const handleGoBack = () => {
    navigation.navigate('Welcome', {
      animation: 'slide_from_left',
    });
  };

  return (
    <View style={styles.container}>
      {/* Spinner de carga */}
      <Spinner
        visible={isLoading}
        textContent={'Iniciando sesión...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(0, 0, 0, 0.7)"
      />

      <Image source={require('../assets/login-wave.png')} style={styles.wavesTop} />

      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#6200ee" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Image source={require('../assets/login-avatar.png')} style={styles.avatar} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
        <Text style={styles.forgotPasswordText}>¿Olvidé mi contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.buttonContainer, isLoading && styles.buttonDisabled]}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <ImageBackground
          source={require('../assets/button-bg-1.png')}
          style={styles.buttonBackground}
          resizeMode="cover"
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* Sección de separación (opcional) */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Iniciar sesión con:</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Social login section - REMOVIDO
      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>O inicia sesión con:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Image source={require('../assets/google-icon.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Image source={require('../assets/facebook-icon.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
            <Image source={require('../assets/apple-icon.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleTwitterLogin}>
            <Image source={require('../assets/twitter-icon.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
      */}

      <Image source={require('../assets/waves.png')} style={styles.wavesBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  wavesTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  avatar: {
    width: 90,
    height: 90,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  forgotPasswordText: {
    color: '#6200ee',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '60%',
    height: 70,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialContainer: {
    width: '80%',
    marginBottom: 0,
    alignItems: 'center',
  },
  socialText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  socialButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  wavesBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
});

export default LoginScreen;