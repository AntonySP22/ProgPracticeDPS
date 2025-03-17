import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const PasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (email.trim()) {
      navigation.navigate('MailScreen'); 
    } else {
      alert('Por favor ingresa tu correo electrónico');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground 
        source={require('../assets/login-wave.png')} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Image 
          source={require('../assets/avatar-password.png')} 
          style={styles.avatar} 
        />

        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        <Text style={styles.description}>
          Ingresa tu correo electrónico para recibir un código de verificación
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Codigo')}>
  <ImageBackground
    source={require('../assets/button-bg-1.png')}
    style={styles.buttonBackground}
    resizeMode="cover"
  >
    <Text style={styles.buttonText}>Enviar código</Text>
  </ImageBackground>
</TouchableOpacity>
      </View>

      <Image 
        source={require('../assets/waves.png')} 
        style={styles.wavesBottom} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 200,
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: -50,
  },
  avatar: {
    width: 110,          
    height: 160,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 25,
    marginBottom: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowRadius: 6,
    elevation: 5,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  wavesBottom: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    marginTop: 'auto',
  },
});

export default PasswordScreen;