import firebase from "firebase/compat/app";

import "firebase/compat/firestore"; // Add other Firebase services you need

// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyB52wiZNjMeMZPRkW8uTLml6mRj1TLVkc8",
  authDomain: "vehicle-parking-d0dc4.firebaseapp.com",
  projectId: "vehicle-parking-d0dc4",
  storageBucket: "vehicle-parking-d0dc4.appspot.com",
  messagingSenderId: "193532685214",
  appId: "1:193532685214:web:84c55461ac368413b0c48f",
  measurementId: "G-BPZL40KLRN",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

export default db;
