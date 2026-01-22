import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'pending', title: 'To Do', color: 'border-muted-foreground' },
  { id: 'in_progress', title: 'In Progress', color: 'border-primary' },
  { id: 'completed', title: 'Completed', color: 'border-accent' },
  { id: 'cancelled', title: 'Cancelled', color: 'border-destructive' },
];

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-secondary text-secondary-foreground',
  high: 'bg-warning text-warning-foreground',
  urgent: 'bg-destructive text-destructive-foreground',
};

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    due_date: string | null;
    profiles?: { name: string } | null;
  };
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-move hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{task.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {task.description || 'No description'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${priorityColors[task.priority] || priorityColors.medium}`}>
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[80px]">
              {task.profiles?.name || 'Unassigned'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{task.due_date || 'No date'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TaskManagement() {
  const { id } = useParams();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.project_id === id);

  const isLoading = projectsLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Button asChild className="mt-4">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return projectTasks.filter((task) => task.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/projects/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Board</h1>
            <p className="text-muted-foreground">{project.name}</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className={`border-t-4 ${column.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {getTasksByStatus(column.id).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {getTasksByStatus(column.id).length === 0 && (
                <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-lg">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {columns.map((column) => (
              <div key={column.id}>
                <p className="text-2xl font-bold">{getTasksByStatus(column.id).length}</p>
                <p className="text-sm text-muted-foreground">{column.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
