CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contact_requests_insert_public ON public.contact_requests;
CREATE POLICY contact_requests_insert_public
ON public.contact_requests
FOR INSERT
WITH CHECK (TRUE);

DROP POLICY IF EXISTS contact_requests_admin_read ON public.contact_requests;
CREATE POLICY contact_requests_admin_read
ON public.contact_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'tenant_admin')
  )
);

DROP TRIGGER IF EXISTS trg_contact_requests_updated_at ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
