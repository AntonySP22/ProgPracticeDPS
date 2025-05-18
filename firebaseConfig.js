// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const auth = getAuth(app);