-- Create service_agreements table for tracking service confirmations
CREATE TABLE IF NOT EXISTS service_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id),
  customer_agreed BOOLEAN DEFAULT FALSE,
  customer_agreed_at TIMESTAMP WITH TIME ZONE,
  helper_agreed BOOLEAN DEFAULT FALSE,
  helper_agreed_at TIMESTAMP WITH TIME ZONE,
  terms_version TEXT,
  terms_accepted BOOLEAN DEFAULT FALSE,
  agreement_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_service_agreements_service_request_id ON service_agreements(service_request_id);
CREATE INDEX IF NOT EXISTS idx_service_agreements_agreement_status ON service_agreements(agreement_status);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE service_agreements;

-- Add agreement_status column to service_requests table
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS agreement_status TEXT DEFAULT 'pending';

-- Create policies for access control
DROP POLICY IF EXISTS "Users can view their own service agreements" ON service_agreements;
CREATE POLICY "Users can view their own service agreements"
  ON service_agreements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_agreements.service_request_id
      AND (sr.customer_id = auth.uid() OR sr.helper_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can insert service agreements" ON service_agreements;
CREATE POLICY "Customers can insert service agreements"
  ON service_agreements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_agreements.service_request_id
      AND sr.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own service agreements" ON service_agreements;
CREATE POLICY "Users can update their own service agreements"
  ON service_agreements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_agreements.service_request_id
      AND (sr.customer_id = auth.uid() OR sr.helper_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins have full access to service_agreements" ON service_agreements;
CREATE POLICY "Admins have full access to service_agreements"
  ON service_agreements
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS
ALTER TABLE service_agreements ENABLE ROW LEVEL SECURITY;
