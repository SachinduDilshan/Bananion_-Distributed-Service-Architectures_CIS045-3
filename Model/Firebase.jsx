import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-Q5iHnWu-ccUeURUz4CttwX8XQXtxYeg",
  authDomain: "dsagame-2425049.firebaseapp.com",
  projectId: "dsagame-2425049",
  storageBucket: "dsagame-2425049.appspot.com",
  messagingSenderId: "414131101203",
  appId: "1:414131101203:web:d3235e11b4fcf204c9e9e6",
  measurementId: "G-LYQ4N2V3KT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);