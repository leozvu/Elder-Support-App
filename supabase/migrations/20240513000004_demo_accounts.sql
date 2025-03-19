-- Create demo accounts if they don't exist

-- Helper function to create a user if they don't exist
CREATE OR REPLACE FUNCTION create_demo_user(p_email TEXT, p_password TEXT, p_full_name TEXT, p_role TEXT, p_phone TEXT, p_address TEXT)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_count INTEGER;
BEGIN
    -- Check if user already exists
    SELECT COUNT(*) INTO v_count FROM auth.users WHERE email = p_email;
    
    IF v_count = 0 THEN
        -- Create auth user
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES 
        ('00000000-0000-0000-0000-000000000000', 
         gen_random_uuid(), 
         'authenticated', 
         'authenticated', 
         p_email, 
         crypt(p_password, gen_salt('bf')), 
         now(), 
         now(), 
         now(),
         '{"provider":"email","providers":["email"]}'::jsonb,
         format('{"full_name":"%s","role":"%s"}', p_full_name, p_role)::jsonb,
         now(), 
         now(), 
         '', 
         '', 
         '', 
         '')
        RETURNING id INTO v_user_id;
        
        -- Create user profile
        INSERT INTO public.users (id, email, full_name, phone, address, role, avatar_url)
        VALUES (v_user_id, p_email, p_full_name, p_phone, p_address, p_role, 
                format('https://api.dicebear.com/7.x/avataaars/svg?seed=%s', split_part(p_full_name, ' ', 1)));
        
        -- Create helper profile if role is helper
        IF p_role = 'helper' THEN
            INSERT INTO public.helper_profiles (id, bio, verification_status, services_offered)
            VALUES (v_user_id, 'I am a professional caregiver with experience helping seniors.', 'approved', 
                   '["Shopping Assistance", "Medical Appointments", "Companionship"]'::jsonb);
        END IF;
        
        RETURN v_user_id;
    ELSE
        -- User already exists, return their ID
        SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
        RETURN v_user_id;
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating user %: %', p_email, SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create demo accounts
SELECT create_demo_user(
    'martha@example.com',
    'password123',
    'Martha Johnson',
    'customer',
    '(555) 123-4567',
    '123 Main St, Anytown, USA'
);

SELECT create_demo_user(
    'helper@example.com',
    'password123',
    'John Helper',
    'helper',
    '(555) 987-6543',
    '456 Oak Ave, Anytown, USA'
);

SELECT create_demo_user(
    'admin@example.com',
    'password123',
    'Admin User',
    'admin',
    '(555) 555-5555',
    '789 Hub Street, Anytown, USA'
);

-- Clean up
DROP FUNCTION IF EXISTS create_demo_user;
