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

      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Iniciar sesión con:</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon}>
          <Image source={require('../assets/google-icon.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Image source={require('../assets/facebook-icon.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Image source={require('../assets/twitter-icon.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Image source={require('../assets/apple-icon.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
      </View>
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
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  socialIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconImage: {
    width: 30,
    height: 30,
  },
});

export default WelcomeScreen;
