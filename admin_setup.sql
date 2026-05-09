-- ADMIN SETUP SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Add Role Column to Members if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='role') THEN
        ALTER TABLE members ADD COLUMN role TEXT DEFAULT 'DEVOTEE';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='email') THEN
        ALTER TABLE members ADD COLUMN email TEXT;
    END IF;
END $$;

-- 2. Create/Update Admin User in Members table
INSERT INTO members (
    full_name, 
    mobile_number, 
    email,
    address, 
    role, 
    status, 
    membership_id
) VALUES (
    'Super Admin', 
    '9598023701', 
    'iammshyam@gmail.com',
    'Ayodhya Dham', 
    'ADMIN', 
    'ACTIVE', 
    'ADMIN/2024/0001'
) ON CONFLICT (mobile_number) DO UPDATE SET role = 'ADMIN', status = 'ACTIVE', email = 'iammshyam@gmail.com';

-- 3. Instruction for Auth:
-- Please go to Supabase Dashboard > Authentication > Users
-- Click 'Add User' > 'Create new user'
-- Email: iammshyam@gmail.com
-- Password: [Your Selected Password]
-- Confirm the email or disable email confirmation in settings.
