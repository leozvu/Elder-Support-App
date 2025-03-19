-- First, delete the existing users to avoid conflicts
DELETE FROM auth.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');

-- Then recreate them with consistent passwords
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000001', 'martha@example.com', '$2a$10$Nt8/qJKgZFOSPYqQVUGDdu4z0GS3XlLYMWpRbG1.4g4ovQe35YqQG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"customer"}', '{"full_name":"Martha Johnson","role":"customer"}'),
('00000000-0000-0000-0000-000000000002', 'helper@example.com', '$2a$10$Nt8/qJKgZFOSPYqQVUGDdu4z0GS3XlLYMWpRbG1.4g4ovQe35YqQG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"helper"}', '{"full_name":"Helper User","role":"helper"}'),
('00000000-0000-0000-0000-000000000003', 'admin@example.com', '$2a$10$Nt8/qJKgZFOSPYqQVUGDdu4z0GS3XlLYMWpRbG1.4g4ovQe35YqQG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Admin User","role":"admin"}');

-- Delete existing public.users entries for these users
DELETE FROM public.users WHERE id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

-- Insert public.users entries
INSERT INTO public.users (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000001', 'martha@example.com', 'Martha Johnson', 'customer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha', now(), now()),
('00000000-0000-0000-0000-000000000002', 'helper@example.com', 'Helper User', 'helper', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper', now(), now()),
('00000000-0000-0000-0000-000000000003', 'admin@example.com', 'Admin User', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', now(), now());

-- Create helper profile if it doesn't exist
INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000002', 'Professional helper with experience in senior care', 'approved', ARRAY['Shopping Assistance', 'Medical Appointments', 'Home Maintenance'], now(), now())
ON CONFLICT (id) DO NOTHING;
