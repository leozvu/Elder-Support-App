-- Create helper_availability table for real-time availability management
CREATE TABLE IF NOT EXISTS helper_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  helper_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  service_id UUID REFERENCES service_requests(id),
  recurring TEXT,
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  buffer_before INTEGER DEFAULT 0,
  buffer_after INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_helper_availability_helper_id ON helper_availability(helper_id);
CREATE INDEX IF NOT EXISTS idx_helper_availability_date ON helper_availability(date);
CREATE INDEX IF NOT EXISTS idx_helper_availability_status ON helper_availability(status);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE helper_availability;

-- Create policies for access control
DROP POLICY IF EXISTS "Helpers can view their own availability" ON helper_availability;
CREATE POLICY "Helpers can view their own availability"
  ON helper_availability FOR SELECT
  USING (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Helpers can insert their own availability" ON helper_availability;
CREATE POLICY "Helpers can insert their own availability"
  ON helper_availability FOR INSERT
  WITH CHECK (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Helpers can update their own availability" ON helper_availability;
CREATE POLICY "Helpers can update their own availability"
  ON helper_availability FOR UPDATE
  USING (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Helpers can delete their own availability" ON helper_availability;
CREATE POLICY "Helpers can delete their own availability"
  ON helper_availability FOR DELETE
  USING (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Admins have full access to helper_availability" ON helper_availability;
CREATE POLICY "Admins have full access to helper_availability"
  ON helper_availability
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS
ALTER TABLE helper_availability ENABLE ROW LEVEL SECURITY;
