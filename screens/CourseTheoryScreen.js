// screens/CourseTheoryScreen.js - Versión actualizada
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCourseById } from '../services/courseService';
import { GamificationContext } from '../context/GamificationContext';
import { db, firebaseTimestamp } from '../services/firebase';
import gamificationService from '../services/gamificationService';

const CourseTheoryScreen = ({ navigation, route }) => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);
  
  const { courseId, lessonIndex = 0, totalLessons = 0 } = route.params;
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

  const handleContinue = async () => {
    // Verificar si la lección actual tiene ejercicio asociado
    const currentLesson = courseData?.lessons[lessonIndex];
    const hasExercise = currentLesson && 
                       courseData?.exercises && 
                       courseData.exercises.some(ex => ex.lessonId === currentLesson.id);
    
    // Marcar la lección como completada y actualizar la racha
    if (userId) {
      try {
        // Registrar la lección como completada
        await db.collection('users').doc(userId).update({
          [`progress.courses.${courseId}.lessons.${currentLesson.id}`]: {
            completed: true,
            completedAt: firebaseTimestamp()
          },
          'progress.lastActivity': firebaseTimestamp()
        });
        
        // Si la lección NO tiene ejercicio, actualizar la racha aquí
        // porque la lección se considera completada al presionar "Continuar"
        if (!hasExercise) {
          // Actualizar la racha diaria indicando que se completó una lección
          await gamificationService.updateStreak(userId, true);
          console.log("Racha actualizada - lección de solo teoría completada");
        }
        
      } catch (error) {
        console.error('Error al guardar progreso de lección:', error);
      }
    }
    
    if (hasExercise) {
      // Si hay ejercicio, ir a la pantalla de ejercicios
      const exerciseIndex = courseData.exercises.findIndex(ex => ex.lessonId === currentLesson.id);
      navigation.navigate('CourseExercisesScreen', { 
        courseId, 
        lessonIndex, 
        exerciseIndex,
        nextLessonIndex: lessonIndex + 1 < totalLessons ? lessonIndex + 1 : null
      });
    } else {
      // Si no hay ejercicio, ir a la siguiente lección si existe
      if (lessonIndex + 1 < totalLessons) {
        navigation.navigate('CourseTheoryScreen', {
          courseId,
          lessonIndex: lessonIndex + 1,
          totalLessons
        });
      } else {
        // Si es la última lección, volver a la lista de lecciones
        Alert.alert(
          '¡Felicidades!',
          'Has completado todas las lecciones de este curso.',
          [{ text: 'Continuar', onPress: () => navigation.navigate('CourseLessonsListScreen', { courseId }) }]
        );
      }
    }
  };

  const currentLesson = courseData?.lessons ? courseData.lessons[lessonIndex] : null;

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
          {isLoading ? 'Cargando...' : `${courseData?.title} - Lección ${lessonIndex + 1}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Cargando contenido...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {currentLesson ? (
            <>
              <Text style={styles.title}>{currentLesson.title}</Text>
              <Text style={styles.text}>{currentLesson.content}</Text>
              {currentLesson.codeExample && (
                <Text style={styles.code}>{currentLesson.codeExample}</Text>
              )}
            </>
          ) : (
            <Text style={styles.errorText}>No se encontró la lección</Text>
          )}

          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleContinue}
            >
              <Image
                source={require('../assets/button-bg-2.png')} 
                style={styles.continueButtonBackground}
              />
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
            <Image source={require('../assets/login-avatar.png')} style={styles.avatar} />
          </View>
        </ScrollView>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((lessonIndex + 1) / totalLessons) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {`${lessonIndex + 1} de ${totalLessons} lecciones`}
        </Text>
      </View>

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
  text: {
    fontSize: 16,
    color: '#2D2D2D',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
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
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 180,
    height: 50,
    borderRadius: 30,
  },  
  continueButtonBackground: {
    width: 180,
    height: 50,
    resizeMode: 'center',
    borderRadius: 30,
  },
  continueButtonText: {
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
  progressContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B297F1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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

export default CourseTheoryScreen;