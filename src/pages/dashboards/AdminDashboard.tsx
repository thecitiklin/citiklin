import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Truck, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: 'KES 2.4M', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { label: 'Active Projects', value: '24', change: '+3', icon: FolderKanban, trend: 'up' },
  { label: 'Total Customers', value: '156', change: '+8', icon: Users, trend: 'up' },
  { label: 'Fleet Vehicles', value: '12', change: '0', icon: Truck, trend: 'neutral' },
  { label: 'Tasks Completed', value: '89%', change: '+2%', icon: CheckCircle, trend: 'up' },
  { label: 'Growth Rate', value: '18%', change: '+5%', icon: TrendingUp, trend: 'up' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New project created', detail: 'Office Deep Clean - ABC Corp', time: '2 hours ago' },
                { action: 'Payment received', detail: 'KES 45,000 from XYZ Ltd', time: '4 hours ago' },
                { action: 'Task completed', detail: 'Vehicle maintenance - KCA 123A', time: '5 hours ago' },
                { action: 'New customer', detail: 'DEF Industries signed up', time: '1 day ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { label: 'Create New Project', description: 'Start a new cleaning project' },
                { label: 'Add Customer', description: 'Register a new customer' },
                { label: 'Generate Invoice', description: 'Create and send invoices' },
                { label: 'View Reports', description: 'Access analytics dashboard' },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
