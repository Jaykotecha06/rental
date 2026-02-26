import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from './firebase';
import { ref, set } from 'firebase/database';

class AuthService {
  async signup(name, email, password) {
    try {
      console.log('📝 Attempting signup for:', email);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Save user data to Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        name,
        email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      console.log('✅ Signup successful for:', user.uid);

      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      };
    } catch (error) {
      console.error('❌ Signup error:', error.code, error.message);
      throw this.handleError(error);
    }
  }

  async login(email, password) {
    try {
      console.log('🔑 Attempting login for:', email);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await set(ref(db, `users/${user.uid}/lastLogin`), new Date().toISOString());

      console.log('✅ Login successful for:', user.uid);

      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      };
    } catch (error) {
      console.error('❌ Login error:', error.code, error.message);
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
      // Clear any local storage items if needed
      localStorage.removeItem('persist:root'); // अगर redux persist use कर रहे हैं
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  handleError(error) {
    let message = 'An error occurred';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection.';
        break;
      default:
        message = error.message;
    }
    return message;
  }
}

export default new AuthService();