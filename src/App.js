import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import store from './redux/store';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from './redux/actions/authActions';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import RentList from './pages/rent/RentList';
import LightBillList from './pages/lightbill/LightBillList';
import DepositList from './pages/deposit/DepositList';
import ExpenseList from './pages/expense/ExpenseList';
import DocumentList from './pages/document/DocumentList';
import PrivateRoute from './components/common/PrivateRoute';

// Auth State Listener Component
function AuthListener({ children }) {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('📋 Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      if (user) {
        // User is signed in
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User'
        };
        console.log('✅ User authenticated:', userData.email);
        dispatch(loginSuccess(userData));
      } else {
        // User is signed out
        console.log('❌ No authenticated user');
        dispatch(logout());
      }
      
      setIsAuthChecked(true);
    });

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  // Jab tak auth check नहीं हो जाता, loading दिखाओ
  if (!isAuthChecked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return children;
}

function AppContent() {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
      } />
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      
      {/* Private Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/rent" element={
        <PrivateRoute>
          <RentList />
        </PrivateRoute>
      } />
      <Route path="/lightbill" element={
        <PrivateRoute>
          <LightBillList />
        </PrivateRoute>
      } />
      <Route path="/deposit" element={
        <PrivateRoute>
          <DepositList />
        </PrivateRoute>
      } />
      <Route path="/expense" element={
        <PrivateRoute>
          <ExpenseList />
        </PrivateRoute>
      } />
      <Route path="/document" element={
        <PrivateRoute>
          <DocumentList />
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthListener>
          <div className="App">
            <ToastContainer 
              position="top-right" 
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <AppContent />
          </div>
        </AuthListener>
      </Router>
    </Provider>
  );
}

export default App;