-- Create transportation_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id),
  helper_id UUID REFERENCES helper_profiles(id),
  service_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  location TEXT,
  destination TEXT,
  scheduled_time TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  return_ride_needed BOOLEAN DEFAULT FALSE,
  return_time TIMESTAMPTZ,
  special_needs TEXT,
  transportation_type TEXT,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own requests" ON service_requests;
CREATE POLICY "Users can view their own requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Helpers can view assigned requests" ON service_requests;
CREATE POLICY "Helpers can view assigned requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Users can create their own requests" ON service_requests;
CREATE POLICY "Users can create their own requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update their own requests" ON service_requests;
CREATE POLICY "Users can update their own requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Helpers can update assigned requests" ON service_requests;
CREATE POLICY "Helpers can update assigned requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = helper_id AND status IN ('assigned', 'in_progress'));

-- Add to realtime publication
alter publication supabase_realtime add table service_requests;
