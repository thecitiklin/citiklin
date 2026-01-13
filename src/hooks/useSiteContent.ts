import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SiteContent = {
  id: string;
  page_key: string;
  section_key: string;
  content: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteContentInsert = Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>;
export type SiteContentUpdate = Partial<SiteContentInsert>;

export const useSiteContents = () => {
  return useQuery({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('page_key', { ascending: true });
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

export const useSiteContent = (pageKey: string, sectionKey: string) => {
  return useQuery({
    queryKey: ['site_content', pageKey, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('section_key', sectionKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteContent | null;
    },
    enabled: !!pageKey && !!sectionKey,
  });
};

export const useCreateSiteContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (content: SiteContentInsert) => {
      const { data, error } = await supabase
        .from('site_content')
        .insert(content)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
      toast({ title: 'Success', description: 'Content created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SiteContentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
      toast({ title: 'Success', description: 'Content updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteSiteContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
      toast({ title: 'Success', description: 'Content deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
