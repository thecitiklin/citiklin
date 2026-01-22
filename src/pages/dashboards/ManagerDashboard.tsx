import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  PerformanceChart,
  DataTable,
  StatusBadge,
  getStatusType,
  type Column,
} from '@/components/dashboard';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useSupportTickets } from '@/hooks/useSupportTickets';

interface ApprovalItem {
  id: string;
  type: string;
  from: string;
  detail: string;
  status: string;
}

const approvalColumns: Column<ApprovalItem>[] = [
  { key: 'type', header: 'Type', sortable: true },
  { key: 'from', header: 'From', sortable: true },
  { key: 'detail', header: 'Details' },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} type={getStatusType(item.status)} />,
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () => (
      <div className="flex gap-2">
        <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
          Approve
        </Button>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </div>
    ),
  },
];

export default function ManagerDashboard() {
  const { profile } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: tickets = [], isLoading: ticketsLoading } = useSupportTickets();

  const isLoading = projectsLoading || tasksLoading || ticketsLoading;

  // Calculate real stats
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planning').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedToday = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    const today = new Date().toDateString();
    return new Date(t.completed_at).toDateString() === today;
  }).length;

  const teamStats = [
    { label: 'Team Members', value: '-', icon: Users },
    { label: 'Active Projects', value: String(activeProjects), icon: FolderKanban },
    { label: 'Pending Tasks', value: String(pendingTasks), icon: Clock },
    { label: 'Completed Today', value: String(completedToday), icon: CheckCircle },
  ];

  // Calculate project progress from real data
  const projectProgress = projects
    .filter(p => p.status === 'active' || p.status === 'planning' || p.status === 'on_hold')
    .slice(0, 4)
    .map(p => {
      const projectTasks = tasks.filter(t => t.project_id === p.id);
      const completedProjectTasks = projectTasks.filter(t => t.status === 'completed').length;
      const progress = projectTasks.length > 0 ? Math.round((completedProjectTasks / projectTasks.length) * 100) : 0;
      return {
        name: p.name,
        progress,
        status: p.status === 'active' ? 'In Progress' : p.status === 'planning' ? 'Planning' : p.status,
      };
    });

  // Generate performance data from tasks
  const performanceData = [
    { name: 'Week 1', completed: tasks.filter(t => t.status === 'completed').length, target: 50 },
    { name: 'Week 2', completed: 0, target: 50 },
    { name: 'Week 3', completed: 0, target: 50 },
    { name: 'Week 4', completed: 0, target: 50 },
  ];

  // Generate approval queue from support tickets
  const approvalQueue: ApprovalItem[] = tickets
    .filter(t => t.status === 'open' || t.status === 'pending')
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      type: t.category || 'Support Ticket',
      from: 'Customer',
      detail: t.subject,
      status: t.status || 'Pending',
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
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {profile?.name}</h1>
        <p className="text-muted-foreground">{profile?.department || 'Your'} Department Overview</p>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teamStats.map((stat) => (
          <KPICard key={stat.label} title={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart
          data={performanceData}
          title="Team Performance"
          description="Weekly tasks completed vs target"
        />

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Current status of your department's projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {projectProgress.length > 0 ? (
                projectProgress.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{project.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No active projects</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Queue */}
      <DataTable
        title="Pending Approvals"
        description="Items requiring your attention"
        columns={approvalColumns}
        data={approvalQueue}
        searchable={false}
      />
    </div>
  );
}
