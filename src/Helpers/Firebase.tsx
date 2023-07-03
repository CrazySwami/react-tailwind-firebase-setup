import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBARVJEBZvJvQ8gBEtt86FwlydmbM8PB1I",
  authDomain: "share-access-app.firebaseapp.com",
  projectId: "share-access-app",
  storageBucket: "share-access-app.appspot.com",
  messagingSenderId: "412350968974",
  appId: "1:412350968974:web:d8cbfc989cd0152f9845df",
  measurementId: "G-0MT0LSRK34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };