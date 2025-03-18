import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Codigo = ({ navigation }) => {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length === 4) {
      Alert.alert('Éxito', 'Código verificado correctamente');
      navigation.navigate('MailScreen'); 
    } else {
      Alert.alert('Error', 'Por favor ingresa un código de 4 dígitos');
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
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Image 
          source={require('../assets/login-avatar.png')} 
          style={styles.avatar} 
        />

        <Text style={styles.title}>Verifica tu correo</Text>
        
        <Text style={styles.description}>
          Ingresa el código de 4 dígitos enviado a tu correo
        </Text>

        <View style={styles.codeContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={code[index] || ''}
              onChangeText={(text) => {
                const newCode = code.split('');
                newCode[index] = text;
                setCode(newCode.join(''));
              }}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, code.length !== 4 && styles.disabledButton]} 
          onPress={handleVerify}
          disabled={code.length !== 4} 
        >
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
    width: 155,
    height: 180,
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  codeInput: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  button: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
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

export default Codigo;