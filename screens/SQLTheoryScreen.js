import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SQLTheoryScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
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
        <Text style={styles.headerTitle}>Teoría de SQL</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('CoursesScreen')}>
              <Text style={styles.menuItemText}>Cursos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
              <Text style={styles.menuItemText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('ProfileScreen')}>
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('HelpScreen')}>
              <Text style={styles.menuItemText}>Ayuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Teoría básica de SQL</Text>
        <Text style={styles.text}>
          SQL (Structured Query Language) es un lenguaje estándar para interactuar con bases de datos relacionales. Permite realizar operaciones de consulta, actualización, eliminación e inserción de datos.
        </Text>

        <Text style={styles.subtitle}>Consulta básica en SQL</Text>
        <Text style={styles.text}>
          Una de las primeras cosas que aprenderás en SQL es cómo hacer consultas simples para recuperar datos de una base de datos.
        </Text>
        <Text style={styles.code}>
          SELECT * FROM empleados;
        </Text>

        <Text style={styles.subtitle}>Crear una tabla</Text>
        <Text style={styles.text}>
          SQL también se utiliza para definir la estructura de las bases de datos, como la creación de tablas.
        </Text>
        <Text style={styles.code}>
          CREATE TABLE empleados ({"\n"}
          {"  "}id INT PRIMARY KEY,{"\n"}
          {"  "}nombre VARCHAR(50),{"\n"}
          {"  "}salario DECIMAL(10, 2){"\n"}
          );
        </Text>

        <Text style={styles.subtitle}>Insertar datos</Text>
        <Text style={styles.text}>
          Una vez que tenemos una tabla, podemos insertar datos en ella utilizando la instrucción `INSERT`.
        </Text>
        <Text style={styles.code}>
          INSERT INTO empleados (id, nombre, salario) VALUES (1, 'Juan Perez', 3000.00);
        </Text>

        <Text style={styles.subtitle}>Actualizar datos</Text>
        <Text style={styles.text}>
          Con SQL también podemos actualizar datos que ya existen en una tabla.
        </Text>
        <Text style={styles.code}>
          UPDATE empleados SET salario = 3500.00 WHERE id = 1;
        </Text>

        <Text style={styles.subtitle}>Eliminar datos</Text>
        <Text style={styles.text}>
          También es posible eliminar registros de una tabla usando la instrucción `DELETE`.
        </Text>
        <Text style={styles.code}>
          DELETE FROM empleados WHERE id = 1;
        </Text>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.exercisesButton} 
            onPress={() => navigation.navigate('SQLExercises')}
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
    flex: 1,
  },
  menuButton: {
    marginLeft: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#052659',
    fontWeight: 'bold',
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

export default SQLTheoryScreen;