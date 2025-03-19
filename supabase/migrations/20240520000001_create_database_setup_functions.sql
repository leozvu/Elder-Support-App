-- Create functions to help set up the database

-- Function to create the users table
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
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
  
  -- Create RLS policies
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see their own data
  CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);
    
  -- Policy for users to update their own data
  CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);
    
  -- Policy for admins to see all users
  CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create the helper_profiles table
CREATE OR REPLACE FUNCTION create_helper_profiles_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.helper_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id),
    bio TEXT,
    verification_status TEXT DEFAULT 'pending',
    services_offered TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  
  -- Create RLS policies
  ALTER TABLE public.helper_profiles ENABLE ROW LEVEL SECURITY;
  
  -- Policy for helpers to see their own profile
  CREATE POLICY "Helpers can view their own profile" ON public.helper_profiles
    FOR SELECT USING (auth.uid() = id);
    
  -- Policy for helpers to update their own profile
  CREATE POLICY "Helpers can update their own profile" ON public.helper_profiles
    FOR UPDATE USING (auth.uid() = id);
    
  -- Policy for customers to view helper profiles
  CREATE POLICY "Customers can view helper profiles" ON public.helper_profiles
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'customer'
      )
    );
    
  -- Policy for admins to manage all profiles
  CREATE POLICY "Admins can manage all profiles" ON public.helper_profiles
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create the service_requests table
CREATE OR REPLACE FUNCTION create_service_requests_table()
RETURNS void AS $$
BEGIN
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
  
  -- Create RLS policies
  ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
  
  -- Policy for customers to see their own requests
  CREATE POLICY "Customers can view their own requests" ON public.service_requests
    FOR SELECT USING (auth.uid() = customer_id);
    
  -- Policy for customers to create requests
  CREATE POLICY "Customers can create requests" ON public.service_requests
    FOR INSERT WITH CHECK (
      auth.uid() = customer_id AND
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'customer'
      )
    );
    
  -- Policy for customers to update their own requests
  CREATE POLICY "Customers can update their own requests" ON public.service_requests
    FOR UPDATE USING (
      auth.uid() = customer_id AND
      status NOT IN ('completed', 'cancelled')
    );
    
  -- Policy for helpers to see assigned requests
  CREATE POLICY "Helpers can view assigned requests" ON public.service_requests
    FOR SELECT USING (
      auth.uid() = helper_id OR
      (helper_id IS NULL AND
       EXISTS (
         SELECT 1 FROM public.users
         WHERE id = auth.uid() AND role = 'helper'
       ))
    );
    
  -- Policy for helpers to update assigned requests
  CREATE POLICY "Helpers can update assigned requests" ON public.service_requests
    FOR UPDATE USING (
      auth.uid() = helper_id AND
      status NOT IN ('completed', 'cancelled')
    );
    
  -- Policy for admins to manage all requests
  CREATE POLICY "Admins can manage all requests" ON public.service_requests
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create demo users
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
BEGIN
  -- Delete existing demo users if they exist
  DELETE FROM auth.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
  DELETE FROM public.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
  
  -- Insert demo users into auth.users
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES 
    ('00000000-0000-0000-0000-000000000011', 'martha@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"customer"}', '{"full_name":"Martha Johnson"}'),
    ('00000000-0000-0000-0000-000000000012', 'helper@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"helper"}', '{"full_name":"Helper User"}'),
    ('00000000-0000-0000-0000-000000000013', 'admin@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Admin User"}');
  
  -- Insert demo users into public.users
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at, avatar_url, phone, address)
  VALUES
    ('00000000-0000-0000-0000-000000000011', 'martha@example.com', 'Martha Johnson', 'customer', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha', '(555) 123-4567', '123 Main St, Anytown, USA'),
    ('00000000-0000-0000-0000-000000000012', 'helper@example.com', 'Helper User', 'helper', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper', '(555) 987-6543', '456 Oak St, Anytown, USA'),
    ('00000000-0000-0000-0000-000000000013', 'admin@example.com', 'Admin User', 'admin', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', '(555) 555-5555', '789 Pine St, Anytown, USA');
END;
$$ LANGUAGE plpgsql;

-- Function to create demo helper profile
CREATE OR REPLACE FUNCTION create_demo_helper_profile()
RETURNS void AS $$
BEGIN
  -- Create helper profile for the helper user if it doesn't exist
  INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, created_at, updated_at)
  VALUES
    ('00000000-0000-0000-0000-000000000012', 'Experienced helper ready to assist seniors', 'verified', ARRAY['companionship', 'shopping', 'transportation'], now(), now())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create demo service requests
CREATE OR REPLACE FUNCTION create_demo_service_requests()
RETURNS void AS $$
BEGIN
  -- Create demo service requests
  INSERT INTO public.service_requests (id, customer_id, helper_id, service_type, status, description, location, scheduled_time, created_at, updated_at)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012', 'shopping', 'in_progress', 'Need help with grocery shopping', '123 Main St, Anytown, USA', now() + interval '2 days', now(), now()),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000011', NULL, 'transportation', 'pending', 'Need a ride to doctor appointment', '123 Main St, Anytown, USA', now() + interval '5 days', now(), now()),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012', 'companionship', 'completed', 'Would like someone to talk to', '123 Main St, Anytown, USA', now() - interval '3 days', now() - interval '5 days', now() - interval '2 days');
END;
$$ LANGUAGE plpgsql;