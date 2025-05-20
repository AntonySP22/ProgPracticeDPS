import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/waves-top.png')} style={styles.waves} />

      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonContainer}>
        <ImageBackground
          source={require('../assets/button-bg-1.png')}
          style={styles.buttonBackground}
          resizeMode="cover"
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.buttonContainer}>
        <ImageBackground
          source={require('../assets/button-bg-2.png')}
          style={styles.buttonBackground}
          resizeMode="cover"
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </ImageBackground>
      </TouchableOpacity>
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
  waves: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 50, // Added extra margin at bottom to compensate for removed elements
  },
  logo: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    width: '65%',
    height: 70,
    marginBottom: 15,
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
    marginBottom: 6,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;

