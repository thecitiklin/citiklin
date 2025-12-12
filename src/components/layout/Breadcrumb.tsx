import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const PATH_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
  customer: 'Customer',
  projects: 'Projects',
  customers: 'Customers',
  fleet: 'Fleet',
  inventory: 'Inventory',
  procurement: 'Procurement',
  sales: 'Sales',
  crm: 'CRM',
  payments: 'Payments',
  invoicing: 'Invoicing',
  analytics: 'Analytics',
  support: 'Support',
  users: 'Users',
  departments: 'Departments',
  cms: 'CMS',
  tasks: 'Tasks',
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = PATH_LABELS[path] || path.charAt(0).toUpperCase() + path.slice(1);
      return { label, href: index < paths.length - 1 ? href : undefined };
    });
  })();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href ? (
            <Link
              to={item.href}
              className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="ml-1 font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
