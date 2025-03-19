-- This migration completely resets and recreates the demo users
-- First, delete any existing demo users
DELETE FROM auth.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
DELETE FROM public.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
DELETE FROM public.helper_profiles WHERE id IN (SELECT id FROM public.users WHERE email = 'helper@example.com');

-- Create the users in public.users table first
INSERT INTO public.users (id, email, full_name, role, phone, address, avatar_url, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000001', 'martha@example.com', 'Martha Johnson', 'customer', '(555) 123-4567', '123 Main St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha', now(), now()),
('00000000-0000-0000-0000-000000000002', 'helper@example.com', 'Henry Helper', 'helper', '(555) 987-6543', '456 Oak St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', now(), now()),
('00000000-0000-0000-0000-000000000003', 'admin@example.com', 'Admin User', 'admin', '(555) 555-5555', '789 Pine St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create helper profile
INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, average_rating, total_reviews, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000002', 'Experienced helper with a passion for assisting seniors.', 'approved', ARRAY['Shopping Assistance', 'Medical Appointments', 'Companionship', 'Home Maintenance'], 4.8, 24, now(), now())
ON CONFLICT (id) DO NOTHING;
