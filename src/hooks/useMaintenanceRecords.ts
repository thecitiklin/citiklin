import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type MaintenanceRecord = {
  id: string;
  vehicle_id: string | null;
  type: string;
  description: string | null;
  cost: number;
  date: string;
  performed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MaintenanceRecordInsert = Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at'>;
export type MaintenanceRecordUpdate = Partial<MaintenanceRecordInsert>;

export const useMaintenanceRecords = (vehicleId?: string) => {
  return useQuery({
    queryKey: ['maintenance_records', vehicleId],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });
};

export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (record: MaintenanceRecordInsert) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_records'] });
      toast({ title: 'Success', description: 'Maintenance record created' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: MaintenanceRecordUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_records'] });
      toast({ title: 'Success', description: 'Maintenance record updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_records'] });
      toast({ title: 'Success', description: 'Maintenance record deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
