import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HTMLExercisesScreen = ({ navigation }) => {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const checkAnswers = () => {
    const correctAnswer1 = 'V';
    const correctAnswer2 = '<ul>\n  <li>Manzana</li>\n  <li>Banana</li>\n  <li>Naranja</li>\n</ul>';
    const correctAnswer3 = '<table>\n  <tr>\n    <td>Dato 1</td>\n    <td>Dato 2</td>\n  </tr>\n</table>';

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
            source={require('../assets/back-button.png')} // Botón de regreso
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ejercicios de HTML</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ejercicios de HTML</Text>
        <Text style={styles.text}>
          Aquí puedes practicar lo que has aprendido sobre HTML.
        </Text>

        <Text style={styles.subtitle}>Ejercicio 1: Verdadero o Falso</Text>
        <Text style={styles.text}>
          Indica si las siguientes afirmaciones son verdaderas (V) o falsas (F):
        </Text>
        <Text style={styles.text}>
          - {'<html>'} es la etiqueta que indica el inicio de un documento HTML. ___{'\n'}
          - {'<head>'} contiene el contenido principal de la página web. ___{'\n'}
          - {'<h1>'} se utiliza para crear un encabezado de nivel 1. ___{'\n'}
          - {'<p>'} se utiliza para crear un enlace. ___{'\n'}
          - {'<!DOCTYPE html>'} define el tipo de documento como HTML5. ___
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe 'V' o 'F' separados por comas (ej: V,F,V,F,V)"
          value={answer1}
          onChangeText={setAnswer1}
        />

        <Text style={styles.subtitle}>Ejercicio 2: Lista no ordenada</Text>
        <Text style={styles.text}>
          Escribe el código HTML para crear una lista no ordenada con tres elementos: "Manzana", "Banana" y "Naranja".
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu código aquí"
          value={answer2}
          onChangeText={setAnswer2}
          multiline
        />

        <Text style={styles.subtitle}>Ejercicio 3: Ordenar líneas para crear una tabla</Text>
        <Text style={styles.text}>
          Ordena las siguientes líneas para crear una tabla básica.
        </Text>
        <Text style={styles.code}>
          {'<td>'}Dato 1{'</td>'}{'\n'}
          {'<tr>'}{'\n'}
          {'<table>'}{'\n'}
          {'</tr>'}{'\n'}
          {'<td>'}Dato 2{'</td>'}{'\n'}
          {'</table>'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe el código ordenado aquí"
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

      {/* Barra de navegación inferior (Home y Perfil) */}
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
<<<<<<< HEAD
    fontSize: 24,
=======
    fontSize: 25,
>>>>>>> adan
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

<<<<<<< HEAD
export default HTMLExercisesScreen;
=======
export default HTMLExercisesScreen;
>>>>>>> adan
