
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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

// Auth config flag - set to 'django' for Django auth, 'supabase' for Supabase auth
const AUTH_PROVIDER = 'django'; // Change this to switch between providers

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (AUTH_PROVIDER === 'django') {
      // Django auth initialization
      const token = localStorage.getItem('auth_token');
      if (token) {
        djangoAuthApi.verifyToken(token)
          .then((userData) => {
            // Mock user object for Django auth
            const mockUser = {
              id: userData.user_id,
              email: userData.email,
              user_metadata: { name: userData.name }
            } as User;
            setUser(mockUser);
            // Mock session object
            const mockSession = {
              user: mockUser,
              access_token: token
            } as Session;
            setSession(mockSession);
          })
          .catch(() => {
            localStorage.removeItem('auth_token');
            setUser(null);
            setSession(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      // Supabase auth initialization (fallback)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (event === 'SIGNED_IN' && session?.user) {
            console.log('User signed in, redirecting to dashboards');
            navigate('/dashboards');
          }
        }
      );

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    if (AUTH_PROVIDER === 'django') {
      try {
        await djangoAuthApi.register('', email, password);
        return { error: null };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Registration failed' };
      }
    } else {
      const redirectUrl = `${window.location.origin}/dashboards`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (AUTH_PROVIDER === 'django') {
      try {
        const data = await djangoAuthApi.login(email, password);
        const mockUser = {
          id: data.user_id,
          email: data.email,
          user_metadata: { name: data.name }
        } as User;
        setUser(mockUser);
        const mockSession = {
          user: mockUser,
          access_token: data.token
        } as Session;
        setSession(mockSession);
        navigate('/dashboards');
        return { error: null };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Login failed' };
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    }
  };

  const signOut = async () => {
    if (AUTH_PROVIDER === 'django') {
      await djangoAuthApi.logout();
      setUser(null);
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  const resetPassword = async (email: string) => {
    if (AUTH_PROVIDER === 'django') {
      try {
        await djangoAuthApi.resetPassword(email);
        return { error: null };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Password reset failed' };
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
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
    if (AUTH_PROVIDER === 'django') {
      try {
        await djangoAuthApi.register(name, email, password);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      const { error } = await signUp(email, password);
      return !error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
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
