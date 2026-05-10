-- Add Test Users for all 4 roles
-- Password for all is: 123456

INSERT INTO public.members (membership_id, full_name, mobile_number, email, role, password, status, branch_code)
VALUES 
('TEST_ADMIN', 'Test Administrator', '9999900001', 'admin@test.com', 'ADMIN', '123456', 'ACTIVE', 'MAIN'),
('TEST_DEVOTEE', 'Test Devotee', '9999900002', 'devotee@test.com', 'DEVOTEE', '123456', 'ACTIVE', 'MAIN'),
('TEST_MANAGER', 'Test Branch Manager', '9999900003', 'manager@test.com', 'BRANCH_MANAGER', '123456', 'ACTIVE', 'MAIN'),
('TEST_VOLUNTEER', 'Test Volunteer', '9999900004', 'volunteer@test.com', 'VOLUNTEER', '123456', 'ACTIVE', 'MAIN')
ON CONFLICT (membership_id) DO UPDATE SET
    role = EXCLUDED.role,
    password = EXCLUDED.password,
    email = EXCLUDED.email;
