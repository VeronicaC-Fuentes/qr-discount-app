// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjimDZUIfdgzBvxPWILQ7Dt0Z_YrSuT14",
  authDomain: "fir-qrprom.firebaseapp.com",
  projectId: "fir-qrprom",
  storageBucket: "fir-qrprom.appspot.com",
  messagingSenderId: "483290937393",
  appId: "1:483290937393:web:065b4c8cab498b1009fd10",
  measurementId: "G-LW8DSJ8NH2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Exporta la base de datos Firestore
