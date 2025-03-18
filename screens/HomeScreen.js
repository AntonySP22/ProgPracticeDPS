import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.spacer} />
      {/* Encabezado con avatar y nombre */}
      <View style={styles.header}>
        <Image source={require('../assets/usuario.png')} style={styles.userAvatar} />
        <Text style={styles.welcomeText}>Bienvenido, Usuario</Text>
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

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Tu progreso en programación</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '30%' }]} />
        </View>
        <Text style={styles.percentageText}>30% completado</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="star" size={24} color="#FFD700" />
          <Text style={styles.statsText}>1,250 puntos</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="trophy" size={24} color="#FF5733" />
          <Text style={styles.statsText}>5 logros</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cursos en progreso</Text>
      <View style={styles.courseList}>
        <View style={styles.courseItem}>
          <Text style={styles.courseName}>Introducción a SQL</Text>
          <Text style={styles.courseStatus}>En Progreso</Text>
        </View>
        <View style={styles.courseItem}>
          <Text style={styles.courseName}>Introducción a Python</Text>
          <Text style={styles.courseStatus}>En Progreso</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cursos completados</Text>
      <View style={styles.courseList}>
        <View style={styles.courseItem}>
          <Text style={styles.courseName}>Desarrollo web</Text>
          <Text style={styles.courseStatus}>Completado</Text>
        </View>
        <View style={styles.courseItem}>
          <Text style={styles.courseName}>Introducción a C#</Text>
          <Text style={styles.courseStatus}>Completado</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exploreButton} onPress={() => navigateTo('CoursesScreen')}>
        <Text style={styles.exploreButtonText}>Explorar Cursos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  spacer: {
    height: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B297F1',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  menuButton: {
    padding: 5,
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
  progressContainer: {
    backgroundColor: '#E8F4FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#052659',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#C1E8FF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A86FF',
  },
  percentageText: {
    fontSize: 14,
    color: '#052659',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  statsText: {
    fontSize: 16,
    color: '#052659',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 10,
  },
  courseList: {
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  courseName: {
    fontSize: 16,
    color: '#052659',
  },
  courseStatus: {
    fontSize: 14,
    color: '#B297F1',
    fontWeight: 'bold',
  },
  exploreButton: {
    backgroundColor: '#B297F1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;