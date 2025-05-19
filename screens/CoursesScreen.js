import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllCourses } from '../services/courseService';

const CoursesScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Cargar cursos al iniciar
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getAllCourses();
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error cargando cursos:', error);
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filtrar cursos cuando cambia el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchText.toLowerCase()) ||
        course.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchText, courses]);

  const handleCoursePress = (courseId) => {
    navigation.navigate('CourseIntroScreen', { courseId });
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  const renderCourseItem = ({ item }) => {
    // Function to get appropriate image URL for each course
    const getImageUrl = (courseId) => {
      // Map of reliable image URLs for each course type
      const courseImages = {
        'python': 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
        'java': 'https://cdn-icons-png.flaticon.com/512/5968/5968282.png',
        'html': 'https://cdn-icons-png.flaticon.com/512/5968/5968267.png',
        'swift': 'https://cdn-icons-png.flaticon.com/512/919/919833.png',
        'sql': 'https://cdn-icons-png.flaticon.com/512/4248/4248443.png'
      };
      
      // Return the mapped URL or a placeholder
      return courseImages[courseId] || 'https://via.placeholder.com/60x60?text=' + item.title;
    };

    return (
      <TouchableOpacity 
        style={styles.courseCard}
        onPress={() => handleCoursePress(item.id)}
      >
        <Image 
          source={{ uri: getImageUrl(item.id) }}
          style={styles.courseImage} 
          resizeMode="contain"
          defaultSource={require('../assets/placeholder.png')}
          onError={(e) => {
            console.log(`Error loading image for ${item.id}: ${e.nativeEvent.error}`);
          }}
        />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseDetails}>
            {item.level} • {item.duration}
          </Text>
          <Text style={styles.courseDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon}/>
          <TextInput
            placeholder="Buscar cursos..."
            placeholderTextColor="#FFFFFF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Cargando cursos...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Todos los cursos</Text>
          <FlatList
            data={filteredCourses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.coursesList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No se encontraron cursos
              </Text>
            }
          />
        </>
      )}

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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#052659',
    margin: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  coursesList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    overflow: 'hidden', // Garantiza que la imagen se mantenga dentro del contenedor
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
  courseDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#444',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontStyle: 'italic',
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