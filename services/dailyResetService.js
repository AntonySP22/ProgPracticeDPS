import { db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkDailyReset = async (userId) => {
  if (!userId) return;
  
  try {
    // Verificar la última fecha de reseteo
    const lastResetDateStr = await AsyncStorage.getItem('lastStreakReset');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Si no hay fecha guardada o es de un día diferente
    if (!lastResetDateStr || new Date(lastResetDateStr) < today) {
      console.log('Ejecutando reseteo diario de racha...');
      
      // Resetear la bandera de actualización diaria
      await db.collection('users').doc(userId).update({
        'gamification.updatedStreakToday': false
      });
      
      // Guardar la fecha actual como último reseteo
      await AsyncStorage.setItem('lastStreakReset', today.toISOString());
      
      console.log('Reseteo diario completado para tracking de racha');
    }
  } catch (error) {
    console.error('Error en reseteo diario:', error);
  }
};