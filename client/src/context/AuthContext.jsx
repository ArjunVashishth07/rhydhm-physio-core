import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('rhydhm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('rhydhm_token') || null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  const openAuthModal = useCallback((callback = null) => {
    if (callback && typeof callback === 'function') {
      setPendingCallback(() => callback);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  }, []);

  const loginUser = useCallback(
    (userData, authToken = null) => {
      setUser(userData);
      try {
        localStorage.setItem('rhydhm_user', JSON.stringify(userData));
        if (authToken) {
          setToken(authToken);
          localStorage.setItem('rhydhm_token', authToken);
        }
      } catch {
        // Ignore localStorage access failures
      }
      setIsAuthModalOpen(false);
      if (pendingCallback) {
        pendingCallback(userData);
        setPendingCallback(null);
      }
    },
    [pendingCallback]
  );

  const logoutUser = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('rhydhm_user');
      localStorage.removeItem('rhydhm_token');
    } catch {
      // Ignore localStorage access failures
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
