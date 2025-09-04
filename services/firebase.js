import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Configuración de Firebase - ACTUALIZADA
const firebaseConfig = {
  apiKey: "AIzaSyDrw-9e2OjSvpxF-0Ym_eq-LH3qwJOl2RM",
  authDomain: "progpractice-61657.firebaseapp.com",
  projectId: "progpractice-61657",
  storageBucket: "progpractice-61657.firebasestorage.app",
  messagingSenderId: "489049544643",
  appId: "1:489049544643:web:25cd9441f75518ebd34f76"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Exportar los servicios
export const auth = firebase.auth();
export const db = firebase.firestore();
export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const storage = firebase.storage();
export { firebase };