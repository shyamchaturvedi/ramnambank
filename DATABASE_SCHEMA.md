# Database Schema: Ram Nam Mahadhan Sanchay Bank

This schema is designed for **PostgreSQL (Supabase)** to handle millions of records with high efficiency and security.

## 1. Branch Management (Hierarchy)
Handles the State -> District -> Block mapping.

```sql
CREATE TYPE branch_level AS ENUM ('STATE', 'DISTRICT', 'BLOCK');

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level branch_level NOT NULL,
    parent_id UUID REFERENCES branches(id), -- Null for State, State ID for District, etc.
    code TEXT UNIQUE, -- Unique code for each branch (e.g., UP-AYO-BLK01)
    address TEXT,
    contact_no TEXT,
    admin_id UUID, -- Reference to the user managing this branch
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. User & Admin Management
Using Supabase Auth for security, with a custom profile table.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'BLOCK_ADMIN', 'VOLUNTEER')),
    branch_id UUID REFERENCES branches(id),
    mobile_no TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. Member Management
Stores details of the devotees writing Ram Nam.

```sql
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_no SERIAL, -- Auto-incrementing membership number
    full_name TEXT NOT NULL,
    is_life_member BOOLEAN DEFAULT FALSE,
    life_member_no TEXT UNIQUE, -- Unique serial number from the physical card
    mobile_no TEXT,
    address TEXT,
    po TEXT, -- Post Office
    block_id UUID REFERENCES branches(id), -- Linked to the specific Block branch
    district_id UUID REFERENCES branches(id),
    state_id UUID REFERENCES branches(id),
    pin_code TEXT,
    profile_photo_url TEXT,
    signature_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES profiles(id)
);
```

## 4. Booklet & Deposit Tracking
The core logic for tracking "Spiritual Wealth".

```sql
CREATE TABLE booklets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booklet_serial_no TEXT UNIQUE NOT NULL, -- Unique QR code/Serial on the booklet
    member_id UUID REFERENCES members(id),
    status TEXT CHECK (status IN ('AVAILABLE', 'ISSUED', 'COMPLETED', 'DEPOSITED')) DEFAULT 'AVAILABLE',
    issued_at TIMESTAMPTZ,
    issued_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) NOT NULL,
    branch_id UUID REFERENCES branches(id) NOT NULL,
    booklet_id UUID REFERENCES booklets(id) UNIQUE, -- One deposit per booklet
    ram_nam_count BIGINT NOT NULL, -- Number of Ram Nam names in the booklet (e.g., 100000)
    deposited_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID REFERENCES profiles(id),
    notes TEXT,
    audit_log JSONB -- Store snapshots of metadata for security
);
```

## 5. Global Stats (Materialized View for Performance)
To show the real-time global counter efficiently.

```sql
CREATE MATERIALIZED VIEW global_stats AS
SELECT 
    COUNT(id) as total_members,
    SUM(ram_nam_count) as total_ram_nam_deposited,
    COUNT(DISTINCT branch_id) as total_active_branches
FROM deposits;

-- Refresh this view every hour or on specific triggers
```

## 7. Membership Plans & Committees
Tables to manage dynamic content like fees and team members.

```sql
CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    amount TEXT NOT NULL,
    description TEXT,
    icon_name TEXT, -- Lucide icon identifier
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE committee_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id), -- Null for global committee
    full_name TEXT NOT NULL,
    post TEXT NOT NULL,
    mobile_no TEXT,
    category TEXT CHECK (category IN ('GOVERNING', 'EXECUTIVE', 'ADVISER')),
    sort_order INT DEFAULT 0
);
```

## 8. Security (Row Level Security - RLS)
- **State Admins:** Can view all data within their state branches.
- **Block Admins:** Can only register and view members in their specific block.
- **Super Admin:** Full access to everything.
