import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SwiftExercisesScreen = ({ navigation }) => {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const checkAnswers = () => {
    const correctAnswer1 = 'let constante = 10\nvar variable = "Hola"';
    const correctAnswer2 = 'for numero in 1...5 {\n  print(numero)\n}';
    const correctAnswer3 = 'let numeros = [1, 2, 3, 4, 5]\nfor numero in numeros {\n  print(numero)\n}';

    if (answer1.trim() === correctAnswer1 && answer2.trim() === correctAnswer2 && answer3.trim() === correctAnswer3) {
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
        <Text style={styles.headerTitle}>Ejercicios de Swift</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ejercicios de Swift</Text>
        <Text style={styles.text}>
          Aquí puedes practicar lo que has aprendido sobre Swift.
        </Text>

        <Text style={styles.subtitle}>Ejercicio 1: Declarar una constante y una variable</Text>
        <Text style={styles.text}>
          Completa el código para declarar una constante y una variable.
        </Text>
        <Text style={styles.code}>
          let __ = 10{'\n'}
          var __ = "Hola"
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu código aquí"
          value={answer1}
          onChangeText={setAnswer1}
          multiline
        />

        <Text style={styles.subtitle}>Ejercicio 2: Bucle for</Text>
        <Text style={styles.text}>
          Arrastra las palabras correctas para completar el código que implementa un bucle for para imprimir los números del 1 al 5.
        </Text>
        <Text style={styles.code}>
          for ______ in 1...5 {'{\n'}
          {'  '}______(______){'\n'}
          {'}'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu código aquí"
          value={answer2}
          onChangeText={setAnswer2}
          multiline
        />

        <Text style={styles.subtitle}>Ejercicio 3: Array y bucle for</Text>
        <Text style={styles.text}>
          Crea un array de números enteros y escribe un bucle for para imprimir cada número.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu código aquí"
          value={answer3}
          onChangeText={setAnswer3}
          multiline
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
  code: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#2D2D2D',
    marginVertical: 10,
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

export default SwiftExercisesScreen;