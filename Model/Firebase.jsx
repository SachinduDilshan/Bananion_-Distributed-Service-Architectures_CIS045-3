import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // For Realtime Database
import { getAuth } from "firebase/auth"; // For Authentication

const firebaseConfig = {
  apiKey: "AIzaSyB-Q5iHnWu-ccUeURUz4CttwX8XQXtxYeg",
  authDomain: "dsagame-2425049.firebaseapp.com",
  projectId: "dsagame-2425049",
  databaseURL: "https://dsagame-2425049-default-rtdb.firebaseio.com",
  storageBucket: "dsagame-2425049.appspot.com",
  messagingSenderId: "414131101203",
  appId: "1:414131101203:web:d3235e11b4fcf204c9e9e6",
  measurementId: "G-LYQ4N2V3KT"
};
const app = initializeApp(firebaseConfig);


// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app); // For Realtime Database

export { auth, database }; // Export initialized services