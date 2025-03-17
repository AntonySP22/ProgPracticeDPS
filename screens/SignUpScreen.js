import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Alert.alert(
        'Campos incompletos',
        'Por favor, completa todos los campos.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Contraseñas no coinciden',
        'Las contraseñas no coinciden. Por favor, verifica.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.replace('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image 
          source={require('../assets/login-wave.png')} 
          style={styles.waveTop} 
        />

        <Text style={styles.title}>¡Bienvenido!</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={lastName}
            onChangeText={setLastName}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handleRegister}
        >
          <ImageBackground
            source={require('../assets/button-bg-1.png')}
            style={styles.buttonBackground}
            resizeMode="stretch"
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
  buttonContainer: {
    width: '60%',
    height: 70,
    marginVertical: 20,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
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