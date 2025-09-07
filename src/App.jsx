import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = 'http://localhost:5000';

  const handleLogin = async (loginData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${backendUrl}/login`, loginData);
      setUser(res.data);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError('');
  };

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