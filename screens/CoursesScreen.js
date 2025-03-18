import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView,Modal } 
from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const coursesData = {
  recommended: [
    { 
      id: '1', 
      title: 'HTML', 
      icon: require('../assets/html.png'),
      progress: 'Por Comenzar'
    },
    { 
      id: '2', 
      title: 'Java', 
      icon: require('../assets/java.png'),
      progress: 'Por Comenzar'
    },
    { 
      id: '3', 
      title: 'Python', 
      icon: require('../assets/pythonf.png'),
      progress: 'Completado'
    },
    { 
      id: '4', 
      title: 'Swift', 
      icon: require('../assets/swift.png'),
      progress: 'Por Comenzar'
    }
  ],
  recent: [
    { 
      id: '5', 
      title: 'Introducción a SQL', 
      icon: require('../assets/sql.png'),
      progress: 'En Progreso'
    }
  ]
};

const CoursesScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleCoursePress = (courseTitle) => {
    switch (courseTitle) {
      case 'HTML':
        navigation.navigate('HTMLIntroScreen');
        break;
      case 'Java':
        navigation.navigate('JavaIntroScreen');
        break;
      case 'Python':
        navigation.navigate('PythonIntro');
        break;
      case 'Swift':
        navigation.navigate('SwiftIntroScreen');
        break;
      case 'Introducción a SQL':
        navigation.navigate('SQLTheoryScreen', { courseTitle });
        break;
      default:
        navigation.navigate('SQLTheoryScreen', { courseTitle });
        break;
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.title)}
    >
      <Image source={item.icon} style={styles.courseImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={[
          styles.courseStatus,
          item.progress === 'En Progreso' && styles.inProgress,
          item.progress === 'Por Comenzar' && styles.notStarted,
          item.progress === 'Completado' && styles.completed
        ]}>
          {item.progress}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon}/>
          <TextInput
            placeholder="Buscar cursos..."
            placeholderTextColor="#FFFFFF"
            style={styles.searchInput}
          />
        </View>
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
        <Text style={styles.sectionHeader}>Cursos recomendados para ti</Text>
        <FlatList
          data={coursesData.recommended}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        <Text style={styles.sectionHeader}>Cursos vistos por última vez</Text>
        <FlatList
          data={coursesData.recent}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
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
    height: 120,
    width: '100%',
    backgroundColor: '#B297F1',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#052659',
    margin: 20,
    marginBottom: 10,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 2,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#052659',
    marginBottom: 4,
  },
  courseStatus: {
    fontSize: 14,
    fontWeight: '500',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  inProgress: {
    backgroundColor: '#E8F4FF',
    color: '#1A73E8',
  },
  notStarted: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  completed: {
    backgroundColor: '#E8F5E9',
    color: '#34A853',
  },
  scrollContainer: {
    flex: 1,
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


export default CoursesScreen;