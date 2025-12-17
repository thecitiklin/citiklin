export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/auth',
  RESET_PASSWORD: '/reset-password',
  CONTACT: '/contact',
  BOOK_SERVICE: '/book-service',
  REVIEWS: '/reviews',
  HELP: '/help',

  // Dashboard routes
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    MANAGER: '/dashboard/manager',
    EMPLOYEE: '/dashboard/employee',
    CUSTOMER: '/dashboard/customer',
  },

  // Project routes
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',
  PROJECT_TASKS: '/projects/:id/tasks',

  // Customer routes
  CUSTOMERS: '/customers',
  CUSTOMER_PROFILE: '/customers/:id',
  SUPPORT: '/support',

  // Fleet routes
  FLEET: '/fleet',
  VEHICLE_DETAILS: '/fleet/:id',

  // Inventory & Procurement
  INVENTORY: '/inventory',
  PROCUREMENT: '/procurement',

  // Financial
  PAYMENTS: '/payments',
  INVOICING: '/invoicing',

  // Sales & CRM
  SALES: '/sales',
  CRM: '/crm',

  // Analytics
  ANALYTICS: '/analytics',

  // Admin routes
  ADMIN: {
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    CMS: '/admin/cms',
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.RESET_PASSWORD,
  ROUTES.CONTACT,
  ROUTES.BOOK_SERVICE,
  ROUTES.REVIEWS,
  ROUTES.HELP,
];

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path as typeof PUBLIC_ROUTES[number]);
}
