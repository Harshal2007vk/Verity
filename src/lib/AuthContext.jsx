import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Demo user — always authenticated in local dev mode
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@verity.ai',
  full_name: 'Demo Recruiter',
  role: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'local', public_settings: {} });

  useEffect(() => {
    // In local dev mode: auto-login as demo user immediately
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setAuthChecked(true);
  }, []);

  const checkUserAuth = async () => {
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  const checkAppState = async () => {
    // No-op in local dev mode
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    // In local dev mode, just re-authenticate as demo user
    setUser(DEMO_USER);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
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
