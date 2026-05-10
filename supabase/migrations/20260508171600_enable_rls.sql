-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 1. Members Policies
-- Admins can see all members
CREATE POLICY "Admins can manage all members" ON members
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Devotees can only see their own profile
CREATE POLICY "Devotees can see own profile" ON members
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Anyone can insert (Register)
CREATE POLICY "Public can register" ON members
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 2. Donations Policies
CREATE POLICY "Admins manage all donations" ON donations
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Devotees see own donations" ON donations
FOR SELECT TO authenticated
USING (member_id = auth.uid());

CREATE POLICY "Devotees can insert donations" ON donations
FOR INSERT TO authenticated
WITH CHECK (member_id = auth.uid());

-- 3. Branches Policies
CREATE POLICY "Everyone can see branches" ON branches
FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Admins manage branches" ON branches
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 4. Inventory Policies
CREATE POLICY "Admins manage inventory logs" ON inventory_logs
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');

/*
CREATE POLICY "Branches see their own logs" ON inventory_logs
FOR SELECT TO authenticated
USING (branch_id IN (
  SELECT id FROM branches WHERE manager_id = auth.uid()
));
*/

-- 5. System Settings
CREATE POLICY "Admins manage settings" ON system_settings
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Public can see settings" ON system_settings
FOR SELECT TO anon, authenticated
USING (true);
