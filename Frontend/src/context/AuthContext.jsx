import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user info on initial load
    // In a real app with cookies, we might hit an endpoint like /api/auth/me to validate session
    // For now, we'll persist user info in localStorage to specific "is logged in" state
    // The actual token is HttpOnly cookie which we can't read, but we can assume session if user data is here
    // A better approach is to fetch user profile on mount.
    
    // Simplification for this task: We will store user details (non-sensitive) in localStorage
    // to keep UI in sync. The Cookie handles the security.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Also hit backend to clear cookie, but we'll stick to UI implementation first as per request
    // Ideally: await fetch('/api/auth/logout', { method: 'POST' });
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
