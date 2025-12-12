import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState, UserRole, ROLE_DASHBOARD_ROUTES } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@citiklin.com': {
    password: 'admin123',
    user: { id: '1', email: 'admin@citiklin.com', name: 'Admin User', role: 'admin' },
  },
  'manager@citiklin.com': {
    password: 'manager123',
    user: { id: '2', email: 'manager@citiklin.com', name: 'Manager User', role: 'manager', department: 'Operations' },
  },
  'employee@citiklin.com': {
    password: 'employee123',
    user: { id: '3', email: 'employee@citiklin.com', name: 'Employee User', role: 'employee', department: 'Field Services' },
  },
  'customer@citiklin.com': {
    password: 'customer123',
    user: { id: '4', email: 'customer@citiklin.com', name: 'Customer User', role: 'customer' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: 'No account found with this email address' };
    }

    if (mockUser.password !== password) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Invalid password' };
    }

    setState({
      user: mockUser.user,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    setState((prev) => ({ ...prev, isLoading: false }));

    if (!mockUser) {
      return { success: false, error: 'No account found with this email address' };
    }

    return { success: true };
  }, []);

  const getDashboardRoute = useCallback(() => {
    if (!state.user) return '/login';
    return ROLE_DASHBOARD_ROUTES[state.user.role];
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, resetPassword, getDashboardRoute }}>
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
