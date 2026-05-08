-- FINALIZE SECURITY & ACCESS

-- Enable RLS on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Create Public Access Policies (For testing and public registration)
-- Note: In production, these should be restricted to authenticated users for write operations.

-- 1. Branches
CREATE POLICY "Allow public read branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Allow admin all branches" ON branches FOR ALL USING (true);

-- 2. Members
CREATE POLICY "Allow public insert members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow admin all members" ON members FOR ALL USING (true);

-- 3. Committee
CREATE POLICY "Allow public read committee" ON committee_members FOR SELECT USING (true);

-- 4. Plans
CREATE POLICY "Allow public read plans" ON membership_plans FOR SELECT USING (true);

-- 5. Inventory
CREATE POLICY "Allow public read inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Allow admin all inventory" ON inventory FOR ALL USING (true);

-- 6. Logs
CREATE POLICY "Allow public read logs" ON inventory_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert logs" ON inventory_logs FOR INSERT WITH CHECK (true);
