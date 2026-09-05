import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rhydhm_theme') || 'light';
  });

  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('rhydhm_lang') || 'en';
  });

  // User Authentication State (Persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('rhydhm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rhydhm_theme', theme);
  }, [theme]);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('rhydhm_lang', newLang);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const openAuthModal = (callback = null) => {
    if (callback && typeof callback === 'function') {
      setPendingCallback(() => callback);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('rhydhm_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    if (pendingCallback) {
      pendingCallback(userData);
      setPendingCallback(null);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('rhydhm_user');
  };

  const t = (key) => {
    if (!key) return '';
    const currentDict = translations[lang] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        t,
        user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
