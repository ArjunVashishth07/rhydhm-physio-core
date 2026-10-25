import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * AppProvider: Composed provider nesting independent Theme, Language, and Auth contexts.
 * This ensures that changing theme or language does not trigger re-renders in auth-dependent trees.
 */
export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

/**
 * useApp: Unified backwards-compatible aggregator hook.
 * Composes useTheme, useLanguage, and useAuth so existing consumers continue functioning with zero changes.
 */
export const useApp = () => {
  const theme = useTheme();
  const language = useLanguage();
  const auth = useAuth();

  return {
    // Theme Domain
    theme: theme.theme,
    toggleTheme: theme.toggleTheme,

    // Language Domain
    lang: language.lang,
    setLang: language.setLang,
    t: language.t,

    // Auth & Modal Domain
    user: auth.user,
    token: auth.token,
    isAuthModalOpen: auth.isAuthModalOpen,
    openAuthModal: auth.openAuthModal,
    closeAuthModal: auth.closeAuthModal,
    loginUser: auth.loginUser,
    logoutUser: auth.logoutUser
  };
};

// Re-export granular hooks and providers for direct consumption
export { useTheme, ThemeProvider } from './ThemeContext';
export { useLanguage, LanguageProvider } from './LanguageContext';
export { useAuth, AuthProvider } from './AuthContext';

export default AppProvider;
