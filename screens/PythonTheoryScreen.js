import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PythonTheoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-button.png')} 
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teoría de Python</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Teoría básica de Python</Text>
        <Text style={styles.text}>
          Python es un lenguaje de programación potente y fácil de aprender. Tiene estructuras de datos de alto nivel eficientes y un simple pero efectivo sistema de programación orientado a objetos.
        </Text>

        <Text style={styles.subtitle}>Hola mundo en Python</Text>
        <Text style={styles.text}>
          Si ejecutas el siguiente código, habrás cumplido el primer hito de la programación en Python.
        </Text>
        <Text style={styles.code}>print("Hola Mundo")</Text>

        <Text style={styles.subtitle}>Crear variables</Text>
        <Text style={styles.text}>
          Las variables en Python se pueden crear asignando un valor a un nombre sin necesidad de declararla antes.
        </Text>
        <Text style={styles.code}>
          x = 10{"\n"}
          y = "Nombre"{"\n"}
          z = 3.9
        </Text>

        <Text style={styles.subtitle}>Sumando variables en Python</Text>
        <Text style={styles.text}>
          Vamos a sumar dos variables e imprimir su valor. Lo primero vamos a declararlas, con nombres a y b. Declarar una variable significa "crearla".
        </Text>
        <Text style={styles.code}>
          a = 3{"\n"}
          b = 7{"\n"}
          print(a + b)
        </Text>

        <View style={styles.bottomContainer}>
        <TouchableOpacity 
  style={styles.exercisesButton} 
  onPress={() => navigation.navigate('PythonExercises')}
>
  <Image
    source={require('../assets/button-bg-2.png')} 
    style={styles.exercisesButtonBackground}
  />
  <Text style={styles.exercisesButtonText}>Ejercicios</Text>
</TouchableOpacity>
          <Image source={require('../assets/login-avatar.png')} style={styles.avatar} />
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',  
    marginTop: 20,
    marginBottom: 40,  
  },
  
  exercisesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 180, 
    height: 50, 
    borderRadius: 30, 
  },  
  exercisesButtonBackground: {
    width: 180, 
    height: 50, 
    resizeMode: 'center',
    borderRadius: 30, 
  },
  exercisesButtonText: {
    position: 'absolute',
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 5,
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

export default PythonTheoryScreen;