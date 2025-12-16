export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  createdAt: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spent: number;
  teamMembers: string[];
  tasks: Task[];
  createdAt: string;
}
