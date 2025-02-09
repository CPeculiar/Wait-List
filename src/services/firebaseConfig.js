import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBaJLXoCDoz9W5wuSPrPVslsLOiAVraOJQ",
  authDomain: "tech-academy-8a341.firebaseapp.com",
  projectId: "tech-academy-8a341",
  storageBucket: "tech-academy-8a341.firebasestorage.app",
  messagingSenderId: "258764322577",
  appId: "1:258764322577:web:4d941122a1c36cd12b3eb0",
  measurementId: "G-C52038MYF7"
};

  console.log("Firebase Config:", firebaseConfig);
 

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const functions = getFunctions(app);
  export const storage = getStorage(app);
  
  console.log("Firebase successfully initialized");
  console.log("Firebase initialized:", app);
  console.log("Firestore instance:", db);
  export default app;
  
