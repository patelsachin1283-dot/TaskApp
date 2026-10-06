import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.get('/user');
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to load user:', err);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      } else {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message;
        setError(
          status
            ? `Server error (${status}): ${serverMessage || 'Unknown error'}`
            : 'Cannot reach the server. Is "php artisan serve" running?'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (form) => {
    const res = await api.post('/register', form);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  if (error) {
    return (
      <div className="center-screen">
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <h3>Something went wrong</h3>
          <p className="muted" style={{ margin: '12px 0 20px' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadUser}>Try again</button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);