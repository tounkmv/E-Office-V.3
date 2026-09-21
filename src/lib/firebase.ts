import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance using the custom databaseId if configured, or default
export const db = (firebaseConfigData as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfigData as any).firestoreDatabaseId) 
  : getFirestore(app);

export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
};
