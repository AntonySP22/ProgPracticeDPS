// screens/CourseIntroScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCourseById } from '../services/courseService';

const CourseIntroScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseById(courseId);
        setCourseData(data);
      } catch (error) {
        console.error('Error al cargar datos del curso:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourseData();
  }, [courseId]);

  if (isLoading || !courseData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-button.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseData.title}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: courseData.imageUrl }}
            style={styles.courseImage}
            defaultSource={require('../assets/placeholder.png')}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{courseData.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>{courseData.duration}</Text>
              <Text style={styles.detailBoxText}>Teoría y práctica</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>
                {courseData.lessons ? courseData.lessons.length : 0}
              </Text>
              <Text style={styles.detailBoxText}>Lecturas</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.learnButton}
            onPress={() => navigation.navigate('CourseLessonsListScreen', { courseId })}
          >
            <Image
              source={require('../assets/button-bg-1.png')}
              style={styles.learnButtonBackground}
            />
            <Text style={styles.learnButtonText}>Comenzar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default CourseIntroScreen;