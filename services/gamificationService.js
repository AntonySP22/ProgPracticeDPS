import { db, firebaseTimestamp } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes
const MAX_LIVES = 5;
const LIFE_RECHARGE_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos
const STREAK_THRESHOLD_HOURS = 24; // Cambiado de 36 a 24 horas (un día exacto)

export const gamificationService = {
  // Inicializar datos de gamificación para un nuevo usuario
  initGamification: async (userId) => {
    try {
      await db.collection('users').doc(userId).set({
        gamification: {
          xp: 0,
          level: 1,
          lives: MAX_LIVES,
          lastLifeRecharge: firebaseTimestamp(),
          streak: 0,
          lastStreakUpdate: firebaseTimestamp()
        },
        achievements: []
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error inicializando gamificación:', error);
      return false;
    }
  },

  // Cargar los datos de gamificación del usuario
  loadGamificationData: async (userId) => {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      
      // Si no existe la estructura de gamificación, la inicializamos
      if (!userData.gamification) {
        await gamificationService.initGamification(userId);
        return {
          xp: 0,
          level: 1,
          lives: MAX_LIVES,
          streak: 0,
          achievements: []
        };
      }

      // Calculamos las vidas actuales basado en el tiempo transcurrido
      const livesInfo = await gamificationService.updateLives(userId, userData.gamification);
      
      return {
        xp: userData.gamification.xp || 0,
        level: userData.gamification.level || 1,
        lives: livesInfo.lives,
        streak: userData.gamification.streak || 0,
        achievements: userData.achievements || [],
        lastLifeRecharge: userData.gamification.lastLifeRecharge || null
      };
    } catch (error) {
      console.error('Error cargando datos de gamificación:', error);
      return {
        xp: 0,
        level: 1,
        lives: MAX_LIVES,
        streak: 0,
        achievements: []
      };
    }
  },

  // Aumentar XP y actualizar nivel
  addXp: async (userId, amount) => {
    if (!userId || amount <= 0) {
      console.warn('ID de usuario no válido o cantidad incorrecta de puntos');
      return null;
    }
    
    try {
      const userRef = db.collection('users').doc(userId);
      
      // Usar transacción para garantizar la consistencia
      return await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists) {
          throw new Error('Usuario no encontrado');
        }
        
        const userData = userDoc.data();
        const currentXp = (userData.gamification?.xp || 0) + amount;
        const newLevel = Math.floor(currentXp / 100) + 1;
        
        // Actualizar datos de gamificación
        transaction.update(userRef, {
          'gamification.xp': currentXp,
          'gamification.level': newLevel
        });
        
        // Intentar actualizar también AsyncStorage
        try {
          const storedData = await AsyncStorage.getItem('userData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            parsedData.score = currentXp;
            parsedData.level = newLevel;
            await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
          }
        } catch (storageError) {
          console.warn('Error al sincronizar con AsyncStorage:', storageError);
        }
        
        console.log(`XP añadido exitosamente: ${amount} puntos. Total: ${currentXp}, Nivel: ${newLevel}`);
        return { xp: currentXp, level: newLevel };
      });
    } catch (error) {
      console.error('Error añadiendo XP:', error);
      return null;
    }
  },

  // Actualizar vidas y calcular tiempo de recarga
  updateLives: async (userId, gamificationData = null) => {
    try {
      if (!gamificationData) {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new Error('Usuario no encontrado');
        }
        gamificationData = userDoc.data().gamification;
      }
      
      let lives = gamificationData.lives || MAX_LIVES;
      const lastRecharge = gamificationData.lastLifeRecharge ? 
        gamificationData.lastLifeRecharge.toDate() : new Date();
        
      // Si ya tiene el máximo, no necesitamos calcular más
      if (lives >= MAX_LIVES) {
        return {
          lives: MAX_LIVES,
          timeToNextLife: null
        };
      }

      // Calcular cuántas vidas se han regenerado
      const now = new Date();
      const timeDiff = now - lastRecharge;
      const livesToRecharge = Math.min(
        Math.floor(timeDiff / LIFE_RECHARGE_TIME),
        MAX_LIVES - lives
      );

      // Calcular nuevo tiempo de la última recarga
      let newLastRecharge = lastRecharge;
      if (livesToRecharge > 0) {
        // Si se han regenerado vidas, actualizamos el tiempo de la última recarga
        const newLives = lives + livesToRecharge;
        newLastRecharge = new Date(lastRecharge.getTime() + (livesToRecharge * LIFE_RECHARGE_TIME));
        
        // Actualizar en Firestore
        await db.collection('users').doc(userId).update({
          'gamification.lives': newLives,
          'gamification.lastLifeRecharge': firebaseTimestamp(newLastRecharge)
        });
        
        lives = newLives;
      }

      // Calcular tiempo hasta la próxima recarga
      let timeToNextLife = null;
      if (lives < MAX_LIVES) {
        const nextRecharge = new Date(newLastRecharge.getTime() + LIFE_RECHARGE_TIME);
        const timeRemaining = nextRecharge - now;
        
        // Formatear en MM:SS
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        timeToNextLife = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      return {
        lives,
        timeToNextLife
      };
    } catch (error) {
      console.error('Error actualizando vidas:', error);
      return { 
        lives: MAX_LIVES, 
        timeToNextLife: null 
      };
    }
  },

  // Restar una vida
  decreaseLife: async (userId) => {
    try {
      // Primero actualizamos para asegurarnos que tenemos el valor correcto
      const { lives } = await gamificationService.updateLives(userId);
      
      if (lives <= 0) {
        return { lives: 0 };
      }
      
      const newLives = Math.max(0, lives - 1);
      
      // También actualizamos lastLifeRecharge si no es el máximo de vidas
      if (newLives < MAX_LIVES) {
        await db.collection('users').doc(userId).update({
          'gamification.lives': newLives,
          'gamification.lastLifeRecharge': firebaseTimestamp() // Actualizamos el timestamp para iniciar la recarga
        });
      } else {
        await db.collection('users').doc(userId).update({
          'gamification.lives': newLives
        });
      }
      
      return { lives: newLives };
    } catch (error) {
      console.error('Error al restar vida:', error);
      return { lives: 0 };
    }
  },

  // Actualizar racha diaria
  updateStreak: async (userId, lessonCompleted = false) => {
    try {
      if (!userId) {
        console.warn('Se intentó actualizar racha sin ID de usuario');
        return { streak: 0, updated: false };
      }
      
      // Si no se completó una lección, no actualizamos la racha
      if (!lessonCompleted) {
        console.log('No se actualizó la racha porque no se completó una lección');
        return { streak: 0, updated: false };
      }
      
      console.log(`Actualizando racha para usuario: ${userId}, lección completada: ${lessonCompleted}`);
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = userDoc.data();
      const lastUpdate = userData.gamification?.lastStreakUpdate?.toDate() || new Date(0);
      const now = new Date();
      
      // Verificar si estamos en un nuevo día (comparando solo fechas)
      const lastDate = new Date(lastUpdate);
      const todayDate = new Date(now);
      const isNewDay = 
        lastDate.getFullYear() !== todayDate.getFullYear() ||
        lastDate.getMonth() !== todayDate.getMonth() ||
        lastDate.getDate() !== todayDate.getDate();
      
      // Calcular diferencia en horas para verificar que no pasó demasiado tiempo
      const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
      
      console.log(`Horas desde última actualización: ${hoursDiff.toFixed(2)}, ¿Es nuevo día?: ${isNewDay}`);
      
      let newStreak = userData.gamification?.streak || 0;
      let updatedStreakToday = userData.gamification?.updatedStreakToday || false;
      let updated = false;
      
      // Si es un nuevo día dentro del umbral de tiempo (24h) Y completó una lección
      if (isNewDay && hoursDiff <= 24) {
        newStreak++; // Incrementar racha
        updatedStreakToday = true;
        updated = true;
        console.log(`Racha incrementada a ${newStreak} - nuevo día dentro de 24h`);
      } 
      // Si ha pasado más de 24 horas sin actividad, reiniciar la racha pero contar el día actual
      else if (hoursDiff > 24) {
        newStreak = 1; // Reiniciar racha pero contar el día actual
        updatedStreakToday = true;
        updated = true;
        console.log(`Racha reiniciada a 1 - más de 24h sin actividad`);
      }
      // Si ya actualizó la racha hoy, no hacer nada con el contador
      else if (!isNewDay && updatedStreakToday) {
        console.log(`Racha ya actualizada hoy, se mantiene en ${newStreak}`);
        updated = false;
      }
      // Si es el mismo día, pero no ha actualizado la racha hoy y completa una lección, 
      // iniciar racha o mantener la existente
      else if (!isNewDay && !updatedStreakToday && lessonCompleted) {
        if (newStreak === 0) {
          newStreak = 1;
          console.log(`Racha iniciada en 1 - primera actividad`);
        }
        updatedStreakToday = true;
        updated = true;
      }
      
      // Actualizar en Firestore
      await db.collection('users').doc(userId).update({
        'gamification.streak': newStreak,
        'gamification.lastStreakUpdate': firebaseTimestamp(),
        'gamification.updatedStreakToday': updatedStreakToday
      });
      
      // Verificar logros de racha
      if (updated && (newStreak === 3 || newStreak === 7 || newStreak === 30)) {
        await gamificationService.checkStreakAchievements(userId, newStreak);
      }
      
      return { streak: newStreak, updated };
    } catch (error) {
      console.error('Error actualizando racha:', error);
      return { streak: 0, updated: false };
    }
  },

  // Verificar logros de racha
  checkStreakAchievements: async (userId, streak) => {
    try {
      if (streak === 3) {
        await gamificationService.unlockAchievement(userId, 'streak_3days');
      } else if (streak === 7) {
        await gamificationService.unlockAchievement(userId, 'streak_7days');
      } else if (streak === 30) {
        await gamificationService.unlockAchievement(userId, 'streak_30days');
      }
    } catch (error) {
      console.error('Error verificando logros de racha:', error);
    }
  },

  // Desbloquear un logro
  unlockAchievement: async (userId, achievementId) => {
    try {
      // Verificar si el usuario ya tiene el logro
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = userDoc.data();
      const userAchievements = userData.achievements || [];
      
      // Comprobar si ya lo tiene
      if (userAchievements.some(a => a.id === achievementId)) {
        return false; // Ya tiene el logro
      }
      
      // Obtener información del logro
      let achievementPoints = 0;
      const achievementsInfo = getAchievementsInfo();
      const achievementInfo = achievementsInfo.find(a => a.id === achievementId);
      
      if (achievementInfo) {
        achievementPoints = achievementInfo.points || 0;
      }
      
      // Añadir el logro al usuario - USAR DATE EN LUGAR DE SERVER TIMESTAMP
      const currentDate = new Date();
      const newAchievement = {
        id: achievementId,
        earnedAt: currentDate,
        points: achievementPoints
      };
      
      await db.collection('users').doc(userId).update({
        achievements: [...userAchievements, newAchievement]
      });
      
      // Otorgar puntos por el logro
      if (achievementPoints > 0) {
        await gamificationService.addXp(userId, achievementPoints);
      }
      
      return true;
    } catch (error) {
      console.error('Error desbloqueando logro:', error);
      return false;
    }
  },

  // Verificar logros por ejercicio completado
  checkExerciseAchievements: async (userId) => {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = userDoc.data();
      const progress = userData.progress || {};
      let totalExercises = 0;
      
      // Contar ejercicios completados
      Object.keys(progress.courses || {}).forEach(courseId => {
        const exercises = progress.courses[courseId].exercises || {};
        Object.keys(exercises).forEach(exerciseId => {
          if (exercises[exerciseId].completed) {
            totalExercises++;
          }
        });
      });
      
      // Verificar logros por cantidad de ejercicios
      if (totalExercises >= 1) {
        await gamificationService.unlockAchievement(userId, 'first_exercise');
      }
      if (totalExercises >= 5) {
        await gamificationService.unlockAchievement(userId, 'five_exercises');
      }
      if (totalExercises >= 20) {
        await gamificationService.unlockAchievement(userId, 'twenty_exercises');
      }
      
    } catch (error) {
      console.error('Error verificando logros por ejercicios:', error);
    }
  }
};

