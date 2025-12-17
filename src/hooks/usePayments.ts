import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Payment = {
  id: string;
  invoice_id: string | null;
  customer_id: string | null;
  amount: number;
  payment_method: 'mpesa' | 'card' | 'paypal' | 'cash' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  invoices?: { invoice_number: string } | null;
  customers?: { name: string } | null;
};

export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'invoices' | 'customers'>;
export type PaymentUpdate = Partial<PaymentInsert>;

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoices(invoice_number),
          customers(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    },
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoices(invoice_number),
          customers(name)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Payment | null;
    },
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payment: PaymentInsert) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({ title: 'Success', description: 'Payment recorded successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PaymentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({ title: 'Success', description: 'Payment updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({ title: 'Success', description: 'Payment deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
