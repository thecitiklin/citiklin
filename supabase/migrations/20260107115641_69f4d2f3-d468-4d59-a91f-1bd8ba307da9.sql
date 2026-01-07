-- Phase 9: Security Improvements - Tighten RLS Policies

-- Drop existing overly permissive policies and create role-based access

-- ========================================
-- PROFILES TABLE - Restrict to own profile + admin/manager access
-- ========================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins and managers can view all profiles" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Admins and managers can view all profiles
CREATE POLICY "Admins and managers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- ========================================
-- CUSTOMERS TABLE - Restrict to admin/manager/employee only
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can create customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;

-- Only staff (admin, manager, employee) can view customers
CREATE POLICY "Staff can view customers" 
ON public.customers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'employee')
  )
);

-- Only admin and manager can create customers
CREATE POLICY "Admin and manager can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update customers
CREATE POLICY "Admin and manager can update customers" 
ON public.customers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete customers
CREATE POLICY "Admin can delete customers" 
ON public.customers 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- INVOICES TABLE - Restrict to admin/manager only
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can update invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can delete invoices" ON public.invoices;

-- Only admin and manager can view invoices
CREATE POLICY "Admin and manager can view invoices" 
ON public.invoices 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can create invoices
CREATE POLICY "Admin and manager can create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update invoices
CREATE POLICY "Admin and manager can update invoices" 
ON public.invoices 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete invoices
CREATE POLICY "Admin can delete invoices" 
ON public.invoices 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- PAYMENTS TABLE - Restrict to admin/manager only
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can create payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON public.payments;

-- Only admin and manager can view payments
CREATE POLICY "Admin and manager can view payments" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can create payments
CREATE POLICY "Admin and manager can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update payments
CREATE POLICY "Admin and manager can update payments" 
ON public.payments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete payments
CREATE POLICY "Admin can delete payments" 
ON public.payments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- PROJECTS TABLE - Restrict financial data to admin/manager
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- Staff can view projects (employees need this for their work)
CREATE POLICY "Staff can view projects" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'employee')
  )
);

-- Only admin and manager can create projects
CREATE POLICY "Admin and manager can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update projects
CREATE POLICY "Admin and manager can update projects" 
ON public.projects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete projects
CREATE POLICY "Admin can delete projects" 
ON public.projects 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- TASKS TABLE - Allow staff access with project-based viewing
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;

-- Staff can view tasks
CREATE POLICY "Staff can view tasks" 
ON public.tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'employee')
  )
);

-- Admin and manager can create tasks
CREATE POLICY "Admin and manager can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Staff can update tasks (employees need to update task status)
CREATE POLICY "Staff can update tasks" 
ON public.tasks 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'employee')
  )
);

-- Only admin can delete tasks
CREATE POLICY "Admin can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- VEHICLES TABLE - Restrict to admin/manager + assigned driver
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can create vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can delete vehicles" ON public.vehicles;

-- Admin, manager, and assigned driver can view vehicles
CREATE POLICY "Staff and assigned drivers can view vehicles" 
ON public.vehicles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
  OR assigned_driver = auth.uid()
);

-- Only admin and manager can create vehicles
CREATE POLICY "Admin and manager can create vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update vehicles
CREATE POLICY "Admin and manager can update vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete vehicles
CREATE POLICY "Admin can delete vehicles" 
ON public.vehicles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- INVENTORY TABLE - Restrict to admin/manager
-- ========================================
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Authenticated users can create inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Authenticated users can update inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Authenticated users can delete inventory" ON public.inventory_items;

-- Only admin and manager can view inventory
CREATE POLICY "Admin and manager can view inventory" 
ON public.inventory_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can create inventory
CREATE POLICY "Admin and manager can create inventory" 
ON public.inventory_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin and manager can update inventory
CREATE POLICY "Admin and manager can update inventory" 
ON public.inventory_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Only admin can delete inventory
CREATE POLICY "Admin can delete inventory" 
ON public.inventory_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- ========================================
-- DEPARTMENTS TABLE - Allow all authenticated to view, restrict modifications
-- ========================================
DROP POLICY IF EXISTS "Anyone authenticated can view departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;

-- All authenticated users can view departments (intentional for org structure)
CREATE POLICY "Authenticated users can view departments" 
ON public.departments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only admin can create departments
CREATE POLICY "Admin can create departments" 
ON public.departments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admin can update departments
CREATE POLICY "Admin can update departments" 
ON public.departments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admin can delete departments
CREATE POLICY "Admin can delete departments" 
ON public.departments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);