-- FIX MEMBERS TABLE SCHEMA
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS branch_code TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'DEVOTEE';

-- 2. Update RLS policies to ensure registration works
-- (This ensures anybody can register a new account)
DROP POLICY IF EXISTS "Enable insert for everyone" ON members;
CREATE POLICY "Enable insert for everyone" ON members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for users" ON members;
CREATE POLICY "Enable select for users" ON members FOR SELECT USING (true);
