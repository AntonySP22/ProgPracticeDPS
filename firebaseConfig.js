// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDerWFWboJ0gQd8KOjNNfmiHA3n39oRvls",
  authDomain: "prog-practice.firebaseapp.com",
  projectId: "prog-practice",
  storageBucket: "prog-practice.firebasestorage.app",
  messagingSenderId: "462099361926",
  appId: "1:462099361926:web:67211706df5402a9316107"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Exportar servicios
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export default firebase;