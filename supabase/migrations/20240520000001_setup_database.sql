-- Setup database schema for Elder Support App

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create helper_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.helper_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id),
  bio TEXT,
  verification_status TEXT DEFAULT 'pending',
  services_offered TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.users(id),
  helper_id UUID REFERENCES public.users(id),
  service_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  description TEXT,
  location TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo users if they don't exist
DO $$
BEGIN
  -- Check if demo users exist
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'martha@example.com') THEN
    -- Insert demo customer
    INSERT INTO public.users (id, email, full_name, role, avatar_url, phone, address, created_at, updated_at)
    VALUES (
      '00000000-0000-0000-0000-000000000011',
      'martha@example.com',
      'Martha Johnson',
      'customer',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha',
      '(555) 123-4567',
      '123 Main St, Anytown, USA',
      now(),
      now()
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'helper@example.com') THEN
    -- Insert demo helper
    INSERT INTO public.users (id, email, full_name, role, avatar_url, phone, address, created_at, updated_at)
    VALUES (
      '00000000-0000-0000-0000-000000000012',
      'helper@example.com',
      'Helper User',
      'helper',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper',
      '(555) 987-6543',
      '456 Oak St, Anytown, USA',
      now(),
      now()
    );
    
    -- Insert helper profile
    INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000012',
      'Experienced helper ready to assist seniors',
      'verified',
      ARRAY['companionship', 'shopping', 'transportation'],
      now(),
      now()
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@example.com') THEN
    -- Insert demo admin
    INSERT INTO public.users (id, email, full_name, role, avatar_url, phone, address, created_at, updated_at)
    VALUES (
      '00000000-0000-0000-0000-000000000013',
      'admin@example.com',
      'Admin User',
      'admin',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      '(555) 555-5555',
      '789 Pine St, Anytown, USA',
      now(),
      now()
    );
  END IF;
  
  -- Create demo service requests if none exist
  IF NOT EXISTS (SELECT 1 FROM public.service_requests LIMIT 1) THEN
    -- Insert demo service requests
    INSERT INTO public.service_requests (customer_id, helper_id, service_type, status, description, location, scheduled_time, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012', 'shopping', 'in_progress', 'Need help with grocery shopping', '123 Main St, Anytown, USA', now() + interval '2 days', now(), now()),
      ('00000000-0000-0000-0000-000000000011', NULL, 'transportation', 'pending', 'Need a ride to doctor appointment', '123 Main St, Anytown, USA', now() + interval '5 days', now(), now()),
      ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012', 'companionship', 'completed', 'Would like someone to talk to', '123 Main St, Anytown, USA', now() - interval '3 days', now() - interval '5 days', now() - interval '2 days');
  END IF;
END $$;

-- Set up Row Level Security (RLS)
-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for helper_profiles table
DROP POLICY IF EXISTS "Helpers can view their own profile" ON public.helper_profiles;
CREATE POLICY "Helpers can view their own profile" ON public.helper_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Helpers can update their own profile" ON public.helper_profiles;
CREATE POLICY "Helpers can update their own profile" ON public.helper_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Customers can view helper profiles" ON public.helper_profiles;
CREATE POLICY "Customers can view helper profiles" ON public.helper_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.helper_profiles;
CREATE POLICY "Admins can manage all profiles" ON public.helper_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for service_requests table
DROP POLICY IF EXISTS "Customers can view their own requests" ON public.service_requests;
CREATE POLICY "Customers can view their own requests" ON public.service_requests
  FOR SELECT USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can create requests" ON public.service_requests;
CREATE POLICY "Customers can create requests" ON public.service_requests
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

DROP POLICY IF EXISTS "Customers can update their own requests" ON public.service_requests;
CREATE POLICY "Customers can update their own requests" ON public.service_requests
  FOR UPDATE USING (
    auth.uid() = customer_id AND
    status NOT IN ('completed', 'cancelled')
  );

DROP POLICY IF EXISTS "Helpers can view assigned requests" ON public.service_requests;
CREATE POLICY "Helpers can view assigned requests" ON public.service_requests
  FOR SELECT USING (
    auth.uid() = helper_id OR
    (helper_id IS NULL AND
     EXISTS (
       SELECT 1 FROM public.users
       WHERE id = auth.uid() AND role = 'helper'
     ))
  );

DROP POLICY IF EXISTS "Helpers can update assigned requests" ON public.service_requests;
CREATE POLICY "Helpers can update assigned requests" ON public.service_requests
  FOR UPDATE USING (
    auth.uid() = helper_id AND
    status NOT IN ('completed', 'cancelled')
  );

DROP POLICY IF EXISTS "Admins can manage all requests" ON public.service_requests;
CREATE POLICY "Admins can manage all requests" ON public.service_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create auth users for demo accounts if they don't exist
-- Note: This requires superuser privileges and might not work in all environments
DO $$
BEGIN
  -- Check if auth users exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'martha@example.com') THEN
    -- Insert demo users into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES 
      ('00000000-0000-0000-0000-000000000011', 'martha@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"customer"}', '{"full_name":"Martha Johnson"}'),
      ('00000000-0000-0000-0000-000000000012', 'helper@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"helper"}', '{"full_name":"Helper User"}'),
      ('00000000-0000-0000-0000-000000000013', 'admin@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Admin User"}');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors (likely permission issues)
    RAISE NOTICE 'Could not create auth users: %', SQLERRM;
END $$;