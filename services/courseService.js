// services/courseService.js
import { db, firebaseTimestamp } from './firebase';

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
      // Convertir Timestamp de Firebase a Date de JavaScript si existe
      const creationDate = courseData.creationDate ? 
        courseData.creationDate.toDate() : 
        new Date(); // Si no tiene fecha, usar fecha actual
      
      courses.push({
        id: doc.id,
        ...courseData,
        creationDate: creationDate
      });
    });
    
    // Ordenar cursos según el campo order
    return courses.sort((a, b) => (a.order || 999) - (b.order || 999));
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return [];
  }
};

// Crear o actualizar un curso
export const saveCourse = async (courseData) => {
  try {
    const { id, ...courseInfo } = courseData;
    
    // Añadir fecha de creación si es un nuevo curso
    const courseToSave = {
      ...courseInfo,
      // Si no tiene fecha de creación, añadirla como Timestamp de Firebase
      creationDate: courseInfo.creationDate || firebaseTimestamp()
    };
    
    if (id) {
      // Actualizar curso existente (mantener la fecha de creación original)
      await db.collection('courses').doc(id).update(courseToSave);
      return { id, ...courseToSave };
    } else {
      // Crear nuevo curso
      const docRef = await db.collection('courses').add(courseToSave);
      return { id: docRef.id, ...courseToSave };
    }
  } catch (error) {
    console.error('Error guardando curso:', error);
    throw error;
  }
};

// Obtener un curso por ID
export const getCourseById = async (id) => {
  try {
    console.log(`Obteniendo curso ${id} de Firebase...`);
    const courseDoc = await db.collection('courses').doc(id).get();
    
    if (!courseDoc.exists) {
      console.log(`No se encontró el curso con ID: ${id}`);
      return null;
    }
    
    const data = courseDoc.data();
    // Convertir Timestamp de Firebase a Date de JavaScript si existe
    const creationDate = data.creationDate ? 
      data.creationDate.toDate() : 
      new Date(); // Si no tiene fecha, usar fecha actual
    
    return {
      id: courseDoc.id,
      ...data,
      creationDate: creationDate
    };
  } catch (error) {
    console.error(`Error al obtener curso ${id}:`, error);
    return null;
  }
};

// Actualizar fechas de creación para cursos existentes sin fecha
export const updateMissingCreationDates = async () => {
  try {
    const coursesSnapshot = await db.collection('courses').get();
    
    if (coursesSnapshot.empty) {
      console.log('No hay cursos para actualizar fechas');
      return;
    }
    
    const batch = db.batch();
    let updatesNeeded = 0;
    
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      
      // Si no tiene fecha de creación, establecerla
      if (!courseData.creationDate) {
        updatesNeeded++;
        const courseRef = db.collection('courses').doc(doc.id);
        batch.update(courseRef, { creationDate: firebaseTimestamp() });
      }
    });
    
    if (updatesNeeded > 0) {
      await batch.commit();
      console.log(`Se actualizaron fechas de creación para ${updatesNeeded} cursos`);
    } else {
      console.log('Todos los cursos ya tienen fecha de creación');
    }
    
    return updatesNeeded;
  } catch (error) {
    console.error('Error actualizando fechas de creación:', error);
    throw error;
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

// Modificar o añadir esta función para manejar correctamente la finalización de lecciones
export const markExerciseComplete = async (userId, courseId, lessonId, exerciseId) => {
  if (!userId) return false;
  
  try {
    // Primero, obtener los datos del curso para encontrar todos los ejercicios de esta lección
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      console.error('Curso no encontrado');
      return false;
    }
    
    const courseData = courseDoc.data();
    
    // Encontrar todos los ejercicios para la lección actual
    const lessonExercises = courseData.exercises.filter(ex => ex.lessonId === lessonId);
    console.log(`Se encontraron ${lessonExercises.length} ejercicios para la lección ${lessonId}`);
    
    // Actualizar el estado de finalización del ejercicio en el progreso del usuario
    await db.collection('users').doc(userId).set({
      progress: {
        courses: {
          [courseId]: {
            exercises: {
              [exerciseId]: {
                completed: true,
                completedAt: firebaseTimestamp()
              }
            }
          }
        }
      }
    }, { merge: true });
    
    // Obtener el progreso actualizado del usuario para verificar la finalización de la lección
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    const userProgress = userData.progress?.courses?.[courseId]?.exercises || {};
    
    // Verificar si todos los ejercicios de esta lección están completos
    const allExercisesCompleted = lessonExercises.every(ex => userProgress[ex.id]?.completed);
    console.log(`¿Todos los ejercicios completados para la lección ${lessonId}? ${allExercisesCompleted}`);
    
    // Si todos los ejercicios están completos, marcar la lección como completada
    if (allExercisesCompleted) {
      await db.collection('users').doc(userId).set({
        progress: {
          courses: {
            [courseId]: {
              lessons: {
                [lessonId]: {
                  completed: true,
                  completedAt: firebaseTimestamp()
                }
              }
            }
          }
        }
      }, { merge: true });
      
      console.log(`Lección ${lessonId} marcada como completada`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al marcar ejercicio como completo:', error);
    return false;
  }
};

// Marcar lección como completada
export const markLessonComplete = async (userId, courseId, lessonId, exerciseId) => {
  if (!userId) return false;
  
  try {
    console.log(`Marking exercise ${exerciseId} and lesson ${lessonId} as complete for user ${userId}`);
    
    // Using batch write to update both exercise and lesson atomically
    const batch = db.batch();
    const userRef = db.collection('users').doc(userId);
    
    // Update exercise completion status
    batch.set(userRef, {
      progress: {
        courses: {
          [courseId]: {
            exercises: {
              [exerciseId]: {
                completed: true,
                completedAt: firebaseTimestamp()
              }
            }
          }
        }
      }
    }, { merge: true });
    
    // Update lesson completion status
    batch.set(userRef, {
      progress: {
        courses: {
          [courseId]: {
            lessons: {
              [lessonId]: {
                completed: true,
                completedAt: firebaseTimestamp()
              }
            }
          }
        }
      }
    }, { merge: true });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Successfully marked lesson ${lessonId} as complete`);
    return true;
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return false;
  }
};