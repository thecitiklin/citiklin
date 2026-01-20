-- Update payments table with additional fields for comprehensive payment tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'income',
ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'credit',
ADD COLUMN IF NOT EXISTS recorded_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS payment_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS payment_time TIME DEFAULT CURRENT_TIME,
ADD COLUMN IF NOT EXISTS due_status TEXT DEFAULT 'paid',
ADD COLUMN IF NOT EXISTS reference_number TEXT,
ADD COLUMN IF NOT EXISTS cheque_number TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account TEXT,
ADD COLUMN IF NOT EXISTS card_last_four TEXT,
ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

-- Create reviews table for public reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true);

-- Anyone can create reviews
CREATE POLICY "Anyone can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  category TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Staff can view tickets
CREATE POLICY "Staff can view tickets" ON public.support_tickets
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'employee'::app_role)
  );

-- Staff can create tickets
CREATE POLICY "Staff can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'employee'::app_role)
  );

-- Staff can update tickets
CREATE POLICY "Staff can update tickets" ON public.support_tickets
  FOR UPDATE USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'employee'::app_role)
  );

-- Admin can delete tickets
CREATE POLICY "Admin can delete tickets" ON public.support_tickets
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  cost NUMERIC DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  performed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on maintenance_records
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- Staff can view maintenance records
CREATE POLICY "Staff can view maintenance records" ON public.maintenance_records
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'employee'::app_role)
  );

-- Admin and manager can manage maintenance records
CREATE POLICY "Admin and manager can manage maintenance records" ON public.maintenance_records
  FOR ALL USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role)
  );