// services/courseService.js
import { db } from './firebase';

// Obtener todos los cursos
export const getAllCourses = async () => {
  try {
    console.log('Obteniendo todos los cursos de Firebase...');
    const coursesSnapshot = await db.collection('courses').get();
    
    if (coursesSnapshot.empty) {
      console.log('No se encontraron cursos en Firestore');
      return [];
    }
    
    const courses = [];
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      courses.push({
        id: doc.id,
        ...courseData
      });
    });
    
    // Ordenar cursos según el campo order
    return courses.sort((a, b) => (a.order || 999) - (b.order || 999));
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return [];
  }
};

// Obtener un curso específico por ID
export const getCourseById = async (courseId) => {
  try {
    console.log(`Obteniendo curso ${courseId} de Firebase...`);
    const courseDoc = await db.collection('courses').doc(courseId).get();
    
    if (!courseDoc.exists) {
      console.log(`No se encontró el curso con ID: ${courseId}`);
      return null;
    }
    
    return {
      id: courseDoc.id,
      ...courseDoc.data()
    };
  } catch (error) {
    console.error(`Error al obtener curso ${courseId}:`, error);
    return null;
  }
};

// Guardar el progreso del usuario en un ejercicio
export const saveExerciseProgress = async (userId, courseId, exerciseId, completed, score) => {
  if (!userId) return false;
  
  try {
    await db.collection('users').doc(userId).set({
      progress: {
        courses: {
          [courseId]: {
            exercises: {
              [exerciseId]: {
                completed,
                score,
                completedAt: new Date()
              }
            },
            lastAccessed: new Date()
          }
        }
      }
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error al guardar progreso:', error);
    return false;
  }
};

// Obtener el progreso de un usuario en un curso
export const getUserCourseProgress = async (userId, courseId) => {
  if (!userId) return null;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;
    
    const userData = userDoc.data();
    return userData?.progress?.courses?.[courseId] || null;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return null;
  }
};