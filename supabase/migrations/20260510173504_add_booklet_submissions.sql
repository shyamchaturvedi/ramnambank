-- 1. Create Booklet Submissions Table
CREATE TABLE IF NOT EXISTS public.booklet_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id),
    booklet_number TEXT NOT NULL,
    quantity INTEGER NOT NULL, -- Number of names written
    status TEXT DEFAULT 'VERIFIED', -- 'VERIFIED', 'PENDING'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable RLS
ALTER TABLE public.booklet_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Admins can manage all submissions" ON booklet_submissions
FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Devotees can see their own submissions" ON booklet_submissions
FOR SELECT TO authenticated USING (member_id = auth.uid());

-- 4. Seed Dummy Data for Test Users
DO $$
DECLARE
    devotee_id UUID;
    branch_id UUID;
BEGIN
    SELECT id INTO devotee_id FROM members WHERE membership_id = 'TEST_DEVOTEE' LIMIT 1;
    SELECT id INTO branch_id FROM branches WHERE code = 'MAIN' LIMIT 1;

    IF devotee_id IS NOT NULL AND branch_id IS NOT NULL THEN
        INSERT INTO booklet_submissions (member_id, branch_id, booklet_number, quantity, status)
        VALUES 
        (devotee_id, branch_id, 'BK-2026-001', 500000, 'VERIFIED'),
        (devotee_id, branch_id, 'BK-2026-002', 250000, 'VERIFIED'),
        (devotee_id, branch_id, 'BK-2026-003', 100000, 'PENDING');
    END IF;
END $$;
