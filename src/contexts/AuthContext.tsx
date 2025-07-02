import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  creditScore: number;
  lastUpdated: string;
  biometricEnabled: boolean;
  mfaEnabled: boolean;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for admin credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        email,
        name: 'System Administrator',
        creditScore: 850, // Perfect admin score
        lastUpdated: new Date().toISOString(),
        biometricEnabled: true,
        mfaEnabled: true,
        role: 'admin'
      };

      setUser(adminUser);
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(adminUser));
      }
      setLoading(false);
      return;
    }
    
    // Regular user login
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      creditScore: 742,
      lastUpdated: new Date().toISOString(),
      biometricEnabled: true,
      mfaEnabled: false,
      role: 'user'
    };

    setUser(mockUser);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
    setLoading(false);
  };

  const loginWithBiometric = async () => {
    setLoading(true);
    // Simulate biometric authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      creditScore: 742,
      lastUpdated: new Date().toISOString(),
      biometricEnabled: true,
      mfaEnabled: false,
      role: 'user'
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
      creditScore: 650, // New users start with average score
      lastUpdated: new Date().toISOString(),
      biometricEnabled: false,
      mfaEnabled: false,
      role: 'user'
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    loginWithBiometric,
    signup,
    logout,
    updateProfile,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}