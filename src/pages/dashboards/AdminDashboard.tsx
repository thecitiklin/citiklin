import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Truck, TrendingUp, DollarSign, CheckCircle, Plus, UserPlus, FileText, BarChart3 } from 'lucide-react';
import {
  KPICard,
  ActivityFeed,
  QuickActions,
  RevenueChart,
  ProjectStatusChart,
} from '@/components/dashboard';

const stats = [
  { label: 'Total Revenue', value: 'KES 2.4M', change: '+12.5%', icon: DollarSign, trend: 'up' as const },
  { label: 'Active Projects', value: '24', change: '+3', icon: FolderKanban, trend: 'up' as const },
  { label: 'Total Customers', value: '156', change: '+8', icon: Users, trend: 'up' as const },
  { label: 'Fleet Vehicles', value: '12', change: '0', icon: Truck, trend: 'neutral' as const },
  { label: 'Tasks Completed', value: '89%', change: '+2%', icon: CheckCircle, trend: 'up' as const },
  { label: 'Growth Rate', value: '18%', change: '+5%', icon: TrendingUp, trend: 'up' as const },
];

const revenueData = [
  { name: 'Jan', revenue: 180000 },
  { name: 'Feb', revenue: 220000 },
  { name: 'Mar', revenue: 195000 },
  { name: 'Apr', revenue: 280000 },
  { name: 'May', revenue: 310000 },
  { name: 'Jun', revenue: 350000 },
  { name: 'Jul', revenue: 420000 },
  { name: 'Aug', revenue: 380000 },
  { name: 'Sep', revenue: 450000 },
  { name: 'Oct', revenue: 520000 },
  { name: 'Nov', revenue: 580000 },
  { name: 'Dec', revenue: 620000 },
];

const projectStatusData = [
  { name: 'Completed', value: 12 },
  { name: 'In Progress', value: 8 },
  { name: 'Pending', value: 4 },
];

const activities = [
  { id: 1, action: 'New project created', detail: 'Office Deep Clean - ABC Corp', time: '2 hours ago', type: 'success' as const },
  { id: 2, action: 'Payment received', detail: 'KES 45,000 from XYZ Ltd', time: '4 hours ago', type: 'success' as const },
  { id: 3, action: 'Task completed', detail: 'Vehicle maintenance - KCA 123A', time: '5 hours ago', type: 'default' as const },
  { id: 4, action: 'New customer', detail: 'DEF Industries signed up', time: '1 day ago', type: 'success' as const },
  { id: 5, action: 'Low inventory alert', detail: 'Cleaning supplies below threshold', time: '1 day ago', type: 'warning' as const },
];

const quickActions = [
  { label: 'Create New Project', description: 'Start a new cleaning project', icon: Plus, href: '/projects/new' },
  { label: 'Add Customer', description: 'Register a new customer', icon: UserPlus, href: '/customers/new' },
  { label: 'Generate Invoice', description: 'Create and send invoices', icon: FileText, href: '/invoicing' },
  { label: 'View Reports', description: 'Access analytics dashboard', icon: BarChart3, href: '/analytics' },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {profile?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <KPICard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart
          data={revenueData}
          title="Revenue Overview"
          description="Monthly revenue for the current year"
          className="lg:col-span-2"
        />
        <ProjectStatusChart
          data={projectStatusData}
          title="Project Status"
          description="Current project distribution"
        />
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed
          title="Recent Activity"
          description="Latest updates across your organization"
          activities={activities}
        />
        <QuickActions
          title="Quick Actions"
          description="Common tasks and shortcuts"
          actions={quickActions}
        />
      </div>
    </div>
  );
}
