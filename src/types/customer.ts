export type CustomerStatus = 'active' | 'inactive' | 'pending';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  status: CustomerStatus;
  totalProjects: number;
  totalSpent: number;
  createdAt: string;
  lastServiceDate?: string;
  notes?: string;
}

export interface ServiceHistory {
  id: string;
  customerId: string;
  projectName: string;
  serviceType: string;
  date: string;
  amount: number;
  status: 'completed' | 'cancelled' | 'refunded';
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}
