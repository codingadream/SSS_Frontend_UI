import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface AuthContextType {
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null });

export function useAuth() {
  return useContext(AuthContext);
}



export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  
  const value: AuthContextType = {
    currentUser,
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

