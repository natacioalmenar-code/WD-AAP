// firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AQUÍ_EL_TEU_API_KEY",
  authDomain: "AQUÍ_EL_TEU_AUTH_DOMAIN",
  projectId: "AQUÍ_EL_TEU_PROJECT_ID",
  storageBucket: "AQUÍ_EL_TEU_STORAGE_BUCKET",
  messagingSenderId: "AQUÍ_EL_TEU_MESSAGING_ID",
  appId: "AQUÍ_EL_TEU_APP_ID",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

