// src/services/firestore.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaJLXoCDoz9W5wuSPrPVslsLOiAVraOJQ",
  authDomain: "tech-academy-8a341.firebaseapp.com",
  projectId: "tech-academy-8a341",
  storageBucket: "tech-academy-8a341.firebasestorage.app",
  messagingSenderId: "258764322577",
  appId: "1:258764322577:web:4d941122a1c36cd12b3eb0",
  measurementId: "G-C52038MYF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

let analytics = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

console.log("Firebase successfully initialized");
console.log("Firebase initialized:", app);
console.log("Firestore instance:", db);


export const submitApplication = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "applications"), {
      ...formData,
      submittedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const submitWaitListApplication = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "DataAnalysisWaitlist"), {
      ...formData,
      submittedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const submitFormApplication = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "leadershipApplications"), {
      ...formData,
      submittedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};


export const fetchApplications = async () => {
  try {
    const q = query(
      collection(db, "applications"), 
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt.toDate() // Convert Timestamp to Date
      };
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

// Export initialized services
export { db, auth, functions, storage, analytics };
export default app;