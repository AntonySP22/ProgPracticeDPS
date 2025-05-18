// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { auth, db } from './firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import firebase from 'firebase/compat/app';
// import { Alert } from 'react-native';

// // Asegurarse de cerrar cualquier sesión de navegador pendiente
// WebBrowser.maybeCompleteAuthSession();

// // Configuración para Google Auth

// const ANDROID_CLIENT_ID = '417470137087-at9jb0nasnk79kd41ceaajld7vcugt1m.apps.googleusercontent.com';
// const IOS_CLIENT_ID = '417470137087-at9jb0nasnk79kd41ceaajld7vcugt1m.apps.googleusercontent.com';

// export const useGoogleAuth = () => {
//   // Usar el hook de Google.useIdTokenAuthRequest
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     iosClientId: IOS_CLIENT_ID,
//     androidClientId: ANDROID_CLIENT_ID,
//     selectAccount: true,
//   });

//   const signInWithGoogle = async () => {
//     try {
//       console.log("Iniciando autenticación con Google...");
      
//       // Verificar que el request está disponible
//       if (!request) {
//         console.log("La solicitud de autenticación no está disponible");
//         return { success: false, error: "La solicitud de autenticación no está lista" };
//       }

//       // Mostrar diálogo de autenticación de Google
//       const result = await promptAsync();
//       console.log("Resultado de autenticación:", result);
      
//       if (result.type === 'success') {
//         // Obtener el ID token
//         const { id_token } = result.params;
        
//         if (!id_token) {
//           console.error("No se recibió un token de ID válido");
//           return { success: false, error: "No se recibió un token de ID válido" };
//         }
        
//         console.log("Token ID recibido, creando credenciales...");
        
//         // Crear credenciales de Firebase
//         const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
        
//         // Iniciar sesión en Firebase
//         const userCredential = await auth.signInWithCredential(credential);
//         const user = userCredential.user;
        
//         console.log("Usuario autenticado en Firebase:", user.uid);
        
//         // Verificar si el usuario ya existe en Firestore
//         const userDoc = await db.collection('users').doc(user.uid).get();
        
//         if (!userDoc.exists) {
//           console.log("Usuario nuevo, creando perfil en Firestore...");
//           // Crear nuevo usuario en Firestore
//           await db.collection('users').doc(user.uid).set({
//             nombre: user.displayName || '',
//             email: user.email || '',
//             profileImage: user.photoURL || '',
//             score: 0,
//             achievements: [],
//             completedChallenges: [],
//             createdAt: firebase.firestore.FieldValue.serverTimestamp()
//           });
          
//           Alert.alert(
//             "¡Bienvenido!",
//             "Tu cuenta ha sido creada exitosamente.",
//             [{ text: "Entendido" }]
//           );
//         } else {
//           console.log("Usuario existente, actualizando última conexión...");
//           // Actualizar última conexión
//           await db.collection('users').doc(user.uid).update({
//             lastLogin: firebase.firestore.FieldValue.serverTimestamp()
//           });
//         }
        
//         // Obtener datos más recientes después de creación/actualización
//         const updatedUserDoc = await db.collection('users').doc(user.uid).get();
//         const userData = updatedUserDoc.data();
        
//         // Guardar en AsyncStorage
//         await AsyncStorage.setItem('userData', JSON.stringify({
//           uid: user.uid,
//           email: user.email,
//           nombre: user.displayName,
//           profileImage: user.photoURL,
//           score: userData?.score || 0
//         }));
        
//         console.log("Datos guardados en AsyncStorage, login completo");
//         return { success: true, user };
//       } else if (result.type === 'cancel') {
//         console.log("Autenticación cancelada por el usuario");
//         return { success: false, error: 'Has cancelado el inicio de sesión' };
//       } else {
//         console.error("Error en la autenticación:", result.error);
//         return { 
//           success: false, 
//           error: result.error?.message || 'Error desconocido en la autenticación'
//         };
//       }
//     } catch (error) {
//       console.error("Error crítico en la autenticación:", error);
      
//       // Manejo de errores específicos
//       if (error.code === 'auth/account-exists-with-different-credential') {
//         return { 
//           success: false, 
//           error: 'Ya existe una cuenta con este email pero usando otro método de inicio de sesión' 
//         };
//       }
      
//       return { success: false, error: error.message || "Error en la autenticación con Google" };
//     }
//   };

//   return {
//     request,
//     response,
//     signInWithGoogle
//   };
// };