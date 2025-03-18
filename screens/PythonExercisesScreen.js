import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PythonExercisesScreen = ({ navigation }) => {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const checkAnswers = () => {
    const correctAnswer1 = 'print("Hola Mundo")';
    const correctAnswer2 = 'print(a + b)';

    if (answer1.trim() === correctAnswer1 && answer2.trim() === correctAnswer2) {
      Alert.alert('¡Correcto!', 'Todas las respuestas son correctas.');
    } else {
      Alert.alert('Incorrecto', 'Algunas respuestas no son correctas. Revisa nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-button.png')} 
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ejercicios de Python</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ejercicios de Python</Text>
        <Text style={styles.text}>
          Aquí puedes practicar lo que has aprendido sobre Python.
        </Text>

        <Text style={styles.subtitle}>Ejercicio 1: Hola Mundo</Text>
        <Text style={styles.text}>
          Escribe un programa que imprima "Hola Mundo" en la consola.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu respuesta aquí"
          value={answer1}
          onChangeText={setAnswer1}
        />

        <Text style={styles.subtitle}>Ejercicio 2: Suma de Variables</Text>
        <Text style={styles.text}>
          Declara dos variables, asígnales valores y luego imprime la suma de ambas.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu respuesta aquí"
          value={answer2}
          onChangeText={setAnswer2}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={checkAnswers}>
            <Image
              source={require('../assets/button-bg-1.png')}
              style={styles.buttonBackground}
            />
            <Text style={styles.buttonText}>Comprobar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../assets/button-bg-1.png')}
              style={styles.buttonBackground}
            />
            <Text style={styles.buttonText}>Regresar al curso</Text>
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
    backgroundColor: '#B297F1', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 40, 
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#2D2D2D',
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    color: '#2D2D2D',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 180,
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonBackground: {
    width: 180,
    height: 50,
    resizeMode: 'center',
    borderRadius: 30,
  },
  buttonText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

export default PythonExercisesScreen;