-- Fix overly permissive review insert policy
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

-- Create a more restrictive policy that still allows public review submission
-- but requires valid data
CREATE POLICY "Public can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND 
    rating >= 1 AND rating <= 5 AND 
    comment IS NOT NULL AND 
    service IS NOT NULL
  );