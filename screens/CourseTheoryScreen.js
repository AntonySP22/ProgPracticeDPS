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
    // Verificar si la lección actual tiene ejercicios asociados
    const currentLesson = courseData?.lessons[lessonIndex];
    
    if (!currentLesson) {
      console.error("Error: No se encontró la lección actual");
      return;
    }
    
    console.log("Lección actual:", currentLesson.title, "ID:", currentLesson.id);
    
    // Obtener el número total REAL de lecciones desde courseData
    const actualTotalLessons = courseData?.lessons?.length || 0;
    console.log(`Lección ${lessonIndex + 1} de ${actualTotalLessons}`);
    
    // Verificar si hay ejercicios para esta lección
    const hasExercises = courseData?.exercises && 
                       courseData.exercises.some(ex => ex.lessonId === currentLesson.id);
    
    console.log("¿Tiene ejercicios?:", hasExercises);
    
    // Marcar la lección como completada
    if (userId) {
      try {
        // Verificar si la lección tiene ejercicios asociados
        const hasExercises = courseData?.exercises && 
                          courseData.exercises.some(ex => ex.lessonId === currentLesson.id);
        
        // Si la lección tiene ejercicios, solo marcarla como "teoriaVista" pero no como completada
        // Si la lección NO tiene ejercicios, marcarla como completada directamente
        await db.collection('users').doc(userId).update({
          [`progress.courses.${courseId}.lessons.${currentLesson.id}`]: {
            teoriaVista: true,
            completed: !hasExercises, // Solo se marca como completada si NO tiene ejercicios
            completedAt: !hasExercises ? firebaseTimestamp() : null
          },
          'progress.lastActivity': firebaseTimestamp()
        });
        
        // Si la lección NO tiene ejercicio, actualizar la racha aquí
        if (!hasExercises) {
          await gamificationService.updateStreak(userId, true);
          console.log("Racha actualizada - lección de solo teoría completada");
        }
        
      } catch (error) {
        console.error('Error al guardar progreso de lección:', error);
      }
    }
    
    if (hasExercises) {
      // Si hay ejercicios, llamar a handleStartExercises directamente
      handleStartExercises(currentLesson.id);
    } else {
      // Si no hay ejercicios, verificamos si hay más lecciones
      const isLastLesson = lessonIndex >= actualTotalLessons - 1;
      
      console.log(`Es última lección?: ${isLastLesson} (índice ${lessonIndex} vs total ${actualTotalLessons})`);
      
      if (!isLastLesson) {
        // Si NO es la última lección, navegamos a la siguiente
        console.log("Avanzando a la siguiente lección:", lessonIndex + 1);
        navigation.navigate('CourseTheoryScreen', {
          courseId,
          lessonIndex: lessonIndex + 1,
          totalLessons: actualTotalLessons  // Pasar el valor real
        });
      } else {
        // Si ES la última lección, mostramos mensaje de felicitación
        console.log("Esta es la última lección del curso");
        Alert.alert(
          '¡Felicidades!',
          'Has completado todas las lecciones de este curso.',
          [{ text: 'Continuar', onPress: () => navigation.navigate('CourseLessonsListScreen', { courseId }) }]
        );
      }
    }
  };

  // Modificar el handleStartExercises para usar el lessonId pasado como parámetro
  const handleStartExercises = (lessonId) => {
    if (!lessonId) {
      console.error("Error: No se proporcionó ID de lección");
      return;
    }
    
    console.log("Preparando ejercicios para lección:", lessonId);
    
    // Filtrar ejercicios para esta lección
    const lessonExercises = courseData?.exercises
      ?.filter(ex => ex.lessonId === lessonId)
      ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    
    console.log(`Encontrados ${lessonExercises.length} ejercicios`);
    
    if (lessonExercises.length === 0) {
      Alert.alert("No hay ejercicios", "Esta lección no tiene ejercicios disponibles.");
      return;
    }
    
    // Navegar con todos los parámetros necesarios
    navigation.navigate('CourseExercisesScreen', {
      courseId,
      lessonId: lessonId, // Usar el lessonId pasado como parámetro
      exercisesList: lessonExercises,
      currentExerciseIndex: 0,
      nextLessonIndex: lessonIndex < (courseData?.lessons?.length - 1) ? lessonIndex + 1 : null
    });
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