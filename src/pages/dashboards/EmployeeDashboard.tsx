import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, Calendar, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  StatusBadge,
  PriorityIndicator,
  WeeklyActivityChart,
} from '@/components/dashboard';
import { useTasks } from '@/hooks/useTasks';
import { format, parseISO, isToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export default function EmployeeDashboard() {
  const { profile, user } = useAuth();
  const { data: allTasks = [], isLoading } = useTasks();

  // Filter tasks assigned to current user
  const myTasks = allTasks.filter(t => t.assigned_to === user?.id);
  
  // Today's tasks
  const todayTasks = myTasks.filter(t => {
    if (!t.due_date) return false;
    return isToday(parseISO(t.due_date));
  });

  // Calculate stats
  const tasksToday = todayTasks.length;
  const completedThisWeek = myTasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const completedDate = parseISO(t.completed_at);
    return completedDate >= weekStart && completedDate <= weekEnd;
  }).length;

  const stats = [
    { label: 'Tasks Today', value: String(tasksToday), icon: CheckCircle },
    { label: 'Hours Logged', value: '-', icon: Clock },
    { label: 'This Week', value: String(completedThisWeek), icon: Calendar },
    { label: 'Performance', value: '-', icon: Star },
  ];

  // Generate weekly data from real tasks
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = daysOfWeek.map(day => {
    const dayTasks = myTasks.filter(t => {
      if (!t.completed_at) return false;
      return isSameDay(parseISO(t.completed_at), day);
    }).length;

    return {
      day: format(day, 'EEE'),
      tasks: dayTasks,
      hours: dayTasks * 2, // Estimate hours based on tasks
    };
  });

  // Format tasks for display
  const displayTasks = todayTasks.length > 0 
    ? todayTasks.slice(0, 4).map(t => ({
        id: t.id,
        title: t.title,
        time: t.due_date ? format(parseISO(t.due_date), 'h:mm a') : 'No time set',
        priority: t.priority as 'high' | 'medium' | 'low',
        status: t.status,
      }))
    : myTasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => ({
        id: t.id,
        title: t.title,
        time: t.due_date ? format(parseISO(t.due_date), 'MMM d') : 'No date',
        priority: t.priority as 'high' | 'medium' | 'low',
        status: t.status,
      }));

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
              {displayTasks.length > 0 ? (
                displayTasks.map((task) => (
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
                      <PriorityIndicator priority={task.priority} showIcon={false} />
                      <StatusBadge
                        status={task.status.replace('_', ' ')}
                        type={task.status === 'in_progress' ? 'info' : task.status === 'completed' ? 'success' : 'default'}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks assigned</p>
              )}
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
              <p className="text-3xl font-bold">00:00:00</p>
            </div>
            <div className="flex gap-2">
              <Button>Start</Button>
              <Button variant="outline">Break</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
