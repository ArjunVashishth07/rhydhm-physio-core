import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('rhydhm_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('rhydhm_lang', newLang);
    } catch {
      // Ignore localStorage access failures
    }
  }, []);

  // Memoized translation helper to prevent breaking memoized consumers
  const t = useCallback(
    (key) => {
      if (!key) return '';
      const currentDict = translations[lang] || translations.en;
      if (currentDict && currentDict[key] !== undefined) {
        return currentDict[key];
      }
      if (translations.en && translations.en[key] !== undefined) {
        return translations.en[key];
      }
      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
