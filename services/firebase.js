import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpLHVDwC4u40NCdxbMKztjQhZwPJwbgJw",
  authDomain: "progpractice-b4a2a.firebaseapp.com",
  projectId: "progpractice-b4a2a",
  storageBucket: "progpractice-b4a2a.appspot.com",
  messagingSenderId: "417470137087",
  appId: "1:417470137087:web:b36beac3ed4f1be4c842ca"
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