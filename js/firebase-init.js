// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6zzMVCndNQM7P-tn9FEuEkzd4r8DNah4",
  authDomain: "workwith-1f209.firebaseapp.com",
  projectId: "workwith-1f209",
  storageBucket: "workwith-1f209.firebasestorage.app",
  messagingSenderId: "7158486213",
  appId: "1:7158486213:web:af29768b035e0627114cac",
  measurementId: "G-ZN8E2VMNR2"
};
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
