"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Usa `next/navigation` per gestire il redirect

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Stato per tracciare l'autenticazione
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/refresh', { method: 'POST' });  // Usa la tua route di refresh per controllare lo stato
        const data = await response.json();

        if (response.ok) {
          // Se il token è stato aggiornato correttamente
          setIsAuthenticated(true);
          setUser({ first_name: 'John' }); // Puoi aggiornare lo stato dell'utente come preferisci
        } else {
          console.log('Token non valido o scaduto. Provando a rinnovare...');
        }
      } catch (error) {
        console.error('Errore nel controllo dello stato di autenticazione:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
