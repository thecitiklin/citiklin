import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Truck, TrendingUp, DollarSign, CheckCircle, Plus, UserPlus, FileText, BarChart3, Loader2 } from 'lucide-react';
import {
  KPICard,
  ActivityFeed,
  QuickActions,
  RevenueChart,
  ProjectStatusChart,
} from '@/components/dashboard';
import { useProjects } from '@/hooks/useProjects';
import { useCustomers } from '@/hooks/useCustomers';
import { useVehicles } from '@/hooks/useVehicles';
import { useTasks } from '@/hooks/useTasks';
import { usePayments } from '@/hooks/usePayments';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const quickActions = [
  { label: 'Create New Project', description: 'Start a new cleaning project', icon: Plus, href: '/projects/new' },
  { label: 'Add Customer', description: 'Register a new customer', icon: UserPlus, href: '/customers/new' },
  { label: 'Generate Invoice', description: 'Create and send invoices', icon: FileText, href: '/invoicing' },
  { label: 'View Reports', description: 'Access analytics dashboard', icon: BarChart3, href: '/analytics' },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();

  const isLoading = projectsLoading || customersLoading || vehiclesLoading || tasksLoading || paymentsLoading;

  // Calculate real stats
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planning').length;
  const totalCustomers = customers.length;
  const fleetVehicles = vehicles.length;
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const tasksCompletedPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Total Revenue', value: `KES ${(totalRevenue / 1000).toFixed(0)}K`, change: '', icon: DollarSign, trend: 'up' as const },
    { label: 'Active Projects', value: String(activeProjects), change: '', icon: FolderKanban, trend: 'up' as const },
    { label: 'Total Customers', value: String(totalCustomers), change: '', icon: Users, trend: 'up' as const },
    { label: 'Fleet Vehicles', value: String(fleetVehicles), change: '', icon: Truck, trend: 'neutral' as const },
    { label: 'Tasks Completed', value: `${tasksCompletedPercent}%`, change: '', icon: CheckCircle, trend: 'up' as const },
    { label: 'Growth Rate', value: '-', change: '', icon: TrendingUp, trend: 'neutral' as const },
  ];

  // Calculate real revenue data by month
  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const monthDate = subMonths(new Date(), 11 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    const monthRevenue = payments
      .filter(p => {
        if (p.status !== 'completed') return false;
        const paymentDate = parseISO(p.created_at);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      name: format(monthDate, 'MMM'),
      revenue: monthRevenue,
    };
  });

  // Calculate real project status data
  const projectStatusData = [
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length },
    { name: 'In Progress', value: projects.filter(p => p.status === 'active').length },
    { name: 'Pending', value: projects.filter(p => p.status === 'planning' || p.status === 'on_hold').length },
  ];

  // Generate real activities from recent data
  const activities = [
    ...projects.slice(0, 2).map((p, i) => ({
      id: i + 1,
      action: 'Project created',
      detail: p.name,
      time: format(parseISO(p.created_at), 'MMM d'),
      type: 'success' as const,
    })),
    ...payments.filter(p => p.status === 'completed').slice(0, 2).map((p, i) => ({
      id: i + 10,
      action: 'Payment received',
      detail: `KES ${p.amount.toLocaleString()}`,
      time: format(parseISO(p.created_at), 'MMM d'),
      type: 'success' as const,
    })),
    ...customers.slice(0, 1).map((c, i) => ({
      id: i + 20,
      action: 'New customer',
      detail: c.name,
      time: format(parseISO(c.created_at), 'MMM d'),
      type: 'success' as const,
    })),
  ].slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          description="Monthly revenue for the past year"
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
          activities={activities.length > 0 ? activities : [{ id: 1, action: 'No recent activity', detail: '', time: '', type: 'default' as const }]}
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
