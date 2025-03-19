-- This migration recreates the demo users with consistent IDs

-- First, delete existing demo users if they exist
DELETE FROM auth.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
DELETE FROM public.users WHERE email IN ('martha@example.com', 'helper@example.com', 'admin@example.com');
DELETE FROM public.helper_profiles WHERE id IN (SELECT id FROM public.users WHERE email = 'helper@example.com');

-- Create Martha (Senior/Customer)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000001', 'martha@example.com', '$2a$10$Nt8/qNmdUARrwQw7yNRUb.bQ2MqiNQUYcAMQKm.7TZ.hOlzTfEOdG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"customer"}', '{"full_name":"Martha Johnson","role":"customer"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, phone, address, avatar_url, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000001', 'martha@example.com', 'Martha Johnson', 'customer', '(555) 123-4567', '123 Main St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create Helper
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000002', 'helper@example.com', '$2a$10$Nt8/qNmdUARrwQw7yNRUb.bQ2MqiNQUYcAMQKm.7TZ.hOlzTfEOdG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"helper"}', '{"full_name":"Henry Helper","role":"helper"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, phone, address, avatar_url, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000002', 'helper@example.com', 'Henry Helper', 'helper', '(555) 987-6543', '456 Oak St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, average_rating, total_reviews, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000002', 'Experienced helper with a passion for assisting seniors.', 'approved', ARRAY['Shopping Assistance', 'Medical Appointments', 'Companionship', 'Home Maintenance'], 4.8, 24, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create Admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000003', 'admin@example.com', '$2a$10$Nt8/qNmdUARrwQw7yNRUb.bQ2MqiNQUYcAMQKm.7TZ.hOlzTfEOdG', now(), now(), now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Admin User","role":"admin"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, phone, address, avatar_url, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000003', 'admin@example.com', 'Admin User', 'admin', '(555) 555-5555', '789 Pine St, Anytown, USA', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', now(), now())
ON CONFLICT (id) DO NOTHING;
