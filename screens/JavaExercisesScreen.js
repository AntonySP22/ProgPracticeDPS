import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const JavaExercisesScreen = ({ navigation }) => {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const checkAnswers = () => {
    const correctAnswer1 = 'Verdadero';
    const correctAnswer2 = 'int precioEntero = (int) precio;';
    const correctAnswer3 = 'for (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}';

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
        <Text style={styles.headerTitle}>Ejercicios de Java</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ejercicios de Java</Text>
        <Text style={styles.text}>
          Aquí puedes practicar lo que has aprendido sobre Java.
        </Text>

        <Text style={styles.subtitle}>Ejercicio 1: Declaración del método main</Text>
        <Text style={styles.text}>
          ¿Es correcta la declaración del método main?
        </Text>
        <Text style={styles.code}>
          public class Main {'{\n'}
          {'    '}public static void main(String[] args) {'{\n'}
          {'    '}System.out.println("Hola Mundo");{'\n'}
          {'    }\n'}
          {'}'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe 'Verdadero' o 'Falso'"
          value={answer1}
          onChangeText={setAnswer1}
        />

        <Text style={styles.subtitle}>Ejercicio 2: Corrección de código</Text>
        <Text style={styles.text}>
          Encuentra y corrige el error en el siguiente código.
        </Text>
        <Text style={styles.code}>
          public class Main {'{\n'}
          {'    '}public static void main(String[] args) {'{\n'}
          {'    '}double precio = 19.99;{'\n'}
          {'    '}int precioEntero = precio;{'\n'}
          {'    '}System.out.println(precioEntero);{'\n'}
          {'    }\n'}
          {'}'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe la corrección aquí"
          value={answer2}
          onChangeText={setAnswer2}
        />

        <Text style={styles.subtitle}>Ejercicio 3: Bucle for</Text>
        <Text style={styles.text}>
          Escribe un programa que imprima los números del 1 al 5 usando un bucle for.
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

export default JavaExercisesScreen;