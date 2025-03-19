-- Create location_tracking table for GPS tracking with consent
CREATE TABLE IF NOT EXISTS location_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id),
  customer_consent BOOLEAN DEFAULT FALSE,
  customer_consent_given_at TIMESTAMP WITH TIME ZONE,
  helper_consent BOOLEAN DEFAULT FALSE,
  helper_consent_given_at TIMESTAMP WITH TIME ZONE,
  tracking_enabled BOOLEAN DEFAULT FALSE,
  customer_location_lat DOUBLE PRECISION,
  customer_location_lng DOUBLE PRECISION,
  customer_location_updated_at TIMESTAMP WITH TIME ZONE,
  helper_location_lat DOUBLE PRECISION,
  helper_location_lng DOUBLE PRECISION,
  helper_location_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_location_tracking_service_request_id ON location_tracking(service_request_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE location_tracking;

-- Create policies for access control
DROP POLICY IF EXISTS "Users can view location tracking for their services" ON location_tracking;
CREATE POLICY "Users can view location tracking for their services"
  ON location_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = location_tracking.service_request_id
      AND (sr.customer_id = auth.uid() OR sr.helper_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own location" ON location_tracking;
CREATE POLICY "Users can update their own location"
  ON location_tracking FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = location_tracking.service_request_id
      AND (sr.customer_id = auth.uid() OR sr.helper_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can insert location tracking" ON location_tracking;
CREATE POLICY "Customers can insert location tracking"
  ON location_tracking FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = location_tracking.service_request_id
      AND sr.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins have full access to location_tracking" ON location_tracking;
CREATE POLICY "Admins have full access to location_tracking"
  ON location_tracking
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS
ALTER TABLE location_tracking ENABLE ROW LEVEL SECURITY;

-- Create function to update location
CREATE OR REPLACE FUNCTION update_location(service_id UUID, is_customer BOOLEAN, lat DOUBLE PRECISION, lng DOUBLE PRECISION)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tracking_record UUID;
  user_id UUID;
  is_authorized BOOLEAN;
BEGIN
  -- Get the user ID
  user_id := auth.uid();
  
  -- Check if user is authorized for this service
  SELECT EXISTS (
    SELECT 1 FROM service_requests sr
    WHERE sr.id = service_id
    AND ((is_customer AND sr.customer_id = user_id) OR (NOT is_customer AND sr.helper_id = user_id))
  ) INTO is_authorized;
  
  IF NOT is_authorized THEN
    RETURN FALSE;
  END IF;
  
  -- Get tracking record ID
  SELECT id INTO tracking_record FROM location_tracking WHERE service_request_id = service_id;
  
  -- Update the appropriate location fields
  IF is_customer THEN
    UPDATE location_tracking
    SET 
      customer_location_lat = lat,
      customer_location_lng = lng,
      customer_location_updated_at = NOW(),
      updated_at = NOW()
    WHERE id = tracking_record;
  ELSE
    UPDATE location_tracking
    SET 
      helper_location_lat = lat,
      helper_location_lng = lng,
      helper_location_updated_at = NOW(),
      updated_at = NOW()
    WHERE id = tracking_record;
  END IF;
  
  RETURN TRUE;
END;
$$;
