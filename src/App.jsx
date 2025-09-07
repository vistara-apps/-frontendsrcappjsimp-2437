import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initializing, setInitializing] = useState(true);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token by making a request to a protected endpoint
          const res = await axios.get(`${backendUrl}/kpis`);
          
          // If successful, we can assume the token is valid
          // For now, we'll create a basic user object
          setUser({ 
            username: 'User', 
            token: token,
            // In a real app, you might decode the JWT to get user info
          });
        } catch (err) {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setInitializing(false);
    };

    checkAuthToken();
  }, [backendUrl]);

  const handleLogin = async (loginData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${backendUrl}/login`, loginData);
      const userData = res.data;
      
      // Store JWT token for future requests
      if (userData.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        localStorage.setItem('authToken', userData.token);
      }
      
      setUser(userData);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError('');
    
    // Clear JWT token
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  };

  // Show loading spinner while checking for existing token
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {!user ? (
        <LoginForm 
          onLogin={handleLogin} 
          loading={loading} 
          error={error} 
        />
      ) : (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          backendUrl={backendUrl}
        />
      )}
    </div>
  );
}

export default App;
