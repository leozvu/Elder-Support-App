-- Add detailed preferences to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS dietary_requirements TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobility_restrictions TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS communication_preferences TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_helper_gender TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- Add caregiver notes to service requests
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS caregiver_notes TEXT;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS specific_needs TEXT[];

-- Add detailed skills to helper profiles
ALTER TABLE helper_profiles ADD COLUMN IF NOT EXISTS specialized_skills TEXT[];
ALTER TABLE helper_profiles ADD COLUMN IF NOT EXISTS experience_with_conditions TEXT[];
ALTER TABLE helper_profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Create service feedback table
CREATE TABLE IF NOT EXISTS service_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  helper_id UUID REFERENCES helper_profiles(id),
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  service_quality_rating INTEGER CHECK (service_quality_rating BETWEEN 1 AND 5),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for the new table
alter publication supabase_realtime add table service_feedback;
