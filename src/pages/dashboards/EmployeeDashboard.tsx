import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, Calendar, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const todayTasks = [
  { id: 1, title: 'Office cleaning - Building A', time: '9:00 AM', priority: 'high', status: 'in-progress' },
  { id: 2, title: 'Deep clean - Conference Room', time: '11:30 AM', priority: 'medium', status: 'pending' },
  { id: 3, title: 'Window washing - Floor 3', time: '2:00 PM', priority: 'low', status: 'pending' },
  { id: 4, title: 'Restroom sanitation', time: '4:00 PM', priority: 'high', status: 'pending' },
];

const stats = [
  { label: 'Tasks Today', value: '4', icon: CheckCircle },
  { label: 'Hours Logged', value: '6.5', icon: Clock },
  { label: 'This Week', value: '18', icon: Calendar },
  { label: 'Performance', value: '4.8', icon: Star },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hello, {user?.name}</h1>
        <p className="text-muted-foreground">Here's your schedule for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>Your assigned tasks for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
          <CardDescription>Track your work hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current session</p>
              <p className="text-3xl font-bold">02:45:30</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                Stop
              </button>
              <button className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                Break
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
