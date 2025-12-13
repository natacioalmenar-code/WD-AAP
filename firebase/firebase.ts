// firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF7dXNLmtZH_G56HGwagFQTF_NcgB-QFo",
  authDomain: "west-divers-app.firebaseapp.com",
  projectId: "west-divers-app",
  storageBucket: "west-divers-app.firebasestorage.app",
  messagingSenderId: "35101400494",
  appId: "1:35101400494:web:75c381e9afe03e865b3c3f",
  measurementId: "G-QDNW56CSDG"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

