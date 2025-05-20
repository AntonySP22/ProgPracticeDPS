// screens/CourseExercisesScreen.js - Versión actualizada
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCourseById } from '../services/courseService';
import { GamificationContext } from '../context/GamificationContext';
import gamificationService from '../services/gamificationService';
import LivesDisplay from '../components/LivesDisplay';
import { auth, db, firebaseTimestamp } from '../services/firebase';
import TrueFalseExercise from '../components/TrueFalseExercise';

const CourseExercisesScreen = ({ navigation, route }) => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const { courseId, lessonIndex, exerciseIndex, nextLessonIndex } = route.params;
  
  const { userId, lives, loadUserProgress, addXp, decreaseLife } = useContext(GamificationContext);

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
    
    // Refrescar datos de usuario cada vez que se muestra la pantalla
    if (userId) {
      loadUserProgress(userId);
    }
  }, [courseId, userId]);

  const handleCheckAnswer = async () => {
    if (!courseData?.exercises || exerciseIndex === undefined) return;
    if (!userId) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar tu progreso');
      return;
    }
    
    // Comprobar si hay vidas disponibles
    if (lives <= 0) {
      Alert.alert(
        'Sin vidas', 
        'No tienes vidas disponibles. Espera a que se recarguen o compra más vidas.',
        [{ text: 'Entendido' }]
      );
      return;
    }
    
    const exercise = courseData.exercises[exerciseIndex];
    
    // Validar que hay una respuesta
    if (!answer.trim()) {
      Alert.alert('Respuesta vacía', 'Por favor, ingresa una respuesta antes de continuar.');
      return;
    }
    
    if (answer.trim() === exercise.correctAnswer.trim()) {
      // Respuesta correcta
      const points = exercise.points || 10; // Puntos por defecto si no se especifican
      
      try {
        // Añadir puntos al usuario
        await gamificationService.addXp(userId, points);
        
        // Registrar ejercicio como completado
        await db.collection('users').doc(userId).update({
          [`progress.courses.${courseId}.exercises.${exercise.id}`]: {
            completed: true,
            score: 100,
            completedAt: firebaseTimestamp()
          },
          'progress.lastActivity': firebaseTimestamp()
        });
        
        // Actualizar la racha - un ejercicio completado = lección completada
        await gamificationService.updateStreak(userId, true);
        console.log("Racha actualizada - ejercicio completado");
        
        // Verificar logros
        await gamificationService.checkExerciseAchievements(userId);
        
        // Actualizar UI
        if (loadUserProgress) {
          loadUserProgress(userId);
        }
        
        Alert.alert(
          '¡Correcto!', 
          `Tu respuesta es correcta. +${points} puntos`,
          [{ text: 'Continuar', onPress: () => handleContinue() }]
        );
      } catch (error) {
        console.error('Error al procesar respuesta correcta:', error);
        Alert.alert('Error', 'No se pudo guardar tu progreso. Intenta nuevamente.');
      }
    } else {
      // Respuesta incorrecta
      try {
        // Disminuir una vida
        await gamificationService.decreaseLife(userId);
        
        // Actualizar UI
        if (loadUserProgress) {
          loadUserProgress(userId);
        }
        
        Alert.alert('Incorrecto', 'Intenta otra respuesta. Has perdido una vida.');
      } catch (error) {
        console.error('Error al procesar respuesta incorrecta:', error);
      }
    }
  };

  const handleContinue = () => {
    if (nextLessonIndex !== null) {
      // Ir a la siguiente lección
      navigation.replace('CourseTheoryScreen', {
        courseId,
        lessonIndex: nextLessonIndex,
        totalLessons: courseData?.lessons?.length || 0
      });
    } else {
      // Si es el último ejercicio del curso
      Alert.alert(
        '¡Felicitaciones!', 
        'Has completado todas las lecciones de este curso.',
        [
          { text: 'Volver a la lista', onPress: () => navigation.navigate('CourseLessonsListScreen', { courseId }) }
        ]
      );
    }
  };

  const handleExerciseComplete = (success) => {
    if (success) {
      handleContinue();
    }
  };

  // Renderizar el contenido del ejercicio basado en su tipo
  const renderExerciseContent = () => {
    if (!courseData?.exercises || exerciseIndex === undefined) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró el ejercicio</Text>
        </View>
      );
    }

    const exercise = courseData.exercises[exerciseIndex];
    
    // Verificar el tipo de ejercicio (comprobar ambas propiedades posibles)
    if (exercise.exerciseType === 'true_false' || exercise.type === 'true_false') {
      return (
        <TrueFalseExercise 
          exercise={exercise} 
          onComplete={handleExerciseComplete}
        />
      );
    } else {
      // Ejercicio de texto por defecto
      return (
        <>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          
          <Text style={styles.pointsText}>Valor: {exercise.points || 10} puntos</Text>
          
          {exercise.codeTemplate && (
            <Text style={styles.code}>{exercise.codeTemplate}</Text>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta aquí"
            value={answer}
            onChangeText={setAnswer}
            multiline={exercise.multiline}
          />
          
          <TouchableOpacity 
            style={[styles.checkButton, lives <= 0 && styles.disabledButton]} 
            onPress={handleCheckAnswer}
            disabled={lives <= 0}
          >
            <Image
              source={require('../assets/button-bg-1.png')}
              style={styles.buttonBackground}
            />
            <Text style={styles.buttonText}>Comprobar</Text>
          </TouchableOpacity>
          
          {lives <= 0 && (
            <Text style={styles.noLivesText}>
              No tienes vidas disponibles. Espera a que se recarguen.
            </Text>
          )}
        </>
      );
    }
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
          {isLoading ? 'Cargando...' : `Ejercicio - ${courseData?.title}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Cargando ejercicio...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Añadir LivesDisplay al inicio */}
          <LivesDisplay />
          
          {/* Renderizar el contenido del ejercicio basado en su tipo */}
          {renderExerciseContent()}
        </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 10,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  code: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#2D2D2D',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    color: '#2D2D2D',
    borderWidth: 1,
    borderColor: '#DDD',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  checkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 50,
    marginBottom: 20,
  },
  buttonBackground: {
    width: '100%',
    height: 50,
    resizeMode: 'stretch',
    borderRadius: 30,
  },
  buttonText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToLessonsButton: {
    backgroundColor: '#B297F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  backToLessonsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  // Añadir nuevos estilos para los elementos de gamificación
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CD964',
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  noLivesText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default CourseExercisesScreen;