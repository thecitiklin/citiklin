import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  StatusBadge,
  PriorityIndicator,
  WeeklyActivityChart,
} from '@/components/dashboard';

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

const weeklyData = [
  { day: 'Mon', tasks: 5, hours: 8 },
  { day: 'Tue', tasks: 4, hours: 7 },
  { day: 'Wed', tasks: 6, hours: 9 },
  { day: 'Thu', tasks: 3, hours: 6 },
  { day: 'Fri', tasks: 4, hours: 7 },
  { day: 'Sat', tasks: 2, hours: 4 },
  { day: 'Sun', tasks: 0, hours: 0 },
];

export default function EmployeeDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hello, {profile?.name}</h1>
        <p className="text-muted-foreground">Here's your schedule for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <KPICard key={stat.label} title={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Today's Tasks & Weekly Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                    <PriorityIndicator priority={task.priority as 'high' | 'medium' | 'low'} showIcon={false} />
                    <StatusBadge
                      status={task.status.replace('-', ' ')}
                      type={task.status === 'in-progress' ? 'info' : 'default'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <WeeklyActivityChart
          data={weeklyData}
          title="Weekly Activity"
          description="Your tasks and hours this week"
        />
      </div>

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
              <Button variant="destructive">Stop</Button>
              <Button variant="outline">Break</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
