-- SEED COMMITTEE MEMBERS

-- 1. Ayodhya Main Branch Members
DO $$
DECLARE
    ayodhya_id UUID;
BEGIN
    SELECT id INTO ayodhya_id FROM branches WHERE code = 'MAIN' LIMIT 1;
    
    IF ayodhya_id IS NOT NULL THEN
        INSERT INTO committee_members (name, post, phone, category, branch_id) VALUES
        ('DEV CHAUBEY', 'Chief Trustee', '9598023701', 'TRUST', ayodhya_id),
        ('ASHU TIWARI', 'Trustee', '9598023701', 'TRUST', ayodhya_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 2. Kendrapara Branch Members
DO $$
DECLARE
    kendrapara_id UUID;
BEGIN
    SELECT id INTO kendrapara_id FROM branches WHERE code = 'OD/17' LIMIT 1;
    
    IF kendrapara_id IS NOT NULL THEN
        INSERT INTO committee_members (name, post, phone, category, branch_id) VALUES
        ('NIRMAL RANJAN SWAIN', 'President', '6372858933', 'EXECUTIVE', kendrapara_id),
        ('PRAHALLAD SAHOO', 'Secretary', '9438023159', 'EXECUTIVE', kendrapara_id),
        ('MANORANJAN MALIK', 'Asst. Secretary', '7008182740', 'EXECUTIVE', kendrapara_id),
        ('NRUSINGH CHARAN PRADHAN', 'Treasurer', '9938634861', 'EXECUTIVE', kendrapara_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
