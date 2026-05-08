-- RAM NAM BANK SUPABASE SCHEMA

-- 1. Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    city TEXT,
    code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'PROPOSED', -- 'ACTIVE' or 'PROPOSED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price_hindi TEXT,
    price_value NUMERIC,
    description TEXT,
    icon TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Committee Members Table
CREATE TABLE IF NOT EXISTS committee_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    post TEXT,
    phone TEXT,
    category TEXT, -- 'TRUST' or 'EXECUTIVE'
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Members (Devotees) Table
CREATE TABLE IF NOT EXISTS members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    membership_id TEXT UNIQUE, -- Format: OD/17/04/2026/0001
    full_name TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    state TEXT DEFAULT 'Odisha',
    district TEXT,
    block TEXT,
    pin_code TEXT,
    address TEXT,
    membership_type TEXT DEFAULT 'REGULAR', -- 'REGULAR' or 'LIFE'
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA

-- Insert Main Branches
INSERT INTO branches (name, address, phone, city, code, status) VALUES
('अयोध्या मुख्यालय (Main)', 'श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान, अयोध्या धाम', '9598023701', 'Ayodhya', 'MAIN', 'ACTIVE'),
('Kendrapara मुख्य शाखा', 'शाखा कोड: OD/17, केंद्रपाड़ा, ओड़िआ बाबा आश्रम', '6372858933', 'Kendrapara', 'OD/17', 'ACTIVE')
ON CONFLICT (code) DO NOTHING;

-- Insert Kendrapara Sub-Branches
INSERT INTO branches (name, address, phone, city, code, status) VALUES
('Patamundai NAC', 'शाखा कोड: OD/17/02', '8144151857', 'Kendrapara', 'OD/17/02', 'ACTIVE'),
('Ali Block', 'शाखा कोड: OD/17/03', '9938291635', 'Kendrapara', 'OD/17/03', 'ACTIVE'),
('Derabish Block', 'शाखा कोड: OD/17/04', '7205818302', 'Kendrapara', 'OD/17/04', 'ACTIVE'),
('Garadpur Block', 'शाखा कोड: OD/17/05', '9777473782', 'Kendrapara', 'OD/17/05', 'ACTIVE'),
('Mahakalpada Block', 'शाखा कोड: OD/17/07', '9438848850', 'Kendrapara', 'OD/17/07', 'ACTIVE'),
('Marshaghai Block', 'शाखा कोड: OD/17/08', '7894136619', 'Kendrapara', 'OD/17/08', 'ACTIVE'),
('Rajnagar Block', 'शाखा कोड: OD/17/10', '9348770533', 'Kendrapara', 'OD/17/10', 'ACTIVE')
ON CONFLICT (code) DO NOTHING;

