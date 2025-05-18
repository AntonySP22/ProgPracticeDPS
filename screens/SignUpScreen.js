import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ImageBackground, ScrollView, Alert
} from 'react-native';
import { auth, db, firebaseTimestamp } from '../services/firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.length > 0) {
      setEmailError('');
    }
  };

  
  const checkEmailExists = async (email) => {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      return !snapshot.empty;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('El formato del correo electrónico no es válido');
      Alert.alert(
        'Formato de correo inválido', 
        'Por favor ingresa una dirección de correo válida (ejemplo@dominio.com)'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Por favor, verifica que ambas contraseñas sean iguales.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

  
    setIsLoading(true);

    try {
      
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert('Sin conexión', 'Verifica tu conexión a Internet e intenta nuevamente.');
        setIsLoading(false);
        return;
      }

      
      try {
        const methods = await auth.fetchSignInMethodsForEmail(email);
        if (methods && methods.length > 0) {
          // El email ya está registrado en Authentication
          Alert.alert(
            'Email ya registrado',
            'Ya existe una cuenta con este correo. ¿Deseas iniciar sesión?',
            [
              {
                text: 'Iniciar sesión',
                onPress: () => navigation.navigate('Login')
              },
              {
                text: 'Cancelar',
                style: 'cancel'
              }
            ]
          );
          setIsLoading(false);
          return;
        }
      } catch (error) {
        
        if (error.code === 'auth/invalid-email') {
          setEmailError('El formato del correo electrónico no es válido');
          Alert.alert(
            'Formato de correo inválido', 
            'Por favor ingresa una dirección de correo válida (ejemplo@dominio.com)'
          );
          setIsLoading(false);
          return;
        }
        console.log('Error al verificar métodos de inicio de sesión:', error);
      }

      
      console.log('Iniciando registro de usuario:', email);
      const userCredPromise = auth.createUserWithEmailAndPassword(email, password);

      // Añadir timeout para detectar problemas de red
      const userCred = await Promise.race([
        userCredPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tiempo de espera agotado')), 30000)
        )
      ]);

      const uid = userCred.user.uid;
      console.log('Usuario creado con ID:', uid);

      // 2. Guardar datos adicionales en Firestore
      await db.collection('users').doc(uid).set({
        nombre: name + " " + lastName,
        email: email,
        score: 0,
        achievements: [],
        completedChallenges: [],
        createdAt: firebaseTimestamp()
      });

      await AsyncStorage.setItem('userData', JSON.stringify({
        uid,
        email,
        nombre: name + " " + lastName,
        score: 0
      }));

      console.log('Datos guardados correctamente en Firestore y AsyncStorage');
      Alert.alert('Registro exitoso 🎉', 'Tu cuenta ha sido creada correctamente');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error detallado:', error);

      let errorMessage = 'Ocurrió un error durante el registro.';

      if (error.message === 'Tiempo de espera agotado') {
        errorMessage = 'La conexión está muy lenta. Verifica tu conexión a internet e intenta de nuevo.';
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Email ya registrado',
          'Ya existe una cuenta con este correo. ¿Deseas iniciar sesión?',
          [
            {
              text: 'Iniciar sesión',
              onPress: () => navigation.navigate('Login')
            },
            {
              text: 'Cancelar',
              style: 'cancel'
            }
          ]
        );
        setIsLoading(false);
        return;
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('El formato del correo electrónico no es válido');
        errorMessage = 'El formato del correo electrónico no es válido. Por favor, revisa que el correo tenga un formato correcto.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      } else if (error.code === 'auth/network-request-failed' || error.message?.includes('network')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Spinner de carga */}
        <Spinner
          visible={isLoading}
          textContent={'Creando cuenta...'}
          textStyle={styles.spinnerTextStyle}
          overlayColor="rgba(0, 0, 0, 0.7)"
        />

        <Image source={require('../assets/login-wave.png')} style={styles.waveTop} />
        <Text style={styles.title}>¡Bienvenido!</Text>

        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={name} 
            onChangeText={setName} 
            editable={!isLoading}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Apellido" 
            value={lastName} 
            onChangeText={setLastName} 
            editable={!isLoading}
          />
          <TextInput 
            style={[styles.input, emailError ? styles.inputError : null]} 
            placeholder="Correo electrónico" 
            value={email} 
            onChangeText={handleEmailChange} 
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <TextInput 
            style={styles.input} 
            placeholder="Contraseña" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            editable={!isLoading}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Confirmar contraseña" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry 
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.buttonContainer, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          <ImageBackground 
            source={require('../assets/button-bg-1.png')} 
            style={styles.buttonBackground} 
            resizeMode="stretch"
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
          <Text style={styles.link}>¿Ya tienes una cuenta? Inicia Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  waveTop: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 15,
    marginTop: -10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '60%',
    height: 70,
    marginVertical: 20,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    color: '#6200ee',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});

export default SignUpScreen;