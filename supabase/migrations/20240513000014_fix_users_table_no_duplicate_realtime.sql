-- Reset users table and recreate with proper structure
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'helper', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Public access policy for authentication purposes
DROP POLICY IF EXISTS "Public read access" ON users;
CREATE POLICY "Public read access"
  ON users
  FOR SELECT
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table users;

-- Create helper_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS helper_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  services_offered TEXT[],
  average_rating NUMERIC(3,2),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Helpers can view their own profile" ON helper_profiles;
CREATE POLICY "Helpers can view their own profile"
  ON helper_profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Helpers can update their own profile" ON helper_profiles;
CREATE POLICY "Helpers can update their own profile"
  ON helper_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Public access policy for viewing helper profiles
DROP POLICY IF EXISTS "Public read access" ON helper_profiles;
CREATE POLICY "Public read access"
  ON helper_profiles
  FOR SELECT
  USING (true);

-- Check if helper_profiles is already in the publication before adding it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'helper_profiles'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE helper_profiles';
  END IF;
END
$$;