import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import { auth } from "../firebaseConfig";
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });
  

  // Configuración de Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "998623523507-b528smf5n88un5n8ltt2sgj8kvjo73v.apps.googleusercontent.com",
    androidClientId: "998623523507-s44qvp08epltngrh0dk9ic65kgoaspkt.apps.googleusercontent.com", // 👈 AGREGA ESTO
    webClientId: "998623523507-b528smf5n88un5n8ltt2sgj8kvjo73v.apps.googleusercontent.com",
    redirectUri,
  });  
   

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const userData = userCredential.user;
          setUser(userData);
          SecureStore.setItemAsync("user", JSON.stringify(userData));
          navigation.navigate("Home", {
            name: userData.displayName,
            email: userData.email,
            photo: userData.photoURL,
          });
        })
        .catch((error) => console.error("Error al iniciar sesión", error));
    }
  }, [response]);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      console.log('Iniciar sesión con:', username, password);
      navigation.navigate('Home');
    } else {
      Alert.alert('Campos vacíos', 'Por favor ingresa usuario y contraseña', [{ text: 'OK' }]);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordScreen'); 
  };

  const handleGoBack = () => {
    navigation.navigate('Welcome', { animation: 'slide_from_left' });
  };

  return (
    <View style={styles.container}>
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
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>¿Olvidé mi contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer} activeOpacity={0.7}>
        <ImageBackground source={require('../assets/button-bg-1.png')} style={styles.buttonBackground} resizeMode="cover">
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Iniciar sesión con:</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon} onPress={() => promptAsync()}>
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
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 0,
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
  wavesBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
});

export default LoginScreen;