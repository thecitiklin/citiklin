-- Create user_invitations table for admin invitation system
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'employee',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can view all invitations
CREATE POLICY "Admins can view invitations"
ON public.user_invitations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create invitations
CREATE POLICY "Admins can create invitations"
ON public.user_invitations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update invitations
CREATE POLICY "Admins can update invitations"
ON public.user_invitations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete invitations
CREATE POLICY "Admins can delete invitations"
ON public.user_invitations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can read their own invitation by email (for signup verification)
CREATE POLICY "Anyone can check their invitation"
ON public.user_invitations
FOR SELECT
TO anon, authenticated
USING (true);

-- Update handle_new_user to check invitations as well
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_admin boolean;
  invited_role app_role;
BEGIN
  -- Check if email is a pre-authorized admin
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails 
    WHERE email = NEW.email AND used = false
  ) INTO is_admin;
  
  -- Check for invitation
  SELECT role INTO invited_role
  FROM public.user_invitations 
  WHERE email = NEW.email 
    AND used = false 
    AND expires_at > now();
  
  -- Create profile
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  IF is_admin THEN
    -- Pre-authorized admin
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    UPDATE public.admin_emails SET used = true WHERE email = NEW.email;
  ELSIF invited_role IS NOT NULL THEN
    -- Invited user
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, invited_role);
    UPDATE public.user_invitations SET used = true WHERE email = NEW.email;
  ELSE
    -- Default to customer
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  END IF;
  
  RETURN NEW;
END;
$function$;