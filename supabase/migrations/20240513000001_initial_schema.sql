-- Create auth schema extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('customer', 'helper', 'admin');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service types table
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  helper_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_type_id UUID NOT NULL REFERENCES service_types(id),
  status TEXT NOT NULL DEFAULT 'pending',
  details TEXT,
  address TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community hubs table
CREATE TABLE IF NOT EXISTS community_hubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  hours TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hub services table
CREATE TABLE IF NOT EXISTS hub_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id UUID NOT NULL REFERENCES community_hubs(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create helper profiles table
CREATE TABLE IF NOT EXISTS helper_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  services_offered TEXT[],
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service reviews table
CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  helper_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community events table
CREATE TABLE IF NOT EXISTS community_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Helpers can view customer profiles" ON users;
CREATE POLICY "Helpers can view customer profiles"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'helper' AND role = 'customer');

-- Emergency contacts policies
DROP POLICY IF EXISTS "Users can view their own emergency contacts" ON emergency_contacts;
CREATE POLICY "Users can view their own emergency contacts"
  ON emergency_contacts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own emergency contacts" ON emergency_contacts;
CREATE POLICY "Users can manage their own emergency contacts"
  ON emergency_contacts FOR ALL
  USING (auth.uid() = user_id);

-- Service requests policies
DROP POLICY IF EXISTS "Customers can view their own service requests" ON service_requests;
CREATE POLICY "Customers can view their own service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Helpers can view assigned service requests" ON service_requests;
CREATE POLICY "Helpers can view assigned service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = helper_id);

DROP POLICY IF EXISTS "Helpers can view available service requests" ON service_requests;
CREATE POLICY "Helpers can view available service requests"
  ON service_requests FOR SELECT
  USING (auth.jwt() ->> 'role' = 'helper' AND helper_id IS NULL);

DROP POLICY IF EXISTS "Admins can view all service requests" ON service_requests;
CREATE POLICY "Admins can view all service requests"
  ON service_requests FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add realtime support
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table emergency_contacts;
alter publication supabase_realtime add table service_types;
alter publication supabase_realtime add table service_requests;
alter publication supabase_realtime add table community_hubs;
alter publication supabase_realtime add table hub_services;
alter publication supabase_realtime add table helper_profiles;
alter publication supabase_realtime add table service_reviews;
alter publication supabase_realtime add table community_events;
alter publication supabase_realtime add table event_attendees;

-- Insert initial service types
INSERT INTO service_types (name, description, icon) VALUES
('Shopping Assistance', 'Help with grocery shopping and errands', 'shopping-cart'),
('Medical Appointment', 'Transportation and assistance with medical appointments', 'stethoscope'),
('Home Maintenance', 'Help with minor home repairs and maintenance', 'tool'),
('Meal Preparation', 'Assistance with preparing meals', 'utensils'),
('Companionship', 'Social visits and companionship', 'users'),
('Technology Help', 'Assistance with computers, phones, and other devices', 'laptop'),
('Transportation', 'Rides to various locations', 'car'),
('Medication Reminder', 'Reminders to take medications on schedule', 'pill');

-- Insert sample community hubs
INSERT INTO community_hubs (name, address, phone, latitude, longitude, hours, description, image_url) VALUES
('Sunshine Community Hub', '123 Elder Street, Careville', '(555) 123-4567', 40.7128, -74.006, '9:00 AM - 5:00 PM', 'A welcoming community center offering various assistance services for seniors.', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80'),
('Golden Years Center', '456 Senior Avenue, Careville', '(555) 987-6543', 40.7135, -74.0046, '8:00 AM - 6:00 PM', 'Specialized in home services and transportation for elderly residents.', 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=600&q=80'),
('Silver Helpers Station', '789 Assistance Road, Careville', '(555) 456-7890', 40.712, -74.008, '10:00 AM - 4:00 PM', 'Focused on technology assistance and regular wellness checks for seniors.', 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80');

-- Insert hub services
INSERT INTO hub_services (hub_id, service_name) VALUES
((SELECT id FROM community_hubs WHERE name = 'Sunshine Community Hub'), 'Shopping Assistance'),
((SELECT id FROM community_hubs WHERE name = 'Sunshine Community Hub'), 'Medical Appointments'),
((SELECT id FROM community_hubs WHERE name = 'Sunshine Community Hub'), 'Companionship'),
((SELECT id FROM community_hubs WHERE name = 'Golden Years Center'), 'Home Maintenance'),
((SELECT id FROM community_hubs WHERE name = 'Golden Years Center'), 'Transportation'),
((SELECT id FROM community_hubs WHERE name = 'Golden Years Center'), 'Meal Delivery'),
((SELECT id FROM community_hubs WHERE name = 'Silver Helpers Station'), 'Technology Help'),
((SELECT id FROM community_hubs WHERE name = 'Silver Helpers Station'), 'Grocery Delivery'),
((SELECT id FROM community_hubs WHERE name = 'Silver Helpers Station'), 'Wellness Checks');

-- Insert sample community events
INSERT INTO community_events (title, description, date, time, location, organizer, category, image_url) VALUES
('Senior Wellness Workshop', 'Join us for a workshop on maintaining physical and mental wellness in your golden years.', '2023-06-15', '10:00 AM - 12:00 PM', 'Community Center, 123 Main St', 'Golden Years Association', 'Health', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'),
('Technology for Seniors', 'Learn how to use smartphones, tablets, and computers to stay connected with family and friends.', '2023-06-20', '2:00 PM - 4:00 PM', 'Public Library, 456 Oak St', 'Tech Helpers', 'Education', 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=600&q=80'),
('Community Garden Day', 'Help plant and maintain our community garden. All tools and supplies provided.', '2023-06-25', '9:00 AM - 11:00 AM', 'Community Garden, 789 Green St', 'Green Thumbs Club', 'Outdoors', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80'),
('Senior Social Hour', 'Join us for coffee, snacks, and conversation with other seniors in the community.', '2023-06-18', '3:00 PM - 5:00 PM', 'Senior Center, 321 Elm St', 'Community Connections', 'Social', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80');
