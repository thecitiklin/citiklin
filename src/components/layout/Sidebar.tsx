import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Truck,
  Package,
  ShoppingCart,
  CreditCard,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  Building2,
  FileEdit,
  Headphones,
  Key,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'manager', 'employee', 'customer'] },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Projects', icon: FolderKanban, href: ROUTES.PROJECTS, roles: ['admin', 'manager', 'employee'] },
      { label: 'Customers', icon: Users, href: ROUTES.CUSTOMERS, roles: ['admin', 'manager'] },
      { label: 'Support', icon: Headphones, href: ROUTES.SUPPORT, roles: ['admin', 'manager'] },
      { label: 'Fleet', icon: Truck, href: ROUTES.FLEET, roles: ['admin', 'manager', 'employee'] },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { label: 'Stock', icon: Package, href: ROUTES.INVENTORY, roles: ['admin', 'manager'] },
      { label: 'Procurement', icon: ShoppingCart, href: ROUTES.PROCUREMENT, roles: ['admin', 'manager'] },
    ],
  },
  {
    title: 'Sales & Finance',
    items: [
      { label: 'Sales Pipeline', icon: TrendingUp, href: ROUTES.SALES, roles: ['admin', 'manager'] },
      { label: 'CRM', icon: Users, href: ROUTES.CRM, roles: ['admin', 'manager'] },
      { label: 'Payments', icon: CreditCard, href: ROUTES.PAYMENTS, roles: ['admin', 'manager', 'customer'] },
      { label: 'Invoicing', icon: FileText, href: ROUTES.INVOICING, roles: ['admin', 'manager'] },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', icon: BarChart3, href: ROUTES.ANALYTICS, roles: ['admin', 'manager'] },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', icon: Settings, href: ROUTES.ADMIN.USERS, roles: ['admin'] },
      { label: 'Departments', icon: Building2, href: ROUTES.ADMIN.DEPARTMENTS, roles: ['admin'] },
      { label: 'API Keys', icon: Key, href: ROUTES.ADMIN.API_KEYS, roles: ['admin'] },
      { label: 'CMS', icon: FileEdit, href: ROUTES.ADMIN.CMS, roles: ['admin'] },
    ],
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { role } = useAuth();
  const userRole = role || 'customer';

  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.includes(userRole)),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-200 ease-in-out md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-end p-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-6">
              {filteredSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-sidebar-accent text-sidebar-primary'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
