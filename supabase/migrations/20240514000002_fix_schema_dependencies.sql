-- Reset schema by dropping and recreating tables with CASCADE option to handle dependencies

-- Drop existing tables if they exist with CASCADE to handle dependencies
DROP TABLE IF EXISTS helper_profiles CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS service_reviews CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'helper', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create helper_profiles table
CREATE TABLE IF NOT EXISTS helper_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  services_offered TEXT[] DEFAULT '{}',
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  helper_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_reviews table
CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Helper profiles policies
DROP POLICY IF EXISTS "Helper profiles are viewable by everyone" ON helper_profiles;
CREATE POLICY "Helper profiles are viewable by everyone" ON helper_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Helpers can update their own profiles" ON helper_profiles;
CREATE POLICY "Helpers can update their own profiles" ON helper_profiles FOR UPDATE USING (auth.uid() = id);

-- Service requests policies
DROP POLICY IF EXISTS "Service requests are viewable by involved parties" ON service_requests;
CREATE POLICY "Service requests are viewable by involved parties" ON service_requests 
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = helper_id OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Customers can create service requests" ON service_requests;
CREATE POLICY "Customers can create service requests" ON service_requests 
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Involved parties can update service requests" ON service_requests;
CREATE POLICY "Involved parties can update service requests" ON service_requests 
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = helper_id OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Service reviews policies
DROP POLICY IF EXISTS "Service reviews are viewable by everyone" ON service_reviews;
CREATE POLICY "Service reviews are viewable by everyone" ON service_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create their own reviews" ON service_reviews;
CREATE POLICY "Users can create their own reviews" ON service_reviews 
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON service_reviews;
CREATE POLICY "Users can update their own reviews" ON service_reviews 
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Emergency contacts policies
DROP POLICY IF EXISTS "Emergency contacts are viewable by owner" ON emergency_contacts;
CREATE POLICY "Emergency contacts are viewable by owner" ON emergency_contacts 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their emergency contacts" ON emergency_contacts;
CREATE POLICY "Users can manage their emergency contacts" ON emergency_contacts 
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table helper_profiles;
alter publication supabase_realtime add table service_requests;
alter publication supabase_realtime add table service_reviews;
alter publication supabase_realtime add table emergency_contacts;
