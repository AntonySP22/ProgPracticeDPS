import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCourseById } from '../services/courseService';
import { GamificationContext } from '../context/GamificationContext';
import { db } from '../services/firebase';

const CourseLessonsListScreen = ({ navigation, route }) => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});
  const { courseId } = route.params;
  const { userId } = useContext(GamificationContext);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseById(courseId);
        setCourseData(data);
      } catch (error) {
        console.error('Error cargando datos del curso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!userId) return;
      
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const progress = userData?.progress?.courses?.[courseId] || {};
          setUserProgress(progress);
        }
      } catch (error) {
        console.error('Error cargando progreso del usuario:', error);
      }
    };
    
    loadUserProgress();
  }, [userId, courseId]);

  const navigateToLesson = (lessonIndex) => {
    navigation.navigate('CourseTheoryScreen', { 
      courseId,
      lessonIndex,
      totalLessons: courseData?.lessons?.length || 0
    });
  };

  // Modificación en la navegación a ejercicios
  const handleStartExercises = async (lessonId) => {
    try {
      // Debug info
      console.log(`Starting exercises for lesson ${lessonId}`);
      console.log('Course data:', courseData?.exercises?.length || 0, 'exercises total');
      
      // Obtener todos los ejercicios de esta lección
      const lessonExercises = courseData.exercises
        .filter(ex => ex.lessonId === lessonId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      console.log(`Found ${lessonExercises.length} exercises for lesson ${lessonId}`);
      
      // Show details of found exercises for debugging
      console.log('Exercise details:', lessonExercises.map(ex => ({
        id: ex.id,
        lessonId: ex.lessonId,
        title: ex.title
      })));
      
      if (lessonExercises.length === 0) {
        Alert.alert("No hay ejercicios", "Esta lección no tiene ejercicios disponibles.");
        return;
      }
      
      // Navegar al primer ejercicio, pasando la lista completa
      navigation.navigate('CourseExercisesScreen', { 
        courseId: courseId,
        lessonId: lessonId,
        exercisesList: lessonExercises,
        currentExerciseIndex: 0
      });
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
      Alert.alert("Error", "Ocurrió un error al cargar los ejercicios.");
    }
  };

  // Update the renderLessonItem function to check lesson completion status properly
  const renderLessonItem = ({ item, index }) => {
    // Check if this lesson is completed - simplified logic for clarity
    const isLessonCompleted = userProgress?.lessons?.[item.id]?.completed || false;
    const hasTheoryViewed = userProgress?.lessons?.[item.id]?.teoriaVista || false;
    
    // For the progress status, we no longer need to check if all exercises are completed
    // since we directly mark the lesson as complete when its single exercise is completed
    const isInProgress = hasTheoryViewed && !isLessonCompleted;
    
    return (
      <TouchableOpacity 
        style={[
          styles.lessonCard, 
          isLessonCompleted && styles.completedLessonCard,
          isInProgress && styles.inProgressLessonCard
        ]}
        onPress={() => navigateToLesson(index)}
      >
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDescription} numberOfLines={2}>
            {item.content.substring(0, 80)}...
          </Text>
        </View>
        {isLessonCompleted ? (
          <Icon name="checkmark-circle" size={24} color="#4CD964" />
        ) : isInProgress ? (
          <Icon name="time" size={24} color="#FF9500" />
        ) : (
          <Icon name="chevron-forward" size={24} color="#B297F1" />
        )}
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>
          {isLoading ? 'Cargando...' : `Lecciones de ${courseData?.title}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Cargando lecciones...</Text>
        </View>
      ) : (
        <FlatList
          data={courseData?.lessons}
          renderItem={renderLessonItem}
          keyExtractor={(item, index) => `lesson-${index}`}
          contentContainerStyle={styles.lessonsList}
          ListHeaderComponent={
            <Text style={styles.courseTitleHeader}>{courseData?.title}</Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No hay lecciones disponibles para este curso
            </Text>
          }
        />
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
  courseTitleHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 15,
    padding: 15,
  },
  lessonsList: {
    padding: 15,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedLessonCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 5,
    borderLeftColor: '#4CD964',
  },
  inProgressLessonCard: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 5,
    borderLeftColor: '#FF9500',
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B297F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 5,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
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

export default CourseLessonsListScreen;