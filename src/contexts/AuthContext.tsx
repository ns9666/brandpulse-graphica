
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  resetPassword: async () => ({ error: null }),
});

// Django Auth API calls
const djangoAuthApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage (consider httpOnly cookies for production)
    localStorage.setItem('auth_token', data.token);
    
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    return await response.json();
  },

  resetPassword: async (email: string) => {
    const response = await fetch('http://localhost:8000/api/auth/reset-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Password reset failed');
    }

    return await response.json();
  },

  verifyToken: async (token: string) => {
    const response = await fetch('http://localhost:8000/api/auth/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    localStorage.removeItem('auth_token');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on app startup
    const token = localStorage.getItem('auth_token');
    if (token) {
      djangoAuthApi.verifyToken(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await djangoAuthApi.register('', email, password);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await djangoAuthApi.login(email, password);
      setUser(data.user);
      navigate('/dashboards');
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signOut = async () => {
    await djangoAuthApi.logout();
    setUser(null);
    navigate('/login');
  };

  const resetPassword = async (email: string) => {
    try {
      await djangoAuthApi.resetPassword(email);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset failed' };
    }
  };

  // Legacy method names for compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    return !error;
  };

  const logout = async () => {
    await signOut();
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await djangoAuthApi.register(name, email, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    signUp,
    signIn,
    signOut,
    login,
    logout,
    register,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
