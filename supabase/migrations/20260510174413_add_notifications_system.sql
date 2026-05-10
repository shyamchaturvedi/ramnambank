-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'INFO', -- 'INFO', 'SUCCESS', 'WARNING', 'ERROR'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can see their own notifications" ON notifications
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications (read status)" ON notifications
FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 4. Seed Welcome Notifications for Test Users
DO $$
DECLARE
    member_rec RECORD;
BEGIN
    FOR member_rec IN SELECT id, full_name FROM members WHERE membership_id IN ('TEST_ADMIN', 'TEST_DEVOTEE', 'TEST_MANAGER', 'TEST_VOLUNTEER')
    LOOP
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (member_rec.id, 'स्वागत है!', 'राम नाम बैंक में आपका हार्दिक स्वागत है, ' || member_rec.full_name || '।', 'SUCCESS');
        
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (member_rec.id, 'प्रोफाइल अपडेट', 'कृपया अपनी प्रोफाइल की जानकारी जांच लें।', 'INFO');
    END LOOP;
END $$;
