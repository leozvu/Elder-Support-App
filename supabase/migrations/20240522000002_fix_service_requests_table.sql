-- Add any missing columns for transportation requests
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS destination TEXT,
  ADD COLUMN IF NOT EXISTS return_ride_needed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS return_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS transportation_type TEXT,
  ADD COLUMN IF NOT EXISTS special_needs TEXT,
  ADD COLUMN IF NOT EXISTS additional_notes TEXT;
