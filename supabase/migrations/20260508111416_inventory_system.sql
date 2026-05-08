-- INVENTORY MANAGEMENT SYSTEM

-- 1. Inventory Table (Current Stock)
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL, -- 'BOOK' or 'PEN'
    quantity INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, item_name)
);

-- 2. Inventory Logs (History)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'CREDIT' (Add) or 'DEBIT' (Remove)
    quantity INTEGER NOT NULL,
    remark TEXT NOT NULL, -- Mandatory for audit
    created_by TEXT, -- Admin/Branch Head ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL STOCK FOR MAIN BRANCHES
DO $$
DECLARE
    ayodhya_id UUID;
    kendrapara_id UUID;
BEGIN
    SELECT id INTO ayodhya_id FROM branches WHERE code = 'MAIN' LIMIT 1;
    SELECT id INTO kendrapara_id FROM branches WHERE code = 'OD/17' LIMIT 1;
    
    IF ayodhya_id IS NOT NULL THEN
        INSERT INTO inventory (branch_id, item_name, quantity) VALUES 
        (ayodhya_id, 'BOOK', 5000),
        (ayodhya_id, 'PEN', 10000)
        ON CONFLICT (branch_id, item_name) DO NOTHING;
    END IF;

    IF kendrapara_id IS NOT NULL THEN
        INSERT INTO inventory (branch_id, item_name, quantity) VALUES 
        (kendrapara_id, 'BOOK', 1000),
        (kendrapara_id, 'PEN', 2000)
        ON CONFLICT (branch_id, item_name) DO NOTHING;
    END IF;
END $$;
