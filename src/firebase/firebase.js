import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqz13lcjSIIXaV7Zwe-miPf1dzZdTAPZQ",
  authDomain: "myovision-demo.firebaseapp.com",
  projectId: "myovision-demo",
  storageBucket: "myovision-demo.firebasestorage.app",
  messagingSenderId: "317132422436",
  appId: "1:317132422436:web:53a522788be65d67b9c7b1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
