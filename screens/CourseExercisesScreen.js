// screens/CourseExercisesScreen.js - Versión actualizada
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCourseById, markLessonComplete } from '../services/courseService';
import { markExerciseComplete } from '../services/courseService';
import { GamificationContext } from '../context/GamificationContext';
import gamificationService from '../services/gamificationService';
import LivesDisplay from '../components/LivesDisplay';
import { auth, db, firebaseTimestamp } from '../services/firebase';
import TrueFalseExercise from '../components/TrueFalseExercise';
import CodeBlocksOrderExercise from '../components/CodeBlocksOrderExercise';

const CourseExercisesScreen = ({ navigation, route }) => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false);
  
  // Extraer parámetros de la navegación
  const { courseId, lessonId, exercisesList, nextLessonIndex } = route.params;
  
  const { userId, lives, loadUserProgress, addXp, decreaseLife } = useContext(GamificationContext);

  // Verificar si el ejercicio actual está completado
  useEffect(() => {
    const checkExerciseStatus = async () => {
      if (!userId || !exercises.length || currentExerciseIndex >= exercises.length) return;
      
      try {
        const currentExercise = exercises[currentExerciseIndex];
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const exerciseProgress = userData?.progress?.courses?.[courseId]?.exercises?.[currentExercise.id];
        setIsExerciseCompleted(!!exerciseProgress?.completed);
      } catch (error) {
        console.error('Error al verificar estado del ejercicio:', error);
        setIsExerciseCompleted(false);
      }
    };
    
    checkExerciseStatus();
  }, [userId, courseId, exercises, currentExerciseIndex]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Log parameters received
        console.log("CourseExercisesScreen - Parameters received:", { 
          courseId, 
          lessonId, 
          hasExercisesList: !!(exercisesList && exercisesList.length) 
        });
        
        // If we have pre-loaded exercises, use them directly
        if (exercisesList && exercisesList.length > 0) {
          console.log('Using pre-loaded exercises list:', exercisesList.length);
          setExercises(exercisesList);
          setCurrentExerciseIndex(route.params.currentExerciseIndex || 0);
          setCourseData({ exercises: exercisesList });
          setIsLoading(false);
          return;
        }

        // Additional safety check for lessonId
        if (!lessonId) {
          console.error("No lessonId provided in params:", route.params);
          Alert.alert("Error", "No se pudo cargar los ejercicios de esta lección.");
          setExercises([]);
          setIsLoading(false);
          navigation.goBack();
          return;
        }
        
        // Otherwise, load course data
        const data = await getCourseById(courseId);
        setCourseData(data);
        
        console.log("Course lessons:", data?.lessons?.map(l => ({ id: l.id, title: l.title })));
        
        if (!lessonId) {
          console.error("No lessonId provided");
          setExercises([]);
          setIsLoading(false);
          return;
        }
        
        const currentLesson = data?.lessons?.find(lesson => lesson.id === lessonId);
        
        if (!currentLesson) {
          console.error(`No se encontró la lección con ID: ${lessonId}`);
          setExercises([]);
          setIsLoading(false);
          return;
        }
        
        const lessonExercises = data?.exercises
          ?.filter(ex => ex.lessonId === currentLesson.id)
          ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
        
        setExercises(lessonExercises);
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [courseId, lessonId, exercisesList]);

  // Avanzar al siguiente ejercicio o terminar
  const goToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      // Hay más ejercicios en esta lección
      setCurrentExerciseIndex(prev => prev + 1);
      setAnswer(''); // Limpiar respuesta anterior
    } else {
      // Completamos todos los ejercicios de esta lección
      if (nextLessonIndex !== undefined && nextLessonIndex !== null) {
        // Si hay una lección siguiente, navegamos a ella
        navigation.replace('CourseTheoryScreen', {
          courseId,
          lessonIndex: nextLessonIndex
        });
      } else {
        // Si es la última lección, volvemos a la lista de lecciones
        Alert.alert(
          '¡Felicidades!',
          'Has completado todos los ejercicios de esta lección.',
          [{ text: 'Continuar', onPress: () => navigation.navigate('CourseLessonsListScreen', { courseId }) }]
        );
      }
    }
  };

  // Para ejercicios especiales como verdadero/falso
  const handleExerciseComplete = (success) => {
    if (success) {
      goToNextExercise();
    }
  };

  // Verificar respuesta de ejercicio de texto
  const handleCheckAnswer = async () => {
    if (exercises.length === 0 || currentExerciseIndex >= exercises.length) return;
    
    const currentExercise = exercises[currentExerciseIndex];
    
    // Verificar vidas disponibles
    if (lives <= 0) {
      Alert.alert('Sin vidas', 'No tienes vidas disponibles. Espera a que se recarguen.');
      return;
    }
    
    // Validar respuesta
    if (!answer.trim()) {
      Alert.alert('Respuesta vacía', 'Por favor, ingresa una respuesta antes de verificar.');
      return;
    }

    if (answer.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase()) {
      // Success! The answer is correct
      Alert.alert(
        "¡Correcto!",
        "Has respondido correctamente.",
        [{ text: "Continuar", onPress: async () => {
          try {
            // Add XP points for the exercise
            await addXp(currentExercise.points || 10);
            
            // This is the important part - mark both exercise and lesson as complete
            await markLessonComplete(
              userId, 
              courseId, 
              currentExercise.lessonId, 
              currentExercise.id
            );
            
            // Move to next exercise or complete
            goToNextExercise();
          } catch (error) {
            console.error("Error processing exercise completion:", error);
          }
        }}]
      );
    } else {
      // Handle incorrect answer
      decreaseLife();
      Alert.alert(
        "Incorrecto",
        "Tu respuesta no es correcta. Intenta de nuevo.",
        [{ text: "Entendido" }]
      );
    }
  };

  // Renderizar el ejercicio current según su tipo
  const renderExerciseContent = () => {
    if (exercises.length === 0 || currentExerciseIndex >= exercises.length) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No hay ejercicios disponibles para esta lección</Text>
          <TouchableOpacity 
            style={styles.backToLessonsButton}
            onPress={() => navigation.navigate('CourseLessonsListScreen', { courseId })}
          >
            <Text style={styles.backToLessonsText}>Volver a lecciones</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentExercise = exercises[currentExerciseIndex];
    
    // Renderizar según tipo de ejercicio
    if (currentExercise.exerciseType === 'true_false') {
      return (
        <TrueFalseExercise 
          exercise={currentExercise} 
          onComplete={handleExerciseComplete} 
        />
      );
    } else if (currentExercise.exerciseType === 'order_blocks') {
      return (
        <CodeBlocksOrderExercise
          exercise={currentExercise}
          onComplete={handleExerciseComplete}
        />
      );
    } else {
      // Ejercicio de texto por defecto
      return (
        <>
          <Text style={styles.exerciseTitle}>{currentExercise.title}</Text>
          <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
          
          {isExerciseCompleted ? (
            <Text style={styles.completedText}>Completado</Text>
          ) : (
            <Text style={styles.pointsText}>Valor: {currentExercise.points || 10} puntos</Text>
          )}
          
          <Text style={styles.progressText}>Ejercicio {currentExerciseIndex + 1} de {exercises.length}</Text>
          
          {currentExercise.codeTemplate && (
            <Text style={styles.code}>{currentExercise.codeTemplate}</Text>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta aquí"
            value={answer}
            onChangeText={setAnswer}
            multiline={currentExercise.multiline}
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
          {isLoading ? 'Cargando...' : `Ejercicio ${currentExerciseIndex + 1} de ${exercises.length}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B297F1" />
          <Text style={styles.loadingText}>Cargando ejercicio...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <LivesDisplay />
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
  errorSubtext: {
    fontSize: 12,
    color: '#999',
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
  progressText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CD964', // Verde para indicar completado
    marginBottom: 15,
  },
});

export default CourseExercisesScreen;