import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Review = {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  comment: string;
  service: string;
  helpful_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type ReviewInsert = Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count' | 'is_approved'>;
export type ReviewUpdate = Partial<ReviewInsert> & { is_approved?: boolean };

export const useReviews = (approvedOnly = true) => {
  return useQuery({
    queryKey: ['reviews', approvedOnly],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (approvedOnly) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: ReviewInsert) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: 'Success', description: 'Review submitted for approval' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ReviewUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: 'Success', description: 'Review updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: 'Success', description: 'Review deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
