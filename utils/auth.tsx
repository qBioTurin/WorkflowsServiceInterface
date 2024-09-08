"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User data fetched from server:', data.user);  // Debug

          // Aggiorna lo stato con i dati dell'utente ricevuti dall'API
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          console.error('Failed to fetch user data');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
        setIsAuthenticated(false);
      }
    };

    fetchUserData();
  }, []);

  const login = (userData: User) => {
    setUser(userData);  // Memorizza i dati dell'utente
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
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
