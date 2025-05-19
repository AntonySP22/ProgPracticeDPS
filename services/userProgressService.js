import { db, firebaseTimestamp } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes para la gamificación
const MAX_LIVES = 5;
const LIFE_RECHARGE_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos
const STREAK_THRESHOLD_HOURS = 36; // 36 horas para mantener la racha

// Obtener el progreso actual del usuario
export const getUserProgress = async (userId) => {
  if (!userId) return null;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      // Si el usuario no tiene datos de progreso, inicializar con valores predeterminados
      const initialProgress = {
        points: 0,
        lives: MAX_LIVES,
        lastLifeRecharge: new Date().toISOString(),
        streak: 0,
        lastActivity: new Date().toISOString(),
        completedLessons: [],
        completedExercises: {},
        achievements: []
      };
      
      await db.collection('users').doc(userId).set({
        progress: initialProgress
      }, { merge: true });
      
      return initialProgress;
    }
    
    const userData = userDoc.data();
    return userData.progress || null;
  } catch (error) {
    console.error('Error al obtener progreso del usuario:', error);
    return null;
  }
};

// Actualizar las vidas del usuario, teniendo en cuenta el tiempo de recarga
export const updateUserLives = async (userId) => {
  if (!userId) return { lives: MAX_LIVES, lastLifeRecharge: new Date().toISOString() };
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return { lives: MAX_LIVES, lastLifeRecharge: new Date().toISOString() };
    
    const userData = userDoc.data();
    let { lives, lastLifeRecharge } = userData.progress || { lives: MAX_LIVES, lastLifeRecharge: new Date().toISOString() };
    
    // Convertir lastLifeRecharge a Date
    const lastRechargeTime = new Date(lastLifeRecharge);
    const currentTime = new Date();
    
    // Calcular cuántas vidas se han recargado desde la última vez
    const timeDiff = currentTime - lastRechargeTime;
    const livesToRecharge = Math.floor(timeDiff / LIFE_RECHARGE_TIME);
    
    if (livesToRecharge > 0 && lives < MAX_LIVES) {
      // Actualizar vidas y tiempo de última recarga
      lives = Math.min(lives + livesToRecharge, MAX_LIVES);
      lastLifeRecharge = new Date(lastRechargeTime.getTime() + livesToRecharge * LIFE_RECHARGE_TIME).toISOString();
      
      // Guardar en la base de datos
      await db.collection('users').doc(userId).update({
        'progress.lives': lives,
        'progress.lastLifeRecharge': lastLifeRecharge
      });
    }
    
    return { lives, lastLifeRecharge };
  } catch (error) {
    console.error('Error al actualizar vidas:', error);
    return { lives: MAX_LIVES, lastLifeRecharge: new Date().toISOString() };
  }
};

// Disminuir una vida al fallar un ejercicio
export const decreaseLives = async (userId) => {
  if (!userId) return false;
  
  try {
    // Primero actualizamos las vidas por si se han recargado
    const { lives, lastLifeRecharge } = await updateUserLives(userId);
    
    if (lives <= 0) return false; // Ya no tiene vidas
    
    // Restar una vida
    const newLives = lives - 1;
    
    await db.collection('users').doc(userId).update({
      'progress.lives': newLives
    });
    
    return true;
  } catch (error) {
    console.error('Error al disminuir vidas:', error);
    return false;
  }
};

// Guardar el progreso al completar un ejercicio
export const saveExerciseCompletion = async (userId, courseId, exerciseId, exercisePoints) => {
  if (!userId) return false;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : { progress: { points: 0, completedExercises: {} } };
    
    // Comprobar si el ejercicio ya fue completado para no duplicar puntos
    const isAlreadyCompleted = userData.progress.completedExercises[exerciseId];
    
    // Actualizar completedExercises y puntos
    const updatedProgress = {
      ...userData.progress,
      completedExercises: {
        ...userData.progress.completedExercises,
        [exerciseId]: {
          completedAt: firebaseTimestamp(),
          courseId
        }
      }
    };
    
    // Solo añadir puntos si no lo había completado antes
    if (!isAlreadyCompleted) {
      updatedProgress.points = (userData.progress.points || 0) + exercisePoints;
    }
    
    // Actualizar última actividad para la racha
    updatedProgress.lastActivity = firebaseTimestamp();
    
    await db.collection('users').doc(userId).update({
      progress: updatedProgress
    });
    
    // Verificar si se completan todos los ejercicios de una lección
    await checkLessonCompletion(userId, courseId, exerciseId);
    
    // Verificar y actualizar logros
    await checkAchievements(userId);
    
    return true;
  } catch (error) {
    console.error('Error al guardar progreso del ejercicio:', error);
    return false;
  }
};