-- Insert Other Districts (Proposed)
INSERT INTO branches (name, address, phone, city, code, status) VALUES
('Angul शाखा', 'शाखा कोड: OD/01', '9598023701', 'Angul', 'OD/01', 'PROPOSED'),
('Balangir शाखा', 'शाखा कोड: OD/02', '9598023701', 'Balangir', 'OD/02', 'PROPOSED'),
('Baleswar शाखा', 'शाखा कोड: OD/03', '9598023701', 'Baleswar', 'OD/03', 'PROPOSED'),
('Bargarh शाखा', 'शाखा कोड: OD/04', '9598023701', 'Bargarh', 'OD/04', 'PROPOSED'),
('Bhadrak शाखा', 'शाखा कोड: OD/05', '9598023701', 'Bhadrak', 'OD/05', 'PROPOSED'),
('Boudh शाखा', 'शाखा कोड: OD/06', '9598023701', 'Boudh', 'OD/06', 'PROPOSED'),
('Cuttack शाखा', 'शाखा कोड: OD/07', '9598023701', 'Cuttack', 'OD/07', 'PROPOSED'),
('Deogarh शाखा', 'शाखा कोड: OD/08', '9598023701', 'Deogarh', 'OD/08', 'PROPOSED'),
('Dhenkanal शाखा', 'शाखा कोड: OD/09', '9598023701', 'Dhenkanal', 'OD/09', 'PROPOSED'),
('Gajapati शाखा', 'शाखा कोड: OD/10', '9598023701', 'Gajapati', 'OD/10', 'PROPOSED'),
('Ganjam शाखा', 'शाखा कोड: OD/11', '9598023701', 'Ganjam', 'OD/11', 'PROPOSED'),
('Jagatsinghapur शाखा', 'शाखा कोड: OD/12', '9598023701', 'Jagatsinghapur', 'OD/12', 'PROPOSED'),
('Jajpur शाखा', 'शाखा कोड: OD/13', '9598023701', 'Jajpur', 'OD/13', 'PROPOSED'),
('Jharsuguda शाखा', 'शाखा कोड: OD/14', '9598023701', 'Jharsuguda', 'OD/14', 'PROPOSED'),
('Kalahandi शाखा', 'शाखा कोड: OD/15', '9598023701', 'Kalahandi', 'OD/15', 'PROPOSED'),
('Kandhamal शाखा', 'शाखा कोड: OD/16', '9598023701', 'Kandhamal', 'OD/16', 'PROPOSED'),
('Kendujhar शाखा', 'शाखा कोड: OD/18', '9598023701', 'Kendujhar', 'OD/18', 'PROPOSED'),
('Khordha शाखा', 'शाखा कोड: OD/19', '9598023701', 'Khordha', 'OD/19', 'PROPOSED'),
('Koraput शाखा', 'शाखा कोड: OD/20', '9598023701', 'Koraput', 'OD/20', 'PROPOSED'),
('Malkangiri शाखा', 'शाखा कोड: OD/21', '9598023701', 'Malkangiri', 'OD/21', 'PROPOSED'),
('Mayurbhanj शाखा', 'शाखा कोड: OD/22', '9598023701', 'Mayurbhanj', 'OD/22', 'PROPOSED'),
('Nabarangpur शाखा', 'शाखा कोड: OD/23', '9598023701', 'Nabarangpur', 'OD/23', 'PROPOSED'),
('Nuapada शाखा', 'शाखा कोड: OD/24', '9598023701', 'Nuapada', 'OD/24', 'PROPOSED'),
('Nayagarh शाखा', 'शाखा कोड: OD/25', '9598023701', 'Nayagarh', 'OD/25', 'PROPOSED'),
('Puri शाखा', 'शाखा कोड: OD/26', '9598023701', 'Puri', 'OD/26', 'PROPOSED'),
('Rayagada शाखा', 'शाखा कोड: OD/27', '9598023701', 'Rayagada', 'OD/27', 'PROPOSED'),
('Sambalpur शाखा', 'शाखा कोड: OD/28', '9598023701', 'Sambalpur', 'OD/28', 'PROPOSED'),
('Sonepur शाखा', 'शाखा कोड: OD/29', '9598023701', 'Sonepur', 'OD/29', 'PROPOSED'),
('Sundargarh शाखा', 'शाखा कोड: OD/30', '9598023701', 'Sundargarh', 'OD/30', 'PROPOSED')
ON CONFLICT (code) DO NOTHING;

-- Insert Membership Plans
INSERT INTO membership_plans (name, price_hindi, price_value, description, icon, sort_order) VALUES
('साधारण सदस्य', 'निःशुल्क', 0, 'डिजिटल लेजर और बेसिक सुविधाएं', 'User', 1),
('आजीवन सदस्य', '₹2100/-', 2100, 'आजीवन सदस्यता कार्ड और विशेष सुविधाएं', 'Award', 2),
('विशेष आजीवन सदस्य', '₹21000/-', 21000, 'मुख्य ट्रस्टी कमिटी में स्थान और सम्मान', 'ShieldCheck', 3)
ON CONFLICT DO NOTHING;
