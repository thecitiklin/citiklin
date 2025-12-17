-- Create table for storing API keys (values will be masked in UI, stored securely)
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  key_type TEXT NOT NULL DEFAULT 'restricted',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can view API keys
CREATE POLICY "Only admins can view API keys"
ON public.api_keys
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can manage API keys
CREATE POLICY "Only admins can manage API keys"
ON public.api_keys
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services (without keys - to be added by admin)
INSERT INTO public.api_keys (service_name, display_name, key_value, key_type, is_active)
VALUES 
  ('mpesa_consumer_key', 'M-Pesa Consumer Key', '', 'restricted', false),
  ('mpesa_consumer_secret', 'M-Pesa Consumer Secret', '', 'secret', false),
  ('stripe_secret_key', 'Stripe Secret Key', '', 'restricted', false),
  ('stripe_publishable_key', 'Stripe Publishable Key', '', 'publishable', false),
  ('paypal_client_id', 'PayPal Client ID', '', 'restricted', false),
  ('paypal_client_secret', 'PayPal Client Secret', '', 'secret', false),
  ('dpo_company_token', 'DPO Pay Company Token', '', 'restricted', false),
  ('dpo_service_type', 'DPO Pay Service Type', '', 'restricted', false),
  ('resend_api_key', 'Resend API Key', '', 'restricted', false),
  ('whatsapp_access_token', 'WhatsApp Access Token', '', 'restricted', false),
  ('whatsapp_phone_number_id', 'WhatsApp Phone Number ID', '', 'restricted', false);