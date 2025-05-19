import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import gamificationService from '../services/gamificationService';

// Definir constantes necesarias localmente
const MAX_LIVES = 5;
const LIFE_RECHARGE_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos

export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [timeToNextLife, setTimeToNextLife] = useState(null);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [achievementsInfo, setAchievementsInfo] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Cargar información de logros disponibles
  useEffect(() => {
    const loadAchievementsInfo = async () => {
      const info = await gamificationService.getAchievementsInfo();
      setAchievementsInfo(info);
    };
    
    loadAchievementsInfo();
  }, []);

  // Verificar el usuario actual y cargar su progreso
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadUserProgress(user.uid);
        
        // Ya no actualizamos la racha al iniciar sesión
        // sino solo al completar lecciones
      } else {
        setUserId(null);
        resetProgress();
      }
      setLoadingProgress(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Timer para actualizar el tiempo hasta la próxima vida
  useEffect(() => {
    if (lives < 5 && timeToNextLife) {
      const interval = setInterval(async () => {
        if (userId) {
          const { lives: updatedLives, timeToNextLife: updatedTime } = 
            await gamificationService.updateLives(userId);
          
          setLives(updatedLives);
          setTimeToNextLife(updatedTime);
          
          if (updatedLives >= 5) {
            clearInterval(interval);
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [lives, timeToNextLife, userId]);

  const loadUserProgress = async (uid) => {
    if (!uid) return;
    
    try {
      setLoadingProgress(true);
      
      // Cargar datos de gamificación
      const gamificationData = await gamificationService.loadGamificationData(uid);
      
      console.log('Datos cargados:', gamificationData); // Para depuración
      
      if (gamificationData) {
        setXp(gamificationData.xp || 0);
        setLevel(gamificationData.level || 1);
        setLives(gamificationData.lives || MAX_LIVES);
        setStreak(gamificationData.streak || 0);
        setAchievements(gamificationData.achievements || []);
        
        // Actualizar tiempo de recarga si es necesario
        if (gamificationData.lives < MAX_LIVES && gamificationData.lastLifeRecharge) {
          const nextRecharge = new Date(gamificationData.lastLifeRecharge.toDate().getTime() + LIFE_RECHARGE_TIME);
          const now = new Date();
          const diff = nextRecharge - now;
          
          if (diff > 0) {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeToNextLife(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          }
        } else {
          setTimeToNextLife(null);
        }
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const addXp = async (amount) => {
    if (!userId) return;
    
    try {
      const result = await gamificationService.addXp(userId, amount);
      if (result) {
        setXp(result.xp);
        setLevel(result.level);
      }
    } catch (error) {
      console.error('Error añadiendo XP:', error);
    }
  };

  const decreaseLife = async () => {
    if (!userId) return;
    
    try {
      const result = await gamificationService.decreaseLife(userId);
      if (result) {
        setLives(result.lives);
      }
    } catch (error) {
      console.error('Error restando vida:', error);
    }
  };

  const refreshLives = async () => {
    if (!userId) return;
    
    try {
      const { lives: updatedLives, timeToNextLife: updatedTime } = 
        await gamificationService.updateLives(userId);
      
      setLives(updatedLives);
      setTimeToNextLife(updatedTime);
    } catch (error) {
      console.error('Error refrescando vidas:', error);
    }
  };

  const unlockAchievement = async (achievementId) => {
    if (!userId) return;
    
    try {
      const result = await gamificationService.unlockAchievement(userId, achievementId);
      if (result) {
        // Recargar logros
        await loadUserProgress(userId);
      }
    } catch (error) {
      console.error('Error desbloqueando logro:', error);
    }
  };

  const resetProgress = () => {
    setXp(0);
    setLevel(1);
    setLives(5);
    setStreak(0);
    setAchievements([]);
    setTimeToNextLife(null);
  };

  return (
    <GamificationContext.Provider value={{
      userId,
      xp,
      level,
      lives,
      streak,
      timeToNextLife,
      achievements,
      achievementsInfo,
      loadingProgress,
      addXp,
      decreaseLife,
      refreshLives,
      unlockAchievement,
      loadUserProgress
    }}>
      {children}
    </GamificationContext.Provider>
  );
};
