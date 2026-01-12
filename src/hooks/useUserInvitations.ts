import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export type InvitedRole = 'admin' | 'manager' | 'employee' | 'customer';

export interface UserInvitation {
  id: string;
  email: string;
  role: InvitedRole;
  invited_by: string | null;
  token: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}

export function useUserInvitations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['user-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserInvitation[];
    },
  });

  const createInvitation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: InvitedRole }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          email: email.toLowerCase(),
          role,
          invited_by: user?.id,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('An invitation already exists for this email');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      toast({
        title: 'Invitation Created',
        description: 'The user can now register with their invited email.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  const deleteInvitation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      toast({
        title: 'Invitation Deleted',
        description: 'The invitation has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  return {
    invitations: invitations ?? [],
    isLoading,
    error,
    createInvitation,
    deleteInvitation,
  };
}
