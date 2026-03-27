// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs-W21Ua13FEP0YNpAC8klLTUzY3_TCqY",
  authDomain: "gininotifications.firebaseapp.com",
  projectId: "gininotifications",
  storageBucket: "gininotifications.firebasestorage.app",
  messagingSenderId: "358533367354",
  appId: "1:358533367354:web:307d0bfcb9312eac66d703",
  measurementId: "G-BGR6283WFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);