import { useState, useEffect } from 'react';
import { updateUserLives } from '../services/userProgressService';

const MAX_LIVES = 5;
const LIFE_RECHARGE_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos

export default function useLifeRestoration(userId) {
  const [lives, setLives] = useState(MAX_LIVES);
  const [nextLifeTime, setNextLifeTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar vidas inicialmente y configurar el temporizador
  useEffect(() => {
    if (!userId) {
      setLives(MAX_LIVES);
      setNextLifeTime(null);
      setTimeRemaining(null);
      setIsLoading(false);
      return;
    }

    const loadLives = async () => {
      try {
        setIsLoading(true);
        const { lives: currentLives, lastLifeRecharge } = await updateUserLives(userId);
        
        setLives(currentLives);
        
        if (currentLives < MAX_LIVES) {
          const rechargeTime = new Date(lastLifeRecharge);
          rechargeTime.setMilliseconds(rechargeTime.getMilliseconds() + LIFE_RECHARGE_TIME);
          setNextLifeTime(rechargeTime);
        } else {
          setNextLifeTime(null);
        }
      } catch (error) {
        console.error('Error cargando vidas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLives();
    
    // Configurar intervalo para refrescar cada minuto
    const interval = setInterval(loadLives, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  // Actualizar el contador de tiempo restante
  useEffect(() => {
    if (!nextLifeTime || lives >= MAX_LIVES) {
      setTimeRemaining(null);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextLifeTime - now;
      
      if (diff <= 0) {
        // Tiempo completo, actualizar vidas
        updateUserLives(userId).then(({ lives: updatedLives }) => {
          setLives(updatedLives);
          if (updatedLives < MAX_LIVES) {
            const newRechargeTime = new Date();
            newRechargeTime.setMilliseconds(newRechargeTime.getMilliseconds() + LIFE_RECHARGE_TIME);
            setNextLifeTime(newRechargeTime);
          } else {
            setNextLifeTime(null);
            setTimeRemaining(null);
            clearInterval(timer);
          }
        });
      } else {
        // Actualizar tiempo restante
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextLifeTime, lives, userId]);

  return {
    lives,
    timeRemaining,
    isLoading,
    isMaxLives: lives >= MAX_LIVES,
    refresh: async () => {
      if (userId) {
        const { lives: updatedLives } = await updateUserLives(userId);
        setLives(updatedLives);
      }
    }
  };
}