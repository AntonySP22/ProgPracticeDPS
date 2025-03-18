import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const PasswordSuccessScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground 
        source={require('../assets/login-wave.png')} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Image 
          source={require('../assets/Avatar-check.png')} 
          style={styles.avatar} 
        />

        <Text style={styles.title}>Contraseña creada</Text>
        
        <Text style={styles.description}>
          Contraseña cambiada con éxito
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <ImageBackground
            source={require('../assets/button-bg-1.png')}
            style={styles.buttonBackground}
            resizeMode="cover"
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
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
    marginTop: -40,
  },
  avatar: {
    width: 180,
    height: 210,
    marginBottom: 25,
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
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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

export default PasswordSuccessScreen;