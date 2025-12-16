import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Clock, CheckCircle } from 'lucide-react';
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

const teamStats = [
  { label: 'Team Members', value: '8', icon: Users },
  { label: 'Active Projects', value: '6', icon: FolderKanban },
  { label: 'Pending Tasks', value: '12', icon: Clock },
  { label: 'Completed Today', value: '5', icon: CheckCircle },
];

const projects = [
  { name: 'Corporate Office Cleaning', progress: 75, status: 'On Track' },
  { name: 'Residential Deep Clean', progress: 40, status: 'In Progress' },
  { name: 'Hotel Maintenance', progress: 90, status: 'Almost Done' },
  { name: 'School Sanitization', progress: 20, status: 'Just Started' },
];

const performanceData = [
  { name: 'Week 1', completed: 45, target: 50 },
  { name: 'Week 2', completed: 52, target: 50 },
  { name: 'Week 3', completed: 48, target: 50 },
  { name: 'Week 4', completed: 61, target: 50 },
];

interface ApprovalItem {
  id: number;
  type: string;
  from: string;
  detail: string;
  status: string;
}

const approvalQueue: ApprovalItem[] = [
  { id: 1, type: 'Time Off Request', from: 'John Doe', detail: 'Dec 15-17', status: 'Pending' },
  { id: 2, type: 'Expense Report', from: 'Jane Smith', detail: 'KES 12,500', status: 'Pending' },
  { id: 3, type: 'Task Reassignment', from: 'Mike Johnson', detail: 'Project #42', status: 'Pending' },
];

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
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">{user?.department} Department Overview</p>
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
              {projects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{project.status}</span>
                </div>
              ))}
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
