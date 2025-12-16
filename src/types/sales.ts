export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: LeadStatus;
  value: number;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  lastContact?: string;
}

export interface Quote {
  id: string;
  leadId: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  notes?: string;
}

export interface QuoteItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  type: 'customer' | 'lead' | 'partner' | 'vendor';
  lastInteraction?: string;
  notes?: string;
  tags: string[];
}

export interface Interaction {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  description: string;
  date: string;
  outcome?: string;
}
