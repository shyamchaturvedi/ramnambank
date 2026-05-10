-- 1. Create the enum type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ADMIN', 'DEVOTEE', 'BRANCH_MANAGER', 'VOLUNTEER');
    END IF;
END $$;

-- 2. Drop the existing default value first to avoid casting errors
ALTER TABLE public.members ALTER COLUMN role DROP DEFAULT;

-- 3. Alter the table column to use the new enum type
ALTER TABLE public.members 
ALTER COLUMN role TYPE user_role 
USING (
  CASE 
    WHEN role = 'ADMIN' THEN 'ADMIN'::user_role
    WHEN role = 'BRANCH_MANAGER' THEN 'BRANCH_MANAGER'::user_role
    WHEN role = 'VOLUNTEER' THEN 'VOLUNTEER'::user_role
    ELSE 'DEVOTEE'::user_role
  END
);

-- 4. Set the new default value (now using the enum type)
ALTER TABLE public.members 
ALTER COLUMN role SET DEFAULT 'DEVOTEE'::user_role;
