-- Create demo users

-- Customer: Martha Johnson
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'martha@example.com',
  '$2a$10$Gg9Qv.Qj5LBKDsZ7gFbSUOl7l9DxxuJiSzaRwrL6O/JqIHy0FKhvO', -- password: Password123!
  NOW(),
  '{"provider":"email","providers":["email"],"role":"customer"}',
  '{"full_name":"Martha Johnson"}',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, full_name, phone, address, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'martha@example.com',
  'Martha Johnson',
  '(555) 123-4567',
  '123 Main Street, Anytown, USA',
  'customer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha'
);

-- Customer: Robert Davis
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'robert@example.com',
  '$2a$10$Gg9Qv.Qj5LBKDsZ7gFbSUOl7l9DxxuJiSzaRwrL6O/JqIHy0FKhvO', -- password: Password123!
  NOW(),
  '{"provider":"email","providers":["email"],"role":"customer"}',
  '{"full_name":"Robert Davis"}',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, full_name, phone, address, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'robert@example.com',
  'Robert Davis',
  '(555) 234-5678',
  '456 Oak Avenue, Anytown, USA',
  'customer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert'
);

-- Helper: Sarah Johnson
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'sarah@example.com',
  '$2a$10$Gg9Qv.Qj5LBKDsZ7gFbSUOl7l9DxxuJiSzaRwrL6O/JqIHy0FKhvO', -- password: Password123!
  NOW(),
  '{"provider":"email","providers":["email"],"role":"helper"}',
  '{"full_name":"Sarah Johnson"}',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, full_name, phone, address, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'sarah@example.com',
  'Sarah Johnson',
  '(555) 345-6789',
  '789 Pine Street, Anytown, USA',
  'helper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
);

INSERT INTO helper_profiles (id, bio, verification_status, services_offered, average_rating)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Experienced caregiver with 5 years of experience working with seniors. Certified in First Aid and CPR.',
  'verified',
  ARRAY['Shopping Assistance', 'Medical Appointment', 'Companionship'],
  4.8
);

-- Helper: Michael Brown
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'michael@example.com',
  '$2a$10$Gg9Qv.Qj5LBKDsZ7gFbSUOl7l9DxxuJiSzaRwrL6O/JqIHy0FKhvO', -- password: Password123!
  NOW(),
  '{"provider":"email","providers":["email"],"role":"helper"}',
  '{"full_name":"Michael Brown"}',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, full_name, phone, address, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'michael@example.com',
  'Michael Brown',
  '(555) 456-7890',
  '101 Maple Drive, Anytown, USA',
  'helper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
);

INSERT INTO helper_profiles (id, bio, verification_status, services_offered, average_rating)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'Retired nurse with a passion for helping seniors maintain their independence. Specializing in medical appointment assistance and medication management.',
  'verified',
  ARRAY['Medical Appointment', 'Medication Reminder', 'Home Maintenance'],
  4.6
);

-- Admin: Admin User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'admin@example.com',
  '$2a$10$Gg9Qv.Qj5LBKDsZ7gFbSUOl7l9DxxuJiSzaRwrL6O/JqIHy0FKhvO', -- password: Password123!
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"full_name":"Admin User"}',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, full_name, phone, address, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'admin@example.com',
  'Admin User',
  '(555) 567-8901',
  '202 Admin Plaza, Anytown, USA',
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
);

-- Add emergency contacts for Martha
INSERT INTO emergency_contacts (user_id, name, phone, relationship)
VALUES
('00000000-0000-0000-0000-000000000001', 'Robert Johnson', '(555) 987-6543', 'Son'),
('00000000-0000-0000-0000-000000000001', 'Sarah Williams', '(555) 456-7890', 'Daughter'),
('00000000-0000-0000-0000-000000000001', 'Emergency Services', '911', 'Emergency');

-- Add emergency contacts for Robert
INSERT INTO emergency_contacts (user_id, name, phone, relationship)
VALUES
('00000000-0000-0000-0000-000000000002', 'Mary Davis', '(555) 876-5432', 'Wife'),
('00000000-0000-0000-0000-000000000002', 'Community Hub', '(555) 987-6543', 'Care Provider');

-- Add sample service requests
INSERT INTO service_requests (customer_id, helper_id, service_type_id, status, details, address, scheduled_time, duration_minutes)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 
 (SELECT id FROM service_types WHERE name = 'Shopping Assistance'), 
 'in_progress', 'Need help with grocery shopping. Please get items from the list.', 
 '123 Main Street, Anytown, USA', NOW() + INTERVAL '2 days', 60),
 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 
 (SELECT id FROM service_types WHERE name = 'Medical Appointment'), 
 'scheduled', 'Doctor appointment at City Medical Center. Need transportation and assistance.', 
 '123 Main Street, Anytown, USA', NOW() + INTERVAL '5 days', 120),
 
('00000000-0000-0000-0000-000000000002', NULL, 
 (SELECT id FROM service_types WHERE name = 'Home Maintenance'), 
 'pending', 'Need help fixing a leaky faucet in the kitchen.', 
 '456 Oak Avenue, Anytown, USA', NOW() + INTERVAL '3 days', 90);

-- Add sample service reviews
INSERT INTO service_reviews (service_request_id, customer_id, helper_id, rating, review_text)
VALUES
((SELECT id FROM service_requests WHERE customer_id = '00000000-0000-0000-0000-000000000001' AND status = 'in_progress'),
 '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 5,
 'Sarah was very helpful and patient. She helped me get all the groceries I needed and even helped put them away.');
