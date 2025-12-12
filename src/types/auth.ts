export type UserRole = 'admin' | 'manager' | 'employee' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  manager: ['projects', 'customers', 'fleet', 'inventory', 'sales', 'analytics', 'support'],
  employee: ['projects', 'tasks', 'fleet'],
  customer: ['dashboard', 'bookings', 'payments', 'support', 'reviews'],
};

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  employee: '/dashboard/employee',
  customer: '/dashboard/customer',
};