// Verificar si se ha completado una lección completa
export const checkLessonCompletion = async (userId, courseId, exerciseId) => {
  try {
    // Obtener el curso y sus ejercicios
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) return false;
    
    const courseData = courseDoc.data();
    const exercise = courseData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise || !exercise.lessonId) return false;
    
    // Obtener todos los ejercicios de esta lección
    const lessonExercises = courseData.exercises.filter(ex => ex.lessonId === exercise.lessonId);
    
    // Obtener progreso del usuario
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    
    // Verificar si todos los ejercicios de la lección están completados
    const allCompleted = lessonExercises.every(ex => 
      userData.progress.completedExercises && userData.progress.completedExercises[ex.id]
    );
    
    if (allCompleted) {
      // Marcar la lección como completada
      const updatedCompletedLessons = [
        ...(userData.progress.completedLessons || []),
        {
          courseId,
          lessonId: exercise.lessonId,
          completedAt: firebaseTimestamp()
        }
      ];
      
      // Actualizar racha diaria
      const streak = await updateStreak(userId);
      
      await db.collection('users').doc(userId).update({
        'progress.completedLessons': updatedCompletedLessons,
        'progress.streak': streak
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al verificar completitud de lección:', error);
    return false;
  }
};

// Actualizar racha diaria
export const updateStreak = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return 1; // Primera actividad
    
    const userData = userDoc.data();
    let currentStreak = userData.progress?.streak || 0;
    const lastActivityDate = userData.progress?.lastActivity?.toDate() || new Date(0);
    
    const now = new Date();
    const diffHours = (now - lastActivityDate) / (1000 * 60 * 60);
    
    if (diffHours <= STREAK_THRESHOLD_HOURS) {
      // Si la última actividad fue hace menos de STREAK_THRESHOLD_HOURS, incrementar racha
      // pero solo si cambió el día
      const lastDay = lastActivityDate.toDateString();
      const today = now.toDateString();
      
      if (lastDay !== today) {
        currentStreak += 1;
      }
    } else {
      // Si pasó más tiempo, reiniciar la racha
      currentStreak = 1;
    }
    
    return currentStreak;
  } catch (error) {
    console.error('Error al actualizar racha:', error);
    return 1;
  }
};

// Definición de logros disponibles
const ACHIEVEMENTS = [
  {
    id: 'first_exercise',
    title: 'Primer Paso',
    description: 'Completa tu primer ejercicio',
    condition: (progress) => 
      progress.completedExercises && Object.keys(progress.completedExercises).length >= 1,
    points: 20
  },
  {
    id: 'five_exercises',
    title: 'Constancia',
    description: 'Completa 5 ejercicios',
    condition: (progress) => 
      progress.completedExercises && Object.keys(progress.completedExercises).length >= 5,
    points: 50
  },
  {
    id: 'first_lesson',
    title: 'Primera Lección',
    description: 'Completa una lección completa',
    condition: (progress) => 
      progress.completedLessons && progress.completedLessons.length >= 1,
    points: 30
  },
  {
    id: 'streak_3',
    title: 'Hábito',
    description: 'Mantén una racha de 3 días consecutivos',
    condition: (progress) => progress.streak >= 3,
    points: 100
  }
];

// Verificar y actualizar logros
export const checkAchievements = async (userId) => {
  if (!userId) return [];
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return [];
    
    const userData = userDoc.data();
    const progress = userData.progress || {};
    const earnedAchievements = progress.achievements || [];
    
    let newAchievements = [];
    let additionalPoints = 0;
    
    // Verificar cada logro
    for (const achievement of ACHIEVEMENTS) {
      // Si ya tiene este logro, saltarlo
      if (earnedAchievements.some(a => a.id === achievement.id)) continue;
      
      // Verificar condición
      if (achievement.condition(progress)) {
        newAchievements.push({
          id: achievement.id,
          title: achievement.title,
          earnedAt: firebaseTimestamp()
        });
        
        additionalPoints += achievement.points;
      }
    }
    
    // Si hay nuevos logros, actualizarlos
    if (newAchievements.length > 0) {
      await db.collection('users').doc(userId).update({
        'progress.achievements': [...earnedAchievements, ...newAchievements],
        'progress.points': (progress.points || 0) + additionalPoints
      });
      
      return newAchievements;
    }
    
    return [];
  } catch (error) {
    console.error('Error al verificar logros:', error);
    return [];
  }
};

// Obtener información de logros
export const getAchievementsInfo = () => {
  return ACHIEVEMENTS;
};