-- Ensure helper profile exists for the helper user
INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000002', 'Professional helper with experience in senior care', 'approved', ARRAY['Shopping Assistance', 'Medical Appointments', 'Home Maintenance'], now(), now())
ON CONFLICT (id) DO NOTHING;
