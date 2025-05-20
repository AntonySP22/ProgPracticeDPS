import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import PasswordScreen from './screens/PasswordScreen';
import MailScreen from './screens/MailScreen';
import PasswordSuccessScreen from './screens/PasswordSuccessScreen';
import CoursesScreen from './screens/CoursesScreen';
import PythonIntroScreen from './screens/PythonIntroScreen';
import PythonTheoryScreen from './screens/PythonTheoryScreen';
import HTMLIntroScreen from './screens/HTMLIntroScreen';
import JavaIntroScreen from './screens/JavaIntroScreen';
import SwiftIntroScreen from './screens/SwiftIntroScreen';
import HTMLTheoryScreen from './screens/HTMLTheoryScreen';
import JavaTheoryScreen from './screens/JavaTheoryScreen';
import SwiftTheoryScreen from './screens/SwiftTheoryScreen';
import PythonExercisesScreen from './screens/PythonExercisesScreen';
import JavaExercisesScreen from './screens/JavaExercisesScreen';
import HTMLExercisesScreen from './screens/HTMLExercisesScreen';
import SwiftExercisesScreen from './screens/SwiftExercisesScreen';
import SQLTheoryScreen from './screens/SQLTheoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import HelpScreen from './screens/HelpScreen';
import Codigo from './screens/Codigo';
import { initializeCoursesData, updateMissingCreationDates } from './services/initCourseData';
import CourseIntroScreen from './screens/CourseIntroScreen';
import CourseTheoryScreen from './screens/CourseTheoryScreen';
import CourseExercisesScreen from './screens/CourseExercisesScreen';
import CourseLessonsListScreen from './screens/CourseLessonsListScreen'; // Importa la nueva pantalla
import { GamificationProvider } from './context/GamificationContext';
import AchievementsScreen from './screens/AchievementsScreen';
import { checkDailyReset } from './services/dailyResetService';
import { auth } from './services/firebase';

LogBox.ignoreAllLogs();

if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {

    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('auth/invalid-credential') ||
       args[0].includes('auth/') ||
       args[0].includes('[AUTH ERROR]') ||
       args[0].includes('Firebase'))
    ) {
      console.log('[Error silenciado]', ...args);
      return;
    }
    originalConsoleError(...args);
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback cuando ocurre un error
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>¡Ups! Algo salió mal</Text>
          <Text style={styles.errorMessage}>
            La aplicación encontró un problema inesperado.
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={this.resetError}>
            <Text style={styles.errorButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Configurar stack navigator
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Inicializa los datos de cursos si no existen y asegura que tengan fechas de creación
    const initializeData = async () => {
      try {
        console.log('Iniciando inicialización de datos...');
        await initializeCoursesData();
        // Asegurar que todos los cursos tengan fechas de creación
        await updateMissingCreationDates();
        console.log('Inicialización de datos completada con éxito');
      } catch (err) {
        console.error('Error al inicializar datos:', err);
      }
    };
    
    initializeData();
    
    if (__DEV__) {
      LogBox.ignoreLogs([
        'auth/invalid-credential',
        'Possible Unhandled Promise Rejection',
        'Setting a timer',
        'AsyncStorage has been extracted'
      ]);
    }
  }, []);

  useEffect(() => {
    // Verificar el reseteo diario cuando hay un usuario autenticado
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        checkDailyReset(user.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <GamificationProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
            <Stack.Screen name="MailScreen" component={MailScreen} />
            <Stack.Screen name="PasswordSuccessScreen" component={PasswordSuccessScreen} />
            <Stack.Screen name="CoursesScreen" component={CoursesScreen} />
            
            {/* Pantallas genéricas de cursos */}
            <Stack.Screen name="CourseLessonsListScreen" component={CourseLessonsListScreen} />
            <Stack.Screen name="CourseIntroScreen" component={CourseIntroScreen} />
            <Stack.Screen name="CourseTheoryScreen" component={CourseTheoryScreen} />
            <Stack.Screen name="CourseExercisesScreen" component={CourseExercisesScreen} />
            
            {/* Pantallas específicas (temporalmente mantenidas) */}
            <Stack.Screen name="PythonIntro" component={CourseIntroScreen} initialParams={{ courseId: 'python' }} />
            <Stack.Screen name="JavaIntroScreen" component={CourseIntroScreen} initialParams={{ courseId: 'java' }} />
            <Stack.Screen name="SwiftIntroScreen" component={SwiftIntroScreen} />
            <Stack.Screen name="HTMLIntroScreen" component={HTMLIntroScreen} />
            <Stack.Screen name="JavaTheoryScreen" component={JavaTheoryScreen} />
            <Stack.Screen name="SwiftTheoryScreen" component={SwiftTheoryScreen} />
            <Stack.Screen name="PythonExercises" component={PythonExercisesScreen} />
            <Stack.Screen name="JavaExercisesScreen" component={JavaExercisesScreen} />
            <Stack.Screen name="HTMLExercisesScreen" component={HTMLExercisesScreen} />
            <Stack.Screen name="SwiftExercisesScreen" component={SwiftExercisesScreen} />
            <Stack.Screen name="SQLTheoryScreen" component={SQLTheoryScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="HelpScreen" component={HelpScreen} />
            <Stack.Screen name="Codigo" component={Codigo} />
            <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GamificationProvider>
    </ErrorBoundary>
  );
};

// Estilos para la pantalla de error
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6200ee',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    paddingHorizontal: 20,
  },
  errorButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
