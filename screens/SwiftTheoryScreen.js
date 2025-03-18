import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SwiftTheoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-button.png')} 
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teoría de Swift</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Teoría básica de Swift</Text>
        <Text style={styles.text}>
          Swift es un lenguaje de programación relativamente nuevo diseñado por Apple Inc. que inicialmente se puso a disposición de los desarrolladores de Apple en 2014.
        </Text>

        <Text style={styles.subtitle}>Variables y constantes</Text>
        <Text style={styles.text}>
          Las variables son espacios de memoria en los que se pueden almacenar datos. En Swift, puedes declarar una variable usando la palabra clave var.
        </Text>
        <Text style={styles.code}>
          var nombre = "Juan"{"\n"}
          var edad = 27
        </Text>

        <Text style={styles.subtitle}>Tipos de datos</Text>
        <Text style={styles.text}>
          Swift admite varios tipos de datos, incluyendo:{"\n"}
          - Int: números enteros{"\n"}
          - Float y Double: números de punto flotante{"\n"}
          - Bool: valores booleanos verdadero o falso{"\n"}
          - String: cadenas de texto{"\n"}
          - Array: colecciones ordenadas de elementos del mismo tipo de datos
        </Text>

        <Text style={styles.subtitle}>Estructura if-else</Text>
        <Text style={styles.text}>
          La estructura if-else se usa para ejecutar una sección de código si se cumple una condición y otra sección de código si no se cumple.
        </Text>
        <Text style={styles.code}>
          if edad {'>'} 18 {"{"}{"\n"}
          {"    "}print("Eres mayor de edad"){"\n"}
          {"}"} else {"{"}{"\n"}
          {"    "}print("Eres menor de edad"){"\n"}
          {"}"}
        </Text>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.exercisesButton} 
            onPress={() => navigation.navigate('SwiftExercisesScreen')}
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

export default SwiftTheoryScreen;
