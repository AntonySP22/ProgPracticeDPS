import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../services/firebase';
import { GamificationContext } from '../context/GamificationContext';
import LivesDisplay from '../components/LivesDisplay';
import StreakTracker from '../components/StreakTracker';
import AchievementCard from '../components/AchievementCard';
import { getAllCourses } from '../services/courseService'; // Importamos función para obtener cursos

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newCourses, setNewCourses] = useState([]); // Estado para los cursos nuevos
  const { 
    xp, 
    lives, 
    streak, 
    achievements, 
    achievementsInfo, 
    loadingProgress 
  } = useContext(GamificationContext);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const getUserData = async () => {
      try {
        // First check if there's a locally saved profile image
        const localImageUri = await AsyncStorage.getItem('localProfileImage');
        
        // Try to get data from AsyncStorage
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          
          // If we have a local image, prioritize it over any stored image
          if (localImageUri) {
            parsedUserData.profileImage = localImageUri;
          }
          
          setUserData(parsedUserData);
        }
        
        // Then get updated data from Firebase (if authenticated)
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await db.collection('users').doc(currentUser.uid).get();
          
          if (userDoc.exists) {
            const firebaseUserData = userDoc.data();
            
            // Create unified object with all relevant data
            const completeUserData = {
              nombre: firebaseUserData.nombre || (firebaseUserData.profile?.nombre) || 'Usuario',
              email: currentUser.email,
              // Use local image if available, otherwise use Firebase image
              profileImage: localImageUri || firebaseUserData.profileImage || '',
              // Gamification data
              score: firebaseUserData.gamification?.xp || 0,
              level: firebaseUserData.gamification?.level || 1
            };
            
            // Update state
            setUserData(completeUserData);
            
            // Update AsyncStorage for next time (but preserve the local image path)
            await AsyncStorage.setItem('userData', JSON.stringify(completeUserData));
          }
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
      }
    };

    getUserData();
    
    // También actualizar cuando cambie el usuario autenticado
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        getUserData();
      } else {
        setUserData(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Cargar cursos y filtrar los nuevos (menos de 10 días)
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        
        // Filtrar cursos nuevos (creados en los últimos 10 días)
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
        // Filtrado con logging para depuración
        const recentCourses = coursesData.filter(course => {
          if (course.creationDate) {
            const courseDate = new Date(course.creationDate);
            const isNew = courseDate >= tenDaysAgo;
            console.log(`Curso: ${course.title}, Fecha: ${courseDate.toLocaleDateString()}, ¿Es nuevo?: ${isNew}`);
            return isNew;
          }
          console.log(`Curso sin fecha: ${course.title}`);
          return false;
        });
        
        console.log(`Encontrados ${recentCourses.length} cursos nuevos de un total de ${coursesData.length}`);
        setNewCourses(recentCourses);
      } catch (error) {
        console.error('Error cargando cursos:', error);
      }
    };
    
    loadCourses();
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userData');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
    }
  };

  const handleCoursePress = (courseId) => {
    navigation.navigate('CourseIntroScreen', { courseId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.spacer} />
      
      {/* Encabezado con avatar y nombre */}
      <View style={styles.header}>
        <Image
          source={
            userData && userData.profileImage
              ? { uri: userData.profileImage } 
              : require('../assets/usuario.jpg')
          }
          style={styles.userAvatar}
        />

        <Text style={styles.welcomeText}>
          Bienvenido, {userData ? `${userData.nombre}` : 'Cargando...'}
        </Text>
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
        <TouchableOpacity 
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <TouchableOpacity 
            style={styles.menuContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()} // Esto evita que los toques dentro del menú lo cierren
          >
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
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Sección de gamificación */}
      <View style={styles.gamificationContainer}>
        <View style={styles.gamificationHeader}>
          {/* Mostrar XP y nivel */}
          <View style={styles.xpContainer}>
            <Icon name="star" size={24} color="#FFD700" />
            <View style={styles.xpInfo}>
              <Text style={styles.xpText}>{xp} puntos</Text>
              <Text style={styles.xpLevel}>Nivel {userData ? userData.level : 1}</Text>
            </View>
          </View>
          <StreakTracker />
        </View>
        
        <LivesDisplay />
      </View>

      {/* Logros recientes */}
      <Text style={styles.sectionTitle}>Logros recientes</Text>
      <View style={styles.achievementsContainer}>
        {loadingProgress ? (
          <Text style={styles.loadingText}>Cargando logros...</Text>
        ) : achievements && achievements.length > 0 ? (
          achievements.slice(0, 3).map((achievement, index) => {
            const achievementInfo = achievementsInfo?.find(a => a.id === achievement.id);
            if (!achievementInfo) return null;
            
            return (
              <AchievementCard
                key={index}
                achievement={achievementInfo}
                earnedAt={achievement.earnedAt}
              />
            );
          })
        ) : (
          <Text style={styles.emptyText}>Aún no has desbloqueado logros</Text>
        )}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('AchievementsScreen')}
        >
          <Text style={styles.viewAllText}>Ver todos los logros</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Cursos nuevos */}
      <Text style={styles.sectionTitle}>Cursos nuevos</Text>
      <View style={styles.courseList}>
        {newCourses.length > 0 ? (
          newCourses.map((course, index) => (
            <TouchableOpacity
              key={index}
              style={styles.courseItem}
              onPress={() => handleCoursePress(course.id)}
            >
              <Text style={styles.courseName}>{course.title}</Text>
              <Text style={styles.courseStatus}>Nuevo</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay cursos nuevos disponibles</Text>
        )}
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
  
  // Sección de gamificación
  gamificationContainer: {
    marginBottom: 20,
  },
  gamificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  xpInfo: {
    marginLeft: 8,
  },
  xpText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  xpLevel: {
    fontSize: 12,
    color: '#FFA500',
    marginTop: 2,
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
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  statsInfo: {
    marginLeft: 10,
  },
  statsLabel: {
    fontSize: 14,
    color: '#777',
  },
  statsValue: {
    fontSize: 16,
    color: '#052659',
    fontWeight: 'bold',
  },
  
  // Sección de logros
  achievementsContainer: {
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 10,
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    color: '#B297F1',
    fontSize: 14,
    fontWeight: 'bold',
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
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    padding: 20,
  },
});

export default HomeScreen;