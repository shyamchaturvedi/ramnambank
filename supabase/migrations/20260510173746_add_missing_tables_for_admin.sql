-- 1. Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id),
    amount NUMERIC NOT NULL,
    utr_number TEXT UNIQUE,
    payment_method TEXT DEFAULT 'UPI',
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inventory Requests Table
CREATE TABLE IF NOT EXISTS public.inventory_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES public.branches(id),
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Add missing columns to system_settings if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'system_settings' AND COLUMN_NAME = 'upi_id') THEN
        ALTER TABLE public.system_settings ADD COLUMN upi_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'system_settings' AND COLUMN_NAME = 'qr_code_url') THEN
        ALTER TABLE public.system_settings ADD COLUMN qr_code_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'system_settings' AND COLUMN_NAME = 'maintenance_mode') THEN
        ALTER TABLE public.system_settings ADD COLUMN maintenance_mode BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'system_settings' AND COLUMN_NAME = 'updated_at') THEN
        ALTER TABLE public.system_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Seed initial settings
INSERT INTO public.system_settings (id, upi_id, maintenance_mode)
VALUES (1, 'ramnam@upi', false)
ON CONFLICT (id) DO UPDATE SET
    upi_id = EXCLUDED.upi_id,
    maintenance_mode = EXCLUDED.maintenance_mode;
