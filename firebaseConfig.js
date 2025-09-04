// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration - ACTUALIZADA
const firebaseConfig = {
  apiKey: "AIzaSyDrw-9e2OjSvpxF-0Ym_eq-LH3qwJOl2RM",
  authDomain: "progpractice-61657.firebaseapp.com",
  projectId: "progpractice-61657",
  storageBucket: "progpractice-61657.firebasestorage.app",
  messagingSenderId: "489049544643",
  appId: "1:489049544643:web:25cd9441f75518ebd34f76"
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