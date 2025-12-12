import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderKanban, Clock, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Current status of your department's projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Items requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Time Off Request', from: 'John Doe', date: 'Dec 15-17' },
              { type: 'Expense Report', from: 'Jane Smith', date: 'KES 12,500' },
              { type: 'Task Reassignment', from: 'Mike Johnson', date: 'Project #42' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{item.type}</p>
                  <p className="text-xs text-muted-foreground">From: {item.from}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded bg-success px-3 py-1 text-xs text-success-foreground hover:bg-success/90">
                    Approve
                  </button>
                  <button className="rounded bg-muted px-3 py-1 text-xs hover:bg-muted/80">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
