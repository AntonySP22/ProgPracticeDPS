// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Firebase configuration - NUEVO PROYECTO
const firebaseConfig = {
  apiKey: "AIzaSyB4i196n1vh5DUvYeQnEY7XKdXFijXlyzA",
  authDomain: "progpractice-b50f1.firebaseapp.com",
  projectId: "progpractice-b50f1",
  storageBucket: "progpractice-b50f1.firebasestorage.app",
  messagingSenderId: "164452496653",
  appId: "1:164452496653:web:55e6fec0a5b90000bfac44"
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