// Definición de logros disponibles
const getAchievementsInfo = () => {
  return [
    {
      id: 'first_exercise',
      title: 'Primer Paso',
      description: 'Completa tu primer ejercicio',
      icon: 'star',
      points: 20,
      category: 'exercises'
    },
    {
      id: 'five_exercises',
      title: 'Constancia',
      description: 'Completa 5 ejercicios',
      icon: 'flame',
      points: 50,
      category: 'exercises'
    },
    {
      id: 'twenty_exercises',
      title: 'Experto',
      description: 'Completa 20 ejercicios',
      icon: 'school',
      points: 100,
      category: 'exercises'
    },
    {
      id: 'streak_3days',
      title: 'Hábito',
      description: 'Usaste la app 3 días seguidos',
      icon: 'flame',
      points: 30,
      category: 'streak'
    },
    {
      id: 'streak_7days',
      title: 'Perseverancia',
      description: 'Usaste la app 7 días seguidos',
      icon: 'flame',
      points: 70,
      category: 'streak'
    },
    {
      id: 'streak_30days',
      title: 'Imparable',
      description: 'Usaste la app 30 días seguidos',
      icon: 'flame',
      points: 200,
      category: 'streak'
    }
  ];
};

// También exportamos getAchievementsInfo para usar en otros archivos
gamificationService.getAchievementsInfo = getAchievementsInfo;

export default gamificationService;