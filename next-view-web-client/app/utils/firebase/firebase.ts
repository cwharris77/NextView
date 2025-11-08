// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuC1TJGkNWtQytZqPSQP_7vT2NRETK8cI",
  authDomain: "next-view-9b064.firebaseapp.com",
  projectId: "next-view-9b064",
  storageBucket: "next-view-9b064.firebasestorage.app",
  messagingSenderId: "219398653361",
  appId: "1:219398653361:web:26025ffeb6af002d09a990",
  measurementId: "G-R6SRPZB5QV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

/**
 * Signs in the user with their Google account.
 * @returns A promise that resolves with the result of the sign-in operation.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs out the current user.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut();
}

/**
 * Sets up an observer on the Auth object to listen for changes to the user's sign-in state.
 * @param callback A function to call when the user's sign-in state changes.
 * @returns A function to unsubscribe from the observer.
 */
export function onAuthStateChangedHelper(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
