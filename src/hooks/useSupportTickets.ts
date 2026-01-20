import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SupportTicket = {
  id: string;
  customer_id: string | null;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  customers?: { name: string } | null;
  profiles?: { name: string } | null;
};

export type SupportTicketInsert = Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'customers' | 'profiles'>;
export type SupportTicketUpdate = Partial<SupportTicketInsert>;

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['support_tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          customers(name),
          profiles:assigned_to(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupportTicket[];
    },
  });
};

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ticket: SupportTicketInsert) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert(ticket)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_tickets'] });
      toast({ title: 'Success', description: 'Ticket created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateSupportTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SupportTicketUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_tickets'] });
      toast({ title: 'Success', description: 'Ticket updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteSupportTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_tickets'] });
      toast({ title: 'Success', description: 'Ticket deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
