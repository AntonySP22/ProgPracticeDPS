import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PythonIntroScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Introducción a Python</Text>
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

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/pythonf.png')} // Asegúrate de que la imagen esté en la carpeta assets
            style={styles.courseImage}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            En este curso, cubriremos los aspectos básicos de Python, crearemos proyectos reales y solucionaremos varios retos de programación. Python para Principiantes no requiere experiencia previa en programación, así que no esperes más!
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>8 horas</Text>
              <Text style={styles.detailBoxText}>Teoría y práctica</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>42</Text>
              <Text style={styles.detailBoxText}>Lecturas</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.learnButton}
            onPress={() => navigation.navigate('PythonTheoryScreen')} // Navegar a PythonTheoryScreen
          >
            <Image
              source={require('../assets/button-bg-1.png')} // Asegúrate de que la imagen esté en la carpeta assets
              style={styles.learnButtonBackground}
            />
            <Text style={styles.learnButtonText}>Aprender</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  courseImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#052659',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  detailBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A86FF',
  },
  detailBoxText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  learnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
  learnButtonBackground: {
    width: '100%',
    height: 60,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  learnButtonText: {
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

export default PythonIntroScreen;