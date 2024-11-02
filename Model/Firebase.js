import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getIdToken as getFirebaseIdToken } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyB-Q5iHnWu-ccUeURUz4CttwX8XQXtxYeg",
  authDomain: "dsagame-2425049.firebaseapp.com",
  databaseURL: "https://dsagame-2425049-default-rtdb.firebaseio.com",
  projectId: "dsagame-2425049",
  storageBucket: "dsagame-2425049.appspot.com",
  messagingSenderId: "414131101203",
  appId: "1:414131101203:web:d3235e11b4fcf204c9e9e6",
  measurementId: "G-LYQ4N2V3KT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); 

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    console.log("User ID:", userId);
  } else {
    console.log("No user is logged in.");
  }
});
console.log("Firebase initialized:", app.name); 


export { app, auth, database, onAuthStateChanged, getFirebaseIdToken as getIdToken };
