import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Vehicle = {
  id: string;
  name: string;
  license_plate: string;
  vehicle_type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  fuel_type: string | null;
  mileage: number | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  assigned_driver: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { name: string } | null;
};

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'profiles'>;
export type VehicleUpdate = Partial<VehicleInsert>;

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Vehicle[];
    },
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles(name)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Vehicle | null;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vehicle: VehicleInsert) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: 'Success', description: 'Vehicle added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: VehicleUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: 'Success', description: 'Vehicle updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: 'Success', description: 'Vehicle deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
