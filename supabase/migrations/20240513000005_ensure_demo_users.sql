-- Ensure demo users exist with correct credentials

-- First, check if the users already exist and delete them if they do
-- This ensures we have clean credentials
DELETE FROM auth.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');

-- Insert the demo users with correct credentials
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'martha@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"customer"}', '{"full_name":"Martha Johnson"}'),
  ('00000000-0000-0000-0000-000000000002', 'helper@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"helper"}', '{"full_name":"Helper User"}'),
  ('00000000-0000-0000-0000-000000000003', 'admin@example.com', '$2a$10$Nt/oDwZ1Xh9J1Qm9QJzRJuuOTUFsQKz9RNg8vPeVZKLNLQJZLgX.e', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Admin User"}');

-- Ensure corresponding entries in the public.users table
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'martha@example.com', 'Martha Johnson', 'customer', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha'),
  ('00000000-0000-0000-0000-000000000002', 'helper@example.com', 'Helper User', 'helper', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper'),
  ('00000000-0000-0000-0000-000000000003', 'admin@example.com', 'Admin User', 'admin', now(), now(), 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Create helper profile for the helper user if it doesn't exist
INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Experienced helper ready to assist seniors', 'verified', '{"companionship","shopping","transportation"}', now(), now())
ON CONFLICT (id) DO NOTHING;
