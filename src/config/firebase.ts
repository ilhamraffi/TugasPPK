import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log('[Firebase] Initializing Firebase app');
const app = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === 'web') {
  console.log('[Firebase] Using web getAuth');
  auth = getAuth(app);
} else {
  console.log('[Firebase] Using React Native auth with AsyncStorage persistence');
  // @ts-ignore getReactNativePersistence is available in the react-native export of firebase/auth
  const { getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

console.log('[Firebase] Firebase initialized successfully');

const db = getFirestore(app);

export { auth, db };
export default app;
