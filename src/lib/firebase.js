// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuSGwTcIXiOF2vO8Xuv5I0CbYvHt5vrA0",
  authDomain: "klarai-database.firebaseapp.com",
  projectId: "klarai-database",
  storageBucket: "klarai-database.firebasestorage.app",
  messagingSenderId: "35670944637",
  appId: "1:35670944637:web:f96c735e3565ca5fd63a14",
  measurementId: "G-5T64DH4FCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);