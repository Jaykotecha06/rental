import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk2GzlxD5klAZMHsIwv8c_3q_5_SvVvWE",
  authDomain: "rentalnew.firebaseapp.com",
  databaseURL: "https://rentalnew-default-rtdb.firebaseio.com",
  projectId: "rentalnew",
  storageBucket: "rentalnew.firebasestorage.app",
  messagingSenderId: "856052766161",
  appId: "1:856052766161:web:4a42c79a98d284f3727cf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Set persistence to LOCAL - ये refresh के बाद भी login रखेगा
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('❌ Error setting persistence:', error);
  });

console.log('Firebase initialized:');
console.log('- Auth:', auth ? '✅' : '❌');
console.log('- Database:', db ? '✅' : '❌');
console.log('- Storage:', storage ? '✅' : '❌');

export default app;